"""planche_herbe.py: board of the meadow (decor D2, grass) -> decor/planches/d2-herbe.png (<= 1800 px wide).

  python decor/planche_herbe.py        (after `node decor/herbe.mjs 1`)

1. the scene from the horizon to the frame bottom (sky, horizon, z4, z5, z9 clumps, grey pillar stand-in), desktop
   framing; 2. the phone column (x 820-1580) at 1.8 px per unit; 3. three pairs photo HD / render at the same scale
   (px per mm of the subject, from the common camera: f = 1854, eye 0.75 m): close (a clump at 1.3 m against photo 83),
   middle (the meadow at 3-5 m against photo 119), far (50-200 m against photo 90, same angle per pixel).
Photos come from refcache/decor-herbe/hd/ (never committed); renders from decor/herbe_rendu.mjs (resvg)."""
import subprocess, os, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, '..', 'refcache', 'decor-herbe', 'hd')
TMP = os.path.join(HERE, 'out', 'png')
os.makedirs(TMP, exist_ok=True)
F = 1854


def render(name, box, scale, extra=()):
    out = os.path.join(TMP, f'herbe-{name}.png')
    subprocess.run(['node', os.path.join(HERE, 'herbe_rendu.mjs'), out, '--box', ','.join(str(v) for v in box), '--scale', str(scale), *extra],
                   check=True, capture_output=True)
    return Image.open(out).convert('RGB')


def photo(f, box, scale):
    im = Image.open(os.path.join(REF, f)).convert('RGB').crop(box)
    return im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)


def label(im, text):
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 8 + 6 * len(text), 16), fill=(20, 20, 20))
    d.text((4, 2), text, fill=(240, 240, 240))
    return im


def pair(ph, rd, h=430):
    a = ph.crop((0, 0, min(ph.width, 880), min(ph.height, h)))
    b = rd.crop((0, 0, min(rd.width, 880), min(rd.height, h)))
    row = Image.new('RGB', (1800, max(a.height, b.height)), (24, 24, 24))
    row.paste(a, (0, 0))
    row.paste(b, (920, 0))
    return row


rows = []
# 1. desktop framing, horizon to the frame bottom
rows.append(label(render('scene', (0, 600, 2400, 1350), 0.75, ['--pilier']), 'scene, cadrage ordinateur (0,75 px/unite), pilier gris provisoire'))
# 2. phone column at 1.8 px per unit
col = label(render('colonne', (820, 600, 1580, 1350), 1.8, ['--pilier']), 'colonne telephone x 820-1580 a 1,8 px/unite')
c = Image.new('RGB', (1800, col.height), (24, 24, 24))
c.paste(col, ((1800 - col.width) // 2, 0))
rows.append(c)
# 3a. close: clump 3 (foxtail, 1.3 m): 1 unit = 0.70 mm; at 3.6 px/unit (200 % of the phone) = 5.1 px/mm.
# Photo 83: the foxtail spike (8 mm) is ~96 px wide at 1920 px -> 12 px/mm -> scale 0.43.
mm = 3.6 * F / 1300
rows.append(pair(label(photo('h083.jpg', (300, 700, 1920, 1900), mm / 12), 'photo 83 (vulpin) a %.1f px/mm' % mm),
                 label(render('gros', (540, 860, 785, 1100), 3.6), 'touffe 3 (vulpin, 1,3 m) a 3,6 px/unite')))
# 3b. middle: the meadow at 3-5 m at the phone scale (1 unit = 2.16 mm at 4 m: 0.83 px/mm). Photo 119: blades of
# ~4 mm are ~5 px wide -> 1.25 px/mm -> scale 0.67.
rows.append(pair(label(photo('h119.jpg', (300, 700, 1620, 1446), 0.67), 'photo 119 (pre, vue basse) a 0,83 px/mm'),
                 label(render('moyen', (1580, 980, 2070, 1220), 1.8, ['--planes', 'ciel,horizon,loin,milieu']), 'z5 a 3,5-5 m, 1,8 px/unite')))
# 3c. far: same angle per pixel. Ours: 32.4 units per degree at 1 px/unit; photo 90 (1280 px, ~60 deg wide): 21 px/deg.
rows.append(pair(label(photo('h090.jpg', (0, 520, 600, 760), 32.4 / 21.3), 'photo 90 (pre au loin), meme angle par pixel'),
                 label(render('loin', (300, 712, 1180, 1000), 1.0, ['--planes', 'ciel,horizon,loin,milieu']), 'horizon + z4 + z5 a 1 px/unite')))
H = sum(r.height + 10 for r in rows)
board = Image.new('RGB', (1800, H), (24, 24, 24))
y = 0
for r in rows:
    board.paste(r, (0, y))
    y += r.height + 10
out = os.path.join(HERE, 'planches', 'd2-herbe.png')
board.save(out, optimize=True)
print(out, board.size)
