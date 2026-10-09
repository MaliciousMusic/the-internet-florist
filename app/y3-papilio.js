/* ================= Pièce papilionacée (y3-papilio.js) : la fleur en papillon des Fabacées et sa grappe lâche =================
   Generic for the pea family (Lathyrus, Pisum, Vicia, Lupinus, Wisteria...). A floret: the standard (vexillum), broad, folded over the rest in the bud,
   then rising, unfolding and reflexed; two wings (alae) cupped round the keel; the keel (carina, two petals fused in a boat holding the stamens);
   a green calyx (a short tube, five teeth); a pedicel. A loose raceme of 2 to n florets on a long peduncle, staged from the foot (open) to the tip
   (buds). Each petal is an svSheet built by svPapPetal: a midrib bending out of its plane and within it, a blade with a fold along the midrib,
   a cup, hooded or rolled margins, Spencer frills, the decline's crumple; all ordered and patched together by svDraw.
   Floret frame: x right, y up (the standard's side), z forward (its face); origin at the calyx mouth; sizes x R0 = half the standard's width.
   The sort sheet (y-lathyrus.js) gives genes, materials and the numbers measured on its photographs; SVP_DEF holds the generic defaults. */
/* a smooth profile through [[v,value]...] */
function svPapProf(P){return v=>{v=Math.max(0,Math.min(1,v));let i=1;while(i<P.length-1&&P[i][0]<v)i++;const a=P[i-1],b=P[i],t=(v-a[0])/((b[0]-a[0])||1);
  return a[1]+(b[1]-a[1])*t*t*(3-2*t)}}
const svPapLerp=(a,b,t)=>a+(b-a)*t;
/* ---------- one petal: its surface S(u,v), u -1..1 across, v 0 (claw) .. 1 (tip) ----------
   P0 foot, d0 first direction, A0 width axis (u>0 side); the inner face is d x A. The midrib turns about A by a(v)=a0+(a1-a0)v^aPow (positive: toward
   the outer face, a standard reflexing), about the face normal by s1 over its length (a sickle in its own plane), about itself by tw (twist);
   limp bends it toward dn (local down) at the end. The blade: half width W/2*wp(v), top rounded (superellipse tip) and notched; fold (the two halves
   turned toward the inner face, radians: a folded bud standard ~1.4), cup (u^2), hood (margins curling in), rev (margins rolled back),
   ruf/rufN/rufPh (frills round the margin), crk/crkPh (crumple of the decline), wv/wk/wph (a slow wave along the margins), asym. */
const SVPP_DEF={L:1,W:.6,wp:[[0,.2],[.3,.8],[.65,1],[1,.6]],tip:2,notch:0,vb:.7,P0:[0,0,0],d0:[0,0,1],A0:[1,0,0],a0:0,a1:0,aPow:1,s1:0,tw:0,
  fold:0,cup:0,hood:0,rev:0,ruf:0,rufN:7,rufPh:0,rufC:.38,crk:0,crkPh:0,wv:0,wk:2,wph:0,limp:0,dn:[0,-1,0],asym:0};
function svPapPetal(o0){const o=Object.assign({},SVPP_DEF,o0),ns=18,sp=[],Dv=[],Av=[],Mv=[],hp=svPapProf(o.wp),ang=v=>o.a0+(o.a1-o.a0)*Math.pow(v,o.aPow);
  let d=V3.nz(o.d0),A=V3.nz(V3s(o.A0,V3.sc(d,V3.dot(o.A0,d)))),c=o.P0.slice();d=rotA(d,A,o.a0);
  const dn=V3.nz(o.dn);
  for(let j=0;j<=ns;j++){const v=j/ns;
    if(j){const da=ang(v)-ang((j-1)/ns);d=rotA(d,A,da);const m0=V3.cr(d,A);if(o.s1){const ds=o.s1/ns;d=rotA(d,m0,ds);A=rotA(A,m0,ds)}if(o.tw){const dt=o.tw/ns;A=rotA(A,d,dt)}
      A=V3.nz(V3s(A,V3.sc(d,V3.dot(A,d))))}
    /* a limp petal gives way toward the ground, more toward its tip */
    let du=d,Au=A;if(o.limp>0){const hk=Math.min(.92,o.limp*Math.pow(v,.6)),cs=Math.max(-1,Math.min(1,V3.dot(d,dn))),an=Math.acos(cs);
      if(an>1e-3){const s0=Math.sin(an);du=V3.nz(V3.add(V3.sc(d,Math.sin((1-hk)*an)/s0),V3.sc(dn,Math.sin(hk*an)/s0)));Au=V3s(A,V3.sc(du,V3.dot(A,du)));Au=V3l(Au)>1e-4?V3.nz(Au):A}}
    if(j)c=V3.add(c,V3.sc(du,o.L/ns));sp.push(c);Dv.push(du);Av.push(Au);Mv.push(V3.cr(du,Au))}
  const at=(X,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f=x-j;return V3.add(V3.sc(X[j],1-f),V3.sc(X[j+1],f))},
    Lu=u=>o.vb+(1-o.vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),o.tip)),1/o.tip)-o.notch*Math.exp(-u*u/.012),cf=Math.cos(o.fold),sf=Math.sin(o.fold),Wm=o.W/2;
  return(u,v)=>{const vv=Math.max(0,Math.min(1,v*Lu(u))),c2=at(sp,vv),A2=V3.nz(at(Av,vv)),m2=V3.nz(at(Mv,vv)),au=Math.abs(u),
      hw=Wm*hp(vv)*(1+o.asym*Math.sign(u)),x=au*hw,cy=(vv-o.rufC)/(1-o.rufC),r=Math.hypot(u,cy),th=Math.atan2(cy,u),
      ruf=o.ruf?o.ruf*Wm*svSm((r-.5)/.5)*Math.sin(o.rufN*th+o.rufPh+.8*Math.sin(2.3*th+o.rufPh)):0,
      crk=o.crk?o.crk*hw*(.6*Math.sin(u*8.2+o.crkPh+vv*6.3)+.4*Math.sin(u*3.1-vv*9+2*o.crkPh))*svSm(vv/.2):0,
      wv=o.wv?o.wv*hw*Math.pow(au,1.5)*Math.sin(o.wk*Math.PI*vv+o.wph+u*.8)*svSm(vv/.3):0,
      y=x*sf+o.cup*u*u*hw+o.hood*hw*au*au*au*svSm((vv-.2)/.5)-o.rev*hw*au*au*au*au+ruf+crk+wv;
    return V3.add(V3.add(c2,V3.sc(A2,Math.sign(u)*x*cf)),V3.sc(m2,y))}}
/* ---------- thin round organs (pedicels, rachis, the pod's beak): a lit band in two or three paths, hairs on its silhouette ----------
   C screen points, W widths, c=[shade, body, light, hair|null] */
function svPapThin(par,C,W,c,o={}){const n=C.length,g=G(par);if(n<2)return g;const N=[],T=[];
  for(let i=0;i<n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;T.push([dx/l,dy/l]);N.push([-dy/l,dx/l])}
  const lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1]),kk=N.map(q=>(q[0]*lt[0]+q[1]*lt[1])/ll>0?1:-1),out=[],li=[];
  for(let i=0;i<n;i++)out.push([C[i][0]+N[i][0]*W[i]/2,C[i][1]+N[i][1]*W[i]/2]);for(let i=n-1;i>=0;i--)out.push([C[i][0]-N[i][0]*W[i]/2,C[i][1]-N[i][1]*W[i]/2]);
  E('path',{d:svSpl(out),fill:c[1]},g);if(LOD)return g;
  for(let i=0;i<n;i++){const s=kk[i]*W[i]*.2;li.push([C[i][0]+N[i][0]*s,C[i][1]+N[i][1]*s])}
  const wm=W.reduce((a,b)=>a+b,0)/n;E('path',{d:svSpl(li,false),fill:'none',stroke:c[2],'stroke-width':svF(Math.max(.15,wm*.32)),'stroke-opacity':.7,'stroke-linecap':'round'},g);
  if(o.dark!==false){const sh=[];for(let i=0;i<n;i++){const s=-kk[i]*W[i]*.36;sh.push([C[i][0]+N[i][0]*s,C[i][1]+N[i][1]*s])}
    E('path',{d:svSpl(sh,false),fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.12,wm*.26)),'stroke-opacity':.55,'stroke-linecap':'round'},g)}
  /* fine hairs standing out of the silhouette, leaning toward the end (Lathyrus: pedicels and peduncles finely pubescent) */
  if(c[3]&&DET>=1&&wm>.35){let d='',k=0,acc=0;const step=Math.max(wm*1.1*(o.hs||1),.6);for(let i=1;i<n;i++){acc+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);while(acc>=step){acc-=step;k++;
      const s=pxHashS(k,3,n)<.5?1:-1,h=wm*(.35+.35*pxHashS(k,5,n)),q=[C[i][0]+N[i][0]*W[i]/2*s,C[i][1]+N[i][1]*W[i]/2*s],a=.5+.4*pxHashS(k,7,n);
      d+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR((N[i][0]*s*a+T[i][0])*h),svR((N[i][1]*s*a+T[i][1])*h)])}}
    if(d)E('path',{d,fill:'none',stroke:c[3],'stroke-width':svF(Math.max(.05,wm*.07)),'stroke-opacity':.45,'stroke-linecap':'round'},g)}
  return g}
/* a tube along a 3D centre line (local points of the frame B at O), as a proxy sheet for svDraw's order (pedicels, rachis, calyx, pod) */
function svPapTube(B,O,Pts,r0,r1,o={}){const n=Pts.length-1,at=v=>{const x=Math.max(0,Math.min(1,v))*n,j=Math.min(n-1,Math.floor(x)),f=x-j;return V3.add(V3.sc(Pts[j],1-f),V3.sc(Pts[j+1],f))};
  return svSheet(B,O,(u,v)=>{const p=at(v),t=V3.nz(V3s(at(Math.min(1,v+.02)),at(Math.max(0,v-.02)))),e1=V3.nz(Math.abs(t[1])<.9?V3.cr(t,[0,1,0]):V3.cr(t,[1,0,0])),e2=V3.cr(t,e1),
    a=u*Math.PI,r=r0+(r1-r0)*v;return V3.add(p,V3.add(V3.sc(e1,Math.cos(a)*r),V3.sc(e2,Math.sin(a)*r)))},{nu:o.nu||4,nv:o.nv||Math.max(2,Math.min(8,n)),mat:o.mat||{}})}
/* the screen points of local points */
const svPapScr=(B,O,P)=>P.map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]});
/* a cubic through 4 local points, m+1 samples */
function svPapBez(P,m){const out=[];for(let i=0;i<=m;i++){const t=i/m,u=1-t;out.push([0,1,2].map(j=>u*u*u*P[0][j]+3*u*u*t*P[1][j]+3*u*t*t*P[2][j]+t*t*t*P[3][j]))}return out}
/* ---------- the generic defaults (x R0 of the floret; angles in radians; [bud, open] pairs are blended by the unfolding o2) ---------- */
const SVP_DEF={
  /* life of one floret: growth of the bud (size [at op 0, from, over]), unfolding of the standard, full reflex; decline and faded */
  grow:[.4,.02,.5],unf:[.3,.45],full:[.7,.3],dec:[.12,.35],fan:[.5,.3],green:[.55,.04,.24],greenC:'#7f9a52',greenTip:.7,
  /* the standard: length, width, outline, top, notch; its claw's foot; its midrib [bud, open] at the foot and the tip; fold, cup, hood, frills */
  sL:1.62,sW:2,swp:[[0,.1],[.08,.2],[.18,.5],[.32,.8],[.5,.96],[.7,1],[.88,.92],[1,.7]],swpB:[[0,.3],[.08,.5],[.18,.7],[.32,.88],[.5,.98],[.7,1],[.88,.86],[1,.55]],sTip:2.2,sTipB:2.8,sNotch:.07,sVb:.72,sP0:[0,.03,-.04],
  sA0:[.45,.95],sA1:[-.6,1.7],sPow:.8,sRefl:.15,sFold:[1.35,.3],sCup:[.05,.12],sHood:[.05,.35],sRuf:[.01,.05],sRufN:7,sWv:[.01,.03],
  /* the wings: length, width, outline; first direction [bud, open] (x signed by side); bend out of plane [bud, open] at the tip; sickle; fold, cup */
  wL:1.15,wW:1,wwp:[[0,.25],[.1,.45],[.3,.85],[.6,1],[.85,.9],[1,.6]],wTip:3.2,wVb:.65,wP0:[.06,.1,.06],
  wD0:[[.12,-.15,1],[.46,-.64,.46]],wN0:[[.9,.3,.1],[.5,.1,.86]],wA1:[-.35,.08],wS1:[.15,.4],wFold:[.4,.3],wCup:[.45,.32],wEm:[.26,.3],
  /* the keel: a boat (two halves folded up), its tip curving up into a beak */
  kL:.95,kW:.42,kwp:[[0,.4],[.3,.85],[.6,1],[.85,.8],[1,.3]],kTip:1.6,kVb:.8,kP0:[0,-.08,0],kD0:[0,-.5,.86],kA1:-1.2,kFold:1.25,
  /* the calyx: tube length, radius at its foot and mouth, teeth [upper, lower] length and half width at their foot, their spread [bud, open] */
  cL:.3,cR:[.1,.15],tL:[.28,.4],tW:.06,tSp:[[.18,.12],[.36,.26]],cGrow:[.62,.38],
  /* the decline and the faded floret: the standard falls forward over the wings and crumples, the wings hang, the young pod comes out of the keel */
  dA1:[.35,.4],dFold:.35,dCrk:[.12,.5],dRev:[.2,.45],dShrink:[.32,.6],wLimp:[.5,.8],pod:[.4,2.4,.13],
  /* the raceme: floret stages from the foot to the tip; nodding [bud, open, faded] */
  stage:[1.1,.04,.6],wstage:[1.15,.06,.3],nod:[1.15,.12,.4],
  /* the florets' turn out of the face [mean, spread x the tilt gene] (rad), the pedicels' rise above the horizontal; widths (x D) of the rachis
     [foot, tip] and of a pedicel [rachis, calyx] (591, 206: peduncle and rachis .07 to .1 D, pedicels about half of it) */
  az:[.82,.2],pedE:.6,rW:[.072,.045],pW:[.04,.03],
  /* the look: edge browning, translucency, liseré, washes, veins; patch threshold */
  edge:{light:'#c9b08a',red:'#6a2a3a',other:'#8a6a7a',a:[.2,.45]},trans:[.3,.22],rim:[.006,.01,.25,.2],veinN:[18,9],pmin:5,
  light:Object.assign({},SVB_DEF.light,{ks:.12,gloss:18,darkLo:[.84,.66],litLo:[1.12],daLo:.24})};
/* a floret's material for one petal zone Z ({st,bst,shade,lite,bshade,blite,rim,vein,bvein,cast}) */
function svPapM(P,Z,o){const{sh,shv,dec,lod,vn,mot,band,fl}=o,light=h2l(Z.st[Math.min(2,Z.st.length-1)][1])[2]>.8,
    /* fewer stops away from the full detail (each stop is an element) */
    trim=(a,k)=>k>=a.length?a:k===2?[a[0],a[a.length-1]]:[a[0],a[Math.floor(a.length/2)],a[a.length-1]],Zs=lod>=2&&DET>=1.5?Z.st:trim(Z.st,lod>=2||lod&&DET>=1.5?3:2),Zb=lod>=2&&DET>=1.5?Z.bst:trim(Z.bst,2),
    st=Zs.map(([v,c],i)=>[v,i>=Zs.length-2&&dec>0?mix(shv(c,v),light?P.edge.light:P.edge.other,P.edge.a[i===Zs.length-1?1:0]*dec):shv(c,v)]),
    m=Object.assign({},P.light,{stops:st,bstops:Zb.map(([v,c])=>[v,shv(c,v)]),shade:sh(Z.shade),lite:Z.lite,bshade:sh(Z.bshade),blite:Z.blite,
      rim:dec>0?mix(Z.rim,light?'#b08a58':'#ffffff',.6*dec):Z.rim,cast:Z.cast,trans:P.trans[0]+P.trans[1]*dec,
      rw:lod>=1?P.rim[0]+P.rim[1]*dec:0,ro:P.rim[2]+P.rim[3]*dec});
  const hi=DET>=1.5;if(lod<2){m.darkLo=lod&&hi?[.8]:[];m.litLo=[];m.dark=lod?(hi?[.86,.7,.56]:[.84,.62]):[.8];m.lit=lod?[1.1]:[];if(!hi)m.rw=0}
  else if(!hi){m.darkLo=[.8];m.litLo=[];m.dark=[.86,.68];m.lit=[1.1];m.rw=0}
  if(vn&&hi){const vc=sh(Z.vein),bv=Z.bvein,stri=mot&&mot.k==='stries'?mot:null;
    m.veins=(s2,front)=>{const L=front?(hi?[[vn.main,.0026,vc,.26+.2*dec],[vn.fine,.0017,vc,.17+.15*dec]]:[[vn.main,.0026,vc,.3+.2*dec]]):hi?[[vn.main,.0022,bv,.16]]:[];
      if(stri&&front)L.push([vn.main,stri.w||.006,sh(stri.c),stri.op||.8]);else if(stri)L.push([vn.main,(stri.w||.006)*.8,sh(stri.c),(stri.op||.8)*.6]);return L}}
  if(band)m.band=band;if(fl)m.flames=fl;return m}
/* the streaks of a flamed or marbled colourway on one petal, in (u,v) (r: the petal's own chance) */
function svPapFlames(r,mot,sh){const n=Math.round(r.in(mot.n[0],mot.n[1])),L=[];for(let q=0;q<n;q++){const u0=r.in(-.85,.85),v0=r.in(.04,.35)*(mot.k==='marbre'?2:1),v1=Math.min(1,v0+r.in(.3,.8)),pl=[],ph=r.in(0,6.3);
    for(let s=0;s<=9;s++){const v=v0+(v1-v0)*s/9;pl.push([Math.max(-.95,Math.min(.95,u0*(.35+.65*svSm(v/.5))+.05*Math.sin(v*9+ph))),v])}L.push([pl,(mot.w||.03)*r.in(.5,1.5)])}
  return{c:sh(mot.c),op:mot.op||.85,list:L,side:0}}
/* ---------- the calyx: a short green tube, five teeth (two upper ones short, against the standard's back; three lower ones longer), fine hairs ----------
   drawn freely (two or three paths) after its proxy tube's place in the order */
function svPapCalyx(par,B,O,R0,c,o){const{gw,sp0,sp1,lod}=o,g=G(par),P=svPapScr,tube=[],teeth=[],mid=[];
  const cL=R0*c.L*gw,r0=R0*c.r0*gw,r1=R0*c.r1*gw,ring=(z,r,a)=>[Math.cos(a)*r,-.02*R0+Math.sin(a)*r*.92,z];
  for(let k=0;k<=16;k++){const a=k/16*6.2832;tube.push(ring(-cL,r0,a))}for(let k=16;k>=0;k--){const a=k/16*6.2832;tube.push(ring(0,r1,a))}
  const sc=P(B,O,tube),hull=hull2(sc),AN=[Math.PI/2-.68,Math.PI/2+.68,Math.PI*1.5-1.2,Math.PI*1.5,Math.PI*1.5+1.2];let dT='',dM='';
  for(let k=0;k<5;k++){const up=k<2,a=AN[k],rad=[Math.cos(a),Math.sin(a)*.92,0],sp=up?sp0:sp1,L=R0*(up?c.tL[0]:c.tL[1])*gw*o.tk[k],dir=V3.nz(V3.add(V3.sc([0,0,1],Math.cos(sp)),V3.sc(rad,Math.sin(sp)))),
      tg=V3.nz(V3.cr(dir,rad)),base=ring(0,r1*.94,a),w=R0*c.tW*gw,bend=V3.sc(rad,L*.18*Math.sin(sp)),
      pts=[V3.add(base,V3.sc(tg,w)),V3.add(V3.add(base,V3.sc(dir,L*.45)),V3.add(V3.sc(tg,w*.62),V3.sc(bend,.3))),V3.add(V3.add(base,V3.sc(dir,L)),bend),V3.add(V3.add(base,V3.sc(dir,L*.45)),V3.add(V3.sc(tg,-w*.62),V3.sc(bend,.3))),V3.add(base,V3.sc(tg,-w))];
    const s=P(B,O,pts);dT+=svSpl(s,true);if(lod>=1){const m2=P(B,O,[base,V3.add(V3.add(base,V3.sc(dir,L*.8)),V3.sc(bend,.8))]);dM+='M'+svJ([svR(m2[0][0]),svR(m2[0][1])])+'L'+svJ([svR(m2[1][0]),svR(m2[1][1])])}}
  /* the tube lit from one side: a gradient across it */
  const ax=P(B,O,[[0,0,-cL],[0,0,0]]),nx=-(ax[1][1]-ax[0][1]),ny=ax[1][0]-ax[0][0],nl=Math.hypot(nx,ny)||1,cx=(ax[0][0]+ax[1][0])/2,cy=(ax[0][1]+ax[1][1])/2,rr=Math.max(r1,1),
    sgn=(nx*LIGHT[0]-ny*LIGHT[1])>0?1:-1,lit=lod>=2||lod>=1&&DET>=1.5;let id='';
  /* (relais 4, weight) below the full detail the small calyx is filled flat, its volume left to the teeth's midribs */
  if(lit){id='cg'+(gid++);const gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(cx-sgn*nx/nl*rr),y1:svF(cy-sgn*ny/nl*rr),x2:svF(cx+sgn*nx/nl*rr),y2:svF(cy+sgn*ny/nl*rr)},GDEF||defs);stops(gr,[[0,c.dk],[.55,c.c],[1,c.lt]])}
  E('path',{d:svSpl(hull,true)+dT,fill:lit?`url(#${id})`:c.c},g);
  if(dM)E('path',{d:dM,fill:'none',stroke:c.dk,'stroke-width':svF(Math.max(.1,R0*.012)),'stroke-opacity':.5,'stroke-linecap':'round'},g);
  /* the hairs on the teeth and the tube (Lathyrus odoratus: calyx pubescent, photographs 497, 496) */
  if(lod>=2&&DET>=1&&R0>4){let d='';for(let k=0;k<14;k++){const a=pxHashS(k,11,o.sd)*6.2832,z=-cL*pxHashS(k,13,o.sd),p=ring(z,(r0+(r1-r0)*(1+z/cL))*1.02,a),q=V3.add(p,[Math.cos(a)*R0*.05,Math.sin(a)*R0*.05,R0*.03]),s=P(B,O,[p,q]);
      d+='M'+svJ([svR(s[0][0]),svR(s[0][1])])+'L'+svJ([svR(s[1][0]),svR(s[1][1])])}E('path',{d,fill:'none',stroke:c.hair,'stroke-width':svF(Math.max(.05,R0*.008)),'stroke-opacity':.55},g)}
  return g}
/* ---------- one floret, its pieces pushed to the raceme's list ----------
   B, O: its frame and calyx mouth (view space); D its standard's width; g its genes (dS sW sL ruf rufPh rufN fold hood wsp asym crk tk sd), hg the
   raceme's (dh ds dl), M the colourway's zones {std,win,kee,cal,pod,mot}; op, wl its own stage; lod 2 full .. 0 small bud */
function svPapFloret(pieces,B,O,D,P,g,hg,M,op,wl,lod){const R0=D/2,L=svPapLerp,gr=P.grow[0]+(1-P.grow[0])*svSm((op-P.grow[1])/P.grow[2]),R=R0*gr,
    o2=svSm((op-P.unf[0])/P.unf[1]),o3=svSm((op-P.full[0])/P.full[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),
    gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),sh=c=>{const x=svShift(c,hg.dh,hg.ds,hg.dl);return gt>0?mix(x,P.greenC,gt*.5):x},
    shv=(c,v)=>{const x=svShift(c,hg.dh,hg.ds,hg.dl),k=gt*(1-P.greenTip*v);return k>0?mix(x,P.greenC,k):x},
    dnL=[-B[0][1],-B[1][1],-B[2][1]],r=svRng(g.sd),mot=M.mot,on=z=>mot&&(!mot.on||mot.on.includes(z)),hi=DET>=1.5,
    band=z=>on(z)&&mot.k==='lisere'?{c:sh(mot.c),w:mot.w||.012,v0:mot.v0??.25,op:mot.op??.9,bk:.7}:null,
    flames=(z,rr)=>on(z)&&(mot.k==='flamme'||mot.k==='marbre')?svPapFlames(rr,mot,sh):null,
    nu=k=>Math.max(4,Math.round(k*(lod>=2?(hi?1.25:1):lod?(hi?.8:.72):.6))),mo={sh,shv,dec,lod,mot};
  /* the standard: folded over the rest in the bud (its dorsal midrib curving forward and down), rising and unfolding, upright and reflexed once open;
     in the decline it falls forward over the wings and crumples, its margins rolling back */
  const sA0=L(P.sA0[0],P.sA0[1],o2)-.3*fan,sA1=L(P.sA1[0],P.sA1[1],o2)+P.sRefl*o3-P.dA1[0]*dec-P.dA1[1]*fan,
    std=svPapPetal({L:R*P.sL*g.sL*(1-P.dShrink[0]*fan),W:R*P.sW*g.sW*(1-P.dShrink[1]*fan),wp:P.swp.map(([v,x],i)=>[v,L(P.swpB[i][1],x,o2)]),tip:L(P.sTipB,P.sTip,o2),notch:P.sNotch*(.4+.6*o2),vb:P.sVb,
      P0:V3.sc(P.sP0,R),d0:[0,0,1],A0:[-1,0,0],a0:sA0,a1:sA1,aPow:P.sPow,fold:L(P.sFold[0],P.sFold[1]*g.fold,o2)+P.dFold*fan,cup:L(P.sCup[0],P.sCup[1],o2),
      hood:L(P.sHood[0],P.sHood[1],o2)*g.hood*(1-.5*o3),rev:P.dRev[0]*dec+P.dRev[1]*fan,ruf:L(P.sRuf[0],P.sRuf[1],o2)*g.ruf*(1+.6*dec),rufN:g.rufN,rufPh:g.rufPh,
      crk:P.dCrk[0]*dec+P.dCrk[1]*fan,crkPh:g.crk,wv:L(P.sWv[0],P.sWv[1],o2),wph:g.rufPh*.7,asym:g.asym+.12*fan,tw:.9*fan*(g.asym>0?1:-1),limp:.7*fan,dn:dnL}),
    vnS=lod>=1||hi?svVeins(r,(hi?P.veinN[0]:P.veinN[1])+r.in(0,3),hi?.35:0,hi?.7:.3):null;
  pieces.push(svSheet(B,O,std,{nu:nu(10),nv:nu(12),mat:svPapM(P,M.std,Object.assign({vn:vnS,band:band('std'),fl:flames('std',svRng(g.sd+13))},mo)),
    ao:(u,v,front)=>front?1-.42*(1-svSm((v-.02)/.32)):1-.22*(1-svSm(v/.3)),zb:0}));
  /* the wings and the keel come out of the opening standard: cupped round the keel, spreading down and out; the keel a pale boat with its beak up */
  const em=svSm((op-P.wEm[0])/P.wEm[1]);
  if(em>.02){const wd=V3.add(V3.sc(P.wD0[0],1-o2),V3.sc(P.wD0[1],o2)),wn=V3.add(V3.sc(P.wN0[0],1-o2),V3.sc(P.wN0[1],o2));
    for(const s of[-1,1]){const S=svPapPetal({L:R*P.wL*(.55+.45*em)*(1-P.dShrink[0]*fan),W:R*P.wW*(.6+.4*em)*(1-P.dShrink[1]*fan),wp:P.wwp,tip:P.wTip,vb:P.wVb,
        P0:[s*P.wP0[0]*R,P.wP0[1]*R,P.wP0[2]*R],d0:[s*wd[0]*g.wsp,wd[1],wd[2]],A0:V3.cr(V3.nz([-s*wn[0],-wn[1],-wn[2]]),V3.nz([s*wd[0]*g.wsp,wd[1],wd[2]])),a0:0,a1:L(P.wA1[0],P.wA1[1],o2),s1:-s*L(P.wS1[0],P.wS1[1],o2),
        fold:L(P.wFold[0],P.wFold[1],o2),cup:L(P.wCup[0],P.wCup[1],o2),crk:P.dCrk[0]*dec+P.dCrk[1]*fan,crkPh:g.crk+s,rev:.1*fan,limp:P.wLimp[0]*dec+P.wLimp[1]*fan,dn:dnL,
        wv:.02,wph:g.rufPh+s});
      pieces.push(svSheet(B,O,S,{nu:nu(6),nv:nu(8),mat:svPapM(P,M.win,Object.assign({vn:lod>=2?svVeins(r,P.veinN[1],0,.3):null,band:band('win'),fl:flames('win',svRng(g.sd+17+s))},mo)),
        ao:(u,v,front)=>front?1-.35*(1-svSm(v/.35)):1-.15*(1-svSm(v/.3)),zb:R0*.004}))}
    if(lod>=2||hi){const K=svPapPetal({L:R*P.kL*(.6+.4*em),W:R*P.kW,wp:P.kwp,tip:P.kTip,vb:P.kVb,P0:V3.sc(P.kP0,R),d0:P.kD0,A0:[1,0,0],a0:0,a1:P.kA1,aPow:2,fold:P.kFold,limp:.2*fan,dn:dnL});
    pieces.push(svSheet(B,O,K,{nu:nu(5),nv:nu(6),mat:svPapM(P,M.kee,mo),ao:(u,v,front)=>1-.3*(1-svSm(v/.4)),zb:R0*.008}))}}
  /* the calyx (its proxy tube for the order) */
  const gw=P.cGrow[0]+P.cGrow[1]*svSm(op/.5),cL=R0*P.cL*gw,tub=svPapTube(B,O,[[0,-.02*R0,-cL],[0,-.02*R0,0]],R0*P.cR[0]*gw,R0*P.cR[1]*gw,{nu:4,nv:2}),
    tk=[0,1,2,3,4].map(k=>.9+.2*pxHashS(k,5,g.sd));
  pieces.push({fn:par=>svPapCalyx(par,B,O,R0,Object.assign({L:P.cL,r0:P.cR[0],r1:P.cR[1],tL:P.tL,tW:P.tW},M.cal),{gw,sp0:L(P.tSp[0][0],P.tSp[1][0],o2)+.25*fan,sp1:L(P.tSp[0][1],P.tSp[1][1],o2)+.2*fan,lod,tk,sd:g.sd}),proxy:tub});
  /* the young pod pushing out of the withered flower (photographs of fading racemes: a green, flattened, downy pod with the style hooked at its tip) */
  if(fan>.05){const pl=R0*(P.pod[0]+P.pod[1]*fan),pw=R0*P.pod[2]*(.6+.4*fan),d=V3.nz(P.kD0),Pp=[[0,-.06*R0,0],V3.add([0,-.06*R0,0],V3.sc(d,pl*.4)),V3.add([0,-.04*R0,0],V3.add(V3.sc(d,pl*.8),[0,pl*.06,0])),V3.add([0,0,0],V3.add(V3.sc(d,pl),[0,pl*.16,0]))],
      pts=svPapBez(Pp,6),pc=M.pod||M.cal;
    pieces.push({fn:par=>svPapThin(par,svPapScr(B,O,pts),pts.map((q,i)=>pw*(i<5?Math.sin(Math.PI*(.18+.82*i/6))*1+.25:.3)),[pc.dk,pc.c,pc.lt,pc.hair]),proxy:svPapTube(B,O,pts,pw*.5,pw*.3,{nu:4,nv:4}),zb:-R0*.01})}
}
/* ---------- the raceme: a rachis with its florets on pedicels, alternate, all turned to the face (z), staged from the foot (open) to the tip (buds) ----------
   B, O: frame and foot of the rachis (view space; y up the rachis, z the face); D the standard's width of the first floret; S the sort's sheet
   (genes(seed) -> {n, tep:[per floret], sp pedL lean arch bend side dh ds dl}, mat(cwx) -> zones); o: {n, ped (peduncle drawn below the foot, x D), shadow} */
function svPapRaceme(par,B,O,D,S,cwx,op,seed,wl,o={}){const P=S._m||(S._m=Object.assign({},SVP_DEF,S)),g=P.genes(seed),M=P.mat(cwx),n=Math.max(1,o.n||g.n),pieces=[],sd0=g.side<0?-1:1,hi=DET>=1.5;
  wl=wl||0;const sp=D*g.sp*(.22+.78*svSm((op-.12)/.62)),Lr=sp*Math.max(.6,n-1)+D*.18,ns=10,rp=[[0,0,0]];let p=[0,0,0];
  for(let j=1;j<=ns;j++){const t=(j-.5)/ns,a=g.lean+g.arch*t,b=g.bend*t,d=V3.nz([Math.sin(b),Math.cos(a),Math.sin(a)]);p=V3.add(p,V3.sc(d,Lr/ns));rp.push(p)}
  const rAt=s=>{const x=Math.max(0,Math.min(1,s/Lr))*ns,j=Math.min(ns-1,Math.floor(x)),f=x-j;return V3.add(V3.sc(rp[j],1-f),V3.sc(rp[j+1],f))};
  /* the rachis (and the peduncle's end below the foot) */
  {const pd=(o.ped||0)*D,pts=(pd>0?[[0,-pd,-pd*.08],[0,-pd*.5,-pd*.03]]:[]).concat(rp),wf=q=>D*(P.rW[0]-(P.rW[0]-P.rW[1])*Math.max(0,q[1])/Lr);
    pieces.push({fn:par=>svPapThin(par,svPapScr(B,O,pts),pts.map(wf),[M.ped.dk,M.ped.c,M.ped.lt,M.ped.hair]),proxy:svPapTube(B,O,pts,D*P.rW[0]*.5,D*P.rW[1]*.5,{nu:4,nv:6}),zb:D*.02})}
  for(let i=0;i<n;i++){const t=g.tep[i%g.tep.length],fi=n>1?i/(n-1):0,side=sd0*(i%2?-1:1),
      opi=Math.max(.03,Math.min(1,op*P.stage[0]+P.stage[1]-P.stage[2]*fi+t.opd)),wli=wl>0?Math.max(0,Math.min(1,wl*P.wstage[0]+P.wstage[1]-P.wstage[2]*fi)):0,
      Di=D*(1-.05*i)*t.dS,R0i=Di/2,o2=svSm((opi-P.unf[0])/P.unf[1]),fan=svSm((wli-P.fan[0])/P.fan[1]),
      nod=P.nod[0]*(1-o2)+P.nod[1]*o2+P.nod[2]*fan+t.nod,N=rAt(Math.min(Lr-D*.06,sp*i)),Lp=D*g.pedL*(.6+.4*o2)*(i===n-1&&n>1?.8:1);
    /* each floret turned out to its own side (591, 206, 495, 530: alternate, facing away from the rachis at 40 to 65 deg from the raceme's face; the
       buds less), on a pedicel leaving the rachis outward and up (P.pedE above the horizontal) and arching down into the calyx */
    const az=side*(P.az[0]+P.az[1]*t.tilt)*(.6+.4*o2),sa=Math.sin(az),ca=Math.cos(az);
    let zf=V3.nz([sa,.06,ca]);const xf=V3.nz(V3.cr([0,1,0],zf));let yf=V3.cr(zf,xf);zf=rotA(zf,xf,nod);yf=rotA(yf,xf,nod);
    const xr=rotA(xf,zf,t.roll),yr=rotA(yf,zf,t.roll),q=V3.nz([sa*Math.cos(P.pedE),Math.sin(P.pedE),ca*Math.cos(P.pedE)*.55]),Cb=V3.add(N,V3.sc(q,Lp)),gw=P.cGrow[0]+P.cGrow[1]*svSm(opi/.5),Of=V3.add(Cb,V3.sc(zf,R0i*P.cL*gw)),
      pp=svPapBez([N,V3.add(N,V3.sc(q,Lp*.45)),V3.add(Cb,V3.sc(zf,-Lp*.4)),Cb],hi?7:5),
      lod=hi?2:o2>.5&&(i===0&&n<=3||i===1&&n<=2)?2:o2>.12?1:0;
    pieces.push({fn:par=>svPapThin(par,svPapScr(B,O,pp),pp.map((x,k)=>D*(P.pW[0]-(P.pW[0]-P.pW[1])*k/(pp.length-1))),[M.ped.dk,M.ped.c,M.ped.lt,lod>=1?M.ped.hair:null],{dark:lod>=2||lod>=1&&hi}),proxy:svPapTube(B,O,pp,D*P.pW[0]*.5,D*P.pW[1]*.5,{nu:4,nv:4}),zb:D*.01});
    const Bf=[toV(B,xr),toV(B,yr),toV(B,zf)],Ov=V3.add(O,toV(B,Of));
    if(lod>0||hi)svPapFloret(pieces,Bf,Ov,Di,P,t,g,M,opi,wli,lod);
    else{const sub=[];svPapFloret(sub,Bf,Ov,Di,P,t,g,M,opi,wli,0);pieces.push({fn:par2=>{const L0=LOD;LOD=1;try{svDraw(par2,sub,{D:Di,pmin:99,shadow:false})}finally{LOD=L0}},proxy:sub[0]})}}
  return svDraw(par,pieces,{D,pmin:P.pmin,shadow:o.shadow??hi})}

/* ---------- the plant of a climbing legume (sweet pea; later pea, vetch): the cut stem below the head's neck with its two wings, and the compound
   leaf at a node (two stipules, a winged petiole, pairs of leaflets, a branched coiling tendril). Everything in the plant's frame: apex-relative,
   y up, z toward the viewer; screen = [x, -y] ---------- */
const SVP_FULL=typeof location!=='undefined'?+(new URLSearchParams(location.search).get('full')||0):0;
const svPapP2=q=>[q[0],-q[1]];
/* the stem below the neck as the bouquet will draw it (c5.js stemTo: a cubic from the mouth arriving in the neck along the neck), as the plant sheet
   draws it (svtStem, full=<cm>), or nothing. nk the neck, t0 the way down there. at(s): s from the neck -> {p, t upward} */
function svPapBelow(nk,t0,B,up){let bq;
  if(B.reach){const bp=V3.sc(up,-B.reach),P3=nk,P0=[bp[0],bp[1]-8,nk[2]],Lc=Math.hypot(P3[0]-P0[0],P3[1]-P0[1]),k=Math.max(0,Math.min(1,1-(Lc-20)/50)),hk=Lc*(.38-.2*k),
      P1=V3.add(V3.sc([P0[0]+(P3[0]-P0[0])*.06,bp[1]+.35*(P3[1]-bp[1]),nk[2]],1-k),V3.sc(V3.add(P0,V3.sc(V3s(P3,P0),.33)),k)),P2=V3.add(P3,V3.sc(t0,hk));
    bq=q=>{const u=1-q;return V3.add(V3.add(V3.sc(P0,u*u*u),V3.sc(P1,3*u*u*q)),V3.add(V3.sc(P2,3*u*q*q),V3.sc(P3,q*q*q)))}}
  else if(SVP_FULL){const L=SVP_FULL*UPC,e=[nk[0],-nk[1]],dl=Math.hypot(t0[0],t0[1])||1,nd=[t0[0]/dl,-t0[1]/dl],x0=e[0]+nd[0]*L*.3,
      S=[[x0,e[1]+L],[x0,e[1]+L*.65],[e[0]+nd[0]*L*.3,e[1]+nd[1]*L*.3],e];
    bq=q=>{const u=1-q,a=u*u*u,b=3*u*u*q,c=3*u*q*q,d=q*q*q;return[a*S[0][0]+b*S[1][0]+c*S[2][0]+d*S[3][0],-(a*S[0][1]+b*S[1][1]+c*S[2][1]+d*S[3][1]),nk[2]]}}
  else return{L:0,at:s=>({p:V3.add(nk,V3.sc(t0,s)),t:V3.sc(t0,-1)})};
  const S=[0],Q=[1];let acc=0,pv=bq(1);for(let i=1;i<=32;i++){const q=1-i/32,pt=bq(q);acc+=V3l(V3s(pt,pv));pv=pt;S.push(acc);Q.push(q)}
  return{L:acc,at:s=>{let i=1;while(i<32&&S[i]<s)i++;const f=Math.max(0,Math.min(1,(s-S[i-1])/((S[i]-S[i-1])||1))),q=Q[i-1]+(Q[i]-Q[i-1])*f,p=bq(q),q2=Math.min(1,q+.01);
    return{p,t:V3.nz(V3s(bq(q2),bq(q2-.01)))}}}}
/* the stem's two wings (554, 357): thin green flanges in one plane that turns slowly down the stem, from s0 to s1 below the neck. The near wing lies
   over the stem, the far one shows only past its silhouette; seen edge-on a wing is a fine line, never cut in two (minimum width mw) */
function svPapWings(par,bl,s0,s1,w,ww,ph,c){const g=G(par),n=Math.max(4,Math.min(10,Math.round((s1-s0)/(w*5)))),VZ=[0,0,1],mw=Math.max(.3,ww*.12),side=[[[],[]],[[],[]]],zs=[0,0];
  for(let i=0;i<=n;i++){const s=s0+(s1-s0)*i/n,{p,t}=bl.at(s),e1=V3.nz(V3.cr(t,VZ)),e2=V3.cr(e1,t),a=ph+.6*i/n,wv=V3.add(V3.sc(e1,Math.cos(a)),V3.sc(e2,Math.sin(a))),
      c2=svPapP2(p),t2=[t[0],-t[1]],tl=Math.hypot(t2[0],t2[1])||1,n2=[-t2[1]/tl,t2[0]/tl],r=w/2*(1+.08*i/n);
    for(let k=0;k<2;k++){const v=k?V3.sc(wv,-1):wv,ak=v[0]*n2[0]-v[1]*n2[1],sg=ak<0?-1:1,front=v[2]>0;
      let a0=front?ak*r:sg*Math.max(Math.abs(ak)*r,r*.86),a1=ak*(r+ww);if(sg*(a1-a0)<mw)a1=a0+sg*mw;zs[k]+=v[2];
      side[k][0].push([c2[0]+n2[0]*a1,c2[1]+n2[1]*a1]);side[k][1].push([c2[0]+n2[0]*a0,c2[1]+n2[1]*a0])}}
  const ord=zs[0]<zs[1]?[0,1]:[1,0],wing=k=>{const P=side[k][0].concat(side[k][1].slice().reverse());
    E('path',{d:svSpl(P),fill:c.wing,stroke:c.edge,'stroke-width':svF(Math.max(.25,ww*.14)),'stroke-opacity':.8,'stroke-linejoin':'round'},g)};
  wing(ord[0]);
  /* the main stem itself (c.core: its colours dark, mid, light, hairs), a lit cylinder wider than the round peduncle above the node, between its wings */
  if(c.core){const C=[],W=[];for(let i=0;i<=n;i++){const s=s0+(s1-s0)*i/n;C.push(svPapP2(bl.at(s).p));W.push(w*(1+.08*i/n))}svPapThin(g,C,W,c.core,{hs:2})}
  wing(ord[1]);
  return g}
/* the compound leaf (539, 357, 389, 59, 73, 554): from a node of the stem, two half-arrow stipules clasping it, a winged petiole leaving up and out,
   a pair (or pairs) of ovate leaflets spread in a V, their blades folded a little up along the midrib and drooping at the tip; the rachis runs on
   into a tendril branched in three, each branch sweeping out then coiling. p the node, t the stem upward there, Out the side the leaf leaves on;
   D the scale (a floret's width); returns parts {z, fn} */
const SVPL_DEF={pet:.72,petW:.05,petA:.72,tw:0,lf:{n:1,L:1.45,W:.48,wp:[[0,.08],[.1,.5],[.35,.96],[.5,1],[.72,.82],[.9,.38],[1,0]],sp:.55,fold:.35,droop:.26,step:.35},
  ten:{L:.75,n:3,bL:1.75,bA:.55,turns:[1.2,2.2],cr:[.12,.2],w:.02,tilt:.3},stip:{L:.46,W:.05,lobe:.28,a:.42},
  up:'#6b9367',low:'#a2b894',vein:'#94b484',tenc:'#86a668',petc:['#3e5a2c','#6a8a4a','#a8c08a',null]};
function svPapLeaf(p,t,Out,D,o0,r,wl){const o=Object.assign({},SVPL_DEF,o0),lf=Object.assign({},SVPL_DEF.lf,o0&&o0.lf),tn=Object.assign({},SVPL_DEF.ten,o0&&o0.ten),
    st=Object.assign({},SVPL_DEF.stip,o0&&o0.stip),w0=wl||0,limp=svSm((w0-.15)/.6),col=c=>w0>0&&typeof lifeCol==='function'?lifeCol(c,Math.min(1,w0*1.1)):c,
    VZ=[0,0,1],dn=[0,-1,0],LG=V3.nz([-.45,.65,.6]),parts=[],R2=(a,b)=>a+(b-a)*r(),sw=o.sw||D*.035,
    prof=v=>{const P=lf.wp;for(let i=1;i<P.length;i++)if(v<=P[i][0]){const q=svSm((v-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[i-1][1]+(P[i][1]-P[i-1][1])*q}return 0},
    shade=(base,nv)=>{const k=Math.max(0,V3.dot(nv,LG));return k>.5?mix(base,lt(base,.22),(k-.5)*2):mix(shd(base,.3),base,k*2)},
    across=V3.nz(V3.cr(t,Out));
  /* the petiole: out of the node, rising and turning outward, its end dipping as the leaf goes limp */
  const dP=V3.nz(V3.add(V3.sc(t,Math.cos(o.petA+.35*limp)),V3.sc(Out,Math.sin(o.petA+.35*limp)))),Lp=D*o.pet*R2(.85,1.15),p0=V3.add(p,V3.sc(Out,sw*.6)),
    Q=V3.add(p0,V3.add(V3.sc(dP,Lp),V3.sc(dn,Lp*.06*(1+3*limp)))),pc=svPapBez([p0,V3.add(p0,V3.sc(Out,Lp*.4)),V3.add(Q,V3.sc(dP,-Lp*.4)),Q],5),
    nL0=V3.add(V3.sc(t,.4),V3.sc(VZ,.9)),nL=V3.nz(rotA(V3s(nL0,V3.sc(dP,V3.dot(nL0,dP))),dP,o.tw*(1+.4*limp))),sv=V3.nz(V3.cr(dP,nL)),pcol=o.petc.map(x=>x&&col(x));
  parts.push({z:p[2]+D*.01,fn:par=>svPapThin(par,pc.map(svPapP2),pc.map((q,i)=>D*o.petW*(1-.35*i/5)),pcol,{dark:false})});
  /* the leaflets: a midrib walked in steps (droop toward the ground), two half blades lifted by the fold; each half shaded by its own normal, the
     upper face dark and the lower one pale and glaucous; the outline stroked in its own colour so that a blade seen edge-on stays a line */
  const leaflet=(b,a,L,W,ph)=>{const ns=7,M=[],Dv=[];let q=b;const dr=Math.min(.6,lf.droop+.3*limp);W*=1-.3*limp;
      for(let j=0;j<=ns;j++){const v=j/ns,k=dr*Math.pow(v,1.5),d=V3.nz(V3.add(V3.sc(a,1-k),V3.sc(dn,k)));if(j)q=V3.add(q,V3.sc(d,L/ns));M.push(q);Dv.push(d)}
      const fold=lf.fold+.6*limp+ph,half=s=>M.map((m,j)=>{const ex=V3.nz(V3.cr(Dv[j],nL)),wv=W*prof(j/ns);return V3.add(m,V3.add(V3.sc(ex,s*wv*Math.cos(fold)),V3.sc(nL,wv*Math.sin(fold))))});
      const H=[half(1),half(-1)],out=[];let zm=0;
      for(const h of H){const A=V3s(M[6],M[1]),Bv=V3s(h[4],M[4]);let nv=V3.nz(V3.cr(A,Bv));if(V3.dot(nv,nL)<0)nv=V3.sc(nv,-1);const upf=nv[2]>=0,
          c=col(upf?o.up:o.low),fc=shade(c,upf?nv:V3.sc(nv,-1)),z=h.reduce((s2,x)=>s2+x[2],0)/h.length;zm+=z;
        out.push({z,d:svSpl(M.map(svPapP2).concat(h.slice(1,ns).reverse().map(svPapP2))),fc,upf})}
      out.sort((x,y)=>x.z-y.z);
      return{z:zm/2,fn:par=>{const g=G(par);for(const x of out)E('path',{d:x.d,fill:x.fc,stroke:x.fc,'stroke-width':svF(Math.max(.35,D*.006)),'stroke-linejoin':'round'},g);
        E('path',{d:svSpl(M.slice(0,ns).map(svPapP2),false),fill:'none',stroke:col(o.vein),'stroke-width':svF(Math.max(.2,D*.008)),'stroke-opacity':.8,'stroke-linecap':'round'},g)}}};
  let Qe=Q;
  for(let i=0;i<lf.n;i++){const b=i?V3.add(Q,V3.sc(dP,D*lf.step*i)):Q,L=D*lf.L*R2(.9,1.1)*(1-.12*i),W=L*lf.W*.5*R2(.92,1.08);
    for(const s of[-1,1]){const be=lf.sp*R2(.8,1.2)*(1+.3*limp),a=V3.nz(V3.add(V3.sc(dP,Math.cos(be)),V3.sc(sv,s*Math.sin(be)))),lfp=leaflet(b,a,L*R2(.94,1.06),W,R2(-.08,.08));
      lfp.z+=D*.02;parts.push(lfp)}Qe=b}
  /* the tendril: the rachis running on, then three branches (bA apart) sweeping out and coiling at their ends; one path for the rachis, one for the branches */
  {const T=[Qe],dT=V3.nz(V3.add(dP,V3.sc(nL,.15))),LT=D*tn.L*R2(.85,1.15);let q=Qe,d=dT;
    for(let j=1;j<=5;j++){d=V3.nz(rotA(d,sv,.06));q=V3.add(q,V3.sc(d,LT/5));T.push(q)}
    const br=[];for(let b=0;b<tn.n;b++){const ang=(b-(tn.n-1)/2)*tn.bA+R2(-.15,.15),ax0=V3.nz(rotA(nL,d,R2(-.4,.4))),cr=D*R2(tn.cr[0],tn.cr[1]),turns=R2(tn.turns[0],tn.turns[1]),
        l1=D*tn.bL*R2(.75,1.2),sgn=r()<.5?-1:1,P=[q];let db=V3.nz(rotA(d,nL,ang)),pb=q;
      /* sampled lean (relais 4, weight): 3 steps on the sweep, 5 per turn of the coil, turning half before and half after each step; the
         spline through them stays a smooth coil */
      const ax=V3.nz(V3.add(V3.sc(ax0,Math.cos(tn.tilt)),V3.sc(db,Math.sin(tn.tilt)))),Lc=turns*6.283*cr,n2=Math.ceil(turns*5),st=[];
      for(let j=0;j<3;j++)st.push([l1/3,(.8/l1)*((j+.5)/3)]);for(let j=0;j<n2;j++)st.push([Lc/n2,1/(cr*(1+.6*(1-(j+.5)/n2)))]);
      for(const[sA,kap]of st){const h=sgn*kap*sA/2;db=V3.nz(rotA(db,ax,h));db=V3.nz(V3.add(db,V3.sc(dn,.18*sA/D*(1+2*limp))));pb=V3.add(pb,V3.sc(db,sA));
        db=V3.nz(rotA(db,ax,h));P.push(pb)}br.push(P)}
    const tc=col(o.tenc),z=T.reduce((s2,x)=>s2+x[2],0)/T.length+D*.03;
    parts.push({z,fn:par=>{const g=G(par);E('path',{d:svSpl(T.map(svPapP2),false),fill:'none',stroke:pcol[1],'stroke-width':svF(Math.max(.35,D*tn.w*1.6)),'stroke-linecap':'round'},g);
      E('path',{d:br.map(P=>svSpl(P.map(svPapP2),false)).join(''),fill:'none',stroke:tc,'stroke-width':svF(Math.max(.28,D*tn.w)),'stroke-linecap':'round','stroke-linejoin':'round'},g)}})}
  /* the stipules: two half-arrow blades at the node, one on each side of the stem, pointing up along it, the basal lobe pointing down */
  for(const s of[-1,1]){const b=V3.add(p,V3.sc(across,s*sw*.8)),ds=V3.nz(V3.add(V3.sc(t,Math.cos(st.a)),V3.sc(across,s*Math.sin(st.a)))),ex=V3.nz(V3.cr(VZ,ds)),
      L=D*st.L*R2(.85,1.15),W=D*st.W,pt=(u,v)=>V3.add(b,V3.add(V3.sc(ds,u*L),V3.sc(ex,v*W))),
      P=[pt(-st.lobe,s*1.1),pt(-.03,s*1.05),pt(.3,s*1),pt(.66,s*.55),pt(1,0),pt(.6,-s*.42),pt(.22,-s*.62),pt(0,-s*.25),pt(-.04,s*.35)].map(svPapP2),fc=shade(col(o.up),V3.nz([0,.3,1]));
    parts.push({z:p[2]+D*.04,fn:par=>E('path',{d:svSpl(P),fill:fc,stroke:fc,'stroke-width':svF(Math.max(.3,D*.005)),'stroke-linejoin':'round'},par)})}
  return parts}
