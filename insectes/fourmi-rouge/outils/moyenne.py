"""moyenne.py: the mean of several measured grids of one piece (Lab, cell by cell), so that no single worker's shade sets the colour.

  python insectes/fourmi-rouge/outils/moyenne.py <out.json> <grille.json>... [--poids 1,1]"""
import sys, json
import numpy as np
from skimage import color

a = sys.argv[1:]
w = [float(x) for x in a[a.index('--poids') + 1].split(',')] if '--poids' in a else None
if w: a = a[:a.index('--poids')]
out, ins = a[0], a[1:]
w = w or [1] * len(ins)
G = [json.load(open(p, encoding='utf-8')) for p in ins]
lab = [color.rgb2lab(np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row] for row in g['rows']])) for g in G]
m = sum(x * k for x, k in zip(lab, w)) / sum(w)
rgb = np.clip(color.lab2rgb(m), 0, 1)
rows = [['#%02x%02x%02x' % tuple(int(round(v * 255)) for v in rgb[r, c]) for c in range(rgb.shape[1])] for r in range(rgb.shape[0])]
json.dump({'_doc': 'moyenne Lab des grilles mesurées : ' + ', '.join(g.get('_doc', '')[:60] for g in G), 'sources': ins, 'rows': rows},
          open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
print(out, 'milieu', rows[len(rows) // 2][9])
