# The turquoise twisted glass vase, copied from ref. 087 (owner's decision of 2026-10-16: exact, measured copies).
# Measured, not decalqued:
#   - shape: the vase isolated on the photograph (seg.py: out/vase_mask.png), its outline traced as curves;
#   - relief: the normals of the photograph's depth map (Depth Anything V2, out/normal.png), steepness calibrated on the
#     outline (the silhouette's normals lie in the picture plane);
#   - material ("spectrography"): the glass's colour inverted into two smooth material maps with a physical meaning --
#     the thickness of turquoise glass crossed (Beer-Lambert, absorption measured on the reference's thick and thin glass)
#     and the frost (milky light scattered at the ground surface) -- smoothed over half a centimetre, so that the fine
#     structure comes only from the light computed on the normals;
#   - light: the shop's light and studio on those normals (Fresnel reflections sharp on polished glass, a faint sheen on
#     frosted glass, the thread of light along the rims).
# Returns, in the reference's frame (k work pixels per photo pixel): emission E and transmittance T (rgb 0..1), so that the
# glass over any backdrop B reads E + T * B.
import math
import numpy as np, cv2

OPT = {}
F = lambda k, d: float(OPT.get(k, d))
L3 = np.array([-.5, -.62, .6]); L3 /= np.linalg.norm(L3)
HV = L3 + np.array([0, 0, 1.]); HV /= np.linalg.norm(HV)
PPC = 10.75                       # photo pixels per cm (vase 46.5 cm tall over 500 px)
FOOT = (255.0, 800.0)             # the foot's centre on the photograph
SIG = np.array([1.0, .297, .266])  # absorption ratios of the turquoise glass (red, green, blue), fitted on the reference


def load(k):
    ref = cv2.imread('out/ref.jpg').astype(np.float32)[:, :, ::-1] / 255
    M = cv2.imread('out/vase_mask.png', 0) > 127
    B = np.load('out/bg.npy')[:, :, ::-1] / 255
    n = cv2.imread('out/normal.png')[:, :, ::-1].astype(np.float32) / 255 * 2 - 1
    n[..., 1] *= -1                                         # map: y up; screen: y down
    H, W = M.shape
    up = lambda a, interp=cv2.INTER_CUBIC: cv2.resize(a, (W * k, H * k), interpolation=interp)
    return ref, M, B, n, up


def masked_blur(a, m, s):
    m = m.astype(np.float32)
    if a.ndim == 3:
        return np.stack([masked_blur(a[..., i], m, s) for i in range(a.shape[2])], -1)
    return cv2.GaussianBlur(a * m, (0, 0), s) / np.maximum(cv2.GaussianBlur(m, (0, 0), s), 1e-4)


MILK = np.array([1.0, 1.0, .99])   # the frost's scattered light, fitted on the reference


def invert(C, B, M):
    """per pixel: thickness tau (cm of turquoise glass crossed), frost m (0..1) and the light reaching it g, such that
    C = g * (B * exp(-sig * tau) * (1 - m) + m * MILK)  -- searched on a grid of tau, (g, g m) solved by least squares"""
    sig = SIG * F('sigk', 1.0)
    taus = np.r_[np.linspace(0, 4, 61), np.linspace(4.2, F('taumax', 20), 40)]
    best = np.full(C.shape[:2], 1e9); tau = np.zeros(C.shape[:2]); mm = np.zeros(C.shape[:2]); gg = np.ones(C.shape[:2])
    W = MILK
    for t in taus:
        Be = B * np.exp(-sig * t)
        d = W - Be
        # C = a Be + b d  (a = g, b = g m)
        s11 = (Be * Be).sum(-1); s12 = (Be * d).sum(-1); s22 = (d * d).sum(-1)
        r1 = (Be * C).sum(-1); r2 = (d * C).sum(-1)
        det = np.maximum(s11 * s22 - s12 * s12, 1e-9)
        a = (r1 * s22 - r2 * s12) / det; b = (s11 * r2 - s12 * r1) / det
        a = np.clip(a, F('gmin', .55), F('gmax', 1.15)); m = np.clip(b / np.maximum(a, 1e-3), 0, 1)
        r = ((a[..., None] * (Be + m[..., None] * d) - C) ** 2).sum(-1)
        sel = r < best
        best[sel] = r[sel]; tau[sel] = t; mm[sel] = m[sel]; gg[sel] = a[sel]
    tau[~M] = 0; mm[~M] = 0; gg[~M] = 1
    return tau, mm, gg, best


def env(r, polish):
    rx, ry, rz = r[..., 0], r[..., 1], r[..., 2]
    p2 = polish ** 2
    box = np.exp(-((rx - L3[0]) ** 2 + (ry - L3[1]) ** 2 + (rz - L3[2]) ** 2) / F('boxw', .02)) * p2
    strip = np.exp(-((rx + .72) / F('stripw', .1)) ** 2) * np.clip(1 - np.abs(ry + .15), 0, 1) * (rz > -.2) * p2
    ceil = np.clip(-ry, 0, 1) ** 2 * .3
    return F('kbox', 4) * box + F('kstrip', 2.5) * strip + ceil


def field(k=2):
    ref, M, B, n, up = load(k)
    # ---- material maps, from the reference's colour smoothed inside the vase (no fine structure is taken from the photo)
    s0 = F('matsig', 2.5)
    # the bouquet's stems (in front of the glass or seen through it) are not glass: the material is carried over them
    St = cv2.dilate((cv2.imread('out/stems_mask.png', 0) > 127).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    Cl = masked_blur(ref, M & ~St, s0)
    tau, m, g, res = invert(Cl, B, M)
    tau = masked_blur(tau, M, F('tausm', 1.0)); m = masked_blur(m, M, F('msm', 1.0)); g = masked_blur(g, M, F('gsm', 1.0))
    # ---- to the work resolution
    Mk = up(M.astype(np.float32), cv2.INTER_LINEAR) > .5
    Bk = up(B); tauk = up(tau); mk = np.clip(up(m), 0, 1); gk = up(g)
    nk = up(cv2.GaussianBlur(n, (0, 0), F('nsig', .6)))
    nk /= np.linalg.norm(nk, axis=-1, keepdims=True) + 1e-6
    nz = np.clip(nk[..., 2], 0, 1)
    # ---- light on the normals: only its departure from its own local mean changes the measured material
    dl = (nk * L3).sum(-1)
    lam = np.clip((dl + .55) / 1.55, 0, 1)
    lam_m = masked_blur(lam, Mk, s0 * k)
    shade = 1 + F('shk', .9) * (lam - lam_m)
    polish = 1 - mk
    F0 = .04
    Fr = F0 + (1 - F0) * (1 - nz) ** 5
    r = 2 * nz[..., None] * nk - np.array([0, 0, 1.])
    R = Fr * env(r, polish * F('polk', 1.0))
    R = R - masked_blur(R, Mk, s0 * k) * F('rlow', .7)      # the broad sheen is already in the measured colour
    nh = np.clip((nk * HV).sum(-1), 0, 1)
    hot = F('hot', .5) * nh ** F('hotp', 400) * polish ** 2
    # refraction along the rims: a dark band and a bright thread where the surface turns away
    rim = np.exp(-(nz / F('rimw', .35)) ** 2)
    thread = np.exp(-(nz / F('thw', .12)) ** 2)
    absorb = np.exp(-SIG * F('sigk', 1.0) * tauk[..., None])
    T = gk[..., None] * absorb * (1 - mk[..., None]) * (1 - Fr[..., None]) * (1 - F('rimd', .35) * rim[..., None])
    E = gk[..., None] * mk[..., None] * MILK * shade[..., None] + (np.clip(R, -.3, None) + hot + F('thk', .35) * thread)[..., None]
    E = np.clip(E, 0, None)
    T[~Mk] = 1; E[~Mk] = 0
    return dict(E=E, T=T, M=Mk, B=Bk, tau=tauk, m=mk, n=nk, k=k)
