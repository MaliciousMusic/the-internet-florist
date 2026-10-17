/* ================= Pilote : branches ligneuses coupées, fleuries, en SVG natif (y3-branche.js) =================
   Two generic pieces for the woody cut branches of the catalogue (flowering cherries, almond, peach, apple, flowering quince, forsythia...).
   - svBlossom(par,B,O,D,S,cwx,op,seed,wl,lod): the flower of a woody plant, single or double: petals in whorls (the outer first), the calyx
     (a tube and its sepals), stamens and pistils (leafy when the centre has turned to leaves, as in 'Kanzan'), from the bud to petal fall.
     Three levels of detail: lod 2, each petal a lit svSheet ordered by svDraw (close-ups and sheets); lod 1, one lit path per whorl and side,
     the petal tips stroked (the front flowers of a bouquet); lod 0, two paths, the rosette's silhouette and its deeper heart (the many small
     flowers of a branch). A sort gives only what differs from SVBL_DEF.
   - svBranch(par,S,o): the cut branch itself (further down), on the skeleton of the old drawing; S.form (svbForm) reshapes its silhouette:
     zigzag axis, taper from the cut, short side shoots, flowers grouped on spurs gap apart, a tuft of young leaves at the tips.
   - Fading by organ (S.wilt, shared by the woody sorts: cherries, quince, forsythia...): svBranch names the organ it draws in SVB_ORG ('fl' flower,
     'cal' calyx, 'heart' stamens and pistils, 'lf' leaf, 'pd' pedicels, 'wd' wood, 'sp' spur, 'bud' winter buds, 'th' thorn, 'cut'); S.wilt maps
     an organ to its fading colour: a function (c,w)=>colour; a recipe {to,k,w0,dull,dark,br,b0,bk,dk} (svbWiltMix: toward `to` by k, reached at
     w=w0; duller by dull, darker by dark; from w=b0 browning toward br by bk, dk times more on the darker tones: margins, veins, outlines); 0: the
     organ keeps its colour (wood); absent: the sort's head wilt. The sort registers GHI[sid].wilt=svbWilt(S.wilt,headWilt) (y-prunus.js). */
const SVBL_DEF={
  /* whorls, outer first: n petals (dn: ± per flower), L length (x R0), W width (x L), r0/z0 insertion (x R0), a0/a1 angle of the petal's spine to the
     axis at its foot/tip: [closed, open] (0 upright, pi/2 flat, more: reflexed), cup (dished across), wav (ruffle), crk (crinkle), notch (depth x L) and nw (its width, u^2), fr/fd (tip teeth), tw and da (scales of the random twist and tilt), arc (0..1: cupArc,
     the cross-section bent round the axis: pieces wider than their whorl's radius then nest instead of crossing; keep cup < lap) */
  wh:[{n:5,L:.95,W:.85,r0:.1,z0:0,a0:[.1,1.35],a1:[.2,1.6],cup:.3,wav:.05,crk:0,notch:.06,fr:0,fd:0}],
  vb:.62,claw:[.3,.7],tip:2.2,aPow:1.2,
  open:[.3,.62],bud:[.12,.3],budH:[.66,.3],budR:.44,budE:[.05,.9],budK:1.1,budP:.75,budW:1.4,
  dec:[.1,.4],fan:[.45,.25],shed:[.62,.3],wA0:.2,wA1:.4,limp:.7,nod:.5,lightIn:null,
  /* fanR (option; absent: unchanged) {N,C,T,D}: a fading petal rolls lengthwise and twists into a spire (forsythia, organes 143, 159): narrower
     by N, its margins lifted by C (added to cup), twisted by T radians along its length, from the decline already by D (x dec); L: limp from the decline (x dec) */
  /* calyx: tube depth and rim radius (x R0), n sepals of L (x R0), W (x L), angle to the axis [bud, open] */
  cal:{tube:.2,rt:.13,n:5,L:.3,W:.4,a:[.4,2.1]},
  /* stamens: n, length (x R0), ring (x R0), shown when the flower is open past show; pistils: n, length, leafy (phyllody) */
  stam:{n:0,L:.3,r:.13,show:.45},pist:{n:1,L:.3,leafy:0},
  /* stay [min,max]: petals of the two outer whorls that still hang from a shed flower, limp, crumpled and narrower, beside the calyx and the heart
     (STANDARD-RENDU 4 bis n°2: never a shape of another stage); null: they all fall */
  stay:null,
  /* trans, rimW, rimO: light through the petal (sun behind), its pale translucent margin (lod 2); edgeLit: the margin paler at lod 0 and 1;
     edge: the body colour holds to that share of the petal, then turns to the tip colour (a coloured rim; 0: a smooth ramp) */
  nu:8,nv:12,ao:[.5,.32,.2,.3],pmin:4,deep:.14,lap:.12,stag:.12,veinW:2,sheetW:2,trans:.22,rimW:.005,rimO:.2,edgeLit:0,edge:0,
  /* the colours of one colourway: base (foot of the petal, front), body, tip, bud (outside of the bud), back (outside of the open petal), shade, lite,
     cal (calyx), ped (pedicel), fil, anth, pist; age(c,k): the species' own ageing of a petal colour (k 0..1) */
  mat:cw=>({base:cw.c,body:cw.c,tip:cw.c,bud:cw.c,back:cw.c,cal:'#6a6a30',fil:'#f2e8dc',anth:'#e2b840',pist:'#9ab050'}),
  age:(c,k,id,part)=>mix(c,'#f4eef0',.35*k),
  light:null};
/* the organ being drawn and the fading colours by organ (see the head of the file) */
let SVB_ORG=null;
/* (bst=1 sheets only) an organ drawn inside a part (the calyx or the heart of a flower) is also counted apart, as "part.organ" (elements only) */
function svbOrg(o,fn){const p=SVB_ORG,sub=typeof SVB_ST!=='undefined'&&SVB_ST&&p&&p!==o,n0=sub?document.getElementsByTagName('*').length:0;SVB_ORG=o;
  try{return fn()}finally{SVB_ORG=p;if(sub){const q=p+'.'+o,s=SVB_ST[q]||(SVB_ST[q]={n:0,el:0,b:0});s.n++;s.el+=document.getElementsByTagName('*').length-n0}}}
function svbWiltMix(e,c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const l0=h2l(c)[2],k=Math.min(1,w/(e.w0||1));let o=e.to?mix(c,e.to,(e.k??.5)*k):c;
  if(e.dull||e.dark){const[h,s,l]=h2l(o);o=l2h(h,s*(1-(e.dull||0)*k),l*(1-(e.dark||0)*k))}
  if(e.br&&w>(e.b0??.5)){const b0=e.b0??.5;o=mix(o,e.br,Math.min(1,(w-b0)/(1-b0)*(e.bk??.5)*(1+(e.dk||0)*Math.max(-.5,Math.min(1,(.45-l0)/.3)))))}return o}
function svbWilt(T,head){return(c,w)=>{const e=T[SVB_ORG||'fl'];if(e===undefined)return head?head(c,w):c;if(!e)return c;return typeof e==='function'?e(c,w):svbWiltMix(e,c,w)}}
/* a compact closed (or open) path: the first point absolute, then relative steps between the rounded points (exact: no drift), leading zeros dropped */
const svbN=v=>String(v).replace(/^(-?)0\./,'$1.');
function svbD(P,fx,open){let d='',px=0,py=0;for(let i=0;i<P.length;i++){const x=fx(P[i][0]),y=fx(P[i][1]);if(!i)d='M'+svbN(x)+','+svbN(y)+'l';
    else{const a=svbN(fx(x-px)),b=svbN(fx(y-py));d+=(i>1&&a[0]!=='-'?' ':'')+a+(b[0]==='-'?'':',')+b}px=x;py=y}return open?d:d+'z'}
/* a shared gradient in the defs (radial, its box's own units), made once per key */
const SVBL_G={};
function svblGrad(key,st,o={}){const wk=typeof WILT==='function'?(WILT._svk||(WILT._svk=Math.random().toString(36).slice(2,7))):'';key+=wk;
  const id=SVBL_G[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='bg'+(gid++);SVBL_G[key]=nid;
  const gr=E('radialGradient',{id:nid,cx:o.cx??.5,cy:o.cy??.5,r:o.r??.55},GDEF||defs);stops(gr,st);return`url(#${nid})`}
/* the genes of one flower: petals per whorl, their nuances */
function svblGenes(S,seed){const r=svRng(seed),g={rot:r()*6.2832,sd:Math.floor(r()*1e9),ns:[],t:[],cr:r.in(-.2,.2)};
  for(const W of S.wh){const n=Math.max(1,Math.round(W.n+(W.dn?r.in(-W.dn,W.dn):0)));g.ns.push(n);
    const ir=1+.5*Math.min(2,g.ns.length-1>0?(g.ns.length-1)/2:0)*0;for(let i=0;i<n;i++)g.t.push({dL:r.in(.9,1.08),dW:r.in(.88,1.12),dph:r.in(-.1,.1)*(W.jit??1),da:r.in(-.16,.16)*(W.jit??1),wph:r.in(0,6.28),wk:r.in(1.4,2.6),tw:r.in(-.2,.2)*(W.jit??1),nt:r.in(.6,1.4),hang:r.in(.6,1.3),fall:r()})}
  return g}
/* the flower's frame as svBlossom tilts it when it fades (the same nod), for a branch that joins each pedicel to its calyx (S.infl.join) */
function svblNod(S0,B,op,wl){const S=S0._m||(S0._m=Object.assign({},SVBL_DEF,S0)),st=svblState(S,null,op,wl||0),nod=S.nod*st.dec+.6*st.fan,ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);
  if(nod>0&&al>.05){const A=V3.sc(ax,1/al);return B.map(r=>rotA(r,A,Math.min(nod,Math.acos(Math.max(-1,Math.min(1,-B[2][1])))*.9)))}return B}
/* the life of one flower: opening, bud, decline, faded, shed */
function svblState(S,g,op,wl){return{op,o2:svSm((op-S.open[0])/S.open[1]),bud:1-svSm((op-S.bud[0])/S.bud[1]),dec:svSm((wl-S.dec[0])/S.dec[1]),fan:svSm((wl-S.fan[0])/S.fan[1]),shed:svSm((wl-S.shed[0])/S.shed[1])}}
/* one petal: its surface Sf(u,v) in the flower's frame (u -1..1 across, v 0..1 along), the inner face toward its normal */
function svblPetal(S,W,w,i,n,g,t,st,R0,dnL){const phi=g.rot+(i+(w%2)*.5)/n*6.2832+w*.41+t.dph,c=Math.cos(phi),s=Math.sin(phi),T=[-s,c,0],{o2,bud,dec,fan}=st,FR=S.fanR,fq=FR?Math.min(1,fan+(FR.D||0)*dec):0,
    L=R0*W.L*t.dL*(1-.06*fan),Wd=L*W.W*t.dW*(FR?1-FR.N*fq:1),r0=R0*W.r0,z0=R0*((W.z0||0)+S.stag*.04*((i+.5)/n-.5)),limp=S.limp*(FR&&FR.L?Math.min(1,fan+FR.L*dec):fan)*t.hang;
  const da=t.da*(W.da??1);let a0=W.a0[0]+(W.a0[1]-W.a0[0])*o2+da*.4*o2+S.wA0*dec-S.stag*(1-(S.lapD||0)*dec)*o2*((i+.5)/n-.5),a1=W.a1[0]+(W.a1[1]-W.a1[0])*o2+da*o2+S.wA1*dec;
  const ns=10,sp=[],dv=[];let p=[c*r0,s*r0,z0];
  for(let j=0;j<=ns;j++){const v=j/ns,a=a0+(a1-a0)*Math.pow(v,S.aPow);let d=[c*Math.sin(a),s*Math.sin(a),Math.cos(a)];
    if(limp>0){const k=Math.min(.9,limp*Math.sqrt(v));d=V3.nz(V3.add(V3.sc(d,1-k),V3.sc(dnL,k)))}if(j)p=V3.add(p,V3.sc(d,L/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
    vb=S.vb,half=l=>(l<vb?S.claw[0]+S.claw[1]*Math.pow(Math.sin(Math.min(1,l/vb)*Math.PI/2),1.1):1)*Wd/2,nt=(W.notch||0)*t.nt,fr=W.fr||0,
    Lu=u=>vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),S.tip)),1/S.tip)-nt*Math.exp(-u*u/(W.nw||.014))-(fr?W.fd*(1-Math.pow(Math.abs(Math.sin(u*fr*Math.PI*.5+t.wph)),.5))*(1-.4*u*u):0),
    cupK=W.cup*(1-.5*fan)+(FR?FR.C*fq:0),wav=(W.wav||0)*(1-.7*bud)*(1+1.2*dec+1.5*fan),crk=(W.crk||0)*(1-bud)*(1+dec);
  const Sf=(u,v)=>{const vv=v*Lu(u),cc=at(sp,vv),d=V3.nz(at(dv,vv)),nrm=V3.cr(d,T),tw=t.tw*(W.tw??1)*vv*(1-bud)+(FR?FR.T*fq*vv*(t.tw<0?-1:1):0),A=V3.add(V3.sc(T,Math.cos(tw)),V3.sc(nrm,Math.sin(tw))),
      hw=half(vv),au=Math.abs(u),lift=cupK*hw*u*u*(.25+.75*svSm(vv/.5))+wav*hw*Math.pow(au,1.3)*Math.sin(t.wk*Math.PI*vv+t.wph+u*1.3)*svSm(vv/.3)
        +crk*hw*Math.sin(u*7.3+t.wph*2+vv*6.1)*svSm((vv-.35)/.4)+S.lap*(1-(S.lapD||0)*dec)*u*hw*svSm(vv/.3)*(1-bud),
      arc=W.arc||0,Ps=V3.add(V3.add(cc,V3.sc(A,u*hw)),V3.sc(nrm,lift));let Pt=Ps;
    /* cupArc: the cross-section follows the circle around the flower's axis, so that overlapping neighbours nest (lap and twist as lifts) */
    if(arc){const q=V3.add(cc,V3.sc(nrm,lift+Math.sin(tw)*u*hw)),th=u*hw/Math.max(Math.hypot(cc[0],cc[1]),R0*.05),c2=Math.cos(th),s2=Math.sin(th),Pa=[q[0]*c2-q[1]*s2,q[0]*s2+q[1]*c2,q[2]];
      Pt=arc<1?V3.add(V3.sc(Pa,arc),V3.sc(Ps,1-arc)):Pa}if(bud<=0)return Pt;
    /* the bud: each petal laid on an egg, the outer whorl outside the inner, the tips meeting at the top */
    const Hb=R0*(S.budH[0]+S.budH[1]*svSm(st.op/.3))*(1-.05*w),Rb=Hb*S.budR*(1-.07*w),ve=v*(.3+.7*Lu(u)),
      rr=Rb*Math.pow(Math.sin(Math.PI*(S.budE[0]+S.budE[1]*Math.pow(ve,S.budK))),S.budP)+R0*.004,hb=Math.PI/n*S.budW*(.5+.5*svSm(ve/.35)),th=phi+u*hb,zb=z0*.5+Hb*ve-R0*.04;
    return V3.add(V3.sc(Pt,1-bud),V3.sc([Math.cos(th)*rr,Math.sin(th)*rr,zb],bud))};
  return{w,i,phi,Sf,t}}
/* a sepal (lanceolate, entire) on the rim of the calyx tube, and the tube itself */
function svblSepal(S,j,g,st,R0){const C=S.cal,ph=g.rot+(j+.5)/C.n*6.2832,c=Math.cos(ph),s=Math.sin(ph),T=[-s,c,0],L=R0*C.L,Wd=L*C.W,a=C.a[0]+(C.a[1]-C.a[0])*st.o2+.25*st.dec,r0=R0*C.rt,z0=-R0*.03;
  return(u,v)=>{const aa=a+.35*v*st.o2,d=[c*Math.sin(aa),s*Math.sin(aa),Math.cos(aa)],q=[c*r0+d[0]*L*v,s*r0+d[1]*L*v,z0+d[2]*L*v],hw=Wd/2*Math.pow(Math.max(0,1-v),.75)*Math.min(1,.45+v*3),
    nrm=V3.cr(d,T);return V3.add(V3.add(q,V3.sc(T,u*hw)),V3.sc(nrm,.25*hw*u*u))}}
/* cal.rb, cal.bp (options; default .05 and .8): the tube's radius at its foot (x R0) and the power of its profile (under 1: a bell, wide soon) */
const svblTube=(S,R0)=>(u,v)=>{const a=(u+1)*Math.PI,rb=S.cal.rb??.05,r=R0*(rb+(S.cal.rt-rb)*Math.pow(v,S.cal.bp??.8)),z=-R0*S.cal.tube*(1-v)-R0*.03*v;return[Math.cos(a)*r,Math.sin(a)*r,z]};
/* the colours of a whorl at this stage: the open petal pales from the bud's colour; inner whorls deeper; old flowers age as the species does */
function svblCols(S,cwx,w,st){const M=S._mc||(S._mc={}),m=M[cwx.id]||(M[cwx.id]=S.mat(cwx)),kd=S.deep*w,kb=(1-st.o2)*.55+st.bud*.35,ag=(c,pt)=>st.dec>0?S.age(c,st.dec,cwx.id,pt):c,
    dp=c=>mix(c,m.heart||m.bud,kd);
  return{m,base:ag(mix(dp(m.base),m.bud,kb*.8),'base'),body:ag(mix(dp(m.body),m.bud,kb),'body'),tip:ag(mix(dp(m.tip),m.bud,kb*.9),'tip'),back:ag(mix(m.back||m.body,m.bud,Math.min(1,kb*1.3+.12)),'back'),
    shade:m.shade||mix(m.body,'#3a1a2a',.55),lite:m.lite||mix(m.body,'#ffffff',.55)}}
/* the material of a whorl for svDraw (as svBloom builds it) */
function svblMat(S,c,st,t,w){const L=S.light||SVB_DEF.light,rp=S.edge?[[0,c.base],[.22,c.base],[.55,c.body],[S.edge,c.body],[1,c.tip]]:[[0,c.base],[.22,c.base],[.55,c.body],[1,c.tip]],hi=DET>=1.5,vr=svRng(t.sd||7),vn=svVeins(vr,hi?12:6,hi?.3:0,hi?.6:.3),vc=mix(c.body,c.shade,.32);
  return Object.assign({},L,w>=S.veinW&&S.lightIn?S.lightIn:{},{st:rp,stops:rp,
    bstops:[[0,mix(c.back,c.shade,.15)],[.4,c.back],[1,mix(c.back,c.tip,.4)]],shade:c.shade,lite:c.lite,bshade:mix(c.shade,'#4a4a52',.2),blite:mix(c.back,'#ffffff',.42),
    rim:mix(c.tip,'#ffffff',.3),cast:mix(c.shade,'#000000',.45),trans:(S.trans??.22)+.18*st.dec,rw:(S.rimW??.005)+.008*st.dec,ro:(S.rimO??.2)+.2*st.dec,
    veins:w>=S.veinW?null:(s2,front)=>front?[[vn.main,.0024,vc,.22+.2*st.dec],[vn.fine,.0016,vc,.16]]:[[vn.main,.002,mix(c.back,c.shade,.3),.16]]})}
/* the flower: tilted down as it fades (nod); lod as above; returns the group */
function svBlossom(par,B,O,D,S0,cwx,op,seed,wl,lod){const S=S0._m||(S0._m=Object.assign({},SVBL_DEF,S0)),g=svblGenes(S,seed),R0=D/2,st=svblState(S,g,op,wl||0);
  if(lod==null)lod=DET>=1.5?2:1;const k=lod>=2?G(par):par;
  {const nod=S.nod*st.dec+.6*st.fan,ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);if(nod>0&&al>.05){const A=V3.sc(ax,1/al);B=B.map(r=>rotA(r,A,Math.min(nod,Math.acos(Math.max(-1,Math.min(1,-B[2][1])))*.9)))}}
  const dn=[0,-1,0],dnL=[V3.dot(B[0],dn),V3.dot(B[1],dn),V3.dot(B[2],dn)],pet=[];let q=0;
  /* the petals: the inner whorls stay hidden in the bud; when the flower sheds, the petals fall (the lowest stay longest), one in eight remains */
  /* symp (option): a corolla of fused petals (forsythia, lilac) falls whole, at one moment of its own, with its tube and the stamens borne on it */
  if(S.symp)st.gone=st.shed>0&&svRng(g.sd+17)()<st.shed*1.05;
  const cand=[];S.wh.forEach((W,w)=>{const n=g.ns[w];for(let i=0;i<n;i++,q++){const t=g.t[q];if(w>=2&&st.bud>.55)continue;if(w>=1&&st.bud>.9)continue;if(st.gone)continue;
    const p=svblPetal(S,W,w,i,n,g,t,st,R0,dnL);if(st.shed>0&&!S.symp){const lo=V3.dot(toV(B,[Math.cos(p.phi),Math.sin(p.phi),0]),dn),key=t.fall*.75+.25*(lo+1)/2;if(key<st.shed*1.05){if(S.stay&&w<2)cand.push([key,W,w,i,n,t]);continue}}pet.push(p)}});
  /* stay: the last one or two petals still hang (the lowest, last to fall), limp, crumpled and narrower */
  if(S.stay&&cand.length){const ns=Math.round(S.stay[0]+(S.stay[1]-S.stay[0])*svRng(g.sd+11)())-pet.filter(p=>p.w<2).length;
    cand.sort((a,b)=>b[0]-a[0]).slice(0,Math.max(0,ns)).forEach(([,W,w,i,n,t])=>{const p=svblPetal(S,Object.assign({},W,{W:W.W*.74,L:W.L*.9,crk:(W.crk||0)+.22,wav:(W.wav||0)+.1}),w,i,n,g,
      Object.assign({},t,{hang:Math.max(1.15,t.hang*1.3),tw:t.tw*2}),st,R0,dnL);p.stay=1;pet.push(p)})}
  /* pcw(cwx,g,w,i): the colourway of one petal, or null (a flower of two colours, petal by petal: 'Toyo-Nishiki'); drawn at lod 1 and 2 only */
  const cols=S.wh.map((W,w)=>svblCols(S,cwx,w,st)),colOf=p=>{const id=S.pcw&&S.pcw(cwx,g,p.w,p.i);return id?Object.assign(svblCols(S,{id,c:cwx.c},p.w,st),{_id:id}):cols[p.w]},m=cols[0].m,calc=st.dec>0?mix(m.cal,'#6a5030',.4*st.dec):m.cal,showH=st.bud<.35&&st.o2>S.stam.show;
  const hiO=DET>=1.5&&lod>=1,ol=Sf=>{const Q=[],sv=hiO?[0,.2,.4,.6,.8]:[0,.35,.7],nt=hiO?12:6;for(const v of sv)Q.push(Sf(-1,v));for(let j=0;j<=nt;j++)Q.push(Sf(-1+2*j/nt,1));for(let q=sv.length-1;q>=0;q--)Q.push(Sf(1,sv[q]));return Q},
    nrmOf=Sf=>{const a=Sf(0,.55),b=Sf(0,.7),c=Sf(-.3,.62),d2=Sf(.3,.62);return V3.nz(toV(B,V3.cr(V3s(b,a),V3s(d2,c))))},pj=x=>PJ(B,O,x),fx=lod?n=>Math.round(n*10)/10:Math.round,
    poly=P=>svbD(P,fx);
  /* the calyx seen from behind or side: sepals and tube as one dark path, behind or in front of the corolla */
  const cS=S.calS&&lod===0,calQ=()=>{const Q=[];for(let j=0;j<S.cal.n;j++){const Sf=svblSepal(S,j,g,st,R0);Q.push((cS?[Sf(-1,0),Sf(0,1),Sf(1,0)]:[Sf(-1,0),Sf(-1,.5),Sf(0,1),Sf(1,.5),Sf(1,0)]).map(pj))}
      const tb=svblTube(S,R0),T=[],na=cS?6:10;for(let a=0;a<na;a++)for(const v of[0,1])T.push(pj(tb(-1+a/(na/2),v)));Q.push(hull2(T.map(p=>[p[0],p[1]])));return Q},
    /* pist.g0 (with symp and pist.l0 0): at lod 0 and 1 the pistil left in the calyx when the corolla has fallen (the young fruit, from the calyx's
       foot to g0 x R0; it holds the pedicel to the calyx) is a sub-path of the calyx's own path, same winding (no element of its own) */
    gP=()=>{if(lod>1||!st.gone||!S.pist.g0||S.pist.l0!==0||!showH)return'';const p0=pj([0,0,-R0*.06]),p1=pj([0,0,R0*S.pist.g0]),dx=p1[0]-p0[0],dy=p1[1]-p0[1],
      l=Math.hypot(dx,dy)||1,h=Math.max(.25,R0*.06),nx=-dy/l*h,ny=dx/l*h,ex=dx/l*h*.8,ey=dy/l*h*.8;
      return svbD(svblOri([[p0[0]+nx,p0[1]+ny],[p0[0]-ex,p0[1]-ey],[p0[0]-nx,p0[1]-ny],[p1[0]-nx,p1[1]-ny],[p1[0]+ex,p1[1]+ey],[p1[0]+nx,p1[1]+ny]]),n=>Math.round(n*10)/10)},
    calP=()=>calQ().map(poly).join('')+gP(),
    calFront=B[2][2]<.15,calDraw=kk=>svbOrg('cal',()=>E('path',{d:calP(),fill:calc,stroke:mix(calc,'#000000',.4),'stroke-width':fx(R0*.02),'stroke-opacity':.5},kk));
  /* ctube (option): the corolla tube of fused petals {L,rb,rt,bp,col} (x R0: its length, its radius at the foot and at the mouth; the power of its
     profile, default .7: a bell): from the calyx (z 0) to the mouth (z L), where the sort inserts its lobes (W.z0 = L, W.r0 = rt). Its colour: the
     outside of the petals (back) mixed with their foot (base) by col (default .45). lod 2: one piece ordered with the petals; lod 1: behind the
     corolla seen from the front, over it from behind; lod 0: a second outline in the corolla's own path (no element; it also joins a bud seen
     end-on to its pedicel); a bud at lod 1: the same, from the side and behind only */
  const CT=S.ctube&&!st.gone?S.ctube:null,ctSf=CT&&((u,v)=>{const a=(u+1)*Math.PI,r=R0*(CT.rb+(CT.rt-CT.rb)*Math.pow(v,CT.bp??.7));return[Math.cos(a)*r,Math.sin(a)*r,R0*CT.L*v]}),
    ctQ=()=>{const T=[];for(let a=0;a<10;a++)for(const v of[0,.5,1])T.push(pj(ctSf(-1+a/5,v)));return svblOri(hull2(T.map(p=>[p[0],p[1]])))},
    ctDraw=(kk,c0)=>{const f=mix(mix(c0.back,c0.base,CT.col??.45),c0.shade,.12);E('path',{d:poly(ctQ()),fill:f,stroke:mix(f,c0.shade,.45),'stroke-width':fx(R0*.016),'stroke-opacity':.45},kk)};
  const items=(lod>=2?pet.filter(p=>p.w>=S.sheetW):pet).map(p=>{const P3=ol(p.Sf).map(pj),n=nrmOf(p.Sf);return{p,P:P3,z:P3.reduce((a,b)=>a+b[2],0)/P3.length,n,front:n[2]>=0}});
  /* the inner whorls of a double flower, petal by petal (far to near), each outlined: the crumpled heart of the rosette */
  const innerDraw=(kk,L,flat)=>{const face=B[2][2]>0;if(showH&&!face)svblHeart(kk,B,O,R0,S,m,st,g,2);
    for(const x of L.slice().sort((a,b)=>a.z-b.z)){const c=colOf(x.p),lt=lightI(x.front?x.n:V3.sc(x.n,-1)),bk=Math.max(0,Math.min(4,Math.round((lt-.3)*6)));
      const fill=x.front?(flat?mix(mix(c.body,c.base,.22),bk>2?c.lite:c.shade,(bk>2?.14:.06)*Math.abs(bk-2)):svblGrad('f'+(c._id||cwx.id)+x.p.w+(st.o2*3|0)+(st.dec*3|0)+bk,[[0,c.base],[.4,c.body],[.85,mix(c.tip,bk>2?c.lite:c.shade,.07*Math.abs(bk-2))],[1,c.tip]])):mix(c.back,bk>2?c.lite:c.shade,.1*Math.abs(bk-2)+.05);
      E('path',{d:hiO?svSpl(x.P.map(p=>[p[0],p[1]])):poly(x.P),fill,stroke:mix(x.front?c.body:c.back,c.shade,.32),'stroke-width':fx(Math.max(.25,R0*.014)),'stroke-opacity':.32,'stroke-linejoin':'round'},kk)}
    if(showH&&face)svblHeart(kk,B,O,R0,S,m,st,g,2)};
  if(lod>=2){const pieces=[],det=1.3;
    /* tag: whorl.petal/n (the sheets' dbgp=1 names the patched pairs by it) */
    for(const p of pet)if(p.w<S.sheetW)pieces.push(Object.assign(svSheet(B,O,p.Sf,{nu:Math.round(S.nu*det),nv:Math.round(S.nv*det),mat:svblMat(S,colOf(p),st,{sd:p.t.wph*1e5|0},p.w),
      ao:(u,v,front)=>front?1-S.ao[0]*(1-svSm((v-.02)/S.ao[1])):1-S.ao[2]*(1-svSm(v/S.ao[3])),zb:R0*.002*p.w}),{tag:'w'+p.w+'.'+p.i+'/'+g.ns[p.w]}));
    const cm=Object.assign({},S.light||SVB_DEF.light,{stops:[[0,calc],[1,calc]],bstops:[[0,calc],[1,calc]],veins:null});
    pieces.push({fn:calDraw,tag:'cal',proxy:svSheet(B,O,svblTube(S,R0),{nu:8,nv:2,mat:cm})});
    if(CT)pieces.push({fn:kk=>ctDraw(kk,cols[0]),tag:'ct',proxy:svSheet(B,O,ctSf,{nu:8,nv:2,mat:cm})});
    const iz=S.wh.length>S.sheetW?S.wh[S.sheetW]:null;
    /* the proxy of the inner whorls (for the order only): the cone their spines lie on, a little inside, so that it never crosses the second whorl */
    const aI=iz?iz.a0[0]+(iz.a0[1]-iz.a0[0])*st.o2:0,LI=R0*(iz?iz.L*.85:.15);
    if(items.length||showH)pieces.push({fn:kk=>innerDraw(kk,items),tag:'inn',proxy:svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI,rr=iz?R0*iz.r0*.9+LI*v*Math.sin(aI)*.85:S.stam.px?R0*(S.stam.r+S.stam.L*.7)*v:R0*.15*v,z=iz?R0*((iz.z0||0)+.02)+LI*v*Math.cos(aI):S.stam.px?R0*(.04+S.stam.L*.6*v):R0*.04;return[Math.cos(a)*rr,Math.sin(a)*rr,z]},{nu:8,nv:3,mat:cm})});
    svDraw(k,pieces,{D,pmin:S.pmin});return k}
  /* lod 1 and 0: the petals grouped by whorl and side, a group one path */
  /* cal0 (option; absent: unchanged): at lod 0 the calyx is drawn too when the flower's axis turns from the viewer below cal0 (side and back views):
     the calyx tube on its pedicel, as the photographs show it (porteur 2026-10-09: no flower floating at the end of its stalk) */
  /* calV (option): a calyx drawn behind an open corolla only for cal0 is left out when the corolla's silhouette covers it all (no change on the
     page; elements saved on the flowers seen three-quarter from the front) */
  const c0v=S.cal0!=null&&lod===0&&B[2][2]<S.cal0,cvL=S.calV&&c0v&&!calFront&&!(st.bud>.6)&&!(st.shed>.3);
  if(!calFront&&!cvL&&(lod>=1||st.bud>.6||st.shed>.3||st.gone||c0v))calDraw(k);
  if(lod===0||st.bud>.6){/* two paths: the silhouette of the outer whorls (or the bud), the deeper heart */
    const c0=cols[0],out=items.filter(x=>x.p.w<2),inn=items.filter(x=>x.p.w>=2),cen=pj([0,0,R0*.05]);
    const silP=L=>{if(!L.length)return null;if(st.bud>.6)return hull2(L.flatMap(x=>x.P.map(p=>[p[0],p[1]])));const nb=lod>=1?28:14,bin=new Array(nb).fill(0),pt=new Array(nb).fill(null);
      for(const x of L)for(const p of x.P){const dx=p[0]-cen[0],dy=p[1]-cen[1],r=Math.hypot(dx,dy),b=((Math.round(Math.atan2(dy,dx)/6.2832*nb)%nb)+nb)%nb;if(r>bin[b]){bin[b]=r;pt[b]=p}}
      const P=[];for(let b=0;b<nb;b++)if(pt[b])P.push(pt[b]);return P.length>2?P:null},sil=L=>{const P=silP(L);return P?poly(P):''};
    const lt=items.length?items.reduce((a,x)=>a+lightI(x.front?x.n:V3.sc(x.n,-1)),0)/items.length:.6,bk0=Math.max(0,Math.min(4,Math.round((lt-.3)*6))),bk=lod?bk0:Math.round(bk0/2)*2,
      f0=st.bud>.6?(lod?svblGrad('bb'+cwx.id+fx(st.o2*4|0)+bk,[[0,mix(c0.back,c0.lite,.1*bk)],[.75,mix(c0.back,c0.shade,.12*(4-bk))],[1,mix(c0.back,c0.shade,.3)]],{cx:.42,cy:.38,r:.7}):mix(c0.back,bk>2?c0.lite:c0.shade,.1*Math.abs(bk-2)+.05))
        :lod?svblGrad('bo'+cwx.id+(st.o2*3|0)+(st.dec*3|0)+bk,[[0,c0.base],[.45,c0.body],[.85,mix(c0.tip,c0.lite,.08*bk)],[1,mix(c0.tip,'#ffffff',S.edgeLit??0)]])
        :svblGrad('b0'+cwx.id+(st.o2>.7?1:0)+(st.dec*3|0)+bk,[[0,c0.base],[.5,c0.body],[1,mix(c0.tip,'#ffffff',(S.edgeLit??0)+.04*bk)]]);
    /* a shed flower: its last hanging petals one by one (a silhouette round the centre would read as an open flower) */
    let so=st.shed>.3&&st.bud<=.6?out.map(x=>poly(x.P)).join(''):sil(out);
    /* (ctube) the corolla stays whole until it falls: its outline, then the tube's (same winding, so that the union fills) */
    /* a silhouette of the lobe tips that misses the tube's mouth (lobes all on one side: a corolla seen edge-on or from behind) would float off
       its tube and pedicel: each lobe's own outline, from its foot on the mouth, then joins it (porteur 2026-10-09: every flower on its shoot) */
    if(CT){const P=silP(out),mo=pj([0,0,R0*CT.L]),lj=P&&st.bud<=.6&&!svbIn(P,mo[0],mo[1]);
      so=(P?poly(svblOri(P)):'')+(lj?out.map(x=>poly(svblOri(x.P))).join(''):'')+(B[2][2]<.5||!lod?poly(ctQ()):'')}
    if(cvL){const SP=silP(out),inP=(x,y)=>{let c=false;for(let i=0,j=SP.length-1;i<SP.length;j=i++){const a=SP[i],b=SP[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c},
        hid=SP&&calQ().every(Q=>Q.every((p,i)=>{const q=Q[(i+1)%Q.length];return inP(p[0],p[1])&&inP((p[0]+q[0])/2,(p[1]+q[1])/2)}));if(!hid)calDraw(k)}
    if(!(st.gone&&!so))E('path',lod?{d:so,fill:f0,stroke:mix(c0.body,c0.shade,.45),'stroke-width':fx(R0*.018),'stroke-opacity':.5}:{d:so,fill:f0},k);
    if(inn.length&&st.bud<=.6&&(lod>=1||st.o2>.5)&&B[2][2]>-.1){const c2=cols[Math.min(cols.length-1,2)];E('path',{d:lod>=1?sil(inn):poly(svSimp(hull2(inn.flatMap(x=>x.P.map(p=>[p[0],p[1]]))),R0*.06)),fill:mix(c2.base,c2.body,.4)},k)}
    if(showH&&(lod>=1||st.shed>.3||st.gone||(S.stam.h0&&B[2][2]>-.15)))svblHeart(k,B,O,R0,S,m,st,g,0);
    if(calFront&&(lod>=1||st.shed>.3||st.gone||c0v))svbOrg('cal',()=>E('path',{d:calP(),fill:calc,'fill-opacity':.9},k));return k}
  /* lod 1: petal by petal, far to near (exact order), each a flat lit fill with a soft outline; the calyx behind or in front (ctube: the tube next to it) */
  if(!calFront&&!(st.bud>.6)){calDraw(k);if(CT)ctDraw(k,cols[0])}
  if(DET<1.5&&S.wh.length>2){const inn=items.filter(x=>x.p.w>=2);innerDraw(k,items.filter(x=>x.p.w<2),1);
    if(inn.length&&B[2][2]>-.1){const c2=cols[2],cen=pj([0,0,R0*.05]),nb=16,bin=new Array(nb).fill(0),pt=new Array(nb).fill(null);
      for(const x of inn)for(const p of x.P){const dx=p[0]-cen[0],dy=p[1]-cen[1],r=Math.hypot(dx,dy),b=((Math.round(Math.atan2(dy,dx)/6.2832*nb)%nb)+nb)%nb;if(r>bin[b]){bin[b]=r;pt[b]=p}}
      E('path',{d:poly(pt.filter(Boolean)),fill:svblGrad('hi'+cwx.id+(st.o2*3|0)+(st.dec*3|0),[[0,c2.base],[.7,mix(c2.body,c2.base,.3)],[1,c2.body]]),stroke:mix(c2.body,c2.shade,.35),'stroke-width':fx(R0*.014),'stroke-opacity':.35},k);
      if(showH)svblHeart(k,B,O,R0,S,m,st,g,0)}}
  else innerDraw(k,items,1);if(calFront){if(CT)ctDraw(k,cols[0]);calDraw(k)}return k}
/* the centre: a ring of stamens (filaments and anthers), the pistils (a style, or small curled green leaves when the centre has turned leafy) */
function svblHeart(...a){return svbOrg('heart',()=>svblHeart0(...a))}
/* stam.h0: at lod 0 an open flower still shows its stamens, as one path of anther dots (that share of n): the golden brush of the quince */
function svblHeart0(k,B,O,R0,S,m,st,g,lod){const fx=n=>Math.round(n*10)/10,r=svRng(g.sd+3),fan=st.fan,dec=st.dec,lite=!lod&&S.stam.h0&&st.shed<=.3;let df='',da='';
  const ns=st.gone?0:Math.round(S.stam.n*(lite?S.stam.h0:lod>=2?1:lod?.5:.3)*(1-.6*fan));
  for(let i=0;i<ns;i++){const a=i*2.39996+g.rot,ca=Math.cos(a),sa=Math.sin(a),r0=R0*S.stam.r*(.75+.3*r()),l=R0*S.stam.L*(.7+.4*r())*(1-.3*dec),el=(1.05-.5*st.o2)*(S.stam.sp||1)+.4*fan,
      p0=PJ(B,O,[ca*r0,sa*r0,R0*.04]),p1=PJ(B,O,[ca*(r0+l*Math.sin(el)),sa*(r0+l*Math.sin(el)),R0*.04+l*Math.cos(el)]);
    df+=`M${fx(p0[0])},${fx(p0[1])}L${fx(p1[0])},${fx(p1[1])}`;da+=`M${fx(p1[0])},${fx(p1[1])}h.01`}
  /* stam.fw, stam.aw: filament and anther widths (x R0; default .016 and .05: the quince's thicker brush); stam.sp: their spread (x the angle to the axis) */
  if(lite){if(da)E('path',{d:da,stroke:mix(m.anth,'#5a3a1a',.7*dec),'stroke-width':fx(Math.max(.4,R0*(S.stam.aw||.05))),fill:'none','stroke-linecap':'round'},k);return}
  if(df){E('path',{d:df,stroke:mix(m.fil,'#6a5030',.5*dec),'stroke-width':fx(Math.max(.2,R0*(S.stam.fw||.016))),fill:'none','stroke-linecap':'round'},k);
    E('path',{d:da,stroke:mix(m.anth,'#5a3a1a',.7*dec),'stroke-width':fx(Math.max(.4,R0*(S.stam.aw||.05))),fill:'none','stroke-linecap':'round'},k)}
  const pc=mix(m.pist,'#6a6030',.4*dec);
  /* pist.l0 (option): 0 leaves the styles out at lod 0 (a shed flower's browning brush: the styles are lost in it); pist.g0: the pistil left in the
     calyx after the corolla fell is drawn at lod 0 inside the calyx's path (svBlossom, gP) */
  if(!lod&&S.pist.l0===0)return;
  for(let j=0;j<S.pist.n;j++){const a=g.rot+j*3.14+.6,ca=Math.cos(a),sa=Math.sin(a),l=R0*S.pist.L;
    if(S.pist.leafy){const P=[[0,0,R0*.05],[ca*l*.25-sa*l*.12,sa*l*.25+ca*l*.12,R0*.05+l*.55],[ca*l*.45,sa*l*.45,R0*.05+l*.95],[ca*l*.25+sa*l*.1,sa*l*.25-ca*l*.1,R0*.05+l*.5]].map(p=>PJ(B,O,p));
      E('path',{d:`M${fx(P[0][0])},${fx(P[0][1])}Q${fx(P[1][0])},${fx(P[1][1])} ${fx(P[2][0])},${fx(P[2][1])}Q${fx(P[3][0])},${fx(P[3][1])} ${fx(P[0][0])},${fx(P[0][1])}Z`,fill:pc,stroke:mix(pc,'#000000',.35),'stroke-width':fx(R0*.012)},k)}
    else{const p0=PJ(B,O,[0,0,R0*.04]),p1=PJ(B,O,[ca*l*.1,sa*l*.1,R0*.04+l]);E('path',{d:`M${fx(p0[0])},${fx(p0[1])}L${fx(p1[0])},${fx(p1[1])}`,stroke:pc,'stroke-width':fx(Math.max(.3,R0*.03)),'stroke-linecap':'round',fill:'none'},k)}}}
/* ---------- svBranch(par,S,o): a cut woody branch in flower, laid on a skeleton (the chains and organ sites of the L-system b29Grow, view space, y up) ----------
   The wood: each chain a lit tube, tangent-continuous (Catmull-Rom), tapering, its bark young (glossy, coloured) at the tips and older (greyer) at the foot,
   lenticels across it (foreshortened on the round; lent.lo: their density, length and opacity factors below DET 1.5, default [.6,.55,.6]), ring scars of the bud scales, a sheen; the clean cut at its foot (bark, cambium, wood, heartwood, pith).
   At each organ site: a dormant bud, or a spur (a short knobbly shoot ringed with scars) bursting into bud scales, young leaves and an inflorescence
   (corymb or umbel on a common stalk and pedicels, or sessile fascicles), each flower at its own age drawn by the sort (S.flower); thorns if any.
   o: {chains, organs, cw, op, wl, seed, spine}. S: SVBR_DEF and what the sort changes (infl: stalk and ped lengths x fD, spread, droop: the open
   flowers hang more than the buds, face, pw pedicel width x fD; leaf: see svbLeaf). Sheets: bst=1 prints the cost per organ (svbStat). Levels of detail: at DET 1 the front flowers lod 1, the rest lod 0;
   at DET >= 1.5 the front open flowers lod 2 (S.lod2), the rest lod 1.
   Options added for the flowering quince (2026-10-09; absent, nothing changes): kinds {k: 'th'|'lf'|'fl'} (the old drawing's organ kind og.p.og.k
   is kept: 'th' a thorn at its node, 'lf' a leafy spur without flowers; svbForm then chooses the flowering spurs among the others only); thorn mm,
   bw, ang, lit, tip, keep (measured thorns, svbThorn); form and thorn may be functions of the colourway (Contorta's corkscrew, Cameo's few thorns);
   infl.down (how far the cluster turns to the ground, default .55) and infl.fpl (a fascicle's pedicels, x fD, default .05); form.wave (svbForm);
   leaf.stipF 'reni' (kidney-shaped stipules, svbLeaf; stipC a colour their fill leans to, stipT the depth of their teeth at close range, default .92);
   svBlossom S.pcw (a petal's own colourway), S.lapD (the share of lap and stag lost as the flower declines: the petals part instead of turning
   together like a pinwheel), stam.h0 anthers hidden on a flower seen from behind, stam.px (lod 2: the heart's proxy is the cone of the brush, not a
   flat disc, so that the claws do not cover the stamens of a single flower); S.calS (lod 0: sepals as triangles and a lighter tube, fewer bytes for cal0); S.calV (lod 0: a calyx hidden behind its open corolla is left out); leaf.vO (opacity of the veins on the upper face, default 1: a smooth
   glossy young leaf); thorn fat (its width at .42 of its length, x the foot's, default .34: a stout cone) and cap (its foot at most that share of
   the shoot's width, default .42).
   Options added for the cherry's junctions (2026-10-09; absent, nothing changes): infl.join (x the flower's D: how far its calyx tube reaches back from
   its centre; svBlossom: cal.tube x .5): each pedicel goes from the stalk to the FOOT of its calyx and arrives along the flower's axis (S.axis(B,cw,op,wl):
   the frame as the flower tilts it when it fades, svblNod), painted under the flowers that face the viewer and over those seen from behind (svbPedJ),
   so that no pedicel crosses a corolla to its centre and no calyx floats on the back of one; svBlossom S.cal0 (the calyx at lod 0 for side and back views). */
const SVBR_DEF={fD:35,
  wood:{young:['#2a160f','#5a2e22','#86523e','#d6b49e'],old:['#2e2826','#5e524c','#8c8078','#c8beb4'],oldTo:.45,gloss:.55,
    lent:{col:'#d6b690',sp:1.5,len:.5,w:.13,op:.8,young:.4},ring:{col:'#24140e',n:3,op:.55},fiss:0},
  cut:{slant:.5,bark:'#2e1c14',cam:'#7e8a3c',wood:'#e4d2aa',heart:'#b07a50',pith:'#5e3e24',pr:.1,kind:'solid'},
  spur:{L:[.12,.3],w:.55,col:'#4a2a1e',lite:'#8a5a44',rings:3},
  wbud:{L:.17,W:.42,col:['#2e1a10','#5e3a22','#a07a52']},
  scales:{n:5,L:.11,col:'#6a3a24',inner:'#9a5a38',open:.6},
  infl:{type:'corymb',stalk:[.08,.28],ped:[.62,.95],spread:[.45,.8],droop:.2,face:.35,pw:.018,bract:{L:.13,col:'#7e7a34'}},
  leaf:{L:[.62,.9],W:.4,pet:.14,fold:.55,curl:.5,tw:.35,droop:.35,acu:.6,serr:16,dbl:1,aris:.6,glands:2,glC:'#8a2a1e',grow:.7,stip:.12,petC:'#7a3a26'},
  thorn:null,form:null,
  age:{a:.24,b:1.12,c:-.36,r:[-.18,.14],step:.06},
  lod2:8,lod1:1,
  flower:null};
/* the silhouette of a cut branch (S.form; null keeps the old drawing's skeleton as it is). The skeleton is only reshaped, with its own chance (the
   bouquet's is untouched). zig: the axis bends at each node, one side then the other (x fD: a sympodial zigzag, gentle under .25); zigL the same on
   the side shoots; bow: one bend of the whole main axis (x its length; not on a bouquet's spine); taper:[base min, base max, tip (mm), power]: the main
   axis from the cut (8 to 12 mm for a cherry) to its tip; latW: a side shoot's foot (x the main axis there); latK:[min,max]: the side shoots cut to that
   share of their length (short shoots); bare: the share of the main axis from the cut without flowering spurs (dormant buds, scars); gap:[main, side]
   (x fD): the least distance along an axis between two flowering spurs, the nodes between keep a dormant bud (dorm: its chance) or nothing; nF:[min,max]
   flowers per spur; tuft:[min,max] young leaves at the tip of the main axis (one fewer on the side shoots); lf:[foot,tip] leaves per flowering spur along
   its axis. Flowering quince, forsythia: more angular shoots (zig .3 to .5, zigL), smaller gap, thorns (S.thorn). */
function svbForm(F,o,fD,sd){const r=svRng(sd>>>0),ch=o.chains.map(c=>Object.assign({},c,{pts:c.pts.map(p=>p.slice()),ws:c.ws.slice()})),M=ch[0],U=typeof UPC!=='undefined'?UPC:6.5,
    arc=P=>{const s=[0];for(let i=1;i<P.length;i++)s.push(s[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1],P[i][2]-P[i-1][2]));return s},
    near=(P,p)=>{let bi=0,bd=1e18;for(let i=0;i<P.length;i++){const d=(P[i][0]-p[0])**2+(P[i][1]-p[1])**2+(P[i][2]-p[2])**2;if(d<bd){bd=d;bi=i}}return[bi,bd]},
    perp=P=>{const a=P[0],b=P[P.length-1],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return[-(b[1]-a[1])/l,(b[0]-a[0])/l,0]};
  const ogs=o.organs.map(og=>Object.assign({},og,{pos:og.pos.slice()}));
  /* each organ on its chain: the main one, or the nearest side shoot */
  for(const og of ogs){let ci=0,bi;if(og.main)bi=near(M.pts,og.pos)[0];else{let bd=1e18;for(let c=1;c<ch.length;c++){const[i,d]=near(ch[c].pts,og.pos);if(d<bd){bd=d;ci=c;bi=i}}}og.ci=ci;og.ii=bi||0}
  /* side shoots: shortened, their foot on the main axis */
  for(let c=1;c<ch.length;c++){const C=ch[c],n=C.pts.length;C.att=near(M.pts,C.pts[0])[0];if(F.latK&&n>3){const m=Math.max(3,Math.round(n*r.in(F.latK[0],F.latK[1])));if(m<n){
      C.pts.length=m;C.ws.length=m;for(const og of ogs)if(og.ci===c){if(og.t==='Tb'){const e=C.pts[m-1],e0=C.pts[m-2];og.pos=e.slice();og.H=V3.nz(V3s(e,e0));og.ii=m-1}else if(og.ii>=m-1)og.skip=1}}}}
  /* widths: the main axis from its cut to its tip, each side shoot from its foot */
  const sM=arc(M.pts),LM=sM[sM.length-1]||1;
  if(F.taper){const T=F.taper,w0=r.in(T[0],T[1])*U/10,w1=T[2]*U/10;M.ws=sM.map(s=>w1+(w0-w1)*Math.pow(1-s/LM,T[3]||1))}
  for(let c=1;c<ch.length;c++){const C=ch[c],n=C.pts.length,wa=Math.min(C.ws[0],(F.latW||.6)*M.ws[C.att]),wt=Math.min(C.ws[n-1],wa*.4);C.ws=C.ws.map((w,i)=>wa+(wt-wa)*Math.pow(i/(n-1),.8))}
  for(const og of ogs)og.w=ch[og.ci].ws[Math.min(og.ii,ch[og.ci].ws.length-1)];
  /* flowering spurs: past the bare foot, at least gap apart along their axis; the other nodes a dormant bud or nothing */
  const sA=ch.map((C,c)=>c?arc(C.pts):sM);
  for(let c=0;c<ch.length;c++){const L=ch[c].pts.length,sL=sA[c][L-1]||1,og2=ogs.filter(og=>og.ci===c&&og.t!=='Tb'&&!og.skip&&!og.kd).sort((a,b)=>a.ii-b.ii),
      cand=og2.filter(og=>c||sA[c][og.ii]/sL>=(F.bare||0)),gp=fD*(F.gap?F.gap[c?1:0]:0)*(F.gapL?Math.min(1,LM/(F.gapL*U)):1);
    /* as many spurs as the flowering length holds gap apart (at least two on the main axis: a short bouquet stem keeps its flowers), spread along it */
    if(cand.length){const s0=sA[c][cand[0].ii],span=sA[c][cand[cand.length-1].ii]-s0,nC=Math.min(cand.length,Math.max(c?1:2,gp?Math.round(span/gp)+1:cand.length));
      for(let k=0;k<nC;k++){const tg=s0+span*(nC>1?k/(nC-1):.5)+r.in(-.2,.2)*gp;let b=null,bd=1e18;for(const og of cand)if(!og.fl){const d=Math.abs(sA[c][og.ii]-tg);if(d<bd){bd=d;b=og}}if(b)b.fl=1}}
    for(const og of og2)if(og.fl){const q=sA[c][og.ii]/sL;if(F.nF)og.nF=Math.floor(r.in(F.nF[0],F.nF[1]+.999));if(F.lf)og.nL=Math.max(0,Math.round(F.lf[0]+(F.lf[1]-F.lf[0])*q+r.in(-.5,.5)))}
      else if(r()<(F.dorm??.4))og.dorm=1;else og.skip=1}
  /* the tufts of young leaves at the tips */
  if(F.tuft)for(const og of ogs)if(og.t==='Tb')og.tuft=Math.max(0,Math.floor(r.in(F.tuft[0],F.tuft[1]+.999))-(og.ci?1:0));
  /* the zigzag (node to node, one side then the other) and the bend, as offsets across each axis; a side shoot follows its foot */
  const zz=(c,amp)=>{const s=sA[c],L=s[s.length-1]||1,ks=ogs.filter(og=>og.ci===c&&og.t!=='Tb').map(og=>s[og.ii]/L).sort((a,b)=>a-b),K=[[0,0]];
      ks.forEach(q=>{if((q-K[K.length-1][0])*L>.55*fD)K.push([q,(K.length%2?1:-1)*amp*fD*(.6+.5*r())*(.25+.75*svSm(q/.7))*svSm(q/.15)])});K.push([1,0]);
      return q=>{let j=1;while(j<K.length-1&&K[j][0]<q)j++;const a=K[j-1],b=K[j],t=(q-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*Math.max(0,Math.min(1,t))}};
  const pM=perp(M.pts),zM=F.zig?zz(0,F.zig):()=>0,bw=!o.spine&&F.bow?r.in(-1,1)*F.bow*LM:0,dM=q=>zM(q)+bw*Math.sin(Math.PI*q)*svSm(q/.2),sh=(p,v,k)=>{p[0]+=v[0]*k;p[1]+=v[1]*k};
  for(let c=1;c<ch.length;c++){const C=ch[c],k=dM(sM[C.att]/LM),pl=perp(C.pts),zl=F.zigL?zz(c,F.zigL):()=>0,s=sA[c],L=s[s.length-1]||1;
    C.pts.forEach((p,i)=>{sh(p,pM,k);sh(p,pl,zl(s[i]/L))});for(const og of ogs)if(og.ci===c){sh(og.pos,pM,k);sh(og.pos,pl,zl(s[og.ii]/L))}}
  M.pts.forEach((p,i)=>sh(p,pM,dM(sM[i]/LM)));for(const og of ogs)if(og.ci===0)sh(og.pos,pM,dM(sM[og.ii]/LM));
  /* wave:[amp, period] (x fD): every axis winds round itself, across and in depth (a corkscrew: the twisted shoots of 'Contorta'); the side shoots
     follow their foot, the organs their axis */
  if(F.wave){const[wa,wp]=F.wave,wv=c=>{const s=sA[c],ph=r()*6.28,C=ch[c],pl=c?perp(C.pts):pM,A=wa*fD*(c?.7:1),P=wp*fD*(c?.8:1),at=i=>[Math.sin(s[i]/P*6.2832+ph)*A*svSm(s[i]/(.6*P)),Math.cos(s[i]/P*6.2832+ph)*A*.7*svSm(s[i]/(.6*P))];
      const off=C.pts.map((p,i)=>at(i));return{pl,off}};
    const W=ch.map((C,c)=>wv(c)),mv=(p,c,i)=>{const w=W[c],a=w.off[Math.min(i,w.off.length-1)],b=c?W[0].off[Math.min(ch[c].att||0,W[0].off.length-1)]:[0,0];
      sh(p,w.pl,a[0]);p[2]+=a[1];if(c){sh(p,pM,b[0]);p[2]+=b[1]}};
    ch.forEach((C,c)=>C.pts.forEach((p,i)=>mv(p,c,i)));for(const og of ogs)mv(og.pos,og.ci,og.ii)}
  return Object.assign({},o,{chains:ch,organs:ogs.filter(og=>!og.skip)})}
/* the bouquet's one stage for every head (LIFE_ALL, z1.js): 'open' a branch at its peak, every flower fresh (none past its age), its leaves unfolded */
const svbLifeAll=()=>typeof LIFE_ALL!=='undefined'?LIFE_ALL:null;
function svBranch(par,S0,o){const S=S0._m||(S0._m=Object.assign({},SVBR_DEF,S0));
  /* kinds: the organs keep the kind the old drawing gave them (thorn, leafy spur) instead of all being flowering spurs; form and thorn may depend on the colourway */
  if(S.kinds)o=Object.assign({},o,{organs:o.organs.map(og=>{const q=og.p&&og.p.og&&S.kinds[og.p.og.k];return q&&q!=='fl'?Object.assign({},og,{kd:q}):og})});
  const Fm=typeof S.form==='function'?S.form(o.cw):S.form,Th=typeof S.thorn==='function'?S.thorn(o.cw):S.thorn;if(Fm)o=svbForm(Fm,o,S.fD,svSeed(o.seed||1,'form'));
  const k=G(par),parts=[],r=svRng(o.seed||1),op=svbLifeAll()==='open'?1:o.op,wl=o.wl||0,cw=o.cw,fD=S.fD,dn=[0,-1,0],
    fx=n=>Math.round(n*10)/10,sc=p=>[p[0],-p[1]],det=DET>=1.5;S._wl=wl;
  /* leaf.late:[w0,w1] (option): leaves only after the flowers (forsythia): none before the branch has faded to w0, full size at w1 (the chance is
     drawn as before, so the branch keeps its shape); fsz(cw) (option): the flowers' size by colourway (x fD) */
  const lfL=S.leaf&&S.leaf.late,lfK=lfL?svSm((wl-lfL[0])/(lfL[1]-lfL[0])):1,fK=S.fsz?S.fsz(cw):1;
  /* the wood */
  const L0=o.chains[0]?o.chains[0].pts.length:0;o.chains.forEach((ch,ci)=>{if(ch.pts.length<2)return;const C=svbDense(ch.pts,ch.ws),n=C.length,main=ci===0,
      cut=main&&!o.spine,np=main&&n>24?2:1;
    for(let q=0;q<np;q++){const a=Math.floor(q*(n-1)/np),b=Math.floor((q+1)*(n-1)/np);let z=0;for(let i=a;i<=b;i++)z+=C[i].z;
      parts.push({kd:'wd',z:z/(b-a+1)-(main?.5:.2),fn:pp=>svbWood(pp,C,a,b,S,{main,seed:svSeed(o.seed,ci,q),age0:main?1:.4})})}
    if(cut)parts.push({kd:'cut',z:C[0].z+.01,fn:pp=>svbCut(pp,C,S)})});
  /* the organs */
  const fl=[];
  for(const og of o.organs){const pos=og.pos;if(o.spine&&pos[1]<30)continue;const w=og.w??(og.p&&og.p.ax?og.p.ax.w0+(og.p.ax.w1-og.p.ax.w0)*og.a:2);
    if(og.t==='Tb'){const H=og.H,tf=og.tuft!=null;parts.push({kd:'bud',z:pos[2]+.2,fn:pp=>svbBud(pp,pos,H,fD*S.wbud.L*.9,S,.3*svSm((op-.3)/.5))});
      /* the tip: one or two leaves, or (S.form.tuft) a tuft of young leaves spreading and hanging round the bud */
      const nL=!S.leaf?0:tf?(op>.2?og.tuft:0):op>.45&&r()<.7?1+(r()<.5?1:0):0;
      for(let j=0;j<nL;j++){const Hl=b29Spread(H,og.U,og.L,j*(tf?2.4:3)+r.in(-.4,.4),tf?r.in(.5,.85):.35,[0,.2,0]),
          len=fD*r.in(S.leaf.L[0],S.leaf.L[1])*(tf?(og.ci?.8:1)*(.55+.45*svSm((op-.2)/.6)):.75*svSm((op-.4)/.5))*(1+S.leaf.grow*wl)*lfK;
        if(len>2)parts.push({kd:'lf',z:pos[2]+Hl[2]*len*.4,fn:pp=>svbLeaf(pp,pos,Hl,len,S,cw,{age:tf?.08+.15*op:op,seed:r()*1e9|0})})}continue}
    if(og.dorm){parts.push({kd:'bud',z:pos[2]+.1,fn:pp=>svbBud(pp,pos,og.H,fD*S.wbud.L*.8,S,0)});continue}
    /* (kinds) a thorn at its node; a leafy spur: young leaves (and their stipules) out of the scales, no flowers */
    if(og.kd==='th'){if(Th&&r()<(Th.keep??1)){const Ht=svbThornDir(o,og,Th,r),sd=r()*1e9|0;parts.push({kd:'th',z:pos[2]-.05,fn:pp=>svbThorn(pp,pos,Ht,w,S,Th,sd)})}continue}
    const leafy=og.kd==='lf',nF=leafy?0:og.nF??(og.p&&og.p.og?og.p.og.n:3),A=S.age,age0=Math.max(leafy?.3:-9,A.a+op*A.b+A.c*og.a+r.in(A.r[0],A.r[1])),sl=fD*r.in(S.spur.L[0],S.spur.L[1]),se=V3.add(pos,V3.sc(og.H,sl));
    if(Th&&r()<Th.p){const Ht=Th.mm?svbThornDir(o,og,Th,r):b29Spread(og.H,og.U,og.L,r()*6.28,.5,[0,0,0]),sd=Th.mm?r()*1e9|0:0;parts.push({kd:'th',z:pos[2]-.05,fn:pp=>svbThorn(pp,pos,Ht,w,S,Th,sd)})}
    if(age0<.06){parts.push({kd:'bud',z:pos[2]+.1,fn:pp=>svbBud(pp,pos,og.H,fD*S.wbud.L,S,0)});continue}
    /* spur.d1 (option): 0 leaves the spur out below DET 1.5 (forsythia: its cup of bud scales is a pixel in the shop; the chance is drawn as before) */
    parts.push({kd:'sp',z:pos[2]+.05,fn:pp=>{const sd=r()*1e9|0;if(S.spur.d1===0&&!det)return;svbSpur(pp,pos,se,og.H,Math.max(1.3,w*S.spur.w),S,age0,sd)}});
    /* young leaves, out of the spur's scales */
    if(S.leaf){const nL=og.nL??(age0<.3?1:r()<.5?2:3);for(let j=0;j<nL;j++){const Hl=b29Spread(og.H,og.U,og.L,j*2.4+r.in(-.4,.4),.6,[0,.3,0]),len=fD*r.in(S.leaf.L[0],S.leaf.L[1])*Math.min(1,Math.max(.3,.35+.6*age0))*(1+S.leaf.grow*wl)*lfK;
      if(lfK>.08)parts.push({kd:'lf',z:se[2]+Hl[2]*len*.4-.02,fn:pp=>svbLeaf(pp,se,Hl,len,S,cw,{age:S.form?.1+.35*Math.min(1,age0):age0,seed:r()*1e9|0})})}}
    /* the inflorescence: a common stalk (corymb) or none (umbel, fascicle), pedicels, the flowers at their ages */
    const I=S.infl,hang=V3.nz(V3.add(V3.sc(og.H,.55),[0,-(I.down??.55),0])),stl=I.type==='corymb'?fD*r.in(I.stalk[0],I.stalk[1])*Math.min(1,Math.max(.4,age0*2)):0,cp=V3.add(se,V3.sc(hang,stl)),peds=[];
    for(let j=0;j<nF;j++){const age=age0-A.step*j+r.in(-.06,.04);if(age<.06&&j>0)continue;
      const ps=age<.4?.4+.6*svSm(age/.4):1,wgt=svSm((age-.25)/.5),dj=b29Spread(hang,og.U,og.L,j*6.283/nF+r.in(-.4,.4),r.in(I.spread[0],I.spread[1])*(1-.3*wgt),[0,-I.droop*(.5+1.5*wgt),0]),
        pl=I.type==='fascicle'?fD*(I.fpl??.05):fD*r.in(I.ped[0],I.ped[1])*ps,b=V3.add(cp,V3.sc(dj,pl));if(o.spine&&b[1]<28)continue;
      const ax=V3.nz(V3.add(V3.add(V3.sc(dj,.75),[0,-.15,0]),[r.in(-.15,.15),r.in(-.1,.1),r.in(.05,I.face+.15)])),B=basis(ax,r.in(-3,3)),
        fop=age<.4?.03+age*.55:age<.78?.25+(age-.4)/.38*.75:1,fwl=Math.min(1,wl+(svbLifeAll()==='open'?0:Math.max(0,age-1.12)*.9)),Df=fD*fK*(fop<.3?1:.88+.12*r());
      peds.push([cp,b,wgt]);fl.push({z:b[2],b,B,Df,fop,fwl,sd:r()*1e9|0,big:Df*(fop>.4?1:.5),cp})}
    if(!leafy&&(peds.length||stl>0))parts.push({kd:'pd',z:se[2]+.03,fn:pp=>svbPeds(pp,se,cp,peds,S,cw,age0)})}
  /* (infl.join) the pedicels, one path per cluster under its flowers that face the viewer, one over those seen from behind */
  if(S.infl.join){const byC=new Map();for(const x of fl){const Bn=S.axis?S.axis(x.B,cw,x.fop,x.fwl):x.B,ft=V3.add(x.b,V3.sc(Bn[2],-S.infl.join*x.Df)),q=[x.cp,ft,Bn[2],x.b];
      if(!byC.has(x.cp))byC.set(x.cp,[[],[]]);byC.get(x.cp)[Bn[2][2]>0?0:1].push(q)}
    for(const[,[F,Bk]]of byC){if(F.length)parts.push({kd:'pd',z:Math.min(...F.map(q=>q[3][2]))+.08,fn:pp=>svbPedJ(pp,F,S,cw)});
      if(Bk.length)parts.push({kd:'pd',z:Math.max(...Bk.map(q=>q[3][2]))+.12,fn:pp=>svbPedJ(pp,Bk,S,cw)})}}
  /* the flowers: the nearest open ones in more detail */
  const fr=fl.filter(x=>x.fop>.4).sort((a,b)=>b.z-a.z),nHi=det?S.lod2:S.lod1;fr.forEach((x,i)=>{x.lod=i<nHi?(det?2:1):(det?1:0)});
  for(const x of fl){if(x.lod==null)x.lod=det?1:0;parts.push({kd:'fl',z:x.z+.1,fn:pp=>S.flower(pp,x.B,[x.b[0],x.b[1],x.b[2]],x.Df,cw,x.fop,x.sd,x.fwl,x.lod)})}
  parts.sort((a,b)=>a.z-b.z);for(const p of parts)svbOrg(p.kd||'x',()=>svbStat(p.kd||'x',p.fn,k));return k}
/* cost per organ (URL bst=1, sheets only): elements and bytes of each kind of part, appended to the sheet's measures (pre#out) as "ST kind:n/el/KB" */
const SVB_ST=typeof location!=='undefined'&&/[?&]bst=1/.test(location.search)?{}:null;
function svbStat(kd,fn,k){if(!SVB_ST)return fn(k);const D=GDEF||defs,n0=k.childNodes.length,d0=D.childNodes.length,X=new XMLSerializer();fn(k);const s=SVB_ST[kd]||(SVB_ST[kd]={n:0,el:0,b:0});s.n++;
  const cnt=(P,i0)=>{for(let i=i0;i<P.childNodes.length;i++){const c=P.childNodes[i];s.el+=1+c.querySelectorAll('*').length;s.b+=X.serializeToString(c).length-36}};cnt(k,n0);if(D!==k)cnt(D,d0);
  if(window.svtOut&&!window.svtOut._b){const f=window.svtOut;window.svtOut=function(){const r=f.apply(this,arguments),add=()=>{const p=document.getElementById('out');if(!p)return setTimeout(add,50);
    p.textContent+=' ST '+Object.entries(SVB_ST).map(([q,v])=>q+':'+v.n+'/'+v.el+'/'+(v.b/1024).toFixed(1)).join(' ')};add();return r};window.svtOut._b=1}}
/* a chain made dense and smooth (centripetal-like Catmull-Rom between its points, tangents continuous), with its widths and depth; screen space */
function svbDense(P,W){const out=[],n=P.length,g=i=>P[Math.max(0,Math.min(n-1,i))];
  for(let i=0;i<n-1;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2),m=Math.max(1,Math.min(4,Math.round(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/6)));
    for(let s=0;s<m;s++){const t=s/m,t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3);
      out.push({p:[cr(0),-cr(1)],z:cr(2),w:W[i]+(W[i+1]-W[i])*t})}}
  const e=P[n-1];out.push({p:[e[0],-e[1]],z:e[2],w:W[n-1]});
  for(let i=0;i<out.length;i++){const a=out[Math.max(0,i-1)].p,b=out[Math.min(out.length-1,i+1)].p,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;out[i].t=[dx/l,dy/l];out[i].n=[-dy/l,dx/l]}
  let s=0;out.forEach((q,i)=>{if(i)s+=Math.hypot(q.p[0]-out[i-1].p[0],q.p[1]-out[i-1].p[1]);q.s=s});return out}
/* the bark of one piece [a..b] of a dense chain: outline, shade and light washes, the sheen, lenticels and ring scars */
function svbWood(par,C,a,b,S,o){const Wd=S.wood,g=par,fx=DET>=1.5||C[b].w<1.5?n=>Math.round(n*10)/10:Math.round,r=svRng(o.seed>>>0),L=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(L[0],L[1]),Ln=[L[0]/ll,L[1]/ll],
    a0=Math.max(0,a-1),b0=Math.min(C.length-1,b+1),idx=[];for(let i=a0;i<=b0;i++)idx.push(i);const sTot=C[C.length-1].s||1;
  /* bark colour along the whole chain: old and grey at the foot, young and glossy toward the tips */
  const colAt=i=>{const q=C[i].s/sTot,k=o.main?1-svSm((q-Wd.oldTo*.4)/(Wd.oldTo)):0;return Wd.young.map((c,j)=>mix(c,Wd.old[j],k*.85))},
    side=i=>Math.max(-1,Math.min(1,(C[i].n[0]*Ln[0]+C[i].n[1]*Ln[1])*2.2)),
    off=(f0,f1,sh)=>{const A=[],B2=[];for(const i of idx){const w=C[i].w/2,s=sh?side(i):1;A.push([C[i].p[0]+C[i].n[0]*w*f0*s,C[i].p[1]+C[i].n[1]*w*f0*s]);B2.push([C[i].p[0]+C[i].n[0]*w*f1*s,C[i].p[1]+C[i].n[1]*w*f1*s])}return A.concat(B2.reverse())},
    tl=Math.max(.12,(C[a].w+C[b].w)*.025),poly=P=>svbD(svSimp(P,tl),fx),cm=colAt(Math.round((a+b)/2)),c0=colAt(a),c1=colAt(b);
  /* the outline (a round end where the chain ends), filled along the chain from its foot colour to its tip colour */
  let d=poly(off(-1,1,false));const last=C[b0];if(b0===C.length-1){const w=last.w/2;d+=`M${fx(last.p[0]-last.n[0]*w)},${fx(last.p[1]-last.n[1]*w)}A${fx(w)},${fx(w)} 0 0 0 ${fx(last.p[0]+last.n[0]*w)},${fx(last.p[1]+last.n[1]*w)}Z`}
  let fill=cm[1];if(o.main&&c0[1]!==c1[1]){const id='bw'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:fx(C[a].p[0]),y1:fx(C[a].p[1]),x2:fx(C[b].p[0]),y2:fx(C[b].p[1])},GDEF||defs);
    stops(gr,[[0,c0[1]],[1,c1[1]]]);fill=`url(#${id})`}
  E('path',{d,fill},g);if(LOD)return g;
  /* the shaded flank (the core shadow a little in from the edge, the bounce light at the edge), the lit flank, the sheen */
  E('path',{d:poly(off(-1,-.12,true)),fill:cm[0],'fill-opacity':.62},g);if(DET>=1.5)E('path',{d:poly(off(-.88,-.55,true)),fill:cm[0],'fill-opacity':.35},g);
  E('path',{d:poly(off(.12,.62,true)),fill:cm[2],'fill-opacity':.5},g);
  const gp=svSimp(idx.map(i=>{const w=C[i].w/2*.36*side(i);return[C[i].p[0]+C[i].n[0]*w,C[i].p[1]+C[i].n[1]*w]}),tl),gl=svbD(gp,fx,1);
  const wm=idx.reduce((s,i)=>s+C[i].w,0)/idx.length;if(DET>=1.5||wm>4)E('path',{d:gl,fill:'none',stroke:cm[3],'stroke-width':fx(Math.max(.25,wm*.09)),'stroke-opacity':Wd.gloss*(DET>=1.5?.8:.6),'stroke-linecap':'round'},g);
  /* lenticels: short pale bars across the bark, shortened toward the silhouette (they go round it); denser and longer on old wood */
  const Le=Wd.lent;if(Le&&(DET>=1.5||o.main)){let dl='',acc=r()*Le.sp*wm;for(let i=Math.max(a,1);i<=b;i++){const seg=C[i].s-C[i-1].s;acc-=seg;while(acc<=0){const w=C[i].w/2,q=C[i].s/sTot,old=o.main?1-q:.2,
      lo=DET>=1.5?[1,1,1]:Le.lo||[.6,.55,.6],dens=(Le.young+(1-Le.young)*old)*lo[0];acc+=Le.sp*w*2*(.6+.8*r())/dens;const u=r.in(-.85,.85),hl=w*Le.len*(.5+.8*old)*(.6+.6*r())*Math.sqrt(1-u*u)*lo[1],hc=Math.min(hl,(1-Math.abs(u))*w*.9),x=C[i].p[0]+C[i].n[0]*w*u,y=C[i].p[1]+C[i].n[1]*w*u;
      dl+=`M${fx(x-C[i].n[0]*hc)},${fx(y-C[i].n[1]*hc)}l${fx(C[i].n[0]*hc*2)},${fx(C[i].n[1]*hc*2)}`}}
    if(dl)E('path',{d:dl,stroke:Le.col,'stroke-width':fx(Math.max(.2,wm*Le.w)),'stroke-opacity':Le.op*(DET>=1.5?1:(Le.lo||[0,0,.6])[2]),fill:'none','stroke-linecap':'round'},g)}
  /* rib (option, DET >= 1.5): the angles of a four-angled young shoot (forsythia): a pale ridge and a dark crease along it, {u:[lit, dark] (across,
     -1..1, toward the light), op, w (x the width)}; the old wood at the foot of the main axis has lost them (past oldTo) */
  const Rb=Wd.rib;if(Rb&&DET>=1.5){const ln=(u0,lit)=>{let d='',on=0;for(const i of idx){const q=C[i].s/sTot;if(o.main&&q<Wd.oldTo*.6){on=0;continue}const w=C[i].w/2,u=u0*side(i);
        d+=(on?'L':'M')+fx(C[i].p[0]+C[i].n[0]*w*u)+','+fx(C[i].p[1]+C[i].n[1]*w*u);on=1}return d},dl=ln(Rb.u[0],1),dd=ln(Rb.u[1],0);
    if(dl)E('path',{d:dl,stroke:cm[3],'stroke-width':fx(Math.max(.2,wm*Rb.w)),'stroke-opacity':Rb.op,fill:'none','stroke-linecap':'round'},g);
    if(dd)E('path',{d:dd,stroke:cm[0],'stroke-width':fx(Math.max(.2,wm*Rb.w)),'stroke-opacity':Rb.op*.8,fill:'none','stroke-linecap':'round'},g)}
  /* ring scars of the bud scales (the year's growth begins there): thin arcs across */
  const Rg=Wd.ring;if(Rg&&(DET>=1.5||wm>3)){let dr='';const nr=Math.round(Rg.n*(b-a)/(C.length||1)+r());for(let q=0;q<nr;q++){const i=a+Math.floor(r()*(b-a+1)),w=C[i].w/2,m=[C[i].p[0]+C[i].t[0]*w*.25,C[i].p[1]+C[i].t[1]*w*.25];
      for(const k2 of[0,.35])dr+=`M${fx(C[i].p[0]-C[i].n[0]*w*.98+C[i].t[0]*k2)},${fx(C[i].p[1]-C[i].n[1]*w*.98+C[i].t[1]*k2)}Q${fx(m[0]+C[i].t[0]*k2)},${fx(m[1]+C[i].t[1]*k2)} ${fx(C[i].p[0]+C[i].n[0]*w*.98+C[i].t[0]*k2)},${fx(C[i].p[1]+C[i].n[1]*w*.98+C[i].t[1]*k2)}`}
    if(dr)E('path',{d:dr,stroke:Rg.col,'stroke-width':fx(Math.max(.18,wm*.05)),'stroke-opacity':Rg.op,fill:'none'},g)}
  /* old wood: fine fissures along it */
  if(Wd.fiss&&o.main&&DET>=1.5){let df='';for(let q=0;q<Wd.fiss;q++){const u=r.in(-.7,.7);let run='';for(let i=a;i<=Math.min(b,a+Math.round((b-a)*.5));i++){const w=C[i].w/2,qq=C[i].s/sTot;if(qq>.4)break;
      run+=(run?'L':'M')+fx(C[i].p[0]+C[i].n[0]*w*u)+','+fx(C[i].p[1]+C[i].n[1]*w*u)}df+=run}if(df)E('path',{d:df,stroke:cm[0],'stroke-width':fx(wm*.04),'stroke-opacity':.4,fill:'none'},g)}
  return g}
/* the clean cut at the foot of the branch: a slanted ellipse (bark ring, cambium, wood with its darker heart and growth rings, the pith) */
function svbCut(par,C,S){const c=S.cut,p=C[0],w=p.w/2,t=p.t,nn=p.n,fx=n=>Math.round(n*10)/10,g=par,ang=Math.atan2(nn[1],nn[0])*180/Math.PI,ry=w*c.slant,cx=p.p[0]-t[0]*ry*.4,cy=p.p[1]-t[1]*ry*.4,
    el=(rx,ry2,a2)=>Object.assign({cx:fx(cx),cy:fx(cy),rx:fx(rx),ry:fx(ry2),transform:`rotate(${fx(ang)} ${fx(cx)} ${fx(cy)})`},a2);
  E('ellipse',el(w,ry,{fill:c.bark}),g);E('ellipse',el(w*.86,ry*.86,{fill:c.wood,stroke:c.cam,'stroke-width':fx(Math.max(.15,w*.07))}),g);
  if(c.heart&&w>2)E('ellipse',el(w*.5,ry*.5,{fill:c.heart,'fill-opacity':.55,stroke:mix(c.heart,c.wood,.4),'stroke-width':fx(w*.03),'stroke-opacity':.6}),g);
  if(c.kind==='chambered'){E('ellipse',el(w*c.pr*2.2,ry*c.pr*2.2,{fill:'#2a1c12',stroke:c.pith,'stroke-width':fx(w*.06)}),g);
    let d='';for(let q=-1;q<=1;q++)d+=`M${fx(cx-w*c.pr*1.6)},${fx(cy+q*ry*c.pr*.7)}h${fx(w*c.pr*3.2)}`;E('path',{d,stroke:c.pith,'stroke-width':fx(w*.04),transform:`rotate(${fx(ang)} ${fx(cx)} ${fx(cy)})`},g)}
  else E('ellipse',el(w*c.pr,ry*c.pr,{fill:c.kind==='hollow'?'#1e140c':c.pith}),g);return g}
/* a bud on the wood: an ovoid-conical cone of overlapping scales, pointed; burst (0..1): its scales part and green shows */
function svbBud(par,pos,H,len,S,burst){const W=S.wbud,fx=n=>Math.round(n*10)/10,B=spFrame(H,[0,1,0],0),g=par,
    pf=t=>Math.pow(Math.sin(Math.PI*Math.min(.995,.04+.96*t)),.6)*(1-.55*t),P=b29Rev(B,pos,len*(1+.4*burst),len*W.W*.5*(1+.5*burst),pf,0,1,6,8);
  E('path',{d:DET>=1.5?smooth(P):svbPoly(svSimp(P,len*.06),fx),fill:budFill(W.col[1]),stroke:W.col[0],'stroke-width':fx(Math.max(.2,len*.04)),'stroke-opacity':.7},g);
  if(DET>=1.5||len>5){let d='';for(let q=1;q<=3;q++){const t=q/4.2,a=PJ(B,pos,[-len*W.W*.5*pf(t),0,len*t]),b2=PJ(B,pos,[len*W.W*.5*pf(t+.12),0,len*(t+.12)]),m=PJ(B,pos,[0,len*W.W*.3,len*(t+.04)]);
      d+=`M${fx(a[0])},${fx(a[1])}Q${fx(m[0])},${fx(m[1])} ${fx(b2[0])},${fx(b2[1])}`}E('path',{d,stroke:W.col[2],'stroke-width':fx(Math.max(.15,len*.035)),'stroke-opacity':.7,fill:'none'},g)}
  if(burst>.05){const tp=PJ(B,pos,[0,0,len*(1+.4*burst)]),bs=PJ(B,pos,[0,0,len*.7]);E('path',{d:`M${fx(bs[0])},${fx(bs[1])}L${fx(tp[0])},${fx(tp[1])}`,stroke:'#8aa04a','stroke-width':fx(len*W.W*.35*burst),'stroke-linecap':'round','stroke-opacity':.9},g)}
  return g}
/* a spur: a short stout shoot out of the wood, ringed with crowded scars, its tip a rosette of reflexed bud scales (brown outside, reddish inside) */
function svbSpur(par,a,b,H,w,S,age,sd){const Sp=S.spur,Sc=S.scales,fx=DET>=1.5?n=>Math.round(n*10)/10:Math.round,g=par,r=svRng(sd>>>0),A=[a[0],-a[1]],Bp=[b[0],-b[1]],dx=Bp[0]-A[0],dy=Bp[1]-A[1],l=Math.hypot(dx,dy)||1,
    t=[dx/l,dy/l],nn=[-t[1],t[0]],w0=w*.62,w1=w*.5,P=[[A[0]+nn[0]*w0,A[1]+nn[1]*w0],[Bp[0]+nn[0]*w1,Bp[1]+nn[1]*w1],[Bp[0]+t[0]*w1*.6,Bp[1]+t[1]*w1*.6],[Bp[0]-nn[0]*w1,Bp[1]-nn[1]*w1],[A[0]-nn[0]*w0,A[1]-nn[1]*w0]];
  const dS=DET>=1.5?smooth(P):svbPoly(P,fx);if(DET>=1.5)E('path',{d:dS,fill:Sp.col,stroke:mix(Sp.col,'#000000',.4),'stroke-width':fx(Math.max(.15,w*.08)),'stroke-opacity':.6},g);
  if(l>1.5&&DET>=1.5){let d='';const nr=Math.min(6,Sp.rings+Math.round(l/w*.6));for(let q=0;q<nr;q++){const u=.25+.7*(q+r()*.5)/nr,x=A[0]+dx*u,y=A[1]+dy*u,ww=w0+(w1-w0)*u;
      d+=`M${fx(x-nn[0]*ww)},${fx(y-nn[1]*ww)}q${fx(t[0]*ww*.35+nn[0]*ww)},${fx(t[1]*ww*.35+nn[1]*ww)} ${fx(nn[0]*ww*2)},${fx(nn[1]*ww*2)}`}
    E('path',{d,stroke:Sp.lite,'stroke-width':fx(Math.max(.15,w*.1)),'stroke-opacity':.55,fill:'none'},g)}
  /* the bud scales: reflexed, the outer brown, the inner longer and reddish as the cluster grows out of them */
  if(DET<1.5&&!(age>.1&&Sc)){E('path',{d:dS,fill:Sp.col},g);return g}
  if(age>.1&&Sc){const op=Math.min(1,age/Sc.open),n=Sc.n;let d1='',d2='';for(let q=0;q<n;q++){const an=q/n*6.283+r()*.6,inner=q%2,L=S.fD*Sc.L*(inner?1.25:.9)*(.6+.4*op),
      ca=Math.cos(an),sa=Math.sin(an),ex=[t[0]*.5+nn[0]*ca*(.4+.6*op),t[1]*.5+nn[1]*ca*(.4+.6*op)],el=Math.hypot(ex[0],ex[1])||1,e=[ex[0]/el,ex[1]/el],tip=[Bp[0]+e[0]*L,Bp[1]+e[1]*L+L*.25*op],
      s0=[Bp[0]+nn[0]*w1*.5*sa,Bp[1]+nn[1]*w1*.5*sa],wq=L*.32,pn=[-e[1]*wq,e[0]*wq];
      const dd=DET>=1.5?`M${fx(s0[0]+pn[0]*.5)},${fx(s0[1]+pn[1]*.5)}Q${fx(s0[0]+e[0]*L*.6+pn[0])},${fx(s0[1]+e[1]*L*.6+pn[1])} ${fx(tip[0])},${fx(tip[1])}Q${fx(s0[0]+e[0]*L*.6-pn[0])},${fx(s0[1]+e[1]*L*.6-pn[1])} ${fx(s0[0]-pn[0]*.5)},${fx(s0[1]-pn[1]*.5)}Z`:`M${fx(s0[0]+pn[0]*.6)},${fx(s0[1]+pn[1]*.6)}L${fx(tip[0])},${fx(tip[1])}L${fx(s0[0]-pn[0]*.6)},${fx(s0[1]-pn[1]*.6)}Z`;
      if(inner)d2+=dd;else d1+=dd}
    if(DET<1.5){E('path',{d:dS+d1+d2,fill:Sp.col},g);return g}
    if(d2)E('path',{d:d2,fill:Sc.inner,stroke:mix(Sc.inner,'#000000',.35),'stroke-width':fx(w*.06),'stroke-opacity':.5},g);
    if(d1)E('path',{d:d1,fill:Sc.col,stroke:mix(Sc.col,'#000000',.4),'stroke-width':fx(w*.06),'stroke-opacity':.55},g)}
  return g}
/* the stalk and pedicels of one inflorescence: thread-fine; the buds' pedicels radiate nearly straight (a star), the open flowers' hang under their
   weight, a slight outward bow at the top only; at close range a sheen and the bracts */
function svbPeds(par,se,cp,peds,S,cw,age){const fx=DET>=1.5?n=>Math.round(n*10)/10:Math.round,g=par,c=(S.cols&&S.cols(cw).ped)||'#7a8a3a',sc=p=>[p[0],-p[1]],A=sc(se),Cp=sc(cp),
    w=Math.max(DET>=1.5?.35:.5,S.fD*(S.infl.pw||.018));let d='';
  if(Math.hypot(Cp[0]-A[0],Cp[1]-A[1])>.5)d+=`M${fx(A[0])},${fx(A[1])}L${fx(Cp[0])},${fx(Cp[1])}`;
  if(!S.infl.join)for(const[a,b,wg]of peds){const P=sc(a),Q=sc(b),dx=Q[0]-P[0],dy=Q[1]-P[1],l=Math.hypot(dx,dy)||1,k=l*(.025+.05*(wg||0))*(dx<0?-1:1),m=[P[0]+dx*.4+dy/l*k,P[1]+dy*.4-dx/l*k];
    d+=`M${fx(P[0])},${fx(P[1])}Q${fx(m[0])},${fx(m[1])} ${fx(Q[0])},${fx(Q[1])}`}
  if(d||!S.infl.join)E('path',{d,stroke:c,'stroke-width':fx(w),fill:'none','stroke-linecap':'round'},g);
  if(DET>=1.5){if(d||!S.infl.join)E('path',{d,stroke:mix(c,'#ffffff',.35),'stroke-width':fx(w*.35),'stroke-opacity':.4,fill:'none',transform:`translate(${fx(-w*.2)},${fx(-w*.2)})`},g);
    const Bc=S.infl.bract;if(Bc&&peds.length){let db='';for(const[a]of peds.slice(0,3)){const P=sc(a),L=S.fD*Bc.L;db+=`M${fx(P[0])},${fx(P[1])}q${fx(L*.5)},${fx(-L*.2)} ${fx(L*.8)},${fx(L*.35)}q${fx(-L*.45)},${fx(L*.05)} ${fx(-L*.8)},${fx(-L*.35)}Z`}
      E('path',{d:db,fill:Bc.col,stroke:mix(Bc.col,'#000000',.35),'stroke-width':fx(w*.25),'stroke-opacity':.5},g)}}
  return g}
/* a thorn (flowering quince): a short stiff cone out of the wood. S.thorn (or T): p (chance of one beside a flowering spur), L (x the wood's width), col;
   measured thorns (T.mm): mm [min,max] its length in mm, bw its width at the foot (mm), ang [min,max] its angle to the axis toward the tip (radians:
   more than pi/2, pointing back down toward the cut), lit (its lit flank at close range), tip (the darker point), keep (with S.kinds: the share of the
   old drawing's thorn nodes kept: a nearly thornless cultivar). S.thorn may be a function of the colourway. */
function svbThornDir(o,og,T,r){const C=og.ci!=null&&o.chains[og.ci],n=C?C.pts.length:0;let t=[0,1,0];
  if(C&&n>1){const i=Math.min(n-1,og.ii||0),a=C.pts[Math.max(0,i-1)],b=C.pts[Math.min(n-1,i+1)];t=V3.nz(V3s(b,a))}
  let h=V3s(og.H,V3.sc(t,V3.dot(og.H,t)));if(V3l(h)<.1)h=og.U;h=V3.nz(h);const A=T.ang?r.in(T.ang[0],T.ang[1]):1.1;return V3.nz(V3.add(V3.sc(t,Math.cos(A)),V3.sc(h,Math.sin(A))))}
function svbThorn(par,pos,H,w,S,T,sd){T=T||S.thorn;const fx=n=>Math.round(n*10)/10,a=[pos[0],-pos[1]],h=[H[0],-H[1]],hl=Math.hypot(h[0],h[1])||1,u=[h[0]/hl,h[1]/hl],nn=[-u[1],u[0]];
  if(T.mm){const U=typeof UPC!=='undefined'?UPC:6.5,r=svRng(sd>>>0),L=(T.mm[0]+(T.mm[1]-T.mm[0])*r())/10*U*Math.max(.25,hl),bw=Math.min(w*(T.cap??.42),(T.bw||2)/20*U),cv=r.in(-.12,.12)*L,
      b0=[a[0]-u[0]*bw*.4,a[1]-u[1]*bw*.4],tp=[a[0]+u[0]*L+nn[0]*cv,a[1]+u[1]*L+nn[1]*cv],q=s=>[a[0]+u[0]*L*.42+nn[0]*(bw*(T.fat??.34)*s+cv*.3),a[1]+u[1]*L*.42+nn[1]*(bw*(T.fat??.34)*s+cv*.3)],
      e=s=>[b0[0]+nn[0]*bw*s,b0[1]+nn[1]*bw*s],P=(s0,s1)=>{const A0=e(s0),Q0=q(s0),Q1=q(s1),A1=e(s1);return`M${fx(A0[0])},${fx(A0[1])}Q${fx(Q0[0])},${fx(Q0[1])} ${fx(tp[0])},${fx(tp[1])}Q${fx(Q1[0])},${fx(Q1[1])} ${fx(A1[0])},${fx(A1[1])}Z`};
    const g=E('path',{d:P(1,-1),fill:T.col,stroke:mix(T.col,'#000000',.45),'stroke-width':fx(Math.max(.15,bw*.12)),'stroke-opacity':.7,'stroke-linejoin':'round'},par);
    if(DET>=1.5||L>9){const L2=[LIGHT[0],-LIGHT[1]],s=(nn[0]*L2[0]+nn[1]*L2[1])>=0?1:-1;E('path',{d:P(s,s*.15),fill:T.lit||mix(T.col,'#ffffff',.3),'fill-opacity':.75},par);
      if(T.tip&&DET>=1.5){const m=[a[0]+u[0]*L*.72+nn[0]*cv*.7,a[1]+u[1]*L*.72+nn[1]*cv*.7];E('path',{d:`M${fx(m[0])},${fx(m[1])}L${fx(tp[0])},${fx(tp[1])}`,stroke:T.tip,'stroke-width':fx(Math.max(.15,bw*.32)),'stroke-linecap':'round'},par)}}
    return g}
  const L=w*T.L*Math.max(.3,hl),bw=w*.35;
  return E('path',{d:`M${fx(a[0]+nn[0]*bw)},${fx(a[1]+nn[1]*bw)}Q${fx(a[0]+u[0]*L*.5+nn[0]*bw*.3)},${fx(a[1]+u[1]*L*.5+nn[1]*bw*.3)} ${fx(a[0]+u[0]*L)},${fx(a[1]+u[1]*L)}Q${fx(a[0]+u[0]*L*.5-nn[0]*bw*.3)},${fx(a[1]+u[1]*L*.5-nn[1]*bw*.3)} ${fx(a[0]-nn[0]*bw)},${fx(a[1]-nn[1]*bw)}Z`,fill:T.col,stroke:mix(T.col,'#000000',.4),'stroke-width':fx(w*.06)},par)}
/* the joined pedicels (S.infl.join): items [stalk point, calyx foot, flower axis, flower centre], each a curve from the stalk that arrives at the calyx
   foot along the flower's axis (straight when the axis points at the viewer or back up the pedicel); a lit edge at DET >= 1.5 */
function svbPedJ(par,items,S,cw){const fx=DET>=1.5?n=>Math.round(n*10)/10:Math.round,c=(S.cols&&S.cols(cw).ped)||'#7a8a3a',sc=p=>[p[0],-p[1]],w=Math.max(DET>=1.5?.35:.5,S.fD*(S.infl.pw||.018));let d='';
  for(const[a,f,ax]of items){const P=sc(a),Q=sc(f),dx=Q[0]-P[0],dy=Q[1]-P[1],l=Math.hypot(dx,dy)||1,u=[ax[0],-ax[1]],ul=Math.hypot(u[0],u[1]),ok=ul>.25&&(u[0]*dx+u[1]*dy)/ul/l>-.2,
      m=ok?[Q[0]-u[0]/ul*l*.4,Q[1]-u[1]/ul*l*.4]:[P[0]+dx*.4,P[1]+dy*.4];d+=`M${fx(P[0])},${fx(P[1])}Q${fx(m[0])},${fx(m[1])} ${fx(Q[0])},${fx(Q[1])}`}
  E('path',{d,stroke:c,'stroke-width':fx(w),fill:'none','stroke-linecap':'round'},par);
  if(DET>=1.5)E('path',{d,stroke:mix(c,'#ffffff',.35),'stroke-width':fx(w*.35),'stroke-opacity':.4,fill:'none',transform:`translate(${fx(-w*.2)},${fx(-w*.2)})`},par);return par}
/* a leaf in 3D on its petiole. S.leaf: L blade length [min,max] (x fD), W width (x L), pet petiole (x L), fold (half-angle of the fold on the midrib:
   young leaves conduplicate, opening as they grow), curl (the half-blade's own bend from midrib to margin: + a gutter, - margins rolled down), tw (twist
   along the blade), droop (the blade arching down under its weight), acu (0 elliptic tip .. 1 long acuminate tip), serr (teeth per side), tooth (their depth, x half-width), dbl
   (doubly serrate: every other tooth smaller), aris (bristle tip of the teeth, x tooth), green (age at which the young colour lf turns to lf2), two (at DET 1
   the shaded half is drawn on leaves longer than two x fD; two1: the same below DET 1.5), glands (on the top of the petiole), glC, stip (stipules, x L: narrow,
   fringed, falling early: drawn on young leaves only; stipF 'reni': kidney-shaped, toothed, persistent, at DET 1 only past stip0 units), petC; hang (0..1: a young blade turned down from its petiole, limp: cherry t203), Wy (a young
   blade narrower by that share), petW (petiole width x len, .022), sheen (the gloss streak's strength, 1), wk (how much wilting folds, curls and droops the blade, 1; .15 if open), und/undK (the underside's colour when young, mixed in: copper-pink under a bronze leaf), gloss (0..1: wider tones
   and a pale streak on the lit half at close range), vd (0..1: veins as dark grooves on a young pleated blade), quilt (0..1: bullate panels, sunken veins, glints), warp (a low twist of the surface), vMid/vEnd (the lateral veins' run toward the tip, .06/.13), ovB (0..1: a broad ovate blade, wide to 3/4 then a short tip), open (with the branch fading, the
   leaves go on growing: they unfold, spread and green by that share of the wilt instead of hanging and rolling). Each half-blade lit by its own normals (the upper face darker than the paler underside), its
   margin band lit apart (the curl reads as volume), midrib and lateral veins, teeth with bristle tips at close range; bronze when young, then green;
   in a fading branch the leaves hang, roll and dull toward olive-brown. At DET 1 one path (two for long leaves: the shaded half). */
const SVB_LWP=(t,acu=0)=>t<.4?Math.pow(Math.sin(t/.4*Math.PI/2),.65)*.97+.03:(x=>Math.pow(1-x,1.2+.6*acu)*(1+1.3*acu*x)*(1-.1*Math.sin(Math.PI*x)))((t-.4)/.6);
function svbLeaf(par,a,H0,len,S,cw,o){const Lf=S.leaf,r=svRng(o.seed>>>0),hi=DET>=1.5,fx=hi?n=>Math.round(n*10)/10:Math.round,g=par,cols=S.cols?S.cols(cw):{},wl=S._wl||0,age=Math.max((o.age||0)+(Lf.open??0)*wl,svbLifeAll()==='open'?(Lf.green??.9)+1:0),
    yc=cols.lf||'#7e6a2e',ac=cols.lf2||'#5a8a34';let col=mix(yc,ac,Math.min(1,Math.max(0,(age-(Lf.green??.9))*.8)));if(wl>(Lf.open?.75:.3))col=mix(col,'#9a8a4c',Math.min(Lf.open?.3:.6,(wl-(Lf.open?.75:.3))*.9));
  /* (LIFE_ALL 'open') a fresh leaf whatever its colourway's grown green: never olive, never dull */
  if(svbLifeAll()==='open'){const[h,sa,l]=h2l(col);col=l2h(h<82||h>300?82:h,Math.max(sa,.38),Math.max(.3,Math.min(.5,l)))}
  const pl=len*Lf.pet,yk=Math.max(0,1-age/(Lf.green??.9)),Xp=V3.nz(H0),hg=Math.min(1,(Lf.hang||0)*yk),th=Math.acos(Math.max(-1,Math.min(1,Xp[1]))),hz=Math.hypot(Xp[0],Xp[2]),hh=hz>.05?[Xp[0]/hz,0,Xp[2]/hz]:[1,0,0],
    t2=th<2.7?th+(2.7-th)*hg:th,X0=hg>0?[hh[0]*Math.sin(t2),Math.cos(t2),hh[2]*Math.sin(t2)]:Xp,acu=Lf.acu??.6,gl=Lf.gloss||0;
  let N=V3s([0,1,0],V3.sc(X0,X0[1]));if(V3l(N)<.15)N=V3s([0,0,1],V3.sc(X0,X0[2]));N=V3.nz(N);const S2=V3.cr(X0,N),rl=r.in(-.5,.5)+(Lf.face?Lf.face*Math.atan2(S2[2],N[2]):0),Nn=V3.nz(V3.add(V3.sc(N,Math.cos(rl)),V3.sc(S2,Math.sin(rl)))),Sd=V3.cr(X0,Nn);
  const wk=Lf.wk??(Lf.open?.15:1),fold=Math.min(1.35,Lf.fold*(1-.6*Math.min(1,age*.8))*(.8+.4*r())+.35*wl*wk),curl=(Lf.curl??.5)*(.7+.6*r())+.5*wl*wk,tw=(Lf.tw??.35)*r.in(-1,1),dr=Lf.droop*(.7+.6*r())+.35*wl*wk,
    wid=len*Lf.W*(1-(Lf.Wy||0)*yk),p=V3.add(a,V3.sc(hg>0?V3.nz(V3.add(Xp,X0)):Xp,pl)),down=[0,-1,0],wph=r()*6.28;
  const cAt=v=>V3.add(V3.add(p,V3.sc(X0,len*v*(1-dr*.35*v))),V3.sc(down,len*dr*v*v)),fr=v=>{const t2=tw*v;return[rotA(Sd,X0,t2),rotA(Nn,X0,t2)]},
    /* a point of the half-blade s at v along, f across (0 midrib .. 1 margin; f>1 a tooth's bristle) */
    at=(v,f,s)=>{const[sd,nn]=fr(v),w=wid*.5*(Lf.ovB&&v>.4?(1-Lf.ovB)*SVB_LWP(v,acu)+Lf.ovB*Math.pow(Math.max(0,1-Math.pow((v-.4)/.6,2.2)),.9)*(1+acu*.6*(v-.4)):SVB_LWP(v,acu)),th=curl,al=fold+th*Math.min(1,f),X=Math.abs(th)<1e-3?f*Math.cos(fold):(Math.sin(al)-Math.sin(fold))/th+Math.max(0,f-1)*Math.cos(al),
      Y=(Math.abs(th)<1e-3?f*Math.sin(fold):(Math.cos(fold)-Math.cos(al))/th+Math.max(0,f-1)*Math.sin(al))+.05*f*f*Math.sin(v*9+wph)*(1-.5*age)+(Lf.warp||0)*f*Math.sin(v*3.3+wph*1.7+(s>0?.9:0));
      return V3.add(V3.add(cAt(v),V3.sc(sd,s*w*X)),V3.sc(nn,w*Y))},
    nrmAt=(v,f,s)=>{const[sd,nn]=fr(v),al=fold+curl*f;return V3.nz(V3s(V3.sc(nn,Math.cos(al)),V3.sc(sd,s*Math.sin(al))))},
    P=pal7(col),Pu=pal7(mix(col,Lf.und?mix('#c8d0a8',Lf.und,yk):'#c8ccb0',Lf.undK??.42)),A=[a[0],-a[1]],Pp=[p[0],-p[1]],sp=q=>[q[0],-q[1]],pw=Math.max(.4,len*(Lf.petW||.022)),
    tone=(n,top)=>toneAt(top?P:Pu,(top?.3-.08*gl:.3)+(top?.62-.04*gl:.62)*Math.max(0,Math.min(1.1,lightI(top?n:V3.sc(n,-1))))),
    /* the margin of a half, base to tip: teeth leaning to the tip, every other one smaller, a bristle on each at close range */
    marg=(s,nT)=>{const M=[];for(let k=0;k<nT;k++){const v0=.02+.95*k/nT,dv=.95/nT;if(!hi||!Lf.serr){M.push(at(v0,1,s));continue}const big=Lf.dbl&&k%2?.55:1,dep=(Lf.tooth??.05)*big;
        M.push(at(v0,1-dep,s),at(v0+dv*.62,1,s));if(Lf.aris)M.push(at(v0+dv*.72,1+Lf.aris*dep,s))}M.push(at(.985,0,s));return M};
  /* the petiole, its glands at the top, the stipules at its foot (young leaves) */
  if(hi){E('path',{d:`M${fx(A[0])},${fx(A[1])}L${fx(Pp[0])},${fx(Pp[1])}`,stroke:Lf.petC,'stroke-width':fx(pw),'stroke-linecap':'round'},g);
    if(Lf.glands){let d='';const q0=V3.add(a,V3.sc(X0,pl*.82));for(let j=0;j<Lf.glands;j++){const q=sp(V3.add(q0,V3.sc(Sd,(j%2?1:-1)*pw*.55)));d+=`M${fx(q[0])},${fx(q[1])}h.01`}
      E('path',{d,stroke:Lf.glC||'#8a2a1e','stroke-width':fx(pw*1.5),'stroke-linecap':'round',fill:'none'},g)}
    if(Lf.stip&&!Lf.stipF&&age<.55&&wl<.3){let d='';const sl=len*Lf.stip*(1-age);for(const s of[-1,1]){const e1=sp(V3.add(V3.add(a,V3.sc(Sd,s*sl*.55)),V3.add(V3.sc(X0,sl*.6),V3.sc(down,sl*.3)))),m1=sp(V3.add(a,V3.sc(Sd,s*sl*.35)));
      d+=`M${fx(A[0])},${fx(A[1])}Q${fx(m1[0])},${fx(m1[1])} ${fx(e1[0])},${fx(e1[1])}`}E('path',{d,stroke:mix(col,'#9a4a30',.45),'stroke-width':fx(pw*.45),fill:'none','stroke-linecap':'round'},g)}}
  /* stipF 'reni': two kidney-shaped leafy stipules clasping the shoot at the foot of the petiole, toothed, persistent (flowering quince; stip x L) */
  if(Lf.stipF==='reni'&&Lf.stip){const sr=len*Lf.stip,ey=Xp,en=Nn;if(hi||sr>(Lf.stip0??1e9)){let d='';const nS=hi?16:7;
    for(const s of[-1,1]){const ex=V3.sc(Sd,s),c=V3.add(V3.add(a,V3.sc(ex,sr*.55)),V3.sc(ey,sr*.15)),Q=[];
      for(let j=0;j<=nS;j++){const ph=.6+(6.2832-1.2)*j/nS,k=hi&&j%2?(Lf.stipT??.92):1,q=V3.add(V3.add(V3.add(c,V3.sc(ex,-sr*.62*k*Math.cos(ph))),V3.sc(ey,sr*.45*k*Math.sin(ph))),V3.sc(en,sr*.2*Math.pow(Math.sin(ph/2),2)));Q.push(sp(q))}
      Q.push(sp(a));d+=svbPoly(Q,fx)}
    const ns=lightI(en),top=en[2]>=0,sf=toneAt(top?P:Pu,.34+.58*Math.max(0,Math.min(1.1,top?ns:lightI(V3.sc(en,-1)))));E('path',{d,fill:Lf.stipC?mix(sf,Lf.stipC,.55):sf,stroke:P.d2,'stroke-width':fx(Math.max(.15,sr*.05)),'stroke-opacity':.5,'stroke-linejoin':'round'},g)}}
  const nT=hi?Math.max(8,Lf.serr||12):6,mids=[];for(let i=0;i<=8;i++)mids.push(cAt(.985*i/8));
  const halves=[-1,1].map(s=>{const M=marg(s,nT),z=M.reduce((q,x)=>q+x[2],0)/M.length,n=nrmAt(.4,.35,s),top=n[2]>=0,n2=nrmAt(.45,.92,s);
    return{s,M,z,top,fill:tone(n,top),fill2:tone(n2,nrmAt(.45,.92,s)[2]>=0),n2}});
  if(!hi){const[h0,h1]=halves,tn=h0.top?h0:h1,pts=[A].concat(h0.M.map(sp),h1.M.map(sp).reverse());E('path',{d:svbPoly(pts,fx),fill:tn.fill},g);
    if(len>S.fD*((DET<1.5?Lf.two1:null)??Lf.two??.7)){const sh=h0.z<h1.z?h0:h1;E('path',{d:svbPoly(mids.map(sp).concat(sh.M.map(sp).reverse()),fx),fill:sh.top?toneAt(P,.3):toneAt(Pu,.45),'fill-opacity':.55},g)}
    return g}
  halves.sort((u,v)=>u.z-v.z);
  for(const h of halves){const out=mids.map(sp).concat(h.M.map(sp).reverse());E('path',{d:svbPoly(out,fx),fill:h.fill,stroke:P.d2,'stroke-width':fx(Math.max(.15,len*.008)),'stroke-opacity':.45,'stroke-linejoin':'round'},g);
    /* the margin band, lit by its own normal: the curl of the half-blade */
    if(h.fill2!==h.fill){const inr=[];for(let i=0;i<=8;i++)inr.push(sp(at(.02+.95*i/8,.55,h.s)));E('path',{d:svbPoly(inr.concat(h.M.map(sp).reverse()),fx),fill:h.fill2,'fill-opacity':.6},g)}
    /* its lateral veins, curving to the margin: paler on the face, raised below */
    const vM=Lf.vMid??.06,vE=Lf.vEnd??.13;let d='';for(let j=1;j<=8;j++){const v=j/9.5,q0=sp(cAt(v)),q1=sp(at(v+vM,.5,h.s)),q2=sp(at(v+vE,.88,h.s));d+=`M${fx(q0[0])},${fx(q0[1])}Q${fx(q1[0])},${fx(q1[1])} ${fx(q2[0])},${fx(q2[1])}`}
    const vd=(Lf.vd||0)*(.4+.6*yk);E('path',{d,stroke:h.top?(vd>.2?P.d2:P.l1):Pu.l2,'stroke-width':fx(Math.max(.12,len*.006*(1+.5*vd))),fill:'none','stroke-opacity':h.top?(.35+.25*vd)*(Lf.vO??1):.5},g);
    /* quilt (0..1): a bullate blade (hydrangea 99, 115): sunken veins (a dark groove and the lit ridge of the puffed panel beyond it), each
       intercostal panel puffed (a pale lens on the face, fainter below) and, on the lit half of a glossy blade, a small bright glint */
    if(Lf.quilt&&hi){const qk=Lf.quilt,dv=1/9.5,li=Math.max(0,Math.min(1,lightI(h.top?nrmAt(.45,.5,h.s):V3.sc(nrmAt(.45,.5,h.s),-1))));let dl='',dg='',dr='';
      for(let j=1;j<=8;j++){const v=j/9.5,q0=sp(cAt(v+.012)),q1=sp(at(v+vM+.012,.5,h.s)),q2=sp(at(v+vE+.012,.86,h.s));dr+=`M${fx(q0[0])},${fx(q0[1])}Q${fx(q1[0])},${fx(q1[1])} ${fx(q2[0])},${fx(q2[1])}`;
        if(j>7)continue;const U=[],D=[],GU=[],GD=[];
        for(let i=0;i<=6;i++){const f=.12+.68*i/6,vc=v+dv*.52+vE*1.1*f*f,hw=dv*.34*Math.sin(Math.PI*i/6)*(1-.35*f);U.push(sp(at(vc+hw,f,h.s)));D.push(sp(at(vc-hw*.55,f,h.s)));
          const f2=.22+.3*i/6,hw2=dv*.13*Math.sin(Math.PI*i/6);GU.push(sp(at(v+dv*.62+vE*1.1*f2*f2+hw2,f2,h.s)));GD.push(sp(at(v+dv*.62+vE*1.1*f2*f2-hw2*.5,f2,h.s)))}
        dl+=svbPoly(U.concat(D.reverse()),fx);if(j%2===(h.s>0?1:0))dg+=svbPoly(GU.concat(GD.reverse()),fx)}
      E('path',{d:dl,fill:h.top?P.l1:Pu.l2,'fill-opacity':svF((h.top?.16+.3*li:.1)*qk)},g);
      E('path',{d:dr,stroke:h.top?P.l1:Pu.l2,'stroke-width':fx(Math.max(.15,len*.007)),fill:'none','stroke-opacity':svF((h.top?.25+.35*li:.2)*qk)},g);
      E('path',{d,stroke:h.top?P.ink:P.d1,'stroke-width':fx(Math.max(.15,len*.007)),fill:'none','stroke-opacity':svF((h.top?.28:.18)*qk)},g);
      if(gl&&h.top&&li>.25&&dg)E('path',{d:dg,fill:'#f2f7e6','fill-opacity':svF(.55*gl*qk*li)},g)}
    /* the sheen of a glossy young blade: a pale streak along the lit half, between the midrib and the margin */
    if(gl&&h.top&&h===halves[1]){let e='';for(let i=0;i<=6;i++){const q=sp(at(.1+.7*i/6,.3+.1*Math.sin(i),h.s));e+=(i?'L':'M')+fx(q[0])+','+fx(q[1])}
      E('path',{d:e,stroke:'#fff4ea','stroke-width':fx(Math.max(.2,len*.035)),'stroke-opacity':.45*gl*(Lf.sheen??1),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)}}
  /* the midrib */
  let d='';mids.forEach((q,i)=>{d+=(i?'L':'M')+fx(q[0])+','+fx(-q[1])});const tp=halves[1].top;
  /* (a young bronze blade: the midrib a pale line, t203) */
  E('path',{d,stroke:tp?(Lf.vd&&yk>.3?mix(col,'#f4e2d4',.7):P.l1):Pu.l2,'stroke-width':fx(Math.max(.15,len*.011)),fill:'none','stroke-opacity':tp?(.45+.25*yk*(Lf.vd||0))*(Lf.vO??1):.6},g);
  return g}
const svbPoly=(P,fx)=>svbD(P,fx||(n=>Math.round(n*10)/10));
/* a polygon turned counter-clockwise on the screen (two outlines in one path then add up under the nonzero rule) */
/* is (x,y) inside the polygon P (even-odd) */
function svbIn(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function svblOri(P){let s=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];s+=p[0]*q[1]-q[0]*p[1]}return s<0?P.slice().reverse():P}
/* the generic hook: wraps the plant function GH[sid] of the old drawing. With SVG on, the old drawing still runs (the bouquet's chance is consumed exactly
   as before) but draws into nothing: only its group k is real (it keeps its animation); its skeleton (b29Grow) is caught and the branch is drawn in SVG */
function svBranchWrap(sid,S,opt){if(typeof GH==='undefined'||!GH[sid]||GH[sid]._sv)return;const old=GH[sid];
  const fn=function(g,t,o){if(!SV_ON)return old(g,t,o);let cap=null;const g0=b29Grow,E0=E,sink={setAttribute(){},removeAttribute(){},appendChild(){},style:{}};
    b29Grow=function(){return cap=g0.apply(this,arguments)};E=function(t2,a,p){return p===g?E0(t2,a,p):sink};let res;
    try{res=old(g,t,o)}finally{b29Grow=g0;E=E0}
    if(!cap||!res||!res.k||res.k===sink)return res;const q=opt.prep(o,cap);S._wl=q.wl;
    svBranch(res.k,S,Object.assign({chains:cap.chains,organs:cap.organs,spine:!!o.spine},q));return res};
  fn._sv=1;fn._old=old;GH[sid]=fn}
