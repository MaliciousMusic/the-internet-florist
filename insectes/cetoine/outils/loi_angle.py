"""loi_angle.py: the angle law of the rose chafer's structural green (porteur 2026-10-23: « ce n'est pas un aplat »). On each photo
the surface's angle to the eye is read from its depth map (cartes.py), and the cuticle's colour is measured per angle bin: hue, chroma
and lightness against theta = acos(n.v), the angle between the surface normal and the line of sight.

  python insectes/cetoine/outils/loi_angle.py <out.json> c114 c105 ... [--ouvrir 22] [--bord 0.15]

The depth of Depth Anything is relative: its scale is set on the photo itself, so that the normals of the outer band of the
silhouette (2 % of the mask's width) stand at n.v = --bord (a convex body is seen edge on at its outline). The thin legs and
antennae are taken off by an opening of --ouvrir px (crop pixels). The white flecks (L* > 75, C* < 18) and the dark pits (L* under
the 3 px median by 12) are left out. Per bin of 6 degrees: the median Lab, its 25-75 % spread, the share of pixels.
Writes <out.json> (numbers only) and refcache/cetonia-aurata/cartes/loi-angle.jpg (the curves of every photo, and per photo its
crop coloured by theta)."""
import sys, os, json
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
REF = os.path.join(ROOT, 'refcache', 'cetonia-aurata')


def lab_of(bgr):
    return cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def normals(z, m, bord, ouvrir):
    """normals of the depth map, its scale set by the outline band"""
    zz = cv2.GaussianBlur(z, (0, 0), 2.0)
    dist = cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5)
    W = 2 * dist.max()
    gy, gx = np.gradient(zz)
    band = m & (dist > 1) & (dist < max(3, 0.02 * W))
    g = np.hypot(gx, gy)
    # n.v = 1 / sqrt(1 + (k g)^2): k so that the band's median reaches `bord`
    gb = np.median(g[band]) + 1e-9
    k = np.sqrt(1 / bord ** 2 - 1) / gb
    nv = 1 / np.sqrt(1 + (k * g) ** 2)
    return nv, k, dist


def law(nom, bord, ouvrir):
    d = os.path.join(REF, 'cartes', nom)
    cr = json.load(open(os.path.join(d, 'crop.json')))
    m = cv2.imread(os.path.join(d, 'mask.png'), 0) > 127
    z = np.load(os.path.join(d, 'depth.npy'))
    img = cv2.imread(os.path.join(REF, 'hd', nom + '.jpg'))
    X0, Y0, s = cr['x0'], cr['y0'], cr['s']
    crop = img[Y0:Y0 + int(round(m.shape[0] / s)), X0:X0 + int(round(m.shape[1] / s))]
    crop = cv2.resize(crop, (m.shape[1], m.shape[0]), interpolation=cv2.INTER_AREA)
    body = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * ouvrir + 1,) * 2)) > 0
    n, lb, st, _ = cv2.connectedComponentsWithStats(body.astype(np.uint8)); body = lb == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    nv, k, dist = normals(z, body, bord, ouvrir)
    lab = lab_of(crop)
    L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    med = cv2.medianBlur((L * 2.55).astype(np.uint8), 5).astype(np.float32) / 2.55
    keep = body & ~((L > 75) & (C < 18)) & (L > med - 12) & (dist > 2)
    th = np.degrees(np.arccos(np.clip(nv, 0, 1)))
    rows = []
    for a0 in range(0, 84, 6):
        sel = keep & (th >= a0) & (th < a0 + 6)
        if sel.sum() < 80: continue
        v = lab[sel]
        q = np.percentile(v, [25, 50, 75], axis=0)
        h = (np.degrees(np.arctan2(q[1, 2], q[1, 1])) + 360) % 360
        rows.append({'theta': a0 + 3, 'n': int(sel.sum()), 'part': round(float(sel.sum() / keep.sum()), 4),
                     'lab': [round(float(x), 1) for x in q[1]], 'q25': [round(float(x), 1) for x in q[0]], 'q75': [round(float(x), 1) for x in q[2]],
                     'C': round(float(np.hypot(q[1, 1], q[1, 2])), 1), 'h': round(float(h), 1), 'hex': hexof(q[1])})
    return {'photo': nom, 'echelle_relief': float(k), 'bins': rows}, (crop, th, keep)


def main():
    a = sys.argv[1:]
    out = a[0]; ouvrir = int(a[a.index('--ouvrir') + 1]) if '--ouvrir' in a else 22
    bord = float(a[a.index('--bord') + 1]) if '--bord' in a else 0.15
    noms = [x for x in a[1:] if x.startswith('c') and x[1:].isdigit()]
    res, vis = [], []
    for nm in noms:
        r, v = law(nm, bord, ouvrir); res.append(r); vis.append((nm, v))
        print(nm, ' '.join('%d°:L%.0f h%.0f C%.0f' % (b['theta'], b['lab'][0], b['h'], b['C']) for b in r['bins']))
    json.dump({'_doc': 'loi_angle.py : couleur de la cuticule par angle à l\'oeil (theta, degrés), Lab médian par photo. Des chiffres, jamais l\'image.',
               'bord': bord, 'ouvrir': ouvrir, 'photos': res}, open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    # the control: per photo the crop | theta in false colour | the swatches per bin
    tiles = []
    for nm, (crop, th, keep) in vis:
        H = 300; s = H / crop.shape[0]
        c1 = cv2.resize(crop, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        tv = (np.clip(th / 90, 0, 1) * 255).astype(np.uint8); tv = cv2.applyColorMap(tv, cv2.COLORMAP_TURBO); tv[~keep] = 40
        c2 = cv2.resize(tv, (c1.shape[1], c1.shape[0]), interpolation=cv2.INTER_NEAREST)
        r = next(x for x in res if x['photo'] == nm)
        sw = np.full((H, 15 * 30, 3), 235, np.uint8)
        for b in r['bins']:
            j = b['theta'] // 6
            h = b['hex']; col = (int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16))
            sw[40:H - 40, j * 30:j * 30 + 28] = col
            cv2.putText(sw, str(b['theta']), (j * 30 + 2, H - 22), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (60, 60, 60), 1)
        cv2.putText(sw, nm, (4, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (40, 40, 40), 1)
        row = np.concatenate([c1, np.full((H, 6, 3), 235, np.uint8), c2, np.full((H, 6, 3), 235, np.uint8), sw], 1)
        tiles.append(row)
    Wm = max(t.shape[1] for t in tiles)
    tiles = [np.pad(t, ((0, 6), (0, Wm - t.shape[1]), (0, 0)), constant_values=235) for t in tiles]
    cv2.imwrite(os.path.join(REF, 'cartes', 'loi-angle.jpg'), np.concatenate(tiles, 0), [cv2.IMWRITE_JPEG_QUALITY, 88])


if __name__ == '__main__':
    main()
