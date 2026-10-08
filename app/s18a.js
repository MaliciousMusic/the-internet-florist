/* ================= Serre, lot 18 — Lignes : branches et graminées — saule tortueux, herbe à l'ours, liriope, herbe d'acier, stipe pennée ================= */
/* ---------- a line grows upright in its own frame (y along its axis, x to its right, z toward its front), pushed by the L-system, then it is laid along its axis:
   the composer's spine in a bouquet, the frame of the view on a sheet or a card. W maps a point of that frame, Wv a direction at a point ---------- */
function lnAxis(o,Lt,opt={}){const A=spAxis(o,Lt,{face:opt.face??R(-.9,.9),bow:opt.bow});
  A.W=q=>{const l=q[1],f=A.at(A.sOf(l));let p=f.p;if(l>A.L)p=V3.add(p,V3.sc(f.T,l-A.L));else if(l<0)p=V3.add(p,V3.sc(f.T,l));return V3.add(V3.add(p,V3.sc(f.Sd,q[0])),V3.sc(f.Fr,q[2]))};
  A.Wv=(q,d)=>V3.nz(V3s(A.W(V3.add(q,V3.sc(d,.5))),A.W(V3s(q,V3.sc(d,.5)))));return A}
/* in a bouquet a line keeps to its spine: tight in the mouth, within Rm of it higher up, never below the mouth (in its own frame) */
function lnHug(q,L,Rm){const r=Math.hypot(q[0],q[2]),lim=2.5+(Rm-2.5)*sm01(q[1]/(L*.4));if(r>1e-6){const k=lim*Math.tanh(r/lim)/r;q[0]*=k;q[2]*=k}if(q[1]<1)q[1]=1;return q}
/* and in the view nothing hangs further below its own point of the spine than the composer cleared under it (fd = its fx), nothing at all near the mouth */
function lnSink(A,q,P,L,fd){const C=A.W([0,q[1],0]),dy=P[1]-C[1];if(dy>=0)return P;const lim=fd*sm01(q[1]/(L*.35));P[1]=C[1]-(lim>.3?lim*Math.tanh(-dy/lim):0);return P}
const lnLerp=(a,b,t)=>Array.isArray(a)?a.map((x,i)=>x+(b[i]-x)*t):a+(b-a)*t;
/* a polyline smoothed (Catmull-Rom, two points between each pair), with its values (numbers or vectors) carried along */
function lnSub(P,vals=[]){const n=P.length,Q=[],V=vals.map(()=>[]);
  for(let i=0;i<n;i++){if(i){const p0=P[Math.max(0,i-2)],p1=P[i-1],p2=P[i],p3=P[Math.min(n-1,i+1)];
      for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t;Q.push([0,1,2].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));vals.forEach((a,k)=>V[k].push(lnLerp(a[i-1],a[i],t)))}}
    Q.push(P[i]);vals.forEach((a,k)=>V[k].push(a[i]))}return[Q,...V]}
/* ---------- a strap blade (grass blade, lily-grass leaf) along a 3D centreline: P points (view space, y up), U its face normals, W widths, V 0 at the base … 1 at the tip
   (th: its thickness seen edge on — in a bouquet never so thin that the blade would seem to break where it turns).
   On the screen it is its centreline offset across its own tangent by the projected half-width — never thinner than its thickness th —, cut where the visible face turns
   (the blade seen edge on), then into short pieces for the painter's order; each piece lit by its own normal: the upper face with o.pal(v), the under face with o.palB(v) ---------- */
function lnRibbon(P0,U0,W0,V0,o,parts){const[P,U,W,V]=lnSub(P0,[U0,W0,V0]),n=P.length;if(n<2)return;const th=o.th??.4,S=P.map(p=>[p[0],-p[1]]),h=[],nm=[],I=[],sp=[];let pn=[1,0];
  for(let i=0;i<n;i++){const a=Math.max(0,i-1),b=Math.min(n-1,i+1),T=V3.nz(V3s(P[b],P[a])),u=V3.nz(U[i]),Bv=V3.nz(V3.cr(T,u)),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],l=Math.hypot(dx,dy);
    if(l>1e-6)pn=[-dy/l,dx/l];nm.push(pn);const hh=(Bv[0]*pn[0]-Bv[1]*pn[1])*W[i]/2,nf=hh>=0?u:V3.sc(u,-1),ef=Math.min(1,Math.abs(hh)/(th*1.4));h.push(hh);I.push(lightI(nf)*ef+.3*(1-ef));sp.push(Math.pow(Math.max(0,V3.dot(nf,HV3)),o.shin||24))}
  /* knots [i,t] (t of the way to i+1); where the face turns, a knot where the projected width crosses zero ends one run and starts the next */
  const runs=[];let cur=null;for(let i=0;i<n;i++){const s=h[i]>=0;if(!cur){cur={s,k:[[i,0]]};runs.push(cur);continue}
    if(s!==cur.s){const t=h[i-1]/(h[i-1]-h[i]);cur.k.push([i-1,t]);cur={s,k:[[i-1,t]]};runs.push(cur)}cur.k.push([i,0])}
  /* pieces: at most m knots, and a new piece wherever the light has changed enough that one tone would show a step (a twisting blade gets short pieces) */
  const at=([i,t],A)=>t?lnLerp(A[i],A[i+1],t):A[i],m=o.piece||12,dI=o.dI||.07;
  for(const r of runs){let a=0;while(a<r.k.length-1){let b=a+1;const I0=at(r.k[a],I);while(b<r.k.length-1&&b-a<m-1&&Math.abs(at(r.k[b],I)-I0)<dI)b++;const K=r.k.slice(a,Math.min(r.k.length,b+2));/* one knot over into the next piece: no seam between them */let z=0;for(const q of K)z+=at(q,P)[2];
    const C=K.map(q=>at(q,S)),N=K.map(q=>V3.nz([...at(q,nm),0])),Hh=K.map(q=>Math.max(Math.abs(at(q,h)),th/2)),Iq=K.map(q=>at(q,I)),Vq=K.map(q=>at(q,V)),Sq=K.map(q=>at(q,sp));
    parts.push({z:z/K.length+(o.zb||0),fn:par=>lnBand(par,C,N,Hh,Iq,Vq,Sq,r.s,o)});a=b}}}
/* one piece of a blade: its outline filled with its tone (a gradient along it on the sheets), a variegated margin, the midrib, a glint, the inked edges */
function lnBand(par,C,N,H,I,V,Sp,front,o){const n=C.length,side=k=>C.map((c,i)=>[c[0]+N[i][0]*H[i]*k,c[1]+N[i][1]*H[i]*k]),out=k=>pD(side(k).concat(side(-k).reverse()))+'Z';
  const vm=V.reduce((s,x)=>s+x,0)/n,Im=I.reduce((s,x)=>s+x,0)/n,pal=front?o.pal(vm):o.palB(vm),a=C[0],b=C[n-1],ax=b[0]-a[0],ay=b[1]-a[1],al=ax*ax+ay*ay;
  const fill=P=>{if(DET<1.5||LOD||al<64)return toneAt(P,Im);const st=C.map((c,i)=>[Math.max(0,Math.min(1,((c[0]-a[0])*ax+(c[1]-a[1])*ay)/al)),toneAt(P,I[i])]).sort((p,q)=>p[0]-q[0]);return ugrad(a[0],a[1],b[0]+.01,b[1],st)};
  if(o.var){E('path',{d:out(1),fill:fill(pal7(o.var))},par);E('path',{d:out(.56),fill:fill(pal)},par)}else E('path',{d:out(1),fill:fill(pal)},par);
  if(LOD)return;const wm=Math.max(...H);
  if(o.mid&&DET>=1.5&&wm>1)E('path',{d:pD(C),fill:'none',stroke:front?pal.d1:pal.l1,'stroke-width':f(Math.min(.45,wm*.16)),'stroke-opacity':front?.45:.5,'stroke-linecap':'round'},par);
  if(o.gloss&&front){let d='',run=[];const flush=()=>{if(run.length>1)d+=pD(run);run=[]};for(let i=0;i<n;i++){if(Sp[i]>.3)run.push([C[i][0]+N[i][0]*H[i]*.2,C[i][1]+N[i][1]*H[i]*.2]);else flush()}flush();
    if(d)E('path',{d,fill:'none',stroke:'#ffffff','stroke-width':f(Math.max(.3,wm*.42)),'stroke-opacity':f(Math.min(.55,o.gloss*Math.max(...Sp))),'stroke-linecap':'round'},par)}
  if((DET>=1.5||o.pale)&&wm>.3)E('path',{d:pD(side(1))+pD(side(-1)),fill:'none',stroke:pal.ink,'stroke-width':.28,'stroke-opacity':o.pale?.45:.35},par)}
/* ---------- a round blade or stem (needle, culm, twig) along a 3D centreline: offset across its screen tangent, in pieces for the painter's order;
   a body, a band lit toward the upper left, a glint (glossy needles, polished bark); cols(v) gives the three tones of a piece; after() draws what the piece carries (buds);
   o.min its least half-width (in a bouquet a fine tip stays one continuous line) ---------- */
function lnTube(P0,W0,cols,parts,o={}){const[P,W]=lnSub(P0,[W0]),n=P.length,m=o.piece||24,S=P.map(p=>[p[0],-p[1]]);
  for(let a=0;a<n-1;a+=m-1){const b=Math.min(n-1,a+m-1),Q=S.slice(a,Math.min(n,b+2)),Wq=W.slice(a,Math.min(n,b+2));/* one point over into the next piece: no seam */let z=0;for(let i=a;i<=b;i++)z+=P[i][2];const c=cols((a+b)/2/(n-1)),wx=Math.max(...Wq);
    parts.push({z:z/(b-a+1)+(o.zb||0),fn:par=>{const mn=o.min||.22;E('path',{d:polyRibbon(Q,i=>Math.max(mn,Wq[i]/2)),fill:wx>.75&&!LOD?c[0]:c[3]},par);if(o.ink)E('path',{d:lnSides(Q,i=>Math.max(mn,Wq[i]/2)),fill:'none',stroke:o.ink,'stroke-width':.3,'stroke-opacity':.7},par);
      if(!LOD&&wx>.75){E('path',{d:polyRibbon(Q,i=>Wq[i]*.3,i=>Wq[i]*.2),fill:c[1],opacity:.9},par);if(o.gloss&&(wx>1.1||DET>=1.5))E('path',{d:polyRibbon(Q,i=>Wq[i]*.09,i=>Wq[i]*.36),fill:c[2],opacity:o.gloss},par)}
      if(o.after)o.after(par,a,b)}})}}
/* the two sides of a round part, as open lines (the outline of a pale part, without seams where its pieces meet) */
function lnSides(P,wf){const A=[],B=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=wf(i);A.push([P[i][0]+nx*w,P[i][1]+ny*w]);B.push([P[i][0]-nx*w,P[i][1]-ny*w])}return pD(A)+pD(B)}
/* the tones of a round part from its colour: shadowed body, lit band, glint, and the one tone of a part too fine to be shaded */
const lnCols=(c,gl='#ffffff')=>{const P=pal7(c);return[toneAt(P,.4),toneAt(P,.72),gl,toneAt(P,.54)]};
/* ---------- a tuft grown by the L-system: from one base every blade b grows Bl(b,j) → its turns, F, a marked node o(b,j+1), Bl(b,j+1).
   Each blade leaves the base tilted toward its own side, its face levelled toward the heart of the tuft ($), and follows its course (lnCourse) ---------- */
function lnTuft(B){const rules={T:()=>{const out=[];B.forEach((s,b)=>out.push(['[',{}],['/',{a:s.phi}],['&',{a:s.tilt}],['$',{}],['/',{a:s.roll||0}],['o',{b,j:0}],['Bl',{b,j:0}],[']',{}]));return out},
    Bl:p=>{const s=B[p.b].segs[p.j];return s?[...s.m,['F',{l:s.l,e:s.e,wig:s.wig}],['o',{b:p.b,j:p.j+1}],['Bl',{b:p.b,j:p.j+1}]]:[]}};
  const res=lsTurtle(lsDerive([['T',{}]],rules,Math.max(...B.map(s=>s.segs.length))+3),{p:[0,0,0],H:[0,1,0],U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:1}),bl=B.map(()=>[]);
  for(const og of res.organs)if(og.t==='o')bl[og.p.b][og.p.j]={p:og.pos.slice(),H:og.H,U:og.U};return bl}
/* the course of one blade, as segments {m: its turns, l: its length, e: how it gives under its weight}:
   'free' a fountain (o.e bends it toward the tip, o.bend a steady curve for a stiff needle), 'drop' bent over into a teardrop whose tip is tucked back into the tuft at height o.yt,
   'ring' a full loop on its way up (o.r its radius, o.h1 where it starts); o.tw how far it twists (degrees), o.tn the jitter of the twist */
function lnCourse(g,len,o){const n=o.n||16,sl=len/n,S=[],tw=(o.tw||0)/n,tn=o.tn||0,seg=(l,e,m)=>S.push({m,l,e,wig:o.wig||0}),twist=()=>['/',{a:tw+R(-tn,tn)}];
  if(g==='ring'){const r=o.r,h1=len*o.h1,arc=2*Math.PI*r,n1=Math.max(2,Math.round(h1/sl)),n2=Math.max(12,Math.round(arc/(sl*.6))),rest=Math.max(sl*2,len-h1-arc),n3=Math.max(2,Math.round(rest/sl));
    for(let j=0;j<n1;j++)seg(h1/n1,0,[twist()]);for(let j=0;j<n2;j++)seg(arc/n2,0,[['&',{a:360/n2}],['+',{a:o.hel??4}]]);
    for(let j=0;j<n3;j++)seg(rest/n3,(o.e||0)*Math.pow((j+1)/n3,1.6),[twist(),...(o.bend?[['&',{a:o.bend/n3}]]:[])]);return S}
  if(g==='drop'){const r=o.r,yt=o.yt,ga=o.ga??18,arc=r*(180+ga)*D,h1=Math.max(len*.28,(len-arc-r+yt)/2),ret=Math.max(sl*2,len-h1-arc),n1=Math.max(2,Math.round(h1/sl)),n2=Math.max(8,Math.round(arc/(sl*.6))),n3=Math.max(3,Math.round(ret/sl));
    for(let j=0;j<n1;j++)seg(h1/n1,0,[twist()]);for(let j=0;j<n2;j++)seg(arc/n2,0,[['&',{a:(180+ga)/n2}]]);for(let j=0;j<n3;j++)seg(ret/n3,0,[['/',{a:R(-tn,tn)}]]);S.k0=n1+n2;return S}
  for(let j=0;j<n;j++)seg(sl,(o.e||0)*Math.pow((j+1)/n,1.6),[twist(),...(o.bend?[['&',{a:o.bend/n}]]:[])]);return S}
/* a teardrop's tip tucked into the tuft: its way down eased onto the target point, from the top of the loop on */
function lnLand(nd,k0,tg){const n=nd.length-1,e=nd[n].p,d=V3s(tg,e);for(let j=k0;j<=n;j++){const w=sm01((j-k0)/Math.max(1,n-k0));nd[j].p=V3.add(nd[j].p,V3.sc(d,w))}}
/* a tuft's blade laid along the axis: points, faces (square to the blade), and where along it each node is */
function lnLay(A,nd,bq,L,Rm,fd){const n=nd.length,P=[],U=[],V=[];for(let j=0;j<n;j++){const q=nd[j],p=bq?lnHug(q.p.slice(),L,Rm):q.p;P.push(bq?lnSink(A,p,A.W(p),L,fd):A.W(p));const Hv=A.Wv(p,q.H),Uv=A.Wv(p,q.U);
    U.push(V3.nz(V3s(Uv,V3.sc(Hv,V3.dot(Uv,Hv)))));V.push(j/(n-1))}return{P,U,V}}
/* the palettes of a blade: its upper face (paler at its sheathing base), its under face */
function lnPals(c,cb,base){const P=pal7(c),PB=pal7(cb),P0=base?pal7(base):P;return{pal:v=>v<.05?P0:P,palB:v=>v<.05?P0:PB}}
/* ---------- curly willow (Salix matsudana 'Tortuosa'; the Golden and Scarlet Curls are S. × sepulcralis 'Erythroflexuosa' and its kin): a cut branch whose wood winds in a 3D zigzag,
   side shoots alternating up its upper two thirds (now and then a twig on them), all tapering to fine tips; at every node an appressed, pointed bud on the outside of the bend;
   the bark grey-brown at the cut end, olive to golden on the young wood; a painted branch is evenly coated, buds and all ---------- */
const CW_WIL=[
 {id:'naturel',n:'Naturel brun olive',c:'#6b5a3a',y:'#857d42',o:'#6e655a',bud:'#5c3a34'},
 {id:'vert',n:'Vert olive (jeunes rameaux)',c:'#6c7a3e',y:'#9aa04a',o:'#6a6a4c',bud:'#6a4638'},
 {id:'dore',n:'Doré orangé (Golden Curls)',c:'#c4842e',y:'#dca43e',o:'#8c6a42',bud:'#8a4a2a'},
 {id:'rouge',n:'Rouge (Scarlet Curls)',c:'#992f27',y:'#b5452d',o:'#6c3b31',bud:'#5a2428'},
 {id:'blanc',n:'Peint blanc',c:'#efeae0',paint:1},
 {id:'or',n:'Peint or',c:'#c9a54a',paint:1,met:'#fff6d6'},
 {id:'argent',n:'Peint argent',c:'#bfc1be',paint:1,met:'#ffffff'},
 {id:'noir',n:'Peint noir',c:'#2e2c2d',paint:1}];
function willowPlant(g,t,o){const cw=cwPick(CW_WIL,o),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||90)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt,{bow:R(-.06,.06)}),L=A.L,sz=Math.max(.5,Math.min(1.5,L/(90*UPC))),UP=[0,1,0];
  /* the main axis winds in half-waves of 6–8.5 cm swinging some ±45°, the plane of the waves wandering round it; the shoots curl tighter (2.5–3.4 cm, ±50–60°) */
  const li=R(6,8.5)*UPC*Math.pow(sz,.3),nM=Math.max(4,Math.round(L/(li*.88))),w0=UPC*R(.72,.92)*(.5+.5*sz),w1=.12*UPC,wAt=i=>w0+(w1-w0)*Math.pow(Math.min(1,i/nM),1.25),zz=R(80,102),zb=R(95,120),lb=R(2.5,3.4)*UPC;
  /* side shoots: at most nodes from a fifth of the way up (a third in a bouquet), turning round the axis (2/5 phyllotaxis), the lower ones longest */
  const br=new Map();for(let i=Math.max(1,Math.round(nM*(bq?R(.3,.38):R(.18,.26))));i<nM;i++)if(rnd()<.85)br.set(i,L*(bq?R(.14,.26):R(.2,.36))*(1-.55*i/nM));
  const rules={
    /* the main axis: each internode bends one way in three steps (half a wave; the first one half as much), the plane rolls a little at the node; held on its course (aim) */
    M:p=>{const i=p.i,s=i%2?1:-1,a=i?zz:zz/2;if(i>=nM)return[['Bd',{s,tip:1}]];const out=[];for(let q=0;q<3;q++)out.push(['+',{a:s*a/3*R(.8,1.2)}],['F',{l:li/3*R(.86,1.14),w1:wAt(i+(q+1)/3),aim:UP,k:.09}]);out.push(['Bd',{s}]);
      const bl=br.get(i);if(bl)out.push(['[',{w:wAt(i)*.45}],['/',{a:i*144+R(-25,25)}],['&',{a:R(28,44)}],['Br',{j:0,n:Math.max(2,Math.round(bl/lb)),l:lb,w:wAt(i)*.45,ord:1,z:zb}],[']',{}]);
      out.push(['/',{a:R(-50,50)}],['M',{i:i+1}]);return out},
    /* a shoot: the same waves, tighter, rising a little toward the light; now and then a twig of its own */
    Br:p=>{if(p.j>=p.n)return[['Bd',{s:1,tip:1}]];const s=p.j%2?1:-1,a=p.j?p.z:p.z/2,wj=p.w+(.08*UPC-p.w)*(p.j+1)/p.n,out=[];
      for(let q=0;q<3;q++)out.push(['+',{a:s*a/3*R(.8,1.2)}],['F',{l:p.l/3*R(.86,1.14),w1:wj,e:.012}]);out.push(['Bd',{s}]);
      if(p.ord<2&&p.j>0&&p.j<p.n-2&&rnd()<.4)out.push(['[',{w:wj*.7}],['/',{a:R(0,360)}],['&',{a:R(28,42)}],['Br',{j:0,n:Math.max(2,Math.round((p.n-p.j)*R(.3,.55))),l:p.l*.85,w:wj*.7,ord:2,z:p.z}],[']',{}]);
      out.push(['/',{a:R(-60,60)}],['Br',Object.assign({},p,{j:p.j+1})]);return out}};
  const res=lsTurtle(lsDerive([['M',{i:0}]],rules,nM+22),{p:[0,0,0],H:UP,U:[0,0,1],T:UP,e:0,wig:0,seg:1e6,w:w0});
  /* the main axis brought back onto its axis (its drift sheared off) and to its length; in a bouquet the whole branch hugs the spine */
  const c0=res.chains[0],[ex,ey,ez]=c0.pts[c0.pts.length-1],sy=Math.max(.8,Math.min(1.25,L/Math.max(1,ey))),seen=new Set(),Rm=GHI['saule-tortueux'].rch,fd=GHI['saule-tortueux'].fx*.92;
  for(const ch of res.chains)for(const q of ch.pts){if(seen.has(q))continue;seen.add(q);const f2=q[1]/ey;q[0]-=ex*f2;q[2]-=ez*f2;q[1]*=sy;if(bq)lnHug(q,L,Rm)}
  /* each node: its chain and its index along it; the view-space point of each node */
  const idx=new Map();res.chains.forEach((ch,ci)=>ch.pts.forEach((q,pi)=>{if(!idx.has(q))idx.set(q,[ci,pi])}));const vw=new Map(),Wq=q=>{let v=vw.get(q);if(!v){v=bq?lnSink(A,q,A.W(q),L,fd):A.W(q);vw.set(q,v)}return v};
  /* the buds: on the outside of the bend, pressed to the wood, pointed toward the tip */
  const buds=res.chains.map(()=>[]),bl0=.5*UPC*Math.pow(sz,.15);
  for(const og of res.organs){if(og.t!=='Bd')continue;const id=idx.get(og.pos);if(!id)continue;const[ci,pi]=id,P=Wq(og.pos),Hv=A.Wv(og.pos,og.H),sd=V3.nz(V3.sc(A.Wv(og.pos,og.L),-og.p.s)),w=res.chains[ci].ws[pi]||1,tip=!!og.p.tip,
      bd=tip?Hv:V3.nz(V3.add(V3.sc(Hv,.9),V3.sc(sd,.42))),B0=tip?P:V3.add(P,V3.sc(sd,w*.32)),bl=bl0*(tip?.8:R(.85,1.15)),T0=V3.add(B0,V3.sc(bd,bl)),
      /* the leaf scar under the bud: a thin crescent across the node */
      a0=V3.add(B0,V3.sc(Hv,-w*.35)),sc=V3.cr(Hv,[0,0,1]),sl=V3l(sc)>1e-6?V3.sc(V3.nz(sc),w*.42):[w*.42,0,0];
    buds[ci].push({i:pi*3,B:[B0[0],-B0[1]],T:[T0[0],-T0[1]],w:bl*.24,tip,S:[[a0[0]-sl[0],-(a0[1]-sl[1])],[a0[0]-Hv[0]*w*.25,-(a0[1]-Hv[1]*w*.25)],[a0[0]+sl[0],-(a0[1]+sl[1])]]})}
  const barkOf=ord=>cw.paint?cw.c:ord===1?mix(cw.c,cw.y,.4):mix(cw.c,cw.y,.75),budC=cw.paint?shd(cw.c,-.12):cw.bud,ink=shd(budC,-.6),gl=cw.met||(cw.paint?'#ffffff':'#f6f2e2');
  /* a white paint keeps its modelling in grey (its shadow side deeper) so the branch reads on a pale ground */
  const wht=h2l(cw.c)[2]>.85,PW=pal7(cw.c),colsW=[toneAt(PW,.16),toneAt(PW,.62),'#ffffff',toneAt(PW,.3)];
  res.chains.forEach((ch,ci)=>{const P=ch.pts.map(Wq),cache={},cols=v=>{if(wht)return colsW;const q=Math.round(v*6)/6;return cache[q]||(cache[q]=lnCols(ch.ord||cw.paint?barkOf(ch.ord):mix(cw.o,mix(cw.c,cw.y,.25),Math.min(1,q*1.3)),gl))};
    lnTube(P,ch.ws,cols,parts,{gloss:cw.met?.75:cw.paint?.35:.42,piece:ch.ord?18:24,min:bq?.32:.22,ink:h2l(cw.c)[2]>.7?shd(cw.c,-.55):null,after:(par,a,b)=>{if(LOD)return;let d='';
      for(const u of buds[ci]){if(u.i<a||u.i>b)continue;const B=u.B,T=u.T,dx=T[0]-B[0],dy=T[1]-B[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*u.w*1.3,ny=dx/l*u.w*1.3,mx=B[0]+dx*.42,my=B[1]+dy*.42;
        d+=`M${f(B[0])},${f(B[1])}Q${f(mx+nx)},${f(my+ny)} ${f(T[0])},${f(T[1])}Q${f(mx-nx)},${f(my-ny)} ${f(B[0])},${f(B[1])}Z`}
      if(d)E('path',{d,fill:budC,stroke:ink,'stroke-width':.25,'stroke-opacity':.5},par);
      if(DET>=1.5){let ds='';for(const u of buds[ci])if(!u.tip&&u.i>=a&&u.i<=b){const[p0,c,p1]=u.S;ds+=`M${f(p0[0])},${f(p0[1])}Q${f(c[0])},${f(c[1])} ${f(p1[0])},${f(p1[1])}`}if(ds)E('path',{d:ds,fill:'none',stroke:ink,'stroke-width':.3,'stroke-opacity':.55,'stroke-linecap':'round'},par)}}})});
  drawParts(k,parts);open(k,t,1100,0,.5);const Pb=pal7(cw.paint?cw.c:cw.o);return{k,bw:w0,bc:[Pb.d2,Pb.d1,Pb.b,Pb.l1]}}
/* ---------- bear grass (Xerophyllum tenax): a tuft of very long, narrow, wiry leaves (2–6 mm), keeled, their margins finely toothed, a clean mid green with a pale sheathing base;
   supple, they fall in a fountain, and florists bend them into a teardrop tucked back into the bunch or a ring on the way up. Sold fresh, preserved (dyed) or bleached ---------- */
const CW_BEAR=[{id:'vert',n:'Vert franc (frais)',c:'#4f7a33'},{id:'olive',n:'Vert olive (frais)',c:'#69753b'},{id:'stab-vert',n:'Stabilisé vert',c:'#3b5c2d'},
 {id:'blanchi',n:'Blanchi (séché)',c:'#ebe5d0'},{id:'rouge',n:'Stabilisé rouge',c:'#932431'},{id:'bleu',n:'Stabilisé bleu',c:'#36508c'}];
function bearPlant(g,t,o){const cw=cwPick(CW_BEAR,o),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||90)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt),L=A.L,Rm=GHI['xerophyllum-tenax-bear-grass'].rch,fd=GHI['xerophyllum-tenax-bear-grass'].fx*.92;
  const nb=bq?(o.short?3:Math.round(R(4,6))):Math.round(R(6,8)),u=rnd(),gest=u<.4?'drop':u<.6?'ring':'free',B=[];
  for(let b=0;b<nb;b++){const g2=b===0?gest:b===1&&gest==='drop'&&rnd()<.5?'drop':'free',len=L*(g2==='free'?R(.82,1.04):R(1,1.15)),yt=L*R(.2,.36);
    B.push({phi:b*137.5+R(-25,25),tilt:g2==='free'?(bq?R(3,9):R(8,20)):R(1,4),roll:R(-25,25),w:R(.28,.5)*UPC,g:g2,yt,
      segs:lnCourse(g2,len,{n:16,e:bq?R(.08,.15):R(.3,.5),tw:R(-140,140),tn:9,wig:.012,r:Math.min(L*R(.07,.1),bq?Rm*.42:1e9),yt,h1:R(.32,.5)})})}
  const bl=lnTuft(B),dry=h2l(cw.c)[2]>.8,pl=lnPals(cw.c,mix(cw.c,dry?'#c8bfa0':'#b4c19a',.24),mix(cw.c,'#ebe4c4',dry?.2:.62));
  bl.forEach((nd,b)=>{const s=B[b];if(s.g==='drop')lnLand(nd,s.segs.k0,[R(-1.5,1.5),s.yt,R(-1.5,1.5)]);const{P,U,V}=lnLay(A,nd,bq,L,Rm,fd),
      W=V.map(v=>s.w*(v<.04?.8+5*v:v<.62?1:Math.max(.04,Math.pow(1-(v-.62)/.38,.85))));
    lnRibbon(P,U,W,V,{pal:pl.pal,palB:pl.palB,th:bq?.8:.35,piece:16,dI:DET>=1.5?.07:.12,mid:1,pale:dry,zb:b*.001},parts)});
  drawParts(k,parts);open(k,t,1100,0,.5);const Pc=pal7(cw.c);return{k,bw:3,bc:[Pc.d2,Pc.d1,Pc.b,Pc.l1]}}
/* ---------- lily grass (Liriope muscari): strap leaves 5–10 mm wide and long, dark glossy green above, duller beneath with fine parallel veins, the tip blunt;
   flat ribbons that arch, twist to show their underside and are bent into loops; 'Variegata' keeps cream margins ---------- */
const CW_LIR=[{id:'vert',n:'Vert foncé brillant',c:'#24452a'},{id:'panache',n:'Panaché crème (Variegata)',c:'#7e9a5a',g:'#3d6634',var:'#e8e2b4'}];
function liriPlant(g,t,o){const cw=cwPick(CW_LIR,o),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||50)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt),L=A.L,Rm=GHI['liriope-lily-grass'].rch,fd=GHI['liriope-lily-grass'].fx*.92;
  const nb=bq?(o.short?2:Math.round(R(2,3))):Math.round(R(3,4)),u=rnd(),gest=u<.45?'drop':u<.62?'ring':'free',B=[];
  for(let b=0;b<nb;b++){const g2=b===0?gest:'free',len=L*(g2==='free'?R(.86,1.04):R(1,1.14)),yt=L*R(.18,.32);
    B.push({phi:b*137.5+R(-30,30),tilt:g2==='free'?(bq?R(4,10):R(8,22)):R(1,4),roll:R(-30,30),w:R(.55,.9)*UPC,g:g2,yt,
      segs:lnCourse(g2,len,{n:15,e:bq?R(.09,.17):R(.15,.3),tw:R(150,330)*(rnd()<.5?-1:1),tn:6,wig:.008,r:Math.min(L*R(.07,.1),bq?Rm*.42:1e9),yt,h1:R(.3,.48)})})}
  const bl=lnTuft(B),c=cw.g||cw.c,pl=lnPals(c,mix(c,'#8ea58a',.3),mix(c,'#e2dcc0',.55));
  bl.forEach((nd,b)=>{const s=B[b];if(s.g==='drop')lnLand(nd,s.segs.k0,[R(-1.5,1.5),s.yt,R(-1.5,1.5)]);const{P,U,V}=lnLay(A,nd,bq,L,Rm,fd),
      W=V.map(v=>s.w*(v<.06?.62+.38*v/.06:v<.88?1:Math.sqrt(Math.max(.01,1-Math.pow((v-.88)/.12,2)))));
    lnRibbon(P,U,W,V,{pal:pl.pal,palB:pl.palB,th:bq?.8:.4,piece:16,dI:DET>=1.5?.045:cw.var?.12:.08,mid:1,gloss:.7,shin:30,var:cw.var,zb:b*.001},parts)});
  drawParts(k,parts);open(k,t,1100,0,.5);const Pc=pal7(c);return{k,bw:3.4,bc:[Pc.d2,Pc.d1,Pc.b,Pc.l1]}}
/* ---------- steel grass (Xanthorrhoea, the leaves of the grass tree): rigid needles 1.5–3 mm thick, rhombic in section, glossy deep green with a bluish bloom, very long;
   they bend without breaking, so florists set them in clean arcs, arches and rings ---------- */
const CW_STEEL=[{id:'vert',n:'Vert brillant',c:'#2b4731'},{id:'bleute',n:'Vert bleuté glauque',c:'#4d7266'}];
function steelPlant(g,t,o){const cw=cwPick(CW_STEEL,o),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||90)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt),L=A.L,Rm=GHI['xanthorrhoea-steel-grass'].rch,fd=GHI['xanthorrhoea-steel-grass'].fx*.92;
  const nb=bq?(o.short?3:Math.round(R(3,5))):Math.round(R(5,7)),u=rnd(),gest=u<.35?'drop':u<.6?'ring':'free',B=[];
  for(let b=0;b<nb;b++){const g2=b===0?gest:b===1&&gest!=='free'&&rnd()<.4?gest:'free',len=L*(g2==='free'?R(.85,1.03):R(.95,1.08)),yt=L*R(.06,.2);
    B.push({phi:b*137.5+R(-25,25),tilt:g2==='free'?R(2,bq?6:10):R(1,3),roll:R(-90,90),w:R(.17,.27)*UPC,g:g2,yt,
      segs:lnCourse(g2,len,{n:18,bend:g2==='free'?R(15,bq?45:75):R(0,15),r:Math.min(L*R(.05,.085),bq?Rm*.42:1e9),yt,h1:R(.3,.5),hel:3})})}
  const bl=lnTuft(B),cols=lnCols(cw.c,'#f4fbff'),cb=lnCols(mix(cw.c,'#c9c2a0',.5)),colsAt=v=>v<.03?cb:cols;
  bl.forEach((nd,b)=>{const s=B[b];if(s.g==='drop')lnLand(nd,s.segs.k0,[R(-1.5,1.5),s.yt,R(-1.5,1.5)]);const{P,V}=lnLay(A,nd,bq,L,Rm,fd),W=V.map(v=>s.w*(v<.9?1:Math.max(.15,1-(v-.9)/.1*.85)));
    lnTube(P,W,colsAt,parts,{gloss:.8,piece:18,min:bq?.32:.22})});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:2.6,bc:[shd(cw.c,-.5),shd(cw.c,-.2),cw.c,shd(cw.c,.4)]}}
/* ---------- a feathery awn: the plume a silky veil round its thread, the hairs longest in its middle; the side away from the light in shade (the plume is round, its hairs all about);
   on the sheets the hairs themselves, pointing toward its tip ---------- */
function lnPlume(P0,o,parts){const[P]=lnSub(P0),n=P.length;if(n<2)return;const S=P.map(p=>[p[0],-p[1]]),hwAt=v=>o.hw*Math.pow(Math.sin(Math.PI*Math.min(1,.06+.94*v)),.55)*(1-.3*v),Lf=[],Rt=[],Sh=[],Sr=[],N=[];let z=0,pn=[1,0],tg=[0,-1];
  for(let i=0;i<n;i++){z+=P[i][2];const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l>1e-6){pn=[-dy/l,dx/l];tg=[dx/l,dy/l]}N.push([pn,tg]);const w=hwAt(i/(n-1)),lit=Math.max(-1,Math.min(1,-(pn[0]+pn[1])*1.4)),c=-lit*w*.38;
    Lf.push([S[i][0]+pn[0]*w,S[i][1]+pn[1]*w]);Rt.push([S[i][0]-pn[0]*w,S[i][1]-pn[1]*w]);Sh.push([S[i][0]+pn[0]*(c+w*.6),S[i][1]+pn[1]*(c+w*.6)]);Sr.push([S[i][0]+pn[0]*(c-w*.6),S[i][1]+pn[1]*(c-w*.6)])}
  parts.push({z:z/n+(o.zb||0),fn:par=>{E('path',{d:smooth(Lf.concat(Rt.reverse())),fill:o.body,opacity:o.op??.72},par);if(!LOD)E('path',{d:smooth(Sh.concat(Sr.reverse())),fill:o.shade,opacity:.3},par);
    E('path',{d:pD(S),fill:'none',stroke:o.thread,'stroke-width':o.tw||.26,'stroke-linecap':'round'},par);
    if(!LOD&&DET>=1.5){let d='';for(let i=1;i<n-1;i++){const[nn,tt]=N[i],w=hwAt(i/(n-1));for(const s of[-1,1])for(const[k,a]of[[1.3,.6],[.95,.85]]){const ux=nn[0]*s*Math.sqrt(1-a*a*.5)+tt[0]*a*.7,uy=nn[1]*s*Math.sqrt(1-a*a*.5)+tt[1]*a*.7;d+=`M${f(S[i][0])},${f(S[i][1])}l${f(ux*w*k)},${f(uy*w*k)}`}}
      E('path',{d,fill:'none',stroke:o.barb,'stroke-width':.2,'stroke-opacity':.62,'stroke-linecap':'round'},par)}}})}
/* ---------- feather grass (Stipa pennata; Nassella tenuissima is finer still): slender culms with dark nodes and thread-like rolled leaves; at the top a few spikelets,
   each a narrow lemma and its long awn — a twisted column, a knee, then a feathery plume of 12–25 cm, silky, waving, nodding at its tip. Ivory to straw when dried, green when fresh, often dyed.
   Stages: in the boot (the panicle still in the flag-leaf sheath, a few awns peeping out), emerging (awns held close), open (spread and nodding) ---------- */
const CW_STIPA=[
 {id:'naturel',n:'Naturel argenté',c:'#eee8d8',st:'#cfc195',aw:'#a48654'},
 {id:'blond',n:'Blond paille',c:'#e1d2a6',st:'#c9b57c',aw:'#9a7a44'},
 {id:'vert',n:'Vert tendre (frais)',c:'#c5d690',st:'#87a258',aw:'#6f8448'},
 {id:'cafe',n:'Teint café',c:'#70543a',st:'#5a4230',aw:'#3e2c1e'},
 {id:'peche',n:'Teint pêche',c:'#efbd99',st:'#c99b76',aw:'#a67a56'},
 {id:'rose',n:'Teint rose',c:'#efc3cd',st:'#c99ba6',aw:'#a67481'},
 {id:'fuchsia',n:'Teint fuchsia',c:'#c94280',st:'#973261',aw:'#6e2345'},
 {id:'bleu',n:'Teint bleu ciel',c:'#bdd1ea',st:'#8fa4c4',aw:'#6a7ea0'},
 {id:'marine',n:'Teint bleu marine',c:'#35467f',st:'#29365f',aw:'#1f2949'}];
function stipaPlant(g,t,o){const cw=cwPick(CW_STIPA,o),op=Math.max(.05,Math.min(1,o.op??1)),st=op<.3?0:op<.75?1:2,k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||60)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt),L=A.L,Rm=GHI['stipa'].rch,fd=GHI['stipa'].fx*.92,UP=[0,1,0];
  const as=Math.min(1,L/(42*UPC)),nc=bq?2:3,ns=Math.round(R(4,6)),Lp=R(13,19)*UPC*as*(st===1?.8:1),Lc=R(3.5,4.8)*UPC*as,Lr=R(4,6.5)*UPC*as,Lle=1.6*UPC*as,np=10,nC=8,wc=.14*UPC,
    Lcu=Math.max(L*.3,L-(Lr+Lc+Lle+Lp*(st===2?.55:.85)));
  const rules={
    S:()=>{const out=[];for(let c=0;c<nc;c++)out.push(['[',{c:'culm',w:wc*R(.9,1.1)}],['/',{a:c*137.5+R(-25,25)}],['&',{a:c?R(3,8):R(0,2.5)}],['C',{i:0,h:R(.9,1.04)}],[']',{}]);return out},
    /* the culm: straight, held up, two nodes, a thread-like leaf from the lower one (and sometimes the upper) */
    C:p=>{if(p.i>=nC)return st?[['P',{s:0}]]:[['Sh',{}],['P0',{}]];const out=[['F',{l:Lcu*p.h/nC*R(.9,1.1),w1:wc*(1-.35*(p.i+1)/nC),aim:UP,k:.12,wig:.006}]];
      if(p.i===1||p.i===4){out.push(['Nd',{}]);if(p.i===1||rnd()<.5)out.push(['[',{c:'leaf',w:.075*UPC}],['/',{a:R(0,360)}],['&',{a:R(12,24)}],['Lf',{j:0,n:7,l:Lcu*R(.4,.6)/7}],[']',{}])}
      out.push(['C',{i:p.i+1,h:p.h}]);return out},
    Lf:p=>p.j>=p.n?[]:[['F',{l:p.l,e:.03+.12*p.j/p.n,w1:.075*UPC*(1-.8*(p.j+1)/p.n),wig:.01}],['Lf',Object.assign({},p,{j:p.j+1})]],
    /* the panicle: spikelets up a short rachis, each on its pedicel: the lemma, the column (twisted, kneed), the plume */
    P:p=>{if(p.s>=ns)return[['F',{l:Lr/ns*.5,w1:.04*UPC,aim:UP,k:.1}]];const a=st===2?R(5,14):R(2,6),kn=st===2?R(30,55):R(4,10),dr=st===2?R(.12,.22):.012,wv=st===2?R(2.5,4.5):1.5;
      return[['F',{l:Lr/ns*R(.8,1.2),w1:.08*UPC,aim:UP,k:.1}],['[',{c:'ped',w:.05*UPC}],['/',{a:p.s*137.5+R(-20,20)}],['&',{a}],['F',{l:R(.6,1.5)*UPC*as,w1:.05*UPC}],
        ['[',{c:'lem',w:.13*UPC}],['F',{l:Lle,w1:.07*UPC}],['[',{c:'col',w:.07*UPC}],['/',{a:R(0,360)}],['F',{l:Lc*.55,w1:.065*UPC,wig:.02}],['&',{a:kn*.4}],['F',{l:Lc*.45,w1:.06*UPC,wig:.02}],['&',{a:kn}],
        ['[',{c:'plume',w:.045*UPC}],['Pl',{j:0,dr,wv}],[']',{}],[']',{}],[']',{}],[']',{}],['P',{s:p.s+1}]]},
    Pl:p=>p.j>=np?[]:[['+',{a:(Math.floor(p.j/3)%2?1:-1)*p.wv*R(.7,1.3)}],['F',{l:Lp/np,e:p.dr*Math.pow((p.j+1)/np,1.2),w1:.04*UPC}],['Pl',Object.assign({},p,{j:p.j+1})]],
    /* in the boot: the panicle still in the sheath of the flag leaf, a few awns peeping out */
    P0:()=>{const out=[];for(let s=0;s<3;s++)out.push(['[',{c:'tip',w:.06*UPC}],['/',{a:s*120+R(-20,20)}],['&',{a:R(2,6)}],['F',{l:R(1,2.8)*UPC*as,w1:.05*UPC}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,nC+ns+np+14),{p:[0,0,0],H:UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:wc});
  if(bq){const seen=new Set();for(const ch of res.chains)for(const q of ch.pts){if(seen.has(q))continue;seen.add(q);lnHug(q,L,Rm)}}
  const vw=new Map(),Wq=q=>{let v=vw.get(q);if(!v){v=bq?lnSink(A,q,A.W(q),L,fd):A.W(q);vw.set(q,v)}return v},dry=cw.id!=='vert';
  const cul=lnCols(cw.st,'#fffaf0'),leafC=lnCols(dry?mix(cw.st,'#a89a70',.25):'#6f8f4a'),awC=lnCols(cw.aw),body=shd(cw.c,.12),shade=shd(cw.c,-.42),thread=shd(cw.c,-.2),barb=shd(cw.c,-.34),groups=[];let grp=null;
  for(const ch of res.chains){const P=ch.pts.map(Wq);
    if(ch.c==='culm')lnTube(P,ch.ws,()=>cul,parts,{gloss:.3,piece:24,min:bq?.32:.22,ink:h2l(cw.st)[2]>.66?shd(cw.st,-.5):null});else if(ch.c==='leaf')lnTube(P,ch.ws,()=>leafC,parts,{piece:30,min:bq?.32:.22});else if(ch.c==='tip')lnTube(P,ch.ws,()=>awC,parts,{piece:30,min:bq?.32:.22});
    else{if(ch.c==='ped'||!grp){grp={};groups.push(grp)}grp[ch.c]=P}}
  for(const s of groups){const pts=[...(s.ped||[]),...(s.lem||[]).slice(1),...(s.col||[]).slice(1)];if(pts.length<2)continue;let z=0;for(const p of pts)z+=p[2];const S2=pts.map(p=>[p[0],-p[1]]),Le=(s.lem||[]).map(p=>[p[0],-p[1]]);
    parts.push({z:z/pts.length,fn:par=>{E('path',{d:pD(S2),fill:'none',stroke:cw.aw,'stroke-width':bq?.7:.55,'stroke-linecap':'round','stroke-linejoin':'round'},par);
      if(Le.length>1)E('path',{d:pD(Le),fill:'none',stroke:mix(cw.aw,cw.st,.35),'stroke-width':f(1.15*Math.max(.6,as)),'stroke-linecap':'round'},par)}});
    if(s.plume)lnPlume(s.plume,{hw:R(.4,.52)*UPC*as*(st===1?.6:1),body,shade,thread,barb,op:DET>=1.5?(st===1?.7:.5):(st===1?.8:.62)},parts)}
  /* the sheath of the flag leaf round the young panicle; the dark nodes of the culm (on the sheets) */
  for(const og of res.organs){const P=Wq(og.pos),H=A.Wv(og.pos,og.H);
    if(og.t==='Sh'){const l=R(5,7)*UPC*as,b0=V3.add(P,V3.sc(H,-l*.82)),t0=V3.add(P,V3.sc(H,l*.18)),B=[b0[0],-b0[1]],T=[t0[0],-t0[1]],dx=T[0]-B[0],dy=T[1]-B[1],ll=Math.hypot(dx,dy)||1,w=.32*UPC,nx=-dy/ll*w,ny=dx/ll*w,sc=dry?mix(cw.st,'#9aa070',.3):'#7f9f56';
      parts.push({z:P[2]+.2,fn:par=>E('path',{d:`M${f(B[0])},${f(B[1])}C${f(B[0]+dx*.3+nx)},${f(B[1]+dy*.3+ny)} ${f(B[0]+dx*.8+nx*.7)},${f(B[1]+dy*.8+ny*.7)} ${f(T[0])},${f(T[1])}C${f(B[0]+dx*.8-nx*.7)},${f(B[1]+dy*.8-ny*.7)} ${f(B[0]+dx*.3-nx)},${f(B[1]+dy*.3-ny)} ${f(B[0])},${f(B[1])}Z`,fill:toneAt(pal7(sc),.62),stroke:shd(sc,-.5),'stroke-width':.3,'stroke-opacity':.5},par)})}
    else if(og.t==='Nd'&&DET>=1.5&&!LOD){const S0=[P[0],-P[1]],h2=[H[0],-H[1]],hl=Math.hypot(h2[0],h2[1])||1,w=og.w*.62;parts.push({z:P[2]+.05,fn:par=>E('path',{d:`M${f(S0[0]-h2[1]/hl*w)},${f(S0[1]+h2[0]/hl*w)}L${f(S0[0]+h2[1]/hl*w)},${f(S0[1]-h2[0]/hl*w)}`,stroke:shd(cw.st,-.45),'stroke-width':.7,'stroke-linecap':'round'},par)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:2.2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}
/* ---------- registers: drawers, colourways, trade lengths (cm), and how the composer handles them: lines (form 'ligne') carried on their own spine,
   self = natural length, tip = how far the tip leans past the chord (stiff branch, upright feather grass; the grasses arch freely), fx = how far below its spine a line may hang
   (the composer clears that much under the spine), rch = how far it spreads round its spine in a bouquet ---------- */
Object.assign(GH,{'saule-tortueux':willowPlant,'xerophyllum-tenax-bear-grass':bearPlant,'liriope-lily-grass':liriPlant,'xanthorrhoea-steel-grass':steelPlant,'stipa':stipaPlant});
Object.assign(CWS,{'saule-tortueux':CW_WIL,'xerophyllum-tenax-bear-grass':CW_BEAR,'liriope-lily-grass':CW_LIR,'xanthorrhoea-steel-grass':CW_STEEL,'stipa':CW_STIPA});
Object.assign(SZG,{'saule-tortueux':[60,80,80,100,100,120,150],'xerophyllum-tenax-bear-grass':[60,70,80,80,90,100],'liriope-lily-grass':[40,45,50,50,55,60],'xanthorrhoea-steel-grass':[80,100,100,120,120],'stipa':[50,55,60,60,70]});
Object.assign(GHI,{'saule-tortueux':{form:'ligne',size:1,k:'plant',self:90*UPC,tip:.92,fx:3.5*UPC,rch:9*UPC},'xerophyllum-tenax-bear-grass':{form:'ligne',size:1,k:'plant',self:90*UPC,fx:3.5*UPC,rch:8*UPC},
 'liriope-lily-grass':{form:'ligne',size:1,k:'plant',self:50*UPC,fx:3.5*UPC,rch:7*UPC},'xanthorrhoea-steel-grass':{form:'ligne',size:1,k:'plant',self:90*UPC,fx:3.5*UPC,rch:8*UPC},'stipa':{form:'ligne',size:1,k:'plant',self:60*UPC,tip:.95,fx:3.5*UPC,rch:6*UPC}});
