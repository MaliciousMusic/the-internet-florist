# The yellow cut prism (vases5/prisme-jaune): a solid block of citrine glass cut into an octagonal prism bevelled to a point
# at both ends (two truncated pyramids joined by a narrow girdle a little below the middle), with a suspended drop-shaped
# pocket that opens at the top. The model is analytic (a convex polyhedron of 26 half-spaces, a pocket of revolution); the
# shop's studio is traced through it per pixel (Fresnel reflection, refraction, total internal reflection, absorption by the
# length of glass crossed), and only curves leave: per facet, the tone bands of the traced field clipped to the facet's exact
# polygon, the pocket seen through the front faces as a half-transparent layer (the stems show there), crisp lit edges.
#   python mk.py [shop|photo] [key=value ...]  ->  out/prisme_<proj>.svg (+ out/body.json and out/fiche.json for shop)
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

# ---------------------------------------------------------------- the model, in cm: x right, y up, z towards the eye
H = F('H', 25.1)                                     # height: the faceted sommerso of the same model sold on 1stDibs, 25.1 cm
# the cut, measured on the photograph (2026-10-16 decision: an exact copy): a six-sided block whose opposite faces are
# parallel (sawn), sharp side corners, a narrow facet at the front and the back; two frustums joined at a sharp girdle
# (no band). Section at the girdle, x right, z to the eye, in cm: left corner, front facet, right corner (the back is the
# point reflection of the front)
SEC = V3('sec', '-4.950,-.062,-1.348,3.404,.775,3.404,4.951,.095,.775,-3.404,-1.348,-3.404')   # fit_cut.py (6 vertices)
SECP = SEC.reshape(-1, 2)
DTOP = V3('dtop', '1.934,1.722,1.415,1.517,1.738,1.770')   # offset of each face at the top and at the foot (cm), fit_cut.py
DBOT = V3('dbot', '2.334,1.907,1.569,1.468,1.943,2.044')
HG0 = F('hg0', 10.903); HG1 = HG0 + F('band', 0)       # the girdle, 44 % of the height (sharp)
ST, SB = F('st', .508), F('sb', .55)                 # top and foot, as a fraction of the girdle (measured: 185 / 364, 201 / 364)
YAW = math.radians(F('yaw', 0))                      # the photograph's view is the reference: the measured section already holds it
TE = K.RY                                            # the shop's eye: y_screen_up = y - z * TE (a circle r -> ellipse r x .16 r)
HB = F('hb', 7.2)                                    # bottom of the pocket
RM, RT = F('rm', 2.55), F('rt', 1.45)                # widest radius of the pocket and radius of the mouth
U1 = F('u1', .27) * (H - HB)                          # height of the widest point above the pocket's bottom
EZ = F('ez', .95)
PXC = F('pxc', -.3)                                  # the pocket's axis, a little left of the girdle's centre (measured)                                    # the pocket is a little flatter front to back (it follows the block)
NG = 1.5                                             # refractive index of the glass
ALPHA = V3('alpha', '.04,.11,.65')                   # absorption of the citrine glass per cm (r, g, b): blue goes first
NF = len(SECP)
DST = V3('dst', ','.join(['0'] * NF))                # per-face departures of the bevel slopes (none measured)
DSB = V3('dsb', ','.join(['0'] * NF))


def section_edges():
    """outward normal angle and offset of each side of the girdle's section"""
    out = []
    P = SECP
    for i in range(len(P)):
        p, q = P[i], P[(i + 1) % len(P)]
        e = q - p
        n = np.array([e[1], -e[0]]); n /= np.linalg.norm(n)       # clockwise in (x, z) seen from above -> outward
        if n @ p < 0:
            n = -n
        out.append((math.atan2(n[1], n[0]), float(n @ p), i))
    return out


SIDES = section_edges()


def build_planes():
    P, names = [], []
    for k_, (a_, d, i) in enumerate(SIDES):
        th = a_ + YAW
        nx, nz = math.cos(th), math.sin(th)
        if HG1 > HG0:
            P.append((nx, 0, nz, d)); names.append('band%d' % k_)
        c = (DTOP[i] - d) / (H - HG1)                 # each face's own slope: its offset goes from d (girdle) to DTOP (top)
        P.append((nx, -c, nz, d - c * HG1)); names.append('up%d' % k_)
        c2 = (d - DBOT[i]) / HG0
        P.append((nx, -c2, nz, DBOT[i])); names.append('lo%d' % k_)
    hf, df = F('hfoot', .8), F('dfoot', 0)
    if df > 0:                                       # an optional bevel round the foot (not on the photographed piece)
        for k_, (a_, d, i) in enumerate(SIDES):
            th = a_ + YAW
            nx, nz = math.cos(th), math.sin(th)
            sb = SB + DSB[i]
            s_hf = sb + (1 - sb) * hf / HG0
            s0 = sb - df
            P.append((nx, -d * (s_hf - s0) / hf, nz, d * s0)); names.append('ft%d' % k_)
    P.append((0, 1, 0, H)); names.append('top')
    P.append((0, -1, 0, 0)); names.append('foot')
    P = np.array(P, float)
    n = np.linalg.norm(P[:, :3], axis=1)
    return P[:, :3] / n[:, None], P[:, 3] / n, names


NP, CP, NAMES = build_planes()
JTOP = NAMES.index('top')
EYE = np.array([0, TE, 1.]); EYE /= np.linalg.norm(EYE)          # towards the eye
DV = -EYE                                                         # the view ray
L = np.array([-.5, .62, .6]); L /= np.linalg.norm(L)              # the shop light (v1a.js LV), y up here
LB = V3('lb', '.25,.65,-.7'); LB /= np.linalg.norm(LB)             # a soft back light (contre-jour)


def rcav(h):
    """radius of the pocket at height h (negative below its bottom, so that the field stays positive there)"""
    u = h - HB
    a = np.clip(u / U1, 0, 1)
    cap = RM * np.clip(1 - (1 - a) ** 2, 0, 1) ** (.5 * F('capk', 1.6))
    b = np.clip((u - U1) / (H - HB - U1), 0, 1)
    neck = RT + (RM - RT) * .5 * (1 + np.cos(np.pi * b))
    r = np.where(u < U1, cap, neck)
    return np.where(u < 0, -1.0 + u, r)


def fcav(p):
    return np.hypot(p[:, 0] - PXC, p[:, 2] / EZ) - rcav(p[:, 1])


def ncav(p):
    """normal of the pocket's wall, pointing into the glass"""
    rho = np.maximum(np.hypot(p[:, 0] - PXC, p[:, 2] / EZ), 1e-6)
    e = 1e-3
    dr = (rcav(p[:, 1] + e) - rcav(p[:, 1] - e)) / (2 * e)
    n = np.stack([(p[:, 0] - PXC) / rho, -dr, p[:, 2] / (rho * EZ * EZ)], 1)
    return n / np.linalg.norm(n, axis=1, keepdims=True)


# ---------------------------------------------------------------- the studio, seen in a direction (linear light)
WALL = (V3('bg', '238,235,229') / 255) ** 2.2


def env(d, p=None):
    if PHOTO_ENV is not None and p is not None:
        return env_photo(d, p)
    return env_shop(d)


def env_shop(d):
    x, y, z = d[:, 0], d[:, 1], d[:, 2]
    ss = lambda a, b, v: np.clip((v - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((v - a) / (b - a), 0, 1))
    front = V3('front', '.04,.04,.04')
    hor = WALL * (1 - ss(F('hz0', .05), F('hz1', .25), z)[:, None]) + front * ss(F('hz0', .05), F('hz1', .25), z)[:, None]
    # black flags at the sides of the studio (glass is defined by what it mirrors): a deep one on the right, away from the
    # light, a lighter one low on the left
    vy = ss(-F('fly', .55), -F('fly', .55) + .2, -np.abs(y - .05))
    fr = ss(F('fr0', .3), F('fr1', .45), x) * vy
    hor = hor * (1 - F('frk', .97) * fr[:, None])
    flft = ss(F('fr0', .3), F('fr1', .45), -x) * vy
    hor = hor * (1 - F('flk', .97) * flft[:, None])
    ceil = V3('ceil', '1.05,1.04,1.02')
    table = V3('table', '.72,.7,.66')                # the stand the vessel sits on, seen a little below the horizon
    floor = V3('floor', '.05,.05,.048')               # the shadowed ground right under the block
    for k_, xs_ in enumerate(V3('bars', '-.3,.12,.42')):
        bar = ss(-F('barw', .05), -F('barw', .05) * .4, -np.abs(x - xs_)) * ss(-.7, -.3, -np.abs(y)) * (z < 0)
        hor = hor * (1 - F('bark', 0) * bar[:, None])
    c = hor * (1 - ss(.25, .35, y)[:, None]) + ceil * ss(.25, .35, y)[:, None]
    tb = ss(.02, .08, -y)[:, None]
    c = c * (1 - tb) + table * tb
    fl = ss(F('fl0', .8), F('fl1', .97), -y)[:, None]
    c = c * (1 - fl) + floor * fl
    key = ss(math.cos(math.radians(F('keyr', 24))), math.cos(math.radians(F('keyr', 24) * .7)), d @ L)
    c = c + F('keyi', 7) * key[:, None] * np.array([1, .98, .94])
    bk = ss(math.cos(math.radians(F('bkr', 30))), math.cos(math.radians(F('bkr', 30) * .5)), d @ LB)
    c = c + F('bki', 4) * bk[:, None] * np.array([1, .97, .9])
    return c


# ---------------------------------------------------------------- the photograph's room, for the measured comparison only
# The light probe of the photograph: what the camera saw around the block (the vase itself removed by interpolating the
# backdrop across it, row by row), laid on the table (h = 0) and on the wall behind (ZW cm behind the axis, where the
# table meets the wall in the image), plus the sun. Only used by "python mk.py photo": the shop never sees the photograph.
PHOTO_ENV = None
ZW = F('zw', 28)
SUN = V3('sun', '.62,.5,-.6'); SUN /= np.linalg.norm(SUN)


def load_photo_env():
    im = cv2.imread(os.path.join(HERE, 'out', 'ref.jpg')).astype(np.float32)[:, :, ::-1] / 255
    m = cv2.imread(os.path.join(HERE, 'out', 'mask_ref.png'), 0) > 0
    m = cv2.dilate(m.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
    plate = im.copy()
    for y in np.nonzero(m.any(1))[0]:
        xs = np.nonzero(m[y])[0]
        a, b = xs.min() - 1, xs.max() + 1
        ca, cb = im[y, max(a - 6, 0):a + 1].mean(0), im[y, b:b + 7].mean(0)
        t = np.linspace(0, 1, b - a + 1)[:, None]
        plate[y, a:b + 1] = ca * (1 - t) + cb * t
    plate = cv2.GaussianBlur(plate, (0, 0), F('plbl', 2.0))
    return np.clip(plate, 0, 1) ** 2.2


def env_photo(d, p):
    """radiance (linear) of the photographed room seen from point p (cm) in direction d"""
    n = len(d)
    out = np.tile(V3('room', '.05,.05,.05'), (n, 1))          # behind the camera: a dim room
    dy = np.where(np.abs(d[:, 1]) > 1e-9, d[:, 1], -1e-9)
    dz = np.where(np.abs(d[:, 2]) > 1e-9, d[:, 2], -1e-9)
    tt = np.where(d[:, 1] < 0, -p[:, 1] / dy, np.inf)           # the table
    tw = np.where(d[:, 2] < 0, (-ZW - p[:, 2]) / dz, np.inf)     # the wall
    t = np.minimum(tt, tw)
    hit = np.isfinite(t)
    q = p[hit] + t[hit, None] * d[hit]
    q[:, 2] = np.maximum(q[:, 2], -ZW)
    zc = DC - q[:, 2]
    X = PCX + FOC * q[:, 0] / zc
    Y = PEY + FOC * (HE - q[:, 1]) / zc
    Hh, Ww = PHOTO_ENV.shape[:2]
    X = np.clip(X, 0, Ww - 1.001); Y = np.clip(Y, 0, Hh - 1.001)
    x0, y0 = np.floor(X).astype(int), np.floor(Y).astype(int); fx, fy = (X - x0)[:, None], (Y - y0)[:, None]
    P = PHOTO_ENV
    out[hit] = (P[y0, x0] * (1 - fx) * (1 - fy) + P[y0, x0 + 1] * fx * (1 - fy) + P[y0 + 1, x0] * (1 - fx) * fy + P[y0 + 1, x0 + 1] * fx * fy)
    # up, over the wall's top edge: a pale ceiling
    up = ~hit & (d[:, 1] > 0)
    out[up] = V3('pceil', '.5,.5,.5')
    # the sun, a small bright disc
    sun = np.clip((d @ SUN - math.cos(math.radians(F('sunr', 3)))) / (1 - math.cos(math.radians(F('sunr', 3)))) * 4, 0, 1)
    return out + F('suni', 40) * sun[:, None] * np.array([1, .97, .9])


def fresnel(ci, ct, n1, n2):
    rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct)
    rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci)
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


def convex_exit(p, d):
    nd = d @ NP.T
    num = CP[None] - p @ NP.T
    t = np.where(nd > 1e-12, num / np.where(nd > 1e-12, nd, 1), np.inf)
    j = np.argmin(t, 1)
    return np.maximum(t[np.arange(len(p)), j], 0), j


DT = F('dt', .05)


def march(p, d, ta, tb, sgn):
    """first t in [ta, tb] where sgn * fcav changes from positive to negative (inf if none), refined by bisection"""
    res = np.full(len(p), np.inf)
    act = np.nonzero(ta < tb)[0]
    t = ta.copy()
    while act.size:
        tn = np.minimum(t[act] + DT, tb[act])
        fn = sgn * fcav(p[act] + tn[:, None] * d[act])
        cr = fn < 0
        if cr.any():
            ii = act[cr]; lo = t[ii].copy(); hi = tn[cr].copy()
            for _ in range(14):
                mid = (lo + hi) / 2
                neg = sgn * fcav(p[ii] + mid[:, None] * d[ii]) < 0
                hi = np.where(neg, mid, hi); lo = np.where(neg, lo, mid)
            res[ii] = hi
        t[act] = tn
        act = act[~cr & (tn < tb[act])]
    return res


def cavity_from_glass(p, d, tmax):
    """t where a ray inside the glass meets the pocket (inf if it does not), searched only inside the pocket's cylinder"""
    R = RM * max(1, EZ) + .05
    a = d[:, 0] ** 2 + d[:, 2] ** 2
    b = 2 * ((p[:, 0] - PXC) * d[:, 0] + p[:, 2] * d[:, 2])
    c = (p[:, 0] - PXC) ** 2 + p[:, 2] ** 2 - R * R
    disc = b * b - 4 * a * c
    sq = np.sqrt(np.maximum(disc, 0))
    aa = np.where(a > 1e-12, a, 1)
    t0 = np.where(a > 1e-12, (-b - sq) / (2 * aa), np.where(c < 0, -np.inf, np.inf))
    t1 = np.where(a > 1e-12, (-b + sq) / (2 * aa), np.where(c < 0, np.inf, -np.inf))
    t0 = np.where((a > 1e-12) & (disc < 0), np.inf, t0)
    dy = np.where(np.abs(d[:, 1]) > 1e-12, d[:, 1], 1e-12)
    h0 = (HB - p[:, 1]) / dy; h1 = (H - p[:, 1]) / dy
    s0, s1 = np.minimum(h0, h1), np.maximum(h0, h1)
    ta = np.maximum.reduce([t0, s0, np.full(len(p), 2e-4)])
    tb = np.minimum.reduce([t1, s1, tmax])
    return march(p, d, ta, tb, 1)


def absorb(Lt):
    """transmission after a length Lt of glass; past a few cm the length is taken with a soft cap, so that light trapped by
    many internal reflections stays a deep amber instead of turning brown (the glass is clear, never muddy)"""
    Lc = F('lcap', 9)
    Le = Lc * (1 - np.exp(-Lt / Lc))
    return np.exp(-ALPHA[None] * Le[:, None])


def trace(o, d):
    """the studio seen through the block along each ray. Returns colour (linear), the part hit first (plane index, -2 the
    mouth's opening, -1 nothing) and whether the first refracted ray reaches the pocket's air (where stems are seen)"""
    N = len(o)
    col = np.zeros((N, 3)); part = np.full(N, -1); cavp = np.zeros(N, bool); cavt = np.zeros(N, bool)
    nd = d @ NP.T; num = CP[None] - o @ NP.T
    tin = np.where(nd < -1e-12, num / np.where(nd < -1e-12, nd, -1), -np.inf)
    tout = np.where(nd > 1e-12, num / np.where(nd > 1e-12, nd, 1), np.inf)
    te, je, tx = tin.max(1), tin.argmax(1), tout.min(1)
    idx = np.nonzero(te < tx)[0]
    p = o[idx] + te[idx, None] * d[idx]; dd = d[idx]; j = je[idx]
    part[idx] = j
    hole = (j == JTOP) & (np.hypot(p[:, 0] - PXC, p[:, 2] / EZ) < RT)
    part[idx[hole]] = -2
    Q = []   # batches: (pixel, position, direction, Fresnel weight, glass length, medium 0 glass / 1 pocket air, depth, primary)
    if hole.any():
        nh = int(hole.sum())
        Q.append((idx[hole], p[hole], dd[hole], np.ones(nh), np.zeros(nh), 1, 0, False))
    g = ~hole
    n = NP[j[g]]
    r, t, Fr, _ = interface(dd[g], n, 1, NG)
    col[idx[g]] += Fr[:, None] * env(r, p[g])
    Q.append((idx[g], p[g] + 1e-5 * t, t, 1 - Fr, np.zeros(int(g.sum())), 0, 0, True))
    WMIN, MAXD = F('wmin', .012), int(F('maxd', 6))
    nseg = 0
    while Q:
        ii, p, d, wf, lt, m, dep, prim = Q.pop()
        if len(ii) == 0:
            continue
        nseg += len(ii)
        last = dep + 1 >= MAXD
        if m == 0:
            tex, jx = convex_exit(p, d)
            tc = cavity_from_glass(p, d, tex)
            inc = tc < tex
            tt = np.where(inc, tc, tex)
            q = p + tt[:, None] * d
            lt = lt + tt
            o_ = ~inc
            if o_.any():                               # out of the block through a face
                nn = -NP[jx[o_]]
                r, t, Fr, tir = interface(d[o_], nn, NG, 1)
                T = absorb(lt[o_]) * wf[o_, None]
                ok = ~tir
                np.add.at(col, ii[o_][ok], (T[ok] * (1 - Fr[ok])[:, None]) * env(t[ok], q[o_][ok]))
                wr = wf[o_] * Fr
                if last:                               # the last bounce: let the rest leave as it is headed
                    np.add.at(col, ii[o_], (T * Fr[:, None]) * env(r, q[o_]))
                else:
                    keep = wr > WMIN
                    Q.append((ii[o_][keep], q[o_][keep] + 1e-5 * r[keep], r[keep], wr[keep], lt[o_][keep], 0, dep + 1, False))
            if inc.any():                              # into the pocket's air
                nn = ncav(q[inc])
                r, t, Fr, tir = interface(d[inc], nn, NG, 1)
                if prim:
                    cavp[ii[inc]] = (~tir) & (Fr < .5)
                    cavt[ii[inc]] = True
                wt = wf[inc] * (1 - Fr); wr = wf[inc] * Fr
                if not last:
                    kt = (~tir) & (wt > WMIN); kr = wr > WMIN
                    Q.append((ii[inc][kt], q[inc][kt] + 2e-4 * t[kt], t[kt], wt[kt], lt[inc][kt], 1, dep + 1, False))
                    Q.append((ii[inc][kr], q[inc][kr] + 2e-4 * r[kr], r[kr], wr[kr], lt[inc][kr], 0, dep + 1, False))
                else:
                    np.add.at(col, ii[inc], (absorb(lt[inc]) * wf[inc, None]) * env(d[inc], q[inc]))
        else:
            dy = d[:, 1]
            ttop = np.where(dy > 1e-9, (H + .02 - p[:, 1]) / np.where(dy > 1e-9, dy, 1), 60.)
            tw = march(p, d, np.full(len(p), 1e-4), ttop, -1)
            esc = ~np.isfinite(tw)
            if esc.any():
                np.add.at(col, ii[esc], (absorb(lt[esc]) * wf[esc, None]) * env(d[esc], p[esc]))
            h_ = ~esc
            if h_.any():
                q = p[h_] + tw[h_, None] * d[h_]
                nn = -ncav(q)
                r, t, Fr, tir = interface(d[h_], nn, 1, NG)
                wt = wf[h_] * (1 - Fr); wr = wf[h_] * Fr
                if not last:
                    kt = wt > WMIN; kr = wr > WMIN
                    Q.append((ii[h_][kt], q[kt] + 2e-4 * t[kt], t[kt], wt[kt], lt[h_][kt], 0, dep + 1, False))
                    Q.append((ii[h_][kr], q[kr] + 2e-4 * r[kr], r[kr], wr[kr], lt[h_][kr], 1, dep + 1, False))
                else:
                    np.add.at(col, ii[h_], (absorb(lt[h_]) * wf[h_, None]) * env(t, q))
    return col, part, cavp | (cavt << 1), nseg


# ---------------------------------------------------------------- polygons of the faces (exact), and the projections
def face_polys():
    J = len(NP); V = []
    for a, b, c in itertools.combinations(range(J), 3):
        M = NP[[a, b, c]]
        if abs(np.linalg.det(M)) < 1e-9:
            continue
        v = np.linalg.solve(M, CP[[a, b, c]])
        if np.all(NP @ v <= CP + 1e-7):
            V.append(v)
    V = np.unique(np.round(np.array(V), 7), axis=0)
    polys = {}
    for j in range(J):
        on = V[np.abs(V @ NP[j] - CP[j]) < 1e-6]
        if len(on) < 3:
            continue
        c = on.mean(0); n = NP[j]
        u = np.cross(n, [0, 1, 0] if abs(n[1]) < .9 else [1, 0, 0]); u /= np.linalg.norm(u); v = np.cross(n, u)
        ang = np.arctan2((on - c) @ v, (on - c) @ u)
        polys[j] = on[np.argsort(ang)]
    return V, polys


if PROJ == 'photo':
    # the photograph's camera, fitted on the silhouette: a pinhole far away (the top is seen edge on, the foot a little from
    # above: the eye is level with the top, about 2.3 m away), 37.05 px per cm at the axis, axis at x = 599
    PK = F('pk', 36.713); PCX = F('pcx', 599); PEY = F('pey', 318.5); DC = F('dc', 232); HE = F('he', H)
    FOC = PK * DC
    OUT = lambda x, yu: (PCX + x * PK, PEY + (HE - yu) * PK)          # for points of the axis plane (z = 0)
    RES = F('res', .5)
    FRAME = (0, 0, 1200, 1600)
    EYE = np.array([0, .004, 1.]); EYE /= np.linalg.norm(EYE)
else:
    OUT = lambda x, yu: (K.VX + x * K.UPC, K.FL - yu * K.UPC)
    RES = F('res', 3.0)
    FRAME = None
UNIT = (OUT(1, 0)[0] - OUT(0, 0)[0])      # output units per cm


def proj(v):
    v = np.atleast_2d(v)
    if PROJ == 'photo':
        return np.array([(PCX + FOC * x / (DC - z), PEY + FOC * (HE - y) / (DC - z)) for x, y, z in v])
    return np.array([OUT(x, y - z * TE) for x, y, z in v])


def rays(XX, YY):
    """origin and direction of the eye's ray through each output point"""
    if PROJ == 'photo':
        d = np.stack([(XX - PCX) / FOC, -(YY - PEY) / FOC, -np.ones_like(XX)], -1).reshape(-1, 3)
        d /= np.linalg.norm(d, axis=1, keepdims=True)
        o = np.tile([0, HE, DC], (len(d), 1)).astype(float)
        return o, d
    xm = (XX - OUT(0, 0)[0]) / UNIT
    yu = (OUT(0, 0)[1] - YY) / UNIT
    z0 = 30.0
    o = np.stack([xm.ravel(), (yu + z0 * TE).ravel(), np.full(xm.size, z0)], 1)
    return o, np.tile(DV, (len(o), 1))


def main():
    global PHOTO_ENV
    if PROJ == 'photo' and F('penv', 1) > 0:
        PHOTO_ENV = load_photo_env()
    V, polys = face_polys()
    P2 = proj(V)
    x0, y0 = P2.min(0) - 3 / RES - 2; x1, y1 = P2.max(0) + 3 / RES + 2
    W_, H_ = int(math.ceil((x1 - x0) * RES)), int(math.ceil((y1 - y0) * RES))
    SS = int(F('ss', 2))
    print('field %dx%d, ss %d, %d faces' % (W_, H_, SS, len(polys)))
    # rays at the sub-pixel centres
    gx = x0 + (np.arange(W_ * SS) + .5) / (RES * SS)
    gy = y0 + (np.arange(H_ * SS) + .5) / (RES * SS)
    XX, YY = np.meshgrid(gx, gy)
    o, d = rays(XX, YY)
    col = np.zeros((len(o), 3)); part = np.full(len(o), -1); cavp = np.zeros(len(o), np.uint8)
    CH = 60000; nseg = 0
    for s in range(0, len(o), CH):
        c_, p_, k_, n_ = trace(o[s:s + CH], d[s:s + CH])
        col[s:s + CH] = c_; part[s:s + CH] = p_; cavp[s:s + CH] = k_; nseg += n_
    print('traced %d rays, %d segments, %.1fs' % (len(o), nseg, time.time() - t00))
    # display colour: soft shoulder, then sRGB-like gamma
    col = col * F('gain', 1)
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
    np.save(os.path.join(HERE, 'out', 'field_%s.npy' % PROJ), np.dstack([disp, part2, cav2, touch]).astype(np.float32))
    json.dump({'x0': float(x0), 'y0': float(y0), 'res': RES}, open(os.path.join(HERE, 'out', 'field_%s.json' % PROJ), 'w'))
    pv = disp.copy(); pv[part2 == -1] = V3('bg', '238,235,229')
    cv2.imwrite(os.path.join(HERE, 'out', 'field_%s.png' % PROJ), pv[:, :, ::-1].astype(np.uint8))
    return emit(disp, part2, pure, cav2, polys, (x0, y0), V, touch)


def bands_key(col, mask, mapf, q, step, dy=11.0, minpx=10):
    """svgkit.bands with the bins taken on lightness plus blue: in a yellow glass the pale, clear zones and the saturated
    amber ones share a lightness, and must not be averaged into one muddy tone"""
    Y = col @ np.array([.3, .59, .11]) + F('kb', 1.0) * col[..., 2]
    Ye, me = K.extend(Y, mask, 6)
    ce, _ = K.extend(col, mask, 6)
    vals = Y[mask]
    if vals.size < minpx:
        return []
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


def emit(disp, part2, pure, cav2, polys, org, V, touch):
    x0, y0 = org
    q = F('q', .2 if PROJ == 'shop' else 1.0)
    mapf = lambda x, y: (x0 + (x + .5) / RES, y0 + (y + .5) / RES)
    K.S = 1.0
    K.RDP_EPS = F('rdp', .5); K.FIT_EPS = 0; K.AREA_MIN = F('amin', 6) * RES * RES / 9
    if F('csm', .6) > 0:
        disp = cv2.GaussianBlur(disp, (0, 0), F('csm', .6))
    BG = V3('bg', '238,235,229')
    ALC = F('alc', .55)                       # opacity of the pocket's layer over the stems
    defs, body, back = [], [], []
    blur = F('blur', .45) * (1 if PROJ == 'shop' else UNIT / K.UPC)
    defs.append('<filter id="pb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(blur))
    pd = lambda pts: 'M' + 'L'.join(K.nums(np.round(np.array(p) / q) * q) for p in pts) + 'z'
    # the pocket as seen through the front faces (the stems show there) and through the mouth
    hole = part2 == -2
    # the half-transparent layer can only reach colours lighter than (1 - ALC) x background: where the pocket's image is
    # darker or more saturated than that (its rim, the amber crown of its bottom), the true colour is laid over it, opaque,
    # through a feathered mask (no seam)
    comp = (disp - (1 - ALC) * BG) / ALC
    notok = (comp.min(2) < -F('ctol', 4)) | (comp.max(2) > 255 + F('ctol', 4))
    notok = cv2.morphologyEx(notok.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool) & cav2
    K.AREA_MIN, a_ = F('namin', 12) * RES * RES / 9, K.AREA_MIN
    nk = K.contour_paths(cv2.GaussianBlur(notok.astype(np.float32), (0, 0), .8), .5, 2.0, q, mapf, 1.0)
    K.AREA_MIN = a_
    if nk:
        defs.append('<filter id="pf" x="-10%%" y="-10%%" width="120%%" height="120%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                    '<mask id="pk" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><path fill="#fff" filter="url(#pf)" d="%s"/></mask>'
                    % (K.fmt(F('feath', 1.0) * UNIT / K.UPC), nk))
    cm = (cav2 | hole).astype(np.uint8)
    cm = cv2.morphologyEx(cm, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cs, _ = cv2.findContours(cm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    inner, cavb, cavr = '', None, None
    if cs:
        cc = max(cs, key=cv2.contourArea)[:, 0, :].astype(float)
        ccs = np.array([np.convolve(np.r_[cc[-4:, k], cc[:, k], cc[:4, k]], np.ones(9) / 9, 'valid') for k in (0, 1)]).T
        pts = [mapf(x, y) for x, y in ccs[::2]]
        inner = pd(pts)
        ys = np.array([p[1] for p in pts]); xs = np.array([p[0] for p in pts])
        cavb = round(float(ys.max()) - F('cavbk', 6), 1)
        band = ys > ys.max() - (ys.max() - ys.min()) * .12
        cavr = round(float((xs[band].max() - xs[band].min()) / 2), 1)
    defs.append('<clipPath id="pin"><path d="%s"/></clipPath>' % inner)
    BIG = (-2000, -2000, 6000, 6000)
    defs.append('<clipPath id="pout"><path clip-rule="evenodd" d="M-2000-2000h6000v6000h-6000z%s"/></clipPath>' % inner)
    vis = [j for j in polys if NP[j] @ EYE > 1e-6]
    mouthc = OUT(PXC, H)
    nb = 0

    def flatten(colf, mask):
        if F('flat', .8) <= 0 or mask.sum() < 20:
            return colf
        m = mask.astype(np.float32)
        sg = F('flats', 6) * RES
        low = cv2.GaussianBlur(colf * m[..., None], (0, 0), sg) / np.maximum(cv2.GaussianBlur(m, (0, 0), sg), 1e-3)[..., None]
        med = np.median(colf[mask], 0)
        # the pocket's image (and its rim) is a sharp refraction, never flattened
        keep = cv2.GaussianBlur((~touch).astype(np.float32), (0, 0), 1.5)[..., None]
        return np.clip(colf - F('flat', .8) * keep * (low - med), 0, 255)

    def facet_bands(mask, colf):
        colf = flatten(colf, mask)
        nonlocal nb
        bb = bands_key(colf, mask, mapf, q, F('step', 2.5), dy=F('dy', 9), minpx=6)
        nb += len(bb)
        return bb

    for j in vis:
        poly2 = proj(polys[j])
        cid = 'f%d' % j
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, pd(poly2)))
        m = (part2 == j) & pure
        if j == JTOP:
            continue
        mo = m & ~cav2
        mi = m & cav2
        if mo.sum() > 6:
            bb = facet_bands(mo, disp)
            if bb:
                inn = ' clip-path="url(#pout)"' if mi.sum() > 6 else ''
                body.append('<g clip-path="url(#%s)"><g%s><path fill="%s" d="%s"/><g filter="url(#pb)">%s</g></g></g>' % (
                    cid, inn, bb[0][0], pd(poly2), ''.join('<path fill="%s" d="%s"/>' % (c, dd) for c, dd in bb[1:])))
        if mi.sum() > 6:
            comp = np.clip((disp - (1 - ALC) * BG) / ALC, 0, 255)
            bb = facet_bands(mi, comp)
            if bb:
                body.append('<g clip-path="url(#%s)"><g clip-path="url(#pin)" opacity="%s"><path fill="%s" d="%s"/><g filter="url(#pb)">%s</g></g></g>' % (
                    cid, K.fmt(ALC), bb[0][0], pd(poly2), ''.join('<path fill="%s" d="%s"/>' % (c, dd) for c, dd in bb[1:])))
            mn = mi & notok
            if nk and mn.sum() > 6:
                bb = facet_bands(mi, disp)
                if bb:
                    body.append('<g clip-path="url(#%s)"><g clip-path="url(#pin)"><g mask="url(#pk)"><path fill="%s" d="%s"/><g filter="url(#pb)">%s</g></g></g></g>' % (
                        cid, bb[0][0], pd(poly2), ''.join('<path fill="%s" d="%s"/>' % (c, dd) for c, dd in bb[1:])))
    # the top face: its far half behind the stems (back), its near half in front (body); the mouth's opening behind
    if JTOP in polys:
        poly2 = proj(polys[JTOP])
        rx, ry = RT * UNIT, RT * EZ * TE * UNIT
        hole_d = 'M%sa%s 0 1 0 %s 0a%s 0 1 0 %s 0z' % (K.nums([mouthc[0] - rx, mouthc[1]]), K.nums([rx, ry]), K.fmt(2 * rx), K.nums([rx, ry]), K.fmt(-2 * rx))
        mt = (part2 == JTOP) & pure
        bb = facet_bands(mt, disp) if mt.sum() > 6 else []
        cy = mouthc[1]
        for half, dst in (('b', back), ('f', body)):
            yy = (cy - 400, cy) if half == 'b' else (cy, cy + 400)
            defs.append('<clipPath id="t%s"><path d="M%s %sH%sV%sH%sz"/></clipPath>' % (half, K.fmt(mouthc[0] - 300), K.fmt(yy[0]), K.fmt(mouthc[0] + 300), K.fmt(yy[1]), K.fmt(mouthc[0] - 300)))
            if mt.sum() > 6:
                # the cut top seen at a glance: a polished flat of thick glass, lit through its length (the trace sees it
                # at 9 degrees, mostly mirroring the room; the eye reads it as the brightest yellow of the piece)
                tcol = K.hexc(V3('topc', '248,236,160'))
                dst.append('<g clip-path="url(#t%s)"><path fill-rule="evenodd" fill="%s" d="%s%s"/></g>' % (half, tcol, pd(poly2), hole_d))
        # the inside of the pocket seen through the opening
        mh = hole & pure
        if mh.sum() > 6:
            bh = facet_bands(mh, disp)
            defs.append('<clipPath id="ph"><path d="%s"/></clipPath>' % hole_d)
            back.append('<g clip-path="url(#ph)"><path fill="%s" d="%s"/><g filter="url(#pb)">%s</g></g>' % (
                bh[0][0], hole_d, ''.join('<path fill="%s" d="%s"/>' % (c, dd) for c, dd in bh[1:])))
    # crisp edges: the narrow polished arris of each edge turns from one face's normal to the other's; it shines only where
    # some normal on that arc mirrors the light box (upper left), otherwise it shows as a fine dark refraction line
    edges = {}
    for j in polys:
        pts = polys[j]
        for k in range(len(pts)):
            a_, b_ = pts[k], pts[(k + 1) % len(pts)]
            key = tuple(sorted((tuple(np.round(a_, 5)), tuple(np.round(b_, 5)))))
            edges.setdefault(key, []).append(j)
    ew = F('ew', .3) * UNIT / K.UPC
    hv = L + EYE; hv /= np.linalg.norm(hv)
    groups = {'hi': '', 'mid': '', 'dark': '', 'back': ''}
    for (a_, b_), js in edges.items():
        if not any(j in vis for j in js) or len(js) < 2:
            continue
        n1, n2 = NP[js[0]], NP[js[1]]
        arc = [(1 - t) * n1 + t * n2 for t in np.linspace(0, 1, 11)]
        lit = max(max(0, (n / np.linalg.norm(n)) @ hv) for n in arc) ** F('ep', 40)
        P_ = proj(np.array([a_, b_]))
        seg = 'M' + K.nums(np.round(P_[0] / q) * q) + 'L' + K.nums(np.round(P_[1] / q) * q)
        if (JTOP in js) and (P_[:, 1].max() < mouthc[1] + 1e-6):
            groups['back'] += seg
        elif JTOP in js:
            groups['hi'] += seg
        elif lit > F('ehi', .5):
            groups['hi'] += seg
        elif lit > F('emid', .15):
            groups['mid'] += seg
        else:
            groups['dark'] += seg
    for g_, col_, op_ in (('dark', '#8a5a06', F('dop', .45)), ('mid', '#fff8dc', F('mop', .45)), ('hi', '#fffdf2', F('eop', .95))):
        if groups[g_]:
            body.append('<path fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s" stroke-linecap="round" d="%s"/>' % (col_, K.fmt(op_), K.fmt(ew * (1.3 if g_ == 'hi' else 1)), groups[g_]))
    back_e = groups['back']
    if JTOP in polys:
        rx, ry = RT * UNIT, RT * EZ * TE * UNIT
        back.append('<path fill="none" stroke="#fffbe8" stroke-opacity=".7" stroke-width="%s" d="%s"/>' % (K.fmt(ew), back_e))
        back.append('<path fill="none" stroke="#7a6010" stroke-opacity=".5" stroke-width="%s" d="M%sa%s 0 0 1 %s 0"/>' % (
            K.fmt(ew), K.nums([mouthc[0] - rx, mouthc[1]]), K.nums([rx, ry]), K.fmt(2 * rx)))
        body.append('<path fill="none" stroke="#fffbe8" stroke-opacity=".8" stroke-width="%s" d="M%sa%s 0 0 0 %s 0"/>' % (
            K.fmt(ew), K.nums([mouthc[0] - rx, mouthc[1]]), K.nums([rx, ry]), K.fmt(2 * rx)))
    sdefs, sbody, sback = ''.join(defs), ''.join(body), ''.join(back)
    out = os.path.join(HERE, 'out')
    if PROJ == 'photo':
        bgc = K.hexc(BG)
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600"><defs>%s</defs><rect width="1200" height="1600" fill="%s"/>'
               '%s%s</svg>' % (sdefs, bgc, sback, sbody))
        open(os.path.join(out, 'prisme_photo.svg'), 'w').write(svg)
        print('photo svg %d bytes, %d bands, %.1fs' % (len(svg), nb, time.time() - t00))
        return
    hcm = H + 1.5
    vb = K.shop_vb(12, hcm, 1)
    bgc = K.hexc(BG)
    # previews: alone, and with a few stems standing in the pocket (drawn as the engine does: under the body, clipped to inner)
    stems = ''
    for k_, (dx, c) in enumerate(((-6, '#4f7a36'), (2, '#5f8a3e'), (9, '#3f6a2e'))):
        xa = mouthc[0] + dx; xb = mouthc[0] + dx * .5
        stems += '<path d="M%s %sQ%s %s %s %s" stroke="%s" stroke-width="3" fill="none"/>' % (
            K.fmt(xa), K.fmt(mouthc[1] - 60), K.fmt(xa), K.fmt(mouthc[1] + 30), K.fmt(xb), K.fmt(cavb + 3), c)
    above = '<g>%s</g>' % ''.join('<path d="M%s %sL%s %s" stroke="%s" stroke-width="3"/>' % (
        K.fmt(mouthc[0] + dx), K.fmt(mouthc[1] - 60), K.fmt(mouthc[0] + dx), K.fmt(mouthc[1]), c) for dx, c in ((-6, '#4f7a36'), (2, '#5f8a3e'), (9, '#3f6a2e')))
    for name, extra in (('shop', ''), ('shop_stems', '<g clip-path="url(#pin)">%s</g>%s' % (stems, above))):
        for bgn, bgv in (('', bgc), ('_dark', '#2b2a28')):
            svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs><rect x="0" y="0" width="1000" height="1100" fill="%s"/>'
                   '%s%s%s</svg>' % (vb, sdefs, bgv, sback, extra, sbody))
            open(os.path.join(out, 'prisme_%s%s.svg' % (name, bgn)), 'w').write(svg)
    K.write_body(os.path.join(out, 'body.json'), sdefs, sbody, back=sback, inner=inner, cavb=cavb, cavr=cavr)
    write_fiche(V, inner, cavb)
    import gzip
    raw = open(os.path.join(out, 'body.json'), 'rb').read()
    print('body.json %d bytes, gzip %d, %d bands, %.1fs' % (len(raw), len(gzip.compress(raw, 9)), nb, time.time() - t00))


def write_fiche(V, inner, cavb):
    """catalogue entry (outline shape): silhouette in shop units [x from the axis, height above the floor], mouth"""
    P2 = np.array([(x, y - z * TE) for x, y, z in V])
    hull = cv2.convexHull((P2 * 1000).astype(np.float32))[:, 0, :] / 1000
    hull = hull[np.argsort(np.arctan2(hull[:, 1] - H / 2, hull[:, 0]))]
    U = K.UPC
    pts = [[round(float(x) * U, 1), round(float(y) * U, 1)] for x, y in hull]
    xs = [p[0] for p in pts]
    fiche = {"id": "prisme-jaune", "refs": [], "n": "Prisme jaune à cœur suspendu", "m": "verre massif taillé, jaune citrine",
             "fam": "vase", "shape": "outline", "p": 0, "mat": "glass", "fin": "", "col": "#e2b62a", "col2": "#8a6a0c",
             "lip": "plain", "lipw": round((B * ST - RT) * U, 1),
             "why": "Un bloc de verre citrine taillé en prisme à huit pans, biseauté en pointe aux deux bouts, qui garde une poche "
                    "d'air en goutte suspendue : la couleur fonce là où le verre s'épaissit.",
             "ol": {"pts": pts, "mouth": [round(-RT * U, 1), round(RT * U, 1), round(H * U, 1)], "d": round(2 * B * U, 1)},
             "h": round(H * U, 1), "mo": round(RT * U * .92, 1), "mx": 0, "mh": round(H * U, 1), "svgb": "prisme-jaune",
             "cm": {"h": H, "w": round(float(max(xs) - min(xs)) / U, 1), "d": round(2 * B, 1)}}
    json.dump(fiche, open(os.path.join(HERE, 'out', 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
