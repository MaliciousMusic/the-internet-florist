# A vessel rebuilt from its 3D model (GLB fitted on the photograph by glbkit.py), element by element, then written as SVG.
# The photograph is never pasted on the model: it only gives measured palettes (colours by element and height) and the
# tone statistics the light is tuned to. Each element has its own clean material and its own layers:
#   elements   - turned body (a perfect surface of revolution: the model's own surface is bumpy), relief decor (what stands out
#                of the body: the carp, from the model's geometry), lip, inside of the mouth;
#   light      - the shop light (svgkit.L3) and a studio (softbox, window, floor, ceiling) on the exact normals; cavities of the
#                engraving from the depth; shadows cast by the relief onto the body, marched through the depth;
#   material   - albedo by element (body: a measured gradient with height), metallic or polished response;
#   SVG        - per element: its base colour, then nested shadow layers (dark, tinted, partly transparent) and highlight layers
#                (light, tinted), clipped to the element, slightly softened: hue and saturation are never averaged away.
#   .venv-depth/Scripts/python glbvase.py <vase> <view: shop|photo> [key=value ...]
import sys, os, json, math, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import svgkit, mesure, glbkit  # noqa: E402

A = sys.argv[1:]
VASE, VIEW = A[0], A[1]
OPT = dict(a.split('=', 1) for a in A[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
OUT = os.path.join(HERE, VASE, 'out')
CFG = json.load(open(os.path.join(HERE, VASE, 'glbvase.json'), encoding='utf-8'))
t0 = time.time()


def log(*a):
    print('%5.1fs' % (time.time() - t0), *a, flush=True)


# ---------------------------------------------------------------- maps and elements
def load(view):
    g = lambda k: np.load(os.path.join(OUT, 'glb_%s_%s.npy' % (view, k)))
    M = dict(normal=g('normal'), mask=g('mask'), pos=g('pos'), albedo=g('albedo'), depth=g('depth'))
    M['cam'] = json.load(open(os.path.join(OUT, 'glb_%s_cam.json' % view)))['cam']
    return M


def body_profile(M):
    """radius of the turned body by height (model units): a low percentile per height band, so the relief is left out"""
    pos, m = M['pos'], M['mask']
    r = np.hypot(pos[..., 0], pos[..., 2]); h = pos[..., 1]
    NB = 400; hb = np.clip((h * NB).astype(int), 0, NB - 1)
    prof = np.zeros(NB)
    for i in range(NB):
        s = m & (hb == i)
        if s.sum() > 20:
            prof[i] = np.percentile(r[s], CFG.get('body_pct', 25))
    idx = np.where(prof > 0)[0]
    prof = np.interp(np.arange(NB), idx, prof[idx])
    return cv2.GaussianBlur(prof.reshape(-1, 1).astype(np.float32), (0, 0), 3).ravel(), NB


def elements(M, prof, NB):
    pos, m = M['pos'], M['mask']
    r = np.hypot(pos[..., 0], pos[..., 2]); h = pos[..., 1]
    hb = np.clip((h * NB).astype(int), 0, NB - 1)
    rel = np.where(m, r - prof[hb], 0)
    # the model's body is not perfectly round: its slow deviations (wider than a fish) are measured around the decor and taken
    # off, so the relief is measured against the local surface
    kk_ = M.get('k', 1.0); sig = CFG['relief'].get('body_sigma', 40) * kk_
    for _ in range(2):
        clear = m & (rel > CFG['relief']['strong'])
        clear = cv2.dilate(clear.astype(np.uint8), np.ones((int(CFG['relief'].get('keepout', 28) * kk_) | 1,) * 2, np.uint8)).astype(bool)
        bodyish = m & ~clear & (h < CFG['lip_h'])
        num = cv2.GaussianBlur(np.where(bodyish, rel, 0).astype(np.float32), (0, 0), sig)
        den = cv2.GaussianBlur(bodyish.astype(np.float32), (0, 0), sig)
        rel = np.where(m, rel - np.where(den > .05, num / np.maximum(den, 1e-6), 0), 0)
    E = {}
    lab = mesure.to_lab(np.clip(M['albedo'][..., ::-1] * 255, 0, 255).astype(np.uint8))
    k = M.get('k', 1.0)
    # the inside of the mouth: points well inside the body's radius at their height, near the top
    # the inside of the mouth: points of the neck on its far side (seen through the opening), for a model whose neck is a
    # single open wall; and points well inside the body's radius (a model with a thick wall)
    W_, H_ = m.shape[1], m.shape[0]
    mv, _ = glbkit.view_matrices(M['cam'], W_, H_)
    R = mv[:3, :3] / np.linalg.norm(mv[:3, :3], axis=0)
    zv = (np.dstack([pos[..., 0], np.zeros_like(h), pos[..., 2]]) @ R.T)[..., 2]
    E['inside'] = m & (h > CFG['lip_h'] - .02) & (zv < -CFG.get('far', .01)) | m & (rel < -CFG.get('wall', .02)) & (h > .6)
    # the lip: everything above the shoulder's top
    E['lip'] = m & ~E['inside'] & (h >= CFG['lip_h'])
    # the relief decor. Three clues, then a watershed snaps the border onto the relief's own steps:
    #  - clearly raised (relief above the turned body);
    #  - gold in the model's texture;
    #  - gold in the photograph, carried onto the model through its texture coordinates (a mask only, never a colour).
    rd = CFG['relief']
    gold_tex = eval(CFG['decor_tex_rule'], {'L': lab[..., 0], 'a': lab[..., 1], 'b': lab[..., 2], 'np': np})
    gold_ph = photo_gold_on(M)                                    # 1 gold, 0 not, .5 unknown (not seen in the photograph)
    base_ = m & ~E['lip'] & ~E['inside'] & (h < CFG['relief'].get('hmax', 1.0))   # the decor stays under the shoulder
    kk = max(1, int(round(k)))
    er = lambda x, n_: cv2.erode(x.astype(np.uint8), np.ones((2 * n_ * kk + 1,) * 2, np.uint8)).astype(bool)
    if rd.get('clues', 'relief') == 'relief':
        # the relief alone: clearly raised = fish, clearly flat = ground; the watershed decides in between, on the relief's steps
        fish = base_ & (rel > rd['strong'])
        near = cv2.distanceTransform((~fish).astype(np.uint8), cv2.DIST_L2, 5) < rd.get('seed_gap', 8) * k
        ground = base_ & er(base_ & (rel < rd['flat']), 2) & ~fish & ~near
    else:
        fish = base_ & ((rel > rd['strong']) & (gold_ph >= .5) | er(gold_tex & (gold_ph > .5), 2))
        ground = base_ & er(base_ & ((gold_ph < .49) | (gold_ph <= .5) & (rel < rd['weak'])), 2) & ~fish
    from skimage.segmentation import watershed
    gr = cv2.GaussianBlur(rel.astype(np.float32), (0, 0), .8 * k)
    gm = np.hypot(cv2.Sobel(gr, cv2.CV_32F, 1, 0), cv2.Sobel(gr, cv2.CV_32F, 0, 1))
    markers = np.zeros(m.shape, np.int32); markers[ground] = 1; markers[fish] = 2
    ws = watershed(gm, markers, mask=base_)
    keep = (ws == 2)
    keep = cv2.morphologyEx(keep.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2 * kk + 1,) * 2, np.uint8)).astype(bool)
    n_, lb, st, _ = cv2.connectedComponentsWithStats(keep.astype(np.uint8))
    keep2 = np.zeros_like(keep)
    for i in range(1, n_):
        if st[i, cv2.CC_STAT_AREA] >= rd.get('min_px', 60) * k * k:
            keep2 |= lb == i
    keep = keep2
    # fins, tails, the belly's soft edge: low relief connected to the fish belongs to the fish (hysteresis growth)
    # (geodesic: grown step by step, only within a fin's reach of the fish, so the body's own bumps never join)
    fin = base_ & (rel > rd.get('fin', .003))
    stepk = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(rd.get('fin_reach', 6) * k / 3) * 2 + 1,) * 2)
    for _ in range(3):
        keep = keep | (fin & cv2.dilate(keep.astype(np.uint8), stepk).astype(bool))
    # pockets of ground enclosed by the decor (or nearly: closed over a gap of a few pixels) that still stand above the body
    # are part of the decor (two fish overlapping, a fish's belly): filled, and reported on a check map
    big = int(rd.get('close', 6) * k) | 1
    closed = cv2.morphologyEx(keep.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (big, big))).astype(bool)
    pockets = ~keep & base_
    npk, lp, sp, _ = cv2.connectedComponentsWithStats(pockets.astype(np.uint8))
    filled = np.zeros_like(keep)
    for i in range(1, npk):
        comp = lp == i
        enclosed = (comp & closed).sum() > .6 * comp.sum()
        ring = cv2.dilate(comp.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & ~comp
        border_decor = keep[ring].mean() if ring.any() else 0
        raised = np.median(rel[comp]) > rd['flat'] * .5
        if (enclosed or border_decor > .85) and (raised or border_decor > .97) and sp[i, cv2.CC_STAT_AREA] < rd.get('pocket_px', 4000) * k * k:
            filled |= comp
    keep |= filled
    cv2.imwrite(os.path.join(OUT, 'glbvase_%s_pockets.png' % VIEW), np.where(filled, 0, np.where(keep, 150, 255)).astype(np.uint8))
    keep = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.2 * k) > .5          # smooth borders, no jagged steps
    E['decor'] = keep & m & ~E['lip'] & ~E['inside']
    # the decor cut out on the model's own unrolled geometry (unwrap.py + samdecor.py), read back through each pixel's position
    up = os.path.join(OUT, 'unwrap_decor.png')
    if rd.get('source') == 'unwrap' and os.path.exists(up):
        ud = cv2.imread(up, 0)
        UH, UW = ud.shape
        th = np.arctan2(pos[..., 2], pos[..., 0])
        ux = ((th / np.pi + 1) / 2 * UW - .5).astype(np.float32) % UW
        uy = ((1 - h) * UH - .5).astype(np.float32)
        dv = cv2.remap(ud.astype(np.float32), ux, uy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP) > 127
        E['decor'] = dv & m & ~E['lip'] & ~E['inside']
    E['body'] = m & ~E['decor'] & ~E['lip'] & ~E['inside']
    return E, rel


def photo_gold_on(M):
    """the photograph's gold mask (out/gold_photo.png, measured on the photograph) baked into the model's texture space from the
    photo view, then read back in the current view: 1 gold, 0 not gold, .5 where the photograph does not see the surface"""
    T = 1024
    uvp = np.load(os.path.join(OUT, 'glb_photo_uv.npy')); mp = np.load(os.path.join(OUT, 'glb_photo_mask.npy'))
    gp = cv2.imread(os.path.join(OUT, 'gold_photo.png'), 0) > 127
    sel = mp
    u = np.clip((uvp[..., 0][sel] * T).astype(int), 0, T - 1); v = np.clip((uvp[..., 1][sel] * T).astype(int), 0, T - 1)
    acc = np.zeros((T, T)); w = np.zeros((T, T))
    np.add.at(acc, (v, u), gp[sel].astype(float)); np.add.at(w, (v, u), 1)
    g = np.where(w > 0, acc / np.maximum(w, 1), .5).astype(np.float32)
    uv = np.load(os.path.join(OUT, 'glb_%s_uv.npy' % VIEW))
    return cv2.remap(g, (uv[..., 0] * T - .5).astype(np.float32), (uv[..., 1] * T - .5).astype(np.float32), cv2.INTER_NEAREST, borderValue=.5)


def body_normals(M, prof, NB):
    """normals of the perfect turned body (outward), in the screen frame of the view"""
    pos = M['pos']; r = np.maximum(np.hypot(pos[..., 0], pos[..., 2]), 1e-6); h = pos[..., 1]
    dr = np.gradient(prof) * NB                                    # dr/dh
    hb = np.clip((h * NB).astype(int), 0, NB - 1)
    nm = np.dstack([pos[..., 0] / r, -dr[hb], pos[..., 2] / r])
    nm /= np.linalg.norm(nm, axis=2, keepdims=True)
    W, H = M['mask'].shape[1], M['mask'].shape[0]
    mv, _ = glbkit.view_matrices(M['cam'], W, H)
    R = mv[:3, :3] / np.linalg.norm(mv[:3, :3], axis=0)
    nv = nm @ R.T
    return (nv * np.array([1, -1, 1])).astype(np.float32)


# ---------------------------------------------------------------- light
def studio(n, rough):
    """the studio mirrored by a surface of normal n (screen frame, eye along +z): softbox up left, window strip right,
    bright ceiling, dark floor; rough widens and dims the reflections"""
    v = np.array([0, 0, 1.0])
    rr = 2 * (n @ v)[..., None] * n - v
    lights = CFG.get('studio', [[-.55, -.62, .56, 1.0, .82], [.82, -.18, .55, .55, .9], [0, -1, .15, .35, .4]])
    s = np.zeros(n.shape[:2])
    for x, y, z, inten, cosw in lights:
        d = np.array([x, y, z]) / np.linalg.norm([x, y, z])
        c = rr @ d
        w = max(.02, (1 - cosw) * (1 + 3 * rough))
        s += inten * np.clip((c - (1 - w)) / w, 0, 1) ** (1.5 + 2 * (1 - rough))
    s *= 1 - .7 * np.clip(rr[..., 1], 0, 1)                         # the dark floor below
    return s


def cast_shadow(M, rel, k):
    """shadow of the relief on the surface under it: the relief height (above the turned body) is marched toward the light
    as a height field, so the body's own roundness never shadows itself"""
    L = svgkit.L3
    m = M['mask']
    z = np.where(m, np.maximum(rel, 0) * M['ppu'], 0).astype(np.float32)   # relief height, in pixels
    lxy = np.array([L[0], L[1]]); ln = np.linalg.norm(lxy); step = lxy / ln
    rise = L[2] / ln
    H, W = m.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sh = np.zeros((H, W), np.float32)
    maxd = int(CFG.get('shadow_px', 14) * k)
    for t in range(1, maxd + 1, max(1, int(k / 2))):
        sx, sy = (xx + step[0] * t).astype(np.float32), (yy + step[1] * t).astype(np.float32)
        zt = cv2.remap(z, sx, sy, cv2.INTER_LINEAR, borderValue=0)
        occ = zt - (z + rise * t)
        sh = np.maximum(sh, np.clip(occ / (1.0 * k), 0, 1) * (1 - t / (maxd + 1)) ** .5)
    return cv2.GaussianBlur(sh, (0, 0), .8 * k) * m


def cavity(M, k):
    d = M['depth']; m = M['mask']
    de, _ = svgkit.extend(d.astype(np.float32), m, int(6 * k))
    c = np.zeros_like(d)
    for s, w in ((1.0, .6), (3.0, .4)):
        c += w * np.clip((de - cv2.GaussianBlur(de, (0, 0), s * k)) * M['ppu'] / (1.2 * s * k), 0, 1)
    return c * m


def light(M, E, rel, prof, NB):
    k = M['k']
    nb = body_normals(M, prof, NB)
    n = M['normal'].copy()
    n[E['body'] | E['lip']] = nb[E['body'] | E['lip']]             # the body and lip: the perfect turned surface
    n /= np.linalg.norm(n, axis=2, keepdims=True) + 1e-9
    L = svgkit.L3
    wrap = CFG.get('wrap', .25)
    diff = np.clip(((n @ L) + wrap) / (1 + wrap), 0, 1)
    sky = .5 + .5 * np.clip(-n[..., 1], -1, 1)
    cav = cavity(M, k)
    sh = cast_shadow(M, rel, k)
    sh[E['decor']] *= .35                                          # the fish mostly shadow the ground, a little each other
    out = {}
    for name, mat in CFG['materials'].items():
        sel = E[mat['element']] if mat['element'] in E else np.zeros_like(E['body'])
        D = mat['amb'] * (sky * .6 + .4) + mat['diff'] * diff * (1 - mat.get('shk', .85) * sh)
        D *= 1 - mat.get('cav', .6) * cav
        if sel.any():
            D = D / np.median(D[sel])                              # 1 = the material's typical light: its albedo is its typical colour
        S = mat['spec'] * studio(n, mat['rough']) * (1 - .8 * cav) * (1 - .6 * sh)
        out[name] = (sel, D, S)
    return out, n, cav, sh


# ---------------------------------------------------------------- materials (palettes measured on the photograph)
def albedo(M, E, name, mat):
    H, W = M['mask'].shape
    h = M['pos'][..., 1]
    stops = mat['albedo']                                          # [[height, "#rrggbb"], ...] measured
    hs = np.array([s[0] for s in stops]); cs = np.array([[int(s[1][i:i + 2], 16) for i in (1, 3, 5)] for s in stops], float)
    col = np.stack([np.interp(h, hs, cs[:, j]) for j in range(3)], -1)
    return col


def compose(M, E, L_):
    H, W = M['mask'].shape
    img = np.full((H, W, 3), 255.0)
    for name, mat in CFG['materials'].items():
        sel, D, S = L_[name]
        if not sel.any():
            continue
        alb = albedo(M, E, name, mat)
        st = np.array([int(mat['spec_col'][i:i + 2], 16) for i in (1, 3, 5)], float)
        c = alb * D[..., None] + st * S[..., None] * (alb / 255 if mat.get('metal') else 1)
        img[sel] = c[sel]
    return np.clip(img, 0, 255)


# ---------------------------------------------------------------- SVG
def svg_layers(M, E, L_, mapf, q, k):
    defs = ['<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', .45)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', .7))]
    layers = {'body': [], 'mouth': []}
    step = F('step', 1.6) * k
    nlay = 0
    for name, mat in CFG['materials'].items():
        sel, D, S = L_[name]
        if sel.sum() < 30:
            continue
        zone = 'mouth' if mat['element'] == 'inside' else 'body'
        grow = max(1, int(round(.6 * k)))
        selg = cv2.dilate(sel.astype(np.uint8), np.ones((2 * grow + 1,) * 2, np.uint8)).astype(bool) & M['mask']
        svgkit.RDP_EPS = F('rdp', .35); svgkit.AREA_MIN = F('amin', 1.5) * k * k
        clip = svgkit.contour_paths(cv2.GaussianBlur(selg.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
        cid = 'k_' + name
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, clip))
        alb = albedo(M, E, name, mat)
        Dmax = np.percentile(D[sel], 99.5)
        g = []
        # base: the albedo at full light; a vertical gradient when it changes with height
        ys = np.where(sel.any(1))[0]
        stops = []
        for yy in np.linspace(ys.min(), ys.max(), 9):
            row = sel[int(yy)]
            c = np.median(alb[int(yy)][row], 0) * Dmax if row.any() else None
            if c is not None:
                stops.append((yy, c))
        gid = 'g_' + name
        x0, y0 = mapf(0, stops[0][0]); x1, y1 = mapf(0, stops[-1][0])
        defs.append('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="0" y1="%s" x2="0" y2="%s">%s</linearGradient>' % (
            gid, svgkit.fmt(y0), svgkit.fmt(y1),
            ''.join('<stop offset="%s" stop-color="%s"/>' % (svgkit.fmt((yy - stops[0][0]) / max(1, stops[-1][0] - stops[0][0])), svgkit.hexc(np.clip(c, 0, 255)))
                    for yy, c in stops)))
        g.append('<path fill="url(#%s)" d="%s"/>' % (gid, clip))
        # shade: product of nested dark layers of opacity a each, so that (1-a)^n follows D / Dmax
        a = F('sh_a', .1) * mat.get('sh_ak', 1)
        ratio = np.clip(D / Dmax, .02, 1)
        nl = np.log(ratio) / np.log(1 - a)                         # number of layers each pixel needs
        nle, _ = svgkit.extend(nl.astype(np.float32), sel, int(3 * k))
        f = np.where(selg, nle, 0).astype(np.float32)
        paths = []
        for lev in np.arange(.5, min(f[sel].max(), 40) + .01, 1.0):
            d = svgkit.contour_paths(f, float(lev), step, q, mapf, 1.0)
            if d:
                paths.append(d)
        sc = mat.get('shadow_col', '#1a0d05')
        g.append('<g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>' % (sc, svgkit.fmt(a), ''.join('<path d="%s"/>' % p for p in paths)))
        nlay += len(paths)
        # highlights: nested light layers of opacity b: c + (1-c)(1-(1-b)^n) follows the specular
        b = F('hl_b', .12)
        alb_mid = np.median(alb[sel], 0) * np.median(D[sel])
        st = np.array([int(mat['spec_col'][i:i + 2], 16) for i in (1, 3, 5)], float)
        Sv = S * (np.median(alb[sel], 0).mean() / 255 if mat.get('metal') else 1) * st.mean() / 255
        frac = np.clip(Sv * 255 / np.maximum(255 - alb_mid.mean(), 1), 0, .995)
        nh = np.log(1 - frac) / np.log(1 - b)
        nhe, _ = svgkit.extend(nh.astype(np.float32), sel, int(3 * k))
        f = np.where(selg, nhe, 0).astype(np.float32)
        paths = []
        for lev in np.arange(.5, min(f[sel].max(), 30) + .01, 1.0):
            d = svgkit.contour_paths(f, float(lev), step, q, mapf, 1.0)
            if d:
                paths.append(d)
        g.append('<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (mat['spec_col'], svgkit.fmt(b), ''.join('<path d="%s"/>' % p for p in paths)))
        nlay += len(paths)
        layers[zone].append('<g clip-path="url(#%s)">%s</g>' % (cid, ''.join(g)))
    return defs, layers, nlay


def photo_gold_mask(M, prof, NB):
    """the gold of the photograph, isolated with the model's help: clearly raised points (seen from the photograph's camera)
    seed the gold, flat points far from any relief seed the patina, and GrabCut learns both materials on the photograph
    (highlights and dark heads included)"""
    pos, m = M['pos'], M['mask']
    r = np.hypot(pos[..., 0], pos[..., 2]); h = pos[..., 1]
    hb = np.clip((h * NB).astype(int), 0, NB - 1)
    rel = np.where(m, r - prof[hb], 0)
    sig = CFG['relief'].get('body_sigma', 40) * M['k'] * .5
    for _ in range(2):
        clear = cv2.dilate((m & (rel > CFG['relief']['strong'])).astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
        bodyish = m & ~clear & (h < CFG['lip_h'])
        num = cv2.GaussianBlur(np.where(bodyish, rel, 0).astype(np.float32), (0, 0), sig)
        den = cv2.GaussianBlur(bodyish.astype(np.float32), (0, 0), sig)
        rel = np.where(m, rel - np.where(den > .05, num / np.maximum(den, 1e-6), 0), 0)
    ph = cv2.imread(os.path.join(OUT, 'ref.jpg'))
    body = m & (h < CFG['lip_h'])
    strong = body & (rel > CFG['relief']['strong'] * 1.3)
    strong = cv2.erode(strong.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    dist = cv2.distanceTransform((~(body & (rel > CFG['relief']['weak']))).astype(np.uint8), cv2.DIST_L2, 5)
    flat = body & (dist > 12) & (np.abs(rel) < CFG['relief']['weak'])
    gc = np.full(m.shape, cv2.GC_BGD, np.uint8)
    gc[body] = cv2.GC_PR_BGD
    gc[body & (rel > CFG['relief']['weak'])] = cv2.GC_PR_FGD
    gc[strong] = cv2.GC_FGD; gc[flat] = cv2.GC_BGD
    bgm, fgm = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(ph, gc, None, bgm, fgm, 5, cv2.GC_INIT_WITH_MASK)
    g = ((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)) & body
    g = cv2.morphologyEx(g.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    cv2.imwrite(os.path.join(OUT, 'gold_photo.png'), (g * 255).astype(np.uint8))
    v = ph.copy(); v[g] = (v[g] * .4 + np.array([0, 255, 255]) * .6).astype(np.uint8); v[strong] = (0, 0, 255); v[flat] = (255, 120, 0)
    cv2.imwrite(os.path.join(HERE, '_apercu', 'gold_photo_check.jpg'), v)
    log('photo gold: %d px (seeds gold %d, patina %d)' % (g.sum(), strong.sum(), flat.sum()))


def measure_palettes(M, E, L_):
    """albedo of each material, measured on the photograph: its colour divided by the computed light, by height band, on the
    element's own pixels away from highlights, cast shadows and borders; written back into <vase>/glbvase.json"""
    ph = cv2.imread(os.path.join(OUT, 'ref.jpg'))[..., ::-1].astype(np.float64)
    pm = mesure.silhouette(ph[..., ::-1].astype(np.uint8))
    h = M['pos'][..., 1]
    cfgp = os.path.join(HERE, VASE, 'glbvase.json')
    cfg = json.load(open(cfgp, encoding='utf-8'))
    for name, mat in CFG['materials'].items():
        sel, D, S = L_[name]
        sel = cv2.erode((sel & pm).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & (S < .08) & (D > .5) & (D < 1.6) & (h > mat.get('hmin', 0))
        if sel.sum() < 200:
            log('palette %s: too few pixels (%d), kept' % (name, sel.sum())); continue
        alb = ph / np.maximum(D, .05)[..., None]
        hs = h[sel]; lo, hi = np.percentile(hs, [2, 98])
        nb = int(mat.get('stops', 6)) if hi - lo > .1 else 1
        stops = []
        for i in range(nb):
            a_, b_ = lo + (hi - lo) * i / nb, lo + (hi - lo) * (i + 1) / nb
            s2 = sel & (h >= a_) & (h <= b_)
            if s2.sum() < 50:
                continue
            c = np.clip(np.median(alb[s2], 0), 0, 255)
            stops.append([round(float((a_ + b_) / 2), 3), svgkit.hexc(c)])
        if nb == 1:
            stops = [[0, stops[0][1]], [1, stops[0][1]]]
        cfg['materials'][name]['albedo'] = stops
        log('palette %-9s %s' % (name, ' '.join('%.2f:%s' % (a, c) for a, c in stops)))
    json.dump(cfg, open(cfgp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def svg_bands(M, E, L_, img, mapf, q, k):
    """per element (one material each, so its colours form a single ramp and bands never mix hues): nested tone bands of the
    computed colour, clipped to the element, softened by a small blur; the body is cut in height slices for its gradient"""
    defs = ['<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', .35)),
            '<filter id="db" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('dblur', .18))]
    layers = {'body': [], 'mouth': []}
    h = M['pos'][..., 1]
    nb = 0
    sil = svgkit.contour_paths(cv2.GaussianBlur(M['mask'].astype(np.float32), (0, 0), .7), .5, 1.5 * k, q, mapf, 1.0)
    for name, mat in CFG['materials'].items():
        sel, D, S = L_[name]
        if sel.sum() < 30:
            continue
        zone = 'mouth' if mat['element'] == 'inside' else 'body'
        fine = mat['element'] == 'decor'
        step = F('dstep' if fine else 'step', .9 if fine else 1.8) * k
        dy = F('ddy' if fine else 'dy', 3.5 if fine else 3.0)
        ns = int(mat.get('slices', 1))
        hs = np.percentile(h[sel], np.linspace(0, 100, ns + 1)) if ns > 1 else [-1, 2]
        for s in range(ns):
            part = sel & (h >= hs[s] - 1e-6) & (h <= hs[s + 1] + 1e-6)
            if part.sum() < 30:
                continue
            grow = 0 if fine else max(1, int(round(.8 * k)))         # the decor is never grown: no halo around the fish
            pg = cv2.dilate(part.astype(np.uint8), np.ones((2 * grow + 1,) * 2, np.uint8)).astype(bool) & M['mask'] if grow else part
            svgkit.RDP_EPS = F('rdp', .25 if fine else .4); svgkit.AREA_MIN = F('amin', .8 if fine else 2.0) * k * k
            clip = svgkit.contour_paths(cv2.GaussianBlur(pg.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
            if not clip:
                continue
            cid = 'k%d' % nb
            defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, clip))
            bb = svgkit.bands(img, pg, mapf, q, step, dy=dy)
            nb += 1
            if not bb:
                continue
            flt = 'db' if fine else 'sb'
            layers[zone].append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#%s)">%s</g></g>' % (
                cid, bb[0][0], clip, flt, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
    base = '<path fill="%s" d="%s"/>' % (svgkit.hexc(np.median(img[E['body']], 0)), sil)
    layers['body'].insert(0, base)
    return defs, layers, nb


def main():
    M = load(VIEW)
    H, W = M['mask'].shape
    hcm = CFG['hcm']
    if VIEW == 'shop':
        k = H / ((hcm + 2) * svgkit.UPC)                            # pixels per shop unit
        ys = np.where(M['mask'].any(1))[0]; yfoot = ys.max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
        q = F('q', .05)
        M['ppu'] = hcm * svgkit.UPC * k                             # pixels per model unit (the model is 1 high)
    else:
        k = 1.0
        mapf = lambda x, y: (x, y)
        q = F('q', .1)
        M['ppu'] = M['cam']['fpx'] / M['cam']['dist']
    M['k'] = k
    prof, NB = body_profile(M)
    if VIEW == 'photo' and F('goldmask', 0) > 0:
        return photo_gold_mask(M, prof, NB)
    E, rel = elements(M, prof, NB)
    log('elements', {kk: int(v.sum()) for kk, v in E.items()})
    L_, n, cav, sh = light(M, E, rel, prof, NB)
    if VIEW == 'photo' and F('measure', 0) > 0:
        return measure_palettes(M, E, L_)
    img = compose(M, E, L_)
    cv2.imwrite(os.path.join(OUT, 'glbvase_%s_field.png' % VIEW), img[..., ::-1].astype(np.uint8))
    # a view of the elements, for checking the isolation
    ev = np.full((H, W, 3), 255, np.uint8)
    for kk, c in (('body', (60, 110, 170)), ('decor', (90, 200, 230)), ('lip', (40, 60, 120)), ('inside', (30, 30, 30))):
        ev[E[kk]] = c
    cv2.imwrite(os.path.join(OUT, 'glbvase_%s_elements.png' % VIEW), ev)
    cv2.imwrite(os.path.join(OUT, 'glbvase_%s_shadow.png' % VIEW), (255 - sh * 255).astype(np.uint8))
    cv2.imwrite(os.path.join(OUT, 'glbvase_%s_cavity.png' % VIEW), (255 - np.clip(cav, 0, 1) * 255).astype(np.uint8))
    log('field')
    if F('svg', 1) <= 0:
        return
    defs, layers, nl = (svg_bands(M, E, L_, img, mapf, q, k) if OPT.get('mode', 'bands') == 'bands' else svg_layers(M, E, L_, mapf, q, k))
    if VIEW == 'shop':
        x0, y0 = mapf(0, 0); x1, y1 = mapf(W, H); vb = '%g %g %g %g' % (x0, y0, x1 - x0, y1 - y0)
    else:
        vb = '0 0 %d %d' % (W, H)
    body, mouth = ''.join(layers['body']), ''.join(layers['mouth'])
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (vb, ''.join(defs), mouth, body)
    open(os.path.join(OUT, 'glbvase_%s.svg' % VIEW), 'w').write(svg)
    log('svg %d layers, %.0f Ko' % (nl, len(svg) / 1024))
    if VIEW == 'shop':
        import gzip
        d = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), body, mouth=mouth)
        js = json.dumps(d, separators=(',', ':')).encode()
        log('body.json %.0f Ko, gzip %.1f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))
        # the catalogue entry: the turned body's profile and the neck's radius, in shop units
        U = hcm * svgkit.UPC
        prof, NB = body_profile(M)
        top = max(i for i in range(NB) if prof[i] > 0)
        pr = [[round(i / NB * U, 1), round(float(prof[min(i, top)]) * U, 1)] for i in range(0, top + 1, 10)] + [[round(U, 1), round(float(prof[top]) * U, 1)]]
        neck = float(prof[int(CFG['lip_h'] * NB):top].min())
        fiche = dict(CFG['fiche'], prof=pr, h=round(U, 1), mo=round(neck * U * .92, 1))
        json.dump(fiche, open(os.path.join(OUT, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        log('fiche', fiche['id'], 'h', fiche['h'], 'mo', fiche['mo'])


if __name__ == '__main__':
    main()
