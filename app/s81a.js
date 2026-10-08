/* ================= Serre, lot 81 — persistants 3, poussés par le L-système : oranger du Mexique, brachyglottis 'Sunshine', leucothoé, houx, chêne vert ================= */
/* chaque rameau ligneux est poussé par le moteur des branches du lot 39 (l39Sprig : axe sur l'épine du Composer, debout sur une planche ou une carte, nœuds, rameaux latéraux, écorce) ;
   les feuilles sont des nappes 3D à deux faces (dessus luisant, revers feutré ou plus pâle), simples ou trifoliolées, les marges épineuses taillées sur leurs rangs ;
   les fleurs (étoiles blanches, capitules jaunes) en corymbes, les baies du houx en bouquets serrés à l'aisselle, les glands du chêne vert ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
/* ---------- shared ---------- */
/* the lot's sprig: lot 39's branch engine, handing back the foot of its main axis too (neck: where the bouquet stem arrives, nd: toward where it goes on down) */
function l81Sprig(g,t,o,S){let rs=null;const po=S.post;S.post=(res,parts,lim)=>{rs=res;if(po)po(res,parts,lim)};const r=l39Sprig(g,t,o,S);
  if(rs&&rs.chains.length){const c0=rs.chains[0],b=c0.pts[0],b1=c0.pts[Math.min(2,c0.pts.length-1)],dx=b1[0]-b[0],dy=b1[1]-b[1],l=Math.hypot(dx,dy)||1;r.neck=[b[0],-b[1]];r.nd=[-dx/l,dy/l]}
  return r}
const l81Op=o=>Math.max(.05,Math.min(1,o.op??1)),l81Cl=x=>Math.max(0,Math.min(1,x));
/* a blade surface like lot 39's (l39BladeS), its margin raised and lowered by wf(v, u) (the alternate spines of a holly leaf) instead of a plain sine */
function l81BladeS(P0,Ax,N,len,hw,wp,o={}){const W=V3.cr(N,Ax),ar=o.arch||0,fo=o.fold||0,cu=o.cup||0,dr=o.droop||0,cl=o.curl||0,tw=o.tw||0,wv=o.wave||0,wf=o.wf;
  return(u,v)=>{const w=hw*wp(v,u),a=tw*v,c=Math.cos(a),s=Math.sin(a),h=len*ar*Math.sin(Math.PI*v)+w*(fo*Math.abs(u)+cu*u*u)+len*cl*v*v*v+(wv&&wf?w*wv*u*u*wf(v,u):0),x=len*v,uw=u*w;
    return[P0[0]+Ax[0]*x+(W[0]*c+N[0]*s)*uw+(N[0]*c-W[0]*s)*h,P0[1]+Ax[1]*x+(W[1]*c+N[1]*s)*uw+(N[1]*c-W[1]*s)*h-len*dr*v*v,P0[2]+Ax[2]*x+(W[2]*c+N[2]*s)*uw+(N[2]*c-W[2]*s)*h]}}
/* the outline of a blade on the screen, row by row at the rows vs (the extreme points across its midrib: its true silhouette, edge-on too), its rows and mean depth */
const L81_U5=[-1,-.5,0,.5,1];
function l81Out(S,vs,sharp){const nv=vs.length-1,rows=[];let z=0;for(const v of vs){const r=L81_U5.map(u=>{const p=S(u,v);return[p[0],-p[1],p[2]]});rows.push(r);z+=r[2][2]}z/=nv+1;
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=rows[Math.max(0,i-1)][2],b=rows[Math.min(nv,i+1)][2];let px=-(b[1]-a[1]),py=b[0]-a[0];if(Math.hypot(px,py)<1e-6){px=rows[i][4][0]-rows[i][0][0];py=rows[i][4][1]-rows[i][0][1]}
    const m=Math.hypot(px,py)||1;px/=m;py/=m;let mn=1e9,mx=-1e9,pl=rows[i][0],pr=rows[i][4];const c=rows[i][2];for(const q of rows[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push([pl[0],pl[1]]);Rt.push([pr[0],pr[1]])}
  if(sharp){const e=rows[nv][2];Lf.push([e[0],e[1]])}return{out:Lf.concat(Rt.reverse()),rows,z}}
/* one blade as a part of the painter's order (after f15Blade): filled flat with the tone of the face it shows (the upper face glossy, the lower one paler or felted);
   on sheets its two halves folded on the midrib, each with its own tone, the midrib and side veins. o.poly keeps the outline sharp (spines), o.inner {P, PB, k(v)} paints the centre
   of the blade in another colour over a variegated margin, o.gloss a light streak along the upper face, o.ink/ew/eo the margin (white felt on brachyglottis) */
function l81Blade(S,P,PB,o={}){const n0=o.nv||(DET>=1.5?12:7),vs=o.vs||Array.from({length:n0+1},(_,i)=>i/n0),nv=vs.length-1,{out,rows,z}=l81Out(S,vs,o.sharp);
  const nC=f15Nrm(S,-1,1),fr=nC[2]>=0,mt=o.mt??.8,tc=f15Tone(P,PB,nC,mt),lite=h2l(tc)[2]>.76,ink=(!fr&&o.inkB)||o.ink||shd(tc,-.5),eo=o.eo??(lite?.8:.45),det=DET>=1.5&&!LOD,
    dO=o.poly?pD(out)+'Z':smooth(out),sc=p=>[p[0],-p[1]];
  let dI=null,tI=null;if(o.inner){const L=[],Rr=[];for(const v of vs){const k=o.inner.k(v);if(k<=.02)continue;L.push(sc(S(-k,v)));Rr.push(sc(S(k,v)))}if(L.length>2){dI=smooth(L.concat(Rr.reverse()));tI=f15Tone(o.inner.P,o.inner.PB,nC,mt)}}
  return{z:z+(o.zb||0),cast:false,fn:par=>{
    if(det&&!o.flat){const half=j=>{const q=[];for(let i=0;i<=nv;i++)q.push([rows[i][j][0],rows[i][j][1]]);for(let i=nv;i>=0;i--)q.push([rows[i][2][0],rows[i][2][1]]);return q},
        hs=[[0,f15Nrm(S,-1,0),rows.reduce((s,r)=>s+r[0][2],0)],[4,f15Nrm(S,0,1),rows.reduce((s,r)=>s+r[4][2],0)]].sort((a,b)=>a[2]-b[2]);
      if(o.poly)E('path',{d:dO,fill:tc},par);
      for(const[j,n]of hs)E('path',{d:o.poly?pD(half(j))+'Z':smooth(half(j)),fill:f15Tone(P,PB,n,mt)},par);
      if(dI)E('path',{d:dI,fill:tI,opacity:.96},par);
      if(o.mid)E('path',{d:smooth(rows.slice(0,nv).map(r=>[r[2][0],r[2][1]]),false),stroke:o.mid,'stroke-width':f(o.mw||.45),'stroke-opacity':o.mo??.45,fill:'none','stroke-linecap':'round'},par);
      if(o.veins){let dv='';for(const L of o.veins){const q=L.map(([u,v])=>sc(S(u,v)));dv+=smooth(q,false)}E('path',{d:dv,stroke:o.vc||o.mid||ink,'stroke-width':f(o.vw||.3),'stroke-opacity':o.vo??.3,fill:'none','stroke-linecap':'round'},par)}
      E('path',{d:dO,fill:'none',stroke:ink,'stroke-width':o.ew||.42,'stroke-opacity':Math.min(.9,eo+.05),'stroke-linejoin':'round'},par)}
    else{E('path',LOD&&!lite&&!o.ink?{d:dO,fill:tc}:{d:dO,fill:tc,stroke:ink,'stroke-width':o.ew||.4,'stroke-opacity':eo,'stroke-linejoin':'round'},par);if(dI&&!LOD)E('path',{d:dI,fill:tI},par)}
    /* the gloss: a light streak along the half that turns to the light, on the upper face only */
    if(o.gloss&&fr&&!LOD&&(det||o.g1)){const nL=f15Nrm(S,-1,0),nR=f15Nrm(S,0,1),s=lightI(nR)>lightI(nL)?1:-1,q=[];for(let i=2;i<=7;i++)q.push(sc(S(s*.42,i/9)));
      const gw=Math.max(.35,(o.gw||1)*.32);E('path',{d:polyRibbon(q,i=>gw*Math.sin(Math.PI*(i+.5)/q.length)),fill:'#ffffff',opacity:f(Math.min(.5,.3*o.gloss))},par)}}}}
/* a leaf at a node: its petiole (a curve never finer than 1.1, so the blade stays joined to its twig), its blade fitted above the mouth.
   L: sz (length), wr, wp, N or rho (its face), c, cb (the lower face), sh (blade shape), pet (petiole length), pw, pc, bo (drawer options) */
function l81Leaf(og,lim,L){const Hd=og.H,N=L.N||f15Face(og,-(L.rho??60)*D,L.sg||(rnd()<.5?1:-1)),P0=V3.add(og.pos,V3.sc(Hd,L.pet||og.w*.35)),
    mk=len=>l81BladeS(P0,Hd,N,len,len*L.wr*.5,L.wp,L.sh),S=f15Fit(mk,L.sz,lim);if(!S)return null;
  const parts=[l81Blade(S,pal7(L.c),pal7(L.cb||shd(L.c,.12)),Object.assign({gw:L.sz*L.wr*.07},L.bo))];
  if(L.pet){const a=og.pos,b=S(0,0),w=Math.max(1.1,L.pw||og.w*.4);parts.push({z:(a[2]+b[2])/2-.02,cast:false,fn:par=>E('path',{d:`M${f(a[0])},${f(-a[1])}Q${f((a[0]+b[0])/2)},${f(-(a[1]+b[1])/2-L.pet*.12)} ${f(b[0])},${f(-b[1])}`,stroke:L.pc||shd(L.c,-.3),'stroke-width':f(w),'stroke-linecap':'round',fill:'none'},par)})}
  return parts}
/* a side direction at a node (the axil's side, away from the twig), as lot 39's acorns */
const l81Side=(og,k=2)=>V3.nz(V3.add(V3.sc(og.U,-Math.cos((og.p.ph||0)*D+k)),V3.sc(og.L,Math.sin((og.p.ph||0)*D+k))));
const l81Base=Z=>{const X=Math.abs(Z[2])<.9?V3.nz(V3.cr(Z,[0,0,1])):V3.nz(V3.cr(Z,[1,0,0]));return[X,V3.cr(Z,X)]};
/* ---------- a flower or a capitulum in 3D at P, facing Z: n petals (rays) of length len from a ring r0, held up toward Z by the angle tl (cupped when young, spread when open);
   its heart (an eye, a disc of florets) with its stamens, its involucre behind. Drawn as one part: the far petals, the heart, the near petals (looked into, the heart last;
   from behind, the heart first); at the app's detail the petals of a side share one path. Below a = .3 it is a bud. F: n, len, wr, wp, c, cb, r0, tl0, tl1, cup, heart{r, c, h, dome},
   stam{n, len, c, ac}, inv{r, c}, bud{len, w, c, rp, ink} ---------- */
function l81Flower(P,Z,F,a){if(a<.3){const B=F.bud,s=.55+.45*a/.3;return l39Ovoid(V3.add(P,V3.sc(Z,-B.len*.2)),Z,B.len*s,B.w*s,B.rp||L39_EGG,B.c,{zb:.02,eo:.55,ink:B.ink})}
  const[X0,Y0]=l81Base(Z),s=l81Cl((a-.3)/.6),tl=(F.tl0??68)*(1-s)+(F.tl1??8)*s,len=F.len*(.62+.38*s),Pp=pal7(F.c),PBp=pal7(F.cb||shd(F.c,-.06)),ph=R(0,6.283),det=DET>=1.5&&!LOD,vs=det?[0,.15,.35,.55,.75,.9,1]:[0,.3,.65,1],pet=[];
  for(let i=0;i<F.n;i++){const an=ph+i/F.n*6.283+R(-.07,.07),rd=V3.add(V3.sc(X0,Math.cos(an)),V3.sc(Y0,Math.sin(an))),t=(tl+R(-5,5))*D,Ax=V3.nz(V3.add(V3.sc(rd,Math.cos(t)),V3.sc(Z,Math.sin(t)))),
      N=V3.nz(V3s(Z,V3.sc(Ax,V3.dot(Z,Ax)))),S=f15BladeS(V3.add(P,V3.sc(rd,F.r0||0)),Ax,N,len*R(.9,1.06),len*F.wr*.5,F.wp,{cup:F.cup??.15,arch:F.arch??.04,curl:F.curl??0,tw:R(-.12,.12)}),
      O=l81Out(S,vs,F.sharp);pet.push({z:O.z,near:rd[2]>=0,d:smooth(O.out),col:f15Tone(Pp,PBp,f15Nrm(S,-1,1),F.mt??.85)})}
  pet.sort((x,y)=>x.z-y.z);const H=F.heart,hc=V3.add(P,V3.sc(Z,H.h||0)),ring=r=>{const q=[];for(let j=0;j<14;j++){const an=j/14*6.283,p=V3.add(hc,V3.add(V3.sc(X0,Math.cos(an)*r),V3.sc(Y0,Math.sin(an)*r)));q.push([p[0],-p[1]])}return q};
  const ink=shd(F.c,-.4),zf=Z[2];
  const heart=par=>{if(F.inv&&zf<.2)E('path',{d:smooth(ring(F.inv.r)),fill:F.inv.c,stroke:shd(F.inv.c,-.4),'stroke-width':.3,'stroke-opacity':.5},par);
    const Ph=pal7(H.c);E('path',{d:smooth(ring(H.r*(.7+.3*s))),fill:toneAt(Ph,.55),stroke:Ph.d2,'stroke-width':.3,'stroke-opacity':.6},par);
    if(H.dome&&!LOD){const q=ring(H.r*.55),ox=-H.r*.12,oy=-H.r*.15;E('path',{d:smooth(q.map(p=>[p[0]+ox,p[1]+oy])),fill:toneAt(Ph,.78),opacity:.75},par)}
    if(F.stam&&det&&s>.25){const St=F.stam;let d='',da='';for(let j=0;j<St.n;j++){const an=j/St.n*6.283+ph*.5,rd=V3.add(V3.sc(X0,Math.cos(an)),V3.sc(Y0,Math.sin(an))),b=V3.add(hc,V3.sc(rd,H.r*.8)),
        e=V3.add(b,V3.add(V3.sc(rd,St.len*.55),V3.sc(Z,St.len*.75)));d+=`M${f(b[0])},${f(-b[1])}L${f(e[0])},${f(-e[1])}`;da+=`M${f(e[0])},${f(-e[1])}h.01`}
      E('path',{d,stroke:St.c,'stroke-width':.45,'stroke-linecap':'round',fill:'none'},par);E('path',{d:da,stroke:St.ac,'stroke-width':.95,'stroke-linecap':'round'},par)}};
  const draw=(par,L)=>{if(!L.length)return;if(det){for(const q of L)E('path',{d:q.d,fill:q.col,stroke:ink,'stroke-width':.3,'stroke-opacity':.4,'stroke-linejoin':'round'},par)}
    else E('path',{d:L.map(q=>q.d).join(''),fill:L[Math.floor(L.length/2)].col,stroke:ink,'stroke-width':.35,'stroke-opacity':.55,'stroke-linejoin':'round'},par)};
  return{z:P[2]+.05,cast:false,fn:par=>{if(zf>.25){draw(par,pet);heart(par)}else if(zf<-.25){heart(par);draw(par,pet)}else{draw(par,pet.filter(q=>!q.near));heart(par);draw(par,pet.filter(q=>q.near))}}}}
/* ---------- a corymb at an apex or an axil: n1 rays fanning out round the axis H (spread s1, degrees), the outer ones longer so the flowers come nearly level, each ending in a flower
   or in n2 shorter rays; a flower at its centre if mid; the rays one stroke path (never finer than 1.15) behind the flowers; left out when it would dip under the mouth.
   C: n1, l1, s1, n2, l2, s2, mid, w, pc, r (a flower's radius, for the mouth), fl(P, Z, i) → part ---------- */
function l81Cyme(P0,H,lim,C){const[X0,Y0]=l81Base(H),segs=[],tips=[],ph=R(0,6.283),up=[0,1,0];
  const ray=(A,d0,dd,l,w)=>{const E1=V3.add(V3.add(A,V3.sc(dd,l)),[0,-l*.06,0]),M=V3.add(A,V3.sc(V3.nz(V3.add(V3.sc(d0,.6),V3.sc(dd,.4))),l*.5));segs.push([A,M,E1,w]);return{E:E1,T:V3.nz(V3s(E1,M))}};
  if(C.mid){const r=ray(P0,H,H,C.l1*.7,C.w);tips.push(r)}
  for(let i=0;i<C.n1;i++){const an=ph+i/C.n1*6.283+R(-.25,.25),rd=V3.add(V3.sc(X0,Math.cos(an)),V3.sc(Y0,Math.sin(an))),sp=C.s1*D*R(.75,1.1),d1=V3.nz(V3.add(V3.sc(H,Math.cos(sp)),V3.sc(rd,Math.sin(sp)))),
      r1=ray(P0,H,d1,C.l1*R(.85,1.1)/Math.max(.6,Math.cos(sp)),C.w);
    if(!C.n2){tips.push(r1);continue}
    const n2=Math.max(1,Math.round(C.n2*R(.7,1.2)));for(let j=0;j<n2;j++){const a2=an+(j-(n2-1)/2)*1.1+R(-.3,.3),rd2=V3.add(V3.sc(X0,Math.cos(a2)),V3.sc(Y0,Math.sin(a2))),
      d2=V3.nz(V3.add(V3.add(V3.sc(r1.T,.5),V3.sc(H,.6)),V3.sc(rd2,Math.sin(C.s2*D)))),r2=ray(r1.E,r1.T,d2,C.l2*R(.8,1.15),Math.max(1.15,C.w*.82));tips.push(r2)}}
  if(lim!=null){for(const q of tips)if(-q.E[1]+(C.r||0)>lim)return null}
  const parts=[];let z=0,d1='',d2='';for(const[A,M,E1,w]of segs){z+=E1[2];const s=`M${f(A[0])},${f(-A[1])}Q${f(M[0])},${f(-M[1])} ${f(E1[0])},${f(-E1[1])}`;if(w>C.w*.9)d1+=s;else d2+=s}
  const wA=Math.max(1.15,C.w),wB=Math.max(1.15,C.w*.82);
  parts.push({z:z/Math.max(1,segs.length)-.3,cast:false,fn:par=>{if(d1)E('path',{d:d1,stroke:C.pc,'stroke-width':f(wA),fill:'none','stroke-linecap':'round'},par);if(d2)E('path',{d:d2,stroke:C.pc,'stroke-width':f(wB),fill:'none','stroke-linecap':'round'},par)}});
  tips.forEach((q,i)=>{const Z=V3.nz(V3.add(V3.add(V3.sc(q.T,.9),V3.sc(H,.4)),V3.sc(up,.2))),p=C.fl(q.E,Z,i);if(p)parts.push(p)});
  return parts}

/* ---------- Mexican orange blossom (Choisya ternata, Rutaceae, « oranger du Mexique »): a rounded evergreen shrub; smooth green young shoots; leaves opposite, on a petiole of 2–5 cm,
   palmately compound of three leaflets (the central one 4–8 cm, the side ones a little shorter), obovate-oblong, entire, sessile, glossy bright green and aromatic (oil glands seen against
   the light); 'Sundance' has golden-yellow young leaves turning lime; 'Aztec Pearl' (C. × dewitteana) narrow linear leaflets, its buds pink-flushed. In spring (and again in autumn)
   white starry flowers, 2.5–3 cm, five spreading oblong petals round ten stamens and a green ovary, fragrant like orange blossom, in corymbs of 3–6 at the tips and in the upper axils;
   the buds round, greenish white. Sold green (foliage), golden (Sundance) and in flower ---------- */
const CW_L81CHO=[{id:'vert',n:'Vert brillant',c:'#3d7330',lc:'#3d7330'},{id:'sundance',n:'Doré (Sundance)',c:'#d4b830',lc:'#c4b43a',gold:1},
  {id:'fleuri',n:'Vert en fleurs blanches',c:'#f3f1e8',lc:'#3d7330',fl:1},{id:'aztec',n:'Aztec Pearl (folioles fines, en fleurs)',c:'#ead8d2',lc:'#4a7a36',fl:1,nar:1}];
const L81_CHO=prof([[0,.1],[.12,.42],[.35,.78],[.6,.98],[.78,1],[.9,.78],[.97,.4],[1,0]]),L81_CHN=prof([[0,.2],[.1,.6],[.3,.92],[.6,1],[.85,.72],[.96,.3],[1,0]]),
  L81_CHP=prof([[0,.35],[.15,.8],[.45,1],[.75,.92],[.92,.6],[1,0]]),L81_CHST=['#33402a','#4c5c38','#6c7c50','#97a476'];
/* a leaflet's colour: the young ones (toward the tips, at an early stage) lighter — and golden on 'Sundance' */
function l81ChoCol(cw,q,y){const yg=l81Cl(.6*q+.5*(1-y)+R(-.12,.12));if(cw.gold)return mix(mix('#a8ae40','#e8d23c',yg),shd('#c8b83a',R(-.08,.08)),.3);return mix(mix(cw.lc,shd(cw.lc,R(-.1,.08)),.6),'#8cbc50',yg*.45)}
/* the trifoliate leaf: the petiole from the node, three leaflets fanned from its tip in the leaf's plane, the whole leaf shortened (or left out) to stay above the mouth */
function l81ChoLeaf(og,lim,cw,op){const q=og.p.q??0,y=l81Cl(op),nar=!!cw.nar,sz0=UPC*(nar?6.2:5.6)*(1-.28*Math.pow(q,1.3))*(og.p.s||1)*R(.86,1.1)*(.58+.42*y),c=l81ChoCol(cw,q,y),
    N=f15Face(og,-R(58,82)*D,rnd()<.5?1:-1),fa=R(36,50)*D,wr=nar?.13:.36,pc=mix('#4c6a34',c,.3),sh={arch:.06,fold:.16+.2*(1-y),cup:.04,droop:.08,curl:-.02};
  const mk=k=>{const pl=UPC*R(2.2,3.6)*(.55+.45*y)*k,Pt=V3.add(V3.add(og.pos,V3.sc(og.H,pl)),[0,-pl*.06,0]),Ax=V3.nz(V3s(Pt,og.pos)),Nn=V3.nz(V3s(N,V3.sc(Ax,V3.dot(N,Ax)))),
      L=[0,-1,1].map(j=>{const A=rotA(Ax,Nn,j*fa+R(-.08,.08)),len=sz0*k*(j?R(.74,.84):1);return{S:l81BladeS(Pt,A,Nn,len,len*wr*.5,nar?L81_CHN:L81_CHO,Object.assign({tw:R(-.2,.2)},sh)),len}});return{pl,Pt,L}};
  let M=null;for(const k of[1,.8,.62]){const m=mk(k);if(lim==null||(m.L.every(x=>f15Low(x.S)<=lim)&&-m.Pt[1]<=lim)){M=m;break}}if(!M)return null;
  const P=pal7(c),PB=pal7(mix(shd(c,.1),'#c8d4a8',.3)),det=DET>=1.5,parts=[];
  for(const x of M.L)parts.push(l81Blade(x.S,P,PB,{nv:det?10:6,mt:.85,gloss:.9,g1:x.len>UPC*3.5,gw:x.len*wr*.08,mid:det?mix(c,'#e8f0c0',.4):null,mo:.5,
    veins:det&&!nar?[1,2,3,4].map(k=>{const v=.12+.18*k;return[[0,v],[.55,v+.1],[.9,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]):null,vc:mix(c,'#e8f0c0',.3),vo:.25,vw:.28}));
  const a=og.pos,b=M.Pt,w=Math.max(1.15,og.w*.42);parts.push({z:(a[2]+b[2])/2-.02,cast:false,fn:par=>E('path',{d:`M${f(a[0])},${f(-a[1])}Q${f((a[0]+b[0])/2)},${f(-(a[1]+b[1])/2-M.pl*.1)} ${f(b[0])},${f(-b[1])}`,stroke:pc,'stroke-width':f(w),'stroke-linecap':'round',fill:'none'},par)});
  return parts}
/* the flower: five white petals (four or six now and then), ten stamens with yellow anthers round a green ovary; buds greenish white (pink-flushed on 'Aztec Pearl') */
function l81ChoFl(cw){const pk=!!cw.nar;return{n:5,len:UPC*1.45,wr:.54,wp:L81_CHP,c:pk?'#fbf4f2':'#fbfaf4',cb:pk?'#f0dcd8':'#ece8d8',r0:UPC*.12,tl0:70,tl1:6,cup:.2,arch:.03,
  heart:{r:UPC*.2,c:'#b8c870',h:UPC*.06,dome:1},stam:{n:10,len:UPC*.55,c:'#f4f0d8',ac:'#e0b840'},bud:{len:UPC*.75,w:UPC*.62,c:pk?'#f0d0cc':'#eef0dc',rp:L39_EGG}}}
function l81ChoPlant(g,t,o){const cw=cwPick(CW_L81CHO,o),op=l81Op(o),F=l81ChoFl(cw);let nC=0;const mC=o.spine?3:6;
  const cyme=(og,lim,n1,l1)=>{if(!cw.fl||nC>=mC)return null;const p=l81Cyme(og.pos,og.H,lim,{n1,l1:UPC*l1,s1:46,mid:1,w:1.3,pc:'#5e7c40',r:UPC*1.3,
      fl:(P,Z)=>l81Flower(P,Z,F,l81Cl(op*1.25+R(-.5,.12)))});if(p)nC++;return p};
  return l81Sprig(g,t,o,{id:'cho-'+cw.id,len:45,leafy:.8,inter:[4,1.6],nl:2,div:90,ang:[56,44],w0:4.2,w1:1.4,cols:L81_CHST,e:.003,wig:.01,zig:0,twist:6,tip:1,
    br:{zone:[.1,.7],p:.55,max:3,gap:1,n:[2,4],li:2.4,ang:38,eb:.006,ls:.9,wk:.55},
    leaf:(og,lim)=>l81ChoLeaf(og,lim,cw,op),
    node:(og,lim)=>(og.p.q??0)>.62&&rnd()<.55?cyme(og,lim,4,2.8):null,
    apex:(og,lim)=>cyme(og,lim,og.p.b?4:6,3.2)||[l39Ovoid(og.pos,og.H,UPC*.5,Math.max(1.4,og.w*.9),L39_EGG,'#7a9a4a',{zb:.03,eo:.5})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>l39Wood(ch.ord?'#6a8a46':'#5e7044'),null)})}

/* ---------- Brachyglottis (Dunedin Group) 'Sunshine' (syn. Senecio greyi hort., Asteraceae): a mounded New Zealand shrub; young shoots white-felted; leaves alternate, elliptic to
   oblong-oval, 3–7 cm, on a felted petiole of about 1 cm, entire, the margin a little wavy; the upper face grey-green, silvery-felted when young, its margin edged with a white felt;
   the lower face densely white-woolly. In summer loose corymbs (panicles) of 2–3 cm bright yellow daisies (12–15 rays round a yellow disc) over silvery-white woolly buds and involucres.
   Sold for its silver foliage, in bud (the white woolly buds) and in flower ---------- */
const CW_L81BRA=[{id:'argent',n:'Gris argenté',c:'#a9b0a0'},{id:'vert-gris',n:'Vert-de-gris (feuilles adultes)',c:'#8f9a84'},{id:'boutons',n:'Argenté en boutons feutrés',c:'#dcdfd6',bud:1},
  {id:'fleuri',n:'Fleuri jaune (capitules)',c:'#f2c832',fl:1}];
const L81_BRA=prof([[0,.42],[.08,.74],[.25,.96],[.5,1],[.74,.92],[.9,.66],[.97,.34],[1,0]]),L81_BRR=prof([[0,.4],[.2,.9],[.6,1],[.85,.82],[.95,.5],[1,.3]]),L81_BRST=['#8a8c84','#b4b6ac','#d4d6cc','#eceee6'];
function l81BraLeaf(og,lim,cw,op){const q=og.p.q??0,y=l81Cl(op),sz=UPC*5.5*(1-.3*Math.pow(q,1.3))*(og.p.s||1)*R(.85,1.1)*(.58+.42*y),fl=l81Cl(.55*q+.6*(1-y)+R(-.1,.1)),
    c0=cw.id==='vert-gris'?'#6e7a64':'#7c8872',c=mix(mix(c0,shd(c0,R(-.08,.08)),.6),'#c0c6b6',fl*.38),det=DET>=1.5;
  return l81Leaf(og,lim,{sz,wr:.56,wp:L81_BRA,rho:R(40,82),c,cb:'#cdd1c4',pet:UPC*R(.7,1.1)*(.6+.4*y),pw:1.2,pc:'#d4d6cc',
    sh:{arch:.05,fold:.12+.2*(1-y),cup:-.06,droop:.07,curl:-.03,tw:R(-.3,.3),wave:.06,wf:(v,u)=>Math.sin(v*7*Math.PI+(u<0?1.3:0))},
    bo:{nv:det?12:7,mt:.55,ink:'#e4e7de',inkB:'#a6aa9c',ew:det?.7:.55,eo:.8,mid:det?'#d8dccf':null,mo:.55,veins:det?[1,2,3,4,5].map(k=>{const v=.1+.15*k;return[[0,v],[.5,v+.08],[.85,v+.17]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]):null,vc:'#d0d4c6',vo:.3,vw:.28}})}
function l81BraFl(){return{n:12,len:UPC*.95,wr:.4,mt:.5,wp:L81_BRR,c:'#f8d034',cb:'#f6cc3c',r0:UPC*.38,tl0:62,tl1:4,cup:.1,arch:.02,curl:-.04,
  heart:{r:UPC*.42,c:'#e4a822',h:UPC*.1,dome:1},inv:{r:UPC*.5,c:'#d8dcd2'},bud:{len:UPC*.75,w:UPC*.78,c:'#e4e6de',ink:'#a8aca0',rp:v=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.06+.94*v))),.55)}}}
function l81BraPlant(g,t,o){const cw=cwPick(CW_L81BRA,o),op=l81Op(o),F=l81BraFl(),fl=cw.fl||cw.bud;let nC=0;const mC=o.spine?2:3;
  const cyme=(og,lim,big)=>{if(!fl||nC>=mC)return null;const p=l81Cyme(og.pos,og.H,lim,{n1:big?4:3,l1:UPC*(big?3.2:2.4),s1:40,n2:big?2.4:1.8,l2:UPC*1.6,s2:34,mid:1,w:1.5,pc:'#d2d4ca',r:UPC*1.2,
      fl:(P,Z)=>l81Flower(P,Z,F,cw.bud?R(0,.26)*(.6+.4*op):l81Cl(op*1.25+R(-.55,.12)))});if(p)nC++;return p};
  return l81Sprig(g,t,o,{id:'bra-'+cw.id,len:45,leafy:.8,inter:[2.4,1.3],nl:1,div:137.5,ang:[52,40],w0:4.4,w1:1.5,cols:L81_BRST,e:.004,wig:.012,zig:5,twist:10,tip:1,
    br:{zone:[.1,.72],p:.5,max:3,gap:1,n:[3,5],li:1.8,ang:36,eb:.006,ls:.9,wk:.55},
    leaf:(og,lim)=>l81BraLeaf(og,lim,cw,op),
    apex:(og,lim)=>cyme(og,lim,!og.p.b)||[l39Ovoid(og.pos,og.H,UPC*.45,Math.max(1.5,og.w*.9),L39_EGG,'#dfe1d8',{zb:.03,eo:.5,ink:'#9a9e92'})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>l39Wood(ch.ord?'#d6d8ce':'#c8cac0'),null)})}

/* ---------- Leucothoe (Ericaceae): L. axillaris 'Scarletta' and L. fontanesiana 'Rainbow': arching, zigzag stems, red-brown; leaves alternate, held in two ranks along the arch,
   lanceolate, 6–12 cm, long-pointed (acuminate), leathery, finely serrulate, very glossy, on a short petiole; 'Scarletta' opens scarlet and turns dark green, then burgundy in winter;
   'Rainbow' is splashed and marbled cream and pink over green, its young leaves pink-red. White urn flowers in spring are not on the cut foliage. Sold green, red-and-green,
   variegated and winter burgundy ---------- */
const CW_L81LEU=[{id:'vert',n:'Vert luisant',c:'#26442a'},{id:'scarletta',n:'Scarletta (rouge et vert)',c:'#6a1e28',sc:1},{id:'rainbow',n:'Rainbow (panaché crème et rose)',c:'#c9a8a0',rb:1},
  {id:'bordeaux',n:'Bordeaux d’hiver',c:'#4a1824',win:1}];
const L81_LEU=prof([[0,.22],[.06,.56],[.2,.92],[.34,1],[.52,.88],[.72,.56],[.88,.24],[1,0]]);
function l81LeuCol(cw,q,y){const yg=l81Cl(.85*q+.5*(1-y)+R(-.15,.15));
  if(cw.sc)return yg>.55?mix('#8a1c26','#b8262a',R(0,1)):yg>.35?mix('#6a2228','#4a3426',R(0,.6)):mix('#24402a',shd('#24402a',R(-.08,.1)),.5);
  if(cw.win)return mix(mix('#4a1824','#6a2230',R(0,1)),'#3a3424',yg<.3?R(0,.4):0);
  if(cw.rb)return yg>.8?mix('#e8a0a4','#f0c8c0',R(0,1)):mix('#efe4c8','#e8b4b0',R(0,.55));
  return mix(mix('#26442a',shd('#26442a',R(-.08,.12)),.5),'#6a8a3a',yg*.35)}
function l81LeuLeaf(og,lim,cw,op,U0){const q=og.p.q??0,y=l81Cl(op),sz=UPC*9.5*(1-.35*Math.pow(q,1.2))*(og.p.s||1)*R(.85,1.1)*(.58+.42*y),c=l81LeuCol(cw,q,y),det=DET>=1.5,
    rb=!!cw.rb,yr=rb&&h2l(c)[0]<20||rb&&h2l(c)[0]>300,gi=yr?mix('#a8303e','#7a2a30',R(0,1)):mix('#2e5030',shd('#2e5030',R(-.08,.1)),.5),ph=R(0,6.283),fq=R(5,9);
  return l81Leaf(og,lim,{sz,wr:.27,wp:L81_LEU,N:l39Flat(og,R(-.45,.45)+(og.p.b?R(-.3,.3):0),U0),c,cb:mix(shd(c,.12),'#a8b090',.2),pet:UPC*R(.5,.8),pw:1.15,pc:cw.sc||cw.win?'#7a2a22':'#6a4a2a',
    sh:{arch:.05,fold:.24,cup:.02,droop:.12,curl:-.05,tw:R(-.25,.25)},
    bo:{nv:det?12:7,sharp:1,mt:.85,gloss:1,g1:1,mid:det?mix(c,'#f0e8c8',.35):null,mo:.5,
      inner:rb?{P:pal7(gi),PB:pal7(shd(gi,.12)),k:v=>Math.max(0,(.62+.2*Math.sin(v*fq+ph)+.12*Math.sin(v*23+ph*2))*Math.min(1,v*6)*Math.min(1,(1-v)*4))}:null,
      veins:det?[1,2,3,4].map(k=>{const v=.12+.16*k;return[[0,v],[.5,v+.12],[.82,v+.26]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]):null,vc:mix(c,'#f0e8c8',.25),vo:.25,vw:.26}})}
function l81LeuPlant(g,t,o){const cw=cwPick(CW_L81LEU,o),op=l81Op(o),st=cw.sc||cw.win||cw.rb?'#7a2a22':'#6a4a2a';
  return l81Sprig(g,t,o,{id:'leu-'+cw.id,len:50,leafy:.82,inter:[2.8,1.7],nl:1,div:180,ph0:R(75,105),ang:[54,42],w0:3.8,w1:1.3,cols:l39Wood(st),e:-.006,wig:.008,zig:11,twist:6,tip:1.2,
    br:{zone:[.15,.6],p:.35,max:2,gap:2,n:[3,5],li:2.8,ang:34,eb:-.008,ls:.85,wk:.55,dph:0},
    leaf:(og,lim,U0)=>l81LeuLeaf(og,lim,cw,op,U0),
    apex:og=>[l39Ovoid(og.pos,og.H,UPC*.7,Math.max(1.3,og.w*.85),L39_SPIN,cw.id==='vert'?'#6a7a3a':'#a8323a',{zb:.03,eo:.5})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>l39Wood(ch.ord?shd(st,.12):st),null)})}

/* ---------- holly (Ilex aquifolium, Aquifoliaceae, « houx »): stout green to purplish shoots; leaves alternate, ovate-elliptic, 5–9 cm, leathery, dark green and very glossy above,
   paler and matte below, on a short stout petiole; the margin wavy, set with 4–7 sharp spines a side that point alternately up and down (the upper leaves of old trees nearly entire);
   variegated cultivars: 'Argentea Marginata' (a cream margin), 'Aurea Marginata' (a golden margin). Female plants carry their berries (drupes, 7–10 mm), glossy scarlet, crowded
   in tight clusters on very short stalks in the axils of the previous year's wood, a dark stigma at the tip; 'Bacciflava' bears yellow berries. Sold with or without berries ---------- */
const CW_L81HOU=[{id:'baies',n:'Vert sombre à baies rouges',c:'#1c3a1e',b:'#c41420'},{id:'vert',n:'Vert sombre (sans baies)',c:'#22402a'},
  {id:'argente',n:'Panaché crème à baies (Argentea Marginata)',c:'#c4c69a',vr:'#eee8c4',b:'#c41420'},{id:'dore',n:'Panaché doré (Aurea Marginata)',c:'#b8b04a',vr:'#e0c44e',b:'#c8221e'},
  {id:'baies-jaunes',n:'Vert à baies jaunes (Bacciflava)',c:'#e8b42a',b:'#eab828'}];
const L81_HOU=prof([[0,.3],[.08,.62],[.25,.92],[.45,1],[.65,.92],[.82,.66],[.94,.3],[1,0]]),L81_HOST=['#22301a','#3a4a28','#56663c','#7e8c5c'];
/* the spined margin: ns spines a side from v0 to v1 (the tip a spine too), concave sinuses between them; the rows of the outline fall on every spine so its point stays sharp;
   wf raises and lowers the spines alternately (the wave of the blade) */
function l81HouSpec(ns,dd){const v0=.2,v1=.86,dv=(v1-v0)/Math.max(1,ns-1),vs=[0,.07,.14];
  for(let k=0;k<ns;k++){const a=v0+k*dv;vs.push(a);if(k<ns-1)vs.push(a+dv*.12,a+dv*.3,a+dv*.5,a+dv*.7,a+dv*.88);else vs.push(a+(1-a)*.15,a+(1-a)*.35,a+(1-a)*.55,a+(1-a)*.75,a+(1-a)*.9)}vs.push(1);
  const seg=v=>{if(v<=v0)return null;if(v>=v1)return{k:ns-1,x:(v-v1)/(1-v1)};const k=Math.min(ns-2,Math.floor((v-v0)/dv));return{k,x:(v-v0-k*dv)/dv}};
  const wp=(v,u)=>{const e=L81_HOU(v),s=seg(v);if(!s)return e;const x=s.x,sp=Math.max(0,1-Math.min(x,1-x)/.05)*.08;return e*(1-dd*Math.pow(Math.sin(Math.PI*Math.min(1,x)),.75)+sp)};
  const wf=(v,u)=>v<=v0?v/v0:Math.cos(Math.PI*(v-v0)/dv)*(u<0?-1:1);return{vs,wp,wf}}
function l81HouLeaf(og,lim,cw,op){const q=og.p.q??0,y=l81Cl(op),sz=UPC*6.6*(1-.25*Math.pow(q,1.3))*(og.p.s||1)*R(.85,1.1)*(.5+.5*y),det=DET>=1.5,
    yg=l81Cl(.6*q+.5*(1-y)+R(-.1,.1)),g0=mix(mix('#1c3a1e',shd('#1c3a1e',R(-.06,.12)),.5),'#5a8a3a',yg*.35),ns=(rnd()<.15?3:4)+(rnd()*3|0),Sp=l81HouSpec(ns,R(.12,.2)),
    vr=cw.vr,c=vr?mix(vr,shd(vr,R(-.06,.04)),.5):g0;
  return l81Leaf(og,lim,{sz,wr:.54,wp:Sp.wp,rho:R(40,80),c,cb:vr?mix(vr,'#c8c4a0',.3):mix(g0,'#8a9a6a',.4),pet:UPC*R(.6,1),pw:1.4,pc:'#4a5a2a',
    sh:{arch:.05,fold:.2,cup:-.04,droop:.05,curl:-.02,tw:R(-.2,.2),wave:R(.2,.3),wf:Sp.wf},
    bo:{vs:Sp.vs,poly:1,sharp:1,mt:.9,gloss:1.2,g1:1,ink:'#0e1a0e',eo:.5,mid:det?mix(g0,'#c8d0a0',.4):null,mo:.5,
      inner:vr?{P:pal7(g0),PB:pal7(mix(g0,'#8a9a6a',.4)),k:v=>Math.max(0,.66+.1*Math.sin(v*11+q*7))*Math.min(1,v*5)*Math.min(1,(1-v)*3.5)}:null,
      veins:det?[1,2,3,4].map(k=>{const v=.12+.17*k;return[[0,v],[.45,v+.08],[.75,v+.18]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]):null,vc:mix(g0,'#c8d0a0',.3),vo:.22,vw:.26}})}
/* a cluster of berries in an axil: three to eight, crowded round the node on very short stalks (never finer than 1.15), ripening green to scarlet */
function l81HouBerries(og,lim,cw,op){const sd=l81Side(og),n=4+(rnd()*6|0),y=l81Cl(op),r=UPC*R(.36,.44)*(.8+.2*Math.min(1,y*1.5)),pl=UPC*R(.35,.55),parts=[],m=l81Cl(y*1.4+.1),dt=DET>=1.5;
  const X=V3.nz(V3s(og.U,V3.sc(sd,V3.dot(og.U,sd)))),Y=V3.cr(sd,X),O=[];
  for(let j=0;j<n;j++){const a=j/n*6.283+R(-.3,.3),k=j?R(.55,.95):.1,d=V3.nz(V3.add(V3.add(V3.sc(sd,1),V3.sc(og.H,.25)),V3.add(V3.sc(X,Math.cos(a)*k),V3.sc(Y,Math.sin(a)*k))));
    O.push(V3.add(og.pos,V3.sc(d,og.w*.4+pl+r*.55)))}
  if(lim!=null&&O.some(p=>-p[1]+r>lim))return null;
  let d='',z=0;for(const p of O){d+=`M${f(og.pos[0])},${f(-og.pos[1])}L${f(p[0])},${f(-p[1])}`;z+=p[2]}
  parts.push({z:z/n-.2,cast:false,fn:par=>E('path',{d,stroke:'#4a5a2a','stroke-width':1.2,'stroke-linecap':'round',fill:'none'},par)});
  for(const p of O){const ax=V3.nz(V3s(p,og.pos)),col=mix(m>=1?cw.b:mix('#7a9a3a',cw.b,m),shd(cw.b,-.2),R(0,.25));
    parts.push({z:p[2]+.02,fn:par=>bzFruit(par,p,ax,r,r,col,{gl:.95,big:3.6,ink:shd(cw.b,-.7),eye:dt?(k2,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.1),cy:f(tp[1]+a[1]*r2*.1),rx:f(r2*.18),ry:f(r2*.18*Math.max(.35,Math.abs(a[2]))),fill:'#241a14',opacity:.8},k2):null})})}
  return parts}
function l81HouPlant(g,t,o){const cw=cwPick(CW_L81HOU,o),op=l81Op(o);let nB=0;const mB=o.spine?4:7;
  return l81Sprig(g,t,o,{id:'hou-'+cw.id,len:45,leafy:.82,inter:[2.2,1.5],nl:1,div:137.5,ang:[58,46],w0:4.6,w1:1.5,cols:L81_HOST,e:.003,wig:.01,zig:6,twist:10,tip:1,
    br:{zone:[.08,.75],p:.65,max:4,gap:1,n:[3,6],li:2,ang:40,eb:.004,ls:.9,wk:.55},
    leaf:(og,lim)=>l81HouLeaf(og,lim,cw,op),
    node:(og,lim)=>{if(!cw.b||nB>=mB||op<.2)return null;const q=og.p.q??0;if((og.p.b?q<.6:q>.12&&q<.75)&&rnd()<.5){const p=l81HouBerries(og,lim,cw,op);if(p){nB++;return p}}return null},
    apex:og=>[l39Ovoid(og.pos,og.H,UPC*.45,Math.max(1.4,og.w*.9),L39_EGG,'#4a6a2a',{zb:.03,eo:.5})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>l39Wood(ch.ord?'#4a6a2c':'#4a5634'),null)})}

/* ---------- holm oak (Quercus ilex, Fagaceae, « chêne vert », « yeuse »): young shoots grey-felted; leaves alternate, small (3–7 cm), leathery, elliptic to lanceolate, entire or with
   a few small spiny teeth (on young and vigorous shoots), the margin a little rolled under; dark green and somewhat glossy above, grey-white felted below, on a felted petiole of
   about 1 cm. Acorns 1.5–3 cm, one to three on a short felted peduncle, a third to a half of the nut set in a cupule of felted, appressed grey scales; green, then brown.
   Sold green, with acorns in autumn ---------- */
const CW_L81QIL=[{id:'vert',n:'Vert sombre',c:'#26402a'},{id:'glands',n:'Vert sombre à glands',c:'#6a5a34',ac:1},{id:'argent',n:'Jeunes pousses argentées',c:'#9ea392',yg:1}];
const L81_QIL=prof([[0,.4],[.1,.76],[.3,.98],[.48,1],[.68,.9],[.86,.58],[.96,.24],[1,0]]),L81_QIST=['#4a4640','#6c665c','#8e887c','#b4ae9e'];
function l81QilLeaf(og,lim,cw,op){const q=og.p.q??0,y=l81Cl(op),sz=UPC*4.3*(1-.28*Math.pow(q,1.3))*(og.p.s||1)*R(.82,1.12)*(.58+.42*y),det=DET>=1.5,
    yg=l81Cl(.8*q+.6*(1-y)+(cw.yg?.35:0)-.25+R(-.1,.1)),c=mix(mix('#24402a',shd('#24402a',R(-.08,.1)),.5),'#8e9682',yg*.6),tooth=rnd()<(cw.yg?.45:.25),Sp=tooth?l81HouSpec(3+(rnd()*2|0),R(.08,.14)):null;
  return l81Leaf(og,lim,{sz,wr:.5,wp:Sp?Sp.wp:L81_QIL,rho:R(55,85),c,cb:'#b2b4a4',pet:UPC*R(.6,1)*(.6+.4*y),pw:1.2,pc:'#8a8476',
    sh:{arch:.05,fold:.12,cup:-.1,droop:.06,curl:-.02,tw:R(-.3,.3),wave:Sp?.12:0,wf:Sp?Sp.wf:null},
    bo:{vs:Sp?Sp.vs:null,poly:Sp?1:0,sharp:1,mt:.8,gloss:.7,g1:0,mid:det?mix(c,'#d8dcc8',.4):null,mo:.5,
      veins:det?[1,2,3,4,5].map(k=>{const v=.1+.14*k;return[[0,v],[.5,v+.07],[.85,v+.15]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]):null,vc:mix(c,'#d8dcc8',.3),vo:.25,vw:.26}})}
/* acorns at a node: on a short felted peduncle, one to three, the nut green ripening to brown in a felted grey cupule (lot 39's acorn) */
function l81QilAcorns(og,lim,op){const y=l81Cl(op),parts=[],sd=l81Side(og),pl=UPC*R(.6,1.2),d0=V3.nz(V3.add(V3.sc(og.H,.5),V3.sc(sd,.85))),P0=og.pos,P1=V3.add(P0,V3.sc(d0,pl*.6)),
    P2=V3.add(V3.add(P1,V3.sc(d0,pl*.4)),[0,-pl*.25,0]),na=1+(rnd()<.45)+(rnd()<.15),len=UPC*R(1.9,2.4)*(.55+.45*y),nut=y<.7?mix('#8a9a46','#9a8a46',y/.7):mix('#9a8a46','#7a5426',(y-.7)/.3);
  if(lim!=null&&-Math.min(P2[1],P0[1])+len*1.4>lim)return null;
  const wp=Math.max(1.25,og.w*.34),pc='#8a8474';
  parts.push({z:(P0[2]+P2[2])/2,cast:false,fn:par=>E('path',{d:`M${f(P0[0])},${f(-P0[1])}Q${f(P1[0])},${f(-P1[1])} ${f(P2[0])},${f(-P2[1])}`,stroke:pc,'stroke-width':f(wp),'stroke-linecap':'round',fill:'none'},par)});
  for(let j=0;j<na;j++){const a=(j-(na-1)/2)*.9+R(-.2,.2),dz=V3.nz(V3.add(V3.add(V3.sc(d0,.7),[0,-.6,0]),V3.add(V3.sc(sd,Math.sin(a)*.6),V3.sc(og.H,Math.cos(a)*.2)))),
      mid=j===((na-1)/2|0),base=V3.add(P2,V3.sc(V3.nz(V3.add(d0,V3.sc(sd,Math.sin(a)))),mid?0:len*.12));
    if(!mid)parts.push({z:base[2],cast:false,fn:par=>E('path',{d:`M${f(P2[0])},${f(-P2[1])}L${f(base[0])},${f(-base[1])}`,stroke:pc,'stroke-width':f(wp),'stroke-linecap':'round'},par)});
    l39Acorn(base,dz,len,false,nut,'#a8a290',parts)}
  return parts}
function l81QilPlant(g,t,o){const cw=cwPick(CW_L81QIL,o),op=l81Op(o);let nA=0;const mA=o.spine?3:5;
  return l81Sprig(g,t,o,{id:'qil-'+cw.id,len:50,leafy:.8,inter:[1.6,.95],nl:1,div:144,ang:[56,42],w0:4.4,w1:1.3,cols:L81_QIST,e:.003,wig:.012,zig:7,twist:12,tip:1,
    br:{zone:[.05,.8],p:.72,max:6,gap:1,n:[4,8],li:1.4,ang:42,eb:.004,ls:.9,wk:.52},
    leaf:(og,lim)=>l81QilLeaf(og,lim,cw,op),
    node:(og,lim)=>{if(!cw.ac||nA>=mA||op<.25)return null;if((og.p.q??0)>.25&&rnd()<.35){const a=l81QilAcorns(og,lim,op);if(a){nA++;return a}}return null},
    apex:og=>[l39Ovoid(og.pos,og.H,UPC*.4,Math.max(1.3,og.w*.9),L39_EGG,'#8a7a5a',{scales:3,zb:.03,eo:.55})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>l39Wood(ch.ord?'#a29c8e':'#7c766a'),(P,W)=>DET>=1.5?l39Lenti(P,W,.05,'#c4beb0',{l0:.12,l1:.25,w:.4,op:.5}):null)})}

/* ---------- registries: drawers, colourways, trade grades (the length of the cut stem, cm), and how the composer treats them: foliage stems along their spine ---------- */
Object.assign(GH,{'choisya-ternata-oranger-du-mexique':l81ChoPlant,'brachyglottis-sunshine':l81BraPlant,'leucothoe':l81LeuPlant,'ilex-aquifolium-houx':l81HouPlant,'quercus-ilex-chene-vert':l81QilPlant});
Object.assign(CWS,{'choisya-ternata-oranger-du-mexique':CW_L81CHO,'brachyglottis-sunshine':CW_L81BRA,'leucothoe':CW_L81LEU,'ilex-aquifolium-houx':CW_L81HOU,'quercus-ilex-chene-vert':CW_L81QIL});
Object.assign(SZG,{'choisya-ternata-oranger-du-mexique':[40,50,50,60],'brachyglottis-sunshine':[40,50,50,60],'leucothoe':[40,50,60,60,70],'ilex-aquifolium-houx':[40,50,50,60,70],'quercus-ilex-chene-vert':[40,50,60,60,70]});
const L81_I=(len,o={})=>Object.assign({form:'feuillage',size:1.2,k:'plant',rk:.6,self:len*UPC,fx:18},o);
Object.assign(GHI,{'choisya-ternata-oranger-du-mexique':L81_I(45),'brachyglottis-sunshine':L81_I(45),'leucothoe':L81_I(50,{fx:20}),'ilex-aquifolium-houx':L81_I(45),'quercus-ilex-chene-vert':L81_I(50,{fx:20})});
