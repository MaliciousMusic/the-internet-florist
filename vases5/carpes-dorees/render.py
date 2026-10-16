# Renders the lit fields of the jar for one view (the shop's, or the photograph's camera for the comparison): per pixel, the
# part it shows (the jar, or a carp's body, fins behind, fins in front), the ground's colour without the relief, the shadow of
# the relief on the ground, and the colour of every part. These fields are what the vector writer turns into curves.
import time
import numpy as np
import cv2
import geom as G
import carp as C
import light as Lt


def frame(view, spx=2.5):
    """pixel grid of a view: (x0, y0, w, h, scale) in user units"""
    if view == 'shop':
        m = 1.0
        x0 = Lt.VX - (G.RMAX + 1.9) * Lt.UPC; x1 = Lt.VX + (G.RMAX + 1.9) * Lt.UPC
        y0 = Lt.FL - (G.H_CM + 1.0) * Lt.UPC; y1 = Lt.FL + (G.rr[0] * Lt.RY + m) * Lt.UPC
        return x0, y0, int((x1 - x0) * spx), int((y1 - y0) * spx), spx
    return 0.0, 0.0, int(564 * spx), int(518 * spx), spx


def render(view='shop', spx=2.5, F=None, log=print):
    t0 = time.time()
    if F is None:
        Hf, own, Ft, Fz, Fr = C.build_field()
        F = Lt.Fields(Hf, own, Ft, Fz)
        F.Fr = Fr
        F.shadows()
        log('field+shadows %.1fs' % (time.time() - t0))
    x0, y0, w, h, sc = frame(view, spx)
    if view == 'shop':
        O, D = Lt.shop_rays(sc, x0, y0, w, h)
    else:
        O, D = Lt.photo_rays(sc, w, h)
    lam, th, s, e = Lt.march(F, O, D, relief=True)
    lam0, th0, s0, e0 = Lt.march(F, O, D, relief=False)
    log('rays %.1fs' % (time.time() - t0))
    n = w * h
    hit = ~np.isnan(lam)
    hit0 = ~np.isnan(lam0)
    lid = hit & (s > G.S_TOP - 1e-3)
    lid0 = hit0 & (s0 > G.S_TOP - 1e-3)
    # the owner of every pixel: the relief's owner where the ray met the relief
    part = np.full(n, -1, np.int16)
    k = np.nonzero(hit & ~lid)[0]
    inr = np.abs(th[k]) < G.TH0
    ow = np.zeros(len(k), np.int16)
    jj = np.clip(np.round(s[k] / G.TX).astype(int), 0, G.NS - 1); ii = np.clip(np.round((th[k] + G.TH0) / G.DTH).astype(int), 0, G.NTH - 1)
    ow[inr] = F.own[jj[inr], ii[inr]]
    # a pixel on the bare jar whose texel belongs to a carp's very edge (height ~0) stays the jar
    edge = (ow > 0) & (e[k] < .015)
    ow[edge] = 0
    part[k] = ow
    part[lid] = -2
    # --- the ground without the relief: the turned surface as if bare (its colour continues under the carp)
    g = np.nonzero(hit0 & ~lid0)[0]
    n0 = Lt.normals(F, th0[g], s0[g], relief=False)
    hcm = G.h_of_s(np.clip(s0[g], 0, G.S_TOP))
    # very low mottling of the patina (two scales), barely there: the reference is smooth and glossy
    X = th0[g] * G.RMAX
    nz_ = .025 * np.sin(X * .9 + hcm * .37) * np.sin(hcm * .8 - X * .21) + .02 * np.sin(X * 2.3 + 1.7) * np.sin(hcm * 2.9 + .4)
    ground = np.zeros((n, 3))
    if Lt.MEAS is not None:
        ground[g] = Lt.meas_ground(n0, hcm)
    else:
        ground[g] = Lt.shade_patina(n0, hcm, np.ones(len(g)), np.ones(len(g)), nz_)
    N0 = np.zeros((n, 3), np.float32); N0[g] = n0
    H0 = np.zeros(n, np.float32); H0[g] = hcm
    # --- shadow and occlusion of the relief on the ground (1 = untouched), at the bare surface point
    shf = np.ones(n, np.float32)
    inr0 = np.abs(th0[g]) < G.TH0
    sg = np.ones(len(g)); ag = np.ones(len(g))
    sg[inr0] = G.tex_sample(F.sh, th0[g][inr0], np.clip(s0[g][inr0], 0, G.S_TOP))
    ag[inr0] = G.tex_sample(F.ao, th0[g][inr0], np.clip(s0[g][inr0], 0, G.S_TOP))
    # the shadow darkens what the key light gave: on a surface turned away it barely shows
    ns0 = np.c_[n0[:, 0], -n0[:, 1], n0[:, 2]]
    lit = np.clip((ns0 @ Lt.L3 + .12) / 1.12, 0, 1)
    dark = (1 - sg) * (.25 + .55 * lit) + (1 - ag) * .22
    shf[g] = 1 - np.clip(dark, 0, .92)
    # --- the relief's colours
    col = np.zeros((n, 3))
    kk = np.nonzero(part > 0)[0]
    if len(kk):
        nn = Lt.normals(F, th[kk], s[kk], relief=True)
        sc_ = np.clip(s[kk], 0, G.S_TOP)
        shv = G.tex_sample(F.sh, th[kk], sc_); aov = G.tex_sample(F.ao, th[kk], sc_); wrv = G.tex_sample(F.wr, th[kk], sc_)
        pk = part[kk]
        ci = (pk - 1) // 3; layer = (pk - 1) % 3
        tint = np.zeros((len(kk), 3))
        ft = G.tex_sample(F.Ft, th[kk], sc_, order=0)
        for c_i, c in enumerate(C.SCHOOL):
            m = ci == c_i
            if not m.any():
                continue
            T = np.array(Lt.ALLOY[c.alloy])
            tint[m] = T
            if c.head == 'black':
                # a dark head inlaid: from the gill cover forward, blended over a short way
                b = G.sm((ft[m] - .2) / .1)[:, None]
                hd = np.array(Lt.ALLOY['black'])
                tint[m] = hd * (1 - b) + T * b
        # the fins are cast in the body's gold, a shade deeper (the dark carp's fins too: no black blades)
        fl = layer > 0
        tint[fl] = np.where((tint[fl].sum(1) < 1.9)[:, None], np.array([.80, .62, .40]), tint[fl] * .92)
        col[kk] = Lt.shade_metal(nn, tint, shv, aov, wrv)
        NR_ = np.zeros((n, 3), np.float32); NR_[kk] = nn
        AO_ = np.ones(n, np.float32); AO_[kk] = aov * (.4 + .6 * shv)
        FT_ = np.zeros(n, np.float32); FT_[kk] = ft
        fins = layer > 0
        if fins.any():
            cf = Lt.shade_metal(nn[fins], tint[fins], shv[fins], aov[fins], wrv[fins], fin=True)
            # thin toward their free edge, the fins let the patina show through a little
            rho = G.tex_sample(F.Fr, th[kk[fins]], sc_[fins], order=0)
            th_, s_ = th[kk[fins]], sc_[fins]
            gb = Lt.shade_patina(Lt.normals(F, th_, s_, relief=False), G.h_of_s(s_), shv[fins], np.ones(len(s_)))
            kf = (.5 * G.sm((rho - .35) / .65))[:, None]
            col[kk[fins]] = cf * (1 - kf) + gb * kf
        if Lt.MEAS is not None:
            col[kk] = Lt.meas_metal(nn, aov * (.4 + .6 * shv), ci, layer, ft, [c.head == 'black' for c in C.SCHOOL])
    # --- the lid region (photo view only): the rim ring and the dark inside, plain
    log('shade %.1fs' % (time.time() - t0))
    R = dict(w=w, h=h, x0=x0, y0=y0, sc=sc, part=part.reshape(h, w), ground=ground.reshape(h, w, 3).astype(np.float32),
             shf=shf.reshape(h, w), col=col.reshape(h, w, 3).astype(np.float32), hit0=(hit0 & ~lid0).reshape(h, w),
             th=th.reshape(h, w), s=s.reshape(h, w), e=e.reshape(h, w), lid0=lid0.reshape(h, w),
             N0=N0.reshape(h, w, 3), H0=H0.reshape(h, w))
    if len(kk):
        R.update(NR=NR_.reshape(h, w, 3), AO=AO_.reshape(h, w), FT=FT_.reshape(h, w))
    return R, F


def preview(R):
    """the computed field as an image (the target of the vector writer)"""
    img = np.zeros((R['h'], R['w'], 3), np.float32); img[:] = 236
    g = R['hit0']
    img[g] = R['ground'][g] * R['shf'][g][:, None]
    p = R['part'] > 0
    img[p] = R['col'][p]
    img[R['lid0'] & ~p] = (40, 22, 12)
    return np.clip(img, 0, 255).astype(np.uint8)
