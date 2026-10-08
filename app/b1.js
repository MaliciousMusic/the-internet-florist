
/* ================= botanical art kit ================= */
/* closed / open Catmull-Rom through points -> smooth organic cubic path */
function smooth(P,closed=true){const n=P.length;let d=`M${f(P[0][0])},${f(P[0][1])}`;const g=i=>closed?P[(i+n)%n]:P[Math.max(0,Math.min(n-1,i))];
  for(let i=0;i<(closed?n:n-1);i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
    d+=`C${f(p1[0]+(p2[0]-p0[0])/6)},${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)},${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])},${f(p2[1])}`}
  return d+(closed?'Z':'')}
const sinP=(pw,a=.05)=>t=>Math.pow(Math.sin(Math.PI*Math.min(.97,a+(1-a)*t)),pw);
/* organic petal / leaf outline pointing up (-y), base at 0,0 */
function petalD(L,W,o={}){const n=o.n||10,rf=o.rf||0,rk=o.rk||8,bend=(o.bend||0)*L,ph=[R(0,6.3),R(0,6.3)],prof=o.prof||sinP(o.pw||.75);
  const side=s=>{const a=[];for(let i=1;i<n;i++){const t=i/n,w=W*prof(t)*(1+(o.asym||0)*s)*(1+rf*t*Math.sin(t*rk*Math.PI+ph[s>0?0:1])+.035*Math.sin(t*5.3+ph[1]));a.push([s*w+bend*t*t,-L*t])}return a};
  const wt=W*prof(.97),tp=o.tip||'round';let tip;
  if(tp==='point')tip=[[bend+wt*.32,-L*.985],[bend,-L*1.03],[bend-wt*.32,-L*.985]];
  else if(tp==='notch')tip=[[bend+wt*.85,-L*.97],[bend+wt*.55,-L*1.0],[bend+wt*.27,-L*.94],[bend,-L*1.01],[bend-wt*.27,-L*.94],[bend-wt*.55,-L*1.0],[bend-wt*.85,-L*.97]];
  else tip=[[bend+wt*.62,-L*.99],[bend,-L*1.03],[bend-wt*.62,-L*.99]];
  return smooth([[0,0],...side(1),...tip,...side(-1).reverse()])}
function veins(g,L,W,c,n,op,sw=.6){for(let k=0;k<n;k++){const u=n===1?0:k/(n-1)*2-1,x=u*W*.55;E('path',{d:`M${f(u*W*.08)},${f(-L*.05)}Q${f(x*.75)},${f(-L*.45)} ${f(x*.92)},${f(-L*.86)}`,stroke:c,'stroke-width':sw,'stroke-opacity':op,fill:'none','stroke-linecap':'round'},g)}}
function specks(g,L,W,o){const c=o.c||'#b3122e';for(let i=0;i<(o.n||20);i++){const t=Math.pow(rnd(),o.p||1.4)*.72+.06,w=W*.5*(1-t*.35),x=R(-w,w),y=-L*t,s=R(.6,1.6)*(o.s||1)*(1-t*.45);
  E('ellipse',{cx:f(x),cy:f(y),rx:f(s*.7),ry:f(s*1.7),fill:c,opacity:f(R(.55,.95)),transform:`rotate(${f(x*.9)} ${f(x)} ${f(y)})`},g)}}
/* painted petal: body gradient, side shading, base shadow, veins, speckles, ink edge. pal=[base,mid,tip,ink] */
function P2(par,L,W,pal,o={}){const g=G(par,o.tr?{transform:o.tr}:null),d=petalD(L,W,o);
  E('path',{d,fill:lin([[0,pal[0]],[.5,pal[1]],[1,pal[2]]],0,1,0,0)},g);
  if(!o.lite){E('path',{d,fill:lin([[0,'#1a0010',o.sh??.24],[.42,'#1a0010',0],[.62,'#ffffff',0],[1,'#ffffff',o.hl??.2]],0,0,1,0)},g);
    if(o.base!==0)E('path',{d,fill:lin([[0,pal[3],o.base??.35],[.32,pal[3],0]],0,1,0,0)},g);
    if(o.v)veins(g,L,W,o.vc||pal[3],o.v,o.vo??.3);if(o.sp)specks(g,L,W,o.sp)}
  E('path',{d,fill:'none',stroke:pal[3],'stroke-width':o.sw??.8,'stroke-opacity':o.so??.5,'stroke-linejoin':'round'},g);return g}
/* composite disc of florets (cosmos, daisy) */
function disc(par,r,c,n){const g=G(par);E('circle',{r,fill:rad([c[0],c[1],c[2]],.42,.38,.7)},g);
  for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n)*r*.82,a=i*137.5*D;E('circle',{cx:f(Math.cos(a)*q),cy:f(Math.sin(a)*q),r:f(r*.14*(1.1-q/r*.5)),fill:c[i%3?1:0],stroke:c[2],'stroke-width':.4,'stroke-opacity':.6},g)}
  E('circle',{r,fill:'none',stroke:c[2],'stroke-width':.8,'stroke-opacity':.5},g);return g}

/* ---------- foliage ---------- */
const GP={deep:['#0c3328','#1d5c45','#3f8a5f','#06201a','#9fd3a8'],mid:['#1f5a2c','#3f8f3f','#8fcf6a','#123a1a','#c8f0a0'],light:['#3f7a2a','#7fb84a','#c8e07a','#24461a','#eef9c8'],teal:['#0b3836','#1c6658','#3d8f7a','#04201d','#d8f5ec']};
function leafPaint(g,L,W,pal,o={}){const d=petalD(L,W,Object.assign({n:12,tip:'point',rf:.02,rk:5},o)),bend=o.bend||0;
  E('path',{d,fill:lin([[0,pal[0]],[.55,pal[1]],[1,pal[2]]],0,1,.35,0)},g);
  E('path',{d,fill:lin([[0,'#000',.3],[.47,'#000',0],[.53,'#fff',0],[1,'#fff',.12]],0,0,1,0)},g);
  const prof=o.prof||sinP(.75),nv=o.nv??7;
  for(let i=1;i<=nv;i++){const t=i/(nv+1),y=-L*t,w=W*prof(t)*.86,cx=bend*L*t*t;for(const s of[-1,1])E('path',{d:`M${f(cx)},${f(y)}Q${f(cx+s*w*.5)},${f(y-L*.03)} ${f(cx+s*w)},${f(y-L*(o.va??.12))}`,stroke:pal[4],'stroke-width':o.vw??1,'stroke-opacity':o.vo??.45,fill:'none','stroke-linecap':'round'},g)}
  E('path',{d:taper([[0,0],[bend*L*.12,-L*.35],[bend*L*.49,-L*.7],[bend*L*.94,-L*.97]],u=>Math.max(.35,(o.mr||2.2)*(1-u)),10),fill:pal[4],opacity:.75},g);
  E('path',{d,fill:'none',stroke:pal[3],'stroke-width':o.sw??1,'stroke-opacity':o.so??.75},g);
  if(o.drops)for(let i=0;i<o.drops;i++){const t=R(.2,.8),x=bend*L*t*t+R(-W*.25,W*.25),y=-L*t;E('ellipse',{cx:f(x),cy:f(y),rx:1.7,ry:2.3,fill:'#fff',opacity:.4},g);E('ellipse',{cx:f(x+.5),cy:f(y-.6),rx:.7,ry:.9,fill:'#fff',opacity:.9},g)}
  return d}
function cuts(g,L,W,prof,n){for(let i=1;i<=n;i++){const t=.22+i*.12;for(const s of[-1,1]){const w=W*prof(t),y=-L*t;E('path',{d:`M${f(s*w*1.04)},${f(y+1)}Q${f(s*w*.7)},${f(y-L*.012)} ${f(s*w*.5)},${f(y-L*.018)}Q${f(s*w*.72)},${f(y-L*.03)} ${f(s*w*1.04)},${f(y-L*.032)}Z`,fill:'#0b2a1f'},g)}}
  for(let i=0;i<3;i++){const t=.34+i*.17,s=i%2?1:-1,x=s*W*.26,y=-L*t;E('ellipse',{cx:f(x),cy:f(y),rx:3,ry:6.5,fill:'#0b2a1f',transform:`rotate(${s*28} ${f(x)} ${f(y)})`},g)}}
function tears(g,L,W,prof,n){for(let i=0;i<n;i++){const t=R(.2,.85),s=rnd()<.5?-1:1,w=W*prof(t),y=-L*t;E('path',{d:`M${f(s*w*1.06)},${f(y+1)}L${f(s*w*.12)},${f(y-1)}L${f(s*w*1.06)},${f(y-4)}Z`,fill:'#24461a',opacity:.75},g)}}
function fern(g,L,pal){const P=[[0,0],[R(-15,15),-L*.35],[R(-25,25),-L*.7],[R(-40,40),-L]];E('path',{d:cp(P),stroke:pal[3],'stroke-width':2,fill:'none'},g);const n=20;
  for(let i=1;i<=n;i++){const u=i/(n+1),q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),ang=Math.atan2(q2[1]-q[1],q2[0]-q[0])/D+90,l=L*.2*(1-u*.72),w=l*.24;
    for(const s of[-1,1])E('path',{d:petalD(l,w,{n:6,tip:'point',prof:sinP(.6)}),fill:lin([pal[0],pal[1],pal[2]],0,1,0,0),stroke:pal[3],'stroke-width':.6,'stroke-opacity':.6,transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(ang+s*62)})`},g)}}
const PA={alocasia:sinP(.7,.24),monstera:sinP(.6,.2),banana:sinP(.35),round:sinP(.5,.08),strap:sinP(.3,.02),stem:sinP(.75)};
const FOL={
 alocasia:g=>leafPaint(g,170,62,GP.teal,{prof:PA.alocasia,nv:6,va:.18,vw:2,vo:.85,mr:3.2,bend:R(-.1,.1)}),
 monstera:g=>{leafPaint(g,160,80,GP.deep,{prof:PA.monstera,nv:6,va:.1,vw:1.4,vo:.5,mr:3});cuts(g,160,80,PA.monstera,5)},
 banana:g=>{leafPaint(g,260,46,GP.light,{prof:PA.banana,nv:22,va:.015,vw:.7,vo:.4,mr:3.6,bend:R(-.12,.12)});tears(g,260,46,PA.banana,4)},
 round:g=>leafPaint(g,120,70,GP.light,{prof:PA.round,nv:5,va:.14,vw:1.2,vo:.5,mr:2.4,tip:'round'}),
 fern:g=>fern(g,200,GP.mid),
 strap:g=>leafPaint(g,190,13,GP.mid,{prof:PA.strap,nv:0,mr:1.2,bend:R(-.35,.35),drops:3}),
 stem:g=>leafPaint(g,70,15,GP.mid,{prof:PA.stem,nv:4,va:.1,vw:.7,vo:.4,mr:1.2,bend:R(-.25,.25)})};
/* flat dark silhouettes for the far layer */
const FARC=[['#173f36','#22574a'],['#1a4a3e','#2b6a55'],['#1f5546','#33785c'],['#163a33','#245244'],['#24584a','#3a7f62']];
function silh(g,tp){const c=pick(FARC);let L=170,W=62,o={prof:PA.alocasia};if(tp==='monstera'){L=160;W=80;o={prof:PA.monstera}}if(tp==='banana'){L=260;W=46;o={prof:PA.banana}}if(tp==='round'){L=120;W=70;o={prof:PA.round,tip:'round'}}
  E('path',{d:petalD(L,W,Object.assign({n:10,tip:'point'},o)),fill:lin([c[0],c[1]],0,1,.4,0)},g);E('path',{d:`M0,0L0,${-L*.95}`,stroke:'#4f9a7c','stroke-width':1.4,'stroke-opacity':.35},g)}
