# Guided segmentation of the reference: the hand tracing gives seeds (the core of each form), a watershed on the edges of the
# photograph finds where each form really ends. Output: out/auto.json, the visible outline of every part (reference pixels).
# Only numbers come out of it; the photograph stays outside the repository.
import sys, json, numpy as np, cv2
from scipy import ndimage as ndi
from skimage.segmentation import watershed
from skimage import measure
sys.path.insert(0, '.')
import trace as T
import mk
from seeds import SEEDS

im = cv2.imread('out/ref.jpg').astype(np.float32) / 255
Lc = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
H, W = Lc.shape
Ls = cv2.GaussianBlur(Lc, (0, 0), 1.8)
G = np.hypot(cv2.Sobel(Ls, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(Ls, cv2.CV_32F, 0, 1, ksize=3))
# the stippled ground is full of small edges: damp them with the local roughness so that form outlines win
hp = cv2.GaussianBlur(Lc, (0, 0), 1.0) - cv2.GaussianBlur(Lc, (0, 0), 3.0)
rough = np.sqrt(cv2.GaussianBlur(hp * hp, (0, 0), 6))
G = G / (1 + 18 * rough)
G = cv2.GaussianBlur(G, (0, 0), 1.0)

sil = mk.poly_mask(mk.silhouette_pts(), 1.0, (H, W), n=1)
markers = np.zeros((H, W), np.int32)
markers[~cv2.dilate(sil.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)] = 1      # outside
allp = np.zeros((H, W), bool)
def kit_mask(p):
    if 'axis' in p or 'blob' in p:
        return mk.swept(p)[2]
    return mk.poly_mask(p['pts'])


mk.AMPK = 1.0
mk.OPT.setdefault('fit', '1')
masks = [kit_mask(p) for p in T.PARTS]
for m in masks:
    allp |= m
for i, p in enumerate(T.PARTS):
    key = '%s.%s' % (p['fig'], p['name'])
    if key in SEEDS:
        # explicit scribbles drawn inside the visible form
        for pl in SEEDS[key]:
            cv2.polylines(markers, [np.array(pl, np.int32)], False, i + 3, 5)
        continue
    # otherwise: core of what the hand tracing says is visible (the part minus the parts drawn in front of it)
    vis = masks[i].copy()
    for j, q in enumerate(T.PARTS):
        if q['layer'] > p['layer']:
            vis &= ~masks[j]
    lbl, n = ndi.label(vis)
    for k in range(1, n + 1):
        comp = lbl == k
        if comp.sum() < 60:
            continue
        d = ndi.distance_transform_edt(comp)
        core = d > max(3, .5 * d.max())
        markers[core & (markers == 0)] = i + 3
far = ndi.distance_transform_edt(~allp)
rq = rough > np.percentile(rough[sil], 60)
markers[(far > 22) & sil & rq & (markers == 0)] = 2                                                     # ground
for gx, gy, r in getattr(T, 'GROUND', []):
    cv2.circle(markers, (gx, gy), r, 2, -1)
lab = watershed(G, markers)
np.save('out/lab.npy', lab.astype(np.int16))
json.dump(['%s.%s' % (p['fig'], p['name']) for p in T.PARTS], open('out/lab_keys.json', 'w'))
out = {}
for i, p in enumerate(T.PARTS):
    reg = lab == i + 3
    reg = ndi.binary_opening(reg, iterations=2)
    reg = ndi.binary_fill_holes(reg)
    lbl, n = ndi.label(reg)
    polys = []
    for k in range(1, n + 1):
        comp = lbl == k
        if comp.sum() < 300:
            continue
        f = cv2.GaussianBlur(comp.astype(np.float32), (0, 0), 1.5)
        cs = measure.find_contours(np.pad(f, 1), .5)
        if not cs:
            continue
        c = max(cs, key=len)[:, ::-1] - 1
        r = mk.resample(c, 6.0)
        if r is not None:
            polys.append([[round(x, 1), round(y, 1)] for x, y in r])
    if polys:
        out['%s.%s' % (p['fig'], p['name'])] = polys
json.dump(out, open('out/auto.json', 'w'))
# overlay for checking
en = cv2.imread('out/clahe.jpg')
vis = (en * .75).astype(np.uint8)
rng = np.random.default_rng(3)
for k, polys in out.items():
    col = tuple(int(v) for v in rng.integers(60, 255, 3))
    for pts in polys:
        cv2.polylines(vis, [np.round(np.array(pts)).astype(np.int32)], True, col, 2, cv2.LINE_AA)
    c = np.mean(polys[0], 0)
    cv2.putText(vis, k, (int(c[0]) - 30, int(c[1])), cv2.FONT_HERSHEY_SIMPLEX, .45, col, 1)
for key, pls in SEEDS.items():
    for pl in pls:
        cv2.polylines(vis, [np.array(pl, np.int32)], False, (255, 255, 255), 1, cv2.LINE_AA)
cv2.imwrite('out/seg2.jpg', vis, [cv2.IMWRITE_JPEG_QUALITY, 90])
print(len(out), 'parts')
