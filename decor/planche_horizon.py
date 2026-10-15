"""planche_horizon.py: the owner's board of the horizon plane, decor/planches/d1-horizon.png, <= 1800 px wide.

Top: the whole horizon as the desktop sees it, over the provisional sky (whitening to #dfe4e8 at the horizon), the
phone column marked by two thin lines. Then the phone view: the column x 820-1580, y 600-800 at 1.8 px per world unit
(a 3x phone screen), with a flat grey stand-in for the pillar (x 1100-1300 from y 722 down). Below: three pairs, reference photo | render, at the SAME ANGULAR SCALE as the
render at 2x the world (3708 px per radian; a phone shows ~1.8 px per world unit): the photo is enlarged by
3708 / f, f its focal length in pixels (EXIF 35 mm equivalent; 207 has no EXIF, f estimated for a 28 mm compact).
Photos stay in refcache/ and boards in decor/planches/ (ignored by git).

Run from flower-atelier/:  node decor/horizon.mjs 1 && python decor/planche_horizon.py"""
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

try:
    FONT = ImageFont.truetype('arial.ttf', 14)
except OSError:
    FONT = ImageFont.load_default()
W = 1800
D = 'decor/'
HD = 'refcache/decor-horizon/hd/'
OUT = D + 'out/hz/'
os.makedirs(OUT, exist_ok=True)
K2 = 2 * 1854  # px per radian of the render at 2x


def node(*args):
    r = subprocess.run(['node', *args], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(r.stderr)
    return r.stdout.strip()


# planes: whole horizon, and the far ranks alone (for the pairs of the curtain and of the far line)
node(D + 'horizon.mjs', '1', '--only', 'G,C,B', '--out', OUT + 'horizon-GCB.svg')
node(D + 'horizon.mjs', '1', '--only', 'G,C', '--out', OUT + 'horizon-GC.svg')
print(node(D + 'horizon_rendu.mjs', D + 'out/horizon.svg', OUT + 'pano.png', '0', '560', '2400', '800', '0.75', '--col'))
pano = Image.open(OUT + 'pano.png').convert('RGB')
print(node(D + 'horizon_rendu.mjs', D + 'out/horizon.svg', OUT + 'telephone.png', '820', '600', '1580', '800', '1.8', '--pilier'))
tel = Image.open(OUT + 'telephone.png').convert('RGB')

# (label, photo, focal px, photo box px, svg, world x0, world y-bottom)
pairs = [
    ('1. Haie et arbres de haie : photo 89 (Szeder László, CC BY-SA 4.0), arbres vers 250-400 m, bois derrière vers 600 m | rendu, rang A (480-900 m) et derrière',
     'h089.jpg', 1618, (480, 545, 870, 640), D + 'out/horizon.svg', 1640, 742),
    ("2. Rideau d'arbres vers 0,8-1 km : photo 66 (Szeder László, CC BY-SA 4.0), lisière d'un bois contre le ciel | rendu, rangs B et C seuls (A ôté)",
     'h066.jpg', 1618, (1100, 430, 1490, 520), OUT + 'horizon-GCB.svg', 150, 731),
    ('3. Lignes lointaines 1,5-3 km : photo 207 (P. Nouhailler, CC BY-SA 2.0, focale estimée), collines au-delà | rendu, rang C seul sur le ras',
     'h207.jpg', 1553, (1690, 652, 1920, 706), OUT + 'horizon-GC.svg', 1000, 728),
]
rows = []
for label, ph, f, box, svg, wx0, wyb in pairs:
    k = K2 / f
    im = Image.open(HD + ph).convert('RGB').crop(box)
    a = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    ww, wh = a.width / 2, a.height / 2  # world units of the same angular extent
    png = OUT + f'pair-{len(rows) + 1}.png'
    node(D + 'horizon_rendu.mjs', svg, png, str(wx0), str(wyb - wh), str(wx0 + ww), str(wyb), '2')
    b = Image.open(png).convert('RGB').resize(a.size, Image.LANCZOS)
    s = min(1, (W - 8) / (a.width + b.width))
    a = a.resize((round(a.width * s), round(a.height * s)), Image.LANCZOS)
    b = b.resize((round(b.width * s), round(b.height * s)), Image.LANCZOS)
    row = Image.new('RGB', (W, a.height + 22), (30, 30, 30))
    x = (W - a.width - b.width - 8) // 2
    row.paste(a, (x, 22))
    row.paste(b, (x + a.width + 8, 22))
    ImageDraw.Draw(row).text((x, 3), f'{label} — même échelle angulaire, rendu à 2× du monde (photo ×{k:.2f}{", réduction commune %.2f" % s if s < 1 else ""})',
                             fill=(225, 225, 225), font=FONT)
    rows.append(row)
H = pano.height + 22 + tel.height + 30 + sum(r.height + 8 for r in rows)
board = Image.new('RGB', (W, H), (30, 30, 30))
dr = ImageDraw.Draw(board)
dr.text((6, 3), 'Horizon entier, cadrage ordinateur, graine 1, sur le ciel provisoire (ras #dfe4e8). Traits blancs : colonne téléphone'
        ' (x 820-1580). Sous la bande G : prairie provisoire unie (le plan z4 viendra par-dessus).', fill=(225, 225, 225), font=FONT)
board.paste(pano, (0, 22))
y = pano.height + 22
dr.text((6, y + 5), 'Vue téléphone : colonne x 820-1580, y 600-800, à 1,8 px par unité (écran 3×). Rectangle gris : le pilier (x 1100-1300, plateau à y 722).',
        fill=(225, 225, 225), font=FONT)
board.paste(tel, ((W - tel.width) // 2, y + 26))
y += tel.height + 34
for r in rows:
    board.paste(r, (0, y))
    y += r.height + 8
board.save(D + 'planches/d1-horizon.png', optimize=True)
print(D + 'planches/d1-horizon.png', board.size)
