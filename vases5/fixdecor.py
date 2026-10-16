# Last touch of the unrolled decor mask, by the geometry's own evidence: notches and bites in a fish (where the relief-and-texture
# score is clearly a fish's) are filled; a rim of decor lying on bare, smooth body (low score) is trimmed. Writes back
# <vase>/out/unwrap_decor.png and a before/after check of the shop view.
#   .venv-depth/Scripts/python fixdecor.py <vase> [close=21 s_fill=1.0 s_trim=.55 trim=6]
import sys, os
import numpy as np, cv2
from scipy.ndimage import binary_fill_holes
HERE = os.path.dirname(os.path.abspath(__file__))
V = sys.argv[1]; OPT = dict(a.split('=') for a in sys.argv[2:] if '=' in a); F = lambda k, d: float(OPT.get(k, d))
out = os.path.join(HERE, V, 'out')
src = os.path.join(out, 'unwrap_decor_before_fix.png')
src = src if os.path.exists(src) else os.path.join(out, 'unwrap_decor.png')
d0 = cv2.imread(src, 0) > 127
rel = np.load(os.path.join(out, 'unwrap_rel.npy'))
S = np.load(os.path.join(out, 'unwrap_score.npy')); r = np.load(os.path.join(out, 'unwrap_r.npy'))
H, W = d0.shape; pad = 40
wrap = lambda a: np.hstack([a[:, -pad:], a, a[:, :pad]])
unw = lambda a: a[:, pad:-pad]
d = wrap(d0).astype(np.uint8); Sw = wrap(S); Rw = wrap(rel)
# 1. bites: closed over a small gap, kept only where the geometry says fish
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(F('close', 21)) | 1,) * 2)
closed = cv2.morphologyEx(d, cv2.MORPH_CLOSE, k).astype(bool)
fish_here = (cv2.GaussianBlur(Sw, (0, 0), 2) > F('s_fill', 1.0)) | (cv2.GaussianBlur(Rw, (0, 0), 2) > F('r_fill', .004))   # agitated, or clearly raised (smooth heads)
fill = closed & ~d.astype(bool) & fish_here
d2 = d.astype(bool) | fill
# small concave bites of the outline (mostly surrounded by the fish), whatever the score: a bite is compact and small, while
# the bare body seen between two fish is a long strip, open at its ends
bites = closed & ~d2
nb_, lb_, sb_, _ = cv2.connectedComponentsWithStats(bites.astype(np.uint8))
nbit = 0
for i in range(1, nb_):
    x, y, w, h, a = sb_[i]
    if a < F('bite_px', 2500) and a > .35 * w * h and max(w, h) < F('bite_len', 90):
        d2 |= lb_ == i; nbit += 1
print('bites filled:', nbit)
d2 = binary_fill_holes(d2)
# 2. rims on bare body: decor pixels within a few pixels of the border whose smoothed score is that of the bare body
inner = cv2.erode(d2.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(F('trim', 6)) * 2 + 1,) * 2)).astype(bool)
rim = d2 & ~inner
low = (cv2.GaussianBlur(Sw, (0, 0), 3) < F('s_trim', .55)) & (cv2.GaussianBlur(Rw, (0, 0), 2) < F('r_trim', .0015))   # smooth and flat: bare body
d3 = d2 & ~(rim & low)
d3 = cv2.morphologyEx(d3.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
d3 = cv2.GaussianBlur(d3.astype(np.float32), (0, 0), 1.2) > .5
# the border snapped onto the relief's own outline: watershed of the slope magnitude in a narrow band around the current border
# (sure decor inside, sure body outside); the boundary settles on the steepest line, the fish's real edge
if F('snap', 1) > 0:
    from skimage.segmentation import watershed
    rw = wrap(r).astype(np.float32)
    rb = cv2.GaussianBlur(rw, (0, 0), 1.0)
    g = np.hypot(cv2.Sobel(rb, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(rb, cv2.CV_32F, 0, 1, ksize=3))
    bw = int(F('band', 14))
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * bw + 1,) * 2)
    inside = cv2.erode(d3.astype(np.uint8), ker).astype(bool)
    outside = ~cv2.dilate(d3.astype(np.uint8), ker).astype(bool)
    mk = np.zeros(d3.shape, np.int32); mk[outside] = 1; mk[inside] = 2
    ws = watershed(g, mk)
    d3 = ws == 2
    d3 = binary_fill_holes(d3)
    d3 = cv2.GaussianBlur(d3.astype(np.float32), (0, 0), 1.0) > .5
dn = unw(d3) & (r > 0)
print('filled %d px, trimmed %d px' % (unw(fill).sum(), unw(rim & low & d2).sum()))
if not os.path.exists(os.path.join(out, 'unwrap_decor_before_fix.png')):
    cv2.imwrite(os.path.join(out, 'unwrap_decor_before_fix.png'), (d0 * 255).astype(np.uint8))
cv2.imwrite(os.path.join(out, 'unwrap_decor.png'), (dn * 255).astype(np.uint8))
