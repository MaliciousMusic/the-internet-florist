"""film_planche.py: the contact sheet of a film.mjs film: each frame the page painted, with its time since the navigation
began, four to a row (planche.png in the film's folder).

  python decor/scene/film_planche.py <film dir>
"""
import json, os, sys
from PIL import Image, ImageDraw

d = sys.argv[1]
film = json.load(open(os.path.join(d, 'film.json'), encoding='utf-8'))
frames = film['frames']
ims = [Image.open(os.path.join(d, n)).convert('RGB') for n, _ in frames]
if not ims:
    sys.exit('aucune image')
w = 400
ims = [im.resize((w, round(im.height * w / im.width))) for im in ims]
h = max(im.height for im in ims)
cols = 4
rows = -(-len(ims) // cols)
sheet = Image.new('RGB', (cols * w, rows * (h + 16)), 'white')
draw = ImageDraw.Draw(sheet)
for k, (im, (_, t)) in enumerate(zip(ims, frames)):
    x, y = (k % cols) * w, (k // cols) * (h + 16)
    sheet.paste(im, (x, y + 16))
    draw.text((x + 4, y + 2), f'{t} ms', fill='black')
sheet.save(os.path.join(d, 'planche.png'))
print(f'planche : {len(ims)} images')
