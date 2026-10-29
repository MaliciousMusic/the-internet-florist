"""planche_rosee.py: the dew sheet of lot C1 (decor/CYCLE.md) from the rows of rosee_planche.mjs.

  python decor/planche_rosee.py <rows dir> <out.jpg> [ids...]
  python decor/planche_rosee.py <rows dir> <out.jpg> --echelle <k> [ids...]   real size against the drops x k (rows rosee-<id>-k<k>.png)

Each row of rosee_planche.mjs (levels 1, 0.5, 0) holds 6 cells: whole at each level, then the close-up at each level. The sheet keeps,
per bouquet: whole at 1 and 0.5, then the close-up without dew, at 1 and at 0.5 (the same window), under a title line."""
import sys, os
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
args = sys.argv[3:]
K = None
if '--echelle' in args:
    i = args.index('--echelle')
    K = args[i + 1]
    del args[i:i + 2]
ids = args or ['printemps-a-la-carpe', 'citrine', 'ronde-bleue', 'neige-de-mars']
if K:
    # per bouquet: the whole at full dew 1:1 (real size | x K), then the close-up (real size | x K)
    try:
        font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 26)
    except OSError:
        font = ImageFont.load_default()
    pairs = [(Image.open(os.path.join(src, f'rosee-{i}.png')).convert('RGB'), Image.open(os.path.join(src, f'rosee-{i}-k{K}.png')).convert('RGB')) for i in ids]
    W, H = pairs[0][0].size
    c1, cK = (W - 6) // 6, (pairs[0][1].size[0] - 6) // 4
    top = 50
    sheet = Image.new('RGB', (4 * c1 + 6, top + len(pairs) * H), '#e9e4dc')
    d = ImageDraw.Draw(sheet)
    d.text((14, 10), f'Échelle des gouttes : vraie grandeur | gouttes x{K} (entier à 1:1, puis gros plan), pleine rosée', fill='#2a2020', font=font)
    for r, (a, b) in enumerate(pairs):
        for k, (im, x) in enumerate([(a, 0), (b, 0), (a, 3 * c1), (b, 2 * cK)]):
            sheet.paste(im.crop((x, 0, x + c1 + 6, H)), (k * c1, top + r * H))
    sheet.save(out, quality=88)
    print(out, sheet.size, os.path.getsize(out) // 1024, 'Ko')
    sys.exit(0)
rows = [Image.open(os.path.join(src, f'rosee-{i}.png')).convert('RGB') for i in ids]
W, H = rows[0].size
cw = (W - 6) // 6
pick = [0, 1, 5, 3, 4]  # whole 1, whole 0.5, close-up 0, close-up 1, close-up 0.5
try:
    font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 30)
except OSError:
    font = ImageFont.load_default()
top = 56
sheet = Image.new('RGB', (len(pick) * cw + 6, top + len(rows) * H), '#e9e4dc')
d = ImageDraw.Draw(sheet)
d.text((14, 12), 'La rosée du matin (lot C1) : entier à pleine rosée et à mi-séchage, puis gros plan sans rosée, pleine rosée, mi-séchage', fill='#2a2020', font=font)
for r, im in enumerate(rows):
    for k, c in enumerate(pick):
        sheet.paste(im.crop((c * cw, 0, c * cw + cw + 6, H)), (k * cw, top + r * H))
sheet.save(out, quality=88)
print(out, sheet.size, os.path.getsize(out) // 1024, 'Ko')
