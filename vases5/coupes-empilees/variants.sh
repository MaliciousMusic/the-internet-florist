#!/bin/sh
# variants.sh "<params 1>" "<params 2>" ... : quick photo-framed field previews side by side (out/_var/var.png), under the gate
S="$(pwd -W)/out/_var"; mkdir -p "$S"
i=0; for p in "$@"; do sh ../../ws/gate.sh python mk.py photo res=${VRES:-.5} ss=1 emit=0 $(cat out/lect/alphas.txt) $p >/dev/null 2>&1; cp out/field_photo.png "$S/v$i.png"; i=$((i+1)); done
python -c "
import cv2,numpy as np
S='$S/';n=$i
ims=[cv2.imread(S+'v%d.png'%k) for k in range(n)]
h=max(i.shape[0] for i in ims)
ims=[cv2.copyMakeBorder(i,0,h-i.shape[0],0,4,cv2.BORDER_CONSTANT,value=(255,255,255)) for i in ims]
ref=cv2.imread('out/ref.jpg')[150:800,60:640];ref=cv2.resize(ref,(int(ref.shape[1]*h/ref.shape[0]),h))
cv2.imwrite(S+'var.png',np.hstack([ref]+ims))"
