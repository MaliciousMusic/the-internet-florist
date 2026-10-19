/* ================= y-viola.js : la pensée (Viola × wittrockiana) en SVG natif, dessinée à la main d'après les photos =================
   Photos refcache/pensee (8 to 11, 36, 84, 94: faces; 12, 83: three-quarters; 348, 349: profile; 81, 82: buds; 114, 244: decline; 582, 583:
   the calyx after the corolla falls). Five velvety petals, zygomorphic: two upper ones behind (the largest, overlapping each other in the
   middle), two laterals over their lower part, bearded at the foot, the broad lower one in front, its claw running back into a short blunt spur
   between the two lower sepals. The face: a dark blotch with feathered rays on the three lower petals (sometimes on the upper ones), fine dark
   pencil veins radiating from the throat, a yellow-orange eye at the foot of the lower petal round the throat, the white globular stigma in it.
   Five green lanceolate sepals behind, with short basal appendages. The bud nods on its hooked pedicel: a closed calyx, the folded petals
   coming out as a coloured twisted point. The decline: the petals go limp, flop back and crinkle; faded, they shrivel round the stigma.

   Structure (BONNES-PRATIQUES §13-14, no piece through another, by construction): every piece lies on one smooth base surface Σ(s, θ) (s the
   length from the receptacle along a meridian, θ the azimuth round the head's axis z; the meridian's angle from the axis α(s, θ) goes from a
   narrow cone in the bud to a shallow dish open, its sectors bent apart: the upper petals back, the lower one flat), each piece offset along
   the surface's normal by its layer (the sepals deepest, then the upper petal behind, the upper one in front, the laterals, the lower petal on
   top). Parallel surfaces never meet: the head cannot cross itself; a piece's own ruffles and cupping stay inside half a layer's gap. In the
   bud the normal points to the axis: the layer behind in the open flower is the outer one of the bud (the sepals outside, then the upper
   petals: Viola's imbricate aestivation). */
const VIO_DEF={
  r0:.05,G:.04,
  /* the base surface: the throat's angle aT, reaching the face's plane by s1; the bend of the outer part by sector (b0 + b1·sin θ: the upper
     petals back, the lower flat), from bS over bL; the bud: a cone (aB) whose tip folds in (aBt) */
  aT:.62,s1:.3,b0:.07,b1:.16,bS:.35,bL:.55,aB:.13,aBt:-.32,open:[.12,.6],bud:[.05,.25],
  /* the pieces: k kind, phi azimuth (deg), L length, W half width (× R0), lay the layer (× G), wp width profile, vb where the side margin ends,
     tip the superellipse of the rounded edge, notch the lower petal's emarginate tip */
  pet:[{k:'up',phi:118,L:1.2,W:.66,lay:-2.3},{k:'up',phi:62,L:1.2,W:.66,lay:-1.3},{k:'lat',phi:162,L:.9,W:.5,lay:-.2},{k:'lat',phi:18,L:.9,W:.5,lay:.5},
    {k:'low',phi:270,L:.8,W:.68,lay:1.6,notch:.05}],  /* fiche: upper 1.15 x 1.16 R0 at 62/118 deg; laterals .98 x 1.0 R0 rising 12 to 26 deg over the horizontal (154/12 deg);
    lower .77 x 1.37 R0; then volume.py at three-quarters (photo jaune-clair: wide above, narrow below) asked for broader uppers, shorter laterals */
  wp:{up:[[0,.16],[.12,.32],[.3,.66],[.48,.93],[.62,1]],lat:[[0,.2],[.12,.34],[.3,.66],[.5,.95],[.62,1]],low:[[0,.05],[.14,.14],[.3,.46],[.46,.86],[.58,1]]},  /* to the broadest point; past it the edge is half an ellipse (vioW) */
  vb:.42,tip:1.7,
  sep:{n:5,phi0:90,L:.62,W:.085,lay:-3.6},
  wav:[.004,.007],cup:.01,budCap:1.15,
  ao:[.5,.2,.25,.3],nu:[12,16],nv:22,pmin:3,
  light:{wrap:.32,amb:.3,dif:.66,sky:.12,ks:.05,gloss:10,dark:[.94,.86,.78,.7,.62,.54],da:.16,lit:[1.05,1.12],la:.16,darkLo:[.9,.78,.66],daLo:.22,litLo:[1.07],laLo:.2,soft:.04,trans:.12}};
const VIO_GENES={n:[[5,1]],tep:{dL:[.95,1.05],dW:[.94,1.06],dph:[-.04,.04],tw:[-.06,.06],wav:[.6,1.3],wk:[3,5],wph:[0,6.28],asym:[-.05,.05],sd:'sd'},
  head:{rot:[-.06,.06],op:[-.03,.03],dh:[-2,2],ds:[-.04,.04],dl:[-.015,.015],upF:[0,1],ray:[.85,1.15],sd:'sd'}};
const VIO_SOLO=typeof location!=='undefined'&&/[?&]solo=(\d+)/.test(location.search||'')?+RegExp.$1:-1;  /* test only: &solo=k draws petal k alone (apparence.py) */
const VIO_NOHRT=typeof location!=='undefined'&&/[?&]nohrt=1/.test(location.search||'');
/* the colourways (ids of CW_PANS, s10a.js): the ground of each petal kind from the claw (0) to the edge (1) and of the back, the blotch, the
   pencil veins, the eye, the rim; a colourway without its own table is built from its catalogue colours (vioSpec) */
const VIO_CW={};
function vioSpec(cw){const c=cw.c||'#5a2a9a',top=cw.top||c,[h,s,l]=h2l(c),wh=l>.85,face=cw.bl&&!cw.wh,
    back=x=>mix(x,'#f4f0ea',.32),deep=x=>mix(x,'#14081e',.35),eyeC='#f2c21c';
  const ramp=x=>[[0,mix(x,'#f2d040',.25)],[.12,mix(x,'#f6ecd8',wh?.1:0)],[.3,x],[.75,x],[1,mix(x,'#ffffff',wh?0:.06)]];
  return{st:{up:ramp(top),lat:ramp(c),low:ramp(c)},bst:{up:[[0,'#9ab45a'],[.2,back(top)],[1,back(top)]],lat:[[0,'#9ab45a'],[.2,back(c)],[1,back(c)]],low:[[0,'#9ab45a'],[.2,back(c)],[1,back(c)]]},
    blot:face?{c:cw.bl,v:[.4,.62,.82],u:[.6,.86,.8],ray:[30,.22],up:0}:null,  /* fiche: lateral [0,.6], lower [0,.85] with its rays */
    pen:{c:face?cw.bl:deep(l>.6?mix(c,'#3a1a40',.6):c),n:[11,9,13],v:[.32,.42,.5],w:.006,op:face?.35:.75},
    eye:{c:eyeC,c2:'#e08a14',v:.3,u:.42,lat:.16}  /* fiche: the eye 0.08 D, on the lower petal's claw and the laterals' feet */,rim:null,
    fine:{amb:.52,dif:.48,sat:.45,ao:.3,gloss:8,ks:.015,grain:.012,glow:.25}  /* velvet: matte, no sheen (photos 36, 84 at 1:1) */,striae:{n:46,dk:.03,lt:.022},
    shade:mix(c,'#1a0a28',.5),lite:mix(c,'#ffffff',.4),bshade:mix(back(c),'#3a3040',.4),blite:'#ffffff',vein:deep(c),bvein:mix(back(c),'#6a6070',.3),vo:.18,
    beard:wh?'#fff8e8':'#ffffff',sg:'#f4f2e2',sgE:'#c8d088',sep:'#5e8a3a',sepB:'#86a856',throat:mix(eyeC,'#7a8a30',.5)}}  /* the floor seen between the claws: the eye's yellow-olive (photos 84, 94), never a dark hole */
function vioMat(cw){const k='pensee:'+cw.id;if(VIO_CW[k])return VIO_CW[k];const C=Object.assign(vioSpec(cw),VIO_TAB[cw.id]||{});
  if(typeof VIO_GRID!=='undefined'&&VIO_GRID[cw.id]){C.grid=VIO_GRID[cw.id];if(C.blot)C.blot=Object.assign({},C.blot,{grid:1})}  /* measured grids (y-viola-grilles.js): the blotch's field is in them */
  if(C.eye&&VIO_TAB[cw.id]&&VIO_TAB[cw.id].eye)C.eye=Object.assign({},vioSpec(cw).eye,VIO_TAB[cw.id].eye);if(C.blot&&C.blotC)C.blot=Object.assign({},C.blot,{c:C.blotC});
  return VIO_CW[k]=C}
/* the heart of each colourway measured on its named photo (refcache/pensee-work/coeur.py -> refcache/pensee/coeur-photo.json, 2026-10-19):
   the eye, the beard, the stigma, the throat and the blotch's core; vioMat lays them over the catalogue's defaults */
const VIO_TAB={
  'violet':{eye:{c:'#f9f014',c2:'#130b14'},beard:'#f4eee6',sg:'#ffff58',throat:'#130b14',blotC:'#1e0a29'},
  'jaune':{eye:{c:'#c6a204',c2:'#5e3d18'},beard:'#c1cab4',sg:'#cdd3ab',throat:'#5e3d18',blotC:'#17040a'},
  'jaune-clair':{eye:{c:'#fef424',c2:'#f4ec8b'},beard:'#f9f6d3',sg:'#fffbbb',throat:'#f4ec8b'},
  'bleu':{eye:{c:'#c39c06',c2:'#100704'},beard:'#edd3ce',sg:'#d0af10',throat:'#100704',blotC:'#0b030c'},
  'bleu-ciel':{eye:{c:'#e0bc28',c2:'#746d53'},beard:'#bdbba1',sg:'#eec92c',throat:'#746d53'},
  'pourpre':{eye:{c:'#fdf60d',c2:'#330703'},beard:'#f9f6e2',sg:'#ffff1d',throat:'#330703',blotC:'#350611'},
  'blanc':{eye:{c:'#9b8304',c2:'#000000'},beard:'#bab9a1',sg:'#b99c03',throat:'#000000',blotC:'#000000'},
  'blanc-clair':{eye:{c:'#7f6203',c2:'#795200'},beard:'#c3bb9b',sg:'#858463',throat:'#795200'},
  'lavande':{eye:{c:'#cf9905',c2:'#3c1434'},beard:'#cbbdae',sg:'#f4b002',throat:'#3c1434'},
  'orange':{eye:{c:'#8d5406',c2:'#6f2000'},sg:'#ce9764',throat:'#6f2000'},
  'rouge':{eye:{c:'#c2a71d',c2:'#2a0f06'},beard:'#dec9ab',sg:'#d8cb80',throat:'#2a0f06',blotC:'#190b07'},
  'noir':{eye:{c:'#fcd90d',c2:'#2e051f'},beard:'#f5d8c4',sg:'#ffff17',throat:'#2e051f',blotC:'#160d0d'},
  'violet-jaune':{eye:{c:'#d2b60b',c2:'#0c0400'},beard:'#e0d6b8',sg:'#f8d407',throat:'#0c0400',blotC:'#040300'},
  'mauve':{eye:{c:'#ac9a08',c2:'#916e01'},beard:'#b8b3a7',sg:'#d4b904',throat:'#916e01',blotC:'#754b64'},
};
function vioLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'pensee',rec:{}})):0}
const vioRamp=(W,v)=>{for(let j=1;j<W.length;j++)if(v<=W[j][0]){const q=(v-W[j-1][0])/(W[j][0]-W[j-1][0]);return W[j-1][1]+(W[j][1]-W[j-1][1])*svSm(q)}return W[W.length-1][1]};
/* the face of one petal, over its washes (photos 36, 84, 94 at 1:1): the blotch, a dark fan from the claw with a feathered edge (rays of uneven
   length along the veins), the pencil veins, fine and tapering, then the eye at the throat and, on the laterals, the beard; front face only */
function vioOver(C,kind,sd,st){const r=svRng(sd+91),B=C.blot&&(kind!=='up'||C.blot.up)?C.blot:null,ki=kind==='up'?0:kind==='lat'?1:2,
    rays=[],pens=[],hairs=[];
  if(B){const n=Math.round(B.ray[0]*(kind==='low'?1:.75)),vb=B.v[ki]*(kind==='up'?B.up||1:1);
    for(let q=0;q<n;q++){const u=(-1+2*(q+.5)/n)*B.u[ki]*1.05+r.in(-.03,.03),len=vb*(1+B.ray[1]*Math.pow(r(),1.6))*(1-.35*Math.abs(u)),w=r.in(.012,.03);rays.push([u,len,w,r.in(0,6.3)])}}
  if(C.pen&&(kind!=='up'||C.pen.up)){const n=C.pen.n[ki];for(let q=0;q<n;q++){const u=(-1+2*(q+.5)/n)*.82+r.in(-.03,.03),len=C.pen.v[ki]*r.in(.6,1.2)*(1-.3*Math.abs(u));pens.push([u,len,r.in(.7,1.3),r.in(0,6.3)])}}
  if(kind==='lat')for(let q=0;q<90;q++){const v=.04+.2*Math.pow(r(),1.4),u=r.in(-.32,.32)*(.6+v*1.4);hairs.push([u,v,r.in(.014,.035),r.in(-.6,.6)])}  /* the beard: a dense tuft of short club hairs (photos 36, 84 at 1:1) */
  if(kind==='low'&&C.beardLow)for(let q=0;q<18;q++){const v=r.in(.03,.14),u=r.in(-.25,.25);hairs.push([u,v,r.in(.025,.05),r.in(-.5,.5)])}
  const k=svSm((st.eo-.45)/.35),fade=1-.6*st.fan;
  return(cg,it,sh,front,Dm)=>{if(!front||LOD||k<.05)return;const hi=DET>=1.5,L=sh.L||Dm*.5;
    const P=(u,v)=>svAt(sh,Math.max(-1,Math.min(1,u)),Math.max(0,Math.min(1,v)));
    /* a tapering band along v at u (widening with the blade), from v0 to v1, its half width w (× L) at the foot narrowing to 0 */
    const band=(u0,v0,v1,w,ph,wig)=>{const N=10,Lp=[],Rp=[];for(let i=0;i<=N;i++){const v=v0+(v1-v0)*i/N,t=i/N,u=u0*(.35+.65*svSm((v-.02)/.4))+wig*Math.sin(v*14+ph),
        a=P(u,v),b=P(u+.02,v),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,hw=L*w*Math.pow(1-t,.8)*(.6+.4*Math.sin(Math.PI*Math.min(1,t*3+.2)));
        Lp.push([a[0]+dx/l*hw,a[1]+dy/l*hw]);Rp.push([a[0]-dx/l*hw,a[1]-dy/l*hw])}return svSpl(Lp.concat(Rp.reverse()))};
    /* the velvet's striae (photo 8 at 1:1): many fine raised lines along the veins, fanning from the claw, a dark groove and a lit ridge each,
       denser and darker toward the throat */
    if(hi&&C.striae){const S=C.striae,rs=svRng(sd+7),seen=(u,v)=>it.s*svLerp(sh,sh.F,Math.max(-1,Math.min(1,u)),v)>.05;let dk='',lt='';
      const path=pts=>{let d='',on=false;for(const p of pts){if(!p){on=false;continue}d+=(on?'L':'M')+svF(p[0])+','+svF(p[1]);on=true}return d};
      for(let q=0;q<S.n;q++){const u0=(-1+2*(q+rs.in(.1,.9))/S.n)*.96,v0=rs.in(.02,.12),v1=rs.in(.35,.95),ph=rs.in(0,6.3),pts=[],pl=[];
        for(let i=0;i<=14;i++){const v=v0+(v1-v0)*i/14,u=u0*(.3+.7*svSm((v-.02)/.45))+.004*Math.sin(v*13+ph);pts.push(seen(u,v)?P(u,v):null);pl.push(seen(u+.012,v)?P(u+.012,v):null)}
        dk+=path(pts);lt+=path(pl)}
      if(dk)E('path',{d:dk,fill:'none',stroke:C.shade,'stroke-width':svF(Math.max(.15,L*.0016)),'stroke-opacity':svF(S.dk*k*fade),'stroke-linecap':'round'},cg);
      if(lt)E('path',{d:lt,fill:'none',stroke:'#ffffff','stroke-width':svF(Math.max(.15,L*.0014)),'stroke-opacity':svF(S.lt*k),'stroke-linecap':'round'},cg)}
    if(B){/* the core: a fan from the claw, its edge rounded, then the rays past it */
      const vb=B.v[ki],uw=B.u[ki],N=16,Lp=[],Rp=[];for(let i=0;i<=N;i++){const v=vb*i/N,t=i/N,hw=uw*(.3+.7*Math.sin(Math.PI*.5*Math.min(1,t*1.3)))*Math.pow(Math.max(0,1-Math.pow(t,5)),.5);Lp.push(P(-hw,v));Rp.push(P(hw,v))}  /* a fan widening outward, its end rounded off (photos 36, 94) */
      const core=svSpl(Lp.concat(Rp.reverse()));let dr='';for(const[u,len,w,ph]of rays)dr+=band(u,.05,len,w,ph,.006);
      const c0=mix(B.c,'#ffffff',.06*st.fan);
      /* with a measured grid the blotch's field is already in the tissue: only its feathered edge (the rays along the veins) is drawn crisp */
      if(B.grid){E('path',{d:dr,fill:c0,'fill-opacity':.7*k*fade},cg)}else{
      if(hi)E('path',{d:core+dr,fill:c0,'fill-opacity':.5*k,filter:svBlur(Math.max(.2,L*.012))},cg);
      E('path',{d:core,fill:c0,'fill-opacity':.94*k*fade},cg);E('path',{d:dr,fill:c0,'fill-opacity':.86*k*fade},cg);
      /* velvet: the blotch is darker at its heart, a soft sheen toward the light */
      if(hi)E('path',{d:core,fill:mix(c0,'#000000',.35),'fill-opacity':.35*k,filter:svBlur(Math.max(.3,L*.05))},cg)}}
    if(pens.length){let d='';for(const[u,len,ww,ph]of pens)d+=band(u,.03,len,C.pen.w*ww,ph,.004);E('path',{d,fill:C.pen.c,'fill-opacity':C.pen.op*k*fade},cg)}
    /* the eye: a yellow-orange patch at the throat, sharp-edged toward the blotch, its heart deeper */
    if(C.eye&&kind!=='up'){const e=C.eye,ve=kind==='low'?e.v:e.lat,ue=kind==='low'?e.u:.4;if(ve>0){const N=8,Lp=[],Rp=[];
        for(let i=0;i<=N;i++){const v=ve*i/N,hw=ue*(1-Math.pow(i/N,1.6))*(.45+.55*Math.sin(Math.PI*.5*Math.min(1,i/N*2+.2)));Lp.push(P(-hw,v));Rp.push(P(hw,v))}
        const d=svSpl(Lp.concat(Rp.reverse()));E('path',{d,fill:e.c,'fill-opacity':.95*k},cg);
        if(hi){const N2=6,L2=[],R2=[];for(let i=0;i<=N2;i++){const v=ve*.55*i/N2,hw=ue*.5*(1-i/N2);L2.push(P(-hw,v));R2.push(P(hw,v))}E('path',{d:svSpl(L2.concat(R2.reverse())),fill:e.c2,'fill-opacity':.7*k,filter:svBlur(Math.max(.2,L*.008))},cg)}}}
    /* the beard: fine white hairs at the foot of the laterals, each with its shade */
    if(hairs.length&&hi){let dh='',ds='';const sw=Math.max(.15,L*.0045);
      /* the tuft's soft pale ground first, then each hair (a fine curved stroke, its tip a little thicker), its shade under it */
      {const N=6,Lp=[],Rp=[];for(let i=0;i<=N;i++){const v=.03+.22*i/N,hw=.3*(1-i/N)+.08;Lp.push(P(-hw,v));Rp.push(P(hw,v))}
        E('path',{d:svSpl(Lp.concat(Rp.reverse())),fill:C.beard,'fill-opacity':.22*k,filter:svBlur(Math.max(.3,L*.02))},cg)}
      for(const[u,v,len,tl]of hairs){const a=P(u,v),m=P(u*.95+tl*.03,v-len*.5),b=P(u*.9+tl*.06,v-len),q=[2*m[0]-(a[0]+b[0])/2+tl*sw,2*m[1]-(a[1]+b[1])/2];
        dh+=`M${svF(a[0])},${svF(a[1])}Q${svF(q[0])},${svF(q[1])} ${svF(b[0])},${svF(b[1])}`;ds+=`M${svF(a[0]+sw)},${svF(a[1]+sw*1.3)}Q${svF(q[0]+sw)},${svF(q[1]+sw*1.3)} ${svF(b[0]+sw)},${svF(b[1]+sw*1.3)}`}
      E('path',{d:ds,fill:'none',stroke:'#1a0a20','stroke-width':svF(sw*1.2),'stroke-opacity':.22*k,'stroke-linecap':'round'},cg);
      E('path',{d:dh,fill:'none',stroke:C.beard,'stroke-width':svF(sw),'stroke-opacity':.75*k,'stroke-linecap':'round'},cg)}}}
/* an irregular crumple field in (u, f), -1..1: a few crossing creases of hashed directions and phases, never a regular band */
function vioCrumple(u,f,sd){let z=0,w=0;for(let i=0;i<5;i++){const a=pxHashS(i,1,sd)*6.283,k=5+7*pxHashS(i,2,sd),ph=pxHashS(i,3,sd)*6.283,q=.35+.65*pxHashS(i,4,sd);
    z+=Math.sin((Math.cos(a)*u+Math.sin(a)*f*2)*k+ph)*q;w+=q}return z/w}
/* a crumple field on the base surface (s, θ), periodic in θ: shared by every layer at a place, it keeps their order (nothing crosses) */
function vioCrumpleP(th,s,sd){let z=0,w=0;for(let i=0;i<6;i++){const m=2+Math.floor(6*pxHashS(i,5,sd)),k=6+9*pxHashS(i,6,sd),ph=pxHashS(i,7,sd)*6.283,q=.35+.65*pxHashS(i,8,sd);
    z+=Math.sin(m*th+k*s*(pxHashS(i,9,sd)<.5?1:-1)+ph)*q;w+=q}return z/w}
/* the head: in the frame B at O (z from the pedicel to the face), D the flower's width */
function svViola(par,B,O,D,S,cwx,op,seed,wl){const P=Object.assign({},VIO_DEF,S),g=svGenes(seed,VIO_GENES),C=vioMat(cwx),R0=D/2,pieces=[],hi=DET>=1.5,det=hi?1.3:.8;
  if(wl==null)wl=vioLife();
  const oo=op+g.op,eo=svSm((oo-P.open[0])/P.open[1]),bud=1-svSm((oo-P.bud[0])/P.bud[1]),dec=svSm((wl-.08)/.4),fan=svSm((wl-.45)/.4),
    G0=R0*P.G,gk=1+1.1*dec*(1-fan)+.5*fan,G=G0*gk,  /* (furled, faded: the layers close up again round the axis) */  /* the petals part as they go limp: the layers move apart from the calyx out, room for their folds */
    off=(lay,s)=>{const k=1+(gk-1)*svSm(((s??1)-.2)/.35);return(lay<P.sep.lay+.01?-2.3*k-1.3+(lay-P.sep.lay):lay*k)*G0-2*(1-eo)*G0},  /* a layer's offset round the middle one (the laterals): a large offset near the axis would cross it at the throat; spread past the throat as the petals go limp; the sepals always 1.3 gaps behind the back petal; in the bud every layer kept outside the axis */
    /* the meridian's angle from the axis: bud cone -> open dish; the decline flops the outer part back, the faded shrivels it in */
    alpha=(s,th,nw)=>{const sn=Math.sin(th),open=P.aT+(Math.PI/2-P.aT)*svSm(s/P.s1)+(P.b0+P.b1*sn)*svSm((s-P.bS)/P.bL),
        bd=P.aB+(P.aBt-P.aB)*svSm((s-.55)/.45),a=bd+(open-bd)*eo;
      if(nw===1)return a;const a2=a-dec*(.2-.1*sn)*svSm((s-.4)/.5)*(nw===2?1-fan:1);return a2+(P.aB-a2)*(nw===2?.5:.9)*fan*svSm((s-.05)/.25)},  /* limp, the corolla half closes (114); faded it furls back into a twisted cone the calyx holds (ov08, ov43) */  /* limp, the corolla half closes (114), shrivelled it draws in round the stigma; past the calyx: the sepals keep their place */
    base=(s,th,nw)=>{const n=12,ds=s/n;let r=P.r0,z=0;for(let i=0;i<n;i++){const a=alpha((i+.5)*ds,th,nw);r+=Math.sin(a)*ds;z+=Math.cos(a)*ds}return[Math.cos(th)*r*R0,Math.sin(th)*r*R0,z*R0]},
    norm=(s,th,nw)=>{const e=1e-3,a=base(s+e,th,nw),b=base(Math.max(0,s-e),th,nw),c=base(s,th+e,nw),d=base(s,th-e,nw);return V3.nz(V3.cr(V3s(a,b),V3s(c,d)))},
    shv=(c,v)=>{let x=svShift(c,g.dh,g.ds,g.dl);const gt=bud*svSm((.42-v)/.3);if(gt>0)x=mix(x,'#86a050',Math.min(.9,gt));return x}  /* the bud's petals green at the claw only, the colour from the tip (5.4: never a grey mix) */,
    ramp=st=>st.map(([v,c])=>[v,shv(c,v)]),
    mat0=Object.assign({shade:shv(C.shade,.5),lite:C.lite,bshade:shv(C.bshade,.5),blite:C.blite,cast:mix(C.shade,'#100818',.5)},P.light,{rw:hi?.002:0,ro:.18,rim:mix(C.shade,'#000000',.2)});
  /* one piece on its layer: (u, v) -> the base surface at s = v·L·Lu(u), θ = phi + the half width's angle, offset by its layer, its cupping and ruffles */
  const piece=(o,lay,wp,mat,extra)=>{const L=o.L,W=o.W,phi=o.phi,t=o.t||{dL:1,dW:1,dph:0,tw:0,wav:1,wk:4,wph:0,asym:0},fk=o.keep?0:fan,dk=o.keep?0:dec,Ls=L*t.dL*(1-.08*dk-.18*fk),
      rS=base(Ls*.6,phi*1);const rr=Math.max(.05*R0,Math.hypot(rS[0],rS[1]));
    const fc=wp[wp.length-1][0],Lu=u=>fc+(1-fc)*Math.sqrt(Math.max(0,1-u*u))-(o.notch||0)*Math.exp(-Math.pow(u/.16,2)),  /* the broad round edge: past the broadest point fc the outline is half an ellipse */
      cap=P.budCap+(3.2-P.budCap)*eo,
      Sf=(u,v)=>{const s=v*Ls*Lu(u)*(1+(o.ew??.022)*t.wav*v*v*v*Math.sin(t.wk*2.3*u+t.wph*1.7)),f=s/Ls,  /* the margin slightly undulate in its plane */b=base(f*Ls*.999+1e-4,phi,1),rad=  /* the angular width from the fresh head: a limp petal keeps its share of the turn; never under .22 R0: near the throat a claw stays narrow, it never wraps round the centre */Math.max(.22*R0,Math.hypot(b[0],b[1])),
          hw=R0*W*t.dW*vioRamp(wp,Math.min(f,fc))*(1+t.asym*Math.sign(u))*(1-.12*dk-.3*fk),dth=u*Math.min(cap,hw/rad),th=phi+t.tw*f*(1+4*dk+3*fk)+dth+(o.keep?0:.9*fan*s*s),  /* faded: the furled petals twist round each other */
          p=base(s,th,o.keep?2:0),n=norm(s,th,o.keep?2:0),
          rf=Math.min(G*.2,R0*t.wav*(P.wav[0]+(P.wav[1]-P.wav[0])*eo))*Math.pow(Math.abs(u),2.5)*Math.sin(t.wk*Math.PI*f+t.wph+(u<0?2.1:0))*svSm((f-.3)/.4)
            +Math.min(G*.15,R0*P.cup)*u*u*eo*(o.cupS??1),
          cr=(dk>0?G0*.32*gk*dk*Math.pow(Math.abs(u),1.2)*svSm((f-.15)/.3):0)  /* the limp blade creased along its midrib, margins up (114) */
            +(dk>0?G0*.24*gk*dk*(1-fk)*svSm((f-.18)/.3)*vioCrumple(u,f,t.sd):0)
            +(fk>0?G0*1.1*fk*svSm((s-.2)/.3)*vioCrumpleP(th,s,seed):0);  /* faded: crumpled all over, the same field for every layer (ov08, ov42) */  /* and crumpled, irregularly (3.10: never periodic bands) */
        const kb=o.keep?0:bud*svSm((s/P.pet[0].L-.55)/.4)*.94,pk=kb>0?[p[0]*(1-kb),p[1]*(1-kb),p[2]]:p;return V3.add(pk,V3.sc(n,off(lay,s)+rf+cr))};  /* the bud's point: the base surface drawn in to the axis by its height s alone, the
          layers offset from it as everywhere (same gap, same order: nothing crosses); what is left open at the tip the bud's core fills (below) */
    return Sf};
  /* the petals */
  const kinds=[];for(let k=0;k<5;k++){const q=P.pet[k],t=g.tep[k],sw=q.k==='up'&&g.upF>.5;  /* which upper petal lies in front: the individual's */
    const lay=q.k==='up'?(sw?(k===0?-1.3:-2.3):q.lay):q.lay,phi=(q.phi+(t.dph*57.3)+g.rot*57.3)*Math.PI/180;
    kinds.push(q.k);if(VIO_SOLO>=0&&k!==VIO_SOLO)continue;
    const Sf=piece({L:q.L,W:q.W,phi,t,notch:q.notch},lay,P.wp[q.k]);
    const vn=svVeins(svRng(t.sd),hi?18:9,hi?.25:0,hi?.5:.2),vc=shv(C.vein,.5);
    const m=Object.assign({},mat0,{stops:ramp(C.st[q.k]),bstops:ramp(C.bst[q.k]),
      veins:(s2,front)=>front?[[vn.main,.0016,vc,(C.vo??.18)*(1+.6*dec)],[vn.fine,.0011,vc,(C.vo??.18)*.5]]:[[vn.main,.0018,shv(C.bvein,.5),.22]]});
    if(C.grid&&C.grid[q.k])m.grid=C.grid[q.k];if(C.fine)m.fine=dec+fan>0?Object.assign({},C.fine,{age:{a:Math.min(.5,.15*dec+.4*fan),c:C.dry||'#b89a78',c2:C.dry2||'#6a4a32',vein:'#4a3020',n:7}}):C.fine;  /* a fading petal keeps its measured grid and dries (y3-fine.js F.age) */if(C.cross&&C.cross[q.k])m.cross=C.cross[q.k];if(C.transmit&&hi)m.transmit=C.transmit;
    if(!hi)for(const z of['stops','bstops'])if(m[z].length>3)m[z]=[m[z][0],m[z][Math.floor(m[z].length/2)],m[z][m[z].length-1]];
    m.over=vioOver(C,q.k,t.sd,{eo,fan,dec});
    const sh=svSheet(B,O,Sf,{nu:Math.round(P.nu[fan>.2&&hi?1:0]*det),nv:Math.round(P.nv*det),mat:m,ao:(u,v,front)=>front?1-P.ao[0]*(1-svSm((v-.02)/P.ao[1])):1-P.ao[2]*(1-svSm(v/P.ao[3]))});
    sh.L=q.L*R0;sh.wh=q.k;pieces.push(sh)}
  /* the sepals: green, lanceolate, behind everything (the outermost layer of the bud) */
  if(VIO_SOLO<0){const sp=P.sep;for(let i=0;i<sp.n;i++){const phi=(sp.phi0+i*72+g.rot*57.3)*Math.PI/180,t={dL:1+.08*(pxHashS(i,3,g.sd)-.5),dW:1,dph:0,tw:.04*(pxHashS(i,5,g.sd)-.5),wav:0,wk:3,wph:0,asym:0};
      const Sf=piece({L:sp.L*(1+.25*bud),W:sp.W,phi,t,cupS:0,keep:1,ew:0},sp.lay-[0,.7,0,.7,1.4][i],[[0,.35],[.2,.8],[.45,1],[.8,.5],[1,.08]]),sc=mix(C.sep,'#b8a060',.6*fan);
      const m=Object.assign({},mat0,{stops:[[0,mix(sc,'#c8d898',.2)],[1,sc]],bstops:[[0,sc],[1,mix(sc,'#a8c070',.3)]],shade:mix(sc,'#102008',.5),lite:'#e8f4c8',bshade:mix(sc,'#102008',.5),blite:'#e8f4c8',cast:'#0a1406',rim:mix(sc,'#000',.3)});
      const sh=svSheet(B,O,Sf,{nu:6,nv:10,mat:m});sh.wh='sep';pieces.push(sh)}}
  /* the bud's core: the inner petals folded inside, a cone of revolution within every layer, its point on the axis; seen only through the
     tip of the bud, which it closes (35: a pansy bud is full to its point) */
  if(VIO_SOLO<0&&bud>.05){const cm=Object.assign({},mat0,{stops:ramp([[0,C.throat],[.5,C.st.lat[Math.floor(C.st.lat.length/2)][1]],[1,C.st.up[C.st.up.length-1][1]]]),bstops:ramp([[0,C.throat],[1,C.st.up[C.st.up.length-1][1]]])}),
      Lc=P.pet[0].L*1.05;
    pieces.push(svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI,s=v*Lc,p=base(s,a),n=norm(s,a),q=V3.add(p,V3.sc(n,off(2.6,s))),k=bud*svSm((s/P.pet[0].L-.4)/.55);
      return[q[0]*(1-k),q[1]*(1-k),q[2]]},{nu:16,nv:8,mat:cm,qa:false}))}
  /* the floor: a dark disc behind the claws where they meet (the throat seen between them) */
  if(VIO_SOLO<0&&bud<.9){const rf=R0*P.r0*2.2,  /* inside the throat, under the claws' feet */fm=Object.assign({},mat0,{stops:[[0,C.throat],[1,mix(C.throat,C.st.low[1][1],.4)]],bstops:[[0,C.throat],[1,C.throat]]});
    pieces.push(svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI;return[Math.cos(a)*rf*v,Math.sin(a)*rf*v,R0*.004]},{nu:10,nv:3,mat:fm,qa:false}))}
  /* the stigma: a small white globe at the mouth of the spur, its lip toward the lower petal; drawn piece with a proxy disc */
  if(VIO_SOLO<0&&!VIO_NOHRT&&eo>.4&&fan<.45){const rk=  /* faded, the stigma is hidden in the furled petals (fiche, stades.declin) */R0*.046*(1-.3*fan),nS=norm(.06,-Math.PI/2),cz=V3.add(base(.06,-Math.PI/2),V3.sc(nS,off(1.6)+R0*.012+rk*1.1)),  /* in front of the lower petal's claw, on its normal */
      e1=V3.nz(V3.cr(nS,[1,0,0])),e2=V3.cr(nS,e1),
      prox=svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI;return V3.add(cz,V3.add(V3.sc(e1,Math.cos(a)*rk*v),V3.sc(e2,Math.sin(a)*rk*v)))},{nu:8,nv:2});
    pieces.push({fn:k2=>{const c=PJ(B,O,cz),lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),id='vsg'+(gid++),
        gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(c[0]+lt[0]*rk*.4),cy:svF(c[1]+lt[1]*rk*.4),r:svF(rk*1.5)},GDEF||defs);
      for(const[o2,c2]of[[0,'#ffffff'],[.4,C.sg],[.8,C.sgE],[1,mix(C.sgE,'#2a3010',.4)]])E('stop',{offset:o2,'stop-color':c2},gr);
      E('circle',{cx:svF(c[0]),cy:svF(c[1]),r:svF(Math.max(.4,rk)),fill:`url(#${id})`},k2);
      if(!LOD)E('ellipse',{cx:svF(c[0]),cy:svF(c[1]+rk*.45),rx:svF(rk*.42),ry:svF(rk*.22),fill:mix(C.sgE,'#1a2008',.55),'fill-opacity':.7},k2)},proxy:prox,pmin:1})}
  return svDraw(par,pieces,{D:R0*2,pmin:P.pmin,shadow:hi})}
function vioSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_PANS!=='undefined'&&CW_PANS.find(x=>x.id===cwId))||{id:cwId};
  return svViola(par,B,O,D,S||null,cwx,op,seed,wl==null?vioLife():wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['pensee']=vioSvg;
/* the colour of a fading pansy (114: the velvet dulls and darkens, the margins brown and go papery; 582, 583: then the corolla falls): violets
   and blues toward a dull plum, yellows toward ochre then tan, whites to ivory then beige; the blotch stays dark; the green calyx yellows */
function vioWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);if(l<.14)return c;
  if(h>=62&&h<175&&s>.15)return typeof lifeCol==='function'?lifeCol(c,w):c;
  const k=Math.min(1,w*1.3);let o=l2h(h,s*(1-.45*k),l*(1-.12*k));
  if(l>.82&&s<.5){o=mix(c,'#efe2c0',.6*k);if(w>.5)o=mix(o,'#b89466',(w-.5)*.8);return o}
  if(h>=35&&h<62)o=mix(o,'#a87a2a',.35*k);else if(h>=230||h<20)o=mix(o,'#5a2a3a',.3*k);else o=mix(o,'#8a4a2a',.3*k);
  if(w>.55)o=mix(o,'#6a4a32',(w-.55)*.7);return o}
if(typeof GHI!=='undefined'&&GHI['pensee'])GHI['pensee'].wilt=vioWiltCol;
