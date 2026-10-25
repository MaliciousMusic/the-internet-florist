"""nettoie_grille.py: the cells of a dorsal grid (plat_corps.py) that see a wing or a leg rather than the body's hair, given the colour
of the nearest clean cell inward on the same row. On the bumblebee's thorax every hair is black or yellow: a light grey cell (chroma
under --c, L* over --l) is a wing membrane at the thorax's side, never hair.

  python insectes/bourdon/nettoie_grille.py <grille.json> [--c 8] [--l 38]      rewrites the grid in place, numbers only"""
import sys, json
import numpy as np
from skimage import color

a = sys.argv[1:]
p = a[0]
cmax = float(a[a.index('--c') + 1]) if '--c' in a else 8.0
lmin = float(a[a.index('--l') + 1]) if '--l' in a else 38.0
g = json.load(open(p, encoding='utf-8'))
rgb = np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row] for row in g['c']])
lab = color.rgb2lab(rgb)
bad = (np.hypot(lab[..., 1], lab[..., 2]) < cmax) & (lab[..., 0] > lmin)
n = 0
for i in range(len(g['c'])):
    for j in range(len(g['c'][i])):
        if not bad[i, j]: continue
        k = next((jj for jj in range(j - 1, -1, -1) if not bad[i, jj]), None)
        if k is None: continue
        g['c'][i][j] = g['c'][i][k]; n += 1
g['nettoyage'] = 'nettoie_grille.py : %d cases (chroma < %g, L* > %g) prises à la case propre voisine vers le milieu' % (n, cmax, lmin)
json.dump(g, open(p, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
print(p, n, 'cases nettoyées sur', bad.size)
