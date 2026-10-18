/* ================= Kit : la fleur aux tépales réfléchis (y3-reflexe.js), pièce générique (fichier neuf : y3.js inchangé) =================
   svReflex(par,B,O,D,S,cwx,op,seed,wl): a nodding flower whose free tepals sweep back past the horizontal (gloriosa; Turk's-cap lilies, tiger lily,
   cyclamen-like heads): svBloom draws cups, svBell bells; here each tepal's spine turns from its shoulder angle aS (from the flower's axis B[2],
   pedicel -> mouth) to its body angle aB over [s0, s0+s1], then hooks to aT at the tip from f0; each angle has three values [bud, column, open]:
   the closed bud (pointing along the axis), the column (the tepals swept back and gathered round the pedicel: the opening gloriosa) and the open
   crown (spread). Two laws: r1 = the reflex (bud -> column, from rf[0] over rf[1]), r2 = the spread (column -> open, from sp[0] over sp[1]).
   Across, a tepal is an arc: in the bud the arc of the bud's own circle (the six close it, budW x the 60 degrees each), open a gutter (half-angle
   cup); its width follows the profile wp (claw, widest near the middle, an acuminate tip: superellipse tip from vb), its margins crisped: an
   out-of-plane wave (gene wav x L, wk half-waves along, phase per side) and a waved outline (gene ew); each tepal twists (tw), bends sideways (lat).
   Life: green from the foot in the bud (green, greenC), the decline (dec) twists and crimps, the faded (fan) narrows (fanW), shortens (fanL),
   gathers back toward the column (fanIn), crumples (crk) and goes limp toward the ground (limp); the tepals stay on (they wither on the flower).
   Hooks of the sheet: genes(seed), mat(colourway) -> {st, bst, shade, lite, bshade, blite, vein, bvein, rim, cast, cross, flames, transmit, base},
   heart(ctx) (svReflexHeart below), life(). Sizes x R0 = D/2. */
const SVRX_DEF={bud:[.08,.24],rf:[.2,.28],sp:[.46,.44],dec:[.1,.4],fan:[.5,.32],grow:[.5,.42],green:[.92,.1,.3],greenC:'#a8b860',greenTip:.2,
  L:[1.24,1.2],W:[.178,.182],r0:.07,z0:[0,.006],
  wp:[[0,.55],[.08,.72],[.24,.96],[.42,1],[.58,.95],[.76,.68],[.9,.34],[1,.08]],
  aS:[[.78,1.85,1.66],[.74,1.8,1.62]],aB:[[.2,2.92,2.62],[.18,2.9,2.68]],aT:[[-.62,2.8,1.95],[-.6,2.84,2.05]],
  s0:[.04,.05],s1:[.42,.32],f0:[.7,.72],cup:[.5,.42],budW:[1.04,1.04],vb:.6,wavO:[.2,1],ewO:[.25,1],
  fanL:.32,fanW:.6,wavD:1.2,decB:.25,fanIn:.85,limp:[.5,.1],crk:[.025,.09],twF:1.2,twD:.6,
  ao:[.5,.26,.2,.3],nu:[7,11],nv:20,pmin:3,veinN:[11,6],veinNet:[.2,0],veinFork:[.45,.2],floor:3,floorO:0,floorD:0,floorK:0,floorV:.14,floorC:.95,
  light:Object.assign({},SVB_DEF.light,{ks:.12,gloss:16})};
function svReflex(par,B,O,D,S,cwx,op,seed,wl){const P=Object.assign({},SVRX_DEF,S),g=P.genes(seed),cw0=P.mat(cwx),R0=D/2*(cw0.sz||1),pieces=[],hi=DET>=1.5,det=hi?1.3:.8;
  if(wl==null)wl=P.life?P.life():0;
  const oo=op+g.op,bud=1-svSm((oo-P.bud[0])/P.bud[1]),r1=svSm((oo-P.rf[0])/P.rf[1]),r2=svSm((oo-P.sp[0])/P.sp[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),
    grow=P.grow[0]+(1-P.grow[0])*svSm(oo/P.grow[1]),gt=P.green[0]*(1-svSm((oo-P.green[1])/P.green[2])),
    shv=(c,v)=>{const x=svShift(c,g.dh,g.ds,g.dl),k2=gt*(1-P.greenTip*v);return k2>0?mix(x,P.greenC,Math.min(1,k2*(1.15-v*.5))):x},
    ramp=st=>st.map(([v,c])=>[v,shv(c,v)]),
    mat=Object.assign({stops:ramp(cw0.st),bstops:ramp(cw0.bst),shade:shv(cw0.shade,.5),lite:cw0.lite,bshade:shv(cw0.bshade,.5),blite:cw0.blite,rim:cw0.rim,cast:cw0.cast},P.light,
      {trans:.1+.12*dec,rw:hi?.003+.003*dec:0,ro:.22});
  if(cw0.cross)mat.cross=cw0.cross.map(z=>Object.assign({},z,{st:z.st.map(([x,c,a])=>[x,shv(c,.6),(a??1)*(1-.7*gt)])}));
  if(cw0.transmit&&hi)mat.transmit=cw0.transmit;
  /* the angle of a whorl's table at this stage: bud -> column (r1) -> open (r2); the faded gathers back toward the column (fanIn) */
  const ang=(A,w)=>{const a=A[w];return a[0]+(a[1]-a[0])*r1+(a[2]-a[1])*r2*(1-P.fanIn*fan)},
    dn=[-B[0][1],-B[1][1],-B[2][1]],wpf=v=>{const W=P.wp;for(let j=1;j<W.length;j++)if(v<=W[j][0]){const q=(v-W[j-1][0])/(W[j][0]-W[j-1][0]);return W[j-1][1]+(W[j][1]-W[j-1][1])*svSm(q)}return W[W.length-1][1]};
  let k=0,rCl=1e9;const n=g.n||6,nO=Math.ceil(n/2);
  for(let w=0;w<2;w++)for(let i=0;i<(w?n-nO:nO);i++,k++){const t=g.tep[k],phi=g.rot+(i+(w?.5:0))/(w?n-nO:nO)*6.2832+t.dph;
    const rad=[Math.cos(phi),Math.sin(phi),0],T=[-Math.sin(phi),Math.cos(phi),0],L=R0*P.L[w]*t.dL*grow*(1-P.fanL*fan),
      aS=ang(P.aS,w)+t.da*.5*r1,aB=ang(P.aB,w)+t.da*r1+P.decB*dec*t.wl*(1-r2*.5),aT=ang(P.aT,w)+t.dt*r1+.5*fan*t.hang,
      s0=P.s0[0]+(P.s0[1]-P.s0[0])*r1,s1=P.s1[0]+(P.s1[1]-P.s1[0])*r1,f0=P.f0[0]+(P.f0[1]-P.f0[0])*r1,ns=24,sp=[],dv=[],rr=[],
      limp=P.limp[0]*fan+P.limp[1]*dec,lat=t.lat*L*r1*(1+.8*fan);
    let p=[rad[0]*R0*P.r0,rad[1]*R0*P.r0,R0*P.z0[w]];
    for(let j=0;j<=ns;j++){const v=j/ns,tt=svSm((v-s0)/s1),ff=svSm((v-f0)/(1-f0)),a=aS*(1-tt)+aB*tt+(aT-aB)*ff;let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
      if(limp>0)d=V3.nz(V3.add(d,V3.sc(dn,limp*v*v)));
      d=V3.nz(V3.add(d,V3.sc(T,lat/L*Math.PI*Math.cos(Math.PI*v)*.5)));
      if(j)p=V3.add(p,V3.sc(d,L/ns));const kb=bud*svSm((v-.7)/.3),q=kb>0?[p[0]*(1-kb),p[1]*(1-kb),p[2]]:p;sp.push(q);dv.push(d);rr.push(Math.max(L*.012,Math.hypot(q[0],q[1])))}
    {const q=sp[Math.round(P.floorV*ns)];rCl=Math.min(rCl,Math.hypot(q[0],q[1]))}
    const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return Array.isArray(A[0])?V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2)):A[j]*(1-f2)+A[j+1]*f2};
    const vbB=P.vb+(1-P.vb)*bud*.9,Lu=u=>vbB+(1-vbB)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),t.tip)),1/t.tip),
      wv=t.wav*(P.wavO[0]+(P.wavO[1]-P.wavO[0])*r1)*(1+P.wavD*dec)*(hi?1:.8),ew=t.ew*(P.ewO[0]+(P.ewO[1]-P.ewO[0])*r1)*(1+.6*fan),
      tw=t.tw*r1*(1+P.twF*fan)+P.twD*dec*Math.sign(t.tw||1),crk=(P.crk[0]*dec+P.crk[1]*fan)*(hi?1:.5),
      hW=R0*P.W[w]*t.dW*grow*(1-P.fanW*fan),cup=P.cup[w]*(1-.5*fan);
    const Sf=(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),r=at(rr,vv),nrm=V3.cr(d,T),ca=Math.cos(tw*vv),sa=Math.sin(tw*vv),A=V3.add(V3.sc(T,ca),V3.sc(nrm,sa)),N=V3.add(V3.sc(nrm,ca),V3.sc(T,-sa)),
        side=u<0?1:0,hO=hW*wpf(vv)*(1+t.asym*Math.sign(u))*(1+ew*Math.sin(t.wk*1.3*Math.PI*vv+t.wph*1.7+side*2.3)*svSm((vv-.1)/.25)),
        hB=P.budW[w]*r*1.0472,hw=bud>0?hO*(1-bud)+Math.max(hO,hB)*bud:hO,rhoB=r/Math.max(.3,Math.abs(d[2])),kk=Math.max(1e-5,bud/rhoB+(1-bud)*cup/Math.max(1e-4,hw)),th=u*hw*kk,
        lift=(1-Math.cos(th))/kk+wv*L*Math.pow(Math.abs(u),1.6)*Math.sin(t.wk*Math.PI*vv+t.wph+side*2.1)*svSm((vv-.08)/.3)*(1-.85*bud)
          +crk*L*Math.sin(u*Math.PI*(2.2+t.wk*.3)+t.wph*2+vv*9)*svSm(vv/.25);
      return V3.add(V3.add(c,V3.sc(A,Math.sin(th)/kk)),V3.sc(N,lift))};
    const vr=svRng(t.sd),vn=svVeins(vr,(hi?P.veinN[0]:P.veinN[1])+vr.in(0,2),hi?P.veinNet[0]:P.veinNet[1],hi?P.veinFork[0]:P.veinFork[1]),vc=shv(cw0.vein,.5),vo=cw0.vo??.22;
    const fl=cw0.flames,flames=fl&&r1>.3?(()=>{const fr=svRng(t.sd+13),nf=Math.round(fr.in(fl.n[0],fl.n[1])),L2=[];for(let q=0;q<nf;q++){const u0=fr.in(-.75,.75),v0=fl.from*fr.in(.6,1.3),v1=Math.min(.95,fl.to*fr.in(.7,1.1)),pl=[],ph=fr.in(0,6.3);
        for(let s2=0;s2<=9;s2++){const v=v0+(v1-v0)*s2/9;pl.push([Math.max(-.9,Math.min(.9,u0*(.5+.5*svSm(v/.5))+.06*Math.sin(v*9+ph))),v])}L2.push([pl,fl.w*fr.in(.6,1.4)])}return L2})():null;
    const m=Object.assign({},mat,{flames:flames?{c:shv(fl.c,.3),op:fl.op*(hi?1:.8),list:flames}:null,
      veins:!hi&&vo<.3?null:(s2,front)=>front?[[vn.main,.0024,vc,vo*.8+.2*dec],[vn.fine,.0017,vc,vo*.45]]:[[vn.main,.0024,shv(cw0.bvein||cw0.vein,.5),vo*.8+.15*dec]]});
    if(!hi)for(const q of['stops','bstops'])if(m[q].length>3)m[q]=[m[q][0],m[q][Math.floor(m[q].length/2)],m[q][m[q].length-1]];
    pieces.push(svSheet(B,O,Sf,{nu:Math.round((fan>.2&&hi?P.nu[1]:P.nu[0])*det),nv:Math.round(P.nv*det),mat:m,zb:w?.002:0,
      ao:(u,v,front)=>front?1-P.ao[0]*(1-svSm((v-.02)/P.ao[1])):1-P.ao[2]*(1-svSm(v/P.ao[3]))}))}
  /* the floor: a small disc round the ovary where the claws meet, so that nothing shows between their feet (the base colour, darker) */
  /* in the decline the claws part: the floor widens into a shallow cone behind their feet (floorD, its rise floorK toward the pedicel) */
  /* it only exists once the bud loosens, is gone as they wither (fan), and never reaches past the tepals' feet (their spine at floorV,
     x floorC): seen from the mouth it stays hidden under the claws; its colour is the claws' own (the inner ramp at floorV) */
  const kF=bud<.9?1-svSm(fan/.45):0;
  if(P.floor&&kF>.02){const dF=dec*(1-svSm(fan/.45)),rf=kF*Math.min(R0*P.r0*P.floor*(1+P.floorO*r2*(1-dF)+P.floorD*dF),P.floorC*rCl),zk=P.floorK*Math.max(dF,.5*r2),
      rampAt=(S,v)=>{for(let j=1;j<S.length;j++)if(v<=S[j][0])return mix(S[j-1][1],S[j][1],(v-S[j-1][0])/Math.max(1e-6,S[j][0]-S[j-1][0]));return S[S.length-1][1]},
      bc=rampAt(mat.stops,P.floorV*.7),fm=Object.assign({},mat,{stops:[[0,mix(rampAt(mat.stops,0),'#3a3a10',.2)],[.6,bc],[1,bc]],bstops:[[0,bc],[1,bc]],cross:null,transmit:null,flames:null,veins:null});
    pieces.push(svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI;return[Math.cos(a)*rf*v,Math.sin(a)*rf*v,R0*(.012-.02*v)-zk*rf*v*v]},{nu:10,nv:3,mat:fm,zb:-.003}))}
  if(P.heart)P.heart({par,B,O,D,R0,g,cw0,op:oo,r1,r2,bud,dec,fan,det,pieces,dn});
  return svDraw(par,pieces,{D:R0*2,pmin:P.pmin,shadow:hi})}

/* ---------- svReflexHeart(o): the heart of a reflexed flower, its parts spread out across the axis ----------
   n stamens radiating between the tepals: the filament leaves the ovary's foot at filR, goes out nearly square to the axis (its angle from the
   axis a0 at the foot, a1 at the end, in the open flower; gathered along the axis while the flower opens: law st), long filL; the anther versatile,
   held across the filament's end (anL long, anW wide). The pistil: the ovary (ovR, ovH), the style bent square near its foot (styZ along the axis,
   then out to one side, styL long, gene sty its direction), three short stigmas (sgL). Each part is a drawn piece with a proxy strap for the order.
   Faded: the anthers darken, shrivel and some fall, the filaments go limp toward the ground. Colours of the colourway: fil, anth, pol, ov, sty, sg. */
const SVRXH_DEF={n:6,filR:.06,filL:.82,filW:.014,a0:1.35,a1:1.62,anL:.17,anW:.04,ovR:.065,ovH:.13,styZ:.1,styL:.9,styW:.013,styA:1.5,sgL:.07,st:[.3,.3],lo:1,sOff:.25,cb:.24,dnD:0};
function svReflexHeart(o0){const o=Object.assign({},SVRXH_DEF,o0);
  return({B,O,R0,g,cw0,op,bud,dec,fan,pieces,dn})=>{if(bud>.6)return;const hi=DET>=1.5,lo=o.lo&&!hi,ost=svSm((op-o.st[0])/o.st[1]),sz=g.stL||1,
      lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),
      anth=mix(cw0.anth,'#3a2414',.6*fan),fil=mix(cw0.fil,'#5a4a2a',.5*fan),pol=mix(cw0.pol||mix(cw0.anth,'#ffffff',.35),'#3a2a18',.6*fan),
      styC=mix(cw0.sty||cw0.fil,'#5a4a2a',.45*fan),sgC=mix(cw0.sg||'#d8d070','#6a5a30',.4*fan),ovC=mix(cw0.ov||'#a8b46a','#7a6a40',.5*fan);
    /* a strap along a polyline of 3D points: drawn piece (width w0 -> w1, colour c, a lit edge), its proxy a thin sheet along the same spine */
    const strap=(P3,w0,w1,c,extra)=>{const sp=v=>{const x=v*(P3.length-1),j=Math.min(P3.length-2,Math.floor(x)),f=x-j;return V3.add(V3.sc(P3[j],1-f),V3.sc(P3[j+1],f))},
        ax0=V3.cr(V3s(P3[P3.length-1],P3[0]),[0,0,1]),side=V3l(ax0)>1e-3?V3.nz(ax0):[1,0,0],
        prox=svSheet(B,O,(u,v)=>V3.add(sp(v),V3.sc(side,u*Math.max(w0,R0*.02))),{nu:2,nv:Math.max(3,P3.length)});
      pieces.push({fn:k2=>{const S2=P3.map(p=>PJ(B,O,p)),Lp=[],Rp=[],Hp=[];const nS=S2.length;
        for(let q=0;q<nS;q++){const a=S2[Math.max(0,q-1)],b=S2[Math.min(nS-1,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ww=(w0+(w1-w0)*q/(nS-1))*.5,nx=-dy/l,ny=dx/l,sg=nx*lt[0]+ny*lt[1]>0?1:-1;
          Lp.push([S2[q][0]+nx*ww,S2[q][1]+ny*ww]);Rp.push([S2[q][0]-nx*ww,S2[q][1]-ny*ww]);Hp.push([S2[q][0]+nx*ww*.45*sg,S2[q][1]+ny*ww*.45*sg])}
        const hk=G(k2);E('path',{d:svSpl(Lp.concat(Rp.reverse())),fill:c,stroke:mix(c,'#2a2410',.35),'stroke-width':svF(Math.max(.15,w0*.12)),'stroke-opacity':.5},hk);
        if(!LOD&&!lo)E('path',{d:svSpl(Hp,false),fill:'none',stroke:mix(c,'#ffffff',.45),'stroke-width':svF(Math.max(.2,w1*.35)),'stroke-opacity':.55,'stroke-linecap':'round'},hk);
        if(extra)extra(hk)},proxy:prox})};
    /* the stamens */
    for(let i=0;i<o.n;i++){if(fan>.3&&pxHashS(i,17,g.sd)<(fan-.3)*1.3)continue;
      /* opposite stamens (sOff 0, one per tepal) follow their own tepal's turn (dph): the filament keeps to the middle of its tepal */
      const nT=g.n||6,kT=o.sOff===0&&o.n===nT&&g.tep?(i%2?Math.ceil(nT/2)+(i-1)/2:i/2):-1,dT=kT>=0&&g.tep[kT]?g.tep[kT].dph:0,
        phi=g.rot+dT+(i+o.sOff+.06*(pxHashS(i,4,g.sd)-.5))/o.n*6.2832,rad=[Math.cos(phi),Math.sin(phi),0],T=[-Math.sin(phi),Math.cos(phi),0],fl=R0*o.filL*sz*(.92+.14*pxHashS(i,3,g.sd))*(.55+.45*ost)*(1-.38*fan),
        e=.12*(pxHashS(i,8,g.sd)-.5),cb=o.cb*(pxHashS(i,11,g.sd)-.5),P3=[];let p=[rad[0]*R0*o.filR,rad[1]*R0*o.filR,R0*.02];P3.push(p);
      for(let j=1;j<=7;j++){const v=j/7,a=.12+((o.a0+(o.a1-o.a0)*v+e)-.12)*ost;let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];d=V3.nz(V3.add(d,V3.sc(T,cb*v*ost)));if(fan+dec>0)d=V3.nz(V3.add(d,V3.sc(dn,(.9*fan+o.dnD*dec)*v)));p=V3.add(p,V3.sc(d,fl/7));P3.push(p)}
      const tip=P3[P3.length-1],vs=svSm((ost-.45)/.45),ta=V3.nz(V3.add(V3.sc(V3.nz(V3.add(T,V3.sc(rad,.25*(pxHashS(i,9,g.sd)-.5)))),vs),V3.sc(V3.nz(V3s(tip,P3[P3.length-2])),1.0001-vs))),al=R0*o.anL*sz*(1-.4*fan),a0=V3.add(tip,V3.sc(ta,-al*.5)),a1=V3.add(tip,V3.sc(ta,al*.5));
      strap(P3,R0*o.filW*1.4,R0*o.filW*.8,fil,ost<.2?null:hk=>{const A=PJ(B,O,a0),Bq=PJ(B,O,a1),C=PJ(B,O,tip),aw=Math.max(.35,R0*o.anW*(1-.35*fan)),dx=Bq[0]-A[0],dy=Bq[1]-A[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,sg=nx*lt[0]+ny*lt[1]>0?1:-1;
        const mid=[(A[0]+Bq[0])/2+nx*aw*.12,(A[1]+Bq[1])/2+ny*aw*.12];
        E('path',{d:'M'+svJ([svR(A[0]),svR(A[1])])+'Q'+svJ([svR(mid[0]),svR(mid[1])])+' '+svJ([svR(Bq[0]),svR(Bq[1])]),fill:'none',stroke:anth,'stroke-width':svF(aw),'stroke-linecap':'round'},hk);
        if(!LOD&&!lo)E('path',{d:'M'+svJ([svR(A[0]+nx*aw*.22*sg+dx*.15),svR(A[1]+ny*aw*.22*sg+dy*.15)])+'l'+svJ([svR(dx*.68),svR(dy*.68)]),fill:'none',stroke:pol,'stroke-width':svF(aw*.4),'stroke-linecap':'round','stroke-opacity':.6},hk);
        E('circle',{cx:svF(C[0]),cy:svF(C[1]),r:svF(Math.max(.2,aw*.28)),fill:mix(fil,'#000000',.2)},hk)})}
    /* the pistil: the ovary, the style bent square to one side, three short stigmas */
    if(ost>.05){const sa=g.sty??0,sr=[Math.cos(sa),Math.sin(sa),0],sL=R0*o.styL*sz*(.5+.5*ost),P3=[[0,0,R0*o.ovH]];let p=P3[0];
      for(let j=1;j<=8;j++){const v=j/8,a=v<.18?.1:(o.styA*ost+.1*(1-ost))-.12*(v-.18);let d=[sr[0]*Math.sin(a),sr[1]*Math.sin(a),Math.cos(a)];if(fan>0)d=V3.nz(V3.add(d,V3.sc(dn,.6*fan*v)));
        p=V3.add(p,V3.sc(d,j===1?R0*o.styZ:(sL-R0*o.styZ)/7));P3.push(p)}
      const ov=k2=>{const pts=[];for(let j=0;j<12;j++){const a=j/12*6.2832;for(const[z,r]of[[0,R0*o.ovR],[R0*o.ovH,R0*o.ovR*.55]])pts.push(PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z]))}
        E('path',{d:svSpl(hull2(pts.map(q=>[q[0],q[1]]))),fill:ovC,stroke:mix(ovC,'#2a3010',.4),'stroke-width':svF(Math.max(.15,R0*.006)),'stroke-opacity':.5},k2)};
      const end=P3[P3.length-1],tg=V3.nz(V3s(end,P3[P3.length-2]));
      strap(P3,R0*o.styW*1.3,R0*o.styW,styC,hk=>{if(!lo)ov(hk);let d='';for(let q=0;q<3;q++){const bq=V3.nz(V3.add(tg,V3.sc([Math.cos(q*2.09+sa),Math.sin(q*2.09+sa),Math.cos(q*2.09)*.6],.8))),a=PJ(B,O,end),b=PJ(B,O,V3.add(end,V3.sc(bq,R0*o.sgL*sz)));
          d+='M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])])}E('path',{d,fill:'none',stroke:sgC,'stroke-width':svF(Math.max(.3,R0*o.styW*.9)),'stroke-linecap':'round'},hk)})}}}
