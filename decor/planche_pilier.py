# planche_pilier.py: board of the pillar (lot D2) -> decor/planches/d2-pilier.png (<= 1800 px wide)
#   python decor/planche_pilier.py [seed]
# Row 1: the pillar at phone scale (1.8 px per unit) on a provisional flat background (clear sky above the horizon,
# meadow green below, not a grass model), beside the owner's mock-up pillar scaled to the same width (lit from the
# right there, from the left here). Row 2: close-up pairs at 2x (1.175 mm per pixel), shown enlarged x2: vesicles and
# lichens (photos 16 and 227 of refcache/decor-lave/hd), foot and moss (photo 3), then the lit face against photo 86
# (enlarged x4), photos resampled to the same millimetres per pixel as the render. Row 3: the pillar at phone scale (1.8 px per unit, not enlarged) in exactly the
# framing of the mock-up crop (190,500)-(420,820), its pillar (x 213-360, y 540-790) mapped onto ours (axis 1200,
# plateau 702, foot 1040: 1.36 units per mock-up pixel), beside the mock-up resampled to the same box.
# Photos stay in refcache (never in a repository); the board is a working file.
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
REF = HERE.parent / 'refcache'
seed = sys.argv[1] if len(sys.argv) > 1 else '1'
tmp = Path(tempfile.mkdtemp())
svg = tmp / 'pilier.svg'
subprocess.run(['node', str(HERE / 'pilier.mjs'), seed, '--out', str(svg)], check=True, capture_output=True)


def render(scale):
    out = tmp / f'r{scale}'
    subprocess.run(['node', str(HERE / 'shot.mjs'), str(svg), '--w', str(int(2400 * scale)), '--out', str(out)], check=True, capture_output=True)
    return Image.open(out / 'pilier.png').convert('RGBA')


def backdrop(im, y0, scale):
    # provisional flat background: sky above the horizon line (y 722), meadow green below
    w, h = im.size
    ys = y0 + np.arange(h) / scale
    sky, sky2 = np.array([200, 218, 236.0]), np.array([150, 186, 226.0])
    g1, g2 = np.array([118, 140, 72.0]), np.array([96, 122, 54.0])
    t = np.clip((722 - ys) / 400, 0, 1)[:, None]
    u = np.clip((ys - 722) / 600, 0, 1)[:, None]
    col = np.where((ys < 722)[:, None], sky * (1 - t) + sky2 * t, g1 * (1 - u) + g2 * u)
    bg = np.repeat(col[:, None, :], w, axis=1)
    a = np.asarray(im).astype(float)
    al = a[..., 3:4] / 255
    return Image.fromarray((a[..., :3] * al + bg * (1 - al)).clip(0, 255).astype(np.uint8))


def crop(full, scale, box):
    x0, y0, x1, y1 = box
    c = full.crop((round(x0 * scale), round(y0 * scale), round(x1 * scale), round(y1 * scale)))
    return backdrop(c, y0, scale)


def photo(name, box, px_per_mm, mm_per_px):
    im = Image.open(REF / 'decor-lave' / 'hd' / name).convert('RGB').crop(box)
    k = 1 / (px_per_mm * mm_per_px)
    return im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)


def label(img, text, pad=18):
    o = Image.new('RGB', (img.width, img.height + pad), (255, 255, 255))
    o.paste(img, (0, pad))
    ImageDraw.Draw(o).text((2, 3), text, fill=(30, 30, 30))
    return o


def hstack(ims, gap=14):
    h = max(i.height for i in ims)
    o = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) - 1), h), (255, 255, 255))
    x = 0
    for i in ims:
        o.paste(i, (x, 0))
        x += i.width + gap
    return o


# row 1: phone scale
f18 = render(1.8)
ours = label(crop(f18, 1.8, (1040, 655, 1460, 1085)), f'pilier.mjs graine {seed} - telephone 1,8 px/unite')
maq = Image.open(REF / 'decor-voiles' / 'maquette-porteur.jpg').convert('RGB').crop((190, 500, 420, 820))
k = (200 * 1.8) / 147
maq = label(maq.resize((round(maq.width * k), round(maq.height * k)), Image.LANCZOS), 'maquette du porteur, meme largeur de pilier')
row1 = hstack([ours, maq], 24)

# row 2: close-ups at 2x (1.175 mm/px), enlarged x2 for reading
f2 = render(2)
Z = 2
mm = 2.35 / 2  # mm per pixel of the 2x render


def big(im):
    return im.resize((im.width * Z, im.height * Z), Image.NEAREST)


p16 = big(photo('hd_016.jpg', (150, 250, 1750, 1850), 18.9, mm))           # 85 mm, scale assumed (10 cm sample)
p227 = big(photo('hd_227.jpg', (500, 200, 1700, 1100), 7.7, mm))            # lichen on lava, scale estimated (25 cm frame)
topc = big(crop(f2, 2, (1108, 696, 1208, 771)))
pairA = hstack([label(p16, 'photo 16 (alveoles, 1:1)'), label(p227, 'photo 227 (lichens, echelle estimee)'), label(topc, 'rendu 2x : haut, cote soleil')], 10)
p3 = big(photo('hd_003.jpg', (60, 1700, 960, 2330), 4.2, mm))               # foot of the block, moss, plaque ~21 cm
footc = big(crop(f2, 2, (1215, 985, 1315, 1060)))
pairB = hstack([label(p3, 'photo 3 (pied, mousse ; plaque 21 cm)'), label(footc, 'rendu 2x : pied, cote ombre')], 10)
# lit face against photo 86 (scoria in full sun, coin scale 11.8 px/mm), same 60 x 48 mm field, enlarged x4
p86 = photo('hd_086.jpg', (640, 420, 1348, 986), 11.8, mm)
p86 = p86.resize((p86.width * 4, p86.height * 4), Image.NEAREST)
facec = crop(f2, 2, (1122, 793, 1148, 813))
facec = facec.resize((facec.width * 4, facec.height * 4), Image.NEAREST)
pairC = hstack([label(p86, 'photo 86 (plein soleil, 1:1)'), label(facec, 'rendu 2x : face au soleil')], 10)
row2 = hstack([pairA, pairB, pairC], 30)

# row 3: phone scale, same framing as the mock-up crop
MB = (190, 500, 420, 820)
k3 = 1.36  # units per mock-up pixel (pillar 147 px -> 200 units, 250 px -> 338 units)
box3 = (1200 + (MB[0] - 286.5) * k3, 702 + (MB[1] - 540) * k3, 1200 + (MB[2] - 286.5) * k3, 702 + (MB[3] - 540) * k3)
ours3 = crop(f18, 1.8, box3)
maq3 = Image.open(REF / 'decor-voiles' / 'maquette-porteur.jpg').convert('RGB').crop(MB).resize(ours3.size, Image.LANCZOS)
row3 = hstack([label(ours3, 'telephone 1,8 px/unite, cadrage de la maquette'), label(maq3, 'maquette, meme cadrage, meme taille')], 24)

W = max(row1.width, row2.width, row3.width)
board = Image.new('RGB', (W, row1.height + row2.height + row3.height + 60), (255, 255, 255))
board.paste(row1, (0, 0))
board.paste(row2, (0, row1.height + 30))
board.paste(row3, (0, row1.height + row2.height + 60))
if board.width > 1800:
    s = 1800 / board.width
    board = board.resize((1800, round(board.height * s)), Image.LANCZOS)
(HERE / 'planches').mkdir(exist_ok=True)
board.save(HERE / 'planches' / 'd2-pilier.png')
print('planches/d2-pilier.png', board.size)
