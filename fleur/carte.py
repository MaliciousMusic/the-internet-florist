"""carte.py: the map of a reference photograph of a flower, and the same map of a render, so that photo and render compare by numbers
(BONNES-PRATIQUES §16.10, §18). Runs in vases5/.venv-depth (torch on the CPU, models already downloaded: Segment Anything
facebook/sam-vit-base, Depth Anything V2 base). One heavy task at a time: the two models load one after the other.

  vases5/.venv-depth/Scripts/python fleur/carte.py photo <img> <cx,cy,r> --out <dir> [--nom n] [--vue face|tq|profil]
  vases5/.venv-depth/Scripts/python fleur/carte.py rendu <png> --out <dir> [--nom n] [--vue ...]   (the render's flat ground is the mask)
  python fleur/carte.py table <dir>... [--ref k]        side by side; with --ref the first k columns are the photos and every other
                                                         column gets a verdict per measure (inside the photos' range widened by 25 %)
  python fleur/carte.py verdict <sid>                   every map of refcache/<sid>/cartes/: the renders against the photos OF THE SAME VIEW,
                                                         measure by measure -> cartes/verdict.json (sortie.py points 8 forme and 12 lumiere)
  python fleur/carte.py fiche <sid>                     the photos' ranges per view written into the fiche (forme_mesuree): the numbers
                                                         the drawing is built to, read before drawing (sortie.py point 4)

<cx,cy,r>: the flower's centre and radius in the image's pixels (the circle that holds the whole flower, guards included).
Everything is brought to a flower radius of 256 px. L is CIE L* divided by the flower's lit level (95th centile), so exposures compare.
Measures (carte.json), r in flower radii:
  silhouette  round (std/mean of the outline radius), lobes, aspect (width/height of the mask)
  tone        dark55, dark75 (share under .55 / .75 of the lit level), hollow (under .6 of the brightest rim within 12 px: the hollows
              between petals, not the shaded side), prof / prof_dark (median L and dark55 in 10 rings of r)
  edges       edge (Canny length per area, in 1/R), ridge (thin bright lines: the lit rims), patch (mean distance to an edge, in R),
              conc (share of edge strength whose gradient is radial: rows around the centre; .5 = no order), ray (edges crossed from the
              centre outward, median of 72 rays), ring3..ring9 (edges crossed around the circles r = .3 .5 .7 .9)
  relief      from the depth map (relative, normalised inside the flower): prof_z (height per ring), rough (std of the depth minus its
              blur at .08 R: crumpling), cav (share of pixels deeper than their local plane, a blur at .15 R, by .03: pockets; cav_q90 its 90th centile), tilt (shares of normals facing
              the eye, oblique, seen edge on)
  light       l ~ a + b max(0, n.L) + c cav, fitted over the flower: the light's direction, ambient a, diffuse b, pocket darkening c, R2
  pieces      SAM prompted on a grid inside the flower, masks kept by score and overlap: their number, area quartiles (in % of the
              flower), elongation, share laid around the centre (long axis tangential), count per ring
Files in <dir>: carte.json, carte.jpg (cut-out | depth | normals | dark and pockets | pieces | edges and rims), mask.png, depth.npy,
normal.png, pieces.png (labels), crop.json (the crop's offset and scale: apparence.py reads the maps back in photo pixels).
Photo pixels stay in refcache/ (never committed)."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
N = 256                                   # flower radius after normalisation
SIDE = 768                                # the crop the models see


def lstar(bgr):
    c = bgr[..., ::-1].astype(float) / 255.; c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    y = c @ [.2126, .7152, .0722]
    return np.where(y > .008856, 116 * np.cbrt(y) - 16, 903.3 * y)


# ---------------------------------------------------------------- models (loaded once, one after the other)
_M = {}
def torch_():
    import torch
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))
    return torch


def sam():
    if 'sam' not in _M:
        from transformers import SamModel, SamProcessor
        _M['sam'] = (SamProcessor.from_pretrained('facebook/sam-vit-base'), SamModel.from_pretrained('facebook/sam-vit-base').eval())
    return _M['sam']


def depth_of(rgb):
    """relative inverse depth (bigger = nearer), Depth Anything V2 base, the image and its mirror averaged"""
    torch = torch_()
    from transformers import AutoImageProcessor, AutoModelForDepthEstimation
    from PIL import Image
    name = 'depth-anything/Depth-Anything-V2-Base-hf'
    proc = AutoImageProcessor.from_pretrained(name); model = AutoModelForDepthEstimation.from_pretrained(name).eval()
    im = Image.fromarray(rgb)
    def inf(x):
        inp = proc(images=x, return_tensors='pt', size={'height': 518, 'width': 518}, do_resize=True, keep_aspect_ratio=False)
        with torch.no_grad(): d = model(**inp).predicted_depth[0].numpy()
        return cv2.resize(d, x.size, interpolation=cv2.INTER_CUBIC)
    d = (inf(im) + inf(im.transpose(Image.FLIP_LEFT_RIGHT))[:, ::-1]) / 2
    del model; return d.astype(np.float32)


def sam_box(rgb, box, pos):
    """the flower's mask: SAM prompted by its box and points inside; the candidate with the best score that holds the centre"""
    torch = torch_(); proc, model = sam()
    inp = proc(images=rgb, input_boxes=[[box]], input_points=[[pos]], input_labels=[[[1] * len(pos)]], return_tensors='pt')
    with torch.no_grad(): o = model(**inp, multimask_output=True)
    ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = o.iou_scores[0, 0].numpy(); cx, cy = map(int, pos[0])
    k = max(range(len(sc)), key=lambda j: sc[j] + (1 if ms[j][cy, cx] else -1) + .3 * ms[j].mean())
    return ms[k]


def sam_pieces(rgb, mask, step=22, batch=48):
    """the visible pieces: SAM prompted at every grid point inside the mask; per point the part-level mask (not the whole flower), then
    the masks deduplicated (score first, overlap under .5, not mostly inside a kept one)"""
    torch = torch_(); proc, model = sam()
    inp = proc(images=rgb, return_tensors='pt')
    with torch.no_grad(): emb = model.get_image_embeddings(inp['pixel_values'])
    oh, ow = inp['original_sizes'][0].tolist(); rh, rw = inp['reshaped_input_sizes'][0].tolist(); s = rw / ow
    ys, xs = np.mgrid[step // 2:mask.shape[0]:step, step // 2:mask.shape[1]:step]; pts = [(x, y) for x, y in zip(xs.ravel(), ys.ravel()) if mask[y, x]]
    A = mask.sum(); cand = []
    for i in range(0, len(pts), batch):
        P = pts[i:i + batch]
        ip = torch.tensor([[[[x * s, y * s]] for x, y in P]], dtype=torch.float32); il = torch.ones((1, len(P), 1), dtype=torch.long)
        with torch.no_grad(): o = model(image_embeddings=emb, input_points=ip, input_labels=il, multimask_output=True)
        ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0].numpy()
        sc = o.iou_scores[0].numpy()
        for j, (x, y) in enumerate(P):
            best = None
            for k in range(ms.shape[1]):
                m = ms[j, k] & mask; a = m.sum()
                if a < A * .0015 or a > A * .2 or sc[j, k] < .8: continue
                if best is None or sc[j, k] > best[0]: best = (sc[j, k], m)
            if best: cand.append(best)
    cand.sort(key=lambda t: -t[0]); kept = []
    for scv, m in cand:
        ok = True
        for _, k in kept:
            inter = (m & k).sum()
            if inter / (m | k).sum() > .5 or inter / m.sum() > .8: ok = False; break
        if ok: kept.append((scv, m))
    lab = np.zeros(mask.shape, np.int32)
    for i, (_, m) in sorted(enumerate(kept), key=lambda t: -t[1][1].sum()): lab[m] = i + 1   # small pieces over big ones
    return lab


# ---------------------------------------------------------------- the crop and the normalised frame
def crop_photo(img, cx, cy, r):
    h, w = img.shape[:2]; m = 1.15
    x0, y0 = int(max(0, cx - m * r)), int(max(0, cy - m * r)); x1, y1 = int(min(w, cx + m * r)), int(min(h, cy + m * r))
    a = img[y0:y1, x0:x1]; s = SIDE / max(a.shape[:2]); a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    return a, {'x0': x0, 'y0': y0, 's': s}, ((cx - x0) * s, (cy - y0) * s, r * s)


def mask_render(img):
    bg = np.median(np.concatenate([img[:4, :4].reshape(-1, 3), img[:4, -4:].reshape(-1, 3)]), 0)
    m = np.abs(img.astype(int) - bg).sum(-1) > 24
    n, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8)); k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    return lb == k


def to_frame(arrs, m):
    """every map brought to the flower's frame: centre at the middle, radius N (the mask's equivalent radius)"""
    ys, xs = np.nonzero(m); cy, cx = ys.mean(), xs.mean(); R = np.sqrt(m.sum() / np.pi); s = N / R; W = int(N * 2.3)
    M = np.float32([[s, 0, W / 2 - s * cx], [0, s, W / 2 - s * cy]])
    out = []
    for a, interp in arrs:
        out.append(cv2.warpAffine(a, M, (W, W), flags=interp, borderValue=0))
    return out, (W / 2, W / 2), {'cx': float(cx), 'cy': float(cy), 'R': float(R)}


# ---------------------------------------------------------------- measures
def measure(a, m, d, lab, c):
    W = a.shape[0]; L = lstar(a); Lref = np.percentile(L[m], 95); l = np.clip(L / Lref, 0, 1.3)
    yy, xx = np.mgrid[:W, :W]; dx, dy = xx - c[0], yy - c[1]; r = np.hypot(dx, dy) / N; th = np.arctan2(dy, dx)
    inner = m & (cv2.erode(m.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0)
    o = {'Lref': round(float(Lref), 1)}
    # silhouette
    rt = []
    for t in np.linspace(-np.pi, np.pi, 180, endpoint=False):
        s = m & (np.abs(np.angle(np.exp(1j * (th - t)))) < np.pi / 180); rt.append(float(r[s].max()) if s.any() else 0)
    rt = np.array(rt); o['round'] = float(rt.std() / rt.mean())
    sm = np.convolve(np.r_[rt[-4:], rt, rt[:4]], np.ones(5) / 5, 'same')[4:-4]
    o['lobes'] = int(sum(1 for i in range(180) if sm[i] > sm[i - 1] and sm[i] >= sm[(i + 1) % 180] and sm[i] > np.median(sm)))
    ys, xs = np.nonzero(m); o['aspect'] = float((np.ptp(xs) + 1) / (np.ptp(ys) + 1))
    # tone
    o['dark55'] = float((l[m] < .55).mean()); o['dark75'] = float((l[m] < .75).mean())
    top = cv2.dilate(cv2.GaussianBlur(np.where(m, l, 0).astype(np.float32), (0, 0), 2), np.ones((25, 25), np.uint8))
    hol = inner & (l < .6 * top); o['hollow'] = float(hol.sum() / inner.sum())
    # edges
    g = cv2.GaussianBlur(l.astype(np.float32), (0, 0), 1.2); e = (cv2.Canny(np.uint8(np.clip(g * 200, 0, 255)), 18, 42) > 0) & inner
    o['edge'] = float(e.sum() / inner.sum() * N)
    rid = (g - cv2.GaussianBlur(g, (0, 0), 5) > .08) & inner; o['ridge'] = float(rid.sum() / inner.sum())
    dt = cv2.distanceTransform((~e).astype(np.uint8), cv2.DIST_L2, 3); o['patch'] = float(dt[inner].mean() / N)
    gx = cv2.Sobel(g, cv2.CV_64F, 1, 0, ksize=3); gy = cv2.Sobel(g, cv2.CV_64F, 0, 1, ksize=3); gm = np.hypot(gx, gy)
    cosr = np.abs(gx * dx + gy * dy) / (gm * np.maximum(np.hypot(dx, dy), 1) + 1e-9); sel = inner & (gm > .05)
    o['conc'] = float((gm[sel] * (cosr[sel] > .7071)).sum() / gm[sel].sum()) if sel.any() else -1
    def cross(pts):
        v = [bool(e[int(y), int(x)]) if 0 <= int(y) < W and 0 <= int(x) < W else False for x, y in pts]
        return sum(1 for i in range(1, len(v)) if v[i] and not v[i - 1])
    rays = []
    for t in np.linspace(0, 2 * np.pi, 72, endpoint=False):
        ok = [q for q in np.linspace(.08, .92, 220) if m[int(c[1] + q * N * np.sin(t)), int(c[0] + q * N * np.cos(t))]]
        rays.append(cross([(c[0] + q * N * np.cos(t), c[1] + q * N * np.sin(t)) for q in ok]))
    o['ray'] = float(np.median(rays))
    for q in (.3, .5, .7, .9):
        ts = np.linspace(0, 2 * np.pi, int(2 * np.pi * q * N * 1.5), endpoint=False)
        o['ring%d' % int(q * 10)] = cross([(c[0] + q * N * np.cos(t), c[1] + q * N * np.sin(t)) for t in ts])
    bins = np.linspace(0, 1.1, 11); pl, pd, pz = [], [], []
    # relief: depth normalised inside the flower (2-98 %), nearer = 1
    lo, hi = np.percentile(d[m], [2, 98]); z = np.clip((d - lo) / (hi - lo + 1e-9), 0, 1.2)
    zb = cv2.GaussianBlur(z.astype(np.float32), (0, 0), .08 * N); o['rough'] = float(np.std((z - zb)[inner]))
    zl = cv2.GaussianBlur(z.astype(np.float32), (0, 0), .15 * N)            # the local plane (the view's slope), taken off first
    cav = np.clip(zl - z, 0, 1); pocket = inner & (cav > .03); o['cav'] = float(pocket.sum() / inner.sum()); o['cav_q90'] = float(np.percentile(cav[inner], 90))
    zs = cv2.GaussianBlur(z.astype(np.float32), (0, 0), 2.0) * N * .9        # the relief in pixels, about as deep as the flower is wide
    ngx, ngy = np.gradient(zs); nrm = np.dstack([-ngy, ngx, np.ones_like(zs)]); nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    nz = nrm[..., 2]; o['tilt'] = [float((nz[inner] > .9).mean()), float(((nz[inner] <= .9) & (nz[inner] > .5)).mean()), float((nz[inner] <= .5).mean())]
    for i in range(10):
        s = m & (r >= bins[i]) & (r < bins[i + 1]); ok = s.sum() > 30
        pl.append(round(float(np.median(l[s])), 2) if ok else None); pd.append(round(float((l[s] < .55).mean()), 2) if ok else None)
        pz.append(round(float(np.median(z[s])), 2) if ok else None)
    o['prof'], o['prof_dark'], o['prof_z'] = pl, pd, pz
    # light: l ~ a + b max(0, n.L) + c cav over the inner flower, L searched over the upper hemisphere facing the eye
    sel = inner & (np.random.default_rng(1).random(inner.shape) < min(1, 20000 / max(1, inner.sum())))
    nn = nrm[sel]; ll = l[sel]; cc = cav[sel]; best = None
    for el in np.radians([15, 30, 45, 60, 75]):
        for az in np.radians(np.arange(0, 360, 20)):
            Ld = np.array([np.cos(el) * np.cos(az), -np.cos(el) * np.sin(az), np.sin(el)])
            X = np.stack([np.ones_like(ll), np.maximum(0, nn @ Ld), cc], 1); co, res, *_ = np.linalg.lstsq(X, ll, rcond=None)
            r2 = 1 - ((X @ co - ll) ** 2).sum() / ((ll - ll.mean()) ** 2).sum()
            if best is None or r2 > best[0]: best = (r2, Ld, co)
    o['light'] = {'dir': [round(float(x), 2) for x in best[1]], 'a': round(float(best[2][0]), 3), 'b': round(float(best[2][1]), 3),
                  'c': round(float(best[2][2]), 3), 'r2': round(float(best[0]), 3)}
    # pieces
    ids = [i for i in np.unique(lab) if i > 0]; A = m.sum(); ar, el_, tang, rr = [], [], [], []
    for i in ids:
        ys, xs = np.nonzero(lab == i)
        if len(xs) < 20: continue
        ar.append(len(xs) / A * 100); P = np.stack([xs - xs.mean(), ys - ys.mean()]); w_, v_ = np.linalg.eigh(np.cov(P))
        el_.append(float(np.sqrt(w_[1] / max(w_[0], 1e-6)))); ax = v_[:, 1]; rv = np.array([xs.mean() - c[0], ys.mean() - c[1]])
        rn = np.linalg.norm(rv); rr.append(rn / N); tang.append(abs(ax @ rv) / max(rn, 1e-6) < .5 if rn > .1 * N else None)
    o['pieces'] = {'n': len(ar), 'couvert': round(float((lab[m] > 0).mean()), 2), 'aire': [round(float(np.percentile(ar, q)), 2) for q in (25, 50, 75)] if ar else None,
                   'elong': round(float(np.median(el_)), 2) if el_ else None,
                   'tang': round(float(np.mean([t for t in tang if t is not None])), 2) if any(t is not None for t in tang) else None,
                   'par_anneau': [int(sum(1 for q in rr if lo_ <= q < lo_ + .25)) for lo_ in (0, .25, .5, .75)]}
    return o, dict(l=l, e=e, rid=rid, hol=hol, pocket=pocket, z=z, nrm=nrm)


def panels(a, m, lab, mp, path):
    W = a.shape[0]; f = lambda x: x
    cut = np.where(m[..., None], a, 255).astype(np.uint8)
    zc = cv2.applyColorMap(np.uint8(np.clip(mp['z'], 0, 1) * 255), cv2.COLORMAP_TURBO); zc[~m] = 255
    nc = np.uint8((mp['nrm'] * .5 + .5) * 255)[..., ::-1].copy(); nc[~m] = 255
    dk = np.full((W, W, 3), 255, np.uint8); dk[m] = 210; dk[m & (mp['l'] < .75)] = 150; dk[m & (mp['l'] < .55)] = 40; dk[mp['pocket']] = (40, 40, 220)
    rng = np.random.default_rng(3); pal = rng.integers(60, 250, (lab.max() + 1, 3)).astype(np.uint8); pal[0] = 235
    pc = pal[lab]; pc[~m] = 255; pc[cv2.morphologyEx((lab > 0).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3))) > 0] = 0
    for i in np.unique(lab):
        if i == 0: continue
        bd = cv2.morphologyEx((lab == i).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)) > 0; pc[bd] = 30
    ed = np.full((W, W, 3), 255, np.uint8); ed[m] = 235; ed[mp['e']] = (0, 0, 200); ed[mp['rid']] = (0, 160, 0)
    row1 = np.hstack([cut, zc, nc]); row2 = np.hstack([dk, pc, ed]); im = np.vstack([row1, row2])
    s = 1200 / im.shape[1]; cv2.imwrite(path, cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 86])


# ---------------------------------------------------------------- the table
FLAT = ['round', 'lobes', 'aspect', 'dark55', 'dark75', 'hollow', 'edge', 'ridge', 'patch', 'conc', 'ray', 'ring3', 'ring5', 'ring7', 'ring9',
        'rough', 'cav', 'cav_q90', 'tilt0', 'tilt2', 'light_a', 'light_b', 'light_c', 'n_pieces', 'couvert', 'aire_med', 'elong', 'tang', 'zc_minus_ze', 'lc_minus_le']
def flat(o):
    f = {k: o[k] for k in FLAT if k in o}
    f['tilt0'], f['tilt2'] = o['tilt'][0], o['tilt'][2]
    f['light_a'], f['light_b'], f['light_c'] = o['light']['a'], o['light']['b'], o['light']['c']
    p = o['pieces']; f['n_pieces'] = p['n']; f['couvert'] = p['couvert']; f['aire_med'] = p['aire'][1] if p['aire'] else None; f['elong'] = p['elong']; f['tang'] = p['tang']
    z = [v for v in o['prof_z'] if v is not None]; L = [v for v in o['prof'] if v is not None]
    f['zc_minus_ze'] = z[0] - np.mean(z[-3:]) if len(z) > 3 else None          # > 0: the centre stands up (dome); < 0: a hollow centre
    f['lc_minus_le'] = L[0] - np.mean(L[-3:]) if len(L) > 3 else None          # > 0: the centre is lighter than the rim
    return f


FORME = ['round', 'lobes', 'aspect', 'edge', 'patch', 'conc', 'ray', 'ring3', 'ring5', 'ring7', 'ring9', 'rough', 'tilt0', 'tilt2',
         'n_pieces', 'aire_med', 'elong', 'tang', 'zc_minus_ze']
LUMIERE = ['dark55', 'dark75', 'hollow', 'ridge', 'cav', 'cav_q90', 'light_a', 'light_b', 'light_c', 'lc_minus_le']
def ranges(F):
    """per measure: the photos' min and max, and the tolerance (the range widened by 25 % of its span and 5 % of its value)"""
    out = {}
    for k in FLAT:
        v = [f.get(k) for f in F if f.get(k) is not None]
        if not v: continue
        lo, hi = min(v), max(v); sp = hi - lo
        out[k] = dict(min=round(float(lo), 4), max=round(float(hi), 4), tol=[round(float(lo - .25 * sp - .05 * abs(lo)), 4), round(float(hi + .25 * sp + .05 * abs(hi)), 4)], n=len(v))
    return out


def all_maps(sid):
    import glob
    D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'refcache', sid, 'cartes')
    rows = []
    for p in sorted(glob.glob(os.path.join(D, '*', 'carte.json'))):
        j = json.load(open(p, encoding='utf-8')); j['_dir'] = os.path.basename(os.path.dirname(p)); rows.append(j)
    return D, rows


def verdict(sid):
    D, rows = all_maps(sid); out = {'vues': {}, 'rendus': {}}
    for vue in sorted(set(r.get('vue') or '' for r in rows)):
        ph = [flat(r) for r in rows if r.get('vue') == vue and r.get('kind') == 'photo']; rd = [r for r in rows if r.get('vue') == vue and r.get('kind') == 'rendu']
        if not ph: continue
        rg = ranges(ph); out['vues'][vue] = {'photos': len(ph), 'plages': rg}
        for r in rd:
            f = flat(r); bad = {g: [k for k in K if k in rg and f.get(k) is not None and not (rg[k]['tol'][0] <= f[k] <= rg[k]['tol'][1])] for g, K in (('forme', FORME), ('lumiere', LUMIERE))}
            out['rendus'][r['_dir']] = {'vue': vue, 'photos': len(ph), 'hors_forme': bad['forme'], 'hors_lumiere': bad['lumiere'],
                                       'valeurs': {k: f.get(k) for k in bad['forme'] + bad['lumiere']}}
    import datetime
    out['quand'] = datetime.datetime.now().isoformat(timespec='seconds')
    json.dump(out, open(os.path.join(D, 'verdict.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for n, v in out['rendus'].items():
        print('%-22s vue %-6s forme %s | lumière %s' % (n, v['vue'], 'ok' if not v['hors_forme'] else 'HORS ' + ', '.join(v['hors_forme']), 'ok' if not v['hors_lumiere'] else 'HORS ' + ', '.join(v['hors_lumiere'])))
    return out


def fiche(sid):
    D, rows = all_maps(sid); fp = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'catalogue', 'serre', 'fiches', sid + '.json')
    F = json.load(open(fp, encoding='utf-8')); fm = {'_doc': 'fleur/carte.py fiche : plages mesurées sur les photos de référence, par vue (min, max, tolérance)', 'vues': {}}
    for vue in sorted(set(r.get('vue') or '' for r in rows)):
        ph = [r for r in rows if r.get('vue') == vue and r.get('kind') == 'photo']
        if ph: fm['vues'][vue] = {'photos': [r['_dir'] for r in ph], 'plages': ranges([flat(r) for r in ph])}
    F['forme_mesuree'] = fm
    json.dump(F, open(fp, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    print('forme_mesuree écrite dans', fp, ':', ', '.join('%s (%d photos)' % (v, len(x['photos'])) for v, x in fm['vues'].items()))


def table(dirs, nref):
    rows = [json.load(open(os.path.join(d, 'carte.json'), encoding='utf-8')) for d in dirs]; F = [flat(x) for x in rows]
    head = '| mesure | ' + ' | '.join(x.get('nom', '?')[:16] for x in rows) + (' | plage photos |' if nref else ' |')
    print(head); print('|---' * (len(rows) + 1 + (1 if nref else 0)) + '|'); bad = {}
    for k in FLAT:
        vals = [f.get(k) for f in F]; cells = []
        if nref:
            ref = [v for v in vals[:nref] if v is not None]
            lo, hi = (min(ref), max(ref)) if ref else (None, None); sp = (hi - lo) if ref else 0; lo2, hi2 = (lo - .25 * sp - .05 * abs(lo), hi + .25 * sp + .05 * abs(hi)) if ref else (None, None)
        for i, v in enumerate(vals):
            t = '-' if v is None else ('%.3f' % v if isinstance(v, float) else str(v))
            if nref and i >= nref and v is not None and ref and not (lo2 <= v <= hi2): t = '**%s**' % t; bad.setdefault(rows[i].get('nom'), []).append(k)
            cells.append(t)
        print('| %s | ' % k + ' | '.join(cells) + (' | %s |' % ('-' if not ref else '%.3g..%.3g' % (lo, hi)) if nref else ' |'))
    if nref:
        for n, ks in bad.items(): print('hors plage', n, ':', ', '.join(ks))
    return bad


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('mode'); ap.add_argument('args', nargs='+'); ap.add_argument('--out'); ap.add_argument('--nom')
    ap.add_argument('--vue', default=''); ap.add_argument('--ref', type=int, default=0); ap.add_argument('--nopieces', action='store_true')
    o = ap.parse_args()
    if o.mode == 'table': table(o.args, o.ref); sys.exit()
    if o.mode == 'verdict': verdict(o.args[0]); sys.exit()
    if o.mode == 'fiche': fiche(o.args[0]); sys.exit()
    img = cv2.imread(o.args[0]); os.makedirs(o.out, exist_ok=True)
    if o.mode == 'photo':
        cx, cy, r = map(float, o.args[1].split(',')); a, crop, (ccx, ccy, rr) = crop_photo(img, cx, cy, r)
        box = [max(0, ccx - rr), max(0, ccy - rr), min(a.shape[1] - 1, ccx + rr), min(a.shape[0] - 1, ccy + rr)]
        pos = [[ccx, ccy]] + [[ccx + .45 * rr * np.cos(t), ccy + .45 * rr * np.sin(t)] for t in np.linspace(0, 2 * np.pi, 4, endpoint=False)]
        m = sam_box(a[..., ::-1].copy(), box, pos)
    else:
        a = img; s = SIDE / max(a.shape[:2]); a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA); crop = {'x0': 0, 'y0': 0, 's': s}
        m = mask_render(a)
    n_, lb = cv2.connectedComponents(m.astype(np.uint8)); ys, xs = np.nonzero(m)
    k = np.bincount(lb[m]).argmax(); m = cv2.morphologyEx((lb == k).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
    d = depth_of(a[..., ::-1].copy())
    lab = np.zeros(m.shape, np.int32) if o.nopieces else sam_pieces(a[..., ::-1].copy(), m)
    (a2, m2, d2, lab2), c, fr = to_frame([(a, cv2.INTER_AREA), (m.astype(np.uint8), cv2.INTER_NEAREST), (d, cv2.INTER_LINEAR), (lab.astype(np.float32), cv2.INTER_NEAREST)], m)
    m2 = m2 > 0; lab2 = lab2.astype(np.int32)
    res, mp = measure(a2, m2, d2, lab2, c); res['nom'] = o.nom or os.path.basename(o.args[0]); res['vue'] = o.vue; res['kind'] = o.mode; res['source'] = o.args[0].replace('\\', '/')
    json.dump(res, open(os.path.join(o.out, 'carte.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    crop.update(fr); json.dump(crop, open(os.path.join(o.out, 'crop.json'), 'w'), indent=1)
    cv2.imwrite(os.path.join(o.out, 'mask.png'), m.astype(np.uint8) * 255); np.save(os.path.join(o.out, 'depth.npy'), d)
    cv2.imwrite(os.path.join(o.out, 'normal.png'), np.uint8((mp['nrm'] * .5 + .5) * 255)[..., ::-1]); cv2.imwrite(os.path.join(o.out, 'pieces.png'), lab.astype(np.uint16))
    panels(a2, m2, lab2, mp, os.path.join(o.out, 'carte.jpg'))
    print(res['nom'], json.dumps({k: (round(v, 3) if isinstance(v, float) else v) for k, v in flat(res).items()}))
