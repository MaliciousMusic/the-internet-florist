/* ================= Pilote, lot 3 : le genre Ranunculus en SVG natif (y-ranunculus.js) =================
   One module per genus, one sheet (fiche) per kind. Common to the double ranunculi: the colourways' material (RANS, ranMat), the colour of fading
   (ranWiltCol), the heart (ranHeart: the green eye of carpels), the calyx, the stem (RAN_SVSC), the cut leaf (ranLeafSvg). The kinds:
   - SVR_RCLA: the florists' ranunculus (Ranunculus asiaticus, double in a rosette), drawn by the rosette kit
     (svRosette, y3-rosette.js). Measured on photographs (refcache/renoncule-classique, -forme; REFERENCES.md): 60 to 75 petals seen (70 to 140 in
     all), thin as tissue paper, spoon-shaped (cupped across, incurved along), on one spiral; the cut stage a globe of 6 to 8 rows of cups, wider
     than high (1.2 to 1.6), the outer petals at 60 to 70 degrees from the axis, their margins paler; the heart a tight swirl of small incurved
     petals round a little green eye; the bud a green egg (1.0 to 1.2 as high as wide) held in five hairy sepals, then the colour coming between
     them at the top; open, the outer petals flat (90 to 110 degrees), the sepals reflexed. Fading (photographs 0 to 10 of -forme, the fading sheet
     lot04): it opens very wide and flat, showing its heart, the petals grow translucent and pale, the margins brown and crumple, the outer petals
     hang, the hollow stem bends and the head nods, then the petals fall from the outside in.
   - the other ranunculi of the catalogue (the tight-ball, the button-centred, the single glossy and the half-double kinds): still on the old
     drawing (s11a.js). */
/* each colourway: the inner face by zone of the face seen from above (b: the first petals round the heart, c: the body, p: the outer petals, h: the
   heart ring itself if it differs from b), shade sh and light li if not derived, the margin r (width rw, opacity ra: a picotee), the heart's green hg,
   the eye, streaks (st: [colour, opacity, width]).
   Sources: rose, rouge, orange, jaune and corail are measured on free photographs (refcache/renoncule-classique/coloris-libres.md: the clearest
   studio or open-shade photograph of each, ring measures base/body/tip/heart); blanc keeps the catalogue white, slightly shaded (no reliable
   measure); the eleven others return to their catalogue colour (no free photograph of a plain, unnamed flower of that colour exists). */
const RANS={
  blanc:{b:'#eceed8',c:'#eeeadf',p:'#f3efe5',hg:.3,sh:'#9c9686',li:'#ffffff',r:'#ffffff'},
  creme:{b:'#ece0b0',c:'#f4ead0',p:'#f5ecd5',hg:.3,sh:'#8a7c3a',li:'#fbf6d8',r:'#faf0d9'},
  'rose-pale':{b:'#f8dde0',c:'#f3c4cc',p:'#f4cad1',hg:.1,r:'#fadfd6'},
  rose:{b:'#d886a9',c:'#d876a4',p:'#dd68a5',h:'#d8a8b7',hg:.06,r:'#eebcd4'},
  fuchsia:{b:'#e42c6b',c:'#e2457b',p:'#e25283',hg:.05,r:'#ee96a8'},
  rouge:{b:'#b52119',c:'#b40d11',p:'#a90204',h:'#af3e34',hg:.06,r:'#c34b45',eye:'#56602a'},
  bordeaux:{b:'#4a0a1a',c:'#6a1426',p:'#74172a',hg:0,li:'#a8506a',r:'#8e3447',eye:'#3a3a1c'},
  orange:{b:'#f97a11',c:'#f97a0d',p:'#fc7c0b',h:'#eb8331',hg:.08,r:'#fda55a'},
  'orange-brule':{b:'#c8381a',c:'#e04a20',p:'#e0542d',hg:.06,r:'#ed9776'},
  jaune:{b:'#fda70a',c:'#febc08',p:'#fed10f',h:'#fecc43',hg:.3,r:'#fee27a'},
  abricot:{b:'#f8c8a8',c:'#f4b090',p:'#f4b497',hg:.1,r:'#fad4ba'},
  peche:{b:'#f7b58e',c:'#f6c4a6',p:'#f6c8ac',hg:.12,r:'#fbdec4'},
  prune:{b:'#6b225c',c:'#7a2a6a',p:'#832e72',hg:0,li:'#b0609a',r:'#9a5388',eye:'#3a3a1c'},
  lilas:{b:'#bf96d3',c:'#c8a8d8',p:'#cbadd9',hg:.05,r:'#e5d0db'},
  picotee:{b:'#efdfe3',c:'#f6eef0',p:'#f8f2f4',hg:.15,r:'#e05a8a',rw:.008,ra:.72,li:'#fff8fa'},
  bicolore:{b:'#eec024',c:'#f5d02e',p:'#f6d440',hg:.08,r:'#d8302a',rw:.009,ra:.75},
  /* the only late colourway: the coral-red rosette (studio photograph, red heart, peach margin) */
  corail:{b:'#e4151a',c:'#fc3d37',p:'#fd7a5a',hg:.06,r:'#fdb59a'}};
/* the calyx: five sepals, ovate, green and hairy (their margins silvered by the hairs) */
const RAN_SEP={fr:'#7d9a54',bk:'#5f8240',shade:'#1d3612',lite:'#b2c98a',bshade:'#1f3414',blite:'#a2bc80',rim:'#d4e0bc',brim:'#cbd8b0',rimW:.006,rimA:.35,cast:'#0e1c08',edge:'#2a461a',green:false};
/* the material of one colourway, for svRosette (fr: the inner face by rank, 0 the outer petals .. 1 the heart; bk: the back) */
const RAN_M={};
function ranMat(cw){if(RAN_M[cw.id])return RAN_M[cw.id];const S=RANS[cw.id]||{b:cw.c,c:cw.c,p:cw.c},[h,s,l]=h2l(S.c),pale=l>.78&&s<.5,dark=l<.22,gC='#a6b45a',hg=S.hg??.1,
    shade=S.sh||l2h(h,Math.min(1,s*1.08),l*(dark?.4:.42)),lite=S.li||(dark?mix(S.p,'#d0708c',.32):mix(S.p,'#fff2d0',.4)),rim=S.r||mix(S.p,'#fff4dc',.42);
  return RAN_M[cw.id]={fr:[[0,S.p],[.45,S.c],[.82,S.b],[1,mix(S.h||S.b,gC,hg)]],bk:[[0,mix(S.p,'#efe8d8',pale?.05:.12)],[.5,mix(S.c,'#efe8d8',pale?.04:.1)],[1,mix(S.b,gC,hg*.7)]],
    shade,lite,bshade:mix(shade,'#5a5a52',.22),blite:mix(lite,'#ffffff',.25),rim,brim:mix(rim,S.c,.45),rimW:S.rw,rimA:S.ra,cast:mix(shade,'#000000',.5),edge:mix(shade,S.c,.3),
    vein:S.st?S.st[0]:null,veinA:S.st?S.st[1]:null,veinW:S.st?S.st[2]:null,veinLo:!!S.st,veinU:S.st?[-.5,-.12,.28,.6]:null,sep:RAN_SEP,eye:S.eye||'#7f9a3a'}}
/* the colour of a fading ranunculus (the fading sheet lot04, photographs 0 to 10 of -forme): the petals grow translucent and pale, then brown;
   oranges pale toward salmon, then burnt orange and brown; yellows to straw then light brown; pinks to a greyish pink, then beige; reds darken a
   little, then brick and brown; the near-blacks to brown-black; whites to a greyish cream, papery; violets dull to a grey mauve; greens yellow */
function ranWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(l<.2)return mix(c,'#2a1a12',.5*w);
  if(s<.2||l>.84){let o=mix(c,'#e8dfc8',.65*w);if(w>.5)o=mix(o,'#bca684',(w-.5)*.75);return o}
  if(l<.32&&s<.35&&h>=15&&h<60)return c;
  if(h>=10&&h<55){let o=mix(c,h<38?'#f2ae8c':'#efdc9c',.35*Math.min(1,w/.35));o=mix(o,h<38?'#995b18':'#a1802c',.5*svSm((w-.2)/.4));return mix(o,'#a37840',.7*svSm((w-.5)/.35))}
  if(h>=330||h<10){if(l<.45){let o=l2h(h<15?h-6*w:h,s*(1-.25*w),l*(1-.2*w));if(w>.5)o=mix(o,'#6a2e22',(w-.5)*.9);return o}
    let o=mix(c,'#e2c2c2',.5*w);if(w>.5)o=mix(o,'#bc9a8c',(w-.5)*.9);return mix(o,'#a37840',.3*svSm((w-.55)/.35))}
  let o=mix(c,'#c8b2c4',.45*w);if(w>.5)o=mix(o,'#8e7a86',(w-.5)*.8);return o}
if(typeof GHI!=='undefined'&&GHI['renoncule-classique'])GHI['renoncule-classique'].wilt=ranWiltCol;
/* how far the ranunculus has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function ranLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'renoncule-classique',rec:{}})):0}
/* the heart: a little green eye of carpels on the top of the receptacle (a dome, granular), seen when the heart's petals part; as it fades the
   receptacle lengthens into the green, then brownish, head of the fruits */
function ranHeart({B,O,R0,D,g,cw,bud,dec,fan,shed,items}){if(bud>.55)return;const hi=DET>=1.5,re=R0*.072*(g.eye||1)*(1+.2*dec+.8*fan),he=re*(.7+.35*dec+1.3*fan),zc=R0*(.09+.02*dec),
    col=mix(cw.eye,'#8a7a40',.55*fan),dk=mix(col,'#1a2408',.55),lt=mix(col,'#e8f0b0',.4);
  const S=(u,v)=>{const a=(u+1)*Math.PI,q=v*Math.PI/2;return[Math.cos(a)*re*Math.cos(q),Math.sin(a)*re*Math.cos(q),zc+he*Math.sin(q)]},px=svSheet(B,O,S,{nu:10,nv:3});
  items.push(svrFn(k2=>{const pts=[];for(let i=0;i<=6;i++)for(let j=0;j<16;j++){const p=PJ(B,O,S(-1+2*j/16,i/6));pts.push([p[0],p[1]])}const top=PJ(B,O,S(0,1)),id='sg'+(gid++),
      gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(top[0]-re*.3),cy:svF(top[1]-re*.35),r:svF(re*1.5)},GDEF||defs);stops(gr,[[0,lt],[.5,col],[1,dk]]);
    E('path',{d:svSpl(hull2(pts)),fill:`url(#${id})`},k2);if(LOD)return;
    /* the carpels: a granular dome, each a dot catching the light */
    const n=Math.round((hi?60:26)*(1+fan)),dots=[];for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n),a=i*2.39996+g.rot,v=1-q,p3=S(Math.cos(0)*0+((a/Math.PI)%2)-1,v),nz=toV(B,V3.nz(V3s(p3,[0,0,zc])))[2];if(nz<.1)continue;dots.push(PJ(B,O,p3))}
    if(dots.length)E('path',{d:svDots(dots),fill:'none',stroke:dk,'stroke-width':svF(Math.max(.25,re*.16)),'stroke-linecap':'round','stroke-opacity':.55},k2)},px))}
/* genes of one ranunculus (a table for svGenes, the draws in this order): the petals' count (as drawn in close-ups, about half the heart
   left out at DET 1; 60 to 75 are seen on the photographs, more under them), each petal's own share, the sepals', the head's */
const RAN_GENES={n:[[78,.25],[86,.45],[94,.3]],tep:{dL:[.92,1.07],dW:[.9,1.1],dph:[-.09,.09],da0:[-.07,.07],da1:[-.1,.1],tw:[-.14,.14],wav:[.04,.11],wk:[1.4,2.6],wph:[0,6.28],
    tip:[1.8,2.6],asym:[-.07,.07],cup:[.88,1.12],sd:'sd'},late:{hang:[.6,1.25],wl:[.85,1.2]},head:{rot:[0,6.2832],op:[-.04,.04],dh:[-3,3],ds:[-.05,.04],dl:[-.025,.02],eye:[.85,1.15],sd:'sd'}};
/* SVR_RCLA: the florists' ranunculus. Its rosette by rank (f: 0 the outer petals .. 1 the heart), from the photographs: the outer petals long and
   broad, the heart's small; the receptacle a low dome inside a ring; the cut stage a globe, the outer ranks cupped upright and open, the middle
   ones folded over the heart, which never opens before the decline */
const SVR_RCLA={genes:s=>svGenes(s,RAN_GENES),mat:ranMat,heart:ranHeart,life:()=>ranLife(),
  /* the globe of the rims by stage (measured silhouettes, profile photographs 16 to 20 of -forme: the cut stage 1.2 to 1.55 as wide as high, open
     about 2, the bud's opening a cup about as high as wide), the decline flattening it, reflexing the outer rows and opening the heart */
  globe:{op:[.3,.45,.75,1],Rx:[.42,.56,.86,1],Rz:[.6,.72,.74,.56],zc:[.12,.2,.25,.2],th0:[.55,1.15,2,2.1],th1:[.05,.08,.12,.2],gam:[1,1.2,1.5,1.6],flat:[0,0,.1,.3],
    dec:{Rx:.08,Rz:-.32,zc:-.03,th0:.5,th1:1,gam:-.4,flat:.3},
    /* faded (photographs 1, 2, 3, 9): the limp head gathers again (the dry heart a tight ball, photograph 2: 1.05 to 1.1 as high as wide), its
       outer rows leaving it sideways and hanging round it like a skirt (photograph 3: about as high as wide) */
    fan:{Rx:-.3,Rz:.45,zc:.05,th0:-.8,th1:-.6,flat:-.4}},
  /* fading (photographs 0, 1, 3, 6, 7 of -forme): the petals go limp and hang smoothly, thin, their margins brown; faded (photographs 2, 3, 5):
     shorter, narrower and crumpled, the heart's ranks firm (limpF 1), an eighth of the outer ones hanging on as a skirt round a dark crowded
     core (coreFan) */
  wav:[.7,1,1.2],crk:[.015,.05],rev:[.2,.12],curl:[.1,.3],limp:[1.2,.1],edgeBW:1,fanK:[.2,.2,0],coreFan:.62,shedK:.12,shedF:.7,limpF:1,floorF:.6,budT:.25,budE:[.08,.92],brown:'#4b4030',
  /* relief at every detail: the spoon's crease as a fold (its shaded wall and its lit one), the shadow each run of petals casts on the rank
     below, short runs; the closed bud keeps little of it (a cast shadow round a small green ball reads as a grey halo), its calyx in one layer */
  mid:[.3,.88],midW:.026,midA:[.3,.2],midO:.009,midL:2,shd:[.012,.018,.36],shdB:.8,sepLay:.5,budFace:.7,faceSm:2,budCore:.6,
  lap:.07,thin:[.62,3],thinW:1.12,bend:[[0,.75],[.4,1],[.8,1.25],[1,1.35]],Lmax:[[0,.95],[.5,.7],[.85,.4],[1,.3]],wRow:1.8,nRow:7,wMin:[[0,.6],[.6,.72],[1,.6]],wMax:[[0,1],[1,.9]],aPow:1,
  r0:[[0,.22],[.3,.21],[.6,.17],[1,.06]],z0:[[0,-.05],[.3,.13],[.6,.36],[1,.6]],cup:[[0,.4],[.3,.5],[.6,.65],[1,.75]],
  /* thin as tissue paper: the light goes round and through them (low contrast) */
  light:{wrap:.5,amb:.38,dif:.6,sky:.14,ks:.05,gloss:10,trans:.45},
  /* (the angles of the closed bud, still by rank: the globe takes over from the opening) */
  a0c:[[0,.4],[1,.05]],a1c:[[0,-.25],[1,-.85]],wA0:[[0,.35],[1,.75]],wA1:[[0,.55],[1,1.05]],
  oLaw:[.2,.4,.9,.4],green:[.85,.04,.22],greenC:'#7f9e4e',
  sep:{n:5,L:.36,W:.24,r0:.15,z0:-.07,a0:[.5,2.05],a1:[.12,2.45],open:[.12,.45],cup:.45,wrap:1.7,top:[.75,.55],tip:2.4,mat:RAN_SEP,
    /* faded (photograph 4 of -forme): the sepals shrivel, short, pressed under the head (never above a drooping head) */
    fd:{L:.85,W:.3,a0:-.6,a1:-.9,limp:.1,crk:.01}}};
/* the ranunculus head: petals, calyx and heart, in the frame B at O, D across, opening op, wilted wl (by default the bouquet's stage) */
function ranSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_RCLA!=='undefined'&&CW_RCLA.find(x=>x.id===cwId))||{id:cwId,c:'#e96c22'};
  return svRosette(par,B,O,D,S||SVR_RCLA,cwx,op,seed,wl==null?ranLife():wl)}
SV_HEAD['renoncule-classique']=ranSvg;
/* the old drawing's share of the bouquet's chance (ranFlower and capBud, s11a.js), consumed exactly so the composition does not move */
function ranOldDraws(B,op){if(op<.3)return 7;const N=Math.round(52*(DET>=1.5?1.25:1)*(LOD?.6:1));return(B[2][2]<.45?5:0)+1+2*N}
/* the ranunculus of the bouquet (open, young or in bud): its first draws name the individual */
function ranSvgPut(par,B,O,D,cw,op,o){if(!SV_ON||!cw||!cw.id)return false;const n=ranOldDraws(B,op);let s=0;for(let i=0;i<n;i++){const x=rnd();if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  ranSvg(par,B,O,D,cw.id,op,svSeed('renoncule',cw.id,s),ranLife(o));return true}
/* a side bud (s: the old bud's size, a its age): the old bud's seven draws, then a bud of the same height */
function ranBudSvgPut(par,B,O,s,cw,a){let sd=0;for(let i=0;i<7;i++){const x=rnd();if(i<3)sd=(Math.imul(sd,7919)+Math.floor(x*1e6))>>>0}
  ranSvg(par,B,V3.add(O,toV(B,[0,0,-s*.1])),s/.36,cw.id,.03+.2*a,svSeed('renoncule-bouton',cw.id,sd),ranLife())}
/* ---------- the plant: the stem leaf, the node, the stem (relay 4, from the organ photographs) ----------
   Measured with fleur/organ.py on refcache/renoncule-classique-organes (the leaf 63, the young plant 64, the backs 75 and 77, the stems in vases 86
   and 87); what the photographs do not show (the underside and the margin in close-up, the veins, a cut of the stem) is completed from the botany
   of the genus:
   - the stem leaf: ternate on a petiole about as long as its blade (63: at least .9, the photograph cuts it), the blade about as long as wide;
     each leaflet wedge-shaped at its foot, then cut deep into three lobes (the lateral leaflets two or three, the outer half the more cut), each
     lobe toothed toward its tip; a leaflet 1.6 to 1.75 times as long as wide (63); the top matte mid green (#5a7b38: 63 and 64 measure #4f7a0a
     to #778641), the midrib sunk and paler, the underside paler and downy; every leaflet folded along its midrib into a gutter (each half one
     surface of the rosette kit), its margins a little rolled down, arching out from its stalk then sagging under its weight;
   - at its foot the sessile leaf of the upper stem: narrow segments, 4 to 6 times as long as wide, clasping the node (77), over a sheath;
   - wilting, the leaflets go limp and hang, yellow from their tips (a gradient along each leaflet), their margins brown. */
const RAN_LM={fr:'#5a7b38',bk:'#8fa470',shade:'#1c3410',lite:'#a2bf80',bshade:'#4a6234',blite:'#c8d8b0',rim:'#7f9e5e',brim:'#c8d6b4',rimW:.0035,rimA:.28,
  cast:'#0e1c08',edge:'#28421a',green:false,vt:'#91b072',vb:'#dbe4cc'};
const RAN_LP=Object.assign({},SVR_DEF,{nu:[3,4],nv:[11,15],run:[9,5],simp:[2.6,1.2],dark:[[],[.9,.76]],lit:[[],[1.08,1.18]],la:[.2,.2],kd:1.1,kl:.85,shd:[.022,.016,0],
  ao:[.2,.3,.1,.3],aoV:[[],[]],light:{wrap:.25,amb:.3,dif:.7,sky:.16,ks:.08,gloss:12,trans:.3},edgeW:.0035,edgeA:.45,brimA:.2,pmin:3,cull:.98});
/* half a leaflet in its own plane (x across from the midrib, y along it, both × the leaflet's length): from the foot a wedge, then nl lateral lobes
   (each a finger leaving the midrib at y0, at the angle a, reaching x = lx, om its half width) and half the terminal lobe (free from yT, om half
   width), the sinuses between them deep; teeth toward each lobe's tip (nt), sharp. Returns the margin from the foot to the tip. */
function ranHalf(h){const L=[];for(let k=0;k<h.nl;k++){const a=h.a[k],dir=[Math.sin(a),Math.cos(a)];L.push({A:[0,h.y0[k]],dir,nr:[Math.cos(a),-Math.sin(a)],l:h.lx[k]/Math.sin(a),om:h.om[k],nt:h.nt[k]})}
  L.push({A:[0,h.yT],dir:[0,1],nr:[1,0],l:1-h.yT,om:h.omT,nt:h.ntT,term:1});
  const E=(o,side,s,m=1)=>{const w=o.om*m*(o.term?Math.pow(Math.max(0,1-Math.pow(s,2.4)),.55):(1-.22*s*s)*(s>.84?Math.sqrt(Math.max(0,1-(s-.84)/.16)):1));
    return[o.A[0]+o.dir[0]*o.l*s+side*o.nr[0]*w,o.A[1]+o.dir[1]*o.l*s+side*o.nr[1]*w]};
  /* the outer edge of a lobe from s0 to its tip, its teeth pointing forward; then (laterals) the inner edge back down to s1, one tooth on it */
  const P=[[0,0]],up=(o,s0)=>{P.push(E(o,1,s0));const n=o.nt,a=Math.max(s0+.08,.5);if(h.hi)P.push(E(o,1,(s0+a)/2));
      for(let j=0;j<n;j++){const st=a+(.95-a)*(j+.7)/n,sn=a+(.95-a)*(j+1)/n;P.push(E(o,1,st,1.24));if(j<n-1||o.term)P.push(E(o,1,Math.min(.97,sn+.02),.76))}
      P.push(o.term?[0,1]:E(o,0,1))},
    down=(o,s1)=>{P.push(E(o,-1,.9,.9));P.push(E(o,-1,.74,1.16));if(h.hi)P.push(E(o,-1,.6,.82));P.push(E(o,-1,s1))};
  P.push(E(L[0],1,.04).map((x,i)=>i?Math.max(.03,x):Math.min(x,.05)));
  for(let k=0;k<L.length;k++){const o=L[k];up(o,k?h.sg:.2);if(!o.term){down(o,h.sg+.06);const n2=L[k+1],q=E(n2,1,h.sg);const a=P[P.length-1];P.push([(a[0]+q[0])/2,(a[1]+q[1])/2-.015])}}
  return P}
/* the parameters of a half: kind 't' (the terminal leaflet: one lateral lobe a side), 'o' (the outer half of a lateral leaflet: two), 'i' (its
   inner half: one small, or none); w the leaflet's half width (× its length) */
function ranHalfSpec(r,kind,w){const nl=kind==='o'?2:kind==='i'?(r()<.5?1:0):1,h={nl,a:[],y0:[],lx:[],om:[],nt:[],yT:0,omT:0,ntT:0,sg:.3};
  for(let k=0;k<nl;k++){const outer=k===0;h.a.push(outer?r.in(.5,.65):r.in(.32,.42));h.y0.push(outer?r.in(.2,.28):r.in(.32,.4));
    h.lx.push(w*(outer?r.in(.95,1.05):r.in(.6,.7))*(kind==='i'?.75:1));h.om.push(w*(outer?r.in(.38,.46):r.in(.3,.36)));h.nt.push(r()<.4?1:2)}
  h.yT=nl?r.in(.3,.38):.1;h.omT=w*(nl?r.in(.42,.5):r.in(.72,.82));h.ntT=nl?(r()<.5?1:2):3;h.sg=r.in(.42,.5);h.hi=DET>=1.5;return h}
/* the cut leaf at a node of the stem: og the organ (H its direction), pos its foot, len its length, sd its seed, wl the wilt; nd the node (its
   stem's direction and width) */
/* the leaf's direction drawn: its depth flattened (a leaf is read spread, not end-on) and, on the picture, at least 30 degrees off its stem */
function ranLeafDir(og,nd){let h=[og.H[0],og.H[1]];const s=nd&&nd.H?[nd.H[0],nd.H[1]]:[0,1],ls=Math.hypot(s[0],s[1])||1,lh=Math.hypot(h[0],h[1]);
  if(lh>1e-3){const a0=Math.atan2(h[1],h[0]),as=Math.atan2(s[1]/ls,s[0]/ls);let d=Math.atan2(Math.sin(a0-as),Math.cos(a0-as));if(Math.abs(d)<.55){d=(d<0?-1:1)*.55;h=[Math.cos(as+d)*lh,Math.sin(as+d)*lh]}}
  return V3.nz([h[0],h[1],og.H[2]*.45])}
function ranLeafSvg(par,og,pos,len,sd,wl,nd){const r=svRng(sd),H=ranLeafDir(og,nd),U=V3.nz(og.U),dn=[0,-1,0],hi=DET>=1.5,Dm=len*1.5,tol=Math.max(.06,Dm*.0035),items=[],halves=[],
    wk=svSm((wl-.12)/.55),limp=.2+.62*wk,yel=svSm((wl-.3)/.55);
  const rot=(v,ax,a)=>V3.add(V3.add(V3.sc(v,Math.cos(a)),V3.sc(V3.cr(ax,v),Math.sin(a))),V3.sc(ax,V3.dot(ax,v)*(1-Math.cos(a))));
  /* a spine from p0 along d0 (length l): it arches up a little (lift), then sags toward the ground (more as it wilts) */
  const spine=(p0,d0,l,lift,lk=1)=>{const ns=10,sp=[],dv=[];let p=p0,d=V3.nz(V3.add(d0,[0,lift,0]));
    for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.92,limp*lk*Math.pow(v,1.15)),dd=V3.nz(V3.add(V3.sc(d,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,l/ns));sp.push(p);dv.push(dd)}
    const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))};return{at:v=>at(sp,v),dir:v=>V3.nz(at(dv,v))}};
  /* the blade's top faces the sky and a little the eye (a leaf is read by its face), turned on its midrib by tw */
  const nRef=V3.nz([r.in(-.15,.15),.6,.8]);
  /* a leaflet from p0 along d0: its spine, its two halves (ranHalf), each one surface; the gutter g (the halves raised along the midrib), the margins
     rolled down (ro); a leaflet narrows a little as it wilts (its margins curl under) */
  const leaflet=(p0,d0,Ll,w,kinds,tw,lk)=>{const s=spine(p0,d0,Ll,.12*(1-wk),lk),g=.4*(1-.55*wk),ro=.28+.5*wk,wn=1-.12*wk,lf={s,Ll,halves:[]};
    const frame=y=>{const t=s.dir(y);let nb=V3.add(nRef,V3.sc(t,-V3.dot(t,nRef)));if(V3l(nb)<1e-3)nb=U;nb=V3.nz(nb);const a=tw*y,sd0=V3.nz(V3.cr(nb,t));
      const n2=V3.add(V3.sc(nb,Math.cos(a)),V3.sc(sd0,Math.sin(a)));return[V3.nz(V3.cr(n2,t)),n2]};
    const map=(x,y)=>{const[sd0,nb]=frame(y),ax=Math.abs(x);return V3.add(V3.add(s.at(y),V3.sc(sd0,x*Ll*wn)),V3.sc(nb,Ll*(ax*Math.sin(g)-ro*x*x/(w*2))))};lf.map=map;
    for(const[side,kind]of kinds){const h=ranHalfSpec(r,kind,w),M=ranHalf(h),N=M.length-1,a=[];let am=0;
      for(const[x,y]of M){am=Math.max(am,Math.min(1,Math.max(0,y-x*.84)));a.push(am)}a[N]=1;
      const at=v=>{const q=Math.max(0,Math.min(1,v))*N,j=Math.min(N-1,Math.floor(q)),f2=q-j;return[M[j][0]*(1-f2)+M[j+1][0]*f2,M[j][1]*(1-f2)+M[j+1][1]*f2,a[j]*(1-f2)+a[j+1]*f2]};
      const S=(u,v)=>{const[mx,my,ma]=at(v),t=(u+1)/2,k=side>0?t:1-t;return map(side*mx*k,ma+(my-ma)*k)};
      const it=svrItem(RAN_LP,I3,[0,0,0],S,RAN_LM,0,'l',{tol,nu:hi?4:3,nv:N});if(!it)continue;it.lf=lf;lf.halves.push({it,h,side});items.push(it)}
    halves.push(lf);return s};
  /* the petiole: a channelled strap from the sheath, about as long as the blade */
  const base=V3.add(pos,V3.sc(H,(og.w||2)*.45)),lp=len*r.in(.46,.52),pet=spine(base,H,lp,.15,.55),P1=pet.at(1),d1=pet.dir(1);
  items.push(svrItem(RAN_LP,I3,[0,0,0],(u,v)=>{const c=pet.at(v),t=pet.dir(v),side=V3.nz(V3.cr(nRef,t)),hw=len*(.0125-.0035*v);return V3.add(V3.add(c,V3.sc(side,u*hw)),V3.sc(nRef,Math.abs(u)*hw*.7))},RAN_LM,0,'p',{nu:2,nv:hi?6:4,tol}));
  /* the three leaflets: the laterals on short stalks, spread 35 to 45 degrees from the rachis, their outer half the more cut; the terminal on a
     longer stalk, three-lobed */
  for(const sg of[-1,1]){const pl=len*.035,dl=rot(d1,nRef,sg*r.in(.7,.84)),q=V3.add(P1,V3.sc(dl,pl));
    leaflet(q,rot(dl,nRef,sg*.08),len*r.in(.33,.37),r.in(.28,.32),[[sg,'o'],[-sg,'i']],r.in(-.35,.35)+sg*.25,1)}
  const pt=len*.07,qt=V3.add(P1,V3.sc(d1,pt));leaflet(qt,rot(d1,nRef,r.in(-.08,.08)),len*r.in(.41,.46),r.in(.29,.33),[[-1,'t'],[1,'t']],r.in(-.3,.3),1.1);
  /* the sessile leaf of the upper stem at the foot: narrow segments (L/W 4 to 6), folded, a tooth or a fork on some, clasping the node */
  const seg=(p0,d0,l,w,tw)=>{const s=spine(p0,d0,l,.1,.8),fk=r()<.45?r.in(.55,.72):0,fs=r()<.5?1:-1;
    const half=v=>w*(v<.18?.45+.55*Math.sin(v/.18*Math.PI/2):1)*Math.pow(Math.max(0,1-Math.pow(Math.max(0,v-.3)/.7,1.6)),.7),bump=v=>fk&&Math.abs(v-fk)<.07?1+1.1*(1-Math.abs(v-fk)/.07):1;
    const S=(u,v)=>{const c=s.at(v),t=s.dir(v);let nb=V3.add(nRef,V3.sc(t,-V3.dot(t,nRef)));nb=V3l(nb)<1e-3?U:V3.nz(nb);const sd0=V3.nz(V3.cr(nb,t)),a=tw*v,
        sdd=V3.add(V3.sc(sd0,Math.cos(a)),V3.sc(nb,Math.sin(a))),n2=V3.nz(V3.cr(t,sdd)),hw=half(v)*(u*fs>0?bump(v):1);
      return V3.add(V3.add(c,V3.sc(sdd,u*hw)),V3.sc(n2,-(.4+.3*wk)*Math.abs(u)*hw))};
    const it=svrItem(RAN_LP,I3,[0,0,0],S,RAN_LM,0,'c',{tol,nu:2,nv:hi?10:7});if(it){it.lf={s,Ll:l,seg:1};items.push(it);halves.push({s,Ll:l,halves:[{it,side:0}],seg:1})}};
  const sh=nd&&nd.H?V3.nz(nd.H):H;for(const sg of[-1,1]){const n=hi?3:2;for(let q=0;q<n;q++){const a=sg*(r.in(.75,1.05)+q*.32);
    seg(V3.add(base,V3.sc(sh,len*.01*q)),rot(V3.nz(V3.add(sh,V3.sc(H,.4))),nRef,a),len*r.in(.24,.32)*(1-.15*q),len*r.in(.024,.03),r.in(-.4,.4))}}
  const k=svrDraw(par,items,RAN_LP,RAN_LM,Dm,tol,{dec:svSm((wl-.2)/.45)*.5,fan:svSm((wl-.55)/.35)*.6});
  /* veins: the midrib and one vein to each lobe's tip (and its teeth in close-ups), sunk and paler on the top, raised and pale beneath; hidden
     under whatever is drawn after their half */
  /* the shadow a leaflet casts on one lying behind it: the caster's outline shifted away from the light, blurred, clipped to the receiver and
     drawn just after it (so the caster and the later pieces cover it); the few largest overlaps between different leaflets */
  if(!LOD&&hi){const byD0=new Map();for(const p of k.querySelectorAll('path'))if(!byD0.has(p.getAttribute('d')))byD0.set(p.getAttribute('d'),p);
    const L2=Math.hypot(LIGHT[0],LIGHT[1])||1,ox=-LIGHT[0]/L2*Dm*.026,oy=LIGHT[1]/L2*Dm*.026,dr=items.filter(it=>!it.gone&&it.out&&it.lf),pr=[];
    for(const A of dr)for(const B of dr){if(B.oi<=A.oi||B.lf===A.lf)continue;const x0=Math.max(A.bb[0],B.bb[0]+ox),x1=Math.min(A.bb[2],B.bb[2]+ox),y0=Math.max(A.bb[1],B.bb[1]+oy),y1=Math.min(A.bb[3],B.bb[3]+oy);
      if(x1>x0&&y1>y0)pr.push([(x1-x0)*(y1-y0),A,B])}
    pr.sort((a,b)=>b[0]-a[0]);for(const[ar,A,B]of pr.slice(0,4)){if(ar<(Dm*.03)**2)break;const pA=byD0.get(A.d);if(!pA)continue;const id='rc'+(gid++);E('path',{d:A.d},E('clipPath',{id},GDEF||defs));
      const sp=E('path',{d:svSpl(svSimp(B.out.map(p=>[p[0]+ox,p[1]+oy]),tol*3)),fill:RAN_LM.cast,'fill-opacity':.3,stroke:'none',filter:svBlur(Dm*.012),'clip-path':`url(#${id})`},k);pA.after(sp)}}
  const drawn=items.filter(it=>!it.gone&&it.out),cover=(p,oi)=>{for(const b of drawn){if(b.oi<=oi||p[0]<b.bb[0]||p[0]>b.bb[2]||p[1]<b.bb[1]||p[1]>b.bb[3])continue;if(svrIn(b.out,p[0],p[1]))return true}return false};
  const scr=q=>[q[0],-q[1]],VD={t0:'',t1:'',b0:'',b1:''},line=(pts,it,w)=>{if(!it||it.gone)return;let run=[];const key=(it.s>0?'t':'b')+w;
    const flush=()=>{if(run.length>1)VD[key]+=svQuad(run);run=[]};for(const p of pts){const q=scr(p);if(cover(q,it.oi))flush();else run.push(q)}flush()};
  for(const lf of halves){if(lf.seg){const it=lf.halves[0].it,pts=[];for(let j=1;j<=6;j++)pts.push(lf.s.at(j/7));line(pts,it,1);continue}
    const H2=lf.halves.filter(x=>!x.it.gone);if(!H2.length)continue;const top=H2.reduce((a,b)=>b.it.oi>a.it.oi?b:a),pts=[];for(let j=0;j<=8;j++)pts.push(lf.map(0,.02+.9*j/8));line(pts,top.it,0);
    for(const{it,h,side}of H2){for(let q=0;q<h.nl;q++){const a=h.a[q],l=h.lx[q]/Math.sin(a),vp=[];for(let j=0;j<=5;j++){const s=.86*j/5;vp.push(lf.map(side*Math.sin(a)*l*s,h.y0[q]+Math.cos(a)*l*s))}line(vp,it,1)}
      if(hi)for(let q=0;q<h.nl;q++){const a=h.a[q],l=h.lx[q]/Math.sin(a),s0=.55,x0=Math.sin(a)*l*s0,y0=h.y0[q]+Math.cos(a)*l*s0;line([lf.map(side*x0,y0),lf.map(side*(x0+h.om[q]*.7*Math.cos(a)),y0+.06)],it,1)}}}
  const vw=Dm*(hi?.0034:.0045);for(const[key,c,w,o]of[['b0',RAN_LM.vb,vw*1.5,.55],['b1',RAN_LM.vb,vw,.42],['t0',RAN_LM.vt,vw*1.35,.6],['t1',RAN_LM.vt,vw*.85,.38]])
    if(VD[key])E('path',{d:VD[key],fill:'none',stroke:c,'stroke-width':svF(w),'stroke-opacity':o,'stroke-linecap':'round'},k);
  /* wilting, each leaflet yellows from its tip: its halves filled along a gradient from the stalk to the tip */
  if(yel>.02){const byD=new Map();for(const p of k.querySelectorAll('path'))byD.set(p.getAttribute('d'),p);
    for(const lf of halves){const a=scr(lf.s.at(lf.seg?.1:0)),b=scr(lf.s.at(1));for(const{it}of lf.halves){const p=byD.get(it.d);if(!p)continue;const id='rg'+(gid++),f0=1-.92*yel,
      gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
      stops(gr,[[0,it.tone],[Math.max(0,f0-.18),it.tone],[Math.min(1,f0+.12),mix(it.tone,'#b8a43c',.55+.25*yel)],[1,mix(it.tone,yel>.6?'#8a6a2c':'#c4ae48',.75)]]);p.setAttribute('fill',`url(#${id})`)}}}
  return k}
/* the leaf on a bouquet stem: the old leaf's share of the bouquet's chance (its length drawn at the node; its tilt and three lobes when drawn) */
const ranLeafSv=(D,cw)=>(og,pos)=>{const len=D*R(.6,.8),nd=RAN_ND;return{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>{let s=0;for(let i=0;i<4;i++){const x=rnd();if(i<2)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  if(!RAN_OFF.includes('leaf'))ranLeafSvg(par,og,pos,len*1.45,svSeed('renoncule-feuille',cw.id,s,Math.round(pos[0]*8),Math.round(pos[1]*8)),ranLife(),nd)}}};
/* the node: the stem a little swollen where the leaf's sheath clasps it (a short sleeve, paler, its mouth oblique, a fine ring at its foot);
   it hands its stem's direction and width to the leaf drawn next (no chance drawn) */
let RAN_ND=null;
/* parts switched off to weigh them (?ranoff=leaf,node): the chance is drawn all the same */
const RAN_OFF=typeof location!=='undefined'?((/[?&]ranoff=([^&]*)/.exec(location.search)||[])[1]||''):'';
function ranNode(og,pos){const Hs=V3.nz(og.H),w=og.w||2;RAN_ND={H:Hs,w,pos};return{z:pos[2]+w*.8,fn:par=>{if(RAN_OFF.includes('node'))return;let e=V3.add([0,0,1],V3.sc(Hs,-Hs[2]));e=V3l(e)<1e-3?[1,0,0]:V3.nz(e);
  const b2=V3.nz(V3.cr(Hs,e)),rad=w*.56,hl=w*1.1,S=(u,v)=>{const ph=u*1.5,l=hl*(1+.35*Math.sin(ph));return V3.add(V3.add(pos,V3.sc(Hs,-w*.15+v*l)),V3.add(V3.sc(e,Math.cos(ph)*rad*(1+.06*v)),V3.sc(b2,Math.sin(ph)*rad*(1+.06*v))))};
  const sc=q=>[q[0],-q[1]],o=[],ring=[];for(let i=0;i<=6;i++){o.push(sc(S(-1+i/3,0)));ring.push(sc(S(-1+i/3,0)))}o.length=0;for(let i=0;i<=6;i++)o.push(sc(S(-1+i/3,0)));for(let i=6;i>=0;i--)o.push(sc(S(-1+i/3,1)));
  E('path',{d:svSpl(o),fill:'#6c8c47',stroke:'#3a5a26','stroke-width':svF(w*.05),'stroke-opacity':.5},par);E('path',{d:svQuad(ring),fill:'none',stroke:'#2e4a1c','stroke-width':svF(w*.09),'stroke-opacity':.45},par)}}}
/* the stem from the photographs: about 1/15 of the flower under the head (86: 1/11 to 1/12, 77: 1/18; the render 1/14.6), the lower stem 1.2 to 1.3 times thicker
   (the turtle's taper and the cut stem's); wilting it bends under the head (the tropism turns to the ground, the neck no longer aims the head) */
const ranStemOpts=(D,o)=>{const wl=ranLife(o),b=svSm((wl-.35)/.45),T=SVR_RCLA.tip||SVR_DEF.tip,tip=T.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0);
  /* the neck aims where the head has tipped (the head's own tip toward the ground, svRosette), a little less: the stem bends under it */
  return{w:D*.056,wig:.05,e:.02-.3*b,aimK:.24+.16*b,node:ranNode,aimAt:ax=>{const A0=V3.cr(ax,[0,-1,0]),al=V3l(A0);if(tip<=0||al<.05)return ax;
    return rotA(ax,V3.sc(A0,1/al),.8*Math.min(tip,Math.acos(Math.max(-1,Math.min(1,-ax[1])))*.95))}}};
/* the stem: hollow, ribbed, its fine hairs pressed toward the head (on the silhouette, a sheen on the face); three tones from 63, 75, 77, 87 */
const RAN_SVSC=['#2e4a1c','#678a44','#a2bf76','#d8e6c0'];RAN_SVSC.sv={hair:'#eef3e0',hairK:.95,ribs:[-.55,-.2,.15,.5],swell:.03,gloss:.22};
/* the colourways: the sixteen of the catalogue keep their id, their place and their generic name (the SKU numbers do not move); the swatch is the
   catalogue colour, or the body measured on a free photograph (rose, rouge, orange, jaune). One late colourway: corail. The six late colourways of
   the first modelling (ids saumon, peche-pale, jaune-pale, rose-strie, ivoire-borde, grenat) are withdrawn, with no SKU: those ids stay unused. */
if(typeof CW_RCLA!=='undefined'){const NM={blanc:'Blanc',creme:'Crème','rose-pale':'Rose pâle',rose:'Rose',fuchsia:'Fuchsia',rouge:'Rouge',bordeaux:'Bordeaux',orange:'Orange',
    'orange-brule':'Orange brûlé',jaune:'Jaune',abricot:'Abricot',peche:'Pêche',prune:'Prune',lilas:'Lilas',picotee:'Blanc liseré de rose',bicolore:'Jaune bordé de rouge'},
    SW={blanc:'#f7f3ea',creme:'#f4ead0','rose-pale':'#f3c4cc',rose:'#d876a4',fuchsia:'#e2457b',rouge:'#b40d11',bordeaux:'#6a1426',orange:'#f97a0d','orange-brule':'#e04a20',jaune:'#febc08',
      abricot:'#f4b090',peche:'#f6c4a6',prune:'#7a2a6a',lilas:'#c8a8d8',picotee:'#f6eef0',bicolore:'#f5d02e'};
  for(const w of CW_RCLA)if(NM[w.id])Object.assign(w,{n:NM[w.id],c:SW[w.id]});
  if(!CW_RCLA.some(w=>w.id==='corail'))CW_RCLA.push({id:'corail',n:'Corail',c:'#fc3d37',late:1})}
