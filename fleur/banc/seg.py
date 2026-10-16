import sys
import numpy as np
from PIL import Image
f,box=sys.argv[1],tuple(map(int,sys.argv[2].split(',')))
im=np.asarray(Image.open(f).convert('RGB').crop(box),float);r,g,b=im[...,0],im[...,1],im[...,2]
m=(r>g+12)&(r>b-25)   # purple / pink / maroon tissue, not sky nor leaf
ys=np.where(m.sum(1)>2)[0];y0,y1=ys.min(),ys.max();H=y1-y0+1
W=0;rows=[]
for f2 in [.03,.1,.2,.3,.4,.5,.6,.7,.8,.9,.97]:
  y=int(y0+f2*(H-1));xs=np.where(m[y])[0];w=(xs.max()-xs.min()+1) if len(xs)>2 else 0;rows.append(w)
W=max(rows);print('H',H,'W',W,'H/W %.2f'%(H/W),'width at 3,10..90,97%%:',' '.join('%.2f'%(w/W) for w in rows))
Image.fromarray((m*255).astype(np.uint8)).save('seg.png')
