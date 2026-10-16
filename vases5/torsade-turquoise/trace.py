# Traces the folds of the reference (step 3 of the standard): the dark lines (glass seen edge-on, thick, at the edges of
# the voiles and in the valleys of the ribs) and the light lines (threads of light along the rims, crests of the ribs),
# followed by computation (difference of two blurs, skeleton, walk along it), smoothed, each with its measured width and
# strength. Writes traces.json: numbers only (photo pixels), the photograph itself stays in out/.
#   python trace.py [key=value ...]
import sys, json
import numpy as np, cv2
from skimage.morphology import skeletonize

OPT = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
im = cv2.imread('out/ref.jpg')
M = cv2.imread('out/vase_mask.png', 0) > 127
S = cv2.imread('out/stems_mask.png', 0) > 127
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
imb = cv2.GaussianBlur(im.astype(np.float32), (0, 0), .7)
UP = 2                                   # traced at twice the photograph's resolution (sub-pixel)
G = cv2.resize(g, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC)
Mu = cv2.resize(M.astype(np.uint8), None, fx=UP, fy=UP, interpolation=cv2.INTER_NEAREST) > 0
Su = cv2.resize(cv2.dilate(S.astype(np.uint8), np.ones((3, 3), np.uint8)), None, fx=UP, fy=UP, interpolation=cv2.INTER_NEAREST) > 0
inner = cv2.erode(Mu.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0     # the silhouette itself is drawn by the outline
s1, s2 = F('s1', 1.2) * UP, F('s2', 3.5) * UP
dog = cv2.GaussianBlur(G, (0, 0), s1) - cv2.GaussianBlur(G, (0, 0), s2)
NB = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def walk(sk):
    """polylines along a skeleton: from end points, then the loops left over; split at junctions"""
    pts = set(zip(*np.nonzero(sk)))
    deg = {p: sum((p[0] + a, p[1] + b) in pts for a, b in NB) for p in pts}
    seen = set(); lines = []
    starts = [p for p in pts if deg[p] == 1] + [p for p in pts if deg[p] > 2] + list(pts)
    for s0 in starts:
        if s0 in seen:
            continue
        for nb in [(s0[0] + a, s0[1] + b) for a, b in NB]:
            if nb not in pts or nb in seen:
                continue
            line = [s0, nb]; seen.add(s0); seen.add(nb); cur = nb
            while deg[cur] == 2:
                nxt = [(cur[0] + a, cur[1] + b) for a, b in NB if (cur[0] + a, cur[1] + b) in pts and (cur[0] + a, cur[1] + b) not in seen]
                if not nxt:
                    break
                cur = nxt[0]; seen.add(cur); line.append(cur)
            lines.append(line)
        seen.add(s0)
    return lines


def smooth_line(P, w=5):
    P = np.asarray(P, float)
    if len(P) < 2 * w + 1:
        return P
    k = np.ones(2 * w + 1) / (2 * w + 1)
    Q = np.stack([np.convolve(np.pad(P[:, i], w, mode='edge'), k, 'valid') for i in range(2)], -1)
    return Q


out = []
for sign, name in ((-1, 'dark'), (1, 'light')):
    v = sign * dog
    t = F('t_' + name, 4.0 if name == 'dark' else 3.5)
    sel = (v > t) & inner & ~Su
    sel = cv2.morphologyEx(sel.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
    sk = skeletonize(sel)
    for L in walk(sk):
        if len(L) < F('minlen', 14) * UP:
            continue
        P = smooth_line([(x, y) for y, x in L], 3)
        # strength (the depth of the line in the difference of blurs) and width (its half-strength band), measured along it
        ys = np.clip(np.round(P[:, 1]).astype(int), 0, G.shape[0] - 1); xs = np.clip(np.round(P[:, 0]).astype(int), 0, G.shape[1] - 1)
        st = v[ys, xs]
        wid = []
        for (x, y), s_ in zip(P[::4], st[::4]):
            r = 1
            while r < 12 and v[int(min(max(y + r, 0), G.shape[0] - 1)), int(min(max(x, 0), G.shape[1] - 1))] > s_ / 2 \
                    and v[int(min(max(y - r, 0), G.shape[0] - 1)), int(min(max(x, 0), G.shape[1] - 1))] > s_ / 2:
                r += 1
            r2 = 1
            while r2 < 12 and v[int(min(max(y, 0), G.shape[0] - 1)), int(min(max(x + r2, 0), G.shape[1] - 1))] > s_ / 2 \
                    and v[int(min(max(y, 0), G.shape[0] - 1)), int(min(max(x - r2, 0), G.shape[1] - 1))] > s_ / 2:
                r2 += 1
            wid.append(min(r, r2))
        P = P[::2] / UP                                   # back to photo pixels, every pixel
        # its colour (spectrography along the line): median of the photograph, lightly blurred, on its centre
        yi = np.clip(np.round(P[:, 1]).astype(int), 0, im.shape[0] - 1); xi = np.clip(np.round(P[:, 0]).astype(int), 0, im.shape[1] - 1)
        col = np.median(imb[yi, xi], 0)[::-1]
        out.append(dict(kind=name, pts=[[round(float(a), 2), round(float(b), 2)] for a, b in P],
                        strength=round(float(np.median(st)), 1), width=round(float(np.median(wid)) / UP, 2),
                        rgb=[int(round(float(c))) for c in col]))
json.dump(out, open('traces.json', 'w'), separators=(',', ':'))
print(len(out), 'lines:', sum(o['kind'] == 'dark' for o in out), 'dark,', sum(o['kind'] == 'light' for o in out), 'light,',
      sum(len(o['pts']) for o in out), 'points')
