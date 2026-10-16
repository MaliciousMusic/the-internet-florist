# The vase's silhouette in its reference photograph by Segment Anything (facebook/sam-vit-base, already downloaded), prompted
# with a box around the vase and optional points inside (+) or outside (-): the mask glbkit fit poses the GLB on.
#   .venv-depth/Scripts/python photomask.py <vase> x0 y0 x1 y1 [+x,y ...] [-x,y ...]   -> <vase>/out/mask.png, mask_check.jpg
import sys, os
import numpy as np, cv2, torch
from transformers import SamModel, SamProcessor

HERE = os.path.dirname(os.path.abspath(__file__))
vase = sys.argv[1]
x0, y0, x1, y1 = map(float, sys.argv[2:6])
pts = [(tuple(map(float, a[1:].split(','))), 1 if a[0] == '+' else 0) for a in sys.argv[6:]]
out = os.path.join(HERE, vase, 'out')
im = cv2.imread(os.path.join(out, 'ref.jpg'))
proc = SamProcessor.from_pretrained('facebook/sam-vit-base')
model = SamModel.from_pretrained('facebook/sam-vit-base').eval()
rgb = im[..., ::-1].copy()
kw = dict(input_boxes=[[[x0, y0, x1, y1]]])
if pts:
    kw['input_points'] = [[[list(p) for p, _ in pts]]]
    kw['input_labels'] = [[[l for _, l in pts]]]
inp = proc(rgb, return_tensors='pt', **kw)
with torch.no_grad():
    o = model(**inp, multimask_output=True)
masks = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
sc = o.iou_scores[0, 0].numpy()
# the largest of the confident masks: SAM's best-scored one is often a part (the body without its decor)
order = np.argsort(-sc)
cand = [i for i in order if sc[i] > sc[order[0]] - .06]
i = max(cand, key=lambda j: masks[j].sum())
m = masks[i].astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
n, lb, st, _ = cv2.connectedComponentsWithStats(m)
if n > 1:
    m = (lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
cv2.imwrite(os.path.join(out, 'mask.png'), m * 255)
v = im.copy(); v[m == 0] = (v[m == 0] * .3 + np.array([255, 0, 255]) * .7).astype(np.uint8)
cv2.drawContours(v, cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], -1, (0, 255, 0), 2)
s = 700 / max(im.shape[:2])
cv2.imwrite(os.path.join(out, 'mask_check.jpg'), cv2.resize(v, None, fx=s, fy=s, interpolation=cv2.INTER_AREA))
print(vase, 'scores', np.round(sc, 3), 'kept', i, 'pixels', int(m.sum()))
