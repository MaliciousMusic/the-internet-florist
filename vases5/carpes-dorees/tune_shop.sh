#!/bin/sh
# tune_shop.sh <tag> [glb2svg key=value ...]: shop-view SVG, its weight, and its difference to the computed field it vectorizes
cd "$(dirname "$0")/.." && T=$1; shift; O=carpes-dorees/out
sh ../ws/gate.sh .venv-depth/Scripts/python glb2svg.py carpes-dorees shop "$@" 2>&1 | grep gzip
sh ../verre/shot.sh $O/glb2svg_shop.svg $O/tune_$T.png 1747 1092 >/dev/null 2>&1
python -c "
import cv2,numpy as np,sys;sys.path.insert(0,'.');import mesure
f=cv2.imread('$O/glb2svg_shop_field.png');r=cv2.imread('$O/tune_$T.png');m=np.load('$O/glb_shop_mask.npy')
m=cv2.erode(m.astype(np.uint8),np.ones((5,5),np.uint8))>0
dE=mesure.de2000(mesure.to_lab(cv2.GaussianBlur(f,(0,0),2)),mesure.to_lab(cv2.GaussianBlur(r,(0,0),2)))
ss=mesure.ssim(cv2.cvtColor(f,cv2.COLOR_BGR2GRAY),cv2.cvtColor(r,cv2.COLOR_BGR2GRAY))
print('$T  dE(svg,champ) %.2f  SSIM %.3f' % (dE[m].mean(), ss[m].mean()))"
