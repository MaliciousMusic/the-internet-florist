# Renderer of the model: every surface is sampled densely and splatted into per-surface depth buffers (nearest fragment
# facing the eye, nearest facing away), each fragment is shaded as tinted glass (absorption by the path length through it,
# frost, Fresnel-weighted reflections of the shop's studio, refraction at the edges), then the layers are composited front to back.
import math
import numpy as np, cv2
import model as M

F = lambda k, d: float(M.OPT.get(k, d))
L3 = np.array([-.5, -.62, .6]); L3 /= np.linalg.norm(L3)
HV = L3 + np.array([0, 0, 1.]); HV /= np.linalg.norm(HV)


class Cam:
    """orthographic camera; world (X right, Y away, Z up, cm) -> output units (x right, y down) and pixels of the work field"""
    def __init__(self, proj):
        self.proj = proj
        if proj == 'shop':
            self.upc, self.ry, self.ox, self.oy = 9.75, .16, 500.0, 990.0
            self.vb = (500 - 13 * 9.75, 990 - 50.5 * 9.75, 26 * 9.75, 52.5 * 9.75)
            self.k = F('k', 2.0)                       # work pixels per output unit
        else:                                           # the reference's frame (its own pixels), the camera nearly level
            self.upc, self.ry, self.ox, self.oy = F('ppc', 10.75), F('pry', .05), F('pox', 258.0), F('poy', 800.0)
            self.vb = (0.0, 0.0, 474.0, 845.0)
            self.k = F('k', 2.0)
        self.e = math.asin(self.ry)
        self.W = int(round(self.vb[2] * self.k)); self.H = int(round(self.vb[3] * self.k))

    def out(self, X, Y, Z):
        return self.ox + X * self.upc, self.oy - (Z + Y * self.ry) * self.upc

    def px(self, X, Y, Z):
        x, y = self.out(X, Y, Z)
        return (x - self.vb[0]) * self.k, (y - self.vb[1]) * self.k

    def depth(self, X, Y, Z):
        return Y * math.cos(self.e) - Z * math.sin(self.e)

    def nscreen(self, n):
        ce, se = math.cos(self.e), math.sin(self.e)
        return np.stack([n[..., 0], -(n[..., 1] * se + n[..., 2] * ce), -(n[..., 1] * ce - n[..., 2] * se)], -1)

    def mapf(self, x, y):
        """work pixels -> output units"""
        return x / self.k + self.vb[0], y / self.k + self.vb[1]


def grid_normals(P, closed):
    du = np.gradient(P, axis=1); dv = np.gradient(P, axis=0)
    n = np.cross(du, dv)
    n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-12
    n[~np.isfinite(n)] = 0
    return n


def splat(cam, srf):
    """nearest fragment per pixel, separately for the parts facing the eye and facing away: dict of buffers"""
    P = srf['P']
    n = grid_normals(P, srf['closed'])
    # outward = away from the spine
    cx, cy = M.spine(P[..., 2])
    rad = np.stack([P[..., 0] - cx, P[..., 1] - cy, 0 * cx], -1)
    if 'C' in srf:
        rad = P - srf['C']
    sgn = np.sign((n * rad).sum(-1, keepdims=True)); sgn[sgn == 0] = 1
    n = n * sgn
    if 'rib' in srf:
        # flutes along the ribbon: tilt the normal across it
        du = np.gradient(P, axis=1); du /= np.linalg.norm(du, axis=-1, keepdims=True) + 1e-12
        n = n + F('ribk', .35) * np.cos(2 * np.pi * srf['u'] * F('ribs', 8.0))[..., None] * du * (1 - np.exp(-((1 - srf['u']) / .1) ** 2))[..., None]
        n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-12
    ns = cam.nscreen(n)
    x, y = cam.px(P[..., 0], P[..., 1], P[..., 2])
    d = cam.depth(P[..., 0], P[..., 1], P[..., 2])
    ix = np.round(x).astype(np.int64).ravel(); iy = np.round(y).astype(np.int64).ravel()
    ok = (ix >= 0) & (ix < cam.W) & (iy >= 0) & (iy < cam.H)
    if 'valid' in srf:
        ok &= np.broadcast_to(srf['valid'], P.shape[:2]).ravel()
    face = (ns[..., 2] > 0).ravel()
    attrs = dict(n=ns.reshape(-1, 3), t=srf['t'].ravel(), frost=srf['frost'].ravel(), mix=srf['mix'].ravel(), z=srf['z'].ravel(),
                 X=P[..., 0].ravel(), Y=P[..., 1].ravel())
    if 's' in srf:
        attrs['s'] = srf['s'].ravel(); attrs['u'] = srf['u'].ravel()
    out = {}
    for fc in ((True,) if srf.get('solid') else (True, False)):
        sel = np.nonzero(ok & (face == fc))[0]
        if sel.size == 0:
            continue
        key = iy[sel] * cam.W + ix[sel]
        dd = d.ravel()[sel]
        o = np.lexsort((dd, key))
        ks = key[o]
        first = np.r_[True, ks[1:] != ks[:-1]]
        pick = sel[o[first]]; kp = ks[first]
        buf = dict(depth=np.full(cam.H * cam.W, np.inf, np.float32))
        buf['depth'][kp] = d.ravel()[pick]
        for a, v in attrs.items():
            shp = (cam.H * cam.W,) + v.shape[1:]
            b = np.zeros(shp, np.float32); b[kp] = v[pick]
            buf[a] = b.reshape((cam.H, cam.W) + v.shape[1:])
        buf['depth'] = buf['depth'].reshape(cam.H, cam.W)
        # close pinholes left by the sampling (a fragment missing among found neighbours)
        m = np.isfinite(buf['depth'])
        hole = (~m) & (cv2.blur(m.astype(np.float32), (3, 3)) > .6)
        if hole.any():
            for a in list(buf):
                v = buf[a]
                if a == 'depth':
                    vv = np.where(m, v, 0)
                    num = cv2.blur(vv.astype(np.float32), (3, 3)); den = cv2.blur(m.astype(np.float32), (3, 3))
                    v[hole] = (num / np.maximum(den, 1e-6))[hole]
                else:
                    vv = v if v.ndim == 2 else v
                    if v.ndim == 2:
                        num = cv2.blur(np.where(m, v, 0).astype(np.float32), (3, 3)); den = cv2.blur(m.astype(np.float32), (3, 3))
                        v[hole] = (num / np.maximum(den, 1e-6))[hole]
                    else:
                        for c in range(v.shape[2]):
                            num = cv2.blur(np.where(m, v[..., c], 0).astype(np.float32), (3, 3)); den = cv2.blur(m.astype(np.float32), (3, 3))
                            v[..., c][hole] = (num / np.maximum(den, 1e-6))[hole]
        buf['mask'] = np.isfinite(buf['depth'])
        buf['kind'] = srf['kind']; buf['face'] = fc
        out[fc] = buf
    return out


# ---------------------------------------------------------------- glass
SIG_TEAL = np.array([.64, .24, .2])
SIG_FOOT = np.array([3.4, 2.3, 1.5])


def env(r, polish):
    """the studio mirrored: a large softbox up on the left (the shop light), a tall window strip on the left, a pale ceiling,
    a dark floor and a faint back light. Only polished glass mirrors the lights sharply; frosted glass keeps a faint sheen."""
    rx, ry, rz = r[..., 0], r[..., 1], r[..., 2]
    p2 = polish ** 2
    box = np.exp(-((rx - L3[0]) ** 2 + (ry - L3[1]) ** 2 + (rz - L3[2]) ** 2) / F('boxw', .015)) * p2
    strip = np.exp(-((rx + .72) / F('stripw', .12)) ** 2) * np.clip(1 - np.abs(ry + .15) / 1.0, 0, 1) * (rz > -.2) * p2
    ceil = np.clip(-ry, 0, 1) ** 2 * (.12 + .3 * polish)
    back = np.clip(-rz, 0, 1) * np.clip(.4 - ry, 0, 1) * .3 * polish
    return F('kbox', 9) * box + F('kstrip', 4.5) * strip + ceil + F('kback', .5) * back


def shade(buf, cam):
    """emission E (light the layer sends to the eye) and transmittance T (what it lets through), rgb 0..1"""
    n = buf['n'].astype(np.float64)
    c = n[..., 2]
    flip = np.where(c < 0, -1.0, 1.0)[..., None]
    nf = n * flip                                   # the side seen
    c = np.abs(c)
    t = buf['t'].astype(np.float64)
    kind = buf['kind']
    if kind == 'body':
        # the glass met across a thin shell, longer at grazing; the solid bottom: the chord through it
        ell = t / np.sqrt(c ** 2 + F('kg', .17) ** 2)
        if buf['face']:
            cx, cy = M.spine(buf['z'])
            r = M.r_body(buf['z'])
            dx = buf['X'] - cx
            chord = 2 * np.sqrt(np.clip(r ** 2 - dx ** 2, 0, None))
            solid = M.smooth((M.Z_FLOOR + 1.5 - buf['z']) / 4.5)
            ell = ell * (1 - solid) + np.maximum(ell, chord * F('chordk', .5)) * solid
        else:
            ell = np.where(buf['z'] < M.Z_FLOOR, 0, ell)
    elif kind.startswith('rod'):
        # a solid rod: the chord through it, lengthened toward its rims where the refraction sends the eye along it
        ell = 2 * t * (F('roda', .9) * c + F('rodb', 1.6) * (1 - c) ** 2)
    else:
        ell = t / np.sqrt(c ** 2 + F('kgv', .2) ** 2)
    mix = buf['mix'][..., None]
    sig = SIG_TEAL * F('sig', 1.0) * mix + SIG_FOOT * F('sigf', 1.0) * (1 - mix)
    A = np.exp(-sig * ell[..., None])
    frost = buf['frost'].astype(np.float64)
    polish = 1 - frost
    # reflections
    F0 = .04
    Fr = F0 + (1 - F0) * (1 - c) ** 5
    Fr = Fr * (1.7 if kind.startswith('voile') else 1.35)
    r = 2 * c[..., None] * nf - np.array([0, 0, 1.])
    R = Fr * env(r, polish)
    nh = np.clip((nf * HV).sum(-1), 0, 1)
    hot = F('hot', .8) * nh ** F('hotp', 600) * polish ** 3
    # frost: light scattered in the ground surface, tinted by the glass it crossed, lit by the shop light (wrapped: the light
    # also comes through a thin sheet)
    dl = (nf * L3).sum(-1)
    # frosted glass glows with the light it scatters from every side; clear glass only shows the shop light's modelling
    wrapl = np.clip((dl + .55) / 1.55, 0, 1)
    lit = (F('amb', .35) + F('dif', .95) * wrapl) * polish + (F('famb', .72) + F('fdif', .4) * wrapl) * frost
    milk = np.array([float(v) for v in M.OPT.get('milk', '.95,.99,.97').split(',')])
    scat = frost[..., None] * (F('veil0', .35) + (1 - F('veil0', .35)) * wrapl)[..., None] * milk * np.exp(-sig * np.maximum(np.minimum(ell, 2.0), F('scpath', .5))[..., None] * F('scatd', .4)) * lit[..., None] * F('scatk', 1.0)
    # the thread of light at the very edge of a sheet (light carried inside the glass to its rim)
    thread = F('thread', .9) * np.exp(-(c / .06) ** 2) * (.5 + .5 * np.clip(-nf[..., 0] * .6 - nf[..., 1] * .8 + .3, 0, 1))
    E = scat + (R + hot + thread)[..., None] * np.array([1., 1., 1.])
    # the blue-black of the foot glows faintly navy where it is lit
    E = E + (1 - mix) * np.array([.012, .03, .075]) * lit[..., None]
    T = (1 - np.clip(Fr, 0, .9))[..., None] * A * (1 - frost[..., None] * F('frostT', .35))
    if kind == 'body' and not buf['face']:
        # the far wall seen from inside: dimmer reflections (seen through the near wall), and no interface inside the solid
        # bottom, the cavity's floor fading in as a shallow bowl
        wgt = M.smooth((buf['z'] - M.Z_FLOOR) / F('floorw', 2.5))[..., None]
        E = E * wgt * np.where(c[..., None] > -2, F('innerE', .6), 1)
        T = 1 - wgt * (1 - T)
    return E, T


def render(cam, dl=None):
    dl = dl or .55 / (cam.upc * cam.k)
    bufs = []
    for srf in M.surfaces(dl):
        o = splat(cam, srf)
        for fc in o:
            if o[fc]['mask'].any():
                bufs.append(o[fc])
    return bufs


def composite(bufs, cam, bg):
    """front-to-back over a uniform background: colour, total transmittance, frontmost layer, signature of the layers"""
    K = len(bufs)
    D = np.stack([np.where(b['mask'], b['depth'], np.inf) for b in bufs])
    Es, Ts = [], []
    for b in bufs:
        E, T = shade(b, cam)
        Es.append((E * b['mask'][..., None]).astype(np.float32)); Ts.append(np.where(b['mask'][..., None], T, 1.0).astype(np.float32))
        del E, T
    Es = np.stack(Es); Ts = np.stack(Ts)
    order = np.argsort(D, axis=0)
    Fr_ = np.stack([np.where(b['mask'], b['frost'], 0) for b in bufs])
    # what lies behind the first layer, composited back to front ...
    Cb = np.zeros((cam.H, cam.W, 3)); Tb = np.ones((cam.H, cam.W, 3))
    for i in range(1, K):
        idx = order[i]
        E = np.take_along_axis(Es, idx[None, ..., None], 0)[0]
        T = np.take_along_axis(Ts, idx[None, ..., None], 0)[0]
        Cb += Tb * E
        Tb *= T
    Cb += Tb * np.asarray(bg)
    # ... is seen softened through a frosted first layer (the ground surface scatters what passes)
    idx0 = order[0]
    E0 = np.take_along_axis(Es, idx0[None, ..., None], 0)[0]
    T0 = np.take_along_axis(Ts, idx0[None, ..., None], 0)[0]
    f0 = np.take_along_axis(Fr_, idx0[None], 0)[0]
    sgm = F('fblur', 2.2) * cam.k * cam.upc / 10.75
    Cbb = cv2.GaussianBlur(Cb.astype(np.float32), (0, 0), sgm)
    w = np.clip(f0 * F('fblurk', 2.2), 0, 1)[..., None]
    C = E0 + T0 * (Cb * (1 - w) + Cbb * w)
    Tacc = T0 * Tb
    any_ = np.isfinite(D).any(0)
    front = np.where(any_, order[0], -1)
    sig = np.zeros((cam.H, cam.W), np.int64)
    for i, b in enumerate(bufs):
        sig |= b['mask'].astype(np.int64) << i
    return C, Tacc, front, sig, any_
