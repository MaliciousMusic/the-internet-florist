/* ---------- y3-rose.js: the rose of the florist (svRose), a kit piece for every rose: high-centred, sweetheart, garden, English, spray ----------
   A rose is a spiral of broad petals on an urn (the hip): the outer ones (rank f = 0) open first and roll their margins back into points, the
   inner ones stay furled round each other into a tall cone (the high centre of a hybrid tea), the heart opens last on a ring of stamens. Five
   sepals, two bearded with leafy appendages, two bare, one half, clasp the bud and turn down under the open flower. Built on the rosette kit
   (y3-rosette.js: svrItem, svrDraw, svrT, svrC): each petal one lit path in the engine's order, washes by runs, patches where pieces cross.
   What it adds to the rosette:
   - the petal's section: a true arc (cup, the half angle it covers) whose margins roll back past ru of the half width (roll, radians at the edge,
     from rv of the length up), so that a rolled petal reads pointed; a shallow notch at its tip;
   - the pointed bud: an egg whose widest part lies low (budK), wrapped by the sepals;
   - the urn under the flower, the sepals' appendages, a ring of stamens, and per run the colourway's margin band and flames (bicolours,
     edged, flamed);
   - the compound leaf (svRoseLeaf: rachis, stipules, 3 to 7 double-toothed leaflets folded on their midrib) and the stem's prickles or the
     scars of a dethorned stem (svRoseThorns, a post hook for svStemLine).
   A sort gives only what differs from SVROSE_DEF (and SVR_DEF): genes(seed), mat(colourway), life(); tables by rank [[f, value]...]. Colours
   by rank: mat fr / bk; mat.band {c, w, op}, mat.flames {c, n, op, w}, mat.sep {fr, bk, ...}, mat.anth, mat.fil, mat.urn [shade, body, light]. */
const SVROSE_DEF={
  div:2.39996,thin:[.55,3],thinW:1.08,
  /* by rank (x R0): length, width, insertion radius and height */
  L:[[0,1],[.5,.82],[.8,.78],[1,.74]],Lc:[[0,.84],[.5,.9],[1,1]],W:[[0,.95],[.5,1.02],[.8,.95],[1,.8]],r0:[[0,.17],[.5,.12],[1,.07]],z0:[[0,-.03],[.5,.07],[.8,.28],[1,.45]],
  /* the section: half angle of the arc across, closed (c) and open (o); the margins' roll back (radians at the edge), closed and open, past ru
     of the half width, from rv of the length */
  heartSh:.28,heartK:.4,coneB:null,cupc:[[0,.9],[1,1.25]],cupo:[[0,.4],[.5,.62],[.8,1],[1,1.2]],rollc:[[0,.6],[.4,.2],[1,0]],rollo:[[0,2.8],[.35,2.2],[.6,.5],[.75,0],[1,0]],ru:.28,rv:.25,ruTip:1,
  /* the furled ranks' section bent round the axis (conc 1: the arc's centre on the axis, its half angle hw/rho up to concK): nested arcs, the spiral
     of the heart seen from above, instead of tubes on their own centres; tipF: the outline's tip exponent by rank (lower: more pointed) */
  conc:[[0,0],[.3,.3],[.45,.85],[.6,1],[1,1]],concO:.25,concK:1.45,tipF:[[0,.62],[.35,.8],[.55,1.2],[1,1.3]],
  /* the outer ranks unequal (irr: length spread by the gene big, to rank irrF) and one in peelP heads with a petal peeling off (a0, a1 added) */
  irr:.16,irrF:.3,peelP:.7,peel:[.22,.5],
  /* the spine's angle from the axis at the foot (a0) and the tip (a1), closed and open */
  a0c:[[0,.4],[.5,.2],[1,.08]],a0o:[[0,.6],[.3,.46],[.55,.3],[.75,.1],[1,.03]],a1c:[[0,-.6],[.5,-.5],[.8,-.34],[1,-.2]],a1o:[[0,1.05],[.3,.76],[.5,.57],[.75,.27],[1,-.2]],
  wA0:[[0,.3],[.5,.25],[1,.08]],wA1:[[0,.5],[.5,.6],[.8,.45],[1,.2]],
  /* the opening of rank f: svSm((op - t0 - dt.f)/dur).(1 - mx.f^1.5) */
  oLaw:[.35,.45,.55,.7],oTip:.8,
  /* the outline: a claw to the broadest point vb, a broad round top (genes tip), a shallow notch */
  vb:.66,claw:[.28,.72],clawK:1.25,aPow:1.15,lap:.1,notch:.035,
  vTrim:[[0,0],[.1,0],[.25,.2],[1,.32]],
  /* the bud: a pointed egg, widest low (budK > 1 lowers it) */
  budH:[.8,.45],budR:.31,budE:[.03,.95],budP:.85,budK:.7,budTw:.9,budW:1.5,budIn:.4,budVis:.22,
  /* life */
  bud:[.06,.3],dec:[.1,.4],fan:[.5,.25],shed:[.6,.2],shedF:.25,shedK:.55,fanK:[.1,.02,.05],limpF:.6,tip:[[.3,.15,.35],[1.4,.45,.35]],limp:[.9,.2],sag:[.04,.08,.18],
  wav:[.5,1.4,1],rev:[.2,.2],crk:[.03,.035],fanIn:.6,curl:[.1,.12],rollD:[.3,.4],
  brown:'#6e4528',edgeB:[.45,.8],edgeBW:2.2,green:[.7,.04,.24],greenC:'#7f9e54',floor:.5,
  /* the urn (x R0): its height below the petals, its widest radius and where, its neck */
  urn:{h:.3,r:.14,at:.6,neck:.06},
  /* the calyx: five sepals (L, W x R0), their outline by length, the appendages (lobes) of the two bearded and the half one */
  sep:{n:5,L:.8,W:.3,r0:.17,z0:-.05,open:[.04,.3],a0:[.06,2.25],a1:[-.05,2.65],cup:.35,top:[1.2,.85],wrap:1.05,part:.45,
    wp:[[0,.62],[.12,.9],[.3,.82],[.55,.5],[.8,.24],[.92,.16],[1,0]],lob:[2,2,1,0,0],lobV:[.28,.42,.56],lobA:.9,lobW:.05,fall:0},
  /* the heart: stamens seen when the heart's petals have opened (o of the innermost ranks beyond stO) */
  stN:[34,60],stO:.72,stR:.2,
  nu:[5,7],nv:[7,10],run:[9,12],dark:[[],[.88]],da:[.3,.28],lit:[[],[1.12]],la:[.22,.2],aoV:[[.12],[.16,.32]],aoA:[.3,.2],kd:1.2,kl:1.05,
  /* washF: the furled ranks beyond it get no washes (their shades, blurred across the crowded cone, read as petals seen through) */
  washF:null,rimW:.008,rimA:.4,brimA:.16,midA:[0,0],shd:[.012,.012,.2],pmin:2,pshare:.08,parea:.025,pmax:[6,10],cull:.97,
  light:{wrap:.34,amb:.3,dif:.66,sky:.14,ks:.08,gloss:12,trans:.3},
  /* the faded head (photographs 1396, 1403, 590: a rose hanging on its bent neck): matte and dry, the petals' backs as dark as their faces (bk
     toward the face's colour, bkD darker), the light pulled to the tone (lt: no pale plates), each petal with its own dark outline (edge colour,
     edgeK, width ew x, opacity ea), the washes and the cast shadows sharp and faint (wb, sh: x(1 - k.fan)), creased along its length (pleat) */
  fanM:{bk:.85,bkD:.1,lt:.3,edge:'#1e0c08',edgeK:.75,ew:1.8,ea:.75,wb:.25,sh:.6,da:.15,curl:.5,rimW:.5,dryB:.003,hs:.75,
    pleat:{n:[3,5],len:[.22,.5],w:.006,a:.22,c:'#24100a',lc:null,la:.2}}};
/* the faded material: a copy of the colourway's, matte and dry by fan (fanM) */
function svRoseFanMat(cw,fan,M){const o=Object.assign({},cw),fr=f=>svrC(cw.fr,f),k=fan;
  o.bk=Array.isArray(cw.bk)?cw.bk.map(([f,x])=>[f,mix(x,mix(fr(f),'#000000',M.bkD),M.bk*k)]):mix(cw.bk,mix(fr(.5),'#000000',M.bkD),M.bk*k);
  o.lite=mix(cw.lite,fr(.5),M.lt*k);o.blite=mix(cw.blite||cw.lite,fr(.5),M.lt*k);o.bshade=mix(cw.bshade||cw.shade,cw.shade,k);
  o.edge=mix(cw.edge||cw.shade,M.edge,M.edgeK*k);o.brim=mix(cw.brim||cw.rim,cw.rim,k);return o}
/* the section of a piece at u (-1..1): [across, lift toward the axis] for half width hw, arc half angle 2cf, the margin rolled back by rl
   (radians at the edge) past ru: the arc in closed form, then the rolled part integrated */
function svRoseSec(u,hw,cf,rl,ru){const s=Math.abs(u),sg=u<0?-1:1,k=2*cf,arc=t=>Math.abs(k)>1e-4?[Math.sin(k*t)/k,(1-Math.cos(k*t))/k]:[t,0];
  if(rl<=1e-3||s<=ru){const a=arc(s);return[sg*a[0]*hw,a[1]*hw]}
  let[x,y]=arc(ru);const m=5,dt=(s-ru)/m;for(let i=0;i<m;i++){const t=ru+(i+.5)*dt,e=(t-ru)/(1-ru),th=k*t-rl*e*e;x+=Math.cos(th)*dt;y+=Math.sin(th)*dt}
  return[sg*x*hw,y*hw]}
/* one piece (petal or sepal) as a surface in the head's frame (see svrSurf, y3-rosette.js): q {phi,L,Wd,r0,z0,a0,a1,cup,roll,tw,wav,rev,crk,curl,
   limp,bud,Hb,sc,wrap,top,t (genes), wp (an outline by length instead of claw and round top), lob ([[v, side, amp]...] appendages)} */
function svRoseSurf(P,B,R0,q){const t=q.t,rad=[Math.cos(q.phi),Math.sin(q.phi),0],T=[-Math.sin(q.phi),Math.cos(q.phi),0],ns=DET>=1.5?16:12,sp=[],dv=[],
    dn0=[0,-1,0],dnL=[V3.dot(B[0],dn0),V3.dot(B[1],dn0),V3.dot(B[2],dn0)];
  let p=[rad[0]*q.r0,rad[1]*q.r0,q.z0];
  for(let j=0;j<=ns;j++){const v=j/ns,a=q.a0+(q.a1-q.a0)*Math.pow(v,P.aPow)+q.curl*svSm((v-.6)/.4);let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
    if(q.limp>0){const hk=Math.min(.94,q.limp*Math.pow(v,.5)*(.55+.45*(t.hang||1)));let dn=dnL,c=V3.dot(d,dn);if(c<-.25){dn=V3.nz(V3.add(dnL,[0,0,1.5]));c=V3.dot(d,dn)}
      const an=Math.acos(Math.max(-1,Math.min(1,c)));if(an>1e-3){const s0=Math.sin(an);d=V3.nz(V3.add(V3.sc(d,Math.sin((1-hk)*an)/s0),V3.sc(dn,Math.sin(hk*an)/s0)))}}
    if(j)p=V3.add(p,V3.sc(d,q.L/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},vb=P.vb,
    half=(l,u)=>{let h=q.wp?svrT(q.wp,l):(l<vb?P.claw[0]+P.claw[1]*Math.pow(Math.sin(Math.min(1,l/vb)*Math.PI/2),P.clawK):1);
      if(q.lob)for(const[lv,sd,am]of q.lob)if(sd===0||sd===(u<0?-1:1))h+=am*Math.exp(-Math.pow((l-lv)/q.lobW,2));return h*q.Wd/2},
    nt=q.wp?0:P.notch*(t.notch==null?1:t.notch),
    tp=(t.tip||2.4)*(q.tipK||1),Lu=u=>q.wp?1:vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),tp)),1/tp)-nt*Math.max(0,1-Math.abs(u)/.22);
  return(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),nrm=V3.cr(d,T),ca=Math.cos(q.tw*vv),sa=Math.sin(q.tw*vv),A=V3.add(V3.sc(T,ca),V3.sc(nrm,sa)),
      hw=half(vv,u)*(1+(t.asym||0)*Math.sign(u)),cf0=q.cup*(.2+.8*svSm(vv/.45)),
      cf=q.conc>0?cf0+(Math.min(P.concK,hw/Math.max(R0*.03,Math.hypot(c[0],c[1])))/2-cf0)*q.conc:cf0,rl=q.roll*svSm((vv-P.rv)/(1-P.rv)),[tx,ly]=svRoseSec(u,hw,cf,rl,P.ru*(1-(P.ruTip||0)*svSm((vv-.65)/.35))),
      lift=ly+P.lap*u*hw*svSm(vv/.3)+q.wav*hw*Math.pow(Math.abs(u),1.5)*Math.sin((t.wk||2)*Math.PI*vv+(t.wph||0)+u*.8)*svSm(vv/.35)
        -q.rev*hw*Math.pow(Math.abs(u),4)+q.crk*hw*Math.sin(u*Math.PI*(2.2+(t.wk||2)*.4)+(t.wph||0)*2+vv*5)*svSm(vv/.25),
      Pt=V3.add(V3.add(c,V3.sc(A,tx)),V3.sc(nrm,lift));if(!(q.bud>0))return Pt;
    /* the bud: the piece lies on a pointed egg, widest low, the inner ranks on smaller eggs inside */
    const Rb=q.Hb*P.budR*q.sc,ve=v*(.35+.65*Lu(u))*q.top,v1=Math.min(1,ve),rr=Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(v1,P.budK))),P.budP)*(ve>1?Math.max(0,1-(ve-1)*6):1)+R0*.004,
      th=q.phi+u*q.wrap*(.5+.5*svSm(ve/.35))+(q.twb||0)*Math.max(0,ve-.7),zb=q.z0*.3+q.Hb*q.sc*ve-R0*.05;
    return V3.add(V3.sc(Pt,1-q.bud),V3.sc([Math.cos(th)*rr,Math.sin(th)*rr,zb],q.bud))}}
/* the colourway's margin band and flames, laid on each run of petals over their tone (svrDraw's run hook) */
function svRoseRun(cw,Dm,tol,fan,items,hs,FM){const band=cw.band,fl=cw.flames,dry=fan>.02?{c:h2l(svrC(cw.fr,.5))[2]>.62?'#7a5432':'#3a2414',w:.03+.09*fan,op:Math.min(.7,.2+.5*fan),b:FM?.008+(FM.dryB-.008)*fan:.008}:null;if(!band&&!fl&&!dry)return null;
  /* the distance to the outline at grid (u, v), as a share of the petal's length: to the top (the outline's length Lu at u) or to a side (the half
     width by height: the claw, then the broad top), so that a margin keeps one width all round, on the rolled part too */
  const eD=(u,v)=>{const au=Math.abs(u),Lu=.66+.34*Math.pow(Math.max(0,1-Math.pow(au,2.4)),1/2.4),l=v*Lu;return Math.min((1-v)*Lu,(1-au)*.5*(.3+.7*Math.sin(Math.PI/2*Math.min(1,l/.66))))},
    hi=DET>=1.5,lays=[];
  /* one piece's margin (b: colour, width, opacity), and its flames, as paths; vs its grid's visibility in the run (null: all of it) */
  const margD=(it,b,vs)=>{const sh=it.sh,W=sh.W,V=new Float32Array(it.K.length),w=b.w*(1-.35*it.f);let any=0;
      for(let q=0;q<V.length;q++){const u=-1+2*(q%W)/sh.nu,v=Math.floor(q/W)/sh.nv;V[q]=w*svSm((v-.1)/.3)-eD(u,v);if(vs)V[q]=Math.min(V[q],vs[q]*.5);if(V[q]>0)any=1}
      return any?svLoopsD(sh,svIso(sh.nu,sh.nv,V,0),Math.max(tol*2,Dm*(hi?.004:.008))):''},
    /* the flames: fine stripes along the veins (u fixed), irregular in place, length and width (a hash of the head's seed and the petal's rank),
       most of them short at the margin, a few long ones running in, thinning and breaking up toward the heart. pt 1: their outer half, pt 2:
       their inner half (laid fainter: they fade toward the heart) */
    flD=(it,vs,pt)=>{const sh=it.sh,sz=(it.bb[2]-it.bb[0])+(it.bb[3]-it.bb[1]);if(it.f>.7||sz<Dm*(hi?.12:.2))return'';let d='';const S=hi?8:5,
        sd=(Math.round(it.f*131)+7+Math.imul(hs|0,7))|0,n=Math.round(fl.n[0]+(fl.n[1]-fl.n[0])*pxHashS(Math.round(it.f*53),3,sd)),du=fl.du||.035,us=[];
      /* the places: uneven gaps (some stripes close in pairs, some wide spaces), spread over the petal's breadth */
      {let a=0;for(let m=0;m<n;m++){a+=.25+1.6*Math.pow(pxHashS(m,5,sd),1.4);us.push(a)}const a1=a+.25+1.6*pxHashS(n,5,sd)*.5;for(let m=0;m<n;m++)us[m]=-.86+1.72*us[m]/a1}
      for(let m=0;m<n;m++){const u0=us[m],h1=pxHashS(m,9,sd),ln=fl.len[0]+(fl.len[1]-fl.len[0])*Math.pow(h1,1.3),v0=.985-.04*pxHashS(m,17,sd),wm=du*(.45+1.1*pxHashS(m,13,sd)),Lp=[],Rp=[];
        const flush=()=>{if(Lp.length>1)d+='M'+Lp.concat(Rp.reverse()).map(p=>svF(p[0])+','+svF(p[1])).join('L')+'Z';Lp.length=0;Rp.length=0};
        for(let s2=0;s2<=S;s2++){const e=s2/S;if(pt===1&&e>.5||pt===2&&e<.5){flush();continue}
          /* toward its inner end a stripe breaks into dashes */
          if(e>.5&&pxHashS(m*16+s2,23,sd)<.6*(e-.45)){flush();continue}
          const v=fl.base?.08+ln*e:v0-ln*e,w=wm*Math.pow(1-e,.85)+.003;
          if(!vs||svLerp(sh,vs,u0,v)>0){Lp.push(svAt(sh,u0-w,v));Rp.push(svAt(sh,u0+w,v))}else flush()}
        flush()}return d};
  /* the layers: the band (a soft flush inward, then the margin itself), the flames (fine stripes along the veins, u fixed, evenly spaced, from the
     margin or the foot, tapering), the faded petals' dry brown margin, wider as the rose fades */
  if(band){const fm=band.f||.9;lays.push({b:Object.assign({},band,{w:band.w*1.9,op:(band.op||.85)*.32,b:.014}),fm},{b:band,fm})}
  if(fl)lays.push({fl:1,fm:.7,b:{c:fl.c,op:fl.op||.8,b:0}},{fl:2,fm:.7,b:{c:fl.c,op:(fl.op||.8)*.45,b:0}});
  if(dry)lays.push({b:dry,fm:FM?.6+.15*Math.min(1,fan*1.5):.6});
  const at=(L,d)=>Object.assign({d,fill:L.b.c,'fill-opacity':L.b.op||.85},L.fl?{}:{'fill-rule':'evenodd'});
  /* each piece carries its own layers whole (it.xd): a patch drawn over another piece shows them, never the bare piece */
  if(items&&!LOD)for(const it of items)if(it.grp==='p'&&it.sh)for(const L of lays)if(it.f<=L.fm){const d=L.fl?flD(it,null,L.fl):margD(it,L.b,null);if(d)(it.xd||(it.xd=[])).push(at(L,d))}
  return(run,vis,k)=>{for(const L of lays){let d='';run.forEach((it,j)=>{if(it.grp==='p'&&it.f<=L.fm)d+=L.fl?flD(it,vis[j],L.fl):margD(it,L.b,vis[j])});
      if(d)E('path',Object.assign(at(L,d),L.b.b?{filter:svBlur(Dm*L.b.b)}:{}),k)}}}
/* the urn (the hip) under the petals: a lit egg narrowing into the neck, for the order a sheet over it */
function svRoseUrn(P,B,O,R0,cw,sh0,zTop){const U=P.urn,c=cw.urn||['#2f4a1e','#58803a','#8fb06a'],H=R0*U.h,
    S=(u,v)=>{const a=(u+1)*Math.PI,z=zTop-H*(1-v),x=v,r=R0*(U.neck+(U.r-U.neck)*Math.pow(Math.sin(Math.PI*Math.min(1,x/U.at)/2),1.3))*(x>U.at?1-.35*Math.pow((x-U.at)/(1-U.at),1.6):1);
      return[Math.cos(a)*r,Math.sin(a)*r,z]},px=svSheet(B,O,S,{nu:12,nv:4});
  return svrFn(k=>{const pts=[];for(let j=0;j<=16;j++)for(let i=0;i<=4;i++){const p=PJ(B,O,S(-1+2*j/16,i/4));pts.push([p[0],p[1]])}const h=hull2(pts);
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of h){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
    const id='ru'+(gid++),L2=Math.hypot(LIGHT[0],LIGHT[1])||1,gr=E('radialGradient',{id,cx:svF(.5-.28*LIGHT[0]/L2),cy:svF(.5+.28*LIGHT[1]/L2),r:.75},GDEF||defs);
    stops(gr,[[0,sh0(c[2])],[.55,sh0(c[1])],[1,sh0(c[0])]]);E('path',{d:svSpl(h),fill:`url(#${id})`,stroke:sh0(c[0]),'stroke-width':svF(R0*.01),'stroke-opacity':.5},k)},px,-R0*.02)}
/* the heart of the open rose: a ring of stamens on the disc (filaments, anthers), seen where the heart's petals have opened */
function svRoseHeart(P,B,O,R0,cw,g,oH,fan,items){if(oH<P.stO||toV(B,[0,0,1])[2]<-.1)return;const hi=DET>=1.5,n=P.stN[hi?1:0],zc=R0*svrT(P.z0,1)*.7,rr=R0*P.stR*(.8+.4*oH),
    S=(u,v)=>{const a=(u+1)*Math.PI,r=rr*1.15*v;return[Math.cos(a)*r,Math.sin(a)*r,zc+R0*.04*(1-v)]},px=svSheet(B,O,S,{nu:10,nv:2}),k0=svSm((oH-P.stO)/.3);
  items.push(svrFn(k=>{let df='',da='';const aw=R0*(hi?.026:.034);
    for(let i=0;i<n;i++){const a=i*2.39996+(g.rot||0),rf=rr*(.45+.55*Math.sqrt((i+.5)/n)),h=R0*(.08+.06*pxHashS(i,3,g.sd||1))*k0,lean=.35+.5*rf/rr,
        p0=PJ(B,O,[Math.cos(a)*rf*.7,Math.sin(a)*rf*.7,zc]),p1=PJ(B,O,[Math.cos(a)*rf*(1+lean*.4),Math.sin(a)*rf*(1+lean*.4),zc+h]);
      df+=`M${svF(p0[0])},${svF(p0[1])}L${svF(p1[0])},${svF(p1[1])}`;da+=`M${svF(p1[0]-aw)},${svF(p1[1])}a${svF(aw)},${svF(aw*.8)} 0 1,0 ${svF(2*aw)},0a${svF(aw)},${svF(aw*.8)} 0 1,0 ${svF(-2*aw)},0`}
    E('path',{d:df,fill:'none',stroke:mix(cw.fil||'#d8c070','#8a6a3a',fan),'stroke-width':svF(R0*.012),'stroke-linecap':'round'},k);
    E('path',{d:da,fill:mix(cw.anth||'#e0a828','#6a4424',fan),stroke:mix(cw.anthE||'#9a6a18','#3a2414',fan),'stroke-width':svF(R0*.006)},k)},px,R0*.01))}
/* the head: in the frame B at O, D across, opening op (0 bud .. 1 blown), wilted wl (0 fresh .. 1 dry), colourway cwx, spec S */
/* the way a wilting head bows: the axis it turns about. Its weight pulls it down (the part of the fall across its axis: a head facing the viewer
   drops its face, an upright one has none), plus a sideways lean in the picture's plane (its own lean, else a side by its seed), never in depth */
function svRoseBowAx(B,seed){const b2=B[2],sd2=pxHashS(Math.round(seed)||1,5,3)<.5?-1:1,pr=v=>V3.add(v,V3.sc(b2,-V3.dot(v,b2)));
  const h=V3.add(pr([0,-1,0]),pr([.9*sd2+1.5*b2[0],0,0])),ax=V3.cr(b2,h),al=V3l(ax);return al>.05?V3.sc(ax,1/al):null}
/* bent: the caller has bowed the head on its own neck (rosaSvgPut: the neck drawn as an arc), the head is not turned again here */
function svRose(par,B,O,D,S,cwx,op,seed,wl,bent){const P=S._r||(S._r=Object.assign({},SVR_DEF,SVROSE_DEF,S)),g=P.genes(seed),cw=P.mat(cwx),R0=D/2,hi=DET>=1.5,Dm=D,tol=Math.max(.06,Dm*.0035);
  if(wl==null)wl=P.life?P.life():0;
  /* the petals go limp toward the stem as on the upright head (B0), the bow then turns the whole head: a hanging skirt, as on the photographs,
     never petals folded across the face */
  const B0=B;
  /* the wilting head bows (the bent neck of a cut rose): a head drawn alone (grid sheets) turns here about its foot; on a plant and in a bouquet
     rosaSvgPut (y-rosa.js) bends the neck itself into an arc and hands the head over already bowed (bent) */
  if(!bent&&(!P.noTip||(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null))){const tip=P.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0),A=svRoseBowAx(B,seed);
    if(tip>0&&A)B=B.map(r=>rotA(r,A,Math.min(tip,2.6)))}
  const bud=1-svSm((op-P.bud[0])/P.bud[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]),
    gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),Hb=R0*(P.budH[0]+P.budH[1]*svSm((op-.02)/.3)),N=g.n,items=[],
    sh0=c=>svShift(c,g.dh||0,g.ds||0,g.dl||0),fvis=P.budVis+(1-P.budVis)*Math.pow(1-bud,1.5),ol=P.oLaw,
    oOf=f=>svSm((op+(g.op||0)-(ol[0]+ol[1]*f))/ol[2])*(1-ol[3]*Math.pow(f,1.5)),
    dA=q=>toV(B0,V3.add(V3.sc([Math.cos(q.phi),Math.sin(q.phi),0],Math.sin(q.a1)),[0,0,Math.cos(q.a1)]))[1]*-1;
  const piece=(q,grp,mt,f,o2)=>{const S0=svRoseSurf(P,B0,R0,q),v0=grp==='p'?svrT(P.vTrim,f):0;
    const it=svrItem(P,B,O,v0>0?(u,v)=>S0(u,v0+(1-v0)*v):S0,mt,f,grp,Object.assign({shift:sh0,gt,tol,face:P.budFace>0&&bud>=P.budFace},o2||{}));if(it)items.push(it);return it};
  const FM=fan>.01&&P.fanM?P.fanM:null,fmt=FM?svRoseFanMat(cw,fan,FM):cw,
    /* the faded shape (fanM.curl: the hanging petals' tips flared back) on sheets only: in a bouquet (noTip) the head keeps its v2 measure (c5) */
    fG=FM&&(!P.noTip||(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null))?1:0;
  /* the petals, outermost first */
  for(let i=0;i<N;i++){const t=g.tep[i],f=N>1?i/(N-1):0;if(f>fvis)continue;
    const thin=!hi&&f>P.thin[0];if(thin&&i%P.thin[1]===P.thin[1]-1)continue;
    if(shed>0&&f<shed*P.shedF&&pxHashS(i,31,g.sd)>P.shedK)continue;
    const phi=i*P.div+g.rot+t.dph,o=oOf(f),oT=Math.pow(o,P.oTip),irr=1+P.irr*(t.big||0)*Math.max(0,1-f/P.irrF),
      peel=f<.12&&i===Math.floor(pxHashS(g.sd||1,43,7)*4)&&pxHashS(g.sd||1,47,3)<P.peelP?o*(1-bud):0,
      q={phi,t,f,tipK:svrT(P.tipF,f),conc:svrT(P.conc,f)*(1-P.concO*o),L:R0*svrT(P.L,f)*t.dL*irr*(1-P.fanK[0]*fan)*(P.Lc?svrT(P.Lc,f)+(1-svrT(P.Lc,f))*o:1),Wd:R0*svrT(P.W,f)*t.dW*(thin?P.thinW:1)*(1-P.fanK[1]*fan),r0:R0*svrT(P.r0,f),z0:R0*svrT(P.z0,f),
        a0:svrT(P.a0c,f)+(svrT(P.a0o,f)-svrT(P.a0c,f))*o+t.da0+svrT(P.wA0,f)*dec,a1:svrT(P.a1c,f)+(svrT(P.a1o,f)-svrT(P.a1c,f))*oT+t.da1+svrT(P.wA1,f)*dec*(t.wl||1),
        cup:(svrT(P.cupc,f)+(svrT(P.cupo,f)-svrT(P.cupc,f))*o)*(t.cup||1)*(1-P.fanK[2]*fan),
        roll:Math.max(0,(svrT(P.rollc,f)+(svrT(P.rollo,f)-svrT(P.rollc,f))*o)*(t.roll||1)*(1-bud)*(1+P.rollD[0]*dec)*(1-P.rollD[1]*fan*.5)),
        tw:(t.tw||0)*(1-.6*bud),wav:(t.wav||0)*(1-P.wav[0]*bud)*(1+P.wav[1]*dec+P.wav[2]*fan),rev:P.rev[0]*dec+P.rev[1]*fan,crk:P.crk[0]*dec+P.crk[1]*fan,
        curl:(P.curl[0]*dec+P.curl[1]*fan+(fG?FM.curl*fan:0))*(1-f),limp:P.limp[0]*fan*(1-P.limpF*f)+P.limp[1]*dec*(1-f),bud,Hb,sc:1-P.budIn*f,wrap:Math.PI/5*P.budW*(1-.3*f),top:1};
    /* the high centre (coneB): the furled ranks of the open head keep to the bud's pointed egg, a tight cone of petals wrapped round each other,
       loosened as the head declines and fades */
    {const cb=P.coneB?svrT(P.coneB,f)*(1-svSm(dec/.7))*(1-fan):0;if(cb>q.bud)q.bud=cb}
    q.a1+=(P.sag[0]+P.sag[1]*o+P.sag[2]*dec)*(1-bud)*Math.max(0,dA(q))*(1-f);q.a0+=P.peel[0]*peel;q.a1+=P.peel[1]*peel;q.a1-=P.fanIn*fan*svSm((f-.45)/.35);
    piece(q,'p',fmt,f)}
  /* the calyx: five sepals clasping the bud, parting, then turned down under the flower; yellowing as it fades */
  const SP=P.sep;if(SP&&!SVR_OFF.includes('sep')){const so=svSm((op-SP.open[0])/SP.open[1]),sm=cw.sep,smt=fan>0||dec>0?Object.assign({},sm,{fr:mix(mix(sm.fr,sm.yel||'#a89a58',Math.min(1,.4*dec+.5*fan)),'#5a4026',.75*fan),bk:mix(mix(sm.bk,sm.yel||'#a89a58',Math.min(1,.35*dec+.5*fan)),'#4a3420',.8*fan)}):sm;
    for(let i=0;i<SP.n;i++){const t=g.sep?g.sep[i]:g.tep[i%N],phi=g.rot+(i+.5)/SP.n*6.2832+(t.dph||0)*.5,nl=SP.lob[(i+(g.sl||0))%SP.n],lob=[];
      for(let m=0;m<SP.lobV.length;m++){const am=SP.lobA*(.7+.6*pxHashS(i,m+3,g.sd||1));if(nl>=2){lob.push([SP.lobV[m],-1,am*(1-.6*fan)]);lob.push([SP.lobV[m]+.04,1,am*(1-.6*fan)])}else if(nl===1)lob.push([SP.lobV[m],1,am*.8*(1-.6*fan)])}
      const q={phi,t:Object.assign({},t,{tip:1}),f:-.1,L:R0*SP.L*(t.dL||1)*(1-.5*fan),Wd:R0*SP.W*(t.dW||1)*(1-.55*fan),r0:R0*SP.r0,z0:R0*SP.z0,a0:SP.a0[0]+(SP.a0[1]-SP.a0[0])*Math.pow(so,1.5)+.15*dec+.2*fan,
        a1:SP.a1[0]+(SP.a1[1]-SP.a1[0])*Math.pow(so,.6)+.2*dec+.3*fan,twb:P.budTw*(t.dph>0?1:-1),cup:SP.cup,roll:0,tw:(t.tw||0)*.5,wav:.02,rev:0,crk:.06*fan,curl:.75*fan,limp:.3*fan,bud,Hb,sc:1.1,
        wrap:Math.PI/SP.n*SP.wrap*(1-(SP.part||0)*svSm(so/.5)),top:SP.top[1]+(SP.top[0]-SP.top[1])*bud,wp:SP.wp,lob:lob.length?lob:null,lobW:SP.lobW};
      piece(q,'s',smt,0,{nv:hi?18:14})}}
  /* the floor on the receptacle under the petals' feet, the urn below */
  if(P.floor&&bud<.2&&items.length&&!SVR_OFF.includes('floor')){const rf=R0*svrT(P.r0,0)*1.05,z1=R0*svrT(P.z0,1),z0f=R0*svrT(P.z0,0),fc=sh0(mix(svrC(cw.fr,.9),cw.shade,P.floor)),
      Sf=(u,v)=>{const a=(u+1)*Math.PI,r=rf*(1-v)+R0*.02;return[Math.cos(a)*r,Math.sin(a)*r,z0f+(z1-z0f)*Math.pow(v,1.4)]},px=svSheet(B,O,Sf,{nu:12,nv:3});
    items.push(Object.assign(svrFn(k2=>{const pts=[];for(let j=0;j<24;j++)for(const v of[0,.5,1]){const p=PJ(B,O,Sf(-1+2*j/24,v));pts.push([p[0],p[1]])}E('path',{d:svSpl(hull2(pts)),fill:fc},k2)},px,-R0*.05),{floor:1}))}
  if(!SVR_OFF.includes('urn'))items.push(svRoseUrn(P,B,O,R0,cw,sh0,R0*svrT(P.z0,0)-R0*.02));
  if(!SVR_OFF.includes('heart'))svRoseHeart(P,B,O,R0,cw,g,oOf(1),fan,items);
  if(P.heart)P.heart({B,O,R0,D:Dm,g,cw,op,bud,dec,fan,shed,items});
  /* the closed bud's core: the egg of the hidden ranks, so that the gaps where the tips meet never show the background */
  let core=null;if(bud>=.3){const sc=(1-P.budIn*fvis)*.96,Rb=Hb*P.budR*sc,z0=R0*svrT(P.z0,fvis),pts=[],cc=sh0(mix(mix(svrC(cw.fr,fvis),P.greenC,Math.min(1,gt*.85)),mix(P.greenC,'#0e1a06',.6),.3));
    for(let i=0;i<=8;i++){const ve=i/8,rr=Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(ve,P.budK))),P.budP),zb=z0*.3+Hb*sc*ve-R0*.05;for(let j=0;j<16;j++){const a=j/16*6.2832,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,zb]);pts.push([p[0],p[1]])}}
    core=[svSpl(hull2(pts)),cc]}
  /* the open rose's heart: a dark egg round the furled cone, behind every petal, so that where the heart's petals part (opening, fading, a bowed
     head) the gaps show the heart's shade, never the background */
  else{const z0=R0*svrT(P.z0,.45),z1=R0*(svrT(P.z0,1)+.75*svrT(P.L,1)),rm=R0*.3,pts=[],cc=sh0(mix(svrC(cw.fr,.9),cw.shade,.6-(FM?.3*fan:0)));
    for(let i=0;i<=8;i++){const t=i/8,z=z0+(z1-z0)*t,rr=rm*Math.pow(Math.sin(Math.PI*(.08+.84*t)),.7);for(let j=0;j<12;j++){const a=j/12*6.2832,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]);pts.push([p[0],p[1]])}}
    core=[svSpl(hull2(pts)),cc]}
  {const ks=items.filter(it=>it.grp==='p').map(it=>it.km).sort((a,b)=>a-b),kref=ks.length?ks[ks.length>>1]:1;for(const it of items)if(it.kind==='pet'&&it.grp==='p'){
    /* the heart sits in the cone of the outer ranks: its petals, though they face the light, are never lit beyond the flower's middle tone, and
       darken toward the axis (the cone's own shade), so that the furled heart never shows pale plates */
    const hk=P.heartSh*(1-bud)*(FM?1-FM.hs*fan:1)*svSm((it.f-.5)/.35)*(1-.65*svSm((h2l(it.c2)[2]-.66)/.2));/* heartK: the furled ranks' light pulled toward the middle tone (one smooth cone whose spiral is drawn by the edges, not a heap of plates) */
    const hK=1-(1-(P.heartK==null?1:P.heartK))*svSm((it.f-.5)/.25),km1=kref*P.kmed+(it.km-kref*P.kmed)*hK;
    it.tone=svrTone(P,it.c2,it.dk,it.lt,hk>0?Math.min(km1,kref*P.kmed*(1+.25*(1-hk/P.heartSh))):km1,kref*P.kmed);if(hk>0)it.tone=mix(it.tone,it.dk,hk);
    /* out of detail the band is not laid: its colour goes into the tone */
    if(LOD&&cw.band&&it.f<=(cw.band.f||.9))it.tone=mix(it.tone,cw.band.c,cw.band.w*.6);
    /* the furled heart beyond band.f shows little but its margins, in broken slivers between its neighbours: no band there, the colour of
       the margins goes into the tone instead (the heart of a picotee reads flushed with it, on the photographs) */
    if(!LOD&&cw.band&&cw.band.hk&&it.f>cw.band.f)it.tone=mix(it.tone,cw.band.c,cw.band.hk*svSm((it.f-cw.band.f)/.2))}}
  const fx=FM?{wclip:1,pedge:1,wbK:(1-.3*fan)*(1-FM.wb*fan),ewK:1+(FM.ew-1)*fan,daK:1-FM.da*fan,rimK:1-FM.rimW*fan,edgeA:P.edgeA+(FM.ea-P.edgeA)*fan,shK:1-FM.sh*fan,
    pleat:FM.pleat?Object.assign({},FM.pleat,{a:FM.pleat.a*fan,la:FM.pleat.la*fan,lc:FM.pleat.lc||fmt.lite}):null}:{wbK:1-.3*fan};
  return svrDraw(par,items,P,cw,Dm,tol,Object.assign({patchLate:1,zvis:1,dec,fan,core,bud,sepLay:P.sepLay>0&&bud>=P.sepLay,run:svRoseRun(cw,Dm,tol,fan,items,g.sd||Math.round(seed)||1,FM)},fx))}
/* ---------- the compound leaf: from its node (x, y on the screen, angle ang, length len), a petiole with its stipules, the rachis arching under its
   weight, n leaflets (pairs, the lowest smaller, and the terminal one), each ovate, double-toothed, folded on its midrib, its upper face darker and
   glossy, its underside paler with the midrib raised; wilting: the leaflets droop, fold and go limp (the bouquet's WILT yellows them).
   o: {n (3, 5, 7), wl, sd, side (the face: + upper, - under, 0..1 how much), ar (leaflet length / width), cols {up, upL, upD, low, lowL, vein, rach, stip}} */
const SVROSE_LEAF={n:5,ar:1.6,tooth:[13,.085],pet:.22,stip:.2,spread:58,droop:.35,fold:.32,arch:.18,face:.55,
  up:'#2f5428',upL:'#5f8a46',upD:'#1a3214',low:'#7d9a66',lowL:'#a9bf92',vein:'#8fb07a',veinLow:'#c7d6b4',rach:'#4a6a30',stip:'#6e8a4a',edge:'#7a5a30',red:'#7a3a2a'};
function svRoseLeaf(par,x,y,ang,len,o={}){const P=Object.assign({},SVROSE_LEAF,o),r=svRng(P.sd||1),wl=P.wl||0,hi=DET>=1.5,k=G(par),fan=svSm((wl-.4)/.45),
    np=(P.n-1)>>1,droop=P.droop+.5*fan,fold=P.fold+.35*fan,Lt=len,pl=Lt*P.pet,ra=Lt*.55,lightV=V3.nz([LIGHT[0],LIGHT[1],LIGHT[2]||.6]);
  /* the leaf's frame on the screen (y down): forward H, its normal N (in the screen), and z toward the viewer; the face turned by side */
  const H=[Math.cos(ang),Math.sin(ang)],Nn=[-H[1],H[0]],sideK=P.side==null?.6:P.side,S2=p=>[x+p[0],y+p[1]];
  /* a 3D point in the leaf's frame (a along H, b along N, c toward the viewer) to the screen, with the rachis's arch and droop (toward +y) */
  const scr=(a,b)=>{const dy=droop*Lt*Math.pow(Math.max(0,a/Lt),2)*.6;return S2([H[0]*a+Nn[0]*b,H[1]*a+Nn[1]*b+dy])},
    rach=t=>scr(pl+ra*t,Lt*P.arch*Math.sin(Math.PI*t)*.15);
  const items=[];
  /* the petiole and rachis (one stroke), the stipules (two narrow wings at its foot) */
  {const pts=[S2([0,0])];for(let i=0;i<=8;i++)pts.push(rach(i/8));items.push({z:-1,draw:g=>{E('path',{d:svQuad(pts),fill:'none',stroke:mix(P.rach,P.red,.25),'stroke-width':svF(Math.max(.25,Lt*.016)),'stroke-linecap':'round'},g)}});
    /* the stipules: a broad wing fused to the petiole's foot on both sides, ending in two free pointed auricles that diverge (photos 1031, 1032) */
    if(P.stip>0){const W=Lt*P.stip*.5,sp=[[0,.32],[.25,.5],[.5,.66],[.72,.8],[.95,1.25],[.78,.36],[.84,0]],sl=[];
      for(const[t,w]of sp)sl.push(scr(pl*t,W*w));for(let i=sp.length-2;i>=0;i--)sl.push(scr(pl*sp[i][0],-W*sp[i][1]));
      const vm=[scr(0,0),scr(pl*.8,0)],ve=[scr(pl*.55,W*.35),scr(pl*.92,W*.95),scr(pl*.55,-W*.35),scr(pl*.92,-W*.95)];
      items.push({z:-.5,draw:g=>{E('path',{d:svSpl(sl),fill:P.stip,stroke:P.upD,'stroke-width':svF(Lt*.004),'stroke-opacity':.55,'stroke-linejoin':'round'},g);
        E('path',{d:`M${svF(ve[0][0])},${svF(ve[0][1])}L${svF(ve[1][0])},${svF(ve[1][1])}M${svF(ve[2][0])},${svF(ve[2][1])}L${svF(ve[3][0])},${svF(ve[3][1])}M${svF(vm[0][0])},${svF(vm[0][1])}L${svF(vm[1][0])},${svF(vm[1][1])}`,fill:'none',stroke:P.upD,'stroke-width':svF(Lt*.003),'stroke-opacity':.35},g)}})}
    /* fine prickles under the petiole and rachis: small hooks bent toward the leaf's foot */
    {let d='';const pw=Lt*.007,ph=Lt*.024;for(let i=0;i<5;i++){const a=pl*.9+ra*(i*.19+.06*r()),sd=i%2?1:.6,b0=scr(a-pw,0),b1=scr(a+pw,0),tp=scr(a-ph*.55,ph*sd),c=scr(a+pw*.2,ph*sd*.45);
        d+=`M${svF(b0[0])},${svF(b0[1])}Q${svF(c[0])},${svF(c[1])} ${svF(tp[0])},${svF(tp[1])}L${svF(b1[0])},${svF(b1[1])}Z`}
      items.push({z:-.4,draw:g=>{E('path',{d,fill:mix(P.rach,P.red,.55),stroke:'none'},g)}})}}
  /* each leaflet: its foot on the rachis, its axis (2D), its size; the blade as two halves around the midrib, folded (the half away from the light
     darker), the margin with forward teeth (doubled in close-up) */
  const lfs=[];for(let i=0;i<np;i++){const t=(i+.55)/(np+.4),q=i/Math.max(1,np-1);for(const s of[-1,1])lfs.push({t,s,sz:(.72+.28*q)*(.92+.16*r()),an:(P.spread-10*q+r.in(-8,8))*Math.PI/180})}
  lfs.push({t:1,s:0,sz:1.08+.1*r(),an:r.in(-.08,.08)});
  const Lf=Lt*.42;
  for(const lf of lfs){const p0=rach(lf.t),ah=ang+(lf.s===0?lf.an:lf.s*lf.an)+droop*.5*(lf.s===0?0:1)*Math.sign(Math.cos(ang))*.3,ax=[Math.cos(ah),Math.sin(ah)],nx=[-ax[1],ax[0]],
      L=Lf*lf.sz*(1-.08*fan),Wh=L/P.ar/2*(1-.25*fan),dr=droop*(.5+.5*r())+(lf.s?.15:0),tw=sideK*(lf.s||1)*(.6+.4*r());
    /* the half-width along the blade (ovate: broadest a third up, acute tip, rounded foot) */
    const hwf=s=>Math.pow(Math.sin(Math.PI*Math.min(1,.12+.88*Math.pow(s,.85))),.7)*(1-.2*s),M=hi?96:40,nT=Math.round(P.tooth[0]*(hi?1:.7)),
      pt=(s,b)=>{const a=s*L,dy=dr*L*s*s*.5,wd=b*Wh*(1-.35*fold*Math.abs(b))*(b<0?1-tw*.15:1);return[p0[0]+ax[0]*a+nx[0]*wd,p0[1]+ax[1]*a+nx[1]*wd+dy-fold*Math.abs(b)*Wh*.25]};
    const am=P.tooth[1]*(hi?1:.8),k0=Math.ceil(.08*nT),k1=Math.floor(.95*nT),half=sg=>{const out=[],tp=(s,a)=>out.push(pt(s,sg*(hwf(s)+a)));
        for(let m=0;m<=5;m++)tp(k0/nT*m/5,0);
        for(let k2=k0;k2<k1;k2++){const sk=k2/nT,dt=1/nT;if(k2>k0)tp(sk,0);if(hi){tp(sk+.3*dt,am*.3);tp(sk+.42*dt,am*.52);tp(sk+.52*dt,am*.34)}else tp(sk+.45*dt,am*.42);tp(sk+.78*dt,am*.86);tp(sk+.9*dt,am)}
        for(let m=0;m<=5;m++)tp(k1/nT+(1-k1/nT)*m/5,0);return out};
    const A=half(1),Bh=half(-1),blade=A.concat(Bh.slice().reverse()),mid=[];for(let m=0;m<=6;m++)mid.push(pt(m/6*.97,0));
    /* which face shows: the leaf's own (side) and the fold */
    const up=(lf.s===0?sideK:sideK*(lf.s>0?1:.7))>=0,lk=V3.dot([nx[0],-nx[1],.6],lightV),cU=up?P.up:P.low,cL=up?P.upL:P.lowL,cD=up?P.upD:mix(P.low,P.upD,.45);
    const z=lf.t*.8+(lf.s===0?.5:0)+lf.s*.01*Math.sign(Math.sin(ang));
    items.push({z,draw:g=>{E('path',{d:'M'+blade.map(p=>svF(p[0])+','+svF(p[1])).join('L')+'Z',fill:mix(cU,cL,.2+.2*Math.max(0,lk)),stroke:mix(cD,P.edge,fan*.6),'stroke-width':svF(Math.max(.15,Lt*.004)),'stroke-opacity':.6,'stroke-linejoin':'miter'},g);
      const sh=(lk>0?Bh:A).concat(mid.slice().reverse());E('path',{d:svSpl(svSimp(sh,.08)),fill:cD,'fill-opacity':.32+.15*fold},g);
      if(up)E('path',{d:svQuad(A.slice(Math.round(A.length*.15),Math.round(A.length*.7)).map((p,i,arr)=>{const m=mid[Math.min(6,Math.round(i/arr.length*6))];return[p[0]*.55+m[0]*.45,p[1]*.55+m[1]*.45]})),fill:'none',stroke:cL,'stroke-width':svF(Lt*.02),'stroke-opacity':.28,'stroke-linecap':'round'},g);
      let dv=svQuad(mid);if(hi){const nv2=Math.min(8,nT-2);for(let m=0;m<nv2;m++){const se=(Math.round(1+m*(nT-3)/Math.max(1,nv2-1))+.9)/nT,s0=Math.max(.04,se-.2),a=pt(s0,0);
        for(const sg of[-1,1]){const b=pt(se,sg*(hwf(se)+am*.7)),c=pt(s0+.08,sg*hwf(s0+.08)*.6);dv+=`M${svF(a[0])},${svF(a[1])}Q${svF(c[0])},${svF(c[1])} ${svF(b[0])},${svF(b[1])}`}}}
      E('path',{d:dv,fill:'none',stroke:up?P.vein:P.veinLow,'stroke-width':svF(Lt*(hi?.004:.006)),'stroke-opacity':up?.2:.36,'stroke-linecap':'round'},g)}})}
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.draw(k);return k}
/* ---------- the stem's prickles (svStemLine post hook): a gene per stem decides a thorny stem or a dethorned one (florists strip them: pale
   scars remain); prickles broad-based, hooked toward the foot, reddish brown, set on the silhouette alternately, sparser close to the head.
   o: {p (share of thorny stems), step (x width), len (x width), col [body, tip], scar} */
function svRoseThorns(o={}){const P=Object.assign({p:.5,step:[5,9],len:.95,col:['#6e7a3c','#8a3a26'],scar:'#b9b48a',scarE:'#7d7a52'},o);
  return(g,cg,C,Wd,N,T,W0)=>{const n=C.length;if(n<3||LOD)return;const sd=Math.round(C[0][0]*7+C[0][1]*13),thorny=pxHashS(sd,7,11)<P.p;let acc=0,k=0,d='',ds='',next=W0*P.step[0];
    for(let i=1;i<n-1;i++){acc+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);if(acc<next)continue;acc=0;k++;next=W0*(P.step[0]+(P.step[1]-P.step[0])*pxHashS(k,3,sd));
      const w=Wd[i]/2,s=pxHashS(k,5,sd)<.5?1:-1,h=pxHashS(k,9,sd);
      if(thorny){const L=W0*P.len*(.7+.6*h),b=W0*(.55+.3*h),bx=C[i][0]+N[i][0]*w*s*.92,by=C[i][1]+N[i][1]*w*s*.92,
          a0=[bx-T[i][0]*b*.5,by-T[i][1]*b*.5],a1=[bx+T[i][0]*b*.5,by+T[i][1]*b*.5],tp=[bx+N[i][0]*s*L-T[i][0]*L*.55,by+N[i][1]*s*L-T[i][1]*L*.55];
        d+=`M${svF(a1[0])},${svF(a1[1])}Q${svF(bx+N[i][0]*s*L*.35+T[i][0]*b*.1)},${svF(by+N[i][1]*s*L*.35+T[i][1]*b*.1)} ${svF(tp[0])},${svF(tp[1])}Q${svF(bx+N[i][0]*s*L*.25-T[i][0]*b*.45)},${svF(by+N[i][1]*s*L*.25-T[i][1]*b*.45)} ${svF(a0[0])},${svF(a0[1])}Z`}
      else if(h<.75){const o2=(pxHashS(k,13,sd)*2-1)*.75*w,cx=C[i][0]+N[i][0]*o2,cy=C[i][1]+N[i][1]*o2,rl=W0*.2,rw=W0*.11,an=Math.atan2(T[i][1],T[i][0])*180/Math.PI;
        ds+=`M${svF(cx-T[i][0]*rl)},${svF(cy-T[i][1]*rl)}A${svF(rl)},${svF(rw)} ${svF(an)} 1,0 ${svF(cx+T[i][0]*rl)},${svF(cy+T[i][1]*rl)}A${svF(rl)},${svF(rw)} ${svF(an)} 1,0 ${svF(cx-T[i][0]*rl)},${svF(cy-T[i][1]*rl)}Z`}}
    if(d){const id='rt'+(gid++),gr=E('linearGradient',{id,x1:0,y1:1,x2:1,y2:0},GDEF||defs);stops(gr,[[0,P.col[0]],[.55,mix(P.col[0],P.col[1],.6)],[1,P.col[1]]]);
      E('path',{d,fill:`url(#${id})`,stroke:mix(P.col[1],'#2a1408',.5),'stroke-width':svF(W0*.03),'stroke-opacity':.6},g)}
    if(ds)E('path',{d:ds,fill:P.scar,stroke:P.scarE,'stroke-width':svF(W0*.025),'stroke-opacity':.5},cg)}}
