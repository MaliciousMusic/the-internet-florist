/* ================= Pilote, lot 3 (grappes) : le lilas commun (Syringa vulgaris 'Ruhm von Horstenstein', simple) en SVG natif (y-syringa.js) =================
   From the photographs (refcache/lilas: brief.md, the four Commons photographs of 'Ruhm von Horstenstein' by Salicyna, the organ photographs 65 to 89
   and 133; REFERENCES-lilas.md): a conical thyrse, height over width 1.5 to 2, of opposite decussate branches shortening upward, each carrying
   rounded cymes of florets; in a loose panicle (photo 63) the cymes stand apart as lumps with dark gaps. A floret: a slender tube opening into
   four spreading ovate lobes, their tips hooded; violet buds, deeper than the open mauve limbs; the panicle opens from its foot and its lower
   branches up, its tip still in bud (photos 79, 88: deduced, not proven). Fading (deduced, no photograph found): the florets pale, then brown one by
   one from the oldest, shrivel and stay on the panicle. The kit (y3-grappe.js: layout 'panicule', floret 'etoile') draws the panicle; this sheet
   gives only the lilac's numbers. The plant: a florist's cut woody stem, never roots (STANDARD-RENDU 4 ter, 8 bis, 8 ter): the old wood grey-brown
   with lenticels, the young shoot olive green from its ring of bud-scale scars, the leaves opposite, ovate-cordate, acuminate, on long petioles,
   the lower pair stripped as a florist does (deduced), the cut slanted. */
/* the colourway of the SKU, measured on the four photographs of 'Ruhm von Horstenstein' (work/bands.py: the violet pixels in five lightness
   bands, sunlit: shadow #361337, dark #522856, median #a475ad, light #ecc9f5, highlight #fbe3fd), the light end tempered for diffuse light;
   the buds and the back of the lobes deeper (read on the panicles' tips and the lobes seen from behind) */
const LIL_CW={lilas:{fr:['#3a1438','#5a2a5e','#9a68a6','#c9a0d6','#ead2f4'],bk:['#341034','#4e2052','#83508f','#b082c0','#d4b2e0'],
  bud:['#26092a','#3e1544','#5f2a68','#86488e','#ad72b4'],throat:'#3a1640',anth:'#d6c25a'}};
/* the young buds' green (deduced from the photographs of buds, 74 to 79: green at the foot, violet from the tip) and the dried florets (deduced) */
const LIL_GRN=['#2e3a1c','#4a5a2c','#6e7c44','#94a266','#bcc896'],LIL_DRY=['#2a1c16','#4a3224','#6e5038','#8e7052','#b09474'],LIL_M={};
function lilMat(cw){const id=cw&&cw.id;if(LIL_M[id])return LIL_M[id];const S=LIL_CW[id]||(()=>{const c=(cw&&cw.c)||'#b58ccc',b=(cw&&cw.bud)||mix(c,'#200820',.45),
    ramp=x=>[mix(x,'#140612',.66),mix(x,'#140612',.4),x,mix(x,'#ffffff',.32),mix(x,'#ffffff',.62)];
    return{fr:ramp(c),bk:ramp(mix(c,b,.3)),bud:ramp(b),throat:mix(c,'#140612',.7),anth:'#d6c25a'}})();
  return LIL_M[id]=Object.assign({grn:LIL_GRN},S)}
/* the colour of a fading lilac (deduced): the violets wash out a little bluer and greyer before the dried tissue (S.dry) takes over; whites to a
   buff; greens yellow (lifeCol) */
function lilWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.14||l>.88)return mix(c,'#cdbf9e',.5*w);
  if(h>=240||h<20)return l2h(h+((h<20?h+360:h)>285?-1:1)*Math.min(18,Math.abs(275-(h<20?h+360:h)))*.4*w,s*(1-.5*w),l+(.6-l)*.22*w);
  return l2h(h,s*(1-.4*w),l*(1-.12*w))}
if(typeof GHI!=='undefined'&&GHI['lilas'])GHI['lilas'].wilt=lilWiltCol;
function lilLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'lilas',rec:{}})):0}
/* genes of one panicle (svGenes, in this order): the florets' own (size, opening, roll, lobes' jitter seed, rank jitter, place in the cyme), the head */
const LIL_GENES={n:[[200,1]],tep:{dL:[.9,1.1],dt:[-.04,.04],roll2:[0,1.571],ph:[0,6.28],drk:[-.025,.025],da:[-.35,.35]},
  head:{phi0:[0,6.2832],H:[.94,1.06],op:[-.03,.03],sd:'sd'}};
/* the lilac for the kit */
const LIL_S={layout:'panicule',floret:'etoile',genes:LIL_GENES,mat:lilMat,wilt:lilWiltCol,dry:LIL_DRY,dryTint:.14,stem:['#30361e','#5a6a34','#86955a'],
  /* the panicle lengthens as it opens (h); 6 to 8 pairs of branches from 10 % to 88 % of its length; its half-width .3 of its length (H/W 1.65),
     widest at a fifth of its height; narrower in bud (tight); cymes of 3 to 5, a floret's limb .085 of the panicle's length (13 mm on 15 cm) */
  lay:{h:[.62,.38,.04,.8],z:[.1,.88],br:{n:[6,8]},dense:1.45,w:.3,wq:.2,wb:.55,wp:.85,tight:.5,tightAt:.75,fan:.82,rise:1.1,dens:1.4,cyR:.65,fpc:[4,7],
    up:.3,lift:.12,spread:.8,L:.085,taper:.25,k:[.74,1],ord:[.8,.13,.05],brW:.007,rr:.011,coreK:.52,coreV:.14,coreR:'bud',coreG:.15,grow:.45},
  /* the foot and lower branches first, the tip last; a floret opens over a quarter of the stage; the oldest fade first */
  law:{order:f=>f.rk,t0:.16,spread:.66,w:.26,ws:.75,late:.08},
  fl:{budAt:.3,bud:[.34,.22],budHW:1.15,tube:.62,tr:.045,lobes:4,wh:1,whK:.66,lobeL:.96,lobeW:.5,cA:1.28,cB:.82,notch:.04,hood:.22,a:[.3,1.6],ap:.08,
    eye:.05,dec:[.12,.35],dry:[.5,.3],green:[.15,.02,.2,.06],blob:.5,q1:16,tubeDry:.6,dot:1},
  lit:[.05,.95],ao:.42,budget:[170,420],cost:{0:0,1:[1,.5],2:[2.4,1.2]},slabs:3};
/* the lilac panicle: in the frame B (its axis B[2]) at O (its middle; o.foot: its foot), D its length in bloom */
function lilSvg(par,B,O,D,cwId,op,seed,wl,o){const cwx=(typeof L67_LIL!=='undefined'&&L67_LIL.find(x=>x.id===cwId))||{id:cwId,c:'#b58ccc'};
  return grDraw(par,B,O,D,LIL_S,cwx,op,seed,wl==null?lilLife():wl,o||{})}
SV_HEAD['lilas']=lilSvg;
/* the bouquet's chance drawn by the old panicle (l67Pan, lot 67): two draws for each floret it would have drawn (the same count, the same order) */
function l67PanR(B,O,Lp,op){const sd=((O[0]*.13+O[1]*.29)%6+6)%6,det=DET>=1.5,gr=.6+.4*sm01(op/.8),L=Lp*gr,Rb=L*.3;
  const rr=v=>Rb*(v<.2?Math.pow(Math.sin(v/.2*1.5708),.55):Math.pow(Math.max(0,(1-v)/.8),.78)),drr=v=>(rr(Math.min(1,v+.01))-rr(Math.max(0,v-.01)))/.02;
  const N=Math.round((det?150:96)*(LOD?.5:1)*Math.min(1.2,Math.pow(L/(16*UPC),1.1)));
  const cum=[0];for(let j=1;j<=40;j++)cum.push(cum[j-1]+rr((j-.5)/40));const vOf=u=>{const x=u*cum[40];let j=1;while(j<40&&cum[j]<x)j++;return(j-1+(x-cum[j-1])/((cum[j]-cum[j-1])||1))/40};
  for(let i=0;i<N;i++){const v=Math.min(.985,vOf((i+.5)/N)),az=i*2.39996+sd,n0=V3.nz([Math.cos(az),Math.sin(az),-drr(v)/L*.9]);if(V3.nz(toV(B,n0))[2]<-.3)continue;R(.88,1.12);R(0,6.28)}}
/* the panicle in a plant (l67Lilac's pan when SV_ON): the old draws consumed, then the kit's panicle from its foot, on a private seed */
function lilPanSv(par,B,O,Lp,cw,op,o,bk){l67PanR(B,O,Lp,op);return lilSvg(par,B,O,Lp,cw.id,op,svSeed('lilas',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(Lp*8)),lilLife(o),{foot:1,bk:bk||1})}
/* ---------- the plant (2026-10-08): a florist's cut stem, never roots ----------
   The wood (photos 65, 70, 72, 75, 76, 89): smooth, grey-brown on the old wood with fine pale lenticels, olive green on the year's shoot, which
   starts at a ring of bud-scale scars; the nodes a little swollen, the buds opposite, small. The stem about .07 of the panicle's width (photos 61,
   63, to the eye). The lower pair of leaves stripped (petiole stubs, their buds), the upper pair kept (deduced: the florist's way; no photograph
   of a cut stem found). The cut slanted, the wood pale in its thin bark, the pith a dot, split a little up the middle (deduced: florists split
   woody stems). */
const LIL_BARK=['#3a3328','#6a604e','#958a72','#bdb39a'];LIL_BARK.sv={swell:.03,gloss:.22,ribs:[-.5,.35]};
const LIL_SHOOT=['#34442a','#5c7234','#86a052','#b4c888'];LIL_SHOOT.sv={swell:.02,gloss:.3};
/* the stem drawn foot first, the young shoot's green from LIL_RING of its length (the ring of scars) to the panicle */
const LIL_RING=.36;
function lilStem(par,P,W,o){const g=G(par),n=P.length,B=Object.assign(LIL_BARK.slice(),{sv:Object.assign({},LIL_BARK.sv,{red:LIL_SHOOT[1],redF:Math.min(.95,LIL_RING+.06),redA:.92})});let tg=g;
  if(o.sheet){const a=P[0],b=P[Math.min(n-1,3)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,t=[(b[0]-a[0])/l,(b[1]-a[1])/l],nm=[-t[1],t[0]],L=W[0]*40,id='li'+(gid++),
      q=[[a[0]+nm[0]*L,a[1]+nm[1]*L],[a[0]+nm[0]*L+t[0]*L*4,a[1]+nm[1]*L+t[1]*L*4],[a[0]-nm[0]*L+t[0]*L*4,a[1]-nm[1]*L+t[1]*L*4],[a[0]-nm[0]*L,a[1]-nm[1]*L]];
    E('path',{d:'M'+q.map(p=>svJ([svR(p[0]),svR(p[1])])).join('L')+'z'},E('clipPath',{id},GDEF||defs));tg=G(g,{'clip-path':`url(#${id})`})}
  svStemLine(tg,P,W,B);if(LOD)return g;
  /* the lenticels on the old wood: short pale dashes across the stem; the ring of bud-scale scars */
  const S=[0];for(let i=1;i<n;i++)S.push(S[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const Lt=S[n-1],at=s=>{let i=1;while(i<n-1&&S[i]<s)i++;const k=(s-S[i-1])/((S[i]-S[i-1])||1),
      p=[P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k],t=[P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]],tl=Math.hypot(t[0],t[1])||1;return[p,[t[0]/tl,t[1]/tl],W[i-1]+(W[i]-W[i-1])*k]};
  let d='',k=0;const w0=W[0],step=w0*(DET>=1.5?.8:1.2),s1=Lt*(LIL_RING-.02);for(let s=w0*1.2;s<s1;s+=step*(.7+.6*pxHashS(k,2,n))){k++;const[p,t,w]=at(s),x=(pxHashS(k,3,n)*2-1)*.62*w/2,h=w*(.16+.14*pxHashS(k,5,n)),
      q=[p[0]-t[1]*x,p[1]+t[0]*x];d+='M'+svJ([svR(q[0]+t[1]*h/2),svR(q[1]-t[0]*h/2)])+'l'+svJ([svR(-t[1]*h),svR(t[0]*h)])}
  if(d)E('path',{d,fill:'none',stroke:'#d8d0b8','stroke-width':svF(Math.max(.1,w0*.1)),'stroke-opacity':.55,'stroke-linecap':'round'},tg);
  let dr='';for(const f of[-.012,0,.012]){const[p,t,w]=at(Lt*(LIL_RING+f)),h=w*.5,bw=w*.12;dr+='M'+svJ([svR(p[0]+t[1]*h),svR(p[1]-t[0]*h)])+'q'+svJ([svR(-t[1]*h-t[0]*bw),svR(t[0]*h-t[1]*bw),svR(-2*t[1]*h),svR(2*t[0]*h)])}
  E('path',{d:dr,fill:'none',stroke:'#3e3226','stroke-width':svF(Math.max(.08,w0*.06)),'stroke-opacity':.5},tg);return g}
/* the slanted cut (sheet): c = {f, e1, e2, n, r, pr} the foot, the cut plane's axes, its normal, the stem's radius, the projection: the pale wood
   in its thin bark and green cambium, a faint growth ring, the pith; the split up the middle; drying, it browns (deduced) */
function lilCut(par,c,wl){const g=G(par),dry=svSm((wl-.3)/.5),P=(x,y,s)=>{const q=[];for(let i=0;i<14;i++){const a=i/14*6.2832;q.push(c.pr(V3.add(c.f,V3.add(V3.sc(c.e1,c.r*(x+s*Math.cos(a))),V3.sc(c.e2,c.r*(y+s*Math.sin(a)))))))}return q},
    lit=Math.max(0,V3.dot(c.n,LIGHT)),wood=mix(mix('#d8ceac','#f0e8d2',lit),'#b49e78',dry),bark='#4e4234';
  E('path',{d:svSpl(P(0,0,1)),fill:wood,stroke:bark,'stroke-width':svF(c.r*.16)},g);if(LOD)return g;
  E('path',{d:svSpl(P(0,0,.84)),fill:'none',stroke:mix('#7e8e4a','#8a7448',dry),'stroke-width':svF(c.r*.06),'stroke-opacity':.8},g);
  E('path',{d:svSpl(P(.03,-.02,.55)),fill:'none',stroke:mix(wood,'#8a7a5a',.35),'stroke-width':svF(c.r*.04),'stroke-opacity':.6},g);
  E('path',{d:svSpl(P(.02,.01,.13)),fill:mix('#c2ac84','#8a7454',dry)},g);
  /* the split: from the cut's middle up the stem */
  const a=c.pr(c.f),b=c.pr(V3.add(c.f,V3.sc(c.ax,c.r*3.2)));E('path',{d:'M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])]),stroke:'#2e261e','stroke-width':svF(c.r*.09),'stroke-opacity':.75,'stroke-linecap':'round'},g);return g}
/* a stripped node: the two petiole stubs (cut pale at their end) and the small opposite buds in their axils */
function lilNode(par,N,w,pr){const g=G(par);let ds='',de='',db='';
  for(const s of N){const a=pr(s.pos),b=pr(V3.add(s.pos,V3.sc(s.H,s.l))),bb=pr(V3.add(V3.add(s.pos,V3.sc(s.up,w*.55)),V3.sc(s.H,w*.45)));ds+='M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])]);
    de+=`M${svR(b[0]-w*.16)},${svR(b[1])}a${svR(w*.16)},${svR(w*.16)} 0 1,0 ${svR(w*.32)},0a${svR(w*.16)},${svR(w*.16)} 0 1,0 ${svR(-w*.32)},0`;
    const t=[b[0]-a[0],b[1]-a[1]],tl=Math.hypot(t[0],t[1])||1,u=[t[0]/tl*w*.3,t[1]/tl*w*.3],v=[-t[1]/tl*w*.2,t[0]/tl*w*.2];db+=grEll(bb,u,v)}
  E('path',{d:ds,stroke:LIL_SHOOT[1],'stroke-width':svF(w*.42),'stroke-linecap':'butt',fill:'none'},g);
  if(!LOD){E('path',{d:de,fill:'#c8c49a'},g);E('path',{d:db,fill:'#6a5a36',stroke:'#3a3020','stroke-width':svF(w*.04)},g)}return g}
/* the leaf (photos 83 to 87, 133; Syringa vulgaris: opposite, ovate to broadly ovate, the base cordate to truncate, the tip acuminate, entire,
   glabrous; the petiole about a quarter of the leaf): its petiole along H, the blade's midrib bending down (droop, more when limp), the two halves
   raised a little into a V (fold) and twisted (tw); the top a matt dark green, the underside paler and greyer; the pale midrib; five pairs of
   arching veins (only large enough to see). Wilting: limp (hangs, the halves curl down), yellowing (lifeCol). W: the half-width x the blade */
const LIL_LEAF={pl:.24,W:.34,wp:[[-.07,.3],[0,.6],[.1,.86],[.24,1],[.4,.95],[.55,.8],[.7,.56],[.82,.33],[.9,.17],[.96,.06],[1,0]],droop:.5,fold:.2,tw:.35,
  up:['#1e3818','#386228','#5a8840'],low:['#4a6a3c','#728e5a','#98b07e'],mid:'#aebf82',midL:'#c4d0a0',pet:'#5c7838'};
function lilLeaf(par,pos,H,up,len,sd,wl){const o=LIL_LEAF,r=svRng(sd),g=G(par),limp=svSm((wl-.1)/.6),pl=len*o.pl,bl=len-pl,pr=q=>[q[0],-q[1]],dn=[0,-1,0],
    H0=V3.nz(H),s0=V3l(V3.cr(H0,up))>1e-3?V3.nz(V3.cr(H0,up)):[0,0,1],col=c=>wl>0?lifeCol(c,Math.min(1,wl*1.1)):c;
  /* the petiole, arching a little up; the blade leaves it angled down */
  const Pe=V3.add(V3.add(pos,V3.sc(H0,pl)),V3.sc(up,pl*.12)),pm=V3.add(V3.add(pos,V3.sc(H0,pl*.5)),V3.sc(up,pl*.1));
  let d0=V3.nz(V3.add(H0,V3.sc(dn,.2+.3*limp)));const tw0=(r()-.5)*2*o.tw,drp=o.droop*(.8+.4*r())+1.1*limp,nS=10,Sp=[],Tg=[],Sd=[],Nb=[];let p=Pe;
  for(let i=0;i<=nS;i++){const v=i/nS,dp0=V3s(dn,V3.sc(d0,V3.dot(dn,d0))),dp=V3l(dp0)>1e-3?V3.nz(dp0):s0,th=drp*Math.pow(v,1.4),T=V3.nz(V3.add(V3.sc(d0,Math.cos(th)),V3.sc(dp,Math.sin(th))));
    if(i)p=V3.add(p,V3.sc(V3.nz(V3.add(Tg[i-1],T)),bl/nS));let sd2=V3s(s0,V3.sc(T,V3.dot(s0,T)));sd2=V3l(sd2)>1e-3?V3.nz(sd2):s0;sd2=rotA(sd2,T,tw0*v);
    let nb=V3.nz(V3.cr(sd2,T));if(V3.dot(nb,up)<0&&i===0){}Sp.push(p);Tg.push(T);Sd.push(sd2);Nb.push(nb)}
  const at=v=>{const x=Math.max(0,Math.min(nS,v*nS)),i=Math.min(nS-1,Math.floor(x)),k=x-i;return[V3.add(Sp[i],V3.sc(V3s(Sp[i+1],Sp[i]),k)),Sd[Math.round(x)],Nb[Math.round(x)],Tg[Math.round(x)]]},
    Wm=bl*o.W,fold=o.fold*(1-limp)-.2*limp,mg=(v,s,wv)=>{const[q,sd2,nb,T]=at(Math.max(0,v)),b=v<0?V3.add(q,V3.sc(T,v*bl)):q,cw=wv*Wm,cu=fold+(v>.6?.25*limp*(v-.6):0);
      return V3.add(V3.add(b,V3.sc(sd2,s*cw*Math.cos(cu))),V3.sc(nb,Math.abs(cw)*Math.sin(cu)))};
  /* the two halves, far first; each its face (top or underside) lit on its own normal */
  const halves=[];for(const s of[-1,1]){const pts=[pr(Sp[0])];for(const[v,wv]of o.wp)pts.push(pr(mg(v,s,wv)));for(let i=nS-1;i>=1;i--)pts.push(pr(Sp[i]));
    const[,sd2,nb]=at(.35),nh=V3.nz(V3.add(V3.sc(nb,Math.cos(fold)),V3.sc(sd2,-s*Math.sin(fold)))),top=nh[2]>=0,nn=top?nh:V3.sc(nh,-1),lt=Math.max(0,(V3.dot(nn,LIGHT)+.35)/1.35),
      R3=top?o.up:o.low,c=lt<.5?mix(R3[0],R3[1],lt/.5):mix(R3[1],R3[2],(lt-.5)/.5),z=mg(.4,s,.6)[2];halves.push({pts,c:col(c),top,z})}
  halves.sort((a,b)=>a.z-b.z);
  E('path',{d:'M'+svJ([svR(pr(pos)[0]),svR(pr(pos)[1])])+'Q'+svJ([svR(pr(pm)[0]),svR(pr(pm)[1]),svR(pr(Pe)[0]),svR(pr(Pe)[1])]),fill:'none',stroke:col(o.pet),'stroke-width':svF(Math.max(.15,len*.026)),'stroke-linecap':'round'},g);
  for(const h of halves)E('path',{d:svSpl(h.pts),fill:h.c},g);if(LOD)return g;
  /* the midrib, and the veins of the half in front (when the leaf is large enough to show them) */
  const tp=halves[1].top;E('path',{d:svSpl(Sp.slice(0,nS).map(pr),false),fill:'none',stroke:col(tp?o.mid:o.midL),'stroke-width':svF(Math.max(.12,bl*.016)),'stroke-opacity':.85},g);
  if(Wm>3||DET>=1.5){let d='';for(const s of[-1,1])for(let k=0;k<5;k++){const v=.1+k*.15,a=pr(at(v)[0]),m=pr(mg(v+.1,s,.45)),b=pr(mg(Math.min(.97,v+.2),s,.82*o.wp.find(x=>x[0]>=Math.min(.97,v+.2))[1]));
      d+='M'+svJ([svR(a[0]),svR(a[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(b[0]),svR(b[1])])}
    E('path',{d,fill:'none',stroke:col(tp?o.mid:o.midL),'stroke-width':svF(Math.max(.08,bl*.007)),'stroke-opacity':.45},g)}
  return g}
/* the lilac plant in SVG (l67Lilac's branch when SV_ON): the L-system and the bouquet's chance as before; the organs drawn in the old order with
   the old draws (each panicle's, each leaf's), our stem, nodes, leaves and cut instead; no roots (STANDARD-RENDU 4 ter, 8 ter) */
function lilSvPlant(k,t,o,X){const{res,apex,cw,op,D,up,face,pan,sheet}=X,wl=lilLife(o),c0=res.chains[0],ci=lsCut(res,apex),off=V3s([0,0,0],apex),
    pr=q=>[q[0]+off[0],-(q[1]+off[1])],parts=[],ext=[],seed=svSeed('lilas-plante',cw.id,Math.round(apex[0]*10),Math.round(apex[1]*10));
  for(const ch of res.chains)ch.c=LIL_BARK;
  /* the stem, one piece from its foot to the panicle (smoothed as lsChainParts does); the twin's peduncle green */
  const sm=(pts,ws)=>{const P=[pr(pts[0])],W=[ws[0]];let z=pts[0][2]+off[2];
    for(let i=1;i<pts.length;i++){const q=pts[i],p0=pts[Math.max(0,i-2)],p1=pts[i-1],p3=pts[Math.min(pts.length-1,i+1)];z+=q[2]+off[2];
      for(const tt of[1/3,2/3]){const t2=tt*tt,t3=t2*tt,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*tt+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);P.push(pr([cr(0),cr(1),0]));W.push(ws[i-1]+(ws[i]-ws[i-1])*tt)}
      P.push(pr(q));W.push(ws[i])}return{P,W,z:z/pts.length}};
  const pts=c0.pts.slice(0,ci+1),S0=sm(pts,c0.ws.slice(0,ci+1));
  (NECK_X?ext:parts).push({z:S0.z,cast:false,ax:1,fn:par=>lilStem(par,S0.P,S0.W,{sheet})});
  for(const ch of res.chains.slice(1)){const S1=sm(ch.pts,ch.ws);parts.push({z:S1.z,cast:false,fn:par=>svStemLine(G(par),S1.P,S1.W,LIL_SHOOT)})}
  if(sheet){const f=pts[0],T3=V3.nz(V3s(pts[1],f)),vz=[0,0,1];let Vs=V3s(vz,V3.sc(T3,V3.dot(T3,vz)));Vs=V3l(Vs)>1e-3?V3.nz(Vs):[0,0,1];const CUT=.85,
      c={f,ax:T3,e1:V3.nz(V3.cr(T3,Vs)),e2:V3.add(Vs,V3.sc(T3,Math.tan(CUT))),n:V3.nz(V3.add(V3.sc(T3,-Math.cos(CUT)),V3.sc(Vs,Math.sin(CUT)))),r:c0.ws[0]/2,pr};
    parts.push({z:f[2]+off[2]+D,fn:par=>lilCut(par,c,wl)})}
  /* the organs, in the order and with the draws of the old drawing (lsPlant with l67Lilac's organ callback) */
  const stub=[];let nl=0;
  for(const og of res.organs){const pos=V3.add(og.pos,off);let dr=null;
    if(og.t==='K'){const Bf=l67Fr(V3.add(og.H,V3.sc(face,.12)),face,R(-.3,.3)),c=V3.add(pos,V3.sc(og.H,-D*.02));dr={parts:[{z:c[2],fn:par=>pan(par,Bf,c,D,op)}]}}
    else if(og.t==='Kb'){const a=og.p.age,Bf=l67Fr(V3.add(og.H,V3.sc(face,.2)),face,R(-.3,.3)),c=V3.add(pos,V3.sc(og.H,-D*.02));dr={parts:[{z:c[2]-1e-3,fn:par=>lilPanSv(par,Bf,c,D*R(.62,.78),cw,a,o,.55)}]}}
    else if(og.t==='Lv'){const len=D*(og.p.i?.8:.7)*R(.9,1.08),kk=nl++,low=og.p.i===1,sd=svSeed('lilas-feuille',cw.id,seed,kk),U=og.U||up;
      if(low)stub.push({pos,H:V3.nz(og.H),up,l:len*.07});
      dr={ext:1,parts:[{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>{R(-.08,.08);if(!low)lilLeaf(par,pos,og.H,up,len,sd,wl)}}]}}
    if(dr)(dr.ext&&NECK_X?ext:parts).push(...dr.parts)}
  if(stub.length)(NECK_X?ext:parts).push({z:stub[0].pos[2]+1e-3,cast:false,fn:par=>lilNode(par,stub,c0.ws[0]*.8,q=>[q[0],-q[1]])});
  if(NECK_X&&EXT)EXT.push(par=>drawParts(par,ext));else parts.push(...ext);drawParts(k,parts);
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
