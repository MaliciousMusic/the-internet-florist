# The lily vase in pate-de-verre (cast, satin-frosted glass): form and pose from the untextured GLB (Pink Lily Glass), the
# glass computed on it, written as SVG with a true transparency (an SVG mask), so what stands behind shows through.
#   - thickness: the GLB seen from the front and from behind (front faces culled); thin = pale and clear, thick = deep colour;
#   - colour: the glass's own palette along the height (green foot, yellow, milky white, mauve-pink lilies), measured on the
#     photograph as palette stops only (the photograph's pixels are never laid on the model);
#   - light: satin glass scatters, so a soft diffuse with a glow where the glass is thin and the light passes through, broad
#     frosted sheens, bright edges where a petal's rim catches the light, shadows in the hollows between petals;
#   - transparency: opacity grows with thickness; written as nested white areas in an SVG mask.
#   .venv-depth/Scripts/python verrelys.py [tag] [key=value ...]   -> lys-mauves/out/glbsvg_<tag>.svg, field_<tag>.png
import sys, os, json, gzip, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit, svgkit  # noqa: E402

A = sys.argv[1:]
TAG = A[0] if A and '=' not in A[0] else 'a'
OPT = dict(a.split('=', 1) for a in A if '=' in a)
VASE = OPT.get('vase', 'lys-mauves')
KIND = OPT.get('kind', 'cristal' if VASE == 'cristal-violet' else 'pate')
CFG = os.path.join(HERE, VASE, 'verre.json')
if os.path.exists(CFG):
    OPT = dict(json.load(open(CFG)), **OPT)
OUT = os.path.join(HERE, VASE, 'out')
F = lambda k, d: float(OPT.get(k, d))
T0 = time.time()
log = lambda *a: print('[%5.1fs]' % (time.time() - T0), *a, flush=True)
LUM = np.array([.3, .59, .11])


def lab2rgb(L):
    a = np.asarray(L, np.float32).reshape(-1, 1, 3)
    return cv2.cvtColor(a, cv2.COLOR_Lab2RGB).reshape(np.shape(L))


def rgb2lab(c):
    a = np.asarray(c, np.float32).reshape(-1, 1, 3)
    return cv2.cvtColor(a, cv2.COLOR_RGB2Lab).reshape(np.shape(c))


def palette(ph, pm, h, m):
    """the glass's colour along the height: per band of model height, the median CIELAB of the photograph's brightest half
    (its satin glass under the light, without the shadows) -> stops (h, rgb), smoothed"""
    rgb = ph[..., ::-1].astype(np.float32) / 255
    lab = rgb2lab(rgb)
    sel = pm & m
    # the body's ramp on the photograph's central column only (lower down, petals hanging over the sides would mix in)
    xs = np.where(sel.any(0))[0]; ax = (xs.min() + xs.max()) / 2; hwid = (xs.max() - xs.min()) / 2
    col_ = np.abs(np.arange(sel.shape[1]) - ax)[None, :] < F('colw', .1) * hwid
    sel = sel & (col_ | (h > F('crown', .62)))
    hb = np.linspace(0, 1, 21)
    stops = []
    for a, b in zip(hb[:-1], hb[1:]):
        z = sel & (h >= a) & (h < b)
        if z.sum() < 200:
            continue
        Lz = lab[z]
        Lz = Lz[Lz[:, 0] >= np.percentile(Lz[:, 0], F('ppct', 45))]
        stops.append(((a + b) / 2, np.median(Lz, 0)))
    H_ = np.array([s[0] for s in stops]); C = np.array([s[1] for s in stops])
    C = np.stack([np.convolve(np.pad(C[:, i], 1, mode='edge'), [.25, .5, .25], 'valid') for i in range(3)], 1)
    return H_, C


def occlusion(depth, m, k):
    d = np.where(m, depth, 0).astype(np.float32); w = m.astype(np.float32)
    ao = np.zeros_like(d)
    for rad, wt in ((2, .3), (6, .4), (16, .3)):
        num = cv2.GaussianBlur(d, (0, 0), rad * k); den = np.maximum(cv2.GaussianBlur(w, (0, 0), rad * k), 1e-4)
        ao += wt * np.clip((d - num / den) / (F('aod', .01) * rad), 0, 1)
    return np.where(m, ao, 0)


def nested(f, sel, lev_max, step, q, mapf, k):
    fe, _ = svgkit.extend(f.astype(np.float32), sel, int(3 * k) + 1)
    fe = np.where(cv2.dilate(sel.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0, fe, 0).astype(np.float32)
    out = []
    top = min(float(fe[sel].max()) if sel.any() else 0, lev_max)
    for lev in np.arange(.5, top + .01, 1.0):
        d = svgkit.contour_paths(fe, float(lev), step, q, mapf, 1.0)
        if d:
            out.append('<path d="%s"/>' % d)
    return out


def crystal(fr_, m, th, dep, k, cav=None):
    """cut crystal tinted amethyst, engraved: the GLB's texture says where the glass is engraved (its light, lilac areas =
    frosted, milky) and where it stays clear (its purple = the tint of the clear glass). Clear glass: tinted by its thickness,
    mostly transparent, the studio refracted through it (light above, dark floor), mirrored crisply on its polished faces;
    frosted glass: satin, nearly opaque, lit softly."""
    alb = np.clip(fr_['albedo'], 0, 1).astype(np.float32)
    n = fr_['normal']
    nb = np.dstack([cv2.GaussianBlur(np.where(m, n[..., i], 0), (0, 0), F('nblur', .8) * k) for i in range(3)])
    nb /= np.maximum(np.linalg.norm(nb, axis=2, keepdims=True), 1e-6)
    lab = rgb2lab(alb)
    Lb = float(np.percentile(lab[..., 0][m], F('lclear', 35)))
    fro = np.clip((lab[..., 0] - Lb - F('fro0', 8)) / F('frospan', 18), 0, 1)
    fro = cv2.GaussianBlur(np.where(m, fro, 0).astype(np.float32), (0, 0), .6 * k)
    tint = hexrgb(OPT.get('tint', '#a2558f'))
    # clear glass: what it transmits = the studio behind, bent by the faces (a vertical gradient, bright above), times the tint
    # thickness seen by the ray, from the GLB (a cut crystal is solid at its sides: deep colour along the silhouette)
    cm = np.zeros(m.shape, bool) if cav is None else (cav['mask'] & m)
    if cav is not None:
        # a clean cavity: per row, the span of the narrowed model (its relief ignored), the bottom rounded like an egg
        rows = np.where(cm.any(1))[0]
        xc = np.array([np.where(cm[y])[0].mean() for y in rows]); hw = np.array([np.ptp(np.where(cm[y])[0]) / 2 for y in rows])
        hw = np.convolve(np.pad(hw, 15, mode='edge'), np.ones(31) / 31, 'valid'); xc = np.convolve(np.pad(xc, 15, mode='edge'), np.ones(31) / 31, 'valid')
        yb = rows.max(); rr = F('cavround', 1.3) * np.median(hw)
        hw = hw * np.sqrt(np.clip((yb - rows) / rr, 0, 1))
        cm = np.zeros(m.shape, bool); X = np.arange(m.shape[1])
        for y, c_, w_ in zip(rows, xc, hw):
            cm[y] = np.abs(X - c_) <= w_
        cm &= m
        # its slope from its own outline (a smooth oval wall)
        dist = cv2.distanceTransform(cm.astype(np.uint8), cv2.DIST_L2, 5)
        dist = cv2.GaussianBlur(np.minimum(dist, 25 * k), (0, 0), 2 * k)
        gx = cv2.Sobel(dist, cv2.CV_32F, 1, 0, ksize=3) / 8; gy = cv2.Sobel(dist, cv2.CV_32F, 0, 1, ksize=3) / 8
        cav = dict(cav, normal=np.dstack([-gx * 2, -gy * 2, np.ones_like(gx)]) / np.sqrt(1 + 4 * (gx * gx + gy * gy))[..., None])
        # through the cavity the ray crosses two thin walls; around it, solid glass
        th = np.where(cm, F('cavth', .03), np.maximum(th, F('solid', .16)))
        th = cv2.GaussianBlur(th.astype(np.float32), (0, 0), 1.2 * k)
        cn = cav['normal']
        # the cavity wall bends the ray the other way (glass to air): its slope adds to the outer face's
        w = cv2.GaussianBlur(cm.astype(np.float32), (0, 0), 1.0 * k)[..., None]
        nb = nb * (1 - w) + (nb - F('cavrefr', .9) * np.dstack([cn[..., 0], cn[..., 1], np.zeros_like(cn[..., 0])])) * w
        nb /= np.maximum(np.linalg.norm(nb, axis=2, keepdims=True), 1e-6)
    g = 1 - np.exp(-th / F('t0', .05))
    tr = np.clip(tint ** (g * F('tk', 2.2))[..., None] if False else tint[None, None, :] ** (g[..., None] * F('tk', 2.2)), 0, 1)
    # the studio seen through the glass: each face bends the eye's ray by its slope, so neighbouring facets look at different
    # parts of the room (bright soft boxes, the dark floor, the grey wall): the crystal's bright and dark bands
    rk = F('refr', 55)
    az = nb[..., 0] * rk; el = -nb[..., 1] * rk + F('el0', 4)
    wall = hexrgb(OPT.get('sky', '#bdb6c0')); floor = hexrgb(OPT.get('floor', '#2c2830'))
    t_ = np.clip((el + 18) / 30, 0, 1)[..., None]
    envc = floor * (1 - t_) + wall * t_
    boxes = OPT.get('tboxes', '0,10,9,40,1;-34,0,5,40,.8;30,0,5,40,.75;0,-30,30,6,.5')
    soft = F('tsoft', 4)
    for b_ in boxes.split(';'):
        ca, ce, hw, hh, it = [float(v) for v in b_.split(',')]
        wa = np.clip(.5 - (np.abs(az - ca) - hw) / soft, 0, 1); we = np.clip(.5 - (np.abs(el - ce) - hh) / soft, 0, 1)
        envc = envc + (it * wa * we)[..., None] * (1 - envc)
    clear = tr * envc
    # frosted engraving: milky lilac, softly lit
    L = svgkit.L3
    diff = np.clip(((nb @ L) + .6) / 1.6, 0, 1)
    frost = np.clip(hexrgb(OPT.get('frost', '#ead9ea')) * (.72 + .38 * diff)[..., None], 0, 1)
    lit = clear * (1 - fro[..., None]) + frost * fro[..., None]
    # polished faces mirror the studio crisply; facet edges flash
    rough = np.where(fro > .5, .55, .04)
    import glbsvg_studio as gs
    st = gs.studio(nb, rough, OPT)
    dd = cv2.morphologyEx(dep.astype(np.float32), cv2.MORPH_DILATE, np.ones((3, 3))) - cv2.morphologyEx(dep.astype(np.float32), cv2.MORPH_ERODE, np.ones((3, 3)))
    nd = np.linalg.norm(cv2.Laplacian(nb, cv2.CV_32F), axis=2)
    edge = F('edgek', .35) * np.clip(nd / F('ndk', 1.2), 0, 1) * (1 - fro)
    if cav is not None:
        # the cavity's outline: a bright rim of light caught inside the wall, a dark line of total reflection beside it
        cmf = cv2.GaussianBlur(cm.astype(np.float32), (0, 0), .8 * k)
        rimc = np.clip(1 - np.abs(cmf - .5) * 2, 0, 1)
        edge = edge + F('cavrim', .55) * rimc * (1 - fro)
        lit = lit * (1 - F('cavdark', .35) * np.clip(cv2.GaussianBlur((cmf > .5).astype(np.float32), (0, 0), 3 * k) - cmf, 0, 1)[..., None])
    add = np.where(m, F('kst', 1.2) * st + edge, 0)
    alpha = np.clip(F('aclear', .42) + .35 * g, 0, 1) * (1 - fro) + F('afro', .9) * fro
    alpha = np.where(m, np.maximum(alpha, np.clip(add, 0, 1)), 0)
    lit = np.where(m[..., None], lit, 0)
    return lit, add, alpha


def hexrgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def main():
    P = json.load(open(os.path.join(OUT, 'glb_pose.json')))
    s = F('s', 1.0)
    cam, W, H = dict(P['cam']), P['W'], P['H']
    VIEW = OPT.get('view', 'photo')
    if VIEW == 'shop':
        import math
        hcm = F('hcm', 26); kk = s
        H = int(round((hcm + 2) * svgkit.UPC * kk)); W = int(round(H * F('wide', 1.3))); D = 40.0
        cam = dict(yaw=cam['yaw'], pitch=math.degrees(math.asin(svgkit.RY)), dist=D, fpx=hcm * svgkit.UPC * kk * D, cx=W / 2, cy=H / 2,
                   ty=.5, sx=cam.get('sx', 1.0))
        s = 1.0
    cam['fpx'] *= s; cam['cx'] *= s; cam['cy'] *= s
    Ws, Hs = int(round(W * s)), int(round(H * s))
    R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
    import moderngl
    for t in (R.tb, R.tm):
        t.filter = (moderngl.LINEAR, moderngl.LINEAR)
    fr_ = R.render(cam, Ws, Hs, modes=(0, 1, 2, 4))
    bk = R.render(cam, Ws, Hs, modes=(2,), cull='front')
    cav = None
    if KIND == 'cristal' and F('cav', 1) > 0:
        # the cavity of a solid-sided crystal: the model's own form, narrowed and lifted off the thick base
        sx, y0c, y1c = F('cavx', .72), F('cavy0', .2), F('cavy1', 1.02)
        v0 = R.m.v.copy()
        vc = v0 * np.array([sx, (y1c - y0c), sx], np.float32) + np.array([0, y0c, 0], np.float32)
        R.vao.release()
        R.m.v = vc
        vbo = R.ctx.buffer(np.hstack([vc, R.m.n, R.m.uv]).astype('f4').tobytes())
        ibo = R.ctx.buffer(R.m.f.astype('i4').tobytes())
        R.vao = R.ctx.vertex_array(R.prog, [(vbo, '3f 3f 2f', 'pos', 'nrm', 'uv')], ibo)
        cav = R.render(cam, Ws, Hs, modes=(1, 2))
    R.ctx.release()
    m = fr_['mask']; k = s
    mapf = lambda x, y: (x / s, y / s); q = F('q', .1)
    if VIEW == 'shop':
        k = F('s', 1.0)
        yfoot = np.where(m.any(1))[0].max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - Ws / 2) / k, svgkit.FL - (yfoot - y) / k); q = .05
    n = fr_['normal']; dep = fr_['depth']; h = np.clip(fr_['pos'][..., 1], 0, 1)
    # thickness of glass crossed by the eye's ray (model heights), the first wall only
    th = np.where(m & bk['mask'], np.clip(bk['depth'] - dep, 0, .25), .02)
    th = cv2.GaussianBlur(th.astype(np.float32), (0, 0), 1.5 * k)
    log('render %dx%d; thickness median %.3f, p90 %.3f' % (Ws, Hs, np.median(th[m]), np.percentile(th[m], 90)))
    ph = cv2.resize(cv2.imread(os.path.join(OUT, 'ref.jpg')), (Ws, Hs), interpolation=cv2.INTER_AREA)
    pm = cv2.resize(cv2.imread(os.path.join(OUT, 'mask.png'), 0), (Ws, Hs)) > 127
    if KIND == 'cristal':
        lit, add, alpha = crystal(fr_, m, th, dep, k, cav)
    else:
        Hp, Cp = palette(ph, pm, h, m)
        log('palette: ' + ' '.join('%.2f:%s' % (a, svgkit.hexc(np.clip(lab2rgb(c), 0, 1) * 255)) for a, c in zip(Hp, Cp)))
        labc = np.stack([np.interp(h, Hp, Cp[:, i]) for i in range(3)], -1)
        labc[..., 1:] *= F('chroma', 1.0)
        labc0 = labc.copy()
        # depth of colour with thickness: thin glass pales towards milk-white (more L, less chroma), thick glass deepens
        t0 = F('t0', .03)
        g = 1 - np.exp(-th / t0)
        gm = float(np.median(g[m]))
        rel = np.clip((g - gm) * F('tk', 1.4), -.6, .6)
        labc[..., 0] = np.clip(labc[..., 0] - rel * F('tl', 14), 0, 100)
        labc[..., 1:] *= (1 + rel * F('tc', .7))[..., None]
        col = np.clip(lab2rgb(labc), 0, 1)
        # light: soft diffuse (satin glass), the light passing through thin glass, hollows, broad sheens, bright rims
        nb = np.dstack([cv2.GaussianBlur(np.where(m, n[..., i], 0), (0, 0), F('nblur', 1.0) * k) for i in range(3)])
        nb /= np.maximum(np.linalg.norm(nb, axis=2, keepdims=True), 1e-6)
        L = svgkit.L3
        wrap = F('wrap', .6)
        diff = np.clip(((nb @ L) + wrap) / (1 + wrap), 0, 1)
        D = F('amb', .55) + F('diff', .55) * diff
        ao = occlusion(dep, m, k)
        D *= 1 - F('aok', .45) * ao
        glow = F('glow', .35) * np.exp(-th / F('tglow', .025)) * (1 - ao)
        dref = float(np.percentile(D[m], 80))
        D = D / dref
        Hv = L + np.array([0, 0, 1.]); Hv /= np.linalg.norm(Hv)
        nh = np.clip(nb @ Hv, 0, 1)
        sheen = F('ks', .35) * nh ** F('pw', 18) + F('ks2', .25) * nh ** F('pw2', 120)
        # rims: where the surface turns away from the eye at a petal's edge (inside the silhouette too, from the depth breaks)
        nz = np.clip(nb[..., 2], 0, 1)
        rim = F('rimk', .45) * (1 - nz) ** 3
        dd = cv2.morphologyEx(dep.astype(np.float32), cv2.MORPH_DILATE, np.ones((3, 3))) - cv2.morphologyEx(dep.astype(np.float32), cv2.MORPH_ERODE, np.ones((3, 3)))
        brk = (np.where(m, dd, 0) > F('brk', .012)).astype(np.float32)
        brk = cv2.GaussianBlur(brk, (0, 0), .8 * k)
        # a break: the nearer petal's rim catches the light (bright), the farther one is in its shadow
        edge = F('edgek', .5) * brk
        lit = np.clip(col * np.minimum(D, 1.15)[..., None] + (glow * (col @ LUM))[..., None] * col / np.maximum(col @ LUM, .05)[..., None] * .8, 0, 1)
        add = np.where(m, sheen + rim + edge, 0)
        # opacity: thin glass lets the background through
        alpha = np.clip(F('a0', .62) + (1 - F('a0', .62)) * (1 - np.exp(-th / F('ta', .05))), 0, 1)
        alpha = np.where(m, np.maximum(alpha, np.clip(add, 0, 1)), 0)
    # ---- SVG
    step = F('step', 1.0) * k
    svgkit.RDP_EPS = F('rdp', .3); svgkit.AREA_MIN = F('amin', .5) * k * k
    sil = svgkit.contour_paths(cv2.GaussianBlur(m.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
    defs = ['<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', 1.4) / (k if VIEW == 'shop' else 1)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', .7) / (k if VIEW == 'shop' else 1)),
            '<clipPath id="kb"><path d="%s"/></clipPath>' % sil]
    # colour: tone bands of the lit glass (darkest first), each a crisp area under a light blur
    if KIND == 'pate' and F('ramp', 1) > 0:
        # the glass's colour as one true SVG gradient up the height (its stops: the measured palette, placed where each
        # height crosses the vase's axis), the light and the thickness laid over it as soft layers of dark and of milk
        ys_ = []
        for hs in Hp:
            z = m & (np.abs(h - hs) < .012)
            ys_.append(np.median(np.where(z)[0]) if z.sum() > 20 else np.nan)
        ys_ = np.array(ys_); ok = ~np.isnan(ys_)
        Hq, Yq, Cq = Hp[ok], ys_[ok] / s, Cp[ok]
        Cq = Cq.copy(); Cq[:, 1:] *= F('chroma', 1.0)
        y0g, y1g = Yq.max(), Yq.min()
        st_ = ''.join('<stop offset="%s" stop-color="%s"/>' % (svgkit.fmt(round((y0g - y_) / (y0g - y1g), 4)), svgkit.hexc(np.clip(lab2rgb(c_), 0, 1) * 255))
                      for y_, c_ in sorted(zip(Yq, Cq), key=lambda t: -t[0]))
        defs.append('<linearGradient id="ramp" gradientUnits="userSpaceOnUse" x1="0" y1="%s" x2="0" y2="%s">%s</linearGradient>' % (
            svgkit.fmt(y0g), svgkit.fmt(y1g), st_))
        base_rgb = np.clip(lab2rgb(labc0), 0, 1)
        Yb = np.maximum(base_rgb @ LUM, .02); Yl = lit @ LUM
        rr_ = Yl / Yb
        sa = F('sh_a', .05)
        shl = nested(np.log(np.clip(rr_, .03, 1)) / np.log(1 - sa), m, 60, step * 1.3, q, mapf, k)
        la = F('mk_a', .05)
        # the lit side and the thin glass whiten towards milk: share of white needed
        wfrac = np.clip((Yl - Yb) / np.maximum(1 - Yb, .03), 0, .95)
        mkl = nested(np.log(1 - wfrac) / np.log(1 - la), m, 50, step * 1.3, q, mapf, k)
        paint = ('<path fill="url(#ramp)" d="%s"/><g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>'
                 '<g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>') % (
            sil, OPT.get('shcol', '#2a1f2c'), svgkit.fmt(sa), ''.join(shl), OPT.get('milk', '#fbf4f8'), svgkit.fmt(la), ''.join(mkl))
        bands = [0] * (len(shl) + len(mkl))
    else:
        # the lit glass as tone bands, computed apart for each hue family (pink, milk-white, yellow, green...): a band's colour
        # is the mean of pixels of one family and one lightness only; neighbouring families overlap under a soft blur
        labl = rgb2lab(np.clip(lit, 0, 1))
        K = int(F('fam', 7))
        X = np.stack([labl[..., 1][m], labl[..., 2][m], labl[..., 0][m] * F('famL', .25)], 1)[::5].astype(np.float32)
        _, _, cen = cv2.kmeans(X, K, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, .2), 3, cv2.KMEANS_PP_CENTERS)
        Fz = np.stack([labl[..., 1], labl[..., 2], labl[..., 0] * F('famL', .25)], -1)
        lbl = np.argmin(np.stack([np.linalg.norm(Fz - c, axis=-1) for c in cen], -1), -1).astype(np.uint8)
        lbl = cv2.medianBlur(lbl, 7)
        order = np.argsort([-(m & (lbl == c)).sum() for c in range(K)])
        paint, nb_ = [], 0
        for c in order:
            fm = m & (lbl == c)
            if fm.sum() < 30:
                continue
            # the family grown a little under its neighbours so no seam opens between them
            fmg = cv2.dilate(fm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & m
            bs = svgkit.bands(lit * 255, fmg, mapf, q, step, dy=F('dy', 3.5), minpx=10)
            dfam = svgkit.contour_paths(cv2.GaussianBlur(fmg.astype(np.float32), (0, 0), 1.0 * k), .5, step, q, mapf, 1.0)
            if not dfam:
                continue
            defs.append('<clipPath id="f%d"><path d="%s"/></clipPath>' % (c, dfam))
            paint.append('<g clip-path="url(#f%d)">%s</g>' % (c, ''.join('<path fill="%s" d="%s"/>' % (cc, d if d else dfam) for cc, d in bs)))
            nb_ += len(bs)
        bands = [0] * nb_
        paint = '<g filter="url(#hb)">%s</g>' % ''.join(paint)
    b = F('hl_b', .14)
    Yc = np.clip(lit @ LUM, 0, .97)
    frac = np.clip(add / np.maximum(1 - Yc, .03), 0, .985)
    hl = nested(np.log(1 - frac) / np.log(1 - b), m, 30, step, q, mapf, k)
    glaze = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (OPT.get('hlcol', '#fdfbff'), svgkit.fmt(b), ''.join(hl))
    # transparency: nested white areas in a mask (each one more layer of opacity), softened
    a1 = F('ma', .12)
    base = float(np.percentile(alpha[m], 1)) if KIND == 'cristal' else F('a0', .62)
    mk_ = nested(np.log(np.clip(1 - (alpha - base) / (1 - base), .02, 1)) / np.log(1 - a1), m, 30, step * 1.3, q, mapf, k)
    mx0, my0 = mapf(0, 0); mx1, my1 = mapf(Ws, Hs)
    defs.append('<mask id="ga" maskUnits="userSpaceOnUse" x="%s" y="%s" width="%s" height="%s"><g filter="url(#sb)">'
                '<path fill="#fff" fill-opacity="%s" d="%s"/><g fill="#fff" fill-opacity="%s">%s</g></g></mask>' % (
                    svgkit.fmt(mx0), svgkit.fmt(my0), svgkit.fmt(mx1 - mx0), svgkit.fmt(my1 - my0), svgkit.fmt(base), sil, svgkit.fmt(a1), ''.join(mk_)))
    body = '<g clip-path="url(#kb)"><g mask="url(#ga)">%s</g>%s</g>' % (paint, glaze)
    bg = OPT.get('bg', '')
    back = '<rect width="%d" height="%d" fill="%s"/>' % (W, H, bg) if bg else ''
    if VIEW == 'shop':
        x0_, y0_ = mapf(0, 0); x1_, y1_ = mapf(Ws, Hs)
        doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" width="%d" height="%d"><defs>%s</defs><g id="vase">%s</g></svg>' % (
            svgkit.fmt(x0_), svgkit.fmt(y0_), svgkit.fmt(x1_ - x0_), svgkit.fmt(y1_ - y0_), Ws, Hs, ''.join(defs), body)
        import glbsvg_shop
        glbsvg_shop.shop_out(OUT, VASE, OPT, body, defs, cam, log)
    else:
        doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (
            W, H, W, H, ''.join(defs), back, body)
    dst = os.path.join(OUT, 'glbsvg_%s.svg' % TAG)
    open(dst, 'w').write(doc)
    bgc = np.array([int(OPT.get('bg', '#e8e4dc')[i:i + 2], 16) for i in (1, 3, 5)]) / 255
    img = np.clip(lit + add[..., None], 0, 1) * alpha[..., None] + bgc * (1 - alpha[..., None]); img[~m] = 1
    cv2.imwrite(os.path.join(OUT, 'field_%s.png' % TAG), (img[..., ::-1] * 255).astype(np.uint8))
    z = len(gzip.compress(doc.encode(), 9))
    log('svg: %d bands, %d light layers, %d mask layers; %.0f Ko, gzip %.0f Ko' % (len(bands), len(hl), len(mk_), len(doc) / 1024, z / 1024))


if __name__ == '__main__':
    main()
