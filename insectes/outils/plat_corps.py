"""plat_corps.py: a body piece of an insect laid flat along its axis and read as a grid (PROTOCOLE §3.1), for striped bodies where
the flower tool's colour gate keeps only the axis colour (the swallowtail's abdomen: a black back between yellow flanks).

  python insectes/outils/plat_corps.py <photo> "<x,y;x,y;...;w>" <grille.json> [--exclure "#hex:dE,..."] [--nv 72] [--nu 18] [--masque m.png]

The frame runs from the front of the piece to its rear (x,y points on its midline, px), w its half-width (px) at the widest, the
width following the piece's own outline row by row: at each row, the band where the pixels stand off the plate's neutral ground
(chroma or lightness). Rows nv from front to rear, columns nu bands of |u| from the midline (0) to the edge seen (1), both sides
folded (bilateral symmetry); per cell the median Lab of the pixels kept (a colour over --exclure dE of the given ones: a leg
crossing). Writes the grid (numbers only) and <grille>-controle.jpg in refcache next to the photo's folder."""
import sys, os, json, argparse
import numpy as np
import cv2


def lab_of(rgb):
    return cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('photo'); ap.add_argument('frame'); ap.add_argument('out')
    ap.add_argument('--exclure', default=''); ap.add_argument('--nv', type=int, default=72); ap.add_argument('--nu', type=int, default=18)
    ap.add_argument('--fond', default='')               # degrade: a plate whose ground is a coloured gradient (aile.py ground_tinted)
    # --masque <png>: the piece's own mask (white inside), for a body on a ground that is not a plate, or beside wings and legs
    ap.add_argument('--masque', default='')
    o = ap.parse_args()
    q = o.frame.split(';'); pts = np.array([list(map(float, a.split(','))) for a in q[:-1]]); W = float(q[-1])
    rgb = cv2.imread(o.photo)[..., ::-1].copy(); lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 1.0))
    C = np.hypot(lab[..., 1], lab[..., 2])
    # the midline, resampled
    t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]); Lm = t[-1]; t /= Lm
    n = 400; v = np.linspace(0, 1, n); P = np.stack([np.interp(v, t, pts[:, 0]), np.interp(v, t, pts[:, 1])], 1)
    D = np.gradient(P, axis=0); D /= np.linalg.norm(D, axis=1, keepdims=True); N = np.stack([-D[:, 1], D[:, 0]], 1)
    ex = []
    for e in [x for x in o.exclure.split(',') if x]:
        h, d = e.split(':'); ex.append((lab_of(np.array([[[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]]], np.uint8))[0, 0], float(d)))
    # sample each row across: offsets -W..W
    nu_s = 2 * int(W) + 1; off = np.linspace(-W, W, nu_s)
    X = P[:, None, 0] + N[:, None, 0] * off[None]; Y = P[:, None, 1] + N[:, None, 1] * off[None]
    S = cv2.remap(lab, X.astype(np.float32), Y.astype(np.float32), cv2.INTER_LINEAR)
    Cs = cv2.remap(C, X.astype(np.float32), Y.astype(np.float32), cv2.INTER_LINEAR)
    # the piece's edge at each row: the specimen against the plate's smooth neutral ground (aile.py ground: chroma, and the
    # lightness off a smooth fit of the ground: a black body is as dark as the plate, but not as smooth)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from aile import ground, ground_tinted
    gm = (cv2.imread(o.masque, 0) > 127).astype(np.float32) if o.masque else (ground_tinted(rgb) if o.fond == 'degrade' else ground(rgb, 40)).astype(np.float32)
    ok = cv2.remap(gm, X.astype(np.float32), Y.astype(np.float32), cv2.INTER_NEAREST) > 0.5
    for c, d in ex: ok &= np.linalg.norm(S - c, axis=2) > d
    half = np.zeros(n)
    for i in range(n):
        row = ok[i]; mid = nu_s // 2
        l = mid
        while l > 0 and ok[i, l - 1] | (not ok[i, l - 1] and l - 2 >= 0 and ok[i, l - 2]): l -= 1
        r = mid
        while r < nu_s - 1 and (ok[i, r + 1] or (r + 2 < nu_s and ok[i, r + 2])): r += 1
        half[i] = max(mid - l, r - mid)
    half = np.maximum(cv2.GaussianBlur(half.reshape(-1, 1).astype(np.float32), (1, 0), 6).ravel(), 3)
    G = []
    for gi in range(o.nv):
        rows = range(int(gi * n / o.nv), int((gi + 1) * n / o.nv))
        line = []
        for gj in range(o.nu):
            u0, u1 = gj / o.nu, (gj + 1) / o.nu; vals = []
            for i in rows:
                uu = np.abs(off) / half[i]
                sel = (uu >= u0) & (uu < u1) & ok[i]
                vals.append(S[i][sel])
            vv = np.concatenate(vals) if vals else np.zeros((0, 3))
            line.append(hexof(np.median(vv, 0)) if len(vv) >= 3 else None)
        # fill the gaps of the row from its neighbours
        for gj in range(o.nu):
            if line[gj] is None:
                k = min((abs(gj - j), j) for j in range(o.nu) if line[j] is not None)[1] if any(line) else None
                line[gj] = line[k] if k is not None else '#808080'
        G.append(line)
    rec = {'_doc': 'plat_corps.py: grille mesurée sur %s, rangs de l\'avant vers l\'arrière, colonnes |u| du milieu au bord vu. '
                   'Des chiffres, jamais l\'image.' % os.path.basename(o.photo), 'cadre': o.frame, 'longueur_px': round(float(Lm), 1),
           'demi_largeur_px': [round(float(h), 1) for h in half[::10]], 'c': G}
    json.dump(rec, open(o.out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    # control: the strip as sampled | the grid
    strip = cv2.cvtColor(S, cv2.COLOR_LAB2RGB); strip[~ok] = 0.94
    gimg = np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row] for row in G], np.float32)
    gimg = np.concatenate([gimg[:, ::-1], gimg], 1)
    gimg = cv2.resize(gimg, (strip.shape[1], strip.shape[0]), interpolation=cv2.INTER_NEAREST)
    ctl = (np.clip(np.concatenate([strip, np.full((n, 6, 3), 0.94, np.float32), gimg], 1), 0, 1) * 255).astype(np.uint8)
    cdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(o.photo))), 'corps'); os.makedirs(cdir, exist_ok=True)
    cv2.imwrite(os.path.join(cdir, os.path.basename(o.out).replace('.json', '-controle.jpg')), ctl[..., ::-1])
    print(o.out, 'longueur %.0f px, demi-largeur max %.0f px' % (Lm, half.max()))


if __name__ == '__main__':
    main()
