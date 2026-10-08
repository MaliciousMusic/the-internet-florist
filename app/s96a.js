/* ================= Serre, lot 96 — arbustes à fleurs : hamamélis, viorne d'hiver, spirée, deutzia, seringat ================= */
/* des rameaux ligneux poussés par le L-système du lot 29 (b29Grow, b29Wood, b29Nodes) avec les corolles, calices, jeunes feuilles et bourgeons du lot 55 (l55Corolla, l55Calyx, l55Leaf3, l55Dorm) ;
   ce lot ajoute les rubans frisés de l'hamamélis (un trait par pétale, ondulé et vrillé en 3D), les bouquets de fleurs tubulaires de la viorne (cymes en demi-sphère, boutons en massue),
   les ombelles de la spirée le long des rameaux arqués (une ombelle tient en quelques chemins au détail de l'appli), et les rameaux feuillés opposés du deutzia et du seringat,
   chacun terminé par sa grappe dressée (axe ombré, pédicelles, boutons, fleurs). Dans le Composer ce sont des lignes qui suivent l'épine (o.spine) et renvoient {k,bw,bc} ;
   toute liaison (pédicelle, pédoncule, pétiole, ruban) fait au moins 1,15 unité et part de sa courbe porteuse */
/* an open smooth stroke through screen points (quadratic through the midpoints) */
function l96Line(P){if(P.length<2)return'';let d=`M${f(P[0][0])},${f(P[0][1])}`;for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];d+=`Q${f(P[i][0])},${f(P[i][1])} ${f(m[0])},${f(m[1])}`}
  const e=P[P.length-1];return d+`L${f(e[0])},${f(e[1])}`}
/* a flat band along screen points P, half widths W (a ribbon petal seen twisting): its outline, closed */
function l96Band(P,W){const A=[],B=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
    A.push([P[i][0]+nx*W[i],P[i][1]+ny*W[i]]);B.push([P[i][0]-nx*W[i],P[i][1]-ny*W[i]])}return smooth(A.concat(B.reverse()))}
/* a curved stalk from a to b (view space), as b29Ped, into a shared path string (one path for a whole umbel) */
function l96PedD(a,b,bend=.12){const A=[a[0],-a[1]],B=[b[0],-b[1]],l=Math.hypot(B[0]-A[0],B[1]-A[1]);if(l<.6)return'';const c=[A[0]+(B[0]-A[0])*.5,A[1]+(B[1]-A[1])*.5+l*bend];
  return`M${f(A[0])},${f(A[1])}Q${f(c[0])},${f(c[1])} ${f(B[0])},${f(B[1])}`}
/* the length of a branch off the composer: the sheet's size; the old recipes of the sprays give a head size (c0 cm, under 30): read it as the default length d, scaled */
const l96Len=(o,d,c0=25)=>(o.cm>=30?o.cm:o.cm?d*o.cm/c0:d)*UPC;
/* the flowering side shoots of an axis: in pairs (opposite) at nLat of its nodes between z0 and z1 of its length, spec(q, side) each shoot */
function l96Pairs(N,L,nLat,z0,z1,spec,pr=.7){const cand=N.filter(nd=>nd.l>L*z0&&nd.l<L*z1);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
  nd.lats=[spec(q,0)];if(rnd()<pr)nd.lats.push(spec(q,180));nd.org=[]}return N}

/* ---------- hamamélis (Hamamelis × intermedia 'Arnold Promise', 'Pallida', 'Jelena', 'Aphrodite', 'Diane', 'Feuerzauber'; H. mollis): bare, zigzag, grey-brown downy shoots, alternate in two ranks,
   short spurs; at almost every node, a tight cluster of two to four flowers almost sessile against the wood, out of a felted bud; each flower a small four-lobed calyx cup, maroon to
   red-brown inside, and four strap petals 1.5–2 cm long and 2 mm wide, crimped and twisted like ribbons, yellow, orange (red at their foot in 'Jelena') or coppery red; in bud the petals are
   rolled up tight in a round, felted grey-brown bud; half open they come out short and curled; the stalked leaf buds, naked and felted, at the tips ---------- */
const L96_HAM=[{id:'arnold',n:'Jaune vif (Arnold Promise)',c:'#f2c41c',cal:'#7a3a22'},{id:'pallida',n:'Jaune soufre (Pallida)',c:'#f1df6c',cal:'#8a4a2a'},
 {id:'mollis',n:'Jaune d\'or (H. mollis)',c:'#eeb21e',cal:'#6a2a1e'},{id:'jelena',n:'Orange cuivré (Jelena)',c:'#ea8a30',c0:'#c4402a',cal:'#5a1e18'},
 {id:'aphrodite',n:'Orange (Aphrodite)',c:'#ef8e20',c0:'#dc6420',cal:'#5a1e18'},{id:'diane',n:'Rouge cuivré (Diane)',c:'#b63c28',c0:'#8c2420',cal:'#4a1814'},
 {id:'feuerzauber',n:'Rouge orangé (Feuerzauber)',c:'#d8582a',c0:'#b03624',cal:'#4a1814'}];
/* a flower: the calyx (its maroon inside seen from the front, its felted outside from behind) and four ribbons, each a crimped, twisted 3D centreline drawn as a band (ink, body, foot) */
function l96HamFl(par,B,O,Rr,cw,h){const nz=B[2][2],rot=R(0,1.57),len=Rr*(.22+.78*h),el=1.3-1*h,wid=Math.max(.95,Rr*.088),am=Rr*.06*(.35+.65*h),C=[];
  for(let i=0;i<4;i++){const ph=rot+i*1.5708+R(-.3,.3),c=Math.cos(ph),s=Math.sin(ph),L=len*R(.82,1.05),e=el+R(-.18,.18),wv=R(3.2,4.6),wp=R(0,6.28),tw=R(5,8),tp=R(0,3),pts=[],W=[];
    for(let j=0;j<=10;j++){const v=j/10,r0=Rr*.1+L*v*Math.cos(e),x=am*Math.sin(v*wv*Math.PI+wp)*v,z=L*v*Math.sin(e)+am*.8*Math.cos(v*wv*4+wp)*v-Rr*.12*v*v*h;const p=PJ(B,O,[c*r0-s*x,s*r0+c*x,z]);pts.push([p[0],p[1]]);
      W.push(Math.max(.6,wid*(.3+.7*Math.abs(Math.cos(v*tw+tp)))*(1-.45*v*v)))}
    C.push({P:pts,W})}
  const cal=()=>l55Calyx(par,B,O,Rr*.42,nz>=0?cw.cal:'#6e5a40',{n:4,rf:.12,sl:.36,sw:.12,cl:.35,cw:.3});
  if(nz>=0){cal();b29Disc(par,B,O,Rr*.12,Rr*.02,shd(cw.cal,-.15))}
  const ink=shd(cw.c0||cw.c,-.45);
  E('path',{d:C.map(q=>l96Band(q.P,q.W)).join(''),fill:cw.c,stroke:ink,'stroke-width':.4,'stroke-opacity':.7},par);
  if(cw.c0)E('path',{d:C.map(q=>l96Band(q.P.slice(0,4),q.W.slice(0,4))).join(''),fill:cw.c0,stroke:ink,'stroke-width':.3,'stroke-opacity':.5},par);
  if(DET>=1.5)E('path',{d:C.map(q=>l96Line(q.P.slice(3))).join(''),stroke:mix(cw.c,'#fff8e0',.45),'stroke-width':.4,fill:'none','stroke-linecap':'round','stroke-opacity':.55},par);
  if(nz<0)cal()}
function l96Hamamelis(g,t,o){const cw=cwPick(L96_HAM,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],sp=!!o.spine,Lt=sp?blen(o.spine):l96Len(o,65),
    Df=3.4*UPC*R(.94,1.06),SC=['#2a221c','#54463a','#78685a','#a89a88'],w0=sp?5.5:Math.min(8.5,2.8+Lt/110),lo=sp?.34:.1,fe='#7a6650';
  const nLat=o.short?0:rnd()<.25?1:rnd()<.6?2:3,cl=(nd,i,q)=>{nd.kink=R(-6,6);if(rnd()<.9)nd.org=[{a:R(50,72),n:rnd()<.2?2:rnd()<.65?3:4}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.035,e:.04,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.95,[1.5*UPC,2.2*UPC],180,cl,.8),L,nLat,sp?.42:.2,.75,
    q=>({len:L*R(.2,.36)*(1-.4*q)*(sp?.8:1),a:R(32,50),e:.04,w:Math.max(1.6,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.14,.94,[1.4*UPC,2*UPC],180,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,9,'#b8a892',{k:.35,sw:.55,so:.4})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    /* the stalked, naked leaf bud at a tip */
    if(og.t==='Tb'){const B=spFrame(og.H,[0,1,0],0),q=V3.add(pos,V3.sc(og.H,Df*.05));parts.push({z:pos[2]+.2,fn:par=>{b29Ped(par,pos,q,1.3,fe,0);spBud(par,B,q,Df*.2,Df*.08,'#8a7458',{tp:.45,pw:.6})}});continue}
    const nF=og.p.og.n,wl=l55W(og),age0=.05+op*1.25-.3*og.a+R(-.14,.1),se=V3.add(pos,V3.sc(og.H,wl*.35+Df*.03));
    for(let j=0;j<nF;j++){const age=age0+R(-.08,.08),dj=b29Spread(og.H,og.U,og.L,j*6.283/nF+R(-.4,.4),R(.6,.9),[0,.1,0]),b=V3.add(se,V3.sc(dj,Df*.05));if(sp&&b[1]<28)continue;
      const ax=V3.nz(V3.add(dj,[R(-.1,.1),R(0,.15),R(.1,.4)])),B=spFrame(ax,[0,1,0],R(-.4,.4));
      if(age<.3){const bs=Df*(.11+.05*b29C(age/.3));parts.push({z:b[2]+ax[2]*bs*.5,fn:par=>{b29Ped(par,pos,b,1.3,fe,0);spBud(par,B,V3.add(b,V3.sc(ax,-bs*.15)),bs,bs*.92,'#8c7658',{tp:.15,pw:.45})}});continue}
      const h=b29C((age-.3)/.45,.1,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,pos,b,1.3,fe,0);l96HamFl(par,B,b,Df/2,cw,h)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- viorne d'hiver (Viburnum × bodnantense 'Dawn', 'Charles Lamont', 'Deben'; V. farreri 'Candidissimum'): stiff upright shoots, grey-brown with pale lenticels, the buds opposite;
   on the bare wood, at the tips and in pairs at the upper nodes on short stalks, dense rounded clusters (3–5 cm) of fifteen to thirty small tubular flowers: a tube about 1 cm, deep pink,
   flaring into five round, spreading lobes (1.2 cm across), pink fading to blush white, scented; the buds club-shaped, deep rose; the narrow, pointed leaf buds red-brown ---------- */
const L96_VIB=[{id:'dawn',n:'Rose (Dawn)',c:'#f3c4d6',tb:'#e07aa2',bud:'#b8326a'},{id:'lamont',n:'Rose vif (Charles Lamont)',c:'#efa6c2',tb:'#d8558a',bud:'#a82258'},
 {id:'deben',n:'Blanc rosé (Deben)',c:'#f9ebef',tb:'#f0bccd',bud:'#d87aa0'},{id:'farreri',n:'Blanc (V. farreri Candidissimum)',c:'#f9f7ef',tb:'#eceed8',bud:'#d4d8b0'}];
const L96_WP_VIB=prof([[0,.4],[.2,.8],[.55,1],[.85,.86],[1,.6]]);
/* a cluster: florets spread over a half sphere round its axis ca, each a tube (or a club-shaped bud) and its five lobes, in the painter's order with the rest */
function l96VibCluster(parts,cc,ca,U,Dfl,cw,age0,cache,sp){const n=DET>=1.5?22:12,tl=Dfl*.8,Rr=Dfl/2,V=V3.nz(V3.cr(ca,U)),U2=V3.cr(V,ca);
  for(let i=0;i<n;i++){const th=Math.acos(1-(i+.5)/n*1.1)*.95+R(-.08,.08),ph=i*2.39996+R(-.2,.2),dj=V3.nz(V3.add(V3.sc(ca,Math.cos(th)),V3.add(V3.sc(U2,Math.sin(th)*Math.cos(ph)),V3.sc(V,Math.sin(th)*Math.sin(ph))))),
      age=age0+.25*th-R(0,.28),base=V3.add(cc,V3.sc(dj,Dfl*.24));if(sp&&base[1]<28)continue;const B=spFrame(dj,[0,1,0],R(0,6.28));
    if(age<.45){const u=b29C(age/.45),s=tl*(.7+.4*u),bc=mix(cw.bud,cw.tb,.4*u),bd=V3.nz(V3.add(dj,V3.sc(ca,1.3-u))),b0=V3.add(cc,V3.sc(bd,Dfl*.1)),Bb=spFrame(bd,[0,1,0],0);
      parts.push({z:b0[2]+bd[2]*s*.6,fn:par=>spBud(par,Bb,b0,s,s*(.26+.06*u),bc,{tp:-.3,pw:.5})});continue}
    const h=b29C((age-.45)/.35,.25,1),top=V3.add(base,V3.sc(dj,tl)),tb=tubeFlat(B,base,[[0,0,0],[0,0,tl*.5],[0,0,tl]],Math.max(.6,Rr*.13),Math.max(.62,Rr*.17),toneAt(pal7(cw.tb),.55),{ink:shd(cw.tb,-.45),eo:.4}),
      cs={n:5,r0:Rr*.12,L:Rr*.78,W:Rr*.3,a0:1-.8*h,a1:.9-.8*h,wp:L96_WP_VIB,cu:.12,ht:.3,col:cw.c,colB:mix(cw.c,cw.tb,.35),rot:R(0,1.2),jit:.1,jl:.08,ao:.95,
        centre:DET>=1.5?(par,B,O)=>b29Disc(par,B,O,Rr*.12,Rr*.04,shd(cw.tb,-.2)):null};
    parts.push({z:top[2],fn:par=>{const nz=B[2][2];if(nz>=0){tb.fn(par);b29Corolla(par,B,top,cs,cache)}else{b29Corolla(par,B,top,cs,cache);tb.fn(par)}}})}}
function l96Viburnum(g,t,o){const cw=cwPick(L96_VIB,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):l96Len(o,65,20),
    Dfl=1.35*UPC*R(.95,1.05),SC=['#2a201c','#54443a','#7a685a','#a8988a'],w0=sp?5.5:Math.min(8.5,2.8+Lt/110),lo=sp?.34:.1,pc='#6a4a3a';
  const nLat=o.short?0:rnd()<.35?1:2,cl=(nd,i,q)=>{nd.org=[];for(const s of[0,180])nd.org.push({dphi:s,a:R(40,58),fl:q>.45&&rnd()<.55})};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.06,.06),wig:.025,e:.05,seg:9,w:w0,w1:1.6,nodes:L=>l55Lats(b29Nodes(L,lo,.93,[3.2*UPC,4.6*UPC],90,cl,.75),L,nLat,sp?.45:.3,.7,
    q=>({len:L*R(.2,.32)*(1-.3*q)*(sp?.8:1),a:R(24,36),e:.05,w:Math.max(1.8,w0*.45*(1-.4*q)),w1:1.5,nodes:Ll=>b29Nodes(Ll,.2,.85,[2.8*UPC,3.6*UPC],90,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,9,'#c4b4a2',{k:.4,sw:.55,so:.4})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    const tip=og.t==='Tb',fl=tip||og.p.og.fl,wl=tip?1.5:l55W(og);
    if(!fl){const B=spFrame(og.H,[0,1,0],0);parts.push({z:pos[2]+og.H[2]*2,fn:par=>spBud(par,B,V3.add(pos,V3.sc(og.H,-wl*.1)),Dfl*.42,Dfl*.13,'#7a3a2a',{tp:.7,pw:.6})});continue}
    /* the stalk, then the cluster at its end, looking out and up */
    const age0=.1+op*1.15-.25*og.a+R(-.12,.1),sl=tip?Dfl*.25:Dfl*R(.45,.8),ca=V3.nz(V3.add(og.H,[0,tip?.2:.45,R(0,.3)])),cc=V3.add(pos,V3.sc(ca,sl+Dfl*.15));if(sp&&cc[1]<34)continue;
    parts.push({z:pos[2]+ca[2]*sl*.5,fn:par=>{b29Ped(par,pos,cc,Math.max(1.5,wl*.6),pc,.05);E('path',{d:smooth(b29Rev(spFrame(ca,[0,1,0],0),cc,-Dfl*.12,Dfl*.2,t=>.7+.3*t,0,1,3,8)),fill:'#6a4a36',stroke:'#2a1a12','stroke-width':.3,'stroke-opacity':.5},par)}});
    l96VibCluster(parts,cc,ca,og.U,Dfl*(tip?1.05:1),cw,age0,cache,sp)}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- spirée (Spiraea × vanhouttei; S. thunbergii et 'Fujino Pink'; S. × cinerea 'Grefsheim'): long, thin, arching red-brown rods, the buds alternate; all along their upper side,
   umbels of small white flowers (7–9 mm, five round petals, a greenish-yellow disc, some twenty stamens): in × vanhouttei eight to fifteen on 1–1.5 cm pedicels at the end of a short leafy
   spur, with two or three small rhombic, toothed leaves; in thunbergii and 'Grefsheim' three to six, almost sessile, among tufts of narrow, pale green leaves; the buds round, greenish
   white (pink in 'Fujino Pink'). An umbel at the app's detail is a handful of paths: its pedicels, its buds, its petals, its centres ---------- */
const L96_SPI=[{id:'vanhouttei',n:'Blanc (S. × vanhouttei)',c:'#fbfaf3',bud:'#eef0da',eye:'#d4cf72',lf:'#6e8e48',f:'v'},{id:'grefsheim',n:'Blanc pur (S. × cinerea Grefsheim)',c:'#fcfbf7',bud:'#e8ecd2',eye:'#d6cc66',lf:'#8a9e5a',f:'t'},
 {id:'thunbergii',n:'Blanc neige (S. thunbergii)',c:'#fafaf2',bud:'#e2e8cc',eye:'#cfcf72',lf:'#94b25a',f:'t'},{id:'fujino',n:'Blanc rosé (S. thunbergii Fujino Pink)',c:'#f8e4ea',bud:'#e6a2b8',eye:'#d6bc62',lf:'#94b25a',f:'t'}];
const L96_WP_SPI=prof([[0,.3],[.15,.66],[.45,.98],[.75,1],[.92,.82],[1,.6]]),L96_WPL_THU=prof([[0,.2],[.2,.8],[.5,1],[.8,.7],[1,.05]]);
function l96Umbel(par,base,fl,Df,cw,cache){const det=DET>=1.5,Rr=Df/2,ink=mix(shd(cw.c,-.5),'#8a9a7a',.4);let dp='',db='';const fls=[];
  for(const q of fl){dp+=l96PedD(base,q.b,.1);if(q.age<.4){const s=Df*(.24+.14*b29C(q.age/.4)),p=[q.b[0]+q.ax[0]*s*.4,-(q.b[1]+q.ax[1]*s*.4)];db+=`M${f(p[0]-s/2)},${f(p[1])}a${f(s/2)},${f(s/2)} 0 1,0 ${f(s)},0a${f(s/2)},${f(s/2)} 0 1,0 ${f(-s)},0`}else fls.push(q)}
  if(dp)E('path',{d:dp,stroke:'#a8b87a','stroke-width':1.15,fill:'none','stroke-linecap':'round'},par);if(db)E('path',{d:db,fill:budFill(cw.bud),stroke:shd(cw.bud,-.45),'stroke-width':.3,'stroke-opacity':.55},par);
  if(!fls.length)return;fls.sort((a,b)=>a.b[2]-b.b[2]);
  const spf=(q)=>({n:5,r0:Rr*.12,L:Rr*.85,W:Rr*.5,a0:.25+(1-q.h)*.9,a1:.3+(1-q.h)*1.1,wp:L96_WP_SPI,cu:.2,ht:.3,col:cw.c,colB:mix(cw.c,'#dfe4cc',.3),rot:q.rot,jit:.08,jl:.06,ao:.95,ink});
  if(det){for(const q of fls){const sp=spf(q);sp.centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.15,Rr*.05,cw.eye);b29Stamens(par,B,O,{n:14,r0:Rr*.12,r1:Rr*.4,h:Rr*.28,fc:mix(cw.c,'#fffbe8',.5),ac:'#e0d890',ar:.32})};b29Corolla(par,q.B,q.b,sp,cache)}return}
  /* the app's detail (a flower a few pixels wide): every flower of the umbel its open cup, scalloped in five, all in one path; every centre in one */
  let dP='',dC='',I=0,m=0;for(const q of fls){const a0=.25+(1-q.h)*.9,P=[];for(let i=0;i<10;i++){const a=q.rot+i*.62832,r=Rr*(i%2?.8:.98)*Math.cos(a0*.6),p=PJ(q.B,q.b,[Math.cos(a)*r,Math.sin(a)*r,Rr*.9*Math.sin(a0*.6)]);P.push([p[0],p[1]])}
    dP+=smooth(P);I+=lightI(q.B[2][2]>=0?q.B[2]:V3.sc(q.B[2],-1));m++;if(q.B[2][2]>-.1)dC+=smooth(spDisc(q.B,q.b,Rr*.15,Rr*.5*Math.sin(a0*.6),8))}
  E('path',{d:dP,fill:toneAt(pal7(cw.c),.55+.4*b29C(I/m,0,1)),stroke:ink,'stroke-width':.3,'stroke-opacity':.45},par);if(dC)E('path',{d:dC,fill:cw.eye},par)}
function l96Spiraea(g,t,o){const cw=cwPick(L96_SPI,o),va=cw.f==='v',op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):l96Len(o,65),
    Df=(va?.9:.85)*UPC*R(.95,1.05),SC=['#2e1a14','#5e3426','#86503a','#b88a72'],w0=sp?4.6:Math.min(6.5,2.4+Lt/130),lo=sp?.36:.1,sd=rnd()<.5?1:-1;
  const nLat=o.short?0:rnd()<.35?1:2,cl=(nd,i,q)=>{nd.kink=R(-4,4);if(rnd()<.92)nd.org=[{a:R(30,50),n:va?Math.floor(R(14,20)):Math.floor(R(7,11))}]};
  const P=b29Grow(o,Lt,{face:R(-.5,.5),arch:sd*R(.55,.85),wig:.02,e:0,seg:9,w:w0,w1:1.2,nodes:L=>{const N=b29Nodes(L,lo,.97,[(va?1.6:1.2)*UPC,(va?2.3:1.7)*UPC],144,cl,.8);
    const cand=N.filter(nd=>nd.l>L*(sp?.42:.2)&&nd.l<L*.6);for(let m=0;m<nLat&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
      nd.lats=[{len:L*R(.28,.42)*(1-.4*q)*(sp?.75:1),a:R(22,34),e:sp?.005:-.025,dphi:R(-40,40)+(rnd()<.5?90:-90),w:Math.max(1.5,w0*.5*(1-.4*q)),nodes:Ll=>b29Nodes(Ll,.08,.96,[(va?1.5:1.1)*UPC,(va?2.1:1.6)*UPC],144,cl,.8)}]}
    return N}});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,11,'#c8a890',{k:.35,sw:.5,so:.35})});
  const up=[0,1,0];
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){const B=spFrame(og.H,up,0);parts.push({z:pos[2]+.2,fn:par=>spBud(par,B,pos,Df*.45,Df*.22,'#8a5a3a',{tp:.6,pw:.6})});continue}
    const nF=og.p.og.n,wl=l55W(og),age0=.12+op*1.2-.3*og.a+R(-.14,.1),uh=V3.nz(V3.add(og.H,[0,.7,R(.1,.5)])),sl=va?Df*R(.5,.9):Df*.12,se=V3.add(pos,V3.sc(uh,wl*.35+sl));if(sp&&se[1]<30)continue;
    /* the spur and its leaves */
    const nL=2,lc=mix(cw.lf,'#a8c070',R(0,.25));
    for(let j=0;j<nL;j++){const H=b29Spread(og.H,og.U,og.L,j*6.283/nL+R(-.5,.5),.8,[0,-.15,0]),len=Df*(va?R(1.6,2.3):R(1.3,1.9))*b29C(.45+.6*age0,.4,1),pf=V3.add(se,V3.sc(H,Df*.15));
      if(sp&&pf[1]<30)continue;parts.push({z:se[2]+H[2]*len*.4-.03,fn:par=>l55Leaf3(par,se,pf,H,len,len*(va?.55:.2),lc,{dr:.2,fd:.25,roll:R(-.3,.3),pc:shd(lc,-.15),wp:va?L55_WPL:L96_WPL_THU,pw:1.15})})}
    const fl=[];for(let j=0;j<nF;j++){const age=age0-.1*rnd()-(j%3)*.04,dj=b29Spread(uh,og.U,og.L,j*2.39996+R(-.2,.2),Math.sqrt((j+.5)/nF)*1.25,[0,.1,0]),pl=(va?R(1,1.5):R(.9,1.4))*UPC,b=V3.add(se,V3.sc(dj,pl));
      if(sp&&b[1]<28)continue;const ax=V3.nz(V3.add(dj,[R(-.1,.1),.15,R(.35,.7)]));fl.push({b,ax,age,B:spFrame(ax,up,R(-.3,.3)),h:b29C((age-.4)/.3,.25,1),rot:R(0,1.2)})}
    parts.push({z:se[2]+.15,fn:par=>{b29Ped(par,pos,se,Math.max(1.2,wl*.5),'#6a3a2a',.04);l96Umbel(par,se,fl,Df,cw,cache)}})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- the leafy flowering shoots of deutzia and mock orange: on last year's brown wood, at the upper nodes, pairs of young side shoots with one to three pairs of opposite leaves,
   each ending in an upright raceme (a shaded axis, its flowers on pedicels in crossing pairs, the youngest at the top, the terminal one older in mock orange); S the species:
   Df flower size, Lr raceme length (×Df), nF flowers, pl pedicel (×Df), fl(par,B,O,Df,cw,h,cache) the flower, bud(par,B,O,s,cw,u) its bud, lf leaf colour, lw leaf length (×Df), lr width ratio ---------- */
function l96Raceme(parts,og,S,cw,age0,cache,sp){const Df=S.Df,Lr=Df*S.Lr*R(.85,1.15),rH=V3.nz(V3.add(og.H,[0,.8,0])),up=[0,1,0],ben=V3.nz(V3.add(up,V3.sc(rH,-.5))),n=S.nF(),
    at=t=>V3.add(V3.add(og.pos,V3.sc(rH,Lr*t)),V3.sc(ben,Lr*.1*t*t)),AX=[];for(let i=0;i<=6;i++)AX.push(at(i/6));if(sp&&AX[6][1]<30)return;
  const Pp=AX.map(q=>[q[0],-q[1]]),W=AX.map((q,i)=>1.9-.6*i/6);let z=0;for(const q of AX)z+=q[2];parts.push({z:z/7,fn:par=>stemPoly(par,Pp,W,S.rc)});
  const ph0=R(0,6.28),V=V3.nz(V3.cr(rH,[0,0,1])),U=V3.cr(V,rH);
  for(let i=0;i<n;i++){const term=i===n-1,tq=term?1:.08+.86*i/Math.max(1,n-1),a=at(tq),az=ph0+Math.floor(i/2)*1.5708+(i%2)*3.1416+R(-.3,.3),
      age=age0+(term?S.tAge:-.5*tq)+R(-.06,.06),dj=term?V3.nz(V3.add(rH,[0,.3,0])):V3.nz(V3.add(V3.add(V3.sc(U,Math.cos(az)),V3.sc(V,Math.sin(az))),V3.sc(rH,.7))),
      ps=age<.4?.6+.4*b29C(age/.4):1,b=V3.add(a,V3.sc(dj,Df*S.pl*ps*(term?.6:1)));if(sp&&b[1]<28)continue;
    const ax=V3.nz(V3.add(dj,[R(-.1,.1),R(-.1,.15),R(.15,.45)])),B=spFrame(ax,up,R(-.4,.4));
    if(age<.4){const u=b29C(age/.4);parts.push({z:b[2]+ax[2]*Df*.1,fn:par=>{b29Ped(par,a,b,1.2,S.pc,.08);S.bud(par,B,b,Df*(.2+.2*u),cw,u)}});continue}
    const h=b29C((age-.4)/.32,.2,1);parts.push({z:b[2]+.1,fn:par=>{b29Ped(par,a,b,1.2,S.pc,.08);S.fl(par,B,b,Df*(.8+.2*h),cw,h,cache)}})}}
function l96Leafy(g,t,o,list,S){const cw=cwPick(list,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):l96Len(o,60),
    Df=S.D*UPC*R(.95,1.05),w0=sp?5.5:Math.min(8,2.8+Lt/115),lo=sp?.38:.12;S.Df=Df;
  const nLat=o.short?1:(S.nLat||3)+Math.floor(R(0,2)),nd0=(nd,i,q)=>{nd.org=[{dphi:0,a:50,dorm:1},{dphi:180,a:50,dorm:1}]},
    lnd=(nd,i,q)=>{nd.org=[{dphi:0,a:R(48,62),lf:1},{dphi:180,a:R(48,62),lf:1}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.025,e:.05,seg:9,w:w0,w1:1.7,nodes:L=>{const N=b29Nodes(L,lo,.8,[4*UPC,5.5*UPC],90,nd0,.8);
    /* the top of the branch is a young shoot too: its last nodes in leaf */
    for(let l=L*.84,i=0;l<L*.97;l+=R(2.6,3.4)*UPC,i++){const nd={l,phi:N.length?N[N.length-1].phi+90*(i+1):0};lnd(nd);N.push(nd)}
    return l96Pairs(N,L,nLat,sp?.45:.32,.8,(q,s)=>({len:Df*R(1.6,2.6)*(1-.3*q),a:R(30,45),e:.06,dphi:s+R(-15,15),w:Math.max(1.6,w0*.32),w1:1.7,wig:.02,nodes:Ll=>b29Nodes(Ll,.4,.9,[Ll*(S.ls||.25),Ll*(S.ls||.25)*1.4],90,lnd,.9)}),.75)}});
  b29Wood(parts,P.chains,(q,ch)=>ch.ord||q>.8?S.yc:S.SC,{piece:9,deco:(par,Pp,W,ch)=>{if(!ch.ord)b29Marks(par,Pp,W,7,S.mk,{k:.3,sw:.6,so:.45,along:1,off:.4})}});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    const age0=.14+op*1.2-.18*og.a+R(-.1,.08);
    if(og.t==='Tb'){l96Raceme(parts,og,S,cw,age0,cache,sp);continue}
    const sg=og.p.og;if(sg.dorm){l55Dorm(parts,V3.add(pos,V3.sc(og.H,l55W(og)*.3)),og.H,Df*.12,'#6a4a34');continue}
    /* a leaf on a short petiole, out and a little down, its face toward the light */
    const H=V3.nz(V3.add(og.H,[0,-.1,R(0,.25)])),len=Df*S.lw*R(.85,1.1)*(og.p.ax.L<Df*3?.85:1),pf=V3.add(pos,V3.sc(H,Df*.12));if(sp&&pf[1]<30)continue;
    parts.push({z:pos[2]+H[2]*len*.4-.02,fn:par=>l55Leaf3(par,pos,pf,H,len,len*S.lr,mix(cw.lf||S.lf,'#8aa850',R(0,.2)),{dr:.24,fd:.26,roll:R(-.3,.3),pc:shd(S.lf,-.15),wp:S.wp,pw:1.2})})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:S.SC}}

/* ---------- deutzia (D. gracilis 'Nikko', D. × hybrida 'Mont Rose' et 'Strawberry Fields', D. scabra 'Pride of Rochester', D. × rosea, D. × elegantissima 'Rosealind'): peeling brown wood;
   leafy side shoots with lanceolate, finely toothed, rough leaves; upright racemes or panicles 4–9 cm of starry flowers 1.5–2.5 cm: five oblong petals, white or pale pink (pink to carmine
   on their backs in the pink forms), spreading in a star (gracilis, 'Mont Rose') or held in an open bell (× rosea, 'Rosealind'), or double with crisped petals ('Pride of Rochester');
   ten stamens with white winged filaments and yellow anthers round the styles; a small grey-green star of calyx lobes; the buds egg-shaped, white or pink ---------- */
const L96_DEU=[{id:'gracilis',n:'Blanc étoilé (D. gracilis Nikko)',c:'#fbfaf4',back:'#f0eee0',bud:'#eef0dc',f:'s'},{id:'monrose',n:'Rose étoilé (Mont Rose)',c:'#f2c8d8',back:'#d87aa0',bud:'#d06a94',f:'s'},
 {id:'strawberry',n:'Rose vif (Strawberry Fields)',c:'#eeb0c6',back:'#c8487a',bud:'#b83a6a',f:'s'},{id:'rochester',n:'Blanc double (Pride of Rochester)',c:'#fbf6f4',back:'#f0d4dc',bud:'#ead0d8',f:'d'},
 {id:'rosea',n:'Rose pâle en clochette (D. × rosea)',c:'#f6dce4',back:'#e2a2b8',bud:'#da94ae',f:'b'},{id:'rosealind',n:'Rose carmin en clochette (Rosealind)',c:'#f0c2d0',back:'#c44a72',bud:'#b03a64',f:'b'}];
const L96_WP_DEU=prof([[0,.3],[.15,.62],[.45,.96],[.7,1],[.9,.8],[1,.45]]),L96_WPL_DEU=prof([[0,.14],[.12,.6],[.32,.96],[.5,1],[.75,.66],[.92,.26],[1,0]]);
function l96DeutziaFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],bell=cw.f==='b',dbl=cw.f==='d',rot=R(0,1.2),cB=cw.back,
    L1={n:5,r0:Rr*.12,L:Rr*.9,W:Rr*(dbl?.4:.3),a0:bell?.95+(1-h)*.4:.12+(1-h)*1.1,a1:bell?.75+(1-h)*.55:.05+(1-h)*1.25,wp:L96_WP_DEU,cu:.14,ht:.25,col:cw.c,colB:cB,rot,jit:.08,jl:.06,ao:.95,fr:dbl?2:0,fd:.05},
    L2={n:5,r0:Rr*.1,L:Rr*.72,W:Rr*.32,a0:.5+(1-h)*.8,a1:.4+(1-h)*.9,wp:L96_WP_DEU,cu:.2,ht:.25,col:cw.c,colB:mix(cB,cw.c,.3),rot:rot+.63,jit:.15,jl:.1,ao:.88,fr:2,fd:.06},
    L3={n:5,r0:Rr*.06,L:Rr*.48,W:Rr*.26,a0:.95+(1-h)*.4,a1:.9+(1-h)*.4,wp:L96_WP_DEU,cu:.25,ht:.25,col:cw.c,colB:mix(cB,cw.c,.4),rot:rot+.3,jit:.2,jl:.15,ao:.8,fr:1,fd:.06},
    centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.12,Rr*.06,'#e4e0b0');if(dbl)return;b29Stamens(par,B,O,{n:10,r0:Rr*.1,r1:Rr*(bell?.18:.26),h:Rr*(bell?.5:.32),fc:'#fbfaf0',fw:.7,ac:'#e8c032',ar:Math.max(.42,Rr*.06)});
      if(DET>=1.5)b29Disc(par,B,O,Rr*.035,Rr*.46,'#d8e0b0')};
  const cal=()=>l55Calyx(par,B,O,Rr*.55,'#7a8a5a',{n:5,rf:.04,sl:.3,sw:.08,cl:.4,cw:.28});
  if(nz>=-.05&&(DET>=1.5||nz<.35))cal();l55Corolla(par,B,O,dbl?[L1,L2,L3]:[L1],cache,{centre,ink:shd(cw.back,-.35)});if(nz<-.05)cal()}
function l96DeutziaBud(par,B,O,s,cw,u){spBud(par,B,O,s,s*.62,mix(cw.bud,cw.c,.35*u),{tp:.4,pw:.55});E('path',{d:smooth(b29Rev(B,O,s*.22,s*.3,t=>.6+.4*t,0,1,3,8)),fill:'#7a8a5a',stroke:'#3a4220','stroke-width':.3,'stroke-opacity':.5},par)}
const L96_DEU_S={D:1.9,Lr:4.2,nF:()=>DET>=1.5?Math.floor(R(14,19)):Math.floor(R(9,12)),pl:.36,nLat:4,ls:.45,tAge:.02,fl:l96DeutziaFl,bud:l96DeutziaBud,pc:'#7a7a4a',rc:['#3e3a22','#6a6a3e','#8e8e5c','#b8b88a'],
  lf:'#6e8a4a',lw:2.4,lr:.32,wp:L96_WPL_DEU,SC:['#2e1e16','#5a4030','#7e6450','#ae9682'],yc:['#3a2a1c','#7a5a3a','#9a7a56','#c4a884'],mk:'#c8b49a'};
function l96Deutzia(g,t,o){return l96Leafy(g,t,o,L96_DEU,L96_DEU_S)}

/* ---------- seringat (Philadelphus coronarius; 'Virginal', 'Minnesota Snowflake', 'Manteau d'Hermine', 'Belle Étoile', 'Sybille'): brown wood, peeling on the old stems; leafy side shoots
   with ovate, lightly toothed leaves (three main veins); short racemes of five to nine flowers, the terminal one opening first: four broad, rounded petals, pure or creamy white, held in
   an open cup, single (3–4.5 cm), with a purple-red flare at their foot in 'Belle Étoile' and 'Sybille', or double ('Virginal', 'Minnesota Snowflake', the small 'Manteau d'Hermine'), round a dense
   boss of golden stamens; four green ovate sepals; the buds white-green, egg-shaped and pointed ---------- */
const L96_PHI=[{id:'coronarius',n:'Blanc crème (P. coronarius)',c:'#faf6e6',back:'#f0ead0',f:'s',D:3.3},{id:'belle',n:'Blanc à cœur pourpre (Belle Étoile)',c:'#fbf9f4',back:'#f0ece4',eye:'#9a2a5e',f:'s',D:4.2},
 {id:'sybille',n:'Blanc à cœur rose pourpre (Sybille)',c:'#fbf8f6',back:'#f0e8e8',eye:'#b44a7e',f:'s',D:3.4},{id:'virginal',n:'Blanc pur double (Virginal)',c:'#fcfbf8',back:'#eeeee6',f:'d',D:4.2},
 {id:'snowflake',n:'Blanc double (Minnesota Snowflake)',c:'#fbfbf6',back:'#ecece2',f:'d',D:3.6},{id:'hermine',n:'Blanc ivoire double (Manteau d\'Hermine)',c:'#f8f4e4',back:'#ece6cc',f:'d',D:2.6}];
const L96_WP_PHI=prof([[0,.22],[.14,.56],[.42,.93],[.7,1],[.9,.88],[1,.66]]),L96_WPL_PHI=prof([[0,.2],[.12,.68],[.35,1],[.6,.9],[.82,.52],[1,0]]);
function l96PhilFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],dbl=cw.f==='d',rot=R(0,1.57),
    L1={n:4,r0:Rr*.12,L:Rr*.9,W:Rr*.6,a0:.3+(1-h)*1,a1:.15+(1-h)*1.2,wp:L96_WP_PHI,cu:.18,ht:.3,col:cw.c,colB:cw.back,rot,jit:.08,jl:.05,ao:.96,nt:.03,
      fl:cw.eye?[[cw.eye,.2,.85],[mix(cw.eye,cw.c,.5),.3,.5]]:null,flS:'in'},
    L2={n:8,r0:Rr*.1,L:Rr*.68,W:Rr*.34,a0:.6+(1-h)*.75,a1:.5+(1-h)*.85,wp:L96_WP_PHI,cu:.24,ht:.3,col:cw.c,colB:cw.back,rot:rot+.39,jit:.15,jl:.12,ao:.9,fr:1,fd:.05},
    L3={n:6,r0:Rr*.06,L:Rr*.45,W:Rr*.26,a0:1+(1-h)*.4,a1:1+(1-h)*.3,wp:L96_WP_PHI,cu:.3,ht:.3,col:cw.c,colB:cw.back,rot:rot+.2,jit:.25,jl:.15,ao:.8,fr:1,fd:.07},
    centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.14,Rr*.05,'#d8d088');b29Stamens(par,B,O,{n:dbl?(DET>=1.5?14:8):(DET>=1.5?40:22),r0:Rr*.08,r1:Rr*(dbl?.14:.28),h:Rr*(dbl?.4:.28),fc:'#f6f0d0',ac:'#f0c42a',ar:Math.max(.45,Rr*.05)})};
  const cal=()=>l55Calyx(par,B,O,Rr*.62,'#6e8a42',{n:4,rf:.06,sl:.34,sw:.11,cl:.3,cw:.24});
  if(nz>=-.05&&(DET>=1.5||nz<.35))cal();l55Corolla(par,B,O,dbl?[L1,L2,L3]:[L1],cache,{centre,ink:shd(cw.back,-.45)});if(nz<-.05)cal()}
function l96PhilBud(par,B,O,s,cw,u){spBud(par,B,O,s,s*.58,mix('#c8d8a0',cw.c,.3+.55*u),{tp:.55,pw:.55});E('path',{d:smooth(b29Rev(B,O,s*.3,s*.3,t=>.6+.4*t,0,1,3,8)),fill:'#6e8a42',stroke:'#2e4018','stroke-width':.3,'stroke-opacity':.5},par)}
const L96_PHI_S={Lr:1.25,nF:()=>rnd()<.3?5:rnd()<.7?7:9,pl:.24,tAge:.16,fl:l96PhilFl,bud:l96PhilBud,pc:'#6a8040',rc:['#2e3a1e','#56683a','#7a8c56','#a6b484'],
  lf:'#5e8a3e',lw:1.7,lr:.55,wp:L96_WPL_PHI,SC:['#2a1c14','#5a4232','#806650','#b09a84'],yc:['#3a2e1c','#7a6640','#9a8660','#c4b08a'],mk:'#d0bea4'};
function l96Philadelphus(g,t,o){const cw=cwPick(L96_PHI,o);return l96Leafy(g,t,Object.assign({},o,{cw}),L96_PHI,Object.assign({},L96_PHI_S,{D:cw.D}))}

/* ---------- the shrubs in the greenhouse registers: colourways, trade lengths (cm), composer infos (lines along the spine: tip = stiffness, fx = reach of the organs) ---------- */
Object.assign(GH,{'hamamelis':l96Hamamelis,'viorne-d-hiver':l96Viburnum,'spiree':l96Spiraea,'deutzia':l96Deutzia,'seringat':l96Philadelphus});
CWS['hamamelis']=L96_HAM;SZG['hamamelis']=[40,50,60,60,80];GHI['hamamelis']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.7,fx:2.5*UPC};
CWS['viorne-d-hiver']=L96_VIB;SZG['viorne-d-hiver']=[40,50,60,60,80];GHI['viorne-d-hiver']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.75,fx:4*UPC};
CWS['spiree']=L96_SPI;SZG['spiree']=[50,60,70,80,100];GHI['spiree']={form:'ligne',size:1,k:'plant',self:80*UPC,tip:false,fx:2*UPC};
CWS['deutzia']=L96_DEU;SZG['deutzia']=[40,50,60,60,70];GHI['deutzia']={form:'ligne',size:1,k:'plant',self:60*UPC,tip:.6,fx:6*UPC};
CWS['seringat']=L96_PHI;SZG['seringat']=[40,50,60,60,80];GHI['seringat']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.6,fx:7*UPC};
for(const s of['hamamelis','viorne-d-hiver','spiree','deutzia','seringat'])GH_BUDS.add(s);
