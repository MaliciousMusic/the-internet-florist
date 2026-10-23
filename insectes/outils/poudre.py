"""poudre.py: the dust of a measured wing, render against photo (PROTOCOLE §3.3): for each dust group, the mean lightness over its
cells on the flattened photo and on the flat render, and the factor that brings the render's share of grains to the photo's
(the étalonnage of BONNES-PRATIQUES §16.3, damped by k).
  python insectes/outils/poudre.py <record.json> <plat.png> <rendu.png> [--k 0.8] [--ecrire <etalonnage.json> <face>]
Only groups whose two zones differ by 20 L* or more are calibrated (closer zones give no reliable share). --ecrire multiplies the
factors of that face in the calibration file (insectes/<id>/ailes/etalonnage.json, read by the species module).
The zones' own colours are calibrated too: the median Lab of each zone outside its dust, photo against render, the damped
difference added to the zone's colour (key "zones" of the face)."""
import sys, json, numpy as np, cv2
rec = json.load(open(sys.argv[1], encoding='utf-8')); P = cv2.imread(sys.argv[2]); R = cv2.imread(sys.argv[3])
k = float(sys.argv[sys.argv.index('--k') + 1]) if '--k' in sys.argv else 0.8
lab = lambda x: cv2.cvtColor(x.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)[..., 0]
LP, LR = lab(P), lab(R); r = rec['r']
Z = {z['zone']: z['lab'][0] for z in rec['zones']}
out = {}
s0, q1 = rec['origine']
def mask_of(polys):
    m = np.zeros(LP.shape, np.uint8)
    for P in polys:
        t = np.zeros_like(m); cv2.fillPoly(t, [np.array([[(x - s0) * r, (q1 - y) * r] for x, y in P], np.int32)], 1); m ^= t
    return m > 0
for D in rec['poussiere']:
    # the grains' own colour (a granular class has no zone of its own)
    Lb = Z[D['sur']]; h = D['c']; Lg = cv2.cvtColor(np.array([[[int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16)]]], np.uint8).astype(np.float32) / 255, cv2.COLOR_BGR2LAB)[0, 0, 0]
    if abs(Lg - Lb) < 20: continue
    m = np.zeros(LP.shape, bool)
    for L in D['niveaux']:
        if L['densite'] >= 5: m |= mask_of(L['poly'])
    if m.sum() < 50: continue
    lp, lr = LP[m].mean(), LR[m].mean()
    cp, cr = (lp - Lb) / (Lg - Lb), (lr - Lb) / (Lg - Lb)
    f = float(np.clip((max(1e-3, cp) / max(1e-3, cr)) ** k, 0.4, 2.0)); out['%d/%d' % (D['de'], D['sur'])] = f
    print('poussière %d sur %d : L photo %.1f rendu %.1f, part photo %.3f rendu %.3f, facteur %.2f (%.1f mm²)' % (D['de'], D['sur'], lp, lr, cp, cr, f, m.sum() / r / r))
# the zones: their median colour outside the dust levels, photo against render
labP = cv2.cvtColor(P.astype(np.float32) / 255, cv2.COLOR_BGR2LAB); labR = cv2.cvtColor(R.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
dusty = np.zeros(LP.shape, bool)
for D in rec['poussiere']:
    for L in D['niveaux']: dusty |= mask_of(L['poly'])
zc = {}
for zi, z in enumerate(rec['zones']):
    mz = mask_of(z['poly']) if zi else mask_of([rec['contour']])
    for z2 in rec['zones'][1:] if zi == 0 else []: mz &= ~mask_of(z2['poly'])
    mz = cv2.erode(mz.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    mz &= ~dusty
    if mz.sum() < 200: continue
    d = np.median(labP[mz], 0) - np.median(labR[mz], 0)
    zc[str(z['zone'])] = [float(x) for x in d * k]
    print('zone %d %s : écart Lab %+.1f %+.1f %+.1f' % (z['zone'], z['c'], *d))
if '--ecrire' in sys.argv:
    i = sys.argv.index('--ecrire'); path, face = sys.argv[i + 1], sys.argv[i + 2]
    import os
    E = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    F = E.setdefault(face, {})
    for g, f in out.items(): F[g] = round(float(np.clip(F.get(g, 1.0) * f, 0.5, 1.6)), 3)
    ZC = F.setdefault('zones', {})
    for z, d in zc.items(): ZC[z] = [round(a + b, 2) for a, b in zip(ZC.get(z, [0, 0, 0]), d)]
    json.dump(E, open(path, 'w', encoding='utf-8', newline=chr(10)), ensure_ascii=False, indent=1)
    print('écrit', path, face, F)
