/* ================= y3-coussin.js : the pincushion head of the scabious tribe (Caprifoliaceae, Dipsacoideae), a kit piece (y3.js untouched) =================
   svcuDraw(par,B,O,D,S,cwx,op,seed,wl) draws one whole head: in the frame B (B[2] its axis, where the face looks) at O (the top of the receptacle,
   where the stem ends), D its width when open, op 0 bud .. 1 open, wl 0 fresh .. 1 dry. Generic for the pincushion heads (Scabiosa now; later
   Knautia, Succisa, Lomelosia): every number is a setting of the sheet S over SVCU_DEF, nothing of one genus is written here.
   What a head is made of:
   - a ball (a cap of a sphere: radius rs, cap from the top down to the half angle cap) packed with florets on the golden angle, small at the top
     and larger toward the rim (the local spacing of the spiral, density exponent dq); each open floret a funnel of nl lobes seen as a small cup
     (its outline in 3D on the ball's tangent plane, the lobes raised by cup, crinkled by crk), with a dark throat; a closed floret is a pearl
     (a round bump, the colour of its folded lobe tips in a dot);
   - the marginal florets (rank t from mT to 1): their outer lobes enlarged (mE), fan-shaped and frilled, hanging over the rim (mDroop), their
     faces turned up a little (mTilt): the skirt;
   - the pins: filaments and pale oblong anthers standing out of the open florets, leaning out, a little curved;
   - behind: a backing (the shadowed floor of the ball, so that no gap between florets opens on the background), the involucre of narrow
     pointed bracts and the receptacle narrowing into the neck (svcapBract, svcapRecep of y3-capitule.js); fading, the bracts shrivel (br.wk:
     share of their length lost) and fold back under the shrunken ball (br.wa, rad), so that the dry head never bristles past its width.
   Its life: the bud is a small flattened ball of closed pearls, green, the colour coming from the top (col), in spread bracts; the florets open
   from the rim inward (lag); fading, the lobes crumple and shrink (wS, wCrk), the pins fall, the skirt goes limp (wDroop), then the corollas fall
   (by hash, shed) and leave the fruiting ball, smaller (fruit.k), set with the star-shaped calyces and their bristles.
   Drawing within a budget: one path a floret (two with its throat; three in close-ups, with the light on its lobes), the pins in three paths a
   head, the fruit's stars in two. Order: by depth, the backing under every floret (florets turned away culled). Only SVG paths, no image.
   The sheet: S={...settings that differ, mat:cwx=>material}; the material (svcuMat): body (open lobes), rim (skirt lobes), top (closed florets
   at the top), bud (green of the young bud), throat, gap (backing), back (underside), shade, lite, ink, pin, anth, anthSh, bract, recep, dry,
   fruit, fruitD, fruitL. */
const SVCU_DEF={
  /* life: opening o2 = svSm((op-open[0])/open[1]); a floret of rank t (0 top .. 1 rim) opens by svSm((o2-lag*(1-t))/(1-lag)); the head's scale
     at op 0 and the op where it is full (grow); the colour arriving from the top (col: [start, length] in op); decline, fading, shedding
     [start, length] in wl; the head tips as it fades: sum of k*svSm((wl-a)/b) */
  open:[.14,.78],lag:.55,grow:[.36,.8],col:[.08,.3],dec:[.08,.35],fan:[.38,.32],shed:[.7,.22],tip:[[.12,.35,.4]],
  /* the ball (x R0): sphere radius, height of the rim over the receptacle, the cap's half angle closed / open (rad), the bud's ball flattened
     (budZ: height scale at op 0) */
  rs:.8,zRim:-.03,capC:1.7,capO:1.85,budZ:.8,
  /* florets: count [DET 1, DET 1.5] and its spread, density exponent (more florets toward the top when > 1), size x local spacing [closed, open],
     size spread, share of 4-lobed florets; the cup (lobes raised), sinus depth (share of the lobe), crinkle, throat (x radius) */
  n:[60,100],nJ:.06,dq:1.15,sK:[.9,1.22],jS:.16,nl4:.25,cup:.5,sin:.45,crk:.13,throat:.27,
  /* the skirt: rank where the marginal florets begin, enlargement of their outer lobe, its droop (x lobe), faces turned up (rad) */
  mT:.78,mE:1.7,mDroop:.55,mTilt:.4,
  /* pins: per open floret [min, max], up to rank T, length (x R0), lean from the floret's axis [min, max] (rad), curve, anther radius, filament
     width (x R0) */
  pin:{n:[0,2],T:.92,L:.15,A:[.2,.8],cv:.16,ar:.018,fw:.0065},
  /* the involucre: count and its spread, length, width (x R0), foot radius, foot height, angles at the foot and tip, bud (c) / open (o); the
     receptacle (radius, depth, neck radius) */
  br:{n:8,nJ:2,L:.52,W:.065,r0:.34,z0:-.07,a0c:1.2,a1c:1.05,a0o:1.95,a1o:2.25,edge:.45,wk:.4,wa:.2},
  recep:{r:.42,dep:.26,neck:.075},
  /* fading: lobes shrink (share), crumple (added crinkle), the skirt hangs (added droop); the fruiting ball (radius share of rs), its stars
     (bristle length x R0, count [DET 1, DET 1.5], bristles of each calyx) */
  wS:.42,wCrk:.35,wDroop:1.2,fruit:{k:.72,L:.075,n:[42,72],nb:5},
  /* rendering: edge stroke opacity, the light on the lobes (close-ups: opacity), light */
  edge:.42,liteA:.38,holR:.55,holA:.4,veinA:.35,light:{amb:.4,dif:.72,wrap:.4,ref:.86,kD:.6,kL:.5}
};
/* the default material of a colourway {c, pin, dome}: a measured table t may replace any field */
function svcuMat(cwx,tab){const t=tab||{},c=t.body||cwx.c||'#5a1030',[h,s,l]=h2l(c),pale=l>.8,dark=l<.3,warm=pale&&s<.5;
  const shade=t.shade||(pale?(warm?mix(c,'#a88f6c',.42):l2h(h,Math.min(1,s*.9),l*.68)):dark?l2h(h,Math.min(1,s*1.05),l*.45):l2h(h,Math.min(1,s*1.05),l*.55));
  const lite=t.lite||(dark?l2h(h,Math.min(1,s*1.05),Math.min(.6,l*1.75)):mix(c,'#ffffff',pale?.6:.35));
  const m={body:c,rim:t.rim||c,top:t.top||cwx.dome||(dark?shd(c,-.2):mix(c,'#f4f0e0',.25)),bud:t.bud||'#a7ad78',throat:t.throat||(pale?mix(shade,c,.2):l2h(h,s,l*.42)),
    gap:t.gap||(pale?shade:l2h(h,s,l*.38)),back:t.back||mix(c,pale?'#e8e4d4':'#c8b0b8',dark?.18:.3),shade,lite,ink:t.ink||(pale?mix(shade,c,.3):l2h(h,s,l*.55)),
    pin:t.pin||cwx.pin||'#f4eef0',anth:t.anth||cwx.pin||'#f8f2f4',anthSh:t.anthSh||(pale?shade:l2h(h,s,Math.max(.12,l*.6))),bract:t.bract||'#5f8048',recep:t.recep||'#6f8f52',
    dry:t.dry||'#8a7458',fruit:t.fruit||'#8f8a58',fruitD:t.fruitD||'#5e5236',fruitL:t.fruitL||'#c8bc98',fruitB:t.fruitB||t.fruitD||'#5e5236'};
  if(t.fil)m.fil=t.fil;else m.fil=mix(m.pin,c,dark?.45:.3);return m}
/* the light-facing tone of a colour on a view-space normal (y3-capitule's light) */
const svcuTone=(c,n,m,Lg)=>svcapTone(c,svcapI(n,Lg),m,Lg);
/* the settings are merged at each head (no cache: fit.py changes the sheet and SVCU_DEF in place between candidates) */
function svcuDraw(par,B,O,D,S,cwx,op,seed,wl){const P=(Object.assign({},SVCU_DEF,S,{pin:Object.assign({},SVCU_DEF.pin,S.pin||{}),br:Object.assign({},SVCU_DEF.br,S.br||{}),
    recep:Object.assign({},SVCU_DEF.recep,S.recep||{}),fruit:Object.assign({},SVCU_DEF.fruit,S.fruit||{}),light:Object.assign({},SVCU_DEF.light,S.light||{})}));
  const k0=G(par),R0=D/2,hi=DET>=1.5,r=svRng(seed),m=(S._mc||(S._mc={}))[cwx.id]||(S._mc[cwx.id]=(P.mat||svcuMat)(cwx));wl=wl||0;
  const o2=svSm((op-P.open[0])/P.open[1]),gs=P.grow[0]+(1-P.grow[0])*svSm(op/P.grow[1]),co=svSm((op-P.col[0])/P.col[1]),
    dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]);
  /* the head tips over a little as it fades (toward the ground, in view space) */
  let tipA=0;for(const[kk,a,b]of P.tip)tipA+=kk*svSm((wl-a)/b);if(tipA>0){const ax=V3.cr(B[2],[0,-1,0]),l=Math.hypot(ax[0],ax[1],ax[2]);if(l>.05){const K=V3.sc(ax,1/l),rot=v=>{const c=Math.cos(tipA),s=Math.sin(tipA),d=V3.dot(K,v),x=V3.cr(K,v);return V3.nz([v[0]*c+x[0]*s+K[0]*d*(1-c),v[1]*c+x[1]*s+K[1]*d*(1-c),v[2]*c+x[2]*s+K[2]*d*(1-c)])};B=[rot(B[0]),rot(B[1]),rot(B[2])]}}
  const Lg=P.light,nz=B[2][2],rot=r()*6.283,dh=r.in(-1,1),dl=r.in(-1,1),sd=Math.floor(r()*1e9),nbJ=r.in(-1,1);
  const k=G(k0,{stroke:m.ink,'stroke-width':svF(Math.max(.2,R0*.005)),'stroke-opacity':svF(P.edge),'stroke-linejoin':'round'});
  /* the individual's tint */
  const mm=Object.assign({},m);for(const key of['body','rim','top'])mm[key]=svShift(m[key],dh*3,0,dl*.022);
  /* the ball: radius, cap, flattening of the bud, the centre's height so that the rim sits on the receptacle; the fruit ball as the corollas fall */
  const cap=P.capC+(P.capO-P.capC)*o2,zs=P.budZ+(1-P.budZ)*o2,rs=P.rs*R0*gs,zc=P.zRim*R0*gs-rs*Math.cos(cap)*zs,
    rsF=rs*(1-(1-P.fruit.k)*Math.max(shed,.6*fan)),Lh=[V3.dot(B[0],LIGHT),V3.dot(B[1],LIGHT),V3.dot(B[2],LIGHT)];
  const ball=(th,ph,rr)=>{const s=Math.sin(th);return[rr*s*Math.cos(ph),rr*s*Math.sin(ph),zc+rr*Math.cos(th)*zs]};
  const items=[],pinsF=[],pinsA=[],pinsS=[];
  /* the backing: the ball's floor under the florets (its colour turns to the fruit's as they wither and fall) */
  {const W=[],rb=rs*(1-.06*(1-o2))-(rs-rsF);for(let i=0;i<=5;i++){const th=cap*i/5;for(let j=0;j<14;j++){const p=PJ(B,O,ball(th,j/14*6.283,rb));W.push([p[0],p[1]])}}
    /* the young bud's floor is green like its pearls (no dark gap between them), the fruit ball turns from green to the dry tan */
    const fr=Math.max(shed,.5*fan),dk=svSm((wl-.75)/.2),gc=mix(mix(mix(shd(m.bud,-.3),mix(nz>=0?mm.body:m.back,m.gap,nz>=0?1:.55),co),shd(m.fruit,-.18),Math.min(1,1.4*fr)),mix(m.dry,m.fruitD,.5),dk*fr),gcol=svcuTone(gc,[0,0,1],{shade:shd(gc,-.5),lite:mix(gc,'#ffffff',.2)},Lg);
    items.push({key:-1e9,draw:kk=>E('path',{d:smooth(hull2(W)),fill:gcol,stroke:'none'},kk)})}
  /* the florets */
  const nF=Math.round(P.n[hi?1:0]*(1+P.nJ*r.in(-1,1))),dq=P.dq,nh=hi?4:2,c1=1-Math.cos(cap);
  for(let i=0;i<nF;i++){const g1=r(),g2=r.in(-1,1),g3=r.in(-1,1),g4=r(),g5=r();
    const u=(i+.5)/nF,ct=1-Math.pow(u,dq)*c1,th=Math.acos(Math.max(-1,Math.min(1,ct))),t=th/cap,ph=rot+i*2.39996;
    if(g1<svSm(shed*2.2-1.2*t)*1.04)continue;/* fallen corolla, the top's first, the rim's last (its draws consumed) */
    /* the florets sit on the ball as it contracts toward the fruit (no gap opens between the withering florets and the backing) */
    const sT=Math.sin(th),cph=Math.cos(ph),sph=Math.sin(ph),N=[sT*cph,sT*sph,ct],E1=[ct*cph,ct*sph,-sT],E2=[-sph,cph,0],C=ball(th,ph,rsF);
    const nvC=toV(B,N)[2];if(nvC<-.42)continue;/* on the far side of the ball */
    /* core: the top's florets stay closed in the open head (a dark knob), share of the cap's rank */
    const of=P.core?Math.min(svSm((o2-P.lag*(1-t))/(1-P.lag)),svSm((t-.5*P.core)/P.core)):svSm((o2-P.lag*(1-t))/(1-P.lag)),marg=svSm((t-P.mT)/(1-P.mT))*svSm((of-.3)/.5),tau=-P.mTilt*marg*(1-.5*fan),Nf=V3.add(V3.sc(N,Math.cos(tau)),V3.sc(E1,Math.sin(tau))),E1f=V3.add(V3.sc(E1,Math.cos(tau)),V3.sc(N,-Math.sin(tau)));
    const sp=rsF*Math.sqrt(2*c1*dq*Math.pow(u,dq-1)/nF),s=sp*(P.sK[0]+(P.sK[1]-P.sK[0])*of)*(1+P.jS*g2)*(1-P.wS*fan*(1-.6*marg)),nvF=toV(B,Nf),front=nvF[2]>=-.05;
    const cf=svSm((co*1.5-.5*t)/1),/* the colour arrives from the top */col0=t>P.mT?mm.rim:mix(mm.top,mm.body,svSm((of-.2)/.6)),col=mix(m.bud,col0,cf);
    const key=PJ(B,O,V3.add(C,V3.sc(Nf,s*.3)))[2];
    if(of<.42){/* a pearl: the closed floret, a round bump, five shallow folds; the colour of the folded tips in a dot at its top */
      const rp=s*(.62+.3*of/.42)*(1-.25*fan),cen=PJ(B,O,V3.add(C,V3.sc(N,rp*.55))),np=hi?10:7,crk=P.crk*.5+P.wCrk*.4*dec,pts=[];
      for(let j=0;j<np;j++){const a=j/np*6.283+g3,rr=rp*(1+.07*Math.cos(5*a+g3*3)+crk*(pxHashS(i,j,sd)-.5));pts.push([cen[0]+Math.cos(a)*rr,cen[1]+Math.sin(a)*rr])}
      const tc=svcuTone(col,toV(B,N),{shade:mix(mm.shade,m.bud,(1-cf)*.5),lite:mix(mm.lite,'#f4f6e0',(1-cf)*.5)},Lg),tipC=mix(col,mix(mm.body,mm.lite,.25),Math.max(.25,cf)),Ls=[LIGHT[0],-LIGHT[1]];
      items.push({key,draw:kk=>{E('path',{d:svSpl(pts),fill:tc},kk);
        if(hi||rp>R0*.05){const tr=rp*.32;E('path',{d:`M${svN(cen[0]+Ls[0]*rp*.2-tr)} ${svN(cen[1]+Ls[1]*rp*.2)}a${svN(tr)} ${svN(tr)} 0 1 0 ${svN(2*tr)} 0a${svN(tr)} ${svN(tr)} 0 1 0 ${svN(-2*tr)} 0`,fill:svcuTone(tipC,toV(B,N),mm,Lg),'fill-opacity':svF(P.dotA==null?.55:P.dotA),stroke:'none'},kk)}}});continue}
    /* an open floret: nl lobes round its throat, the outer ones of a marginal floret enlarged into a frilled fan hanging over the rim */
    const ofc=svSm((of-.42)/.58),nl=g4<P.nl4?4:5,ps0=g3*.35,Lj=[],wj=[];let tot=0;
    for(let j=0;j<nl;j++){const psi=ps0+j/nl*6.283,big=marg*P.mE*Math.pow(Math.max(0,Math.cos(psi)),1.3);Lj.push(s*(.62+.38*ofc)*(1+big)*(1+.14*(pxHashS(i,j+20,sd)-.5))*(1-.25*fan*(1-marg)));const w=Math.pow(1+big,.75);wj.push(w);tot+=w}
    const cupK=P.cup*(1.5-.7*ofc)*(1-.4*fan),dK=(P.mDroop*ofc+P.wDroop*fan)*marg+.35*P.wDroop*fan,crk=P.crk+P.wCrk*dec+.15*fan;
    const at=(rho,psi)=>{const d=V3.add(V3.sc(E1f,Math.cos(psi)),V3.sc(E2,Math.sin(psi))),h=s*cupK*Math.pow(Math.min(rho/s,1.3),2),over=Math.max(0,rho-.8*s),drop=over*over/s*dK*(.55+.45*Math.max(0,Math.cos(psi)));
      return PJ(B,O,V3.add(V3.add(C,V3.sc(d,rho)),V3.add(V3.sc(Nf,h-drop*.35),[0,0,-drop])))};
    const out=[],arcs=[];let acc=ps0-wj[0]/tot*Math.PI;
    for(let j=0;j<nl;j++){const half=wj[j]/tot*Math.PI,pc=acc+half,L=Lj[j],Lp=Lj[(j+nl-1)%nl],bigL=L>1.35*s;
      const rS=Math.min(L,Lp)*P.sin*(1+.2*(pxHashS(i,j+40,sd)-.5));out.push(at(rS,acc));arcs.push([acc,rS,1]);/* the sinus, kept in the inner paths */
      const xs=bigL?(hi?[-.72,-.4,-.12,.18,.46,.74]:[-.6,0,.6]):(hi?[-.55,0,.55]:[-.4,.4]);
      for(const x of xs){const rr=L*(1-.16*x*x+crk*(pxHashS(i,j*9+Math.round(x*10)+60,sd)-.5)*(bigL?1.3:1));out.push(at(rr,pc+x*half*.95));arcs.push([pc+x*half*.95,rr,0])}
      acc+=2*half}
    const cTone=front?col:mix(m.back,col,.35),tone=svcuTone(cTone,front?nvF:V3.sc(nvF,-1),mm,Lg);
    const thr=[];if(front&&ofc>.05){const tr=s*P.throat*(.55+.45*ofc)*(1-.4*fan);for(let j=0;j<6;j++){const a=j/6*6.283;thr.push(at(tr,a))}}
    /* the light on the lobes' inner walls (close-ups): the arc of lobes facing away from the light's way in the floret's plane */
    /* the cup's hollow (close-ups): the inner half of the lobes in shade, so that each floret is a cup and not a flat star; the veins of the
       enlarged lobes, fine lines in the lobe's darkened tone, stopping short of the edge */
    let hol=null,vein='';if(hi&&front&&ofc>.2){hol=[];for(const[pa,rr,sn]of arcs)hol.push(at(rr*(sn?Math.min(.85,P.holR*1.6):P.holR),pa));
      let a0=ps0-wj[0]/tot*Math.PI;for(let j=0;j<nl;j++){const half=wj[j]/tot*Math.PI,nv=3;if(Lj[j]>1.35*s)
        for(let v=0;v<nv;v++){const pa=a0+half*(1+(v-1)*.55),p0=at(Lj[j]*.3,pa),p1=at(Lj[j]*.6,pa+(v-1)*.04),p2=at(Lj[j]*.86,pa+(v-1)*.07);vein+=`M${svN(p0[0])} ${svN(p0[1])}Q${svN(p1[0])} ${svN(p1[1])} ${svN(p2[0])} ${svN(p2[1])}`}a0+=2*half}}
    let lit=null;if(hi&&front&&ofc>.2){const lx=V3.dot(Lh,E1f),ly=V3.dot(Lh,E2),pl=Math.atan2(-ly,-lx),A=[],I2=[];for(const[pa,rr,sn]of arcs){let d=((pa-pl+9.42478)%6.28319)-3.14159;if(Math.abs(d)<1.25)A.push([pa,rr,sn])}
      if(A.length>1){A.sort((a,b)=>(((a[0]-pl+9.42478)%6.28319))-(((b[0]-pl+9.42478)%6.28319)));for(const[pa,rr,sn]of A)I2.push(at(rr*(sn?.88:.94),pa));for(let q=A.length-1;q>=0;q--)I2.push(at(A[q][1]*(A[q][2]?.7:.5),A[q][0]));lit=I2}}
    items.push({key,draw:kk=>{E('path',{d:svSpl(out),fill:tone},kk);
      if(hol)E('path',{d:svSpl(hol),fill:mm.shade,'fill-opacity':svF(P.holA*(1-.5*fan)),stroke:'none'},kk);
      if(vein)E('path',{d:vein,fill:'none',stroke:mm.shade,'stroke-width':svF(Math.max(.3,R0*.0035)),'stroke-opacity':svF(P.veinA),'stroke-linecap':'round'},kk);
      if(lit)E('path',{d:svSpl(lit),fill:mm.lite,'fill-opacity':svF(P.liteA*(1-.6*fan)),stroke:'none'},kk);
      if(thr.length)E('path',{d:svSpl(thr),fill:mix(m.throat,m.dry,.4*fan),stroke:'none'},kk)}});
    /* its pins: filaments leaning out of the throat, pale oblong anthers */
    if(front&&ofc>.3&&t<P.pin.T&&dec<.9){const PN=P.pin,npn=Math.round((PN.n[0]+(PN.n[1]-PN.n[0]+.99)*g5-.49)*(1-dec));
      for(let q=0;q<npn;q++){const h1=pxHashS(i,q+80,sd),h2=pxHashS(i,q+90,sd),h3=pxHashS(i,q+100,sd),a=PN.A[0]+(PN.A[1]-PN.A[0])*h1,az=h2<.6?(h3-.5)*2.4:h3*6.283,
          dir=V3.add(V3.sc(Nf,Math.cos(a)),V3.sc(V3.add(V3.sc(E1f,Math.cos(az)),V3.sc(E2,Math.sin(az))),Math.sin(a))),Lp=R0*gs*PN.L*(.65+.7*h2)*svSm((ofc-.3)/.5)*(1-.6*dec),
          b0=V3.add(C,V3.sc(Nf,s*cupK*.3)),mi=V3.add(V3.add(b0,V3.sc(dir,Lp*.5)),V3.sc(E1f,Lp*PN.cv*.5)),tp=V3.add(V3.add(b0,V3.sc(dir,Lp)),V3.sc(E1f,Lp*PN.cv*1.3)),
          pb=PJ(B,O,b0),pm=PJ(B,O,mi),pt=PJ(B,O,tp),pa=PJ(B,O,V3.add(tp,V3.sc(V3.nz(V3.sub?V3.sub(tp,mi):V3.add(tp,V3.sc(mi,-1))),R0*gs*PN.ar*1.6)));
        pinsF.push(`M${svN(pb[0])} ${svN(pb[1])}Q${svN(pm[0])} ${svN(pm[1])} ${svN(pt[0])} ${svN(pt[1])}`);
        pinsA.push(`M${svN(pt[0])} ${svN(pt[1])}L${svN(pa[0])} ${svN(pa[1])}`)}}}
  /* the involucre and the receptacle: under the ball seen from the face, by depth from the side and behind */
  const ob=svSm((op-.18)/.6),nb=Math.max(5,Math.round(P.br.n+P.br.nJ*nbJ)),Pb={light:Lg,inv:{round:0,edge:P.br.edge}},under=nz>=.15,colB=mix(m.bract,m.dry,(P.br.dk==null?.6:P.br.dk)*fan);
  if(nz<.75||op<.5||fan>.3){const rc=svcapRecep(B,O,R0,{recep:P.recep,light:Lg},{recep:mix(m.recep,m.dry,.5*fan),dry:m.dry},gs,0);rc.key=under?-2e9:rc.key;items.push(rc);
    for(let j=0;j<nb;j++){const ph=rot+.3+j/nb*6.283+(pxHashS(j,1,sd)-.5)*.35,dL=.85+.3*pxHashS(j,2,sd),
        q={phi:ph,r0:P.br.r0*R0*gs*(1-.5*(1-P.fruit.k)*fan),z0:P.br.z0*R0*gs,L:P.br.L*R0*(.55+.45*gs)*dL*(1-P.br.wk*fan),W:P.br.W*R0*(.7+.3*gs)*(1-.3*P.br.wk*fan),R0:1,Rh:R0,a0:P.br.a0c+(P.br.a0o-P.br.a0c)*ob+P.br.wa*fan,a1:P.br.a1c+(P.br.a1o-P.br.a1c)*ob+1.6*P.br.wa*fan,aPow:1,curl:0,wav:0,wph:0,tw:(pxHashS(j,3,sd)-.5)*.5,kap:0,cupK:.5/(P.br.W*R0)};
      const bt=svcapBract(B,O,q,Pb,colB);if(under)bt.key=-2e9+1+j;items.push(bt)}}
  /* the fruiting ball's stars, once the corollas wither and fall: a cup and its five bristles on each achene */
  /* each achene a papery crown (the epicalyx: a frilled cup, raised on the ball, lit by its own normal so the ball reads round), a dark eye in
     its middle and the calyx's awns out of it; the crowns show where the corollas have fallen (the top first), packed so the floor hardly shows */
  if(Math.max(shed,fan*.5)>.05){const nfr=P.fruit.n[hi?1:0],fl=P.fruit.L*R0*gs,vis=Math.max(shed,fan*.5),dkF=svSm((wl-.72)/.22),cB=mix(m.fruitB,m.fruitD,dkF),
      cupC=mix(mix(m.fruit,m.fruitL,.45),m.fruitL,dkF),eyeC=mix(m.fruit,m.fruitD,.35+.5*dkF),spF=rsF*Math.sqrt(2*c1/nfr),nq=hi?14:10;
    for(let i=0;i<nfr;i++){const u=(i+.5)/nfr,ct=1-u*c1,th=Math.acos(Math.max(-1,Math.min(1,ct))),t=th/cap,ph=rot+.7+i*2.39996,N=[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),ct];
      const nv=toV(B,N);if(nv[2]<.05||pxHashS(i,7,sd)>svSm(vis*2.2-1.2*t)*1.1+.04)continue;
      const C=ball(th,ph,rsF),E1=[ct*Math.cos(ph),ct*Math.sin(ph),-Math.sin(th)],E2=[-Math.sin(ph),Math.cos(ph),0],pc=PJ(B,O,C),sc=spF*(.86+.12*pxHashS(i,8,sd));
      const on=(rho,a,h)=>PJ(B,O,V3.add(V3.add(C,V3.add(V3.sc(E1,Math.cos(a)*rho),V3.sc(E2,Math.sin(a)*rho))),V3.sc(N,h)));
      const rim=[],eye=[];for(let q=0;q<nq;q++){const a=q/nq*6.283+i,fr=(q%2?.88:1.04)+.1*(pxHashS(i,q+30,sd)-.5);rim.push(on(sc*fr,a,sc*.32));if(q%2===0)eye.push(on(sc*.3,a,sc*.08))}
      let dB='';for(let q=0;q<P.fruit.nb;q++){const a=q/P.fruit.nb*6.283+i*1.3,d=V3.add(V3.add(V3.sc(E1,Math.cos(a)),V3.sc(E2,Math.sin(a))),V3.sc(N,.5)),pm=PJ(B,O,V3.add(C,V3.sc(d,fl*.5))),pe=PJ(B,O,V3.add(V3.add(C,V3.sc(d,fl)),V3.sc(N,fl*.15)));
        dB+=`M${svN(pc[0])} ${svN(pc[1])}Q${svN(pm[0])} ${svN(pm[1])} ${svN(pe[0])} ${svN(pe[1])}`}
      const tC=svcuTone(cupC,nv,{shade:shd(cupC,-.32),lite:mix(cupC,'#ffffff',.45)},Lg),tE=svcuTone(eyeC,nv,{shade:shd(eyeC,-.4),lite:mix(eyeC,'#ffffff',.25)},Lg);
      items.push({key:PJ(B,O,V3.add(C,V3.sc(N,sc*.3)))[2],draw:kk=>{E('path',{d:svSpl(rim),fill:tC,stroke:shd(cupC,-.3),'stroke-width':svF(Math.max(.2,R0*.003)),'stroke-opacity':.5},kk);
        E('path',{d:svSpl(eye),fill:tE,stroke:'none'},kk);
        E('path',{d:dB,fill:'none',stroke:cB,'stroke-width':svF(Math.max(.2,R0*.005)),'stroke-opacity':.9,'stroke-linecap':'round'},kk)}})}}
  items.sort((a,b)=>a.key-b.key);for(const it of items)it.draw(k);
  /* the pins over the florets: filaments, the anthers' shadow, the anthers */
  if(pinsF.length&&!LOD){const aw=svF(Math.max(.5,R0*gs*P.pin.ar*2)),Ls=[LIGHT[0],-LIGHT[1]],sh=pinsA.join('').replace(/-?[\d.]+ -?[\d.]+/g,m0=>{const[x,y]=m0.split(' ').map(Number);return svN(x-Ls[0]*R0*.012)+' '+svN(y-Ls[1]*R0*.012)});
    E('path',{d:pinsF.join(''),fill:'none',stroke:mix(m.fil,m.dry,.5*dec),'stroke-width':svF(Math.max(.25,R0*gs*P.pin.fw)),'stroke-linecap':'round','stroke-opacity':.92},k0);
    E('path',{d:sh,fill:'none',stroke:m.anthSh,'stroke-width':aw,'stroke-linecap':'round','stroke-opacity':.55},k0);
    E('path',{d:pinsA.join(''),fill:'none',stroke:mix(m.anth,m.dry,.5*dec),'stroke-width':aw,'stroke-linecap':'round'},k0)}
  return k0}
