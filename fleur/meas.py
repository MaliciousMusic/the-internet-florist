# meas.py <png> <cellW> : per cell, head max width (top 22% rows), stem width at several heights (median of narrow runs)
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB');W,H=im.size;cw=int(sys.argv[2]);bg=im.getpixel((3,3))
def runs(y,x0,x1):
  r=[];cur=None
  for x in range(x0,x1):
    p=im.getpixel((x,y));d=sum(abs(a-b) for a,b in zip(p,bg))
    if d>30:
      if cur is None:cur=x
    elif cur is not None:r.append((cur,x-cur));cur=None
  return r
for c in range(W//cw):
  x0=c*cw;ys=[y for y in range(0,H,3) if runs(y,x0,x0+cw)]
  if not ys:continue
  top=ys[0];hw=max(sum(w for _,w in runs(y,x0,x0+cw)) for y in range(top,min(H,top+int(H*.18)),2))
  st=[]
  for f in (.35,.5,.65,.8,.92):
    y=int(top+(H-top)*f);rr=runs(y,x0,x0+cw);n=[w for _,w in rr if w<hw*.5]
    st.append(min(n) if n else None)
  print('cell',c,'top',top,'head W',hw,'stem',st,'ratio',[round(s/hw,3) if s else None for s in st])
