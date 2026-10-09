"""td-mont.py <grid.png> <D> <ncols> "c,r;c,r;..." <perrow> <cellpx> <out>: crops cells of a shot.sh grid (gap = 1.15 D) into a montage."""
import sys
from PIL import Image
src, D, nc, cells, per, px, out = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), sys.argv[4], int(sys.argv[5]), int(sys.argv[6]), sys.argv[7]
im = Image.open(src).convert('RGB'); g = D * 1.15
tiles = []
for c in cells.split(';'):
    cc, rr = map(int, c.split(','))
    X = D * .2 + g * (cc + .5); Y = D * .1 + g * (rr + .55)
    tiles.append(im.crop((int(X - g / 2), int(Y - .8 * g), int(X + g / 2), int(Y + .3 * g))).resize((px, int(px * 1.1)), Image.LANCZOS))
rows = (len(tiles) + per - 1) // per
o = Image.new('RGB', (per * px, rows * int(px * 1.1)), (233, 228, 220))
for i, t in enumerate(tiles): o.paste(t, ((i % per) * px, (i // per) * int(px * 1.1)))
o.save(out); print(out, o.size)
