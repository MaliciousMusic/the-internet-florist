#!/bin/sh
# svg_glbvase.sh <tag> [glbvase key=value ...]: shop SVG, weight, render, difference to the field, plate field | SVG and close-up
cd "$(dirname "$0")/.." && T=$1; shift
sh ../ws/gate.sh .venv-depth/Scripts/python glbvase.py carpes-dorees shop "$@" 2>&1 | grep -E "svg|gzip"
cd carpes-dorees/out && sh ../../../verre/shot.sh glbvase_shop.svg glbvase_shop.png 1747 1092 >/dev/null 2>&1 && python -c "
import cv2,numpy as np,sys;sys.path.insert(0,'../..');import mesure
f=cv2.imread('glbvase_shop_field.png');r=cv2.imread('glbvase_shop.png');m=np.load('glb_shop_mask.npy')
me=cv2.erode(m.astype(np.uint8),np.ones((5,5),np.uint8))>0
dE=mesure.de2000(mesure.to_lab(cv2.GaussianBlur(f,(0,0),2)),mesure.to_lab(cv2.GaussianBlur(r,(0,0),2)))
ss=mesure.ssim(cv2.cvtColor(f,cv2.COLOR_BGR2GRAY),cv2.cvtColor(r,cv2.COLOR_BGR2GRAY))
print('$T dE(svg,champ) %.2f  SSIM brute %.3f'%(dE[me].mean(),ss[me].mean()))
r[~m]=255
ys,xs=np.where(m);c=lambda a:a[ys.min():ys.max(),xs.min():xs.max()]
s=lambda a:cv2.resize(a,(a.shape[1]*700//a.shape[0],700),interpolation=cv2.INTER_AREA)
z=lambda a:a[int(a.shape[0]*.2):int(a.shape[0]*.55),int(a.shape[1]*.35):int(a.shape[1]*.75)]
cv2.imwrite('../../_apercu/glbvase_svg_$T.jpg',np.hstack([s(c(f)),s(c(r))]));cv2.imwrite('../../_apercu/glbvase_svg_${T}_zoom.jpg',np.hstack([z(c(f)),z(c(r))]))"
