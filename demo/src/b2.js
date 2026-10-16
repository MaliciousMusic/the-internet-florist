
/* ================= species (heads centred on 0,0 unless noted) ================= */
function cosmos(g,t,o){const c=o.c||['#9e1047','#f06a9b','#ffd9e7','#7d0c38'],k=G(g,{transform:`scale(1,${o.tilt||.92})`}),pet=G(k);
  for(let i=0;i<8;i++)P2(pet,48,15,c,{tr:`rotate(${f(i*45+R(-6,6))})`,tip:'notch',prof:u=>Math.min(1,.22+.88*u)*(u>.9?1-(u-.9)*2.5:1),n:8,rf:.05,rk:6,v:5,vo:.2,sh:.18,hl:.2,base:.55,bend:R(-.06,.06)});
  const d=disc(k,9.5,o.d||['#ffe680','#f2b705','#a86b00'],22);open(pet,t,1000,-25,.2);open(d,t+300,700,0,.3)}
function anemone(g,t,o){const c=o.c||['#cfcde3','#fbfbff','#ffffff','#6b6f8a'],k=G(g,{transform:`scale(1,${o.tilt||.9})`}),a=G(k),b=G(k);
  for(let i=0;i<6;i++)P2(i%2?b:a,46,27,c,{tr:`rotate(${f(i*60+R(-8,8))})`,prof:sinP(.55,.1),n:10,rf:.07,rk:5,v:7,vo:.12,sh:.15,hl:.12,base:.3});
  const ce=G(k);E('circle',{r:13,fill:rad(['#3b3f5a','#1b1630','#0b0814'],.4,.4,.7)},ce);
  for(let i=0;i<44;i++){const a2=R(0,6.283),r2=R(12.5,19.5);E('circle',{cx:f(Math.cos(a2)*r2),cy:f(Math.sin(a2)*r2),r:f(R(.9,1.8)),fill:'#141024',opacity:.92},ce)}
  for(let i=0;i<14;i++){const a2=R(0,6.283),r2=R(3,9);E('circle',{cx:f(Math.cos(a2)*r2),cy:f(Math.sin(a2)*r2),r:f(R(.8,1.4)),fill:'#646a90'},ce)}
  E('circle',{r:4.5,fill:rad(['#e0f5c8','#86b064','#3d5a2a'],.4,.4,.6)},ce);
  open(a,t,1000,-20,.2);open(b,t+120,1000,20,.2);open(ce,t+350,700,0,.3)}
function peony(g,t,o){const c=o.c||['#cf4f7e','#f7a8c4','#ffe6ee','#9a2f58'],k=G(g,{transform:`scale(1,${o.tilt||.86})`}),gs=[];
  [[8,60,36,.12,0],[8,50,32,.14,22],[7,40,28,.16,8],[6,30,22,.18,30]].forEach(([n,L,W,rf,off],j)=>{const rg=G(k);gs.push(rg);
    for(let i=0;i<n;i++)P2(rg,L*R(.9,1.08),W*R(.9,1.1),c,{tr:`rotate(${f(off+i*360/n+R(-9,9))})`,prof:sinP(.5,.08),n:12,rf,rk:R(9,14),v:j<2?6:0,vo:.14,sh:.22+j*.05,hl:.22,base:.45})});
  const hc=G(k);for(let j=14;j>=0;j--){const r=5+j*1.5,a=j*61+R(-10,10);E('path',{d:`M${f(-r)},0Q${f(-r*.3)},${f(-r*1.25)} ${f(r*.2)},${f(-r*1.1)}Q${f(r*1.1)},${f(-r*.9)} ${f(r)},0Q0,${f(-r*.5)} ${f(-r)},0Z`,fill:lin([c[0],c[1],c[2]],0,1,0,0),stroke:c[3],'stroke-width':.6,'stroke-opacity':.45,transform:`rotate(${f(a)}) translate(0,${f(r*.3)})`},hc)}
  gs.forEach((r,j)=>open(r,t+j*130,1100,(j%2?1:-1)*24,.3));open(hc,t+520,900,40,.4)}
/* side view, base (stem attach) at 0,0 */
function tulip(g,t,o){const c=o.c||['#6e0712','#e2232f','#ff7a6a','#4a040b'],k=G(g),back=G(k),front=G(k),prof=u=>Math.pow(Math.sin(Math.PI*Math.min(.96,.04+.92*u)),.55)*(.72+.38*u);
  const pet=(par,x,rot,L,W,sh)=>P2(par,L,W,c,{tr:`translate(${x},0) rotate(${rot})`,prof,n:10,rf:.025,rk:4,v:7,vo:.15,sh,hl:.32,base:.5,bend:R(-.04,.04)});
  pet(back,-7,-15,94,30,.32);pet(back,7,15,94,30,.32);pet(back,0,0,100,30,.2);
  E('ellipse',{cx:0,cy:-90,rx:15,ry:5,fill:c[3],opacity:.55},back);
  pet(front,-11,-8,86,33,.16);pet(front,11,8,86,33,.16);pet(front,0,1,82,31,.05);
  open(k,t,1000,0,.2)}
function calla(g,t,o){const c=o.c||['#8fb05e','#f4f7ec','#ffffff','#6f8060'],k=G(g);
  const sp=smooth([[0,0],[-6,-20],[-14,-45],[-24,-70],[-32,-92],[-28,-108],[-12,-116],[8,-114],[28,-106],[44,-94],[42,-80],[30,-70],[18,-52],[8,-28],[3,-10]]);
  E('path',{d:sp,fill:lin([[0,c[0]],[.4,c[1]],[1,c[2]]],0,1,.4,0)},k);
  E('path',{d:sp,fill:lin([[0,'#000',.18],[.5,'#000',0],[1,'#fff',.25]],0,0,1,0)},k);
  E('path',{d:smooth([[-24,-90],[-12,-104],[8,-106],[26,-98],[12,-90],[0,-80],[-10,-78]]),fill:lin([[0,'#d5e3bd'],[1,c[1]]],0,0,1,1),opacity:.95},k);
  E('path',{d:taper([[2,-40],[0,-60],[-2,-78],[4,-94]],u=>3.8*(1-u*.3),12),fill:lin([o.sx||'#e8940c','#ffd34d','#fff0a0'],0,1,0,0)},k);
  E('path',{d:smooth([[-30,-96],[-20,-110],[0,-116],[22,-110],[40,-96]],false),fill:'none',stroke:'#fff','stroke-width':2.2,'stroke-opacity':.75,'stroke-linecap':'round'},k);
  E('path',{d:sp,fill:'none',stroke:c[3],'stroke-width':.9,'stroke-opacity':.55},k);
  open(k,t,1000,-10,.2)}
function lilyStar(g,t,o){const c=o.c||['#f4c4d4','#ffffff','#fffafc','#b8a6b5'],sp=o.sp||{n:30,c:'#c8102e',p:1.5,s:1.1},k=G(g,{transform:`scale(1,${o.tilt||.88})`}),A=G(k),B=G(k),S2=G(k);
  for(let i=0;i<6;i++)P2(i%2?B:A,i%2?62:66,i%2?17:15,c,{tr:`rotate(${f(i*60+30+R(-6,6))})`,prof:sinP(.7),n:12,rf:.09,rk:7,tip:'point',bend:R(-.18,.18),v:3,vo:.25,vc:'#86b86a',sh:.16,hl:.15,base:.3,sp});
  E('circle',{r:7,fill:rad(['#e6f5c9','#9ccf6e','#5e8f3a'],.4,.4,.7)},k);
  for(let i=0;i<6;i++){const a=i*60+R(-14,14),l=R(48,62),bx=Math.sin(a*D)*l,by=-Math.cos(a*D)*l,cx=bx*.45+R(-10,10),cy=by*.45+R(-10,10);
    E('path',{d:`M0,0Q${f(cx)},${f(cy)} ${f(bx)},${f(by)}`,stroke:'#f4efe8','stroke-width':1.3,fill:'none','stroke-linecap':'round'},S2);
    E('ellipse',{cx:f(bx),cy:f(by),rx:2.2,ry:7.5,fill:lin([o.an||'#7a1020',o.an2||'#d4142e'],0,0,1,0),transform:`rotate(${f(a+90+R(-25,25))} ${f(bx)} ${f(by)})`},S2)}
  E('path',{d:'M0,0Q6,-24 2,-50',stroke:'#cfe3b0','stroke-width':2,fill:'none'},S2);E('circle',{cx:2,cy:-51,r:3.4,fill:'#8fbf5f'},S2);
  open(A,t,1000,-25,.2);open(B,t+150,1000,25,.2);open(S2,t+500,800,0,0)}
function morningGlory(g,t,o){const c=o.c||['#fff7d6','#8fb0ff','#2f4fe0','#1b2a8a'],k=G(g,{transform:`scale(1,${o.tilt||.9})`}),pts=[],ph=R(0,6);
  for(let i=0;i<60;i++){const a=i/60*Math.PI*2,r=52*(1-.07*Math.cos(a*5)+.025*Math.sin(a*13+ph));pts.push([Math.sin(a)*r,-Math.cos(a)*r])}
  const d=smooth(pts);E('path',{d,fill:rad([[0,c[0]],[.2,c[0]],[.36,c[1]],[1,c[2]]],.5,.5,.52)},k);
  E('path',{d,fill:rad([[0,'#fff',0],[.72,'#000',0],[1,'#000',.28]],.5,.5,.52)},k);
  for(let i=0;i<5;i++){const a=(i*72)*D,b=(i*72+36)*D;
    E('path',{d:`M${f(Math.sin(a)*12)},${f(-Math.cos(a)*12)}Q${f(Math.sin(a+.06)*30)},${f(-Math.cos(a+.06)*30)} ${f(Math.sin(a)*49)},${f(-Math.cos(a)*49)}`,stroke:'#ffffff','stroke-width':2.6,'stroke-opacity':.42,fill:'none','stroke-linecap':'round'},k);
    E('path',{d:`M${f(Math.sin(b)*14)},${f(-Math.cos(b)*14)}L${f(Math.sin(b)*48)},${f(-Math.cos(b)*48)}`,stroke:c[3],'stroke-width':.7,'stroke-opacity':.35},k)}
  E('circle',{r:9,fill:rad(['#fffbe0','#f7f0b0','#e8d880'],.5,.5,.6)},k);
  E('path',{d,fill:'none',stroke:c[3],'stroke-width':.9,'stroke-opacity':.55},k);open(k,t,1000,-30,.2)}
function marigold(g,t,o){const c=o.c||['#a8330a','#ff7a00','#ffc23a','#6e2004'],n=o.n||54,k=G(g,{transform:`scale(1,${o.tilt||.9})`}),rings=[G(k),G(k),G(k)];
  E('circle',{r:44,fill:c[3],opacity:.6},rings[0]);
  for(let i=n;i>=1;i--){const q=i/n,rr=36*Math.sqrt(q),a=i*137.508+R(-6,6),L=10+14*q,W=7+5*q;
    P2(rings[q>.62?0:q>.3?1:2],L,W,c,{tr:`rotate(${f(a)}) translate(0,${f(-rr+L*.3)})`,prof:sinP(.45,.1),n:6,rf:.12,rk:8,sh:.26,hl:.16,base:.5,sw:.5,so:.45})}
  rings.forEach((r,j)=>open(r,t+j*200,1000,(j%2?1:-1)*24,.3))}
function pansy(g,t,o){const c=o.c||['#2b0a55','#6a2cc4','#b892ff','#1a0535'],face=o.face||'#12031f',k=G(g,{transform:`scale(1,${o.tilt||.95})`}),A=G(k),B=G(k),F=G(k);
  const pp=(par,rot,L,W,cc)=>P2(par,L,W,cc||c,{tr:`rotate(${rot})`,prof:sinP(.48,.06),n:10,rf:.07,rk:5,sh:.18,hl:.16,base:.3});
  pp(A,-28,44,30,o.top);pp(A,28,44,30,o.top);pp(B,-100,40,26);pp(B,100,40,26);pp(B,180,42,32);
  if(o.blotch)E('ellipse',{cx:0,cy:15,rx:17,ry:14,fill:rad([[0,face,.95],[.7,face,.6],[1,face,0]],.5,.35,.6)},F);
  for(const[rot,len,n]of[[-100,25,5],[100,25,5],[180,30,7]]){const fg=G(F,{transform:`rotate(${rot})`});for(let i=0;i<n;i++){const u=i/(n-1)*2-1;E('path',{d:`M0,-3Q${f(u*6)},${f(-len*.5)} ${f(u*10)},${f(-len)}`,stroke:face,'stroke-width':f(1.6-Math.abs(u)*.6),'stroke-linecap':'round',fill:'none',opacity:.85},fg)}}
  E('path',{d:'M-5,1Q0,9 5,1Q0,4 -5,1Z',fill:'#ffd21f'},F);E('circle',{r:3.2,fill:'#ffd21f',stroke:'#a87b00','stroke-width':.6},F);
  open(A,t,900,-20,.2);open(B,t+120,900,20,.2);open(F,t+400,600,0,.4)}
function hydrangea(g,t,o){const c=o.c||[['#5f7fe8','#a3b8ff','#e6ecff','#3a4ea8'],['#8a76e0','#c2b3ff','#f0ebff','#4f3fa8']],k=G(g),L=[G(k),G(k)];
  E('ellipse',{rx:46,ry:40,fill:'#203458',opacity:.45},L[0]);const fl=[];
  for(let i=0;i<32;i++){const a=R(0,6.283),r=Math.sqrt(rnd())*40;fl.push([Math.cos(a)*r,Math.sin(a)*r*.86])}fl.sort((a,b)=>a[1]-b[1]);
  fl.forEach(([x,y],i)=>{const pal=c[i%c.length],s=R(.82,1.05)*(1.05-(y+40)/300),fg=G(L[i%2],{transform:`translate(${f(x)},${f(y)}) rotate(${f(R(0,90))}) scale(${f(s)})`});
    for(let j=0;j<4;j++)P2(fg,12,8,pal,{tr:`rotate(${j*90})`,prof:sinP(.45,.08),n:5,rf:.06,rk:4,lite:1,sw:.5,so:.45});E('circle',{r:1.4,fill:pal[3]},fg)});
  open(L[0],t,1000,-15,.3);open(L[1],t+200,1000,15,.3)}
/* spikes grow from the base at 0,0 */
function spike(g,t,o){const P=o.P||[[0,0],[4,-50],[-4,-100],[6,-150]],c=o.c,n=o.n||16,np=o.np||5,k=G(g);
  E('path',{d:cp(P),stroke:'#4f7a33','stroke-width':2.2,fill:'none','stroke-linecap':'round'},k);
  for(let i=0;i<n;i++){const u=.22+.78*i/(n-1),q=bz(P,u),s=(1-u*.5)*(o.s||1),side=i%2?1:-1,fg=G(k,{transform:`translate(${f(q[0]+side*R(2,7)*s)},${f(q[1])}) rotate(${f(R(0,72))}) scale(${f(s)})`});
    if(u>.9)E('ellipse',{rx:2.6,ry:4,fill:lin([c[3],c[1]],0,1,0,0)},fg);
    else{for(let j=0;j<np;j++)P2(fg,o.pl||9,o.pw2||6,c,{tr:`rotate(${j*360/np})`,prof:sinP(.45,.08),n:5,rf:.04,rk:4,lite:1,sw:.45,so:.5});E('circle',{r:1.5,fill:o.eye||'#ffd21f'},fg)}}
  open(k,t,1000,0,0)}
function cattleya(g,t,o){const c=o.c||['#e2d3f2','#fbf7ff','#ffffff','#a998c2'],lip=o.lip||['#c9a0d6','#fffaff','#ffd23f'],k=G(g),S=G(k),Pt=G(k),Lp=G(k);
  for(const r of[0,125,-125])P2(S,54,10,c,{tr:`rotate(${r+R(-6,6)})`,tip:'point',n:9,rf:.03,rk:3,v:3,vo:.12,sh:.15,hl:.18,base:.25});
  for(const s of[-1,1])P2(Pt,56,27,c,{tr:`rotate(${s*62+R(-5,5)})`,prof:sinP(.55,.06),n:12,rf:.14,rk:13,v:5,vo:.12,sh:.15,hl:.2,base:.3});
  const lp=[];for(let i=0;i<=40;i++){const a=(i/40-.5)*Math.PI*1.25,r=40*(1+.08*Math.sin(i*1.9+R(0,1)));lp.push([Math.sin(a)*r*.85,Math.cos(a)*r*.95])}
  const ld=smooth([[-12,-6],...lp,[12,-6]]);E('path',{d:ld,fill:rad([[0,lip[2]],[.32,lip[2]],[.55,lip[1]],[1,lip[0]]],.5,.15,.9)},Lp);
  for(let i=0;i<9;i++){const u=i/8*2-1;E('path',{d:`M${f(u*4)},2Q${f(u*14)},18 ${f(u*24)},${f(30+Math.abs(u)*4)}`,stroke:lip[0],'stroke-width':.7,'stroke-opacity':.5,fill:'none'},Lp)}
  E('path',{d:ld,fill:'none',stroke:lip[0],'stroke-width':.9,'stroke-opacity':.6},Lp);
  E('ellipse',{cx:0,cy:-2,rx:6,ry:9,fill:'#fffaf0',stroke:'#e8dcc8','stroke-width':.6},k);
  open(S,t,1000,-15,.2);open(Pt,t+120,1000,15,.2);open(Lp,t+300,900,0,.2)}
function paphio(g,t,o){const c=o.c||{dor:['#3d6b2f','#e8f5d0','#ffffff','#2d4a22'],pet:['#7a1d2e','#c0485a','#e8b8a8','#5a0f1d'],pouch:['#4a0f1d','#a3263d','#e88b8b']},k=G(g),A=G(k),B=G(k);
  const dd=petalD(52,30,{prof:sinP(.5,.06),n:10,rf:.05,rk:5}),dg=G(A);E('path',{d:dd,fill:lin([[0,c.dor[0]],[.6,c.dor[1]],[1,c.dor[2]]],0,1,0,0)},dg);
  for(let i=0;i<9;i++){const u=i/8*2-1;E('path',{d:`M${f(u*3)},-4Q${f(u*16)},-26 ${f(u*20)},-44`,stroke:c.dor[0],'stroke-width':1.3,'stroke-opacity':.7,fill:'none'},dg)}
  E('path',{d:dd,fill:'none',stroke:c.dor[3],'stroke-width':.8,'stroke-opacity':.6},dg);
  for(const s of[-1,1])P2(A,64,12,c.pet,{tr:`rotate(${s*(98+R(-6,6))})`,n:12,rf:.18,rk:9,bend:s*.12,v:2,vo:.3,sh:.2,hl:.15,base:.4,sp:{n:14,c:'#3a0610',s:.9,p:.8}});
  const pg=G(B,{transform:'translate(0,26)'});E('path',{d:'M-20,-14C-24,4 -16,26 0,28C16,26 24,4 20,-14C12,-20 -12,-20 -20,-14Z',fill:rad([[0,c.pouch[2]],[.55,c.pouch[1]],[1,c.pouch[0]]],.4,.3,.75)},pg);
  E('path',{d:'M-12,-6C-14,6 -10,16 -4,20',stroke:'#fff','stroke-width':2.2,'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},pg);E('path',{d:'M-20,-14C-12,-8 12,-8 20,-14',stroke:c.pouch[0],'stroke-width':1.2,fill:'none'},pg);
  E('ellipse',{cx:0,cy:4,rx:8,ry:6,fill:'#f5e9a8',stroke:'#c9b25a','stroke-width':.6},k);open(A,t,1000,-15,.2);open(B,t+250,900,0,.2)}
function danceLady(g){for(const r of[-40,40,-140,140,0])E('path',{d:petalD(8,3.5,{n:5}),fill:lin(['#6e3f00','#c99a1f','#ffd34d'],0,1,0,0),transform:`rotate(${r})`},g);
  E('path',{d:'M-11,2C-14,10 -10,18 0,19C10,18 14,10 11,2C6,6 -6,6 -11,2Z',fill:rad(['#fff3a0','#ffd21f','#e0a800'],.5,.3,.8),stroke:'#a87b00','stroke-width':.5},g);E('circle',{cy:2,r:2.4,fill:'#a35a00'},g)}
function oncidium(g,t,o){const P=o.spine||[[0,0],[10,-60],[40,-120],[80,-150]],k=G(g);E('path',{d:cp(P),stroke:'#6a7a3a','stroke-width':2,fill:'none'},k);
  [[.35,-1],[.5,1],[.62,-1],[.74,1],[.86,-1],[.96,1]].forEach(([u,s])=>{const q=bz(P,u),e=[q[0]+s*R(14,26),q[1]-R(6,20)];
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f((q[0]+e[0])/2)},${f(q[1]-8)} ${f(e[0])},${f(e[1])}`,stroke:'#6a7a3a','stroke-width':1.2,fill:'none'},k);
    for(const[dx,dy,s2]of[[0,0,1],[s*-10,7,.85]])danceLady(G(k,{transform:`translate(${f(e[0]+dx)},${f(e[1]+dy)}) rotate(${f(R(-15,15))}) scale(${f(s2*.9)})`}))});
  open(k,t,1000,0,0)}
function sunflower(g,t,o){const c=o.c||['#c27c00','#ffc21a','#ffe680','#8a5200'],k=G(g,{transform:`scale(1,${o.tilt||.9})`}),A=G(k),B=G(k),d=G(k);
  for(let i=0;i<22;i++)P2(i%2?B:A,40,9,c,{tr:`rotate(${f(i*360/22+R(-4,4))}) translate(0,-20)`,tip:'point',n:8,rf:.05,rk:4,v:3,vo:.18,sh:.2,hl:.15,base:.4,bend:R(-.12,.12)});
  E('circle',{r:26,fill:rad(['#5a2d0c','#3a1a06','#1e0c02'],.45,.4,.7)},d);
  for(let i=0;i<110;i++){const q=Math.sqrt((i+.5)/110)*24,a=i*137.508*D;E('circle',{cx:f(Math.cos(a)*q),cy:f(Math.sin(a)*q),r:f(.9+q/24*.9),fill:i%3?'#6b3a12':'#8a5a1f'},d)}
  E('circle',{r:26,fill:'none',stroke:'#2a1203','stroke-width':1.2},d);open(A,t,1000,-20,.2);open(B,t+120,1000,20,.2);open(d,t+300,800,0,.4)}
