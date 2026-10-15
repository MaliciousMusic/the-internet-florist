# Shape from shading of the reference: the height field H of the body whose rendering under the photograph's light best matches
# the photograph's lightness, kept close to the modelled plateau of the figures and smooth. This measures the form of the sculpture;
# the vase is then relit with the shop's own light (mk.py). Output: out/sfs_h.npy (heights in reference pixels, at 1/R resolution).
#   python sfs.py [R=4] [iters=600] [ls=..] [lp=..]
import sys, math, json, time
import numpy as np, cv2
from scipy.optimize import minimize
sys.path.insert(0, '.')
OPT = dict(a.split('=') for a in sys.argv[1:] if '=' in a)
R = int(OPT.get('R', 4))
import mk  # noqa: E402  (geometry helpers; its own argv parsing is harmless)

t0 = time.time()
H, W = mk.H, mk.W
h4, w4 = H // R, W // R
ref = cv2.imread(mk.REF)
L = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)
L = cv2.bilateralFilter(L, 9, 16, 5).astype(np.float32) / 255
S = cv2.resize(L, (w4, h4), interpolation=cv2.INTER_AREA).astype(np.float64)
yy, xx = np.mgrid[0:h4, 0:w4].astype(float) * R

# where the photograph measures the body: inside the silhouette, between the lip band and the foot
sil = mk.poly_mask(mk.silhouette_pts(), 1 / R, (h4, w4), n=1)
body = sil & (yy > 212) & (yy < 1235)
wgt = cv2.GaussianBlur(body.astype(np.float32), (0, 0), 1.5).astype(np.float64) * body

# prior: the figures raised on a soft plateau (from the guided segmentation), a gentle inflation
lab = np.load('out/lab.npy')
figm = cv2.resize((lab >= 3).astype(np.uint8), (w4, h4), interpolation=cv2.INTER_AREA) > 0
plate = cv2.GaussianBlur(figm.astype(np.float32), (0, 0), 1.2).astype(np.float64)
infl = mk.inflate(figm) * R
H0 = float(OPT.get('plateau', 14)) * plate + float(OPT.get('infl', .35)) * infl
H0 *= body

# the photograph's light: soft, from the front, a little from the left and above; the cylinder turns the body away at the sides
Lp = np.array([float(v) for v in OPT.get('light', '-.22,-.18,1').split(',')]); Lp /= np.linalg.norm(Lp)
cx = mk.CX(yy); rg = mk.RG(np.clip(yy, 205, 1115))
sphi = np.clip((xx - cx) / rg, -.97, .97); cphi = np.sqrt(1 - sphi ** 2)
# light expressed in the local frame of the turned surface: L' = Rot(phi)^T Lp
Lx = Lp[0] * cphi - Lp[2] * sphi
Lz = Lp[0] * sphi + Lp[2] * cphi
Ly = np.full_like(Lx, Lp[1])

lam_s = float(OPT.get('ls', 0.02)); lam_p = float(OPT.get('lp', 0.0006))
# a(y), b(y): ambient and gain of the photograph, slowly varying with height (the white table lights the foot from below)
ya = (yy - 700) / 500


B0 = float(OPT.get('b0', .72))


def fit_ab(Hc):
    """the gain of the shading is fixed (a matte satin body under a broad light); the ambient a(y) is fitted"""
    nl = shade(Hc)[0]
    A = np.stack([np.ones_like(ya), ya, ya ** 2], -1)[body]
    rhs = (S - B0 * nl)[body]
    c, *_ = np.linalg.lstsq(A * wgt[body][:, None], rhs * wgt[body], rcond=None)
    return np.r_[c, B0, 0, 0]


def shade(Hc):
    p = np.zeros_like(Hc); q = np.zeros_like(Hc)
    p[:, :-1] = (Hc[:, 1:] - Hc[:, :-1]) / R
    q[:-1, :] = (Hc[1:, :] - Hc[:-1, :]) / R
    N = np.sqrt(1 + p * p + q * q)
    dot = -p * Lx - q * Ly + Lz
    return dot / N, p, q, N, dot


def lap(Z):
    return cv2.Laplacian(Z, cv2.CV_64F, ksize=1, borderType=cv2.BORDER_REPLICATE)


coef = None


def energy(v):
    Hc = v.reshape(h4, w4)
    nl, p, q, N, dot = shade(Hc)
    c = coef
    a = c[0] + c[1] * ya + c[2] * ya ** 2
    b = c[3] + c[4] * ya + c[5] * ya ** 2
    Rr = a + b * nl
    r = Rr - S
    Ed = np.sum(wgt * r * r)
    # d nl / dp, d nl / dq
    dp = (-Lx / N - dot * p / N ** 3)
    dq = (-Ly / N - dot * q / N ** 3)
    gp = 2 * wgt * r * b * dp / R
    gq = 2 * wgt * r * b * dq / R
    gH = np.zeros_like(Hc)
    # p[:, j] = H[:, j+1] - H[:, j]  ->  transpose
    gH[:, 1:] += gp[:, :-1]; gH[:, :-1] -= gp[:, :-1]
    gH[1:, :] += gq[:-1, :]; gH[:-1, :] -= gq[:-1, :]
    LH = lap(Hc)
    Es = lam_s * np.sum(LH * LH)
    gH += 2 * lam_s * lap(LH)
    Ep = lam_p * np.sum((Hc - H0) ** 2)
    gH += 2 * lam_p * (Hc - H0)
    # outside the body the height stays at the prior
    out = ~body
    gH[out] += 2 * 1.0 * (Hc[out] - H0[out])
    Eo = 1.0 * np.sum((Hc[out] - H0[out]) ** 2)
    return Ed + Es + Ep + Eo, gH.ravel()


Hc = H0.copy()
for rnd in range(int(OPT.get('rounds', 3))):
    coef = fit_ab(Hc)
    res = minimize(energy, Hc.ravel(), jac=True, method='L-BFGS-B', options={'maxiter': int(OPT.get('iters', 400)), 'maxcor': 12})
    Hc = res.x.reshape(h4, w4)
    nl = shade(Hc)[0]
    a = coef[0] + coef[1] * ya + coef[2] * ya ** 2; b = coef[3] + coef[4] * ya + coef[5] * ya ** 2
    err = np.sqrt(np.sum(wgt * (a + b * nl - S) ** 2) / wgt.sum())
    print('round %d: E %.1f, rms %.4f, H %.1f..%.1f, %.1fs' % (rnd, res.fun, err, Hc[body].min(), Hc[body].max(), time.time() - t0))
np.save('out/sfs_h.npy', Hc)
json.dump({'R': R, 'coef': list(coef)}, open('out/sfs.json', 'w'))
# preview: the fitted rendering next to the photograph, and the height
fit = np.clip(a + b * nl, 0, 1) * body
hn = (Hc - Hc[body].min()) / (np.ptp(Hc[body]) + 1e-6) * body
cv2.imwrite('out/sfs_prev.jpg', (np.hstack([S * body, fit, hn]) * 255).astype(np.uint8))
