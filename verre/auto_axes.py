# First guess of the swept forms: the medial axis of every segmented form (longest skeleton path) with its local radius.
# Output out/axes_auto.json {part: [[x, y, r], ...]} in reference pixels, to be checked and corrected by hand (axes.py).
import sys, json, numpy as np, cv2
from collections import deque
from scipy import ndimage as ndi
from skimage.morphology import skeletonize
sys.argv = ['mk.py', 'photo']
sys.path.insert(0, '.')
import mk
import trace as T

order = mk.build_groups()
out = {}
for p in T.PARTS:
    m = p.get('full')
    if m is None or m.sum() < 400:
        continue
    m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 4) > .5
    dt = ndi.distance_transform_edt(m)
    sk = skeletonize(m)
    ys, xs = np.nonzero(sk)
    if len(ys) < 5:
        continue
    idx = {(y, x): i for i, (y, x) in enumerate(zip(ys, xs))}
    nb = [[] for _ in ys]
    for i, (y, x) in enumerate(zip(ys, xs)):
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                j = idx.get((y + dy, x + dx))
                if j is not None and j != i:
                    nb[i].append(j)

    def bfs(s):
        dist = {s: 0}; prev = {s: None}; q = deque([s]); last = s
        while q:
            u = q.popleft(); last = u
            for v in nb[u]:
                if v not in dist:
                    dist[v] = dist[u] + 1; prev[v] = u; q.append(v)
        far = max(dist, key=dist.get)
        return far, prev
    # longest path weighted toward the thick parts: start from the deepest point
    s = int(np.argmax(dt[ys, xs]))
    a, _ = bfs(s)
    b, prev = bfs(a)
    path = []
    u = b
    while u is not None:
        path.append(u); u = prev[u]
    P = np.array([(xs[i], ys[i]) for i in path], float)
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    n = max(3, int(d[-1] / 28) + 1)
    t = np.linspace(0, d[-1], n)
    X = np.interp(t, d, P[:, 0]); Y = np.interp(t, d, P[:, 1])
    Rr = np.array([dt[int(round(y)), int(round(x))] for x, y in zip(X, Y)])
    # extend the ends by their radius (the skeleton stops short of the rounded ends)
    out['%s.%s' % (p['fig'], p['name'])] = [[round(x), round(y), round(float(r), 1)] for x, y, r in zip(X, Y, Rr)]
json.dump(out, open('out/axes_auto.json', 'w'), indent=0)
for k, v in out.items():
    print(k, v)
