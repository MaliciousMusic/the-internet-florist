"""jgap.py plant.png ncells cm : per cell of a plant=1 render (cells side by side): foreground components; for each piece apart from the main
one (area > 12 px): its distance to the main body in px and mm (scale: the main body's height = cm of stem + head); also the head-stem neck:
the narrowest foreground run width along the stem axis just under the head, and any background row between head and stem (gap)."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
im=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int);n=int(sys.argv[2]);cm=float(sys.argv[3])
bg=im[2,2];fg=np.abs(im-bg).sum(2)>14;H,W=fg.shape;cw=W//n
for c in range(n):
  f=fg[:,c*cw:(c+1)*cw];lab,k=nd.label(f,structure=np.ones((3,3)));
  if k==0:print(c,'empty');continue
  ar=nd.sum(f,lab,range(1,k+1));m=int(np.argmax(ar))+1;main=lab==m;ys=np.where(main.any(1))[0];hpx=ys[-1]-ys[0];mmpx=(cm*10+180)/max(1,hpx)
  dt=nd.distance_transform_edt(~main);bits=[]
  for i in range(1,k+1):
    if i==m or ar[i-1]<12:continue
    d=dt[lab==i].min();bits.append((round(d*mmpx,1),int(ar[i-1])))
  bits.sort(reverse=True)
  # neck: rows from the head's lowest wide row downward; find min width of the main body in the band below the head
  wid=main.sum(1);top=ys[0];band=wid[top:top+int(hpx*.5)];hb=int(np.argmax(band))+top
  below=wid[hb:hb+int(hpx*.25)];nk=int(below.min()) if len(below) else 0
  print('cell%d h%dpx %.2fmm/px pieces apart: %d %s | min width under head %dpx'%(c,hpx,mmpx,len(bits),bits[:5],nk))
