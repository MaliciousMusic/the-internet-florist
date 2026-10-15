"""planche_d2.py: the owner's board of the stepping stones, decor/planches/d2-dalles.png (<= 1800 px wide).

Top: the phone column (x 820-1580, y 700-1350) at 1.8 px per unit over a provisional plain meadow, the pillar as a grey
rectangle. Below: two close-up pairs, reference photo in 1920 px | render at 2x the world, at the same scale (the photo
is scaled so that its stone has the width of ours in pixels):
  1. a near stone with its grass   (photo 57, low camera over a lawn)
  2. the side and the top          (photo 178, thick stones with their side in shade)
Photos of third parties: the board stays local (planches/.gitignore = *).
Run after: node decor/dalles.mjs --json ; node decor/planche_d2.mjs"""
import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'decor')
HD = os.path.join(ROOT, 'refcache', 'decor-dalles', 'hd')
try:
    FONT = ImageFont.truetype('arial.ttf', 15)
except OSError:
    FONT = ImageFont.load_default()
W = 1800

# reference crops (fractions of the photo) and the width of their stone in photo pixels (measured on the HD file)
PHOTOS = {
    'near': ('hd_057.jpg', (380, 1120, 1150, 1440), 570),  # nearest whole stone, lawn, low camera
    'edge': ('hd_178.jpg', (760, 1000, 1460, 1250), 595),  # front side and top of a thick stone
}


def pair(name, label):
    crops = json.load(open(os.path.join(D, 'out', 'd2', 'crops.json'), encoding='utf-8'))
    r = Image.open(os.path.join(D, 'out', 'd2', name + '.png')).convert('RGB')
    stone_px = crops['stone_px'] * 2  # our stone width at 2x
    f, box, wpx = PHOTOS[name]
    ph = Image.open(os.path.join(HD, f)).convert('RGB').crop(box)
    k = stone_px / wpx
    ph = ph.resize((round(ph.width * k), round(ph.height * k)), Image.LANCZOS)
    h = max(r.height, ph.height)
    kk = min(1, (W - 8) / (ph.width + r.width), 520 / h)
    if kk < 1:
        ph = ph.resize((round(ph.width * kk), round(ph.height * kk)), Image.LANCZOS)
        r = r.resize((round(r.width * kk), round(r.height * kk)), Image.LANCZOS)
    h = max(r.height, ph.height)
    row = Image.new('RGB', (W, h + 24), (30, 30, 30))
    x = (W - ph.width - r.width - 8) // 2
    row.paste(ph, (x, 24))
    row.paste(r, (x + ph.width + 8, 24))
    ImageDraw.Draw(row).text((x, 4), f'{label} (photo x{k:.2f}, réduction commune {kk:.2f})', fill=(225, 225, 225), font=FONT)
    return row


def main():
    col = Image.open(os.path.join(D, 'out', 'd2', 'col.png')).convert('RGB')
    rows = [
        pair('near', 'dalle proche et son herbe — photo 57 (1920 px) | rendu à 2×, même largeur de dalle'),
        pair('edge', 'tranche et dessus — photo 178 (1920 px) | rendu à 2×, même largeur de dalle'),
    ]
    head = 24
    Hh = head + col.height + 8 + sum(r.height + 8 for r in rows)
    board = Image.new('RGB', (W, Hh), (30, 30, 30))
    ImageDraw.Draw(board).text(
        (6, 4),
        'Lot D2 — pas japonais : colonne téléphone x 820-1580, y 700-1350, à 1,8 px par unité ; fond de pré provisoire,'
        ' pilier figuré en gris',
        fill=(225, 225, 225),
        font=FONT,
    )
    board.paste(col, ((W - col.width) // 2, head))
    y = head + col.height + 8
    for r in rows:
        board.paste(r, (0, y))
        y += r.height + 8
    out = os.path.join(D, 'planches', 'd2-dalles.png')
    board.save(out, optimize=True)
    print(out, board.size)


if __name__ == '__main__':
    sys.exit(main())
