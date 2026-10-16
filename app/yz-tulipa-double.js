/* ================= The double late tulip in native SVG (yz-tulipa-double.js), on the rosette kit (y3-rosette.js) =================
   Tulipa, Double Late Group (division 11), the "peony-flowered" tulip of the catalogue (sid tulipe-double). Measured on the photographs of
   refcache/tulipe-double-forme (forme.md; 44 studio photographs, the rest from gardens): 17 to 23 tepals seen from above on four flowers,
   about 24 in all, in staggered whorls of six that overlap without order, the outer ones long, broad and firm, the inner ones smaller and crumpled; no calyx. The bud an upright egg (1.6 to 1.8
   as high as wide, widest about its middle), green from the foot, the colour coming from the tip; the cut flower a full goblet (H/W about 1.2)
   whose outer tepals widen into a bowl (about 1.0), then a peony, wider than high (0.8 to 0.9), the outer tepals leaning out to 80-90 degrees and
   the heart hidden under the crown of the inner ones. Its decline (photographs 44, 45, 46, 52, 53; the angles partly from single tulips): the outer
   tepals part, hang and fall one by one; the heavy head nods on its lengthening neck; the dense crumpled core stays to the end.
   The common tulip parts come from y-tulipa.js (tulWiltCol, TULS_SC, tulNeckBend, svStrapLeaf); this file never changes them. */
/* each colourway (S), measured on the studio photographs of its variety (coloris.md; Jan de Wit en Zonen, N2): the inner face of the tepals c (body), b (the
   vivid foot), p (the tip), the margins m (pale on most doubles), the back r (default c, paler toward the tip; bp its tip), the green flush g on the backs
   of the outer tepals (its colour fc), the margin line rc (rw its width, ra its opacity), a ramp ft of the front face [[v, colour]...] along the tepal
   (v 0 foot .. 1 tip, null: the tepal's own tone) for the patterns that run along it (flames, tips washed with pink, the white of a picotee), sh/li the
   shade and light of the washes (default from c and p); the heart: anthers an, filaments fi, pollen po, ovary ov, stigma sg. Shape and plant are the
   modeller's: only colours here. The first twelve keep the catalogue's ids and order (the SKU numbers do not move); the late seven follow. */
const TDBS={
  /* the twelve of the catalogue */
  'rose-pale':{b:'#c48f9d',c:'#c89ea7',p:'#cea9b0',m:'#f0dde4',r:'#d3ccbe',g:.3,fc:'#a8ba86'},
  blanc:{b:'#e5edc7',c:'#e0e9c7',p:'#d9e3be',m:'#f3f5e8',r:'#d2dabb',g:.34,fc:'#8fa863',an:'#c8b04a',fi:'#e2dca0',po:'#eedc78',ov:'#c4cc8a',sg:'#ece6b0'},
  abricot:{b:'#e8784a',c:'#f49a56',p:'#ecaa86',m:'#f6cdb2',r:'#ebab8d',g:.12,fc:'#a8a05c'},
  peche:{b:'#f0a874',c:'#f2ae84',p:'#f2a088',m:'#fbe0c8',r:'#f4bf9c',g:.12,fc:'#c6c068',ft:[[0,'#f2cc86'],[.5,null],[1,'#f19a82']]},
  'rose-vif':{b:'#f26eb8',c:'#d588a1',p:'#d37fa3',m:'#f4c4da',g:.22,an:'#c9a63a',fi:'#e6dc9a',po:'#f2d66a',ov:'#b8c47a',sg:'#ece2a0'},
  jaune:{b:'#f6dc00',c:'#ecce00',p:'#efd524',m:'#f3e27a',r:'#e8d24a',g:.15,fc:'#9ab43a'},
  orange:{b:'#f56a12',c:'#ea7634',p:'#ee8a4c',m:'#f6bb86',r:'#e98e55',g:.38,fc:'#748f4e',ft:[[0,'#f0b04a'],[.5,null],[1,'#f09a60']]},
  rouge:{b:'#d4190d',c:'#d2100a',p:'#cd2c22',m:'#d84a3e',r:'#b8281e',g:.1,fc:'#6f8a3e'},
  lilas:{b:'#c277ad',c:'#b97fac',p:'#ba8eb1',m:'#dcc0d6',r:'#c59ab9',g:.2},
  mauve:{b:'#c674b2',c:'#b962a1',p:'#c07aaf',m:'#cfa8c4',r:'#b58aa6',g:.2},
  bordeaux:{b:'#512529',c:'#4c2327',p:'#5e3036',m:'#7a4a50',r:'#47222a',g:.1},
  noir:{b:'#4a313c',c:'#3f2b33',p:'#4e3a44',m:'#5e4452',g:.1,an:'#2a2026',fi:'#4a3a3a',po:'#5a4a40',ov:'#6a7040',sg:'#8a8050'},
  /* the late seven (late:1) */
  'blanc-rouge':{b:'#e8e6dc',c:'#e4e0d6',p:'#e6e2d8',m:'#f2eee6',r:'#e2d6cf',g:.06,li:'#faf6f0',sh:'#9a8c88',rc:'#a8323e',rw:.013,ra:.6,
    ft:[[0,'#efede4'],[.3,'#e8e4da'],[.55,'#e0b0ac'],[.8,'#c4646c'],[1,'#a82e3c']]},
  'blanc-framboise':{b:'#ccd0b6',c:'#d4d8c0',p:'#d8dac8',m:'#ebe9dc',r:'#d3d6c0',g:.2,fc:'#a7b680',sh:'#8d8f80',rc:'#9a6aa4',rw:.019,ra:.85,
    ft:[[0,'#ccd0b6'],[.5,null],[.88,'#d6d6c6'],[1,'#c8b0cc']]},
  'creme-rose':{b:'#dcc880',c:'#e2cc98',p:'#e6ada3',m:'#eebdb4',r:'#e8bfae',g:.12,fc:'#b8b86a',rc:'#e0a0a0',ft:[[0,'#e5d28a'],[.5,null],[1,'#e6ada3']]},
  corail:{b:'#e64560',c:'#f24a66',p:'#ef5f7a',m:'#f0909c',r:'#e47688',g:.12,fc:'#7b9a52'},
  'jaune-orange-flamme':{b:'#df7947',c:'#e1835a',p:'#eaaf98',m:'#f0c4a8',r:'#dc8f66',g:.28,fc:'#7a8a30',rc:'#c8452a',
    ft:[[0,'#e8b45e'],[.3,'#e48a52'],[.65,'#cf5a38'],[1,'#e9a688']]},
  'violet-bleute':{b:'#873081',c:'#aa4c98',p:'#b86aa5',m:'#c08cc4',r:'#8e5a95',g:.1,fc:'#667a58',an:'#3a2a40',fi:'#b8a0c0',po:'#6a5878'},
  'jaune-bord-rouge':{b:'#e4d018',c:'#ecd820',p:'#f0dd40',m:'#f0e07a',r:'#e3d24a',g:.34,fc:'#7d9b13',rc:'#c8686a',rw:.01,ra:.7}};
const TDB_M={};
function tdbMat(cw){if(TDB_M[cw.id])return TDB_M[cw.id];const S=TDBS[cw.id]||{b:cw.c,c:cw.c,p:cw.c,m:mix(cw.c,'#ffffff',.4),g:cw.g||.2},[h,s,l]=h2l(S.c),dark=l<.3,
    sat=s>.7&&l>.3&&l<.68,shade=S.sh||(l>.72?mix(S.c,'#5c5a6c',.5):sat?l2h(h-6,s,l*.42):l2h(h,Math.min(1,s*1.1),l*(dark?.45:.4))),
    lite=S.li||(sat?l2h(h,s,Math.min(.85,l+.16)):mix(S.p,dark?'#c890aa':'#ffffff',dark?.3:.42)),rim=S.rc||mix(S.m,S.p,.25),gC='#8aa45a',
    R=S.r||S.c,bp=S.bp||S.p;
  return TDB_M[cw.id]={fr:[[0,mix(S.c,S.b,.45)],[.55,mix(S.c,S.b,.6)],[1,mix(S.b,S.m,.2)]],bk:[[0,mix(R,gC,S.g*.45)],[.3,mix(R,bp,.4)],[1,mix(bp,S.m,.3)]],
    shade,lite,bshade:mix(shade,'#4a4a52',.18),blite:mix(lite,'#ffffff',.2),rim,brim:mix(rim,S.c,.45),rimW:S.rw||.011,rimA:S.ra||(dark?.3:.5),cast:mix(shade,'#000000',.5),
    edge:mix(shade,S.c,.3),vein:null,fl:Math.min(.6,S.g*1.8),flC:S.fc||'#7d9b4c',ft:S.ft||[[0,S.b],[.5,null],[1,S.p]],anth:S.an||'#c9a63a',fil:S.fi||'#e2dc9a',pol:S.po||'#f0d66a',ov:S.ov||'#b8c47a',sg:S.sg||'#ece2a0'}}
/* the stem: smooth, pruinose, a little yellower than the leaves (photos: shade #406b33, body #4f7913 to #5a851c, light #7ba13a; the peduncle paler
   in the light), cut straight at its foot (TDB_SC, the stem below the neck) ; the neck the same without the cut */
const TDB_SC=['#3b5e36','#5b8244','#8fb066','#c9d8ae'],TDB_NC=TDB_SC.slice();TDB_SC.sv={swell:.025,gloss:.32,cut:.3,cutC:'#e2e8c8'};TDB_NC.sv={swell:.025,gloss:.32};
/* the fading colours. Stem and leaves (the tulip's own tulWiltCol would give the olive brown of the common wilt): the greens yellow, then pale to straw as
   they dry (photos 151, 152: a bare stem gone cream, leaves yellowing from the tip). The tepals (tdbPetalWilt, photos 44, 46, 49, 96 of forme.md): the whites
   and pale colours turn ivory, then a stained beige (the rim of the dry head 96, #ab9078); the reds and roses go dull, dusty, then rust and a grey brown
   (#a0543a, #625e51 of 49 and 96); the yellows to ochre; the dark ones (noir, bordeaux) stay dark, a little browner (the dense core of the dry head, #3c3324) */
function tdbPetalWilt(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l>.7&&s<.55){let o=mix(c,'#eadcb8',.7*w);if(w>.45)o=mix(o,'#c4a880',Math.min(1,(w-.45)*1.1));if(w>.8)o=mix(o,'#ab9078',(w-.8)*1.5);return o}
  if(l<.34){let o=mix(c,'#4e4034',.6*w);if(w>.8)o=mix(o,'#3c3324',(w-.8)*1.5);return o}
  let o=tulWiltCol(c,w);if(w>.8&&l>=.16)o=mix(o,'#625e51',(w-.8)*1.5);return o}
function tdbWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);if(!(h>=55&&h<175&&s>.12&&l>=.16))return tdbPetalWilt(c,w);
  let o=l2h(h+(50-h)*Math.min(1,w*1.25),s*(1-.2*w),l+(.56-l)*.45*w);if(w>.6)o=mix(o,'#cdbf90',(w-.6)*1.3);return o}
if(typeof GHI!=='undefined'&&GHI['tulipe-double']){GHI['tulipe-double'].wilt=tdbWiltCol;Object.assign(GHI['tulipe-double'],{sc:TDB_SC,sw:7})}
/* how far the double tulip has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function tdbLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'tulipe-double',rec:{}})):0}
/* the heart: the tulip's six stamens and pistil (svHeart6), small for so wide a flower, hidden under the crown until the flower is wide open or declines */
const TDB_H6=svHeart6({ovH:.26,ovR:.06,ovT:.82,sgR:.07,filL:.17,filR:.05,filW:.035,filA:.15,anL:.17,anW:.026,hide:-2,lo:1,budMax:.2});
/* the tone of a tepal. The rosette gives each piece ONE tone (its rank's colour, lit); here, when the rosette sets it, the head gives it more: the front face runs
   along the tepal from its foot to its tip (mt.ft: the colourway's base and tip, or its own pattern: flames, tips washed with pink), the backs of the outer
   whorls (the second one at half strength) rise from a green foot (the flame), and a fading head takes the faded colour of each stop (tdbPetalWilt, by ctx.dec
   and ctx.fan). Each stop is the lit tone shifted by the stop's colour minus the rank's own colour (the young bud's green stays in it; in the shade the shift
   is scaled down by the tone's lightness, so that a dark part of a faded head does not go black), so the light is kept; a gradient is made only where the
   stops differ (a flat colourway costs nothing), and none at low detail (the tone is only shifted). The setter is the rosette's last word on the tone */
function tdbPaint(ctx){const mt=ctx.cw,N=Math.max(2,ctx.g.n||24),wc=Math.min(1,.45*(ctx.dec||0)+.75*(ctx.fan||0)),a0=(mt.fl||0)*(1-.7*(ctx.fan||0)),lod=typeof LOD!=='undefined'&&LOD,
  lum=c=>(c[0]+c[1]+c[2])/3,add=(T,d,k)=>hs(hx(T).map((v,i)=>v+d[i]*k)),dl=(C,c2)=>{const t=hx(tdbPetalWilt(C||c2,wc)),b=hx(c2);return t.map((v,i)=>v-b[i])},
  hook=it=>{let t0=it.tone,url=null;const front=it.s>0,fl=!front&&a0>=.03&&!lod&&it.f<=11.5/(N-1),fa=it.f>5.5/(N-1)?a0*.5:a0;
    Object.defineProperty(it,'tone',{configurable:true,enumerable:true,get:()=>url||t0,set:v=>{url=null;t0=v;if(typeof v!=='string'||v.length!==7)return;
      const c2=svrC(front?mt.fr:mt.bk,it.f),k=Math.min(1,lum(hx(v))/Math.max(40,lum(hx(c2)))),dm=dl(null,c2),T=add(v,dm,k);t0=T;
      if(front){if(lod)return;const ds=mt.ft.map(([x,C])=>[x,C?dl(C,c2):dm]);if(Math.max(...ds.map(([,d])=>Math.max(...d.map((q,i)=>Math.abs(q-dm[i])))))<7)return;
        /* a stop the gradient would reach by itself between its neighbours is not written (the file's weight) */
        const st=ds.filter(([x,d],i)=>{if(!i||i===ds.length-1)return true;const[x0,d0]=ds[i-1],[x1,d1]=ds[i+1],t=(x-x0)/(x1-x0);return Math.max(...d.map((q,j)=>Math.abs(q-d0[j]-(d1[j]-d0[j])*t)))>=8});
        url=svFaceFill(it.sh,st.map(([x,d])=>[x,add(v,d,k)]),ctx.D)}
      else if(fl)url=svFaceFill(it.sh,[[0,mix(T,mt.flC,fa)],[.25,mix(T,mt.flC,fa*.6)],[.55,T]],ctx.D)}})};
  for(const it of ctx.items)if(it.kind==='pet'&&it.grp==='p')hook(it)}
function tdbHeart(ctx){tdbPaint(ctx);if(!(ctx.dec>.12||ctx.op>.93))return;const pieces=[];
  TDB_H6({B:ctx.B,O:ctx.O,R0:ctx.R0,g:ctx.g,cw0:ctx.cw,o2:ctx.o,bud:ctx.bud,dec:ctx.dec,fan:ctx.fan,pieces});for(const p of pieces)if(p.fn&&p.proxy)ctx.items.push(svrFn(p.fn,p.proxy))}
/* genes (svGenes, draws in this order): the tepals' count, each tepal's share, the head's; then by rank, the inner tepals more crumpled and irregular */
const TDB_GENES={n:[[27,.3],[30,.4],[33,.3]],tep:{dL:[.75,1.25],dW:[.75,1.28],dph:[-.28,.28],da0:[-.12,.12],da1:[-.22,.22],tw:[-.22,.22],wav:[.05,.13],wk:[1.4,3.2],wph:[0,6.28],
    tip:[2.2,3],asym:[-.14,.14],cup:[.75,1.35],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},head:{rot:[0,6.2832],op:[-.04,.04],dh:[-3,3],ds:[-.04,.04],dl:[-.02,.02],stL:[.92,1.08],sd:'sd'}};
function tdbGenes(s){const g=svGenes(s,TDB_GENES),N=g.n;g.tep.forEach((t,i)=>{const f=N>1?i/(N-1):0,k=.7+.8*f;t.wav*=.4+1.6*f;t.tw*=.5+.9*f;t.dph*=.75+1.3*f;
    t.da0*=.9+.6*f;t.da1*=.9+1*f;t.dL=1+(t.dL-1)*k;t.dW=1+(t.dW-1)*k;t.cup=1+(t.cup-1)*(.5+f);t.asym*=.5+f});return g}
/* SVR_TDBL: the rosette by rank (f 0 the outer tepals .. 1 the heart's), in staggered whorls of six */
const SVR_TDBL={genes:tdbGenes,mat:tdbMat,heart:tdbHeart,life:()=>tdbLife(),phy:'whorl',nw:6,fW:1,thin:[.5,4],thinW:1.12,
  /* the tepals: outer long and broad (a tulip's obovate tepal, a narrow foot), inner ones shorter, narrower, inserted a little higher */
  L:[[0,1.38],[.18,1.22],[.45,1.12],[.75,.92],[1,.7]],W:[[0,1.3],[.18,1.05],[.35,.92],[.7,.68],[1,.5]],r0:[[0,.2],[.2,.13],[.5,.1],[1,.04]],z0:[[0,-.02],[.4,.08],[1,.24]],cup:[[0,.5],[.4,.62],[1,.72]],
  vb:.6,claw:[.54,.6],midA:[.16,.2],clawK:.8,aPow:2.2,lap:.15,vTrim:[[0,0],[.2,0],[.3,.15],[1,.25]],
  /* the angles (radians from the axis), foot a0 and tip a1, closed (c) and open (o), one value per whorl (fW): the goblet (outer foot flared, sides
     upright, tips in), then the globe: the outer tepals leave the foot at 50-57 degrees, stay out (aPow: they turn late) and curve in at the top; never
     past 60 degrees, or a front tepal seen from 30 degrees above folds over itself (its foot's edge becomes a straight line across the head),
     never open at the tip (a tip along the eye shows its rounded top as a straight edge); each whorl within more upright, the inner ones
     arching over the heart a little above the outer rim (the dome) */
  a0c:[[0,.45],[.18,.45],[.45,.4],[1,.2]],a0o:[[0,1],[.18,.56],[.45,.42],[.7,.32],[1,.24]],a1c:[[0,-.45],[.18,-.3],[.45,-.3],[1,-.75]],a1o:[[0,-.15],[.18,.14],[.45,-.06],[.7,-.22],[1,-.45]],oTip:1.6,
  wA0:[[0,.35],[1,.45]],wA1:[[0,.7],[1,.8]],oLaw:[.3,.2,.85,.5],
  /* the bud: an upright egg, 1.6 to 1.8 as high as wide, widest about its middle, the six outer tepals wrapping it */
  bud:[.12,.36],budH:[1.2,.25],budR:.28,budE:[.05,.9],budP:.85,budW:1.5,budIn:.42,budVis:.2,budT:0,budFace:.7,faceSm:2,budCore:.6,
  /* life: the outer tepals part and hang, then fall one by one (the outer 60 percent of the ranks), the dense core stays; the head nods */
  dec:[.12,.4],fan:[.55,.22],shed:[.72,.22],shedF:.6,shedK:.1,limp:[1,.2],limpF:.85,fanK:[.12,.12,.4],tip:[[.15,.2,.4],[.5,.55,.3]],sag:[.04,.12,.25],
  wav:[.7,.35,.6],rev:[.1,.15],crk:[.015,.04],curl:[.06,.14],brown:'#7a5a3a',edgeB:[.15,.4],
  green:[.75,.04,.22],greenC:'#7f9e52',
  /* a waxy satin, a little translucent */
  light:{wrap:.32,amb:.3,dif:.68,sky:.14,ks:.1,gloss:16,trans:.24}};
/* the double tulip head, in the frame B at O, D across, opening op, wilted wl (by default the bouquet's stage); S its sheet */
function tdbSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_TDBL!=='undefined'&&CW_TDBL.find(x=>x.id===cwId))||{id:cwId,c:'#e2457e'};
  return svRosette(par,B,O,D,S||SVR_TDBL,cwx,op,seed,wl==null?tdbLife():wl)}
SV_HEAD['tulipe-double']=tdbSvg;
/* the bouquet's double tulip: the old drawing's share of the chance (24 tepals x 5 draws, s9a.js tulipDrawn), its first draws naming the individual */
function tdbSvgPut(par,B,O,D,cw,op,o){let s=0;for(let i=0;i<120;i++){const x=rnd();if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return tdbSvg(par,B,O,D,cw.id,op,svSeed('tulipe-double',cw.id,s),tdbLife(o))}
/* the head on its stem (called by tulipHead, s9a.js, with the same draws in the same order): the fleshy peduncle rises and bends toward where the
   flower looks (the bowl seen three-quarters), the neck lengthening and bending over as it fades under the heavy head */
function tdbHead(g,t,o,c){const{cw,op,Dm,k,gh,up,ax,Lq,U0}=c,sw=Dm*.058,aim=V3.nz(V3.add(V3.sc(ax,.6),V3.sc(up,.75)));
  /* the neck starts at the stem's own width (the turtle's first width is what the stem below takes, lsNeck nw) and flares under the head */
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.14,c:TDB_NC}],['F',{l:Lq*.55,w1:sw*1.3,aim,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,w:sw*1.12,wig:.035,seg:Dm*.22}),og=res.organs[0];
  /* the neck bends only on the sheets: in a bouquet the layout measures each head (a lower one is raised and drawn again, which would move the
     bouquet's chance); there the bouquet's own nod and the head's tip bow it */
  if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)tulNeckBend(res,og,tdbLife(o));const apex=og.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:TDB_NC,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>tdbSvgPut(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,o)}]})});
  open(k,t,1000,6,.35);const r=lsNeck(res,[0,0,0],apex);r.ncols=TDB_SC;return r}
/* the leaves (photos t139, t138, t134, t137): broad, lanceolate, glaucous grey-green (upper face #558052 to #6b9d6d, darker than the lower), parallel-
   veined, the margins strongly waved (5 to 8 undulations a side), channelled, clasping the stem with a short sheath. Up a cut stem: the lowest broad
   and spreading (L/W ~4), a middle one (~5), the upper narrow and upright (~6.5), the peduncle bare above. The bouquet places one or two (STEML, its
   draws unchanged): the lowest call adds the broad leaf below it, on the other side, so a stem carries two or three. */
const TDB_LF=[{L:1.3,w:.26,lean:.62,droop:.55,gut:.95,wav:.16,wn:[7,9],hood:.3,roll:.6},{L:1,w:.205,lean:.48,droop:.45,gut:.9,wav:.13,wn:[6,8],hood:.3,roll:.5},
  {L:.82,w:.155,lean:.36,droop:.3,gut:.85,wav:.09,wn:[5,6.5],hood:.36,roll:.4}];
/* one leaf of kind q (TDB_LF) with its foot at screen (x,y) on a stem going toward ta (screen radians, toward the head), leaving on side (unit, view space) */
function tdbLeaf1(par,x,y,ta,side,len,q,k,sd){const wl=tdbLife(),yl=svSm((wl-.3)/.5),H=[Math.cos(ta),-Math.sin(ta),0],h=pxHashS(k,3,sd),Out=V3.nz(V3.add(side,[0,0,.16+.24*h])),sg=side[0]*H[1]-side[1]*H[0]>0?1:-1;
  return svStrapLeaf(par,[x,-y,0],H,Out,{len:len*q.L,w:q.w*(.92+.16*pxHashS(k,4,sd)),wp:[[0,.42],[.06,.6],[.25,.94],[.42,1],[.65,.82],[.85,.48],[1,0]],sheath:.09,sr:2.6,
    lean:q.lean*(.9+.2*h),droop:q.droop,tw:.3,gut:q.gut,wav:q.wav,wavN:q.wn[0]+(q.wn[1]-q.wn[0])*pxHashS(k,5,sd),hood:q.hood,roll:q.roll*sg,bloom:.7,
    up:mix('#5c8559','#a39a50',.3*yl),low:mix('#86a688','#c4b872',.3*yl),base:mix('#a3bb96','#c8bd80',.3*yl),sd:svSeed('tulipe-double-feuille',sd,k),wl})}
const TDB_SHEET=typeof location!=='undefined'&&/[?&]plant=1(&|$)/.test(location.search||'');
function tdbLeafSv(par,x,y,ang,len,o){const ta=o.ta,H=[Math.cos(ta),-Math.sin(ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,sd=Math.round(x*7+y*13),g=G(par);
  /* the lowest call: first the broad leaf a little lower, on the other side; then this one as the middle leaf. Higher calls: the narrow upper leaf, set
     a little lower than the bouquet puts it (the peduncle is bare over its top half) */
  /* (the plant sheet, svtStem, may put the lowest call at the cut itself: there the pair is raised by as much, the broad leaf just above the cut) */
  if(k===0){const up=TDB_SHEET?.36*len:0,d=up-.36*len;
    tdbLeaf1(g,x+Math.cos(ta)*d,y+Math.sin(ta)*d,ta,V3.sc(side,-1),len,TDB_LF[0],k+7,sd);tdbLeaf1(g,x+Math.cos(ta)*up,y+Math.sin(ta)*up,ta,side,len,TDB_LF[1],k,sd)}
  else{const d=-.12*len;tdbLeaf1(g,x+Math.cos(ta)*d,y+Math.sin(ta)*d,ta,side,len,TDB_LF[2],k,sd)}
  return g}
if(typeof STEML!=='undefined'&&STEML['tulipe-double'])STEML['tulipe-double'].sv=tdbLeafSv;
/* the colourways of the catalogue: the twelve keep their id and their place (the SKU numbers do not move), their name now says the variety measured
   (the name of a variety registered at the KAVB is a free denomination; no series name under a trade mark, no (R) or (TM)) and corrected where the photograph
   of the variety does not say the old name (a name that misleads is corrected: Britt, a vivid pink with pale margins, is no peach; Uncle Tom is a very dark brown
   burgundy, Black Hero an aubergine black, Copper Image a coppery apricot, Mount Tacoma a greenish cream white, Shirley Double a white edged with violet);
   the swatch is the tone the rosette gives its tepals (between the body and the foot measured on the studio photograph). Seven late colourways (late:1) follow, after the others, by push as the ranunculus does. */
if(typeof CW_TDBL!=='undefined'){const NM={'rose-pale':'Rose pâle (Angélique)',blanc:'Blanc crème verdâtre (Mount Tacoma)',abricot:'Abricot cuivré (Copper Image)',peche:'Pêche (Zantucharme)',
    'rose-vif':'Rose vif (Voque)',jaune:'Jaune (Yellow Pompenette)',orange:'Orange plumeté de vert (Orange Princess)',rouge:'Rouge (Miranda)',lilas:'Lilas rosé (Katinka)',
    mauve:'Mauve rosé (Lilac Perfection)',bordeaux:'Bordeaux très sombre (Uncle Tom)',noir:'Noir aubergine (Black Hero)'},
    LATE=[['blanc-rouge','Blanc strié de rouge (Carnaval de Nice)'],['blanc-framboise','Blanc liseré de violet (Shirley Double)'],['creme-rose','Crème à bord rosé'],
      ['corail','Rose corail (Taiwan)'],['jaune-orange-flamme','Orange à flammes rouges (Gudoshnik Double)'],['violet-bleute','Violet (Blue Diamond)'],['jaune-bord-rouge','Jaune à bord rosé (Akebono)']];
  for(const w of CW_TDBL)if(NM[w.id])Object.assign(w,{n:NM[w.id],c:mix(TDBS[w.id].c,TDBS[w.id].b,.5)});
  for(const[id,n]of LATE)if(!CW_TDBL.some(w=>w.id===id))CW_TDBL.push({id,n,c:mix(TDBS[id].c,TDBS[id].b,.5),g:TDBS[id].g,late:1})}
