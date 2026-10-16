# ajuste.py: fits the silhouette parameters of each ring on the reference's ring map (Nelder-Mead on 1 - IoU), half
# resolution; prints the key=value set to pass to mk.py (saved in out/lect/ajuste.txt)
import sys, os, importlib.util, json, cv2, numpy as np
from scipy.optimize import minimize


def load():
    sp = importlib.util.spec_from_file_location('coupes_mk', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mk.py'))
    m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    return m


ref = cv2.imread('out/lect/anneaux.png', 0)
S = .5
refs = cv2.resize(ref, None, fx=S, fy=S, interpolation=cv2.INTER_NEAREST)
base = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)


def build(params):
    sys.argv = ['mk.py', 'photo'] + ['%s=%s' % kv for kv in params.items()]
    return load()


def labels(mk):
    H, W = refs.shape
    gx = (np.arange(W) + .5) / S; gy = (np.arange(H) + .5) / S
    XX, YY = np.meshgrid(gx, gy)
    xm = (XX - mk.AX) / mk.PK; yu = (mk.YF - YY) / mk.PK
    o = np.stack([xm.ravel(), (yu + 40 * mk.TE).ravel(), np.full(xm.size, 40.)], 1)
    d = np.tile(mk.DV, (len(o), 1))
    bt, bk, _ = mk.first_hit(o, d, -1e9)
    return np.where(np.isfinite(bt), bk + 1, 0).reshape(H, W)


def iou(lab, k):
    a, b = refs == k, lab == k
    return (a & b).sum() / max(1, (a | b).sum())


P = dict(base)
groups = {
    4: [('oD', 0), ('oD', 3), ('rlD', None)],
    3: [('oC', 0), ('oC', 3), ('drC', None), ('rlC', None)],
    2: [('oB', 0), ('oB', 3), ('rlB', None)],
    1: [('oA', 0), ('oA', 3), ('drA', None), ('eAx', None), ('eAy', None), ('eAa', None), ('eAb', None),
        ('fAx', None), ('fAy', None), ('fAa', None), ('fAb', None)],
}
mk = build(P)
defaults = {'oD': '117,148,530,577', 'oC': '189,207,508,521', 'oB': '171,198,484,497', 'oA': '182,199,511,524',
            'rlD': '6.5', 'drC': '-.23', 'rlC': '0', 'rlB': '0', 'drA': '-.24', 'eAx': '355', 'eAy': '459', 'eAa': '184',
            'eAb': '396', 'fAx': '355', 'fAy': '700', 'fAa': '170', 'fAb': '75'}
for k, v in defaults.items():
    P.setdefault(k, v)
steps = {'oD': 3, 'oC': 3, 'oB': 3, 'oA': 3, 'rlD': .8, 'drC': .04, 'rlC': .8, 'rlB': .8, 'drA': .04, 'eAx': 6, 'eAy': 25,
         'eAa': 10, 'eAb': 25, 'fAx': 6, 'fAy': 20, 'fAa': 12, 'fAb': 15}
for k in (4, 3, 2, 1):
    G = groups[k]

    def get():
        return np.array([float(P[n].split(',')[i]) if i is not None else float(P[n]) for n, i in G])

    def put(x):
        for (n, i), v in zip(G, x):
            if i is None:
                P[n] = '%.4g' % v
            else:
                a = P[n].split(','); a[i] = '%.2f' % v; P[n] = ','.join(a)

    def cost(x):
        put(x)
        return 1 - iou(labels(build(P)), k)
    x0 = get()
    sim = np.array([x0] + [x0 + np.eye(len(x0))[j] * steps[G[j][0]] for j in range(len(x0))])
    r = minimize(cost, x0, method='Nelder-Mead', options=dict(initial_simplex=sim, maxfev=60 * len(x0), xatol=.05, fatol=1e-5))
    put(r.x)
    print('ring', k, 'IoU %.4f' % (1 - r.fun), {n: P[n] for n, _ in G}, flush=True)
lab = labels(build(P))
print('silhouette', round(float(((refs > 0) & (lab > 0)).sum() / ((refs > 0) | (lab > 0)).sum()), 4))
keep = {k: P[k] for k in defaults}
open('out/lect/ajuste.txt', 'w').write(' '.join('%s=%s' % kv for kv in keep.items()))
print(' '.join('%s=%s' % kv for kv in keep.items()))
