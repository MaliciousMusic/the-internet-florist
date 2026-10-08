/* ---------- y3.js: one engine for radial flowers (svBloom) ----------
   A head of tepals or petals in two whorls, drawn as sheets (svSheet) by svDraw, through its whole life: the bud (the petals wrapped on an egg), the
   opening, full bloom, the decline (opening too far, margins rolling back and crinkling, edges fading), the faded head (tipping toward the ground,
   the petals hanging limp, then falling). The heart (stamens, pistil, corona...) is the species' own, a hook.
   Every number has the anemone's value by default (the reference finished SKU, 2026-10-08): a species gives only what differs, as a spec
   {genes(seed), mat(colourway), heart(ctx), life(), ...overrides of SVB_DEF}. Life curves are [a,b]: svSm((x-a)/b). */
const SVB_DEF={
  open:[.2,.8],bud:[.1,.32],dec:[.1,.4],fan:[.55,.17],shed:[.78,.17],green:[.5,.02,.14],greenC:'#7a9850',
  /* the head tipping toward the ground as it wilts: sum of k·svSm((wl-a)/b) */
  tip:[[.22,.15,.4],[1.05,.5,.3]],
  /* the whorls (outer, inner): length, width (× length), insertion radius, height, base and tip angles from the axis ([closed, + open × o2]) */
  L:[.92,.86],Wd:[1.02,.94],r0:.13,z0:[-.012,.004],a0:[[.55,.55],[.45,.53]],a1:[[.62,.78],[.52,.73]],cupW:[1,1.15],zb:[0,.002],
  /* the decline and the faded head */
  wA0:[.22,.25],wA1:[.5,.35],sag:[.12,.25,.25],limp:[.95,.15],wav:[.7,1.3,2.6],curl:[.22,.4],tw:[.6,.35],fanL:.1,fanW:.36,shedW:.42,
  edge:{light:'#e2cfa4',red:'#5e0a24',other:'#f2ecf2',a:[.18,.42]},trans:[.26,.2],rim:[.006,.012,.22,.25],
  /* the outline: a claw (its width, the rest) to the broadest point vb, then the tip (superellipse t.tip, notch); cupArc: the cupping across is a true arc
     (a tepal wider than its whorl's radius still follows it), lap: each piece turned a little on its midrib, so neighbours lie one over the other */
  vb:.64,claw:[.24,.76],clawK:1.15,
  /* the sheet: cupping across, the decline's revolute margins and crinkle */
  cup:.33,cupFan:.65,rev:[.35,.3],crk:[.05,.11],
  /* the bud: an egg (height [base, + growth], radius as share of height), the wrap's width per whorl, the whorls' scale */
  budH:[.5,.38],budR:.38,budE:[.1,.88],budK:1,budP:.85,greenTip:0,veinLo:true,aPow:1.3,cupArc:false,lap:0,pmin:3,budW:[1.4,1.25],budHw:[1,.96],budRw:[1,.95],
  /* veins (zoom, normal): count, net, forks */
  veinN:[16,8],veinNet:[.4,0],veinFork:[.75,.35],
  ao:[.55,.32,.2,.3],nu:[10,13],nv:16,
  light:{wrap:.3,amb:.26,dif:.72,sky:.14,ks:.09,gloss:14,dark:[.94,.86,.78,.7,.62,.54],da:.17,lit:[1.05,1.13,1.21],la:.18,darkLo:[.91,.78,.65,.52],daLo:.23,litLo:[1.07,1.18],laLo:.22,soft:.045}};
/* genes from a table: {n:[[count,weight]...], tep:{key:range}, late:{key:range}, head:{key:range}}; a range is [a,b] (uniform), [a,b,p] (with
   probability p, else 0), [a,b,'r'] (rounded) or 'sd' (a seed); the draws keep the table's order */
function svGenes(seed,T){const r=svRng(seed),one=x=>x==='sd'?Math.floor(r()*1e9):x[2]==='r'?Math.round(r.in(x[0],x[1])):x.length>2?(r()<x[2]?r.in(x[0],x[1]):0):r.in(x[0],x[1]),
    n=r.pick(T.n),tep=[];for(let i=0;i<n;i++){const t={};for(const k in T.tep)t[k]=one(T.tep[k]);tep.push(t)}
  for(const t of tep)for(const k in T.late||{})t[k]=one(T.late[k]);const g={n,tep};for(const k in T.head)g[k]=one(T.head[k]);return g}
/* a colour moved in hue, saturation and lightness (the individual's shade within its variety) */
function svShift(hex,dh,ds,dl){const[h,s,l]=h2l(hex);return l2h(h+dh,s*(1+ds),l+dl)}
/* the veins of one petal, in (u,v): main veins fanning from the claw (a few forking near the margin), short links between them (the net) */
function svVeins(r,n0,net=1,fork=.75){const main=[],fine=[],n=Math.round(n0),us=[];for(let k=0;k<n;k++)us.push((-1+2*(k+.5)/n)*.9+r.in(-.025,.025));
  /* each vein leaves the claw close to the midline and follows the widening blade (u is relative to the width, so a vein at constant u keeps its place) */
  const path=(u0,u1,v0,v1,ph,wb)=>{const pl=[];for(let s2=0;s2<=10;s2++){const v=v0+(v1-v0)*s2/10,t=svSm((v-.02)/.5);pl.push([Math.max(-.97,Math.min(.97,u0+(u1-u0)*t+wb*Math.sin(v*11+ph))),v])}return pl};
  for(let k=0;k<n;k++){const v1=r.in(.86,.97),ph=r.in(0,6.3),wb=r.in(.006,.016);main.push(path(us[k]*.3,us[k],.02,v1,ph,wb));
    /* forks at an acute angle where the blade widens */
    if(r()<fork){const vb=r.in(.3,.62),side=k<n/2?-1:1,q=[];for(let s2=0;s2<=6;s2++){const v=vb+(v1-.03-vb)*s2/6,t=svSm((v-.02)/.5),base=us[k]*.3+(us[k]-us[k]*.3)*t;q.push([Math.max(-.97,Math.min(.97,base+side*(.5/n)*svSm(s2/4)+wb*Math.sin(v*11+ph))),v])}fine.push(q)}}
  /* the net: short oblique links between neighbours, at a sharp angle to the veins */
  for(let k=0;k<n-1;k++){const m=Math.round(r.in(2,5)*net);for(let q=0;q<m;q++){const v=r.in(.22,.86),t=svSm((v-.02)/.5),a=us[k]*.3+(us[k]-us[k]*.3)*t,b=us[k+1]*.3+(us[k+1]-us[k+1]*.3)*t,dv=r.in(.05,.11)*(r()<.5?1:-1);
    fine.push([[a,v],[(a*.6+b*.4),v+dv*.45],[b,v+dv]])}}
  return{main,fine}}
/* the head: in the frame B at O, D across, opening op (0 bud .. 1 open), wilted wl (0 fresh .. 1 dry), colourway cwx ({id,...}), spec S */
function svBloom(par,B,O,D,S,cwx,op,seed,wl){const P=S._m||(S._m=Object.assign({},SVB_DEF,S)),g=P.genes(seed),cw0=P.mat(cwx),R0=D/2,pieces=[],det=DET>=1.5?1.3:1;
  if(wl==null)wl=P.life?P.life():0;
  /* the wilting head gives way: it tips toward the ground on its softened neck */
  {const tip=P.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0),ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);if(tip>0&&al>.05){const A=V3.sc(ax,1/al);B=B.map(r=>rotA(r,A,Math.min(tip,Math.acos(Math.max(-1,Math.min(1,-B[2][1])))*.95)))}}
  const o2=svSm((op+g.op-P.open[0])/P.open[1]),bud=1-svSm((op-P.bud[0])/P.bud[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),
    sh=c=>{const x=svShift(c,g.dh,g.ds,g.dl);return gt>0?mix(x,P.greenC,gt):x},shv=(c,v)=>{const x=svShift(c,g.dh,g.ds,g.dl),k=gt*(1-P.greenTip*v);return k>0?mix(x,P.greenC,k):x},body=cw0.st[Math.min(3,cw0.st.length-1)][1],
    bst0=cw0.bst.map(([v,c])=>[v,shv(c,v)]),bstB=[[0,sh(mix(body,'#ffffff',.78))],[.4,sh(mix(body,'#ffffff',.42))],[.78,sh(body)],[1,sh(mix(body,cw0.shade,.18))]],
    light=h2l(cw0.st[Math.min(3,cw0.st.length-1)][1])[2]>.78,redish=(()=>{const[h0,s1,l1]=h2l(cw0.st[Math.min(3,cw0.st.length-1)][1]);return(h0<20||h0>335)&&s1>.5&&l1<.6})(),
    st=cw0.st.map(([v,c],i)=>[i<2?v*g.ring:v,i>=3&&dec>0?mix(shv(c,v),light?P.edge.light:redish?P.edge.red:P.edge.other,(i===3?P.edge.a[0]:P.edge.a[1])*dec):shv(c,v)]),
    mat=Object.assign({st,stops:st,bstops:bud>.25&&P.budPale!==false?bstB:bst0,shade:sh(cw0.shade),lite:cw0.lite,bshade:cw0.bshade,blite:cw0.blite,rim:dec>0?mix(cw0.rim,light?'#b08a58':'#ffffff',.6*dec):cw0.rim,cast:cw0.cast},P.light,
      {trans:P.trans[0]+P.trans[1]*dec,rw:P.rim[0]+P.rim[1]*dec,ro:P.rim[2]+P.rim[3]*dec});
  const down=[0,-1,0],nO=Math.ceil(g.n/2),nI=g.n-nO;let k=0;
  /* faded: the petals fall all at once; one or two of the lower ones hang on (their rank: low in the world first, then chance) */
  const shed=svSm((wl-P.shed[0])/P.shed[1]),keep=new Set();if(shed>0){const sc=[];let kk=0;for(let w=0;w<2;w++){const nw=w?nI:nO;for(let i=0;i<nw;i++,kk++){const ph=g.rot+(i+(w?.5:0))/nw*6.2832+g.tep[kk].dph;const dv2=toV(B,[Math.cos(ph),Math.sin(ph),0]);sc.push([Math.abs(dv2[1])+.35*pxHashS(kk,31,g.sd),kk])}}
    sc.sort((a,b)=>a[0]-b[0]);const nk=Math.round(g.n+(1+(g.sd%2)-g.n)*shed);for(let q=0;q<nk;q++)keep.add(sc[q][1])}
  for(let w=0;w<2;w++){const nw=w?nI:nO;for(let i=0;i<nw;i++,k++){const t=g.tep[k];
    const phi=g.rot+(i+(w?.5:0))/nw*6.2832+t.dph;
    if(shed>0&&!keep.has(k))continue;
    const rad=[Math.cos(phi),Math.sin(phi),0],T=[-Math.sin(phi),Math.cos(phi),0],
      L=R0*P.L[w]*t.dL*(1-P.fanL*fan),Wd=L*P.Wd[w]*t.dW*(1-P.fanW*fan)*(1-P.shedW*shed),r0=R0*P.r0,z0=R0*P.z0[w];
    /* the opening, then the bud folding over the heart, then the decline opening too far and the faded petals hanging */
    let a1n=(P.a1[w][0]+P.a1[w][1]*o2)*(.96+.04*g.cup)+t.da1,a0=(P.a0[w][0]+P.a0[w][1]*o2)+t.da0;
    a0+=P.wA0[0]*dec+P.wA0[1]*fan*t.hang;a1n+=P.wA1[0]*dec*t.wl+P.wA1[1]*fan*t.hang;
    /* the tip's sag: how much opening further lowers it in the world */
    const dA=toV(B,V3.add(V3.sc(rad,Math.cos(a1n)),[0,0,-Math.sin(a1n)])),sag=(P.sag[0]+P.sag[1]*o2+P.sag[2]*dec)*(1-bud)*(dA[0]*down[0]+dA[1]*down[1]),a1=a1n+sag,ns=24,sp=[],dv=[],
      wav=t.wav*(1-P.wav[0]*bud)*(1+P.wav[1]*dec+P.wav[2]*fan),curl=t.curl*(1-bud)+P.curl[0]*dec*t.wl+P.curl[1]*fan,tw=t.tw*(1-P.tw[0]*bud)+P.tw[1]*fan*Math.sign(t.tw||1);
    const dnL=[B[0][0]*down[0]+B[0][1]*down[1]+B[0][2]*down[2],B[1][0]*down[0]+B[1][1]*down[1]+B[1][2]*down[2],B[2][0]*down[0]+B[2][1]*down[1]+B[2][2]*down[2]],limp=P.limp[0]*fan+P.limp[1]*dec;
    let p=[rad[0]*r0,rad[1]*r0,z0];for(let j=0;j<=ns;j++){const v=j/ns,a=a0+(a1-a0)*Math.pow(v,P.aPow)+curl*.6*svSm((v-.7)/.3);let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
      /* a limp petal hangs: its spine gives way toward the ground, more toward the tip */
      if(limp>0){const hk=Math.min(.94,limp*Math.pow(v,.5)*(.55+.45*t.hang));let dn=dnL,c=V3.dot(d,dn);if(c<-.25){dn=V3.nz(V3.add(dnL,[0,0,1.5]));c=V3.dot(d,dn)}const an=Math.acos(Math.max(-1,Math.min(1,c)));
        if(an>1e-3){const s0=Math.sin(an);d=V3.nz(V3.add(V3.sc(d,Math.sin((1-hk)*an)/s0),V3.sc(dn,Math.sin(hk*an)/s0)))}}
      if(j)p=V3.add(p,V3.sc(d,L/ns));sp.push(p);dv.push(d)}
    const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))};
    /* outline: a narrow claw to the broadest point, then the tip, round to squarish (each line across is a copy of the tip's curve, so it never pinches) */
    const vb=P.vb,half=l=>(l<vb?P.claw[0]+P.claw[1]*Math.pow(Math.sin(Math.min(1,l/vb)*Math.PI/2),P.clawK):1)*Wd/2,Lu=u=>vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),t.tip)),1/t.tip)-t.notch*Math.exp(-u*u/.012),
      cupK=P.cup*g.cup*t.cup*P.cupW[w]*(1-P.cupFan*fan);
    const Sf=(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),nrm=V3.cr(d,T),ca=Math.cos(tw*vv),sa=Math.sin(tw*vv),A=V3.add(V3.sc(T,ca),V3.sc(nrm,sa)),
        hw=half(vv)*(1+t.asym*Math.sign(u)),cf=cupK*(.12+.88*svSm(vv/.55)),ph=2*cf*u,arc=P.cupArc&&Math.abs(ph)>1e-4,tx=arc?hw*Math.sin(ph)/(2*cf):u*hw,lift=(arc?hw*(1-Math.cos(ph))/(2*cf):cf*u*u*hw)+P.lap*u*hw*svSm(vv/.3)+wav*hw*Math.pow(Math.abs(u),1.5)*Math.sin(t.wk*Math.PI*vv+t.wph+u*.8)*svSm(vv/.35)-curl*hw*.45*Math.pow(Math.abs(u),2)*svSm((vv-.55)/.45)-(P.rev[0]*dec+P.rev[1]*fan)*hw*Math.pow(Math.abs(u),4)+(P.crk[0]*dec+P.crk[1]*fan)*hw*Math.sin(u*Math.PI*(2.2+t.wk*.4)+t.wph*2+vv*5)*svSm(vv/.25);
      const Pt=V3.add(V3.add(c,V3.sc(A,tx)),V3.sc(nrm,lift));if(bud<=0)return Pt;
      /* the bud: the petal lies on an egg (each line across wraps round it), the outer whorl outside the inner, the tips meeting at the top */
      const Hb=R0*(P.budH[0]+P.budH[1]*svSm((op-.02)/.3))*P.budHw[w],Rb=Hb*P.budR*P.budRw[w],ve=v*(.35+.65*Lu(u)),rr=Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(ve,P.budK))),P.budP)+R0*.004,
        hwb=Math.PI/nw*P.budW[w]*(.5+.5*svSm(ve/.35)),th=phi+u*hwb,zb=z0*.5+Hb*ve-R0*.06;
      return V3.add(V3.sc(Pt,1-bud),V3.sc([Math.cos(th)*rr,Math.sin(th)*rr,zb],bud))};
    const hi=DET>=1.5,vr=svRng(t.sd),vn=svVeins(vr,(hi?P.veinN[0]:P.veinN[1])+vr.in(0,3),hi?P.veinNet[0]:P.veinNet[1],hi?P.veinFork[0]:P.veinFork[1]),vc=sh(cw0.vein);
    const fl=cw0.flames,flames=fl?(()=>{const fr=svRng(t.sd+13),n=Math.round(fr.in(fl.n[0],fl.n[1])),L2=[];for(let q=0;q<n;q++){const u0=fr.in(-.8,.8),v0=fl.from*fr.in(.85,1.25),v1=Math.min(1,fl.to*fr.in(.8,1)),pl=[],ph=fr.in(0,6.3);
        for(let s2=0;s2<=9;s2++){const v=v0+(v1-v0)*s2/9;pl.push([Math.max(-.95,Math.min(.95,u0*(.4+.6*svSm(v/.5))+.05*Math.sin(v*9+ph))),v])}L2.push([pl,fl.w*fr.in(.6,1.5)])}return L2})():null;
    const bl=cw0.blot,bd=cw0.band,m=Object.assign({},mat,{flames:flames?{c:sh(fl.c),op:fl.op,list:flames,side:fl.side}:null,blot:bl?Object.assign({},bl,{c:sh(bl.c),e:bl.e&&sh(bl.e),op:(bl.op??1)*(1-bud)}):null,band:bd?Object.assign({},bd,{c:sh(bd.c)}):null,veins:!hi&&P.veinLo===false?null:(s2,front)=>front?[[vn.main,.003,vc,.3+.25*dec],[vn.fine,.0021,vc,.24+.2*dec]]:[[vn.main,.0026,cw0.bvein,.2+.1*bud]]});
    /* light colourways brown in blotches as they fade */
    if(light&&dec>.3){const sr=svRng(t.sd+7),ns2=Math.round(2+5*fan);m.spots=[];for(let q=0;q<ns2;q++){const v=sr.in(.45,.98),u=(sr()<.5?-1:1)*sr.in(.35,.95);m.spots.push([u,v,sr.in(.08,.2),sr()<.5?'#9a7246':'#b48c5a',(.25+.4*fan)*(dec-.3)/.7])}}
    pieces.push(svSheet(B,O,Sf,{nu:Math.round((dec>.2?P.nu[1]:P.nu[0])*det),nv:Math.round(P.nv*det),mat:m,ao:(u,v,front)=>front?1-P.ao[0]*(1-svSm((v-.02)/P.ao[1])):1-P.ao[2]*(1-svSm(v/P.ao[3])),zb:R0*P.zb[w]}))}}
  /* the heart: the species' own (its pieces go in the same order) */
  if(P.heart)P.heart({par,B,O,D,R0,g,cw0,op,o2,bud,dec,fan,det,pieces});
  return svDraw(par,pieces,{D,pmin:P.pmin})}
/* ---------- the heart of a lily-type flower (tulips; lilies, alstroemerias, fritillaries with their own numbers), svBloom's hook ----------
   A stout pistil (the ovary a lit column, a short style, a stigma of three broad lobes crumpled at their margin) ringed by n stamens: the filaments
   flattened, broad at their foot, the anthers long and held upright in line with the filament (basifixed; vers tilts them out, as the lilies'
   versatile anthers). The colourway gives fil, anth, pol (the pollen's sheen on the anthers), ov, sg. Hidden in a closed bud; it fades with the flower:
   the anthers shrivel, darken, splay and fall, the filaments wilt, the ovary swells. Sizes x the radius R0. */
const SVH6_DEF={n:6,ovH:.42,ovR:.085,ovT:.82,styL:.03,sgR:.12,sgUp:.3,filL:.26,filR:.07,filW:.05,filA:.1,anL:.3,anW:.034,vers:0,budMax:.4,hide:-2,lo:0};
function svHeart6(o0){const o=Object.assign({},SVH6_DEF,o0);
  return({B,O,R0,g,cw0,o2,bud,dec,fan,pieces})=>{if(bud>o.budMax||(B[2][2]<o.hide&&dec<.3))return;const lo=o.lo&&DET<1.5;
    const sz=g.stL||1,ovH=R0*o.ovH*(1+.1*fan),ovR=R0*o.ovR*(1+.3*fan),zS=ovH+R0*o.styL,sgR=R0*o.sgR*sz*(1-.15*fan),
      anth=mix(cw0.anth,'#2a2018',.55*fan),fil=mix(cw0.fil,'#3a3020',.45*fan),ovC=mix(cw0.ov||'#a8b67a','#7a6a40',.6*fan),sgC=mix(cw0.sg||'#e4dc9c','#a09060',.4*fan),
      pol=mix(cw0.pol||mix(cw0.anth,'#ffffff',.35),'#3a3020',.6*fan),st=[];
    for(let i=0;i<o.n;i++){if(fan>.55&&pxHashS(i,17,g.sd)<(fan-.55)*1.8)continue;
      const a=g.rot+(i+.5)/o.n*6.2832,cr=[Math.cos(a),Math.sin(a),0],sp=o.filA+.1*o2+.15*dec+.55*fan*pxHashS(i,5,g.sd),fl=R0*o.filL*sz*(.94+.12*pxHashS(i,3,g.sd))*(1-.1*fan),
        b0=[cr[0]*R0*o.filR,cr[1]*R0*o.filR,R0*.01],d=[cr[0]*Math.sin(sp),cr[1]*Math.sin(sp),Math.cos(sp)],t0=V3.add(b0,V3.sc(d,fl)),
        sa=sp+.05+o.vers+.8*fan*pxHashS(i,7,g.sd),da=[cr[0]*Math.sin(sa),cr[1]*Math.sin(sa),Math.cos(sa)],al=R0*o.anL*sz*(1-.45*fan),
        a0=V3.add(t0,V3.sc(da,-al*.06)),a1=V3.add(t0,V3.sc(da,al*.94));
      st.push({f:[PJ(B,O,b0),PJ(B,O,V3.add(b0,V3.sc(d,fl*.5))),PJ(B,O,t0)],a:[PJ(B,O,a0),PJ(B,O,a1)],z:PJ(B,O,V3.add(t0,V3.sc(da,al*.4)))[2],top:a1})}
    const cz=PJ(B,O,[0,0,ovH*.6])[2],lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),fw=R0*o.filW,aw=Math.max(.3,R0*o.anW*2*(1-.35*fan));
    const stam=(k2,list)=>{if(!list.length)return;let df='',da='',dh='';
      for(const s of list){/* the filament: a flattened strap, broad at its foot */const P=s.f,Lp=[],Rp=[];
        for(let q=0;q<3;q++){const a=P[Math.max(0,q-1)],b=P[Math.min(2,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=fw*[.9,.6,.38][q];Lp.push([P[q][0]-dy/l*w,P[q][1]+dx/l*w]);Rp.push([P[q][0]+dy/l*w,P[q][1]-dx/l*w])}
        df+=svSpl(Lp.concat(Rp.reverse()));
        /* the anther: a long rounded stroke, its lit side dusted with pollen */
        const[a,b]=s.a,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,sg=nx*lt[0]+ny*lt[1]>0?1:-1,o1=aw*.22*sg;
        da+='M'+svJ([svR(a[0]),svR(a[1])])+'l'+svJ([svR(b[0])-svR(a[0]),svR(b[1])-svR(a[1])]);dh+='M'+svJ([svR(a[0]+nx*o1+dx*.12),svR(a[1]+ny*o1+dy*.12)])+'l'+svJ([svR(dx*.72),svR(dy*.72)])}
      E('path',{d:df,fill:fil},k2);E('path',{d:da,fill:'none',stroke:anth,'stroke-width':svF(aw),'stroke-linecap':'round'},k2);
      if(!LOD&&!lo)E('path',{d:dh,fill:'none',stroke:pol,'stroke-width':svF(aw*.38),'stroke-linecap':'round','stroke-opacity':.55},k2)};
    /* the pistil: the ovary (a column lit across), the stigma's three lobes spreading and a little raised */
    const pistil=k2=>{const pts=[];for(let j=0;j<16;j++){const a=j/16*6.2832;for(const[z,r]of[[0,ovR],[ovH,ovR*o.ovT]])pts.push(PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z]))}
      const p0=PJ(B,O,[0,0,0]),p1=PJ(B,O,[0,0,ovH]);let nx=-(p1[1]-p0[1]),ny=p1[0]-p0[0],fill=ovC;const nl=Math.hypot(nx,ny);
      if(nl>ovR*.2&&!lo){nx/=nl;ny/=nl;if(nx*lt[0]+ny*lt[1]<0){nx=-nx;ny=-ny}const id='sg'+(gid++),cx=(p0[0]+p1[0])/2,cy=(p0[1]+p1[1])/2,
        gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(cx+nx*ovR),y1:svF(cy+ny*ovR),x2:svF(cx-nx*ovR),y2:svF(cy-ny*ovR)},GDEF||defs);
        stops(gr,[[0,mix(ovC,'#ffffff',.3)],[.45,ovC],[1,mix(ovC,'#2a3018',.45)]]);fill='url(#'+id+')'}
      E('path',{d:svSpl(hull2(pts.map(p=>[p[0],p[1]]))),fill},k2);
      let d='';for(let q=0;q<3;q++){const a=g.rot+q*2.0944+.5,cr=[Math.cos(a),Math.sin(a),0],tg=[-cr[1],cr[0],0],c=[cr[0]*sgR*.5,cr[1]*sgR*.5,zS+sgR*.12],L=[];
        for(let j=0;j<14;j++){const t=j/14*6.2832,rr=1+.13*Math.sin(t*4+q*1.7),x=Math.cos(t)*sgR*.55*rr,y=Math.sin(t)*sgR*.42*rr;
          L.push(PJ(B,O,V3.add(c,V3.add(V3.sc(cr,x*Math.cos(o.sgUp)),V3.add(V3.sc(tg,y),[0,0,x*Math.sin(o.sgUp)+R0*.012*Math.sin(t*3)])))))}
        d+=svSpl(L.map(p=>[p[0],p[1]]))}
      E('path',{d,fill:sgC,stroke:mix(sgC,'#5a5020',.45),'stroke-width':svF(Math.max(.2,R0*.008)),'stroke-opacity':.6},k2)};
    /* its place in the order: seen from above, a cone from the stigma out to the anthers' tips; from the side, a card through the axis */
    const zT=st.length?Math.max(...st.map(s=>s.top[2])):zS+sgR*.3,rT=st.length?st.reduce((a,s)=>a+Math.hypot(s.top[0],s.top[1]),0)/st.length+R0*.03:sgR*1.1;let prox;
    if(Math.abs(B[2][2])>.6)prox=svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI,r=R0*.02+(rT-R0*.02)*v;return[Math.cos(a)*r,Math.sin(a)*r,zS+(zT-zS)*v]},{nu:12,nv:3});
    else{let X=[B[0][0],B[1][0]];const l=Math.hypot(X[0],X[1]);X=l>.1?[X[0]/l,X[1]/l]:[1,0];prox=svSheet(B,O,(u,v)=>[X[0]*u*rT,X[1]*u*rT,R0*.04+(Math.max(zT,zS)-R0*.04)*v],{nu:4,nv:4})}
    pieces.push({fn:k2=>{const hk=G(k2);stam(hk,st.filter(s=>s.z<cz));pistil(hk);stam(hk,st.filter(s=>s.z>=cz))},proxy:prox})}}
/* ---------- a strap leaf (tulips; daffodils, hyacinths, grape hyacinths, irises with their own numbers) ----------
   Long, entire, parallel-veined; its foot a sheath clasping the stem, then a blade folded in a gutter along its midrib, the margins waved, the tip
   narrowing into a little hood; glaucous (bloom: a waxy veil silvers its lit side, the gloss low) or glossy. It leaves the stem at an angle (lean),
   then bends under its weight (droop), a little twisted. Wilting (wl), it goes limp and hangs, its gutter opens, the margins curl, it yellows from the
   tip. pos: its foot on the stem's axis; H the stem, upward; Out the way it leaves the stem (view space, unit vectors). Widths x len. */
const SVL_DEF={len:100,w:.2,wp:[[0,.5],[.1,.66],[.32,1],[.62,.82],[.88,.4],[1,0]],sheath:.1,sr:2,lean:.4,droop:.45,tw:.3,gut:.5,wav:.05,wavN:3,hood:.25,
  up:'#587f68',low:'#7a9a84',base:'#a8c09c',bloom:.6,nu:7,nv:16,wl:0,sd:1};
function svStrapLeaf(par,pos,H,Out,o0){const o=Object.assign({},SVL_DEF,o0),r=svRng(o.sd),wl=o.wl||0,len=o.len,dn=[0,-1,0],limp=svSm((wl-.15)/.6),W=len*o.w,
    side0=V3.nz(V3.cr(Out,H)),ns=18,sp=[],dv=[],ph=r.in(0,6.3),tw=o.tw*r.in(-1,1)*(1+1.5*limp),hi=DET>=1.5;
  const prof=v=>{const P=o.wp;for(let i=1;i<P.length;i++)if(v<=P[i][0]){const t=svSm((v-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[i-1][1]+(P[i][1]-P[i-1][1])*t}return 0};
  /* the spine: up the stem inside the sheath, then out, then bending toward the ground (more as it wilts) */
  let p=V3.add(pos,V3.sc(Out,o.sr));const lean=o.lean*(1+.3*limp),dr=Math.min(.95,o.droop*(1+1.2*limp));
  for(let j=0;j<=ns;j++){const v=j/ns,t=svSm((v-o.sheath*.5)/.25),a=lean*t,d0=V3.nz(V3.add(V3.sc(H,Math.cos(a)),V3.sc(Out,Math.sin(a)))),
      k=dr*Math.pow(Math.max(0,(v-o.sheath)/(1-o.sheath)),1.6),d=V3.nz(V3.add(V3.sc(d0,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(d,len/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
    gut=o.gut*(1-.55*limp),wav=o.wav*(1+.6*limp),sr=o.sr*1.08;
  const S=(u,v)=>{const c=at(sp,v),d=V3.nz(at(dv,v)),s0=V3.nz(V3s(side0,V3.sc(d,V3.dot(side0,d)))),n0=V3.cr(s0,d),a=tw*v,s=V3.add(V3.sc(s0,Math.cos(a)),V3.sc(n0,Math.sin(a))),n=V3.cr(s,d),
      hw=W/2*prof(v),lift=gut*hw*u*u*(1-.5*svSm((v-.6)/.4))+wav*W*Math.pow(Math.abs(u),3)*Math.sin(Math.PI*o.wavN*v+ph+u*.6)*svSm((v-o.sheath)/.2)
        -.35*limp*hw*Math.pow(Math.abs(u),4)+o.hood*hw*u*u*svSm((v-.82)/.18),bl=V3.add(V3.add(c,V3.sc(s,u*hw)),V3.sc(n,lift));
    if(v>=o.sheath*1.8)return bl;
    /* the sheath: round the stem, its margins meeting behind it */
    const th=u*Math.PI*.62,ax=V3.add(pos,V3.sc(H,len*v)),q=V3.add(ax,V3.add(V3.sc(Out,Math.cos(th)*sr),V3.sc(side0,Math.sin(th)*sr))),t=svSm((v-o.sheath*.4)/(o.sheath*1.4));
    return V3.add(V3.sc(q,1-t),V3.sc(bl,t))};
  const tipY=mix(o.up,'#b8a85a',.5*limp),bloomL=mix('#d4e2d8',o.up,.25),
    m={stops:[[0,o.base],[o.sheath*1.2,mix(o.base,o.up,.55)],[.35,o.up],[.85,o.up],[1,tipY]],bstops:[[0,o.base],[o.sheath*1.3,mix(o.base,o.low,.6)],[.4,o.low],[1,mix(o.low,'#b8a85a',.4*limp)]],
      shade:'#1a3224',lite:mix(bloomL,'#ffffff',.2*o.bloom),bshade:'#2c4632',blite:mix(o.low,'#e8f0e8',.5),rim:mix(o.up,'#d8e4d4',.45),cast:'#0e1c12',
      wrap:.3,amb:.3,dif:.68,sky:.2,trans:.22,ks:.05+.1*(1-o.bloom),gloss:10+14*(1-o.bloom),dark:[.88,.72,.56],da:.22,lit:[1.06,1.14],la:.16+.22*o.bloom,darkLo:[.76],daLo:.3,litLo:[1.1],laLo:.25,rw:.006,ro:.3,soft:.05,
      veins:(sh,front)=>{const L=[];for(const u of[-.78,-.56,-.34,-.14,.14,.34,.56,.78])L.push([[u*.6,.02],[u,.25],[u,.6],[u*.9,.9],[u*.3,.99]]);
        return[...(hi?[[L,hi?.0035:.005,front?mix(o.up,'#2a4a34',.35):mix(o.low,'#e0eadc',.4),front?.32:.3]]:[]),[[[[0,.02],[0,.4],[0,.8],[0,.98]]],.008,front?mix(o.up,'#24402c',.5):mix(o.low,'#f0f4ea',.5),front?.45:.5]]}};
  if(!hi)Object.assign(m,{dark:[.8,.6],darkLo:[.8,.6],lit:[1.1],litLo:[1.1],rw:0});
  return svDraw(par,[svSheet(I3,[0,0,0],S,{nu:hi?o.nu+2:o.nu-2,nv:hi?o.nv+4:o.nv-4,mat:m})],{D:len*.55,sd:.02,sb:.02,so:.3,shadow:hi})}
