# Swept forms of the relief: a limb (or a torso seen from the front) is a tube along a curved axis with a radius profile,
# a head, a breast or a knee an ellipsoid. Heights are exact round sections, compressed into a relief.
#   axis points are (x, y, r) in reference pixels; optional 4th value: depth offset (the form comes forward)
import math
import numpy as np


def cr_axis(P, n=10):
    """Catmull-Rom through the axis points (x, y, r[, z]), densely sampled"""
    P = [tuple(p) + (0.0,) * (4 - len(p)) for p in P]
    if len(P) == 2:
        P = [P[0], tuple((a + b) / 2 for a, b in zip(P[0], P[1])), P[1]]
    m = len(P)
    out = []
    for i in range(m - 1):
        p0, p1, p2, p3 = P[max(0, i - 1)], P[i], P[i + 1], P[min(m - 1, i + 2)]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                   + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(4)))
    out.append(P[-1])
    return np.array(out)


def tube_height(xx, yy, axis, k=.62, cap=True):
    """height of a tube: for each pixel the nearest point of the axis gives the radius r, the offset z and the distance d;
    h = z + k sqrt(r^2 - d^2) inside, the ends rounded like the end of a limb"""
    A = cr_axis(axis)
    best_d = np.full(xx.shape, 1e9); best_r = np.zeros(xx.shape); best_z = np.zeros(xx.shape); best_t = np.zeros(xx.shape)
    for i in range(len(A) - 1):
        x0, y0, r0, z0 = A[i]; x1, y1, r1, z1 = A[i + 1]
        vx, vy = x1 - x0, y1 - y0
        L2 = vx * vx + vy * vy or 1e-9
        t = np.clip(((xx - x0) * vx + (yy - y0) * vy) / L2, 0, 1)
        d = np.hypot(xx - x0 - t * vx, yy - y0 - t * vy)
        sel = d < best_d
        best_d = np.where(sel, d, best_d)
        best_r = np.where(sel, r0 + (r1 - r0) * t, best_r)
        best_z = np.where(sel, z0 + (z1 - z0) * t, best_z)
        best_t = np.where(sel, (i + t) / (len(A) - 1), best_t)
    inside = best_d < best_r
    h = np.where(inside, best_z + k * np.sqrt(np.maximum(best_r ** 2 - best_d ** 2, 0)), 0.0)
    return h, inside


def blob_height(xx, yy, cx, cy, rx, ry, a=0.0, k=.62, z=0.0):
    """ellipsoid seen from the front, depth k * min(rx, ry)"""
    ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
    u = ((xx - cx) * ca + (yy - cy) * sa) / rx
    v = (-(xx - cx) * sa + (yy - cy) * ca) / ry
    r2 = u * u + v * v
    inside = r2 < 1
    h = np.where(inside, z + k * min(rx, ry) * np.sqrt(np.maximum(1 - r2, 0)), 0.0)
    return h, inside
