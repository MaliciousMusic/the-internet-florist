/* ================= The genus Syringa in native SVG (y-syringa.js) =================
   One module per genus, one sheet per kind. The common lilac (Syringa vulgaris), sid 'lilas': the head is the whole inflorescence, a thyrse
   (panicle) drawn by the kit piece svPanicle (y3-panicule.js). Measured on photographs (refcache/lilas, targets.json): length over width about
   1.43, the narrow third about .81 of the broad one (a blunt cone, not a spire), the silhouette filling about .63 of its box; the florets small,
   four spreading lobes on a short tube, buds deeper in colour, opening from the base up; decussate side branches make the lumps of the outline.
   Fading (photographs 32, 131): the florets brown to ochre and tan, curl, fall; the branched axis shows; the head nods. */
/* each colourway: deep (valleys, throat), shade, body, lite (lobes in the light), the bud tones, the eye and the rachis.
   'ruhm-von-horstenstein' is measured (coloris.md: base #4e285f, body #5d396a, tip #68466c: the photographs' shade, kept for deep, eye, throat;
   the lit body from targets.json face.lab.corps.lilas, Lab 56/18/-17, the median of the silhouette, so the body a little above it); it is the cultivar of the catalogue's colourway 'lilas' (SKU lilas~0), which takes the same material. */
const SYR_CW={
  'ruhm-von-horstenstein':{deep:'#5d396a',shade:'#754884',body:'#a67eaa',lite:'#cdacd1',bud:'#7a448c',eye:'#4e285f',throat:'#68466c'},
  blanc:{deep:'#8e9278',shade:'#c6c2b4',body:'#eeece4',lite:'#fbfaf6',bud:'#dfe4c4',eye:'#c8c89a',throat:'#e4e2c8'},
  pourpre:{deep:'#3a1240',shade:'#5a2464',body:'#7a3a86',lite:'#a868b0',bud:'#4e1a5e',eye:'#2a0c30'},
  'pourpre-double':{deep:'#3e1238',shade:'#622458',body:'#8a3a7e',lite:'#b46aa8',bud:'#561c50',eye:'#2c0c28'},
  lavande:{deep:'#463a74',shade:'#6a5aa0',body:'#a99ad8',lite:'#d0c6f0',bud:'#6a5aa8',eye:'#322a5a'},
  'lilas-double':{deep:'#54386e',shade:'#7c5c9a',body:'#c3a2d6',lite:'#e2cfee',bud:'#8a5aa8',eye:'#3e2654'},
  rose:{deep:'#7a4458',shade:'#a8708a',body:'#e8b6cc',lite:'#f8dcea',bud:'#b86a8a',eye:'#6a3048'},
  sensation:{deep:'#3a1846',shade:'#5e2c6c',body:'#8a4a96',lite:'#b47ac0',bud:'#5a2268',eye:'#2a0c34'},
  'blanc-double':{deep:'#909478',shade:'#c8c4b6',body:'#f0eee6',lite:'#fcfbf8',bud:'#e6ead0',eye:'#cccca0',throat:'#e6e4cc'}};
SYR_CW.lilas=SYR_CW['ruhm-von-horstenstein'];
const SYR_M={};
function syrMat(cw){const id=cw&&cw.id||'lilas';if(SYR_M[id])return SYR_M[id];const S=SYR_CW[id]||(()=>{const c=cw&&cw.c||'#b58ccc',[h,s,l]=h2l(c);
    return{deep:l2h(h,s,l*.42),shade:l2h(h,s,l*.66),body:c,lite:mix(c,'#ffffff',.38),bud:cw&&cw.bud||l2h(h,s,l*.6),eye:l2h(h,s,l*.3)}})();
  return SYR_M[id]={deep:S.deep,shade:S.shade,body:S.body,lite:S.lite,budDeep:mix(S.bud,'#000000',.35),budShade:mix(S.bud,S.deep,.4),bud:S.bud,
    budLite:mix(S.bud,S.lite,.45),eye:S.eye,throat:S.throat||mix(S.shade,S.deep,.4),rachis:'#6a6248'}}
/* the colour of a fading lilac: purples and lilacs grey and brown to ochre-tan (photograph 32: #b38765..#927e5b), then brown-gold (131: #8d723d..#614c24);
   whites to ivory, then tan; greens yellow */
function syrWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.15||l>.86){let o=mix(c,'#e6d8b4',.7*w);if(w>.5)o=mix(o,'#a88a62',(w-.5)*.9);return o}
  /* 2026-10-09: the lilacs and purples, and the browns, go to tan then gold-brown at their own lightness (pale lobes tan, valleys dark brown),
     so that the dry florets keep their volume in the tones instead of one flat brown */
  const lt=.1+.66*l;let o=mix(c,l2h(30,.3+.12*(1-l),lt),Math.min(1,.85*w));if(w>.55)o=mix(o,l2h(40,.42,lt*.92),(w-.55)*.9);return o}
if(typeof GHI!=='undefined'&&GHI['lilas'])GHI['lilas'].wilt=syrWiltCol;
function syrLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'lilas',rec:{}})):0}
/* the genes: the pairs of side branches (their place dv, turn da, strength dL), the head's length, width, nod and turn */
const SYR_GENES={n:[[5,.2],[6,.35],[7,.3],[8,.15]],tep:{dv:[-.12,.12],da:[-.35,.35],dL:[.75,1.2],sd:'sd'},late:{},
  head:{rot:[0,6.2832],len:[.92,1.08],wd:[.9,1.1],nod:[.8,1.2],sd:'sd'}};
/* S_LILAS: the single common lilac. The silhouette keys are all written here (fit.py reads the sheet's own keys, the defaults are PAN_DEF's) */
const S_LILAS={genes:s=>svGenes(s,SYR_GENES),mat:syrMat,
  len:.92,wd:.37,up:.35,open:[.12,.8],
  /* 2026-10-09 retouch: the branched thyrse (photos 94, 124, 126: a cone of decussate side branches, each a rounded cluster, gaps between; buds packed
     at the top); faded (131, 32): the florets stay on, shrivelled and brown, the head sags a little */
  tree:1,vb:.1,r0:.72,pb:.6,pt:.95,tipR:.23,cap:[.02,.08],topV:.74,brRise:.6,clC:.72,clR:[.44,.3],sub:.22,fs:.23,
  droop:[.1,.22],shedK:.3,shrink:.18,fanK:.2,coreK:.45,fanShed:.08,tipL:.06,
  /* 2026-10-09 faded (critique: the outlined brown stars read as a cartoon): dried lilac florets shrivel shut into small crumpled brown tubes, no
     edge line, their volume from the tones (the lobes toward the light lighter, the others darker), the browns varied (fanVar) */
  fanFold:1.05,fanNarrow:.1,fanCrumple:.7,inkFan:1,fanClub:.1,pdDeep:.55,scal:.12,fanBody:.4,fanDots:.65};
/* the lilac head: the whole panicle, its base at the foot of the axis B[2], O the centre of the grown head, D its length scale */
function syrSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof L67_LIL!=='undefined'&&L67_LIL.find(x=>x.id===cwId))||{id:cwId,c:'#b58ccc'};
  return svPanicle(par,B,O,D,S||S_LILAS,cwx,op,seed,wl==null?syrLife():wl)}
SV_HEAD['lilas']=syrSvg;
/* the lilac of the bouquet, in place of l67Pan: the old drawing's share of chance is consumed (two draws per floret it kept, the same geometry),
   the first draws name the individual; the base stays at O (the old panicle grew from its foot along B[2]) */
function syrSvgPut(par,B,O,Lp,cw,op){const gr=.6+.4*sm01(op/.8),L=Lp*gr,Rb=L*.3,det=DET>=1.5,sd=((O[0]*.13+O[1]*.29)%6+6)%6;
  const rr=v=>Rb*(v<.2?Math.pow(Math.sin(v/.2*1.5708),.55):Math.pow(Math.max(0,(1-v)/.8),.78)),drr=v=>(rr(Math.min(1,v+.01))-rr(Math.max(0,v-.01)))/.02;
  const N=Math.round((det?150:96)*(LOD?.5:1)*Math.min(1.2,Math.pow(L/(16*UPC),1.1)));
  const cum=[0];for(let j=1;j<=40;j++)cum.push(cum[j-1]+rr((j-.5)/40));const vOf=u=>{const x=u*cum[40];let j=1;while(j<40&&cum[j]<x)j++;return(j-1+(x-cum[j-1])/((cum[j]-cum[j-1])||1))/40};
  let s=0,c=0;for(let i=0;i<N;i++){const v=Math.min(.985,vOf((i+.5)/N)),az=i*2.39996+sd,n0=V3.nz([Math.cos(az),Math.sin(az),-drr(v)/L*.9]),nv=V3.nz(toV(B,n0));if(nv[2]<-.3)continue;
    const a=R(.88,1.12),b=R(0,6.28);if(c<2)s=(Math.imul(s,7919)+Math.floor((a+b)*1e5))>>>0;c++}
  const S=S_LILAS,D=Lp/(S.len||PAN_DEF.len),ctr=PJ(B,O,[0,0,D*(S.len||PAN_DEF.len)/2]);
  return syrSvg(par,B,[ctr[0],-ctr[1],ctr[2]],D,cw.id,op,svSeed('lilas',cw.id,s),syrLife())}
/* ================= the lilac's plant: the cut shoot, its leaves (drawn by l67Lilac in s67a.js when SV_ON, the chance consumed as before) =================
   From the organ photographs of the brief (105, 121 leaves; 84, 85, 89 shoots; 32, 113 fading): the leaves in opposite decussate pairs, on a petiole about a
   quarter of the leaf, the blade ovate to broadly ovate, its base truncate to shallowly cordate, its tip drawn out (acuminate), the margin entire, smooth and
   hairless; above a mid to dark green, a little glossy, below paler and greyer with the midrib and 4 to 6 pairs of arching veins standing out; held out almost
   level (targets.json: about 83 degrees from the vertical, length over width about 1.9 with the petiole), the blade a little folded on its midrib, its
   tip sagging. The shoot: the year's growth under the panicle olive green, smooth, sparsely dotted with pale lenticels, the nodes a little swollen; the
   cut stem below is last year's wood, grey-brown, finely striate, its nodes marked by the scars of fallen leaves and a pair of plump brown-green buds.
   Fading: the leaves go limp and hang, roll their margins under, yellow from the tip and the edge, then turn ochre and tan (photograph 32: #b38765 .. #927e5b).
   The free settings (fit.py, refcache/lilas/space-plante.json) live in GHI.lilas. */
if(typeof GHI!=='undefined'&&GHI['lilas'])Object.assign(GHI['lilas'],{
  sw:.045,   /* the shoot's width under the panicle, x the panicle's length scale D */
  ang:60,/* the leaf's pitch from the shoot (degrees, the L-system's &) */
  L0:.72,L1:.8208,/* the whole leaf (petiole and blade), x D: upper pair, lower pair */
  pet:.2,/* the petiole's share of the leaf */
  lw:1.4,    /* the blade's length over its width */
  vb:.28,    /* where the blade is widest (share of its length) */
  base:.85,  /* the blade's width at its base, x its greatest width (truncate to cordate) */
  cord:.14,  /* the depth of the cordate base, x the blade's length */
  acu:.7,    /* how drawn out the tip is (0 plain ovate .. 1 long acuminate) */
  rise:.2,  /* the petiole and the blade's base lift above the leaf's direction */
  droop:.4,/* the blade's sag under its weight (toward the tip) */
  fold:.12,  /* the blade folded on its midrib (the halves rise) */
  wav:.025,  /* the margin's gentle wave, x the blade's length */
  face:.55,  /* how far the blade's base rolls its face toward the eye (share of the full turn) */
  hMin:.62,  /* the least share of its length a leaf shows on the screen (a leaf aimed at the eye turns aside) */
  tw:.3,     /* the twist along the blade (radians, with a random sign) */
  limp:.75   /* the extra sag of a fading leaf */
});
/* the shoot's colours [shade, body, light, sheen], styled for svStemLine: 0 the year's green shoot, 1 the woody cut stem */
function syrStemCols(wood){const c0=wood?['#3a2a1e','#6a4e38','#94755a','#c4ab8e']:['#36402a','#5a6a3e','#869460','#b9c290'],
    /* the green shoot browns as the panicle dries (a dried cut lilac: olive brown, greyed), never a fresh green under dry florets */
    fw=wood?0:.9*svSm((syrLife()-.3)/.45),c=fw>0?c0.map((x,j)=>mix(x,['#3a2c1e','#5c4a34','#83705a','#a8977e'][j],fw)):c0;
  c.sv=wood?{swell:.04,gloss:.22,ribs:[-.55,-.2,.25,.6],post:(g,cg,C,Wd,N,T,W0)=>syrStemMarks(g,cg,C,Wd,N,T,W0,1)}
    :{swell:.03,gloss:.34,ribs:[-.4,.45],post:(g,cg,C,Wd,N,T,W0)=>syrStemMarks(g,cg,C,Wd,N,T,W0,0)};return c}
/* the marks of a lilac stem: pale lens-shaped lenticels along it (sparse on the green shoot); on the wood, every internode, a leaf scar across the stem with its pair of buds
   (the pairs decussate: seen side-on, a bud at each edge; face-on, one bud on the face) */
function syrStemMarks(g,cg,C,Wd,N,T,W0,wood){const n=C.length;if(n<2||LOD)return;const det=DET>=1.5,step=W0*(wood?1.1:2.2)*(det?1:1.6);let acc=0,k=0,dl='',dd='';
  const node=W0*15,ph=Math.abs(C[0][0]*.21+C[0][1]*.13)%1;let accN=node*(.35+.5*ph),kn=0,ds='',dsl='';const buds=[];
  for(let i=1;i<n;i++){const sl=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);acc+=sl;accN+=sl;const w=Wd[i]/2;
    while(acc>=step){acc-=step;k++;const r1=pxHashS(k,11,n),r2=pxHashS(k,13,n);if(r2<.25)continue;const o=(r1*2-1)*.8*w,h=w*(.12+.1*r2),q=[C[i][0]+N[i][0]*o,C[i][1]+N[i][1]*o];
      dl+='M'+svJ([svR(q[0]-T[i][0]*h),svR(q[1]-T[i][1]*h)])+'l'+svJ([svR(T[i][0]*h*2),svR(T[i][1]*h*2)]);dd+='M'+svJ([svR(q[0]-T[i][0]*h+N[i][0]*w*.06),svR(q[1]-T[i][1]*h+N[i][1]*w*.06)])+'l'+svJ([svR(T[i][0]*h*2),svR(T[i][1]*h*2)])}
    if(wood&&accN>=node&&i<n-2){accN-=node;kn++;const a=[C[i][0]+N[i][0]*w,C[i][1]+N[i][1]*w],b=[C[i][0]-N[i][0]*w,C[i][1]-N[i][1]*w],m=[C[i][0]-T[i][0]*w*.35,C[i][1]-T[i][1]*w*.35];
      ds+='M'+svJ([svR(a[0]),svR(a[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(b[0]),svR(b[1])]);dsl+='M'+svJ([svR(a[0]+T[i][0]*w*.18),svR(a[1]+T[i][1]*w*.18)])+'Q'+svJ([svR(m[0]+T[i][0]*w*.18),svR(m[1]+T[i][1]*w*.18),svR(b[0]+T[i][0]*w*.18),svR(b[1]+T[i][1]*w*.18)]);
      buds.push([i,kn%2,w])}}
  const lw=svF(Math.max(.05,W0*.075));
  if(dd)E('path',{d:dd,fill:'none',stroke:'#2e2418','stroke-width':lw,'stroke-opacity':.25,'stroke-linecap':'round'},cg);
  if(dl)E('path',{d:dl,fill:'none',stroke:wood?'#d8ccb0':'#c8cf9e','stroke-width':lw,'stroke-opacity':wood?.6:.45,'stroke-linecap':'round'},cg);
  if(ds){E('path',{d:ds,fill:'none',stroke:'#2a2117','stroke-width':svF(W0*.14),'stroke-opacity':.5},cg);E('path',{d:dsl,fill:'none',stroke:'#cbbd9c','stroke-width':svF(W0*.07),'stroke-opacity':.45},cg)}
  /* the buds: plump ovoids of brown-green scales, a light on their upper side */
  for(const[i,face,w]of buds){const t=T[i],nn=N[i],bl=w*1.35,bw=w*.62,put=(x,y,dx,dy,s)=>{const L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,vx=-uy,vy=ux,P=[];
        for(let j=0;j<12;j++){const a=j/12*Math.PI*2,r=(1-Math.cos(a))/2,wd=bw*s*.5*Math.pow(Math.sin(Math.PI*Math.pow(r,.8)),.8)*(Math.sin(a)<0?-1:1);P.push([x+ux*bl*s*r+vx*wd,y+uy*bl*s*r+vy*wd])}
        E('path',{d:svSpl(P,true),fill:'#5e5232',stroke:'#2e2716','stroke-width':svF(w*.06),'stroke-opacity':.6},g);
        E('path',{d:'M'+svJ([svR(x+ux*bl*s*.2+vx*bw*s*.12),svR(y+uy*bl*s*.2+vy*bw*s*.12)])+'L'+svJ([svR(x+ux*bl*s*.8),svR(y+uy*bl*s*.8)]),stroke:'#a99a68','stroke-width':svF(w*.1),'stroke-opacity':.55,'stroke-linecap':'round',fill:'none'},g)};
    if(face){const q=C[i];put(q[0]+t[0]*w*.15,q[1]+t[1]*w*.15,t[0],t[1],.75)}
    else for(const s of[1,-1]){const q=[C[i][0]+nn[0]*w*s*.75,C[i][1]+nn[1]*w*s*.75];put(q[0],q[1],t[0]+nn[0]*s*.55,t[1]+nn[1]*s*.55,1)}}}
/* the swollen node of the green shoot: a darker band across the stem, a light rim above it */
function syrNode(par,og,pos,w){if(LOD)return;const H=V3.nz(og.H),x=pos[0],y=-pos[1],ax=[H[0],-H[1]],al=Math.hypot(ax[0],ax[1])||1,t=[ax[0]/al,ax[1]/al],nn=[-t[1],t[0]],r=w*.62;
  const arc=(o,s)=>{const a=[x+nn[0]*r+t[0]*o,y+nn[1]*r+t[1]*o],b=[x-nn[0]*r+t[0]*o,y-nn[1]*r+t[1]*o],m=[x+t[0]*(o-s*r*.45),y+t[1]*(o-s*r*.45)];return'M'+svJ([svR(a[0]),svR(a[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(b[0]),svR(b[1])])};
  E('path',{d:arc(0,1),fill:'none',stroke:'#2c3420','stroke-width':svF(w*.22),'stroke-opacity':.4,'stroke-linecap':'round'},par);
  E('path',{d:arc(w*.16,1),fill:'none',stroke:'#b5c08a','stroke-width':svF(w*.08),'stroke-opacity':.4,'stroke-linecap':'round'},par)}
/* the leaf's material: the upper face mid to dark green and a little glossy, the underside paler and greyer; fading, it yellows from the tip and the margin, then goes
   ochre and tan; cached by the fading step */
const SYR_LM={};
function syrLeafMat(wl){const q=Math.round(Math.max(0,Math.min(1,wl||0))*10);if(SYR_LM[q])return SYR_LM[q];const w=q/10,
    yel=v=>Math.max(0,Math.min(1,w*1.7-(1-v)*.55)),brn=v=>Math.max(0,Math.min(1,(w-.45)*2.2-(1-v)*.35)),
    col=(c,v,back)=>{let o=mix(c,back?'#b4ac64':'#9a9234',.85*yel(v));o=mix(o,back?'#b69470':'#9c7a52',.9*brn(v));return o};
  const F=[[0,'#466f2f'],[.4,'#3b6328'],[.8,'#406a2c'],[1,'#4a7433']],Bk=[[0,'#86a26c'],[.45,'#7c9963'],[1,'#83a068']];
  return SYR_LM[q]={stops:F.map(([v,c])=>[v,col(c,v,0)]),bstops:Bk.map(([v,c])=>[v,col(c,v,1)]),shade:mix('#13260b','#3a2c12',w),lite:mix('#b6d48c','#e2d49a',w),
    bshade:mix('#2e4620','#4a3a1c',w),blite:mix('#c4d6a8','#e6dcb4',w),rim:mix('#6f9a50','#b09868',w),cast:'#0d1a08',wrap:.28,amb:.3,dif:.7,sky:.16,trans:.22,
    ks:.2*(1-w),gloss:26,dark:[.86,.7,.54],da:.22,lit:[1.12],la:.2,darkLo:[.74],daLo:.3,litLo:[],laLo:.2,rw:.008,ro:.3,soft:.05,
    /* the midrib and the arching side veins: faint above, raised and paler below */
    veins:(s,front)=>{const V=[[[[[0,0],[0,.3],[0,.62],[0,.97]]],front?.011:.014,front?'#8db46a':'#d2dfb6',front?.5:.65]],sec=[];
      for(const v0 of[.03,.13,.25,.37,.5,.63])for(const sg of[-1,1])sec.push(v0<.05?[[0,v0],[sg*.42,v0+.03],[sg*.72,v0+.1],[sg*.86,v0+.2]]:[[0,v0],[sg*.4,v0+.1],[sg*.7,v0+.21],[sg*.84,v0+.31]]);
      V.push([sec,front?.005:.0065,front?'#7ea45c':'#c8d8aa',front?.36:.5]);return V}}}
/* the leaf's direction out from the shoot, held near level; a leaf aimed at the eye would be seen end-on, a short dark block: its direction is turned
   until it shows at least hMin of its length on the screen (x, y the screen, z the depth) */
function syrLeafOut(H,hMin){const o=V3.nz([H[0],H[1]*.4,H[2]]),h=Math.hypot(o[0],o[1]);if(h>=hMin)return o;
  const f=h>1e-3?hMin/h:0;return[h>1e-3?o[0]*f:hMin,h>1e-3?o[1]*f:0,(o[2]<0?-1:1)*Math.sqrt(Math.max(0,1-hMin*hMin))]}
/* one lilac leaf at a node: og the turtle at the leaf (H its direction, U, w the stem width), pos its foot on the shoot, len the whole leaf (petiole and blade),
   sd its own seed, wl fading 0..1. The petiole a short channelled stalk, the blade a sheet: an arching then sagging midrib, ovate with a truncate to cordate
   base and a drawn-out tip, folded a little on its midrib, a gentle wave, a twist; limp and rolled under as it fades */
function syrLeaf(par,og,pos,len,sd,wl){const P=GHI.lilas,r=svRng(sd),det=DET>=1.5,k=G(par),fw=svSm(((wl||0)-.15)/.55),UPW=[0,1,0],dn=[0,-1,0];
  const H=V3.nz(og.H),Lp=len*P.pet*r.in(.88,1.12),Lb=(len-Lp)*r.in(.94,1.04),hm=.5/(P.lw*r.in(.94,1.06))*Lb*(1-.12*fw);
  /* the leaf's direction: out from the shoot, lifted at the petiole */
  const out=syrLeafOut(H,P.hMin||0),d0=V3.nz(V3.add(out,V3.sc(UPW,P.rise+.15*r.in(-1,1)-.5*fw))),base=V3.add(pos,V3.sc(out,(og.w||2)*.45));
  /* the petiole: sags a little, more when limp; drawn as a short stem on the screen */
  const pp=[],pw=[],np=6;let p=base,d=d0;for(let j=0;j<=np;j++){if(j){const kk=Math.min(.6,(.08+.35*fw)*j/np);d=V3.nz(V3.add(V3.sc(d0,1-kk),V3.sc(dn,kk)));p=V3.add(p,V3.sc(d,Lp/np))}pp.push(p);pw.push(Math.max(.5,Lb*(.034-.012*j/np)))}
  const pc=['#2d4520','#4d7034','#76995a','#b0c890'];pc.sv={swell:.02,gloss:.3,ribs:[.2]};
  svStemLine(k,pp.map(q=>[q[0],-q[1]]),pw,pc);
  /* the blade's midrib: rising, then sagging toward the tip under its weight */
  const ns=14,sp=[],dv=[],tip0=V3.nz(V3.add(d,V3.sc(UPW,.05))),sag=Math.min(.95,(P.droop*r.in(.8,1.2))+P.limp*fw);p=pp[np];
  for(let j=0;j<=ns;j++){const v=j/ns,kk=Math.min(.95,sag*Math.pow(v,1.3)),dd=V3.nz(V3.add(V3.sc(tip0,1-kk),V3.sc(dn,kk)));if(j)p=V3.add(p,V3.sc(dd,Lb/ns));sp.push(p);dv.push(dd)}
  const at=(A,v,ext)=>{if(v<0)return ext?V3.add(A[0],V3.sc(dv[0],v*Lb)):A[0];const x=Math.min(1,v)*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))};
  /* the outline: broad base, widest at vb, the sides turning concave into the drawn-out tip */
  const vb=P.vb,half=v=>{if(v<vb)return P.base+(1-P.base)*Math.sin(v/vb*Math.PI/2);const t=(v-vb)/(1-vb);return Math.max(.012,Math.pow(Math.cos(t*Math.PI/2),.75)*(1-P.acu*.55*svSm((t-.4)/.6)))};
  const tw=P.tw*(r()<.5?-1:1)*r.in(.6,1.1)+fw*.5*(r()<.5?-1:1),fold=P.fold*r.in(.8,1.2),wph=r.in(0,6.28),wav=P.wav*(1+1.5*fw),roll=.35*fw,cord=P.cord*r.in(.7,1.2);
  /* the blade's roll at its base: a leaf held level and seen from the side would show only its edge (a false lanceolate sliver); like the photographed
     sprays, the blade turns part of its face (upper or under side) toward the eye, less when limp */
  const t00=V3.nz(dv[0]),s00=Math.abs(V3.dot(t00,UPW))>.97?V3.nz(V3.cr(t00,og.U)):V3.nz(V3.cr(t00,UPW)),n00=V3.nz(V3.cr(s00,t00));
  let a0=Math.atan2(V3.cr(n00,t00)[2],V3.cr(s00,t00)[2]);if(a0>Math.PI/2)a0-=Math.PI;if(a0<-Math.PI/2)a0+=Math.PI;a0*=(P.face||0)*(1-.4*fw)*Math.min(1,Math.hypot(out[0],out[1])/.85);
  const S=(u,v)=>{const au=Math.abs(u),vv=v-cord*Math.pow(au,1.3)*(1-svSm(v/.22)),c=at(sp,vv,1),t=V3.nz(at(dv,Math.max(0,vv))),
      sd0=Math.abs(V3.dot(t,UPW))>.97?V3.nz(V3.cr(t,og.U)):V3.nz(V3.cr(t,UPW)),n0=V3.nz(V3.cr(sd0,t)),a=a0+tw*v,side=V3.add(V3.sc(sd0,Math.cos(a)),V3.sc(n0,Math.sin(a))),nrm=V3.cr(side,t),hw=hm*half(v);
    const lift=fold*au*hw*(1-.5*v)+wav*Lb*Math.sin(3.2*Math.PI*v+wph+u*.8)*au*au-roll*au*au*au*hw*1.4;
    return V3.add(V3.add(c,V3.sc(side,u*hw)),V3.sc(nrm,lift))};
  const sh=svSheet(I3,[0,0,0],S,{nu:det?8:6,nv:det?18:11,mat:syrLeafMat(wl),veins:null});
  svDraw(k,[sh],{D:Lb*1.5,sd:.03,sb:.025,so:.3,shadow:det});return k}
