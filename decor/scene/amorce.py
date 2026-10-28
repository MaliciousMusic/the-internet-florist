"""amorce.py: what makes the shop's landing whole at once, then sharper (owner, 2026-10-28: « si on load des sprites légers
puis lourds on affiche un truc complet direct qui scale en qualité progressivement »). From the frieze's sprites (frise.json:
the strips' tiles and the pillars, frise_cuisson.mjs; bouquets/<id>/sprites/, sprites.mjs) it writes, in decor/out/frise/:

  amorce/affiche-large-<w>.avif|webp, amorce/affiche-colonne-<w>.avif|webp
      the landing as one sharp picture (the camera at rest on the first place, decor/scene/frise.js): every tile, pillar,
      bouquet and foreground clump in view, composited in the canvas's order, over a transparent sky (the sky is CSS), w
      pixels across the world. The page shows it whole from its own HTML once decoded, before any script; the canvas, held
      hidden until all its sprites in view are there, takes its place in one frame. "large": the whole world (a computer);
      "colonne": the VUE units a phone held upright sees, transparent elsewhere (the same box, so one <picture> lays either).
  amorce/feuille-<n>.avif|webp
      every sprite of the frieze at 1/DOWN of its definition, in sheets: what frise.js shows of a piece before its sharp
      sprite has come (anywhere the landing's picture does not cover: the other places, after a swipe, ?b= links).
  amorce.json
      { affiche: { large: [{ w, avif, webp }], colonne: [...], boite: [x, y, w, h] (world), colonneMedia, places },
      feuilles: [pictures], where a picture is { avif: src, webp: src }, cadres: { key: [sheet, x,
      y, w, h] (pixels) }, sprites: { url: index } } where key is a sharp sprite's url as frise.js asks for it, without its
      ?v= ("../out/frise/z3/4.webp", "bouquets/citrine/sprites/frise.webp"), ktx2 maps a decor sprite's key to its
      GPU-compressed picture (ktx2.py, run before), and sprites holds every bouquet's sprites.json
      (boutique.js reads them from here: no file to wait for per bouquet).

  python decor/scene/amorce.py        (after frise_cuisson.mjs / frise_versions.mjs, sprites.mjs and ktx2.py; then build.mjs)
"""
import hashlib, io, json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'out')
FR = os.path.join(OUT, 'frise')
DEST = os.path.join(FR, 'amorce')
WW = 2400
VUE = 850  # frise.js: the world's units a phone held upright sees
DOWN = 6  # the sheets' sprites: a sixth of the sharp sprites' definition (0.2 pixel a world unit)
# the landing's pictures, sharp (owner, 2026-10-28: « ça commence flou puis il y a une vague d'éléments déployés », a
# low-end taste): one per screen class, as wide (pixels over the world's 2400 units) as the screen's device pixels need,
# never finer than the sharp sprites themselves (1.2 a unit), the browser picking by srcset; a phone's column only, its
# box the whole world's (transparent but the column)
LARGES = [1280, 1920, 2880]
COLONNES = [2400, 3360]
SHEET = 2048
GAP = 4  # between two sprites of a sheet, filled by their own edges (no seam where two tiles meet)
# each picture in AVIF (a third lighter at the same look) and in WebP for the browsers without it (the page picks what the
# browser took for the landing's <picture>)
Q = {'WEBP': dict(quality=68, method=6, alpha_quality=80), 'AVIF': dict(quality=50, speed=4)}
Q_AFFICHE = {'WEBP': dict(quality=70, method=6, alpha_quality=80), 'AVIF': dict(quality=56, speed=4)}

fr = json.load(open(os.path.join(FR, 'frise.json'), encoding='utf-8'))
cfg = json.load(open(os.path.join(HERE, 'boutique.json'), encoding='utf-8'))
os.makedirs(DEST, exist_ok=True)
for f in os.listdir(DEST):  # the last bake's pictures (a sheet fewer leaves none behind)
    if f.startswith(('affiche-', 'feuille-')):
        os.remove(os.path.join(DEST, f))
nokey = lambda src: src.split('?')[0]


def lay(n, places):
    """boutique.js's lay(): the product on each place of the frieze"""
    per = -(-places // 3)
    shift = [0, n // 2, n - 2 if n - 2 > 0 else 0]
    out = [((s % per) + shift[s // per]) % n for s in range(places)]
    if n > 2:
        for s in range(places):
            prev = out[(s + places - 1) % places]
            if out[s] == prev:
                out[s] = (out[s] + 1) % n
            if out[s] == out[(s + 1) % places]:
                out[s] = (out[s] + 2) % n if (out[s] + n - 1) % n == prev else (out[s] + n - 1) % n
    return out


# ---------- every sharp sprite of the frieze: key, file, and where the landing shows it (world boxes, canvas order)
pieces = {}  # key -> file


def decor(src):
    key = '../out/frise/' + nokey(src)
    pieces[key] = os.path.join(FR, nokey(src))
    return key


landing = []  # (order, key, x, y, w, h) in world units, the camera at 0
half = WW / 2
order = 0
pil_done = False


def pillars_at_landing():
    global order
    n = fr['places']
    for i in range(-2, 3):
        P = fr['piliers'][i % n]
        src, x, y, w, h = P['apercu']
        key = decor(src)
        X = x + i * fr['pas']
        if X + w > 0 and X < WW:
            landing.append((order, key, X, y, w, h))
            order += 1


for B in fr['bandes']:
    if B['id'] == fr['devant'] and not pil_done:
        pil_done = True
        pillars_at_landing()
    for j, pre in enumerate(B.get('apercus') or []):
        src, x, y, w, h = pre
        key = decor(src)
        # frise.js strip(): tile j laid at x + m * B.w - B.cx + M.cx, for every m of the loop it falls in view
        for m in range(-3, 4):
            X = x + m * B['w'] - B['cx'] + fr['cx']
            if X + w > 0 and X < WW:
                landing.append((order, key, X, y, w, h))
        order += 1
if not pil_done:
    pillars_at_landing()
# every pillar of the loop has its light sprite, not only the landing's
for P in fr['piliers']:
    decor(P['apercu'][0])

slots = lay(len(cfg['produits']), fr['places'])
sprites = {}
for k, p in enumerate(cfg['produits']):
    url = p['bouquet'].replace('manifeste.json', 'sprites/sprites.json')
    idx = json.load(open(os.path.join(HERE, url), encoding='utf-8'))
    sprites[url] = idx
    key = url.replace('sprites.json', '') + idx['frise']['src']
    pieces[key] = os.path.join(HERE, key)
    # its pictures named with a digest of their content, as the decor's (the page's service worker keeps them for good)
    dig = lambda f: hashlib.sha1(open(os.path.join(HERE, url.replace('sprites.json', ''), f), 'rb').read()).hexdigest()[:8]
    idx['frise']['src'] += '?v=' + dig(idx['frise']['src'])
    idx['proche']['sheets'] = [f'{f}?v={dig(f)}' for f in idx['proche']['sheets']]
n = fr['places']
places = []  # the landing's places whose bouquet is in its picture
for i in range(-2, 3):
    p = cfg['produits'][slots[i % n]]
    url = p['bouquet'].replace('manifeste.json', 'sprites/sprites.json')
    F = sprites[url]['frise']
    # frise.js: a place's plane at (i * pas, its pillar's top less the first's); the still sprite lowered by "assise"
    dy = fr['piliers'][i % n]['sommet'] - fr['piliers'][0]['sommet']
    X, Y = F['x'] + i * fr['pas'], F['y'] + sprites[url].get('assise', 0) + dy
    if X + F['w'] > 0 and X < WW:
        landing.append((order + 1, url.replace('sprites.json', '') + nokey(F['src']), X, Y, F['w'], F['h']))
        places.append(i)

# the foreground's clumps (out/premier.json, premier.mjs), at rest (frise.js and insectes.mjs let them sway only once the
# canvas has taken the picture's place): every copy along their strip in view, the farthest first, over the bouquets
clump_files = {}
for c in json.load(open(os.path.join(OUT, 'premier.json'), encoding='utf-8')):
    key = '../out/' + c['src']
    clump_files[key] = os.path.join(OUT, c['src'])
    bx, by, bw, bh = c['box']
    for m in range(-2, 3):
        X = bx + m * fr['touffes']['periode']
        if X + bw > 0 and X < WW:
            landing.append((order + 2 + (100 - c['Z']) / 1000, key, X, by, bw, bh))


def im(key):
    return Image.open(pieces.get(key) or clump_files[key]).convert('RGBA')


def shrink(img, w, h):
    """resampled with its alpha premultiplied (no dark fringes at the edges)"""
    return img.convert('RGBa').resize((max(1, round(w)), max(1, round(h))), Image.LANCZOS).convert('RGBA')


# ---------- the landing's pictures
landing.sort(key=lambda t: t[0])
bx0 = min(t[2] for t in landing)
by0 = min(t[3] for t in landing)
bx1 = max(t[2] + t[4] for t in landing)
by1 = max(t[3] + t[5] for t in landing)
box = [0, max(0, int(by0)), WW, int(by1 + 1) - max(0, int(by0))]


def poster(px, x0, x1, name):
    W, H = round(box[2] * px), round(box[3] * px)
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for _, key, x, y, w, h in landing:
        if x + w <= x0 or x >= x1:
            continue
        a, b = (x - box[0]) * px, (y - box[1]) * px
        ia, ib = int(a // 1), int(b // 1)
        # resampled to its size (area filter), then moved by its subpixel offset, laid on whole pixels
        sw, sh = w * px, h * px
        img = shrink(im(key), sw, sh).convert('RGBa')
        tw, th = int(sw + (a - ia) + 2), int(sh + (b - ib) + 2)
        sx, sy = img.width / sw, img.height / sh
        piece = img.transform((tw, th), Image.AFFINE, (sx, 0, -(a - ia) * sx, 0, sy, -(b - ib) * sy), resample=Image.BICUBIC).convert('RGBA')
        # cut to the canvas (and to the column)
        cx0, cx1 = max(0, ia, round((x0 - box[0]) * px)), min(W, ia + tw, round((x1 - box[0]) * px))
        cy0, cy1 = max(0, ib), min(H, ib + th)
        if cx1 <= cx0 or cy1 <= cy0:
            continue
        canvas.alpha_composite(piece.crop((cx0 - ia, cy0 - ib, cx1 - ia, cy1 - ib)), (cx0, cy0))
    return save(canvas, name, Q_AFFICHE)


def versioned(path):
    h = hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]
    return f'{os.path.relpath(path, FR).replace(os.sep, "/")}?v={h}'


def save(img, name, q):
    out = {}
    for fmt, ext in (('AVIF', 'avif'), ('WEBP', 'webp')):
        path = os.path.join(DEST, f'{name}.{ext}')
        img.save(path, fmt, **q[fmt])
        out[ext] = versioned(path)
    return out


large = [{'w': w, **poster(w / WW, -1e9, 1e9, f'affiche-large-{w}')} for w in LARGES]
col = [{'w': w, **poster(w / WW, WW / 2 - VUE / 2 - 40, WW / 2 + VUE / 2 + 40, f'affiche-colonne-{w}')} for w in COLONNES]

# ---------- the sheets: the landing's pieces first, then the bouquets, then the rest
first = []
for t in landing:
    if t[1] not in first and t[1] in pieces:  # (the clumps are not in the sheets: they come in one go, frise.js)
        first.append(t[1])
rest = [k for k in pieces if k not in first]
bq = [k for k in rest if k.startswith('bouquets/')]
keys = first + bq + [k for k in rest if k not in bq]

cells = []
for key in keys:
    img = im(key)
    cells.append((key, shrink(img, img.width / DOWN, img.height / DOWN)))

sheets = []  # [image, x, y, shelf_h, used_w, used_h]
frames = {}
for key, c in cells:
    w, h = c.width + 2 * GAP, c.height + 2 * GAP
    s = sheets[-1] if sheets else None
    if s and s[1] + w > SHEET:  # a new shelf
        s[1], s[2], s[3] = 0, s[2] + s[3], 0
    if not s or s[2] + h > SHEET:
        s = [Image.new('RGBA', (SHEET, SHEET), (0, 0, 0, 0)), 0, 0, 0, 0, 0]
        sheets.append(s)
    x, y = s[1] + GAP, s[2] + GAP
    sheet = s[0]
    sheet.paste(c, (x, y))
    # its edges carried into the gap, so the linear filtering never reads the empty sheet at a tile's border
    for g in range(1, GAP + 1):
        sheet.paste(c.crop((0, 0, c.width, 1)), (x, y - g))
        sheet.paste(c.crop((0, c.height - 1, c.width, c.height)), (x, y + c.height - 1 + g))
    left = sheet.crop((x, y - GAP, x + 1, y + c.height + GAP))
    right = sheet.crop((x + c.width - 1, y - GAP, x + c.width, y + c.height + GAP))
    for g in range(1, GAP + 1):
        sheet.paste(left, (x - g, y - GAP))
        sheet.paste(right, (x + c.width - 1 + g, y - GAP))
    frames[key] = [len(sheets) - 1, x, y, c.width, c.height]
    s[1] += w
    s[3] = max(s[3], h)
    s[4] = max(s[4], s[1])
    s[5] = max(s[5], s[2] + h)

feuilles = []
for n_, s in enumerate(sheets):
    feuilles.append(save(s[0].crop((0, 0, s[4], s[5])), f'feuille-{n_}', Q))

# the decor's sharp sprites as GPU-compressed textures (ktx2.py), where one is there and up to date: key -> src
ktx2 = {}
for key, path in pieces.items():
    k2 = path[: -len('.webp')] + '.ktx2'
    if key.startswith('../out/frise/') and os.path.exists(k2) and os.path.getmtime(k2) >= os.path.getmtime(path):
        ktx2[key] = versioned(k2)

out = {
    'version': 1,
    'affiche': {
        'large': large,
        'colonne': col,
        'colonneMedia': '(max-aspect-ratio: 1/1)',
        'boite': box,
        'places': places,
        # the name of the bouquet facing the camera at the landing (build.mjs writes it in the page: frise.js's name in the sky)
        'nom': cfg['produits'][slots[0]]['nom'],
    },
    'feuilles': feuilles,
    'cadres': frames,
    'ktx2': ktx2,
    'sprites': sprites,
}
json.dump(out, open(os.path.join(FR, 'amorce.json'), 'w', encoding='utf-8', newline='\n'), separators=(',', ':'))
kb = lambda p: f'{os.path.getsize(os.path.join(FR, nokey(p["avif"]))) // 1024}/{os.path.getsize(os.path.join(FR, nokey(p["webp"]))) // 1024}'
sizes = lambda L: ', '.join(str(a['w']) + ' ' + kb(a) for a in L)
print(
    f'(Ko AVIF/WebP) affiches : large {sizes(large)} ; colonne {sizes(col)} (boite {box}) ; '
    f'{len(frames)} sprites sur {len(feuilles)} feuille(s) : {", ".join(kb(f) for f in feuilles)} ; '
    f'amorce.json {os.path.getsize(os.path.join(FR, "amorce.json")) // 1024} Ko'
)
