
/* ---------- flowers A : tropical structure ---------- */
/* dyed sun-palm fan: opens like a hand fan */
function palmFan(g,t,o){const c=o.c||['#ffd6e6','#ff5fa8','#a3239a'],n=o.n||58,a0=-105,a1=105,secs=8;
  const st=radU([[0,c[0]],[.4,c[1]],[1,c[2]]],104);
  E('circle',{r:19,fill:'none',stroke:st,'stroke-width':5},g);
  E('path',{d:'M0,19 Q-4,40 -2,62',stroke:c[2],'stroke-width':4,fill:'none','stroke-linecap':'round'},g);
  const S=[];for(let i=0;i<secs;i++){const ac=a0+(a1-a0)*(i+.5)/secs,pg=G(g,{transform:`rotate(${f(ac)})`}),sg=G(pg);S.push([sg,ac]);open(sg,t+120+Math.abs(i-3.5)*60,1150,-ac,.55)}
  for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/(n-1),si=Math.min(secs-1,Math.floor((a-a0)/(a1-a0)*secs)),[sg,ac]=S[si];
    const rel=(a-ac)*D,r0=21+R(0,3),r1=96+R(-5,8)-Math.pow(Math.abs(a)/110,3)*28,bend=R(-3,3);
    const x0=Math.sin(rel)*r0,y0=-Math.cos(rel)*r0,x1=Math.sin(rel)*r1,y1=-Math.cos(rel)*r1;
    E('path',{d:`M${f(x0)},${f(y0)}Q${f((x0+x1)/2+bend)},${f((y0+y1)/2)} ${f(x1)},${f(y1)}`,stroke:st,'stroke-width':f(R(1.5,2.6)),'stroke-linecap':'round',fill:'none'},sg)}
}
/* electric-blue dyed palm spears */
function blades(g,t,o){const n=o.n||7,A=o.a||[-40,40],c=o.bc||['#0a2a8a','#1460d8','#3cc0ff'];
  for(let i=0;i<n;i++){const a=A[0]+(A[1]-A[0])*(n==1?.5:i/(n-1))+R(-5,5),len=(o.l||220)*R(.75,1.1),w=(o.bw||16)*R(.8,1.15),bend=R(-35,35);
    const pg=G(g,{transform:`rotate(${f(a)})`}),k=G(pg),P=[[0,0],[bend*.2,-len*.35],[bend*.7,-len*.7],[bend,-len]];
    E('path',{d:taper(P,u=>w*Math.pow(Math.sin(Math.PI*(.12+.88*u)),.8)*(1-u*.35),26),fill:lin(c,0,1,0,0)},k);
    for(const s of[-.5,0,.5])E('path',{d:cp(P.map((p,j)=>[p[0]+s*w*Math.sin(Math.PI*(.12+.88*j/3)),p[1]])),stroke:s?c[2]:'#c6ecff','stroke-width':s?.8:1.2,'stroke-opacity':.55,fill:'none'},k);
    open(k,t+i*60,850,0,0)}
}
/* heliconia (lobster claw) */
function heliconia(g,t,o){const n=o.n||6,H=o.h||210,c=o.hc||['#b50f2a','#ff3b1f','#ff8a1f','#ffd23a'],rim=o.rim||'#c9e24c';
  E('path',{d:taper([[0,0],[4,-H*.3],[-4,-H*.7],[0,-H]],u=>4.5*(1-u*.6),14),fill:'#6b8f2c'},g);
  for(let i=0;i<n;i++){const side=i%2?-1:1,y=-H*(i/n)*.92-6,s=1-i*.11,L=80*s;
    const pg=G(g,{transform:`translate(${side*3},${f(y)}) scale(${side},1) rotate(${-16-i*3})`}),k=G(pg);
    E('path',{d:`M0,0C${f(L*.25)},${f(L*.32)} ${f(L*.8)},${f(L*.22)} ${f(L)},${f(-L*.42)}C${f(L*.72)},${f(-L*.12)} ${f(L*.36)},${f(-L*.16)} 0,${f(-L*.2)}Z`,fill:lin(c,0,0,1,0)},k);
    E('path',{d:`M${f(L*.1)},${f(-L*.06)}C${f(L*.4)},${f(-L*.02)} ${f(L*.7)},${f(-L*.02)} ${f(L*.9)},${f(-L*.3)}`,stroke:'#7a0a1c','stroke-width':f(4*s),'stroke-opacity':.25,fill:'none'},k);
    E('path',{d:`M${f(L*.06)},${f(-L*.17)}C${f(L*.38)},${f(-L*.12)} ${f(L*.72)},${f(-L*.09)} ${f(L*.98)},${f(-L*.4)}`,stroke:rim,'stroke-width':f(3.2*s+1),fill:'none','stroke-linecap':'round'},k);
    E('path',{d:`M${f(L*.14)},${f(L*.07)}C${f(L*.4)},${f(L*.2)} ${f(L*.75)},${f(L*.1)} ${f(L*.93)},${f(-L*.3)}`,stroke:'#fff3b0','stroke-width':1.6,'stroke-opacity':.45,fill:'none'},k);
    open(k,t+150+i*110,800,-35,.15)}
}
/* bird of paradise */
function strelitzia(g,t,o){const sp=['#3f7a33','#6b3d6e','#b0336a','#ee6a86'],se=['#ff4d12','#ff9a1f','#ffd04a'];
  [[-48,96],[-27,114],[-8,108],[12,90]].forEach(([a,l],i)=>{const pg=G(g,{transform:`translate(${56+i*6},-13) rotate(${a})`}),k=G(pg);
    E('path',{d:pet(l,10+i%2*2,.5,.1),fill:lin(se,0,1,0,0)},k);E('path',{d:`M0,-4L0,${f(-l*.9)}`,stroke:'#fff2c0','stroke-opacity':.5,'stroke-width':1},k);
    open(k,t+250+i*120,850,72-a,.2)});
  for(const[a,x]of[[-14,66],[4,74]]){const pg=G(g,{transform:`translate(${x},-14) rotate(${a})`}),k=G(pg);
    E('path',{d:`M0,0C6,-20 5,-50 2,-74C-1,-50 -6,-20 0,0Z`,fill:lin(['#141a8c','#2f4bff','#8fa8ff'],0,1,0,0)},k);open(k,t+650,800,60,0)}
  E('path',{d:'M0,0C40,-12 100,-20 162,-46C126,-10 66,12 0,16Z',fill:lin(sp,0,0,1,0)},g);
  E('path',{d:'M6,2C46,-9 100,-17 150,-39',stroke:'#f6c1d4','stroke-width':1.4,'stroke-opacity':.6,fill:'none'},g);
}
/* anthurium */
function anthurium(g,t,o){const c=o.c||['#fff3a0','#ffb35c','#ff7aa2','#e2457f','#b8245e'],k=G(g);
  E('path',{d:'M0,18C-18,38 -62,40 -70,6C-78,-30 -40,-70 0,-104C40,-70 78,-30 70,6C62,40 18,38 0,18Z',fill:rad(c,.5,.82,.78,.5,.86)},k);
  for(const s of[-1,1])for(const v of[[28,-34,34,-84],[52,-10,58,-44],[24,8,54,6]])E('path',{d:`M0,16Q${s*v[0]},${v[1]} ${s*v[2]},${v[3]}`,stroke:'#a8164f','stroke-opacity':.25,'stroke-width':1.5,fill:'none'},k);
  E('path',{d:'M0,16Q4,-40 0,-100',stroke:'#a8164f','stroke-opacity':.3,'stroke-width':2,fill:'none'},k);
  E('path',{d:'M-36,-46C-32,-70 -16,-84 -5,-91C-17,-70 -23,-58 -27,-38Z',fill:'#fff',opacity:.38},k);
  const sp=G(k),SP=[[0,14],[6,-12],[18,-34],[34,-54]];
  E('path',{d:taper(SP,u=>7*(1-u*.55)+1.5,16),fill:lin(['#ffe066','#ffb020','#ff7a1a'],0,1,1,0)},sp);
  for(let i=0;i<16;i++){const p=bz(SP,i/16);E('circle',{cx:f(p[0]+R(-2.5,2.5)),cy:f(p[1]+R(-2.5,2.5)),r:1.1,fill:'#fff6c0',opacity:.75},sp)}
  open(k,t,1000,-20,.2);open(sp,t+500,700,30,0)}
/* glossy leaf */
function leaf(g,t,o){const l=o.l||90,w=o.lw||26,c=o.lc||['#2f6a2a','#4f9a3a','#9fd35a'],k=G(g);
  E('path',{d:pet(l,w,.55,.12),fill:lin(c,0,1,1,0)},k);
  E('path',{d:`M0,0Q${f(w*.12)},${f(-l*.5)} 0,${f(-l*.97)}`,stroke:'#d8f0a0','stroke-opacity':.6,'stroke-width':1.3,fill:'none'},k);
  for(let i=1;i<6;i++){const y=-l*i/6.5;for(const s of[-1,1])E('path',{d:`M0,${f(y)}Q${f(s*w*.4)},${f(y-l*.06)} ${f(s*w*.75)},${f(y-l*.16)}`,stroke:'#d8f0a0','stroke-opacity':.35,'stroke-width':.9,fill:'none'},k)}
  open(k,t,900,o.ls??25,0)}
/* twisted dyed leaf */
function curl(g,t,o){const P=o.P,w=o.cw||12,c=o.cc||['#5b2a86','#9a6bd6','#d3b8ff'],k=G(g);
  E('path',{d:taper(P,u=>w*(.22+.78*Math.abs(Math.cos(u*Math.PI*(o.tw||1.6))))*(1-u*.7)+.8,44),fill:lin(c,0,1,1,0)},k);
  E('path',{d:cp(P),stroke:c[2],'stroke-opacity':.45,'stroke-width':1,fill:'none'},k);
  open(k,t,1200,o.cs??-12,0)}
/* cut green stalk */
function stalk(g,t,o){const l=o.l||200,w=o.sw||9,k=G(g);
  E('path',{d:`M0,0L0,${-l}`,stroke:'#82ac3e','stroke-width':w},k);
  E('path',{d:`M${-w*.22},0L${-w*.22},${-l}`,stroke:'#d6eb92','stroke-width':1.6,'stroke-opacity':.7},k);
  E('ellipse',{cx:0,cy:-l,rx:w/2,ry:2.2,fill:'#e9f5b8'},k);
  open(k,t,1000,0,0)}
