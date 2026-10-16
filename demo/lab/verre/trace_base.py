# Helpers and lists of the tracing (see trace.py).
import math
PARTS, LINES, BUMPS = [], [], []


def part(fig, name, layer, amp, pts, grp=None):
    PARTS.append({'fig': fig, 'name': name, 'layer': layer, 'amp': amp, 'pts': pts, 'grp': grp or name})


def tube(fig, name, layer, axis, grp=None, k=.62):
    """a limb: axis points (x, y, r[, z]) in reference pixels, round sections compressed by k"""
    PARTS.append({'fig': fig, 'name': name, 'layer': layer, 'amp': 0, 'axis': axis, 'k': k, 'grp': grp or name, 'pts': []})


def blob(fig, name, layer, cx, cy, rx, ry, a=0, grp=None, k=.62, z=0):
    """an ellipsoid (head, hair mass) seen from the front"""
    PARTS.append({'fig': fig, 'name': name, 'layer': layer, 'amp': 0, 'blob': (cx, cy, rx, ry, a, z), 'k': k,
                  'grp': grp or name, 'pts': []})


def line(fig, name, pts, w, d, on):
    LINES.append({'fig': fig, 'name': name, 'pts': pts, 'w': w, 'd': d, 'on': on})


def bump(fig, x, y, rx, ry, a, amp, on):
    BUMPS.append({'fig': fig, 'x': x, 'y': y, 'rx': rx, 'ry': ry, 'a': a, 'amp': amp, 'on': on})


def smooth(pts, n=8, closed=True):
    """Catmull-Rom through the traced points."""
    P = list(pts)
    m = len(P)
    out = []
    rng = range(m) if closed else range(m - 1)
    for i in rng:
        p0 = P[(i - 1) % m] if closed else P[max(0, i - 1)]
        p1 = P[i]
        p2 = P[(i + 1) % m]
        p3 = P[(i + 2) % m] if closed else P[min(m - 1, i + 2)]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                   + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    if not closed:
        out.append(tuple(P[-1]))
    return out


