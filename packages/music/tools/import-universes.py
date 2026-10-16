"""Import a pinned, licensed cross-section of VCSL without touching earlier banks."""
import hashlib
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'out/audio-tools'))
sys.path.insert(0, str(ROOT / 'out/reference-tools'))
import numpy as np
import imageio_ffmpeg

RATE = 24000
CACHE = ROOT / 'out/universe-sources'
CACHE.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / 'assets'
tree = json.loads((ROOT / 'out/vcsl-tree.json').read_text(encoding='utf-8-sig'))
REVISION = tree['sha']
BASE = 'https://raw.githubusercontent.com/sgossner/VCSL/' + REVISION + '/'

def fetch(filename):
    url = BASE + urllib.parse.quote(filename, safe='/')
    target = CACHE / hashlib.sha256(url.encode()).hexdigest()
    if not target.exists():
        for attempt in range(3):
            try:
                with urllib.request.urlopen(url, timeout=45) as response:
                    target.write_bytes(response.read())
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(2)
    return target

def guard():
    if sys.platform != 'win32':
        return
    while int(subprocess.check_output(['powershell.exe', '-NoProfile', '-Command',
            '(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory'], creationflags=0x08000000).strip()) * 1024 <= 4 * 1024**3 + 64 * 1024**2:
        print('Import en attente de mémoire.', flush=True)
        time.sleep(30)

license_text = fetch('LICENSE').read_text(encoding='utf-8')
if 'CC0' not in license_text and 'Creative Commons' not in license_text:
    raise ValueError('Unrecognized upstream license')
(ASSETS / 'LICENSE-VCSL.txt').write_text(license_text, encoding='utf-8')
groups = {}
for entry in tree['tree']:
    filename = entry['path']
    if not filename.lower().endswith('.wav') or 'Legacy' in filename or '/Siren/' in filename:
        continue
    family = '/'.join(filename.split('/')[:3])
    groups.setdefault(family, []).append(filename)

records = []
families = []
payload = bytearray()
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
for family, filenames in sorted(groups.items()):
    guard()
    label = family.split('/')[-1]
    identity = 'vcsl-' + re.sub(r'[^a-z0-9]+', '-', label.lower()).strip('-')
    pitched = family.startswith(('Aerophones/', 'Chordophones/', 'Electrophones/')) or any(word in label for word in ['Kalimba', 'Mbira', 'Nyunga', 'Balafon', 'Glockenspiel', 'Marimba', 'Wine Glass', 'Timpani', 'Hand Chimes', 'Steelpan'])
    candidates = []
    for filename in filenames:
        match = re.search(r'(?:_|-)([A-G])([#b]?)(-?\d)(?:_|\.|-)', filename)
        root = (int(match[3]) + 1) * 12 + {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}[match[1]] + (1 if match[2]=='#' else -1 if match[2]=='b' else 0) if match else None
        if pitched and root is None:
            continue
        candidates.append((filename, root))
    if not candidates:
        # Unlabelled whistles and struck objects remain honest unpitched takes.
        pitched = False
        candidates = [(filename, None) for filename in filenames]
    chosen = []
    for target in ([48,60,72,84] if pitched else range(4)):
        available = [pair for pair in candidates if pair not in chosen]
        if not available:
            break
        selected = min(available, key=lambda pair: (abs(pair[1]-target) if pair[1] is not None else abs(filenames.index(pair[0])-target), bool(re.search(r'(vl|_v)[3-9]',pair[0])), pair[0]))
        chosen.append(selected)
    for filename, root in chosen:
        source = fetch(filename)
        decoded = subprocess.run([ffmpeg, '-v', 'error', '-i', str(source), '-t', '5', '-af',
            'lowpass=f=8500,aresample=24000', '-ac', '1', '-f', 'f32le', 'pipe:1'], capture_output=True, check=True,
            **({'creationflags':0x08000000} if sys.platform=='win32' else {}))
        signal = np.frombuffer(decoded.stdout, dtype='<f4').astype(np.float64)
        if len(signal)<100 or not np.isfinite(signal).all():
            raise ValueError('Invalid source: '+filename)
        signal -= signal.mean()
        signal *= min(.72 / max(float(np.max(np.abs(signal))),1e-8), .16 / max(float(np.sqrt(np.mean(signal**2))),1e-8))
        fade = min(120,len(signal)//8)
        signal[:fade] *= np.linspace(0,1,fade)
        signal[-fade:] *= np.linspace(1,0,fade)
        pcm = np.round(np.clip(signal,-1,1)*32767).astype('<i2').tobytes()
        records.append({'id':identity+'-'+str(len(chosen))+'-'+str(len(records)), 'instrument':identity,
            'root':root, 'velocity':.4, 'offset':len(payload), 'frames':len(signal), 'rate':RATE,
            'file':filename, 'source':'https://github.com/sgossner/VCSL/tree/'+REVISION,
            'author':'Versilian Studios / VCSL contributors', 'license':'CC0-1.0',
            'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'sha256':hashlib.sha256(pcm).hexdigest(),
            'seconds':len(signal)/RATE, 'rootSource':'VCSL note-labelled filename (scientific pitch C4=60)' if root is not None else 'unpitched'})
        payload.extend(pcm)
    families.append({'id':identity,'name':label,'group':family.split('/')[0], 'pitched':pitched})
    print(identity, len(chosen), flush=True)
chunks = {}
for family in families:
    selected = [record for record in records if record['instrument']==family['id']]
    begin = selected[0]['offset']
    size = sum(record['frames']*2 for record in selected)
    chunks[family['id']] = {'bytes':size,'sha256':hashlib.sha256(payload[begin:begin+size]).hexdigest()}
manifest = {'version':'belai-universes/1','revision':REVISION,'rate':RATE,'bytes':len(payload),
    'sha256':hashlib.sha256(payload).hexdigest(),'instruments':chunks,'families':families,'samples':records,
    'transforms':'mono, lowpass 8500 Hz, resample 24000 Hz, DC removal, bounded peak/RMS, 5 ms edge fades; maximum 5 seconds'}
(ASSETS / 'universes.pcm').write_bytes(payload)
(ASSETS / 'universe-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT / 'src/universe-manifest.ts').write_text('// Generated by tools/import-universes.py.\nexport const UNIVERSE_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+' as const;\n',encoding='utf-8')
print(json.dumps({'families':len(families),'samples':len(records),'bytes':len(payload),'sha256':manifest['sha256']}),flush=True)
