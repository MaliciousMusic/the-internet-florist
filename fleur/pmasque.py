"""pmasque.py: the mask of ONE piece (petal, tepal, sepal, leaf) on a photograph, by Segment Anything prompted from its frame: points on the
midrib inside, points beyond its edges, its base and its tip outside. Replaces GrabCut and the colour gate of apparence.py piece, which
glued a touching neighbour of the same colour to the piece or cut a shaded half off. Runs in vases5/.venv-depth (SAM already downloaded).

  vases5/.venv-depth/Scripts/python fleur/pmasque.py <img> "<frame>" <out.png> [--marge 1.5]
<frame> as apparence.py: "x,y;x,y;...;w" (midrib from base to tip, then the half-width at the widest). Writes <out.png> (the image's size,
255 = piece) and prints the chosen candidate's score, its share of the frame band and its leak. apparence.py piece --masque <out.png>."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def curve(pts, n):
    P0 = np.array(pts, float); t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P0, axis=0), axis=1))]); t /= t[-1]
    v = np.linspace(0, 1, n); P = np.stack([np.interp(v, t, P0[:, 0]), np.interp(v, t, P0[:, 1])], 1)
    D = np.gradient(P, axis=0); D /= np.linalg.norm(D, axis=1, keepdims=True) + 1e-9
    return v, P, np.stack([-D[:, 1], D[:, 0]], 1), D


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('img'); ap.add_argument('frame'); ap.add_argument('out'); ap.add_argument('--marge', type=float, default=1.5)
    o = ap.parse_args()
    q = o.frame.split(';'); pts = [list(map(float, a.split(','))) for a in q[:-1]]; w = float(q[-1])
    img = cv2.imread(o.img)[..., ::-1].copy(); H, W = img.shape[:2]
    v, P, Nn, D = curve(pts, 41)
    L = float(np.linalg.norm(np.diff(P, axis=0), axis=1).sum()); pad = int(max(w * 2.2, L * .25)) + 10
    x0, y0 = np.maximum(0, P.min(0) - pad).astype(int); x1, y1 = np.minimum([W, H], P.max(0) + pad).astype(int)
    crop = img[y0:y1, x0:x1]; off = np.array([x0, y0])
    pos = [P[int(k * 40)] - off for k in (.12, .3, .5, .7, .86)]
    neg = []
    for k in (.2, .45, .7):
        i = int(k * 40); neg += [P[i] + Nn[i] * w * o.marge - off, P[i] - Nn[i] * w * o.marge - off]
    neg += [P[-1] + D[-1] * w * .7 - off, P[0] - D[0] * w * .5 - off]
    neg = [p for p in neg if 0 <= p[0] < crop.shape[1] and 0 <= p[1] < crop.shape[0]]
    import torch
    from transformers import SamModel, SamProcessor
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))
    proc = SamProcessor.from_pretrained('facebook/sam-vit-base'); model = SamModel.from_pretrained('facebook/sam-vit-base').eval()
    # the frame band: the pixels within the half-width of the midrib, between base and tip
    yy, xx = np.mgrid[:crop.shape[0], :crop.shape[1]]; Q = np.stack([xx.ravel(), yy.ravel()], 1).astype(float)
    from scipy.spatial import cKDTree
    vd, Pd, Nd, Dd = curve(pts, 400); d, i = cKDTree(Pd - off).query(Q); d = d.reshape(xx.shape); i = i.reshape(xx.shape)
    band = (d < w * 1.05) & (i > 2) & (i < 397); far = d > w * 1.35
    axis = (d < w * .2) & (i > 30) & (i < 370)
    lab = cv2.cvtColor(crop, cv2.COLOR_RGB2LAB).astype(float); lab[..., 0] *= 100 / 255; lab[..., 1:] -= 128
    # the piece's own colour at each height: the median of the axis disc there, smoothed along the midrib
    ax = np.full((400, 3), np.nan)
    for k in range(400):
        s_ = (np.abs(i - k) < 12) & (d < w * .25)
        if s_.sum() > 8: ax[k] = np.median(lab[s_], 0)
    okk = ~np.isnan(ax[:, 0])
    for c in range(3): ax[:, c] = np.interp(np.arange(400), np.nonzero(okk)[0], ax[okk, c]) if okk.any() else 0
    def run(pp, lb):
        inp = proc(images=crop, input_points=[[pp]], input_labels=[[lb]], return_tensors='pt')
        with torch.no_grad(): out = model(**inp, multimask_output=True)
        ms = proc.image_processor.post_process_masks(out.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
        sc = out.iou_scores[0, 0].numpy(); best = None
        for k in range(ms.shape[0]):
            m = ms[k]; cover = (m & axis).sum() / max(1, axis.sum()); fill = (m & band).sum() / max(1, band.sum()); leak = (m & far).sum() / max(1, m.sum())
            s = sc[k] + cover + .5 * fill - 3 * leak
            if best is None or s > best[0]: best = (s, k, cover, fill, leak, float(sc[k]))
        return ms[best[1]], best
    pp = [list(map(float, p)) for p in pos + neg]; lb = [1] * len(pos) + [0] * len(neg); rounds = 0
    m, best = run(pp, lb)
    # two rounds at most: the parts of the mask far from the piece's colour at their height (a neighbour of another tone that SAM took
    # with it: the pale petaloids over a guard's base) get negative points at their deepest pixel, and SAM is asked again
    for _ in range(2):
        de = np.linalg.norm(lab - ax[i], axis=2); intr = m & (de > 22)
        n_, lb_, st, _ = cv2.connectedComponentsWithStats(intr.astype(np.uint8)); added = 0
        for k in range(1, n_):
            if st[k, cv2.CC_STAT_AREA] < .005 * m.sum(): continue
            dt = cv2.distanceTransform((lb_ == k).astype(np.uint8), cv2.DIST_L2, 3); y_, x_ = np.unravel_index(np.argmax(dt), dt.shape)
            pp.append([float(x_), float(y_)]); lb.append(0); added += 1
        if not added: break
        m2, b2 = run(pp, lb); rounds += 1
        if (m2 & axis).sum() < .85 * (m & axis).sum(): break   # the new mask lost the piece itself: keep the previous one
        m, best = m2, b2
    n, lab = cv2.connectedComponents(m.astype(np.uint8))
    if n > 2:
        ids = lab[axis & m]; m = lab == (np.bincount(ids).argmax() if len(ids) else 1)
    # small holes inside the piece (SAM's speckle on a soft fold) are filled; a real gap (a hole bigger than 0.5 % of the piece) stays
    inv = (~m).astype(np.uint8); nh, lh, sh_, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    for k in range(1, nh):
        x_, y_, w_, h_, a_ = sh_[k]
        if a_ < .005 * m.sum() and x_ > 0 and y_ > 0 and x_ + w_ < m.shape[1] and y_ + h_ < m.shape[0]: m[lh == k] = True
    full = np.zeros((H, W), np.uint8); full[y0:y1, x0:x1] = m.astype(np.uint8) * 255; cv2.imwrite(o.out, full)
    print(json.dumps({'score': round(best[5], 3), 'axe': round(float(best[2]), 3), 'bande': round(float(best[3]), 3), 'fuite': round(float(best[4]), 3), 'tours': rounds}))


if __name__ == '__main__':
    main()
