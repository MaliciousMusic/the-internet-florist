"""planche.py: side-by-side boards, a reference photo crop next to a render crop, both at the same height.

  python decor/planche.py <out.png> --h 300 <img:x0,y0,x1,y1> <img:x0,y0,x1,y1> [...]   (pairs, one row per pair)

Boxes are fractions of each image (0..1). Reference photos stay in refcache/; boards stay in decor/planches/ (not
committed with photos of third parties)."""
import sys
from PIL import Image

out, args = sys.argv[1], sys.argv[2:]
h = 300
if args[0] == '--h':
    h, args = int(args[1]), args[2:]
rows = []
for i in range(0, len(args), 2):
    ims = []
    for a in args[i:i + 2]:
        path, box = a.rsplit(':', 1)
        im = Image.open(path).convert('RGB')
        x0, y0, x1, y1 = [float(v) for v in box.split(',')]
        W, H = im.size
        c = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
        ims.append(c.resize((max(1, round(c.width * h / c.height)), h), Image.LANCZOS))
    rows.append(ims)
Wt = max(sum(r.width for r in row) + 8 * (len(row) - 1) for row in rows)
board = Image.new('RGB', (Wt, len(rows) * h + 8 * (len(rows) - 1)), (34, 34, 34))
y = 0
for row in rows:
    x = 0
    for im in row:
        board.paste(im, (x, y))
        x += im.width + 8
    y += h + 8
board.save(out, quality=92)
print(out, board.size)
