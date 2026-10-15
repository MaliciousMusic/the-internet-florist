"""mesure.py: numbers measured on the decor renders with the methods of the briefs (decor/refs/*.md).

  python decor/mesure.py ciel  <ciel.png>                 sky profile by t, pale band, left/right at mid-height
  python decor/mesure.py nuage <nuage.png> [more...]      one cloud rendered alone (transparent): w/h, colours, edges
  python decor/mesure.py couv  <nuages.png> [--sky 722]   coverage of a clouds-only render of the world (alpha)
  python decor/mesure.py bords <solo.png> <ciel.png> <x0,y0,x1,y1>   edges, w/h and values of one cloud over the sky
  python decor/mesure.py bordsphoto <photo> <x0,y0,x1,y1>             the same on a reference photo
  python decor/mesure.py valeurs <img[:x0,y0,x1,y1]> [...]            values, creases, outline bumps, base, flanks
                                                                      (photo crop or render on its sky, same method)

PNG renders come from decor/shot.mjs (resvg). World frame 2400 x 1350, horizon at 722 (53.5 %)."""
import sys, colorsys
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HOR = 722 / 1350


def hexs(c):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in c[:3])


def hsv(c):
    h, s, v = colorsys.rgb_to_hsv(*(np.asarray(c[:3], float) / 255))
    return h * 360, s, v


def lum(c):
    c = np.asarray(c, float)
    return 0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2]


def ciel(path):
    a = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = a.shape
    yh = int(round(HOR * H))
    print(f'{path}: {W}x{H}, horizon {yh}')
    print(' t    hex      S    V    teinte')
    for t in (0.04, 0.15, 0.30, 0.45, 0.55, 0.70, 0.85, 0.93, 0.97):
        y = min(yh - 1, int(t * yh))
        c = np.median(a[max(0, y - 2):y + 3, int(W * .3):int(W * .7)].reshape(-1, 3), axis=0)
        h, s, v = hsv(c)
        print(f'{t:.2f}  {hexs(c)}  {s:.2f}  {v:.2f}  {h:.0f}')
    col = np.median(a[:yh, int(W * .3):int(W * .7)], axis=1)
    S = np.array([hsv(c)[1] for c in col])
    print(f'bande S<.35 : {(S < .35).mean() * 100:.0f} % de la hauteur visible ; S<.20 : {(S < .20).mean() * 100:.0f} %')
    smid = (S[:int(.4 * yh)].mean() + S[-3:].mean()) / 2
    print(f'mi-pente de S (S={smid:.2f}) a t = {np.argmax(S < smid) / yh:.2f}')
    y0, y1 = int(.45 * yh), int(.55 * yh)
    L = np.median(a[y0:y1, int(W * .02):int(W * .22)].reshape(-1, 3), axis=0)
    R = np.median(a[y0:y1, int(W * .78):int(W * .98)].reshape(-1, 3), axis=0)
    print(f'gauche {hexs(L)} S {hsv(L)[1]:.2f} V {hsv(L)[2]:.2f} | droite {hexs(R)} S {hsv(R)[1]:.2f} V {hsv(R)[2]:.2f}'
          f' | dS {hsv(L)[1] - hsv(R)[1]:+.2f} dV {hsv(L)[2] - hsv(R)[2]:+.2f}')
    y0, y1 = int(.02 * yh), int(.08 * yh)
    L = np.median(a[y0:y1, int(W * .02):int(W * .22)].reshape(-1, 3), axis=0)
    R = np.median(a[y0:y1, int(W * .78):int(W * .98)].reshape(-1, 3), axis=0)
    print(f'haut : gauche {hexs(L)} droite {hexs(R)} dS {hsv(L)[1] - hsv(R)[1]:+.2f} dV {hsv(L)[2] - hsv(R)[2]:+.2f}')


def edges(al, h):
    """Mean width of the alpha transition (.1 -> .9) at the top and at the bottom of each column, / h."""
    tops, bots = [], []
    cols = np.where(al.max(axis=0) > .95)[0]
    for x in cols[len(cols) // 6: -len(cols) // 6 or None: 2]:
        c = al[:, x]
        on = np.where(c > .9)[0]
        if not len(on):
            continue
        i0, i1 = on[0], on[-1]
        j = i0
        while j > 0 and c[j] > .1:
            j -= 1
        tops.append(i0 - j)
        j = i1
        while j < len(c) - 1 and c[j] > .1:
            j += 1
        bots.append(j - i1)
    return np.median(tops) / h, np.median(bots) / h


def nuage(path):
    im = np.asarray(Image.open(path).convert('RGBA'), float)
    al = im[..., 3] / 255
    m = al > .5
    ys, xs = np.where(m)
    if not len(ys):
        print(path, 'vide')
        return
    h = ys.max() - ys.min() + 1
    w = xs.max() - xs.min() + 1
    # un-premultiplied colour of the opaque part
    op = al > .9
    px = im[op][:, :3]
    L = lum(px)
    yy = np.where(op)[0]
    top = px[yy < ys.min() + .25 * h]
    topc = np.median(top[lum(top) >= np.percentile(lum(top), 60)], axis=0)
    flank = np.median(px[(L >= np.percentile(L, 35)) & (L <= np.percentile(L, 65))], axis=0)
    base = np.median(px[L <= np.percentile(L, 8)], axis=0)
    et, eb = edges(al, h)
    fr = ((al > .15) & (al < .5)).sum() / max(1, m.sum())
    print(f'{path.split("/")[-1].split(chr(92))[-1]}: w/h {w / h:.2f} ({w}x{h}) | sommet {hexs(topc)} S {hsv(topc)[1]:.2f}'
          f' | flanc {hexs(flank)} | base {hexs(base)} T {hsv(base)[0]:.0f} S {hsv(base)[1]:.2f}'
          f' | L base/sommet {lum(base) / lum(topc):.2f} | bord haut {et:.3f} h, bas {eb:.3f} h | franges {fr:.2f}')


def couv(path, sky=722):
    im = np.asarray(Image.open(path).convert('RGBA'), float)
    H = im.shape[0]
    yh = int(round(sky / 1350 * H))
    al = im[:yh, :, 3] / 255
    W = im.shape[1]
    col = al[:, int(W * (820 / 2400)):int(W * (1580 / 2400))]
    print(f'couverture du ciel visible : opaque {(al > .5).mean() * 100:.1f} %, translucide {((al > .15) & (al <= .5)).mean() * 100:.1f} %'
          f' | colonne telephone : {(col > .5).mean() * 100:.1f} %')
    for a, b, name in ((0, .1, '<.1 (ras)'), (.1, .25, '.1-.25'), (.25, .5, '.25-.5'), (.5, 1, '>.5 (haut)')):
        y0, y1 = int((1 - b) * yh), int((1 - a) * yh)
        print(f'  d {name:12s}: {(al[y0:y1] > .5).mean() * 100:.1f} %')


def bords(path, skypath, box):
    """Edge widths measured like the brief: visual alpha from the blue-red gap relative to the sky behind."""
    im = np.asarray(Image.open(path).convert('RGB'), float)
    sk = np.asarray(Image.open(skypath).convert('RGB').resize((im.shape[1], im.shape[0])), float)
    H, W, _ = im.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    sl = (slice(int(y0 * H), int(y1 * H)), slice(int(x0 * W), int(x1 * W)))
    c, s = im[sl], sk[sl]
    a = np.clip(1 - (c[..., 2] - c[..., 0]) / np.maximum(s[..., 2] - s[..., 0], 1), 0, 1)
    m = a > .5
    ys, xs = np.where(m)
    h = ys.max() - ys.min() + 1
    w = xs.max() - xs.min() + 1
    t, b = edges(np.clip((a - .15) / .7, 0, 1), h)
    L = lum(c[m])
    print(f'{path.split(chr(92))[-1].split("/")[-1]}: {w}x{h} px, w/h {w / h:.2f} | bord haut {t:.3f} h, bas {b:.3f} h'
          f' (rapport {b / max(t, 1e-3):.1f}) | L p5 {np.percentile(L, 5):.0f} p50 {np.percentile(L, 50):.0f} p97 {np.percentile(L, 97):.0f}'
          f' | ombre/sommet {np.percentile(L, 5) / np.percentile(L, 97):.2f}')


def bordsphoto(path, box):
    """Same edge measure on a photo: the sky of each row is its bluest pixels (95th percentile of blue - red)."""
    im = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = im.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    c = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    br = c[..., 2] - c[..., 0]
    sky = np.percentile(br, 95, axis=1, keepdims=True)
    a = np.clip(1 - br / np.maximum(sky, 1), 0, 1)
    m = a > .5
    ys, xs = np.where(m)
    h = ys.max() - ys.min() + 1
    w = xs.max() - xs.min() + 1
    t, b = edges(np.clip((a - .15) / .7, 0, 1), h)
    L = lum(c[m])
    print(f'{path.split(chr(92))[-1].split("/")[-1]}: {w}x{h} px | bord haut {t:.3f} h ({t * h:.1f} px), bas {b:.3f} h'
          f' | L p5 {np.percentile(L, 5):.0f} p50 {np.percentile(L, 50):.0f} p97 {np.percentile(L, 97):.0f}')


def valeurs(path, box='0,0,1,1'):
    """Value structure and outline of ONE cloud, on a photo crop or on a render over its sky (same method for both).
    Visual alpha from the blue-red gap relative to the bluest pixels of each row. Prints:
    - L p5/p50/p97, shade/top p5/p97 and p50/p97, share of pixels under .75 and over .9 of the top (three values);
    - where the shade sits: centroid of the darkest quarter (fractions of w and h from the top-left);
    - creases: high-pass L (minus a blur of 3 % of h) inside the opaque top 45 %: p5 (dark creases), p95 (lit caps);
    - top outline: bumps of the top contour (peaks of the contour minus a 6 %-of-w smoothing, prominence > .4 % of h):
      count, width quantiles in % of w, coefficient of variation (regular beads -> low CV, three scales -> high);
    - base: std of the bottom contour / h, transition width (alpha .9 -> .1) along x: median and CV / h;
    - flanks: translucent share (.15 < alpha < .5) in the outer 15 % of each side, over the cloud's opaque share."""
    from scipy import ndimage as ndi
    im = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = im.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    c = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    br = c[..., 2] - c[..., 0]
    sky = np.percentile(br, 95, axis=1, keepdims=True)
    a = np.clip(1 - br / np.maximum(sky, 1), 0, 1)
    a = ndi.median_filter(a, 3)
    m = a > .5
    lab, n = ndi.label(m)
    if n > 1:  # keep the biggest cloud
        sz = ndi.sum(m, lab, range(1, n + 1))
        m = lab == (1 + int(np.argmax(sz)))
    m = ndi.binary_fill_holes(m)  # the dark blue-grey shade has a lower alpha but belongs to the cloud
    ys, xs = np.where(m)
    h = ys.max() - ys.min() + 1
    w = xs.max() - xs.min() + 1
    L = lum(c)
    op = ndi.binary_erosion(m, iterations=max(1, int(.01 * h)))
    v = L[op]
    p5, p25, p50, p97 = np.percentile(v, [5, 25, 50, 97])
    yy, xx = np.where(op & (L <= p25))
    print(f'{path.split(chr(92))[-1].split("/")[-1]}: {w}x{h} px | L p5 {p5:.0f} p50 {p50:.0f} p97 {p97:.0f}'
          f' | p5/p97 {p5 / p97:.2f} p50/p97 {p50 / p97:.2f} | <.75 {(v < .75 * p97).mean() * 100:.0f} % >.9 {(v > .9 * p97).mean() * 100:.0f} %'
          f' | ombre au quart sombre : x {(xx.mean() - xs.min()) / w:.2f} y {(yy.mean() - ys.min()) / h:.2f}')
    # creases and caps in the top 45 %
    hp = L - ndi.gaussian_filter(L, .03 * h)
    zone = op & (np.arange(L.shape[0])[:, None] < ys.min() + .45 * h)
    zone = ndi.binary_erosion(zone, iterations=max(1, int(.02 * h)))
    if zone.sum() > 50:
        q = hp[zone]
        print(f'  plis (passe-haut, haut 45 %) : p5 {np.percentile(q, 5):+.1f} p95 {np.percentile(q, 95):+.1f} ecart-type {q.std():.1f}')
    # top outline bumps
    cols = np.arange(xs.min(), xs.max() + 1)
    top = np.array([np.argmax(m[:, x]) if m[:, x].any() else np.nan for x in cols], float)
    ok = ~np.isnan(top)
    top = np.interp(cols, cols[ok], top[ok])
    res = ndi.gaussian_filter1d(top, .06 * w) - top  # > 0 where the outline rises above its trend
    from scipy.signal import find_peaks
    pk, pr = find_peaks(res, prominence=.004 * h, width=1)
    if len(pk) > 2:
        wd = pr['widths'] / w * 100
        print(f'  bosses du contour haut : {len(pk)} | largeur % de w : p10 {np.percentile(wd, 10):.1f} p50 {np.percentile(wd, 50):.1f}'
              f' p90 {np.percentile(wd, 90):.1f} | CV {wd.std() / wd.mean():.2f} | relief p50 {np.median(pr["prominences"]) / h * 100:.1f} % de h')
    # base
    bot, bw = [], []
    for x in cols[len(cols) // 8: -len(cols) // 8 or None]:
        col = a[:, x]
        on = np.where(col > .9)[0]
        if not len(on):
            continue
        i1 = on[-1]
        j = i1
        while j < len(col) - 1 and col[j] > .1:
            j += 1
        bot.append(np.where(col > .5)[0][-1])
        bw.append(j - i1)
    bot, bw = np.array(bot, float), np.array(bw, float)
    print(f'  base : ecart-type du bas {bot.std() / h:.3f} h | fondu {np.median(bw) / h:.3f} h, CV le long de x {bw.std() / max(bw.mean(), 1e-6):.2f}')
    # flanks
    tr = (a > .15) & (a < .5)
    k = int(.15 * w)
    side = np.zeros_like(m)
    side[:, xs.min():xs.min() + k] = True
    side[:, xs.max() - k:xs.max() + 1] = True
    print(f'  flancs : translucide {tr[side].sum() / max(1, m[side].sum()):.2f} de l opaque (tout le nuage {tr.sum() / m.sum():.2f})')


if __name__ == '__main__':
    cmd, *rest = sys.argv[1:]
    if cmd == 'valeurs':
        for p in rest:
            path, box = (p.rsplit(':', 1) if ':' in p[2:] and ',' in p.rsplit(':', 1)[1] else (p, '0,0,1,1'))
            valeurs(path, box)
        sys.exit()
    if cmd == 'ciel':
        ciel(rest[0])
    elif cmd == 'nuage':
        for p in rest:
            nuage(p)
    elif cmd == 'couv':
        couv(rest[0])
    elif cmd == 'bords':
        bords(*rest[:3])
    elif cmd == 'bordsphoto':
        bordsphoto(*rest[:2])
