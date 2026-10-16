/* ---------- y3-anemone2.js: the florists' anemone's plant, v2 (2026-10-08): its stem, its collar and their fading, from the photographs of its organs
   (refcache/anemone-coronaria-organes: t197, t139, t188, t198, t196, t121, t105, t157; the wild sort's t034 for the hairs; measures in
   refcache/anemone-coronaria/etat.md). The head (y2.js) does not change. anemPlant (s10a.js) calls these pieces; the bouquet's chance R() is consumed
   exactly as before (lsHeadS's draws, D*R(.5,.65) per bract, ten R() inside each bract, the head's own share): every new detail draws on svRng.
   A cut stem of the florists' anemone carries no leaf but its collar: three sessile bracts (the involucre), each cut into three lobes and these into
   narrow pointed strips. ---------- */

/* the stem (t197: 0.051 of the flower across under the collar; t121: 0.09 of a half-open bud, about 0.05 of the open flower; the wild sort 0.05):
   drawn 0.055 under the flower, 0.061 at the collar, 0.065 at the cut. Olive grey-green under silky hairs pressed upward (t197 #959b49 in full sun,
   dark #7f8c34; t121 #535938 in shade), finely ribbed; flushed purple-brown under the collar and up the stalk (t196, t121, t105; the wild t034
   #6c4549), redder on the red forms. Fading (catalogue/fanaison: the stem goes on lengthening in the vase and bends): duller, olive-straw. */
const ACO_SC=['#323e1e','#6c7d40','#a0ac68','#d8dcc0'];ACO_SC.sv={hair:'#e8ebda',hairK:.4,ribs:[-.55,-.15,.25,.6],swell:.07,gloss:.18};
const ACO_SCK={};
function acoFlush(cw){const c=(cw&&cw.c)||'#6a3a6a',l=h2l(c)[2];return l>.8?{c:'#6e5040',a:.34}:{c:mix('#5a2c30',c,.2),a:.62}}
/* the stem's colours: mode 0 the head's stem below the collar (the flush from f to its top), 2 the stalk above the collar (flushed all along, more toward
   the flower), 1 the cut stem below (no flush) */
function acoStemCols(cw,f,wl,mode){const y=.5*svSm((wl-.35)/.5),hi=DET>=1.5,key=[cw&&cw.id,mode,Math.round(f*20),Math.round(y*20),hi?1:0].join('_');if(ACO_SCK[key])return ACO_SCK[key];
  const fl=acoFlush(cw);let c=ACO_SC.map(x=>mix(x,'#86784a',y));if(mode===2)c=c.map((x,i)=>mix(x,fl.c,fl.a*(i<3?.5:.25)*(1-.4*y)));
  c.sv=Object.assign({},ACO_SC.sv,{hairK:hi?.2:.4},mode===1?{}:{hair:null,fuzz:mix('#e8ebda',c[2],.2),red:fl.c,redF:mode===2?0:f,redA:fl.a*(mode===2?.45:.7)*(1-.4*y)});return ACO_SCK[key]=c}

/* the bracts (t197 in sun: light #a8db88, body #6e9750, shade #2e5821; t139 indoors: #2c3408 to #3e451b, light #958f4e): mid green, the upper (inner)
   face darker and a little glossy, the underside paler and dulled by fine hairs (the wild sort's t034); the midrib lighter */
const ACO_BRACT={stops:[[0,'#5a8436'],[.5,'#4e7a30'],[1,'#5c8638']],bstops:[[0,'#93b46a'],[.5,'#8aad62'],[1,'#92b066']],shade:'#14290b',lite:'#a8cc84',bshade:'#3c5a2a',
  blite:'#c8dcae',rim:'#8cb070',cast:'#0d1c08',wrap:.26,amb:.3,dif:.7,sky:.16,trans:.28,ks:.14,gloss:20,dark:[.86,.68,.5],da:.26,lit:[1.12],la:.22,darkLo:[.72],
  daLo:.3,litLo:[],laLo:.22,rw:.012,ro:.35,soft:.06};
/* fading (catalogue/fanaison: the collar of cut leaves under the flower yellows and goes limp; no photograph of a fading florists' anemone) */
const ACO_WILT={y:'#b8a44e',b:'#7c5a32',k:[.28,.45]};

/* one bract of the collar: the bouquet's share of chance first (ten R(), as the old drawing), then svCutLeaf on its own seed. Measured: 0.35 to 0.4 of
   the open flower (t197), 0.5 hanging from a cut flower (t139), 0.9 of the bud's width round the bud (t188, t198); three lobes from a short common
   base, each pinnatifid into two or three pairs of linear pointed strips (width over length 0.06 to 0.1, t188), toothed on the florists' forms (t139).
   Out of the zoom one sheet per lobe with a deeply incised margin; in the zoom the strips are sheets of their own. Pressed up round the bud, then
   spreading level and drooping at the tips (t197, t196), limp and hanging as the flower fades (t139, fanaison) */
function acoBract(par,og,pos,len,sd,wl,op){for(let i=0;i<10;i++)R(0,1);/* the old drawing's share of the bouquet's chance */
  const H=V3.nz(og.H),o2=svSm((op-.15)/.6);
  return acoCutLeaf(par,{base:V3.add(pos,V3.sc(H,(og.w||2)*.4)),H,U:og.U,len:len*(.66+.14*o2),sd,wl,mat:ACO_BRACT,wilt:ACO_WILT,lobes:[[-.6,.8],[0,1],[.6,.86]],lobeJ:.16,
    w:.11,vb:.36,inc:{n:[1,2],dp:.55,sh:.35,from:.45,to:.85},side:[1.4,2.3],sideLo:.5,sideP:.14,sideA:[.45,.75],sideT:[.18,.36],sideL:[.52,.26],ws:.13,
    incS:{n:[1,2],dp:.5,sh:.35,from:.35,to:.82},up:.1,limp:[.42+.08*o2,.3],dip:.55,lobeDip:.3,limpJ:.35,baseL:.15,baseW:.16,gut:[.45,.2],tw:[.35,.5],nu:[3,4],nv:[6,10],mid:['#8cb46c','#c4d6ac',.5,.32]})}

/* the neck after the L-system (no chance drawn): the collar slides up the stem to its measured place (dC below the flower: right under the bud,
   t121, t188; 0.19 of the flower under the open flower, t197; further as the stalk goes on growing in the vase, fanaison), and the stalk above it
   bends (a2 about A2) and lengthens (gW) as the flower fades; the node, its bracts and the flower move with it */
function acoNeck(res,b){const c0=res.chains[0],P=c0.pts,W=c0.ws,n=P.length;if(n<3)return;
  const s0=[0];for(let i=1;i<n;i++)s0.push(s0[i-1]+V3l(V3s(P[i],P[i-1])));const sE=s0[n-1],nd=res.organs.find(q=>q.t==='Nd');if(!nd)return;
  const sC=Math.max(s0[2],sE-b.dC),st=Math.max(1e-6,(sE-sC)/8),Q=[],QW=[],QS=[];
  for(let i=0;i<n;i++){if(i){const a=s0[i-1],z=s0[i],cuts=[];if(sC>a+1e-6&&sC<z-1e-6)cuts.push(sC);
      if(z>sC){const fr=Math.max(a,sC),m=Math.ceil((z-fr)/st);for(let j=1;j<m;j++)cuts.push(fr+(z-fr)*j/m)}cuts.sort((x,y)=>x-y);
      for(const x of cuts){const t=(x-a)/Math.max(1e-9,z-a);Q.push(V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),t)));QW.push(W[i-1]+(W[i]-W[i-1])*t);QS.push(x)}}
    Q.push(P[i]);QW.push(W[i]);QS.push(s0[i])}
  let iC=QS.findIndex(x=>x>=sC-1e-6);if(iC<1)iC=1;
  const Rr=[Q[0]];for(let i=1;i<Q.length;i++){const m=(QS[i]+QS[i-1])/2,a=b.a2*svSm((m-sC)/Math.max(1e-6,sE-sC)),g2=m>sC?1+b.gW:1,d=V3s(Q[i],Q[i-1]);
    Rr.push(V3.add(Rr[i-1],V3.sc(b.a2>1e-4?rotA(d,b.A2,a):d,g2)))}
  c0.pts=Rr;c0.ws=QW;res._ci=iC;
  for(const og of res.organs){if(og.t==='Nd'||og.t==='Lv')og.pos=Rr[iC];else if(og.t==='K')og.pos=Rr[Rr.length-1]}}

/* lsPlant for this stem: the head's stem in two whole pieces (lsChainParts would cut it every 6 points: seams, and the flush restarting on each
   piece), joined at the collar where the bracts hide the joint; both at the collar's depth, so the bracts turned away go behind the stem and those
   turned toward the eye in front; the flush starts half a flower under the collar */
function acoLsPlant(k,res,o,cw,wl,D){const parts=[],ext=[],O=o.O,apex=o.apex||[0,0,0],off=V3s(O,apex),c0=res.chains[0],ci=lsCut(res,apex),
    j=res._ci>0&&res._ci<ci?res._ci:ci,lo={pts:c0.pts.slice(0,j+1),ws:c0.ws.slice(0,j+1)},hi=j<ci?{pts:c0.pts.slice(j,ci+1),ws:c0.ws.slice(j,ci+1)}:null;
  let Lo=0;for(let i=1;i<=j;i++)Lo+=V3l(V3s(c0.pts[i],c0.pts[i-1]));const fR=Math.max(.2,1-D*.5/Math.max(1e-6,Lo)),zc=Math.min(O[2]-.002,c0.pts[j][2]+off[2]),sp=[];
  const sd=svSeed('anemone-tige',cw&&cw.id||'',Math.round(c0.pts[0][0]*8),Math.round(c0.pts[0][2]*8));sp.push(acoChain(lo,off,acoStemCols(cw,fR,wl,0),sd));if(hi)sp.push(acoChain(hi,off,acoStemCols(cw,0,wl,2),sd+1));
  for(const p of sp)p.z=zc;(NECK_X?ext:parts).push(...sp);lsChainParts(res.chains.slice(1),off,o.cols||SG,parts,{piece:1e4});
  for(const og of res.organs){const pos=V3.add(og.pos,off),draw=o.organ&&o.organ(og,pos);if(!draw)continue;(draw.ext&&NECK_X?ext:parts).push(...(draw.parts||[]))}
  if(NECK_X&&EXT)EXT.push(par=>drawParts(par,ext));else parts.push(...ext);drawParts(k,parts)}
/* the bud stands upright on its stem (t121, t188, t198: the florists' anemone's bud is never nodding): the head's frame, wherever the bouquet points
   it, turns toward the stem's line while the bud is young (most of the way at op .1, none past op .5); no chance drawn */
function acoBudUp(B,op){const Z=B[2],up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],c=Math.max(-1,Math.min(1,V3.dot(Z,up))),k=.88*(1-svSm((op-.12)/.38)),a=k*Math.acos(c),ax=V3.cr(Z,up);
  if(a<1e-3||V3l(ax)<1e-4)return B;const A=V3.nz(ax),R2=B.slice(0,3).map(v=>rotA(v,A,a));R2.upV=B.upV;R2.reach=B.reach;return R2}
/* acoCutLeaf: svCutLeaf (y3-anemone.js, untouched) with what the florists' collar asks for (t188, t198, t139): the side strips dip below the lobe's plane
   (dip: the bract folds down on each side of its lobes, never a flat fan), the side lobes below the central one (lobeDip), and each strip sags by its
   own measure (limpJ: the limpness x 1 +- limpJ); every other key as svCutLeaf */
const ACO_CUT={dip:0,lobeDip:0,limpJ:0,baseL:0,baseW:.2};
function acoCutLeaf(par,o){const P=Object.assign({},SVC_DEF,ACO_CUT,o),r=svRng(P.sd),H=V3.nz(P.H),dn=[0,-1,0],det=DET>=1.5,wl=P.wl||0,
    limp=P.limp[0]+P.limp[1]*svSm((wl-.2)/.5),pieces=[],mat=P.wilt&&wl>0?svcWiltMat(P.mat,wl,P.wilt):P.mat;
  /* the side the leaf arches toward, square to its direction */
  const u0=V3.add(P.U,V3.sc(H,-V3.dot(P.U,H))),U=Math.hypot(u0[0],u0[1],u0[2])<1e-4?V3.nz(P.U):V3.nz(u0);
  const dip=(v,a)=>a?V3.nz(V3.add(V3.sc(v,Math.cos(a)),V3.sc(U,-Math.sin(a)))):v,rot=(v,ax,a)=>V3.add(V3.add(V3.sc(v,Math.cos(a)),V3.sc(V3.cr(ax,v),Math.sin(a))),V3.sc(ax,V3.dot(ax,v)*(1-Math.cos(a))));
  /* one segment from p0 along d0 (length l, half width w): its spine arches toward U a little, then sags toward the ground, more toward the tip;
     st: the share that is a bare stalk; inc: its cut margin */
  const seg=(p0,d0,l,w,tw,st=0,inc=null)=>{const ns=10,sp=[],dv=[],lk=limp*(1+P.limpJ*(r()*2-1));let p=p0;const d=V3.nz(V3.add(d0,V3.sc(U,P.up)));
      for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.92,lk*Math.pow(v,1.2)),dd=V3.nz(V3.add(V3.sc(d,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,l/ns));sp.push(p);dv.push(dd)}
      const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},vb=P.vb,
        prof=b=>b<vb?.4+.6*Math.sin(b/vb*Math.PI/2):Math.max(.05,Math.pow(Math.cos((b-vb)/(1-vb)*Math.PI/2),.85)),
        half=(v,s)=>{if(st&&v<st)return Math.max(l*P.stalkW,w*.12)*(1-.25*v/st);const b=st?(v-st)/(1-st):v;return w*prof(b)*(inc?svcInc(inc,det,b,s):1)};
      const rows=svcRows(det?P.nv[1]:P.nv[0],st,inc,det),nr=rows?rows.length-1:0,
        g=t=>{if(!rows)return t;const x=Math.max(0,Math.min(1,t))*nr,j=Math.min(nr-1,Math.floor(x));return rows[j]+(rows[j+1]-rows[j])*(x-j)};
      const S=(u,t)=>{const v=g(t),c=at(sp,v),tg=V3.nz(at(dv,v)),side0=V3.nz(V3.cr(U,tg)),nrm0=V3.nz(V3.cr(tg,side0)),a=tw*v,side=V3.add(V3.sc(side0,Math.cos(a)),V3.sc(nrm0,Math.sin(a))),nrm=V3.cr(tg,side),hw=half(v,u<0?-1:u>0?1:0);
        return V3.add(V3.add(c,V3.sc(side,u*hw)),V3.sc(nrm,(P.gut[0]+P.gut[1]*limp)*Math.abs(u)*hw-.06*hw))};
      /* the side veins (zoom): from the midrib to each lobe tip of a cut margin, in the sheet's own (u, row) coordinates */
      const tips=[];if(rows&&inc&&det&&inc.n[1])rows.forEach((v,j)=>{const b=st?(v-st)/(1-st):v;for(const s of[-1,1])if(b>(inc.from??.18)&&b<(inc.to??.88)&&svcInc(inc,det,b,s)>.995)tips.push([s,j/nr,Math.max(0,(j-2.5)/nr)])});
      const sh=svSheet(I3,[0,0,0],S,{nu:det?P.nu[1]:P.nu[0],nv:rows?nr:det?P.nv[1]:P.nv[0],mat,veins:null});sh._tips=tips;sh._st=rows&&st?2/nr:.04;pieces.push(sh);
      return{at:v=>at(sp,v),dir:v=>V3.nz(at(dv,v))}};
  /* the common base: a short broad sheet clasping the stem, the lobes leaving from its end */
  let B0=P.base;if(P.baseL){const bs=seg(P.base,H,P.len*P.baseL,P.len*P.baseW,0);B0=bs.at(.82)}
  P.lobes.forEach(([a0,lk])=>{const d0=dip(rot(H,U,a0+r.in(-P.lobeJ,P.lobeJ)),Math.abs(a0)>.2?P.lobeDip*r.in(.7,1.3):0),Ll=P.len*lk*r.in(P.lobeL[0],P.lobeL[1]),st=Math.abs(a0)<.2?P.stalk[0]:P.stalk[1],
      lobe=seg(B0,d0,Ll,Ll*P.w,r.in(-P.tw[0],P.tw[0]),st,P.inc),n=Math.round(r.in(P.side[0],P.side[1])*(det?1:P.sideLo));
    for(let k=0;k<n;k++){const t=(P.sideAll?0:st)+(P.sideAll?1:1-st)*(P.sideT[0]+P.sideT[1]*k/Math.max(1,n-1))+r.in(-.04,.04);for(const s of[-1,1]){if(r()<P.sideP)continue;
      const p=lobe.at(t),dd=dip(rot(lobe.dir(t),U,s*r.in(P.sideA[0],P.sideA[1])),P.dip*r.in(.6,1.3)),l=Ll*(P.sideL[0]-P.sideL[1]*(P.sideAll?t:(t-st)/(1-st)))*r.in(.85,1.1),sg=seg(p,dd,l,l*P.ws,r.in(-P.tw[1],P.tw[1]),0,P.incS);
      /* the teeth: short pointed segments along the outer side of a side segment (only in the zoom) */
      if(det&&P.teeth)for(let q=0;q<P.teeth;q++){const tq=.3+.4*q/Math.max(1,P.teeth-1),s2=q%2?s:-s,lt=l*r.in(P.teethL[0],P.teethL[1])*(1-.4*tq);seg(sg.at(tq),rot(sg.dir(tq),U,s2*r.in(P.teethA[0],P.teethA[1])),lt,lt*P.wt,0)}}}});
  /* the midrib, lighter, on every segment, and the side veins to the cut lobes (zoom only) */
  if(det)for(const p of pieces){const tp=p._tips||[],v0=p._st;p.mat=Object.assign({},mat,{veins:(s2,front)=>{const L=[[[[[0,v0],[0,.3],[0,.6],[0,.9]]],.012,front?P.mid[0]:P.mid[1],front?P.mid[2]:P.mid[3]]];
    if(tp.length)L.push([tp.map(([s,t1,t0])=>[[0,t0],[s*.35,(t0+t1)/2],[s*.8,t1]]),.007,front?P.mid[0]:P.mid[1],(front?P.mid[2]:P.mid[3])*P.lat]);return L}})}
  return svDraw(par,pieces,{D:P.len*1.5,sd:P.shadow[0],sb:P.shadow[1],so:P.shadow[2],shadow:det})}
/* the silky coat of the stem (t197: a fine grey down all over, the hairs pressed upward, a tenth to a fifth of the stem across, standing just out of
   the silhouette as a halo; t034, t188 the same): short strokes on both edges every ~0.07 of the width (two opacities, so they never read as a row of
   dashes), and in the zoom a sheen of finer ones over the lit face. P, W: the stem on the screen (from its foot to its top); sd: a seed (svRng) */
function acoFuzz(par,P,W,col,sd){const n=P.length;if(n<2||LOD)return;const r=svRng(sd),hi=DET>=1.5,lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1]);
  let d1='',d2='',d3='';const W0=W.reduce((a,b)=>a+b,0)/n,step=W0*(hi?.07:.16);let acc=0;
  for(let i=1;i<n;i++){const dx=P[i][0]-P[i-1][0],dy=P[i][1]-P[i-1][1],l=Math.hypot(dx,dy)||1,T=[dx/l,dy/l],N=[-T[1],T[0]];acc+=l;
    while(acc>=step){acc-=step;const f=1-acc/l,c=[P[i-1][0]+dx*f,P[i-1][1]+dy*f],w=(W[i-1]+(W[i]-W[i-1])*f)/2;
      for(const s of[1,-1]){const o=w*r.in(.84,.98),h=w*2*r.in(.07,.19),a=r.in(.18,.5),q=[c[0]+N[0]*o*s,c[1]+N[1]*o*s],dd=[T[0]+N[0]*s*a,T[1]+N[1]*s*a],dl=Math.hypot(dd[0],dd[1]),
          seg='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(dd[0]/dl*h),svR(dd[1]/dl*h)]);if(r()<.5)d1+=seg;else d2+=seg}
      if(hi&&r()<.55){const u=r.in(-.75,.75),lit=(N[0]*lt[0]+N[1]*lt[1])/ll*u,q=[c[0]+N[0]*w*u,c[1]+N[1]*w*u],h=w*2*r.in(.06,.14);if(lit>-.1)d3+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(T[0]*h),svR(T[1]*h)])}}}
  const sw=svF(Math.max(.04,W0*(hi?.022:.03)));if(d1)E('path',{d:d1,fill:'none',stroke:col,'stroke-width':sw,'stroke-opacity':.55,'stroke-linecap':'round'},par);
  if(d2)E('path',{d:d2,fill:'none',stroke:col,'stroke-width':sw,'stroke-opacity':.28,'stroke-linecap':'round'},par);
  if(d3)E('path',{d:d3,fill:'none',stroke:col,'stroke-width':svF(Math.max(.03,W0*.016)),'stroke-opacity':.16,'stroke-linecap':'round'},par)}
/* one axis of the head's stem as one part (lsChainParts' smoothing: Catmull-Rom, three steps per internode, without its cuts), its coat on top */
function acoChain(ch,O,c,sd){const n=ch.pts.length,P=[],W=[];let z=0;
  for(let i=0;i<n;i++){const q=ch.pts[i];z+=q[2]+O[2];const sq=[q[0]+O[0],-(q[1]+O[1])];if(!i){P.push(sq);W.push(ch.ws[i]);continue}
    const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
      P.push([cr(0)+O[0],-(cr(1)+O[1])]);W.push(ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*t)}P.push(sq);W.push(ch.ws[i])}
  return{z:z/n,cast:false,ax:1,fn:par=>{const g=stemPoly(par,P,W,c);acoFuzz(g||par,P,W,c.sv&&c.sv.fuzz||'#e8ebda',sd)}}}
