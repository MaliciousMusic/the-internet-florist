"""trous.py: the holes of a grid sheet, measured (no model). RATE-OEILLET M3, 2026-10-18.

  python fleur/trous.py <png> <cols> <rows> [--json]

The sheet is rendered on a flat background unlike any flower (svtest grid ...&bg=%2300ff00). A hole is a patch of background that does not
touch the image's border: what shows between the petals, enclosed by the flower. Per cell: the flower's pixels, the holes' pixels, their share,
and the flower's box (w, h: the wilt's size against the open head). Small specks (< 3 px) are ignored: antialiasing.
"""
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def measure(png, cols, rows, tol=14, speck=3):
    im = np.asarray(Image.open(png).convert('RGB')).astype(int)
    H, W, _ = im.shape
    bg = im[3, 3]
    m = np.abs(im - bg).sum(2) < tol
    lab, n = ndimage.label(m)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    cw, ch = W / cols, H / rows
    cells = [[{'flower': 0, 'holes': 0, 'w': 0, 'h': 0} for _ in range(cols)] for _ in range(rows)]
    fl = ~m
    for r in range(rows):
        for c in range(cols):
            sub = fl[int(r * ch):int((r + 1) * ch), int(c * cw):int((c + 1) * cw)]
            ys, xs = np.nonzero(sub)
            e = cells[r][c]
            e['flower'] = int(sub.sum())
            if len(xs):
                e['w'], e['h'] = int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        cms = ndimage.center_of_mass(m, lab, range(1, n + 1))
        for i in range(1, n + 1):
            if i in edge or sizes[i - 1] < speck:
                continue
            cy, cx = cms[i - 1]
            r, c = min(rows - 1, int(cy / ch)), min(cols - 1, int(cx / cw))
            cells[r][c]['holes'] += int(sizes[i - 1])
    for row in cells:
        for e in row:
            e['share'] = round(100 * e['holes'] / max(1, e['flower'] + e['holes']), 2)
    return cells


if __name__ == '__main__':
    png, cols, rows = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    cells = measure(png, cols, rows)
    if '--json' in sys.argv:
        print(json.dumps(cells))
    else:
        for row in cells:
            print(' '.join('%5.2f' % e['share'] for e in row))
