"""planche_voiles.py: the owner's board of the sky and its light veils, decor/planches/d1-ciel-voiles.png (<= 1800 px).

1-2. The scene from the top to the horizon (world y 0-800), desktop framing, variant "mesure" then "maquette", with
     out/horizon.svg on top and the phone column (x 820-1580) marked by two thin lines; veils at t = 0 s.
3.   The phone column (x 820-1580, y 0-800) of each variant next to the owner's mock-up (its rows 0-607 of 1024, the
     same world height), all at the same height.
4-5. Two pairs, HD photo | render, at the same sky scale (photo pixels per unit of sky height = rows to the horizon /
     722): photo 166 (lower sky, t .45-1), then a close-up of photo 173 magnified x2, beside a render crop at that scale.
Photos stay in refcache/ (never committed); planches/.gitignore keeps the board out of git.
Run after: node decor/voiles.mjs && node decor/ciel.mjs"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
try:
    FONT = ImageFont.truetype('arial.ttf', 14)
except OSError:
    FONT = ImageFont.load_default()
W = 1800
BG = (30, 30, 30)
TXT = (225, 225, 225)
D = 'decor/'
TMP = tempfile.mkdtemp()
HD = 'refcache/decor-voiles/hd/'
MAQ = 'refcache/decor-voiles/maquette-porteur.jpg'


def compose(name, *args):
    out = os.path.join(TMP, name + '.png')
    subprocess.run(['node', D + 'compose.mjs', out, *args], check=True, capture_output=True)
    im = Image.open(out).convert('RGBA')
    flat = Image.new('RGBA', im.size, BG + (255,))
    flat.alpha_composite(im)
    return flat.convert('RGB')


def label(img, text):
    row = Image.new('RGB', (W, img.height + 22), BG)
    row.paste(img, ((W - img.width) // 2, 22))
    ImageDraw.Draw(row).text(((W - img.width) // 2 + 2, 3), text, fill=TXT, font=FONT)
    return row


rows = []
# 1-2: desktop framing, both variants
for v, txt in (('mesure', 'Variante « mesuré » : haut #4e90ca (ciels de plein jour mesurés)'),
               ('maquette', 'Variante « maquette » : haut #7ba4d4 (le #7da4d0 de la maquette ramené au plein jour)')):
    im = compose('pano-' + v, '--ciel', f'ciel-{v}.svg', '--horizon', '--sol', '#687938', '--col', '--box', '0,0,2400,800', '--scale', '0.75')
    rows.append(label(im, f'{txt} ; ras #dde6ee ; cadrage ordinateur, monde y 0-800, voiles à t = 0 s ; sol plat provisoire ; traits : colonne téléphone'))

# 3: phone columns beside the mock-up, same height
H3 = 600
cols = []
for v in ('mesure', 'maquette'):
    cols.append(compose('col-' + v, '--ciel', f'ciel-{v}.svg', '--horizon', '--sol', '#687938', '--box', '820,0,1580,800', '--scale', str(H3 / 800)))
mq = Image.open(MAQ).convert('RGB').crop((0, 0, 572, 607))
mq = mq.resize((round(572 * H3 / 607), H3), Image.LANCZOS)
gap = 12
strip = Image.new('RGB', (sum(c.width for c in cols) + mq.width + 2 * gap, H3), BG)
x = 0
for c in (cols[0], mq, cols[1]):
    strip.paste(c, (x, 0))
    x += c.width + gap
rows.append(label(strip, 'Colonne téléphone (x 820-1580, y 0-800) : « mesuré » | maquette du porteur (même hauteur de monde) | « maquette »'))


# 4-5: HD pairs at the same sky scale
def pair(photo, yh_row, pbox, wbox, k, text, mag=1.0):
    """photo crop pbox (px) | render of world box wbox at the photo's scale k (px per unit), both magnified by mag."""
    ph = Image.open(HD + photo).convert('RGB').crop(pbox)
    r = compose('pair-' + photo, '--ciel', 'ciel-mesure.svg', '--box', ','.join(str(v) for v in wbox), '--scale', f'{k:.4f}')
    if mag != 1:
        ph = ph.resize((round(ph.width * mag), round(ph.height * mag)), Image.LANCZOS)
        r = r.resize((round(r.width * mag), round(r.height * mag)), Image.LANCZOS)
    s = min(1, (W - 8) / (ph.width + r.width))
    if s < 1:
        ph = ph.resize((round(ph.width * s), round(ph.height * s)), Image.LANCZOS)
        r = r.resize((round(r.width * s), round(r.height * s)), Image.LANCZOS)
    h = max(ph.height, r.height)
    im = Image.new('RGB', (ph.width + r.width + 8, h), BG)
    im.paste(ph, (0, 0))
    im.paste(r, (ph.width + 8, 0))
    return label(im, text + (f' (réduction commune {s:.2f})' if s < 1 else ''))


# photo 166: horizon at row 726 of 1440 -> k = 726 / 722 px per unit; lower sky t .45-1 (rows 327-726)
k = 726 / 722
rows.append(pair('h166.jpg', 726, (330, 327, 330 + 880, 726), (820, 325, 820 + round(880 / k), 722), k,
                 'Photo 166 (FrenchCobber, CC BY-SA 3.0), bas du ciel t .45-1, 1 px ≈ 1 unité | rendu « mesuré », même échelle'))
# photo 173: horizon at row 587 -> k = 587 / 722; close-up x2 on the wisps of the lower sky (t .55-.95)
k = 587 / 722
rows.append(pair('h173.jpg', 587, (700, 323, 700 + 440, 323 + 235), (1020, 397, 1020 + round(440 / k), 397 + round(235 / k)), k,
                 'Gros plan ×2 : photo 173 (Cobber17, CC BY 3.0), traînées du bas du ciel | rendu « mesuré », même échelle (≈ 1,6 px par unité, échelle téléphone)', mag=2))

Htot = 26 + sum(r.height + 10 for r in rows)
board = Image.new('RGB', (W, Htot), BG)
ImageDraw.Draw(board).text((6, 4), 'Lot D1 — ciel et voiles légers du tiers bas (plein jour), horizon posé dessus. Deux variantes du bleu du haut, à choisir.', fill=TXT, font=FONT)
y = 26
for r in rows:
    board.paste(r, (0, y))
    y += r.height + 10
board.save(D + 'planches/d1-ciel-voiles.png', optimize=True)
print(D + 'planches/d1-ciel-voiles.png', board.size)
