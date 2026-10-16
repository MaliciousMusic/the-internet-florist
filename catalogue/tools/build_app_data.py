# -*- coding: utf-8 -*-
"""Compile catalogue + recettes into the app's data chunk (k0.js).

Reads catalogue/catalogue.json, catalogue/recettes/fleurs_*.json and bouquets_*.json.
Entries without a recipe yet get a fallback recipe guessed from category/role, so the app always builds.
Usage: python build_app_data.py <output k0.js path>
"""
import glob, json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.load(open(os.path.join(BASE, 'catalogue.json'), encoding='utf-8'))
recs = {}
for fp in sorted(glob.glob(os.path.join(BASE, 'recettes', 'fleurs_*.json'))):
    try:
        for r in json.load(open(fp, encoding='utf-8')):
            if isinstance(r, dict) and r.get('id'):
                recs[r['id']] = r
    except Exception as e:  # a batch still being written
        print('skip', fp, e)
# species seen in the reference bouquets but missing from the herbier: catalogue entry + recipe in one place
fx = os.path.join(BASE, 'recettes', 'extras.json')
if os.path.exists(fx):
    for x in json.load(open(fx, encoding='utf-8')):
        r = dict(x.pop('recette'), id=x['id'])
        recs[x['id']] = r
        cat.append(x)
models = []
for fp in sorted(glob.glob(os.path.join(BASE, 'recettes', 'bouquets_*.json'))):
    try:
        models += [m for m in json.load(open(fp, encoding='utf-8')) if isinstance(m, dict) and m.get('els')]
    except Exception as e:
        print('skip', fp, e)

# meanings, occasions and market prices per stem (sens_prix_*.json); missing entries fall back on the price band of the herbier
sp = {}
for fp in sorted(glob.glob(os.path.join(BASE, 'recettes', 'sens_prix_*.json'))):
    try:
        for x in json.load(open(fp, encoding='utf-8')):
            if isinstance(x, dict) and x.get('id'):
                sp[x['id']] = x
    except Exception as e:  # a batch still being written
        print('skip', fp, e)
BAND = {'€': 260, '€€': 450, '€€€': 800, '€€€€': 1500}

HEX = re.compile(r'^#[0-9a-fA-F]{6}$')

def fallback(e):
    role, catg = e.get('role'), e.get('categorie')
    if role == 'feuillage':
        return {'a': 'foliage', 'cm': 8, 'cols': ['#3e6a3a'], 'p': {'leaf': {'shape': 'elliptic', 'cm': 8}, 'arr': 'alternate', 'n': 10, 'len': 45}}
    if role == 'branche':
        return {'a': 'line', 'cm': 70, 'cols': ['#5a4030'], 'p': {'type': 'branch', 'len': 70}}
    if role == 'baie':
        return {'a': 'berries', 'cm': 1, 'cols': ['#9a2030'], 'p': {'type': 'cluster', 'n': 14}}
    if role == 'graminee':
        return {'a': 'line', 'cm': 60, 'cols': ['#c8b48a'], 'p': {'type': 'plume', 'len': 60}}
    if catg == 'Accessoires & matières':
        return {'a': 'accessory', 'cm': 40, 'cols': ['#8e1430'], 'p': {'kind': 'wire'}}
    return {'a': 'radial', 'cm': 6, 'cols': ['#e8a0b0'], 'p': {'n': 10, 'w': .3}}

def short(name):
    n = re.split(r'\s*[(,;/]', name)[0].strip()
    return n[:34]

meta, rlist = [], []
for e in cat:
    r = recs.get(e['id']) or dict(fallback(e), id=e['id'], fb=1)
    r['cols'] = [c.lower() for c in (r.get('cols') or []) if isinstance(c, str) and HEX.match(c)][:6] or ['#e8a0b0']
    s = sp.get(e['id']) or {}
    if isinstance(s.get('prix'), (int, float)) and s['prix'] > 0:
        r['price'] = int(round(s['prix'] * 100))
    else:
        r['price'] = 300 if e.get('role') == 'feuillage' else BAND.get(e.get('gamme_prix'), 450)
    rlist.append(r)
    mt = {'id': e['id'], 'n': short(e.get('nom_fr') or e['id']), 'l': e.get('latin') or '', 'c': e.get('categorie') or '', 'r': e.get('role') or ''}
    if s.get('sens'):
        mt.update(s=s['sens'], o=s.get('occ') or [], e=s.get('eviter') or [])
        sc = {k: v for k, v in (s.get('sens_couleur') or {}).items() if v}
        if sc:
            mt['sc'] = sc
    meta.append(mt)

ids = {e['id'] for e in cat}
good = []
for m in models:
    m['els'] = [el for el in m['els'] if el.get('id') in ids and isinstance(el.get('n'), (int, float)) and el['n'] > 0]
    if m['els']:
        good.append(m)

out = sys.argv[1] if len(sys.argv) > 1 else 'k0.js'
with open(out, 'w', encoding='utf-8') as fh:
    fh.write('\n/* ================= Données compilées : catalogue, recettes de dessin, bouquets modèles ================= */\n')
    fh.write('const CATMETA=' + json.dumps(meta, ensure_ascii=False, separators=(',', ':')) + ';\n')
    fh.write('const RECIPES=' + json.dumps(rlist, ensure_ascii=False, separators=(',', ':')) + ';\n')
    fh.write('const MODELS=' + json.dumps(good, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(f'{len(rlist)} recettes ({sum(1 for r in rlist if not r.get("fb"))} réelles), {sum(1 for m in meta if m.get("s"))} sens et prix, {len(good)} bouquets -> {out}')
