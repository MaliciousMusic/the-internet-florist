"""apparence.py: the appearance of one petal or tepal, measured in its own frame (along v from base to tip, across u from edge to edge), on a
photograph and on a render alike, so that the two compare region by region (BONNES-PRATIQUES §11: the bar is the photo). No model, no browser.

  python fleur/apparence.py piece <img> <frame> [--out <base>] [--bg photo|render] [--masque m.png] [--carte dir [--albedo]]
  python fleur/apparence.py compare <photo.json> <render.json> [--out <base>]
  python fleur/apparence.py paire <photo> <frame> <render> <frame> --out <base>      (both pieces, then compare)
  python fleur/apparence.py grille <out.json> <map.npy>...                           (the measured colour grid of a piece)

<frame> = "x,y;x,y;...;w": points on the piece's midrib from its base to its tip (two for a straight piece, more for a bent one: a spline
through them), then its half-width at its widest (pixels of the image).
The piece is sampled about one pixel per cell; each row keeps the run of the piece that holds the axis (a mask: the uniform background of a
render, a GrabCut of the photo seeded by the frame), clipped to the half-width, then resampled from its own left edge to its right edge, so u is
the piece's own across (-1 left edge, 0 axis, +1 right edge) as in the engine's Sf(u, v).

Measures (fleur/APPARENCE.md): the median colour (CIELAB, hex) of 12 regions (v: gorge 0-.2, corps .2-.55, haut .55-.85, pointe .85-1;
u: axe |u|<.25, milieu .25-.7, marge >.7); per region the tone contrast (std of L*), the fine grain (std of L* minus its 3 px blur), the
chroma; the vein count across the width and their strength (spectrum of the rows, across u); the dark spots (count, density per zone, size,
colour); the light (L* along the axis, across the body); the margin against the middle (whiter, paler: thin tissue).
compare writes <base>.txt (a table in French, one line per region, a verdict each), <base>.json and <base>.png (photo map | render map |
ΔE2000 map, in the piece's frame). Outputs that hold photo pixels stay in refcache/ (never committed)."""
import sys, os, json, argparse
import numpy as np
from scipy import ndimage as ndi
from PIL import Image
from skimage import color

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
VZ = [('gorge', 0, .2), ('corps', .2, .55), ('haut', .55, .85), ('pointe', .85, 1.0)]
UZ = [('axe', 0, .25), ('milieu', .25, .7), ('marge', .7, 1.01)]
DE_OK, DE_NEAR = 3.0, 6.0          # CIEDE2000: under 3 hardly seen side by side, under 6 close, beyond a visible difference
TEX_LO, TEX_HI = .7, 1.4           # render/photo ratio of contrast and grain: outside, too smooth or too busy
SPOT_DL, SPOT_A = 7.0, (3, 900)
CORE_DE = 28.0                     # a photo pixel belongs to the piece when it is this close (CIE76) to one of its core colours    # a spot: L* under its 4 px neighbourhood by this much, area in px


def parse_frame(s):
    """"x,y;x,y;...;w": points ON the piece's midrib from its base to its tip (two for a straight piece, more for a bent or S-shaped one),
    then its half-width at its widest (pixels)"""
    q = s.split(';')
    return [np.array([float(x) for x in a.split(',')]) for a in q[:-1]], float(q[-1])


def curve(pts, n):
    """n points of the axis (a smooth spline through the given points, by arc length), their unit normals"""
    from scipy.interpolate import splprep, splev
    P0 = np.array(pts, float)
    v = (np.arange(n) + .5) / n
    if len(P0) == 2:
        P = P0[0] + v[:, None] * (P0[1] - P0[0])
        D = np.repeat((P0[1] - P0[0])[None, :], n, 0)
    else:
        t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P0, axis=0), axis=1))])
        tck, _ = splprep([P0[:, 0], P0[:, 1]], u=t / t[-1], k=min(3, len(P0) - 1), s=0)
        P = np.stack(splev(v, tck), 1)
        D = np.stack(splev(v, tck, der=1), 1)
    D = D / np.linalg.norm(D, axis=1)[:, None]
    N = np.stack([-D[:, 1], D[:, 0]], 1)
    return v, P, N


def frame_uv(pts, w, X, Y):
    """v and u of every pixel (X, Y) in the frame: v of the nearest axis point, u its signed distance over w"""
    from scipy.spatial import cKDTree
    v, P, N = curve(pts, 600)
    q = np.stack([X.ravel(), Y.ravel()], 1)
    d, i = cKDTree(P).query(q)
    sgn = np.sign(((q - P[i]) * N[i]).sum(1))
    vv = v[i].copy()
    vv[(i == 0) & (((q - P[0]) * (P[1] - P[0])).sum(1) < 0)] = -1  # before the base or past the tip: outside
    vv[(i == len(v) - 1) & (((q - P[-1]) * (P[-1] - P[-2])).sum(1) > 0)] = 2
    return vv.reshape(X.shape), (sgn * d / max(1, w)).reshape(X.shape)


def load(p):
    im = Image.open(p).convert('RGB')
    return np.asarray(im).astype(np.float64) / 255.0


def mask_of(rgb, pts, w, kind):
    """the piece's pixels: uniform background of a render (its corner colour), or a GrabCut of the photo seeded by the frame"""
    H, W = rgb.shape[:2]
    import cv2
    _, P, _ = curve(pts, 50)
    pad = w * 1.6 + 10
    x0, y0 = np.maximum(0, P.min(0) - pad).astype(int)
    x1, y1 = np.minimum([W, H], P.max(0) + pad).astype(int)
    yy, xx = np.mgrid[y0:y1, x0:x1]
    v, u = frame_uv(pts, w, xx.astype(float), yy.astype(float))
    if kind == 'render':  # the uniform ground of a render (its corner colour)
        bg = np.median(np.concatenate([rgb[:4, :4].reshape(-1, 3), rgb[:4, -4:].reshape(-1, 3), rgb[-4:, :4].reshape(-1, 3), rgb[-4:, -4:].reshape(-1, 3)]), 0)
        fg = np.abs(rgb[y0:y1, x0:x1] - bg).sum(2) > 18 / 255.0
        fg = ndi.binary_erosion(fg, iterations=2)  # the soft edge (blur, antialiasing) mixes the ground in: kept out, as the photo's GrabCut keeps it out
    else:
        crop = (rgb[y0:y1, x0:x1] * 255).astype(np.uint8)[:, :, ::-1].copy()
        m = np.full(crop.shape[:2], cv2.GC_BGD, np.uint8)
        m[(v > -.08) & (v < 1.1) & (np.abs(u) < 1.4)] = cv2.GC_PR_BGD
        m[(v > -.02) & (v < 1.03) & (np.abs(u) < 1.0)] = cv2.GC_PR_FGD
        m[(v > .1) & (v < .92) & (np.abs(u) < .3)] = cv2.GC_FGD
        bgm, fgm = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut(crop, m, None, bgm, fgm, 5, cv2.GC_INIT_WITH_MASK)
        fg = (m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)
    # GrabCut glues a touching stem or leaf (or the dark ground) to the piece: a pixel stays when it is within CORE_DE of the colours the piece
    # has at the same height, taken in small discs ON the axis (the frame's base, middle and tip are placed on the midrib)
    lab = color.rgb2lab(rgb[y0:y1, x0:x1])
    vd = np.array([.08, .22, .38, .5, .62, .78, .92])
    _, Pd, _ = curve(pts, 400)
    cens = []
    for vq in vd:
        c = Pd[min(399, int(vq * 400))]
        disc = (xx - c[0]) ** 2 + (yy - c[1]) ** 2 < (.22 * w) ** 2
        smp = lab[disc]
        if len(smp) < 20:
            cens.append(None)
            continue
        _, _, cen = cv2.kmeans(smp.astype(np.float32), 3, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, .5), 2, cv2.KMEANS_PP_CENTERS)
        cens.append(cen)
    near = np.full(fg.shape, np.inf)
    for k, cen in enumerate(cens):
        if cen is None:
            continue
        lo = vd[k - 1] if k else -1
        hi = vd[k + 1] if k + 1 < len(vd) else 2
        z = (v >= lo) & (v <= hi)  # the discs of the same height and its two neighbours
        if z.any():
            d = np.min(np.linalg.norm(lab[z][:, None, :] - cen[None, :, :], axis=2), axis=1)
            near[z] = np.minimum(near[z], d)
    fg &= near < CORE_DE
    fg = ndi.binary_opening(fg, iterations=1)
    lb, n_ = ndi.label(fg)
    if n_ > 1:
        ax_in = lb[(v > .2) & (v < .8) & (np.abs(u) < .1)]
        ax_in = ax_in[ax_in > 0]
        if len(ax_in):
            fg = lb == np.bincount(ax_in).argmax()
    out = np.zeros((H, W), bool)
    out[y0:y1, x0:x1] = fg
    return out


def sample_piece(rgb, msk, pts, w, zf=None):
    """the piece in its own frame: an NV x NU map of RGB (NaN outside), u from its own left edge to its right edge. With zf (the depth in
    pixels at image points, from carte.py), u and v follow the piece's length in 3D: a part tilted away is not squeezed (foreshortening)"""
    _, P0, _ = curve(pts, 200)
    L = float(np.linalg.norm(np.diff(P0, axis=0), axis=1).sum())
    NV = int(np.clip(round(L), 40, 600))
    NW = int(np.clip(round(2.5 * w), 24, 400))   # the dense row, wider than the piece
    NU = int(np.clip(round(2 * w), 16, 240))
    ws = np.linspace(-1.25, 1.25, NW)
    _, P, N = curve(pts, NV)
    X = P[:, 0][:, None] + ws[None, :] * w * N[:, 0][:, None]
    Y = P[:, 1][:, None] + ws[None, :] * w * N[:, 1][:, None]
    ch = [ndi.map_coordinates(rgb[:, :, k], [Y, X], order=1, mode='nearest') for k in range(3)]
    mk = ndi.map_coordinates(msk.astype(float), [Y, X], order=0, mode='constant', cval=0) > .5
    mk &= np.abs(ws)[None, :] <= 1.0
    out = np.full((NV, NU, 3), np.nan)
    hw = np.zeros(NV)
    c0 = np.argmin(np.abs(ws))
    ab = np.full((NV, 2), np.nan)
    for j in range(NV):
        row = mk[j]
        if not row[c0]:
            near = np.nonzero(row)[0]
            if not len(near) or np.min(np.abs(near - c0)) > NW * .06:
                continue
            c = near[np.argmin(np.abs(near - c0))]
        else:
            c = c0
        a = c
        while a > 0 and row[a - 1]:
            a -= 1
        b = c
        while b < NW - 1 and row[b + 1]:
            b += 1
        if b - a >= 2:
            ab[j] = a, b
    # the edges: a petal's outline is a smooth curve. Each edge is fitted along the piece (a Gaussian of about NV/25 rows) and the rows that
    # leave it (a run leaking into a neighbour, a bite of an overlapping piece) are dropped and the fit made again, three times; the map is then
    # resampled between the smooth edges, and a cell outside the piece's mask (a hidden part, a hole) stays empty, never stretched
    good = ~np.isnan(ab[:, 0])
    rej = np.zeros(NV, bool)
    if good.sum() > 5:
        sig = max(2.0, NV / 25)
        for q in (0, 1):
            keep = good.copy()
            for _ in range(3):
                idx = np.nonzero(keep)[0]
                col = np.interp(np.arange(NV), idx, ab[idx, q])
                sm = ndi.gaussian_filter1d(col, sig, mode='nearest')
                res = np.abs(ab[:, q] - sm)
                tol = max(2.0, np.nanpercentile(res[keep], 75) * 2.5)
                nk = good & (res <= tol)
                if nk.sum() < max(6, good.sum() * .4) or (nk == keep).all():
                    break
                keep = nk
            rej |= good & ~keep
            ab[:, q] = np.where(good | ((np.arange(NV) > np.nonzero(good)[0][0]) & (np.arange(NV) < np.nonzero(good)[0][-1])), sm, np.nan)
    mid = np.full((NV, 2), np.nan)
    for j in range(NV):
        if np.isnan(ab[j, 0]):
            continue
        a, b = ab[j]
        cm = (a + b) / 2
        mid[j] = np.interp(cm, np.arange(NW), X[j]), np.interp(cm, np.arange(NW), Y[j])
        hw[j] = (b - a) / (NW - 1) * 2.5 / 2
        t = np.linspace(a, b, NU)
        if zf is not None:  # across: equal steps of 3D length from edge to edge
            cc = np.linspace(a, b, max(8, int(b - a) + 1)); xs = np.interp(cc, np.arange(NW), X[j]); ys = np.interp(cc, np.arange(NW), Y[j]); zs = zf(xs, ys)
            sl = np.concatenate([[0], np.cumsum(np.sqrt(np.diff(xs) ** 2 + np.diff(ys) ** 2 + np.diff(zs) ** 2))])
            if sl[-1] > 0: t = np.interp(np.linspace(0, sl[-1], NU), sl, cc)
        inside = np.interp(t, np.arange(NW), mk[j].astype(float)) > .5
        for k in range(3):
            out[j, :, k] = np.where(inside, np.interp(t, np.arange(NW), ch[k][j]), np.nan)
    meta = dict(NV=NV, NU=NU, len_px=float(L), w_px=float(w), width_profile=[round(float(x), 3) for x in hw[::max(1, NV // 20)]],
                bord_rejets=round(float(rej.sum() / max(1, good.sum())), 3), rangs=round(float(good.mean()), 3),
                plein_cadre=round(float((hw[good] > .98 * 1.25).mean()) if good.any() else 0, 3))
    if zf is not None and (~np.isnan(mid[:, 0])).sum() > 5:  # along: rows at equal steps of 3D length of the midrib
        ok = ~np.isnan(mid[:, 0]); idx = np.nonzero(ok)[0]; zm = zf(mid[idx, 0], mid[idx, 1])
        sl = np.concatenate([[0], np.cumsum(np.sqrt(np.diff(mid[idx, 0]) ** 2 + np.diff(mid[idx, 1]) ** 2 + np.diff(zm) ** 2))])
        jj = np.round(np.interp(np.linspace(0, sl[-1], len(idx)), sl, idx)).astype(int)
        lo = idx[0]; out2 = np.full_like(out, np.nan); out2[lo:lo + len(jj)] = out[jj]; out = out2
        meta['len_3d_px'] = round(float(sl[-1]), 1); meta['raccourci'] = round(float(sl[-1] / max(1, np.linalg.norm(np.diff(mid[idx], axis=0), axis=1).sum())), 3)
    return out, meta, mid, hw


def refit(pts, w, mid, hw):
    """the axis set again through the middles of the piece's rows (a frame placed by eye that runs along an edge is corrected), and the
    half-width from the rows: (pts, w) for the second pass"""
    ok = ~np.isnan(mid[:, 0])
    if ok.sum() < 10:
        return pts, w
    idx = np.nonzero(ok)[0]
    sm = np.stack([ndi.median_filter(mid[idx, k], size=max(5, len(idx) // 12) | 1) for k in (0, 1)], 1)
    pick = idx[np.linspace(0, len(idx) - 1, 7).round().astype(int)]
    new = [sm[np.searchsorted(idx, j)] for j in pick]
    return new, float(max(8, np.percentile(hw[ok], 95) * w * 1.08))


def measure(rgbmap, meta):
    ok = ~np.isnan(rgbmap[:, :, 0])
    lab = color.rgb2lab(np.nan_to_num(rgbmap))
    Lm = lab[:, :, 0]
    NV, NU = ok.shape
    vv = (np.arange(NV) + .5) / NV
    uu = np.abs(np.linspace(-1, 1, NU))
    V, U = np.meshgrid(vv, uu, indexing='ij')
    # the grain: L* minus its blur of ~3 px (the map is about 1 px per cell), inside the piece only
    Lf = np.where(ok, Lm, np.nanmedian(np.where(ok, Lm, np.nan)))
    hp = Lf - ndi.gaussian_filter(Lf, 1.5)
    trend = ndi.gaussian_filter(Lf, 6)
    reg = {}
    for vn, v0, v1 in VZ:
        for un, u0, u1 in UZ:
            s = ok & (V >= v0) & (V < v1) & (U >= u0) & (U < u1)
            if s.sum() < 12:
                continue
            med = np.median(lab[s], 0)
            rgb = color.lab2rgb(med[None, None, :])[0, 0]
            reg['%s/%s' % (vn, un)] = dict(lab=[round(float(x), 2) for x in med], hex='#%02x%02x%02x' % tuple(int(round(np.clip(x, 0, 1) * 255)) for x in rgb),
                                          contraste=round(float(np.std(Lm[s] - trend[s])), 2), grain=round(float(np.std(hp[s])), 2),
                                          chroma=round(float(np.hypot(med[1], med[2])), 1), n=int(s.sum()))
    # veins: across-u spectrum of the body rows (corps + haut), the trend removed
    body = [j for j in range(NV) if .2 <= vv[j] < .85 and ok[j].sum() > NU * .8]
    veins = dict(n=0, force=0.0)
    if len(body) > 4:
        P = np.zeros(NU // 2 + 1)
        for j in body:
            r = np.where(ok[j], Lm[j], np.nan)
            r = np.interp(np.arange(NU), np.nonzero(~np.isnan(r))[0], r[~np.isnan(r)])
            r = r - ndi.gaussian_filter1d(r, max(2, NU / 10))
            P += np.abs(np.fft.rfft(r * np.hanning(NU))) ** 2
        P /= len(body)
        lo, hi = 4, max(5, NU // 3)  # from 4 veins across the width to one vein every 3 cells
        k = lo + int(np.argmax(P[lo:hi]))
        veins = dict(n=int(k), force=round(float(np.sqrt(P[k] / NU)), 2), spectre=[round(float(x), 1) for x in np.sqrt(P[:hi] / NU)])
    # dark spots: under their neighbourhood by SPOT_DL, a few px to a few hundred
    loc = ndi.median_filter(Lf, size=9)
    dk = ok & (Lm < loc - SPOT_DL)
    lb, nl = ndi.label(dk)
    spots = []
    if nl:
        areas = ndi.sum(np.ones_like(Lm), lb, range(1, nl + 1))
        cms = ndi.center_of_mass(np.ones_like(Lm), lb, range(1, nl + 1))
        for i, (a, (cy, cx)) in enumerate(zip(areas, cms)):
            if SPOT_A[0] <= a <= SPOT_A[1]:
                spots.append((float(cy) / NV, float(cx) / NU * 2 - 1, float(a)))
    sd = {}
    for vn, v0, v1 in VZ:
        z = ok & (V >= v0) & (V < v1)
        k = [s for s in spots if v0 <= s[0] < v1]
        sd[vn] = round(len(k) / max(1, z.sum()) * 1e4, 2)  # spots per 10 000 cells
    spot_col = None
    if spots:
        m = np.isin(lb, [i + 1 for i, a in enumerate(ndi.sum(np.ones_like(Lm), lb, range(1, nl + 1))) if SPOT_A[0] <= a <= SPOT_A[1]])
        med = np.median(lab[m], 0)
        rgb = color.lab2rgb(med[None, None, :])[0, 0]
        spot_col = '#%02x%02x%02x' % tuple(int(round(np.clip(x, 0, 1) * 255)) for x in rgb)
    # light: L* along the axis (deciles of v), across the body (deciles of |u|)
    along = [round(float(np.nanmedian(np.where(ok & (V >= a) & (V < a + .1) & (U < .3), Lm, np.nan))), 1) if (ok & (V >= a) & (V < a + .1) & (U < .3)).any() else None
             for a in np.arange(0, 1, .1)]
    across = [round(float(np.nanmedian(np.where(ok & (V >= .2) & (V < .7) & (U >= a) & (U < a + .1), Lm, np.nan))), 1) if (ok & (V >= .2) & (V < .7) & (U >= a) & (U < a + .1)).any() else None
              for a in np.arange(0, 1, .1)]
    mid, mar = reg.get('corps/milieu'), reg.get('corps/marge')
    margin = dict(dL=round(mar['lab'][0] - mid['lab'][0], 1), dC=round(mar['chroma'] - mid['chroma'], 1)) if mid and mar else None
    return dict(meta=meta, regions=reg, nervures=veins, taches=dict(n=len(spots), densite=sd, taille=round(float(np.median([s[2] for s in spots])), 1) if spots else 0,
                couleur=spot_col), lumiere=dict(axe=along, travers=across), marge=margin, couverture=round(float(ok.mean()), 3))


def relief_of(carte, shape):
    """the depth of carte.py (a crop of the photo, scaled) brought back to the photo's pixels, in pixels (the flower's relief about as deep
    as 0.9 of its radius, as carte.py's normals), with the light fitted there: (zf(x, y), z map, light dict)"""
    cr = json.load(open(os.path.join(carte, 'crop.json'), encoding='utf-8')); cj = json.load(open(os.path.join(carte, 'carte.json'), encoding='utf-8'))
    d = np.load(os.path.join(carte, 'depth.npy')); mk = np.asarray(Image.open(os.path.join(carte, 'mask.png'))) > 127
    lo, hi = np.percentile(d[mk], [2, 98]); z = np.clip((d - lo) / (hi - lo + 1e-9), 0, 1.2) * .9 * cr['R'] / cr['s']
    H, W = shape
    def zf(x, y):
        return ndi.map_coordinates(z, [(np.asarray(y, float) - cr['y0']) * cr['s'], (np.asarray(x, float) - cr['x0']) * cr['s']], order=1, mode='nearest')
    yy, xx = np.mgrid[:H, :W]
    zfull = zf(xx.ravel(), yy.ravel()).reshape(H, W)
    return zf, zfull, cj.get('light')


def albedo(rgb, msk, zfull, light):
    """the colour less the form's shading: linear RGB divided by a + b max(0, n.L) (the light fitted by carte.py on the same photo), the
    shading brought to 1 on the piece's lit part (its 90th centile) and kept within .35-1.6 (a deep shade is not made up)"""
    zs = ndi.gaussian_filter(zfull, 2.0); gy, gx = np.gradient(zs); n = np.dstack([-gx, gy, np.ones_like(zs)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
    Ld = np.array(light['dir']); S = light['a'] + light['b'] * np.maximum(0, n @ Ld)
    S = S / max(1e-3, np.percentile(S[msk], 90)); S = np.clip(S, .35, 1.6)
    lin = np.where(rgb > .04045, ((rgb + .055) / 1.055) ** 2.4, rgb / 12.92) / S[..., None]
    lin = np.clip(lin, 0, 1)
    return np.where(lin > .0031308, 1.055 * lin ** (1 / 2.4) - .055, 12.92 * lin)


QC = dict(couverture=.6, brule=.10, ecrase=.15, bord_rejets=.35, rangs=.8, plein_cadre=.25, intrus=.04)
def controle(rgb, msk, m, meta):
    """hard checks of one flattened piece (BONNES-PRATIQUES §18.3): the map is refused when one of them fails"""
    band = msk
    q = dict(couverture=float((~np.isnan(m[:, :, 0])).mean()), brule=float((rgb[band] >= 253 / 255).any(1).mean()) if band.any() else 1.0,
             ecrase=float((color.rgb2lab(rgb[band][None])[0][:, 0] < 8).mean()) if band.any() else 1.0,
             bord_rejets=meta.get('bord_rejets', 0), rangs=meta.get('rangs', 0), plein_cadre=meta.get('plein_cadre', 0))
    L = color.rgb2lab(rgb)[:, :, 0]; lap = ndi.laplace(ndi.gaussian_filter(L, .7)); q['nettete'] = round(float(np.std(lap[band])), 2) if band.any() else 0
    ok = ~np.isnan(m[:, :, 0]); lm = color.rgb2lab(np.nan_to_num(m)); far = np.zeros(ok.shape, bool)
    for j in range(ok.shape[0]):  # an intruder: a cell far from its row's median (a neighbour of another tone glued to the piece)
        if ok[j].sum() > 4: far[j] = ok[j] & (np.linalg.norm(lm[j] - np.median(lm[j][ok[j]], 0), axis=1) > 18)
    q['intrus'] = float(far.sum() / max(1, ok.sum()))
    why = []
    if q['couverture'] < QC['couverture']: why.append('pièce couverte à %d %% (< 60 %%) : cadre ou masque à refaire' % (q['couverture'] * 100))
    if q['brule'] > QC['brule']: why.append('photo brûlée sur %d %% de la pièce (§16.1)' % (q['brule'] * 100))
    if q['ecrase'] > QC['ecrase']: why.append('noirs écrasés sur %d %%' % (q['ecrase'] * 100))
    if q['bord_rejets'] > QC['bord_rejets']: why.append('bords irréguliers : %d %% des rangs hors du contour lissé (voisine collée ou morsure)' % (q['bord_rejets'] * 100))
    if q['rangs'] < QC['rangs']: why.append('pièce tronquée : %d %% des rangs seulement' % (q['rangs'] * 100))
    if q['intrus'] > QC['intrus']: why.append('%d %% de cases étrangères à leur rang (ΔE > 18) : une voisine est collée à la pièce' % (q['intrus'] * 100))
    if q['plein_cadre'] > QC['plein_cadre']: why.append('la pièce touche le bord du cadre sur %d %% des rangs : demi-largeur trop petite' % (q['plein_cadre'] * 100))
    q = {k: (round(v, 3) if isinstance(v, float) else v) for k, v in q.items()}
    q['verdict'] = 'ko' if why else 'ok'; q['raisons'] = why
    return q


def control_image(rgb, msk, pts, m, q, path):
    """what the owner and the next session look at: the photo's piece with its mask (green) and frame (red), and its flat map"""
    from PIL import ImageDraw
    _, P, _ = curve(pts, 50); ys, xs = np.nonzero(msk)
    if not len(xs): return
    x0, y0 = max(0, xs.min() - 20), max(0, ys.min() - 20); x1, y1 = min(rgb.shape[1], xs.max() + 20), min(rgb.shape[0], ys.max() + 20)
    a = (np.clip(rgb[y0:y1, x0:x1], 0, 1) * 255).astype(np.uint8).copy(); ed = ndi.binary_dilation(msk, iterations=1) & ~msk
    a[ed[y0:y1, x0:x1]] = (0, 220, 0); im = Image.fromarray(a); dr = ImageDraw.Draw(im)
    dr.line([(float(p[0] - x0), float(p[1] - y0)) for p in P], fill=(230, 0, 0), width=2)
    H = 360; im = im.resize((max(8, int(im.width * H / im.height)), H))
    mp = np.where(np.isnan(m), .92, m); mi = Image.fromarray((np.clip(mp, 0, 1) * 255).astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM)
    mi = mi.resize((max(8, int(mi.width * H / mi.height)), H))
    out = Image.new('RGB', (im.width + mi.width + 30, H + 46), (235, 232, 226)); out.paste(im, (0, 0)); out.paste(mi, (im.width + 30, 0))
    t = ImageDraw.Draw(out)
    t.text((6, H + 4), '%s  couverture %.2f  brule %.2f  bords %.2f  rangs %.2f  intrus %.3f  nettete %.1f' % (q['verdict'].upper(), q['couverture'], q['brule'], q['bord_rejets'], q['rangs'], q['intrus'], q['nettete']), fill=(0, 0, 0))
    if q['raisons']: t.text((6, H + 24), ' ; '.join(q['raisons'])[:160].encode('latin-1', 'replace').decode('latin-1'), fill=(180, 0, 0))
    out.save(path, quality=88)


def piece(img, frame, kind, out=None, exclure=None, masque=None, carte=None, alb=False):
    rgb = load(img)
    pts, w = parse_frame(frame)
    zf = zfull = light = None
    if carte:
        zf, zfull, light = relief_of(carte, rgb.shape[:2])
    if masque:  # the piece's mask from fleur/pmasque.py (SAM prompted by the frame): only its part that holds the midrib
        msk = np.asarray(Image.open(masque).convert('L')) > 127
        lb, n_ = ndi.label(msk)
        if n_ > 1:
            _, Pa, _ = curve(pts, 30)
            ids = [lb[int(p[1]), int(p[0])] for p in Pa[5:25] if 0 <= int(p[1]) < lb.shape[0] and 0 <= int(p[0]) < lb.shape[1]]
            ids = [i for i in ids if i]; msk = lb == (np.bincount(ids).argmax() if ids else 1)
    else:
        msk = mask_of(rgb, pts, w, kind)
    if alb and light is not None:
        rgb = albedo(rgb, msk, zfull, light)
    if exclure:  # another component lying over the piece (filaments, an anther): its colours are cut out, it has its own sheet
        lab = color.rgb2lab(rgb)
        for h, de in exclure:
            c = color.rgb2lab(np.array([[[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]]]) / 255.0)[0, 0]
            msk &= np.linalg.norm(lab - c, axis=2) >= de
    m, meta, mid, hw = sample_piece(rgb, msk, pts, w, zf)
    pts2, w2 = refit(pts, w, mid, hw)  # second pass on the corrected axis (the mask is kept: it does not depend much on the axis)
    m, meta, mid, hw = sample_piece(rgb, msk, pts2, w2, zf)
    meta['frame_fit'] = ';'.join('%.0f,%.0f' % tuple(p) for p in pts2) + ';%.0f' % w2
    meta.update(img=os.path.basename(img), frame=frame, kind=kind)
    meta.update(masque='sam' if masque else 'grabcut', relief=bool(carte), albedo=bool(alb and light is not None))
    r = measure(m, meta)
    r['controle'] = controle(rgb, msk, m, meta)
    if out:
        np.save(out + '.npy', m)
        control_image(rgb, msk, pts2, m, r['controle'], out + '-controle.jpg')
        with open(out + '.json', 'w', encoding='utf-8', newline='\n') as f:
            json.dump(r, f, ensure_ascii=False, indent=1)
    return r, m


def verdict_de(d):
    return 'ok' if d <= DE_OK else 'proche' if d <= DE_NEAR else 'ko'


def verdict_tex(r):
    return 'ok' if TEX_LO <= r <= TEX_HI else ('trop lisse' if r < TEX_LO else 'trop chargé')


def compare(P, R, mp=None, mr=None, out=None):
    rows, worst = [], []
    for k, p in P['regions'].items():
        r = R['regions'].get(k)
        if not r:
            rows.append((k, None, '', '', '', 'absent du rendu'))
            continue
        de = float(color.deltaE_ciede2000(np.array(p['lab'])[None, :], np.array(r['lab'])[None, :])[0])
        tc = (r['contraste'] + .3) / (p['contraste'] + .3)
        tg = (r['grain'] + .15) / (p['grain'] + .15)
        dl = r['lab'][0] - p['lab'][0]
        dc = r['chroma'] - p['chroma']
        why = []
        if de > DE_OK:
            why.append('%s%s' % ('plus clair' if dl > 2 else 'plus sombre' if dl < -2 else 'teinte', ', plus vif' if dc > 3 else ', plus terne' if dc < -3 else ''))
        if verdict_tex(tc) != 'ok':
            why.append('contraste ' + verdict_tex(tc))
        if verdict_tex(tg) != 'ok':
            why.append('grain ' + verdict_tex(tg))
        v = 'ok' if not why else ('ko' if de > DE_NEAR or verdict_tex(tc) != 'ok' and verdict_tex(tg) != 'ok' else 'proche')
        rows.append((k, round(de, 1), p['hex'] + ' / ' + r['hex'], round(tc, 2), round(tg, 2), v + (' : ' + ', '.join(why) if why else '')))
        worst.append((de, k))
    nv_p, nv_r = P['nervures'], R['nervures']
    tp, tr = P['taches'], R['taches']
    la_p, la_r = P['lumiere']['axe'], R['lumiere']['axe']
    prof = [abs(a - b) for a, b in zip(la_p, la_r) if a is not None and b is not None]
    res = dict(regions=[dict(region=a, dE=b, couleurs=c, contraste=d, grain=e, verdict=f) for a, b, c, d, e, f in rows],
               nervures=dict(photo=nv_p, rendu=nv_r), taches=dict(photo=tp, rendu=tr), lumiere=dict(photo=la_p, rendu=la_r, ecart_moyen=round(float(np.mean(prof)), 1) if prof else None),
               marge=dict(photo=P['marge'], rendu=R['marge']),
               bilan=dict(ok=sum(1 for r in rows if r[5].startswith('ok')), proche=sum(1 for r in rows if r[5].startswith('proche')), ko=sum(1 for r in rows if r[5].startswith('ko') or r[5].startswith('absent')),
                          dE_moyen=round(float(np.mean([w[0] for w in worst])), 1) if worst else None))
    L = ['# Apparence : photo %s contre rendu %s' % (P['meta']['img'], R['meta']['img']), '',
         'Une ligne par région du tépale (v : gorge, corps, haut, pointe ; u : axe, milieu, marge). ΔE2000 : moins de %g à peine visible, moins de %g proche. '
         'Contraste et grain : rendu / photo, %g à %g attendu.' % (DE_OK, DE_NEAR, TEX_LO, TEX_HI), '',
         '| région | ΔE2000 | photo / rendu | contraste | grain | verdict |', '|---|---|---|---|---|---|']
    L += ['| %s | %s | %s | %s | %s | %s |' % (a, b if b is not None else '-', c, d, e, f) for a, b, c, d, e, f in rows]
    L += ['', 'Nervures en travers : photo %d (force %.1f), rendu %d (force %.1f).' % (nv_p['n'], nv_p['force'], nv_r['n'], nv_r['force']),
          'Taches : photo %d (taille %s px, %s), rendu %d (taille %s px, %s) ; densité par zone pour 10 000 cellules, photo %s, rendu %s.' % (
              tp['n'], tp['taille'], tp['couleur'], tr['n'], tr['taille'], tr['couleur'], tp['densite'], tr['densite']),
          'Lumière le long de l\'axe (L* par dixième, de la base à la pointe) : photo %s ; rendu %s ; écart moyen %s.' % (la_p, la_r, res['lumiere']['ecart_moyen']),
          'Lumière en travers du corps (L* de l\'axe au bord) : photo %s ; rendu %s.' % (P['lumiere']['travers'], R['lumiere']['travers']),
          'Marge contre milieu (ΔL*, ΔC*) : photo %s ; rendu %s.' % (P['marge'], R['marge']),
          'Bilan : %d ok, %d proches, %d ko ; ΔE2000 moyen %s.' % (res['bilan']['ok'], res['bilan']['proche'], res['bilan']['ko'], res['bilan']['dE_moyen'])]
    txt = '\n'.join(L) + '\n'
    if out:
        with open(out + '.txt', 'w', encoding='utf-8', newline='\n') as f:
            f.write(txt)
        with open(out + '.json', 'w', encoding='utf-8', newline='\n') as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
        if mp is not None and mr is not None:
            montage(mp, mr, out + '.png')
    return res, txt


def montage(mp, mr, path, H=420):
    """photo map | render map | ΔE2000 map, each in the piece's frame (base at the bottom, tip at the top)"""
    def img(m):
        a = np.nan_to_num(m, nan=.92)
        return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    NV, NU = mp.shape[:2]
    rr = np.stack([np.asarray(Image.fromarray((np.nan_to_num(mr[:, :, k], nan=.92) * 255).astype(np.uint8)).resize((NU, NV), Image.BILINEAR)) / 255. for k in range(3)], -1)
    ok = ~np.isnan(mp[:, :, 0])
    de = color.deltaE_ciede2000(color.rgb2lab(np.nan_to_num(mp, nan=.92)), color.rgb2lab(rr))
    de = ndi.gaussian_filter(np.where(ok, de, 0), 2)
    t = np.clip(de / 15, 0, 1)
    heat = np.stack([t, 1 - np.abs(t - .5) * 2 * .6 - .2 * t, 1 - t], -1) * ok[:, :, None] + .92 * (~ok)[:, :, None]
    tiles = [img(mp), Image.fromarray((rr * 255).astype(np.uint8)), img(np.clip(heat, 0, 1))]
    s = H / NV
    tiles = [t.transpose(Image.FLIP_TOP_BOTTOM).resize((max(8, int(NU * s)), H), Image.BILINEAR) for t in tiles]
    W = sum(t.width for t in tiles) + 20 * (len(tiles) - 1)
    out = Image.new('RGB', (W, H), (235, 232, 226))
    x = 0
    for t in tiles:
        out.paste(t, (x, 0))
        x += t.width + 20
    out.save(path)


def tissue(lab, motif=False):
    """the colour of the tissue itself in a cell: the well-lit samples (L* between its 35th and 85th percentiles: a cast shadow, a fold's
    shade are darker), then without the colour outliers (a filament, an anther, a neighbour seen through: chroma or hue beyond 2.5 MAD), median"""
    L = lab[:, 0]
    lo, hi = np.percentile(L, [5, 95] if motif else [35, 85])  # motif: a blotch, a heart, dense flecks are pigment, not shade: kept
    s = lab[(L >= lo) & (L <= hi)]
    if len(s) < 4:
        s = lab
    med = np.median(s, 0)
    d = np.linalg.norm(s[:, 1:] - med[1:], axis=1)
    mad = np.median(d) + 1e-6
    s2 = s[d <= med[0] * 0 + 2.5 * mad * 1.4826 + 1.0]
    return np.median(s2 if len(s2) >= 3 else s, 0)


def grille(maps, nu=18, nv=72, motif=False):
    """the measured colour grid of a piece: its maps (one per photo, in the piece's frame) folded on the axis (u and -u together: a hidden
    half is filled by the other, the noise halved), cut into nu bands of |u| (axis to edge) by nv rows (base to tip); the median CIELAB of each
    cell over every photo; an empty cell is filled along v then across u. Spots and fine lines vanish in the medians (they are drawn apart)."""
    acc = [[[] for _ in range(nu)] for _ in range(nv)]
    for m in maps:
        NV, NU = m.shape[:2]
        lab = color.rgb2lab(np.nan_to_num(m))
        ok = ~np.isnan(m[:, :, 0])
        uu = np.abs(np.linspace(-1, 1, NU))
        for j in range(NV):
            r = min(nv - 1, int(j / NV * nv))
            for i in range(NU):
                if ok[j, i]:
                    acc[r][min(nu - 1, int(uu[i] * nu))].append(lab[j, i])
    G = np.full((nv, nu, 3), np.nan)
    N = np.zeros((nv, nu), int)
    for r in range(nv):
        for c in range(nu):
            if len(acc[r][c]) >= 4:
                G[r, c] = tissue(np.array(acc[r][c]), motif)
                N[r, c] = len(acc[r][c])
    for c in range(nu):  # fill along v, then across u
        ok = ~np.isnan(G[:, c, 0])
        if ok.sum() >= 2:
            for k in range(3):
                G[:, c, k] = np.interp(np.arange(nv), np.nonzero(ok)[0], G[ok, c, k])
    for r in range(nv):
        ok = ~np.isnan(G[r, :, 0])
        if ok.sum() >= 1:
            for k in range(3):
                G[r, :, k] = np.interp(np.arange(nu), np.nonzero(ok)[0], G[r, ok, k])
    # the photo's exposure is the camera's: its lightest cells (95th percentile of L*) are brought to L* 95, by at most 15 %
    q = np.nanpercentile(G[:, :, 0], 95)
    expo = float(np.clip(95.0 / max(1.0, q), 1.0, 1.15))
    G[:, :, 0] = np.minimum(100, G[:, :, 0] * expo)
    rgb = color.lab2rgb(np.nan_to_num(G, nan=80))
    hexes = [['#%02x%02x%02x' % tuple(int(round(np.clip(x, 0, 1) * 255)) for x in rgb[r, c]) for c in range(nu)] for r in range(nv)]
    return dict(nu=nu, nv=nv, c=hexes, n=N.tolist(), photos=len(maps), expo=round(expo, 3))


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    s = a.add_subparsers(dest='cmd', required=True)
    p = s.add_parser('piece')
    p.add_argument('img')
    p.add_argument('frame')
    p.add_argument('--out')
    p.add_argument('--bg', choices=['photo', 'render'], default='photo')
    p.add_argument('--exclure', help='"#hex:dE,#hex:dE": colours of another component over the piece, cut out (CIE76 under dE)')
    p.add_argument('--masque', help='the piece mask from fleur/pmasque.py (SAM), instead of GrabCut and the colour gate')
    p.add_argument('--carte', help='the carte.py folder of the same photo: u and v follow the 3D length (foreshortening)')
    p.add_argument('--albedo', action='store_true', help='with --carte: the form shading divided out (the tissue colour, not the light)')
    c = s.add_parser('compare')
    c.add_argument('photo')
    c.add_argument('render')
    c.add_argument('--out')
    g = s.add_parser('grille')
    g.add_argument('out')
    g.add_argument('maps', nargs='+', help='the .npy maps written by piece (one per photo)')
    g.add_argument('--nu', type=int, default=18)
    g.add_argument('--nv', type=int, default=72)
    g.add_argument('--motif', action='store_true', help='a patterned colourway (blotch, dark heart, dense flecks): the dark samples are pigment, kept')
    g.add_argument('--force', action='store_true', help='keep a map whose control failed (written in the grid as forced)')
    q = s.add_parser('paire')
    q.add_argument('photo')
    q.add_argument('pframe')
    q.add_argument('render')
    q.add_argument('rframe')
    q.add_argument('--out', required=True)
    o = a.parse_args()
    if o.cmd == 'piece':
        ex = [(x.split(':')[0], float(x.split(':')[1])) for x in o.exclure.split(',')] if o.exclure else None
        r, _ = piece(o.img, o.frame, o.bg, o.out, ex, o.masque, o.carte, o.albedo)
        print(json.dumps({k: r[k] for k in ('nervures', 'taches', 'marge', 'couverture', 'controle')}, ensure_ascii=False))
    elif o.cmd == 'grille':
        bad = []
        for x in o.maps:  # a map whose control failed is refused (BONNES-PRATIQUES §18.3); an old map without control is reported
            j = x[:-4] + '.json'; q = json.load(open(j, encoding='utf-8')).get('controle') if os.path.exists(j) else None
            if q is None: print('sans contrôle (ancienne mise à plat, à refaire) :', x)
            elif q['verdict'] == 'ko': bad.append((x, q['raisons']))
        if bad and not o.force:
            for x, why in bad: print('REFUSÉE', x, ':', ' ; '.join(why))
            sys.exit("grille non écrite : %d carte(s) en échec (refaire la mise à plat, ou --force en le notant dans l'ETAT)" % len(bad))
        r = grille([np.load(x) for x in o.maps], o.nu, o.nv, o.motif)
        r['controle'] = {'cartes': len(o.maps), 'forcees': [x for x, _ in bad]}
        with open(o.out, 'w', encoding='utf-8', newline=chr(10)) as f:
            json.dump(r, f, ensure_ascii=False)
        print('grid %dx%d from %d map(s): js {nu:%d,nv:%d,c:%s}' % (r['nv'], r['nu'], r['photos'], r['nu'], r['nv'], json.dumps(sum(r['c'], []))[:120] + '...'))
    elif o.cmd == 'compare':
        P, R = [json.load(open(x, encoding='utf-8')) for x in (o.photo, o.render)]
        mp = np.load(o.photo[:-5] + '.npy') if os.path.exists(o.photo[:-5] + '.npy') else None
        mr = np.load(o.render[:-5] + '.npy') if os.path.exists(o.render[:-5] + '.npy') else None
        print(compare(P, R, mp, mr, o.out)[1])
    else:
        os.makedirs(os.path.dirname(os.path.abspath(o.out)), exist_ok=True)
        P, mp = piece(o.photo, o.pframe, 'photo', o.out + '.photo')
        R, mr = piece(o.render, o.rframe, 'render', o.out + '.rendu')
        print(compare(P, R, mp, mr, o.out)[1])


if __name__ == '__main__':
    main()
