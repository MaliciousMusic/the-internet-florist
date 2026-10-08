
/* ================= Atelier v3 — anthurium, calla, phalaenopsis, cymbidium ================= */
const q20=v=>Math.round(v*20)/20;
/* ---------- Anthurium: glossy quilted heart spathe, embossed veins, dotted spadix. centred on the spathe ---------- */
function anthD(L,W,as){const pr=s=>[[.1,.07],[.36,.14],[.7,.1],[.94,-.03],[1,-.22],[.92,-.42],[.7,-.62],[.42,-.8],[.17,-.93]].map(([x,y])=>[s*x*W*(1+s*as),y*L]);
  return smooth([[0,0],...pr(1),[W*.03,-L],...pr(-1).reverse()])}
const anW=t=>t<.2?1:Math.max(.04,1-Math.pow((t-.2)/.8,1.5));
function anthBody(h,L,W,c,as,gl=1){const d=anthD(L,W,as);
  E('path',{d,fill:rad([[0,c[3]],[.5,c[2]],[1,c[1]]],.46,.4,.7)},h);
  E('path',{d,fill:rad([[0,c[0],.7],[.5,c[0],.25],[1,c[0],0]],.5,.92,.42)},h);
  E('path',{d,fill:lin([[0,'#fff',.12],[.3,'#fff',0],[.62,c[0],0],[1,c[0],.32]],0,0,1,.15)},h);
  let vd='';for(const s of[-1,1]){for(const m of[.9,.74,.56]){const P=[[s*1.2,-L*.02],[s*W*m*1.05,L*.07],[s*W*m*1.08,-L*.34],[s*W*.02,-L*.985]];vd+=cp(P)}
    for(let i=0;i<5;i++){const t0=.1+i*.15,te=Math.min(.95,t0+.2),xe=s*W*anW(te)*R(.5,.6);vd+=`M${f(s*.8)},${f(-L*t0)}Q${f(xe*.55)},${f(-L*(t0+.05))} ${f(xe)},${f(-L*te)}`}}
  vd+=`M0,${f(-L*.02)}C${f(W*.04)},${f(-L*.4)} ${f(W*.02)},${f(-L*.7)} ${f(W*.03)},${f(-L*.97)}`;
  E('path',{d:vd,stroke:c[0],'stroke-width':f(L/80),'stroke-opacity':.42,fill:'none','stroke-linecap':'round'},h);
  E('path',{d:vd,stroke:c[4],'stroke-width':f(L/150),'stroke-opacity':.34,fill:'none','stroke-linecap':'round',transform:'translate(-.9,-.7)'},h);
  for(let i=0;i<5;i++)for(const s of[-1,1]){const tt=.12+i*.14;glint(h,s*W*anW(tt+.06)*R(.35,.55),-L*(tt+.07),W*.1*(1-i*.1),L*.05,s*R(20,40),q20(R(.18,.34)*gl))}
  glint(h,-W*.5,-L*.22,W*.22,L*.08,-35,.5*gl);glint(h,W*.15,-L*.62,W*.08,L*.12,20,q20(.32*gl));
  E('path',{d,fill:'none',stroke:c[4],'stroke-width':1.3,'stroke-opacity':.35},h);
  E('path',{d,fill:'none',stroke:c[0],'stroke-width':.7,'stroke-opacity':.7},h)}
function xAnth(g,t,o){const c=o.c||['#2a020a','#5c0a1c','#8e1430','#c23a54','#f2a6b4'],sp=o.sp||['#f3e6c2','#c9a96a'],L=o.L||94,W=o.W||42,k=G(g),h=G(k,{transform:`translate(0,${f(L*.44)})`});
  anthBody(h,L,W,c,R(-.06,.06));
  const s2=o.side??(rnd()<.5?-1:1),cv=R(.6,1.2),P=[[0,-L*.04],[s2*W*.05,-L*.2],[s2*W*.2*cv,-L*.36],[s2*W*.36*cv,-L*.5]];
  ao(h,P[3][0]*.6+2,P[3][1]*.6+3,W*.16,L*.2,.3);spadix(h,P,6.4,4,sp[0],sp[1]);
  open(k,t,1000,-8,.3)}
/* sculptural anthurium leaf for foliage: heart blade on a petiole (grows up from 0,0) */
function xAnthLeaf(g,t,o){const L=o.L||150,W=o.W||66,c=o.c||['#08140c','#173a22','#2f6a3c','#5f9a5a','#a9d49a'],k=G(g),pl=o.pl??60;
  stem3(k,[[0,0],[2,-pl*.4],[-2,-pl*.75],[0,-pl]],3,2.2);const h=G(k,{transform:`translate(0,${-pl}) rotate(${f(o.rot??R(-25,25))}) scale(1,${f(o.tilt??R(.8,.95))})`});
  anthBody(h,L,W,c,R(-.05,.05),.8);open(k,t,900,8,.3)}

/* ---------- Calla: rolled spathe from the side, base at 0,0, mouth ~ -100 ---------- */
function xCalla(g,t,o){const c=o.c||['#3a4a1a','#b9c48f','#eef0dc','#ffffff','#ffffff'],ic=o.ic||['#c9cf9a','#f6f6e6'],nk=o.nk||'#6f8a3a',sp=o.sp||'#f0b72a',k=G(g),m=o.m??(rnd()<.5?1:-1),h=G(k,{transform:`scale(${m},1)`});
  E('path',{d:'M-3.2,0C-3.6,-14 -5,-30 -8,-44L8,-46C5,-30 3.6,-14 3.2,0Z',fill:lin([[0,dk(nk,.2)],[1,mix(nk,c[1],.5)]],0,1,0,0)},h);
  E('path',{d:'M-1.6,0C-1.8,-14 -2.6,-30 -4.4,-44',stroke:'#fff','stroke-width':.8,'stroke-opacity':.3,fill:'none'},h);
  const inner='M-30,-96C-27,-110 -8,-119 10,-120C17,-124 22,-131 27,-139C28,-125 30,-112 31,-103C24,-96 16,-91 3,-89C-10,-88 -24,-91 -30,-96Z';
  E('path',{d:inner,fill:lin([[0,ic[0]],[.45,ic[1]],[1,lt(ic[1],.25)]],0,1,0,0)},h);
  E('path',{d:inner,fill:rad([[0,c[0],.6],[1,c[0],0]],.42,.95,.5)},h);
  glint(h,-6,-108,10,3,-12,.25);
  spadix(h,[[1,-84],[1.2,-95],[2.4,-105],[3.6,-113]],5,3.4,lt(sp,.2),sp);
  const face='M-3,-40C-8,-56 -17,-72 -24,-84C-27,-89 -30,-93 -31,-96C-24,-91 -10,-87 3,-89C16,-91 24,-96 31,-103C27,-90 20,-74 14,-58C11,-50 8,-44 3,-40Z';
  E('path',{d:face,fill:lin([[0,mix(nk,c[1],.35)],[.32,c[1]],[.62,c[2]],[1,c[3]]],0,1,.2,0)},h);
  E('path',{d:face,fill:lin([[0,c[0],.32],[.3,c[0],0],[.55,'#fff',0],[.75,'#fff',.12],[1,c[0],.36]],0,0,1,0)},h);
  E('path',{d:'M-31,-96C-24,-91 -10,-87 3,-89C16,-91 24,-96 31,-103',stroke:c[4],'stroke-width':2.4,'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},h);
  E('path',{d:'M-29,-93C-22,-89 -10,-85.5 3,-87C14,-88.5 22,-93 29,-99',stroke:c[0],'stroke-width':.8,'stroke-opacity':.35,fill:'none'},h);
  glint(h,-12,-70,3.2,16,-24,.6);glint(h,15,-66,1.6,9,18,.3);
  E('path',{d:face,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.55},h);
  E('path',{d:inner,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.4},h);
  E('path',{d:'M14,-121C19,-125 23,-131 27,-139',stroke:c[0],'stroke-width':.7,'stroke-opacity':.5,fill:'none'},h);
  open(k,t,1000,6,.3)}

/* ---------- Phalaenopsis: moth orchid facing the viewer, radius R ---------- */
function xPhal(g,t,o){const c=o.c||['#5a2a46','#e9d6e4','#fbf4f8','#ffffff','#ffffff'],lp=o.lip||['#6a0f3a','#c2306e','#ffd23f'],R0=o.R||34,k=G(g),rv=o.ret||0;
  const pt={v:rv?11:4,vo:rv?.5:.16,vc:o.vc||c[0],vw:rv?.5:.4,sh:.7,base:.32,rim:.6,rs:.6,sw:.45,so:.35,tip:'round'};
  for(const s of[-1,1])pp(k,R0*.84,R0*.27,c,Object.assign({},pt,{tr:`rotate(${s*128+R(-4,4)})`,prof:sinP(.7,.05),bend:s*.04}));
  pp(k,R0*.88,R0*.28,c,Object.assign({},pt,{tr:`rotate(${R(-4,4)})`,prof:sinP(.7,.05)}));
  for(const s of[-1,1])pp(k,R0*.92,R0*.5,c,Object.assign({},pt,{tr:`rotate(${s*72+R(-5,5)})`,prof:sinP(.5,.04),asym:-.06,v:rv?14:6}));
  const L=G(k),lc=tones(lp[1]);for(const s of[-1,1])pp(L,R0*.36,R0*.12,lc,{tr:`rotate(${180+s*38})`,prof:sinP(.6),tip:'round',v:3,vo:.5,vc:lp[0],base:.3,rim:.4});
  const r=R0,ml=`M0,0C${f(r*.1)},${f(r*.12)} ${f(r*.06)},${f(r*.24)} ${f(r*.2)},${f(r*.36)}C${f(r*.16)},${f(r*.46)} ${f(r*.06)},${f(r*.5)} 0,${f(r*.54)}C${f(-r*.06)},${f(r*.5)} ${f(-r*.16)},${f(r*.46)} ${f(-r*.2)},${f(r*.36)}C${f(-r*.06)},${f(r*.24)} ${f(-r*.1)},${f(r*.12)} 0,0Z`;
  E('path',{d:ml,fill:lin([[0,lp[0]],[.5,lp[1]],[1,lt(lp[1],.2)]],0,0,0,1)},L);E('path',{d:ml,fill:'none',stroke:lp[0],'stroke-width':.5,'stroke-opacity':.6},L);
  glint(L,-r*.05,r*.36,r*.05,r*.03,0,.4);
  for(const s of[-1,1])E('path',{d:`M${f(s*r*.03)},${f(r*.52)}C${f(s*r*.08)},${f(r*.64)} ${f(s*r*.2)},${f(r*.6)} ${f(s*r*.14)},${f(r*.54)}`,stroke:lp[1],'stroke-width':.8,fill:'none','stroke-linecap':'round'},L);
  E('ellipse',{cx:0,cy:f(r*.1),rx:f(r*.09),ry:f(r*.07),fill:lp[2]},L);for(let i=0;i<6;i++)E('circle',{cx:f(R(-.07,.07)*r),cy:f(r*R(.06,.15)),r:.45,fill:lp[0]},L);
  E('path',{d:`M${f(-r*.08)},${f(r*.04)}C${f(-r*.1)},${f(-r*.12)} ${f(r*.1)},${f(-r*.12)} ${f(r*.08)},${f(r*.04)}Z`,fill:lin(['#d9d2cc','#ffffff'],0,1,0,0),stroke:'#a99a9a','stroke-width':.4},k);
  E('ellipse',{cx:0,cy:f(-r*.05),rx:f(r*.045),ry:f(r*.035),fill:o.cap||'#f0c8d8'},k);
  open(k,t,900,14,.25)}
/* orchid buds */
function obud(par,x,y,r,rot,c){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(rot)})`});
  E('ellipse',{cx:0,cy:0,rx:f(r*.78),ry:f(r),fill:rad([[0,lt(c,.5)],[.6,c],[1,dk(c,.35)]],.38,.35,.75)},g);E('path',{d:`M0,${f(-r)}Q${f(r*.25)},0 0,${f(r)}`,stroke:dk(c,.4),'stroke-width':.5,'stroke-opacity':.5,fill:'none'},g);glint(g,-r*.3,-r*.35,r*.2,r*.3,-20,.5)}
/* a spray: stem arching up (or hanging when o.hang) with flowers graded to buds */
function spray(g,t,o,fn,bc){const n=o.n||6,Lh=o.len||210,s=o.side??(rnd()<.5?-1:1),k=G(g),sc0=o.fs||1;
  const P=o.hang?[[0,0],[s*Lh*.22,Lh*.04],[s*Lh*.42,Lh*.42],[s*Lh*.34,Lh]]:[[0,0],[s*Lh*.05,-Lh*.55],[s*Lh*.4,-Lh*.94],[s*Lh*.88,-Lh*.8]];
  stem3(k,P,3.2,1.6,o.sc||['#2a3418','#4d5c2c','#77864a','#b4c07e']);const nb=3,tot=n+nb,u0=o.u0??.36;
  for(let i=tot-1;i>=0;i--){const u=u0+(1-u0-.03)*i/(tot-1),q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),ang=Math.atan2(q2[1]-q[1],q2[0]-q[0]),side=i%2?1:-1,nx=-Math.sin(ang)*side,ny=Math.cos(ang)*side;
    if(i>=n){const r=3.2+(tot-i)*1.4;obud(k,q[0]+nx*r*.6,q[1]+ny*r*.6,r,ang/D+90,bc);continue}
    const sc=sc0*(1-.3*i/Math.max(1,n-1)),off=8*sc,x=q[0]+nx*off,y=q[1]+ny*off;
    E('path',{d:`M${f(q[0])},${f(q[1])}L${f(x)},${f(y)}`,stroke:'#5c6b34','stroke-width':1.2},k);
    fn(G(k,{transform:`translate(${f(x)},${f(y)}) rotate(${f(R(-18,18))}) scale(${f(sc)})`}),t+i*70,o)}
  open(k,t,1100,0,.6)}
function xPhalSpray(g,t,o){spray(g,t,o,xPhal,(o.c||[])[3]||'#f4eef2')}
/* compact cluster used as a bouquet head */
function xPhalCluster(g,t,o){const k=G(g);E('path',{d:'M0,0Q-6,-14 -24,-8M0,0Q14,-6 22,-22M-24,-8Q-28,-22 -30,-34M0,0L4,12',stroke:'#4f6a3a','stroke-width':2,'stroke-linecap':'round',fill:'none'},k);obud(k,-30,-34,5,-30,(o.c||[])[3]||'#f4eef2');
  for(const[x,y,s,r]of[[22,-22,.78,14],[-24,-8,.86,-10],[4,12,1,4]])xPhal(G(k,{transform:`translate(${x},${y}) rotate(${r}) scale(${s})`}),t,o)}

/* ---------- Cymbidium: waxy tepals, spotted tongue lip, curved column ---------- */
function xCymb(g,t,o){const c=o.c||tones('#c8714c'),lp=o.lip||['#7a0f22','#fff1df','#c2304a'],R0=o.R||30,k=G(g);
  const pt={v:7,vo:.26,vc:c[0],vw:.4,sh:.9,base:.45,rim:.55,sw:.5,so:.45,prof:sinP(.55,.06),tip:'round'};
  for(const a of[-128,128])pp(k,R0*.92,R0*.31,c,Object.assign({},pt,{tr:`rotate(${a+R(-5,5)})`,bend:a>0?.05:-.05}));
  pp(k,R0*.96,R0*.32,c,Object.assign({},pt,{tr:`rotate(${R(-6,6)})`,bend:R(-.06,.06)}));
  for(const a of[-56,56])pp(k,R0*.88,R0*.3,c,Object.assign({},pt,{tr:`rotate(${a+R(-5,5)})`,bend:a>0?-.08:.08}));
  for(const a of[-130,0,130,-60,60]){const r=a*D;glint(k,Math.sin(r)*R0*.45,-Math.cos(r)*R0*.45,R0*.05,R0*.16,a,.35)}
  const r=R0,L=G(k);for(const s of[-1,1])pp(L,r*.3,r*.13,tones(lp[2]),{tr:`translate(${f(s*r*.06)},${f(r*.02)}) rotate(${180+s*24})`,prof:sinP(.6),tip:'round',v:4,vo:.6,vc:lp[0],base:.2,rim:.3});
  const tg=`M${f(-r*.15)},${f(r*.05)}C${f(-r*.22)},${f(r*.2)} ${f(-r*.26)},${f(r*.4)} ${f(-r*.14)},${f(r*.52)}C${f(-r*.06)},${f(r*.6)} ${f(r*.06)},${f(r*.6)} ${f(r*.14)},${f(r*.52)}C${f(r*.26)},${f(r*.4)} ${f(r*.22)},${f(r*.2)} ${f(r*.15)},${f(r*.05)}Z`;
  E('path',{d:tg,fill:lin([[0,dk(lp[1],.15)],[1,lp[1]]],0,0,0,1)},L);
  let dd='';for(let i=0;i<34;i++){const a=R(0,1),x=R(-.19,.19)*r*(1-a*.3),y=r*(.12+a*.42);dd+=`M${f(x-.6)},${f(y)}a.6,.75 0 1,0 1.2,0a.6,.75 0 1,0 -1.2,0`}E('path',{d:dd,fill:lp[0],opacity:.85},L);
  E('path',{d:`M${f(-r*.13)},${f(r*.5)}C${f(-r*.05)},${f(r*.57)} ${f(r*.05)},${f(r*.57)} ${f(r*.13)},${f(r*.5)}`,stroke:lt(lp[1],.4),'stroke-width':1.6,'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},L);
  E('path',{d:tg,fill:'none',stroke:lp[0],'stroke-width':.5,'stroke-opacity':.5},L);
  E('path',{d:`M${f(-r*.07)},${f(r*.12)}C${f(-r*.1)},${f(-r*.08)} ${f(-r*.04)},${f(-r*.2)} 0,${f(-r*.2)}C${f(r*.04)},${f(-r*.2)} ${f(r*.1)},${f(-r*.08)} ${f(r*.07)},${f(r*.12)}Z`,fill:lin(['#e8d4b4','#fff8ec'],0,1,0,0),stroke:'#8a6a50','stroke-width':.4},k);
  for(let i=0;i<5;i++)E('circle',{cx:f(R(-.04,.04)*r),cy:f(r*R(-.12,.08)),r:.4,fill:lp[0]},k);E('ellipse',{cx:0,cy:f(-r*.17),rx:f(r*.05),ry:f(r*.04),fill:'#f2d24a'},k);
  open(k,t,900,12,.3)}
function xCymbSpray(g,t,o){spray(g,t,Object.assign({u0:.3,n:7,fs:1.05},o),xCymb,o.bud||'#c8c47a')}
function xCymbCluster(g,t,o){const k=G(g);for(const[x,y,s,r]of[[-20,-20,.86,-18],[20,-24,.9,16],[0,-40,.76,4],[18,10,1,8],[-16,12,1.06,-6]])xCymb(G(k,{transform:`translate(${x},${y}) rotate(${r}) scale(${s})`}),t,o)}
