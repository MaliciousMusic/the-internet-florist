# planche_fleurs.py: the D3 flowers board, planches/d3-fleurs.png (1800 px wide).
#   python decor/planche_fleurs.py <dir of the renders> [maquette.jpg]
# The renders come from decor/fleurs/rendu.mjs (resvg, every plane whole, then cropped):
#   pl-full.png    the whole scene at 0.75 px per unit (desktop framing)
#   pl-col.png     the phone column's lower part, x 960-1440, y 700-1350, at 1.8 px per unit (a 3x phone)
#   pl-mid.png     a drift at mid-distance, x 150-595, y 765-1015, at 2x
#   pl-touffe.png  a foreground clump, x 1450-1895, y 1100-1350, at 2x
# The owner's mock-up is cropped to the same framing (its 9:16 frame is the column x 820-1580 of the 2400 x 1350 world).
# The board holds the mock-up: it stays out of every repository, like refcache/.
import sys, os
from PIL import Image, ImageDraw, ImageFont

src = sys.argv[1]
maq = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), '..', 'refcache', 'decor-voiles', 'maquette-porteur.jpg')
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'planches', 'd3-fleurs.png')
W, GAP, BG, INK = 1800, 18, (244, 241, 236), (40, 36, 32)
try:
    font = ImageFont.truetype('arial.ttf', 22)
except OSError:
    font = ImageFont.load_default()

def flat(p):
    im = Image.open(os.path.join(src, p)).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im).convert('RGB')

rows = []
full = flat('pl-full.png')
rows.append(('Scène entière, cadrage ordinateur (0,75 px par unité) : ciel, horizon, sol fleuri, touffes fleuries au repos', [full]))

col = flat('pl-col.png')
cw, ch = col.size
m = Image.open(maq).convert('RGB')
mw, mh = m.size
kx, ky = mw / 760, mh / 1350
box = (int((960 - 820) * kx), int(700 * ky), int((1440 - 820) * kx), int(1350 * ky))
mq = m.crop(box).resize((cw, ch), Image.LANCZOS)
half = (W - GAP) // 2
s = half / cw
rows.append(('Colonne du téléphone, bas du cadre (x 960-1440, y 700-1350) à 1,8 px par unité ; à droite la maquette au même cadrage',
             [col.resize((half, int(ch * s)), Image.LANCZOS), mq.resize((half, int(ch * s)), Image.LANCZOS)]))

mid, tf = flat('pl-mid.png'), flat('pl-touffe.png')
s2 = half / mid.size[0]
rows.append(('Gros plans 2× : une plaque à mi-distance (5-9 m), puis une touffe fleurie du premier plan (à 1 m, tulipes du moteur et leur herbe)',
             [mid.resize((half, int(mid.size[1] * s2)), Image.LANCZOS), tf.resize((half, int(tf.size[1] * s2)), Image.LANCZOS)]))

H = sum(34 + max(i.size[1] for i in ims) + GAP for _, ims in rows) + GAP
sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)
y = GAP
for title, ims in rows:
    d.text((4, y), title, fill=INK, font=font)
    y += 34
    x = 0
    if len(ims) == 1:
        im = ims[0]
        if im.size[0] != W:
            im = im.resize((W, int(im.size[1] * W / im.size[0])), Image.LANCZOS)
        sheet.paste(im, (0, y))
        y += im.size[1] + GAP
        continue
    for im in ims:
        sheet.paste(im, (x, y))
        x += im.size[0] + GAP
    y += max(i.size[1] for i in ims) + GAP
sheet.save(out)
print(out, sheet.size)
