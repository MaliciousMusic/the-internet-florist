# The pink butterfly vase (vases5/papillon-rose): the model (geom.py) is sampled as dense points with exact normals (outer
# and inner glaze, the rolled lips, the back wall's top edge, the two crosiers, the butterfly's relief as a displacement of
# the belly), lit by the shop's single light (key light with cast shadows, sky occlusion traced through the slit, a
# glossy glaze mirroring a coherent studio with Fresnel), splatted through the camera into a depth buffer, and written as
# SVG curves (svg.py): tone bands clipped to their paint region, softened by a small blur; veins and antennae as strokes.
#   python mk.py prev  [key=value]  -> out/field_<proj>.png only (no SVG), proj = photo unless proj=shop
#   python mk.py photo [key=value]  -> out/papillon_photo.svg (the reference's framing, for the comparison)
#   python mk.py shop  [key=value]  -> out/papillon_shop*.svg, out/body.json, out/fiche.json
import sys, os, math, json, time
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
sys.path.insert(0, HERE)
import svgkit as K  # noqa: E402
import geom as G    # noqa: E402
import bfly as B    # noqa: E402

MODE = sys.argv[1] if len(sys.argv) > 1 else 'shop'
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
V3 = lambda k, d: np.array([float(v) for v in OPT.get(k, d).split(',')])
PROJ = OPT.get('proj', 'photo' if MODE in ('prev', 'photo') else 'shop')
t00 = time.time()
OUTD = os.path.join(HERE, 'out')

# ---------------------------------------------------------------- camera
YAW = G.YAWP                                         # the vase turned as on the photograph (the copy keeps its view)
if PROJ == 'photo':
    TE = G.TEP                                       # the photograph's eye (fitted, geom.py)
    OUT = lambda x, yu: (G.PCX + x * G.PK, G.PFL - yu * G.PK)
    RES = F('res', 1.0)
    FRAME = (736, 981)
else:
    TE = K.RY                                        # the shop's eye: y_screen_up = y - z * TE
    OUT = lambda x, yu: (K.VX + x * K.UPC, K.FL - yu * K.UPC)
    RES = F('res', 2.5)
    FRAME = None
UNIT = OUT(1, 0)[0] - OUT(0, 0)[0]                   # output units per cm
SS = int(F('ss', 2))
SUB = 1.0 / (UNIT * RES * SS)                        # one sub-pixel, in cm
SP = F('sp', .7) * SUB                               # sample spacing on the surfaces
cy_, sy_ = math.cos(YAW), math.sin(YAW)


def to_world(P):
    P = np.asarray(P)
    return np.stack([P[..., 0] * cy_ + P[..., 2] * sy_, P[..., 1], -P[..., 0] * sy_ + P[..., 2] * cy_], -1)


def to_local(D):
    D = np.asarray(D)
    return np.stack([D[..., 0] * cy_ - D[..., 2] * sy_, D[..., 1], D[..., 0] * sy_ + D[..., 2] * cy_], -1)


nrm = lambda v: v / np.linalg.norm(v, axis=-1, keepdims=True)
L = nrm(np.array([-.5, .62, .6]) if PROJ == 'shop' else V3('lp', '-.62,.42,.66'))   # the shop light (v1a.js LV) / the photograph's
EYE = nrm(np.array([0, TE, 1.]))
LB = nrm(V3('lb', '.45,.5,-.74'))                    # soft back light (contre-jour), upper right behind
Lloc, Eloc = to_local(L), to_local(EYE)


# ---------------------------------------------------------------- the studio (linear light)
def s3(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


WALL = (V3('bg', '238,235,229') / 255) ** 2.2


def env(d):
    """studio radiance seen in world direction d: light walls, bright ceiling, the stand just below the horizon, a dark
    floor, a large soft box (the shop light) upper left, a soft back light upper right, a dark flag on the right"""
    x, y, z = d[..., 0], d[..., 1], d[..., 2]
    c = WALL * np.ones(d.shape)
    c = c * (1 - s3(.2, .45, y)[..., None]) + V3('ceil', '1.0,.99,.97') * s3(.2, .45, y)[..., None]
    tb = s3(-.02, -.1, y)[..., None]
    c = c * (1 - tb) + V3('table', '.5,.49,.46') * tb
    fl = s3(-.25, -.5, y)[..., None]
    c = c * (1 - fl) + V3('floor', '.07,.07,.065') * fl
    flag = s3(.45, .62, x) * s3(-.55, -.3, -np.abs(y - .05)) * s3(-.6, -.2, z)
    c = c * (1 - F('flk', .7) * flag[..., None])
    flg = s3(.5, .7, -x) * s3(-.4, -.2, -np.abs(y + .1)) * s3(-.6, -.2, z)
    c = c * (1 - F('flk2', .45) * flg[..., None])
    kr = math.radians(F('keyr', 19))
    key = s3(math.cos(kr), math.cos(kr * .6), d @ L)
    c = c + F('keyi', 7.5) * key[..., None] * np.array([1, .985, .95])
    if PROJ == 'photo':
        # the photograph's room: a tall window on the right (the vertical streak on the right of the belly)
        az = np.degrees(np.arctan2(x, z)); el = np.degrees(np.arcsin(np.clip(y, -1, 1)))
        wa, ww, wh = F('wina', 86), F('winw', 7), F('winh', 32)
        win = s3(ww, ww * .5, np.abs(az - wa)) * s3(wh, wh * .7, np.abs(el - F('wine', 8)))
        c = c + F('wini', 6) * win[..., None] * np.array([1, 1, .98])
    br = math.radians(F('bkr', 26))
    bk = s3(math.cos(br), math.cos(br * .5), d @ LB)
    c = c + F('bki', 2.2) * bk[..., None] * np.array([1, .97, .93])
    return c


def sky(d):
    """the studio as diffuse light: the same room without the soft box (it is the direct light)"""
    y = d[..., 1]
    up = s3(-.6, .9, y)[..., None]
    return V3('skyd', '.16,.155,.15') * (1 - up) + V3('skyu', '.95,.94,.92') * up


# ---------------------------------------------------------------- occlusion: rays traced against the shell
def ffield(q):
    h = q[:, 1]
    rho = np.hypot(q[:, 0] - G.AX(h), q[:, 2])
    return rho - (G.R(h) - G.T / 2), rho, h


def blocked(P, D, tmax=26.0, step=.09):
    """True where the ray P + tD meets the wall (or the stand / the inner floor) before leaving the vase's neighbourhood"""
    N = len(P)
    res = np.zeros(N, bool)
    t = np.full(N, .035)
    f0, _, _ = ffield(P + t[:, None] * D)
    act = np.arange(N)
    prev = f0
    while act.size:
        t[act] += step
        q = P[act] + t[act, None] * D[act]
        f, rho, h = ffield(q)
        cross = np.sign(f) != np.sign(prev)
        hit = np.zeros(act.size, bool)
        if cross.any():
            ii = np.nonzero(cross)[0]
            qq = q[ii] - .5 * step * D[act[ii]]
            phi = np.arctan2(qq[:, 0] - G.AX(qq[:, 1]), qq[:, 2])
            hit[ii] = G.wall_exists(phi, qq[:, 1])
        hit |= (h < 0) & (D[act, 1] < 0)
        hit |= (f < 0) & (h < G.HFL)
        res[act[hit]] = True
        out = (h > 30.5) | ((f > 0) & (rho > 7.2) & (((q[:, 0] - G.AX(h)) * D[act, 0] + q[:, 2] * D[act, 2]) > 0)) | (t[act] > tmax)
        keep = ~hit & ~out
        prev = f[keep]
        act = act[keep]
    return res


def fib_dirs(n):
    i = np.arange(n) + .5
    z = 1 - i / n                                    # cosine-weighted: z = sqrt(u) ... use stratified on the hemisphere
    z = np.sqrt(z)
    r = np.sqrt(1 - z * z)
    a = i * math.pi * (3 - math.sqrt(5))
    return np.c_[r * np.cos(a), r * np.sin(a), z]


def basis(n):
    a = np.where(np.abs(n[:, 1:2]) < .9, np.array([[0, 1., 0]]), np.array([[1., 0, 0]]))
    u = nrm(np.cross(n, a)); v = np.cross(n, u)
    return u, v


def occl_grid(kind, nphi, nh):
    """ambient (sky seen, RGB) and key-light visibility on a (phi, h) grid of the outer (kind 0) or inner (1) surface"""
    import hashlib
    hs_ = np.linspace(0, 30, 300)
    key = hashlib.md5(np.round(np.r_[G.R(hs_), G.AX(hs_), G.UL(hs_), G.UR(hs_), G.htop(np.linspace(-3, 3, 60)), YAW, G.T], 4).tobytes()).hexdigest()[:8]
    cache = os.path.join(OUTD, 'occ_%s_%d_%d_%s_%d.npz' % (kind, nphi, nh, key, int(F('nao', 40))))
    if os.path.exists(cache) and not OPT.get('reocc'):
        z = np.load(cache)
        return z['amb'], z['vis']
    ph = np.linspace(-math.pi, math.pi, nphi, endpoint=False)
    hh = np.linspace(0, 30, nh)
    PH, HH = np.meshgrid(ph, hh)
    PH, HH = PH.ravel(), HH.ravel()
    Rr = G.R(HH)
    dR = (G.R(HH + .01) - G.R(HH - .01)) / .02
    n = nrm(np.stack([np.sin(PH), -dR, np.cos(PH)], 1))
    if kind == 1:
        rho = Rr - G.T; n = -n
    else:
        rho = Rr
    P = np.stack([G.AX(HH) + rho * np.sin(PH), HH, rho * np.cos(PH)], 1) + .02 * n
    ok = G.wall_exists(PH, HH)
    amb = np.zeros((len(P), 3)); vis = np.ones(len(P))
    dirs = fib_dirs(int(F('nao', 40)))
    u, v = basis(n)
    idx = np.nonzero(ok)[0]
    CH = 4000
    for s in range(0, len(idx), CH):
        ii = idx[s:s + CH]
        m = len(ii)
        Dl = (dirs[None, :, 0:1] * u[ii, None] + dirs[None, :, 1:2] * v[ii, None] + dirs[None, :, 2:3] * n[ii, None]).reshape(-1, 3)
        Pp = np.repeat(P[ii], len(dirs), 0)
        b = blocked(Pp, Dl).reshape(m, len(dirs))
        skyc = sky(to_world(Dl)).reshape(m, len(dirs), 3)
        amb[ii] = (skyc * (~b)[..., None]).mean(1)              # cosine-weighted mean = irradiance / pi
        Ll = np.repeat(Lloc[None], m, 0)
        lit = (n[ii] @ Lloc) > 0
        bl = blocked(P[ii], Ll)
        vis[ii] = np.where(lit, ~bl, 1).astype(float)
    amb = amb.reshape(nh, nphi, 3); vis = vis.reshape(nh, nphi)
    # carry the values past the edges of the wall (lookups at the lips) and soften the penumbra
    okm = ok.reshape(nh, nphi)
    amb, _ = K.extend(amb.astype(np.float32), okm, 4)
    vis, _ = K.extend(vis.astype(np.float32), okm, 4)
    vis = cv2.GaussianBlur(vis, (0, 0), F('pen', 1.2))
    np.savez(cache, amb=amb, vis=vis)
    return amb, vis


ECAV = np.zeros(3)


def cavity_light():
    """mean light received by the inner walls (sky through the openings and the key light), carried through the bounces
    (1 / (1 - albedo x mean enclosure)); the albedo is the inside's"""
    ph = np.linspace(-math.pi, math.pi, NPH_I, endpoint=False)
    hh = np.linspace(0, 30, NH_G)
    PH, HH = np.meshgrid(ph, hh)
    ok = G.wall_exists(PH, HH) & (HH > G.HFL)
    dR = (G.R(HH + .01) - G.R(HH - .01)) / .02
    n = -nrm(np.stack([np.sin(PH), -dR, np.cos(PH)], -1))
    ndl = np.clip(to_world(n) @ L, 0, 1)
    E = KA * OCC['ai'] + KK * (OCC['vi'] * ndl)[..., None]
    w = (G.R(HH) * ok)[..., None]                                   # area weights
    Em = (E * w).sum((0, 1)) / w.sum()
    fbar = 1 - np.clip(((OCC['ai'].mean(2) / F('ambo', .5)) * w[..., 0]).sum() / w.sum(), 0, 1)
    a = srgb(V3('inside', '238,222,207'))            # (the uncalibrated inside: the bounce does not chase the calibration)
    return Em / (1 - np.clip(a * fbar, 0, .9))


def grid_lookup(Gr, phi, h, nphi, nh):
    x = ((np.mod(phi + math.pi, 2 * math.pi)) / (2 * math.pi) * nphi).astype(np.float32)
    y = (h / 30 * (nh - 1)).astype(np.float32)
    Gp = np.concatenate([Gr, Gr[:, :2]], 1)                    # wrap round
    return B.remap1(Gp, x, y, cv2.BORDER_REPLICATE).reshape(x.shape + Gr.shape[2:])


# ---------------------------------------------------------------- paint
srgb = lambda c: (np.asarray(c, float) / 255) ** 2.2
CREAM = V3('cream', '239,236,217')            # ivory glaze, a breath of green-yellow
CREAML = V3('creaml', '230,234,203')          # greener towards the foot
FOOT = V3('footc', '214,224,176')             # the foot ring, pale green
MAUVE = V3('mauve', '160,101,112')            # the lips' brown-pink mauve
DMAUVE = V3('dmauve', '128,76,90')            # the butterfly's dark parts
INSIDE = V3('inside', '238,222,207')          # the inside, beige-pink
BM = None
SLITD = None                                  # distance into the wall from the slit's lips (cm), on a (u, h) raster
SL_U0, SL_H0, SL_RES = -9.0, 0.0, 50


def slit_distance():
    nu, nh = int(18 * SL_RES) + 1, int(30 * SL_RES) + 1
    U, Hh = np.meshgrid(SL_U0 + np.arange(nu) / SL_RES, SL_H0 + np.arange(nh) / SL_RES)
    phi = U / G.R(Hh)
    hs = np.maximum(Hh, G.HV)
    op = (Hh > G.HV) & (phi > G.phiL(hs)) & (phi < G.phiR(hs)) & (Hh < max(G.HL_TOP, G.HR_TOP) + .5)
    d = cv2.distanceTransform((~op).astype(np.uint8), cv2.DIST_L2, 5) / SL_RES
    return d.astype(np.float32)


def lookup_uh(M, u, h, u0, h0, res):
    x = ((np.asarray(u) - u0) * res).astype(np.float32)
    y = ((np.asarray(h) - h0) * res).astype(np.float32)
    return B.remap1(M, x, y, cv2.BORDER_REPLICATE).reshape(x.shape)


def relief_light():
    """the butterfly's own light: cast shadows of the relief (key light, in the belly's tangent frame) and a cavity term"""
    Hm = BM['H']
    lu, lh, ln = Lloc[0], Lloc[1], Lloc[2]
    d = np.array([lu, -lh]); d /= np.hypot(*d)                 # raster direction towards the light (rows go down in h)
    slope = ln / math.hypot(lu, lh)
    sh = np.zeros_like(Hm)
    Hpx = Hm * B.BRES
    for t in range(1, 40):
        Ht = cv2.warpAffine(Hpx, np.float32([[1, 0, d[0] * t], [0, 1, d[1] * t]]), (Hm.shape[1], Hm.shape[0]),
                            flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        occ = Ht - (Hpx + t * slope)
        sh = np.maximum(sh, occ / (1.5 + .3 * t))
    sh = cv2.GaussianBlur(np.clip(sh, 0, 1), (0, 0), F('rsb', 2.0))
    cav = cv2.GaussianBlur(Hm, (0, 0), .12 * B.BRES) - Hm
    ao = np.clip(1 - F('cavk', 4.0) * np.maximum(cav, 0), .6, 1)
    return (1 - F('rshk', .7) * sh).astype(np.float32), ao.astype(np.float32)


# classes of paint (one clip region each in the SVG)
C_GLAZE, C_FOOT, C_WING, C_DARK, C_IN = 0, 1, 2, 3, 5


TMAUVE, TCREAM = MAUVE.copy(), CREAM.copy()     # the crosiers' two paints
PALE = V3('pale', '246,238,236')              # the wings' pale parts: the white cells, the melt of the orange
ORANGE = V3('orange', '240,128,92')           # salmon-orange, vivid at the roots
ORANGE1 = V3('orange1', '242,168,134')        # paler towards the margins
TAILC = V3('tailc', '244,226,224')
VEINC = V3('veinc', '196,104,92')
CALF = os.path.join(HERE, 'calib.json')
CAL = json.load(open(CALF)) if os.path.exists(CALF) and not OPT.get('nocal') else {}


def cal(c, pid):
    m = np.array(CAL.get(str(pid), [1, 1, 1]), float)
    return 255 * np.clip(((np.asarray(c, float) / 255) ** 2.2) * m, 0, 1) ** (1 / 2.2)


CREAM, CREAML, MAUVE, INSIDE, FOOT, ORANGE, ORANGE1 = cal(CREAM, 0), cal(CREAML, 0), cal(MAUVE, 1), cal(INSIDE, 2), cal(FOOT, 3), cal(ORANGE, 4), cal(ORANGE1, 4)
DMAUVE, PALE, TAILC, TMAUVE, TCREAM = cal(DMAUVE, 5), cal(PALE, 6), cal(TAILC, 7), cal(TMAUVE, 8), cal(TCREAM, 9)
RIMW = None                                   # width of the lips' mauve band on the outer glaze, by height (left, right)


def rim_widths():
    """how far the mauve of each lip reaches on the outer glaze (cm of arc), measured row by row on the neck"""
    rr = np.array(G.TR['rim_rows'], float)
    rr = rr[(rr[:, 1] > 0) & (rr[:, 2] > 0)]
    pl, hl = G.from_photo_outer(rr[:, 1], rr[:, 0])
    pr, hr = G.from_photo_outer(rr[:, 2], rr[:, 0])
    wl = np.abs(pl * G.R(hl) - G.UL(hl)); wr = np.abs(pr * G.R(hr) - G.UR(hr))
    from scipy.ndimage import gaussian_filter1d as g1
    return (np.sort(hl), g1(wl[np.argsort(hl)], 4)), (np.sort(hr), g1(wr[np.argsort(hr)], 4))


def paint_outer(phi, h, u, Hb):
    """albedo (sRGB 0-255) and class of points of the outer glaze"""
    n = len(h)
    lowk = s3(3.8, .9, h)[:, None]
    alb = CREAM * (1 - lowk) + CREAML * lowk
    cls = np.full(n, C_GLAZE, np.int8)
    foot = h < .62
    alb[foot] = FOOT; cls[foot] = C_FOOT
    # the lips' mauve on the neck (measured width), fading on the glaze
    (hl, wl), (hr, wr) = RIMW
    dl = np.abs(u - G.UL(np.maximum(h, G.HV))); dr = np.abs(u - G.UR(np.maximum(h, G.HV)))
    wL = np.interp(h, hl, wl); wR = np.interp(h, hr, wr)
    rim = np.maximum(s3(wL + .12, wL - .06, dl), s3(wR + .12, wR - .06, dr)) * s3(G.HV + 6.5, G.HV + 8.5, h)
    win = B.inwin(u, h)
    wg = np.zeros(n, np.float32); wm = np.zeros(n, np.float32); wo = np.zeros(n, np.float32)
    wt = np.zeros(n, np.float32); wv = np.zeros(n, np.float32)
    if win.any():
        uu, hh = u[win], h[win]
        wg[win] = B.sample(BM['wing'], uu, hh); wm[win] = B.sample(BM['mauve'], uu, hh)
        wo[win] = B.sample(BM['orange'], uu, hh); wt[win] = B.sample(BM['tails'], uu, hh)
        wv[win] = B.sample(BM['veins'], uu, hh)
    # the orange: vivid at the roots (near the thorax), paler outwards
    rr = np.clip(np.hypot(u + .2, (h - 7.4) * .8) / F('orr', 3.6), 0, 1)[:, None]
    org = ORANGE * (1 - rr) + ORANGE1 * rr
    a = alb * (1 - wg[:, None]) + PALE * wg[:, None]
    a = a * (1 - wo[:, None]) + org * wo[:, None]
    a = a * (1 - (wv * wo)[:, None]) + VEINC * (wv * wo)[:, None]
    a = a * (1 - wm[:, None]) + DMAUVE * wm[:, None]
    a = a * (1 - wt[:, None]) + TAILC * wt[:, None]
    a = a * (1 - (rim * (1 - wg))[:, None]) + MAUVE * (rim * (1 - wg))[:, None]
    c = np.where(wm > .5, C_DARK, np.where((wg > .5) | (wt > .5), C_WING, cls)).astype(np.int8)
    pid = np.where(wm > .5, 5, np.where(wo > .5, 4, np.where(wt > .5, 7, np.where(wg > .5, 6, np.where(foot, 3, np.where(rim > .5, 1, 0))))))
    return a, (c + 8 * pid).astype(np.int8)


# ---------------------------------------------------------------- lighting of a batch of points
KA, KK = (F('ka', .78), F('kk', .62)) if PROJ == 'shop' else (F('ka', .6), F('kk', .95))
F0 = F('f0', .045)


def sh9(n):
    """real spherical harmonics up to order 2 (world normals)"""
    x, y, z = n[:, 0], n[:, 1], n[:, 2]
    return np.stack([np.full_like(x, .282), .489 * y, .489 * z, .489 * x, 1.093 * x * y, 1.093 * y * z,
                     .315 * (3 * z * z - 1), 1.093 * x * z, .546 * (x * x - y * y)], 1)


def _amb0_table():
    """sky light seen by an unoccluded surface, by the height of its normal (to turn amb into an occlusion fraction)"""
    d = fib_dirs(256)
    out = []
    for ny in np.linspace(-1, 1, 41):
        n = nrm(np.array([[math.sqrt(max(0, 1 - ny * ny)), ny, 0.]]))
        u, v = basis(n)
        D = d[:, :1] * u + d[:, 1:2] * v + d[:, 2:3] * n
        out.append(sky(D).mean(0).mean())
    return np.linspace(-1, 1, 41), np.array(out)


AMB0 = None
SHF = os.path.join(HERE, 'light_photo.json')
SHC = json.load(open(SHF)) if PROJ == 'photo' and os.path.exists(SHF) and not OPT.get('nosh') else None
LASTAUX = None


def shade(Pl, Nl, alb, amb, vis, kind, glow=None):
    global AMB0, LASTAUX
    Nw = to_world(Nl)
    ndl = Nw @ L
    w = F('wrap', .25)
    key = np.clip((ndl + w) / (1 + w), 0, 1) ** 1.2 * vis
    ndv = np.clip(Nw @ EYE, 1e-3, 1)
    Fr = F0 + (1 - F0) * (1 - ndv) ** 5
    r = 2 * ndv[:, None] * Nw - EYE
    spec = env(r)
    if kind == 1:
        # inside the vase the mirror sees the vase's own inside (dim), except towards the openings
        sv = np.clip(amb.mean(1) / F('ambo', .55), 0, 1) ** 1.5
        spec = spec * sv[:, None] + (1 - sv[:, None]) * srgb(INSIDE) * .12
    a = srgb(alb)
    if AMB0 is None:
        AMB0 = _amb0_table()
    aof = np.clip(amb.mean(1) / np.interp(Nw[:, 1], *AMB0), 0, 1)
    if SHC is not None and kind != 1:
        # the photograph's light, measured (relight.py): diffuse light as order-2 spherical harmonics times the occlusion,
        # the key light's shadows, and the room's reflections scaled
        c = np.array(SHC['sh'])                    # (9, 3)
        E = aof[:, None] * np.maximum(sh9(Nw) @ c, 0) + key[:, None] * np.array(SHC['key'])
        col = a * E * (1 - Fr[:, None]) + Fr[:, None] * spec * np.array(SHC['spec'])
    else:
        E = KA * amb + KK * key[:, None] * np.array([1, .985, .95])
        if kind == 1:
            # inside the vase the light bounces from wall to wall: each point also receives the light of the lit inner walls
            # it sees (a fraction f of its hemisphere), itself the sum of the bounces (radiosity of a closed cavity)
            f = 1 - np.clip(amb.mean(1) / F('ambo', .5), 0, 1)
            E = E + F('bnc', 1.0) * f[:, None] * ECAV * a
        col = a * E * (1 - Fr[:, None]) + Fr[:, None] * spec
    if glow is not None:                          # thin porcelain lets a little of the back light through
        col += a * glow[:, None] * F('glow', .18) * np.clip(-(Nw @ LB), 0, 1)[:, None] ** .5
    # what the light fit needs (relight.py): normal, occlusion, albedo, Fresnel, reflection, key, kind
    LASTAUX = np.concatenate([Nw, aof[:, None], a, (1 - Fr)[:, None], Fr[:, None] * spec, key[:, None],
                              np.full((len(Nw), 1), float(kind))], 1).astype(np.float32)
    return col


# ---------------------------------------------------------------- the surfaces, as dense points
NPH_O, NPH_I, NH_G = 180, 240, 151
OCC = {}


def outer_pos(phi, h):
    Rr = G.R(h)
    u = phi * Rr
    Hb = np.zeros_like(h)
    win = B.inwin(u, h)
    if win.any():
        Hb[win] = B.sample(BM['H'], u[win], h[win])
    rho = Rr + Hb
    return np.stack([G.AX(h) + rho * np.sin(phi), h, rho * np.cos(phi)], 1), u, Hb


def rows_phi(h, lo, hi, rad):
    """per row h: azimuths from lo to hi (local radians) at the sample spacing for a radius rad(h)"""
    PH, HH = [], []
    for hv in h:
        d = SP / max(rad(hv), .2)
        p = np.arange(lo, hi, d)
        PH.append(p); HH.append(np.full(p.size, hv))
    return np.concatenate(PH), np.concatenate(HH)


def gen_outer():
    hs = np.arange(.0, G.HL_TOP + .6, SP)
    lo, hi = math.radians(-100) - YAW, math.radians(100) - YAW
    for k in range(0, len(hs), 250):
        phi, h = rows_phi(hs[k:k + 250], lo, hi, lambda v: G.R(v) + .45)
        ok = G.wall_exists(phi, h)
        phi, h = phi[ok], h[ok]
        if not len(h):
            continue
        P, u, Hb = outer_pos(phi, h)
        e = 1.2 * SP
        Pu = outer_pos(phi + e / G.R(h), h)[0] - outer_pos(phi - e / G.R(h), h)[0]
        Ph = outer_pos(phi, h + e)[0] - outer_pos(phi, h - e)[0]
        N = nrm(np.cross(Pu, Ph))
        alb, cls = paint_outer(phi, h, u, Hb)
        amb = grid_lookup(OCC['ao'], phi, h, NPH_O, NH_G)
        vis = grid_lookup(OCC['vo'], phi, h, NPH_O, NH_G)
        win = B.inwin(u, h)
        if win.any():
            vis[win] *= B.sample(RSH, u[win], h[win])
            amb[win] *= B.sample(RAO, u[win], h[win])[:, None]
        col = shade(P, N, alb, amb, vis, 0)
        yield P, col, np.ones(len(h), np.int8), cls


def gen_inner():
    hs = np.arange(G.HFL, G.HL_TOP + .6, SP)
    lo, hi = math.radians(40) - YAW, math.radians(320) - YAW
    for k in range(0, len(hs), 250):
        phi, h = rows_phi(hs[k:k + 250], lo, hi, lambda v: G.R(v) - G.T)
        phi = np.mod(phi + math.pi, 2 * math.pi) - math.pi
        ok = G.wall_exists(phi, h)
        phi, h = phi[ok], h[ok]
        if not len(h):
            continue
        rho = G.R(h) - G.T
        P = np.stack([G.AX(h) + rho * np.sin(phi), h, rho * np.cos(phi)], 1)
        dR = (G.R(h + .01) - G.R(h - .01)) / .02
        N = -nrm(np.stack([np.sin(phi), -dR, np.cos(phi)], 1))
        u = phi * G.R(h)
        dist = lookup_uh(SLITD, u, h, SL_U0, SL_H0, SL_RES)
        rim = s3(F('rimi', .22), .05, dist)
        alb = INSIDE * (1 - rim[:, None]) + MAUVE * rim[:, None]
        amb = grid_lookup(OCC['ai'], phi, h, NPH_I, NH_G)
        vis = grid_lookup(OCC['vi'], phi, h, NPH_I, NH_G)
        col = shade(P, N, alb, amb, vis, 1)
        yield P, col, np.zeros(len(h), np.int8), (C_IN + 8 * np.where(rim > .5, 1, 2)).astype(np.int8)


def edge_curve():
    """centre line of the rolled lips: down the left lip from its top corner, round the V, up the right lip"""
    sq_l = np.linspace(math.sqrt(G.HL_TOP - G.HV), 0, 1600)
    sq_r = np.linspace(0, math.sqrt(G.HR_TOP - G.HV), 1600)[1:]
    hs = np.r_[G.HV + sq_l ** 2, G.HV + sq_r ** 2]
    side = np.r_[-np.ones(sq_l.size), np.ones(sq_r.size)]
    ue = np.where(side < 0, G.UL(hs), G.UR(hs))
    phi = ue / G.R(hs)
    uin = ue - side * .05                         # just inside the wall: the relief there (a wing's costa thickens the lip)
    Hb = np.zeros_like(hs)
    win = B.inwin(uin, hs)
    Hb[win] = B.sample(BM['H'], uin[win], hs[win])
    rho = G.R(hs) - G.T / 2 + Hb / 2
    C = np.stack([G.AX(hs) + rho * np.sin(phi), hs, rho * np.cos(phi)], 1)
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(C, axis=0), axis=1))]
    s = np.arange(0, d[-1], SP)
    C = np.stack([np.interp(s, d, C[:, k]) for k in range(3)], 1)
    Hb = np.interp(s, d, Hb); hs = np.interp(s, d, hs); phi = np.interp(s, d, phi)
    return C, Hb, hs, phi


def tube_frame(C, phi, h):
    t = nrm(np.gradient(C, axis=0))
    dR = (G.R(h + .01) - G.R(h - .01)) / .02
    ns = nrm(np.stack([np.sin(phi), -dR, np.cos(phi)], 1))
    n1 = nrm(ns - (ns * t).sum(1, keepdims=True) * t)
    m = np.cross(t, n1)
    q = C + .12 * m
    qphi = np.arctan2(q[:, 0] - G.AX(q[:, 1]), q[:, 2])
    flip = G.wall_exists(qphi, q[:, 1])
    m[flip] *= -1
    return t, n1, m


def bead_points(C, n1, m, rb, a0=-110, a1=110):
    na = np.maximum(6, np.ceil(math.pi * rb * (a1 - a0) / 180 / SP)).astype(int)
    idx = np.repeat(np.arange(len(C)), na)
    frac = np.concatenate([(np.arange(k) + .5) / k for k in na])
    al = np.radians(a0 + (a1 - a0) * frac)
    D = np.cos(al)[:, None] * m[idx] + np.sin(al)[:, None] * n1[idx]
    return C[idx] + rb[idx, None] * D, D, idx, al


def gen_beads():
    C, Hb, h, phi = edge_curve()
    t, n1, m = tube_frame(C, phi, h)
    rb = G.T / 2 + Hb / 2
    P, N, idx, al = bead_points(C, n1, m, rb)
    hh, pp = h[idx], phi[idx]
    wing = Hb[idx] > .04
    alb = np.where(wing[:, None], DMAUVE, MAUVE) * np.ones((len(idx), 1))
    mix = ((np.sin(al) + 1) / 2)[:, None]
    amb = grid_lookup(OCC['ao'], pp, hh, NPH_O, NH_G) * mix + grid_lookup(OCC['ai'], pp, hh, NPH_I, NH_G) * (1 - mix)
    vis = grid_lookup(OCC['vo'], pp, hh, NPH_O, NH_G) * mix[:, 0] + grid_lookup(OCC['vi'], pp, hh, NPH_I, NH_G) * (1 - mix[:, 0])
    amb = np.maximum(amb, .6 * sky(to_world(N)) * (np.cos(al) > .3)[:, None])
    col = shade(P, N, alb, amb, vis, 0, glow=np.ones(len(idx)))
    yield P, col, np.ones(len(idx), np.int8), (C_GLAZE + 8 * np.where(wing, 5, 1)).astype(np.int8)
    # the back wall's top edge (cream), behind the stems
    psi = np.linspace(0, G._ARC, 3000)
    ph = G.PHL_TOP - psi
    ht = G.htop(ph)
    rho = G.R(ht) - G.T / 2
    Ct = np.stack([G.AX(ht) + rho * np.sin(ph), ht, rho * np.cos(ph)], 1)
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Ct, axis=0), axis=1))]
    s = np.arange(0, d[-1], SP)
    Ct = np.stack([np.interp(s, d, Ct[:, k]) for k in range(3)], 1)
    ph = np.interp(s, d, ph); ht = np.interp(s, d, ht)
    t, n1, m = tube_frame(Ct, ph, ht)
    rb = np.full(len(Ct), G.T / 2)
    P, N, idx, al = bead_points(Ct, n1, m, rb)
    mix = ((np.sin(al) + 1) / 2)[:, None]
    pp, hh = ph[idx], ht[idx]
    amb = grid_lookup(OCC['ao'], pp, hh, NPH_O, NH_G) * mix + grid_lookup(OCC['ai'], pp, hh, NPH_I, NH_G) * (1 - mix)
    amb = np.maximum(amb, .8 * sky(to_world(N)) * (np.cos(al) > .2)[:, None])
    alb = INSIDE * (1 - mix) + CREAM * mix
    col = shade(P, N, alb, amb, np.ones(len(idx)), 0, glow=np.ones(len(idx)))
    yield P, col, np.zeros(len(idx), np.int8), np.full(len(idx), C_IN + 8 * 10, np.int8)


def tendril_curves():
    """the two crosiers, from their traced centre lines (photograph px) and half widths, in the vertical plane of the lip's top
    corner (world depth of the corner), joined smoothly to the lip's bead"""
    C, Hb, h, phi = edge_curve()
    out = []
    for (side, q), c0 in zip(G.crosier_paths(), (C[0], C[-1])):
        zc = to_world(c0[None])[0, 2]
        xw = (q[:, 0] - G.PCX) / G.PK
        yw = (G.PFL - q[:, 1]) / G.PK + zc * G.TEP
        Pw = np.stack([xw, yw, np.full(len(q), zc)], 1)
        # carry the root onto the lip's end, fading over the first centimetre
        cw = to_world(c0[None])[0]
        s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Pw, axis=0), axis=1))]
        Pw = Pw + (cw - Pw[0]) * np.exp(-(s / .7) ** 2)[:, None]
        # even spacing
        ss = np.arange(0, s[-1], SP)
        Pw = np.stack([np.interp(ss, s, Pw[:, k]) for k in range(3)], 1)
        hw = np.interp(ss, s, q[:, 2]) / G.PK
        out.append((side, to_local(Pw), ss, hw, s[-1]))
    return out


def gen_tendrils():
    for side, Pc, s, hw, Lt in tendril_curves():
        Pw = to_world(Pc)
        t = nrm(np.gradient(Pw, axis=0))
        en = np.array([0, 0, 1.])
        nin = nrm(np.cross(en, t))                                         # in the picture plane, across the blade
        # the side towards the centre of the curl
        dt = np.gradient(t, axis=0)
        conc = np.sign(np.sum(dt * nin, 1)); conc[conc == 0] = 1
        conc = np.sign(np.convolve(conc, np.ones(9) / 9, 'same') + 1e-6)
        nin = nin * conc[:, None]
        w = np.maximum(2 * hw, .2)
        dd = np.minimum(w, F('tdep', .34))
        cap = np.sqrt(np.clip(1 - np.clip((s - (Lt - .12)) / .12, 0, 1) ** 2, 0, 1))
        w, dd = w * np.maximum(cap, .05), dd * np.maximum(cap, .05)
        nth = np.maximum(8, np.ceil(math.pi * w / SP * 1.1)).astype(int)
        idx = np.repeat(np.arange(len(Pw)), nth)
        th = np.concatenate([np.arange(k) / k * 2 * math.pi for k in nth])
        ct, st = np.cos(th), np.sin(th)
        P = Pw[idx] + (w[idx] / 2 * ct)[:, None] * nin[idx] + (dd[idx] / 2 * st)[:, None] * en
        N = nrm((ct / (w[idx] / 2))[:, None] * nin[idx] + (st / (dd[idx] / 2))[:, None] * en)
        ss = s[idx]
        mv = np.maximum(s3(-.55, .15, ct), np.maximum(s3(Lt - 2.2, Lt - 1.2, ss), s3(.8, .2, ss)))
        alb = TCREAM * (1 - mv[:, None]) + TMAUVE * mv[:, None]
        amb = sky(N) * .95
        Pl, Nl = to_local(P), to_local(N)
        col = shade(Pl, Nl, alb, amb, np.ones(len(idx)), 0, glow=np.ones(len(idx)))
        yield Pl, col, np.zeros(len(idx), np.int8), (C_GLAZE + 8 * np.where(mv > .5, 8, 9)).astype(np.int8)


# ---------------------------------------------------------------- splatting
def project(Pl):
    Pw = to_world(Pl)
    X, Y = OUT(Pw[:, 0], Pw[:, 1] - Pw[:, 2] * TE)
    return np.asarray(X), np.asarray(Y), Pw @ EYE


class Buf:
    def __init__(self, x0, y0, W, H):
        self.x0, self.y0, self.W, self.H = x0, y0, W, H
        n = W * H * SS * SS
        self.z = np.full(n, -np.inf, np.float32)
        self.c = np.zeros((n, 3), np.float32)
        self.lay = np.full(n, -1, np.int8)
        self.cls = np.full(n, -1, np.int8)
        self.aux = np.zeros((n, 13), np.float32) if OPT.get('aux') else None

    def splat(self, Pl, col, lay, cls, aux=None):
        X, Y, d = project(Pl)
        ix = np.floor((X - self.x0) * RES * SS).astype(np.int64)
        iy = np.floor((Y - self.y0) * RES * SS).astype(np.int64)
        ok = (ix >= 0) & (iy >= 0) & (ix < self.W * SS) & (iy < self.H * SS)
        ix, iy, d, col, lay, cls = ix[ok], iy[ok], d[ok], col[ok], lay[ok], cls[ok]
        aux = aux[ok] if aux is not None else None
        k = iy * self.W * SS + ix
        o = np.argsort(d, kind='stable')
        k, d, col, lay, cls = k[o], d[o], col[o], lay[o], cls[o]
        front = d > self.z[k]
        k, d, col, lay, cls = k[front], d[front], col[front], lay[front], cls[front]
        self.z[k] = d; self.c[k] = col; self.lay[k] = lay; self.cls[k] = cls
        if self.aux is not None and aux is not None:
            self.aux[k] = aux[o][front]

    def finish(self):
        """fill pin holes, then average the sub-pixels: display colour, layer and paint class by majority"""
        W, H = self.W * SS, self.H * SS
        z = self.z.reshape(H, W); c = self.c.reshape(H, W, 3); lay = self.lay.reshape(H, W); cls = self.cls.reshape(H, W)
        cov = np.isfinite(z)
        for _ in range(3):
            hole = cv2.morphologyEx(cov.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool) & ~cov
            if not hole.any():
                break
            for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                src = np.roll(np.roll(cov, dy, 0), dx, 1)
                f = hole & src
                if f.any():
                    c[f] = np.roll(np.roll(c, dy, 0), dx, 1)[f]
                    lay[f] = np.roll(np.roll(lay, dy, 0), dx, 1)[f]
                    cls[f] = np.roll(np.roll(cls, dy, 0), dx, 1)[f]
                    cov = cov | f; hole &= ~f
        kn = F('knee', .8)
        cd = np.where(c > kn, kn + (1 - kn) * (1 - np.exp(-(c - kn) / (1 - kn))), c)
        cd = 255 * np.clip(cd, 0, 1) ** (1 / 2.2)
        h2, w2 = self.H, self.W
        cnt = cov.reshape(h2, SS, w2, SS).sum((1, 3))
        covf = cnt / (SS * SS)
        disp = (cd * cov[..., None]).reshape(h2, SS, w2, SS, 3).sum((1, 3)) / np.maximum(cnt, 1)[..., None]
        pidm = np.where(cov, cls.astype(np.int16) >> 3, -1)[::SS, ::SS]
        cls = cls & 7
        code = np.where(cov, lay.astype(np.int16) * 8 + cls, -1)
        codes = [cc for cc in np.unique(code) if cc >= 0]
        cc_ = np.stack([(code == cc).reshape(h2, SS, w2, SS).sum((1, 3)) for cc in codes], -1)
        best = np.array(codes)[np.argmax(cc_, -1)]
        best = np.where(covf > 0, best, -1)
        return disp.astype(np.float32), covf.astype(np.float32), best, pidm


def bounds():
    xs, ys = [], []
    hh = np.linspace(0, G.HL_TOP, 300)
    rm = G.R(hh) + .5
    for sgn in (-1, 1):
        X, Y, _ = project(np.stack([G.AX(hh) + sgn * rm, hh, 0 * hh], 1)); xs += list(X); ys += list(Y)
    X, Y, _ = project(np.stack([0 * hh, hh * 0 - .1, rm.max() * np.ones_like(hh)], 1)); ys += list(Y)
    for side, P, s, hw, Lt in tendril_curves():
        X, Y, _ = project(P); xs += list(X); ys += list(Y)
    m = 1.0 * UNIT
    return min(xs) - m, min(ys) - m, max(xs) + m, max(ys) + m


def build():
    global BM, SLITD, RSH, RAO
    global RIMW
    BM = B.maps()
    RIMW = rim_widths()
    SLITD = slit_distance()
    RSH, RAO = relief_light()
    t = time.time()
    OCC['ao'], OCC['vo'] = occl_grid(0, NPH_O, NH_G)
    OCC['ai'], OCC['vi'] = occl_grid(1, NPH_I, NH_G)
    print('occlusion %.1fs' % (time.time() - t))
    global ECAV
    ECAV = cavity_light()
    if FRAME:
        x0, y0, W, H = 0, 0, int(FRAME[0] * RES), int(FRAME[1] * RES)
    else:
        x0, y0, x1, y1 = bounds()
        W, H = int(math.ceil((x1 - x0) * RES)), int(math.ceil((y1 - y0) * RES))
    Bf = Buf(x0, y0, W, H)
    npts = 0
    for gen in (gen_inner, gen_outer, gen_beads, gen_tendrils):
        for P, col, lay, cls in gen():
            Bf.splat(P, col, lay, cls, LASTAUX); npts += len(P)
    print('splatted %d points %.1fs' % (npts, time.time() - t00))
    if Bf.aux is not None:                       # the light fit's inputs, one sub-pixel per pixel
        np.save(os.path.join(OUTD, 'aux_%s.npy' % PROJ), Bf.aux.reshape(Bf.H * SS, Bf.W * SS, 13)[::SS, ::SS])
    disp, cov, code, pid = Bf.finish()
    return disp, cov, code, pid, (x0, y0)


def save_field(disp, cov, code, pid, org):
    bg = V3('bg', '238,235,229')
    pv = disp * cov[..., None] + bg * (1 - cov[..., None])
    cv2.imwrite(os.path.join(OUTD, 'field_%s.png' % PROJ), np.clip(pv, 0, 255)[:, :, ::-1].astype(np.uint8))
    # with its alpha (the coverage), for the measured comparison (mesure.py reads the silhouette from it)
    rgba = np.dstack([np.clip(disp, 0, 255)[:, :, ::-1], 255 * np.clip(cov, 0, 1)]).astype(np.uint8)
    cv2.imwrite(os.path.join(OUTD, 'field_%s_a.png' % PROJ), rgba)
    np.savez_compressed(os.path.join(OUTD, 'field_%s.npz' % PROJ), disp=disp, cov=cov, code=code, pid=pid, org=np.array(org), res=RES)


if __name__ == '__main__' and MODE == 'prev':
    d, c, k, p, o = build()
    save_field(d, c, k, p, o)
    print('done %.1fs' % (time.time() - t00))


# ---------------------------------------------------------------- SVG
def write_svgs(disp, cov, code, pid, org):
    import svgout
    unit_scale = 1 if PROJ == 'shop' else UNIT / K.UPC
    q = .2 if PROJ == 'shop' else .5
    defs, back, body, inner, cavb, nb = svgout.emit(disp, cov, code, pid, org, RES, unit_scale, q=q, dy=F('dy', 7), step=F('step', 2.2),
                                                    blur=F('blur', .45), amin=F('amin', 4))
    if PROJ == 'photo':
        # a saturated green backdrop (no vase colour is near it): the measuring tool separates the silhouette without doubt
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 736 981"><defs>%s</defs><rect width="736" height="981" '
               'fill="%s"/>%s%s</svg>' % (defs, OPT.get('pbg', '#00b400'), back, body))
        open(os.path.join(OUTD, 'papillon_photo.svg'), 'w').write(svg)
        print('photo svg %d bytes, %d bands, %.1fs' % (len(svg), nb, time.time() - t00))
        return
    x0, y0 = org
    h_, w_ = cov.shape
    vb = '%g %g %g %g' % (math.floor(x0), math.floor(y0), math.ceil(w_ / RES) + 1, math.ceil(h_ / RES) + 1)
    # the mouth: the funnel's top, where the stems go in
    hm = float(G.htop(math.pi))
    hm = min(hm, G.HR_TOP)
    mxw = float(G.AX(hm)) * cy_
    mh = hm * K.UPC
    mo = float(G.R(hm)) * .8 * K.UPC
    mx, my = K.VX + mxw * K.UPC, K.FL - mh
    stems_in, stems_up = '', ''
    for dx, c in ((-.55, '#4f7a36'), (0, '#5f8a3e'), (.5, '#3f6a2e')):
        xa = mx + dx * mo
        stems_in += '<path d="M%s %sQ%s %s %s %s" stroke="%s" stroke-width="3" fill="none"/>' % (
            K.fmt(xa), K.fmt(my - 80), K.fmt(xa), K.fmt(my + 60), K.fmt(xa + dx * 4), K.fmt(cavb), c)
        stems_up += '<path d="M%s %sL%s %s" stroke="%s" stroke-width="3"/>' % (K.fmt(xa), K.fmt(my - 90), K.fmt(xa), K.fmt(my), c)
    bgc = K.hexc(V3('bg', '238,235,229'))
    for name, extra in (('shop', ''), ('shop_stems', '<g clip-path="url(#pin)">%s</g>%s' % (stems_in, stems_up))):
        for bgn, bgv in (('', bgc), ('_dark', '#2b2a28')):
            svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s<clipPath id="pin"><path d="%s"/></clipPath></defs>'
                   '<rect x="0" y="0" width="1000" height="1100" fill="%s"/>%s%s%s</svg>' % (vb, defs, inner, bgv, back, extra, body))
            open(os.path.join(OUTD, 'papillon_%s%s.svg' % (name, bgn)), 'w').write(svg)
    K.write_body(os.path.join(OUTD, 'body.json'), defs, body, back=back, inner=inner, cavb=cavb)
    bj = json.load(open(os.path.join(OUTD, 'body.json'), encoding='utf-8'))
    bj['clear'] = True                       # opaque porcelain: the stems in the slit are seen as they are, not frosted
    bj['own'] = True                         # the vessel draws its own lips and inside
    json.dump(bj, open(os.path.join(OUTD, 'body.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    # the catalogue entry
    m = (cov > .5).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)[:, 0, :].astype(float)
    c = cv2.approxPolyDP(c.astype(np.float32).reshape(-1, 1, 2), 1.2, True)[:, 0, :]
    pts = [[round(float(x0 + (x + .5) / RES - K.VX), 1), round(float(K.FL - (y0 + (y + .5) / RES)), 1)] for x, y in c]
    ys = [p[1] for p in pts]; xs = [p[0] for p in pts]
    fiche = {"id": "papillon-rose", "refs": ["026"], "n": "Papillon rose à deux crosses", "m": "porcelaine émaillée, ivoire et mauve",
             "fam": "vase", "shape": "outline", "p": 0, "mat": "gloss", "fin": "", "col": "#ece8d4", "col2": "#a8737a",
             "lip": "plain", "lipw": round(G.T * K.UPC, 1),
             "why": "Une goutte de porcelaine ivoire ouverte sur le devant par une longue fente, dont les deux lèvres mauves montent "
                    "en crosses ; au bas de la fente, un papillon porte-queue aux ailes saumon et résille blanche.",
             "ol": {"pts": pts, "mouth": [round(mxw * K.UPC - mo, 1), round(mxw * K.UPC + mo, 1), round(mh, 1)],
                    "d": round(2 * float(G.R(8)) * K.UPC, 1)},
             "h": round(max(ys), 1), "mo": round(mo, 1), "mx": round(mxw * K.UPC, 1), "mh": round(mh, 1), "svgb": "papillon-rose",
             "cm": {"h": round(max(ys) / K.UPC, 1), "w": round((max(xs) - min(xs)) / K.UPC, 1), "d": round(2 * float(G.R(8)), 1)}}
    json.dump(fiche, open(os.path.join(OUTD, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    import gzip
    raw = open(os.path.join(OUTD, 'body.json'), 'rb').read()
    print('body.json %d bytes, gzip %d, %d bands, %.1fs' % (len(raw), len(gzip.compress(raw, 9)), nb, time.time() - t00))


if __name__ == '__main__' and MODE in ('photo', 'shop'):
    d, c, k, p, o = build()
    save_field(d, c, k, p, o)
    write_svgs(d, c, k, p, o)
