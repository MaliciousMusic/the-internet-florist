# The snowdrop vase's paint job, made from the photograph (the GLB only gives the form and the pose).
#   form   - the turned body: the model's radius by height (median around the axis of unwrap.py's map), smoothed; its own
#            relief and texture are ignored;
#   place  - each point of the unrolled body (turn angle x height) is projected into the photograph with the fitted pose
#            (glb_pose.json): the photograph seen on the body, out/photo_unrolled.png (front half; the back is not seen);
#   paint  - the photograph's light is taken off (a diffuse light fitted on the body's normals, the glaze's glints found as
#            what stands above it and left out), the colours are clustered into the painter's palette (k-means in CIELAB),
#            the areas cleaned of specks; glints and grazing parts get the paint of their neighbours;
#            -> out/paint.png (palette index per cell, 255 = not seen), out/paint.json (palette, measured), out/paint_view.png
#   .venv-depth/Scripts/python paint.py [K=14 W=2048 H=1536]
import sys, os, json
import numpy as np, cv2
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import glbkit, mesure, svgkit  # noqa: E402

OUT = os.path.join(HERE, 'out')
KW = dict(a.split('=') for a in sys.argv[1:] if '=' in a)
W, H = int(KW.get('W', 2048)), int(KW.get('H', 1536))
K = int(KW.get('K', 14))
CW = np.array([1.0, 1.5, 1.5], np.float32)                         # hue weighs more than lightness in the palette


def profile():
    """radius of the turned body by row of the unrolled map (row 0 = top), and dr/dh"""
    r = np.load(os.path.join(OUT, 'unwrap_r.npy'))
    assert r.shape == (H, W), 'unwrap.py must run with the same W, H'
    pr = np.array([np.median(row[row > 0]) if (row > 0).any() else 0 for row in r], np.float32)
    # the model's surface carries its own tube lines (lumps that run around): a smooth turn, strongly smoothed on the belly,
    # lightly at the foot and the lip where the profile really breaks
    hh = 1 - (np.arange(H) + .5) / H
    pa = cv2.GaussianBlur(pr.reshape(-1, 1), (0, 0), float(KW.get('psig', 14))).ravel()
    pb = cv2.GaussianBlur(pr.reshape(-1, 1), (0, 0), 2.5).ravel()
    wa = np.clip((hh - .07) / .04, 0, 1) * np.clip((.93 - hh) / .03, 0, 1)
    pr = (wa * pa + (1 - wa) * pb).astype(np.float32)
    h = 1 - (np.arange(H) + .5) / H
    drdh = -np.gradient(pr) * H                                     # rows go down while h goes up
    np.save(os.path.join(OUT, 'profile.npy'), np.stack([h, pr, drdh], 1).astype(np.float32))
    return h, pr, drdh


def body_grid(h, pr, drdh):
    th = ((np.arange(W) + .5) / W * 2 - 1) * np.pi
    TH, HH = np.meshgrid(th, h)
    R = np.repeat(pr[:, None], W, 1); DR = np.repeat(drdh[:, None], W, 1)
    P = np.dstack([R * np.cos(TH), HH, R * np.sin(TH)])
    N = np.dstack([np.cos(TH), -DR, np.sin(TH)]); N /= np.linalg.norm(N, axis=2, keepdims=True)
    return P, N


def project(P, N, cam, Wp, Hp):
    """pixel (x, row) of each body point in the photograph, its normal in the camera frame (x right, y down, z to the eye) and
    how squarely it faces the eye (0 = grazing or hidden)"""
    mv, _ = glbkit.view_matrices(cam, Wp, Hp)
    ph_ = np.concatenate([P, np.ones(P.shape[:2] + (1,))], 2) @ mv.T
    X, Y, Z = ph_[..., 0], ph_[..., 1], ph_[..., 2]
    f, cx, cy = cam['fpx'], cam.get('cx', Wp / 2), cam.get('cy', Hp / 2)
    px, py = cx + f * X / -Z, cy - f * Y / -Z
    sx = cam.get('sx', 1.0)
    Nm = N * np.array([1 / sx, 1, 1 / sx]); Nm /= np.linalg.norm(Nm, axis=2, keepdims=True)
    Nc = Nm @ mv[:3, :3].T
    Nc /= np.linalg.norm(Nc, axis=2, keepdims=True)
    V = -ph_[..., :3]; V /= np.linalg.norm(V, axis=2, keepdims=True)
    face = np.clip((Nc * V).sum(2), 0, 1)
    return px.astype(np.float32), py.astype(np.float32), Nc * np.array([1, -1, 1]), face


def to_lab(rgb01):
    return mesure.to_lab(np.clip(rgb01[..., ::-1] * 255, 0, 255).astype(np.uint8))


def lab2rgb(c):
    L, a, b = c
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    fi = lambda t: t ** 3 if t > 6 / 29 else 3 * (6 / 29) ** 2 * (t - 4 / 29)
    xyz = np.array([fi(fx) * .95047, fi(fy), fi(fz) * 1.08883])
    M_ = np.array([[3.2404542, -1.5371385, -.4985314], [-.9692660, 1.8760108, .0415560], [.0556434, -.2040259, 1.0572252]])
    lin = M_ @ xyz
    return np.clip(np.where(lin <= .0031308, 12.92 * lin, 1.055 * np.abs(lin) ** (1 / 2.4) - .055), 0, 1)


def kmeans(lab, sel, k, seed=1):
    X = lab[sel].reshape(-1, 3).astype(np.float32)
    X = X[np.random.default_rng(seed).choice(len(X), min(len(X), 150000), replace=False)]
    _, lb, C = cv2.kmeans(X * CW, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 80, .05), 6, cv2.KMEANS_PP_CENTERS)
    return C / CW


def assign(lab, C):
    d = (((lab[..., None, :] - C[None, None]) * CW) ** 2).sum(-1)
    return d.argmin(-1).astype(np.int32)


def fill_nearest(lb, known):
    _, (iy, ix) = ndimage.distance_transform_edt(~known, return_indices=True)
    return lb[iy, ix]


def majority(lb, valid, k, r):
    votes = np.stack([cv2.blur(((lb == i) & valid).astype(np.float32), (2 * r + 1,) * 2) for i in range(k)], -1)
    return votes.argmax(-1).astype(np.int32)


def main():
    h, pr, drdh = profile()
    P, N = body_grid(h, pr, drdh)
    pose = json.load(open(os.path.join(OUT, 'glb_pose.json')))
    cam = pose['cam']
    ph = cv2.imread(os.path.join(OUT, 'ref.jpg'))[..., ::-1].astype(np.float32) / 255
    Hp, Wp = ph.shape[:2]
    pm = cv2.imread(os.path.join(OUT, 'mask.png'), 0) > 127
    px, py, Nc, face = project(P, N, cam, Wp, Hp)
    inm = cv2.remap(cv2.erode(pm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32), px, py, cv2.INTER_NEAREST, borderValue=0) > .5
    seen = (face > float(KW.get('face', .28))) & inm
    PU = cv2.remap(ph, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    PU[~seen] = 0
    cv2.imwrite(os.path.join(OUT, 'photo_unrolled.png'), (PU[..., ::-1] * 255).astype(np.uint8))
    print('seen %.1f %% of the body (rows with paint: the front half)' % (100 * seen.mean()))
    # 1. palette on the photograph as it is, then its diffuse light fitted on the normals, glints marked, palette again on the
    #    unlit colours
    Y = lambda c: c @ np.array([.3, .59, .11])
    nx, ny, nz = Nc[..., 0], Nc[..., 1], Nc[..., 2]
    Phi = np.stack([np.ones_like(nx), nx, ny, nz, nx * nx, ny * ny, nx * ny, nx * nz, ny * nz], -1)
    # the light is fitted on one paint known to be the same everywhere: the white and ivory glaze (light, nearly colourless);
    # its brightness by normal is the photograph's diffuse light
    # the navy backdrop mirrored by the glaze at grazing angles (Fresnel, as mk.py renders it) is taken off first: the flanks'
    # blue cast is the photographer's backdrop, not paint
    navy = np.array([int(KW.get('navy', '1d2440')[i:i + 2], 16) / 255 for i in (0, 2, 4)])
    Fr = np.clip(.04 + .96 * (1 - np.clip(Nc[..., 2], 0, 1)) ** 5, 0, 1)[..., None] * float(KW.get('envk', .85))
    PU = np.where(seen[..., None], np.clip((PU - navy * Fr) / np.maximum(1 - Fr, .15), 0, 1), 0).astype(np.float32)
    lab0 = to_lab(PU)
    chroma = np.hypot(lab0[..., 1], lab0[..., 2])
    glint = np.zeros_like(seen)
    white = seen & (chroma < float(KW.get('wc', 10))) & (lab0[..., 0] > 55)
    keep = white.copy()
    for _ in range(4):
        coef, *_ = np.linalg.lstsq(Phi[keep], Y(PU)[keep], rcond=None)
        fit = Phi @ coef
        res = Y(PU) - fit
        keep = white & (res < .06) & (res > -.12)                  # glints above, grey-blue washes and lines below
    coef = coef / np.median(fit[keep]); fit = Phi @ coef              # 1 = the white glaze's typical light
    S = np.clip(fit, .2, 3).astype(np.float32)
    alb = np.clip(PU / S[..., None], 0, 1)
    # glints: brighter than the brightest paint under this light, and colourless
    lab1 = to_lab(alb)
    glint = seen & (lab1[..., 0] > np.percentile(lab1[..., 0][keep], 97) + float(KW.get('glint', 3))) & (chroma < 14)
    # a window mirrored on a warm enamel takes its tint: very light, whatever its colour
    glint |= seen & (lab1[..., 0] > np.percentile(lab1[..., 0][keep], 99) + float(KW.get('glint2', 1))) & (chroma < 28)
    # and the streaks mirrored on the dark neck: thin, light, colourless on a dark paint
    L1 = lab1[..., 0].astype(np.float32)
    top = L1 - cv2.morphologyEx(L1, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    darkbg = cv2.medianBlur(np.clip(L1, 0, 100).astype(np.uint8), 15) < 40
    glint |= seen & (top > float(KW.get('streak', 10))) & darkbg & (chroma < 14)
    glint = cv2.dilate(glint.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & seen
    print('light fitted on %.1f %% of the seen body (white glaze); glints %.1f %%' % (100 * keep.sum() / seen.sum(), 100 * glint.sum() / seen.sum()))
    lab = to_lab(alb)
    C = kmeans(lab, seen & ~glint, K)
    lb = assign(lab, C)
    known = seen & ~glint
    lb = fill_nearest(lb, known)
    # 2. the painter's areas: a majority filter, then specks merged into their surroundings
    for _ in range(2):
        lb = majority(lb, np.ones_like(seen), K, int(KW.get('maj', 2)))
    # the painter's edges: each colour's area smoothed, the strongest wins (round, even borders; lines 3 cells wide survive)
    sm = float(KW.get('smooth', 1.6))
    lb = np.stack([cv2.GaussianBlur((lb == i).astype(np.float32), (0, 0), sm) for i in range(K)], -1).argmax(-1).astype(np.int32)
    minc = int(KW.get('minc', 40))
    for i in range(K):
        n_, cc, st, _ = cv2.connectedComponentsWithStats((lb == i).astype(np.uint8), connectivity=4)
        small = np.isin(cc, np.where(st[:, cv2.CC_STAT_AREA] < minc)[0]) & (cc > 0)
        if small.any():
            lb = np.where(small, fill_nearest(np.where(small, -1, lb), ~small), lb)
    # 3. the palette measured: the unlit colour of each area, away from its borders and from the glints
    cols = []
    for i in range(K):
        s = (cv2.erode((lb == i).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0) & known
        if s.sum() < 30:
            s = (lb == i) & known
        cols.append(np.median(alb[s], 0) if s.sum() else lab2rgb(C[i]))
    cols = np.clip(np.array(cols), 0, 1)
    order = np.argsort(-np.bincount(lb[seen].ravel(), minlength=K))
    remap_ = np.zeros(K, np.int32); remap_[order] = np.arange(K)
    lb = remap_[lb]; cols = cols[order]
    out = np.where(seen, lb, 255).astype(np.uint8)
    # the parts not seen (the back): the nearest paint along the turn, so a view slightly beside the photograph's is covered
    cv2.imwrite(os.path.join(OUT, 'paint.png'), out)
    np.save(os.path.join(OUT, 'unlit.npy'), alb.astype(np.float16))          # the photograph without its light, on the body
    np.save(os.path.join(OUT, 'unlit_known.npy'), known)                     # seen and not a glint
    # the photographer's studio as the glaze mirrors it: the light above the lit paint, filed by reflected direction (a
    # lat-long map, used for the glaze's reflections in every view)
    base = cols[lb] * S[..., None]
    r = Y(PU) - Y(base)
    rr = 2 * Nc[..., 2:3] * Nc - np.array([0, 0, 1.0])
    az = np.arctan2(rr[..., 0], rr[..., 2]); el = np.arcsin(np.clip(-rr[..., 1], -1, 1))
    EW, EH = 72, 36
    ix = np.clip(((az / np.pi + 1) / 2 * EW).astype(int), 0, EW - 1); iy = np.clip(((.5 - el / np.pi) * EH).astype(int), 0, EH - 1)
    acc = np.zeros((EH, EW)); cnt = np.zeros((EH, EW))
    np.add.at(acc, (iy[seen], ix[seen]), r[seen]); np.add.at(cnt, (iy[seen], ix[seen]), 1)
    num, den = cv2.GaussianBlur(acc.astype(np.float32), (0, 0), 1.0), cv2.GaussianBlur(cnt.astype(np.float32), (0, 0), 1.0)
    env = np.where(den > .5, num / np.maximum(den, 1e-6), 0)
    env = cv2.GaussianBlur(env.astype(np.float32), (0, 0), float(KW.get('esig', 1.5)))
    env = np.clip(env - float(KW.get('efloor', .025)), 0, 1)      # the paint's leftovers spread thin: only the real lights stay
    np.save(os.path.join(OUT, 'env_photo.npy'), env.astype(np.float32))
    cv2.imwrite(os.path.join(OUT, 'env_photo.png'), cv2.resize((np.clip(env * 2, 0, 1) * 255).astype(np.uint8), (EW * 8, EH * 8), interpolation=cv2.INTER_NEAREST))
    json.dump(dict(colours=[svgkit.hexc(c * 255) for c in cols], K=K, light=[float(v) for v in coef]), open(os.path.join(OUT, 'paint.json'), 'w'), indent=1)
    v = (cols[lb] * 255).astype(np.uint8)[..., ::-1].copy(); v[~seen] = 200
    cv2.imwrite(os.path.join(OUT, 'paint_view.png'), v)
    g = (np.clip(alb, 0, 1)[..., ::-1] * 255).astype(np.uint8); g[glint] = (255, 0, 255); g[~seen] = 200
    cv2.imwrite(os.path.join(OUT, 'paint_unlit.png'), g)
    print('palette', ' '.join(svgkit.hexc(c * 255) for c in cols))


if __name__ == '__main__':
    main()
