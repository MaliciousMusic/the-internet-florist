"""Private, serial reference study: public metadata, audio descriptors, never sample import."""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT / 'out' / 'reference-tools'))
sys.path.insert(0,str(ROOT / 'out' / 'audio-tools'))
import numpy as np
RATE = 11025
HOP = 512
NFFT = 4096

def wait_memory():
    if sys.platform != 'win32':
        return
    while True:
        gc.collect()
        available = int(subprocess.check_output(['powershell.exe','-NoProfile','-Command',
            '(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory'],creationflags=0x08000000).strip()) * 1024
        if available > 4 * 1024**3 + 64 * 1024**2:
            return
        print('En attente de mémoire pour l’analyse musicale.',flush=True)
        time.sleep(30)

def analyze(signal,rate=RATE):
    """Estimate pulse, pitch-class distribution and form; confidence is not emotional certainty."""
    signal = np.asarray(signal,dtype=np.float32)
    if rate != RATE or len(signal) < NFFT:
        raise ValueError('Expected mono 11025 Hz audio longer than one analysis frame')
    if not np.isfinite(signal).all():
        raise ValueError('Nonfinite source audio')
    frequencies = np.fft.rfftfreq(NFFT,1 / RATE)
    valid = frequencies > 45
    midi = np.zeros_like(frequencies)
    midi[valid] = 69 + 12 * np.log2(frequencies[valid] / 440)
    pitch_classes = np.round(midi).astype(int) % 12
    pitched = (frequencies >= 70) & (frequencies <= 3500)
    window = np.hanning(NFFT).astype(np.float32)
    count = 1 + (len(signal) - NFFT) // HOP
    rms = np.empty(count); centroid = np.empty(count); flatness = np.empty(count)
    onset = np.empty(count); chroma = np.zeros((count,12)); bands = np.zeros((count,3))
    previous = np.zeros(len(frequencies))
    for start in range(0,count,64):
        length = min(64,count - start)
        frames = np.stack([signal[(start+i)*HOP:(start+i)*HOP+NFFT] for i in range(length)])
        magnitude = np.abs(np.fft.rfft(frames * window,axis=1))
        power = magnitude**2
        rms[start:start+length] = np.sqrt(np.mean(frames**2,axis=1))
        centroid[start:start+length] = (power * frequencies).sum(axis=1) / np.maximum(power.sum(axis=1),1e-12)
        flatness[start:start+length] = np.exp(np.mean(np.log(power[:,valid]+1e-10),axis=1)) / np.maximum(np.mean(power[:,valid],axis=1),1e-10)
        compressed = np.log1p(magnitude * 20)
        differences = np.maximum(0,compressed - np.vstack([previous,compressed[:-1]]))
        onset[start:start+length] = np.mean(differences,axis=1)
        previous = compressed[-1]
        for pc in range(12):
            chroma[start:start+length,pc] = np.sum(power[:,pitched & (pitch_classes == pc)]**.5,axis=1)
        for band,(low,high) in enumerate([(45,250),(250,1800),(1800,5500)]):
            bands[start:start+length,band] = power[:,(frequencies >= low) & (frequencies < high)].sum(axis=1)
    peak = float(np.max(np.abs(signal)))
    pulse = onset - np.mean(onset)
    length = 1 << (2 * count - 1).bit_length()
    spectrum = np.fft.rfft(pulse,n=length)
    correlation = np.fft.irfft(spectrum * np.conj(spectrum),n=length)[:count]
    correlation /= np.maximum(1,count - np.arange(count))
    frame_rate = RATE / HOP
    lags = np.arange(max(1,int(np.ceil(frame_rate * 60 / 180))),min(count-2,int(frame_rate * 60 / 40))+1)
    local = [int(lag) for lag in lags if lag > 0 and lag+1 < count and correlation[lag] >= correlation[lag-1] and correlation[lag] >= correlation[lag+1]]
    ranked = sorted(local,key=lambda lag:correlation[lag],reverse=True)[:4]
    confidence = float(np.clip(correlation[ranked[0]] / max(correlation[0],1e-12),0,1)) if ranked and peak > 1e-5 else 0
    tempo = [{'bpm':round(60 * frame_rate / lag,1),'confidence':round(float(np.clip(correlation[lag] / max(correlation[0],1e-12),0,1)),3)} for lag in ranked] if peak > 1e-5 else []
    average = chroma.mean(axis=0); average /= max(float(average.sum()),1e-12)
    templates = {'majeur':[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],
        'mineur':[6.33,2.68,3.52,5.38,2.6,3.53,2.54,4.75,3.98,2.69,3.34,3.17]}
    keys = []
    if np.std(average) > 1e-6 and peak > 1e-5:
        for mode,template in templates.items():
            for tonic in range(12):
                keys.append((float(np.corrcoef(average,np.roll(template,tonic))[0,1]),tonic,mode))
    keys.sort(reverse=True)
    names = ['Do','Do♯','Ré','Mi♭','Mi','Fa','Fa♯','Sol','La♭','La','Si♭','Si']
    # Coarse descriptors deliberately avoid exporting an automatically transcribed copyrighted score.
    step = max(1,round(frame_rate * 2))
    timeline = []
    for start in range(0,count,step):
        stop = min(count,start+step)
        profile = chroma[start:stop].mean(axis=0); profile /= max(float(profile.sum()),1e-12)
        timeline.append({'at':round(start / frame_rate,2),'rmsDb':round(float(20*np.log10(max(1e-9,np.mean(rms[start:stop])))),2),
            'centroidHz':round(float(np.mean(centroid[start:stop])),1),'onset':round(float(np.mean(onset[start:stop])),4),
            'pitchClasses':[round(float(value),4) for value in profile]})
    vectors = np.array([row['pitchClasses']+[row['rmsDb']/60,row['centroidHz']/5500,row['onset']] for row in timeline])
    novelty = np.linalg.norm(vectors[1:]-vectors[:-1],axis=1) if len(vectors)>1 else np.array([])
    boundaries = []
    threshold = float(np.percentile(novelty,85)) if len(novelty) else 0
    for index in sorted(range(len(novelty)),key=lambda index:novelty[index],reverse=True):
        at = timeline[index+1]['at']
        if novelty[index] > max(.08,threshold) and at > 8 and at < len(signal)/rate - 8 and all(abs(at-other)>8 for other in boundaries):
            boundaries.append(at)
        if len(boundaries)>=8: break
    audible = rms[rms > 1e-5]
    db = 20 * np.log10(np.maximum(audible,1e-9))
    total_bands = bands.sum(axis=0); total_bands /= max(float(total_bands.sum()),1e-12)
    return {'method':'belai-audio-descriptors/1','seconds':round(len(signal)/rate,3),'analysisRate':rate,'peak':round(peak,4),
        'pulseCandidates':tempo,'pulseConfidence':round(confidence,3),'keyCandidates':[{'key':names[tonic]+' '+mode,'correlation':round(score,3)} for score,tonic,mode in keys[:3]],
        'pitchClasses':[round(float(value),4) for value in average],
        'dynamicsDb':round(float(np.percentile(db,90)-np.percentile(db,10)),2) if len(db) else 0,
        'centroidHz':round(float(np.median(centroid)),1),'flatness':round(float(np.median(flatness)),4),
        'bandEnergy':[round(float(value),4) for value in total_bands],'sectionSuggestions':sorted(boundaries),'timeline':timeline,
        'limits':['Tempo peut être doublé ou divisé ; métrique et instruments ne sont pas identifiés automatiquement.',
            'Les repères de forme sont des propositions ; ces mesures ne reconnaissent pas les émotions.']}

class Logger:
    def debug(self,message): pass
    def warning(self,message): pass
    def error(self,message): pass

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--all',action='store_true',help='Analyze the full referenced playlist serially, including non-selected music')
    parser.add_argument('--retry-unavailable',action='store_true',help='Retry only unavailable entries in the existing report')
    parser.add_argument('--recompute',action='store_true',help='Recompute descriptors from the private cache, without network access')
    parser.add_argument('--format',default='bestaudio/best',help='Public audio format selection passed to yt-dlp')
    parser.add_argument('--file',type=Path,help='Analyze a local recording without a network request')
    parser.add_argument('--output',type=Path,default=ROOT/'out'/'reference-analysis')
    args=parser.parse_args(); args.output.mkdir(parents=True,exist_ok=True)
    import imageio_ffmpeg
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    def decode(path):
        flags={'creationflags':0x08000000} if sys.platform=='win32' else {}
        result=subprocess.run([ffmpeg,'-v','error','-i',str(path),'-t','900','-ac','1','-ar',str(RATE),'-f','f32le','pipe:1'],capture_output=True,check=True,**flags)
        return np.frombuffer(result.stdout,dtype='<f4')
    if args.file:
        wait_memory(); result=analyze(decode(args.file)); result['sourceSha256']=hashlib.sha256(args.file.read_bytes()).hexdigest()
        (args.output/(args.file.stem+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8'); return
    import yt_dlp
    registry=json.loads((ROOT/'assets'/'references.json').read_text(encoding='utf8'))
    selected={item['id']:item['title'] for item in registry['selected']}
    options={'quiet':True,'logger':Logger(),'socket_timeout':20,'retries':1,'extractor_retries':0,'js_runtimes':{'node':{}},'noplaylist':True}
    inventory=[]
    if args.retry_unavailable or args.recompute:
        inventory=json.loads((args.output/'inventory.json').read_text(encoding='utf8'))
    else:
        with yt_dlp.YoutubeDL({**options,'extract_flat':True,'noplaylist':False}) as downloader:
            try:
                playlist=downloader.extract_info(registry['playlist'],download=False)
                inventory=[{key:item.get(key) for key in ['id','title','duration']} for item in playlist.get('entries',[]) if item]
            except Exception as error: print('Inventaire distant indisponible : '+str(error).splitlines()[0],flush=True)
    (args.output/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf8')
    targets=inventory if args.all and inventory else registry['selected']
    cache=ROOT/'out'/'reference-audio'; cache.mkdir(exist_ok=True)
    report={'version':'belai-reference-analysis/1','playlist':registry['playlist'],'selectionSource':registry['selectionSource'],'inventoryCount':len(inventory),'items':[]}
    if args.retry_unavailable or args.recompute:
        report=json.loads((args.output/'index.json').read_text(encoding='utf8'))
        targets=[item for item in report['items'] if item['status']==('analyzed' if args.recompute else 'unavailable')]
    for item in targets:
        wait_memory(); identity=item['id']; record={'id':identity,'url':'https://www.youtube.com/watch?v='+identity,'title':item['title'],'selected':identity in selected}
        try:
            if args.recompute:
                candidates=[path for path in cache.glob(identity+'.*') if path.is_file() and not path.name.endswith(('.part','.ytdl'))]
                path=next(path for path in candidates if hashlib.sha256(path.read_bytes()).hexdigest()==item['audioSha256'])
                info={'title':item['title'],'duration':item['seconds'],'channel':item.get('channel')}
            else:
                with yt_dlp.YoutubeDL({**options,'format':args.format,'outtmpl':str(cache/(identity+'.%(ext)s')),'noprogress':True,'overwrites':False}) as downloader:
                    info=downloader.extract_info(record['url'],download=True)
                    path=Path(downloader.prepare_filename(info))
            record.update({'title':info.get('title',record['title']),'seconds':info.get('duration'),'channel':info.get('channel'),'status':'analyzed'})
            record['audioSha256']=hashlib.sha256(path.read_bytes()).hexdigest()
            record['analysis']=analyze(decode(path))
        except Exception as error:
            record.update({'status':'unavailable','reason':str(error).splitlines()[0][:300]})
        if args.retry_unavailable or args.recompute:
            report['items']=[record if previous['id']==identity else previous for previous in report['items']]
        else: report['items'].append(record)
        (args.output/'index.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
        print(json.dumps({key:record.get(key) for key in ['id','title','seconds','status']},ensure_ascii=True),flush=True)
    print(json.dumps({'inventory':len(inventory),'analyzed':sum(item['status']=='analyzed' for item in report['items']),'selected':sum(item['selected'] for item in report['items'])}),flush=True)
    compact={key:value for key,value in report.items() if key!='items'}
    compact['analyzedCount']=sum(item['status']=='analyzed' for item in report['items'])
    compact['selectedAnalyzedCount']=sum(item['selected'] and item['status']=='analyzed' for item in report['items'])
    compact['items']=[]
    for item in report['items']:
        row={key:value for key,value in item.items() if key not in ['reason','analysis']}
        if item['status']=='analyzed':row['analysis']={key:value for key,value in item['analysis'].items() if key!='timeline'}
        else:row['reason']='Accès audio public indisponible (HTTP 403).' if '403' in item.get('reason','') else 'Analyse ou accès public indisponible ; détails dans le rapport privé.'
        compact['items'].append(row)
    (ROOT/'assets'/'reference-summary.json').write_text(json.dumps(compact,ensure_ascii=False,indent=2)+'\n',encoding='utf8')

if __name__=='__main__': main()
