/* ================= Pilote : la tulipe frangée (Fringed Group, division 7), fiche de sorte sur le module y-tulipa.js =================
   SVT_FRINGE: only what the fringed tulip's photographs impose over the single tulip (refcache/tulipe-frangee: brief.md, coloris.md, recensement.md):
   - the single late goblet (most fringed cultivars are its sports): a U at the bouquet's stage (op .6 to .85), the tips a little pointed and
     flaring as it opens;
   - the margin above the broadest point and down the flanks edged with a crystal fringe of fine needles, paler than the body (svFringe, y3-marge.js),
     already on the bud;
   - inside, a large dark heart (Louvre: blue-black at the centre, aubergine at its edge), six dark anthers, a cream stigma.
   Colourways: TFRGS, as TULS (y-tulipa.js) plus fr (the fringe, inner face) and bfr (outer face). Keys prefixed 'frg-' in TULS (the single tulip keeps
   its own). All the colourways of CW_TFRG (s9a.js) are transcribed below (fleur-finition); one not listed would fall back on its catalogue colours (c, bl, fr). */
const TFRGS={
  /* fuchsia = Louvre (recensement.md, coloris.md; confidence: medium): violet-pink, paler inside toward the tips, lilac fringe; the heart blue-black
     (#201e33 at its centre, #391839 at mid-radius, refs.py ring on the Van Engelen close-up 329), dark anthers, cream stigma; the outer face
     violet down to its foot (ob; the genus' greened foot showed as a pale V between the outer claws in profile; 320: #664666 in the shade) */
  fuchsia:{i:'#c25aa6',t:'#d68ccc',ba:'#5c1c4c',bv:.16,o:'#bc4c92',ot:'#cc7cbc',g:.3,sh:'#5a1048',li:'#f2b8e6',bl:['#221a34','#4e1a44',.32,.85,1],
    an:'#262030',fi:'#2c2434',po:'#4a4250',ov:'#c8c098',sg:'#e8dcb0',fr:'#e4b8ea',bfr:'#d8a6dc',ob:'#8a3c78'},
  /* The others (fleur-finition, 8 Oct 2026): i the inside body, t its tip, ba the base up to bv, o/ot the outside, ob the outside foot (set on every
     colourway: the genus' greened foot read as a pale V between the outer claws in profile), sh/li the shade and the light, bl the blotch,
     fr/bfr the fringe (inside / outside). Measured on the cleanest photographs (a Lab median of the flower on its background, rings from the centre),
     the body lifted by 1/0.85: the engine's wrap and occlusion darken a lit petal's median by about 15 % (fuchsia: 0.78). */
  /* rose = Fancy Frills (B): hot pink (#d66f95 lit median, Van Engelen 11; coloris.md #d9708a), a pale pink throat, a paler pink fringe, pale yellow anthers */
  rose:{i:'#f87aa8',t:'#f698bc',ba:'#f6d4d6',bv:.2,o:'#e87098',ot:'#f08cae',g:.1,sh:'#9a2e56',li:'#ffc4d8',bl:['#f6e8e4','#f2c0c8',.2,.42,.8],
    an:'#98883a',fi:'#e8dcc0',po:'#d8c458',ov:'#c8c47a',sg:'#d4dc9c',fr:'#f6c4d4',bfr:'#f0b0c6',ob:'#d86088'},
  /* marque à vérifier */
  /* blanc = Honeymoon (B): a white seen in shade reads #cacdc4 (cool grey, never the beige of the genus' shade): pale cream-green base, pale green foot */
  blanc:{i:'#f8f7f0',t:'#fbfcf8',ba:'#f0f2dc',bv:.22,o:'#eef0e4',ot:'#f6f8f0',g:.3,sh:'#8a8e8c',li:'#ffffff',bl:['#e6e8c4','#f0f2e0',.2,.45,.7],
    an:'#a09a58',fi:'#dcdcb0',po:'#e4e078',sg:'#e0e8b8',fr:'#ffffff',bfr:'#f6f8ee',ob:'#d6e2bc'},
  /* jaune = Hamilton (B): golden lemon (Promesse de Fleurs 20: #d2a106 to #f3ce1c; the catalogue's #f6d02a is too pale and too pure), a deeper gold base, no blotch, a paler yellow fringe */
  jaune:{i:'#f6c418',t:'#f8d034',ba:'#e0a410',bv:.22,o:'#ecb616',ot:'#f2c52c',g:.12,sh:'#7e540a',li:'#fcea7c',bl:['#d89c10','#ecc030',.2,.45,.7],
    an:'#8a6a1a',fi:'#d8bc60',po:'#e8c840',sg:'#d8dc90',fr:'#fae890',bfr:'#f2d870',ob:'#c89a14'},
  /* marque à vérifier */
  /* rouge = Barbados (B): crimson red, not bordeaux (Commons 23: #ab0318 median, #ce1033 lit), a blue-black blotch and dark anthers, a redder-lighter fringe */
  rouge:{i:'#d0102a',t:'#da2a40',ba:'#74081a',bv:.2,o:'#c0102a',ot:'#d02c42',g:.08,sh:'#5a0212',li:'#f4606c',bl:['#1c0a14','#42101e',.28,.5,1],
    an:'#1c1418',fi:'#2c2024',po:'#4a4250',sg:'#e8dcb0',fr:'#e2404f',bfr:'#d0303f',ob:'#8a1024'},
  /* marque à vérifier */
  /* lilas = Cummins (B): dusty mauve (Van Engelen 26: #b176a6 and #905386), a blue-black blotch (Van Engelen 295), a creamy-white fringe */
  lilas:{i:'#b87cb8',t:'#cc98c8',ba:'#7e4a86',bv:.2,o:'#a870a8',ot:'#c490bc',g:.1,sh:'#62306a',li:'#ecc8e6',bl:['#20223c','#4a3868',.3,.5,1],
    an:'#242030',fi:'#2c2838',po:'#484050',sg:'#e8dcb0',fr:'#f2e8f2',bfr:'#e4d4e4',ob:'#8a5a90'},
  /* noir = Vincent van Gogh (B): aubergine black with a blue-violet sheen (DutchGrown 31: #402544, lit #46365c to #624d79), a grey-lilac fringe */
  noir:{i:'#4b2c50',t:'#5a3862',ba:'#2a1228',bv:.2,o:'#44244a',ot:'#543064',g:.04,sh:'#1c0a1e',li:'#7a5a98',bl:['#140810','#2c1430',.2,.45,1],
    an:'#1a1218',fi:'#26202a',po:'#3c343c',sg:'#d8cca0',fr:'#a888b0',bfr:'#8a6a94',ob:'#3a1c40'},
  /* orange = Lambada (B): amber orange (Van Engelen 37: #cd7c39 median, golden fringe #ffdc88), a red-brown base, yellow-orange anthers (304); the pink of the catalogue's name only shows in a red flame (Tulips.com 38, red-orange outlier) */
  orange:{i:'#f19a48',t:'#f4a850',ba:'#c04a1c',bv:.24,o:'#e88434',ot:'#f09a46',g:.1,sh:'#8a3006',li:'#fcc880',bl:['#a83a18','#e07828',.22,.5,.85],
    an:'#c88a28',fi:'#e0b060',po:'#e8b838',sg:'#e8c060',fr:'#f8c040',bfr:'#f0aa30',ob:'#c8602a'},
  /* jaune-rose = Aria Card (C, derived, to be confirmed: shaded garden photographs 444-454): cream-yellow body, a rose-red picotee (448: #8b1d2e to #bf686f), pink-white fringe, black-brown heart and dark anthers */
  'jaune-rose':{i:'#f4e8a0',t:'#f8eeb4',ba:'#e8d070',bv:.2,o:'#eadc90',ot:'#f2e8a8',g:.15,sh:'#8a7430',li:'#fff8d0',band:['#dc4c74',.03,.5,.85],bl:['#3a2418','#8a7a30',.22,.45,.85],
    an:'#2a2018',fi:'#3a2e24',po:'#5a4a30',sg:'#e8d890',fr:'#f4b8c8',bfr:'#ecc8b0',ob:'#c8b060'},
  /* ---- late:1, level A or B (coloris.md, recensement.md) ---- */
  /* blanc-rouge = Burning Fire (B): cream-white with broad crimson flames down the seams and the midribs (DutchGrown 46: #de123f), a white fringe */
  'blanc-rouge':{i:'#fffaf0',t:'#fffcf6',ba:'#f8ece0',bv:.2,o:'#f8f0e4',ot:'#fcf6ee',g:.15,sh:'#bcb0a6',li:'#ffffff',fl:{c:'#c4103c',n:[2,2],from:.04,to:.97,w:.1,op:.95},bl:['#e8d8c8','#f6ecdc',.2,.45,.7],
    an:'#3a2a28',fi:'#6a5a50',po:'#8a7a60',sg:'#e8dcb0',fr:'#f6e8e4',bfr:'#f0dcd8',ob:'#e4cbb8'},
  /* marque à vérifier */
  /* rouge-blanc = New Santa (B): vermilion red (Jacques Amand 50: #ba343a median), a dark red base, a white fringe */
  'rouge-blanc':{i:'#e04444',t:'#e44a42',ba:'#7a1814',bv:.18,o:'#d02c34',ot:'#dc4640',g:.08,sh:'#6a0c0e',li:'#fa7a70',bl:['#2a0c10','#5a1a1c',.24,.45,.9],
    an:'#2a1a1c',fi:'#4a3434',po:'#6a5a50',sg:'#e8dcb0',fr:'#fff0e8',bfr:'#f8e0d8',ob:'#982028'},
  /* marque à vérifier */
  /* pourpre-prune = Purple Crystal (B): dark plum with a grey bloom outside (Jacques Amand 55: #5d2938 median), a black-plum base, a mauve-pink fringe */
  'pourpre-prune':{i:'#6c2a4c',t:'#7c3a5c',ba:'#34102c',bv:.2,o:'#602848',ot:'#704064',g:.04,sh:'#260a20',li:'#b06a98',bl:['#18080f','#3a1830',.24,.5,1],
    an:'#1e1820',fi:'#2a2230',po:'#4a4250',sg:'#d8cca0',fr:'#b078a4',bfr:'#8a5a80',ob:'#5a2448'},
  /* jaune-blanc = Burning Flame (B): lemon yellow (DutchGrown 62: #eade48), a deeper yellow base, a cream-white fringe */
  'jaune-blanc':{i:'#fff25c',t:'#fff488',ba:'#f0d434',bv:.22,o:'#f8e050',ot:'#fcec78',g:.12,sh:'#a89a20',li:'#fffcb0',bl:['#d8b418','#ecd040',.2,.45,.7],
    an:'#6a5a20',fi:'#d8c870',po:'#e8d040',sg:'#dce09c',fr:'#fbf6dc',bfr:'#f4ecc0',ob:'#c8b030'},
  /* marque à vérifier */
  /* rouge-jaune = Fabio (B): red (Jacques Amand 67: #9f2123 in shade, #b32a2f lit), a dark red base, an orange-gold margin and fringe (#f18748) */
  'rouge-jaune':{i:'#d02828',t:'#dc3a28',ba:'#7a1c14',bv:.2,o:'#c42222',ot:'#d43a26',g:.06,sh:'#5a0a0a',li:'#f26a50',band:['#f29a1c',.034,.6,.9],bl:['#2a1010','#5a1a14',.24,.45,.9],
    an:'#2a1a14',fi:'#4a3428',po:'#6a5a40',sg:'#e8d090',fr:'#f29018',bfr:'#e07c10',ob:'#8a1a18'},
  /* creme-framboise = Passion Play (B): a white-pink body feathered raspberry (Jacques Amand 74: #bf66a6 median), a dark raspberry base, a raspberry fringe */
  'creme-framboise':{i:'#f8e8f0',t:'#e090c0',ba:'#d86aa4',bv:.16,o:'#f0cade',ot:'#dc80b8',g:.1,sh:'#8a2a62',li:'#fff0f8',fl:{c:'#b0287e',n:[2,2],from:.06,to:.97,w:.09,op:.85},bl:['#6a0c36','#a02a68',.2,.45,.85],
    an:'#2a1a28',fi:'#5a3a4a',po:'#7a5a60',sg:'#e8d8a8',fr:'#b83898',bfr:'#a82888',ob:'#d078a8'}
};
/* the colourways added (late:1, at the end: no SKU number moves; the names carry no cultivar's name) */
if(typeof CW_TFRG!=='undefined'&&!CW_TFRG.some(x=>x.id==='blanc-rouge'))CW_TFRG.push(
 {id:'blanc-rouge',n:'Blanc flammé de rouge',c:'#f6efe4',bl:'#e8d8c8',fr:'#f6e8e4',late:1},{id:'rouge-blanc',n:'Rouge frangé de blanc',c:'#d8383c',bl:'#2a0c10',fr:'#fff0e8',late:1},
 {id:'pourpre-prune',n:'Prune pourpre frangé de mauve',c:'#6c2a52',bl:'#18080f',fr:'#b078a4',late:1},{id:'jaune-blanc',n:'Jaune doux à franges blanches',c:'#f4e050',bl:'#d8b418',fr:'#fbf6dc',late:1},
 {id:'rouge-jaune',n:'Rouge frangé de jaune',c:'#cc2a2a',bl:'#2a1010',fr:'#f29018',late:1},{id:'creme-framboise',n:'Crème à franges framboise',c:'#f2d4e6',bl:'#6a0c36',fr:'#b83898',late:1});
for(const k in TFRGS)TULS['frg-'+k]=TFRGS[k];
/* the material: the genus' (tulMat, on the prefixed key), plus the fringe's colours */
/* from this wilt on the head is drawn by the lighter sheet SVT_FRINGE_FAN (budget: the faded head was 388 to 469 elements and 74 to 90 Ko, the ceiling is 360 and 60) */
const TFRG_FAN=.3;
const TFRG_M={};
/* the bouquet's detail (DET 1, before the fade) of a colourway with flames or a picotee (lt): over a plain colourway its flames cost 20 to 30 elements and 8 to 10 Ko a head,
   and again for every patch (a patch draws its tepal a second time, flames included): 389 elements at worst in a stem of 40 cm with 2 leaves, the ceiling is 360.
   One flame per tepal, broader, and on the outside only while the cup is closed (op < bud: the inside is hidden); no blotch while the cup is closed (op < blot: the foot
   of the inside, hidden, and drawn with an opacity of 0 on the bud); the patches kept to the overlaps of pm cells or more (the patch of 9 cells or more, the single's, only
   mends specks: 0.06 % of the pixels of the sheet change at 24 levels). The plain colourways and the fade (SVT_FRINGE_FAN) keep their own */
const TFRG_LT={bud:.5,blot:.42,w:1.55,pm:45};
function tulFrgMat(cwx){const id='frg-'+cwx.id,lo=DET<1.5,fan=(cwx.wl||0)>=TFRG_FAN,far=(cwx.wl||0)>=.6,hang=(cwx.wl||0)>=.7,S0=TFRGS[cwx.id],lt=lo&&!fan&&S0&&(S0.fl||S0.band),cl=lt&&cwx.op!=null&&cwx.op<TFRG_LT.bud,nb=cl&&cwx.op<TFRG_LT.blot,
    key=id+(lo?'l':'h')+(fan?'f'+(far?'g':'')+(hang?'h':''):lt?(nb?'c':cl?'m':'o'):'');if(TFRG_M[key])return TFRG_M[key];
  const S=S0||{i:cwx.c,bl:cwx.bl?[cwx.bl,cwx.bl,.22,.5,.9]:null,fr:cwx.fr};if(!TULS[id])TULS[id]=S;const m=Object.assign({},tulMat({id,c:cwx.c}));
  if(S.ob)m.bst=[[0,S.ob]].concat(m.bst.slice(1));m.fr=S.fr||mix(m.st[m.st.length-1][1],'#ffffff',.4);m.bfr=S.bfr||mix(m.fr,m.bst[m.bst.length-1][1],.3);
  /* the bouquet's level of detail: fewer, broader flames (the zoom keeps them all) */
  if(lo&&m.flames)m.flames=lt?Object.assign({},m.flames,{n:[1,1],w:m.flames.w*TFRG_LT.w,side:cl?-1:undefined}):Object.assign({},m.flames,{n:[1,2],w:m.flames.w*1.4});
  if(nb&&m.blot)m.blot=null;
  /* the faded head: from wilt .7 its tepals hang, showing their outside, so the flames on that face only; a light body just under
     the engine's blotching threshold (lightness .78: it browns the pale colourways in 2 to 7 blotches a face, 100 elements a head), fanL then fades the edge only */
  if(fan){if(hang&&m.flames)m.flames=Object.assign({},m.flames,{side:-1});
    /* the picotee's band (12 strokes a head) goes into the tips' colour once the tepals hang (wilt .6), at the bouquet's level of detail */
    if(lo&&far&&m.band){const b=m.band,k=b.op*.5;m.st=m.st.map(([v,c],i)=>[v,i===m.st.length-1?mix(c,b.c,k):c]);m.bst=m.bst.map(([v,c],i)=>[v,i===m.bst.length-1?mix(c,b.c,k):c]);m.band=null}
    const[h3,s3,l3]=h2l(m.st[3][1]);if(l3>.78){m.st=m.st.map(([v,c],i)=>i===3?[v,l2h(h3,s3,.77)]:[v,c]);m.fanL=1}}
  return TFRG_M[key]=m}
/* the genes: the single's smooth tepals, their tips a little more pointed and flaring (curl) */
const TFRG_GENES={n:[[6,1]],tep:{dL:[.96,1.03],dW:[.95,1.05],dph:[-.035,.035],da0:[-.035,.035],da1:[-.06,.06],tw:[-.06,.06],wav:[.004,.02],wk:[1.2,2.2],wph:[0,6.28],
    notch:[0,.012,.1],tip:[1.25,1.7],asym:[-.05,.05],curl:[.04,.14],cup:[.94,1.06],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.95,1.05],op:[-.04,.04],ring:[.9,1.12],dh:[-3,3],ds:[-.05,.05],dl:[-.025,.02],stL:[.92,1.08],sd:'sd'}};
/* the fringe: dense needles 0.075 R0 long (about 0.06 of a tepal's width, Louvre), from just below the shoulders over the tip */
/* life (photographs of fringed buds, Vertuco 210, 249, Commons 2): on the closed bud the six fringes stand up together as a crest over the apex and run
   down the seams (fromB: how much lower they start on the bud); faded, the thin needles dry first: they brown and shrivel (dec, fan, br) */
const TFRG_FRINGE={n:[72,32],from:.82,fromB:.2,len:[.075,.35],w:.5,taper:.22,band:.35,lean:.12,jit:.4,shd:.5,bud:1.2,budC:.12,green:SVT_SIMPLE.green,greenC:SVT_SIMPLE.greenC,
  dec:.2,fan:.55,brown:'#7e5c48',br:.8};
function tulFrgHeart(F){const h6=svHeart6(Object.assign({hide:.3,lo:1},TUL_HEART)),fl=tulFloor(h6);
  return ctx=>{svFringe(Object.assign({},F,{from:F.from-F.fromB*ctx.bud}))(ctx);(DET>=1.5?fl:h6)(ctx)}}
const SVT_FRINGE=Object.assign({},SVT_SIMPLE,{genes:s=>svGenes(s,TFRG_GENES),mat:tulFrgMat,heart:tulFrgHeart(TFRG_FRINGE)});
/* the faded head (wilt .3 and more): the same tepals and genes, but lighter to draw (budget, DET 1 and the zoom alike), as the parrot's (SVT_PARROT_FAN):
   no shade wash, a coarser mesh, fewer patches, calmer ruffles and twists, fewer needles in the fringe (shortened and browned by now, they are barely seen) */
const TFRG_FRINGE_FAN=Object.assign({},TFRG_FRINGE,{n:[40,16]});
const SVT_FRINGE_FAN=Object.assign({},SVT_FRINGE,{light:Object.assign({},SVT_FRINGE.light,{darkLo:[],litLo:[]}),nu:[10,10],nv:8,pmin:40,wav:[.6,.5,.8],crk:[.05,.03],tw:[.5,.5],curl:[.12,.15],
  heart:tulFrgHeart(TFRG_FRINGE_FAN)});
delete SVT_FRINGE_FAN._m;
/* a light colourway fades to the same beige on the edge, without the blotches (tulFrgMat keeps its body just under the engine's threshold once it is fading) */
const SVT_FRINGE_FANL=Object.assign({},SVT_FRINGE_FAN,{edge:Object.assign({},SVT_FRINGE_FAN.edge,{other:SVT_FRINGE_FAN.edge.light})});
delete SVT_FRINGE_FANL._m;
const SVT_FRINGE_FL=Object.assign({},SVT_FRINGE,{pmin:TFRG_LT.pm});/* the bouquet's detail of the flamed and picotee colourways, before the fade */
delete SVT_FRINGE_FL._m;
/* how far the fringed tulip has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function tulFrgLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'tulipe-frangee',rec:{}})):0}
/* the head: tepals, fringe and heart (colourways of CW_TFRG, s9a.js) */
function tulFrgSvg(par,B,O,D,cwId,op,seed,wl){const w=wl==null?tulFrgLife():wl,cw=(typeof CW_TFRG!=='undefined'&&CW_TFRG.find(x=>x.id===cwId))||{id:cwId,c:'#d8508a'};
  const cwx=Object.assign({},cw,{wl:w,op});
  const S0=TFRGS[cwId];
  return svBloom(par,B,O,D,w<TFRG_FAN?(DET<1.5&&S0&&(S0.fl||S0.band)?SVT_FRINGE_FL:SVT_FRINGE):tulFrgMat(cwx).fanL?SVT_FRINGE_FANL:SVT_FRINGE_FAN,cwx,op,seed,w)}
SV_HEAD['tulipe-frangee']=tulFrgSvg;
/* the fringed tulip of the bouquet: the old drawing's share of the bouquet's chance is consumed (six tepals, 4 draws each: 24, as tulipDrawn with
   kd 'fringe': phase, length, twist, petS), the first three name the individual */
function tulFrgPut(par,B,O,D,cw,op,o){let s=0;for(let i=0;i<24;i++){const x=rnd();if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return tulFrgSvg(par,B,O,D,cw.id,op,svSeed('tulipe-frangee',cw.id,s),tulFrgLife(o))}
/* the head on its stem (tulipHead's fringed line, s9a.js), as the single: held nearly upright (the U seen from the side); the turtle starts at the
   neck's width (the bouquet's stem as thick as the neck); the neck bends as it fades only on a stem drawn alone (NECK_X: the bouquet nods the head).
   plante v2: the neck in one piece (piece 12: one cylinder, not two); in close-up (DET 1.5) the receptacle swells under the cup (tulFrgCollar) */
function tulFrgHead(g,t,o,cw,op,Dm,k,B,up,ax,U0,Lq){const gh=GHI['tulipe-frangee']||{},sw=gh.sw||Dm*.1,aim=V3.nz(V3.add(V3.sc(ax,.45),V3.sc(up,.85))),sc=gh.sc||TUL_SC;
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.06,c:sc}],['F',{l:Lq*.55,w1:sw,aim,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,wig:.035,seg:Dm*.22,w:sw*1.12}),og=res.organs[0];
  if(!(typeof NECK_X!=='undefined'&&NECK_X))tulNeckBend(res,og,tulFrgLife(o));const apex=og.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:12,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>{if(DET>=1.5)tulFrgCollar(par,og,pos,sw,Dm,sc);
    return tulFrgPut(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,o)}}]})});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}
/* the receptacle under the cup (photograph 90: about 30 px under a cup of 300 against 16 lower down, over some 20 px): the stem's width up to its
   last .11 of the flower (the cup's foot hides its top), then swelling (t squared) to 1.6 times; no chance drawn */
function tulFrgCollar(par,og,pos,sw,Dm,c){const h=[og.H[0],-og.H[1]];if(Math.hypot(h[0],h[1])<.2)return;const L=Dm*.11,e=[pos[0],-pos[1]],C=[],W=[];
  for(let i=0;i<=8;i++){const t=i/8;C.push([e[0]-h[0]*L*(1-t),e[1]-h[1]*L*(1-t)]);W.push(sw*(.96+.64*t*t))}svStemLine(par,C,W,c)}
/* the stem (plante v2, measured by script on the fringed photographs, refcache/tulipe-frangee/journal.md): under a closed cup (opening .3 to .5) the
   stem is .073 (Crunchy Cummins), .081 (99), .10 and .10 (Santander), .15 and .15 (Cummins, 551) of the cup's width, median .10; .06 of the open flower
   (Fancy Frills, 63). 2.3 units give .10 of the cup at the bouquet's stage (the v1's 2 gave .09, its foot as thin). Thicker at the foot (the neck's
   and the bouquet's taper, 1.21 to 1.0), narrowest under the receptacle. Smooth, round, no rib; a glaucous yellow-green, hue 85 to 92 (Crunchy
   Cummins: body #6e8a4e, lit #9eb27f; 99: #44612a in shade; 90: #6b9733 in the sun), the wax's broad matte sheen (the v1's teal, hue 145, was off) */
const TFRG_SC=Object.assign(['#44593a','#68844e','#a9bf8a','#d6e2c6'],{sv:{swell:.025,gloss:.3}});
if(typeof GHI!=='undefined'&&GHI['tulipe-frangee'])Object.assign(GHI['tulipe-frangee'],{sc:TFRG_SC,sw:2.3,wilt:tulWiltCol,cut:1});
/* the leaves (plante v2; photographs 450, 441, 442, 74, 72 of the fringed tulips, 144 and 136 of other garden tulips): one or two on a cut stem (the
   bouquet's chance, s9a.js R(1,2), unchanged), three or four on the whole plant; alternate, clasping the stem low down: the lowest at the foot of the
   visible stem, the upper one about a third of the way up, the flower stalk bare above (STEML.place, y3-plante.js; STEML.low lets the window start
   .3 of a leaf above the vase's mouth, no chance drawn). The lowest broad (2.9 times as long as wide, widest at .28), cupped, its margin waved in
   6 to 8 half-waves, the tip hooded; the upper narrow (4.6; 450: widths 1, .68, .28 of the widest at .27, .65, .88 of its length; 144: 4.3 and more),
   folded in a deep gutter, more upright, the tip long and acuminate. Glaucous grey-green, hue 95 to 105 (450: #789369, #7d9872 in the sun, the wax
   #b5c2b1 to #bbd6b7; 441: #8da084, #a9c4a3), the upper face darker, the underside paler and bluer; the midrib and (close-up) the parallel veins;
   limp, hanging, then yellow from the tip at the fade. TFRG_LEAF: the numbers in one place */
const TFRG_LEAF={zk:[.9,.5],sr:.7,sheath:.08,nu:6,nv:13,bloom:1,up:'#90ad84',low:'#a6bdab',base:'#c0cea6',yel:'#b0a055',
  form:[{w:.34,lk:1.15,wp:[[0,.5],[.06,.74],[.28,1],[.55,.9],[.78,.58],[.92,.24],[1,0]],lean:.42,droop:.3,tw:.14,gut:.75,wav:.08,wavN:[6,2],hood:.32},
        {w:.22,lk:1.05,wp:[[0,.55],[.08,.82],[.25,1],[.45,.88],[.65,.66],[.82,.38],[.93,.14],[1,0]],lean:.2,droop:.24,tw:.3,gut:.85,wav:.05,wavN:[5,1.5],hood:.15}]};
function tulFrgLeafSv(par,x,y,ang,len,o){/* GHI.lonly (sheets only): draw one leaf alone, to measure it */if((GHI['tulipe-frangee']||{}).lonly!=null&&GHI['tulipe-frangee'].lonly!==(o.k||0))return;const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,L=TFRG_LEAF,zk=L.zk[0]+L.zk[1]*pxHashS(k,3,Math.round(x*7+y*13)),Out=V3.nz(V3.add(side,[0,0,zk])),wl=tulFrgLife(),
    fa=svSm((wl-.3)/.5),yl=.55*fa,cm=c=>yl>0?mix(c,L.yel,yl):c,gh=GHI['tulipe-frangee']||{},sw=gh.sw||2.3,
    /* the leaf's form: the lowest of two (or more) the broad one, the upper ones narrower; a single leaf between the two */
    n=o.n||1,fi=n<2?.5:k/(n-1),F0=L.form[0],F1=L.form[1],mx=(a,b)=>a+(b-a)*fi,F=Object.assign({},fi<.5?F0:F1,{w:mx(F0.w,F1.w),lk:mx(F0.lk,F1.lk),lean:mx(F0.lean,F1.lean),
      droop:mx(F0.droop,F1.droop),tw:mx(F0.tw,F1.tw),gut:mx(F0.gut,F1.gut),wav:mx(F0.wav,F1.wav),hood:mx(F0.hood,F1.hood)});
  return svStrapLeaf(par,[x,-y,0],H,Out,{len:len*1.12*F.lk,w:F.w,wp:F.wp,sr:sw*L.sr,lean:F.lean+Math.acos(Math.max(-1,Math.min(1,V3.dot(Lv,H))))*.55,droop:F.droop,tw:F.tw*(1-.5*fa),
    gut:F.gut,wav:F.wav*(1-.5*fa),wavN:F.wavN[0]+F.wavN[1]*pxHashS(k,5,7),hood:F.hood,sheath:L.sheath,nu:L.nu,nv:L.nv,bloom:L.bloom,up:cm(L.up),low:cm(L.low),base:cm(L.base),
    sd:svSeed('tulipe-frangee-feuille',Math.round(x*8),Math.round(y*8),k),wl})}
if(typeof STEML!=='undefined'&&STEML['tulipe-frangee'])Object.assign(STEML['tulipe-frangee'],{w:.2,sv:tulFrgLeafSv,place:[[.15],[.03,.36],[.02,.22,.42],[.02,.16,.3,.44]],low:.3});
