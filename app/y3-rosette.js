/* ---------- y3-rosette.js: the double rosette (svRosette), a kit piece for every flower of many petals on a spiral ----------
   Double ranunculi, peonies, roses, camellias: dozens of spoon-shaped petals, from the outermost (rank f = 0) to the heart (f = 1), on one spiral
   (the golden angle) or in staggered whorls; each petal cupped across in a true arc and incurved along its length, tight and folded over the heart
   at the centre, the ranks opening outward one after another; a calyx of sepals behind; the heart (an eye of carpels, a button, stamens) is the
   species' own hook. The bud wraps every rank on an egg, the inner ones inside. Its life in the vase: it opens too far (the outer ranks reflex,
   the heart loosens), the margins thin, wave and brown, the head tips toward the ground, then the petals go limp and fall from the outside in.
   Made for many petals within a budget (about 100 elements a head at DET 1):
   - every petal is ONE path: its outline, one tone from the light computed on its sampled surface, a thin dark edge;
   - the order is the engine's (svOrder, pair by pair on the sampled surfaces), and the pairs that cross are patched as svDraw does;
   - the modelling is laid per run of consecutive petals in that order (a few paths each): the shadow the run casts on what lies behind it, the
     washes of shade and light computed on each petal's surface (hidden where a later petal of the run covers it), the paler margins, the veins
     in close-ups. Nothing hidden is drawn: the heart is thinned at DET 1, the closed bud draws only its outer ranks.
   A spec gives only what differs from SVR_DEF: genes(seed) (svGenes), mat(colourway), heart(ctx), sep (the calyx), life(); a number by rank is a
   table [[f, value]...] (or one number). Colours by rank come from mat: fr (inner face) and bk (back), tables [[f, colour]...]. */
const SVR_DEF={
  /* the arrangement: one spiral at the angle div (the golden angle) or whorls of nw petals each, staggered ('whorl'); at DET 1 the ranks beyond
     thin[0] keep thin[1]-1 petals in thin[1] (their neighbours hide the others), a little wider (thinW) */
  phy:'gold',div:2.39996,nw:8,thin:[.42,3],thinW:1.12,
  /* fW (whorls only): 1 reads the tables by rank (shape, angles, opening) at one f per whorl, its first petal's, so a whorl is one ring and the
     variety within it comes from the genes; 0 reads them petal by petal (a gradient round each whorl) */
  fW:0,
  /* by rank: length and width (× R0), insertion radius and height (× R0: the receptacle's dome), cupping across */
  L:[[0,.86],[.5,.6],[1,.28]],W:[[0,.8],[.5,.6],[1,.34]],r0:[[0,.2],[1,.03]],z0:[[0,-.03],[1,.12]],cup:[[0,.45],[1,.85]],
  /* the outline: a claw (its width, the rest) to the broadest point vb, then the round tip; how the spine bends along (aPow); each petal turned a little
     on its midrib (lap), so that neighbours lie one over the other */
  vb:.6,claw:[.32,.68],clawK:1.1,aPow:1.2,lap:.2,
  /* the foot of every petal but the outer ones lies hidden in the cups round it: it is not drawn (vTrim by rank, a share of the length) */
  vTrim:[[0,0],[.06,0],[.16,.22],[1,.3]],
  /* the spine's angle from the axis (radians) at the foot (a0) and at the tip (a1): closed (c) and open (o) by rank; the decline adds wA0, wA1 */
  a0c:[[0,.4],[1,.1]],a0o:[[0,1.45],[.5,1],[1,.35]],a1c:[[0,-.15],[1,-.75]],a1o:[[0,1.3],[.5,.6],[1,-.35]],wA0:[[0,.3],[1,.6]],wA1:[[0,.5],[1,.9]],
  /* the opening of rank f: o = svSm((op − t0 − dt·f)/dur)·(1 − mx·f^1.5): the outer ranks first, the heart never quite */
  oLaw:[.2,.35,.8,.45],oTip:1,
  /* or the globe (null: the angles above): by opening (op), the ellipsoid of the rims (half width Rx, half height Rz, centre zc, all × R0), the polar
     angle of the outer rim th0 and of the heart's th1, how the ranks spread between them (gam), how much flatter the outer arcs are (flat); dec: what
     the decline adds (fan: what the fading adds to that). The bend of each petal's arc by rank (bend), its width from what its row needs (wRow: overlap, nRow: petals in a row) kept
     between wMin and wMax of its length */
  globe:null,bend:[[0,.8],[1,1.6]],Lmax:[[0,1],[1,.4]],wRow:1.4,nRow:7,wMin:[[0,.5],[1,.35]],wMax:[[0,.95],[1,.8]],
  /* life: bud, decline, faded, the petals falling from the outside in (shedF: the share of ranks gone; a few hang on), the head tipping */
  bud:[.08,.34],dec:[.1,.4],fan:[.55,.2],shed:[.8,.17],shedF:.85,shedK:.07,fanK:[.08,.1,.5],limpF:.5,tip:[[.2,.15,.4],[.9,.5,.3]],limp:[.95,.2],sag:[.05,.1,.2],
  /* the bud: an egg (height × R0 [base, + growth], radius / height, its profile), how far round the outer petals wrap, the inner ranks inside;
     which ranks are seen while it is closed (budVis + the rest as it opens); budT: how much lower on the egg the outermost tips stop (imbricate) */
  budH:[.62,.22],budR:.46,budE:[.08,.89],budP:.8,budW:1.5,budIn:.45,budVis:.15,budT:0,
  /* margins: waved (bud, decline, faded multipliers), reflexed and crinkled as they fade; the tips curl back in the decline */
  wav:[.7,1.5,2.5],rev:[.3,.3],crk:[.04,.1],curl:[.15,.35],
  /* the margins brown as it fades (the colour, how much in the decline and when faded, the margin's width grows) */
  brown:'#8a5e36',edgeB:[.35,.7],edgeBW:1.8,
  /* the young bud's green (amount, from, over) and its colour */
  green:[.55,.04,.2],greenC:'#86a45a',
  /* the floor under the petals' feet (how far its colour goes toward the shade; 0: none), drawn while less than floorK of the ranks have fallen */
  floor:.55,floorK:2,floorF:0,
  /* the core under the rows (globe mode): the share of the globe it fills (0: none) */
  core:.72,coreFan:0,
  /* the calyx (null: none) */
  sep:null,
  /* drawing (mid: the spoon's crease down the inner face, from v mid[0] to mid[1], its width × D and opacity at DET 1 and 1.5; 0: none; midO: the
     crease as a fold, its shade shifted toward the light and a light line (opacity × midL) away from it, × D; midIn: the crease and the veins only
     where they lie inside their piece's outline (a cupped piece seen across at more than 45 degrees: its near rim's back hides its midline, which
     falls outside the outline drawn from its edges, over a neighbour or the background); shdB: how much of the cast shadow
     the closed bud loses; budFace: from this much bud on, each piece on the egg is drawn by the part of it that faces the eye; sepLay: from this much bud on, each sepal is drawn wholly behind or in front of the petals, by its votes):
     sampling (DET 1, DET 1.5), the run length, wash levels relative to the petal's mean light and their opacities, how far the tone follows
     the light (dark, light), the margin and edge strokes (× D), the cast shadow (offset, blur, opacity), occlusion toward the heart, patches */
  nu:[4,6],nv:[6,9],run:[9,12],dark:[[],[]],da:[.3,.3],lit:[[],[1.12]],la:[.24,.22],aoV:[[],[.2,.38]],aoA:[.28,.18],wmin:.22,kd:1.25,kl:1.1,kmed:1,wb:.008,
  rimW:.009,rimA:.42,brimA:.14,mid:[.25,.85],midW:.012,midA:[0,0],midO:0,midL:0,midIn:0,shdB:0,sepLay:0,budFace:0,faceSm:0,budCore:0,edgeW:.004,edgeA:.3,veinW:.0022,veinA:.22,shd:[.012,.012,.18],ao:[.45,.35,.15,.3],pmin:3,pshare:.2,parea:.06,pmax:4,eps:.012,cull:.97,simp:[1.8,1.2],
  light:{wrap:.32,amb:.3,dif:.68,sky:.14,ks:.06,gloss:10,trans:.28}};
/* a number by rank: one number, or a table [[f, value]...] read linearly */
const svrT=(T,f)=>{if(typeof T==='number')return T;if(f<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(f<=T[i][0]){const t=(f-T[i-1][0])/(T[i][0]-T[i-1][0]);return T[i-1][1]+(T[i][1]-T[i-1][1])*t}return T[T.length-1][1]};
/* a colour by rank: one colour, or a table [[f, colour]...] */
const svrC=(T,f)=>{if(typeof T==='string')return T;if(f<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(f<=T[i][0])return mix(T[i-1][1],T[i][1],(f-T[i-1][0])/(T[i][0]-T[i-1][0]));return T[T.length-1][1]};
/* is a screen point inside a closed polygon (even-odd) */
const svrIn=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
/* one piece (petal or sepal) as a sheet in the head's frame: its spine leaves the receptacle at (r0, z0) toward its azimuth phi, its angle from the
   axis going from a0 at the foot to a1 at the tip (a1 < a0: the tip turned in, the spoon), limp toward the ground as it fades; the outline a narrow
   claw then a round tip; cupped across in a true arc, turned on its midrib (lap, tw), waved; on the bud's egg while closed (bud > 0: the egg of
   height Hb scaled by sc for the inner ranks, wrapped wrap radians each side, up to top of its height). q: {phi,L,Wd,r0,z0,a0,a1,cup,tw,wav,rev,
   crk,curl,limp,bud,Hb,sc,wrap,top,t (the piece's genes: tip, asym, wk, wph, hang)} */
function svrSurf(P,B,R0,q){const t=q.t,rad=[Math.cos(q.phi),Math.sin(q.phi),0],T=[-Math.sin(q.phi),Math.cos(q.phi),0],ns=DET>=1.5?16:12,sp=[],dv=[],
    dn0=[0,-1,0],dnL=[V3.dot(B[0],dn0),V3.dot(B[1],dn0),V3.dot(B[2],dn0)];
  let p=[rad[0]*q.r0,rad[1]*q.r0,q.z0];
  for(let j=0;j<=ns;j++){const v=j/ns,a=q.a0+(q.a1-q.a0)*Math.pow(v,P.aPow)+q.curl*svSm((v-.6)/.4);let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
    /* a limp piece hangs: its spine gives way toward the ground, more toward the tip */
    if(q.limp>0){const hk=Math.min(.94,q.limp*Math.pow(v,.5)*(.55+.45*(t.hang||1)));let dn=dnL,c=V3.dot(d,dn);if(c<-.25){dn=V3.nz(V3.add(dnL,[0,0,1.5]));c=V3.dot(d,dn)}
      const an=Math.acos(Math.max(-1,Math.min(1,c)));if(an>1e-3){const s0=Math.sin(an);d=V3.nz(V3.add(V3.sc(d,Math.sin((1-hk)*an)/s0),V3.sc(dn,Math.sin(hk*an)/s0)))}}
    if(j)p=V3.add(p,V3.sc(d,q.L/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},vb=P.vb,
    half=l=>(l<vb?P.claw[0]+P.claw[1]*Math.pow(Math.sin(Math.min(1,l/vb)*Math.PI/2),P.clawK):1)*q.Wd/2,
    Lu=P.marg?u=>vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),t.tip||2)),1/(t.tip||2))-P.marg(u,t,q):u=>vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),t.tip||2)),1/(t.tip||2));
  /* opt-in hooks (absent: the same surface): P.marg(u,t,q) cuts the tip line (a share of the length: teeth, a fringe); P.ruf(u,v,t,q) lifts the
     surface by that many half widths (pleats, a ruffled limb) */
  return(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),nrm=V3.cr(d,T),ca=Math.cos(q.tw*vv),sa=Math.sin(q.tw*vv),A=V3.add(V3.sc(T,ca),V3.sc(nrm,sa)),
      hw=half(vv)*(1+(t.asym||0)*Math.sign(u)),cf=q.cup*(.15+.85*svSm(vv/.5)),ph=2*cf*u,arc=Math.abs(ph)>1e-4,tx=arc?hw*Math.sin(ph)/(2*cf):u*hw,
      lift=(arc?hw*(1-Math.cos(ph))/(2*cf):0)+P.lap*u*hw*svSm(vv/.3)+q.wav*hw*Math.pow(Math.abs(u),1.5)*Math.sin((t.wk||2)*Math.PI*vv+(t.wph||0)+u*.8)*svSm(vv/.35)
        -q.rev*hw*Math.pow(Math.abs(u),4)+q.crk*hw*Math.sin(u*Math.PI*(2.2+(t.wk||2)*.4)+(t.wph||0)*2+vv*5)*svSm(vv/.25)+(P.ruf?P.ruf(u,vv,t,q)*hw:0),
      Pt=V3.add(V3.add(c,V3.sc(A,tx)),V3.sc(nrm,lift));if(!(q.bud>0))return Pt;
    /* the bud: the piece lies on an egg (each line across wraps round it), the inner ranks on smaller eggs inside, the tips meeting at the top */
    const Rb=q.Hb*P.budR*q.sc,ve=v*(.35+.65*Lu(u))*q.top,rr=Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*ve)),P.budP)+R0*.004,
      th=q.phi+u*q.wrap*(.5+.5*svSm(ve/.35)),zb=q.z0*.3+q.Hb*q.sc*ve-R0*.05;
    return V3.add(V3.sc(Pt,1-q.bud),V3.sc([Math.cos(th)*rr,Math.sin(th)*rr,zb],q.bud))}}
/* the tone of a piece: its colour toward the shade or the light by its mean light km, relative to kref (the head's median: the colour measured on
   photographs is the colour seen on average) */
const svrTone=(P,c,dk,lt,km,kref)=>{const k=km/kref;return k<1?mix(c,dk,Math.min(.8,(1-k)*P.kd)):mix(c,lt,Math.min(.65,(k-1)*P.kl))};
/* any surface Sf(u,v) (a petal, a sepal, a leaf's lobe) as one light item: sampled (nu x nv), its outline on the screen, its tone (the light computed
   on its seen face: inner fr, back bk, by rank f; shade, lite), for the order and the runs of svrDraw. o: {shift (the individual's shade), gt (the young
   bud's green), tol, nu, nv} */
function svrItem(P,B,O,Sf,mt,f,grp,o={}){const hi=DET>=1.5,nu=o.nu||P.nu[hi?1:0],nv=o.nv||P.nv[hi?1:0],sh=svSheet(B,O,Sf,{nu,nv}),light=P.light,ref=svLight([0,0,1],light,1),
    sh0=o.shift||(c=>c),gt=o.gt||0,tol=o.tol||.1;let sF=0;for(const x of sh.F)sF+=x;const s=o.face?-1:sF>=0?1:-1,K=new Float32Array(sh.F.length);let kS=0,kN=0;
  /* on the closed bud's egg (o.face) a piece wraps past the egg's outline: only the part whose back faces the eye is seen (the rest lies behind
     the egg), so its outline is that part's (one filled outline of the whole piece would fold its far half over its neighbours' near halves) */
  let fo=null,fd='';if(o.face){const loops=svIso(nu,nv,Array.from(sh.F,x=>-x),0);let ba=0;const ls=[];for(let L of loops){
    /* faceSm: smoothing passes over the loop in grid space (the iso line steps from cell to cell: teeth on a calyx seen from the side) */
    for(let k=0;k<(P.faceSm||0);k++){const n=L.length;L=L.map((p,i)=>{const a=L[(i-1+n)%n],b=L[(i+1)%n];return[(a[0]+2*p[0]+b[0])/4,(a[1]+2*p[1]+b[1])/4]})}
    const q=L.map(([gi,gj])=>svAt(sh,-1+2*gi/nu,gj/nv)),a=svArea(q);ls.push([q,a]);if(a>ba){ba=a;fo=q}}
    if(!fo)return null;for(const[q,a]of ls)if(a>ba*.05)fd+=svSpl(svSimp(q,tol*(P.simp?P.simp[hi?1:0]:1)))}
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const k=j*sh.W+i,fr=sh.F[k]>=0,n=fr?sh.N[k]:V3.sc(sh.N[k],-1),v=j/nv,ao=fr?1-P.ao[0]*(1-svSm((v-.02)/P.ao[1])):1-P.ao[2]*(1-svSm(v/P.ao[3]));
    K[k]=svLight(n,light,ao)/ref;if(fr===(s>0)){kS+=K[k];kN++}}
  const km=kN?kS/kN:1;let out=[],ouv=null;if(fo)out=fo;else{ouv=[];for(let j=0;j<=nv;j++){out.push(sh.P[j*sh.W]);ouv.push([-1,j/nv])}const nt=P.tipN?P.tipN[hi?1:0]:hi?11:8;for(let i=1;i<nt;i++){out.push(svAt(sh,-1+2*i/nt,1));ouv.push([-1+2*i/nt,1])}
    for(let j=nv;j>=0;j--){out.push(sh.P[j*sh.W+nu]);ouv.push([1,j/nv])}out.push(svAt(sh,0,0));ouv.push([0,0])}
  const col=sh0(s>0?svrC(mt.fr,f):svrC(mt.bk,f)),gk=gt>0&&mt.green!==false?Math.min(1,gt*(s>0?.85:1)*(1-.4*f)):0,c2=gk?mix(col,P.greenC,gk):col,
    /* the young bud's green reaches its shade and its light too (else a green bud lit from above turns the colourway's pale) */
    dk=mix(sh0(s>0?mt.shade:mt.bshade),mix(P.greenC,'#0e1a06',.65),gk),lt=mix(sh0(s>0?mt.lite:mt.blite),mix(P.greenC,'#f4f8e0',.45),gk),tone=svrTone(P,c2,dk,lt,km,o.kref||1);
  /* for the order, the cells of its seen face only (a cupped piece seen edge-on folds over itself: its far layer would blur the comparison) */
  let cells=svCells(sh,s);if(cells.length<3)cells=svCells(sh,0);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,z=0;for(const c of cells){x0=Math.min(x0,c.x0);y0=Math.min(y0,c.y0);x1=Math.max(x1,c.x1);y1=Math.max(y1,c.y1);z+=c.cz}
  sh._i=grp==='p'?Math.round(f*100):grp==='s'?-1:-2;/* the piece's rank, for the patch report (?dbgp=1) */
  /* P.fold (opt-in) [v, k]: a pleated piece seen along its folds (edge-on) has a silhouette its outline does not enclose (the outline projects
     to a sliver, the pleats' faces fall outside it). Where the outline's area is under k times its cells' area, the convex hulls of narrow
     strips across the piece (n [DET 1, DET 1.5] of them, sampled on the surface itself), up to v of its length (the teeth stay cut by the
     outline), are added to its fill, wound like the outline. Opt-in too: [3] the strips cut into that many hulls across (a ruffled piece seen
     from above: one hull across its whole width would fill the hollows between its waves), [4] the last rank f they reach */
  let dx='';if(P.fold&&!fo&&grp==='p'&&out.length>2&&(P.fold[4]==null||f<=P.fold[4])){const W=sh.W,sa=L=>{let a=0;for(let i=0,n=L.length;i<n;i++){const p=L[i],q=L[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return a/2};
    let ca=0;for(let j=0;j<nv;j++)for(let i=0;i<nu;i++)ca+=Math.abs(sa([sh.P[j*W+i],sh.P[j*W+i+1],sh.P[(j+1)*W+i+1],sh.P[(j+1)*W+i]]));const ao=sa(out);
    if(Math.abs(ao)<P.fold[1]*ca){const ns=P.fold[2]?P.fold[2][hi?1:0]:8,row=v=>{const r=[];for(let i=0;i<=nu;i++)r.push(svAt(sh,-1+2*i/nu,v));return r};let r0=row(0);
      const nc=Math.max(1,Math.min(nu,P.fold[3]||1));
      for(let b=1;b<=ns;b++){const r1=row(P.fold[0]*b/ns);for(let c=0;c<nc;c++){const i0=Math.floor(c*nu/nc),i1=Math.ceil((c+1)*nu/nc)+1;
        let h=hull2(r0.slice(i0,i1).concat(r1.slice(i0,i1)));if(h.length<3)continue;
        /* twice: the outline's own lobes wound the other way (a folded tip line) would cancel a single strip under the nonzero rule */
        if((sa(h)>0)!==(ao>0))h=h.reverse();const hs='M'+h.map(p=>svF(p[0])+','+svF(p[1])).join('L')+'Z';dx+=hs+hs}r0=r1}}}
  const dO=fo?fd:svSpl(svSimp(out,tol*(P.simp?P.simp[hi?1:0]:1)));
  return{kind:'pet',grp,sh,px:sh,s,K,km,out,ouv,tone,c2,dk,lt,mt,f,gk,face:!!fo,cells,bb:[x0,y0,x1,y1],z:z/cells.length,d:dO+dx,dO:dx?dO:null}}
/* a drawn part of the head (the heart) for the order: fn draws it, px is a sheet over its visible surface (for the order and the patches) */
function svrFn(fn,px,zb){const cells=svCells(px,0);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,z=0;for(const c of cells){x0=Math.min(x0,c.x0);y0=Math.min(y0,c.y0);x1=Math.max(x1,c.x1);y1=Math.max(y1,c.y1);z+=c.cz}
  return{kind:'fn',fn,px,cells,bb:cells.length?[x0,y0,x1,y1]:[0,0,-1,-1],z:(cells.length?z/cells.length:0)+(zb||0)}}
/* the head: in the frame B at O, D across, opening op (0 bud .. 1 open), wilted wl (0 fresh .. 1 dry), colourway cwx ({id,...}), spec S */
function svRosette(par,B,O,D,S,cwx,op,seed,wl){const P=S._r||(S._r=Object.assign({},SVR_DEF,S)),g=P.genes(seed),cw=P.mat(cwx),R0=D/2,hi=DET>=1.5,Dm=D,tol=Math.max(.06,Dm*.0035);
  if(wl==null)wl=P.life?P.life():0;
  /* the wilting head gives way: it tips toward the ground on its softened neck */
  {const tip=P.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0),ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);if(tip>0&&al>.05){const A=V3.sc(ax,1/al);B=B.map(r=>rotA(r,A,Math.min(tip,Math.acos(Math.max(-1,Math.min(1,-B[2][1])))*.95)))}}
  const bud=1-svSm((op-P.bud[0])/P.bud[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]),
    gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),Hb=R0*(P.budH[0]+P.budH[1]*svSm((op-.02)/.3)),N=g.n,items=[],
    sh0=c=>svShift(c,g.dh||0,g.ds||0,g.dl||0),fvis=P.budVis+(1-P.budVis)*Math.pow(1-bud,1.5),
    dn0=[0,-1,0],dA=q=>toV(B,V3.add(V3.sc([Math.cos(q.phi),Math.sin(q.phi),0],Math.sin(q.a1)),[0,0,Math.cos(q.a1)]))[1]*dn0[1];
  const piece=(q,grp,mt,f)=>{const S0=svrSurf(P,B,R0,q),v0=grp==='p'?svrT(P.vTrim,f):0;const it=svrItem(P,B,O,v0>0?(u,v)=>S0(u,v0+(1-v0)*v):S0,mt,f,grp,{shift:sh0,gt,tol,face:P.budFace>0&&bud>=P.budFace});if(it)items.push(it)};
  /* the globe of the stage (globe mode): tables by opening, plus what the decline adds */
  const GL=P.globe?(()=>{const G=P.globe,x=op+(g.op||0),o={};for(const k of['Rx','Rz','zc','th0','th1','gam','flat'])o[k]=svrT(G.op.map((a,i)=>[a,G[k][i]]),x)+(G.dec&&G.dec[k]?G.dec[k]*dec:0)+(G.fan&&G.fan[k]?G.fan[k]*fan:0);
    for(const k of['Rx','Rz','zc'])o[k]*=R0;return o})():null;
  /* the petals, outermost first */
  for(let i=0;i<N;i++){const t=g.tep[i],f=N>1?i/(N-1):0,fq=P.fW&&P.phy==='whorl'&&N>1?Math.floor(i/P.nw)*P.nw/(N-1):f;
    if(f>fvis)continue;
    const thin=!hi&&f>P.thin[0];if(thin&&i%P.thin[1]===P.thin[1]-1)continue;
    /* faded: the outer ranks fall first, a few petals hang on */
    if(shed>0&&f<shed*P.shedF&&pxHashS(i,31,g.sd)>P.shedK)continue;
    const phi=(P.phy==='whorl'?(i%P.nw+(Math.floor(i/P.nw)%2)*.5)/P.nw*6.2832:i*P.div)+g.rot+t.dph,ol=P.oLaw,o=svSm((op+(g.op||0)-(ol[0]+ol[1]*fq))/ol[2])*(1-ol[3]*Math.pow(fq,1.5)),
      q={phi,t,f,L:R0*svrT(P.L,fq)*t.dL*(1-P.fanK[0]*fan),Wd:R0*svrT(P.W,fq)*t.dW*(thin?P.thinW:1)*(1-P.fanK[1]*fan),r0:R0*svrT(P.r0,fq),z0:R0*svrT(P.z0,fq),
        a0:svrT(P.a0c,fq)+(svrT(P.a0o,fq)-svrT(P.a0c,fq))*o+t.da0+svrT(P.wA0,fq)*dec,a1:svrT(P.a1c,fq)+(svrT(P.a1o,fq)-svrT(P.a1c,fq))*Math.pow(o,P.oTip)+t.da1+svrT(P.wA1,fq)*dec*(t.wl||1),
        cup:svrT(P.cup,fq)*(t.cup||1)*(1-P.fanK[2]*fan),tw:(t.tw||0)*(1-.6*bud),wav:(t.wav||0)*(1-P.wav[0]*bud)*(1+P.wav[1]*dec+P.wav[2]*fan),rev:P.rev[0]*dec+P.rev[1]*fan,crk:P.crk[0]*dec+P.crk[1]*fan,
        curl:(P.curl[0]*dec+P.curl[1]*fan)*(1-f),limp:P.limp[0]*fan*(1-P.limpF*f)+P.limp[1]*dec*(1-f),bud,Hb,sc:1-P.budIn*f,wrap:Math.PI/5*P.budW*(1-.3*f),top:1-P.budT*(1-Math.min(1,f/Math.max(.01,P.budVis)))};
    /* the globe: the rim of rank f on the ellipsoid of the stage (its polar angle th from the top), the petal the arc of bend De from its foot to
       that rim (its length follows), its width what its row needs round the head */
    if(GL){const th=GL.th1+(GL.th0-GL.th1)*Math.pow(1-f,GL.gam)+t.da1*.5,pr=[GL.Rx*Math.sin(th),GL.zc+GL.Rz*Math.cos(th)],dr=pr[0]-q.r0,dz=pr[1]-q.z0,c=Math.max(R0*.05,Math.hypot(dr,dz)),
        be=Math.atan2(dr,dz),De=Math.max(.05,svrT(P.bend,f)*(1-GL.flat*(1-f))+t.da0),L=Math.min(R0*svrT(P.Lmax,f),c*(De/2)/Math.sin(De/2));
      q.a0=be+De/2;q.a1=be-De/2;q.L=L*t.dL*(1-P.fanK[0]*fan);
      q.Wd=Math.max(svrT(P.wMin,f)*L,Math.min(svrT(P.wMax,f)*L,P.wRow*6.2832*(.35*q.r0+.65*pr[0])/P.nRow))*t.dW*(thin?P.thinW:1)*(1-P.fanK[1]*fan);
      q.a0+=svrT(P.wA0,f)*dec*.3;q.a1+=svrT(P.wA1,f)*dec*.3*(t.wl||1)}
    /* the tip's sag: an open petal leaning out is lowered a little by its weight */
    q.a1+=(P.sag[0]+P.sag[1]*o+P.sag[2]*dec)*(1-bud)*Math.max(0,dA(q))*(1-f);
    piece(q,'p',cw,f)}
  /* the calyx: sepals clasping the bud, spreading, then reflexed under the open head */
  const SP=P.sep;if(SP&&!(shed>.6&&SP.fall)&&!SVR_OFF.includes('sep')){const so=svSm((op-SP.open[0])/SP.open[1]);const fd=Object.assign({L:.3,W:.4,a0:.08,a1:.12,limp:.25,crk:.03},SP.fd);for(let i=0;i<SP.n;i++){const t0=g.sep?g.sep[i]:g.tep[i%N],t=SP.tip?Object.assign({},t0,{tip:SP.tip}):t0,phi=g.rot+(i+.5)/SP.n*6.2832+(t.dph||0)*.5,
      q={phi,t,f:-.1,L:R0*SP.L*(t.dL||1)*(1-fd.L*fan),Wd:R0*SP.W*(t.dW||1)*(1-fd.W*fan),r0:R0*SP.r0,z0:R0*SP.z0,a0:SP.a0[0]+(SP.a0[1]-SP.a0[0])*so+.2*dec+fd.a0*fan,a1:SP.a1[0]+(SP.a1[1]-SP.a1[0])*so+.25*dec+fd.a1*fan,
        cup:SP.cup,tw:0,wav:.02,rev:0,crk:fd.crk*fan,curl:0,limp:fd.limp*fan,bud,Hb,sc:1.12,wrap:Math.PI/SP.n*SP.wrap,top:SP.top[1]+(SP.top[0]-SP.top[1])*bud};piece(q,'s',SP.mat||cw.sep,0)}}
  /* the floor: a low cone on the receptacle, under the petals' hidden feet (so the heart never shows a hole) */
  if(P.floor&&bud<.2&&shed<P.floorK&&items.length&&!SVR_OFF.includes('floor')){const rf=R0*svrT(P.r0,0)*1.05,z1=R0*svrT(P.z0,1),z0f=R0*svrT(P.z0,0),fc=sh0(mix(svrC(cw.fr,.9),cw.shade,P.floor*(1-P.floorF*fan))),
      S=(u,v)=>{const a=(u+1)*Math.PI,r=rf*(1-v)+R0*.02;return[Math.cos(a)*r,Math.sin(a)*r,z0f+(z1-z0f)*Math.pow(v,1.4)]},px=svSheet(B,O,S,{nu:12,nv:3});
    items.push(Object.assign(svrFn(k2=>{const pts=[];for(let j=0;j<24;j++)for(const v of[0,.5,1]){const p=PJ(B,O,S(-1+2*j/24,v));pts.push([p[0],p[1]])}E('path',{d:svSpl(hull2(pts)),fill:fc},k2)},px,-R0*.05),{floor:1}))}
  /* the heart: the species' own (its items go in the same order) */
  if(P.heart&&!SVR_OFF.includes('heart'))P.heart({B,O,R0,D:Dm,g,cw,op,bud,dec,fan,shed,items,o:svSm((op+(g.op||0)-(P.oLaw[0]+P.oLaw[1]))/P.oLaw[2])});
  /* the core: the volume inside the rows (so that a gap between petals never shows the background), drawn first; faded or shedding, a smaller
     and darker one if coreFan (the dry head's crowded petals seen between the loose ones) */
  let core=null;const cF=fan<.15&&shed<.02;if(GL&&P.core&&bud<.3&&(cF||P.coreFan>0)){const sc=cF?P.core:P.coreFan,cc=sh0(mix(svrC(cw.fr,.6),cw.shade,cF?.22:.6)),pts=[];for(let i=0;i<=6;i++)for(let j=0;j<16;j++){const th=i/6*Math.PI*.55,a=j/16*6.2832,
      p=PJ(B,O,[Math.cos(a)*GL.Rx*sc*Math.sin(th),Math.sin(a)*GL.Rx*sc*Math.sin(th),GL.zc+GL.Rz*sc*Math.cos(th)]);pts.push([p[0],p[1]])}core=[svSpl(hull2(pts)),cc]}
  /* the closed bud's core (budCore: from this much bud on): the egg of the hidden ranks under the seen ones, in their shaded colour, so that the
     gaps where the tips meet at the top never show the background */
  else if(P.budCore>0&&bud>=P.budCore){const sc=(1-P.budIn*fvis)*.97,Rb=Hb*P.budR*sc,z0=R0*svrT(P.z0,fvis),pts=[],
      cc=sh0(mix(mix(svrC(cw.fr,fvis),P.greenC,Math.min(1,gt*.85)),mix(P.greenC,'#0e1a06',.6),.3));
    for(let i=0;i<=8;i++){const ve=i/8,rr=Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*ve)),P.budP),zb=z0*.3+Hb*sc*ve-R0*.05;for(let j=0;j<16;j++){const a=j/16*6.2832,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,zb]);pts.push([p[0],p[1]])}}
    core=[svSpl(hull2(pts)),cc]}
  {const ks=items.filter(it=>it.grp==='p').map(it=>it.km).sort((a,b)=>a-b),kref=ks.length?ks[ks.length>>1]:1;for(const it of items)if(it.kind==='pet'&&it.grp==='p')it.tone=svrTone(P,it.c2,it.dk,it.lt,it.km,kref*P.kmed)}
  /* P.lf (opt-in): the drawing options of svrDraw (zvis, wclip, lclip, patchLate, pedge...) for a kind drawn by svRosette itself */
  return svrDraw(par,items,P,cw,Dm,tol,P.lf?Object.assign({dec,fan,core,bud,sepLay:P.sepLay>0&&bud>=P.sepLay},P.lf):{dec,fan,core,bud,sepLay:P.sepLay>0&&bud>=P.sepLay})}
/* a byte report by kind of path, for the budget (?svrstat=1: added to the sheet's measures) */
/* the layers can be switched off to look at one (?svroff=wash,shadow,rim,edge) */
const SVR_OFF=typeof location!=='undefined'?((/[?&]svroff=([^&]*)/.exec(location.search)||[])[1]||''):'';
const SVR_ST=typeof location!=='undefined'&&/[?&]svrstat=1/.test(location.search)?{}:null;
const svrSt=(k,d)=>{if(SVR_ST&&d){SVR_ST[k]=(SVR_ST[k]||0)+d.length;if(!SVR_ST._w&&typeof window!=='undefined'&&window.svtOut){SVR_ST._w=1;const o=window.svtOut;window.svtOut=(svg,n,ms,sp)=>{o(svg,n,ms,sp);const r={};for(const q in SVR_ST)if(q!=='_w')r[q]=Math.round(SVR_ST[q]/1024/n*10)/10;const put=()=>{const e=document.getElementById('out');if(e)e.textContent+=' '+JSON.stringify(r);else setTimeout(put,50)};put()}}}};
/* a sheet's quads with their boxes (cached on it), and the nearest depth of the sheet under a screen point over all its quads, both faces
   (-Infinity where it is not): the depth test of lf.zvis */
function svrZq(sh){if(sh._zq)return sh._zq;const W=sh.W,q=[];let X0=1e9,Y0=1e9,X1=-1e9,Y1=-1e9;for(let j=0;j<sh.nv;j++)for(let i=0;i<sh.nu;i++){const ks=[j*W+i,j*W+i+1,(j+1)*W+i+1,(j+1)*W+i],P=ks.map(n=>sh.P[n]),Z=ks.map(n=>sh.Z[n]);
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}q.push({P,Z,x0,y0,x1,y1});X0=Math.min(X0,x0);Y0=Math.min(Y0,y0);X1=Math.max(X1,x1);Y1=Math.max(Y1,y1)}
  q.bb=[X0,Y0,X1,Y1];return sh._zq=q}
function svrZTop(sh,x,y){let best=-Infinity;for(const c of svrZq(sh)){if(x<c.x0||x>c.x1||y<c.y0||y>c.y1)continue;for(const[a,b,d]of[[0,1,2],[0,2,3]]){const A=c.P[a],B2=c.P[b],C=c.P[d],den=(B2[1]-C[1])*(A[0]-C[0])+(C[0]-B2[0])*(A[1]-C[1]);if(Math.abs(den)<1e-12)continue;
    const l1=((B2[1]-C[1])*(x-C[0])+(C[0]-B2[0])*(y-C[1]))/den,l2=((C[1]-A[1])*(x-C[0])+(A[0]-C[0])*(y-C[1]))/den,l3=1-l1-l2;if(l1>=-1e-6&&l2>=-1e-6&&l3>=-1e-6){const z=l1*c.Z[a]+l2*c.Z[b]+l3*c.Z[d];if(z>best)best=z}}}return best}
/* draw the pieces of one rosette in the engine's order, in runs (see the header) */
function svrDraw(par,items,P,cw,Dm,tol,lf={}){const k=G(par),dd=GDEF||defs,hi=DET>=1.5,eps=Dm*P.eps;if(!items.length)return k;
  /* the closed bud's calyx (lf.sepLay): wrapped round the egg with the petals, the pairwise order runs into cycles whose breaker sinks the sepals
     (their mean depth is low); each sepal goes wholly behind or in front of the rest, by its depth votes against what it overlaps */
  const sl=lf.sepLay?items.filter(it=>it.grp==='s'):[],rest=sl.length?items.filter(it=>it.grp!=='s'):items,order0=svOrder(rest,eps);
  if(sl.length){const bk=[],fw=[];for(const s of sl){let vote=0;for(const b of rest){if(b.bb[2]<s.bb[0]||s.bb[2]<b.bb[0]||b.bb[3]<s.bb[1]||s.bb[3]<b.bb[1])continue;
      for(const c of s.cells){const z=svDepthAt(b,c.cx,c.cy);if(z!==null)vote+=c.cz>z?1:-1}}(vote>=0?fw:bk).push(s)}
    order0.unshift(...svOrder(bk,eps));order0.push(...svOrder(fw,eps))}
  order0.forEach((it,i)=>it.oi=i);
  /* nothing hidden is drawn: a piece whose sampled points all lie under the pieces drawn after it is left out */
  for(let i=0;i<order0.length;i++){const it=order0[i];if(it.kind!=='pet')continue;let cov=0;const pts=it.sh.P;
    for(const p of pts){for(let j=i+1;j<order0.length;j++){const b=order0[j];if(!b.out||p[0]<b.bb[0]||p[0]>b.bb[2]||p[1]<b.bb[1]||p[1]>b.bb[3])continue;if(svrIn(b.out,p[0],p[1])){cov++;break}}}
    if(cov>=pts.length*P.cull)it.gone=1}
  const order=order0.filter(it=>!it.gone);order.fr=order0.fr.filter(([A,B2])=>!A.gone&&!B2.gone);order.forEach((it,i)=>it.oi=i);
  /* lf.zvis: what a piece shows is decided by the depth of every surface of the head (its own too: a cupped or rolled piece hides its own far
     margin), not by the paint order alone. Its edge, washes, margins and veins are laid only where it is the nearest surface, so that a piece the
     order cannot place (the furled heart overlaps in a spiral, a cycle) never shows its outline or its shades through the one in front */
  const zE=Dm*(P.zEps||.012),zHid=lf.zvis?(it,x,y,z)=>{for(const X of order){const s=X.px||X.sh;if(!s)continue;const Q=svrZq(s);if(x<Q.bb[0]||x>Q.bb[2]||y<Q.bb[1]||y>Q.bb[3])continue;
      if(svrZTop(s,x,y)>z+zE)return true}return false}:null;
  if(zHid)for(const it of order)if(it.kind==='pet'&&it.sh)it.zv=it.sh.P.map((p,q)=>zHid(it,p[0],p[1],it.sh.Z[q])?-1:1);
  /* the patches: where a piece drawn earlier is in front of a later one, the earlier is drawn again over it, clipped to where it is in front */
  /* (the largest few only: a small crossing deep in the rosette is not seen) */
  const cand=[];if(SV_PATCH)for(const[A,B2,fa,fb]of order.fr){const[e,l,c]=A.oi<B2.oi?[A,B2,fa]:[B2,A,fb];if(c<Math.max(P.pmin,P.pshare*Math.min(e.cells.length,l.cells.length)))continue;
    let ca=0;for(const q of e.cells)ca+=(q.x1-q.x0)*(q.y1-q.y0);const a=c*ca/e.cells.length;if(a>=(Dm*P.parea)**2)cand.push([a,e,l])}
  cand.sort((x,y)=>y[0]-x[0]);for(const[,e,l]of cand.slice(0,Array.isArray(P.pmax)?P.pmax[hi?1:0]:P.pmax)){const d=svFrontD(e,l,eps,tol,Dm);if(!d)continue;
    (l.patch=l.patch||[]).push([e.oi,e,d]);if(!e.pid)e.pid='sr'+(gid++)}
  /* runs: consecutive pieces of one kind */
  const runs=[];let cur=null;for(const it of order){if(it.kind==='fn'){runs.push([it]);cur=null;continue}if(!cur||cur.length>=P.run[hi?1:0]||cur[0].grp!==it.grp){cur=[];runs.push(cur)}cur.push(it)}
  /* the head's outline (for the cast shadows), the light's offset */
  let hid=null;if(!LOD){const hp=[];for(const it of items)if(it.out)for(const p of it.out)hp.push(p);if(hp.length>2){hid='sc'+(gid++);E('path',{d:svSpl(hull2(hp))},E('clipPath',{id:hid},dd))}}
  const L2=Math.hypot(LIGHT[0],LIGHT[1])||1,ox=-LIGHT[0]/L2*Dm*P.shd[0],oy=LIGHT[1]/L2*Dm*P.shd[0],ew=svF(Math.max(.18,Dm*P.edgeW*(lf.ewK||1))),eA=lf.edgeA!=null?lf.edgeA:P.edgeA;
  const patch=it=>{if(!it.patch)return;it.patch.sort((a,b)=>a[0]-b[0]);for(const[,e,d]of it.patch){const pc='sq'+(gid++);E('path',{d,'clip-rule':'evenodd'},E('clipPath',{id:pc},dd));E('use',{href:'#'+e.pid,'clip-path':`url(#${pc})`},k);
    /* a kind's own layer on the piece (e.xd: the rose's margin band, flames), cut the same way, so that a patch never shows the bare piece */
    if(e.xd)for(const x of e.xd)E('path',Object.assign({},x,{'clip-path':`url(#${pc})`}),k);
    /* lf.pedge: the patch carries the piece's outline too (a patch without it reads as a plate pasted on) */
    /* (its outline only: the strips P.fold adds to an edge-on piece's fill would stroke as hatching) */
    if(lf.pedge&&e.mt&&e.d&&!SVR_OFF.includes('edge'))E('path',{d:e.dO||e.d,fill:'none',stroke:e.mt.edge||e.mt.shade,'stroke-width':ew,'stroke-opacity':eA,'stroke-linejoin':'round','clip-path':`url(#${pc})`},k)}};
  if(lf.core)E('path',{d:lf.core[0],fill:lf.core[1]},k);
  /* lf.patchLate: each run's patches go over its washes and rims (else a piece's shades and margins, drawn after it, show through the piece
     patched in front of it) */
  const drawRun=(run,ri)=>{
    if(run[0].kind==='fn'){const it=run[0];it.fn(it.pid?G(k,{id:it.pid}):k);patch(it);return}
    /* lf.lclip: the run's lines (edge, rims, veins, pleats) clipped to its pieces' fills (by reference: no path copied), so that no stroke runs on past a petal into the void */
    let lcid=null;const lgr=()=>{if(!lf.lclip||run[0].grp!=='p')return k;if(!lcid){lcid='sl'+(gid++);const cp=E('clipPath',{id:lcid},dd);for(const it of run)E('use',{href:'#'+(it.pid||it.lid)},cp)}return G(k,{'clip-path':`url(#${lcid})`})};
    const mt=run[0].mt,gk=run[0].gk||0,so=P.shd[2]*(1-P.shdB*(lf.bud||0))*(lf.shK==null?1:lf.shK);
    /* the shadow this run casts on what lies behind it */
    if(hid&&ri>0&&so>.01&&!SVR_OFF.includes('shadow')){let d='';for(const it of run)if(hi||(it.bb[2]-it.bb[0])+(it.bb[3]-it.bb[1])>Dm*P.wmin)d+=svSpl(svSimp(it.out.map(p=>[p[0]+ox,p[1]+oy]),tol*(hi?3:6)));svrSt('shadow',d);E('path',{d,fill:mt.cast,'fill-opacity':so,filter:svBlur(Dm*P.shd[1]),'clip-path':`url(#${hid})`},k)}
    /* the run's pieces in one group carrying their edge (a thin dark stroke; the young bud's green reaches it, and its margins) */
    const ea={stroke:gk?mix(mt.edge||mt.shade,mix(P.greenC,'#0e1a06',.65),gk):mt.edge||mt.shade,'stroke-width':ew,'stroke-opacity':SVR_OFF.includes('edge')?0:eA,'stroke-linejoin':'round'},
      rg=zHid?G(k):G(k,ea);
    for(const it of run){svrSt('petal',it.d);const a={d:it.d,fill:it.tone};if(it.pid)a.id=it.pid;else if(lf.lclip&&run[0].grp==='p')a.id=it.lid='sl'+(gid++);if(zHid&&!it.ouv)Object.assign(a,ea);E('path',a,rg);
      /* lf.pfx (opt-in): a kind's own layer laid right after its piece's fill, so that the paint order hides it under the pieces drawn after
         (the carnation's picotee band: svFrBandP, y3-frange.js) */
      if(lf.pfx)lf.pfx(it,rg,{zHid,Dm,tol,dd});if(!lf.patchLate)patch(it)}
    /* under zvis the edge: the outline's runs where the piece is the nearest surface (sampled twice between the outline's points) */
    if(zHid&&!SVR_OFF.includes('edge')){let d='';for(const it of run){if(!it.ouv)continue;const n=it.ouv.length,pts=[],vs=[];
        for(let i=0;i<n;i++){const a=it.ouv[i],b=it.ouv[(i+1)%n];for(const t of[0,.5]){const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=t?svAt(it.sh,u,v):it.out[i];pts.push(p);vs.push(!zHid(it,p[0],p[1],svLerp(it.sh,it.sh.Z,u,v)))}}
        /* a lone hidden sample between seen ones is seen (no broken line), a seen run shorter than eMin x D is dropped (no scribbles) */
        const m=pts.length;for(let i=0;i<m;i++)if(!vs[i]&&vs[(i+m-1)%m]&&vs[(i+1)%m])vs[i]=2;let s0=vs.indexOf(false);if(s0<0){d+=svSpl(svSimp(pts,tol));continue}let r=[];
        const fl=()=>{let L=0;for(let i=1;i<r.length;i++)L+=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);if(r.length>1&&L>Dm*(P.eMin||.03))d+=svSpl(svSimpO(r,tol),false);r=[]};
        for(let i=1;i<=m;i++){const q=(s0+i)%m;if(vs[q])r.push(pts[q]);else fl()}fl()}
      svrSt('edge',d);if(d)E('path',Object.assign({d,fill:'none','stroke-linecap':'round'},ea),lgr())}
    if(LOD||SVR_OFF.includes('wash'))return;
    /* what the later pieces of the run hide of each one (its grid's vertices, then any point) */
    const hid2=(j,x,y)=>{for(let m=j+1;m<run.length;m++){const b=run[m].bb;if(x<b[0]||x>b[2]||y<b[1]||y>b[3])continue;if(svrIn(run[m].out,x,y))return true}return false};
    const vis=run.map((it,j)=>it.sh.P.map((p,q)=>(it.face&&it.sh.F[q]>0)||(it.zv?it.zv[q]<0:hid2(j,p[0],p[1]))?-1:1));
    /* a kind's own layer over the run's pieces, under the washes (lf.run: the rose's margin band and flames, y3-rose.js) */
    if(lf.run)lf.run(run,vis,k,{hid2,zHid,Dm,tol,big:it=>(P.washF==null||!(it.f>P.washF))&&(it.bb[2]-it.bb[0])+(it.bb[3]-it.bb[1])>Dm*(hi?P.wmin*.6:P.wmin)});
    /* the washes: shade and light on each piece's surface, relative to its tone, hidden under the later pieces of the run */
    const big=it=>(P.washF==null||!(it.f>P.washF))&&(it.bb[2]-it.bb[0])+(it.bb[3]-it.bb[1])>Dm*(hi?P.wmin*.6:P.wmin),wash=(lv,col,a,dark)=>{let d='';run.forEach((it,j)=>{if(!big(it))return;const V=Array.from(it.K,(x,q)=>Math.min(dark?lv*it.km-x:x-lv*it.km,vis[j][q]*.5));if(!V.some(x=>x>0))return;
        d+=svLoopsD(it.sh,svIso(it.sh.nu,it.sh.nv,V,0),Math.max(tol*3,Dm*(hi?.008:.016)))});svrSt('wash',d);if(d)E('path',{d,fill:col,'fill-opacity':a,'fill-rule':'evenodd'},wg)};
    /* the foot of each piece darker, where it sinks into the cups round it (bands along its length, not the light: a folded piece stays clean) */
    const foot=(lv,a)=>{let d='';run.forEach((it,j)=>{if(!big(it))return;const W=it.sh.W,nv=it.sh.nv,V=Array.from(it.K,(x,q)=>Math.min(lv-Math.floor(q/W)/nv,vis[j][q]*.5));if(!V.some(x=>x>0))return;
        d+=svLoopsD(it.sh,svIso(it.sh.nu,nv,V,0),Math.max(tol*3,Dm*(hi?.008:.016)))});svrSt('wash',d);if(d)E('path',{d,fill:mt.shade,'fill-opacity':a,'fill-rule':'evenodd'},wg)};
    /* lf.wclip: the run's washes clipped to its pieces' outlines (soft shades that never spill past a petal's edge as a halo) */
    let wk=k;if(lf.wclip){const cid='sw'+(gid++);E('path',{d:run.map(it=>it.d).join('')},E('clipPath',{id:cid},dd));wk=G(k,{'clip-path':`url(#${cid})`})}
    const wg=G(wk,{filter:svBlur(Dm*P.wb*(lf.wbK||1))});P.aoV[hi?1:0].forEach(lv=>foot(lv,P.aoA[hi?1:0]));for(const lv of P.dark[hi?1:0])wash(lv,mt.shade,P.da[hi?1:0]*(lf.daK==null?1:lf.daK),1);for(const lv of P.lit[hi?1:0])wash(lv,mt.lite,P.la[hi?1:0],0);
    /* mt.lenZ (opt-in) [[v0, v1, colour, opacity]...]: zones of colour along the petals (a pale claw, a picotee margin, a deeper tip), each a
       soft wash between v0 and v1 of the length, hidden under the later pieces of the run, cut to the run's outlines when lf.wclip */
    /* (a fifth entry, opt-in: the last rank it reaches, so a zone of the claws seen at the calyx's mouth is never laid on the heart's erect
       petals) */
    /* (a sixth entry, opt-in: the side it is laid on, 1 the inner face only, -1 the back only, faded where the piece turns edge-on) */
    if(mt.lenZ&&!SVR_OFF.includes('zone'))for(const[z0,z1,zc,za,zf,zs]of mt.lenZ){let d='';run.forEach((it,j)=>{if(it.grp!=='p'||!big(it)||(zf!=null&&it.f>zf))return;const W=it.sh.W,nv=it.sh.nv,
        V=Array.from(it.K,(x,q)=>{const v=Math.floor(q/W)/nv,b=Math.min(v-z0,z1-v,vis[j][q]*.5);return zs?Math.min(b,zs*it.sh.F[q]*3):b});if(!V.some(x=>x>0))return;
        d+=svLoopsD(it.sh,svIso(it.sh.nu,nv,V,0),Math.max(tol*3,Dm*(hi?.008:.016)))});svrSt('zone',d);if(d)E('path',{d,fill:zc,'fill-opacity':za,'fill-rule':'evenodd'},wg)}
    if(SVR_OFF.includes('rim'))return;
    const lk=lgr();
    /* the paler margin (the inner face's, fainter on a back), and the veins in close-ups */
    /* fm (opt-in): the least facing a point needs (the veins of a piece seen nearly edge-on would crowd into hatching: mt.veinF) */
    const runsOf=(it,j,pl,face,inO,fm)=>{const out=[];let r=[];for(const[u,v]of pl){const p=svAt(it.sh,u,v);if(face*it.s>0&&svLerp(it.sh,it.sh.F,u,v)*it.s>(fm||.02)&&!(zHid&&it.ouv?zHid(it,p[0],p[1],svLerp(it.sh,it.sh.Z,u,v)):hid2(j,p[0],p[1]))&&(!inO||svrIn(it.out,p[0],p[1])))r.push(p);else{if(r.length>1)out.push(r);r=[]}}if(r.length>1)out.push(r);return out};
    /* the spoon's crease: a soft shade down the middle of each inner face, where nothing of the run covers it (one blurred path per run) */
    const mA=P.midA[hi?1:0];if(mA>0&&!SVR_OFF.includes('mid')){let d='',dl='';const pl=[];for(let q=0;q<=4;q++)pl.push([0,P.mid[0]+(P.mid[1]-P.mid[0])*q/4]);
      const lr=Math.hypot(ox,oy)||1,mx=ox/lr*Dm*P.midO,my=oy/lr*Dm*P.midO;
      run.forEach((it,j)=>{if(big(it))for(const r of runsOf(it,j,pl,1,P.midIn)){d+=svQuad(mx||my?r.map(p=>[p[0]-mx,p[1]-my]):r);if(P.midL)dl+=svQuad(r.map(p=>[p[0]+mx,p[1]+my]))}});svrSt('mid',d+dl);
      if(d)E('path',{d,fill:'none',stroke:mt.shade,'stroke-width':svF(Dm*P.midW),'stroke-opacity':mA,'stroke-linecap':'round'},wg);
      if(dl)E('path',{d:dl,fill:'none',stroke:mt.lite,'stroke-width':svF(Dm*P.midW*.7),'stroke-opacity':Math.min(1,mA*P.midL),'stroke-linecap':'round'},wg)}
    /* P.rimN (opt-in) [DET 1, DET 1.5]: more samples across the tip, so that the margin follows a cut outline (teeth) */
    const rimL=[],rN=P.rimN?P.rimN[hi?1:0]:10;for(let q=0;q<=3;q++)rimL.push([-.975,.55+.43*q/3]);for(let q=1;q<rN;q++)rimL.push([-1+2*q/rN,.975]);for(let q=3;q>=0;q--)rimL.push([.975,.55+.43*q/3]);
    /* mt.rimF (opt-in): the last rank that gets the paler margin (a carnation's crumpled heart: its pieces' margins read as pale scribbles
       across the heart in close-ups, 3.6b); without it every rank as before */
    for(const face of[1,-1]){let d='';run.forEach((it,j)=>{if(mt.rimF!=null&&it.f>mt.rimF)return;for(const r of runsOf(it,j,rimL,face))d+=svSpl(svSimpO(r,tol*(hi?1:2)),false)});
      svrSt('rim',d);const bw=Math.min(1,P.edgeB[0]*(lf.dec||0)+P.edgeB[1]*(lf.fan||0)),rc0=face>0?mt.rim:mt.brim||mt.rim,rc=gk?mix(rc0,mix(P.greenC,'#f4f8e0',.45),gk):rc0;
      if(d)E('path',{d,fill:'none',stroke:bw>0?mix(rc,P.brown,bw):rc,'stroke-width':svF(Dm*(mt.rimW||P.rimW)*(1+P.edgeBW*bw)*(lf.rimK==null?1:lf.rimK)),'stroke-opacity':face>0?mt.rimA||P.rimA:P.brimA,'stroke-linecap':'round','stroke-linejoin':'round'},lk)}
    if((hi||mt.veinLo)&&mt.vein){let d='';run.forEach((it,j)=>{for(const u of mt.veinU||[-.62,-.3,0,.3,.62]){const pl=[];for(let q=0;q<=6;q++)pl.push([u*(.3+.7*svSm(q/4)),.06+.8*q/6]);for(const r of runsOf(it,j,pl,1,P.midIn,mt.veinF))d+=svQuad(r)}});
      if(d)E('path',{d,fill:'none',stroke:mt.vein,'stroke-width':svF(Dm*(mt.veinW||P.veinW)),'stroke-opacity':mt.veinA||P.veinA,'stroke-linecap':'round'},lk)}
    /* mt.bvein (opt-in) {c, a, w, v [v0, v1], f}: the veins seen on the backs (paler than the blade on a carnation's outer petals), from the
       claw out and stopped short of the margin, on the pieces up to rank f; cut to the seen back like the margin (no draw of chance) */
    if((hi||mt.veinLo)&&mt.bvein&&!SVR_OFF.includes('bvein')){const Q=mt.bvein;let d='';run.forEach((it,j)=>{if(it.grp!=='p'||(Q.f!=null&&it.f>Q.f))return;
        for(const u of mt.veinU||[-.62,-.3,0,.3,.62]){const pl=[];for(let q=0;q<=6;q++)pl.push([u*(.3+.7*svSm(q/4)),Q.v[0]+(Q.v[1]-Q.v[0])*q/6]);for(const r of runsOf(it,j,pl,-1,P.midIn,mt.veinF))d+=svQuad(r)}});
      if(d)E('path',{d,fill:'none',stroke:Q.c,'stroke-width':svF(Dm*Q.w),'stroke-opacity':Q.a,'stroke-linecap':'round'},lk)}
    /* mt.strk (opt-in) {c, n [a,b], len [a,b], w, op, base}: streaks of colour on the seen face, from the margin inward (or from the claw out when
       base), uneven in place, length and width (two widths), each piece its own by its rank and place (no draw of chance);
       Q.tp (opt-in, T steps): each streak tapered from its start, T strokes on the same curve, the k-th (T-k)/T long and (k+1)/T wide, so a
       flame thins out to a hair instead of ending as a round-capped stick (4.7); without tp one stroke as before */
    if(mt.strk&&!SVR_OFF.includes('strk')){const Q=mt.strk,T=Q.tp||1,dd2=Array.from({length:2*T},()=>'');run.forEach((it,j)=>{if(it.grp!=='p'||!big(it))return;const sd=(Math.round(it.f*997)+Math.round(it.bb[0]*7+it.bb[1]*13))>>>0,
        n=Math.round(Q.n[0]+(Q.n[1]-Q.n[0])*pxHashS(1,5,sd));for(let m=0;m<n;m++){const u0=-.88+1.76*pxHashS(m,17,sd),ln=Q.len[0]+(Q.len[1]-Q.len[0])*pxHashS(m,19,sd),wv=.06*(pxHashS(m,23,sd)-.5),cl=pxHashS(m,29,sd)<.5?0:1;
          for(let k=0;k<T;k++){const fl=(T-k)/T,pl=[];
            for(let q=0;q<=6;q++){const qq=q*fl,v=Q.base?.06+ln*qq/6:.995-ln*qq/6;pl.push([u0*(Q.base?.35+.65*svSm(v/.55):1)+wv*Math.sin(qq*1.1+m),v])}
            for(const r of runsOf(it,j,pl,it.s,1))dd2[k*2+cl]+=svQuad(r)}}});svrSt('strk',dd2.join(''));
      dd2.forEach((d,i)=>{if(d)E('path',{d,fill:'none',stroke:Q.c,'stroke-width':svF(Dm*Q.w*(i%2?.55:1)*(Math.floor(i/2)+1)/T),'stroke-opacity':Q.op,'stroke-linecap':'round'},lk)})}
    /* lf.pleat {n [lo, hi], len [min, max] of the length from the tip, w, c, a, lc, la}: a dried piece's creases along its length, from its
       margin inward, on whichever face is seen (a dark fold and a faint lit ridge beside it), uneven in place and length */
    if(lf.pleat&&lf.pleat.a>.01&&!SVR_OFF.includes('pleat')){const Q=lf.pleat,n=Q.n[hi?1:0];let d='',dl='';run.forEach((it,j)=>{if(it.grp!=='p'||!big(it))return;const sd=Math.round(it.f*97)+3;
        for(let m=0;m<n;m++){const u0=-.82+1.64*(m+.5+.7*(pxHashS(m,7,sd)-.5))/n,ln=Q.len[0]+(Q.len[1]-Q.len[0])*pxHashS(m,11,sd),wv=.05*(pxHashS(m,13,sd)-.5),pl=[],pr=[];
          for(let q=0;q<=6;q++){const v=(Q.v0||.97)-ln*q/6,u=u0*(1-.25*(q/6))+wv*Math.sin(q*1.3+m);pl.push([u,v]);pr.push([u+.035,v])}
          for(const r of runsOf(it,j,pl,it.s,1,Q.fm))d+=svQuad(r);if(Q.la>.01)for(const r of runsOf(it,j,pr,it.s,1,Q.fm))dl+=svQuad(r)}});svrSt('pleat',d+dl);
      if(dl)E('path',{d:dl,fill:'none',stroke:Q.lc,'stroke-width':svF(Dm*Q.w*.8),'stroke-opacity':Q.la,'stroke-linecap':'round'},lk);
      if(d)E('path',{d,fill:'none',stroke:Q.c,'stroke-width':svF(Dm*Q.w),'stroke-opacity':Q.a,'stroke-linecap':'round'},lk)}};
  runs.forEach((run,ri)=>{drawRun(run,ri);if(lf.patchLate&&run[0].kind!=='fn')for(const it of run)patch(it)});
  return k}
