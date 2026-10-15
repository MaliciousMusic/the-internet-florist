#!/bin/sh
# prev.sh <name> [mk2 key=value ...]: colour field preview (no browser) next to the reference -> out/pv_<name>.jpg
N=$1; shift
python mk2.py photo "$@" | tail -1 && python - "$N" <<'PY'
import sys, cv2, numpy as np
a = cv2.imread('out/ref.jpg'); b = cv2.imread('out/prev_photo.png'); b = cv2.resize(b, (1200, 1435), interpolation=cv2.INTER_LINEAR)
h = 480; w = int(1200 * h / 1435)
f = np.hstack([cv2.resize(a, (w, h), interpolation=cv2.INTER_AREA), np.full((h, 6, 3), 255, np.uint8), cv2.resize(b, (w, h), interpolation=cv2.INTER_AREA)])
x0, y0, x1, y1 = 230, 190, 700, 700; zh = int(w * (y1 - y0) / (x1 - x0))
z = np.hstack([cv2.resize(a[y0:y1, x0:x1], (w, zh)), np.full((zh, 6, 3), 255, np.uint8), cv2.resize(b[y0:y1, x0:x1], (w, zh))])
cv2.imwrite('out/pv_%s.jpg' % sys.argv[1], np.vstack([f, z]), [cv2.IMWRITE_JPEG_QUALITY, 90])
PY
