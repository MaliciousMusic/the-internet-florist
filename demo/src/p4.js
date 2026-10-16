
/* ---------- flowers B : blooms & textures ---------- */
/* pompon dahlia: golden-angle spiral of cupped petals */
function dahlia(g,t,o){const c=o.c||['#ffe3f0','#ff86b8','#e0306f','#9c1046'],n=o.n||76,R0=56;
  const k=G(g,{transform:`scale(1,${o.tilt||.9})`});E('circle',{r:R0+14,fill:c[3],opacity:.55},k);
  const rings=[G(k),G(k),G(k)],gO=lin([c[3],c[2],c[1],c[0]]),gI=lin([c[3],c[2],c[1]]),hol=lin([c[3],c[2]]);
  for(let i=n;i>=1;i--){const q=i/n,rr=R0*Math.sqrt(q),a=i*137.508+R(-4,4),len=11+20*q,w=6+6*q;
    const pg=G(rings[q>.62?0:q>.28?1:2],{transform:`rotate(${f(a)}) translate(0,${f(-rr+len*.35)})`});
    E('path',{d:rpet(len,w),fill:q>.28?gO:gI,stroke:c[0],'stroke-width':.7,'stroke-opacity':.55},pg);
    E('path',{d:rpet(len*.55,w*.55),fill:hol,opacity:.55},pg)}
  E('circle',{r:5,fill:c[3]},rings[2]);
  rings.forEach((r,j)=>open(r,t+j*230,1050,(j%2?1:-1)*28,.3))}
/* garden rose */
function rose(g,t,o){const c=o.c||['#fff4ec','#ffd2bf','#f7a08f','#d8616b'],k=G(g,{transform:`scale(1,${o.tilt||.92})`});
  const L=[G(k),G(k),G(k),G(k)],go=lin([c[2],c[1],c[0]]),gm=lin([c[3],c[2],c[1]]),st={stroke:c[3],'stroke-width':.8,'stroke-opacity':.35};
  for(let i=0;i<9;i++)E('path',{d:rpet(60+R(-4,4),30),fill:go,...st,transform:`rotate(${f(i*40+R(-6,6))})`},L[0]);
  for(let i=0;i<7;i++)E('path',{d:rpet(46,27),fill:go,...st,transform:`rotate(${f(i*51+20)})`},L[1]);
  E('circle',{r:32,fill:rad([[0,c[3],.75],[1,c[2],0]])},L[2]);
  for(let j=13;j>=0;j--){const r=7+j*1.9;E('path',{d:`M${f(-r)},0Q0,${f(-r*1.35)} ${f(r)},0Q0,${f(-r*.55)} ${f(-r)},0Z`,fill:j<5?gm:go,...st,transform:`rotate(${f(j*67)}) translate(0,${f(r*.25)})`},L[3])}
  open(L[0],t,1100,-20,.35);open(L[1],t+180,1100,25,.3);open(L[3],t+380,1100,50,.4)}
/* phalaenopsis orchid */
function orchid(g,t,o){const c=o.c||['#fff7fd','#f7cdf0','#e09ae0'],v=o.v||'#b2479f',k=G(g),gs=lin([c[2],c[1],c[0]]),ln={stroke:c[2],'stroke-width':.6,'stroke-opacity':.5};
  for(const[a,l,w]of[[0,40,13],[128,38,12],[-128,38,12]]){const pg=G(k,{transform:`rotate(${a})`});E('path',{d:pet(l,w,.55,.18),fill:gs,...ln},pg);E('path',{d:`M0,-3L0,${f(-l*.85)}`,stroke:v,'stroke-opacity':.25,'stroke-width':.8},pg)}
  for(const s of[-1,1]){const pg=G(k,{transform:`rotate(${s*68})`});E('path',{d:rpet(36,22),fill:gs,...ln},pg);
    for(const x of[-10,-5,0,5,10])E('path',{d:`M0,-2Q${f(x*.6)},-18 ${x},-31`,stroke:v,'stroke-opacity':.22,'stroke-width':.7,fill:'none'},pg)}
  E('path',{d:'M-11,2C-16,-6 -7,-10 -4,-3L4,-3C7,-10 16,-6 11,2Z',fill:'#ffd34d'},k);
  E('path',{d:'M-6,2C-9,12 -6,22 0,24C6,22 9,12 6,2Z',fill:lin(['#7a1460','#c8338f','#f07ac8'],0,1,0,0)},k);
  for(let i=0;i<6;i++)E('circle',{cx:f(R(-5,5)),cy:f(R(-2,6)),r:.9,fill:'#c2185b'},k);
  E('ellipse',{cx:0,cy:-3,rx:3.5,ry:5,fill:'#fffaf0',stroke:'#e7c6df','stroke-width':.6},k);
  open(k,t,900,-20,.15)}
function bud(g,t,o){const k=G(g);E('ellipse',{cx:0,cy:6,rx:6,ry:9,fill:lin(o.c||['#d98ad6','#f7cdf0'],0,1,0,0)},k);open(k,t,700,0,0)}
/* king protea */
function protea(g,t,o){const c=o.c||['#fff0f5','#ffb6cf','#f06292','#c2185b'],k=G(g),back=G(k),dome=G(k),front=G(k),gb=lin([c[3],c[2],c[1],c[0]]);
  for(let i=0;i<11;i++){const a=-75+i*15+R(-3,3);E('path',{d:pet(88+R(-8,8)-Math.abs(a)*.2,11,.45,.12),fill:gb,stroke:c[0],'stroke-width':.8,'stroke-opacity':.6,transform:`translate(0,-8) rotate(${f(a)})`},back)}
  E('ellipse',{cx:0,cy:-52,rx:40,ry:30,fill:rad(['#fffafc','#ffe0ec','#f7a6c4'],.5,.35,.6)},dome);
  for(let i=0;i<50;i++){const a=R(0,6.283),r=Math.sqrt(rnd()),x=Math.cos(a)*r*36,y=-52+Math.sin(a)*r*26;E('path',{d:`M${f(x)},${f(y)}l${f(R(-2,2))},${f(R(-6,-3))}`,stroke:pick(['#ffffff','#f8bbd0','#e991b4']),'stroke-width':1.3,'stroke-linecap':'round'},dome)}
  for(let i=0;i<9;i++){const a=-80+i*20+R(-3,3),l=48+Math.abs(a)*.5;E('path',{d:pet(l,15,.5,.15),fill:gb,stroke:'#fff','stroke-width':1.1,'stroke-opacity':.55,transform:`rotate(${f(a)})`},front)}
  open(back,t,1000,0,.2);open(dome,t+250,800,0,.3);open(front,t+150,1000,0,.3)}
/* billy button */
function craspedia(g,t,o){const k=G(g),r=17;E('circle',{r,fill:rad(['#fff7a8','#ffd51e','#e0a100','#a87400'],.4,.35,.65)},k);
  for(let i=0;i<34;i++){const q=Math.sqrt((i+.5)/34)*r*.92,a=i*137.5*D;E('circle',{cx:f(Math.cos(a)*q),cy:f(Math.sin(a)*q),r:f(2.6-q/r*1.1),fill:'none',stroke:'#c28800','stroke-width':.6,'stroke-opacity':.55},k)}
  open(k,t,800,0,0)}
/* hairy balloon plant */
function balloon(g,t,o){const r=30,k=G(g);E('ellipse',{rx:r,ry:r*1.08,fill:rad(['#f4ffe0','#c7e6a0','#8fbf63','#5d8a3c'],.38,.32,.7)},k);
  E('path',{d:`M0,${f(-r*1.05)}Q${f(r*.35)},0 0,${f(r*1.05)}`,stroke:'#6f9a4a','stroke-width':1,'stroke-opacity':.6,fill:'none'},k);
  for(let i=0;i<36;i++){const a=R(0,6.283),rr=r*R(.2,1.02),x=Math.cos(a)*rr,y=Math.sin(a)*rr*1.08,l=R(4,8),b=a+R(-.6,.6);E('path',{d:`M${f(x)},${f(y)}q${f(Math.cos(b)*l*.6)},${f(Math.sin(b)*l*.6-2)} ${f(Math.cos(b)*l)},${f(Math.sin(b)*l)}`,stroke:pick(['#5f8a3d','#7aa84f','#a9cf7c']),'stroke-width':1,fill:'none','stroke-linecap':'round'},k)}
  open(k,t,900,0,0)}
/* physalis lantern, hangs from origin */
function lantern(g,t,o){const c=o.c||['#ffcf6a','#ff8a1f','#e0520e'],k=G(g);
  E('path',{d:'M0,0C15,4 23,20 19,35C16,47 7,55 0,59C-7,55 -16,47 -19,35C-23,20 -15,4 0,0Z',fill:lin(c,0,0,1,1)},k);
  for(const x of[-11,-4,4,11])E('path',{d:`M0,1Q${f(x*1.4)},30 0,59`,stroke:c[2],'stroke-opacity':.5,'stroke-width':.9,fill:'none'},k);
  E('path',{d:'M0,0L0,-6',stroke:'#7a6a2a','stroke-width':1.6},k);open(k,t,800,25,0)}
/* orange star lily */
function lily(g,t,o){const c=o.c||['#ffe14d','#ffa21f','#ff6a13','#e2400b'],k=G(g),L1=G(k),L2=G(k),gp=lin(c),ln={stroke:c[3],'stroke-width':.7,'stroke-opacity':.4};
  for(let i=0;i<3;i++){E('path',{d:pet(58,19,.55,.2),fill:gp,...ln,transform:`rotate(${i*120+30})`},L1);E('path',{d:pet(52,22,.5,.2),fill:gp,...ln,transform:`rotate(${i*120+90})`},L2)}
  for(let i=0;i<14;i++){const a=R(0,6.28),r=R(6,20);E('circle',{cx:f(Math.cos(a)*r),cy:f(Math.sin(a)*r),r:f(R(.8,1.6)),fill:'#b5300a',opacity:.7},L2)}
  const st=G(k);for(let i=0;i<6;i++){const a=i*60+R(-10,10),l=R(26,34),x=Math.sin(a*D)*l,y=-Math.cos(a*D)*l;E('path',{d:`M0,0Q${f(x*.4)},${f(y*.6)} ${f(x)},${f(y)}`,stroke:'#ffe9a8','stroke-width':1.2,fill:'none'},st);E('ellipse',{cx:f(x),cy:f(y),rx:2,ry:4.5,fill:'#a8320c',transform:`rotate(${f(a)} ${f(x)} ${f(y)})`},st)}
  open(L1,t,950,-30,.2);open(L2,t+120,950,30,.2);open(st,t+500,700,0,0)}
/* sea lavender */
function statice(g,t,o){const k=G(g),C=['#7c4dff','#9f7bff','#b69cff','#6a3fd6','#d1c0ff'];
  for(let b=0;b<6;b++){const a=R(-70,70)*D,l=R(25,60),x=Math.sin(a)*l,y=-Math.cos(a)*l;
    E('path',{d:`M0,0Q${f(x*.3)},${f(y*.6)} ${f(x)},${f(y)}`,stroke:'#8a9a6a','stroke-width':1,fill:'none'},k);
    for(let i=0;i<13;i++){const aa=R(0,6.28),rr=R(0,11);E('circle',{cx:f(x+Math.cos(aa)*rr),cy:f(y+Math.sin(aa)*rr*.8),r:f(R(1.8,4)),fill:pick(C),opacity:.92},k)}}
  open(k,t,900,0,0)}
/* pampas plume */
function pampas(g,t,o){const P=o.P,k=G(g),c=['#f8c9de','#eaa9cf','#fde6f0','#d9a2e0'];
  E('path',{d:cp(P),stroke:'#d8b4c8','stroke-width':1.5,fill:'none'},k);
  for(let i=0;i<80;i++){const u=.12+.88*rnd(),p=bz(P,u),q=bz(P,Math.min(1,u+.05)),side=rnd()<.5?-1:1,l=R(14,30)*(1.1-u*.5),a=R(20,60)*side*D;
    const tx=q[0]-p[0],ty=q[1]-p[1],tl=Math.hypot(tx,ty)||1,dx=(tx*Math.cos(a)-ty*Math.sin(a))/tl,dy=(tx*Math.sin(a)+ty*Math.cos(a))/tl;
    E('path',{d:`M${f(p[0])},${f(p[1])}q${f(dx*l*.5-dy*side*3)},${f(dy*l*.5+dx*side*3)} ${f(dx*l)},${f(dy*l)}`,stroke:pick(c),'stroke-width':f(R(.8,1.8)),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},k)}
  open(k,t,1000,-10,0)}
/* asparagus foxtail fern */
function foxtail(g,t,o){const P=[[0,0],[5,-30],[0,-70],[8,-110]],k=G(g);E('path',{d:cp(P),stroke:'#4f7a2a','stroke-width':2,fill:'none'},k);
  for(let i=0;i<90;i++){const u=rnd(),p=bz(P,u),w=(1-u*.7)*14,a=R(0,6.28),l=R(5,1+w);E('path',{d:`M${f(p[0])},${f(p[1])}l${f(Math.cos(a)*l)},${f(Math.sin(a)*l-3)}`,stroke:pick(['#4f8a2a','#6fae3a','#8fcf4a','#3d6e22']),'stroke-width':1.1,'stroke-linecap':'round'},k)}
  open(k,t,900,0,0)}
/* banksia cone */
function banksia(g,t,o){const c=o.c||['#fff1dc','#f6cfa8','#d9a27a','#a8714f'],k=G(g);
  E('rect',{x:-22,y:-110,width:44,height:110,rx:22,fill:lin([c[3],c[2],c[1],c[2],c[3]],0,0,1,0)},k);
  for(let r=0;r<17;r++)for(let j=0;j<7;j++){const y=-10-r*6,x=-18+j*6+(r%2)*3;if(Math.abs(x)>19)continue;E('path',{d:`M${x},${y}q2,-3 0,-5`,stroke:j%2?c[0]:c[3],'stroke-width':1.3,'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},k)}
  open(k,t,900,0,0)}
/* serrated banksia leaf hanging along P */
function sleaf(g,t,o){const P=o.P,n=40,w=o.w||9,A=[],B=[];
  for(let i=0;i<=n;i++){const u=i/n,p=bz(P,u),q=bz(P,Math.min(1,u+.02)),r=bz(P,Math.max(0,u-.02)),dx=q[0]-r[0],dy=q[1]-r[1],l=Math.hypot(dx,dy)||1,ww=w*Math.sin(Math.PI*Math.min(1,u*1.05+.04))*(i%2?1:.45);A.push(f(p[0]-dy/l*ww)+','+f(p[1]+dx/l*ww));B.push(f(p[0]+dy/l*ww)+','+f(p[1]-dx/l*ww))}
  const k=G(g);E('path',{d:'M'+A.join('L')+'L'+B.reverse().join('L')+'Z',fill:o.lc||'#86a07c'},k);E('path',{d:cp(P),stroke:'#c9d8b8','stroke-width':1,fill:'none','stroke-opacity':.7},k);
  open(k,t,1000,o.ls??10,0)}
