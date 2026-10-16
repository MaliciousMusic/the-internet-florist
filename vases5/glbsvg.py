# A vase from its textured GLB (Meshy), in the camera of its reference photograph, as pure SVG. The photograph only places the
# model (glbkit fit: pitch, focal, turn, scale); everything drawn comes from the GLB:
#   paint  = the GLB's own colour texture seen by that camera, vectorised as it is by vtracer (stacked areas, spline edges);
#   light  = computed per pixel on the GLB's normals, depth and roughness map (shade with occlusion, studio highlights,
#            surroundings at grazing angles), written as nested soft layers clipped to the silhouette.
# Output: <vase>/out/glbsvg_<tag>.svg (viewBox = the photograph's pixels), field_<tag>.png (the field the layers write).
#   .venv-depth/Scripts/python glbsvg.py <vase> [tag] [key=value ...]
import sys, os, json, re, gzip, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit, svgkit  # noqa: E402
LUM = np.array([.3, .59, .11])

VASE = sys.argv[1]
A = sys.argv[2:]
TAG = A[0] if A and '=' not in A[0] else 'a'
OPT = dict(a.split('=', 1) for a in A if '=' in a)
OUT = os.path.join(HERE, VASE, 'out')
CFG = os.path.join(HERE, VASE, 'glbsvg.json')
if os.path.exists(CFG):                       # the vase's own settings, overridden by the command line
    OPT = dict(json.load(open(CFG)), **OPT)
F = lambda k, d: float(OPT.get(k, d))
T0 = time.time()
log = lambda *a: print('[%5.1fs]' % (time.time() - T0), *a, flush=True)


def hexrgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


VIEW = OPT.get('view', 'photo')


def render(s):
    P = json.load(open(os.path.join(OUT, 'glb_pose.json')))
    cam, W, H = dict(P['cam']), P['W'], P['H']
    if VIEW == 'shop':
        # the shop: the photograph's turn, the eye 9.2 deg above, far away (nearly orthographic), the vessel's real height
        import math
        hcm = F('hcm', 26); k = s
        H = int(round((hcm + 2) * svgkit.UPC * k)); W = int(round(H * F('wide', 1.3)))
        D = 40.0
        cam = dict(yaw=cam['yaw'], pitch=math.degrees(math.asin(svgkit.RY)), dist=D, fpx=hcm * svgkit.UPC * k * D, cx=W / 2, cy=H / 2,
                   ty=.5, sx=cam.get('sx', 1.0))
        s = 1.0
    cam['fpx'] *= s; cam['cx'] *= s; cam['cy'] *= s
    Ws, Hs = int(round(W * s)), int(round(H * s))
    R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
    import moderngl
    # the texture read at its own resolution (no mip levels: they bleed one chart of the atlas into the next at the seams),
    # the image supersampled ss times and averaged down
    R.prog['bump'].value = F('bump', 1.0)
    for t in (R.tb, R.tm, R.tn):
        t.filter = (moderngl.LINEAR, moderngl.LINEAR)
    ss = int(F('ss', 2))
    c2 = dict(cam, fpx=cam['fpx'] * ss, cx=cam['cx'] * ss, cy=cam['cy'] * ss)
    r = R.render(c2, Ws * ss, Hs * ss, modes=(0, 1, 2, 3, 4, 5, 6))
    R.ctx.release()
    if ss > 1:
        cov = r['mask'].astype(np.float32)
        dn = lambda a: cv2.resize(a, (Ws, Hs), interpolation=cv2.INTER_AREA)
        cw = np.maximum(dn(cov), 1e-6)
        out = dict(mask=dn(cov) > .5)
        out['front'] = dn(r['front'] * cov) / cw
        out['pos'] = dn(r['pos'] * cov[..., None]) / cw[..., None]
        for key in ('albedo', 'normal', 'mr', 'nmap'):
            out[key] = dn(r[key] * cov[..., None]) / cw[..., None]
        # depth: the nearest surface, not an average across an edge
        d = np.where(r['mask'], r['depth'], 1e3).astype(np.float32)
        out['depth'] = cv2.erode(d, np.ones((ss, ss), np.uint8))[::ss, ::ss][:Hs, :Ws]
        out['uv'] = r['uv'][ss // 2::ss, ss // 2::ss][:Hs, :Ws]
        r = out
    r['cam'] = cam
    return r, W, H                  # the output frame: the photograph's pixels (or the shop render, where s = 1)


def occlusion(depth, m, k):
    """cavities: a pixel whose surroundings come nearer the eye than itself is shut in (screen-space, several radii)"""
    d = np.where(m, depth, 0).astype(np.float32)
    w = m.astype(np.float32)
    ao = np.zeros_like(d)
    for rad, wt in ((2, .35), (6, .4), (16, .25)):
        r_ = rad * k
        num = cv2.GaussianBlur(d, (0, 0), r_); den = np.maximum(cv2.GaussianBlur(w, (0, 0), r_), 1e-4)
        near = num / den
        ao += wt * np.clip((d - near) / (F('aod', .012) * rad), 0, 1)
    return np.where(m, ao, 0)


def nested(f, sel, lev_max, step, q, mapf, k):
    """closed iso-lines of a layer-count field at .5, 1.5, ... (each one more layer of the same colour)"""
    fe, _ = svgkit.extend(f.astype(np.float32), sel, int(3 * k) + 1)
    fe = np.where(cv2.dilate(sel.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0, fe, 0).astype(np.float32)
    out = []
    top = min(float(fe[sel].max()) if sel.any() else 0, lev_max)
    for lev in np.arange(.5, top + .01, 1.0):
        d = svgkit.contour_paths(fe, float(lev), step, q, mapf, 1.0)
        if d:
            out.append('<path d="%s"/>' % d)
    return out


def trace(alb, m, s):
    """the texture as seen by the camera, vectorised by vtracer -> svg paths (in working pixels)"""
    import vtracer
    pre = F('pre', 3)
    a = (np.clip(alb, 0, 1) * 255).astype(np.uint8)
    if pre > 0:                                  # tame the texture's speckle before tracing (edges kept)
        a = cv2.bilateralFilter(a, 0, pre * 6, pre)
    # carry the colours a little past the silhouette so the clip, not the trace, makes the edge
    # (ext: vtracer may drop a thin edge band of the outermost colour; a wider margin keeps it under the clip)
    ae, me = svgkit.extend(a.astype(np.float32), m, int(F('ext', 4)))
    rgba = np.dstack([np.clip(ae, 0, 255).astype(np.uint8)[..., ::-1], (me * 255).astype(np.uint8)])
    src = os.path.join(OUT, '_tex_%s.png' % TAG); dst = os.path.join(OUT, '_trace_%s.svg' % TAG)
    cv2.imwrite(src, rgba)
    vtracer.convert_image_to_svg_py(src, dst, colormode='color', hierarchical='stacked', mode='spline',
                                    filter_speckle=int(F('fs', 4)), color_precision=int(F('cp', 7)), layer_difference=int(F('ld', 7)),
                                    corner_threshold=int(F('ct', 60)), length_threshold=F('lt', 4.0), max_iterations=10,
                                    splice_threshold=int(F('sp', 45)), path_precision=int(F('pp', 1)))
    t = open(dst).read()
    return t[t.index('<path'):t.rindex('</svg>')], a


def studio(nb, rough):
    import glbsvg_studio
    return glbsvg_studio.studio(nb, rough, OPT)


def seams(alb, uv, m):
    """the atlas seams: where the texture coordinates jump between two neighbouring pixels of one surface, the colours of two
    charts meet (often a dark hairline); those pixels are filled again from their neighbours"""
    du = np.abs(np.diff(uv, axis=0, prepend=uv[:1])).sum(-1) + np.abs(np.diff(uv, axis=1, prepend=uv[:, :1])).sum(-1)
    inner = cv2.erode(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    med = np.median(du[inner]) if inner.any() else 1e-3
    sm = inner & (du > F('seamk', 60) * med)
    log('seams: uv jump median %.2g, p99 %.2g, p99.9 %.2g' % (med, np.percentile(du[inner], 99), np.percentile(du[inner], 99.9)))
    sm = sm.astype(np.uint8)
    a = (np.clip(alb, 0, 1) * 255).astype(np.uint8)
    a = cv2.inpaint(a, sm, 3, cv2.INPAINT_TELEA)
    log('seams: %d px filled' % int(sm.sum()))
    return a.astype(np.float32) / 255


def grain(alb, sm8, m, mapf, step, q, k, W, H):
    """the texture's fine grain (speckles, crackle) that the trace smooths away, as SVG noise: per colour family of the
    smoothed texture, a light and a dark speckle (feTurbulence thresholded into crisp flecks), their colours, coverage and
    size measured on the texture itself"""
    smo = sm8.astype(np.float32) / 255
    Y = alb @ LUM; Ys = smo @ LUM
    res = np.where(m, Y - Ys, 0)
    lab = cv2.cvtColor(sm8, cv2.COLOR_RGB2Lab).astype(np.float32)
    K = int(F('gk', 4))
    X = lab[m][::7]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, .5)
    _, _, cen = cv2.kmeans(X, K, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    d = np.stack([np.linalg.norm(lab - c, axis=-1) for c in cen], -1)
    lb = np.argmin(d, -1).astype(np.uint8)
    lb = cv2.medianBlur(lb, 9)
    defs, groups = [], []
    for c in range(K):
        z = m & (lb == c)
        if z.sum() < 400 * k * k:
            continue
        r_ = res[z]; sd = float(r_.std())
        log('  family %d: %d px, residual sd %.4f' % (c, z.sum(), sd))
        if sd < F('gmin', .012):
            continue
        # size of the flecks: mean run between sign changes of the residual (along rows and columns)
        sg = np.sign(res); zz = z[:, 1:] & z[:, :-1]
        cross = (sg[:, 1:] != sg[:, :-1])[zz].mean()
        zy = z[1:] & z[:-1]
        cross = .5 * (cross + (sg[1:] != sg[:-1])[zy].mean())
        f = float(np.clip(cross / 2 * F('gfk', 1.0) * k, .02, .9))           # cycles per output pixel
        cpath = svgkit.contour_paths(cv2.GaussianBlur(z.astype(np.float32), (0, 0), 1.2 * k), .5, step * 1.5, q, mapf, 1.0)
        if not cpath:
            continue
        ys, xs = np.where(z)
        x0, y0 = mapf(xs.min(), ys.min()); x1, y1 = mapf(xs.max() + 1, ys.max() + 1)
        box = 'x="%d" y="%d" width="%d" height="%d"' % (x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4)
        layers = ''
        for sgn, nm in ((1, 'l'), (-1, 'd')):
            sel = z & (sgn * res > F('gthr', 1.0) * sd)
            cov = sel.sum() / z.sum()
            if sel.sum() < 30:
                continue
            col = np.median(alb[sel], 0)
            # the noise (fractal, red channel ~ N(.5, .1)) thresholded at the coverage measured on the texture
            from statistics import NormalDist
            t = .5 + F('gsd', .1) * NormalDist().inv_cdf(1 - min(max(cov, .005), .5))
            kk = F('gsharp', 14)
            fid = 'g%d%s' % (c, nm)
            row = '%s 0 0 0 %s' % (svgkit.fmt(kk), svgkit.fmt(-kk * t))
            defs.append('<filter id="%s" filterUnits="userSpaceOnUse" %s color-interpolation-filters="sRGB">'
                        '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="2" seed="%d"/>'
                        '<feColorMatrix values="0 0 0 0 %s 0 0 0 0 %s 0 0 0 0 %s %s"/></filter>' % (
                            fid, box, svgkit.fmt(round(f, 3)), 3 + c * 2 + (sgn > 0),
                            svgkit.fmt(round(col[0], 3)), svgkit.fmt(round(col[1], 3)), svgkit.fmt(round(col[2], 3)), row))
            op = float(np.clip(F('gop', .85), 0, 1))
            layers += '<rect %s filter="url(#%s)" opacity="%s"/>' % (box, fid, svgkit.fmt(op))
            log('  grain %d%s: cover %.2f, sd %.3f, freq %.3f, colour %s' % (c, nm, cov, sd, f, svgkit.hexc(col * 255)))
        if layers:
            defs.append('<clipPath id="gc%d"><path d="%s"/></clipPath>' % (c, cpath))
            groups.append('<g clip-path="url(#gc%d)">%s</g>' % (c, layers))
    return ''.join(defs), ''.join(groups)


def shop_out(body, defs, cam):
    import glbsvg_shop
    glbsvg_shop.shop_out(OUT, VASE, OPT, body, defs, cam, log)


def stone(alb, m, mapf):
    """a stone or concrete body (stone=1): fine pits and pale flecks over the whole surface, and a broad soft mottling, as SVG
    noise; their colours come from the texture's median, drawn towards a neutral grey (stonegrey), their sizes in shop units"""
    col = np.median(alb[m], 0)
    grey = np.full(3, float(col @ LUM))
    g = F('stonegrey', .35)
    base = col * (1 - g) + grey * g
    ys, xs = np.where(m)
    x0, y0 = mapf(xs.min(), ys.min()); x1, y1 = mapf(xs.max() + 1, ys.max() + 1)
    box = 'x="%s" y="%s" width="%s" height="%s"' % tuple(svgkit.fmt(round(v, 1)) for v in (x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4))
    defs, layers = [], []
    # (name, colour, base frequency per unit, coverage, sharpness, opacity, seed)
    for nm, c, fq, cov, kk, op, seed in (('sd', base * .62, F('stonef', 1.1), F('stonepits', .16), 16, F('stoneop', .55), 11),
                                         ('sl', np.clip(base * 1.32 + .04, 0, 1), F('stonef', 1.1) * .8, F('stonefl', .10), 16, F('stoneop', .55) * .7, 17),
                                         ('sm', base * .8, F('stonemf', .045), .5, 2.2, F('stonemop', .22), 23)):
        from statistics import NormalDist
        t = .5 + .1 * NormalDist().inv_cdf(1 - cov)
        defs.append('<filter id="%s" filterUnits="userSpaceOnUse" %s color-interpolation-filters="sRGB">'
                    '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="%d" seed="%d"/>'
                    '<feColorMatrix values="0 0 0 0 %s 0 0 0 0 %s 0 0 0 0 %s %s 0 0 0 %s"/></filter>' % (
                        nm, box, svgkit.fmt(round(fq, 4)), 3 if nm == 'sm' else 2, seed,
                        svgkit.fmt(round(c[0], 3)), svgkit.fmt(round(c[1], 3)), svgkit.fmt(round(c[2], 3)),
                        svgkit.fmt(kk), svgkit.fmt(round(-kk * t, 3))))
        layers.append('<rect %s filter="url(#%s)" opacity="%s"/>' % (box, nm, svgkit.fmt(round(op, 3))))
    log('stone: base %s, pits %.2f, flecks %.2f' % (svgkit.hexc(base * 255), F('stonepits', .16), F('stonefl', .10)))
    return ''.join(defs), ''.join(layers)


def main():
    s = F('s', 1.0)
    r, W, H = render(s)
    m = r['mask']
    k = s
    if VIEW == 'shop':
        Hs_, Ws_ = m.shape
        yfoot = np.where(m.any(1))[0].max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - Ws_ / 2) / k, svgkit.FL - (yfoot - y) / k)
    # hairline slits of the model (a wing laid against the body) would break every layer along them: closed, and the small
    # holes filled (a real opening, like the space under a wing, is far larger)
    mc = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    n_, lb_, st_, _ = cv2.connectedComponentsWithStats(1 - mc, connectivity=4)
    for j in range(1, n_):
        if st_[j, cv2.CC_STAT_AREA] < F('hole', 150) * k * k:
            mc[lb_ == j] = 1
    m = mc.astype(bool)
    if VIEW != 'shop':
        mapf = lambda x, y: (x / s, y / s)
    q = F('q', .1 if VIEW != 'shop' else .05)
    log('render %dx%d, %d px; roughness p10/50/90 %s, metal p50 %.2f' % (m.shape[1], m.shape[0], m.sum(),
        np.round(np.percentile(r['mr'][..., 1][m], [10, 50, 90]), 2), np.median(r['mr'][..., 2][m])))
    alb = r['albedo'].astype(np.float32)
    if 'base' in OPT:
        # an untextured model given one material colour (the patinated bronze of the lily vase), with the patina darker in
        # the hollows and rubbed lighter on what stands out
        ao0 = occlusion(r['depth'], m, k)
        alb = np.broadcast_to(hexrgb(OPT['base']), alb.shape).copy()
        alb = alb * (1 - F('patina', .45) * np.clip(ao0 * 1.6, 0, 1))[..., None]
    if F('seam', 1) > 0:
        alb = seams(alb, r['uv'], m)
    n = r['normal'].astype(np.float32)
    if F('usenmap', 0) > 0:
        # the GLB's normal map: the fine relief (veins, scales, ribs) the mesh does not carry
        nm_ = r['nmap'] / np.maximum(np.linalg.norm(r['nmap'], axis=2, keepdims=True), 1e-6)
        n = np.where(m[..., None], nm_, n).astype(np.float32)
    # the GLB's normals, softened a little (Meshy's facets), for the light only
    nb = np.dstack([cv2.GaussianBlur(np.where(m, n[..., i], 0), (0, 0), F('nblur', 1.2) * k) for i in range(3)])
    nb /= np.maximum(np.linalg.norm(nb, axis=2, keepdims=True), 1e-6)
    rough = np.clip(r['mr'][..., 1] if F('userough', 1) > 0 else np.full(m.shape, F('rough', .5)), .04, 1)
    rough = np.clip(rough * F('rk', 1.0), .04, 1)
    # ---- light: the shop's single light (upper left, in front), a soft studio
    L = svgkit.L3
    if 'L' in OPT:
        L = np.array([float(v) for v in OPT['L'].split(',')]); L /= np.linalg.norm(L)
    wrap = F('wrap', .35)
    diff = np.clip(((nb @ L) + wrap) / (1 + wrap), 0, 1)
    sky = .5 + .5 * np.clip(-nb[..., 1], -1, 1)
    D = F('amb', .42) * (.4 + .6 * sky) + F('diff', .75) * diff
    ao = occlusion(r['depth'], m, k)
    D = D * (1 - F('aok', .55) * ao)
    # the inside of the vessel (the model's back faces, seen through an opening) gets little light
    inside = np.where(m, 1 - r['front'], 0).astype(np.float32)
    if F('inner', 0) > 0:
        # a single-walled opening (the butterfly's slit): the wall's inner face, whose normal turns towards the axis
        mv, _ = glbkit.view_matrices(r['cam'], m.shape[1], m.shape[0])
        Rm = mv[:3, :3] / np.linalg.norm(mv[:3, :3], axis=0)
        pos = r['pos']; rad = np.dstack([pos[..., 0], np.zeros_like(pos[..., 0]), pos[..., 2]])
        rad /= np.maximum(np.linalg.norm(rad, axis=2, keepdims=True), 1e-6)
        rs = (rad @ Rm.T) * np.array([1, -1, 1])
        inside = np.maximum(inside, np.clip(-(nb * rs).sum(-1) / F('innerk', .35), 0, 1) * (pos[..., 1] > F('innerh', 0)))
    inside = cv2.GaussianBlur(np.where(m, inside, 0), (0, 0), 1.5 * k)
    D = D * (1 - F('ink', .5) * inside)
    log('inside: %.1f %% of the view' % (100 * (inside[m] > .5).mean()))
    dref = float(np.percentile(D[m], F('dpct', 80)))
    Dr = D / dref
    Dr = 1 + F('contrast', .8) * (Dr - 1)
    # highlights: Blinn-Phong lobe sharpened by the roughness map, a broad soft-box lobe, a little rim of back light
    Hv = L + np.array([0, 0, 1.]); Hv /= np.linalg.norm(Hv)
    nh = np.clip(nb @ Hv, 0, 1)
    pw = np.clip(2 / np.maximum(rough, .05) ** 2 - 2, 4, 400) * F('pk', 1.0)
    spec = F('ks', .22) * (1 - rough) ** F('rpow', 1.5) * nh ** pw
    box = F('kb', .10) * np.clip((nb @ np.array([-.55, -.55, .63])) - .55, 0, 1) / .45 * (1 - rough)
    nz = np.clip(nb[..., 2], 0, 1)
    fr = (.04 + .96 * (1 - nz) ** 5) * F('envk', .35)
    env = hexrgb(OPT.get('env', '#e9e6e0'))
    # the glaze's mirror: a tight lobe of the soft box, crisp white on the glossy parts
    spec2 = F('ks2', 0) * (1 - rough) ** 2 * nh ** F('pw2', 220)
    S = np.where(m, (spec + spec2 + box + F('kst', 1.3) * studio(nb, rough)) * (1 - inside), 0)
    # ---- paint
    tpath, a8 = trace(alb, m, s)
    ntr = tpath.count('<path')
    pk = F('tk', 1.0)                                  # the paint laid at the lit side's light (the shade layers do the rest)
    if pk != 1:
        tpath = re.sub(r'fill="#([0-9a-fA-F]{6})"', lambda mm: 'fill="%s"' % svgkit.hexc(np.clip(hexrgb(mm.group(1)) * pk, 0, 1) * 255), tpath)
    # the stacked areas of vtracer leave hairline gaps where the area beneath shows (a coloured thread): each area is edged
    # with its own colour
    if F('tstroke', .8) > 0:
        tpath = re.sub(r'fill="(#[0-9a-fA-F]{6})"', lambda mm: 'fill="%s" stroke="%s"' % (mm.group(1), mm.group(1)), tpath)
        tpath = '<g stroke-width="%s" stroke-linejoin="round">%s</g>' % (svgkit.fmt(F('tstroke', .8) * (1 if VIEW == 'shop' else s)), tpath)
    if VIEW == 'shop':
        x0_, y0_ = mapf(0, 0)
        tpath = '<g transform="matrix(%s 0 0 %s %s %s)">%s</g>' % (svgkit.fmt(round(1 / k, 5)), svgkit.fmt(round(1 / k, 5)), svgkit.fmt(round(x0_, 3)), svgkit.fmt(round(y0_, 3)), tpath)
    elif s != 1:
        tpath = '<g transform="scale(%s)">%s</g>' % (svgkit.fmt(round(1 / s, 5)), tpath)
    log('trace: %d paths, %.0f Ko' % (ntr, len(tpath) / 1024))
    # ---- layers
    step = F('step', 1.0) * k
    svgkit.RDP_EPS = F('rdp', .3); svgkit.AREA_MIN = F('amin', .5) * k * k
    sil = svgkit.contour_paths(cv2.GaussianBlur(m.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
    defs = ['<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', 2.2) / (k if VIEW == 'shop' else 1)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', 1.0) / (k if VIEW == 'shop' else 1)),
            '<clipPath id="kb"><path d="%s"/></clipPath>' % sil]
    a_ = F('sh_a', .05)
    sh = nested(np.log(np.clip(Dr, .03, 1)) / np.log(1 - a_), m, F('shmax', 60), step * 1.3, q, mapf, k)
    shade = '<g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>' % (OPT.get('shcol', '#0e0f16'), svgkit.fmt(a_), ''.join(sh))
    lift = np.where(m, np.clip(Dr - 1, 0, None) * F('lift', .5), 0)          # the lit side a touch above the texture
    e_ = F('env_a', .12)
    ev = nested(np.log(np.clip(1 - fr, .02, 1)) / np.log(1 - e_), m, 20, step, q, mapf, k)
    envg = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (svgkit.hexc(env * 255), svgkit.fmt(e_), ''.join(ev))
    paint_rgb = a8.astype(np.float32) / 255
    lit = paint_rgb * np.minimum(Dr, 1)[..., None]
    lit = lit * (1 - fr[..., None]) + env * fr[..., None]
    Yc = np.clip(lit @ np.array([.3, .59, .11]), 0, .97)
    add = S + lift * (paint_rgb @ np.array([.3, .59, .11]))
    frac = np.clip(add / np.maximum(1 - Yc, .03), 0, .985)
    b = F('hl_b', .05)
    hl = nested(np.log(1 - frac) / np.log(1 - b), m, 45, step, q, mapf, k)
    glaze = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (OPT.get('hlcol', '#fbfaf6'), svgkit.fmt(b), ''.join(hl))
    gdefs, grn = grain(alb, a8, m, mapf, step, q, k, W, H) if F('grain', 0) > 0 else ('', '')
    defs.append(gdefs)
    sdefs, stn = stone(alb, m, mapf) if F('stone', 0) > 0 else ('', '')
    defs.append(sdefs)
    parts = dict(paint=tpath, grain=grn, stone=stn, shade=shade, env=envg, glaze=glaze)
    only = OPT.get('only', 'paint,grain,stone,shade,env,glaze').split(',')
    body = '<g clip-path="url(#kb)">%s</g>' % ''.join(parts[p] for p in ('paint', 'grain', 'stone', 'shade', 'env', 'glaze') if p in only)
    bg = OPT.get('bg', '')
    back = '<rect width="%d" height="%d" fill="%s"/>' % (W, H, bg) if bg else ''
    if VIEW == 'shop':
        x0_, y0_ = mapf(0, 0); x1_, y1_ = mapf(W, H)
        vb = '%s %s %s %s' % tuple(svgkit.fmt(v) for v in (x0_, y0_, x1_ - x0_, y1_ - y0_))
        doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%d" height="%d"><defs>%s</defs><g id="vase">%s</g></svg>' % (
            vb, W, H, ''.join(defs), body)
        shop_out(body, defs, r['cam'])
    else:
        doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (
            W, H, W, H, ''.join(defs), back, body)
    dst = os.path.join(OUT, 'glbsvg_%s.svg' % TAG)
    open(dst, 'w').write(doc)
    img = np.clip(lit + add[..., None], 0, 1); img[~m] = 1
    cv2.imwrite(os.path.join(OUT, 'field_%s.png' % TAG), (img[..., ::-1] * 255).astype(np.uint8))
    z = len(gzip.compress(doc.encode(), 9))
    log('svg: %d trace paths, %d shade, %d surroundings, %d light layers; %.0f Ko, gzip %.0f Ko -> %s' % (
        ntr, len(sh), len(ev), len(hl), len(doc) / 1024, z / 1024, os.path.relpath(dst, HERE)))


if __name__ == '__main__':
    main()
