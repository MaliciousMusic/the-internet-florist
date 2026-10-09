"""sil.py <png> [--min N] : silhouette numbers of every head on a grid sheet, in reading order (rows, then columns):
solidity = area / convex hull area (a star or a ragged outline is low); rough = perimeter / perimeter of the circle of the same area; H/W; boxes."""
import sys, math
import numpy as np
from PIL import Image
from scipy import ndimage


def main():
    im = Image.open(sys.argv[1]).convert('RGB')
    mn = int(sys.argv[sys.argv.index('--min') + 1]) if '--min' in sys.argv else 300
    a = np.asarray(im).astype(int)
    m = np.abs(a - np.array([233, 228, 220])).sum(2) > 30
    big = ndimage.binary_dilation(m, iterations=4)
    lab, n = ndimage.label(big)
    heads = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        mm = m[sl] & (lab[sl] == i)
        area = int(mm.sum())
        if area < mn:
            continue
        mm = ndimage.binary_fill_holes(mm)
        area = int(mm.sum())
        hull = ndimage.binary_fill_holes(mm)
        # convex hull area via scipy.spatial if present
        try:
            from scipy.spatial import ConvexHull
            ys, xs = np.nonzero(mm)
            ha = ConvexHull(np.c_[xs, ys]).volume
        except Exception:
            ha = area
        edge = mm & ~ndimage.binary_erosion(mm)
        per = int(edge.sum())
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        heads.append((sl[0].start, sl[1].start, area / ha, per / (2 * math.sqrt(math.pi * area)), h / w, w, h))
    rows = []
    for hd in sorted(heads):
        for r in rows:
            if abs(r[0][0] - hd[0]) < 0.5 * r[0][6] + 20:
                r.append(hd)
                break
        else:
            rows.append([hd])
    for ri, r in enumerate(rows):
        for ci, hd in enumerate(sorted(r, key=lambda x: x[1])):
            print(f'r{ri} c{ci}: solidite {hd[2]:.3f}  rugosite {hd[3]:.2f}  H/W {hd[4]:.2f}  ({hd[5]}x{hd[6]} px at {hd[1]},{hd[0]})')


main()
