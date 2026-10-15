# The moulded-glass vase with dancing figures, from its structural maps: the normal map gives the orientation of the surface,
# the depth map the layering (hollows, thickness, cast shadows), the isolation of the five figures their crisp outlines.
# The shop's light and a lightly frosted glass are computed on them, and every form is written as SVG curves: a crisp outline,
# nested tone bands softened by a blur, thin stain lines in the undercuts. No image is embedded.
#   python mk2.py [photo|shop] [key=value ...]  ->  out/vase2_<proj>.svg
import sys, json, math, time
import numpy as np, cv2
sys.path.insert(0, '.')
PROJ = sys.argv[1] if len(sys.argv) > 1 else 'photo'
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
_argv = sys.argv
sys.argv = ['mk.py', 'photo']
import mk  # noqa: E402  (geometry, camera and vector helpers)
sys.argv = _argv
from skimage import measure  # noqa: E402

t0 = time.time()
W, H, S = mk.W, mk.H, mk.S
w2, h2 = W // S, H // S
L3 = np.array([-.5, -.62, .6]); L3 /= np.linalg.norm(L3)          # the shop light (v1a.js LV), screen frame, y down
HV = L3 + np.array([0, 0, 1.]); HV /= np.linalg.norm(HV)
F = lambda k, d: float(OPT.get(k, d))


# ---------------------------------------------------------------- maps
def load_maps():
    n = cv2.imread('out/guide_normal.webp')[:, :, ::-1].astype(np.float32) / 255 * 2 - 1
    n = cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)
    n = cv2.GaussianBlur(n, (0, 0), F('nblur', .9))
    n[..., 1] *= -1                                              # map: green up; screen: y down
    n /= np.linalg.norm(n, axis=2, keepdims=True) + 1e-6
    z = cv2.imread('out/guide_depth.png', 0).astype(np.float32)
    z = cv2.resize(z, (W, H), interpolation=cv2.INTER_CUBIC)
    z = cv2.GaussianBlur(z, (0, 0), .8)
    return n, z


def figure_masks():
    """the five figures isolated on the guide, by the hue of their overlay"""
    s = cv2.imread('out/guide_seg.webp')
    s = cv2.resize(s, (W, H), interpolation=cv2.INTER_CUBIC)
    hsv = cv2.cvtColor(s, cv2.COLOR_BGR2HSV).astype(int)
    h_, s_ = hsv[..., 0], hsv[..., 1]
    rules = {'L': (h_ >= 135) & (h_ <= 168) & (s_ > 45),
             'A': ((h_ <= 8) | (h_ >= 172)) & (s_ > 85),
             'B': (h_ >= 95) & (h_ <= 128) & (s_ > 55),
             'C': (h_ >= 38) & (h_ <= 78) & (s_ > 45),
             'R': (h_ >= 10) & (h_ <= 30) & (s_ > 130)}
    out = {}
    for k, m in rules.items():
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        n, lbl, st, _ = cv2.connectedComponentsWithStats(m)
        keep = np.zeros_like(m, bool)
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] > 1500:
                keep |= lbl == i
        # fill the holes and smooth the outline like a moulded edge
        ff = keep.astype(np.uint8).copy()
        cs, _ = cv2.findContours(ff, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        ff = np.zeros_like(ff); cv2.drawContours(ff, cs, -1, 1, -1)
        out[k] = cv2.GaussianBlur(ff.astype(np.float32), (0, 0), 1.6) > .5
    return out


# ---------------------------------------------------------------- light and frosted glass
def masked_blur(a, m, s):
    return cv2.GaussianBlur(a * m, (0, 0), s) / np.maximum(cv2.GaussianBlur(m.astype(np.float32), (0, 0), s), 1e-4)


def heightfield_shadow(Hh, scale):
    d = np.array([L3[0], L3[1]]); d /= np.linalg.norm(d)
    slope = L3[2] / math.hypot(L3[0], L3[1])
    sh = np.zeros_like(Hh)
    for t in range(1, 40):
        Ht = cv2.warpAffine(Hh, np.float32([[1, 0, d[0] * t], [0, 1, d[1] * t]]), (Hh.shape[1], Hh.shape[0]),
                            flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        occ = Ht - (Hh + t * scale * slope)
        sh = np.maximum(sh, occ / (2.5 + .3 * t * scale))
    return np.clip(sh, 0, 1)


PITS = None


def frosted(n, rel, cav, sh, kind):
    """lightly frosted glass, a little sepia stain wiped from the crests: luminous everywhere, warm where the glass is thick,
    cool and grey where it is thin, the thin edges lit from within"""
    nx, ny, nz = n[..., 0], n[..., 1], n[..., 2]
    dl = nx * L3[0] + ny * L3[1] + nz * L3[2]
    wl = np.clip((dl + .35) / 1.35, 0, 1)
    nh = np.clip(nx * HV[0] + ny * HV[1] + nz * HV[2], 0, 1)
    lit = wl * (1 - F('shk', .38) * sh)
    th = np.clip(rel / F('thick', 30), 0, 1)[..., None]
    if kind == 'glass':                     # plain frosted bands of the lip and the foot: pale, grey, translucent
        base = np.array([F('lr', 214), F('lg', 217), F('lb', 218)])
    elif kind == 'ground':
        base = np.array([F('gr', 200), F('gg', 190), F('gb', 174)])
    else:
        thin_c = np.array([float(v) for v in OPT.get('fthin', '234,230,222').split(',')])
        thick_c = np.array([float(v) for v in OPT.get('fthick', '246,232,206').split(',')])
        base = thin_c * (1 - th) + thick_c * th
    stain_c = np.array([166., 134., 98.])
    s = np.clip((cav - F('st0', .22)) / .55, 0, 1); s = s * s * (3 - 2 * s) * (F('stk', .7) if kind != 'glass' else .25)
    if PITS is not None and kind != 'glass':
        # the stain also sits in the small pits and creases of the surface (curvature of the normals)
        s = np.clip(s + (F('pitg', .9) if kind == 'ground' else F('pitf', .35)) * PITS, 0, 1)
    if kind == 'ground':
        s = np.clip(s + F('gstain', .25), 0, 1)
    alb = base * (1 - s[..., None]) + stain_c * s[..., None]
    amb = F('amb', .58) if kind != 'glass' else F('gamb', .3)
    # light scattered inside the frosted glass: the thicker the glass, the more it glows, whatever its orientation
    glow = F('glow', 0) * th[..., 0] if kind == 'fig' else 0
    I = amb + (1 - amb) * F('diff', 1) * lit + .05 * np.clip(nz, 0, 1) + glow
    # glass shadows are cool and grey, the light warm
    cs = np.array([float(v) for v in OPT.get('shadowtint', '.93,.97,1.05').split(',')])
    tint = cs * (1 - lit[..., None]) + np.array([1.01, 1., .98]) * lit[..., None]
    c = alb * I[..., None] * tint
    rim = F('rim', .2) * np.clip(1 - nz, 0, 1) ** 1.5 * (1 - s)
    sheen = (F('sheen', .12) * nh ** 10 + F('spec', 0) * nh ** F('specp', 40)) * (1 - sh) * (1 - .6 * s)
    c = c * (1 - rim[..., None]) + 252 * rim[..., None] + 255 * sheen[..., None]
    if EDGE is not None and kind == 'fig' and F('edgeb', 0) > 0:
        dark, bright = EDGE
        c = c * (1 - F('edged', .25) * dark[..., None]) + (np.array([255., 248., 232.]) - c) * (F('edgeb', .6) * bright)[..., None]
    if kind == 'ground' and F('spark', 0) > 0:
        # the crumbly ground glitters: crisp highlights on the tips of its grains
        c = c + 255 * (F('spark', 0) * nh ** F('sparkp', 40) * (1 - sh))[..., None]
    # a soft shoulder instead of clipping: highlights stay pearly, not burnt
    kn = F('knee', 215)
    c = np.where(c > kn, kn + (255 - kn) * (1 - np.exp(-(c - kn) / (255 - kn))), c)
    if kind != 'glass' and F('sss', 0) > 0:
        Y0 = c @ np.array([.3, .59, .11])
        sat = F('sss', 0) * np.clip(1 - np.abs(Y0 - F('sssc', 150)) / F('sssw', 90), 0, 1)
        c = Y0[..., None] + (c - Y0[..., None]) * (1 + sat[..., None] * 1.5) + sat[..., None] * np.array([14., 2., -16.])
    if kind != 'glass' and F('ramp', 1) > 0:
        # the colour of the stained satin glass at each lightness, measured on the reference: neutral pearly lights,
        # amber half-tones, grey-brown depths (the stain is warmest where it is thin)
        Y = c @ np.array([.3, .59, .11])
        R_ = RAMP_G if kind == 'ground' else RAMP_F
        rc = np.stack([np.interp(Y, R_[:, 0], R_[:, k]) for k in (1, 2, 3)], -1)
        ry = rc @ np.array([.3, .59, .11])
        c = rc * (Y / np.maximum(ry, 1))[..., None]
    if kind == 'fig' and F('trans', 0) > 0:
        # translucency: light that entered on the lit side comes out on the shaded side of a thick form, warm and soft;
        # the shadows of glass glow instead of going grey (what plaster cannot do)
        gl_ = np.array([float(v) for v in OPT.get('transcol', '250,214,160').split(',')])
        k_ = F('trans', 0) * (1 - lit)[..., None] * np.clip(np.maximum(th, F('thmin', 0)) * 1.4, 0, 1)
        c = c * (1 - k_) + gl_ * k_
    return np.clip(c, 0, 255)


EDGE = None          # (inner dark band, bright rim line) along the outlines of the dancers, set by main()


def glass_shade(n, rel, cav, sh, kind):
    """moulded satin glass seen as glass: what it transmits (light scattered inside, more and warmer where the glass is thick,
    the room seen through where it is thin), what it reflects (the studio, Fresnel-weighted, with crisp hot spots), the
    sepia stain in the hollows, and the refraction at the outlines of the forms (a dark band inside, a bright thread on the edge)"""
    nx, ny, nz = n[..., 0], n[..., 1], n[..., 2]
    nz = np.clip(nz, 0, 1)
    dl = nx * L3[0] + ny * L3[1] + nz * L3[2]
    nh = np.clip(nx * HV[0] + ny * HV[1] + nz * HV[2], 0, 1)
    wall = F('wall', 10) if kind != 'glass' else F('lwall', 14)
    t = wall + np.clip(rel, 0, None)
    a = 1 - np.exp(-t / F('tau', 26))                     # how much light the glass gathers and scatters
    room = np.array([float(v) for v in OPT.get('room', '238,236,232').split(',')])
    amber = np.array([float(v) for v in OPT.get('amber', '246,214,160').split(',')])
    milky = np.array([float(v) for v in OPT.get('milky', '244,242,236').split(',')])
    w = np.clip(1 - np.exp(-t / F('tauc', 40)), 0, 1)[..., None] * F('warm', .7)
    scat = milky * (1 - w) + amber * w
    # transmitted: the room through thin glass, the scattered glow through thick glass; light entering from the shop light
    # side makes the far flanks of a form glow a little more than its near ones (light travels through)
    thru = F('thru', .82) * (1 - a)
    side = 1 + F('side', .18) * np.clip(-dl, -1, 1)
    T = (room * thru[..., None] + scat * (a * F('glowk', 1))[..., None]) * side[..., None]
    # a little of the shop light's modelling, so the forms still turn (glass is not a flat cut-out)
    lam = np.clip((dl + .3) / 1.3, 0, 1) * (1 - F('shk', .38) * sh)
    T = T * (F('amb2', .72) + F('diff2', .34) * lam)[..., None]
    # stain in the hollows and pits
    s = np.clip((cav - F('st0', .22)) / .55, 0, 1); s = s * s * (3 - 2 * s) * F('stk', .75)
    if PITS is not None and kind != 'glass':
        s = np.clip(s + (F('pitg', 1.2) if kind == 'ground' else F('pitf', .35)) * PITS, 0, 1)
    if kind == 'ground':
        s = np.clip(s + F('gstain', .3), 0, 1)
    if kind == 'glass':
        s = s * .2
    stain = np.array([float(v) for v in OPT.get('stain', '150,112,72').split(',')])
    c = T * (1 - s[..., None]) + stain * (s * (.55 + .45 * lam))[..., None]
    # reflection of the studio, satin
    Fr = F('f0', .05) + (1 - F('f0', .05)) * (1 - nz) ** F('fp', 3)
    rx, ry, rz = 2 * nz * nx, 2 * nz * ny, 2 * nz * nz - 1
    box = np.exp(-((rx - L3[0]) ** 2 + (ry - L3[1]) ** 2 + (rz - L3[2]) ** 2) / F('boxw2', .35))
    strip = np.exp(-((rx + F('stripx', .62)) / F('stripw', .14)) ** 2) * np.clip(1 - np.abs(ry + .1) / 1.1, 0, 1) * (rz > -.3)
    env = F('kbox2', 1.4) * box + F('kstrip2', .9) * strip + .25 * np.clip(-ry, 0, 1)
    hot = F('hot', .55) * nh ** F('hotp', 70) * (1 - sh)
    R = np.clip(Fr * env * F('reflk', 1) + hot, 0, 1.2) * (1 - .7 * s)
    c = c * (1 - .5 * np.clip(R, 0, 1)[..., None]) + 255 * R[..., None] * .9
    if EDGE is not None and kind == 'fig':
        dark, bright = EDGE
        c = c * (1 - F('edged', .35) * dark[..., None]) + (np.array([255., 250., 240.]) - c) * (F('edgeb', .7) * bright)[..., None]
    kn = F('knee', 225)
    c = np.where(c > kn, kn + (255 - kn) * (1 - np.exp(-(c - kn) / (255 - kn))), c)
    return np.clip(c, 0, 255)


# measured colour ramps (lightness -> rgb) of the reference's figures and ground
RAMP_F = np.array([[0, 40, 37, 34], [70, 81, 74, 67], [90, 103, 90, 76], [110, 127, 110, 89], [130, 145, 127, 105], [150, 164, 148, 128],
                   [170, 182, 168, 150], [190, 200, 188, 170], [210, 217, 208, 191], [230, 235, 229, 215], [250, 249, 245, 235],
                   [255, 253, 251, 246]], float)
RAMP_G = np.array([[0, 40, 34, 28], [110, 128, 110, 89], [130, 145, 125, 102], [150, 164, 146, 123], [170, 183, 168, 147],
                   [190, 200, 188, 169], [210, 220, 207, 188], [230, 238, 228, 211], [255, 252, 246, 236]], float)


def reflections(n, kind_mask=None):
    """the studio mirrored by the satin glass: a large softbox up on the left (the shop light), a tall window strip on the
    left, a pale ceiling, a dark floor; blurred by the satin finish and weighted by Fresnel. Returns an alpha field 0..1"""
    nx, ny, nz = n[..., 0], n[..., 1], n[..., 2]
    # reflected view ray, the eye looking along -z
    rx, ry, rz = 2 * nz * nx, 2 * nz * ny, 2 * nz * nz - 1
    box = np.exp(-((rx - L3[0]) ** 2 + (ry - L3[1]) ** 2 + (rz - L3[2]) ** 2) / F('boxw', .55))
    strip = np.exp(-((rx + F('stripx', .62)) / F('stripw', .16)) ** 2) * np.clip(1 - np.abs(ry + .1) / 1.1, 0, 1) * (rz > -.3)
    ceil = np.clip(-ry, 0, 1) ** 2 * .35
    env = F('kbox', .8) * box + F('kstrip', .45) * strip + ceil
    fres = .25 + .75 * np.clip(1 - nz, 0, 1) ** 2
    a = env * fres * F('refl', .55)
    t0 = F('rt0', 0)
    return np.clip((a - t0) / max(1e-6, 1 - t0), 0, 1) ** F('rgam', 1)


# ---------------------------------------------------------------- the shop's view: the photograph's camera undone, the shop's projection applied
# the vessel in the shop is drawn 1.5 times its catalogue size against the flowers (the owner's call, 2026-10-09)
VSCALE = float(OPT.get('vscale', 1.5))
UPC, VX, FL, RY = 6.5 * VSCALE, 500.0, 990.0, .16
PXCM = mk.CAM['f'] / mk.CAM['D']                      # pixels per cm at the axis
_sil = mk.SIL.astype(float)


def r_surf(h):
    """radius (cm) of the surface carrying the reliefs at height h (cm): the ground cone plus the mean relief"""
    y = mk.CAM['y0'] + PXCM * (mk.CAM['hc'] - h)
    return mk.RG(min(max(y, 205), 1115)) / PXCM + .6


def shop_map(x, y):
    c = mk.CAM
    cx = mk.CX(y)
    h = c['hc'] - (y - c['y0']) / PXCM
    th = 0.0
    for _ in range(6):
        R = r_surf(h)
        u = (x - cx) * (c['D'] - R * math.cos(th)) / c['f']
        th = math.asin(max(-1.0, min(1.0, u / R)))
        h = c['hc'] - (y - c['y0']) * (c['D'] - R * math.cos(th)) / c['f']
    R = r_surf(h)
    return VX + u * UPC, FL - h * UPC + R * math.cos(th) * RY * UPC


mk.SHOP_MAP = shop_map
mk.SHOP_K = UPC / PXCM
mk.SHOP_VB = '%g %g %g %g' % (VX - 12.5 * UPC, FL - 26.5 * UPC, 25 * UPC, 28.6 * UPC)


# ---------------------------------------------------------------- assembly
def region_path(mask, q, mapf, step=4.0):
    f = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), .8)
    return mk.contour_paths(f, .5, step, q, mapf, 1.0)


def main():
    mapf = (lambda x, y: (x, y)) if PROJ == 'photo' else mk.SHOP_MAP
    q = 1.0 if PROJ == 'photo' else float(OPT.get('qs', .2 * VSCALE))
    n, z = load_maps()
    figs = figure_masks()
    sil = mk.poly_mask(mk.silhouette_pts(), 1.0, (H, W), n=1)
    rf = mk.rim_foot_svg(mapf, q)
    lip = mk.poly_mask(rf['lip_top'] + rf['lip_bot'][::-1], 1.0, (H, W), n=1)
    foot = mk.poly_mask(rf['foot_top'] + rf['foot_bot'][::-1], 1.0, (H, W), n=1)
    body = sil & ~lip & ~foot
    for k in figs:
        figs[k] &= body
    print('maps %.1fs' % (time.time() - t0), {k: int(v.sum()) for k, v in figs.items()})
    # half resolution fields
    r = lambda a, interp=cv2.INTER_AREA: cv2.resize(a, (w2, h2), interpolation=interp)
    n2 = r(n); n2 /= np.linalg.norm(n2, axis=2, keepdims=True) + 1e-6
    z2 = r(z)
    sil2 = r(sil.astype(np.uint8)) > 0
    zb = masked_blur(z2, sil2.astype(np.float32), F('zbs', 22))
    rel = np.clip((z2 - zb) * F('zk', .6), 0, None)
    cav = (np.clip((cv2.GaussianBlur(z2, (0, 0), 2) - z2) / 6, 0, 1) * .5 + np.clip((cv2.GaussianBlur(z2, (0, 0), 7) - z2) / 12, 0, 1) * .5
           + np.clip((cv2.GaussianBlur(z2, (0, 0), 18) - z2) / 22, 0, 1) * .35)
    sh = heightfield_shadow(z2 * F('zk', .6), S)
    print('light %.1fs' % (time.time() - t0))
    defs, body_svg = [], []
    blur = F('blur', 1.6) if PROJ == 'photo' else F('blur', 1.6) * mk.SHOP_K
    defs.append('<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % mk.fmt(blur))
    defs.append('<linearGradient id="gline" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8c6c4a" stop-opacity="0"/>'
                '<stop offset=".55" stop-color="#7a5a3a" stop-opacity=".2"/><stop offset="1" stop-color="#6a4a2c" stop-opacity=".38"/></linearGradient>')
    nb = 0

    ng = cv2.GaussianBlur(n2, (0, 0), F('gblur', 3)); ng /= np.linalg.norm(ng, axis=2, keepdims=True) + 1e-6
    global EDGE
    # refraction at the outlines of the dancers: distance to the outline of each figure, inside it
    dark = np.zeros((h2, w2)); bright = np.zeros((h2, w2))
    for k in figs:
        fm = r(figs[k].astype(np.uint8)) > 0
        if fm.sum() < 50:
            continue
        d = cv2.distanceTransform(fm.astype(np.uint8), cv2.DIST_L2, 5) * S       # px of the reference
        gy_, gx_ = np.gradient(cv2.GaussianBlur(d, (0, 0), 2))
        gl = np.hypot(gx_, gy_) + 1e-6
        # outward normal of the outline = -grad d; the edge facing the light catches it
        face = np.clip(-(-gx_ / gl * L3[0] + -gy_ / gl * L3[1]) * -1, 0, 1)
        band = np.exp(-((d - F('eb0', 6)) / F('ebw', 3.5)) ** 2) * fm
        thread = np.exp(-(d / F('etw', 1.6)) ** 2) * fm
        dark = np.maximum(dark, band * (1 - .6 * face))
        bright = np.maximum(bright, thread * (.35 + .65 * face))
    EDGE = (dark, bright)
    global PITS
    nb_ = cv2.GaussianBlur(n2, (0, 0), F('pitsig', 1.0))
    dv = np.gradient(nb_[..., 0], axis=1) + np.gradient(nb_[..., 1], axis=0)
    PITS = np.clip((-dv - F('pit0', .04)) / F('pitw', .12), 0, 1)

    canvas = np.zeros((h2, w2, 3)); canvas[:] = (11, 11, 11); canvas[(np.mgrid[0:h2, 0:w2][0] * S) > 915] = (244, 244, 242)

    def layer(name, mask, kind, dy, step, outline, alpha=1.0):
        nonlocal nb
        m2 = r(mask.astype(np.uint8)) > 0
        if m2.sum() < 50:
            return
        shade = glass_shade if OPT.get('model') == 'glass' else frosted
        col = shade(ng if kind != 'fig' else n2, rel, cav, sh, kind)
        canvas[m2] = canvas[m2] * (1 - alpha) + col[m2] * alpha
        if F('csm', 0) > 0:
            col = cv2.GaussianBlur(col, (0, 0), F('csm', 0))
        mk.AREA_MIN = F('amin', 0)
        mk.FIT_EPS = F('fit', 0) if kind == 'fig' else F('fitg', F('fit', 0))
        mk.RDP_EPS = F('rdp', .7) if kind == 'fig' else F('rdpg', 1.2)
        od = region_path(mask, q, mapf)
        if not od:
            return
        cid = 'c' + name
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, od))
        bb = mk.bands(col, m2, mapf, q, step, dy=dy)
        nb += len(bb)
        body_svg.append('<g clip-path="url(#%s)"%s><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g></g>' % (
            cid, '' if alpha >= 1 else ' opacity="%s"' % mk.fmt(alpha), bb[0][0], od, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
        if outline:
            body_svg.append('<path fill="none" stroke="url(#gline)" stroke-width="%s" filter="url(#bl)" d="%s"/>' % (mk.fmt(F('ow', 1.1) if PROJ == 'photo' else .14), od))

    # behind the thin front wall: the inside of the vase and its far wall, whose dancers show from behind, soft and pale
    allf = np.zeros((H, W), bool)
    for k in figs:
        allf |= figs[k]
    xs = np.arange(W, dtype=np.float32); ys = np.arange(H, dtype=np.float32)
    mxp = np.tile(2 * 607.0 - xs, (H, 1)); myp = np.tile(ys[:, None], (1, W))
    # the far wall is seen through the vase, smaller (farther) and mirrored
    shrink = F('bshr', .86)
    mxp = 607.0 + (mxp - 607.0) / shrink
    back = (cv2.remap(allf.astype(np.float32), mxp, myp, cv2.INTER_LINEAR) > .5) & body
    if F('bop', 0) > 0:
        bcol = np.array([float(v) for v in OPT.get('bcol', '200,186,160').split(',')])
        fcol = np.array([float(v) for v in OPT.get('fcol', '236,226,206').split(',')])
        b2 = r(body.astype(np.uint8)) > 0
        canvas[b2] = canvas[b2] * (1 - F('bop', 0)) + bcol * F('bop', 0)
        body_svg.append('<path fill="rgb(%d,%d,%d)" fill-opacity="%s" d="%s"/>' % (tuple(bcol) + (mk.fmt(F('bop', 0)), region_path(body, q, mapf))))
        mk.RDP_EPS = F('rdpg', 1.2); mk.FIT_EPS = 0; mk.AREA_MIN = 200
        bd = region_path(back, q, mapf, 6.0)
        if bd:
            defs.append('<filter id="tb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                        % mk.fmt(F('tblur', 7) * (1 if PROJ == 'photo' else mk.SHOP_K)))
            body_svg.append('<path fill="rgb(%d,%d,%d)" fill-opacity="%s" filter="url(#tb)" d="%s"/>' % (tuple(fcol) + (mk.fmt(F('fop', .6)), bd)))
            bk = cv2.GaussianBlur((r(back.astype(np.uint8)) > 0).astype(np.float32), (0, 0), F('tblur', 7) / S) * F('fop', .6)
            canvas[b2] = canvas[b2] * (1 - bk[b2, None]) + fcol * bk[b2, None]
    layer('g', body, 'ground', F('dyg', 9), F('stepg', 8), False, alpha=F('gop', 1))
    # figures from the farthest to the nearest (mean depth)
    order = sorted(figs, key=lambda k: z[figs[k]].mean() if figs[k].any() else 0)
    for k in order:
        layer(k, figs[k], 'fig', F('dy', 7), F('step', 6), True, alpha=F('fop2', 1))
    layer('lip', lip, 'glass', 8, 6, False, alpha=F('lop', .9))
    layer('foot', foot, 'glass', 8, 6, False, alpha=F('lop', .9))
    # the windows of the studio mirrored by the cylinder: soft vertical bands over the whole vase, figures and ground alike
    if F('win', 0) > 0:
        defs.append('<clipPath id="cw"><path d="%s"/></clipPath>' % region_path(sil & ~lip & ~foot, q, mapf))
        defs.append('<filter id="wb" x="-20%%" y="-5%%" width="140%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                    % mk.fmt(F('wbl', 10) * (1 if PROJ == 'photo' else mk.SHOP_K)))
        bands_ = [(float(OPT.get('w1u', -.5)), F('w1w', .22), F('win', 0)), (float(OPT.get('w2u', .72)), F('w2w', .07), F('win2', .5) * F('win', 0))]
        for bi, (u0, ww, op) in enumerate(bands_):
            gid_ = 'wg%d' % bi
            # a band is a stack of narrowing strips (a gradient across, the turned surface's own curvature along)
            for lev in range(1, 6):
                hw = ww * (1.25 - lev * .2)
                pts_l, pts_r = [], []
                for y in np.arange(mk.RIM['bot'], 1290, 12.0):
                    cx_, rg_ = mk.CX(y), mk.RG(min(max(y, 205), 1115)) + 18
                    pts_l.append((cx_ + rg_ * max(-1, u0 - hw), y)); pts_r.append((cx_ + rg_ * min(1, u0 + hw), y))
                P_ = pts_l + pts_r[::-1]
                d_ = 'M' + 'L'.join(mk.nums(np.round(np.array(mapf(x, y)) / q) * q) for x, y in P_) + 'z'
                body_svg.append('<g clip-path="url(#cw)"><path fill="#ffffff" fill-opacity="%s" filter="url(#wb)" d="%s"/></g>' % (mk.fmt(op / 5), d_))
            u = (np.mgrid[0:h2, 0:w2][1] * S - mk.CX(np.mgrid[0:h2, 0:w2][0] * S)) / (mk.RG(np.clip(np.mgrid[0:h2, 0:w2][0] * S, 205, 1115)) + 18)
            prof_ = np.clip(1 - np.abs(u - u0) / (ww * 1.05), 0, 1) * op
            bm = sil2 & ~(r(lip.astype(np.uint8)) > 0) & ~(r(foot.astype(np.uint8)) > 0)
            canvas[bm] = canvas[bm] * (1 - prof_[bm, None]) + 255 * prof_[bm, None]
    # the reflections of the studio, one smooth layer over the whole vase (figures, ground, lip and foot alike)
    if F('refl', .55) > 0:
        rf2 = reflections(cv2.GaussianBlur(n2, (0, 0), F('rblur', 1.5)))
        rf2 = np.where(sil2, rf2, 0)
        mk.RDP_EPS = F('rdp', .7); mk.FIT_EPS = 0; mk.AREA_MIN = F('ramin', 60)
        defs.append('<filter id="rb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
                    % mk.fmt(F('rbl', 3) * (1 if PROJ == 'photo' else mk.SHOP_K)))
        defs.append('<clipPath id="cs"><path d="%s"/></clipPath>' % region_path(sil, q, mapf))
        rr = ''
        lv = np.arange(F('r0', .06), rf2.max(), F('rdy', .07))
        for a in lv:
            d = mk.contour_paths(rf2.astype(np.float32), float(a), F('rstep', 6), q, mapf, S)
            if d:
                rr += '<path d="%s"/>' % d
        body_svg.append('<g clip-path="url(#cs)"><g fill="#ffffff" fill-opacity="%s" filter="url(#rb)">%s</g></g>' % (mk.fmt(F('rdy', .07) * 1.1), rr))
    # stain lines in the creases: where the surface folds inward (negative divergence of the normals), at full resolution,
    # inside the figures (eyelids, lips, fingers, locks, the undersides of the breasts, the groin, the knees)
    nf = cv2.GaussianBlur(n, (0, 0), F('csig', 1.4))
    div = np.gradient(nf[..., 0], axis=1) + np.gradient(nf[..., 1], axis=0)
    figall = np.zeros((H, W), bool)
    for k in figs:
        figall |= figs[k]
    figall = cv2.erode(figall.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    crease = np.where(figall, -div, 0).astype(np.float32)
    mk.RDP_EPS = F('rdp', .7); mk.FIT_EPS = 0; mk.AREA_MIN = F('lamin', 25)
    for lev, op in ((F('crease', .07), F('lineop', .26)), (F('crease2', .13), F('lineop2', .34))):
        lines = mk.contour_paths(crease, lev, F('lstep', 3.0), q, mapf, 1.0)
        if lines:
            body_svg.append('<path fill="#6e5034" fill-opacity="%s" filter="url(#bl)" d="%s"/>' % (mk.fmt(op), lines))
    if PROJ == 'photo':
        cv2.imwrite('out/prev_photo.png', np.clip(canvas, 0, 255).astype(np.uint8)[:, :, ::-1])
    vb = '0 0 1200 1435' if PROJ == 'photo' else mk.SHOP_VB
    back = ('<rect width="1200" height="915" fill="#0b0b0b"/><rect y="915" width="1200" height="520" fill="#f4f4f2"/>'
            if PROJ == 'photo' else '')
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>'
           % (vb, ''.join(defs), back, ''.join(body_svg)))
    out = 'out/vase2_%s.svg' % PROJ
    open(out, 'w').write(svg)
    print('svg %d bytes, %d bands, %.1fs -> %s' % (len(svg), nb, time.time() - t0, out))


if __name__ == '__main__':
    main()
