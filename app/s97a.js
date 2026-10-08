/* ================= Serre, lot 97 — arbustes à fleurs 2 : groseillier à fleurs, enkianthus (dodan-tsutsuji), glycine, mitsumata, piéris du Japon ================= */
/* des rameaux ligneux poussés par le L-système : le groseillier et la glycine par le moteur des branches du lot 39 (l39Sprig : nœuds alternes, rameaux, écorce),
   l'enkianthus, le mitsumata et le piéris par un moteur à étages (l97Shoot) : l'axe suit l'épine du Composer, à chaque étage un verticille de rameaux qui se ramifient à leur tour
   (en fourches par trois pour le mitsumata), et au bout de chaque rameau ses organes (rosette de feuilles, ombelle de clochettes, panicule, boule de fleurs).
   Les grappes pendent sous leur poids depuis leur rameau (l97Hang) et restent au-dessus de l'ouverture du vase ; toute liaison (rachis, pédicelle, pétiole) fait au moins 1,15 unité */
const l97C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),l97Q=p=>[p[0],-p[1]];
/* ---------- the tiered shoot engine: the frame of l39Sprig (the composer's spine, or standing in the view; the seed fixed per view on sheets), the module list grown by S.grow from rules,
   the side chains kept above the mouth, the organs drawn by S.organ, the bark by S.bark; it hands back {k, bw, bw1, bc} ---------- */
function l97Shoot(g,t,o,S){const k=G(g),parts=[],sp=o.spine,fr=sp?l97C(o.from||0,0,.92):0,op=l97C(o.op??1,.05,1),sv=seed;
  const rs=!sp&&!!o.ax&&o.roll===0;if(rs)seed=f15Hash(S.id+'|'+(o.cm||0)+'|'+Math.round(op*20));
  let P0=[0,0,0],H0,U0,Lt,pts=null,cum=null,af=0;
  if(sp){af=fr>0?blen(bseg(sp,0,fr)):0;const N=48;pts=[];for(let i=0;i<=N;i++){const q=bz(sp,fr+(1-fr)*i/N);pts.push([q[0],-q[1],0])}cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));Lt=cum[N];P0=pts[0];H0=V3.nz(V3s(pts[1],pts[0]));U0=[0,0,1]}
  else{const B=frameOf(o,0),U=toV(B,[0,0,1]);Lt=(o.cm>(S.cmMin||15)?o.cm:S.len)*UPC*(.9+.1*op);H0=rotA(toV(B,[0,1,0]),U,R(-.05,.05));U0=U}
  const at=a=>{let i=1;while(i<cum.length-1&&cum[i]<a)i++;const t2=l97C((a-cum[i-1])/((cum[i]-cum[i-1])||1));return V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t2))};
  const wAt=a=>S.w1+(S.w0-S.w1)*Math.pow(Math.max(0,1-(af+a)/(af+Lt)),S.wp??.85);
  /* the main axis from a to b: free (bent by the tropism) on a sheet, along the spine in a bouquet */
  const chord=(a,b)=>{if(!sp)return[['F',{l:Math.max(.5,b-a),w1:wAt(b),e:S.e??0}]];const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+8),p=at(x),q=at(y),d=V3s(q,p),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  const a0=sp?(fr>0?Lt*.04:Math.max(Lt*(1-S.leafy),Lt*.17)):Lt*(1-S.leafy),lim=sp&&fr===0?-3:null;
  const G0=S.grow({Lt,a0,chord,wAt,sp:!!sp,op}),res=lsTurtle(lsDerive(G0.axiom,G0.rules,G0.steps||40),{p:P0,H:H0,U:U0,w:wAt(0),T:[0,1,0],e:0,wig:S.wig||0,seg:S.seg||7});
  for(const ch of res.chains)ch.c=S.cols;
  /* in a bouquet, a stem rising from the mouth keeps its side shoots above it */
  if(lim!=null){const y0=-lim+(S.clr||0);for(const ch of res.chains)if(ch.ord)for(const q of ch.pts)q[1]=Math.max(q[1],y0);for(const og of res.organs)if(og.ord)og.pos[1]=Math.max(og.pos[1],y0)}
  for(const og of res.organs){const pp=S.organ(og,lim,U0);if(pp)parts.push(...pp)}
  S.bark(res.chains,parts,sp);
  drawParts(k,parts);if(rs)seed=sv;open(k,t,1000,0,.4);return{k,bw:S.w0,bw1:fr>0?wAt(0):undefined,bc:S.cols}}
/* ---------- shared organs ---------- */
/* a hanging axis (rachis, pedicel): from P0 along d0, bending down under its weight (g per step); fitted above the mouth (lim, with room m below it) by shortening, else null */
function l97Hang(P0,d0,L,g,n,lim,m=0,ks=[1,.82,.66,.52]){for(const k of ks){const pts=[P0];let d=V3.nz(d0),p=P0;for(let i=0;i<n;i++){d=V3.nz(V3.add(V3.sc(d,1-g),[0,-g,0]));p=V3.add(p,V3.sc(d,L*k/n));pts.push(p)}
    if(lim==null||l45Low(pts)-m*k>-lim+2)return{pts,k}}return null}
/* a point and its tangent at a fraction s along a polyline */
function l97At(pts,s){const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const L=cum[cum.length-1],x=l97C(s)*L;let i=1;while(i<pts.length-1&&cum[i]<x)i++;
  const u=l97C((x-cum[i-1])/((cum[i]-cum[i-1])||1));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),L}}
/* a rachis drawn as tapered pieces in the painter's order (w0 at its base to w1 at its tip, never under 1.2) */
function l97Rachis(pts,w0,w1,col,parts,zb=-.05){const n=pts.length;for(let a=0;a<n-1;a+=3){const b=Math.min(n-1,a+3),P=[],W=[];let z=0;for(let i=a;i<=b;i++){P.push(l97Q(pts[i]));W.push(Math.max(1.2,w0+(w1-w0)*i/(n-1)));z+=pts[i][2]}
  parts.push({z:z/(b-a+1)+zb,cast:false,fn:par=>E('path',{d:polyRibbon(P,i=>W[i]/2),fill:col},par)})}}
/* a curved stroke from a to b in view space, sagging by sg (pedicels, peduncles) */
function l97Ped(a,b,sg){const m=V3.add(V3.sc(V3.add(a,b),.5),[0,sg,0]);return`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`}
const l97PedS=(par,d,w,col)=>{if(d)E('path',{d,stroke:col,'stroke-width':f(Math.max(1.15,w)),fill:'none','stroke-linecap':'round'},par)};
/* a hanging urn or bell at P (view space, where its pedicel ends), its axis Z toward the mouth: body of revolution len × rad·rp(t), its calyx at the top, its mouth (five small lobes turned out);
   seen into the mouth, the dark throat */
function l97Bell(par,P,Z,len,rad,rp,col,o={}){const B=spFrame(Z,[0,0,1],o.roll||0),Pl=pal7(col),ink=o.ink||shd(col,-.5),hb=b29Rev(B,P,len,rad,rp,0,1,7,10);
  E('path',{d:smooth(hb),fill:o.flat?toneAt(Pl,.6):budFill(col),stroke:ink,'stroke-width':.3,'stroke-opacity':.55},par);
  const zm=V3.dot(Z,[0,0,1]),rm=rad*rp(1)*1.12;
  if(zm>.25){E('path',{d:smooth(spDisc(B,P,rm,len,10)),fill:toneAt(Pl,.75),stroke:ink,'stroke-width':.3,'stroke-opacity':.5},par);E('path',{d:smooth(spDisc(B,P,rm*.55,len*.97,8)),fill:o.throat||shd(col,-.45)},par)}
  else if(DET>=1.5){/* the lobes, a scalloped rim below the waist */let d='';const n=5;for(let j=0;j<n;j++){const a=(j/n+.1)*6.283,c=PJ(B,P,[Math.cos(a)*rm*.92,Math.sin(a)*rm*.92,len*1.01]);d+=`M${f(c[0]-.5)},${f(c[1])}a.5,.5 0 1,0 1,0a.5,.5 0 1,0 -1,0`}
    E('path',{d,fill:toneAt(Pl,.8),opacity:.9},par)}
  if(o.cal){const q=spDisc(B,P,Math.max(.7,rad*.62),len*.04,8);E('path',{d:smooth(q),fill:o.cal},par)}}
/* the leaves of a rosette at the tip of a shoot (og: its frame), spreading at ang [base, top] from the axis, the outer ones lower and larger; leaf(pseudo-organ, j, n) draws one */
function l97Rosette(og,n,ang,drop,leaf){const H=V3.nz(og.H),[X,Y]=fgCross(H),out=[],ph0=R(0,6.283);
  for(let j=0;j<n;j++){const q=j/Math.max(1,n-1),ph=ph0+j*2.39996,rd=V3.add(V3.sc(X,Math.cos(ph)),V3.sc(Y,Math.sin(ph))),a=(ang[0]+(ang[1]-ang[0])*q+R(-6,6))*D,Hj=V3.nz(V3.add(V3.sc(H,Math.cos(a)),V3.sc(rd,Math.sin(a)))),
      Lj=V3.nz(V3.cr(H,rd)),Uj=V3.cr(Hj,Lj),pos=V3.add(og.pos,V3.sc(H,-drop*(1-q)));const pp=leaf({pos,H:Hj,U:Uj,L:Lj,w:og.w||1.4,p:{ph:0,q}},j,n);if(pp)out.push(...pp)}
  return out}

/* ---------- groseillier à fleurs (Ribes sanguineum, Grossulariaceae): upright shoots of red-brown bark, flaking grey on old wood, with pale lenticels; leaves alternate, palmately 3–5-lobed,
   5–10 cm, rounded, doubly toothed, softly downy, pleated along the veins when young, smelling of currants; with them in early spring, from the same buds, hanging racemes 5–8 cm long
   of 10–30 small tubular flowers (1 cm): a coloured hypanthium tube, five oblong spreading sepals, five small erect petals, paler (white in the red cultivars); coloured bracts; the racemes
   first drooping, the flowers opening from the base; the buds in a tight pendant cone. The trade: 'King Edward VII', 'Pulborough Scarlet', 'Koja', 'Atrorubens', 'Pokey's Pink',
   'White Icicle', 'Tydeman's White' (bare cut branches forced from January, 50–80 cm) ---------- */
const CW_L97GR=[{id:'king',n:'Rouge cramoisi (King Edward VII)',c:'#c42446',p:'#f4e6ea'},{id:'pulborough',n:'Rouge vif (Pulborough Scarlet)',c:'#d4283e',p:'#fbf2ee'},
  {id:'koja',n:'Rose rouge (Koja)',c:'#d84a6e',p:'#f8e0e6'},{id:'atro',n:'Pourpre rouge (Atrorubens)',c:'#a2203e',p:'#f0d8de'},{id:'pokey',n:'Rose tendre (Pokey’s Pink)',c:'#ee9ab4',p:'#fbeef2'},
  {id:'blanc',n:'Blanc (White Icicle)',c:'#f6f2ea',p:'#ffffff',w:1}];
const L97_GR_WP=prof([[0,.5],[.06,.86],[.16,1],[.27,.95],[.35,.74],[.43,.86],[.53,.8],[.61,.55],[.68,.6],[.78,.42],[.9,.2],[1,0]]),L97_GR_TUBE=t=>.62+.38*Math.pow(t,1.6),L97_GR_BUD=t=>Math.pow(Math.sin(Math.PI*Math.min(.99,.06+.94*t)),.7)*(1-.25*t),
  L97_GR_SEP=prof([[0,.45],[.25,.85],[.6,1],[.85,.86],[1,.55]]),
  L97_GR_V=[[[0,.02],[.55,.2],[.92,.34]],[[0,.02],[.42,.4],[.7,.66]],[[0,.02],[-.55,.2],[-.92,.34]],[[0,.02],[-.42,.4],[-.7,.66]]];
function l97GrLeaf(og,lim,cw,op){const y=l97C(op),sz=UPC*R(3.2,4.6)*(.5+.5*y)*(og.p.b?.85:1),c=mix(mix('#6e9a3a',shd('#6e9a3a',R(-.1,.12)),.6),'#b8cc70',(1-y)*.45),nv=DET>=1.5?24:12;
  return l39Leaf(og,lim,{sz,wr:.98,wp:l39ViWp(L97_GR_WP,nv),rho:R(55,85),c,cb:mix(c,'#d0d8b8',.35),nv,mt:.72,pet:UPC*R(1.3,2)*(.6+.4*y),pw:1.2,pc:mix(c,'#8a4a3a',.35),
    sh:{arch:.05,fold:.22+.25*(1-y),cup:.1,droop:.06,curl:-.03,tw:R(-.3,.3)},bo:{mid:DET>=1.5?mix(c,'#eef2d0',.35):null,mo:.5,veins:DET>=1.5?L97_GR_V:null,vc:shd(c,-.3),vo:.4,vw:.4}})}
/* one flower at the end of its pedicel: its axis Z out and down; open, the tube then the star of sepals round the pale petals; a bud, a closed spindle */
function l97GrFlower(par,P,Z,sz,ag,cw,cache){const B=spFrame(Z,[0,1,0],R(-.4,.4)),c=cw.c,tc=cw.w?'#eef0d8':shd(c,-.08);
  if(ag<.35){const bl=sz*(.5+.5*ag/.35),bc=mix(c,shd(c,-.25),.4);E('path',{d:smooth(b29Rev(B,P,bl,bl*.42,L97_GR_BUD,0,1,6,8)),fill:budFill(cw.w?'#e8ecd4':bc),stroke:shd(bc,-.45),'stroke-width':.3,'stroke-opacity':.55},par);return}
  const tl=sz*.62,op=l97C((ag-.35)/.5),M=V3.add(P,V3.sc(Z,tl));
  E('path',{d:smooth(b29Rev(B,P,tl,sz*.13,L97_GR_TUBE,0,1,4,8)),fill:budFill(tc),stroke:shd(tc,-.45),'stroke-width':.3,'stroke-opacity':.55},par);
  b29Corolla(par,B,M,{n:5,r0:sz*.1,L:sz*.42,W:sz*.19,a0:1.2-op*.85,a1:1.0-op*.9,wp:L97_GR_SEP,cu:.1,ht:.25,col:c,colB:mix(c,'#f0e0e0',.12),rot:R(0,1.2),jit:.1,jl:.08,ink:shd(c,-.5),
    centre:(par,B,O)=>{b29Disc(par,B,O,sz*.11,sz*.1,cw.p,{ink:shd(c,-.4)});if(DET>=1.5)b29Disc(par,B,O,sz*.04,sz*.16,'#e8d070')}},cache)}
/* a hanging raceme from a node: its bracts at the base, the rachis falling from the shoot, the flowers on short pedicels all round it, open from the base, buds toward the tip */
function l97GrRac(P0,d0,cw,op,lim,cache){const Lr=UPC*R(4.5,6.5)*(.55+.45*op),sz=UPC*R(1,1.15),H=l97Hang(P0,d0,Lr,.26,8,lim,sz*1.4);if(!H)return null;
  const pts=H.pts,parts=[],n=Math.round((DET>=1.5?18:9)*(.75+.25*H.k)),rc=mix(cw.c,'#7a3a30',.5);let pd='';const fl=[];
  l97Rachis(pts,1.5,1.2,rc,parts);
  for(let i=0;i<n;i++){const q=i/(n-1),A=l97At(pts,.12+.86*q),[X,Y]=fgCross(A.T),a=i*2.39996+R(-.3,.3),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),
      ag=l97C(op*1.35-q*.75+R(-.08,.06)),pl=UPC*R(.25,.4),pdir=V3.nz(V3.add(V3.sc(rd,.8),V3.add(V3.sc(A.T,.2),[0,-.35,0]))),e=V3.add(A.p,V3.sc(pdir,pl)),
      Z=V3.nz(V3.add(V3.sc(pdir,.55),[0,-.85,0])),s=sz*(.6+.4*(1-q*.5));pd+=l97Ped(A.p,e,-pl*.15);fl.push({z:e[2],e,Z,s,ag})}
  parts.push({z:pts.reduce((s,q)=>s+q[2],0)/pts.length-.08,cast:false,fn:par=>l97PedS(par,pd,1.15,rc)});
  for(const F of fl)parts.push({z:F.z,cast:false,fn:par=>l97GrFlower(par,F.e,F.Z,F.s,F.ag,cw,cache)});
  /* the pink bracts and the brown scales of the bud it came from, at the base */
  parts.push({z:P0[2]+.06,cast:false,fn:par=>{const B=spFrame(V3.nz(d0),[0,1,0],0);E('path',{d:smooth(b29Rev(B,P0,UPC*.55,UPC*.36,L39_EGG,0,.85,5,8)),fill:mix('#8a5a40',cw.c,.3),stroke:'#3a2018','stroke-width':.3,'stroke-opacity':.6},par)}});
  return parts}
function l97GroseillierPlant(g,t,o){const cw=cwPick(CW_L97GR,o),op=l97C(o.op??1,.05,1),cache={},wood=l39Wood('#6a3a2c'),tw=l39Wood('#86503a');let nr=0;
  return l39Sprig(g,t,o,{id:'gr-'+cw.id,len:65,leafy:.86,inter:[4.2,3],nl:1,div:137.5,ang:[48,38],w0:UPC*.75,w1:1.4,cols:wood,e:.004,wig:.016,zig:7,twist:12,tip:1.2,clr:3,
    br:{zone:[.15,.7],p:.4,max:o.spine?1:2,gap:2,n:[3,5],li:4,ang:34,eb:.003,ls:.85,wk:.55},
    leaf:(og,lim)=>op<.12||(og.p.q??0)<.15?null:l97GrLeaf(og,lim,cw,op),
    node:(og,lim)=>{const q=og.p.q??0,ph=(og.p.ph||0)*D,sd=V3.nz(V3.add(V3.sc(og.U,-Math.cos(ph)),V3.sc(og.L,Math.sin(ph)))),P=V3.add(og.pos,V3.sc(sd,og.w*.3)),H=og.H;
      if(q<.12||rnd()>.82||nr>=(o.spine?5:10))return[l39NodeBud(og,UPC*.6,Math.max(1.2,og.w*.5),'#7a4632',.4,{rp:L39_EGG,scales:3})];
      const rc=l97GrRac(P,V3.nz(V3.add(V3.sc(sd,.75),V3.add(V3.sc(H,.3),[0,-.15,0]))),cw,op,lim,cache);if(!rc)return null;nr++;return rc},
    apex:(og,lim)=>{const P=og.pos,H=og.H,rc=l97GrRac(P,V3.nz(V3.add(V3.add(V3.sc(H,.25),V3.sc(og.L,.8)),[0,-.2,0])),cw,op,lim,cache);return rc||[l39Ovoid(P,H,UPC*.8,Math.max(1.3,og.w*1.1),L39_EGG,'#7a4632',{scales:3})]},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?tw:wood,(P,W)=>DET>=1.5?l39Lenti(P,W,.07,'#d8b8a0',{l0:.15,l1:.3,w:.4,op:.6}):null)})}

/* ---------- enkianthus (Enkianthus perulatus, Ericaceae, « dodan-tsutsuji »): a shrub branching in tiers — every year's shoot ends in a tuft of leaves and, below it, a whorl of 3–5 new shoots,
   so the cut branch rises in flat storeys of slender grey-brown twigs, smooth, reddish when young; the leaves crowded in rosettes at the tips, obovate-elliptic, 2–4 cm, finely toothed,
   bright fresh green, turning a brilliant scarlet in autumn; in spring, under each rosette, an umbel of 3–10 white urn-shaped bells (8 mm), five small recurved lobes, hanging on slender
   pedicels (1.5–2 cm). Japanese florists' great branch (1–2 m): green in summer, red in autumn, flowering in spring ---------- */
const CW_L97EN=[{id:'vert',n:'Vert vif (feuillé, été)',c:'#5e9e34',m:'vert'},{id:'fleuri',n:'Vert tendre, clochettes blanches (printemps)',c:'#88b848',m:'fl',fl:'#fbfaf2'},
  {id:'rouge',n:'Rouge écarlate (automne)',c:'#c42a22',m:'aut',a:['#b01e1e','#d84a28']},{id:'orange',n:'Orange et rouge (automne)',c:'#de6a26',m:'aut',a:['#d0401e','#e8962e']}];
const L97_EN_WP=prof([[0,.14],[.15,.42],[.4,.78],[.65,1],[.85,.82],[.96,.4],[1,.05]]),L97_EN_URN=t=>t<.1?.5+5*t*.6:t<.6?.8+.2*Math.sin(Math.PI*(t-.1)/.5*.5):1-.42*Math.pow((t-.6)/.4,1.2),
  L97_EN_V=[0,1,2,3].map(k=>{const v=.15+.18*k;return[[0,v],[.5,v+.1],[.85,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]);
function l97EnLeaf(og,lim,cw,op,q){const y=cw.m==='fl'?.6+.4*op:1,sz=UPC*R(2.6,3.6)*(.55+.45*q)*y,c0=cw.m==='aut'?mix(cw.a[0],cw.a[1],rnd()):cw.c,c=mix(c0,shd(c0,R(-.12,.1)),.6);
  return l39Leaf(og,lim,{sz,wr:.5,wp:L97_EN_WP,rho:R(65,95),c,cb:mix(c,cw.m==='aut'?'#e0a080':'#c8d4a8',.3),nv:DET>=1.5?10:5,mt:.8,pet:DET>=1.5?UPC*.45:0,pw:1.15,pc:cw.m==='aut'?shd(c,-.3):'#8a5a3a',
    sh:{arch:.04,fold:.12,cup:.06,droop:.12,curl:-.04,tw:R(-.25,.25)},bo:{mid:DET>=1.5?mix(c,'#f0f0c8',.35):null,mo:.5,veins:DET>=1.5?L97_EN_V:null,vc:mix(c,'#f0f0c8',.3),vo:.32,vw:.3}})}
/* the umbel under a rosette: slender pedicels arching out and down from the tip, a white urn hanging at the end of each */
function l97EnUmbel(og,cw,op,lim){const P0=og.pos,H=V3.nz(og.H),[X,Y]=fgCross(H),n=Math.round(R(4,8)),parts=[],ph0=R(0,6.283),pc='#9a7a52';let pd='';const B0=[];
  for(let j=0;j<n;j++){const a=ph0+j*6.283/n+R(-.3,.3),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),pl=UPC*R(1.4,2)*(.6+.4*op),d0=V3.nz(V3.add(V3.sc(rd,.9),V3.sc(H,.25))),
      Hh=l97Hang(P0,d0,pl,.3,5,lim,UPC*.9);if(!Hh)continue;const e=Hh.pts[Hh.pts.length-1],T=V3.nz(V3s(e,Hh.pts[Hh.pts.length-2])),Z=V3.nz(V3.add(V3.sc(T,.35),[0,-1,0]));
    pd+='M'+Hh.pts.map(q=>f(q[0])+','+f(-q[1])).join('L');const ag=l97C(op*1.25+R(-.15,.1)),s=UPC*1.05*(.45+.55*ag);B0.push({e,Z,s,ag})}
  if(!B0.length)return null;parts.push({z:P0[2]-.1,cast:false,fn:par=>l97PedS(par,pd,1.15,pc)});
  for(const b of B0)parts.push({z:b.e[2],cast:false,fn:par=>{const st=V3.add(b.e,V3.sc(b.Z,-b.s*.05));if(b.ag<.3)l97Bell(par,st,b.Z,b.s*.8,b.s*.32,L97_GR_BUD,mix(cw.fl,'#b8c890',.4),{cal:'#7a8a40'});
    else l97Bell(par,st,b.Z,b.s,b.s*.36,L97_EN_URN,mix(cw.fl,'#f4e0d0',.15),{cal:'#8a9848',throat:'#b0a080'})}});
  return parts}
function l97EnkianthusPlant(g,t,o){const cw=cwPick(CW_L97EN,o),op=l97C(o.op??1,.05,1),wood=l39Wood('#6a5a4e'),tw=l39Wood(cw.m==='aut'?'#8a4a3a':'#7a5a48');
  return l97Shoot(g,t,o,{id:'en-'+cw.id,len:90,leafy:.75,w0:UPC*.8,w1:1.25,wp:.8,cols:wood,e:.004,wig:.012,clr:4,
    grow:({Lt,a0,chord})=>{const nT=Math.max(2,Math.round((Lt-a0)/(UPC*R(11,14)))),T=[];for(let i=0;i<nT;i++)T.push(a0+(Lt-a0)*(i+.6)/(nT+.4)*R(.95,1.03));
      const rules={A:p=>{const i=p.i;if(i>=nT)return[...chord(T[nT-1],Lt),['Ap',{q:1}]];const q=i/Math.max(1,nT-1),nb=Math.round(R(3,5)),ph=R(0,360),out=[...chord(i?T[i-1]:0,T[i]),['Nd',{}]];
          for(let j=0;j<nb;j++)out.push(['[',{w:Math.max(1.3,UPC*.32*(1-.5*q))}],['/',{a:ph+j*360/nb+R(-18,18)}],['&',{a:R(62,78)}],['B',{d:q<.45?1:0,len:UPC*R(9,14)*(1-.35*q),w:Math.max(1.3,UPC*.3*(1-.5*q))}],[']',{}]);
          out.push(['A',{i:i+1}]);return out},
        B:p=>{const out=[['F',{l:p.len,w1:Math.max(1.25,p.w*.7),e:.014}]];if(p.d<=0){out.push(['Ap',{q:.6}]);return out}
          const nb=Math.round(R(2,4)),ph=R(0,360);out.push(['Nd',{}]);for(let j=0;j<nb;j++)out.push(['[',{w:Math.max(1.25,p.w*.7)}],['/',{a:ph+j*360/nb+R(-20,20)}],['&',{a:R(40,60)}],['B',{d:p.d-1,len:p.len*R(.55,.75),w:Math.max(1.25,p.w*.7)}],[']',{}]);return out}};
      return{axiom:[['A',{i:0}]],rules,steps:nT+6}},
    organ:(og,lim)=>{if(og.t==='Nd')return null;if(og.t!=='Ap')return null;const n=Math.round(R(4,7)),lv=op<.15&&cw.m==='fl'?[]:l97Rosette(og,n,[78,48],UPC*.25,(lo,j)=>l97EnLeaf(lo,lim,cw,op,.6+.4*j/n));
      const pp=[...lv,l39Ovoid(og.pos,og.H,UPC*.5,Math.max(1.3,og.w*1.1),L39_EGG,'#8a4a36',{scales:3})];
      if(cw.m==='fl'){const um=l97EnUmbel(og,cw,op,lim);if(um)pp.push(...um)}return pp},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?tw:wood,null)})}

/* ---------- glycine (Wisteria floribunda, W. sinensis, Fabaceae): a woody twining liane — the stems grey-brown, smooth, winding round each other and their support; the young shoots
   twining at their tips; leaves alternate, odd-pinnate (9–19 leaflets), silky and bronze when they open with the flowers; from the spurs of the old wood long hanging racemes
   (W. sinensis 15–30 cm, opening all at once; W. floribunda 30–80 cm, opening from the base) of fragrant pea flowers (2 cm): the round standard reflexed back toward the rachis,
   pale with a yellow-green blotch, the wings and keel deeper, pointing out and down; a cup-shaped calyx; buds grey-green and velvety, pointed, at the tip.
   Colours: mauve (the type), violet-blue ('Multijuga'), white ('Alba', 'Shiro-noda'), pink ('Rosea', 'Honbeni'), deep violet double ('Black Dragon'); cut vines 40–100 cm ---------- */
const CW_L97GL=[{id:'mauve',n:'Mauve (Wisteria sinensis)',c:'#a48ccc',s:'#cbbce6',k:'#9a80c6'},{id:'bleu',n:'Violet bleuté (floribunda Multijuga)',c:'#8a7ec8',s:'#b8b0e0',k:'#7c6cc0'},
  {id:'blanc',n:'Blanc (Alba, Shiro-noda)',c:'#f4f2ec',s:'#fbfaf6',k:'#ecebe2',w:1},{id:'rose',n:'Rose (Rosea, Honbeni)',c:'#e4aac4',s:'#f2d0de',k:'#da98b8'},
  {id:'violet',n:'Violet profond (Black Dragon)',c:'#62428a',s:'#86669e',k:'#563a7e'}];
/* one pea flower at the end of its pedicel E: its direction fa (out and down), the standard turned up behind, the wings and keel forward; a bud, a pointed velvet spindle */
function l97GlFlower(par,E0,fa,sz,ag,cw){if(ag<.3){const e=V3.add(E0,V3.sc(fa,sz*(.7+.35*ag/.3))),sp=l45Spin(E0,e,t=>sz*.32*Math.pow(Math.sin(Math.PI*Math.min(1,t*.9+.1)),.8),7),cb=mix(cw.k,'#a8b098',.45*(1-ag/.3));
    E('path',{d:smooth(sp.P),fill:toneAt(pal7(cb),.6),stroke:shd(cb,-.5),'stroke-width':.3,'stroke-opacity':.5},par);return}
  const op=l97C((ag-.3)/.5),kd=V3.nz(V3.add(fa,[0,-.25,0])),up=V3.nz(V3.add(V3.sc(fa,-.4),[0,1,0])),c=V3.add(E0,V3.sc(fa,sz*.25)),std=V3.add(c,V3.sc(up,sz*.3*(.5+.5*op))),kc=V3.add(c,V3.sc(kd,sz*.48)),
    sAx=V3.nz(V3.add(V3.sc(fa,.75),V3.sc(up,.25))),sP=l45Sph(std,sAx,sz*.1,sz*.62*(.6+.4*op),DET>=1.5?14:10,t=>1-.1*Math.max(0,Math.cos(t*2))),kP=l45Sph(kc,kd,sz*.48,sz*.24,DET>=1.5?12:9),
    Ps=pal7(cw.s),Pk=pal7(cw.k),Is=lightI(V3.nz(V3.add(sAx,[0,.2,.3]))),fr=sAx[2]>-.25;
  const stdD=()=>{E('path',{d:smooth(sP),fill:toneAt(Ps,Is),stroke:shd(cw.k,-.4),'stroke-width':.3,'stroke-opacity':.45},par);
    if(fr&&!LOD&&(DET>=1.5||sz>9)){const q=l97Q(V3.add(std,V3.sc(V3.nz(V3.add(sAx,[0,-.3,0])),sz*.05)));E('ellipse',{cx:f(q[0]),cy:f(q[1]),rx:f(sz*.13),ry:f(sz*.09),fill:'#d8d468',opacity:.8},par)}};
  if(fr){E('path',{d:smooth(kP),fill:toneAt(Pk,lightI(kd)*.95),stroke:shd(cw.k,-.45),'stroke-width':.3,'stroke-opacity':.45},par);stdD()}
  else{stdD();E('path',{d:smooth(kP),fill:toneAt(Pk,lightI(kd)*.95),stroke:shd(cw.k,-.45),'stroke-width':.3,'stroke-opacity':.45},par)}}
/* a long raceme hanging from a spur: the rachis falls almost straight, flowers all round it on pedicels, open from the base (floribunda) down to the velvet buds at the tip */
function l97GlRac(P0,d0,cw,op,lim,kl){const Lr=UPC*R(18,26)*kl*(.6+.4*op),sz=UPC*R(1.7,2)*Math.min(1,.8+.2*kl),Hh=l97Hang(P0,d0,Lr,.3,10,lim,sz*1.2,[1,.8,.62,.48,.36]);if(!Hh)return null;
  const pts=Hh.pts,parts=[],n=Math.round((DET>=1.5?34:22)*(.6+.4*Hh.k)),rc='#6a7048',fl=[];let pd='';
  l97Rachis(pts,1.9,1.2,rc,parts);
  for(let i=0;i<n;i++){const q=i/(n-1),A=l97At(pts,.06+.92*q),[X,Y]=fgCross(A.T),a=i*2.39996+R(-.25,.25),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),
      ag=l97C(op*1.45-q*1.05+R(-.06,.06)),s=sz*(1-.45*q)*(ag<.3?.85:1),pl=UPC*R(.8,1.3)*(1-.5*q)*(ag<.3?.6:1),pdir=V3.nz(V3.add(V3.sc(rd,.85),[0,-.15,0])),e=V3.add(A.p,V3.sc(pdir,pl)),
      fa=V3.nz(V3.add(V3.sc(rd,.8),[0,-.45,0]));pd+=l97Ped(A.p,e,-pl*.12);fl.push({e,fa,s,ag})}
  parts.push({z:pts.reduce((s,q)=>s+q[2],0)/pts.length-.1,cast:false,fn:par=>l97PedS(par,pd,1.15,'#7a7a52')});
  for(const F of fl)parts.push({z:F.e[2]+F.fa[2]*F.s*.3,cast:false,fn:par=>l97GlFlower(par,F.e,F.fa,F.s,F.ag,cw)});
  return parts}
/* the twining tip of a young shoot: a slender helix round nothing, never finer than 1.2 */
function l97Twine(P,d,len,col,lim){const ax=V3.nz(V3.add(d,[0,.2,0])),[X,Y]=fgCross(ax),pts=[P],n=26,r0=len*.07;
  for(let i=1;i<=n;i++){const s=i/n,th=s*2.2*6.283,r=r0*Math.min(1,s*3)*(1-.4*s);pts.push(V3.add(V3.add(P,V3.sc(ax,len*s)),V3.add(V3.sc(X,r*(Math.cos(th)-1)),V3.sc(Y,r*Math.sin(th)))))}
  if(lim!=null&&l45Low(pts)<-lim+2)return null;const z=pts.reduce((s,q)=>s+q[2],0)/pts.length,d2=smooth(pts.map(l97Q),false);
  return{z,cast:false,fn:par=>E('path',{d:d2,fill:'none',stroke:col,'stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round'},par)}}
/* the vine as a drape in a bouquet (and on the composer's cards): as the jasmine's strand, it rises out of the mouth, crests over the lip and falls, twining; its nodes carry the spurs,
   the young leaves and the racemes hanging straight down from it, all kept above the table (room) */
function l97GlStrand(k,o,cw,op){const B=o.ax?frameOf(o,0):I3,X=typeof DRAPEX!=='undefined'&&DRAPEX,side=X?X.side||1:(o.sway||0)<0?-1:1,Lv0=o.len||(o.cm||80)*UPC,sw=(o.sway??R(10,30)*side)*R(.7,1.3);
  let hc=R(6,12),dxc=side*R(8,18),Lh=Lv0*.88,room=null;
  if(X){hc=Math.max(5,X.y-(X.top-R(5,10)));if(!X.held){room=X.FL-3-X.y;Lh=Math.min(Lh,room)}dxc=side*Math.max(6,Math.min(26,X.mw-Math.abs(X.x-X.mcx)+R(4,10)))}
  Lh=Math.max(40,Lh);const C=[[0,0,0],[dxc*.45,hc*1.5,R(-3,3)],[dxc+(sw-dxc)*.12+side*Lh*.1,-Lh*.3,R(-8,8)],[sw-side*Lh*.02,-Lh,R(-12,12)]],cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const NS=40,ph=R(0,6.28),tw=Lh/R(50,70),pts=[],ws=[];for(let i=0;i<=NS;i++){const s=i/NS,q=cb(s),a=ph+s*tw*6.28,am=2.6*Math.min(1,s*4);pts.push(toV(B,[q[0]+Math.cos(a)*am,q[1],q[2]+Math.sin(a)*am]));ws.push(UPC*(.95-.6*s))}
  const parts=[],wood=l39Wood('#7e7a70'),lim=room==null?null:room,kl=Math.min(1,Lv0/(60*UPC))*.25+.75;
  l39Bark([{pts,ws,ord:0}],parts,8,()=>wood,(P,W)=>DET>=1.5?l39Lenti(P,W,.05,'#c8c4b4',{l0:.15,l1:.3,w:.4,op:.5}):null);
  let nr=0;const nmax=Lh>120?3:2;
  for(let l=Lh*.1,i=0;l<Lh*.93;l+=UPC*R(6,8),i++){const A=l97At(pts,l/((l97At(pts,1).L)||1)),[Xx,Yy]=fgCross(A.T),a=i*2.4+R(-.3,.3),r=V3.nz(V3.add(V3.sc(Xx,Math.cos(a)),V3.sc(Yy,Math.sin(a)))),w=UPC*(.95-.6*l/Lh);
    parts.push(l39Ovoid(V3.add(A.p,V3.sc(r,w*.1)),V3.nz(V3.add(V3.sc(r,.8),V3.sc(A.T,.3))),UPC*.6,Math.max(1.6,w*.55),L39_EGG,'#6a6450',{scales:2,zb:.04}));
    if(op>.3&&i%2===0){const y=l97C((op-.3)/.7),sz=.5+.4*y,c=mix('#7a8a3e','#a8864a',.45*(1-y)),H=V3.nz(V3.add(V3.sc(r,.85),[0,.25,0])),U=V3.nz(V3s([0,1,0],V3.sc(H,H[1])));
      const lf=l45RobLeaf({pos:A.p,H,U},UPC*9*sz*R(.85,1.1),DET>=1.5?4:3,UPC*3.2*sz*R(.9,1.08),mix(c,shd(c,R(-.06,.06)),.5),lim==null?null:-lim+2);if(lf)parts.push(...lf)}
    if(nr<nmax&&i%2===1&&rnd()<.85){const rc=l97GlRac(V3.add(A.p,V3.sc(r,w*.4)),V3.nz(V3.add(V3.sc(r,.5),[0,-.4,0])),cw,op,lim,kl);if(rc){nr++;parts.push(...rc)}}}
  const e=pts[NS],te=l97Twine(e,V3.nz(V3s(pts[NS],pts[NS-2])),UPC*R(4,6),'#8a8a58',lim);if(te)parts.push(te);
  drawParts(k,parts)}
function l97GlycinePlant(g,t,o){if((typeof DRAPEX!=='undefined'&&DRAPEX)||o.len!=null){const k=G(g),cw=cwPick(CW_L97GL,o);l97GlStrand(k,o,cw,l97C(o.op??R(.8,1),.05,1));open(k,t,1100,0,0);return k}
const cw=cwPick(CW_L97GL,o),op=l97C(o.op??1,.05,1),wood=l39Wood('#7e7a70'),tw=l39Wood('#8a8460'),kl=o.spine?.85:1;let nr=0;
  return l39Sprig(g,t,o,{id:'gl-'+cw.id,len:80,leafy:.85,inter:[9,7],nl:1,div:180,ph0:R(60,120),ang:[58,46],w0:UPC*1.25,w1:UPC*.35,wp:.7,cols:wood,e:-.002,wig:.03,zig:10,twist:26,tip:1.2,clr:3,
    br:{zone:[.25,.8],p:.3,max:1,gap:2,n:[2,3],li:7,ang:40,eb:-.004,ls:.8,wk:.55},
    leaf:(og,lim)=>{if(op<.3||((og.p.i??1)%2&&!og.p.b))return null;const y=l97C((op-.3)/.7),sz=.55+.45*y,c=mix('#7a8a3e','#a8864a',.45*(1-y)),np=DET>=1.5?4:3;
      return l45RobLeaf(og,UPC*9*sz*R(.85,1.1),np,UPC*3.2*sz*R(.9,1.08),mix(c,shd(c,R(-.06,.06)),.5),lim==null?null:-lim+2)},
    node:(og,lim)=>{const q=og.p.q??0,ph=(og.p.ph||0)*D,sd=V3.nz(V3.add(V3.sc(og.U,Math.cos(ph)),V3.sc(og.L,-Math.sin(ph)))),P=V3.add(og.pos,V3.sc(sd,og.w*.3)),H=og.H,pp=[];
      /* the spur: a short knob of the old wood the raceme hangs from */
      pp.push(l39Ovoid(V3.add(og.pos,V3.sc(sd,og.w*.1)),V3.nz(V3.add(V3.sc(sd,.8),V3.sc(H,.4))),UPC*.6,Math.max(1.6,og.w*.55),L39_EGG,'#6a6450',{scales:2,zb:.04}));
      if(q<.08||rnd()>(nr<2?.95:.7)||nr>=(o.spine?3:5))return pp;const rc=l97GlRac(V3.add(P,V3.sc(sd,UPC*.3)),V3.nz(V3.add(V3.sc(sd,.6),[0,-.2,0])),cw,op,lim,kl);if(rc){nr++;pp.push(...rc)}return pp},
    apex:(og,lim)=>{const tw2=l97Twine(og.pos,og.H,UPC*R(6,9),'#8a8a58',lim);return tw2?[tw2]:null},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?tw:wood,(P,W)=>DET>=1.5?l39Lenti(P,W,.05,'#c8c4b4',{l0:.15,l1:.3,w:.4,op:.5}):null)})}

/* ---------- mitsumata (Edgeworthia chrysantha, Thymelaeaceae, « paperbush »): its name says it, « three forks » — every shoot ends in a fork of three nearly equal branches, again and again,
   so the bare branch spreads like a candelabrum; the bark smooth, olive to cinnamon brown with pale lenticels, so tough and flexible it makes Japanese paper; in late winter,
   before the leaves, at every tip a nodding ball (3–5 cm) of 30–50 tubular flowers, silky white outside, opening into four yellow lobes ('Akebono', 'Red Dragon': orange-red);
   the buds silvery, hairy, drooping all winter. Florists sell it bare, peeled and bleached white, or dyed (pink, red, purple, blue, orange), its round buds kept, 60–150 cm ---------- */
const CW_L97MI=[{id:'blanchi',n:'Blanchi (écorcé)',c:'#f2ece0',m:'dye'},{id:'naturel',n:'Naturel (écorce brune, boutons argentés)',c:'#7a5a3e',m:'nat'},
  {id:'fleuri',n:'Fleuri jaune (Edgeworthia chrysantha)',c:'#f0c430',m:'fl',y:'#f4c628',t:'#faf6e8'},{id:'akebono',n:'Fleuri orange (Akebono, Red Dragon)',c:'#e8702a',m:'fl',y:'#ec7a2a',t:'#fbe8d4'},
  {id:'rose',n:'Teint rose',c:'#e46a9e',m:'dye'},{id:'rouge',n:'Teint rouge',c:'#c4262e',m:'dye'},{id:'violet',n:'Teint violet',c:'#6e3a8e',m:'dye'},{id:'bleu',n:'Teint bleu',c:'#2e5aa8',m:'dye'},
  {id:'orange',n:'Teint orange',c:'#e8822e',m:'dye'}];
/* the ball of flowers at a tip, hanging on its short peduncle: a silky body, the flowers radiating from its centre (their white tubes at the rim, their yellow four-lobed faces turned to us);
   a bud: a silvery ball of hairy bracts; a dyed branch keeps its buds, dyed */
function l97MiBall(og,cw,op,lim){const P0=og.pos,H=V3.nz(og.H),fl=cw.m==='fl',rB=UPC*(fl?R(1.5,1.9)*(.55+.45*op):R(.55,.75)),d0=V3.nz(V3.add(V3.sc(H,.5),[0,-.35,0])),
    Hh=l97Hang(P0,d0,UPC*(fl?1.3:.7),.35,4,lim,rB*2.1,[1,.8]);if(!Hh)return null;const e=Hh.pts[Hh.pts.length-1],T=V3.nz(V3s(e,Hh.pts[Hh.pts.length-2])),C=V3.add(e,V3.sc(V3.nz(V3.add(T,[0,-.6,0])),rB*.85)),
    pk=cw.m==='nat'?'#6a4a34':cw.m==='dye'?shd(cw.c,-.15):'#7a5a3e',pd=smooth(Hh.pts.map(l97Q),false),parts=[];
  parts.push({z:C[2]-.02,cast:false,fn:par=>{l97PedS(par,pd,1.4,pk);
    if(!fl||op<.2){const bc=cw.m==='dye'?cw.c:cw.m==='nat'?'#d8d4c8':'#e8e4d4';E('circle',{cx:f(C[0]),cy:f(-C[1]),r:f(rB),fill:budFill(bc),stroke:shd(bc,-.45),'stroke-width':.35,'stroke-opacity':.6},par);
      if(DET>=1.5&&!LOD){let d='';for(let j=0;j<7;j++){const a=j/7*6.283+.3,x=C[0]+Math.cos(a)*rB*.55,y=-C[1]+Math.sin(a)*rB*.55;d+=`M${f(x)},${f(y)}l${f(Math.cos(a)*rB*.32)},${f(Math.sin(a)*rB*.32)}`}E('path',{d,stroke:shd(bc,.3),'stroke-width':.35,'stroke-opacity':.6,fill:'none'},par)}
      return}
    /* the open head: flowers on a sphere round C, the far half hidden; each a tube out from the body ending in a four-lobed star */
    const Pt=pal7(cw.t),Py=pal7(cw.y),n=DET>=1.5?44:28,o2=l97C((op-.2)/.6);E('circle',{cx:f(C[0]),cy:f(-C[1]),r:f(rB*.82),fill:budFill(cw.t),stroke:shd(cw.t,-.4),'stroke-width':.3,'stroke-opacity':.5},par);if(o2>.3)E('circle',{cx:f(C[0]-rB*.06),cy:f(-C[1]-rB*.06),r:f(rB*.62*o2),fill:toneAt(Py,.5),opacity:.85},par);
    let tb='',st='',st2='';for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996,N=[r*Math.cos(a),y,r*Math.sin(a)];if(N[2]<-.15)continue;
      const opn=o2>R(0,1)*(.5+.5*(1-(N[1]+1)/2)),base=V3.add(C,V3.sc(N,rB*.7)),tip=V3.add(C,V3.sc(N,rB*(opn?1.05:.95))),bq=l97Q(base),tq=l97Q(tip),tw2=rB*.12;
      const dx=tq[0]-bq[0],dy=tq[1]-bq[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*tw2,ny=dx/l*tw2;tb+=`M${f(bq[0]+nx)},${f(bq[1]+ny)}L${f(tq[0]+nx*1.2)},${f(tq[1]+ny*1.2)}L${f(tq[0]-nx*1.2)},${f(tq[1]-ny*1.2)}L${f(bq[0]-nx)},${f(bq[1]-ny)}Z`;
      if(!opn)continue;const[X,Y]=fgCross(N),ls=rB*.3,face=N[2];let d='';for(let j=0;j<4;j++){const th=j*1.5708+.4,u=V3.add(V3.sc(X,Math.cos(th)),V3.sc(Y,Math.sin(th))),p1=l97Q(V3.add(tip,V3.sc(u,ls))),
          s1=l97Q(V3.add(tip,V3.add(V3.sc(u,ls*.5),V3.sc(V3.cr(N,u),ls*.6)))),s2=l97Q(V3.add(tip,V3.add(V3.sc(u,ls*.5),V3.sc(V3.cr(N,u),-ls*.6))));d+=`M${f(tq[0])},${f(tq[1])}Q${f(s1[0])},${f(s1[1])} ${f(p1[0])},${f(p1[1])}Q${f(s2[0])},${f(s2[1])} ${f(tq[0])},${f(tq[1])}Z`}
      if(face>.35)st+=d;else st2+=d}
    E('path',{d:tb,fill:toneAt(Pt,.72),stroke:shd(cw.t,-.35),'stroke-width':.25,'stroke-opacity':.5},par);if(st2)E('path',{d:st2,fill:toneAt(Py,.45),stroke:Py.d2,'stroke-width':.25,'stroke-opacity':.5},par);
    if(st)E('path',{d:st,fill:toneAt(Py,.66),stroke:Py.d2,'stroke-width':.25,'stroke-opacity':.5},par)}});
  return parts}
function l97MitsumataPlant(g,t,o){const cw=cwPick(CW_L97MI,o),op=l97C(o.op??1,.05,1),dye=cw.m==='dye',bc=dye?cw.c:'#7a5a3e',wood=dye?f15DyeStem(cw.c).map((c,i)=>i?c:shd(cw.c,-.35)):l39Wood(bc),tw=dye?wood:l39Wood('#8a6a48');
  if(cw.id==='blanchi')wood.splice(0,4,...l39Wood('#cfc2a8'));
  return l97Shoot(g,t,o,{id:'mi-'+cw.id,len:100,leafy:.7,w0:UPC*.85,w1:1.4,wp:.75,cols:wood,e:.002,wig:.01,clr:4,
    grow:({Lt,a0,chord,sp})=>{const nT=Math.max(2,Math.round((Lt-a0)/(UPC*R(13,17)))),T=[];for(let i=0;i<nT;i++)T.push(a0+(Lt-a0)*(i+.5)/(nT+.5)*R(.96,1.03));
      const rules={A:p=>{const i=p.i;if(i>=nT)return[...chord(T[nT-1],Lt),['Ap',{}]];const q=i/Math.max(1,nT-1),ph=R(0,360),wb=Math.max(1.4,UPC*.5*(1-.55*q)),out=[...chord(i?T[i-1]:0,T[i]),['Nd',{}]];
          /* the fork: two branches spread from the main axis, which goes on as the third */
          for(let j=0;j<2;j++)out.push(['[',{w:wb}],['/',{a:ph+j*120+R(-12,12)}],['&',{a:R(30,42)}],['B',{d:q<.5?2:1,len:UPC*R(10,14)*(1-.3*q),w:wb}],[']',{}]);
          if(!sp)out.push(['/',{a:ph+240}],['&',{a:R(6,12)}]);out.push(['A',{i:i+1}]);return out},
        B:p=>{const out=[['F',{l:p.len,w1:Math.max(1.35,p.w*.8),e:.02}]];if(p.d<=0){out.push(['Ap',{}]);return out}
          const ph=R(0,360);out.push(['Nd',{}]);for(let j=0;j<3;j++)out.push(['[',{w:Math.max(1.35,p.w*.7)}],['/',{a:ph+j*120+R(-14,14)}],['&',{a:R(26,38)}],['B',{d:p.d-1,len:p.len*R(.6,.78),w:Math.max(1.35,p.w*.7)}],[']',{}]);return out}};
      return{axiom:[['A',{i:0}]],rules,steps:nT+6}},
    organ:(og,lim)=>{if(og.t==='Nd'){/* the swollen fork */return[l39Ovoid(V3.add(og.pos,V3.sc(og.H,-og.w*.5)),og.H,og.w*1.1,og.w*1.25,L39_EGG,wood[1],{zb:.02,eo:.3})]}
      if(og.t==='Ap')return l97MiBall(og,cw,op,lim)||[l39Ovoid(og.pos,og.H,UPC*.45,Math.max(1.4,og.w*1.2),L39_EGG,dye?cw.c:'#d0ccc0',{zb:.02})];return null},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?tw:wood,(P,W)=>DET>=1.5&&!dye?l39Lenti(P,W,.08,'#d8c8a8',{l0:.15,l1:.3,w:.4,op:.6}):null,cw.id==='blanchi'?'#7e705a':null)})}

/* ---------- piéris du Japon (Pieris japonica and hybrids such as 'Forest Flame', Ericaceae, « andromède du Japon »): an evergreen shrub; stiff grey-brown shoots, the leaves crowded in
   false whorls at the end of each year's growth, oblanceolate, 4–9 cm, leathery, glossy dark green, finely toothed toward the tip; the new shoots after flowering bright red ('Forest Flame',
   'Mountain Fire'), then pink, cream, green; at the tips in late winter a drooping panicle of 4–8 racemes (6–15 cm), the white or pink urn-shaped bells (6–8 mm) hanging in rows
   under them, like lily of the valley; the buds formed in autumn, tight beads on red racemes all winter. Colours: white ('Debutante', 'Purity'), pink ('Passion', 'Katsura'),
   deep pink ('Valley Valentine'), white with red shoots ('Forest Flame'); cut branches 30–60 cm ---------- */
const CW_L97PI=[{id:'blanc',n:'Blanc (Debutante)',c:'#f8f6ee',r:'#c08a6a'},{id:'purity',n:'Blanc crème (Purity)',c:'#ece4cc',r:'#a8906a'},{id:'forest',n:'Blanc, pousses rouges (Forest Flame)',c:'#faf8f0',r:'#b07058',y:'#c8281e'},
  {id:'rose',n:'Rose (Passion)',c:'#ec9cb8',r:'#a85a6a'},{id:'katsura',n:'Rose, pousses pourpres (Katsura)',c:'#d87098',r:'#9a4458',y:'#8a2438'},{id:'valentine',n:'Rose profond (Valley Valentine)',c:'#b8385e',r:'#7a2a3a'}];
const L97_PI_WP=prof([[0,.14],[.15,.44],[.45,.85],[.72,1],[.9,.7],[1,.06]]),L97_PI_URN=t=>t<.15?.5+t*3.2:t<.62?.98+.02*Math.sin(Math.PI*(t-.15)/.47):1-.5*Math.pow((t-.62)/.38,1.1);
function l97PiLeaf(og,lim,c,sz,o={}){return l39Leaf(og,lim,{sz,wr:.36,wp:L97_PI_WP,rho:R(70,95),c,cb:mix(c,'#c8d0a8',.35),nv:DET>=1.5?9:5,mt:.85,pet:DET>=1.5?UPC*.4:0,pw:1.15,pc:o.pc||'#8a5a3a',
    sh:{arch:.06,fold:.2,cup:.04,droop:o.droop??.1,curl:-.03,tw:R(-.25,.25)},bo:{mid:DET>=1.5?mix(c,'#e8ecc0',.4):null,mo:.5,gloss:.5}})}
/* a raceme of the panicle: out from the tip, arching over and down under its weight; the bells in a row underneath, the youngest at its tip; in bud, tight beads */
function l97PiRac(P0,d0,cw,op,lim,Lr){const sz=UPC*R(.95,1.1),Hh=l97Hang(P0,d0,Lr,.22,9,lim,sz*1.6);if(!Hh)return null;const pts=Hh.pts,parts=[],n=Math.round((DET>=1.5?16:9)*(.6+.4*Hh.k)),fl=[];let pd='';
  l97Rachis(pts,1.5,1.2,cw.r,parts);
  for(let i=0;i<n;i++){const q=i/(n-1),A=l97At(pts,.1+.88*q),[X]=fgCross(A.T),sd=(i%2?1:-1)*R(.15,.45),pdir=V3.nz(V3.add(V3.sc(X,sd),[0,-1,0])),pl=UPC*R(.22,.32),
      e=V3.add(A.p,V3.sc(pdir,pl)),ag=l97C(op*1.3-q*.55+R(-.06,.06)),s=sz*(1-.3*q)*(.55+.45*Math.min(1,ag*1.6));pd+=l97Ped(A.p,e,0);fl.push({e,Z:V3.nz(V3.add(V3.sc(pdir,.4),[0,-1,0])),s,ag})}
  parts.push({z:pts.reduce((s,q)=>s+q[2],0)/pts.length-.08,cast:false,fn:par=>l97PedS(par,pd,1.15,cw.r)});
  for(const F of fl)parts.push({z:F.e[2],cast:false,fn:par=>{if(F.ag<.3)l97Bell(par,F.e,F.Z,F.s*.62,F.s*.3,L97_GR_BUD,mix(cw.c,cw.r,.55),{cal:'#7a8a4a'});
    else l97Bell(par,F.e,F.Z,F.s,F.s*.34,L97_PI_URN,cw.c,{cal:'#8a9a50',throat:mix(cw.c,'#806050',.5)})}});
  return parts}
function l97PierisPlant(g,t,o){const cw=cwPick(CW_L97PI,o),op=l97C(o.op??1,.05,1),wood=l39Wood('#6a5444'),tw=l39Wood('#8a5a40'),lc='#2e5a2a';
  const rosette=(og,lim,n,big)=>l97Rosette(og,n,[84,50],UPC*R(2.2,3),(lo,j)=>{const q=lo.p.q;return l97PiLeaf(lo,lim,mix(lc,shd(lc,R(-.1,.12)),.6),UPC*R(4,5.6)*(big?1:.8)*(1-.3*q))});
  return l97Shoot(g,t,o,{id:'pi-'+cw.id,len:45,leafy:.8,w0:UPC*.65,w1:1.3,wp:.8,cols:wood,e:.006,wig:.012,clr:4,cmMin:28,
    grow:({Lt,a0,chord})=>{const nT=Math.max(1,Math.min(5,Math.round((Lt-a0)/(UPC*R(8,10))))),T=[];for(let i=0;i<nT;i++)T.push(a0+(Lt-a0)*(i+.7)/(nT+.7));
      const rules={A:p=>{const i=p.i;if(i>=nT)return[...chord(T[nT-1],Lt),['Ap',{q:1}]];const q=i/Math.max(1,nT-1),out=[...chord(i?T[i-1]:0,T[i]),['Ro',{q}]],nb=q<.8&&rnd()<.75?Math.round(R(1,2)):0,ph=R(0,360);
          for(let j=0;j<nb;j++)out.push(['[',{w:Math.max(1.3,UPC*.3)}],['/',{a:ph+j*180+R(-25,25)}],['&',{a:R(38,52)}],['B',{len:UPC*R(7,10)*(1-.3*q)}],[']',{}]);out.push(['A',{i:i+1}]);return out},
        B:p=>[['F',{l:p.len,w1:1.3,e:.04}],['Ap',{q:.7}]]};
      return{axiom:[['A',{i:0}]],rules,steps:nT+4}},
    organ:(og,lim)=>{if(og.t==='Ro')return rosette(og,lim,Math.round(R(6,9)),1);if(og.t!=='Ap')return null;
      const pp=rosette(og,lim,Math.round(R(8,11)),og.p.q>.9),H=V3.nz(og.H),[X,Y]=fgCross(H),nr=Math.round(R(4,6)*(og.p.q>.9?1:.7)),ph0=R(0,6.283);
      /* the panicle: racemes out from the tip all round, arching over */
      for(let j=0;j<nr;j++){const a=ph0+j*6.283/nr+R(-.3,.3),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),d0=V3.nz(V3.add(V3.sc(H,R(.7,1)),V3.sc(rd,R(.5,.8)))),
          rc=l97PiRac(V3.add(og.pos,V3.sc(H,UPC*.4)),d0,cw,op,lim,UPC*R(6,10)*(j%2?.8:1)*(og.p.q>.9?1:.8));if(rc)pp.push(...rc)}
      /* the red young shoot: small soft leaves held up round the tip (after the flowers, with them on 'Forest Flame') */
      if(cw.y&&op>.3)pp.push(...l97Rosette({pos:V3.add(og.pos,V3.sc(H,UPC*.6)),H,w:1.3},Math.round(R(4,6)),[40,22],UPC*.3,(lo,j)=>l97PiLeaf(lo,lim,mix(cw.y,shd(cw.y,R(-.12,.12)),.5),UPC*R(2.6,3.6),{pc:shd(cw.y,-.3),droop:.18})));
      pp.push(l39Ovoid(og.pos,H,UPC*.5,Math.max(1.3,og.w*1.1),L39_EGG,cw.r,{zb:-.05}));return pp},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?tw:wood,null)})}

/* ---------- registries: drawers, colourways, trade lengths (cm), composer infos (lines along the spine; enkianthus and pieris as foliage stems) ---------- */
Object.assign(GH,{'groseillier-a-fleurs':l97GroseillierPlant,'enkianthus-dodan':l97EnkianthusPlant,'glycine':l97GlycinePlant,'mitsumata':l97MitsumataPlant,'pieris-japonica':l97PierisPlant});
CWS['groseillier-a-fleurs']=CW_L97GR;SZG['groseillier-a-fleurs']=[50,60,60,70,80];GHI['groseillier-a-fleurs']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.7,fx:5*UPC,rch:8*UPC};
CWS['enkianthus-dodan']=CW_L97EN;SZG['enkianthus-dodan']=[60,80,100,120,150];GHI['enkianthus-dodan']={form:'feuillage',size:1.2,k:'plant',rk:.6,self:80*UPC,fx:24};
CWS['glycine']=CW_L97GL;SZG['glycine']=[40,60,60,80,100];GHI['glycine']={form:'retombante',size:2,k:'drape',self:100*UPC};
CWS['mitsumata']=CW_L97MI;SZG['mitsumata']=[60,80,100,120,150];GHI['mitsumata']={form:'ligne',size:1,k:'plant',self:90*UPC,tip:.85,fx:5*UPC,rch:10*UPC};
CWS['pieris-japonica']=CW_L97PI;SZG['pieris-japonica']=[30,40,50,60];GHI['pieris-japonica']={form:'feuillage',size:1.1,k:'plant',rk:.6,self:40*UPC,fx:22};
