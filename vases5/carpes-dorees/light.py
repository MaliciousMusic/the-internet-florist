# The light of the shop on the jar: the view rays find the relief (the carp stand out of the surface, even past the silhouette),
# the relief casts soft shadows and darkens its hollows, the patina is a glossy chocolate-to-caramel bronze mirroring a coherent
# studio, the carp a cast golden alloy whose reflections are tinted by the metal and whose high points are rubbed bright.
import math
import numpy as np
import cv2
from scipy import ndimage as ndi
import geom as G

# the shop: one light, up on the left (screen frame: x right, y down, z to the eye); in the world frame (X right, Y up, Z to the eye)
L3 = np.array([-.5, -.62, .6]); L3 /= np.linalg.norm(L3)
LW = np.array([L3[0], -L3[1], L3[2]])
UPC, VX, FL, RY = 9.75, 500.0, 990.0, .16

# the photograph's camera (fitted on the lip and foot ellipses: 16.2 px per cm at the axis, eye 54 cm up and 370 cm away)
PH = dict(K=16.2, CX=274.5, CY0=458.0, ZE=370.0, YE=54.4)


class Fields:
    """the relief over the texels, with what the rays and the light need: a smoothed height for the shadows, its local maximum
    (how far a ray may step), its slopes, the occlusion and the rubbed high points"""

    def __init__(self, Hf, own, Ft, Fz):
        self.Hf, self.own, self.Ft, self.Fz = Hf, own, Ft, Fz
        self.Hn = cv2.GaussianBlur(Hf, (0, 0), 1.1)                 # for the normals: the texel steps softened
        k = int(1.2 / G.TX)
        self.Hmax = ndi.maximum_filter(Hf, size=(2 * k + 1, 2 * int(1.2 / (G.TX)) + 1)) + .02
        # slopes: per radian round the axis and per cm along the meridian
        self.gth = np.gradient(self.Hn, G.DTH, axis=1).astype(np.float32)
        self.gs = np.gradient(self.Hn, G.TX, axis=0).astype(np.float32)
        B1 = cv2.GaussianBlur(Hf, (0, 0), .12 / G.TX); B2 = cv2.GaussianBlur(Hf, (0, 0), .55 / G.TX)
        c1, c2 = B1 - Hf, B2 - Hf
        self.ao = (1 - .55 * np.clip(c2 / .45, 0, 1) - .45 * np.clip(c1 / .1, 0, 1)).astype(np.float32)
        # high points rubbed back to the bright metal (convex places: the smoothed field below the field)
        self.wr = np.clip((-c1 - .01) / .06, 0, 1).astype(np.float32) * (Hf > .05)
        self.sh = None

    def shadows(self, steps=48, tmax=4.5):
        """soft shadows of the relief, marched toward the light from every texel near the relief (texel space)"""
        Hs = cv2.GaussianBlur(self.Hf, (0, 0), .06 / G.TX)
        near = ndi.maximum_filter(self.Hf > .01, size=int(5 / G.TX))
        jj, ii = np.nonzero(near)
        sh = np.ones(self.Hf.shape, np.float32)
        th = G.TH[ii]; s = G.SV[jj]
        h = G.h_of_s(s); r = G.r_of_s(s); nr = G.at_s(G.NR, s); nu = G.at_s(G.NU, s)
        e0 = self.Hf[jj, ii] + .03
        P = np.c_[(r + e0 * nr) * np.sin(th), h + e0 * nu, (r + e0 * nr) * np.cos(th)]
        out = np.ones(len(ii), np.float32)
        ts = np.geomspace(.04, tmax, steps)
        for t in ts:
            Q = P + t * LW
            rho = np.hypot(Q[:, 0], Q[:, 2])
            e, sq = G.meridian(rho, Q[:, 1])
            thq = np.arctan2(Q[:, 0], Q[:, 2])
            Hq = G.tex_sample(Hs, thq, np.clip(sq, 0, G.S_TOP))
            cl = e - Hq
            soft = np.where(Hq > .02, np.clip(.5 + 6 * cl / (t + .15), 0, 1), 1)
            out = np.minimum(out, soft)
        out = out * out * (3 - 2 * out)
        sh[jj, ii] = out
        self.sh = cv2.GaussianBlur(sh, (0, 0), .7)
        return self.sh


# ---------------------------------------------------------------- rays
def shop_rays(spx, x0, y0, w, h):
    """orthographic rays of the shop's view (a circle r is drawn r x 0.16 r): origins and directions in the world (cm)"""
    xs = x0 + (np.arange(w) + .5) / spx; ys = y0 + (np.arange(h) + .5) / spx
    X, Yp = np.meshgrid(xs, ys)
    X = (X - VX) / UPC; Y0 = (FL - Yp) / UPC
    O = np.stack([X, Y0, np.zeros_like(X)], -1).reshape(-1, 3)
    D = np.tile(np.array([0, -RY, -1.0]), (len(O), 1))         # Y = Y0 + lambda RY, Z = lambda (marching toward -Z)
    return O, D


def photo_rays(scale, w, h):
    """the photograph's camera: a pinhole, verticals kept vertical (a shifted lens), pixels of the reference times scale"""
    c = PH
    f = c['K'] * c['ZE']
    cyc = c['CY0'] - c['K'] * c['YE']
    xs = (np.arange(w) + .5) / scale; ys = (np.arange(h) + .5) / scale
    X, Yp = np.meshgrid(xs, ys)
    D = np.stack([(X - c['CX']) / f, -(Yp - cyc) / f, -np.ones_like(X)], -1).reshape(-1, 3)
    D /= np.linalg.norm(D, axis=1, keepdims=True)
    O = np.tile(np.array([0, c['YE'], c['ZE']]), (len(D), 1))
    return O, D


def project_shop(P):
    """world points (cm) to the shop's user space"""
    return np.c_[VX + P[:, 0] * UPC, FL - P[:, 1] * UPC + P[:, 2] * RY * UPC]


def project_photo(P, scale):
    c = PH
    f = c['K'] * c['ZE']; cyc = c['CY0'] - c['K'] * c['YE']
    dz = c['ZE'] - P[:, 2]
    return np.c_[(c['CX'] + f * P[:, 0] / dz) * scale, (cyc - f * (P[:, 1] - c['YE']) / dz) * scale]


def surf_point(th, s, e):
    s = np.clip(s, 0, G.S_TOP)
    h = G.h_of_s(s); r = G.r_of_s(s); nr = G.at_s(G.NR, s); nu = G.at_s(G.NU, s)
    return np.c_[(r + e * nr) * np.sin(th), h + e * nu, (r + e * nr) * np.cos(th)]


def march(F, O, D, relief=True, iters=420):
    """first hit of each ray on the jar and its relief: lambda (nan: a miss), theta, s, e"""
    n = len(O)
    Rb = G.RMAX + 1.7
    # entry into the bounding cylinder
    a = D[:, 0] ** 2 + D[:, 2] ** 2; b = 2 * (O[:, 0] * D[:, 0] + O[:, 2] * D[:, 2]); cc = O[:, 0] ** 2 + O[:, 2] ** 2 - Rb * Rb
    disc = b * b - 4 * a * cc
    ok = disc > 0
    sq = np.sqrt(np.maximum(disc, 0))
    lam = np.where(ok, (-b - sq) / (2 * a), np.nan); lam1 = np.where(ok, (-b + sq) / (2 * a), np.nan)
    hit = np.zeros(n, bool); done = ~ok
    prev = lam.copy()
    act = np.nonzero(~done)[0]
    for it in range(iters):
        if not len(act):
            break
        Q = O[act] + lam[act, None] * D[act]
        rho = np.hypot(Q[:, 0], Q[:, 2])
        e, s = G.meridian(rho, Q[:, 1])
        th = np.arctan2(Q[:, 0], Q[:, 2])
        if relief:
            inrng = (np.abs(th) < G.TH0) & (s > 0) & (s < G.S_TOP)
            sc = np.clip(s, 0, G.S_TOP)
            Hl = np.where(inrng, G.tex_sample(F.Hf, th, sc), 0)
            Hm = np.where(inrng, G.tex_sample(F.Hmax, th, sc), 0)
        else:
            Hl = Hm = 0
        f = e - Hl
        h_ = f <= 0
        hit[act[h_]] = True
        stp = np.clip(e - Hm, .022, 1.5) if relief else np.clip(e, .01, 1.5)
        out = (lam[act] > lam1[act]) | (Q[:, 1] < G.MD_Y0 + .1)
        fin = h_ | out
        prev[act[~fin]] = lam[act[~fin]]
        lam[act[~fin]] += stp[~fin]
        done[act[fin]] = True
        act = act[~fin]
    # refine between the last point outside and the hit
    hi = np.nonzero(hit)[0]
    lo_l, hi_l = prev[hi].copy(), lam[hi].copy()
    for _ in range(9):
        mid = (lo_l + hi_l) / 2
        Q = O[hi] + mid[:, None] * D[hi]
        rho = np.hypot(Q[:, 0], Q[:, 2])
        e, s = G.meridian(rho, Q[:, 1])
        th = np.arctan2(Q[:, 0], Q[:, 2])
        if relief:
            inrng = (np.abs(th) < G.TH0) & (s > 0) & (s < G.S_TOP)
            Hl = np.where(inrng, G.tex_sample(F.Hf, th, np.clip(s, 0, G.S_TOP)), 0)
        else:
            Hl = 0
        inside = e - Hl <= 0
        hi_l = np.where(inside, mid, hi_l); lo_l = np.where(inside, lo_l, mid)
    lam_h = np.full(n, np.nan); lam_h[hi] = hi_l
    Q = O[hi] + hi_l[:, None] * D[hi]
    rho = np.hypot(Q[:, 0], Q[:, 2])
    e, s = G.meridian(rho, Q[:, 1])
    th = np.arctan2(Q[:, 0], Q[:, 2])
    TH = np.full(n, np.nan); SS = np.full(n, np.nan); EE = np.full(n, np.nan)
    TH[hi], SS[hi], EE[hi] = th, s, e
    return lam_h, TH, SS, EE


# ---------------------------------------------------------------- the studio and the materials
def normals(F, th, s, relief=True):
    sc = np.clip(s, 0, G.S_TOP)
    nr = G.at_s(G.NR, sc); nu = G.at_s(G.NU, sc); r = G.r_of_s(sc)
    n0 = np.c_[np.sin(th) * nr, nu, np.cos(th) * nr]
    if not relief:
        return n0
    inr = np.abs(th) < G.TH0
    gth = np.where(inr, G.tex_sample(F.gth, th, sc), 0); gs = np.where(inr, G.tex_sample(F.gs, th, sc), 0)
    e = np.where(inr, G.tex_sample(F.Hn, th, sc), 0)
    gx = gth / (r + e)
    tth = np.c_[np.cos(th), np.zeros_like(th), -np.sin(th)]
    tss = np.c_[-np.sin(th) * nu, nr, -np.cos(th) * nu]
    n = n0 - gx[:, None] * tth - gs[:, None] * tss
    return n / np.linalg.norm(n, axis=1, keepdims=True)


def studio(R, box_w=.10, box_k=2.2, ceil_k=.5, box_dir=None, walls=.14):
    """the studio mirrored (screen frame, y down): a big softbox where the shop light is, a pale ceiling, walls, a dark floor,
    a little back light"""
    rx, ry, rz = R[:, 0], R[:, 1], R[:, 2]
    bd = L3 if box_dir is None else box_dir
    box = box_k * np.exp(-((rx - bd[0]) ** 2 + (ry - bd[1]) ** 2 + (rz - bd[2]) ** 2) / box_w)
    ceil = ceil_k * G.sm((-ry + .05) / .65)
    floor = 1 - .8 * G.sm((ry - .05) / .45)
    back = .55 * G.sm((-rz - .15) / .6) * (1 - .6 * G.sm(ry / .5))
    strip = .9 * np.exp(-((rx + .66) / .13) ** 2) * np.clip(1 - np.abs(ry + .1) / 1.1, 0, 1) * (rz > -.3)
    return box + (ceil + walls) * floor + back + strip


# the patina mirrors the studio's big softbox on the upper left of the belly (the key light's own glint stays on the shoulder)
BOXP = np.array([-.79, -.30, .53]); BOXP /= np.linalg.norm(BOXP)
PATINA = [(0, (110, 74, 50)), (.5, (92, 60, 38)), (1.2, (146, 98, 62)), (4, (172, 116, 66)), (8, (198, 130, 64)), (12, (204, 132, 60)),
          (15.5, (172, 100, 44)), (18.5, (116, 62, 27)), (21, (78, 40, 18)), (23, (62, 32, 15)), (24.5, (68, 36, 17)), (26, (84, 45, 22))]
ALLOY = dict(pale=(.97, .84, .56), gold=(.90, .69, .38), dark=(.80, .62, .40), black=(.34, .30, .27))


def patina_albedo(h):
    hs = np.array([p[0] for p in PATINA]); cs = np.array([p[1] for p in PATINA], float)
    return np.stack([np.interp(h, hs, cs[:, k]) for k in range(3)], -1)


def knee(c, kn=222):
    return np.where(c > kn, kn + (255 - kn) * (1 - np.exp(-(c - kn) / (255 - kn))), c)


def shade_patina(n_w, h, sh, ao, noise=None):
    """glossy patinated bronze, a lacquer-smooth chocolate to caramel brown"""
    ns = np.c_[n_w[:, 0], -n_w[:, 1], n_w[:, 2]]
    nz = np.clip(ns[:, 2], 0, 1)
    nl = ns @ L3
    wrap = np.clip((nl + .25) / 1.25, 0, 1)
    alb = patina_albedo(h)
    if noise is not None:
        alb = alb * (1 + noise[:, None])
    I = (.40 + .12 * np.clip(-ns[:, 1], 0, 1)) * (.6 + .4 * ao) + .72 * wrap * sh * (.8 + .2 * ao)
    c = alb * I[:, None]
    R = np.c_[2 * nz * ns[:, 0], 2 * nz * ns[:, 1], 2 * nz * nz - 1]
    Fr = .06 + .94 * (1 - nz) ** 5
    env = studio(R, .16, 4.5, ceil_k=.12, box_dir=BOXP)
    env = env * (.35 + .65 * sh * (env > 1) + .65 * (env <= 1)) * (.5 + .5 * ao)
    rl = np.clip(R @ L3, 0, 1)
    hot = (1.2 * rl ** 140 + .22 * rl ** 18) * sh
    spec = 255 * (Fr * env + .5 * hot)
    c = c + spec[:, None] * np.array([1., .9, .74])
    return np.clip(knee(c), 0, 255)


def shade_metal(n_w, tint, sh, ao, wr, fin=False):
    """cast golden alloy: reflections tinted by the metal, a little diffuse from the patina left in it, hollows browned, high
    points rubbed bright"""
    ns = np.c_[n_w[:, 0], -n_w[:, 1], n_w[:, 2]]
    nz = np.clip(ns[:, 2], 0, 1)
    nl = ns @ L3
    wrap = np.clip((nl + .2) / 1.2, 0, 1)
    R = np.c_[2 * nz * ns[:, 0], 2 * nz * ns[:, 1], 2 * nz * nz - 1]
    T = tint
    Fm = T + (1 - T) * ((1 - nz) ** 5)[:, None]
    env = studio(R, .22 + .1 * (1 - wr), 1.15 + .45 * wr, walls=.3)
    keyocc = np.where(R @ L3 > .3, sh, 1) * (.4 + .6 * sh)
    env = env * keyocc * (.45 + .55 * ao)
    dif = (.26 + .62 * wrap * sh) * (.5 + .5 * ao)
    k_d = .42 if not fin else .5
    c = 255 * (Fm * env[:, None] * np.array([1., .94, .8]) * (.62 if not fin else .5) + T * (k_d * dif)[:, None])
    rl = np.clip(R @ L3, 0, 1)
    c = c + (255 * (.55 + .5 * wr) * rl ** 40 * sh)[:, None] * (.55 + .45 * T)
    # patina left in the hollows: a dark warm brown
    brown = np.array([62., 40., 22.])
    k = np.clip((1 - ao) * 1.4, 0, .85)[:, None]
    c = c * (1 - k) + brown * k * (.6 + .4 * dif[:, None])
    return np.clip(knee(c, 228), 0, 255)


# ---------------------------------------------------------------- the light measured on the reference (work/fit_light.py)
# The patina and each carp's metal are lit by the studio of the photograph: their colour as a smooth function of the surface's
# orientation (and, for the patina, of its height: chocolate above, caramel below) fitted by least squares on the reference.
import json as _json
import os as _os
_MP = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'light_fit.json')
MEAS = _json.load(open(_MP)) if _os.path.exists(_MP) else None


def mono(n):
    """monomials of the screen-frame normal up to degree 3"""
    x, y, z = n[:, 0], -n[:, 1], n[:, 2]
    cols = [np.ones_like(x), x, y, z, x * x, y * y, z * z, x * y, y * z, x * z,
            x ** 3, y ** 3, z ** 3, x * x * y, x * x * z, y * y * x, y * y * z, z * z * x, z * z * y, x * y * z]
    return np.stack(cols, 1)


def ground_feats(n, h):
    m = mono(n)
    hh = (np.asarray(h) - 13.0) / 13.0
    # the grazing reflection of the bright backdrop at the silhouette (Fresnel), above and below
    fz = np.clip(1 - np.abs(n[:, 2]), 0, 1)
    fr = np.stack([fz ** 4, fz ** 8, fz ** 16, fz ** 4 * hh, fz ** 8 * hh, fz ** 8 * -n[:, 1], fz ** 8 * n[:, 0]], 1)
    return np.hstack([m, m * hh[:, None], m * (hh * hh)[:, None], m * (hh ** 3)[:, None], fr])


def metal_feats(n, ao):
    m = mono(n)
    return np.hstack([m, m * ao[:, None]])


def meas_ground(n, h):
    W = np.array(MEAS['ground'])
    return np.clip(ground_feats(n, h) @ W, 0, 255)


def meas_metal(n, ao, ci, layer, ft, black):
    out = np.zeros((len(n), 3))
    Fm = metal_feats(n, ao)
    for key, W in MEAS['metal'].items():
        k, part = key.split(':')
        k = int(k)
        sel = (ci == k)
        if part == 'body':
            sel &= (layer == 0)
            if black[k]:
                sel &= ft >= .2
        elif part == 'head':
            sel &= (layer == 0) & (ft < .2)
        else:
            sel &= layer > 0
        if sel.any():
            out[sel] = Fm[sel] @ np.array(W)
    return np.clip(out, 0, 255)
