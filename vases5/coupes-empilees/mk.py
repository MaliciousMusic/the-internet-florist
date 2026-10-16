# The stacked rings (vases5/coupes-empilees): four thick rings of solid coloured glass stacked a little askew, each with
# its own cut and tint: a citron yellow-green cup with a thick rounded bottom, a fuchsia octagon, a deep orange hexagon
# flaring upwards, and a wide pale amber heptagon on top, tilted. A wide vertical bore runs through the stack and ends in a
# rounded bowl inside the cup. Every ring is a convex solid (half-spaces, plus an ellipsoid for the cup); the shop's studio
# is traced through the stack per pixel (Fresnel, refraction, total internal reflection, absorption per ring by the length
# of glass crossed; rings fused on their common faces, so light passes from one tint into the next without an interface).
# Only curves leave: per face, the tone bands of the traced field clipped to the face, painted ring by ring from the bottom
# (the eye is above: a higher ring is never hidden by a lower one), the bore seen through the glass as a half-transparent
# layer (the stems show there), crisp lit arrises.
#   python mk.py [shop|photo] [key=value ...]  ->  out/coupes_<proj>.svg (+ out/body.json and out/fiche.json for shop)
import sys, os, math, json, time, itertools
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402

PROJ = sys.argv[1] if len(sys.argv) > 1 else 'shop'
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
V3 = lambda k, d: np.array([float(v) for v in OPT.get(k, d).split(',')])
t00 = time.time()
NG = 1.5                                             # refractive index of the glass

# ---------------------------------------------------------------- the model, in cm: x right, y up, z towards the eye
# The owner asked for an exact copy (2026-10-16): every number below is read on the reference (out/lect/, lect.py), in
# pixels of the photograph, and turned into cm by its scale (PK px per cm, axis AX, foot line YF).
PK = F('pk', 23.3)                                   # px per cm: the top ring's 466 px taken as 20 cm (see RAPPORT.md)
AX, YF = F('ax', 353.0), F('yf', 768.0)              # the stack's axis and the foot line, in the photograph
TEP = F('tep', .03)                                  # the photograph's eye: barely above the top (a 14 px sliver of top face)
TE = TEP if PROJ == 'photo' else K.RY                # the view used for this render (the shop's eye is ~9 deg above)
XC = lambda px: (px - AX) / PK
YC = lambda py: (YF - py) / PK


def line_plane(a, b, z_edge):
    """the plane y = y0 + sx x (+ 0 z) whose edge at depth z_edge projects on the photograph's line y_px = a + b x_px"""
    return ((YF - a - b * AX) / PK + z_edge * TEP, -b, 0.0)


def ring_def(name, alpha, octo, yref, top, bot, draft=0.0, roll=0.0, kd=1.0, ells=()):
    """octo: projected x (px) of the left silhouette, the front face's two edges and the right silhouette at the row yref;
    the plan is an octagon whose four chamfers are cut at 45 degrees (front and back alike), kd x half its width deep.
    top / bot: (a, b, 'front'|'back') image lines of the top and bottom edges, or (y0, sx, sz) planes in cm."""
    return dict(name=name, alpha=np.array(alpha), octo=octo, yref=yref, top=top, bot=bot, draft=draft, roll=roll, kd=kd,
                ells=ells)


# lines read by lect.py (robust fits of the strongest vertical gradient, px): see out/lect/lignes.json
D_TOP = (F('dta', 261.8), F('dtb', -.09489))
D_BOT = (F('dba', 402.97), F('dbb', -.13265))
C_BOT = (F('cba', 448.0), F('cbb', -.02438))
B_BOT = (F('bba', 590.47), F('bbb', -.06524))
# absorption per cm (r, g, b) of each tint: pale where the glass is thin, deep where it is thick
RINGS_DEF = [
    ring_def('citron', V3('a0', '.035,.03,.3'), tuple(V3('oA', '178.57,199,511,527.92')), 600, top=B_BOT + ('front',), bot=(0.0, 0.0, 0.0),
             draft=F('drA', -0.2778), ells=(((XC(F('eAx', 355.5)), YC(F('eAy', 465.8)), 0), (F('eAa', 185) / PK, F('eAb', 382.5) / PK, F('eAa', 185) / PK * F('kdA', 1.0))),
                  ((XC(F('fAx', 353.9)), YC(F('fAy', 638.5)), 0), (F('fAa', 193.5) / PK, F('fAb', 139) / PK, F('fAa', 193.5) / PK * F('kdA', 1.0))))),
    ring_def('fuchsia', V3('a1', '.03,.55,.26'), tuple(V3('oB', '172.75,198,484,498.98')), 500, top=C_BOT + ('front',), bot=B_BOT + ('front',),
             roll=F('rlB', 0.6186)),
    ring_def('orange', V3('a2', '.02,.33,1.5'), tuple(V3('oC', '190.96,207,508,522.93')), 410, top=D_BOT + ('front',), bot=C_BOT + ('front',),
             draft=F('drC', -0.1271), roll=F('rlC', 1.318)),
    ring_def('ambre', V3('a3', '.012,.045,.17'), tuple(V3('oD', '121.21,148,530,578.66')), 300, top=D_TOP + ('back',), bot=D_BOT + ('front',),
             roll=F('rlD', 5.796)),
]
# each ring is a separate piece with its own bore (cm, axis read in px): the cup's ends in a thick-bottomed bowl
BORES = [(XC(F('bxA', 380)), F('rcA', 4.1), F('bzA', 0)), (XC(F('bxB', 345)), F('rcB', 3.1), F('bzB', 0)),
         (XC(F('bxC', 382.5)), F('rcC', 1.8), F('bzC', 0)), (XC(F('bxD', 395)), F('rcD', 1.8), F('bzD', 0))]
YB = F('yb', 4.6)                                   # lowest point of the cup's bowl
EC = F('ec', 3.8)                                   # depth of the bowl's rounded end
BX, RC, BZ = BORES[3]                               # the mouth: the top ring's bore



class Ring:
    def __init__(self, k, D):
        self.k, self.name, self.alpha = k, D['name'], D['alpha']
        xl, xfl, xfr, xr = [XC(v) for v in D['octo']]
        yr = YC(D['yref'])
        zf = D['kd'] * (xr - xl) / 2
        dl, dr = xfl - xl, xr - xfr
        P = [(xfl, zf), (xfr, zf), (xr, zf - dr), (xr, -zf + dr), (xfr, -zf), (xfl, -zf), (xl, -zf + dl), (xl, zf - dl)]
        cx = sum(p[0] for p in P) / 8
        self.zf = zf
        th = math.radians(D['roll'])
        Rz = np.array([[math.cos(th), -math.sin(th), 0], [math.sin(th), math.cos(th), 0], [0, 0, 1]])
        piv = np.array([cx, yr, 0])
        N, C, kind = [], [], []
        for i in range(8):
            (x1, z1), (x2, z2) = P[i], P[(i + 1) % 8]
            h = np.array([z2 - z1, 0, -(x2 - x1)])
            h /= np.linalg.norm(h)
            if h @ np.array([x1 - cx, 0, z1]) < 0:
                h = -h
            n = np.array([h[0], D['draft'], h[2]]); n /= np.linalg.norm(n)
            p0 = np.array([x1, yr, z1])
            n2 = Rz @ n; p2 = Rz @ (p0 - piv) + piv
            N.append(n2); C.append(n2 @ p2); kind.append('side')
        for key, sgn in (('top', 1), ('bot', -1)):
            t = D[key]
            if len(t) == 3 and isinstance(t[2], str):
                y0, sx, sz = line_plane(t[0], t[1], zf if t[2] == 'front' else -zf)
            else:
                y0, sx, sz = t
            n = np.array([-sx, 1, -sz]); l_ = np.linalg.norm(n)
            N.append(sgn * n / l_); C.append(sgn * y0 / l_); kind.append(key)
        self.N, self.C, self.kind = np.array(N), np.array(C), kind
        self.jt, self.jb = len(N) - 2, len(N) - 1
        self.m = len(N)
        self.ells = [(np.array(c, float), np.array(a, float)) for c, a in D['ells']]
        self.ell = bool(self.ells)
        self.nsurf = self.m + len(self.ells)

    def interval(self, o, d):
        """entry and exit t of the ray in this convex solid, and the surfaces there (index m + i = ellipsoid i)"""
        nd = d @ self.N.T
        num = self.C[None] - o @ self.N.T
        par = np.abs(nd) < 1e-12
        sd = np.where(par, 1, nd)
        tin = np.where(nd < -1e-12, num / sd, np.where(par & (num < 0), np.inf, -np.inf))
        tout = np.where(nd > 1e-12, num / sd, np.where(par & (num < 0), -np.inf, np.inf))
        te, je = tin.max(1), tin.argmax(1)
        tx, jx = tout.min(1), tout.argmin(1)
        for i, (ec, ea) in enumerate(self.ells):
            u = (o - ec) / ea; v = d / ea
            A = (v * v).sum(1); B = 2 * (u * v).sum(1); Cc = (u * u).sum(1) - 1
            disc = B * B - 4 * A * Cc
            sq = np.sqrt(np.maximum(disc, 0))
            t0 = (-B - sq) / (2 * A); t1 = (-B + sq) / (2 * A)
            t0 = np.where(disc < 0, np.inf, t0); t1 = np.where(disc < 0, -np.inf, t1)
            je = np.where(t0 > te, self.m + i, je); te = np.maximum(te, t0)
            jx = np.where(t1 < tx, self.m + i, jx); tx = np.minimum(tx, t1)
        return te, tx, je, jx

    def normal(self, j, p):
        """outward normal of surface j at p"""
        n = self.N[np.minimum(j, self.m - 1)].copy()
        for i, (ec, ea) in enumerate(self.ells):
            e = j == self.m + i
            if e.any():
                g = (p[e] - ec) / (ea ** 2)
                n[e] = g / np.linalg.norm(g, axis=1, keepdims=True)
        return n

    def inside(self, p, tol=1e-4):
        ok = np.all(p @ self.N.T - self.C[None] <= tol, 1)
        for ec, ea in self.ells:
            ok &= (((p - ec) / ea) ** 2).sum(1) <= 1 + tol
        return ok


RINGS = [Ring(k, D) for k, D in enumerate(RINGS_DEF)]
SURF0 = np.cumsum([0] + [R.nsurf for R in RINGS])   # global surface id = SURF0[k] + local index
TOPR = RINGS[-1]
HMAX = YC(200) + .5


def ring_of_point(p, tol=2e-3):
    """the ring whose glass holds each point (-1: in the air between two rings)"""
    k = np.full(len(p), -1)
    for i, R in enumerate(RINGS):
        k = np.where((k < 0) & R.inside(p, tol), i, k)
    return k


EYE = np.array([0, TE, 1.]); EYE /= np.linalg.norm(EYE)          # towards the eye
DV = -EYE                                                         # the view ray
L = np.array([-.5, .62, .6]); L /= np.linalg.norm(L)              # the shop light (v1a.js LV), y up here
LB = V3('lb', '.25,.65,-.7'); LB /= np.linalg.norm(LB)             # a soft back light (contre-jour)


# ---------------------------------------------------------------- the bores and the three drops cut in the top
# fcav < 0 in the air of the bores and of the drops (each bore only within its own ring's slab: the rings are separate)
def _slab(R, p, ext=.02):
    return np.maximum(p @ R.N[R.jt] - R.C[R.jt], p @ R.N[R.jb] - R.C[R.jb]) - ext


def _pit_list():
    """the three teardrop pits of the top ring: endpoints read on the photograph (x px; z cm; depth cm below the top face),
    shallow and narrow at the mouth, deep and round towards the front (the drops seen through the front face)"""
    R = None
    out = []
    spec = [((F('p1x0', 378), F('p1z0', 2.6), F('p1d0', .1)), (F('p1x1', 320), F('p1z1', 7.6), F('p1d1', 1.75)), F('p1w', .55)),
            ((F('p2x0', 412), F('p2z0', 2.6), F('p2d0', .1)), (F('p2x1', 468), F('p2z1', 7.6), F('p2d1', 1.7)), F('p2w', .55)),
            ((F('p3x0', 462), F('p3z0', .8), F('p3d0', .05)), (F('p3x1', 545), F('p3z1', -.6), F('p3d1', .75)), F('p3w', .42))]
    return spec


PITS = []


def _build_pits():
    R = RINGS[3]
    n, c = R.N[R.jt], R.C[R.jt]
    for (a0, a1, w) in _pit_list():
        P = []
        for x_, z_, d_ in (a0, a1):
            x = XC(x_)
            y = (c - n[0] * x - n[2] * z_) / n[1] - d_
            P.append(np.array([x, y, z_]))
        u = P[1] - P[0]; L_ = np.linalg.norm(u); u /= L_
        PITS.append((.5 * (P[0] + P[1]), u, L_ / 2 + .5 * w, w))


_build_pits()
PIT_Y0 = min(m_[1] - a - w for m_, u, a, w in PITS) - .1


def _pits(p):
    f = np.full(len(p), 1e3)
    sel = np.nonzero(p[:, 1] > PIT_Y0)[0]          # the pits only live in the top ring's upper part
    if sel.size == 0:
        return f
    p = p[sel]
    g = np.full(len(p), 1e3)
    for m_, u, a, w in PITS:
        q = p - m_
        t = q @ u
        r = np.linalg.norm(q - t[:, None] * u, axis=1)
        we = w
        g = np.minimum(g, (np.sqrt((t / a) ** 2 + (r / we) ** 2) - 1) * w)
    f[sel] = g
    # below the pits' level, a lower bound of the distance to them keeps the sphere tracing honest
    lo = np.ones(len(f), bool); lo[sel] = False
    return f


def _pit_floor():
    return min(m_[1] - a - w for m_, u, a, w in PITS)


def fcav(p):
    f = np.full(len(p), 1e3)
    for k, R in enumerate(RINGS):
        bx, rc, bz = BORES[k]
        x, y, z = p[:, 0] - bx, p[:, 1], p[:, 2] - bz
        if k == 0:
            e = np.maximum(0, YB + EC - y) * (rc / EC)
            cyl = np.sqrt(x * x + z * z + e * e) - rc
        else:
            cyl = np.sqrt(x * x + z * z) - rc
        f = np.minimum(f, np.maximum(cyl, _slab(R, p)))
    return np.minimum(f, _pits(p))


def ncav(p):
    """normal of the air's wall, pointing into the glass (numerical gradient)"""
    h = 1e-3
    g = np.stack([fcav(p + h * e) - fcav(p - h * e) for e in np.eye(3)], 1)
    return g / (np.linalg.norm(g, axis=1, keepdims=True) + 1e-12)


# ---------------------------------------------------------------- the studio, seen in a direction (linear light)
BGDEF = '255,255,255' if PROJ == 'photo' else '238,235,229'
WALL = (V3('bg', BGDEF) / 255) ** 2.2


def ss_(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def env(d):
    """the photograph's studio, copied: a white sweep all round, a light table below the horizon, a bright ceiling, the
    camera and the photographer's side a little darker in front, two narrow black flags at the sides (the black lines on
    the rings' flanks), the light box (upper left, the shop's light) and a soft back light"""
    x, y, z = d[:, 0], d[:, 1], d[:, 2]
    if F('envdbg', 0):                                 # diagnosis: the escape direction as a colour
        return (d + 1) / 2
    c = np.tile(WALL * F('expo', 0.925), (len(d), 1))
    # the white sweep behind the vessel is only so wide: beyond it, left and right, the studio is dark (what the side
    # chamfers show through the glass)
    hz = np.hypot(x, z) + 1e-9
    az = np.degrees(np.arccos(np.clip(-z / hz, -1, 1)))
    sw = ss_(F('sw0', 19), F('sw1', 26), az) * (1 - ss_(F('sw2', 120), F('sw3', 150), az))
    c = c * (1 - F('swk', 0.65) * sw[:, None] * ss_(-.6, -.3, -np.abs(y))[:, None])
    fz = ss_(F('hz0', .3), F('hz1', .8), z)[:, None]                       # the room behind the camera
    c = c * (1 - F('frontk', 0.45) * fz)
    cam = ss_(math.cos(math.radians(F('camr', 10))), math.cos(math.radians(F('camr', 10) * .6)), d @ EYE)[:, None]
    c = c * (1 - .95 * cam)
    vy = ss_(-F('fly', .5), -F('fly', .5) + .15, -np.abs(y - .05))
    fr = ss_(F('fr0', .55), F('fr0', .55) + .06, x) * ss_(-F('fr0', .55) - F('frw', .2), -F('fr0', .55) - F('frw', .2) + .06, -x) * vy
    c = c * (1 - F('frk', .95) * fr[:, None])
    fl = ss_(F('fl0', .55), F('fl0', .55) + .06, -x) * ss_(-F('fl0', .55) - F('flw', .2), -F('fl0', .55) - F('flw', .2) + .06, x) * vy
    c = c * (1 - F('flk', .95) * fl[:, None])
    ceil = V3('ceil', '1.1,1.1,1.1')
    cy = ss_(.3, .5, y)[:, None]
    c = c * (1 - cy) + ceil * cy
    table = V3('table', '.86,.85,.84')
    tb = ss_(.0, .06, -y)[:, None]
    c = c * (1 - tb) + table * tb
    floor = V3('floor', '.6,.6,.58')
    fo = ss_(F('fl0y', .85), F('fl1y', .98), -y)[:, None]
    c = c * (1 - fo) + floor * fo
    key = ss_(math.cos(math.radians(F('keyr', 24))), math.cos(math.radians(F('keyr', 24) * .7)), d @ L)
    c = c + F('keyi', 3) * key[:, None] * np.array([1, .98, .94])
    bk = ss_(math.cos(math.radians(F('bkr', 30))), math.cos(math.radians(F('bkr', 30) * .5)), d @ LB)
    c = c + F('bki', 2) * bk[:, None] * np.array([1, .97, .9])
    return c


def fresnel(ci, ct, n1, n2):
    rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct + 1e-12)
    rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci + 1e-12)
    return np.clip(.5 * (rs * rs + rp * rp), 0, 1)


def interface(d, n, n1, n2):
    """n faces the incoming ray (d . n < 0). Returns reflected dir, refracted dir, Fresnel reflectance (1 where TIR)"""
    ci = np.clip(-(d * n).sum(1), 0, 1)
    eta = n1 / n2
    k = 1 - eta * eta * (1 - ci * ci)
    tir = k <= 0
    ct = np.sqrt(np.maximum(k, 0))
    r = d + 2 * ci[:, None] * n
    t = eta * d + (eta * ci - ct)[:, None] * n
    t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-12
    Fr = np.where(tir, 1.0, fresnel(ci, ct, n1, n2))
    return r, t, Fr, tir


DT = F('dt', .6)
DTMIN = F('dtmin', .025)
SK = F('sk', .45)


def march(p, d, ta, tb, sgn):
    """first t in [ta, tb] where sgn * fcav changes from positive to negative (inf if none), refined by bisection"""
    res = np.full(len(p), np.inf)
    act = np.nonzero(ta < tb)[0]
    t = ta.copy()
    f0 = sgn * fcav(p[act] + t[act, None] * d[act]) if act.size else None
    while act.size:
        # sphere tracing: fcav bounds the distance to the air from below (to a factor ~2 in the pits), so a step of
        # SK x |f| never jumps over a wall; DT caps the step, DTMIN keeps it moving
        tn = np.minimum(t[act] + np.clip(SK * np.abs(f0), DTMIN, DT), tb[act])
        fn = sgn * fcav(p[act] + tn[:, None] * d[act])
        cr = fn < 0
        if cr.any():
            ii = act[cr]; lo = t[ii].copy(); hi = tn[cr].copy()
            for _ in range(int(F('bis', 10))):
                mid = (lo + hi) / 2
                neg = sgn * fcav(p[ii] + mid[:, None] * d[ii]) < 0
                hi = np.where(neg, mid, hi); lo = np.where(neg, lo, mid)
            res[ii] = hi
        t[act] = tn
        keep = ~cr & (tn < tb[act])
        act = act[keep]; f0 = fn[keep]
    return res


def _cyl_iv(p, d, cx, R, cz=0.0):
    px, pz = p[:, 0] - cx, p[:, 2] - cz
    a = d[:, 0] ** 2 + d[:, 2] ** 2
    b = 2 * (px * d[:, 0] + pz * d[:, 2])
    c = px ** 2 + pz ** 2 - R * R
    disc = b * b - 4 * a * c
    sq = np.sqrt(np.maximum(disc, 0))
    aa = np.where(a > 1e-12, a, 1)
    t0 = np.where(a > 1e-12, (-b - sq) / (2 * aa), np.where(c < 0, -np.inf, np.inf))
    t1 = np.where(a > 1e-12, (-b + sq) / (2 * aa), np.where(c < 0, np.inf, -np.inf))
    bad = (a > 1e-12) & (disc < 0)
    return np.where(bad, np.inf, t0), np.where(bad, -np.inf, t1)


def _sph_iv(p, d, c, R):
    q = p - c
    b = (q * d).sum(1); cc = (q * q).sum(1) - R * R
    disc = b * b - cc
    sq = np.sqrt(np.maximum(disc, 0))
    return np.where(disc < 0, np.inf, -b - sq), np.where(disc < 0, -np.inf, -b + sq)


def _planes_iv(p, d, N, C, t0, t1):
    for n, c in zip(N, C):
        nd = d @ n; num = c - p @ n
        par = np.abs(nd) < 1e-12
        sd = np.where(par, 1, nd)
        t = num / sd
        t0 = np.where(nd < -1e-12, np.maximum(t0, t), t0)
        t1 = np.where(nd > 1e-12, np.minimum(t1, t), t1)
        bad = par & (num < 0)
        t0 = np.where(bad, np.inf, t0); t1 = np.where(bad, -np.inf, t1)
    return t0, t1


def _ell_iv(p, d, c, M):
    """line interval in the ellipsoid {|M (x - c)| <= 1}"""
    u = (p - c) @ M.T; v = d @ M.T
    A = (v * v).sum(1); B = 2 * (u * v).sum(1); Cc = (u * u).sum(1) - 1
    disc = B * B - 4 * A * Cc
    sq = np.sqrt(np.maximum(disc, 0))
    t0 = (-B - sq) / (2 * A); t1 = (-B + sq) / (2 * A)
    return np.where(disc < 0, np.inf, t0), np.where(disc < 0, -np.inf, t1)


def air_intervals(p, d):
    """line intervals (t0, t1) of every air volume: the four bores (each within its ring's slab; the cup's ending in its
    bowl) and the three pits; all convex, all analytic"""
    out = []
    for k, R in enumerate(RINGS):
        bx, rc, bz = BORES[k]
        Nk, Ck = R.N[[R.jt, R.jb]], R.C[[R.jt, R.jb]]
        t0, t1 = _cyl_iv(p, d, bx, rc, bz)
        if k == 0:
            # the bowl: the cylinder above YB + EC, the half ellipsoid below, as one convex volume
            h = YB + EC
            ca, cb = _planes_iv(p, d, [np.array([0, -1., 0])], [-h], t0, t1)
            M = np.diag([1 / rc, 1 / EC, 1 / rc])
            ea, eb = _ell_iv(p, d, np.array([bx, h, bz]), M)
            okc, oke = ca < cb, ea < eb
            t0 = np.where(okc & oke, np.minimum(ca, ea), np.where(okc, ca, ea))
            t1 = np.where(okc & oke, np.maximum(cb, eb), np.where(okc, cb, eb))
            t0 = np.where(okc | oke, t0, np.inf); t1 = np.where(okc | oke, t1, -np.inf)
        t0, t1 = _planes_iv(p, d, Nk, Ck + .02, t0, t1)
        out.append((t0, t1))
    for m_, u, a, w in PITS:
        e1 = np.cross(u, [0, 0, 1.]) if abs(u[2]) < .9 else np.cross(u, [1., 0, 0])
        e1 /= np.linalg.norm(e1); e2 = np.cross(u, e1)
        M = np.stack([u / a, e1 / w, e2 / w])
        out.append(_ell_iv(p, d, m_, M))
    return out


def cavity_from_glass(p, d, tmax):
    """t where a ray inside the glass first meets the air of a bore or a pit (inf if not before tmax)"""
    tc = np.full(len(p), np.inf)
    for t0, t1 in air_intervals(p, d):
        ok = (t0 < t1) & (t0 > 2e-4)
        tc = np.where(ok, np.minimum(tc, t0), tc)
    return np.where(tc < tmax, tc, np.inf)


def air_exit(p, d):
    """from a point in the air of the bores or pits: t where the ray leaves the union of the air volumes"""
    t = np.zeros(len(p))
    for _ in range(6):
        q = p + t[:, None] * d
        ext = np.full(len(p), -np.inf)
        for t0, t1 in air_intervals(q, d):
            inn = (t0 < 1e-4) & (t1 > 1e-4)
            ext = np.where(inn, np.maximum(ext, t1), ext)
        mv = ext > 1e-4
        if not mv.any():
            break
        t = np.where(mv, t + ext, t)
    return t


def absorb(tau):
    """transmission after an optical depth tau (r, g, b); past a few units the depth is taken with a soft cap, so that
    light trapped by many internal reflections stays a deep clear tint instead of turning to mud"""
    if F('envdbg', 0):
        return np.ones_like(tau)
    Lc = F('tcap', 5)
    return np.exp(-Lc * (1 - np.exp(-tau / Lc)))


def first_hit(o, d, tmin=1e-5):
    """first ring met by rays in the air: t, ring, local surface (t = inf if none)"""
    bt = np.full(len(o), np.inf); bk = np.full(len(o), -1); bj = np.full(len(o), -1)
    for k, R in enumerate(RINGS):
        te, tx, je, _ = R.interval(o, d)
        ok = (te < tx) & (te > tmin) & (te < bt)
        bt = np.where(ok, te, bt); bk = np.where(ok, k, bk); bj = np.where(ok, je, bj)
    return bt, bk, bj


def top_plane_t(p, d):
    """t where a ray in the bore crosses the top ring's top face going up (inf otherwise)"""
    n, c = TOPR.N[TOPR.jt], TOPR.C[TOPR.jt]
    nd = d @ n
    return np.where(nd > 1e-9, (c - p @ n) / np.where(nd > 1e-9, nd, 1), np.inf)


def trace(o, d):
    """the studio seen through the stack along each ray. Returns colour (linear), the surface hit first (global id, -2 the
    mouth's opening, -1 nothing) and whether the first refracted ray reaches the bore's air (where stems are seen)"""
    N = len(o)
    col = np.zeros((N, 3)); part = np.full(N, -1); cavp = np.zeros(N, bool); cavt = np.zeros(N, bool)
    ALPHA = np.array([R.alpha for R in RINGS])
    WMIN, MAXD = F('wmin', .012), int(F('maxd', 7))
    # batches: (pixel, position, direction, weight, optical depth, medium 0 glass / 1 bore air / 2 outside, ring, depth, primary)
    Q = [(np.arange(N), o, d, np.ones(N), np.zeros((N, 3)), 2, None, 0, True)]
    nseg = 0
    while Q:
        ii, p, d, wf, tau, m, rk, dep, prim = Q.pop()
        if len(ii) == 0:
            continue
        nseg += len(ii)
        last = dep + 1 >= MAXD
        if m == 2:                                     # in the air, outside the stack
            bt, bk, bj = first_hit(p, d)
            miss = ~np.isfinite(bt)
            if miss.any():
                np.add.at(col, ii[miss], (absorb(tau[miss]) * wf[miss, None]) * env(d[miss]))
            h = ~miss
            if not h.any():
                continue
            ii, p, d, wf, tau, bt, bk, bj = ii[h], p[h], d[h], wf[h], tau[h], bt[h], bk[h], bj[h]
            q = p + bt[:, None] * d
            hole = fcav(q) < 0               # on a face, inside the bore: into its air
            if prim:
                part[ii] = SURF0[bk] + bj
                part[ii[hole]] = -2
            if hole.any():
                Q.append((ii[hole], q[hole], d[hole], wf[hole], tau[hole], 1, None, dep, False))
            g = ~hole
            if not g.any():
                continue
            ii, q, d, wf, tau, bk, bj = ii[g], q[g], d[g], wf[g], tau[g], bk[g], bj[g]
            nn = np.zeros_like(q)
            for k, R in enumerate(RINGS):
                s = bk == k
                if s.any():
                    nn[s] = R.normal(bj[s], q[s])
            r, t, Fr, _ = interface(d, nn, 1, NG)
            wr = wf * Fr; wt = wf * (1 - Fr)
            if last:
                np.add.at(col, ii, (absorb(tau) * wr[:, None]) * env(r))
            else:
                kr = wr > WMIN
                Q.append((ii[kr], q[kr] + 1e-5 * r[kr], r[kr], wr[kr], tau[kr], 2, None, dep + 1, False))
            Q.append((ii, q + 1e-5 * t, t, wt, tau, 0, bk, dep + 1 if not prim else dep, prim))
        elif m == 0:                                   # inside the glass of ring rk
            tex = np.full(len(ii), np.inf); jx = np.zeros(len(ii), int)
            for k, R in enumerate(RINGS):
                s = rk == k
                if s.any():
                    _, tx_, _, jx_ = R.interval(p[s], d[s])
                    tex[s] = np.maximum(tx_, 0); jx[s] = jx_
            tc = cavity_from_glass(p, d, tex)
            inc = tc < tex
            tt = np.where(inc, tc, tex)
            q = p + tt[:, None] * d
            tau = tau + ALPHA[rk] * tt[:, None]
            o_ = ~inc
            if o_.any():
                # through a face shared with the next ring: the rings are fused, the light goes on in the next tint
                pas = np.zeros(len(ii), bool); nk = rk.copy()
                for k, R in enumerate(RINGS):
                    s = o_ & (rk == k) & ((jx == R.jt) | (jx == R.jb))
                    if not s.any():
                        continue
                    for k2, R2 in enumerate(RINGS):
                        if k2 == k:
                            continue
                        u = s & ~pas
                        if u.any():
                            ok = R2.inside(q[u], 1e-3) & (fcav(q[u]) >= 0)
                            w = np.nonzero(u)[0][ok]; pas[w] = True; nk[w] = k2
                if pas.any():
                    # the rings are separate pieces resting on each other: a thin film of air between them. Steep rays
                    # cross it unchanged in direction (two parallel interfaces), grazing ones are mirrored (total
                    # internal reflection): the seat of each ring reads as a mirror, the tints stay apart
                    nn = np.zeros((int(pas.sum()), 3)); qp, dp_, rp_, jp = q[pas], d[pas], rk[pas], jx[pas]
                    for k, R in enumerate(RINGS):
                        s = rp_ == k
                        if s.any():
                            nn[s] = R.normal(jp[s], qp[s])
                    r, _, Fr, tir = interface(dp_, -nn, NG, 1)
                    film = F('film', 1)
                    wt = wf[pas] * np.where(tir, 1 - film, (1 - Fr) ** 2 * film + (1 - film))
                    wr = wf[pas] - wt
                    Q.append((ii[pas], qp + 1e-5 * dp_, dp_, wt, tau[pas], 0, nk[pas], dep, prim))
                    kr = (wr > WMIN) & (not last)
                    Q.append((ii[pas][kr], qp[kr] + 1e-5 * r[kr], r[kr], wr[kr], tau[pas][kr], 0, rp_[kr], dep + 1, False))
                ex = o_ & ~pas
                if ex.any():                           # out of the stack through a face
                    nn = np.zeros((int(ex.sum()), 3))
                    qe, de, re_, je = q[ex], d[ex], rk[ex], jx[ex]
                    for k, R in enumerate(RINGS):
                        s = re_ == k
                        if s.any():
                            nn[s] = R.normal(je[s], qe[s])
                    r, t, Fr, tir = interface(de, -nn, NG, 1)
                    T = absorb(tau[ex]); wfe = wf[ex]
                    wt = wfe * (1 - Fr); wr = wfe * Fr
                    if last:
                        np.add.at(col, ii[ex], (T * wt[:, None]) * env(t) + (T * wr[:, None]) * env(r))
                    else:
                        kt = (~tir) & (wt > WMIN); kr = wr > WMIN
                        ins = kt & (fcav(qe + 1e-4 * t) < 0)       # out into the air of a bore (a ledge inside it)
                        ot = kt & ~ins
                        Q.append((ii[ex][ot], qe[ot] + 1e-5 * t[ot], t[ot], wt[ot], tau[ex][ot], 2, None, dep + 1, False))
                        Q.append((ii[ex][ins], qe[ins] + 1e-4 * t[ins], t[ins], wt[ins], tau[ex][ins], 1, None, dep + 1, False))
                        Q.append((ii[ex][kr], qe[kr] + 1e-5 * r[kr], r[kr], wr[kr], tau[ex][kr], 0, re_[kr], dep + 1, False))
            if inc.any():                              # into the bore's air
                nn = ncav(q[inc])
                r, t, Fr, tir = interface(d[inc], nn, NG, 1)
                if prim:
                    cavp[ii[inc]] = (~tir) & (Fr < .5)
                    cavt[ii[inc]] = True
                wt = wf[inc] * (1 - Fr); wr = wf[inc] * Fr
                if not last:
                    kt = (~tir) & (wt > WMIN); kr = wr > WMIN
                    Q.append((ii[inc][kt], q[inc][kt] + 2e-4 * t[kt], t[kt], wt[kt], tau[inc][kt], 1, None, dep + 1, False))
                    Q.append((ii[inc][kr], q[inc][kr] + 2e-4 * r[kr], r[kr], wr[kr], tau[inc][kr], 0, rk[inc][kr], dep + 1, False))
                else:
                    np.add.at(col, ii[inc], (absorb(tau[inc]) * wf[inc, None]) * env(d[inc]))
        else:                                          # in the bore's air
            tw = air_exit(p, d)
            esc = tw > 50
            if esc.any():                              # out through the mouth
                np.add.at(col, ii[esc], (absorb(tau[esc]) * wf[esc, None]) * env(d[esc]))
            h_ = ~esc
            if h_.any():
                q = p[h_] + tw[h_, None] * d[h_]
                rq = ring_of_point(q)
                gap = rq < 0                           # the bore's wall falls in the air between two rings
                if gap.any():
                    Q.append((ii[h_][gap], q[gap] + 1e-4 * d[h_][gap], d[h_][gap], wf[h_][gap], tau[h_][gap], 2, None, dep, False))
                gl = ~gap
                ii2, q, d2, wf2, tau2, rq = ii[h_][gl], q[gl], d[h_][gl], wf[h_][gl], tau[h_][gl], rq[gl]
                nn = -ncav(q)
                r, t, Fr, tir = interface(d2, nn, 1, NG)
                wt = wf2 * (1 - Fr); wr = wf2 * Fr
                if not last:
                    kt = wt > WMIN; kr = wr > WMIN
                    Q.append((ii2[kt], q[kt] + 2e-4 * t[kt], t[kt], wt[kt], tau2[kt], 0, rq[kt], dep + 1, False))
                    Q.append((ii2[kr], q[kr] + 2e-4 * r[kr], r[kr], wr[kr], tau2[kr], 1, None, dep + 1, False))
                else:
                    np.add.at(col, ii2, (absorb(tau2) * wf2[:, None]) * env(t))
    return col, part, cavp | (cavt << 1), nseg


# ---------------------------------------------------------------- projections, faces
if PROJ == 'photo':
    # the reference's framing (700 x 933): the model is measured in its pixels
    OUT = lambda x, yu: (AX + x * PK, YF - yu * PK)
    RES = F('res', .8)                     # field pixels per output unit
else:
    OUT = lambda x, yu: (K.VX + x * K.UPC, K.FL - yu * K.UPC)
    RES = F('res', 3.0)
UNIT = (OUT(1, 0)[0] - OUT(0, 0)[0])      # output units per cm


def proj(v):
    v = np.atleast_2d(v)
    return np.array([OUT(x, y - z * TE) for x, y, z in v])


def face_polys(R):
    """exact polygons of the faces of a ring's polyhedron (its half-spaces only)"""
    J = R.m; V = []
    for a, b, c in itertools.combinations(range(J), 3):
        M = R.N[[a, b, c]]
        if abs(np.linalg.det(M)) < 1e-9:
            continue
        v = np.linalg.solve(M, R.C[[a, b, c]])
        if np.all(R.N @ v <= R.C + 1e-7):
            V.append(v)
    V = np.unique(np.round(np.array(V), 7), axis=0)
    polys = {}
    for j in range(J):
        on = V[np.abs(V @ R.N[j] - R.C[j]) < 1e-6]
        if len(on) < 3:
            continue
        c = on.mean(0); n = R.N[j]
        u = np.cross(n, [0, 1, 0] if abs(n[1]) < .9 else [1, 0, 0]); u /= np.linalg.norm(u); v = np.cross(n, u)
        ang = np.arctan2((on - c) @ v, (on - c) @ u)
        polys[j] = on[np.argsort(ang)]
    return V, polys


def main():
    BB = np.array([[x, y, z] for x in (-10, 10) for y in (-.2, HMAX + .2) for z in (-10, 10)])
    P2 = proj(BB)
    x0, y0 = P2.min(0) - 2; x1, y1 = P2.max(0) + 2
    W_, H_ = int(math.ceil((x1 - x0) * RES)), int(math.ceil((y1 - y0) * RES))
    SS = int(F('ss', 2))
    print('field %dx%d, ss %d' % (W_, H_, SS))
    gx = x0 + (np.arange(W_ * SS) + .5) / (RES * SS)
    gy = y0 + (np.arange(H_ * SS) + .5) / (RES * SS)
    XX, YY = np.meshgrid(gx, gy)
    xm = (XX - OUT(0, 0)[0]) / UNIT
    yu = (OUT(0, 0)[1] - YY) / UNIT
    z0 = 40.0
    o = np.stack([xm.ravel(), (yu + z0 * TE).ravel(), np.full(xm.size, z0)], 1)
    d = np.tile(DV, (len(o), 1))
    # solo labels: each ring alone (its exact faces, for the clip regions)
    solo = np.full((len(RINGS), len(o)), -1, np.int16)
    for k, R in enumerate(RINGS):
        te, tx, je, _ = R.interval(o, d)
        solo[k] = np.where(te < tx, je, -1)
    col = np.zeros((len(o), 3)); part = np.full(len(o), -1); cavp = np.zeros(len(o), np.uint8)
    CH = int(F('chunk', 40000)); nseg = 0
    for s in range(0, len(o), CH):
        c_, p_, k_, n_ = trace(o[s:s + CH], d[s:s + CH])
        col[s:s + CH] = c_; part[s:s + CH] = p_; cavp[s:s + CH] = k_; nseg += n_
    print('traced %d rays, %d segments, %.1fs' % (len(o), nseg, time.time() - t00))
    kn = F('knee', .8)
    col = np.where(col > kn, kn + (1 - kn) * (1 - np.exp(-(col - kn) / (1 - kn))), col)
    disp = 255 * np.clip(col, 0, 1) ** (1 / 2.2)
    disp = disp.reshape(H_, SS, W_, SS, 3).mean((1, 3))
    partS = part.reshape(H_, SS, W_, SS)
    cavS = (cavp & 1).reshape(H_, SS, W_, SS)
    touch = ((cavp >> 1) & 1).reshape(H_, SS, W_, SS).max((1, 3)) > 0
    part2 = partS[:, 0, :, 0]
    pure = (partS == part2[:, None, :, None]).all((1, 3))
    cav2 = cavS.mean((1, 3)) > .5
    out = os.path.join(HERE, 'out')
    np.save(os.path.join(out, 'field_%s.npy' % PROJ), np.dstack([disp, part2, cav2, touch, pure]).astype(np.float32))
    np.save(os.path.join(out, 'solo_%s.npy' % PROJ), solo.reshape(len(RINGS), H_ * SS, W_ * SS))
    json.dump({'x0': float(x0), 'y0': float(y0), 'res': RES, 'ss': SS}, open(os.path.join(out, 'field_%s.json' % PROJ), 'w'))
    pv = disp.copy(); pv[part2 == -1] = V3('bg', BGDEF)
    cv2.imwrite(os.path.join(out, 'field_%s.png' % PROJ), pv[:, :, ::-1].astype(np.uint8))
    if F('emit', 1):
        emit(disp, part2, pure, cav2, touch, solo.reshape(len(RINGS), H_ * SS, W_ * SS), (x0, y0), SS)


def bands_key(col, mask, mapf, q, step, dy=11.0, minpx=10):
    """svgkit.bands with the bins taken along the main axis of the face's colours (PCA): a face of one ring shows the other
    tints through it, and two tints of the same lightness must not be averaged into one muddy tone"""
    vals = col[mask]
    if len(vals) < minpx:
        return []
    mu = vals.mean(0)
    w, v = np.linalg.eigh(np.cov((vals - mu).T) + 1e-6 * np.eye(3))
    ax = v[:, -1]
    if ax @ np.array([.3, .59, .11]) < 0:
        ax = -ax
    # the key keeps a part of plain lightness, so that a face with almost no hue change still bands by tone
    kp = F('kpca', .8)
    Y = (col - mu) @ ax * kp + (col @ np.array([.3, .59, .11])) * (1 - kp)
    Ye, me = K.extend(Y, mask, 6)
    ce, _ = K.extend(col, mask, 6)
    vals = Y[mask]
    lo, hi = np.percentile(vals, 1), np.percentile(vals, 99.5)
    levels = np.arange(math.floor(lo / dy) * dy + dy, hi, dy)
    out = []
    edges = [-1e9] + list(levels) + [1e9]
    F_ = np.where(me, Ye, -1e3)
    for k in range(len(edges) - 1):
        sel = mask & (Y >= edges[k]) & (Y < edges[k + 1])
        if sel.sum() < 2:
            sel = me & (Ye >= edges[k]) & (Ye < edges[k + 1])
        if sel.sum() < 2:
            continue
        c = ce[sel].mean(0)
        if k == 0:
            out.append((K.hexc(c), None))
            continue
        d = K.contour_paths(F_, edges[k], step, q, mapf, K.S)
        if d:
            out.append((K.hexc(c), d))
    return out


def emit(disp, part2, pure, cav2, touch, solo, org, SS):
    x0, y0 = org
    q = F('q', .2 if PROJ == 'shop' else .5)
    mapf = lambda x, y: (x0 + (x + .5) / RES, y0 + (y + .5) / RES)
    mapS = lambda x, y: (x0 + (x + .5) / (RES * SS), y0 + (y + .5) / (RES * SS))
    K.S = 1.0
    K.RDP_EPS = F('rdp', .5); K.FIT_EPS = 0; K.AREA_MIN = F('amin', 6) * RES * RES / 9
    if F('csm', .6) > 0:
        disp = cv2.GaussianBlur(disp, (0, 0), F('csm', .6))
    BG = V3('bg', BGDEF)
    ALC = F('alc', .55)                       # opacity of the bore's layer over the stems
    sc = 1 if PROJ == 'shop' else UNIT / K.UPC
    defs, body, back = [], [], []
    defs.append('<filter id="pb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(F('blur', .45) * sc))
    pd = lambda pts: 'M' + 'L'.join(K.nums(np.round(np.array(p) / q) * q) for p in pts) + 'z'
    hole = part2 == -2
    # the half-transparent layer can only reach colours lighter than (1 - ALC) x background: where the bore's image is
    # darker or more saturated than that, the true colour is laid over it, opaque, through a feathered mask (no seam)
    comp = (disp - (1 - ALC) * BG) / ALC
    notok = (comp.min(2) < -F('ctol', 4)) | (comp.max(2) > 255 + F('ctol', 4))
    notok = cv2.morphologyEx(notok.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool) & cav2
    K.AREA_MIN, a_ = F('namin', 12) * RES * RES / 9, K.AREA_MIN
    nk = K.contour_paths(cv2.GaussianBlur(notok.astype(np.float32), (0, 0), .8), .5, 2.0, q, mapf, 1.0)
    K.AREA_MIN = a_
    if nk:
        defs.append('<filter id="pf" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                    '<mask id="pk" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><path fill="#fff" filter="url(#pf)" d="%s"/></mask>'
                    % (K.fmt(F('feath', 1.0) * sc), nk))
    cm = (cav2 | hole).astype(np.uint8)
    cm = cv2.morphologyEx(cm, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cs, _ = cv2.findContours(cm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    inner, cavb, cavr = '', None, None
    for c_ in sorted(cs, key=cv2.contourArea, reverse=True):
        if cv2.contourArea(c_) < F('icmin', 30) * RES * RES:
            continue
        cc = c_[:, 0, :].astype(float)
        ccs = np.array([np.convolve(np.r_[cc[-4:, k], cc[:, k], cc[:4, k]], np.ones(9) / 9, 'valid') for k in (0, 1)]).T
        inner += pd([mapf(x, y) for x, y in ccs[::2]])
    # the bottom of the bowl, as the engine needs it: the lowest point of the bore seen through the cup
    cavb = round(float(proj(np.array([[BX, YB, BZ]]))[0][1]) - F('cavbk', 2), 1)
    cavr = round(RC * UNIT * .8, 1)
    defs.append('<clipPath id="pin"><path d="%s"/></clipPath>' % inner)
    defs.append('<clipPath id="pout"><path clip-rule="evenodd" d="M-2000-2000h6000v6000h-6000z%s"/></clipPath>' % inner)
    # the mouth: the bore's circle on the top ring's tilted top face
    nt, ct = TOPR.N[TOPR.jt], TOPR.C[TOPR.jt]
    th = np.linspace(0, 2 * np.pi, 97)[:-1]
    cx3, cz3 = BX + RC * np.cos(th), BZ + RC * np.sin(th)
    cy3 = (ct - nt[0] * cx3 - nt[2] * cz3) / nt[1]
    M2 = proj(np.stack([cx3, cy3, cz3], 1))
    mouthc = proj(np.array([[BX, (ct - nt[0] * BX - nt[2] * BZ) / nt[1], BZ]]))[0]
    hole_d = pd(M2)
    defs.append('<clipPath id="tm"><path clip-rule="evenodd" d="M-2000-2000h6000v6000h-6000z%s"/></clipPath>' % hole_d)
    nb = 0

    def flatten(colf, mask):
        if F('flat', 0) <= 0 or mask.sum() < 20:
            return colf
        m = mask.astype(np.float32)
        sg = F('flats', 6) * RES
        low = cv2.GaussianBlur(colf * m[..., None], (0, 0), sg) / np.maximum(cv2.GaussianBlur(m, (0, 0), sg), 1e-3)[..., None]
        med = np.median(colf[mask], 0)
        keep = cv2.GaussianBlur((~touch).astype(np.float32), (0, 0), 1.5)[..., None]
        return np.clip(colf - F('flat', 0) * keep * (low - med), 0, 255)

    def facet_bands(mask, colf):
        nonlocal nb
        colf = flatten(colf, mask)
        bb = bands_key(colf, mask, mapf, q, F('step', 2.5), dy=F('dy', 7), minpx=6)
        nb += len(bb)
        return bb

    def grp(bb, path):
        return '<path fill="%s" d="%s"/><g filter="url(#pb)">%s</g>' % (bb[0][0], path, ''.join('<path fill="%s" d="%s"/>' % (c, dd) for c, dd in bb[1:]))

    def paint(dst, cid, path, m, fallback):
        mo = m & ~cav2
        mi = m & cav2
        done = False
        if mo.sum() > 6:
            bb = facet_bands(mo, disp)
            if bb:
                inn = ' clip-path="url(#pout)"' if mi.sum() > 6 else ''
                dst.append('<g clip-path="url(#%s)"><g%s>%s</g></g>' % (cid, inn, grp(bb, path)))
                done = True
        if mi.sum() > 6:
            cmp_ = np.clip((disp - (1 - ALC) * BG) / ALC, 0, 255)
            bb = facet_bands(mi, cmp_)
            if bb:
                dst.append('<g clip-path="url(#%s)"><g clip-path="url(#pin)" opacity="%s">%s</g></g>' % (cid, K.fmt(ALC), grp(bb, path)))
                done = True
            if nk and (mi & notok).sum() > 6:
                bb = facet_bands(mi, disp)
                if bb:
                    dst.append('<g clip-path="url(#%s)"><g clip-path="url(#pin)"><g mask="url(#pk)">%s</g></g></g>' % (cid, grp(bb, path)))
        if not done:
            dst.append('<path fill="%s" d="%s"/>' % (fallback, path))

    def hull_path(mask, grow=.7):
        pts = np.argwhere(mask)[:, ::-1].astype(np.float32)
        if len(pts) < 3:
            return None, None
        h = cv2.convexHull(pts)[:, 0, :]
        c = h.mean(0)
        v = h - c
        v /= np.linalg.norm(v, axis=1, keepdims=True) + 1e-9
        h = h + v * grow
        P = np.array([mapS(x, y) for x, y in h])
        return pd(P), P

    # edges: the narrow polished arris of each edge turns from one face's normal to the other's; it shines only where some
    # normal on that arc mirrors the light box (upper left), otherwise it shows as a fine dark line in the ring's own tint
    ew = F('ew', .3) * UNIT / K.UPC
    hv = L + EYE
    hv /= np.linalg.norm(hv)
    back_e = ''
    for k, R in enumerate(RINGS):
        tint = 255 * np.exp(-R.alpha * F('etint', 5)) ** (1 / 2.2) * F('edark', .55)
        dark = K.hexc(tint)
        rm = (part2 >= SURF0[k]) & (part2 < SURF0[k + 1])
        fall = K.hexc(np.median(disp[rm], 0) if rm.any() else BG)
        regions, outl, polys = [], [], {}
        if R.ell:
            # the cup: one rounded body (its narrow flats melt into the curve), painted as a whole within its outline
            sk = solo[k]
            sp_, _ = hull_path(sk >= 0)
            regions.append((R.m, sp_))
        else:
            _, polys = face_polys(R)
            for j in polys:
                if R.N[j] @ EYE > 1e-6:
                    regions.append((j, pd(proj(polys[j]))))
        for j, path in regions:
            gid = int(SURF0[k] + j)
            cid = 'f%d' % gid
            defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, path))
            m = (part2 == gid) & pure
            if R.ell:
                m = (part2 >= SURF0[k]) & (part2 < SURF0[k + 1])
            if R is TOPR and j == R.jt:
                # the top face: its far half behind the stems (back), its near half in front (body); the mouth behind
                bb = facet_bands(m, disp) if m.sum() > 6 else [(fall, None)]
                cy = mouthc[1]
                for half, dst in (('b', back), ('f', body)):
                    yy = (cy - 400, cy) if half == 'b' else (cy, cy + 400)
                    defs.append('<clipPath id="t%s"><path d="M%s %sH%sV%sH%sz"/></clipPath>' % (half, K.fmt(mouthc[0] - 300), K.fmt(yy[0]), K.fmt(mouthc[0] + 300), K.fmt(yy[1]), K.fmt(mouthc[0] - 300)))
                    dst.append('<g clip-path="url(#t%s)"><g clip-path="url(#%s)"><g clip-path="url(#tm)">%s</g></g></g>' % (half, cid, grp(bb, path)))
                mh = hole & pure
                if mh.sum() > 6:
                    bh = facet_bands(mh, disp)
                    defs.append('<clipPath id="ph"><path d="%s"/></clipPath>' % hole_d)
                    back.append('<g clip-path="url(#ph)">%s</g>' % grp(bh, hole_d))
                continue
            paint(body, cid, path, m, fall)
        # this ring's arrises (drawn with it: a higher ring then covers what it hides)
        groups = {'hi': '', 'mid': '', 'dark': ''}
        if polys:
            edges = {}
            for j in polys:
                pts = polys[j]
                for e in range(len(pts)):
                    a_, b_ = pts[e], pts[(e + 1) % len(pts)]
                    key = tuple(sorted((tuple(np.round(a_, 5)), tuple(np.round(b_, 5)))))
                    edges.setdefault(key, []).append(j)
            for (a_, b_), js in edges.items():
                if len(js) < 2 or not any(R.N[j] @ EYE > 1e-6 for j in js):
                    continue
                n1, n2 = R.N[js[0]], R.N[js[1]]
                arc = [(1 - t) * n1 + t * n2 for t in np.linspace(0, 1, 11)]
                lit = max(max(0, (n / np.linalg.norm(n)) @ hv) for n in arc) ** F('ep', 40)
                P_ = proj(np.array([a_, b_]))
                seg = 'M' + K.nums(np.round(P_[0] / q) * q) + 'L' + K.nums(np.round(P_[1] / q) * q)
                if R is TOPR and R.jt in js and P_[:, 1].max() < mouthc[1] + 1e-6:
                    back_e += seg
                elif R is TOPR and R.jt in js:
                    groups['hi'] += seg
                elif lit > F('ehi', .5):
                    groups['hi'] += seg
                elif lit > F('emid', .15):
                    groups['mid'] += seg
                else:
                    groups['dark'] += seg
        else:
            for P in outl:
                groups['mid'] += pd(P)
        for g_, col_, op_ in (('dark', dark, F('dop', .5)), ('mid', '#fffbea', F('mop', .4)), ('hi', '#fffdf4', F('eop', .9))):
            if groups[g_]:
                clip = ' clip-path="url(#f%d)"' % int(SURF0[k] + R.m) if (R.ell and g_ == 'mid') else ''
                body.append('<path%s fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s" stroke-linecap="round" d="%s"/>' % (
                    clip, col_, K.fmt(op_), K.fmt(ew * (1.3 if g_ == 'hi' else 1)), groups[g_]))
    # the mouth's lip: the far arc dark (seen from inside, behind the stems), the near one lit
    far = M2[np.sin(th) < 0]
    near = M2[np.sin(th) >= 0]
    pl = lambda P: 'M' + 'L'.join(K.nums(np.round(p / q) * q) for p in P)
    if back_e:
        back.append('<path fill="none" stroke="#fffbe8" stroke-opacity=".7" stroke-width="%s" d="%s"/>' % (K.fmt(ew), back_e))
    back.append('<path fill="none" stroke="#6a5418" stroke-opacity=".5" stroke-width="%s" d="%s"/>' % (K.fmt(ew), pl(far)))
    body.append('<path fill="none" stroke="#fffbe8" stroke-opacity=".85" stroke-width="%s" d="%s"/>' % (K.fmt(ew), pl(near)))
    sdefs, sbody, sback = ''.join(defs), ''.join(body), ''.join(back)
    out = os.path.join(HERE, 'out')
    if PROJ == 'photo':
        bgc = K.hexc(BG)
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 933"><defs>%s</defs><rect width="700" height="933" fill="%s"/>'
               '%s%s</svg>' % (sdefs, bgc, sback, sbody))
        open(os.path.join(out, 'coupes_photo.svg'), 'w').write(svg)
        print('photo svg %d bytes, %d bands, %.1fs' % (len(svg), nb, time.time() - t00))
        return
    vb = K.shop_vb(20, HMAX + 1.5, 1)
    bgc = K.hexc(BG)
    stems = ''
    sc_ = ((-14, '#4f7a36'), (-3, '#5f8a3e'), (8, '#3f6a2e'), (17, '#557f3a'))
    for dx, c in sc_:
        xa = mouthc[0] + dx
        xb = mouthc[0] + dx * .55
        stems += '<path d="M%s %sQ%s %s %s %s" stroke="%s" stroke-width="3" fill="none"/>' % (
            K.fmt(xa), K.fmt(mouthc[1] - 60), K.fmt(xa), K.fmt(mouthc[1] + 40), K.fmt(xb), K.fmt(cavb + 2), c)
    above = ''.join('<path d="M%s %sL%s %s" stroke="%s" stroke-width="3"/>' % (
        K.fmt(mouthc[0] + dx), K.fmt(mouthc[1] - 60), K.fmt(mouthc[0] + dx), K.fmt(mouthc[1]), c) for dx, c in sc_)
    for name, extra in (('shop', ''), ('shop_stems', '<g clip-path="url(#pin)">%s</g>%s' % (stems, above))):
        for bgn, bgv in (('', bgc), ('_dark', '#2b2a28')):
            svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs><rect x="0" y="0" width="1000" height="1100" fill="%s"/>'
                   '%s%s%s</svg>' % (vb, sdefs, bgv, sback, extra, sbody))
            open(os.path.join(out, 'coupes_%s%s.svg' % (name, bgn)), 'w').write(svg)
    K.write_body(os.path.join(out, 'body.json'), sdefs, sbody, back=sback, inner=inner, cavb=cavb, cavr=cavr)
    write_fiche(solo, mapS, mouthc)
    import gzip
    raw = open(os.path.join(out, 'body.json'), 'rb').read()
    print('body.json %d bytes, gzip %d, %d bands, %d paths, %.1fs' % (len(raw), len(gzip.compress(raw, 9)), nb, raw.count(b'<path'), time.time() - t00))


def write_fiche(solo, mapS, mouthc):
    """catalogue entry (outline shape): silhouette in shop units [x from the axis, height above the floor], mouth"""
    SSx = solo.shape[1] / (RES * 1.0)
    sil = (solo >= 0).any(0).astype(np.uint8)
    cs, _ = cv2.findContours(sil, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea).astype(np.float32)
    ss = int(F('ss', 2))
    c = cv2.approxPolyDP(c, F('olrdp', 1.2) * RES * ss, True)[:, 0, :]
    U = K.UPC
    pts = [[round(float(mapS(x, y)[0] - K.VX), 1), round(float(K.FL - mapS(x, y)[1]), 1)] for x, y in c]
    xs = [p[0] for p in pts]
    mh = round(float(K.FL - mouthc[1]), 1)
    fiche = {"id": "coupes-empilees", "refs": [], "n": "Coupes empilées", "m": "verre massif coloré, quatre anneaux taillés",
             "fam": "vase", "shape": "outline", "p": 0, "mat": "glass", "fin": "", "col": "#f0c040", "col2": "#c8306e",
             "lip": "plain", "lipw": round(2.4 * U, 1),
             "why": "Quatre anneaux de verre massif posés de biais l'un sur l'autre, chacun de sa taille et de sa teinte : "
                    "une coupe citron à fond épais, un octogone fuchsia, un hexagone orange évasé et un large heptagone ambre "
                    "incliné. Chaque teinte fonce là où le verre s'épaissit.",
             "ol": {"pts": pts, "mouth": [round((BX - RC) * U, 1), round((BX + RC) * U, 1), mh], "d": round(2 * 8.7 * U, 1)},
             "h": round(max(p[1] for p in pts), 1), "mo": round(RC * U * .9, 1), "mx": round(float(mouthc[0] - K.VX), 1), "mh": mh,
             "svgb": "coupes-empilees",
             "cm": {"h": round(max(p[1] for p in pts) / U, 1), "w": round(float(max(xs) - min(xs)) / U, 1), "d": round(2 * 8.7, 1)}}
    json.dump(fiche, open(os.path.join(HERE, 'out', 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
