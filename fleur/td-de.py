"""td-de.py <grid.png> <D> "c,r,#target;..." : dE76 of the body of rendered heads (grid cells) against a measured body colour.
The body = the pixels of the head (not the sheet's background #e9e4dc) between the 40th and 60th percentile of L*, their mean colour."""
import sys
from PIL import Image
import numpy as np
def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    X = (c @ np.array([.4124564, .3575761, .1804375])) / .95047
    Y = c @ np.array([.2126729, .7151522, .0721750])
    Z = (c @ np.array([.0193339, .1191920, .9503041])) / 1.08883
    t = lambda v: np.where(v > 216 / 24389, np.cbrt(v), (24389 / 27 * v + 16) / 116)
    fx, fy, fz = t(X), t(Y), t(Z)
    return np.stack([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)], -1)
def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)
src, D = sys.argv[1], float(sys.argv[2]); g = D * 1.15
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
for spec in sys.argv[3].split(';'):
    c, r, tg = spec.split(','); c, r = int(c), int(r)
    X = D * .2 + g * (c + .5); Y = D * .1 + g * (r + .55)
    x0, x1, y0, y1 = int(X - g / 2), int(X + g / 2), int(Y - .8 * g), int(Y + .3 * g)
    cell = im[max(0, y0):y1, x0:x1].reshape(-1, 3)
    m = np.abs(cell - np.array([233, 228, 220])).max(1) > 12
    px = cell[m]
    if len(px) < 200: print(c, r, 'no head'); continue
    L = lab(px); o = np.argsort(L[:, 0]); n = len(o); sel = px[o[int(n * .4):int(n * .6)]]
    mean = sel.mean(0); de = np.linalg.norm(lab(mean) - lab(hexrgb(tg)))
    print('cell %d,%d target %s body %s dE76 %.1f (%d px)' % (c, r, tg, '#%02x%02x%02x' % tuple(int(round(v)) for v in mean), de, n))
