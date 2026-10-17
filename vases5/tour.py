# The turned vessels of the engine (VZ0 entries drawn from a measured profile) remade at the level of the yellow prism and the
# glass dancers (owner, vase review, 2026-10-17): the vessel is modelled from its profile (outer wall, rounded or wavy lip, inner
# wall and floor, beads in relief), lit per pixel in the shop's studio (diffuse light with occlusion, Fresnel reflections of the
# studio blurred by the material's roughness, metal tinting its reflections, glass letting the scene through), and only curves
# leave: tone bands per part, softened and clipped to the part, a fine grain of SVG noise on the matte bodies. What stands behind
# the stems (the inside, the far half of the lip) is the vessel's mouth layer; the rest is its body, drawn over them.
#   python tour.py <vessel id> [key=value ...]   ->  tours/<id>/out/body.json, fiche.json, field.png
#   python build_engine.py tours/<id>            ->  into the engine (SVGB entry, fiche with svgb)
import sys, os, json, math, time
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import svgkit as K  # noqa: E402

VID = sys.argv[1]
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
OUT = os.path.join(HERE, 'tours', VID, 'out')
CFG = os.path.join(HERE, 'tours', VID, 'tour.json')
if os.path.exists(CFG):                          # the vessel's own settings, overridden by the command line
    OPT = dict(json.load(open(CFG, encoding='utf-8')), **OPT)
F = lambda k, d: float(OPT.get(k, d))
T0 = time.time()
log = lambda *a: print('[%5.1fs]' % (time.time() - T0), *a, flush=True)

VX, FL = 500.0, 990.0                            # the engine's vessel axis and floor (app/v1a.js)
RY = .16                                         # the eye ~9 degrees above: a circle r is an ellipse r x .16 r (engine vRy)
SA = RY; CA = math.sqrt(1 - SA * SA)
EYE = np.array([0, SA, CA])                      # towards the eye, world frame (x right, y up, z towards the viewer)
UPC = 6.5                                        # engine units per cm


def fiche_of(vid):
    """the vessel's entry of VZ0 (app/v0.js), as the engine has it before any scale"""
    t = open(os.path.join(HERE, '..', 'app', 'v0.js'), encoding='utf-8').read()
    a = t.index('const VZ0=') + len('const VZ0=')
    b = t.index('\n', a)
    arr = json.loads(t[a:b].rstrip().rstrip(';'))
    for v in arr:
        if v['id'] == vid:
            return v
    raise SystemExit('unknown vessel ' + vid)


def hexrgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def srgb2lin(c):
    return np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)


# ---------------------------------------------------------------- materials: (diffuse share, roughness, F0, metal)
MATS = {
    'gloss':  dict(rough=.012, f0=.05, metal=0, coat=1, grain=0, expo=.95, diff=.82),
    'satin':  dict(rough=.32, f0=.04, metal=0, coat=.6, grain=.5),
    'matte':  dict(rough=.6, f0=.035, metal=0, coat=.3, grain=.22, mot=0, psmooth=.03),
    'stone':  dict(rough=.45, f0=.04, metal=0, coat=.5, grain=.6),
    'metal':  dict(rough=.05, f0=1, metal=1, coat=0, grain=0, brush=0),
    'glass':  dict(rough=.03, f0=.04, metal=0, coat=1, grain=0),
}
FINS = {'polished': dict(rough=.04), 'brushed': dict(rough=.22, aniso=1), 'patina': dict(rough=.07, pats=.15),
        'frosted': dict(rough=.5), 'onyx': dict(rough=.12)}


def material(v):
    m = dict(MATS.get(v.get('mat', 'matte'), MATS['matte']))
    m.update(FINS.get(v.get('fin', ''), {}))
    for k in ('expo', 'diff', 'keyr', 'amb', 'mot', 'psmooth', 'brush', 'pats'):                        # the material's own light, unless the command line says
        if k in m and k not in OPT:
            OPT[k] = str(m[k])
    for k in ('rough', 'f0', 'coat', 'grain'):
        if k in OPT:
            m[k] = F(k, m[k])
    return m


# ---------------------------------------------------------------- the profile and the surfaces of revolution
def profile(v, n=900):
    """the measured profile (height, radius) resampled evenly along its length, smoothed a little (the measures are a polyline)"""
    P = np.array(v['prof'], float)
    # a centripetal Catmull-Rom curve through the measured points (continuous tangent, no overshoot), dense, then evened
    # out along its length; a light smoothing takes off what is left of the measuring hand
    Q = np.r_[[2 * P[0] - P[1]], P, [2 * P[-1] - P[-2]]]
    dense = []
    for i in range(1, len(Q) - 2):
        p0, p1, p2, p3 = Q[i - 1], Q[i], Q[i + 1], Q[i + 2]
        t0 = 0.0; t1 = t0 + max(np.linalg.norm(p1 - p0), 1e-6) ** .5
        t2 = t1 + max(np.linalg.norm(p2 - p1), 1e-6) ** .5; t3 = t2 + max(np.linalg.norm(p3 - p2), 1e-6) ** .5
        for t in np.linspace(t1, t2, 24, endpoint=False):
            A1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            A2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            A3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            B1 = (t2 - t) / (t2 - t0) * A1 + (t - t0) / (t2 - t0) * A2
            B2 = (t3 - t) / (t3 - t1) * A2 + (t - t1) / (t3 - t1) * A3
            dense.append((t2 - t) / (t2 - t1) * B1 + (t - t1) / (t2 - t1) * B2)
    dense.append(P[-1])
    D = np.array(dense)
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(D, axis=0).T))]
    s = np.linspace(0, seg[-1], n)
    h = np.interp(s, seg, D[:, 0]); r = np.interp(s, seg, D[:, 1])
    k = max(1, int(n * F('psmooth', .004)))
    ker = np.ones(2 * k + 1) / (2 * k + 1)
    pad = lambda a: np.r_[np.full(k, a[0]), a, np.full(k, a[-1])]
    h = np.convolve(pad(h), ker, 'valid'); r = np.convolve(pad(r), ker, 'valid')
    return h, np.maximum(r, .3)


def revolve(h, r, nphi, normal_sign=1.0, phi0=0.0, phi1=2 * math.pi):
    """points and normals of the surface turned from the curve (h, r): normal_sign 1 faces outwards, -1 inwards"""
    dh = np.gradient(h); dr = np.gradient(r)
    L = np.maximum(np.hypot(dh, dr), 1e-9)
    nr, ny = dh / L * normal_sign, -dr / L * normal_sign            # outward normal of the curve in the (radial, up) plane
    phi = np.linspace(phi0, phi1, nphi, endpoint=False)
    cp, sp = np.cos(phi), np.sin(phi)
    X = r[:, None] * cp[None]; Z = r[:, None] * sp[None]; Y = np.repeat(h[:, None], nphi, 1)
    NX = nr[:, None] * cp[None]; NZ = nr[:, None] * sp[None]; NY = np.repeat(ny[:, None], nphi, 1)
    PHI = np.repeat(phi[None], len(h), 0)
    return np.stack([X, Y, Z], -1).reshape(-1, 3), np.stack([NX, NY, NZ], -1).reshape(-1, 3), PHI.ravel()


def sphere(c, rad, n=40):
    """a bead: points and normals of a small sphere centred on c"""
    u = np.linspace(0, math.pi, n)[:, None]; w = np.linspace(0, 2 * math.pi, 2 * n, endpoint=False)[None]
    N = np.stack([np.sin(u) * np.cos(w), np.cos(u) + 0 * w, np.sin(u) * np.sin(w)], -1).reshape(-1, 3)
    return c + rad * N, N


# ---------------------------------------------------------------- the model, part by part (labels of the field)
OUTER, LIP, INNER, FLOOR, BEAD, PIN = 0, 1, 2, 3, 4, 5
SCULPTED = False
NAMES = ['outer', 'lip', 'inner', 'floor', 'bead', 'pin']


def relief_of(v):
    tp = v.get('tp') or {}
    return v.get('shape') == 'box' or any(k in tp for k in ('facets', 'lobes', 'dimples', 'squarefoot'))


def radius_mod(v, H, PHI, R):
    """the outer wall's radius round the vessel: a polygonal section (tp.facets), lobes between two heights (tp.lobes), a grid
    of carved hollows (tp.dimples); heights of tp in cm"""
    tp = v.get('tp') or {}
    out = R.copy()
    nf = tp.get('facets') or (4 if v.get('shape') == 'box' else None)
    if nf:
        # flat faces: the radius of a regular polygon inscribed in the turned circle, its corners on the circle (a box turned
        # a little on its axis, yaw in degrees, so two of its faces are seen)
        k = 2 * math.pi / int(nf)
        a = (PHI + k / 2 + math.radians(F('yaw', 22 if v.get('shape') == 'box' else 0))) % k - k / 2
        out = out * math.cos(k / 2) / np.cos(a)
    lb = tp.get('lobes')
    if lb:
        y0, y1 = float(lb.get('y0', 0)) * UPC, float(lb.get('y1', 99)) * UPC
        band = ss(y0, y0 + 4, H) * ss(y1, y1 - 4, H)
        dep = float(lb.get('d', .5)) * UPC * F('lobek', .5)
        out = out - dep * band * (1 - np.abs(np.cos(int(lb.get('n', 8)) * PHI / 2))) ** 1.5
    sq = tp.get('squarefoot')
    if sq and F('sqk', 1.08) > 0:
        # a square foot under the turned body: its section a square up to sq cm, blended into the round above
        a = (PHI + math.pi / 4) % (math.pi / 2) - math.pi / 4
        t = ss(float(sq) * UPC + 3, float(sq) * UPC - 1, H)
        out = out * (1 - t) + out * t * math.cos(math.pi / 4) / np.cos(a) * F('sqk', 1.08)
    dm = tp.get('dimples')
    if dm:
        na, nr = int(dm.get('around', 24)), int(dm.get('rows', 20))
        top = H.max()
        u = (PHI * na / (2 * math.pi)) % 1 - .5
        w = (H / max(top, 1) * nr + .5 * (np.floor(PHI * na / (2 * math.pi)) % 2)) % 1 - .5      # rows offset, as a carver's
        hollow = np.clip(1 - (u * u + w * w) / .2, 0, 1) ** 1.5
        out = out - F('dimk', 1.1) * hollow * ss(4, 12, H) * ss(top, top - 8, H)
    return out


def sculpt(v, h, r, nphi, sign=1.0):
    """the outer wall turned and then carved: points from the modulated radius, normals from the surface's own tangents"""
    phi = np.linspace(0, 2 * math.pi, nphi, endpoint=False)
    H = np.repeat(h[:, None], nphi, 1); PHI = np.repeat(phi[None], len(h), 0)
    R = radius_mod(v, H, PHI, np.repeat(r[:, None], nphi, 1))
    P = np.stack([R * np.cos(PHI), H, R * np.sin(PHI)], -1)
    du = np.gradient(P, axis=1); dv = np.gradient(P, axis=0)
    N = np.cross(du, dv)
    N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-9)
    radial = np.stack([np.cos(PHI), np.zeros_like(PHI), np.sin(PHI)], -1)
    N = np.where((((N * radial).sum(-1) * sign) < 0)[..., None], -N, N)     # outwards (inwards for an inner wall)
    return P.reshape(-1, 3), N.reshape(-1, 3)


def kenzan_model(v, RES):
    """a kenzan: the leaded base turned from the lower part of the profile (up to its step), and the field of brass needles
    standing on it, one per hole of a square grid inside the base (tp.kz.rows across)"""
    P0 = np.array(v['prof'], float)
    step = next((i for i in range(1, len(P0)) if P0[i][1] < P0[i - 1][1] - .25 and P0[i][0] > 3), len(P0) - 1)
    hb = float(P0[step][0])
    v2 = dict(v); v2['prof'] = [list(q) for q in P0[:step + 1]] + [[hb + .01, 1.0]]
    h, r = profile(v2, n=600)
    nphi = int(F('ns', 1.7) * RES * 2 * math.pi * float(r.max()))
    parts = []
    P, N, PHI = revolve(h, r, nphi); parts.append((OUTER, P, N, PHI))
    rr = np.linspace(0, float(np.interp(hb - .01, h, r)), 40)
    P, N, PHI = revolve(np.full_like(rr, hb), rr, nphi); N[:] = (0, 1, 0); parts.append((LIP, P, N, PHI))
    kz = (v.get('tp') or {}).get('kz', {})
    rows = int(int(kz.get('rows', 9)) * F('kzk', 1)); rf = float(v.get('mo', r.max())) * .92; H = float(v['h'])
    sp = 2 * rf / rows; pr = F('pinr', .55)
    ww = np.linspace(0, 2 * math.pi, max(10, int(RES * pr * 7)), endpoint=False)
    zz = np.linspace(hb, H, max(8, int((H - hb) * RES * 1.2)))
    for i in range(rows + 1):
        for j in range(rows + 1):
            x, z = -rf + i * sp + (sp / 2 if j % 2 else 0), -rf + j * sp
            if x * x + z * z > rf * rf:
                continue
            X = x + pr * np.cos(ww)[None]; Z = z + pr * np.sin(ww)[None]
            Pn = np.stack([np.repeat(X, len(zz), 0), np.repeat(zz[:, None], len(ww), 1), np.repeat(Z, len(zz), 0)], -1).reshape(-1, 3)
            Nn = np.stack([np.repeat(np.cos(ww)[None], len(zz), 0), np.zeros((len(zz), len(ww))), np.repeat(np.sin(ww)[None], len(zz), 0)], -1).reshape(-1, 3)
            parts.append((PIN, Pn, Nn, np.full(len(Pn), math.atan2(z, x))))
            Pt, Nt = sphere(np.array([x, H, z]), pr * 1.05, 6); parts.append((PIN, Pt, Nt, np.zeros(len(Pt))))
    return parts, dict(h=h, r=r, htop=H, w=1.0, fh=hb, rt=float(r.max()))


def outline_field(v, RES):
    """a vessel drawn from its measured outline (a basin on feet, a head, a heart): the outline inflated row by row, each
    interval of a row a rounded section as deep as its width allows (the vessel's depth ol.d at its widest), so lobes, feet
    and profiles come with the outline; the opening on the measured mouth (mx, mh, mry), its inside behind the stems and its
    rim in front"""
    ol = v['ol']; Pp = np.array(ol['pts'], float); H = float(v['h']); D = float(ol.get('d', H))
    tp = v.get('tp') or {}
    x0, x1 = VX + Pp[:, 0].min() - 4, VX + Pp[:, 0].max() + 4
    mo_t = (float(ol['mouth'][1]) - float(ol['mouth'][0])) / 2
    y0, y1 = FL - float(v.get('mh', H)) - (float(v['mry']) if v.get('mry') else mo_t * RY) - 8, FL + 4
    W, Hh = int(math.ceil((x1 - x0) * RES)), int(math.ceil((y1 - y0) * RES))
    poly = np.c_[(VX + Pp[:, 0] - x0) * RES, (FL - Pp[:, 1] - y0) * RES]
    m8 = np.zeros((Hh, W), np.uint8)
    cv2.fillPoly(m8, [np.round(poly * 4).astype(np.int32)], 1, lineType=cv2.LINE_8, shift=2)
    m = m8.astype(bool)
    # the far half of the rim, seen from a little above, stands over the measured outline: the mouth's ellipse joins the shape
    mx0, mh0 = float(v.get('mx', 0)), float(v.get('mh', H))
    mo0 = (float(ol['mouth'][1]) - float(ol['mouth'][0])) / 2
    mry0 = float(v['mry']) if v.get('mry') else mo0 * RY
    gxs = x0 + (np.arange(W) + .5) / RES - VX; gys = FL - (y0 + (np.arange(Hh) + .5) / RES)
    EX, EY = np.meshgrid((gxs - mx0) / max(mo0, 1), (gys - mh0) / max(mry0, 1))
    m = m | ((EX * EX + EY * EY) <= 1)
    amax = float((Pp[:, 0].max() - Pp[:, 0].min()) / 2)
    bk = (D / 2) / max(amax, 1)
    Z = np.zeros((Hh, W), np.float32); CX = np.zeros((Hh, W), np.float32); A = np.ones((Hh, W), np.float32)
    nexp = F('sexp', 2.0)
    for yy in range(Hh):
        row = m[yy]
        if not row.any():
            continue
        d = np.diff(np.r_[0, row.astype(np.int8), 0])
        st, en = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]
        for a_, b_ in zip(st, en):
            cxp = (a_ + b_ - 1) / 2; ap = max((b_ - a_) / 2, .5)
            u = np.clip((np.arange(a_, b_) - cxp) / ap, -1, 1)
            Z[yy, a_:b_] = ap / RES * bk * (1 - np.abs(u) ** nexp) ** (1 / nexp)
            CX[yy, a_:b_] = x0 + (cxp + .5) / RES - VX; A[yy, a_:b_] = ap / RES
    lb = tp.get('lobes')
    Xw = x0 + (np.arange(W) + .5) / RES - VX
    Yw = FL - (y0 + (np.arange(Hh) + .5) / RES)
    XX, YY = np.meshgrid(Xw, Yw)
    if lb:
        # lobes round the body between two heights (the section's radius pinched n times round)
        y0l, y1l = float(lb.get('y0', 0)) * UPC, float(lb.get('y1', 99)) * UPC
        band = ss(y0l, y0l + 4, YY) * ss(y1l, y1l - 4, YY)
        ph = np.arccos(np.clip((XX - CX) / np.maximum(A, 1e-3), -1, 1))
        Z = Z * (1 - F('lobek', .5) * float(lb.get('d', .5)) * UPC / max(amax, 1) * 6 * band * (1 - np.abs(np.cos(int(lb.get('n', 8)) * ph / 2))) ** 1.5)
    Z = cv2.GaussianBlur(Z, (0, 0), F('zsm', 1.2) * RES / 4) * m
    gy, gx = np.gradient(Z * RES)                                       # per unit
    N = np.dstack([-gx, gy, np.ones_like(Z)])                            # screen y down = world y up
    N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-6)
    lab = np.where(m, OUTER, -1).astype(np.int8)
    P = np.dstack([XX, YY, Z]).astype(np.float32)
    phi = (math.pi / 2 - np.arcsin(np.clip((XX - CX) / np.maximum(A, 1e-3), -1, 1))).astype(np.float32)
    # the opening: its inside (behind the stems) and its rim
    mx_, mh_ = float(v.get('mx', 0)), float(v.get('mh', H))
    m0, m1 = [float(t) for t in ol['mouth'][:2]]
    mo_ = (m1 - m0) / 2; mry = max(2.5, float(v.get('mry', mo_ * RY)) if v.get('mry') else mo_ * RY)
    w = max(1.5, float(v.get('lipw', 3)))
    ex = (XX - mx_) / max(mo_, 1); ey = (YY - mh_) / max(mry, 1)
    rr = np.sqrt(ex * ex + ey * ey)
    rim = (rr <= 1) & (rr > 1 - w / max(mo_, 1) * 1.6)
    hole = rr <= 1 - w / max(mo_, 1) * 1.6
    lab[rim] = LIP; N[rim] = (0, 1, 0)
    N[rim] = np.dstack([ex * .35, np.ones_like(ex), -ey * .35])[rim]
    N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-6)
    lab[hole] = INNER
    deep = np.clip(ey, -1, 1) * .5 + .5                                    # the far wall lit, the near side in shadow
    P[..., 1] = np.where(hole, mh_ - (1 - deep) * mo_ * .6, P[..., 1])
    P[..., 0] = np.where(hole, XX * .3, P[..., 0]); P[..., 2] = np.where(hole, 0, P[..., 2])
    N[hole] = np.dstack([-ex * .4, np.full_like(ex, .2), np.ones_like(ex)])[hole]
    N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-6)
    fld = dict(lab=lab, N=N.astype(np.float32), P=P, phi=phi, x0=x0, y0=y0, W=W, H=Hh)
    hs = np.linspace(0, H, 400)
    r_eq = np.array([max(1, float(A[min(Hh - 1, max(0, int((FL - h - y0) * RES)))].max())) for h in hs])
    return fld, dict(h=hs, r=r_eq, htop=mh_, w=w, fh=max(2, mh_ - mo_ * .6), rt=mo_)


def ol_spans(P, h):
    """the horizontal intervals of the closed outline P at height h, left to right"""
    xs = []
    for (x0, y0), (x1, y1) in zip(P, np.roll(P, -1, 0)):
        if (y0 - h) * (y1 - h) < 0 or (y0 == h and y1 != h):
            xs.append(x0 + (x1 - x0) * (h - y0) / (y1 - y0))
    xs.sort()
    return [(xs[i], xs[i + 1]) for i in range(0, len(xs) - 1, 2)]


def superell(cx, a, b, n, phi):
    """points and outward directions of a superellipse section (exponent n: 2 an ellipse, larger a rounded rectangle)"""
    c, s = np.cos(phi), np.sin(phi)
    e = 2.0 / n
    X = cx + a * np.sign(c) * np.abs(c) ** e
    Z = b * np.sign(s) * np.abs(s) ** e
    return X, Z


def grid_surface(H, X, Z, centre, sign=1.0):
    """a surface given on a (height x angle) grid: points, and normals from its tangents, turned outwards (or inwards)"""
    P = np.stack([X, H, Z], -1)
    du = np.gradient(P, axis=1); dv = np.gradient(P, axis=0)
    N = np.cross(du, dv)
    N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-9)
    rad = np.stack([X - centre, np.zeros_like(X), Z], -1)
    N = np.where((((N * rad).sum(-1) * sign) < 0)[..., None], -N, N)
    return P.reshape(-1, 3), N.reshape(-1, 3)


def outline_model(v, RES):
    """a vessel drawn from its measured outline (shape outline: a basin on feet, a head, a heart): at each height a superellipse
    section as wide as the outline there and as deep as the vessel (ol.d, in proportion to the width), the feet modelled apart
    where the outline splits near the floor, the opening on the measured mouth with its rim and its inside"""
    ol = v['ol']; P = np.array(ol['pts'], float); H = float(v['h']); D = float(ol.get('d', H))
    tp = v.get('tp') or {}
    nexp = F('sexp', 3.2 if (v.get('fam') == 'sculpture' and D > H) else 2.0)
    hs = np.linspace(0, H, max(200, int(H * RES * 1.4)))
    spans = [ol_spans(P, h) for h in hs]
    single = np.array([len(s) == 1 for s in spans])
    hb = float(hs[np.argmax(single)]) if single.any() else 0.0          # where the body stands on its feet
    keep = single & (hs >= hb)
    hk = hs[keep]; sp = np.array([spans[i][0] for i in np.nonzero(keep)[0]])
    cx = (sp[:, 0] + sp[:, 1]) / 2; a = (sp[:, 1] - sp[:, 0]) / 2
    amax = float(a.max()); b = a * (D / 2) / amax
    nphi = int(F('ns', 1.7) * RES * 2 * math.pi * amax * .8)
    phi = np.linspace(0, 2 * math.pi, nphi, endpoint=False)
    PH = np.repeat(phi[None], len(hk), 0); HH = np.repeat(hk[:, None], nphi, 1)
    lb = tp.get('lobes'); fac = np.ones_like(PH)
    if lb:
        y0, y1 = float(lb.get('y0', 0)) * UPC, float(lb.get('y1', 99)) * UPC
        band = ss(y0, y0 + 4, HH) * ss(y1, y1 - 4, HH)
        fac = 1 - float(lb.get('d', .5)) * UPC * F('lobek', .5) / amax * band * (1 - np.abs(np.cos(int(lb.get('n', 8)) * PH / 2))) ** 1.5
    X, Z = superell(cx[:, None], a[:, None] * fac, b[:, None] * fac, nexp, PH)
    parts = []
    Pg, Ng = grid_surface(HH, X, Z, cx[:, None])
    parts.append((OUTER, Pg, Ng, PH.ravel()))
    # the opening: the mouth's span at its height, its rim, its inside down to a floor
    m0, m1, my = [float(t) for t in ol['mouth']]
    w = max(1.5, float(v.get('lipw', 3)))
    mcx, ma = (m0 + m1) / 2, (m1 - m0) / 2
    mb = ma * (D / 2) / amax
    lphi = phi[None]
    bb = np.linspace(0, math.pi, max(16, int(RES * w * 2)))[:, None]
    ra, rb_ = ma - w / 2 + w / 2 * np.cos(bb), mb - w / 2 * (mb / ma) + w / 2 * (mb / ma) * np.cos(bb)
    LH = np.repeat((my - w / 2 + w / 2 * np.sin(bb)), nphi, 1)
    LX, LZ = superell(mcx, ra, rb_, nexp, np.repeat(lphi, len(bb), 0))
    Pl, Nl = grid_surface(LH, LX, LZ, mcx)
    parts.append((LIP, Pl, Nl, np.repeat(lphi, len(bb), 0).ravel()))
    fl = max(hb + 2, my - F('ideep', .8) * (my - hb))
    ih = np.linspace(fl, my - w / 2, max(20, int((my - fl) * RES)))[:, None]
    IX, IZ = superell(mcx, np.full_like(ih, ma - w), np.full_like(ih, mb - w * mb / ma), nexp, np.repeat(lphi, len(ih), 0))
    Pi, Ni = grid_surface(np.repeat(ih, nphi, 1), IX, IZ, mcx, sign=-1)
    parts.append((INNER, Pi, Ni, np.repeat(lphi, len(ih), 0).ravel()))
    fr_ = np.linspace(0, 1, 30)[:, None]
    FX, FZ = superell(mcx, (ma - w) * fr_, (mb - w * mb / ma) * fr_, nexp, np.repeat(lphi, 30, 0))
    Pf = np.stack([FX, np.full_like(FX, fl), FZ], -1).reshape(-1, 3); Nf = np.tile([0, 1., 0], (len(Pf), 1))
    parts.append((FLOOR, Pf, Nf, np.repeat(lphi, 30, 0).ravel()))
    # the feet: where the outline splits below the body, each interval a small rounded block, front and back
    lows = [(h, s) for h, s in zip(hs, spans) if h < hb and len(s) > 1]
    if lows:
        h_ = np.array([q[0] for q in lows])
        for (f0, f1) in lows[len(lows) // 2][1]:
            fcx, fa = (f0 + f1) / 2, (f1 - f0) / 2
            if fa < 1:
                continue
            for zc in ((-1, 1) if abs(fcx) > amax * .25 else (0,)):
                zc_ = zc * (D / 2) * math.sqrt(max(0, 1 - (fcx / amax) ** 2)) * .8
                fh_ = np.linspace(0, hb + 1, max(8, int(hb * RES)))[:, None]
                fphi = np.linspace(0, 2 * math.pi, 48, endpoint=False)[None]
                FX2, FZ2 = superell(fcx, np.full_like(fh_, fa), np.full_like(fh_, fa * .7), 3, np.repeat(fphi, len(fh_), 0))
                Pft, Nft = grid_surface(np.repeat(fh_, 48, 1), FX2, FZ2 + zc_, fcx)
                parts.append((BEAD, Pft, Nft, np.repeat(fphi, len(fh_), 0).ravel()))
    r_eq = np.interp(np.linspace(0, H, 400), hk, a)
    return parts, dict(h=np.linspace(0, H, 400), r=r_eq, htop=my, w=w, fh=fl, rt=ma)


def model(v, RES):
    global SCULPTED
    if v.get('shape') == 'outline':
        SCULPTED = True
        return outline_model(v, RES)
    if v.get('shape') == 'box' and not v.get('_sq'):
        # a box's profile gives its half width: the turned radius reaching the corners is larger
        v['prof'] = [[q[0], q[1] / math.cos(math.radians(45))] for q in v['prof']]; v['_sq'] = 1
    if v.get('kind') == 'kenzan' and (v.get('tp') or {}).get('kz'):
        return kenzan_model(v, RES)
    h, r = profile(v, n=max(600, int(F('ns', 1.7) * RES * np.hypot(*np.diff(np.array(v['prof'], float), axis=0).T).sum())))
    rings = (v.get('tp') or {}).get('rings')
    if rings:
        # the throwing rings of a wheel-thrown body, all the way up (tp.rings: step in cm), soft ridges
        stp = float(rings.get('step', 1.7)) * UPC
        amp = F('ringa', .28) * float(rings.get('ridge', 3)) / 3
        ph = 2 * math.pi * h / stp
        r = r + amp * np.sin(ph) * ss(2, 10, h) * ss(0, 8, h.max() - h)
    htop = float(h.max())
    w = max(.8, float(v.get('lipw', 2.5)) * F('lipk', 1.0))           # the wall's thickness at the lip
    nphi = int(F('ns', 1.7) * RES * 2 * math.pi * float(r.max()))
    parts = []
    keep = h <= htop - w / 2
    P, N, PHI = revolve(h[keep], r[keep], nphi)
    SCULPTED = relief_of(v)
    if SCULPTED:
        P, N = sculpt(v, h[keep], r[keep], nphi)
    parts.append((OUTER, P, N, PHI))
    # the lip: a half round joining the outer wall to the inner one
    rt = float(np.interp(htop - w / 2, h, r))
    box = v.get('shape') == 'box'
    b = np.linspace(0, math.pi, max(24, int(RES * w * 2.5)))
    lh, lr = htop - w / 2 + w / 2 * np.sin(b), rt - w / 2 + w / 2 * np.cos(b)
    P, N, PHI = revolve(lh, lr, nphi)
    if box:
        P, N = sculpt(v, lh, lr, nphi)
    parts.append((LIP, P, N, PHI))
    # the inner wall, the outer one offset by the wall's thickness, down to the floor of the inside
    fh = F('floor', max(3.0, htop * .05))
    ki = (h >= fh) & (h <= htop - w / 2)
    ri = np.maximum(r[ki] - w, .5)
    P, N, PHI = revolve(h[ki], ri, nphi, normal_sign=-1)
    if box:
        P, N = sculpt(v, h[ki], ri, nphi, sign=-1)
    parts.append((INNER, P, N, PHI))
    rf = float(np.interp(fh, h, r)) * (math.cos(math.radians(45)) if box else 1) - w      # inside a box: within its flats
    if rf > 1:
        rr = np.linspace(0, rf, max(8, int(RES * rf * 1.7)))
        P, N, PHI = revolve(np.full_like(rr, fh), rr, nphi)
        N[:] = (0, 1, 0)
        parts.append((FLOOR, P, N, PHI))
    # beads in relief (tp.beadrow: at the lip or at a height in cm, radius in cm, count around)
    for row in (v.get('tp') or {}).get('beadrow', []):
        rb = float(row['r']) * UPC
        hb = htop - rb * 1.2 if row['h'] == 'lip' else float(row['h']) * UPC
        rc = float(np.interp(hb, h, r)) + rb * .3
        for i in range(int(row['n'])):
            a = 2 * math.pi * i / int(row['n'])
            c = np.array([rc * math.cos(a), hb, rc * math.sin(a)])
            P, N = sphere(c, rb, max(10, int(RES * rb * 3)))
            parts.append((BEAD, P, N, np.full(len(P), a)))
    hd = v.get('hd')
    if hd:
        # handles (hd: count, attached between y0 and y1, reaching out, thickness; scroll: a curl at the top), each a tube swept
        # along its curve in the vessel's own plane
        y0h, y1h = float(hd['y0']), float(hd['y1']); outh = float(hd['out']) * F('hdout', 1); th = float(hd.get('th', 5)) / 2 * F('hdk', 1)
        rise = F('hdrise', 0) * UPC
        r0h, r1h = float(np.interp(y0h, h, r)), float(np.interp(y1h, h, r))
        Pc = np.array([[r1h - th * .3, y1h], [r1h + outh * .9, y1h + th * .6 + rise], [r1h + outh * 1.05, (y0h + y1h) / 2 + rise * .3], [r0h + outh * .2, y0h + 2], [r0h - th * .3, y0h]])
        tt = np.linspace(0, 1, 120)
        def bz(Q, t):
            n = len(Q) - 1
            return sum(math.comb(n, i) * ((1 - t) ** (n - i))[:, None] * (t ** i)[:, None] * Q[i] for i in range(n + 1))
        C = bz(Pc, tt)
        if hd.get('sh') == 'scroll':
            # the scroll's curl: a knob where the handle leaves the lip
            kc = C[6]
            kx, ky = kc[0] * math.cos(0), kc[1]
            for j in range(int(hd.get('n', 2))):
                az = math.pi * j
                P_, N_ = sphere(np.array([kx * math.cos(az), ky + th * .3, kx * math.sin(az)]), th * 1.35, max(14, int(RES * th * 3)))
                parts.append((BEAD, P_, N_, np.full(len(P_), az)))
        T = np.gradient(C, axis=0); T /= np.maximum(np.linalg.norm(T, axis=1, keepdims=True), 1e-9)
        Nn = np.c_[-T[:, 1], T[:, 0]]
        wring = np.linspace(0, 2 * math.pi, max(16, int(RES * th * 4)), endpoint=False)
        for j in range(int(hd.get('n', 2))):
            az = math.pi * j                                         # left and right
            ca, sa = math.cos(az), math.sin(az)
            ring = []; nr_ = []
            for (x_, y_), (nx_, ny_) in zip(C, Nn):
                for ww in wring:
                    o = np.array([nx_ * math.cos(ww), ny_ * math.cos(ww), math.sin(ww)])   # (radial, up, tangential)
                    pr = np.array([x_ + th * o[0], y_ + th * o[1], th * o[2]])
                    ring.append([pr[0] * ca - pr[2] * sa, pr[1], pr[0] * sa + pr[2] * ca]); nr_.append([o[0] * ca - o[2] * sa, o[1], o[0] * sa + o[2] * ca])
            parts.append((BEAD, np.array(ring), np.array(nr_), np.full(len(ring), az)))
    bc = (v.get('tp') or {}).get('beadcol')
    if bc:
        y0b, y1b = float(bc['y0']) * UPC, float(bc['y1']) * UPC
        ncol = int((v.get('tp') or {}).get('facets') or 8); nb = int(bc.get('n', 5))
        rb = F('beadr', .14) * UPC
        for j in range(ncol):
            a = 2 * math.pi * (j + .5) / ncol
            for i in range(nb):
                hb = y0b + (y1b - y0b) * (i + .5) / nb
                rc = float(np.interp(hb, h, r)) * math.cos(math.pi / ncol) + rb * .6
                c = np.array([rc * math.cos(a), hb, rc * math.sin(a)])
                P, N = sphere(c, rb, max(10, int(RES * rb * 3)))
                parts.append((BEAD, P, N, np.full(len(P), a)))
    # a wavy lip (tp.wave: n waves around, amplitude in cm): the top of the vessel rises and falls round it
    wave = (v.get('tp') or {}).get('wave')
    if wave or v.get('lip') == 'wavy':
        n_, a_ = int((wave or {}).get('n', 6)), float((wave or {}).get('a', .3)) * UPC
        out = []
        for lab, P, N, PHI in parts:
            t = np.clip((P[:, 1] - (htop - F('wavez', 12))) / F('wavez', 12), 0, 1)
            P = P.copy(); P[:, 1] += a_ * np.cos(n_ * PHI) * t * t * (3 - 2 * t)
            out.append((lab, P, N, PHI))
        parts = out
    return parts, dict(h=h, r=r, htop=htop, w=w, fh=fh, rt=rt)


def project(P):
    """shop view: screen x, y (engine units) and depth towards the eye"""
    return VX + P[:, 0], FL - P[:, 1] + P[:, 2] * RY, P[:, 1] * SA + P[:, 2] * CA


def rasterise(parts, RES):
    """every part splatted into one field, the nearest surface winning each pixel: label, normal, position, angle round"""
    allx, ally = [], []
    for _, P, _, _ in parts:
        sx, sy, _ = project(P); allx += [sx.min(), sx.max()]; ally += [sy.min(), sy.max()]
    x0, x1 = min(allx) - 4, max(allx) + 4; y0, y1 = min(ally) - 4, max(ally) + 4
    W, H = int(math.ceil((x1 - x0) * RES)), int(math.ceil((y1 - y0) * RES))
    depth = np.full(H * W, -1e9, np.float32)
    lab = np.full(H * W, -1, np.int8); Nf = np.zeros((H * W, 3), np.float32); Pf = np.zeros((H * W, 3), np.float32)
    phif = np.zeros(H * W, np.float32)
    for l, P, N, PHI in parts:
        if l in (OUTER, LIP, BEAD, PIN) and not (l == OUTER and SCULPTED):
            f = (N @ EYE) > -.02                                        # the far side of a convex part is never seen
            P, N, PHI = P[f], N[f], PHI[f]
        sx, sy, dz = project(P)
        ix = ((sx - x0) * RES).astype(np.int32); iy = ((sy - y0) * RES).astype(np.int32)
        ok = (ix >= 0) & (ix < W) & (iy >= 0) & (iy < H)
        k = iy[ok] * W + ix[ok]; dz = dz[ok]
        o = np.argsort(dz, kind='stable')
        k, dz = k[o], dz[o]
        better = dz > depth[k]
        k2 = k[better]; sel = np.nonzero(ok)[0][o][better]
        depth[k2] = dz[better]; lab[k2] = l; Nf[k2] = N[sel]; Pf[k2] = P[sel]; phif[k2] = PHI[sel]
    lab = lab.reshape(H, W); Nf = Nf.reshape(H, W, 3); Pf = Pf.reshape(H, W, 3); phif = phif.reshape(H, W)
    # pinholes left by the splatting: closed from their neighbours (never across the outline)
    m = lab >= 0
    mc = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool)
    holes = mc & ~m
    if holes.any():
        for _ in range(3):
            src = lab >= 0
            if not (holes & ~src).any():
                break
            d = cv2.dilate(np.where(src, lab + 1, 0).astype(np.uint8), np.ones((3, 3), np.uint8))
            fill = holes & ~src & (d > 0)
            for arr in (Nf, Pf):
                for c in range(3):
                    a = arr[..., c]; a[fill] = cv2.blur(np.where(src, a, 0), (3, 3))[fill] / np.maximum(cv2.blur(src.astype(np.float32), (3, 3))[fill], 1e-6)
            phif[fill] = cv2.blur(np.where(src, phif, 0), (3, 3))[fill] / np.maximum(cv2.blur(src.astype(np.float32), (3, 3))[fill], 1e-6)
            lab[fill] = (d[fill] - 1).astype(np.int8)
    Nf /= np.maximum(np.linalg.norm(Nf, axis=-1, keepdims=True), 1e-6)
    return dict(lab=lab, N=Nf, P=Pf, phi=phif, x0=x0, y0=y0, W=W, H=H)


# ---------------------------------------------------------------- the shop's studio (world frame), as the prism mirrors it
def to_world(s):
    """a direction of the screen frame (x right, y down, z towards the eye) in the world frame"""
    x, y, z = s
    return np.array([x, -y * CA + z * SA, y * SA + z * CA])


LW = to_world(K.L3); LW /= np.linalg.norm(LW)                       # the shop's single light, upper left in front
STRIP = np.array([.86, .22, -.46]); STRIP /= np.linalg.norm(STRIP)   # a tall strip behind on the right: the rim light
ss = lambda a, b, v: np.clip((v - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((v - a) / (b - a), 0, 1))


def box(d, ax, w, h, e, up=np.array([0, 1., 0])):
    """a rectangular soft box seen in direction d: centred on ax, half width w and half height h (tangents of the angles),
    its edges softened over e: the clean shape a studio light leaves in a glaze or a metal"""
    rt = np.cross(up, ax); rt /= max(np.linalg.norm(rt), 1e-6)
    upv = np.cross(ax, rt)
    f = d @ ax
    u = (d @ rt) / np.maximum(f, 1e-3); v = (d @ upv) / np.maximum(f, 1e-3)
    grade = (1 - F('boxu', .3) * np.clip(u / w, -1, 1) ** 2) * (1 - F('boxv', .35) * (.5 - .5 * np.clip(v / h, -1, 1)))
    return (f > 0) * ss(-w - e, -w + e, -np.abs(u)) * ss(-h - e, -h + e, -np.abs(v)) * grade


def env(d):
    """radiance of the studio seen in direction d (linear, ~1 for the walls' white)"""
    x, y, z = d[..., 0], d[..., 1], d[..., 2]
    room = srgb2lin(np.array([243, 238, 231]) / 255.)                   # the page behind the vessels
    wall = room * F('wallk', .78) * (1 + .1 * x[..., None])
    ceil = room * 1.08
    floor = srgb2lin(np.array([150, 138, 124]) / 255.) * F('floork', .35)
    c = wall * (1 - ss(.15, .55, y)[..., None]) + ceil * ss(.15, .55, y)[..., None]
    hz = ss(-.0, -F('hzw', .025), y)[..., None]                    # the horizon: a sharp line where the wall meets the floor
    c = c * (1 - hz) + floor * hz
    c = c * (1 - .6 * ss(-.4, -.9, y)[..., None])
    # black flags on both sides: what defines a mirror or a glass is the dark it reflects
    fl = ss(.72, .86, np.abs(x)) * ss(-.55, -.2, -np.abs(y)) * ss(-.2, .2, -z)
    c = c * (1 - F('flag', .95) * fl[..., None])
    # the key light, a large soft box, and the rim strip
    c = c + F('keyi', 20) * box(d, LW, F('kw', .36), F('kh', .26), F('ke', .06))[..., None] * np.array([1, .985, .95])
    c = c + F('topi', 6) * box(d, np.array([0, 1., 0]), F('tw', .5), F('th', .32), F('te', .08), up=np.array([0, 0, 1.]))[..., None] * np.array([1, .99, .98])
    for az, k_ in ((F('pl_az', -38), F('pl_i', 13)), (F('pr_az', 50), F('pr_i', 6.5))):
        a_ = math.radians(az)
        hz_ = x * math.cos(a_) - z * math.sin(a_)                      # angle off the panel's vertical plane
        fz_ = x * math.sin(a_) + z * math.cos(a_)
        pan = ss(-F('pw', .085), -F('pw', .085) * .8, -np.abs(hz_)) * ss(-.78, -.72, -np.abs(y - .1)) * (fz_ > 0)
        pan = pan * (.62 + .38 * np.clip((y + .7) / 1.4, 0, 1)) * (1 - .35 * (np.abs(hz_) / F('pw', .085)) ** 2)
        c = c + k_ * pan[..., None] * np.array([1, .99, .97])
    card = np.array([-.62, -.25, .74]); card /= np.linalg.norm(card)
    c = c + F('cardi', 1.6) * box(d, card, .3, .22, .12)[..., None] * room
    sc = d @ STRIP
    strip = ss(math.cos(math.radians(14)), math.cos(math.radians(7)), sc) * ss(-.7, -.3, -np.abs(y - .1))
    c = c + F('stripi', 7) * strip[..., None] * np.array([.97, .98, 1])
    return c


def blurred_env(R, rough):
    """the studio reflected along R, blurred over a cone set by the roughness (a fixed set of directions)"""
    n = int(F('envn', 64))
    rng = np.random.default_rng(7)
    U = rng.normal(size=(n, 3)); U /= np.linalg.norm(U, axis=1, keepdims=True)
    acc = np.zeros(R.shape, np.float32)
    spread = np.clip(rough, .01, 1)[..., None] * F('spread', 1.15)
    for u in U:
        d = R + spread * u
        d /= np.maximum(np.linalg.norm(d, axis=-1, keepdims=True), 1e-6)
        acc += env(d)
    return acc / n


def noise2(u, v, freq, seed):
    """smooth value noise on (u, v) (angle round in turns, height in units), for patina spots and glaze pooling"""
    rng = np.random.default_rng(seed)
    G = rng.random((64, 64)).astype(np.float32)
    gu = (u * freq[0]) % 64; gv = (v * freq[1]) % 64
    i0, j0 = np.floor(gu).astype(int), np.floor(gv).astype(int)
    fu, fv = gu - i0, gv - j0
    fu, fv = fu * fu * (3 - 2 * fu), fv * fv * (3 - 2 * fv)
    a = G[i0 % 64, j0 % 64]; b = G[(i0 + 1) % 64, j0 % 64]; c = G[i0 % 64, (j0 + 1) % 64]; d = G[(i0 + 1) % 64, (j0 + 1) % 64]
    return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv


def shade_opaque(v, fld, geo, mat):
    lab, N, P, phi = fld['lab'], fld['N'], fld['P'], fld['phi']
    cl = (v.get('tp') or {}).get('cells')
    EDGE = None
    if cl:
        # a carved stone of flat facets: the surface's normal averaged over each facet (cells on the drawing), crisp edges
        Hh, W = lab.shape; RESf = 1
        n_ = int(cl.get('n', 24)) * 6
        rng = np.random.default_rng(3)
        m_ = lab == OUTER
        ys, xs = np.nonzero(m_)
        pick = rng.choice(len(ys), size=min(n_, len(ys)), replace=False)
        sites = np.c_[xs[pick], ys[pick]].astype(np.float32)
        gy, gx = np.mgrid[0:Hh, 0:W]
        best = np.full((Hh, W), 1e9, np.float32); second = best.copy(); cid = np.zeros((Hh, W), np.int32)
        for i, (sx, sy) in enumerate(sites):
            dd = (gx - sx) ** 2 + (gy - sy) ** 2
            nb = dd < best
            second = np.where(nb, best, np.minimum(second, dd)); cid = np.where(nb, i, cid); best = np.where(nb, dd, best)
        N = N.copy()
        for c in range(3):
            sm = np.bincount(cid[m_], weights=N[..., c][m_], minlength=len(sites))
            N[..., c] = np.where(m_, sm[cid], N[..., c])
        N /= np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-6)
        EDGE = (np.sqrt(second) - np.sqrt(best) < 1.6) & m_
        fld = dict(fld, N=N)
    m = lab >= 0
    base = srgb2lin(hexrgb(v.get('col', '#cccccc')))
    alb = np.broadcast_to(base, N.shape).copy()
    kz = (v.get('tp') or {}).get('kz')
    if kz:
        alb[(lab == OUTER) | (lab == LIP)] = srgb2lin(hexrgb(kz.get('base', '#9fa3a6')))
        alb[lab == PIN] = srgb2lin(hexrgb(kz.get('pin', '#c8b48a')))
    rough = np.full(lab.shape, mat['rough'], np.float32)
    metal = np.full(lab.shape, float(mat['metal']), np.float32)
    u = phi / (2 * math.pi); hh = P[..., 1]
    if v.get('fin') == 'patina' and v.get('col2'):
        # a tarnish: darker in the hollows of the profile and in soft spots, rougher where it lies
        c2 = srgb2lin(hexrgb(v['col2']))
        h, r = geo['h'], geo['r']
        curv = np.gradient(np.gradient(r, h), h)
        cav = np.interp(hh, h, np.clip(curv * F('patc', 6), 0, 1))
        spots = ss(.55, .8, noise2(u, hh / 12, (int((v.get('tp') or {}).get('patina', {}).get('n', 7)), 1), 3))
        pt = np.clip(F('pat', .55) * cav + F('pats', .6) * spots, 0, 1) * F('patk', 1)
        if mat['metal']:
            # a metal tarnishes darker (silver goes grey-brown, never gold): its mirror dims and blurs where the film lies
            alb = alb * (1 - F('tarn', .6) * pt[..., None]) + c2 * (.12 * pt)[..., None]
            rough = rough + (F('patr', .3) - rough) * pt
        else:
            alb = alb * (1 - pt[..., None]) + c2 * pt[..., None]
            rough = rough + (F('patr', .45) - rough) * pt
    if mat['metal'] == 0 and F('pool', .12) > 0:
        # a glaze pools a little darker low on the body and where the profile turns inwards
        alb = alb * (1 - F('pool', .12) * ss(.0, -1, (hh - geo['htop'] * .25) / max(geo['htop'] * .25, 1)))[..., None]
    if F('terre', 0) > 0:
        PH = phi % (2 * math.pi)
        tc = noise2(PH / (2 * math.pi), hh / 18, (4, 1), 81) * .6 + noise2(PH / (2 * math.pi), hh / 6, (12, 1), 82) * .4
        warm = srgb2lin(hexrgb('#c27a4e')); dark = srgb2lin(hexrgb('#7d4428')); pale = srgb2lin(hexrgb('#d9a07a'))
        t_ = np.clip((tc - .3) * 1.8, 0, 1)
        clay = dark * (1 - t_[..., None]) + warm * t_[..., None]
        clay = clay * (1 - .35 * ss(.62, .8, tc)[..., None]) + pale * (.35 * ss(.62, .8, tc))[..., None]
        on = ((lab == OUTER) | (lab == LIP))[..., None]
        alb = np.where(on, clay, alb)
    if mat['metal'] == 0 and F('mot', .05) > 0:
        # a fired surface is never one flat colour: a faint mottle round and up the body
        mo = noise2(u, hh / 7, (11, 1), 21) + .5 * noise2(u, hh / 2.5, (29, 1), 22)
        alb = alb * (1 + F('mot', .05) * (mo - .75) * 1.4)[..., None]
    if v.get('mat') in ('gloss', 'satin') and F('thick', .5) > 0:
        tz = np.clip(1 - hh / max(geo['htop'], 1), 0, 1)                   # low on the body the glaze has gathered
        face = np.clip(-N[..., 1], 0, 1)                                    # under an overhang it hangs thicker
        tk = np.clip(.35 + .55 * tz ** 1.5 + .3 * face, 0, 1)
        deep = alb * F('deepk', .55); thin_ = np.clip(alb * 1.45 + np.array([.02, .01, 0]), 0, 1)
        alb = thin_ * (1 - tk[..., None]) * F('thick', .5) + alb * (1 - F('thick', .5)) + deep * tk[..., None] * F('thick', .5)
    if v.get('mat') == 'gloss' and F('gbreak', .45) > 0:
        # the glaze runs thin on the lip and the sharp turns: the body shows lighter through it
        near = np.where(lab == LIP, 1.0, ss(geo['htop'] - F('gbz', 3), geo['htop'], hh))
        k = F('gbreak', .45) * near
        alb = alb * (1 - k[..., None]) + np.clip(alb * 1.5 + .02, 0, 1) * k[..., None]
    tp = v.get('tp') or {}
    PH = phi % (2 * math.pi)
    if EDGE is not None:
        alb[EDGE] = srgb2lin(hexrgb(cl.get('edge', '#9aa6b2')))
    vn = tp.get('veins')
    if vn:
        # onyx: veins running at an angle across the stone, warped, dark and light, some wide some thin
        a_ = math.radians(float(vn.get('a', -30)))
        t = (P[..., 0] * math.cos(a_) + P[..., 1] * math.sin(a_)) / UPC + 2.2 * noise2(P[..., 0] / 60, P[..., 1] / 60, (1, 1), 61)
        nv = int(vn.get('n', 16)); w0, w1 = [float(q) for q in vn.get('w', [1, 4])]
        rngv = np.random.default_rng(9); pos = np.sort(rngv.uniform(t[lab >= 0].min(), t[lab >= 0].max(), nv)); wd = rngv.uniform(w0, w1, nv) / UPC
        for k, (p_, w_) in enumerate(zip(pos, wd)):
            e = np.exp(-((t - p_) / max(w_, .05)) ** 2) * float(vn.get('o', .5)) * ((lab == OUTER) | (lab == LIP))
            c = srgb2lin(hexrgb(vn.get('c' if k % 3 else 'l', '#8a6a48')))
            alb = alb * (1 - e[..., None]) + c * e[..., None]
    if tp.get('paint'):
        # painted suiban: a teal band under the rim and small precious objects round the side, in the scholar's taste
        c2 = srgb2lin(hexrgb(v.get('col2') or '#5d8590'))
        top = float(v.get('mh', geo['htop']))
        band = (ss(top - 5, top - 4, hh) * ss(top - 1.5, top - 2.5, hh) + ss(top - 7.2, top - 6.6, hh) * ss(top - 5.6, top - 6.2, hh)) * (lab == OUTER)
        alb = alb * (1 - band[..., None]) + c2 * band[..., None]
        objs = np.zeros(lab.shape, np.float32)
        for k, cx_ in enumerate(np.linspace(-.6, .6, 4)):
            xc = cx_ * float(np.abs(P[..., 0][lab == OUTER]).max()); yc = top * .45
            if k % 2:
                objs = np.maximum(objs, ((np.abs(P[..., 0] - xc) < 6) & (np.abs(P[..., 1] - yc) < 4)).astype(np.float32))       # a book
            else:
                rr_ = np.hypot((P[..., 0] - xc) / 4.2, (P[..., 1] - yc + 1) / 5.2)
                objs = np.maximum(objs, (rr_ < 1).astype(np.float32))                                                       # a vase
                objs = np.maximum(objs, ((np.abs(P[..., 0] - xc) < 1.4) & (P[..., 1] > yc + 3) & (P[..., 1] < yc + 7.5)).astype(np.float32))
        objs = cv2.GaussianBlur(objs, (0, 0), .8) * (lab == OUTER)
        alb = alb * (1 - .85 * objs[..., None]) + c2 * (.85 * objs)[..., None]
    if F('celadon', 0) > 0:
        k_ = 2 * math.pi / int(tp.get('facets') or 8); a_ = np.abs((PH + k_ / 2) % k_ - k_ / 2) / (k_ / 2)
        pool = (1 - a_) ** 2 * .35 + .65 * ss(geo['htop'] * .5, 0, hh)
        alb = alb * (1 - F('celpool', .35) * pool[..., None]) + srgb2lin(hexrgb('#3f6f63')) * (F('celpool', .35) * pool)[..., None]
        cr = noise2(PH / (2 * math.pi), hh / 1.8, (40, 1), 71)
        crack = ss(.03, 0, np.abs(cr - .5)) * ((lab == OUTER) | (lab == LIP)) * F('crackk', .35)
        alb = alb * (1 - crack[..., None] * .5)
    if tp.get('facets') and tp.get('edges'):
        # the glaze runs thin on the facets' edges: a pale line along each
        k = 2 * math.pi / int(tp['facets']); a = np.abs((PH + k / 2) % k - k / 2)
        e = ss(F('edgew2', .06), 0, k / 2 - a) * (lab == OUTER)
        alb = alb * (1 - .8 * e[..., None]) + srgb2lin(hexrgb(tp['edges'])) * (.8 * e)[..., None]
    if tp.get('lobes') and tp.get('lines'):
        # a painted line down each hollow between two lobes
        n_ = int(tp['lobes'].get('n', 8)); a = np.abs(np.cos(n_ * PH / 2))
        wl = float(tp['lines'].get('w', .35)) * UPC / max(float(np.median(np.hypot(P[..., 0], P[..., 2])[lab == OUTER])), 1)
        e = ss(wl * n_ / 2, 0, a) * (lab == OUTER)
        ns_ = int(F('streaks', 0))
        if ns_:
            # thin white streaks run down the whole body between the lines, as glaze poured from the lip
            rngs = np.random.default_rng(13); ang = rngs.uniform(0, 2 * math.pi, ns_); wd = rngs.uniform(.004, .014, ns_)
            ln = rngs.uniform(.45, 1, ns_)
            for a0, w0, l0 in zip(ang, wd, ln):
                d_ = np.abs(np.angle(np.exp(1j * (PH - a0 - .03 * np.sin(hh / 9)))))
                e = np.maximum(e, ss(w0, 0, d_) * ss(geo['htop'] * (1 - l0), geo['htop'] * (1 - l0) + 6, hh) * (lab == OUTER) * .85)
        alb = alb * (1 - e[..., None]) + srgb2lin(hexrgb(tp['lines'].get('c', '#ffffff'))) * e[..., None]
    dr = tp.get('drips')
    if dr:
        # a white shino glaze dipped from the lip, its edge running in drips down to y0..y1 cm; the bare body toasted below
        cg = srgb2lin(hexrgb(dr.get('c', '#efe6dc')))
        rng = np.random.default_rng(7)
        nd = int(dr.get('n', 12))
        ang = np.sort(rng.uniform(0, 2 * math.pi, nd)); ln = rng.uniform(*[float(t) for t in dr.get('l', [.5, 1.5])], nd) * UPC
        ywid = rng.uniform(.06, .16, nd)
        edge = float(dr.get('y1', 2.2)) * UPC + 2 * noise2(PH / (2 * math.pi), hh * 0, (17, 1), 51) * UPC * .3
        for a_, l_, w_ in zip(ang, ln, ywid):
            d = np.angle(np.exp(1j * (PH - a_)))
            edge = np.minimum(edge, float(dr.get('y1', 2.2)) * UPC - l_ * np.clip(1 - (d / w_) ** 2, 0, 1) ** .6)
        gz = ss(edge - 1.2, edge + .6, hh) * ((lab == OUTER) | (lab == LIP))
        gz = np.where(np.isin(lab, (INNER, FLOOR)), 1.0, gz)
        alb = alb * (1 - gz[..., None]) + cg * gz[..., None]
    to = tp.get('toast')
    if to:
        t_ = ss(float(to.get('y0', 3)) * UPC, float(to.get('y0', 3)) * UPC * .4, hh) * (lab == OUTER)
        alb = alb * (1 - .7 * t_[..., None]) + srgb2lin(hexrgb(to['c'])) * (.7 * t_)[..., None]
    ce = tp.get('cells2')
    if ce:
        # reticulated enamel: the gold glaze crawled into small cells over the olive ground, dark rims, rust and olive cells
        rad = np.maximum(np.hypot(P[..., 0], P[..., 2]), 1)
        U = PH * float(np.median(rad[lab == OUTER])) if (lab == OUTER).any() else PH
        area = 2 * math.pi * float(np.median(rad[lab == OUTER])) * geo['htop']
        cs = math.sqrt(area / int(ce.get('n', 400) * F('cellk', 2.2)))
        rng = np.random.default_rng(11)
        gx = U / cs; gy = hh / cs
        ix, iy = np.floor(gx).astype(int), np.floor(gy).astype(int)
        J = rng.random((512, 512, 2))
        best = np.full(hh.shape, 9.0); second = np.full(hh.shape, 9.0); cid = np.zeros(hh.shape, int)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                cx = ix + dx; cy = iy + dy
                jx = J[cx % 512, cy % 512, 0]; jy = J[cx % 512, cy % 512, 1]
                d = np.hypot(gx - (cx + jx), gy - (cy + jy))
                nb = d < best
                second = np.where(nb, best, np.minimum(second, d)); cid = np.where(nb, (cx * 7919 + cy * 104729) % 97, cid); best = np.where(nb, d, best)
        rim = ss(.07, .015, second - best) * F('rimk2', .8)
        kind = (cid % 20) // 2 + (cid % 20 >= 18) * 0   # mostly gold
        kind = np.where(cid % 20 < 15, 0, np.where(cid % 20 < 18, 6, 8))
        pal = OPT.get('cellpal')
        if pal:
            pc = [srgb2lin(hexrgb(c)) for c in pal.split(',')]
            wts = np.cumsum([float(w) for w in OPT.get('cellw', ','.join(['1'] * len(pc))).split(',')]); wts = wts / wts[-1]
            q = (cid % 101) / 101.0
            idx = np.searchsorted(wts, q)
            cc = np.stack(pc)[np.clip(idx, 0, len(pc) - 1)]
        else:
            cc = np.where((kind < 6)[..., None], srgb2lin(hexrgb(ce.get('c', '#b48a3c'))), np.where((kind < 8)[..., None], srgb2lin(hexrgb(ce.get('rust', '#8a4a22'))), srgb2lin(hexrgb(ce.get('olive', '#403a12')))))
        cc = cc * (.85 + .3 * ((cid % 7) / 6.0))[..., None]
        on = ((lab == OUTER) | (lab == LIP))[..., None]
        val = cc * (1 - rim[..., None]) + srgb2lin(hexrgb(OPT.get('cellrim', ce.get('rim', '#3a2812')))) * rim[..., None]
        alb = np.where(on, val, alb)
    ch = tp.get('china')
    if ch:
        # blue-and-white painting in the vessel's own space (angle round x height): double bands at the neck and the foot,
        # a scrolling vine with curls, leaves and peonies round the body, the brush's wash uneven
        Hc = geo['htop']; Rm = float(np.median(np.hypot(P[..., 0], P[..., 2])[lab == OUTER]))
        k_ = 4; Wt = int(2 * math.pi * Rm * k_); Ht = int(Hc * k_) + 2
        T = np.zeros((Ht, Wt), np.float32)
        rng = np.random.default_rng(5)
        Y = lambda hh_: int((Hc - hh_) * k_)
        for yb in (Hc - 6, Hc - 9, 9, 6):
            cv2.line(T, (0, Y(yb)), (Wt, Y(yb)), 1, max(1, int(.9 * k_)), cv2.LINE_AA)
        n_ = int(ch.get('n', 16)); mid = Hc * .5; amp = Hc * .09
        xs = np.arange(Wt); vine = mid + amp * np.sin(2 * math.pi * xs / Wt * (n_ / 2))
        pts = np.c_[xs, [(Hc - y) * k_ for y in vine]].astype(np.int32)
        cv2.polylines(T, [pts], False, 1, max(1, int(1.1 * k_)), cv2.LINE_AA)
        for i in range(n_):
            x0 = int((i + .5) / n_ * Wt); y0 = vine[min(x0, Wt - 1)]
            side = 1 if i % 2 else -1
            # a curl off the vine, a leaf pair, and on every other one a peony
            t = np.linspace(0, 2.4 * math.pi, 60); rr = (1 - t / (2.6 * math.pi)) * amp * .5
            cx, cy = x0 + side * amp * .5 * k_, (Hc - (y0 + side * amp * .55)) * k_
            cv2.polylines(T, [np.c_[cx + rr * k_ * np.cos(t), cy + rr * k_ * np.sin(t) * side].astype(np.int32)], False, 1, max(1, int(.8 * k_)), cv2.LINE_AA)
            for a_ in (-.6, .7):
                lx, ly = int(x0 + math.cos(a_) * amp * .5 * k_), int((Hc - y0 - side * math.sin(a_) * amp * .35) * k_)
                cv2.ellipse(T, (lx, ly), (int(amp * .32 * k_), int(amp * .12 * k_)), math.degrees(a_) * side, 0, 360, .85, -1, cv2.LINE_AA)
            for jl in range(5):
                # leaves all along the vine, alternating sides
                xl = int(x0 + (jl - 2) * Wt / n_ / 5); yl = vine[xl % Wt]; sd = 1 if (jl + i) % 2 else -1
                ang = math.degrees(math.atan2(-sd * amp * .5, Wt / n_ / 5)) + sd * 35
                cv2.ellipse(T, (xl % Wt, int((Hc - yl - sd * amp * .32) * k_)), (int(amp * .28 * k_), int(amp * .1 * k_)), ang, 0, 360, .9, -1, cv2.LINE_AA)
            if i % 2 == 0:
                fx, fy = x0, int((Hc - y0 + amp * .05) * k_); R0 = int(amp * .62 * k_)
                for j in range(8):
                    a_ = j / 8 * 2 * math.pi
                    cv2.ellipse(T, (int(fx + .5 * R0 * math.cos(a_)), int(fy + .5 * R0 * math.sin(a_))), (int(R0 * .55), int(R0 * .32)), math.degrees(a_), 0, 360, .7, -1, cv2.LINE_AA)
                cv2.circle(T, (fx, fy), int(R0 * .32), 1, -1, cv2.LINE_AA)
                cv2.circle(T, (fx, fy), int(R0 * .14), .35, -1, cv2.LINE_AA)
        T = np.clip(T, 0, 1)
        edge = np.clip(T - cv2.erode(T, np.ones((3, 3), np.uint8)), 0, 1)           # the brush's darker rim
        T = cv2.GaussianBlur(T, (0, 0), .6) * (0.72 + 0.32 * cv2.resize(rng.random((Ht // 10 + 1, Wt // 10 + 1)).astype(np.float32), (Wt, Ht), interpolation=cv2.INTER_CUBIC))
        T = np.clip(T + .35 * edge, 0, 1)
        tx = ((PH / (2 * math.pi)) * Wt).astype(int) % Wt; ty = np.clip(((Hc - hh) * k_).astype(int), 0, Ht - 1)
        ink = np.clip(T[ty, tx], 0, 1) * ((lab == OUTER) | (lab == LIP))
        cob = srgb2lin(hexrgb(ch.get('c', '#2f4a8a'))) * F('cobk', .62)
        alb = alb * (1 - ink[..., None]) + cob * ink[..., None]
    ag = tp.get('agate')
    if ag:
        # agate: bands of the clays swirled round the body, each band one of the measured colours
        cs = np.array([srgb2lin(hexrgb(c)) for c in ag.get('c', ['#888888'])])
        sw = 3.2 * noise2(PH / (2 * math.pi), hh / 9, (5, 1), 41) + 1.6 * noise2(PH / (2 * math.pi), hh / 3, (13, 1), 42)
        t = (hh / UPC * F('agk', 1.3) + sw + PH * .4) % len(cs)
        i0 = np.floor(t).astype(int) % len(cs); fr = ss(.82, 1, t - np.floor(t))
        cA = cs[i0]; cB = cs[(i0 + 1) % len(cs)]
        alb = np.where((lab == OUTER)[..., None] | (lab == LIP)[..., None], cA * (1 - fr[..., None]) + cB * fr[..., None], alb)
    if OPT.get('gilt'):
        # a gilt line on the lip
        gl_ = (lab == LIP) & (fld['P'][..., 1] > geo['htop'] - geo['w'] * .35)
        alb[gl_] = srgb2lin(hexrgb(OPT['gilt']))
        metal = np.where(gl_, 1.0, metal); rough = np.where(gl_, .12, rough)
    if v.get('col2') and v.get('fin') != 'patina':
        c2 = srgb2lin(hexrgb(v['col2']))
        alb = alb * (1 - F('c2k', .0)) + c2 * F('c2k', .0)
    if 'aniso' in mat:
        rough = rough * (1 + .3 * np.abs(N[..., 1]))
    V = EYE
    cv_ = np.clip(N @ V, 0, 1)
    R = 2 * cv_[..., None] * N - V
    spec = blurred_env(R, rough)
    # a second, wider lobe: the depth of a glaze under its clear surface, the faint haze of a polished metal; it carries the
    # light of the boxes a little past their sharp image, as a varnish does
    # a rough surface blurs the studio over a wide cone: the finite set of directions would copy the boxes' edges as streaks,
    # so its mirror is smoothed in proportion to its roughness
    sig = F('specblur', 14) * float(np.median(rough[lab >= 0]) if (lab >= 0).any() else 0)
    if sig > .8:
        spec = np.dstack([cv2.GaussianBlur(spec[..., i].astype(np.float32), (0, 0), sig) for i in range(3)])
    sh = F('sheen', .2 if mat['metal'] == 0 and mat['coat'] >= .6 else .1 if mat['metal'] else 0)
    if sh > 0:
        spec = (1 - sh) * spec + sh * blurred_env(R, np.clip(rough * 6 + F('sheenr', .1), 0, 1))
    # light received: soft sky from above, the key light wrapped round the form, a little of the strip on the right
    wrap = F('wrap', .3)
    Dk = np.clip((N @ LW + wrap) / (1 + wrap), 0, 1)
    sky = .5 + .5 * N[..., 1]
    D = F('amb', .42) * (.35 + .65 * sky) + F('diff', 1.05) * Dk + .25 * np.clip(N @ STRIP, 0, 1)
    # occlusion: the foot on the floor, the inside of the vessel by its depth below the lip, the floor of the inside
    ao = np.ones(lab.shape, np.float32)
    ao = np.where(lab == OUTER, 1 - F('aofoot', .45) * np.exp(-np.clip(hh, 0, None) / F('footz', 4.0)), ao)
    rin = np.maximum(np.hypot(P[..., 0], P[..., 2]), 3)
    t = np.clip(geo['htop'] - hh, 0, None) / rin
    ao = np.where((lab == INNER) | (lab == FLOOR), F('aoin0', .1) + (1 - F('aoin0', .1)) * np.exp(-t * F('aoin', 1.1)), ao)
    ao = np.where(lab == BEAD, .9 + .1 * N[..., 1], ao)
    f0 = np.where(metal[..., None] > 0, alb, F('f0', mat['f0']))
    Fr = f0 + (1 - f0) * ((1 - cv_) ** 5)[..., None]
    coat = mat['coat']
    diel = alb * D[..., None] * ao[..., None] * (1 - Fr * coat) + Fr * coat * spec * ao[..., None] ** .5
    met = Fr * spec * (.25 + .75 * ao[..., None]) + alb * .05 * D[..., None]
    col = met * metal[..., None] + diel * (1 - metal[..., None])
    col = col * F('expo', 1.0)
    kn = F('knee', .82)
    col = np.where(col > kn, kn + (1 - kn) * (1 - np.exp(-(col - kn) / (1 - kn))), col)
    disp = 255 * np.clip(col, 0, 1) ** (1 / 2.2)
    disp[~m] = 0
    return disp.astype(np.float32)


# ---------------------------------------------------------------- writing: crisp outlines, the surface as thin rows of gradients
def outline(mask, mapf):
    """a part's outline: cubic Beziers fitted on its smoothed mask, crisp and clean (no stair-steps of the pixels)"""
    f = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), F('osm', 1.2))
    K.FIT_EPS = F('fit', .1)
    try:
        return K.contour_paths(f, .5, 1.0, .05, mapf, 1.0)
    finally:
        K.FIT_EPS = 0


def rdp_idx(V, tol):
    """indices of a sampled profile (n, channels) kept so that linear interpolation between them stays within tol"""
    n = len(V)
    keep = np.zeros(n, bool); keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        a, b = stack.pop()
        if b - a < 2:
            continue
        t = (np.arange(a + 1, b) - a) / (b - a)
        lin = V[a] + (V[b] - V[a]) * t[:, None]
        err = np.abs(V[a + 1:b] - lin).max(1)
        i = int(err.argmax())
        if err[i] > tol:
            j = a + 1 + i
            keep[j] = True
            stack += [(a, j), (j, b)]
    return np.nonzero(keep)[0]


def rows_svg(col, mask, mapf, RES, tag, defs, row=None, tol=None):
    """the part's field as thin horizontal rows, each filled with a linear gradient whose stops sit where the tone turns:
    smooth surfaces, sharp highlights, nothing of the pixels. Rows are opaque and overlap the next by half a row, so no seam
    can open between them at any scale"""
    marg = int(3 * RES)
    ce, _ = K.extend(col, mask, marg)
    ys = np.where(mask.any(1))[0]
    if not len(ys):
        return ''
    stp = max(1, int(round((row or F('row', .5)) * RES)))
    # rows run a little past the part above and below (the vertical softening must not fade at its edge; the clip cuts there)
    mask = cv2.dilate(mask.astype(np.uint8), np.ones((2 * stp + 1, 3), np.uint8)).astype(bool)
    ys = np.where(mask.any(1))[0]
    tol = tol or F('stoptol', .6)
    ce = cv2.GaussianBlur(ce.astype(np.float32), (0, 0), sigmaX=.01, sigmaY=max(.5, stp * .6))   # rows agree with their neighbours
    if ce.ndim == 2:
        ce = ce[..., None]
    out = []
    for yy in range(ys.min(), ys.max() + 1, stp):
        band = mask[yy:yy + stp]
        xs = np.where(band.any(0))[0]
        if not len(xs):
            continue
        xa, xb = max(int(xs.min()) - 3, 0), min(int(xs.max()) + 3, mask.shape[1] - 1)
        V = ce[yy:yy + stp, xa:xb + 1].mean(0)
        idx = rdp_idx(V, tol)
        X0 = mapf(xa - .5, yy)[0]; X1 = mapf(xb + .5, yy)[0]
        Y0 = mapf(0, yy - .5)[1]; Y1 = mapf(0, min(yy + stp, mask.shape[0]) - .5 + stp)[1]
        gid = '%s%d' % (tag, yy)
        hexv = (lambda c: K.hexc(np.repeat(c, 3))) if V.shape[1] == 1 else K.hexc
        st = ''.join('<stop offset="%s" stop-color="%s"/>' % (K.fmt(round((i + .5) / (xb - xa + 1), 3)), hexv(V[i])) for i in idx)
        defs.append('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="%s" x2="%s">%s</linearGradient>' % (
            gid, K.fmt(round(X0, 2)), K.fmt(round(X1, 2)), st))
        out.append('<rect x="%s" y="%s" width="%s" height="%s" fill="url(#%s)"/>' % (
            K.fmt(round(X0, 2)), K.fmt(round(Y0, 2)), K.fmt(round(X1 - X0, 2)), K.fmt(round(Y1 - Y0, 2)), gid))
    return ''.join(out)


def part_svg(disp, mask, mapf, RES, tag, defs, alpha=None, over=''):
    """one part: its crisp outline as a clip, its surface in rows of gradients, then what lies on it (grain, streaks)"""
    if mask.sum() < 12:
        return ''
    clip = outline(mask, mapf)
    if not clip:
        return ''
    defs.append('<clipPath id="k%s"><path d="%s"/></clipPath>' % (tag, clip))
    if not any(d_.startswith('<filter id="vb"') for d_ in defs):
        # rows merged by a vertical softening only: smooth between rows, the outline (the clip, applied after) and the
        # vertical edges of the reflections stay sharp
        defs.append('<filter id="vb" x="-1%%" y="-3%%" width="102%%" height="106%%"><feGaussianBlur stdDeviation="0 %s"/></filter>' % K.fmt(round(F('vblur', .7) * F('row', .5), 3)))
    # a solid base of the part's mean colour under the rows: where two rows meet inside a pixel their coverage stays below
    # one, and the base, not the page, shows through (no light seams at small sizes)
    base = K.hexc(np.asarray(disp)[mask].mean(0)) if np.asarray(disp).ndim == 3 else K.hexc(np.repeat(np.asarray(disp)[mask].mean(), 3))
    rows = '<path d="%s" fill="%s"/><g filter="url(#vb)">%s</g>' % (clip, base, rows_svg(disp, mask, mapf, RES, 'r' + tag, defs))
    if alpha is not None:
        # a translucent part: its opacity as a luminance mask of grey rows (opaque, overlapping: never doubled)
        ys, xs = np.where(mask)
        x0, y0 = mapf(xs.min() - 6, ys.min() - 6); x1, y1 = mapf(xs.max() + 6, ys.max() + 6)
        # opacity changes slowly: coarse rows, no blur inside the mask (a filtered mask is drawn in tiles: stripes)
        mrows = '<path d="%s" fill="%s"/>' % (clip, K.hexc(np.repeat(255 * float(np.clip(alpha[mask], 0, 1).mean()), 3))) + rows_svg(255 * np.clip(cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), 1.5), 0, 1) ** (1 / F('agamma', 1.0)), mask, mapf, RES, 'a' + tag, defs,
                         row=F('arow', 1.5), tol=F('atol', 2.5))
        defs.append('<mask id="m%s" maskUnits="userSpaceOnUse" x="%s" y="%s" width="%s" height="%s" style="mask-type:luminance" '
                    'color-interpolation="sRGB">%s</mask>' % (tag, K.fmt(round(x0, 1)), K.fmt(round(y0, 1)), K.fmt(round(x1 - x0, 1)), K.fmt(round(y1 - y0, 1)), mrows))
        rows = '<g mask="url(#m%s)">%s</g>' % (tag, rows)
    return '<g clip-path="url(#k%s)">%s%s</g>' % (tag, rows, over)


def noise_layer(mask, mapf, defs, tag, layers):
    """SVG noise on a part (clipped by its outline): layers = [(name, rgb 0-1, baseFrequency 'fx fy', coverage, sharpness,
    opacity, seed)]"""
    ys, xs = np.where(mask)
    x0, y0 = mapf(xs.min(), ys.min()); x1, y1 = mapf(xs.max() + 1, ys.max() + 1)
    box = 'x="%s" y="%s" width="%s" height="%s"' % tuple(K.fmt(round(t, 1)) for t in (x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4))
    from statistics import NormalDist
    out = ''
    for nm, c, fq, cov, kk, op, seed in layers:
        t = .5 + .1 * NormalDist().inv_cdf(1 - cov)
        defs.append('<filter id="n%s%s" filterUnits="userSpaceOnUse" %s color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" '
                    'baseFrequency="%s" numOctaves="3" seed="%d"/><feColorMatrix values="0 0 0 0 %s 0 0 0 0 %s 0 0 0 0 %s %s 0 0 0 %s"/></filter>' % (
                        tag, nm, box, fq, seed, K.fmt(round(c[0], 3)), K.fmt(round(c[1], 3)), K.fmt(round(c[2], 3)),
                        K.fmt(kk), K.fmt(round(-kk * t, 3))))
        out += '<rect %s filter="url(#n%s%s)" opacity="%s"/>' % (box, tag, nm, K.fmt(round(op, 3)))
    return out


def texture(v, mat, mask, mapf, defs, tag):
    """the material's own texture over the surface: the fine grain of a fired body, the brushing of a metal"""
    c = hexrgb(v.get('col', '#cccccc'))
    if mat['metal'] and F('brush', .5) > 0:
        k = F('brush', .5)
        return noise_layer(mask, mapf, defs, tag, [
            ('bl', np.clip(c * 1.25 + .1, 0, 1), '0.012 %s' % K.fmt(F('brushf', .9)), .3, 5, .22 * k, 3),
            ('bd', c * .55, '0.015 %s' % K.fmt(F('brushf', .9) * .7), .3, 5, .2 * k, 8)])
    g = mat['grain'] * F('grain', 1)
    if g <= 0:
        return ''
    gf = K.fmt(F('gf', 2.4))
    return noise_layer(mask, mapf, defs, tag, [('gd', c * .72, gf, .12, 18, .22 * g, 5),
                                               ('gl', np.clip(c * 1.15 + .05, 0, 1), gf, .08, 18, .18 * g, 9),
                                               ('gm', c * .85, K.fmt(F('gmf', .08)), .5, 2, .1 * g, 13)])


def specks_svg(v, fld, disp, geo, mf, RES):
    """flecks fired in the body (tp.speck: count round the whole vessel, colours, radii in cm, opacity; blots: larger soft
    ones): placed on the surface of revolution, foreshortened as it turns away, darkened by the light where they lie"""
    sp = (v.get('tp') or {}).get('speck')
    if not sp:
        return ''
    rng = np.random.default_rng(abs(hash(VID)) % 2 ** 32)
    h, r = geo['h'], geo['r']
    x0, y0 = fld['x0'], fld['y0']
    lum = disp @ np.array([.3, .59, .11]) if disp.ndim == 3 else disp
    ref = float(np.percentile(lum[mf], 70)) if mf.any() else 1
    cols = [hexrgb(c) for c in sp.get('c', ['#555555'])]
    if F('granito', 0) > 0:
        cols += [hexrgb(c) for c in OPT.get('chips', '#f4f1ea,#9a9590,#c46a4a,#3b3a38').split(',')]
    r0, r1 = [float(t) * UPC for t in sp.get('r', [.05, .12])]
    op = float(sp.get('o', .6))
    out = []
    n = int(sp.get('n', 200) * F('speckk', 1.0))
    hs = rng.uniform(geo['fh'] + 1, geo['htop'] - geo['w'], n * 2)
    for i, hh in enumerate(hs):
        a = rng.uniform(-math.pi / 2, math.pi / 2)          # the visible half
        rr = float(np.interp(hh, h, r))
        X, Z = rr * math.sin(a), rr * math.cos(a)
        sx, sy = VX + X, FL - hh + Z * RY
        ix, iy = int((sx - x0) * RES), int((sy - y0) * RES)
        if not (0 <= iy < mf.shape[0] and 0 <= ix < mf.shape[1]) or not mf[iy, ix]:
            continue
        big = i < int(sp.get('blots', 0)) or (F('granito', 0) > 0 and rng.random() < F('bigk', .07))
        rad = rng.uniform(r0, r1) * (3.2 if big else 1)
        fz = max(.12, math.cos(a))
        shade = float(np.clip(lum[iy, ix] / max(ref, 1), .25, 1.15))
        c = cols[rng.integers(len(cols))] * shade
        if F('granito', 0) > 0:
            # terrazzo: an angular chip of stone set flush in the body, foreshortened with the surface
            nv = int(rng.integers(5, 8)); rot = rng.uniform(0, 2 * math.pi)
            ang = np.sort(rng.uniform(0, 2 * math.pi, nv)); rr_ = rad * rng.uniform(.55, 1.15, nv) * F('chipk', 1.6)
            pts = ' '.join('%s,%s' % (K.fmt(round(sx + math.cos(t + rot) * q * fz, 2)), K.fmt(round(sy + math.sin(t + rot) * q * .9, 2))) for t, q in zip(ang, rr_))
            out.append('<polygon points="%s" fill="%s"/>' % (pts, K.hexc(np.clip(c, 0, 1) * 255)))
        else:
            out.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"%s/>' % (
                K.fmt(round(sx, 2)), K.fmt(round(sy, 2)), K.fmt(round(rad * fz, 2)), K.fmt(round(rad * rng.uniform(.75, 1), 2)),
                K.hexc(np.clip(c, 0, 1) * 255), ' opacity="%s"' % K.fmt(round(op * (.45 if big else rng.uniform(.6, 1)), 2))))
        if len(out) >= n:
            break
    return '<g>%s</g>' % ''.join(out)


def emit_opaque(v, fld, disp, mat, RES):
    lab, P = fld['lab'], fld['P']
    x0, y0 = fld['x0'], fld['y0']
    mapf = lambda x, y: (x0 + (x + .5) / RES, y0 + (y + .5) / RES)
    K.RDP_EPS = 0; K.FIT_EPS = 0; K.AREA_MIN = F('amin', 4)
    if F('csm', .8) > 0:
        disp = cv2.GaussianBlur(disp, (0, 0), F('csm', .8))
    back = np.isin(lab, (INNER, FLOOR)) | (np.isin(lab, (OUTER, LIP, BEAD, PIN)) & (P[..., 2] < 0))
    if v.get('shape') == 'outline':
        back = np.isin(lab, (INNER, FLOOR))
    defs, body, mouth = [], [], []
    for l in (INNER, FLOOR, OUTER, LIP, BEAD, PIN):
        mb = (lab == l) & back
        if mb.sum() > 12:
            mouth.append(part_svg(disp, mb, mapf, RES, 'b%d' % l, defs))
    for l in (OUTER, LIP, BEAD, PIN):
        mf = (lab == l) & ~back
        if mf.sum() > 12:
            over = texture(v, mat, mf, mapf, defs, 'f%d' % l) + specks_svg(v, fld, disp, GEO, mf, RES) if l == OUTER else ''
            body.append(part_svg(disp, mf, mapf, RES, 'f%d' % l, defs, over=over))
    return ''.join(defs), ''.join(body), ''.join(mouth)


def write_out(v, defs, body, mouth, extra=None):
    os.makedirs(OUT, exist_ok=True)
    d = K.write_body(os.path.join(OUT, 'body.json'), defs, body, mouth=mouth, **(extra or {}))
    fiche = {k: val for k, val in v.items() if k not in ('st', 'sf', 'pl', 'svgb', 'vs')}
    fiche['svgb'] = VID
    if 'kind' in OPT:
        fiche['kind'] = OPT['kind']
    json.dump(fiche, open(os.path.join(OUT, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    import gzip
    js = json.dumps(d, separators=(',', ':')).encode()
    log('body.json %.0f Ko, gzip %.0f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))


def main():
    v = fiche_of(VID)
    mat = material(v)
    RES = F('res', 5.0)
    global GEO
    if v.get('shape') == 'outline':
        fld, geo = outline_field(v, RES)
        GEO = geo
        parts = []
    else:
        parts, geo = model(v, RES)
        GEO = geo
    log('%s: %s/%s, h %.1f, %d parts, %d samples' % (VID, v.get('mat'), v.get('fin'), geo['htop'], len(parts), sum(len(p[1]) for p in parts)))
    if parts:
        fld = rasterise(parts, RES)
    log('field %dx%d, %d px' % (fld['W'], fld['H'], int((fld['lab'] >= 0).sum())))
    if v.get('mat') == 'glass':
        OPT.setdefault('stoptol', '2')                                 # a glass's field is soft: fewer stops do
        defs, body, mouth, extra, prev = shade_glass(v, fld, geo, mat, RES)
    else:
        disp = shade_opaque(v, fld, geo, mat)
        prev = disp
        defs, body, mouth = emit_opaque(v, fld, disp, mat, RES)
        extra = None
    pv = prev.copy(); pv[fld['lab'] < 0] = (238, 235, 229)
    os.makedirs(OUT, exist_ok=True)
    cv2.imwrite(os.path.join(OUT, 'field.png'), pv[..., ::-1].astype(np.uint8))
    write_out(v, defs, body, mouth, extra)


def shade_glass(v, fld, geo, mat, RES):
    """a glass vessel is drawn over its stems, as rows of gradients with their own opacity:
    - thickness: at each point of the wall, the length of glass the eye looks through (front and back walls, the chord at the
      edges, the solid bottom, the lip seen edge-on) tints and darkens by absorption, so the edges and the foot read thick;
    - frost (owner 2026-10-17): denser low down, clearer up the wall, scattering the studio's light;
    - the studio mirrored by the glass (Fresnel), sharp where it is clear, blurred where it is frosted;
    the cavity is where the engine shows the stems inside"""
    lab, N, P = fld['lab'], fld['N'], fld['P']
    x0, y0 = fld['x0'], fld['y0']
    mapf = lambda x, y: (x0 + (x + .5) / RES, y0 + (y + .5) / RES)
    K.RDP_EPS = 0; K.FIT_EPS = 0; K.AREA_MIN = F('amin', 4)
    m = lab >= 0
    back = np.isin(lab, (INNER, FLOOR)) | (np.isin(lab, (OUTER, LIP, BEAD, PIN)) & (P[..., 2] < 0))
    front = m & ~back
    hh = P[..., 1]; htop = geo['htop']; h, r = geo['h'], geo['r']
    gw = F('gw', 2.6)                                                  # the glass wall's thickness (units, ~4 mm)
    hb = F('gbase', 9.0)                                              # the solid bottom (~1.4 cm)
    R_ = np.interp(hh, h, r); Ri = np.maximum(R_ - gw, .5)
    x = P[..., 0]
    ch = lambda rr: np.sqrt(np.clip(rr * rr - x * x, 0, None))
    Lw = np.where(np.abs(x) < Ri, 2 * (ch(R_) - ch(Ri)), 2 * ch(R_))   # front and back walls, or the chord near the edge
    Lw = np.where(hh < hb, 2 * ch(R_), Lw)                            # the solid bottom: glass all through
    Lw = np.where(lab == LIP, F('lipL', 3.5) * gw * 2, Lw)            # the lip, seen edge-on round the ring
    Lw = Lw / max(CA, .5)
    gl = v.get('gl') or {}
    tint = srgb2lin(hexrgb(F_str('gtint', gl.get('tint', '#d9ece6'))))
    # the glass's density: through the two walls at the middle (2 gw) it lets through 1 - op of the light (gl.op, measured)
    op = float(np.clip(F('gop', gl.get('op', .15)), .05, .97))
    gL = F('gL', 2 * gw / CA * float(np.log(np.clip(tint, .03, .999)).mean()) / math.log(1 - op))
    absk = -np.log(np.clip(tint, .03, .999)) / max(gL, .5)
    grad = (v.get('tp') or {}).get('grad')
    if grad and F('gradk', 1) > 0:
        # a glass whose colour changes up the body (tp.grad: height in cm -> colour): its absorption follows
        hs_ = np.array([g[0] for g in grad], float) * UPC; cs_ = np.array([srgb2lin(hexrgb(g[1])) for g in grad])
        tz = np.stack([np.interp(hh, hs_, cs_[:, i]) for i in range(3)], -1)
        absk = -np.log(np.clip(tz, .03, .999)) / max(gL, .5); tint = tz
    T = np.exp(-(absk if absk.ndim == 3 else absk[None, None]) * Lw[..., None])   # light let through, per channel
    a_t = np.clip(1 - T.mean(-1), 0, 1) * F('tk', 2.4)
    c_t = np.clip(tint * F('tdark', .32 if op < .5 else .7), 0, 1) * np.ones_like(T)   # the colour of the glass's own body
    # frost: a scattering skin, denser low down
    t = np.clip(hh / max(htop, 1), 0, 1)
    fz0, fz1 = F('frost0', .5 if v.get('fin') == 'frosted' else .06), F('frost1', .02)   # frost only where it is asked for
    a_f = fz0 + (fz1 - fz0) * ss(0, 1, t)
    a_f = np.where(hh < hb, np.maximum(a_f, F('frostb', .55)), a_f)
    cv_ = np.clip(N @ EYE, 0, 1)
    Dm = .55 + .35 * N[..., 1] + .45 * np.clip(N @ LW, 0, 1)
    c_f = np.clip(srgb2lin(hexrgb('#f3f6f5'))[None, None] * Dm[..., None], 0, 1)
    a = 1 - (1 - np.clip(a_t, 0, .95)) * (1 - a_f)
    col = (c_t * (a_t * (1 - a_f))[..., None] + c_f * a_f[..., None]) / np.maximum(a, 1e-4)[..., None]
    # the mirror: sharp reflections where the glass is clear, softened where frosted; strongest at grazing angles
    Rr = 2 * cv_[..., None] * N - EYE
    rough = F('grough', .015) + F('frostr', .04) * np.clip((a_f - fz1) / max(fz0 - fz1, 1e-3), 0, 1)   # glossy skin over the frost
    spec = blurred_env(Rr, rough)
    Fr = .04 + .96 * (1 - cv_) ** 5
    refl = np.clip((spec @ np.array([.3, .59, .11])) * Fr * F('reflk', 3.6), 0, 1)
    refl = np.maximum(refl, F('rimk', .55) * ss(.25, .02, cv_) * (lab == OUTER))   # the bright line of a glass edge seen at grazing
    # the back wall's inside mirrors the studio too: its normal is the front's mirrored across the axis, so its stripes stand
    # at the mirrored places, dimmed by the front wall they are seen through (the doubled stripes of a real glass)
    Nb = N * np.array([-1, 1, 1]); cb = np.clip(Nb @ EYE, 0, 1)
    spb = blurred_env(2 * cb[..., None] * Nb - EYE, rough + .01)
    Fb = .04 + .96 * (1 - cb) ** 5
    inside = (np.abs(x) < Ri) & (lab == OUTER) & (hh >= hb)
    refl = np.clip(refl + F('innerk', .6) * np.where(inside, np.clip((spb @ np.array([.3, .59, .11])) * Fb, 0, 1), 0), 0, 1)
    ao = np.clip(a + refl * (1 - a), 0, 1)
    co = (col * (a * (1 - refl))[..., None] + refl[..., None]) / np.maximum(ao, 1e-4)[..., None]
    disp = 255 * np.clip(co, 0, 1) ** (1 / 2.2)
    alpha = np.where(m, np.clip(ao, 0, 1), 0).astype(np.float32)
    if F('gcsm', 1.0) > 0:
        disp = cv2.GaussianBlur(disp.astype(np.float32), (0, 0), F('gcsm', 1.0))
    defs = []
    body = part_svg(disp, front & (lab != LIP), mapf, RES, 'gf', defs, alpha=alpha) + part_svg(disp, front & (lab == LIP), mapf, RES, 'gl', defs, alpha=alpha)
    # what defines a glass at a glance: a fine light line on its outline, the lip's inner edge crisp
    for mm, op in ((front, F('edgew_a', .6)), (lab == LIP, .45)):
        o = outline(mm, mapf)
        if o:
            body += ('<path d="%s" fill="none" stroke="#2f3b38" stroke-opacity="%s" stroke-width="%s"/>'
                     '<path d="%s" fill="none" stroke="#ffffff" stroke-opacity="%s" stroke-width="%s"/>' % (
                         o, K.fmt(op * .45), K.fmt(F('edgew', .55) * 3.2), o, K.fmt(op), K.fmt(F('edgew', .55))))
    dash = (v.get('tp') or {}).get('dash')
    if dash and (front & (lab == OUTER)).sum() > 50:
        # flecks of white glass caught in the body (tp.dash): small light marks, crisp, clipped to the body
        cs = [hexrgb(c) for c in dash.get('c', ['#ffffff'])]
        body = body.replace('</g>', noise_layer(front & (lab == OUTER), mapf, defs, 'gd', [
            ('w%d' % i, c, '%s %s' % (K.fmt(F('dashf', .32)), K.fmt(F('dashf', .32) * 1.6)), F('dashc', .018), 30, .9 - .2 * i, 31 + i) for i, c in enumerate(cs)]) + '</g>', 1)
    bub = (v.get('tp') or {}).get('bubble')
    if bub:
        # an air bubble in the glass (tp.bubble: height and radius in cm), seen on the front
        by = FL - float(bub['h']) * UPC; br = float(bub['r']) * UPC
        body += ('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="%s"/>'
                 '<circle cx="%s" cy="%s" r="%s" fill="#ffffff" fill-opacity=".9"/>' % (
                     K.fmt(VX - br * 1.5), K.fmt(round(by, 2)), K.fmt(round(br, 2)), K.fmt(round(br * .25, 2)),
                     K.fmt(round(VX - br * 1.8, 2)), K.fmt(round(by - br * .35, 2)), K.fmt(round(br * .22, 2))))
    mouth = part_svg(disp, back, mapf, RES, 'gb', defs, alpha=alpha)
    kk = (h >= hb) & (h <= htop - geo['w'] / 2)
    hs, ri = h[kk], np.maximum(r[kk] - gw, .5)
    pts = [(VX + x_, FL - y_) for x_, y_ in zip(ri, hs)] + [(VX - x_, FL - y_) for x_, y_ in zip(ri[::-1], hs[::-1])]
    inner = 'M' + 'L'.join('%s %s' % (K.fmt(round(p_, 1)), K.fmt(round(q_, 1))) for p_, q_ in pts[::3]) + 'Z'
    extra = dict(inner=inner, cavb=round(FL - hb, 1), cavr=round(float(ri[0]), 1))
    prev = disp * alpha[..., None] + 238 * (1 - alpha[..., None])
    return ''.join(defs), body, mouth, extra, prev


F_str = lambda k, d: OPT.get(k, d)


if __name__ == '__main__':
    main()
