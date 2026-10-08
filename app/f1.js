
/* ================= Serre : feuillages tropicaux, architecture de verre et de fer, statue ================= */
/* pinnate fern frond arching from 0,0 (tree ferns, Boston ferns) */
function frond(g,L,o={}){const k=G(g),s=o.s??1,P=[[0,0],[s*L*.18,-L*.45],[s*L*.55,-L*.82],[s*L*(.95+(o.droop||0)),-L*(.78-(o.droop||0)*.6)]],c=o.c||['#1f3d1a','#3e6a2a','#6f9a3e','#a9c868'],n=o.n||26;
  E('path',{d:taper(P,u=>1.8*(1-u)+.3,16),fill:c[0]},k);
  for(let i=2;i<n;i++){const u=i/n,q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),a=Math.atan2(q2[1]-q[1],q2[0]-q[0])/D,l=L*.21*Math.sin(Math.PI*Math.min(.98,u*.95+.05))*(1-u*.25);
    for(const sd of[-1,1])E('path',{d:petalD(l,l*.14,{n:6,tip:'point',prof:sinP(.5,.05),bend:sd*.12}),fill:i%3?c[1]:c[2],transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(a+90+sd*(70-u*25))})`},k)}
  return k}
/* banana / strelitzia leaf with torn margins */
function bananaLeaf(g,L,W,o={}){const k=G(g),c=o.c||['#16301a','#2f5c2c','#5e8f3e','#9cc46a','#c8e09a'];leaf3(k,L,W,c,{prof:sinP(.35,.06),nv:18,va:.025,vw:.6,vo:.35,mr:2.6,bend:o.bend??R(-.12,.12),gloss:.25});
  for(let i=0;i<5;i++){const t=R(.25,.85),sd=rnd()<.5?-1:1;E('path',{d:`M${f(sd*W*.92)},${f(-L*t)}L${f(sd*W*.1)},${f(-L*t-2)}L${f(sd*W*.92)},${f(-L*t-5)}Z`,fill:'#e9efe4',opacity:.85},k)}return k}
/* fan palm: segments radiating on a petiole */
function palmFan(g,L,o={}){const k=G(g),c=o.c||['#1d3a24','#3a6440','#6a9a62','#a6c89a'],n=o.n||22;E('path',{d:taper([[0,0],[1,-L*.4],[0,-L*.7],[0,-L*.86]],u=>2.6-1.6*u,10),fill:c[0]},k);
  for(let i=0;i<n;i++){const a=-150+i*(120/(n-1))+R(-3,3);E('path',{d:petalD(L*R(.5,.62),L*.045,{n:6,tip:'point',prof:sinP(.4,.05),bend:.06}),fill:lin([c[1],c[2],c[3]],0,1,0,0),stroke:c[0],'stroke-width':.4,'stroke-opacity':.5,transform:`translate(0,${f(-L*.86)}) rotate(${f(a+90)})`},k)}return k}
/* tree fern: textured trunk and a crown of arching fronds */
function treeFern(g,H,o={}){const k=G(g),c=o.c;E('path',{d:taper([[0,0],[R(-8,8),-H*.4],[R(-10,10),-H*.75],[0,-H]],u=>9-3*u,14),fill:'#4a3a2a'},k);
  for(let i=0;i<10;i++)E('path',{d:`M${f(R(-6,6))},${f(-R(.1,.95)*H)}q4,-3 8,0`,stroke:'#2e2418','stroke-width':1.2,'stroke-opacity':.6,fill:'none'},k);
  const top=G(k,{transform:`translate(0,${f(-H)})`}),lean=o.lean||0,A=lean<0?[-178,-160,-142,-124,-106,-88,-70,-52]:lean>0?[-128,-110,-92,-74,-56,-38,-20,-2]:[-170,-140,-115,-90,-65,-40,-10];
  for(const a0 of A){const a=a0+R(-6,6),sd=a<-90?-1:1;frond(G(top,{transform:`rotate(${f(a+90)})`}),H*R(.34,.44),{s:sd,droop:R(.15,.4),c})}return k}
/* peace lily clump (glossy dark leaves, white spathes) and bird's nest fern rosette */
function peaceLily(g,s=1){const k=G(g);for(let i=0;i<7;i++)leaf3(k,48*s*R(.85,1.1),11*s,LG.dark,{tr:`rotate(${f(-60+i*20+R(-6,6))})`,prof:sinP(.55,.05),nv:5,va:.1,bend:R(-.15,.15),gloss:.3,mr:.9});
  for(let i=0;i<2;i++){const x=R(-14,14)*s,h=R(46,62)*s,c2=G(k,{transform:`translate(${f(x)},0)`});E('path',{d:`M0,0Q${f(x*.2)},${f(-h*.5)} 0,${f(-h)}`,stroke:'#4f7a34','stroke-width':f(1.4*s),fill:'none'},c2);
    pp(c2,22*s,7*s,['#7a8a70','#e8eee2','#fbfdf8','#ffffff','#ffffff'],{tr:`translate(0,${f(-h)})`,prof:sinP(.55,.06),tip:'point',cup:-1,base:.3,rim:.5,v:3,vo:.12});E('ellipse',{cx:0,cy:f(-h-6*s),rx:f(1.6*s),ry:f(4*s),fill:'#efe6b0'},c2)}return k}
function nestFern(g,s=1){const k=G(g);for(let i=0;i<9;i++)leaf3(k,60*s*R(.8,1.1),7*s,LG.lime,{tr:`rotate(${f(-80+i*20+R(-5,5))})`,prof:sinP(.35,.05),nv:0,rf:.08,rk:10,bend:R(-.2,.2),mr:.8});return k}
/* stylised marble statue on its pedestal (end of each corridor) */
function statue(g){const k=G(g),m=lin([[0,'#fbf8f2'],[.55,'#e6dfd3'],[1,'#b9b1a4']],0,0,1,0);
  E('rect',{x:-26,y:-44,width:52,height:44,fill:lin(['#f2ede4','#cfc7ba'],0,0,1,0)},k);E('rect',{x:-30,y:-50,width:60,height:7,fill:'#f6f2ea'},k);
  E('path',{d:'M-20,-50C-22,-80 -15,-112 -10,-130L10,-130C15,-112 22,-80 20,-50Z',fill:m},k);
  E('path',{d:'M-10,-130C-12,-146 -10,-160 -8,-166L8,-166C10,-160 12,-146 10,-130Z',fill:m},k);
  E('path',{d:'M-8,-162C-16,-150 -18,-136 -15,-124M8,-162C16,-156 20,-150 18,-168',stroke:'#e9e2d6','stroke-width':4.5,fill:'none','stroke-linecap':'round'},k);
  E('circle',{cx:1,cy:-174,r:7.5,fill:m},k);E('path',{d:'M-5,-180C-2,-186 6,-185 8,-178',stroke:'#d8d0c2','stroke-width':3,fill:'none'},k);
  for(const x of[-12,-4,5,13])E('path',{d:`M${x},-118Q${x+3},-86 ${x-1},-54`,stroke:'#b8afa1','stroke-width':.8,'stroke-opacity':.6,fill:'none'},k);
  E('path',{d:'M12,-60C20,-64 26,-60 26,-54C20,-52 14,-54 12,-60Z',fill:'#e8e1d5'},k);return k}
/* defs shared by every corridor */
function serreDefs(){if(document.getElementById('fz-fern'))return;LOD=1;renderStatic(()=>{seed=77;
  for(let v=0;v<3;v++)frond(E('g',{id:`fz-fern${v||''}`},defs),150,{droop:.15+v*.12});
  for(let v=0;v<2;v++){bananaLeaf(E('g',{id:`fz-ban${v}`},defs),220,40);palmFan(E('g',{id:`fz-palm${v}`},defs),200);treeFern(E('g',{id:`fz-tf${v}`},defs),480,{lean:-1});peaceLily(E('g',{id:`fz-pl${v}`},defs),1);nestFern(E('g',{id:`fz-nf${v}`},defs),1)}
  statue(E('g',{id:'fz-statue'},defs))});LOD=0}
