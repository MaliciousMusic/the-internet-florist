# prof.py <png> <y0> <y1> : H/W of the heads whose box lies inside the band [y0,y1] (profile row), left to right
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
y0, y1 = int(sys.argv[2]), int(sys.argv[3])
m = np.abs(a - np.array([233, 228, 220])).sum(2) > 30
lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=3))
out = []
for k, sl in enumerate(ndimage.find_objects(lab), 1):
    ys, xs = sl
    h, w = ys.stop - ys.start, xs.stop - xs.start
    if h * w < 900: continue
    cy = (ys.start + ys.stop) / 2
    if y0 <= cy <= y1:
        out.append((xs.start, '%.2f' % (h / w) + ('' if ys.start > y0 - 60 and ys.stop < y1 + 60 else '?'), ys.start, ys.stop))
print(sorted(out))
