"""forme.py: the shape map of an insect on a reference photo, and the same map of a render, so that the two compare by numbers
(PROTOCOLE §2). Runs in vases5/.venv-depth (SAM facebook/sam-vit-base, Depth Anything V2 base, already downloaded), through
`GATE_MAX=1 sh ws/gate.sh ...`: one model at a time on the whole chantier, the two loaded one after the other.

  vases5/.venv-depth/Scripts/python insectes/outils/forme.py photo <img> --box x0,y0,x1,y1 --axe xq,yq;xt,yt --pos x,y;... [--neg x,y;...]
                                    --out <dir> [--vue dessus|profil|face|dessous] [--max 1600]
  vases5/.venv-depth/Scripts/python insectes/outils/forme.py rendu <png> --axe xq,yq;xt,yt --out <dir> [--vue ...]
  python insectes/outils/forme.py table <sid>      every map of refcache/<sid>/formes/: per view, the photos' range of each measure
                                                   (widened by 25 %) and the verdict of each render -> formes/verdict.json

--axe: the body axis, from the tip of the abdomen (q) to the front of the head (t), px of the image. The insect is measured in the
frame of that axis, its length L = |t - q|:
  largeur    the width of the body's core (the mask opened by a disk of 4 % of L: legs, antennae and hair tips fall off), across the
             axis, at 24 stations from the tail (0) to the head (1), in L
  col, taille the narrowest points of that width between the head and the thorax and between the thorax and the abdomen (t, width)
  depasse    the mask beyond the axis ends (antennae, tongue, wings past the tail), in L
  frange     the fuzzy edge: the band of the mask outside its core, its mean thickness in L (the long hair of the silhouette)
  relief     the depth along the axis (Depth Anything, relative inverse depth, normalised over the core: 0 the core's farthest point, 1 its
             nearest), and the bulge across the abdomen and the thorax (the depth at the axis minus the mean at 80 % of the half width)
  ton        the median L* (CIE) and the share under L* 30 at each station; teinte the median a*, b* at each station (the bands)
The photo's maps hold its pixels (refcache/<sid>/formes/<name>/: carte.jpg, masque.png, depth.npy; never in git); forme.json holds
numbers only."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
NS = 24


def pts(s):
    return [[float(v) for v in p.split(',')] for p in s.split(';') if p]


def lab_of(rgb):
    return cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)


def depth(rgb):
    sys.path.insert(0, os.path.join(ROOT, 'fleur'))
    from carte import depth_of
    return depth_of(rgb)


def measure(rgb, m, axe, d=None):
    q, t = np.array(axe[0]), np.array(axe[1]); L = float(np.linalg.norm(t - q)); ea = (t - q) / L; en = np.array([-ea[1], ea[0]])
    k = max(3, int(0.04 * L) | 1)
    core = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))) > 0
    n, lb, st, _ = cv2.connectedComponentsWithStats(core.astype(np.uint8))
    if n > 2: core = lb == (1 + np.argmax(st[1:, cv2.CC_STAT_AREA]))
    ys, xs = np.nonzero(m); P = np.stack([xs, ys], 1) - q; u = P @ ea / L; v = P @ en / L
    yc, xc = np.nonzero(core); Pc = np.stack([xc, yc], 1) - q; uc = Pc @ ea / L; vc = Pc @ en / L
    lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 1.0))
    st_w, st_L, st_dk, st_ab, st_z = [], [], [], [], []
    dz = None
    if d is not None:
        dv = d[core]; lo, hi = np.percentile(dv, 2), np.percentile(dv, 98); dz = np.clip((d - lo) / max(1e-6, hi - lo), 0, 1)
    for i in range(NS):
        a, b = i / NS, (i + 1) / NS
        sel = (uc >= a) & (uc < b)
        if sel.sum() < 5: st_w.append(0); st_L.append(None); st_dk.append(None); st_ab.append(None); st_z.append(None); continue
        w = float(np.percentile(vc[sel], 99) - np.percentile(vc[sel], 1)); st_w.append(round(w, 4))
        lv = lab[yc[sel], xc[sel]]
        st_L.append(round(float(np.median(lv[:, 0])), 1)); st_dk.append(round(float((lv[:, 0] < 30).mean()), 3))
        st_ab.append([round(float(np.median(lv[:, 1])), 1), round(float(np.median(lv[:, 2])), 1)])
        st_z.append(round(float(np.median(dz[yc[sel], xc[sel]])), 3) if dz is not None else None)
    W = np.array(st_w)
    def narrowest(a, b):
        i0, i1 = int(a * NS), int(b * NS); j = i0 + int(np.argmin(W[i0:i1])); return [round((j + 0.5) / NS, 3), round(float(W[j]), 4)]
    rec = {'L': round(L, 1), 'largeur': st_w, 'largeur_max': round(float(W.max()), 4), 't_max': round((int(np.argmax(W)) + 0.5) / NS, 3),
           'col': narrowest(0.62, 0.92), 'taille': narrowest(0.3, 0.62),
           'depasse': {'arriere': round(float(max(0, -u.min())), 3), 'avant': round(float(max(0, u.max() - 1)), 3)},
           'frange': round(float((m.sum() - core.sum()) / max(1, cv2.arcLength(max(cv2.findContours(core.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea), True)) / L), 4),
           'ton': {'L': st_L, 'sombre': st_dk}, 'teinte': st_ab}
    if dz is not None:
        rec['relief'] = {'axe': st_z}
        for name, t0 in (('abdomen', 0.25), ('thorax', 0.62)):
            sel = (uc >= t0 - 0.04) & (uc < t0 + 0.04)
            if sel.sum() < 20: continue
            half = (np.percentile(vc[sel], 99) - np.percentile(vc[sel], 1)) / 2; mid = np.median(vc[sel])
            zc = np.median(dz[yc[sel & (np.abs(vc - mid) < 0.15 * half)], xc[sel & (np.abs(vc - mid) < 0.15 * half)]])
            ze = np.median(dz[yc[sel & (np.abs(np.abs(vc - mid) - 0.8 * half) < 0.1 * half)], xc[sel & (np.abs(np.abs(vc - mid) - 0.8 * half) < 0.1 * half)]])
            rec['relief'][name] = round(float(zc - ze), 3)
    return rec, core, dz


def panels(rgb, m, core, dz, axe, path):
    H = rgb.shape[0]
    cut = rgb.copy(); cut[~m] = (239, 233, 223)
    cm = cv2.applyColorMap(((dz if dz is not None else np.zeros(m.shape)) * 255).astype(np.uint8), cv2.COLORMAP_VIRIDIS)[..., ::-1].copy(); cm[~m] = 239
    ov = rgb.copy(); ov[m & ~core] = (ov[m & ~core] * 0.4 + np.array([255, 0, 255]) * 0.6).astype(np.uint8)
    q, t = np.array(axe[0]), np.array(axe[1])
    cv2.line(ov, tuple(int(v) for v in q), tuple(int(v) for v in t), (0, 255, 255), 2)
    for i in range(NS + 1):
        p = q + (t - q) * i / NS; cv2.circle(ov, tuple(int(v) for v in p), 3, (0, 255, 255), -1)
    im = np.concatenate([cut, cm, ov], 1)
    s = min(1.0, 2400 / im.shape[1]); im = cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    cv2.imwrite(path, im[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 85])


def run(o, rgb, m, axe, kind):
    os.makedirs(o.out, exist_ok=True)
    d = depth(rgb) if not o.nodepth else None
    rec, core, dz = measure(rgb, m, axe, d)
    rec.update({'type': kind, 'vue': o.vue, 'source': os.path.basename(o.img), 'axe': axe})
    json.dump(rec, open(os.path.join(o.out, 'forme.json'), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    cv2.imwrite(os.path.join(o.out, 'masque.png'), m.astype(np.uint8) * 255)
    if d is not None: np.save(os.path.join(o.out, 'depth.npy'), d.astype(np.float16))
    panels(rgb, m, core, dz, axe, os.path.join(o.out, 'carte.jpg'))
    print(o.out, 'L %.0f px, largeur max %.3f L à t %.2f, col %s, taille %s, frange %.3f' % (rec['L'], rec['largeur_max'], rec['t_max'], rec['col'], rec['taille'], rec['frange']),
          'relief', {k: v for k, v in rec.get('relief', {}).items() if k != 'axe'})


def cmd_photo(o):
    rgb = cv2.imread(o.img)[..., ::-1].copy()
    box = [float(v) for v in o.box.split(',')]; axe = pts(o.axe)
    # the image brought to at most --max px on its long side (RAM: nine sessions share the PC), the prompts with it
    s = min(1.0, o.max / max(rgb.shape[:2]))
    if s < 1:
        rgb = cv2.resize(rgb, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        box = [v * s for v in box]; axe = [[x * s, y * s] for x, y in axe]
    pos = [[x * s, y * s] for x, y in pts(o.pos)]; neg = [[x * s, y * s] for x, y in pts(o.neg or '')]
    mp = os.path.join(o.out, 'masque.png')
    if os.path.exists(mp) and not o.sam:
        m = cv2.imread(mp, 0) > 127
    else:
        sys.path.insert(0, HERE)
        from aile import sam_mask
        m = sam_mask(rgb, {'box': [int(v) for v in box], 'pos': pos, 'neg': neg})
    n, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    if n > 2: m = lb == (1 + np.argmax(st[1:, cv2.CC_STAT_AREA]))
    from scipy import ndimage
    m = ndimage.binary_fill_holes(m)
    # crop to the box (padded) for the depth model: it sees the insect, not the whole frame
    x0, y0, x1, y1 = box; pad = 0.08 * max(x1 - x0, y1 - y0)
    X0, Y0, X1, Y1 = int(max(0, x0 - pad)), int(max(0, y0 - pad)), int(min(rgb.shape[1], x1 + pad)), int(min(rgb.shape[0], y1 + pad))
    run(o, rgb[Y0:Y1, X0:X1].copy(), m[Y0:Y1, X0:X1], [[x - X0, y - Y0] for x, y in axe], 'photo')


def cmd_rendu(o):
    rgb = cv2.imread(o.img)[..., ::-1].copy()
    bg = np.median(np.concatenate([rgb[:4, :4].reshape(-1, 3), rgb[:4, -4:].reshape(-1, 3)]), 0)
    m = np.abs(rgb.astype(int) - bg).sum(-1) > 24
    from scipy import ndimage
    n, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    if n > 2: m = lb == (1 + np.argmax(st[1:, cv2.CC_STAT_AREA]))
    m = ndimage.binary_fill_holes(m)
    run(o, rgb, m, pts(o.axe), 'rendu')


def cmd_table(o):
    base = os.path.join(ROOT, 'refcache', o.img, 'formes')
    F = {}
    for n in sorted(os.listdir(base)):
        p = os.path.join(base, n, 'forme.json')
        if os.path.exists(p): F[n] = json.load(open(p, encoding='utf-8'))
    keys = [('largeur_max', None), ('t_max', None), ('col', 0), ('col', 1), ('taille', 0), ('taille', 1), ('frange', None),
            ('relief', 'abdomen'), ('relief', 'thorax')]
    def val(r, k):
        a, b = k; v = r.get(a)
        if v is None: return None
        if b is None: return v
        if isinstance(v, dict): return v.get(b)
        return v[b]
    out = {}
    for vue in sorted({r['vue'] for r in F.values()}):
        ph = {n: r for n, r in F.items() if r['vue'] == vue and r['type'] == 'photo'}
        rd = {n: r for n, r in F.items() if r['vue'] == vue and r['type'] == 'rendu'}
        if not ph: continue
        print('==', vue, 'photos', ', '.join(ph), '| rendus', ', '.join(rd))
        res = {}
        for k in keys:
            vals = [val(r, k) for r in ph.values() if val(r, k) is not None]
            if not vals: continue
            lo, hi = min(vals), max(vals); w = max(0.25 * (hi - lo), 0.25 * 0.1 * abs(hi + lo) / 2 + 1e-4)
            name = k[0] + ('.' + str(k[1]) if k[1] is not None else '')
            line = '  %-16s photos %.3f à %.3f' % (name, lo, hi)
            for n, r in rd.items():
                v = val(r, k)
                if v is None: continue
                ok = lo - w <= v <= hi + w
                res.setdefault(n, {})[name] = {'v': v, 'plage': [round(lo - w, 4), round(hi + w, 4)], 'ok': bool(ok)}
                line += '  | %s %.3f %s' % (n, v, 'ok' if ok else 'HORS')
            print(line)
        # the width profile, station by station, against the photos' envelope
        for n, r in rd.items():
            P = np.array([p['largeur'] for p in ph.values()]); lo, hi = P.min(0), P.max(0); w = np.maximum(0.25 * (hi - lo), 0.02)
            v = np.array(r['largeur']); hors = [i for i in range(NS) if not (lo[i] - w[i] <= v[i] <= hi[i] + w[i]) and hi[i] > 0.02]
            res.setdefault(n, {})['profil'] = {'hors': hors, 'ok': len(hors) <= 2}
            print('  profil %-10s stations hors plage : %s' % (n, hors or 'aucune'))
        out[vue] = res
    json.dump(out, open(os.path.join(base, 'verdict.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('mode'); ap.add_argument('img')
    ap.add_argument('--box'); ap.add_argument('--axe'); ap.add_argument('--pos', default=''); ap.add_argument('--neg', default='')
    ap.add_argument('--out'); ap.add_argument('--vue', default=''); ap.add_argument('--max', type=float, default=1600)
    ap.add_argument('--sam', action='store_true'); ap.add_argument('--nodepth', action='store_true')
    o = ap.parse_args()
    {'photo': cmd_photo, 'rendu': cmd_rendu, 'table': cmd_table}[o.mode](o)


if __name__ == '__main__':
    main()
