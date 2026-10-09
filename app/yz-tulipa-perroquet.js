/* ================= Pilote : la tulipe perroquet (Parrot Group, division 10), fiche de sorte sur le module y-tulipa.js =================
   SVT_PARROT: only what the parrot's photographs impose over the single tulip (refcache/tulipe-perroquet, brief.md, coloris.md, REFERENCES.md):
   - tepals lacerated and feathered on their upper third (svMarge, y3-marge.js), waved, twisted, each its own (wide genes): no two alike;
   - a heavy, broad flower: a goblet in the bud's last days, a wide cup at the bouquet's stage (op .6 to .85), then an irregular star (60 to 80 deg);
   - the bud an ovoid egg (H/W 1.6 to 1.8), green and long, its crests coloured first;
   - the colour feathered: streaks along the tepal (the veins in the flame colour), green flames up the outside, a flushed margin; Apricot Parrot
     rosies as it ages (age: its coral moves to pink);
   - a thick stem bending under the head; broad glaucous leaves with waved margins.
   Each colourway, as TULS (y-tulipa.js), plus: gz the green's height up the outside, gc its colour, vn/bvn the feathering (inside/outside), age
   [colour, share] the colour its tips, margin and feathers move to as it ages. Keys are prefixed 'par-' in TULS (the single tulip keeps its own). */
const TPARS={
  abricot:{i:'#f0c09c',t:'#fb9f90',ba:'#f4e4b4',bv:.2,o:'#f6e8d8',ot:'#f0a8a0',g:.65,gz:.45,gc:'#5f8a48',sh:'#9a7058',li:'#fff4ea',bl:['#eedc96','#f4e8c4',.22,.5,.85],
    band:['#ea6a82',.022,.55,.45],fl:{c:'#e8607a',n:[5,8],from:.15,to:.98,w:.03,op:.85},vn:'#e0707a',bvn:'#e47a80',age:['#ea6a98',.75],an:'#3a2a2a'},
  rouge:{budG:.85,i:'#e00a2e',t:'#e44a38',ba:'#f0c838',bv:.14,o:'#cf1c2a',ot:'#d6402e',g:.75,gz:.48,gc:'#7a9684',sh:'#6a0408',li:'#ff6a50',bl:['#f0c030','#e8a020',.2,.5,.95],band:['#d42030',.03,.4,.85],
    fl:{c:'#5a8048',n:[1,2],from:.05,to:.4,w:.04,op:.55,side:-1},vn:'#a00818',an:'#2a1a1a'},
  blanc:{i:'#f4f0dc',t:'#f6f4e6',ba:'#eee8b8',bv:.2,o:'#eeecd2',ot:'#f2f0de',g:.6,gz:.5,gc:'#7a9a48',sh:'#8e8c70',li:'#ffffff',bl:['#e8e2a8','#f0ecd0',.2,.5,.8],
    fl:{c:'#7a9a48',n:[2,3],from:.04,to:.7,w:.05,op:.8,side:-1},vn:'#d8d4b0',an:'#a89848',fi:'#d8d090',po:'#e4d880'},
  jaune:{i:'#f6dc48',t:'#f8e058',ba:'#e8c838',bv:.18,o:'#e8cc3c',ot:'#eed450',g:.45,gz:.3,gc:'#5a7a20',sh:'#8a7006',li:'#fff4a0',bl:['#c8a828','#e0c040',.18,.4,.6],
    fl:{c:'#4a6a18',n:[1,2],from:.04,to:.45,w:.035,op:.55,side:-1},vn:'#c8a010',an:'#2a2418'},
  noir:{i:'#4a1628',t:'#561c32',o:'#4e1a2e',ot:'#5c2438',g:.25,gz:.25,gc:'#4a5a3a',sh:'#1a0610',li:'#8a4060',bl:['#1a0a14','#2a1220',.2,.45],
    fl:{c:'#4a5a3a',n:[1,2],from:.04,to:.4,w:.04,op:.5,side:-1},vn:'#2a0a18',an:'#c5b85e',fi:'#4a2a30'},
  saumon:{i:'#ec7a6a',t:'#ee8a74',ba:'#f0c080',bv:.16,o:'#e8786c',ot:'#ec8a78',g:.35,gz:.3,gc:'#7a9050',sh:'#8a2e24',li:'#ffb8a0',bl:['#f0c870','#f2c890',.2,.5,.9],
    fl:{c:'#7a9050',n:[1,2],from:.05,to:.45,w:.04,op:.5,side:-1},vn:'#d85a58',an:'#2a2020'},
  rose:{i:'#f66c88',t:'#f67c92',ba:'#f2d0a0',bv:.16,o:'#e87a88',ot:'#ec8c96',g:.5,gz:.4,gc:'#7c9454',sh:'#8a2a40',li:'#ffc8d0',bl:['#f2d8a0','#f0d8c0',.2,.5,.85],
    band:['#d84a72',.02,.5,.4],fl:{c:'#7c9454',n:[1,3],from:.05,to:.55,w:.045,op:.7,side:-1},vn:'#c83e66',an:'#2a2030'},
  cerise:{i:'#f67a22',t:'#f89430',ba:'#f2b038',bv:.16,o:'#e47024',ot:'#ec8a30',g:.35,gz:.28,gc:'#6a8a40',sh:'#8a3006',li:'#ffb870',bl:['#f2b838','#f0a840',.2,.5,.85],
    band:['#e0503a',.02,.5,.35],vn:'#d05a18',an:'#2a2018'},
  lilas:{i:'#c462a8',t:'#c468ac',ba:'#ece8f0',bv:.16,o:'#a868a0',ot:'#b47aac',g:.3,gz:.3,gc:'#7a8a70',sh:'#4a1a48',li:'#e8b8e0',bl:['#f2eef2','#d8c0dc',.22,.55,.9],
    fl:{c:'#7a8a70',n:[1,3],from:.05,to:.6,w:.045,op:.6,side:-1},vn:'#8a3a7a',an:'#2a2238'},
  flamme:{flLo:1,i:'#f0c850',t:'#f4d468',ba:'#f0d060',bv:.18,o:'#eed678',ot:'#f2de8c',g:.4,gz:.3,gc:'#7a9440',sh:'#8a6a10',li:'#fff6c0',bl:['#e8c040','#f0d060',.2,.5,.7],
    fl:{c:'#c8202a',n:[3,5],from:.1,to:.98,w:.08,op:.85},vn:'#d84030',an:'#2a2018'},
  'rouge-blanc':{flLo:1,i:'#f6f0ee',t:'#f6eeee',ba:'#f2e8e0',bv:.16,o:'#f2ecea',ot:'#f4eeee',g:.35,gz:.3,gc:'#8aa060',sh:'#8a7078',li:'#ffffff',bl:['#6a1428','#a02838',.16,.42,.85],
    fl:{c:'#cc1e34',n:[3,5],from:.05,to:.98,w:.09,op:.9},vn:'#d83048',an:'#2a1a20'},
  'vert-rose':{i:'#f0d4d6',t:'#f2c2c8',ba:'#eee6c8',bv:.18,o:'#e4d6c8',ot:'#eac4c6',g:.6,gz:.55,gc:'#7e9a58',sh:'#8a6a6e',li:'#fff4f6',bl:['#eee6c0','#f2ead8',.2,.5,.8],
    band:['#e8a0b0',.025,.5,.5],fl:{c:'#7e9a58',n:[2,3],from:.05,to:.8,w:.07,op:.8,side:-1},vn:'#d898a8',an:'#3a3030'},
  /* late:3, the cultivars of level A or B (recensement.md, coloris.md) */
  'citron-vert':{flLo:1,i:'#f6ea74',t:'#f8ee8c',ba:'#c8c050',bv:.2,o:'#dcd060',ot:'#e6dc70',g:.6,gz:.55,gc:'#6a8a28',sh:'#7a6c10',li:'#fbf6b0',bl:['#c8c458','#d8d888',.2,.5,.8],
    fl:{c:'#6a8a28',n:[2,4],from:.04,to:.85,w:.022,op:.55},vn:'#a8a830',an:'#4a4020',fi:'#c8c070'},
  'creme-framboise':{i:'#eeaabe',t:'#e07ea4',ba:'#f2e6c8',bv:.22,o:'#ecc8c8',ot:'#e48aa8',g:.4,gz:.35,gc:'#5a7a20',sh:'#8a3a5a',li:'#fff0f4',bl:['#f0e2b8','#f2e8d0',.22,.5,.85],
    band:['#d85090',.03,.45,.55],fl:{c:'#5a7a20',n:[1,2],from:.05,to:.4,w:.035,op:.6,side:-1},vn:'#d06a98',an:'#2a2030'},
  'blanc-vert':{i:'#f2f0e0',t:'#eef0e4',ba:'#eae8c8',bv:.2,o:'#e8ecd4',ot:'#eef0e2',g:.6,gz:.55,gc:'#6e8a3c',sh:'#80866a',li:'#ffffff',bl:['#e6e4c0','#f0eedc',.2,.5,.8],
    fl:{c:'#6e8a3c',n:[2,4],from:.04,to:.85,w:.06,op:.85,side:-1},vn:'#c8d0a8',an:'#a89850',fi:'#d8d090',po:'#e4d880'},
  'blanc-rose':{i:'#e8aab8',t:'#e480aa',ba:'#f0e6d0',bv:.2,o:'#e8d8d4',ot:'#e8a8bc',g:.45,gz:.4,gc:'#7a9458',sh:'#8a5a66',li:'#fff6f6',bl:['#f0e6c8','#f2ecd8',.2,.5,.8],
    band:['#d87898',.03,.5,.6],fl:{c:'#7a9458',n:[1,2],from:.05,to:.45,w:.04,op:.6,side:-1},vn:'#d898b0',an:'#2a2430'},
  'jaune-bord-orange':{bandLo:1,i:'#e8b02a',t:'#e8a828',ba:'#f0d040',bv:.2,o:'#ecc036',ot:'#eaa030',g:.45,gz:.35,gc:'#6a8a30',sh:'#8a5a06',li:'#fff0a0',bl:['#e8b830','#f0c840',.2,.5,.7],
    band:['#e0502a',.035,.45,.8],fl:{c:'#6a8a30',n:[1,2],from:.05,to:.4,w:.035,op:.55,side:-1},vn:'#d89020',an:'#2a2018'},
  'violet-sombre':{i:'#b04a78',t:'#c05a98',o:'#a8487a',ot:'#b65a92',g:.3,gz:.3,gc:'#6a7a58',sh:'#401034',li:'#e890c4',bl:['#2a2040','#4a3060',.18,.4,.9],
    fl:{c:'#6a7a58',n:[1,2],from:.05,to:.4,w:.04,op:.5,side:-1},vn:'#7a1a50',an:'#2a2030'},
  fuchsia:{i:'#ee3890',t:'#e8509c',ba:'#e8d090',bv:.14,o:'#d43c70',ot:'#d45a80',g:.35,gz:.3,gc:'#6a8a48',sh:'#6a0a30',li:'#ff80b0',bl:['#e0c070','#d8b060',.2,.5,.9],
    fl:{c:'#6a8a48',n:[1,2],from:.05,to:.4,w:.04,op:.5,side:-1},vn:'#b01a50',an:'#2a2020'},
  multicolore:{flLo:1,i:'#ec9c26',t:'#e48a22',ba:'#f4d040',bv:.2,o:'#e8a428',ot:'#e49022',g:.3,gz:.25,gc:'#6a8a30',sh:'#7a3006',li:'#ffe080',bl:['#f2d040','#f0c040',.2,.5,.7],
    band:['#c83020',.02,.5,.5],fl:{c:'#c42818',n:[4,6],from:.05,to:.98,w:.11,op:.92},vn:'#c84a18',an:'#2a1a14'},
  'rouge-sombre':{bandLo:1,i:'#bc2e44',t:'#c03a48',o:'#b02a40',ot:'#bc4050',g:.3,gz:.3,gc:'#5a7a48',sh:'#4a0614',li:'#f06070',bl:['#3a1018','#6a1a28',.18,.42,.9],
    band:['#e8c8b8',.02,.55,.55],fl:{c:'#5a7a48',n:[1,2],from:.05,to:.4,w:.04,op:.5,side:-1},vn:'#801424',an:'#2a1a1a'}};
for(const k in TPARS)TULS['par-'+k]=TPARS[k];
/* the colourways added (late:3: the third wave, after the anemones' (1) and the rosettes' (2); at the end, no SKU number moves) */
if(typeof CW_TPAR!=='undefined'&&!CW_TPAR.some(x=>x.id==='citron-vert'))CW_TPAR.push(
 {id:'citron-vert',n:'Citron vert strié (Yellow Madonna)',c:'#e2d058',flame:'#769627',bl:'#c8c458',late:3},{id:'creme-framboise',n:'Crème et framboise (Cabanna)',c:'#e8a0bc',flame:'#507809',bl:'#f0e2b8',late:3},
 {id:'blanc-vert',n:'Blanc flammé de vert (Super Parrot)',c:'#ecebd6',flame:'#778b44',bl:'#e6e4c0',late:3},{id:'blanc-rose',n:'Blanc rosé (Silver Parrot)',c:'#efcdd2',bl:'#f0e6c8',late:3},
 {id:'jaune-bord-orange',n:'Jaune bordé d’orange (Caribbean Parrot)',c:'#f0c038',edge:'#e0502a',bl:'#e8b830',late:3},{id:'violet-sombre',n:'Prune magenta (Parrot Negrita)',c:'#b45785',bl:'#2a2040',late:3},
 {id:'fuchsia',n:'Fuchsia (Power Parrot)',c:'#db3a6c',bl:'#e0c070',late:3},{id:'multicolore',n:'Jaune et rouge flammés (Rasta Parrot)',c:'#e8a428',flame:'#c42818',bl:'#f2d040',late:3},
 {id:'rouge-sombre',n:'Rouge sombre bordé crème (Seadov Parrot)',c:'#b2384d',edge:'#e8c8b8',bl:'#3a1018',late:3});
/* the material: the genus' (tulMat, on the prefixed key), then the parrot's own: the feathering in the veins, the green flame up the outside, the age */
const TPAR_M={};
function tulParMat(cwx){const wl=cwx.wl||0,op=cwx.op??1,key=cwx.id+'|'+Math.round(wl*20)+'|'+Math.round(op*20)+(DET<1.5?'l':'h');if(TPAR_M[key])return TPAR_M[key];
  const S=TPARS[cwx.id]||{i:cwx.c},id='par-'+cwx.id;if(!TULS[id])TULS[id]=S;const m=Object.assign({},tulMat({id,c:cwx.c})),lo=DET<1.5,a=S.age?S.age[1]*svSm((wl-.02)/.3):0,ag=(c,k=1)=>a>0?mix(c,S.age[0],a*k):c;
  /* the bouquet's level of detail: fewer flames (the zoom keeps them all) */
  /* the margin's flush, at the bouquet's level of detail, goes into the tips' colour (a stop, not a stroke) unless it is the colourway's mark */
  if(lo&&m.band&&(!S.bandLo||wl>=.6)){const b=m.band,k=b.op*.5;m.st=m.st.map(([v,c],i)=>[v,i===m.st.length-1?mix(c,b.c,k):c]);m.bst=m.bst.map(([v,c],i)=>[v,i===m.bst.length-1?mix(c,b.c,k):c]);m.band=null}
  if(lo&&m.flames)m.flames=Object.assign({},m.flames,{n:[1,S.flLo?2:1],w:m.flames.w*1.4});
  /* the faded head (its tepals hang, showing their outside): the flames on that face only; a light body just under the engine's blotching threshold */
  if(wl>=.6&&m.flames)m.flames=Object.assign({},m.flames,{side:-1});
  if(wl>=.3){const[h3,s3,l3]=h2l(m.st[3][1]);if(l3>.78){m.st=m.st.map(([v,c],i)=>i===3?[v,l2h(h3,s3,.77)]:[v,c]);m.fanL=1}}
  if(S.vn){m.vein=ag(S.vn);m.bvein=ag(S.bvn||S.vn,.8)}
  if(S.gz){const o=S.o||S.i,ot=S.ot||o,gc=S.gc||'#7f9a5a',g=Math.max(.35,S.g||.4);m.bst=[[0,mix(o,gc,g)],[S.gz*.5,mix(o,gc,g*.75)],[S.gz,mix(o,gc,g*.25)],[Math.min(.85,S.gz+.22),o],[1,ag(ot)]]}
  else m.bst=m.bst.map(([v,c])=>[v,v>.5?ag(c,(v-.5)*2):c]);
  /* a bud greener than its flower (budG: Rococo, grey-green with red crests), the colour only at its tips */
  /* (the engine then greens every colour of a young bud by gt, less toward the tip (greenTip): the tips' colour is pushed back beforehand by what the green will
     take off it, so the crests stay red on the grey-green bud, as on photographs 148 to 151) */
  if(S.budG){const b=S.budG*(1-svSm((op-.15)/.3)),gc=S.gc||'#7c9478',G0=SVT_PARROT.green,gt=G0[0]*(1-svSm((op-G0[1])/G0[2]));
    if(b>0)m.bst=m.bst.map(([v,c])=>{let x=mix(c,gc,b*(1-svSm((v-.7)/.3)));const k=gt*(1-SVT_PARROT.greenTip*v);if(v>.55&&k>0)x=mix(x,SVT_PARROT.greenC,-k/(1-k));return[v,x]})}
  if(a>0){m.st=m.st.map(([v,c])=>[v,v>.35?ag(c,(v-.35)/.65):c]);if(m.band)m.band=Object.assign({},m.band,{c:ag(m.band.c)});m.rim=ag(m.rim,.6)}
  return TPAR_M[key]=m}
/* the parrot's genes: each tepal its own (wider ranges than the single tulip's: length, width, angle, twist, waves, curl) */
const TPAR_GENES={n:[[6,1]],tep:{dL:[.92,1.07],dW:[.88,1.1],dph:[-.07,.07],da0:[-.06,.06],da1:[-.2,.2],tw:[-.25,.25],wav:[.13,.26],wk:[4,6],wph:[0,6.28],
    notch:[0,.02,.2],tip:[1.8,2.6],asym:[-.1,.1],curl:[0,.2,.5],cup:[.85,1.15],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.92,1.08],op:[-.05,.05],ring:[.9,1.12],dh:[-3,3],ds:[-.05,.05],dl:[-.025,.02],stL:[.92,1.08],sd:'sd'}};
const SVT_PARROT=Object.assign({},SVT_SIMPLE,{genes:s=>svGenes(s,TPAR_GENES),mat:tulParMat,
  /* the tepals: shorter for a bigger head (D is the open flower), cut on their upper third */
  L:[1.4,1.3],Wd:[.74,.62],vb:.56,marg:svMarge({nu:12,n:[4,7],dp:[.1,.26],hw:[.55,1.05],p:1.8,ta:.03,wk:.6,span:.95}),nu:[12,12],
  /* the heart; the floor of the cup only in close-up (at the bouquet's size the stamens hide it) */
  heart:(()=>{const h6=svHeart6(Object.assign({hide:.3,lo:1},TUL_HEART,{filL:.2,anL:.24,sgR:.08})),fl=tulFloor(h6);return ctx=>DET>=1.5?fl(ctx):h6(ctx)})(),
  /* the opening: a goblet, a wide cup (op .6 to .85), an irregular star at full bloom; the heavy tips sag */
  a0:[[.72,.2],[.56,.2]],a1:[[-.1,1.3],[-.34,1.2]],aPow:.75,open:[.6,.5],sag:[0,.12,.25],cupW:[1,1.3],cup:.4,lap:.08,z0:[-.012,.016],
  /* the bud: an ovoid egg, green, coloured from its crests */
  bud:[.2,.35],budH:[1.15,.2],budR:.3,budK:1.3,budP:.85,budE:[.13,.85],green:[.95,.15,.3],greenTip:.75,greenC:'#7c9478',nv:10,pmin:15,
  /* the bouquet's level of detail: one shade wash (the zoom keeps the simple's) */
  light:Object.assign({},SVT_SIMPLE.light,{darkLo:[.8],litLo:[]}),
  /* the feathering: veins at every level of detail */
  veinLo:false,veinN:[22,10],
  /* the rim (a thin outline round each face, 12 elements a head) only once the margin browns: none on a fresh flower at the bouquet's size */
  rim:[0,.012,0,.25],
  /* the decline: the star twists and waves, the head nods, the tepals hang and fall */
  dec:[.22,.33],wA0:[.3,.3],wA1:[.45,.45],tw:[.5,.8],curl:[.25,.35],wav:[.5,1,2],tip:[[.12,.15,.4],[.45,.5,.3]]});
/* the faded head (wilt .3 and more): the same tepals and genes, but lighter to draw (budget, DET 1 and the zoom alike): no shade wash, a coarser mesh (the cut
   margin on its nodes), calmer ruffles and twists (a hanging tepal's outline was the heaviest of the plant), rarer patches */
const SVT_PARROT_FAN=Object.assign({},SVT_PARROT,{light:Object.assign({},SVT_PARROT.light,{darkLo:[]}),nu:[10,10],nv:8,pmin:40,
  marg:svMarge({nu:10,n:[3,5],dp:[.08,.2],hw:[.55,1.05],p:1.8,ta:.03,wk:.6,span:.95}),wav:[.5,.3,.3],crk:[.05,0],tw:[.5,.15],curl:[.25,0]});
delete SVT_PARROT_FAN._m;
/* a light colourway (white, cream, pale pink: the engine browns them in blotches, 2 to 7 a face) fades to the same beige on the edge, without the blotches
   (the blotches were 55 paths and 10 Ko a head): tulParMat keeps its body just under the engine's threshold (lightness .78) once it is fading */
const SVT_PARROT_FANL=Object.assign({},SVT_PARROT_FAN,{edge:Object.assign({},SVT_PARROT.edge,{other:SVT_PARROT.edge.light})});
delete SVT_PARROT_FANL._m;
/* how far the parrot has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function tulParLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'tulipe-perroquet',rec:{}})):0}
/* the head: tepals and heart (colourways of CW_TPAR, s9a.js) */
function tulParSvg(par,B,O,D,cwId,op,seed,wl){const w=wl==null?tulParLife():wl,cw=(typeof CW_TPAR!=='undefined'&&CW_TPAR.find(x=>x.id===cwId))||{id:cwId,c:'#e8a080'};
  const cwx=Object.assign({},cw,{wl:w,op});
  return svBloom(par,B,O,D,w<.3?SVT_PARROT:tulParMat(cwx).fanL?SVT_PARROT_FANL:SVT_PARROT_FAN,cwx,op,seed,w)}
SV_HEAD['tulipe-perroquet']=tulParSvg;
/* the parrot of the bouquet: the old drawing's share of the bouquet's chance is consumed (six tepals, 15 draws each: 90), the first name the individual */
function tulParPut(par,B,O,D,cw,op,o){let s=0;for(let i=0;i<90;i++){const x=rnd();if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return tulParSvg(par,B,O,D,cw.id,op,svSeed('tulipe-perroquet',cw.id,s),tulParLife(o))}
/* the head on its stem (tulipHead's parrot line, s9a.js): the thick stem bends under the heavy head, which looks out more than the single's; the
   neck lengthens and bends as it fades */
/* (w: the turtle starts at the neck's width, so the bouquet's stem, drawn at the width the neck hands back, is as thick as the neck) */
/* plante v2: the neck drawn in one piece (piece 12: one cylinder, not two: 10 elements less a stem); in close-up (DET 1.5) the receptacle swells
   under the cup (photograph 152: 1.4 times the stem's width, over about .07 of the flower), a trumpet, not a cone */
function tulParHead(g,t,o,cw,op,Dm,k,B,up,ax,U0,Lq){const gh=GHI['tulipe-perroquet']||{},sw=gh.sw||Dm*.1,aim=V3.nz(V3.add(V3.sc(ax,.75),V3.sc(up,.6))),sc=gh.sc||TUL_SC;
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.06,c:sc}],['F',{l:Lq*.55,w1:sw,aim,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,wig:.035,seg:Dm*.22,w:sw*1.12}),og=res.organs[0];
  /* the fading neck bends on a stem drawn alone (sheets); in a bouquet the bouquet nods the head itself, and a bent neck would move its stem (rtest) */
  if(!(typeof NECK_X!=='undefined'&&NECK_X))tulNeckBend(res,og,tulParLife(o));const apex=og.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:12,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>{if(DET>=1.5)tulParCollar(par,og,pos,sw,Dm,sc);
    return tulParPut(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,o)}}]})});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}
/* the receptacle under the cup: the stem's width up to its last .075 of the flower, then swelling (t squared) to 1.42 times; no chance drawn */
function tulParCollar(par,og,pos,sw,Dm,c){const h=[og.H[0],-og.H[1]];if(Math.hypot(h[0],h[1])<.2)return;const L=Dm*.075,e=[pos[0],-pos[1]],C=[],W=[];
  for(let i=0;i<=8;i++){const t=i/8;C.push([e[0]-h[0]*L*(1-t),e[1]-h[1]*L*(1-t)]);W.push(sw*(1+.42*t*t))}svStemLine(par,C,W,c)}
/* the stem (plante v2, measured by script on photographs 90, 154, 152, 136): .066 of the open flower (Estella Rijnveld 90: 27 px under a flower of
   410), .05 (Rococo 154), .10 of the cup (152): 5 units (7.7 mm) under a head of 12 cm (the v1's 4 was thin). Thicker at the foot (x 1.25 on 152:
   the taper of the neck and of the bouquet's stem, 1.23 to 1.0, gives it), narrowest under the receptacle. Smooth, round and glaucous: a grey-green
   body (#7e9179, #80936b), a grey shade (#5f6966), the wax's pale sheen broad and matte (#93a57f to #abc39f); no striation shows on the photographs
   (152, 127: the ribs of svStemLine, tried, read as a drinking straw). */
const TPAR_SC=Object.assign(['#4a5a40','#768c68','#a6bc94','#d2dec8'],{sv:{swell:.03,gloss:.32}});
if(typeof GHI!=='undefined'&&GHI['tulipe-perroquet'])Object.assign(GHI['tulipe-perroquet'],{sc:TPAR_SC,sw:5,wilt:tulWiltCol,cut:1});
/* the leaves (plante v2; photographs 136, 154, 14, 35 and 56): one or two on a cut stem (the bouquet's chance), alternate, clasping the stem low
   down: the lowest at the foot of the visible stem, the upper one about a third of the way up, the flower stalk bare above it (STEML.place, y3-plante.js);
   the lowest broad, ovate-lanceolate (2.8 times as long as wide, widest at .28), cupped, its tip hooded; the upper narrower (4.2), folded in a
   deeper gutter, more upright; both with waved margins (3 to 5 waves), more than the single's; glaucous grey-green, hue 95 to 115 (#6f926b, #96b492;
   the v1's #628a72 was too teal), the wax silvering the lit side (#b4d2c0), the underside paler and bluer; the sheath round the stem at the stem's
   own width; limp, then yellow from the tip, at the fade. TPAR_LEAF: the numbers in one place (the finisher's test page overrides them) */
const TPAR_LEAF={zk:[.9,.5],sr:.68,sheath:.07,nu:6,nv:13,bloom:1,up:'#86a882',low:'#9cb6a0',base:'#b4c4a0',yel:'#a89a52',
  form:[{w:.36,lk:1.2,wp:[[0,.5],[.06,.72],[.26,1],[.52,.92],[.75,.6],[.9,.25],[1,0]],lean:.4,droop:.3,tw:.12,gut:.5,wav:.055,wavN:[6,1.5],hood:.34},
        {w:.24,lk:1.1,wp:[[0,.55],[.07,.75],[.3,1],[.6,.84],[.8,.52],[.93,.2],[1,0]],lean:.18,droop:.26,tw:.3,gut:.55,wav:.06,wavN:[5,1.2],hood:.3}]};
function tulParLeafSv(par,x,y,ang,len,o){const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,L=TPAR_LEAF,zk=L.zk[0]+L.zk[1]*pxHashS(k,3,Math.round(x*7+y*13)),Out=V3.nz(V3.add(side,[0,0,zk])),wl=tulParLife(),
    fa=svSm((wl-.3)/.5),yl=.55*fa,cm=c=>yl>0?mix(c,L.yel,yl):c,gh=GHI['tulipe-perroquet']||{},sw=gh.sw||5,
    /* the leaf's form: the lowest of two (or three) the broad one, the upper ones narrower; a single leaf between the two */
    n=o.n||1,fi=n<2?.5:k/(n-1),F0=L.form[0],F1=L.form[1],mx=(a,b)=>a+(b-a)*fi,F=Object.assign({},fi<.5?F0:F1,{w:mx(F0.w,F1.w),lk:mx(F0.lk,F1.lk),lean:mx(F0.lean,F1.lean),
      droop:mx(F0.droop,F1.droop),tw:mx(F0.tw,F1.tw),gut:mx(F0.gut,F1.gut),wav:mx(F0.wav,F1.wav),hood:mx(F0.hood,F1.hood)});
  return svStrapLeaf(par,[x,-y,0],H,Out,{len:len*1.2*F.lk,w:F.w,wp:F.wp,sr:sw*L.sr,lean:F.lean+Math.acos(Math.max(-1,Math.min(1,V3.dot(Lv,H))))*.55,droop:F.droop,tw:F.tw*(1-.5*fa),
    gut:F.gut,wav:F.wav*(1-.5*fa),wavN:F.wavN[0]+F.wavN[1]*pxHashS(k,5,7),hood:F.hood,sheath:L.sheath,nu:L.nu,nv:L.nv,bloom:L.bloom,up:cm(L.up),low:cm(L.low),base:cm(L.base),
    sd:svSeed('tulipe-perroquet-feuille',Math.round(x*8),Math.round(y*8),k),wl})}
if(typeof STEML!=='undefined'&&STEML['tulipe-perroquet'])Object.assign(STEML['tulipe-perroquet'],{sv:tulParLeafSv,place:[[.2],[.04,.42],[.02,.26,.5]],low:.3});
