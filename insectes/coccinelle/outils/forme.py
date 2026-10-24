"""forme.py: the shape maps of the ladybird (PROTOCOLE §2): on each measuring photo, the beetle's pieces cut out by SAM (elytra,
pronotum, head), its depth map (Depth Anything V2), and the measures of its shape in the body frame, as ratios (no scale on the
photos: the size comes from the literature). The render is measured the same way, its pieces read from the SVG's organ groups.

  vases5/.venv-depth/Scripts/python insectes/coccinelle/outils/forme.py sam <cadres.json> [photo ...]     masks (one model at a time)
  vases5/.venv-depth/Scripts/python insectes/coccinelle/outils/forme.py prof <cadres.json> [photo ...]    depth maps
  python insectes/coccinelle/outils/forme.py mesure <cadres.json> [photo ...]                           measures -> <photo>/forme.json
  python insectes/coccinelle/outils/forme.py rendu <dir> <vue> <rear x,y> <front x,y>                    the same measures on a render's
                                                                                                         masks (outils/masques.mjs)
  python insectes/coccinelle/outils/forme.py table <cadres.json> [<render dir>...]                       photos' ranges, render verdicts

<cadres.json> (insectes/coccinelle/forme/cadres.json, numbers only): per photo, its file, its view (dessus, profil, face), the body
axis (two points, px: rear then front; for a front view, bottom then top of the dome), and per piece the SAM prompts (pos, neg points,
optional box). Masks, depth and control images go to refcache/<sid>/forme/<photo>/ (photo pixels: never in git); the measures (numbers)
to insectes/coccinelle/forme/<photo>.json.

Measures (all lengths over the elytra's width W, or their length for a profile):
  dessus  L_tot (apex to the head's front), el_L, pr_L (pronotum on the midline), pr_W, pr_Wf (its width at 85 % toward the front),
          te_W (head seen), t_wmax (where the elytra are widest, from the apex), el_w (18 half-widths of the elytra, over W/2),
          pr_arc (how far the pronotum's rear edge bows back at the midline, over W), sec (the depth across the elytra at mid-length,
          9 samples normalised 0..1: the dome's section from the depth map)
  profil  el_H (height of the dome over its length), t_hmax, el_z (18 heights of the crest over the dome's height), rim (18 heights of
          the elytra's lower edge over the dome's height), pr_H (pronotum crest over the dome's height)
  face    el_HW (height of the dome over its width), n_sec (the superellipse exponent of its outline), sec (18 heights over the width)"""
import sys, os, json
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(ROOT, 'insectes', 'coccinelle', 'forme')
PARTS = ['elytres', 'pronotum', 'tete']


def load(cp):
    C = json.load(open(cp, encoding='utf-8'))
    return C, C['_sid']


def pdir(sid, name):
    d = os.path.join(ROOT, 'refcache', sid, 'forme', name); os.makedirs(d, exist_ok=True); return d


def rgb_of(sid, c):
    return cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()


# ------------------------------------------------------------------------------------------------ models
def cmd_sam(cp, only):
    import torch
    from transformers import SamModel, SamProcessor
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 4))
    proc = SamProcessor.from_pretrained('facebook/sam-vit-base'); model = SamModel.from_pretrained('facebook/sam-vit-base').eval()
    C, sid = load(cp)
    for name, c in C.items():
        if name.startswith('_') or (only and name not in only): continue
        rgb = rgb_of(sid, c); H, W = rgb.shape[:2]
        inp0 = proc(images=rgb, return_tensors='pt')
        with torch.no_grad(): emb = model.get_image_embeddings(inp0['pixel_values'])
        d = pdir(sid, name)
        for part, P in c['parts'].items():
            pos, neg = P.get('pos', []), P.get('neg', [])
            pts = pos + neg; lbl = [1] * len(pos) + [0] * len(neg)
            kw = dict(images=rgb, input_points=[[pts]], input_labels=[[lbl]], return_tensors='pt')
            if P.get('box'): kw['input_boxes'] = [[P['box']]]
            inp = proc(**kw)
            with torch.no_grad():
                o = model(image_embeddings=emb, input_points=inp['input_points'], input_labels=inp['input_labels'],
                          input_boxes=inp.get('input_boxes'), multimask_output=True)
            ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
            sc = o.iou_scores[0, 0].numpy()
            def score(k):
                m = ms[k]
                a = np.mean([m[int(y), int(x)] for x, y in pos]) if pos else 0
                b = np.mean([m[int(y), int(x)] for x, y in neg]) if neg else 0
                return sc[k] + 2 * a - 2 * b
            k = max(range(len(sc)), key=score)
            m = ms[k]
            # one piece, holes filled (a spot's highlight, a hair)
            from scipy import ndimage
            n_, lb_, st_, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
            if n_ > 2: m = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
            m = ndimage.binary_fill_holes(m)
            cv2.imwrite(os.path.join(d, part + '.png'), m.astype(np.uint8) * 255)
            print(name, part, 'score %.3f' % sc[k], '%.1f %% de l\'image' % (100 * m.mean()))
        # control: the pieces in colour over the photo
        ov = rgb.copy().astype(np.float32)
        for part, col in zip(PARTS, [(255, 210, 0), (0, 200, 255), (255, 0, 200)]):
            p = os.path.join(d, part + '.png')
            if not os.path.exists(p): continue
            m = cv2.imread(p, 0) > 127
            ov[m] = ov[m] * 0.55 + np.array(col) * 0.45
        cv2.imwrite(os.path.join(d, 'controle.jpg'), ov.astype(np.uint8)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 85])


def cmd_prof(cp, only):
    import torch
    from transformers import AutoImageProcessor, AutoModelForDepthEstimation
    from PIL import Image
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 4))
    name_ = 'depth-anything/Depth-Anything-V2-Base-hf'
    proc = AutoImageProcessor.from_pretrained(name_); model = AutoModelForDepthEstimation.from_pretrained(name_).eval()
    C, sid = load(cp)
    for name, c in C.items():
        if name.startswith('_') or (only and name not in only): continue
        rgb = rgb_of(sid, c); d = pdir(sid, name)
        # the crop around the beetle (its pieces' box, padded), so the model sees it large
        ms = [cv2.imread(os.path.join(d, p + '.png'), 0) > 127 for p in PARTS if os.path.exists(os.path.join(d, p + '.png'))]
        u = np.any(ms, 0); ys, xs = np.nonzero(u); pad = int(0.25 * max(ys.ptp(), xs.ptp()))
        y0, y1, x0, x1 = max(0, ys.min() - pad), min(u.shape[0], ys.max() + pad), max(0, xs.min() - pad), min(u.shape[1], xs.max() + pad)
        im = Image.fromarray(rgb[y0:y1, x0:x1])
        def inf(x):
            inp = proc(images=x, return_tensors='pt', size={'height': 518, 'width': 518}, do_resize=True, keep_aspect_ratio=False)
            with torch.no_grad(): dd = model(**inp).predicted_depth[0].numpy()
            return cv2.resize(dd, x.size, interpolation=cv2.INTER_CUBIC)
        dep = (inf(im) + inf(im.transpose(Image.FLIP_LEFT_RIGHT))[:, ::-1]) / 2
        full = np.zeros(u.shape, np.float32); full[y0:y1, x0:x1] = dep
        np.save(os.path.join(d, 'prof.npy'), full)
        v = dep - dep.min(); v = (255 * v / max(1e-6, v.max())).astype(np.uint8)
        cv2.imwrite(os.path.join(d, 'prof.jpg'), cv2.applyColorMap(v, cv2.COLORMAP_INFERNO))
        print(name, 'profondeur', dep.shape)


def cmd_grab(cp, only):
    """the light stand-in for SAM while the PC has no room for a model (gate: RAM): GrabCut seeded by the same prompts (pos as sure
    foreground disks, neg as sure background, the other pieces' points as background), on the photo reduced to 900 px"""
    C, sid = load(cp)
    from scipy import ndimage
    for name, c in C.items():
        if name.startswith('_') or (only and name not in only): continue
        rgb = rgb_of(sid, c); H0, W0 = rgb.shape[:2]; k = 900 / max(H0, W0); small = cv2.resize(rgb, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
        d = pdir(sid, name)
        allpos = {p: [[x * k, y * k] for x, y in P.get('pos', [])] for p, P in c['parts'].items()}
        for part, P in c['parts'].items():
            if part != 'elytres':
                dark_piece(sid, c, name, part, P, rgb, d)
                continue
            m = np.full(small.shape[:2], cv2.GC_PR_BGD, np.uint8)
            pts = np.array([q for v in allpos.values() for q in v])
            x0, y0 = pts.min(0) - 0.8 * np.ptp(pts, 0) - 30; x1, y1 = pts.max(0) + 0.8 * np.ptp(pts, 0) + 30
            m[:] = cv2.GC_BGD; m[int(max(0, y0)):int(y1), int(max(0, x0)):int(x1)] = cv2.GC_PR_BGD
            # the piece's own colour around its points: probable foreground
            lab = cv2.cvtColor(small, cv2.COLOR_RGB2LAB).astype(float)
            ref = np.array([lab[int(y), int(x)] for x, y in allpos[part]])
            dist = np.min(np.linalg.norm(lab[:, :, None, :] - ref[None, None], axis=3), 2)
            m[(dist < 22) & (m == cv2.GC_PR_BGD)] = cv2.GC_PR_FGD
            r = max(3, int(0.012 * max(small.shape)))
            for x, y in allpos[part]: cv2.circle(m, (int(x), int(y)), r, cv2.GC_FGD, -1)
            for x, y in P.get('neg', []): cv2.circle(m, (int(x * k), int(y * k)), r, cv2.GC_BGD, -1)
            for q, v in allpos.items():
                if q != part:
                    for x, y in v: cv2.circle(m, (int(x), int(y)), r, cv2.GC_BGD, -1)
            bg, fg = np.zeros((1, 65)), np.zeros((1, 65))
            cv2.grabCut(small[..., ::-1].copy(), m, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
            mm = (m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)
            # the elytra are red: GrabCut's region kept where the colour is a red or an orange (hue -30 to 80 deg, chroma over 22),
            # then closed over the spots (the margin's spots open onto the edge) and filled
            h = np.degrees(np.arctan2(lab[..., 2] - 128, lab[..., 1] - 128)); ch = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
            red = (ch > 22) & (h > -30) & (h < 80)
            kc = max(5, int(0.03 * max(small.shape)) | 1)
            mm = cv2.morphologyEx((mm & red).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kc, kc))) > 0
            ko = 5 if part == 'elytres' else max(5, int(0.022 * max(small.shape)) | 1)   # the thin legs cut off a dark piece
            mm = cv2.morphologyEx(mm.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ko, ko))) > 0
            n_, lb_, st_, _ = cv2.connectedComponentsWithStats(mm.astype(np.uint8))
            if n_ > 2: mm = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
            mm = ndimage.binary_fill_holes(mm)
            full = cv2.resize(mm.astype(np.uint8) * 255, (W0, H0), interpolation=cv2.INTER_LINEAR) > 127
            if P.get('coupe'):
                (ax, ay), (bx, by) = P['coupe']; YY, XX = np.mgrid[:H0, :W0]
                sd = lambda x, y: (bx - ax) * (y - ay) - (by - ay) * (x - ax)
                full &= np.sign(sd(XX, YY)) == np.sign(sd(*P['pos'][0]))
            cv2.imwrite(os.path.join(d, part + '.png'), full.astype(np.uint8) * 255)
            print(name, part, 'grabcut %.1f %%' % (100 * full.mean()))
        ov = rgb.copy().astype(np.float32)
        for part, col in zip(PARTS, [(255, 210, 0), (0, 200, 255), (255, 0, 200)]):
            p = os.path.join(d, part + '.png')
            if os.path.exists(p): mk = cv2.imread(p, 0) > 127; ov[mk] = ov[mk] * 0.55 + np.array(col) * 0.45
        cv2.imwrite(os.path.join(d, 'controle.jpg'), cv2.resize(ov.astype(np.uint8), None, fx=k, fy=k)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 85])


def dark_piece(sid, c, name, part, P, rgb, d):
    """a black piece (pronotum, head) and its white patches: the dark (L* under 32) or cream-white (L* over 55, chroma under 30, not red) pixels
    joined to the piece's points, outside the elytra's convex hull (the scutellar spot is on the elytra), its legs opened off, cut
    from its neighbour by the line P['coupe'] when given (the head under the pronotum's front edge, read on the grid)"""
    from scipy import ndimage
    lab = cv2.cvtColor(cv2.GaussianBlur(rgb, (0, 0), 1.5), cv2.COLOR_RGB2LAB).astype(np.float32)
    L = lab[..., 0] * 100 / 255; Cc = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
    m = (L < P.get('L', 32)) | ((L > 55) & (Cc < 30) & (lab[..., 1] - 128 < 15))   # black, or the cream of its patches (c370: L* 68, C 19)
    e = os.path.join(d, 'elytres.png')
    if os.path.exists(e):
        el = cv2.imread(e, 0) > 127; ys, xs = np.nonzero(el)
        hull = np.zeros(el.shape, np.uint8); cv2.fillPoly(hull, [cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32))], 1)
        m &= hull == 0
    if P.get('boite'):
        x0, y0, x1, y1 = P['boite']; bm = np.zeros_like(m); bm[y0:y1, x0:x1] = True; m &= bm
    if P.get('coupe'):
        (ax, ay), (bx, by) = P['coupe']; YY, XX = np.mgrid[:m.shape[0], :m.shape[1]]
        side = lambda x, y: (bx - ax) * (y - ay) - (by - ay) * (x - ax)
        s0 = np.sign(side(*P['pos'][0])); m &= np.sign(side(XX, YY)) == s0
    sz = max(m.shape); ko = max(5, int(P.get('ouv', 0.012) * sz) | 1)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ko, ko))) > 0
    n_, lb_, _, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    keep = {lb_[int(y), int(x)] for x, y in P['pos']} - {0}
    m = np.isin(lb_, list(keep)) if keep else np.zeros_like(m)
    m = ndimage.binary_fill_holes(m)
    cv2.imwrite(os.path.join(d, part + '.png'), m.astype(np.uint8) * 255)
    print(name, part, 'couleur %.1f %%' % (100 * m.mean()))


# ------------------------------------------------------------------------------------------------ measures
def frame_of(axe):
    a, b = np.array(axe[0], float), np.array(axe[1], float)
    ex = (b - a) / np.linalg.norm(b - a)          # rear -> front (or bottom -> top for a face view)
    ey = np.array([-ex[1], ex[0]])                # across
    return a, ex, ey


def coords(m, a, ex, ey):
    ys, xs = np.nonzero(m); P = np.stack([xs, ys], 1).astype(float) - a
    return P @ ex, P @ ey


def stations(x, y, x0, x1, n, fn):
    """per station along x (n of them between x0 and x1), fn of the across coordinates there (over a band of the station's width)"""
    out = []; h = (x1 - x0) / n
    for i in range(n):
        s0 = x0 + i * h; sel = (x >= s0) & (x < s0 + h)
        out.append(fn(y[sel]) if sel.sum() > 3 else None)
    return out


def r3(v):
    return None if v is None else round(float(v), 3)


def measure(view, M, a, ex, ey, dep=None):
    res = {}
    el = M.get('elytres'); pr = M.get('pronotum'); te = M.get('tete')
    xe, ye = coords(el, a, ex, ey)
    if view == 'dessus':
        x0, x1 = xe.min(), xe.max(); Le = x1 - x0
        hw = stations(xe, ye, x0, x1, 18, lambda y: (y.max() - y.min()) / 2)
        W = 2 * max(h for h in hw if h is not None)
        allx = [xe]
        if pr is not None:
            xp, yp = coords(pr, a, ex, ey); allx.append(xp)
            mid = np.abs(yp - np.median(ye)) < 0.06 * W
            res['pr_L'] = r3((xp[mid].max() - xp[mid].min()) / W)
            pw = stations(xp, yp, xp.min(), xp.max(), 20, lambda y: y.max() - y.min())
            res['pr_W'] = r3(max(w for w in pw if w is not None) / W)
            res['pr_Wf'] = r3(pw[17] / W if pw[17] else None)
            # the rear edge of the pronotum: at the midline against its sides (at 70 % of its half-width)
            side = (np.abs(yp - np.median(ye)) > 0.3 * res['pr_W'] * W) & (np.abs(yp - np.median(ye)) < 0.36 * res['pr_W'] * W)
            res['pr_arc'] = r3((xp[side].min() - xp[mid].min()) / W) if side.sum() > 3 else None
        if te is not None:
            xt, yt = coords(te, a, ex, ey); allx.append(xt)
            res['te_W'] = r3((np.percentile(yt, 99) - np.percentile(yt, 1)) / W)
        X = np.concatenate(allx)
        res.update({'L_tot': r3((X.max() - X.min()) / W), 'el_L': r3(Le / W),
                    't_wmax': r3((np.argmax([h or 0 for h in hw]) + 0.5) / 18), 'el_w': [r3(h / (W / 2)) if h else None for h in hw]})
        if dep is not None:
            # the depth across the elytra at mid-length (the dome's section), 9 samples from edge to edge
            xm = x0 + 0.5 * Le; band = (np.abs(xe - xm) < 0.04 * Le)
            yy = ye[band]; ys_, xs_ = np.nonzero(el); P = np.stack([xs_, ys_], 1)[band]
            dv = dep[P[:, 1], P[:, 0]]; yl, yr = yy.min(), yy.max(); sec = []
            for i in range(9):
                s0 = yl + (yr - yl) * i / 9; s1 = s0 + (yr - yl) / 9; k = (yy >= s0) & (yy < s1)
                sec.append(float(np.median(dv[k])) if k.sum() else None)
            v = np.array([s for s in sec if s is not None]); lo, hi = v.min(), v.max()
            res['sec'] = [r3((s - lo) / (hi - lo)) if s is not None else None for s in sec]
    elif view == 'profil':
        # x along the ground (rear -> front), y up: the image's y is down, so the across axis is flipped to point up
        if np.median(ye) < 0: ye = -ye
        x0, x1 = xe.min(), xe.max(); Le = x1 - x0
        top = stations(xe, ye, x0, x1, 18, lambda y: y.max()); bot = stations(xe, ye, x0, x1, 18, lambda y: y.min())
        base = np.percentile([b for b in bot if b is not None], 10); H = max(t for t in top if t is not None) - base
        res.update({'el_H': r3(H / Le), 't_hmax': r3((np.argmax([t or -1e9 for t in top]) + 0.5) / 18),
                    'el_z': [r3((t - base) / H) if t is not None else None for t in top],
                    'rim': [r3((b - base) / H) if b is not None else None for b in bot]})
        if pr is not None:
            xp, yp = coords(pr, a, ex, ey)
            if np.median(yp) < 0 or (yp.max() < 0): yp = -yp
            res['pr_H'] = r3((yp.max() - base) / H)
            res['pr_L'] = r3((xp.max() - xp.min()) / Le)
    elif view == 'face':
        # x up the dome (bottom -> top), y across: the outline's height at 18 stations across, over the width
        y0, y1 = ye.min(), ye.max(); Wd = y1 - y0
        hh = stations(ye, xe, y0, y1, 18, lambda x: x.max())
        base = np.percentile(xe, 2); H = max(h for h in hh if h is not None) - base
        res['el_HW'] = r3(H / Wd)
        sec = [(h - base) / H if h is not None else None for h in hh]; res['sec'] = [r3(s) for s in sec]
        # superellipse exponent: |u|^n + |v|^n = 1 fitted on the outline (u across in -1..1, v up in 0..1)
        u = np.array([-1 + (i + 0.5) * 2 / 18 for i in range(18)]); v = np.array([s if s is not None else np.nan for s in sec])
        best = min((np.nanmean((np.clip(1 - np.abs(u) ** n, 0, 1) ** (1 / n) - v) ** 2), n) for n in np.arange(1.5, 5.01, 0.05))
        res['n_sec'] = round(float(best[1]), 2)
    return res


def masks_of(d):
    M = {}
    for p in PARTS:
        f = os.path.join(d, p + '.png')
        if os.path.exists(f): M[p] = cv2.imread(f, 0) > 127
    return M


def cmd_mesure(cp, only):
    C, sid = load(cp); os.makedirs(OUT, exist_ok=True)
    for name, c in C.items():
        if name.startswith('_') or (only and name not in only): continue
        d = pdir(sid, name); M = masks_of(d)
        dep = np.load(os.path.join(d, 'prof.npy')) if os.path.exists(os.path.join(d, 'prof.npy')) else None
        a, ex, ey = frame_of(c['axe'])
        res = {'_doc': 'forme.py : mesures de forme sur %s (vue %s), des rapports, jamais l\'image' % (c['photo'], c['vue']), 'vue': c['vue'], **measure(c['vue'], M, a, ex, ey, dep)}
        json.dump(res, open(os.path.join(OUT, name + '.json'), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
        print(name, {k: v for k, v in res.items() if not isinstance(v, list) and not k.startswith('_')})


def cmd_rendu(d, view, rear, front):
    M = masks_of(d); a, ex, ey = frame_of([rear, front])
    res = {'vue': view, **measure(view, M, a, ex, ey, np.load(os.path.join(d, 'prof.npy')) if os.path.exists(os.path.join(d, 'prof.npy')) else None)}
    json.dump(res, open(os.path.join(d, 'forme.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(json.dumps({k: v for k, v in res.items() if not isinstance(v, list)}, ensure_ascii=False))


def cmd_table(cp, renders):
    C, sid = load(cp)
    by = {}
    for name, c in C.items():
        if name.startswith('_'): continue
        f = os.path.join(OUT, name + '.json')
        if os.path.exists(f): by.setdefault(c['vue'], {})[name] = json.load(open(f, encoding='utf-8'))
    out = {}
    for view, P in by.items():
        keys = sorted({k for r in P.values() for k, v in r.items() if isinstance(v, (int, float)) and k != 'vue'})
        print('==', view, ' '.join(P))
        R = {}
        for k in keys:
            vals = [r[k] for r in P.values() if isinstance(r.get(k), (int, float))]
            lo, hi = min(vals), max(vals); w = max(hi - lo, 0.02 * max(abs(hi), 1e-3)); R[k] = [round(lo - 0.25 * w, 3), round(hi + 0.25 * w, 3)]
            line = '%-8s photos %s  plage %s' % (k, ' '.join('%.3f' % v for v in vals), R[k])
            for rd in renders:
                f = os.path.join(rd, 'forme.json')
                if not os.path.exists(f): continue
                r = json.load(open(f, encoding='utf-8'))
                if r.get('vue') != view or not isinstance(r.get(k), (int, float)): continue
                ok = R[k][0] <= r[k] <= R[k][1]
                line += '  | %s %.3f %s' % (os.path.basename(rd.rstrip('/\\')), r[k], 'ok' if ok else 'HORS')
            print(line)
        out[view] = R
    json.dump(out, open(os.path.join(OUT, 'plages.json'), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'sam': cmd_sam(a[1], a[2:])
    elif a[0] == 'grab': cmd_grab(a[1], a[2:])
    elif a[0] == 'prof': cmd_prof(a[1], a[2:])
    elif a[0] == 'mesure': cmd_mesure(a[1], a[2:])
    elif a[0] == 'rendu': cmd_rendu(a[1], a[2], [float(v) for v in a[3].split(',')], [float(v) for v in a[4].split(',')])
    elif a[0] == 'table': cmd_table(a[1], a[2:])
