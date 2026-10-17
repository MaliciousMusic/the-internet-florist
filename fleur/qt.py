import sys,math
from PIL import Image
exec(open(sys.argv[0].replace('qt.py','gstat.py')).read().split('a=sys.argv')[0])
# qt.py img box [hlo,hhi] : L quartiles with C and hue of each quartile (pixels in hue window, C>8)
im=Image.open(sys.argv[1]).convert('RGB').crop([int(v) for v in sys.argv[2].split(',')]);im.thumbnail((200,200))
lo,hi=[float(v) for v in sys.argv[3].split(',')]
P=[lab(*p) for p in (im.get_flattened_data() if hasattr(im,'get_flattened_data') else im.getdata())]
P=[p for p in P if p[1]>6 and ((lo<=p[2]<=hi) if lo<=hi else (p[2]>=lo or p[2]<=hi))];P.sort();n=len(P)
for k,(a,b) in enumerate([(0,.1),(.1,.35),(.35,.65),(.65,.9),(.9,1)]):
  Q=P[int(a*n):max(int(a*n)+1,int(b*n))];hx=sum(math.cos(math.radians(q[2]))*q[1] for q in Q);hy=sum(math.sin(math.radians(q[2]))*q[1] for q in Q)
  print('q%d L%.0f C%.0f h%.0f'%(k,sum(q[0] for q in Q)/len(Q),sum(q[1] for q in Q)/len(Q),(math.degrees(math.atan2(hy,hx))+360)%360),end=' | ')
print(n)
