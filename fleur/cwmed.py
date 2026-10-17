import sys,math
from PIL import Image
import numpy as np
png,D,cws,col=sys.argv[1],float(sys.argv[2]),sys.argv[3].split(','),int(sys.argv[4])
targets=dict(x.split('=') for x in sys.argv[5].split(',')) if len(sys.argv)>5 else {}
im=np.asarray(Image.open(png).convert('RGB')).astype(float);gap=1.15*D
bg=np.array([0xe9,0xe4,0xdc])
def lab(rgb):
  c=rgb/255;c=np.where(c<=.04045,c/12.92,((c+.055)/1.055)**2.4)
  X=(c@[.4124,.3576,.1805])/.9505;Y=c@[.2126,.7152,.0722];Z=(c@[.0193,.1192,.9505])/1.089
  g=lambda t:np.where(t>.008856,np.cbrt(t),7.787*t+16/116)
  L=116*g(Y)-16;a=500*(g(X)-g(Y));b=200*(g(Y)-g(Z));return L,np.hypot(a,b),np.degrees(np.arctan2(b,a))%360
for r,cw in enumerate(cws):
  x0=int(.2*D+gap*col);y0=int(.1*D+gap*r);cc=im[y0:y0+int(gap),x0:x0+int(gap)].copy();X=int(gap*.5);cc[:,X-9:X+9]=bg;c=cc.reshape(-1,3)
  m=np.abs(c-bg).sum(1)>40;p=c[m]
  med=np.median(p,0);L,C,h=lab(med[None,:]/1.0)
  t=targets.get(cw)
  s=f'{cw:13s} L{L[0]:.0f} C{C[0]:.0f} h{h[0]:.0f}'
  if t:
    tt=np.array([int(t[i:i+2],16) for i in (0,2,4)],float);L2,C2,h2=lab(tt[None,:]);s+=f' | cible #{t} L{L2[0]:.0f} C{C2[0]:.0f} h{h2[0]:.0f} dL={L[0]-L2[0]:+.0f} dh={((h[0]-h2[0]+180)%360-180):+.0f}'
  print(s)
