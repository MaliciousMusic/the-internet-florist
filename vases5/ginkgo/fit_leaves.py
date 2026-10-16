# Places our ginkgo leaf (the triangular wedge template validated by the owner) on every leaf of the reference: the glaze
# measured on the photograph (trace.py -> out/decor_maps.npz) is covered greedily by template leaves (apex, axis, size,
# opening, notch), each then refined by a local search on the overlap with the measured glaze. The result, in numbers only,
# goes to leaves_fit.json: per leaf its parameters in the photograph and its outline and veins on the turned surface (phi, h).
#   python fit_leaves.py
import sys, os, math, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
sys.argv = ['mk.py', 'x']
sys.path.insert(0, HERE)
import mk  # noqa: E402

z = np.load('out/decor_maps.npz')
up = int(z['up'])
G = cv2.resize(z['glaze'].astype(np.float32), None, fx=1 / up, fy=1 / up, interpolation=cv2.INTER_AREA) > .5    # 1x photo pixels
H0, W0 = G.shape
rng = np.random.default_rng(7)
LAM = 1.6                                       # cost of a template pixel laid on bare stoneware


CANON = {}


def canon(ps, nt, asym, seed):
    """the template at unit length, axis straight down, apex at the origin (cached; scale and rotation are exact)"""
    k = (round(ps), round(nt, 2), round(asym, 2), int(seed))
    if k not in CANON:
        g = mk.leaf_geom((0, 1e-4, 0, 0, 1.0, 58 + (k[0] - 44) / .7, (k[1] - .2) / .6, 0, k[2], k[3]))
        CANON[k] = (g['poly'], g['veins'])
    return CANON[k]


def template(p):
    """photo-pixel polygon of a leaf: p = apex x, apex y, axis (deg from down, + to the right), length (px), half opening
    (deg), notch, asymmetry, seed"""
    x, y, ang, R, ps, nt, asym, seed = p
    poly, veins = canon(ps, nt, asym, seed)
    a = math.radians(ang)
    M = np.array([[math.cos(a), -math.sin(a)], [math.sin(a), math.cos(a)]]) * R      # (s, d) rotated by the axis angle
    return poly @ M + np.array([x, y]), dict(veins=[v @ M for v in veins])


def raster(poly, shape=(H0, W0)):
    m = np.zeros(shape, np.uint8)
    cv2.fillPoly(m, [np.round(poly * 4).astype(np.int32)], 1, cv2.LINE_8, 2)
    return m.astype(bool)


def gain(poly, cover):
    x0, y0 = np.floor(poly.min(0)).astype(int) - 1; x1, y1 = np.ceil(poly.max(0)).astype(int) + 2
    x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, W0), min(y1, H0)
    if x1 <= x0 or y1 <= y0:
        return -1e9
    m = np.zeros((y1 - y0, x1 - x0), np.uint8)
    cv2.fillPoly(m, [np.round((poly - [x0, y0]) * 4).astype(np.int32)], 1, cv2.LINE_8, 2)
    m = m.astype(bool)
    g, c = G[y0:y1, x0:x1], cover[y0:y1, x0:x1]
    return float((m & g & ~c).sum() - LAM * (m & ~g).sum())


# ---------------------------------------------------------------- greedy cover
leaves, cover = [], np.zeros_like(G)
ys, xs = np.nonzero(cv2.dilate(G.astype(np.uint8), np.ones((9, 9), np.uint8)))
for it in range(int(os.environ.get('NLEAF', 15))):
    best, bp = 0, None
    idx = rng.choice(len(xs), 700, replace=False)
    for i in idx:
        for ang in range(-180, 180, 20):
            for R in (40, 52, 64, 76):
                p = [xs[i], ys[i], ang, R, 48, .34, 0, 11 + it]
                gn = gain(template(p)[0], cover)
                if gn > best:
                    best, bp = gn, p
    if bp is None or best < 250:
        break
    # local refinement of the new leaf
    cur = list(bp); cg = best
    for k in range(500):
        q = list(cur)
        j = rng.integers(0, 7)
        q[j] += [rng.normal(0, 2.5), rng.normal(0, 2.5), rng.normal(0, 6), rng.normal(0, 4), rng.normal(0, 3), rng.normal(0, .05), rng.normal(0, .03)][j]
        q[3] = float(np.clip(q[3], 30, 95)); q[4] = float(np.clip(q[4], 40, 62)); q[5] = float(np.clip(q[5], .25, .48))
        q[6] = float(np.clip(q[6], -.1, .1))
        gq = gain(template(q)[0], cover)
        if gq > cg:
            cur, cg = q, gq
    leaves.append(cur)
    cover |= raster(template(cur)[0])
    print('leaf %d gain %d  apex (%.0f, %.0f) axis %.0f len %.0f open %.0f' % (it, cg, cur[0], cur[1], cur[2], cur[3], 2 * cur[4]))

# ---------------------------------------------------------------- joint refinement (each leaf against all the others)
def iou(ls):
    u = np.zeros_like(G)
    for p in ls:
        u |= raster(template(p)[0])
    return (u & G).sum() / (u | G).sum()


score = iou(leaves)
for sweep in range(3):
    for li in range(len(leaves)):
        for k in range(150):
            q = list(leaves[li]); j = rng.integers(0, 7)
            q[j] += [rng.normal(0, 1.5), rng.normal(0, 1.5), rng.normal(0, 4), rng.normal(0, 3), rng.normal(0, 2), rng.normal(0, .04), rng.normal(0, .02)][j]
            q[3] = float(np.clip(q[3], 30, 95)); q[4] = float(np.clip(q[4], 40, 62)); q[5] = float(np.clip(q[5], .25, .48))
            trial = leaves[:li] + [q] + leaves[li + 1:]
            s = iou(trial)
            if s > score:
                leaves, score = trial, s
    print('sweep %d  IoU %.3f' % (sweep, score))

# ---------------------------------------------------------------- onto the turned surface
cam = mk.Cam('photo'); cam.P = 1.0; cam.W, cam.H = W0, H0
phi, h, hit, _ = cam.inverse()
def to_surf(P):
    P = np.asarray(P, float)
    xi = np.clip(P[:, 0], 0, W0 - 1.001); yi = np.clip(P[:, 1], 0, H0 - 1.001)
    f = lambda A: cv2.remap(A.astype(np.float32), xi.reshape(1, -1).astype(np.float32), yi.reshape(1, -1).astype(np.float32), cv2.INTER_LINEAR).ravel()
    return np.c_[f(phi), f(h)]
out = []
for i, p in enumerate(leaves[::-1]):                 # the first found (largest) is drawn last, on top
    poly, g = template(p)
    out.append(dict(p=[round(float(v), 3) for v in p], poly=to_surf(poly).round(5).tolist(),
                    veins=[to_surf(v + np.array(p[:2])).round(5).tolist() for v in g['veins']],
                    apex=to_surf(np.array([p[:2]]))[0].round(5).tolist()))
json.dump(dict(iou=round(float(score), 4), leaves=out), open('leaves_fit.json', 'w'), separators=(',', ':'))
vis = cv2.imread('out/ref.jpg')
for p in leaves:
    cv2.polylines(vis, [np.round(template(p)[0]).astype(np.int32)], True, (255, 0, 255), 1)
cv2.imwrite('out/work/fit_vis.png', cv2.resize(vis[120:490, 140:420], None, fx=2, fy=2))
print('IoU of the template leaves with the measured glaze: %.3f' % score)
