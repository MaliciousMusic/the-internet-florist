"""loi_modele.py: the angle law of the structural green, photo against render, through the model's normals (loi_modele.mjs).

  python insectes/cetoine/outils/loi_modele.py <samples.json> [--ecrire mesures/loi-angle.json] [--k 0.7]

Per point the photo's colour (median over 5 x 5 px of a light blur, the white flecks left out) and the render's; both in Lab, binned
by n.v (the cosine of the angle to the eye) in steps of 0.1. Prints the photo's law (L*, C*, hue per bin) and its gap to the
render's (ΔE2000). --ecrire adds the damped gap (--k) to the ramp's stops (one per bin) in the law file read by cetoine.mjs, and
keeps the photo's law there under its name (numbers only)."""
import sys, os, json
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'insectes', 'outils'))
from aile import de2000  # noqa: E402

a = sys.argv[1:]
D = json.load(open(a[0], encoding='utf-8'))
img = cv2.imread(os.path.join(ROOT, 'refcache', 'cetonia-aurata', 'hd', D['photo'] + '.jpg'))
blur = cv2.GaussianBlur(img, (0, 0), 1.0)
lab = cv2.cvtColor(blur.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
H, W = img.shape[:2]
tolab = lambda rgb: cv2.cvtColor(np.array([[rgb]], np.float32) / 255, cv2.COLOR_RGB2LAB)[0, 0]
P, R, NV = [], [], []
for s in D['samples']:
    x, y = int(round(s['ph'][0])), int(round(s['ph'][1]))
    if x < 3 or y < 3 or x >= W - 3 or y >= H - 3: continue
    w = lab[y - 4:y + 5, x - 4:x + 5].reshape(-1, 3)
    if ((w[:, 0] > 88) & (np.hypot(w[:, 1], w[:, 2]) < 8)).any(): continue      # the ground around the beetle: the outline's band
    w = lab[y - 2:y + 3, x - 2:x + 3].reshape(-1, 3)
    w = w[~((w[:, 0] > 62) & (np.hypot(w[:, 1], w[:, 2]) < 30))]
    if len(w) < 10: continue
    P.append(np.median(w, 0)); R.append(tolab(s['r'])); NV.append(s['nv'])
P, R, NV = np.array(P), np.array(R), np.array(NV)
bins = np.arange(0, 1.0001, 0.1)
hue = lambda v: (np.degrees(np.arctan2(v[2], v[1])) + 360) % 360
law, gaps = [], []
print('n.v        photo L    C    h  |  rendu L    C    h  |  dE')
for i in range(10):
    sel = (NV >= bins[i]) & (NV < bins[i + 1] + (1e-6 if i == 9 else 0))
    if sel.sum() < 30: continue
    p, r = np.median(P[sel], 0), np.median(R[sel], 0)
    # the lit colour: the pixels near the 85th centile of L* (the reflections that give the hue its strength)
    def lit(V):
        q = np.percentile(V[:, 0], 85); w = V[np.abs(V[:, 0] - q) < 4]
        return np.median(w, 0) if len(w) > 5 else np.median(V, 0)
    pl, rl = lit(P[sel]), lit(R[sel])
    de = de2000(p, r)
    print('%.2f-%.2f  %6.1f %5.1f %4.0f | %6.1f %5.1f %4.0f | %5.1f  (%d)   éclairé photo %4.1f %4.1f %4.0f  rendu %4.1f %4.1f %4.0f' % (bins[i], bins[i + 1], p[0], np.hypot(p[1], p[2]), hue(p), r[0], np.hypot(r[1], r[2]), hue(r), de, sel.sum(),
          pl[0], np.hypot(pl[1], pl[2]), hue(pl), rl[0], np.hypot(rl[1], rl[2]), hue(rl)))
    law.append({'nv': round(float((bins[i] + bins[i + 1]) / 2), 2), 'lab': [round(float(v), 1) for v in p], 'rendu': [round(float(v), 1) for v in r],
                'dE': round(float(de), 1), 'n': int(sel.sum()), 'eclaire': [round(float(v), 1) for v in pl], 'eclaire_rendu': [round(float(v), 1) for v in rl]})
    gaps.append(de)
print('ΔE médian %.1f, max %.1f' % (np.median(gaps), np.max(gaps)))
if '--direct' in a:
    # a studio photo in a white tent: the light comes from every side at about the ground's level, so the colour seen at an angle is the
    # cuticle's reflectance at that angle (the ground's white = 1): the law itself is the ramp
    path = a[a.index('--direct') + 1]
    def lab2hex(v):
        rgb = cv2.cvtColor(np.array([[v]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
        return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)
    L = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    L.setdefault('photos', {})[D['photo']] = law
    print(D['photo'], 'rampe directe :', [[b['nv'], lab2hex(b['lab'])] for b in law])
    json.dump(L, open(path, 'w', encoding='utf-8', newline=chr(10)), ensure_ascii=False, indent=1)
if '--ecrire' in a:
    path = a[a.index('--ecrire') + 1]; kk = float(a[a.index('--k') + 1]) if '--k' in a else 0.7
    L = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    hex2lab = lambda h: tolab([int(h[i:i + 2], 16) for i in (1, 3, 5)])
    def lab2hex(v):
        rgb = cv2.cvtColor(np.array([[v]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
        return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)
    stops = {round(v, 2): hex2lab(h) for v, h in L['ramp']}
    for b in law:
        nv = b['nv']
        if nv not in stops:
            ks = sorted(stops); lo = max([x for x in ks if x <= nv], default=ks[0]); hi = min([x for x in ks if x >= nv], default=ks[-1])
            f = 0 if hi == lo else (nv - lo) / (hi - lo); stops[nv] = stops[lo] * (1 - f) + stops[hi] * f
        v = stops[nv] + kk * (np.array(b['lab']) - np.array(b['rendu'])); v[0] = np.clip(v[0], 2, 95); stops[nv] = v
    ks = sorted(v for v in stops if 0 < v < 1); stops[0] = stops[ks[0]]; stops[1] = stops[ks[-1]]   # the ends follow the outer bins
    L['ramp'] = [[v, lab2hex(stops[v])] for v in sorted(stops)]
    L.setdefault('photos', {})[D['photo']] = law
    L['_doc'] = ("loi d'angle du vert structural : couleur réfléchie par n.v (cosinus de l'angle à l'oeil), étalonnée sur les photos "
                 "par loi_modele.py (rampe), et les lois mesurées par photo. Des chiffres, jamais l'image.")
    json.dump(L, open(path, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    print('écrit', path, L['ramp'])
