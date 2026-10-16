/* ================= Pilote, clochettes : le genre Fritillaria en SVG natif (y-fritillaria.js) =================
   One module per genus, one sheet (fiche) per kind. Common to the fritillaries: the hanging bell (svBell, below: svBloom cannot draw it, its spine
   is one power curve and the bell needs square shoulders, straight sides and a flared mouth), the chequer (y3-damier.js), the stem and leaves.
   The kinds: FRM_SPEC, the snake's head fritillary (Fritillaria meleagris L.); later F. michailovskyi and its kin (still on the old drawing, s54a.js).
   Measured on photographs (refcache/fritillaire-meleagris, brief.md, coloris.md; references-section.md): six free tepals (3 outer, 3 inner, not
   fused: they part one by one in photographs 122 and 116) overlapping at their margins into a closed bell, 3.5 to 4.5 cm long; the bell square at
   the shoulders (a low dome round the pedicel), its sides nearly straight, the mouth a little wider, each tepal ending in a short blunt point
   that flares out; height over width 1.15 to 1.25 open (79, 21), about 2 in the bud (68), which hangs angular and pale, chequered already;
   the chequer a net of dark checks and light spots, 4 to 6 across a tepal and 10 to 13 along it (122, 21: more than the 6 to 8 of the brief),
   on both faces, the dark dominating toward the tip, the point itself plain; six yellow stamens, a pale style in three branches (122).
   Decline (116, the only one): the mouth opens, the tips curl outward and pale. Faded: no photograph of a faded bell on its stem; the papery
   tepals that brown, narrow and fall are deduced (36, 30: dry brown stems and a dry head at the foot). The young capsule, upright and six-ribbed
   (83, 84), comes weeks after flowering, on the plant: not drawn in the vase (the faded head keeps hanging, its ovary bare). */

/* ---------- svBell: a hanging bell of six free tepals in two whorls, along its frame's Z (B[2] from the pedicel to the mouth) ----------
   The spine of a tepal turns from its shoulder angle aS (from the axis) to its body angle aB over [s0, s0+s1], then flares to aT at its tip from f0
   ([bud, open] by whorl, angles in radians; L is in units of R0 = D/2, so D is the tepal's length). Across, each tepal is an arc of the bell's own
   circle, flatter by flat (> 1: an angular bell), as wide as wR x the bell's radius there: the six close the bell at every height, the inner
   whorl a little inside (kR). The tip: a superellipse (gene tip) from vb. Life: the bud is small (grow), closed, green from the foot; the decline
   opens the mouth (wB, wT) and pales the tips (pale); the faded tepals shrink, crumple and fall (fanL, fanW, crk, shed). Hooks of the sheet:
   genes(seed), mat(colourway), paint(t, ctx, m) (the tepal's own pattern and grounds, on its material m: y3-damier.js), heart(ctx), life(). */
const SVBELL_DEF={open:[.1,.66],bud:[.04,.3],dec:[.12,.36],fan:[.52,.26],shed:[.8,.18],grow:[.58,.4],green:[.35,.03,.3],greenC:'#8c9c60',greenTip:.55,budC:['#dfe0c8',.82,.1,.35],
  L:[2,1.96],kR:[1,.94],r0:.05,z0:[0,-.004],aS:[[1,1.22],[.96,1.18]],aB:[[-.09,0],[-.1,-.01]],aT:[[-.6,.04],[-.62,.0]],s0:[.04,.1],s1:[.38,.42],f0:.7,
  wR:[.68,.72],flat:[.9,.88],vb:.83,tw:[.6,.3],
  wB:[.16,.04],wT:[.55,.1],rev:[.25,.2],pale:[.55,'#efe4ec'],fanL:.12,fanW:.26,shedW:.3,crk:[.02,.1],wav:[1,2.5,4],hang:[.12,.35],
  ao:[.5,.3,.15,.3],nu:[8,10],nv:15,pmin:3,veinN:[12,8],veinNet:[.3,0],veinFork:[.6,.3],
  light:Object.assign({},SVB_DEF.light,{ks:.1,gloss:18,wrap:.3,darkLo:[.86,.66],litLo:[1.1]})};
function svBell(par,B,O,D,S,cwx,op,seed,wl){const P=S._m||(S._m=Object.assign({},SVBELL_DEF,S)),g=P.genes(seed),cw0=P.mat(cwx),R0=D/2*(cw0.sz||1),pieces=[],det=DET>=1.5?1.3:.8;
  if(wl==null)wl=P.life?P.life():0;
  const o2=svSm((op+g.op-P.open[0])/P.open[1]),bud=1-svSm((op-P.bud[0])/P.bud[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]),
    grow=P.grow[0]+(1-P.grow[0])*svSm(op/P.grow[1]),gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),
    shv=(c,v)=>{const x=svShift(c,g.dh,g.ds,g.dl),k2=gt*(1-P.greenTip*v);return k2>0?mix(x,P.greenC,k2):x},
    /* the bud's ground is pale, cream to green, its checks already purple (68, 10): the young ground mixes toward budC */
    pb=P.budC?P.budC[1]*(cw0.bc??1)*(1-svSm((op-P.budC[2])/P.budC[3])):0,gnd=(c,v)=>{const x=shv(c,v);return pb>0?mix(x,P.budC[0],pb):x},
    /* the tips pale as the bell declines (116): the ramp's last stops toward the pale colour */
    ramp=(st,front,fn)=>st.map(([v,c])=>{let x=fn(c,v);const pk=P.pale[0]*dec*svSm((v-.55)/.45);return[v,pk>0?mix(x,front?mix(P.pale[1],x,.35):P.pale[1],pk):x]}),
    mat=Object.assign({stops:ramp(cw0.st,1,gnd),bstops:ramp(cw0.bst,0,gnd),shade:shv(cw0.shade,.5),lite:cw0.lite,bshade:shv(cw0.bshade,.5),blite:cw0.blite,rim:cw0.rim,cast:cw0.cast},P.light,
      {trans:.12+.15*dec,rw:DET>=1.5?.004+.004*dec:0,ro:.25});
  /* faded: the tepals fall; one or two of the lowest in the world hang on */
  const keep=new Set();if(shed>0){const sc=[];let kk=0;for(let w=0;w<2;w++)for(let i=0;i<3;i++,kk++){const ph=g.rot+(i+(w?.5:0))/3*6.2832+g.tep[kk].dph,dv2=toV(B,[Math.cos(ph),Math.sin(ph),0]);sc.push([dv2[1]+.35*pxHashS(kk,31,g.sd),kk])}
    sc.sort((a,b)=>a[0]-b[0]);const nk=Math.round(6+(1+(g.sd%2)-6)*shed);for(let q=0;q<nk;q++)keep.add(sc[q][1])}
  const lp=(A,w)=>A[w][0]+(A[w][1]-A[w][0])*o2;let k=0;
  for(let w=0;w<2;w++)for(let i=0;i<3;i++,k++){const t=g.tep[k],phi=g.rot+(i+(w?.5:0))/3*6.2832+t.dph;if(shed>0&&!keep.has(k))continue;
    const rad=[Math.cos(phi),Math.sin(phi),0],T=[-Math.sin(phi),Math.cos(phi),0],L=R0*P.L[w]*t.dL*grow*(1-P.fanL*fan),
      aS=lp(P.aS,w)+t.da*.5,aB=lp(P.aB,w)+t.da+P.wB[0]*dec*t.wl*(1-.8*fan)+P.wB[1]*fan*(t.hang-.9)+P.hang[1]*fan*(t.hang-1),aT=lp(P.aT,w)+t.dt+P.wT[0]*dec*t.wl*(1-.5*fan)+P.wT[1]*fan*t.hang,
      s0=P.s0[0]+(P.s0[1]-P.s0[0])*o2,s1=P.s1[0]+(P.s1[1]-P.s1[0])*o2,ns=24,sp=[],dv=[],rr=[];
    let p=[rad[0]*L*P.r0,rad[1]*L*P.r0,R0*P.z0[w]];
    for(let j=0;j<=ns;j++){const v=j/ns,tt=svSm((v-s0)/s1),ff=svSm((v-P.f0)/(1-P.f0)),a=aS*(1-tt)+aB*tt+(aT-aB)*ff,d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
      if(j)p=V3.add(p,V3.sc(d,L/ns));const q=[p[0]*P.kR[w],p[1]*P.kR[w],p[2]];sp.push(q);dv.push(d);rr.push(Math.max(L*.03,Math.hypot(q[0],q[1])))}
    const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return Array.isArray(A[0])?V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2)):A[j]*(1-f2)+A[j+1]*f2};
    const Lu=u=>P.vb+(1-P.vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),t.tip)),1/t.tip),wv=t.wav*(1+(P.wav[1]*dec+P.wav[2]*fan)*(DET>=1.5?1:.6)),tw=t.tw*(1-P.tw[0]*bud)+P.tw[1]*fan*Math.sign(t.tw||1),
      crk=(P.crk[0]*dec+P.crk[1]*fan)*(DET>=1.5?1:.4),rev=P.rev[0]*dec+P.rev[1]*fan,wk=P.wR[w]*t.dW*(1-P.fanW*fan)*(1-P.shedW*shed);
    const Sf=(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),r=at(rr,vv),nrm=V3.cr(d,T),ca=Math.cos(tw*vv),sa=Math.sin(tw*vv),A=V3.add(V3.sc(T,ca),V3.sc(nrm,sa)),
        hw=wk*r*(1+t.asym*Math.sign(u)),rho=P.flat[w]*r/Math.max(.3,Math.abs(d[2])),th=u*hw/rho,
        lift=rho*(1-Math.cos(th))+wv*hw*Math.pow(Math.abs(u),1.5)*Math.sin(t.wk*Math.PI*vv+t.wph+u*.8)*svSm(vv/.35)-rev*hw*Math.pow(Math.abs(u),4)*svSm((vv-.4)/.6)
          +crk*hw*Math.sin(u*Math.PI*(2.2+t.wk*.4)+t.wph*2+vv*7)*svSm(vv/.25);
      return V3.add(V3.add(c,V3.sc(A,rho*Math.sin(th))),V3.sc(nrm,lift))};
    const hi=DET>=1.5,vr=svRng(t.sd),vn=svVeins(vr,(hi?P.veinN[0]:P.veinN[1])+vr.in(0,2),hi?P.veinNet[0]:P.veinNet[1],hi?P.veinFork[0]:P.veinFork[1]),vc=shv(cw0.vein,.5),vo=cw0.vo??.2;
    const m=Object.assign({},mat,{veins:!hi&&vo<.3?null:(s2,front)=>front?[[vn.main,.0028,vc,vo*.8+.2*dec],[vn.fine,.002,vc,vo*.5]]:[[vn.main,.0028,shv(cw0.bvein||cw0.vein,.5),vo+.15*dec]]});
    if(P.paint)P.paint(t,{g,cw0,bud,dec,fan,shv,k,o2,ramp:(st,front)=>ramp(st,front,gnd)},m);
    /* DET 1 (the bouquet): three stops a gradient */
    if(!hi)for(const q of['stops','bstops'])if(m[q].length>3)m[q]=[m[q][0],m[q][Math.floor(m[q].length/2)],m[q][m[q].length-1]];
    pieces.push(svSheet(B,O,Sf,{nu:Math.round((fan>.2&&DET>=1.5?P.nu[1]:P.nu[0])*det),nv:Math.round(P.nv*det),mat:m,ao:(u,v,front)=>front?1-P.ao[0]*(1-svSm((v-.02)/P.ao[1])):1-P.ao[2]*(1-svSm(v/P.ao[3]))}))}
  if(P.heart)P.heart({par,B,O,D,R0,g,cw0,op,o2,bud,dec,fan,shed,det,pieces});
  /* DET 1: no cast shadow, coarser washes (wt), the crumple and waves of the decline softer (above): what the bouquet's scale cannot show */
  return svDrawP(par,pieces,{D:R0*2,pmin:P.pmin,shadow:DET>=1.5,wt:DET>=1.5?.008:.016})}

/* ---------- Fritillaria meleagris: the snake's head fritillary (FRM) ---------- */
/* each colourway (coloris.md; proof: the json's evidence level, D and C kept on the brief's indicative values): the pale ground outside f (body),
   fb (shoulder), inside fi; the dark k (body), kb (shoulder), ki (inside); the plain point ft; the dark checks' size kd ([min, max] x their cell,
   open; > 1: they meet and the light is left as spots), kb0 their size in the bud (x kd), kdV from base to tip, ko the pattern's strength, mid the
   share of half-tone checks; veins vn and their strength vo; shade sh, light li; the stamens an; size sz */
const FRM_CW={
  damier:{proof:'B',bc:.12,f:'#bf93ab',fb:'#c8aab2',fi:'#b685ab',k:'#6a2436',kb:'#7a4250',ki:'#4e1828',ft:'#6a2a3a',kd:[1.14,1.26],kb0:.9,kdV:[.1,-.06],kdJ:.14,ko:.74,mid:.32,vn:'#7a4a5c',vo:.12,sh:'#3a1426',li:'#f0d4e2'},
  bordeaux:{proof:'D',bc:.12,f:'#a5768d',fb:'#a88290',fi:'#8a5a70',k:'#341620',kb:'#4a2a34',ki:'#2e1018',ft:'#3a1a24',kd:[1.48,1.58],kb0:.75,kdV:[.1,-.04],ko:1,mid:.12,vn:'#5a3040',vo:.1,sh:'#1e0a12',li:'#d9b7c6'},
  'rouge-violet':{proof:'C',bc:.12,f:'#c79ac4',fb:'#bc9cb8',fi:'#a86a9a',k:'#64084e',kb:'#7a2a6a',ki:'#55063f',ft:'#5e0e4a',kd:[1.34,1.46],kb0:.8,kdV:[.1,-.05],ko:1,mid:.14,vn:'#6a2a5a',vo:.1,sh:'#2e0624',li:'#ecc8e6'},
  lavande:{proof:'B-fragile',f:'#ebe2dc',fb:'#e2ded0',fi:'#ddd0d8',k:'#9a7aa6',kb:'#ab95b0',ki:'#8a6a96',ft:'#b8a2bc',kd:[.86,.96],kb0:.8,kdV:[-.14,.06],ko:.8,mid:.2,vn:'#9a8aa0',vo:.12,sh:'#5a4a62',li:'#fbf6f2'},
  blanc:{proof:'B',f:'#ecebd8',fb:'#d8dcb8',fi:'#e4e4cc',k:'#c4c8a0',kb:'#c8cca4',ki:'#cacca8',ft:'#dfe4c4',kd:[.9,.98],kb0:.85,kdV:[-.1,.04],ko:.24,mid:.3,vn:'#889362',vo:.5,sh:'#6e7258',li:'#fbfbf2',an:'#c8b84a'},
  creme:{proof:'B',f:'#dde0be',fb:'#c8cf9e',fi:'#d8dcbc',k:'#b4bc88',kb:'#b8c08e',ki:'#bcc294',ft:'#d0d6aa',kd:[.94,1.02],kb0:.85,kdV:[-.1,.04],ko:.42,mid:.3,vn:'#87905e',vo:.5,sh:'#626a46',li:'#f8f8e8',an:'#c8b84a',sz:1.1}};
const FRM_M={};
/* the grounds of a colourway, pale (L) and dark (D), outside (bst) and inside (st), from the claw (a little green) to the point */
function frmMat(cw){if(FRM_M[cw.id])return FRM_M[cw.id];const C=FRM_CW[cw.id]||FRM_CW.damier,G='#8aa060';
  const M=Object.assign({},C,{bstL:[[0,mix(C.fb,G,.3)],[.2,C.fb],[.5,C.f],[.86,C.f],[1,mix(C.f,C.ft,.6)]],bstD:[[0,mix(C.kb,G,.22)],[.2,C.kb],[.5,C.k],[.86,C.k],[1,C.ft]],
    stL:[[0,mix(C.fi,G,.45)],[.14,C.fi],[.8,C.fi],[1,mix(C.fi,C.ki,.3)]],stD:[[0,mix(C.ki,G,.3)],[.14,C.ki],[.8,C.ki],[1,C.ki]],
    shade:C.sh,lite:C.li,bshade:C.sh,blite:C.li,vein:C.vn,bvein:C.vn,rim:mix(C.f,'#ffffff',.25),cast:mix(C.sh,'#000000',.4),anth:C.an||'#c3bd6f',fil:'#e2dcc0',pol:'#e8dc80',ov:'#a8b47a',sg:'#d4dab0'});
  M.st=M.stL;M.bst=M.bstL;return FRM_M[cw.id]=M}
/* the chequer of one tepal (each face its own genes): in the bud small dark checks on a pale ground (68, 10), growing with the opening until they
   meet, then the ground is dark and the light is left as spots (79, 21, 122), the dark denser toward the tip; paler and greener in the bud; it fades
   off the paling tips in the decline. It sets the tepal's grounds (m.bstops, m.stops) and its paint hook */
function frmPaint(t,{cw0,bud,dec,shv,o2,ramp},m){const C=cw0,lo=DET<1.5,
    /* close-ups: a fine net, 7 or 8 cells across and 14 to 16 along, the rows closer toward the base (rp), the corners barely rounded (cr); at DET 1
       (the bouquet) fewer, larger cells in one tone (one compound path per face) */
    o={kd:C.kd,v0:.06,kdV:C.kdV,kdJ:C.kdJ??.12,mid:lo?0:C.mid,skip:0,jit:lo?.6:.9,wob:.8,cr:.1,net:lo?0:C.net??.8,rp:lo?1:1.25,nu:lo?[4,5]:[7,8],nv:lo?[8,9]:[14,16]},gO=svDamGenes(svSeed('frm-dam',t.sd,0),o),gI=svDamGenes(svSeed('frm-dam',t.sd,1),Object.assign({},o,{v0:.1}));
  const ks=C.kb0+(1-C.kb0)*o2,inv=gO.kd*ks>1,a=C.ko*(1-(inv?0:.35)*bud),pt=1-.8*dec,col=(c,v)=>shv(c,v),
    gr=inv?[C.kb,C.k,C.ki]:[C.fb,C.f,C.fi],dk=(inv?[C.fb,C.f,C.fi]:[C.kb,C.k,C.ki]).map((c,i)=>lo?mix(c,gr[i],(C.mid||0)*.45):c),
    /* the light cells dimmer toward the base, crisper toward the point (79, 122) */
    b0=inv?.5:.8,b1=inv?.85:1,
    rO=[[.06,col(dk[0],.06),a*b0],[.5,col(dk[1],.5),a*b1],[.95,col(dk[1],.95),a*(.3+.7*pt)]],rI=[[.1,col(dk[2],.1),a*b0],[.5,col(dk[2],.5),a*b1],[.95,col(dk[2],.95),a*(.3+.7*pt)]],
    mO=[[.06,col(mix(dk[0],gr[0],.55),.06),a*b0*.9],[.95,col(mix(dk[1],gr[1],.55),.95),a*(.3+.7*pt)]],mI=[[.1,col(mix(dk[2],gr[2],.4),.1),a*b0],[.95,col(mix(dk[2],gr[2],.4),.95),a*(.3+.7*pt)]];
  if(inv){m.bstops=ramp(C.bstD,0);m.stops=ramp(C.stD,1)}
  m.paint=svDamier(gO,gI,rO,rI,mO,mI,ks,inv)}
const FRM_GENES={n:[[6,1]],tep:{dL:[.95,1.04],dW:[.94,1.06],dph:[-.035,.035],da:[-.03,.03],dt:[-.07,.07],tw:[-.06,.06],wav:[.004,.014],wk:[1.2,2.2],wph:[0,6.28],
    tip:[1.6,2.0],asym:[-.04,.04],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],op:[-.04,.04],dh:[-3,3],ds:[-.05,.05],dl:[-.025,.02],stL:[.92,1.08],sd:'sd'}};
/* the heart, seen only from below (into the mouth): six stamens half as long as the tepals, yellow anthers; the ovary and the style one pale column
   ending in three short branches (122). Sizes x R0 (the tepal is 2 R0 long) */
const FRM_HEART={n:6,ovH:.95,ovR:.07,ovT:.5,styL:.02,sgR:.11,sgUp:.25,filL:.8,filR:.07,filW:.035,filA:.08,anL:.36,anW:.04,budMax:.25,hide:.12,lo:1};
function frmLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'fritillaire-meleagris',rec:{}})):0}
const FRM_SPEC={genes:s=>svGenes(s,FRM_GENES),mat:frmMat,paint:frmPaint,heart:svHeart6(FRM_HEART),life:()=>frmLife()};
/* the colour of a fading fritillary (116; the rest deduced): purples grey toward mauve and pale, then brown and papery; whites to ivory, then
   parchment; the green veins and the stem yellow (lifeCol); the darkest checks keep longest */
function frmWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.13)return c;
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.2||l>.84){let o=mix(c,'#eadcb4',.65*w);if(w>.5)o=mix(o,'#a88a62',(w-.5)*.8);return o}
  let o=l2h(h+(h>200?(330-h)*.2*w:0),s*(1-.5*w),l+(.5-l)*.22*w);if(w>.45)o=mix(o,'#6e4c3c',(w-.45)*.95);return o}
if(typeof GHI!=='undefined'&&GHI['fritillaire-meleagris'])GHI['fritillaire-meleagris'].wilt=frmWiltCol;
/* the head: bell, chequer and heart, in the frame B at O (Z from the pedicel to the mouth), D the tepal's length, opening op, wilted wl */
function frmSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_MEL!=='undefined'&&CW_MEL.find(x=>x.id===cwId))||{id:cwId};
  return svBell(par,B,O,D,S||FRM_SPEC,cwx,op,seed,wl==null?frmLife():wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['fritillaire-meleagris']=frmSvg;
/* the fritillary of the bouquet: the old drawing's share of the bouquet's chance is consumed (its six tepals: 18 draws), the first ones name the individual */
function frmSvgPut(par,B,O,D,cw,op,o){let s=0;for(let i=0;i<24;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return frmSvg(par,B,O,D,cw.id,op,svSeed('fritillaire',cw.id,s),frmLife(o))}
/* the stem: slender, green (476: neither purple nor glaucous), smooth, its width swelling a little along it; red: the pedicel's crook, flushed
   toward the head (116). No gradient tint along the stem: the plant draws it in pieces, each would carry its own */
function frmStemCols(red=0){const c=['#2f4a32','#5c7a4c','#8ca466','#b8c994'].map(x=>red>0?mix(x,'#6e4252',red):x);c.sv={swell:.07,gloss:.28};return c}
/* the leaves: linear (length over width 15 to 20), grey-green, the upper face darker than the lower, channelled along a midrib, clasping the stem
   by a short sheath a little wider than the stem (30, 31, 74, 476, 485); wilting, they go limp and hang, yellowing from the tips (lifeCol does the
   rest). At DET 1 (the bouquet) they are drawn lean (svDrawLean: one fill per face and the midrib) */
const FRM_LEAF={w:.062,wp:[[0,.62],[.06,.8],[.22,1],[.6,.88],[.86,.5],[1,0]],sheath:.09,tw:.35,gut:.62,wav:.01,wavN:2,hood:.12,bloom:.45,up:'#5f7052',low:'#93a384',base:'#82926c'};
function frmStrap(par,pos,H,Out,o){const y=svSm((o.wl-.3)/.5);if(y>0)Object.assign(o,{up:mix(o.up,'#9a9248',.3*y),low:mix(o.low,'#b8b070',.3*y)});
  if(DET>=1.5)return svStrapLeaf(par,pos,H,Out,o);const d0=svDraw;svDraw=svDrawLean;try{return svStrapLeaf(par,pos,H,Out,o)}finally{svDraw=d0}}
/* the leaves on a bouquet stem (STEML) */
function frmLeafSv(par,x,y,ang,len,o){const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,zk=.25+.35*pxHashS(k,3,Math.round(x*7+y*13)),Out=V3.nz(V3.add(side,[0,0,zk]));
  return frmStrap(par,[x,-y,0],H,Out,Object.assign({},FRM_LEAF,{len:len*1.1,w:.07,sr:Math.max(1.3,(typeof UPC!=='undefined'?UPC:8)*.2),lean:.3+Math.acos(Math.max(-1,Math.min(1,V3.dot(Lv,H))))*.55,droop:.5,
    sd:svSeed('frm-feuille',Math.round(x*8),Math.round(y*8),k),wl:frmLife()}))}
if(typeof STEML!=='undefined'&&STEML['fritillaire-meleagris'])STEML['fritillaire-meleagris'].sv=frmLeafSv;
/* the leaves of the plant drawing (s54a.js, organ 'Lv'): from the turtle's frame (its heading against the plant's up); sw the stem's width there */
function frmLeafLs(par,og,pos,len,u,up,wl,sw){const h=og.H,c=V3.dot(h,up),pe=V3s(h,V3.sc(up,c)),Out=V3l(pe)>.05?V3.nz(pe):V3.nz(og.L||[1,0,0]);
  return frmStrap(par,pos,up,Out,Object.assign({},FRM_LEAF,{len,w:FRM_LEAF.w*(1-.15*u),sr:sw?sw*.62:len*.012,lean:Math.acos(Math.max(-1,Math.min(1,c)))*.85,droop:.32+.2*u,
    sd:svSeed('frm-feuille-ls',Math.round(pos[0]*8),Math.round(pos[1]*8)),wl}))}
