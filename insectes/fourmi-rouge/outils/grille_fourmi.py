"""grille_fourmi.py: the colour grid of one piece of the ant (PROTOCOLE §3.1-3.2), for a glossy cuticle: the piece laid flat along
its midline as plat_corps.py does, but its albedo read apart from the photographer's lamps (a lacquered gaster mirrors a ring light
or a window whole: c123, c013). Highlights are cut out (a pixel brighter than its row's 70th centile and paler than its median chroma);
the shading across the piece is taken out (each row's lightness brought to its lit core, |u| < 0.55, the hue and chroma kept per cell,
the falloff toward the rim kept at a third, because the engine shades the form itself); the rows are smoothed along the axis.

  python grille_fourmi.py <photo> "<x,y;...;w>" <out.json> [--masque mask.png] [--ventre #hex] [--nv 72] [--nu 18] [--controle out.jpg]
The frame runs from the FRONT of the piece to its rear (midline points, px), w its half-width at its widest (px). With --masque (forme.py,
SAM) the piece is cut from its ground; without, the photo's ground is read by aile.ground. Writes the engine grid (rows from the rear,
t = 0, to the front; columns from the belly, u = 0, over the flank to the back, u = 1), in numbers only."""
import sys, os, json, argparse, math
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))


def lab_of(rgb):
    return cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('photo'); ap.add_argument('frame'); ap.add_argument('out')
    ap.add_argument('--masque'); ap.add_argument('--ventre'); ap.add_argument('--nv', type=int, default=72); ap.add_argument('--nu', type=int, default=18)
    ap.add_argument('--controle'); ap.add_argument('--falloff', type=float, default=0.33)
    o = ap.parse_args()
    q = o.frame.split(';'); pts = np.array([list(map(float, a.split(','))) for a in q[:-1]]); W = float(q[-1])
    rgb = cv2.imread(o.photo)[..., ::-1].copy(); lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 0.8))
    if o.masque: gm = cv2.imread(o.masque, 0) > 127
    else:
        sys.path.insert(0, os.path.join(HERE, '..', '..', 'outils')); from aile import ground
        gm = ground(rgb, 40)
    t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]); Lm = t[-1]; t /= Lm
    n = 360; v = np.linspace(0, 1, n); P = np.stack([np.interp(v, t, pts[:, 0]), np.interp(v, t, pts[:, 1])], 1)
    D = np.gradient(P, axis=0); D /= np.linalg.norm(D, axis=1, keepdims=True); N = np.stack([-D[:, 1], D[:, 0]], 1)
    ns = 2 * int(W) + 1; off = np.linspace(-W, W, ns)
    X = (P[:, None, 0] + N[:, None, 0] * off[None]).astype(np.float32); Y = (P[:, None, 1] + N[:, None, 1] * off[None]).astype(np.float32)
    S = cv2.remap(lab, X, Y, cv2.INTER_LINEAR)
    ok = cv2.remap(gm.astype(np.float32), X, Y, cv2.INTER_NEAREST) > 0.5
    # the piece's own run at each row (the one holding the midline), its half-width
    half = np.zeros(n); mid = ns // 2
    for i in range(n):
        l = r = mid
        while l > 0 and ok[i, l - 1]: l -= 1
        while r < ns - 1 and ok[i, r + 1]: r += 1
        half[i] = max(3, min(mid - l, r - mid))
    half = np.maximum(cv2.GaussianBlur(half.reshape(-1, 1).astype(np.float32), (1, 0), 5).ravel(), 3)
    uu = np.abs(off)[None, :] / half[:, None]
    inside = ok & (uu < 0.98)
    # highlights: bright and pale against the row
    Lr = S[..., 0]; Cr = np.hypot(S[..., 1], S[..., 2])
    spec = np.zeros_like(inside)
    for i in range(n):
        sel = inside[i]
        if sel.sum() < 5: continue
        l70 = np.percentile(Lr[i][sel], 70); cmed = np.median(Cr[i][sel])
        spec[i] = sel & (Lr[i] > l70) & (Cr[i] < cmed * 0.8)
    keep = inside & ~spec
    G = np.zeros((o.nv, o.nu, 3)); core = np.zeros((o.nv, 3))
    for gi in range(o.nv):
        rows = slice(int(gi * n / o.nv), int((gi + 1) * n / o.nv))
        K, Uu, Sv = keep[rows], uu[rows], S[rows]
        c = Sv[K & (Uu < 0.55)]
        core[gi] = np.median(c, 0) if len(c) > 5 else (np.median(Sv[K], 0) if K.sum() > 5 else np.nan)
        for gj in range(o.nu):
            sel = K & (Uu >= gj / o.nu) & (Uu < (gj + 1) / o.nu)
            G[gi, gj] = np.median(Sv[sel], 0) if sel.sum() >= 3 else np.nan
    # fill gaps from the row's core, smooth the core along the axis
    for k in range(3):
        c = core[:, k]; m = np.isnan(c)
        if m.any(): c[m] = np.interp(np.nonzero(m)[0], np.nonzero(~m)[0], c[~m])
        core[:, k] = cv2.GaussianBlur(c.reshape(-1, 1).astype(np.float32), (1, 0), 1.5).ravel()
    for gi in range(o.nv):
        for gj in range(o.nu):
            if np.isnan(G[gi, gj]).any(): G[gi, gj] = core[gi]
        # lightness: the row's core, with a third of the falloff toward the rim
        G[gi, :, 0] = core[gi, 0] + o.falloff * (G[gi, :, 0] - core[gi, 0])
    # dorsal |u| (front to rear) -> engine rows (rear to front), columns belly -> back: |u| = cos th over the back
    E = G[::-1]
    NU = 18; out = np.zeros((o.nv, NU, 3))
    vent = lab_of(np.array([[[int(o.ventre[i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8))[0, 0] if o.ventre else None
    for j in range(NU):
        th = -math.pi / 2 + math.pi * (j + 0.5) / NU
        x = math.cos(abs(th)) * (o.nu - 1); i0 = int(x); i1 = min(o.nu - 1, i0 + 1); f = x - i0
        val = E[:, i0] * (1 - f) + E[:, i1] * f
        if th < 0:
            w = min(1, -th / (math.pi / 2))
            val = val * (1 - w) + vent * w if vent is not None else val * [1 - 0.25 * w, 1, 1]
        out[:, j] = val
    rows = [[hexof(out[r, c]) for c in range(NU)] for r in range(o.nv)]
    json.dump({'_doc': 'grille_fourmi.py sur %s : albédo lu hors des reflets, rangs de l\'arrière (t = 0) vers l\'avant, colonnes du ventre au dos. '
                       'Des chiffres, jamais l\'image.' % os.path.basename(o.photo), 'cadre': o.frame, 'longueur_px': round(float(Lm), 1),
               'coeur': [hexof(c) for c in core[::-1]], 'rows': rows}, open(o.out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    if o.controle:
        strip = cv2.cvtColor(S, cv2.COLOR_LAB2RGB); strip[~inside] = 0.94; s2 = strip.copy(); s2[spec] = (0, 1, 1)
        gimg = cv2.cvtColor(G.astype(np.float32), cv2.COLOR_LAB2RGB); gimg = np.concatenate([gimg[:, ::-1], gimg], 1)
        gimg = cv2.resize(gimg, (ns, n), interpolation=cv2.INTER_NEAREST)
        pad = np.full((n, 6, 3), 0.94, np.float32)
        ctl = (np.clip(np.concatenate([strip, pad, s2, pad, gimg], 1), 0, 1) * 255).astype(np.uint8)
        cv2.imwrite(o.controle, ctl[..., ::-1])
    print(o.out, 'coeur avant %s milieu %s arrière %s' % (hexof(core[2]), hexof(core[o.nv // 2]), hexof(core[-3])))


if __name__ == '__main__':
    main()
