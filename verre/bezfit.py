# Fitting of cubic Bezier curves to a polyline within a tolerance (after Philip J. Schneider, Graphics Gems, 1990).
import numpy as np


def _bez(ctrl, t):
    t = t[:, None]; mt = 1 - t
    return mt ** 3 * ctrl[0] + 3 * mt * mt * t * ctrl[1] + 3 * mt * t * t * ctrl[2] + t ** 3 * ctrl[3]


def _chord(P):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    return d / (d[-1] or 1)


def _generate(P, u, t1, t2):
    p0, p3 = P[0], P[-1]
    b0 = (1 - u) ** 3; b1 = 3 * u * (1 - u) ** 2; b2 = 3 * u * u * (1 - u); b3 = u ** 3
    A1 = t1[None, :] * b1[:, None]; A2 = t2[None, :] * b2[:, None]
    C = np.array([[np.sum(A1 * A1), np.sum(A1 * A2)], [np.sum(A1 * A2), np.sum(A2 * A2)]])
    tmp = P - (p0[None] * (b0 + b1)[:, None] + p3[None] * (b2 + b3)[:, None])
    X = np.array([np.sum(A1 * tmp), np.sum(A2 * tmp)])
    det = C[0, 0] * C[1, 1] - C[0, 1] * C[1, 0]
    seg = np.hypot(*(p3 - p0))
    if abs(det) > 1e-12:
        a1 = (X[0] * C[1, 1] - C[0, 1] * X[1]) / det
        a2 = (C[0, 0] * X[1] - C[1, 0] * X[0]) / det
    else:
        a1 = a2 = seg / 3
    if a1 < 1e-6 * seg or a2 < 1e-6 * seg or a1 > 2 * seg or a2 > 2 * seg:
        a1 = a2 = seg / 3
    return np.array([p0, p0 + t1 * a1, p3 + t2 * a2, p3])


def _reparam(P, u, ctrl):
    q = _bez(ctrl, u)
    d1 = 3 * ((1 - u) ** 2)[:, None] * (ctrl[1] - ctrl[0]) + 6 * ((1 - u) * u)[:, None] * (ctrl[2] - ctrl[1]) + 3 * (u * u)[:, None] * (ctrl[3] - ctrl[2])
    d2 = 6 * (1 - u)[:, None] * (ctrl[2] - 2 * ctrl[1] + ctrl[0]) + 6 * u[:, None] * (ctrl[3] - 2 * ctrl[2] + ctrl[1])
    num = np.sum((q - P) * d1, 1); den = np.sum(d1 * d1, 1) + np.sum((q - P) * d2, 1)
    nu = u - np.where(np.abs(den) > 1e-12, num / np.where(np.abs(den) > 1e-12, den, 1), 0)
    return np.clip(nu, 0, 1)


def _unit(v):
    n = np.hypot(*v)
    return v / n if n > 1e-12 else v


def fit(P, t1, t2, eps, depth=0):
    if len(P) == 2:
        d = np.hypot(*(P[1] - P[0])) / 3
        return [np.array([P[0], P[0] + t1 * d, P[1] + t2 * d, P[1]])]
    u = _chord(P)
    ctrl = _generate(P, u, t1, t2)
    err = np.hypot(*(_bez(ctrl, u) - P).T)
    i = int(np.argmax(err))
    if err[i] < eps:
        return [ctrl]
    if err[i] < eps * 4:
        for _ in range(4):
            u = _reparam(P, u, ctrl)
            ctrl = _generate(P, u, t1, t2)
            err = np.hypot(*(_bez(ctrl, u) - P).T)
            i = int(np.argmax(err))
            if err[i] < eps:
                return [ctrl]
    if depth > 40:
        return [ctrl]
    i = min(max(i, 1), len(P) - 2)
    tc = _unit(P[i - 1] - P[i + 1])
    return fit(P[:i + 1], t1, tc, eps, depth + 1) + fit(P[i:], -tc, t2, eps, depth + 1)


def fit_closed(P, eps):
    """closed polyline -> list of cubic segments; split at two opposite points with smooth tangents"""
    n = len(P)
    if n < 4:
        return []
    j = n // 2
    tan = lambda k: _unit(P[(k + 1) % n] - P[(k - 1) % n])
    A = np.vstack([P[:j + 1]]); B = np.vstack([P[j:], P[:1]])
    return fit(A, tan(0), -tan(j), eps) + fit(B, tan(j), -tan(0), eps)
