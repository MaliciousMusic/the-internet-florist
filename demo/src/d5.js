
/* ================= Views & stages: face, three-quarter, profile, back, half open, bud ================= */
const CALYX=['#1c3416','#365e26','#628c40','#a6c67a','#c8e09a'];
const DEFC3={xRose:'#f2c6b6',xRanunc:'#f07a3a',xDahlia:'#8e1a3a',xCarn:'#eba3b2',xMum:'#c98ab8',xLily:'#d8306a',xGlor:'#e0203e'};
const palOf=(f0,o)=>o.c||(f0==='xScab'?['#12020a','#2e0818','#4e1028','#74284a','#b06a88']:tones(DEFC3[f0]||'#e8a0b0'));
/* reverse side of petals: paler, slightly green at the base */
const backT=c=>[c[0],mix(c[1],'#8a9a6a',.1),mix(c[2],'#ffffff',.16),lt(c[3],.14),c[4]];
/* green calyx cupping the base, pointing up from 0,0 */
function calyx(par,w,h,n=5,c=CALYX,spread=50){const g=G(par);for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0;pp(g,h*R(.85,1.1),w*.3,c,{tr:`rotate(${f(u*spread)})`,prof:sinP(.6,.06),tip:'point',v:1,vo:.3,cup:1,sh:.8,base:.3,rim:.35,so:.5,bend:u*.25})}
  E('ellipse',{cx:0,cy:f(h*.06),rx:f(w*.34),ry:f(h*.2),fill:rad([[0,c[3]],[.6,c[2]],[1,c[0]]],.4,.3,.75)},g);return g}
/* one petal of the outer ring, by family: round (rose, ranunculus), point (dahlia), fan (carnation), quill (mum), ruffle (scabiosa) */
function ringPetal(par,kind,L,c,tr){const o={tr,sh:.9,base:.55,bl:.42,rim:.6,so:.45,cup:1};
  if(kind==='point')return pp(par,L,L*.3,c,Object.assign(o,{prof:sinP(.62,.1),tip:'point',v:1,vo:.38}));
  if(kind==='fan')return pp(par,L,L*.5,c,Object.assign(o,{d:fanD(L,L*.5,11),prof:sinP(.6,.2),mp:.55}));
  if(kind==='quill'){const g=G(par,{transform:tr});E('path',{d:taper([[0,0],[1,-L*.35],[2,-L*.72],[3,-L]],u=>1.2+1.1*u,10),fill:lin([[0,c[1]],[.5,c[2]],[1,c[3]]],0,1,0,0),stroke:c[0],'stroke-width':.35,'stroke-opacity':.45},g);
    E('path',{d:`M${f(4.4)},${f(-L+1)}c1,-4 -5,-4.4 -3.8,1`,stroke:c[3],'stroke-width':2.4,fill:'none','stroke-linecap':'round'},g);return g}
  if(kind==='ruffle')return pp(par,L,L*.34,c,Object.assign(o,{prof:sinP(.4,.25),tip:'notch',rf:.12,rk:6,v:4,vo:.25}));
  return pp(par,L,L*.56,c,Object.assign(o,{prof:sinP(.42,.12),tip:'round',rf:.03,rk:3,v:6,vo:.1}))}
const RING={xRose:'round',xRanunc:'round',xDahlia:'point',xCarn:'fan',xMum:'quill',xScab:'ruffle',peony:'round',anemone:'round',cosmos:'round'};
const RAD={xRose:40,xRanunc:32,xDahlia:46,xCarn:30,xMum:46,xScab:26,peony:44,anemone:38,cosmos:36};
/* three-quarter / profile of a radial bloom: the backs of the near petals form a bowl, the face sits tilted on top */
function tiltView(g,t,o,f0,sq){const R0=(o.R||RAD[f0]||40),c=palOf(f0,o),bc=backT(c),kind=RING[f0]||'round',k=G(g),deep=sq<.45;
  const bw=G(k);if(deep&&(f0==='xRose'||f0==='xRanunc'||f0==='xCarn'))calyx(bw,R0*.55,R0*.5,5,CALYX,58);
  const n=deep?9:7;for(let i=0;i<n;i++){const a=(deep?8:22)+i*((deep?164:136)/(n-1))+R(-6,6),r=R0*.1,L=R0*(deep?R(.95,1.1):R(.88,1.02));
    ringPetal(bw,kind,L,bc,`translate(${f(Math.cos(a*D)*r)},${f(Math.sin(a*D)*r-R0*(deep?.02:.06))}) scale(1,${f(deep?.86:.74)}) rotate(${f(a+90)})`)}
  const fg=G(k,{transform:`translate(0,${f(-R0*(deep?.4:.27))}) scale(1,${f(sq)})`});FN[f0](fg,t,Object.assign({},o,{view:'face'}));
  open(bw,t,1000,0,.4)}
/* cup in profile (rose, ranunculus, peony): a goblet of petals, narrow at the receptacle, rims curling on top */
function cupSide(g,t,o,f0){const R0=(o.R||RAD[f0]||40),c=palOf(f0,o),bc=backT(c),k=G(g),round=f0==='xRanunc';
  calyx(k,R0*.42,R0*.34,5,CALYX,72);const P=G(k,{transform:`translate(0,${f(-R0*.1)})`});
  E('ellipse',{cx:0,cy:f(-R0*1.0),rx:f(R0*.5),ry:f(R0*.14),fill:dk(c[1],.35)},P);
  for(let i=0;i<5;i++)cresc(P,R0*R(.18,.3),R0*.07,deepen(c,dk(c[1],.3),.2),{tr:`translate(${f(R(-.3,.3)*R0)},${f(-R0*R(.98,1.08))})`,th:.7,rim:.7,rw:.8});
  [[3,8,R0*1.12,R0*.4,c,-1],[4,20,R0*1.06,R0*.46,bc,1],[5,round?40:34,R0*(round?1:.96),R0*(round?.56:.5),bc,1]].forEach(([n,sp,L,W,cc,cup])=>{
    for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0,a=u*sp+R(-4,4);pp(P,L*R(.94,1.04),W,cc,{tr:`translate(${f(u*R0*.16)},0) rotate(${f(a)})`,prof:sinP(round?.4:.5,.14),tip:'round',rf:.03,rk:3,bend:u*.06,cup,sh:.9,base:.6,bl:.5,v:6,vo:.1,rim:.75,rs:.55,so:.45})}});
  open(k,t,1000,0,.4)}
/* carnation in profile: frilled crown over the long calyx tube */
function carnSide(g,t,o){const c=palOf('xCarn',o),R0=o.R||30,k=G(g);
  E('path',{d:`M${f(-R0*.22)},0L${f(-R0*.26)},${f(-R0*.75)}L${f(R0*.26)},${f(-R0*.75)}L${f(R0*.22)},0Z`,fill:lin([[0,'#3a5e44'],[.5,'#7aa08a'],[1,'#4a6e54']],0,0,1,0),stroke:'#2a4a34','stroke-width':.5},k);
  for(let i=0;i<5;i++){const x=-R0*.24+i*R0*.12;E('path',{d:`M${f(x-2)},${f(-R0*.72)}L${f(x)},${f(-R0*.86)}L${f(x+2)},${f(-R0*.72)}Z`,fill:'#5a8a6a'},k)}
  const P=G(k,{transform:`translate(0,${f(-R0*.78)})`});
  for(const[n,sp,L]of[[7,80,R0*.95],[6,56,R0*1.0],[5,30,R0*.92]])for(let i=0;i<n;i++){const a=-sp+i*(2*sp/(n-1))+R(-6,6);pp(P,L*R(.9,1.06),L*.5,c,{d:fanD(L,L*.5,11),tr:`rotate(${f(a)}) scale(1,.8)`,tc:o.tc,mp:.55,cup:1,sh:.9,base:.6,bl:.5,rim:.9,rs:.7,rw:.9,so:.3,prof:sinP(.6,.2)})}
  open(k,t,950,0,.4)}
/* closed and half-open buds */
function budV(g,t,o,f0){const c=palOf(f0,o),R0=(RAD[f0]||36)*.55,k=G(g);
  if(f0==='xCarn'){E('path',{d:`M${f(-R0*.3)},0L${f(-R0*.34)},${f(-R0*1.4)}L${f(R0*.34)},${f(-R0*1.4)}L${f(R0*.3)},0Z`,fill:lin([[0,'#3a5e44'],[.5,'#7aa08a'],[1,'#4a6e54']],0,0,1,0)},k);
    for(let i=0;i<4;i++)pp(k,R0*.5,R0*.3,c,{d:fanD(R0*.5,R0*.3,7),tr:`translate(0,${f(-R0*1.36)}) rotate(${f(-30+i*20)})`,cup:1,base:.5,rim:.8,so:.3,prof:sinP(.6,.2)})}
  else if(f0==='xRose'){const d=`M0,0C${f(R0*.55)},${f(-R0*.15)} ${f(R0*.5)},${f(-R0*1.05)} 0,${f(-R0*1.45)}C${f(-R0*.5)},${f(-R0*1.05)} ${f(-R0*.55)},${f(-R0*.15)} 0,0Z`;
    E('path',{d,fill:lin([[0,c[1]],[.6,c[2]],[1,c[3]]],0,1,.2,0)},k);E('path',{d,fill:lin([[0,c[0],.35],[.4,c[0],0],[.65,'#fff',0],[1,'#fff',.15]],0,0,1,0)},k);
    E('path',{d:`M${f(-R0*.36)},${f(-R0*.5)}C${f(-R0*.1)},${f(-R0*1.0)} ${f(R0*.25)},${f(-R0*1.0)} ${f(R0*.1)},${f(-R0*1.42)}M${f(R0*.4)},${f(-R0*.4)}C${f(R0*.2)},${f(-R0*.75)} ${f(-R0*.15)},${f(-R0*.85)} ${f(-R0*.2)},${f(-R0*1.15)}`,stroke:c[0],'stroke-width':.7,'stroke-opacity':.45,fill:'none'},k);
    E('path',{d,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.5},k);calyx(k,R0*.46,R0*.78,5,CALYX,28)}
  else{const r=R0*.62,g2=G(k,{transform:`translate(0,${f(-r*.9)})`});E('circle',{r:f(r),fill:rad([[0,c[3]],[.55,c[2]],[1,c[1]]],.38,.32,.75)},g2);
    for(let i=0;i<5;i++){const a=i*72+R(-10,10);cresc(g2,r*.5,r*.18,deepen(c,c[0],.2),{tr:`translate(${f(Math.cos(a*D)*r*.35)},${f(Math.sin(a*D)*r*.35)}) rotate(${f(a+90)})`,th:.6,rim:.7,rw:.6})}
    glint(g2,-r*.35,-r*.4,r*.25,r*.18,-30,.4);calyx(k,r*.95,r*.72,f0==='xDahlia'||f0==='xMum'?7:5,CALYX,58)}
  open(k,t,800,0,.4)}
/* ---------- species-specific views ---------- */
function anthBack(g,t,o){const c0=o.c||AN3.bordeaux.c,c=[c0[0],mix(c0[1],'#5a4a3a',.25),mix(c0[2],c0[1],.45),mix(c0[3],c0[2],.5),c0[3]],L=o.L||94,W=o.W||42,k=G(g),h=G(k,{transform:`translate(0,${f(L*.44)})`}),d=anthD(L,W,R(-.05,.05));
  stem3(h,[[0,L*.5],[1,L*.3],[0,L*.12],[0,L*.02]],5,4.2,SG,10);
  E('path',{d,fill:rad([[0,c[3]],[.6,c[2]],[1,c[1]]],.5,.45,.7)},h);E('path',{d,fill:lin([[0,'#fff',.08],[.4,'#fff',0],[.6,c[0],0],[1,c[0],.3]],0,0,1,0)},h);
  E('path',{d:`M0,${f(-L*.02)}C${f(W*.04)},${f(-L*.4)} ${f(W*.02)},${f(-L*.7)} ${f(W*.03)},${f(-L*.97)}`,stroke:c[4],'stroke-width':2.4,'stroke-opacity':.5,fill:'none'},h);
  E('path',{d,fill:'none',stroke:c[0],'stroke-width':.8,'stroke-opacity':.7},h);open(k,t,1000,-8,.3)}
function anthSide(g,t,o){const c=o.c||AN3.bordeaux.c,sp=o.sp||AN3.bordeaux.sp,L=o.L||94,k=G(g),h=G(k,{transform:`translate(0,${f(L*.4)})`});
  const d=`M0,0C${f(-L*.08)},${f(-L*.3)} ${f(-L*.05)},${f(-L*.7)} ${f(L*.12)},${f(-L)}C${f(L*.02)},${f(-L*.68)} ${f(L*.06)},${f(-L*.3)} ${f(L*.1)},${f(L*.05)}Z`;
  E('path',{d,fill:lin([[0,c[1]],[.5,c[2]],[1,c[3]]],0,1,1,0)},h);glint(h,-L*.01,-L*.5,L*.015,L*.2,10,.5);E('path',{d,fill:'none',stroke:c[0],'stroke-width':.7,'stroke-opacity':.7},h);
  spadix(h,[[L*.04,-L*.05],[L*.2,-L*.2],[L*.38,-L*.3],[L*.5,-L*.36]],6,4,sp[0],sp[1]);open(k,t,1000,-8,.3)}
function anthBud(g,t,o){const c=o.c||AN3.bordeaux.c,k=G(g),L=(o.L||94)*.62;
  const d=`M0,0C${f(L*.3)},${f(-L*.2)} ${f(L*.22)},${f(-L*.75)} ${f(L*.02)},${f(-L)}C${f(-L*.2)},${f(-L*.7)} ${f(-L*.28)},${f(-L*.2)} 0,0Z`;
  E('path',{d,fill:lin([[0,mix(c[1],'#5a7a3a',.4)],[.6,c[2]],[1,c[3]]],0,1,.2,0)},k);E('path',{d:`M0,${f(-L*.05)}C${f(L*.12)},${f(-L*.4)} ${f(L*.1)},${f(-L*.7)} ${f(L*.02)},${f(-L*.98)}`,stroke:c[0],'stroke-width':.7,'stroke-opacity':.5,fill:'none'},k);
  glint(k,-L*.08,-L*.45,L*.04,L*.2,-8,.4);E('path',{d,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.6},k);open(k,t,900,0,.4)}
/* calla seen into the trumpet */
function callaFront(g,t,o){const c=o.c||['#3a4a1a','#b9c48f','#eef0dc','#ffffff','#ffffff'],ic=o.ic||['#c9cf9a','#f6f6e6'],sp=o.sp||'#f0b72a',k=G(g,{transform:'translate(0,-92)'});
  const lim='M0,-44C24,-44 40,-26 40,-4C40,20 22,34 0,34C-22,34 -40,20 -40,-4C-40,-20 -30,-34 -14,-40C-8,-50 -4,-58 2,-66C4,-56 4,-50 0,-44Z';
  E('path',{d:lim,fill:rad([[0,c[3]],[.7,c[2]],[1,c[1]]],.5,.55,.6)},k);E('ellipse',{cx:0,cy:-2,rx:27,ry:24,fill:rad([[0,dk(ic[0],.55)],[.55,ic[0]],[1,ic[1]]],.5,.55,.55)},k);
  E('path',{d:'M-27,-2A27,24 0 0 1 27,-2',stroke:c[4],'stroke-width':2,'stroke-opacity':.8,fill:'none'},k);E('path',{d:lim,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.5},k);
  E('ellipse',{cx:2,cy:2,rx:5,ry:7,fill:rad([[0,lt(sp,.35)],[1,dk(sp,.25)]],.4,.35,.7)},k);for(let i=0;i<10;i++)E('circle',{cx:f(2+R(-3,3)),cy:f(2+R(-5,5)),r:.45,fill:dk(sp,.4),opacity:.5},k);
  glint(k,-22,-20,6,12,-30,.45);open(k,t,1000,6,.3)}
function callaBud(g,t,o){const c=o.c||['#3a4a1a','#b9c48f','#eef0dc','#ffffff','#ffffff'],nk=o.nk||'#6f8a3a',k=G(g);
  const d='M-3,0C-5,-20 -9,-50 -10,-70C-11,-90 -6,-104 2,-118C6,-104 9,-88 8,-70C7,-50 5,-20 3,0Z';
  E('path',{d,fill:lin([[0,nk],[.45,mix(nk,c[2],.6)],[1,c[3]]],0,1,0,0)},k);E('path',{d:'M6,-100C0,-86 -6,-70 -8,-50',stroke:c[0],'stroke-width':.7,'stroke-opacity':.45,fill:'none'},k);
  glint(k,-5,-70,1.6,16,-6,.5);E('path',{d,fill:'none',stroke:c[0],'stroke-width':.5,'stroke-opacity':.5},k);open(k,t,900,0,.4)}
function callaHalf(g,t,o){const k=G(g,{transform:'scale(.66,1)'});xCalla(k,t,Object.assign({},o,{view:'face'}))}
/* lily: trumpet in profile, half open, long club bud */
function lilySide(g,t,o,spread=34){const c=palOf('xLily',o),Rr=o.R||50,k=G(g);
  E('path',{d:`M-4,0C-5,-14 -6,-22 -8,-30L8,-30C6,-22 5,-14 4,0Z`,fill:lin([[0,'#6a8a3a'],[1,mix('#a8c050',c[2],.4)]],0,1,0,0)},k);const T=G(k,{transform:'translate(0,-26)'});
  for(const[a,w,b]of[[-spread,Rr*.2,-.35],[spread,Rr*.2,.35],[-spread*.45,Rr*.27,-.2],[spread*.45,Rr*.27,.2],[0,Rr*.22,R(-.1,.1)]])pp(T,Rr*R(.95,1.05),w,c,{tr:`rotate(${f(a)})`,prof:sinP(.55,.06),tip:'point',rf:.07,rk:6,bend:b,tc:o.tc,mp:.5,v:7,vo:.15,vw:.4,cup:1,sh:.9,base:.3,rim:.85,rs:.55,rw:1.2,so:.45,sp:o.sp});
  for(let i=0;i<5;i++){const a=(-90+(i-2)*9)*D,l=Rr*R(.95,1.1),x=Math.cos(a)*l,y=Math.sin(a)*l;E('path',{d:`M0,0Q${f(x*.5)},${f(y*.5)} ${f(x)},${f(y)}`,stroke:'#d8dcae','stroke-width':1,fill:'none'},T);
    E('ellipse',{cx:f(x),cy:f(y),rx:1.5,ry:4.6,fill:o.an||'#8a3a12',transform:`rotate(${f(a/D+90)} ${f(x)} ${f(y)})`},T)}
  open(k,t,1100,0,.3)}
function lilyBud(g,t,o){const c=palOf('xLily',o),L=(o.R||50)*1.25,k=G(g),d=`M-3,0C-5,-${f(L*.3)} -${f(L*.18)},-${f(L*.62)} -${f(L*.13)},-${f(L*.86)}C-${f(L*.1)},-${f(L*.96)} ${f(L*.1)},-${f(L*.96)} ${f(L*.13)},-${f(L*.86)}C${f(L*.18)},-${f(L*.62)} 5,-${f(L*.3)} 3,0Z`;
  E('path',{d,fill:lin([[0,'#6a8a3a'],[.5,mix('#9ab060',c[2],.45)],[1,c[3]]],0,1,0,0)},k);E('path',{d,fill:lin([[0,c[0],.3],[.4,c[0],0],[.65,'#fff',0],[1,'#fff',.15]],0,0,1,0)},k);
  for(const x of[-.06,.05])E('path',{d:`M${f(L*x)},-${f(L*.2)}Q${f(L*x*1.6)},-${f(L*.6)} ${f(L*x*.4)},-${f(L*.95)}`,stroke:c[0],'stroke-width':.7,'stroke-opacity':.4,fill:'none'},k);
  E('path',{d,fill:'none',stroke:c[0],'stroke-width':.6,'stroke-opacity':.5},k);open(k,t,900,0,.4)}
/* gloriosa nodding in profile */
function glorSide(g,t,o){const c=o.c||['#4a0410','#a80c2a','#e0203e','#ff6a5a','#ffd23f'],ed=o.edge||'#f5c518',k=G(g);
  for(const[a,b]of[[-40,-.35],[-18,-.2],[4,0],[24,.22],[46,.36]]){const L=R(40,47),pg=pp(k,L,6.4,c,{tr:`rotate(${f(a)})`,prof:sinP(.45,.12),tip:'point',rf:.16,rk:10,bend:b,bc:mix(ed,c[2],.25),mp:.35,v:3,vo:.25,cup:1,base:.2,rim:0,so:.35});
    E('path',{d:petalD(L,6.4,{prof:sinP(.45,.12),tip:'point',rf:.16,rk:10,bend:b}),fill:'none',stroke:ed,'stroke-width':1.4,'stroke-opacity':.85},pg)}
  for(let i=0;i<6;i++){const a=(60+i*12+R(-5,5))*D,l=R(24,30);stamen(k,0,4,Math.cos(a)*l*(i%2?1:-1),Math.sin(a)*l,'#c8b060','#7a5a10',2,.9)}
  E('path',{d:'M0,4Q-6,-6 -2,-20',stroke:'#9aa858','stroke-width':1.3,fill:'none'},k);open(k,t,1000,0,.3)}
/* registry: which views each species offers */
const VW={xRose:{tq:(g,t,o)=>tiltView(g,t,o,'xRose',.62),side:(g,t,o)=>cupSide(g,t,o,'xRose'),half:(g,t,o)=>{const k=G(g,{transform:'scale(.8)'});cupSide(k,t,Object.assign({},o,{R:30}),'xRose')},bud:(g,t,o)=>budV(g,t,o,'xRose')},
 xRanunc:{tq:(g,t,o)=>tiltView(g,t,o,'xRanunc',.6),side:(g,t,o)=>cupSide(g,t,o,'xRanunc'),bud:(g,t,o)=>budV(g,t,o,'xRanunc')},
 xDahlia:{tq:(g,t,o)=>tiltView(g,t,o,'xDahlia',.58),side:(g,t,o)=>tiltView(g,t,o,'xDahlia',.34),bud:(g,t,o)=>budV(g,t,o,'xDahlia')},
 xCarn:{tq:(g,t,o)=>tiltView(g,t,o,'xCarn',.6),side:(g,t,o)=>carnSide(g,t,o),bud:(g,t,o)=>budV(g,t,o,'xCarn')},
 xMum:{tq:(g,t,o)=>tiltView(g,t,o,'xMum',.58),side:(g,t,o)=>tiltView(g,t,o,'xMum',.32),bud:(g,t,o)=>budV(g,t,o,'xMum')},
 xScab:{tq:(g,t,o)=>tiltView(g,t,o,'xScab',.6),side:(g,t,o)=>tiltView(g,t,o,'xScab',.36),bud:(g,t,o)=>budV(g,t,o,'xScab')},
 xAnth:{back:anthBack,side:anthSide,bud:anthBud},xCalla:{front:callaFront,bud:callaBud,half:callaHalf},
 xLily:{side:(g,t,o)=>lilySide(g,t,o),half:(g,t,o)=>lilySide(g,t,o,14),bud:lilyBud},xGlor:{side:glorSide}};
/* draw any variety under a given view (falls back to the face) */
function drawView(g,t,f0,o,view){const fn=view&&VW[f0]&&VW[f0][view];if(fn)return fn(g,t,o);return FN[f0](g,t,o)}
const hasView=(f0,v)=>!!(VW[f0]&&VW[f0][v]);
