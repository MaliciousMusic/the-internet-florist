"""paire_de.py: the pairs photo | render of the ladybird measured by region (PROTOCOLE §5.2): the elytra's red, the black (spots,
pronotum), the white patches, each in both images, by colour; their median colours (ΔE2000 between photo and render), the red's
contrast (spread of L*, render over photo), its grain (fine detail, render over photo) and the share of glints (mirrored lamp and sky).
The two images are not registered pixel to pixel: regions are compared as wholes, inside the beetle's hull.

  python insectes/coccinelle/outils/paire_de.py [--only nom,nom] [--json out.json]
Reads insectes/coccinelle/paires.json and the renders insectes/coccinelle/planches/paire-<nom>.png (outils/paires.py makes them)."""
import sys, os, json
import numpy as np
import cv2
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'insectes', 'outils'))
from aile import de2000  # noqa: E402


def photo_crop(cfg, p):
    ph = Image.open(os.path.join(ROOT, 'refcache', cfg['sid'], p['photo'])).convert('RGB')
    if p.get('rot'):
        bx = p['box']; ph = ph.rotate(p['rot'], resample=Image.BICUBIC, center=((bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2), fillcolor='#efe9df')
    ph = ph.crop(tuple(p['box']))
    if p.get('flip'): ph = ph.transpose(Image.FLIP_LEFT_RIGHT)
    return np.asarray(ph)


def regions(rgb):
    lab = cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    red = (C > 28) & (h > -25) & (h < 70) & (L > 15)
    red = cv2.morphologyEx(red.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    n, lb, st, _ = cv2.connectedComponentsWithStats(red.astype(np.uint8))
    if n > 1: red = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    ys, xs = np.nonzero(red)
    hull = np.zeros(red.shape, np.uint8); cv2.fillPoly(hull, [cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32))], 1)
    inside = hull > 0
    black = inside & (L < 22) & (C < 18)
    glint = inside & (L > 80) & (C < 25)
    return lab, red, black, glint, inside


def stats(rgb):
    lab, red, black, glint, inside = regions(rgb)
    L = lab[..., 0]
    s = max(1.0, np.sqrt(red.sum()) / 120)                     # the grain judged at the same fraction of the elytra's size
    hp = L - cv2.GaussianBlur(L, (0, 0), 1.5 * s)
    redc = red & ~glint
    return {'rouge': np.median(lab[redc], 0), 'noir': np.median(lab[black], 0) if black.sum() > 30 else None,
            'L10': np.percentile(L[redc], 10), 'L90': np.percentile(L[redc], 90), 'grain': np.std(hp[redc]),
            'reflets': glint.sum() / max(1, inside.sum()), 'sombre_bord': np.percentile(L[red], 5)}


def main():
    a = sys.argv[1:]
    only = a[a.index('--only') + 1].split(',') if '--only' in a else None
    cfg = json.load(open(os.path.join(ROOT, 'insectes', 'coccinelle', 'paires.json'), encoding='utf-8'))
    out = {}
    print('%-16s %6s %6s %18s %18s %6s %6s %7s %7s' % ('paire', 'ΔE', 'ΔL', 'rouge photo', 'rouge rendu', 'contr', 'grain', 'reflets', 'noir ΔL'))
    for p in cfg['pairs']:
        if only and p['nom'] not in only: continue
        rp = os.path.join(ROOT, 'insectes', 'coccinelle', 'planches', 'paire-%s.png' % p['nom'])
        if not os.path.exists(rp): continue
        P = stats(photo_crop(cfg, p)); R = stats(np.asarray(Image.open(rp).convert('RGB')))
        de = float(de2000(P['rouge'][None], R['rouge'][None])[0])
        con = (R['L90'] - R['L10']) / max(1, P['L90'] - P['L10']); gr = R['grain'] / max(0.05, P['grain'])
        dn = (R['noir'][0] - P['noir'][0]) if P['noir'] is not None and R['noir'] is not None else float('nan')
        f = lambda v: '%5.1f %5.1f %5.1f' % tuple(v)
        print('%-16s %6.1f %6.1f %18s %18s %6.2f %6.2f %3.0f/%-3.0f %7.1f' % (p['nom'], de, R['rouge'][0] - P['rouge'][0], f(P['rouge']), f(R['rouge']), con, gr,
                                                                       1000 * P['reflets'], 1000 * R['reflets'], dn))
        out[p['nom']] = {'dE': round(de, 1), 'contraste': round(con, 2), 'grain': round(gr, 2), 'rouge_photo': [round(float(x), 1) for x in P['rouge']],
                         'rouge_rendu': [round(float(x), 1) for x in R['rouge']], 'reflets_photo': round(float(P['reflets']), 4), 'reflets_rendu': round(float(R['reflets']), 4),
                         'noir_dL': None if dn != dn else round(float(dn), 1)}
    if '--json' in a: json.dump(out, open(a[a.index('--json') + 1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
