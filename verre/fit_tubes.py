# Fits every limb tube to the reference: at each axis point, along the normal, the two contours of the limb (strongest pair of
# edges around the expected width) give the centre and the radius; the result is smoothed along the axis.
# Output: out/tubes_fit.json {"fig.name": [[x, y, r, z], ...]} used by mk.py instead of the hand values.
import sys, json, math
import numpy as np, cv2
sys.path.insert(0, '.')
import trace as T
import tubes as TB

im = cv2.imread('out/ref.jpg').astype(np.float32) / 255
L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
Ls = cv2.GaussianBlur(L, (0, 0), 1.6)
G = np.hypot(cv2.Sobel(Ls, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(Ls, cv2.CV_32F, 0, 1, ksize=3))
hp = cv2.GaussianBlur(L, (0, 0), 1.0) - cv2.GaussianBlur(L, (0, 0), 3.0)
rough = np.sqrt(cv2.GaussianBlur(hp * hp, (0, 0), 6))
G = G / (1 + 14 * rough)
G = cv2.GaussianBlur(G, (0, 0), 1.0)
G /= np.percentile(G, 99)


def sample(x, y):
    if 0 <= x < G.shape[1] - 1 and 0 <= y < G.shape[0] - 1:
        return float(cv2.getRectSubPix(G, (1, 1), (float(x), float(y)))[0, 0])
    return 0.0


def fit(axis, grow=(.6, 1.9)):
    A = [list(a) + [0] * (4 - len(a)) for a in axis]
    out = []
    for i, (x, y, r, z) in enumerate(A):
        a, b = A[max(0, i - 1)], A[min(len(A) - 1, i + 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        l = math.hypot(tx, ty) or 1
        nx, ny = -ty / l, tx / l
        ss = np.arange(-grow[1] * r - 6, grow[1] * r + 6.5, 1.0)
        prof = np.array([sample(x + nx * s, y + ny * s) for s in ss])
        best, bs = None, -1e9
        for i1, s1 in enumerate(ss):
            if s1 > -grow[0] * r:
                break
            for i2 in range(len(ss) - 1, i1, -1):
                s2 = ss[i2]
                if s2 < grow[0] * r:
                    break
                rr = (s2 - s1) / 2; c = (s1 + s2) / 2
                score = prof[i1] + prof[i2] - .9 * abs(rr - r) / r - .7 * abs(c) / r
                if score > bs:
                    bs, best = score, (c, rr)
        if best is None:
            out.append([x, y, r, z]); continue
        c, rr = best
        out.append([x + nx * c, y + ny * c, rr, z])
    out = np.array(out, float)
    # smooth centres and radii along the axis, keep the end points' radii close to the hand values
    if len(out) >= 3:
        k = np.array([.25, .5, .25])
        for j in range(3):
            v = out[:, j].copy()
            out[1:-1, j] = np.convolve(v, k, 'valid')
    return [[round(v, 1) for v in p] for p in out]


res = {}
for p in T.PARTS:
    if 'axis' not in p or p.get('nofit'):
        continue
    res['%s.%s' % (p['fig'], p['name'])] = fit(p['axis'])
json.dump(res, open('out/tubes_fit.json', 'w'), indent=0)
for k, v in res.items():
    hand = next(q for q in T.PARTS if '%s.%s' % (q['fig'], q['name']) == k)['axis']
    print(k, ' '.join('(%d,%d,%d->%d,%d,%d)' % (a[0], a[1], a[2], b[0], b[1], b[2]) for a, b in zip(hand, v)))
