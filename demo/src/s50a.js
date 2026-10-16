/* ================= Serre, lot 50 — exotiques 4, poussés par le L-système : capsule de lotus, fleur de lotus, ixora, passiflore, népenthès ================= */
/* les moteurs repris : gsRev (corps de révolution des capsules, lot 28), chpHeadS (tige à une tête et ses rameaux, lot 17), la tête en dôme du pentas (lot 31), le brin retombant du jasmin (lot 25), la tige-ligne de la sandersonia (lot 19) */
const l50Q=p=>[p[0],-p[1]],l50P=(B,O,p)=>{const s=PJ(B,O,p);return[s[0],s[1]]};
/* a projected circle of radius r lying in the local plane z=h, centred on (x,y): one sub-path */
const l50Ring=(B,O,x,y,h,r,rmin=.3)=>{const c=PJ(B,O,[x,y,h]),a=PJ(B,O,[x+r,y,h]),b=PJ(B,O,[x,y+r,h]);return chpEll(c,[a[0]-c[0],a[1]-c[1]],[b[0]-c[0],b[1]-c[1]],rmin)};
/* the up direction of a head held by its stem */
const l50Up=B=>B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];

/* ---------- capsule de lotus (Nelumbo nucifera, réceptacle fructifère): after the petals fall the receptacle swells into an obconic, flat-topped pod 5–12 cm across, its top pierced by
   15–30 alveoli in rough rings (one in the centre), each holding a nut (an ovoid seed, green and bulging when fresh, dark brown and loose when dry, some fallen out leaving an empty pit);
   its sides spongy, finely ribbed lengthwise down into a stiff, rough peduncle. Sold fresh green, dried natural brown, bleached, and painted or dyed (gold, silver, black, red, pink, blue) ---------- */
const L50_CAP=[{id:'naturel',n:'Brun naturel (séchée)',c:'#7a5636',sd:'#3a2414',sc:'#6a5038',dry:1},
  {id:'brun-clair',n:'Brun clair (séchée)',c:'#a07a4e',sd:'#56381e',sc:'#8a6c4a',dry:1},
  {id:'vert',n:'Vert (fraîche)',c:'#8f9a45',sd:'#c8cf90',sc:'#7a8a44',nut:'#b9c27a'},
  {id:'vert-tendre',n:'Vert tendre (jeune)',c:'#a9bb62',sd:'#dfe6b0',sc:'#8aa04e',nut:'#d4dc9a'},
  {id:'blanchi',n:'Blanchie',c:'#ece5d4',sd:'#a8987a',sc:'#ddd4c0',dry:1},
  {id:'argent',n:'Peinte argent',c:'#c0c0bc',sd:'#6c6c6a',sc:'#b0b0aa',dry:1,paint:1,hl:.35},
  {id:'or',n:'Peinte or',c:'#b8984a',sd:'#6a4e1e',sc:'#a88a42',dry:1,paint:1,hl:.5},
  {id:'noir',n:'Teintée noire',c:'#2c2826',sd:'#0e0c0b',sc:'#2e2a28',dry:1,paint:1},
  {id:'rouge',n:'Teintée rouge',c:'#962a2c',sd:'#4a1012',sc:'#7e2a2a',dry:1,paint:1},
  {id:'rose',n:'Teintée rose',c:'#d6a0ac',sd:'#8a5260',sc:'#c494a0',dry:1,paint:1},
  {id:'bleu',n:'Teintée bleue',c:'#4f6c98',sd:'#1e2c48',sc:'#4a6088',dry:1,paint:1}];
const L50_CAPPR=gsProf([[0,.12],[.12,.25],[.4,.56],[.7,.84],[.9,.97],[1,1]]);
/* the alveoli of the top (local x, y as fractions of its radius): a centre, then rings, a little irregular */
function l50Alv(n0){const A=[[0,0]],rg=[[.3,6],[.56,11],[.8,16]];let ph=R(0,1);for(const[r,n]of rg){ph+=R(.2,.6);for(let i=0;i<n;i++){const a=ph+i/n*6.283+R(-.08,.08),rr=r*R(.95,1.04);A.push([Math.cos(a)*rr,Math.sin(a)*rr])}}return A.slice(0,n0||A.length)}
/* the pod at O along B[2]: D across its top; m its ripeness (0 young green, 1 ripe) */
function l50Pod(par,B,O,D,cw,m){const dt=DET>=1.5,k=G(par),Rm=D/2,Hh=D*(.6+.12*m),ax=toV(B,[0,0,1]),az=ax[2],col=!cw.dry&&m<.5?mix(cw.c,'#a6c070',.4*(1-m/.5)):cw.c,
    P=cw.paint?pal7(col):gsBloom(col,mix(col,'#e6e2d6',.5),cw.dry?.18:.3),ink=shd(col,-.75),Rt=Rm*.985,dome=D*.025,top=az>.02;
  /* the top: its face lit by where it looks, the alveoli as pits ringed with a raised lip, a nut in most of them */
  const face=()=>{const PT=pal7(mix(col,cw.dry?'#000000':'#ffffff',cw.dry?.06:.1)),I=top?lightI(ax):.3;E('path',{d:l50Ring(B,O,0,0,Hh,Rt),fill:toneAt(PT,I),stroke:ink,'stroke-width':.45,'stroke-opacity':.55},k);
    if(!top||LOD)return;const nH=dt?34:Rm>22?22:16,alv=l50Alv(nH),hr=Rm*(dt?.09:.1),lip=toneAt(PT,Math.min(1,I+.14)),pit=cw.sd&&!cw.dry&&!cw.paint?shd(col,-.5):cw.sd,nut=cw.nut||shd(col,cw.dry?-.35:.15);
    let dl='',dp='',dn='',dh='';const PN=pal7(nut),ns=cw.dry?.7:.86;
    alv.forEach(([x,y],i)=>{const h=Hh+dome*(1-x*x-y*y),X=x*Rm*.86,Y=y*Rm*.86,r=hr*(i?1:.92)*R(.92,1.08);dl+=l50Ring(B,O,X,Y,h,r*1.18);dp+=l50Ring(B,O,X,Y,h,r);
      const full=cw.dry?rnd()<.8:true;if(full&&m>.15){const up=(cw.dry?.06:.22)*r*(.4+.6*m);dn+=l50Ring(B,O,X-r*.06,Y+r*.06,h+up,r*ns);if(dt||!cw.dry)dh+=l50Ring(B,O,X-r*.3,Y+r*.3,h+up+r*.1,r*ns*.32)}});
    E('path',{d:dl,fill:lip,opacity:.9},k);E('path',{d:dp,fill:pit},k);if(dn)E('path',{d:dn,fill:toneAt(PN,lightI(ax)*.9),stroke:shd(nut,-.55),'stroke-width':.3,'stroke-opacity':.55},k);
    if(dh)E('path',{d:dh,fill:toneAt(PN,1),opacity:cw.paint?.45:.5},k)};
  if(!top)face();
  const nr=dt?18:12,ph=R(0,1);
  gsRev(k,B,O,Hh,t=>Rm*L50_CAPPR(t),col,{ng:dt?20:14,pal:P,ct:.75,ink,hl:cw.hl||(cw.dry?0:.1),merge:1,
    mer:Array.from({length:nr},(_,j)=>({a:j/nr*6.283+ph,tw:R(-.1,.1),c:shd(col,cw.dry?-.25:-.2),w:dt?.4:.5,op:.45,t0:.06,t1:.97}))});
  if(top)face();return k}
function l50CapPlant(g,t,o){const cw=cwPick(L50_CAP,o),op=Math.max(.05,Math.min(1,o.op??1)),m=cw.dry?Math.max(.9,op):op,D0=(o.cm||8)*UPC,sc=cw.dry?gsCols(cw.sc):['#3e4a22','#5e6e34','#869a52','#b2c282'],k=G(g),
    sz=cw.dry?.88+.12*op:.6+.4*op,pod=(par,B,O,D,mm)=>l50Pod(par,B,O,D,cw,mm);
  /* a single pod on its long, stiff peduncle: no leaves, no side shoot */
  const r=lsHeadS(k,o,{D:D0,w:Math.max(2.2,D0*.11),cols:sc,op,rr:.3,axisFirst:true,nodes:0,lp:3.4,aimK:.03,wig:.01,e:.005,
    flower:(par,B,O,D2,op2)=>pod(par,gsCapF(B,.5),O,D2*sz,m),bud:()=>{}});
  open(k,t,1000,3,.3);return r}
Object.assign(GH,{'nelumbo-capsule':l50CapPlant});CWS['nelumbo-capsule']=L50_CAP;SZG['nelumbo-capsule']=[5,6,7,8,8,9,10];
GHI['nelumbo-capsule']={form:'disque',size:1.8,k:'head',rk:.95,self:55*UPC,tip:.9,fx:3*UPC};

/* ---------- fleur de lotus (Nelumbo nucifera; N. lutea): a solitary flower 15–25 cm across held high on a rigid, rough peduncle; 15–25 broad obovate petals, concave like spoons,
   finely veined lengthwise, paler toward the base, often deeper at the tips (white with rose tips: 'Chawan Basu'); in the heart the receptacle, an obconic yellow top with 10–25
   sunken pistils, ringed with a fringe of 200+ yellow stamens, each anther ending in a white club. The bud is a long pointed ogive of closed petals, sold as often as the open flower ---------- */
const L50_LOT=[{id:'rose',n:'Rose (Rosea)',c:'#ec8aa8',b:'#f8e6e2',tp:'#d4527c'},
  {id:'rose-pale',n:'Rose pâle',c:'#f4d0d8',b:'#fbf2ee',tp:'#e8a2b8'},
  {id:'rose-fonce',n:'Rose foncé (Red Lotus)',c:'#c8304a',b:'#f2c4c8',tp:'#a01838'},
  {id:'blanc',n:'Blanc (Alba Grandiflora)',c:'#f8f6f0',b:'#f8efd8',tp:null},
  {id:'blanc-rose',n:'Blanc liseré rose (Chawan Basu)',c:'#f8f2f0',b:'#faf4e6',tp:'#e2688e'},
  {id:'jaune',n:'Jaune (N. lutea)',c:'#f2dc7a',b:'#f6ecb6',tp:null}];
const L50_PW=prof([[0,.56],[.12,.68],[.4,.88],[.66,1],[.86,.86],[.96,.48],[1,.06]]);
/* one petal in the flower's frame: inserted at radius r0, height h0, azimuth a; it leaves the axis at ph0 and turns by ka along its length (closed form), its sides cupped toward the heart */
function l50PetS(a,r0,h0,L,W,ph0,ka,cup,tw=0){const ca=Math.cos(a),sa=Math.sin(a),sm=Math.abs(ka)<1e-3;
  return(u,v)=>{const ph=ph0+ka*v,x=sm?Math.sin(ph0)*v:(Math.cos(ph0)-Math.cos(ph))/ka,z=sm?Math.cos(ph0)*v:(Math.sin(ph)-Math.sin(ph0))/ka,w=W*.5*L50_PW(v),cp=Math.cos(ph),sp=Math.sin(ph),
    rr=r0+L*x-cp*cup*w*u*u,hh=h0+L*z+sp*cup*w*u*u,uu=u*w*(1-.15*cup*u*u),t=tw*u*v*w;return[ca*rr-sa*uu+ca*t,sa*rr+ca*uu+sa*t,hh]}}
/* the flower in its frame B at O: D across when open, q how open (0 a closed ogive, 1 a wide bowl) */
function l50Lotus(par,B,O,D,cw,q){const dt=DET>=1.5,k=G(par),F={k:null,B,O,parts:[]},parts=[],e=sm01(q),Rr=D*.085,P=pal7(cw.c),PB=pal7(shd(cw.c,-.06)),lite=h2l(cw.c)[2]>.8,
    nL=q<.22?2:3,lay=[[dt?7:6,1,1.3,-.3,.42],[dt?7:6,.88,.95,-.35,.4],[dt?6:5,.72,.72,-.38,.36]],L0=D*.5*(.72+.28*e),rot=R(0,6.283),veins=dt?[-.62,-.32,0,.32,.62].map(u=>[[u*.5,.04],[u*1.02,.45],[u*.85,.9]]):null;
  for(let l=0;l<nL;l++){const[n,lk,po,ko,cup]=lay[l],L=L0*lk*(l?R(.96,1.02):1);for(let i=0;i<n;i++){const a=rot+(i+(l%2)*.5+l*.17)/n*6.283+R(-.2,.2),
      ph0=LERP(.55-l*.04,po,e)+R(-.12,.12)*e,ka=LERP(-1.5,ko,Math.min(1,e*1.5)),S=l50PetS(a,Rr*(.95-.15*l),-Rr*.3,L*R(.95,1.04),L*(.62-.06*l)*R(.94,1.06),ph0,ka,cup*(1-.25*e),R(-.06,.06)),b0=S(0,0),t0=S(0,1);
    parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:6,nv:dt?12:8,across:1.2,ew:.5,eo:lite?.45:.35,cast:0,veins,vw:.5,vo:.3,vlo:.3,
      paint:(g,front,pi)=>{if(LOD)return;const s0=PJ(B,O,b0),s1=PJ(B,O,t0),st=[[0,cw.b,.85],[.32,cw.b,0]];if(cw.tp)st.push([.58,cw.tp,0],[1,cw.tp,front?.6:.45]);
        E('path',{d:pi.d,fill:ugrad(s0[0],s0[1],s1[0]+.01,s1[1],st)},g)}}))}}
  /* the torus: the swollen top of the peduncle where the petals are inserted, seen between their feet from behind */
  {const Ot=V3.add(O,toV(B,[0,0,-Rr*.8]));parts.push({z:PJ(B,O,[0,0,-Rr*.5])[2],fn:par2=>gsRev(par2,B,Ot,Rr*.62,t=>Rr*(.32+.7*t),'#b4bc78',{ng:10,nb:2,ct:.7,ink:'#4a5a2a',merge:1})})}
  /* a pair of small green sepals at the foot of the bud, shed as it opens */
  if(q<.6)for(let i=0;i<2;i++){const S=l50PetS(rot+.6+i*3.14,Rr*.9,-Rr*.45,L0*.22,L0*.16,.45+.6*e,-.8,.3);parts.push(...sheet3(F,S,{pal:pal7('#6f9a48'),nu:4,nv:5,across:1,ew:.4,eo:.4,cast:0}))}
  /* the heart: the stamens' fringe round the foot of the yellow receptacle, its top dotted with sunken pistils */
  if(q>=.22){const zc=toV(B,[0,0,1])[2]<.3?-1e9:PJ(B,O,[0,0,Rr*.5])[2],ns=Math.round((dt?56:32)*(LOD?.5:1)),el=(32+46*(1-e))*.017453,Ls=Rr*(.75+.6*e),fb={d:'',a:'',w:''},ff={d:'',a:'',w:''};
    const hid=zc<-1e8,Sc=l50P(B,O,[0,0,0]),Sa=l50P(B,O,[0,0,Rr]),sa=[Sa[0]-Sc[0],Sa[1]-Sc[1]];
    for(let i=0;i<ns;i++){const a=i/ns*6.283+R(-.05,.05),c=Math.cos(a),s=Math.sin(a),b=[c*Rr*.55,s*Rr*.55,Rr*.15],el2=el+R(-10,10)*.017453,dd=[c*Math.cos(el2),s*Math.cos(el2),Math.sin(el2)],
        m=V3.add(b,V3.sc(dd,Ls*.45)),tp=V3.add(b,V3.sc(dd,Ls)),wt=V3.add(b,V3.sc(dd,Ls*1.08)),S0=l50P(B,O,b),S1=l50P(B,O,m),S2=l50P(B,O,tp),S3=l50P(B,O,wt),z=PJ(B,O,tp)[2],T=z>zc?ff:fb;if(hid&&(S3[0]-Sc[0])*sa[0]+(S3[1]-Sc[1])*sa[1]<.95*(sa[0]*sa[0]+sa[1]*sa[1]))continue;
      T.d+=`M${f(S0[0])},${f(S0[1])}L${f(S1[0])},${f(S1[1])}`;T.a+=`M${f(S1[0])},${f(S1[1])}L${f(S2[0])},${f(S2[1])}`;T.w+=`M${f(S2[0])},${f(S2[1])}L${f(S3[0])},${f(S3[1])}`}
    const st=(T)=>par2=>{E('path',{d:T.d,stroke:'#e8dc9a','stroke-width':1.15,fill:'none','stroke-linecap':'round'},par2);E('path',{d:T.a,stroke:'#e2b52e','stroke-width':f(Math.max(1.6,Rr*.12)),fill:'none','stroke-linecap':'round'},par2);
      if(!LOD)E('path',{d:T.w,stroke:'#fbf6e6','stroke-width':f(Math.max(1.4,Rr*.1)),fill:'none','stroke-linecap':'round'},par2)};
    const az=toV(B,[0,0,1])[2];parts.push({z:zc-.02,fn:st(fb)},{z:zc+.01+Rr*6*Math.max(0,az-.55),fn:st(ff)});
    const Ob=V3.add(O,toV(B,[0,0,-Rr*.1])),Hr=Rr*1.05,rc='#e8c84a',ax=toV(B,[0,0,1]);
    if(!hid)parts.push({z:zc,fn:par2=>{const g=G(par2);gsRev(g,B,Ob,Hr,t=>Rr*(.45+.4*t),rc,{ng:dt?14:10,nb:dt?4:2,pal:pal7(rc),ct:.7,ink:shd(rc,-.6),merge:1});
      const top=ax[2]>.05,I=top?lightI(ax):.3;E('path',{d:l50Ring(B,Ob,0,0,Hr,Rr*.85),fill:toneAt(pal7('#e6d470'),I),stroke:shd(rc,-.5),'stroke-width':.4,'stroke-opacity':.6},g);
      if(top&&!LOD){let d='',h='';l50Alv(dt?20:12).forEach(([x,y])=>{d+=l50Ring(B,Ob,x*Rr*.62,y*Rr*.62,Hr,Rr*.1);h+=l50Ring(B,Ob,x*Rr*.62-Rr*.03,y*Rr*.62+Rr*.03,Hr+Rr*.05,Rr*.05)});
        E('path',{d,fill:'#b8a43a'},g);E('path',{d:h,fill:'#f2ea9a',opacity:.8},g)}}})}
  drawParts(k,parts);return k}
function l50LotPlant(g,t,o){const cw=cwPick(L50_LOT,o),op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||18)*UPC,sc=['#2e4420','#4e6a34','#76944e','#a6be80'],k=G(g);
  /* one flower on its leafless, rigid peduncle; the bud stands along it */
  const r=lsHeadS(k,o,{D:D0,w:Math.max(2.4,D0*.045),cols:sc,op,rr:.25,nodes:0,lp:1.5,aimK:.12,wig:.012,e:.006,
    flower:(par,B,O,D2,op2)=>{const q=Math.max(0,Math.min(1,(op2-.1)/.9)),u=l50Up(B),Bf=q<.3?spFrame(V3.nz(V3.add(V3.sc(u,1-q*2),V3.sc(B[2],.3+q*2))),B[1],R(0,6.28)):B;l50Lotus(par,Bf,O,D2,cw,q)},bud:()=>{}});
  open(k,t,1100,4,.3);return r}
Object.assign(GH,{'nelumbo-nucifera':l50LotPlant});CWS['nelumbo-nucifera']=L50_LOT;SZG['nelumbo-nucifera']=[14,16,18,18,20,22];
GHI['nelumbo-nucifera']={form:'cornet',size:3,k:'head',rk:.85};GH_BUDS.add('nelumbo-nucifera');

/* ---------- ixora (Ixora coccinea and hybrids; Rubiaceae): a terminal corymb 6–12 cm, domed nearly to a ball, of 40–60 small flowers — a very slender corolla tube 2.5–4 cm crowned by
   four spreading, oblong, pointed lobes (a little cross), two to four stamens just showing in the throat — the buds club-tipped and packed in its heart, opening from the rim inward;
   held just above a pair (or whorl) of stiff, leathery, glossy oblong leaves, sessile on a woody stem; side shoots from the upper axils end in younger corymbs ---------- */
const L50_IX=[{id:'rouge',n:'Rouge (Super King)',c:'#d8282a'},{id:'rouge-orange',n:'Rouge orangé (coccinea)',c:'#e03a2e'},{id:'orange',n:'Orange (Thai Dwarf Orange)',c:'#e8742a'},
  {id:'saumon',n:'Saumon (Sunkist)',c:'#f08c6a'},{id:'jaune-or',n:"Jaune d'or (Thai Dwarf Yellow)",c:'#dca21c'},{id:'jaune',n:'Jaune (Maui Yellow)',c:'#ecc23a'},
  {id:'rose',n:'Rose (Nora Grant)',c:'#ec8aa6'},{id:'rose-vif',n:'Rose vif (Dwarf Pink)',c:'#e2557e'},{id:'blanc',n:'Blanc (I. finlaysoniana)',c:'#f6f2e6'}];
/* a stiff, glossy leaf on a node in 3D: lsLeafS bent and a little folded, sheet3 shading with its lacquer, the midrib and a few side veins pressed in */
function l50Leaf(og,pos,len,wr,col,o={}){const S=lsLeafS(Object.assign({},og,{pos}),len,wr,{wp:o.wp||LS_OVATE,droop:o.droop??.12,arch:o.arch??.06,fold:o.fold??.16,tw:o.tw??R(-.25,.25),face:o.face??.5}),
    F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(mix(shd(col,.14),'#7f9a6c',.22)),nv=o.nv||0,V=[];
  for(let i=0;i<nv;i++){const v=.14+.7*i/Math.max(1,nv-1);for(const s of[-1,1])V.push([[0,v],[s*.5,v+.08],[s*.86,v+.16]])}
  return sheet3(F,S,{pal:P,palB:PB,nu:5,nv:9,across:1.3,ew:.45,eo:.45,cast:0,veins:[{pts:[[0,.01],[0,.5],[0,.97]],w:Math.max(.5,len*.012),c:P.l1,o:.6},...V],vw:Math.max(.45,len*.01),vo:.45,vlo:.35,
    gloss:o.gloss?{shin:26,k:o.gloss,thr:.22,cu:2,cv:5,nu:8,nv:14,lv:1.5,lu:.5,o:.6}:null})}
/* the corymb in its frame B (z up its axis) on O, Dm across when open: flowers on a dome, buds in its heart, all drawn far to near (the pentas head with four lobes and a long tube) */
function l50IxHead(par,B,O,Dm,cw,op,o={}){const g=G(par),q=sm01((op-.08)/.86),rot=R(0,6.283),det=DET>=1.5,lod=LOD?.6:1,cache={},rf=Dm*.118*(o.sz||1),
    Rs=Dm*(.3+.18*q)*(o.sz||1),al=(48+34*q)*D,H0=Dm*.14,Cc=[0,0,H0-Rs],N=Math.max(10,Math.round((det?58:36)*lod*(o.nk||1))),nB=Math.round(N*(1-.8*q)),items=[],cB=1-Math.cos(al),tb=Math.min(cB,nB*.5*rf*rf/(2*Math.PI*Rs*Rs)),el=toV(B,[0,0,1])[2],
    stc=mix(shd(cw.c,-.35),'#6a4a2a',.45);
  /* the cushion: the red-tinged branches and calyces under the flowers, so nothing floats */
  const cq=[];for(let i=0;i<14;i++){const a=i/14*6.283;for(const th of[0,al*.92]){const n=[Math.sin(th)*Math.cos(a),Math.sin(th)*Math.sin(a),Math.cos(th)],p=PJ(B,O,V3.add(Cc,V3.sc(n,Rs*.7)));cq.push([p[0],p[1]])}}
  const ob=PJ(B,O,[0,0,-Dm*.03]);cq.push([ob[0],ob[1]]);E('path',{d:smooth(hull2(cq)),fill:mix(shd(cw.c,-.45),stc,.35),stroke:shd(cw.c,-.7),'stroke-width':.4,'stroke-opacity':.5},g);
  let dr='';for(let i=0;i<9;i++){const a=i/9*6.283+rot,n=[Math.sin(al*.8)*Math.cos(a),Math.sin(al*.8)*Math.sin(a),Math.cos(al*.8)],e=PJ(B,O,V3.add(Cc,V3.sc(n,Rs*.78))),c=PJ(B,O,V3.sc(V3.add(Cc,V3.sc(n,Rs*.78)),.45));
    dr+=`M${f(ob[0])},${f(ob[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`}if(el<.5)E('path',{d:dr,stroke:stc,'stroke-width':f(Math.max(1.1,Dm*.014)),fill:'none','stroke-linecap':'round'},g);
  const tubeR=Math.max(.6,rf*.11),lite=h2l(cw.c)[2]>.8;
  for(let i=0;i<N;i++){const t=(i+.5)/N,ib=i<nB,ct=1-(ib?(i+.5)/nB*tb:tb*.75+(i-nB+.5)/Math.max(1,N-nB)*(cB-tb*.75)),th=Math.acos(ct),ph=i*2.39996+rot,n=V3.nz([Math.sin(th)*Math.cos(ph)+R(-.05,.05),Math.sin(th)*Math.sin(ph)+R(-.05,.05),ct]),
      P=V3.add(Cc,V3.sc(n,Rs)),[X,Y]=l31Fr(n),nV=toV(B,n),z=PJ(B,O,P)[2];
    if(i<nB){/* a bud: the long slender tube ending in a pointed club, coloured, greener the younger */const age=q*(1-i/Math.max(1,nB)),lb=rf*(1.1+.7*age),bc=mix(cw.c,'#a8a060',.3-.26*age);
      const pr=prof([[0,.1],[.45,.12],[.68,.24],[.86,.3],[1,.04]]),bp=[];for(let a=0;a<=7;a++){const v=a/7,r=Math.max(.45,pr(v)*rf*(.9+.4*age));for(let m=0;m<8;m++){const w=m/8*6.283,s=PJ(B,O,V3.add(V3.add(P,V3.sc(n,lb*(v-.62))),V3.add(V3.sc(X,Math.cos(w)*r),V3.sc(Y,Math.sin(w)*r))));bp.push([s[0],s[1]])}}
      items.push({z:z+lb*.3*nV[2],fn:()=>E('path',{d:smooth(hull2(bp)),fill:budFill(bc),stroke:shd(bc,-.5),'stroke-width':.35,'stroke-opacity':.6},g)});continue}
    const sz=rf*(.85+.22*Math.pow(t,1.5))*(.75+.25*q),front=nV[2]>=0,col=cw.c,pts=[];
    /* the little cross: four oblong lobes, their tips a little pointed, spreading flat from the throat */
    for(let kk=0;kk<4;kk++){const a0=kk*1.5708+ph*1.7;for(const[da,r,tp]of[[-.5,.3],[-.38,.72],[-.22,.95],[0,1,1],[.22,.95],[.38,.72]]){const a=a0+da,rr=sz*r,p=V3.add(P,V3.add(V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)),V3.sc(n,-sz*.08*r*r))),s=PJ(B,O,p);pts.push([s[0],s[1],tp])}}
    const I=front?lightI(nV):lightI(V3.sc(nV,-1))*.82,P7=l31Pal(front?col:mix(col,'#c8b8a0',.2),cache),fill=toneAt(P7,.22+.55*I);
    if(nV[2]<.5){/* the slender tube, seen from the side or behind, down to the cushion */const a=PJ(B,O,P),b=PJ(B,O,V3.add(P,V3.sc(n,-sz*2.6))),C=[[a[0],a[1]],[(a[0]+b[0])/2,(a[1]+b[1])/2],[b[0],b[1]]],tc=mix(col,'#e8d8c0',.15);
      items.push({z:z-sz*1.2*nV[2]-.01,fn:()=>E('path',{d:smooth(chpTube(C,[tubeR,tubeR,tubeR*.9],2)),fill:toneAt(l31Pal(tc,cache),.55),stroke:shd(tc,-.45),'stroke-width':.3,'stroke-opacity':.5},g)})}
    items.push({z,fn:()=>{E('path',{d:smooth(tipOut(pts)),fill,stroke:lite?shd(col,-.4):P7.d1,'stroke-width':.35,'stroke-opacity':lite?.75:.6,'stroke-linejoin':'round'},g);
      if(nV[2]>.25&&!LOD){const c=PJ(B,O,P),e1=V3s(PJ(B,O,V3.add(P,V3.sc(X,sz*.13))),c),e2=V3s(PJ(B,O,V3.add(P,V3.sc(Y,sz*.13))),c);eyes+=chpEll(c,e1,e2,.45)}}})}
  /* the throats, where the stamens just show: one path over the dome */
  let eyes='';items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn();if(eyes)E('path',{d:eyes,fill:lite?'#e8d890':shd(cw.c,-.3),stroke:shd(cw.c,-.45),'stroke-width':.25,'stroke-opacity':.5},g);return g}
function l50IxPlant(g,t,o){const cw=cwPick(L50_IX,o),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||9)*UPC,k=G(g),B=frameOf(o,.4,true),
    up=l50Up(B),A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.3))),sc=['#33301e','#55533a','#7c7a58','#a8a684'];
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.3,D:Dm,w:Dm*.06,cols:sc,op,nodes:2,li:.62,lp:.42,opp:1,leafAng:62,side:{p:.6,n:1,top:2,len:.6,ang:60,age:[0,.6],e:.08},seg:.12,wig:.025,e:.012,
    apex:Bm=>V3.sc(Bm[2],Dm*.06),
    flower:(par,Bf,O,op2)=>l50IxHead(par,Bf,O,Dm,cw,op2),
    young:(par,Bf,O,a)=>l50IxHead(par,Bf,O,Dm*.6,cw,a*.7,{nk:.5}),
    leaf:(og,pos)=>l50Leaf(og,pos,Dm*(og.p.i<=1?R(.75,.9):R(.95,1.1)),.38,'#2a4f22',{wp:LS_LANCE,nv:DET>=1.5?6:4,droop:.05,arch:.04,fold:.14,face:.8,gloss:.9})});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'ixora':l50IxPlant});CWS['ixora']=L50_IX;SZG['ixora']=[6,7,8,9,9,10,12];
GHI['ixora']={form:'sphere',size:1.6,k:'head',rk:1};GH_BUDS.add('ixora');

/* ---------- passiflore (Passiflora caerulea and hybrids; Passifloraceae): a slender climbing vine, alternate palmate leaves (five deep oblong lobes; three in P. racemosa, P. edulis),
   a coiled tendril in every axil, and from some axils on a long pedicel a flat flower 6–10 cm: ten tepals (five sepals, green and awned on their backs, five petals), a corona of
   thread-like filaments in rings, banded (purple at the base, white, blue at the tips in caerulea), and in its heart the androgynophore: a column carrying five stamens whose anthers
   hang like a star, the ovary on top and three styles spreading into a cross with their club-shaped stigmas. The buds ovoid, green, cupped by three leafy bracts.
   In a bouquet it hangs over the lip like the jasmine: one strand rising out of the mouth, cresting the lip, falling; drawn in few paths (leaves, tendrils, tepals and bands batched) ---------- */
const L50_PAS=[{id:'bleue',n:'Bleue (caerulea)',c:'#f2eef2',cr:['#5a1a4a','#f6f4f6','#4a5ab0'],lob:5},
  {id:'blanche',n:'Blanche (Constance Elliott)',c:'#f6f4ec',cr:['#e8e0c8','#faf8f0','#f2eed8'],lob:5},
  {id:'lilas',n:'Lilas (Amethyst)',c:'#b8a0d8',cr:['#3a1a4a','#f2eef6','#6a4ab0'],lob:3},
  {id:'violette',n:'Pourpre (Purple Haze)',c:'#6a2a6a',cr:['#2a0e2a','#e8e0ee','#5a3a8a'],lob:3},
  {id:'rose',n:'Rose (Lady Margaret)',c:'#e898b8',cr:['#5a1a3a','#f6eef2','#b04a8a'],lob:3},
  {id:'rouge',n:'Rouge (racemosa)',c:'#c8202e',cr:['#3a0e1a','#f2e8ec','#7a2a6a'],lob:3,short:1}];
/* one flower at c (view space), its face Nf, R0 its radius, q how open; returns its paints for the strand's batches (drawn at once, in order) */
function l50PasFlower(par,c,Nf,R0,cw,q){const dt=DET>=1.5,up=Math.abs(Nf[1])<.9?[0,1,0]:[1,0,0],X=V3.nz(V3.cr(up,Nf)),Y=V3.cr(Nf,X),fr=R(0,1.2566),face=Nf[2]>=0,sc5=l50Q,
    pt=p=>{const s=sc5(p);return f(s[0])+','+f(s[1])},L=(a,el,r,h=0)=>V3.add(V3.add(c,V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),r*Math.cos(el))),V3.sc(Nf,r*Math.sin(el)+h));
  const g=G(par),P=pal7(cw.c),SP=pal7('#7aa04e'),el0=(8+52*(1-q))*D;
  /* the ten tepals: sepals behind, petals between them; each an oblong blade, toned by how it faces the light, by twos into paths */
  const tep=()=>{const bins={};for(let s=0;s<2;s++)for(let j=0;j<5;j++){const a=fr+j*1.2566+s*.6283,el=el0+R(-.06,.06)+(s?.05:0),Lt=R0*(s?.94:1),w=R0*(s?.28:.3),ca=Math.cos(a),sa=Math.sin(a),
      dr=V3.add(V3.sc(X,ca),V3.sc(Y,sa)),dir=V3.nz(V3.add(V3.sc(dr,Math.cos(el)),V3.sc(Nf,Math.sin(el)))),sd=V3.add(V3.sc(X,-sa),V3.sc(Y,ca)),nm=V3.cr(dir,sd),q2=[];
      for(const[v,u]of[[0,-.25],[.25,-.82],[.6,-1],[.86,-.7],[1,0],[.86,.7],[.6,1],[.25,.82],[0,.25]]){const pw=V3.add(V3.add(c,V3.sc(dir,R0*.1+Lt*v)),V3.add(V3.sc(sd,u*w*.5),V3.sc(nm,-Lt*.04*v*v)));q2.push(sc5(pw))}
      const seen=nm[2]>=0===face,front=nm[2]>=0,col=!front&&!s?SP:P,I=lightI(front?nm:V3.sc(nm,-1)),bi=(s?'p':'s')+(front?1:0)+(I>.62?1:0),key=bi;
      bins[key]=(bins[key]||'')+smooth(q2)}
    const draw=(id,c2)=>{if(bins[id])E('path',{d:bins[id],fill:c2,stroke:shd(c2,-.4),'stroke-width':.35,'stroke-opacity':.6,'stroke-linejoin':'round'},g)};
    for(const s of['s','p'])for(const fr2 of[0,1])for(const lt of[0,1]){const pal=s==='s'&&!fr2?SP:P;draw(s+fr2+lt,toneAt(pal,lt?.72:.5))}};
  /* the corona: filaments in two rings from a dark ring, banded base, middle, tip; each band of every filament in one path */
  const cor=()=>{const n=Math.round((dt?64:40)*(LOD?.5:1)),Lc=R0*(cw.short?.42:.72),B3=['','',''],bk=[0,.32,.56,1];
    for(let i=0;i<n;i++){const a=i/n*6.283+R(-.03,.03),inner=i%3===0,Lf=Lc*(inner?.45:1)*R(.92,1.06),el=el0*.8+(inner?.5:.12)+R(-.05,.05),wv=dt&&!inner?R(-.05,.05):0;
      for(let b=0;b<3;b++){const p0=L(a,el,R0*.13+Lf*bk[b]),p1=L(a+wv*bk[b+1],el,R0*.13+Lf*bk[b+1]);B3[b]+=`M${pt(p0)}L${pt(p1)}`}}
    E('path',{d:l50RingV(c,X,Y,R0*.17),fill:cw.cr[0],stroke:shd(cw.cr[0],-.4),'stroke-width':.3},g);
    const w=Math.max(1.1,R0*.03);B3.forEach((d,b)=>E('path',{d,stroke:cw.cr[b],'stroke-width':f(b===2?w*.9:w),fill:'none','stroke-linecap':'round'},g))};
  /* the androgynophore: a column, five anthers hanging from its top like a star, the ovary, three styles in a cross ending in their stigmas */
  const col=()=>{if(LOD&&R0<14)return;const h=R0*.36,top=V3.add(c,V3.sc(Nf,h)),gc='#9ab65a',w=Math.max(1.3,R0*.07);E('path',{d:`M${pt(c)}L${pt(top)}`,stroke:'#7a9a48','stroke-width':f(w),'stroke-linecap':'round'},g);
    let sf='',an='';for(let j=0;j<5;j++){const a=fr+j*1.2566+.3,e=V3.add(top,V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),R0*.2)),e2=V3.add(e,V3.sc(Nf,-R0*.04));sf+=`M${pt(top)}L${pt(e2)}`;
      const s1=V3.add(e2,V3.sc(V3.add(V3.sc(X,-Math.sin(a)),V3.sc(Y,Math.cos(a))),R0*.08)),s2=V3.add(e2,V3.sc(V3.add(V3.sc(X,-Math.sin(a)),V3.sc(Y,Math.cos(a))),-R0*.08));an+=`M${pt(s1)}L${pt(s2)}`}
    E('path',{d:sf,stroke:gc,'stroke-width':f(Math.max(1.1,R0*.035)),fill:'none','stroke-linecap':'round'},g);E('path',{d:an,stroke:'#d8c860','stroke-width':f(Math.max(1.6,R0*.07)),fill:'none','stroke-linecap':'round'},g);
    const ov=V3.add(top,V3.sc(Nf,R0*.06));E('path',{d:l50RingV(ov,X,Y,R0*.07),fill:'#8fb04e',stroke:'#4a6a2a','stroke-width':.35},g);
    let st='',sg='';for(let j=0;j<3;j++){const a=fr+j*2.094+.9,e=V3.add(V3.add(ov,V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),R0*.2)),V3.sc(Nf,R0*.12));st+=`M${pt(ov)}L${pt(e)}`;sg+=l50RingV(e,X,Y,R0*.045)}
    E('path',{d:st,stroke:'#6a5a3a','stroke-width':f(Math.max(1.2,R0*.04)),fill:'none','stroke-linecap':'round'},g);E('path',{d:sg,fill:'#5a3a2a'},g)};
  if(face){tep();cor();col()}else{col();cor();tep()}return g}
/* a circle round c in the plane X, Y (view space): one sub-path */
const l50RingV=(c,X,Y,r)=>{const s=l50Q(c),a=l50Q(V3.add(c,V3.sc(X,r))),b=l50Q(V3.add(c,V3.sc(Y,r)));return chpEll(s,[a[0]-s[0],a[1]-s[1]],[b[0]-s[0],b[1]-s[1]],.5)};
function l50PasStrand(k,o){const cw=cwPick(L50_PAS,o),op=Math.max(.1,Math.min(1,o.op??R(.85,1))),B=o.ax?frameOf(o,0):I3,
    X=typeof DRAPEX!=='undefined'&&DRAPEX,side=X?X.side||1:(o.sway||0)<0?-1:1,Lv0=o.len||(o.cm||80)*UPC,sw=(o.sway??R(10,30)*side)*R(.7,1.3);
  /* the crest above the lip and the room below it, as the jasmine's */
  let hc=R(6,12),dxc=side*R(8,18),Lh=Lv0*.88;
  if(X){hc=Math.max(5,X.y-(X.top-R(5,10)));if(!X.held){const room=X.FL-3-X.y;Lh=Math.min(Lh,room)}dxc=side*Math.max(6,Math.min(26,X.mw-Math.abs(X.x-X.mcx)+R(4,10)))}
  Lh=Math.max(40,Lh);const C=[[0,0,0],[dxc*.45,hc*1.5,R(-3,3)],[dxc+(sw-dxc)*.12+side*Lh*.08,-Lh*.32,R(-8,8)],[sw-side*Lh*.04,-Lh,R(-12,12)]],cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const NS=36,ph=R(0,6.28),tw=Lh/R(60,90),pts=[];for(let i=0;i<=NS;i++){const s=i/NS,q=cb(s),a=ph+s*tw*6.28,am=2*Math.min(1,s*4);pts.push(toV(B,[q[0]+Math.cos(a)*am,q[1],q[2]+Math.sin(a)*am]))}
  const cum=[0];for(let i=1;i<=NS;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const Lv=cum[NS];
  const at=l=>{l=Math.max(0,Math.min(Lv,l));let i=1;while(i<NS&&cum[i]<l)i++;const t=(l-cum[i-1])/((cum[i]-cum[i-1])||1),p=V3.add(V3.sc(pts[i-1],1-t),V3.sc(pts[i],t)),T=V3.nz(V3s(pts[i],pts[i-1]));return{p,T}};
  const lc='#3f6a2c',LP=pal7(lc),LB=pal7(mix(lc,'#a8bc90',.35)),sg=pal7('#5a8a3a'),U2=V3.nz(toV(B,[0,0,1])),UP=[0,1,0],sz=Math.min(1.15,Math.max(.7,Lv/(60*UPC)))*R(.92,1.08),sc5=l50Q,q5b=p=>f(p[0])+','+f(p[1]);
  const Lf=[['','','','','',''],['','','','','','']],Vn=['',''],Pt=['',''],Td=['',''],Fl=[[],[]],lay=(p,ps)=>p[2]>=ps[2]?1:0;
  /* a palmate leaf: lobes radiating from the top of its petiole, in a plane facing up and toward the eye; toned by its facing, batched */
  const leaf=(node,r,T,ln,ps)=>{const pl=ln*.38,H=V3.nz(V3.add(V3.add(V3.sc(r,.85),V3.sc(T,R(-.1,.3))),[0,R(.05,.3),0])),b0=V3.add(V3.add(node,V3.sc(H,pl)),[0,-pl*.12,0]),ly=lay(b0,ps);Pt[ly]+=`M${q5b(sc5(node))}L${q5b(sc5(b0))}`;
    let N=V3.nz(V3.add(V3.add(UP,V3.sc(U2,.8)),V3.sc(H,-.3)));N=V3.nz(V3s(N,V3.sc(H,V3.dot(N,H))));const W=V3.cr(N,H),nl=cw.lob,sp=nl===5?.62:.75,out=[],vs=[],bl=ln*R(.9,1.05);
    for(let i=0;i<=nl*8;i++){const th=-1.5-.3+(3.6)*i/(nl*8),lb=Math.max(...Array.from({length:nl},(_,j)=>{const c0=(j-(nl-1)/2)*sp,d=Math.abs(th-c0)/(sp*.55);return d<1?(1-.25*Math.abs(c0))*Math.pow(Math.cos(d*1.5708),.6):0}),.18),
      rr=bl*lb,x=Math.cos(th)*rr,y=Math.sin(th)*rr,p=V3.add(V3.add(b0,V3.add(V3.sc(H,x),V3.sc(W,y))),[0,-bl*.18*(x/bl)*(x/bl),0]);out.push(sc5(p))}
    for(let j=0;j<nl;j++){const c0=(j-(nl-1)/2)*sp,rr=bl*(1-.25*Math.abs(c0))*.85,x=Math.cos(c0)*rr,y=Math.sin(c0)*rr;vs.push(sc5(V3.add(V3.add(b0,V3.add(V3.sc(H,x),V3.sc(W,y))),[0,-bl*.18*(x/bl)*(x/bl),0])))}
    const up=N[2]>=0,I=lightI(up?N:V3.sc(N,-1))+R(-.05,.05),bi=(up?0:3)+(I<.5?0:I<.72?1:2),s0=sc5(b0);Lf[ly][bi]+=smooth(out);if(!LOD)for(const v of vs)Vn[ly]+=`M${q5b(s0)}L${q5b(v)}`};
  /* a tendril: from the axil, a fine thread reaching out, then coiling */
  const tendril=(node,r,T,ps)=>{const d0=V3.nz(V3.add(V3.add(V3.sc(r,.7),V3.sc(T,.4)),[0,.2,0])),N2=V3.nz(V3.cr(d0,Math.abs(d0[1])<.9?UP:[1,0,0])),M=V3.cr(N2,d0),len=R(9,14)*UPC*.55*sz,sd=rnd()<.5?1:-1,P2=[];
    for(let i=0;i<=14;i++){const t=i/14,cl=sm01((t-.4)/.6),a=sd*t*Math.PI*4*cl,rc=len*.12*cl;P2.push(sc5(V3.add(V3.add(node,V3.sc(d0,len*t*(1-.5*cl))),V3.add(V3.sc(N2,rc*(1-Math.cos(a))),V3.sc(M,rc*Math.sin(a))))))}
    Td[lay(V3.add(node,V3.sc(d0,len*.5)),ps)]+=sm5(P2.map(p=>[p[0],p[1]]))};
  /* a flower or a bud at the end of its pedicel */
  const bloom=(node,r,T,ps,a)=>{const pd=V3.nz(V3.add(V3.add(V3.sc(r,.6),V3.sc(U2,.55)),[0,R(-.1,.25),0])),pl=R(3,5)*UPC*sz,e=V3.add(node,V3.sc(pd,pl)),ly=lay(e,ps),R0=4.2*UPC*sz*R(.9,1.08);Pt[ly]+=`M${q5b(sc5(node))}L${q5b(sc5(e))}`;
    if(a<.3){/* the bud: an ovoid, its three bracts cupping its foot */const s=R0*(.55+.5*a);Fl[ly].push(par=>{const Bb=spFrame(pd,UP,R(0,6.28));spBud(par,Bb,e,s,s*.5,mix('#8ab05a',cw.c,.15*a),{tp:.45,pw:.6});
        for(let j=0;j<3;j++){const aa=j*2.094,b1=V3.add(e,toV(Bb,[Math.cos(aa)*s*.18,Math.sin(aa)*s*.18,s*.08])),tip=V3.add(e,toV(Bb,[Math.cos(aa)*s*.36,Math.sin(aa)*s*.36,s*.5]));const A2=sc5(e),B2=sc5(b1),T2=sc5(tip);
          E('path',{d:`M${q5b(A2)}Q${q5b(B2)} ${q5b(T2)}Q${f((A2[0]+T2[0])/2+(B2[0]-A2[0])*.2)},${f((A2[1]+T2[1])/2+(B2[1]-A2[1])*.2)} ${q5b(A2)}Z`,fill:'#6f9a44',stroke:'#3e5e26','stroke-width':.35,'stroke-opacity':.7},par)}});return}
    const Nf=V3.nz(V3.add(V3.sc(pd,.5),V3.add(V3.sc(U2,.7),[R(-.25,.25),R(-.1,.3),0]))),cf=V3.add(e,V3.sc(Nf,R0*.02));Fl[ly].push(par=>l50PasFlower(par,cf,Nf,R0,cw,Math.min(1,(a-.3)/.6+.25)))};
  /* the nodes: a leaf, a tendril in its axil, a flower on some */
  const dn=R(7,9)*UPC*sz,nn=Math.max(3,Math.floor((Lv-12)/dn)),fp=(o.fl??.42)*(.5+.5*op),mf=Math.max(1,Math.round(Lv/(22*UPC)));let nf=0;
  for(let i=0;i<nn;i++){const l=12+i*dn+R(-3,3),{p,T}=at(l),q=V3.nz(Math.abs(T[2])<.9?V3.cr(T,[0,0,1]):V3.cr(T,[1,0,0])),q2=V3.cr(T,q),a=i*2.4+R(-.3,.3),r=V3.add(V3.sc(q,Math.cos(a)),V3.sc(q2,Math.sin(a))),u=l/Lv,
      ln=R(6,8)*UPC*sz*(1-.35*u*u);leaf(p,r,T,ln,p);tendril(p,V3.sc(r,-1),T,p);if(i>0&&nf<mf&&(rnd()<fp||i===nn-1&&!nf)){nf++;bloom(p,V3.nz(V3.add(V3.sc(r,-.4),V3.sc(U2,.4))),T,p,Math.min(1,op*R(.75,1.2)))}}
  const svg=par=>{const flat=(d,c,o2={})=>{if(d)E('path',Object.assign({d,fill:c},o2),par)},lt=[LP.d1,LP.b,LP.l1,LB.d1,LB.b,LB.l1];
    const layer=ly=>{if(Td[ly])E('path',{d:Td[ly],stroke:sg.l1,'stroke-width':1.15,fill:'none','stroke-linecap':'round'},par);if(Pt[ly])E('path',{d:Pt[ly],stroke:sg.d1,'stroke-width':f(1.3*sz),fill:'none','stroke-linecap':'round'},par);
      for(let b=0;b<6;b++)flat(Lf[ly][b],lt[b],{stroke:shd(lt[b],-.35),'stroke-width':.35,'stroke-linejoin':'round'});if(Vn[ly])E('path',{d:Vn[ly],stroke:LP.l2,'stroke-width':.4,opacity:.5,fill:'none'},par);for(const fn of Fl[ly])fn(par)};
    layer(0);const P2=pts.map(sc5);E('path',{d:sm5(P2),stroke:sg.d1,'stroke-width':f(1.8*sz),fill:'none','stroke-linecap':'round'},par);
    if(!LOD)E('path',{d:sm5(P2.map(p=>[p[0]-.4,p[1]-.4])),stroke:sg.l1,'stroke-width':f(.6*sz),fill:'none','stroke-linecap':'round',opacity:.7},par);layer(1)};
  svg(k)}
function l50PasDrape(g,t,o){const k=G(g);l50PasStrand(k,o);open(k,t,1100,0,0);return k}
Object.assign(GH,{'passiflora':l50PasDrape});CWS['passiflora']=L50_PAS;SZG['passiflora']=[60,80,80,100,120];
GHI['passiflora']={form:'retombante',size:2,k:'drape',self:100*UPC};

/* ---------- népenthès (Nepenthes × ventrata, N. alata and hybrids 'Bloody Mary', 'Miranda'; Nepenthaceae): a climbing stem with alternate, sessile, lance-shaped leaves whose midrib runs
   out of the tip into a tendril; the tendril hangs, then curls up into the foot of a pitcher 8–20 cm: a swollen bulb narrowing at a waist into a cylinder, two fringed wings down its
   front, a glossy ribbed collar (the peristome) round its mouth, and a lid held up over it on a hinge at the back, a little spur behind. Green speckled and flushed with red, all red,
   burgundy, or lime; the youngest pitchers still small and closed by their lid. Cut stems are sold with three to six pitchers ---------- */
const L50_NEP=[{id:'vert-tache',n:'Vert taché de rouge (ventrata)',c:'#7aa040',sp:'#a8282c',pe:'#b8282e',dn:1},
  {id:'vert',n:'Vert (alata Gaya)',c:'#9aa84a',sp:'#6e7e30',pe:'#c8a83a',dn:.35},
  {id:'citron',n:'Vert citron (Lime)',c:'#b8d04a',sp:'#8aa030',pe:'#d8c040',dn:.3},
  {id:'tigre',n:'Jaune vert marbré (Miranda)',c:'#a8b04a',sp:'#8a2626',pe:'#9a2028',dn:1.8},
  {id:'rouge',n:'Rouge (Bloody Mary)',c:'#b8282e',sp:'#6a1420',pe:'#7a1a24',dn:.9},
  {id:'bordeaux',n:'Bordeaux (Lady Luck)',c:'#6a1a2a',sp:'#3a0a14',pe:'#4a0e1a',dn:.6}];
const L50_NEPPR=gsProf([[0,.14],[.07,.55],[.2,1],[.36,.9],[.54,.64],[.76,.66],[.93,.74],[1,.78]]);
/* one pitcher standing on pb along A (its front toward fr): Lp long, a its age (0 a closed young pitcher, 1 open, lid up) */
function l50Pitcher(par,pb,A,fr,Lp,cw,a){const dt=DET>=1.5,k=G(par),B=spFrame(A,fr,0),y=sm01((a-.15)/.7),Rm=Lp*.17,col=mix(cw.c,'#9ab060',.35*(1-y)),ink=shd(col,-.75),
    body=gsRev(k,B,pb,Lp,t=>Rm*L50_NEPPR(t),col,{ng:dt?18:12,nb:dt?7:4,ct:.85,ink,hl:.22,merge:1,mer:dt?[{a:1.35,c:shd(col,-.3),w:.6,op:.5,t0:.25,t1:.95},{a:1.79,c:shd(col,-.3),w:.6,op:.5,t0:.25,t1:.95}]:null}),
    sc=p=>{const s=l50Q(p);return f(s[0])+','+f(s[1])};
  /* the speckles, on the side that shows */
  if(!LOD&&cw.dn){let d='';const n=Math.round((dt?70:34)*cw.dn*(.4+.6*y));for(let i=0;i<n;i++){const t=R(.05,.92),aa=R(0,6.283),nv=body.nrm(t,aa);if(nv[2]<.12)continue;const v=body.V(t,aa),r=Lp*R(.008,.022)*(cw.dn>1.2?1.6:1);d+=chpDot(v[0],-v[1],Math.max(.45,r))}
    if(d)E('path',{d,fill:cw.sp,opacity:.75},k)}
  /* the wings: two fringed ridges down the front */
  if(!LOD&&y>.3){let d='';for(const aw of[1.35,1.79]){if(body.nrm(.5,aw)[2]<.1)continue;for(let i=0;i<=9;i++){const t=.2+.72*i/9,v=body.V(t,aw),n=body.nrm(t,aw),e=V3.add(v,V3.sc(n,Lp*.025));d+=`M${sc(v)}L${sc(e)}`}}
    if(d)E('path',{d,stroke:shd(col,-.2),'stroke-width':1.1,fill:'none','stroke-linecap':'round'},k)}
  /* the mouth and its collar; the lid on its hinge at the back, raised as it ripens */
  const m=V3.add(pb,V3.sc(A,Lp)),rm=Rm*L50_NEPPR(1),top=A[2]>-.05,X=B[0],Y=B[1],P=pal7(cw.pe);
  const lid=()=>{const hg=V3.add(V3.add(m,V3.sc(Y,-rm*.78)),V3.sc(A,-rm*.04)),dl=V3.nz(V3.add(V3.sc(A,Math.sin(.15+.95*y)),V3.sc(Y,Math.cos(.15+.95*y)))),nl=V3.cr(X,dl),pts=[];
    for(let i=0;i<=20;i++){const th=i/20*6.283,u=Math.sin(th),v=.5-.5*Math.cos(th);pts.push(l50Q(V3.add(V3.add(hg,V3.sc(dl,rm*1.9*v)),V3.add(V3.sc(X,u*rm*(1-.12*v)),V3.sc(nl,-rm*.18*v*v)))))}
    const up=nl[2]>=0,PL=pal7(col);E('path',{d:smooth(pts),fill:toneAt(PL,up?lightI(nl)*.95:.35),stroke:ink,'stroke-width':.45,'stroke-opacity':.55},k);
    if(!LOD&&cw.dn&&up){let d='';for(let i=0;i<Math.round(10*cw.dn);i++){const v=R(.15,.85),u=R(-.6,.6),p=V3.add(V3.add(hg,V3.sc(dl,rm*2*v)),V3.sc(X,u*rm*.8));d+=chpDot(p[0],-p[1],Math.max(.45,Lp*.012))}E('path',{d,fill:cw.sp,opacity:.7},k)}
    const sp=V3.add(hg,V3.add(V3.sc(Y,-rm*.25),V3.sc(A,-rm*.1)));E('path',{d:`M${sc(hg)}L${sc(sp)}`,stroke:shd(col,-.35),'stroke-width':1.2,'stroke-linecap':'round'},k)};
  const mouth=()=>{if(top&&y>.2)E('path',{d:l50RingV(m,X,Y,rm*.86),fill:shd(cw.pe,-.6)},k);E('path',{d:l50RingV(m,X,Y,rm*.98),fill:'none',stroke:toneAt(P,.55),'stroke-width':f(Math.max(1.3,rm*.32)),'stroke-opacity':.95},k);
    if(!LOD){E('path',{d:l50RingV(V3.add(m,V3.sc(A,rm*.04)),X,Y,rm*1.0),fill:'none',stroke:P.l1,'stroke-width':f(Math.max(.5,rm*.08)),'stroke-opacity':.7},k);
      if(dt){let d='';for(let i=0;i<28;i++){const t=i/28*6.283,c=Math.cos(t),s=Math.sin(t),p0=V3.add(m,V3.add(V3.sc(X,c*rm*.84),V3.sc(Y,s*rm*.84))),p1=V3.add(m,V3.add(V3.sc(X,c*rm*1.12),V3.sc(Y,s*rm*1.12)));d+=`M${sc(p0)}L${sc(p1)}`}E('path',{d,stroke:P.d2,'stroke-width':.45,'stroke-opacity':.45,fill:'none'},k)}}};
  const lidBack=V3.dot(V3.cr(X,V3.nz(V3.add(V3.sc(A,Math.sin(.15+.95*y)),V3.sc(Y,Math.cos(.15+.95*y))))),[0,0,1])<0&&Y[2]>0;
  if(lidBack){lid();mouth()}else{mouth();lid()}return k}
function l50NepPlant(g,t,o){const cw=cwPick(L50_NEP,o),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],Lp0=(o.cm||10)*UPC;
  const Lt=o.spine?blen(o.spine):45*UPC*R(.92,1.08),A=spAxis(o,Lt,{face:R(-.6,.6),bow:(rnd()<.5?-1:1)*R(.06,.12)}),L=A.L,Lfl=Math.min(L*.78,o.spine?L*(o.short?.8:.62):L*.8),s0=A.sOf(L-Lfl);
  const SC=['#3a4a22','#5a6e34','#84984e','#b2c07e'],lc=mix(cw.c,'#5f9236',.78);
  spStem(A,parts,[0,s0*.5,s0,s0+(1-s0)*.35,s0+(1-s0)*.7,1],4.4,1.6,SC);
  const nn=Math.max(3,Math.round(Lfl/(Lp0*.85))),dir=rnd()<.5?1:-1;
  for(let i=0;i<nn;i++){const q=i/(nn-1),l=L-Lfl+Lfl*(.04+.94*q)*R(.97,1.02),s=A.sOf(l),fr=A.at(s),az=(i*170+R(-15,15))*D,r=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)*.7),V3.sc(fr.Sd,Math.sin(az)))),p=fr.p;
    /* the leaf: sessile, rising, then arching out; its midrib drawn out at the tip into the tendril */
    const Hd=V3.nz(V3.add(V3.sc(r,.8),V3.sc(fr.T,.5))),Ud=V3.nz(V3s(fr.T,V3.sc(Hd,V3.dot(fr.T,Hd)))),og={pos:p,H:Hd,U:Ud,L:V3.cr(Ud,Hd)},lL=Lp0*R(1.4,1.7)*(1-.3*q*q),LO={fold:.2,droop:.32,arch:.06,wp:LS_LANCE};
    const lp=[];lsLeafParts(og,lL,.27,lc,lp,Object.assign({gloss:.5},LO));for(const pp of lp)pp.z=A.zk(s,pp.z);parts.push(...lp);
    const age=Math.max(0,Math.min(1,op*1.3-(q>.7?(q-.7)*2.4:0)));if(i===0&&nn>3&&rnd()<.5)continue;
    const S=lsLeafS(og,lL,.27,LO),e=S(0,1),e0=S(0,.95),td=V3.nz(V3s(e,e0)),Lp=Lp0*(.35+.65*sm01(age/.7))*R(.88,1.1),Ltd=Lp0*R(.7,1),out=V3.nz([td[0],0,td[2]+.001]),
      pb=V3.add(V3.add(e,V3.sc(out,Ltd*.3)),[0,-Ltd*(.62+.25*age),0]),Ap=V3.nz(V3.add([0,1,0],V3.add(V3.sc(out,.25),[0,0,.15]))),
      C3=[e,V3.add(V3.add(e,V3.sc(td,Ltd*.25)),[0,-Ltd*.45,0]),V3.add(pb,V3.sc(Ap,-Ltd*.45)),pb],TP=[];
    for(let j=0;j<=12;j++){const u=j/12,a=(1-u)**3,b=3*(1-u)**2*u,c=3*(1-u)*u*u,d=u**3;TP.push([0,1,2].map(m=>a*C3[0][m]+b*C3[1][m]+c*C3[2][m]+d*C3[3][m]))}
    let zt=0;for(const q3 of TP)zt+=q3[2];zt/=TP.length;const TPs=TP.map(l50Q),wt=Math.max(1.2,Lp0*.022);
    parts.push({z:A.zk(s,zt),cast:false,fn:par=>{E('path',{d:smooth(TPs,false),stroke:SC[1],'stroke-width':f(wt),fill:'none','stroke-linecap':'round'},par);if(!LOD)E('path',{d:smooth(TPs.map(p2=>[p2[0]-.3,p2[1]-.3]),false),stroke:SC[3],'stroke-width':f(wt*.35),fill:'none','stroke-linecap':'round',opacity:.6},par)}});
    const fp=V3.nz(V3.add(V3.sc(r,.6),[0,0,.8])),zp=pb[2]+Ap[2]*Lp*.5+Lp*.12;parts.push({z:A.zk(s,zp),fn:par=>l50Pitcher(par,pb,Ap,fp,Lp,cw,age)})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.4,bc:SC}}
Object.assign(GH,{'nepenthes':l50NepPlant});CWS['nepenthes']=L50_NEP;SZG['nepenthes']=[6,8,10,10,12,14];
GHI['nepenthes']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.6,fx:6*UPC};GH_BUDS.add('nepenthes');
