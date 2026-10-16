#!/bin/sh
# run_glb.sh <view> [glb2svg key=value ...]: GLB -> SVG, render it and (photo view) measure it against the reference
cd "$(dirname "$0")/.." && V=$1; shift
sh ../ws/gate.sh .venv-depth/Scripts/python glb2svg.py carpes-dorees $V "$@" 2>&1 | tail -3
O=carpes-dorees/out
if [ "$V" = photo ]; then
  sh ../verre/shot.sh $O/glb2svg_photo.svg $O/glb2svg_photo.png 564 518 >/dev/null 2>&1
  python -c "
import cv2,numpy as np;r=cv2.imread('$O/glb2svg_photo.png');m=np.load('$O/glb_photo_mask.npy');r[~m]=255;cv2.imwrite('$O/glb2svg_photo_w.png',r)"
  python mesure.py cmp $O/ref.jpg $O/glb2svg_photo_w.png --mask $O/mask_photo.png --out $O/glb2svg_mesure | tr -d '\n'; echo
fi
