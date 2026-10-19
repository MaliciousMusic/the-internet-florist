"""repere.py: the frame of a piece on a render of that piece alone (pilote/sv.html ...&solo=k&nohrt=1, a plain ground), for fleur/apparence.py
(BONNES-PRATIQUES §15 point 7: the photo | render tables need a frame on the render as on the photo). No model, no browser.

  python fleur/repere.py <render.png> [--base x,y]

The piece's mask (what differs from the ground); its base: the mask point nearest --base (the head's centre on the sheet; default the image
centre); its tip: the mask point farthest from the base; three points on the midline between them (the middle of each cross-section), and its
half-width (the widest cross-section, halved). Prints "x,y;x,y;x,y;x,y;w", the frame apparence.py takes.
"""
import sys, argparse
import numpy as np
from PIL import Image


def frame(png, base=None):
    im = np.asarray(Image.open(png).convert('RGB')).astype(float)
    H, W, _ = im.shape
    bg = np.median(np.concatenate([im[:4, :4].reshape(-1, 3), im[-4:, -4:].reshape(-1, 3)]), 0)
    m = np.abs(im - bg).sum(2) > 24
    ys, xs = np.nonzero(m)
    if not len(xs):
        raise SystemExit('rien de dessiné sur %s' % png)
    bx, by = base if base else (W / 2, H / 2)
    k = np.argmin((xs - bx) ** 2 + (ys - by) ** 2)
    b = np.array([xs[k], ys[k]], float)
    d2 = (xs - b[0]) ** 2 + (ys - b[1]) ** 2
    t = np.array([xs[np.argmax(d2)], ys[np.argmax(d2)]], float)
    ax = (t - b) / max(1e-9, np.linalg.norm(t - b))
    nx = np.array([-ax[1], ax[0]])
    P = np.stack([xs, ys], 1).astype(float) - b
    s, q = P @ ax, P @ nx
    L = np.linalg.norm(t - b)
    pts, hw = [], 0
    for f in (.03, .35, .65, .97):
        sel = np.abs(s - f * L) < max(1.5, L * .02)
        if sel.sum() < 2:
            pts.append(b + ax * f * L)
            continue
        lo, hi = q[sel].min(), q[sel].max()
        hw = max(hw, (hi - lo) / 2)
        pts.append(b + ax * f * L + nx * (lo + hi) / 2)
    return ';'.join('%d,%d' % (round(p[0]), round(p[1])) for p in pts) + ';%d' % round(hw)


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('png')
    a.add_argument('--base')
    o = a.parse_args()
    print(frame(o.png, tuple(float(x) for x in o.base.split(',')) if o.base else None))


if __name__ == '__main__':
    main()
