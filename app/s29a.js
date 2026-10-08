/* ================= Serre, lot 29 — branches fleuries et bois : cerisier hâtif, cognassier du Japon, forsythia, saule à chatons, cornouiller à bois coloré ================= */
/* des rameaux ligneux poussés par le L-système : l'axe et ses rameaux (ramification, écorce lustrée, lenticelles, nœuds en zigzag, épines), et à chaque nœud ses organes à leur âge
   (écailles, boutons, fleurs qui s'ouvrent, fleurs ouvertes ; chatons sous l'écaille, argentés, puis jaunes d'étamines ; bourgeons opposés) ;
   dans le Composer ce sont des lignes qui suivent l'épine (o.spine) et renvoient {k,bw,bc}, comme les épis de s8a.js ; les fleurs sont peu coûteuses (pétales fusionnés au détail de l'appli) */
const b29C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
/* ---------- a woody shoot grown by the L-system in the straight frame of its axis (x its right, y up it, z its front), then laid along the axis A0 (the composer's spine, or the frame of the view):
   an axis is a list of nodes (S.nodes(L) for the main one, lat.nodes(len) for a side shoot); each node carries organs and perhaps side shoots, which are axes in their turn:
     A(ax,i<n) → F(l_i − l_i−1) [ /φ_i+δ_j &α_j O(j) ]_j  [ /φ_i+δ_m &β_m A(lat_m,0) ]_m  +κ_i  A(ax,i+1)        A(ax,n) → F(L − l_n−1) Tb
   F tapers from w0 at the base of the axis to w1 at its tip and is pulled up its path by e (a side shoot with e < 0 arches away, as forsythia's); κ the zigzag at a node.
   It returns the chains laid in view space (pts, widths) and the organs (pos, H their direction, U, L, the node and the axis they belong to, a their fraction along it) ---------- */
function b29Grow(o,Lt,S){const A0=spAxis(o,Lt,!o.spine&&S.arch?(()=>{const B=frameOf(o,0),a=S.arch;return{C:[[0,0,0],[a*.03*Lt,.45*Lt,0],[a*.2*Lt,.9*Lt,0],[a*.5*Lt,.98*Lt,0]].map(p=>toV(B,p)),Fr:toV(B,[0,0,1])}})():{face:S.face,bow:S.bow}),L=A0.L,main={N:S.nodes(L),L,e:S.e,w0:S.w,w1:S.w1??S.w*.3,wig:S.wig,m:1};
  const Fm=(ax,l0,l1)=>['F',{l:Math.max(.5,l1-l0),e:ax.e,wig:ax.wig,w0:ax.w0+(ax.w1-ax.w0)*l0/ax.L,w1:ax.w0+(ax.w1-ax.w0)*l1/ax.L}];
  const rules={A:p=>{const ax=p.ax,i=p.i,N=ax.N,lp=i?N[i-1].l:0;if(i>=N.length)return[Fm(ax,lp,ax.L),['Tb',{ax}]];const nd=N[i],out=[Fm(ax,lp,nd.l)];
    (nd.org||[]).forEach((og,j)=>out.push(['[',{}],['/',{a:nd.phi+(og.dphi||0)}],['&',{a:og.a}],['O',{ax,nd,og,j}],[']',{}]));
    for(const t of nd.lats||[]){const la={N:t.nodes(t.len),L:t.len,e:t.e,w0:t.w,w1:t.w1??Math.min(t.w,1.1),wig:t.wig??ax.wig};out.push(['[',{w:t.w}],['/',{a:nd.phi+(t.dphi||0)}],['&',{a:t.a}],['A',{ax:la,i:0}],[']',{}])}
    if(nd.kink)out.push(['+',{a:nd.kink}]);out.push(['A',{ax,i:i+1}]);return out}};
  const res=lsTurtle(lsDerive([['A',{ax:main,i:0}]],rules,400),{p:[0,0,0],H:[0,1,0],U:[0,0,1],wig:S.wig,seg:S.seg||9,T:[0,1,0],e:S.e,w:S.w}),c0=res.chains[0],kY=L/Math.max(1,c0.pts[c0.pts.length-1][1]);
  const fAt=y=>A0.at(A0.sOf(y*kY)),lay=q=>{const f=fAt(q[1]);return V3.add(V3.add(f.p,V3.sc(f.Sd,q[0])),V3.sc(f.Fr,q[2]))},
    dir=(v,y)=>{const f=fAt(y);return V3.nz(V3.add(V3.add(V3.sc(f.Sd,v[0]),V3.sc(f.T,v[1])),V3.sc(f.Fr,v[2])))};
  const chains=res.chains.map(ch=>({pts:ch.pts.map(lay),ws:ch.ws,ord:ch.ord})),organs=res.organs.map(og=>({t:og.t,p:og.p,pos:lay(og.pos),H:dir(og.H,og.pos[1]),U:dir(og.U,og.pos[1]),L:dir(og.L,og.pos[1]),
    a:og.p.nd?og.p.nd.l/og.p.ax.L:1,main:og.p.ax===main}));
  return{A0,L,chains,organs}}
/* ---------- the wood: each chain cut into pieces in the painter's order, each piece smoothed (Catmull-Rom) and running one point into the next, shaded like the bouquet stems;
   cols(q, chain) its colours along it (q from its base), deco(par,P,W) its marks (lenticels, thorn bases) drawn with it ---------- */
function b29Wood(parts,chains,cols,o={}){const mx=o.piece||8;for(const ch of chains){const n=ch.pts.length;if(n<2)continue;
  for(let a=0;a<n-1;a+=mx-1){const b=Math.min(n-1,a+mx),P=[],W=[];let z=0;
    for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2];if(i===a){P.push([q[0],-q[1]]);W.push(ch.ws[i]);continue}
      const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[.5]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
        P.push([cr(0),-cr(1)]);W.push((ch.ws[i-1]+ch.ws[i])/2)}P.push([q[0],-q[1]]);W.push(ch.ws[i])}
    const c=typeof cols==='function'?cols(a/(n-1),ch):cols;parts.push({z:z/(b-a+1)+(o.zb||0),fn:par=>{stemPoly(par,P,W,c);if(o.deco&&!LOD)o.deco(par,P,W,ch)}})}}}
/* marks along a piece of wood: every step units a short stroke across it (lenticels of cherry and birch), or along it (k=0) */
function b29Marks(par,P,W,step,col,o={}){let d='',acc=R(0,step);for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;acc+=l;
  while(acc>=step){acc-=step*R(.7,1.3);const t=1-acc/l,x=a[0]+dx*t,y=a[1]+dy*t,w=W[i]*(o.k??.55)*R(.6,1.1),nx=-dy/l,ny=dx/l,off=(o.off??.15)*W[i]*R(-1,1);
    if(o.along){const h=w*.5;d+=`M${f(x+nx*off-dx/l*h)},${f(y+ny*off-dy/l*h)}l${f(dx/l*h*2)},${f(dy/l*h*2)}`}else d+=`M${f(x+nx*(off-w/2))},${f(y+ny*(off-w/2))}l${f(nx*w)},${f(ny*w)}`}}
  if(d)E('path',{d,stroke:col,'stroke-width':o.sw||.6,'stroke-opacity':o.so??.55,fill:'none','stroke-linecap':'round'},par)}
/* ---------- a petal (or a lobe) in the frame of its flower (z along the flower's axis): its outline, x across (half width W·wp(v)), y along its length Lp, from the ring r0 at the angle phi;
   it rises from the plane at a0 at its base to a1 at its tip (radians: 0 flat, π/2 along the axis), dished across by cu, its tip rounded over ht of its length and notched by nt ---------- */
function b29Petal(B,O,phi,r0,Lp,W,a0,a1,wp,o={}){const c=Math.cos(phi),s=Math.sin(phi),nt=o.nt||0,cu=o.cu||0,ht=o.ht??.12,q=[];
  const at=(x,y)=>{const v=y/Lp,am=a0+(a1-a0)*v*.5,rho=r0+y*Math.cos(am),h=y*Math.sin(am)+cu*x*x/W;return PJ(B,O,[c*rho-s*x,s*rho+c*x,h])};
  const V=[0,.14,.32,.5,.66,.8,1-ht],wt=W*wp(1-ht);for(const v of V)q.push(at(-W*wp(v),v*Lp));
  for(const th of[.84,.68,.5,.32,.16]){const u=Math.cos(th*Math.PI),y=Lp*(1-ht+ht*Math.sin(th*Math.PI))-(nt&&Math.abs(u)<.34?nt*Lp*(1-Math.abs(u)/.34):0);q.push(at(u*wt,y))}
  for(let i=V.length-1;i>=0;i--)q.push(at(W*wp(V[i]),V[i]*Lp));
  const am=a0+(a1-a0)*.55,n=toV(B,[-c*Math.sin(am),-s*Math.sin(am),Math.cos(am)]);let z=0;for(const p of q)z+=p[2];
  const P=q.map(p=>[p[0],p[1]]);if(sArea(P)<0)P.reverse();return{P,z:z/q.length,n}}
/* a corolla drawn far to near: the petals showing their inner face, then the centre (disc, stamens), then the petals showing their back; at the app's detail the petals of each side
   are one path (their own edges still drawn), so a flower costs a handful of elements; cols(i) the colour of petal i (a variegated flower), colB the back of the petals */
function b29Corolla(par,B,O,sp,cache){const det=DET>=1.5,inn=[],out=[],n=sp.n,rot=sp.rot||0;
  for(let i=0;i<n;i++){const ph=rot+i*6.283/n+(sp.jit?R(-sp.jit,sp.jit):0),pt=b29Petal(B,O,ph,sp.r0,sp.L*(sp.jl?R(1-sp.jl,1):1),sp.W,sp.a0,sp.a1,sp.wp,sp),inner=pt.n[2]>=-.02,c=sp.cols?sp.cols(i):sp.col;
    pt.c=inner?c:(sp.colB||mix(c,'#e4dccc',.18));pt.I=.28+.68*b29C(lightI(inner?pt.n:V3.sc(pt.n,-1))*(inner?sp.ao??.94:1),0,1.1);(inner?inn:out).push(pt)}
  const tone=(c,I)=>{const k=c+'|'+Math.round(I*16);return cache[k]||(cache[k]=toneAt(pal7(c),I))},ink=sp.ink||shd(sp.col,-.42);
  const draw=L=>{L.sort((a,b)=>a.z-b.z);if(det||L.length<2||sp.cols||sp.sep)for(const p of L)E('path',{d:smooth(p.P),fill:tone(p.c,p.I),stroke:ink,'stroke-width':.35,'stroke-opacity':.5},par);
    else{let I=0;for(const p of L)I+=p.I;E('path',{d:L.map(p=>smooth(p.P)).join(''),fill:tone(L[0].c,I/L.length),stroke:ink,'stroke-width':.3,'stroke-opacity':.28},par)}};
  draw(inn);if(sp.centre&&inn.length)sp.centre(par,B,O,inn.length/n);draw(out)}
/* the stamens of a flower: n filaments from the ring r0 out to r1 and up to h, their anthers (dots of radius ar); at the app's detail only the anthers */
function b29Stamens(par,B,O,o){let d='',a='';const ar=o.ar||.5;for(let i=0;i<o.n;i++){const t=i*2.39996+R(-.2,.2),rr=o.r1*R(.7,1),hh=o.h*R(.75,1.05),p0=PJ(B,O,[Math.cos(t)*o.r0,Math.sin(t)*o.r0,o.h*.1]),p1=PJ(B,O,[Math.cos(t)*rr,Math.sin(t)*rr,hh]);
    d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`;a+=`M${f(p1[0]-ar)},${f(p1[1])}a${ar},${ar} 0 1,0 ${f(ar*2)},0a${ar},${ar} 0 1,0 ${f(-ar*2)},0`}
  if(DET>=1.5&&o.fc)E('path',{d,stroke:o.fc,'stroke-width':o.fw||.35,fill:'none','stroke-linecap':'round','stroke-opacity':.85},par);E('path',{d:a,fill:o.ac},par)}
/* a disc in the flower's plane at height z0 (its mouth, its centre) */
function b29Disc(par,B,O,r,z0,col,o={}){E('path',{d:smooth(spDisc(B,O,r,z0,12)),fill:col,stroke:o.ink||'none','stroke-width':.3,'stroke-opacity':.5},par)}
/* a body of revolution along local Z (bud, catkin, bud scale): radius rad·prof(t) over t from t0 to t1 of its length len, as its projected hull */
function b29Rev(B,O,len,rad,prof,t0=0,t1=1,nv=8,na=10){const pts=[];for(let i=0;i<=nv;i++){const t=t0+(t1-t0)*i/nv,r=rad*prof(t);for(let j=0;j<na;j++){const a=j/na*6.283,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,t*len]);pts.push([p[0],p[1]])}}return hull2(pts)}
const B29_EGG=t=>Math.pow(Math.sin(Math.PI*Math.min(.995,.04+.96*t)),.55)*(1-.18*t),B29_CONE=t=>Math.pow(Math.sin(Math.PI*Math.min(.995,.03+.97*t)),.6)*(1-.55*t);
/* a pedicel: a short curved stroke from a to b (view space), bending toward up */
function b29Ped(par,a,b,w,col,bend=.18){const A=[a[0],-a[1]],B=[b[0],-b[1]],l=Math.hypot(B[0]-A[0],B[1]-A[1]);if(l<.6)return;const c=[A[0]+(B[0]-A[0])*.5,A[1]+(B[1]-A[1])*.5+l*bend];
  E('path',{d:`M${f(A[0])},${f(A[1])}Q${f(c[0])},${f(c[1])} ${f(B[0])},${f(B[1])}`,stroke:col,'stroke-width':f(w),fill:'none','stroke-linecap':'round'},par)}
/* a direction spread round d by up to k (its two perpendiculars u, v), turned a little toward dw (gravity, light) */
const b29Spread=(d,u,v,ang,k,dw=[0,0,0])=>V3.nz(V3.add(V3.add(V3.add(d,V3.sc(u,Math.cos(ang)*k)),V3.sc(v,Math.sin(ang)*k)),dw));
/* a small ovate leaf seen at an organ (young leaves of the flowering quince): its base at p, along the projection of H, its midrib */
function b29Leaf(par,p,H,U,len,col){const h=[H[0],-H[1]],hl=Math.max(.3,Math.hypot(h[0],h[1])),ang=Math.atan2(h[1],h[0]),face=.3+.7*Math.abs(U[2]),Lp=len*hl,W=len*.27*face,P=pal7(col),
    g=G(par,{transform:`translate(${f(p[0])},${f(-p[1])}) rotate(${f(ang/D)})`});
  E('path',{d:`M0,0C${f(Lp*.2)},${f(-W*1.1)} ${f(Lp*.7)},${f(-W*1.05)} ${f(Lp)},0C${f(Lp*.7)},${f(W*1.05)} ${f(Lp*.2)},${f(W*1.1)} 0,0Z`,fill:toneAt(P,.48+.3*face),stroke:P.d2,'stroke-width':.35,'stroke-opacity':.6},g);
  if(DET>=1.5||len>14)E('path',{d:`M0,0Q${f(Lp*.5)},${f(W*.08)} ${f(Lp*.95)},0`,stroke:P.l1,'stroke-width':.4,fill:'none','stroke-opacity':.7},g)}
/* the nodes of an axis of length L, from l0 to l1 of it, every step (a range in units, shrinking toward the tip by k), with phyllotaxis dphi; mk(node, i, q) fills its organs */
function b29Nodes(L,l0,l1,step,dphi,mk,k=.75){const N=[];let l=L*l0,i=0;const ph0=R(0,360);while(l<L*l1){const q=l/L,nd={l,phi:ph0+i*dphi+R(-12,12)};mk(nd,i,q);N.push(nd);l+=R(step[0],step[1])*(1-(1-k)*q);i++}return N}

/* ---------- cerisiers hâtifs à fleurs simples (Prunus × yedoensis, × incam 'Okame', incisa, × subhirtella, 'Keio-zakura'): leafless shoots of glossy red-brown bark barred with pale horizontal lenticels;
   along them short spurs, each a cluster (an umbel) of 2–4 flowers on slender pedicels out of brown bud scales; the flower single, 2.5–3 cm, five rounded petals notched at the tip,
   a red-brown calyx cup with reflexed sepals, some thirty stamens with yellow anthers round a centre that reddens as the flower ages; round pink buds; the youngest at the tips ---------- */
const B29_CER=[{id:'keio',n:'Rose (Keio-zakura)',c:'#f0b2c3',eye:'#c8466a'},{id:'okame',n:'Rose tendre (Okame)',c:'#f6d5de',eye:'#c8506e'},
 {id:'yoshino',n:'Ivoire rosé (Somei-yoshino)',c:'#f8e8eb',eye:'#c04a66'},{id:'blanc',n:'Blanc (Prunus incisa)',c:'#fbf8f5',eye:'#b9a04c'}];
const B29_WP_CER=prof([[0,.28],[.15,.55],[.45,.92],[.75,1],[.95,.8],[1,.6]]);
function b29CherryFl(par,B,O,Df,cw,op,cache){const Rr=Df/2,nz=B[2][2],pk=mix(cw.c,'#e890aa',.25),cal='#7a3a2c';
  if(nz<0){b29Corolla(par,B,O,{n:5,r0:Rr*.1,L:Rr*.88,W:Rr*.4,a0:.12+(1-op)*.9,a1:.32+(1-op)*1.1,wp:B29_WP_CER,nt:.07,cu:.12,ht:.18,col:cw.c,colB:mix(cw.c,cw.eye,.18),rot:R(0,1.2),jit:.08,jl:.08},cache);
    const cp=b29Rev(B,O,-Rr*.36,Rr*.2,t=>.55+.45*t,0,1,4,8);E('path',{d:smooth(cp),fill:cal,stroke:'#3a1a14','stroke-width':.3,'stroke-opacity':.6},par);
    let d='';for(let j=0;j<5;j++){const a=(j*72+36)*D,b=PJ(B,O,[Math.cos(a)*Rr*.16,Math.sin(a)*Rr*.16,-Rr*.3]),e=PJ(B,O,[Math.cos(a)*Rr*.42,Math.sin(a)*Rr*.42,-Rr*.42]);d+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`}
    E('path',{d,stroke:cal,'stroke-width':f(Math.max(.6,Rr*.09)),'stroke-linecap':'round',fill:'none'},par);return}
  b29Corolla(par,B,O,{n:5,r0:Rr*.1,L:Rr*.88,W:Rr*.4,a0:.12+(1-op)*.9,a1:.32+(1-op)*1.1,wp:B29_WP_CER,nt:.07,cu:.12,ht:.18,col:cw.c,colB:mix(cw.c,cw.eye,.18),rot:R(0,1.2),jit:.08,jl:.08,
    centre:(par,B,O)=>{b29Disc(par,B,O,Rr*.17,Rr*.04,mix(cw.eye,'#e8d890',op>.9?.15:.45));b29Stamens(par,B,O,{n:DET>=1.5?26:16,r0:Rr*.12,r1:Rr*.36*(.6+.4*op),h:Rr*.3,fc:mix(cw.c,'#fff4f0',.5),ac:'#e8b838',ar:Math.max(.35,Rr*.045)})}},cache)}
function b29Cherry(g,t,o){const cw=cwPick(B29_CER,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=2.7*UPC*R(.95,1.05),SC=['#2e1410','#5e2c22','#82483a','#c8988a'],w0=sp?6:Math.min(9,3+Lt/110),lo=sp?.34:.1,pc='#6e4a30',sc='#5a2a1e';
  const nLat=o.short?0:rnd()<.2?1:rnd()<.6?2:3,cl=(nd,i,q)=>{if(rnd()<.84)nd.org=[{a:R(42,62),n:rnd()<.3?2:rnd()<.7?3:4}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.03,e:.05,seg:9,w:w0,w1:1.1,nodes:L=>{const N=b29Nodes(L,lo,.96,[3.6*UPC,4.8*UPC],144,(nd,i,q)=>{cl(nd,i,q);nd.kink=R(-4,4)});
    const cand=N.filter(nd=>nd.l>L*(sp?.42:.22)&&nd.l<L*.74);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
      nd.lats=[{len:L*R(.2,.36)*(1-.4*q)*(sp?.8:1),a:R(26,40),e:.045,w:Math.max(1.6,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.16,.95,[3.2*UPC,4.2*UPC],144,cl)}]}
    return N}});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,7,'#d8c0b0',{k:.5,sw:.55,so:.5})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+.2,fn:par=>E('path',{d:smooth(b29Rev(B,pos,Df*.24,Df*.13,B29_CONE)),fill:budFill('#6a3226'),stroke:'#2a120c','stroke-width':.3},par)});continue}
    const nF=og.p.og.n,sl=Df*.18,se=V3.add(pos,V3.sc(og.H,sl)),Bs=spFrame(og.H,[0,1,0],0);
    /* the spur and its brown bud scales, behind the flowers */
    parts.push({z:pos[2]+.05,fn:par=>{b29Ped(par,pos,se,Math.max(1,w0*.22),'#5a2a20',0);E('path',{d:smooth(b29Rev(Bs,V3.add(pos,V3.sc(og.H,sl*.5)),sl*.65,Df*.1,t=>.5+.5*Math.sin(Math.PI*t))),fill:sc,stroke:'#2a120c','stroke-width':.3,'stroke-opacity':.6},par)}});
    for(let j=0;j<nF;j++){const age=.28+op*1.07-.42*og.a+R(-.22,.18)-.06*j;if(age<.06&&j>0)continue;
      const ps=age<.08?.25:age<.4?.55:1,pd=b29Spread(og.H,og.U,og.L,j*6.283/nF+R(-.4,.4),R(.55,.95),[0,.12,0]),pl=R(1.1,2)*UPC*ps,b=V3.add(V3.add(se,V3.sc(pd,pl)),[0,-pl*.18*ps,0]),
        ax=V3.nz(V3.add(pd,[R(-.15,.15),-.12,R(0,.2)])),B=spFrame(ax,[0,1,0],R(-.3,.3));
      if(age<.08){parts.push({z:b[2],fn:par=>{E('path',{d:smooth(b29Rev(B,V3.add(se,V3.sc(pd,Df*.03)),Df*.22,Df*.15,B29_EGG)),fill:budFill(mix('#7a3a28',cw.c,.3)),stroke:'#2a120c','stroke-width':.3,'stroke-opacity':.6},par)}});continue}
      if(age<.4){const bs=Df*(.24+.22*(age-.08)/.32),bc=mix(cw.c,'#e07898',cw.id==='blanc'?.25:.45);
        parts.push({z:b[2],fn:par=>{b29Ped(par,se,b,.75,pc);spBud(par,B,b,bs,bs*.86,bc,{tp:.25,pw:.55});const cp=b29Rev(B,b,-bs*.22,bs*.3,t=>1-.55*t,0,1,3,8);E('path',{d:smooth(cp),fill:'#7a3a2c',stroke:'#3a1a14','stroke-width':.3,'stroke-opacity':.5},par)}});continue}
      const h=b29C((age-.4)/.3,.25,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,se,b,.75,pc);b29CherryFl(par,B,b,Df*(.8+.2*h),cw,h,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- cognassier du Japon (Chaenomeles speciosa, C. × superba): stiff dark grey-brown shoots that zigzag from node to node, armed with short sharp thorns (the spurs of their nodes);
   flowers 3.5–4.5 cm, in tight clusters of 1–3 almost sessile against the old wood, five rounded petals in a cup, a dense boss of forty-odd golden stamens round five styles;
   round coloured buds; here and there a tuft of young bronze-green leaves; the colours of the trade, and the variegated 'Toyo-Nishiki' (white, pink and red on one branch) ---------- */
const B29_COG=[{id:'corail',n:'Corail saumoné (Salmon Horizon)',c:'#ec7a5e'},{id:'rouge',n:'Rouge écarlate (Crimson and Gold)',c:'#c42a2c'},{id:'rose',n:'Rose (Pink Lady)',c:'#ee9fae'},
 {id:'blanc',n:'Blanc (Nivalis)',c:'#fbf6f1'},{id:'saumon',n:'Saumon abricot (× superba)',c:'#f19a7e'},{id:'orange',n:'Orange vif (Orange Trail)',c:'#ec6430',f:'x'},
 {id:'toyo',n:'Panaché blanc, rose et rouge (Toyo-Nishiki)',c:'#f4c4c8',f:'toyo'}];
const B29_WP_COG=prof([[0,.3],[.12,.62],[.4,.98],[.7,1],[.9,.86],[1,.7]]),B29_TOYO=['#fbf3ef','#f6c8cc','#ee9aa8','#d23c48'];
function b29QuinceFl(par,B,O,Df,c,op,cache,o={}){const Rr=Df/2,nz=B[2][2],cols=o.toyo?(()=>{const m=rnd()<.6?pick(B29_TOYO):null;return i=>m||B29_TOYO[(i+(rnd()<.5?0:1))%4]})():null,
    sp={n:5,r0:Rr*.1,L:Rr*.86,W:Rr*.5,a0:.5+(1-op)*.75,a1:.95+(1-op)*.5,wp:B29_WP_COG,cu:.2,ht:.2,sep:1,col:c,colB:mix(c,'#f0e0d0',.15),cols,rot:R(0,1.2),jit:.1,jl:.06,ao:.9};
  if(nz<-.05){b29Corolla(par,B,O,sp,cache);E('path',{d:smooth(b29Rev(B,O,-Rr*.2,Rr*.26,t=>1-.45*t,0,1,3,8)),fill:'#5a4a2a',stroke:'#2a2010','stroke-width':.3,'stroke-opacity':.6},par);return}
  sp.centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.2,Rr*.1,'#c8b860');b29Stamens(par,B,O,{n:DET>=1.5?40:22,r0:Rr*.13,r1:Rr*.3,h:Rr*.32,fc:'#f0e0a0',ac:'#e8b020',ar:Math.max(.4,Rr*.05)});
    if(DET>=1.5)b29Disc(par,B,O,Rr*.06,Rr*.34,'#b8c070')};b29Corolla(par,B,O,sp,cache)}
/* a thorn: a slim cone from the node along H */
function b29Thorn(par,p,H,len,w,col){const a=[p[0],-p[1]],h=[H[0],-H[1]],hl=Math.hypot(h[0],h[1])||1,l=len*Math.max(.25,hl),u=[h[0]/hl,h[1]/hl],n=[-u[1],u[0]];
  E('path',{d:`M${f(a[0]+n[0]*w)},${f(a[1]+n[1]*w)}Q${f(a[0]+u[0]*l*.4+n[0]*w*.3)},${f(a[1]+u[1]*l*.4+n[1]*w*.3)} ${f(a[0]+u[0]*l)},${f(a[1]+u[1]*l)}Q${f(a[0]+u[0]*l*.4-n[0]*w*.3)},${f(a[1]+u[1]*l*.4-n[1]*w*.3)} ${f(a[0]-n[0]*w)},${f(a[1]-n[1]*w)}Z`,fill:col,stroke:'#1a100c','stroke-width':.3,'stroke-opacity':.6},par)}
function b29Quince(g,t,o){const cw=cwPick(B29_COG,o),toyo=cw.f==='toyo',op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||70)*UPC,
    Df=3.9*UPC*R(.95,1.05),SC=['#22160f','#47342a','#665044','#a08a7a'],w0=sp?6:Math.min(8.5,3+Lt/100),lo=sp?.34:.1,lc='#6e7a34';
  const nLat=o.short?1:rnd()<.3?2:3;let zz=rnd()<.5?1:-1;
  const node=(nd,i,q)=>{zz=-zz;nd.kink=zz*R(10,18);const r=rnd();nd.org=[];if(r<.62)nd.org.push({a:R(55,75),k:'fl',n:rnd()<.35?1:rnd()<.7?2:3});else if(r<.82)nd.org.push({a:R(50,70),k:'th'});
    if(rnd()<.22)nd.org.push({a:R(30,45),k:'lf',dphi:R(60,120)})};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.05,.05),wig:.02,e:.008,seg:8,w:w0,w1:1.3,nodes:L=>{const N=b29Nodes(L,lo,.95,[2.4*UPC,3.4*UPC],180,node,.85);
    const cand=N.filter(nd=>nd.l>L*(sp?.42:.2)&&nd.l<L*.75);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
      nd.lats=[{len:L*R(.16,.32)*(1-.4*q)*(sp?.8:1),a:R(42,58),e:.02,w:Math.max(1.6,w0*.45*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.14,.92,[2.2*UPC,3*UPC],180,node,.85)}]}
    return N}});
  b29Wood(parts,P.chains,SC,{piece:8,deco:(par,Pp,W)=>b29Marks(par,Pp,W,11,'#8a7a6a',{k:.35,sw:.5,so:.45,along:1})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+.2,fn:par=>E('path',{d:smooth(b29Rev(B,pos,Df*.14,Df*.09,B29_CONE)),fill:budFill('#5a3a2a'),stroke:'#1a100c','stroke-width':.3},par)});continue}const ok=og.p.og.k;
    if(ok==='th'){parts.push({z:pos[2]+og.H[2]*2,fn:par=>b29Thorn(par,pos,og.H,R(.8,1.4)*UPC,Math.max(.7,w0*.12),'#3a2a20')});continue}
    if(ok==='lf'){const n=rnd()<.5?2:3;for(let j=0;j<n;j++){const H=b29Spread(og.H,og.U,og.L,j*2.4+R(-.3,.3),.5,[0,.25,0]),len=R(1.4,2.6)*UPC*(.6+.4*op);
      parts.push({z:pos[2]+H[2]*len*.4,fn:par=>b29Leaf(par,pos,H,og.U,len,mix(lc,'#8a4a2a',R(.1,.45)))})}continue}
    const nF=og.p.og.n;for(let j=0;j<nF;j++){const age=op*1.3-.4*og.a+R(-.25,.2)-.08*j;const pd=b29Spread(og.H,og.U,og.L,j*6.283/nF+R(-.4,.4),R(.5,.85),[0,.1,0]),
      c=toyo?pick(B29_TOYO):cw.c,ps=age<.35?.5:1,b=V3.add(pos,V3.sc(pd,Df*.12*ps)),ax=V3.nz(V3.add(pd,[R(-.1,.1),0,R(.05,.25)])),B=spFrame(ax,[0,1,0],R(-.3,.3));
      if(age<.35){const bs=Df*(.22+.22*b29C(age/.35)),bc=mix(c,'#d05a48',toyo||cw.id==='blanc'?.12:.2);parts.push({z:b[2],fn:par=>{b29Ped(par,pos,b,1,'#4a3a2a',0);spBud(par,B,V3.add(b,V3.sc(ax,-bs*.12)),bs,bs*.92,bc,{tp:.15,pw:.5});
        E('path',{d:smooth(b29Rev(B,b,-bs*.18,bs*.3,t=>1-.5*t,0,1,3,8)),fill:'#5a4a2a',stroke:'#2a2010','stroke-width':.3,'stroke-opacity':.5},par)}});continue}
      const h=b29C((age-.35)/.3,.25,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,pos,b,1.2,'#4a3a2a',0);b29QuinceFl(par,B,b,Df*(.82+.18*h),c,h,cache,{toyo})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- forsythia (Forsythia × intermedia): long arching shoots, olive-tan and warted with corky lenticels, the nodes opposite and crossing; at each node, out of the pair of buds,
   one to three bright yellow flowers before the leaves: a short tube and four strap-shaped lobes, spreading in a little bell, nodding on a short pedicel, orange lines in the throat;
   the youngest at the tips are still pointed yellow-green buds. The old drawing cost some 8 000 elements a branch: here a flower is two or three paths ---------- */
const B29_FOR=[{id:'or',n:'Jaune d\'or (× intermedia Spectabilis)',c:'#eebc22'},{id:'vif',n:'Jaune vif (Lynwood Gold)',c:'#f3cf33'}];
const B29_WP_FOR=prof([[0,.5],[.15,.85],[.5,1],[.8,.9],[1,.62]]);
function b29ForsFl(par,B,O,Df,c,op,cache){const Rr=Df/2,nz=B[2][2],tl=Rr*.42,tr=Rr*.18,top=V3.add(O,toV(B,[0,0,tl]));
  const tb=tubeFlat(B,O,[[0,0,0],[0,0,tl*.5],[0,0,tl]],tr*.55,tr,toneAt(pal7(mix(c,'#c8a020',.2)),.55),{ink:shd(c,-.5),eo:.4}),
    sp={n:4,r0:tr*.9,L:Rr*.95,W:Rr*.26,a0:.95-.45*op+(1-op)*.4,a1:.55-.4*op+(1-op)*.8,wp:B29_WP_FOR,cu:.12,ht:.22,col:c,colB:mix(c,'#d8c060',.12),rot:R(0,1.6),jit:.12,jl:.1,ao:.9,
      centre:DET>=1.5?(par,B,O)=>{let d='';for(let j=0;j<4;j++){const a=sp.rot+j*1.5708,p0=PJ(B,O,[0,0,-tl*.3]),p1=PJ(B,O,[Math.cos(a)*tr*1.6,Math.sin(a)*tr*1.6,tr*.5]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
        E('path',{d,stroke:'#d8781a','stroke-width':.45,'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},par)}:null};
  if(nz>=0){tb.fn(par);b29Corolla(par,B,top,sp,cache)}else{b29Corolla(par,B,top,sp,cache);tb.fn(par)}}
function b29Forsythia(g,t,o){const cw=cwPick(B29_FOR,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||90)*UPC,
    Df=2.9*UPC*R(.95,1.05),SC=['#3e3220','#7a6a44','#9a8a5e','#cfc096'],w0=sp?5.5:Math.min(8,2.6+Lt/110),lo=sp?.34:.08,pc='#6a7a34',sd=rnd()<.5?1:-1;
  const nLat=o.short?0:rnd()<.3?1:rnd()<.7?2:3;
  const node=(nd,i,q)=>{nd.org=[];for(const s of[0,180])if(rnd()<.94)nd.org.push({dphi:s,a:R(48,66),n:rnd()<.55?1:rnd()<.8?2:3})};
  const P=b29Grow(o,Lt,{face:R(-.5,.5),arch:sd*R(.6,.9),wig:.02,e:0,seg:9,w:w0,w1:1,nodes:L=>{const N=b29Nodes(L,lo,.97,[2.6*UPC,3.4*UPC],90,node,.8);
    const cand=N.filter(nd=>nd.l>L*(sp?.4:.15)&&nd.l<L*.6);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
      nd.lats=[{len:L*R(.3,.48)*(1-.4*q)*(sp?.75:1),a:R(24,36),e:sp?.005:-.03,dphi:R(-40,40)+(rnd()<.5?90:-90),w:Math.max(1.5,w0*.5*(1-.4*q)),nodes:Ll=>b29Nodes(Ll,.1,.96,[2.4*UPC,3.2*UPC],90,node,.8)}]}
    return N}});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,9,'#5a4a2c',{k:.22,sw:.8,so:.5,along:1,off:.5})});
  const down=[0,-1,0];
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+.2,fn:par=>spBud(par,B,pos,Df*.22,Df*.12,'#8a9a3a',{tp:.6,pw:.6})});continue}
    const nF=og.p.og.n;for(let j=0;j<nF;j++){const age=.12+op*1.25-.5*og.a+R(-.2,.15)-.06*j,ps=age<.3?.6:1,pd=b29Spread(og.H,og.U,og.L,j*2.1+R(-.3,.3),nF>1?.45:.15,[0,-.2,0]),pl=Df*.16*ps,b=V3.add(pos,V3.sc(pd,pl));
      if(age<.3){const bs=Df*(.24+.22*b29C(age/.3)),B=spFrame(V3.nz(V3.add(pd,[0,.15,0])),[0,1,0],0),bc=mix(cw.c,'#9aa83a',.55-1.2*b29C(age/.3)*.4);
        parts.push({z:b[2],fn:par=>{b29Ped(par,pos,b,.8,pc,0);spBud(par,B,b,bs,bs*.42,bc,{tp:.65,pw:.6})}});continue}
      const ax=V3.nz(V3.add(V3.sc(pd,.55),V3.add(V3.sc(down,.75),[R(-.2,.2),0,R(0,.3)]))),B=spFrame(ax,V3.sc(pd,-1),R(-.4,.4)),h=b29C((age-.3)/.3,.25,1);
      parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,pos,b,.8,pc,0);b29ForsFl(par,B,b,Df*(.85+.15*h),cw.c,h,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- saule à chatons (Salix caprea, S. discolor; S. gracilistyla 'Mount Aso' et 'Melanostachys'): smooth, glossy red-brown to purplish shoots, the buds alternate,
   each under a single cap-like scale; the catkin pushes it off (a brown scale at its foot, or still on its tip), an ovoid 2–3.5 cm covered with silky silver hairs among dark-tipped bracts;
   the male catkins then flower, their stamens out of the silk, yellow with pollen (red-anthered on the black willow) ---------- */
const B29_SAL=[{id:'argent',n:'Argent (Salix caprea)',c:'#c9c7c2'},{id:'blanc',n:'Blanc soyeux (S. discolor)',c:'#f2efe8'},{id:'noir',n:'Noir (S. gracilistyla Melanostachys)',c:'#2b2a2c',an:'#c8303a'},
 {id:'rose',n:'Rose (S. gracilistyla Mount Aso)',c:'#e6b7c4'},{id:'rouge',n:'Rouge (chatons teintés)',c:'#b8343a'},{id:'jaune',n:'Jaune pollen (chatons mâles en fleur)',c:'#e8cf4a',y:1}];
const B29_CAT=t=>{const u=2*Math.min(.985,Math.max(.015,t))-1;return Math.pow(1-u*u,.4)*(1-.12*t)};
/* silk: a soft matt sheen, lit from the upper left, never the glint of a bud */
const B29_SF={};function b29Silk(c){const id=B29_SF[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='bs'+(gid++),gr=E('radialGradient',{id:nid,cx:.4,cy:.36,r:.72},GDEF||defs);stops(gr,[[0,mix(c,'#ffffff',.42)],[.45,mix(c,'#ffffff',.12)],[.85,c],[1,shd(c,-.28)]]);B29_SF[c]=nid;return`url(#${nid})`}
function b29Catkin(par,B,O,len,rad,cw,st,o={}){const sc=o.sc||'#5e2418',body=cw.y?'#d8d4b4':cw.c,hair=cw.id==='noir'?'#9a98a0':mix(body,'#ffffff',.6);
  if(st<.25){/* still under its scale: the silk just showing at the tip of a glossy cap */const k=st/.25;
    E('path',{d:smooth(b29Rev(B,O,len,rad*.86,B29_CAT,.35,1,5,8)),fill:b29Silk(body),stroke:hair,'stroke-width':.8,'stroke-dasharray':'.5 .8','stroke-opacity':.8},par);
    E('path',{d:smooth(b29Rev(B,O,len*(.62-.22*k),rad,t=>.8+.25*Math.sin(Math.PI*Math.min(1,t*1.1)),0,1,5,8)),fill:budFill(sc),stroke:'#200a06','stroke-width':.3,'stroke-opacity':.6},par);return}
  const q=b29Rev(B,O,len,rad,B29_CAT,0,1,7,10);E('path',{d:smooth(q),fill:b29Silk(body),stroke:hair,'stroke-width':.9,'stroke-dasharray':'.4 .6','stroke-opacity':.7},par);
  /* the silk: a few light strokes along the lit side; the dark tips of the bracts, scattered on the visible side */
  let d='',dt='';const nh=DET>=1.5?9:5;for(let i=0;i<nh;i++){const tt=R(.12,.75),a=R(1.6,3.4),r=rad*B29_CAT(tt),p0=PJ(B,O,[Math.cos(a)*r*.75,Math.sin(a)*r*.75,len*tt]),p1=PJ(B,O,[Math.cos(a)*r*.8,Math.sin(a)*r*.8,len*(tt+.14)]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
  E('path',{d,stroke:cw.id==='noir'?'#8a8a90':'#ffffff','stroke-width':.55,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par);
  const nd=DET>=1.5?18:10,ar=Math.max(.28,rad*.06);for(let i=0;i<nd;i++){const tt=R(.12,.9),a=R(0,6.283),r=rad*B29_CAT(tt)*R(.7,.92),nv=toV(B,[Math.cos(a),Math.sin(a),0]);if(nv[2]<.2)continue;
    const p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,len*tt]);dt+=`M${f(p[0]-ar)},${f(p[1])}a${f(ar)},${f(ar)} 0 1,0 ${f(ar*2)},0a${f(ar)},${f(ar)} 0 1,0 ${f(-ar*2)},0`}
  if(dt)E('path',{d:dt,fill:cw.id==='noir'?'#151416':'#4a3026',opacity:.5},par);
  /* in flower: the stamens out of the silk all over its visible side, their anthers */
  if(o.male){let fl='',an='';const na=DET>=1.5?64:38,r2=Math.max(.45,rad*.12);for(let i=0;i<na;i++){const tt=R(.05,.95),a=R(0,6.283),r=rad*B29_CAT(tt),nv=toV(B,[Math.cos(a),Math.sin(a),0]);if(nv[2]<-.15)continue;
      const h=R(.95,1.18),p0=PJ(B,O,[Math.cos(a)*r*.8,Math.sin(a)*r*.8,len*tt]),p1=PJ(B,O,[Math.cos(a)*r*h,Math.sin(a)*r*h,len*(tt+.02)]);fl+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`;
      an+=`M${f(p1[0]-r2)},${f(p1[1])}a${f(r2)},${f(r2)} 0 1,0 ${f(r2*2)},0a${f(r2)},${f(r2)} 0 1,0 ${f(-r2*2)},0`}
    if(DET>=1.5)E('path',{d:fl,stroke:'#f0ead0','stroke-width':.35,'stroke-opacity':.8,fill:'none'},par);E('path',{d:an,fill:o.an||'#f0cc2a',stroke:shd(o.an||'#f0cc2a',-.4),'stroke-width':.2},par)}
  /* the shed scale, still at its foot on some */
  if(o.scale)E('path',{d:smooth(b29Rev(B,O,len*.12,rad*.5,t=>.8+.2*Math.sin(Math.PI*t),0,1,3,8)),fill:sc,stroke:'#200a06','stroke-width':.3,'stroke-opacity':.6},par)}
function b29Willow(g,t,o){const cw=cwPick(B29_SAL,o),op=b29C(o.op??R(.6,1),.05,1),k=G(g),parts=[],sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    SC=cw.id==='noir'||cw.id==='rose'?['#24161a','#4a2e30','#6a4446','#a88084']:['#2e1210','#62302a','#864a3a','#c88e7c'],w0=sp?5.5:Math.min(8,2.6+Lt/110),lo=sp?.34:.1,Lc=2.8*UPC*R(.92,1.08);
  const nLat=o.short?0:rnd()<.25?1:rnd()<.65?2:3,node=(nd,i,q)=>{if(rnd()<.86)nd.org=[{a:R(16,28)}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.06,.06),wig:.025,e:.06,seg:9,w:w0,w1:1,nodes:L=>{const N=b29Nodes(L,lo,.96,[2.8*UPC,3.8*UPC],144,node,.7);
    const cand=N.filter(nd=>nd.l>L*(sp?.4:.2)&&nd.l<L*.72);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;nd.org=[];
      nd.lats=[{len:L*R(.24,.42)*(1-.4*q)*(sp?.8:1),a:R(18,30),e:.06,w:Math.max(1.5,w0*.45*(1-.4*q)),nodes:Ll=>b29Nodes(Ll,.14,.95,[2.6*UPC,3.4*UPC],144,node,.7)}]}
    return N}});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,16,'#c8a090',{k:.25,sw:.6,so:.35,along:1})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+.2,fn:par=>E('path',{d:smooth(b29Rev(B,pos,Lc*.22,Lc*.12,B29_CONE)),fill:budFill('#6a2a1c'),stroke:'#200a06','stroke-width':.3},par)});continue}
    const age=.12+op*1.15-.35*og.a+R(-.18,.12),st=b29C(age),len=Lc*(st<.25?.42+.5*st:.55+.5*st)*R(.85,1.1),rad=len*(st<.25?.3:.34),H=V3.nz(V3.add(og.H,[0,.06,0])),B=spFrame(H,[0,1,0],R(0,6)),
      male=st>.8&&cw.id!=='rouge'&&(cw.y?rnd()<.85:cw.id==='noir'?rnd()<.4:rnd()<.2);
    parts.push({z:pos[2]+H[2]*len*.5,fn:par=>b29Catkin(par,B,pos,len,rad,cw,st,{male,an:cw.an,scale:rnd()<.3})})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- cornouiller à bois coloré (Cornus alba 'Sibirica', 'Kesselringii'; C. sericea 'Flaviramea'; C. sanguinea 'Midwinter Fire'): straight, smooth, glossy one-year stems,
   leafless; the buds opposite and crossing, slim and pressed to the stem, each over a crescent leaf scar on a slightly swollen node; a pointed terminal bud; few side shoots,
   in opposite pairs. 'Midwinter Fire' passes from yellow-orange at its foot to flame red at its tips. A graphic line ---------- */
const B29_COR=[{id:'sibirica',n:'Rouge corail (C. alba Sibirica)',c:'#b8402e',c0:'#a8442e',c1:'#c83a2a'},{id:'kessel',n:'Pourpre noir (C. alba Kesselringii)',c:'#3a2232',c0:'#2e1c28',c1:'#5a2434'},
 {id:'flavi',n:'Jaune vert (C. sericea Flaviramea)',c:'#a8b04a',c0:'#98a040',c1:'#b4b84e'},{id:'midwinter',n:'Orange flamme (C. sanguinea Midwinter Fire)',c:'#e0782a',c0:'#d8a03a',c1:'#cc3a26'}];
function b29Dogwood(g,t,o){const cw=cwPick(B29_COR,o),op=b29C(o.op??R(.6,1),.05,1),k=G(g),parts=[],sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||90)*UPC,w0=sp?6:Math.min(9,3+Lt/110),lo=sp?.3:.06,
    Lb=.7*UPC*(.8+.35*op),bcol=mix(cw.c1,'#3a1a1a',cw.id==='kessel'?.2:.38),CC={};
  const colAt=q=>{const c=mix(cw.c0,cw.c1,Math.pow(q,1.3)),key=Math.round(q*6);if(CC[key])return CC[key];const P=pal7(c);return CC[key]=[P.d1,P.b,P.l1,mix(P.l2,'#ffffff',.35)]};
  const nLat=o.short?0:rnd()<.55?0:1,node=(nd,i,q)=>{nd.org=[{a:R(8,14)},{a:R(8,14),dphi:180}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.03,.03),wig:.006,e:.08,seg:10,w:w0,w1:1.6,nodes:L=>{const N=b29Nodes(L,lo,.96,[4.2*UPC,5.6*UPC],90,node,.6);
    const cand=N.filter(nd=>nd.l>L*(sp?.45:.35)&&nd.l<L*.7);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L,ln=L*R(.18,.3)*(1-.3*q);
      nd.org=[];nd.lats=[0,180].map(s=>({len:ln*R(.8,1.1),a:R(30,40),e:.05,dphi:s,w:Math.max(1.6,w0*.4),w1:1.2,nodes:Ll=>b29Nodes(Ll,.2,.9,[3.4*UPC,4.4*UPC],90,node,.6)}))}
    return N}});
  const gL=P.chains[0].pts.length;b29Wood(parts,P.chains,(q,ch)=>colAt(ch.ord?.75+.25*q:q),{piece:10,deco:(par,Pp,W)=>b29Marks(par,Pp,W,24,'#e8d8c0',{k:.14,sw:.7,so:.4,along:1,off:.4})});
  const bud=(par,p,H,len,w,c)=>{const a=[p[0],-p[1]],h=[H[0],-H[1]],hl=Math.hypot(h[0],h[1])||1,l=len*Math.max(.3,hl),u=[h[0]/hl,h[1]/hl],n=[-u[1],u[0]];
    E('path',{d:`M${f(a[0]+n[0]*w)},${f(a[1]+n[1]*w)}C${f(a[0]+u[0]*l*.45+n[0]*w*1.15)},${f(a[1]+u[1]*l*.45+n[1]*w*1.15)} ${f(a[0]+u[0]*l*.8+n[0]*w*.4)},${f(a[1]+u[1]*l*.8+n[1]*w*.4)} ${f(a[0]+u[0]*l)},${f(a[1]+u[1]*l)}C${f(a[0]+u[0]*l*.8-n[0]*w*.4)},${f(a[1]+u[1]*l*.8-n[1]*w*.4)} ${f(a[0]+u[0]*l*.45-n[0]*w*1.15)},${f(a[1]+u[1]*l*.45-n[1]*w*1.15)} ${f(a[0]-n[0]*w)},${f(a[1]-n[1]*w)}Z`,
      fill:c,stroke:shd(c,-.5),'stroke-width':.3,'stroke-opacity':.7},par)};
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<26)continue;
    if(og.t==='Tb'){parts.push({z:pos[2]+.3,fn:par=>bud(par,pos,og.H,Lb*1.5,1.1,bcol)});continue}
    const w=og.p.ax.w0+(og.p.ax.w1-og.p.ax.w0)*og.a,base=V3.add(pos,V3.sc(og.H,w*.35)),H=og.H;
    /* the leaf scar: a pale crescent under the bud, round the stem */
    parts.push({z:pos[2]+H[2]*w*.5,fn:par=>{const p=[base[0],-base[1]],h=[H[0],-H[1]],hl=Math.hypot(h[0],h[1])||1;if(DET>=1.5||w>3){const s=w*.5;E('path',{d:`M${f(p[0]-h[1]/hl*s*.2-h[0]/hl*s*.1)},${f(p[1]+h[0]/hl*s*.2-h[1]/hl*s*.1)}l${f(-h[0]/hl*s*.3)},${f(-h[1]/hl*s*.3)}`,stroke:'#d8c8a8','stroke-width':.6,'stroke-opacity':.55,'stroke-linecap':'round'},par)}
      bud(par,base,H,Lb*R(.85,1.1),Math.max(.7,w*.18),bcol)}})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:colAt(0)}}

/* ---------- the branches in the greenhouse registers: colourways, trade lengths (cm), composer infos (lines along the spine: tip = stiffness, fx = reach of the organs) ---------- */
Object.assign(GH,{'cerisiers-hatifs-fleurs-simples':b29Cherry,'cognassier-du-japon':b29Quince,'forsythia':b29Forsythia,'saule-a-chatons':b29Willow,'cornouiller-a-bois-colore':b29Dogwood});
CWS['cerisiers-hatifs-fleurs-simples']=B29_CER;SZG['cerisiers-hatifs-fleurs-simples']=[60,80,80,100,120];GHI['cerisiers-hatifs-fleurs-simples']={form:'ligne',size:1,k:'plant',self:75*UPC,tip:.55,fx:3*UPC};
CWS['cognassier-du-japon']=B29_COG;SZG['cognassier-du-japon']=[50,60,60,70,80];GHI['cognassier-du-japon']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.7,fx:3.5*UPC};
CWS['forsythia']=B29_FOR;SZG['forsythia']=[60,80,80,100,120];GHI['forsythia']={form:'ligne',size:1,k:'plant',self:85*UPC,tip:false,fx:3*UPC};
CWS['saule-a-chatons']=B29_SAL;SZG['saule-a-chatons']=[50,60,60,80,100];GHI['saule-a-chatons']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.8,fx:2*UPC};
CWS['cornouiller-a-bois-colore']=B29_COR;SZG['cornouiller-a-bois-colore']=[60,80,80,100,120];GHI['cornouiller-a-bois-colore']={form:'ligne',size:1,k:'plant',self:85*UPC,tip:1,fx:1.5*UPC};
