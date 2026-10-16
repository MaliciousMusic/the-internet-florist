# The tube lines of the snowdrop vase (the raised slip trails that outline every colour), from the photograph without its
# light (paint.py: out/unlit.npy, on the unrolled body): a ridge filter finds the thin dark lines, they are thinned to their
# centre, followed into polylines, small gaps closed, spurs pruned, then smoothed. Each line keeps its measured width.
#   -> out/cernes.json: [{"p": [[x, y], ...] (unrolled pixels), "w": width (unrolled pixels)}], out/cernes_mask.png,
#      out/cernes_check.jpg
#   .venv-depth/Scripts/python cernes.py [lo=3 hi=8 minlen=10 gap=7]
import sys, os, json
import numpy as np, cv2
from skimage.filters import sato, apply_hysteresis_threshold
from skimage.morphology import skeletonize
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import mesure  # noqa: E402

OUT = os.path.join(HERE, 'out')
KW = dict(a.split('=') for a in sys.argv[1:] if '=' in a)
# src=photo: the photograph without its light (paint.py); src=tex: the GLB's own texture, unrolled (its own drawing, whole turn)
SRC = KW.get('src', 'photo'); SFX = '' if SRC == 'photo' else '_' + SRC


def source():
    if SRC == 'photo':
        alb = np.load(os.path.join(OUT, 'unlit.npy')).astype(np.float32)
        return alb, np.load(os.path.join(OUT, 'unlit_known.npy')), cv2.imread(os.path.join(OUT, 'paint.png'), 0) < 255
    alb = cv2.imread(os.path.join(OUT, 'decor_tex.png'))[..., ::-1].astype(np.float32) / 255
    allt = np.ones(alb.shape[:2], bool)
    return alb, allt, allt
G = lambda k, d: float(KW.get(k, d))
NB8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def trace(sk):
    """polylines of a one-pixel skeleton, cut at end points and junctions"""
    H, W = sk.shape
    pts = set(zip(*np.where(sk)))
    deg = {p: sum((p[0] + dy, p[1] + dx) in pts for dy, dx in NB8) for p in pts}
    nodes = {p for p, d in deg.items() if d != 2}
    used = set(); lines = []

    def walk(a, b):
        line = [a, b]; prev, cur = a, b
        while cur not in nodes:
            nxt = [(cur[0] + dy, cur[1] + dx) for dy, dx in NB8 if (cur[0] + dy, cur[1] + dx) in pts and (cur[0] + dy, cur[1] + dx) != prev
                   and (cur[0] + dy, cur[1] + dx) not in line[-3:]]
            if not nxt:
                break
            prev, cur = cur, nxt[0]; line.append(cur)
        return line

    for a in nodes:
        for dy, dx in NB8:
            b = (a[0] + dy, a[1] + dx)
            if b in pts and (a, b) not in used:
                ln = walk(a, b)
                used.add((a, b)); used.add((ln[-1], ln[-2]) if len(ln) > 1 else (a, b))
                for i in range(len(ln) - 1):
                    used.add((ln[i], ln[i + 1])); used.add((ln[i + 1], ln[i]))
                lines.append(ln)
    # closed loops without any node
    rest = pts - {p for ln in lines for p in ln}
    while rest:
        a = rest.pop()
        nb = [(a[0] + dy, a[1] + dx) for dy, dx in NB8 if (a[0] + dy, a[1] + dx) in rest]
        if not nb:
            continue
        nodes.add(a); ln = walk(a, nb[0]); nodes.discard(a)
        rest -= set(ln); lines.append(ln + [a])
    return [np.array([(x, y) for y, x in ln], np.float32) for ln in lines]


def smooth(P, s):
    if len(P) < 5:
        return P
    k = int(3 * s) | 1
    pad = np.vstack([np.repeat(P[:1], k, 0), P, np.repeat(P[-1:], k, 0)])
    g = cv2.getGaussianKernel(2 * k + 1, s).ravel()
    Q = np.stack([np.convolve(pad[:, i], g, 'same')[k:-k] for i in (0, 1)], 1)
    Q[0], Q[-1] = P[0], P[-1]
    return Q


def main():
    alb, _, seen = source()
    L = mesure.to_lab((np.clip(alb, 0, 1)[..., ::-1] * 255).astype(np.uint8))[..., 0]
    rb = sato(L, sigmas=[1, 1.5, 2], black_ridges=True)
    inner = cv2.erode(seen.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
    rb[~inner] = 0
    m = apply_hysteresis_threshold(rb, G('lo', 3), G('hi', 8))
    n_, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    m = np.isin(lb, np.where(st[:, cv2.CC_STAT_AREA] >= G('minarea', 25))[0]) & (lb > 0)
    sk = skeletonize(m)
    # small gaps: an end point reaches the nearest other line within 'gap' pixels, ahead of it
    dist = cv2.distanceTransform((~m).astype(np.uint8), cv2.DIST_L2, 5)
    halfw = cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5)
    lines = trace(sk)
    lines = [ln for ln in lines if len(ln) >= G('minlen', 10) or True]
    # prune spurs: short lines with a free end
    ends = {}
    for i, ln in enumerate(lines):
        for e in (tuple(ln[0].astype(int)), tuple(ln[-1].astype(int))):
            ends[e] = ends.get(e, 0) + 1
    def free(p):
        x, y = int(p[0]), int(p[1])
        return sum(1 for ln in lines for q in (ln[0], ln[-1]) if abs(q[0] - x) <= 1 and abs(q[1] - y) <= 1) <= 1
    keep = []
    for ln in lines:
        if len(ln) < G('minlen', 10) and (free(ln[0]) or free(ln[-1])):
            continue
        keep.append(ln)
    lines = keep
    # bridges over gaps
    skp = np.array(np.where(sk)).T[:, ::-1].astype(np.float32)
    gap = G('gap', 7)
    bridges = 0
    for ln in list(lines):
        if len(ln) < 6:
            continue
        for end, inner_p in ((ln[0], ln[min(5, len(ln) - 1)]), (ln[-1], ln[max(-6, -len(ln))])):
            if not free(end):
                continue
            d = end - inner_p; d /= np.linalg.norm(d) + 1e-6
            v = skp - end
            dd = np.linalg.norm(v, axis=1)
            ahead = (v @ d) > .5 * dd
            own = np.zeros(len(skp), bool)
            cand = (dd > 2) & (dd < gap) & ahead
            if cand.any():
                j = np.argmin(np.where(cand, dd, 1e9))
                lines.append(np.array([end, skp[j]], np.float32)); bridges += 1
    out = []
    for ln in lines:
        Q = smooth(ln, G('s', 2.0))
        xs, ys = np.clip(ln[:, 0].astype(int), 0, L.shape[1] - 1), np.clip(ln[:, 1].astype(int), 0, L.shape[0] - 1)
        w = float(np.median(halfw[ys, xs])) * 2 if len(ln) > 2 else 2.0
        out.append(dict(p=[[round(float(x), 2), round(float(y), 2)] for x, y in Q], w=round(max(1.5, w), 2)))
    json.dump(out, open(os.path.join(OUT, 'cernes%s.json' % SFX), 'w'))
    mk = np.zeros(L.shape, np.uint8)
    for c in out:
        cv2.polylines(mk, [np.round(np.array(c['p']) * 4).astype(np.int32)], False, 255, max(1, int(round(c['w']))), cv2.LINE_AA, shift=2)
    cv2.imwrite(os.path.join(OUT, 'cernes_mask%s.png' % SFX), mk)
    ys, xs = np.where(seen); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    im = (np.clip(alb, 0, 1)[..., ::-1] * 255).astype(np.uint8)
    ov = im.copy(); ov[mk > 100] = (0, 0, 255)
    chk = np.hstack([im[y0:y1, x0:x1], ov[y0:y1, x0:x1], cv2.cvtColor(255 - mk[y0:y1, x0:x1], cv2.COLOR_GRAY2BGR)])
    cv2.imwrite(os.path.join(OUT, 'cernes_check%s.jpg' % SFX), cv2.resize(chk, None, fx=.6, fy=.6))
    print('%d lines, %d bridges, median width %.1f px' % (len(out), bridges, np.median([c['w'] for c in out])))


if __name__ == '__main__':
    main()
