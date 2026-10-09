/* ================= Serre, lot 55 — branches fleuries 2 : cerisier du Japon (Sato-zakura), amandier, pêcher à fleurs, pommier et pommetier, magnolia ================= */
/* des rameaux ligneux poussés par le L-système du lot 29 (b29Grow, b29Wood, b29Nodes) : l'axe et ses rameaux, l'écorce et ses lenticelles, les nœuds, et à chaque nœud ses organes à leur âge
   (écailles, bourgeons, boutons, fleurs qui s'ouvrent, fleurs ouvertes, jeunes feuilles) ; dans le Composer ce sont des lignes qui suivent l'épine (o.spine) et renvoient {k,bw,bc} ;
   ce lot ajoute des corolles à plusieurs rangs (fleurs doubles), des pétales frangés, un fard à la base des pétales (cœur rouge de l'amandier, revers pourpre du magnolia),
   des jeunes feuilles en 3D (pliées sur la nervure, retombantes) et les bourgeons duveteux du magnolia. Toute liaison (pédoncule, pétiole, rameau court) fait au moins 1,15 unité */
/* ---------- a petal in the frame of its flower, as b29Petal (x across, y along its length Lp from the ring r0 at the angle phi, rising from a0 at its base to a1 at its tip, dished by cu),
   with a fringed tip (fr teeth, fd deep, of Kanzan's petals) and, with vmax, only its foot up to vmax of its length (the flush drawn over a petal) ---------- */
function l55Petal(B,O,phi,r0,Lp,W,a0,a1,wp,o={}){const c=Math.cos(phi),s=Math.sin(phi),nt=o.nt||0,cu=o.cu||0,ht=o.ht??.12,q=[],fr=o.fr||0,fd=o.fd||.05,vm=o.vmax;
  const at=(x,y)=>{const v=y/Lp,am=a0+(a1-a0)*v*.5,rho=r0+y*Math.cos(am),h=y*Math.sin(am)+cu*x*x/W;return PJ(B,O,[c*rho-s*x,s*rho+c*x,h])};
  if(vm){const V=[0,.25,.5,.75,1].map(x=>x*vm),wm=W*wp(vm);for(const v of V)q.push(at(-W*wp(v)*.96,v*Lp));for(const u of[-.5,0,.5])q.push(at(u*wm*.96,Lp*vm*(1+.08*(1-u*u))));
    for(let i=V.length-1;i>=0;i--)q.push(at(W*wp(V[i])*.96,V[i]*Lp))}
  else{const V=[0,.14,.32,.5,.66,.8,1-ht],wt=W*wp(1-ht);for(const v of V)q.push(at(-W*wp(v),v*Lp));
    const TH=fr?Array.from({length:2*fr+3},(_,i)=>.9-.8*i/(2*fr+2)):[.84,.68,.5,.32,.16];
    TH.forEach((th,i)=>{const u=Math.cos(th*Math.PI);let y=Lp*(1-ht+ht*Math.sin(th*Math.PI));if(nt&&Math.abs(u)<.34)y-=nt*Lp*(1-Math.abs(u)/.34);if(fr&&i%2)y-=fd*Lp*R(.6,1.2);q.push(at(u*wt,y))});
    for(let i=V.length-1;i>=0;i--)q.push(at(W*wp(V[i]),V[i]*Lp))}
  const am=a0+(a1-a0)*.55,n=toV(B,[-c*Math.sin(am),-s*Math.sin(am),Math.cos(am)]);let z=0;for(const p of q)z+=p[2];
  const P=q.map(p=>[p[0],p[1]]);if(sArea(P)<0)P.reverse();return{P,z:z/q.length,n}}
/* a corolla of one or more whorls (layers, the outer first: each as b29Corolla's sp, plus fl the colour of the flush at the foot of its petals over flk of their length, on the side flS 'in'|'out'|'both'),
   drawn far to near: the faces turned to us whorl by whorl, the centre, then the backs; at the app's detail each whorl of one side is one path (its flush another), unless its petals carry a back flush */
function l55Corolla(par,B,O,layers,cache,o={}){const det=DET>=1.5,all=[];
  layers.forEach((sp,li)=>{for(let i=0;i<sp.n;i++){const ph=(sp.rot||0)+i*6.283/sp.n+(sp.jit?R(-sp.jit,sp.jit):0),Lp=sp.L*(sp.jl?R(1-sp.jl,1):1),
      pt=l55Petal(B,O,ph,sp.r0,Lp,sp.W,sp.a0,sp.a1,sp.wp,sp),inner=pt.n[2]>=-.02,c=sp.cols?sp.cols(i):sp.col;
    pt.c=inner?c:(sp.colB||mix(c,'#e4dccc',.18));pt.I=.28+.68*b29C(lightI(inner?pt.n:V3.sc(pt.n,-1))*(inner?sp.ao??.94:sp.aoB??1),0,1.1);pt.li=li;pt.inner=inner;
    if(sp.fl&&(sp.flS==='both'||(sp.flS==='out')!==inner))pt.F=(Array.isArray(sp.fl)?sp.fl:[[sp.fl,sp.flk||.4,sp.flo??.85]]).map(([c,k,a])=>({P:l55Petal(B,O,ph,sp.r0,Lp,sp.W,sp.a0,sp.a1,sp.wp,{cu:sp.cu,vmax:k}).P,c,a}));
    pt.sep=!!(sp.cols||sp.sep||(pt.F&&!inner));all.push(pt)}});
  const tone=(c,I)=>{const k=c+'|'+Math.round(I*16);return cache[k]||(cache[k]=toneAt(pal7(c),I))},ink=o.ink||shd(layers[0].col,-.42);
  const draw=L=>{L.sort((a,b)=>a.z-b.z);if(det||L.length<2||L.some(p=>p.sep)){for(const p of L){E('path',{d:smooth(p.P),fill:tone(p.c,p.I),stroke:ink,'stroke-width':.35,'stroke-opacity':.5},par);
        if(p.F)for(const q of p.F)E('path',{d:smooth(q.P),fill:tone(q.c,p.I),'fill-opacity':q.a},par)}return}
    let I=0;for(const p of L)I+=p.I;I/=L.length;E('path',{d:L.map(p=>smooth(p.P)).join(''),fill:tone(L[0].c,I),stroke:ink,'stroke-width':.3,'stroke-opacity':.28},par);
    const F=L.filter(p=>p.F);if(F.length)F[0].F.forEach((q,m)=>E('path',{d:F.map(p=>smooth(p.F[m].P)).join(''),fill:tone(q.c,I),'fill-opacity':q.a},par))};
  const groups=side=>{const m=new Map();for(const p of all)if(p.inner===side){if(!m.has(p.li))m.set(p.li,[]);m.get(p.li).push(p)}
    return[...m.values()].map(L=>({L,z:L.reduce((s,p)=>s+p.z,0)/L.length})).sort((a,b)=>a.z-b.z)};
  for(const g of groups(true))draw(g.L);if(o.centre&&all.some(p=>p.inner))o.centre(par,B,O);for(const g of groups(false))draw(g.L)}
/* the calyx seen from behind: a cup and its sepals (n, reflexed by rf) at the foot of a flower */
function l55Calyx(par,B,O,Rr,col,o={}){const n=o.n||5,cp=b29Rev(B,O,-Rr*(o.cl??.3),Rr*(o.cw??.2),t=>.55+.45*t,0,1,4,8);E('path',{d:smooth(cp),fill:col,stroke:shd(col,-.5),'stroke-width':.3,'stroke-opacity':.6},par);
  let d='';const rf=o.rf??.08,sl=o.sl??.29,sw=o.sw??.09;for(let j=0;j<n;j++){const a=(j*360/n+36)*D,ca=Math.cos(a),sa=Math.sin(a),pt=(r,t,z)=>PJ(B,O,[ca*r-sa*t,sa*r+ca*t,z]),
      p0=pt(Rr*.12,-Rr*sw,-Rr*.22),p1=pt(Rr*sl,0,-Rr*(.22+rf)),p2=pt(Rr*.12,Rr*sw,-Rr*.22),m=pt(Rr*(.12+sl)*.5,0,-Rr*(.22+rf*.5));
    d+=`M${f(p0[0])},${f(p0[1])}Q${f(m[0]+(p0[0]-p2[0])*.3)},${f(m[1]+(p0[1]-p2[1])*.3)} ${f(p1[0])},${f(p1[1])}Q${f(m[0]-(p0[0]-p2[0])*.3)},${f(m[1]-(p0[1]-p2[1])*.3)} ${f(p2[0])},${f(p2[1])}Z`}
  E('path',{d,fill:col,stroke:shd(col,-.45),'stroke-width':.3,'stroke-opacity':.6},par)}
/* a young leaf in 3D on its petiole: from the node a to its foot p, along H, folded up along its midrib (fd), hanging (dr), each half shaded by its own normal, its underside paler;
   serrate at the sheets' detail; o.wp its outline */
const L55_WPL=prof([[0,.12],[.12,.6],[.35,.95],[.55,1],[.78,.72],[.92,.32],[1,0]]);
function l55Leaf3(par,a,p,H,len,wid,col,o={}){const X=V3.nz(H);let N=V3s([0,1,0],V3.sc(X,X[1]));if(V3l(N)<.15)N=V3s([0,0,1],V3.sc(X,X[2]));N=V3.nz(N);let S=V3.cr(X,N);
  const rl=o.roll||0;if(rl){const N2=V3.nz(V3.add(V3.sc(N,Math.cos(rl)),V3.sc(S,Math.sin(rl))));S=V3.cr(X,N2);N=N2}
  const fd=o.fd??.3,dr=o.dr??.25,wp=o.wp||L55_WPL,det=DET>=1.5,nv=det?14:7,P=pal7(col),Pu=pal7(mix(col,'#c8d0b0',.35)),down=[0,-1,0];
  const cAt=v=>V3.add(V3.add(p,V3.sc(X,len*v*(1-dr*.3*v))),V3.sc(down,len*dr*v*v)),sc=q=>[q[0],-q[1]];
  if(V3l(V3s(a,p))>.3)b29Ped(par,a,p,Math.max(1.15,o.pw||1.2),o.pc||shd(col,-.25),.05);
  const halves=[-1,1].map(s=>{const mid=[],edge=[];let z=0;for(let i=0;i<=nv;i++){const v=i/nv,c=cAt(v),w=wid*.5*wp(v)*(det&&i%2&&i<nv?.93:1),q=V3.add(V3.add(c,V3.sc(S,s*w)),V3.sc(N,fd*w));mid.push(sc(c));edge.push(sc(q));z+=q[2]}
    const n=V3.nz(V3s(N,V3.sc(S,s*fd))),top=n[2]>=0,I=.3+.6*b29C(lightI(top?n:V3.sc(n,-1)),0,1.1);return{P:mid.concat(edge.reverse()),z:z/(nv+1),fill:toneAt(top?P:Pu,I)}});
  halves.sort((u,v)=>u.z-v.z);for(const h of halves)E('path',{d:smooth(h.P),fill:h.fill,stroke:P.d2,'stroke-width':.35,'stroke-opacity':.55},par);
  if(det||len>16){let d='';for(let i=0;i<=6;i++){const q=sc(cAt(i/6*.92));d+=(i?'L':'M')+f(q[0])+','+f(q[1])}E('path',{d,stroke:P.l1,'stroke-width':.45,fill:'none','stroke-opacity':.6},par)}}
/* the width of the wood at an organ */
const l55W=og=>{const ax=og.p.ax;return ax.w0+(ax.w1-ax.w0)*og.a};
/* a dormant bud: a small ovoid of scales at pos along H */
function l55Dorm(parts,pos,H,len,col){const B=spFrame(H,[0,1,0],0);parts.push({z:pos[2]+H[2]*len*.5,fn:par=>E('path',{d:smooth(b29Rev(B,pos,len,len*.55,B29_EGG,0,1,5,8)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.3,'stroke-opacity':.6},par)})}
/* the side shoots of a branch: nLat of the nodes between z0 and z1 of its length each carry one, spec(q) its shoot */
function l55Lats(N,L,nLat,z0,z1,spec){const cand=N.filter(nd=>nd.l>L*z0&&nd.l<L*z1);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0];nd.lats=[spec(nd.l/L)]}return N}

/* ---------- cerisier à fleurs du Japon, groupe Sato-zakura (Prunus serrulata 'Kanzan', 'Shirotae', 'Ichiyo', 'Pink Perfection', 'Ukon'): stout glossy chestnut shoots barred with pale lenticels;
   short spurs, each a tuft of brown bud scales, two or three young leaves (bronze in 'Kanzan', bronze-green in the others) and a pendent corymb of 2–5 flowers on long slender pedicels (3–5 cm)
   from a short common stalk; the flower large (5–6 cm), double, twenty to fifty petals in whorls, their tips fringed and notched, the inner ones smaller and crumpled, the centre two leafy
   green pistils ('Kanzan', 'Ichiyo') or, in the semi-double 'Shirotae' and 'Ukon', a ring of yellow stamens; deep pink round buds; the clusters open along the branch from its foot ---------- */
const L55_SATO=[{id:'kanzan',n:'Rose (Kanzan)',c:'#e27f9e',bud:'#c4406a',lf:'#8a4a2a',dbl:3},{id:'pink',n:'Rose (Pink Perfection)',c:'#efb3c4',bud:'#d0587a',lf:'#7a5a2a',dbl:3},
 {id:'ichiyo',n:'Rose tendre (Ichiyo)',c:'#f6d6de',bud:'#e08aa2',lf:'#6e6a2e',dbl:3,prov:1},{id:'shirotae',n:'Blanc (Shirotae)',c:'#fbf8f4',bud:'#f0c8d0',lf:'#6e7a30',dbl:2},
 {id:'ukon',n:'Jaune verdâtre (Ukon)',c:'#f1eed6',bud:'#d8d8a8',lf:'#7a6a2e',dbl:2},
 /* the late ones (coloris4.md), after the five numbered ones: the SKU numbers do not move */
 {id:'tai-haku',n:'Blanc pur (Tai-haku)',c:'#f2f0ea',bud:'#d8cdc8',lf:'#8c5a42',dbl:2,late:5},{id:'gyoiko',n:'Crème strié de vert (Gyoiko)',c:'#e0e0b0',bud:'#b0b17b',lf:'#8a4a38',dbl:3,late:5},
 {id:'matsumae-fuki',n:'Blanc (Matsumae-fuki)',c:'#f2eae6',bud:'#e8c6c4',lf:'#5c3428',dbl:2,late:5},{id:'hanagasa',n:'Rose au centre vert (Hanagasa)',c:'#edcde5',bud:'#d08aa4',lf:'#8a5a3a',dbl:3,late:5},
 {id:'yae-murasaki-zakura',n:'Rose profond (Yae-murasaki-zakura)',c:'#f0ccde',bud:'#bf3a56',lf:'#8a4a38',dbl:2,late:5,prov:1}];
const L55_WP_SATO=prof([[0,.3],[.12,.6],[.4,.95],[.7,1],[.92,.92],[1,.85]]);
function l55SatoFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],c=cw.c,cB=mix(c,cw.bud,.3),wp=L55_WP_SATO,rot=R(0,1),dbl=cw.dbl,cal='#5a4a26',
    L1={n:dbl>2?10:6,r0:Rr*.1,L:Rr*.95,W:Rr*(dbl>2?.32:.4),a0:.12+(1-h)*1.05,a1:.2+(1-h)*1.25,wp,fr:2,fd:.06,nt:.06,cu:.18,ht:.18,col:c,colB:cB,rot,jit:.14,jl:.1,ao:.96},
    L2={n:dbl>2?9:6,r0:Rr*.08,L:Rr*(dbl>2?.76:.82),W:Rr*.3,a0:.45+(1-h)*.85,a1:.5+(1-h)*.95,wp,fr:2,fd:.07,nt:.06,cu:.22,ht:.18,col:mix(c,cw.bud,.1),colB:cB,rot:rot+.31,jit:.18,jl:.14,ao:.86},
    L3={n:7,r0:Rr*.05,L:Rr*.5,W:Rr*.26,a0:.95+(1-h)*.4,a1:1.15+(1-h)*.3,wp,fr:1,fd:.08,cu:.3,ht:.2,col:mix(c,cw.bud,.18),colB:cB,rot:rot+.6,jit:.25,jl:.2,ao:.76},
    layers=dbl>2?[L1,L2,L3]:[L1,L2],
    centre=dbl>2?(par,B,O)=>{if(h<.5)return;let d='';for(const a of[R(0,3),R(3,6.2)]){const p0=PJ(B,O,[0,0,Rr*.15]),p1=PJ(B,O,[Math.cos(a)*Rr*.16,Math.sin(a)*Rr*.16,Rr*.42]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
        E('path',{d,stroke:'#7a9a3a','stroke-width':f(Math.max(1.1,Rr*.07)),'stroke-linecap':'round',fill:'none'},par)}
      :(par,B,O)=>{b29Disc(par,B,O,Rr*.13,Rr*.2,'#d8c890');b29Stamens(par,B,O,{n:DET>=1.5?24:14,r0:Rr*.1,r1:Rr*.3*(.6+.4*h),h:Rr*.42,fc:mix(c,'#fff8e8',.4),ac:'#e0b030',ar:Math.max(.4,Rr*.04)})};
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,cal,{rf:.05});l55Corolla(par,B,O,layers,cache,{centre,ink:shd(cw.bud,-.45)});if(nz<-.05)l55Calyx(par,B,O,Rr,cal,{rf:.05})}
function l55Sato(g,t,o){const cw=cwPick(L55_SATO,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=5.4*UPC*R(.94,1.06),SC=['#2a1410','#5a2a20','#7e4434','#c4927e'],w0=sp?6.5:Math.min(9.5,3.4+Lt/105),lo=sp?.36:.12,pc='#6e6a34',down=[0,-1,0];
  const nLat=o.short?0:rnd()<.25?1:rnd()<.7?2:3,cl=(nd,i,q)=>{if(rnd()<.8)nd.org=[{a:R(40,60),n:rnd()<.35?2:rnd()<.8?3:4}];nd.kink=R(-5,5)};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.03,e:.05,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.95,[3.4*UPC,4.8*UPC],144,cl,.78),L,nLat,sp?.42:.22,.72,
    q=>({len:L*R(.22,.38)*(1-.4*q)*(sp?.8:1),a:R(28,42),e:.04,w:Math.max(1.8,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.18,.94,[3*UPC,4*UPC],144,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,8,'#d8b8a4',{k:.55,sw:.6,so:.5})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+.2,fn:par=>E('path',{d:smooth(b29Rev(B,pos,Df*.13,Df*.07,B29_CONE)),fill:budFill('#6a3226'),stroke:'#2a120c','stroke-width':.3},par)});continue}
    const nF=og.p.og.n,age0=.24+op*1.12-.36*og.a+R(-.18,.14),sl=Df*.1,se=V3.add(pos,V3.sc(og.H,sl)),Bs=spFrame(og.H,[0,1,0],0);
    if(age0<.06){l55Dorm(parts,pos,og.H,Df*.16,'#6a3426');continue}
    /* the spur and its scales, the young leaves */
    parts.push({z:pos[2]+.05,fn:par=>{b29Ped(par,pos,se,Math.max(1.4,l55W(og)*.45),'#5a2a20',0);E('path',{d:smooth(b29Rev(Bs,V3.add(pos,V3.sc(og.H,sl*.4)),sl*.9,Df*.06,t=>.5+.5*Math.sin(Math.PI*t))),fill:'#6a3a26',stroke:'#2a120c','stroke-width':.3,'stroke-opacity':.6},par)}});
    const nL=age0<.3?1:rnd()<.5?2:3;for(let j=0;j<nL;j++){const H=b29Spread(og.H,og.U,og.L,j*2.4+R(-.4,.4),.55,[0,.35,0]),len=Df*R(.55,.85)*b29C(.35+.6*age0,.3,1),pf=V3.add(se,V3.sc(H,Df*.06));
      if(sp&&pf[1]<30)continue;parts.push({z:se[2]+H[2]*len*.4-.02,fn:par=>l55Leaf3(par,se,pf,H,len,len*.42,mix(cw.lf,'#6a8a30',R(0,.3)),{dr:.3,fd:.28,roll:R(-.3,.3),pc:'#6a4a2a'})})}
    /* the common stalk, then the pedicels hanging out of it */
    const hang=V3.nz(V3.add(V3.sc(og.H,.55),[0,-.55,0])),cp=V3.add(se,V3.sc(hang,Df*.22*b29C(age0*2,.4,1)));
    parts.push({z:se[2]+.04,fn:par=>b29Ped(par,se,cp,1.4,pc,.05)});
    for(let j=0;j<nF;j++){const age=age0-.06*j+R(-.06,.04);if(age<.06&&j>0)continue;
      const ps=age<.4?.45+.55*b29C(age/.4):1,dj=b29Spread(hang,og.U,og.L,j*6.283/nF+R(-.4,.4),R(.45,.8),[0,-.15,0]),pl=R(2.6,4)*UPC*ps,b=V3.add(cp,V3.sc(dj,pl));if(sp&&b[1]<28)continue;
      const ax=V3.nz(V3.add(V3.add(V3.sc(dj,.55),V3.sc(og.H,.45)),[R(-.15,.15),R(-.25,.05),R(0,.45)])),B=spFrame(ax,[0,1,0],R(-.3,.3));
      if(age<.4){const bs=Df*(.16+.2*b29C(age/.4)),bc=mix(cw.bud,cw.c,.25*b29C((age-.2)/.2));
        parts.push({z:b[2],fn:par=>{b29Ped(par,cp,b,1.15,pc,.12);spBud(par,B,b,bs,bs*.82,bc,{tp:.3,pw:.55});E('path',{d:smooth(b29Rev(B,b,-bs*.18,bs*.28,t=>1-.5*t,0,1,3,8)),fill:'#5a4a26',stroke:'#2a2010','stroke-width':.3,'stroke-opacity':.5},par)}});continue}
      const hh=b29C((age-.4)/.35,.2,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,cp,b,1.15,pc,.12);l55SatoFl(par,B,b,Df*(.72+.28*hh),cw,hh,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- amandier (Prunus dulcis): grey shoots, rough and greyer on the old wood, red-brown at the tips; the flowers before the leaves, single or in pairs, almost sessile against the wood
   out of brown bud scales (a red-brown calyx cup); the flower 3.5–5 cm, five broad obovate petals a little notched, white to pale pink, flushed deep pink to red at their foot (the red heart),
   some thirty stamens with pink filaments and orange-yellow anthers round a red disc; the buds pink, paler as they swell; the youngest at the tips ---------- */
const L55_AMA=[{id:'blanc',n:'Blanc à cœur rouge (Prunus dulcis)',c:'#fbf6f4',eye:'#c0304e',bud:'#eab0c0'},{id:'blush',n:'Blanc rosé (Princesse)',c:'#f6dfe2',eye:'#b42a4a',bud:'#e498b0'},
 {id:'rose',n:'Rose tendre (Robijn)',c:'#e6c3d6',eye:'#a02448',bud:'#d47a9c'}];
const L55_WP_AMA=prof([[0,.26],[.15,.55],[.45,.93],[.75,1],[.94,.84],[1,.66]]);
function l55AlmondFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],cal='#8a3e2e',
    sp={n:5,r0:Rr*.1,L:Rr*.9,W:Rr*.48,a0:.15+(1-h)*.95,a1:.3+(1-h)*1.15,wp:L55_WP_AMA,nt:.05,cu:.14,ht:.18,col:cw.c,colB:mix(cw.c,cw.eye,.14),rot:R(0,1.2),jit:.08,jl:.06,
      fl:cw.eye,flk:.34,flS:'in',flo:.8},
    centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.17,Rr*.04,shd(cw.eye,-.12));b29Stamens(par,B,O,{n:DET>=1.5?28:16,r0:Rr*.13,r1:Rr*.38*(.6+.4*h),h:Rr*.32,fc:mix(cw.eye,'#fff0f0',.45),ac:'#e8a030',ar:Math.max(.4,Rr*.045)});
      if(DET>=1.5)b29Disc(par,B,O,Rr*.04,Rr*.38,'#c8c870')};
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,cal);l55Corolla(par,B,O,[sp],cache,{centre,ink:shd(cw.eye,-.3)});if(nz<-.05)l55Calyx(par,B,O,Rr,cal)}
function l55Almond(g,t,o){const cw=cwPick(L55_AMA,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=4.1*UPC*R(.94,1.06),w0=sp?6:Math.min(9,3+Lt/110),lo=sp?.34:.1,CC={};
  const cols=(q,ch)=>{const u=ch.ord?.6+.4*q:q*q,key=Math.round(u*5);if(CC[key])return CC[key];const P=pal7(mix('#7a726a','#7a4a3a',u*.8));return CC[key]=[P.d2,P.d1,P.b,mix(P.l1,'#d8d0c8',.3)]};
  const nLat=o.short?0:rnd()<.25?1:rnd()<.65?2:3,cl=(nd,i,q)=>{nd.kink=R(-6,6);if(rnd()<.84)nd.org=[{a:R(48,68),n:rnd()<.55?1:2}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.035,e:.04,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.96,[2*UPC,2.9*UPC],144,cl,.8),L,nLat,sp?.42:.2,.72,
    q=>({len:L*R(.22,.38)*(1-.4*q)*(sp?.8:1),a:R(30,46),e:.035,w:Math.max(1.7,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.15,.95,[1.8*UPC,2.6*UPC],144,cl,.8)}))});
  b29Wood(parts,P.chains,cols,{piece:9,deco:(par,Pp,W)=>{b29Marks(par,Pp,W,6,'#4a4440',{k:.3,sw:.5,so:.35,along:1,off:.45});b29Marks(par,Pp,W,13,'#c8beb2',{k:.45,sw:.5,so:.4})}});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,Df*.16,'#6a4a3a');continue}
    const nF=og.p.og.n,wl=l55W(og);for(let j=0;j<nF;j++){const age=.3+op*1.1-.4*og.a+R(-.2,.14)-.07*j,pd=b29Spread(og.H,og.U,og.L,j*3.1+R(-.4,.4),nF>1?.5:.2,[0,.15,0]),
      b=V3.add(pos,V3.sc(pd,wl*.42+Df*.04));if(sp&&b[1]<28)continue;
      if(age<.1){l55Dorm(parts,V3.add(pos,V3.sc(pd,wl*.3)),pd,Df*.15,'#7a5040');continue}
      const ax=V3.nz(V3.add(pd,[R(-.15,.15),.1,R(.05,.35)])),B=spFrame(ax,[0,1,0],R(-.3,.3)),sc=V3.add(pos,V3.sc(pd,wl*.3));
      if(age<.42){const u=b29C((age-.1)/.32),bs=Df*(.15+.2*u),bc=mix(cw.bud,cw.c,.5*u),O=V3.add(sc,V3.sc(ax,Df*.05));
        parts.push({z:b[2]+ax[2]*bs*.4,fn:par=>{E('path',{d:smooth(b29Rev(B,sc,Df*.09,Df*.075,t=>.7+.3*Math.sin(Math.PI*t),0,1,3,8)),fill:'#6a3a2a',stroke:'#2a140c','stroke-width':.3,'stroke-opacity':.6},par);
          spBud(par,B,O,bs,bs*.78,bc,{tp:.35,pw:.6})}});continue}
      const hh=b29C((age-.42)/.3,.22,1);parts.push({z:b[2]+.1,fn:par=>{E('path',{d:smooth(b29Rev(B,sc,Df*.07,Df*.08,t=>.7+.3*Math.sin(Math.PI*t),0,1,3,8)),fill:'#6a3a2a',stroke:'#2a140c','stroke-width':.3,'stroke-opacity':.6},par);
        l55AlmondFl(par,B,b,Df*(.82+.18*hh),cw,hh,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:cols(0,{ord:0})}}

/* ---------- pêcher à fleurs (Prunus persica, cultivars d'ornement): long, straight, smooth and glossy red-brown rods (green on their shaded side), few side shoots; at almost every node,
   one or two flowers sessile and crowded against the wood, out of downy grey-brown scales: single (five rounded petals, 3 cm, a darker eye, pink filaments) or double ('Klara Meyer',
   'Russell's Red', 'Iceberg', the striped 'Peppermint Stick': 20–30 petals in three whorls, 3.5–4 cm); the calyx a red-brown cup; buds pointed, deep pink ---------- */
const L55_PEC=[{id:'klara',n:'Rose vif double (Klara Meyer)',c:'#e8709a',bud:'#c8406c',dbl:1},{id:'rose',n:'Rose vif simple (Prunus persica)',c:'#ec8fac',bud:'#d0587e',dbl:0},
 {id:'rouge',n:'Rouge cerise double (Russell\'s Red)',c:'#c42c4c',bud:'#8e1a34',dbl:1},{id:'pourpre',n:'Rouge pourpre double (Melred)',c:'#8e1f3a',bud:'#5e1024',dbl:1},
 {id:'blanc',n:'Blanc double (Iceberg)',c:'#fbf7f4',bud:'#e8c0c4',dbl:1},{id:'pep',n:'Blanc strié de rouge (Peppermint Stick)',c:'#f6e4e6',bud:'#d04a62',dbl:1,f:'pep'}];
const L55_WP_PEC=prof([[0,.22],[.15,.52],[.42,.92],[.7,1],[.9,.86],[1,.66]]),L55_PEP=['#fbf4f2','#fbf4f2','#f4cdd2','#d23a52'];
function l55PeachFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],c=cw.c,cB=mix(c,cw.bud,.25),wp=L55_WP_PEC,rot=R(0,1.2),cal='#8a4a32',
    pep=cw.f==='pep'?(()=>{const m=rnd()<.15?'#d23a52':null;return i=>m||L55_PEP[Math.floor(rnd()*4)]})():null,
    L1={n:5,r0:Rr*.1,L:Rr*.9,W:Rr*.5,a0:(cw.dbl?.3:.15)+(1-h)*.95,a1:.3+(1-h)*1.15,wp,nt:.04,cu:.16,ht:.22,col:c,colB:cB,cols:pep,rot,jit:.1,jl:.08,ao:.95},
    L2={n:8,r0:Rr*.08,L:Rr*.72,W:Rr*.36,a0:.68+(1-h)*.7,a1:.7+(1-h)*.8,wp,nt:.04,cu:.2,ht:.22,col:mix(c,cw.bud,.08),colB:cB,cols:pep,rot:rot+.4,jit:.18,jl:.12,ao:.85},
    L3={n:7,r0:Rr*.05,L:Rr*.48,W:Rr*.28,a0:1.08+(1-h)*.35,a1:1.2+(1-h)*.3,wp,cu:.28,ht:.22,col:mix(c,cw.bud,.16),colB:cB,cols:pep,rot:rot+.8,jit:.25,jl:.2,ao:.75},
    centre=cw.dbl?(par,B,O)=>{if(h>.6)b29Stamens(par,B,O,{n:DET>=1.5?10:6,r0:Rr*.04,r1:Rr*.14,h:Rr*.42,fc:mix(c,'#fff0f0',.4),ac:'#e0902a',ar:Math.max(.4,Rr*.05)})}
      :(par,B,O)=>{b29Disc(par,B,O,Rr*.2,Rr*.05,shd(cw.bud,-.1));b29Stamens(par,B,O,{n:DET>=1.5?24:14,r0:Rr*.14,r1:Rr*.36*(.6+.4*h),h:Rr*.34,fc:mix(cw.bud,'#ffe8ee',.35),ac:'#e8902a',ar:Math.max(.4,Rr*.05)})};
  const sp1=cw.dbl?L1:Object.assign({},L1,{fl:cw.bud,flk:.3,flS:'in',flo:.55});
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,cal,{cl:.25});l55Corolla(par,B,O,cw.dbl?[L1,L2,L3]:[sp1],cache,{centre,ink:shd(mix(cw.bud,'#7a5050',.3),-.4)});if(nz<-.05)l55Calyx(par,B,O,Rr,cal,{cl:.25})}
function l55Peach(g,t,o){const cw=cwPick(L55_PEC,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=(cw.dbl?3.7:3.1)*UPC*R(.94,1.06),SC=['#34120e','#6e261c','#984034','#d08474'],w0=sp?5.5:Math.min(8,2.8+Lt/115),lo=sp?.34:.1;
  const nLat=o.short?0:rnd()<.45?0:rnd()<.8?1:2,cl=(nd,i,q)=>{nd.kink=R(-3,3);if(rnd()<.9)nd.org=[{a:R(42,62),n:rnd()<.45?1:2}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.05,.05),wig:.015,e:.07,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.96,[1.5*UPC,2.2*UPC],144,cl,.85),L,nLat,sp?.42:.22,.65,
    q=>({len:L*R(.3,.45)*(1-.4*q)*(sp?.8:1),a:R(20,32),e:.06,w:Math.max(1.6,w0*.45*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.12,.95,[1.4*UPC,2*UPC],144,cl,.85)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,22,'#d8b0a0',{k:.3,sw:.55,so:.35})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,Df*.18,'#7a5a4a');continue}
    const nF=og.p.og.n,wl=l55W(og);for(let j=0;j<nF;j++){const age=.3+op*1.12-.45*og.a+R(-.18,.12)-.06*j,pd=b29Spread(og.H,og.U,og.L,j*3.1+R(-.4,.4),nF>1?.55:.2,[0,.2,0]),
      b=V3.add(pos,V3.sc(pd,wl*.4+Df*.05));if(sp&&b[1]<28)continue;
      if(age<.1){l55Dorm(parts,V3.add(pos,V3.sc(pd,wl*.3)),pd,Df*.16,'#8a7060');continue}
      const ax=V3.nz(V3.add(pd,[R(-.15,.15),.15,R(.05,.35)])),B=spFrame(ax,[0,1,0],R(-.3,.3)),sc=V3.add(pos,V3.sc(pd,wl*.3)),scl=par=>E('path',{d:smooth(b29Rev(B,sc,Df*.09,Df*.075,t=>.7+.3*Math.sin(Math.PI*t),0,1,3,8)),fill:'#7a5a4a',stroke:'#2a1a12','stroke-width':.3,'stroke-opacity':.6},par);
      if(age<.42){const u=b29C((age-.1)/.32),bs=Df*(.16+.22*u),bc=cw.f==='pep'?mix(cw.bud,'#f8e8ea',.3*u):mix(cw.bud,cw.c,.35*u),O=V3.add(sc,V3.sc(ax,Df*.05));
        parts.push({z:b[2]+ax[2]*bs*.4,fn:par=>{scl(par);spBud(par,B,O,bs,bs*.72,bc,{tp:.5,pw:.6})}});continue}
      const hh=b29C((age-.42)/.3,.22,1);parts.push({z:b[2]+.1,fn:par=>{scl(par);l55PeachFl(par,B,b,Df*(.8+.2*hh),cw,hh,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- pommier et pommetiers à fleurs (Malus domestica, M. floribunda, 'Evereste', 'Rudolph', 'Royalty'): grey-brown shoots, the old wood greyer, set with short knobbly spurs;
   each spur ends in a rosette of young leaves (green, bronze-purple in the red crabs) and a corymb of 4–6 flowers on 2–3 cm pedicels, the central (king) flower opening first;
   the flower 3–4.5 cm, five round, clawed, overlapping petals, white or flushed pink inside and deeper pink on their backs, yellow anthers, five styles; the buds round, carmine to deep pink ---------- */
const L55_MAL=[{id:'blanc',n:'Blanc (Evereste)',c:'#fbf7f2',bud:'#d86a88',back:'#f2c8d2',lf:'#6a8a34'},{id:'domestica',n:'Blanc rosé (pommier domestique)',c:'#f8e4e8',bud:'#d0506e',back:'#eaa8bc',lf:'#6e8a34'},
 {id:'floribunda',n:'Rose tendre (Malus floribunda)',c:'#f0b9c8',bud:'#c8385a',back:'#e48aa4',lf:'#6a8432'},{id:'rudolph',n:'Rose vif (Rudolph)',c:'#e07a9a',bud:'#a82850',back:'#c85a80',lf:'#6a5a30'},
 {id:'royalty',n:'Pourpre (Royalty)',c:'#8e2c4e',bud:'#5e1434',back:'#7a2244',lf:'#5a2a32'}];
const L55_WP_MAL=prof([[0,.16],[.16,.42],[.4,.9],[.66,1],[.88,.86],[1,.62]]);
function l55AppleFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],
    sp={n:5,r0:Rr*.1,L:Rr*.88,W:Rr*.56,a0:.3+(1-h)*.95,a1:.4+(1-h)*1.1,wp:L55_WP_MAL,cu:.24,ht:.3,col:cw.c,colB:cw.back,rot:R(0,1.2),jit:.07,jl:.06,ao:.94,fl:cw.back,flk:.3,flS:'in',flo:.35},
    centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.17,Rr*.08,'#c8c070');b29Stamens(par,B,O,{n:DET>=1.5?20:12,r0:Rr*.12,r1:Rr*.3*(.6+.4*h),h:Rr*.34,fc:mix(cw.c,'#fffbe8',.6),ac:'#e8c030',ar:Math.max(.4,Rr*.05)});
      if(DET>=1.5)b29Disc(par,B,O,Rr*.05,Rr*.36,'#e8e0b0')};
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,'#6a7a3a',{rf:.06,cl:.24});l55Corolla(par,B,O,[sp],cache,{centre,ink:shd(cw.bud,-.35)});if(nz<-.05)l55Calyx(par,B,O,Rr,'#6a7a3a',{rf:.06,cl:.24})}
function l55Apple(g,t,o){const cw=cwPick(L55_MAL,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=3.8*UPC*R(.94,1.06),SC=['#2a221e','#52443a','#766658','#ab9c8e'],w0=sp?6:Math.min(9,3+Lt/110),lo=sp?.36:.12,pc='#6a7a3a';
  const nLat=o.short?0:rnd()<.25?1:rnd()<.65?2:3,cl=(nd,i,q)=>{nd.kink=R(-8,8);if(rnd()<.72)nd.org=[{a:R(42,62),n:rnd()<.3?3:rnd()<.75?4:5}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.035,e:.04,seg:9,w:w0,w1:1.3,nodes:L=>l55Lats(b29Nodes(L,lo,.95,[3.6*UPC,5*UPC],144,cl,.78),L,nLat,sp?.42:.22,.72,
    q=>({len:L*R(.22,.36)*(1-.4*q)*(sp?.8:1),a:R(32,48),e:.035,w:Math.max(1.8,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.18,.94,[3*UPC,4.2*UPC],144,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,10,'#c0b0a0',{k:.4,sw:.55,so:.4})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,Df*.16,'#6a5040');continue}
    const nF=og.p.og.n,age0=.22+op*1.15-.36*og.a+R(-.18,.14),sl=Df*.14,se=V3.add(pos,V3.sc(og.H,sl)),wl=l55W(og);
    if(age0<.06){l55Dorm(parts,pos,og.H,Df*.17,'#6a5040');continue}
    /* the spur: a knobbly stub with its ring scars */
    parts.push({z:pos[2]+.05,fn:par=>{b29Ped(par,pos,se,Math.max(1.6,wl*.5),'#5a4a3e',0);if(DET>=1.5)b29Ped(par,V3.add(pos,V3.sc(og.H,sl*.55)),V3.add(pos,V3.sc(og.H,sl*.62)),Math.max(1.7,wl*.56),'#7a6a5a',0)}});
    /* the rosette of young leaves */
    const nL=age0<.3?2:DET<1.5||rnd()<.5?3:4;for(let j=0;j<nL;j++){const H=b29Spread(og.H,og.U,og.L,j*6.283/nL+R(-.4,.4),.75,[0,.2,0]),len=Df*R(.7,1.1)*b29C(.3+.7*age0,.3,1),pf=V3.add(se,V3.sc(H,Df*.1));
      if(sp&&pf[1]<30)continue;parts.push({z:se[2]+H[2]*len*.4-.02,fn:par=>l55Leaf3(par,se,pf,H,len,len*.48,mix(cw.lf,'#8aa040',R(0,.2)),{dr:.22,fd:.3,roll:R(-.3,.3),pc:shd(cw.lf,-.1)})})}
    /* the corymb: the king flower in the middle, the others round it on longer pedicels */
    for(let j=0;j<nF;j++){const age=age0-(j?.14+.04*j:0)+R(-.05,.04);if(age<.06&&j>0)continue;
      const ps=age<.42?.5+.5*b29C(age/.42):1,dj=j?b29Spread(og.H,og.U,og.L,j*6.283/(nF-1)+R(-.3,.3),R(.55,.85),[0,.25,0]):V3.nz(V3.add(og.H,[0,.3,0])),pl=R(1.8,2.8)*UPC*ps,
        b=V3.add(se,V3.sc(dj,pl));if(sp&&b[1]<28)continue;const ax=V3.nz(V3.add(dj,[R(-.15,.15),.1,R(0,.35)])),B=spFrame(ax,[0,1,0],R(-.3,.3));
      if(age<.42){const u=b29C(age/.42),bs=Df*(.14+.2*u),bc=mix(cw.bud,cw.back,.4*b29C((u-.6)/.4));
        parts.push({z:b[2],fn:par=>{b29Ped(par,se,b,1.15,pc,.1);spBud(par,B,b,bs,bs*.92,bc,{tp:.15,pw:.5});E('path',{d:smooth(b29Rev(B,b,-bs*.16,bs*.3,t=>1-.5*t,0,1,3,8)),fill:'#5a6a30',stroke:'#2a3010','stroke-width':.3,'stroke-opacity':.5},par)}});continue}
      const hh=b29C((age-.42)/.3,.22,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,se,b,1.15,pc,.1);l55AppleFl(par,B,b,Df*(.8+.2*hh),cw,hh,cache)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- magnolia (M. × soulangeana, M. stellata, M. liliiflora 'Nigra', 'Yellow Bird'): stout smooth grey wood with pale lenticels, few nodes, short side shoots; the flowers
   stand alone at the tips of the shoots, upright, before the leaves, out of a large furry bud (the perule: silvery grey silk) which splits and slides off, the tepals showing at its tip;
   × soulangeana: a goblet (tulip) of nine tepals 8–12 cm, the three outer smaller, white inside, flushed rose-purple outside from the foot; stellata: a star of 12–18 narrow white
   (or pink-flushed) strap tepals, 8–10 cm; at the centre a column of green carpels over a ring of cream to pink stamens; the leaf buds small, furry, along the shoots ---------- */
const L55_MAG=[{id:'soul',n:'Blanc lavé de rose pourpre (M. × soulangeana)',c:'#e8b4c8',in:'#fbf3f2',out:'#b0507a',bud:'#b8b2a6'},
 {id:'alba',n:'Blanc (M. × soulangeana Alba Superba)',c:'#faf6ef',in:'#fcf9f4',out:'#efdcd8',bud:'#b8b4aa'},{id:'nigra',n:'Pourpre (M. liliiflora Nigra)',c:'#7a2f5e',in:'#ead2de',out:'#6a2252',bud:'#aaa49c'},
 {id:'jaune',n:'Jaune primevère (Yellow Bird)',c:'#efe4a0',in:'#f6eebc',out:'#c8c068',bud:'#b4b2a0'},
 {id:'stellata',n:'Blanc étoilé (M. stellata)',c:'#f8f3ee',in:'#fbf8f4',out:'#f2e4e0',bud:'#bcb8ae',st:1},{id:'rosea',n:'Rose tendre étoilé (M. stellata Rosea)',c:'#f3dde3',in:'#f8eaee',out:'#e09ab4',bud:'#bcb6ae',st:1}];
const L55_WP_MAG=prof([[0,.3],[.15,.55],[.45,.9],[.72,1],[.9,.9],[1,.7]]),L55_WP_STE=prof([[0,.35],[.2,.75],[.5,1],[.8,.95],[1,.75]]);
function l55MagFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,rot=R(0,1),ink=shd(mix(cw.out,'#8a7a70',.5),-.35);let layers;
  if(cw.st)layers=[{n:8,r0:Rr*.1,L:Rr*.95,W:Rr*.17,a0:.25+(1-h)*1.15,a1:.05+(1-h)*1.35,wp:L55_WP_STE,cu:.25,ht:.3,col:cw.in,colB:mix(cw.in,cw.out,.5),rot,jit:.12,jl:.12,ao:.95,fl:[[cw.out,.4,.75]],flS:'out',sep:1},
    {n:7,r0:Rr*.08,L:Rr*.85,W:Rr*.16,a0:.55+(1-h)*.9,a1:.35+(1-h)*1.1,wp:L55_WP_STE,cu:.3,ht:.3,col:cw.in,colB:mix(cw.in,cw.out,.5),rot:rot+.4,jit:.15,jl:.15,ao:.88,fl:[[cw.out,.4,.75]],flS:'out',sep:1}];
  else{const pale=mix(cw.in,cw.out,.22),fl=[[cw.out,.8,.25],[cw.out,.62,.3],[cw.out,.42,.45]];
    layers=[{n:3,r0:Rr*.12,L:Rr*.66,W:Rr*.26,a0:.4+(1-h)*.6,a1:.8+(1-h)*1.2,wp:L55_WP_MAG,cu:.3,ht:.3,col:cw.in,colB:mix(pale,'#a8b080',.2),rot,jit:.1,jl:.1,ao:.9,fl,flS:'out'},
    {n:3,r0:Rr*.1,L:Rr*1.04,W:Rr*.46,a0:.6+(1-h)*.45,a1:1.6+(1-h)*.9,wp:L55_WP_MAG,cu:.5,ht:.32,col:cw.in,colB:pale,rot:rot+.52,jit:.08,jl:.06,ao:.92,fl,flS:'out'},
    {n:3,r0:Rr*.08,L:Rr*.98,W:Rr*.44,a0:.85+(1-h)*.35,a1:2+(1-h)*.6,wp:L55_WP_MAG,cu:.55,ht:.32,col:cw.in,colB:pale,rot:rot+1.57,jit:.08,jl:.06,ao:.82,fl,flS:'out'}]}
  const centre=(par,B,O)=>{b29Stamens(par,B,O,{n:DET>=1.5?22:12,r0:Rr*.07,r1:Rr*.16,h:Rr*.12,fc:'#e8d8c0',ac:mix(cw.out,'#e8c8b0',.5),ar:Math.max(.55,Rr*.035)});
    E('path',{d:smooth(b29Rev(B,O,Rr*(cw.st?.24:.36),Rr*(cw.st?.06:.08),t=>1-.6*t*t,0,1,4,8)),fill:budFill('#b4bc78'),stroke:'#4a5a20','stroke-width':.3,'stroke-opacity':.6},par)};
  l55Corolla(par,B,O,layers,cache,{centre,ink})}
/* the furry bud (perule) of a magnolia, splitting as it swells (s from 0 to 1): the silk, a seam, and over .55 the tepals' tips out of it */
function l55MagBud(par,B,O,len,cw,s,cache){const w=len*.48,hair=mix(cw.bud,'#ffffff',.55);
  if(s>.55){const u=(s-.55)/.45,tl=len*(1+.35*u),sp={n:cw.st?6:3,r0:w*.1,L:tl,W:w*(cw.st?.22:.42),a0:1.42-.15*u,a1:1.48-.1*u,wp:cw.st?L55_WP_STE:L55_WP_MAG,cu:.5,ht:.35,col:cw.in,colB:cw.out,rot:R(0,1),jit:.1,jl:.08,ao:.9,
      fl:cw.out,flk:.55,flS:'out',flo:.85};l55Corolla(par,B,O,[sp],cache,{ink:shd(cw.out,-.35)})}
  const top=s>.55?.45:1;E('path',{d:smooth(b29Rev(B,O,len*top,w*.5*(s>.55?1.05:1),s>.55?(t=>.8+.25*Math.sin(Math.PI*Math.min(1,t*1.1))):B29_CONE,0,1,6,10)),fill:b29Silk(cw.bud),stroke:hair,'stroke-width':.9,'stroke-dasharray':'.5 .7','stroke-opacity':.75},par);
  if(DET>=1.5&&s<=.55){const p0=PJ(B,O,[w*.12,0,len*.15]),p1=PJ(B,O,[w*.06,0,len*.8]);E('path',{d:`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`,stroke:shd(cw.bud,-.25),'stroke-width':.4,'stroke-opacity':.5},par)}}
function l55Magnolia(g,t,o){const cw=cwPick(L55_MAG,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||80)*UPC,
    Df=(cw.st?10:14)*UPC*R(.94,1.06),SC=['#34322f','#66625c','#8c8780','#c4bfb6'],w0=sp?7:Math.min(10.5,3.8+Lt/100),lo=sp?.4:.14;
  const nLat=o.short?1:rnd()<.3?2:rnd()<.75?3:4,cl=(nd,i,q)=>{nd.kink=R(-9,9);nd.org=[{a:R(40,60),k:rnd()<(cw.st?.7:.42)?'fl':'lb'}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.06,.06),wig:.025,e:.05,seg:9,w:w0,w1:2.4,nodes:L=>l55Lats(b29Nodes(L,lo,.94,[4.2*UPC,6*UPC],144,cl,.8),L,nLat,sp?.44:.2,.8,
    q=>({len:L*R(.16,.32)*(1-.35*q)*(sp?.75:1),a:R(30,48),e:.06,w:Math.max(2,w0*.45*(1-.4*q)),w1:1.8,nodes:Ll=>b29Nodes(Ll,.3,.85,[3.6*UPC,5*UPC],144,(nd,i,q)=>{nd.org=[{a:R(40,55),k:'lb'}]},.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>{b29Marks(par,Pp,W,9,'#d8d2c8',{k:.32,sw:.6,so:.45});b29Marks(par,Pp,W,17,'#4a4642',{k:.4,sw:.5,so:.3,along:1})}});
  const flower=(pos,H,wl,j,sh)=>{/* a short flowering shoot ending in the bud or the flower, upright */
    const age=.12+op*1.2-.15*(sh?.5:0)+R(-.22,.16),s=b29C(age/.62),ax=V3.nz(V3.add(V3.sc(H,.55),[R(-.15,.15),.7,R(0,.35)])),sl=sh?Df*R(.12,.22):0,
      se=V3.add(pos,V3.sc(V3.nz(V3.add(H,V3.sc(ax,.6))),sl)),B=spFrame(ax,[0,1,0],R(0,6));if(sp&&se[1]<30)return;
    if(sl)parts.push({z:pos[2]+.03,fn:par=>b29Ped(par,pos,se,Math.max(1.6,wl*.55),SC[1],0)});
    if(age<.62){const len=Df*(.22+.26*s);parts.push({z:se[2]+ax[2]*len*.5,fn:par=>{l55Dorm2(par,B,se,len,cw);l55MagBud(par,B,V3.add(se,V3.sc(ax,len*.05)),len,cw,s,cache)}});return}
    const hh=b29C((age-.62)/.45,.12,1),O=V3.add(se,V3.sc(ax,Df*.03));parts.push({z:se[2]+ax[2]*Df*.25,fn:par=>{l55Dorm2(par,B,se,Df*.2,cw);l55MagFl(par,B,O,Df*(.85+.15*hh),cw,hh,cache)}})};
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;const wl=l55W(og);
    if(og.t==='Tb'){flower(pos,og.H,wl,0,0);continue}
    if(og.p.og.k==='fl'){flower(pos,og.H,wl,0,1);continue}
    /* a leaf bud: small, furry, on a ring scar */
    const B=spFrame(og.H,[0,1,0],0),len=Df*.09,O=V3.add(pos,V3.sc(og.H,wl*.25));parts.push({z:pos[2]+og.H[2]*len*.5,fn:par=>E('path',{d:smooth(b29Rev(B,O,len,len*.5,B29_CONE,0,1,5,8)),fill:b29Silk(shd(cw.bud,-.12)),stroke:shd(cw.bud,-.3),'stroke-width':.4,'stroke-opacity':.6},par)})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}
/* the brown bud scale left at the foot of a flower or a bud */
function l55Dorm2(par,B,O,len,cw){E('path',{d:smooth(b29Rev(B,O,len*.14,len*.22,t=>.85+.15*Math.sin(Math.PI*t),0,1,3,8)),fill:'#6a5a48',stroke:'#2a2018','stroke-width':.3,'stroke-opacity':.6},par)}

/* ---------- the branches in the greenhouse registers: colourways, trade lengths (cm), composer infos (lines along the spine: tip = stiffness, fx = reach of the organs) ---------- */
Object.assign(GH,{'cerisier-du-japon-sato-zakura':l55Sato,'amandier-en-fleurs':l55Almond,'pecher-a-fleurs':l55Peach,'pommier-pommetier-en-fleurs':l55Apple,'magnolia-branches':l55Magnolia});
CWS['cerisier-du-japon-sato-zakura']=L55_SATO;SZG['cerisier-du-japon-sato-zakura']=[60,80,80,100,120];GHI['cerisier-du-japon-sato-zakura']={form:'ligne',size:1,k:'plant',self:75*UPC,tip:.5,fx:5*UPC};
CWS['amandier-en-fleurs']=L55_AMA;SZG['amandier-en-fleurs']=[60,70,80,100];GHI['amandier-en-fleurs']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.6,fx:2.5*UPC};
CWS['pecher-a-fleurs']=L55_PEC;SZG['pecher-a-fleurs']=[60,80,80,100];GHI['pecher-a-fleurs']={form:'ligne',size:1,k:'plant',self:75*UPC,tip:.75,fx:2.5*UPC};
CWS['pommier-pommetier-en-fleurs']=L55_MAL;SZG['pommier-pommetier-en-fleurs']=[50,60,80,100];GHI['pommier-pommetier-en-fleurs']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.55,fx:4*UPC};
CWS['magnolia-branches']=L55_MAG;SZG['magnolia-branches']=[60,80,100,120];GHI['magnolia-branches']={form:'ligne',size:1,k:'plant',self:80*UPC,tip:.7,fx:6*UPC};
for(const s of['cerisier-du-japon-sato-zakura','pecher-a-fleurs','magnolia-branches'])GH_BUDS.add(s);
