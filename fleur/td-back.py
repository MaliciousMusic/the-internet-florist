"""td-back.py <png> <D> "c,r;..." : the lower 45 percent of the head's pixels (the backs of the outer tepals in a three-quarter view): median colour, mean saturation, share of pale (>190) and of brownish pixels."""
import sys, numpy as np
from PIL import Image
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float); D = float(sys.argv[2]); g = D * 1.15
for spec in sys.argv[3].split(';'):
    c, r = map(int, spec.split(','))
    X = D * .2 + g * (c + .5); Y = D * .1 + g * (r + .55)
    box = im[max(0, int(Y - .8 * g)):int(Y + .3 * g), int(X - g / 2):int(X + g / 2)]
    m = np.abs(box - np.array([233, 228, 220])).max(2) > 12
    ys = np.nonzero(m)[0]; y0, y1 = ys.min(), ys.max(); cut = int(y0 + (y1 - y0) * .55)
    sel = np.zeros_like(m); sel[cut:, :] = True; sel &= m; px = box[sel]
    mx, mn = px.max(1), px.min(1)
    brown = ((px[:, 1] > px[:, 0] * .62) & (px[:, 0] > px[:, 2] * 1.1) & (px[:, 0] < 190)).mean()
    print('cell', c, r, 'median #%02x%02x%02x' % tuple(int(np.median(px[:, k])) for k in range(3)), 'sat %.2f' % np.mean((mx - mn) / np.maximum(mx, 1)), 'pale %.1f%%' % ((px.mean(1) > 190).mean() * 100), 'brownish %.1f%%' % (brown * 100), '(%d px)' % len(px))
