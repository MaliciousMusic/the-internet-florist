# Measuring tools of the five-vase workshops (vases5/): how far a render is from its reference, in numbers.
# The owner asked for exact copies (2026-10-16): shape, light, colour, texture, transparency must be measured, not judged by eye.
#   python mesure.py spectre <img> [mask.png] [--grid 8]           colour "spectrography": CIELAB statistics on a grid and per region
#   python mesure.py cmp <ref> <render> [--mask m.png] [--out d]   aligned images: dE2000 map, per-region dE, SSIM, edges, silhouette
#   python mesure.py grain <ref> <render> x0 y0 x1 y1 [x0' y0' x1' y1'] radial power spectrum of the fine texture in a box
#   python mesure.py align <ref> <render> [--out a.png]             best similarity transform of the render onto the reference
# Images are read as files; the reference photograph never leaves the workshop's out/ folder.
import sys, os, json, math
import numpy as np, cv2


# ---------------------------------------------------------------- colour
def to_lab(bgr):
    """float CIELAB (L 0..100, a, b) of an 8-bit BGR image (sRGB, D65)"""
    rgb = bgr[..., ::-1].astype(np.float64) / 255.0
    lin = np.where(rgb <= .04045, rgb / 12.92, ((rgb + .055) / 1.055) ** 2.4)
    M = np.array([[.4124564, .3575761, .1804375], [.2126729, .7151522, .0721750], [.0193339, .1191920, .9503041]])
    xyz = lin @ M.T / np.array([.95047, 1.0, 1.08883])
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def de2000(l1, l2):
    """CIEDE2000 colour difference between two CIELAB arrays (same shape, last axis = L a b)"""
    L1, a1, b1 = np.moveaxis(l1, -1, 0); L2, a2, b2 = np.moveaxis(l2, -1, 0)
    C1, C2 = np.hypot(a1, b1), np.hypot(a2, b2); Cm = (C1 + C2) / 2
    G = .5 * (1 - np.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = a1 * (1 + G), a2 * (1 + G)
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p, h2p = np.degrees(np.arctan2(b1, a1p)) % 360, np.degrees(np.arctan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    dh = h2p - h1p; dh = np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh)); dh = np.where(C1p * C2p == 0, 0, dh)
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lpm, Cpm = (L1 + L2) / 2, (C1p + C2p) / 2
    hs = h1p + h2p
    hpm = np.where(C1p * C2p == 0, hs, np.where(np.abs(h1p - h2p) <= 180, hs / 2, np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2)))
    T = 1 - .17 * np.cos(np.radians(hpm - 30)) + .24 * np.cos(np.radians(2 * hpm)) + .32 * np.cos(np.radians(3 * hpm + 6)) - .2 * np.cos(np.radians(4 * hpm - 63))
    dth = 30 * np.exp(-((hpm - 275) / 25) ** 2)
    Rc = 2 * np.sqrt(Cpm ** 7 / (Cpm ** 7 + 25 ** 7))
    Sl = 1 + .015 * (Lpm - 50) ** 2 / np.sqrt(20 + (Lpm - 50) ** 2); Sc = 1 + .045 * Cpm; Sh = 1 + .015 * Cpm * T
    Rt = -np.sin(np.radians(2 * dth)) * Rc
    return np.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


def read(p, size=None):
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im is None:
        sys.exit('cannot read ' + p)
    if im.ndim == 2:
        im = cv2.cvtColor(im, cv2.COLOR_GRAY2BGR)
    alpha = None
    if im.shape[2] == 4:
        alpha = im[..., 3] > 127
        im = im[..., :3]
    if size and im.shape[:2] != size:
        im = cv2.resize(im, (size[1], size[0]), interpolation=cv2.INTER_AREA)
        if alpha is not None:
            alpha = cv2.resize(alpha.astype(np.uint8), (size[1], size[0]), interpolation=cv2.INTER_NEAREST) > 0
    return im, alpha


def silhouette(im, alpha=None):
    """the object against a plain backdrop: alpha if any, else GrabCut seeded by what differs from the border colours
    (better: pass the workshop's own mask with --mask)"""
    if alpha is not None:
        return alpha
    lab = to_lab(cv2.GaussianBlur(im, (0, 0), 1.5))
    H, W = lab.shape[:2]
    # the backdrop may be a gradient: compare each pixel with the border colour of its own row
    rowbg = np.median(np.concatenate([lab[:, :max(2, W // 40)], lab[:, -max(2, W // 40):]], 1), 1)
    d = np.linalg.norm(lab - rowbg[:, None, :], axis=-1)
    fg = d > 14
    gc = np.where(fg, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
    gc[d < 4] = cv2.GC_BGD
    gc[:, :2] = gc[:, -2:] = cv2.GC_BGD
    try:
        bgm, fgm = np.zeros((1, 65)), np.zeros((1, 65))
        cv2.grabCut(im, gc, None, bgm, fgm, 3, cv2.GC_INIT_WITH_MASK)
        m = ((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)).astype(np.uint8)
    except cv2.error:
        m = fg.astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lb, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        m = (lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    return m.astype(bool)


def spectre(path, mask_path=None, grid=8):
    im, al = read(path)
    lab = to_lab(im)
    m = cv2.imread(mask_path, 0) > 127 if mask_path else silhouette(im, al)
    H, W = m.shape
    ys, xs = np.where(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    cells = []
    for i in range(grid):
        for j in range(grid):
            a, b = y0 + (y1 - y0) * i // grid, y0 + (y1 - y0) * (i + 1) // grid
            c, d = x0 + (x1 - x0) * j // grid, x0 + (x1 - x0) * (j + 1) // grid
            sel = m[a:b, c:d]
            if sel.sum() < 20:
                continue
            v = lab[a:b, c:d][sel]
            cells.append(dict(cell=[i, j], n=int(sel.sum()), L=[round(float(q), 1) for q in np.percentile(v[:, 0], [5, 50, 95])],
                              a=round(float(np.median(v[:, 1])), 1), b=round(float(np.median(v[:, 2])), 1)))
    v = lab[m]
    hist = {k: np.histogram(v[:, i], bins=20, range=r)[0].tolist() for i, (k, r) in enumerate((('L', (0, 100)), ('a', (-40, 60)), ('b', (-40, 80))))}
    out = dict(image=os.path.basename(path), pixels=int(m.sum()),
               L_pct=[round(float(q), 1) for q in np.percentile(v[:, 0], [1, 5, 25, 50, 75, 95, 99])],
               a_med=round(float(np.median(v[:, 1])), 1), b_med=round(float(np.median(v[:, 2])), 1),
               chroma_med=round(float(np.median(np.hypot(v[:, 1], v[:, 2]))), 1), hist=hist, grid=cells)
    print(json.dumps(out, ensure_ascii=False))
    return out


def ssim(a, b):
    a, b = a.astype(np.float64), b.astype(np.float64)
    C1, C2 = (.01 * 255) ** 2, (.03 * 255) ** 2
    mu1, mu2 = cv2.GaussianBlur(a, (11, 11), 1.5), cv2.GaussianBlur(b, (11, 11), 1.5)
    s1 = cv2.GaussianBlur(a * a, (11, 11), 1.5) - mu1 ** 2; s2 = cv2.GaussianBlur(b * b, (11, 11), 1.5) - mu2 ** 2
    s12 = cv2.GaussianBlur(a * b, (11, 11), 1.5) - mu1 * mu2
    return ((2 * mu1 * mu2 + C1) * (2 * s12 + C2)) / ((mu1 ** 2 + mu2 ** 2 + C1) * (s1 + s2 + C2))


def cmp(ref_p, ren_p, mask_p=None, out_dir='.'):
    ref, ral = read(ref_p)
    ren, nal = read(ren_p, ref.shape[:2])
    m_ref = silhouette(ref, ral); m_ren = silhouette(ren, nal)
    sil_iou = float((m_ref & m_ren).sum() / max(1, (m_ref | m_ren).sum()))
    m = cv2.imread(mask_p, 0) > 127 if mask_p else (m_ref & m_ren)
    m = cv2.resize(m.astype(np.uint8), (ref.shape[1], ref.shape[0]), interpolation=cv2.INTER_NEAREST) > 0
    dE = de2000(to_lab(ref), to_lab(ren))
    # colour difference after a 2 px blur too: the shading and colour, without the grain and the sub-pixel edges
    dEs = de2000(to_lab(cv2.GaussianBlur(ref, (0, 0), 2)), to_lab(cv2.GaussianBlur(ren, (0, 0), 2)))
    g1, g2 = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY), cv2.cvtColor(ren, cv2.COLOR_BGR2GRAY)
    ss = ssim(g1, g2)
    # the structure without the fine grain (a grain matched by its spectrum, not pixel by pixel, must not count against it)
    ssl = ssim(cv2.GaussianBlur(g1, (0, 0), 2), cv2.GaussianBlur(g2, (0, 0), 2))
    e1, e2 = cv2.Canny(cv2.GaussianBlur(g1, (0, 0), 1.2), 30, 90) > 0, cv2.Canny(cv2.GaussianBlur(g2, (0, 0), 1.2), 30, 90) > 0
    k = np.ones((5, 5), np.uint8)
    e1m, e2m = e1 & m, e2 & m
    edge_p = float((e2m & (cv2.dilate(e1m.astype(np.uint8), k) > 0)).sum() / max(1, e2m.sum()))   # our edges that exist in the reference
    edge_r = float((e1m & (cv2.dilate(e2m.astype(np.uint8), k) > 0)).sum() / max(1, e1m.sum()))   # reference edges we reproduce
    # regions: luminance terciles of the reference inside the mask (shadow, half tone, light)
    L = to_lab(cv2.GaussianBlur(ref, (0, 0), 3))[..., 0]
    t1, t2 = np.percentile(L[m], [33, 67])
    regions = {'ombre': m & (L < t1), 'demi-teinte': m & (L >= t1) & (L < t2), 'lumiere': m & (L >= t2)}
    res = dict(silhouette_iou=round(sil_iou, 4), dE2000_mean=round(float(dE[m].mean()), 2), dE2000_p90=round(float(np.percentile(dE[m], 90)), 2),
               dE2000_lisse_mean=round(float(dEs[m].mean()), 2), ssim=round(float(ss[m].mean()), 3), ssim_lisse=round(float(ssl[m].mean()), 3),
               aretes_precision=round(edge_p, 3), aretes_rappel=round(edge_r, 3),
               zones={k: dict(dE=round(float(dEs[v].mean()), 2),
                              dL=round(float((to_lab(cv2.GaussianBlur(ren, (0, 0), 2))[..., 0] - to_lab(cv2.GaussianBlur(ref, (0, 0), 2))[..., 0])[v].mean()), 2))
                      for k, v in regions.items() if v.any()})
    os.makedirs(out_dir, exist_ok=True)
    heat = cv2.applyColorMap(np.clip(dEs * 12, 0, 255).astype(np.uint8), cv2.COLORMAP_INFERNO); heat[~m] = 40
    sil = np.zeros_like(ref); sil[m_ref & ~m_ren] = (0, 0, 255); sil[m_ren & ~m_ref] = (255, 0, 0); sil[m_ref & m_ren] = (90, 90, 90)
    edges = np.full_like(ref, 255); edges[e1m] = (0, 0, 200); edges[e2m] = (200, 0, 0); edges[e1m & e2m] = (0, 0, 0)
    h = 600; f = lambda x: cv2.resize(x, (int(x.shape[1] * h / x.shape[0]), h), interpolation=cv2.INTER_AREA)
    board = np.hstack([f(ref), f(ren), f(heat), f(sil), f(edges)])
    cv2.putText(board, 'dE lisse %.1f  SSIM lisse %.2f  IoU %.3f  aretes %.2f/%.2f' % (res['dE2000_lisse_mean'], res['ssim_lisse'], sil_iou, edge_p, edge_r),
                (10, 24), cv2.FONT_HERSHEY_SIMPLEX, .7, (0, 0, 255), 2)
    cv2.imwrite(os.path.join(out_dir, 'mesure_cmp.jpg'), board, [cv2.IMWRITE_JPEG_QUALITY, 88])
    json.dump(res, open(os.path.join(out_dir, 'mesure_cmp.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(res, ensure_ascii=False))
    return res


def radial_spectrum(g):
    g = g.astype(np.float64)
    hp = g - cv2.GaussianBlur(g, (0, 0), 6)
    win = np.outer(np.hanning(g.shape[0]), np.hanning(g.shape[1]))
    P = np.abs(np.fft.fftshift(np.fft.fft2(hp * win))) ** 2
    cy, cx = np.array(P.shape) // 2
    yy, xx = np.indices(P.shape)
    r = np.hypot((yy - cy) / P.shape[0], (xx - cx) / P.shape[1])
    bins = np.linspace(0, .5, 26)
    spec = [float(P[(r >= bins[i]) & (r < bins[i + 1])].mean()) for i in range(25)]
    return np.array(spec), float(hp.std())


def grain(ref_p, ren_p, box, box2=None):
    ref, _ = read(ref_p); ren, _ = read(ren_p)
    x0, y0, x1, y1 = box
    g1 = cv2.cvtColor(ref[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
    X0, Y0, X1, Y1 = box2 or box
    g2 = cv2.cvtColor(ren[Y0:Y1, X0:X1], cv2.COLOR_BGR2GRAY)
    g2 = cv2.resize(g2, (g1.shape[1], g1.shape[0]), interpolation=cv2.INTER_AREA)
    s1, c1 = radial_spectrum(g1); s2, c2 = radial_spectrum(g2)
    ratio = (s2 + 1e-9) / (s1 + 1e-9)
    res = dict(contraste_ref=round(c1, 2), contraste_rendu=round(c2, 2),
               rapport_spectre_bandes=[round(float(v), 2) for v in ratio],
               ecart_log_moyen=round(float(np.mean(np.abs(np.log10(ratio[1:])))), 3))
    print(json.dumps(res, ensure_ascii=False))
    return res


def align(ref_p, ren_p, out=None):
    """similarity transform (scale, rotation, shift) that best lays the render's silhouette on the reference's"""
    ref, ral = read(ref_p); ren, nal = read(ren_p)
    a = silhouette(ref, ral).astype(np.uint8) * 255; b = silhouette(ren, nal).astype(np.uint8) * 255
    def moments(m):
        M = cv2.moments(m, True); return np.array([M['m10'] / M['m00'], M['m01'] / M['m00']]), math.sqrt(M['m00'])
    (ca, sa), (cb, sb) = moments(a), moments(b)
    s = sa / sb
    T = np.array([[s, 0, ca[0] - s * cb[0]], [0, s, ca[1] - s * cb[1]]], np.float32)
    res = dict(echelle=round(float(s), 4), decalage=[round(float(T[0, 2]), 1), round(float(T[1, 2]), 1)])
    if out:
        cv2.imwrite(out, cv2.warpAffine(ren, T, (ref.shape[1], ref.shape[0]), borderValue=(255, 255, 255)))
    print(json.dumps(res))
    return res


if __name__ == '__main__':
    A = sys.argv[1:]
    opt = lambda k, d=None: A[A.index(k) + 1] if k in A else d
    if not A:
        sys.exit(__doc__ if __doc__ else 'see the header')
    if A[0] == 'spectre':
        spectre(A[1], A[2] if len(A) > 2 and not A[2].startswith('--') else None, int(opt('--grid', 8)))
    elif A[0] == 'cmp':
        cmp(A[1], A[2], opt('--mask'), opt('--out', '.'))
    elif A[0] == 'grain':
        n = [int(v) for v in A[3:] if v.lstrip('-').isdigit()]
        grain(A[1], A[2], n[:4], n[4:8] if len(n) >= 8 else None)
    elif A[0] == 'align':
        align(A[1], A[2], opt('--out'))
