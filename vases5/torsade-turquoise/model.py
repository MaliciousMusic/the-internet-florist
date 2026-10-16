# The turquoise twisted glass vase (our own design after ref. 087): an analytic model in cm, Z up, X right, Y away from the eye.
#   - body: one blown wall round a tall S-shaped spine (leaning right low, left high, measured on the reference): a wide low
#     spinning-top belly on a dark conical bottom, a thin twisted neck, a narrow mouth up on the left with a rolled lip.
#     The voiles are folds of that same wall: three pleats with a long gentle rise and a steep fall, turning in a helix
#     (flat on the belly, steep up the neck), with soft parallel ribs; the glass gathers thick in the steep fall of each
#     pleat (clear, deep blue-green) and stays thin on its long face (frosted, milky), thinner and paler as it rises;
#   - no separate pieces: above the mouth each pleat runs on into a tongue of the same wall that rises and turns outward
#     (the one at the back far above the mouth), the rolled edge following the rim all round.
# Every surface is sampled as a parametric grid (positions, normals, thickness, frost, tint) and handed to the renderer.
import math
import numpy as np
from scipy.interpolate import PchipInterpolator

OPT = {}
F = lambda k, d: float(OPT.get(k, d))


def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


# ---------------------------------------------------------------- measured proportions (reference: 10.75 px per cm, foot at x 255)
H_MOUTH = 42.0          # rim of the mouth (cm)
Z_FLOOR = 3.2           # top of the solid glass bottom
H_TOP = 46.5            # tip of the back voile
_SZ = np.array([0, 2, 4, 6, 8, 10, 12, 14, 16, 18.5, 21, 23.5, 26, 28.5, 31, 33.5, 36, 38.5, 42, 46.5])
_SC = np.array([0, .05, 0, 0, .2, .7, 1.8, 2.4, 1.6, -.3, -1.8, -3.5, -5.2, -6.2, -6.5, -6.0, -5.0, -4.2, -3.2, -2.6])
# outer envelope (half width measured across the lean, brought back square to the spine)
# outer envelope (half width measured across the lean, brought back square to the spine): a smooth spinning top
_EZ = np.array([0, .3, 1.0, 2.0, 4.0, 6.0, 7.5, 9.0, 11.0, 13.0, 15.0, 17.0, 19.5, 22, 25, 28, 31, 34, 37, 40, 42])
_ER = np.array([2.7, 3.0, 3.5, 4.4, 6.3, 7.9, 8.4, 8.1, 7.0, 5.6, 4.7, 4.2, 3.9, 3.65, 3.5, 3.35, 3.3, 3.35, 3.4, 3.35, 3.3])
_spx = PchipInterpolator(_SZ, _SC)
_dspx = _spx.derivative()
_env = PchipInterpolator(_EZ, _ER)


def spine(z):
    z = np.asarray(z, float)
    return _spx(np.clip(z, 0, H_TOP)) * F('lean', 1.0), 0 * z + F('sy', 0)


def slope(z):
    """dx/dz of the spine"""
    return _dspx(np.clip(np.asarray(z, float), 0, H_TOP)) * F('lean', 1.0)


def env(z):
    z = np.asarray(z, float)
    return np.where(z > H_MOUTH, _ER[-1], _env(np.clip(z, 0, H_MOUTH)))


def twist(z):
    """rotation of the pleats at height z (radians): they lie almost flat on the belly and climb steeply up the neck"""
    q = np.clip(np.asarray(z, float) / H_TOP, 0, 1.2)
    return -2 * np.pi * F('turns', 1.6) * q ** F('tp', .9)


NP = 4                  # pleats


def fall_w(z):
    """width of the steep side of a pleat: broad and gentle on the belly (smooth spiral ribs, no step), steep up the neck"""
    return np.interp(np.asarray(z, float), [0, 8, 14, 20, 47], [.45, .42, .24, .18, .18]) * F('fallk', 1.0)


def pleat(psi, d):
    """profile of a pleat over one period (psi in 0..1): a long gentle rise and a fall of width d; (height 0..1, fall 0..1)"""
    psi = np.mod(psi, 1.0)
    x = np.clip(psi / (1 - d), 0, 1) ** F('rp', 1.35)
    rise = (1 - np.cos(np.pi * x)) / 2
    fall_x = np.clip((psi - (1 - d)) / d, 0, 1)
    h = np.where(psi < 1 - d, rise, 1 - smooth(fall_x))
    # the steep fall, and the crest just before it, where the glass gathers clear and polished
    c0 = 1 - d * .75
    w = d * .8
    fl = np.exp(-((psi - c0) / w) ** 2) + np.exp(-((psi + 1 - c0) / w) ** 2)
    return h, np.clip(fl, 0, 1) * smooth((.42 - d) / .2 + .3)


def amp(z):
    """depth of the pleats (cm): a low ridge on the belly, deep folds up the neck, shallower at the mouth"""
    z = np.asarray(z, float)
    return np.interp(z, [0, 3, 7, 11, 15, 22, 32, 38, 42, 47], [0, 0, 0, .05, .45, .75, .75, .6, .5, .45]) * F('ampk', 1.0)


def wall(z):
    """wall thickness (cm): heavy in the belly, thin up the neck"""
    z = np.asarray(z, float)
    return np.interp(z, [0, 5, 9, 14, 22, 32, 42, 47], [1.3, .8, .5, .32, .26, .22, .18, .15]) * F('wallk', 1.0)


def foot_mix(z):
    """0 in the blue-black glass gathered at the foot, 1 in the blue-green of the rest"""
    return smooth((np.asarray(z, float) - F('fm0', 1.0)) / F('fmw', 5.0))


def frost_z(z):
    """how frosted the long faces of the pleats are: little on the belly, milky up the neck, almost white at the top"""
    z = np.asarray(z, float)
    return np.interp(z, [0, 6, 11, 18, 28, 38, 47], [.1, .14, .18, .24, .3, .4, .5]) * F('frk', 1.0)


def psi_of(th, z):
    return NP * (th - twist(z)) / (2 * np.pi)


# ---------------------------------------------------------------- the free top edges of the wall
# Above the mouth the wall does not stop on a level rim: each pleat runs on into a tongue of glass whose crest rises and turns
# outward, the one at the back far above the mouth. The rolled edge follows that rim all round.
TIPS = [2.0, 1.2, .8, .5]           # how far each pleat's tongue rises above the mouth (cm), from the one at the back round


def tips(th):
    psi = psi_of(th, H_MOUTH)
    back = math.floor(NP * (math.radians(F('backang', 95)) - float(twist(H_MOUTH))) / (2 * np.pi))
    j = np.mod(np.floor(psi) - back, NP).astype(int)
    hts = np.array(TIPS)[j] * F('tipk', 1.0)
    f = np.mod(psi, 1.0)
    return hts * np.exp(-((f - F('tipc', .6)) / F('tipw', .4)) ** 2) + .0


def z_top(th):
    return H_MOUTH + tips(th)


def body_radius(th, z):
    """radius of the wall at angle th, height z (square to the spine), its fall (steep, clear side of a pleat) 0..1, and the
    crests of its soft ribs 0..1"""
    psi = psi_of(th, z)
    d = fall_w(z)
    h, fl = pleat(psi, d)
    a = amp(z)
    rp = np.cos(2 * np.pi * psi * F('ribs', 5))
    ribs = F('ribk', .022) * rp * smooth(z / 4)
    R = env(z) - a + a * h + ribs * (1 - fl)
    # above the mouth the tongues turn outward
    R = R + F('flare', .9) * smooth((z - H_MOUTH + 1.5) / 5.0) ** 1.5 * (1 + .25 * np.clip(z - H_MOUTH, 0, None))
    crest = np.clip((rp - .75) / .25, 0, 1) * smooth((z - 9) / 6)
    return R, fl, crest


def body_grid(dl):
    nt = int(2 * np.pi * 9.5 / dl) + 1
    nv = int((H_MOUTH + max(TIPS)) / dl) + 1
    th = np.linspace(0, 2 * np.pi, nt)[None, :]
    v = np.linspace(0, 1, nv)[:, None]
    z = v * z_top(th)
    R, fl, crest = body_radius(th, z)
    cx, cy = spine(z)
    sec = np.sqrt(1 + slope(z) ** 2)          # horizontal section of a leaning tube: wider across the lean
    P = np.stack(np.broadcast_arrays(cx + R * np.cos(th) * sec, cy + R * np.sin(th), z + 0 * th), -1)
    Z = P[..., 2]
    t = wall(Z) * (1 + F('gather', 1.6) * fl)
    # the frost climbs the belly along the spiral, not on a level line
    zf = Z + F('fwob', 0.0) * (np.mod(psi_of(th, Z), 1.0) - .5) * (1 - smooth((Z - 16) / 6))
    frost = frost_z(zf) * (1 - F('clearfall', .9) * fl) * (1 - F('crestclear', 0) * crest) * (.15 + .85 * foot_mix(Z))
    return dict(P=P, t=t, frost=frost, mix=foot_mix(Z), z=Z, kind='body', closed=True, fall=fl)


def lip_grid(dl):
    """the rolled edge all round the rim, rising and falling with the tongues"""
    a = F('lipr', .15)
    nt = int(2 * np.pi * 6 / dl * 1.5) + 1; nv = max(16, int(2 * np.pi * a / dl * 2) + 8)
    th = np.linspace(0, 2 * np.pi, nt)
    zt = z_top(th)
    R, _, _ = body_radius(th, zt)
    cx, cy = spine(zt)
    sec = np.sqrt(1 + slope(zt) ** 2)
    C = np.stack([cx + (R - a * .3) * np.cos(th) * sec, cy + (R - a * .3) * np.sin(th), zt - a * .3], -1)
    T = np.gradient(C, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True) + 1e-12
    er = np.stack([np.cos(th), np.sin(th), 0 * th], -1)
    N = er - (er * T).sum(1, keepdims=True) * T; N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-12
    B = np.cross(T, N)
    al = np.linspace(0, 2 * np.pi, nv)[None, :, None]
    P = C[:, None, :] + a * (np.cos(al) * N[:, None, :] + np.sin(al) * B[:, None, :])
    one = np.ones(P.shape[:2])
    Cc = np.broadcast_to(C[:, None, :], P.shape).copy()
    return dict(P=P, t=one * a, frost=one * F('lipfrost', .15), mix=one, z=P[..., 2], kind='lip', closed=True, C=Cc, solid=True)


# ---------------------------------------------------------------- the voiles
# Two or three wide, thin sheets of glass wound round the ribbed tube: each leaves the belly low on the right and climbs in a
# helix toward the left round the neck. Along one edge it grows out of the wall (only the part standing out of the wall
# exists, so it peels off along a natural crease); its other edge is free: it lifts off, waves and turns over. Thin, lighter
# and more frosted than the body; they make the silhouette, standing out past the tube on both sides.
VOILES = [
    dict(z0=2.5, z1=45.5, th0=-15, turns=.95, w0=7.5, w1=4.2, lift=2.6, t0=.32, t1=.16, nw=2.5),   # the main one, ends high on the left
    dict(z0=3.5, z1=37.0, th0=115, turns=.8, w0=6.5, w1=3.8, lift=2.2, t0=.3, t1=.16, nw=2.0),
    dict(z0=11.0, z1=31.0, th0=235, turns=.6, w0=5.0, w1=3.2, lift=1.7, t0=.26, t1=.16, nw=1.5),
]
RREF = 4.6


def voile_grid(k, dl):
    V = VOILES[k]
    span = 2 * np.pi * V['turns'] * F('vturn', 1.0)
    L = math.hypot(span * RREF, V['z1'] - V['z0'])
    ns = int(L / dl * 1.1) + 1
    nu = int(max(V['w0'], 5) * 1.5 / dl) + 1
    s = np.linspace(0, 1, ns)[:, None]
    u = np.linspace(0, 1, nu)[None, :]
    za = V['z0'] + (V['z1'] - V['z0']) * s ** F('vzp', 1.1)
    # going round to the left across the front: the angle decreases (x = cos, y = sin, the front at -90 degrees)
    phi_a = math.radians(V['th0']) - span * (s + F('ease', .15) * np.sin(np.pi * s) * (1 - s))
    dz = np.gradient(za[:, 0])[:, None]; da = np.gradient(phi_a[:, 0])[:, None] * RREF
    n = np.hypot(dz, da); ta, tz = da / n, dz / n
    # width, tapered to a rounded tip at the top and grown from nothing at the foot
    W = (V['w0'] + (V['w1'] - V['w0']) * s) * np.sqrt(np.clip(1 - ((s - .8) / .2) ** 2, 0, 1) * (s > .8) + (s <= .8))         * np.sqrt(smooth(s / .12))
    # across the voile: upward (the voiles overlap like shingles)
    a = phi_a * RREF + u * W * tz
    z = za - u * W * ta
    phi = a / RREF
    zz = np.minimum(z, H_TOP + 2)
    Rb, _, _ = body_radius(phi, np.minimum(zz, H_MOUTH + 4))
    # the free edge lifts off, waves along its length and turns over
    zs = smooth((za - V['z0']) / 6.0)
    wave = 1 + F('wavek', .25) * np.sin(2 * np.pi * s * V['nw'] + k)
    shape = W / np.maximum(V['w0'] + (V['w1'] - V['w0']) * s, 1e-3)          # the lift dies out with the width at the ends
    lift = (F('g0', -.3) + (V['lift'] * F('liftk', .7) * wave * u ** 1.35
            + F('curl', .5) * np.clip((u - .78) / .22, 0, 1) ** 2.2) * (F('belly', .85) + (1 - F('belly', .85)) * zs) * shape)
    w = smooth(u * 2.5)
    R = (1 - w) * Rb + w * env(np.minimum(zz, H_MOUTH)) + lift
    cx, cy = spine(zz)
    sec = np.sqrt(1 + slope(zz) ** 2)
    P = np.stack([cx + R * np.cos(phi) * sec, cy + R * np.sin(phi), zz], -1)
    valid = R > Rb + .03
    zr = np.clip((zz - V['z0']) / (V['z1'] - V['z0']), 0, 1)
    # thin, a little thicker where it leaves the wall, with a rolled free edge (its thread of light)
    t = (V['t0'] + (V['t1'] - V['t0']) * zr) * (1 + .5 * (1 - u)) + F('bead', .22) * np.exp(-((1 - u) / .05) ** 2)
    frost = np.clip(frost_z(zz) + F('vfrost', .05), 0, 1) * (1 - .8 * np.exp(-((1 - u) / .06) ** 2))
    return dict(P=P, t=t, frost=frost, mix=np.ones_like(zz), z=zz, kind='voile%d' % k, closed=False, rib=1,
                s=s + 0 * u, u=u + 0 * s, valid=valid)


def surfaces(dl):
    return [body_grid(dl), lip_grid(dl * .6)] + [voile_grid(k, dl) for k in range(int(F('nvoiles', 3)))]


def r_body(z):
    """mean radius of the wall (for the cavity and the engine's numbers)"""
    return env(z) - amp(z) * .5
