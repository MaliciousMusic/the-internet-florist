"""grille_corps.py: the engine grid of a body (PROTOCOLE §3.2) from the measured grids of apparence.py (dorsal, and ventral when
there is one): rows from the rear of the body (t = 0) to the front, columns from the belly (u = 0) over the flank to the back (u = 1).

  python insectes/outils/grille_corps.py <out.json> <dorsal-grille.json> [--ventral <grille.json>] [--belly #hex] [--flip]
A point at angle th above the flank lies at |u| = cos th of the dorsal flattening (|u| = 0 the midline, 1 the edge seen from above).
--flip: the flattening ran front to rear. Only numbers are written (the grid is measured, never the image)."""
import sys, json, math
import numpy as np
from skimage import color

def load(p):
    g = json.load(open(p, encoding='utf-8'))
    c = np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row] for row in g['c']])
    return color.rgb2lab(c)

a = sys.argv[1:]
out, D = a[0], load(a[1])
if '--flip' in a: D = D[::-1]
V = load(a[a.index('--ventral') + 1]) if '--ventral' in a else None
belly = a[a.index('--belly') + 1] if '--belly' in a else None
nv, nu = D.shape[:2]
NU = 18
G = np.zeros((nv, NU, 3))
for j in range(NU):
    th = -math.pi / 2 + math.pi * (j + 0.5) / NU
    src = D if th >= 0 else V
    if src is None:
        # under the flank: the flank colour, darkened toward the belly or taken to the given belly colour
        edge = D[:, -1]
        w = min(1, -th / (math.pi / 2))
        if belly:
            b = color.rgb2lab(np.array([[[int(belly[i:i + 2], 16) / 255 for i in (1, 3, 5)]]]))[0, 0]
            G[:, j] = edge * (1 - w) + b * w
        else:
            G[:, j] = edge * [1 - 0.35 * w, 1, 1]
        continue
    uu = math.cos(abs(th)) * (nu - 1)
    i0 = int(uu); i1 = min(nu - 1, i0 + 1); f = uu - i0
    G[:, j] = src[:, i0] * (1 - f) + src[:, i1] * f
rgb = np.clip(color.lab2rgb(G), 0, 1)
rows = [['#%02x%02x%02x' % tuple(int(round(x * 255)) for x in rgb[r, c]) for c in range(NU)] for r in range(nv)]
json.dump({'_doc': 'grille mesurée (apparence.py) : rangs de l\'arrière (t = 0) vers l\'avant, colonnes du ventre au dos', 'sources': a[1:], 'rows': rows}, open(out, 'w', encoding='utf-8'), indent=0)
print(out, nv, 'x', NU)
