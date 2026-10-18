"""img.py: small image tools for the flower sheets (one call, one compact result; to keep image reads few and small).

  python img.py zoom <in.png> "x0,y0,x1,y1;x0,y0,x1,y1..." [--h 280] [--out z.png]   crops side by side at one height (pixels of the sheet)
  python img.py cell <in.png> <cols> <rows> "c,r;c,r..." [--h 280] [--out z.png]      the same by grid cell (a shot.sh grid: stages x rows)
  python img.py diff <a.png> <b.png> [--t 24] [--out d.png]                           how much changed (share of pixels, box), and a map
  python img.py small <in.png> [--w 900] [--out s.jpg]                                 a lighter copy to look at (fewer tokens)
  python img.py pair <photo.jpg> "x0,y0,x1,y1" <render.png> "x0,y0,x1,y1"|"c,r@D" [--kind bud|cup] [--op .6] [--h 420] [--w 900] [--out p.png]
      a kept photograph (cropped) beside the rendered cell (a shot.sh grid cell: column c, row r, head size D), --h px high and --w px wide at most
      (420 and 900 by default; pipe.py's refaire.sh asks --h 1100 --w 2400 so the judge sees tips, zones and translucency),
      and the silhouette measures of both (the subject: the blob at the centre of the crop): height/width (a bud's slenderness),
      width/height (a cup), the opening angle (how far the sides part from the axis, measured on a profile), against the brief
  python img.py ring <render.png> "c,r@D"|"x0,y0,x1,y1" [--ref "#base,#body,#tip"]
      the colour of a rendered head seen face on, as fleur-coloris measures a photo (refs.py ring): median of the base (centre .12-.35 of the radius),
      body (.35-.7) and tip (.7-.95) rings of the silhouette, and their CIE76 distance to the measured colourway (--ref)
  python img.py dbgp <shot.json>
      the patched pairs of a dbgp=1 sheet summed by kind: pieces tagged w<whorl>.<i>/<n> (svBlossom) grouped by whorl and circular distance
      (w0 d1: neighbours of the first whorl, w0 d0: a piece over itself, w0-w1: across whorls); untagged names apart (o/i/h: the anemone scheme)
  python img.py jn <plant.png> <shot.json> [--t 120] [--out j.png] [--pick "op,wl;..."]
      the junctions of a woody branch rendered with plant=1&jn=1: one tile per flower state (closed bud, swelling bud, half open, open, faded .35,
      faded .85) and view (face, three-quarter, profile, behind: the z of the flower's axis), the biggest flower of each, centred on its foot (the
      pedicel's end), plus a row of spur ends; prints per state the flowers' drawn width/height over D (the flower's size against its fD)
  python img.py sheet <big.png> "x0,y0,x1,y1" "A:fx0,fy0,fx1,fy1;B:..." [--h 2000] [--out s.png]
      a close-up plate of a woody branch rendered very large (plant=1&cell=2000): the whole branch (its box in pixels) beside lettered magnifiers
      (boxes as fractions of the whole picture), each framed on the whole view; one image instead of several zooms"""
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
    W, cap = tiles[0].width + tiles[1].width + 8, int(o.get('w', 900))
    if W > cap:
        k = cap / W
        tiles = [t.resize((max(1, int(t.width * k)), max(1, int(t.height * k))), Image.LANCZOS) for t in tiles]
        W = cap
    oi = Image.new('RGB', (W, tiles[0].height), '#e9e4dc')
    oi.paste(tiles[0], (0, 0))
    oi.paste(tiles[1], (W - tiles[1].width, 0))
    fn = o.get('out', p[3].replace('.png', '_p.png'))
    oi.save(fn)
    print(fn, oi.size)
    print(chr(10).join(out))

def lab(h):
    """#rrggbb or (r,g,b) -> CIE L*a*b* (D65)"""
    if isinstance(h, str):
        h = h.lstrip('#'); h = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    def lin(c):
        c /= 255
        return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
    r, g, b = (lin(float(c)) for c in h)
    X, Y, Z = (r * .4124 + g * .3576 + b * .1805) / .95047, r * .2126 + g * .7152 + b * .0722, (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return (116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z)))


def ring(a):
    import numpy as np
    o, p = opts(a)
    im = Image.open(p[1]).convert('RGB').crop(cellbox(p[2]))
    mk = blob(im, (233, 228, 220), 18)
    if mk is None:
        print('pas de silhouette'); return
    A = np.asarray(im).astype(float)
    ys, xs = np.nonzero(mk)
    cy, cx = ys.mean(), xs.mean()
    d = np.hypot(ys - cy, xs - cx); R = np.percentile(d, 97)
    refs = o.get('ref', '').split(',') if o.get('ref') else []
    out = []
    for k, (r0, r1) in enumerate(((.12, .35), (.35, .7), (.7, .95))):
        sel = (d >= r0 * R) & (d < r1 * R)
        px = A[ys[sel], xs[sel]]
        if not len(px):
            out.append('-'); continue
        m = tuple(int(v) for v in np.median(px, axis=0))
        hx = '#%02x%02x%02x' % m
        t = ('base', 'corps', 'pointe')[k] + ' ' + hx
        if k < len(refs):
            L1, L2 = lab(m), lab(refs[k])
            t += ' (ref %s, dE %.1f, dL %+.1f)' % (refs[k], sum((x - y) ** 2 for x, y in zip(L1, L2)) ** .5, L1[0] - L2[0])
        out.append(t)
    print(' | '.join(out))


def sheet(a):
    o, p = opts(a)
    im = Image.open(p[1]).convert('RGB')
    x0, y0, x1, y1 = (int(float(v)) for v in p[2].split(','))
    whole = im.crop((x0, y0, x1, y1))
    H = int(o.get('h', 2000))
    k = H / whole.height
    wv = whole.resize((max(1, int(whole.width * k)), H), Image.LANCZOS)
    from PIL import ImageDraw
    dr = ImageDraw.Draw(wv)
    mags = []
    for it in p[3].split(';'):
        nm, b = it.split(':')
        fx0, fy0, fx1, fy1 = (float(v) for v in b.split(','))
        bx = (x0 + fx0 * whole.width, y0 + fy0 * whole.height, x0 + fx1 * whole.width, y0 + fy1 * whole.height)
        mags.append((nm, im.crop(tuple(int(v) for v in bx))))
        dr.rectangle([fx0 * wv.width, fy0 * H, fx1 * wv.width, fy1 * H], outline='#8a8478', width=2)
        dr.text((fx0 * wv.width + 4, fy0 * H + 2), nm, fill='#5a5248')
    # the magnifiers in one column, sharing the height, each scaled to the column width
    cw = int(H * .55)
    tiles = []
    for nm, t in mags:
        s = cw / t.width
        tiles.append((nm, t.resize((cw, max(1, int(t.height * s))), Image.LANCZOS)))
    tot = sum(t.height for _, t in tiles) + 10 * (len(tiles) - 1)
    if tot > H:
        s = H / tot
        tiles = [(nm, t.resize((max(1, int(t.width * s)), max(1, int(t.height * s))), Image.LANCZOS)) for nm, t in tiles]
    o2 = Image.new('RGB', (wv.width + 16 + max(t.width for _, t in tiles), H), '#e9e4dc')
    o2.paste(wv, (0, 0))
    dr2 = ImageDraw.Draw(o2)
    y = 0
    for nm, t in tiles:
        o2.paste(t, (wv.width + 16, y)); dr2.text((wv.width + 20, y + 4), nm, fill='#5a5248'); y += t.height + 10
    fn = o.get('out', p[1].replace('.png', '_sheet.png'))
    o2.save(fn)
    print(fn, o2.size)


def dbgp(a):
    import re, collections
    t = open(a[1], encoding='utf-8').read()
    c, other, tot = collections.Counter(), collections.Counter(), 0
    for x, y, n in re.findall(r'([\w.?/]+)-([\w.?/]+):(\d+)', t):
        n = int(n); tot += n
        m1, m2 = re.match(r'w(\d+)\.(\d+)/(\d+)', x), re.match(r'w(\d+)\.(\d+)/(\d+)', y)
        if m1 and m2:
            w1, i1, n1 = map(int, m1.groups()); w2, i2, _ = map(int, m2.groups())
            if w1 == w2:
                d = abs(i1 - i2); c['w%d d%d' % (w1, min(d, n1 - d))] += n
            else:
                c['w%d-w%d' % (min(w1, w2), max(w1, w2))] += n
        else:
            other['-'.join(sorted(re.sub(r'\.\d+/\d+', '', v) for v in (x, y)))] += n
    print('tagged', sum(c.values()), '|', ' '.join('%s:%d' % kv for kv in c.most_common(10)), '| other', sum(other.values()), ' '.join('%s:%d' % kv for kv in other.most_common(4)))


def jn(a):
    """the junction tiles of a plant=1&jn=1 sheet (see the head of the file)"""
    import re, json
    from PIL import ImageDraw
    o, p = opts(a)
    im = Image.open(p[1]).convert('RGB')
    txt = open(p[2], encoding='utf-8').read()
    J = json.loads(re.search(r' JN (\[.*?\]) SE ', txt).group(1))
    SE = json.loads(re.search(r' SE (\[.*?\]) BR ', txt).group(1))
    BR = json.loads(re.search(r' BR (\[.*\])', txt).group(1))
    T = int(o.get('t', 120))
    states = [('bud', lambda q: q[5] < .12 and q[6] < .2), ('swell', lambda q: .12 <= q[5] < .3 and q[6] < .2), ('half', lambda q: .3 <= q[5] < .8 and q[6] < .2),
              ('open', lambda q: q[5] >= .8 and q[6] < .2), ('f.35', lambda q: .25 <= q[6] < .5), ('f.85', lambda q: q[6] >= .7)]
    views = [('face', lambda z: z > .7), ('3/4', lambda z: .35 < z <= .7), ('prof', lambda z: -.35 <= z <= .35), ('back', lambda z: z < -.35)]
    lod = o.get('lod')
    rows = []
    for vn, vf in views:
        row = []
        for sn, sf in states:
            c = [q for q in J if sf(q) and vf(q[4]) and (lod is None or q[7] == int(lod))]
            c.sort(key=lambda q: -q[3])
            row.append(c[0] if c else None)
        rows.append((vn, row))
    print('flowers', len(J), 'spurs', len(SE), '| branch (cm) w x h, fD:', ' '.join('%gx%g/%g' % tuple(b) for b in BR[:6]))
    for sn, sf in states:
        c = [q for q in J if sf(q)]
        if c:
            import statistics as st
            gp = [q[10] for q in c if len(q) > 10]
            print('%-5s n %3d  drawn W/D med %.2f max %.2f  H/D med %.2f  lod %s  gap>0: %d (max %s mm; by view f/3q/p/b %s)' % (sn, len(c), st.median(q[8] for q in c), max(q[8] for q in c), st.median(q[9] for q in c),
                  ','.join('%d:%d' % (l, sum(1 for q in c if q[7] == l)) for l in (0, 1, 2) if any(q[7] == l for q in c)), sum(1 for g in gp if g > 0), max(gp) if gp else '-',
                  '/'.join(str(sum(1 for q in c if len(q) > 10 and q[10] > 0 and vf(q[4]))) for _, vf in views)) +
                  ('  order: ped over face %d, under back %d' % (sum(1 for q in c if q[11] == 1), sum(1 for q in c if q[11] == 2)) if len(c[0]) > 11 else ''))
    out = Image.new('RGB', (T * 6 + 40, T * 5 + 14), '#e9e4dc')
    d = ImageDraw.Draw(out)
    for i, (sn, _) in enumerate(states):
        d.text((40 + i * T + 4, 1), sn, fill='black')
    rr = sorted(q[3] for q in J)[len(J) // 2] if J else 20
    for r, (vn, row) in enumerate(rows + [('spur', [None] * 6)]):
        d.text((2, 14 + r * T + T // 2), vn, fill='black')
        for i in range(6):
            if vn == 'spur':
                s = [x for x in SE if x[0] == i]
                if not s:
                    continue
                q = s[len(s) // 2]
                x, y, h = q[1], q[2], rr * 1.6
            else:
                q = row[i]
                if not q:
                    continue
                x, y = q[1], q[2]
                h = q[3] * (1.25 if q[5] < .3 and q[6] < .2 else 1.9)
            t = im.crop((int(x - h), int(y - h), int(x + h), int(y + h))).resize((T - 4, T - 4), Image.LANCZOS)
            out.paste(t, (40 + i * T, 14 + r * T))
            if vn != 'spur':
                d.text((40 + i * T + 2, 14 + r * T + T - 16), 'l%d z%.1f' % (q[7], q[4]), fill='#a00')
    f = o.get('out', p[1].replace('.png', '_jn.png'))
    out.save(f)
    print(f, out.size)


if __name__ == '__main__':
    o, p = opts(sys.argv[1:])
    cmd = p[0]
    if cmd in ('pair', 'ring', 'sheet', 'dbgp', 'jn'):
        {'pair': pair, 'ring': ring, 'sheet': sheet, 'dbgp': dbgp, 'jn': jn}[cmd](sys.argv[1:])
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
