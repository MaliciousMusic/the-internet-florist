# From a textured 3D model fitted on the reference photograph (glbkit.py) to the vessel's SVG body, measured on the photograph.
# The model gives the exact shape (normals, positions, texture coordinates) in any view; the photograph gives the light and the
# material. Nothing of the photograph is embedded: only curves leave.
#   1. material labels on the model (its own texture, e.g. gold carp against patina);
#   2. the photograph's response to the light, per material, as a function of the surface orientation and height ("matcap"),
#      measured on the photo-view maps;
#   3. what the matcap misses (darker heads, patina clouds, engraving tones) as a ratio baked into the model's texture space;
#   4. the same material, matcap and ratio applied in the wanted view (photo for the measures, shop for the product);
#   5. the colour field written as nested tone bands per material, clipped to the material, softened by a small blur.
#   .venv-depth/Scripts/python glb2svg.py <vase> photo|shop [dy=5 step=2.5 blur=.6 q=.05]
import sys, os, json, math, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import svgkit, mesure  # noqa: E402

A = sys.argv[1:]
VASE, VIEW = A[0], A[1]
OPT = dict(a.split('=') for a in A[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
OUT = os.path.join(HERE, VASE, 'out')
CFG = json.load(open(os.path.join(HERE, VASE, 'glb2svg.json'), encoding='utf-8'))
t0 = time.time()


def maps(view):
    g = lambda k: np.load(os.path.join(OUT, 'glb_%s_%s.npy' % (view, k)))
    return dict(normal=g('normal'), mask=g('mask'), pos=g('pos'), albedo=g('albedo'))


def labels(M):
    """material index per pixel from the model's own texture (rules of <vase>/glb2svg.json), smoothed"""
    lab = mesure.to_lab(np.clip(M['albedo'][..., ::-1] * 255, 0, 255).astype(np.uint8))
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    out = np.full(M['mask'].shape, len(CFG['materials']) - 1, np.int32)
    for i, mt in enumerate(CFG['materials'][:-1]):
        sel = eval(mt['rule'], {'L': L, 'a': a, 'b': b, 'np': np})
        sel = cv2.medianBlur(sel.astype(np.uint8) * 255, 5) > 127
        out[sel & (out == len(CFG['materials']) - 1)] = i
    out[~M['mask']] = -1
    return out


def srgb2lin(c):
    c = c / 255.0
    return np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)


def lin2srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= .0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - .055) * 255


NB, NH = 32, 6


def features(M):
    n = M['normal']
    h = np.clip(M['pos'][..., 1], 0, 1)
    return n[..., 0], n[..., 1], h


def fill(grid, w):
    """carry known bins into empty ones, ring by ring (mean of the known neighbours), then smooth lightly"""
    g = grid.copy(); k = w > 0
    for _ in range(64):
        if k.all():
            break
        num = sum(np.roll(np.roll(np.where(k[..., None], g, 0), dy, 0), dx, 1) for dy in (-1, 0, 1) for dx in (-1, 0, 1))
        den = sum(np.roll(np.roll(k.astype(float), dy, 0), dx, 1) for dy in (-1, 0, 1) for dx in (-1, 0, 1))
        new = ~k & (den > 0)
        g[new] = num[new] / den[new][:, None]
        k = k | new
    return cv2.GaussianBlur(g.astype(np.float32), (0, 0), .7)


def bin_index(nx, ny, h, nh):
    ix = np.clip(((nx + 1) / 2 * NB).astype(int), 0, NB - 1)
    iy = np.clip(((ny + 1) / 2 * NB).astype(int), 0, NB - 1)
    ih = np.clip((h * nh).astype(int), 0, nh - 1)
    return ix, iy, ih


def fit_matcap():
    """per material: mean linear colour of the photograph by (orientation, height) bin"""
    M = maps('photo')
    ph = cv2.imread(os.path.join(OUT, 'ref.jpg'))
    lin = srgb2lin(ph[..., ::-1].astype(np.float64))
    lab_ = labels(M)
    pm = mesure.silhouette(ph)
    inner = cv2.erode((pm & M['mask']).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    nx, ny, h = features(M)
    caps = []
    for i, mt in enumerate(CFG['materials']):
        nh = mt.get('heights', NH)
        sel = inner & (cv2.erode((lab_ == i).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)
        ix, iy, ih = bin_index(nx[sel], ny[sel], h[sel], nh)
        acc = np.zeros((nh, NB, NB, 3)); w = np.zeros((nh, NB, NB))
        np.add.at(acc, (ih, iy, ix), lin[sel]); np.add.at(w, (ih, iy, ix), 1)
        cap = np.zeros_like(acc)
        for k in range(nh):
            g = np.where(w[k][..., None] > 0, acc[k] / np.maximum(w[k], 1)[..., None], 0)
            if (w[k] > 0).sum() == 0 and k > 0:
                cap[k] = cap[k - 1]; continue
            cap[k] = fill(g, w[k])
        caps.append(cap)
        print('matcap %-8s %7d px, %d bins filled' % (mt['name'], sel.sum(), (w > 0).sum()))
    # the ratio photo / matcap, baked in texture space (u, v) so it follows the model into another view
    pred = shade(M, lab_, caps, ratio=None)
    r = np.where(inner[..., None], lin / np.maximum(pred, 1e-4), 1.0)
    r = np.clip(r, .25, 4)
    UV = uvmap('photo')
    T = 1024
    acc = np.zeros((T, T, 3)); w = np.zeros((T, T))
    sel = inner
    u = np.clip((UV[..., 0][sel] * T).astype(int), 0, T - 1); v = np.clip((UV[..., 1][sel] * T).astype(int), 0, T - 1)
    np.add.at(acc, (v, u), np.log(r[sel])); np.add.at(w, (v, u), 1)
    known = w > 0
    lr = np.where(known[..., None], acc / np.maximum(w, 1)[..., None], 0)
    # spread into unseen texels a little (seams, grazing faces), elsewhere ratio 1
    lr, kk = svgkit.extend(lr.astype(np.float32), known, 6)
    np.save(os.path.join(OUT, 'glb2svg_ratio.npy'), lr.astype(np.float32))
    np.save(os.path.join(OUT, 'glb2svg_ratio_known.npy'), kk)
    np.save(os.path.join(OUT, 'glb2svg_caps.npy'), np.array(caps, dtype=object), allow_pickle=True)
    print('ratio baked: %d texels (%.1fs)' % (known.sum(), time.time() - t0))
    return caps


def uvmap(view):
    """texture coordinates of each pixel (glbkit maps: the depth pass carries u, v)"""
    return np.load(os.path.join(OUT, 'glb_%s_uv.npy' % view))


def shade(M, lab_, caps, ratio=None, UV=None):
    nx, ny, h = features(M)
    col = np.zeros(M['mask'].shape + (3,))
    for i, mt in enumerate(CFG['materials']):
        sel = lab_ == i
        if not sel.any():
            continue
        cap = caps[i]; nh = cap.shape[0]
        # bilinear in orientation, linear in height
        fx = np.clip((nx[sel] + 1) / 2 * NB - .5, 0, NB - 1.001); fy = np.clip((ny[sel] + 1) / 2 * NB - .5, 0, NB - 1.001)
        fh = np.clip(h[sel] * nh - .5, 0, nh - 1.001)
        x0, y0, h0 = fx.astype(int), fy.astype(int), fh.astype(int)
        ax, ay, ah = fx - x0, fy - y0, fh - h0
        x1, y1, h1 = np.minimum(x0 + 1, NB - 1), np.minimum(y0 + 1, NB - 1), np.minimum(h0 + 1, nh - 1)
        c = 0
        for hh, wh in ((h0, 1 - ah), (h1, ah)):
            c = c + wh[:, None] * ((1 - ay)[:, None] * ((1 - ax)[:, None] * cap[hh, y0, x0] + ax[:, None] * cap[hh, y0, x1])
                                   + ay[:, None] * ((1 - ax)[:, None] * cap[hh, y1, x0] + ax[:, None] * cap[hh, y1, x1]))
        col[sel] = c
    if ratio is not None and UV is not None:
        T = ratio.shape[0]
        mx = (UV[..., 0] * T - .5).astype(np.float32); my = (UV[..., 1] * T - .5).astype(np.float32)
        lr = cv2.remap(ratio, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        col = col * np.exp(np.where(M['mask'][..., None], lr, 0))
    return col


def main():
    caps = fit_matcap()
    lr = np.load(os.path.join(OUT, 'glb2svg_ratio.npy'))
    M = maps(VIEW)
    lab_ = labels(M)
    col = lin2srgb(shade(M, lab_, caps, ratio=lr * F('ratio', 1), UV=uvmap(VIEW)))
    H, W = M['mask'].shape
    prev = col.astype(np.uint8)[..., ::-1].copy(); prev[~M['mask']] = 255
    cv2.imwrite(os.path.join(OUT, 'glb2svg_%s_field.png' % VIEW), prev)
    # ---------------------------------------------------------------- vector
    if VIEW == 'photo':
        mapf = lambda x, y: (x, y)
        q = F('q', .1); vb = '0 0 %d %d' % (W, H); k = 1.0
    else:
        cam = json.load(open(os.path.join(OUT, 'glb_shop_cam.json')))
        k = H / ((CFG['hcm'] + 2) * svgkit.UPC)
        ys = np.where(M['mask'].any(1))[0]; yfoot = ys.max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
        q = F('q', .05)
        x0, y0 = mapf(0, 0); x1, y1 = mapf(W, H); vb = '%g %g %g %g' % (x0, y0, x1 - x0, y1 - y0)
    # the inside of the mouth: model points well inside the outer radius at their height (seen through the mouth)
    pos = M['pos']; r = np.hypot(pos[..., 0], pos[..., 2]); hh = pos[..., 1]
    hb = np.clip((hh * 200).astype(int), 0, 199)
    rout = np.zeros(200)
    np.maximum.at(rout, hb[M['mask']], r[M['mask']])
    inside = M['mask'] & (r < rout[hb] - F('wall', .025)) & (hh > .6)
    svgkit.RDP_EPS = F('rdp', .5); svgkit.AREA_MIN = F('amin', 6 * k * k)
    step, dy = F('step', 2.5) * k, F('dy', 5)
    defs = ['<filter id="gb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', .5))]
    parts = {'body': [], 'mouth': []}
    nb = 0
    hh_ = np.clip(pos[..., 1], 0, 1)
    for i, mt in reversed(list(enumerate(CFG['materials']))):
        # a material whose hue drifts with height (patina) is cut in horizontal slices, each with its own tone bands
        ns = int(OPT.get('slices_' + mt['name'], mt.get('slices', 1)))
        for zone, zm in [(z, m_ & (hh_ >= s / ns) & (hh_ < (s + 1) / ns if s < ns - 1 else hh_ <= 1.01)) for z, m_ in (('mouth', inside), ('body', ~inside))
                         for s in range(ns)]:
            mask = (lab_ == i) & zm & M['mask']
            if mask.sum() < 30:
                continue
            grow = int(round(F('grow', 1.5) * k))
            mask = cv2.dilate(mask.astype(np.uint8), np.ones((2 * grow + 1, 2 * grow + 1), np.uint8)).astype(bool) & M['mask']
            f = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), .8)
            od = svgkit.contour_paths(f, .5, step, q, mapf, 1.0)
            if not od:
                continue
            cid = 'c%s%d_%d' % (zone[0], i, nb)
            defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, od))
            bb = svgkit.bands(col, mask, mapf, q, step, dy=dy * mt.get('dyk', 1.0))
            nb += len(bb)
            if not bb:
                continue
            parts[zone].append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#gb)">%s</g></g>' % (
                cid, bb[0][0], od, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
    sil = svgkit.contour_paths(cv2.GaussianBlur(M['mask'].astype(np.float32), (0, 0), .8), .5, step, q, mapf, 1.0)
    gcol = svgkit.hexc(np.median(col[(lab_ == len(CFG['materials']) - 1) & ~inside], 0))
    base = '<path fill="%s" d="%s"/>' % (gcol, sil)
    # the fine relief (engraved scales, fin rays, outlines): the high-pass of the lightness, as thin dark and light shapes
    det = ''
    if F('detail', 1) > 0:
        Y = cv2.cvtColor(np.clip(col, 0, 255).astype(np.uint8)[..., ::-1], cv2.COLOR_BGR2GRAY).astype(np.float32)
        # carry the field past the silhouette first, or the outline itself reads as a light line
        Ye, _ = svgkit.extend(Y, M['mask'], int(4 * F('dsig', 2.2) * k))
        hp = Ye - cv2.GaussianBlur(Ye, (0, 0), F('dsig', 2.2) * k)
        if F('donly_gold', 1) > 0:
            hp[lab_ != 0] *= F('dpat', .25)                # the patina is smooth: keep its fine tones faint
        hp[~cv2.erode(M['mask'].astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)] = 0
        svgkit.AREA_MIN = F('damin', 1.5 * k * k); svgkit.RDP_EPS = F('drdp', .35)
        for sign, colr, lev, op in ((-1, '#2a1406', F('dlev', 9), F('dop', .55)), (1, '#fff2d6', F('dlev', 9) * 1.3, F('lop', .45))):
            d = svgkit.contour_paths((sign * hp).astype(np.float32), lev, F('dstep', 1.2) * k, q, mapf, 1.0)
            if d:
                det += '<path fill="%s" fill-opacity="%s" d="%s"/>' % (colr, svgkit.fmt(op), d)
    body, mouth = base + ''.join(parts['body']) + det, ''.join(parts['mouth'])
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (vb, ''.join(defs), mouth, body)
    open(os.path.join(OUT, 'glb2svg_%s.svg' % VIEW), 'w').write(svg)
    print('%s: %d bands, svg %.0f Ko (%.0fs)' % (VIEW, nb, len(svg) / 1024, time.time() - t0))
    if VIEW == 'shop':
        import gzip
        d = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), body, mouth=mouth)
        js = json.dumps(d, separators=(',', ':')).encode()
        print('body.json %.0f Ko, gzip %.1f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))
        # the catalogue entry: profile of the outer surface, mouth inner radius, in shop units
        U = CFG['hcm'] * svgkit.UPC
        top = max(i for i in range(200) if rout[i] > 0)
        prof = [[round(i / 199 * U, 1), round(float(rout[min(top, int(i / 199 * 199))]) * U, 1)] for i in range(0, 200, 8)]
        rin = r[inside & (hh > hh[inside].max() - .02)].max() if inside.any() else rout[top] * .8
        fiche = dict(CFG['fiche'], prof=prof, h=round(U, 1), mo=round(float(rin) * U, 1), svgb=CFG['fiche'].get('svgb', VASE))
        json.dump(fiche, open(os.path.join(OUT, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False)


if __name__ == '__main__':
    main()
