# The lit fields written as SVG: the patina in soft tone bands, the shadow of the relief as stacked translucent shades, each part
# of each carp in its own tone bands clipped to its crisp outline, then the drawing that a field cannot carry crisply: the
# engraved net of the scales, the rays of the fins, the gill cover, the inlaid eye, the mouth and the barbels, all projected from
# the carp's own frame through the same view as the light.
import os
import sys
import numpy as np
import cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402
import geom as G  # noqa: E402
import carp as C  # noqa: E402
import light as Lt  # noqa: E402


class View:
    """from the render's pixels and from the world to the SVG's user space"""

    def __init__(self, R, view, out_scale):
        self.R, self.view = R, view
        self.k = out_scale                  # user units per user unit of the render (photo: 2 = twice the reference)
        self.x0, self.y0, self.sc = R['x0'], R['y0'], R['sc']

    def pix(self, x, y):                    # field pixel (x, y) -> user
        return ((self.x0 + (x + .5) / self.sc) * self.k, (self.y0 + (y + .5) / self.sc) * self.k)

    def world(self, P):                     # world (cm) -> user
        if self.view == 'shop':
            return Lt.project_shop(P) * self.k
        return Lt.project_photo(P, 1.0) * self.k

    def to_pix(self, U):                    # user -> field pixel
        return np.c_[(U[:, 0] / self.k - self.x0) * self.sc - .5, (U[:, 1] / self.k - self.y0) * self.sc - .5]

    @property
    def unit(self):                         # user units per cm on the jar (to size the strokes)
        return (Lt.UPC if self.view == 'shop' else Lt.PH['K']) * self.k


def region_path(mask, q, mapf, blur=.8, step=3.0):
    f = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), blur)
    K.RDP_EPS, K.FIT_EPS, K.AREA_MIN = .35, 0, 4
    return K.contour_paths(f, .5, step, q, mapf, 1.0)


def nums(a, q):
    return K.nums(np.round(np.asarray(a, float) / q) * q)


class Strokes:
    """polylines and quadratic chains gathered by style, written as one path per style"""

    def __init__(self, q):
        self.q = q
        self.d = {}

    def chain(self, key, P, Q=None):
        """P: points of a chain; Q: control points between them (quadratic), or None (straight)"""
        q = self.q
        P = np.round(np.asarray(P, float) / q) * q
        s = 'M' + nums(P[0], q)
        cur = P[0]
        if Q is None:
            s += 'l' + nums((P[1:] - np.vstack([P[:1], P[1:-1]])).ravel(), q)
        else:
            Q = np.round(np.asarray(Q, float) / q) * q
            parts = []
            for i in range(1, len(P)):
                parts += list(Q[i - 1] - cur) + list(P[i] - cur)
                cur = P[i]
            s += 'q' + nums(parts, q)
        self.d.setdefault(key, []).append(s)

    def svg(self, styles):
        out = ''
        for key, (attrs) in styles.items():
            if key in self.d:
                out += '<path %s d="%s"/>' % (attrs, ''.join(self.d[key]))
        return out


def bands_vgrad(col, mask, mapf, q, step, dy, gid, ybin=6):
    """tone bands whose fill is a vertical gradient: the band is a range of lightness, its colour follows the height (the
    patina's hue changes from chocolate to caramel at equal lightness). Returns (defs, paths)"""
    Y = col @ np.array([.3, .59, .11])
    Ye, me = K.extend(Y, mask, 6)
    ce, _ = K.extend(col, mask, 6)
    vals = Y[mask]
    lo, hi = np.percentile(vals, 1), np.percentile(vals, 99.5)
    levels = np.arange(np.floor(lo / dy) * dy + dy, hi, dy)
    edges = [-1e9] + list(levels) + [1e9]
    H, W = Y.shape
    yy = np.repeat(np.arange(H)[:, None], W, 1)
    nb = int(np.ceil(H / ybin))
    defs, paths = [], []
    for k in range(len(edges) - 1):
        sel = me & (Ye >= edges[k]) & (Ye < edges[k + 1])
        if sel.sum() < 2:
            continue
        rows = yy[sel] // ybin
        cols = ce[sel]
        cnt = np.bincount(rows, minlength=nb)
        stops = []
        for ch in range(3):
            s_ = np.bincount(rows, cols[:, ch], minlength=nb)
            stops.append(s_)
        okb = cnt > 0
        if not okb.any():
            continue
        idx = np.nonzero(okb)[0]
        means = np.stack([stops[ch][idx] / cnt[idx] for ch in range(3)], 1)
        # a few stops: merge runs whose colour barely changes
        keep = [0]
        for i in range(1, len(idx)):
            if np.abs(means[i] - means[keep[-1]]).max() > 2.5 or i == len(idx) - 1:
                keep.append(i)
        y0u = mapf(0, idx[0] * ybin + ybin / 2)[1]; y1u = mapf(0, idx[-1] * ybin + ybin / 2)[1]
        gname = '%s%d' % (gid, k)
        st = ''
        for i in keep:
            yu = mapf(0, idx[i] * ybin + ybin / 2)[1]
            off = 0 if y1u == y0u else (yu - y0u) / (y1u - y0u)
            st += '<stop offset="%s" stop-color="%s"/>' % (K.fmt(off), K.hexc(means[i]))
        defs.append('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="0" y1="%s" x2="0" y2="%s">%s</linearGradient>'
                    % (gname, K.fmt(y0u), K.fmt(y1u if y1u != y0u else y0u + 1), st))
        if k == 0:
            paths.append(('url(#%s)' % gname, None))
            continue
        F = np.where(me, Ye, -1e3)
        d = K.contour_paths(F, edges[k], step, q, mapf, 1.0)
        if d:
            paths.append(('url(#%s)' % gname, d))
    return defs, paths


def lum(c):
    return c @ np.array([.3, .59, .11])


# ---------------------------------------------------------------- the carp drawing
def tau_table(c):
    """scale columns along the body: their pitch shrinks with the body's depth toward the tail"""
    t = np.linspace(0, 1.0, 400)
    dep = c.vd(t) - c.vv(t)
    pitch = np.sqrt(np.maximum(dep / dep.max(), .2))
    tau = np.r_[0, np.cumsum((np.diff(t) / ((pitch[1:] + pitch[:-1]) / 2)))]
    return t, tau / tau[-1]


def carp_strokes(c, ci, F, V, S, partmap, colmap):
    """everything drawn in lines on one carp, into the Strokes S (keys: groove, hl1..3, fin_groove, fin_hl, dark, eye...)"""
    L = c.L
    body_id = 1 + 3 * ci
    u = V.unit
    pm = partmap

    def to_user(t, v, lift=.0):
        th, s = c.frame_to_surface(np.asarray(t, float), np.asarray(v, float))
        sc = np.clip(s, 0, G.S_TOP)
        e = G.tex_sample(F.Hf, th, sc) + lift
        P = Lt.surf_point(th, sc, e)
        return V.world(P), th

    def vis(U, ids, grow=1):
        p = np.round(V.to_pix(U)).astype(int)
        h, w = pm.shape
        ok = (p[:, 0] >= 0) & (p[:, 0] < w) & (p[:, 1] >= 0) & (p[:, 1] < h)
        out = np.zeros(len(U), bool)
        pp = p[ok]
        out[ok] = np.isin(pm[pp[:, 1], pp[:, 0]], ids)
        return out

    def light_at(U):
        p = np.round(V.to_pix(U)).astype(int)
        h, w = pm.shape
        p[:, 0] = np.clip(p[:, 0], 0, w - 1); p[:, 1] = np.clip(p[:, 1], 0, h - 1)
        return lum(colmap[p[:, 1], p[:, 0]])

    # ---- the scale net
    tt, tau = tau_table(c)
    ncol = c.cols
    nrow2 = c.rows / 2.0
    tg = c.tg0

    def tv_of(ta, rho):
        t = np.interp(ta / ncol, tau, tt)
        z = rho / nrow2 * 2 - 1
        d, w = c.vd(t), c.vv(t)
        return t, (d + w) / 2 + z * (d - w) / 2, z

    t_start = np.interp(tg + .035, tt, tau) * ncol
    t_end = np.interp(.985, tt, tau) * ncol
    off = (-.018 * u, -.022 * u)                          # the lit rim of an engraved edge sits toward the light
    for fam in (+1, -1):
        # lines tau +/- rho = const through the half-integer lattice
        for c0 in np.arange(np.floor(t_start * 2) / 2 - nrow2 - 1, t_end + nrow2 + 1, .5):
            ms = np.arange(0, 4 * (nrow2 + 2) + 1)
            dta, drh = getattr(c, 'soff', (0.0, 0.0))
            ta = c0 + ms / 2 + dta
            rho = ((ms / 2) if fam > 0 else nrow2 - ms / 2) + drh
            ok = (ta >= t_start - 1e-6) & (ta <= t_end + 1e-6) & (rho >= -1e-6) & (rho <= nrow2 + 1e-6)
            if ok.sum() < 2:
                continue
            ta, rho = ta[ok], rho[ok]
            t, v, z = tv_of(ta, rho)
            # behind the gill cover's bowed edge: not yet
            good = t > (tg + .028 * (1 - z ** 2) + .012)
            # control points: next tau, this rho
            tq, vq, _ = tv_of(ta[1:], rho[:-1])
            U, _ = to_user(t, v, .005)
            Uq, _ = to_user(tq, vq, .005)
            vv_ = vis(U, [body_id])
            Lm = light_at(U)
            # split into runs of visible segments
            seg_ok = good[:-1] & good[1:] & vv_[:-1] & vv_[1:]
            i = 0
            while i < len(seg_ok):
                if not seg_ok[i]:
                    i += 1
                    continue
                j = i
                while j < len(seg_ok) and seg_ok[j]:
                    j += 1
                S.chain('groove', U[i:j + 1], Uq[i:j])
                # the lit edge, in classes of light
                lv = (Lm[i:j] + Lm[i + 1:j + 1]) / 2
                cls = np.digitize(lv, [120, 165, 205])
                a = i
                while a < j:
                    b = a
                    while b < j and cls[b - i] == cls[a - i]:
                        b += 1
                    k = cls[a - i]
                    if k > 0:
                        S.chain('hl%d' % k, U[a:b + 1] + off, Uq[a:b] + off)
                    a = b
                i = j
    # ---- the lateral line: a row of short pores along the middle of the flank, bowed down a little at the front
    for ta in np.arange(np.ceil(t_start) + .5, t_end - .3, 1.0):
        t = np.interp(ta / ncol, tau, tt)
        zl = -.08 - .1 * (1 - G.sm((t - .25) / .4))
        d, w = c.vd(t), c.vv(t)
        v = (d + w) / 2 + zl * (d - w) / 2
        t2 = np.interp((ta + .38) / ncol, tau, tt)
        d2, w2 = c.vd(t2), c.vv(t2)
        v2 = (d2 + w2) / 2 + zl * (d2 - w2) / 2
        U, _ = to_user([t, t2], [v, v2], .01)
        if vis(U, [body_id]).all():
            S.chain('pore', U)
    # ---- the gill cover's free edge and the groove before it, the mouth, the nostril
    z = np.linspace(-.93, .93, 24)
    tgz = tg + .028 * (1 - z ** 2)
    d, w = c.vd(tgz), c.vv(tgz)
    U, _ = to_user(tgz, (d + w) / 2 + z * (d - w) / 2, .0)
    ok = vis(U, [body_id, body_id + 2])
    _runs(S, 'gill', U, ok)
    # the gill cover's free edge throws a soft shade on the body just behind it
    d2, w2 = c.vd(tgz + .012), c.vv(tgz + .012)
    U2, _ = to_user(tgz + .012, (d2 + w2) / 2 + z * .92 * (d2 - w2) / 2, .0)
    _runs(S, 'gill_sh', U2, ok & vis(U2, [body_id]))
    _runs(S, 'gill_hl', U + np.array(off) * 1.4 - np.array([.02 * u, 0]), ok)
    tpz = tg - .085 + .02 * (1 - z ** 2)
    d, w = c.vd(tpz), c.vv(tpz)
    zz = z * .8
    U, _ = to_user(tpz, (d + w) / 2 + zz * (d - w) / 2, .0)
    _runs(S, 'pre', U, vis(U, [body_id]))
    mt, mz = c.mouth_line(10)
    d, w = c.vd(mt), c.vv(mt)
    U, _ = to_user(mt, (d + w) / 2 + mz * (d - w) / 2, .0)
    _runs(S, 'mouth', U, vis(U, [body_id]))
    U3, _ = to_user(mt, (d + w) / 2 + (mz + .1) * (d - w) / 2, .0)
    _runs(S, 'lip', U3[1:9], vis(U3[1:9], [body_id]))
    # ---- the barbels: a short pair on the upper lip, a long pair from the corners of the mouth, hanging back and down
    # (the near one of each pair, and the far one peeping below the chin, a little shorter and darker)
    for (t0, zb, ln, ang, far) in ((.022, -.30, .032, -1.45, 0), (.062, -.56, .055, -1.25, 0),
                                   (.026, -.40, .024, -1.6, 1), (.066, -.66, .04, -1.45, 1)):
        d0, w0 = c.vd(t0), c.vv(t0)
        v0 = (d0 + w0) / 2 + zb * (d0 - w0) / 2
        a = np.linspace(0, 1, 5)
        bt = t0 + ln * a * np.cos(ang + .4 * a)
        bv = v0 + ln * L * a * np.sin(ang + .4 * a)
        U, _ = to_user(bt, bv, .05)
        if not vis(U[:2], [body_id, body_id + 2]).any():
            continue
        S.chain('barbel_sh', U + np.array([.025 * u, .035 * u]))
        S.chain('barbel_far' if far else 'barbel', U)
    # ---- the eye: a small inlaid pearl of dark gold-brown bronze, rounded by a warmer light on its upper left, one tiny glint
    te, ze = c.eye()
    a = np.linspace(0, 2 * np.pi, 29)[:-1]
    d0, w0 = c.vd(te), c.vv(te)
    hw0 = (d0 - w0) / 2
    for key, rr, dt, dz in (('eye_pearl', .013, 0, 0), ('eye_lit', .0075, -.0035, .0035)):
        tt_ = te + dt + rr * np.cos(a)
        zz_ = ze + (dz + rr * np.sin(a)) * L / hw0
        d1, w1 = c.vd(tt_), c.vv(tt_)
        U, _ = to_user(tt_, (d1 + w1) / 2 + zz_ * (d1 - w1) / 2, .0)
        if vis(U, [body_id]).mean() > .7:
            S.chain(key, np.vstack([U, U[:1]]))
    tt_ = np.array([te - .0055, te - .0045])
    zz_ = np.array([ze + .0055 * L / hw0, ze + .0062 * L / hw0])
    d1, w1 = c.vd(tt_), c.vv(tt_)
    U, _ = to_user(tt_, (d1 + w1) / 2 + zz_ * (d1 - w1) / 2, .02)
    if vis(U, [body_id]).all():
        S.chain('glint', U)
    # ---- the fins' rays
    for name, f in c.fins.items():
        if name in c.skip:
            continue
        lid = body_id + (1 if f['layer'] == 'back' else 2)
        for ri, ((ta, va), (tb, vb)) in enumerate(c.fin_rays(name)):
            a = np.linspace(0, 1, 7)
            t = ta + (tb - ta) * a; v = va + (vb - va) * a
            if name == 'caudal':      # the tail ripples
                wv = .012 * L * np.sin(np.pi * a) * np.sin(2.2 * np.pi * a + ri * .35)
                ln_ = np.hypot((tb - ta) * L, vb - va) or 1
                t = t + wv * (-(vb - va) / ln_) / L; v = v + wv * ((tb - ta) * L / ln_)
            U, _ = to_user(t, v, .01)
            ok = vis(U, [lid])
            _runs(S, 'ray_sh' if ri or name not in ('dorsal', 'anal') else 'spine_sh', U + np.array([.012 * u, .016 * u]), ok)
            _runs(S, 'ray', U, ok)


def _runs(S, key, U, ok):
    i = 0
    n = len(U)
    while i < n:
        if not ok[i]:
            i += 1
            continue
        j = i
        while j < n and ok[j]:
            j += 1
        if j - i >= 2:
            S.chain(key, U[i:j])
        i = j


# ---------------------------------------------------------------- the whole body
def write(R, F, view, out_scale=1.0, q=None, P=None):
    """the SVG of the jar's body (user space of the view): returns (defs, body)"""
    P = P or {}
    V = View(R, view, out_scale)
    u = V.unit
    q = q or (.1 if view == 'shop' else .2)
    mapf = V.pix
    part = R['part']
    defs, body = [], []
    blur_g = P.get('blur_g', .22) * u
    blur_c = P.get('blur_c', .1) * u
    defs.append('<filter id="bg" x="-3%%" y="-3%%" width="106%%" height="106%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(blur_g))
    defs.append('<filter id="bc" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(blur_c))
    defs.append('<filter id="bs" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % K.fmt(P.get('blur_s', .05) * u))
    step = P.get('step', 5.0)
    K.RDP_EPS, K.FIT_EPS = P.get('rdp', .45), 0
    # ---- the ground
    g = R['hit0']
    gp = region_path(g, q, mapf)
    defs.append('<clipPath id="cg"><path d="%s"/></clipPath>' % gp)
    K.AREA_MIN = 30
    gdefs, bb = bands_vgrad(R['ground'], g, mapf, q, step * 1.6, P.get('dy_g', 5.0), 'gv')
    defs += gdefs
    body.append('<g clip-path="url(#cg)"><path fill="%s" d="%s"/><g filter="url(#bg)">%s</g>' % (
        bb[0][0], gp, ''.join('<path fill="%s" d="%s"/>' % (c_, d_) for c_, d_ in bb[1:])))
    nb = len(bb)
    # ---- the relief's shadow and occlusion on the ground: stacked shades, continued smoothly under the carp
    A = np.clip(1 - R['shf'], 0, 1).astype(np.float32)
    under = (part > 0) & g
    A8 = np.clip(A * 255, 0, 255).astype(np.uint8)
    A8 = cv2.inpaint(A8, cv2.dilate(under.astype(np.uint8), np.ones((3, 3), np.uint8)), 4, cv2.INPAINT_TELEA)
    A = np.where(g, A8.astype(np.float32) / 255, 0)
    A = cv2.GaussianBlur(A, (0, 0), .6)
    dl = P.get('dsh', .07)
    K.AREA_MIN = 6
    sh = ''
    for lev in np.arange(dl * .6, A.max(), dl):
        d_ = K.contour_paths(A, float(lev), step * .7, q, mapf, 1.0)
        if d_:
            sh += '<path d="%s"/>' % d_
    op = 1 - (1 - min(.95, dl * 1.15))
    body.append('<g fill="#1c0c04" fill-opacity="%s" filter="url(#bs)">%s</g></g>' % (K.fmt(op), sh))
    # ---- the carp
    S_all = []
    for ci, c in enumerate(C.SCHOOL):
        base = 1 + 3 * ci
        S = Strokes(q)
        for lid, nm in ((base + 1, 'b'), (base, 'm'), (base + 2, 'f')):
            m = part == lid
            if m.sum() < 8:
                continue
            # the fins behind run on under the body: no seam where the body sits on them
            mm = m | (cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & (part == base)) if nm == 'b' else m
            cp = region_path(mm, q, mapf, blur=.7)
            if not cp:
                continue
            cid = 'k%d%s' % (ci, nm)
            defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (cid, cp))
            K.AREA_MIN = 22
            col = cv2.GaussianBlur(R['col'], (0, 0), P.get('csm', .6))
            bb = K.bands(col, m, mapf, q, step * .55, dy=P.get('dy_c', 9.0))
            nb += len(bb)
            body.append('<g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#bc)">%s</g>' % (
                cid, bb[0][0], cp, ''.join('<path fill="%s" d="%s"/>' % (c_, d_) for c_, d_ in bb[1:])))
            # the undercut: a dark crisp line just inside the outline, a little stronger on the shadow side
            body.append('<path fill="none" stroke="#2a1606" stroke-opacity=".55" stroke-width="%s" d="%s"/></g>' % (K.fmt(.035 * u), cp))
        S_all.append(S)
        carp_strokes(c, ci, F, V, S, part, R['col'])
        w = lambda k_: K.fmt(k_ * u)
        styles = {
            'ray_sh': 'fill="none" stroke="#3a2410" stroke-opacity=".45" stroke-width="%s"' % w(.022),
            'spine_sh': 'fill="none" stroke="#3a2410" stroke-opacity=".6" stroke-width="%s"' % w(.04),
            'ray': 'fill="none" stroke="#f4e2b8" stroke-opacity=".38" stroke-width="%s"' % w(.016),
            'groove': 'fill="none" stroke="#2e1c0c" stroke-opacity=".72" stroke-width="%s" stroke-linejoin="round"' % w(.05),
            'hl1': 'fill="none" stroke="#fff2cc" stroke-opacity=".3" stroke-width="%s"' % w(.03),
            'hl2': 'fill="none" stroke="#fff2cc" stroke-opacity=".55" stroke-width="%s"' % w(.032),
            'hl3': 'fill="none" stroke="#fffbea" stroke-opacity=".85" stroke-width="%s"' % w(.034),
            'pore': 'fill="none" stroke="#2c1a0a" stroke-opacity=".5" stroke-width="%s" stroke-linecap="round"' % w(.03),
            'pre': 'fill="none" stroke="#3a2410" stroke-opacity=".3" stroke-width="%s"' % w(.03),
            'gill': 'fill="none" stroke="#24140a" stroke-opacity=".8" stroke-width="%s" stroke-linecap="round"' % w(.04),
            'gill_sh': 'fill="none" stroke="#2a1606" stroke-opacity=".38" stroke-width="%s" stroke-linecap="round" filter="url(#bc)"' % w(.12),
            'lip': 'fill="none" stroke="#f6e2b4" stroke-opacity=".55" stroke-width="%s" stroke-linecap="round"' % w(.02),
            'gill_hl': 'fill="none" stroke="#fff0c8" stroke-opacity=".5" stroke-width="%s" stroke-linecap="round"' % w(.022),
            'mouth': 'fill="none" stroke="#1e1006" stroke-opacity=".9" stroke-width="%s" stroke-linecap="round"' % w(.05),
            'barbel_sh': 'fill="none" stroke="#24140a" stroke-opacity=".4" stroke-width="%s" stroke-linecap="round"' % w(.09),
            'barbel': 'fill="none" stroke="#a07a46" stroke-width="%s" stroke-linecap="round"' % w(.055),
            'barbel_far': 'fill="none" stroke="#6e5030" stroke-width="%s" stroke-linecap="round"' % w(.055),
            'barbel_hl': 'fill="none" stroke="#f2dcae" stroke-opacity=".7" stroke-width="%s" stroke-linecap="round"' % w(.025),
            'eye_pearl': 'fill="#4e3218"',
            'eye_lit': 'fill="#8a6234" fill-opacity=".8"',
            'glint': 'fill="none" stroke="#fff6e0" stroke-opacity=".9" stroke-width="%s" stroke-linecap="round"' % w(.012),
        }
        # rays and scales stay inside their parts
        fins_svg = S.svg({k_: styles[k_] for k_ in ('ray_sh', 'spine_sh', 'ray')})
        clipb = 'k%db' % ci; clipf = 'k%df' % ci; clipm = 'k%dm' % ci
        ids = ''.join(defs)
        if fins_svg:
            # the rays of each layer under its own clip
            Sb, Sf = Strokes(q), Strokes(q)
            for key in ('ray_sh', 'spine_sh', 'ray'):
                pass
            body.append('<g clip-path="url(#%s)">%s</g>' % (clipb, fins_svg) if 'id="%s"' % clipb in ids else '')
            if 'id="%s"' % clipf in ids:
                body.append('<g clip-path="url(#%s)">%s</g>' % (clipf, fins_svg))
        sc_svg = S.svg({k_: styles[k_] for k_ in ('groove', 'hl1', 'hl2', 'hl3', 'pore', 'pre', 'gill_sh', 'gill', 'gill_hl', 'mouth', 'lip', 'eye_pearl',
                                                  'eye_lit', 'glint')})
        if 'id="%s"' % clipm in ids:
            body.append('<g clip-path="url(#%s)">%s</g>' % (clipm, sc_svg))
        body.append(S.svg({k_: styles[k_] for k_ in ('barbel_sh', 'barbel_far', 'barbel', 'barbel_hl')}))
    return defs, body, nb
