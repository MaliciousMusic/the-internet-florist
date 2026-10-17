/* ================= y3-capitule.js : the capitulum of the daisy family (Asteraceae), a kit piece (y3.js untouched) =================
   svcapDraw(par,B,O,D,S,cwx,op,seed,wl,o) draws one whole flower head: in the frame B (B[2] its axis, where the face looks) at O, D its diameter
   when open, op 0 bud .. 1 open, wl 0 fresh .. 1 dry. Generic for the heads of the family (gerbera now; later zinnia, sunflower, China aster,
   chrysanthemum, dahlia): every number is a setting of the sheet S over SVCAP_DEF, nothing of one genus is written here.
   What a head is made of, from outside in:
   - the rays (ligules) in one or more rows (f = 0 outermost .. 1 innermost): their number, length, width, the claw at the foot, the broadest point,
     the tip (round with small teeth, or pointed, or split), the cross section (channelled, or rolled into a quill), the twist, the spine's angle
     from the axis at the foot and at the tip (closed in the bud, open), the veins along them; a setting given "by row" is a number or a table
     [[f, value]...];
   - the heart: a ring of short trans florets (the crown) round a flat or domed disc of florets laid on the golden angle, with its ring of pollen;
   - behind: the involucre, rows of narrow green bracts laid back under the rays (closed round the bud), on a receptacle that narrows into the neck.
   Its life: the bud is the involucre closed round a cone of ray tips; the rows open from the outside in; then the rays tip down past flat, roll
   their margins under, curl and brown from their tips, go limp and fall from the outer row first, the disc darkens and rises into a dry cone.
   Drawing within a budget (about 300 elements a head at DET 1): every ray is one path (its own tone from the light on its surface, a thin edge),
   plus one shading path (the half of its channel turned from the light, and the shadow at its foot); a zone of another colour (a halo at the foot,
   coloured tips) adds one path; veins only in close-ups. The order is the depth of each piece, the inner rows over the outer ones seen from the
   face (under them from behind), and the heart is set between the rays that pass under it and those that pass over it (a true test of depth on
   the disc's plane). Only SVG paths: no image, no filter.
   The sheet: S={...settings that differ, mat:cwx=>material, genes?:seed=>{...}}; the material (one per colourway, see svcapMat): ray colours
   base, body, tip, back (underside), optional halo {c,v} and tips {c,v}, heart (disc centre), disc, crown, crownTip, pollen, greens, dry. */
const SVCAP_DEF={
  /* life: opening of the head (o2 = svSm((op-open[0])/open[1])), the inner rows later by lag; the bud's head is smaller (grow: scale at op 0, op
     where full) and its rays shorter (budL); decline, fading, shedding as [start, length] in wl; the head tips over: sum of k*svSm((wl-a)/b) */
  open:[.1,.78],lag:.22,grow:[.45,.7],budL:.5,budE:[0,.75],col:null,dec:[.1,.4],fan:[.48,.28],shed:[.8,.16],tip:[[.2,.2,.35],[.7,.5,.35]],
  /* the rays, by row: count (and its spread between heads), the stagger of each row in the pitch, length and width (x R0), insertion radius and height */
  rows:2,n:[[0,24],[1,20]],nJ:.06,stag:.5,L:[[0,.74],[1,.6]],W:[[0,.16],[1,.15]],r0:[[0,.27],[1,.25]],z0:[[0,-.01],[1,.012]],
  /* the spine's angle from the axis at the foot (a0) and the tip (a1), closed (c) and open (o); aPow < 1 bends it near the foot */
  a0c:[[0,.3],[1,.2]],a1c:[[0,-.55],[1,-.7]],a0o:[[0,1.36],[1,1.2]],a1o:[[0,1.62],[1,1.48]],aPow:1.3,
  /* outline: claw (width at the foot, share of the broadest), broadest point, taper past it, tip (superellipse exponent tipE, height x half
     width tipH), teeth [count, depth x width], split tip [depth x length] (spiders) */
  claw:.24,vb:.72,taper:.1,tipE:2.4,tipH:.95,teeth:[3,.045],fork:0,
  /* cross section: channelled (cup, x width, the margins up) or rolled under into a quill (quill 0..1); twist along the ray (rad); the tip curled
     under (rad); a slow wave along it */
  cup:.1,quill:0,tw:0,curl:0,wav:0,
  /* the spread between rays: length, width, angles, place on the circle, twist, curl */
  jL:.1,jW:.1,jA:.12,jPh:.12,jTw:.12,jCurl:.1,jBend:.2,
  /* the individuality of the rays (no two alike): a slow ripple of length round the head (amount), a share of rays lifted (share, added to the
     tip's angle), a share dropped and curled (share, angle), a share folded along the midrib and twisted (share, twist), the tip's height spread */
  jRip:.05,jLift:[.12,-.38],jDrop:[.1,.3],jFold:[.06,.6],jTip:.25,
  /* the shadow an inner row casts on the row under it: offset (x R0, along the light on the screen), opacity, how far along the ray (0 = none) */
  rowSh:[.08,.4,.7],
  /* fading: added to the angles at [decline, fading], curl, quill, narrowing and shortening of the limp rays, browning margin */
  wA0:[.18,.55],wA1:[.4,.75],/* a faded head hanging face down: its rays fall along the axis by their weight (137, 70), to these angles (foot, tip) */wHang:[.42,.12],/* the limp rays sag toward the ground (x fading) and their margins wave (added to wav x fading): a skirt hanging round the disc (121) */wGrav:0,wWav:0,wCurl:[.35,.9],wQuill:[.12,.3],wW:.12,wL:.12,wBrown:[.25,.75],
  /* the heart (x R0): radius (to the crown's outer edge), disc, dome height, crown of trans florets (count, rows, length, angle from the axis,
     stroke width), disc florets [DET 1, DET 1.5], ring of pollen (share of the ring between disc and crown), dry cone height */
  heart:{r:.27,disc:.135,h:.03,crownN:52,crownRows:2,crownL:.085,crownA:.62,crownW:.024,dots:[56,130],pol:[.1,.75],dry:.2},
  /* the involucre: rows of bracts (count, length, width x R0), insertion, angles closed and open; the receptacle (radius, depth, neck radius) */
  inv:{rows:2,n:[22,18],L:[.23,.17],W:[.05,.045],r0:.29,z0:-.035,a0c:.38,a1c:-.3,a0o:1.95,a1o:2.35,bud:2.4,budW:1.3,ob:[.15,.6],obU:[0,1],wA:[.3,.4],edge:.55},
  recep:{r:.235,dep:.16,neck:.08},
  /* rendering: spine samples, edge points [DET 1, DET 1.5], veins in close-ups, edge stroke, light (ambient, diffuse, wrap, reference, toward
     shade, toward light), shading path opacity [base, x contrast], shadow at the foot (share of the length); the rows past
     which rays have no shading path (shadeF) and, at DET 1, a polyline outline instead of a spline (lnF: small inner rays) */
  ns:12,ne:[3,5],veins:4,edge:.5,light:{amb:.4,dif:.72,wrap:.4,ref:.86,kD:.6,kL:.5},shade:[.06,1.1],ao:.16,shadeF:1,lnF:1
};
/* a setting by row: a number, or a table [[f, value]...] read linearly */
const svcapT=(T,f)=>{if(typeof T==='number')return T;if(f<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(f<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(f-a[0])/((b[0]-a[0])||1)}return T[T.length-1][1]};
/* wrapped diffuse light on a view-space normal */
const svcapI=(n,Lg)=>Lg.amb+Lg.dif*Math.max(0,(V3.dot(n,LIGHT)+Lg.wrap)/(1+Lg.wrap));
/* a colour toned by a light value */
const svcapTone=(c,I,m,Lg)=>I<Lg.ref?mix(c,m.shade,Math.min(.75,(Lg.ref-I)*Lg.kD)):mix(c,m.lite,Math.min(.6,(I-Lg.ref)*Lg.kL));
/* the default material of a colourway {c, c2, eye, ring, tip, crown}: a measured table may replace any field (o.tab):
   base, body, tip, back, shade, lite, ink (the ray's edge), rim (a coloured edge, as Rosalia's), heart, disc, crown, crownTip, pollen;
   halo (ring of another colour at the foot of the rays) with haloV (where it ends along the ray) and haloM (how far it runs up the midrib);
   tips (coloured tips) with tipsV (where the full colour starts), tipsM (how far down the margins it runs past tipsV), tipsB (the wash before
   it: share of the tip colour, 0 none) and tipsBV (its length). The crown of trans florets follows the rays (105, 107, 166): the ray colour
   (or the tips' on a tipped colourway) a little deeper, never a fixed orange; its styles (crownTip) yellow on a dark heart (105, 107, 160).
   A pale body (white, cream) keeps its rays readable on a light ground by a grey edge and a gutter shadow (shMin: least opacity of the
   shading half, as the greys of 172, Michelle, Rosalia) */
function svcapMat(cwx,tab){const c=cwx.c||'#f07a1e',t=tab||{},body=t.body||c,eye=t.heart||cwx.eye||'#3a2a1a',el=h2l(eye)[2],dark=el<.3,lum=h2l(body)[2],pale=lum>.82;
  const tc=t.tips||cwx.tip||null,cb=tc?mix(body,tc,.5):t.halo||cwx.ring?mix(body,t.halo||cwx.ring,.25):body,cl=h2l(cb)[2];
  const m={body,base:t.base||mix(body,shd(body,-.2),.5),tip:t.tip||cwx.c2||body,back:t.back||mix(body,'#efe9dc',lum>.8?.1:.18),
    shade:t.shade||shd(body,pale?-.62:-.62),lite:t.lite||mix(body,'#fffaf0',.55),ink:t.rim||t.ink||shd(body,pale?-.78:-.55),vein:t.vein||shd(body,pale?-.45:-.3),shMin:t.shMin??(pale?.2:0),
    halo:t.halo?{c:t.halo,v:t.haloV||.3,mg:t.haloM??.12}:cwx.ring?{c:cwx.ring,v:.3,mg:.12}:null,
    tips:tc?{c:tc,v:t.tipsV||.8,mg:t.tipsM??.1,b:t.tipsB??.38,bv:t.tipsBV??.13}:null,
    heart:eye,disc:t.disc||(dark?mix(eye,'#3a2010',.3):mix(eye,'#c8c050',.25)),
    crown:t.crown||cwx.crown||(cl>.8?mix(cb,dark?'#b89a68':'#bcc07a',.32):svShift(shd(cb,-.2),0,.12,0)),
    crownTip:t.crownTip||(dark?'#f2c83a':mix(eye,'#f2e27a',.45)),pollen:t.pollen||'#f4d03e',
    bract:t.bract||'#50783a',bractTip:t.bractTip||'#7a6a40',recep:t.recep||'#5a8440',green:t.green||'#7ea055',dry:t.dry||'#6e4c2e'};
  m.crownInk=shd(m.crown,-.6);m.discHi=mix(m.heart,dark?'#8a7a52':'#e8f0a0',dark?.42:.3);m.discLo=shd(m.heart,-.5);return m}
/* a zone of another colour on a ray, in (s, v), its inner boundary bowed: coloured tips from v0 on the midrib, running down the margins to
   v0 - mg (a wash, as on Panna Cotta and Rosalia, not a cap); a halo at the foot up to v0 - mg/2 at the margins, v0 + mg/2 up the midrib */
function svcapZone(q,v0,mg,tip,ne){const R=[],nb=5;
  if(tip){const P=svcapPoly(q,Math.max(.02,v0-mg),1,0,ne);for(let j=1;j<nb;j++){const u=1-2*j/nb,v=v0-mg*u*u;R.push([u*svcapW(q,v)*.98,v])}return P.concat(R)}
  const vE=Math.min(q.vt*.9,v0-mg*.5),m=Math.max(1,Math.ceil(ne*vE/q.vt)),L=[],Rt=[];for(let i=0;i<=m;i++){const v=vE*i/m;L.push([-svcapW(q,v),v]);Rt.unshift([svcapW(q,v),v])}
  for(let j=1;j<nb;j++){const u=-1+2*j/nb,v=Math.min(q.vt*.95,v0-mg*.5+mg*(1-u*u));R.push([u*svcapW(q,v)*.98,v])}return L.concat(R,Rt)}
/* the spine of one ray in the head's frame, sampled: points, width direction, normal (toward the inner face) */
function svcapSpine(q,ns){const c0=Math.cos(q.phi),s0=Math.sin(q.phi),Z=[0,0,1],P=[],T=[],N=[],bd=q.bend||0,gv=q.gv;let p=[c0*q.r0,s0*q.r0,q.z0],rho,T0;
  /* a limp ray sags toward the ground (gv: the ground's direction in the head's frame x how limp): more and more along it */
  const sag=(t,T0,v)=>{if(!gv)return[t,T0];const k=v*v,t2=V3.nz(V3.add(t,V3.sc(gv,k))),T2=V3.nz(V3.add(T0,V3.sc(t2,-V3.dot(T0,t2))));return[t2,T2]};
  for(let i=0;i<=ns;i++){const v=i/ns,ph=q.phi+bd*v,c=Math.cos(ph),s=Math.sin(ph);rho=[c,s,0];T0=[-s,c,0];const al0=q.a0+(q.a1-q.a0)*Math.pow(v,q.aPow)+q.curl*svSm((v-.45)/.55)+q.wav*Math.sin(v*7+q.wph)*v,al=Math.min(q.amax||2.9,al0);
    let t=V3.add(V3.sc(rho,Math.sin(al)),V3.sc(Z,Math.cos(al)));[t,T0]=sag(t,T0,v);const n0=V3.cr(t,T0),tw=q.tw*v,ct=Math.cos(tw),st=Math.sin(tw);
    P.push(p);T.push(V3.add(V3.sc(T0,ct),V3.sc(n0,st)));N.push(V3.add(V3.sc(n0,ct),V3.sc(T0,-st)));
    if(i<ns){const vm=(i+.5)/ns,pm=q.phi+bd*vm,rho2=[Math.cos(pm),Math.sin(pm),0],al2=q.a0+(q.a1-q.a0)*Math.pow(vm,q.aPow)+q.curl*svSm((vm-.45)/.55)+q.wav*Math.sin(vm*7+q.wph)*vm,al3=Math.min(q.amax||2.9,al2);let d=V3.add(V3.sc(rho2,Math.sin(al3)),V3.sc(Z,Math.cos(al3)));
      if(gv)d=sag(d,[-Math.sin(pm),Math.cos(pm),0],vm)[0];p=V3.add(p,V3.sc(d,q.L/ns))}}
  return{P,T,N,ns}}
/* a point of the ray: across s (absolute, x R0 units like the rest), along v (0 foot .. 1 tip) */
function svcapAt(sp,q,s,v){const x=Math.max(0,Math.min(sp.ns,v*sp.ns)),i=Math.min(sp.ns-1,Math.floor(x)),t=x-i,L=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],
    P=L(sp.P[i],sp.P[i+1]),T=L(sp.T[i],sp.T[i+1]),N=L(sp.N[i],sp.N[i+1]),k=q.kap;
  const xs=k>1e-4?Math.sin(k*s)/k:s,h=q.cupK*s*s-(k>1e-4?(1-Math.cos(k*s))/k:0);return V3.add(P,V3.add(V3.sc(T,xs),V3.sc(N,h)))}
/* the half width of a ray along its length (absolute) */
function svcapW(q,v){let w=q.claw+(1-q.claw)*Math.pow(Math.sin(Math.PI/2*Math.min(1,v/q.vb)),.9);if(v>q.vb)w*=1-q.taper*Math.pow((v-q.vb)/(1-q.vb),1.5);return w*q.W/2}
/* the outline of a ray, or of a part of it, in (s, v): side 0 whole, -1 / 1 one half (midrib to that margin); from v0 to v1 (1 = with the tip) */
function svcapPoly(q,v0,v1,side,ne){const wt=svcapW(q,q.vt),ht=wt*q.tipH,L=q.L,b=Math.min(v1,q.vt),
    edge=sg=>{const m=Math.max(1,Math.ceil(ne*(b-v0)/q.vt)),R=[];for(let i=0;i<=m;i++){const v=v0+(b-v0)*i/m;R.push([sg*svcapW(q,v),v])}return R},
    /* the tip from the right margin (th 0) over to the left one (th pi): a blunt superellipse with small teeth, a point, or a split point */
    tip=()=>{const R=[],nT=q.hi?q.teeth[0]:1,pt=q.tipE<1.6,npt=q.fork>0?5:pt?3:nT>1?2*nT+1:q.L<.45*q.Rh&&!q.hi?3:5,e=2/q.tipE;for(let j=0;j<npt;j++){const th=Math.PI*j/(npt-1),c=Math.cos(th),sn=Math.sin(th);
        let s=Math.abs(c)<1e-9?0:wt*Math.sign(c)*Math.pow(Math.abs(c),e),l=L*q.vt+ht*Math.pow(sn,e);
        if(!pt&&nT>1)for(let k=1;k<nT;k++){const d=th-Math.PI*k/nT;l-=q.teeth[1]*q.W*Math.exp(-d*d/.02)}
        if(q.fork>0){const d=th-Math.PI/2;l-=q.fork*L*Math.exp(-d*d/.05)}R.push([s,Math.min(1,l/L)])}return R};
  if(side===0){const lft=edge(-1),rgt=edge(1).reverse();return v1>=1?lft.concat(tip().reverse(),rgt):lft.concat(rgt)}
  const mid=[],m=Math.max(1,Math.ceil(ne*(b-v0)/q.vt));for(let i=0;i<=m;i++)mid.push([0,v0+(b-v0)*i/m]);
  let t=[];if(v1>=1){const T=tip();t=side>0?T.filter(p=>p[0]>=0).reverse():T.filter(p=>p[0]<=0)}
  return mid.concat(t,edge(side).reverse())}
/* a closed polyline, relative and rounded (the shading paths: cheaper than splines) */
function svcapLn(P){let x=svR(P[0][0]),y=svR(P[0][1]),d='M'+svJ([x,y])+'l';const a=[];for(let i=1;i<P.length;i++){const nx=svR(P[i][0]),ny=svR(P[i][1]);a.push(nx-x,ny-y);x=nx;y=ny}return d+svJ(a)+'z'}
/* the screen polygon of a (s, v) polygon */
const svcapScr=(B,O,sp,q,poly)=>poly.map(([s,v])=>PJ(B,O,svcapAt(sp,q,s*q.R0,v)));
/* one ray: geometry, light and its draw */
/* a drying ray keeps its own hue (121, 70, 137): the tip and the body darken and dull toward a brown OF THAT HUE (svcapDry), the margins brown as a
   wash from the tip (wz: v of the tip's point, margin run, opacity); tone = {tip, body, wash, v, mg} */
function svcapDry(c,t){const[h,s,l]=h2l(c);let d=((28-h+540)%360)-180;const ad=Math.abs(d),f=t.hue??(ad<=25?.2+.5*ad/25:.7-.4*Math.min(1,(ad-25)/30));/* yellows and creams brown toward orange (121), reds and pinks hold their hue */return l2h(h+d*f,Math.max(t.sMin??.3,Math.min(s,t.sMax??.7)*(t.sK??.8)),Math.max(t.lMin??.17,Math.min(t.lMax??.34,l*(t.lK??.45))))}
function svcapWiltMat(mm,t,brown,h){const dc=svcapDry(mm.body,t);return Object.assign({},mm,{tip:mix(mm.tip,dc,brown*t.tip),body:mix(mm.body,dc,brown*t.body),wz:{c:dc,v:t.v-.1*h,mg:t.mg,k:t.wash*brown}})}
function svcapRay(B,O,q,m,P,hi){const sp=svcapSpine(q,P.ns),R0=q.R0,Rh=q.Rh,Lg=P.light,ne=Math.max(2,P.ne[hi?1:0]-(q.L<.42*Rh?1:0));
  /* the normals at the middle, on both halves */
  const nrm=(s,v)=>{const e=.02,a=svcapAt(sp,q,s*R0,v),b=svcapAt(sp,q,(s+e*q.W)*R0,v),c=svcapAt(sp,q,s*R0,Math.min(1,v+e));return V3.nz(toV(B,V3.cr(V3.add(c,V3.sc(a,-1)),V3.add(b,V3.sc(a,-1)))))};
  const w55=svcapW(q,.55),nl=nrm(-w55*.6,.55),nr=nrm(w55*.6,.55),nc=nrm(0,.55),front=nc[2]>=0,fl=front?1:-1,
    Il=svcapI(V3.sc(nl,fl),Lg),Ir=svcapI(V3.sc(nr,fl),Lg),I=(Il+Ir)/2,dark=Il<Ir?-1:1;
  const out=svcapScr(B,O,sp,q,svcapPoly(q,0,1,0,ne));
  /* the key: the depth a third of the way out; the spine on screen for the heart's test */
  const spine=[];for(let i=0;i<=6;i++){const v=i/6;spine.push(PJ(B,O,svcapAt(sp,q,0,v)))}const key=PJ(B,O,svcapAt(sp,q,0,.33))[2];
  /* the outline of the shadow it casts (a little wider, up to v1; screen points) */
  const shadow=v1=>svcapScr(B,O,sp,q,svcapPoly(q,0,v1,0,hi?2:1).map(([s,v])=>[s*1.25,v]));
  return{key,spine,shadow,draw:k=>{const ramp=v=>{let c=v<.25?mix(q.m.base,q.m.body,v/.25):v<.7?q.m.body:mix(q.m.body,q.m.tip,(v-.7)/.3);return c};
      const body=front?ramp(.6):q.m.back,col=svcapTone(body,I,q.m,Lg);
      E('path',{d:!hi&&q.f>P.lnF?svcapLn(out):svSpl(out),fill:col},k);
      /* a zone of another colour: halo at the foot, coloured tips (front face; the back shows them paler) */
      for(const z of[q.m.halo,q.m.tips])if(z){const foot=z===q.m.halo,zc=front?z.c:mix(z.c,q.m.back,.5);
        if(!foot&&z.b>0)E('path',{d:svcapLn(svcapScr(B,O,sp,q,svcapZone(q,z.v-z.bv,z.mg*1.2,1,ne))),fill:svcapTone(mix(body,zc,z.b),I,q.m,Lg),stroke:'none'},k);
        E('path',{d:svcapLn(svcapScr(B,O,sp,q,svcapZone(q,z.v,z.mg,!foot,ne))),fill:svcapTone(zc,I,q.m,Lg),stroke:'none'},k)}
      if(q.m.wz){const z=q.m.wz;E('path',{d:svcapLn(svcapScr(B,O,sp,q,svcapZone(q,z.v,z.mg,1,ne))),fill:svcapTone(front?z.c:mix(z.c,q.m.back,.4),I,q.m,Lg),'fill-opacity':svF(z.k),stroke:'none'},k)}
      /* the shading: the half of the channel turned from the light, and the shadow at the foot */
      if((!hi&&P.shadeLo===0)||q.f>P.shadeF)return;const con=Math.abs(Il-Ir),op=Math.max(q.m.shMin||0,Math.min(.5,P.shade[0]+P.shade[1]*con+(q.wk||0)));let d=svcapLn(svcapScr(B,O,sp,q,svcapPoly(q,.02,1,dark,ne)));
      if(P.ao>0&&q.aoK<.25)d+=svcapLn(svcapScr(B,O,sp,q,svcapPoly(q,0,P.ao*(1+q.aoK),0,1)));
      E('path',{d,fill:q.m.shade,'fill-opacity':svF(op),stroke:'none'},k);
      /* the veins (close-ups) */
      if(hi&&P.veins>0){let dv='';const nv=P.veins;for(let j=0;j<nv;j++){const u=-.75+1.5*(j+.5)/nv,L=[];for(let i=0;i<=4;i++){const v=.06+(q.vt-.1)*i/4;L.push(PJ(B,O,svcapAt(sp,q,u*svcapW(q,v)*R0,v)))}dv+=svQuad(L)}
        E('path',{d:dv,fill:'none',stroke:q.m.vein,'stroke-width':svF(Math.max(.18,Rh*.004)),'stroke-opacity':.32},k)}}}}
/* one involucral bract: narrow, pointed, laid back under the head (or closed round the bud) */
function svcapBract(B,O,q,P,col){const sp=svcapSpine(q,6),Lg=P.light,out=[],ne=4,pw=v=>(v<.3?.75+.25*v/.3:1-Math.pow((v-.3)/.7,1.25))*q.W/2;
  for(let i=0;i<=ne;i++){const v=i/ne*.97;out.push(PJ(B,O,svcapAt(sp,q,-pw(v),v)))}out.push(PJ(B,O,svcapAt(sp,q,0,1)));for(let i=ne;i>=0;i--){const v=i/ne*.97;out.push(PJ(B,O,svcapAt(sp,q,pw(v),v)))}
  const a=svcapAt(sp,q,0,.4),b=svcapAt(sp,q,.01,.4),c=svcapAt(sp,q,0,.45),n=V3.nz(toV(B,V3.cr(V3.add(c,V3.sc(a,-1)),V3.add(b,V3.sc(a,-1))))),I=svcapI(n[2]>=0?n:V3.sc(n,-1),Lg);
  return{key:PJ(B,O,svcapAt(sp,q,0,.45))[2],draw:k=>E('path',{d:svSpl(out),fill:svcapTone(col,I,{shade:shd(col,-.6),lite:mix(col,'#eef4d8',.6)},Lg),stroke:shd(col,-.55),'stroke-width':svF(Math.max(.2,q.Rh*.004)),'stroke-opacity':P.inv.edge},k)}}
/* the receptacle under the head: a flattened cup narrowing into the neck */
function svcapRecep(B,O,R0,P,m,gs,dry){const r=P.recep.r*R0*gs,dep=P.recep.dep*R0*gs,nk=P.recep.neck*R0,pts=[];
  for(let j=0;j<16;j++){const a=j/16*6.283;for(const[rr,z]of[[r,-.01*R0],[r*.8,-dep*.45],[nk*1.05,-dep]])pts.push(PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]))}
  const n=toV(B,[0,0,-1]),I=svcapI(V3.nz([n[0]*.5,n[1]*.5+.3,Math.abs(n[2])*.5+.4]),P.light),col=mix(m.recep,m.dry,dry);
  return{key:PJ(B,O,[0,0,-dep*.5])[2],draw:k=>E('path',{d:smooth(hull2(pts.map(p=>[p[0],p[1]]))),fill:svcapTone(col,I,{shade:shd(col,-.6),lite:mix(col,'#e8f0d0',.5)},P.light),stroke:shd(col,-.5),'stroke-width':svF(Math.max(.25,R0*.005)),'stroke-opacity':.5},k)}}
/* the heart: crown of trans florets round the disc of florets and its ring of pollen */
function svcapHeart(k,c){const{B,O,R0,P,m,o2,dry,rot,hi,gs}=c,H=P.heart,rh=H.r*R0*gs,rd=H.disc*R0*gs,hz=H.h*R0+H.dry*R0*dry,mat=svSm((o2-.55)/.4);
  const dsc=mix(m.disc,m.dry,dry*.8),hrt=mix(m.heart,m.dry,dry*.6),cr=mix(m.crown,m.dry,dry),crT=mix(m.crownTip,m.dry,dry);
  /* the floor of the crown, then the disc as a low dome (a cone when dry) */
  const ring=(r,z,n=18)=>{const R=[];for(let j=0;j<n;j++){const a=j/n*6.283;R.push(PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z]))}return R};
  E('path',{d:svSpl(ring(rh*.98,.004*R0)),fill:shd(cr,-.55),stroke:'none'},k);
  const dome=[];for(let i=0;i<=4;i++){const u=i/4;for(const p of ring(rd*Math.sin(u*Math.PI/2),hz*Math.cos(u*Math.PI/2)*(dry>.3?1-.5*u:1)+.006*R0,14))dome.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(dome)),fill:dsc,stroke:'none'},k);
  /* the disc florets on the golden angle: their light and their shadows (two paths of dots) */
  const nd=Math.round(H.dots[hi?1:0]*(.4+.6*mat)),rr=Math.max(.32,R0*.011);let dl='',dd='';const Ls=[LIGHT[0],-LIGHT[1]];
  for(let i=0;i<nd;i++){const q=Math.sqrt((i+.5)/nd),a=i*2.39996+rot,x=Math.cos(a)*q*rd*.94,y=Math.sin(a)*q*rd*.94,z=hz*Math.sqrt(Math.max(0,1-q*q))*(dry>.3?1:1)+.008*R0,p=PJ(B,O,[x,y,z]),s=rr*(.7+.5*q);
    if(toV(B,[x/rd*.6,y/rd*.6,1])[2]<.02)continue;dl+=`M${svN(p[0]-Ls[0]*s*.35)} ${svN(p[1]-Ls[1]*s*.35)}h0`;dd+=`M${svN(p[0]+Ls[0]*s*.3)} ${svN(p[1]+Ls[1]*s*.3)}h0`}
  if(dd)E('path',{d:dd,stroke:mix(m.discLo,m.dry,dry*.5),'stroke-width':svF(rr*1.7),'stroke-linecap':'round',fill:'none','stroke-opacity':.75},k);
  if(dl)E('path',{d:dl,stroke:mix(m.discHi,m.dry,dry*.5),'stroke-width':svF(rr*1.15),'stroke-linecap':'round',fill:'none','stroke-opacity':.85},k);
  /* the ring of pollen on the ripe florets between the disc and the crown */
  if(mat>.05&&dry<.5){let dp='';const np=Math.round(H.crownN*(hi?1.6:1.1)),pr=Math.max(.35,R0*.012);for(let i=0;i<np;i++){const a=i*2.39996*7+rot+.3,q=H.pol[0]+(H.pol[1]-H.pol[0])*pxHashS(i,3,c.sd),r=rd+(rh*.8-rd)*q,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,.012*R0]);if(pxHashS(i,5,c.sd)<.25+.65*mat)dp+=`M${svN(p[0])} ${svN(p[1])}h0`}
    if(dp)E('path',{d:dp,stroke:m.pollen,'stroke-width':svF(pr*1.6),'stroke-linecap':'round',fill:'none',opacity:.92},k)}
  /* the crown: short trans florets standing out of the ring (relative strokes, drawn twice: dark under, colour over), forked tips (styles) in close-ups */
  const nc=Math.round(H.crownN*(hi?1:.75)),cw=Math.max(.45,H.crownW*R0),nrw=hi?H.crownRows:Math.min(2,H.crownRows);let db='',dt='';
  for(let row=0;row<nrw;row++)for(let j=0;j<nc;j++){const a=rot+(j+(row%2?.5:0))/nc*6.283+(pxHashS(j,row,c.sd)-.5)*.08,ca=Math.cos(a),sa=Math.sin(a),fr=nrw>1?row/(nrw-1):0,r0=rd+(rh-rd)*(.62-.42*fr)*(.9+.2*pxHashS(j,row+7,c.sd)),
      A=H.crownA*(.45+.55*o2)+(fr-.5)*-.3+.9*dry,L=H.crownL*R0*(1-.25*fr)*(.85+.3*pxHashS(j,row+11,c.sd))*(.5+.5*o2)*(1-.3*dry),
      b=PJ(B,O,[ca*r0,sa*r0,.004*R0]),e=PJ(B,O,[ca*(r0+L*Math.sin(A)),sa*(r0+L*Math.sin(A)),.004*R0+L*Math.cos(A)]),bx=svR(b[0]),by=svR(b[1]);
    db+='M'+svJ([bx,by])+'l'+svJ([svR(e[0])-bx,svR(e[1])-by]);
    if(hi&&mat>.2&&dry<.4){const fx=(e[0]-b[0])*.22,fy=(e[1]-b[1])*.22;dt+='M'+svJ([svR(e[0]-fy*.5),svR(e[1]+fx*.5)])+'l'+svJ([fx+fy*.5,fy-fx*.5])+'M'+svJ([svR(e[0]+fy*.5),svR(e[1]-fx*.5)])+'l'+svJ([fx-fy*.5,fy+fx*.5])}}
  const id='svcap'+(gid++),g1=G(k,{stroke:shd(cr,-.5),'stroke-width':svF(cw*1.5),'stroke-linecap':'round',fill:'none'});E('path',{id,d:db},g1);
  E('use',{href:'#'+id,stroke:cr,'stroke-width':svF(cw)},k);
  if(dt)E('path',{d:dt,stroke:crT,'stroke-width':svF(Math.max(.3,cw*.45)),'stroke-linecap':'round',fill:'none'},k)}
/* where a ray lies against the disc: 1 it passes over it (somewhere in front of the disc's plane where they overlap), -1 under, 0 apart */
function svcapOver(B,O,spine,rh,zh){const C=PJ(B,O,[0,0,zh]),ex=[B[0][0],-B[0][1]],ey=[B[1][0],-B[1][1]],det=ex[0]*ey[1]-ex[1]*ey[0];if(Math.abs(det)<.06)return 0;let res=0;
  for(const p of spine){const dx=p[0]-C[0],dy=p[1]-C[1],x=(dx*ey[1]-dy*ey[0])/det,y=(ex[0]*dy-ex[1]*dx)/det;if(x*x+y*y>rh*rh)continue;const z=PJ(B,O,[x,y,zh])[2];if(p[2]>z+1e-6)return 1;res=-1}return res}
/* the head */
function svcapDraw(par,B,O,D,S,cwx,op,seed,wl,o={}){const P=S._m||(S._m=Object.assign({},SVCAP_DEF,S,{light:Object.assign({},SVCAP_DEF.light,S.light||{}),heart:Object.assign({},SVCAP_DEF.heart,S.heart||{}),inv:Object.assign({},SVCAP_DEF.inv,S.inv||{}),recep:Object.assign({},SVCAP_DEF.recep,S.recep||{})}));
  const k0=G(par),R0=D/2,hi=DET>=1.5,r=svRng(seed),m=(P._mc||(P._mc={}))[cwx.id]||(P._mc[cwx.id]=(P.mat||svcapMat)(cwx));wl=wl||0;
  const o2=svSm((op-P.open[0])/P.open[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]),
    gs=P.grow[0]+(1-P.grow[0])*svSm(op/P.grow[1]),dry=svSm((wl-.7)/.3);
  /* the head tips over as it fades (toward the ground, in view space) */
  let tipA=0;for(const[kk,a,b]of P.tip)tipA+=kk*svSm((wl-a)/b);if(tipA>0){const ax=V3.cr(B[2],[0,-1,0]),l=Math.hypot(ax[0],ax[1],ax[2]);if(l>.05){const K=V3.sc(ax,1/l),rot=v=>{const c=Math.cos(tipA),s=Math.sin(tipA),d=V3.dot(K,v),x=V3.cr(K,v);return V3.nz([v[0]*c+x[0]*s+K[0]*d*(1-c),v[1]*c+x[1]*s+K[1]*d*(1-c),v[2]*c+x[2]*s+K[2]*d*(1-c)])};B=[rot(B[0]),rot(B[1]),rot(B[2])]}}
  const k=G(k0,{stroke:m.ink,'stroke-width':svF(Math.max(.22,R0*.0055)),'stroke-opacity':P.edge,'stroke-linejoin':'round'}),nz=B[2][2],sg=nz>=0?1:-1,rot=r()*6.283,dh=r.in(-1,1),dl=r.in(-1,1),sd=Math.floor(r()*1e9),items=[];
  /* the individual's tint: the whole head a little warmer or paler */
  const mm=Object.assign({},m);for(const key of['body','base','tip','back'])mm[key]=svShift(m[key],dh*3,0,dl*.025);
  /* the young bud's rays are green from their foot */
  const co=P.col?svSm((op-P.col[0])/P.col[1]):o2;if(co<1){mm.base=mix(mm.base,m.green,(1-co)*.6);mm.body=mix(mm.body,m.green,(1-co)*.25);mm.back=mix(mm.back,m.green,(1-co)*.4)}
  /* the rays, row by row */
  const nR=P.rows;for(let w=0;w<nR;w++){const f=nR>1?w/(nR-1):0,n=Math.max(3,Math.round(svcapT(P.n,f)*(1+P.nJ*r.in(-1,1)))),ow=svSm((o2-f*P.lag)/(1-P.lag)),
      Lr=svcapT(P.L,f),Wr=svcapT(P.W,f),r0=svcapT(P.r0,f)*gs,z0=svcapT(P.z0,f),Lk=(P.budL+(1-P.budL)*svSm((op-P.budE[0])/P.budE[1]))*(1-P.wL*fan),ph0=rot+(w%2?P.stag:0)*6.283/n+w*.37;
    const a0=svcapT(P.a0c,f)+(svcapT(P.a0o,f)-svcapT(P.a0c,f))*ow+P.wA0[0]*dec*(1-.4*f)+P.wA0[1]*fan,a1=svcapT(P.a1c,f)+(svcapT(P.a1o,f)-svcapT(P.a1c,f))*ow+P.wA1[0]*dec*(1-.3*f)+P.wA1[1]*fan,
      hg=fan*svSm((-B[2][1]-.15)/.6),a0h=a0+(P.wHang[0]-a0)*hg,a1h=a1+(P.wHang[1]-a1)*hg;
    const rowIt=[],rip=r()*6.283;
    const GV=[-B[0][1],-B[1][1],-B[2][1]];
    for(let i=0;i<n;i++){const g={dL:r.in(-1,1),dW:r.in(-1,1),da0:r.in(-1,1),da1:r.in(-1,1),ph:r.in(-1,1),tw:r.in(-1,1),cu:r.in(-1,1),h:r(),bd:r.in(-1,1)},u=r(),u2=r(),tH=r.in(-1,1);
      if(g.h<shed*(1.05-.35*f))continue;
      /* this ray's character: lifted, dropped and curled, or folded and twisted (a few of each) */
      const lift=u<P.jLift[0]?1-u/P.jLift[0]*.5:0,drop=u>1-P.jDrop[0]?1-(1-u)/P.jDrop[0]*.5:0,fold=u2<P.jFold[0]?1:0,phi=ph0+i/n*6.283+g.ph*P.jPh;
      const wv=P.wVar,vd=wv?g.cu*.6+tH*.4:0,lf=wv?svSm((vd-.2)/.6)*(1-.7*Math.min(1,hg)):0,ro=wv?svSm((-vd-.1)/.7)*(1-.5*Math.min(1,hg)):0,fq=fan*(1-(wv?wv[0]:0)*lf),sh=fq-fan;/* each ray its own fall: some still lifted, some limp, some rolled (121, 70) */
      const brown=svSm((fan-P.wBrown[0]*(1-g.h*.3))/P.wBrown[1]),mr=brown>0?(P.wTone?svcapWiltMat(mm,P.wTone,brown,g.h):Object.assign({},mm,{tip:mix(mm.tip,m.dry,brown*.75),body:mix(mm.body,m.dry,brown*.3)})):mm,
        q={phi,bend:P.jBend*g.bd,r0:r0*R0,z0:z0*R0,L:Lr*R0*Lk*(1+P.jL*g.dL+P.jRip*Math.sin(2*phi+rip)),W:Wr*R0*(1+P.jW*g.dW)*(1-P.wW*fan)*(.7+.3*Lk),R0:1,
          a0:a0h+sh*P.wA0[1]+P.jA*g.da0+(lift*P.jLift[1]*.35+drop*P.jDrop[1]*.3)*ow,a1:a1h+sh*P.wA1[1]+P.jA*g.da1*1.4+(lift*P.jLift[1]+drop*P.jDrop[1])*ow,aPow:P.aPow,
          curl:(P.curl+P.jCurl*g.cu+drop*.35*ow+P.wCurl[0]*dec+P.wCurl[1]*fq+(wv?wv[1]*fq*ro:0)),wav:P.wav*(1+dec)+P.wWav*fq,gv:P.wGrav>0&&fq>0?V3.sc(GV,P.wGrav*fq*(.8+.4*g.h)):null,wph:g.ph*9,
          tw:P.tw*(g.tw>0?1:-1)+P.jTw*g.tw+dec*.4*g.tw+fold*P.jFold[1]*(g.tw>0?1:-1)*ow,
          claw:P.claw,vb:P.vb,taper:P.taper,tipE:P.tipE,tipH:P.tipH*(1+P.jTip*tH),teeth:P.teeth,fork:P.fork,m:mr,aoK:f*.5,wk:fold*.08,Rh:R0,hi,f};
      q.vt=1-q.tipH*svcapW(q,.95)/q.L;q.vt=Math.max(.6,Math.min(.97,q.vt));
      const roll=Math.min(2.9,(P.quill+P.wQuill[0]*dec+P.wQuill[1]*fq+(wv?wv[2]*fq*ro:0))*2.9);q.kap=roll/(q.W/2);q.cupK=P.cup*(1+2.5*fold)*(1-.6*fan)/(q.W/2);
      /* in units: svcapAt takes s in R0 units x q.R0 (1 here: s is absolute) */
      const it=svcapRay(B,O,q,mm,P,hi);it.key+=sg*f*.03*R0;it.kind='ray';items.push(it);rowIt.push(it)}
    /* the shadow this row casts on the outer one (one path a row, laid just under its rays; seen from the face only) */
    const RS=P.rowSh;if(w>0&&RS&&RS[2]>0&&nz>.2&&ow>.3&&rowIt.length){const ox=-LIGHT[0]*RS[0]*R0,oy=LIGHT[1]*RS[0]*R0*nz;let d='',kmin=1e9;
      for(const it of rowIt){d+=svcapLn(it.shadow(RS[2]).map(p=>[p[0]+ox,p[1]+oy]));kmin=Math.min(kmin,it.key)}
      const so=RS[1]*svSm((ow-.3)/.5)*(1-.6*fan);items.push({key:kmin-1e-4*R0,kind:'sh',draw:kk=>E('path',{d,fill:m.shade,'fill-opacity':svF(so),stroke:'none'},kk)})}}
  /* the involucre and the receptacle (behind the rays seen from the face) */
  const hgI=fan*svSm((-B[2][1]-.15)/.6),IV=P.inv,ob=svSm((op-IV.ob[0])/IV.ob[1]),ob1=svSm((op-IV.obU[0])/IV.obU[1]),a0u=IV.a0u??IV.a0c,a1u=IV.a1u??IV.a1c,a0b=IV.a0c+(a0u-IV.a0c)*ob1,a1b=IV.a1c+(a1u-IV.a1c)*ob1;
  if(nz<.62||o2<.4){items.push(Object.assign(svcapRecep(B,O,R0,P,m,gs,dry),{kind:'back'}));
    for(let w=0;w<IV.rows;w++){const n=Math.round(IV.n[w]*(hi?1:.8)),col=mix(w?m.bract:shd(m.bract,-.15),m.dry,dry*.8);for(let i=0;i<n;i++){const ph=rot+(i+w*.5)/n*6.283+r.in(-.08,.08),dL=r.in(.9,1.1),dt=r.in(-.2,.2);
      const q={phi:ph,r0:IV.r0*R0*gs*(1-.1*w),z0:IV.z0*R0*(1+w*.8),L:IV.L[w]*R0*gs*dL*(1+IV.bud*(1-(IV.budS?svSm((op-IV.budS[0])/IV.budS[1]):o2))*(1-w*.3)),W:IV.W[w]*R0*gs*(1+IV.budW*(1-ob)),R0:1,a0:a0b+(IV.a0o-a0b)*ob+w*.25*ob+IV.wA[0]*fan*(1-hgI),a1:a1b+(IV.a1o-a1b)*ob+w*.2*ob+IV.wA[1]*fan*(1-hgI),aPow:1,Rh:R0,curl:0,wav:0,wph:0,tw:dt,kap:0,cupK:.6/(IV.W[w]*R0)};
      /* a head hanging face down: its bracts lie pressed along the cup and the neck (70), not spread */
      if(IV.wHang&&hgI>0){q.a0+=(IV.wHang[0]-q.a0)*hgI;q.a1+=(IV.wHang[1]-q.a1)*hgI;q.L*=1-.4*hgI;q.W*=1+.9*hgI;q.r0*=1-.15*hgI}
      const bt=svcapBract(B,O,q,P,col);bt.key+=(1-ob)*.08*R0;items.push(Object.assign(bt,{kind:'back'}))}}}
  /* heart.wall (rows' feet rising on a domed receptacle, the pompon): a backdrop under all the rays, the dome from the crown's floor out to
     the rows' feet from heart.wall on, so that the rays' parting (as they go limp) never opens onto the background; off by default */
  if(P.heart.wall&&nz>.2){const W=[],ring=(rr,z)=>{for(let j=0;j<18;j++){const a=j/18*6.283,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]);W.push([p[0],p[1]])}};
    for(const f of[P.heart.wall,1])ring(svcapT(P.r0,f)*gs*R0,svcapT(P.z0,f)*R0);ring(P.heart.r*R0*gs*.98,.004*R0);
    const wc=mix(shd(mix(m.base,m.crown,.5),-.4),m.dry,dry*.8);items.push({key:-1e9,kind:'back',draw:kk=>E('path',{d:smooth(hull2(W)),fill:wc,stroke:'none'},kk)})}
  /* the order: by depth; the heart between the rays under it and those over it */
  items.sort((a,b)=>a.key-b.key);const showH=o2>.18&&nz>-.12,H=P.heart,rh=H.r*R0*gs,zh=H.h*R0*.5;let seq=items;
  if(showH){const fl=items.map(it=>it.kind==='ray'&&nz>.05?svcapOver(B,O,it.spine,rh,zh):it.kind==='back'&&nz>0?-1:0);let last=-1;fl.forEach((v,i)=>{if(v<0)last=i});
    const hk={draw:kk=>svcapHeart(kk,{B,O,R0,P,m,o2,dry,rot,hi,gs,sd})};
    if(nz<=.05){const zc=PJ(B,O,[0,0,zh])[2];let at=items.findIndex(it=>it.key>zc);if(at<0)at=items.length;seq=items.slice(0,at).concat([hk],items.slice(at))}
    else{const before=[],after=[];items.forEach((it,i)=>{if(i<=last&&fl[i]<=0)before.push(it);else if(i<=last)after.push(it);else after.push(it)});seq=before.concat([hk],after)}}
  for(const it of seq)it.draw(k);return k0}
