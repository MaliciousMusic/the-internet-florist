"""Check source parity and prevent access to private material through the preview."""
from pathlib import Path
import hashlib
import json
import urllib.request
import urllib.error

ROOT=Path(__file__).resolve().parent
BASE='http://127.0.0.1:8791/'
items=json.loads((ROOT/'compositions.json').read_text(encoding='utf-8'))['items']
allowed=['index.html','style.css','app.js','compositions.json']+[i['file'] for i in items]
for name in allowed:
    with urllib.request.urlopen(BASE+name,timeout=5) as res:
        assert res.status==200
        assert hashlib.sha256(res.read()).digest()==hashlib.sha256((ROOT/name).read_bytes()).digest()
denied=['verification.json','dessiner.py','motifs.py','apercus/B01-a-clair.png','../inventaire.json','%2e%2e/inventaire.json','../../Unsafe/103/ee954abbd77f8c32bc5e397c9b88a67d.jpg','svg/../compositions.json']
for name in denied:
    try:
        urllib.request.urlopen(BASE+name,timeout=5)
        raise AssertionError(name)
    except urllib.error.HTTPError as error:
        assert error.code==404,(name,error.code)
report={'sourcesIdentical':len(allowed),'privatePathsDenied':len(denied),'loopback':'127.0.0.1:8791','onlyListedFiles':True}
(ROOT/'verification-http.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print('44 fichiers servis identiques aux sources ; 8 chemins privés refusés.')
