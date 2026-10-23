"""cartes.py: the shape maps of the rose chafer's photos (PROTOCOLE §2), in one pass so that each model loads once: the beetle's
mask by SAM (box and points), then its depth by Depth Anything V2 (the crop and its mirror averaged), and the normals.
Runs in vases5/.venv-depth, through the gate (one model at a time on the PC):

  GATE_MAX=1 sh ws/gate.sh vases5/.venv-depth/Scripts/python insectes/cetoine/outils/cartes.py insectes/cetoine/outils/cartes.json [--only c105,c114]

cartes.json: [{"nom": "c105", "box": [x0,y0,x1,y1], "pos": [[x,y],...], "neg": [[x,y],...], "depth": true}]
Writes refcache/cetonia-aurata/cartes/<nom>/ (photo pixels: never in git): crop.json (offset and scale of the crop), mask.png,
depth.npy (relative inverse depth, bigger is nearer, in crop pixels), vis.jpg (crop | mask | depth). The normals are taken from the
depth later, once its scale is set by a measured height (loi_angle.py)."""
import sys, os, json
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'fleur'))
import carte  # noqa: E402  (sam(), depth_of(), torch_())

REF = os.path.join(ROOT, 'refcache', 'cetonia-aurata')
SIDE = 1024          # longest side of the crop the models see


def crop(img, box, pad=0.06):
    h, w = img.shape[:2]; x0, y0, x1, y1 = box; px = int((x1 - x0) * pad); py = int((y1 - y0) * pad)
    X0, Y0, X1, Y1 = max(0, x0 - px), max(0, y0 - py), min(w, x1 + px), min(h, y1 + py)
    a = img[Y0:Y1, X0:X1]; s = min(1.0, SIDE / max(a.shape[:2]))
    return cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), {'x0': X0, 'y0': Y0, 's': s}


def sam_mask(rgb, box, pos, neg):
    torch = carte.torch_(); proc, model = carte.sam()
    pts = pos + neg; lab = [1] * len(pos) + [0] * len(neg)
    inp = proc(images=rgb, input_boxes=[[box]], input_points=[[pts]], input_labels=[[lab]], return_tensors='pt')
    with torch.no_grad(): o = model(**inp, multimask_output=True)
    ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = o.iou_scores[0, 0].numpy(); cx, cy = map(int, pos[0])
    k = max(range(len(sc)), key=lambda j: sc[j] + (1 if ms[j][cy, cx] else -1) + .3 * ms[j].mean())
    m = ms[k].astype(np.uint8)
    # the largest piece, holes filled
    n, lb, st, _ = cv2.connectedComponentsWithStats(m); k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    m = (lb == k).astype(np.uint8)
    ff = m.copy(); hh, ww = m.shape; fm = np.zeros((hh + 2, ww + 2), np.uint8); cv2.floodFill(ff, fm, (0, 0), 1)
    return (m | (1 - ff)).astype(bool)


def main():
    a = sys.argv[1:]
    cfg = json.load(open(a[0], encoding='utf-8'))
    only = a[a.index('--only') + 1].split(',') if '--only' in a else None
    todo = [c for c in cfg if not only or c['nom'] in only]
    out = {}
    # SAM first, for every photo, then free it; then the depth
    for c in todo:
        img = cv2.imread(os.path.join(REF, 'hd', c['nom'] + '.jpg'))[..., ::-1].copy()
        rgb, cr = crop(img, c['box'])
        tr = lambda p: [(p[0] - cr['x0']) * cr['s'], (p[1] - cr['y0']) * cr['s']]
        box = [*tr(c['box'][:2]), *tr(c['box'][2:])]
        m = sam_mask(rgb, box, [tr(p) for p in c['pos']], [tr(p) for p in c.get('neg', [])])
        d = os.path.join(REF, 'cartes', c['nom']); os.makedirs(d, exist_ok=True)
        cv2.imwrite(os.path.join(d, 'mask.png'), m.astype(np.uint8) * 255)
        json.dump({**cr, 'box': c['box'], 'w': rgb.shape[1], 'h': rgb.shape[0]}, open(os.path.join(d, 'crop.json'), 'w'))
        out[c['nom']] = (rgb, m, d)
        print('sam', c['nom'], rgb.shape[:2], 'masque %.0f %%' % (100 * m.mean()), flush=True)
    carte._M.clear()
    for c in todo:
        if not c.get('depth', True): continue
        rgb, m, d = out[c['nom']]
        z = carte.depth_of(rgb)
        np.save(os.path.join(d, 'depth.npy'), z.astype(np.float32))
        zz = z.copy(); zz[~m] = np.nan; lo, hi = np.nanpercentile(zz, 1), np.nanpercentile(zz, 99)
        dv = (np.clip((z - lo) / (hi - lo + 1e-6), 0, 1) * 255).astype(np.uint8); dv = cv2.applyColorMap(dv, cv2.COLORMAP_VIRIDIS); dv[~m] = 30
        mv = rgb[..., ::-1].copy(); mv[~m] = (mv[~m] * 0.25).astype(np.uint8)
        vis = np.concatenate([rgb[..., ::-1], mv, dv], 1)
        s = 1500 / vis.shape[1]; cv2.imwrite(os.path.join(d, 'vis.jpg'), cv2.resize(vis, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 85])
        print('profondeur', c['nom'], flush=True)


if __name__ == '__main__':
    main()
