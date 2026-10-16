import sys,re,importlib.util
import xml.etree.ElementTree as ET
spec=importlib.util.spec_from_file_location('r',None) if False else None
src=open('rast.py').read().split('def main():')[0]
g={};exec(src,g)
for f in sys.argv[1:]:
  t=open(f).read();root=ET.fromstring(t);xs=[];ys=[]
  for e in root.iter():
    if e.tag.endswith('path') and e.get('d') and 'clipPath' not in str(e):
      for p in g['path_polys'](e.get('d')):
        for x,y in p: xs.append(x);ys.append(y)
  xs.sort();ys.sort();n=len(xs);x0,x1,y0,y1=xs[0],xs[-1],ys[0],ys[-1];m=10;print("x",xs[0],xs[n//2],xs[-1],"y",ys[0],ys[-1])
  vb='%g %g %g %g'%(x0-m,y0-m,x1-x0+2*m,y1-y0+2*m)
  t=re.sub(r'viewBox="[^"]*"','viewBox="%s"'%vb,t,1);open(f,'w').write(t);print(f,vb)
