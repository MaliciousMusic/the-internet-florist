# Edge snapping for the tracing: each point of a rough outline slides along its normal to the strongest nearby edge of the
# reference (gradient of the smoothed lightness), then the outline is smoothed again. The result is printed as numbers.
import sys, numpy as np, cv2
sys.path.insert(0, '.')
import trace as T
im = cv2.imread('out/ref.jpg').astype(np.float32) / 255
L = cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (0, 0), 1.6)
gx = cv2.Sobel(L, cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(L, cv2.CV_32F, 0, 1, ksize=3)
G = np.hypot(gx, gy)


def snap(pts, R=7, spacing=9, closed=True, keep=0.35):
    P = np.array(T.smooth(pts, 12, closed))
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    n = max(6, int(d[-1] / spacing))
    t = np.linspace(0, d[-1], n, endpoint=not closed)
    Q = np.c_[np.interp(t, d, P[:, 0]), np.interp(t, d, P[:, 1])]
    out = []
    for i in range(len(Q)):
        a, b = Q[i - 1] if (i or closed) else Q[i], Q[(i + 1) % len(Q)] if (i < len(Q) - 1 or closed) else Q[i]
        tx, ty = b - a; l = np.hypot(tx, ty) or 1; nx, ny = -ty / l, tx / l
        best, bs = 0.0, -1
        for s in np.arange(-R, R + .5, .5):
            x, y = Q[i, 0] + nx * s, Q[i, 1] + ny * s
            if 0 <= x < G.shape[1] - 1 and 0 <= y < G.shape[0] - 1:
                g = cv2.getRectSubPix(G, (1, 1), (float(x), float(y)))[0, 0] * (1 - keep * abs(s) / R)
                if g > bs:
                    bs, best = g, s
        out.append(Q[i] + np.array([nx, ny]) * best)
    out = np.array(out)
    # smooth the snapped offsets a little (edges are noisy)
    k = np.array([1, 2, 3, 2, 1.]) / 9
    if closed:
        out = np.c_[np.convolve(np.r_[out[-2:, 0], out[:, 0], out[:2, 0]], k, 'valid'), np.convolve(np.r_[out[-2:, 1], out[:, 1], out[:2, 1]], k, 'valid')]
    return [(round(x), round(y)) for x, y in out]


if __name__ == '__main__':
    fig, name = sys.argv[1], sys.argv[2]
    for p in T.PARTS:
        if p['fig'] == fig and p['name'] == name:
            print(snap(p['pts']))
