"""heads.py <png> <out.jpg> <H> [i,j,...] : finds the heads of a grid sheet (as sil.py: not background, dilated, in reading order), crops each with a
margin, scales to height H and puts them side by side (700 px wide at most). Without indices: all heads."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

im = Image.open(sys.argv[1]).convert('RGB')
out, H = sys.argv[2], int(sys.argv[3])
a = np.asarray(im).astype(int)
m = np.abs(a - np.array([233, 228, 220])).sum(2) > 30
lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=4))
boxes = []
for i, sl in enumerate(ndimage.find_objects(lab), 1):
    if (m[sl] & (lab[sl] == i)).sum() < 300:
        continue
    boxes.append((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
rows = []
for b in sorted(boxes, key=lambda b: b[1]):
    for r in rows:
        if abs(r[0][1] - b[1]) < 60 or (b[1] < r[0][3] and b[3] > r[0][1]):
            r.append(b); break
    else:
        rows.append([b])
order = [b for r in rows for b in sorted(r, key=lambda b: b[0])]
idx = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else range(len(order))
tiles = []
for i in idx:
    x0, y0, x1, y1 = order[i]
    mg = 10
    t = im.crop((max(0, x0 - mg), max(0, y0 - mg), x1 + mg, y1 + mg))
    tiles.append(t.resize((max(1, round(t.width * H / t.height)), H), Image.LANCZOS))
W = sum(t.width for t in tiles) + 4 * (len(tiles) - 1)
c = Image.new('RGB', (W, H), (255, 255, 255))
x = 0
for t in tiles:
    c.paste(t, (x, 0)); x += t.width + 4
if W > 700:
    c = c.resize((700, round(H * 700 / W)), Image.LANCZOS)
c.save(out, quality=88)
print(out, c.size, len(order), 'heads')
