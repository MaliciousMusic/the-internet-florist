#!/bin/sh
# viz_glbvase.sh <tag> [glbvase key=value ...]: field, elements, shadows and cavities of the shop view on one plate
cd "$(dirname "$0")/.." && T=$1; shift
sh ../ws/gate.sh .venv-depth/Scripts/python glbvase.py carpes-dorees shop svg=0 "$@" 2>&1 | tail -2
cd carpes-dorees/out && python -c "
import cv2,numpy as np
m=np.load('glb_shop_mask.npy');ys,xs=np.where(m);c=lambda a:a[ys.min():ys.max(),xs.min():xs.max()]
f=c(cv2.imread('glbvase_shop_field.png'));e=c(cv2.imread('glbvase_shop_elements.png'));s=c(cv2.imread('glbvase_shop_shadow.png'));v=c(cv2.imread('glbvase_shop_cavity.png'))
r=lambda a:cv2.resize(a,(a.shape[1]*520//a.shape[0],520),interpolation=cv2.INTER_AREA)
cv2.imwrite('../../_apercu/glbvase_$T.jpg',np.vstack([np.hstack([r(e),r(f)]),np.hstack([r(s),r(v)])]))"
