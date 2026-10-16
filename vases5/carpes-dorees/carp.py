# Our carp (Cyprinus carpio), cast in high relief and laid on the jar's surface. One carp is a body (the strip between its back
# and belly contours, rounded about a crest, the head with its gill cover, eye and nostril) and thin rayed fins: the long dorsal
# fin with its spine in front, the forked tail, the short anal fin, and on the near side the pectoral and pelvic fins lying over
# the belly. Lengths are in fractions of the standard length L (snout to the base of the tail); the fish frame is (t = u / L
# along the spine from the snout, v across it, positive on the back).
import math
import numpy as np
import cv2
from scipy.interpolate import PchipInterpolator
import geom as G

# lateral outline of a carp, as the back (top) and belly (bottom) lines across the spine, in fractions of L: the snout low and
# rounded (the mouth opens below), the forehead sloping up to an arched back highest at the dorsal fin's origin, a deep body
# (~0.31 SL), a short massive head (~0.26 SL), a thick caudal peduncle (~0.13 SL)
CT = [0, .01, .03, .06, .10, .15, .20, .26, .32, .40, .48, .56, .64, .72, .80, .87, .93, 1.0, 1.02]
CTOP = [-.04, .004, .042, .078, .110, .135, .153, .167, .176, .180, .177, .168, .152, .131, .108, .089, .079, .073, .073]
CBOT = [-.04, -.072, -.095, -.112, -.126, -.137, -.146, -.153, -.158, -.160, -.159, -.152, -.140, -.122, -.101, -.084, -.074, -.068, -.068]
_fd = PchipInterpolator(CT, np.array(CTOP), extrapolate=True)
_fv = PchipInterpolator(CT, np.array(CBOT), extrapolate=True)
TG0 = .26                       # the gill cover's free edge (t), bowed back in the middle

# fins, as outlines (t, offset): 'd' outward from the back line, 'v' outward from the belly line, 'a' absolute v.
# root: the line the rays leave from (t0, t1 along the line, or two points); edge: indices of the free edge
FINS = {
    'dorsal': dict(ref='d', layer='back', h0=.34, h1=.12, n=19,
                   P=[(.395, -.004), (.405, .05), (.415, .10), (.425, .13), (.44, .136), (.46, .11), (.50, .085), (.57, .066), (.64, .056),
                      (.71, .05), (.77, .045), (.815, .035), (.835, .018), (.825, -.004)],
                   root=('c', .398, .823), edge=(1, 12)),
    'anal': dict(ref='v', layer='back', h0=.30, h1=.12, n=7,
                 P=[(.735, -.004), (.748, .05), (.765, .095), (.795, .112), (.825, .098), (.832, .06), (.82, .02), (.81, -.004)],
                 root=('c', .738, .81), edge=(1, 7)),
    'caudal': dict(ref='a', layer='back', h0=.28, h1=.08, n=24,
                   P=[(.93, .076), (1.02, .094), (1.10, .135), (1.18, .18), (1.255, .222), (1.30, .232), (1.29, .196), (1.24, .122),
                      (1.19, .052), (1.165, .004), (1.188, -.046), (1.235, -.118), (1.282, -.192), (1.296, -.226), (1.25, -.222), (1.17, -.176),
                      (1.095, -.128), (1.02, -.09), (.93, -.071)],
                   root=('p', (.94, .074), (.94, -.069)), edge=(1, 18)),
    'pelvic': dict(ref='v', layer='front', h0=.22, h1=.14, n=9,
                   P=[(.45, -.03), (.485, -.035), (.53, -.01), (.58, .03), (.61, .07), (.60, .095), (.565, .095), (.52, .065), (.475, .025),
                      (.452, -.005)],
                   root=('c2', (.45, -.03), (.485, -.035)), edge=(2, 9)),
    'pectoral': dict(ref='v', layer='front', h0=.24, h1=.14, n=12,
                     P=[(.235, -.06), (.275, -.065), (.33, -.04), (.39, .0), (.43, .045), (.44, .08), (.415, .10), (.37, .09), (.31, .055),
                        (.26, .01), (.237, -.035)],
                     root=('c2', (.235, -.06), (.275, -.065)), edge=(2, 10)),
}


class Carp:
    """one carp: snout at (theta0, h0), swimming along phi (degrees, 0 to the right, positive upward), its spine bent by
    bend = (b1, b2) (the turn over its length, radians, as one arc and as an S); zc: the crest of the section across the
    body (0 a flank seen square, toward 1 the back turned to the viewer); alloy: the metal's colour family"""

    def __init__(self, name, theta0, h0, phi, L, bend=(0., 0.), zc=.2, alloy='gold', head='same', relief=.5, scale_rows=12,
                 scale_cols=25, skip_fins=()):
        self.name, self.theta0, self.h0, self.L = name, theta0, h0, L
        self.s0 = float(G.s_of_h(h0))
        self.phi, self.bend, self.zc, self.alloy, self.head = math.radians(phi), bend, zc, alloy, head
        self.relief, self.rows, self.cols = relief, scale_rows, scale_cols
        self.skip = set(skip_fins)
        self.fins, self.tg0, self._eye = FINS, TG0, None
        self._spine()

    # ------------------------------------------------------------ the spine, from the snout back to the tip of the tail
    def _spine(self):
        L = self.L
        n = 280
        u = np.linspace(-.04 * L, 1.36 * L, n)
        b1, b2 = self.bend
        # curvature (1/cm): one arc and one S over the body, as turns in radians over its length
        tt = np.clip(u / L, 0, 1.36)
        k = (b1 * (math.pi / 2) * np.sin(math.pi * tt / 1.36) + b2 * math.pi * np.sin(2 * math.pi * tt / 1.36)) / (1.36 * L)
        k = np.where(u < 0, 0, k)
        ang = np.zeros(n)
        du = u[1] - u[0]
        a0 = self.phi + math.pi
        i0 = int(np.argmin(np.abs(u)))
        for i in range(n):
            ang[i] = a0 + np.sum(k[i0:i]) * du if i >= i0 else a0
        T = np.c_[np.cos(ang), np.sin(ang)]
        C = np.zeros((n, 2))
        for i in range(i0 + 1, n):
            C[i] = C[i - 1] + T[i - 1] * du
        for i in range(i0 - 1, -1, -1):
            C[i] = C[i + 1] - T[i] * du
        N = np.c_[T[:, 1], -T[:, 0]]
        if N[n // 2, 1] < 0:                 # the back is the upper side
            N = -N
        self.u, self.C, self.T, self.N = u, C, T, N

    def vd(self, t):
        return _fd(np.clip(t, 0, 1.02)) * self.L

    def vv(self, t):
        return _fv(np.clip(t, 0, 1.02)) * self.L

    # ------------------------------------------------------------ fish frame <-> chart (cm) <-> surface
    def frame_to_chart(self, t, v):
        u = np.asarray(t, float) * self.L
        cx = np.interp(u, self.u, self.C[:, 0]); cy = np.interp(u, self.u, self.C[:, 1])
        nx = np.interp(u, self.u, self.N[:, 0]); ny = np.interp(u, self.u, self.N[:, 1])
        return cx + v * nx, cy + v * ny

    def chart_to_surface(self, x, y):
        s = self.s0 + y
        th = self.theta0 + x / G.r_of_s(np.clip(s, 0, G.S_TOP))
        return th, s

    def frame_to_surface(self, t, v):
        return self.chart_to_surface(*self.frame_to_chart(t, v))

    def surface_to_chart(self, th, s):
        return (th - self.theta0) * G.r_of_s(s), s - self.s0

    def chart_to_frame(self, x, y):
        """nearest point of the spine: (t, v) for chart points (arrays)"""
        P = np.c_[np.ravel(x), np.ravel(y)]
        A = self.C[:-1]; B = self.C[1:]; D = B - A; l2 = (D ** 2).sum(1)
        best = np.full(len(P), 1e9); bt = np.zeros(len(P)); bv = np.zeros(len(P))
        for i0 in range(0, len(A), 40):
            a = A[i0:i0 + 40]; d = D[i0:i0 + 40]
            w = P[:, None, :] - a[None]
            q = np.clip((w * d[None]).sum(2) / l2[None, i0:i0 + 40], 0, 1)
            c = a[None] + q[..., None] * d[None]
            dd = ((P[:, None, :] - c) ** 2).sum(2)
            j = np.argmin(dd, 1); dm = dd[np.arange(len(P)), j]
            upd = dm < best
            uu = self.u[i0 + j] + q[np.arange(len(P)), j] * (self.u[1] - self.u[0])
            nn = self.N[i0 + j]
            vv = ((P - c[np.arange(len(P)), j]) * nn).sum(1)
            best = np.where(upd, dm, best); bt = np.where(upd, uu / self.L, bt); bv = np.where(upd, vv, bv)
        return bt.reshape(np.shape(x)), bv.reshape(np.shape(x))

    # ------------------------------------------------------------ the body: its height over the surface (cm)
    def section(self, t, v):
        """height of the body at (t, v) (0 outside), and z (-1 belly .. 1 back)"""
        d, w = self.vd(t), self.vv(t)
        hw = np.maximum((d - w) / 2, 1e-4); vm = (d + w) / 2
        z = (v - vm) / hw
        zc = self.zc
        zz = np.where(z > zc, (z - zc) / (1 - zc), (z - zc) / (1 + zc))
        prof = np.clip(1 - np.abs(zz) ** 2.4, 0, 1) ** .42
        hb = self.relief * hw * (.75 + .25 * G.sm(t / .2))
        inside = (t >= 0) & (t <= 1.0) & (np.abs(z) <= 1)
        # the caudal peduncle melts into the root of the tail
        hb = hb * (1 - .5 * G.sm((t - .88) / .12))
        return np.where(inside, hb * prof, 0.0), z, inside

    def body_height(self, t, v):
        h, z, inside = self.section(t, v)
        # the head: the gill cover a plate rising toward its free edge, proud of the body behind it; a shallow groove before it
        tg = self.tg0 + .028 * (1 - z ** 2)
        hw = (self.vd(t) - self.vv(t)) / 2
        op = .15 * G.sm((t - (tg - .085)) / .085) * (t < tg)
        pre = -.06 * G.bump((t - (tg - .095)) / .012)
        # the eye: a dome in its socket; the nostril: a small pit
        te, ze = self.eye()
        ex, ey = (t - te) * self.L, (z - ze) * hw
        ed = np.hypot(ex, ey) / (.013 * self.L)
        # a small inlaid pearl set in a slight raised bezel (diameter ~1/9 of the head's height)
        eye = .06 * G.bump(ed / 1.05) + .045 * G.bump((ed - 1.3) / .35)
        nx_, ny_ = (t - .04) * self.L, (z - (ze - .07)) * hw
        nos = -.05 * G.bump(np.hypot(nx_, ny_) / (.012 * self.L))
        # the mouth: a low cleft under a fleshy upper lip
        md = self._mouth_dist(t, z, hw)
        mo = -.07 * G.bump(md / (.007 * self.L))
        lip = .06 * G.bump(self._mouth_dist(t, z - .09, hw) / (.012 * self.L))
        # the cheek, modelled under and behind the eye; the snout planed into a slight chamfer in front of the eyes
        ck = .14 * G.bump(np.hypot((t - .165) * self.L, (z + .2) * hw) / (.07 * self.L))
        ch = -.07 * G.sm((.045 - t) / .035) * G.sm((z + .2) / .4)
        hh = h + np.where(inside & (h > 0), (op + pre) * np.minimum(1, h / .3) + eye + nos + mo + lip + (ck + ch) * np.minimum(1, h / .3), 0)
        return np.maximum(hh, 0) * inside, z, inside

    def eye(self):
        if self._eye is not None:
            return self._eye
        return .082, .40 - .45 * self.zc

    def mouth_line(self, n=12):
        """the mouth's cleft: from the tip of the snout down and back (fish frame t, z)"""
        te, ze = self.eye()
        a = np.linspace(0, 1, n)
        return .012 + .052 * a, -.22 - .36 * a + .04 * a * a

    def _mouth_dist(self, t, z, hw):
        mt, mz = self.mouth_line(16)
        d = np.full(np.shape(t), 1e9)
        for i in range(len(mt)):
            d = np.minimum(d, np.hypot((t - mt[i]) * self.L, (z - mz[i]) * hw))
        return d

    # ------------------------------------------------------------ fins: outlines in the fish frame
    def fin_poly(self, name, dense=6):
        f = self.fins[name]
        P = np.array(f['P'], float)
        if dense > 1:                      # a smooth closed outline (Catmull-Rom through the points)
            P = catmull(P, dense, closed=True)
        return self._fin_tv(f, P)

    def _fin_tv(self, f, P):
        t = P[:, 0]
        if f['ref'] == 'd':
            v = self.vd(t) + P[:, 1] * self.L
        elif f['ref'] == 'v':
            v = self.vv(t) - P[:, 1] * self.L
        else:
            v = P[:, 1] * self.L
        return t, v

    def fin_rays(self, name):
        """the rays of a fin: (root, tip) pairs in the fish frame"""
        f = self.fins[name]
        P = np.array(f['P'], float)
        i0, i1 = f['edge']
        E = catmull(P[i0:i1 + 1], 8, closed=False)
        et, ev = self._fin_tv(f, E)
        d = np.r_[0, np.cumsum(np.hypot(np.diff(et) * self.L, np.diff(ev)))]
        rk = f['root']
        out = []
        n = f['n']
        for k in range(n):
            a = (k + .5) / n if rk[0] != 'c' else k / (n - 1)
            if rk[0] == 'c':
                tr = rk[1] + (rk[2] - rk[1]) * (.04 + .92 * a)
                vr = self.vd(tr) - .006 * self.L if f['ref'] == 'd' else self.vv(tr) + .006 * self.L
            else:
                p0, p1 = np.array(rk[1]), np.array(rk[2])
                pr = p0 + (p1 - p0) * a
                tr, vr = self._fin_tv(f, pr[None])
                tr, vr = float(tr[0]), float(vr[0])
            dl = d[-1] * a
            tt, vt = np.interp(dl, d, et), np.interp(dl, d, ev)
            # the rays fall a little short of the free edge
            tt = tr + (tt - tr) * .97; vt = vr + (vt - vr) * .97
            out.append(((tr, vr), (tt, vt)))
        return out


def catmull(P, n, closed=True):
    P = np.asarray(P, float)
    m = len(P)
    out = []
    rng = range(m) if closed else range(m - 1)
    for i in rng:
        p0 = P[(i - 1) % m] if closed else P[max(i - 1, 0)]
        p1 = P[i]; p2 = P[(i + 1) % m] if closed else P[i + 1]
        p3 = P[(i + 2) % m] if closed else P[min(i + 2, m - 1)]
        for k in range(n):
            s = k / n
            out.append(.5 * ((2 * p1) + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s * s + (-p0 + 3 * p1 - 3 * p2 + p3) * s ** 3))
    if not closed:
        out.append(P[-1])
    return np.array(out)


# ---------------------------------------------------------------- the carp of the reference, from their measured outlines
FIN_H = dict(caudal=(.28, .08, 18), dorsal=(.30, .10, 16), anal=(.26, .10, 7), pectoral=(.24, .14, 11), pelvic=(.22, .14, 8),
             pectoral2=(.22, .10, 7))


def photo_to_surface(px):
    """pixels of the photograph -> (theta, s) on the turned surface (nan where the ray misses the jar)"""
    import light as Lt
    px = np.asarray(px, float)
    c = Lt.PH
    f = c['K'] * c['ZE']; cyc = c['CY0'] - c['K'] * c['YE']
    D = np.c_[(px[:, 0] + .5 - c['CX']) / f, -(px[:, 1] + .5 - cyc) / f, -np.ones(len(px))]
    D /= np.linalg.norm(D, axis=1, keepdims=True)
    O = np.tile(np.array([0, c['YE'], c['ZE']]), (len(px), 1))
    lam, th, s, e = Lt.march(None, O, D, relief=False)
    return th, s


def _resample(P, n):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    q = np.linspace(0, d[-1], n)
    return np.c_[np.interp(q, d, P[:, 0]), np.interp(q, d, P[:, 1])]


class TracedCarp(Carp):
    """a carp of the reference: its spine is the middle of its measured back and belly lines, its widths and fins are the
    measured ones, carried onto the jar's surface through the photograph's camera"""

    def __init__(self, d, relief=.5):
        self.name, self.alloy, self.head, self.zc = d['name'], d['alloy'], d['head'], d['view']
        self.relief, self.rows, self.cols, self.skip = d.get('relief', relief), 12, 25, set()
        th, s = photo_to_surface([d['S']])
        self.theta0, self.s0 = float(th[0]), float(s[0])
        self.h0 = float(G.h_of_s(self.s0))
        self.phi, self.bend = 0.0, (0, 0)

        def chart(pts):
            th_, s_ = photo_to_surface(pts)
            ok = ~np.isnan(th_)
            return np.c_[(th_[ok] - self.theta0) * G.r_of_s(s_[ok]), s_[ok] - self.s0]
        top = np.vstack([[0, 0], chart(d['top'])]); bot = np.vstack([[0, 0], chart(d['bot'])])
        n = 90
        Tp, Bp = _resample(top, n), _resample(bot, n)
        mid = (Tp + Bp) / 2
        k = np.ones(7) / 7
        sm_ = np.c_[np.convolve(np.pad(mid[:, 0], 3, mode='edge'), k, 'valid'), np.convolve(np.pad(mid[:, 1], 3, mode='edge'), k, 'valid')]
        sm_[0] = mid[0]
        dl = np.hypot(*np.diff(sm_, axis=0).T)
        L = float(dl.sum())
        self.L = L
        # the spine: a little before the snout, then on past the base of the tail for the tail fin
        t0 = sm_[1] - sm_[0]; t0 /= np.linalg.norm(t0)
        t1 = sm_[-1] - sm_[-5]; t1 /= np.linalg.norm(t1)
        pre = sm_[0] - t0 * .04 * L
        post = [sm_[-1] + t1 * L * a for a in np.linspace(.02, .4, 20)]
        C_ = np.vstack([pre, sm_, post])
        u = np.r_[0, np.cumsum(np.hypot(*np.diff(C_, axis=0).T))] - .04 * L
        T_ = np.gradient(C_, axis=0); T_ /= np.linalg.norm(T_, axis=1, keepdims=True)
        N_ = np.c_[T_[:, 1], -T_[:, 0]]
        # fine resampling of the spine (the nearest-point search wants many short segments)
        uu = np.linspace(u[0], u[-1], 300)
        self.u = uu
        self.C = np.c_[np.interp(uu, u, C_[:, 0]), np.interp(uu, u, C_[:, 1])]
        Tn = np.c_[np.interp(uu, u, T_[:, 0]), np.interp(uu, u, T_[:, 1])]; Tn /= np.linalg.norm(Tn, axis=1, keepdims=True)
        self.T = Tn
        self.N = np.c_[Tn[:, 1], -Tn[:, 0]]
        tt, vt = self.chart_to_frame(Tp[:, 0], Tp[:, 1])
        if np.mean(vt[5:]) < 0:              # the back is on the side of the measured back line
            self.N = -self.N
            tt, vt = self.chart_to_frame(Tp[:, 0], Tp[:, 1])
        tb, vb = self.chart_to_frame(Bp[:, 0], Bp[:, 1])
        def prof(tq, vq):
            o = np.argsort(tq); tq, vq = tq[o], vq[o]
            keep = np.r_[True, np.diff(tq) > 1e-4]
            return tq[keep], vq[keep]
        self._top = prof(tt, vt); self._bot = prof(tb, vb)
        # the fins, in the fish's frame (absolute v), their root the segment between their first and last points
        self.fins = {}
        for name, (layer, P) in d['fins'].items():
            Pc = chart(P)
            if len(Pc) < 3:
                continue
            ft, fv = self.chart_to_frame(Pc[:, 0], Pc[:, 1])
            h0, h1, nr = FIN_H[name]
            F_ = [(float(a), float(b) / L) for a, b in zip(ft, fv)]
            self.fins[name] = dict(ref='a', layer=layer, h0=h0, h1=h1, n=nr, P=F_, root=('p', F_[0], F_[-1]), edge=(1, len(F_) - 2))
        # the eye and the gill cover
        self._eye = None
        if d['eye'] is not None:
            e = chart([d['eye']])
            if len(e):
                te, ve = self.chart_to_frame(e[:, 0], e[:, 1])
                te = float(te[0]); dd, ww = self.vd(te), self.vv(te)
                self._eye = (te, float((ve[0] - (dd + ww) / 2) / max(1e-3, (dd - ww) / 2)))
        self.tg0 = TG0
        if d['gill']:
            g = chart(d['gill'])
            if len(g):
                tg, _ = self.chart_to_frame(g[:, 0], g[:, 1])
                self.tg0 = float(np.mean(tg)) - .014
        if self._eye is None:
            self._eye = (.09, .3 - .5 * self.zc)
        # the scale net measured on the reference (work/fit_scales.py)
        import json, os
        sf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scales_fit.json')
        if os.path.exists(sf):
            m = json.load(open(sf)).get(self.name)
            if m:
                self.cols, self.rows, self.soff = m['cols'], m['rows'], tuple(m['soff'])

    def vd(self, t):
        return np.interp(np.clip(t, 0, 1.02), np.r_[0, self._top[0]], np.r_[0, self._top[1]])

    def vv(self, t):
        return np.interp(np.clip(t, 0, 1.02), np.r_[0, self._bot[0]], np.r_[0, self._bot[1]])


def _school():
    import os
    if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'traces_fit.py')):
        import traces_fit as tr
    else:
        import traces as tr
    return [TracedCarp(d) for d in tr.CARPS]


SCHOOL = _school()


# ---------------------------------------------------------------- the relief field over the texels
def build_field(school=SCHOOL):
    """height (cm), owner (0 the jar, 1 + 3k + {0 body, 1 fins behind, 2 fins in front}), and the fish frame (t, z) of the
    bodies, over the texel grid"""
    Hf = np.zeros((G.NS, G.NTH), np.float32)
    own = np.zeros((G.NS, G.NTH), np.int16)
    Ft = np.zeros((G.NS, G.NTH), np.float32); Fz = np.zeros((G.NS, G.NTH), np.float32); Fr = np.zeros((G.NS, G.NTH), np.float32)
    for k, c in enumerate(school):
        # texels near the fish: its chart bounding box
        tt = np.linspace(-.05, 1.36, 80)
        xs, ys = [], []
        for vv in (-.24, 0, .24):
            x, y = c.frame_to_chart(tt, vv * c.L)
            xs += list(x); ys += list(y)
        th, s = c.chart_to_surface(np.array(xs), np.array(ys))
        j0 = max(0, int((s.min() - .5) / G.TX)); j1 = min(G.NS, int((s.max() + .5) / G.TX) + 1)
        i0 = max(0, int((th.min() - .06 + G.TH0) / G.DTH)); i1 = min(G.NTH, int((th.max() + .06 + G.TH0) / G.DTH) + 1)
        if j1 <= j0 or i1 <= i0:
            continue
        S_, T_ = np.meshgrid(G.SV[j0:j1], G.TH[i0:i1], indexing='ij')
        x, y = c.surface_to_chart(T_, S_)
        t, v = c.chart_to_frame(x, y)
        sub = (slice(j0, j1), slice(i0, i1))

        def tex_poly(tv):
            th_, s_ = c.frame_to_surface(*tv)
            P = np.c_[(th_ + G.TH0) / G.DTH - i0, s_ / G.TX - j0]
            m = np.zeros(S_.shape, np.uint8)
            cv2.fillPoly(m, [np.round(P * 8).astype(np.int32)], 1, lineType=cv2.LINE_AA, shift=3)
            return m.astype(bool)

        def fin_field(name):
            f = c.fins[name]
            m = tex_poly(c.fin_poly(name))
            # distance from the root line, normalised over the fin
            rl = np.zeros(S_.shape, np.uint8)
            rays = c.fin_rays(name)
            R = np.array([r[0] for r in rays])
            th_, s_ = c.frame_to_surface(R[:, 0], R[:, 1])
            Q = np.c_[(th_ + G.TH0) / G.DTH - i0, s_ / G.TX - j0]
            cv2.polylines(rl, [np.round(Q * 8).astype(np.int32)], False, 1, 2, shift=3)
            dist = cv2.distanceTransform((1 - rl).astype(np.uint8), cv2.DIST_L2, 5)
            rho = np.clip(dist / max(1e-3, dist[m].max() if m.any() else 1), 0, 1)
            h = f['h0'] + (f['h1'] - f['h0']) * rho
            # fine ridges along the rays (the spine of a fin a little stronger)
            ridge = np.zeros(S_.shape, np.float32)
            for ri, (a, b) in enumerate(rays):
                ta, va = a; tb, vb = b
                th2, s2 = c.frame_to_surface(np.array([ta, tb]), np.array([va, vb]))
                q = np.c_[(th2 + G.TH0) / G.DTH - i0, s2 / G.TX - j0]
                cv2.line(ridge, tuple(np.round(q[0] * 8).astype(int)), tuple(np.round(q[1] * 8).astype(int)), 1.0 if ri else 1.6, 1,
                         lineType=cv2.LINE_AA, shift=3)
            ridge = cv2.GaussianBlur(ridge, (0, 0), .9)
            h = h + .05 * np.clip(ridge, 0, 1.6)
            # the free edge thins: the plate sinks a little toward it
            ed = cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5) * G.TX
            h = h * (.6 + .4 * G.sm(ed / .12))
            return m, h.astype(np.float32), rho.astype(np.float32)

        Hs, Os = Hf[sub], own[sub]
        base = 1 + 3 * k
        lower0 = cv2.GaussianBlur(Hs.astype(np.float32), (0, 0), .25 / G.TX) * .8
        for name in [n_ for n_, f_ in c.fins.items() if f_['layer'] == 'back']:
            if name in c.skip:
                continue
            m, h, rho = fin_field(name)
            h = h + lower0
            upd = m & (h > Hs)
            Hs[upd] = h[upd]; Os[upd] = base + 1; Fr[sub][upd] = rho[upd]
        hb, z, inside = c.body_height(t, v)
        # over an earlier carp, this one rests on it: its relief stands on what is already there
        lower = cv2.GaussianBlur(np.where(Os < base, Hs, 0).astype(np.float32), (0, 0), .25 / G.TX) * .8
        hb = np.where(inside & (hb > .02), hb + lower, hb)
        upd = inside & (hb > .02) & (hb >= Hs - .02)
        Hs[upd] = hb[upd]; Os[upd] = base
        Ft[sub][upd] = t[upd]; Fz[sub][upd] = z[upd]
        for name in [n_ for n_, f_ in c.fins.items() if f_['layer'] == 'front']:
            if name in c.skip:
                continue
            m, h, rho = fin_field(name)
            h = h + lower0
            hb_here = np.where(inside, hb, 0)
            hh = np.maximum(h, hb_here + .09)
            # where it leaves the body it slants down to its own height
            Hs[m] = np.maximum(Hs[m] * (Os[m] != base) , hh[m]); Os[m] = base + 2; Fr[sub][m] = rho[m]
        Hf[sub], own[sub] = Hs, Os
    return Hf, own, Ft, Fz, Fr
