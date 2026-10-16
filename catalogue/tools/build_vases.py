# -*- coding: utf-8 -*-
"""Vessels measured on the reference photos (catalogue/vases/refs_*.json) -> app data v0.js.

Every size is converted from cm to drawing units (UPC = 6.5 units per cm). Texture parameters
are read from the measurers' notes and set here by hand, vessel by vessel.
Usage: python build_vases.py <out.js>
"""
import json, os, sys, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'vases')
UPC = 6.5
OUT = sys.argv[1] if len(sys.argv) > 1 else 'v0.js'

specs = []
for g in 'ABCD':
    specs += json.load(open(os.path.join(ROOT, f'refs_{g}.json'), encoding='utf-8'))
by = {s['id']: s for s in specs}

# shop families (the chooser groups vessels by these)
FAM = {
    'coupe': ['coupe-pied-rosee', 'coupe-pied-sable', 'coupe-pied-blanche', 'coupe-pied-noire', 'coupe-pied-blanche-mate', 'compotier-noir-laque',
              'coupe-cobalt-mouchetee', 'coupe-medicis-anses', 'coupelle-argentee', 'coupe-basse-anthracite', 'coupelle-laiton-console'],
    'boule': ['boule-vert-sapin', 'boule-aubergine', 'boule-perlee-porcelaine', 'boule-cotelee-bleue', 'boule-inox-brossee', 'boule-verre-bouteille',
              'bulbe-pied-sable', 'pot-boule-blanc-perle', 'pot-agate-rose', 'pot-shino-marbre', 'petite-boule-taupe', 'jarre-gres-chamotte'],
    'vase': ['vase-ovoide-chocolat', 'vase-conique-blanc', 'bouteille-verre-fume', 'ovoide-verre-glacier', 'balustre-argent-patine', 'balustre-email-reticule',
             'soliflore-balustre-noir', 'coupe-pied-blanche-ciselee', 'colonne-blanche'],
    'cylindre': ['cylindre-verre-clair', 'cylindre-verre-bouquet', 'cylindre-chrome', 'cylindre-inox-miroir', 'cylindre-chinoiserie', 'tube-acier-disque'],
    'calice': ['calice-mouchete', 'calice-celadon-pans', 'calice-etain', 'calice-souffle-col-tube', 'coupe-cone-noire', 'urne-sablier-noire', 'urne-ardoise-bleutee', 'urne-medicis-noire'],
    'sculpture': ['vase-tete-veine-sable', 'vase-coeur-anthracite', 'suiban-ovale-peint', 'suiban-lobe-rose'],
    'pique': ['kenzan-laiton-rond', 'pique-fleurs-laiton'],
}
FAMOF = {i: f for f, L in FAM.items() for i in L}

# every vessel is included in the bouquet's price (decided 2026-10-03); these were the shop estimates, kept for reference only
PRICE = {'kenzan-laiton-rond': 89, 'vase-tete-veine-sable': 249, 'vase-coeur-anthracite': 229, 'urne-medicis-noire': 249, 'boule-verre-bouteille': 189,
         'suiban-ovale-peint': 139, 'calice-souffle-col-tube': 119, 'coupelle-laiton-console': 59}

# texture parameters, from the notes
TP = {
    'kenzan-laiton-rond': {'kz': {'pin': '#c8b48a', 'tip': '#f3eace', 'base': '#b9c0c8', 'rows': 9}},
    'pique-fleurs-laiton': {'kz': {'pin': '#c9b27a', 'tip': '#f1e2b0', 'base': '#9fa3a6', 'rows': 11}},
    'suiban-ovale-peint': {'paint': 'suiban'},
    'vase-tete-veine-sable': {'veins': {'n': 16, 'c': '#8a6a48', 'l': '#d8c6a6', 'a': -32, 'w': [1.2, 5], 'o': .5}, 'face': 1},
    'coupe-pied-sable': {'speck': {'n': 160, 'c': ['#8a7458', '#6e5a42', '#b8a07e'], 'r': [.05, .13], 'o': .5}},
    'boule-vert-sapin': {'foot': {'h': .8, 'c': '#5a4334'}},
    'vase-coeur-anthracite': {'cells': {'n': 24, 'dark': '#06080a', 'lit': '#7d8999', 'edge': '#9aa6b2', 'light': [.62, -.55]}},
    'urne-medicis-noire': {'facets': 8, 'lobes': {'n': 8, 'y0': 6.7, 'y1': 11.0, 'd': .55}, 'beadcol': {'y0': 7.1, 'y1': 10.6, 'n': 5}},
    'coupe-cobalt-mouchetee': {'dash': {'n': 340, 'c': ['#ffffff', '#d3dcf4', '#a9bcef'], 'l': [.3, 1.5], 'w': [.1, .2]}},
    'balustre-argent-patine': {'patina': {'c': '#6f6247', 'n': 7}, 'wave': {'n': 6, 'a': .3}},
    'bulbe-pied-sable': {'speck': {'n': 260, 'c': ['#6b5e52', '#4e4339', '#8a7a68'], 'r': [.04, .1], 'o': .8}},
    'calice-celadon-pans': {'facets': 8, 'edges': '#e9eee9', 'beadrow': [{'h': .35, 'r': .1, 'n': 34, 'c': '#f4f6f2'}]},
    'pot-agate-rose': {'agate': {'c': ['#8a6a5a', '#4e3328', '#efe4d8', '#a88a78', '#6a4a3a'], 'n': 22}},
    'boule-perlee-porcelaine': {'beadrow': [{'h': 'lip', 'r': .14, 'n': 46, 'c': '#f6f5f1'}, {'h': .45, 'r': .15, 'n': 44, 'c': '#f6f5f1'}]},
    'cylindre-chinoiserie': {'china': {'c': '#2f4a8a', 'n': 16}},
    'ovoide-verre-glacier': {'grad': [[0, '#0f4080'], [1.0, '#27598f'], [2.0, '#4f7aa6'], [4.0, '#7c93a2'], [6.0, '#bcd0e4'], [99, '#bcd0e4']]},
    'pot-shino-marbre': {'drips': {'y0': 1.6, 'y1': 2.2, 'c': '#efe6dc', 'n': 15, 'l': [.5, 1.5]}, 'toast': {'c': '#8a4f36', 'y0': 3.2}, 'speck': {'n': 10, 'c': ['#3a2418'], 'r': [.1, .2], 'o': .9, 'band': [1.5, 2.3]}},
    'balustre-email-reticule': {'cells2': {'n': 420, 'c': '#b48a3c', 'rim': '#3a2812', 'rust': '#8a4a22', 'olive': '#403a12'}},
    'coupe-medicis-anses': {'lobes': {'n': 16, 'y0': 3.0, 'y1': 4.6, 'd': .45}, 'squarefoot': 1.4},
    'calice-mouchete': {'speck': {'n': 300, 'c': ['#1e1c1c', '#1e1c1c', '#8a8686'], 'r': [.035, .1], 'o': .95, 'blots': 6}},
    'suiban-lobe-rose': {'lobes': {'n': 8, 'y0': 1.5, 'y1': 9.4, 'd': .6}, 'rimwash': {'c': '#b9776c'}},
    'boule-inox-brossee': {'brush': {'n': 90}},
    'calice-souffle-col-tube': {'bubble': {'h': 24.0, 'r': .45}},
    'jarre-gres-chamotte': {'speck': {'n': 260, 'c': ['#4a2a18', '#4a2a18', '#d9b48c'], 'r': [.05, .2], 'o': .7, 'blots': 14}, 'rings': {'step': 1.7, 'ridge': 3.2}},
    'boule-cotelee-bleue': {'lobes': {'n': 7, 'y0': 0, 'y1': 23.0, 'd': .5}, 'lines': {'c': '#f1f3f5', 'w': .35}, 'speck': {'n': 300, 'c': ['#f1f3f5', '#c9d6f0', '#2f4f9a'], 'r': [.05, .14], 'o': .55}},
    'coupe-pied-blanche-ciselee': {'dimples': {'around': 27, 'rows': 23}},
    'kenzan': {},
}

# a vessel for the reference whose container is hidden (console in marble and brass): a low brass bowl
EXTRA = [{
    'id': 'coupelle-laiton-console', 'refs': [69], 'n': 'Coupelle en laiton', 'm': 'laiton poli', 'family': 'coupe', 'shape': 'lathe', 'h_cm': 5.0,
    'prof': [[0, 4.2], [.4, 4.6], [.6, 4.4], [1.0, 5.6], [2.2, 7.4], [3.6, 8.6], [4.6, 9.1], [5.0, 9.2]], 'mouth_cm': 8.7, 'lip': 'rolled', 'lip_cm': .45,
    'mat': 'metal', 'finish': 'polished', 'col': '#c3a35c', 'col2': '#7a5f2a', 'tex': [], 'handles': None,
    'stand': {'type': 'console', 'w_cm': 90, 'h_cm': 80, 'col': '#e4e0d9', 'mat': 'marbre blanc et laiton'}, 'surface': 'marbre', 'glass': None, 'outline': None,
    'price_eur': 59, 'why': 'La coupelle basse en laiton des consoles de marbre : elle disparaît sous un nuage de feuillages.', 'details': ''}]


def u(x):
    return round(x * UPC, 1)


def stand_of(s):
    if not s:
        return None
    t, notes, mat = s.get('type'), (s.get('notes') or '') + ' ' + (s.get('mat') or ''), (s.get('mat') or '').lower()
    low = notes.lower()
    if 'livre' in mat:
        k = 'books'
    elif t == 'stool':
        k = 'stool'
    elif t == 'stand' and ('huaji' in low or 'chinois' in low):
        k = 'huaji'
    elif t in ('counter', 'console'):
        k = 'slab'
    elif t == 'column' and re.search(r'cylindr|round|guéridon|gueridon|tambour', low) and not re.search(r'square|carr', low):
        k = 'drum'
    elif t == 'stand':
        k = 'drum'
    elif t == 'disc':
        k = 'drum'
    else:
        k = 'box'
    m = ('platre' if 'plâtre' in mat else 'miroir' if 'miroir' in mat else 'beton' if 'béton' in mat or 'concrete' in low else 'brule' if 'brûlé' in mat or 'shou sugi' in low or 'charred' in low
         else 'serpentine' if 'serpentine' in mat else 'marbre' if 'marbre' in mat else 'inox' if 'inox' in mat else 'bois' if ('bois' in mat or 'chêne' in mat or 'oak' in low) and not re.search(r'laqu|peint|painted|lacquer', mat + low[:80]) else 'laque')
    out = {'k': k, 'w': u(s.get('w_cm') or 30), 'h': u(s.get('h_cm') or 40), 'c': s.get('col') or '#e6e4df', 'm': m}
    if re.search(r'reeded|cannel|flute', low):
        out['fl'] = 1
    if 'laiton' in mat or 'brass' in low:
        out['brass'] = 1
    if k == 'slab' and re.search(r'ovale|racetrack|rounded end|goutte', low):
        out['round'] = 1
    return out


def outline_of(s):
    o = s.get('outline')
    if not o or not isinstance(o, dict) or 'pts' not in o:
        return None
    pts = [[u(x), u(h)] for x, h in o['pts']]
    m = o.get('mouth') or [-s['mouth_cm'], s['mouth_cm'], s['h_cm']]
    return {'pts': pts, 'mouth': [u(m[0]), u(m[1]), u(m[2])], 'd': u(o.get('d_cm') or s['h_cm'])}


def env_of(ol, h):
    """the widest half-width of an outline at each height (for the composer's collision checks)"""
    pts = ol['pts']
    out = []
    for i in range(13):
        y = h * i / 12
        xs = []
        for a, b in zip(pts, pts[1:] + pts[:1]):
            if (a[1] - y) * (b[1] - y) <= 0 and a[1] != b[1]:
                xs.append(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]))
        out.append([round(y, 1), round(max([abs(x) for x in xs] or [0]), 1)])
    return out


WHY = {'calice-souffle-col-tube': 'Un calice de verre soufflé à long col, entre cabinet de curiosités et vase d’apothicaire.'}


def conv(s):
    i = s['id']
    tp = TP.get(i, {})
    shape = s.get('shape') or 'lathe'
    v = {'id': i, 'refs': s['refs'], 'n': s['n'], 'm': s['m'], 'fam': FAMOF.get(i, 'vase'), 'shape': shape,
         'p': 0, 'mat': s.get('mat') or 'matte', 'fin': s.get('finish') or '',
         'col': s.get('col') or '#888888', 'col2': s.get('col2'), 'lip': s.get('lip') or 'plain', 'lipw': u(s.get('lip_cm') or .5), 'why': WHY.get(i) or s.get('why') or ''}
    h = s.get('h_cm') or 15
    if shape == 'outline':
        ol = outline_of(s)
        v['ol'] = ol
        v['h'] = round(max(p[1] for p in ol['pts']), 1)
        v['prof'] = env_of(ol, v['h'])
        v['mo'] = round((ol['mouth'][1] - ol['mouth'][0]) / 2 * .86, 1)
        v['mx'] = round((ol['mouth'][1] + ol['mouth'][0]) / 2, 1)
        v['mh'] = ol['mouth'][2]
    elif shape == 'box':
        w = (s.get('outline') or {}).get('w_cm') or (s['prof'][0][1] * 2)
        v['box'] = {'w': u(w), 'd': u((s.get('outline') or {}).get('d_cm') or w)}
        v['h'] = u(h)
        v['prof'] = [[0, u(w / 2)], [u(h), u(w / 2)]]
        v['mo'] = u(s.get('mouth_cm') or w / 2 * .9)
    else:
        P = [[u(a), u(b)] for a, b in s['prof']]
        # clean: strictly increasing heights (a step = two points almost at the same height)
        Q = []
        for a, b in P:
            if Q and a <= Q[-1][0]:
                a = Q[-1][0] + .3
            Q.append([round(a, 1), round(max(.6, b), 1)])
        v['prof'] = Q
        v['h'] = Q[-1][0]
        v['mo'] = u(min(s.get('mouth_cm') or s['prof'][-1][1] * .9, s['prof'][-1][1]))
    if s.get('handles'):
        hd = s['handles']
        v['hd'] = {'n': hd.get('n', 2), 'y0': u(hd['from_cm']), 'y1': u(hd['to_cm']), 'out': u(hd['out_cm']), 'th': u(hd['thick_cm']), 'sh': hd.get('shape', 'loop')}
    st = stand_of(s.get('stand'))
    if st:
        v['st'] = st
    v['sf'] = s.get('surface') or 'none'
    if s.get('glass') or v['mat'] == 'glass':
        gl = s.get('glass') or {}
        v['gl'] = {'tint': gl.get('tint') or v['col'], 'op': gl.get('opacity', .25), 'water': u(gl['water_cm']) if gl.get('water_cm') else round(v['h'] * .62, 1)}
    if tp:
        v['tp'] = tp
    if 'kz' in tp:
        v['kind'] = 'kenzan'
    return v


ALL = [conv(s) for s in specs if s.get('family') != 'none'] + [conv(s) for s in EXTRA]
seen = set()
for v in ALL:
    assert v['id'] not in seen, v['id']
    seen.add(v['id'])
    assert v['id'] in FAMOF, ('family?', v['id'])
missing = [i for i in FAMOF if i not in seen]
assert not missing, missing

js = ('/* ================= Vases des compositions de référence : profils mesurés sur les photos (unités de dessin, 6,5 par cm) ================= */\n'
      'const VZ0=' + json.dumps(ALL, ensure_ascii=False, separators=(',', ':')) + ';\n'
      'const VFAMS=' + json.dumps([['main', 'Sans vase'], ['coupe', 'Coupes'], ['boule', 'Boules & pots'], ['vase', 'Vases & bouteilles'], ['cylindre', 'Cylindres'],
                                  ['calice', 'Calices & urnes'], ['sculpture', 'Sculptures & bassins'], ['pique', 'Pique-fleurs']], ensure_ascii=False) + ';\n'
      '/* each reference model takes the vessel of its photo */\n'
      'const VREF=' + json.dumps({str(r): v['id'] for v in ALL for r in v['refs']}) + ';\n')
open(OUT, 'w', encoding='utf-8', newline='\n').write(js)
print(len(ALL), 'vessels ->', OUT, len(js), 'bytes')
