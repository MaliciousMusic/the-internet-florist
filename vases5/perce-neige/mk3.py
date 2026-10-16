# The snowdrop vase as an enamel, cell by cell: every area closed by the tube lines inside one enamel family is one crisp path
# filled with an SVG gradient fitted on its measured colour (the wash spreads smoothly, the border stays sharp); the light is
# laid over the whole body as soft shared layers (shade, surroundings at grazing angles, the studio's reflections), then the
# tube lines with their relief. Form from the GLB's turned body, paint from the photograph placed by the pose (paint.py,
# emaux.py, cernes.py): one drawing only.
#   .venv-depth/Scripts/python mk3.py photo|shop [key=value ...]
import sys, os, json
import numpy as np, cv2
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..'))
import importlib.util  # noqa: E402


def _load(name):
    # by path: ../verre (put on the path by svgkit) has modules of the same names
    spec = importlib.util.spec_from_file_location(name, os.path.join(HERE, name + '.py'))
    mod = importlib.util.module_from_spec(spec); sys.modules[name] = mod; spec.loader.exec_module(mod)
    return mod


mk = _load('mk')
mk2 = _load('mk2')
import svgkit, glbkit  # noqa: E402

VIEW, OPT, F, OUT, log = mk.VIEW, mk.OPT, mk.F, mk.OUT, mk.log
FAM = mk2.FAM
SFX = mk2.SFX


def line_mask(runs, shape, unmap, k):
    m = np.zeros(shape, np.uint8)
    for Q, w, fc in runs:
        P = np.array([unmap(x, y) for x, y in Q])
        cv2.polylines(m, [np.round(P * 4).astype(np.int32)], False, 255, max(1, int(round(w * k))), cv2.LINE_8, shift=2)
    return m > 0


def cells(fam, sel, lines, k):
    """cell id per pixel: connected areas of one family between the tube lines; the lines' own pixels and specks go to the
    nearest cell (so the cells tile the body without gaps, the strokes cover their seams)"""
    cid = np.full(fam.shape, -1, np.int32); nxt = 0; cfam = []
    minpx = F('cellmin', 3) * k * k
    for i in range(len(FAM)):
        n_, lb, st, _ = cv2.connectedComponentsWithStats(((fam == i) & sel & ~lines).astype(np.uint8), connectivity=4)
        for j in range(1, n_):
            if st[j, cv2.CC_STAT_AREA] >= minpx:
                cid[lb == j] = nxt; cfam.append(i); nxt += 1
    known = cid >= 0
    _, (iy, ix) = ndimage.distance_transform_edt(~known, return_indices=True)
    cid = np.where(sel, cid[iy, ix], -1)
    return cid, cfam


def gradient(col, pix, mapf):
    """a linear gradient fitted on a cell: the direction of its strongest colour change, stops = the colour along it"""
    ys, xs = pix
    c = col[ys, xs]
    if len(xs) < 12:
        return None, np.median(c, 0)
    X = np.stack([xs - xs.mean(), ys - ys.mean()], 1).astype(np.float64)
    Yl = c @ np.array([.3, .59, .11])
    J, *_ = np.linalg.lstsq(X, c - c.mean(0), rcond=None)          # 2 x 3: change of each channel per pixel
    gl, *_ = np.linalg.lstsq(X, Yl - Yl.mean(), rcond=None)
    d = gl if np.linalg.norm(gl) > 1e-6 else J[:, int(np.argmax(np.abs(J).sum(0)))]
    if np.linalg.norm(d) < 1e-6:
        return None, np.median(c, 0)
    d = d / np.linalg.norm(d)
    t = X @ d
    t0, t1 = np.percentile(t, 2), np.percentile(t, 98)
    span = (t1 - t0) * np.linalg.norm(J, axis=1).max()             # total colour change across the cell
    if t1 - t0 < 2 or np.abs(J.T @ d).max() * (t1 - t0) < F('gmin', .025):
        return None, np.median(c, 0)
    nst = int(np.clip(F('stops', 5), 2, 8))
    stops = []
    edges = np.linspace(t0, t1, nst + 1)
    for a, b in zip(edges[:-1], edges[1:]):
        s = (t >= a) & (t <= b)
        if s.sum() >= 3:
            stops.append(((a + b) / 2 - t0) / (t1 - t0))
            stops[-1] = (stops[-1], np.median(c[s], 0))
    if len(stops) < 2:
        return None, np.median(c, 0)
    p0 = np.array([xs.mean(), ys.mean()]) + d * t0; p1 = np.array([xs.mean(), ys.mean()]) + d * t1
    return (mapf(*p0), mapf(*p1), stops), np.median(c, 0)


def main():
    M = mk.load(VIEW)
    H, W = M['mask'].shape
    if VIEW == 'shop':
        k = H / ((mk.HCM + 2) * svgkit.UPC)
        # the engine's floor line FL passes through the centre of the foot's ellipse (its lathe vessels and their shadows
        # stand there), not its front edge: the axis' foot point of the model, projected, goes on FL
        mv_, _ = glbkit.view_matrices(M['cam'], W, H)
        p_ = mv_ @ np.array([0, 0, 0, 1.0])
        yfoot = M['cam'].get('cy', H / 2) - M['cam']['fpx'] * p_[1] / -p_[2]
        mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
        unmap = lambda X, Y: ((X - svgkit.VX) * k + W / 2, yfoot - (svgkit.FL - Y) * k)
        q = F('q', .05)
    else:
        k = 1.0; mapf = lambda x, y: (x, y); unmap = lambda X, Y: (X, Y); q = F('q', .1)
    n, E = mk.body(M)
    sel = E['body']
    fam, col = mk2.unrolled_fields(M, E)
    D, S = mk.lighting(M, E, n)
    Fr = mk.fresnel(n)
    env = mk.hexrgb(OPT.get('env', '#1d2440' if VIEW == 'photo' else '#ebe7df'))
    runs = [r_ for r_ in mk2.project_lines(M, k, mapf) if np.linalg.norm(np.diff(r_[0], axis=0), axis=1).sum() >= F('lmin', 1.4)]
    lines = line_mask(runs, sel.shape, unmap, k)
    cid, cfam = cells(fam, sel, lines, k)
    log('%d cells, %d line runs' % (len(cfam), len(runs)))
    # the paint is laid at the light of the lit side (dref); the shade layers darken the rest
    dref = float(np.percentile(D[sel], F('dpct', 85)))
    paintc = np.clip(col * dref, 0, 1)
    defs = ['<filter id="wb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('wblur', 1.6)),
            '<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', 1.2)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', .45))]
    step = F('step', 1.0) * k
    svgkit.RDP_EPS = F('rdp', .25); svgkit.AREA_MIN = F('amin', .3) * k * k
    sil = svgkit.contour_paths(cv2.GaussianBlur(sel.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
    defs.append('<clipPath id="kb"><path d="%s"/></clipPath>' % sil)
    # cells, largest first; each grown a pixel under its neighbours (no hairline gaps), the base under all = the commonest colour
    area = np.bincount(cid[cid >= 0], minlength=len(cfam))
    order = np.argsort(-area)
    base = np.median(paintc[sel], 0)
    paint = ['<path fill="%s" d="%s"/>' % (svgkit.hexc(base * 255), sil)]
    grow = max(1, int(round(F('grow', .35) * k)))
    ng = 0
    preview = np.ones((H, W, 3))
    for j in order:
        m = cid == j
        if not m.any():
            continue
        g, cmed = gradient(paintc, np.where(m), mapf)
        mg = cv2.dilate(m.astype(np.uint8), np.ones((2 * grow + 1,) * 2, np.uint8)).astype(bool) & sel
        d = svgkit.contour_paths(cv2.GaussianBlur(mg.astype(np.float32), (0, 0), .6), .5, step, q, mapf, 1.0)
        if not d:
            continue
        if g is None:
            paint.append('<path fill="%s" d="%s"/>' % (svgkit.hexc(cmed * 255), d)); preview[m] = cmed
            continue
        (x0, y0), (x1, y1), stops = g
        gid = 'g%d' % ng; ng += 1
        defs.append('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="%s" y1="%s" x2="%s" y2="%s">%s</linearGradient>' % (
            gid, svgkit.fmt(x0), svgkit.fmt(y0), svgkit.fmt(x1), svgkit.fmt(y1),
            ''.join('<stop offset="%s" stop-color="%s"/>' % (svgkit.fmt(round(o, 3)), svgkit.hexc(c * 255)) for o, c in stops)))
        ys, xs = np.where(m); p0 = np.array(unmap(x0, y0)); p1 = np.array(unmap(x1, y1)); dd = p1 - p0
        tt = np.clip(((np.stack([xs, ys], 1) - p0) @ dd) / max(1e-6, dd @ dd), 0, 1)
        so = np.array([o for o, _ in stops]); sc = np.array([c for _, c in stops])
        pv = np.stack([np.interp(tt, so, sc[:, ch]) for ch in range(3)], 1)
        preview[ys, xs] = pv
        # washes inside a large cell (a petal's blue-grey shade, the arch turning peach): what the gradient misses, as soft
        # areas of their own colour, blurred, clipped by the cell (its border stays crisp)
        wash = ''
        res = paintc[ys, xs] - pv
        if m.sum() > F('washpx', 400) * k * k and np.percentile(np.abs(res @ np.array([.3, .59, .11])), 90) > F('washmin', .025):
            rf = np.zeros((H, W, 3), np.float32); rf[ys, xs] = res
            rs = np.dstack([cv2.GaussianBlur(rf[..., ch], (0, 0), 2 * k) for ch in range(3)]) / np.maximum(cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2 * k), 1e-3)[..., None]
            Yr = rs @ np.array([.3, .59, .11])
            wl = []
            for sgn in (-1, 1):
                for lev in F('wstep', .03) * np.arange(1, 6):
                    z = (sgn * Yr >= lev) & m
                    if z.sum() < 6 * k * k:
                        break
                    cz = np.clip(preview[z] + rs[z], 0, 1).mean(0) if False else np.clip(pv.mean(0) + rs[z].mean(0), 0, 1)
                    dz = svgkit.contour_paths(cv2.GaussianBlur(z.astype(np.float32), (0, 0), 1.0 * k), .5, step * 1.5, q, mapf, 1.0)
                    if dz:
                        wl.append('<path fill="%s" fill-opacity="%s" d="%s"/>' % (svgkit.hexc(cz * 255), svgkit.fmt(F('wop', .5)), dz))
                        preview[z] = preview[z] * (1 - F('wop', .5)) + cz * F('wop', .5)
            if wl:
                cpid = 'c%d' % ng
                defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cpid, d))
                wash = '<g clip-path="url(#%s)"><g filter="url(#wb)">%s</g></g>' % (cpid, ''.join(wl))
        paint.append('<path fill="url(#%s)" d="%s"/>%s' % (gid, d, wash))
    # the light, shared by every cell: shade (D below dref), the surroundings at grazing angles, the studio's reflections
    a = F('sh_a', .08)
    Dr = D / dref
    sh = mk.nested(np.log(np.clip(Dr, .03, 1)) / np.log(1 - a), sel, 30, step * 1.5, q, mapf, k)
    shade = '<g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>' % (OPT.get('shcol', '#10121a'), svgkit.fmt(a), ''.join(sh))
    e_ = F('env_a', .14)
    ev = mk.nested(np.log(np.clip(1 - Fr, .02, 1)) / np.log(1 - e_), sel, 25, step, q, mapf, k)
    envg = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (svgkit.hexc(env * 255), svgkit.fmt(e_), ''.join(ev))
    lit = np.clip(preview * np.minimum(Dr, 1)[..., None], 0, 1)
    lit = lit * (1 - Fr[..., None]) + env * Fr[..., None]
    Yc = np.clip(lit @ np.array([.3, .59, .11]), 0, .97)
    add = S + (preview @ np.array([.3, .59, .11])) * np.maximum(Dr - 1, 0)
    frac = np.clip(add / np.maximum(1 - Yc, .03), 0, .985)
    b = F('hl_b', .16)
    hl = mk.nested(np.log(1 - frac) / np.log(1 - b), sel, 26, step, q, mapf, k)
    glaze = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (OPT.get('hlcol', '#fbfbf8'), svgkit.fmt(b), ''.join(hl))
    # the tube lines with their relief
    alb = (np.load(os.path.join(OUT, 'unlit.npy')).astype(np.float32) if not SFX else
           cv2.imread(os.path.join(OUT, 'decor_tex.png'))[..., ::-1].astype(np.float32) / 255)
    lm = cv2.imread(os.path.join(OUT, 'cernes_mask%s.png' % SFX), 0) > 160
    em = cv2.imread(os.path.join(OUT, 'emaux%s.png' % SFX), 0)
    lcol = mk.hexrgb(OPT['lcol']) if 'lcol' in OPT else np.median(alb[lm & (em == 0)], 0)
    lcl = np.clip(lcol * dref * F('lk', .68), 0, 1)
    Lx, Ly = svgkit.L3[0], svgkit.L3[1]; ln_ = np.hypot(Lx, Ly); Lx, Ly = Lx / ln_, Ly / ln_
    tr, hi, lo = [], [], []
    for Q, w, fc in runs:
        w *= F('lw', 1.15)
        Qs = mk2.simplify(Q, F('leps', .12))
        d0 = mk2.path_d(Qs, q)
        if not d0:
            continue
        o = .22 * w
        tr.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(w), d0))
        hi.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(.26 * w), mk2.path_d(Qs + np.array([Lx * o, Ly * o]), q)))
        lo.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(.45 * w), mk2.path_d(Qs - np.array([Lx * o, Ly * o]), q)))
    linesg = ('<g fill="none" stroke-linecap="round" stroke-linejoin="round">'
              '<g stroke="#1a1c14" stroke-opacity="%s">%s</g><g stroke="%s">%s</g><g stroke="#ffffff" stroke-opacity="%s">%s</g></g>') % (
        svgkit.fmt(F('lsh', .35)), ''.join(lo), svgkit.hexc(lcl * 255), ''.join(tr), svgkit.fmt(F('lhi', .5)), ''.join(hi))
    if VIEW == 'shop' and 'trace' in OPT:
        # the GLB's texture vectorised as it is (trace.py), laid at the lit side's light like the cells; its own drawing
        # carries the tube lines, so no line of ours is added
        import re
        T = json.load(open(os.path.join(OUT, 'tex_shop_hd.json')))
        tr_ = open(os.path.join(OUT, 'trace_%s.svg' % OPT['trace'])).read()
        tr_ = tr_[tr_.index('<path'):tr_.rindex('</svg>')]
        kk = float(F('tk', dref))
        tr_ = re.sub(r'fill="#([0-9a-fA-F]{6})"', lambda mm: 'fill="%s"' % svgkit.hexc(np.clip(mk.hexrgb('#' + mm.group(1)) * kk, 0, 1) * 255), tr_)
        sk = T['s'] * k
        mat = (1 / sk, 0, 0, 1 / sk, svgkit.VX + (T['x0'] / T['s'] - W / 2) / k, svgkit.FL - yfoot / k + T['y0'] / sk)
        paint = ['<g transform="matrix(%s)">%s</g>' % (' '.join(svgkit.fmt(round(v, 5)) for v in mat), tr_)]
        linesg = ''
    parts = dict(paint=''.join(paint), shade=shade, env=envg, lines=linesg, glaze=glaze)
    only = OPT.get('only', 'paint,shade,env,lines,glaze').split(',')
    bodyg = '<g clip-path="url(#kb)">%s</g>' % ''.join(parts[p_] for p_ in ('paint', 'shade', 'env', 'lines', 'glaze') if p_ in only)
    mouth = ''
    if E['inside'].sum() > 10:
        din = svgkit.contour_paths(cv2.GaussianBlur(E['inside'].astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
        mouth = '<path fill="%s" d="%s"/>' % (OPT.get('incol', '#07080e'), din)
    if VIEW == 'shop':
        x0, y0 = mapf(0, 0); x1, y1 = mapf(W, H); vb = '%g %g %g %g' % (x0, y0, x1 - x0, y1 - y0)
    else:
        vb = '0 0 %d %d' % (W, H)
    doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (vb, ''.join(defs), mouth, bodyg)
    open(os.path.join(OUT, 'cell%s_%s.svg' % (SFX, VIEW)), 'w').write(doc)
    img = np.clip(lit + S[..., None], 0, 1); img[~M['mask']] = 1
    cv2.imwrite(os.path.join(OUT, 'field3_%s.png' % VIEW), (img[..., ::-1] * 255).astype(np.uint8))
    log('svg: %d cells (%d gradients), %d shade, %d surroundings, %d light layers, %d lines; %.0f Ko' % (
        len(paint) - 1, ng, len(sh), len(ev), len(hl), len(tr), len(doc) / 1024))
    if VIEW == 'shop':
        import gzip
        dct = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), bodyg, mouth=mouth)
        js = json.dumps(dct, separators=(',', ':')).encode()
        log('body.json %.0f Ko, gzip %.1f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))


if __name__ == '__main__':
    main()
