"""fibres.py: the scales of a wing face as fibres (PROTOCOLE §3.3, §12.5): on the flattened photo of aile.py plat, per cell of
`cell` mm, the direction the scales run (structure tensor), its coherence, the contrast of the scale texture (std of L* minus
its blur over 1.5 px: the measure aile.py paire calls grain), and the scales' length and width (where the autocorrelation of
the texture along and across them falls under 0.35). The moro-sphinx's scales are long and narrow, the hindwing's almost hairs,
all running outward from the hinge: drawn as tiles of short strokes, one per direction, over the measured zones. Numbers only.

  python insectes/outils/fibres.py <cadres.json> <face> [--cell 0.6]     -> insectes/<id>/ailes/<face>-fibres.json
  python insectes/outils/fibres.py <cadres.json> <face> --etalonne <rendu.png>
        the render's grain against the photo's, per contrast level: the damped factor written into the record ("k", amorti 0.8)"""
import sys, os, json, argparse
import numpy as np
import cv2

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def lstar(img):
    return cv2.cvtColor(img.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)[..., 0]


def hp(L):
    return L - cv2.GaussianBlur(L, (0, 0), 1.5)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('cadres'); ap.add_argument('face'); ap.add_argument('--cell', type=float, default=0.6)
    ap.add_argument('--etalonne'); ap.add_argument('--k', type=float, default=0.8)
    o = ap.parse_args()
    C = json.load(open(o.cadres, encoding='utf-8')); sid = C['_sid']
    d = os.path.join(ROOT, 'refcache', sid, 'ailes', o.face)
    recp = os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.face + '.json')
    outp = os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.face + '-fibres.json')
    rec = json.load(open(recp, encoding='utf-8')); r = rec['r']; s0, q1 = rec['origine']
    P = cv2.imread(os.path.join(d, 'plat.png'))[..., ::-1]; M = cv2.imread(os.path.join(d, 'masque.png'), 0) > 127
    m = cv2.erode(M.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    L = lstar(P); H = hp(L)
    cell = max(4, int(round(o.cell * r)))
    if o.etalonne:
        F = json.load(open(outp, encoding='utf-8'))
        R = cv2.imread(o.etalonne)[..., ::-1]
        if R.shape != P.shape: R = cv2.resize(R, (P.shape[1], P.shape[0]), interpolation=cv2.INTER_AREA)
        HR = hp(lstar(R))
        acc = {}
        for c in F['cases']:
            gx, gy, lv = c[0], c[1], c[7]
            mk = m[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell]
            if mk.sum() < 0.5 * cell * cell: continue
            gp = np.std(H[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell][mk]); gr = np.std(HR[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell][mk])
            acc.setdefault(lv, []).append(gp / max(0.2, gr))
        K = F.setdefault('k', [1.0] * len(F['niveaux']))
        for lv, v in acc.items():
            f = float(np.clip(np.median(v) ** o.k, 0.6, 1.8)); K[lv] = round(float(np.clip(K[lv] * f, 0.2, 4.0)), 3)
            print('niveau %d : photo / rendu %.2f -> k %.2f' % (lv, np.median(v), K[lv]))
        json.dump(F, open(outp, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
        return
    # structure tensor: the scales run across the dominant gradient
    g = cv2.GaussianBlur(L, (0, 0), 0.6)
    ix = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3); iy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    si = 0.2 * r
    jxx = cv2.GaussianBlur(ix * ix, (0, 0), si); jyy = cv2.GaussianBlur(iy * iy, (0, 0), si); jxy = cv2.GaussianBlur(ix * iy, (0, 0), si)
    th = 0.5 * np.arctan2(2 * jxy, jxx - jyy)
    coh = np.sqrt((jxx - jyy) ** 2 + 4 * jxy ** 2) / (jxx + jyy + 1e-6)
    # for the scales' size, a band-pass (under 0.15 mm): the grain's own high-pass keeps nothing past 0.1 mm
    BP = L - cv2.GaussianBlur(L, (0, 0), 0.15 * r)
    rows = []
    win = int(1.2 * r) | 1; hw = win // 2
    for gy in range(0, M.shape[0] // cell + 1):
        for gx in range(0, M.shape[1] // cell + 1):
            b = m[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell]
            if b.sum() < 0.35 * cell * cell: continue
            t = th[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell][b]; w = coh[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell][b]
            a = np.arctan2((w * np.sin(2 * t)).sum(), (w * np.cos(2 * t)).sum()) / 2
            # line direction in the image (y down) = gradient + 90°; in the wing frame (q up) the sign flips
            ang_img = a + np.pi / 2
            ang = float((-np.degrees(ang_img) + 90) % 180 - 90)
            con = float(np.std(H[gy * cell:(gy + 1) * cell, gx * cell:(gx + 1) * cell][b]))
            # length and width: the autocorrelation of the texture around the cell, along and across the scales
            cy, cx = gy * cell + cell // 2, gx * cell + cell // 2
            y0, x0 = max(0, cy - hw), max(0, cx - hw)
            patch = BP[y0:y0 + win, x0:x0 + win] * m[y0:y0 + win, x0:x0 + win]
            lng = wid = None
            if patch.shape == (win, win) and m[y0:y0 + win, x0:x0 + win].mean() > 0.8:
                Fp = np.fft.fft2(patch * np.outer(np.hanning(win), np.hanning(win)))
                ac = np.fft.fftshift(np.real(np.fft.ifft2(np.abs(Fp) ** 2))); ac /= ac.max() + 1e-9
                c0 = win // 2
                def reach(dx, dy):
                    for k in range(1, hw):
                        x, y = int(round(c0 + dx * k)), int(round(c0 + dy * k))
                        if ac[y, x] < 0.35: return k / r
                    return hw / r
                lng = 2 * reach(np.cos(ang_img), np.sin(ang_img)); wid = 2 * reach(-np.sin(ang_img), np.cos(ang_img))
            rows.append([gx, gy, round(ang, 1), round(float(np.median(w)), 2), round(con, 2), lng, wid])
    # the strip completed under the other wing (aile.py: each hidden pixel takes its nearest visible one) reads as perfect streaks
    # across the cut line: there the scales follow the hinge's radius, as everywhere else on the face (10 to 13° median gap),
    # and the contrast of their neighbours
    for x in rows:
        s_, q_ = s0 + (x[0] + .5) * o.cell, q1 - (x[1] + .5) * o.cell
        radial = np.degrees(np.arctan2(q_, s_)); dv = ((x[2] - radial + 90) % 180) - 90
        if abs(abs(x[2]) - 90) < 12 and x[3] > 0.6 and abs(dv) > 35: x[2], x[3] = round(float((radial + 90) % 180 - 90), 1), 0.5; x.append('c')
    med = float(np.median([x[4] for x in rows if x[-1] != 'c']))
    for x in rows:
        if x[-1] == 'c': x.pop(); x[4] = med
    con = np.array([x[4] for x in rows])
    # three contrast levels (terciles), each drawn with its own opacity
    cuts = np.percentile(con, [33.3, 66.7])
    lvls = [float(np.median(con[con <= cuts[0]])), float(np.median(con[(con > cuts[0]) & (con <= cuts[1])])), float(np.median(con[con > cuts[1]]))]
    for x in rows: x.append(int(np.searchsorted(cuts, x[4])))
    good = [x for x in rows if x[5] is not None]
    lng = float(np.median([x[5] for x in good])) if good else 0.2; wid = float(np.median([x[6] for x in good])) if good else 0.06
    for x in rows:
        if x[5] is None: x[5], x[6] = lng, wid
        x[5], x[6] = round(x[5], 3), round(x[6], 3)
    out = {'_doc': 'fibres.py : écailles de %s mesurées sur la photo à plat (direction, cohérence, contraste, longueur, largeur par case). '
                   'Cases : [gx, gy, angle°, cohérence, contraste L*, longueur mm, largeur mm, niveau]. Des chiffres, jamais l\'image.' % o.face,
           'cellule': round(cell / r, 4), 'origine': [s0, q1], 'longueur': round(lng, 3), 'largeur': round(wid, 3), 'niveaux': [round(v, 2) for v in lvls],
           'cases': rows}
    json.dump(out, open(outp, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
    print(outp, '%d cases, écailles %.2f x %.2f mm, contraste par niveau %s, cohérence médiane %.2f' % (len(rows), lng, wid, out['niveaux'], np.median([x[3] for x in rows])))


if __name__ == '__main__':
    main()
