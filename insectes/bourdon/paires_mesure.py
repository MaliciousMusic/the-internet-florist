"""paires_mesure.py: the numbers of each photo | render pair of the bumblebee (PROTOCOLE §5.2), after outils/paires.py has rendered
them: the insect of the photo (its SAM mask from the shape map, outils/forme.py) and of the render (its flat ground) each cut into
3 x 3 regions of its own box (rear to front, top to bottom); per region the median colour (ΔE2000), the contrast (std of L*, render over
photo) and the grain (std of L* minus its blur over 1.5 px, render over photo); and over the whole insect.

  python insectes/bourdon/paires_mesure.py            -> refcache/bombus-terrestris/paires-mesures.json, a table on stdout
Targets (PROTOCOLE §5.2): ΔE2000 <= 6, contrast and grain between 0.7 and 1.4."""
import os, sys, json
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(HERE, '..', 'outils'))
from aile import de2000, lab_of  # noqa: E402

cfg = json.load(open(os.path.join(HERE, 'paires.json'), encoding='utf-8'))
ref = os.path.join(ROOT, 'refcache', cfg['sid'])


def photo_mask(p, shape, img_shape):
    f = os.path.join(ref, 'formes', p.get('forme', ''), 'forme.json')
    if not p.get('forme') or not os.path.exists(f): return None
    c = json.load(open(f, encoding='utf-8')).get('crop')
    if not c: return None
    m = cv2.imread(os.path.join(ref, 'formes', p['forme'], 'masque.png'), 0) > 127
    # the map was drawn on the image brought to c['s'] (its crop at x0, y0 there); the pair's box is in the image's own pixels
    H, W = int(round(img_shape[0] * c['s'])), int(round(img_shape[1] * c['s']))
    full = np.zeros((H, W), np.uint8)
    full[c['y0']:c['y0'] + m.shape[0], c['x0']:c['x0'] + m.shape[1]] = m[:H - c['y0'], :W - c['x0']]
    full = cv2.resize(full, (img_shape[1], img_shape[0]), interpolation=cv2.INTER_NEAREST)
    x0, y0, x1, y1 = p['box']
    return cv2.resize(full[y0:y1, x0:x1], (shape[1], shape[0]), interpolation=cv2.INTER_NEAREST) > 0


def regions(m):
    ys, xs = np.nonzero(m); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    out = {}
    for i in range(3):
        for j in range(3):
            r = np.zeros(m.shape, bool)
            r[y0 + (y1 - y0) * j // 3:y0 + (y1 - y0) * (j + 1) // 3, x0 + (x1 - x0) * i // 3:x0 + (x1 - x0) * (i + 1) // 3] = True
            out['%d%d' % (i, j)] = r & m
    out['tout'] = m
    return out


res = {}
for p in cfg['pairs']:
    rp = os.path.join(HERE, 'planches', 'paire-%s.png' % p['nom'])
    if not os.path.exists(rp): continue
    R = cv2.imread(rp)[..., ::-1]
    P0 = cv2.imread(os.path.join(ref, p['photo']))[..., ::-1]
    x0, y0, x1, y1 = p['box']; P = cv2.resize(P0[y0:y1, x0:x1], (R.shape[1], R.shape[0]), interpolation=cv2.INTER_AREA)
    mp = photo_mask(p, R.shape, P0.shape)
    if p.get('flip'):
        P = P[:, ::-1]
        if mp is not None: mp = mp[:, ::-1]
    bg = np.median(np.concatenate([R[:4, :4].reshape(-1, 3), R[:4, -4:].reshape(-1, 3)]), 0)
    mr = np.abs(R.astype(int) - bg).sum(-1) > 24
    if mp is None:
        print(p['nom'], ': pas de masque photo (carte de forme absente)'); continue
    lp, lr = lab_of(P), lab_of(R)
    hp = lp[..., 0] - cv2.GaussianBlur(lp[..., 0], (0, 0), 1.5); hr = lr[..., 0] - cv2.GaussianBlur(lr[..., 0], (0, 0), 1.5)
    RP, RR = regions(mp), regions(mr)
    rows = {}
    for k in RP:
        a, b = RP[k], RR[k]
        if a.sum() < 80 or b.sum() < 80: continue
        mpv, mrv = np.median(lp[a], 0), np.median(lr[b], 0)
        rows[k] = {'dE': round(float(de2000(mpv[None], mrv[None])[0]), 1), 'L': [round(float(mpv[0]), 1), round(float(mrv[0]), 1)],
                   'contraste': round(float(lr[b][:, 0].std() / max(0.5, lp[a][:, 0].std())), 2),
                   'grain': round(float(hr[b].std() / max(0.2, hp[a].std())), 2)}
    res[p['nom']] = rows
    t = rows.get('tout', {})
    ko = [k for k, v in rows.items() if k != 'tout' and (v['dE'] > 6 or not 0.7 <= v['contraste'] <= 1.4 or not 0.7 <= v['grain'] <= 1.4)]
    print('%-8s tout ΔE %4.1f  L* photo %4.1f rendu %4.1f  contraste %.2f  grain %.2f  | régions hors cible : %s' % (
        p['nom'], t.get('dE', -1), t['L'][0], t['L'][1], t.get('contraste', -1), t.get('grain', -1), ', '.join('%s(ΔE %.1f c %.2f g %.2f)' % (k, rows[k]['dE'], rows[k]['contraste'], rows[k]['grain']) for k in ko) or 'aucune'))
json.dump(res, open(os.path.join(ref, 'paires-mesures.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
