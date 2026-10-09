/* ================= Pilote, lot 2 : le genre Tulipa en SVG natif (y-tulipa.js) =================
   One module per genus, one sheet (fiche) per kind. Common to every tulip: the colourways' material (TULS, tulMat), the heart (svHeart6 with the
   tulip's numbers), the colour of fading (tulWiltCol), the stem (TULS_SC), the strap leaves (svStrapLeaf), the neck that bends as it fades.
   The kinds, each with its own shape, life curves and proportions:
   - SVT_SIMPLE: the single cut tulip of the catalogue (Triumph, Single Late, Darwin hybrids): the classic U, a goblet of upright overlapping tepals,
     the three inner inside the three outer, the top barely drawn in; it keeps this U through its life in the vase (op .6 to 1), opens to a star and
     lies flat only in its decline (wl .3 to .6), then fades;
   - SVT_BOTA: the first shape drawn (v1, 2026-10-08), which opens flat to a star: a botanical tulip (Kaufmanniana, the "water lily", or
     Fosteriana). Kept as is; in no catalogue and not in SV_HEAD (pending the owner's decision on a species tulipe-botanique);
   - later: French, lily-flowered, fringed, parrot, double, Rembrandt, viridiflora (still on the old drawing of s9a.js, s54a.js, s106a.js).
   Measured on photographs (refcache/tulipe-simple, REFERENCES.md): six tepals in two whorls of three, broad, the tip round (inner) to a little
   pointed (outer), overlapping by about a third; the bud an egg, pointed, 1.6 to 2 times as high as wide, green, then coloured from the tip down;
   waxy satin, fine veins; inside, at the foot of each tepal, a blotch whose colour is the variety's own; six stamens with long anthers, a stout
   pistil, its stigma in three lobes. Fading (photographs 85, 194, 198, 203): the tepals part and lie flat, twist, hang, then fall one by one; the
   colour pales and browns, the blotch stays longest; the neck lengthens and bends, the head nods. */
/* each colourway (coloris.md, brief.md): inside body i and tip t, its base ba up to bv, outside o (tip ot, a green flush g at its foot), shade sh and light li,
   the blotch bl [colour, edge, height, width, opacity, roundness], a picotee band [colour, width, from, opacity], flames, anthers an, filaments fi, pollen po */
const TULS={
  rouge:{i:'#d8302a',t:'#e04034',o:'#d02a26',ot:'#d83a30',sh:'#6a0a08',li:'#f6705a',bl:['#1e1016','#d8b030',.3,.55],an:'#1e1418'},
  'rouge-feu':{i:'#d6301c',t:'#dc4020',o:'#d42c19',sh:'#6a1004',li:'#f6704a',band:['#eaa030',.012,.55,.85],bl:['#2a1a10','#e2b030',.2,.45],an:'#241814'},
  orange:{i:'#e4461f',t:'#e85a2a',o:'#dc3a1a',ot:'#e24e26',sh:'#7a1a08',li:'#fa8458',bl:['#3a3020','#d89a30',.16,.38],an:'#1e1a16'},
  'orange-or':{i:'#f48c18',t:'#e6452e',ba:'#fac40e',bv:.24,o:'#f08a16',ot:'#e24a2c',sh:'#8a3006',li:'#fcc050',bl:['#e8b010','#f4b818',.22,.5,.9],an:'#2a1612'},
  or:{i:'#ecd23c',t:'#f0da50',o:'#e4c636',ot:'#ecd24a',sh:'#8a760a',li:'#fbf08c',bl:['#5a4a20','#d8b030',.14,.36,.8],an:'#3a2c1a'},
  abricot:{i:'#e2867a',t:'#d6666a',ba:'#ecb478',bv:.18,o:'#de8478',ot:'#d4686c',sh:'#8e3a30',li:'#f8c0b0',bl:['#e8bc60','#eca870',.22,.5,.9],an:'#3a2a20'},
  corail:{i:'#d4501a',t:'#d8742a',ba:'#e8962e',bv:.14,o:'#c84a18',ot:'#d0622a',sh:'#7a2208',li:'#f8945a',fl:{c:'#6e2448',n:[3,5],from:.04,to:.8,w:.07,op:.85,side:-1},bl:['#e0a030','#eca040',.18,.45,.9],an:'#2a2018'},
  jaune:{i:'#eab42a',t:'#f2be30',o:'#e4a624',ot:'#eeb42c',sh:'#7e5206',li:'#fcd870',band:['#d8402a',.006,.55,.7],bl:['#2a281c','#7a6420',.14,.34],an:'#1e1c18'},
  'citron-vert':{i:'#b4c868',t:'#dcea8c',o:'#a8c060',ot:'#cadc80',g:.45,sh:'#52641a',li:'#eef4b8',bl:['#c0c458','#d0d888',.2,.5,.8],an:'#b09a3a',fi:'#c8c070',po:'#e8d870',sg:'#d8e0a0'},
  creme:{i:'#efe0a4',t:'#f2e6b8',ba:'#e8cc64',bv:.2,o:'#eadca0',ot:'#efe4b4',g:.3,sh:'#908050',li:'#fffbe4',bl:['#e2c440','#ecd884',.26,.6,.9],an:'#a8902e',fi:'#d8c46a',po:'#e8d468',sg:'#d8e0a0'},
  blanc:{i:'#f2f0e6',t:'#f6f4ec',o:'#ecead8',ot:'#f2f0e4',g:.4,sh:'#8e8c78',li:'#ffffff',bl:['#e6dfaa','#f0ecd2',.2,.5,.8],an:'#b0a050',fi:'#d8d090',po:'#e4d880',sg:'#e0e4b0'},
  'rose-pale':{i:'#d690b8',t:'#e2b2cc',ba:'#f0dccc',bv:.14,o:'#cc86b4',ot:'#dcaac6',sh:'#7e4462',li:'#f8dcec',bl:['#3a3444','#cfc0a4',.15,.34,.9],an:'#2e2836'},
  rose:{i:'#e6808e',t:'#ea90a0',o:'#e07e8e',ot:'#e898a6',sh:'#863040',li:'#fcc0cc',bl:['#262a40','#c8b8b0',.22,.45,.92],an:'#1e1c28'},
  fuchsia:{i:'#d6347a',t:'#d44a86',ba:'#ece0a6',bv:.16,o:'#cf3878',ot:'#c86488',sh:'#6a0a3a',li:'#f87ab4',bl:['#e8dca0','#c8d0b0',.2,.5,.95],an:'#b89a20',fi:'#d8c070',po:'#ecd060'},
  mauve:{i:'#8e4a72',t:'#9c6684',o:'#965373',ot:'#a87090',sh:'#3a1030',li:'#c890b0',band:['#cfa4bc',.012,.55,.6],bl:['#2a2040','#4a3a5c',.18,.4],an:'#c8a838',fi:'#d8c070',po:'#ecd060'},
  lilas:{i:'#bfa0dc',t:'#c8acdf',o:'#b496d2',ot:'#bea4d8',sh:'#54388a',li:'#ecdcfa',bl:['#eceaf2','#d4c4e6',.22,.52,.9],an:'#3a2c48'},
  violet:{i:'#74226e',t:'#7e2c78',ba:'#e8e0cc',bv:.13,o:'#8a2c84',ot:'#9a3a92',sh:'#2c0626',li:'#c070c0',fl:{c:'#c48ad0',n:[2,4],from:.35,to:.98,w:.035,op:.5,side:-1},bl:['#ece4d0','#c8b0d8',.2,.55],an:'#3a2a40'},
  noir:{i:'#5a2c48',t:'#64344e',o:'#613850',ot:'#6c4058',sh:'#2a1424',li:'#894e71',bl:['#180a14','#2a1426',.2,.45],an:'#1a1218'},
  'blanc-pourpre':{i:'#f4f0ea',t:'#f6f2ee',o:'#f0ece4',ot:'#f2eeea',g:.2,sh:'#8a8696',li:'#ffffff',band:['#8a3a8a',.016,.48,.92],bl:['#ece6c8','#f2eedc',.2,.5,.8],an:'#4a3048'},
  'flamme-rose':{i:'#f0dcd8',t:'#ecc4c4',ba:'#f2e2a6',bv:.14,o:'#eed8d4',ot:'#eac4c6',sh:'#9a7a80',li:'#ffffff',fl:{c:'#d87890',n:[4,7],from:.1,to:.98,w:.03,op:.65},bl:['#f0e0a0','#f4ecc8',.2,.55,.85],an:'#3a2c30'},
  ecarlate:{i:'#dc4840',t:'#e0503e',o:'#d4402e',ot:'#da4a36',sh:'#6e0a08',li:'#fa7a64',bl:['#1a1014','#e0c030',.24,.52],an:'#1a1214'},
  'pourpre-velours':{i:'#5c1644',t:'#6a2a52',o:'#62204a',ot:'#6d3f52',sh:'#20041a',li:'#9a5480',bl:['#1e1830','#3a2a48',.2,.45],an:'#1e1620'},
  'peche-rose':{i:'#f2b28e',t:'#eca070',ba:'#f2d07a',bv:.16,o:'#f0b892',ot:'#e8a478',sh:'#9a5a30',li:'#fde0c8',bl:['#f0d070','#f2c088',.22,.5,.9],an:'#3a2a20'},
  'blanc-pur':{i:'#f8f6f0',t:'#fafaf6',o:'#f2f2ea',ot:'#f6f6f0',g:.3,sh:'#8a8e90',li:'#ffffff',bl:['#eeecd8','#f4f2e6',.18,.45,.7],an:'#c0b060',fi:'#dcd8a0',po:'#ece080'}};
/* the material of one colourway, for svBloom (inside: front; outside: back) */
const TUL_M={};
function tulMat(cw){if(TUL_M[cw.id])return TUL_M[cw.id];const S=TULS[cw.id]||{i:cw.c},i=S.i,t=S.t||i,ba=S.ba||i,bv=S.bv??.18,o=S.o||mix(i,'#e8e0d0',.08),ot=S.ot||mix(o,t,.5),
    ob=mix(o,'#8aa45a',Math.max(S.g||0,.22)),[h,s,l]=h2l(i),shade=S.sh||l2h(h,Math.min(1,s*1.1),l*.36),an=S.an||'#2a2230';
  return TUL_M[cw.id]={st:[[0,ba],[bv*.6,ba],[bv+.12,mix(i,ba,.12)],[.6,i],[1,t]],bst:[[0,ob],[.32,o],[1,ot]],shade,lite:S.li||mix(i,'#ffffff',.36),bshade:mix(shade,'#4a4a52',.2),
    blite:mix(o,'#ffffff',.42),vein:l2h(h,Math.min(1,s*1.05),l*.72),bvein:mix(o,l2h(h,s,l*.7),.4),rim:mix(t,'#ffffff',.3),cast:mix(shade,'#000000',.45),
    blot:S.bl?{c:S.bl[0],e:S.bl[1],v:S.bl[2]??.22,w:S.bl[3]??.5,op:S.bl[4]??1,k:S.bl[5]}:null,band:S.band?{c:S.band[0],w:S.band[1]??.012,v0:S.band[2]??.42,op:S.band[3]??.9}:null,
    flames:S.fl||null,anth:an,fil:S.fi||mix(an,'#3a3a2a',.3),pol:S.po||mix(an,'#c8b8a0',.3),ov:S.ov||'#8ea060',sg:S.sg||'#e4dc9c'}}
/* the colour of a fading tulip (photographs 85, 194, 198, 203): the blotch and the dark anthers keep; reds go to wine, then olive brown; pinks dull to
   old rose, then tan at the margin; whites to ivory, then parchment; yellows and oranges to ochre, then brown; violets grey toward plum; greens yellow */
function tulWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.16)return c;
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(TUL_DK&&(h>=250||h<30||s<.15))return tulWiltDk(h,s,l,w);
  if(s<.15||l>.86){let o=mix(c,'#eadcb8',.7*w);if(w>.5)o=mix(o,'#b89870',(w-.5)*.8);return o}
  if(h>=335||h<18){if(l<.6){let o=l2h(h<18?h-8*w:h,s*(1-.35*w),l*(1-.3*w));if(w>.5)o=mix(o,'#4a3a26',(w-.5)*.9);return o}
    let o=mix(c,'#a87a78',.55*w);if(w>.5)o=mix(o,'#9a6a5a',(w-.5)*.8);return o}
  if(h<55){let o=l2h(h+(32-h)*.4*w,s*(1-.4*w),l*(1-.22*w));if(w>.55)o=mix(o,'#8a6030',(w-.55)*.8);return o}
  let o=l2h(h+(320-h)*.3*w,s*(1-.45*w),l+(.42-l)*.2*w);if(w>.5)o=mix(o,'#6a4a52',(w-.5)*.7);return o}
/* the dark colourways (a body darker than l .34: noir, pourpre-velours, violet) fade otherwise (refcache/tulipe-simple/fane-sombre.md, ten photographs):
   a very dark red stays red-black (#480407 to #831019), a bordeaux stays very dark (#4e1c2e), a mauve rose browns to a pink brown (#6f3839 to #8d5754)
   with a mauve-brown margin (#5b3746), the pale tips and bleached patches go a dusty pink (#c98698, #c3959a); beige shows only on a dried head. No
   photograph of a fading purple-black was found: assumed like the dark reds and the bordeaux (it stays dark, a little browner, its lights go a dusty
   mauve pink). TUL_DK is set while such a head is drawn (tulSvg); its purples, reds and greys follow tulWiltDk, the rest (greens, cream foot, pollen)
   the common rule above. The darks: a little darker and greyer, the hue toward wine; the lights: toward a dusty pink; then both brown a little */
let TUL_DK=false;
function tulDark(cwx){const S=TULS[cwx.id],c=(S&&S.i)||cwx.c;return typeof c==='string'&&c.length===7&&h2l(c)[2]<.34}
function tulWiltDk(h,s,l,w){const hu=h>=250&&h<350?h+(350-h)*.4*w:h,k=svSm((l-.3)/.3),sd=s*(1-.3*w),ld=l*(1-.12*w),sl=s+(.3-s)*.5*w,ll=l+(.64-l)*.3*w;
  let o=l2h(hu,sd+(sl-sd)*k,ld+(ll-ld)*k);if(w>.55)o=mix(o,mix('#40222a','#a07480',k),(w-.55)*.6);return o}
if(typeof GHI!=='undefined'&&GHI['tulipe-simple'])GHI['tulipe-simple'].wilt=tulWiltCol;
/* how far the tulip has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function tulLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'tulipe-simple',rec:{}})):0}
/* the tulip's heart, every kind */
const TUL_HEART={ovH:.42,sgR:.09,filL:.26,anL:.3,filA:.1};
/* SVT_BOTA: the botanical tulip, the v1 sheet exactly (its genes and numbers of 2026-10-08) */
const TUL_GENES={n:[[6,1]],tep:{dL:[.95,1.04],dW:[.93,1.07],dph:[-.05,.05],da0:[-.05,.05],da1:[-.07,.07],tw:[-.1,.1],wav:[.01,.035],wk:[1.2,2.2],wph:[0,6.28],
    notch:[0,.015,.12],tip:[1.6,2.4],asym:[-.05,.05],curl:[0,.1,.3],cup:[.9,1.1],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.92,1.08],op:[-.05,.05],ring:[.9,1.12],dh:[-3,3],ds:[-.05,.05],dl:[-.025,.02],stL:[.92,1.08],sd:'sd'}};
const SVT_BOTA={genes:s=>svGenes(s,TUL_GENES),mat:tulMat,heart:svHeart6(TUL_HEART),
  L:[1.72,1.62],Wd:[.72,.8],r0:.035,z0:[-.012,.006],a0:[[.36,.42],[.2,.5]],a1:[[.06,.78],[-.14,.92]],cupW:[1,1.1],
  open:[.3,.8],bud:[.2,.4],green:[.4,.03,.22],greenC:'#8aa45c',budPale:false,budH:[1.5,.3],budR:.31,budE:[.08,.915],budW:[1.5,1.35],budHw:[1,.95],budRw:[1,.93],
  vb:.58,claw:[.62,.38],clawK:.9,cup:.45,cupFan:.6,sag:[.02,.05,.2],tip:[[.06,.2,.4],[.25,.55,.3]],
  wA0:[.28,.3],wA1:[.6,.45],limp:[.8,.12],curl:[.12,.32],tw:[.5,.9],wav:[.6,1.2,2.2],fanL:.05,fanW:.18,shedW:.3,shed:[.8,.14],
  edge:{light:'#d8c49a',red:'#5a2820',other:'#b89a8c',a:[.2,.46]},trans:[.14,.18],rim:[.004,.006,.15,.1],veinN:[18,9],veinNet:[.15,0],veinFork:[.5,.25],ao:[.5,.3,.2,.3],nu:[10,12],
  light:Object.assign({},SVB_DEF.light,{ks:.14,gloss:20,wrap:.32,darkLo:[.88,.72,.56],litLo:[1.12]})};
/* SVT_SIMPLE: the single cut tulip, a U from bud to full bloom. Its genes: smooth, hardly waved or twisted tepals (they nest) */
const SVT_GENES={n:[[6,1]],tep:{dL:[.96,1.03],dW:[.95,1.05],dph:[-.035,.035],da0:[-.035,.035],da1:[-.05,.05],tw:[-.05,.05],wav:[.004,.016],wk:[1.2,2.2],wph:[0,6.28],
    notch:[0,.012,.1],tip:[1.7,2.5],asym:[-.04,.04],curl:[0,.06,.3],cup:[.94,1.06],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.95,1.05],op:[-.04,.04],ring:[.9,1.12],dh:[-3,3],ds:[-.05,.05],dl:[-.025,.02],stL:[.92,1.08],sd:'sd'}};
/* the floor of the cup: a shallow bowl on the receptacle, inside the tepals' feet (the six claws never leave a slit at the bottom of the U) */
function tulFloor(h6){return ctx=>{const{B,O,R0,cw0,bud,pieces}=ctx;if(bud<.9){const c=mix(cw0.bst[0][1],cw0.st[0][1],.35),m=Object.assign({},SVB_DEF.light,{stops:[[0,mix(c,'#000000',.25)],[1,c]],bstops:[[0,mix(c,'#000000',.25)],[1,c]],
    shade:cw0.shade,lite:cw0.lite,bshade:cw0.bshade,blite:cw0.blite,rim:c,cast:cw0.cast,veins:null});
    pieces.push(svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI,h=R0*.12*v,r=R0*.015+h*.6;return[Math.cos(a)*r,Math.sin(a)*r,h-R0*.015]},{nu:12,nv:2,mat:m}))}
  h6(ctx)}}
const SVT_SIMPLE=Object.assign({},SVT_BOTA,{genes:s=>svGenes(s,SVT_GENES),heart:tulFloor(svHeart6(Object.assign({hide:.3,lo:1},TUL_HEART))),
  /* the U: the base flares, the sides stand upright, the tips barely drawn in; the inner whorl stands inside the outer (smaller angles, shorter) */
  L:[1.72,1.6],Wd:[.7,.7],z0:[-.012,.012],claw:[.12,.88],clawK:.6,a0:[[.95,.12],[.74,.12]],a1:[[-.1,.16],[-.28,.16]],aPow:.75,cupW:[1,1.4],cup:.46,cupArc:true,lap:.1,pmin:9,open:[.3,.7],sag:[0,.02,.2],
  /* the bud: a pointed egg, 1.6 to 2 times as high as wide, green from the foot, the colour coming from the tip */
  bud:[.2,.35],budH:[1.55,.25],budR:.28,budK:1.25,budP:.95,budE:[.06,.93],green:[.8,.05,.16],greenTip:.65,greenC:'#7f9e52',
  /* the decline: it opens to a star and lies flat (wl .3 to .6), then hangs and falls */
  dec:[.22,.33],wA0:[.75,.3],wA1:[1.15,.45],veinLo:false,
  light:Object.assign({},SVB_DEF.light,{ks:.14,gloss:20,wrap:.32,darkLo:[.86,.66],litLo:[1.12]})});
/* the tulip head: tepals and heart, in the frame B at O, D across, opening op, wilted wl (by default the bouquet's stage); S its kind's sheet */
function tulSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_TSIM!=='undefined'&&CW_TSIM.find(x=>x.id===cwId))||{id:cwId,c:'#d03030'},dk0=TUL_DK;
  TUL_DK=tulDark(cwx);try{return svBloom(par,B,O,D,S||SVT_SIMPLE,cwx,op,seed,wl==null?tulLife():wl)}finally{TUL_DK=dk0}}
SV_HEAD['tulipe-simple']=tulSvg;
/* the tulip of the bouquet: the old drawing's share of the bouquet's chance is consumed (its six tepals: 24 draws), and the first draws name the individual */
function tulSvgPut(par,B,O,D,cw,op,o){let s=0;for(let i=0;i<24;i++){const x=rnd();if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return tulSvg(par,B,O,D,cw.id,op,svSeed('tulipe',cw.id,s),tulLife(o))}
/* the neck of a fading tulip: it goes on growing in the vase, lengthens and bends over sideways, toward where the flower leans (the head following its end).
   On the sheets only (SVA_LIFE set, as for the double tulip): in a bouquet the neck keeps the old drawing's geometry, since where the neck ends decides
   whether the bouquet moves the head and draws it again (c5.js), which would change the bouquet's draws (rtest) */
function tulNeckBend(res,og,wl){if(!(wl>0))return;const c0=res.chains[0],P=c0.pts,n=P.length;if(n<3)return;
  const grow=1+.28*svSm((wl-.1)/.6),bend=1.05*svSm((wl-.2)/.6);const hz=V3.nz([(og.H[0]<0?-1:1)*Math.max(Math.abs(og.H[0]),.6),0,og.H[2]*.4]);const A=V3.nz(V3.cr([0,1,0],hz));
  const Q=[P[0]];for(let i=1;i<n;i++){const s=V3s(P[i],P[i-1]),t=i/(n-1);Q.push(V3.add(Q[i-1],V3.sc(rotA(s,A,bend*Math.pow(t,1.3)),grow)))}
  c0.pts=Q;og.pos=Q[n-1];og.H=rotA(og.H,A,bend);og.U=rotA(og.U,A,bend);og.L=V3.cr(og.U,og.H)}
/* the stem: thick, smooth, glaucous (a lit cylinder, no hairs, no ribs) */
const TULS_SC=['#3c5a48','#62826c','#93ae99','#cadacd'];TULS_SC.sv={swell:.03,gloss:.42};
if(typeof GHI!=='undefined'&&GHI['tulipe-simple'])Object.assign(GHI['tulipe-simple'],{sc:TULS_SC,sw:6});
/* the leaves on a bouquet stem (STEML's hook in stemLeaves; screen to view space): broad, glaucous, clasping, folded in a gutter, the margins waved,
   leaning a little toward the eye so their sheath lies in front of the stem */
function tulLeafSv(par,x,y,ang,len,o){const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,zk=.3+.35*pxHashS(k,3,Math.round(x*7+y*13)),Out=V3.nz(V3.add(side,[0,0,zk]));
  return svStrapLeaf(par,[x,-y,0],H,Out,{len:len*1.15,w:.3,sr:3.4,lean:.32+Math.acos(Math.max(-1,Math.min(1,V3.dot(Lv,H))))*.6,droop:.5,tw:.35,gut:.5,wav:.06,wavN:2.6+.8*pxHashS(k,5,7),
    hood:.3,bloom:.65,up:'#5a8169',low:'#7d9c86',base:'#b2c6a2',sd:svSeed('tulipe-feuille',Math.round(x*8),Math.round(y*8),k),wl:tulLife()})}
if(typeof STEML!=='undefined'&&STEML['tulipe-simple'])STEML['tulipe-simple'].sv=tulLeafSv;
