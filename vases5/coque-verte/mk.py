# The green shell vase (vases5/coque-verte): its model (model.py) is sampled as points with exact normals, splatted through
# the camera into a depth buffer, lit by the shop's single light (shadow map, sky occlusion from 64 directions, matt powdery
# ceramic with a velvet at grazing angles) and written as SVG curves: tone bands clipped to their part, softened by a small
# blur, crisp outlines, a fine sandy grain made by feTurbulence + feDiffuseLighting. No image is embedded.
#   python mk.py prev   -> out/prev_photo.png, out/prev_shop.png (computed colour fields, no browser)
#   python mk.py photo  -> out/vase_photo.svg (framing of the reference, for the comparison)
#   python mk.py shop   -> out/vase_shop.svg, out/body.json, out/fiche.json
import sys, os, math, json, time
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..'))
os.chdir(HERE)
import svgkit as K  # noqa: E402
import model as MD  # noqa: E402

MODE = sys.argv[1] if len(sys.argv) > 1 else 'prev'
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
t0 = time.time()
log = lambda *a: print('%6.1fs' % (time.time() - t0), *a, flush=True)

LW = np.array([-.5, .62, .6]); LW /= np.linalg.norm(LW)      # the shop light L3, in the world frame (y up)


# ---------------------------------------------------------------- cameras
class Cam:
    """orthographic camera seen from a little above: x = x0 + k X, y = y0 - k (Y cos e - Z sin e) (pixels of the field);
    out() maps field pixels to output units"""
    def __init__(self, name, k, x0, y0, sin_e, W, H, ox, oy, osc, oblique=False):
        self.name, self.k, self.x0, self.y0, self.W, self.H = name, k, x0, y0, W, H
        self.se = sin_e; self.ce = math.sqrt(1 - sin_e ** 2) if not oblique else 1.0
        self.V = np.array([0, sin_e, math.sqrt(1 - sin_e ** 2)])
        self.ox, self.oy, self.osc = ox, oy, osc

    def proj(self, P):
        x = self.x0 + self.k * P[:, 0]
        y = self.y0 - self.k * (P[:, 1] * self.ce - P[:, 2] * self.se)
        return x, y, P @ self.V

    def out(self, x, y):
        return self.ox + x / self.osc, self.oy + y / self.osc


def photo_cam():
    sc = F('psc', 1.5)                                     # field pixels per photo pixel
    k = F('pk', 20.6) * sc
    e = math.radians(F('pe', 11.5))
    return Cam('photo', k, F('px0', 296) * sc, F('py0', 806) * sc, math.sin(e), int(597 * sc), int(1024 * sc), 0, 0, sc)


def shop_cam():
    ss = F('ss', 2.4)                                      # field pixels per shop unit
    U = K.UPC
    vx0, vy0, vw, vh = [float(v) for v in K.shop_vb(32, 36, 0).split()]
    W, H = int(vw * ss), int(vh * ss)
    # shop: x = VX + X U, y = FL - Y U + (Z - ZC) RY U  (ZC: depth of the foot's centre, which stands on FL)
    cam = Cam('shop', U * ss, (K.VX - vx0) * ss, (K.FL - vy0) * ss, K.RY, W, H, vx0, vy0, ss, oblique=True)
    cam.y0 -= MD.AXZ * K.RY * U * ss
    cam.vb = (vx0, vy0, vw, vh)
    return cam


# ---------------------------------------------------------------- depth buffer
class Buf:
    def __init__(self, W, H):
        n = W * H
        self.W, self.H = W, H
        self.z = np.full(n, -1e9, np.float32)
        self.P = np.zeros((n, 3), np.float32)
        self.N = np.zeros((n, 3), np.float32)
        self.part = np.zeros(n, np.int8)
        self.side = np.zeros(n, np.int8)

    def splat(self, cam, P, N, part, side):
        x, y, d = cam.proj(P)
        xi = np.rint(x).astype(np.int64); yi = np.rint(y).astype(np.int64)
        ok = (xi >= 0) & (xi < self.W) & (yi >= 0) & (yi < self.H)
        if not ok.any():
            return
        xi, yi, d, P, N = xi[ok], yi[ok], d[ok], P[ok], N[ok]
        key = yi * self.W + xi
        o = np.lexsort((-d, key))
        k = key[o]
        first = np.r_[True, k[1:] != k[:-1]]
        sel = o[first]
        kk = key[sel]
        upd = d[sel] > self.z[kk]
        kk, sel = kk[upd], sel[upd]
        self.z[kk] = d[sel]; self.P[kk] = P[sel]; self.N[kk] = N[sel]
        self.part[kk] = part; self.side[kk] = side

    def fill_holes(self):
        """pixels missed by the sampling inside a surface take their best neighbour (max depth among the 8 around)"""
        Z = self.z.reshape(self.H, self.W)
        cov = Z > -1e8
        nb = cv2.blur(cov.astype(np.float32), (3, 3))
        holes = (~cov) & (nb >= 5 / 9)
        if not holes.any():
            return 0
        Zp = np.pad(Z, 1, constant_values=-1e9)
        best = np.full(Z.shape, -1e9, np.float32); arg = np.zeros(Z.shape, np.int64)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                zz = Zp[1 + dy:1 + dy + self.H, 1 + dx:1 + dx + self.W]
                b = zz > best
                best = np.where(b, zz, best)
                arg = np.where(b, (np.arange(self.H)[:, None] + dy) * self.W + (np.arange(self.W)[None, :] + dx), arg)
        idx = np.flatnonzero(holes.ravel())
        src = arg.ravel()[idx]
        for a in (self.z, self.P, self.N, self.part, self.side):
            a[idx] = a[src]
        return len(idx)


# ---------------------------------------------------------------- light: shadow map and sky occlusion
def basis(d):
    d = d / np.linalg.norm(d)
    a = np.array([0, 1., 0]) if abs(d[1]) < .9 else np.array([1., 0, 0])
    u = np.cross(a, d); u /= np.linalg.norm(u)
    v = np.cross(d, u)
    return u, v, d


class DirMap:
    """max coordinate along d of the scene, seen from direction d (an orthographic depth map)"""
    def __init__(self, d, res, lo, hi):
        self.u, self.v, self.d = basis(d)
        self.res = res
        self.lo = lo
        self.W = int((hi[0] - lo[0]) * res) + 3; self.H = int((hi[1] - lo[1]) * res) + 3
        self.m = np.full(self.W * self.H, -1e9, np.float32)

    def coords(self, P):
        return (P @ self.u - self.lo[0]) * self.res + 1, (P @ self.v - self.lo[1]) * self.res + 1, P @ self.d

    def add(self, P):
        x, y, dd = self.coords(P)
        xi = np.clip(np.rint(x).astype(np.int64), 0, self.W - 1); yi = np.clip(np.rint(y).astype(np.int64), 0, self.H - 1)
        key = yi * self.W + xi
        o = np.argsort(dd, kind='stable')
        self.m[key[o]] = dd[o]               # the last write (largest) wins
        # keep the max with what was already there
        return

    def add_max(self, P):
        x, y, dd = self.coords(P)
        xi = np.clip(np.rint(x).astype(np.int64), 0, self.W - 1); yi = np.clip(np.rint(y).astype(np.int64), 0, self.H - 1)
        key = yi * self.W + xi
        np.maximum.at(self.m, key, dd.astype(np.float32))

    def close(self, k=3):
        M = self.m.reshape(self.H, self.W)
        self.m = cv2.dilate(M, np.ones((k, k), np.uint8)).ravel()

    def sample(self, P):
        x, y, dd = self.coords(P)
        xi = np.rint(x).astype(np.int64); yi = np.rint(y).astype(np.int64)
        ok = (xi >= 0) & (xi < self.W) & (yi >= 0) & (yi < self.H)
        v = np.full(len(x), -1e9, np.float32)
        v[ok] = self.m[yi[ok] * self.W + xi[ok]]
        return v, dd


def scene_bounds_light(u, v):
    lo = np.array([1e9, 1e9]); hi = -lo
    for P, N, part, side in MD.points(1.2):
        a = np.c_[P @ u, P @ v]
        lo = np.minimum(lo, a.min(0)); hi = np.maximum(hi, a.max(0))
    return lo - 1, hi + 1


def shadow_of(Ps, Ns):
    """fraction of the shop light reaching each point (soft: percentage-closer filtering over a small disk)"""
    res = F('lres', 16)
    u, v, d = basis(LW)
    lo, hi = scene_bounds_light(u, v)
    dm = DirMap(LW, res, lo, hi)
    for P, N, part, side in MD.points(res * 1.6, parts=('disc', 'shell')):
        dm.add_max(P)
    dm.close(3)
    log('shadow map', dm.W, dm.H)
    Q = Ps + Ns * F('nbias', .08)
    rad = F('pcf', .32)                                    # cm: the softness of the studio's large light
    acc = np.zeros(len(Ps), np.float32)
    offs = [(0, 0)] + [(rad * r * math.cos(a), rad * r * math.sin(a)) for r in (.5, 1.) for a in np.linspace(0, 2 * math.pi, 9)[:-1]]
    for ox, oy in offs:
        mv, dd = dm.sample(Q + ox * dm.u + oy * dm.v)
        acc += (mv <= dd + F('sbias', .12)).astype(np.float32)
    return acc / len(offs)


def fib_dirs(n):
    i = np.arange(n) + .5
    phi = np.arccos(1 - 2 * i / n); th = math.pi * (1 + 5 ** .5) * i
    return np.c_[np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)]


def sky_occlusion(Ps, Ns):
    """sky light reaching each point: the scene seen from 64 directions; the floor occludes the lower half but sends back
    a little light (the shop's pale plinth)"""
    res = F('aores', 4.5)
    cloud = np.concatenate([P for P, N, part, side in MD.points(res * 1.5)])
    log('ao cloud', len(cloud))
    Q = Ps + Ns * F('aobias', .3)
    vis = np.zeros(len(Ps), np.float32); wsum = np.zeros(len(Ps), np.float32)
    sky = np.zeros(len(Ps), np.float32)
    for d in fib_dirs(int(F('aon', 64))):
        w = np.clip(Ns @ d, 0, None).astype(np.float32)
        if d[1] < -.05:
            # towards the floor: the plinth sends back a part of the light
            vis += w * F('floor', .3); wsum += w
            continue
        u, v, _ = basis(d)
        a = np.c_[cloud @ u, cloud @ v]
        dm = DirMap(d, res, a.min(0) - 2, a.max(0) + 2)
        dm.add_max(cloud)
        dm.close(3)
        mv, dd = dm.sample(Q)
        free = (mv <= dd + F('aob2', .25)).astype(np.float32)
        vis += w * free; wsum += w
        sky += w * free * (.6 + .4 * d[1])
    return vis / np.maximum(wsum, 1e-6), sky / np.maximum(wsum, 1e-6)


# ---------------------------------------------------------------- matt sage ceramic
def srgb2lin(c):
    return (np.asarray(c, float) / 255) ** 2.2


def ceramic(Ps, Ns, side, part, sh, ao, sky, V):
    """powdery matt clay: wrapped diffuse from the shop light, sky light and its occlusion, green light trapped and warmed in
    the hollows, a faint velvet at grazing angles; no specular"""
    A = srgb2lin([float(v) for v in OPT.get('alb', '79,92,77').split(',')])
    if part is not None:
        disc = part == 1
        A = np.where(disc[:, None], A * np.array([F('dk', .33)] * 3), A)
    ndl = Ns @ LW
    wrap = F('wrap', .1)
    D = np.clip((ndl + wrap) / (1 + wrap), 0, 1) * sh
    if part is not None:
        D = D * np.where(part == 1, F('kdd', .45), 1.)      # the plate faces the light edge-on: only a soft modelling
    sky_ = sky * F('ka', .5) + ao * F('kfl', .08)
    cav = np.clip(1 - ao, 0, 1) ** F('cavp', 1.2)
    # light trapped in the hollows bounces off the green walls: greener and warmer, never black
    tint = np.array([float(v) for v in OPT.get('cavt', '1.08,1.04,.72').split(',')])
    bounce = F('kb', .16) * cav * (.35 + .65 * np.clip(ao * 2, 0, 1))
    E = (F('kd', 1.0) * D)[:, None] * np.array([1.02, 1.0, .96]) + sky_[:, None] * np.array([.95, 1.0, 1.06]) \
        + bounce[:, None] * tint
    c = A * E
    # the throat: warm and dark
    c = c * (1 - F('cavd', .35) * cav[:, None])
    # velvet: grazing faces catch a pale, slightly grey sheen (powder), stronger where lit
    nv = np.clip(Ns @ V, 0, 1)
    vel = F('kv', .07) * (1 - nv) ** F('vp', 2.6) * (.35 + .65 * D) * ao
    c = c + vel[:, None] * srgb2lin([170, 182, 168])[None, :] * 3
    s = np.clip(c, 0, None) ** (1 / 2.2) * 255
    kn = F('knee', 225)
    s = np.where(s > kn, kn + (255 - kn) * (1 - np.exp(-(s - kn) / (255 - kn))), s)
    return np.clip(s, 0, 255)


def render(cam, need_disc=True):
    """depth buffers of the scene and of the disc alone, then the lit colour field of each"""
    dens = cam.k * F('over', 1.9)
    B = Buf(cam.W, cam.H)
    BD = Buf(cam.W, cam.H) if need_disc else None
    n = 0
    for P, N, part, side in MD.points(dens):
        B.splat(cam, P, N, part, side)
        if BD is not None and part == 1:
            BD.splat(cam, P, N, part, side)
        n += len(P)
    log('splatted %d points at %.1f/cm' % (n, dens), 'holes', B.fill_holes(), BD.fill_holes() if BD else '')
    out = {}
    for name, b in (('scene', B), ('disc', BD)):
        if b is None:
            continue
        idx = np.flatnonzero(b.z > -1e8)
        Ps, Ns = b.P[idx].astype(float), b.N[idx].astype(float)
        Ns /= np.linalg.norm(Ns, axis=1, keepdims=True) + 1e-9
        sh = shadow_of(Ps, Ns)
        ao, sky = sky_occlusion(Ps, Ns)
        col = ceramic(Ps, Ns, b.side[idx], b.part[idx], sh, ao, sky, cam.V)
        img = np.zeros((cam.H * cam.W, 3), np.float32); img[idx] = col
        out[name] = dict(img=img.reshape(cam.H, cam.W, 3), part=b.part.reshape(cam.H, cam.W), z=b.z.reshape(cam.H, cam.W),
                         side=b.side.reshape(cam.H, cam.W), P=b.P.reshape(cam.H, cam.W, 3),
                         sh=_f(idx, sh, cam), ao=_f(idx, ao, cam))
        log(name, 'lit')
    return out


def _f(idx, v, cam):
    a = np.zeros(cam.H * cam.W, np.float32); a[idx] = v
    return a.reshape(cam.H, cam.W)


def preview(cam, R, bg=(233, 231, 226)):
    img = np.zeros((cam.H, cam.W, 3), np.float32); img[:] = bg
    if 'disc' in R:
        m = R['disc']['part'] == 1
        img[m] = R['disc']['img'][m]
    m = R['scene']['part'] > 0
    img[m] = R['scene']['img'][m]
    return img


# ---------------------------------------------------------------- curves
def region_path(mask, q, mapf, step=3.0, level=None):
    f = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), .9)
    K.RDP_EPS = F('rdpc', .35); K.FIT_EPS = 0; K.AREA_MIN = 30
    return K.contour_paths(f, F('clev', .42) if level is None else level, step, q, mapf, 1.0)


def grain_filter(fid, upc, k1=None):
    """the sandy grain of the clay, at two scales: a fine sand (~0.5 mm) and a slow mottling of the surface (~5 mm), each a
    fractal noise lit as a relief from the light's side and multiplied into the colour; sized in cm, whatever the drawing's
    scale"""
    k1 = F('gk', .38) if k1 is None else k1
    kc = k1 * F('gkc', .5)
    flat = F('gfl', .78)                          # mean of the lit noise (elevation 55 deg), measured
    return ('<filter id="%s" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">'
            '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="2" seed="7" result="n"/>'
            '<feDiffuseLighting in="n" surfaceScale="%s" diffuseConstant="1" lighting-color="#fff" result="l">'
            '<feDistantLight azimuth="232" elevation="55"/></feDiffuseLighting>'
            '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="2" seed="3" result="n2"/>'
            '<feDiffuseLighting in="n2" surfaceScale="%s" diffuseConstant="1" lighting-color="#fff" result="l2">'
            '<feDistantLight azimuth="232" elevation="55"/></feDiffuseLighting>'
            '<feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="%s" k2="%s" result="m"/>'
            '<feComposite in="m" in2="l2" operator="arithmetic" k1="%s" k2="%s" result="m2"/>'
            '<feComposite in="m2" in2="SourceGraphic" operator="in"/></filter>') % (
        fid, K.fmt(F('gbf', 11) / upc), K.fmt(F('gss', 2.2)), K.fmt(F('gbc', 1.6) / upc), K.fmt(F('gssc', 6) * upc / 20.6),
        K.fmt(k1), K.fmt(1 - k1 * flat), K.fmt(kc), K.fmt(1 - kc * flat))


def part_svg(name, col, mask, clipmask, mapf, q, dy, step, defs, blur_id='bl'):
    """tone bands of one part, clipped to its outline"""
    K.RDP_EPS = F('rdp', .45); K.FIT_EPS = 0; K.AREA_MIN = F('amin', 12)
    bb = K.bands(col, mask, mapf, q, step, dy=dy)
    od = region_path(clipmask, q, mapf)
    cid = 'c' + name
    defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, od))
    inner = ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])
    return bb, cid, od, '<path fill="%s" d="%s"/><g filter="url(#%s)">%s</g>' % (bb[0][0], od, blur_id, inner)


def smooth_in(img, mask, sig):
    """blur a colour field inside its part only (the sampled sky light carries a fine noise that bands would outline)"""
    m = mask.astype(np.float32)
    den = cv2.GaussianBlur(m, (0, 0), sig)
    out = cv2.GaussianBlur(img * m[..., None], (0, 0), sig) / np.maximum(den, 1e-4)[..., None]
    return np.where(mask[..., None], out, img)


def build(cam):
    R = render(cam)
    sc, dc = R['scene'], R['disc']
    sig = F('csm', 1.6) * cam.osc / 1.5
    sc['img'] = smooth_in(sc['img'], sc['part'] == 2, sig)
    dc['img'] = smooth_in(dc['img'], dc['part'] == 1, sig * 1.5)
    shell = sc['part'] == 2
    disc_full = dc['part'] == 1
    q = F('q', .2) if cam.name == 'shop' else 1.0
    mapf = lambda x, y: cam.out(x, y)
    defs = []
    blur = F('blur', 1.2) / cam.osc
    defs.append('<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(blur))
    upc = cam.k / cam.osc                      # output units per cm
    defs.append(grain_filter('gr', upc))
    # the plate: bands over its whole outline (the parts hidden by the shell lit too), under the shell
    _, _, _, dsvg = part_svg('d', dc['img'], disc_full, disc_full, mapf, q, F('dyd', 3.0), F('step', 6), defs)
    # the shell: one set of bands; the front part reuses them under its own clip
    bb, cid, od, ssvg = part_svg('s', sc['img'], shell, shell, mapf, q, F('dys', 3.6), F('step', 6), defs)
    back = '<g filter="url(#gr)"><g clip-path="url(#cd)">%s</g><g clip-path="url(#cs)">%s</g></g>' % (dsvg, ssvg)
    body = ''
    meta = {}
    if cam.name == 'shop':
        # in front of the stems: the parts of the shell nearer than the centre of the cup
        Pm = np.array(MD.MOUTH, float)
        dm = float(Pm @ cam.V)
        front = shell & (sc['z'] > dm)
        front = cv2.morphologyEx(front.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
        fd = region_path(front, q, mapf)
        defs.append('<clipPath id="cf"><path d="%s"/></clipPath>' % fd)
        body = '<g filter="url(#gr)"><g clip-path="url(#cf)">%s</g></g>' % ssvg
        x, y, _ = cam.proj(Pm[None, :])
        mx, my = cam.out(x[0], y[0])
        meta = dict(mx=mx - K.VX, mh=K.FL - my)
    sil = shell | disc_full
    return dict(defs=''.join(defs), back=back, body=body, sil=sil, meta=meta, R=R, nb=len(bb))


def outline_pts(mapf, sil):
    cs, _ = cv2.findContours(sil.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    c = cv2.approxPolyDP(c.astype(np.float32), 1.5, True)[:, 0, :]
    pts = []
    for x, y in c:
        X, Y = mapf(float(x), float(y))
        pts.append([round(X - K.VX, 1), round(max(0., K.FL - Y), 1)])
    return pts


# ---------------------------------------------------------------- the copy (owner's decision, 2026-10-16): measured maps -> curves
# The parts, the calibrated depth, its normals and cast shadows come from releve.py (out/releve.npz); the light of the photograph
# was measured on them as numbers (out/releve.json: spherical-harmonics irradiance, cavity and cast-shadow terms, the studio's
# fall-off). The colour field is recomputed here from those maps and numbers, then written as tone bands per part.
PHOTO_K, PHOTO_X0, PHOTO_Y0, PHOTO_E = 20.6, 296.0, 806.0, math.radians(11.5)


def lab2rgb(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    d = 6 / 29
    inv = lambda f: np.where(f > d, f ** 3, 3 * d * d * (f - 4 / 29))
    xyz = np.stack([inv(fx) * .95047, inv(fy), inv(fz) * 1.08883], -1)
    M = np.array([[3.2404542, -1.5371385, -.4985314], [-.9692660, 1.8760108, .0415560], [.0556434, -.2040259, 1.0572252]])
    lin = np.clip(xyz @ M.T, 0, 1)
    rgb = np.where(lin <= .0031308, 12.92 * lin, 1.055 * lin ** (1 / 2.4) - .055)
    return np.clip(rgb * 255, 0, 255)


def copy_fields():
    R = np.load('out/releve.npz')
    J = json.load(open('out/releve.json'))
    import releve_feats as RF
    sil, plate, sheet = R['sil'], R['plate'], R['sheet']
    Fm = RF.feats(R['NRM'], R['CAV'], R['SH'], R['ED'])
    lab = np.zeros(sil.shape + (3,), np.float32)
    for name, m in (('sheet', sheet), ('plate', plate)):
        lab[m] = Fm[m] @ np.array(J['fit'][name]).T
    rgb = lab2rgb(lab).astype(np.float32)
    return dict(sil=sil, plate=plate, sheet=sheet, rgb=rgb, Z=R['Zcm'])


def ext_field(a, m, sig=6.0):
    """a field carried smoothly past the edge of its mask (for mapping curves that overshoot by a pixel or two)"""
    mm = m.astype(np.float32)
    den = cv2.GaussianBlur(mm, (0, 0), sig)
    e = cv2.GaussianBlur(np.where(m, a, 0).astype(np.float32), (0, 0), sig) / np.maximum(den, 1e-4)
    return np.where(m, a, e)


def build_copy(target):
    C = copy_fields()
    sil, plate, sheet, rgb = C['sil'], C['plate'], C['sheet'], C['rgb']
    H, W = sil.shape
    if target == 'photo':
        mapper = lambda Zp: (lambda x, y: (x, y))
        q, ou = 1.0, 1.0
    else:
        # the photograph's camera undone with the measured depth, the shop's projection applied (oblique, RY), per part
        q, ou = F('q', .2), K.UPC / PHOTO_K
        def mapper(Zp):
            def f(x, y):
                xi = int(min(max(round(x), 0), W - 1)); yi = int(min(max(round(y), 0), H - 1))
                Z = float(Zp[yi, xi])
                X = (x - PHOTO_X0) / PHOTO_K
                Y = ((PHOTO_Y0 - y) / PHOTO_K + Z * math.sin(PHOTO_E)) / math.cos(PHOTO_E)
                return K.VX + X * K.UPC, K.FL - Y * K.UPC + (Z - MD.AXZ) * K.RY * K.UPC
            return f
    Zs = ext_field(C['Z'], sheet); Zp_ = ext_field(C['Z'], plate)
    defs = ['<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
            % K.fmt(F('blur', 1.1) * ou),
            '<filter id="blp" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
            % K.fmt(F('blurp', 2.5) * ou), grain_filter('gr', PHOTO_K * ou, F('gk', .35)), grain_filter('gp', PHOTO_K * ou, F('gkp', .15))]
    sm = lambda img, m, k=1.: smooth_in(img, m, F('csm', 1.2) * k)
    _, _, _, dsvg = part_svg('d', sm(rgb, plate, F('csmp', 4.)), plate, plate | cv2.dilate(sheet.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & sil,
                             mapper(Zp_), q, F('dyd', 1.0), F('step', 4), defs, 'blp')
    bb, _, _, ssvg = part_svg('s', sm(rgb, sheet), sheet, sheet, mapper(Zs), q, F('dys', 2.6), F('step', 4), defs)
    # the lens of the photograph softens every edge over ~1.5 px: the whole drawing gets the same small blur
    defs.append('<filter id="lens" x="-2%%" y="-2%%" width="104%%" height="104%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('lens', .6) * ou))
    # the grain goes over the softened drawing (the photograph's grain is sharper than its edges)
    defs.append('<filter id="lens2" x="-2%%" y="-2%%" width="104%%" height="104%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                % K.fmt(F('lens2', .45) * ou))
    back = ('<g filter="url(#lens2)"><g filter="url(#gp)"><g filter="url(#lens)"><g clip-path="url(#cd)">%s</g></g></g>'
            '<g filter="url(#gr)"><g filter="url(#lens)"><g clip-path="url(#cs)">%s</g></g></g></g>') % (dsvg, ssvg)
    body, meta = '', {}
    if target == 'shop':
        Zm = float(MD.MOUTH[2])
        front = sheet & (C['Z'] > Zm)
        front = cv2.morphologyEx(front.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool)
        fd = region_path(front, q, mapper(Zs))
        defs.append('<clipPath id="cf"><path d="%s"/></clipPath>' % fd)
        body = '<g filter="url(#lens2)"><g filter="url(#gr)"><g filter="url(#lens)"><g clip-path="url(#cf)">%s</g></g></g></g>' % ssvg
        X, Y, Z = MD.MOUTH
        meta = dict(mx=X * K.UPC, mh=Y * K.UPC - (Z - MD.AXZ) * K.RY * K.UPC)
    prev = np.full((H, W, 3), 217, np.float32); prev[sil] = rgb[sil]
    return dict(defs=''.join(defs), back=back, body=body, sil=sil, meta=meta, prev=prev, nb=len(bb),
                mapsil=mapper(ext_field(C['Z'], sil)))


if __name__ == '__main__' and MODE in ('photo', 'shop'):
    cam = photo_cam() if MODE == 'photo' else shop_cam()
    B = build_copy(MODE)
    if MODE == 'photo':
        vb = '0 0 597 1024'
        bg = '<rect width="597" height="1024" fill="#d9d9d4"/>'
    else:
        vb = '%g %g %g %g' % cam.vb
        bg = '<rect x="%g" y="%g" width="%g" height="%g" fill="#ecebe6"/>' % cam.vb
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s%s%s</svg>'
           % (vb, B['defs'], bg, B['back'], B['body']))
    open('out/vase_%s.svg' % MODE, 'w', encoding='utf-8').write(svg)
    cv2.imwrite('out/prev_%s.png' % MODE, np.clip(B['prev'], 0, 255).astype(np.uint8)[:, :, ::-1])
    log('svg', len(svg), 'bytes', B['nb'], 'shell bands')
    if MODE == 'shop':
        import gzip
        K.write_body('out/body.json', B['defs'], B['body'], back=B['back'])
        raw = open('out/body.json', 'rb').read()
        log('body.json %d bytes, gzip %d' % (len(raw), len(gzip.compress(raw, 9))))
        sil = B['sil']
        pts = outline_pts(B['mapsil'], sil)
        H = round(max(p[1] for p in pts), 1)
        m = B['meta']
        mo = round(MD.MOUTH_HW * K.UPC, 1)
        fiche = {"id": "coque-verte", "refs": [], "n": "Coque verte", "m": "céramique mate sablée, vert sauge profond",
                 "fam": "sculpture", "shape": "outline", "p": 0, "mat": "matte", "fin": "", "col": "#4c5a48",
                 "col2": "#232b24", "lip": "rolled", "lipw": round(1.1 * K.UPC, 1),
                 "why": "Une feuille de céramique mate vert profond : une grande plaque ovale dont la moitié gauche s'enroule "
                        "en volute devant elle, en coupe à lèvre ronde, jusqu'au nombril où elle plonge.",
                 "ol": {"pts": pts, "mouth": [round(m['mx'] - mo, 1), round(m['mx'] + mo, 1), round(m['mh'], 1)],
                        "d": round(MD.DEPTH * K.UPC, 1)},
                 "h": H, "mo": mo, "mx": round(m['mx'], 1), "mh": round(m['mh'], 1), "sf": "none", "svgb": "coque-verte"}
        json.dump(fiche, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False)
        log('fiche h', fiche['h'], 'mx', fiche['mx'], 'mh', fiche['mh'], 'mo', fiche['mo'])


if __name__ == '__main__' and MODE == 'prev':
    which = OPT.get('cams', 'photo,shop').split(',')
    for cn in which:
        cam = photo_cam() if cn == 'photo' else shop_cam()
        R = render(cam)
        img = preview(cam, R)
        cv2.imwrite('out/prev_%s.png' % cn, np.clip(img, 0, 255).astype(np.uint8)[:, :, ::-1])
        for k in ('sh', 'ao'):
            cv2.imwrite('work/%s_%s.png' % (k, cn), (np.clip(R['scene'][k], 0, 1) * 255).astype(np.uint8))
        log('->', 'out/prev_%s.png' % cn, cam.W, cam.H)
