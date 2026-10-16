import sys,os
from PIL import Image,ImageDraw
# crop.py out.jpg H file:x0,y0,x1,y1 ... -> side by side, each scaled to height H, with a 10% grid
out=sys.argv[1];H=int(sys.argv[2]);ims=[]
for a in sys.argv[3:]:
  f,b=a.rsplit(':',1);x0,y0,x1,y1=map(int,b.split(','));im=Image.open(f).convert('RGB').crop((x0,y0,x1,y1));w,h=im.size;s=H/h;im=im.resize((int(w*s),H));d=ImageDraw.Draw(im)
  for k in (range(1,10) if os.environ.get('GRID','1')=='1' else []):
    d.line([(0,H*k//10),(im.size[0],H*k//10)],fill=(255,255,0),width=1);d.line([(im.size[0]*k//10,0),(im.size[0]*k//10,H)],fill=(0,255,255),width=1)
  ims.append(im)
W=sum(i.size[0] for i in ims)+6*len(ims)
import os
GRID=os.environ.get('GRID','1')=='1';o=Image.new('RGB',(W,H),(20,20,20));x=0
for i in ims:o.paste(i,(x,0));x+=i.size[0]+6
o.save(out,quality=88);print(o.size)
