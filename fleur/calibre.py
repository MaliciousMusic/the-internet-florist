"""calibre.py: a measured colour grid corrected by the photo | render table of the same piece (fleur/apparence.py paire), region by region
(BONNES-PRATIQUES §15 point 7: the render is lit again by the fine material, so the photo's grid comes out lighter, duller or off in hue
in places; the gap the table measures in each region is taken back out of the grid, then measured again). No model, no browser.

  python fleur/calibre.py <grille.json> <paire.json> [<paire.json> ...] --out <grille.json> [--k .8]

For each of the 12 regions (v: gorge 0-.2, corps .2-.55, haut .55-.85, pointe .85-1; |u|: axe < .25, milieu .25-.7, marge > .7) the gap in
CIELAB between the photo's colour and the render's; the gaps interpolated between the region centres (no step at a region's edge), damped by
--k, added to every cell of the grid. Several tables (several tepals) are averaged. Rerun the render and the table after: two or three rounds.
"""
import sys, json, argparse

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import numpy as np
from skimage import color

VB = {'gorge': (0, .2), 'corps': (.2, .55), 'haut': (.55, .85), 'pointe': (.85, 1)}
UB = {'axe': (0, .25), 'milieu': (.25, .7), 'marge': (.7, 1)}


def lab(h):
    return color.rgb2lab(np.array([[[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]]]) / 255.0)[0, 0]


def hexs(l):
    r = np.clip(color.lab2rgb(np.array([[l]]))[0, 0], 0, 1)
    return '#%02x%02x%02x' % tuple(int(round(x * 255)) for x in r)


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('grille')
    a.add_argument('paires', nargs='+')
    a.add_argument('--out', required=True)
    a.add_argument('--k', type=float, default=.8)
    o = a.parse_args()
    g = json.load(open(o.grille, encoding='utf-8'))
    acc = {}
    for p in o.paires:
        for r in json.load(open(p, encoding='utf-8'))['regions']:
            ph, re_ = [x.strip() for x in r['couleurs'].split('/')]
            acc.setdefault(r['region'], []).append(lab(ph) - lab(re_))
    gap = {k: np.mean(v, 0) for k, v in acc.items()}
    vk, uk = list(VB), list(UB)
    vc = np.array([sum(VB[k]) / 2 for k in vk])
    uc = np.array([sum(UB[k]) / 2 for k in uk])
    G = np.zeros((len(vk), len(uk), 3))
    for i, v in enumerate(vk):
        for j, u in enumerate(uk):
            G[i, j] = gap.get('%s/%s' % (v, u), 0)
    nu, nv = g['nu'], g['nv']
    out = []
    for jv in range(nv):
        v = (jv + .5) / nv
        row = []
        for iu in range(nu):
            u = (iu + .5) / nu
            # bilinear between the region centres (clamped at the ends)
            fi = np.interp(v, vc, np.arange(len(vc)))
            fj = np.interp(u, uc, np.arange(len(uc)))
            i0, j0 = int(np.floor(fi)), int(np.floor(fj))
            i1, j1 = min(i0 + 1, len(vc) - 1), min(j0 + 1, len(uc) - 1)
            ti, tj = fi - i0, fj - j0
            d = (G[i0, j0] * (1 - tj) + G[i0, j1] * tj) * (1 - ti) + (G[i1, j0] * (1 - tj) + G[i1, j1] * tj) * ti
            c = g['c'][jv][iu]
            row.append(hexs(lab(c) + o.k * d) if c else c)
        out.append(row)
    g = dict(g, c=out, calibre=dict(paires=o.paires, k=o.k))
    json.dump(g, open(o.out, 'w', encoding='utf-8'), ensure_ascii=False)
    print('%s : %d régions, écart moyen ΔE76 %.1f retiré à %.0f %%' % (o.out, len(gap), float(np.mean([np.linalg.norm(x) for x in gap.values()])), o.k * 100))


if __name__ == '__main__':
    main()
