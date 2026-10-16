# Where the bouquet may go in a vase drawn from its GLB: the composition geometry the engine needs, measured on the model in
# the shop view (the camera of glbsvg.py / verrelys.py view=shop), never guessed from a turned profile.
#   .venv-depth/Scripts/python compo.py <vase> [k=2] [cb=.5] [show=1]  -> <vase>/out/compo.json, _apercu/compo_<vase>.jpg
# What it measures:
#   mouth  the real opening: the hollow of the model's top seen from above (height map filled to its spill level), its rim
#          projected into the shop view -> mx, mh (centre of the opening above the floor), mo (half width), mry (half height)
#   st     the vessel's true top, column by column, of what stands near the bouquet: every visible surface nearer the eye than
#          the mouth's axis plus cb mouth radii. The opening itself (its back wall) is free: stems leave through it. Parts far
#          behind the bouquet (a back horn) are free too: flowers stand in front of them. What is left is solid: no head lies
#          on it, no stem runs through it
#   fr     the front of the vessel: every surface nearer the eye than the mouth's axis. The body is drawn behind the stems,
#          then again, clipped to fr, over them: the front rim, a bat's head, a dragon's coil hide the stems that pass behind
#   inner  (glass with a modelled cavity) the cavity, where the stems show through the glass, its bottom cavb, half width cavr
import sys, os, json, math
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit, svgkit  # noqa: E402
from skimage import measure, morphology  # noqa: E402

VASE = sys.argv[1]
ARGS = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
OUT = os.path.join(HERE, VASE, 'out')
OPT = {}
for fn in ('glbsvg.json', 'verre.json'):
    p = os.path.join(HERE, VASE, fn)
    if os.path.exists(p):
        OPT = json.load(open(p, encoding='cp1252'))      # written by glbsvg.py's own locale
        break
OPT.update(ARGS)
F = lambda k, d: float(OPT.get(k, d))


def shop_cam(k):
    """the shop camera of glbsvg.render(view=shop) at k pixels per shop unit"""
    P = json.load(open(os.path.join(OUT, 'glb_pose.json')))
    hcm = F('hcm', 26)
    H = int(round((hcm + 2) * svgkit.UPC * k)); W = int(round(H * F('wide', 1.3)))
    D = 40.0
    cam = dict(yaw=P['cam']['yaw'], pitch=math.degrees(math.asin(svgkit.RY)), dist=D, fpx=hcm * svgkit.UPC * k * D,
               cx=W / 2, cy=H / 2, ty=.5, sx=P['cam'].get('sx', 1.0))
    return cam, W, H


def project(cam, W, H, X):
    """model points (n, 3) -> pixel (n, 2) and eye depth (n,)"""
    mv, proj = glbkit.view_matrices(cam, W, H)
    Xh = np.c_[X, np.ones(len(X))]
    e = Xh @ mv.T
    c = e @ proj.T
    ndc = c[:, :3] / c[:, 3:4]
    px = (ndc[:, 0] + 1) / 2 * W
    py = (1 - (ndc[:, 1] + 1) / 2) * H
    return np.c_[px, py], -e[:, 2]


TOPN = 768


def top_view(R, n=TOPN):
    """height map of the model seen from straight above: (n, n) heights (model units, -1 off the model), and the model x, z of
    every cell; the model fills nine tenths of the view (TOPS: pixels per model unit)"""
    global TOPS
    rmax = float(np.abs(R.m.v[:, [0, 2]]).max())
    TOPS = n * .45 / rmax
    cam = dict(yaw=0, pitch=90, dist=40.0, fpx=TOPS * 40.0, cx=n / 2, cy=n / 2, ty=0, sx=1.0)
    r = R.render(cam, n, n, modes=(4,))
    hm = np.where(r['mask'], r['pos'][..., 1], -1.0)
    return hm, r['pos'], r['mask']


def find_mouth(hm, pos, msk):
    """the opening: the deepest hollow of the top (the height map filled from its edges, minus itself), among the hollows that
    reach the upper fifth of the vessel; its rim is the spill level"""
    seed = hm.copy()
    seed[1:-1, 1:-1] = hm.max()
    filled = morphology.reconstruction(seed, hm, method='erosion')
    dep = (filled - hm) * msk
    lab = measure.label(dep > F('hollow', .015))
    best, sc = None, 0
    for rg in measure.regionprops(lab, intensity_image=dep):
        rim = float(np.median(filled[lab == rg.label]))
        print('  hollow: rim %.3f area %d deep %.3f at %s' % (rim, rg.area, rg.intensity_max, np.round(rg.centroid).astype(int)))
        if rim < F('rimmin', 0) or rg.area < 30:
            continue
        s = rg.area * rg.intensity_max
        if s > sc:
            best, sc = rg, s
    if best is None:
        return None
    reg = lab == best.label
    # the lip: the walls around the hollow (a ring just outside it), their median height. A slit or a spathe spills low on one
    # side, but the stems stand in the vessel up to its lip all round
    ring = cv2.dilate(reg.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool) & ~reg & msk
    rim = float(np.percentile(hm[ring], F('rimq', 50)))
    print('  lip heights p25 %.3f p50 %.3f p75 %.3f p90 %.3f max %.3f' % tuple(np.percentile(hm[ring], [25, 50, 75, 90, 100])))
    if 'mouth_y' in OPT:
        rim = F('mouth_y', rim)
    cs = measure.find_contours(reg.astype(float), .5)
    c = max(cs, key=len)
    ij = np.clip(np.round(c).astype(int), 0, np.array(reg.shape) - 1)
    P = np.array([[pos[i, j, 0], rim, pos[i, j, 2]] for i, j in ij[::max(1, len(ij) // 200)] if msk[i, j]], float)
    return dict(rim=rim, edge=P, area=int(best.area), depth=float(best.intensity_max))


def mask_path(msk, mapf, k, step=1.2, smooth=.8):
    """outline of a mask as one even-odd path in shop units"""
    f = cv2.GaussianBlur(msk.astype(np.float32), (0, 0), smooth * k)
    return svgkit.contour_paths(f, .5, step * k, .1, mapf, 1.0)


def main():
    k = F('k', 2)
    cam, W, H = shop_cam(k)
    R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
    fr_ = R.render(cam, W, H, modes=(0, 2, 4))
    hm, tpos, tmsk = top_view(R)
    mo_ = None if F('mouth_manual', 0) > 0 else find_mouth(hm, tpos, tmsk)
    cav = None
    if OPT.get('kind', 'cristal' if VASE == 'cristal-violet' else '') == 'cristal' and F('cav', 1) > 0:
        # the cristal's cavity, exactly as verrelys.py models it (the model narrowed and lifted off its thick base)
        sx, y0c, y1c = F('cavx', .72), F('cavy0', .2), F('cavy1', 1.02)
        vc = R.m.v * np.array([sx, (y1c - y0c), sx], np.float32) + np.array([0, y0c, 0], np.float32)
        R.vao.release()
        vbo = R.ctx.buffer(np.hstack([vc, R.m.n, R.m.uv]).astype('f4').tobytes())
        ibo = R.ctx.buffer(R.m.f.astype('i4').tobytes())
        R.vao = R.ctx.vertex_array(R.prog, [(vbo, '3f 3f 2f', 'pos', 'nrm', 'uv')], ibo)
        cav = R.render(cam, W, H, modes=(2,))
    R.ctx.release()
    m = fr_['mask']
    ys = np.where(m.any(1))[0]
    yfoot = ys.max() + 1
    mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
    U = F('hcm', 26) * svgkit.UPC
    log = []
    # ---- the mouth
    if mo_ is not None:
        E = mo_['edge']
        ctr = np.array([[np.mean(E[:, 0]), mo_['rim'], np.mean(E[:, 2])]])
        pe, _ = project(cam, W, H, np.c_[E[:, 0], np.full(len(E), mo_['rim']), E[:, 2]])
        pc, dc = project(cam, W, H, ctr)
        r3 = float(np.sqrt(mo_['area'] / math.pi) / TOPS)                # model units
        xs, ys_ = pe[:, 0], pe[:, 1]
        mx = (xs.min() + xs.max()) / 2; my = (ys_.min() + ys_.max()) / 2
        mo = (xs.max() - xs.min()) / 2 / k; mry = (ys_.max() - ys_.min()) / 2 / k
        X0, Y0 = mapf(mx, my)
        mouth = dict(mx=round(X0 - svgkit.VX, 1), mh=round(svgkit.FL - Y0, 1), mo=round(mo * .92, 1), mry=round(max(1.5, mry), 1))
        d_a = float(dc[0])
        log.append('mouth: rim %.3f, hollow %.3f deep, r %.3f; shop mx %.1f mh %.1f mo %.1f mry %.1f (hint %s %s %s)' % (
            mo_['rim'], mo_['depth'], r3, mouth['mx'], mouth['mh'], mouth['mo'], mouth['mry'], OPT.get('mx_u'), OPT.get('mh_u'), OPT.get('mo_u')))
    else:
        # a model with a closed top (a solid crystal): the mouth read on the shop view (glbsvg.json mh_u, mx_u, mo_u)
        mouth = dict(mx=F('mx_u', 0), mh=F('mh_u', 200), mo=F('mo_u', 20), mry=round(F('mo_u', 20) * svgkit.RY, 1))
        r3 = mouth['mo'] / U
        # the axis depth: the model's centre line at the mouth's height
        y_m = mouth['mh'] / U
        _, dc = project(cam, W, H, np.array([[0, y_m, 0]]))
        d_a = float(dc[0])
        log.append('mouth: closed top, read on the shop view: %s' % mouth)
    # ---- what stands in front of the stems, what is solid near the bouquet
    dep = np.where(m, fr_['depth'], 1e3)
    cb = F('cb', .5) * max(r3, .02)
    # above the mouth's centre the stems stand in its axis plane: what is nearer hides them. Below it they are in the vessel:
    # the body hides them, except what is seen clearly behind them through an opening (a slit, a spathe's throat)
    Ym = yfoot - mouth['mh'] * k
    rows = np.arange(H)[:, None]
    fr = m & (dep < d_a + np.where(rows > Ym, max(cb, F('cbin', .06)), -F('eps', .004)))
    # below the mouth only an opening that runs down from the mouth (a slit, a spathe's throat) shows the stems standing in the
    # vessel: the window. Any other surface seen behind them there (the far side of a limb) is the body, in front
    free = m & ~fr & (rows > Ym)
    # a thin band along a limb is not an opening: cut away (opening of 4 units) before the parts are told apart
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(8 * k) | 1, int(8 * k) | 1))
    free_o = cv2.morphologyEx(free.astype(np.uint8), cv2.MORPH_OPEN, ker).astype(bool)
    lab_ = measure.label(free_o)
    Mx = W / 2 + mouth['mx'] * k
    win = np.zeros_like(m)
    for rg in measure.regionprops(lab_):
        cc = rg.coords
        near = (cc[:, 0] < Ym + (3 * mouth['mry'] + 6) * k) & (np.abs(cc[:, 1] - Mx) < mouth['mo'] / .92 * 1.3 * k)
        if near.any() and rg.area > 40 * k * k:
            win[lab_ == rg.label] = True
    win = cv2.dilate(win.astype(np.uint8), ker).astype(bool) & free
    # and only straight below the opening: what lies to its sides is outside the vessel's hollow (the foot of a shell wrapped
    # behind a cup, say), where no stem can stand
    cols_ = np.arange(W)[None, :]
    win &= np.abs(cols_ - Mx) <= mouth['mo'] / .92 * F('winw', 1.15) * k
    if F('win', 1) <= 0:                   # a vessel with no opening down its front (win=0 in its settings)
        win[:] = False
    fr |= free & ~win
    solid = m & (dep < d_a + cb)
    # silhouette top of the solid, column by column, in shop units (h above the floor; 0 where nothing solid stands)
    x_u0 = math.floor(mapf(0, 0)[0]); x_u1 = math.ceil(mapf(W, 0)[0])
    cols = solid.any(0)
    top_px = np.where(cols, solid.argmax(0), yfoot)
    dx = 2.0
    xs_u = np.arange(x_u0, x_u1 + dx, dx)
    hs = []
    for xu in xs_u:
        c0 = int(np.clip((xu - svgkit.VX - dx / 2) * k + W / 2, 0, W - 1)); c1 = int(np.clip((xu - svgkit.VX + dx / 2) * k + W / 2, 0, W - 1))
        t = top_px[c0:c1 + 1].min() if c1 >= c0 else yfoot
        hs.append(max(0.0, (yfoot - t) / k))
    hs = np.array(hs)
    # over the opening a head stays above its front lip: the stems leave the vessel there, never through its side
    cor = np.abs(xs_u - svgkit.VX - mouth['mx']) <= mouth['mo'] / .92
    hs[cor] = np.maximum(hs[cor], mouth['mh'] - mouth['mry'])
    nz = np.where(hs > 0)[0]
    a, b = (nz.min(), nz.max()) if len(nz) else (0, 0)
    st = dict(x0=round(float(xs_u[a] - svgkit.VX), 1), dx=dx, h=[round(float(v), 1) for v in hs[a:b + 1]])
    out = dict(mouth, st=st, fr=mask_path(fr, mapf, k), da=round(d_a, 4), cb=round(cb, 4))
    if cav is None and win.sum() > 400 * k * k:
        # an opaque vessel open down its front: the stems are seen in the window, down to its bottom
        wr = np.where(win.any(1))[0]
        hw_ = [np.ptp(np.where(win[y])[0]) / 2 for y in wr]
        out.update(inner=mask_path(win, mapf, k, smooth=.5), cavb=round(mapf(0, wr.max())[1], 1), cavr=round(float(np.median(hw_)) / k, 1), clear=1)
        log.append('window: %.0f units high, bottom %.1f, half width %.1f' % ((wr.max() - wr.min()) / k, out['cavb'], out['cavr']))
    if cav is not None:
        cm = cav['mask'] & m
        rows = np.where(cm.any(1))[0]
        xc = np.array([np.where(cm[y])[0].mean() for y in rows]); hw = np.array([np.ptp(np.where(cm[y])[0]) / 2 for y in rows])
        hw = np.convolve(np.pad(hw, 15, mode='edge'), np.ones(31) / 31, 'valid'); xc = np.convolve(np.pad(xc, 15, mode='edge'), np.ones(31) / 31, 'valid')
        yb = rows.max(); rr = F('cavround', 1.3) * np.median(hw)
        hw = hw * np.sqrt(np.clip((yb - rows) / rr, 0, 1))
        cm = np.zeros(m.shape, bool); X = np.arange(m.shape[1])
        for y, c_, w_ in zip(rows, xc, hw):
            cm[y] = np.abs(X - c_) <= w_
        cm &= m
        out.update(inner=mask_path(cm, mapf, k), cavb=round(mapf(0, yb)[1], 1), cavr=round(float(np.median(hw)) / k, 1))
        log.append('cavity: bottom %.1f, half width %.1f' % (out['cavb'], out['cavr']))
    json.dump(out, open(os.path.join(OUT, 'compo.json'), 'w'), separators=(',', ':'))
    log.append('st %d columns from x %+.0f, top %.0f; fr %.0f %% of the vessel; path %.1f Ko' % (
        len(st['h']), st['x0'], max(st['h']), 100 * fr.sum() / max(1, m.sum()), len(out['fr']) / 1024))
    # ---- the sheet: the vessel grey, its front red, the solid top blue, the mouth green
    if F('show', 1) > 0:
        img = np.full((H, W, 3), 245, np.uint8)
        al = np.clip(fr_['albedo'][..., ::-1] ** (1 / 2.2), 0, 1) * 255
        img[m] = (al[m] * .55 + 255 * .45).astype(np.uint8)
        tint = lambda M, c, a: img.__setitem__(M, (img[M] * (1 - a) + np.array(c) * a).astype(np.uint8))
        tint(fr, (60, 60, 230), .45)
        tint(m & ~fr & solid, (200, 120, 60), .45)
        tint(win, (60, 200, 60), .35)
        for i, xu in enumerate(xs_u):
            if hs[i] > 0:
                x = int((xu - svgkit.VX) * k + W / 2); y = int(yfoot - hs[i] * k)
                cv2.circle(img, (x, y), 2, (200, 90, 20), -1)
        cx, cy = int(W / 2 + mouth['mx'] * k), int(yfoot - mouth['mh'] * k)
        cv2.ellipse(img, (cx, cy), (int(mouth['mo'] / .92 * k), int(mouth['mry'] * k)), 0, 0, 360, (40, 170, 40), 2)
        cv2.drawMarker(img, (cx, cy), (40, 170, 40), cv2.MARKER_CROSS, 14, 2)
        if cav is not None:
            cnt, _ = cv2.findContours(cm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
            cv2.drawContours(img, cnt, -1, (180, 60, 160), 2)
        y0 = max(0, ys.min() - 20)
        cv2.imwrite(os.path.join(HERE, '_apercu', 'compo_%s.jpg' % VASE), img[y0:yfoot + 10], [cv2.IMWRITE_JPEG_QUALITY, 88])
    print('\n'.join('%s: %s' % (VASE, s) for s in log))


if __name__ == '__main__':
    main()
