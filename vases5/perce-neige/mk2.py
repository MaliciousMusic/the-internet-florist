# The snowdrop vase as an enamel: crisp tube lines, the areas between them filled with colour that spreads smoothly, a glossy
# glaze over all. The form is the GLB's turned body (paint.py profile), the paint job comes from the photograph placed by the
# pose: enamel families and their smooth colour (emaux.py), tube lines (cernes.py). One drawing only.
#   enamel - per family, its area as one clip path (crisp border), filled with fine tone bands of the lit enamel colour
#            softened by a blur (the colour spreads, it never shows patches);
#   glaze  - the shop's light (soft contrast, as the photographer's), the photographer's studio mirrored (map measured by
#            paint.py) as nested light layers, the surroundings at grazing angles (Fresnel);
#   lines  - each tube line projected from the unrolled body into the view, drawn as a stroke of its measured width, then a
#            thin light edge toward the light and a fine shadow on the other side: a raised slip trail under the glaze.
#   .venv-depth/Scripts/python mk2.py photo|shop [key=value ...]
import sys, os, json, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..'))
mk = sys.modules['mk'] if 'mk' in sys.modules and sys.modules['mk'].__file__.startswith(HERE) else __import__('mk')  # noqa: E402
import svgkit, glbkit, mesure  # noqa: E402

VIEW, OPT, F, OUT, log = mk.VIEW, mk.OPT, mk.F, mk.OUT, mk.log
FAM = ['ground', 'navy', 'green', 'ochre']
SFX = '' if OPT.get('src', 'photo') == 'photo' else '_' + OPT['src']   # paint source: the photograph or the GLB's texture


def unrolled_fields(M, E):
    fam = cv2.imread(os.path.join(OUT, 'emaux%s.png' % SFX), 0)
    col = np.load(os.path.join(OUT, 'emaux_col%s.npy' % SFX)).astype(np.float32)
    Hu, Wu = fam.shape
    ux, uy = mk.unrolled(M['pos'], Wu, Hu)
    fv = cv2.remap(fam, ux, uy, cv2.INTER_NEAREST, borderMode=cv2.BORDER_WRAP).astype(np.int32)
    cv = cv2.remap(col, ux, uy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    known = (fv != 255) & E['body']
    if (E['body'] & ~known).any():
        from scipy import ndimage
        _, (iy, ix) = ndimage.distance_transform_edt(~known, return_indices=True)
        fv, cv = fv[iy, ix], cv[iy, ix]
    fv[~E['body']] = -1
    # each enamel's colour carried from its own inside to its border: the interpolation across a border (green into navy,
    # white into a line's grey) would ring every area with a dark rim
    for i in range(len(FAM)):
        f = fv == i
        core = cv2.erode(f.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
        if core.sum() < 10:
            continue
        ce, _ = svgkit.extend(cv, core, 6)
        cv[f & ~core] = ce[f & ~core]
    return fv, cv


def project_lines(M, k, mapf):
    """the tube lines (unrolled pixels) projected into the view: lists of visible runs in output units, with their width"""
    cer = json.load(open(os.path.join(OUT, 'cernes%s.json' % SFX)))
    fam = cv2.imread(os.path.join(OUT, 'emaux%s.png' % SFX), 0)
    Hu, Wu = fam.shape
    pr = np.load(os.path.join(OUT, 'profile.npy'))
    cam = M['cam']; Hh, Ww = M['mask'].shape
    mv, _ = glbkit.view_matrices(cam, Ww, Hh)
    f, cx, cy, sx = cam['fpx'], cam.get('cx', Ww / 2), cam.get('cy', Hh / 2), cam.get('sx', 1.0)
    # model units -> output units: the radius of one unrolled pixel along the height
    ppu = f / cam['dist']
    runs = []
    for c in cer:
        P = np.array(c['p'], np.float32)
        if len(P) < 2:
            continue
        # a line lying mostly in the navy is a glint's edge, not a tube line
        fx_, fy_ = np.clip(P[:, 0].astype(int), 0, Wu - 1), np.clip(P[:, 1].astype(int), 0, Hu - 1)
        if np.mean(fam[fy_, fx_] == 1) > .5:
            continue
        th = ((P[:, 0] + .5) / Wu * 2 - 1) * np.pi; h = 1 - (P[:, 1] + .5) / Hu
        r = np.interp(h, pr[::-1, 0], pr[::-1, 1]); dr = np.interp(h, pr[::-1, 0], pr[::-1, 2])
        X = np.stack([r * np.cos(th), h, r * np.sin(th), np.ones_like(h)], 1) @ mv.T
        px, py = cx + f * X[:, 0] / -X[:, 2], cy - f * X[:, 1] / -X[:, 2]
        N = np.stack([np.cos(th) / sx, -dr, np.sin(th) / sx], 1) @ mv[:3, :3].T
        V = -X[:, :3]
        face = (N * V).sum(1) / (np.linalg.norm(N, axis=1) * np.linalg.norm(V, axis=1))
        vis = face > F('lface', .08)
        w = c['w'] / Hu * ppu / k                                  # unrolled pixels -> model units -> output units
        i = 0
        while i < len(P):
            if not vis[i]:
                i += 1; continue
            j = i
            while j < len(P) and vis[j]:
                j += 1
            if j - i >= 2:
                Q = np.array([mapf(x, y) for x, y in zip(px[i:j], py[i:j])])
                runs.append((Q, float(w), float(face[i:j].mean())))
            i = j
    return runs


def path_d(Q, q):
    """an open path through the points (a smooth quadratic chain through midpoints), relative, rounded"""
    R = lambda p: np.round(np.asarray(p) / q) * q
    Q = R(Q)
    keep = [0] + [i for i in range(1, len(Q)) if np.abs(Q[i] - Q[i - 1]).sum() > 0]
    Q = Q[keep]
    if len(Q) < 2:
        return ''
    s = 'M' + svgkit.nums(Q[0])
    if len(Q) == 2:
        return s + 'l' + svgkit.nums(Q[1] - Q[0])
    cur = Q[0]
    for i in range(1, len(Q) - 1):
        mid = R((Q[i] + Q[i + 1]) / 2)
        s += 'q' + svgkit.nums(np.r_[Q[i] - cur, mid - cur]); cur = mid
    s += 'l' + svgkit.nums(Q[-1] - cur)
    return s


def simplify(Q, eps):
    if len(Q) < 3:
        return Q
    keep = [0]
    def rdp(a, b):
        if b <= a + 1:
            return
        d = Q[b] - Q[a]; n = np.linalg.norm(d) + 1e-9
        v = Q[a + 1:b] - Q[a]; dist = np.abs(d[0] * v[:, 1] - d[1] * v[:, 0]) / n
        i = int(np.argmax(dist))
        if dist[i] > eps:
            rdp(a, a + 1 + i); keep.append(a + 1 + i); rdp(a + 1 + i, b)
    rdp(0, len(Q) - 1); keep.append(len(Q) - 1)
    return Q[sorted(set(keep))]


def main():
    M = mk.load(VIEW)
    H, W = M['mask'].shape
    if VIEW == 'shop':
        k = H / ((mk.HCM + 2) * svgkit.UPC)
        ys = np.where(M['mask'].any(1))[0]; yfoot = ys.max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
        q = F('q', .05)
    else:
        k = 1.0; mapf = lambda x, y: (x, y); q = F('q', .1)
    n, E = mk.body(M)
    fam, col = unrolled_fields(M, E)
    D, S = mk.lighting(M, E, n)
    Fr = mk.fresnel(n)
    env = mk.hexrgb(OPT.get('env', '#1d2440' if VIEW == 'photo' else '#ebe7df'))
    sel = E['body']
    # the enamel lit (diffuse and surroundings); the studio's reflections go on top as light layers
    dif = np.clip(col * D[..., None], 0, 1)                        # the enamel under the light: what the bands carry
    lit = np.clip(dif * (1 - Fr[..., None]) + env * Fr[..., None], 0, 1)
    img = np.clip(lit + S[..., None], 0, 1)
    img[E['inside']] = mk.hexrgb(OPT.get('incol', '#07080e')); img[~M['mask']] = 1
    # the tube line's own enamel: the photograph's grey on the lines, without its light
    alb = np.load(os.path.join(OUT, 'unlit.npy')).astype(np.float32)
    lm = cv2.imread(os.path.join(OUT, 'cernes_mask%s.png' % SFX), 0) > 160
    em = cv2.imread(os.path.join(OUT, 'emaux%s.png' % SFX), 0)
    lcol = np.median(alb[lm & (em == 0)], 0) if (lm & (em == 0)).any() else np.array([.45, .45, .43])
    lcol = mk.hexrgb(OPT['lcol']) if 'lcol' in OPT else lcol
    runs = [r_ for r_ in project_lines(M, k, mapf) if np.linalg.norm(np.diff(r_[0], axis=0), axis=1).sum() >= F('lmin', .6)]
    # preview of the lines in the field (for the measured comparison of the field)
    for Q, w, fc in runs:
        pts = np.array([((x - mapf(0, 0)[0]) * k, (y - mapf(0, 0)[1]) * k) for x, y in Q]) if VIEW == 'shop' else Q
        cv2.polylines(img, [np.round(pts * 4).astype(np.int32)], False, tuple(float(v) for v in lcol * float(np.median(D[sel]))), max(1, int(round(w * k * F('lw', 1.0)))), cv2.LINE_AA, shift=2)
    cv2.imwrite(os.path.join(OUT, 'field2_%s.png' % VIEW), (img[..., ::-1] * 255).astype(np.uint8))
    log('field, %d line runs, line enamel %s' % (len(runs), svgkit.hexc(lcol * 255)))
    if F('svg', 1) <= 0:
        return
    defs = ['<filter id="eb" x="-3%%" y="-3%%" width="106%%" height="106%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('eblur', 1.1)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', .45))]
    step = F('step', 1.0) * k
    svgkit.RDP_EPS = F('rdp', .3); svgkit.AREA_MIN = F('amin', .5) * k * k
    sil = svgkit.contour_paths(cv2.GaussianBlur(sel.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
    defs.append('<clipPath id="kb"><path d="%s"/></clipPath>' % sil)
    enamel = []
    nb = 0
    for i in np.argsort([-(fam == j).sum() for j in range(len(FAM))]):
        part = (fam == i) & sel
        if part.sum() < 4 * k * k:
            continue
        grow = 0 if i == int(np.argmax([(fam == j).sum() for j in range(len(FAM))])) else max(1, int(round(.5 * k)))
        pg = cv2.dilate(part.astype(np.uint8), np.ones((2 * grow + 1,) * 2, np.uint8)).astype(bool) & sel if grow else part
        clip = svgkit.contour_paths(cv2.GaussianBlur(pg.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
        if not clip:
            continue
        cid = 'e%d' % i
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, clip))
        bb = svgkit.bands(dif * 255, pg, mapf, q, step * F('bstep', 1.5), dy=F('dy', 3.0))
        nb += len(bb)
        if bb:
            enamel.append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#eb)">%s</g></g>' % (
                cid, bb[0][0], clip, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
    # the surroundings at grazing angles: layers of their colour, (1 - e)^n = 1 - Fr
    e_ = F('env_a', .14)
    ev = mk.nested(np.log(np.clip(1 - Fr, .02, 1)) / np.log(1 - e_), sel, 25, step, q, mapf, k)
    envg = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (svgkit.hexc(env * 255), svgkit.fmt(e_), ''.join(ev))
    # the studio mirrored by the glaze: nested light layers c + (1 - c)(1 - (1 - b)^n) = c + S
    Yc = np.clip(lit @ np.array([.3, .59, .11]), 0, .97)
    frac = np.clip(S / np.maximum(1 - Yc, .03), 0, .985)
    b = F('hl_b', .16)
    hl = mk.nested(np.log(1 - frac) / np.log(1 - b), sel, 26, step, q, mapf, k)
    glaze = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (OPT.get('hlcol', '#fbfbf8'), svgkit.fmt(b), ''.join(hl))
    # the tube lines: the trail, its light edge toward the light (up left), its fine shadow (down right)
    Lx, Ly = svgkit.L3[0], svgkit.L3[1]; ln_ = np.hypot(Lx, Ly); Lx, Ly = Lx / ln_, Ly / ln_
    tr, hi, lo = [], [], []
    lcl = np.clip(lcol * float(np.percentile(D[sel], 60)), 0, 1)
    eps = F('leps', .12)
    for Q, w, fc in runs:
        w *= F('lw', 1.0)
        Qs = simplify(Q, eps)
        d0 = path_d(Qs, q)
        if not d0:
            continue
        o = .22 * w
        tr.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(w), d0))
        hi.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(.38 * w), path_d(Qs + np.array([Lx * o, Ly * o]), q)))
        lo.append('<path stroke-width="%s" d="%s"/>' % (svgkit.fmt(.45 * w), path_d(Qs - np.array([Lx * o, Ly * o]), q)))
    lines = ('<g fill="none" stroke-linecap="round" stroke-linejoin="round">'
             '<g stroke="#1a1c14" stroke-opacity="%s">%s</g><g stroke="%s">%s</g><g stroke="#ffffff" stroke-opacity="%s">%s</g></g>') % (
        svgkit.fmt(F('lsh', .28)), ''.join(lo), svgkit.hexc(lcl * 255), ''.join(tr), svgkit.fmt(F('lhi', .55)), ''.join(hi))
    parts = dict(enamel=''.join(enamel), env=envg, lines=lines, glaze=glaze)
    only = OPT.get('only', 'enamel,env,lines,glaze').split(',')
    bodyg = '<g clip-path="url(#kb)">%s</g>' % ''.join(parts[p_] for p_ in ('enamel', 'env', 'lines', 'glaze') if p_ in only)
    mouth = ''
    if E['inside'].sum() > 10:
        din = svgkit.contour_paths(cv2.GaussianBlur(E['inside'].astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
        mouth = '<path fill="%s" d="%s"/>' % (OPT.get('incol', '#07080e'), din)
    if VIEW == 'shop':
        x0, y0 = mapf(0, 0); x1, y1 = mapf(W, H); vb = '%g %g %g %g' % (x0, y0, x1 - x0, y1 - y0)
    else:
        vb = '0 0 %d %d' % (W, H)
    doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (vb, ''.join(defs), mouth, bodyg)
    open(os.path.join(OUT, 'email_%s.svg' % VIEW), 'w').write(doc)
    log('svg: %d enamel bands, %d light layers, %d lines; %.0f Ko' % (nb, len(hl), len(tr), len(doc) / 1024))
    if VIEW == 'shop':
        import gzip
        d = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), bodyg, mouth=mouth)
        js = json.dumps(d, separators=(',', ':')).encode()
        log('body.json %.0f Ko, gzip %.1f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))


if __name__ == '__main__':
    main()
