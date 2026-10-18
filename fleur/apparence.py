"""apparence.py: the appearance of one petal or tepal, measured in its own frame (along v from base to tip, across u from edge to edge), on a
photograph and on a render alike, so that the two compare region by region (BONNES-PRATIQUES §11: the bar is the photo). No model, no browser.

  python fleur/apparence.py piece <img> <frame> [--out <base>] [--bg photo|render]
  python fleur/apparence.py compare <photo.json> <render.json> [--out <base>]
  python fleur/apparence.py paire <photo> <frame> <render> <frame> --out <base>      (both pieces, then compare)

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


def sample_piece(rgb, msk, pts, w):
    """the piece in its own frame: an NV x NU map of RGB (NaN outside), u from its own left edge to its right edge"""
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
    # the edges, smoothed along the piece (a row that leaks into a neighbour or a gap of the mask does not make a jump)
    good = ~np.isnan(ab[:, 0])
    if good.sum() > 5:
        for q in (0, 1):
            col = np.interp(np.arange(NV), np.nonzero(good)[0], ab[good, q])
            sm = ndi.median_filter(col, size=max(5, NV // 30) | 1)
            tol = NW * .04
            # the smoothed edge only cuts a leak (a run that jumps outward); it never widens the piece beyond its own mask
            raw = np.where(good, ab[:, q], np.nan)
            fix = np.where(q == 0, np.fmax(raw, sm - tol), np.fmin(raw, sm + tol))
            ab[:, q] = np.where(good, fix, np.nan)
    mid = np.full((NV, 2), np.nan)
    for j in range(NV):
        if np.isnan(ab[j, 0]):
            continue
        a, b = ab[j]
        cm = (a + b) / 2
        mid[j] = np.interp(cm, np.arange(NW), X[j]), np.interp(cm, np.arange(NW), Y[j])
        hw[j] = (b - a) / (NW - 1) * 2.5 / 2
        t = np.linspace(a, b, NU)
        for k in range(3):
            out[j, :, k] = np.interp(t, np.arange(NW), ch[k][j])
    return out, dict(NV=NV, NU=NU, len_px=float(L), w_px=float(w), width_profile=[round(float(x), 3) for x in hw[::max(1, NV // 20)]]), mid, hw


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


def piece(img, frame, kind, out=None):
    rgb = load(img)
    pts, w = parse_frame(frame)
    msk = mask_of(rgb, pts, w, kind)
    m, meta, mid, hw = sample_piece(rgb, msk, pts, w)
    pts2, w2 = refit(pts, w, mid, hw)  # second pass on the corrected axis (the mask is kept: it does not depend much on the axis)
    m, meta, mid, hw = sample_piece(rgb, msk, pts2, w2)
    meta['frame_fit'] = ';'.join('%.0f,%.0f' % tuple(p) for p in pts2) + ';%.0f' % w2
    meta.update(img=os.path.basename(img), frame=frame, kind=kind)
    r = measure(m, meta)
    if out:
        np.save(out + '.npy', m)
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


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    s = a.add_subparsers(dest='cmd', required=True)
    p = s.add_parser('piece')
    p.add_argument('img')
    p.add_argument('frame')
    p.add_argument('--out')
    p.add_argument('--bg', choices=['photo', 'render'], default='photo')
    c = s.add_parser('compare')
    c.add_argument('photo')
    c.add_argument('render')
    c.add_argument('--out')
    q = s.add_parser('paire')
    q.add_argument('photo')
    q.add_argument('pframe')
    q.add_argument('render')
    q.add_argument('rframe')
    q.add_argument('--out', required=True)
    o = a.parse_args()
    if o.cmd == 'piece':
        r, _ = piece(o.img, o.frame, o.bg, o.out)
        print(json.dumps({k: r[k] for k in ('nervures', 'taches', 'marge', 'couverture')}, ensure_ascii=False))
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
