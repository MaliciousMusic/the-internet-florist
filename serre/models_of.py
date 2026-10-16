"""models_of.py sid[,sid...]: the numbers of the catalogue models (demo/src/k0.js MODELS) that use these species, for ?run=models&ns=..."""
import json, re, sys, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(R, 'demo', 'src', 'k0.js'), encoding='utf-8').read()
m = re.search(r'const MODELS=(\[.*?\]);\s*(?:const|$)', src, re.S)
models = json.loads(m.group(1))
want = set(sys.argv[1].split(','))
hits = {}
for md in models:
    for e in md.get('els', []):
        if e.get('id') in want:
            hits.setdefault(md['n'], set()).add(e['id'])
print('ns=' + ','.join(str(n) for n in sorted(hits)))
for n in sorted(hits):
    print(n, ','.join(sorted(hits[n])))
