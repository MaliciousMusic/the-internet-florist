# The pink butterfly vase (vases5/papillon-rose): its geometric model, in cm, LOCAL frame: x right, y up (floor y = 0),
# z towards the front of the vase (the butterfly's meridian faces +z before the vase is turned by its yaw).
# Owner's decision of 2026-10-16: an exact copy of the reference. Every dimension below is measured on the photograph
# (trace.py -> traces.json, numbers only) through a fitted camera: orthographic, scale PK px/cm, eye TEP above the horizontal
# (a horizontal circle of radius r is seen as an ellipse r x TEP r), the vase turned by YAWP.
#   - a glazed porcelain body of revolution (its axis drifts slightly): foot ring, teardrop belly, narrow neck, a funnel that
#     widens to the right at the top;
#   - the wall (thickness T) is opened on the front by a long slit from the butterfly's head to the top; its two lips are
#     rolled (a round bead) and painted mauve;
#   - the back wall's top edge falls from the left corner to the right one; the lips go on past it as two crosiers (blades
#     curled at the end) whose centre lines and widths are traced;
#   - the butterfly in relief (bfly.py) wraps the bottom of the slit.
import os, json, math
import numpy as np
from scipy.interpolate import PchipInterpolator
from scipy.ndimage import gaussian_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
TR = json.load(open(os.path.join(HERE, 'traces.json')))

T = 0.42                      # wall thickness (cm)
HFL = 1.1                     # inner floor
PK = 28.7                     # photograph px per cm (height of the vase: 31 cm, see RAPPORT)
TEP = float(os.environ.get('PAP_TEP', .22))                 # the photograph's eye: about 12 deg above the horizontal
YAWP = math.radians(float(os.environ.get('PAP_YAW', -12)))  # the butterfly's meridian turned 12 deg to the left
PCX = 395.0                   # the axis at the foot (centres of the rows above the foot)
RF = 2.3                      # radius of the foot ring
PFL = 947.0 - PK * RF * TEP   # y of the floor point under the axis (the lowest silhouette point is the foot's front edge)
cyw, syw = math.cos(YAWP), math.sin(YAWP)


# ---------------------------------------------------------------- profile: silhouette rows -> R(h), axis drift AX(h)
_rows = np.array(TR['rows'], float)
_y, _xl, _xr = _rows[:, 0], _rows[:, 1].copy(), _rows[:, 2]
_xl[(_y > 480) & (_y < 700)] += 2.5            # the left wing's relief stands on the silhouette there: the body is under it
_sel = (_y >= 250) & (_y <= 912)
_h = (PFL - _y[_sel]) / PK
_R = gaussian_filter1d((_xr[_sel] - _xl[_sel]) / 2 / PK, 7)
_A = gaussian_filter1d(((_xl[_sel] + _xr[_sel]) / 2 - PCX) / PK, 14) / cyw
_o = np.argsort(_h)
_h, _R, _A = _h[_o], _R[_o], _A[_o]
# the foot (hidden in the cloth below y 912): a short ring, R ~ RF
_foot = [(0, RF - .1), (.1, RF), (.5 * float(_h[0]), .5 * (RF + float(_R[0])))]
# above the neck (y < 250) the silhouette is the lips': the wall's radius and axis there are read on the two lips' centre
# lines (traced on the rims), taken at 80 deg on either side of the eye; above the right lip's top (y 171) only the left lip
# remains, and the wall keeps its last radius while its axis follows that lip (the tall left blade under the left crosier)
_rw0 = {int(r[0]): r for r in TR['rows']}
_LIPL = lambda y: _rw0[int(y)][1] + float(np.interp(y, [90, 160, 250], [5, 8, 12]))
_LIPR = lambda y: float(np.interp(y, [171, 180, 190, 200, 215, 230, 245, 265, 285], [468, 463, 455, 445, 437, 428, 421, 415, 411]))
_fun, _afun = [], []
_rlast = None
for _yy in list(range(240, 170, -10)) + [171] + list(range(160, 99, -10)):
    _hh = (PFL - _yy) / PK
    _xl = _rw0[int(_yy)][1]
    if _yy >= 171:
        _xr = _rw0[int(_yy)][2] if _yy >= 232 else _LIPR(_yy) + 7
        _rr = (_xr - _xl) / 2 / PK
        _rlast = _rr
    else:
        _rr = _rlast
    _fun.append((_hh, _rr))
    _afun.append((_hh, ((_xl - PCX) / PK + _rr) / cyw))
H_NECKTOP = float(_h[-1])
_HT = np.r_[[p[0] for p in _foot], _h[::8], [p[0] for p in _fun]]
_RT = np.r_[[p[1] for p in _foot], _R[::8], [p[1] for p in _fun]]
_AT = np.r_[np.full(len(_foot), float(_A[0])), _A[::8], [p[1] for p in _afun]]
_HG = np.linspace(-.5, 31, 6301)
_RG = PchipInterpolator(_HT, _RT, extrapolate=True)(_HG)
_AG = PchipInterpolator(_HT, gaussian_filter1d(_AT, 1.5), extrapolate=True)(_HG)


def R(h):
    return np.interp(h, _HG, _RG)


def AX(h):
    return np.interp(h, _HG, _AG)


# ---------------------------------------------------------------- the photograph's camera (for the measurements)
def to_photo(Pl):
    """local points (N, 3) -> photograph pixels (X, Y) and world depth"""
    x, y, z = Pl[:, 0], Pl[:, 1], Pl[:, 2]
    xw, zw = x * cyw + z * syw, -x * syw + z * cyw
    return PCX + PK * xw, PFL - PK * (y - zw * TEP), zw


def from_photo_outer(X, Y, rad_off=0.0, back=False, it=8):
    """photograph pixels -> (phi local, h) on the outer surface (radius R(h) + rad_off), front (or back) side"""
    X, Y = np.asarray(X, float), np.asarray(Y, float)
    xw = (X - PCX) / PK
    up = (PFL - Y) / PK
    h = up.copy()
    for _ in range(it):
        r = R(h) + rad_off
        s = np.clip((xw - AX(h) * cyw) / r, -.999, .999)
        pw = np.arcsin(s)
        if back:
            pw = math.pi - pw
        zw = r * np.cos(pw)
        h = up + zw * TEP
    return pw - YAWP, h


# ---------------------------------------------------------------- the slit: the lips, measured on the inside's boundary
_ir = np.array(TR['inside_rows'], float)
_ir = _ir[(_ir[:, 0] >= 300)]                    # above, the inside is lit from the top: its boundary is not the lips'
_off = 5.0                                       # the bead's half width, seen: the lip's centre line lies outside the inside
_phL, _hL = from_photo_outer(_ir[:, 1] - _off, _ir[:, 0], -T / 2)
_phR, _hR = from_photo_outer(_ir[:, 2] + _off, _ir[:, 0], -T / 2)
HV = float(min(_hL.min(), _hR.min())) + .02      # bottom of the V (the butterfly's head)
_uL = gaussian_filter1d(_phL * R(_hL), 2.0)
_uR = gaussian_filter1d(_phR * R(_hR), 2.0)
CORNER_L, CORNER_R = (303.0, 88.0), (468.0, 171.0)   # the top corners: where the crosiers leave the back wall's top edge
HL_TOP = float((PFL - CORNER_L[1]) / PK)
HR_TOP = float((PFL - CORNER_R[1]) / PK)


def _edge_fn(hs, us):
    """lip as arc length u(h) (cm on the outer surface), rounded V at the bottom (u ~ sqrt(h - HV))"""
    o = np.argsort(hs); hs, us = hs[o], us[o]
    keep = np.r_[True, np.diff(hs) > 1e-4]
    hs, us = hs[keep], us[keep]
    k = hs > HV + .06
    hs = np.r_[HV, hs[k][::4]]
    us = np.r_[0.0, gaussian_filter1d(us[k], 1.5)[::4]]
    sq = np.sqrt(np.maximum(hs - HV, 0))
    f = PchipInterpolator(sq, us, extrapolate=True)
    return lambda h: f(np.sqrt(np.maximum(np.asarray(h, float) - HV, 0)))


# above y 300 the lips are read on the silhouette and the rims (centre lines, photograph px): the left one climbs the left
# side to its corner, the right one swings out to the right corner
_rw = {int(r[0]): r for r in TR['rows']}
_topL = np.array([(_rw[y][1] + np.interp(y, [90, 200, 250, 296], [5, 7, 8, 13]), y) for y in range(90, 300, 4)], float)
_topR = np.array([(468, 171), (463, 180), (455, 190), (445, 200), (437, 215), (428, 230), (421, 245), (415, 265), (411, 285)], float)
_pl, _hl = from_photo_outer(_topL[:, 0], _topL[:, 1], -T / 2)
_pr, _hr = from_photo_outer(_topR[:, 0], _topR[:, 1], -T / 2)
UL = _edge_fn(np.r_[_hL, _hl], np.r_[_uL, _pl * R(_hl)])
UR = _edge_fn(np.r_[_hR, _hr], np.r_[_uR, _pr * R(_hr)])


def phiR(h):
    return UR(h) / R(h)


def phiL(h):
    return UL(h) / R(h)


# ---------------------------------------------------------------- top edge of the back wall: the silhouette's upper boundary
PHL_TOP, PHR_TOP = float(phiL(HL_TOP)), float(phiR(HR_TOP))
_ARC = 2 * math.pi - (PHR_TOP - PHL_TOP)
_te = np.array(TR['top_edge'], float)
_te = _te[(_te[:, 0] > CORNER_L[0] + 2) & (_te[:, 0] < CORNER_R[0] - 2)]
_tph, _th = from_photo_outer(_te[:, 0], _te[:, 1], -T / 2, back=True)
_tpsi = np.mod(PHL_TOP - _tph, 2 * math.pi)
_o = np.argsort(_tpsi)
_tpsi, _th = _tpsi[_o], gaussian_filter1d(_th[_o], 2)
_k = (_tpsi > .05) & (_tpsi < _ARC - .05)
_tpsi = np.r_[0, _tpsi[_k], _ARC]
_th = np.r_[HL_TOP, _th[_k], HR_TOP]
_kk = np.r_[True, np.diff(_tpsi) > 1e-3]
_TOPF = PchipInterpolator(_tpsi[_kk], _th[_kk], extrapolate=True)


def htop(phi):
    psi = np.mod(PHL_TOP - np.asarray(phi, float), 2 * math.pi)
    return _TOPF(np.clip(psi, 0, _ARC))


def in_slit(phi, h):
    """True where the wall is open (the slit, or above the top edge)"""
    phi = np.asarray(phi, float); h = np.asarray(h, float)
    p = np.mod(phi + math.pi, 2 * math.pi) - math.pi
    hs = np.maximum(h, HV)
    sl = (h > HV) & (p > phiL(hs)) & (p < phiR(hs))
    return sl | (h > htop(p)) | (h > max(HL_TOP, HR_TOP) + 2.5)


def wall_exists(phi, h):
    return (h >= 0) & ~in_slit(phi, h)


# ---------------------------------------------------------------- the crosiers: traced centre lines and half widths
_crl = TR['crosier_skeleton']['left']
_crr = TR['crosier_skeleton']['right']


def _order_skeleton(pts, root):
    """order the skeleton pixels along the longest path from the pixel nearest the root"""
    P = np.array(pts, float)
    key = {(int(x), int(y)): i for i, (x, y, r) in enumerate(P)}
    nb = [[key[(int(x) + dx, int(y) + dy)] for dx in (-1, 0, 1) for dy in (-1, 0, 1)
           if (dx or dy) and (int(x) + dx, int(y) + dy) in key] for x, y, r in P]
    s = int(np.argmin(np.hypot(P[:, 0] - root[0], P[:, 1] - root[1])))
    dist = {s: 0.0}; prev = {s: -1}; q = [s]
    while q:
        i = q.pop(0)
        for j in nb[i]:
            if j not in dist:
                dist[j] = dist[i] + math.hypot(*(P[j, :2] - P[i, :2])); prev[j] = i; q.append(j)
    e = max(dist, key=dist.get)
    path = []
    while e != -1:
        path.append(e); e = prev[e]
    return P[path[::-1]]


# centre lines of the two crosiers (photograph px, read on the 2.5x grid of work/cros.png: the medial axis of the mask is
# fooled by the highlights on the knobs) with their half widths
CROSIERS = {
    'left': [(303, 88, 6.5), (299, 85, 5.9), (289, 77, 6.0), (281, 73, 6.6), (266, 67, 7.4),
             (253, 64, 8.0), (243, 64, 8.8), (233, 66, 9.8), (226, 70, 11.0), (223, 75, 11.4), (221, 80, 10.6), (221, 85, 9.4),
             (222, 89, 7.6), (225, 91, 6.0), (228, 91, 5.0)],
    'right': [(465, 183, 9.0), (473, 185, 8.4), (481, 186, 8.2), (489, 188, 8.6), (495, 192, 9.0), (500, 198, 9.4),
              (502, 204, 9.6), (501, 209, 9.4), (499, 213, 8.8), (496, 217, 7.8), (493, 219, 6.6)]}
# (half widths = distance to the silhouette: the knob of each crosier is a wide flattened curl, its top face catching the
# light, its rolled under-edge mauve)


def _catmull(P, n=6):
    P = np.asarray(P, float)
    P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]]); out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(P[-2])
    return np.array(out)


def crosier_paths():
    """[(side, points (X, Y, half width) in photograph px, from the root to the tip)]"""
    return [(k, _catmull(CROSIERS[k], 8)) for k in ('left', 'right')]
