# Retouches of the dragon's texture before it is traced (owner, vase review of 2026-10-17):
#  1. the tail's tip: the model's tail stops short, rounded; it is drawn on, tapering along the tail's own direction, each
#     cross-section of the extension a copy of the tail's last one, narrowed;
#  2. the decor up to the edge: on the right shoulder the dragon's scales and flames stop before the edge (black lacquer, then
#     a squeezed strip of the decor seen at grazing angle); the gap is filled with the neighbouring decor, mirrored, fading
#     into the edge strip.
# Positions are in the texture of the shop view (glbsvg.py view=shop s=3), measured on out/_tex_shop.png; k scales them.
import numpy as np, cv2

S = k / 3.0
H_, W_ = alb.shape[:2]
lum = alb @ np.array([.3, .59, .11])


def tail_tip(end, tow, length, w0):
    d = np.array(tow, float); d /= np.linalg.norm(d); n = np.array([-d[1], d[0]])
    e = np.array(end, float)
    prof = []
    for s_ in np.linspace(-w0, w0, int(2 * w0) + 1):
        x, y = (e - d * 3 + n * s_).astype(int)
        prof.append(alb[y, x].copy())
    prof = np.array(prof)
    for t in np.linspace(0, 1, int(length * 2)):
        c = e + d * length * t + n * (length * .18) * t * t              # it curls a little as it ends
        w = w0 * (1 - t) ** 1.2
        for s_ in np.linspace(-w, w, max(2, int(2 * w0) + 1)):
            x, y = (c + n * s_).astype(int)
            if 0 <= x < W_ and 0 <= y < H_ and m[y, x]:
                i = int(round((s_ / max(w, 1e-3) * .5 + .5) * (len(prof) - 1)))
                alb[y, x] = prof[min(max(i, 0), len(prof) - 1)]


def fill_gap(x_axis, y0, y1, x0, x1):
    """the black gap on the shoulder filled with the decor beside it, mirrored as a whole about x_axis (a coherent 2D
    reflection, only where the lacquer is bare), feathered at its borders"""
    out = alb.copy()
    gy, gx = np.mgrid[y0:y1, x0:x1]
    sx = np.clip(2 * x_axis - gx, 0, W_ - 1)
    src = alb[gy, sx]
    bare = (lum[y0:y1, x0:x1] < .12) & m[y0:y1, x0:x1]
    w = cv2.GaussianBlur(bare.astype(np.float32), (0, 0), 3 * S) * bare
    edge = np.clip((x1 - gx) / (10 * S), 0, 1)                         # fade out just before the edge strip
    fy = np.clip((gy - y0) / (28 * S), 0, 1) * np.clip((y1 - gy) / (28 * S), 0, 1)    # no hard top or bottom
    fx = np.clip((gx - x0) / (14 * S), 0, 1)
    w = w * edge * fy * fy * (3 - 2 * fy) * fx
    out[y0:y1, x0:x1] = alb[y0:y1, x0:x1] * (1 - w[..., None]) + src * w[..., None]
    return out


tail_tip((562 * S, 752 * S), (-70, -60), 60 * S, 16 * S)
alb = fill_gap(int(800 * S), int(225 * S), int(380 * S), int(796 * S), int(900 * S))
log('patch: tail tip drawn, shoulder decor carried to the edge')
