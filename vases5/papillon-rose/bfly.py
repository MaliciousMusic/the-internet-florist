# The butterfly in relief at the bottom of the slit (vases5/papillon-rose), copied from the reference (owner's decision of
# 2026-10-16): a swallowtail seen from above, head at the bottom of the slit; long forewings rising along the two lips, their
# lower half salmon-orange (vivid at the roots), their upper half a net of white cells on a mauve ground; small round
# hindwings bordered with mauve, two long fine pinkish-white tails falling towards the foot; slim mauve body.
# Its outline and paint zones are the traced outlines of traces.json (photograph px), carried onto the belly through the
# photograph's camera (geom.py) into rasters on the surface grid (u, h): u arc length (cm) on the outer surface from the
# front meridian, h height (cm). The decoration is asymmetric (its left forewing wraps round to the silhouette).
import math
import numpy as np
import cv2
import geom as G

BU0, BU1, BH0, BH1 = -7.0, 7.0, 1.2, 17.6
BRES = 80                                          # samples per cm
PH_W, PH_H = 736, 981                              # the photograph's frame

# body and tails, measured on the photograph (px): head (x, y, r), thorax (x, y, half width, half length), abdomen (from, to,
# half widths), tails (centre lines), all read on the 3.4x grids of work/t_bd.png
HEAD = (352.0, 739.0, 7.5)
THORAX = (354.0, 764.0, 9.0, 19.0)
ABDOMEN = ((356.0, 785.0), (358.0, 821.0), 6.5, 2.0)
TAILS = [[(338, 842), (334, 858), (330, 874), (326, 888), (323, 898)],
         [(406, 842), (409, 855), (412, 866), (415, 876), (417, 884)]]
TAIL_W = 4.6                                       # half width of a tail (px), its knob 5.6


def remap1(M, x, y, border=cv2.BORDER_CONSTANT):
    """cv2.remap on flat coordinate lists of any length (cv2 wants maps under 32767 per side)"""
    n = x.size; w = 1024; m = -(-n // w)
    xp = np.zeros(m * w, np.float32); yp = np.zeros(m * w, np.float32)
    xp[:n] = x.ravel(); yp[:n] = y.ravel()
    o = cv2.remap(M, xp.reshape(m, w), yp.reshape(m, w), cv2.INTER_LINEAR, borderMode=border, borderValue=0)
    return o.reshape((m * w,) + M.shape[2:])[:n]


def sample(M, u, h):
    """bilinear lookup of a surface raster at (u, h) (0 outside)"""
    x = ((np.asarray(u) - BU0) * BRES).astype(np.float32)
    y = ((BH1 - np.asarray(h)) * BRES).astype(np.float32)
    return remap1(M, x, y).reshape(np.shape(u) + M.shape[2:])


def inwin(u, h):
    return (np.abs(u) < BU1 - .02) & (h > BH0 + .02) & (h < BH1 - .02)


def _photo_masks():
    """the traced zones rasterised in the photograph's frame (x4 supersampled edges)"""
    TR = G.TR
    S = 4

    def blank():
        return np.zeros((PH_H * S, PH_W * S), np.uint8)

    def poly(m, pts, v):
        cv2.fillPoly(m, [np.round((np.array(pts, float) + .5) * S).astype(np.int32)], v, cv2.LINE_8)

    def zones(lst):
        m = blank()
        for z in sorted(lst, key=lambda z: z[0]):          # outer outlines first, then their holes
            poly(m, np.array(z[1:], float).reshape(-1, 2), 0 if z[0] else 255)
        return m
    paint = blank()
    for c in TR['paint_outline']:
        poly(paint, c, 255)
    mauve = zones(TR['zone_mauve'])
    orange = zones(TR['zone_orange'])
    veins = blank()
    for x, y in np.array(TR['veins'], float).reshape(-1, 2):
        cv2.circle(veins, (int(x * S + S / 2), int(y * S + S / 2)), int(.8 * S), 255, -1)
    down = lambda m: cv2.resize(m, (PH_W, PH_H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    return {k: down(m) for k, m in (('paint', paint), ('mauve', mauve), ('orange', orange), ('veins', veins))}


def _grid():
    nu = int(round((BU1 - BU0) * BRES)) + 1; nh = int(round((BH1 - BH0) * BRES)) + 1
    return np.meshgrid(BU0 + np.arange(nu) / BRES, BH1 - np.arange(nh) / BRES)


def _to_photo_uh(U, Hh):
    phi = U / G.R(Hh)
    rho = G.R(Hh)
    P = np.stack([G.AX(Hh) + rho * np.sin(phi), Hh, rho * np.cos(phi)], -1).reshape(-1, 3)
    X, Y, zw = G.to_photo(P)
    return X.reshape(U.shape), Y.reshape(U.shape), np.cos(phi + G.YAWP)


def _uh_of(pts):
    """photograph points (px) -> (u, h) on the belly"""
    p = np.array(pts, float)
    phi, h = G.from_photo_outer(p[:, 0], p[:, 1])
    return np.c_[phi * G.R(h), h]


def maps():
    U, Hh = _grid()
    X, Y, cw = _to_photo_uh(U, Hh)
    PM = _photo_masks()
    # the decoration is not symmetric (the left forewing wraps much further round the belly than the right one): each part
    # is read where the photograph sees it; beyond the silhouette nothing is invented
    raw = {}
    for k, M in PM.items():
        raw[k] = np.where(cw > .02, remap1(M, X, Y).reshape(U.shape), 0).astype(np.float32)
    sm = lambda a, s: cv2.GaussianBlur(a, (0, 0), s * BRES)
    clean = lambda a, s=.025: np.clip((sm(a, s) - .5) * 4 + .5, 0, 1).astype(np.float32)
    wing = clean(raw['paint'], .03)
    mauve = clean(raw['mauve']) * wing
    orange = clean(raw['orange']) * wing * (1 - mauve)
    veins = sm(raw['veins'], .01) * wing
    px = lambda P: np.c_[(P[:, 0] - BU0) * BRES, (BH1 - P[:, 1]) * BRES]
    # the body, from the measured photograph points
    hu = _uh_of([HEAD[:2], (HEAD[0] + HEAD[2], HEAD[1])])
    hr = max(abs(hu[1, 0] - hu[0, 0]), .1)
    Hb = .3 * np.sqrt(np.clip(1 - ((U - hu[0, 0]) ** 2 + (Hh - hu[0, 1]) ** 2) / hr ** 2, 0, 1))
    tu = _uh_of([THORAX[:2], (THORAX[0] + THORAX[2], THORAX[1]), (THORAX[0], THORAX[1] + THORAX[3])])
    ta, tb = max(abs(tu[1, 0] - tu[0, 0]), .1), max(abs(tu[2, 1] - tu[0, 1]), .1)
    Hb = np.maximum(Hb, .36 * np.sqrt(np.clip(1 - ((U - tu[0, 0]) / ta) ** 2 - ((Hh - tu[0, 1]) / tb) ** 2, 0, 1)))
    a0, a1, w0, w1 = ABDOMEN
    au = _uh_of([a0, a1, (a0[0] + w0, a0[1]), (a1[0] + w1, a1[1])])
    t = np.clip((au[0, 1] - Hh) / (au[0, 1] - au[1, 1]), 0, 1)
    inh = ((Hh <= au[0, 1] + .05) & (Hh >= au[1, 1] - .02)).astype(np.float32)
    cu = au[0, 0] + (au[1, 0] - au[0, 0]) * t
    ww = abs(au[2, 0] - au[0, 0]) * (1 - t) + abs(au[3, 0] - au[1, 0]) * t
    seg = 1 - .08 * (.5 + .5 * np.cos(2 * math.pi * (Hh - au[0, 1]) / .3))
    Hb = np.maximum(Hb, inh * .3 * np.sqrt(np.clip(1 - ((U - cu) / np.maximum(ww, 1e-3)) ** 2, 0, 1)) * seg)
    bodym = clean((Hb > .02).astype(np.float32), .012)
    # the tails
    tails = np.zeros(U.shape, np.float32)
    for T_ in TAILS:
        q = px(_uh_of(T_))
        tw = TAIL_W / G.PK
        m = np.zeros(U.shape, np.uint8)
        cv2.polylines(m, [np.round(q * 16).astype(np.int32)], False, 255, max(1, int(2 * tw * BRES)), cv2.LINE_AA, shift=4)
        cv2.circle(m, tuple(int(v) for v in np.round(q[-1] * 16)), int(5.6 / G.PK * BRES * 16), 255, -1, cv2.LINE_AA, shift=4)
        tails = np.maximum(tails, m.astype(np.float32) / 255)
    # relief: one porcelain plate for the wings with rounded edges, tails as rounded strips, the white cells of the net
    # slightly domed (the holes of the mauve ground in the upper wings), veins barely raised, the body on top
    dist = lambda m: cv2.distanceTransform((m > .5).astype(np.uint8), cv2.DIST_L2, 5) / BRES
    prof = lambda m, w: np.clip(dist(m) / w, 0, 1) ** .55
    plate = prof(wing, .14) * .085
    tl = prof(tails, .05) * .07
    netz = (Hh > 9.4).astype(np.float32)
    cells = sm(np.clip(wing - mauve - orange, 0, 1) * netz * wing, .02)
    H = np.maximum(plate, tl) + .03 * cells * (plate > .05) + .012 * veins
    H = np.maximum(H, Hb + .04 * (Hb > .01))
    return dict(H=H.astype(np.float32), wing=np.maximum(np.maximum(wing, tails), bodym).astype(np.float32),
                mauve=np.maximum(mauve, bodym).astype(np.float32), orange=(orange * (1 - bodym)).astype(np.float32),
                tails=(tails * (1 - wing)).astype(np.float32), veins=veins.astype(np.float32), body=bodym, U=U, Hh=Hh)
