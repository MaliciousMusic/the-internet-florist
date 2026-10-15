"""mesure_voiles.py: numbers measured on the sky and veil renders with the methods of decor/refs/voiles.md.

  python decor/mesure_voiles.py profil <ciel.png> [--x0 .3 --x1 .7]   vertical profile by t, whitening, left/right
  python decor/mesure_voiles.py maquette                              the same rows on the owner's mock-up (sides)
  python decor/mesure_voiles.py bandes <ciel.png>                     8-bit steps of the gradient (banding)
  python decor/mesure_voiles.py traines <voiles.png> [<ciel.png>]     veils alone (RGBA, world frame cropped to the sky):
                                                                      thickness, edge ramp, spacing, tilt, coverage, fade
  python decor/mesure_voiles.py photo <photo> <x0,y0,x1,y1> <yH>      the same streak numbers on a reference photo
                                                                      (alpha = 1 - (B-R)/fond, fond fitted per row band)

Renders come from decor/shot.mjs (resvg). World frame 2400 x 1350, horizon at 722; t = y / 722."""
import sys, colorsys
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HOR = 722 / 1350
MAQ = 'refcache/decor-voiles/maquette-porteur.jpg'
TS = (0.04, 0.15, 0.30, 0.40, 0.50, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.98)


def hexs(c):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in c[:3])


def hsv(c):
    h, s, v = colorsys.rgb_to_hsv(*(np.asarray(c[:3], float) / 255))
    return h * 360, s, v


def lum(c):
    c = np.asarray(c, float)
    return 0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2]


def opt(args, k, d):
    return float(args[args.index(k) + 1]) if k in args else d


def rows(a, yh, x0, x1, ts=TS):
    out = []
    W = a.shape[1]
    for t in ts:
        y = min(yh - 1, int(round(t * yh)))
        c = np.median(a[max(0, y - 2):y + 3, int(W * x0):int(W * x1)].reshape(-1, 3), axis=0)
        out.append((t, c))
    return out


def report(rs):
    s0 = hsv(rs[0][1])[1]
    print(' t     hex      S     V    teinte  blanchiment (1 - S/S_haut)')
    for t, c in rs:
        h, s, v = hsv(c)
        print(f'{t:.2f}  {hexs(c)}  {s:.2f}  {v:.2f}  {h:4.0f}    {1 - s / s0:.2f}')


def profil(path, args):
    a = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = a.shape
    yh = int(round(HOR * H))
    x0, x1 = opt(args, '--x0', .3), opt(args, '--x1', .7)
    print(f'{path}: {W}x{H}, horizon {yh}, colonnes {x0:.2f}-{x1:.2f}')
    report(rows(a, yh, x0, x1))
    col = np.median(a[:yh, int(W * x0):int(W * x1)], axis=1)
    S = np.array([hsv(c)[1] for c in col])
    s0, s1 = S[:int(.1 * yh)].mean(), S[-3:].mean()
    for q in (.25, .5, .9):
        print(f'{int(q * 100)} % de la chute de S a t = {np.argmax(S < s0 - q * (s0 - s1)) / yh:.2f}', end=' ; ')
    print(f'S<.10 des t = {np.argmax(S < .10) / yh:.2f}')
    for (ya, yb, nm) in ((.45, .55, 'mi-hauteur'), (.02, .08, 'haut'), (.80, .86, 't .83')):
        L = np.median(a[int(ya * yh):int(yb * yh), int(W * .02):int(W * .22)].reshape(-1, 3), axis=0)
        R = np.median(a[int(ya * yh):int(yb * yh), int(W * .78):int(W * .98)].reshape(-1, 3), axis=0)
        print(f'{nm}: gauche {hexs(L)} droite {hexs(R)} dS {hsv(L)[1] - hsv(R)[1]:+.3f} dV {hsv(L)[2] - hsv(R)[2]:+.3f}')


def maquette():
    a = np.asarray(Image.open(MAQ).convert('RGB'), float)
    yh = 540
    # sides of the mock-up, clear of the bouquet; cards (y 50-185) leave only x 0-8 and 562-572 free up there
    print(f'{MAQ}: ciel y 0-540 (t = y/540), moyenne des deux bords')
    rs = []
    for t in TS:
        y = int(round(t * yh))
        if 48 <= y <= 188:
            L = np.median(a[y - 2:y + 3, 0:8].reshape(-1, 3), axis=0)
            R = np.median(a[y - 2:y + 3, 563:572].reshape(-1, 3), axis=0)
        else:
            L = np.median(a[y - 2:y + 3, 0:110].reshape(-1, 3), axis=0)
            R = np.median(a[y - 2:y + 3, 470:572].reshape(-1, 3), axis=0)
        rs.append((t, (L + R) / 2))
    report(rs)


def bandes(path, args):
    """Banding: along the phone column and the left/right strips, the row-mean profile of each channel; every 8-bit
    step is located; the widest step (units of the world) and any step larger than one level are reported."""
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, float)
    H, W, _ = a.shape
    yh = int(round(HOR * H))
    k = 1350 / H
    for x0, x1, nm in ((.02, .06, 'bord gauche'), (.35, .65, 'colonne'), (.94, .98, 'bord droit')):
        x = int(W * (x0 + x1) / 2)
        col = a[:yh, x]
        d = np.abs(np.diff(col, axis=0))
        big = int((d > 1).any(axis=1).sum())
        # run lengths of constant colour (units)
        ch = np.any(d > 0, axis=1)
        idx = np.where(ch)[0]
        runs = np.diff(np.concatenate([[0], idx, [yh - 1]]))
        print(f'{nm} (x {x * k:.0f}) : {len(idx)} marches sur {yh} px, marches > 1 niveau : {big},'
              f' palier le plus long {runs.max() * k:.0f} unites (y {np.argmax(runs) * k:.0f}), median {np.median(runs) * k:.1f}')
    # 2-D: is a row constant across x? count distinct colours along a few rows (a gradient bent by the sun veil)
    for t in (.1, .3, .5, .7, .9):
        y = int(t * yh)
        row = a[y]
        nd = len({tuple(c) for c in row.astype(int)})
        print(f't {t:.1f}: {nd} couleurs distinctes le long de la rangee')


def alpha_of(path):
    im = Image.open(path)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    return np.asarray(im, float)[..., 3] / 255


def crests(al, yh, k, thr=0.04):
    """Per column (every 4 px), the significant vertical crests of alpha: centre, FWHM, 20-80 % ramps, amplitude.
    A crest counts when it rises by at least a third of the column's strongest crest above the floor between it and
    its neighbours (minor bumps of a fibrous streak are not separate streaks)."""
    out = []
    H, W = al.shape
    for x in range(0, W, 4):
        c = al[:yh, x]
        cand = []
        for y in range(2, yh - 2):
            if c[y] >= thr and c[y] >= c[y - 1] and c[y] > c[y + 1] and c[y] >= c[max(0, y - 8):y + 9].max():
                cand.append(y)
        res = []
        for y in cand:
            pk = c[y]
            lo_u = c[max(0, y - 250):y].min() if y > 0 else 0
            lo_d = c[y + 1:min(yh, y + 250)].min() if y + 1 < yh else 0
            fl = max(lo_u, lo_d)
            amp = pk - fl
            if amp < thr * 0.8:
                continue

            def walk(direc, frac):
                yy = y
                while 0 < yy < yh - 1 and c[yy] > fl + frac * amp:
                    yy += direc
                return yy
            up50, dn50 = walk(-1, .5), walk(1, .5)
            up20, up80 = walk(-1, .2), walk(-1, .8)
            dn20, dn80 = walk(1, .2), walk(1, .8)
            res.append(dict(x=x * k, y=y * k, fwhm=(dn50 - up50) * k, rup=(up80 - up20) * k, rdn=(dn20 - dn80) * k,
                            pk=pk, amp=amp))
        if res:
            m = max(r['amp'] for r in res)
            out += [r for r in res if r['amp'] >= m / 3]
    return out


def stats(al, yh, k, name):
    """The numbers of voiles.md on an alpha map (sky rows 0..yh, k world units per pixel, t = row / yh)."""
    cr = crests(al, yh, k)
    if not cr:
        print(name, ': aucune trainee')
        return
    fw = np.array([c['fwhm'] for c in cr])
    ramp = np.array([(c['rup'] + c['rdn']) / 2 for c in cr])
    pk = np.array([c['amp'] for c in cr])
    big = pk >= np.percentile(pk, 50)
    sky = yh * k
    print(f'{name}: {len(cr)} cretes')
    print(f'  epaisseur {np.median(fw[big]) / sky:.3f} du ciel [{np.percentile(fw[big], 10) / sky:.3f}-{np.percentile(fw[big], 90) / sky:.3f}]'
          f' ; rampe/epaisseur {np.median(ramp[big] / fw[big]):.2f} ; haut/bas {np.median([c["rup"] / max(c["rdn"], 1e-3) for c in cr]):.2f}'
          f' ; pic {np.median(pk[big]):.3f} (p90 {np.percentile(pk, 90):.3f})')
    sp = []
    for x in sorted({c['x'] for c in cr}):
        yy = sorted(c['y'] for c in cr if c['x'] == x)
        sp += list(np.diff(yy))
    if sp:
        sp = np.array(sp)
        print(f'  espacement {np.median(sp) / sky:.3f} du ciel [{np.percentile(sp, 10) / sky:.3f}-{np.percentile(sp, 90) / sky:.3f}]', end='')
    byx = {}
    for c in cr:
        byx.setdefault(c['x'], []).append(c)
    xs = sorted(byx)
    ang = []
    for i in range(len(xs) - 8):
        for c in byx[xs[i]]:
            ys2 = [d['y'] for d in byx[xs[i + 8]]]
            if not ys2:
                continue
            j = int(np.argmin([abs(v - c['y']) for v in ys2]))
            dy = ys2[j] - c['y']
            if abs(dy) < .35 * c['fwhm']:
                ang.append(np.degrees(np.arctan2(-dy, xs[i + 8] - xs[i])))
    if ang:
        ang = np.abs(ang)
        print(f' ; inclinaison |angle| mediane {np.median(ang):.1f} deg (p90 {np.percentile(ang, 90):.1f})')
    else:
        print()
    parts = []
    for (ta, tb) in ((0, .5), (.5, .667), (.667, 1.0), (.667, .85), (.9, 1.0)):
        z = al[int(ta * yh):int(tb * yh)]
        parts.append(f't {ta:.2f}-{tb:.2f} : couv. {(z > .15).mean() * 100:4.1f} %, moy. {z.mean():.3f}')
    print('  ' + ' ; '.join(parts[:3]))
    print('  ' + ' ; '.join(parts[3:]))
    st = np.array([al[max(0, int(t * yh) - 2):int(t * yh) + 3].std(axis=1).mean() for t in (.6, .7, .75, .8, .85, .9, .95)])
    print('  contraste local (ecart-type le long de x / max) :', ' '.join(f't{t:.2f} {v / st.max():.2f}' for t, v in zip((.6, .7, .75, .8, .85, .9, .95), st)))


def traines(path, args):
    al = alpha_of(path)
    H, W = al.shape
    k = 1350 / H
    stats(al, int(round(722 / k)), k, path + ' (alpha propre des voiles)')


def photo_alpha(path, yH_frac):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, float)
    H, W, _ = a.shape
    yH = int(round(float(yH_frac) * H))
    br = a[..., 2] - a[..., 0]
    # bare sky: per row, a high percentile of (B - R) (the bluest pixels), fitted by a cubic down the rows
    from numpy.polynomial import polynomial as P
    fond = np.percentile(br, 90, axis=1)
    yy = np.arange(H)
    ok = yy < yH - 3
    cf = P.polyfit(yy[ok], fond[ok], 3)
    fond = P.polyval(yy, cf)
    return np.clip(1 - br / np.maximum(fond[:, None], 1), 0, 1), yH


def photo(path, box, yh_frac):
    al, yH = photo_alpha(path, yh_frac)
    H, W = al.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    sub = al[:yH, int(x0 * W):int(x1 * W)]
    # rows above y0 * H are blanked (frame top not judged)
    sub = sub.copy()
    sub[:int(y0 * H)] = 0
    stats(sub, yH, 722 / yH, f'{path} [{box}] (alpha = 1 - (B-R)/fond, t = y/yH)')


if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'profil':
        profil(args[0], args)
    elif cmd == 'maquette':
        maquette()
    elif cmd == 'bandes':
        bandes(args[0], args)
    elif cmd == 'traines':
        traines(args[0], args)
    elif cmd == 'photo':
        photo(*args[:3])
