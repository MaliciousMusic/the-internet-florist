/* ================= Serre, lot 74 — palmes 2 : cycas (Cycas revoluta), palmier bambou (Rhapis excelsa), palmier queue de poisson (Caryota mitis), palmier nain de Floride (Serenoa repens), palmier de Bismarck (Bismarckia nobilis) ================= */
/* chaque palme est poussée par le L-système : le pétiole puis le rachis suivent leur axe (épine du Composer, arc d'une planche), ses nœuds portent les folioles (cycas), les pennes et leurs folioles en queue de poisson (caryota) ;
   les éventails (rhapis, serenoa, bismarckia) sont des nappes 3D plissées en V (induplication) au bout du pétiole, soudées jusqu'à leur fente puis libres ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l74Op=o=>Math.max(.05,Math.min(1,o.op??1));
/* ---------- the induplicate fan (coryphoid palms): n segments radiating from the hastula over ±th, each segment one or several pleats (g) V-folded (phi) with its midrib down and its margins up;
   fused up to rs·R0, then free, each to its own tip radius (rl by the share of the spread), its width by wp(v) beyond the split; its tip pointed, cleft (cl) or truncate and toothed (td, nt, obl);
   dish (the blade cups back), vf (the halves raised forward, costapalmate), costa (the midrib carried into the blade), dr (the free tips drooping). Stages: the spear folded shut (q small: the pleats
   stand up as an accordion of the same true width), half spread, fully spread. Pushes flat polygons (batched by the caller) ---------- */
function l74Fan(og,Fr,F,R0,op,P,PB,lv,gl,polys,det){const Y=V3.nz(og.H);let Z=V3s(Fr,V3.sc(Y,V3.dot(Fr,Y)));Z=V3l(Z)>1e-3?V3.nz(Z):fgCross(Y)[0];const X=V3.cr(Y,Z),O=og.pos,
    n=F.n,g=F.g||1,q=.1+.9*op,thF=F.th*D,th=thF*q,hbF=thF/n,phi=F.phi*D,cph=Math.cos(phi),Rs=F.rs*R0,r0=R0*.015,ns=2*g,co=F.costa||0;
  const tipS=[],segs=[];for(let i=0;i<n;i++){const a=-th+2*th*(i+.5)/n,u=Math.abs(2*(i+.5)/n-1);segs.push({a,u,rT:R0*F.rl(u)*(1+R(-.03,.03))*(1-.12*(1-q)),obl:(F.obl||0)*R(-1,1)})}
  /* the true half-width of a segment at r, its projected half-width and the height of its fold */
  const hwAt=(S,r)=>{const v=Math.max(0,(r-Rs)/Math.max(1,S.rT-Rs));return r<=Rs?r*hbF/cph:Rs*hbF/cph*F.wp(v,S.u)};
  const tri=s=>{const x=((s+1)*g/2)%1;return 1-Math.abs(2*x-1)};
  const pt=(S,s,r)=>{const hw=hwAt(S,r),pr=hw*q*cph,h=Math.sqrt(Math.max(0,hw*hw-pr*pr))/g,ang=S.a+s*pr/Math.max(r,1e-3),v=Math.max(0,(r-Rs)/Math.max(1,S.rT-Rs)),
      y0=co*R0*Math.max(0,1-Math.abs(ang)/Math.max(th,.2)),x=Math.sin(ang)*r,y=y0+Math.cos(ang)*r,
      z=-h*tri(s)*Math.min(1,r/(R0*.06))-(F.dish||0)*r*r/R0+(F.vf||0)*Math.abs(Math.sin(ang))*r*q-(F.dr||0)*R0*v*v*(r>Rs?1:0);
    return V3.add(O,V3.add(V3.add(V3.sc(X,x),V3.sc(Y,y)),V3.sc(Z,z)))};
  /* the radius where the line s of a segment ends: its tip (cleft: the notch on the midrib; truncate: the teeth along the cut, a little oblique) */
  const tipR=(S,s)=>{const rT=S.rT*(1+S.obl*s);if(F.tip==='cleft')return rT-F.cl*R0*Math.max(0,1-Math.abs(s)/.55);
    if(F.tip==='trunc'){const k=(s+1)/2*F.nt,fr=k-Math.floor(k);return rT-F.td*R0*Math.abs(2*fr-1)*(det?1:.6)}return rT};
  const rad=(S,s)=>{const rt=tipR(S,s),L=[r0,Rs*.5,Rs];for(const v of det?[.2,.4,.6,.78,.9]:[.3,.6,.85])L.push(Rs+(rt-Rs)*v);L.push(rt);return L};
  const sub=F.tip==='trunc'?(det?Math.ceil(F.nt*2/ns)+1:2):F.tip==='cleft'?3:1;
  for(const S of segs){for(let j=0;j<ns;j++){const s0=-1+2*j/ns,s1=-1+2*(j+1)/ns,A=rad(S,s0).map(r=>pt(S,s0,r)),B=rad(S,s1).map(r=>pt(S,s1,r)),T=[];
      for(let m=1;m<sub;m++){const s=s0+(s1-s0)*m/sub;T.push(pt(S,s,tipR(S,s)))}
      const pts=A.concat(T,B.slice().reverse()),sm=(s0+s1)/2,rm=Rs+(S.rT-Rs)*.4;let nr=V3.cr(V3s(pt(S,sm,rm*1.15),pt(S,sm,rm*.85)),V3s(pt(S,s1,rm),pt(S,s0,rm)));nr=V3l(nr)>1e-9?V3.sc(V3.nz(nr),-1):[0,0,1];
      const tn=l58Tone(P,PB,nr,lv,gl);polys.push({pts:pts.map(fgQ),z:pts.reduce((a,p)=>a+p[2],0)/pts.length,col:tn.col})}}
  /* the costa carried into the blade (costapalmate): a wedge on the back of the valley between the two halves */
  if(co){const w=Math.max(F.cw*.5,r0*1.6),tp=V3.add(O,V3.add(V3.sc(Y,co*R0+r0),V3.sc(Z,.6))),b1=V3.add(O,V3.sc(X,w)),b2=V3.add(O,V3.sc(X,-w)),bm=V3.add(O,V3.add(V3.sc(Y,co*R0*.5),V3.sc(Z,1.4))),pts=[b1,V3.add(bm,V3.sc(X,w*.85)),V3.add(tp,V3.sc(X,w*.55)),V3.add(tp,V3.sc(Y,r0)),V3.add(tp,V3.sc(X,-w*.55)),V3.add(bm,V3.sc(X,-w*.85)),b2];
    polys.push({pts:pts.map(fgQ),z:pts.reduce((a,p)=>a+p[2],0)/7+.5,col:F.cc})}
  /* the hastula: a crest on the front where the pleats meet the petiole (lopsided and large on the Bismarck palm) */
  const hs=F.hs*R0,hz=V3.add(O,V3.sc(Z,1.2+hs*.15)),hp=[[-hs*.8,-hs*.15],[-hs*.2,hs*(F.hl||1)],[hs*.6,hs*.7*(F.hl||1)],[hs*.8,-hs*.15],[0,-hs*.4]].map(([x,y])=>V3.add(hz,V3.add(V3.sc(X,x),V3.sc(Y,y))));
  polys.push({pts:hp.map(fgQ),z:hz[2]+.4,col:F.hc});
  return polys}
/* the fan palms' grower: the petiole by the L-system along its axis (fgGrow, no leaves), the fan at its tip, the petiole's teeth (saw palmetto) along its margins toward its foot */
function l74FanPlant(g,t,o,X){const cw=fgCw(X.cws,o),op=l74Op(o),cm0=X.cm,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,X.id,()=>{const cols=l44Cols(cw.st),Lt=o.spine?blen(o.spine):X.pet*UPC*ks*R(.92,1.08),A=fgAxis(o,Lt,R(-X.arch,X.arch)),R00=(o.cm||cm0)*UPC*X.rf,R0=o.spine?Math.min(R00,Lt*X.rk):R00,
      P=pal7(cw.c),PB=pal7(cw.b||cw.c),polys=[],F=Object.assign({},X.fan,{n:X.fan.n+(X.fan.nj?Math.round(R(-X.fan.nj,X.fan.nj)):0),hc:shd(cw.st,X.hk??-.08),cc:cols[2],cw:X.w1*1.3});
    const r=fgGrow(k,A,{li:9*UPC,liT:0,w0:X.w0*Math.min(1.15,.8+.2*ks),w1:X.w1,cols,uL:2,seg:12,wig:.01,tipLv:0,
      tip:og=>{l74Fan(og,A.at(1).Fr,F,R0,op,P,PB,det?4:3,cw.gl??X.gl,polys,det);return null},
      post:(res,parts)=>{if(X.teeth&&!LOD){const c0=res.chains[0],n=c0.pts.length,tt=[];let z=0,nz=0;
          for(let i=2;i<n*X.teeth-1;i+=det?1:2){const p=fgQ(c0.pts[i]),qq=fgQ(c0.pts[i+1]),dx=qq[0]-p[0],dy=qq[1]-p[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=c0.ws[i]/2,ts=Math.max(2.2,w*.5);
            for(const sg of[1,-1]){const bx=p[0]+nx*w*.7*sg,by=p[1]+ny*w*.7*sg;tt.push([[bx-dx/l*ts*.45,by-dy/l*ts*.45],[bx+nx*ts*sg+dx/l*ts*.7,by+ny*ts*sg+dy/l*ts*.7],[bx+dx/l*ts*.5,by+dy/l*ts*.5]])}
            z+=c0.pts[i][2];nz++}
          if(tt.length)parts.push({z:z/nz+.05,cast:false,fn:par=>E('path',{d:tt.map(fgD).join(''),fill:X.tc||cols[0]},par)})}
        l58Batch(polys,det?3:2,parts,{ink:shd(cw.c,-.5),eo:.4})}});
    open(k,t,1000,0,.4);return r})}

/* ---------- lady palm (Rhapis excelsa, « palmier bambou »): clustering canes clad in dark fibre; leaves on slender petioles (20 to 45 cm), the blade palmate, divided almost to the base into 5 to 10
   broad segments, each several-ribbed (3 to 5 pleats), elliptic-oblong, the outer ones narrower; their tips truncate, toothed and a little oblique; glossy dark green. Cut as single leaves for the
   florist (Holland, Florida); stages: the young leaf a closed spear, then half open, then spread ---------- */
const CW_L74RH=[{id:'vert-fonce',n:'Vert foncé brillant',c:'#24452a',b:'#3f6440',st:'#4a6a34',gl:.8},{id:'vert',n:'Vert franc',c:'#33603a',b:'#527a4c',st:'#557a3a',gl:.7}];
const L74_RH={id:'l74rh',cws:CW_L74RH,cm:25,rf:1,pet:34,arch:.06,w0:3.6,w1:2.8,rk:.5,gl:.8,
  fan:{n:7,nj:1,g:3,th:118,phi:11,rs:.07,rl:u=>1-.32*u*u,wp:(v,u)=>(1-.25*u)*(1+4.6*Math.sin(Math.min(1,v/.6)*Math.PI/2))*(1-.12*Math.max(0,(v-.65)/.35)),tip:'trunc',nt:5,td:.022,obl:.07,dish:.12,dr:.05,hs:.04,hl:.8}};
function l74Rhapis(g,t,o){return l74FanPlant(g,t,o,L74_RH)}

/* ---------- saw palmetto (Serenoa repens, « palmier nain de Floride »): a stiff, nearly orbicular fan of 20 to 30 segments, split about halfway, tapering to stiff, shortly cleft tips; on a long
   petiole armed along its margins with fine sharp teeth (hence « saw »); yellow-green to deep green, or blue-silver waxy in the Atlantic-coast form (sold as « silver palmetto »); also dried ---------- */
const CW_L74SE=[{id:'vert',n:'Vert (forme verte)',c:'#4c7a35',b:'#6e8e58',st:'#5a6a3a',gl:.4},{id:'bleu-argente',n:'Bleu argenté (Silver)',c:'#9aa89a',b:'#b4beb2',st:'#7a8a74',gl:.2},
  {id:'vert-bleu',n:'Vert bleuté',c:'#6a8a80',b:'#8ea49a',st:'#6a7a5e',gl:.3},{id:'seche',n:'Séché naturel',c:'#cdb98e',b:'#ddcca6',st:'#b09a6e',gl:0,f:1}];
const L74_SE={id:'l74se',cws:CW_L74SE,cm:45,rf:.6,pet:55,arch:.05,w0:6,w1:4.6,rk:.45,gl:.4,teeth:.75,tc:'#7a5a2e',
  fan:{n:22,nj:2,g:1,th:122,phi:30,rs:.42,rl:u=>1-.3*u*u,wp:v=>1-.75*Math.pow(v,1.4),tip:'cleft',cl:.035,dish:.12,dr:.05,hs:.035,hl:.7}};
function l74Serenoa(g,t,o){return l74FanPlant(g,t,o,L74_SE)}

/* ---------- Bismarck palm (Bismarckia nobilis): an enormous costapalmate fan, nearly round, stiff, divided to a third into 20 to 40 once-folded segments, themselves cleft at their ends; the costa
   carries the blade's middle out along it and the two halves fold up into a shallow V; silver-blue under white wax (the green form rarer); the petiole stout, waxy grey-white, its edges smooth
   (minute teeth at the foot), the adaxial hastula large and lopsided. Cut leaves of 60 to 110 cm for large arrangements ---------- */
const CW_L74BI=[{id:'bleu-argente',n:'Bleu argenté',c:'#a3b6bc',b:'#b4c4c8',st:'#9aaab0',gl:.15},{id:'gris-bleu',n:'Gris bleuté',c:'#8c9ca2',b:'#a2b0b4',st:'#8e9ca0',gl:.15},
  {id:'vert',n:'Vert (forme verte)',c:'#6f8a5a',b:'#8a9e78',st:'#8a9478',gl:.2}];
const L74_BI={id:'l74bi',cws:CW_L74BI,cm:90,rf:.5,pet:80,arch:.04,w0:18,w1:14,hk:.18,rk:.42,gl:.15,
  fan:{n:34,nj:3,g:1,th:150,phi:24,rs:.64,rl:u=>1-.22*u*u,wp:v=>1-.7*Math.pow(v,1.3),tip:'cleft',cl:.028,dish:.1,vf:.3,costa:.24,dr:.06,hs:.09,hl:1.5}};
function l74Bismarck(g,t,o){return l74FanPlant(g,t,o,L74_BI)}

/* ---------- sago palm (Cycas revoluta, « cycas »): a cycad, not a palm — a stiff pinnate leaf, its petiole short and four-angled, armed with short spines (the lowest leaflets reduced); 100 to 160
   leaflets crowded, alternate, narrowly linear (8 to 18 cm by 4 to 6 mm), rigid, glossy dark green, the margins rolled under (revolute), the tip a sharp spine; held in a V up from the rachis.
   The new flush is soft, light green, its leaflets coiled; sold fresh, also bleached-dried and sprayed ---------- */
const CW_L74CY=[{id:'vert-profond',n:'Vert profond brillant',c:'#1f3f22',b:'#4e6a44',st:'#5a5a34'},{id:'vert-olive',n:'Vert olive',c:'#55663a',b:'#7a8a5a',st:'#6a6a3e'},
  {id:'blanchi',n:'Séché blanchi',c:'#e9e2cc',b:'#d8ceb2',st:'#cfc3a2',gl:.1,f:1},{id:'or',n:'Peint or',c:'#c9a646',b:'#a88e4e',st:'#9a8040',gl:.5,f:1},{id:'argent',n:'Peint argent',c:'#c6cac4',b:'#9ea49a',st:'#8e928a',gl:.5,f:1}];
const L74_CY={id:'l74cy',cws:CW_L74CY,cm:80,arch:[.05,.1],bow:.06,u0:.16,curl:0,w0:4.4,w1:1.6,dl:.0085,scale:'#4a4626',dt:.2,tg:.02,
  pl:q=>.2*(.38+.62*Math.sin(Math.min(1,q/.16)*Math.PI/2))*(1-.62*Math.pow(Math.max(0,(q-.6)/.4),1.3)),ang:q=>66-18*q,dih:24,
  ol:{wr:.042,nt:0,t0:.1,fa:.03,wp:prof([[0,.55],[.05,.95],[.2,1],[.7,.92],[.9,.5],[1,0]])},olT:{wr:.042},tw:6,fold:-.35,cup:-.6,droop:0,wave:0,gl:1,tip:.12};
function l74Cycas(g,t,o){const op=l74Op(o),yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),cw=fgCw(CW_L74CY,o);if(!yg)return l58Frond(g,t,o,L74_CY);
  /* the young flush: leaflets short, light green, still held up along the rachis */
  const X=Object.assign({},L74_CY,{ang:q=>(66-18*q)*(1-.62*yg),dih:24+40*yg,fold:-.35-.4*yg}),c=mix(cw.c,'#8db04a',.75*yg),w2=Object.assign({},cw,{c,b:mix(cw.b,'#a6c070',.7*yg),st:mix(cw.st,'#8a9a50',.6*yg)});
  return l58Frond(g,t,Object.assign({},o,{cw:w2}),X)}

/* ---------- fishtail palm (Caryota mitis): the only bipinnate palm leaf — the rachis bears primary pinnae, each with alternate leaflets, and leaflets alone toward its tip; every leaflet obliquely
   wedge-shaped like a fish's tail, its veins fanning from a narrow base, the upper margin long and straight, the apex cut off obliquely and jagged (praemorse), the terminal leaflet broad and
   symmetric; mid-green, paler beneath. Cut as leaf sections of 50 to 90 cm with 12 to 20 leaflets ---------- */
const CW_L74CA=[{id:'vert',n:'Vert franc',c:'#4c7a35',b:'#76985e',st:'#5a7a3a'},{id:'vert-clair',n:'Vert clair',c:'#5f8a42',b:'#86a66a',st:'#6a8a44'},{id:'vert-profond',n:'Vert profond',c:'#355f2c',b:'#5e7e50',st:'#4e6a34'}];
/* the fishtail outline (x across toward the parent's tip, y along): the long distal margin to the apex, the short proximal one, the jagged oblique cut between them back to the middle */
function l74FishOl(term,det){const jag=(a,b,m,d)=>{const out=[];for(let i=1;i<m;i++){const t=i/m,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t-(i%2?d*R(.6,1.3):0);out.push([x,y])}return out};
  const mt=term?[0,.9]:[-.04,.8],m=det?7:4,mid=[[0,0],[0,.3],[mt[0]*.5,.6],mt];
  const A=term?[[.04,.04],[.16,.35],[.3,.72],[.36,.86]]:[[.035,.04],[.1,.32],[.19,.66],[.25,.94],[.27,1]],Bs=term?[[-.04,.04],[-.16,.35],[-.3,.72],[-.36,.86]]:[[-.035,.04],[-.11,.25],[-.24,.46],[-.34,.6]];
  const sA=A.concat(jag(A[A.length-1],mt,m,.05),[mt]),sB=Bs.concat(jag(Bs[Bs.length-1],mt,m,.045),[mt]);return{mid,A:sA,B:sB,fa:0}}
function l74Caryota(g,t,o){const cw=fgCw(CW_L74CA,o),op=l74Op(o),cm0=12,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l74ca',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks*5.6,A=l58Axis(o,Lt,(rnd()<.5?-1:1)*R(.08,.16),.1*R(.8,1.2)),yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),fy=1-.35*yg,
      Le=A.L,l0=A.l0||0,lb=l0+(Le-l0)*(o.spine?.3:.36),Lb=Le-lb,cols=l44Cols(cw.st),lim=g35Lim(o),Lf=Math.min(cm0*UPC*ks,o.spine?Lb*.32:1e9)*fy,
      P=pal7(cw.c),PB=pal7(cw.b),C={P,PB,lv:det?4:3,gl:.3,lim,wr:.6},nodes=[],nb=Math.round(R(6,8));
    for(let i=0;i<nb;i++)nodes.push(lb+Lb*(.04+.8*Math.pow(i/nb,.85))*R(.97,1.03));
    /* a primary pinna: B(n) → F [ ±α Lf ] B(n−1), alternate leaflets, ending in its terminal leaflet */
    const rules={B:p=>{if(p.n<=0)return[['F',{l:p.li*.45,w1:1.2,e:-.006}],['Lf',{s:0,sz:p.k*.9}]];const tq=1-p.n/p.n0;
      return[['F',{l:p.li*R(.9,1.1),w1:Math.max(1.2,p.w*(1-.4*tq)),e:-.008}],['[',{}],['+',{a:p.s*R(34,46)*(1-.6*yg)}],['&',{a:R(-6,6)}],['Lf',{s:p.s,sz:p.k*(1-.2*tq)}],[']',{}],['B',Object.assign({},p,{n:p.n-1,s:-p.s})]]}};
    const res=l44Main(A,nodes,{w0:4.2*Math.min(1.1,kz),w1:1.5,cols,step:o.spine?8:6,depth:10,rules,
      node:(i,u,w)=>{const q=(nodes[i]-lb)/Lb,s=i%2?1:-1,dih=14+R(-5,5);
        if(q<.5){const n=Math.max(2,Math.round((5-3.4*q)*R(.85,1.15))),wp=Math.max(1.3,w*.55);return[['[',{w:wp}],['+',{a:s*(52-16*q)*(1-.5*yg)}],['&',{a:dih}],['B',{n,n0:n,li:Lf*.42,s:-s,k:1-.25*q,w:wp}],[']',{}]]}
        return[['[',{}],['+',{a:s*(44-10*q)*(1-.55*yg)}],['&',{a:dih}],['Lf',{s,sz:1-.35*q}],[']',{}]]}});
    const polys=[],ols=[0,1,2].map(()=>l74FishOl(0,det)),olT=l74FishOl(1,det);
    for(const og of res.organs){if(og.t!=='Lf'&&og.t!=='T')continue;const term=og.t==='T'||!og.p.s,len=Lf*(term?.95:og.p.sz||1)*R(.94,1.06),
        r=l58Pin(og,len,term?olT:ols[Math.floor(rnd()*3)],term?1:-og.p.s,{tw:R(-12,12)*D,fold:.05+.35*yg,cup:.06,arch:.03,droop:.04*(1-yg)},C);if(r)polys.push(...r)}
    const parts=[],away=A.at(.6).Fr[2]<0;l58Rachis(res.chains[0],cols,parts,away?3:.4,null);
    const sub=res.chains.slice(1);if(sub.length){let zA=0,nA=0;for(const ch of sub)for(const p of ch.pts){zA+=p[2];nA++}
      parts.push({z:zA/nA+(away?2:-.3),cast:false,fn:par=>E('path',{d:sub.map(ch=>polyRibbon(ch.pts.map(fgQ),i=>Math.max(1.2,ch.ws[i])/2)).join(''),fill:cols[1]},par)})}
    l58Batch(polys,det?3:2,parts,{ink:shd(cw.c,-.5),eo:.4});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the cycas leaf's length; the fan's diameter for rhapis, serenoa, bismarckia; the caryota leaflet's length),
   and how the composer treats them: foliage stems at their natural length ---------- */
Object.assign(GH,{'cycas-revoluta':l74Cycas,'rhapis-excelsa':l74Rhapis,'caryota-mitis':l74Caryota,'serenoa-repens-palmetto':l74Serenoa,'bismarckia-nobilis':l74Bismarck});
Object.assign(CWS,{'cycas-revoluta':CW_L74CY,'rhapis-excelsa':CW_L74RH,'caryota-mitis':CW_L74CA,'serenoa-repens-palmetto':CW_L74SE,'bismarckia-nobilis':CW_L74BI});
Object.assign(SZG,{'cycas-revoluta':[60,80,80,100],'rhapis-excelsa':[20,25,25,32],'caryota-mitis':[10,12,12,15],'serenoa-repens-palmetto':[35,45,45,60],'bismarckia-nobilis':[60,80,90,110]});
const L74_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'cycas-revoluta':L74_I(80,{fx:24}),'rhapis-excelsa':L74_I(55,{fx:46}),'caryota-mitis':L74_I(70,{fx:30}),'serenoa-repens-palmetto':L74_I(85,{fx:56}),'bismarckia-nobilis':L74_I(110,{fx:60})});
