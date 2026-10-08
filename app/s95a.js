/* ================= Serre, lot 95 — branches fleuries 3 : abricotier du Japon (ume), amandier de Chine et cerisier nain, pommetier à fruits, amélanchier, cornouiller à fleurs ================= */
/* des rameaux ligneux poussés par le L-système du lot 29 (b29Grow, b29Wood, b29Nodes), avec les corolles, calices et jeunes feuilles 3D du lot 55 (l55Corolla, l55Calyx, l55Leaf3)
   et les fruits du lot 20 (bzFruit par l61Berry) : l'axe et ses rameaux, l'écorce, les nœuds, et à chaque nœud ses organes à leur âge (bourgeons, boutons, fleurs, fruits, jeunes feuilles) ;
   ce lot ajoute les fleurs en pompon (verticilles serrés en boule), la grappe lâche de l'amélanchier sur son axe courbe, les bractées du cornouiller autour de leur bouton de fleurs
   (échancrure brune de C. florida, pointe de C. kousa), et la feuille à nervures arquées ; dans le Composer ce sont des lignes qui suivent l'épine (o.spine) et renvoient {k,bw,bc}.
   Toute liaison (pédicelle, pédoncule, axe de grappe, pétiole) fait au moins 1,15 unité et part de sa courbe porteuse */
/* the wood's colours along a chain: from the old wood (a) to the tips (b), as four tones; q from the base of the chain, older on the main axis */
function l95Cols(a,b,k=.8){const CC={};return(q,ch)=>{const u=ch.ord?.55+.45*q:q*q,key=Math.round(u*5);if(CC[key])return CC[key];const P=pal7(mix(a,b,u*k));return CC[key]=[P.d2,P.d1,P.b,mix(P.l1,'#d8d0c8',.25)]}}
/* a smooth curved stalk through view-space points (y up), tapering from w0 to w1, shaded as the bouquet stems (one flat ribbon at the app's detail): never a sharp elbow */
function l95Stalk(par,pts,w0,w1,SC){if(pts.length<2)return;const P=pts.map(p=>[p[0],-p[1]]),n=P.length,W=P.map((_,i)=>Math.max(1.15,w0+(w1-w0)*i/(n-1)));
  if(DET>=1.5)stemPoly(par,P,W,SC);else E('path',{d:polyRibbon(P,i=>W[i]/2),fill:SC[1]},par)}
/* a quadratic arc from a toward b leaving along d (view space): its points */
function l95Arc(a,d,b,n=6,k=.45){const l=V3l(V3s(b,a)),c=V3.add(a,V3.sc(V3.nz(d),l*k)),out=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;out.push(V3.add(V3.add(V3.sc(a,u*u),V3.sc(c,2*u*t)),V3.sc(b,t*t)))}return out}
/* a leaf in 3D as l55Leaf3 (folded on its midrib, hanging, each half shaded by its own normal), with an acuminate outline and, with vn, arcuate side veins (cornel) ---------- */
function l95Leaf(par,a,p,H,len,wid,col,o={}){const X=V3.nz(H);let N=V3s([0,1,0],V3.sc(X,X[1]));if(V3l(N)<.15)N=V3s([0,0,1],V3.sc(X,X[2]));N=V3.nz(N);let S=V3.cr(X,N);
  const rl=o.roll||0;if(rl){const N2=V3.nz(V3.add(V3.sc(N,Math.cos(rl)),V3.sc(S,Math.sin(rl))));S=V3.cr(X,N2);N=N2}
  const fd=o.fd??.3,dr=o.dr??.25,wp=o.wp||L55_WPL,det=DET>=1.5,nv=det?14:8,P=pal7(col),Pu=pal7(mix(col,o.under||'#c8d0b0',.35)),down=[0,-1,0];
  const cAt=v=>V3.add(V3.add(p,V3.sc(X,len*v*(1-dr*.3*v))),V3.sc(down,len*dr*v*v)),eAt=(v,s,k=1)=>{const w=wid*.5*wp(v)*k;return V3.add(V3.add(cAt(v),V3.sc(S,s*w)),V3.sc(N,fd*w))},sc=q=>[q[0],-q[1]];
  if(V3l(V3s(a,p))>.3)b29Ped(par,a,p,Math.max(1.15,o.pw||1.2),o.pc||shd(col,-.25),.05);
  const halves=[-1,1].map(s=>{const mid=[],edge=[];let z=0;for(let i=0;i<=nv;i++){const v=i/nv,c=cAt(v),q=eAt(v,s,det&&o.ser&&i%2&&i<nv?.96:1);mid.push(sc(c));edge.push(sc(q));z+=q[2]}
    const n=V3.nz(V3s(N,V3.sc(S,s*fd))),top=n[2]>=0,I=.3+.6*b29C(lightI(top?n:V3.sc(n,-1)),0,1.1);return{s,P:mid.concat(edge.reverse()),z:z/(nv+1),fill:toneAt(top?P:Pu,I),top}});
  halves.sort((u,v)=>u.z-v.z);for(const h of halves){E('path',{d:smooth(h.P),fill:h.fill,stroke:P.d2,'stroke-width':.35,'stroke-opacity':.55},par);
    if(o.vn&&(det||len>24)){let d='';for(let k=0;k<o.vn;k++){const v0=.1+.68*k/o.vn,a0=sc(cAt(v0)),m=sc(eAt(v0+.1,h.s,.62)),e=sc(eAt(Math.min(.97,v0+.3),h.s,.86));d+=`M${f(a0[0])},${f(a0[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`}
      E('path',{d,stroke:h.top?P.l1:P.d1,'stroke-width':.4,fill:'none','stroke-opacity':.55},par)}}
  if(det||(len>16&&!o.nm)){let d='';for(let i=0;i<=6;i++){const q=sc(cAt(i/6*.94));d+=(i?'L':'M')+f(q[0])+','+f(q[1])}E('path',{d,stroke:P.l1,'stroke-width':.45,fill:'none','stroke-opacity':.6},par)}}
/* the sessile flowers and buds of a Prunus against the wood (ume, Chinese bush cherry): their scale cup on the bark at pos, the bud or the flower facing out along pd */
function l95Sessile(parts,og,j,nF,cw,op,Df,flw,o={}){const pos=og.pos,wl=l55W(og),sp=o.sp,age=.3+op*1.12-.42*og.a+R(-.2,.14)-.07*j,pd=b29Spread(og.H,og.U,og.L,j*6.283/Math.max(2,nF)+R(-.4,.4),nF>1?.5:.2,[0,.15,0]),
    pl=(o.pl||0)*(age<.42?.5+.5*b29C(age/.42):1),b=V3.add(pos,V3.sc(pd,wl*.42+Df*.04+pl));if(sp&&b[1]<28)return;
  if(age<.1){l55Dorm(parts,V3.add(pos,V3.sc(pd,wl*.3)),pd,Df*.15,o.dc||'#5a4034');return}
  const ax=V3.nz(V3.add(pd,[R(-.15,.15),.1,R(.05,.35)])),B=spFrame(ax,[0,1,0],R(-.3,.3)),sc=V3.add(pos,V3.sc(pd,wl*.3)),
    scl=par=>{E('path',{d:smooth(b29Rev(B,sc,Df*.09,Df*.075,t=>.7+.3*Math.sin(Math.PI*t),0,1,3,8)),fill:o.sc||'#5a3a2a',stroke:'#24140c','stroke-width':.3,'stroke-opacity':.6},par);if(pl>.4)b29Ped(par,V3.add(sc,V3.sc(pd,Df*.05)),b,1.2,o.pc||'#6a4a30',.08)};
  if(age<.42){const u=b29C((age-.1)/.32),bs=Df*(.15+.2*u)*(o.bk||1),bc=mix(cw.bud,cw.c,.45*u),O=pl>.4?b:V3.add(sc,V3.sc(ax,Df*.05));
    parts.push({z:b[2]+ax[2]*bs*.4,fn:par=>{scl(par);spBud(par,B,O,bs,bs*(o.bw||.82),bc,{tp:o.tp??.2,pw:.55})}});return}
  const hh=b29C((age-.42)/.3,.22,1);parts.push({z:b[2]+.1,fn:par=>{scl(par);flw(par,B,b,Df*(.82+.18*hh),cw,hh)}})}

/* ---------- abricotier du Japon, ume (Prunus mume): straight slender rods, dark grey-brown on the old wood, dark olive on the young shoots, with short stiff spurs;
   in late winter, before the leaves, the flowers one or two at a node, almost sessile against the wood: 2–3 cm, five round petals (or ten to twenty in the doubles), a crown of long
   spreading stamens with yellow anthers, a red-brown calyx of five round reflexed sepals (green in the white 'Ryokugaku' types); the buds round pearls, the youngest at the tips ---------- */
const L95_UME=[{id:'blanc',n:'Blanc (Ryokugaku, calice vert)',c:'#fbf8f3',bud:'#eef0dc',cal:'#6e8a3e',fil:'#fbf6ec',dbl:0},{id:'rose',n:'Rose tendre double (Dawn)',c:'#f1b6c6',bud:'#e07e9a',cal:'#7a2c2c',fil:'#f8dde4',dbl:1},
 {id:'rose-vif',n:'Rose vif double (Peggy Clarke)',c:'#df7896',bud:'#b8486a',cal:'#6e2426',fil:'#f4c8d4',dbl:1},{id:'rouge',n:'Rouge carmin (Beni-chidori)',c:'#b5223e',bud:'#8a1830',cal:'#5e1a1c',fil:'#e88a9a',dbl:0},
 {id:'blanc-double',n:'Blanc double (Alba Plena)',c:'#fdfaf5',bud:'#f2dcd6',cal:'#7a3a2c',fil:'#fbf4ea',dbl:1,f:1},{id:'rose-simple',n:'Rose simple (Omoi-no-mama)',c:'#f6d0da',bud:'#e8a0b4',cal:'#7a2e2c',fil:'#fbe8ec',dbl:0,f:1}];
const L95_WP_UME=prof([[0,.3],[.15,.62],[.45,.97],[.72,1],[.9,.88],[1,.72]]);
function l95UmeFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],c=cw.c,cB=mix(c,cw.bud,.3),rot=R(0,1.2),wp=L95_WP_UME,dbl=cw.dbl,
    L1={n:5,r0:Rr*.1,L:Rr*.86,W:Rr*.54,a0:.16+(1-h)*.95,a1:.32+(1-h)*1.15,wp,cu:.22,ht:.3,col:c,colB:cB,rot,jit:.07,jl:.06,ao:.95},
    L2={n:8,r0:Rr*.08,L:Rr*.64,W:Rr*.38,a0:.6+(1-h)*.7,a1:.7+(1-h)*.8,wp,cu:.26,ht:.3,col:mix(c,cw.bud,.06),colB:cB,rot:rot+.4,jit:.2,jl:.14,ao:.86},
    centre=(par,B,O)=>{b29Disc(par,B,O,Rr*.14,Rr*.05,dbl?mix(c,'#d8c890',.4):mix(cw.cal,'#d8c870',.55));
      b29Stamens(par,B,O,{n:DET>=1.5?(dbl?18:34):(dbl?10:18),r0:Rr*.1,r1:Rr*(dbl?.34:.56)*(.6+.4*h),h:Rr*(dbl?.4:.48),fc:cw.fil,fw:.4,ac:'#e3c45c',ar:Math.max(.42,Rr*.05)});
      if(DET>=1.5)b29Disc(par,B,O,Rr*.035,Rr*.5,'#dce4a8')};
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,cw.cal,{rf:.03,cl:.24,sl:.27,sw:.12});l55Corolla(par,B,O,dbl?[L1,L2]:[L1],cache,{centre,ink:shd(mix(cw.bud,'#8a7a70',.35),-.38)});
  if(nz<-.05)l55Calyx(par,B,O,Rr,cw.cal,{rf:.03,cl:.24,sl:.27,sw:.12})}
function l95Ume(g,t,o){const cw=cwPick(L95_UME,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||70)*UPC,
    Df=(cw.dbl?2.7:2.4)*UPC*R(.94,1.06),w0=sp?5.5:Math.min(8.5,2.8+Lt/115),lo=sp?.34:.1,cols=l95Cols('#3a3230','#34402c',.7);
  const nLat=o.short?0:rnd()<.3?1:rnd()<.75?2:3,cl=(nd,i,q)=>{nd.kink=R(-3,3);if(rnd()<.86)nd.org=[{a:R(50,70),n:rnd()<.6?1:2}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.04,.04),wig:.012,e:.06,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.96,[1.7*UPC,2.5*UPC],144,cl,.85),L,nLat,sp?.42:.2,.7,
    q=>({len:L*R(.26,.42)*(1-.4*q)*(sp?.8:1),a:R(26,42),e:.06,w:Math.max(1.7,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.12,.95,[1.5*UPC,2.2*UPC],144,cl,.85)}))});
  b29Wood(parts,P.chains,cols,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,11,'#8a8070',{k:.35,sw:.5,so:.35})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,Df*.17,'#4a3a30');continue}
    const nF=og.p.og.n;for(let j=0;j<nF;j++)l95Sessile(parts,og,j,nF,cw,op,Df,(par,B,b,D,cw,hh)=>l95UmeFl(par,B,b,D,cw,hh,cache),{sp,sc:'#4a3226',dc:'#4a3a30',bk:1.05,bw:.94,tp:.1})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:cols(0,{ord:0})}}

/* ---------- amandier de Chine et cerisier nain (Prunus triloba 'Multiplex', P. glandulosa 'Sinensis', 'Alba Plena'): slender wand-like shoots, red-brown to grey, few side shoots;
   at every node, crowded all along the rod, one to three double flowers in pompons (2–3.5 cm), thirty to fifty petals in tight whorls, the inner ones crumpled and upright, on very short
   pedicels (P. triloba) or pedicels of 5–10 mm (P. glandulosa); round deep pink buds; in P. glandulosa the first narrow young leaves at the tips with the flowers ---------- */
const L95_GLA=[{id:'triloba',n:'Rose vif (Prunus triloba Multiplex)',c:'#e5889f',bud:'#c4506e',df:3,pl:0},{id:'sinensis',n:'Rose tendre (Prunus glandulosa Sinensis)',c:'#f3c4d0',bud:'#e08aa4',df:2.4,pl:.8,lf:1},
 {id:'alba',n:'Blanc (Prunus glandulosa Alba Plena)',c:'#fbf8f6',bud:'#eed6d8',df:2.3,pl:.8,lf:1}];
const L95_WP_POM=prof([[0,.25],[.15,.55],[.42,.92],[.7,1],[.9,.88],[1,.7]]);
function l95PomFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],c=cw.c,cB=mix(c,cw.bud,.16),rot=R(0,1.2),wp=L95_WP_POM,
    L1={n:8,r0:Rr*.1,L:Rr*.9,W:Rr*.38,a0:.4+(1-h)*.9,a1:.62+(1-h)*.95,wp,nt:.04,cu:.2,ht:.25,col:c,colB:cB,rot,jit:.14,jl:.1,ao:.96},
    L2={n:9,r0:Rr*.08,L:Rr*.74,W:Rr*.32,a0:.75+(1-h)*.65,a1:.95+(1-h)*.6,wp,nt:.04,cu:.24,ht:.25,col:mix(c,cw.bud,.06),colB:cB,rot:rot+.35,jit:.2,jl:.14,ao:.88},
    L3={n:8,r0:Rr*.05,L:Rr*.56,W:Rr*.28,a0:1.15+(1-h)*.3,a1:1.35+(1-h)*.2,wp,cu:.3,ht:.25,col:mix(c,cw.bud,.12),colB:cB,rot:rot+.7,jit:.3,jl:.2,ao:.8},
    centre=(par,B,O)=>E('path',{d:smooth(b29Rev(B,O,Rr*.36,Rr*.2,t=>.6+.4*Math.sin(Math.PI*Math.min(1,.2+t)),0,1,4,8)),fill:toneAt(pal7(mix(c,cw.bud,.2)),.55),stroke:shd(cw.bud,-.35),'stroke-width':.3,'stroke-opacity':.4},par);
  if(nz>=-.05&&(DET>=1.5||nz<.35))l55Calyx(par,B,O,Rr,'#7a3a2a',{rf:.06,cl:.22,sl:.26});l55Corolla(par,B,O,DET>=1.5?[L1,L2,L3]:[L1,L2],cache,{centre,ink:shd(mix(cw.bud,c,.35),-.3)});if(nz<-.05)l55Calyx(par,B,O,Rr,'#7a3a2a',{rf:.06,cl:.22,sl:.26})}
function l95Glan(g,t,o){const cw=cwPick(L95_GLA,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||70)*UPC,
    Df=cw.df*UPC*R(.94,1.06),w0=sp?4.6:Math.min(7,2.4+Lt/130),lo=sp?.34:.12,cols=l95Cols('#5a4a44','#6a2e22',.85);
  const nLat=o.short?0:rnd()<.4?0:rnd()<.8?1:2,cl=(nd,i,q)=>{nd.kink=R(-3,3);if(rnd()<.92)nd.org=[{a:R(48,68),n:rnd()<.5?1:rnd()<.9?2:3}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.06,.06),wig:.02,e:.045,seg:9,w:w0,w1:1.15,nodes:L=>l55Lats(b29Nodes(L,lo,.96,[1.15*UPC,1.6*UPC],144,cl,.85),L,nLat,sp?.42:.2,.6,
    q=>({len:L*R(.3,.45)*(1-.4*q)*(sp?.8:1),a:R(20,32),e:.05,w:Math.max(1.6,w0*.45*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.12,.95,[1.1*UPC,1.5*UPC],144,cl,.85)}))});
  b29Wood(parts,P.chains,cols,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,9,'#c8a898',{k:.4,sw:.5,so:.4})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,Df*.2,'#6a3a2c');continue}
    const nF=og.p.og.n;for(let j=0;j<nF;j++)l95Sessile(parts,og,j,nF,cw,op,Df,(par,B,b,D,cw,hh)=>l95PomFl(par,B,b,D,cw,hh,cache),{sp,pl:cw.pl*UPC,sc:'#5a3022',pc:'#7a5a34',bw:.9,tp:.15});
    /* the first young leaves of P. glandulosa: narrow, bright green, at the upper nodes */
    if(cw.lf&&og.a>.55&&rnd()<.5){const H=b29Spread(og.H,og.U,og.L,R(0,6.283),.4,[0,.3,0]),len=Df*R(.9,1.4)*b29C(.4+.6*op,.4,1),pf=V3.add(pos,V3.sc(H,l55W(og)*.4+Df*.12));
      if(!(sp&&pf[1]<30))parts.push({z:pos[2]+H[2]*len*.4-.03,fn:par=>l55Leaf3(par,V3.add(pos,V3.sc(H,l55W(og)*.3)),pf,H,len,len*.32,mix('#7a9a3a','#a8b84a',R(0,.4)),{dr:.18,fd:.35,roll:R(-.3,.3),pc:'#6a7a30'})})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:cols(0,{ord:0})}}

/* ---------- pommetier à fruits (Malus 'Red Sentinel', 'Golden Hornet', 'John Downie', 'Evereste', 'Royalty'): grey-brown shoots, the old wood greyer, set with short knobbly spurs;
   at each spur a cluster of three to six small apples (1.5–3 cm, round, or egg-shaped in 'John Downie'), each hanging on its own long slender pedicel (2.5–4 cm), crowned at its eye
   by the dried calyx; red, orange, golden yellow or deep purple, flushed on the sunny cheek; a few leaves of the season at the spurs (ovate, serrate, yellowing); green as they swell ---------- */
const L95_CRAB=[{id:'rouge',n:'Rouge (Red Sentinel)',c:'#b8202a',y:'#d8582a',g:'#9aac48',d:2.2,lf:'#5e7a34'},{id:'jaune',n:'Jaune d\'or (Golden Hornet)',c:'#e3b23a',y:'#d8c050',g:'#a8b448',d:2.4,lf:'#7a8a34',fl:1.12},
 {id:'orange',n:'Orange flammé (John Downie)',c:'#e0702a',y:'#e8a838',g:'#a8b048',d:2.8,lf:'#6a7e34',fl:1.22,bl:'#c43a24'},{id:'pourpre',n:'Pourpre (Royalty)',c:'#5a1f3a',y:'#8a2a3a',g:'#8a7a40',d:1.7,lf:'#4a2a2e'},
 {id:'corail',n:'Rouge orangé (Evereste)',c:'#d0553a',y:'#e8a040',g:'#a8b048',d:2.4,lf:'#6a8236',bl:'#b8302a'}];
function l95Crab(g,t,o){const cw=cwPick(L95_CRAB,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],sp=!!o.spine,cm=o.cm||60,Lt=sp?blen(o.spine):(cm<25?cm*7.5:cm)*UPC,
    rr0=cw.d*UPC*.5,SC=['#2a221e','#52443a','#766658','#ab9c8e'],w0=sp?6:Math.min(9,3+Lt/110),lo=sp?.36:.12,pc='#6a5a34';
  const nLat=o.short?0:rnd()<.25?1:rnd()<.65?2:3,cl=(nd,i,q)=>{nd.kink=R(-7,7);if(rnd()<.62)nd.org=[{a:R(42,62),n:rnd()<.25?2:rnd()<.6?3:rnd()<.85?4:5}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.035,e:.035,seg:9,w:w0,w1:1.3,nodes:L=>l55Lats(b29Nodes(L,lo,.94,[3.8*UPC,5.2*UPC],144,cl,.78),L,nLat,sp?.42:.22,.72,
    q=>({len:L*R(.24,.38)*(1-.4*q)*(sp?.8:1),a:R(34,52),e:.025,w:Math.max(1.8,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.2,.92,[3.2*UPC,4.4*UPC],144,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,10,'#c0b0a0',{k:.4,sw:.55,so:.4})});
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;
    if(og.t==='Tb'){l55Dorm(parts,pos,og.H,rr0*.6,'#6a5040');continue}
    const nF=og.p.og.n,m0=b29C(.05+op*1.05-.2*og.a+R(-.12,.08)),sl=rr0*.5,se=V3.add(pos,V3.sc(og.H,sl)),wl=l55W(og);
    /* the spur: a knobbly stub with its ring scars */
    parts.push({z:pos[2]+.05,fn:par=>{b29Ped(par,pos,se,Math.max(1.6,wl*.5),'#5a4a3e',0);if(DET>=1.5)b29Ped(par,V3.add(pos,V3.sc(og.H,sl*.55)),V3.add(pos,V3.sc(og.H,sl*.62)),Math.max(1.7,wl*.56),'#7a6a5a',0)}});
    /* a leaf or two of the season, yellowing as the fruit ripens */
    const nL=rnd()<.35?0:rnd()<.7?1:2;for(let j=0;j<nL;j++){const H=b29Spread(og.H,og.U,og.L,j*3.1+R(-.5,.5),.7,[0,.15,0]),len=UPC*R(4.5,6.5),pf=V3.add(se,V3.sc(H,UPC*.8));
      if(sp&&pf[1]<30)continue;const lc=mix(cw.lf,rnd()<.5?'#c8a83a':'#b8782e',m0*R(.1,.6));
      parts.push({z:se[2]+H[2]*len*.4-.02,fn:par=>l95Leaf(par,se,pf,H,len,len*.5,lc,{dr:.3,fd:.18,roll:R(-.4,.4),pc:shd(cw.lf,-.1),ser:1})})}
    /* the cluster: each apple on its own long pedicel out of the spur, arching out then hanging under its weight */
    for(let j=0;j<nF;j++){const m=b29C(m0+R(-.08,.06)),dj=b29Spread(og.H,og.U,og.L,j*6.283/nF+R(-.4,.4),R(.6,.95),[0,.35,0]),pl=R(2.5,3.8)*UPC,
        hang=V3.nz(V3.add(V3.sc(dj,.45),[R(-.1,.1),-1,R(-.1,.25)])),b=V3.add(V3.add(se,V3.sc(dj,pl*.55)),V3.sc(hang,pl*.5));if(sp&&b[1]<28)continue;
      const rr=rr0*R(.86,1.08)*(.55+.45*b29C(m*1.4)),col=cw.bl&&rnd()<.6?mix(bzRipe(cw,m),cw.bl,R(.2,.5)*m):bzRipe(cw,m),pts=l95Arc(se,dj,b,6,.5);
      parts.push({z:b[2]-.02,fn:par=>l95Stalk(par,pts,1.3,1.15,['#4a4024','#6a5a34','#8a7a48','#aa9a68'])});
      l61Berry(parts,{pos:b,H:hang},{c:col,g:cw.g,y:cw.y},rr,1,{lift:0,fl:(cw.fl||.9)*R(.95,1.05),eye:'pome',gl:.9,big:3.4,dk:R(0,.15)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- amélanchier (Amelanchier lamarckii, A. × grandiflora 'Robin Hill', 'Ballerina'): slender grey-brown to purplish twigs, long-pointed buds; in April, with the young leaves,
   at the tips of the short shoots lax racemes (4–8 cm) of six to ten flowers on slender pedicels, ascending then nodding; the flower 2.5–3 cm, a star of five narrow strap petals,
   twenty stamens and five styles round a green-yellow cup, narrow reflexed sepals; the buds slender, white flushed pink; the young leaves folded, silky, copper-bronze ---------- */
const L95_AML=[{id:'blanc',n:'Blanc, feuilles bronze (A. lamarckii)',c:'#fbf9f4',bud:'#f0dcd8',lf:'#9a5a30'},{id:'rose',n:'Blanc rosé (Robin Hill)',c:'#f6e6e8',bud:'#e8a8b8',lf:'#8a4a2e'},
 {id:'ballerina',n:'Blanc pur, feuilles cuivrées (Ballerina)',c:'#fdfcf8',bud:'#eee4dc',lf:'#a8683a',f:1}];
const L95_WP_AML=prof([[0,.3],[.12,.62],[.35,.9],[.65,1],[.88,.92],[1,.7]]);
function l95AmlFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,nz=B[2][2],cal='#7a4a36',
    sp={n:5,r0:Rr*.1,L:Rr*.9,W:Rr*.19,a0:.12+(1-h)*1.05,a1:.02+(1-h)*1.35,wp:L95_WP_AML,cu:.3,ht:.35,col:cw.c,colB:mix(cw.c,cw.bud,.3),rot:R(0,1.2),jit:.16,jl:.14,ao:.95,sep:DET>=1.5},
    centre=(par,B,O)=>{if(DET>=1.5)b29Disc(par,B,O,Rr*.13,Rr*.04,'#c8c878');b29Stamens(par,B,O,{n:DET>=1.5?20:12,r0:Rr*.1,r1:Rr*.2*(.6+.4*h),h:Rr*.16,fc:'#f4f0e0',ac:'#e0c048',ar:Math.max(.42,Rr*.045)})};
  if(nz>=-.05&&DET>=1.5)l55Calyx(par,B,O,Rr,cal,{rf:.12,cl:.18,cw:.14,sl:.26,sw:.06});l55Corolla(par,B,O,[sp],cache,{centre,ink:shd(mix(cw.bud,'#a09080',.4),-.3)});if(nz<-.05)l55Calyx(par,B,O,Rr,cal,{rf:.12,cl:.18,cw:.14,sl:.26,sw:.06})}
function l95Amel(g,t,o){const cw=cwPick(L95_AML,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||70)*UPC,
    Df=2.7*UPC*R(.94,1.06),SC=['#261e1e','#4a3e3e','#6e6460','#a49a94'],w0=sp?5:Math.min(7.5,2.6+Lt/120),lo=sp?.38:.16,RS=['#5a4a2c','#7a6a40','#9a8a58','#bcae80'];
  const nLat=o.short?1:rnd()<.3?2:rnd()<.75?3:4,cl=(nd,i,q)=>{nd.kink=R(-6,6);nd.org=[{a:R(36,56),k:q>.22&&rnd()<.78?'rac':'lb'}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.07,.07),wig:.03,e:.04,seg:9,w:w0,w1:1.2,nodes:L=>l55Lats(b29Nodes(L,lo,.94,[2.6*UPC,3.8*UPC],144,cl,.8),L,nLat,sp?.42:.22,.78,
    q=>({len:L*R(.2,.34)*(1-.4*q)*(sp?.8:1),a:R(28,44),e:.04,w:Math.max(1.6,w0*.42*(1-.5*q)),nodes:Ll=>b29Nodes(Ll,.25,.9,[2.4*UPC,3.4*UPC],144,cl,.8)}))});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,12,'#b8aca4',{k:.35,sw:.5,so:.4})});
  const lbud=(pos,H,len)=>{const B=spFrame(H,[0,1,0],0);parts.push({z:pos[2]+H[2]*len*.5,fn:par=>E('path',{d:smooth(b29Rev(B,pos,len,len*.32,B29_CONE,0,1,5,8)),fill:budFill('#6a3a34'),stroke:'#2a1612','stroke-width':.3,'stroke-opacity':.6},par)})};
  /* a raceme with its young leaves at the end of a short shoot out of pos */
  const raceme=(pos,H,wl,a)=>{const age0=.3+op*1.1-.3*a+R(-.15,.1);if(age0<.08){lbud(pos,H,Df*.3);return}
    const sl=Df*R(.15,.3),se=V3.add(pos,V3.sc(H,sl));if(sp&&se[1]<30)return;parts.push({z:pos[2]+.04,fn:par=>b29Ped(par,pos,se,Math.max(1.5,wl*.5),SC[1],0)});
    /* the young leaves, folded and silky, bronze */
    const nL=age0<.3?1:2;for(let j=0;j<nL;j++){const Hl=b29Spread(H,[0,1,0],V3.nz(V3.cr(H,[0,1,0.01])),j*2.4+R(-.4,.4),.65,[0,.3,0]),len=Df*R(.8,1.2)*b29C(.3+.7*age0,.35,1),pf=V3.add(se,V3.sc(Hl,Df*.12));
      if(sp&&pf[1]<30)continue;parts.push({z:se[2]+Hl[2]*len*.4-.02,fn:par=>l95Leaf(par,se,pf,Hl,len,len*.36,mix(cw.lf,'#b8a090',R(.05,.25)),{dr:.24,fd:.4,roll:R(-.3,.3),pc:'#6a4a34',under:'#d8d0c8',ser:1,nm:1})})}
    /* the rachis: ascending, then nodding under its flowers */
    const rl=Df*R(2.4,3.4)*(.55+.45*b29C(age0*1.5)),H0=V3.nz(V3.add(H,[0,.55,0])),nF=age0<.25?5:DET>=1.5?9:R(5,8)|0,pts=[],peds=[];
    for(let i=0;i<=8;i++){const s=i/8;pts.push(V3.add(V3.add(se,V3.sc(H0,rl*s)),V3.sc([0,-1,0],rl*.6*s*s)))}
    if(sp&&pts[8][1]<28)return;parts.push({z:se[2]+.02,fn:par=>{l95Stalk(par,pts,1.6,1.15,RS);/* the pedicels, one path behind the flowers */let d='';for(const[a,b,k]of peds){const A=[a[0],-a[1]],B=[b[0],-b[1]],l=Math.hypot(B[0]-A[0],B[1]-A[1]);d+=`M${f(A[0])},${f(A[1])}Q${f((A[0]+B[0])/2)},${f((A[1]+B[1])/2+l*k)} ${f(B[0])},${f(B[1])}`}if(d)E('path',{d,stroke:RS[1],'stroke-width':1.2,fill:'none','stroke-linecap':'round'},par)}});
    for(let j=0;j<nF;j++){const s=.22+.78*j/(nF-1),i=Math.min(7,Math.floor(s*8)),u=s*8-i,p=V3.add(V3.sc(pts[i],1-u),V3.sc(pts[i+1],u)),T=V3.nz(V3s(pts[i+1],pts[i])),
        side=V3.nz(V3.cr(T,[0,0,1])),az=j*2.4+R(-.5,.5),out=V3.nz(V3.add(V3.add(V3.add(V3.sc(side,Math.cos(az)*.85),[0,0,Math.sin(az)*.85]),[R(-.15,.15),.2,0]),V3.sc(T,.35))),age=age0-.25*s+R(-.05,.05),
        pl=Df*(.8-.4*s)*(age<.3?.6:1),b=V3.add(p,V3.sc(out,pl));if(sp&&b[1]<28)continue;
      const ax=V3.nz(V3.add(out,[R(-.15,.15),.05,R(0,.4)])),Bf=spFrame(ax,[0,1,0],R(-.5,.5));peds.push([p,b,R(-.2,.2)]);
      if(age<.3){const bs=Df*(.2+.22*b29C(age/.3));parts.push({z:b[2],fn:par=>{spBud(par,Bf,b,bs,bs*.42,mix(cw.bud,cw.c,.3*b29C(age/.3)),{tp:.45,pw:.6})}});continue}
      const hh=b29C((age-.3)/.3,.2,1);parts.push({z:b[2]+.1,fn:par=>{l95AmlFl(par,Bf,b,Df*(.75+.25*hh),cw,hh,cache)}})}};
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;const wl=l55W(og);
    if(og.t==='Tb'){if(og.main||rnd()<.6)raceme(pos,og.H,wl,og.a*.5);else lbud(pos,og.H,Df*.3);continue}
    if(og.p.og.k==='rac')raceme(pos,og.H,wl,og.a);else lbud(V3.add(pos,V3.sc(og.H,wl*.2)),og.H,Df*.24)}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- cornouiller à fleurs (Cornus florida, 'Rubra', 'Cherokee Chief'; C. kousa, 'Satomi'): grey-brown twigs, smooth, the young shoots purplish-green, opposite and in tiers;
   each 'flower' an inflorescence: a button of some twenty tiny green-yellow flowers ringed by four large bracts (8–10 cm across): in C. florida broad, obovate, with a brown-purple notch
   at the tip (the scar of the winter bud), in C. kousa pointed, held on a longer stalk above the leaves; the bracts open small and green, then grow and pale (white) or flush (pink);
   in winter the turban-shaped bud of C. florida; the leaves opposite, ovate, pointed, their veins arcuate, young and small in C. florida at flowering, full in C. kousa ---------- */
const L95_COR=[{id:'blanc',n:'Blanc (Cornus florida)',c:'#f7f4ec',lf:'#6e8a3a',nk:'#8a4a3a'},{id:'rose',n:'Rose (C. florida Rubra)',c:'#eeb0c4',lf:'#6e7a38',nk:'#a03a4a'},
 {id:'rouge',n:'Rose rouge (Cherokee Chief)',c:'#c2364e',lf:'#6a6a36',nk:'#6a1a2a'},{id:'vert',n:'Vert anis, bractées naissantes (C. kousa)',c:'#cfe0a0',lf:'#4e7030',nk:'#6a8a3a',kz:1},
 {id:'kousa',n:'Blanc étoilé (C. kousa chinensis)',c:'#f8f6ee',lf:'#4e7030',nk:'#8a9a6a',kz:1,f:1},{id:'satomi',n:'Rose (C. kousa Satomi)',c:'#e8a0b4',lf:'#4e6a30',nk:'#b05a70',kz:1,f:1}];
const L95_WP_FLO=prof([[0,.28],[.15,.56],[.45,.9],[.72,1],[.9,.92],[1,.8]]),L95_WP_KOU=prof([[0,.3],[.18,.72],[.42,1],[.66,.78],[.86,.36],[1,.06]]);
function l95CornFl(par,B,O,Df,cw,h,cache){const Rr=Df/2,kz=cw.kz,g=b29C(1-h*1.6),c=mix(cw.c,'#b8cc84',g*.75),rot=R(0,1.57),cu=kz?.3:.2,nt=kz?0:.13,
    a0=(kz?.12:.06)+(1-h)*1.15,a1=(kz?.02:.12)+(1-h)*1.4,L=Rr*.88,W=Rr*(kz?.36:.52),r0=Rr*.1,
    sp={n:4,r0,L,W,a0,a1,wp:kz?L95_WP_KOU:L95_WP_FLO,nt,cu,ht:kz?.12:.3,col:c,colB:mix(c,'#d8dcc0',.25),rot,ao:.95,fl:mix(c,'#b8c890',.5),flk:.16,flS:'both',flo:.35},
    centre=(par,B,O)=>{/* the notches of the bracts turned to us (C. florida), then the button of tiny flowers */
      if(!kz&&h>.35){let d='';for(let i=0;i<4;i++){const ph=rot+i*1.5708,cc=Math.cos(ph),ss=Math.sin(ph),am=a0+(a1-a0)*.55,n=toV(B,[-cc*Math.sin(am),-ss*Math.sin(am),Math.cos(am)]);if(n[2]<-.02)continue;
          const at=(x,y)=>{const v=y/L,a=a0+(a1-a0)*v*.5,rho=r0+y*Math.cos(a),hz=y*Math.sin(a)+cu*x*x/W;return PJ(B,O,[cc*rho-ss*x,ss*rho+cc*x,hz])},w=W*L95_WP_FLO(.9)*.3,
            q=[at(-w,L*.95),at(-w*.45,L*.87),at(0,L*.8),at(w*.45,L*.87),at(w,L*.95),at(0,L*(.99-nt))];d+=smooth(q.map(p=>[p[0],p[1]]))}
        if(d)E('path',{d,fill:cw.nk,'fill-opacity':.85},par)}
      const cr=Rr*(kz?.15:.17);E('path',{d:smooth(b29Rev(B,O,cr*(kz?1.5:.9),cr,t=>Math.pow(Math.sin(Math.PI*Math.min(.995,.5+.5*t)),.6),0,1,4,10)),fill:budFill(kz?'#9ab050':'#b4bc5a'),stroke:'#4a5a20','stroke-width':.3,'stroke-opacity':.6},par);
      if(h>.6){let a='';const n=DET>=1.5?16:8,ar=Math.max(.45,cr*.14);for(let i=0;i<n;i++){const t=i*2.39996,r=cr*.75*Math.sqrt((i+.5)/n),z=cr*(kz?1.2:.75)*Math.sqrt(1-Math.min(.9,(r/cr)**2)),p=PJ(B,O,[Math.cos(t)*r,Math.sin(t)*r,z]);
          a+=`M${f(p[0]-ar)},${f(p[1])}a${f(ar)},${f(ar)} 0 1,0 ${f(ar*2)},0a${f(ar)},${f(ar)} 0 1,0 ${f(-ar*2)},0`}E('path',{d:a,fill:'#e8e070','fill-opacity':.9},par)}};
  l55Corolla(par,B,O,[sp],cache,{centre,ink:shd(mix(cw.c,'#8a9070',.5),-.35)})}
/* the winter bud of C. florida: a turban of four grey bract tips round a pointed knob */
function l95CornBud(par,B,O,s,cw){const c=cw.kz?'#7a8a4a':'#9a8a72';E('path',{d:smooth(b29Rev(B,O,s,s*.62,t=>Math.pow(Math.sin(Math.PI*Math.min(.995,.08+.92*t)),.5)*(1-.45*t*t),0,1,6,10)),fill:budFill(c),stroke:shd(c,-.5),'stroke-width':.35,'stroke-opacity':.6},par);
  if(DET>=1.5||s>9){let d='';for(let i=0;i<4;i++){const a=i*1.5708+.6,p0=PJ(B,O,[Math.cos(a)*s*.3,Math.sin(a)*s*.3,s*.2]),p1=PJ(B,O,[Math.cos(a)*s*.08,Math.sin(a)*s*.08,s*.9]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
    E('path',{d,stroke:shd(c,-.4),'stroke-width':.45,fill:'none','stroke-opacity':.55},par)}}
function l95Corn(g,t,o){const cw=cwPick(L95_COR,o),op=b29C(o.op??R(.75,1),.05,1),k=G(g),parts=[],cache={},sp=!!o.spine,Lt=sp?blen(o.spine):(o.cm||70)*UPC,kz=cw.kz,
    Df=(kz?8.5:9.5)*UPC*R(.94,1.06),SC=['#2a2422','#504642','#766a62','#a89c92'],w0=sp?6.5:Math.min(9.5,3.4+Lt/105),lo=sp?.42:.2,PS=['#3a2a2a','#5a4440','#7a6460','#a08a84'];
  /* opposite and decussate: each node a pair of organs, a pair of side shoots in tiers */
  const cl=(nd,i,q)=>{nd.kink=R(-6,6);const kd=q>.35&&rnd()<.4?'fl':q>.2&&rnd()<.5?'lf':'bd';nd.org=[{a:R(48,64),k:kd,dphi:0},{a:R(48,64),k:kd==='fl'&&rnd()<.5?'lf':kd,dphi:180}]};
  const P=b29Grow(o,Lt,{face:R(-.6,.6),bow:R(-.06,.06),wig:.025,e:.035,seg:9,w:w0,w1:2.2,nodes:L=>{const N=b29Nodes(L,lo,.9,[4.5*UPC,6.5*UPC],90,cl,.8),
      cand=N.filter(nd=>nd.l>L*(sp?.45:.25)&&nd.l<L*.8);for(let m=0;m<(o.short?1:2)&&cand.length;m++){const nd=cand.splice(Math.floor(rnd()*cand.length),1)[0],q=nd.l/L;
        nd.org=[];const lat=s=>({len:L*R(.2,.32)*(1-.35*q)*(sp?.75:1),a:R(52,68),dphi:s,e:.02,w:Math.max(1.8,w0*.45*(1-.4*q)),w1:1.8,
          nodes:Ll=>b29Nodes(Ll,.35,.8,[3.5*UPC,5*UPC],90,(nd,i,q)=>{nd.kink=R(-5,5);nd.org=[{a:R(48,60),k:'lf',dphi:0},{a:R(48,60),k:'lf',dphi:180}]},.8)});nd.lats=[lat(0),lat(180)]}return N}});
  b29Wood(parts,P.chains,SC,{piece:9,deco:(par,Pp,W)=>b29Marks(par,Pp,W,14,'#c0b4a8',{k:.32,sw:.5,so:.35})});
  const leafPair=(pos,H,U,wl,a,big)=>{const base=V3.add(pos,V3.sc(H,wl*.3)),len=(kz?R(6.5,8.5):big?R(4,5.5):R(2.8,4))*UPC*b29C(.5+.6*op,.5,1),Hl=V3.nz(V3.add(H,[0,kz?.05:.25,0])),pf=V3.add(base,V3.sc(Hl,UPC*.9));
    if(sp&&pf[1]<30)return;parts.push({z:base[2]+Hl[2]*len*.4-.02,fn:par=>l95Leaf(par,base,pf,Hl,len,len*.56,mix(cw.lf,'#8aa040',R(0,.25)),{dr:kz?.3:.18,fd:kz?.16:.3,roll:R(-.35,.35),pc:shd(cw.lf,-.2),wp:L95_WPL_COR,vn:5})})};
  const flower=(pos,H,wl,a,stalk)=>{const age=.15+op*1.15-.12*a+R(-.12,.1),ax=V3.nz(V3.add(V3.sc(H,.45),[R(-.15,.15),.8,R(.25,.6)])),sl=stalk*(age<.35?.6:1),
      se=sl>.5?V3.add(V3.add(pos,V3.sc(H,sl*.4)),V3.sc(ax,sl*.7)):pos,B=spFrame(ax,[0,1,0],R(0,6));if(sp&&se[1]<30)return;
    if(sl>.5){const pts=l95Arc(pos,H,se,6,.4);parts.push({z:pos[2]+.03,fn:par=>l95Stalk(par,pts,Math.max(1.6,wl*.5),1.4,PS)})}
    if(age<.35){const s=Df*(.11+.1*b29C(age/.35));parts.push({z:se[2]+ax[2]*s*.5,fn:par=>l95CornBud(par,B,se,s,cw)});return}
    const hh=b29C((age-.35)/.5,.05,1),O=V3.add(se,V3.sc(ax,Df*.02));parts.push({z:se[2]+ax[2]*Df*.1+.1,fn:par=>l95CornFl(par,B,O,Df*(.38+.62*hh),cw,hh,cache)})};
  for(const og of P.organs){const pos=og.pos;if(sp&&pos[1]<30)continue;const wl=l55W(og);
    if(og.t==='Tb'){/* every shoot ends in a flower, with its pair of leaves under it */const B0=V3.nz(V3.cr(og.H,[0,0,1]));
      for(const s of[-1,1])leafPair(pos,V3.nz(V3.add(V3.sc(B0,s),V3.sc(og.H,.35))),og.U,wl,og.a,0);flower(pos,og.H,wl,og.a,kz?Df*R(.3,.45):Df*R(.05,.12));continue}
    const kd=og.p.og.k;if(kd==='fl'){leafPair(pos,og.H,og.U,wl,og.a,0);flower(V3.add(pos,V3.sc(og.H,wl*.3)),og.H,wl,og.a,Df*(kz?R(.35,.5):R(.18,.28)));continue}
    if(kd==='lf'){leafPair(pos,og.H,og.U,wl,og.a,1);continue}
    const B=spFrame(og.H,[0,1,0],0),len=Df*.06,O=V3.add(pos,V3.sc(og.H,wl*.25));parts.push({z:pos[2]+og.H[2]*len*.5,fn:par=>E('path',{d:smooth(b29Rev(B,O,len,len*.4,B29_CONE,0,1,5,8)),fill:budFill('#6a4a44'),stroke:'#2a1a16','stroke-width':.3,'stroke-opacity':.6},par)})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}
const L95_WPL_COR=prof([[0,.1],[.1,.55],[.32,.92],[.5,1],[.72,.78],[.9,.32],[1,0]]);

/* ---------- the branches in the greenhouse registers: colourways, trade lengths (cm), composer infos (lines along the spine: tip = stiffness, fx = reach of the organs) ---------- */
Object.assign(GH,{'abricotier-du-japon-ume':l95Ume,'amandier-de-chine-cerisier-nain':l95Glan,'pommetier-a-fruits':l95Crab,'amelanchier':l95Amel,'cornouiller-a-fleurs':l95Corn});
CWS['abricotier-du-japon-ume']=L95_UME;SZG['abricotier-du-japon-ume']=[50,60,70,80,100];GHI['abricotier-du-japon-ume']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.75,fx:2*UPC};
CWS['amandier-de-chine-cerisier-nain']=L95_GLA;SZG['amandier-de-chine-cerisier-nain']=[50,60,70,80];GHI['amandier-de-chine-cerisier-nain']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.7,fx:2.2*UPC};
CWS['pommetier-a-fruits']=L95_CRAB;SZG['pommetier-a-fruits']=[40,50,60,80];GHI['pommetier-a-fruits']={form:'ligne',size:1,k:'plant',self:60*UPC,tip:.6,fx:5*UPC};
CWS['amelanchier']=L95_AML;SZG['amelanchier']=[50,60,70,80,100];GHI['amelanchier']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.6,fx:5*UPC};
CWS['cornouiller-a-fleurs']=L95_COR;SZG['cornouiller-a-fleurs']=[50,60,70,80,100];GHI['cornouiller-a-fleurs']={form:'ligne',size:1,k:'plant',self:70*UPC,tip:.7,fx:6*UPC};
for(const s of['abricotier-du-japon-ume','amandier-de-chine-cerisier-nain','cornouiller-a-fleurs'])GH_BUDS.add(s);
