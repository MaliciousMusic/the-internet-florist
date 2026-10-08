/* ================= Serre, reprise 5 — les épis poussent (L-système) : delphinium, pied-d'alouette, muflier, giroflée, glaïeul ================= */
/* l'axe ondule un peu, les feuilles sortent des nœuds de la tige (palmées, filiformes, lancéolées, feutrées, en épée), les épis latéraux plus jeunes sortent des aisselles hautes,
   l'âge descend l'épi : boutons verts serrés en haut, boutons colorés, fleurons qui s'ouvrent, fleurons ouverts, et en bas parfois un fleuron passé ; les fleurons du lot 8 restent tels quels */
/* ---------- a grown axis: a polyline in view space (y up) with the interface of spAxis (cb, at, sOf, L; s is the fraction of its length); fr(l) is the front it turns toward ---------- */
function axPoly(P0,fr){const P=[P0[0]];for(let i=1;i<P0.length;i++)if(V3l(V3s(P0[i],P[P.length-1]))>.4||i===P0.length-1)P.push(P0[i]);
  const n=P.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[n-1]||1;
  const loc=l=>{l=Math.max(0,Math.min(L,l));let a=0,b=n-1;while(b-a>1){const m=(a+b)>>1;if(cum[m]<=l)a=m;else b=m}return[a,Math.min(1,(l-cum[a])/((cum[a+1]-cum[a])||1))]},
    cb=s=>{const[i,t]=loc(s*L),p=P[i],q=P[Math.min(n-1,i+1)];return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t]},
    at=s=>{const d=Math.min(.3,5/L),p=cb(s),T=V3.nz(V3s(cb(Math.min(1,s+d)),cb(Math.max(0,s-d))));let Fr=fr(s*L);Fr=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));if(V3l(Fr)<1e-6)Fr=Math.abs(T[2])<.9?[0,0,1]:[1,0,0];Fr=V3.nz(Fr);return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  /* the points between the fractions a and b, with their fractions */
  const span=(a,b)=>{const[i0]=loc(a*L),[i1]=loc(b*L),q=[cb(a)],s=[a];for(let i=i0+1;i<=i1;i++){const u=cum[i]/L;if(u>a+.5/L&&u<b-.5/L){q.push(P[i]);s.push(u)}}q.push(cb(b));s.push(b);return{q,s}};
  return{P,cum,L,cb,at,span,sOf:l=>Math.max(0,Math.min(1,l/L))}}
/* ---------- the plant grown by the L-system in the straight frame of its axis (x its right, y up it, z its front), then laid along the axis A0
   (the composer's spine in a bouquet, the frame of the view on a sheet): the stem wanders a little round its path, leaves and side shoots come out of its nodes.
   The rules, for n nodes on the stem at the lengths l_i (S.nodes(L) gives them), then the raceme:
     A(i<n) → F(l_i − l_i−1) N(i) A(i+1)        A(n) → F(L − l_n−1)        each F grows in steps of seg, turning at random by wig and pulled back up its path by e
     N(i)   → [ /φ_i+180j &α_i Lv(i,j) ]×m  [ /φ_i &β_i F(ℓ/3,e') F(2ℓ/3,e') La(i) ]  +κ_i      m = 2 for an opposite pair; the side shoot (ℓ, β) leaves the axil of the leaf
                                                                                              and curves up (e'); κ: the stem's small turn at its node, away from its leaf
   It returns the main axis A (axPoly), the side shoots (their axes), the leaves (organs in view space, their node's fraction s on A) ---------- */
function spGrow(o,Lt,S){const A0=spAxis(o,Lt,{face:S.face}),L=A0.L,N=S.nodes(L);
  const rules={A:p=>{const i=p.i,lp=i?N[i-1].l:0;if(i>=N.length)return[['F',{l:Math.max(1,L-lp)}]];const nd=N[i],out=[['F',{l:Math.max(.5,nd.l-lp)}]];
    if(nd.leaf)for(let j=0;j<(nd.leaf.m||1);j++)out.push(['[',{}],['/',{a:nd.phi+j*180}],['&',{a:nd.leaf.a}],['Lv',{i,j}],[']',{}]);
    if(nd.lat){const t=nd.lat;out.push(['[',{w:t.w}],['/',{a:nd.phi+(t.dphi||0)}],['&',{a:t.a}],['F',{l:t.len*.3,e:t.e,w1:t.w*.85}],['F',{l:t.len*.7,e:t.e,w1:t.w*.55}],['La',{i}],[']',{}])}
    if(nd.kink)out.push(['+',{a:-nd.kink*Math.sin(nd.phi*D)}]);out.push(['A',{i:i+1}]);return out}};
  const res=lsTurtle(lsDerive([['A',{i:0}]],rules,N.length+2),{p:[0,0,0],H:[0,1,0],U:[0,0,1],wig:S.wig,seg:S.seg||8,T:[0,1,0],e:S.e,w:S.w||4}),c0=res.chains[0],kY=L/Math.max(1,c0.pts[c0.pts.length-1][1]);
  const fAt=y=>A0.at(A0.sOf(y*kY)),lay=q=>{const f=fAt(q[1]);return V3.add(V3.add(f.p,V3.sc(f.Sd,q[0])),V3.sc(f.Fr,q[2]))},
    dir=(v,y)=>{const f=fAt(y);return V3.nz(V3.add(V3.add(V3.sc(f.Sd,v[0]),V3.sc(f.T,v[1])),V3.sc(f.Fr,v[2])))},frAt=l=>A0.at(A0.sOf(l)).Fr;
  const A=axPoly(c0.pts.map(lay),frAt),lats=[],leaves=[];
  for(const og of res.organs){const nd=N[og.p.i];
    if(og.t==='La'){const ch=res.chains.find(c=>c!==c0&&V3l(V3s(c.pts[c.pts.length-1],og.pos))<1e-6);if(ch)lats.push({A:axPoly(ch.pts.map(lay),()=>frAt(nd.l)),nd,s:A.sOf(nd.l)})}
    else if(og.t==='Lv')leaves.push({i:og.p.i,j:og.p.j,nd,pos:lay(og.pos),H:dir(og.H,og.pos[1]),U:dir(og.U,og.pos[1]),s:A.sOf(nd.l)})}
  return{A,A0,L,lats,leaves}}
/* the stem and rachis of a grown axis as pieces in the painter's order (as spStem: each between the florets behind and in front of it), tapered ribbons along the polyline;
   each piece runs on 2.5 units into the next, so no gap shows where they meet */
function spStemP(A,parts,cuts,w0,w1,cols,s1=1,sa=0){const wt=s=>w0+(w1-w0)*Math.max(0,Math.min(1,(s-sa)/((s1-sa)||1)));
  for(let j=0;j<cuts.length-1;j++){const a=cuts[j],b=cuts[j+1];if(b-a<1e-3)continue;const{q,s}=A.span(a,Math.min(1,b+(b<1?2.5/A.L:0))),P=q.map(p=>[p[0],-p[1]]),W=s.map(wt);let z=0;for(const p of q)z+=p[2];z/=q.length;
    (A.segs=A.segs||[]).push([a,b,z-.01]);parts.push({z:z-.01,fn:par=>stemPoly(par,P,W,cols)})}
  A.zk=(s,z)=>{const sg=A.segs.find(q=>s>=q[0]-1e-6&&s<=q[1]+1e-6);return sg?sg[2]+.011+(z-A.cb(s)[2]):z}}
/* a leaf of a grown node drawn in 2D (as lsLeaf2D): its base on the axis, along the projection of its direction H, its length foreshortened,
   its blade showing as much of its face as its normal U turns to the eye (face 0 edge-on … 1 full; a blade twists a little toward the light, so never quite edge-on);
   droop: how its tip bends down under its weight, on whichever side it hangs */
function spLeafPart(A,lf,len,draw){const p=[lf.pos[0],-lf.pos[1]],h=[lf.H[0],-lf.H[1]],hl=Math.hypot(h[0],h[1]),fs=Math.max(.3,hl),ang=Math.atan2(h[1],h[0]),face=.35+.65*Math.abs(lf.U[2]),
    droop=(Math.cos(ang)>=0?1:-1)*Math.min(1,Math.abs(Math.cos(ang))*1.6);
  return{z:A.zk(lf.s,lf.pos[2]+lf.H[2]*len*.4),fn:par=>draw(par,p[0],p[1],ang,len*fs,face,droop,lf)}}
/* in a bouquet a leaf turns up toward the light: its direction never below the level ry (the callers also keep it clear above the mouth of the vessel) */
function spLeafUp(lf,ry=.12){const H=lf.H;if(H[1]>=ry)return;const hz=Math.hypot(H[0],H[2])||1,k=Math.sqrt(1-ry*ry)/hz;lf.H=[H[0]*k,ry,H[2]*k]}
/* a floret opening: inside fn every ligule closes toward its axis and every ring narrows (its rim kept near the floret's base, so it stays on its pedicel seen edge-on) — the same floret, less open (op 0 closed … 1 open) */
function spHalf(op,fn){if(op>=.98)return fn();const Lg=ligule,Rg=spRing,k=.38+.62*op;ligule=(B,O,o)=>Lg(B,O,Object.assign({},o,{a0:o.a0*k,a1:o.a1*k}));
  spRing=(B,O,Rr,o)=>Rg(B,O,Rr*(.6+.4*op),Object.assign({},o,{cup:(o.cup||0)+(1-op)*.12,dp:(o.dp??.3)*(.6+.4*op)}));try{return fn()}finally{ligule=Lg;spRing=Rg}}
/* the age of the n positions of a raceme, from the bottom: spent (fallen or faded), open, opening, coloured buds, green buds; fo the open fraction, nS the spent ones */
function spAges(n,fo,nS,nH=2){const nO=Math.round(n*fo),out=[];for(let i=0;i<n;i++){if(i<Math.min(nS,nO-1))out.push({k:'spent'});else if(i<nO-nH)out.push({k:'open'});else if(i<nO)out.push({k:'half',op:.3+.5*(nO-1-i)/Math.max(1,nH)});
  else{const qb=(i-nO)/Math.max(1,n-nO-1);out.push({k:'bud',qb})}}return out}
/* where the i-th of n florets sits along its raceme (0 … 1): the internodes shrink up the raceme, the top one k times the lowest, so the buds crowd at the tip */
const spQ=(i,n,k=.35)=>{if(n<2)return 0;const r=Math.pow(k,1/(n-1));return(1-Math.pow(r,i))/(1-Math.pow(r,n-1))};
/* ---------- the leaves of the spikes, drawn on the screen at (x,y) along ang, len long, showing face (0 edge-on … 1) of their blade ---------- */
/* an outline whose tips stay sharp: a tip point is doubled, so the smoothed curve turns there instead of rounding it */
const tipOut=P=>{const q=[];for(const p of P){q.push(p);if(p[2])q.push(p)}return q.map(p=>[p[0],p[1]])};
/* delphinium (Delphinium elatum): long-petioled, palmately divided almost to the base into n wedge-shaped segments, each widening and cut at its end into three pointed lobes,
   the middle one longest (the upper leaves smaller, in fewer and narrower segments); one outline round every segment, the far half darker, the main veins */
const DL_SEG=[[.04,-.1],[.3,-.46],[.52,-.8],[.66,-.92,1],[.7,-.76],[.86,-.66,1],[.76,-.3],[.9,-.16],[1,0,1],[.9,.16],[.76,.3],[.86,.66,1],[.7,.76],[.66,.92,1],[.52,.8],[.3,.46],[.04,.1]];
function delphLeaf(par,x,y,ang,len,col,o={}){const n=o.lobes||7,sp=(o.spread||200)*D,ct=Math.max(.22,o.face??.6),pl=len*(o.pet??.32),bl=len-pl,P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`});
  const out=[],half=[],vein=[],mid=(n-1)/2;
  for(let j=0;j<n;j++){const th=-sp/2+sp*j/(n-1)+R(-.05,.05),Lj=bl*(1-.38*Math.pow(Math.abs(j-mid)/mid,1.5))*R(.9,1.06),wj=Lj*(o.wl||.44),c=Math.cos(th),s=Math.sin(th),dc=R(-.06,.06),seg=[];
    for(const[u,v,t]of DL_SEG){const a=u*Lj*(t&&v?1+dc:1),b=v*wj;seg.push([pl+a*c-b*s,(a*s+b*c)*ct,t])}out.push(...seg);vein.push([pl+Lj*.9*c,Lj*.9*s*ct]);
    if(j>mid)half.push(seg);else if(j===mid)half.push(seg.slice(8).concat([[pl,0]]))}
  E('path',{d:`M0,0L${f(pl)},0`,stroke:P.d1,'stroke-width':f(Math.max(1.1,len*.024)),'stroke-linecap':'round'},g);
  E('path',{d:smooth(tipOut(out)),fill:toneAt(P,.5+.2*ct),stroke:P.ink,'stroke-width':.42,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:half.map(h=>smooth(tipOut(h))).join(''),fill:P.d1,opacity:.38},g);E('path',{d:vein.map(v=>`M${f(pl)},0L${f(v[0])},${f(v[1])}`).join(''),stroke:P.l1,'stroke-width':f(Math.max(.4,len*.01)),'stroke-opacity':.5,fill:'none'},g)}return g}
/* larkspur (Consolida ajacis): a short petiole, then three divisions fanned out, each forked again and again into thread-like segments; two strokes */
function filiLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.3,o.face??.7),pl=len*.18;let d=`M0,0L${f(pl)},0`;
  const fork=(x0,y0,a,l,k)=>{const ex=x0+Math.cos(a)*l,ey=y0+Math.sin(a)*l*ct,bw=R(-.18,.18);d+=`M${f(x0)},${f(y0)}Q${f(x0+Math.cos(a+bw)*l*.55)},${f(y0+Math.sin(a+bw)*l*.55*ct)} ${f(ex)},${f(ey)}`;
    if(k>0){const nb=k>1?3:2;for(let i=0;i<nb;i++){const t=.42+.5*i/nb,fx=x0+Math.cos(a)*l*t,fy=y0+Math.sin(a)*l*t*ct,s=i%2?1:-1;fork(fx,fy,a+s*R(.4,.7),l*(.62-.12*i)*R(.85,1.1),k-1)}}};
  for(const a of[-.62,0,.62])fork(pl,0,a+R(-.12,.12),(len-pl)*(a?.78:1),2);
  E('path',{d,stroke:P.d1,'stroke-width':f(Math.max(.72,len*.014)),fill:'none','stroke-linecap':'round'},g);if(!LOD)E('path',{d,stroke:P.l1,'stroke-width':f(Math.max(.28,len*.005)),'stroke-opacity':.45,fill:'none','stroke-linecap':'round'},g);return g}
/* stock (Matthiola incana): oblong-lanceolate to spathulate, widest above the middle, the tip blunt, the margin a little wavy; grey-green and felted with star hairs: a pale rim and a pale bloom over the blade */
function feltLeaf(par,x,y,ang,len,w,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.22,o.face??.6),bend=(o.bend??R(-.12,.12))*len,n=12,Lp=[],Rg=[],M=[];
  for(let i=0;i<=n;i++){const t=i/n,cx=t*len,cy=bend*t*t,hw=len*w*.5*Math.pow(Math.sin(Math.PI*Math.min(.999,.02+t*.98)),.5)*(.62+.7*t-.5*t*t),wv=Math.sin(t*12.6+R(0,.5))*hw*.07;
    M.push([cx,cy]);Lp.push([cx,cy-(hw+wv)*ct]);Rg.push([cx,cy+(hw-wv)*ct])}
  const outl=smooth(Lp.concat(Rg.slice().reverse()));E('path',{d:outl,fill:toneAt(P,.5+.22*ct),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.45},g);
  if(!LOD){E('path',{d:smooth(M.concat(Rg.slice().reverse())),fill:P.d1,opacity:.32},g);E('path',{d:outl,fill:'none',stroke:'#e4ebde','stroke-width':f(Math.max(.7,len*w*.07)),'stroke-opacity':.55},g);
    E('path',{d:smooth(M.slice(0,n),false),stroke:'#d2dbc8','stroke-width':f(Math.max(.45,len*w*.05)),'stroke-opacity':.6,fill:'none'},g)}return g}
/* gladiolus: a sword leaf — its base sheathing the stem (sh of its length, as wide as the stem sw, along the stem's direction ang), then the stiff blade turning off by da,
   linear, pleated on its midrib and parallel veins, tapering to a long point */
function swordLeaf(par,x,y,ang,len,w,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.25,o.face??.6),sw=o.sw||4,da=o.da||0,n=16,Lp=[],Rg=[],M=[],W=len*w*.5,sh=o.sh??.16;
  let px=0,py=0;for(let i=0;i<=n;i++){const t=i/n,th=da*sm01((t-sh)/.4)+(o.bend||0)*t*t;if(i){px+=Math.cos(th)*len/n;py+=Math.sin(th)*len/n}const nx=-Math.sin(th),ny=Math.cos(th),
    hw=t<sh?sw*.6+(W*.55-sw*.6)*Math.pow(t/sh,2):t<.7?W*(.55+.45*Math.min(1,(t-sh)/.22)):W*Math.pow(Math.max(0,(1-t)/.3),.75),k=t<sh?1:ct;M.push([px,py]);Lp.push([px-nx*hw*k,py-ny*hw*k]);Rg.push([px+nx*hw*k,py+ny*hw*k])}
  const tip=M[n];Lp[n]=Rg[n]=tip;E('path',{d:smooth(Lp.concat(Rg.slice(0,n).reverse())),fill:toneAt(P,.46+.24*ct),stroke:P.ink,'stroke-width':.42,'stroke-opacity':.5},g);
  if(!LOD){E('path',{d:smooth(M.concat(Rg.slice(0,n).reverse())),fill:P.d1,opacity:.35},g);let v=smooth(M.slice(2,n),false);for(const s of[-.5,.5]){const q=[];for(let i=3;i<n-1;i++)q.push([M[i][0]+(Rg[i][0]-M[i][0])*s*1.2,M[i][1]+(Rg[i][1]-M[i][1])*s*1.2]);v+=smooth(q,false)}
    E('path',{d:v,stroke:P.l1,'stroke-width':f(Math.max(.4,W*.06)),'stroke-opacity':.4,fill:'none'},g)}return g}
/* ---------- delphinium (Delphinium elatum; D. × belladonna): the hollow stem grows nearly straight, wandering a little; alternate leaves, long-petioled and palmately cut low on the stem,
   smaller and less cut higher up; from the highest axils, just under the raceme, one or two shorter, younger side racemes (elatum) or two or three airier ones (belladonna);
   the raceme opens from its base: the lowest florets may have shed their sepals (the three green follicles stay), then open florets, two opening, coloured buds, green buds tight at the tip ---------- */
/* the young fruit of a spent floret: three follicles held together, erect on the pedicel (local Z), one outline each */
function delphPods(par,B,O,s){let d='';for(let j=0;j<3;j++){const a=(j*120+30+R(-15,15))*D,pts=[];for(let i=0;i<=7;i++)for(let m=0;m<8;m++){const v=i/7,b=m/8*6.283,r=s*.17*Math.pow(Math.sin(Math.PI*Math.min(.99,.04+.96*v)),.7)*(1-.3*v),c=s*.1*(1+.8*v);
    const p=PJ(B,O,[Math.cos(a)*c+Math.cos(b)*r,Math.sin(a)*c+Math.sin(b)*r,v*s]);pts.push([p[0],p[1]])}d+=smooth(hull2(pts))}
  E('path',{d,fill:budFill('#86a45c'),stroke:'#3e5a28','stroke-width':.4,'stroke-opacity':.6},par)}
/* one raceme along an axis A from l0 to its tip; o: fo open fraction, nS spent, nH opening, sz0 size, gb greener buds (a young side raceme); every floret keeps its pedicel,
   even facing the eye (an open floret of the belladonna stands off its rachis, it would float) */
function delphRace5(A,parts,l0,nT,Dm,cw,bel,cache,pc,o={}){const Lr=A.L-l0,ag=spAges(nT,o.fo,o.nS||0,o.nH??2),sz0=o.sz0||1,gb=o.gb||0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.015+.97*spQ(i,nT,bel?.5:.3)),s=A.sOf(l),az=(i*137.5+R(-14,14))*D,a=ag[i];
    if(a.k==='bud'){const qb=a.qb,sb=Dm*(.36-.24*qb)*sz0,pl=spAt(A,s,az,Dm*(bel?.32:.2)*(1-.6*qb),.85+.35*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#9cb874',Math.min(.9,.12+gb+.66*Math.round(qb*4)/4));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.028),pc);delphBud(par,B,pl.pos,sb,bc,qb<.75)}})}
    else if(a.k==='spent'){const pl=spAt(A,s,az,Dm*.2,.55,0),B=spFrame(pl.ax,pl.T,0);parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.026),pc);delphPods(par,B,pl.pos,Dm*.22)}})}
    else{const h=a.k==='half'?a.op:1,sz=(1-.22*q)*sz0*(.7+.3*h),pl=spAt(A,s,az,Dm*sz*(bel?.62+.3*(1-q):.4+.2*(1-q))*(.55+.45*h),(bel?.42:.3)+(1-h)*.35+R(-.08,.08),Dm*(bel?.3:.1)*h),B=spFrame(pl.ax,pl.T,R(-.15,.15));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.026),pc);spHalf(h,()=>delphFloret(par,B,pl.pos,Dm*sz,cw,{bel,cache}))}})}}}
function delphSpike5(g,t,o){const cw=cwPick(CW_DELPH,o),bel=cw.f==='bel',op=Math.max(.05,Math.min(1,o.op??R(.78,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||50)*UPC*(bel?.76:1),Lt=sp?blen(o.spine):Lf0*1.42,Dm=(bel?4.6:6)*UPC*R(.95,1.05)*Math.max(.86,Math.min(1.12,Math.pow(Lf0/(50*UPC),.3))),SC=['#26401e','#466c32','#77a050','#b2cf86'],pc=mix(SC[1],cw.c,.3),lc='#477232';
  const w0=bel?5:7.5,wm=bel?3.4:4.8,nLat=o.short?0:bel?(rnd()<.5?2:3):rnd()<.3?0:rnd()<.62?1:2;let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.8,.8),wig:.035,e:.07,seg:7,w:w0,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.8:.6:.7));Lb=L-Lfl;const n=bel?3:4,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.14+.66*u)*R(.96,1.04),phi:ph0+j*137.5,kink:R(1.5,3),leaf:{a:58-16*u+R(-5,5),len:Dm*(2.05-.75*u)*R(.92,1.08),pet:.38-.16*u,lobes:u<.6?7:5,spread:220-40*u}})}
    /* the highest nodes: a small leaf, and in its axil a side raceme, shorter the higher */
    const nu=Math.max(1,nLat);for(let m=0;m<nu;m++){const l=Lb*(nu>1?.88+.1*m/(nu-1):.94),lat=m<nLat&&(!sp||l>L*.3)?{len:Lfl*(bel?R(.45,.6):R(.34,.48))*(1-.16*m),a:bel?R(34,44):R(30,40),e:.055,w:wm*.55}:null;
      N.push({l,phi:ph0+(n+m)*137.5,kink:R(1,2.5),leaf:{a:38+R(-5,5),len:Dm*R(.6,.78),pet:.12,lobes:3,spread:110,wl:.3},lat})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],w0,wm,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.3,s0+(1-s0)*.6,1],wm,1.1,SC,1,s0);
  /* the leaves; in a bouquet they turn up to the light and stay clear above the mouth */
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<10*UPC)continue;spLeafUp(lf,.1);const c=V3.add(lf.pos,V3.sc(lf.H,lv.len*(lv.pet+.5*(1-lv.pet))));if(lf.pos[1]<22||c[1]-lv.len*(1-lv.pet)*.5<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face,dr)=>delphLeaf(par,x,y,ang,len,lc,{lobes:lv.lobes,face,pet:lv.pet,spread:lv.spread,wl:lv.wl})))}
  /* the side racemes: younger than the main one, the higher the younger */
  P.lats.forEach((lt,m)=>{const As=lt.A,ns=Math.max(5,Math.round(As.L/UPC*(bel?.42:.55)));spStemP(As,parts,[0,bel?.32:.3,.65,1],lt.nd.lat.w,.9,SC);
    delphRace5(As,parts,As.L*(bel?.32:.3),ns,Dm,cw,bel,cache,pc,{fo:op<.3?0:bel?.1+.6*op:.04+.36*op*(1-.3*m),nH:1,sz0:.86,gb:bel?0:.08})});
  const nT=Math.max(bel?9:12,Math.round(Lfl/UPC*(bel?.44:DET>=1.5?.8:.7))),nS=!bel&&op>.9?(rnd()<.45?1:rnd()<.35?2:0):0;
  delphRace5(A,parts,L-Lfl,nT,Dm,cw,bel,cache,pc,{fo:op<.2?.04:Math.min(.8,.1+.72*op),nS});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}
/* ---------- larkspur (Consolida ajacis): a slender stem, branched in its upper half — the side branches, longer low down, each end in a shorter, younger raceme;
   alternate leaves cut into thread-like segments; double florets with a long spur, the lowest one sometimes gone to its single green follicle ---------- */
/* the young fruit of a spent floret: one follicle, slim and a little curved, erect on its pedicel (local Z) */
function larkPod(par,B,O,s){spBud(par,B,O,s,s*.26,'#86a45c',{tp:.5,pw:.6});if(!LOD){const a=PJ(B,O,[0,0,s*.96]),b=PJ(B,O,[0,s*.06,s*1.12]);E('path',{d:`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`,stroke:'#5a7a3a','stroke-width':.6,'stroke-linecap':'round'},par)}}
function larkRace5(A,parts,l0,nT,Dm,cw,cache,pc,o={}){const Lr=A.L-l0,ag=spAges(nT,o.fo,o.nS||0,o.nH??2),sz0=o.sz0||1,gb=o.gb||0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.02+.96*spQ(i,nT,.4)),s=A.sOf(l),az=(i*137.5+R(-18,18))*D,a=ag[i];
    if(a.k==='bud'){const qb=a.qb,sb=Dm*(.42-.28*qb)*sz0,pl=spAt(A,s,az,Dm*.3*(1-.6*qb),.9+.3*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#a8bc80',Math.min(.9,.1+gb+.6*Math.round(qb*4)/4));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.5,Dm*.035),pc);delphBud(par,B,pl.pos,sb,bc,qb<.6)}})}
    else if(a.k==='spent'){const pl=spAt(A,s,az,Dm*.3,.75,0),B=spFrame(pl.ax,pl.T,0);parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.55,Dm*.04),pc);larkPod(par,B,pl.pos,Dm*.42)}})}
    else{const h=a.k==='half'?a.op:1,sz=(1-.25*q)*sz0*(.72+.28*h),pl=spAt(A,s,az,Dm*sz*(.55+.25*(1-q))*(.6+.4*h),.45+(1-h)*.3+R(-.1,.1),Dm*.25*h),B=spFrame(pl.ax,pl.T,R(-.2,.2));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.55,Dm*.04),pc);spHalf(h,()=>larkFloret(par,B,pl.pos,Dm*sz,cw,{cache}))}})}}}
function larkSpike5(g,t,o){const cw=cwPick(CW_LARK,o),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||40)*UPC,Lt=sp?blen(o.spine):Lf0*1.5,Dm=3.4*UPC*R(.94,1.06),SC=['#2a4420','#4a7034','#76a050','#b0cc84'],pc=mix(SC[1],cw.c,.25),lc='#4a7a38';
  const nb=o.short?0:sp?(rnd()<.3?1:rnd()<.6?2:3):(rnd()<.5?2:3);let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.8,.8),wig:.04,e:.06,seg:7,w:4.2,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.8:.6:.66));Lb=L-Lfl;const ph0=R(0,360),N=[],n=5;
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.12+.42*u)*R(.95,1.05),phi:ph0+j*137.5,kink:R(1.5,3.5),leaf:{a:48-10*u+R(-6,6),len:Dm*(2.7-.7*u)*R(.9,1.1)}})}
    /* the branches, from the upper half of the stem, each in the axil of a smaller leaf: the lowest the longest */
    const nu=Math.max(2,nb);for(let m=0;m<nu;m++){const u=m/(nu-1),l=Lb*(.62+.36*u)*R(.97,1.02),lat=m<nb&&(!sp||l>L*.3)?{len:Lfl*R(.42,.56)*(1-.22*u),a:R(26,36),e:.06,w:2.4}:null;
      N.push({l,phi:ph0+(n+m)*137.5,kink:R(1.5,3),leaf:{a:40+R(-6,6),len:Dm*(1.7-.5*u)*R(.9,1.1)},lat})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],4.2,2.8,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.4,1],2.8,.9,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<10*UPC)continue;spLeafUp(lf,.12);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face,dr)=>filiLeaf(par,x,y,ang,len,lc,{face})))}
  P.lats.forEach((lt,m)=>{const As=lt.A,ns=Math.max(5,Math.round(As.L/UPC*.5));spStemP(As,parts,[0,.3,1],lt.nd.lat.w,.8,SC);
    larkRace5(As,parts,As.L*.3,ns,Dm,cw,cache,pc,{fo:op<.3?0:.06+.5*op*(1-.25*m),nH:1,sz0:.88,gb:.06})});
  const nT=Math.max(9,Math.round(Lfl/UPC*.5)),nS=op>.9?(rnd()<.4?1:0):0;larkRace5(A,parts,L-Lfl,nT,Dm,cw,cache,pc,{fo:op<.2?.05:Math.min(.78,.1+.68*op),nS});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.2,bc:SC}}
/* ---------- snapdragon (Antirrhinum majus): a leafy stem — lanceolate leaves, opposite in pairs crossing at the base, alternate higher up, smaller toward the spike;
   sometimes a short side shoot of buds from a high axil; the spike opens from below: the lowest corolla may have fallen (the calyx holds the young capsule and its style),
   then open florets, one coloured bud about to open, buds greener and tighter to the tip ---------- */
/* a spent floret: the corolla fallen, the green calyx round the round capsule, the style still standing */
function snapSpent(par,B,O,Lf){const cal=[];for(let j=0;j<5;j++)cal.push(ligule(B,O,{phi:(j*72+18)*D,r0:Lf*.05,z0:-Lf*.02,L:Lf*.2,W:Lf*.05,wp:SN_CAL,a0:.4,a1:.7,tip:'point',n:3}));
  const pts=[];for(let i=0;i<=6;i++)for(let j=0;j<8;j++){const u=i/6*Math.PI,a=j/8*6.283,p=PJ(B,O,[Math.sin(u)*Math.cos(a)*Lf*.08,Math.sin(u)*Math.sin(a)*Lf*.08,Lf*.09+Math.cos(u)*Lf*.09]);pts.push([p[0],p[1]])}
  const a=PJ(B,O,[0,0,Lf*.17]),b=PJ(B,O,[0,Lf*.02,Lf*.36]),back=B[2][2]<0,cap=()=>E('path',{d:smooth(hull2(pts)),fill:budFill('#8aa860'),stroke:'#3e5a28','stroke-width':.35,'stroke-opacity':.6},par),
    calx=()=>E('path',{d:cal.map(l=>smooth(l.out)).join(''),fill:'#5f8a40',stroke:'#2f4a20','stroke-width':.35,'stroke-opacity':.5},par);
  if(back){cap();calx()}else{calx();cap()}if(!LOD)E('path',{d:`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`,stroke:'#6f8a48','stroke-width':.6,'stroke-linecap':'round'},par)}
function snapRace5(A,parts,l0,nT,Lfr,cw,cache,SC,o={}){const Lr=A.L-l0,ag=spAges(nT,o.fo,o.nS||0,o.nH??1),sz0=o.sz0||1,gb='#7fa45a';
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.02+.97*spQ(i,nT,.42)),s=A.sOf(l),az=(i*137.5+R(-12,12))*D,a=ag[i];
    if(a.k==='open'){const sz=(1-.18*q)*sz0,pl=spAt(A,s,az,Lfr*.1,.42+R(-.1,.1),0),B=spFrame(pl.ax,pl.T,R(-.12,.12));parts.push({z:A.zk(s,pl.pos[2]+Lfr*.25*pl.ax[2]),fn:par=>snapFloret(par,B,pl.pos,Lfr*sz,cw,{cache})})}
    else if(a.k==='spent'){const pl=spAt(A,s,az,Lfr*.08,.5,0),B=spFrame(pl.ax,pl.T,0);parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,1.2,SC[1]);snapSpent(par,B,pl.pos,Lfr*sz0)}})}
    else{const qb=a.k==='half'?-.12:a.qb,sb=Lfr*(.5-.3*qb)*sz0,pl=spAt(A,s,az,Lfr*.06,.95+.35*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,gb,Math.max(.06,.2+.6*Math.round(qb*4)/4+(o.gb||0)));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,1.2,SC[1]);spBud(par,B,pl.pos,sb,sb*.42,bc,{tp:.45,pw:.6});if(sb>4)spBud(par,B,V3.add(pl.pos,V3.sc(pl.ax,-sb*.04)),sb*.3,sb*.36,'#5f8a40',{tp:-.2,pw:.5})}})}}}
function snapSpike5(g,t,o){const cw=cwPick(CW_SNAP,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||30)*UPC,Lt=sp?blen(o.spine):Lf0*1.7,Lfr=4.5*UPC*R(.94,1.06),SC=['#2a4620','#4a7434','#78a452','#b0cf88'],lc='#4f7f38';
  const side=!o.short&&rnd()<.35;let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.8,.8),wig:.035,e:.07,seg:7,w:5,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.75:.5:.6));Lb=L-Lfl;const ph0=R(0,360),N=[],n=8;
    /* opposite pairs at the base, crossing (decussate), then alternate up the stem */
    for(let j=0;j<n;j++){const u=j/(n-1),opp=j<3,l=Lb*(.1+.86*Math.pow(u,1.1))*R(.97,1.03);
      N.push({l,phi:opp?ph0+j*90:ph0+180+j*137.5,kink:opp?R(.5,1.5):R(1.5,3),leaf:{m:opp?2:1,a:40-12*u+R(-5,5),len:Lfr*(1.55-.7*u)*R(.9,1.1),w:.21+R(-.02,.03)},
        lat:side&&j===n-1&&(!sp||l>L*.3)?{len:Lfl*R(.22,.34),a:R(24,32),e:.06,w:2.6}:null})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],5,3.8,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.45,1],3.8,1.2,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<10*UPC)continue;spLeafUp(lf,.12);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face,dr)=>lanceFlat(par,x,y,ang,len,lv.w,lc,{tilt:Math.acos(face),bend:dr*R(.06,.2),I:.5+.18*face})))}
  /* the side shoot: young, its spike still in bud */
  for(const lt of P.lats){const As=lt.A,ns=Math.max(5,Math.round(As.L/UPC*.9));spStemP(As,parts,[0,.35,1],lt.nd.lat.w,1,SC);snapRace5(As,parts,As.L*.35,ns,Lfr,cw,cache,SC,{fo:op>.75?.12:0,sz0:.86,gb:.1})}
  const nT=Math.max(12,Math.round(Lfl/UPC*.95)),nS=op>.85?(rnd()<.45?1:0):0;snapRace5(A,parts,L-Lfl,nT,Lfr,cw,cache,SC,{fo:op<.2?0:Math.min(.66,.08+.62*op),nS});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:5,bc:SC}}
/* ---------- stock (Matthiola incana): a stout felted stem, crowded below with grey-green, felted, oblong-lanceolate leaves, smaller up the stem; mostly a single column,
   sometimes (the spray types) a short side shoot; open double florets up the column, two half open, a crown of downy buds; the lowest floret may be fading ---------- */
function stockSpike5(g,t,o){const cw=cwPick(CW_STOCK,o),op=Math.max(.05,Math.min(1,o.op??R(.72,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||22)*UPC,Lt=sp?blen(o.spine):Lf0*2,Dm=4.1*UPC*R(.94,1.06),SC=['#34442e','#5a6c50','#879a78','#b6c4a6'],lc='#7d8e70',pcol=SC[1];
  /* in bud the column has not stretched yet: a tight cone of buds right above the leaves (cf of the flowering length) */
  const side=!o.short&&rnd()<.18,cf=Math.min(1,.3+1.4*op);let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.8,.8),wig:.03,e:.08,seg:7,w:7,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.7:.46:.52));Lb=L-Lfl*cf;const ph0=R(0,360),N=[],n=9;
    for(let j=0;j<n;j++){const u=j/(n-1),l=Lb*(.08+.9*Math.pow(u,1.35))*R(.97,1.03);
      N.push({l,phi:ph0+j*137.5,kink:R(.8,2),leaf:{a:32-10*u+R(-5,5),len:Dm*(2.9-1.5*u)*R(.9,1.1),w:.2-.03*u},lat:side&&j===n-1&&(!sp||l>L*.3)?{len:Lfl*R(.26,.36),a:R(22,30),e:.07,w:3.2}:null})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl*cf);
  spStemP(A,parts,[0,s0],7,5,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.5,1],5,2,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<10*UPC)continue;spLeafUp(lf,.14);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face,dr)=>feltLeaf(par,x,y,ang,len,lv.w,lc,{face,bend:dr*R(.08,.22)})))}
  /* a column: open florets low, two half open, then the buds; fo is how far up the column the florets are open */
  const column=(Ax,l0,Lc,o2)=>{const Lr=Ax.L-l0,nO=o2.op<.2?0:Math.max(o2.min??4,Math.round(Lc/UPC*.95*(.2+.75*o2.op))),nB=Math.max(o2.nb??7,Math.round(Lc/UPC*.42)),fo=o2.op<.2?0:.62+.22*o2.op,nH=nO>3?2:nO>1?1:0;
    for(let i=0;i<nO;i++){const q=i/Math.max(1,nO-1),l=l0+Lr*fo*(.02+.98*spQ(i,nO,.6)),s=Ax.sOf(l),az=(i*137.5+R(-14,14))*D,h=i>=nO-nH?.35+.4*(nO-1-i)/Math.max(1,nH):1,fade=i<o2.nS,
        sz=(1-.16*q)*(o2.sz0||1)*(.75+.25*h)*(fade?.82:1),pl=spAt(Ax,s,az,Dm*sz*(.3+.1*(1-q))*(.7+.3*h),.3+(1-h)*.3+R(-.08,.08),Dm*.06),B=spFrame(pl.ax,pl.T,R(-.3,.3)),cf=fade?Object.assign({},cw,{c:mix(mix(cw.c,'#d8cdb0',.5),'#a89878',.18)}):cw;
      parts.push({z:Ax.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.7,Dm*.05),pcol);spHalf(h,()=>stockFloret(par,B,pl.pos,Dm*sz,cf,{cache}))}})}
    for(let i=0;i<nB;i++){const qb=i/Math.max(1,nB-1),l=l0+Lr*(fo+(1-fo)*(.04+.95*spQ(i,nB,.45))),s=Ax.sOf(l),az=((nO+i)*137.5+R(-14,14))*D,sb=Dm*(.4-.24*qb)*(o2.sz0||1),pl=spAt(Ax,s,az,Dm*.14*(1-.6*qb),1.0+.4*qb,0),B=spFrame(pl.ax,pl.T,0),
        bc=mix(cw.c,'#93a284',Math.min(.92,.2+(o2.gb||0)+.6*Math.round(qb*4)/4));
      parts.push({z:Ax.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,1.2,pcol);spBud(par,B,V3.add(pl.pos,V3.sc(pl.ax,-sb*.08)),sb,sb*.74,bc,{tp:.25,pw:.8})}})}};
  for(const lt of P.lats){const As=lt.A;spStemP(As,parts,[0,.3,1],lt.nd.lat.w,1.4,SC);column(As,As.L*.3,As.L*.7,{op:op*.55,min:0,nb:5,sz0:.85,gb:.08,nS:0})}
  column(A,L-Lfl*cf,Lfl*cf,{op,nS:op>.9&&rnd()<.35?1:0,nb:op<.2?Math.round(Lfl*cf/UPC*1.3):7});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:7,bc:SC}}
/* ---------- gladiolus: a single stiff stem, its base sheathed by one to three sword leaves rising close along it; a one-sided spike of funnel florets out of green spathes,
   alternately left and right, the lowest open first, one opening, then buds showing their colour, the top ones green and sheathed to a point ---------- */
function gladSpike5(g,t,o){const cw=cwPick(CW_GLAD,o),op=Math.max(.05,Math.min(1,o.op??R(.68,1))),k=G(g),parts=[],cache={},sp=!!o.spine,sd0=sp?(o.spine[3][0]>4?1:o.spine[3][0]<-4?-1:0):0;
  const Lf0=(o.cm||50)*UPC,Lt=sp?blen(o.spine):Lf0*1.5,Dm=9.6*UPC*R(.94,1.06)*Math.max(.88,Math.min(1.1,Math.pow(Lf0/(50*UPC),.3))),SC=['#28461e','#467432','#74a24e','#accd84'],Lb0=4.6*UPC,lc='#4a7a36';
  let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:sd0?sd0*R(.15,.55):R(-.4,.4),wig:.02,e:.09,seg:8,w:7.4,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.75:.52:.68));Lb=L-Lfl;const n=sp?(o.short?1:2):3,ph=R(70,110),N=[];
    /* the leaves are two-ranked: alternately on either side of the stem, in one plane */
    for(let j=0;j<n;j++){const l=Lb*(.06+.22*j)*R(.9,1.1);N.push({l,phi:ph+j*180+R(-15,15),kink:R(.4,1),leaf:{a:R(5,9),len:Math.min(Lb*R(.72,.95)+Lfl*.12,(L-l)*.82)*(1-.16*j),w:.075}})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],7.4,6,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.45,1],5,1.6,SC,1,s0);
  /* the sword leaves: their sheath along the stem, their blade turning off a few degrees; the sheath of each wraps the stem, so it is drawn in front of it or behind it whole */
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp&&lf.nd.l<12*UPC)continue;const f0=A.at(lf.s),ta=Math.atan2(-f0.T[1],f0.T[0]),la=Math.atan2(-lf.H[1],lf.H[0]);let da=la-ta;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;
    da=Math.max(-.2,Math.min(.2,da));const fs=Math.max(.3,Math.hypot(lf.H[0],lf.H[1])),p=[lf.pos[0],-lf.pos[1]],face=Math.max(.25,Math.abs(lf.U[2])),front=lf.H[2]>0;
    parts.push({z:A.zk(lf.s,lf.pos[2]+(front?8:-8)),fn:par=>swordLeaf(par,p[0],p[1],ta,lv.len*fs,lv.w,lc,{face,da,sw:7,sh:.14,bend:R(-.03,.03)})})}
  const nT=Math.max(10,Math.round(Lfl/UPC*.34)),nO=Math.round(nT*(op<.2?0:Math.min(.5,.06+.48*op))),nH=nO>2?1:0;
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=L-Lfl+Lfl*(.01+.98*spQ(i,nT,.42)),s=A.sOf(l),side=i%2?1:-1,az=side*R(.42,.62);
    if(i<nO){const h=i>=nO-nH?.42:1,sz=(1-.16*q)*(.74+.26*h),pl=spAt(A,s,az,Dm*sz*.24*(.6+.4*h),.4+(1-h)*.45+R(-.06,.06),Dm*.12*h),B=spFrame(pl.ax,pl.T,side*R(.05,.18)),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));
      parts.push({z:A.zk(s,pl.pos[2]-Dm*.05),fn:par=>{gladBracts(par,A,s,r,Lb0*.9,{cache});spHalf(h,()=>gladFloret(par,B,pl.pos,Dm*sz,cw,{cache}))}})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Lb0*(1-.45*qb),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),ax=V3.nz(V3.add(V3.sc(r,.32),V3.sc(f0.T,.95))),B=spFrame(ax,f0.T,0),pos=V3.add(f0.p,V3.sc(r,Lb0*.08)),
        bc=mix(cw.c,'#8aac5c',Math.min(1,.12+1.1*qb));
      parts.push({z:A.zk(s,f0.p[2]+V3.sc(r,Lb0*.1)[2]),fn:par=>{if(qb<.55)spBud(par,B,pos,sb*.95,sb*.26,bc,{tp:.55,pw:.6});gladBracts(par,A,s,r,sb,{cache,c:'#78a050'})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:7.4,bc:SC}}
/* the spikes of lot 8 grown again; their colourways, sizes and composer infos stay those of s8a.js */
Object.assign(GH,{'delphinium':delphSpike5,'pied-alouette-annuel':larkSpike5,'muflier':snapSpike5,'giroflee-matthiole':stockSpike5,'glaieul':gladSpike5});
