# Draws the traced parts over the enhanced reference (outlines + names), whole image or a zoomed window.
# usage: python overlay.py [fig,...|all] [x0 y0 w h scale name]
import sys, numpy as np, cv2, importlib
sys.path.insert(0, '.')
import trace as T
importlib.reload(T)
en = cv2.imread('out/clahe.jpg')
figs = sys.argv[1].split(',') if len(sys.argv) > 1 and sys.argv[1] != 'all' else None
COL = [(0, 0, 255), (0, 200, 0), (255, 0, 0), (0, 200, 255), (255, 0, 255), (255, 255, 0), (0, 128, 255), (128, 0, 255)]
win = list(map(float, sys.argv[2:7])) if len(sys.argv) > 6 else [0, 0, en.shape[1], en.shape[0], 1.0]
x0, y0, w, h, s = win
name = sys.argv[7] if len(sys.argv) > 7 else 'all'
c = en[int(y0):int(y0 + h), int(x0):int(x0 + w)].copy()
c = cv2.resize(c, (int(w * s), int(h * s)), interpolation=cv2.INTER_CUBIC)
c = (c * .8).astype(np.uint8)
def P(p): return (int((p[0] - x0) * s), int((p[1] - y0) * s))
k = 0
for part in T.PARTS:
    if figs and part['fig'] not in figs: continue
    col = COL[k % len(COL)]; k += 1
    if 'axis' in part:
        A = [tuple(a[:3]) for a in part['axis']]
        cv2.polylines(c, [np.array([P(a[:2]) for a in A], np.int32)], False, col, 1, cv2.LINE_AA)
        for a in A:
            cv2.circle(c, P(a[:2]), max(1, int(a[2] * s)), col, 1, cv2.LINE_AA)
        cv2.putText(c, part['fig'] + '.' + part['name'], P(A[0][:2]), cv2.FONT_HERSHEY_SIMPLEX, .35, col, 1)
        continue
    if 'blob' in part:
        cx, cy, rx, ry, a, z = part['blob']
        cv2.ellipse(c, P((cx, cy)), (int(rx * s), int(ry * s)), a, 0, 360, col, 1, cv2.LINE_AA)
        cv2.putText(c, part['fig'] + '.' + part['name'], P((cx - 15, cy)), cv2.FONT_HERSHEY_SIMPLEX, .35, col, 1)
        continue
    pts = T.smooth(part['pts'])
    cv2.polylines(c, [np.array([P(p) for p in pts], np.int32)], True, col, 1, cv2.LINE_AA)
    for p in part['pts']: cv2.circle(c, P(p), 2, col, -1)
    cx = np.mean([p[0] for p in part['pts']]); cy = np.mean([p[1] for p in part['pts']])
    cv2.putText(c, part['fig'] + '.' + part['name'], P((cx - 15, cy)), cv2.FONT_HERSHEY_SIMPLEX, .35, col, 1)
for g in T.LINES:
    if figs and g['fig'] not in figs: continue
    cv2.polylines(c, [np.array([P(p) for p in g['pts']], np.int32)], False, (0, 255, 255), 1, cv2.LINE_AA)
for b in T.BUMPS:
    if figs and b['fig'] not in figs: continue
    cv2.ellipse(c, P((b['x'], b['y'])), (int(b['rx'] * s), int(b['ry'] * s)), b.get('a', 0), 0, 360, (255, 255, 255), 1, cv2.LINE_AA)
# grid labels every 50
for x in range(int(x0 // 50 + 1) * 50, int(x0 + w), 50):
    cv2.putText(c, str(x), (int((x - x0) * s) + 1, 10), cv2.FONT_HERSHEY_SIMPLEX, .3, (200, 200, 200), 1)
    cv2.line(c, (int((x - x0) * s), 0), (int((x - x0) * s), 5), (200, 200, 200), 1)
for y in range(int(y0 // 50 + 1) * 50, int(y0 + h), 50):
    cv2.putText(c, str(y), (1, int((y - y0) * s) - 1), cv2.FONT_HERSHEY_SIMPLEX, .3, (200, 200, 200), 1)
    cv2.line(c, (0, int((y - y0) * s)), (5, int((y - y0) * s)), (200, 200, 200), 1)
cv2.imwrite(f'out/ov_{name}.jpg', c, [cv2.IMWRITE_JPEG_QUALITY, 90])
print('ok', f'out/ov_{name}.jpg')
