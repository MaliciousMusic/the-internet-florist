"""rast.py: a small SVG rasterizer for the head sheets (subset used by svDraw): g, path, use, clipPath, linearGradient, filter blur,
fill/stroke (+opacity), fill-rule, transform translate. Usage: rast.py in.svg out.png [scale]"""
import sys, re, math
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

NS = '{http://www.w3.org/2000/svg}'
TOK = re.compile(r'[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:[eE]-?\d+)?')


def tag(e):
    return e.tag.replace(NS, '')


def path_polys(d):
    t = TOK.findall(d or '')
    i = 0; cmd = None; x = y = 0; sx = sy = 0; polys = []; cur = []; lc = None

    def num():
        nonlocal i
        v = float(t[i]); i += 1; return v
    while i < len(t):
        if re.match(r'[A-Za-z]', t[i]):
            cmd = t[i]; i += 1
            if cmd in 'Zz':
                if cur: cur.append((sx, sy)); polys.append(cur); cur = []
                x, y = sx, sy; continue
        c = cmd; rel = c.islower(); C = c.upper()
        if C == 'M':
            a, b = num(), num()
            if rel: a += x; b += y
            if cur: polys.append(cur)
            x, y = a, b; sx, sy = x, y; cur = [(x, y)]; cmd = 'l' if rel else 'L'
        elif C == 'L':
            a, b = num(), num()
            if rel: a += x; b += y
            x, y = a, b; cur.append((x, y))
        elif C == 'H':
            a = num(); x = a + (x if rel else 0); cur.append((x, y))
        elif C == 'V':
            b = num(); y = b + (y if rel else 0); cur.append((x, y))
        elif C in 'CS':
            if C == 'C':
                x1, y1 = num(), num()
                if rel: x1 += x; y1 += y
            else:
                x1, y1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
            x2, y2, x3, y3 = num(), num(), num(), num()
            if rel: x2 += x; y2 += y; x3 += x; y3 += y
            for k in range(1, 9):
                s = k / 8; u = 1 - s
                cur.append((u**3 * x + 3 * u * u * s * x1 + 3 * u * s * s * x2 + s**3 * x3, u**3 * y + 3 * u * u * s * y1 + 3 * u * s * s * y2 + s**3 * y3))
            lc = (x2, y2); x, y = x3, y3; continue
        elif C in 'QT':
            if C == 'Q':
                x1, y1 = num(), num()
                if rel: x1 += x; y1 += y
            else:
                x1, y1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
            x3, y3 = num(), num()
            if rel: x3 += x; y3 += y
            for k in range(1, 7):
                s = k / 6; u = 1 - s
                cur.append((u * u * x + 2 * u * s * x1 + s * s * x3, u * u * y + 2 * u * s * y1 + s * s * y3))
            lc = (x1, y1); x, y = x3, y3; continue
        elif C == 'A':
            rx, ry, rot, la, sw, a, b = num(), num(), num(), num(), num(), num(), num()
            if rel: a += x; b += y
            # approximate: half-ellipse bulge through the midpoint
            mx, my = (x + a) / 2, (y + b) / 2; dx, dy = a - x, b - y; l = math.hypot(dx, dy) or 1
            nx, ny = -dy / l, dx / l; sgn = 1 if sw else -1
            for k in range(1, 9):
                s = k / 8; ang = math.pi * s
                px = x + dx * s + nx * sgn * ry * math.sin(ang); py = y + dy * s + ny * sgn * ry * math.sin(ang)
                cur.append((px, py))
            x, y = a, b
        else:
            i += 1
        lc = None
    if cur: polys.append(cur)
    return polys


def parse_col(c):
    if not c or c == 'none': return None
    c = c.strip()
    if c.startswith('#'):
        h = c[1:]
        if len(h) == 3: h = ''.join(ch * 2 for ch in h)
        return np.array([int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)], float) / 255
    if c.startswith('url('): return c[5:-1]
    named = {'white': '#ffffff', 'black': '#000000'}
    return parse_col(named.get(c, '#808080'))


class R:
    def __init__(s, root, W, H, k):
        s.W, s.H, s.k = W, H, k; s.ids = {}
        for e in root.iter():
            if e.get('id'): s.ids[e.get('id')] = e

    def mask(s, polys, rule, off=(0, 0)):
        im = Image.new('L', (s.W, s.H), 0)
        if rule == 'evenodd':
            acc = np.zeros((s.H, s.W), np.uint8)
            for p in polys:
                if len(p) < 3: continue
                m = Image.new('L', (s.W, s.H), 0)
                ImageDraw.Draw(m).polygon([((x + off[0]) * s.k, (y + off[1]) * s.k) for x, y in p], fill=1)
                acc ^= np.asarray(m)
            return acc.astype(np.float32)
        d = ImageDraw.Draw(im)
        for p in polys:
            if len(p) >= 3: d.polygon([((x + off[0]) * s.k, (y + off[1]) * s.k) for x, y in p], fill=255)
        return np.asarray(im, np.float32) / 255

    def smask(s, polys, w, off=(0, 0)):
        im = Image.new('L', (s.W, s.H), 0); d = ImageDraw.Draw(im); ww = max(1, int(round(w * s.k)))
        for p in polys:
            q = [((x + off[0]) * s.k, (y + off[1]) * s.k) for x, y in p]
            if len(q) >= 2: d.line(q, fill=255, width=ww, joint='curve')
            r = ww / 2
            for (x, y) in (q[0], q[-1]) if q else []:
                d.ellipse([x - r, y - r, x + r, y + r], fill=255)
        return np.asarray(im, np.float32) / 255

    def paint(s, val):
        """a colour array (H,W,3) and an opacity factor (H,W) for a fill value"""
        if isinstance(val, str):
            g = s.ids.get(val)
            if g is None: return np.full((s.H, s.W, 3), .5, np.float32), 1.0
            st = [(float(x.get('offset', 0)), parse_col(x.get('stop-color', '#808080')), float(x.get('stop-opacity', 1))) for x in g if tag(x) == 'stop']
            if not st: return np.full((s.H, s.W, 3), .5, np.float32), 1.0
            x1, y1, x2, y2 = [float(g.get(a, 0)) * s.k for a in ('x1', 'y1', 'x2', 'y2')]
            yy, xx = np.mgrid[0:s.H, 0:s.W].astype(np.float32)
            dx, dy = x2 - x1, y2 - y1; l2 = dx * dx + dy * dy or 1
            t = np.clip(((xx - x1) * dx + (yy - y1) * dy) / l2, 0, 1)
            offs = np.array([a for a, _, _ in st]); cols = np.array([c for _, c, _ in st]); ops = np.array([o for _, _, o in st])
            col = np.stack([np.interp(t, offs, cols[:, j]) for j in range(3)], -1)
            return col.astype(np.float32), np.interp(t, offs, ops).astype(np.float32)
        return np.broadcast_to(val.astype(np.float32), (s.H, s.W, 3)), 1.0

    def clipmask(s, ref):
        cp = s.ids.get(ref[5:-1]) if ref else None
        if cp is None: return None
        m = np.zeros((s.H, s.W), np.float32)
        for c in cp:
            e = c
            if tag(c) == 'use': e = s.ids.get((c.get('href') or c.get('{http://www.w3.org/1999/xlink}href') or '')[1:])
            if e is None: continue
            rule = c.get('clip-rule') or e.get('clip-rule') or 'nonzero'
            m = np.maximum(m, s.mask(path_polys(e.get('d')), rule))
        return m

    def draw(s, e, layer, inh):
        t = tag(e)
        if t in ('defs', 'clipPath', 'linearGradient', 'radialGradient', 'filter', 'title'): return
        a = dict(inh); a.update({k: v for k, v in e.attrib.items() if k not in ('id', 'clip-path', 'filter', 'transform', 'opacity')})
        own = e.get('clip-path') or e.get('filter') or e.get('opacity') or e.get('transform')
        tgt = layer
        if own: tgt = np.zeros_like(layer)
        if t in ('g', 'svg'):
            for c in e: s.draw(c, tgt, a)
        elif t in ('path', 'use'):
            src = e
            if t == 'use':
                src = s.ids.get((e.get('href') or e.get('{http://www.w3.org/1999/xlink}href') or '')[1:])
                if src is None: return
                b = {k: v for k, v in src.attrib.items() if k != 'id'}; b.update({k: v for k, v in a.items() if k != 'href'}); a = b
            polys = path_polys(src.get('d'))
            off = (0, 0)
            tr = e.get('transform') or ''
            m0 = re.match(r'translate\(([-\d.e]+)[ ,]+([-\d.e]+)\)', tr)
            if m0: off = (float(m0.group(1)), float(m0.group(2)))
            fo = float(a.get('fill-opacity', 1)); so = float(a.get('stroke-opacity', 1))
            fill = parse_col(a.get('fill', '#000000'))
            if fill is not None:
                m = s.mask(polys, a.get('fill-rule', 'nonzero'), off)
                col, op = s.paint(fill); al = (m * op * fo)[..., None]
                tgt[..., :3] = tgt[..., :3] * (1 - al) + col * al; tgt[..., 3:] = tgt[..., 3:] * (1 - al) + al
            st = parse_col(a.get('stroke'))
            if st is not None:
                m = s.smask(polys, float(a.get('stroke-width', 1)), off)
                col, op = s.paint(st); al = (m * op * so)[..., None]
                tgt[..., :3] = tgt[..., :3] * (1 - al) + col * al; tgt[..., 3:] = tgt[..., 3:] * (1 - al) + al
        if own:
            f = e.get('filter')
            if f:
                fe = s.ids.get(f[5:-1]); sd = 1.0
                if fe is not None:
                    for c in fe:
                        if tag(c) == 'feGaussianBlur': sd = float(c.get('stdDeviation', 1))
                r = sd * s.k
                if r > .3:
                    pm = tgt.copy(); pm[..., :3] *= pm[..., 3:]
                    ch = [np.asarray(Image.fromarray((np.clip(pm[..., j], 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32) / 255 for j in range(4)]
                    al = np.clip(ch[3], 1e-6, 1); tgt = np.stack([ch[0] / al, ch[1] / al, ch[2] / al, ch[3]], -1)
            cm = s.clipmask(e.get('clip-path'))
            al = tgt[..., 3] * float(e.get('opacity', 1))
            if cm is not None: al = al * cm
            al = al[..., None]
            layer[..., :3] = layer[..., :3] * (1 - al) + tgt[..., :3] * al; layer[..., 3:] = layer[..., 3:] * (1 - al) + al


def main():
    src, out = sys.argv[1], sys.argv[2]; k = float(sys.argv[3]) if len(sys.argv) > 3 else 2
    root = ET.parse(src).getroot()
    vb = [float(x) for x in root.get('viewBox').split()]
    W, H = int(vb[2] * k), int(vb[3] * k)
    r = R(root, W, H, k)
    bg = parse_col(root.get('data-bg') or '#e9e4dc')
    layer = np.zeros((H, W, 4), np.float32); layer[..., :3] = bg; layer[..., 3] = 1
    for c in root: r.draw(c, layer, {})
    img = Image.fromarray((np.clip(layer[..., :3], 0, 1) * 255).astype(np.uint8))
    import os
    ok = float(os.environ.get('OUTK', '1')); img = img.resize((int(vb[2] * ok), int(vb[3] * ok)), Image.LANCZOS)
    img.save(out)


main()
