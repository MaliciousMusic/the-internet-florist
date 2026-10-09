/* ================= y3-grappe.js : les grappes (racemes of small florets), a kit for every species that carries one =================
   A raceme is drawn in one call, grDraw(par,B,O,D,S,cwx,op,seed,wl,o): in the frame B at O (the axis along B[2]; O its middle, or its foot with
   o.foot), D its length in full bloom, colourway cwx, opening op (0 buds .. 1 full bloom), wilted wl (0 fresh .. 1 dry). S is the species' sheet
   (its fiche, in y-<genre>.js): {genes, mat, wilt, dry, stem, lay, law, fl, layout:'name', floret:'name', budget, lit, ao}. Nothing species-bound lives here.
   The material m=S.mat(cw) may carry its own fl (floret), lay (layout) and dry / dryTint (dried tissue) for one colourway, merged over the sheet's,
   and stem (the axis' [shade, body, light], over S.stem: a dark hyacinth's maroon rachis).
   1. Layouts, GR_LAYOUT[name](S,g,H,st) -> {fl:[...], ax:{z0,z1,r0,r1}}: where each floret is, in the head's frame (z up the axis from its foot):
      pos (its insertion), dir (its axis, unit), side (unit, across it), q (0 at the foot .. 1 at the top), L (its length), o and w (its opening and
      wilting, from grLaw), gt (its own genes), ster (sterile), pc (its pedicel, three points: the kit draws it). g: the head's genes (svGenes on
      S.genes: g.n florets, g.tep[i] each, head keys); H the axis length; st={op,wl}. Done: 'dresse' (an upright raceme: hyacinth, grape hyacinth;
      its options: lay.sterile {part, L, th [bud, open], wd, ped}: the top florets never open, smaller, standing up, fading late; lay.pedTh: the
      pedicel leaves the axis at this angle at most, then bends to its floret (an urn hanging from an arched pedicel), lay.pedW its width x L,
      lay.pedq how much shorter it is at the top, lay.pedO how much shorter on a bud (it lengthens as its floret opens);
      lay.thMax: the steepest a floret hangs; lay.thg: the buds spread as they grow (a narrow cone young, a broad one half open); lay.hw: the axis lengthens as it fades). Done also: 'unilateral' (the one-sided spike of the freesia, S.lay in its comment; it hands
      each floret ap, its point on the axis, and the kit ax.path, a curved axis drawn as a lit ribbon, and ax.mid, the spike's centre). Done also:
      'panicule' (lilac: a conical thyrse of opposite decussate branches, each fanning rounded cymes of florets over the envelope;
      it hands the kit ax.cl (cymes drawn whole over their blob), ax.br (branch stalks), ax.core with ax.coreV, ax.coreR, ax.coreG (the dark body
      inside: its ramp value, its ramp in bud, its share of the buds' green); its options in its comment, above GR_LAYOUT.panicule). Also in the
      kit for it: S.slabs (primitives painted slab by slab of depth, layer by layer, grouped by paint), S.cost[0] (the cost of the min level),
      o.bk (grDraw's option: the budget scaled, for a smaller twin). Done also: 'pendante' (wisteria: an axis hanging under gravity, S.lay.hang,
      st.down or S.lay.down the ground in the head's frame; florets nodding all round it on arched pedicels, opening from its foot down to its tip;
      ax.path, ax.mid and a lumpy core, ax.core with ax.coreB; S.lay in its comment, above GR_LAYOUT.pendante).
      Example: GR_LAYOUT.unilateral=(S,g,H,st)=>{const fl=[];for(let i=0;i<g.n;i++){const gt=g.tep[i],q=i/(g.n-1),...;
        fl.push(Object.assign({i,q,pos,dir,side,L,gt},grLaw(S.law,grRank(S.law,q),st,gt.dt)))}return{fl,ax:{z0:0,z1:H,r0,r1}}}
   2. The stage law, grLaw(law,rank,st,dt) -> {o,w}: a floret opens as op passes law.t0+law.spread*rank, over law.w (rank: its place in the order of
      opening, 0 first .. 1 last; law.order 'acro' foot first, 'basi' top first, or a function f=>rank: lilac and wisteria give theirs from their
      photographs); the oldest fade first (law.ws: how far wilting runs ahead of the younger; law.wa: how late the first one starts); law.late: the buds that go on opening in the vase.
   3. Florets, GR_FLORET[name](c,f,lod): one floret as a few primitives c.put({d,f,s,sw,so,fo}) (path data; fill; stroke, its width; opacities),
      far to near; consecutive primitives with the same paint merge into one path. The context c: c.V(p) a point of the floret's frame (x,y across,
      z along its axis from its foot) in view space, c.Vd(v) a direction; c.d2(P) a closed outline, c.l2(P) an open line (view points); c.lit(n)
      the light (0..1) on a view normal at this floret; c.col(v,f,ramp) the colour lit at v from the colourway's ramp ('fr' front, 'bk' back, 'bud',
      'grn') at the floret's wilt, c.wc(colour,f) a fixed colour at that wilt; c.m the material, c.P = S.fl (with the colourway's m.fl), c.down
      the ground in the floret's frame, c.eye the eye there; c.det at zoom (DET 1.5); c.o the options of grDraw. lod: 2 full
      (6 to 10 elements), 1 mid (2 or 3), 0 min (one outline). Done: 'clochette' (a bell, six lobes curled back: hyacinth); 'urne' (grape hyacinth:
      a closed urn, its mouth a ring of pale teeth, the bud a rounder egg, the sterile florets buds of the 'tip' ramp; S.fl in its comment). Its
      outline comes from grRevO(c,Lz,rf,T,k,off): the outline of any body of revolution along a floret's axis (concave necks kept), for the next
      tubular florets. Done also: 'entonnoir' (freesia: a funnel from a narrow tube, six unequal lobes, a coloured throat, stamens and a
      three-branched style, a club-shaped bud, a pair of bracts at every floret's foot; S.fl {tube, flare, lip, ...} in its comment). Done also:
      'etoile' (lilac: a slender tube, four spreading ovate lobes in cubic outlines, hooded tips, the dark eye, a double's extra whorls (wh), the
      bud a club (grClub), the cyme's blob (GR_FLORET.etoile.grp); S.fl in its comment, above GR_FLORET.etoile; for the shop's budget: q1 (out of
      zoom, outlines of small florets rounded at whole units), dot (the eye a dot, anthers too small left out), tubeDry (dried tubes shrink, then
      hide)). Outlines of cubics: grCub(S0,segs,q); ellipses as two arcs: grEll. Done also: 'papillon' (wisteria: the calyx, a notched banner
      bent back with its eye and its halves lit apart, two wings round the keel; the bud a pointed pod, grPeaBud; fallen, the calyx and a stub of
      style; S.fl {std, wing, keel, eye, cal, shed, fold, ...} in its comment, above GR_FLORET.papillon).
      Example: GR_FLORET.etoile=(c,f,lod)=>{const P=c.P,O=[];for(...)O.push(c.V([x,y,z]));c.put({d:c.d2(O),f:c.col(c.lit(n),f,'fr')});if(lod>1)...}
   4. The level of detail: every floret gets one, from its place: facing the eye, in front of the axis, large, open. The budget S.budget [at DET 1,
      at DET 1.5] (elements for the raceme; the shop allows about 300 per stem with its leaves, 50 KB) is spent from the best placed down: full,
      else mid, else min; florets hidden behind the axis stay min; LOD (the shop's low detail) makes every floret min. Costs: S.cost {2:[open,bud],
      1:[...]}. Behind the florets in front lies a dark core (the shadow inside the raceme), so the gaps read as depth.
   Plugging a species: a sheet and one line, SV_HEAD[sid]=(par,B,O,D,cw,op,seed,wl)=>grDraw(par,B,O,D,MY_S,cwOf(cw),op,seed,wl). Its genes come from
   svGenes(seed,S.genes) on a private seed (svSeed), never from the bouquet's chance. Each floret fades at its own w: S.wilt(c,w) (the species'
   colour of decline), then S.dry (from w S.dryW[0] over S.dryW[1], default [.42, .4]) (the ramp of the dried tissue, tinted by S.dryTint of the colourway; m.dry, m.dryTint for one colourway); the
   bouquet's WILT is set aside while the raceme is drawn. The second sheet of the kit: the grape hyacinth (y-muscari.js). */
const GR_LAYOUT={},GR_FLORET={};
/* the rank of a floret in the order of opening (0 first .. 1 last) */
function grRank(L,q,f){return typeof L.order==='function'?L.order(f||{q}):L.order==='basi'?1-q:q}
/* the stage law: its opening o (0 bud .. 1 open) and wilting w (0 fresh .. 1 dry) */
/* the bouquet's one stage for every head (LIFE_ALL, z1.js): 'fane' leaves no bud green (budW's lag is lifted, every floret at least at the bouquet's wilt) */
const grLifeAll=()=>typeof LIFE_ALL!=='undefined'?LIFE_ALL:null;
function grLaw(L,rank,st,dt){dt=dt||0;const opE=Math.min(1.2,st.op+(L.late||0)*st.wl),t=L.t0+L.spread*rank+dt;
  const r={o:svSm((opE-t)/L.w+.5),w:Math.max(0,Math.min(1,st.wl*(1+L.ws)-L.ws*rank+dt*.5-(L.wa||0)))};
  /* (LIFE_ALL 'fane') no floret is spared, not even the tip's buds */
  if(st.wl>0&&grLifeAll()==='fane')r.w=Math.max(r.w,Math.min(1,st.wl));return r}
/* ---------- the upright raceme (hyacinth): florets in a spiral (the head's divergence), crowded and smaller toward the top, standing close to the axis
   as buds, then spreading as they open, the lower ones nodding; a wilted floret hangs. S.lay: z [first, last insertion] (x H), dense (internodes
   shortening upward), L (floret length x H), taper (smaller toward the top), th [bud, open] (angle from the axis; thq: the buds at the foot
   spread more, so the buds make one cone down to the foot), nod (the lower ones, more, once the raceme has matured: nodAt),
   droop (wilted), rr (the axis' radius x H), ped (the pedicel x L), h [bud, + open, from op, over] (the axis' length x D: it lengthens as it opens, late);
   the options sterile, pedTh, pedW, thMax, hw: see the header ---------- */
GR_LAYOUT.dresse=(S,g,H,st)=>{const P=S.lay,n=g.n,fl=[],D2=Math.PI/180,SP=P.sterile,ns=SP?Math.max(1,Math.round(n*SP.part)):0;
  for(let i=0;i<n;i++){const gt=g.tep[i],q=n>1?i/(n-1):0,zq=(q-P.dense*q*q)/(1-P.dense),z=H*(P.z[0]+(P.z[1]-P.z[0])*zq),phi=g.phi0+i*g.div*D2+gt.dphi,
      lw=grLaw(S.law,grRank(S.law,q),st,gt.dt),rad=[Math.cos(phi),Math.sin(phi),0],side=[-Math.sin(phi),Math.cos(phi),0],ster=i>=n-ns;
    /* a sterile floret (the top tuft): never opens, fades late, stands up (more so toward the top) */
    if(ster){lw.o=SP.o||0;lw.w*=1-(SP.wd||0)}
    const thB=P.th[0]+(P.thq||0)*(1-q)+(P.thg?P.thg*svSm(st.op/.45+.3-.5*q):0),Hf=st.Hf||H,r=Hf*P.rr*(1-.45*q);
    let th=ster?(SP.th[0]+(SP.th[1]-SP.th[0])*svSm(st.op/.8))*(1-.6*(i-(n-ns))/Math.max(1,ns-1))+gt.dth*.5+P.droop*.5*svSm((lw.w-.25)/.5)
      :thB+(P.th[1]-thB)*svSm((lw.o-.1)/.6)+P.nod*lw.o*(1-q)*svSm((st.op-(P.nodAt||0))/.35)+P.droop*svSm((lw.w-.25)/.5)+gt.dth;
    if(P.thMax!=null)th=Math.min(th,P.thMax);
    const L=Hf*P.L*(1-P.taper*q)*gt.dL*(ster?SP.L:1),dir=[rad[0]*Math.sin(th),rad[1]*Math.sin(th),Math.cos(th)],pd=L*(ster&&SP.ped!=null?SP.ped:P.ped||0)*(P.pedq?1-P.pedq*q:1)*(P.pedO?1-P.pedO*(1-lw.o):1);
    /* the pedicel: straight along the floret (hyacinth), or leaving the axis at pedTh at most and bending to the floret's own direction */
    let pos,pc=null;if(P.pedTh!=null&&pd>0){const tp=Math.min(th,P.pedTh),d0=[rad[0]*Math.sin(tp),rad[1]*Math.sin(tp),Math.cos(tp)],p0=[rad[0]*r,rad[1]*r,z],
        c1=V3.add(p0,V3.sc(d0,pd*.55));pos=V3.add(c1,V3.sc(V3.nz(V3.add(V3.sc(d0,.35),V3.sc(dir,.65))),pd*.5));pc=[p0,c1,pos]}
    else pos=[rad[0]*r+dir[0]*pd,rad[1]*r+dir[1]*pd,z+dir[2]*pd];
    fl.push(Object.assign({i,q,gt,phi,rad,side,pos,dir,L,gr:svSm(st.op/.45+.3-.5*q),ster,pc},lw))}
  return{fl,ax:{z0:0,z1:H*Math.min(1,P.z[1]+.04),r0:(st.Hf||H)*P.rr,r1:(st.Hf||H)*P.rr*.45}}};
/* ---------- the one-sided spike (freesia): a wiry axis leaving the scape (z, at the head's foot) and turning through lay.bend toward +x over the
   first lay.arc of its length, then running on, curving down by lay.curve and its tip rising by lay.tipUp; along its upper (outer) side the florets
   alternate in two ranks, lay.ranks (rad) either side, the oldest at the elbow, the internodes shortening toward the tip (lay.gap: 0 even .. <1),
   smaller toward the tip (taper). A floret leans toward the tip at th [bud at the tip, bud at the elbow, open] from the axis; wilted it flops
   forward and down (hang) and the axis sags (droop). S.lay: h (as dresse), bend, arc, curve, tipUp, z [first, last floret] (along the axis, x H), gap,
   L (x H), taper, th [bud at the tip, bud at the elbow, open] (thp: the buds' angle eases from the elbow's to the tip's as q^thp; back: how far past the upright a floret may lean back
   toward the scape, near the elbow where the axis still turns), ranks, rr [foot, tip] (the axis' radius x H), hang, droop, nb (a floret's foot out of the axis, x its radius), grow (a bud's
   size from how near its opening is, over this much of op: the tip's buds stay small), budW (an unopened bud's wilt lags by this share: it stays green). Each floret
   gets ap (its point on the axis); X across the spike, Y toward the tip and down (its dorsal side is -Y). ax.path: the axis as [[point, radius]];
   ax.mid: the spike's centre (where O lies without o.foot) ---------- */
GR_LAYOUT.unilateral=(S,g,H,st)=>{const P=S.lay,n=g.n,fl=[],Hf=st.Hf||H,ns=24,sag=(P.droop||0)*svSm((st.wl-.2)/.7),
    th0=s=>{const u=Math.max(0,(s-P.arc)/(1-P.arc));return P.bend*svSm(s/P.arc)+(P.curve||0)*u-(P.tipUp||0)*u*u+sag*s},pts=[[0,0,0]],T=[],A=[];
  for(let i=0;i<=ns;i++){const t=th0(i/ns);A.push(t);T.push([Math.sin(t),0,Math.cos(t)]);if(i)pts.push(V3.add(pts[i-1],V3.sc(V3.add(T[i-1],T[i]),H/(2*ns))))}
  const at=s=>{const x=Math.max(0,Math.min(1,s))*ns,i=Math.min(ns-1,Math.floor(x)),k=x-i,t=A[i]+(A[i+1]-A[i])*k;return[V3.add(pts[i],V3.sc(V3s(pts[i+1],pts[i]),k)),[Math.sin(t),0,Math.cos(t)],[-Math.cos(t),0,Math.sin(t)]]},
    rad=s=>Hf*(P.rr[0]+(P.rr[1]-P.rr[0])*s);
  for(let i=0;i<n;i++){const gt=g.tep[i],q=n>1?i/(n-1):0,s=P.z[0]+(P.z[1]-P.z[0])*(q*(1+P.gap)-P.gap*q*q),[p,Tg,N]=at(s),ps=(i%2?1:-1)*P.ranks+(gt.dpsi||0),
      Nr=V3.add(V3.sc(N,Math.cos(ps)),[0,Math.sin(ps),0]),lw=grLaw(S.law,grRank(S.law,q),st,gt.dt),bw0=P.budW&&grLifeAll()!=='fane'?lw.w*=1-P.budW*(1-svSm(lw.o/((S.fl&&S.fl.budAt)||.2))):0,thB=P.th[1]+(P.th[0]-P.th[1])*Math.pow(q,P.thp||1),
      th=thB+(P.th[2]-thB)*svSm((lw.o-.1)/.6)+(gt.dth||0)-(P.hang||0)*(1+2*(gt.dth||0))*svSm((lw.w-.3)/.5),thc=P.back!=null?Math.min(th,Math.atan2(Tg[0],Tg[2])+P.back):th,dir=V3.nz(V3.add(V3.sc(Tg,Math.cos(thc)),V3.sc(Nr,Math.sin(thc))));
    fl.push(Object.assign({i,q,gt,rad:Nr,side:V3.nz(V3.cr(Tg,Nr)),pos:V3.add(p,V3.sc(Nr,rad(s)*(P.nb??.8))),dir,L:Hf*P.L*(1-P.taper*q)*(gt.dL||1),ap:p,
      gr:P.grow?svSm(1-(S.law.t0+S.law.spread*grRank(S.law,q)+(gt.dt||0)-Math.min(1.2,st.op+(S.law.late||0)*st.wl))/P.grow):svSm((st.op+.3-.9*q)/.6),ster:false,pc:null},lw))}
  /* the axis runs a little past the last floret, thinning */
  const path=[],s1=Math.min(1,P.z[1]+.05);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
  for(let i=0;i<=12;i++){const s=s1*i/12,p=at(s)[0];path.push([p,rad(s)*(1-.5*i/12)]);x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[2]);z1=Math.max(z1,p[2])}
  return{fl,ax:{z0:0,z1:H,r0:rad(0),r1:rad(1),path,mid:[(x0+x1)/2,0,(z0+z1)/2+Hf*P.L*.3]}}};
/* a curved axis (a layout's ax.path, [[point in the head's frame, radius], ...] from the foot): a ribbon along it, its sheen on the lit side */
function grPath(prims,path,hv,sc,stc,wl){const wc=x=>wl>0?lifeCol(x,wl*.6):x,V=path.map(q=>hv(q[0])),n=V.length,Lf=[],Rg=[],Q=[],m=n>>1,
    nm=i=>{const a=V[Math.max(0,i-1)],b=V[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],l=Math.hypot(tx,ty)||1;return[-ty/l,tx/l]},nM=nm(m),lt=nM[0]*LIGHT[0]+nM[1]*LIGHT[1]>0?1:-1;
  for(let i=0;i<n;i++){const[nx,ny]=nm(i),r=path[i][1];Lf.push([V[i][0]+nx*r,V[i][1]+ny*r]);Rg.push([V[i][0]-nx*r,V[i][1]-ny*r]);Q.push([V[i][0]+nx*r*.4*lt,V[i][1]+ny*r*.4*lt])}
  prims.push({d:svSpl(grCCW(Lf.concat(Rg.reverse()).map(sc))),f:wc(stc[1])});
  if(!LOD)prims.push({d:svSpl(Q.slice(0,-2).map(sc),false),s:wc(stc[2]),sw:svF(path[0][1]*.6),so:.7})}
/* the colour ramps of a material: five anchors (shadow, dark, body, light, highlight) read at v (0..1) */
function grRamp(A,v){const x=Math.max(0,Math.min(1,v))*(A.length-1),i=Math.min(A.length-2,Math.floor(x));return mix(A[i],A[i+1],x-i)}
/* compact smooth paths (a quadratic B-spline through the midpoints, four numbers a point, positions rounded at 0.1 and tracked, relative):
   closed (grQ) or open from the first point to the last (grQo) */
function grQ(P){const n=P.length;if(n<3)return'';const md=i=>{const a=P[i%n],b=P[(i+1)%n];return[(a[0]+b[0])/2,(a[1]+b[1])/2]},m0=md(0);let cx=svR(m0[0]),cy=svR(m0[1]),d='M'+svJ([cx,cy]);
  for(let i=1;i<=n;i++){const c=P[i%n],e=md(i),C=[svR(c[0]),svR(c[1])],Ee=[svR(e[0]),svR(e[1])];d+='q'+svJ([C[0]-cx,C[1]-cy,Ee[0]-cx,Ee[1]-cy]);cx=Ee[0];cy=Ee[1]}return d+'z'}
function grQo(P){const n=P.length;if(n<2)return'';let cx=svR(P[0][0]),cy=svR(P[0][1]),d='M'+svJ([cx,cy]);if(n===2)return d+'l'+svJ([svR(P[1][0])-cx,svR(P[1][1])-cy]);
  for(let i=1;i<n-1;i++){const c=P[i],e=i===n-2?P[n-1]:[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2],C=[svR(c[0]),svR(c[1])],Ee=[svR(e[0]),svR(e[1])];d+='q'+svJ([C[0]-cx,C[1]-cy,Ee[0]-cx,Ee[1]-cy]);cx=Ee[0];cy=Ee[1]}return d}
/* a closed screen outline turned counter-clockwise (so many merged into one path never cut holes in one another) */
function grCCW(P){let a=0;for(let i=0,n=P.length;i<n;i++){const p=P[i],q=P[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return a<0?P.slice().reverse():P}
/* ---------- the raceme ---------- */
function grDraw(par,B,O,D,S,cwx,op,seed,wl,o={}){const g=svGenes(seed,S.genes),m=S.mat(cwx);if(m.lay)S=Object.assign({},S,{lay:Object.assign({},S.lay,m.lay)});
  const st={op:Math.max(0,Math.min(1,op+(g.op||0))),wl:wl||0},
    H=D*g.H*(S.lay.h[0]+S.lay.h[1]*svSm((st.op-(S.lay.h[2]||0))/(S.lay.h[3]||.8)))*(S.lay.hw?1+S.lay.hw*svSm(st.wl):1),k=G(par);st.Hf=D*g.H;const W0=typeof WILT!=='undefined'?WILT:null;
  try{if(W0)WILT=null;grRaceme(k,B,O,H,S,m,g,st,o)}finally{if(W0)WILT=W0}return k}
function grRaceme(k,B,O0,H,S,m,g,st,o){const lay=GR_LAYOUT[S.layout](S,g,H,st),fl=lay.fl,ax=lay.ax,eye=[0,0,1],det=DET>=1.5,
    O=o.foot?O0:V3.add(O0,toV(B,ax.mid?V3.sc(ax.mid,-1):[0,0,-H*.42])),hv=p=>{const v=toV(B,p);return[v[0]+O[0],v[1]+O[1],v[2]+O[2]]},sc=v=>[v[0],-v[1]],
    prims=[],CC={},q10=x=>Math.round(x*10)/10,DW=S.dryW||[.42,.4];
  /* colours: a ramp read at v, then the species' decline and the dried tissue at the floret's w, quantized so neighbours share their paint */
  /* (m.qT [from q, to q, steps], optional: the raceme's tone along its length; a ramp with a twin `<ramp>T` (the tip's) is mixed toward it from
     q0 to q1 of the axis, in so many steps (shared paints); materials without qT: unchanged) */
  /* (S.dep, m.bv, optional: a floret's depth tier dk and its banner's variant bv, set below, mix its paint toward the material's deep tone and
     the variant's colour; both in the paint's key, so neighbours of a tier still share it; species without: unchanged) */
  const DP=S.dep,BV=m.bv,deepC=DP?m.deep||grRamp(m.wing||m.fr,.1):null,
    QT=m.qT,colAt=(v,w,ramp,gb,qq,dk,bv)=>{v=q10(v);w=q10(w);gb=q10(gb||0);const rT=QT&&m[ramp+'T'],t=rT?Math.round(svSm(((qq||0)-QT[0])/(QT[1]-QT[0]))*QT[2])/QT[2]:0,
      kd=DP&&dk!=null?DP.k[dk]||0:0,vb=BV&&bv&&(ramp==='fr'||ramp==='bk')?BV[bv-1]:null;
    const key=ramp+v+'|'+w+'|'+gb+(t?'|'+t:'')+(kd?'|d'+dk:'')+(vb?'|b'+bv:'');if(CC[key])return CC[key];
    let c=grRamp(m[ramp]||m.fr,v);if(t)c=mix(c,grRamp(rT,v),t);if(vb)c=mix(c,vb[0],vb[1]);if(kd)c=mix(c,deepC,kd);if(gb>0)c=mix(c,grRamp(m.grn,v),gb);if(w>0){c=S.wilt(c,svSm(w/.55)*.9);const dr=svSm((w-DW[0])/DW[1]);if(dr>0)c=mix(c,mix(grRamp(m.dry||S.dry,v),grRamp(m.fr,v*.6),m.dryTint??S.dryTint??.14),dr)}return CC[key]=c};
  /* a fixed colour of the material (throat, midrib, margin, anthers) at a floret's w */
  const wcol=(c0,w)=>{w=q10(w);if(w<=0)return c0;const key='w'+c0+w;if(CC[key])return CC[key];let c=S.wilt(c0,svSm(w/.55)*.9);const dr=svSm((w-DW[0])/DW[1]);if(dr>0)c=mix(c,grRamp(m.dry||S.dry,h2l(c0)[2]),dr);return CC[key]=c};
  const lam=n=>Math.max(0,(V3.dot(n,LIGHT)+.35)/1.35);
  /* each floret's frame in view space, its place (light on its side of the raceme, how far in front of the axis), its centre's depth */
  const Hl=Math.max(...fl.map(f=>f.L)),Rr=Math.max(H*.12,Hl*.9),G2=S.fl.green;
  /* the buds' green: all over when young (op), and toward the top */
  for(const f of fl)f.gb=G2?Math.max(0,Math.min(1,G2[0]*(1-svSm((st.op-G2[1])/G2[2]))+G2[3]*f.q*(1-f.o))):0;
  for(const f of fl){const Z=V3.nz(toV(B,f.dir)),X0=toV(B,f.side),X=V3.nz(V3s(X0,V3.sc(Z,V3.dot(X0,Z)))),Y=V3.cr(Z,X),b=hv(f.pos),rv=toV(B,f.rad),axz=hv(f.ap||[0,0,f.pos[2]])[2];
    const ca=f.gt.roll||0,cs=Math.cos(ca),sn=Math.sin(ca);f.X=V3.add(V3.sc(X,cs),V3.sc(Y,sn));f.Y=V3.add(V3.sc(Y,cs),V3.sc(X,-sn));f.Z=Z;f.b=b;
    f.c=V3.add(b,V3.sc(Z,f.L*.45));f.fr=Math.max(-1,Math.min(1,(f.c[2]-axz)/Rr));f.ao=(S.ao||.62)+(1-(S.ao||.62))*(.5+.5*rv[2])*(.75+.25*f.fr);f.pl=.45+.55*lam(rv);
    /* (S.dep {t:[t1,t2], v:[3 lightness shifts], k:[3 mixes toward m.deep]}: the floret's depth in the raceme in three tiers, 0 deep inside
       (behind the axis), 1 between, 2 on the rim (in front, or on the silhouette); S.bv with m.bv [[colour, mix],...]: the banner's lilac of
       each floret one of n+1 variants, by hash (no draw)) */
    if(DP){const sc=Math.max(.5+.5*f.fr,(DP.e??.9)*(1-Math.abs(rv[2])));f.dk=sc<DP.t[0]?0:sc<DP.t[1]?1:2;f.dv=DP.v[f.dk]||0}
    if(BV)f.bv=Math.floor(pxHashS(f.i,17,Math.floor((f.gt.ph||0)*1e4)+f.i*7)*(BV.length+1)*.999);
    const L0=V3.dot([0,-1,0],f.X),L1=V3.dot([0,-1,0],f.Y),L2=V3.dot([0,-1,0],f.Z);f.down=[L0,L1,L2];f.eye=[f.X[2],f.Y[2],f.Z[2]]}
  /* the level of detail of each floret, from the best placed down within the budget */
  const cost=S.cost,bud=f=>f.o<S.fl.budAt&&f.w<.5;let tot=fl.length*(cost[0]??1)+4,lim=(S.budget[det?1:0]||200)*(o.bk||1);for(const f of fl)f.lod=0;
  if(!LOD){const sc2=fl.map(f=>[1.2*Math.max(0,f.Z[2])+.8*(.5+.5*f.fr)+.6*f.L/Hl+(bud(f)?0:.3),f]).sort((a,b)=>b[0]-a[0]);
    /* first every visible floret its mid level (the silhouette), then the full level from the best placed down */
    const vis=f=>!(f.fr<-.55||(f.fr<-.3&&f.Z[2]<-.1));for(const[,f]of sc2){const cm=cost[1][bud(f)?1:0]-1;if(vis(f)&&tot+cm<=lim){f.lod=1;tot+=cm}}
    for(const[,f]of sc2){if(f.lod!==1)continue;const cf=cost[2][bud(f)?1:0]-cost[1][bud(f)?1:0];if(tot+cf<=lim){f.lod=2;tot+=cf}}}
  /* the context handed to a floret */
  const c={m,P:m.fl?Object.assign({},S.fl,m.fl):S.fl,S,det,H,o,put:p=>prims.push(p),d2:P=>grQ(grCCW(P.map(sc))),l2:P=>grQo(P.map(sc)),
    col:(v,f,ramp,gb)=>colAt(v+(f.dv||0),f.w,ramp||'fr',gb,f.q,f.dk,f.bv),wc:(c0,f)=>wcol(c0,f.w),lit:n=>Math.max(0,Math.min(1,(S.lit||[.08,.92])[0]+(S.lit||[.08,.92])[1]*(.6*lam(n)+.4*c.f.pl)*c.f.ao))};
  const setF=f=>{c.f=f;c.V=p=>V3.add(f.b,V3.add(V3.add(V3.sc(f.X,p[0]),V3.sc(f.Y,p[1])),V3.sc(f.Z,p[2])));c.Vd=p=>V3.add(V3.add(V3.sc(f.X,p[0]),V3.sc(f.Y,p[1])),V3.sc(f.Z,p[2]));c.down=f.down;c.eye=f.eye;c.bend=0};
  /* the axis (its foot continues the stem) and the dark core inside the florets */
  /* clusters (a layout's ax.cl, [{i:[floret indices]}]: the panicle's cymes) are drawn whole, far to near, each over its blob (the floret's
     hook GR_FLORET[name].grp(c,cl)), behind or in front of the axis as a whole */
  const CL=ax.cl;if(CL)for(const q of CL){const M=q.i.map(j=>fl[j]);q.f=M;q.z=M.reduce((s,f)=>s+f.c[2],0)/M.length;q.fr=M.reduce((s,f)=>s+f.fr,0)/M.length;for(const f of M){f.cl=q;f.zk=q.z+(f.c[2]-q.z)*1e-3}}
  const zk=f=>f.zk??f.c[2],fq=f=>f.cl?f.cl.fr:f.fr,order=fl.slice().sort((a,b)=>zk(a)-zk(b)),back=order.filter(f=>fq(f)<-.05),front=order.filter(f=>fq(f)>=-.05),stc=m.stem||S.stem;
  /* S.slabs: the florets cut into this many slabs of depth on each side of the axis; within a slab their primitives are painted layer by layer
     (blobs, outlines, details), grouped by paint: hundreds of florets in a few dozen elements */
  const SL=S.slabs||0,GF=GR_FLORET[S.floret].grp;let ly=0;
  if(SL){for(const L of[back,front])L.forEach((f,i)=>{const s=Math.min(SL-1,Math.floor(i*SL/L.length));f.sl=f.cl?(f.cl.sl??(f.cl.sl=s)):s});const p0=c.put;c.put=p=>{p.sl=c.f.sl;p.ly=p.ly??ly++;p0(p)}}
  const drawF=f=>{if(GF&&f.cl&&!f.cl.dn){f.cl.dn=1;setF(f);ly=0;GF(c,f.cl)}setF(f);ly=1;GR_FLORET[S.floret](c,f,f.lod)};
  /* the pedicels (lay.pedTh): one thin stroke for each side of the axis, under their florets */
  const pedW=svF(Hl*(S.lay.pedW||.06)),peds=L=>{let d='';for(const f of L)if(f.pc)d+=grQo(f.pc.map(p=>sc(hv(p))));
    if(d)prims.push({d,s:wcol(m.ped||stc[1],st.wl*.8),sw:pedW,so:1});
    /* (S.fl.foot [open, bud, width, y] x a floret's length: out of zoom (P.q1) a floret drawn without its calyx (an open one at level 0 or 1, a bud
       at 0) would float a calyx's length off its pedicel's tip, its banner apart from its wings: one stroke in the calyx's paint, under it, from
       just behind the tip to z = open (or bud) along the floret, y toward its banner; species without S.fl.foot: nothing) */
    const FT=c.P.foot;if(FT&&c.P.q1&&!det){let e='';for(const f of L){if(!f.pc||f.gone||!(f.L<c.P.q1))continue;const P=c.P,op=f.o>=P.budAt;if(op?f.lod>1:f.lod>0)continue;
        if(op&&P.shed&&f.w>P.shed[0]+P.shed[1]*pxHashS(f.i,11,Math.floor((f.gt.ph||0)*1e4)+f.i*7))continue;
        const at=(y,z)=>sc(V3.add(f.b,V3.add(V3.sc(f.Y,y*f.L),V3.sc(f.Z,z*f.L))));e+=grQo([at(0,-.04),at(op?FT[3]||0:0,op?FT[0]:FT[1])])}
      if(e)prims.push({d:e,s:wcol(m.cal?grRamp(m.cal,.45):m.ped||stc[1],st.wl*.8),sw:svF(Hl*FT[2]),so:1})}};
  peds(back);for(const f of back)drawF(f);const nB=prims.length,zA=ax.br?hv([0,0,H*.5])[2]:0;if(ax.br)grBranches(prims,ax.br,hv,sc,stc,st.wl,zA,false);
  if(ax.path)grPath(prims,ax.path,hv,sc,stc,st.wl);else{const n2=8,Lft=[],Rgt=[],sd=V3.nz(V3.cr(toV(B,[0,0,1]),eye));for(let i=0;i<=n2;i++){const t=i/n2,z=ax.z0-H*.02+(ax.z1-ax.z0)*t,r=ax.r0+(ax.r1-ax.r0)*t,p=hv([0,0,z]);
      Lft.push(V3.add(p,V3.sc(sd,r)));Rgt.push(V3.add(p,V3.sc(sd,-r)))}
    const wc=x=>st.wl>0?lifeCol(x,st.wl*.6):x;prims.push({d:svSpl(grCCW(Lft.concat(Rgt.reverse()).map(sc))),f:wc(stc[1])});
    if(!LOD){const lt=V3.dot(sd,LIGHT)>0?1:-1,Q=[];for(let i=0;i<=n2;i++){const t=i/n2,z=ax.z0-H*.02+(ax.z1-ax.z0)*t,r=ax.r0+(ax.r1-ax.r0)*t,p=hv([0,0,z]);Q.push(sc(V3.add(p,V3.sc(sd,r*.35*lt))))}
      prims.push({d:svSpl(Q,false),s:wc(stc[2]),sw:svF(ax.r0*.5),so:.7})}}
  /* the core: the shadow among the florets (a body round the axis, half as wide as they reach) */
  /* (a layout's ax.core: its own body, the hull of these points in the head's frame, painted at ax.coreV of the ramp; with ax.coreB, a list of
     such bodies, overlapping lumps, one path: the hanging raceme's shade breaks between its florets instead of reading as a column) */
  if(ax.core){const gb=1-svSm(st.op/.5);prims.push({d:(ax.coreB?ax.core:[ax.core]).map(Q=>grQ(grCCW(svSimp(hull2(Q.map(p=>sc(hv(p)))),H*.008)))).join(''),f:colAt(ax.coreV??.24,st.wl*.8,ax.coreR&&gb>.5?ax.coreR:(ax.coreF||'fr'),gb*(ax.coreG??.6))})}
  else{const lo=fl.filter(f=>f.w<.55);if(lo.length>11){const z0=Math.min(...lo.map(f=>f.pos[2]))+H*.02,z1=Math.max(...lo.map(f=>f.pos[2])),pts=[];
      const reach=z=>{let s=0,nn=0;for(const f of lo)if(Math.abs(f.pos[2]-z)<H*.12){s+=f.L*(f.o>.22?.5:.8)*Math.sin(Math.acos(Math.max(-1,Math.min(1,f.dir[2]))));nn++}return nn?s/nn:0};
      for(let i=0;i<=6;i++){const z=z0+(z1-z0)*i/6,r=ax.r0+reach(z)*.26*Math.sin(Math.PI*(.12+.76*i/6));for(let j=0;j<12;j++){const a=j/12*6.2832;pts.push(sc(hv([Math.cos(a)*r,Math.sin(a)*r,z])))}}
      const gb=1-svSm(st.op/.5);prims.push({d:grQ(grCCW(svSimp(hull2(pts),H*.008))),f:colAt(.24,st.wl*.8,'fr',gb*.6)})}}
  if(ax.br)grBranches(prims,ax.br,hv,sc,stc,st.wl,zA,true);const nM=prims.length;
  peds(front);for(const f of front)drawF(f);
  /* the slabs (S.slabs): each side of the axis, slab by slab, layer by layer, grouped by paint; the axis, core and stalks keep their order */
  if(SL){prims.forEach((p,i)=>{p.sg=i<nB?0:i<nM?1:2;if(p.sl==null){p.sl=-1;p.ly=-1e6+i}p.k=(p.f||'')+'|'+(p.s||'')+'|'+(p.sw||'')+'|'+(p.so??'')+'|'+(p.fo??'')});
    prims.sort((a,b)=>(a.sg-b.sg)||(a.sl-b.sl)||(a.ly-b.ly)||(a.k<b.k?-1:a.k>b.k?1:0))}
  /* the paint: consecutive primitives with the same paint merged */
  let cur=null;const flush=()=>{if(!cur)return;const a={d:cur.d};if(cur.f){a.fill=cur.f;if(cur.fo!=null)a['fill-opacity']=cur.fo}else a.fill='none';
    if(cur.s){a.stroke=cur.s;a['stroke-width']=cur.sw;if(cur.so!=null)a['stroke-opacity']=cur.so;if(!cur.f){a['stroke-linecap']='round';a['stroke-linejoin']='round'}}E('path',a,k);cur=null};
  for(const p of prims){if(p.u){flush();E('use',{href:'#'+p.u,fill:'none',stroke:p.s,'stroke-width':p.sw,'stroke-opacity':p.so,'stroke-linecap':'round','stroke-linejoin':'round'},k);continue}if(!p.d)continue;const key=(p.f||'')+'|'+(p.s||'')+'|'+(p.sw||'')+'|'+(p.so??'')+'|'+(p.fo??'');if(cur&&cur.key===key){cur.d+=p.d;continue}flush();cur=Object.assign({key},p)}flush();
  return k}
/* ---------- the bell (hyacinth): a short tube swelling at its foot, six lobes in two whorls of three, spreading then curled back as it opens; the
   closed bud an egg drawn to a point, green at first. Decline: the lobes go limp and hang, narrow as their margins roll; dried, they curl into tight
   ringlets, papery, the tube shrivelled. S.fl: budAt (o below: a bud), bud [size, + growth] (x L), budHW (bud height/width), tube (x L), r [foot,
   mouth closed, + open] (x L), lobe (length x L) lg [closed, + open], lw (width x L), wO (outer whorl's width), a0 / a1 [closed, open] (the lobe's
   angle from the floret's axis at its foot / tip), ap (its bending), cup (cupped across), sweep and tw (an S sideways and twisted, x the genes' tw),
   jl, ja, js (each lobe's own length, curl, S), mouth and throatL (the throat's size and how far its dark fades into the body), sag (limp
   lobes toward the ground), curl (dried) ---------- */
/* S.fl.wMin (optional, additive): a lobe that twists edge-on is never pinched to nothing on the screen (its tip would float free of the
   floret: the QA's floating parts): on the rows the drawing uses (R: the foot, the bend, the curled part) its two margins never cross from one
   row to the next, and a row is never narrower on the screen than wMin of its neighbours (a cupped ribbon seen side-on keeps a width); sp the
   spine, ed the margins, in view space (x, y on the screen) */
function grUnpinch(sp,ed,R,wMin){const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]),X=(a,b,c2,d)=>o(a,b,c2)*o(a,b,d)<0&&o(c2,d,a)*o(c2,d,b)<0,
    sw=j0=>{for(let j=j0;j<sp.length;j++){const t=ed[0][j];ed[0][j]=ed[1][j];ed[1][j]=t}},W=j=>Math.hypot(ed[0][j][0]-ed[1][j][0],ed[0][j][1]-ed[1][j][1]);
  for(let i=1;i<R.length;i++)if(X(ed[0][R[i-1]],ed[0][R[i]],ed[1][R[i-1]],ed[1][R[i]]))sw(R[i]);
  for(let i=0;i<R.length;i++){const j=R[i],m=wMin*Math.max(i?W(R[i-1]):0,i<R.length-1?W(R[i+1]):0);if(W(j)>=m)continue;
    const p=sp[Math.max(0,j-1)],q=sp[Math.min(sp.length-1,j+1)],tl=Math.hypot(q[0]-p[0],q[1]-p[1]);if(tl<1e-9)continue;
    const nx=-(q[1]-p[1])/tl,ny=(q[0]-p[0])/tl,k=R[i?i-1:1],dot=r=>(ed[0][r][0]-ed[1][r][0])*nx+(ed[0][r][1]-ed[1][r][1])*ny,ak=dot(k),a=dot(j),
      d=(((ak||a)<0?-1:1)*Math.max(m,Math.abs(a))-a)/2,e0=ed[0][j],e1=ed[1][j];
    ed[0][j]=[e0[0]+nx*d,e0[1]+ny*d,e0[2]];ed[1][j]=[e1[0]-nx*d,e1[1]-ny*d,e1[2]]}}
/* P.hang [part, + per floret] (optional): a dried floret hangs on its pedicel (hyacinth, photographs 6 and 166: the shrivelled bells droop),
   its frame turned about its foot so its axis goes that part of the way toward the ground; the context's V, Vd, down and eye follow, so the
   floret then draws as if it stood in its own frame */
function grHang(c,f,dry){const H=c.P.hang;if(!H)return;const dn=c.down,k=Math.min(.95,Math.max(0,H[0]+H[1]*(pxHashS(f.i,13,Math.floor((f.gt.ph||0)*1e4))-.5)))*svSm((dry-.5)/.35);
  if(k<=0)return;let ax=V3.cr([0,0,1],dn);const sl=V3l(ax);ax=sl>1e-4?V3.sc(ax,1/sl):[1,0,0];const a=k*Math.acos(Math.max(-1,Math.min(1,dn[2]))),V0=c.V,Vd0=c.Vd;
  c.V=p=>V0(rotA(p,ax,a));c.Vd=p=>Vd0(rotA(p,ax,a));c.down=rotA(dn,ax,-a);c.eye=rotA(c.eye,ax,-a)}
/* the dried bell (photographs 6, 39, 166): the tube shrivelled and crumpled, the lobes rolled into ringlets, papery; no outline anywhere, the
   volume by tone alone: the lobes behind the bell in shade, the bell lit on one side, the lobes in front each by its own light (in tiers, so they
   share their paint), a fine sheen along the curl of the lit ones. P.dryS: the ringlet's width (x L x lw, .3) */
function grBellDry(c,f,lod,lobes,tl,r0,r1){const P=c.P,L=f.L,sdk=Math.floor((f.gt.ph||0)*1e4)+f.i*7,rg=[],lt=[],sw=svF(L*P.lw*(P.dryS||.3));
  /* the tube: three rings, each point pushed in or out (crumpled) */
  const lv=[[0,r0*.7],[tl*.4,r0],[tl,r1*.85]],nA=7,lA=[];for(let j=0;j<nA;j++){const a=j/nA*6.2832;lA.push(c.lit(V3.nz(c.Vd([Math.cos(a),Math.sin(a),0]))))}
  const mA=lA.reduce((s,x)=>s+x,0)/nA;
  lv.forEach(([z,r],i)=>{for(let j=0;j<nA;j++){const a=j/nA*6.2832,rr=r*(.78+.44*pxHashS(i*nA+j,17,sdk)),p=c.V([Math.cos(a)*rr,Math.sin(a)*rr,z]);rg.push(p);if(lA[j]>=mA)lt.push(p)}lt.push(c.V([0,0,z]))});
  const lobeV=lb=>c.lit(lb.f2[0]),tier=(v,a,b)=>a+b*Math.round(v*3)/3,spine=lb=>c.l2(lb.sp.filter((q,j)=>j%2===0||j===lb.sp.length-1));
  /* the ringlets (a lobe rolled on its margins: a strand seen the same from every side), in tiers of light */
  const strokes=(L2,a,b)=>{const by={};for(const lb of L2){const v=lod>1?tier(lobeV(lb),a,b):a+b*.5;(by[v]=by[v]||[]).push(lb)}
    for(const v of Object.keys(by).sort())c.put({d:by[v].map(spine).join(''),s:c.col(+v,f,'fr'),sw,so:1})};
  if(lod===0){c.put({d:c.d2(hull2(rg)),f:c.col(.3,f,'fr')});c.put({d:lobes.map(spine).join(''),s:c.col(.5,f,'fr'),sw,so:1});return}
  strokes(lobes.filter(l=>!l.front),.18,.3);
  c.put({d:c.d2(hull2(rg)),f:c.col(.3,f,'fr')});if(lt.length>2)c.put({d:c.d2(hull2(lt)),f:c.col(.34+.45*mA,f,'fr')});
  const fr=lobes.filter(l=>l.front);strokes(fr,.38,.5);
  if(lod>1){const ls=fr.filter(lb=>lobeV(lb)>.55);if(ls.length)c.put({d:ls.map(lb=>c.l2(lb.sp.slice(2,7))).join(''),s:c.col(.92,f,'fr'),sw:svF(L*P.lw*.07),so:.55})}}
GR_FLORET.clochette=(c,f,lod)=>{const P=c.P,L=f.L,gt=f.gt,dec=svSm((f.w-P.dec[0])/P.dec[1]),dry=svSm((f.w-P.dry[0])/P.dry[1]);
  if(f.o<P.budAt&&dry<.5)return grBud(c,f,lod);if(dry>.5)grHang(c,f,dry);
  const e=svSm((f.o-P.budAt)/(1-P.budAt)),tl=L*P.tube*(1-.15*dry),r0=L*P.r[0]*(1-.2*dry),r1=L*(P.r[1]+P.r[2]*e)*(1-.3*dry),ll=L*P.lobe*(P.lg[0]+P.lg[1]*e)*(1+.1*dry),
    a0=P.a0[0]+(P.a0[1]-P.a0[0])*e*(1-.25*dec),a1=P.a1[0]+(P.a1[1]-P.a1[0])*e*(gt.curl||1)*(1-.35*dec),ns=6,jm=3,jk=5,lobes=[],zc=c.V([0,0,tl*.5])[2];
  /* the lobes: a spine bending from a0 to a1 (curled further when dry, hanging toward the ground when limp), cupped across */
  /* each lobe its own: length, curl, place and an S sideways (P.jl, P.ja, P.js: no two lobes alike, never a regular star) */
  const sdk=Math.floor((gt.ph||0)*1e4)+f.i*7;
  for(let k=0;k<6;k++){const h1=pxHashS(k,1,sdk)-.5,h2=pxHashS(k,2,sdk)-.5,h3=pxHashS(k,3,sdk)-.5,h4=pxHashS(k,4,sdk)-.5,
      ps=(gt.roll2||0)+k*Math.PI/3+h3*.3*e,cs=Math.cos(ps),sn=Math.sin(ps),rd=[cs,sn,0],td=[-sn,cs,0],outer=k%2===0,
      /* dried (dv, P.dryV [length, curl] spread): each lobe its own length and curl, rolled tighter toward its tip (a spiral, never a ring) */
      dv=dry>.5?dry:0,h5=dv?pxHashS(k,5,sdk)-.5:0,DV=P.dryV||[0,0],
      lw=L*P.lw*(outer?P.wO:1)*(gt.W||1)*(1-.5*dry-.38*dec)*(.85+.15*e),cup=P.cup*(gt.cup||1)*(1+.9*dec),sp=[],ed=[[],[]],nm=[],llk=ll*(1+2*(P.jl||0)*h1*e)*(1+2*DV[0]*h5*dv),a1k=a1+2*(P.ja||0)*h2*e,
      sS=((P.sweep||0)*(gt.tw||0)+2*(P.js||0)*h4)*e;
    let p=[cs*r1,sn*r1,tl];const curlD=P.curl*(.3*dec+.7*dry)*(1+.3*Math.sin(k*2.1+(gt.ph||0)))*(1-2*DV[1]*h5*dv),nsd=dry>.5?9:ns,cx=1.2+(P.dryX||0)*dv;
    for(let j=0;j<=nsd;j++){const t=j/nsd,a=a0+(a1k-a0)*Math.pow(t,P.ap)+curlD*Math.pow(t,cx);let d=[rd[0]*Math.sin(a),rd[1]*Math.sin(a),Math.cos(a)];
      /* a lobe bends sideways one way then the other (an S) and twists on its midrib (P.sweep, P.tw x its genes) */
      if(sS)d=V3.nz(V3.add(d,V3.sc(td,sS*Math.sin(6.2832*t))));
      if(dec>0)d=V3.nz(V3.add(d,V3.sc(c.down,P.sag*dec*t)));if(j)p=V3.add(p,V3.sc(d,llk/nsd));let nI=[-rd[0]*Math.cos(a),-rd[1]*Math.cos(a),Math.sin(a)],tdj=td;
      const tw=(P.tw||0)*(gt.tw||0)*t*e;if(tw){const ct=Math.cos(tw),st2=Math.sin(tw);tdj=V3.add(V3.sc(td,ct),V3.sc(nI,st2));nI=V3.add(V3.sc(nI,ct),V3.sc(td,-st2))}
      const hw=lw*.5*(t<.35?.72+.28*Math.sin(t/.35*Math.PI/2):Math.max(.12,Math.cos((t-.35)/.65*Math.PI/2*.92)));
      sp.push(c.V(p));nm.push(nI);for(let s2=0;s2<2;s2++)ed[s2].push(c.V(V3.add(V3.add(p,V3.sc(tdj,(s2?-1:1)*hw)),V3.sc(nI,cup*hw))))}
    const nf=j=>{const n=V3.nz(c.Vd(nm[j]));return n[2]>0?[n,1]:[V3.sc(n,-1),0]},zz=sp.reduce((a,q)=>a+q[2],0)/sp.length;
    if(P.wMin)grUnpinch(sp,ed,[0,jm,jk],P.wMin);
    lobes.push({sp,ed,tip:sp[sp.length-1],z:zz,front:zz>=zc,f1:nf(1),f2:nf(jk)})}
  /* written with few points: the whole lobe, its foot, its curled tip, the midrib's lens, the margin, the bend's sheen */
  const out=lb=>[lb.ed[0][0],lb.ed[0][jm],lb.ed[0][jk],lb.tip,lb.ed[1][jk],lb.ed[1][jm],lb.ed[1][0]],
    ins=(lb,s2,j,k2)=>V3.add(lb.sp[j],V3.sc(V3s(lb.ed[s2][j],lb.sp[j]),k2));
  const ring=[];for(const[z,r]of[[0,r0*.8],[tl*.2,r0*1.05],[tl,r1]])for(let j=0;j<7;j++){const a=j/7*6.2832;ring.push(c.V([Math.cos(a)*r,Math.sin(a)*r,z]))}
  const tubeD=c.d2(hull2(ring)),side=V3.nz(V3s(c.eye,V3.sc([0,0,1],c.eye[2]))),tubeV=c.lit(V3.nz(c.Vd(V3l(side)>.1?side:[1,0,0]))),Ve=c.eye[2];
  if(dry>.5)return grBellDry(c,f,lod,lobes,tl,r0,r1);
  if(lod===0){/* one outline: a star, the lobes' tips and the notches between them sorted round the mouth (twelve points) */
    const o0=sc0(c.V([0,0,tl])),St=[];for(let k=0;k<6;k++){const lb=lobes[k],a=(gt.roll2||0)+(k+.5)*Math.PI/3;St.push(sc0(lb.ed[0][jk]),sc0(c.V([Math.cos(a)*r1*1.15,Math.sin(a)*r1*1.15,tl])))}
    const S2=St.concat([sc0(c.V([0,0,0]))]).sort((p,q)=>Math.atan2(p[1]-o0[1],p[0]-o0[0])-Math.atan2(q[1]-o0[1],q[0]-o0[0]));
    c.put({d:grQ(grCCW(S2)),f:c.col(c.lit(V3.nz(c.Vd([0,0,1])))*.6,f,'fr')});return}
  const bk=lobes.filter(l=>!l.front),fr=lobes.filter(l=>l.front);
  /* behind the tube: the lobes seen past it, in shade */
  if(bk.length){let d='';for(const lb of bk)d+=c.d2(out(lb));c.put({d,f:c.col(c.lit(bk[0].f1[0])*.7,f,bk[0].f1[1]?'fr':'bk')})}
  const mouth=()=>{if(Ve>.15&&e>.25){const M=[];for(let j=0;j<6;j++){const a=j/6*6.2832;M.push(c.V([Math.cos(a)*r1*(P.mouth||.78),Math.sin(a)*r1*(P.mouth||.78),tl]))}c.put({d:c.d2(M),f:c.wc(mix(c.m.throat,c.m.fr[2],P.throatL||0),f)});return 1}};
  if(lod===1){let d=tubeD;for(const lb of fr)d+=c.d2(out(lb));c.put({d,f:fr.length?c.col(c.lit(fr[0].f1[0]),f,fr[0].f1[1]?'fr':'bk'):c.col(tubeV,f,'bk')});mouth();return}
  c.put({d:tubeD,f:c.col(tubeV,f,'bk')});
  /* the mouth and its anthers, when the floret faces the eye */
  if(mouth()&&e>.5&&f.w<.4){const A=[];for(let j=0;j<3;j++){const a=j*2.094+(gt.roll2||0),v=c.V([Math.cos(a)*r1*.3,Math.sin(a)*r1*.3,tl*.97]);A.push(sc0(v))}c.put({d:svDots(A),s:c.m.anth,sw:svF(r1*.3),so:.85})}
  /* in front: each lobe in two parts, its foot and its curled tip, each lit on the face it shows; the paints in depth order */
  const byC={},add=(cc,P2,z)=>{const g2=byC[cc]||(byC[cc]={d:'',z:0,k:0});g2.d+=c.d2(P2);g2.z+=z;g2.k++};
  for(const lb of fr){const e0=lb.ed[0],e1=lb.ed[1];add(c.col(c.lit(lb.f1[0]),f,lb.f1[1]?'fr':'bk'),[e0[0],e0[jm],e1[jm],e1[0]],lb.sp[1][2]);
    add(c.col(c.lit(lb.f2[0])*(lb.f2[1]?1:.94),f,lb.f2[1]?'fr':'bk'),[e0[jm],e0[jk],lb.tip,e1[jk],e1[jm]],lb.sp[jk][2])}
  const oc=c.col(.1,f,'fr');for(const[cc,g2]of Object.entries(byC).sort((a,b)=>a[1].z/a[1].k-b[1].z/b[1].k))c.put({d:g2.d,f:cc,s:oc,sw:svF(L*.012),so:.45});
  /* the darker midrib, wide at the foot; the sheen along the bend; the pale margin */
  let dm='',dh='',de='';for(const lb of fr){dm+=c.d2([ins(lb,0,0,.34),ins(lb,0,jm,.2),lb.sp[jk],ins(lb,1,jm,.2),ins(lb,1,0,.34)]);if(c.det)dh+=c.l2([lb.sp[jm-1],lb.sp[jm],lb.sp[jk]]);
    if(lb.f1[1]||c.det)de+=c.l2([ins(lb,0,jm,.84),ins(lb,0,jk,.84),lb.tip,ins(lb,1,jk,.84),ins(lb,1,jm,.84)])}
  if(dm)c.put({d:dm,f:c.wc(c.m.mid,f),fo:.85});
  if(dh&&c.det)c.put({d:dh,s:c.col(.97,f,'fr'),sw:svF(L*P.lw*.22),so:.22});
  if(de)c.put({d:de,s:c.wc(c.m.edge,f),sw:svF(L*P.lw*.13),so:.85})};
const sc0=v=>[v[0],-v[1]];
/* the closed bud: an egg drawn to a point, six ridges where the lobes meet, green at the foot (and all over when young) */
function grBud(c,f,lod){const P=c.P,L=f.L*(P.bud[0]+P.bud[1]*f.gr)*(1-.3*svSm(f.w/.6)),r=L/(2*P.budHW),gb=f.gb??0,pts=[],foot=[],rv=v=>r*Math.pow(Math.sin(Math.PI*(.06+.94*v)),.7)*(1-.18*v)+r*.04;
  for(let i=0;i<=6;i++){const v=i/6;for(let j=0;j<8;j++){const a=j/8*6.2832,q=c.V([Math.cos(a)*rv(v),Math.sin(a)*rv(v),v*L]);pts.push(q);if(v<.4)foot.push(q)}}
  const side=V3.nz(V3s(c.eye,V3.sc([0,0,1],c.eye[2]))),nS=V3l(side)>.1?V3.nz(c.Vd(side)):c.Vd([0,0,1]),v0=c.lit(nS),tol=Math.max(.15,L*.03);
  c.put({d:c.d2(svSimp(hull2(pts),tol)),f:c.col(v0*.9,f,'bud',gb)});if(lod===0)return;
  /* the lit side: a narrower egg leaning toward the light */
  const lt=V3.nz([V3.dot(LIGHT,c.Vd([1,0,0])),V3.dot(LIGHT,c.Vd([0,1,0])),0]),hp=[];for(let i=1;i<=5;i++){const v=i/6;for(let j=0;j<6;j++){const a=j/6*6.2832;hp.push(c.V([lt[0]*r*.4+Math.cos(a)*rv(v)*.5,lt[1]*r*.4+Math.sin(a)*rv(v)*.5,v*L]))}}
  c.put({d:c.d2(svSimp(hull2(hp),tol)),f:c.col(Math.min(1,v0+.22),f,'bud',gb)});if(lod===1)return;
  if(gb>.1&&gb<.85&&f.w<.3)c.put({d:c.d2(svSimp(hull2(foot),tol)),f:c.col(v0*.85,f,'grn'),fo:.45});
  let d='';for(let k=0;k<6;k++){const a=(f.gt.roll2||0)+k*Math.PI/3+Math.PI/6,nn=c.Vd([Math.cos(a),Math.sin(a),0]);if(nn[2]<.15)continue;d+=c.l2([.3,.6,.85,.98].map(v=>c.V([Math.cos(a)*rv(v),Math.sin(a)*rv(v),v*L])))}
  if(d)c.put({d,s:c.col(v0*.55,f,'bud',gb),sw:svF(L*.022),so:.7})}
/* the outline of a body of revolution along a floret's axis, from z 0 to Lz, radius rf(t) at t=z/Lz (rings at the t of T), scaled by k, its centre
   moved by off x the radius in the floret's frame: seen from the side, its two flanks across the projected axis (a concave neck is kept) capped by
   the farthest ring at each end; seen down its axis, the hull of its rings (view points) */
/* a floret's tube bent through be (rad) toward its dorsal side (-Y) over its first zb, the mouth and all past it carried rigidly (the freesia's
   tube curving up): wraps the context's V, Vd, eye and down for this floret (setF restores them for the next); returns be */
function grBend(c,zb,be){if(!(Math.abs(be)>1e-3)||!(zb>0))return 0;const V0=c.V,Vd0=c.Vd,k=be/zb,ca=Math.cos(be),sa=Math.sin(be);
  c.V=p=>{const z=Math.max(0,Math.min(zb,p[2])),a=k*z,C=Math.cos(a),S2=Math.sin(a),dz=p[2]-z;return V0([p[0],-(1-C)/k+p[1]*C-dz*S2,S2/k+p[1]*S2+dz*C])};
  c.Vd=v=>Vd0([v[0],v[1]*ca-v[2]*sa,v[1]*sa+v[2]*ca]);const R=v=>[v[0],v[1]*ca+v[2]*sa,-v[1]*sa+v[2]*ca];c.eye=R(c.eye);c.down=R(c.down);c.bend=be;return be}
/* grRevO along a bent floret: each ring in its own plane, its silhouette across the local projected axis; the caps at the first and last rings */
function grRevB(c,Lz,rf,T,k,off){const P3=t=>c.V([0,0,t*Lz]),a0=P3(0),a1=P3(1),al=Math.hypot(a1[0]-a0[0],a1[1]-a0[1]),
    fr=t=>{const C=P3(t),Xt=V3s(c.V([1,0,t*Lz]),C),Yt=V3s(c.V([0,1,t*Lz]),C),r=rf(t);return{C:off?V3.add(C,V3.add(V3.sc(Xt,off[0]*r),V3.sc(Yt,off[1]*r))):C,Xt,Yt,r:r*k}};
  if(al<Lz*.6){const pts=[];for(const t of T){const{C,Xt,Yt,r}=fr(t);for(let j=0;j<8;j++){const a=j/8*6.2832;pts.push(V3.add(C,V3.add(V3.sc(Xt,Math.cos(a)*r),V3.sc(Yt,Math.sin(a)*r))))}}return hull2(pts)}
  const Lf=[],Rt=[];let lo,hi;
  T.forEach((t,i)=>{const{C,Xt,Yt,r}=fr(t),A1=P3(Math.min(1,t+.03)),A0=P3(Math.max(0,t-.03)),m=Math.hypot(A1[0]-A0[0],A1[1]-A0[1])||1,ax=[(A1[0]-A0[0])/m,(A1[1]-A0[1])/m],
      n2=[-ax[1],ax[0]],ex=d=>r*Math.hypot(Xt[0]*d[0]+Xt[1]*d[1],Yt[0]*d[0]+Yt[1]*d[1]),e=ex(n2);
    Lf.push([C[0]+n2[0]*e,C[1]+n2[1]*e]);Rt.push([C[0]-n2[0]*e,C[1]-n2[1]*e]);
    if(!i){const ea=ex(ax);lo=[C[0]-ax[0]*ea,C[1]-ax[1]*ea]}if(i===T.length-1){const ea=ex(ax);hi=[C[0]+ax[0]*ea,C[1]+ax[1]*ea]}});
  return[lo].concat(Lf,[hi],Rt.reverse())}
function grRevO(c,Lz,rf,T,k,off){if(c.bend)return grRevB(c,Lz,rf,T,k,off);const X=c.Vd([1,0,0]),Y=c.Vd([0,1,0]),a0=c.V([0,0,0]),a1=c.V([0,0,Lz]),ax0=[a1[0]-a0[0],a1[1]-a0[1]],al=Math.hypot(ax0[0],ax0[1]),
    ring=t=>{const r=rf(t);return[c.V([off?off[0]*r:0,off?off[1]*r:0,t*Lz]),r*k]};
  if(al<Lz*.72){const pts=[];for(const t of T){const[C,r]=ring(t);for(let j=0;j<8;j++){const a=j/8*6.2832;pts.push(V3.add(C,V3.add(V3.sc(X,Math.cos(a)*r),V3.sc(Y,Math.sin(a)*r))))}}return hull2(pts)}
  const ax=[ax0[0]/al,ax0[1]/al],n2=[-ax[1],ax[0]],ex=(r,d)=>r*Math.hypot(X[0]*d[0]+X[1]*d[1],Y[0]*d[0]+Y[1]*d[1]),Lf=[],Rt=[];let lo=null,hi=null;
  for(const t of T){const[C,r]=ring(t),e=ex(r,n2),ea=ex(r,ax),pa=C[0]*ax[0]+C[1]*ax[1];Lf.push([C[0]+n2[0]*e,C[1]+n2[1]*e]);Rt.push([C[0]-n2[0]*e,C[1]-n2[1]*e]);
    if(!lo||pa-ea<lo[0])lo=[pa-ea,[C[0]-ax[0]*ea,C[1]-ax[1]*ea]];if(!hi||pa+ea>hi[0])hi=[pa+ea,[C[0]+ax[0]*ea,C[1]+ax[1]*ea]]}
  return[lo[1]].concat(Lf,[hi[1]],Rt.reverse())}
/* a profile: [[t, radius x widest], ...] from the foot (t 0) to the mouth (t 1), read at t */
function grProf(T,t){for(let i=1;i<T.length;i++)if(t<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}return T[T.length-1][1]}
const GR_UO=[[0,.3],[.06,.68],[.16,.9],[.32,1],[.5,.98],[.65,.88],[.78,.72],[.88,.55],[.95,.45],[1,.46]],GR_UB=[[0,.25],[.1,.72],[.3,.97],[.55,1],[.78,.86],[.92,.55],[1,.12]],
  GR_T2=[0,.07,.18,.36,.56,.72,.84,.92,1],GR_T0=[0,.16,.4,.64,.84,1];
/* ---------- the urn (grape hyacinth): a closed urn hanging from its pedicel, from a rounded foot to its widest past the middle, then drawn in to a
   neck whose mouth is a ring of tiny pale teeth turned outward; the bud a smaller, rounder egg closed at its tip (darker), green when young; the
   sterile florets (f.ster) buds of the 'tip' ramp. Decline: the urn darkens (S.wilt), then shrivels into a creased papery sheath, its rim still
   pale (the rim fades but never dries dark). S.fl: budAt, bud [size, + growth] (x L), budHW and hw (height/width of the bud and of the open urn), prof and bprof (the open and the bud
   profiles, [[t, r]]: GR_UO, GR_UB), teeth [n, flare (x widest), length (x L), stroke (x L)], dry [from w, over], shrink (width lost dry),
   green (the kit's bud green). Ramps: fr (the urn), bud, tip (sterile), rim (the teeth), grn; m.throat (the mouth), m.ped (the pedicels).
   Elements: lod 2 an open urn 5 or 6 (body, lit side, sheen, mouth, rim, teeth), a bud 3; lod 1 two (body, teeth); lod 0 the body ---------- */
GR_FLORET.urne=(c,f,lod)=>{const P=c.P,gt=f.gt,dry=svSm((f.w-P.dry[0])/P.dry[1]),e=f.ster?0:svSm((f.o-P.budAt*.5)/(1-P.budAt*.5)),
    Lc=f.L*((P.bud[0]+P.bud[1]*f.gr)*(1-e)+e)*(1-.1*dry),hw=P.budHW+(P.hw-P.budHW)*e,W=Lc/(2*hw)*(gt.W||1)*(1-(P.shrink||0)*dry),
    UO=P.prof||GR_UO,UB=P.bprof||GR_UB,sdk=Math.floor((gt.ph||0)*1e4)+f.i*7,
    rf=t=>W*(grProf(UB,t)*(1-e)+grProf(UO,t)*e)*(dry>0?1-.2*dry*pxHashS(Math.round(t*12),3,sdk):1),
    ramp=f.ster?'tip':f.o<.12?'bud':'fr',gb=f.gb??0,ey=c.eye,side=V3.nz(V3s(ey,V3.sc([0,0,1],ey[2]))),nS=V3l(side)>.1?V3.nz(c.Vd(side)):c.Vd([1,0,0]),v0=c.lit(nS),
    tol=Math.max(.1,Lc*.025),nk=grProf(UO,1);
  const body=c.d2(svSimp(grRevO(c,Lc,rf,lod>0?GR_T2:GR_T0,1,null),tol));
  /* the teeth: a ring of points round the mouth, the teeth flaring out past the neck (a round-capped stroke), seen behind the urn when its mouth
     turns away from the eye */
  const te=svSm((e-.3)/.5)*(1-.4*svSm((dry-.6)/.4)),T=P.teeth,a0=gt.roll2||0,rT=W*(nk+(T[1]-nk)*te*.6),zT=Lc*(1+T[2]*te*.5),
    teeth=te>.05&&lod>0?(()=>{const Q=[];for(let j=0;j<=8;j++){const a=a0+j/8*6.2832;Q.push(c.V([Math.cos(a)*rT,Math.sin(a)*rT,zT]))}return c.l2(Q)})():'',
    tips=te>.4&&lod>1?(()=>{const Q=[];for(let j=0;j<T[0];j++){const a=a0+j/T[0]*6.2832,p=c.V([Math.cos(a)*W*(nk+(T[1]-nk)*te),Math.sin(a)*W*(nk+(T[1]-nk)*te),Lc*(1+T[2]*te)]);Q.push([p[0],-p[1]])}return svDots(Q)})():'',
    tCol=c.col(.3+.65*v0*(ey[2]<0?.7:1),{w:Math.min(f.w,.45)},'rim'),tW=svF(Lc*T[3]*(.6+.4*te));
  if(teeth&&ey[2]<0){c.put({d:teeth,s:tCol,sw:tW,so:1});if(tips)c.put({d:tips,s:tCol,sw:svF(tW*.8),so:1})}
  c.put({d:body,f:c.col(lod>1?v0*.75:v0*.88,f,ramp,gb)});
  if(lod===0)return;
  if(lod>1){/* the lit side: a narrower body leaning toward the light; on an open urn a sheen, on a bud its darker closed tip */
    const lt=V3.nz([V3.dot(LIGHT,c.Vd([1,0,0])),V3.dot(LIGHT,c.Vd([0,1,0])),0]);
    c.put({d:c.d2(svSimp(grRevO(c,Lc,rf,GR_T2.slice(1,-1),.8,[lt[0]*.24,lt[1]*.24]),tol)),f:c.col(Math.min(1,v0+.1),f,ramp,gb)});
    if(e>.45&&dry<.3)c.put({d:c.d2(grRevO(c,Lc,rf,[.3,.44,.58,.68],.2,[lt[0]*.58,lt[1]*.58])),f:c.col(.98,f,ramp),fo:.45});
    else if(e<.45&&dry<.5){/* the bud's tip: darker seen from the side; seen from in front, the closed teeth meet in a pale star */
      if(ey[2]<.3)c.put({d:c.d2(grRevO(c,Lc,rf,[.86,.94,1],.7,null)),f:c.col(v0*.85,f,ramp,gb)});
      else{let d='';const rs=W*.34,a0=gt.roll2||0;for(let j=0;j<3;j++){const a=a0+j*1.047;d+=c.l2([c.V([Math.cos(a)*rs,Math.sin(a)*rs,Lc*.97]),c.V([-Math.cos(a)*rs,-Math.sin(a)*rs,Lc*.97])])}
        c.put({d,s:c.col(.3+.45*v0,f,'rim'),sw:svF(W*.09),so:.65})}}}
  /* dried: two creases along the sheath */
  if(dry>.3){let d='';for(const s of[-.55,.6]){const a=Math.atan2(ey[1],ey[0])+s;d+=c.l2([.14,.4,.66,.88].map(t=>c.V([Math.cos(a)*rf(t)*.9,Math.sin(a)*rf(t)*.9,t*Lc])))}
    c.put({d,s:c.col(.06,f,ramp),sw:svF(W*.14),so:.75})}
  /* the mouth seen from in front: dark inside the ring of teeth */
  if(ey[2]>.3&&e>.4){const M=[];for(let j=0;j<7;j++){const a=j/7*6.2832;M.push(c.V([Math.cos(a)*W*nk*.7,Math.sin(a)*W*nk*.7,Lc*.995]))}c.put({d:c.d2(M),f:c.wc(c.m.throat,f)})}
  if(teeth&&ey[2]>=0){c.put({d:teeth,s:tCol,sw:tW,so:1});if(tips)c.put({d:tips,s:tCol,sw:svF(tW*.8),so:1})}};
/* ---------- the funnel (freesia): a narrow tube widening into a funnel, six unequal lobes spreading at its mouth (two whorls; the upper, dorsal one,
   on -Y, broader and longer; the lower, ventral one, its blotch), a coloured throat; in it three stamens against its upper side and a style of three
   branches. The bud: a club, narrow at the foot, widest past two thirds, its tip rounded to a point, green at the foot (all over when young), the
   colour coming from its tip; opening, the lobes part at the tip and spread. A pair of small green bracts clasps every floret's foot. Decline
   (deduced, no photograph found): the lobes go limp, narrow and fold back toward the axis, the flower closing into a crumpled rag that sags; dried,
   a shrivelled twist. S.fl: budAt, bud [size, + growth] (x L), budHW (the bud's height / width; [young, ripe]: by its growth f.gr), bprof (its profile [[t, r]]), tube [mouth height,
   foot radius, neck radius] (x L), flare [mouth radius (x L), where the neck ends (x the mouth height), its power], lip {n, L, w (x L), wb (its width at the foot x w), wO (the
   outer whorl's width), dw, dl (the dorsal lobe's width and length), vw (the ventral's width), a0 [closed, open], a1 [closed, open] (a lobe's
   angle from the axis at its foot / tip), ap (its bending), cup, jl, ja (each lobe's own length and spread), da (added to the dorsal's spread), we (a lobe's width as the bud opens, x w: narrow, they
   overlap like a bud's tepals instead of crossing)},
   sty {r (the stamens' place x the mouth), st, sl (how far the stamens and the style reach past the mouth, x L)}, brc [length, width (x L), turn
   toward the dorsal side], dec, dry, sag, crump (crumpled lobes), green, bow (the tube curving up toward its dorsal side by this angle, rad, as it
   opens: grBend; grRevO then follows the bend). Material: ramps fr, bk, bud, grn; throat, blot, anth, sty, brc, brcE.
   Elements: lod 2 an open floret 8 to 11, a bud 4; lod 1 three, a bud 2; lod 0 one ---------- */
GR_FLORET.entonnoir=(c,f,lod)=>{const P=c.P,gt=f.gt,L=f.L,dec=svSm((f.w-P.dec[0])/P.dec[1]),dry=svSm((f.w-P.dry[0])/P.dry[1]);
  if(f.o<P.budAt&&dry<.5){grFunBud(c,f,lod);return}
  const e=svSm((f.o-P.budAt)/(1-P.budAt)),Tb=P.tube,Fl=P.flare,Lp=P.lip,n=Lp.n||6,ns=6,jm=3,jk=5,
    zt=L*Tb[0]*(.8+.2*e)*(1-.1*dry),r1=L*Tb[2],rm=L*(Tb[2]+(Fl[0]-Tb[2])*(.35+.65*e))*(1-.3*dec-.3*dry),
    rf=t=>t<Fl[1]?L*Tb[1]+(r1-L*Tb[1])*t/Fl[1]:r1+(rm-r1)*Math.pow((t-Fl[1])/(1-Fl[1]),Fl[2]||1.5),
    a0=(Lp.a0[0]+(Lp.a0[1]-Lp.a0[0])*e)*(1-.7*dec),a1=(Lp.a1[0]+(Lp.a1[1]-Lp.a1[0])*e*(gt.curl||1))*(1-.55*dec)-.1*dry,
    sdk=Math.floor((gt.ph||0)*1e4)+f.i*7,bw=grBend(c,zt,(P.bow||0)*(.3+.7*e)*(gt.bw||1)),zc=c.V([0,0,zt])[2],lobes=[],crk=(P.crump||0)*(.4*dec+.6*dry);
  for(let k=0;k<n;k++){const h1=pxHashS(k,1,sdk)-.5,h2=pxHashS(k,2,sdk)-.5,h3=pxHashS(k,3,sdk)-.5,ph=-Math.PI/2+k*6.2832/n+h3*.12,cs=Math.cos(ph),sn=Math.sin(ph),td=[-sn,cs,0],
      dors=k===0,vent=2*k===n,lw=L*Lp.w*(k%2?1:Lp.wO||1)*(dors?Lp.dw||1:vent?Lp.vw||1:1)*(gt.W||1)*((Lp.we??.7)+(1-(Lp.we??.7))*e)*(1-.25*dec-.2*dry),
      ll=L*Lp.L*(dors?Lp.dl||1:1)*(.8+.2*e)*(1+2*(Lp.jl||0)*h1)*(1-.15*dry),a1k=a1+(2*(Lp.ja||0)*h2+(dors?Lp.da||0:0))*e,cup=(Lp.cup||.3)*(1+.8*dec),sp=[],ed=[[],[]],nm=[];
    let p=[cs*rm,sn*rm,zt];
    for(let j=0;j<=ns;j++){const t=j/ns,a=a0+(a1k-a0)*Math.pow(t,Lp.ap||1.4);let d=[cs*Math.sin(a),sn*Math.sin(a),Math.cos(a)];
      if(crk)d=V3.nz(V3.add(d,V3.sc(td,crk*(pxHashS(k*9+j,5,sdk)-.5)*t)));
      if(dec>0)d=V3.nz(V3.add(d,V3.sc(c.down,(P.sag||0)*dec*t)));
      if(j)p=V3.add(p,V3.sc(d,ll/ns));const nI=V3.nz(V3.cr(d,td)),hw=lw*.5*(t<.6?(Lp.wb??.55)+(1-(Lp.wb??.55))*Math.sin(t/.6*Math.PI/2):Math.max(.1,Math.cos((t-.6)/.4*Math.PI/2*.78)));
      sp.push(c.V(p));nm.push(nI);for(let s2=0;s2<2;s2++)ed[s2].push(c.V(V3.add(V3.add(p,V3.sc(td,(s2?-1:1)*hw)),V3.sc(nI,cup*hw))))}
    const nf=j=>{const v=V3.nz(c.Vd(nm[j]));return v[2]>0?[v,1]:[V3.sc(v,-1),0]},zz=sp.reduce((s,q)=>s+q[2],0)/sp.length;
    lobes.push({sp,ed,tip:sp[ns],tx:V3.add(sp[ns],V3.sc(V3s(sp[ns],sp[ns-1]),.35)),z:zz,front:zz>=zc,f1:nf(1),f2:nf(jk),vent,dors})}
  const out=lb=>[lb.ed[0][0],lb.ed[0][jm],lb.ed[0][jk],lb.ed[0][ns],lb.tx,lb.ed[1][ns],lb.ed[1][jk],lb.ed[1][jm],lb.ed[1][0]],ins=(lb,s2,j,k2)=>V3.add(lb.sp[j],V3.sc(V3s(lb.ed[s2][j],lb.sp[j]),k2)),
    tol=Math.max(.1,L*.02),body=c.d2(svSimp(grRevO(c,zt,rf,lod>0?GR_T2:GR_T0,1,null),tol)),ey=c.eye,Ve=ey[2],side=V3.nz(V3s(ey,V3.sc([0,0,1],Ve))),
    nS=V3l(side)>.1?V3.nz(c.Vd(side)):c.Vd([1,0,0]),tubeV=c.lit(nS),lc=lb=>c.col(c.lit(lb.f1[0]),f,lb.f1[1]?'fr':'bk');
  if(lod===0){let d=body;for(const lb of lobes)d+=c.d2(out(lb));c.put({d,f:c.col(tubeV*.8,f,'bk')});return}
  const bk=lobes.filter(l=>!l.front),fr=lobes.filter(l=>l.front);
  if(lod===1){let d='';for(const lb of bk)d+=c.d2(out(lb));c.put({d:d+body,f:c.col(tubeV*.8,f,'bk')});
    if(fr.length){let d2='';for(const lb of fr)d2+=c.d2(out(lb));c.put({d:d2,f:lc(fr[0])})}grBracts(c,f);return}
  /* behind the funnel: the lobes seen past it, in shade; the bracts behind the foot when the mouth faces the eye */
  if(bk.length){let d='';for(const lb of bk)d+=c.d2(out(lb));c.put({d,f:c.col(c.lit(bk[0].f1[0])*.78,f,bk[0].f1[1]?'fr':'bk')})}
  if(Ve>.3)grBracts(c,f);
  c.put({d:body,f:c.col(tubeV*.82,f,'bk')});
  {const lt=V3.nz([V3.dot(LIGHT,c.Vd([1,0,0])),V3.dot(LIGHT,c.Vd([0,1,0])),0]);c.put({d:c.d2(svSimp(grRevO(c,zt,rf,GR_T2.slice(1,-1),.55,[lt[0]*.38,lt[1]*.38]),tol)),f:c.col(Math.min(1,tubeV+.12),f,'bk')})}
  if(Ve<=.3)grBracts(c,f);
  /* the throat, when the mouth turns to the eye; in it the stamens against its upper side and the style's three branches */
  if(Ve>.12&&e>.2){const M=[];for(let j=0;j<8;j++){const a=j/8*6.2832;M.push(c.V([Math.cos(a)*rm*.9,Math.sin(a)*rm*.9,zt]))}c.put({d:c.d2(M),f:c.wc(c.m.throat,f)});
    if(e>.5&&f.w<.45&&Ve>.2){const Y=P.sty||{},rs=rm*(Y.r||.4),zs=zt+L*(Y.st||.03),zy=zt+L*(Y.sl||.06);let d='',da='';
      for(let j=0;j<3;j++){const b=-Math.PI/2+(j-1)*.55,ca=Math.cos(b),sa=Math.sin(b);d+=c.l2([c.V([ca*r1*.5,sa*r1*.5,zt*.8]),c.V([ca*rs*.85,sa*rs*.85,zs-L*.03])]);
        da+=c.l2([c.V([ca*rs*.8,sa*rs*.8,zs-L*.035]),c.V([ca*rs*1.05,sa*rs*1.05,zs+L*.025])])}
      const s0=c.V([0,-rm*.1,zt*.8]),s1=c.V([0,-rm*.14,zy]);d+=c.l2([s0,s1]);for(let j=0;j<3;j++){const b=j*2.094+.5;d+=c.l2([s1,c.V([Math.cos(b)*rm*.22,-rm*.14+Math.sin(b)*rm*.22,zy+L*.03])])}
      c.put({d,s:c.wc(c.m.sty,f),sw:svF(L*.012),so:.95});c.put({d:da,s:c.wc(c.m.anth,f),sw:svF(L*.03),so:1})}}
  /* in front: each lobe in two parts, its foot and its tip, each lit on the face it shows, the paints in depth order, a fine darker margin */
  const byC={},add=(cc,P2,z)=>{const g2=byC[cc]||(byC[cc]={d:'',z:0,k:0});g2.d+=c.d2(P2);g2.z+=z;g2.k++};
  for(const lb of fr){const e0=lb.ed[0],e1=lb.ed[1];add(lc(lb),[e0[0],e0[jm],e1[jm],e1[0]],lb.sp[1][2]);
    add(c.col(c.lit(lb.f2[0])*(lb.f2[1]?1:.94),f,lb.f2[1]?'fr':'bk'),[e0[jm],e0[jk],e0[ns],lb.tx,e1[ns],e1[jk],e1[jm]],lb.sp[jk][2])}
  const oc=c.col(.12,f,'fr');for(const[cc,g2]of Object.entries(byC).sort((a,b)=>a[1].z/a[1].k-b[1].z/b[1].k))c.put({d:g2.d,f:cc,s:oc,sw:svF(L*.01),so:.4});
  /* the blotch at the foot of the ventral lobe, seen from in front */
  const vl=fr.find(l=>l.vent);if(vl&&vl.f1[1]&&c.m.blot&&e>.4)c.put({d:c.d2([ins(vl,0,0,.6),ins(vl,0,2,.5),vl.sp[jm],ins(vl,1,2,.5),ins(vl,1,0,.6)]),f:c.wc(c.m.blot,f),fo:.75})};
/* the funnel's bud: a club (S.fl.bprof) on its bracts, green at the foot (its colour from the tip), its lit side */
function grFunBud(c,f,lod){const P=c.P,Lb=f.L*(P.bud[0]+P.bud[1]*(f.gr??1))*(1-.25*svSm(f.w/.6)),hw=Array.isArray(P.budHW)?P.budHW[0]+(P.budHW[1]-P.budHW[0])*(f.gr??1):P.budHW,W=Lb/(2*hw)*(f.gt.W||1),gb=f.gb??0,rf=t=>W*grProf(P.bprof,t),
    ey=c.eye,side=V3.nz(V3s(ey,V3.sc([0,0,1],ey[2]))),nS=V3l(side)>.1?V3.nz(c.Vd(side)):c.Vd([1,0,0]),v0=c.lit(nS),tol=Math.max(.1,Lb*.025);
  c.put({d:c.d2(svSimp(grRevO(c,Lb,rf,lod>0?GR_T2:GR_T0,1,null),tol)),f:c.col(v0*.86,f,'bud',gb)});if(lod===0)return;
  if(lod>1){const lt=V3.nz([V3.dot(LIGHT,c.Vd([1,0,0])),V3.dot(LIGHT,c.Vd([0,1,0])),0]);
    c.put({d:c.d2(svSimp(grRevO(c,Lb,rf,GR_T2.slice(1,-1),.6,[lt[0]*.32,lt[1]*.32]),tol)),f:c.col(Math.min(1,v0+.14),f,'bud',gb)});
    if(gb<.85&&f.w<.4)c.put({d:c.d2(svSimp(grRevO(c,Lb*.4,t=>rf(t*.4)*1.03,[0,.3,.6,.85,1],1,null),tol)),f:c.col(v0*.85,f,'grn'),fo:.7})}
  grBracts(c,f)}
/* a pair of small bracts clasping a floret's foot (S.fl.brc [length, width (x L), turn toward the dorsal side]): two pointed scales, one paint */
function grBracts(c,f){const B2=c.P.brc;if(!B2)return;const L=f.L,bl=L*B2[0],bw=L*B2[1],rb=L*((c.P.tube||[0,.04])[1])*1.15;let d='';
  for(const s of[-1,1]){const u=V3.nz([s,-(B2[2]||0),0]),t=[-u[1],u[0],0];
    d+=c.d2([[-1,0],[-.95,.45],[0,1],[.95,.45],[1,0]].map(([a,z])=>c.V(V3.add(V3.add(V3.sc(u,rb+bw*.3*z),V3.sc(t,bw*.5*a)),[0,0,bl*z-L*.03]))))}
  c.put({d,f:c.wc(c.m.brc||'#7f9c4a',{w:f.w*.5}),s:c.wc(c.m.brcE||'#4e6a2a',{w:f.w*.5}),sw:svF(L*.008),so:.5})}
/* ---------- the panicle (lilac): a conical thyrse. Up its axis, lay.br.n [fewest, most] nodes of opposite branches, decussate (each pair turned a
   right angle from the last), from lay.z[0] to lay.z[1] (x H), the internodes shortening upward (lay.dense); each branch fans its cymes over a
   quarter turn (lay.fan, rad either side) and about two internodes up (lay.rise), out to the panicle's envelope: its half-width lay.w (x the full
   length) widest at lay.wq of the height, rounded below (lay.wb), tapering to the tip (lay.wp); lay.tight: how much narrower it is in bud (eased
   out by lay.tightAt of the opening). As many cymes as cover the envelope (lay.dens; lay.cyR their radius x L), each sitting at lay.k [in, out] of
   the envelope, a cap of lay.fpc [min, max] florets facing out along its normal tilted up by lay.up: the central one standing out (lay.lift), the
   others leaning out (lay.spread); a terminal cyme crowns the axis. Florets: L (the limb's diameter x H), taper (smaller toward the top), grow
   (a bud's size from how near its opening is). The order of opening (S.law.order, a function of the floret) reads f.rk: lay.ord [height, along
   the branch, a cyme's laterals after its centre]. It hands the kit ax.cl (the cymes, drawn whole over their blob), ax.br (the branches and cyme
   stalks, lay.brW their width x H), ax.core (the dark body inside, lay.coreK of the envelope, painted at lay.coreV) ---------- */
GR_LAYOUT.panicule=(S,g,H,st)=>{const P=S.lay,r=svRng(g.sd||7),Hf=st.Hf||H,fl=[],cl=[],br=[],tg=svSm(st.op/(P.tightAt||.7)),wF=1-(P.tight||0)*(1-tg),
    nN=Math.round(P.br.n[0]+(P.br.n[1]-P.br.n[0])*r()),z0=H*P.z[0],z1=H*P.z[1],wq=P.wq||.2,ord=P.ord||[.82,.12,.05],K=P.k||[.8,1],FP=P.fpc||[3,5],
    tube=S.fl.tube||.6,fan=P.fan||.8,
    env=z=>{const q=Math.max(0,Math.min(1,(z-z0*.6)/(H-z0*.6)));return Hf*P.w*wF*(q<wq?Math.pow(Math.sin(q/wq*1.5708),P.wb||.5):Math.pow(Math.max(0,(1-q)/(1-wq)),P.wp||.8))};
  let ng=0;const zs=[];for(let k=0;k<=nN;k++)zs.push(z0+(z1-z0)*(1-Math.pow(1-k/nN,P.dense||1.4)));
  const cyme=(az,z,kk,rk0,nF,A,E)=>{const R=env(z)*kk,dR=(env(z+H*.01)-env(z-H*.01))/(H*.02),N=V3.nz(V3.add(V3.nz([Math.cos(az),Math.sin(az),-dR]),[0,0,P.up||0])),
      T1=[-Math.sin(az),Math.cos(az),0],T2=V3.nz(V3.cr(N,T1)),C=[Math.cos(az)*R,Math.sin(az)*R,z],q=Math.min(1,z/H),ids=[],Lc=Hf*P.L*(1-(P.taper||0)*q),
      rho=Lc*(P.cyR||.5)*(.55+.45*tg),a0=r()*6.2832;
    for(let j=0;j<nF;j++){const gt=g.tep[(ng++)%g.n],a=a0+j*6.2832/Math.max(1,nF-1)+(gt.da||0),off=j?V3.add(V3.sc(T1,Math.cos(a)*rho),V3.sc(T2,Math.sin(a)*rho)):[0,0,0],
        dir=j?V3.nz(V3.add(N,V3.sc(off,(P.spread||.6)/Math.max(1e-6,rho)))):N,L=Lc*(gt.dL||1),c0=V3.add(V3.add(C,off),V3.sc(N,j?0:L*(P.lift||.12))),
        rk=Math.max(0,Math.min(1,rk0+(j?ord[2]:0)+(gt.drk||0))),lw=grLaw(S.law,grRank(S.law,q,{q,rk}),st,gt.dt);
      ids.push(fl.length);fl.push(Object.assign({i:fl.length,q,rk,gt,rad:[Math.cos(az),Math.sin(az),0],side:T1,pos:V3s(c0,V3.sc(dir,L*tube)),dir,L,ster:false,pc:null,
        gr:svSm(1-(S.law.t0+S.law.spread*rk+(gt.dt||0)-Math.min(1.2,st.op+(S.law.late||0)*st.wl))/(P.grow||.5))},lw))}
    cl.push({i:ids,C,N,az});
    /* its stalk: from the axis along the branch (A, E) into the cyme */
    if(A)br.push({p:[A,E,V3.add(C,V3.sc(N,-Lc*.3))],w:Hf*(P.brW||.01)*(1-.55*q)})};
  for(let k=0;k<nN;k++){const zk=zs[k],q=zk/H,phi=(g.phi0||0)+k*Math.PI/2+(r()-.5)*.25,rise=Math.max(H*.06,(zs[Math.min(nN,k+2)]-zk)*(P.rise||1.05)),
      lc=Hf*P.L*(1-(P.taper||0)*q),area=fan*2*env(zk+rise*.5)*rise,nc=Math.max(1,Math.round(area/(3.1416*Math.pow(lc*(P.cyR||.5)*1.6,2))*(P.dens||1)));
    for(let j=0;j<2;j++){const ph=phi+j*Math.PI,A=[0,0,zk];
      for(let c2=0;c2<nc;c2++){const u=(c2+.5)/nc,v=(c2*.618+r()*.3)%1,az=ph+(v-.5)*2*fan,z=zk+u*rise*(.9+.2*r()),kk=K[0]+(K[1]-K[0])*r(),
          ea=ph+(az-ph)*.4,re=env(z)*kk*.45,E=[Math.cos(ea)*re,Math.sin(ea)*re,zk+(z-zk)*.45];
        cyme(az,z,kk,ord[0]*q+ord[1]*u+(r()-.5)*.04,Math.round(FP[0]+(FP[1]-FP[0])*r()),A,E)}}}
  /* the terminal cyme, on the axis */
  cyme(r()*6.2832,z1+H*.02,0,ord[0]*z1/H+ord[1],FP[1],[0,0,zs[nN-1]],[0,0,(zs[nN-1]+z1)/2]);
  const core=[[0,0,z0],[0,0,z1]];for(let i=0;i<=6;i++){const z=z0+(z1-z0)*(.1+.9*i/6),rr=env(z)*(P.coreK||.75)*(.7+.3*tg)*(1-.45*svSm((st.wl-.3)/.5));for(let j=0;j<8;j++){const a=j/8*6.2832;core.push([Math.cos(a)*rr,Math.sin(a)*rr,z])}}
  return{fl,ax:{z0:0,z1,r0:Hf*(P.rr||.012),r1:Hf*(P.rr||.012)*.45,cl,br,core,coreV:P.coreV??.12,coreR:P.coreR,coreG:P.coreG}}};
/* a layout's branches (ax.br: [{p:[points in the head's frame], w}]): thin stalks, their widths in steps (so they merge), those behind the axis (side
   false) before it, the others after it */
function grBranches(prims,br,hv,sc,stc,wl,zA,side){const c0=wl>0?lifeCol(stc[1],wl*.6):stc[1],L=[];
  for(const b of br){const V=b.p.map(hv),zm=V.reduce((s,v)=>s+v[2],0)/V.length;if((zm>=zA)===side)L.push([Math.max(.2,Math.round(b.w*5)/5),V])}
  L.sort((a,b)=>a[0]-b[0]);for(const[w,V]of L)prims.push({d:grQo(V.map(sc)),s:c0,sw:svF(w),so:1})}
/* an ellipse C + u cos t + v sin t (screen points and vectors) as two arcs, turned as grCCW turns an outline */
function grEll(C,u,v){const A=u[0]*u[0]+v[0]*v[0],Cc=u[1]*u[1]+v[1]*v[1],Bb=u[0]*u[1]+v[0]*v[1],dd=Math.sqrt((A-Cc)*(A-Cc)/4+Bb*Bb),
    th=.5*Math.atan2(2*Bb,A-Cc),rx=Math.max(.05,Math.sqrt((A+Cc)/2+dd)),ry=Math.max(.05,Math.sqrt(Math.max(0,(A+Cc)/2-dd))),ex=Math.cos(th)*rx,ey=Math.sin(th)*rx,
    x0=svR(C[0]-ex),y0=svR(C[1]-ey),dx=svR(2*ex),dy=svR(2*ey),a=svJ([svR(rx),svR(ry),Math.round(th*57.2958)])+' 1 1 ';
  return'M'+svJ([x0,y0])+'a'+a+svJ([dx,dy])+'a'+a+svJ([svR(-dx),svR(-dy)])+'z'}
/* a closed outline of cubic segments from S0: [[c1, c2, end], ...] (screen points), relative, positions rounded (at q, else .1) and tracked */
function grCub(S0,segs,q){const R=q?(x=>Math.round(x/q)*q):svR;let cx=R(S0[0]),cy=R(S0[1]),d='M'+svJ([cx,cy]);
  for(const[a,b,e]of segs){const ex=R(e[0]),ey=R(e[1]);d+='c'+svJ([a[0]-cx,a[1]-cy,b[0]-cx,b[1]-cy,ex-cx,ey-cy].map(R));cx=ex;cy=ey}return d+'z'}
const grArea=P=>{let a=0;for(let i=0,n=P.length;i<n;i++){const p=P[i],q=P[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return a};
/* ---------- the star (lilac): a slender tube (tube x L long, tr its radius x L) opening into a flat limb of lobes (lobes, 4; a double: wh 2 or 3
   whorls, each inner one smaller by whK and turned half a lobe, more upright); a lobe ovate (lobeL its length x the limb's radius, lobeW its width
   x its length; cA, cB: its cubic's reach and breadth; notch: how near the mouth the lobes part), spread at a [closed, open] from the tube's axis
   (ap: a little past flat at the tip), its tip hooded (hood: turned up, the margins in); the mouth a dark eye (eye x L, the colourway's throat)
   with the anthers just showing (anth). The bud (grClub): a club, the folded lobes a four-angled head (bud [size, + growth] x L, budHW its
   height/width) on its tube, darker ('bud' ramp, 'grn' when young). Decline: the lobes go limp, narrow, their hoods curl; dried: shrunk, half
   closed, brown (the kit's colours). LOD 2: the tube when seen from the side, the limb, its lobes lit one by one, the eye, the anthers, the hoods'
   sheen (zoom); 1: the limb's outline; 0: nothing within a cyme (its blob stands for it), else a small oval facing the eye. The cyme's blob
   (GR_FLORET.etoile.grp): the hull of its florets in the shade of its centre (blob: how dark) ---------- */
GR_FLORET.etoile=(c,f,lod)=>{const P=c.P,gt=f.gt,L=f.L,dec=svSm((f.w-P.dec[0])/P.dec[1]),dry=svSm((f.w-P.dry[0])/P.dry[1]);
  if(f.o<P.budAt&&dry<.5)return grClub(c,f,lod);
  const ez=c.eye[2],e=svSm((f.o-P.budAt)/(1-P.budAt)),tl=L*P.tube*(1-(P.tubeDry??.25)*dry),tr=L*(P.tr||.045)*(1-.3*dry),M0=[0,0,tl],face=ez>=0,ramp=face?'fr':'bk',
    v0=c.lit(V3.nz(c.Vd([0,0,face?1:-1]))),q1=!c.det&&P.q1&&L<P.q1?1:0;
  if(lod===0){if(f.cl||LOD||ez<.25)return;const r=L*.3*(.5+.5*e);c.put({d:grEll(sc0(c.V(M0)),sc0(c.Vd([r,0,0])),sc0(c.Vd([0,r,0]))),f:c.col(v0*.85,f,'fr'),ly:2});return}
  const n=P.lobes||4,nw=lod>1?(P.wh||1):1,sdk=Math.floor((gt.ph||0)*1e4)+f.i*7,dn=c.down,
    dir=(ps,a)=>[Math.cos(ps)*Math.sin(a),Math.sin(ps)*Math.sin(a),Math.cos(a)];
  /* one whorl: its notches and lobes in the floret's frame */
  const whorl=w=>{const k=Math.pow(P.whK||.66,w),a=(P.a[0]+(P.a[1]-P.a[0])*e*(1-.2*dec))*(1-.14*w)*(1-.4*dry),ll=L*.5*P.lobeL*k*(.42+.58*e)*(1-.38*dry),
      lw=P.lobeW*(1-.3*dec-.4*dry),hd=(P.hood||.2)*(1+1.5*dec+2*dry),rn=tr*1.15+ll*(P.notch||.1),PS=[],NT=[],LB=[];
    for(let j=0;j<n;j++)PS.push((gt.roll2||0)+(j+w*.5)*2*Math.PI/n+(pxHashS(j+w*5,1,sdk)-.5)*.2*e);
    for(let j=0;j<n;j++){const p1=PS[j],p2=PS[(j+1)%n]+(j===n-1?2*Math.PI:0);NT.push(V3.add(M0,V3.sc(dir((p1+p2)/2,a),rn)))}
    for(let j=0;j<n;j++){const ps=PS[j],lj=ll*(1+.16*(pxHashS(j+w*5,2,sdk)-.5)),aa=a+(P.ap||0)*e*(1-dry),t=[-Math.sin(ps),Math.cos(ps),0],
        nk=[-Math.cos(ps)*Math.cos(aa),-Math.sin(ps)*Math.cos(aa),Math.sin(aa)];let d=dir(ps,aa);if(dec>0)d=V3.nz(V3.add(d,V3.sc(dn,.35*dec)));
      const A=NT[(j+n-1)%n],B=NT[j],up=V3.sc(nk,lj*hd*.5),c1=V3.add(V3.add(A,V3.sc(d,lj*P.cA)),V3.add(V3.sc(t,-lj*lw*P.cB),up)),c2=V3.add(V3.add(B,V3.sc(d,lj*P.cA)),V3.add(V3.sc(t,lj*lw*P.cB),up));
      LB.push({A,B,c1,c2,nk,d,lj,tip:V3.add(V3.add(M0,V3.sc(d,lj*.95)),V3.sc(nk,lj*hd*.3))})}
    return{NT,LB}};
  /* the outline of a whorl (turned like grCCW), and of one lobe closed through the mouth */
  const out=W=>{const S2=W.LB.map(b=>[sc0(c.V(b.c1)),sc0(c.V(b.c2)),sc0(c.V(b.B))]),s0=sc0(c.V(W.LB[0].A));
      if(grArea(W.NT.map(p=>sc0(c.V(p))))>=0)return grCub(s0,S2,q1);const R2=[];for(let j=n-1;j>=0;j--)R2.push([S2[j][1],S2[j][0],j?S2[j-1][2]:s0]);return grCub(S2[n-1][2],R2,q1)},
    lobe=b=>{const A=sc0(c.V(b.A)),c1=sc0(c.V(b.c1)),c2=sc0(c.V(b.c2)),B=sc0(c.V(b.B)),m=sc0(c.V(M0));
      return grArea([A,c1,c2,B,m])>=0?grCub(A,[[c1,c2,B],[B,m,m]],q1):grCub(B,[[c2,c1,A],[A,m,m]],q1)};
  /* (P.q1: below this limb, out of zoom, outlines rounded at whole units; P.tubeDry: how much a dried tube shrinks, and past dry .55 it is hidden) */
  const W0=whorl(0),side=Math.abs(ez)<.8&&lod>1&&!(P.tubeDry&&dry>.55),tube=()=>c.put({d:c.l2([c.V([0,0,0]),c.V([0,0,tl*.6]),c.V([0,0,tl*.97])]),s:c.col(.3+v0*.6,f,'fr'),sw:svF(Math.max(.1,tr*2)),so:1,ly:face?1:3.5});
  if(side&&face)tube();
  c.put({d:out(W0),f:c.col(v0*.92,f,ramp),ly:2});
  if(lod>1){/* each lobe lit on its own face: those turned to the light lighter, away from it darker */
    for(const b of W0.LB){const vl=c.lit(V3.nz(c.Vd(face?b.nk:V3.sc(b.nk,-1))));if(Math.abs(vl-v0)>.07)c.put({d:lobe(b),f:c.col(vl>v0?Math.min(1,v0*.92+(vl-v0)*1.4):v0*.92-(v0-vl)*1.2,f,ramp),ly:3})}
    for(let w=1;w<nw;w++)c.put({d:out(whorl(w)),f:c.col(Math.min(1,v0+.06*w),f,ramp),ly:3+w*.1});
    if(side&&!face)tube();
    if(face&&ez>.3&&e>.4){const r=L*(P.eye||.05)*(1-.4*dry);
      /* (P.dot: out of zoom the eye is a round dot, a stroke of no length, and the anthers too small to see are left out) */
      if(P.dot&&!c.det){const m=sc0(c.V(M0));c.put({d:'M'+svJ([svR(m[0]),svR(m[1])])+'h0',s:c.wc(c.m.throat||'#3a1a44',f),sw:svF(Math.max(.4,Math.round(r*2*Math.sqrt(Math.max(.2,ez))*5)/5)),so:1,ly:4})}
      else c.put({d:grEll(sc0(c.V(M0)),sc0(c.Vd([r,0,0])),sc0(c.Vd([0,r,0]))),f:c.wc(c.m.throat||'#3a1a44',f),ly:4});
      if(e>.7&&f.w<.3&&ez>.5&&!(P.dot&&!c.det&&L*.022<.45)){const ra=L*.022;c.put({d:grEll(sc0(c.V([r*.3,0,tl+tr])),[ra,0],[0,ra]),f:c.wc(c.m.anth||'#d8c45a',f),ly:5})}}
    if(c.det&&face&&e>.5){let d='';for(const b of W0.LB)d+=c.l2([c.V(V3.add(M0,V3.sc(b.d,b.lj*.62))),c.V(b.tip)]);c.put({d,s:c.col(Math.min(1,v0+.3),f,'fr'),sw:svF(L*.035),so:.45,ly:6})}}};
GR_FLORET.etoile.grp=(c,cl)=>{const P=c.P,F=cl.f,f0=F[0],pts=[];let ob=0;if(f0.Z[2]<-.3&&cl.fr<0)return;
  /* dried florets shrink, and their cyme's blob with them (the branches show through) */
  for(const f of F){const op=f.o>=P.budAt,rr=f.L*(op?.3*(.45+.55*svSm((f.o-P.budAt)/(1-P.budAt))):.42*(P.bud[0]+P.bud[1]*(f.gr??1)))*(1-.6*svSm((f.w-P.dry[0])/P.dry[1])),ctr=sc0(V3.add(f.b,V3.sc(f.Z,f.L*P.tube*(op?1:.75))));if(op)ob++;
    for(let j=0;j<6;j++){const a=j/6*6.2832;pts.push([ctr[0]+Math.cos(a)*rr,ctr[1]+Math.sin(a)*rr])}}
  const bud=ob<F.length/2;c.put({d:grQ(grCCW(svSimp(hull2(pts),Math.max(.2,f0.L*.16)))),f:c.col(.3+c.lit(f0.Z)*(P.blob||.6),f0,bud?'bud':'fr',bud?f0.gb:0),ly:0})};
/* the lilac's bud: a club, the folded lobes a four-angled head on its tube; lit on the side toward the light */
function grClub(c,f,lod){const P=c.P,L=f.L,gr=f.gr??1,wl=svSm(f.w/.6),hb=L*(P.bud[0]+P.bud[1]*gr)*(1-.25*wl),a=hb*.5,b=a/(P.budHW||1.15),tb=L*P.tube*(.3+.7*gr)*(1-.2*wl),
    ez=c.eye[2],gb=f.gb??0,C3=c.V([0,0,tb+a*.8]),C2=sc0(C3),zs=sc0(c.Vd([0,0,1])),zl=Math.hypot(zs[0],zs[1]),zu=zl>1e-3?[zs[0]/zl,zs[1]/zl]:[1,0],
    al=Math.sqrt(Math.pow(a*zl,2)+Math.pow(b*ez,2)),side=V3.nz(V3s(c.eye,V3.sc([0,0,1],ez))),v0=c.lit(V3l(side)>.1?V3.nz(c.Vd(side)):c.Vd([0,0,1])),
    tube=()=>{if(zl*tb>b*.5)c.put({d:c.l2([c.V([0,0,0]),c.V([0,0,tb])]),s:c.col(v0*.7,f,'bud',gb),sw:svF(Math.max(.1,L*(P.tr||.045)*1.6)),so:1,ly:ez>0?1:2.5})};
  if(lod>0&&ez>0)tube();
  c.put({d:grEll(C2,[zu[0]*al,zu[1]*al],[-zu[1]*b,zu[0]*b]),f:c.col(v0*.85,f,'bud',gb),ly:2});if(lod===0)return;
  if(ez<=0)tube();
  const lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1])||1,o2=[C2[0]+lt[0]/ll*b*.32,C2[1]+lt[1]/ll*b*.32];
  c.put({d:grEll(o2,[zu[0]*al*.5,zu[1]*al*.5],[-zu[1]*b*.45,zu[0]*b*.45]),f:c.col(Math.min(1,v0+.24),f,'bud',gb),ly:3});
  if(lod>1&&c.det&&ez>.2){let d='';for(const s of[[1,0,0],[0,1,0]])d+=c.l2([c.V(V3.add([0,0,tb+a*.8],V3.sc(s,-b*.8))),c.V(V3.add([0,0,tb+a*1.45],[0,0,0])),c.V(V3.add([0,0,tb+a*.8],V3.sc(s,b*.8)))]);
    c.put({d,s:c.col(v0*.55,f,'bud',gb),sw:svF(L*.02),so:.6,ly:4})}}
/* ---------- the hanging raceme (wisteria): an axis leaving its spur along z, each tenth of it turned toward the ground (the law of l97Hang),
   florets all round it on slender arched pedicels, opening from its foot down to its tip; every floret's back (its banner) up, its angle from
   the plumb line growing as it opens. The ground's direction in the head's frame: st.down, else S.lay.down (the species computes it from its
   frame), else -z. S.lay: hang (the turn per tenth), sway (sideways, x g.sw), droop (it hangs more as it fades), z [first, last insertion],
   dense (internodes shorter toward the tip), L (floret x H), taper, ped [foot, tip] (the pedicel x L), pedO (shorter on a bud), pedTh [bud,
   open] (the pedicel's angle from the axis), pedD (a fading floret's pedicel droops toward the axis by so much, rad), pedW, th [tip bud, ripe bud, open] (the floret's angle from the plumb line), hang2 (a fading floret
   hangs; hangW [from w, span], default [.3,.5]), rr [foot, tip] (the axis' radius x H), grow (how long a bud takes to grow), core, coreV (the shade inside, x a floret's length, its
   lightness on the ramp), coreN (that shade as so many uneven lumps). Genes: tep dphi dth dL dt roll W ph ra, head H op div phi0 sw sd.
   It hands the kit ax.path (the curved axis), ax.mid, ax.core (with ax.coreB, a list of lumps). ---------- */
GR_LAYOUT.pendante=(S,g,H,st)=>{const P=S.lay,n=g.n,fl=[],Hf=st.Hf||H,ns=24,dn=V3.nz(st.down||P.down||[0,0,-1]),wl=st.wl||0,
    sag=(P.droop||0)*svSm((wl-.2)/.7),kh=1-Math.pow(1-Math.min(.95,(P.hang||.3)*(1+sag)),10/ns);
  /* the axis: from its foot along z, each step turned toward the ground; a sideways sway (g.sw) */
  let d=[0,0,1];const sw0=V3.cr(dn,d),swd=V3l(sw0)>.05?V3.nz(sw0):[1,0,0],pts=[[0,0,0]],T=[d];
  for(let i=1;i<=ns;i++){if(V3.dot(d,dn)<-.97)d=V3.nz(V3.add(d,V3.sc(swd,.25)));d=V3.nz(V3.add(V3.add(V3.sc(d,1-kh),V3.sc(dn,kh)),V3.sc(swd,(g.sw||0)*(P.sway||0)/ns)));
    pts.push(V3.add(pts[i-1],V3.sc(d,H/ns)));T.push(d)}
  /* frames carried along it (no twist): N across, Bn = T x N */
  const N=[],Bn=[];{let n0=V3.cr(T[0],dn);n0=V3l(n0)>.05?V3.nz(n0):[1,0,0];for(let i=0;i<=ns;i++){const t=T[i];n0=V3.nz(V3s(n0,V3.sc(t,V3.dot(n0,t))));N.push(n0);Bn.push(V3.cr(t,n0))}}
  const at=s=>{const x=Math.max(0,Math.min(1,s))*ns,i=Math.min(ns-1,Math.floor(x)),k=x-i,lp=(A,j)=>V3.add(A[j],V3.sc(V3s(A[j+1],A[j]),k));
      return[lp(pts,i),V3.nz(lp(T,i)),V3.nz(lp(N,i)),V3.nz(lp(Bn,i))]},
    rad=s=>Hf*(P.rr[0]+(P.rr[1]-P.rr[0])*s);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,z0=1e9,z1=-1e9;const bb=p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);z0=Math.min(z0,p[2]);z1=Math.max(z1,p[2])};
  for(let i=0;i<n;i++){const gt=g.tep[i],q=n>1?i/(n-1):0,zq=(q-P.dense*q*q)/(1-P.dense),s=P.z[0]+(P.z[1]-P.z[0])*zq,[p,Tg,N1,B1]=at(s),
      phi=(g.phi0||0)+i*(g.div||137.5)*Math.PI/180+(gt.dphi||0),rd=V3.nz(V3.add(V3.sc(N1,Math.cos(phi)),V3.sc(B1,Math.sin(phi)))),
      rk=grRank(S.law,q),lw=grLaw(S.law,rk,st,gt.dt),
      gr=svSm(1-(S.law.t0+S.law.spread*rk+(gt.dt||0)-Math.min(1.2,st.op+(S.law.late||0)*wl))/(P.grow||.8)),
      /* (P.tip [from q, how much smaller, power], optional: the raceme drawn out to a slender tip, its last florets (buds) and their pedicels
         shrinking fast past q, close round the axis) */
      tk=P.tip?1-P.tip[1]*Math.pow(svSm((q-P.tip[0])/(1-P.tip[0])),P.tip[2]||1):1,
      L=Hf*P.L*(1-P.taper*q)*(gt.dL||1)*tk,
      thB=P.th[0]+(P.th[1]-P.th[0])*gr,th=Math.max(.05,thB+(P.th[2]-thB)*svSm((lw.o-.1)/.6)+(gt.dth||0)-(P.hang2||0)*svSm((lw.w-(P.hangW||[.3])[0])/((P.hangW||[0,.5])[1]))),
      rh0=V3s(rd,V3.sc(dn,V3.dot(rd,dn))),rh=V3l(rh0)>.08?V3.nz(rh0):rd,
      dir=V3.nz(V3.add(V3.sc(rh,Math.sin(th)),V3.sc(dn,Math.cos(th)))),dors=V3.nz(V3s(V3.sc(rh,Math.cos(th)),V3.sc(dn,Math.sin(th)))),
      side=V3.nz(V3.cr(V3.sc(dors,-1),dir)),
      ptA=Array.isArray(P.pedTh)?P.pedTh:[P.pedTh||1.2,P.pedTh||1.2],pt=ptA[0]+(ptA[1]-ptA[0])*svSm((lw.o-.05)/.5)-(P.pedD||0)*svSm((lw.w-.3)/.5),d0=V3.nz(V3.add(V3.sc(Tg,Math.cos(pt)),V3.sc(rd,Math.sin(pt)))),pd=L*(P.ped[0]+(P.ped[1]-P.ped[0])*q)*(1-(P.pedO||0)*(1-lw.o)),
      p0=V3.add(p,V3.sc(rd,rad(s)*.8)),c1=V3.add(p0,V3.sc(d0,pd*.55)),pos=V3.add(c1,V3.sc(V3.nz(V3.add(V3.sc(d0,.35),V3.sc(dir,.65))),pd*.5)),
      /* fallen whole (S.fl.shed[2]: the share of shed florets whose calyx and pedicel drop too): nothing left but a scar on the axis */
      SF=S.fl.shed,sk=Math.floor((gt.ph||0)*1e4)+i*7,gone=!!(SF&&SF[2]&&lw.w>SF[0]+SF[1]*pxHashS(i,11,sk)+.12&&pxHashS(i,13,sk)<SF[2]);
    bb(pos);bb(V3.add(pos,V3.sc(dir,L*.8)));
    fl.push(Object.assign({i,q,gt,rad:rd,side,pos,dir,L,ap:p,gr,ster:false,gone,pc:gone?null:[p0,c1,pos]},lw))}
  const path=[];for(let i=0;i<=12;i++){const s=Math.min(1,P.z[1]+.03)*i/12,p=at(s)[0];path.push([p,rad(s)]);bb(p)}
  /* the core: the shade among the fresh florets, a slender body round the axis (lay.core x a floret's length); lay.coreN: as so many overlapping
     lumps of uneven girth, a little off the axis (the shade seen through the gaps), not one smooth column */
  let core=null;const fr2=fl.filter(f=>f.w<.55&&f.o>.3),cN=P.coreN||0;if(P.core&&fr2.length>11){const sA=P.z[0]+(P.z[1]-P.z[0])*Math.min(...fr2.map(f=>f.q)),sB=P.z[0]+(P.z[1]-P.z[0])*Math.max(...fr2.map(f=>f.q)),nr=cN||8,ring=[];core=[];
    for(let i=0;i<=nr;i++){const s=sA+(sB-sA)*i/nr,[p,,N1,B1]=at(s),h=cN?.6+.7*pxHashS(i,3,g.sd||5):1,r=(rad(s)+P.core*Hf*P.L*(1-P.taper*s)*Math.sin(Math.PI*(.15+.7*i/nr)))*h,
        ao=cN?(pxHashS(i,5,g.sd||5)-.5)*r*.5:0,ag=pxHashS(i,7,g.sd||5)*6.2832,c0=V3.add(p,V3.add(V3.sc(N1,Math.cos(ag)*ao),V3.sc(B1,Math.sin(ag)*ao))),R1=[];
      for(let j=0;j<10;j++){const a=j/10*6.2832;R1.push(V3.add(c0,V3.add(V3.sc(N1,Math.cos(a)*r),V3.sc(B1,Math.sin(a)*r))))}ring.push(R1)}
    if(cN)for(let i=0;i<nr;i++)core.push(ring[i].concat(ring[i+1]));else core=[].concat(...ring)}
  /* (lay.coreF, optional: the ramp the fresh core is painted with, default fr) */
  /* (no core: an empty list, never the kit's straight core along z, which would stick out of a hanging raceme as a bar) */
  return{fl,ax:{z0:0,z1:H,r0:rad(0),r1:rad(1),path,mid:[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],core:core||[],coreB:cN>0||!core,coreV:P.coreV,coreF:P.coreF}}};
/* ---------- the pea flower (wisteria): the calyx, a cup; the banner (standard) broad and notched, rising from its claw and bending back, cupped,
   its two halves lit apart, the eye at its foot; the two wings side by side round the keel, bulging outward; the keel under them, its tip
   turned up. The bud a pointed pod on its calyx (grPeaBud). Fallen (S.fl.shed), the calyx alone and a stub of style. Decline: the banner folds
   (fold) and droops (sag), dried it shrinks. S.fl: shed [from w, spread, share fallen whole], budAt, bud [size, + growth] (x L), budHW (length / width), bbow (the bud's curve), bprof,
   cal [length, foot radius, mouth radius] (x L), std {z, y (foot), h, w (x L), a0 / a1 [closed, open] (its angle at the foot / tip), ap, cup,
   notch, wav, prof, arc}, wing {z [from, to], y [from, to], h, x [foot, bulge]}, keel {z1, y, h, x, up}, eye [height, width] (on the banner), dec, dry,
   shed [from w, spread], fold, sag, green. Ramps of the material: fr bk (banner front, back), wing, keel, bud, grn, cal, lo (a far floret, one
   outline); colours eye, style, ped. Levels: 2 calyx, banner, its shaded half, eye, two wings, keel; 1 calyx, banner, wings and keel in one; 0
   one outline. ---------- */
const GR_SP=[[0,.12],[.08,.2],[.2,.55],[.38,.86],[.55,1],[.72,.97],[.86,.82],[.95,.58],[1,.34]];
/* a view-space outline shrunk by k toward its centre moved o of its radius toward the light (LIGHT, view space): the washes of a floret in volume */
function grPapShr(Pv,k,o){const n=Pv.length;if(!n)return Pv;let cx=0,cy=0,r=0;for(const p of Pv){cx+=p[0];cy+=p[1]}cx/=n;cy/=n;for(const p of Pv)r=Math.max(r,Math.hypot(p[0]-cx,p[1]-cy));
  const ln=Math.hypot(LIGHT[0],LIGHT[1])||1,ox=LIGHT[0]/ln*r*o,oy=LIGHT[1]/ln*r*o;return Pv.map(p=>[cx+(p[0]-cx)*k+ox,cy+(p[1]-cy)*k+oy,p[2]||0])}
GR_FLORET.papillon=(c,f,lod)=>{const P=c.P,gt=f.gt,L=f.L,dec=svSm((f.w-P.dec[0])/P.dec[1]),dry=svSm((f.w-P.dry[0])/P.dry[1]),
    sdk=Math.floor((gt.ph||0)*1e4)+f.i*7,shed=P.shed&&f.w>P.shed[0]+P.shed[1]*pxHashS(f.i,11,sdk),cal=P.cal,ey=c.eye,tol=Math.max(.08,L*.02),
    sideE=V3.nz(V3s(ey,V3.sc([0,0,1],ey[2]))),nS=V3l(sideE)>.1?V3.nz(c.Vd(sideE)):c.Vd([1,0,0]),v0=c.lit(nS),
    lv=nf=>{let v=V3.nz(c.Vd(nf));const fr=v[2]>=0;if(!fr)v=V3.sc(v,-1);return[c.lit(v),fr]},
    calD=k=>c.d2(svSimp(grRevO(c,L*cal[0]*k,t=>L*k*(cal[1]+(cal[2]-cal[1])*Math.pow(t,.7)),[0,.35,.7,1],1,null),tol));
  /* the corolla fallen: the calyx alone on its pedicel, a stub of style in it; fallen whole (f.gone, from the layout): nothing */
  if(f.gone)return;
  if(shed){c.put({d:calD(.92),f:c.col(v0*.8,f,'cal')});
    if(lod>1&&dry<.9)c.put({d:c.l2([c.V([0,L*.02,L*cal[0]*.7]),c.V([0,L*.07,L*cal[0]*1.7])]),s:c.wc(c.m.style||'#8a9450',f),sw:svF(L*.03),so:.9});return}
  if(f.o<P.budAt){grPeaBud(c,f,lod);return}
  const e=svSm((f.o-P.budAt)/(1-P.budAt)),Sd=P.std,ap=Sd.ap||1.3,fo=1-(P.fold||0)*dec,
    a0=(Sd.a0[0]+(Sd.a0[1]-Sd.a0[0])*e)*fo,a1=(Sd.a1[0]+(Sd.a1[1]-Sd.a1[0]+(gt.ra||0))*e)*fo-.3*dry,
    Hs=L*Sd.h*(.7+.3*e)*(1-.3*dry),Ws=L*Sd.w*(gt.W||1)*(.3+.7*e)*(1-.25*dec-.35*dry),
    cup=Sd.cup*(1+2.2*(1-e))*(1-.5*dec)-.6*dry,sag=(P.sag||0)*dec,nv=6,C=[],Nn=[],HW=[];
  {let p=[0,-L*Sd.y,L*Sd.z];for(let j=0;j<=nv;j++){const v=j/nv,a=a0+(a1-a0)*Math.pow(v,ap);
      if(j){const am=a0+(a1-a0)*Math.pow((j-.5)/nv,ap);p=V3.add(p,V3.sc([0,-Math.sin(am),Math.cos(am)],Hs/nv));if(sag)p=V3.add(p,V3.sc(c.down,L*sag*v*v*.12))}
      C.push(p);Nn.push([0,Math.cos(a),Math.sin(a)]);HW.push(Ws*.5*grProf(Sd.prof||GR_SP,v))}}
  /* (Sd.qw, optional: out of zoom (P.q1, levels 0 and 1) the banner's claw is never narrower than qw x L a side, on its lowest third: a claw of a
     fraction of a pixel would let the banner float off its calyx stroke, S.fl.foot) */
  if(Sd.qw&&lod<2&&P.q1&&!c.det&&L<P.q1)for(let j=0;j<=nv&&j/nv<=.34;j++)HW[j]=Math.max(HW[j],Sd.qw*L);
  /* (Sd.arc [foot, tip]: the banner's halves folded forward round its midrib, its cross-section an arc of that half-angle (rad): narrower
     seen from the front, a hood seen from the side; less as it fades) */
  const wv=(Sd.wav||0)*(1+2*dec),arc=Sd.arc,SP=(u,j)=>{let w=HW[j]*u,cu=(cup*Math.pow(Math.abs(u),1.5)+wv*Math.sin(u*4+sdk)*Math.abs(u))*HW[j];
      if(arc){const Th=(arc[0]+(arc[1]-arc[0])*j/nv)*(1-.4*dec)+1e-4,al=Th*u;w=HW[j]*Math.sin(al)/Th;cu+=HW[j]*(1-Math.cos(al))/Th}
      return V3.add(V3.add(C[j],[w,0,0]),V3.sc(Nn[j],cu))},
    SPv=(u,v)=>{const x=Math.max(0,Math.min(1,v))*nv,j=Math.min(nv-1,Math.floor(x)),k=x-j,a=SP(u,j),b=SP(u,j+1);return V3.add(a,V3.sc(V3s(b,a),k))},
    nch=V3.add(SP(0,nv),V3.sc(V3s(C[nv-1],C[nv]),(Sd.notch||0)*nv*(.4+.6*e))),
    edge=s=>{const o=[];for(let j=0;j<=nv;j++)o.push(SP(s,j));return o},
    stdOut=()=>c.d2(edge(1).concat([SP(.55,nv),nch,SP(-.55,nv)],edge(-1).reverse()).map(c.V)),
    half=s=>c.d2(edge(s).concat([SP(s*.55,nv),nch],C.slice(0,nv).reverse()).map(c.V)),
    nh=s=>{const dv=V3s(SP(s*.6,4),SP(s*.6,2)),du=V3s(SP(s*.85,3),SP(s*.35,3));return V3.nz(V3.sc(V3.cr(dv,du),s))},
    [lS,frS]=lv(Nn[3]),rS=frS?'fr':'bk';
  /* the wings, side by side round the keel, bulging outward; the keel under them, its tip curving up */
  const Wg=P.wing,Kl=P.keel,eW=.55+.45*e,
    wingP=s=>{const o=[];for(const u of[-1,-.5,0,.5,1])for(let j=0;j<=5;j++){const v=j/5,z=L*(Wg.z[0]+(Wg.z[1]-Wg.z[0])*v*eW),y=L*(Wg.y[0]+(Wg.y[1]-Wg.y[0])*Math.pow(v,1.4)),
        hh=L*Wg.h*.5*Math.pow(Math.sin(Math.PI*(.12+.88*v)),.6)*(.7+.3*e),x=s*L*(Wg.x[0]*(.5+.5*e)+Wg.x[1]*Math.pow(Math.sin(Math.PI*v),.8)*(1-u*u)*(.4+.6*e));
        let p=[x,y+u*hh,z];if(sag)p=V3.add(p,V3.sc(c.down,L*sag*.35*v*v));o.push(c.V(p))}return o},
    keelP=()=>{const o=[];for(const u of[-1,0,1])for(let j=0;j<=5;j++){const v=j/5,sn=Math.sin(Math.PI*(.08+.92*v)),z=L*(Wg.z[0]+(Kl.z1-Wg.z[0])*v*eW),y=L*(Wg.y[0]+Kl.y*v-Kl.up*v*v*v),
        hh=L*Kl.h*.5*Math.pow(sn,.7),xw=L*Kl.x*Math.pow(sn,.8);for(const sx of[-1,1]){let p=[sx*xw*(1-.3*u*u),y+u*hh,z];if(sag)p=V3.add(p,V3.sc(c.down,L*sag*.35*v*v));o.push(c.V(p))}}return o},
    hullD=P2=>c.d2(svSimp(hull2(P2),tol));
  const zCal=c.V([0,0,L*cal[0]*.5])[2],zStd=c.V(C[3])[2],zW=s=>c.V([s*L*(Wg.x[0]+Wg.x[1]*.6),L*(Wg.y[0]+Wg.y[1])*.5,L*(Wg.z[0]+Wg.z[1])*.5])[2],zK=c.V([0,L*(Wg.y[0]+Kl.y*.6),L*(Wg.z[0]+Kl.z1)*.5])[2];
  /* (P.vol, optional: the floret in volume, washes of flat paint laid one over another (shared paints: a bouquet's slabs merge them). The
     banner's face: its outline at the rim's tone (rim, darker), its body (mid [k, o]: the outline shrunk by k toward a point o of its radius
     toward the light), its shaded half (hf, opacity), the pale fan of its claw (claw [half width, height on the banner, + lightness]) and the eye;
     its back: one tone and the shaded half. The wings and keel: their body, a shade away from the light (wsh [k, o, - lightness]) and a highlight
     toward it (whl [k, o, + lightness]). Level 0: the banner and the wings one tone each; out of zoom (q1) the calyx left out and the wings and keel one body. Species without
     vol: unchanged) */
  const VO=P.vol;
  if(VO){const q1m=!!(P.q1&&!c.det&&L<P.q1),tq=Math.max(.4,L*.05),pth=Pv=>q1m?grQI(grCCW(svSimp(Pv.map(sc0),tq))):c.d2(svSimp(Pv,tol)),
      /* (VO.rev, optional: each half of the banner painted by the face it turns to the view: seen from its side, the half folded toward the eye
         shows its inner face (the revers), the other its back; else the darker half a wash over the banner) */
      shade=fc=>{const n1=lv(nh(1)),n2=lv(nh(-1)),dk=n1[0]<n2[0]?1:-1,ld=Math.min(n1[0],n2[0]);let dn=0;
        if(VO.rev)for(const[s,n]of[[1,n1],[-1,n2]])if(n[1]!==frS){c.put({d:half(s),f:c.col(n[0],f,n[1]?'fr':'bk')});if(s===dk)dn=1}
        if(!dn&&Math.abs(n1[0]-n2[0])>.05)c.put({d:half(dk),f:c.col(ld,f,fc),fo:VO.hf||.5})},
      /* (VO.th [x L, below which |view z| of the banner's normal]: seen edge-on, the banner's outline stroked so wide, its petal's thickness and
         rolled margin: darker on its face, the inner face's pale lip on its back; nothing seen face-on) */
      ezN=Math.abs(V3.nz(c.Vd(Nn[3]))[2]),thW=VO.th&&!q1m?L*VO.th[0]*svSm((VO.th[1]-ezN)/VO.th[1]):0,thk=(p,col)=>{if(thW>.15){p.s=col;p.sw=svF(thW)}c.put(p)};
    const banner=()=>{const bo=edge(1).concat([SP(.55,nv),nch,SP(-.55,nv)],edge(-1).reverse()).map(c.V);
      if(!frS){thk({d:pth(bo),f:c.col(lS,f,'bk')},c.col(Math.min(1,lS+.12),f,'fr'));if(!q1m&&lod>1)shade('bk');return}
      if(!lod){c.put({d:pth(bo),f:c.col(lS,f,'fr')});return}
      thk({d:pth(bo),f:c.col(lS-VO.rim,f,'fr')},c.col(lS-VO.rim,f,'fr'));c.put({d:pth(grPapShr(bo,VO.mid[0],VO.mid[1])),f:c.col(lS,f,'fr')});if(!q1m&&lod>1)shade('fr');
      if(e>.25&&dry<.5){const K=VO.claw,cw=[];for(let a=0;a<=8;a++){const t=a/8*Math.PI;cw.push(c.V(V3.add(SPv(K[0]*Math.cos(t),K[1]*Math.sin(t)),V3.sc(Nn[1],L*.005))))}
        c.put({d:pth(cw),f:c.col(Math.min(1,lS+K[2]),f,'fr')});
        if(!q1m||L>(VO.eyeL||6)){const E2=P.eye||[.38,.2],k2=E2[1]/.2;
          c.put({d:pth([[0,.02],[-.2*k2,.1],[-.12*k2,.26],[0,E2[0]],[.12*k2,.26],[.2*k2,.1]].map(([u,v])=>c.V(V3.add(SPv(u,v),V3.sc(Nn[1],L*.01))))),f:c.wc(c.m.eye,f)})}}},
      body=(P2,lw,rp)=>{const H2=hull2(P2);c.put({d:pth(H2),f:c.col(lw,f,rp)});if(!lod)return;c.put({d:pth(grPapShr(H2,VO.wsh[0],-VO.wsh[1])),f:c.col(lw-VO.wsh[2],f,rp)});
        c.put({d:pth(grPapShr(H2,VO.whl[0],VO.whl[1])),f:c.col(Math.min(1,lw+VO.whl[2]),f,rp)})},
      parts=[{z:zStd,fn:banner}];
    if(!q1m)parts.push({z:zCal,fn:()=>c.put({d:calD(1),f:c.col(v0*.82,f,'cal')})});
    if(lod>1&&!q1m){for(const s of[-1,1])parts.push({z:zW(s),fn:()=>body(wingP(s),lv([s,.15,0])[0],'wing')});
      parts.push({z:zK-L*.01,fn:()=>{const[lk]=lv([0,1,.2]);c.put({d:hullD(keelP()),f:c.col(lk,f,'keel')})}})}
    else parts.push({z:(zW(-1)+zW(1))/2,fn:()=>body(wingP(-1).concat(wingP(1),keelP()),lv([0,.6,.8])[0]*.9,'wing')});
    parts.sort((a,b)=>a.z-b.z);for(const p of parts)p.fn();return}
  if(lod===0){const wp=wingP(-1).concat(wingP(1));
    /* (P.q1: below this length, out of zoom, the floret one hull of whole units: a bouquet's few pixels) */
    if(P.q1&&!c.det&&L<P.q1){const tq=Math.max(.5,L*.07),Sq=svSimp(edge(1).concat([SP(.55,nv),nch,SP(-.55,nv)],edge(-1).reverse()).map(c.V).map(sc0),tq);
      c.put({d:L<5?grPI(grCCW(svSimp(hull2(edge(1).concat(edge(-1)).map(c.V).concat(wp)),Math.max(.5,L*.1)).map(sc0))):grQI(grCCW(Sq))+grQI(grCCW(svSimp(hull2(wp),tq).map(sc0))),f:c.col(v0*.85,f,'lo')});return}
    c.put({d:stdOut()+hullD(wp),f:c.col(v0*.85,f,'lo')});return}
  const parts=[{z:zCal,fn:()=>c.put({d:calD(1),f:c.col(v0*.82,f,'cal')})},
    {z:zStd,fn:()=>{c.put({d:stdOut(),f:c.col(lS,f,rS)});if(lod<2)return;
      const n1=lv(nh(1)),n2=lv(nh(-1)),dk=n1[0]<n2[0]?1:-1,ld=Math.min(n1[0],n2[0]);if(Math.abs(n1[0]-n2[0])>.05)c.put({d:half(dk),f:c.col(ld,f,(dk>0?n1:n2)[1]?'fr':'bk')});
      if(frS&&e>.25&&dry<.4){const E2=P.eye||[.38,.2],k2=E2[1]/.2;c.put({d:c.d2([[0,.02],[-.2*k2,.1],[-.12*k2,.26],[0,E2[0]],[.12*k2,.26],[.2*k2,.1]].map(([u,v])=>c.V(V3.add(SPv(u,v),V3.sc(Nn[1],L*.01))))),f:c.wc(c.m.eye,f)})}}}];
  if(lod===1){const wp=wingP(-1).concat(wingP(1),keelP());
    /* (P.q1, out of zoom: the banner and the wings as half-unit splines, the calyx left out) */
    if(P.q1&&!c.det&&L<P.q1){const tq=Math.max(.4,L*.05);parts.length=0;parts.push({z:zStd,fn:()=>c.put({d:grQI(grCCW(svSimp(edge(1).concat([SP(.55,nv),nch,SP(-.55,nv)],edge(-1).reverse()).map(c.V).map(sc0),tq))),f:c.col(lS,f,rS)})},
      {z:(zW(-1)+zW(1))/2,fn:()=>c.put({d:grQI(grCCW(svSimp(hull2(wp),tq).map(sc0))),f:c.col(lv([0,.6,.8])[0]*.9,f,'wing')})})}
    else parts.push({z:(zW(-1)+zW(1))/2,fn:()=>c.put({d:hullD(wp),f:c.col(lv([0,.6,.8])[0]*.9,f,'wing')})})}
  else{for(const s of[-1,1])parts.push({z:zW(s),fn:()=>{const[lw]=lv([s,.15,0]);c.put({d:hullD(wingP(s)),f:c.col(lw,f,'wing')})}});
    parts.push({z:zK-L*.01,fn:()=>{const[lk]=lv([0,1,.2]);c.put({d:hullD(keelP()),f:c.col(lk,f,'keel')})}})}
  parts.sort((a,b)=>a.z-b.z);for(const p of parts)p.fn()};
/* the pea flower's bud: a pointed pod, a little curved toward its back, on its calyx; green when young, its tip darkest */
function grPeaBud(c,f,lod){const P=c.P,cal=P.cal,gb=f.gb??0,gr=f.gr??1,Lb=f.L*(P.bud[0]+P.bud[1]*gr)*(1-.2*svSm(f.w/.6)),W=Lb/P.budHW*(f.gt.W||1),
    zc=f.L*cal[0]*(.65+.35*gr),ey=c.eye,sideE=V3.nz(V3s(ey,V3.sc([0,0,1],ey[2]))),nS=V3l(sideE)>.1?V3.nz(c.Vd(sideE)):c.Vd([1,0,0]),v0=c.lit(nS),tol=Math.max(.08,Lb*.03),
    cf=t=>f.L*(.7+.3*gr)*(cal[1]+(cal[2]-cal[1])*Math.pow(t,.7)),calD=c.d2(svSimp(grRevO(c,zc,cf,[0,.4,.8,1],1,null),tol)),
    prof=P.bprof||[[0,.45],[.12,.78],[.35,1],[.6,.9],[.8,.6],[.93,.3],[1,.06]],rf=t=>W*.5*grProf(prof,t);
  const V0=c.V,z0=zc*.55;c.V=p=>V0([p[0],p[1],p[2]+z0]);grBend(c,Lb*.8,(P.bbow||0)*(.4+.6*gr));
  const bp=svSimp(grRevO(c,Lb,rf,lod>0?GR_T2:GR_T0,1,null),tol),body=c.d2(bp),bc=c.col(v0*.85,f,'bud',gb),cc=c.col(v0*.8,f,'cal',gb*.7);
  const pod=()=>{c.put({d:body,f:bc});if(lod>1&&gb<.9)c.put({d:c.d2(svSimp(grRevO(c,Lb,t=>t<.5?rf(.5)*.2:rf(t)*1.01,[.5,.62,.74,.86,.94,1],1,null),tol)),f:c.col(v0*.6,f,'bud',gb*.6)});
    /* (P.vol.bh [k, o, + lightness], optional: a highlight on the pod, its outline shrunk toward the light) */
    const BH=P.vol&&P.vol.bh;if(BH&&lod>0)c.put({d:c.d2(grPapShr(bp,BH[0],BH[1])),f:c.col(Math.min(1,v0*.85+BH[2]),f,'bud',gb)})};
  if(lod===0){c.put({d:P.q1&&!c.det&&f.L<P.q1?(f.L<5?grPI:grQI)(grCCW(svSimp(grRevO(c,Lb,rf,GR_T0,1,null),Math.max(.5,Lb*.12)).map(sc0))):body,f:bc});return}
  if(ey[2]>0){c.put({d:calD,f:cc});pod()}else{pod();c.put({d:calD,f:cc})}}
/* an outline as a polygon of whole units in relative moves: the cheapest path, for florets of a few pixels (screen points) */
function grPI(P){if(P.length<3)return'';let x=Math.round(P[0][0]),y=Math.round(P[0][1]),d='M'+x+' '+y,k=0;
  for(let i=1;i<P.length;i++){const X=Math.round(P[i][0]),Y=Math.round(P[i][1]);if(X===x&&Y===y)continue;d+='l'+(X-x)+(Y-y<0?'':' ')+(Y-y);x=X;y=Y;k++}return k<2?'':d+'z'}
/* the same outline as a smooth closed spline (grQ) in units of 1/k (half units by default), relative: a floret of ten pixels without facets */
function grQI(P,k=2){const n=P.length;if(n<3)return'';const rq=x=>Math.round(x*k)/k,R=P.map(p=>[rq(p[0]),rq(p[1])]),md=i=>{const a=R[i%n],b=R[(i+1)%n];return[rq((a[0]+b[0])/2),rq((a[1]+b[1])/2)]},
    j=(a,b)=>a+(b<0?'':' ')+rq(b);let c=md(0),d='M'+c[0]+' '+c[1];
  for(let i=1;i<=n;i++){const v=R[i%n],m=md(i);d+='q'+j(j(j(v[0]-c[0],v[1]-c[1]),m[0]-c[0]),m[1]-c[1]);c=m}return d+'z'}
