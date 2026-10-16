import json,subprocess,sys
from PIL import Image,ImageDraw
L=json.load(open('cells/lay.json'));c=L['cell'];cols=L['cols'];n=len(L['lay']);rows=(n+cols-1)//cols
out=Image.new('RGB',(cols*c,rows*c),(233,228,220));d=ImageDraw.Draw(out)
for x in L['lay']:
  subprocess.run([sys.executable,'rast.py','cells/c%d.svg'%x['i'],'cells/c%d.png'%x['i'],'2'],check=True)
  im=Image.open('cells/c%d.png'%x['i']);r,q=divmod(x['i'],cols);out.paste(im,(q*c,r*c));d.text((q*c+3,r*c+2),'%s v%d %.2g:%.2g'%(x['cw'][:6],x['v'],x['op'],x['wl']),fill=(60,60,60))
s=min(1,float(sys.argv[2]) if len(sys.argv)>2 else 1000/out.size[0]);out=out.resize((int(out.size[0]*s),int(out.size[1]*s)),Image.LANCZOS);out.save(sys.argv[1],quality=90);print(out.size)
