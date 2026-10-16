# The photograph's light, measured (pass "light alone"): on the plain glaze (one known albedo), the colour of the photograph
# is fitted, channel by channel and by least squares, as
#     albedo x (1 - Fresnel) x [occlusion x SH9(normal) . c  +  k x key light with its shadows]  +  s x reflection of the room
# where the normals, the occlusion, the key light's shadows and the Fresnel reflections come from our model (aux_photo.npy,
# written by `python mk.py prev res=1 aux=1`). The 9 x 3 coefficients c, k and s go to light_photo.json; mk.py then lights
# the photograph-framed render with them (the shop keeps its own light).
#   python relight.py
import sys, os, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import mesure as M  # noqa: E402

ref, _ = M.read(os.path.join(HERE, 'out', 'ref.jpg'))
A = np.load(os.path.join(HERE, 'out', 'aux_photo.npy'))
z = np.load(os.path.join(HERE, 'out', 'field_photo.npz'))
pid, cov = z['pid'], z['cov']
mref = cv2.imread(os.path.join(HERE, 'out', 'mask_ref.png'), 0) > 127
T = (cv2.GaussianBlur(ref, (0, 0), 1.0)[..., ::-1].astype(np.float32) / 255) ** 2.2
m = (pid == 0) & (cov > .99) & mref & (A[..., 12] == 0)
m = cv2.erode(m.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
N, aof, alb, omf, spec, key = A[..., 0:3][m], A[..., 3][m], A[..., 4:7][m], A[..., 7][m], A[..., 8:11][m], A[..., 11][m]
x, y, zz = N[:, 0], N[:, 1], N[:, 2]
Y = np.stack([np.full_like(x, .282), .489 * y, .489 * zz, .489 * x, 1.093 * x * y, 1.093 * y * zz, .315 * (3 * zz * zz - 1),
              1.093 * x * zz, .546 * (x * x - y * y)], 1)
t = T[m]
res = dict(sh=np.zeros((9, 3)).tolist(), key=[0, 0, 0], spec=[0, 0, 0])
sh = np.zeros((9, 3)); kk = np.zeros(3); ss = np.zeros(3)
for ch in range(3):
    base = (alb[:, ch] * omf)[:, None]
    NS = int(next((a.split('=')[1] for a in sys.argv if a.startswith('nsh=')), 4))     # order 1 by default: it extrapolates
    X = np.c_[base * aof[:, None] * Y[:, :NS], base[:, 0] * key, spec[:, ch]]           # sanely to the normals the glaze barely shows
    w = np.ones(len(t))
    for it in range(6):                            # robust: the photograph's own highlights and stains weigh less
        Xw = X * w[:, None]
        sol = np.linalg.solve(Xw.T @ X + 1e-4 * np.eye(X.shape[1]), Xw.T @ t[:, ch])
        r = t[:, ch] - X @ sol
        sc = 1.4826 * np.median(np.abs(r)) + 1e-6
        w = 1 / np.maximum(1, np.abs(r) / (2 * sc))
    sh[:NS, ch], kk[ch], ss[ch] = sol[:NS], max(sol[NS], 0), max(sol[NS + 1], 0)
    print('channel', ch, 'rms', round(float(np.sqrt(np.mean((t[:, ch] - X @ sol) ** 2))), 4), 'key', round(float(sol[NS]), 3),
          'spec', round(float(sol[NS + 1]), 3))
json.dump(dict(sh=sh.round(5).tolist(), key=kk.round(5).tolist(), spec=ss.round(4).tolist(), pixels=int(m.sum())),
          open(os.path.join(HERE, 'light_photo.json'), 'w'), indent=1)
