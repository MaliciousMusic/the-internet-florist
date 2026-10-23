"""taches.py: the white flecks and the pits of the rose chafer's shell, read on a dorsal photo laid in the body frame (PROTOCOLE §3.3,
« motifs relevés en contours, en chiffres »), numbers only.

  python insectes/cetoine/outils/taches.py <photo> <mesure dessus.json> <out.json> [--blanc 70] [--chroma 24]

The body frame comes from the dorsal measure (forme.py dessus): its scale, the axis' tilt and the origin on the axis at the
pronotum's hind margin; x forward, y to the beetle's left (the image's left, head up), mm.
Flecks: the pixels of the shell lighter than --blanc L* and greyer than --chroma C* (the wax is white; a highlight on the green is
saturated), opened by 0.04 mm, pieces over 0.012 mm²; each outline simplified to 0.03 mm, its centre, area, side (+1 left elytron,
-1 right) and median colour.
Pits: the black-hat of L* over 0.3 mm above 14 L*, pieces of 0.002 to 0.05 mm²; per cell of 1 mm on each piece of the shell
(elytra, pronotum) their count per mm² and mean diameter, and the share of crescent pits (pieces whose outline is concave).
Writes refcache/cetonia-aurata/cartes/taches-<photo>.jpg (control)."""
import sys, os, json
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
REF = os.path.join(ROOT, 'refcache', 'cetonia-aurata')
opt = lambda a, k, d=None: a[a.index(k) + 1] if k in a else d
sys.path.insert(0, HERE)
import forme  # noqa: E402


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def main():
    a = sys.argv[1:]
    nom, mes, out = a[0], json.load(open(a[1], encoding='utf-8')), a[2]
    blanc, chroma = float(opt(a, '--blanc', 70)), float(opt(a, '--chroma', 24))
    img = cv2.imread(os.path.join(REF, 'hd', nom + '.jpg'))
    k = 1 / mes['px_par_mm']; ang = np.radians(mes['axe_inclinaison_deg']); ox, oy = mes['origine_px']
    # photo px -> body mm: the axis is x' = ox + (y - oy) tan(ang) ... rotate about the origin by the tilt
    def to_mm(X, Y):
        dx, dy = X - ox, Y - oy
        c, s = np.cos(ang), np.sin(ang)
        u = c * dx - s * dy; v = s * dx + c * dy                 # the frame turned so the axis is vertical
        return -v * k, -u * k                                    # x forward (up the image), y to the left (image left)
    H, W = img.shape[:2]
    YY, XX = np.mgrid[:H, :W]
    xm, ym = to_mm(XX.astype(np.float32), YY.astype(np.float32))
    shell = forme.opened(forme.cut(img), 40) > 0
    lab = cv2.cvtColor(img.astype(np.float32) / 255, cv2.COLOR_BGR2LAB); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    elytra = shell & (xm < -0.3) & (xm > -11.8)
    pron = shell & (xm > 0.15) & (xm < 3.6)
    shell_in = cv2.erode((elytra | pron).astype(np.uint8), np.ones((int(0.25 / k),) * 2, np.uint8)) > 0
    # flecks
    # hysteresis: the cores (white, grey) grown into the paler wax around them (L* 12 lower, C* 8 more)
    core = ((L > blanc) & (C < chroma) & shell_in).astype(np.uint8)
    core = cv2.morphologyEx(core, cv2.MORPH_OPEN, np.ones((max(2, int(0.04 / k)),) * 2, np.uint8))
    weak = ((L > blanc - 12) & (C < chroma + 8) & shell_in).astype(np.uint8)
    n0, lb0, _, _ = cv2.connectedComponentsWithStats(weak, connectivity=8)
    keep0 = np.zeros(n0, bool); keep0[np.unique(lb0[core > 0])] = True; keep0[0] = False
    fm = cv2.morphologyEx(keep0[lb0].astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    cs, _ = cv2.findContours(fm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    taches = []
    for cn in cs:
        if cv2.contourArea(cn) * k * k < 0.012: continue
        if to_mm(*cn[:, 0, :].mean(0))[0] > -0.3: continue      # c114's pronotum has no fleck: a white glint there
        ap = cv2.approxPolyDP(cn, max(0.8, 0.015 / k), True)[:, 0, :]
        if len(ap) < 3: continue
        P = [to_mm(float(x), float(y)) for x, y in ap]
        m = np.zeros(fm.shape, np.uint8); cv2.drawContours(m, [cn], -1, 1, -1)
        cx, cy = to_mm(*np.array(np.nonzero(m)[::-1]).mean(1))
        taches.append({'cote': 1 if cy > 0 else -1, 'centre': [round(float(cx), 3), round(float(cy), 3)], 'aire': round(float(m.sum() * k * k), 4),
                       'contour': [[round(float(x), 3), round(float(y), 3)] for x, y in P], 'c': hexof(np.median(lab[m > 0], 0)),
                       'piece': 'elytre' if cx < -0.2 else 'pronotum'})
    # pits
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.3 / k) | 1,) * 2)
    bh = cv2.morphologyEx(cv2.GaussianBlur(L, (0, 0), 0.8), cv2.MORPH_BLACKHAT, ker)
    pm = ((bh > float(opt(a, '--piq', 9))) & shell_in & ~cv2.dilate(fm, np.ones((5, 5), np.uint8)).astype(bool)).astype(np.uint8)
    n, cc, st, cen = cv2.connectedComponentsWithStats(pm, connectivity=8)
    area = st[:, cv2.CC_STAT_AREA] * k * k
    ok = (area > 0.003) & (area < 0.06); ok[0] = False
    cells = {}
    for i in np.nonzero(ok)[0]:
        X, Y = cen[i]; x, y = to_mm(X, Y)
        piece = 'elytre' if x < -0.3 else 'pronotum' if x > 0.15 else None
        if piece is None: continue
        # crescent: its area well under its convex hull's
        comp = (cc[st[i, 1]:st[i, 1] + st[i, 3], st[i, 0]:st[i, 0] + st[i, 2]] == i).astype(np.uint8)
        cs2, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        hull = cv2.contourArea(cv2.convexHull(cs2[0])) + 1e-6
        cres = comp.sum() / hull < 0.72
        key = (piece, int(np.floor(x)), int(np.floor(abs(y))))
        c = cells.setdefault(key, [0, 0.0, 0])
        c[0] += 1; c[1] += 2 * np.sqrt(area[i] / np.pi); c[2] += int(cres)
    # per cell the area of shell inside it (both sides folded: |y|)
    piq = []
    for (piece, cx, cy), (cnt, dsum, cres) in sorted(cells.items()):
        sel = (elytra if piece == 'elytre' else pron) & (np.floor(xm) == cx) & (np.floor(np.abs(ym)) == cy) & shell_in
        A = sel.sum() * k * k
        if A < 0.25: continue
        piq.append({'piece': piece, 'x': cx + 0.5, 'y': cy + 0.5, 'densite': round(cnt / A / 2 if A > 0 else 0, 2) if False else round(cnt / A, 2),
                    'diametre': round(dsum / cnt, 3), 'croissants': round(cres / cnt, 2)})
    # the rows of pits on the elytral disc: the period of the pits' mask across the body (spectrum of its column sums)
    disc = elytra & (xm < -3.5) & (xm > -9.5) & (np.abs(ym) > 0.6) & (np.abs(ym) < 3.6)
    good = (pm > 0) & ok[cc] & disc
    prof = np.bincount(np.clip(((ym[good] + 5) / 0.02).astype(int), 0, 499), minlength=500).astype(float)
    prof -= prof.mean(); F = np.abs(np.fft.rfft(prof * np.hanning(500))); f = np.fft.rfftfreq(500, 0.02)
    sel = (f > 1.2) & (f < 5); per = 1 / f[sel][np.argmax(F[sel])]
    print('rangées de piqûres : période %.3f mm' % per)
    # read by eye on a crop of the left elytron's disc (c114 x 380-780, y 1150-1350 px: 4.9 x 2.4 mm): horseshoe pits open
    # toward the rear, in double rows (the spectrum's period), 0.2 mm wide and 0.24 long, about 0.38 mm apart along a row, about
    # 70 on 11.8 mm² (6 per mm²); the black-hat finds only the darkest third of them
    oeil = {'forme': "fer à cheval ouvert vers l'arrière", 'largeur': 0.2, 'longueur': 0.24, 'pas_le_long': 0.38, 'ecart_double_rangee': 0.25, 'densite_disque': 6.0}
    rec = {'_doc': 'taches.py sur %s : taches blanches (contours en mm, repère du corps, x vers l\'avant, y vers la gauche) et piqûres '
                   '(densité par mm², diamètre moyen, part de croissants, par case de 1 mm, les deux côtés repliés). Des chiffres, jamais l\'image.' % nom,
           'photo': nom, 'taches': taches, 'piqures': piq, 'rangees_mm': round(float(per), 3), 'releve_oeil': oeil}
    json.dump(rec, open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    v = img.copy(); v[fm > 0] = (255, 0, 255); v[(pm > 0) & ok[cc]] = (0, 255, 255)
    s = 1100 / v.shape[0]
    cv2.imwrite(os.path.join(REF, 'cartes', 'taches-%s.jpg' % nom), cv2.resize(v, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 88])
    for p in ('elytre', 'pronotum'):
        q = [c for c in piq if c['piece'] == p]
        if q: print(p, 'piqûres : densité médiane %.1f /mm², diamètre %.3f mm, croissants %.0f %%' % (np.median([c['densite'] for c in q]), np.median([c['diametre'] for c in q]), 100 * np.median([c['croissants'] for c in q])))
    print(out, len(taches), 'taches', '%.2f mm²' % sum(t['aire'] for t in taches))


if __name__ == '__main__':
    main()
