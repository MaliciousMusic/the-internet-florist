# The globular bronze jar with golden carp (vases5/carpes-dorees): its turned body and the relief of its carp, as fields over
# the surface. Only numbers live here: the profile was measured on the reference through its camera (work/fitprof2.py), the carp
# are our own design (count, poses, placement), built from a carp's anatomy.
#   surface coordinates: theta (radians round the axis, 0 facing the viewer, positive to the right) and s (cm along the
#   meridian from the outer edge of the foot); a point of the relief adds its height e (cm) along the surface normal.
import math
import numpy as np
from scipy.interpolate import PchipInterpolator
from scipy.spatial import cKDTree
from scipy import ndimage as ndi
import cv2

# ---------------------------------------------------------------- the turned body (cm), measured: height 26 cm, belly 29.4 cm
H_CM = 26.0
PROF = [(0, 6.92), (.05, 7.08), (.42, 7.16), (.5, 7.16), (.56, 7.42), (.66, 7.66), (.85, 7.86), (1.2, 8.2), (1.6, 8.62), (3, 10.11), (5, 11.7), (7.5, 13.13),
        (10, 14.0), (12.5, 14.49), (15, 14.71), (17.5, 14.53), (19.5, 13.67), (21, 12.49), (22.2, 10.95), (22.9, 8.95), (23.3, 7.35),
        (23.6, 6.72), (24.2, 6.52), (24.85, 6.45), (25.0, 6.6), (25.2, 6.86), (25.45, 6.95), (25.7, 6.86), (25.88, 6.66), (26.0, 6.45)]
LIPW = .55                       # thickness of the rolled lip at its top (cm)
_hk, _rk = np.array(PROF).T
hh = np.linspace(0, H_CM, 5201)
rr = PchipInterpolator(_hk, _rk)(hh)
_dr = np.gradient(rr, hh)
_dr = ndi.gaussian_filter1d(_dr, 6)      # the slope of a turned surface bends gently: no bands where samples join
ss = np.r_[0, np.cumsum(np.hypot(np.diff(hh), np.diff(rr)))]
S_TOP = float(ss[-1])
NR = 1 / np.sqrt(1 + _dr ** 2)           # outward normal in the meridian plane: (NR radial, NU up)
NU = -_dr * NR
RMAX = float(rr.max())


def at_s(arr, s):
    return np.interp(s, ss, arr)


def h_of_s(s):
    return np.interp(s, ss, hh)


def r_of_s(s):
    return np.interp(s, ss, rr)


def s_of_h(h):
    return np.interp(h, hh, ss)


def r_of_h(h):
    return np.interp(h, hh, rr)


# ---------------------------------------------------------------- the meridian plane: signed distance to the body and its s
# (a closed solid: the outer wall, the lid over the mouth and the bottom), sampled on a grid for the rays
MD_STEP = .02
MD_R0, MD_R1, MD_Y0, MD_Y1 = 0.0, RMAX + 2.6, -.6, H_CM + 2.0


def _meridian():
    pts = [np.c_[rr, hh]]; s_ = [ss]; nrm = [np.c_[NR, NU]]
    rl = np.arange(rr[-1] - .002, -.001, -.004)                   # the lid (the mouth, closed for the rays)
    pts.append(np.c_[rl, np.full_like(rl, H_CM)]); s_.append(S_TOP + (rr[-1] - rl)); nrm.append(np.tile([0., 1.], (len(rl), 1)))
    rb = np.arange(rr[0] - .002, -.001, -.004)                    # the bottom
    pts.append(np.c_[rb, np.zeros_like(rb)]); s_.append(-(rr[0] - rb)); nrm.append(np.tile([0., -1.], (len(rb), 1)))
    P = np.vstack(pts); S = np.concatenate(s_); N = np.vstack(nrm)
    tree = cKDTree(P)
    R = np.arange(MD_R0, MD_R1, MD_STEP); Y = np.arange(MD_Y0, MD_Y1, MD_STEP)
    G = np.stack(np.meshgrid(R, Y), -1).reshape(-1, 2)
    _, idx = tree.query(G)
    d = G - P[idx]
    e = (d * N[idx]).sum(1)
    # the signed distance: along the normal of the nearest point, its length when it is clearly off the normal (corners)
    dist = np.hypot(d[:, 0], d[:, 1])
    e = np.where(np.abs(e) > .7 * dist, np.sign(e) * dist, e)
    return e.reshape(len(Y), len(R)).astype(np.float32), S[idx].reshape(len(Y), len(R)).astype(np.float32)


def _cached():
    import os
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work', 'meridian.npz')
    key = np.array([hash(tuple(PROF)) % 2 ** 31, MD_STEP * 1e4])
    if os.path.exists(f):
        z = np.load(f)
        if np.array_equal(z['key'], key):
            return z['e'], z['s']
    e, s = _meridian()
    os.makedirs(os.path.dirname(f), exist_ok=True)
    np.savez(f, e=e, s=s, key=key)
    return e, s


MD_E, MD_S = _cached()


def meridian(rho, Y):
    """signed elevation above the body and meridian coordinate s of points (rho, Y), bilinear on the grid"""
    c = np.array([(Y - MD_Y0) / MD_STEP, (rho - MD_R0) / MD_STEP])
    e = ndi.map_coordinates(MD_E, c, order=1, mode='nearest')
    s = ndi.map_coordinates(MD_S, c, order=1, mode='nearest')
    return e, s


# ---------------------------------------------------------------- texels of the surface
TX = .04                                   # cm per texel at the widest
TH0 = 1.78                                 # theta range (a little past the silhouettes, where the relief still shows)
DTH = TX / RMAX
NTH = int(2 * TH0 / DTH) + 1
NS = int(S_TOP / TX) + 2
TH = -TH0 + DTH * np.arange(NTH)
SV = TX * np.arange(NS)
R_ROW = r_of_s(SV)


def tex_coords(theta, s):
    return np.array([s / TX, (theta + TH0) / DTH])


def tex_sample(A, theta, s, order=1):
    return ndi.map_coordinates(A, tex_coords(theta, s), order=order, mode='constant', cval=0.0)


def sm(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def bump(x):
    x = np.clip(np.abs(x), 0, 1)
    return (1 - x * x) ** 2
