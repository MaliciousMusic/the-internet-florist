# Generator of the moulded-glass vase with dancing figures, in native SVG.
# The relief is modelled from the tracing (trace.py: forms in pixels of the reference), the light of the shop is computed on it,
# and each crisp form is written as SVG curves: its outline, then nested tone bands softened by a blur. No image is embedded.
#   python mk.py [photo|shop] -> out/vase_<proj>.svg (+ out/vase_<proj>.json with the measures)
import sys, json, math, time
import numpy as np, cv2
from scipy import sparse
from scipy.sparse.linalg import spsolve
sys.path.insert(0, '.')
import trace as T

PROJ = sys.argv[1] if len(sys.argv) > 1 else 'photo'
W, H = 1200, 1435          # reference frame (pixels of the photograph)
S = 2                      # relief and light are computed at 1/S resolution
w2, h2 = W // S, H // S
t0 = time.time()

# ---------------------------------------------------------------- measured geometry of the vessel (photo pixels)
SIL = np.load('out/sil.npy')            # rows (y, x_left, x_right) of the silhouette, measured on the photograph
CX = lambda y: 608 - 3.5 * (y - 180) / 1010
RIM = dict(top=101, side_top=126, bot=190, side_bot=205, r=428)
FOOT = dict(top=1290, side_top=1118, bot=1366, side_bot=1240, r=284)
# ground of the body (between the figures): a cone, wider at the mouth
RG = lambda y: 412 + (268 - 412) * (y - 205) / (1115 - 205)
L3 = np.array([-.5, -.62, .6])
if '--front' in sys.argv:
    L3 = np.array([-.25, -.2, 1.])     # diagnostic only: a light close to the photograph's
L3 /= np.linalg.norm(L3)         # the shop light (v1a.js LV), screen frame: x right, y down, z to the eye
HV = L3 + np.array([0, 0, 1.]); HV /= np.linalg.norm(HV)


def poly_mask(pts, scale=1.0, shape=(H, W), n=8):
    m = np.zeros(shape, np.uint8)
    P = np.array(T.smooth(pts, n)) * scale
    cv2.fillPoly(m, [np.round(P * 4).astype(np.int32)], 1, lineType=cv2.LINE_8, shift=2)
    return m.astype(bool)


def silhouette_pts():
    """Outline of the whole vessel as measured (left side down, right side up), smoothed."""
    ys = SIL[:, 0].astype(float); xl = SIL[:, 1].astype(float); xr = SIL[:, 2].astype(float)
    k = np.ones(9) / 9
    xl = np.convolve(np.pad(xl, 4, mode='edge'), k, 'valid'); xr = np.convolve(np.pad(xr, 4, mode='edge'), k, 'valid')
    sel = np.arange(0, len(ys), 6)
    left = [(xl[i], ys[i]) for i in sel if ys[i] >= RIM['side_top']]
    right = [(xr[i], ys[i]) for i in sel[::-1] if ys[i] >= RIM['side_top']]
    return left + right


# ---------------------------------------------------------------- relief: inflated forms, joined softly inside a group
def inflate(mask):
    """Poisson inflation: lap u = -1 inside, 0 outside; sqrt(2u) gives round sections (a tube of half-width w rises w)."""
    ys, xs = np.nonzero(mask)
    n = len(ys)
    if n == 0:
        return np.zeros(mask.shape)
    idx = -np.ones(mask.shape, np.int64); idx[ys, xs] = np.arange(n)
    r = [np.arange(n)]; c = [np.arange(n)]; v = [np.full(n, 4.0)]
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        yy, xx = ys + dy, xs + dx
        inb = (yy >= 0) & (yy < mask.shape[0]) & (xx >= 0) & (xx < mask.shape[1])
        j = np.full(n, -1); j[inb] = idx[yy[inb], xx[inb]]
        ok = j >= 0
        r.append(np.arange(n)[ok]); c.append(j[ok]); v.append(np.full(ok.sum(), -1.0))
    A = sparse.csr_matrix((np.concatenate(v), (np.concatenate(r), np.concatenate(c))), shape=(n, n))
    u = spsolve(A.tocsc(), np.ones(n))
    out = np.zeros(mask.shape); out[ys, xs] = np.sqrt(2 * np.maximum(u, 0))
    return out


def smax(a, b, k=6.0):
    return .5 * (a + b + np.sqrt((a - b) ** 2 + k * k)) - .5 * k


def seg_dist(px, py, pts):
    """distance of every pixel to a polyline"""
    d = np.full(px.shape, 1e9)
    for (x0, y0), (x1, y1) in zip(pts[:-1], pts[1:]):
        vx, vy = x1 - x0, y1 - y0
        L = vx * vx + vy * vy or 1
        t = np.clip(((px - x0) * vx + (py - y0) * vy) / L, 0, 1)
        d = np.minimum(d, np.hypot(px - x0 - t * vx, py - y0 - t * vy))
    return d


REF = 'out/ref.jpg'                  # the private reference (never in the repository); only its measures shape the relief
OPT = dict(a.split('=') for a in sys.argv[2:] if '=' in a)
FROST = bool(OPT.get('frost'))
DETAIL = float(OPT.get('detail', 9))
AMPK = float(OPT.get('amp', 1))


def detail_relief():
    im = cv2.imread(REF)
    if im is None:
        return None
    L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    # edge-preserving denoise: keeps the creases sharp, removes the grain of the photograph
    L = cv2.bilateralFilter(L, 9, 18, 5).astype(np.float32) / 255
    # dark is deep: the stain pools in the hollows and the crests catch the light, so the lightness, band-passed, measures the relief
    if OPT.get('guided'):
        # an edge-preserving smoothing removes the small wobbles of the lightness but keeps the outlines of the forms
        Lg = L.copy()
        for _ in range(2):
            Lg = cv2.bilateralFilter(Lg, 15, .06, 7)
        L = Lg
    b = [cv2.GaussianBlur(L, (0, 0), s) for s in (1.3, 4, 10, 24, 50)]
    wts = [float(v) for v in OPT.get('bands', '1,1.3,1.4,1.0').split(',')]
    d = sum(w * (b[i] - b[i + 1]) for i, w in enumerate(wts))
    d = cv2.resize(d, (w2, h2), interpolation=cv2.INTER_AREA)
    return d / (np.percentile(np.abs(d), 98) + 1e-6)


DET = None
try:
    FIT = json.load(open('out/tubes_fit.json'))
except OSError:
    FIT = {}


def hair_grooves(m2, fig, spacing=6.5, depth=3.2, width=3.2):
    """wavy locks: grooves that follow the outline of the hair mass at growing depths, broken into strands"""
    rng = np.random.default_rng(abs(hash(fig)) % 2 ** 31)
    d = cv2.distanceTransform(m2.astype(np.uint8), cv2.DIST_L2, 5) * S
    yy, xx = np.mgrid[0:h2, 0:w2].astype(float) * S
    wave = 2.2 * np.sin(xx / 9.0 + yy / 13.0) + 1.6 * np.sin(yy / 7.0 - xx / 17.0)
    phase = (d + wave) / spacing
    g = np.exp(-((phase - np.round(phase)) * spacing / (width * .5)) ** 2)
    # strands: the grooves fade in and out along their length
    breaks = .5 + .5 * np.sin(np.arctan2(yy - yy[m2].mean(), xx - xx[m2].mean()) * (7 + rng.integers(0, 4)) + rng.random() * 6 + d / 5)
    return depth * g * np.clip(breaks * 1.6, 0, 1) * (d > 2.5) * m2


def swept(p):
    """height (1/S resolution), mask (1/S) and mask (full resolution) of a tube or an ellipsoid, computed in its bounding box"""
    import tubes as TB
    if 'axis' in p:
        key = '%s.%s' % (p['fig'], p['name'])
        if OPT.get('fit') and key in FIT:
            p = dict(p, axis=FIT[key])
        A = np.array([list(a) + [0] * (4 - len(a)) for a in p['axis']], float)
        rmax = A[:, 2].max()
        x0, y0 = A[:, 0].min() - rmax - 4, A[:, 1].min() - rmax - 4
        x1, y1 = A[:, 0].max() + rmax + 4, A[:, 1].max() + rmax + 4
        f = lambda xx, yy: TB.tube_height(xx, yy, p['axis'], k=p['k'])
    else:
        cx, cy, rx, ry, a, z = p['blob']
        rr = max(rx, ry) + 4
        x0, y0, x1, y1 = cx - rr, cy - rr, cx + rr, cy + rr
        f = lambda xx, yy: TB.blob_height(xx, yy, cx, cy, rx, ry, a, k=p['k'], z=z)
    out = []
    for sc, (hh, ww) in ((S, (h2, w2)), (1, (H, W))):
        X0, Y0 = max(0, int(x0 // sc)), max(0, int(y0 // sc)); X1, Y1 = min(ww, int(x1 // sc) + 2), min(hh, int(y1 // sc) + 2)
        yy, xx = np.mgrid[Y0:Y1, X0:X1].astype(float) * sc
        hb, ib = f(xx, yy)
        Hm = np.zeros((hh, ww)); M = np.zeros((hh, ww), bool)
        Hm[Y0:Y1, X0:X1] = hb; M[Y0:Y1, X0:X1] = ib
        out.append((Hm, M))
    (hp, m2), (_, full) = out
    return hp * AMPK, m2, full


def spline_mask(mask):
    """a region redrawn through its outline sampled every few px (spacing grows with the size of the form)"""
    from skimage import measure as _ms
    out = np.zeros(mask.shape, np.uint8)
    n, lbl = cv2.connectedComponents(mask.astype(np.uint8))
    for k in range(1, n):
        comp = lbl == k
        area = comp.sum()
        if area < 150:
            continue
        sp = float(np.clip(.09 * math.sqrt(area), 7, 24))
        f = cv2.GaussianBlur(comp.astype(np.float32), (0, 0), 1.5)
        for c in _ms.find_contours(np.pad(f, 1), .5):
            c = c[:, ::-1] - 1
            r = resample(c, sp)
            if r is None or len(r) < 4:
                continue
            P = np.array(T.smooth([tuple(p) for p in r], 6))
            cv2.fillPoly(out, [np.round(P * 4).astype(np.int32)], 1, lineType=cv2.LINE_8, shift=2)
    return out.astype(bool)


def build_groups():
    G = {}
    for p in T.PARTS:
        k = (p['fig'], p['grp'])
        g = G.setdefault(k, {'fig': p['fig'], 'grp': p['grp'], 'layer': p['layer'], 'parts': []})
        g['layer'] = max(g['layer'], p['layer']); g['parts'].append(p)
    order = sorted(G.values(), key=lambda g: g['layer'])
    yy, xx = np.mgrid[0:h2, 0:w2].astype(float) * S
    global DET, SILF, SIL2
    DET = detail_relief()
    SILF = cv2.dilate(poly_mask(silhouette_pts(), 1.0, (H, W), n=1).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    SIL2 = cv2.resize(SILF.astype(np.uint8), (w2, h2), interpolation=cv2.INTER_AREA) > 0
    # visible regions found by the guided segmentation (seg2.py), when present: the outline of every form follows the real edges
    lab, keys = None, None
    try:
        lab = np.load('out/lab.npy'); keys = json.load(open('out/lab_keys.json'))
    except OSError:
        pass
    use_seg = bool(OPT.get('seg'))
    hand = {id(p): (swept(p)[2] if ('axis' in p or 'blob' in p) else poly_mask(p['pts'])) for g in order for p in g['parts']}
    vis = {}
    if lab is not None and use_seg:
        for p in T.PARTS:
            k = '%s.%s' % (p['fig'], p['name'])
            if k in keys:
                vis[id(p)] = lab == keys.index(k) + 3
    front = {}
    for g in order:
        for p in g['parts']:
            if id(p) not in vis:
                continue
            # under the forms drawn in front of it, a form keeps the extent of the hand tracing
            m = np.zeros((H, W), bool)
            for q in T.PARTS:
                if q['layer'] > p['layer'] and id(q) in vis:
                    m |= vis[id(q)]
            front[id(p)] = m
    for g in order:
        g['mask'] = np.zeros((H, W), bool)
        g['m2'] = np.zeros((h2, w2), bool)
        h = np.zeros((h2, w2))
        for p in g['parts']:
            if ('axis' in p or 'blob' in p) and id(p) not in vis:
                hp, m2, full = swept(p)
                g['m2'] |= m2; g['mask'] |= full; p['full'] = full
                h = smax(h, hp) if h.any() else hp
                continue
            if id(p) in vis:
                full = vis[id(p)] | (hand[id(p)] & front[id(p)])
                # the watershed follows every small edge: redraw the outline as an ample spline, like a moulded form
                full = spline_mask(full)
            else:
                full = hand[id(p)]
            p['full'] = full
            m2 = cv2.resize(full.astype(np.uint8), (w2, h2), interpolation=cv2.INTER_AREA) > 0
            g['m2'] |= m2
            g['mask'] |= full
            hp = inflate(m2) * S
            if 'axis' in p or 'blob' in p:
                # the volume of the sculpted form inside the outline of the reference: the tube where it reaches,
                # a gentle inflation of the outline elsewhere (so the edge of the form stays round)
                kh = swept(p)[0]
                hp = smax(kh * m2, float(OPT.get('fill', .45)) * hp * (kh.max() / max(hp.max(), 1e-6)), 8.0)
            else:
                # the full round section, compressed so that the crest stands amp above the ground (relief, not sculpture in the round)
                hp = hp * (AMPK * p['amp'] / max(hp.max(), 1e-6))
            h = smax(h, hp) if h.any() else hp
        soft = cv2.GaussianBlur(g['m2'].astype(float), (0, 0), 1.5)
        for b in T.BUMPS:
            if (b['fig'], b['on']) != (g['fig'], g['grp']):
                continue
            a = math.radians(b['a']); dx, dy = xx - b['x'], yy - b['y']
            u = (dx * math.cos(a) + dy * math.sin(a)) / b['rx']; v = (-dx * math.sin(a) + dy * math.cos(a)) / b['ry']
            r2 = np.clip(1 - (u * u + v * v), 0, 1)
            h += (1.6 if g['grp'] == 'visage' else 1.0) * b['amp'] * r2 * r2 * soft
        if g['grp'] == 'cheveux':
            h = h - hair_grooves(g['m2'], g['fig'])
        fk = 1.6 if g['grp'] == 'visage' else 1.0
        for l in T.LINES:
            if (l['fig'], l['on']) != (g['fig'], g['grp']):
                continue
            d = seg_dist(xx, yy, l['pts'])
            h -= fk * l['d'] * np.exp(-(d / (l['w'] * .5)) ** 2) * soft
        # nothing stands outside the measured silhouette of the vessel
        g['mask'] &= SILF; g['m2'] &= SIL2; h = h * SIL2
        if DET is not None:
            feather = np.clip(cv2.GaussianBlur(g['m2'].astype(np.float32), (0, 0), 3) * 2 - .6, 0, 1)
            h = h + DETAIL * DET * feather
        g['h'] = np.maximum(h, 0) * g['m2']
    if OPT.get('single'):
        # one continuous relief for the whole body: figures raised on a soft plateau, the measured relief on top
        figm = np.zeros((h2, w2), bool)
        if lab is not None:
            # the figures as the guided segmentation sees them (their visible extent, not the hand outlines)
            figm = cv2.resize((lab >= 3).astype(np.uint8), (w2, h2), interpolation=cv2.INTER_AREA) > 0
            figm = cv2.GaussianBlur(figm.astype(np.float32), (0, 0), 2) > .5
        else:
            for g in order:
                figm |= g['m2']
        sil = poly_mask(silhouette_pts(), 1 / S, (h2, w2), n=1)
        plate = cv2.GaussianBlur(figm.astype(np.float32), (0, 0), float(OPT.get('soft', 2.5)))
        h = float(OPT.get('plateau', 14)) * plate + inflate(figm) * S * float(OPT.get('infl', .12))
        if DET is not None:
            h = h + DETAIL * DET * np.clip(plate * 1.4, .25, 1)
        h = np.maximum(h - h[sil].min(), 0) * sil
        one = {'fig': 'all', 'grp': 'all', 'layer': 0, 'parts': [], 'm2': sil, 'h': h, 'plate': plate, 'figm': figm,
               'mask': poly_mask(silhouette_pts(), 1.0, (H, W), n=1)}
        return [one]
    return order


# ---------------------------------------------------------------- light: the shop's light on the modelled relief
PEARL = np.array([240., 232., 216.]); PATINA = np.array([180., 138., 90.]); DEEP = np.array([104., 76., 48.])


def frame():
    yy, xx = np.mgrid[0:h2, 0:w2].astype(float) * S
    cx = CX(yy); rg = RG(np.clip(yy, 205, 1115))
    sphi = np.clip((xx - cx) / rg, -.97, .97)
    return yy, xx, sphi, np.sqrt(1 - sphi ** 2), math.atan(144 / 910)


def normals(h, sphi, cphi, tau):
    gy, gx = np.gradient(h / S)
    nx, ny, nz = -gx, -gy, np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz); nx, ny, nz = nx / l, ny / l, nz / l
    x1 = nx * cphi + nz * sphi; z1 = -nx * sphi + nz * cphi
    y2 = ny * math.cos(tau) + z1 * math.sin(tau); z2 = -ny * math.sin(tau) + z1 * math.cos(tau)
    return x1, y2, z2


def cast_shadow(Hs):
    """soft shadow of the relief: march toward the light over the stacked heights"""
    d = np.array([L3[0], L3[1]]); d /= np.linalg.norm(d)
    slope = L3[2] / math.hypot(L3[0], L3[1])
    sh = np.zeros_like(Hs)
    for t in range(1, 48):
        # value at p of Hs(p + t d), d pointing toward the light
        Ht = cv2.warpAffine(Hs.astype(np.float32), np.float32([[1, 0, d[0] * t], [0, 1, d[1] * t]]), (w2, h2),
                            flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT)
        occ = Ht - (Hs + t * S * slope)
        sh = np.maximum(sh, occ / (3 + .35 * t * S))
    return np.clip(sh, 0, 1)


def colour_frost(n, nl, h, cav, conv, sh, yy, ground=False):
    """lightly frosted glass: milky and luminous everywhere, soft modelling, the sepia stain only in the narrow hollows,
    the thin edges of the forms lit from within"""
    nx, ny, nz = n
    dl = nx * L3[0] + ny * L3[1] + nz * L3[2]
    wl = np.clip((dl + .35) / 1.35, 0, 1)
    nh = np.clip(nx * HV[0] + ny * HV[1] + nz * HV[2], 0, 1)
    lit = wl * (1 - .35 * sh)
    # the thicker the glass, the warmer: thin parts stay a cool frosted grey, the cores of the reliefs turn cream
    th = np.clip(h / float(OPT.get('thick', 34)), 0, 1)[..., None]
    cool = np.array([221., 223., 225.]); warm = np.array([244., 230., 204.])
    glass = cool * (1 - th) + warm * th if not ground else np.array([214., 214., 212.])
    stain = np.array([168., 140., 106.])
    s = np.clip((cav - .3) / .6, 0, 1); s = s * s * (3 - 2 * s) * (.75 if not ground else .6)
    alb = glass * (1 - s[..., None]) + stain * s[..., None]
    I = .56 + .44 * lit + .06 * np.clip(nz, 0, 1)
    c = alb * I[..., None]
    rim = .22 * np.clip(1 - nz, 0, 1) ** 1.5 * (1 - s)
    sheen = .1 * nh ** 8 * (1 - sh)
    bounce = .08 * np.clip((yy - 800) / 500, 0, 1)
    c = c * (1 - rim[..., None]) + 255 * rim[..., None] + 255 * (sheen + bounce)[..., None]
    return np.clip(c, 0, 255)


def colour(n, nl, h, cav, conv, sh, yy, ground=False):
    if FROST:
        return colour_frost(n, nl, h, cav, conv, sh, yy, ground)
    """satin moulded glass, stained with sepia then wiped: the stain stays everywhere but on the front-facing crests"""
    nx, ny, nz = n
    dl = nx * L3[0] + ny * L3[1] + nz * L3[2]
    wl = np.clip((dl + .18) / 1.18, 0, 1)
    nh = np.clip(nx * HV[0] + ny * HV[1] + nz * HV[2], 0, 1)
    lit = wl * (1 - .6 * sh)
    wipe = np.clip(nl, 0, 1) ** 3 * np.clip((h - 2) / 14, 0, 1)
    pat = np.clip(float(OPT.get('pat0', .25)) - .2 * wipe - .06 * conv + .95 * cav, 0, 1)
    if ground:
        pat = np.ones_like(cav)
    deep = np.clip(cav - .55, 0, 1) / .45
    alb = PEARL * (1 - pat[..., None]) + PATINA * pat[..., None]
    if ground:
        deep = np.clip(.45 + .55 * cav, 0, 1)
    alb = alb * (1 - .6 * deep[..., None]) + DEEP * (.6 * deep[..., None])
    ao = 1 - .35 * np.clip(cav, 0, 1)
    I = (.3 + .52 * lit ** 1.1 + .34 * np.clip(nz, 0, 1) ** 2) * ao
    bounce = .2 * np.clip(ny + .25, 0, 1) * np.clip((yy - 700) / 600, 0, 1)
    spec = (.16 * nh ** 6 + .2 * nh ** 28) * (1 - sh) * (1 - .7 * pat)
    # light passing through the thin edges of the forms (satin glass): the rims glow instead of darkening
    fr = float(OPT.get('rim', .42)) * np.clip(1 - nz, 0, 1) ** 1.6 * (1 - np.clip(cav * 1.5, 0, 1))
    c = alb * I[..., None] + 255 * (spec + bounce * .6)[..., None]
    # light scattered inside the satin glass: the shadows stay warm and luminous
    glow = .26 * (1 - np.clip(lit, 0, 1)) * (1 - .4 * np.clip(cav, 0, 1))
    c = c + np.array([226., 186., 132.]) * glow[..., None]
    c = c * (1 - fr[..., None]) + np.array([240., 230., 212.]) * fr[..., None]
    return np.clip(c, 0, 255)


def light(order):
    yy, xx, sphi, cphi, tau = frame()
    Hs = np.zeros((h2, w2))
    for g in order:
        Hs += g['h']
    cav = np.clip((cv2.GaussianBlur(Hs, (0, 0), 3) - Hs) / 4, 0, 1) * .5 + np.clip((cv2.GaussianBlur(Hs, (0, 0), 9) - Hs) / 8, 0, 1) * .5         + np.clip((cv2.GaussianBlur(Hs, (0, 0), 24) - Hs) / 14, 0, 1) * .45
    conv = (Hs - cv2.GaussianBlur(Hs, (0, 0), 4)) / 2
    sh = cast_shadow(Hs)
    for g in order:
        n = normals(g['h'], sphi, cphi, tau)
        gy, gx = np.gradient(g['h'] / S)
        nl = 1 / np.sqrt(1 + gx * gx + gy * gy)
        g['col'] = colour(n, nl, g['h'], cav, conv, sh, yy)
    zero = np.zeros((h2, w2))
    gcol = colour(normals(zero, sphi, cphi, tau), np.ones_like(zero), zero, cav, conv, sh, yy, ground=True)
    if not FROST:
        grade(order, gcol)
    return gcol, Hs, sh, cav


def grade(order, gcol):
    """tones calibrated on the reference: the lightness is matched by distribution, the colour at each lightness is the
    reference's own (sampled separately on the figures and on the ground, above the glow of the table)"""
    try:
        ref = cv2.imread(REF)[:, :, ::-1].astype(np.float32)
        lab = np.load('out/lab.npy')
    except Exception:
        return
    ref = cv2.resize(ref, (w2, h2), interpolation=cv2.INTER_AREA)
    lab = cv2.resize(lab.astype(np.int16), (w2, h2), interpolation=cv2.INTER_NEAREST)
    Yr = ref @ np.array([.3, .59, .11], np.float32)
    yy = np.mgrid[0:h2, 0:w2][0] * S
    top = (yy > 200) & (yy < 1000)
    vis_col = np.zeros((h2, w2, 3)); fig = np.zeros((h2, w2), bool)
    single = len(order) == 1 and 'plate' in order[0]
    if single:
        # one field graded twice (as figure, as ground) and blended by the soft plateau of the figures
        g0 = order[0]; fig = g0['figm']
        vis_col = g0['col']; gcol[...] = g0['col']
        fcol = g0['col'].copy(); order = [{'col': fcol, 'm2': g0['m2']}]
    else:
        for g in order:
            vis_col[g['m2']] = g['col'][g['m2']]; fig |= g['m2']
    for cls, sel_ref, sel_our, targets in (('fig', (lab >= 3) & top, fig & top, [g['col'] for g in order]),
                                           ('ground', (lab == 2) & top, (lab == 2) & top, [gcol])):
        if sel_ref.sum() < 500 or sel_our.sum() < 500:
            continue
        src = (vis_col if cls == 'fig' else gcol)[sel_our] @ np.array([.3, .59, .11])
        q = np.linspace(0, 100, 101)
        ps, pr = np.percentile(src, q), np.percentile(Yr[sel_ref], q)
        # colour of the reference at each lightness (bins of 6)
        bins = np.arange(0, 262, 6.0)
        idx = np.digitize(Yr[sel_ref], bins)
        cols = np.array([ref[sel_ref][idx == i].mean(0) if (idx == i).sum() > 20 else [np.nan] * 3 for i in range(1, len(bins))])
        mids = bins[:-1] + 3
        ok = ~np.isnan(cols[:, 0])
        if cls == 'ground':
            # the visible ground of the reference: dark sepia hollows, lighter crumbs (sampled on its open patches)
            ramp = np.array([[0, 58, 44, 32], [.4, 96, 78, 58], [.8, 138, 116, 88], [1, 178, 160, 132]])
            for t in targets:
                Y = t @ np.array([.3, .59, .11])
                u = np.interp(Y, ps, q / 100)
                t[...] = np.stack([np.interp(u, ramp[:, 0], ramp[:, k]) for k in (1, 2, 3)], -1)
            continue
        for t in targets:
            Y = t @ np.array([.3, .59, .11])
            Ym = np.interp(Y, ps, pr)
            c = np.stack([np.interp(Ym, mids[ok], cols[ok, k]) for k in range(3)], -1)
            cy = c @ np.array([.3, .59, .11])
            t[...] = np.clip(c * (Ym / np.maximum(cy, 1))[..., None], 0, 255)
    if single:
        w = np.clip(g0['plate'] * 1.15, 0, 1)[..., None]
        g0['col'][...] = fcol * w + gcol * (1 - w)


# ---------------------------------------------------------------- vector writing: outlines and nested tone bands
from skimage import measure


def extend(f, m, margin=8):
    """carry a field past the edge of its mask (mean of the known neighbours, ring by ring)"""
    f = f.astype(np.float32).copy(); m = m.copy()
    k = np.ones((3, 3), np.uint8)
    for _ in range(margin):
        dil = cv2.dilate(m.astype(np.uint8), k).astype(bool)
        ring = dil & ~m
        if not ring.any():
            break
        den = cv2.blur(m.astype(np.float32), (3, 3))
        chans = [f] if f.ndim == 2 else [f[..., i] for i in range(f.shape[2])]
        for ci, ch in enumerate(chans):
            num = cv2.blur(np.where(m, ch, 0).astype(np.float32), (3, 3))
            v = np.where(ring, num / np.maximum(den, 1e-6), ch)
            if f.ndim == 2:
                f = v
            else:
                f[..., ci] = v
        m = dil
    return f, m


def resample(c, step):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(c, axis=0).T))]
    if d[-1] < step * 3:
        return None
    n = max(4, int(d[-1] / step))
    t = np.linspace(0, d[-1], n, endpoint=False)
    return np.c_[np.interp(t, d, c[:, 0]), np.interp(t, d, c[:, 1])]


def fmt(v):
    s = ('%.2f' % v).rstrip('0').rstrip('.')
    if s.startswith('0.'):
        s = s[1:]
    elif s.startswith('-0.'):
        s = '-' + s[2:]
    return '0' if s in ('', '-0', '-') else s


def nums(vals):
    out, prev = '', ''
    for v in vals:
        s = fmt(v)
        if out and not (s[0] == '-' or (s[0] == '.' and '.' in prev)):
            out += ' '
        out += s; prev = s
    return out


def bspline_path(P, q, mapf):
    """closed quadratic B-spline through the midpoints of P (control points), as M Q t t t ... z"""
    P = np.array([mapf(x, y) for x, y in P])
    P = np.round(P / q) * q
    keep = [0]
    for i in range(1, len(P)):
        if np.abs(P[i] - P[keep[-1]]).max() > 1e-9:
            keep.append(i)
    P = P[keep]
    if len(P) < 3:
        return ''
    M = (P + np.roll(P, -1, axis=0)) / 2          # M[i] = mid(P[i], P[i+1])
    s = 'M' + nums(M[-1]) + 'Q' + nums(np.r_[P[0], M[0]])
    prev = M[0]
    for i in range(1, len(P)):
        s += 't' + nums(M[i] - prev); prev = M[i]
    return s + 'z'


RDP_EPS = 0.0
FIT_EPS = 0.0
AREA_MIN = 0.0


def rdp_closed(P, eps):
    """Douglas-Peucker on a closed polyline (keeps the two farthest points as anchors)"""
    if eps <= 0 or len(P) < 8:
        return P
    def rdp(Q):
        a, b = Q[0], Q[-1]
        v = b - a; L = np.hypot(*v) or 1e-9
        d = np.abs((Q[:, 0] - a[0]) * v[1] - (Q[:, 1] - a[1]) * v[0]) / L
        i = int(np.argmax(d))
        if d[i] <= eps or len(Q) < 3:
            return np.array([a, b])
        return np.vstack([rdp(Q[:i + 1])[:-1], rdp(Q[i:])])
    j = int(np.argmax(np.hypot(*(P - P[0]).T)))
    A = rdp(P[:j + 1]); B = rdp(np.vstack([P[j:], P[:1]]))
    return np.vstack([A[:-1], B[:-1]])


def cubic_path(P, q, mapf, eps):
    """closed path of cubic Beziers fitted within eps (in the output units), relative commands, rounded without drift"""
    import bezfit
    Q = np.array([mapf(x, y) for x, y in P])
    segs = bezfit.fit_closed(Q, eps)
    if not segs:
        return ''
    R = lambda p: np.round(np.asarray(p) / q) * q
    cur = R(segs[0][0])
    s = 'M' + nums(cur)
    for c in segs:
        p1, p2, p3 = R(c[1]), R(c[2]), R(c[3])
        s += 'c' + nums(np.r_[p1 - cur, p2 - cur, p3 - cur])
        cur = p3
    return s + 'z'


def contour_paths(field, level, step, q, mapf, scale):
    """closed iso-lines of a field (outside = below every level), as one even-odd path"""
    F = np.pad(field, 2, constant_values=-1e3)
    d = ''
    for c in measure.find_contours(F, level):
        c = (c[:, ::-1] - 2) * scale            # (x, y) in reference pixels
        if AREA_MIN > 0 and abs(.5 * np.sum(c[:-1, 0] * c[1:, 1] - c[1:, 0] * c[:-1, 1])) < AREA_MIN:
            continue                             # specks too small to be seen at the shop's size
        r = resample(c, step)
        if r is None:
            continue
        if FIT_EPS > 0:
            d += cubic_path(r, q, mapf, FIT_EPS)
            continue
        if RDP_EPS > 0:
            r = rdp_closed(r, RDP_EPS)
            if len(r) < 3:
                continue
        d += bspline_path(r, q, mapf)
    return d


def hexc(c):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in np.clip(c, 0, 255))


def bands(col, mask, mapf, q, step, dy=11.0, minpx=10):
    """the tone bands of a coloured field inside its mask: [(colour, path)], darkest first"""
    Y = col @ np.array([.3, .59, .11])
    Ye, me = extend(Y, mask, 6)
    ce, _ = extend(col, mask, 6)
    vals = Y[mask]
    if vals.size < minpx:
        return []
    lo, hi = np.percentile(vals, 1), np.percentile(vals, 99.5)
    levels = np.arange(math.floor(lo / dy) * dy + dy, hi, dy)
    out = []
    edges = [-1e9] + list(levels) + [1e9]
    for k in range(len(edges) - 1):
        sel = mask & (Y >= edges[k]) & (Y < edges[k + 1])
        if sel.sum() < 2:
            sel = me & (Ye >= edges[k]) & (Ye < edges[k + 1])
        if sel.sum() < 2:
            continue
        c = ce[sel].mean(0)
        if k == 0:
            out.append((hexc(c), None))
            continue
        F = np.where(me, Ye, -1e3)
        d = contour_paths(F, edges[k], step, q, mapf, S)
        if d:
            out.append((hexc(c), d))
    return out


# ---------------------------------------------------------------- camera of the photograph (fitted on the ellipses of the lip and the foot)
CAM = dict(f=2519.0, D=55.4, hc=21.8, y0=249.0)      # focal in px, distance and eye height in cm, horizon row
HV_CM = 24.5                                          # height of the vessel
R_LIP, R_FOOT, H_BAND, H_FOOT = 9.35, 6.25, 22.77, 1.49


def cam(R, th, h, cx=607.0):
    Z = R * math.cos(th)
    k = CAM['f'] / (CAM['D'] - Z)
    return cx + k * R * math.sin(th), CAM['y0'] + k * (CAM['hc'] - h)


def ring(R, h, n=48, cx=607.0):
    """visible front arc of a horizontal circle, left to right"""
    tt = math.acos(min(.999, R / CAM['D']))
    return [cam(R, -tt + 2 * tt * i / n, h, cx) for i in range(n + 1)]


def rim_foot_svg(mapf, q):
    def d_of(pts):
        return 'M' + 'L'.join(nums(np.round(np.array(mapf(*p)) / q) * q) for p in pts) + 'z'
    lip_top, lip_bot = ring(R_LIP, HV_CM, cx=608), ring(R_LIP - .02, H_BAND, cx=608)
    f_top, f_bot = ring(R_FOOT, H_FOOT, cx=604.5), ring(R_FOOT, 0, cx=604.5)
    return {'lip': d_of(lip_top + lip_bot[::-1]), 'foot': d_of(f_top + f_bot[::-1]),
            'lip_top': lip_top, 'lip_bot': lip_bot, 'foot_top': f_top, 'foot_bot': f_bot}


# ---------------------------------------------------------------- assembly
def main():
    mapf = (lambda x, y: (x, y)) if PROJ == 'photo' else SHOP_MAP
    q = 1.0 if PROJ == 'photo' else .2
    step = 7.0
    order = build_groups()
    print('relief %.1fs' % (time.time() - t0), len(order), 'groups')
    gcol, Hs, sh, cav = light(order)
    print('light %.1fs' % (time.time() - t0))
    # the body: the measured silhouette below the lip band, above the foot
    sil = silhouette_pts()
    silm2 = poly_mask(sil, 1 / S, (h2, w2), n=1)
    rf = rim_foot_svg(mapf, q)
    defs, body = [], []
    blur = float(OPT.get('blur', 2.6)) if PROJ == 'photo' else .33
    defs.append('<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % fmt(blur))
    # ground of the body
    silpath = 'M' + 'L'.join(nums(np.round(np.array(mapf(x, y)) / q) * q) for x, y in sil[::2]) + 'z'
    defs.append('<clipPath id="cb"><path d="%s"/></clipPath>' % silpath)
    gb = bands(gcol, silm2 & ~np.zeros_like(silm2), mapf, q, step * 1.4, dy=12)
    body.append('<g clip-path="url(#cb)"><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g></g>' % (
        gb[0][0], silpath, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in gb[1:])))
    defs.append('<linearGradient id="gline" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8c6c4a" stop-opacity=".12"/>'
                '<stop offset=".55" stop-color="#7a5a3a" stop-opacity=".42"/><stop offset="1" stop-color="#6a4a2c" stop-opacity=".6"/></linearGradient>')
    # the stippled ground: procedural noise turned into small lit bumps (light tops, dark undersides), no image
    k = 1.0 if PROJ == 'photo' else SHOP_K
    defs.append(('<filter id="tx" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="%s" y="%s" width="%s" height="%s">'
                 '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="4" seed="11" result="n"/>'
                 '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 0 0 0 -5.1" result="a"/>'
                 '<feOffset in="a" dx="%s" dy="%s" result="ad"/><feFlood flood-color="#2a1b0c" flood-opacity=".5"/><feComposite in2="ad" operator="in" result="d"/>'
                 '<feOffset in="a" dx="%s" dy="%s" result="al"/><feFlood flood-color="#ecdcc0" flood-opacity=".38"/><feComposite in2="al" operator="in" result="l"/>'
                 '<feMerge><feMergeNode in="d"/><feMergeNode in="l"/></feMerge></filter>')
                % (fmt(0), fmt(0), fmt(1200 * k), fmt(1435 * k), fmt(.1 / k), fmt(1.6 * k), fmt(1.9 * k), fmt(-.5 * k), fmt(-.6 * k)))
    body.append('<rect width="%s" height="%s" fill="#000" filter="url(#tx)" clip-path="url(#cb)" opacity="%s"/>' % (
        fmt(1200 * k), fmt(1435 * k), '.22' if FROST else '.8'))
    nb = 0
    for i, g in enumerate(order):
        m = g['m2']
        # crisp outline of the group, from its full-resolution mask
        mf = cv2.GaussianBlur(g['mask'].astype(np.float32), (0, 0), .8)
        od = contour_paths(mf, .5, 4.0, q, mapf, 1.0)
        if not od:
            continue
        cid = 'c%d' % i
        defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, od))
        bb = bands(g['col'], m, mapf, q, step, dy=float(OPT.get('dy', 11)))
        nb += len(bb)
        body.append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g></g>' % (
            cid, bb[0][0], od, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
        if FROST:
            body.append('<path fill="none" stroke="url(#gline)" stroke-width="%s" d="%s"/>' % (fmt(1.5 if PROJ == 'photo' else .19), od))
        else:
            body.append('<path fill="none" stroke="#5a4632" stroke-opacity=".28" stroke-width="%s" d="%s"/>' % (
                fmt(1.1 if PROJ == 'photo' else .14), od))
    # lip band and foot ring: frosted glass, grey-blue, lighter at the top lip
    defs.append('<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe3e6"/>'
                '<stop offset=".08" stop-color="#b9bfc4"/><stop offset=".45" stop-color="#9aa1a7"/><stop offset=".62" stop-color="#b3b8bc"/>'
                '<stop offset="1" stop-color="#8e9296"/></linearGradient>')
    defs.append('<linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".32"/>'
                '<stop offset=".22" stop-color="#fff" stop-opacity=".12"/><stop offset=".55" stop-color="#000" stop-opacity="0"/>'
                '<stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>')
    defs.append('<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ccc9"/>'
                '<stop offset=".25" stop-color="#9ea4a8"/><stop offset="1" stop-color="#b4bbc0"/></linearGradient>')
    body.append('<path fill="url(#gl)" d="%s"/><path fill="url(#gs)" d="%s"/>' % (rf['lip'], rf['lip']))
    body.append('<path fill="url(#gf)" d="%s"/><path fill="url(#gs)" d="%s"/>' % (rf['foot'], rf['foot']))
    vb = '0 0 1200 1435' if PROJ == 'photo' else SHOP_VB
    back = ('<rect width="1200" height="915" fill="#0b0b0b"/><rect y="915" width="1200" height="520" fill="#f4f4f2"/>'
            if PROJ == 'photo' else '')
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>'
           % (vb, ''.join(defs), back, ''.join(body)))
    open('out/vase_%s.svg' % PROJ, 'w').write(svg)
    print('svg %d bytes, %d groups, %d bands, %.1fs' % (len(svg), len(order), nb, time.time() - t0))


if __name__ == '__main__':
    main()
