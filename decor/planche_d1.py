"""planche_d1.py: the owner's board of lot D1 (sky and clouds), decor/planches/d1-ciel-nuages.png, <= 1800 px wide.

Top: the whole sky with its clouds as the desktop sees it when the scene opens, the phone column marked by two thin
lines. Below: three close-ups, reference photo in 1600 px | render at the same scale (decor/hd.py): a high cumulus,
a tower, a low row. A pair wider than the board is reduced as a whole, so photo and render keep the same scale.
Run after: node decor/compose.mjs --col ; node decor/shot.mjs decor/out/scene-ciel.svg --w 1800 ;
node decor/shot.mjs decor/out/ciel.svg --w 1200."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hd import pair  # noqa: E402

try:
    FONT = ImageFont.truetype('arial.ttf', 14)
except OSError:
    FONT = ImageFont.load_default()
W = 1800
D = 'decor/'
HD = 'refcache/decor-nuages/hd/'
sky = Image.open(D + 'out/scene-ciel.png').convert('RGB')
sky = sky.crop((0, 0, sky.width, int(sky.height * 740 / 1350)))
sky = sky.resize((W, round(sky.height * W / sky.width)), Image.LANCZOS)

pairs = [
    ('cumulus haut — photo 38 (1600 px) | nuage a1, même échelle', HD + 't038.jpg', '0.06,0.2,0.66,0.6', 'a1'),
    ('tour — photo 107 (1600 px) | nuage a3, même échelle', HD + 't107.jpg', '0.12,0.18,0.78,0.62', 'a3'),
    ('rangée basse — photo 1 (1600 px) | rangée c1, même échelle, sur le ciel de sa hauteur', HD + 't001.jpg', '0.18,0.45,0.82,0.78', 'c1'),
]
rows = []
for label, ph, box, n in pairs:
    a, b = pair(ph, box, n)
    k = min(1, (W - 8) / (a.width + b.width), 400 / max(a.height, b.height))
    a = a.resize((round(a.width * k), round(a.height * k)), Image.LANCZOS)
    b = b.resize((round(b.width * k), round(b.height * k)), Image.LANCZOS)
    h = max(a.height, b.height)
    row = Image.new('RGB', (W, h + 22), (30, 30, 30))
    x = (W - a.width - b.width - 8) // 2
    row.paste(a, (x, 22))
    row.paste(b, (x + a.width + 8, 22))
    ImageDraw.Draw(row).text((x, 3), f'{label} (réduction commune {k:.2f})', fill=(225, 225, 225), font=FONT)
    rows.append(row)
H = sky.height + 22 + sum(r.height + 8 for r in rows)
board = Image.new('RGB', (W, H), (30, 30, 30))
ImageDraw.Draw(board).text(
    (6, 3),
    "Lot D1 — ciel et nuages à l'ouverture de la scène (cadrage ordinateur, monde 2400 × 1350 jusqu'à l'horizon) ;"
    ' traits blancs : colonne téléphone (760)',
    fill=(225, 225, 225),
    font=FONT,
)
board.paste(sky, (0, 22))
y = sky.height + 30
for r in rows:
    board.paste(r, (0, y))
    y += r.height + 8
board.save(D + 'planches/d1-ciel-nuages.png', optimize=True)
print(D + 'planches/d1-ciel-nuages.png', board.size)
