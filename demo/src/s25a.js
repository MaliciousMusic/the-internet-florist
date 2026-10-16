/* ================= Serre, lot 25 — Lianes et matières : liane de jasmin (Jasminum polyanthum), arbre à perruques (Cotinus coggygria) en feuillage et en plumes, fil d'aluminium décoratif ================= */
/* ---------- shared: screen points, smoothed outlines, a simple 3D leaf on its petiole ---------- */
const q5=p=>f(p[0])+','+f(p[1]),sc5=v=>[v[0],-v[1]];
/* a smooth open path through screen points (midpoint quadratics); mv: start with a move */
function sm5(P,mv=true){let d=(mv?'M':'L')+q5(P[0]);if(P.length<3){for(let i=1;i<P.length;i++)d+='L'+q5(P[i]);return d}
  for(let i=1;i<P.length-1;i++)d+='Q'+q5(P[i])+' '+q5([(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2]);return d+'L'+q5(P[P.length-1])}
/* a leaf in 3D (view space, y up): petiole of length pl from base along H, blade along H with its upper face toward N, its halves lifted on the midrib by fold (rad), arched by ar, drooping by dr;
   wp(v) the half-width profile; each half lit by its own normal, upper face (pal) or underside (palB) as it turns; nl pairs of side veins; one part for the painter's order */
function leaf5(parts,o){const H=V3.nz(o.H),N=V3.nz(V3s(o.N,V3.sc(H,V3.dot(o.N,H)))),W=V3.cr(N,H),L=o.len,Wd=o.wid*.5,fo=o.fold??.3,cf=Math.cos(fo),sf=Math.sin(fo),pl=o.pl||0,ar=o.ar??.08,dr=o.dr??.12,tw=o.tw||0;
  const B0=o.base,Pb=V3.add(V3.add(B0,V3.sc(H,pl)),[0,-pl*(o.pdr??.12),0]),
    S=(u,v)=>{const w=Wd*o.wp(v),a=L*ar*Math.sin(Math.PI*v)+sf*Math.abs(u)*w,t=tw*v,ct=Math.cos(t),st=Math.sin(t),Wr=V3.add(V3.sc(W,ct),V3.sc(N,st)),Nr=V3.add(V3.sc(N,ct),V3.sc(W,-st));
      return[Pb[0]+H[0]*L*v+Wr[0]*u*w*cf+Nr[0]*a,Pb[1]+H[1]*L*v+Wr[1]*u*w*cf+Nr[1]*a-L*dr*v*v,Pb[2]+H[2]*L*v+Wr[2]*u*w*cf+Nr[2]*a]};
  const VS=[0,.07,.18,.32,.48,.64,.79,.91,1],mid=VS.map(v=>S(0,v)),nrm=s=>V3.nz(V3.sc(V3.cr(V3s(S(s*.5,.62),S(s*.5,.38)),V3s(S(s,.5),S(0,.5))),s));
  const half=s=>{const n=nrm(s),up=n[2]>=0,P=up?o.pal:o.palB,c=toneAt(P,lightI(up?n:V3.sc(n,-1))+(o.Ib||0)),E1=VS.map(v=>S(s,v));let z=0;for(const p of E1)z+=p[2];
    return{c,k:shd(c,-.3),z:z/E1.length,d:'M'+mid.map(p=>q5(sc5(p))).join('L')+sm5(E1.map(sc5).reverse(),false)+'Z'}};
  const hs=[half(1),half(-1)].sort((a,b)=>a.z-b.z);let vd='';
  if(o.nl&&!LOD){vd='M'+mid.slice(0,-1).map(p=>q5(sc5(p))).join('L');for(let i=1;i<=o.nl;i++){const v=.1+.78*i/(o.nl+1);for(const s of[-1,1])vd+='M'+q5(sc5(S(0,v)))+'Q'+q5(sc5(S(s*.5,v+.05)))+' '+q5(sc5(S(s*.86,v+.12)))}}
  let z=0;for(const p of mid)z+=p[2];z/=mid.length;
  const pc=V3.add(V3.sc(V3.add(B0,Pb),.5),[0,pl*.06,0]);
  parts.push({z:z+(o.zb||0),fn:par=>{if(pl>.5)E('path',{d:'M'+q5(sc5(B0))+'Q'+q5(sc5(pc))+' '+q5(sc5(Pb)),stroke:o.pc,'stroke-width':f(o.pw||1),fill:'none','stroke-linecap':'round'},par);
    for(const h of hs)E('path',{d:h.d,fill:h.c,stroke:h.k,'stroke-width':.35,'stroke-linejoin':'round'},par);
    if(vd)E('path',{d:vd,stroke:o.vc,'stroke-width':f(o.vw||.45),fill:'none',opacity:o.vo??.5,'stroke-linecap':'round'},par)}});
  return Pb}
/* a stem of the drawing between two cuts of an axis (spAxis), as one part at its depth: a two-tone tapered ribbon (cheap) */
function axSeg5(A,parts,a,b,w0,w1,cols){const P=bseg(A.Cs,a,b);let z=0;for(let i=0;i<=4;i++)z+=A.cb(a+(b-a)*i/4)[2];parts.push({z:z/5-.01,fn:par=>stem3(par,P,w0,w1,cols,8)})}
/* ---------- arbre à perruques (Cotinus coggygria) : rameau aux feuilles alternes (spirale 2/5), rondes à obovales, entières, à nervures pennées fines et droites,
   portées par de longs pétioles ; pourpres ('Royal Purple', 'Velvet Cloak', 'Grace'), vertes bleutées, dorées ('Golden Spirit') ou en couleurs d'automne ---------- */
const CW_COTI=[
 {id:'royal-purple',n:'Pourpre Royal Purple',c:'#4a2034',v:'#9a4a64',b:'#7a5a6e',st:'#4e2430'},
 {id:'velvet-cloak',n:'Pourpre noir Velvet Cloak',c:'#3a1e2a',v:'#7e3e54',b:'#6a5262',st:'#3e1e28'},
 {id:'grace',n:'Rouge vin Grace',c:'#62202f',v:'#b4505e',b:'#8a5a66',st:'#5a2430'},
 {id:'vert',n:'Vert bleuté',c:'#6f8f74',v:'#c8d6b0',b:'#a6bcb0',st:'#7a5a3e'},
 {id:'golden-spirit',n:'Doré Golden Spirit',c:'#c4b03c',v:'#eadc8a',b:'#c8c690',st:'#8a6a3a'},
 {id:'automne',n:"Feu d'automne",c:'#d4702a',v:'#f0b060',b:'#d09a6a',st:'#6a3a2a'}];
const LP_COTI=prof([[0,.06],[.1,.42],[.3,.82],[.55,1],[.76,.94],[.9,.68],[.97,.34],[1,0]]);
/* one cotinus leaf at a node: petiole out from the axis, blade held up and out toward the light */
function cotiLeaf(parts,node,r,T,len,cw,col,o={}){const el=(o.el??R(28,48))*D,H=V3.nz(V3.add(V3.add(V3.sc(r,Math.cos(el)),V3.sc(T,Math.sin(el))),[0,R(-.1,.15),0])),
    N=V3.nz(V3.add(V3.add(V3.sc(T,.2),[0,.62,.12]),V3.sc(r,.6+R(-.2,.2))));
  return leaf5(parts,{base:node,H,N,pl:len*R(.45,.7),len,wid:len*R(.78,.92),wp:LP_COTI,fold:R(.08,.22),ar:R(.04,.1),dr:R(.04,.12),tw:R(-.3,.3),pal:pal7(col),palB:pal7(mix(cw.b,col,.25)),
    nl:7,vc:cw.v,vw:.3,pc:mix(cw.st,col,.3),pw:Math.max(.8,len*.028),Ib:(o.Ib||0)+(hsl(col)[2]<.3?-.07:0)})}
/* the branch: along the composer's spine in a bouquet, upright in the frame of the view on a sheet; o.cm ≥ 20 is the stem length, else the leaf size */
function cotinusBranch(g,t,o){const cw=cwPick(CW_COTI,o),col=o.col||cw.c,k=G(g),parts=[],op=Math.max(.1,Math.min(1,o.op??R(.85,1))),
    Lleaf=(o.cm&&o.cm<20?o.cm:6)*UPC*(.55+.45*op)*R(.92,1.08),Lt=o.spine?blen(o.spine):(o.cm>=20?o.cm:o.up?28:40)*UPC,A=spAxis(o,Lt,{bow:R(-.14,.14),face:R(-.6,.6)}),L=A.L,
    sc=pal7(cw.st),cols=[sc.d2,sc.d1,sc.b,sc.l1],w0=Math.min(4.2,2.2+L*.006),young=mix(col,cw.id==='vert'||cw.id==='golden-spirit'?'#a8b860':'#8a2a3a',.25*(1-op));
  /* leaves on the upper part only (the lower stem is stripped, as cut); crowded and smaller toward the tip */
  const l0=o.spine?Math.max(12*UPC,L*.3):L*.24,n=Math.round(8+9*op*Math.min(1,L/(36*UPC))),ph=R(0,360),nodes=[];
  for(let i=0;i<n;i++){const u=i/(n-1),l=l0+(L-l0)*(1-Math.pow(1-u,1.5))*.97,s=A.sOf(l),fr=A.at(s),az=(ph+i*144+R(-14,14))*D,r=V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az)));
    nodes.push(s);cotiLeaf(parts,fr.p,r,fr.T,Lleaf*(1-.5*u*u)*R(.86,1.1),cw,u>.8?young:col,{el:30+u*28})}
  /* the bud of the tip: two folded young leaves */
  const tp=A.at(1);for(const sd of[-1,1]){const r=V3.nz(V3.add(V3.sc(tp.Sd,sd),V3.sc(tp.Fr,.3)));cotiLeaf(parts,tp.p,r,tp.T,Lleaf*.32,cw,young,{el:62})}
  /* a side shoot from the middle, ending in its own small leaves */
  if(L>30*UPC&&rnd()<.75){const s=A.sOf(l0+(L-l0)*R(.2,.4)),fr=A.at(s),az=R(0,6.28),r=V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az))),d=V3.nz(V3.add(V3.sc(r,.75),V3.sc(fr.T,.66))),ls=L*R(.18,.26),
      C=[fr.p,V3.add(fr.p,V3.sc(d,ls*.4)),V3.add(V3.add(fr.p,V3.sc(d,ls*.75)),V3.sc(fr.T,ls*.2)),V3.add(V3.add(fr.p,V3.sc(d,ls)),V3.sc(fr.T,ls*.35))],B=spAxis({},ls,{C,Fr:fr.Fr});
    axSeg5(B,parts,0,1,w0*.45,w0*.25,cols);const m=4;for(let j=0;j<m;j++){const sj=.35+.65*j/(m-1),fj=B.at(sj),a2=(j*144+R(-20,20))*D,rj=V3.add(V3.sc(fj.Fr,Math.cos(a2)),V3.sc(fj.Sd,Math.sin(a2)));
      cotiLeaf(parts,fj.p,rj,fj.T,Lleaf*(.85-.12*j)*R(.9,1.05),cw,j>=m-1?young:col,{el:36})}}
  /* the stem in a few pieces, each at its depth between the leaves */
  const sa=o.spine?o.from||0:0,cuts=[sa];for(let i=2;i<nodes.length;i+=3)if(nodes[i]>cuts[cuts.length-1]+.04)cuts.push(nodes[i]);cuts.push(1);
  const wt=s=>w0+(w0*.28-w0)*Math.max(0,(s-sa)/(1-sa||1));for(let j=0;j<cuts.length-1;j++)axSeg5(A,parts,cuts[j],cuts[j+1],wt(cuts[j]),wt(cuts[j+1]),cols);
  drawParts(k,parts);open(k,t,1000,0,.4);return{k,bw:w0,bw1:w0*.72,bc:cols}}
Object.assign(GH,{'cotinus-coggygria-arbre-a-perruques':cotinusBranch});CWS['cotinus-coggygria-arbre-a-perruques']=CW_COTI;SZG['cotinus-coggygria-arbre-a-perruques']=[40,50,50,60,70];
GHI['cotinus-coggygria-arbre-a-perruques']={form:'feuillage',size:1.1,k:'cup',rk:3.3,an:[0,-240],self:50*UPC};
/* ---------- fustet en plumes (Cotinus coggygria, inflorescences) : grande panicule lâche de 15 à 25 cm, presque toute stérile ; ses pédicelles s'allongent et se couvrent
   de longs poils étalés qui font la « fumée » (rose fumé, vieux rose, pourpre chez 'Royal Purple', beige rosé, vert tendre en début d'été) ; quelques feuilles rondes sous la panicule ---------- */
const CW_FUST=[
 {id:'rose-fume',n:'Rose fumé',c:'#c9a0a6',lf:'#6f8f74',sk:'#9a6a5e'},
 {id:'vieux-rose',n:'Vieux rose',c:'#a4726e',lf:'#4a2034',sk:'#7a4a44'},
 {id:'pourpre',n:'Pourpre Royal Purple',c:'#8a4a5a',lf:'#4a2034',sk:'#6a3040'},
 {id:'beige',n:'Beige rosé',c:'#d8c8aa',lf:'#6f8f74',sk:'#9a7a5a'},
 {id:'vert',n:'Vert tendre',c:'#b8b88a',lf:'#6f8f74',sk:'#7a7a4a'}];
/* the smoke: the panicle's branches out from its rachis, each forking into pedicels that end in tufts of spreading hairs;
   the hairs batched by depth (behind / in front of the skeleton) and by light (from the tuft's place on the cloud), the skeleton seen through the haze */
function smokeCloud(k,Q0,T,Fr,Sd,Rp,cw,col,op){const sk=mix(cw.sk,col,.25),c=mix(col,op<.35?'#c8c890':'#e8dcc8',op<.35?.55:op<.75?.25:0),P=pal7(c),ag=op<.35?.5:op<.75?.8:1,Rr=Rp*ag,
    nb=Math.round(8+3*ag),Lr=Rr*1.25,hl=Rp*.2*(op<.35?.3:op<.75?.65:1),dens=(DET>=1.5?1:.8)*(LOD?.45:1),tufts=[],br1=[],br2=[];
  const ctr=V3.add(Q0,V3.sc(T,Lr*.5));
  br1.push([Q0,V3.add(Q0,V3.sc(T,Lr))]);
  for(let j=0;j<nb;j++){const h=(j+.5)/nb,a=(j*137.5+R(-20,20))*D,e=(72-46*h+R(-8,8))*D,rd=V3.add(V3.sc(Fr,Math.cos(a)),V3.sc(Sd,Math.sin(a))),d=V3.nz(V3.add(V3.sc(T,Math.cos(e)),V3.sc(rd,Math.sin(e)))),
      b0=V3.add(Q0,V3.sc(T,Lr*h*.92)),lj=Rr*(1.05-.55*h)*R(.85,1.1),b1=V3.add(V3.add(b0,V3.sc(d,lj)),[0,-lj*.08,0]);br1.push([b0,b1]);
    /* each branch forks into branchlets, each branchlet ends in plumose pedicels: tufts all along them */
    const nf=Math.round(2+2*ag);for(let i=0;i<nf;i++){const u=R(.25,1),p=V3.add(V3.sc(b0,1-u),V3.sc(b1,u)),dv=V3.nz(V3.add(V3.sc(d,.5),[R(-1,1),R(-.6,1),R(-1,1)])),q=V3.add(p,V3.sc(dv,Rr*R(.12,.34)*ag));br2.push([p,q]);
      const nt=Math.round(3+3*ag);for(let m=0;m<nt;m++){const w=R(.2,1),c0=V3.add(V3.sc(p,1-w),V3.sc(q,w)),e2=V3.add(c0,V3.sc(V3.nz([R(-1,1),R(-1,1),R(-1,1)]),Rr*R(.04,.14)));if(m%2)br2.push([c0,e2]);tufts.push(e2)}}
    tufts.push(b1)}
  for(let i=0;i<5*ag;i++){const q=V3.add(V3.add(Q0,V3.sc(T,Lr*R(.9,1.08))),V3.sc(V3.nz([R(-1,1),R(-.2,1),R(-1,1)]),Rr*.18));br2.push([V3.add(Q0,V3.sc(T,Lr*.95)),q]);tufts.push(q)}
  /* hairs: 8 bins (behind/front × 4 light levels), one path each; long, fine and wavy */
  const bins=[[],[]].map(()=>['','','','']),blob=['',''],tone=[P.d2,P.d1,P.b,P.l1],tone2=[P.d1,P.b,P.l1,P.l2];let fl='';
  const zc=ctr[2];
  for(const q of tufts){const n=V3.nz(V3s(q,ctr)),side=q[2]>=zc?1:0,nh=Math.max(2,Math.round(9*dens*(.5+.5*ag)));
    const I=lightI(n)+(side?.06:-.16)+R(-.08,.08),b=I<.42?0:I<.6?1:I<.78?2:3,s=sc5(q);
    if(!LOD&&V3l(V3s(q,ctr))<Rr*.8){const rb=hl*R(.55,.85);blob[side]+=`M${f(s[0]-rb)},${f(s[1])}a${f(rb)},${f(rb)} 0 1,0 ${f(2*rb)},0a${f(rb)},${f(rb)} 0 1,0 ${f(-2*rb)},0`}
    for(let i=0;i<nh;i++){const dv=V3.nz(V3.add(V3.sc(n,.55),[R(-1,1),R(-1,1),R(-1,1)])),l=hl*R(.55,1.35),pp=V3.nz([R(-1,1),R(-1,1),R(-1,1)]),e=sc5(V3.add(q,V3.sc(dv,l))),m=sc5(V3.add(q,V3.add(V3.sc(dv,l*.5),V3.sc(pp,l*.32))));
      bins[side][b]+=`M${q5(s)}Q${q5(m)} ${q5(e)}`}
    if(op<.5&&rnd()<.5)fl+=`M${f(s[0]-.7)},${f(s[1])}a.7,.7 0 1,0 1.4,0a.7,.7 0 1,0 -1.4,0`}
  const seg=L=>{let d='';for(const[a,b]of L){const A=sc5(a),B=sc5(b),m=[(A[0]+B[0])/2,(A[1]+B[1])/2-Math.hypot(B[0]-A[0],B[1]-A[1])*.06];d+=`M${q5(A)}Q${q5(m)} ${q5(B)}`}return d};
  const hw=Math.max(.3,Rp*.0045),hop=op<.35?.6:.6;
  for(const side of[0,1]){if(blob[side])E('path',{d:blob[side],fill:side?P.l1:P.d1,opacity:side?.2:.26},k);
    for(let b=0;b<4;b++)if(bins[side][b])E('path',{d:bins[side][b],stroke:side?tone2[b]:tone[b],'stroke-width':f(hw),'stroke-opacity':hop,fill:'none','stroke-linecap':'round'},k);
    if(!side){E('path',{d:seg(br1),stroke:mix(sk,c,.2),'stroke-width':f(Math.max(.5,Rp*.008)),fill:'none','stroke-linecap':'round'},k);E('path',{d:seg(br2),stroke:mix(sk,c,.5),'stroke-width':f(Math.max(.3,Rp*.0045)),fill:'none',opacity:.8,'stroke-linecap':'round'},k)}}
  if(fl)E('path',{d:fl,fill:'#c8c060',opacity:.9},k)}
/* the plume on its stem: along the composer's spine in a bouquet (a cluster: its lower stem is drawn with the bouquet's stems), upright on a sheet; o.cm is the panicle's size */
function smokePlume(g,t,o){const cw=o.cw||CW_FUST.find(w=>w.c===o.col)||cwNear(CW_FUST,o.col)||CW_FUST[0],col=o.col||cw.c,k=G(g),parts=[],op=Math.max(.1,Math.min(1,o.op??R(.85,1))),
    Rp0=o.spine&&o.from>.31?(1-o.from)*blen(o.spine)/2.2:(o.cm||20)/2*UPC*.8,Rp=Rp0*R(.94,1.06),Lt=o.spine?blen(o.spine):Rp*(o.up?1.9:4.4),A=spAxis(o,Lt,{bow:R(-.1,.1),face:R(-.6,.6)}),L=A.L,
    sp=pal7(cw.sk),cols=[sp.d2,sp.d1,sp.b,sp.l1],sa=o.spine?o.from||0:0,w0=Math.min(3.4,1.8+L*.004),lb=Math.max(sa*L+4,L-Rp*1.05),sb=A.sOf(lb);
  /* a few round leaves on the stem below the panicle (the cut stem is stripped lower down) */
  const lc=cw.lf,lcw=CW_COTI.find(w=>w.c===lc)||CW_COTI[0],nl=o.spine?(L*(1-sa)>Rp*2.2?2:1):3;
  for(let i=0;i<nl;i++){const l=lb-Rp*(.25+.55*i)*R(.9,1.1);if(l<Math.max(sa*L+6,10*UPC*(o.spine?1:0)))continue;const s=A.sOf(l),fr=A.at(s),az=(i*144+R(-20,20))*D,r=V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az)));
    cotiLeaf(parts,fr.p,r,fr.T,5*UPC*R(.85,1.1)*Math.min(1,Rp/(9*UPC)+.3),lcw,lc,{el:40})}
  axSeg5(A,parts,sa,sb,w0,w0*.6,cols);
  const tp=A.at(sb),T=V3.nz(V3.add(V3.sc(tp.T,.7),V3.sc(A.at(1).T,.3)));
  parts.push({z:V3.add(tp.p,V3.sc(T,Rp*.6))[2]+Rp*.45,fn:par=>smokeCloud(par,tp.p,T,tp.Fr,tp.Sd,Rp,cw,col,op)});
  drawParts(k,parts);open(k,t,1050,0,.4);return{k,bw:w0,bw1:w0*.72,bc:cols}}
Object.assign(GH,{'fustet-plumes':smokePlume});CWS['fustet-plumes']=CW_FUST;SZG['fustet-plumes']=[15,20,20,25];
GHI['fustet-plumes']={form:'grappe',size:1.1,k:'cup',rk:.8,an:[0,-140],self:60*UPC};
/* ---------- liane de jasmin (Jasminum polyanthum ; J. officinale) : tige volubile souple qui retombe ; feuilles opposées, pennées, 5 à 7 folioles lancéolées (la terminale plus longue, acuminée) ;
   panicules axillaires et terminales de boutons roses en massue, qui s'ouvrent en étoiles blanches à 5 lobes (2 cm) sur un tube rosé.
   Économe : une liane entière tient en une trentaine de tracés (folioles, fleurs et boutons regroupés par plan et par lumière), sans perdre son volume ---------- */
const CW_JASM=[
 {id:'fleuri',n:'Polyanthum fleuri',c:'#4a7232',bud:'#d4607e',fl:.7},
 {id:'boutons',n:'Polyanthum en boutons roses',c:'#3f6a2e',bud:'#cc5474',fl:.18},
 {id:'officinale',n:'Officinale blanc pur',c:'#5a7e3a',bud:'#efe2dc',fl:.6},
 {id:'feuillage',n:'Feuillage seul',c:'#2f5428',bud:null,fl:0},
 {id:'fiona',n:'Officinale Fiona Sunrise (doré)',c:'#b4ac3e',bud:'#f0e4dc',fl:.4}];
/* where a drape hangs in a bouquet (set by the composer): its origin, side, the vessel's lip and floor */
/* one strand hanging from the origin (+y down on screen): it rises out of the mouth, crests over the lip (never under it) and falls, twining a little in depth */
function jasmStrand(k,o){const cw=o.cw||CW_JASM.find(w=>w.c===o.col)||CW_JASM[0],col=o.col||cw.c,op=Math.max(.1,Math.min(1,o.op??R(.85,1))),B=o.ax?frameOf(o,0):I3,
    X=typeof DRAPEX!=='undefined'&&DRAPEX,side=X?X.side||1:(o.sway||0)<0?-1:1,Lv0=o.len||(o.cm||80)*UPC,sw=(o.sway??R(10,30)*side)*R(.7,1.3);
  /* the crest above the lip and the room below it (a strand rests where the table stops it) */
  let hc=R(6,12),dxc=side*R(8,18),Lh=Lv0*.88;
  if(X){hc=Math.max(5,X.y-(X.top-R(5,10)));if(!X.held){const room=X.FL-3-X.y;Lh=Math.min(Lh,room)}dxc=side*Math.max(6,Math.min(26,X.mw-Math.abs(X.x-X.mcx)+R(4,10)))}
  Lh=Math.max(40,Lh);const C=[[0,0,0],[dxc*.45,hc*1.5,R(-3,3)],[dxc+(sw-dxc)*.12+side*Lh*.08,-Lh*.32,R(-8,8)],[sw-side*Lh*.04,-Lh,R(-12,12)]],cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  /* the twining centreline, sampled; its length table; then turned into the view */
  const NS=36,ph=R(0,6.28),tw=Lh/R(55,80),pts=[];for(let i=0;i<=NS;i++){const s=i/NS,q=cb(s),a=ph+s*tw*6.28,am=2.2*Math.min(1,s*4);pts.push(toV(B,[q[0]+Math.cos(a)*am,q[1],q[2]+Math.sin(a)*am]))}
  const cum=[0];for(let i=1;i<=NS;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const Lv=cum[NS];
  const at=l=>{l=Math.max(0,Math.min(Lv,l));let i=1;while(i<NS&&cum[i]<l)i++;const t=(l-cum[i-1])/((cum[i]-cum[i-1])||1),p=V3.add(V3.sc(pts[i-1],1-t),V3.sc(pts[i],t)),T=V3.nz(V3s(pts[i],pts[i-1]));return{p,T}};
  const LP=pal7(col),LB=pal7(mix(col,'#b8c8a0',.3)),sg=pal7(mix(col,'#6a8a3a',.4)),bud=cw.bud?pal7(cw.bud):null,wh=pal7(mix('#fbf8f4',cw.bud||'#fbf8f4',.04)),bk=pal7(mix('#f6eef0',cw.bud||'#e8c8d0',.35)),
    U2=V3.nz(toV(B,[0,0,1])),UP=[0,1,0],sz=Math.min(1.15,Math.max(.7,Lv/(60*UPC)))*R(.92,1.08);
  /* batches: [layer][bin] → path; layer 0 behind the strand, 1 in front */
  const Lf=[['','','','','',''],['','','','','','']],Mr=['',''],Fs=['',''],Bd=[['',''],['','']],Lo=[['','',''],['','','']],Ct=['',''];
  const lay=(p,ps)=>p[2]>=ps[2]?1:0;
  const leaflet=(ly,b0,H,N,len,wid)=>{N=V3.nz(V3s(N,V3.sc(H,V3.dot(N,H))));const W=V3.cr(N,H),fo=.25,P=(v,u)=>{const w=wid*.5*Math.sin(Math.PI*Math.pow(v,.8))*(1-.35*v);return V3.add(V3.add(V3.add(b0,V3.sc(H,len*v)),V3.sc(W,u*w)),V3.add(V3.sc(N,Math.abs(u)*w*fo+len*.06*Math.sin(Math.PI*v)),[0,-len*.08*v*v,0]))};
    const up=N[2]>=0,I=lightI(up?N:V3.sc(N,-1))+R(-.05,.05),bi=(up?0:3)+(I<.5?0:I<.72?1:2),a=sc5(P(0,0)),t=sc5(P(1,0)),l1=sc5(P(.3,1.25)),l2=sc5(P(.72,1.1)),r1=sc5(P(.3,-1.25)),r2=sc5(P(.72,-1.1));
    Lf[ly][bi]+=`M${q5(a)}C${q5(l1)} ${q5(l2)} ${q5(t)}C${q5(r2)} ${q5(r1)} ${q5(a)}Z`;if(!LOD&&len>9)Mr[ly]+=`M${q5(a)}L${q5(sc5(P(.86,0)))}`};
  /* a pinnate leaf: rachis out from the node, arching down; pairs of leaflets and a longer terminal one */
  const pleaf=(node,r,T,ln,ps)=>{const H=V3.nz(V3.add(V3.add(V3.sc(r,.82),V3.sc(T,R(-.05,.4))),[0,R(0,.25),0])),np=ln>20?3:2,dr=R(.12,.3),pts2=[];for(let i=0;i<=4;i++){const v=i/4;pts2.push(V3.add(V3.add(node,V3.sc(H,ln*v)),[0,-ln*dr*v*v,0]))}
    const ly=lay(pts2[2],ps);Fs[ly]+='M'+pts2.map(p=>q5(sc5(p))).join('L');const N0=V3.nz(V3.add(V3.add(UP,V3.sc(U2,.75)),V3.sc(r,.25)));
    for(let j=1;j<=np;j++){const v=.2+.64*(j-1)/np,p=V3.add(V3.add(node,V3.sc(H,ln*v)),[0,-ln*dr*v*v,0]),Hd=V3.nz(V3s(pts2[Math.min(4,Math.ceil(v*4))],pts2[Math.max(0,Math.ceil(v*4)-1)])),Sd=V3.nz(V3.cr(N0,Hd));
      for(const s of[-1,1]){const Hl=V3.nz(V3.add(V3.add(V3.sc(Sd,s*.9),V3.sc(Hd,R(.3,.45))),[0,R(-.15,.05),0]));leaflet(lay(p,ps),p,Hl,V3.add(N0,[R(-.2,.2),0,R(-.2,.2)]),ln*R(.42,.52)*(1-.08*(np-j)),ln*R(.19,.23))}}
    const e=pts2[4],He=V3.nz(V3s(pts2[4],pts2[3]));leaflet(ly,e,He,N0,ln*R(.62,.78),ln*.25)};
  /* a flower or a bud at the end of its pedicel (d: the pedicel's direction) */
  const bloom5=(p,d,open,ly)=>{if(!bud)return;const tl=8*sz*R(.85,1.1);
    if(!open){const tip=V3.add(p,V3.sc(d,tl)),a=sc5(p),b=sc5(tip),m=sc5(V3.add(p,V3.sc(d,tl*.62))),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w0=.55*sz,w1=1.25*sz;
      const I=lightI(V3.nz(V3.add(V3.sc(U2,.6),[nx*.3,-ny*.3,0])))+R(-.08,.08),bi=I<.62?0:1;
      Bd[ly][bi]+=`M${f(a[0]+nx*w0)},${f(a[1]+ny*w0)}L${f(m[0]+nx*w0*1.1)},${f(m[1]+ny*w0*1.1)}Q${f(b[0]+nx*w1*1.25)},${f(b[1]+ny*w1*1.25)} ${q5(b)}Q${f(b[0]-nx*w1*1.25)},${f(b[1]-ny*w1*1.25)} ${f(m[0]-nx*w0*1.1)},${f(m[1]-ny*w0*1.1)}L${f(a[0]-nx*w0)},${f(a[1]-ny*w0)}Z`;return}
    /* open: tube, then a star of five spreading lobes facing Nf */
    const Nf=V3.nz(V3.add(V3.sc(d,.55),V3.add(V3.sc(U2,.65),[R(-.3,.3),R(-.1,.3),0]))),m=V3.add(p,V3.sc(d,tl*.85)),a=sc5(p),b=sc5(m),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=.5*sz;
    Bd[ly][0]+=`M${f(a[0]+nx*w)},${f(a[1]+ny*w)}L${f(b[0]+nx*w*1.3)},${f(b[1]+ny*w*1.3)}L${f(b[0]-nx*w*1.3)},${f(b[1]-ny*w*1.3)}L${f(a[0]-nx*w)},${f(a[1]-ny*w)}Z`;
    const Ux=V3.nz(V3.cr(Nf,Math.abs(Nf[1])<.9?UP:[1,0,0])),Vx=V3.cr(Nf,Ux),rl=6.6*sz*R(.9,1.1),ph=R(0,1.26),front=Nf[2]>=0,c=sc5(m);
    for(let j=0;j<5;j++){const t=ph+j*1.2566,u=V3.add(V3.sc(Ux,Math.cos(t)),V3.sc(Vx,Math.sin(t))),vv=V3.cr(Nf,u),tip=sc5(V3.add(V3.add(m,V3.sc(u,rl)),V3.sc(Nf,-rl*.12))),
        s1=sc5(V3.add(V3.add(m,V3.sc(u,rl*.55)),V3.sc(vv,rl*.3))),s2=sc5(V3.add(V3.add(m,V3.sc(u,rl*.55)),V3.sc(vv,-rl*.3))),nI=V3.nz(V3.add(Nf,V3.sc(u,.35))),I=lightI(front?nI:V3.sc(nI,-1)),bi=front?(I<.6?1:2):0;
      Lo[ly][bi]+=`M${q5(c)}Q${q5(s1)} ${q5(tip)}Q${q5(s2)} ${q5(c)}Z`}
    if(front&&!LOD)Ct[ly]+=`M${f(c[0]-.7*sz)},${f(c[1])}a${f(.7*sz)},${f(.7*sz)} 0 1,0 ${f(1.4*sz)},0a${f(.7*sz)},${f(.7*sz)} 0 1,0 ${f(-1.4*sz)},0`};
  /* a panicle (cyme) at a node: a short peduncle, then pedicels fanning out, a flower or a bud on each */
  const pan=(node,r,T,ps,nf)=>{const d0=V3.nz(V3.add(V3.add(V3.sc(r,.7),V3.sc(T,.35)),V3.sc(U2,.3))),pl=10*sz*R(.8,1.2),hd=V3.add(node,V3.sc(d0,pl)),ly0=lay(hd,ps);Fs[ly0]+=`M${q5(sc5(node))}L${q5(sc5(hd))}`;
    const fo=cw.fl*Math.min(1,Math.max(0,(op-.2)/.7));for(let i=0;i<nf;i++){const dd=V3.nz(V3.add(V3.sc(d0,.6),[R(-1,1),R(-.6,.9),R(-1,1)])),pe=V3.add(hd,V3.sc(dd,R(3,7)*sz)),ly=lay(pe,ps);Fs[ly]+=`M${q5(sc5(hd))}L${q5(sc5(pe))}`;bloom5(pe,dd,rnd()<fo,ly)}};
  /* nodes: an opposite pair of leaves (decussate), a panicle in some axils, and one at the tip */
  const dn=R(26,32)*sz,nn=Math.floor((Lv-14)/dn),rot0=R(0,3.14);
  for(let i=0;i<nn;i++){const l=14+i*dn+R(-3,3),{p,T}=at(l),q=V3.nz(Math.abs(T[2])<.9?V3.cr(T,[0,0,1]):V3.cr(T,[1,0,0])),q2=V3.cr(T,q),a=rot0+i*Math.PI/2,r1=V3.add(V3.sc(q,Math.cos(a)),V3.sc(q2,Math.sin(a))),u=l/Lv,ln=(22+10*Math.sin(Math.PI*Math.min(1,u*1.4)))*sz*(1-.45*u*u)*R(.9,1.1);
    for(const s of[-1,1]){const r=V3.sc(r1,s);pleaf(p,r,T,ln,p);if(i>0&&rnd()<.62*(.5+op*.5))pan(p,V3.nz(V3.add(r,V3.sc(U2,.5))),T,p,Math.round(R(4,8)))}}
  {const e=at(Lv),pe=at(Lv-4);pan(e.p,V3.nz(V3.add(e.T,V3.sc(U2,.4))),e.T,pe.p,Math.round(R(7,11)))}
  /* paint: behind the strand, the strand, in front of it */
  const svg=par=>{const flat=(d,c,o2={})=>{if(d)E('path',Object.assign({d,fill:c},o2),par)};
    const lt5=[LP.d1,LP.b,LP.l1,LB.d1,LB.b,LB.l1],bud5=bud?[bud.d1,bud.b]:[],lo5=[bk.b,wh.d1,wh.b];
    const layer=ly=>{for(let b=0;b<6;b++)flat(Lf[ly][b],lt5[b],{stroke:shd(lt5[b],-.3),'stroke-width':.3});
      if(Mr[ly])E('path',{d:Mr[ly],stroke:LP.l2,'stroke-width':.35,opacity:.45,fill:'none'},par);
      if(Fs[ly])E('path',{d:Fs[ly],stroke:sg.d1,'stroke-width':f(.7*sz),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
      flat(Lo[ly][0],lo5[0],{stroke:bud?bud.b:'#c8a0a8','stroke-width':.25});for(let b=0;b<2;b++)flat(Bd[ly][b],bud5[b],{stroke:bud?bud.d2:'#a04060','stroke-width':.2});
      for(let b=1;b<3;b++)flat(Lo[ly][b],lo5[b],{stroke:wh.d2,'stroke-width':.25});flat(Ct[ly],'#c8b468')};
    layer(0);
    const P2=pts.map(sc5);E('path',{d:sm5(P2),stroke:sg.d1,'stroke-width':f(1.5*sz),fill:'none','stroke-linecap':'round'},par);
    if(!LOD)E('path',{d:sm5(P2.map(p=>[p[0]-.35,p[1]-.35])),stroke:sg.l1,'stroke-width':f(.5*sz),fill:'none','stroke-linecap':'round',opacity:.7},par);
    layer(1)};
  svg(k)}
function jasminDrape(g,t,o){const k=G(g);jasmStrand(k,o);open(k,t,1100,0,0);return k}
Object.assign(GH,{'jasminum-liane-jasmin':jasminDrape});CWS['jasminum-liane-jasmin']=CW_JASM;SZG['jasminum-liane-jasmin']=[60,80,80,100,120];
GHI['jasminum-liane-jasmin']={form:'retombante',size:2,k:'drape',self:100*UPC};
/* ---------- fil d'aluminium décoratif : fil plein de 2 mm, anodisé (argent, or, cuivre, rose, rouge, noir), courbé à la main : ressorts serrés, boucles, spirale plate au bout ;
   un tube plein au reflet métallique net (sombre, corps, éclat), cassé en plans de profondeur pour passer devant et derrière lui-même ---------- */
const CW_FIL=[{id:'argent',n:'Argent',c:'#b9bdc1'},{id:'or',n:'Or',c:'#c9a54a'},{id:'cuivre',n:'Cuivre',c:'#b0693d'},{id:'rose',n:'Rose',c:'#d94a8c'},{id:'rouge',n:'Rouge',c:'#c22a3a'},{id:'noir',n:'Noir',c:'#26262a'}];
/* the wire's centreline along an axis A (spAxis): runs, coils round the axis, loops off to one side, and a flat spiral at the end */
function wirePath(A,L,o){const P=[],add=p=>P.push(p),seq=o.seq,dl=2.2;let l=0;
  const fr=l=>A.at(A.sOf(l));
  for(const[kind,len,pr]of seq){const l1=Math.min(L,l+len*L);
    if(kind==='run'){const l0=l;for(;l<l1;l+=dl*1.5){const F=fr(l),e=Math.min(1,(l-l0)/30,(l1-l)/30),w=Math.sin((l-l0)/(l1-l0||1)*Math.PI*(o.wv||1)+pr)*o.amp*e;add(V3.add(F.p,V3.sc(F.Sd,w)))}l=l1}
    else if(kind==='coil'){const rc=pr.r,pitch=pr.p,n=Math.max(1,(l1-l)/pitch),ph=pr.ph||0,N=Math.round(n*18);for(let i=0;i<=N;i++){const u=i/N,ll=l+(l1-l)*u,F=fr(ll),a=ph+u*n*6.283,rr=rc*Math.min(1,u*n*2,(1-u)*n*2);
        add(V3.add(F.p,V3.add(V3.sc(F.Sd,Math.sin(a)*rr),V3.sc(F.Fr,Math.cos(a)*rr))))}l=l1}
    /* in a bouquet a loop too near the mouth would dip under the lip: the wire runs straight there instead */
    else if(kind==='loop'&&o.clear&&l<pr.r*2.6+o.clear){for(;l<l1;l+=dl*1.5)add(fr(l).p);l=l1}
    else if(kind==='loop'){const F=fr(l),s=pr.s,rho=pr.r,tl=pr.t||0,ax2=V3.nz(V3.add(V3.sc(F.Sd,s*Math.cos(tl)),V3.sc(F.Fr,Math.sin(tl)))),c=V3.add(F.p,V3.sc(ax2,rho));
      for(let i=0;i<=28;i++){const a=i/28*6.283,dv=V3.add(V3.sc(ax2,-Math.cos(a)),V3.sc(F.T,Math.sin(a))),q=V3.add(V3.add(c,V3.sc(dv,rho)),V3.sc(F.T,(l1-l)*i/28));add(q)}l=l1}}
  /* the end: a flat spiral facing out of the bouquet, wound from its outer turn to its eye */
  if(o.spiral){const F=fr(L),R0=o.spiral,ns=V3.nz(V3.add(V3.add(V3.sc(F.Fr,.85),V3.sc(F.T,.25)),V3.sc(F.Sd,R(-.3,.3)))),Ux=V3.nz(V3.cr(ns,F.T)),Vx=V3.cr(ns,Ux),tu=R(2.3,3.2),a0=R(0,6.28),
      st=V3.add(V3.sc(Ux,Math.cos(a0)),V3.sc(Vx,Math.sin(a0))),c=V3s(F.p,V3.sc(st,R0));
    const N=Math.round(tu*30);for(let i=0;i<=N;i++){const u=i/N,a=a0+u*tu*6.283,r=R0*(1-u*.9),dv=V3.add(V3.sc(Ux,Math.cos(a)),V3.sc(Vx,Math.sin(a)));add(V3.add(c,V3.sc(dv,r)))}}
  return P}
/* the wire drawn as a solid metal tube: subpaths grouped by depth band, each band three strokes (shadow, body, glint) offset toward the light */
function wireDraw(parts,P,col,w){const lum=hsl(col)[2],pc=pal7(col),cs=[shd(col,lum<.25?-.3:-.62),col,lum<.25?'#8a8c92':shd(col,.55),lum<.25?'#e4e6ea':'#ffffff'],S=P.map(sc5),bands=new Map(),bw=Math.max(2.5,w*2);
  let cur=null,cb=null;for(let i=0;i<P.length;i++){const zb=P[i][2]/bw,b=cb!=null&&Math.abs(zb-cb)<.95?cb:Math.round(zb);if(b!==cb){cur=i>0?[i-1,i]:[i];cb=b;if(!bands.has(b))bands.set(b,[]);bands.get(b).push(cur)}else cur.push(i)}
  const lit=(i,k)=>{const a=S[Math.max(0,i-1)],b=S[Math.min(S.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,s=Math.max(-1,Math.min(1,-(nx+ny)*1.4));return[S[i][0]+nx*s*k,S[i][1]+ny*s*k]};
  for(const[b,runs]of bands){const d=[0,1,2].map(()=>''),ks=[0,w*.16,w*.3];for(const r of runs){if(r.length<2)continue;for(let j=0;j<3;j++)d[j]+=sm5(r.map(i=>j?lit(i,ks[j]):S[i]))}
    parts.push({z:b*bw,fn:par=>{E('path',{d:d[0],stroke:cs[0],'stroke-width':f(w),fill:'none','stroke-linecap':'butt','stroke-linejoin':'round'},par);
      E('path',{d:d[1],stroke:cs[1],'stroke-width':f(w*.62),fill:'none','stroke-linecap':'butt','stroke-linejoin':'round'},par);
      if(!LOD)E('path',{d:d[2],stroke:cs[3],'stroke-width':f(Math.max(.25,w*.2)),fill:'none','stroke-linecap':'butt',opacity:.9},par)}})}}
/* a wire in a bouquet (along the composer's spine) or on a sheet (upright); o.cm its length */
function alWire(g,t,o){const col=o.col||CW_FIL[0].c,k=G(g),parts=[],w=1.3*(o.cm&&o.cm<=5?o.cm/2:1),Lt=o.spine?blen(o.spine):(o.cm>5?o.cm:50)*UPC*.7,A=spAxis(o,Lt,{bow:R(-.12,.12),face:R(-.5,.5)}),L=A.L;
  const sz=Math.min(1.3,Math.max(.6,L/(35*UPC))),sd=rnd()<.5?-1:1,ps=[[['run',.3,0],['coil',.2,{r:R(5.5,8)*sz,p:R(3.4,4.6),ph:R(0,6)}],['run',.14,3.1],['loop',.06,{s:sd,r:R(15,22)*sz,t:R(-.6,.6)}],['run',.3,0]],
    [['run',.24,3.1],['loop',.05,{s:sd,r:R(13,19)*sz,t:R(-.5,.5)}],['run',.16,0],['coil',.24,{r:R(5,7.5)*sz,p:R(3.2,4.4),ph:R(0,6)}],['run',.31,3.1]],
    [['run',.32,0],['loop',.05,{s:-sd,r:R(14,20)*sz,t:R(-.5,.5)}],['run',.12,3.1],['loop',.05,{s:sd,r:R(12,17)*sz,t:R(-.5,.5)}],['run',.16,0],['coil',.2,{r:R(4.5,6.5)*sz,p:R(3,4),ph:R(0,6)}]]],
    seq=pick(ps),P=wirePath(A,L,{seq,amp:R(8,16)*sz,wv:R(1,2),spiral:R(18,26)*sz,clear:o.spine?12:0});
  wireDraw(parts,P,col,w);drawParts(k,parts);open(k,t,900,0,.4);return{k}}
Object.assign(GH,{'fil-aluminium-decoratif':alWire});CWS['fil-aluminium-decoratif']=CW_FIL;SZG['fil-aluminium-decoratif']=[40,50,50,60];
GHI['fil-aluminium-decoratif']={form:'ligne',size:1,k:'plant',self:50*UPC,tip:1,fx:3*UPC};
