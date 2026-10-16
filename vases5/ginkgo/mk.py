# The stoneware vase with glazed ginkgo leaves (vases5/ginkgo, reference 114), recreated: a turned ovoid body of matte sandy
# stoneware standing on its own recessed foot (the wooden stand of the photograph is left out), and our own ginkgo sprigs in
# low relief under a glossy mustard glaze: spur clusters at the neck, long petioles, bilobed fans following the curve of the
# body. The model (profile, leaf height fields) is lit by the shop's light per pixel; only curves leave: tone bands clipped to
# their part and softened by a small blur, crisp highlights, outline strokes, a turbulence grain. No image is embedded.
#   python mk.py [photo|shop] [key=value ...]  ->  out/ginkgo_<proj>.svg (+ out/body.json, out/fiche.json for shop)
import sys, os, math, json, time
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402
from scipy.interpolate import PchipInterpolator  # noqa: E402
from skimage import measure  # noqa: E402

os.chdir(HERE)
PROJ = sys.argv[1] if len(sys.argv) > 1 and '=' not in sys.argv[1] else 'shop'
OPT = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
t0 = time.time()

# ---------------------------------------------------------------- the photograph's camera (measured on the reference)
# nearly orthographic (the rim and the stand ring give the same ellipse ratio, .185), axis leaning 7 px over the height
PH = dict(y_top=150.0, y_floor=673.0, pxcm=20.68, cx0=280.0, cxs=.0143, ry=.185)
# half widths of the silhouette (px) by row, the leaves' relief (about 1.5 px) taken off where they sit on the edge.
# Below y = 645 the wooden stand hides the body, which sits in its recess: the taper of the last measured span is carried
# down to y = 673 (about 1 cm inside the stand), then a rounded heel and a recessed flat base.
SIL = [(150, 96.5), (162, 97.5), (168, 99), (174, 102.5), (180, 105), (186, 110), (192, 114), (198, 116.5), (204, 118.5),
       (210, 120), (228, 123), (246, 124.5), (282, 125), (300, 124.5), (324, 124), (342, 122.5), (360, 121), (384, 118.5),
       (408, 117), (440, 115.2), (470, 112), (500, 108.5), (530, 103.5), (560, 100), (590, 96), (620, 91.5), (638, 87)]
H_CM = (PH['y_floor'] - PH['y_top']) / PH['pxcm']       # 25.3 cm without the stand
WALL = .38                                               # wall thickness at the lip (cm)
LIPR = .12                                               # radius of the rounded outer lip edge
HEEL = .28                                              # radius of the rounded heel above the recessed base


def build_profile():
    hs = [(PH['y_floor'] - y) / PH['pxcm'] for y, _ in SIL]
    rs = [w / PH['pxcm'] for _, w in SIL]
    hs, rs = hs[::-1], rs[::-1]
    # the hidden foot: the taper of the last measured span, carried down to the heel
    sl = (rs[1] - rs[0]) / (hs[1] - hs[0])
    hh = [HEEL + .02, .75] + hs
    # the ovoid keeps closing in below the measured span (its slope grows towards the foot)
    rr = [rs[0] - F('ftap2', 1.7) * sl * (hs[0] - HEEL - .02), rs[0] - F('ftap1', 1.4) * sl * (hs[0] - .75)] + rs
    p = PchipInterpolator(hh, rr)
    h = np.arange(0, H_CM + 1e-6, .01)
    r = p(np.clip(h, hh[0], hh[-1]))
    r = cv2.GaussianBlur(r.reshape(1, -1).astype(np.float64), (0, 0), 6, borderType=cv2.BORDER_REPLICATE).ravel()
    # heel: a quarter round meeting the recessed flat base
    rh = np.interp(HEEL, h, r)
    m = h < HEEL
    r[m] = rh - HEEL + np.sqrt(np.clip(HEEL ** 2 - (HEEL - h[m]) ** 2, 0, None))
    # lip: the outer edge rounded over
    hl = H_CM - LIPR
    rl = np.interp(hl, h, r)
    m = h > hl
    r[m] = rl - LIPR + np.sqrt(np.clip(LIPR ** 2 - (h[m] - hl) ** 2, 0, None))
    return h, r


PH_H, PH_R = build_profile()
_rs = cv2.GaussianBlur(PH_R.reshape(1, -1), (0, 0), 3, borderType=cv2.BORDER_REPLICATE).ravel()
PH_D = np.gradient(_rs, PH_H)                                             # dr/dh
PH_D[PH_H > H_CM - LIPR] = np.gradient(PH_R, PH_H)[PH_H > H_CM - LIPR]    # the lip roll keeps its own slope
PH_D[PH_H < HEEL] = np.gradient(PH_R, PH_H)[PH_H < HEEL]
PH_D = np.clip(PH_D, -8, 8)
PH_M = np.r_[0, np.cumsum(np.sqrt(1 + PH_D[1:] ** 2) * np.diff(PH_H))]      # meridian length from the base
R_TOP = float(PH_R[-1])                       # outer radius of the flat top of the lip
R_IN = float(np.interp(H_CM - LIPR, PH_H, PH_R)) - WALL                    # inner radius of the mouth


def rad(h):
    return np.interp(h, PH_H, PH_R)


def drad(h):
    return np.interp(h, PH_H, PH_D)


def mer(h):
    return np.interp(h, PH_H, PH_M) + np.clip(np.asarray(h, float) - H_CM, 0, None)


def h_of_m(m):
    return np.interp(m, PH_M, PH_H)


# ---------------------------------------------------------------- cameras: object (phi, h, radius) -> drawing units
class Cam:
    def __init__(self, proj):
        self.proj = proj
        if proj == 'photo':
            self.k, self.ry, self.y0 = PH['pxcm'], PH['ry'], PH['y_floor']
            self.vb = (0.0, 0.0, 570.0, 855.0)
            self.P = F('pp', 2.4)                   # field pixels per drawing unit
            self.q = .25
        else:
            self.k, self.ry, self.y0 = K.UPC, K.RY, K.FL
            w, hh = 2 * 6.4, H_CM + .4
            self.vb = (K.VX - (w / 2 + .5) * K.UPC, K.FL - (hh + .3) * K.UPC, (w + 1) * K.UPC, (hh + 1.1) * K.UPC)
            self.P = F('ps', 6.0)
            self.q = .1
        self.a = math.asin(self.ry)
        self.W = int(round(self.vb[2] * self.P)); self.H = int(round(self.vb[3] * self.P))

    def x0(self, y):
        return PH['cx0'] + (y - PH['y_top']) * PH['cxs'] if self.proj == 'photo' else K.VX

    def fwd(self, phi, h, R):
        """object point -> drawing units"""
        y = self.y0 - h * self.k + R * np.cos(phi) * self.ry * self.k
        return self.x0(y) + R * np.sin(phi) * self.k, y

    def field_xy(self, j, i):
        return self.vb[0] + j / self.P, self.vb[1] + i / self.P

    def mapf(self, x, y):
        """field pixels -> drawing units"""
        return (self.vb[0] + x / self.P, self.vb[1] + y / self.P)

    def inverse(self):
        """for every field pixel: phi, h on the front of the body, and the hit mask"""
        jj, ii = np.meshgrid(np.arange(self.W, dtype=np.float64), np.arange(self.H, dtype=np.float64))
        X, Y = self.field_xy(jj, ii)
        u = (X - self.x0(Y)) / self.k
        v = (self.y0 - Y) / self.k
        h = v.copy()
        for _ in range(10):
            R = rad(np.clip(h, 0, H_CM))
            s = np.clip(u / R, -1, 1)
            h = v + R * np.sqrt(1 - s * s) * self.ry
        R = rad(np.clip(h, 0, H_CM))
        hit = (np.abs(u) <= R) & (h >= 0) & (h <= H_CM)
        phi = np.arcsin(np.clip(u / R, -1, 1))
        return phi, np.clip(h, 0, H_CM), hit, u

    def to_screen(self, N):
        """object-frame normals (x right, y up, z to the eye) -> screen frame (y down), the eye ry above"""
        ca, sa = math.cos(self.a), math.sin(self.a)
        return np.stack([N[..., 0], -(N[..., 1] * ca - N[..., 2] * sa), N[..., 1] * sa + N[..., 2] * ca], -1)


def base_frame(phi, h):
    """outward normal N0 and the unit tangents (around, up the meridian) of the turned body, object frame"""
    rp = drad(h)
    sp, cp = np.sin(phi), np.cos(phi)
    N0 = np.stack([sp, -rp, cp], -1); N0 /= np.linalg.norm(N0, axis=-1, keepdims=True)
    Tp = np.stack([cp, np.zeros_like(cp), -sp], -1)
    Tm = np.stack([rp * sp, np.ones_like(sp), rp * cp], -1); Tm /= np.linalg.norm(Tm, axis=-1, keepdims=True)
    return N0, Tp, Tm



# ---------------------------------------------------------------- our ginkgo sprigs (the composition is ours, not the photograph's)
# Ginkgo biloba: leaves in clusters of 3-5 at the tip of short woody spur shoots; a fan-shaped blade on a long slender petiole,
# wedge-shaped base, the outer margin wavy and irregularly notched, split in two lobes by a central notch of varying depth,
# fine dichotomous veins running parallel from the base to the margin. Spurs sit around the neck; leaves fall over the shoulder.
# Petioles spring straight from under the lip (no visible shoot), as clusters of leaves do from a hidden spur. Few, large
# leaves in uneven masses: dense at the top left, open on the right; some run round the body past both edges, a few spill up
# to the lip, and one long slender stem curves down to the middle of the belly with a single leaf.
# cluster: (phi deg, h cm of the point where the petioles start, None: no spur drawn)
# cluster origins sit just over the lip: the stems come into view from the rim, their start hidden, as on the reference
CLUSTERS = [(-60, 25.6, None), (-12, 25.6, None), (38, 25.6, None), (88, 25.6, None), (-112, 25.6, None), (130, 25.6, None),
            (-30, 25.85, None), (63, 25.8, None)]
TWIG = []
# leaf: cluster, petiole length, petiole direction (deg from straight down, + towards +phi), bend along the petiole (deg),
#       blade radius, half fan angle (deg), notch depth, blade twist (deg), lobe asymmetry, seed.  Listed bottom to top.
#       No two leaves share their size or their angle.
LEAVES = [
    (4, 2.4, 30, -10, 3.3, 72, .24, 4, .05, 91),
    (5, 1.8, -40, 12, 3.65, 74, .24, -4, .06, 98),
    (3, 1.2, -20, 10, 3.7, 72, .26, 8, -.05, 97),
    (2, 6.6, 34, -30, 2.85, 66, .34, 6, .05, 99),
    (3, 1.0, 62, -14, 2.6, 62, .36, 10, .06, 100),
    (0, 5.4, 4, -4, 3.1, 70, .30, -8, .06, 92),
    (1, 11.6, 44, -58, 3.0, 70, .30, 8, .05, 95),
    (2, 1.7, 10, -6, 3.9, 76, .20, -6, .05, 96),
    (0, 1.6, 25, -10, 3.55, 75, .22, 12, .05, 93),
    (1, .9, 16, -6, 3.35, 74, .26, 6, -.05, 101),
    (1, 1.4, -35, 14, 4.05, 78, .18, -8, -.04, 94),
    (7, .15, -6, 0, 3.15, 70, .30, 4, -.05, 112, 'lip'),     # two leaves laid over the lip, covering its edge and top
    (6, .15, 8, 0, 3.6, 76, .24, -3, .04, 111, 'lip'),
]
TW_O = (0.0, 24.1)                  # frame of the branch
RES = .008                          # cm per pixel of the leaves' own rasters
T_LEAF = .13                        # thickness of a leaf's relief (cm)


def leaf_geom(L):
    """outline of the blade (polygon), petiole centre line and the vein polylines, in the cluster frame (s right, d down, cm)"""
    ci, Lp, dr, bend, R0, Psi, notch, twist, asym, seed = L
    R0 *= F('lscale', 1.0)
    rng = np.random.default_rng(seed)
    n = 60
    tt = np.linspace(0, 1, n)
    wig = rng.uniform(5, 11) * np.sin(math.pi * (1.6 * tt + rng.uniform(0, 1))) * (1 - .5 * tt)
    if Lp > 6:                          # a long stem: a supple S, not a straight drop
        wig = F('lsS', 20) * np.sin(2 * math.pi * tt)
    th = np.radians(dr + bend * tt + wig)
    ds = Lp / (n - 1)
    pet = np.zeros((n, 2))
    for k in range(1, n):
        a = .5 * (th[k - 1] + th[k])
        pet[k] = pet[k - 1] + ds * np.array([math.sin(a), math.cos(a)])
    base = pet[-1]
    ax = th[-1] + math.radians(twist)
    # the wedge of the reference: narrow and pointed at the petiole, straight sides opening 90-120 deg, a broad outer edge
    # barely bowed, a clear central notch and a few small nicks (measured on four sharp leaves of the photograph:
    # opening 95-115 deg, width / height 1.4-1.7, notch 30-45 % of the height)
    Psi = F('psi0', 44) + (Psi - 58) * F('psik', .7)
    notch = .2 + notch * .6
    Ps = math.radians(Psi)
    psi = np.linspace(-Ps, Ps, 241)
    a_ = np.abs(psi) / Ps
    Rr = R0 * (1 + asym * np.sign(psi)) / np.cos(psi) ** F('flat', .4)
    corner = np.where(a_ > .82, 1 - .16 * np.clip((a_ - .82) / .18, 0, 1) ** 2, 1)
    wn = math.radians(4 + 6 * notch)
    nt = 1 - notch * np.clip(1 - np.abs(psi) / wn, 0, 1) ** 1.2
    inc = np.ones_like(psi)
    for side in (-1, 1):
        for _ in range(rng.integers(1, 3)):
            c = side * rng.uniform(.3, .8) * Ps
            w = math.radians(rng.uniform(1.4, 2.4))
            inc *= 1 - rng.uniform(.05, .12) * np.clip(1 - np.abs(psi - c) / w, 0, 1) ** 1.2
    ph1, ph2 = rng.uniform(0, 6.3, 2)
    wave = 1 + .012 * np.sin(psi * 19 + ph1) + .006 * np.sin(psi * 37 + ph2)
    R = Rr * corner * nt * inc * wave
    dirs = lambda p: np.stack([np.sin(ax + p), np.cos(ax + p)], -1)
    arc = base + R[:, None] * dirs(psi)
    # the sides: nearly straight from the point at the petiole to the corners of the fan
    side_l, side_r = [], []
    for sgn, out in ((-1, side_l), (1, side_r)):
        Rc = R[0] if sgn < 0 else R[-1]
        c0 = base; c2 = base + Rc * dirs(np.array(sgn * Ps))
        c1 = base + .5 * Rc * dirs(np.array(sgn * Ps * .94))
        for t in np.linspace(0, 1, 16):
            out.append((1 - t) ** 2 * c0 + 2 * t * (1 - t) * c1 + t * t * c2)
    poly = np.vstack([np.array(side_l), arc, np.array(side_r)[::-1][1:]])
    # veins: dichotomous, so they appear at different distances from the base, fanning slightly as they run out
    nv = int(round(Psi / 2.5))
    veins = []
    for k in range(nv):
        f = (k + .5) / nv * 2 - 1
        p_end = f * Ps * .93
        if abs(p_end) < wn * .55:
            continue
        lvl = bin(k + 1)[::-1].index('1') if k + 1 else 0                        # forks: 1 vein in 2 starts late, 1 in 4 later...
        r0 = R0 * min(.5, .07 + .11 * (3 - min(lvl, 3)) + rng.uniform(0, .04))
        Re = np.interp(p_end, psi, R) * .94
        if Re - r0 < .3:
            continue
        rho = np.linspace(r0, Re, 7)
        pv = p_end * (.82 + .18 * rho / Re)
        veins.append(base + rho[:, None] * dirs(pv))
    return dict(poly=poly, pet=pet, base=base, ax=ax, R0=R0, Ps=Ps, psi=psi, R=R, veins=veins, seed=seed)


def origin(ci):
    return TW_O if ci == 'twig' else CLUSTERS[ci][:2]


def to_surface(ci, s, d):
    """cluster frame (cm) -> phi, h on the body (the leaf laid on the surface like a decal); past the lip, h runs on
    beyond H_CM as the distance travelled over the top of the rim"""
    ph0, h0 = origin(ci)
    m = mer(h0) - d
    mt = float(mer(H_CM))
    h = h_of_m(m) if m <= mt else H_CM + (m - mt)
    return math.radians(ph0) + s / rad(min(h, H_CM)), h


# ---------------------------------------------------------------- relief fields of one leaf (isotropic raster, cluster frame)
PET_W = .095                        # petiole width (cm)


def sm(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def petiole_poly(c, w0=PET_W):
    """closed outline of a petiole around its centre line, rounded at the spur end"""
    t = np.gradient(c, axis=0); t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-9
    nrm = np.stack([-t[:, 1], t[:, 0]], 1)
    w = w0 / 2 * np.linspace(1.15, .85, len(c))
    left, right = c + nrm * w[:, None], c - nrm * w[:, None]
    a0 = math.atan2(nrm[0, 1], nrm[0, 0])
    cap = np.array([c[0] + w[0] * np.array([math.cos(a0 + k), math.sin(a0 + k)]) for k in np.linspace(0, math.pi, 9)])
    return np.vstack([left[::-1], cap[1:-1], right])


def spur_poly(tilt=0.0):
    """the woody spur shoot the cluster springs from: a short stubby capsule from the branch down to where the petioles meet"""
    a, b, w = np.array([0., -.36]), np.array([0., .03]), .29
    pts = [a + w / 2 * np.array([math.cos(t), math.sin(t)]) for t in np.linspace(math.pi, 2 * math.pi, 10)]
    pts += [b + w / 2 * .9 * np.array([math.cos(t), math.sin(t)]) for t in np.linspace(0, math.pi, 10)]
    c, s = math.cos(math.radians(tilt)), math.sin(math.radians(tilt))
    return np.array(pts) @ np.array([[c, s], [-s, c]])


def twig_geom():
    """the long shoot in its own frame (TW_O): centre line through TWIG (Catmull-Rom), half widths tapering to the tip, bud"""
    P = np.array([[math.radians(p), h] for p, h in TWIG])
    P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    pts = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, 24, endpoint=False):
            pts.append(.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    pts.append(P[-2])
    pts = np.array(pts)
    s = pts[:, 0] * rad(pts[:, 1]); d = mer(TW_O[1]) - mer(pts[:, 1])
    cl = np.stack([s, d], 1)
    u = np.linspace(0, 1, len(cl))
    hw = .085 - .035 * sm(.8, 1, u) + .012 * np.sin(u * 37)
    bud = cl[-1] + .08 * (cl[-1] - cl[-2]) / np.linalg.norm(cl[-1] - cl[-2])
    return dict(cl=cl, hw=hw, bud=bud)


def twig_polys(g):
    c, hw = g['cl'], g['hw']
    t = np.gradient(c, axis=0); t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-9
    nrm = np.stack([-t[:, 1], t[:, 0]], 1)
    left, right = c + nrm * hw[:, None], c - nrm * hw[:, None]
    a0 = math.atan2(nrm[0, 1], nrm[0, 0])
    cap = np.array([c[0] + hw[0] * np.array([math.cos(a0 + k), math.sin(a0 + k)]) for k in np.linspace(0, math.pi, 9)])
    bud = np.array([g['bud'] + .13 * np.array([math.cos(k), .8 * math.sin(k)]) for k in np.linspace(0, 2 * math.pi, 24, endpoint=False)])
    return [np.vstack([left[::-1], cap[1:-1], right]), bud]


def raster_fields(ob):
    """height (smooth for the diffuse bands, full with the raised margin for the highlights), glaze thickness and mask"""
    kind, g = ob['kind'], ob['g']
    allp = np.vstack(ob['loc'])
    o = allp.min(0) - .2; e = allp.max(0) + .2
    W = int(math.ceil((e[0] - o[0]) / RES)); H = int(math.ceil((e[1] - o[1]) / RES))
    px = lambda p: np.round((np.asarray(p) - o) / RES * 8).astype(np.int32)
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    S_, D_ = o[0] + xs * RES, o[1] + ys * RES
    if kind == 'spur':
        m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [px(ob['loc'][0])], 1, cv2.LINE_8, 3)
        din = cv2.distanceTransform(m, cv2.DIST_L2, 5) * RES
        hw = .145
        gs_ = .12 * np.sqrt(np.clip(1 - (1 - np.clip(din / hw, 0, 1)) ** 2, 0, 1))
        gf_ = gs_
        thick = np.full((H, W), .95, np.float32)
        mask = m.astype(np.float32)
    elif kind == 'twig':
        cl = np.ones((H, W), np.uint8); cv2.polylines(cl, [px(g['cl'])], False, 0, 1, cv2.LINE_8, 3)
        dc = cv2.distanceTransform(cl, cv2.DIST_L2, 5) * RES
        hw = np.interp(S_, g['cl'][:, 0], g['hw'])
        gt = .1 * np.sqrt(np.clip(1 - (dc / hw) ** 2, 0, 1))
        db = np.hypot(S_ - g['bud'][0], (D_ - g['bud'][1]) / .8)
        gbud = .12 * np.sqrt(np.clip(1 - (db / .13) ** 2, 0, 1))
        # leaf scars: small knots along the shoot
        kn = np.zeros_like(gt)
        for sk in np.arange(g['cl'][0, 0] + .7, g['cl'][-1, 0] - .4, 1.15):
            dk = np.interp(sk, g['cl'][:, 0], g['cl'][:, 1])
            kn = np.maximum(kn, .025 * np.exp(-((S_ - sk) ** 2 + (D_ - dk) ** 2) / .006))
        gs_ = np.maximum(gt + kn * (gt > 0), gbud)
        gf_ = gs_
        thick = np.full((H, W), .9, np.float32)
        mask = ((gt > 0) | (gbud > 0)).astype(np.float32)
    else:
        blade = np.zeros((H, W), np.uint8); cv2.fillPoly(blade, [px(g['poly'])], 1, cv2.LINE_8, 3)
        cl = np.ones((H, W), np.uint8); cv2.polylines(cl, [px(g['pet'])], False, 0, 1, cv2.LINE_8, 3)
        dc = cv2.distanceTransform(cl, cv2.DIST_L2, 5) * RES
        hw = PET_W / 2
        petm = (dc <= hw).astype(np.uint8)
        din = cv2.distanceTransform(blade, cv2.DIST_L2, 5) * RES
        b = g['base']
        rho = np.hypot(S_ - b[0], D_ - b[1])
        psi = (np.arctan2(S_ - b[0], D_ - b[1]) - g['ax'] + math.pi) % (2 * math.pi) - math.pi
        pp = 2 * g['Ps'] / F('pleats', 7.5)
        pleat = -np.cos(2 * math.pi * psi / pp)
        wpl = sm(.12, .5, rho / g['R0'])
        pil = cv2.GaussianBlur(blade.astype(np.float32), (0, 0), F('pil', .45) / RES)
        gb = T_LEAF * sm(0, .05, din) + F('dome', .12) * np.clip((pil - .5) * 2, 0, 1) ** .7 + F('pleatk', .026) * pleat * wpl
        gp = .07 * np.sqrt(np.clip(1 - (dc / hw) ** 2, 0, 1))
        ridge = np.exp(-((din - .045) / .032) ** 2) * blade
        # the diffuse bands see the blade's broad form only; the pleats and the raised margin shape the crisp highlights
        gs_ = np.maximum((gb - F('pleatk', .026) * pleat * wpl * (1 - F('pleatd', 0))) * blade, gp)
        gf_ = np.maximum(gb * blade + F('ridgek', .045) * ridge, gp)
        thick = np.where(gp > gb * blade, .22, .68 - F('pleatt', 0) * pleat * wpl + F('baset', .32) * (1 - sm(.0, .6, rho / g['R0']))).astype(np.float32)
        mask = np.maximum(blade, petm).astype(np.float32)
    gs_ = cv2.GaussianBlur(gs_.astype(np.float32), (0, 0), 1.2)
    gf_ = cv2.GaussianBlur(gf_.astype(np.float32), (0, 0), .8)
    a_d, a_s = np.gradient(gs_, RES)
    b_d, b_s = np.gradient(gf_, RES)
    f1 = np.dstack([a_s, a_d, b_s, b_d]).astype(np.float32)
    f2 = np.dstack([thick, cv2.GaussianBlur(mask, (0, 0), .7), gf_]).astype(np.float32)
    return dict(o=o, f1=f1, f2=f2)


# ---------------------------------------------------------------- the shop's light on stoneware and glaze
LV = K.L3.copy()                    # the key light in the screen frame: the shop's, or the photograph's (measured) in 'photo'


def photo_light(cam):
    """the key light of the photograph, measured on the stoneware: azimuth -30 deg (left of the camera), ~25 deg up"""
    az, el = math.radians(F('paz', -35)), math.radians(F('pel', 45))
    Lo = np.array([math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el)])
    return cam.to_screen(Lo)


def light_obj(cam):
    ca, sa = math.cos(cam.a), math.sin(cam.a)
    xs, ys, zs = LV
    return np.array([xs, -ys * ca + zs * sa, ys * sa + zs * ca])


def col3(key, d):
    return np.array([float(v) for v in OPT.get(key, d).split(',')])


def srgb(lin):
    lin = np.clip(lin, 0, 1)
    return 255 * np.where(lin <= .0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - .055)


def stone_shade(ns, h):
    """matte sandy stoneware, measured on the reference (linear light): a warm brown ambient, and a cool key light that
    falls off fast round the body (lit flank ~ (136,117,110), shadow ~ (78,66,54) in the photograph)"""
    dl = ns @ LV
    f = np.clip((dl + F('sw', .25)) / (1 + F('sw', .25)), 0, 1) ** F('sp', 4)
    amb, key = col3('samb3', '.0868,.0554,.0348'), col3('skey3', '.714,.525,.513')
    up = np.clip(-ns[..., 1], 0, 1)
    lin = amb * (1 + F('sup', .25) * up)[..., None] + key * f[..., None]
    lin = lin * (1 - F('sao', .3) * np.exp(-h / 1.1))[..., None]
    return srgb(lin)


def stone_shade_old(ns, h):
    """matte sandy stoneware: wrapped diffuse, a cool sky from above, the warm dark of the floor below, no highlight"""
    dl = ns @ LV
    wrap = np.clip((dl + F('swrap', .18)) / (1 + F('swrap', .18)), 0, 1)
    up = np.clip(-ns[..., 1], 0, 1)
    alb = col3('stone', '160,117,98')
    I = F('samb', .34) + F('sdiff', .74) * wrap
    c = alb * I[..., None]
    c = c + col3('sky', '14,10,9') * (up ** 1.5)[..., None] * F('skyk', 1)
    c = c * (1 - F('sao', .3) * np.exp(-h / 1.1))[..., None]
    # a dull sheen of the sandy surface at grazing angles (no specular point)
    c = c + F('ssheen', 16) * (np.clip(1 - ns[..., 2], 0, 1) ** 3 * wrap)[..., None]
    return np.clip(c, 0, 255)


def glaze_shade(ns, thick):
    """glossy mustard glaze over the relief: pale where thin (crests, petioles), deep where it pools; diffuse light under
    the glass, a soft studio sheen weighted by Fresnel (the crisp highlights are a separate layer)"""
    pale, deep = col3('gpale', '244,228,140'), col3('gdeep', '210,168,64')
    tk = np.clip(thick, 0, 1)[..., None]
    alb = pale * (1 - tk) + deep * tk
    dl = ns @ LV
    lam = np.clip((dl + F('gwrap', .2)) / (1 + F('gwrap', .2)), 0, 1)
    c = alb * (F('gamb', .36) + F('gdiff', .75) * lam)[..., None]
    # a broad soft sheen of the studio on the lit glaze: paler and less saturated where the light falls full on it
    sh = (F('gsheen', .12) * lam ** 2)[..., None]
    c = c * (1 - sh) + 248 * sh
    nz = np.clip(ns[..., 2], 0, 1)
    fr = .04 + .96 * (1 - nz) ** 5
    ry_ = 2 * nz * ns[..., 1]
    env = .35 + .65 * np.clip(-ry_, 0, 1)
    k = (fr * env * F('genv', .9))[..., None]
    c = c * (1 - k) + 245 * k
    return np.clip(c, 0, 255)


def glaze_spec(ns):
    """the studio mirrored by the glaze: the big softbox up on the left (the shop light), a window strip on the left, crisp"""
    nz = np.clip(ns[..., 2], 0, 1)
    R = 2 * nz[..., None] * ns - np.array([0, 0, 1.])
    L = LV
    e1 = np.cross(L, [0, 1., 0]); e1 /= np.linalg.norm(e1)
    e2 = np.cross(L, e1)
    a0, a1, a2 = R @ L, R @ e1, R @ e2
    dlt = F('sedge', .02)
    bw, bh = F('boxw', .09), F('boxh', .45)
    box = (a0 > 0) * sm(bw + dlt, bw - dlt, np.abs(a1)) * sm(bh + dlt, bh - dlt, np.abs(a2))
    strip = sm(-.66, -.71, R[..., 0]) * sm(-.9, -.85, R[..., 0]) * sm(.5, .38, np.abs(R[..., 1] + .05)) * (R[..., 2] > -.2)
    # the pale ceiling panel of the studio, a crisp band seen in every face that turns a little upwards
    ceil = sm(-.52, -.57, R[..., 1]) * sm(-.8, -.74, R[..., 1]) * sm(.45, .38, np.abs(R[..., 0] + .1))
    fr = .6 + .4 * (1 - nz) ** 2
    return np.clip((box + F('strip', .7) * strip + F('ceil', .5) * ceil) * fr, 0, 1)


# ---------------------------------------------------------------- forward mapping of outlines (clipped to the front)
def clip_front(P, lim=math.pi / 2):
    for sgn in (1, -1):
        out, n = [], len(P)
        for k in range(n):
            a, b = P[k - 1], P[k]
            ina, inb = sgn * a[0] <= lim, sgn * b[0] <= lim
            if ina != inb:
                t = (sgn * lim - a[0]) / (b[0] - a[0])
                out.append((sgn * lim, a[1] + t * (b[1] - a[1])))
            if inb:
                out.append(b)
        P = out
        if not P:
            return []
    return P


def surf_poly(ci, pts):
    return [to_surface(ci, s, d) for s, d in pts]


def fwd_ext(cam, p, h, lift, lip=False):
    """a point of a relief: on the outer wall, or (lip leaves) across the top of the rim, inward to its inner edge"""
    if h <= H_CM:
        return cam.fwd(p, h, rad(h) + lift)
    if not lip:
        return cam.fwd(p, H_CM, rad(H_CM) + lift)
    r = max(R_IN + .03, R_TOP + lift - (h - H_CM))
    return cam.fwd(p, H_CM + lift, r)


def screen_poly(cam, sp, lift=T_LEAF * .9, lip=False):
    sp = clip_front(sp)
    if len(sp) < 3:
        return None
    return np.array([fwd_ext(cam, p, h, lift, lip) for p, h in sp])


def closed_path(cam, P, eps):
    P = np.vstack([P, P[:1]])
    r = K.resample(P, .3 if cam.proj == 'shop' else .6)
    if r is None:
        return ''
    return K.cubic_path(r, cam.q / 2, lambda x, y: (x, y), eps)


def open_path(cam, P):
    P = np.round(np.asarray(P) / cam.q) * cam.q
    if len(P) < 2:
        return ''
    if len(P) == 2:
        return 'M' + K.nums(P[0]) + 'L' + K.nums(P[1])
    s = 'M' + K.nums(P[0])
    for i in range(1, len(P) - 1):
        m = (P[i] + P[i + 1]) / 2 if i < len(P) - 2 else P[i + 1]
        s += 'Q' + K.nums(np.r_[P[i], m])
    return s


# ---------------------------------------------------------------- the decor copied from the reference (owner, 2026-10-16)
# The glazed leaves exactly where the photograph has them: their outline (glaze isolated in CIELAB, trace.py), the beads of
# the outlines inside the mass (ridge lines), all carried onto the turned surface through the photograph's camera. Their
# relief is modelled on those measured shapes (thickness, pillowed blade, rounded beads), lit by the shop's light.
DECOR = None


def load_decor():
    global DECOR
    if DECOR is None and os.path.exists('out/decor_maps.npz'):
        z = np.load('out/decor_maps.npz')
        up = int(z['up'])
        g = z['glaze'].astype(np.float32)
        rg = z['ridge'].astype(np.uint8)
        kp = PH['pxcm'] * up                                  # photo pixels (traced) per cm
        inside = (g > .5).astype(np.uint8)
        dout = cv2.distanceTransform(inside, cv2.DIST_L2, 5) / kp               # cm inside the glaze, from its outline
        dr = cv2.distanceTransform((1 - rg).astype(np.uint8), cv2.DIST_L2, 5) / kp   # cm from the nearest inner bead
        pil = cv2.GaussianBlur(inside.astype(np.float32), (0, 0), F('pil', .45) * kp)
        # height (cm): the edge of the poured glaze, a pillowed blade, a rounded bead along every outline (the outer one and
        # those where a leaf lies over another, a little hollow inside each bead where the glaze pools)
        bead = F('beadh', .035)
        Hs_ = (T_LEAF * sm(0, .05, dout) + F('dome', .1) * np.clip((pil - .5) * 2, 0, 1) ** .7
               + bead * np.exp(-((dout - .04) / .03) ** 2) + bead * np.exp(-(dr / .035) ** 2) * (dout > .02)
               - .02 * np.exp(-((dout - .13) / .05) ** 2) - .015 * np.exp(-((dr - .1) / .045) ** 2))
        Hs_ = cv2.GaussianBlur(Hs_.astype(np.float32), (0, 0), 1.0)
        gy, gx = np.gradient(Hs_)
        gx *= kp; gy *= kp                                    # cm of height per cm of photo-plane distance
        # glaze thickness: thin and pale on the crests of the beads, pooled amber just inside them, deeper towards the stalks
        thick = (F('gth', .66) - .5 * np.exp(-((dout - .035) / .028) ** 2) - .45 * np.exp(-(dr / .03) ** 2)
                 + .3 * np.exp(-((dout - .13) / .06) ** 2) + .22 * np.exp(-((dr - .1) / .05) ** 2))
        thick = cv2.GaussianBlur(thick.astype(np.float32), (0, 0), .8)
        if 'tk' in z:                                         # the thickness measured on the reference (pale = thin)
            thick = thick * (1 - F('tkw', .6)) + F('tkw', .6) * F('gth', .66) - F('tkk', .035) * z['tk'].astype(np.float32)
        fl = z['lines'].astype(np.float64)
        lines, cur = [], []
        for p in fl:
            if np.isnan(p[0]):
                if len(cur) > 2:
                    lines.append(np.array(cur))
                cur = []
            else:
                cur.append(p)
        if len(cur) > 2:
            lines.append(np.array(cur))
        # the slopes of the relief on the surface (per cm of arc and of meridian), first from the model
        pc = Cam('photo'); pc.P = up; pc.W, pc.H = g.shape[1], g.shape[0]
        ph2, h2, hit2, _ = pc.inverse()
        Hs = gx * np.cos(ph2); Hm = -gy
        if 'yref' in z and 'nosfs' not in OPT:
            # shape from shading: each leaf tilted so that, under the photograph's measured light, the model gives the
            # lightness measured on the reference (low-passed, glints removed); the tilt is only along the light
            global LV
            keepLV = LV.copy(); LV = photo_light(pc)
            n0, tp, tm = base_frame(ph2, h2)
            N = n0 - Hs[..., None] * tp - Hm[..., None] * tm
            N /= np.linalg.norm(N, axis=-1, keepdims=True)
            ns = pc.to_screen(N)
            lin_ = lambda c: np.where(c / 255 <= .04045, c / 255 / 12.92, ((c / 255 + .055) / 1.055) ** 2.4)
            Yp = lin_(glaze_shade(ns, thick)) @ np.array([.2126, .7152, .0722])
            Yp = cv2.GaussianBlur(Yp.astype(np.float32), (0, 0), 2.5 * up)
            ratio = np.clip(z['yref'].astype(np.float32) / np.maximum(Yp, 1e-3), .35, 2.8)
            w_ = F('gwrap', .2); a_, d_ = F('gamb', .36), F('gdiff', .75)
            dl = np.clip(ns @ LV, -1, 1)
            lam = np.clip((dl + w_) / (1 + w_), 0, 1)
            lam_t = np.clip((ratio * (a_ + d_ * lam) - a_) / d_, 0, 1)
            dl_t = np.clip(lam_t * (1 + w_) - w_, -.6, .995)
            perp = ns - dl[..., None] * LV
            perp /= np.linalg.norm(perp, axis=-1, keepdims=True) + 1e-6
            nt = dl_t[..., None] * LV + np.sqrt(1 - dl_t ** 2)[..., None] * perp
            nt[..., 2] = np.maximum(nt[..., 2], .15)
            # back to the object frame, then to surface slopes
            ca, sa = math.cos(pc.a), math.sin(pc.a)
            No = np.stack([nt[..., 0], -nt[..., 1] * ca + nt[..., 2] * sa, nt[..., 1] * sa + nt[..., 2] * ca], -1)
            nn = np.maximum((No * n0).sum(-1), .2)
            Hs_t = -(No * tp).sum(-1) / nn; Hm_t = -(No * tm).sum(-1) / nn
            wt = (sm(.03, .1, dout) * (g > .5) * hit2 * F('sfs', 1)).astype(np.float32)
            Hs = Hs * (1 - wt) + cv2.GaussianBlur(Hs_t.astype(np.float32), (0, 0), 1) * wt
            Hm = Hm * (1 - wt) + cv2.GaussianBlur(Hm_t.astype(np.float32), (0, 0), 1) * wt
            LV = keepLV
        DECOR = dict(up=up, f=np.dstack([g, Hs, Hm, thick]).astype(np.float32), ridge=rg, lines=lines)
    return DECOR


def decor_layer(cam, phi, h, hit, defs, body, prev, sc):
    D = load_decor()
    pc = Cam('photo')
    X, Y = pc.fwd(phi, h, rad(h))
    up = D['up']
    f = cv2.remap(D['f'], (X * up).astype(np.float32), (Y * up).astype(np.float32), cv2.INTER_LINEAR,
                  borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    gm = f[..., 0] * hit
    m = gm > .5
    if m.sum() < 50:
        return 0
    n0, tp, tm = base_frame(phi, h)
    cp = np.cos(phi)[..., None]
    Hs_ = f[..., 1:2]                                         # slopes of the relief on the surface (per cm of arc,
    Hm_ = f[..., 2:3]                                         # per cm of meridian)
    N = n0 - Hs_ * tp - Hm_ * tm
    ns = cam.to_screen(N / np.linalg.norm(N, axis=-1, keepdims=True))
    col = glaze_shade(ns, f[..., 3])
    spc = glaze_spec(ns) * np.clip(gm, 0, 1)
    prev[m] = col[m] * (1 - spc[m, None] * .9) + 255 * spc[m, None] * .9
    od = mask_path(cam, gm, F('lfit', .05) * sc, sig=.5)
    defs.append('<clipPath id="cg"><path d="%s"/></clipPath>' % od)
    K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('lrdp', .9), 0, 0
    bb = K.bands(col, m, cam.mapf, cam.q, F('lstep', 4.5) * cam.P / 6, dy=F('ldy', 9))
    g_ = '<g clip-path="url(#cg)"><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g>' % (
        bb[0][0], od, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:]))
    # the beads where one leaf lies over another (and the crests of the main veins), traced on the reference: a pale crest
    # of thin glaze, its far side amber, softly blended into the leaf
    Lo = light_obj(cam)
    so = shadow_offset(cam, Lo, -.3, 21.0, .02)
    ux, uy = (so[0] / (np.hypot(*so[0]) + 1e-9)) if so else (.6, .8)
    ds = []
    for ln in D['lines']:
        ok = (np.abs(ln[:, 0]) < math.radians(88)) & (ln[:, 1] < H_CM - .03)
        if ok.sum() < 3:
            continue
        P_ = np.array([cam.fwd(p_, h_, rad(h_) + T_LEAF) for p_, h_ in ln[ok]])
        P_ = cv2.GaussianBlur(P_.reshape(-1, 1, 2), (1, 5), 0).reshape(-1, 2) if len(P_) > 5 else P_
        ds.append(open_path(cam, P_[::2] if len(P_) > 8 else P_))
    dl = ''.join(ds)
    bo = F('bead', .2) * sc
    if dl:
        g_ += '<path fill="none" stroke="#7e6424" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" transform="translate(%s %s)" d="%s"/>' % (
            K.fmt(F('rdop', .4)), K.fmt(F('rlw', .5) * sc), K.fmt(ux * bo), K.fmt(uy * bo), dl)
        g_ += '<path fill="none" stroke="#efe4ae" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" d="%s"/>' % (
            K.fmt(F('rlop', .7)), K.fmt(F('rlw', .5) * sc), dl)
    # the outer outline: the same bead, lit on its side facing the light
    g_ += '<path fill="none" stroke="#e8dca2" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" transform="translate(%s %s)" d="%s"/>' % (
        K.fmt(F('blop', .55)), K.fmt(.7 * sc), K.fmt(-ux * bo), K.fmt(-uy * bo), od)
    g_ += '<path fill="none" stroke="#8a6c2a" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" transform="translate(%s %s)" d="%s"/>' % (
        K.fmt(F('bdop', .35)), K.fmt(.7 * sc), K.fmt(ux * bo), K.fmt(uy * bo), od)
    K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('hrdp', .4), 0, F('hamin', 2.0)
    spf = np.where(m, spc, -1).astype(np.float32)
    h1 = K.contour_paths(spf, F('hl1', .3), 2.0, cam.q / 2, cam.mapf, 1.0)
    h2 = K.contour_paths(spf, F('hl2', .45), 1.5, cam.q / 2, cam.mapf, 1.0)
    if h1:
        g_ += '<path fill="#fffaf0" fill-opacity="%s" filter="url(#hb)" d="%s"/>' % (K.fmt(F('hop1', .18)), h1)
    if h2:
        g_ += '<path fill="#fffdf6" fill-opacity="%s" d="%s"/>' % (K.fmt(F('hop2', .8)), h2)
    body.append(g_ + '</g>')
    return len(bb)


# ---------------------------------------------------------------- assembly
def ellipse_mask(cam, h, R, shape):
    m = np.zeros(shape, np.uint8)
    cy = cam.y0 - h * cam.k
    cx = cam.x0(cy)
    c = (int(round((cx - cam.vb[0]) * cam.P * 16)), int(round((cy - cam.vb[1]) * cam.P * 16)))
    ax = (max(1, int(round(R * cam.k * cam.P * 16))), max(1, int(round(R * cam.k * cam.ry * cam.P * 16))))
    cv2.ellipse(m, c, ax, 0, 0, 360, 1, -1, cv2.LINE_8, 4)
    return m


def mask_path(cam, m, eps, sig=.7):
    f = cv2.GaussianBlur(m.astype(np.float32), (0, 0), sig)
    K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = 0, eps, 0
    return K.contour_paths(f, .5, 1.5, cam.q / 2, cam.mapf, 1.0)


def hexc(c):
    return K.hexc(c)


def shadow_offset(cam, Lo, phi, h, t):
    """screen offset of the shadow a relief of height t casts on the body at (phi, h)"""
    N0, _, _ = base_frame(np.array(phi), np.array(h))
    r = rad(h)
    P = np.array([r * math.sin(phi), h, r * math.cos(phi)])
    top = P + t * N0
    ln = float(Lo @ N0)
    if ln < .08:
        return None
    sh = top - Lo * (t / ln)
    f = lambda p: np.array([p[0] * cam.k, -p[1] * cam.k + p[2] * cam.ry * cam.k])
    return f(sh) - f(top), ln


DBG = []


def main():
    cam = Cam(PROJ)
    global LV
    LV = photo_light(cam) if PROJ == 'photo' else K.L3.copy()
    Lo = light_obj(cam)
    sc = cam.k / K.UPC                       # drawing units per shop unit
    phi, h, hit, u = cam.inverse()
    Hf, Wf = phi.shape
    print('inverse %.1fs  field %dx%d' % (time.time() - t0, Wf, Hf))
    defs, body, mouth = [], [], []
    prev = np.zeros((Hf, Wf, 3)); prev[:] = (236, 234, 230)

    # -------- silhouette, body / mouth split
    sil = np.zeros((Hf, Wf), np.uint8)
    for hh in np.arange(0, H_CM + 1e-6, .02):
        sil |= ellipse_mask(cam, hh, rad(hh), sil.shape)
    yc_top = cam.y0 - H_CM * cam.k
    Yf = cam.vb[1] + np.arange(Hf)[:, None] / cam.P
    inner = ellipse_mask(cam, H_CM, R_IN, sil.shape).astype(bool)
    front = np.broadcast_to(Yf >= yc_top, sil.shape)
    bodym = sil.astype(bool) & ~inner & front
    mouthm = sil.astype(bool) & (Yf < yc_top + 1.0 / cam.P * 2)

    # -------- stoneware: the turned body lit by the shop
    N0, _, _ = base_frame(phi, h)
    ns = cam.to_screen(N0)
    scol = stone_shade(ns, h)
    prev[bodym] = scol[bodym]
    sp = mask_path(cam, bodym, F('silfit', .06) * sc)
    defs.append('<clipPath id="cb"><path d="%s"/></clipPath>' % sp)
    K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('srdp', .5), 0, 0
    # bands computed past the silhouette (the turned field continues there) so their wide blur never shows a rim
    big = cv2.dilate(bodym.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=int(F('sext', 5) * cam.P)).astype(bool) & front
    sb = K.bands(scol, big, cam.mapf, cam.q, F('sstep', 6) * cam.P / 6, dy=F('sdy', 5))
    defs.append('<filter id="sbl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('sblur', 3.2) * sc))
    body.append('<g clip-path="url(#cb)"><path fill="%s" d="%s"/><g filter="url(#sbl)">%s</g>' % (
        sb[0][0], sp, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in sb[1:])))
    # the sandy grain of the stoneware: fine light and dark specks and a faint mottling, from SVG turbulence (no image)
    bf = F('grainf', 1.7) / sc
    defs.append(
        '<filter id="gr" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">'
        '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="3" seed="7" result="n"/>'
        '<feColorMatrix in="n" values="0 0 0 0 .96 0 0 0 0 .88 0 0 0 0 .8 %s 0 0 0 %s" result="a"/>'
        '<feColorMatrix in="n" values="0 0 0 0 .2 0 0 0 0 .12 0 0 0 0 .08 0 %s 0 0 %s" result="b"/>'
        '<feMerge result="g"><feMergeNode in="b"/><feMergeNode in="a"/></feMerge>'
        '<feComposite in="g" in2="SourceAlpha" operator="in"/></filter>' % (
            K.fmt(bf), K.fmt(F('lsk', 2.0)), K.fmt(-F('lst', 1.34)), K.fmt(-F('dsk', 1.9)), K.fmt(F('dst', .66))))
    # the grain shows most where the light grazes the lit flank, least in the shadow
    defs.append('<linearGradient id="gm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="#ddd"/>'
                '<stop offset=".6" stop-color="#8a8a8a"/><stop offset="1" stop-color="#4a4a4a"/></linearGradient>'
                '<mask id="gmk" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#gm)"/></mask>')
    body.append('<g mask="url(#gmk)"><path filter="url(#gr)" d="%s"/></g></g>' % sp)
    # the sand of the stoneware at the shop's size: specks scattered evenly over the turned surface (so they crowd towards
    # the edges, following the curve), light and dark, of mixed sizes with a few coarser grains; the light ones show most
    # on the lit flank. Each speck is a round dot (a zero-length stroke with a round cap)
    rng = np.random.default_rng(114)
    hh_ = np.arange(.25, H_CM - .25, .01)
    wts = rad(hh_) * np.sqrt(1 + drad(hh_) ** 2)
    area = math.pi * float(np.sum(wts) * .01)
    n_ = int(F('spd', 13) * area)
    hs_ = rng.choice(hh_, n_, p=wts / wts.sum()) + rng.uniform(-.005, .005, n_)
    ps_ = rng.uniform(-math.radians(86), math.radians(86), n_)
    N_, _, _ = base_frame(ps_, hs_)
    lam_ = np.clip((cam.to_screen(N_) @ LV + .2) / 1.2, 0, 1)
    xs_, ys_ = cam.fwd(ps_, hs_, rad(hs_) + .005)
    kind = rng.random(n_) < .5                                    # light / dark
    keep = np.where(kind, rng.random(n_) < .2 + .8 * lam_ ** 1.3, rng.random(n_) < .55 + .45 * lam_)
    size = np.digitize(rng.random(n_), [.7, .95])                  # 0 fine, 1 medium, 2 coarse
    base_ = stone_shade(cam.to_screen(np.array([-.3, 0, .95])).reshape(1, 3), np.array([12.]))[0]
    specs = (('light', True, (.42, .7, 1.15), (.32, .38, .48), hexc(np.minimum(base_ * 1.25 + 10, 255))),
             ('dark', False, (.4, .66, 1.05), (.34, .38, .45), hexc(base_ * .55)))
    for nm, kd, ws, ops, colh in specs:
        for si in range(3):
            sel = keep & (kind == kd) & (size == si)
            if not sel.any():
                continue
            P_ = np.c_[xs_[sel], ys_[sel]]
            rows = np.floor(P_[:, 1] / 4)
            order = np.lexsort((P_[:, 0] * np.where(rows % 2, -1, 1), rows))
            P_ = np.round(P_[order] / cam.q) * cam.q
            d_ = 'M' + K.nums(P_[0]) + 'h0'
            for i in range(1, len(P_)):
                d_ += 'm' + K.nums(P_[i] - P_[i - 1]) + 'h0'
            body.append('<path fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s" stroke-linecap="round" d="%s"/>' % (
                colh, K.fmt(ops[si] * F('spop', 1.15)), K.fmt(ws[si] * F('spw', 1) * sc), d_))

    # -------- the glazed relief: leaves (bottom to top), then the spurs
    defs.append('<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('lblur', .3) * sc))
    defs.append('<filter id="sh" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('shblur', .18) * sc))
    defs.append('<filter id="pb" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('pblur', .6) * sc))
    defs.append('<filter id="bd" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('bdblur', .22) * sc))
    defs.append('<filter id="hb" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('hblur', .25) * sc))
    objs = []
    if TWIG:
        tg = twig_geom()
        tp_ = twig_polys(tg)
    if TWIG:
        objs.append(dict(kind='twig', ci='twig', g=tg, loc=tp_, ss=[screen_poly(cam, surf_poly('twig', p), lift=.1) for p in tp_]))
    for L in LEAVES:
        g = leaf_geom(L[:10]); ci = L[0]; lip = len(L) > 10
        loc = [g['poly'], petiole_poly(g['pet'])]
        objs.append(dict(kind='leaf', ci=ci, g=g, loc=loc, lip=lip, ss=[screen_poly(cam, surf_poly(ci, p), lip=lip) for p in loc]))
    for ci, cc in enumerate(CLUSTERS):
        if cc[2] is not None:
            loc = [spur_poly(cc[2])]
            objs.append(dict(kind='spur', ci=ci, g=None, loc=loc, ss=[screen_poly(cam, surf_poly(ci, loc[0]), lift=.12)]))
    objs = [ob for ob in objs if any(p is not None for p in ob['ss'])]
    nb = 0
    if 'leaves' not in OPT and os.path.exists('out/decor_maps.npz'):
        objs = []                       # the copy: the decor measured on the reference replaces our own composition
        nb = decor_layer(cam, phi, h, hit, defs, body, prev, sc)
    for k, ob in enumerate(objs):
        polys = [p for p in ob['ss'] if p is not None]
        allp = np.vstack(polys)
        j0 = max(0, int((allp[:, 0].min() - cam.vb[0]) * cam.P) - 10); j1 = min(Wf, int((allp[:, 0].max() - cam.vb[0]) * cam.P) + 10)
        i0 = max(0, int((allp[:, 1].min() - cam.vb[1]) * cam.P) - 10); i1 = min(Hf, int((allp[:, 1].max() - cam.vb[1]) * cam.P) + 10)
        fr = raster_fields(ob)
        ph0, hs0 = origin(ob['ci'])
        pr, hr, hitr = phi[i0:i1, j0:j1], h[i0:i1, j0:j1], hit[i0:i1, j0:j1]
        dphi = (pr - math.radians(ph0) + math.pi) % (2 * math.pi) - math.pi
        s_ = dphi * rad(hr); d_ = mer(hs0) - mer(hr)
        mx = ((s_ - fr['o'][0]) / RES).astype(np.float32); my = ((d_ - fr['o'][1]) / RES).astype(np.float32)
        f1 = cv2.remap(fr['f1'], mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        f2 = cv2.remap(fr['f2'], mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        m = (f2[..., 1] > .5) & hitr
        if m.sum() < 30:
            continue
        n0, tp, tm = base_frame(pr, hr)
        def nrm(a, b):
            N = n0 - a[..., None] * tp + b[..., None] * tm
            return cam.to_screen(N / np.linalg.norm(N, axis=-1, keepdims=True))
        nsm, nfl = nrm(f1[..., 0], f1[..., 1]), nrm(f1[..., 2], f1[..., 3])
        col = glaze_shade(nsm, f2[..., 0])
        spc = glaze_spec(nfl) * np.clip(f2[..., 1], 0, 1)
        pv = prev[i0:i1, j0:j1]
        if 'dbg' in OPT:
            nz_ = np.clip(nfl[..., 2], 0, 1); Rr = 2 * nz_[..., None] * nfl - np.array([0, 0, 1.])
            DBG.append((m, Rr))
        pv[m] = col[m] * (1 - spc[m, None] * .9) + 255 * spc[m, None] * .9
        mapl = lambda x, y, j0=j0, i0=i0: cam.mapf(x + j0, y + i0)
        K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('lrdp', .9), 0, 0
        bb = K.bands(col, m, mapl, cam.q, F('lstep', 4.5) * cam.P / 6, dy=F('ldy', 11))
        nb += len(bb)
        eps = F('lfit', .05) * sc
        dpaths = [closed_path(cam, p, eps) for p in polys]
        dall = ''.join(dpaths)
        dbl = dpaths[0] if ob['kind'] == 'leaf' and ob['ss'][0] is not None else ''
        # its shadow on what lies below (the body or the leaves under it)
        cfp = clip_front(surf_poly(ob['ci'], ob['loc'][0]))
        if ob['kind'] == 'twig':
            cfp = [(p_, h_) for p_, h_ in cfp if abs(p_) < 1.2]
        sp_ = float(np.mean([p_ for p_, _ in cfp])); hc = min(H_CM, float(np.mean([h_ for _, h_ in cfp])))
        so = shadow_offset(cam, Lo, float(sp_), hc, T_LEAF * (1.2 if ob['kind'] == 'spur' else 1))
        cid = 'c%d' % k
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, dall))
        g_ = '<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g>' % (
            cid, bb[0][0], dall, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:]))
        if ob['kind'] == 'leaf' and dbl:
            # glaze pooled against the raised margin
            g_ += '<path fill="none" stroke="#8a6a22" stroke-opacity="%s" stroke-width="%s" filter="url(#pb)" d="%s"/>' % (
                K.fmt(F('poolop', .38)), K.fmt(F('poolw', 3.6) * sc), dbl)
            # veins: thin crests where the glaze runs thin, each with its shaded side
            vs = []
            for v in ob['g']['veins']:
                sv = surf_poly(ob['ci'], v)
                run = []
                for p_, h_ in sv + [(9, 0)]:
                    if abs(p_) < math.radians(87) and h_ < H_CM - LIPR:
                        run.append(cam.fwd(p_, h_, rad(h_) + T_LEAF))
                    else:
                        if len(run) > 1:
                            vs.append(open_path(cam, run))
                        run = []
            dv = ''.join(vs)
            if dv:
                so2 = shadow_offset(cam, Lo, float(sp_), hc, .02)
                vdx, vdy = (so2[0] if so2 else (.15 * sc, .15 * sc))
                g_ += '<path fill="none" stroke="#fbf0c6" stroke-opacity="%s" stroke-width="%s" transform="translate(%s %s)" d="%s"/>' % (
                    K.fmt(F('vlop', .3)), K.fmt(.1 * sc), K.fmt(vdx), K.fmt(vdy), dv)
                g_ += '<path fill="none" stroke="#7a5e1e" stroke-opacity="%s" stroke-width="%s" d="%s"/>' % (
                    K.fmt(F('vdop', .22)), K.fmt(F('vw', .13) * sc), dv)
        # crisp reflections of the studio in the glaze
        K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('hrdp', .4), 0, F('hamin', 2.0)
        spf = np.where(m, spc, -1).astype(np.float32)
        h1 = K.contour_paths(spf, F('hl1', .3), 2.0, cam.q / 2, mapl, 1.0)
        h2 = K.contour_paths(spf, F('hl2', .45), 1.5, cam.q / 2, mapl, 1.0)
        if h1:
            g_ += '<path fill="#fffaf0" fill-opacity="%s" filter="url(#hb)" d="%s"/>' % (K.fmt(F('hop1', .18)), h1)
        if h2:
            g_ += '<path fill="#fffdf6" fill-opacity="%s" d="%s"/>' % (K.fmt(F('hop2', .8)), h2)
        # the raised margin: a rounded bead of the same glaze, lit on its side facing the light (thin there, so a little
        # paler), amber on its far side; clipped by the leaf, the two offset halves give it a varying width
        ux, uy = (so[0] / (np.hypot(*so[0]) + 1e-9)) if so is not None else (.6, .8)
        bo = F('bead', .2) * sc
        g_ += '<path fill="none" stroke="#e8dea6" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" transform="translate(%s %s)" d="%s"/>' % (
            K.fmt(F('blop', .55)), K.fmt(F('rw', .7) * sc), K.fmt(-ux * bo), K.fmt(-uy * bo), dall)
        g_ += '<path fill="none" stroke="#8a6c2a" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" transform="translate(%s %s)" d="%s"/>' % (
            K.fmt(F('bdop', .35)), K.fmt(F('rw', .7) * sc), K.fmt(ux * bo), K.fmt(uy * bo), dall)
        # the soft counter-light of the studio on the bead of the leaves turned away from the light
        wbk = float(np.clip((math.degrees(sp_) - 15) / 55, 0, 1))
        if wbk > .05:
            g_ += '<path fill="none" stroke="#ece2b0" stroke-opacity="%s" stroke-width="%s" filter="url(#hb)" transform="translate(%s %s)" d="%s"/>' % (
                K.fmt(F('backop', .55) * wbk), K.fmt(.5 * sc), K.fmt(.28 * sc), K.fmt(-.08 * sc), dall)
        if ob['kind'] == 'leaf' and len(LEAVES[0]) and ob.get('lip'):
            on = [p_ for p_, h_ in clip_front(surf_poly(ob['ci'], ob['loc'][0])) if h_ >= H_CM - .05]
            if on:
                arc = [cam.fwd(p_, H_CM - LIPR * .4, rad(H_CM - LIPR * .4) + T_LEAF) for p_ in np.linspace(min(on), max(on), 24)]
                g_ += '<path fill="none" stroke="#f6eec4" stroke-opacity="%s" stroke-width="%s" filter="url(#bd)" d="%s"/>' % (
                    K.fmt(F('lipop', .7)), K.fmt(F('lipw', 1.1) * sc), open_path(cam, arc))
        g_ += '</g>'
        body.append(g_)
    if DBG:
        Rs = np.concatenate([r_[m_] for m_, r_ in DBG])
        print('R x pct', np.percentile(Rs[:, 0], [5, 25, 50, 75, 95]).round(2))
        print('R y pct', np.percentile(Rs[:, 1], [5, 25, 50, 75, 95]).round(2))
        print('R.L pct', np.percentile(Rs @ K.L3, [50, 90, 99, 99.9]).round(3))
    print('relief %.1fs  %d parts, %d bands' % (time.time() - t0, len(objs), nb))

    # -------- the mouth: the back of the lip ring and the inside of the back wall (behind the stems)
    # the inside is glazed like the leaves (the reference shows the honey glaze all over the top, no bare clay inside):
    # lit at the back, deeper where the front of the rim shades it
    INNER = [col3(k, d) for k, d in (('in0', '214,184,98'), ('in1', '182,148,70'), ('in2', '120,92,40'))]
    INNER = [hexc(c) for c in INNER]
    ringc = stone_shade(cam.to_screen(np.array([0, .55, .835])).reshape(1, 3), np.array([H_CM]))[0]
    mp = mask_path(cam, mouthm, F('silfit', .06) * sc)
    cy = yc_top; cx = cam.x0(cy)
    ri, riy = R_IN * cam.k, R_IN * cam.k * cam.ry
    defs_m = ('<linearGradient id="mr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
              '<radialGradient id="mi" cx=".4" cy=".05" r=".95"><stop offset="0" stop-color="%s"/><stop offset=".6" stop-color="%s"/>'
              '<stop offset="1" stop-color="%s"/></radialGradient>') % (hexc(ringc * 1.04), hexc(ringc * .9), *INNER)
    mouth.append('<defs>%s</defs><path fill="url(#mr)" d="%s"/><ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#mi)"/>' % (
        defs_m, mp, K.fmt(cx), K.fmt(cy), K.fmt(ri), K.fmt(riy)))
    mouth.append('<path fill="none" stroke="#a48c7a" stroke-opacity=".55" stroke-width="%s" d="M%s,%sA%s,%s 0 0 1 %s,%s"/>' % (
        K.fmt(.5 * sc), K.fmt(cx - ri), K.fmt(cy), K.fmt(ri), K.fmt(riy), K.fmt(cx + ri), K.fmt(cy)))
    prev[mouthm] = ringc
    # the glaze of the leaves draped over the rim (copied from the reference, seen from above), behind the stems
    if os.path.exists('out/decor_maps.npz') and 'leaves' not in OPT:
        tz = np.load('out/decor_maps.npz')
        if 'top' in tz:
            topm = tz['top'].astype(np.float32)
            Rt = R_TOP + LIPR
            jj, ii = np.meshgrid(np.arange(Wf), np.arange(Hf))
            Xf, Yf_ = cam.field_xy(jj, ii)
            uu = (Xf - cx) / (Rt * cam.k); vv = (Yf_ - cy) / (Rt * cam.k * cam.ry)
            inn = (uu ** 2 + vv ** 2 <= 1)
            tv = cv2.remap(topm, ((uu + 1) * 120).astype(np.float32), ((vv + 1) * 60).astype(np.float32), cv2.INTER_LINEAR,
                           borderMode=cv2.BORDER_CONSTANT, borderValue=0) * inn
            tm = (tv > .5) & mouthm
            if tm.sum() > 30:
                # its surface faces up and a little towards the eye; the far side of the rim turns towards us
                n_ = np.stack([-.2 + .3 * uu, -.8 + .2 * np.clip(-vv, 0, 1), .55 + .2 * np.clip(-vv, 0, 1)], -1)
                n_ /= np.linalg.norm(n_, axis=-1, keepdims=True)
                tcol = glaze_shade(n_, np.full(uu.shape, .7))
                prev[tm] = tcol[tm]
                tpath = mask_path(cam, tv * mouthm, F('lfit', .05) * sc, sig=.6)
                K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = F('lrdp', .9), 0, 0
                tb = K.bands(tcol, tm, cam.mapf, cam.q, F('lstep', 4.5) * cam.P / 6, dy=F('ldy', 9))
                capg = '<path fill="%s" d="%s"/>%s' % (tb[0][0], tpath, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in tb[1:]))
                mouth.append('<defs><clipPath id="ct"><path d="%s"/></clipPath></defs><g clip-path="url(#ct)">%s</g>' % (tpath, capg))
                # the same glaze over the front of the rim, in front of the stems (never over the opening)
                ring_f = (tv > .5) & inn & ~inner & front
                if ring_f.sum() > 20:
                    rpath = mask_path(cam, ring_f, F('lfit', .05) * sc, sig=.6)
                    tb2 = K.bands(tcol, ring_f, cam.mapf, cam.q, F('lstep', 4.5) * cam.P / 6, dy=F('ldy', 9))
                    body.append('<g clip-path="url(#crf)"><path fill="%s" d="%s"/>%s</g>' % (tb2[0][0], rpath, ''.join(
                        '<path fill="%s" d="%s"/>' % (c, d) for c, d in tb2[1:])))
                    defs.append('<clipPath id="crf"><path d="%s"/></clipPath>' % rpath)
    prev[inner] = (70, 55, 46)

    if PROJ == 'photo':
        cv2.imwrite('out/work/prev_photo.png', np.clip(prev, 0, 255).astype(np.uint8)[:, :, ::-1])
    else:
        cv2.imwrite('out/work/prev_shop.png', np.clip(prev, 0, 255).astype(np.uint8)[:, :, ::-1])
    vb = ' '.join(K.fmt(v) for v in cam.vb)
    bg = ('<rect x="0" y="0" width="570" height="855" fill="%s"/>' % OPT.get('bg', '#919088')) if PROJ == 'photo' else ''
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="mouth">%s</g><g id="vase">%s</g></svg>'
           % (vb, ''.join(defs), bg, ''.join(mouth), ''.join(body)))
    open('out/ginkgo_%s.svg' % PROJ, 'w', encoding='utf-8').write(svg)
    print('svg %d bytes  %.1fs' % (len(svg), time.time() - t0))
    if PROJ == 'shop':
        d = K.write_body('out/body.json', ''.join(defs), ''.join(body), mouth=''.join(mouth))
        d['own'] = True                       # its own lip and mouth: the engine's plain rim is not drawn over it
        json.dump(d, open('out/body.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        import gzip
        raw = open('out/body.json', 'rb').read()
        print('body.json %d bytes, gzip %d' % (len(raw), len(gzip.compress(raw, 9))))
        write_fiche()


def write_fiche():
    U = K.UPC
    prof = [[round(float(hh) * U, 1), round(float(rad(hh)) * U, 2)] for hh in np.linspace(0, H_CM, 50)]
    fiche = {"id": "gres-ginkgo", "refs": [], "n": "Vase en grès aux feuilles de ginkgo", "m": "grès brun mat, feuilles en relief sous émail moutarde",
             "fam": "vase", "shape": "lathe", "p": 0, "mat": "matte", "fin": "", "col": "#8a7062", "col2": "#d2a640", "lip": "plain",
             "lipw": round(WALL * U, 1),
             "why": "Un grès brun au grain de sable où retombent, depuis le col, des rameaux de ginkgo émaillés jaune moutarde : "
                    "éventails bilobés en léger relief, nervures en éventail et longs pétioles, redessinés par nous.",
             "prof": prof, "h": round(H_CM * U, 1), "mo": round(R_IN * U, 1), "mx": 0, "mh": round(H_CM * U, 1), "sf": "none",
             "svgb": "ginkgo"}
    json.dump(fiche, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__' and PROJ in ('shop', 'photo'):
    main()


if __name__ == '__main__' and PROJ == 'check':
    # silhouette of the model over the reference (camera of the photograph)
    im = cv2.imread('out/ref.jpg')
    cam = Cam('photo')
    for h in np.arange(0, H_CM, .05):
        for sgn in (-1, 1):
            x, y = cam.fwd(sgn * math.pi / 2, h, rad(h))
            cv2.circle(im, (int(round(x)), int(round(y))), 0, (0, 0, 255), -1)
    for h in (0, H_CM):
        pts = [cam.fwd(t, h, rad(h)) for t in np.linspace(-math.pi, math.pi, 120)]
        cv2.polylines(im, [np.int32(np.round(pts))], True, (255, 0, 0), 1)
    cv2.imwrite('out/work/check_sil.png', cv2.resize(im, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST))
    print('H %.2f cm  r max %.2f  r top %.2f  r in %.2f  r foot %.2f' % (H_CM, PH_R.max(), R_TOP, R_IN, PH_R[0]))
