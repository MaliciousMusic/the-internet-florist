/* ================= Pivoine herbacée double (Paeonia lactiflora, double) en SVG natif (y-paeonia.js), 2026-10-19 =================
   Drawn by hand after the photos of refcache/pivoine-herbacee-double (106, 93, 98, 97, 109 open; 121, 138 half open; 107, 82, 89, 80 buds;
   201 the decline). A full double peony is two things: the guard petals, ten to twelve broad obovate petals in about two rows, cupped, their
   rounded ends irregularly notched, opening into a saucer; and the heart, a ball of fifty and more narrower petaloids (the stamens turned to
   petals), crumpled and frilled at the tip, rising from the receptacle and curling in over the top, the youngest in the middle a little lower
   (the crown). Under them five green sepals, fleshy, red at the rim, two or three ending in a leafy point. The carpels (three to five green
   felted follicles with a red crest) hide in the middle until the petals fall.
   The structure (BONNES-PRATIQUES §13-14): every piece lies on its own shell of a family of nested surfaces of revolution around the axis. A
   shell is a curve of the (r, z) half-plane, written as its distance rho(psi) from the receptacle's centre O along the ray at psi from the axis;
   the shells are tabulated over psi and kept strictly nested (each one outside the one before along every ray). Pieces are assigned shells in
   the order of their spiral (the golden angle), the outer ones first: sepals, guards, then the heart from the outside in. Two pieces that meet
   at the same place are on two shells, the outer one outside; their crumpling moves each point along its ray by less than half the gap to the
   neighbours it overlaps, so no piece can pass through another (x3d 0 by construction, measured by y3-qa3d.js). The shells change with the
   stage: a ball in the bud, a cup half open, a saucer round a dome open, a flatter, looser head in the decline; the faded drops its petals. */

/* the colourways (the catalogue's CW_PDBL, s12a.js): c the guard petals, c2 the heart. The hand ramps from the photos (base, body, tip) until
   the measured grids (fleur/apparence.py) take their place; a colourway without its own entry is derived from its catalogue colours */
const PEO_CW={
  /* rose (photo 106, a full double in the sun, 2026-10-19): the guards' grid measured on three guards (fleur/apparence.py grille), deep pink
     #c52d78 at the claw to #d04a90 on the body; the heart deeper and more contrasted than the guards (percentiles of the lit heart: body
     #d3327e, light #fc98be, the frilled ends #fdb1cd, the hollows between petaloids #7c051e; the back as deep: the ball shows both faces).
     The guards' grid is smoothed (L* held within -5..+7 of its median, three rows averaged): the photo's cast shadows had blotched it */
  rose:{g:{st:[[0,'#c22c76'],[.2,'#c8408a'],[.55,'#d04a90'],[.85,'#d65698'],[1,'#e06aa6']],bst:[[0,'#d27aa8'],[.3,'#e27fb2'],[1,'#ee98c4']],
      shade:'#7c0a3c',lite:'#ffb4d8',bshade:'#9a3a68',blite:'#ffd0e6',vein:'#a8206a',bvein:'#d070a0',vo:.16,
      grid:{nu:6,nv:24,c:[['#be3677','#c22f79','#bc3478','#bd3478','#c23d7d','#c74f8c'],['#bb3875','#be3379','#bd3378','#be347a','#bf3b7d','#c94b8b'],['#b83a76','#bb357a','#bc367b','#bf3a7b','#c14282','#ca4c8d'],['#ba3778','#ba377b','#be387f','#c34680','#c74a88','#d15291'],['#bb347c','#bb357d','#bc3b82','#c04782','#ca4e8b','#d55b95'],['#bb357e','#bb357e','#bb3a84','#c4498a','#cf538d','#ca538f'],['#bc3680','#c13a82','#bf3e86','#c5478b','#d0578c','#be4888'],['#be3884','#c53f85','#c94b8b','#cd4c8c','#d66090','#b33e7f'],['#bf3c85','#c44385','#d55791','#ce508c','#d85e93','#b33e7f'],['#bf4284','#be4380','#d4578e','#cd508b','#db5c97','#c14789'],['#bd4781','#bc417e','#c94987','#cb518b','#de599a','#cd5196'],['#b9477e','#c24182','#bc3f80','#c34785','#db5899','#da5ba2'],['#bd4883','#cf488c','#b53c7f','#bb4184','#ce4d91','#d05398'],['#c84d8b','#d45192','#b23f81','#b33c84','#bf4489','#c84c90'],['#d85497','#cc4e8f','#b04085','#b23e85','#bf468c','#c84c8e'],['#e1559b','#be4587','#af4087','#bc468c','#cb5196','#cf5798'],['#e3539b','#be4386','#b64188','#ca5193','#d85ba0','#d75ea0'],['#e6519b','#c9468c','#c14389','#d8599b','#da5b9f','#d55fa0'],['#e64f9c','#d34a91','#c9438a','#dd5a9c','#dc5a9e','#da5b9f'],['#e44d9a','#d84c94','#c94189','#d75197','#dd599d','#db5a9e'],['#df4c98','#db5097','#c53d87','#ce488f','#dd579e','#d35298'],['#da4a94','#df519a','#cc448d','#ca428c','#dd589f','#c74c92'],['#d64a93','#da4d97','#d14992','#ce478f','#d8569e','#b6448c'],['#d54992','#d74b95','#d85097','#d44c94','#d6569d','#b1438d']]},fine:{amb:.4,dif:.74,sat:.25,ao:.3,chroma:1.0,tone:1.08,q:3}},
    h:{st:[[0,'#e690b6'],[.18,'#da4a8a'],[.5,'#d3327e'],[.8,'#e65c98'],[.93,'#f890ba'],[1,'#fdb1cd']],bst:[[0,'#e290b4'],[.25,'#d84688'],[.6,'#d23a82'],[.88,'#ea6ea2'],[1,'#f8a8c8']],
      shade:'#7c051e',lite:'#fc98be',bshade:'#94103a',blite:'#ffd2e2',vein:'#a0185a',bvein:'#d0709a',vo:.18,fine:{amb:.38,dif:.74,sat:.4,ao:.5,chroma:1.05,tone:1.06,q:3}}}};var PEO_LAST=null;  /* (test only, &qa3d=2: the last head's pieces) */
const PEO_GRID={};
/* the receptacle and the shells: key curves (r, z in R0), outside first, for four stages of opening (op): the closed bud, the marshmallow, the
   cup, the open saucer. sep: the sepals' shell; gO, gI: the outer and inner guards; hO, hI: the outer and inner heart. The key curves start at
   their insertion on the receptacle and run past the pieces' tips; between two key curves a shell is their blend */
const PEO_KEYS=[
  {op:.06,sep:[[.13,-.11],[.24,-.06],[.31,.05],[.33,.18],[.29,.32],[.18,.43],[0,.47]],gO:[[.12,-.09],[.22,-.04],[.29,.06],[.31,.18],[.27,.31],[.17,.41],[0,.45]],
    gI:[[.11,-.08],[.2,-.03],[.27,.06],[.29,.18],[.25,.3],[.16,.39],[0,.43]],hO:[[.1,-.06],[.18,-.01],[.24,.07],[.26,.18],[.23,.29],[.14,.37],[0,.4]],
    hI:[[.04,0],[.07,.06],[.09,.13],[.09,.2],[.07,.26],[0,.3]]},
  {op:.35,sep:[[.14,-.13],[.3,-.09],[.43,.02],[.48,.18],[.45,.36],[.3,.55],[0,.62]],gO:[[.13,-.1],[.27,-.05],[.39,.06],[.44,.2],[.41,.37],[.27,.54],[0,.6]],
    gI:[[.12,-.09],[.25,-.04],[.36,.06],[.41,.2],[.38,.36],[.25,.52],[0,.58]],hO:[[.11,-.07],[.22,-.02],[.32,.07],[.37,.2],[.34,.35],[.22,.49],[0,.55]],
    hI:[[.04,0],[.08,.08],[.11,.18],[.12,.28],[.09,.38],[0,.43]]},
  {op:.65,sep:[[.15,-.15],[.34,-.13],[.52,-.04],[.66,.1],[.72,.3],[.7,.55],[.5,.85],[0,.98]],gO:[[.15,-.12],[.32,-.07],[.5,.04],[.63,.18],[.7,.38],[.68,.62],[.48,.88],[0,.96]],
    gI:[[.14,-.1],[.29,-.05],[.45,.05],[.57,.19],[.62,.38],[.6,.6],[.44,.84],[0,.92]],hO:[[.12,-.08],[.25,-.03],[.39,.07],[.5,.21],[.54,.38],[.52,.58],[.38,.78],[0,.86]],
    hI:[[.04,0],[.08,.1],[.12,.24],[.14,.4],[.12,.56],[0,.66]]},
  {op:1,sep:[[.16,-.17],[.36,-.21],[.58,-.2],[.8,-.12],[1.0,.02],[1.12,.24],[1.12,.6],[.9,1],[0,1.3]],gO:[[.16,-.13],[.34,-.11],[.56,-.05],[.8,.07],[.99,.26],[1.07,.5],[1.0,.86],[.6,1.2],[0,1.28]],
    gI:[[.15,-.11],[.31,-.07],[.5,.0],[.7,.13],[.86,.32],[.92,.56],[.86,.86],[.5,1.16],[0,1.24]],hO:[[.13,-.09],[.3,-.03],[.49,.1],[.64,.3],[.71,.55],[.68,.8],[.5,1.02],[.25,1.14],[0,1.18]],
    hI:[[.04,0],[.08,.15],[.13,.4],[.16,.65],[.13,.9],[0,1.02]]}];
/* the free settings. Counts: sepals, guards, heart petaloids (by DET). Widths are half widths in R0 at the widest; tips: where each piece ends,
   as an angle from the axis (radians), [bud, marshmallow, cup, open] */
const PEO_DBL={nS:5,nG:[11,12],nH:[32,44],
  H:[.17,.25,.4,.5],tight:[0,0,.26,.36,0],cap:.12,sepW:.27,sepTip:[1.45,1.9,2.42,2.6],sepLeaf:[.3,.25,.2,.15],gW:.4,gTip:[.06,.28,1.15,1.57],hW:[.17,.28],hTipI:[.04,.04,.03,.025],hTipO:[.4,.65,1.05,1.15],
  sOut:[.06,.04],  /* the first sepal's shell past sep, and the sepals' spread */
  ruf:[.012,.03,.08],rufK:[5,9],amp:.45,curl:.06,cupG:.25,cupH:.35,
  dec:[.1,.4],fan:[.5,.35],fall:[.42,.5],keep:.08,flop:.32,loose:.12,
  nu:[9,13],nv:[14,22],gnu:[13,17],gnv:[20,30],pmin:3,
  light:{wrap:.32,amb:.3,dif:.68,sky:.14,ks:.1,gloss:14,dark:[.94,.86,.78,.7,.62,.54],da:.16,lit:[1.05,1.13,1.21],la:.17,darkLo:[.9,.78,.66],daLo:.22,litLo:[1.07,1.17],laLo:.2,soft:.05}};
/* the carpels' envelope (the core no petal comes inside), by stage, in the same terms */
const PEO_CORE=[[.06,[[.02,0],[.05,.02],[.06,.06],[.04,.1],[0,.12]]],[.35,[[.02,0],[.07,.03],[.09,.09],[.07,.15],[0,.18]]],[.65,[[.02,0],[.1,.04],[.13,.13],[.1,.22],[0,.26]]],
  [1,[[.02,0],[.16,.03],[.2,.14],[.2,.28],[.12,.36],[0,.38]]]];
const PEO_NJ=160,PEO_PSI=3.1;  /* the shells' table: rho at NJ+1 angles from the axis (0) to PSI (straight down: the feet on the receptacle) */
/* a key curve made smooth (Catmull-Rom through its points, 12 steps a span: a polyline's corners showed as bands of light), then resampled
   to m points by arc length */
function peoRes(P0,m){const P=[],n=P0.length,g=i=>P0[Math.max(0,Math.min(n-1,i))];
  for(let i=0;i<n-1;i++)for(let k=0;k<12;k++){const t=k/12,a=g(i-1),b=g(i),c=g(i+1),d=g(i+2),t2=t*t,t3=t2*t;
    P.push([0,1].map(j=>.5*(2*b[j]+(-a[j]+c[j])*t+(2*a[j]-5*b[j]+4*c[j]-d[j])*t2+(-a[j]+3*b[j]-3*c[j]+d[j])*t3)))}
  P.push(P0[n-1]);const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1]||1,out=[];
  for(let q=0;q<m;q++){const s=T*q/(m-1);let i=1;while(i<P.length-1&&L[i]<s)i++;const f=Math.max(0,Math.min(1,(s-L[i-1])/((L[i]-L[i-1])||1)));out.push([P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f])}return out}
/* the key curve of a stage op, blended between the two stages around it (smoothly) */
function peoBlend(list,op,get){let a=list[0],b=list[list.length-1];for(let i=0;i<list.length-1;i++)if(op<=list[i+1].op){a=list[i];b=list[i+1];break}
  const t=op<=a.op?0:op>=b.op?1:svSm((op-a.op)/(b.op-a.op)),A=peoRes(get(a),64),Bq=peoRes(get(b),64);return A.map((p,q)=>[p[0]+(Bq[q][0]-p[0])*t,p[1]+(Bq[q][1]-p[1])*t])}
/* a curve (r, z) as its table rho(psi): the ray at psi meets the curve where the cross product changes sign; past the curve's ends the ends' rho */
function peoTab(P0,H,miss){const P=P0.map(p=>[p[0],p[1]-H]),T=new Float64Array(PEO_NJ+1),ps=P.map(p=>Math.atan2(p[0],p[1])),rh=P.map(p=>Math.hypot(p[0],p[1]));
  for(let j=0;j<=PEO_NJ;j++){const a=j/PEO_NJ*PEO_PSI,dx=Math.sin(a),dz=Math.cos(a);let best=-1;
    for(let i=0;i<P.length-1;i++){const p=P[i],q=P[i+1],c0=p[0]*dz-p[1]*dx,c1=q[0]*dz-q[1]*dx;if(c0*c1>0)continue;const f=Math.abs(c0-c1)<1e-12?0:c0/(c0-c1),
      x=p[0]+(q[0]-p[0])*f,z=p[1]+(q[1]-p[1])*f;if(x*dx+z*dz<=0)continue;const r=Math.hypot(x,z);if(r>best)best=r}
    if(best<0){if(miss!=null)best=miss;else{const i=a>ps[0]?0:P.length-1;best=rh[i]}}T[j]=best}return T}
/* the shells of one head at stage op, decline dec, faded fan: the key tables nested outward from the core (each outside the one inside it by
   eps along every ray); rho(psi, s) with s 0 the sepals' curve .. 1 gO .. 2 gI .. 3 hO .. 4 hI, s < 0 outside the sepals; ins(s) the insertion */
function peoShells(P,op,dec,fan){const names=['sep','gO','gI','hO','hI'],eps=.014;
  const C=names.map(n=>peoBlend(PEO_KEYS,op,k=>k[n])),core=peoBlend(PEO_CORE.map(([o,c])=>({op:o,c})),op,k=>k.c);
  /* the decline: the guards and the sepals flop away from the axis, the heart loosens (wider, lower); the faded more */
  const fl=P.flop*(dec+.6*fan),lo=P.loose*(dec+.8*fan);
  C.forEach((c,i)=>{const n=c.length;for(let q=1;q<n;q++){const t=q/(n-1),p=c[q],a=Math.atan2(p[0],p[1]),r=Math.hypot(p[0],p[1]);
    if(i<3&&fl>0){const a2=a+fl*svSm((t-.1)/.6)*(i?1:.7);c[q]=[r*Math.sin(a2),r*Math.cos(a2)]}else if(i>=3&&lo>0)c[q]=[p[0]*(1+lo*t),p[1]*(1-.45*lo*t)]}});
  const H=peoSt(P.H,op)-.08*lo;if(fan>0)core.forEach((p,q)=>{core[q]=[p[0]*(1+.3*fan),p[1]*(1+.3*fan)]});
  /* while the head is shut (bud, marshmallow) the guards lie a petal's thickness apart: the inner key curves are drawn toward the centre */
  {const bw=1-svSm((op-.32)/.5);if(bw>0)C.forEach((c,i)=>{const f=1-(P.tight[i]||0)*bw;if(f!==1)c.forEach((p,q)=>{c[q]=[p[0]*f,H+(p[1]-H)*f]})})}
  const T=C.map(c=>peoTab(c,H)),K=peoTab(core,H,0);
  for(let j=0;j<=PEO_NJ;j++){let lo2=K[j];for(let i=4;i>=0;i--){if(T[i][j]<lo2+eps)T[i][j]=lo2+eps;lo2=T[i][j]}}
  const ins=C.map(c=>Math.atan2(c[0][0],c[0][1]-H));
  const at=(Tb,a)=>{const x=Math.max(0,Math.min(PEO_NJ,a/PEO_PSI*PEO_NJ)),j=Math.min(PEO_NJ-1,Math.floor(x)),f=x-j,y0=Tb[Math.max(0,j-1)],y1=Tb[j],y2=Tb[j+1],y3=Tb[Math.min(PEO_NJ,j+2)];  /* Catmull-Rom: no kink at the table's steps */
    return y1+.5*f*(y2-y0+f*(2*y0-5*y1+4*y2-y3+f*(3*(y1-y2)+y3-y0)))};
  const rho=(a,s)=>{if(s<=0)return at(T[0],a)+(-s)*P.sOut[0];const i=Math.min(3,Math.floor(s)),f=s-i;return at(T[i],a)*(1-f)+at(T[i+1],a)*f};
  const insA=s=>{if(s<=0)return Math.min(PEO_PSI,ins[0]+(-s)*.03);const i=Math.min(3,Math.floor(s)),f=s-i;return ins[i]*(1-f)+ins[i+1]*f};
  return{rho,ins:insA,core:a=>at(K,a),H}}
/* a profile [[v, w]...] read at v (smooth between its points) */
const peoProf=(W,v)=>{for(let j=1;j<W.length;j++)if(v<=W[j][0]){const q=(v-W[j-1][0])/(W[j][0]-W[j-1][0]);return W[j-1][1]+(W[j][1]-W[j-1][1])*svSm(q)}return W[W.length-1][1]};
/* the outlines (photos 106, 93 at 1:1): a guard petal broadly obovate from a short claw, widest at two thirds, its end rounded and cut by one to
   three shallow notches; a petaloid of the heart narrower, spoon-shaped, its end frilled and cut deeper; a sepal round and fleshy, some with a
   leafy point */
const PEO_WP={g:[[0,.2],[.12,.36],[.4,.78],[.66,1],[.82,.95],[.92,.78],[.97,.56],[1,.3]],h:[[0,.18],[.2,.42],[.55,.86],[.78,1],[.9,.9],[.96,.7],[1,.45]],
  s:[[0,.5],[.2,.86],[.5,1],[.75,.9],[.9,.68],[1,.3]],sl:[[0,.5],[.2,.86],[.45,.9],[.65,.55],[.82,.28],[1,.08]]};
/* (the end's roundness is in these profiles: the outline cut Lu below stays shallow, a deep cut skews the sheet's grid and its normals) */
/* the pieces of one head: their spiral place, shell, extent and individual traits, from the seed (the same head at every stage) */
function peoPieces(P,g,op,nG,nH){const r=svRng(g.sd),L=[],GA=2.39996;
  for(let i=0;i<P.nS;i++)L.push({kind:'s',i,th:g.rot+i*2.5133+r.in(-.1,.1),s:-1+i/(P.nS-1),leafy:i===0||(i===1&&r()<.35),sd:Math.floor(r()*1e9),
    dW:r.in(.88,1.12),dT:r.in(-.08,.08),ph:r.in(0,6.28)});
  for(let k=0;k<nG;k++)L.push({kind:'g',i:k,th:g.rot+.7+k*GA+r.in(-.07,.07),s:1+k/(nG-1),sd:Math.floor(r()*1e9),dW:r.in(.88,1.14),dT:r.in(-.1,.1),
    notch:Array.from({length:1+Math.floor(r()*3)},()=>[r.in(-.7,.7),r.in(.25,.6),r.in(.05,.11)]),ph:r.in(0,6.28),ph2:r.in(0,6.28),wk:r.in(2.2,3.6),fall:r(),asym:r.in(-.08,.08)});
  /* the heart's petaloids: never two alike (photo 106: chunky, crumpled, of all sizes, their ends at every height, frilled by a few uneven
     cuts, some ends rolled out, some in) */
  for(let k=0;k<nH;k++){const t=k/(nH-1);L.push({kind:'h',i:k,t,th:g.rot+.7+(nG+k)*GA+r.in(-.22,.22),s:3+t,sd:Math.floor(r()*1e9),dW:r.in(.62,1.45),dT:r.in(-.16,.16)*(1-.6*t),
    notch:Array.from({length:1+Math.floor(r()*4)},()=>[r.in(-.85,.85),r.in(.2,1),r.in(.05,.2)]),ph:r.in(0,6.28),ph2:r.in(0,6.28),wk:r.in(2.2,5.5),fall:r(),asym:r.in(-.18,.18),
    tilt:r.in(-1,1),roll:r()<.4?-1:1,fold:r.in(.4,1.4)})}
  return L}
/* the stage table [bud, marshmallow, cup, open] read at op */
const peoSt=(A,op)=>{const o=[.06,.35,.65,1];if(op<=o[0])return A[0];for(let i=0;i<3;i++)if(op<=o[i+1])return A[i]+(A[i+1]-A[i])*svSm((op-o[i])/(o[i+1]-o[i]));return A[3]};
/* each piece's geometry over its shell: v -> psi by arc length from the insertion to the tip, the half width, the crumpling bounded by its
   neighbours (BONNES-PRATIQUES §14: every point moves along its ray by less than amp of the gap to any piece it overlaps) */
function peoGeom(P,L,sh,op,dec,fan,R0){const NA=40,NR=14,hi=DET>=1.5;
  for(const q of L){const W=q.kind==='g'?P.gW:q.kind==='h'?P.hW[1]+(P.hW[0]-P.hW[1])*q.t:P.sepW;
    q.W=W*q.dW*(q.kind==='h'?.8+.2*svSm((op-.3)/.5):1);q.wp=q.kind==='s'?(q.leafy?PEO_WP.sl:PEO_WP.s):PEO_WP[q.kind];
    q.a0=sh.ins(q.s);q.a1=q.kind==='s'?peoSt(P.sepTip,op)-(q.leafy?peoSt(P.sepLeaf,op):0)+q.dT+.15*(dec+fan)+.7*P.flop*(dec+.6*fan):
      q.kind==='g'?peoSt(P.gTip,op)+q.dT+P.flop*(dec+.6*fan)*.8:peoSt(P.hTipO,op)+(peoSt(P.hTipI,op)-peoSt(P.hTipO,op))*Math.pow(q.t,.8)+q.dT+.2*dec;
    q.a1=Math.max(.02,Math.min(q.a0-.3,q.a1));
    /* the arc along the shell: cumulative length, then psi at NA+1 even steps of length */
    const ps=[],Ls=[0];let pr=null;for(let i=0;i<=NA;i++){const a=q.a0+(q.a1-q.a0)*i/NA,rh=sh.rho(a,q.s),pt=[rh*Math.sin(a),rh*Math.cos(a)];ps.push(a);if(pr)Ls.push(Ls[i-1]+Math.hypot(pt[0]-pr[0],pt[1]-pr[1]));pr=pt}
    const T=Ls[NA]||1,PV=new Float64Array(NA+1);for(let i=0;i<=NA;i++){const l=T*i/NA;let j=1;while(j<NA&&Ls[j]<l)j++;const f=Math.max(0,Math.min(1,(l-Ls[j-1])/((Ls[j]-Ls[j-1])||1)));PV[i]=ps[j-1]+(ps[j]-ps[j-1])*f}
    q.len=T;q.psi=v=>{const x=Math.max(0,Math.min(1,v))*NA,j=Math.min(NA-1,Math.floor(x)),f=x-j;return PV[j]*(1-f)+PV[j+1]*f};
    q.vOf=a=>{if(a>PV[0]||a<PV[NA])return-1;let j=1;while(j<NA&&PV[j]>a)j++;return(j-1+(PV[j-1]-a)/((PV[j-1]-PV[j])||1))/NA};
    q.ew=q.kind==='g'?.05:q.kind==='h'?.08:.03;
    q.hwE=v=>q.W*peoProf(q.wp,v)*(1+Math.abs(q.asym||0))*(1+q.ew);
    q.dth=(v,a)=>{const rh=sh.rho(a,q.s)*Math.sin(a);return Math.min(1.25,q.hwE(v)/Math.max(1e-3,rh))}}
  /* the bounds: by rows of v, the least gap to a piece outside (out) and inside (in), and to the core */
  for(const q of L){const out=new Float64Array(NR+1),inn=new Float64Array(NR+1);
    for(let j=0;j<=NR;j++){const v=j/NR,a=q.psi(v),rk=sh.rho(a,q.s),dk=q.dth(v,a);let mo=P.cap,mi=Math.min(P.cap,rk-sh.core(a));
      for(const m of L){if(m===q)continue;const vm=m.vOf(a);if(vm<0)continue;let d=Math.abs(q.th-m.th)%6.2832;if(d>3.1416)d=6.2832-d;if(d>dk+m.dth(vm,a)+.06)continue;
        const gp=sh.rho(a,m.s)-rk;if(gp>0)mo=Math.min(mo,gp);else mi=Math.min(mi,-gp)}
      const base=svSm((v-.03)/.22);out[j]=Math.max(0,mo)*P.amp*base;inn[j]=Math.max(0,mi)*P.amp*base}
    const sm=A=>A.map((x,j)=>Math.min(x,A[Math.max(0,j-1)],A[Math.min(NR,j+1)]));q.aO=sm(out);q.aI=sm(inn);
    q.amp=(A,v)=>{const x=Math.max(0,Math.min(1,v))*NR,j=Math.min(NR-1,Math.floor(x)),f=x-j;return A[j]*(1-f)+A[j+1]*f}}}
/* the surface of a piece: (u, v) -> local 3D point (R0 units x R0). The end's outline (Lu) cuts v; the half width gives the turn about the axis
   at that height; the cup, the crumpling and the curl move the point along its ray, inside its bounds (a soft clamp, never past them) */
function peoSurf(P,q,sh,R0,dec,fan){const kind=q.kind,A=P.ruf[kind==='g'?1:kind==='h'?2:0]*(1+.9*dec+.6*fan)*(DET>=1.5?1:.8),
    vb=kind==='g'?.93:kind==='h'?.9:q.leafy?.94:.88,pw=kind==='g'?2.3:kind==='h'?2:q.leafy?1.15:1.8;
  const Lu=u=>{const a=Math.abs(u);let x=vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(a,pw)),1/pw);
    if(q.notch)for(const[un,dp,wn]of q.notch)x-=dp*(1-vb)*Math.exp(-Math.pow((u-un)/wn,2));
    if(kind==='h')x-=.01*(1+Math.sin(u*(4+q.wk)+q.ph2)*Math.sin(u*2.3+q.ph))*svSm((a-.2)/.5);return Math.max(.05,x)};
  return(u,v)=>{const ve=v*Lu(u),a=q.psi(ve),hw=q.W*peoProf(q.wp,ve)*(1+(q.asym||0)*Math.sign(u))*(1+q.ew*Math.sin((q.wk||3)*1.3*Math.PI*ve+q.ph+(u<0?2.3:0))*svSm((ve-.15)/.3)),
      rs=sh.rho(a,q.s),sn=Math.max(1e-3,Math.sin(a)),dth=Math.min(1.25,hw/(rs*sn)),th=q.th+u*dth;
    let x=0;const au=Math.abs(u);
    if(kind==='g'){x=-P.cupG*hw*u*u*svSm(ve/.35)+A*Math.pow(au,1.4)*Math.sin(q.wk*Math.PI*u+q.ph+2*ve)*svSm((ve-.3)/.4)+A*.5*Math.sin(2.3*Math.PI*ve+q.ph2)*svSm((ve-.4)/.4)
      +P.curl*svSm((ve-.72)/.28)*(1+.8*au)}
    else if(kind==='h'){x=-P.cupH*hw*u*u+A*q.fold*(.6*Math.sin(q.wk*Math.PI*u+q.ph+6*ve)+.4*Math.sin(1.7*q.wk*Math.PI*u-q.ph2+11*ve))*svSm((ve-.2)/.4)*(.5+.5*au)
      +A*.8*q.tilt*u*svSm((ve-.3)/.4)+P.curl*.7*q.roll*svSm((ve-.75)/.25)}
    else x=-.5*hw*u*u+.01*Math.sin(3*Math.PI*u+q.ph)*svSm((ve-.4)/.4)+(fan+dec)*.04*svSm((ve-.6)/.4);
    const bo=q.amp(q.aO,ve),bi=q.amp(q.aI,ve),d=x>0?(bo>1e-6?bo*Math.tanh(x/bo):0):(bi>1e-6?-bi*Math.tanh(-x/bi):0),rr=(rs+d)*R0;
    return[rr*sn*Math.cos(th),rr*sn*Math.sin(th),sh.H*R0+rr*Math.cos(a)]}}
/* the colours of a colourway, by piece: g the guards, h the heart, s the sepals; ramps from the base (0) to the end (1), inner face st and back
   bst, shade and light of the washes, veins. A measured entry (PEO_CW) wins; else derived from the catalogue's c (guards) and c2 (heart): a
   paler cream base, the body, the end a little silvered (photos 106, 98: the heart's frilled ends catch the light), the back paler */
const PEO_CWX={};
function peoCol(cwx){const id=cwx.id;if(PEO_CWX[id])return PEO_CWX[id];const c=cwx.c||'#f0a6c0',c2=cwx.c2||c,pale=h2l(c)[2]>.82;
  const sh=x=>h2l(x)[2]>.82?mix(x,'#8a6448',.42):mix(x,'#3a0618',.5),li=x=>mix(x,'#ffffff',.6);
  const one=(x,tip)=>({st:[[0,mix(x,'#f2e2bc',.5)],[.16,mix(x,'#ffffff',.08)],[.5,x],[.84,mix(x,'#ffffff',tip*.5)],[1,mix(x,'#ffffff',tip)]],
    bst:[[0,mix(x,'#dcdcae',.45)],[.2,mix(x,'#ffffff',.22)],[.7,mix(x,'#ffffff',.2)],[1,mix(x,'#ffffff',.26)]],shade:sh(x),lite:li(x),bshade:sh(mix(x,'#ffffff',.2)),blite:'#ffffff',
    vein:pale?mix(x,'#c8a890',.35):mix(x,'#5a0a28',.22),bvein:mix(x,'#ffffff',.1),vo:pale?.12:.16});
  const M=PEO_CW[id]||{};return PEO_CWX[id]={g:Object.assign(one(c,.14),M.g),h:Object.assign(one(c2,.3),M.h),s:{st:[[0,'#4e6e26'],[.45,'#628434'],[.8,'#6e8838'],[1,'#7a6a30']],bst:[[0,'#7c9a48'],[.6,'#8eaa58'],[1,'#98a85a']],
    shade:'#1e3410',lite:'#b8d07a',bshade:'#3e5a20',blite:'#d0e09a',vein:'#3e5c1c',bvein:'#6e8c40',vo:.2,rim:'#9a2a22'},
    carp:'#8aa860',felt:'#dfe6c6',crest:'#b8284a'}}
/* a colour on the head at stage: the tight bud's green on the backs, the decline's bleaching, the faded drying (BONNES-PRATIQUES 6.4: pinks to
   a dusty pale then tan, whites to ivory then beige, reds to wine then brown; the sepals yellow) */
function peoShv(c,v,gt,dec,fan,kind){let x=c;if(gt>0&&kind!=='s')x=mix(x,'#9cb262',Math.min(1,gt*(1-.8*v)));
  if(kind==='s'){if(fan>0)x=typeof lifeCol==='function'?lifeCol(x,.6*fan):mix(x,'#8a8a3a',.5*fan);return x}
  const[h,s,l]=h2l(x);if(dec>0)x=l>.8?mix(x,'#f4ecd8',.35*dec):mix(x,l>.45?'#f0dde2':'#7a2a40',.3*dec);
  const a=Math.min(1,.2*dec+.85*fan);if(a>0){x=mix(x,'#ead6d6',.35*a);x=mix(x,'#c8a088',Math.min(1,a*a*(.15+.6*v)));if(a>.6)x=mix(x,'#8a6448',(a-.6)*v*.9)}return x}
function peoMat(P,C,kind,gt,dec,fan,hi){const K=C[kind],sv=(c,v)=>peoShv(c,v,gt,dec,fan,kind),ramp=st=>st.map(([v,c])=>[v,sv(c,v)]);
  const m=Object.assign({stops:ramp(K.st),bstops:ramp(K.bst),shade:sv(K.shade,.5),lite:K.lite,bshade:sv(K.bshade,.5),blite:K.blite,rim:mix(sv(K.st[2][1],.5),'#3a1020',.3),
    cast:mix(K.shade,'#1a0a08',.5)},P.light,{trans:kind==='s'?.08:.16+.1*dec,rw:hi?.0025:0,ro:.2});
  /* the fine material and the measured grid (opt-in by the colourway's measures): the tissue dries under it as the flower fades */
  if(K.fine&&hi){const age=Math.min(.7,.15*dec+.6*fan)*(kind==='h'?.55:1);m.fine=age>0?Object.assign({},K.fine,{age:{a:age,c:'#ecd4d6',c2:'#b48c7c',vein:'#8a6050',n:10}}):K.fine;if(K.grid&&gt<.3)m.grid=K.grid}
  if(kind==='s')m.cross=[{st:[[0,K.rim,0],[.72,K.rim,0],[.9,K.rim,.55],[1,K.rim,.85]],tip:.9,bk:.5,soft:.02}];
  if(!hi)for(const q of['stops','bstops'])if(m[q].length>3)m[q]=[m[q][0],m[q][Math.floor(m[q].length/2)],m[q][m[q].length-1]];
  return m}
/* the carpels (photos 201, 306, 308: three to five follicles in the middle, felted, pale green under a white down, each ending in a curled
   crest, red to crimson): drawn only once the petals fall and show them (the full double hides them); each a drawn piece, a felted spindle
   along a 3D spine, with a proxy strap for the order and its tube for the 3D check (y3-qa3d.js) */
function peoCarpels(B,O,R0,g,C,op,fan,pieces,ff){if(ff<.15)return;const r=svRng(g.sd+71),n=3+Math.floor(r()*3),hi=DET>=1.5,sw=1+.3*fan,
    lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),body=mix(C.carp,'#8a7a40',.35*fan),felt=C.felt,crest=mix(C.crest,'#5a1a1a',.4*fan);
  const T=[];for(let i=0;i<n;i++){const ph=g.rot+i/n*6.2832+r.in(-.15,.15),rd=[Math.cos(ph),Math.sin(ph),0],L=R0*.27*sw*r.in(.9,1.08),P3=[];
    for(let j=0;j<=8;j++){const v=j/8,a=.08+.18*v*v;P3.push([rd[0]*R0*(.05+.02*v)+rd[0]*Math.sin(a)*L*v,rd[1]*R0*(.05+.02*v)+rd[1]*Math.sin(a)*L*v,R0*.02+Math.cos(a)*L*v])}
    T.push({P:P3,rad:k=>R0*.045*sw*Math.sin(Math.PI*Math.min(.95,.12+k/8*.85)),ph,rd})}
  let Q=typeof svApart==='function'?svApart(T.map(t=>({P:t.P,rad:t.rad})),R0*.006,.2,6):T.map(t=>t.P);
  /* clear of the petals still on (their feet round the receptacle): the measure's own rule, then apart again */
  if(typeof svClearT==='function')for(let it=0;it<3;it++){Q=Q.map((P3,x)=>svClearT(pieces,P3,T[x].rad,.15,R0*.006));if(typeof svApart==='function')Q=svApart(Q.map((P3,x)=>({P:P3,rad:T[x].rad})),R0*.006,.2,4)}
  T.forEach((t,x)=>{const P3=Q[x],w=k=>t.rad(k),ax=V3.cr(V3s(P3[8],P3[0]),[0,0,1]),side=V3l(ax)>1e-3?V3.nz(ax):[1,0,0],
      sp=v=>{const y=v*8,j=Math.min(7,Math.floor(y)),f=y-j;return V3.add(V3.sc(P3[j],1-f),V3.sc(P3[j+1],f))},
      prox=svSheet(B,O,(u,v)=>V3.add(sp(v),V3.sc(side,u*Math.max(w(v*8)*.5,R0*.008))),{nu:2,nv:9});
    pieces.push({fn:k2=>{const S2=P3.map(p=>PJ(B,O,p)),Lp=[],Rp=[],Hp=[];for(let q=0;q<=8;q++){const a=S2[Math.max(0,q-1)],b=S2[Math.min(8,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ww=w(q),nx=-dy/l,ny=dx/l;
        Lp.push([S2[q][0]+nx*ww,S2[q][1]+ny*ww]);Rp.push([S2[q][0]-nx*ww,S2[q][1]-ny*ww]);Hp.push([nx,ny,ww,S2[q]])}
      const hk=G(k2),out=svSpl(Lp.concat(Rp.slice().reverse())),mid=Hp[4],sg=mid[0]*lt[0]+mid[1]*lt[1]>0?1:-1,id='pc'+(gid++),
        gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(mid[3][0]+mid[0]*mid[2]*sg),y1:svF(mid[3][1]+mid[1]*mid[2]*sg),x2:svF(mid[3][0]-mid[0]*mid[2]*sg),y2:svF(mid[3][1]-mid[1]*mid[2]*sg)},GDEF||defs);
      for(const[o2,c2]of[[0,mix(felt,body,.25)],[.35,mix(body,felt,.35)],[.7,body],[1,mix(body,'#1e2a0c',.45)]])E('stop',{offset:o2,'stop-color':c2},gr);
      E('path',{d:out,fill:`url(#${id})`,stroke:mix(body,'#2a3010',.4),'stroke-width':svF(Math.max(.12,R0*.004)),'stroke-opacity':.4},hk);
      if(!LOD){/* the suture (a fine groove along the inner side) and the down: short pale hairs standing out of the outline */
        E('path',{d:svSpl(Hp.slice(1,8).map(([nx,ny,ww,p])=>[p[0]-nx*ww*.35*sg,p[1]-ny*ww*.35*sg]),false),fill:'none',stroke:mix(body,'#24300c',.5),'stroke-width':svF(Math.max(.1,R0*.005)),'stroke-opacity':.5,'stroke-linecap':'round'},hk);
        if(hi){const rr=svRng(g.sd+x*13);let dh='';for(const E2 of[Lp,Rp])for(let q=1;q<8;q++)for(let z=0;z<3;z++){const p=E2[q],c=Hp[q][3],dx=p[0]-c[0],dy=p[1]-c[1],l=Math.hypot(dx,dy)||1,len=R0*rr.in(.008,.02);
          const x0=p[0]-dx/l*len*.4+rr.in(-1,1)*R0*.01,y0=p[1]-dy/l*len*.4+rr.in(-1,1)*R0*.01;dh+=`M${svF(x0)},${svF(y0)}l${svF(dx/l*len)},${svF(dy/l*len)}`}
          E('path',{d:dh,fill:'none',stroke:felt,'stroke-width':svF(Math.max(.1,R0*.003)),'stroke-opacity':.7,'stroke-linecap':'round'},hk)}}
      /* the crest: a curled flat stigma over the tip, rolled outward */
      const tp=P3[8],dir=V3.nz(V3s(P3[8],P3[6])),o2=V3.nz([t.rd[0],t.rd[1],0]),cr=[];for(let q=0;q<=6;q++){const a=q/6*3.6,rr2=R0*.035*(1-.4*q/6);
        cr.push(PJ(B,O,V3.add(tp,V3.add(V3.sc(dir,Math.sin(a)*rr2),V3.sc(o2,(1-Math.cos(a))*rr2)))))}
      E('path',{d:svSpl(cr.map(p=>[p[0],p[1]]),false),fill:'none',stroke:crest,'stroke-width':svF(Math.max(.4,R0*.022)),'stroke-linecap':'round'},hk);
      E('path',{d:svSpl(cr.map(p=>[p[0]+lt[0]*R0*.005,p[1]+lt[1]*R0*.005]),false),fill:'none',stroke:mix(crest,'#ffd0d8',.35),'stroke-width':svF(Math.max(.2,R0*.008)),'stroke-opacity':.6,'stroke-linecap':'round'},hk)},
      proxy:prox,pmin:1,tube:{P:P3,r0:w(1),r1:w(7),ins:.15}})})}
/* the head: in the frame B at O (Z from the stem to the face), D the open flower's diameter */
function peoHead(par,B,O,D,S,cwx,op,seed,wl){const P=S?Object.assign({},PEO_DBL,S):PEO_DBL,hi=DET>=1.5,R0=D/2,r=svRng(seed||1),W0=typeof WILT!=='undefined'?WILT:null;
  const g={rot:r.in(0,6.2832),sd:Math.floor(r()*1e9),dop:r.in(-.025,.025)},oo=Math.max(.02,Math.min(1,op+g.dop)),wl0=wl||0,
    dec=svSm((wl0-P.dec[0])/P.dec[1]),fan=svSm((wl0-P.fan[0])/P.fan[1]),gt=1-svSm((oo-.12)/.26);
  if(typeof WILT!=='undefined')WILT=null;
  try{const sh=peoShells(P,oo,dec,fan),nG=P.nG[hi?1:0],nH=Math.round(P.nH[hi?1:0]*(oo<.3?.5:1)),ff=svSm((wl0-P.fall[0])/P.fall[1]);
    let L=peoPieces(P,g,oo,nG,nH);if(ff>0)L=L.filter(q=>q.kind==='s'||q.fall>=ff*(1-(q.kind==='g'||q.t<.3?P.keep*2:0)));  /* the last to hang on are guards and outer petaloids */
    peoGeom(P,L,sh,oo,dec,fan,R0);if(typeof SVQA_DBG!=='undefined'&&SVQA_DBG)PEO_LAST={L,sh,P,dec,fan,R0};
    const C=peoCol(cwx),M={g:peoMat(P,C,'g',gt,dec,fan,hi),h:peoMat(P,C,'h',gt*.6,dec,fan,hi),s:peoMat(P,C,'s',0,dec,fan,hi)},pieces=[],det=hi?1.25:.8;
    for(const q of L){const vr=svRng(q.sd+5),vn=q.kind==='s'?svVeins(vr,5,0,.2):svVeins(vr,q.kind==='g'?(hi?16:9):(hi?9:5),hi?.15:0,hi?.35:.2),base=M[q.kind],vc=base.stops[Math.floor(base.stops.length/2)][1],
        K=C[q.kind],vo=K.vo;
      const m=Object.assign({},base,{fineVeins:false,veins:!hi&&q.kind==='h'?null:(s2,front)=>front?[[vn.main,.0016,peoShv(K.vein,.5,gt,dec,fan,q.kind),vo+.15*dec],[vn.fine,.0011,peoShv(K.vein,.5,gt,dec,fan,q.kind),vo*.55]]:[[vn.main,.0016,peoShv(K.bvein,.5,gt,dec,fan,q.kind),vo*.7]]});
      const big=q.kind==='g',nu=Math.round((big?P.gnu:P.nu)[hi?1:0]*(q.kind==='s'?.7:1)),nv=Math.round((big?P.gnv:P.nv)[hi?1:0]*(q.kind==='s'?.7:1)),dz=q.kind==='h'?.45:.3;
      const pc=svSheet(B,O,peoSurf(P,q,sh,R0,dec,fan),{nu,nv,mat:m,ao:(u,v,front)=>front?1-dz*(1-svSm((v-.02)/.4)):1-.2*(1-svSm(v/.25))});pc.wh=q.kind;pieces.push(pc)}
    /* the floor of the heart: the core's surface in the hollow's darkest colour, so that nothing shows through between the innermost
       petaloids (qa:false: it lies under them by design, as the lily's floor) */
    if(ff<.5){const fc=mix(C.h.shade,'#2a0410',.25),fm=Object.assign({},M.h,{stops:[[0,fc],[1,mix(fc,C.h.st[2][1],.35)]],bstops:[[0,fc],[1,fc]],fine:null,grid:null,cross:null,veins:null,transmit:null});
      pieces.push(svSheet(B,O,(u,v)=>{const a=(1-v)*PEO_PSI*.92,th=(u+1)*Math.PI,rr=Math.max(.01,sh.core(a))*.96*R0;return[rr*Math.sin(a)*Math.cos(th),rr*Math.sin(a)*Math.sin(th),sh.H*R0+rr*Math.cos(a)]},{nu:12,nv:8,mat:fm,qa:false,zb:-.004}))}
    peoCarpels(B,O,R0,g,C,oo,fan,pieces,ff);
    return svDraw(par,pieces,{D,pmin:P.pmin,shadow:hi})}
  finally{if(typeof WILT!=='undefined')WILT=W0}}
function peoSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_PDBL!=='undefined'&&CW_PDBL.find(x=>x.id===cwId))||{id:cwId};return peoHead(par,B,O,D,S,cwx,op,seed,wl==null?0:wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['pivoine-herbacee-double']=peoSvg;
