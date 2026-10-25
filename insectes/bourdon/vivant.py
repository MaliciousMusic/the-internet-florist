"""vivant.py: the yellow cells of the body grids (measured on the dry spread specimen c115) brought to the living bumblebees (and the black, below).

On c115 the collar and the band of the 2nd tergite are orange brown (collar L* 35 a 12 b 21, hue about 60 deg) and dark next to the
white tail: the dry hair has faded and lies matted with the black. On the living workers c024 and c126 they are a pure yellow (a* 4
to 7, hue 82 to 84 deg, chroma about 0.9 L*), and, against the tail of the same photo (c024), the collar has 0.33 of its luminance
and the band 0.48. Each cell keeps its share of yellow (its chroma, between 15 and 23, sets how much it moves), so the mixed edges
and the buff fringe of the tail stay as they were measured.

  python insectes/bourdon/vivant.py      -> grilles/thorax-vivant.json, grilles/abdomen-vivant.json"""
import os, json
import numpy as np
from skimage.color import rgb2lab, lab2rgb

HERE = os.path.dirname(os.path.abspath(__file__))
HUE, CL = 83.0, 0.9
RATIO = {'thorax': 0.33, 'abdomen': 0.48}   # Y of the yellow over Y of the tail, on c024
# Y of the black over Y of the tail: 0.03 on c024, but the render lifts a black albedo (the sheen and the sky on the hair add a
# floor: the grid's L* 22 came out at L* 20, the tail's 92 at about 75), so the albedo is set lower for the render to reach it
BLACK = 0.012

hexrgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)]) / 255.0
rgbhex = lambda c: '#%02x%02x%02x' % tuple(int(round(v * 255)) for v in np.clip(c, 0, 1))
Yof = lambda L: ((L + 16) / 116) ** 3
Lof = lambda Y: 116 * np.cbrt(Y) - 16

grids = {n: json.load(open(os.path.join(HERE, 'grilles', '%s.json' % n), encoding='utf-8')) for n in ('thorax', 'abdomen')}
lab = {n: rgb2lab(np.array([[hexrgb(h) for h in r] for r in G['rows']])) for n, G in grids.items()}
# the tail: the white cells of the abdomen's rear rows
A = lab['abdomen']; tail = A[:14][(A[:14, :, 0] > 70)]
Ytail = Yof(np.median(tail[:, 0]))
for n, G in grids.items():
    L = lab[n]; C = np.hypot(L[..., 1], L[..., 2]); h = np.degrees(np.arctan2(L[..., 2], L[..., 1]))
    w = np.clip((C - 15) / 8, 0, 1) * ((h > 30) & (h < 100))
    yel = w > 0.9
    k = RATIO[n] * Ytail / Yof(np.median(L[yel][:, 0])) if yel.any() else 1
    Ln = np.clip(Lof(Yof(L[..., 0]) * k), 0, 95)
    Cn = CL * Ln
    out = L.copy()
    out[..., 0] = L[..., 0] + w * (Ln - L[..., 0])
    Cm = C + w * (Cn - C); hm = h + w * (HUE - h)
    out[..., 1] = Cm * np.cos(np.radians(hm)); out[..., 2] = Cm * np.sin(np.radians(hm))
    # the black: dusty grey on the dry c115 (L* 18 to 26), a deep black on the living: on c024 the scutum and the 3rd tergite
    # have 0.03 of the tail's luminance (L* 9 to 12 against 72 to 75); the cells' own spread is kept, their tint a faint warm
    wb = np.clip((12 - C) / 6, 0, 1) * np.clip((45 - L[..., 0]) / 10, 0, 1) * (1 - w)
    blk = wb > 0.9
    kb = BLACK * Ytail / Yof(np.median(L[blk][:, 0])) if blk.any() else 1
    Lb = Lof(Yof(L[..., 0]) * kb)
    out[..., 0] = out[..., 0] + wb * (Lb - out[..., 0])
    out[..., 1] = out[..., 1] + wb * (0.6 - out[..., 1]); out[..., 2] = out[..., 2] + wb * (1.2 - out[..., 2])
    rows = [[rgbhex(c) for c in r] for r in lab2rgb(out)]
    G2 = dict(G, rows=rows, _doc=G['_doc'] + ' ; jaunes et noir ramenés aux vivants c024 et c126 (vivant.py)')
    json.dump(G2, open(os.path.join(HERE, 'grilles', '%s-vivant.json' % n), 'w', encoding='utf-8'), ensure_ascii=False)
    print(n, 'cases jaunes', int(yel.sum()), 'facteur de luminance %.2f' % k, 'cases noires', int(blk.sum()), 'facteur du noir %.2f' % kb, 'jaune médian avant', np.round(np.median(L[yel], 0), 1),
          'après', np.round(np.median(out[yel], 0), 1))
