# The measured fields written as SVG: the patina in soft tone bands whose colour follows the height, the gold of the carp in
# its own tone bands clipped to its crisp outline, then the fine relief of the model (scales, fin rays, gill covers, eyes,
# mouths) as an engraving layer: the shading the full normals add to the smoothed ones, as stacked dark and pale veils.
import os
import sys
import json
import numpy as np
import cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402
import vec  # noqa: E402

UPC, VX, FL, RY = 9.75, 500.0, 990.0, .16


def mapper(view, shape):
    if view == 'photo':
        return lambda x, y: (x + .5, y + .5), 1.0
    S = json.load(open(os.path.join(HERE, 'out', 'glbw_shop.json')))
    fx, fy = S['foot']; ty = S['top'][1]
    sy = S['hcm'] * UPC / (fy - ty)          # undo the slight vertical foreshortening: the lip lands where the engine draws it
    sx = 1.0 / S['k']
    return (lambda x, y: (VX + (x + .5 - fx) * sx, FL - (fy - (y + .5)) * sy)), 1.0 / sx


def lid_mask(view, shape, mapf, r_top_cm):
    """shop: the top ellipse of the mouth, left to the engine (its lip ring and the inside, where the stems go in)"""
    if view == 'photo':
        return np.zeros(shape, bool)
    H, W = shape
    ys, xs = np.mgrid[0:H, 0:W]
    u = np.array(mapf(xs.astype(float), ys.astype(float)))
    rx = r_top_cm * UPC; ry = rx * RY
    top = FL - 26.0 * UPC
    return ((u[0] - VX) / rx) ** 2 + ((u[1] - top) / ry) ** 2 <= 1.0


def write(view, F, col, colb, P=None):
    P = P or {}
    shape = F['mask'].shape
    mapf, ppu = mapper(view, shape)
    cm = F['pxcm']                                     # pixels per cm in the field
    ucm = UPC if view == 'shop' else cm                # user units per cm
    q = .1 if view == 'shop' else .2
    defs, body = [], []
    m = F['mask'].copy()
    lid = lid_mask(view, shape, mapf, P.get('rtop', 6.45))
    m &= ~lid
    gold = F['gold'] & m
    ground = m & ~gold
    defs.append('<filter id="bg" x="-3%%" y="-3%%" width="106%%" height="106%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(P.get('blur_g', .2) * ucm))
    defs.append('<filter id="bc" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(P.get('blur_c', .06) * ucm))
    defs.append('<filter id="be" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(P.get('blur_e', .012) * ucm))
    step = P.get('step', 2.2) * cm / 10          # contour sampling, in field pixels (~0.22 mm per unit of 'step')
    K.RDP_EPS, K.FIT_EPS = P.get('rdp', .5) * cm / 16, 0
    # ---- the patina
    gp = vec.region_path(m, q, mapf, blur=.8, step=max(2.0, step))
    defs.append('<clipPath id="cg"><path d="%s"/></clipPath>' % gp)
    K.AREA_MIN = 30
    gdefs, bb = vec.bands_vgrad(colb, ground, mapf, q, step * 2.2, P.get('dy_g', 5.0), 'gv', ybin=max(4, int(.4 * cm)))
    defs += gdefs
    body.append('<g clip-path="url(#cg)"><path fill="%s" d="%s"/><g filter="url(#bg)">%s</g></g>' % (
        bb[0][0], gp, ''.join('<path fill="%s" d="%s"/>' % (c_, d_) for c_, d_ in bb[1:])))
    nb = len(bb)
    # ---- the gold of the carp
    gcp = vec.region_path(gold, q, mapf, blur=.7, step=max(1.5, step * .7))
    defs.append('<clipPath id="ck"><path d="%s"/></clipPath>' % gcp)
    K.AREA_MIN = 8
    cb = cv2.GaussianBlur(colb.astype(np.float32), (0, 0), .6)
    bb = K.bands(cb, gold, mapf, q, step, dy=P.get('dy_c', 9.0))
    nb += len(bb)
    body.append('<g clip-path="url(#ck)"><path fill="%s" d="%s"/><g filter="url(#bc)">%s</g>' % (
        bb[0][0], gcp, ''.join('<path fill="%s" d="%s"/>' % (c_, d_) for c_, d_ in bb[1:])))
    # ---- the engraving: what the fine relief adds to the smooth shading, as dark and pale veils
    lum = lambda c: c @ np.array([.3, .59, .11])
    det = (lum(col) - lum(colb)).astype(np.float32)
    det = np.where(cv2.dilate(gold.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0, det, 0)
    det = cv2.GaussianBlur(det, (0, 0), P.get('dsm', .5))
    K.AREA_MIN = P.get('emin', 2.0)
    es = max(1.0, step * .45)
    dk, lt = '', ''
    for lev in P.get('dark', (7, 16, 30)):
        d_ = K.contour_paths(-det, float(lev), es, q, mapf, 1.0)
        if d_:
            dk += '<path d="%s"/>' % d_
    for lev in P.get('light', (9, 20, 36)):
        d_ = K.contour_paths(det, float(lev), es, q, mapf, 1.0)
        if d_:
            lt += '<path d="%s"/>' % d_
    body.append('<g filter="url(#be)"><g fill="#24140a" fill-opacity="%s">%s</g><g fill="#fff3d6" fill-opacity="%s">%s</g></g>' % (
        K.fmt(P.get('dop', .3)), dk, K.fmt(P.get('lop', .28)), lt))
    # the undercut along the gold's outline
    body.append('<path fill="none" stroke="#24140a" stroke-opacity=".45" stroke-width="%s" d="%s"/></g>' % (K.fmt(.03 * ucm), gcp))
    return defs, body, nb
