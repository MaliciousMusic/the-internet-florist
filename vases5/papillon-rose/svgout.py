# The pink butterfly vase as SVG curves (vases5/papillon-rose): from the computed field (colour, coverage, layer and paint
# class per pixel), each paint region is written as one clip outline and its tone bands (iso-lines of the lit colour, keyed
# so that hues of the same lightness do not merge), softened by a small blur. Back layer (behind the stems: the inside seen
# through the slit and the funnel, the back wall's top edge, the crosiers) and body (the rest). No image is embedded.
import math
import numpy as np, cv2
import svgkit as K

# drawing order of the paint classes inside a layer, and the key of their bands (lightness + a x (R - G) + b x (R - B)):
# glaze 0 (cream, the lips' mauve, the crosiers), foot 1, wing 2 (orange melting into pale), dark 3 (the net's mauve
# ground, the borders, the body), inside 5
# (classes are the paints: 0 cream glaze, 1 the lips' mauve, 2 inside, 3 foot, 4 orange, 5 the net's mauve, 6 pale, 7 tails,
# 8 crosier mauve, 9 crosier cream, 10 the back wall's top edge)
ORDER = {0: [2, 10, 1, 9, 8], 1: [0, 3, 1, 6, 7, 4, 5]}
KEYS = {0: (-.5, 0), 1: (-.4, 0), 2: (-.5, 0), 4: (-.2, -.2), 6: (-.3, 0)}


def keyed_bands(col, mask, region, mapf, q, step, dy, kr, kb, ext=6):
    Y = col @ np.array([.3, .59, .11]) + kr * (col[..., 0] - col[..., 1]) + kb * (col[..., 0] - col[..., 2])
    Ye, me = K.extend(Y, mask, ext)
    ce, _ = K.extend(col, mask, ext)
    vals = Y[mask]
    if vals.size < 6:
        return []
    lo, hi = np.percentile(vals, .5), np.percentile(vals, 99.7)
    levels = np.arange(math.floor(lo / dy) * dy + dy, hi, dy)
    edges = [-1e9] + list(levels) + [1e9]
    F_ = np.where(me, Ye, -1e3)
    out = []
    for k in range(len(edges) - 1):
        sel = mask & (Y >= edges[k]) & (Y < edges[k + 1])
        if sel.sum() < 2:
            sel = me & (Ye >= edges[k]) & (Ye < edges[k + 1])
        if sel.sum() < 2:
            continue
        c = ce[sel].mean(0)
        if not out:
            out.append((K.hexc(c), None))
            continue
        d = K.contour_paths(F_, edges[k], step, q, mapf, 1.0)
        if d:
            out.append((K.hexc(c), d))
    return out


def region_path(m, mapf, q, smooth=.7):
    f = cv2.GaussianBlur(m.astype(np.float32), (0, 0), smooth)
    a_ = K.AREA_MIN
    d = K.contour_paths(f, .5, 1.5, q, mapf, 1.0)
    K.AREA_MIN = a_
    return d


def emit(disp, cov, code, pid, org, res, unit_scale, q=.2, dy=7.0, step=2.2, blur=.45, amin=4.0):
    """-> (defs, back, body, inner path, cavb)"""
    x0, y0 = org
    lay_ = np.where(code >= 0, code // 8, -1)
    code = np.where((code >= 0) & (pid >= 0), lay_ * 16 + pid, -1)
    mapf = lambda x, y: (x0 + (x + .5) / res, y0 + (y + .5) / res)
    K.RDP_EPS = .45 * res / 2.5; K.FIT_EPS = 0; K.AREA_MIN = amin * res * res / 9
    disp = cv2.GaussianBlur(disp, (0, 0), .6)
    defs = ['<filter id="pb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
            % K.fmt(blur * unit_scale)]
    layers = {0: [], 1: []}
    nb = 0
    for lay in (0, 1):
        present = [c for c in ORDER[lay] if ((code == lay * 16 + c) & (cov > .5)).sum() > 4]
        laym = (code >= lay * 16) & (code < lay * 16 + 16) & (cov > .5)
        for i, c in enumerate(present):
            m = (code == lay * 16 + c) & (cov > .25)
            later = np.zeros_like(m)
            for c2 in present[i + 1:]:
                later |= code == lay * 16 + c2
            if i == 0:
                reg = laym | (cov > .5) & m
            else:
                reg = m | (cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & later)
            rp = region_path(reg, mapf, q)
            if not rp:
                continue
            kr, kb = KEYS.get(c, (0, 0))
            bb = keyed_bands(disp, m & (cov > .5), reg, mapf, q, step, dy, kr, kb)
            if not bb:
                continue
            nb += len(bb)
            cid = 'r%d%d' % (lay, c)
            defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, rp))
            layers[lay].append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#pb)">%s</g></g>' % (
                cid, bb[0][0], rp, ''.join('<path fill="%s" d="%s"/>' % (cc, dd) for cc, dd in bb[1:])))
    # the opening through which stems standing in the vase are seen: the inside's region
    insm = ((code == 2) | (code == 1)) & (cov > .5)
    insm = cv2.morphologyEx(insm.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lb, st, _ = cv2.connectedComponentsWithStats(insm)
    inner, cavb = '', None
    if n > 1:
        big = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
        inner = region_path(big, mapf, q, 1.0)
        ys = np.nonzero(big)[0]
        cavb = round(float(mapf(0, ys.max())[1]) - 3, 1)
    return ''.join(defs), ''.join(layers[0]), ''.join(layers[1]), inner, cavb, nb
