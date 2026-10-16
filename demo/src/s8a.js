/* ================= Serre, lot 8 — Épis : delphinium, pied-d'alouette, muflier, giroflée, glaïeul ================= */
/* ---------- the axis of a spike, from its base (the mouth of the vessel in a bouquet, the cut end on a sheet) to its tip: a 3D cubic in view space (y up),
   with its frame along the way (T up the axis, Fr its front, Sd its right side) and its length table. In a bouquet it follows the composer's spine;
   on a sheet or a card it stands in the frame of the view (o.ax = where its front looks) ---------- */
function spAxis(o,Lt,opt={}){let C,Fr0=null,phi0=0;
  if(opt.C){C=opt.C;Fr0=opt.Fr||null;phi0=opt.face||0}
  else if(o.spine){C=o.spine.map(p=>[p[0],-p[1],0]);phi0=opt.face??R(-.6,.6)}
  else{const B=frameOf(o,0),bw=opt.bow??R(-.05,.05);C=[[0,0,0],[bw*Lt*.12,Lt*.34,0],[bw*Lt*.5,Lt*.68,0],[bw*Lt,Lt,0]].map(p=>toV(B,p));Fr0=toV(B,[0,0,1])}
  const cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])},
    tg=s=>{const a=cb(Math.max(0,s-.004)),b=cb(Math.min(1,s+.004));return V3.nz(V3s(b,a))};
  const N=48,cum=[0];let pv=cb(0);for(let i=1;i<=N;i++){const q=cb(i/N);cum.push(cum[i-1]+V3l(V3s(q,pv)));pv=q}const L=cum[N];
  const sOf=l=>{l=Math.max(0,Math.min(L,l));let i=1;while(i<N&&cum[i]<l)i++;return Math.min(1,(i-1+(l-cum[i-1])/((cum[i]-cum[i-1])||1))/N)};
  const at=s=>{const p=cb(s),T=tg(s);let Fr;if(Fr0)Fr=V3s(Fr0,V3.sc(T,V3.dot(Fr0,T)));else{const S0=V3.cr(T,[0,0,1]);Fr=V3.add(V3.sc([0,0,1],Math.cos(phi0)),V3.sc(S0,Math.sin(phi0)))}
    if(V3l(Fr)<1e-6)Fr=[0,0,1];Fr=V3.nz(Fr);return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  return{C,cb,at,L,sOf,Cs:C.map(p=>[p[0],-p[1]])}}
/* the colourway asked for: its exact colour (a product), else the nearest of the usual forms (a model's colour never lands on a rarer form like the belladonna) */
const cwPick=(list,o)=>o.cw||list.find(w=>w.c===o.col)||cwNear(list.filter(w=>!w.f),o.col)||list[0];
/* a floret on the axis at s, turned az from the front, its base rOff out (and up along the axis), facing out and el up the spike */
function spAt(A,s,az,rOff,el,up=0){const f=A.at(s),r=V3.add(V3.sc(f.Fr,Math.cos(az)),V3.sc(f.Sd,Math.sin(az))),
    pos=V3.add(V3.add(f.p,V3.sc(r,rOff)),V3.sc(f.T,up)),ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f.T,Math.sin(el))));return{pos,ax,T:f.T,r,node:f.p}}
/* its frame: the face along ax, its top toward the tip of the spike */
function spFrame(ax,T,roll=0){let Y=V3s(T,V3.sc(ax,V3.dot(T,ax)));if(V3l(Y)<1e-6)Y=Math.abs(ax[1])<.9?[0,1,0]:[1,0,0];Y=V3.nz(Y);const X=V3.cr(Y,ax),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),ax]}
/* the stem and the rachis as segments in the painter's order (each between the florets behind and in front of it), tapering from w0 to w1 */
function spStem(A,parts,cuts,w0,w1,cols,s1=1,sa=0){const wt=s=>w0+(w1-w0)*Math.max(0,Math.min(1,(s-sa)/((s1-sa)||1)));for(let j=0;j<cuts.length-1;j++){const a=cuts[j],b=cuts[j+1];if(b-a<1e-3)continue;const P=bseg(A.Cs,a,b),wa=wt(a),wb=wt(b);let z=0;for(let i=0;i<=4;i++)z+=A.cb(a+(b-a)*i/4)[2];
  (A.segs=A.segs||[]).push([a,b,z/5-.01]);parts.push({z:z/5-.01,fn:par=>stem3(par,P,wa,wb,cols,8)})}
  A.zk=(s,z)=>{const sg=A.segs.find(q=>s>=q[0]-1e-6&&s<=q[1]+1e-6);return sg?sg[2]+.011+(z-A.cb(s)[2]):z}}
/* a pedicel from the axis to a floret: a short curved stroke */
function spPed(par,node,pos,T,w,col){w=Math.max(1.05,w);const a=[node[0],-node[1]],b=[pos[0],-pos[1]],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(l<.8)return;const c=[a[0]+(b[0]-a[0])*.55+T[0]*l*.18,a[1]+(b[1]-a[1])*.55-T[1]*l*.18];
  E('path',{d:`M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}`,stroke:col,'stroke-width':f(w),fill:'none','stroke-linecap':'round'},par)}
/* a slender tapered tube (spur, pedicel, bud tip) as one path: its outline, one tone, its edge */
function tubeFlat(B,O,P3,r0,r1,col,o={}){const C=P3.map(p=>PJ(B,O,p)),n=C.length-1,Lp=[],Rg=[];
  for(let i=0;i<=n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,r=r0+(r1-r0)*i/n;Lp.push([C[i][0]-dy/l*r,C[i][1]+dx/l*r]);Rg.push([C[i][0]+dy/l*r,C[i][1]-dx/l*r])}
  let z=0;for(const c of C)z+=c[2];z/=C.length;const e=C[n],e0=C[n-1],tip=[e[0]+(e[0]-e0[0])*.25,e[1]+(e[1]-e0[1])*.25],out=Lp.concat([tip],Rg.reverse());
  return{z:z+(o.zb||0),fn:par=>E('path',{d:smooth(out),fill:col,stroke:o.ink||shd(col,-.5),'stroke-width':o.sw||.4,'stroke-opacity':o.eo??.6},par)}}
/* shared fills: a round body lit from the upper left (buds), and a soft flush from the centre of a floret (one per colour) */
const BUDF={};function budFill(c){const id=BUDF[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='bf'+(gid++),P=pal7(c),gr=E('radialGradient',{id:nid,cx:.36,cy:.32,r:.78},defs);stops(gr,[[0,P.l1],[.42,P.b],[.82,P.d1],[1,P.d2]]);BUDF[c]=nid;return`url(#${nid})`}
const FLUF={};function flushFill(c,a=.75){const key=c+a;const id=FLUF[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='fx'+(gid++),gr=E('radialGradient',{id:nid,cx:.5,cy:.5,r:.5},defs);stops(gr,[[0,c,a],[.55,c,a*.45],[1,c,0]]);FLUF[key]=nid;return`url(#${nid})`}
/* an ellipse in a floret's plane (local z = z0), radius r: its projected outline */
const spDisc=(B,O,r,z0,n=14)=>{const q=[];for(let i=0;i<n;i++){const a=i/n*6.283,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z0]);q.push([p[0],p[1]])}return q};
/* draw a floret's items far to near: petals (from ligule) one path each, toned by their facing, their back side greener or paler; other items draw themselves */
function spPetals(k,items,cache){const zz=it=>it.l?it.l.z:it.z;items.sort((a,b)=>zz(a)-zz(b));
  for(const it of items){if(!it.l){it.fn(k);continue}const l=it.l,back=l.nm[2]<0,cc=back?(it.cb||mix(it.c,'#e8e4d8',.2)):it.c,I0=lightI(back?V3.sc(l.nm,-1):l.nm)*(it.ao||1),I=it.lift?it.lift+(1-it.lift)*Math.max(0,I0):I0,key=cc+Math.round(I*14);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1,P.ink]}
    const lite=h2l(cc)[2]>.82;E('path',{d:smooth(l.out),fill:it.fill||tone[0],stroke:lite?shd(cc,-.5):it.ink||tone[1],'stroke-width':it.sw||.36,'stroke-opacity':it.eo??(lite?.62:.5)},k);
    /* a tinted tip (green-tipped sepals): the rows beyond tf of the outline */
    if(it.tipc&&!LOD){const n=(l.out.length-1)>>1,i0=Math.round(n*(it.tf||.55)),q=l.out.slice(i0,l.out.length-i0);if(q.length>3)E('path',{d:smooth(q),fill:it.tipc,opacity:back?.6:.45},k)}
    /* a blotch at the base (the throat of a gladiolus), a picotee along the margin */
    if(!back&&!LOD&&(it.basec||it.edgec)){const nr=l.S.length-1;if(it.basec){const i1=Math.max(1,Math.round(nr*(it.bf||.5))),q=l.out.slice(0,i1+1).concat(l.out.slice(l.out.length-(i1+1)));E('path',{d:smooth(q),fill:it.basec,opacity:it.bo??.85},k)}
      if(it.edgec){const i0=Math.round(nr*.3),q=l.out.slice(i0,l.out.length-i0);E('path',{d:smooth(q,false),stroke:it.edgec,'stroke-width':f(it.ew||1),'stroke-opacity':.85,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},k)}}
    if(it.mid&&!back&&!LOD){const q=l.S.map(r=>[r[2][0],r[2][1]]);E('path',{d:smooth(q.slice(0,-1),false),stroke:it.mid,'stroke-width':f(it.mw||.5),'stroke-opacity':it.mo??.55,fill:'none','stroke-linecap':'round'},k)}}}
/* one shading veil over a whole floret: the union of its petals (outlines turned the same way, so overlaps fill once), lit at the centre, darker at the rim */
const spVeil=(k,ls,o=.85)=>{let d='';for(const l of ls){const q=sArea(l.out)<0?l.out.slice().reverse():l.out;d+=smooth(q)}if(d)E('path',{d,fill:floretShade(),opacity:o},k)};
/* ---------- leaves of the spikes, drawn on the screen at (x,y) along ang, foreshortened across by their tilt ---------- */
/* palmately cut (delphinium): a petiole, then lobes fanned out, each cut again; one outline, the half beyond the midrib darker, the main veins */
function palmLeaf(par,x,y,ang,len,col,o={}){const n=o.lobes||5,sp=(o.spread||170)*D,ct=Math.cos(o.tilt??R(.3,.75)),pl=len*(o.pet??.3),bl=len-pl,P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`});
  const LB=[[.08,-.75],[.36,-1.15],[.5,-.62],[.66,-1],[.8,-.5],[1,0],[.8,.5],[.66,1],[.5,.62],[.36,1.15],[.08,.75]],out=[],half=[],vein=[],mid=(n-1)/2;
  for(let j=0;j<n;j++){const th=-sp/2+sp*j/(n-1),Lj=bl*(1-.38*Math.abs(th)/(sp/2))*R(.9,1.06),wj=Lj*(o.wl||.15),c=Math.cos(th),s=Math.sin(th),lob=[];
    for(const[u,v]of LB){const a=u*Lj,b=v*wj*(1+.25*Math.sin(u*9+j));lob.push([pl+a*c-b*s,(a*s+b*c)*ct])}out.push(...lob);vein.push([pl+Lj*.95*c,Lj*.95*s*ct]);
    if(j>mid)half.push(lob);else if(j===mid)half.push(lob.slice(5).concat([[pl,0]]))}
  E('path',{d:`M0,0L${f(pl)},0`,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.022)),'stroke-linecap':'round'},g);
  E('path',{d:smooth(out),fill:toneAt(P,.62),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:half.map(h=>smooth(h)).join(''),fill:P.d1,opacity:.42},g);E('path',{d:vein.map(v=>`M${f(pl)},0L${f(v[0])},${f(v[1])}`).join(''),stroke:P.l1,'stroke-width':f(Math.max(.4,len*.01)),'stroke-opacity':.5,fill:'none'},g)}return g}
/* ---------- delphinium: a tall dense raceme (elatum) or a lighter branched one (belladonna) of spurred florets, five petaloid sepals round a 'bee' ---------- */
const CW_DELPH=[
 {id:'bleu-ciel',n:'Bleu ciel à œil blanc',c:'#9ebfee',bee:'#f3f0e8',beard:'#e6d48a'},
 {id:'bleu-azur',n:'Bleu azur teinté mauve',c:'#6f94e2',c2:'#a9a0e0',bee:'#2c2430',beard:'#c8a040'},
 {id:'bleu',n:'Bleu moyen à œil noir',c:'#5877d0',bee:'#211b23',beard:'#cba548'},
 {id:'bleu-roi',n:'Bleu roi à œil blanc',c:'#4a4cbc',c2:'#5a48b0',bee:'#f2eef0',beard:'#e8d890'},
 {id:'bleu-nuit',n:'Bleu nuit',c:'#2e3d98',c2:'#40389a',bee:'#e9e6ee',beard:'#e8d890'},
 {id:'gentiane',n:'Bleu gentiane (belladonna)',c:'#3350c6',bee:'#e6eaf6',beard:'#efe0a0',f:'bel'},
 {id:'ciel-bella',n:'Bleu ciel (belladonna)',c:'#a8c5ee',bee:'#f6f3ec',f:'bel'},
 {id:'lavande',n:'Lavande',c:'#b4a7e2',c2:'#d2a9d8',bee:'#f2eef4',beard:'#e8d8a0'},
 {id:'mauve',n:'Mauve à œil noir',c:'#b98ac9',c2:'#cc92b8',bee:'#2a1e26',beard:'#c8a040'},
 {id:'violet',n:'Violet profond',c:'#4a2a84',c2:'#5c2a7c',bee:'#1d151d',beard:'#b89038'},
 {id:'rose',n:'Rose poudré',c:'#f0b3c7',c2:'#f6cbd7',bee:'#f6eef0',beard:'#e8d8a0'},
 {id:'framboise',n:'Rose framboise',c:'#dc77a0',bee:'#3a2030',beard:'#c8a040'},
 {id:'blanc',n:'Blanc pur',c:'#f6f5ef',bee:'#f1eee3',beard:'#e6d48a'},
 {id:'blanc-noir',n:'Blanc à œil noir',c:'#f5f3ec',bee:'#262026',beard:'#c8a040'},
 {id:'blanc-bella',n:'Blanc (belladonna)',c:'#f7f6f0',bee:'#f2f0e6',f:'bel'},
 {id:'vert-blanc',n:'Blanc vert (Green Twist)',c:'#eef1de',tip:'#a8c47a',bee:'#e6ead4',beard:'#c4d48a'},
 {id:'bicolore',n:'Bleu teinté de rose',c:'#8aa6e6',c2:'#e2a8cc',bee:'#f0ecf2',beard:'#e8d8a0'}];
const DL_SEP=prof([[0,.3],[.2,.8],[.5,1],[.8,.86],[1,.26]]),DL_IN=prof([[0,.3],[.35,.9],[.65,1],[1,.32]]),DL_UP=prof([[0,.6],[.5,1],[1,.5]]),DL_LO=prof([[0,.5],[.35,.8],[.7,1],[1,.85]]);
/* one floret in its frame B at O (view): five spreading sepals (the top one spurred), inner sepals in the semi-double elatum, the 'bee' of four small petals (two erect, two bearded) */
function delphFloret(par,B,O,Dm,cw,o={}){const Rr=Dm/2,k=G(par),nz=B[2][2],bel=o.bel,det=DET>=1.5,cache=o.cache||{},it=[],seps=[],cb=mix(cw.c,'#9fb878',cw.tip?.1:.2);
  for(let j=0;j<5;j++){const ph=(90+j*72+R(-5,5))*D,l=ligule(B,O,{phi:ph,r0:Rr*.08,z0:0,L:Rr*(j?.92:1.02)*R(.95,1.05),W:Rr*(bel?.36:.47),wp:DL_SEP,a0:(bel?1.02:.92)+R(-.06,.06),a1:(bel?1.52:1.42)+R(-.08,.08),pw:1.25,th:.5,tip:'round',n:det?7:5,tw:R(-.25,.25)});
    seps.push(l);it.push({l,c:cw.c,cb,ink:shd(cw.c,-.36),lift:.32,tipc:cw.tip||(DET>=1.5&&Rr>7?mix(cb,'#7f9a52',.5):null),tf:cw.tip?.5:.78})}
  if(!bel&&(det||Rr>9&&nz>.2))for(let j=0;j<(det?4:3);j++){const ph=(126+j*(det?90:120)+R(-8,8))*D,l=ligule(B,O,{phi:ph,r0:Rr*.06,z0:Rr*.04,L:Rr*.66,W:Rr*.27,wp:DL_IN,a0:.62,a1:1.12,pw:1.2,th:.6,tip:'round',n:5,tw:R(-.3,.3)});
    it.push({l,c:cw.c2?mix(cw.c,cw.c2,.45):lt(cw.c,.06),cb,ink:shd(cw.c,-.36),lift:.32})}
  /* the spur: from behind the top sepal, back and up, tapering to a blunt point, a little greener toward its end */
  const spL=Rr*(bel?1.1:.72);if(det||nz<.6)it.push(tubeFlat(B,O,[[0,Rr*.22,-Rr*.05],[0,Rr*.3,-spL*.38],[0,Rr*.36+spL*.16,-spL*.72],[0,Rr*.42+spL*.42,-spL*.92]],Rr*.1,Rr*.022,toneAt(pal7(mix(cw.c,cb,.6)),.55),{ink:shd(cw.c,-.45),eo:.45}));
  spPetals(k,it,cache);if(LOD)return k;
  if(Math.abs(nz)>(det?.2:.45))spVeil(k,seps);
  /* the Green Twist's green tips; a flush of a second colour from the centre */
  if(cw.c2&&nz>.15)E('path',{d:smooth(spDisc(B,O,Rr*.62,Rr*.03)),fill:flushFill(cw.c2,.7)},k);
  /* the bee, on the face */
  if(nz>(det?-.15:.1)){const up=[],lo=[];for(const s of[-1,1])up.push(ligule(B,O,{phi:(90+s*22)*D,r0:Rr*.035,z0:Rr*.05,L:Rr*.32,W:Rr*.085,wp:DL_UP,a0:.3,a1:.78,pw:1.2,th:.9,tip:'round',n:4}));
    for(const s of[-1,1])lo.push(ligule(B,O,{phi:(270+s*30)*D,r0:Rr*.04,z0:Rr*.06,L:Rr*.3,W:Rr*.12,wp:DL_LO,a0:.55,a1:1.05,pw:1.2,th:.5,tip:'fringe',fr:3,n:4}));
    const Pb=pal7(cw.bee),dark=h2l(cw.bee)[2]<.4,tb=toneAt(Pb,lightI(up[0].nm)+(dark?.1:0));
    if(det){for(const l of lo.concat(up))E('path',{d:smooth(l.out),fill:toneAt(Pb,lightI(l.nm)+(dark?.12:0)),stroke:Pb.ink,'stroke-width':.35,'stroke-opacity':.6},k)}
    else E('path',{d:lo.concat(up).map(l=>smooth(l.out)).join(''),fill:tb,stroke:Pb.ink,'stroke-width':.35,'stroke-opacity':.5},k);
    /* the beard of the lower petals */
    if(cw.beard&&(det||Rr>12&&nz>.3)){let d='';for(const l of lo){const S=l.S,m=S.length-1;for(let j=0;j<5;j++){const a=S[Math.max(1,m-1-(j&1))][j],b=S[m][Math.min(4,j)],dx=b[0]-a[0],dy=b[1]-a[1];d+=`M${f(a[0])},${f(a[1])}l${f(dx*1.3)},${f(dy*1.3)}`}}
      E('path',{d,stroke:cw.beard,'stroke-width':f(Math.max(.35,Rr*.03)),'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},k)}}
  return k}
/* a bud: a plump ovoid on its pedicel (local Z its axis), with the spur rising from its back; greener the younger it is */
function delphBud(par,B,O,s,col,spur=1){const pts=[];for(let i=0;i<=9;i++)for(let j=0;j<10;j++){const v=i/9,a=j/10*6.283,r=s*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.8)*(1-.2*v),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r*.92,v*s*1.08-s*.18]);pts.push([p[0],p[1]])}
  const h=hull2(pts),t=spur&&s>2.4?tubeFlat(B,O,[[0,s*.28,-s*.05],[0,s*.42,-s*.28],[0,s*.62,-s*.42]],s*.16,s*.04,toneAt(pal7(col),.45)):null;
  if(t&&B[2][2]>0)t.fn(par);E('path',{d:smooth(h),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.6},par);if(t&&B[2][2]<=0)t.fn(par)}
/* florets and buds of one raceme along an axis A, from l0 to its tip: open from the bottom (nO of nT), buds after; dense spiral (elatum) or airy (belladonna) */
function delphRaceme(A,parts,l0,nT,nO,Dm,cw,bel,cache,pc,sz0=1){const L=A.L,Lr=L-l0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.015+.97*Math.pow(q,.9)),s=A.sOf(l),az=(i*137.5+R(-14,14))*D;
    if(i<nO){const sz=(1-.22*q)*sz0,pl=spAt(A,s,az,Dm*sz*(bel?.62+.3*(1-q):.4+.2*(1-q)),(bel?.42:.3)+R(-.08,.08),Dm*(bel?.3:.1)),B=spFrame(pl.ax,pl.T,R(-.15,.15));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{if(DET>=1.5||B[2][2]<.5)spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.026),pc);delphFloret(par,B,pl.pos,Dm*sz,cw,{bel,cache})}})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Dm*(.36-.24*qb)*sz0,pl=spAt(A,s,az,Dm*(bel?.32:.2)*(1-.6*qb),.85+.35*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#9cb874',.15+.5*Math.round(qb*4)/4);
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.028),pc);delphBud(par,B,pl.pos,sb,bc,qb<.75)}})}}}
/* the spike: along its spine from the mouth in a bouquet, standing in the view on a sheet or a card; a bare stem with a few cut leaves, then the raceme (and the belladonna's side racemes) */
function delphSpike(g,t,o){const cw=cwPick(CW_DELPH,o),bel=cw.f==='bel',op=Math.max(.05,Math.min(1,o.op??R(.78,1))),k=G(g),parts=[],cache={};
  const Lf0=(o.cm||50)*UPC*(bel?.76:1),Lt=o.spine?blen(o.spine):Lf0*1.42,A=spAxis(o,Lt,{face:R(-.8,.8)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.8:.6:.7)),s0=A.sOf(L-Lfl);
  const Dm=(bel?4.6:6)*UPC*R(.95,1.05)*Math.max(.86,Math.min(1.12,Math.pow(Lf0/(50*UPC),.3))),SC=['#26401e','#466c32','#77a050','#b2cf86'],pc=mix(SC[1],cw.c,.3);
  spStem(A,parts,[0,s0*.55,s0],bel?5:7.5,bel?4:5.6,SC,s0);spStem(A,parts,[s0,s0+(1-s0)*.3,s0+(1-s0)*.6,1],bel?3:4.2,1.1,SC,1,s0);
  /* palmately cut leaves on the bare stem, smaller toward the flowers */
  const nl=bel?2:3;for(let j=0;j<nl;j++){const l=(L-Lfl)*(.32+.5*j/Math.max(1,nl-1))*R(.92,1.05);if(o.spine&&l<14*UPC)continue;const s=A.sOf(l),p=A.cb(s),T=A.at(s).T,sd=j%2?1:-1,ang=Math.atan2(-T[1],T[0])+sd*R(36,52)*D,len=Dm*(1.75-.4*j)*R(.9,1.1);
    parts.push({z:A.zk(s,p[2]+(j%2?.6:-.6)),fn:par=>palmLeaf(par,p[0],-p[1],ang,len,'#3f6a2e',{lobes:j<1&&!bel?7:5,tilt:R(.3,.7),spread:j<1?190:160})})}
  const nT=Math.max(bel?9:12,Math.round(Lfl/UPC*(bel?.44:DET>=1.5?.8:.7))),nO=Math.round(nT*(op<.2?.04:Math.min(.8,.1+.72*op)));delphRaceme(A,parts,L-Lfl,nT,nO,Dm,cw,bel,cache,pc);
  /* belladonna: one or two side racemes from the upper stem, rising at an angle and curving up */
  if(bel)for(let j=0;j<(rnd()<.5?1:2);j++){const sb=A.sOf(L-Lfl*R(1.02,1.18)),f0=A.at(sb),az=(j?150:-30+R(-20,20))*D+R(-.3,.3),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),Ll=Lfl*R(.42,.58),
      d1=V3.nz(V3.add(V3.sc(f0.T,.72),V3.sc(r,.7))),d2=V3.nz(V3.add(V3.sc(f0.T,.95),V3.sc(r,.3))),p0=f0.p,C=[p0,V3.add(p0,V3.sc(d1,Ll*.35)),V3.add(V3.add(p0,V3.sc(d1,Ll*.55)),V3.sc(d2,Ll*.2)),V3.add(V3.add(p0,V3.sc(d1,Ll*.6)),V3.sc(d2,Ll*.45))],
      As=spAxis(o,Ll,{C,Fr:f0.Fr}),ns=Math.max(5,Math.round(As.L/UPC*.42)),no=Math.round(ns*(.1+.65*op));
    spStem(As,parts,[0,.4,1],3.2,1.2,SC);delphRaceme(As,parts,As.L*.3,ns,no,Dm,cw,bel,cache,pc,.88)}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:bel?5:7.5,bc:SC}}
Object.assign(GH,{'delphinium':delphSpike});CWS['delphinium']=CW_DELPH;SZG['delphinium']=[40,45,50,50,55,60];
GHI['delphinium']={form:'epi',size:1,k:'plant',self:70*UPC,tip:.9,fx:6*UPC};
/* ---------- shared pieces for the other spikes ---------- */
/* one ring of a double flower as a single outline in the floret's plane: n lobes (petals) of depth dp, ruffled (rf), cupped toward the face (cup), raised by z0, turned by rot; pt < 1 rounds the lobes, > 1 points them */
function spRing(B,O,Rr,o){const n=o.n||5,dp=o.dp??.3,rf=o.rf||0,cup=o.cup||0,z0=o.z0||0,rot=o.rot||0,pt=o.pt??.7,M=n*(DET>=1.5?14:9),pts=[];
  for(let i=0;i<M;i++){const th=i/M*6.283,lb=Math.pow(Math.abs(Math.cos(th*n/2)),pt),r=Rr*(1-dp+dp*lb)*(1+rf*(Math.sin(th*n*2.5+rot*7)*.6+Math.sin(th*n*4.3+rot*3)*.4)),p=PJ(B,O,[Math.cos(th+rot)*r,Math.sin(th+rot)*r,z0+cup*r*r/Rr]);pts.push([p[0],p[1]])}
  return pts}
/* a ring drawn: toned by the floret's facing (front or back colour), edged a shade darker */
function spRingDraw(k,pts,B,c,cb,dI,cache,o={}){const nz=B[2][2],back=nz<0,cc=back?cb:c,I=Math.max(o.lift||0,lightI(back?V3.sc(B[2],-1):B[2]))+(dI||0),key=cc+Math.round(I*14);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.d2]}
  const lite=h2l(cc)[2]>.82,d=smooth(pts);E('path',{d,fill:tone[0],stroke:o.ink||(lite?shd(cc,-.5):tone[1]),'stroke-width':o.sw||.4,'stroke-opacity':o.eo??(lite?.7:.6),'stroke-linejoin':'round'},k);return d}
/* a lanceolate leaf drawn flat on the screen (snapdragon, stock, gladiolus): arched, folded on its midrib (the far half darker), foreshortened by its tilt, its margin wavy if asked */
function lanceFlat(par,x,y,ang,len,w,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.cos(o.tilt??R(.15,.6)),bend=(o.bend??R(-.14,.14))*len,n=12,Lp=[],Rg=[],M=[],
    pf=o.pf||(t=>Math.pow(Math.sin(Math.PI*Math.min(.999,.02+t*.98)),.75)*(1-.35*t*t));
  for(let i=0;i<=n;i++){const t=i/n,cx=t*len,cy=bend*t*t,hw=len*w*.5*pf(t),wv=o.wav?Math.sin(t*o.wav*6.283)*hw*.18:0;M.push([cx,cy]);Lp.push([cx,cy-(hw+wv)*ct]);Rg.push([cx,cy+(hw-wv)*ct])}
  const tone=toneAt(P,o.I??.6);E('path',{d:smooth(Lp.concat(Rg.slice().reverse())),fill:tone,stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);
  if(!LOD){E('path',{d:smooth(M.concat(Rg.slice().reverse())),fill:P.d1,opacity:o.fold??.4},g);E('path',{d:smooth(M.slice(0,n),false),stroke:o.mid||P.l1,'stroke-width':f(Math.max(.4,len*w*.04)),'stroke-opacity':.55,fill:'none'},g)}
  return g}
/* finely cut leaves (larkspur): a rachis and its thread-like segments, forked; two strokes */
function fineLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col);let d=`M0,0Q${f(len*.5)},${f(len*.04)} ${f(len)},0`;
  for(let i=1;i<=5;i++){const t=i/6,bx=len*t,ll=len*(.42-.05*i);for(const s of[-1,1]){const a=s*(.75+R(-.15,.15)),ex=bx+Math.cos(a)*ll,ey=Math.sin(a)*ll;d+=`M${f(bx)},0Q${f(bx+Math.cos(a*.6)*ll*.5)},${f(Math.sin(a*.6)*ll*.5)} ${f(ex)},${f(ey)}`;
    const fx=bx+Math.cos(a)*ll*.55,fy=Math.sin(a)*ll*.55,a2=a+s*.5;d+=`M${f(fx)},${f(fy)}l${f(Math.cos(a2)*ll*.4)},${f(Math.sin(a2)*ll*.4)}`}}
  E('path',{d,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.022)),fill:'none','stroke-linecap':'round'},g);if(!LOD)E('path',{d,stroke:P.l1,'stroke-width':f(Math.max(.3,len*.008)),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},g);return g}
/* leaves along the bare stem of a spike: n of them between the fractions a and b of the bare length, alternating sides, rising at about up degrees */
function spLeaves(A,parts,lb,n,a,b,up,draw,lmin=0){for(let j=0;j<n;j++){const l=lb*(a+(b-a)*(n===1?.5:j/(n-1)))*R(.94,1.04);if(l<lmin)continue;const s=A.sOf(l),p=A.cb(s),T=A.at(s).T,sd=j%2?1:-1,ang=Math.atan2(-T[1],T[0])+sd*up*R(.8,1.2)*D;
  parts.push({z:A.zk?A.zk(s,p[2]+(j%2?.6:-.6)):p[2],fn:par=>draw(par,p[0],-p[1],ang,j,sd)})}}
/* a slim bud (snapdragon, stock, gladiolus): an ovoid of length s and width w along local Z, lit from the upper left, a seam; a calyx or bracts drawn by the caller */
function spBud(par,B,O,s,w,col,o={}){const pts=[];for(let i=0;i<=9;i++)for(let j=0;j<10;j++){const v=i/9,a=j/10*6.283,r=w*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),o.pw??.7)*(1-(o.tp??.35)*v),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,v*s]);pts.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(pts)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.6},par)}
/* ---------- larkspur (Consolida ajacis): a slender, looser raceme of double florets with a long slender spur, finely cut leaves ---------- */
const CW_LARK=[
 {id:'bleu-fonce',n:'Bleu foncé',c:'#34409f'},{id:'bleu',n:'Bleu moyen',c:'#5a74cc'},{id:'bleu-clair',n:'Bleu clair',c:'#97b6ea'},{id:'lavande',n:'Lavande bleutée',c:'#9b8dd2'},
 {id:'lilas',n:'Lilas',c:'#c5a8da'},{id:'violet',n:'Violet',c:'#6f45a8'},{id:'rose-clair',n:'Rose clair',c:'#f5c6d4'},{id:'rose',n:'Rose',c:'#ee9fbc'},
 {id:'saumon',n:'Rose saumon',c:'#f2a59a'},{id:'carmin',n:'Carmin',c:'#c62a5c'},{id:'blanc',n:'Blanc',c:'#f6f4ee'},{id:'givre',n:'Blanc givré de bleu (Frosted Skies)',c:'#f2f3f8',edge:'#7f9ae0'}];
function larkFloret(par,B,O,Dm,cw,o={}){const Rr=Dm/2,k=G(par),nz=B[2][2],cache=o.cache||{},cb=mix(cw.c,'#c8d0b0',.22),det=DET>=1.5;
  const sp=tubeFlat(B,O,[[0,Rr*.18,-Rr*.05],[0,Rr*.3,-Rr*.45],[0,Rr*.5,-Rr*.85],[0,Rr*.78,-Rr*1.12]],Rr*.1,Rr*.02,toneAt(pal7(mix(cw.c,cb,.5)),.5),{ink:shd(cw.c,-.45),eo:.45});
  if(nz>0)sp.fn(k);
  const r1=spRing(B,O,Rr,{n:5,dp:.34,rf:.04,cup:.1,rot:R(-.2,.2)+1.571,pt:.85}),r2=spRing(B,O,Rr*.7,{n:6,dp:.34,rf:.05,cup:.22,z0:Rr*.08,rot:R(-.2,.2)+2.2,pt:.85}),r3=spRing(B,O,Rr*.38,{n:4,dp:.3,rf:.06,cup:.35,z0:Rr*.16,rot:R(0,3),pt:.9});
  const d1=spRingDraw(k,r1,B,cw.c,cb,0,cache,{lift:.3});if(!LOD&&Math.abs(nz)>.2)E('path',{d:d1,fill:floretShade(),opacity:.8},k);
  if(cw.edge&&nz>.1&&!LOD)E('path',{d:d1,fill:'none',stroke:cw.edge,'stroke-width':f(Math.max(.8,Rr*.12)),'stroke-opacity':.75},k);
  if(nz>-.2){spRingDraw(k,r2,B,cw.c,cb,-.05,cache,{lift:.3});if(cw.edge&&!LOD)E('path',{d:smooth(r2),fill:'none',stroke:cw.edge,'stroke-width':f(Math.max(.6,Rr*.08)),'stroke-opacity':.6},k);
    if(det||Rr>6)spRingDraw(k,r3,B,cw.edge?cw.c:shd(cw.c,.1),cb,0,cache,{lift:.34})}
  if(nz<=0)sp.fn(k);return k}
function larkRaceme(A,parts,l0,nT,nO,Dm,cw,cache,pc,sz0=1){const Lr=A.L-l0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.02+.96*Math.pow(q,.85)),s=A.sOf(l),az=(i*137.5+R(-18,18))*D;
    if(i<nO){const sz=(1-.25*q)*sz0,pl=spAt(A,s,az,Dm*sz*(.55+.25*(1-q)),.45+R(-.1,.1),Dm*.25),B=spFrame(pl.ax,pl.T,R(-.2,.2));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.55,Dm*.04),pc);larkFloret(par,B,pl.pos,Dm*sz,cw,{cache})}})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Dm*(.42-.28*qb)*sz0,pl=spAt(A,s,az,Dm*.3*(1-.6*qb),.9+.3*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#a8bc80',.1+.4*Math.round(qb*4)/4);
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.5,Dm*.035),pc);delphBud(par,B,pl.pos,sb,bc,qb<.6)}})}}}
function larkSpike(g,t,o){const cw=cwPick(CW_LARK,o),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],cache={};
  const Lf0=(o.cm||40)*UPC,Lt=o.spine?blen(o.spine):Lf0*1.5,A=spAxis(o,Lt,{face:R(-.8,.8)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.8:.6:.66)),s0=A.sOf(L-Lfl),Dm=3.4*UPC*R(.94,1.06),
    SC=['#2a4420','#4a7034','#76a050','#b0cc84'],pc=mix(SC[1],cw.c,.25);
  spStem(A,parts,[0,s0*.5,s0],4.2,3.2,SC,s0);spStem(A,parts,[s0,s0+(1-s0)*.4,1],2.6,.9,SC,1,s0);
  spLeaves(A,parts,L-Lfl,4,.25,.95,40,(par,x,y,ang,j)=>fineLeaf(par,x,y,ang,Dm*(2.4-.35*j)*R(.9,1.1),'#4a7a38'),o.spine?(10)*UPC:0);
  const nT=Math.max(9,Math.round(Lfl/UPC*.5)),nO=Math.round(nT*(op<.2?.05:Math.min(.78,.1+.68*op)));larkRaceme(A,parts,L-Lfl,nT,nO,Dm,cw,cache,pc);
  /* a side spike from the upper stem now and then */
  if(o.spine?rnd()<.55:true){const sb=A.sOf(L-Lfl*R(1.02,1.12)),f0=A.at(sb),az=(rnd()<.5?-1:1)*R(40,110)*D,r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),Ll=Lfl*R(.38,.52),
      d1=V3.nz(V3.add(V3.sc(f0.T,.78),V3.sc(r,.62))),d2=V3.nz(V3.add(V3.sc(f0.T,.96),V3.sc(r,.25))),p0=f0.p,C=[p0,V3.add(p0,V3.sc(d1,Ll*.35)),V3.add(V3.add(p0,V3.sc(d1,Ll*.55)),V3.sc(d2,Ll*.2)),V3.add(V3.add(p0,V3.sc(d1,Ll*.6)),V3.sc(d2,Ll*.45))],
      As=spAxis(o,Ll,{C,Fr:f0.Fr}),ns=Math.max(5,Math.round(As.L/UPC*.45)),no=Math.round(ns*(.1+.6*op));
    spStem(As,parts,[0,.4,1],2.2,.8,SC);larkRaceme(As,parts,As.L*.28,ns,no,Dm,cw,cache,pc,.85)}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.2,bc:SC}}
Object.assign(GH,{'pied-alouette-annuel':larkSpike});CWS['pied-alouette-annuel']=CW_LARK;SZG['pied-alouette-annuel']=[35,40,40,45,50];GHI['pied-alouette-annuel']={form:'epi',size:1,k:'plant',self:60*UPC,tip:.85,fx:4*UPC};
/* ---------- snapdragon (Antirrhinum majus): a dense spike of two-lipped florets, the mouth closed by the palate, tight pointed buds to the tip ---------- */
const CW_SNAP=[
 {id:'blanc',n:'Blanc',c:'#f7f4e8',pal:'#f3e3a0'},{id:'ivoire',n:'Ivoire',c:'#f3ead0',pal:'#f0d070'},{id:'citron',n:'Jaune citron',c:'#f2e48c',pal:'#f2c840'},
 {id:'jaune',n:'Jaune d’or',c:'#f6cf38',pal:'#f2a820'},{id:'peche',n:'Pêche',c:'#f4b49a',pal:'#f6d070',lo:'#f6c6a6'},{id:'abricot',n:'Abricot',c:'#f4a46c',pal:'#f6c050'},
 {id:'corail',n:'Corail',c:'#ee8a6a',pal:'#f4b048'},{id:'orange',n:'Orange',c:'#ee7a3a',pal:'#f4a020'},{id:'bronze',n:'Bronze',c:'#c8804a',pal:'#f0b840',lo:'#d89a5a'},
 {id:'pommier',n:'Rose pommier (bicolore)',c:'#f2a2b8',lo:'#faf0ee',pal:'#f6e4a8'},{id:'rose-clair',n:'Rose clair',c:'#f6bfd0',pal:'#f6e0a0'},{id:'rose',n:'Rose',c:'#ea78a4',pal:'#f2d060'},
 {id:'cerise',n:'Cerise',c:'#d43a72',pal:'#f2c050'},{id:'rouge',n:'Rouge',c:'#c41f34',pal:'#f0b838'},{id:'bordeaux',n:'Bordeaux',c:'#7a1a32',pal:'#d89a40'},
 {id:'lavande',n:'Lavande',c:'#bba8da',pal:'#f2ead0'},{id:'pourpre',n:'Pourpre',c:'#8a3a8c',pal:'#f2d070'}];
const SN_UP=prof([[0,.55],[.4,1],[.8,.92],[1,.5]]),SN_LO=prof([[0,.5],[.35,.9],[.7,1],[1,.62]]),SN_CAL=prof([[0,1],[.6,.7],[1,.1]]);
/* one floret in its frame (local Z where its mouth points, Y up the spike): the green calyx, the tube swelling into a pouch below, the two-lobed upper lip turned up, the three-lobed lower lip spread down, the palate closing the throat */
function snapFloret(par,B,O,Lf,cw,o={}){const k=G(par),cache=o.cache||{},det=DET>=1.5,c=cw.c,cl=cw.lo||c,cp=cw.pal,it=[],nz=B[2][2];
  const cal=[];if(det||nz<.55)for(let j=0;j<5;j++)cal.push(ligule(B,O,{phi:(j*72+18)*D,r0:Lf*.05,z0:-Lf*.02,L:Lf*.2,W:Lf*.045,wp:SN_CAL,a0:.35,a1:.55,tip:'point',n:3}));
  if(cal.length)it.push({z:Math.min(...cal.map(l=>l.z)),fn:kk=>E('path',{d:cal.map(l=>smooth(l.out)).join(''),fill:'#5f8a40',stroke:'#2f4a20','stroke-width':.35,'stroke-opacity':.5},kk)});
  const tp=[],nr=det?7:5,na=det?12:9;for(let i=0;i<=nr;i++){const v=i/nr,z=Lf*(.02+.55*v),rx=Lf*(.07+.085*Math.pow(Math.sin(Math.PI*Math.min(1,.15+v*.85)),.7)),cy=-Lf*.05*Math.sin(Math.PI*v);
    for(let j=0;j<na;j++){const a=j/na*6.283,p=PJ(B,O,[Math.cos(a)*rx,cy+Math.sin(a)*rx*(Math.sin(a)<0?1.18:1),z]);tp.push([p[0],p[1]])}}
  it.push({z:PJ(B,O,[0,0,Lf*.3])[2],fn:kk=>E('path',{d:smooth(hull2(tp)),fill:budFill(mix(c,cl,.3)),stroke:shd(c,-.45),'stroke-width':.36,'stroke-opacity':.5},kk)});
  for(const s of[-1,1])it.push({l:ligule(B,O,{phi:(90+s*30)*D,r0:Lf*.1,z0:Lf*.55,L:Lf*.4,W:Lf*.2,wp:SN_UP,a0:.25,a1:1.75,pw:1.1,th:-.35,tip:'round',n:det?6:4,tw:s*.3}),c,ink:shd(c,-.4),lift:.28});
  for(const j of[-1,0,1])it.push({l:ligule(B,O,{phi:(270+j*44)*D,r0:Lf*.1,z0:Lf*.52,L:Lf*(j?.36:.32),W:Lf*(j?.18:.16),wp:SN_LO,a0:.55,a1:1.85,pw:1.1,th:-.2,tip:'round',n:det?6:4,tw:j*.3}),c:cl,ink:shd(cl,-.4),lift:.28});
  const pp=[],pn=det?6:4,pa=det?10:8;for(let i=0;i<=pn;i++)for(let j=0;j<pa;j++){const u=i/pn*Math.PI,a=j/pa*6.283,p=PJ(B,O,[Math.sin(u)*Math.cos(a)*Lf*.13,-Lf*.03+Math.sin(u)*Math.sin(a)*Lf*.085,Lf*.56+Math.cos(u)*Lf*.09]);pp.push([p[0],p[1]])}
  it.push({z:PJ(B,O,[0,-Lf*.02,Lf*.62])[2],fn:kk=>E('path',{d:smooth(hull2(pp)),fill:budFill(cp),stroke:shd(cp,-.4),'stroke-width':.3,'stroke-opacity':.5},kk)});
  spPetals(k,it,cache);return k}
function snapSpike(g,t,o){const cw=cwPick(CW_SNAP,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={};
  const Lf0=(o.cm||30)*UPC,Lt=o.spine?blen(o.spine):Lf0*1.7,A=spAxis(o,Lt,{face:R(-.8,.8)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.75:.5:.6)),s0=A.sOf(L-Lfl),Lfr=4.5*UPC*R(.94,1.06),
    SC=['#2a4620','#4a7434','#78a452','#b0cf88'],gb='#7fa45a';
  spStem(A,parts,[0,s0*.5,s0],5,4,SC,s0);spStem(A,parts,[s0,s0+(1-s0)*.45,1],3.6,1.2,SC,1,s0);
  spLeaves(A,parts,L-Lfl,6,.22,1.02,32,(par,x,y,ang,j)=>lanceFlat(par,x,y,ang,Lfr*(1.55-.08*j)*R(.9,1.1),.2,'#4f7f38',{tilt:R(.2,.6),bend:R(-.2,.2)}),o.spine?(10)*UPC:0);
  const nT=Math.max(12,Math.round(Lfl/UPC*.95)),nO=Math.round(nT*(op<.2?0:Math.min(.66,.08+.62*op)));
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=L-Lfl+Lfl*(.02+.97*Math.pow(q,.8)),s=A.sOf(l),az=(i*137.5+R(-12,12))*D;
    if(i<nO){const sz=1-.18*q,pl=spAt(A,s,az,Lfr*.1,.42+R(-.1,.1),0),B=spFrame(pl.ax,pl.T,R(-.12,.12));parts.push({z:A.zk(s,pl.pos[2]+Lfr*.25*pl.ax[2]),fn:par=>snapFloret(par,B,pl.pos,Lfr*sz,cw,{cache})})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Lfr*(.5-.3*qb),pl=spAt(A,s,az,Lfr*.06,.95+.35*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,gb,.2+.6*Math.round(qb*4)/4);
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,1.2,SC[1]);spBud(par,B,pl.pos,sb,sb*.42,bc,{tp:.45,pw:.6});if(sb>4)spBud(par,B,V3.add(pl.pos,V3.sc(pl.ax,-sb*.04)),sb*.3,sb*.36,'#5f8a40',{tp:-.2,pw:.5})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:5,bc:SC}}
/* ---------- stock (Matthiola incana): a fat column of double, ruffled, scented florets on short pedicels, grey-green felted leaves and stem ---------- */
const CW_STOCK=[
 {id:'blanc',n:'Blanc',c:'#f7f5ee'},{id:'creme',n:'Crème',c:'#f4ebd2'},{id:'jaune',n:'Jaune pâle',c:'#f4e4a2'},{id:'abricot',n:'Abricot',c:'#f3c19c'},{id:'cuivre',n:'Cuivre ancien',c:'#d99a78'},
 {id:'rose-poudre',n:'Rose poudré',c:'#f7d2da'},{id:'rose',n:'Rose',c:'#f0aac4'},{id:'rose-mauve',n:'Rose mauve',c:'#e3a0c4'},{id:'cerise',n:'Cerise',c:'#d43c74'},{id:'cramoisi',n:'Cramoisi',c:'#a81e46'},
 {id:'lilas',n:'Lilas',c:'#c9aedb'},{id:'lavande',n:'Lavande',c:'#a596d0'},{id:'mauve',n:'Mauve',c:'#b46aa8'},{id:'pourpre',n:'Pourpre',c:'#7c2c7e'},{id:'prune',n:'Prune',c:'#5a1a4a'}];
function stockFloret(par,B,O,Dm,cw,o={}){const Rr=Dm/2,k=G(par),nz=B[2][2],cache=o.cache||{},det=DET>=1.5,c=cw.c,cb=mix(c,'#c4c8b0',.28),rot=R(0,6.28);
  if(nz<.5){const cal=[];for(let j=0;j<4;j++)cal.push(ligule(B,O,{phi:(j*90+45)*D+rot,r0:Rr*.08,z0:-Rr*.06,L:Rr*.5,W:Rr*.12,wp:prof([[0,.8],[.6,1],[1,.3]]),a0:2.55,a1:2.8,tip:'round',n:3}));
    E('path',{d:cal.map(l=>smooth(l.out)).join(''),fill:'#8c9c82',stroke:'#4a5a40','stroke-width':.35,'stroke-opacity':.5},k)}
  if(Math.abs(nz)<.32){const R1=spRing(B,O,Rr,{n:5,dp:.12,rf:.05,cup:.08,rot,pt:.55}),R2=spRing(B,O,Rr*.74,{n:5,dp:.2,rf:.08,cup:.22,z0:Rr*.12,rot:rot+.63,pt:.55}),R3=spRing(B,O,Rr*.48,{n:4,dp:.24,rf:.1,cup:.4,z0:Rr*.24,rot,pt:.6});
    const dh=spRingDraw(k,hull2(R1.concat(R2,R3)),B,c,cb,-.04,cache,{lift:.34});if(!LOD){E('path',{d:dh,fill:floretShade(),opacity:.6},k);E('path',{d:smooth(R2)+smooth(R3),fill:'none',stroke:shd(c,-.3),'stroke-width':.4,'stroke-opacity':.55},k)}return k}
  const eg=1,r1=spRing(B,O,Rr,{n:5,dp:.2*eg+.05,rf:.1*eg,cup:.08,rot,pt:.55}),d1=spRingDraw(k,r1,B,c,cb,0,cache,{lift:.32});if(!LOD&&Math.abs(nz)>.15)E('path',{d:d1,fill:floretShade(),opacity:.75},k);
  if(nz>-.25){spRingDraw(k,spRing(B,O,Rr*.74,{n:5,dp:.24*eg+.05,rf:.12*eg,cup:.22,z0:Rr*.12,rot:rot+.63,pt:.55}),B,c,cb,-.05,cache,{lift:.3});
    spRingDraw(k,spRing(B,O,Rr*.48,{n:4,dp:.28*eg+.05,rf:.14*eg,cup:.4,z0:Rr*.24,rot:rot+.3,pt:.6}),B,c,cb,-.1,cache,{lift:.28});
    if(det)spRingDraw(k,spRing(B,O,Rr*.22,{n:3,dp:.3,rf:.15,cup:.5,z0:Rr*.33,rot,pt:.7}),B,c,cb,-.16,cache,{lift:.25})}
  return k}
function stockSpike(g,t,o){const cw=cwPick(CW_STOCK,o),op=Math.max(.05,Math.min(1,o.op??R(.72,1))),k=G(g),parts=[],cache={};
  const Lf0=(o.cm||22)*UPC,Lt=o.spine?blen(o.spine):Lf0*2,A=spAxis(o,Lt,{face:R(-.8,.8)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.7:.46:.52)),s0=A.sOf(L-Lfl),Dm=4.1*UPC*R(.94,1.06),
    SC=['#34442e','#5a6c50','#879a78','#b6c4a6'];
  spStem(A,parts,[0,s0*.5,s0],7,5.6,SC,s0);spStem(A,parts,[s0,s0+(1-s0)*.5,1],4.4,2,SC,1,s0);
  spLeaves(A,parts,L-Lfl,7,.2,1.02,30,(par,x,y,ang,j)=>lanceFlat(par,x,y,ang,Dm*(2.9-.15*j)*R(.9,1.1),.24,'#7d8e70',{tilt:R(.15,.5),bend:R(-.25,.1),wav:2,fold:.3,mid:'#c4cfb6',I:.66}),o.spine?(10)*UPC:0);
  /* open florets up the column, then a tight crown of buds */
  const nO=op<.2?0:Math.max(4,Math.round(Lfl/UPC*.95*(.2+.75*op))),nB=Math.max(7,Math.round(Lfl/UPC*.42)),fo=op<.2?0:.62+.22*op;
  for(let i=0;i<nO;i++){const q=i/Math.max(1,nO-1),l=L-Lfl+Lfl*fo*(.02+.98*Math.pow(q,.9)),s=A.sOf(l),az=(i*137.5+R(-14,14))*D,sz=1-.16*q,pl=spAt(A,s,az,Dm*sz*(.3+.1*(1-q)),.3+R(-.08,.08),Dm*.06),B=spFrame(pl.ax,pl.T,R(-.3,.3));
    parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.7,Dm*.05),SC[1]);stockFloret(par,B,pl.pos,Dm*sz,cw,{cache})}})}
  for(let i=0;i<nB;i++){const qb=i/Math.max(1,nB-1),l=L-Lfl+Lfl*(fo+(1-fo)*(.04+.95*Math.pow(qb,.8))),s=A.sOf(l),az=((nO+i)*137.5+R(-14,14))*D,sb=Dm*(.4-.24*qb),pl=spAt(A,s,az,Dm*.14*(1-.6*qb),1.0+.4*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#93a284',.2+.6*Math.round(qb*4)/4);
    parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,1.2,SC[1]);spBud(par,B,V3.add(pl.pos,V3.sc(pl.ax,-sb*.08)),sb,sb*.74,bc,{tp:.25,pw:.8})}})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:7,bc:SC}}
/* ---------- gladiolus: a one-sided spike, large funnel florets facing the front out of green spathes, alternately left and right, buds sheathed to a point ---------- */
const CW_GLAD=[
 {id:'blanc',n:'Blanc (White Prosperity)',c:'#f7f5ee',th:'#efe6c4'},{id:'creme',n:'Crème',c:'#f3e9cc',th:'#ecd49a'},{id:'jaune',n:'Jaune (Nova Lux)',c:'#f5d548',th:'#efb428'},
 {id:'vert',n:'Vert (Green Star)',c:'#d8e39c',th:'#c2d470'},{id:'peche',n:'Pêche',c:'#f6c3ad',th:'#f2a48a'},{id:'saumon',n:'Saumon (Peter Pears)',c:'#f3a07c',bl:'#d84a2c'},
 {id:'orange',n:'Orange',c:'#ef7c32',bl:'#d85a1e'},{id:'corail',n:'Corail',c:'#ef8c82',bl:'#e0606a'},{id:'rose-clair',n:'Rose clair',c:'#f6c6d2',th:'#f8e6c8'},
 {id:'rose',n:'Rose (Rose Supreme)',c:'#ee90b2',th:'#f6e2c4'},{id:'fuchsia',n:'Fuchsia',c:'#d63a86',bl:'#f4e6ee'},{id:'rouge',n:'Rouge (Jessica)',c:'#cc2228',th:'#a81420'},
 {id:'traderhorn',n:'Rouge flammé de blanc (Traderhorn)',c:'#c41f32',bl:'#f6eeea'},{id:'bordeaux',n:'Bordeaux velours (Black Star)',c:'#6a0f24',th:'#4a0818'},
 {id:'prune',n:'Prune (Plum Tart)',c:'#9a2a6c',bl:'#e6c8dc'},{id:'pourpre',n:'Pourpre',c:'#7a2c7a',bl:'#f0e0ee'},{id:'lavande',n:'Lavande',c:'#b9a2d8',bl:'#8a5ab0'},
 {id:'priscilla',n:'Blanc liseré de rose (Priscilla)',c:'#fbf3f2',edge:'#e4588a',th:'#f2dc60'},{id:'princesse',n:'Jaune liseré de rouge',c:'#f6d250',edge:'#e0402a',th:'#f0b030'}];
const GL_DOR=prof([[0,.35],[.3,.85],[.6,1],[.85,.82],[1,.3]]),GL_LOW=prof([[0,.3],[.35,.8],[.65,1],[.9,.7],[1,.25]]);
/* one floret in its frame (local Z its face, Y up the spike): the green tube back into its spathes, six ruffled tepals (the dorsal one hooded), the throat flushed or blotched, three stamens under the hood */
function gladFloret(par,B,O,Dm,cw,o={}){const Rr=Dm/2,k=G(par),nz=B[2][2],cache=o.cache||{},det=DET>=1.5,c=cw.c,cb=mix(c,'#e8e6d8',.2),it=[],tps=[],rf=cw.ruf??.16;
  it.push(tubeFlat(B,O,[[0,0,-Rr*.02],[0,-Rr*.1,-Rr*.28],[0,-Rr*.28,-Rr*.5]],Rr*.15,Rr*.07,toneAt(pal7(mix(c,'#8aa860',.35)),.55),{ink:'#3a5a28'}));
  const T6=[[90,1,.44,.5,1.18,GL_DOR],[90-58,.95,.42,.62,1.35,GL_DOR],[90+58,.95,.42,.62,1.35,GL_DOR],[270-55,.88,.36,.72,1.5,GL_LOW],[270+55,.88,.36,.72,1.5,GL_LOW],[270,.84,.32,.78,1.58,GL_LOW]];
  T6.forEach(([ph,Lk,Wk,a0,a1,wp],j)=>{const low=j>=3,l=ligule(B,O,{phi:(ph+R(-4,4))*D,r0:Rr*.1,z0:0,L:Rr*Lk*R(.95,1.04),W:Rr*Wk,wp,a0:a0+R(-.05,.05),a1:a1+R(-.06,.06),pw:1.2,th:.55,tip:'round',wav:rf,wk:4.5,n:det?8:6,tw:R(-.25,.25)});tps.push(l);
    it.push({l,c,cb,ink:shd(c,-.38),lift:.3,basec:low&&cw.bl?cw.bl:null,bf:.52,bo:.88,edgec:cw.edge,ew:Math.max(.7,Rr*.07)})});
  spPetals(k,it,cache);if(LOD)return k;if(Math.abs(nz)>.2)spVeil(k,tps,.7);if(cw.th&&nz>.1)E('path',{d:smooth(spDisc(B,O,Rr*.55,Rr*.06)),fill:flushFill(cw.th,.85)},k);
  if(nz>.1){const st=[];for(const s of[-1,0,1])st.push([[s*Rr*.05,Rr*.02,Rr*.05],[s*Rr*.12,Rr*.12,Rr*.4],[s*Rr*.14,Rr*.3,Rr*.62]].map(p=>PJ(B,O,p)));
    E('path',{d:st.map(q=>smooth(q.map(p=>[p[0],p[1]]),false)).join(''),stroke:mix(c,'#f4f0e4',.5),'stroke-width':f(Math.max(.4,Rr*.035)),fill:'none','stroke-linecap':'round'},k);
    let an='';for(const q of st){const e=q[2],b=q[1],dx=e[0]-b[0],dy=e[1]-b[1],l=Math.hypot(dx,dy)||1,al=Rr*.13;an+=`M${f(e[0]-dx/l*al*.3)},${f(e[1]-dy/l*al*.3)}l${f(dx/l*al)},${f(dy/l*al)}`}
    E('path',{d:an,stroke:cw.anth||mix(c,'#8a7a9a',.3),'stroke-width':f(Math.max(.5,Rr*.038)),'stroke-linecap':'round',fill:'none','stroke-opacity':.9},k)}
  return k}
/* the two spathes at a node, clasping the base of a floret or a bud: pointed, green, rolled round it */
function gladBracts(par,A,s,r,Lb,o={}){const f0=A.at(s),Bn=spFrame(V3.nz(V3.add(r,V3.sc(f0.T,.15))),f0.T,0),it=[];
  for(const[ph,Lk,dz]of[[78,.82,-.2],[96,1,.25]])it.push({l:ligule(Bn,f0.p,{phi:ph*D,r0:Lb*.05,z0:Lb*dz*.1,L:Lb*Lk,W:Lb*.13,wp:prof([[0,.8],[.4,1],[.8,.6],[1,.05]]),a0:1.2,a1:1.42,pw:1.2,th:-1,tip:'point',n:5}),c:o.c||'#7a9c50',cb:'#9ab874',ink:'#3a5a28',lift:.25});
  spPetals(par,it,o.cache||{})}
function gladSpike(g,t,o){const cw=cwPick(CW_GLAD,o),op=Math.max(.05,Math.min(1,o.op??R(.68,1))),k=G(g),parts=[],cache={},sd0=o.spine?(o.spine[3][0]>4?1:o.spine[3][0]<-4?-1:0):0;
  const Lf0=(o.cm||50)*UPC,Lt=o.spine?blen(o.spine):Lf0*1.5,A=spAxis(o,Lt,{face:sd0?sd0*R(.15,.55):R(-.4,.4)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.75:.52:.68)),s0=A.sOf(L-Lfl),Dm=9.6*UPC*R(.94,1.06)*Math.max(.88,Math.min(1.1,Math.pow(Lf0/(50*UPC),.3))),
    SC=['#28461e','#467432','#74a24e','#accd84'],Lb=4.6*UPC;
  spStem(A,parts,[0,s0*.5,s0],7.4,6,SC,s0);spStem(A,parts,[s0,s0+(1-s0)*.45,1],5,1.6,SC,1,s0);
  spLeaves(A,parts,L-Lfl,o.spine?1:2,.12,.3,7,(par,x,y,ang,j)=>lanceFlat(par,x,y,ang,(L-Lfl)*R(.5,.7),.075,'#4a7a36',{tilt:R(.1,.3),bend:R(-.04,.04),pf:t=>Math.pow(Math.min(1,t*6),.5)*(1-Math.pow(t,3)),fold:.32}),o.spine?(12)*UPC:0);
  const nT=Math.max(10,Math.round(Lfl/UPC*.34)),nO=Math.round(nT*(op<.2?0:Math.min(.5,.06+.48*op)));
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=L-Lfl+Lfl*(.01+.98*Math.pow(q,.82)),s=A.sOf(l),side=i%2?1:-1,az=side*R(.42,.62);
    if(i<nO){const sz=1-.16*q,pl=spAt(A,s,az,Dm*sz*.24,.4+R(-.06,.06),Dm*.12),B=spFrame(pl.ax,pl.T,side*R(.05,.18)),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));
      parts.push({z:A.zk(s,pl.pos[2]-Dm*.05),fn:par=>{gladBracts(par,A,s,r,Lb*.9,{cache});gladFloret(par,B,pl.pos,Dm*sz,cw,{cache})}})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Lb*(1-.45*qb),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),ax=V3.nz(V3.add(V3.sc(r,.32),V3.sc(f0.T,.95))),B=spFrame(ax,f0.T,0),pos=V3.add(f0.p,V3.sc(r,Lb*.08)),bc=mix(cw.c,'#8aac5c',Math.min(1,.15+1.1*qb));
      parts.push({z:A.zk(s,f0.p[2]+V3.sc(r,Lb*.1)[2]),fn:par=>{if(qb<.55)spBud(par,B,pos,sb*.95,sb*.26,bc,{tp:.55,pw:.6});gladBracts(par,A,s,r,sb,{cache,c:'#78a050'})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:7.4,bc:SC}}
Object.assign(GH,{'muflier':snapSpike,'giroflee-matthiole':stockSpike,'glaieul':gladSpike});Object.assign(CWS,{'muflier':CW_SNAP,'giroflee-matthiole':CW_STOCK,'glaieul':CW_GLAD});
Object.assign(SZG,{'muflier':[25,28,30,32,35],'giroflee-matthiole':[18,20,22,24,26],'glaieul':[40,45,50,55,60]});
Object.assign(GHI,{'muflier':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.72,fx:4.5*UPC},'giroflee-matthiole':{form:'epi',size:1,k:'plant',self:45*UPC,tip:.85,fx:4*UPC},'glaieul':{form:'epi',size:1,k:'plant',self:80*UPC,tip:.75,fx:6.5*UPC}});
