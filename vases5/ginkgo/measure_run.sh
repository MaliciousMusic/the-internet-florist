#!/bin/sh
# measure_run.sh: renders the photo-framed SVG and runs the shared measures (vases5/mesure.py) above the wooden stand (y < 640).
# The render is shot on a magenta backdrop so that its own silhouette comes from its alpha, not from a guess.
cd "$(dirname "$0")"
sed 's/<rect x="0" y="0" width="570" height="855" fill="[^"]*"\/>/<rect x="0" y="0" width="570" height="855" fill="#ff00ff"\/>/' out/ginkgo_photo.svg > out/work/_mag.svg
sh shot.sh out/work/_mag.svg out/work/photo_mag.png 570 855 >/dev/null 2>&1
python - <<'PY'
import cv2, numpy as np
a = cv2.imread('out/ref.jpg'); b = cv2.imread('out/work/photo_mag.png').astype(float)
mag = np.array([255., 0, 255])
al = np.clip(np.linalg.norm(b - mag, axis=2) / 120, 0, 1)
bg = np.array([136., 144., 145.])                      # the reference's backdrop (BGR)
rgb = np.clip(np.where(al[..., None] > .02, (b - (1 - al[..., None]) * mag) / np.maximum(al[..., None], .02), bg), 0, 255)
rgb = rgb * al[..., None] + bg * (1 - al[..., None])
cv2.imwrite('out/work/photo3.png', rgb.astype(np.uint8))
cv2.imwrite('out/work/m_ref.png', a[:640])
cv2.imwrite('out/work/m_ren.png', np.dstack([rgb, al * 255]).astype(np.uint8)[:640])
m = cv2.imread('out/work/sil_mask.png', 0)[:640]
cv2.imwrite('out/work/m_mask.png', cv2.erode(m, np.ones((5, 5), np.uint8)))
PY
python ../mesure.py cmp out/work/m_ref.png out/work/m_ren.png --mask out/work/m_mask.png --out out/work >/dev/null
python -c "import json;d=json.load(open('out/work/mesure_cmp.json'));print(json.dumps(d,ensure_ascii=False))"
