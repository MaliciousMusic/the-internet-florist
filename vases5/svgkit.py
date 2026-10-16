# Shared kit of the five vases of 2026-10-16 (vases5/): the shop's conventions and the vector helpers of the glass dancers'
# vase (verre/mk.py), without its photograph-specific geometry. A vessel is modelled (shape, relief, material), lit by the
# shop's light per pixel, and only curves leave: tone bands (iso-lines of the lit field) clipped to their part, softened by
# a small blur, crisp outlines. No image is ever embedded.
import sys, os, math, json
import numpy as np, cv2
from skimage import measure
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'verre'))   # bezfit.py

# ---------------------------------------------------------------- the shop
VSCALE = 1.5                         # vessels are drawn 1.5 times their catalogue size against the flowers (owner, 2026-10-09)
UPC = 6.5 * VSCALE                   # shop units per cm (9.75)
VX, FL = 500.0, 990.0                # axis of the vessel and floor line (the foot stands on y = FL)
RY = .16                             # a horizontal circle of radius r is drawn as an ellipse r x (r * RY): the eye ~9 deg above
L3 = np.array([-.5, -.62, .6]); L3 /= np.linalg.norm(L3)   # the single shop light (v1a.js LV): screen frame, x right, y down, z to the eye
HV = L3 + np.array([0, 0, 1.]); HV /= np.linalg.norm(HV)   # half vector for the highlights
S = 1.0                              # scale of the fields handed to contour_paths (fields at the output's own resolution)


def shop_vb(w_cm, h_cm, margin=1.0):
    """viewBox around a vessel w_cm wide (centred on VX) and h_cm high standing on FL"""
    return '%g %g %g %g' % (VX - (w_cm / 2 + margin) * UPC, FL - (h_cm + margin) * UPC, (w_cm + 2 * margin) * UPC, (h_cm + 2 * margin) * UPC)


def poly_mask(pts, shape, scale=1.0):
    m = np.zeros(shape, np.uint8)
    P = np.asarray(pts, float) * scale
    cv2.fillPoly(m, [np.round(P * 4).astype(np.int32)], 1, lineType=cv2.LINE_8, shift=2)
    return m.astype(bool)


def write_body(path, defs, body, mouth='', back='', inner='', cavb=None, cavr=None):
    """the contract with the engine (SVGB entry): defs, body (front, drawn over the stems below the mouth), back (drawn behind
    the stems: a wall that stands behind the bouquet), mouth (the inside seen through the opening), inner (cavity path where
    stems show through glass), cavb/cavr (bottom of the cavity, its half width)"""
    d = dict(defs=defs, body=body)
    for k, v in (('mouth', mouth), ('back', back), ('inner', inner), ('cavb', cavb), ('cavr', cavr)):
        if v not in ('', None):
            d[k] = v
    json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    return d


def extend(f, m, margin=8):
    """carry a field past the edge of its mask (mean of the known neighbours, ring by ring)"""
    f = f.astype(np.float32).copy(); m = m.copy()
    k = np.ones((3, 3), np.uint8)
    for _ in range(margin):
        dil = cv2.dilate(m.astype(np.uint8), k).astype(bool)
        ring = dil & ~m
        if not ring.any():
            break
        den = cv2.blur(m.astype(np.float32), (3, 3))
        chans = [f] if f.ndim == 2 else [f[..., i] for i in range(f.shape[2])]
        for ci, ch in enumerate(chans):
            num = cv2.blur(np.where(m, ch, 0).astype(np.float32), (3, 3))
            v = np.where(ring, num / np.maximum(den, 1e-6), ch)
            if f.ndim == 2:
                f = v
            else:
                f[..., ci] = v
        m = dil
    return f, m


def resample(c, step):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(c, axis=0).T))]
    if d[-1] < step * 3:
        return None
    n = max(4, int(d[-1] / step))
    t = np.linspace(0, d[-1], n, endpoint=False)
    return np.c_[np.interp(t, d, c[:, 0]), np.interp(t, d, c[:, 1])]


def fmt(v):
    s = ('%.2f' % v).rstrip('0').rstrip('.')
    if s.startswith('0.'):
        s = s[1:]
    elif s.startswith('-0.'):
        s = '-' + s[2:]
    return '0' if s in ('', '-0', '-') else s


def nums(vals):
    out, prev = '', ''
    for v in vals:
        s = fmt(v)
        if out and not (s[0] == '-' or (s[0] == '.' and '.' in prev)):
            out += ' '
        out += s; prev = s
    return out


def bspline_path(P, q, mapf):
    """closed quadratic B-spline through the midpoints of P (control points), as M Q t t t ... z"""
    P = np.array([mapf(x, y) for x, y in P])
    P = np.round(P / q) * q
    keep = [0]
    for i in range(1, len(P)):
        if np.abs(P[i] - P[keep[-1]]).max() > 1e-9:
            keep.append(i)
    P = P[keep]
    if len(P) < 3:
        return ''
    M = (P + np.roll(P, -1, axis=0)) / 2          # M[i] = mid(P[i], P[i+1])
    s = 'M' + nums(M[-1]) + 'Q' + nums(np.r_[P[0], M[0]])
    prev = M[0]
    for i in range(1, len(P)):
        s += 't' + nums(M[i] - prev); prev = M[i]
    return s + 'z'


RDP_EPS = 0.0
FIT_EPS = 0.0
AREA_MIN = 0.0


def rdp_closed(P, eps):
    """Douglas-Peucker on a closed polyline (keeps the two farthest points as anchors)"""
    if eps <= 0 or len(P) < 8:
        return P
    def rdp(Q):
        a, b = Q[0], Q[-1]
        v = b - a; L = np.hypot(*v) or 1e-9
        d = np.abs((Q[:, 0] - a[0]) * v[1] - (Q[:, 1] - a[1]) * v[0]) / L
        i = int(np.argmax(d))
        if d[i] <= eps or len(Q) < 3:
            return np.array([a, b])
        return np.vstack([rdp(Q[:i + 1])[:-1], rdp(Q[i:])])
    j = int(np.argmax(np.hypot(*(P - P[0]).T)))
    A = rdp(P[:j + 1]); B = rdp(np.vstack([P[j:], P[:1]]))
    return np.vstack([A[:-1], B[:-1]])


def cubic_path(P, q, mapf, eps):
    """closed path of cubic Beziers fitted within eps (in the output units), relative commands, rounded without drift"""
    import bezfit  # noqa: E402
    Q = np.array([mapf(x, y) for x, y in P])
    segs = bezfit.fit_closed(Q, eps)
    if not segs:
        return ''
    R = lambda p: np.round(np.asarray(p) / q) * q
    cur = R(segs[0][0])
    s = 'M' + nums(cur)
    for c in segs:
        p1, p2, p3 = R(c[1]), R(c[2]), R(c[3])
        s += 'c' + nums(np.r_[p1 - cur, p2 - cur, p3 - cur])
        cur = p3
    return s + 'z'


def contour_paths(field, level, step, q, mapf, scale):
    """closed iso-lines of a field (outside = below every level), as one even-odd path"""
    F = np.pad(field, 2, constant_values=-1e3)
    d = ''
    for c in measure.find_contours(F, level):
        c = (c[:, ::-1] - 2) * scale            # (x, y) in reference pixels
        if AREA_MIN > 0 and abs(.5 * np.sum(c[:-1, 0] * c[1:, 1] - c[1:, 0] * c[:-1, 1])) < AREA_MIN:
            continue                             # specks too small to be seen at the shop's size
        r = resample(c, step)
        if r is None:
            continue
        if FIT_EPS > 0:
            d += cubic_path(r, q, mapf, FIT_EPS)
            continue
        if RDP_EPS > 0:
            r = rdp_closed(r, RDP_EPS)
            if len(r) < 3:
                continue
        d += bspline_path(r, q, mapf)
    return d


def hexc(c):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in np.clip(c, 0, 255))


def bands(col, mask, mapf, q, step, dy=11.0, minpx=10):
    """the tone bands of a coloured field inside its mask: [(colour, path)], darkest first"""
    Y = col @ np.array([.3, .59, .11])
    Ye, me = extend(Y, mask, 6)
    ce, _ = extend(col, mask, 6)
    vals = Y[mask]
    if vals.size < minpx:
        return []
    lo, hi = np.percentile(vals, 1), np.percentile(vals, 99.5)
    levels = np.arange(math.floor(lo / dy) * dy + dy, hi, dy)
    out = []
    edges = [-1e9] + list(levels) + [1e9]
    for k in range(len(edges) - 1):
        sel = mask & (Y >= edges[k]) & (Y < edges[k + 1])
        if sel.sum() < 2:
            sel = me & (Ye >= edges[k]) & (Ye < edges[k + 1])
        if sel.sum() < 2:
            continue
        c = ce[sel].mean(0)
        if k == 0:
            out.append((hexc(c), None))
            continue
        F = np.where(me, Ye, -1e3)
        d = contour_paths(F, edges[k], step, q, mapf, S)
        if d:
            out.append((hexc(c), d))
    return out


# ---------------------------------------------------------------- camera of the photograph (fitted on the ellipses of the lip and the foot)
