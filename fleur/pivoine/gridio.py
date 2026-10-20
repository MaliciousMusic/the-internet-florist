# gridio.py get|put <cw> <g|h> <grille.json>: the colour grid of colourway cw, piece g (guards) or h (petaloids), out of app/y-paeonia.js
# into a json (get), or from a json back into the code (put). Only the c table is touched.
import sys,re,json
op,cw,k,f=sys.argv[1:5];p='app/y-paeonia.js';s=open(p,encoding='utf-8',newline='').read()
i=s.index("  '%s':{g:{"%cw) if "  '%s':{g:{"%cw in s else s.index("  %s:{g:{"%cw);j=s.index("\n  '",i+5) if "\n  '" in s[i+5:] else len(s);B=s[i:j]
hs=B.index('    h:{st') if k=='h' else 0;gi=B.index('grid:{nu:',hs);ci=B.index('c:[',gi)+2
d=0
for e in range(ci,len(B)):
    d+=B[e]=='[';d-=B[e]==']'
    if d==0:break
C=B[ci:e+1];nu=int(re.match(r'grid:\{nu:(\d+),nv:(\d+)',B[gi:]).group(1));nv=int(re.match(r'grid:\{nu:(\d+),nv:(\d+)',B[gi:]).group(2))
if op=='get':
    json.dump({'nu':nu,'nv':nv,'c':json.loads(C.replace("'",'"'))},open(f,'w',encoding='utf-8'));print('got',cw,k,nv,'x',nu)
else:
    g=json.load(open(f,encoding='utf-8'))
    NC='['+','.join('['+','.join("'%s'"%x for x in row)+']' for row in g['c'])+']'
    B2=B[:ci]+NC+B[e+1:]
    if (g['nu'],g['nv'])!=(nu,nv):B2=B2[:gi]+B2[gi:].replace('grid:{nu:%d,nv:%d'%(nu,nv),'grid:{nu:%d,nv:%d'%(g['nu'],g['nv']),1)  # a finer grid (18 x 72, BONNES-PRATIQUES §15.2)
s=s[:i]+B2+s[j:];open(p,'w',encoding='utf-8',newline='').write(s);print('put',cw,k)
