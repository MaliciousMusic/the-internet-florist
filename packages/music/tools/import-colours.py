"""Additional licensed percussion and field takes, without changing the committed legacy bank."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'out'/'audio-tools'))
sys.path.insert(0,str(ROOT/'out'/'reference-tools'))
import numpy as np
import soundfile as sf
import imageio_ffmpeg
REVISION='440300901dfe9275fd84e0b7763af1f8443ae62e'
CACHE=ROOT/'out'/'sample-sources'
ASSETS=ROOT/'assets'; RATE=24000
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
tree=json.loads((ROOT/'out'/'vsco-tree.json').read_text(encoding='utf-8-sig'))
paths=[entry['path'] for entry in tree['tree'] if entry['path'].endswith('.wav')]
groups={
    'recorded-claves':r'^Percussion/Claves1_Hit_v1_rr[12]_Sum.wav$',
    'recorded-tambourine':r'^Percussion/Tamb1-Hit_v1_rr[12]_Sum.wav$',
    'recorded-conga':r'^Percussion/Conga-HitN_v1_rr[12]_Sum.wav$',
    'recorded-log-drum':r'^Percussion/LogDrum(Hi|Lo)_MedM_v1_rr[12]_Sum.wav$',
    'recorded-quinto':r'^Percussion/Quinto-HitN_v1_rr[12]_Sum.wav$',
    'recorded-triangle':r'^Percussion/Triangle3-HitFM_v1_rr[12]_Sum.wav$',
    'recorded-guiro':r'^Percussion/Guiro-Hit_v1_rr[12]_Sum.wav$',
    'recorded-shaker':r'^Percussion/Tamb1-Shake_v1_rr[12]_Sum.wav$',
}
def guard():
    if sys.platform!='win32':return
    while int(subprocess.check_output(['powershell.exe','-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory'],creationflags=0x08000000).strip())*1024<=4*1024**3+64*1024**2:
        print('En attente de mémoire pour les nouvelles prises.',flush=True);time.sleep(30)
def fetch(url):
    path=CACHE/(hashlib.sha256(url.encode()).hexdigest()+'.wav')
    if not path.exists():
        with urllib.request.urlopen(url,timeout=45) as response:path.write_bytes(response.read())
    return path
records=[];payload=bytearray()
def append(identity,path,filename,page,author,license_name,start=0,seconds=3):
    guard();raw=path.read_bytes();duration=sf.info(path).duration
    start=min(start,max(0,duration-seconds))
    options={'creationflags':0x08000000} if sys.platform=='win32' else {}
    decoded=subprocess.run([ffmpeg,'-v','error','-i',str(path),'-ss',str(start),'-t',str(seconds),'-af','lowpass=f=6200,aresample=24000','-ac','1','-f','f32le','pipe:1'],capture_output=True,check=True,**options)
    signal=np.frombuffer(decoded.stdout,dtype='<f4').astype(np.float64)
    if len(signal)<100:raise ValueError('Short colour source')
    signal-=signal.mean();peak=max(float(np.max(np.abs(signal))),1e-8);rms=float(np.sqrt(np.mean(signal**2)))
    signal*=min(.72/peak,.18/max(rms,1e-8))
    fade=min(round(RATE*(.004 if identity.startswith('recorded') else .4)),len(signal)//4)
    signal[:fade]*=np.linspace(0,1,fade);signal[-fade:]*=np.linspace(1,0,fade)
    pcm=np.round(np.clip(signal,-1,1)*32767).astype('<i2').tobytes();offset=len(payload);payload.extend(pcm)
    record={'id':identity+'-'+str(sum(record['instrument']==identity for record in records)),'instrument':identity,'root':None,'velocity':.4,'offset':offset,
        'frames':len(signal),'rate':RATE,'file':filename,'source':page,'author':author,'license':license_name,'sourceSha256':hashlib.sha256(raw).hexdigest(),
        'sha256':hashlib.sha256(pcm).hexdigest(),'cutFrom':start,'seconds':len(signal)/RATE}
    records.append(record)
for identity,pattern in groups.items():
    selected=[path for path in paths if re.search(pattern,path)]
    if not selected:raise ValueError('Missing percussion source: '+identity)
    for path in selected:
        url='https://raw.githubusercontent.com/sgossner/VSCO-2-CE/'+REVISION+'/'+urllib.parse.quote(path,safe='/')
        append(identity,fetch(url),path,'https://github.com/sgossner/VSCO-2-CE','Sam Gossner, Simon Dalzell / Versilian Studios','CC0-1.0')
    print(identity,len(selected),flush=True)
field_root=CACHE/'nature-pack'/'Nature Sounds Pack'
field_groups=[('field-brook',['Stream/Stream01.wav']),
    ('field-birds',['Stream/StreamAndBirds02.wav','Stream/StreamAndBirds03.wav']),
    ('field-leaves',['Foliage/Foliage05.wav','Foliage/Foliage06.wav'])]
ambients=sorted(path for path in field_root.rglob('*.wav') if re.search('Ambient',str(path),re.I) and not re.search('storm|thunder|rain',str(path),re.I))
if not ambients:raise ValueError('No neutral field ambience')
field_groups.append(('field-forest',[path.relative_to(field_root).as_posix() for path in ambients[:2]]))
for identity,filenames in field_groups:
    for filename in filenames:
        append(identity,field_root/filename,'Nature Sounds Pack/'+filename,'https://opengameart.org/content/nature-sounds-pack','Antoine Goumain / Antoinemax','CC-BY-4.0',0,12)
    print(identity,len(filenames),flush=True)
chunks={}
for identity in dict.fromkeys(record['instrument'] for record in records):
    selected=[record for record in records if record['instrument']==identity];offset=selected[0]['offset'];size=sum(record['frames']*2 for record in selected)
    chunks[identity]={'bytes':size,'sha256':hashlib.sha256(payload[offset:offset+size]).hexdigest()}
if len(set(record['sha256'] for record in records))!=len(records):raise ValueError('Duplicate colour takes')
manifest={'version':'belai-colour-samples/1','bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest(),'instruments':chunks,'samples':records}
(ASSETS/'colours.pcm').write_bytes(payload)
(ASSETS/'colour-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(ROOT/'src'/'colour-manifest.ts').write_text('// Generated by tools/import-colours.py.\nexport const COLOUR_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+' as const;\n',encoding='utf8')
print(json.dumps({'samples':len(records),'bytes':len(payload),'sha256':manifest['sha256']}),flush=True)
