# The lit fields of the jar from the measuring model's geometry (out/glbw_<view>_*.npy, made by work/glb_maps.py): per pixel
# the true normal (scales, fins, heads included), the depth, the model-space point (height on the jar), the gold of the carp
# told from the patina by the model's own colour (a* < 14). The light and the colours are those measured on the reference
# (light_fit_glb.json, work/fit_light_glb.py). Nothing of the model or the photograph leaves as an image: the vector writer
# turns these fields into curves.
import os
import json
import numpy as np
import cv2
from scipy.spatial import cKDTree
import light as Lt

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
HCM = 26.0
# the dark head of carp B (traced on the photograph, pixels of the reference): carried onto the model, then into any view
B_HEAD = [(470, 278), (468, 263), (460, 248), (448, 236), (435, 226), (428, 228), (423, 250), (424, 272), (430, 290), (440, 293),
          (457, 292), (467, 288)]
FIT = os.path.join(HERE, 'light_fit_glb.json')


def lab_a(rgb01):
    lab = cv2.cvtColor(np.clip(rgb01 * 255, 0, 255).astype(np.uint8)[..., ::-1], cv2.COLOR_BGR2LAB).astype(np.float32)
    return lab[..., 1] - 128


def load(view):
    g = lambda k: np.load(os.path.join(OUT, 'glbw_%s_%s.npy' % (view, k)))
    return dict(albedo=g('albedo'), normal=g('normal'), depth=g('depth'), mask=g('mask'), P=g('P'))


def labels_photo(M):
    """which carp each gold pixel of the photograph's view belongs to (from the traced school's render at 2x, if present),
    and the dark head"""
    import pickle
    lab = np.full(M['mask'].shape, -1, np.int16)
    pk = os.path.join(HERE, 'work', 'parts_photo.pkl')
    if os.path.exists(pk):
        part = pickle.load(open(pk, 'rb'))['part']
        part = cv2.resize(part.astype(np.int16), (M['mask'].shape[1], M['mask'].shape[0]), interpolation=cv2.INTER_NEAREST)
        carp = np.where(part > 0, (part - 1) // 3, -1).astype(np.int16)
        # every gold pixel takes the label of the nearest labelled pixel
        known = carp >= 0
        if known.any():
            dist, idx = cv2.distanceTransformWithLabels((~known).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
            ys, xs = np.nonzero(known)
            lut = np.zeros(idx.max() + 1, np.int16); lut[idx[known]] = carp[ys, xs]
            lab = lut[idx]
    head = np.zeros(M['mask'].shape, np.uint8)
    s = M['mask'].shape[1] / 564.0
    cv2.fillPoly(head, [np.round(np.array(B_HEAD) * s * 8).astype(np.int32)], 1, cv2.LINE_AA, shift=3)
    return lab, head.astype(bool)


def fields(view):
    """the per-pixel geometry of a view: normals, smoothed normals, height (cm), occlusion, shadow, gold, carp labels"""
    M = load(view)
    m = M['mask']
    N = M['normal'].astype(np.float64)
    N /= np.linalg.norm(N, axis=2, keepdims=True) + 1e-9
    P = M['P']
    h = np.where(m, P[..., 1] * HCM, 0)
    a = lab_a(M['albedo'])
    gold = m & (a < 14)
    gold = cv2.morphologyEx(gold.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    gold = cv2.morphologyEx(gold, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)).astype(bool) & m
    # pixel size in cm on the jar (to keep the occlusion and shadow scales physical in both views)
    if view == 'photo':
        pxcm = 2 * Lt.PH['K']
    else:
        pxcm = json.load(open(os.path.join(OUT, 'glbw_shop.json')))['k'] * Lt.UPC
    D = np.where(m, M['depth'] * HCM, np.nan)
    Df = np.nan_to_num(D, nan=0).astype(np.float32)
    mf = m.astype(np.float32)
    def mblur(A, s):
        return cv2.GaussianBlur(A * mf, (0, 0), s) / np.maximum(cv2.GaussianBlur(mf, (0, 0), s), 1e-4)
    # the relief alone: how far a point stands toward the eye above the jar's smooth body around it (cm)
    rel = np.where(m, mblur(Df, 1.2 * pxcm) - Df, 0).astype(np.float32)
    # occlusion: how far a point lies below its surroundings, at two scales
    c1 = mblur(rel, .08 * pxcm) - rel
    c2 = mblur(rel, .45 * pxcm) - rel
    ao = np.clip(1 - .5 * np.clip(c2 / .35, 0, 1) - .5 * np.clip(c1 / .05, 0, 1), 0, 1)
    # soft shadows cast by the relief only (a height field over the screen), marched toward the light
    L = Lt.L3
    dirxy = np.array([L[0], L[1]]); dirxy /= np.linalg.norm(dirxy)
    rise = L[2] / np.hypot(L[0], L[1])
    sh = np.ones_like(rel)
    H_, W_ = rel.shape
    for t in np.geomspace(.04, 3.0, 28):
        dx, dy = dirxy * t * pxcm
        Mx = np.float32([[1, 0, dx], [0, 1, dy]])
        Rt = cv2.warpAffine(rel, Mx, (W_, H_), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        occl = Rt - (rel + t * rise)
        sh = np.minimum(sh, np.clip(1 - (occl - .02) / (.08 + .15 * t), 0, 1))
    sh = cv2.GaussianBlur(sh, (0, 0), .04 * pxcm)
    Ns = cv2.GaussianBlur(N, (0, 0), .07 * pxcm); Ns /= np.linalg.norm(Ns, axis=2, keepdims=True) + 1e-9
    return dict(M=M, mask=m, N=N, Ns=Ns, h=h, gold=gold, ao=ao, sh=sh, P=P, pxcm=pxcm, D=Df, rel=rel)


def transfer_labels(Fp, lab_p, head_p, Fs):
    """carry the photograph's carp labels and dark head onto another view through the model's own points"""
    sel = Fp['gold'] & (lab_p >= 0)
    pts = Fp['P'][sel]; lv = lab_p[sel]; hv = head_p[sel]
    step = max(1, len(pts) // 120000)
    tree = cKDTree(pts[::step])
    q = Fs['gold']
    d, i = tree.query(Fs['P'][q], distance_upper_bound=.01)
    ok = np.isfinite(d)
    lab = np.full(Fs['mask'].shape, -1, np.int16); head = np.zeros(Fs['mask'].shape, bool)
    li = np.full(len(d), -1, np.int16); hi = np.zeros(len(d), bool)
    li[ok] = lv[::step][i[ok]]; hi[ok] = hv[::step][i[ok]]
    lab[q] = li; head[q] = hi
    return lab, head


def shade(F, lab, head, fit=None, smooth=False):
    """colours of the view: the patina from orientation and height, the metal from orientation and occlusion, per carp"""
    fit = fit or json.load(open(FIT))
    N = F['Ns'] if smooth else F['N']
    m, gold = F['mask'], F['gold']
    col = np.zeros(m.shape + (3,))
    g = m & ~gold
    col[g] = np.clip(Lt.ground_feats(N[g], F['h'][g]) @ np.array(fit['ground']), 0, 255)
    occ = F['ao'] * (.35 + .65 * F['sh'])
    for key, W in fit['metal'].items():
        k, part = key.split(':')
        if k == 'any':
            continue
        sel = gold & (lab == int(k)) & (head if part == 'head' else ~head)
        if sel.any():
            col[sel] = np.clip(Lt.metal_feats(N[sel], occ[sel]) @ np.array(W), 0, 255)
    rest = gold & ~np.isin(lab, [int(k.split(':')[0]) for k in fit['metal'] if not k.startswith('any')])
    if rest.any() and 'any:body' in fit['metal']:
        col[rest] = np.clip(Lt.metal_feats(N[rest], occ[rest]) @ np.array(fit['metal']['any:body']), 0, 255)
    # the relief's shadow on the patina
    shg = (1 - .55 * (1 - F['sh'])) * (.55 + .45 * F['ao'])
    col[g] *= shg[g][:, None]
    return col
