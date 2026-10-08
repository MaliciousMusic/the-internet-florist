/* ================= Serre, lot 3 — Orchidées : oncidium, dendrobium coupé, vanda, mokara, cymbidium mini ================= */
/* ---------- a generic orchid spray: a curve (raceme), flowers on pedicels facing out, buds at the tip ---------- */
function orchSpray(g,t,o,P){const cw=o.cw||cwNear(P.list,o.col)||P.list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||P.cm)*UPC,k=G(g),Bc=frameOf(o,.3,true),r=D/2,sd=o.side??(rnd()<.5?-1:1);
  const C=P.curve(r,sd);C[0]=fitDown(Bc,C[0],.3);const cb=q=>{const a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const nf=op<.3?0:op<.7?Math.ceil(P.nf*.5):P.nf,nb=op<.3?P.nb+2:P.nb,items=[],stem=[];for(let i=0;i<=16;i++)stem.push(cb(i/16));
  for(let i=0;i<nf+nb;i++){const bud=i>=nf,q=bud?P.qb0+(1-P.qb0-.02)*(i-nf)/Math.max(1,nb-1):P.q0+(P.q1-P.q0)*i/Math.max(1,nf-1),p=cb(q),alt=i%2?1:-1;
    if(!bud){const sz=1-P.grade*i/Math.max(1,nf),pos=V3.add(p,P.off(alt,r,sz,i)),axL=V3.nz(P.ax(alt));items.push({bud:0,pos,axL,sz,node:p})}
    else{const j=i-nf,sz=P.bs*(1-.18*j),pos=V3.add(p,[alt*r*.12,r*.05,r*.1]);items.push({bud:1,pos,sz,node:p,ang:alt})}}
  const sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'],FS={B:Bc,O:[0,0,0],parts:[]};
  FS.parts.push(tube3(FS,stem,q=>r*P.sw*(1-.35*q),{cols:[sc[1],sc[2],sc[1]],cap:1,hl:.3,dk:.45,spec:.2,ink:sc[0],eo:.3,cast:0}));
  for(const it of items){const pd=[it.node,V3.add(it.node,V3.sc(V3s(it.pos,it.node),.5)),it.pos];FS.parts.push(tube3(FS,pd,r*P.pw,{cols:[sc[1],mix(sc[2],cw.c,.3)],cap:0,hl:.3,dk:.4,spec:.1,ink:sc[0],eo:.25,cast:0}))}
  const nkp=neckPart(Bc,[0,0,0],C[0],V3s(C[0],C[1]),r*.9,r*P.sw*2.6,{cols:sc});FS.parts.push(nkp.part);drawParts(k,FS.parts);items.sort((a,b)=>toV(Bc,a.pos)[2]-toV(Bc,b.pos)[2]);
  for(const it of items){const Ov=toV(Bc,it.pos);if(it.bud){phalBud(k,frameIn(Bc,V3.nz([it.ang*.4,.8,.45]),0),Ov,D*it.sz,{c:P.budc?P.budc(cw):mix(cw.c,'#b8c48a',.3)});continue}P.flower(k,frameIn(Bc,it.axL,R(-.12,.12)),Ov,D*it.sz,cw,op)}
  open(k,t,1000,10,.3);return neckOut(nkp)}
/* the shared patterns painted on orchid segments: veins, tessellation (a dark net with darker cells), leopard spots, picotee, base flush */
function orchDeco(F,S,cw,D,seed){return(g,front,X)=>{if(!front||LOD)return;const P3=(u,v)=>PJ3(F,S(u,v)),rs=seed*7.31;
  if(cw.base)E('path',{d:X.d,fill:ugrad(...P3(0,0).slice(0,2),...P3(0,.55).slice(0,2),[[0,cw.base,.95],[.6,cw.base,.4],[1,cw.base,0]])},g);
  if(cw.tess){/* an organic net: wavy veins along and across, cells of uneven darkness, finer toward the base */
    const nu=8,nv=8,sc2=v=>.35+.65*Math.min(1,v*2),wob=(u,v)=>[u+.05*Math.sin(v*17+u*5+rs),v+.025*Math.sin(u*13+v*7+rs*1.7)],at2=(u,v)=>{const[a,b]=wob(u,v);return P3(Math.max(-.97,Math.min(.97,a*sc2(b))),Math.max(.02,Math.min(.97,b)))};
    const vv=j=>.06+.9*Math.pow(j/nv,1.25),uu=i=>-.92+1.84*i/(nu-1);let net='';const cells=[[],[],[]];
    for(let i=0;i<nu;i++){const q=[];for(let j=0;j<=10;j++)q.push(at2(uu(i),.04+.92*j/10));net+=smooth(q.map(p=>[p[0],p[1]]),false)}
    for(let j=1;j<nv;j++){const q=[];for(let i=0;i<=10;i++)q.push(at2(-.95+1.9*i/10,vv(j)));net+=smooth(q.map(p=>[p[0],p[1]]),false)}
    for(let i=0;i<nu-1;i++)for(let j=0;j<nv;j++){const h=Math.sin(i*9.7+j*3.3+rs)*.5+.5,lvl=h<.3?-1:h<.62?0:h<.86?1:2;if(lvl<0)continue;
      const u0=uu(i)+.03,u1=uu(i+1)-.03,v0=vv(j)+.012,v1=vv(j+1)-.012;cells[lvl].push(smooth([[u0,v0],[(u0+u1)/2,v0-.01],[u1,v0],[u1,(v0+v1)/2],[u1,v1],[(u0+u1)/2,v1+.01],[u0,v1],[u0,(v0+v1)/2]].map(([u,v])=>{const p=at2(u,v);return[p[0],p[1]]})))}
    cells.forEach((cl,l)=>{if(cl.length)E('path',{d:cl.join(''),fill:cw.tess,opacity:[.22,.38,.55][l]},g)});E('path',{d:net,stroke:cw.tess,'stroke-width':f(D*.0055),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g)}
  if(cw.leo||cw.spots){const n=cw.leo?22:30;let dd='';for(let k=0;k<n;k++){const v=.1+.85*Math.abs(Math.sin(k*12.9898+rs)),u=Math.sin(k*78.233+rs)*.82,c=P3(u,v),rr=D*(cw.leo?.012+.012*Math.abs(Math.sin(k*3.7)):.005+.004*Math.abs(Math.sin(k*5.1)))*(cw.dense?.6+.8*v:1);
      dd+=cw.leo?smooth([0,1,2,3,4,5].map(j=>{const a=j/6*6.283,q=rr*(.75+.3*Math.sin(j*2.1+k));return[c[0]+Math.cos(a)*q,c[1]+Math.sin(a)*q*.8]})):`M${f(c[0]-rr)},${f(c[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
    E('path',{d:dd,fill:cw.leo||cw.spots,opacity:.85},g)}
  if(cw.vein){let vd='';for(let k=0;k<9;k++){const u=-.86+1.72*k/8,q=[];for(let i=0;i<=8;i++){const v=.03+i/8*(.9-.25*u*u);q.push(P3(u*(.35+.65*Math.min(1,v*2.2)),v))}vd+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d:vd,stroke:cw.vein,'stroke-width':f(D*.005),'stroke-opacity':.55,fill:'none'},g)}
  if(cw.edge){const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:cw.edge,'stroke-width':f(D*.045),'stroke-opacity':.85,'clip-path':`url(#${id})`},g)}}}
/* ---------- Oncidium: a cloud of little dancing ladies on a branched panicle; each flower drawn light (flat fills) ---------- */
const CW_ONC=[
 {id:'golden-shower',n:'Jaune strié de brun',c:'#f4cb2c',bar:'#8a4a1e',cal:'#c86a1e'},{id:'jaune',n:'Jaune vif',c:'#f6d630',bar:null,cal:'#e8902a'},
 {id:'citron',n:'Jaune citron',c:'#f2e05a',bar:null,cal:'#d8a020'},{id:'choco',n:'Brun chocolat',c:'#6a3424',lipc:'#8a4a30',bar:'#3a1a10',cal:'#e8c060'},
 {id:'sharry',n:'Bordeaux et blanc',c:'#7a1e32',lipc:'#f6eee6',lipb:'#7a1e32',cal:'#e8b040'},{id:'rouge',n:'Rouge',c:'#c8283a',lipc:'#d8404a',cal:'#f0c040'},
 {id:'pourpre',n:'Pourpre',c:'#8a2a6a',lipc:'#a83a80',lipb:'#f6eef2',cal:'#f0d060'},{id:'rose',n:'Rose (Twinkle)',c:'#e89ab8',cal:'#f2c84a'},
 {id:'creme',n:'Crème',c:'#f2ead6',cal:'#e8c060'},{id:'blanc',n:'Blanc',c:'#faf7f0',cal:'#f2d060'},
 {id:'monarch',n:'Jaune tigré de brun',c:'#d8a838',bar:'#5a2a12',lipc:'#f8f2e2',lipb:'#7a3a1a',cal:'#a8501e'}];
const ONC_LIP=prof([[0,.25],[.18,.3],[.3,.8],[.55,1],[.8,.95],[.95,.6],[1,.2]]),ONC_SEP=prof([[0,.4],[.3,1],[.7,.85],[1,.15]]);
function oncFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:0},c=cw.c,lc=cw.lipc||c,P=pal7(c),PL=pal7(lc),r=D/2,g=F.k;
  /* flat but true-shaped: every piece projected from 3D, light from the facing of its middle */
  const piece=(S,pal,deco)=>{const pts=[];for(let i=0;i<=6;i++)pts.push(PJ3(F,S(-1,i/6)));for(let i=6;i>=0;i--)pts.push(PJ3(F,S(1,i/6)));let z=0;for(const p of pts)z+=p[2];
    const n=V3.nz(toV(B,V3.cr(V3s(S(.3,.5),S(-.3,.5)),V3s(S(0,.6),S(0,.4))))),I=lightI(n[2]<0?V3.sc(n,-1):n),fill=toneAt(pal,I*(n[2]<0?.85:1));
    F.parts.push({z:z/pts.length,fn:pp=>{const d=smooth(pts.map(p=>[p[0],p[1]]));E('path',{d,fill},pp);if(deco&&!LOD)deco(pp,S);E('path',{d,fill:'none',stroke:pal.ink,'stroke-width':.3,'stroke-opacity':.35},pp)}})};
  const bars=cw.bar?(pp,S)=>{let d='';for(const v of[.25,.45,.65,.82]){const a=PJ3(F,S(-.8,v)),b=PJ3(F,S(.8,v+.05));d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}E('path',{d,stroke:cw.bar,'stroke-width':f(D*.05),'stroke-opacity':.75,'stroke-linecap':'round'},pp)}:null;
  for(const[ph,L,W]of[[90,.42,.12],[215,.4,.11],[325,.4,.11],[148,.38,.12],[32,.38,.12]])piece(petS({phi:ph+R(-6,6),r0:D*.02,z0:-D*.01,L:D*L,W:D*W,wp:ONC_SEP,a0:80,a1:96,cup:-.15}),P,bars);
  const SL=petS({phi:270,r0:D*.05,z0:D*.03,L:D*.56,W:D*.36,wp:ONC_LIP,a0:84,a1:100,cup:-.12,ruf:.12,rk:3});
  piece(SL,PL,(pp,S)=>{if(cw.lipb)E('path',{d:smooth([[-.6,.02],[.6,.02],[.5,.3],[-.5,.3]].map(([u,v])=>{const p=PJ3(F,S(u,v));return[p[0],p[1]]})),fill:cw.lipb,opacity:.85},pp);
    const cc=PJ3(F,S(0,.12));E('ellipse',{cx:f(cc[0]),cy:f(cc[1]),rx:f(D*.06),ry:f(D*.045),fill:cw.cal},pp)});
  const cl=PJ3(F,[0,D*.03,D*.06]);F.parts.push({z:cl[2]+D,fn:pp=>E('ellipse',{cx:f(cl[0]),cy:f(cl[1]),rx:f(D*.04),ry:f(D*.05),fill:mix(c,'#fff8e8',.4)},pp)});
  drawParts(g,F.parts);return F}
function xOncidium2(g,t,o){const cw=o.cw||cwNear(CW_ONC,o.col)||CW_ONC[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||2.5)*UPC,k=G(g),sd=o.side??(rnd()<.5?-1:1);
  /* the panicle: a main arching axis (along the bent stem the composer gives, or its own) with side branches; flowers spaced along each, buds at their tips */
  let Bc,main,Lh;if(o.spine){const sp=bseg(o.spine,o.from||0,1);Bc=basis([0,0,1],0);main=sp.map(p=>[p[0],-p[1],0]);Lh=Math.max(D*5,blen(o.spine)*(1-(o.from||0))*.55)}
  else{Bc=frameOf(o,.4,true);Lh=D*7;main=[[-sd*Lh*.08,-Lh*.55,-D],[-sd*Lh*.02,-Lh*.05,-D],[sd*Lh*.2,Lh*.38,-D*1.2],[sd*Lh*.48,Lh*.42,-D*1.4]]}
  const at=(C,q)=>{const a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const brs=[main];for(let j=0;j<4;j++){const q=.3+.16*j,p=at(main,q),s=j%2?1:-1,len=Lh*(.38-.05*j);brs.push([p,V3.add(p,[s*len*.3,len*.25,D*R(-1,1)]),V3.add(p,[s*len*.7,len*.35,D*R(-1,1)]),V3.add(p,[s*len,len*.2,D*R(-1,1)])])}
  const sc=['#3a4a24','#5a6e34','#7f9048','#b0bc78'],FS={B:Bc,O:[0,0,0],parts:[]},fl=[];
  brs.forEach((C,bi)=>{const pts=[];for(let i=0;i<=10;i++)pts.push(at(C,i/10));FS.parts.push(tube3(FS,pts,D*(bi?.035:.05),{cols:[sc[1],sc[2]],cap:1,hl:.25,dk:.4,spec:0,ink:sc[0],eo:.3,cast:0}));
    const n=bi?5:6,q0=bi?.25:.55;for(let i=0;i<n;i++){const q=q0+(1-q0)*i/(n-1),p=at(C,q),alt=i%2?1:-1,last=i>=n-(op<.5?3:1),pos=V3.add(p,[alt*D*.35,-D*.25,D*.4]);fl.push({p:pos,bp:p,bud:last||op<.3,alt});
      FS.parts.push(tube3(FS,[p,V3.add(p,[alt*D*.2,-D*.05,D*.2]),pos],D*.022,{cols:[sc[1],sc[2]],cap:0,hl:.2,dk:.3,spec:0,ink:sc[0],eo:.25,cast:0}))}});
  const nkp=o.spine?null:neckPart(Bc,[0,0,0],main[0],V3s(main[0],main[1]),D*1.6,D*.1*1.2,{cols:sc});if(nkp)FS.parts.push(nkp.part);drawParts(k,FS.parts);fl.sort((a,b)=>toV(Bc,a.p)[2]-toV(Bc,b.p)[2]);
  for(const it of fl){const Ov=toV(Bc,it.p);if(it.bud){const s=PJ(Bc,[0,0,0],it.p);E('ellipse',{cx:f(s[0]),cy:f(s[1]),rx:f(D*.12),ry:f(D*.17),fill:mix(cw.c,'#b8c070',.35),stroke:shd(cw.c,-.5),'stroke-width':.3,'stroke-opacity':.4},k);continue}
    oncFlower(k,frameIn(Bc,V3.nz([it.alt*.25+R(-.15,.15),R(-.1,.15),1]),R(-.3,.3)),Ov,D*R(.9,1.08),cw,op)}
  if(o.spine){const e=PJ(Bc,[0,0,0],main[0]);return{neck:[e[0],e[1]]}}open(k,t,1000,8,.3);return neckOut(nkp)}
/* ---------- Dendrobium (Sonia type): a small round moth-like flower, sepals fused into a mentum (spur), petals broad and twisted, lip rolled round the column ---------- */
const CW_DEND=[
 {id:'sonia',n:'Pourpre à cœur blanc (Sonia)',c:'#b8328a',base:'#f6eef4',lip:'#6e1a58',vein:'#8a1a68'},{id:'blanc',n:'Blanc pur',c:'#f8f6f0',lip:'#f4efe6',lipv:'#c8c0b0'},
 {id:'pompadour',n:'Pourpre',c:'#9a2a7a',lip:'#5a1048'},{id:'jade',n:'Vert-jaune strié',c:'#cfd77a',vein:'#9aa850',lip:'#c05a98'},{id:'woonleng',n:'Crème à labelle pourpre',c:'#f2ead2',lip:'#7a1a5a'},
 {id:'enobi',n:'Blanc bordé de pourpre',c:'#f6f2f2',edge:'#9a2a7a',lip:'#f2e8ee',lipv:'#9a2a7a'},{id:'liberty',n:'Blanc bordé de vert',c:'#f6f6ee',edge:'#a8c070',lip:'#f2f2e6'},
 {id:'lucian',n:'Rose à base blanche',c:'#e88ab8',base:'#f8eef2',lip:'#b83a80'},{id:'peach',n:'Rose pâle',c:'#f2c6d6',lip:'#c8507e'},{id:'rasa',n:'Blanc à labelle rose',c:'#f6f4ec',edge:'#b8cc80',lip:'#c8306e'},
 {id:'lime',n:'Vert lime',c:'#c6d86a',lip:'#a8306a'},{id:'sakura',n:'Lavande',c:'#c8a8d8',lip:'#8a5aa8'},{id:'marco',n:'Rose poudré',c:'#e8b8c8',lip:'#b8708a'},
 {id:'bordeaux',n:'Bordeaux',c:'#6a1a4a',lip:'#4a0a32'},{id:'noir',n:'Pourpre presque noir',c:'#3a0c2a',lip:'#28061c'}];
const DEN_PET=prof([[0,.18],[.15,.45],[.4,.92],[.62,1],[.82,.82],[.95,.45],[1,.1]]),DEN_SEP=prof([[0,.4],[.25,.9],[.55,1],[.85,.6],[1,.1]]);
function dendFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e8e4d0',.2)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  const tep=(o,sd2)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:7,nv:10,across:1.3,ew:.45,eo:.28,cast:1,paint:orchDeco(F,S,cw,D,sd2)}));return S};
  tep({phi:90+R(-3,3),r0:D*.02,z0:-D*.01,L:r*.86,W:r*.18,wp:DEN_SEP,a0:A(80),a1:A(98),cup:-.15},1);
  for(const s of[-1,1])tep({phi:270+s*42,r0:D*.03,z0:-D*.012,L:r*.84,W:r*.22,wp:DEN_SEP,a0:A(84),a1:A(96),cup:-.12,tw:s*8},2+s);
  for(const s of[-1,1])tep({phi:90+s*-68,r0:D*.03,z0:D*.004,L:r*.94,W:r*.42,wp:DEN_PET,a0:A(84),a1:A(94),cup:-.08,tw:s*-22,ruf:.04},5+s);
  if(op>.3){const SL=petS({phi:270,r0:D*.03,z0:D*.04,L:r*.6,W:r*.26,wp:prof([[0,.5],[.3,.9],[.6,1],[.85,.8],[1,.3]]),a0:A(34),a1:A(96),pw:1.3,cup:-.62,ruf:.05});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:7,nv:10,across:1.5,ew:.5,eo:.4,cast:.9,paint:(g,front,X)=>{if(LOD)return;let vd='';for(let k=0;k<7;k++){const u=-.8+1.6*k/6,q=[.1,.4,.7,.95].map(v=>PJ3(F,SL(u*(.5+.5*v),v)));vd+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d:vd,stroke:cw.lipv||shd(cw.lip,-.4),'stroke-width':f(D*.005),'stroke-opacity':.6,fill:'none'},g)}}));
    F.parts.push(tube3(F,[[0,D*.01,D*.02],[0,-D*.01,D*.06],[0,-D*.025,D*.08]],D*.022,{cols:['#f4eee8','#fffaf4'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:.5,zb:D*.03}))}
  /* the mentum: the fused base of the lateral sepals, a short blunt spur behind */
  F.parts.push(tube3(F,[[0,-D*.02,-D*.01],[0,-D*.06,-D*.06],[0,-D*.09,-D*.09]],q=>D*(.04-.012*q),{cols:[mix(cw.c,cw.base||'#f4f0ea',.5),cw.c],cap:1,hl:.35,dk:.4,spec:.2,ink:Pc.ink,eo:.3,cast:0,zb:-D*.04}));
  render3(F,D*.5);return F}
/* ---------- Vanda: a big flat round flower, five broad overlapping segments (the lower sepals largest and darkest), tessellated or leopard-spotted, a tiny fleshy lip ---------- */
const CW_VANDA=[
 {id:'bleu',n:'Bleu indigo',c:'#6a5cb8',tess:'#3a2a80',lip:'#4a2a6a'},{id:'china-blue',n:'Mosaïque bleue sur blanc',c:'#e8e8f6',tess:'#4a4aa0',lip:'#3a2a7a'},
 {id:'pachara',n:'Bleu-violet en damier',c:'#7a5ab8',tess:'#3a1a78',lip:'#5a2a6a'},{id:'blanc',n:'Blanc',c:'#f6f4f2',tess:'#e2ded8',lip:'#efe6d8'},
 {id:'lilac',n:'Crème bordé de pourpre, tacheté',c:'#f2e8e8',edge:'#9a3a7a',spots:'#6a1a5a',lip:'#7a2a6a'},{id:'aubergine',n:'Pourpre aubergine',c:'#8a2a7a',tess:'#5a0a4a',lip:'#4a0a3a'},
 {id:'blackberry',n:'Bordeaux velours',c:'#5a1432',tess:'#3a0620',lip:'#2a0418'},{id:'pink-maroon',n:'Rose vif à sépales bordeaux',c:'#e0508e',tess:'#8a1a4a',lip:'#7a1a3a'},
 {id:'campari',n:'Magenta tacheté',c:'#d63a7e',leo:'#7a0a3a',lip:'#8a1a4a'},{id:'leopard-tangerine',n:'Orange tacheté léopard',c:'#f0a030',leo:'#b0201a',lip:'#8a1a10'},
 {id:'leopard-coral',n:'Pêche tacheté léopard',c:'#f4b096',leo:'#8a2a4a',lip:'#8a2a3a'},{id:'orange',n:'Orange',c:'#f08a3a',lip:'#c04a1a'},
 {id:'choco',n:'Brun chocolat tacheté',c:'#8a5a3a',leo:'#4a2410',lip:'#4a2414'},{id:'sea-shell',n:'Lavande pâle et jaune',c:'#e8dcec',base:'#f2e6a0',spots:'#7a1a3a',lip:'#7a2a4a'}];
const VAN_SEG=prof([[0,.3],[.2,.72],[.5,1],[.78,.95],[.93,.66],[1,.2]]);
function vandaFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e0dcd8',.2)),Pd=pal7(shd(cw.c,-.18)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  const seg=(o,pal,sd2)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal,palB:PcB,nu:7,nv:10,across:1.2,ew:.5,eo:.28,cast:1,paint:orchDeco(F,S,cw,D,sd2)}));return S};
  seg({phi:90,r0:D*.02,z0:-D*.012,L:r*.9,W:r*.36,wp:VAN_SEG,a0:A(84),a1:A(94),cup:-.08,ruf:.05},Pc,1);
  for(const s of[-1,1])seg({phi:270+s*36,r0:D*.02,z0:-D*.014,L:r*.98,W:r*.42,wp:VAN_SEG,a0:A(86),a1:A(94),cup:-.06,ruf:.05,tw:s*5},cw.tess?Pd:Pc,2+s);
  for(const s of[-1,1])seg({phi:90+s*-62,r0:D*.02,z0:D*.004,L:r*.9,W:r*.36,wp:VAN_SEG,a0:A(85),a1:A(93),cup:-.07,ruf:.06,tw:s*-8},Pc,5+s);
  if(op>.3){const SL=petS({phi:270,r0:D*.04,z0:D*.04,L:r*.3,W:r*.12,wp:prof([[0,.6],[.4,1],[.8,.7],[1,.3]]),a0:A(46),a1:A(100),cup:-.5});F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:5,nv:6,across:1.4,ew:.45,eo:.45,cast:.6}));
    F.parts.push(tube3(F,[[0,D*.01,D*.02],[0,0,D*.05],[0,-D*.012,D*.065]],D*.026,{cols:['#f4f0ea','#fffaf4'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:.5,zb:D*.03}))}
  F.parts.push(tube3(F,[[0,-D*.02,-D*.01],[0,-D*.05,-D*.05]],D*.018,{cols:[Pl.b,Pl.d1],cap:1,hl:.3,dk:.4,spec:.1,ink:Pl.ink,eo:.3,cast:0,zb:-D*.04}));
  render3(F,D*.5);return F}
/* ---------- Mokara: a star of five spatulate segments, narrow at the base and rounded at the tip, flat or a little rolled back, often speckled toward the tips ---------- */
const CW_MOK=[
 {id:'orange',n:'Orange',c:'#ef7a2a',lip:'#b0302a'},{id:'rouge-orange',n:'Rouge orangé',c:'#e0482a',lip:'#8a1a14'},{id:'rouge',n:'Rouge',c:'#c0282e',lip:'#7a0a14'},
 {id:'corail',n:'Corail',c:'#e86a5a',lip:'#a02a2a'},{id:'jaune',n:'Jaune',c:'#f2c838',lip:'#c05a1a'},{id:'jaune-tache',n:'Jaune pâle tacheté',c:'#f2e080',spots:'#b0402a',dense:1,lip:'#b0402a'},
 {id:'or',n:'Jaune or',c:'#e8a820',lip:'#a8401a'},{id:'peche',n:'Pêche',c:'#f4b08a',lip:'#c05a3a'},{id:'rose-tache',n:'Rose pâle moucheté',c:'#f2cad6',spots:'#c0406a',dense:1,lip:'#a02a5a'},
 {id:'rose-vif',n:'Rose vif',c:'#e05890',lip:'#9a1a50'},{id:'magenta',n:'Magenta',c:'#c8307a',lip:'#7a0a44'},{id:'pourpre',n:'Pourpre moucheté',c:'#8a2a7a',spots:'#f2d8ec',dense:1,lip:'#5a0a4a'},
 {id:'bleu',n:'Bleu lavande',c:'#9a8ad0',spots:'#5a4aa0',lip:'#4a3a8a'},{id:'blanc',n:'Blanc tacheté',c:'#f6f2ee',spots:'#c06a8a',dense:1,lip:'#b04a6a'}];
const MOK_SEG=prof([[0,.22],[.25,.5],[.55,.85],[.8,1],[.94,.82],[1,.3]]);
function mokFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#e0dcc8',.2)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  const seg=(o,sd2)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:6,nv:10,across:1.4,ew:.45,eo:.3,cast:1,paint:orchDeco(F,S,cw,D,sd2)}));return S};
  for(const[ph,L,W,i]of[[90,.92,.22,1],[218,.9,.24,2],[322,.9,.24,3],[155,.86,.22,4],[25,.86,.22,5]])seg({phi:ph+R(-4,4),r0:D*.025,z0:i>3?D*.004:-D*.01,L:r*L,W:r*W,wp:MOK_SEG,a0:A(84),a1:A(104),cup:-.2,tw:R(-12,12)},i);
  if(op>.3){const SL=petS({phi:270,r0:D*.04,z0:D*.04,L:r*.34,W:r*.12,wp:prof([[0,.5],[.4,1],[.8,.8],[1,.3]]),a0:A(40),a1:A(110),cup:-.5});F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:5,nv:6,across:1.4,ew:.45,eo:.45,cast:.6}));
    F.parts.push(tube3(F,[[0,D*.01,D*.02],[0,0,D*.05],[0,-D*.012,D*.065]],D*.024,{cols:['#f4f0ea','#fffaf4'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:.5,zb:D*.03}))}
  render3(F,D*.5);return F}
/* ---------- Cymbidium mini: the large one's anatomy, smaller, more pointed and a little reflexed, more flowers ---------- */
const CW_CYMI=[
 {id:'blanc',n:'Blanc',c:'#f8f5ec',lip:'#fbf6ee',dots:'#b8203a',cal:'#f2c840',col:'#f4ecdc'},{id:'creme',n:'Crème rosé',c:'#f4e6d6',lip:'#f6dde0',dots:'#c03a5a',cal:'#f2c840',col:'#f0dccc'},
 {id:'jaune',n:'Jaune à labelle rouge',c:'#eccc5a',lip:'#f6e6c0',dots:'#a8201e',cal:'#f0b030',col:'#efdca0'},{id:'vert',n:'Vert',c:'#bccb6e',lip:'#f6f0dc',dots:'#a8102a',cal:'#f0c838',col:'#d8e0a8'},
 {id:'vert-bordeaux',n:'Vert à labelle bordeaux',c:'#b8c870',lip:'#7a1428',dots:'#4a0612',cal:'#f0c838',col:'#d0d8a0',solid:1},{id:'vert-pastel',n:'Vert pastel',c:'#d6e2b6',lip:'#f8f2e2',dots:'#b0283c',cal:'#f0c838',col:'#e2e8cc'},
 {id:'rose',n:'Rose',c:'#e8a8bc',lip:'#f2d0da',dots:'#a01a40',cal:'#f2c840',col:'#e8b4c4'},{id:'rose-pastel',n:'Rose pastel',c:'#f2d2da',lip:'#f8e4e8',dots:'#b8304e',cal:'#f2c840',col:'#efd4da'},
 {id:'peche',n:'Pêche',c:'#f0bc98',lip:'#f8e2d0',dots:'#a82a2a',cal:'#f0b838',col:'#f0c8b0'},{id:'orange',n:'Orange',c:'#df8840',lip:'#f2d8b8',dots:'#8a1a14',cal:'#f0b030',col:'#e2a874'},
 {id:'rouge',n:'Rouge',c:'#b02a3a',lip:'#f2d8d4',dots:'#6a0812',cal:'#f2c040',col:'#c8505e'},{id:'bordeaux',n:'Bordeaux',c:'#6e1f33',lip:'#e8c8cc',dots:'#4a0614',cal:'#f0b838',col:'#8e3a4c'},
 {id:'brun',n:'Brun',c:'#7a4a30',lip:'#f0dcc4',dots:'#5a1410',cal:'#f0b838',col:'#946048'},{id:'noir',n:'Pourpre noir',c:'#3e1424',lip:'#e6c4cc',dots:'#2a0410',cal:'#eeb438',col:'#5a2638'}];
const xDend2=(g,t,o)=>orchSpray(g,t,o,{list:CW_DEND,cm:6.5,nf:6,nb:4,q0:.24,q1:.78,qb0:.84,grade:.18,bs:.3,sw:.045,pw:.024,flower:dendFlower,
  curve:(r,sd)=>[[-sd*r*.4,-r*2.2,-r*.35],[-sd*r*.5,-r*.3,-r*.3],[sd*r*.4,r*1.2,-r*.35],[sd*r*1.5,r*.9,-r*.5]],off:(alt,r,sz,i)=>[alt*r*.4,-r*.5*sz,r*.6+i*r*.05],ax:alt=>[alt*.18+R(-.08,.08),.04+R(-.08,.08),1]});
const xVanda2=(g,t,o)=>orchSpray(g,t,o,{list:CW_VANDA,cm:10,nf:4,nb:2,q0:.25,q1:.72,qb0:.86,grade:.08,bs:.28,sw:.06,pw:.03,flower:vandaFlower,scol:['#3a4a2a','#5a6e3e','#7f9058','#b0bc88'],
  curve:(r,sd)=>[[-sd*r*.1,-r*2,-r*.4],[-sd*r*.12,-r*.6,-r*.4],[sd*r*.05,r*.6,-r*.42],[sd*r*.15,r*1.5,-r*.45]],off:(alt,r,sz,i)=>[alt*r*.62,r*.05,r*.4],ax:alt=>[alt*.3+R(-.06,.06),.06+R(-.06,.06),1]});
const xMokara2=(g,t,o)=>orchSpray(g,t,o,{list:CW_MOK,cm:7,nf:6,nb:3,q0:.22,q1:.78,qb0:.86,grade:.1,bs:.26,sw:.05,pw:.024,flower:mokFlower,
  curve:(r,sd)=>[[0,-r*2.2,-r*.4],[0,-r*.7,-r*.4],[sd*r*.05,r*.6,-r*.42],[sd*r*.1,r*1.9,-r*.45]],off:(alt,r,sz,i)=>[alt*r*.55,0,r*.35],ax:alt=>[alt*.35+R(-.06,.06),.05+R(-.06,.06),1]});
const xCymbMini2=(g,t,o)=>orchSpray(g,t,o,{list:CW_CYMI,cm:5.5,nf:7,nb:3,q0:.2,q1:.8,qb0:.86,grade:.12,bs:.34,sw:.05,pw:.026,flower:(par,B,O,D,cw,op)=>cymbFlower(par,B,O,D,cw,op),
  curve:(r,sd)=>[[-sd*r*.2,-r*2.4,-r*.4],[-sd*r*.15,-r*.6,-r*.35],[sd*r*.1,r*1,-r*.35],[sd*r*.5,r*2.2,-r*.45]],off:(alt,r,sz,i)=>[alt*r*.58,r*.04,r*.4],ax:alt=>[alt*.32+R(-.06,.06),.1+R(-.06,.06),1]});
Object.assign(FN,{oncidium:xOncidium2});
Object.assign(GH,{'oncidium':xOncidium2,'dendrobium-coupe':xDend2,'vanda':xVanda2,'mokara':xMokara2,'cymbidium-mini':xCymbMini2});
Object.assign(CWS,{'oncidium':CW_ONC,'dendrobium-coupe':CW_DEND,'vanda':CW_VANDA,'mokara':CW_MOK,'cymbidium-mini':CW_CYMI});
Object.assign(SZG,{'oncidium':[2,2.5,2.5,3],'dendrobium-coupe':[5,6,6.5,7],'vanda':[8,9,10,11],'mokara':[5,6,7,8],'cymbidium-mini':[4.5,5,5.5,6]});
