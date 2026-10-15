# planche_sol.py: board D3 of the ground (decor/planches/d3-sol.png, 1800 px wide) from the renders of
# sol_rendu.mjs (decor/out/sol/): the whole scene at the desktop framing (sky + horizon + sol), the phone column at
# 1.8 px per unit beside the owner's mock-up at the same framing (both shown at 50 %), the lower column at 1.8 px per
# unit at 100 %, then the 2x close-ups (last stone and the pillar's foot; nearest whole stone).
#
#   node decor/sol_rendu.mjs && python decor/planche_sol.py
import json
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SOL = os.path.join(HERE, 'out', 'sol')
MAQ = os.path.join(HERE, '..', 'refcache', 'decor-voiles', 'maquette-porteur.jpg')
OUT = os.path.join(HERE, 'planches', 'd3-sol.png')
W = 1800
BG = (24, 24, 24)
try:
    FONT = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 17)
except OSError:
    FONT = ImageFont.load_default()


def label(img, text):
    band = Image.new('RGB', (img.width, 26), BG)
    ImageDraw.Draw(band).text((6, 4), text, fill=(225, 225, 225), font=FONT)
    out = Image.new('RGB', (img.width, img.height + 26), BG)
    out.paste(band, (0, 0))
    out.paste(img, (0, 26))
    return out


def row(images, gap=12):
    h = max(i.height for i in images)
    w = sum(i.width for i in images) + gap * (len(images) - 1)
    out = Image.new('RGB', (w, h), BG)
    x = 0
    for i in images:
        out.paste(i, (x, 0))
        x += i.width + gap
    return out


rows = []
scene = Image.open(os.path.join(SOL, 'scene.png')).convert('RGB')
rows.append(label(scene, 'Scène entière, cadrage ordinateur (0,75 px/unité) : ciel.svg + horizon.svg + sol.svg'))

col = Image.open(os.path.join(SOL, 'col.png')).convert('RGB')
half = col.resize((col.width // 2, col.height // 2), Image.LANCZOS)
maq = Image.open(MAQ).convert('RGB')
maq = maq.resize((half.width, round(maq.height * half.width / maq.width)), Image.LANCZOS).crop((0, 0, half.width, half.height))
rows.append(row([label(half, 'Colonne téléphone x 820-1580, rendue à 1,8 px/unité (montrée à 50 %)'),
                 label(maq, 'Maquette du porteur, même cadrage (9:16)')]))

low = col.crop((0, round(880 * 1.8), col.width, col.height))
rows.append(label(low, 'Colonne téléphone, bas du cadre (y 880-1350) à 1,8 px/unité, 100 %'))

crops = json.load(open(os.path.join(SOL, 'sol-crops.json')))
d = Image.open(os.path.join(SOL, 'near-dernier.png')).convert('RGB')
p = Image.open(os.path.join(SOL, 'near-proche.png')).convert('RGB')
k = min(1.35, (W - 12) / (d.width + p.width))
d2 = d.resize((round(d.width * k), round(d.height * k)), Image.LANCZOS)
p2 = p.resize((round(p.width * k), round(p.height * k)), Image.LANCZOS)
rows.append(row([label(d2, f'2x : dernière dalle et pied du pilier (x {crops["dernier"][0]}-{crops["dernier"][2]})'),
                 label(p2, f'2x : dalle entière la plus proche (x {crops["proche"][0]}-{crops["proche"][2]})')]))

H = sum(r.height for r in rows) + 14 * (len(rows) - 1)
board = Image.new('RGB', (W, H), BG)
y = 0
for r in rows:
    board.paste(r, ((W - r.width) // 2, y))
    y += r.height + 14
os.makedirs(os.path.dirname(OUT), exist_ok=True)
board.save(OUT, optimize=True)
print(OUT, board.size)
