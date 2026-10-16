# The relief decor cut out on the model's own slope map (unwrap.py) by Segment Anything (SAM, facebook/sam-vit-base, run on
# the CPU): the slope map draws every outline (body, fins, tail) crisply; each fish gets a few sure points inside (from the
# relief-and-texture score of segdecor.py) and sure points of bare body around, and SAM follows the real outline between them.
#   .venv-depth/Scripts/python samdecor.py <vase>   ->  <vase>/out/unwrap_decor.png (and _apercu/unwrap_sam.jpg)
import sys, os, json
import numpy as np, cv2, torch
from scipy.ndimage import binary_fill_holes
from transformers import SamModel, SamProcessor

HERE = os.path.dirname(os.path.abspath(__file__))
V = sys.argv[1]
OPT = dict(a.split('=') for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
out = os.path.join(HERE, V, 'out')
cfg = json.load(open(os.path.join(HERE, V, 'glbvase.json'), encoding='utf-8'))
torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))

r = np.load(os.path.join(out, 'unwrap_r.npy')); S = np.load(os.path.join(out, 'unwrap_score.npy'))
H, W = r.shape
m = r > 0
hh = 1 - (np.arange(H) + .5) / H
zone = m & (hh[:, None] < cfg['relief'].get('hmax', 1)) & (hh[:, None] > .03)
# the seam of the unrolled map is moved to the meridian with the least decor, so no fish is cut in two
shift = int(np.argmin(np.convolve((S * zone).sum(0), np.ones(31), 'same')))
roll = lambda a: np.roll(a, -shift, axis=1)
r, S, zone = roll(r), roll(S), roll(zone)
# the slope map (what the owner reads the outlines on): bright = flat, dark = steep
rb = cv2.GaussianBlur(r.astype(np.float32), (0, 0), 1.0)
g = np.hypot(cv2.Sobel(rb, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(rb, cv2.CV_32F, 0, 1, ksize=3)) / 8
img = (255 - np.clip(g / np.percentile(g[zone], 97), 0, 1) * 255).astype(np.uint8)
img3 = np.dstack([img] * 3)

proc = SamProcessor.from_pretrained('facebook/sam-vit-base')
model = SamModel.from_pretrained('facebook/sam-vit-base').eval()

def sam_cut(x0, y0, x1, y1, pos, neg, comp):
    """SAM on a crop of the slope map with positive and negative points; the mask that best holds the seed and leaks least"""
    P = np.vstack([np.array(pos), np.array(neg).reshape(-1, 2)]).tolist(); Lb = [1] * len(pos) + [0] * len(neg)
    inp = proc(images=img3[y0:y1, x0:x1], input_points=[[P]], input_labels=[[Lb]], return_tensors='pt')
    with torch.no_grad():
        o = model(**inp, multimask_output=True)
    masks = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = o.iou_scores[0, 0].numpy()
    best, bv = None, -1e9
    for j in range(masks.shape[0]):
        mk = masks[j]
        cover = (mk & comp).sum() / max(1, comp.sum())
        leak = (mk & (far[y0:y1, x0:x1] > F('neg_gap', 25))).sum() / max(1, mk.sum())
        v = sc[j] + cover - 3 * leak
        if v > bv:
            best, bv = mk, v
    return best


strong = zone & (S > F('s_seed', 1.8))
strong = cv2.erode(strong.astype(np.uint8), np.ones((5, 5), np.uint8))
weak = zone & (S > F('s_lo', .9))
n, lb, st, cen = cv2.connectedComponentsWithStats(strong)
far = cv2.distanceTransform((~weak).astype(np.uint8), cv2.DIST_L2, 5)
dec = np.zeros((H, W), bool)
rng = np.random.default_rng(1)
done = 0
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] < F('seed_px', 400):
        continue
    x, y, w, h = st[i, :4]
    # each fish cut twice, in a tight and a wide frame (the wide one sees its overlapping neighbours, the tight one its own
    # body): the union keeps the best of both
    for mg, pad in ((.45, 60), (F('margin', .9), 120)):
        mx, my = int(w * mg) + pad, int(h * mg) + pad
        x0, y0, x1, y1 = max(0, x - mx), max(0, y - my), min(W, x + w + mx), min(H, y + h + my)
        comp = (lb[y0:y1, x0:x1] == i)
        ys, xs = np.where(comp)
        pts = np.c_[xs, ys].astype(np.float32)
        k = min(6, len(pts))
        _, _, cc = cv2.kmeans(pts, k, None, (cv2.TERM_CRITERIA_MAX_ITER, 20, 1), 2, cv2.KMEANS_PP_CENTERS)
        pos = [pts[np.argmin(((pts - c) ** 2).sum(1))] for c in cc]
        nb = np.argwhere((far[y0:y1, x0:x1] > F('neg_gap', 25)) & zone[y0:y1, x0:x1])
        neg = nb[rng.choice(len(nb), min(8, len(nb)), replace=False)][:, ::-1].astype(np.float32) if len(nb) else np.zeros((0, 2))
        best = sam_cut(x0, y0, x1, y1, pos, neg, comp)
        dec[y0:y1, x0:x1] |= best & zone[y0:y1, x0:x1]
    done += 1
print('SAM: %d fish seeds' % done)
# second pass: pieces with a moderate score that touch the decor but were left out (ventral and anal fins, a tail's tip)
rest = weak & ~dec
rest = cv2.morphologyEx(rest.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n3, l3, s3, _ = cv2.connectedComponentsWithStats(rest)
touch = cv2.dilate(dec.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
added = 0
for i in range(1, n3):
    if s3[i, cv2.CC_STAT_AREA] < F('fin_px', 300):
        continue
    ci = l3 == i
    if not (ci & touch).any():
        continue
    x, y, w, h = s3[i, :4]
    x0, y0, x1, y1 = max(0, x - w - 80), max(0, y - h - 80), min(W, x + 2 * w + 80), min(H, y + 2 * h + 80)
    comp = ci[y0:y1, x0:x1]
    d = cv2.distanceTransform(comp.astype(np.uint8), cv2.DIST_L2, 5)
    py, px = np.unravel_index(np.argmax(d), d.shape)
    nb = np.argwhere((far[y0:y1, x0:x1] > F('neg_gap', 25)) & zone[y0:y1, x0:x1])
    neg = nb[rng.choice(len(nb), min(6, len(nb)), replace=False)][:, ::-1].astype(np.float32) if len(nb) else np.zeros((0, 2))
    mk = sam_cut(x0, y0, x1, y1, [np.array([px, py], np.float32)], neg, comp)
    # keep it only if it stays on raised, agitated geometry (a fin), not on the bare body
    if (mk & (far[y0:y1, x0:x1] > 8)).sum() < .1 * max(1, mk.sum()):
        dec[y0:y1, x0:x1] |= mk & zone[y0:y1, x0:x1]; added += 1
print('second pass: %d pieces added' % added)
# fill what the outlines enclose (fish interiors, scale gaps), drop specks, smooth the border
dec = binary_fill_holes(dec)
n2, l2, s2, _ = cv2.connectedComponentsWithStats(dec.astype(np.uint8))
for i in range(1, n2):
    if s2[i, cv2.CC_STAT_AREA] < F('min_px', 1500):
        dec[l2 == i] = False
dec = (cv2.GaussianBlur(dec.astype(np.float32), (0, 0), 1.5) > .5) & zone
dec = np.roll(dec, shift, axis=1)
cv2.imwrite(os.path.join(out, 'unwrap_decor.png'), (dec * 255).astype(np.uint8))
v = np.roll(img3, shift, axis=1).copy()
v[dec] = (v[dec] * .55 + np.array([60, 200, 240]) * .45).astype(np.uint8)
cs, _ = cv2.findContours(dec.astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
cv2.drawContours(v, cs, -1, (0, 0, 220), 3)
cv2.imwrite(os.path.join(HERE, '_apercu', 'unwrap_sam.jpg'), cv2.resize(v, (2048, 1024), interpolation=cv2.INTER_AREA))
print('decor %.1f %%' % (100 * dec[m].mean() if True else 0))
