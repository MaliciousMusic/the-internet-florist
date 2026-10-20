# fondre.py <base 6x24.json> <fine 18x72.json> <out.json> [--cap 6] [--edge 2]: a fine grid whose broad colour is the base grid's
# (the coarse medians the render was checked against) and whose detail is the fine grid's (veins, flushes, the rim), in Lab:
#   out = up(base) + clip(fine - blur(fine), cap)
# The detail is capped (ΔE) so that a cell the photo's background or a deep shade fell into cannot pull the tissue, and it fades to
# 0 over the last <edge> columns (|u| near 1, where the mask meets the ground).
import sys, json, argparse
import numpy as np
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

a = argparse.ArgumentParser()
a.add_argument('base'); a.add_argument('fine'); a.add_argument('out')
a.add_argument('--cap', type=float, default=6); a.add_argument('--edge', type=int, default=2)
o = a.parse_args()

def hx2rgb(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
def lab(c):
    c = np.asarray(c, float); c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    M = np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]]); x = c @ M.T / [.95047, 1, 1.08883]
    f = np.where(x > .008856, np.cbrt(x), 7.787 * x + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)
def rgb(L):
    fy = (L[..., 0] + 16) / 116; fx = fy + L[..., 1] / 500; fz = fy - L[..., 2] / 200
    f = np.stack([fx, fy, fz], -1); x = np.where(f ** 3 > .008856, f ** 3, (f - 16 / 116) / 7.787) * [.95047, 1, 1.08883]
    M = np.array([[3.2406, -1.5372, -.4986], [-.9689, 1.8758, .0415], [.0557, -.2040, 1.0570]]); c = x @ M.T
    c = np.where(c > .0031308, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - .055, 12.92 * c)
    return np.clip(c, 0, 1)

B = json.load(open(o.base, encoding='utf-8')); F = json.load(open(o.fine, encoding='utf-8'))
Lb = lab([[hx2rgb(x) for x in r] for r in B['c']]); Lf = lab([[hx2rgb(x) for x in r] for r in F['c']])
nv, nu = Lf.shape[:2]
# the base, bilinear on the fine cells' centres
yy = (np.arange(nv) + .5) / nv * Lb.shape[0] - .5; xx = (np.arange(nu) + .5) / nu * Lb.shape[1] - .5
y0 = np.clip(np.floor(yy).astype(int), 0, Lb.shape[0] - 1); y1 = np.clip(y0 + 1, 0, Lb.shape[0] - 1); fy = np.clip(yy - y0, 0, 1)[:, None, None]
x0 = np.clip(np.floor(xx).astype(int), 0, Lb.shape[1] - 1); x1 = np.clip(x0 + 1, 0, Lb.shape[1] - 1); fx = np.clip(xx - x0, 0, 1)[None, :, None]
up = (Lb[y0][:, x0] * (1 - fx) + Lb[y0][:, x1] * fx) * (1 - fy) + (Lb[y1][:, x0] * (1 - fx) + Lb[y1][:, x1] * fx) * fy
# the fine grid's broad colour: a box blur of the size of a base cell (3 x 3 fine cells)
pad = np.pad(Lf, ((1, 1), (1, 1), (0, 0)), mode='edge'); bl = sum(pad[i:i + nv, j:j + nu] for i in range(3) for j in range(3)) / 9
d = Lf - bl; m = np.linalg.norm(d, axis=-1, keepdims=True); d = d * np.minimum(1, o.cap / np.maximum(m, 1e-6))
w = np.ones(nu); w[nu - o.edge:] = np.linspace(.5, 0, o.edge) if o.edge else 1
out = rgb(up + d * w[None, :, None])
F2 = dict(F); F2['c'] = [['#%02x%02x%02x' % tuple(int(round(v * 255)) for v in px) for px in row] for row in out]
F2['fondu'] = {'base': o.base, 'fine': o.fine, 'cap': o.cap, 'edge': o.edge}
json.dump(F2, open(o.out, 'w', encoding='utf-8'))
print('fondu', o.out, '%dx%d' % (nu, nv), 'détail moyen ΔE %.1f' % float(np.linalg.norm(d, axis=-1).mean()))
