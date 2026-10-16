# The catalogue entry of the snowdrop vase (shop units): the turned body's profile (paint.py), its height, the mouth.
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit  # noqa: E402
OUT = os.path.join(HERE, 'out')
HCM = float(sys.argv[1]) if len(sys.argv) > 1 else 30
U = HCM * svgkit.UPC
pr = np.load(os.path.join(OUT, 'profile.npy'))[::-1]                 # h ascending, radius, dr/dh
hs = np.linspace(0, 1, 41)
r = np.interp(hs, pr[:, 0], pr[:, 1])
top = r[-1]
neck = float(np.interp(np.linspace(.93, 1, 15), pr[:, 0], pr[:, 1]).min())
fiche = dict(id='balustre-perce-neige', refs=[], n='Balustre aux perce-neige', m='faïence émaillée tubée, glaçure brillante',
             fam='vase', shape='lathe', p=0, mat='gloss', fin='', col='#0b0b12', col2=None, lip='rolled',
             lipw=round(float((top - neck) * U) + 2, 1),
             why="Un balustre de faïence émaillée : col bleu nuit, perce-neige blancs cernés de tubes, arches crème et tiges vertes jusqu'au pied.",
             svgb='perce-neige', prof=[[round(float(h * U), 1), round(float(v * U), 1)] for h, v in zip(hs, r)], h=round(U, 1),
             mo=round(neck * U * .92, 1))
json.dump(fiche, open(os.path.join(OUT, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print(fiche['id'], 'h', fiche['h'], 'mo', fiche['mo'], 'lipw', fiche['lipw'], 'r max', max(p[1] for p in fiche['prof']))
