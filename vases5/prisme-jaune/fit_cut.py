# Fits the cut of the block to points measured on the photograph (pixels): the girdle's six-sided section and, for the top
# and the foot, the offset of each face (a sawn face stays planar: its top and bottom edges are parallel to its girdle edge),
# seen by the photograph's pinhole camera (eye level with the top, about 2.3 m away). Prints the numbers for mk.py.
#   python fit_cut.py
import numpy as np, math, sys
MIRROR = 'mirror' in sys.argv
from scipy.optimize import least_squares

H = 25.1                      # cm (1stDibs, same model)
PEY = 318.5                   # the top is seen edge on: the eye's level in the image
K = (1240.0 - PEY) / H        # px per cm at the axis: the foot's side corners at y = 1240
DC = 232.0                    # distance of the eye (cm): from the foot's front bulge (8 px) for a block ~7 cm deep

# measured on the photograph (sub-pixel silhouette lines, line segments of the facet edges), px
OBS = {
    'L_g': (417.5, 839.5), 'R_g': (781.0, 840.0),
    'L_t': (495.9, None), 'R_t': (680.4, None), 'F1_t': (562.0, None),
    'L_b': (477.0, 1240.0), 'R_b': (683.0, 1241.0), 'F1_b': (547.7, 1248.0), 'F2_b': (603.5, 1248.0),
    'F1_g': (548.8, None),
}


BACK = None      # (x of the back right vertex, x of the back left vertex, depth of the back facet); None: mirror of the front
FZ = 3.4         # prior on the front facet's depth (cm)


def sec_from(p):
    Lx, Lz, F1x, Fz, F2x, Rx, Rz = p[:7]
    if BACK is not None:
        b1, b2, bz = BACK
        return np.array([[Lx, Lz], [F1x, Fz], [F2x, Fz], [Rx, Rz], [b1, -bz], [b2, -bz]])
    if MIRROR:      # the back is the mirror image of the front (faces symmetric about the girdle's long axis)
        return np.array([[Lx, Lz], [F1x, Fz], [F2x, Fz], [Rx, Rz], [F2x, -Fz], [F1x, -Fz]])
    return np.array([[Lx, Lz], [F1x, Fz], [F2x, Fz], [Rx, Rz], [-F1x, -Fz], [-F2x, -Fz]])


def normals(P):
    out = []
    for i in range(len(P)):
        e = P[(i + 1) % len(P)] - P[i]
        n = np.array([e[1], -e[0]]); n /= np.linalg.norm(n)
        if n @ P[i] < 0:
            n = -n
        out.append(n)
    return np.array(out)


def level(N, d):
    """vertices of the polygon whose sides lie on the lines n_i . p = d_i (vertex i between sides i-1 and i)"""
    V = []
    for i in range(len(N)):
        A = np.array([N[i - 1], N[i]]); V.append(np.linalg.solve(A, [d[i - 1], d[i]]))
    return np.array(V)


def proj(x, h, z):
    return np.array([599.0 + K * DC * x / (DC - z), PEY + K * DC * (H - h) / (DC - z)])


def model(p):
    P = sec_from(p); N = normals(P); d = np.array([N[i] @ P[i] for i in range(6)])
    dt, db, cx = p[7:13], p[13:19], 0.0
    hg = p[19]
    Vt, Vb, Vg = level(N, dt), level(N, db), P
    # vertex order: 0 = L, 1 = F1 (front left), 2 = F2, 3 = R
    pr = lambda V, i, h: proj(V[i][0], h, V[i][1])
    return dict(L_g=pr(Vg, 0, hg), R_g=pr(Vg, 3, hg), L_t=pr(Vt, 0, H), R_t=pr(Vt, 3, H), F1_t=pr(Vt, 1, H),
                L_b=pr(Vb, 0, 0), R_b=pr(Vb, 3, 0), F1_b=pr(Vb, 1, 0), F2_b=pr(Vb, 2, 0), F1_g=pr(Vg, 1, hg)), d


def resid(p):
    m, d = model(p)
    r = []
    for k, (x, y) in OBS.items():
        r.append(m[k][0] - x)
        if y is not None:
            r.append(m[k][1] - y)
    # priors: the corners on the axis plane, faces shrink roughly evenly, the girdle's depth about 7 cm
    r += [p[1] * 3, p[6] * 3]
    st, sb = .51, .57
    r += list((p[7:13] - st * d) * 4) + list((p[13:19] - sb * d) * 4)
    r += [(p[3] - FZ) * 20]
    return np.array(r)


def fit(fz=3.4, back=None):
    """the cut for a given front depth and back; returns the key=value arguments of mk.py and the rms in px"""
    global FZ, BACK
    FZ, BACK = fz, back
    p0 = np.r_[[-4.9, 0, -1.4, fz, -.3, 4.9, 0], np.ones(6), np.ones(6), 10.9]
    m0, d0 = model(p0)
    p0[7:13] = .51 * d0; p0[13:19] = .57 * d0
    sol = least_squares(resid, p0)
    m, d = model(sol.x)
    rms = float(np.sqrt(np.mean(sol.fun[:15] ** 2)))
    P = sec_from(sol.x)
    args = ['sec=' + ','.join('%.3f' % v for v in P.ravel()), 'dtop=' + ','.join('%.3f' % v for v in sol.x[7:13]),
            'dbot=' + ','.join('%.3f' % v for v in sol.x[13:19]), 'hg0=%.3f' % sol.x[19]]
    return args, rms, m


if __name__ == '__main__':
    args, rms, m = fit(3.4, None)
    print('rms px', round(rms, 2))
    for k, (x, y) in OBS.items():
        print(k, (x, y), np.round(m[k], 1))
    print(' '.join(args))
