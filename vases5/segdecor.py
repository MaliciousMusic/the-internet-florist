# The relief decor of a vessel segmented on its unrolled geometry (unwrap.py): relief above the local body surface, then
# hysteresis (clear relief seeds, low relief connected to it joins: fins, tails), holes filled. Output: the decor label map in
# (turn angle, height), read back by every view through its position map.
#   .venv-depth/Scripts/python segdecor.py <vase> [strong=.006 weak=.0018 ...]
import sys, os, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
V = sys.argv[1]
OPT = dict(a.split('=') for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
out = os.path.join(HERE, V, 'out')
cfg = json.load(open(os.path.join(HERE, V, 'glbvase.json'), encoding='utf-8'))
r = np.load(os.path.join(out, 'unwrap_r.npy')); H, W = r.shape
m = r > 0
hh = 1 - (np.arange(H) + .5) / H                      # top row = 1
body0 = np.array([np.percentile(row[row > 0], 30) if (row > 0).sum() > 50 else 0 for row in r])
rel0 = np.where(m, r - body0[:, None], 0).astype(np.float32)


def blur_wrap(a, s):
    """gaussian blur that wraps around the turn (left and right edges are the same meridian)"""
    p = int(3 * s) + 1
    a2 = np.hstack([a[:, -p:], a, a[:, :p]])
    return cv2.GaussianBlur(a2, (0, 0), s)[:, p:-p]


# the local body: smooth relief of the bare surface (decor kept out), in two passes
sig = F('body_sigma', 70)
rel = rel0.copy()
for _ in range(3):
    raised = rel > F('strong', .006)
    raised = cv2.dilate(raised.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(F('keepout', 45)) * 2 + 1,) * 2)).astype(bool)
    bare = m & ~raised
    num = blur_wrap(np.where(bare, rel0, 0).astype(np.float32), sig); den = blur_wrap(bare.astype(np.float32), sig)
    rel = np.where(m, rel0 - np.where(den > .05, num / np.maximum(den, 1e-6), 0), 0).astype(np.float32)
lip_h = cfg['lip_h']; hmax = cfg['relief'].get('hmax', 1)
zone = m & (hh[:, None] < hmax) & (hh[:, None] > F('hmin', .03))
# the decor score, read on the model's geometry: relief above the local body + the agitation of the surface (scales, fin rays,
# gill and eye grooves make the radius ripple; the bare body is smooth). Both are measured on the body itself.
pw = 40
r2 = np.hstack([r[:, -pw:], r, r[:, :pw]]).astype(np.float32)
lap = np.abs(cv2.Laplacian(cv2.GaussianBlur(r2, (0, 0), 1.0), cv2.CV_32F, ksize=3))
E = cv2.GaussianBlur(lap, (0, 0), F('esig', 7))[:, pw:-pw]
e50, e95 = np.percentile(E[zone], [50, 95])
S = np.clip(rel / F('rel_unit', .004), 0, 3) + np.clip((E - e50) / (e95 - e50), 0, 3)
# hysteresis: a clear score seeds, a moderate score connected to it joins (fins, the soft edge of a body)
strong = zone & (S > F('s_hi', 1.6))
weak = zone & (S > F('s_lo', .9))
n, lb = cv2.connectedComponents(weak.astype(np.uint8))
ids = np.unique(lb[strong]); ids = ids[ids > 0]
dec = np.isin(lb, ids)
holes = ~dec & zone
nh, lh, sh, _ = cv2.connectedComponentsWithStats(holes.astype(np.uint8))
for i in range(1, nh):
    if sh[i, cv2.CC_STAT_AREA] < F('hole_px', 3000):
        dec |= lh == i
n2, l2, s2, _ = cv2.connectedComponentsWithStats(dec.astype(np.uint8))
for i in range(1, n2):
    if s2[i, cv2.CC_STAT_AREA] < F('min_px', 1500):
        dec[l2 == i] = False
# smooth border (wrap-aware), no jagged steps
pad = 20
d3 = np.hstack([dec[:, -pad:], dec, dec[:, :pad]]).astype(np.float32)
dec = (cv2.GaussianBlur(d3, (0, 0), F('smooth', 2.0))[:, pad:-pad] > .5) & zone
np.save(os.path.join(out, 'unwrap_score.npy'), S.astype(np.float32))
# give back to the body the thin band the edge dilation took around each fish, where the relief is still bare
np.save(os.path.join(out, 'unwrap_rel.npy'), rel)
cv2.imwrite(os.path.join(out, 'unwrap_decor.png'), (dec * 255).astype(np.uint8))
v = np.clip((rel + .004) / .03, 0, 1); v = cv2.applyColorMap((v * 255).astype(np.uint8), cv2.COLORMAP_TURBO)
cs, _ = cv2.findContours(dec.astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
cv2.drawContours(v, cs, -1, (255, 255, 255), 3)
cv2.imwrite(os.path.join(HERE, '_apercu', 'unwrap_seg.jpg'), cv2.resize(v, (2048, 1024), interpolation=cv2.INTER_AREA))
print('decor %.1f %% of the surface, %d pieces' % (100 * dec[m].mean(), len(cs)))
