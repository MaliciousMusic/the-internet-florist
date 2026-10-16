/* ================= Pilote : la plante du narcisse (hampe lisse à deux arêtes, coupe creuse, feuille en lanière à carène) =================
   Generic pieces for smooth, flattened, hollow scapes and keeled strap leaves (daffodil; later the other Narcissus, amaryllis, nerine, agapanthus).
   Nothing here replaces an engine function: a stem colour list names its own drawers (c.sv.line, c.sv.cut: see the dispatch in y-narcissus.js), and
   a sort calls svStrapLeafX itself. The other sorts do not change. */

/* a smooth scape: svStemLine (y1.js) without its fixed ripple unless asked (sv.ripple, default .025 as there), its slow swell (sv.swell, .05) read
   from the stem's place on the page; a stem drawn in pieces (lsChainParts) joins without seams: each piece ends square (svStemLine closes its
   outline in a round cap, a notch at every join) and its blurred washes run on past both ends under the clip (they faded at every join: the
   beads of the daffodil's scape). sv.flat (0..1): a flattened two-edged scape seen on its broad face: the light lies flat across the face instead
   of rounding a cylinder, the dark kept to the shaded edge, and each edge catches a thin line of light (sv.edges = [lit edge, shaded edge]
   opacities); sv.bloom: a waxy whitish veil (glaucous); sv.ribs: fine striations as in svStemLine; sv.ownWilt: the scape's colours already carry
   its wilting (the global WILT filter is not laid over them). */
function svStemLineN(par,C0,Wd0,c){if(c.sv&&c.sv.ownWilt&&WILT){const w0=WILT;WILT=null;try{return svStemLineN(par,C0,Wd0,c)}finally{WILT=w0}}
  const n0=C0.length,g=G(par);if(n0<2)return g;const sv=c.sv||{},fl=sv.flat||0,rp=sv.ripple??.025,sw=sv.swell??.05,
    tg=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]},W0=Wd0.reduce((a,b)=>a+b,0)/n0,e=W0*1.2,
    t0=tg(C0[0],C0[1]),t1=tg(C0[n0-2],C0[n0-1]),
    /* the centre line run on past both ends (for the washes); the piece itself is C[1..n] */
    C=[[C0[0][0]-t0[0]*e,C0[0][1]-t0[1]*e],...C0,[C0[n0-1][0]+t1[0]*e,C0[n0-1][1]+t1[1]*e]],n=C.length,
    Wd=[Wd0[0],...Wd0,Wd0[n0-1]].map((w,i)=>{const s=(C[i][1]+C[i][0]*.3)/w;return w*(1+sw*Math.sin(s/9)+rp*Math.sin(s/3.1))}),T=[],N=[];
  for(let i=0;i<n;i++){const t=tg(C[Math.max(0,i-1)],C[Math.min(n-1,i+1)]);T.push(t);N.push([-t[1],t[0]])}
  const lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1]),L=[lt[0]/ll,lt[1]/ll],kk=N.map(q=>Math.max(-1,Math.min(1,(q[0]*L[0]+q[1]*L[1])*2.5))),
    off=(f0,f1)=>{const A=[],B2=[];for(let i=0;i<n;i++){const w=Wd[i]/2,s=kk[i],o0=w*f0*s,o1=w*f1*s;A.push([C[i][0]+N[i][0]*o0,C[i][1]+N[i][1]*o0]);B2.push([C[i][0]+N[i][0]*o1,C[i][1]+N[i][1]*o1])}return A.concat(B2.reverse())},
    ks=kk.reduce((a,b)=>a+b,0)<0?-1:1,edge=f=>{const A=[];for(let i=0;i<n;i++){const o=Wd[i]/2*f*ks;A.push([C[i][0]+N[i][0]*o,C[i][1]+N[i][1]*o])}return A},
    tol=Math.max(.04,Math.min(...Wd)*.05);
  /* the outline: both sides of the piece, its ends cut square */
  const sA=[],sB=[];for(let i=1;i<n-1;i++){sA.push([C[i][0]+N[i][0]*Wd[i]/2,C[i][1]+N[i][1]*Wd[i]/2]);sB.push([C[i][0]-N[i][0]*Wd[i]/2,C[i][1]-N[i][1]*Wd[i]/2])}
  /* its far end overlaps the next piece a little (no hairline at the join) */
  {const i=n-2,o=W0*.2;sA.push([sA[sA.length-1][0]+T[i][0]*o,sA[sA.length-1][1]+T[i][1]*o]);sB.push([sB[sB.length-1][0]+T[i][0]*o,sB[sB.length-1][1]+T[i][1]*o])}
  const od=svSpl(svSimpO(sA,tol),false)+'L'+svSpl(svSimpO(sB.reverse(),tol),false).slice(1)+'Z';E('path',{d:od,fill:c[1]},g);if(LOD)return g;
  const id='sc'+(gid++);E('path',{d:od},E('clipPath',{id},GDEF||defs));const cg=G(g,{'clip-path':`url(#${id})`}),bg=G(cg,{filter:svBlur(W0*.16)}),P=(f0,f1)=>svSpl(svSimp(off(f0,f1),tol));
  if(fl){/* the broad face lit evenly; the shade only along the edge turned away; a soft sheen over the lit half */
    E('path',{d:P(-1.4,-.62),fill:c[0],'fill-opacity':.55+.25*(1-fl)},bg);E('path',{d:P(-1.4,-.86),fill:c[0],'fill-opacity':.5},bg);
    E('path',{d:P(-.3,.8),fill:c[2],'fill-opacity':.62},bg);E('path',{d:P(.15,.55),fill:c[3],'fill-opacity':(sv.gloss??.5)*.7},bg)}
  else{E('path',{d:P(-1.4,-.25),fill:c[0],'fill-opacity':.85},bg);E('path',{d:P(-1.4,-.68),fill:c[0],'fill-opacity':.6},bg);
    E('path',{d:P(.02,.62),fill:c[2],'fill-opacity':.8},bg);E('path',{d:P(.18,.42),fill:c[3],'fill-opacity':sv.gloss??.5},bg)}
  if(sv.bloom)E('path',{d:od,fill:sv.bloomC||'#e4ece6','fill-opacity':sv.bloom},cg);
  if(sv.ribs&&DET>=1){let d='';for(const f0 of sv.ribs)d+=svSpl(svSimpO(edge(f0),tol),false);E('path',{d,fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.05,W0*.04)),'stroke-opacity':.18},cg)}
  /* the two edges (arêtes): a thin line of light just inside each side of the silhouette, brighter on the side the piece mostly turns to the light
     (one side for the whole piece: at the bend of the neck a per-point side made the line jump across the stem) */
  if(fl&&sv.edges){const[eL,eS]=sv.edges;E('path',{d:svSpl(svSimpO(edge(.8),tol),false),fill:'none',stroke:c[3],'stroke-width':svF(Math.max(.05,W0*.07)),'stroke-opacity':eL},cg);
    if(eS)E('path',{d:svSpl(svSimpO(edge(-.8),tol),false),fill:'none',stroke:c[2],'stroke-width':svF(Math.max(.05,W0*.055)),'stroke-opacity':eS},cg)}
  return g}

/* the cut end of a hollow two-edged scape (plant sheets; svtStem calls svStemCut when GHI[sid].cut, and the dispatch hands it here when the stem's
   colours carry sv.cut): as svStemCut (y3-plante.js), the stem drawn on past its cut and clipped square at it; then the section seen a little from
   above: a lens (its two points are the scape's edges) of pale cut tissue ringed by the rind, opening on the dark hollow (sv.hollow: the hollow's
   share of the width; sv.cutY: the section's depth as seen, x the width). */
function svStemCutN(par,C,W,c,draw){if(c.sv&&c.sv.ownWilt&&WILT){const w0=WILT;WILT=null;try{return svStemCutN(par,C,W,c,draw)}finally{WILT=w0}}const u0=[C[1][0]-C[0][0],C[1][1]-C[0][1]],l=Math.hypot(u0[0],u0[1])||1,u=[u0[0]/l,u0[1]/l],nn=[-u[1],u[0]],p=C[0],w=W[0],e=w*2,B=1e5,
    id='ct'+(gid++),cp=E('clipPath',{id},GDEF||defs),q=(a,b)=>svF(p[0]+nn[0]*a+u[0]*b)+','+svF(p[1]+nn[1]*a+u[1]*b),sv=c.sv||{};
  E('path',{d:'M'+q(B,0)+'L'+q(-B,0)+'L'+q(-B,B)+'L'+q(B,B)+'Z'},cp);
  const g=G(par,{'clip-path':`url(#${id})`});draw(g,[[p[0]-u[0]*e,p[1]-u[1]*e]].concat(C),[w].concat(W));
  svCutFace(par,p,nn,w,c,sv);return g}
/* the cut face of a scape seen a little from above, centred on p, its width across nn (unit): a lens (its two points are the scape's edges) of pale
   cut tissue ringed by the rind, opening on the dark hollow (sv.hollow: the hollow's share of the width; sv.cutY: the section's depth as seen, x
   the width; sv.cutC: the tissue). o.bundle (x w): the leaves' sheaths cut with it, round the scape, o.rings their layers (fractions of the bundle),
   o.bc their tissue. */
function svCutFace(par,p,nn,w,c,sv,o={}){const f=svF,rx=w*.5,ry=w*(sv.cutY??.2),tf=`translate(${f(p[0])} ${f(p[1])}) rotate(${f(Math.atan2(nn[1],nn[0])*180/Math.PI)})`,g=G(par,{transform:tf});
  if(o.bundle){const bx=w*o.bundle,by=bx*(sv.cutY??.2)*1.05;E('ellipse',{cx:0,cy:0,rx:f(bx),ry:f(by),fill:o.bc||'#cdd5ab',stroke:c[0],'stroke-width':f(w*.07),'stroke-opacity':.55},g);
    let d='';for(const k of o.rings||[])d+=`M${f(-bx*k)} 0A${f(bx*k)} ${f(by*k)} 0 1 0 ${f(bx*k)} 0A${f(bx*k)} ${f(by*k)} 0 1 0 ${f(-bx*k)} 0`;if(d)E('path',{d,fill:'none',stroke:c[0],'stroke-width':f(w*.04),'stroke-opacity':.35},g)}
  E('path',{d:`M${f(-rx)} 0Q0 ${f(-ry*2)} ${f(rx)} 0Q0 ${f(ry*2)} ${f(-rx)} 0Z`,fill:sv.cutC||'#dde3c2',stroke:c[0],'stroke-width':f(w*.07),'stroke-opacity':.65},g);
  if(sv.hollow){const hx=rx*sv.hollow,hy=ry*sv.hollow*.8;E('ellipse',{cx:0,cy:f(ry*.08),rx:f(hx),ry:f(hy),fill:'#4e5e44','fill-opacity':.92},g);
    /* the far inner wall of the hollow, lit */
    E('path',{d:`M${f(-hx*.8)} ${f(ry*.08)}A${f(hx)} ${f(hy)} 0 0 1 ${f(hx*.8)} ${f(ry*.08)}`,fill:'none',stroke:'#c9d2b0','stroke-width':f(w*.05),'stroke-opacity':.7},g)}
  return g}

/* ---------- a strap leaf with a keel, a fold and a tip-first fading (svStrapLeaf of y3.js, the same surface and defaults, plus) ----------
   keel (0..1): the blade folded on its midrib: the gutter's section goes from a round channel (0, as svStrapLeaf) to a V (1), one half catching the
   light, the other in shade; fold [at, amount, below, twist]: the long blade gives way under its weight at `at` (0..1 of its length) and runs on
   toward the ground at `below` rad under the horizontal, `amount` (0..1) of the way (it folds further as it wilts), turning its face by `twist` rad; flop (0..1), flopAt, flopDn: wilting, the blade gives way there (limp x flop) and hangs
   flopDn x limp rad further down; fold[4]: how long the bend is (default .07 of the blade); fade {yel, tan, dry, w0, dw}: wilting
   (wl), the blade yellows from the tip: green, then yellow, then tan, the very tip dry and straw-pale, the front moving down the blade from w0 over dw
   (without it, svStrapLeaf's own tip yellowing). */
function svStrapLeafX(par,pos,H,Out,o0){const o=Object.assign({},SVL_DEF,{keel:0,fold:null,fade:null},o0),r=svRng(o.sd),wl=o.wl||0,len=o.len,dn=[0,-1,0],limp=svSm((wl-.15)/.6),W=len*o.w,
    side0=V3.nz(V3.cr(Out,H)),ns=18,sp=[],dv=[],ph=r.in(0,6.3),tw=o.tw*r.in(-1,1)*(1+1.5*limp),hi=DET>=1.5;
  const prof=v=>{const P=o.wp;for(let i=1;i<P.length;i++)if(v<=P[i][0]){const t=svSm((v-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[i-1][1]+(P[i][1]-P[i-1][1])*t}return 0};
  let p=V3.add(pos,V3.sc(Out,o.sr));const lean=o.lean*(1+.3*limp),dr=Math.min(.95,o.droop*(1+1.2*limp)),fo=o.fold||(o.flop?[o.flopAt??.5,0,.4,0,.16]:null),
    fb=fo?Math.min(1.45,(fo[2]??.2)+(o.flopDn||0)*limp):0,fd=fo?V3.nz(V3.add(V3.sc(Out,Math.cos(fb)),V3.sc(dn,Math.sin(fb)))):null,fa=fo?Math.min(1,fo[1]*(1+.6*limp)+(o.flop||0)*limp):0;
  for(let j=0;j<=ns;j++){const v=j/ns,t=svSm((v-o.sheath*.5)/.25),a=lean*t,d0=V3.nz(V3.add(V3.sc(H,Math.cos(a)),V3.sc(Out,Math.sin(a)))),
      k=dr*Math.pow(Math.max(0,(v-o.sheath)/(1-o.sheath)),1.6);let d=V3.nz(V3.add(V3.sc(d0,1-k),V3.sc(dn,k)));
    if(fo){const kf=fa*svSm((v-fo[0])/(fo[4]??.07));d=V3.nz(V3.add(V3.sc(d,1-kf),V3.sc(fd,kf)))}
    if(j)p=V3.add(p,V3.sc(d,len/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
    gut=o.gut*(1-.55*limp),wav=o.wav*(1+.6*limp),sr=o.sr*1.08,kl=o.keel;
  const S=(u,v)=>{const c=at(sp,v),d=V3.nz(at(dv,v)),s0=V3.nz(V3s(side0,V3.sc(d,V3.dot(side0,d)))),n0=V3.cr(s0,d),a=tw*v+(fo&&fo[3]?fo[3]*svSm((v-fo[0])/.12):0),s=V3.add(V3.sc(s0,Math.cos(a)),V3.sc(n0,Math.sin(a))),n=V3.cr(s,d),
      hw=W/2*prof(v),au=Math.abs(u),lift=gut*hw*((1-kl)*u*u+kl*au)*(1-.5*svSm((v-.6)/.4))+wav*W*Math.pow(au,3)*Math.sin(Math.PI*o.wavN*v+ph+u*.6)*svSm((v-o.sheath)/.2)
        -.35*limp*hw*Math.pow(au,4)+o.hood*hw*u*u*svSm((v-.82)/.18),bl=V3.add(V3.add(c,V3.sc(s,u*hw)),V3.sc(n,lift));
    if(v>=o.sheath*1.8)return bl;
    const th=u*Math.PI*.62,ax=V3.add(pos,V3.sc(H,len*v)),q=V3.add(ax,V3.add(V3.sc(Out,Math.cos(th)*sr),V3.sc(side0,Math.sin(th)*sr))),t=svSm((v-o.sheath*.4)/(o.sheath*1.4));
    return V3.add(V3.sc(q,1-t),V3.sc(bl,t))};
  const Y=o.fade,yk=Y?svSm((wl-(Y.w0??.2))/(Y.dw??.55)):0,tipY=mix(o.up,'#b8a85a',.5*limp),bloomL=mix('#d4e2d8',o.up,.25),
    /* the colour along the blade: the fading front comes down from the tip */
    run=(c0,c1)=>{if(!Y)return[[.35,c0],[.85,c0],[1,c1]];const p1=Math.max(.36,1-.85*yk),p2=Math.max(p1+.02,1-.5*yk),p3=Math.max(p2+.02,1-.16*yk);
      return[[.35,mix(c0,Y.yel,.25*yk)],[p1,mix(c0,Y.yel,.3*yk)],[p2,mix(c0,Y.yel,yk)],[p3,mix(c0,Y.tan,yk)],[1,mix(c0,Y.dry,Math.max(yk,.3*limp))]]},
    bs=Y?mix(o.base,Y.yel,.35*yk):o.base,
    m={stops:[[0,bs],[o.sheath*1.2,mix(bs,o.up,.55)],...run(o.up,tipY)],bstops:[[0,bs],[o.sheath*1.3,mix(bs,o.low,.6)],...run(o.low,mix(o.low,'#b8a85a',.4*limp)).slice(Y?0:1)],
      shade:'#1a3224',lite:mix(bloomL,'#ffffff',.2*o.bloom),bshade:'#2c4632',blite:mix(o.low,'#e8f0e8',.5),rim:mix(o.up,'#d8e4d4',.45),cast:'#0e1c12',
      wrap:.3,amb:.3,dif:.68,sky:.2,trans:.22,ks:.05+.1*(1-o.bloom),gloss:10+14*(1-o.bloom),dark:[.88,.72,.56],da:.22,lit:[1.06,1.14],la:.16+.22*o.bloom,darkLo:[.76],daLo:.3,litLo:[1.1],laLo:.25,rw:.006,ro:.3,soft:.05,
      veins:(sh,front)=>{const L=[];for(const u of[-.78,-.56,-.34,-.14,.14,.34,.56,.78])L.push([[u*.6,.02],[u,.25],[u,.6],[u*.9,.9],[u*.3,.99]]);
        return[...(hi?[[L,.0035,front?mix(o.up,'#2a4a34',.35):mix(o.low,'#e0eadc',.4),front?.32:.3]]:[]),[[[[0,.02],[0,.4],[0,.8],[0,.98]]],.008,front?mix(o.up,'#24402c',.5):mix(o.low,'#f0f4ea',.5),front?.45:.5]]}};
  if(!hi)Object.assign(m,{dark:[.8,.6],darkLo:[.8,.6],lit:[1.1],litLo:[1.1],rw:0});
  return svDraw(par,[svSheet(I3,[0,0,0],S,{nu:hi?o.nu+2:o.nu-2,nv:hi?o.nv+4:o.nv-4,mat:m})],{D:len*.55,sd:.02,sb:.02,so:.3,shadow:hi})}
