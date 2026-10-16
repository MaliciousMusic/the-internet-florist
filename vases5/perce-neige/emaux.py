# The snowdrop vase's enamels: the areas the tube lines enclose are filled with a few enamels whose colour spreads smoothly
# inside each area (the white's blue-grey shading, the cream turning peach, the green's light and dark), never in patches.
#   families - navy, green, ochre, ground (white and cream with their washes), told apart by their colour on the photograph
#              without its light (paint.py: out/unlit.npy); the tube lines' own grey goes to the neighbouring enamel (the
#              lines are drawn over, cernes.py); borders smoothed (each family's area blurred, the strongest wins);
#   colour   - inside each family, the unlit colour spread smoothly (normalised blur restricted to the family, so no colour
#              crosses into a neighbour), glints and unseen parts filled from their surroundings;
#   -> out/emaux.png (family per cell, 255 = unseen), out/emaux_col.npy (smooth colour field), out/emaux_check.jpg
#   .venv-depth/Scripts/python emaux.py [sig=5 edge=2]
import sys, os, json
import numpy as np, cv2
from scipy import ndimage
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
FAM = ['ground', 'navy', 'green', 'ochre']


def main():
    alb, known, seen = source()
    lab = mesure.to_lab((np.clip(cv2.GaussianBlur(alb, (0, 0), .8), 0, 1)[..., ::-1] * 255).astype(np.uint8))
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    fam = np.zeros(L.shape, np.int32)                               # ground by default
    green = (a < -4) & (b > 8) & (L < 85)
    ochre = (b > 20) & (a > -1) & (L < 76) & ~green
    navy = (L < 24) & ~green
    line = (C < 9) & (L > 22) & (L < 68)                           # the tube lines' grey: given to their neighbours
    # the navy is the neck's and the shoulder's ground only (the design): lower down, a dark patch is the photographer's
    # backdrop mirrored on the flank
    hrow = 1 - (np.arange(L.shape[0]) + .5) / L.shape[0]
    navy &= (hrow > G('navyh', .7))[:, None]
    # the navy is one large field (the neck and its windows): dark specks elsewhere are the tube lines' crossings
    n_, cc, st, _ = cv2.connectedComponentsWithStats(navy.astype(np.uint8))
    navy = np.isin(cc, np.where(st[:, cv2.CC_STAT_AREA] >= G('navymin', 1500))[0]) & (cc > 0)
    line |= (L < 24) & ~navy & ~green
    fam[green] = 2; fam[ochre] = 3; fam[navy] = 1
    known_f = known & ~line
    _, (iy, ix) = ndimage.distance_transform_edt(~known_f, return_indices=True)
    fam = fam[iy, ix]
    # borders: each family's area smoothed, the strongest wins; specks merged
    e = G('edge', 2.0)
    fam = np.stack([cv2.GaussianBlur((fam == i).astype(np.float32), (0, 0), e) for i in range(len(FAM))], -1).argmax(-1).astype(np.int32)
    for i in range(len(FAM)):
        n_, cc, st, _ = cv2.connectedComponentsWithStats((fam == i).astype(np.uint8), connectivity=4)
        small = np.isin(cc, np.where(st[:, cv2.CC_STAT_AREA] < G('minc', 60))[0]) & (cc > 0)
        if small.any():
            _, (iy, ix) = ndimage.distance_transform_edt(small, return_indices=True)
            fam = np.where(small, fam[iy, ix], fam)
    # the colour of each enamel spread smoothly inside its family
    # the photograph's pixels along a tube line carry its grey (anti-aliasing, the trail's shadow): left out of the enamels
    good = known_f & ~cv2.dilate(line.astype(np.uint8), np.ones((int(G('lmargin', 5)),) * 2, np.uint8)).astype(bool)
    col = np.zeros_like(alb)
    SIG = dict(ground=G('sig', 6), navy=G('signavy', 16), green=G('siggreen', 6), ochre=G('sigochre', 5))
    for i in range(len(FAM)):
        f = fam == i
        # measured on the heart of the family's areas only: their borders on the photograph carry the line's grey and the
        # neighbour's colour
        core = cv2.erode(f.astype(np.uint8), np.ones((int(G('core', 7)),) * 2, np.uint8)).astype(bool)
        if (core & good).sum() < 50:
            core = f
        w = (core & good).astype(np.float32)
        sig = SIG[FAM[i]]
        num = np.dstack([cv2.GaussianBlur(alb[..., j] * w, (0, 0), sig) for j in range(3)])
        den = cv2.GaussianBlur(w, (0, 0), sig)[..., None]
        c = num / np.maximum(den, 1e-4)
        ok = den[..., 0] > .02
        # where the family has no measured pixel near (a glint, a sliver): the family's own neighbours, further away
        _, (iy, ix) = ndimage.distance_transform_edt(~(ok & core), return_indices=True)
        c = c[iy, ix]
        col[f] = c[f]
    col = np.clip(col, 0, 1)
    out = np.where(seen, fam, 255).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, 'emaux%s.png' % SFX), out)
    np.save(os.path.join(OUT, 'emaux_col%s.npy' % SFX), col.astype(np.float16))
    ys, xs = np.where(seen); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    fv = np.array([(205, 205, 200), (60, 20, 10), (40, 140, 60), (60, 140, 210)], np.uint8)[fam]
    cv = (col[..., ::-1] * 255).astype(np.uint8)
    im = (np.clip(alb, 0, 1)[..., ::-1] * 255).astype(np.uint8)
    chk = np.hstack([im[y0:y1, x0:x1], fv[y0:y1, x0:x1], cv[y0:y1, x0:x1]])
    cv2.imwrite(os.path.join(OUT, 'emaux_check%s.jpg' % SFX), cv2.resize(chk, None, fx=.6, fy=.6))
    print('families', {FAM[i]: round(100 * float(((fam == i) & seen).sum()) / seen.sum(), 1) for i in range(len(FAM))})


if __name__ == '__main__':
    main()
