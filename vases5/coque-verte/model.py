# The green shell vase (vases5/coque-verte): its geometric model, in cm, world frame X right, Y up (floor Y = 0), Z toward
# the viewer. Two welded pieces of matt sage ceramic:
#   - a thin oval DISC standing on its edge behind, a little tilted and turned;
#   - in front, a SHELL: one sheet of clay rolled a little more than one turn into a cornet (top view: an open spiral). Its
#     inner margin starts at the front-left under the hood and runs as the low front lip, rises along the right side, flares
#     backwards along the back (the inside of the cornet faces the viewer there) up to a tongue welded to the disc's left
#     edge, then rolls over the left as a hood that leans in over the throat; the outer margin ends as a soft vertical ridge
#     on the front. Narrow rounded foot.
# The spiral, the rim heights and the proportions of the opening are ours (the reference only gave the idea of the piece).
# Every surface is sampled as points with exact normals; the renderer (mk.py) splats them through its camera.
import math
import numpy as np
from scipy.interpolate import PchipInterpolator

T = 0.72                     # wall thickness of the shell (cm)
TD = .8                    # thickness of the disc at its rim (cm)
CAV = -.18                   # the disc's faces are barely domed (cm at the centre); its rim stays a clean thin edge

# ---------------------------------------------------------------- front shell
AXX, AXZ = -3.5, 11.5        # axis of the cup (X, Z), vertical
TH0 = math.radians(90.)      # s = 0 at the front; the meridians go round once (closed: no margin)
TT = 2 * math.pi
from scipy.interpolate import CubicSpline  # noqa: E402


def _p(pts):
    a = np.array(pts, float)
    return PchipInterpolator(a[:, 0], a[:, 1], extrapolate=True)


def _per(th_deg, vals):
    """periodic smooth function of the azimuth (degrees: 0 right, 90 front, 180 left, 270 back)"""
    t = np.r_[th_deg, th_deg[0] + 360.]
    v = np.r_[vals, vals[0]]
    cs = CubicSpline(t, v, bc_type='periodic')
    return lambda th: cs(np.mod(th - th_deg[0], 360.) + th_deg[0])


# radius of the turned body by height (cm): narrow rounded foot that barely flares, belly at ~17 cm, egg-like top
R_OF_H = _p([(0, 4.5), (.3, 4.85), (1, 5.05), (2.5, 5.25), (4, 5.65), (7, 6.9), (10, 8.2), (13, 9.15), (16, 9.6),
             (19, 9.65), (22, 9.35), (25, 8.85), (28, 8.15), (31, 7.2)])
R0 = 9.6
# The wall is ONE sheet swept round the body: its horizontal section is a volute, the same at every height (scaled by the
# body's radius). Along it: it starts at the back-left as the lobe, laid back onto the disc's top-left edge; runs round the
# left as the big full flank; at the front-left it turns in and crosses the vase towards the back-right (its outer face is
# the broad scoop seen from the front, its free edge the long soft S coming down from the lobe); on the right it turns
# forward on itself in a tight curl (the thick rounded lip of the cup, facing left); runs low along the front and finally
# dives in at the front-left, against the scoop: the navel, where the volute closes like a "6".
# Path of the section, unit radius (x right, z front), with the height of the free edge, the lean of the top towards the
# axis (cm, + in) and the sweep of the top back onto the disc (cm towards -Z).
#           x      z     edge   lean  sweep  slope (scoop: its lower part comes forward, cm)
VOL = np.array([
    [-.81, -1.07, 28.4, .2, 0, 0],    # leaves the plate's left edge (welded on it)
    [-.95, -.93, 28.52, 2.05, 0, 0],    # the lobe
    [-1.07, -.58, 28.11, 3.88, 0, 0],
    [-1.04, -.14, 27.37, 4.66, 0, 0],   # the flank, its top rolled over like a dome
    [-.86, .40, 26.88, 4.75, 0, 0],
    [-.46, .78, 26.57, 4.52, 0, 0],     # front-left: it turns in
    [.02, .76, 26.10, 3.62, 0, 0],
    [.24, .54, 25.78, 2.47, 0, 0],       # the scoop, sloping down into the throat
    [.54, .30, 25.29, 0.96, 0, 0],
    [.84, .10, 23.40, -1.00, 0, .2],
    [.93, .16, 22.3, -.2, 0, .2],     # the curl on the right
    [.99, .40, 20.6, -.3, 0, 0],
    [.86, .68, 18.6, -.3, 0, 0],      # the front lip
    [.55, .88, 17.2, -.2, 0, 0],
    [.18, .97, 16.6, 0, 0, 0],
    [-.10, .92, 16.2, .2, 0, 0],
    [-.22, .80, 16.4, .3, 0, 0],      # turns back into the throat and curls: the navel
    [-.20, .67, 17.1, .3, 0, 0],
    [-.08, .62, 17.5, .2, 0, 0],
])
_d = np.r_[0, np.cumsum(np.hypot(*np.diff(VOL[:, :2], axis=0).T))]
_d /= _d[-1]
VSPL = [CubicSpline(_d, VOL[:, k], bc_type='natural') for k in range(6)]
VLEN = 0.0
S_CLOSE = float(_d[13])
S_IN = float(_d[5])
NAV_S, NAV_H, NAV_R, NAV_D = float(_d[6] * .45 + _d[7] * .55), 15.0, 3.8, 4.6   # centre (s, h), radius, depth (cm)
CLOSE_AT = (-.40, .83)
_ss = np.linspace(0, 1, 2000)
VLEN = float(np.sum(np.hypot(np.diff(VSPL[0](_ss)), np.diff(VSPL[1](_ss)))))   # length of the unit path


def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def shell_mid(s, tau):
    """mid-surface of the volute: s along the sheet (0..1), tau from the foot (0) to the free edge (1)"""
    px, pz, H, lean, sw, inc = (f(s) for f in VSPL)
    # low down the inner turn and the end of the volute open out onto the outer circle: below the navel the front is one
    # smooth surface, and the fold of the "6" fades out going down and to the left
    # (the curl and the front lip are the outer wall itself: they stay; the weight is zero round the switches below)
    seg = sstep(S_IN, S_IN + .08, s) * (1 - sstep(_d[9], _d[10], s)) + sstep(_d[12], S_CLOSE, s)
    lo = np.where(s > _d[11], .55, .42)
    wl = seg * (1 - sstep(lo, lo + .5, tau))
    rr0 = np.hypot(px, pz) + 1e-9
    # where each part settles low down; the end of the volute slides to the left as it goes down and lies onto the flank
    # near the foot, so the fold of the "6" runs down and to the left and fades out
    ke = sstep(S_CLOSE, 1, s)
    rt = np.where(s > _d[11], 1 - ke * (.16 - .09 * (1 - sstep(.1, .7, tau))), .95)
    rot = np.where(s > _d[11], np.radians(22.) * ke * (1 - sstep(.15, .9, tau)), 0.)
    ux, uz = px / rr0, pz / rr0
    ux, uz = ux * np.cos(rot) - uz * np.sin(rot), ux * np.sin(rot) + uz * np.cos(rot)
    px = px + (rt * ux - px) * wl
    pz = pz + (rt * uz - pz) * wl
    h = H * tau
    R = R_OF_H(h)
    rr = np.hypot(px, pz) + 1e-9
    k = sstep(.3, 1, tau) ** 2.2 * lean
    x = px * R - px / rr * k
    z = pz * R - pz / rr * k
    # the scoop slopes: below the edge its wall comes forward towards the lip, then drops straight into the throat
    fw = np.clip(inc, 0, None) * np.exp(-((tau - .8) / .13) ** 2)   # a brow over the throat, undercut below it
    P = np.stack([AXX + x, h, AXZ + z - sw * sstep(.45, 1, tau) ** 2 + fw], -1)
    # the navel: the scoop sinks into a round funnel at the left end of the cup, down into the throat
    dd = np.hypot((s - NAV_S) * VLEN * R0 / NAV_R, (h - NAV_H) / NAV_R)
    dent = NAV_D * np.clip(1 - dd * dd, 0, 1) ** 2 * (s < S_CLOSE)
    P[:, 0] -= dent * (P[:, 0] - AXX) / (np.hypot(P[:, 0] - AXX, P[:, 2] - AXZ) + 1e-9)
    P[:, 2] -= dent * (P[:, 2] - AXZ) / (np.hypot(P[:, 0] - AXX, P[:, 2] - AXZ) + 1e-9)
    return P


def _frame(fn, u, v, eu=1e-4, ev=1e-4):
    P = fn(u, v)
    du = fn(u + eu, v) - fn(u - eu, v)
    dv = fn(u, v + ev) - fn(u, v - ev)
    return P, du, dv


def _unit(a):
    return a / (np.linalg.norm(a, axis=-1, keepdims=True) + 1e-12)


def shell_frame(s, tau, fn=None):
    P, ds, dt = _frame(fn, s, tau)
    n = _unit(np.cross(ds, dt))           # outward (away from the axis) for this parametrisation
    return P, n, _unit(ds), _unit(dt)


# ---------------------------------------------------------------- disc
DCX, DCY = 0.6, 16.4        # centre of the disc
DA, DB = 12.6, 18.4         # semi-axes (the bottom just reaches the floor; it stands on a short flat)
DTILT = math.radians(6.)    # its top leans to the left
DYAW = math.radians(8.)      # its left side comes a little forward (towards the weld), its right side recedes
DZ = .9                      # depth of its centre plane


def disc_local_to_world(x, y, z):
    """local frame of the disc (x, y in its plane, z its normal) -> world"""
    c, s_ = math.cos(DTILT), math.sin(DTILT)
    xr, yr = x * c - y * s_, x * s_ + y * c          # tilt in the plane (counter-clockwise: the top goes left)
    cy, sy = math.cos(DYAW), math.sin(DYAW)
    X = xr * cy + z * sy
    Z = -xr * sy + z * cy
    return np.stack([DCX + X, DCY + yr, DZ + Z], -1)


def disc_face(r, ph, side):
    """side +1 front face, -1 back face; r 0..1, ph angle"""
    z = -CAV * (1 - r * r) + side * TD / 2
    return disc_local_to_world(DA * r * np.cos(ph), DB * r * np.sin(ph), z)


def disc_rim(ph, a):
    """rounded rim of the disc: a = -pi/2 (back) .. pi/2 (front) around the edge"""
    ex, ey = DA * np.cos(ph), DB * np.sin(ph)
    nx, ny = np.cos(ph) / DA, np.sin(ph) / DB             # outward normal of the ellipse in its plane
    nl = np.hypot(nx, ny); nx, ny = nx / nl, ny / nl
    rr = TD / 2
    return disc_local_to_world(ex + rr * np.cos(a) * nx, ey + rr * np.cos(a) * ny, rr * np.sin(a))


# ---------------------------------------------------------------- sampling
def thick(tau):
    """wall thickness: the free edge swells into a thick rounded lip (~1.1 cm)"""
    return T + .38 * sstep(.86, 1, np.asarray(tau, float))


def _grid(n_u, n_v, u0, u1, v0, v1, chunk):
    """yields (u, v) chunks of a regular grid, row strips of about `chunk` points"""
    us = np.linspace(u0, u1, n_u)
    vs = np.linspace(v0, v1, n_v)
    rows = max(1, chunk // n_v)
    for i in range(0, n_u, rows):
        U, V = np.meshgrid(us[i:i + rows], vs, indexing='ij')
        yield U.ravel(), V.ravel()


def _orient(n, ref):
    sgn = np.sign(np.sum(n * ref, -1))
    sgn[sgn == 0] = 1
    return n * sgn[:, None]


def points(dens, chunk=600000, parts=('disc', 'shell')):
    """yields (P, N, part, side) chunks; dens = samples per cm. part 1 disc, 2 shell; side 0 outer, 1 inner, 2 edge"""
    if 'shell' in parts:
        n_s = int(VLEN * 10 * dens)
        n_t = int(31 * dens)                      # the flare and the hood make the wall longer than its height
        n_a = max(6, int(math.pi * T / 2 * dens * 1.6))
        for fn, ns in ((shell_mid, n_s),):
            for side, sg in ((0, 1), (1, -1)):
                for s, t in _grid(ns, n_t, 0, 1, 0, 1, chunk):
                    M, n, _, _ = shell_frame(s, t, fn)
                    yield M + sg * (thick(t) / 2)[:, None] * n, sg * n, 2, side
            # rounded top edge
            for s, a in _grid(ns, n_a, 0, 1, -math.pi / 2, math.pi / 2, chunk):
                M, n, ds, dt = shell_frame(s, np.ones_like(s), fn)
                b = _unit(dt - np.sum(dt * n, -1, keepdims=True) * n)
                d = np.cos(a)[:, None] * n + np.sin(a)[:, None] * b
                yield M + (thick(1.) / 2) * d, d, 2, 2
            for s_, sg in ((0., -1), (1., 1)):
                for t, a in _grid(n_t, n_a, 0, 1, -math.pi / 2, math.pi / 2, chunk):
                    M, n, ds, dt = shell_frame(np.full_like(t, s_), t, fn)
                    b = _unit(sg * ds - np.sum(sg * ds * n, -1, keepdims=True) * n)
                    d = np.cos(a)[:, None] * n + np.sin(a)[:, None] * b
                    yield M + (thick(t) / 2)[:, None] * d, d, 2, 2
    if 'disc' in parts:
        n_r = int(DB * dens)
        n_p = int(2 * math.pi * DB * dens)
        ref_f = disc_local_to_world(0., 0., 1.) - disc_local_to_world(0., 0., 0.)
        for sg, side in ((1, 0), (-1, 1)):
            for r, ph in _grid(n_r, n_p, 0, 1, 0, 2 * math.pi, chunk):
                r = np.sqrt(r)                   # even density over the area
                P, dr, dp = _frame(lambda a, b: disc_face(a, b, sg), np.clip(r, 2e-4, 1 - 2e-4), ph)
                n = _orient(_unit(np.cross(dr, dp)), sg * ref_f)
                k = P[:, 1] >= 0
                yield P[k], n[k], 1, side
        n_a = max(8, int(math.pi * TD / 2 * dens * 1.6))
        for ph, a in _grid(n_p, n_a, 0, 2 * math.pi, -math.pi / 2, math.pi / 2, chunk):
            P, dp, da = _frame(disc_rim, ph, a)
            C = disc_local_to_world(DA * np.cos(ph), DB * np.sin(ph), 0. * ph)
            n = _orient(_unit(np.cross(dp, da)), P - C)
            k = P[:, 1] >= 0
            yield P[k], n[k], 1, 2


# ---------------------------------------------------------------- for the shop
MOUTH = (.6, 17.6, 18.2)     # centre of the cup where the stems go in (X, Y, Z, cm): between the scoop and the front lip
MOUTH_HW = 3.6               # half width of the opening offered to the stems (cm)
DEPTH = 21.5                 # depth of the whole piece, front lip to the back of the plate (cm)
