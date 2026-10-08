"""img.py: small image tools for the flower sheets (one call, one compact result; to keep image reads few and small).

  python img.py zoom <in.png> "x0,y0,x1,y1;x0,y0,x1,y1..." [--h 280] [--out z.png]   crops side by side at one height (pixels of the sheet)
  python img.py cell <in.png> <cols> <rows> "c,r;c,r..." [--h 280] [--out z.png]      the same by grid cell (a shot.sh grid: stages x rows)
  python img.py diff <a.png> <b.png> [--t 24] [--out d.png]                           how much changed (share of pixels, box), and a map
  python img.py small <in.png> [--w 900] [--out s.jpg]                                 a lighter copy to look at (fewer tokens)
  python img.py pair <photo.jpg> "x0,y0,x1,y1" <render.png> "x0,y0,x1,y1"|"c,r@D" [--kind bud|cup] [--op .6] [--h 420] [--out p.png]
      a kept photograph (cropped) beside the rendered cell (a shot.sh grid cell: column c, row r, head size D), 900 px wide at most,
      and the silhouette measures of both (the subject: the blob at the centre of the crop): height/width (a bud's slenderness),
      width/height (a cup), the opening angle (how far the sides part from the axis, measured on a profile), against the brief"""
import sys
from collections import deque
from PIL import Image, ImageChops


def opts(a):
    o, p, j = {}, [], 0
    while j < len(a):
        if a[j].startswith('--'):
            o[a[j][2:]] = a[j + 1]
            j += 2
        else:
            p.append(a[j])
            j += 1
    return o, p


def strip(boxes, im, h, out):
    tiles = []
    for b in boxes:
        t = im.crop(b)
        s = h / t.height
        tiles.append(t.resize((max(1, int(t.width * s)), h), Image.LANCZOS))
    W = sum(t.width for t in tiles) + 8 * (len(tiles) - 1)
    o = Image.new('RGB', (W, h), '#e9e4dc')
    x = 0
    for t in tiles:
        o.paste(t, (x, 0))
        x += t.width + 8
    o.save(out)
    print(out, o.size)



# the targets of the brief (tulipe-simple): bud height/width, cup width/height by opening, the sides' angle from the axis (degrees)
BRIEF = {'bud': ('H/W', 1.6, 2.0), 'cup.6': ('W/H', .75, .9), 'cup.85': ('W/H', .85, 1.05), 'angle': (0, 18)}


def blob(im, bg=None, tol=None):
    """the silhouette at the centre of a crop: pixels away from the background (the crop's corners), the component holding the centre"""
    import numpy as np
    a = np.asarray(im.convert('RGB')).astype(int)
    h, w, _ = a.shape
    if bg is None:
        k = max(2, min(h, w) // 12)
        cs = np.concatenate([a[:k, :k].reshape(-1, 3), a[:k, -k:].reshape(-1, 3), a[-k:, :k].reshape(-1, 3), a[-k:, -k:].reshape(-1, 3)])
        bg = np.median(cs, axis=0)
    m = np.abs(a - np.array(bg)).sum(axis=2) > (tol or 24)
    cy, cx = h // 2, w // 2
    if not m[cy, cx]:
        ys, xs = np.nonzero(m)
        if not len(ys):
            return None
        i = np.argmin((ys - cy) ** 2 + (xs - cx) ** 2)
        cy, cx = ys[i], xs[i]
    seen = np.zeros_like(m)
    q = deque([(cy, cx)])
    seen[cy, cx] = 1
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not seen[yy, xx]:
                seen[yy, xx] = 1
                q.append((yy, xx))
    return seen


def measure(mask):
    import numpy as np, math
    ys, xs = np.nonzero(mask)
    if not len(ys):
        return None
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    H, W = y1 - y0 + 1, x1 - x0 + 1
    def wid(f):
        y = int(y1 - f * (H - 1))
        r = np.nonzero(mask[y])[0]
        return (r.max() - r.min() + 1) if len(r) else 0
    w25, w80 = wid(.25), wid(.8)
    ang = math.degrees(math.atan2((w80 - w25) / 2, .55 * H))
    return {'H/W': H / W, 'W/H': W / H, 'angle': ang, 'px': (W, H)}


def cellbox(spec):
    if '@' in spec:
        cr, D = spec.split('@')
        c, r = [float(v) for v in cr.split(',')]
        D = float(D)
        g = D * 1.15
        x0, y0 = D * .2 + g * c, D * .1 + g * (r - .12)
        return (max(0, int(x0)), max(0, int(y0)), int(x0 + g), int(y0 + g))
    return tuple(int(float(v)) for v in spec.split(','))


def pair(a):
    o, p = opts(a)
    ph = Image.open(p[1]).convert('RGB').crop(cellbox(p[2]))
    rd = Image.open(p[3]).convert('RGB').crop(cellbox(p[4]))
    kind, op = o.get('kind', 'cup'), o.get('op', '1')
    out = []
    for name, im, bg in (('photo', ph, None), ('rendu', rd, (233, 228, 220))):
        mk = blob(im, bg, 60 if bg is None else 18)
        mm = measure(mk) if mk is not None else None
        if mm:
            out.append(f"{name}: H/W {mm['H/W']:.2f}  W/H {mm['W/H']:.2f}  angle {mm['angle']:.0f} deg  ({mm['px'][0]}x{mm['px'][1]} px)")
        else:
            out.append(f'{name}: pas de silhouette')
    if kind == 'bud':
        t = BRIEF['bud']
        out.append(f'brief: bouton H/W {t[1]} a {t[2]}')
    else:
        t = BRIEF['cup.6'] if float(op) < .75 else BRIEF['cup.85']
        out.append(f"brief: coupe op {op} W/H {t[1]} a {t[2]} ; angle des flancs (profil) {BRIEF['angle'][0]} a {BRIEF['angle'][1]} deg")
    h = int(o.get('h', 420))
    tiles = [im.resize((max(1, int(im.width * h / im.height)), h), Image.LANCZOS) for im in (ph, rd)]
    W = tiles[0].width + tiles[1].width + 8
    if W > 900:
        k = 900 / W
        tiles = [t.resize((max(1, int(t.width * k)), max(1, int(t.height * k))), Image.LANCZOS) for t in tiles]
        W = 900
    oi = Image.new('RGB', (W, tiles[0].height), '#e9e4dc')
    oi.paste(tiles[0], (0, 0))
    oi.paste(tiles[1], (W - tiles[1].width, 0))
    fn = o.get('out', p[3].replace('.png', '_p.png'))
    oi.save(fn)
    print(fn, oi.size)
    print(chr(10).join(out))

if __name__ == '__main__':
    o, p = opts(sys.argv[1:])
    cmd = p[0]
    if cmd == 'pair':
        pair(sys.argv[1:])
        sys.exit(0)
    if cmd == 'zoom':
        im = Image.open(p[1]).convert('RGB')
        boxes = [tuple(int(float(v)) for v in b.split(',')) for b in p[2].split(';')]
        strip(boxes, im, int(o.get('h', 280)), o.get('out', p[1].replace('.png', '_z.png')))
    elif cmd == 'cell':
        im = Image.open(p[1]).convert('RGB')
        cols, rows = int(p[2]), int(p[3])
        cw, ch = im.width / cols, im.height / rows
        boxes = []
        for b in p[4].split(';'):
            c, r = [int(v) for v in b.split(',')]
            boxes.append((int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch)))
        strip(boxes, im, int(o.get('h', 280)), o.get('out', p[1].replace('.png', '_c.png')))
    elif cmd == 'diff':
        a, b = Image.open(p[1]).convert('RGB'), Image.open(p[2]).convert('RGB')
        if a.size != b.size:
            print('sizes differ', a.size, b.size)
            sys.exit(1)
        d = ImageChops.difference(a, b).convert('L')
        t = int(o.get('t', 24))
        m = d.point(lambda v: 255 if v > t else 0)
        import numpy as np; n = int((np.asarray(m) > 0).sum())
        print(f'changed {n / (a.width * a.height) * 100:.2f}% of pixels (>{t}), box {m.getbbox()}')
        if 'out' in o:
            Image.composite(Image.new('RGB', a.size, '#ff0040'), a.convert('L').convert('RGB'), m).save(o['out'])
    elif cmd == 'small':
        im = Image.open(p[1]).convert('RGB')
        w = int(o.get('w', 900))
        if im.width > w:
            im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
        out = o.get('out', p[1].rsplit('.', 1)[0] + '_s.jpg')
        im.save(out, quality=82)
        print(out, im.size)
