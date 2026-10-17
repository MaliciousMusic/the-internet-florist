"""gstat.py img (cols rows | D<size> cols) [out.jpg perrow] : per-cell tone stats of a grid render (non-background pixels):
L med, C med, hue med, share green (h 100-200 C>8), vivid (C>28), brown (h 15-85 L<52), parchment (h 60-100 L>60 C<26); optional re-layout"""
import sys, math
from PIL import Image
def lab(r,g,b):
    v=[c/255 for c in (r,g,b)]; v=[((c+.055)/1.055)**2.4 if c>.04045 else c/12.92 for c in v]
    X=(.4124*v[0]+.3576*v[1]+.1805*v[2])/.95047; Y=.2126*v[0]+.7152*v[1]+.0722*v[2]; Z=(.0193*v[0]+.1192*v[1]+.9505*v[2])/1.08883
    f=lambda t: t**(1/3) if t>.008856 else 7.787*t+16/116
    L=116*f(Y)-16; a=500*(f(X)-f(Y)); b=200*(f(Y)-f(Z)); return L, math.hypot(a,b), (math.degrees(math.atan2(b,a))+360)%360
a=sys.argv[1:]; im=Image.open(a[0]).convert('RGB'); W,H=im.size
if a[1].startswith('D'):
  D=float(a[1][1:]); gp=D*1.15; nc=int(a[2]); nr=int((H-D*.15)//gp); cw=chh=gp; ox=oy=D*.15
else:
  nc,nr=int(a[1]),int(a[2]); cw,chh=W/nc,H/nr; ox=oy=0
bgc=im.getpixel((2,2))
cells=[]
for r in range(nr):
  for c in range(nc):
    cell=im.crop((int(ox+c*cw),int(oy+r*chh),int(ox+(c+1)*cw),int(oy+(r+1)*chh))); cells.append(cell)
    t=cell.copy(); t.thumbnail((90,90)); P=[]
    for (R,G,B) in (t.get_flattened_data() if hasattr(t,'get_flattened_data') else t.getdata()):
      if abs(R-bgc[0])+abs(G-bgc[1])+abs(B-bgc[2])<14: continue
      P.append(lab(R,G,B))
    if not P: print(r,c,'empty'); continue
    n=len(P); md=lambda i: sorted(p[i] for p in P)[n//2]
    hx=sum(math.cos(math.radians(p[2]))*p[1] for p in P); hy=sum(math.sin(math.radians(p[2]))*p[1] for p in P)
    g=sum(1 for p in P if 100<=p[2]<=200 and p[1]>8)/n; v=sum(1 for p in P if p[1]>28)/n
    br=sum(1 for p in P if (p[2]>=15 and p[2]<=85) and p[0]<52)/n; pa=sum(1 for p in P if 60<=p[2]<=100 and p[0]>60 and p[1]<26)/n
    print('r%d c%d L%2.0f C%2.0f h%3.0f  green%3.0f%% vivid%3.0f%% brown%3.0f%% parch%3.0f%%'%(r,c,md(0),md(1),(math.degrees(math.atan2(hy,hx))+360)%360,g*100,v*100,br*100,pa*100))
if len(a)>3:
  per=int(a[4]); k=len(cells); rows=(k+per-1)//per; o=Image.new('RGB',(int(cw)*per,int(chh)*rows),bgc)
  for i,cl in enumerate(cells): o.paste(cl,(int(cw)*(i%per),int(chh)*(i//per)))
  o.thumbnail((1000,1000)); o.save(a[3],quality=85); print(a[3],o.size)
