"""grille_fourmi.py: a body piece of the ant laid flat along its axis and read as a grid of 72 x 18 (PROTOCOLE §3.1), its outline taken
from the mask of its shape map (carte_fourmi.py: SAM, or the threshold on a light ground), not from a neutral plate as plat_corps.py
does (a dark ant on an overexposed white sheet has no plate around it).

  python insectes/fourmi-noire/outils/grille_fourmi.py <photo> <carte dir> "<x,y;x,y;...;w>" <grille.json> [--exclure "#hex:dE,..."]
         [--nv 72] [--nu 18] [--bord 0.9]

The frame runs from the front of the piece to its rear (x,y on its midline, photo pixels), w the half-width searched (px). Row by row
the piece's edge is where the mask ends; --bord keeps the cells inside that fraction of the half-width (the outermost pixels mix the
ground in). Same output as plat_corps.py (rows front to rear, columns |u| from the midline to the edge), read by grille_corps.py.
Writes the numbers and refcache/<sid>/corps/<grille>-controle.jpg."""
import sys, os, json, argparse
import numpy as np
import cv2


def lab_of(rgb):
    return cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('photo'); ap.add_argument('carte'); ap.add_argument('frame'); ap.add_argument('out')
    ap.add_argument('--exclure', default=''); ap.add_argument('--nv', type=int, default=72); ap.add_argument('--nu', type=int, default=18)
    ap.add_argument('--bord', type=float, default=0.92)
    # --plat s: the photo's own light taken off (albedo, PROTOCOLE §3.1): L* minus its blur over s cells, plus its mean; the hue,
    # the chroma and the fine pattern (the pale hind margins of the tergites) stay. --niveau L: the mean L* set to a measured level
    ap.add_argument('--pct', type=float, default=50)  # the cell's colour at this centile of L* (under 50: glints and pale hairs left out)
    ap.add_argument('--ab', default='')  # 'a,b': the mean a* b* set to these (the daylight hue), the deviations kept (times --chroma)
    ap.add_argument('--chroma', type=float, default=1)  # a and b multiplied (the warm cast of a studio light taken off)
    ap.add_argument('--lisse', type=float, default=0)  # a blur of s cells over the grid (a piece without a pattern: legs crossing, noise)
    ap.add_argument('--plat', type=float, default=0); ap.add_argument('--niveau', type=float, default=0)
    o = ap.parse_args()
    q = o.frame.split(';'); pts = np.array([list(map(float, a.split(','))) for a in q[:-1]]); W = float(q[-1])
    rgb = cv2.imread(o.photo)[..., ::-1].copy(); lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 1.0))
    cj = json.load(open(os.path.join(o.carte, 'carte.json'), encoding='utf-8'))
    m = cv2.imread(os.path.join(o.carte, 'mask.png'), 0) > 127
    full = np.zeros(rgb.shape[:2], bool)
    x0, y0 = cj.get('decalage', [0, 0])
    full[y0:y0 + m.shape[0], x0:x0 + m.shape[1]] = m
    t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]); Lm = t[-1]; t /= Lm
    n = 400; v = np.linspace(0, 1, n); P = np.stack([np.interp(v, t, pts[:, 0]), np.interp(v, t, pts[:, 1])], 1)
    D = np.gradient(P, axis=0); D /= np.linalg.norm(D, axis=1, keepdims=True); N = np.stack([-D[:, 1], D[:, 0]], 1)
    nu_s = 2 * int(W) + 1; off = np.linspace(-W, W, nu_s)
    X = (P[:, None, 0] + N[:, None, 0] * off[None]).astype(np.float32); Y = (P[:, None, 1] + N[:, None, 1] * off[None]).astype(np.float32)
    S = cv2.remap(lab, X, Y, cv2.INTER_LINEAR)
    ok = cv2.remap(full.astype(np.uint8), X, Y, cv2.INTER_NEAREST) > 0
    for e in [x for x in o.exclure.split(',') if x]:
        h, d = e.split(':'); c = lab_of(np.array([[[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]]], np.uint8))[0, 0]
        ok &= np.linalg.norm(S - c, axis=2) > float(d)
    mid = nu_s // 2; half = np.zeros(n)
    for i in range(n):
        l = mid
        while l > 0 and ok[i, l - 1]: l -= 1
        r = mid
        while r < nu_s - 1 and ok[i, r + 1]: r += 1
        half[i] = max(3, (r - l) / 2)
    half = np.maximum(cv2.GaussianBlur(half.reshape(-1, 1).astype(np.float32), (1, 0), 5).ravel(), 3)
    G = []
    for gi in range(o.nv):
        rows = range(int(gi * n / o.nv), int((gi + 1) * n / o.nv)); line = []
        for gj in range(o.nu):
            u0, u1 = o.bord * gj / o.nu, o.bord * (gj + 1) / o.nu; vals = []
            for i in rows:
                uu = np.abs(off) / half[i]; sel = (uu >= u0) & (uu < u1) & ok[i]; vals.append(S[i][sel])
            vv = np.concatenate(vals) if vals else np.zeros((0, 3))
            if len(vv) >= 3:
                lv = np.percentile(vv[:, 0], o.pct); near = vv[np.abs(vv[:, 0] - lv) <= max(2.0, vv[:, 0].std() * 0.25)]
                line.append(hexof(np.median(near if len(near) >= 3 else vv, 0)))
            else: line.append(None)
        for gj in range(o.nu):
            if line[gj] is None:
                kk = [j for j in range(o.nu) if line[j] is not None]
                line[gj] = line[min(kk, key=lambda j: abs(j - gj))] if kk else '#808080'
        G.append(line)
    if o.plat or o.niveau or o.lisse or o.chroma != 1 or o.ab:
        A = np.array([[lab_of(np.array([[[int(h[i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8))[0, 0] for h in row] for row in G], np.float32)
        Lc = A[..., 0].copy()
        if o.plat:
            wide = np.concatenate([Lc[:, ::-1], Lc], 1)
            lo = cv2.GaussianBlur(wide, (0, 0), o.plat)[:, o.nu:]
            Lc = Lc - lo + Lc.mean()
        if o.niveau: Lc = Lc - Lc.mean() + o.niveau
        A[..., 0] = np.clip(Lc, 1, 99)
        if o.ab:
            ta = np.array([float(v) for v in o.ab.split(',')], np.float32); m = A[..., 1:].reshape(-1, 2).mean(0)
            A[..., 1:] = (A[..., 1:] - m) * o.chroma + ta
        else: A[..., 1:] *= o.chroma
        if o.lisse:
            W2 = np.concatenate([A[:, ::-1], A], 1)
            A = np.stack([cv2.GaussianBlur(W2[..., c], (0, 0), o.lisse) for c in range(3)], -1)[:, o.nu:]
        G = [[hexof(A[i, j]) for j in range(o.nu)] for i in range(o.nv)]
    rec = {'_doc': 'grille_fourmi.py : grille mesurée sur %s (masque %s), rangs de l\'avant vers l\'arrière, colonnes |u| du milieu au bord vu '
                   '(%.0f %% de la demi-largeur). Des chiffres, jamais l\'image.' % (os.path.basename(o.photo), os.path.basename(os.path.normpath(o.carte)), o.bord * 100),
           'cadre': o.frame, 'plat': o.plat, 'niveau': o.niveau, 'chroma': o.chroma, 'lisse': o.lisse, 'ab': o.ab, 'longueur_px': round(float(Lm), 1), 'demi_largeur_px': [round(float(h), 1) for h in half[::10]], 'c': G}
    json.dump(rec, open(o.out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    strip = cv2.cvtColor(S, cv2.COLOR_LAB2RGB); strip[~ok] = 0.94
    gimg = np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row] for row in G], np.float32)
    gimg = cv2.resize(np.concatenate([gimg[:, ::-1], gimg], 1), (strip.shape[1], strip.shape[0]), interpolation=cv2.INTER_NEAREST)
    ctl = (np.clip(np.concatenate([strip, np.full((n, 6, 3), 0.94, np.float32), gimg], 1), 0, 1) * 255).astype(np.uint8)
    cdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(o.photo))), 'corps'); os.makedirs(cdir, exist_ok=True)
    cv2.imwrite(os.path.join(cdir, os.path.basename(o.out).replace('.json', '-controle.jpg')), ctl[..., ::-1])
    print(o.out, 'longueur %.0f px, demi-largeur max %.0f px' % (Lm, half.max()))


if __name__ == '__main__':
    main()
