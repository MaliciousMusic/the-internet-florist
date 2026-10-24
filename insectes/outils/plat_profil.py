"""plat_profil.py: a body piece seen side on, laid flat along its axis and read as a grid (PROTOCOLE §3.1), for pieces whose flank
carries the pattern (a bush-cricket's pronotum, head, abdomen and hind femur): unlike plat_corps.py, nothing is folded, the columns run
from the lower edge of the piece (belly side) to its upper edge (back), and the piece is cut out by a polygon traced by hand
(insectes/<id>/ailes/masques.json, or any json {"<name>": {"poly": [[x, y]...], "hors": [[poly]...]}}), not against a plate.

  python insectes/outils/plat_profil.py <photo> "<x,y;x,y;...>" <masques.json> <name> <out.json> [--nv 72] [--nu 18] [--w 400]
The frame runs along the piece's axis from its front to its rear (x,y points, px); at each of nv stations the band inside the mask,
across the axis, is cut into nu cells from the lower edge to the upper one; per cell the median Lab of its pixels, outside the
polygons "hors" (a leg over the piece). Writes the grid (numbers only: rows front to rear, columns lower edge to upper edge, the
band's lower and upper offsets in px) and <name>-controle.jpg in refcache/<sid>/corps/."""
import sys, os, json, argparse
import numpy as np
import cv2


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('photo'); ap.add_argument('axe'); ap.add_argument('masques'); ap.add_argument('nom'); ap.add_argument('out')
    ap.add_argument('--nv', type=int, default=72); ap.add_argument('--nu', type=int, default=18); ap.add_argument('--w', type=float, default=400); ap.add_argument('--sansreflet', action='store_true')
    o = ap.parse_args()
    M = json.load(open(o.masques, encoding='utf-8'))[o.nom]
    rgb = cv2.imread(o.photo)[..., ::-1].copy(); H, W = rgb.shape[:2]
    lab = cv2.cvtColor(cv2.GaussianBlur(rgb, (0, 0), 0.8).astype(np.float32) / 255, cv2.COLOR_RGB2LAB)
    m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [np.array(M['poly'], np.int32)], 1)
    hors = np.zeros((H, W), np.uint8)
    for P in M.get('hors', []): cv2.fillPoly(hors, [np.array(P, np.int32)], 1)
    pts = np.array([list(map(float, a.split(','))) for a in o.axe.split(';')])
    t = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]); L = t[-1]; t /= L
    n = 360; v = np.linspace(0, 1, n); P = np.stack([np.interp(v, t, pts[:, 0]), np.interp(v, t, pts[:, 1])], 1)
    D = np.gradient(P, axis=0); D /= np.linalg.norm(D, axis=1, keepdims=True)
    N = np.stack([D[:, 1], -D[:, 0]], 1)
    N[N[:, 1] > 0] *= -1                               # the normal points up the image (toward the back)
    off = np.arange(-o.w, o.w + 1)
    X = (P[:, None, 0] + N[:, None, 0] * off[None]).astype(np.float32); Y = (P[:, None, 1] + N[:, None, 1] * off[None]).astype(np.float32)
    S = cv2.remap(lab, X, Y, cv2.INTER_LINEAR)
    inside = cv2.remap(m, X, Y, cv2.INTER_NEAREST) > 0
    keep = inside & ~(cv2.remap(hors, X, Y, cv2.INTER_NEAREST) > 0)
    if o.sansreflet:
        # the albedo, not the lamp: the whitish highlights (chroma well under the piece's, lightness well over) are left out
        Cs = np.hypot(S[..., 1], S[..., 2]); cm, lm = np.median(Cs[keep]), np.median(S[..., 0][keep])
        keep &= ~((Cs < 0.7 * cm) & (S[..., 0] > lm + 6))
    lo = np.full(n, np.nan); hi = np.full(n, np.nan)
    for i in range(n):
        k = np.nonzero(inside[i])[0]
        if len(k): lo[i], hi[i] = off[k[0]], off[k[-1]]
    G, B = [], []
    for gi in range(o.nv):
        rows = range(int(gi * n / o.nv), int((gi + 1) * n / o.nv))
        line = []
        for gj in range(o.nu):
            vals = []
            for i in rows:
                if np.isnan(lo[i]): continue
                a0 = lo[i] + (hi[i] - lo[i]) * gj / o.nu; a1 = lo[i] + (hi[i] - lo[i]) * (gj + 1) / o.nu
                sel = (off >= a0) & (off < a1 + 1e-6) & keep[i]
                vals.append(S[i][sel])
            vv = np.concatenate(vals) if vals else np.zeros((0, 3))
            line.append(hexof(np.median(vv, 0)) if len(vv) >= 3 else None)
        G.append(line)
        r0 = [i for i in rows if not np.isnan(lo[i])]
        B.append([round(float(np.mean(lo[r0])), 1), round(float(np.mean(hi[r0])), 1)] if r0 else None)
    # holes (under a leg): from the same column in the nearest rows, then from the row's neighbours
    for gj in range(o.nu):
        col = [G[i][gj] for i in range(o.nv)]
        for i in range(o.nv):
            if col[i] is None:
                near = [(abs(i - k), col[k]) for k in range(o.nv) if col[k] is not None]
                if near: G[i][gj] = min(near)[1]
    for i in range(o.nv):
        for gj in range(o.nu):
            if G[i][gj] is None: G[i][gj] = next((G[i][k] for k in sorted(range(o.nu), key=lambda k: abs(k - gj)) if G[i][k]), '#808080')
    rec = {'_doc': 'plat_profil.py: grille mesurée sur %s, rangs de l\'avant vers l\'arrière, colonnes du bord inférieur au bord supérieur. '
                   'Des chiffres, jamais l\'image.' % os.path.basename(o.photo), 'axe': o.axe, 'longueur_px': round(float(L), 1), 'bande_px': B, 'c': G}
    json.dump(rec, open(o.out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    strip = cv2.cvtColor(S, cv2.COLOR_LAB2RGB); strip[~keep] = 0.94
    gimg = np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in row[::-1]] for row in G], np.float32)
    gimg = cv2.resize(np.transpose(gimg, (1, 0, 2)), (n, 2 * int(o.w) + 1), interpolation=cv2.INTER_NEAREST)
    ctl = (np.clip(np.concatenate([np.transpose(strip, (1, 0, 2))[::-1], np.full((6, n, 3), 0.94, np.float32), gimg], 0), 0, 1) * 255).astype(np.uint8)
    cdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(o.photo))), 'corps'); os.makedirs(cdir, exist_ok=True)
    cv2.imwrite(os.path.join(cdir, o.nom + '-controle.jpg'), ctl[..., ::-1])
    print(o.out, 'longueur %.0f px' % L)


if __name__ == '__main__':
    main()
