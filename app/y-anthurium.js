/* ================= y-anthurium.js — Anthurium andraeanum (cut flower) on the spathe kit (y3-spathe.js) =================
   Heart-shaped waxy spathe, quilted between arching veins, short tip, rounded basal lobes; spadix straight or curved, often of another colour, its
   tip lighter; long bare round stem (the leaf is sold apart: anthurium-feuilles). The old drawing (x3Anth2, s1a.js) stays as the fallback. */
const ANTH_SID='anthurium-andraeanum';
/* The colourways' materials, one row each, ids of CW_ANTH (s1a.js, SKU 1652..1666), to be measured (fleur-coloris) and transcribed (fleur-finition):
   base = spathe at the sinus, body = the blade, tip = toward the tip, back = the underside, vein = veins of the upper face,
   spd = spadix [foot, middle, tip (lighter)], stem = tint of the stem under the head (optional), src = where the value comes from.
   All values here are first guesses from kept.jpg and the brief's "auto" colours (src 'auto'): replace them with measured ones. */
const ANTH_MAT={
  'rouge':     {base:'#ca2727',body:'#c62c2a',tip:'#c62f2f',back:'#b8282c',vein:'#8f060b',spd:['#f1ead0','#efe08e','#f7f3df'],src:'mesure niveau B (SKU 1652 ; cultivars calisto B, rambla C ; photo studio obtenteur N2, appoint hors mediane) ; spadice du brief (ivoire), la mesure du spadice est contaminee par la spathe'},
  'rouge-sang':{base:'#800013',body:'#981c23',tip:'#890619',back:'#8c2432',vein:'#650612',spd:['#efe2b0','#e6cd5c','#f3e9c0'],src:'catalogue (niveau B ecarte) : la mesure (cantello, eterno) est un rouge vif quasi identique au 1652, L45 contre L29 du nom'},
  'noir':      {base:'#260004',body:'#35131a',tip:'#2a070e',back:'#4a1a20',vein:'#240307',spd:['#e9dcae','#d6c066','#efe6c4'],src:'catalogue (niveau C) : mesure brun-bordeaux, teinte a 15 deg LCh du nom'},
  'chocolat':  {base:'#43140e',body:'#57261f',tip:'#4a1b15',back:'#5a3224',vein:'#3a160c',spd:['#9a8a5c','#6a5a3a','#c0b48a'],src:'catalogue (niveau C) : mesure orange-brun (terrasol), teinte a 12 deg LCh du nom'},
  'terracotta':{base:'#b65438',body:'#b65036',tip:'#af5236',back:'#a85842',vein:'#84301c',spd:['#e6d7a0','#c9b45a','#ece2bc'],src:'mesure niveau B (SKU 1656 ; cultivars terrasol C, cantello B ; teinte a 4 deg LCh du nom, une seule photo studio) ; spadice du brief (creme), ecart entre cultivars'},
  'orange':    {base:'#d95b21',body:'#f37135',tip:'#e36328',back:'#d86c3a',vein:'#b23c0c',spd:['#f6e8a8','#ecc848','#f8f0c8'],src:'catalogue (niveau C) : mesure rouge (naranja, nitta), teinte a 17 deg LCh du nom'},
  'corail':    {base:'#f07f75',body:'#f0807a',tip:'#f18b88',back:'#e07668',vein:'#c24242',spd:['#efd6cc','#ecceb8','#e9c5a3'],src:'mesure niveau B (SKU 1658 ; cultivars farao B, caribo B, kuduro C ; corps concordants dE 0,9-6,8 ; teinte a 8 deg LCh) ; spadice mesure (dE 13)'},
  'saumon':    {base:'#e78f76',body:'#ffa58a',tip:'#f0977d',back:'#eba292',vein:'#d87060',spd:['#fbf0d8','#f0d8a0','#fdf6e6'],src:'catalogue (niveau B ecarte) : mesure rose-rouge, teinte a 18 deg LCh du nom'},
  'rose-vif':  {base:'#d44480',body:'#ec5b94',tip:'#dd4d87',back:'#d85c82',vein:'#b02852',spd:['#f6eed8','#efe0a0','#faf6e8'],src:'catalogue (niveau B ecarte) : mesure rose saumon pale (candy), teinte a 15 deg LCh du nom'},
  'rose':      {base:'#e79cb6',body:'#ffb2cc',tip:'#f0a4be',back:'#eab2c4',vein:'#c86888',spd:['#4a2236','#2e1424','#5e3648'],stem:'#6a3a4a',src:'catalogue (niveau B ecarte) : copie de 1660 (candy), teinte a 16 deg LCh du nom ; spadice sombre des photos 36, 44'},
  'violet':    {base:'#82317d',body:'#984591',tip:'#8a3884',back:'#a2528e',vein:'#7a1e6a',spd:['#3e1c38','#2a1028','#5a3050'],stem:'#5a3a4a',src:'catalogue (niveau C) : mesure rose-mauve, teinte a 24 deg LCh du nom (bicolore, bords violets)'},
  'blanc':     {base:'#eeede6',body:'#fefcf5',tip:'#f7f5ee',back:'#eceae0',vein:'#d8d8c6',spd:['#f6e2a0','#eec050','#f8eecc'],src:'catalogue (niveau C) : mesure blanc ombre et grise (une seule photo)'},
  'creme':     {base:'#e7dabe',body:'#fef0d4',tip:'#efe2c6',back:'#e6dabe',vein:'#d6c69e',spd:['#f2e0c0','#e8c8a0','#f8eedc'],src:'catalogue (niveau C) : mesure jaune vif, hors du nom (une seule photo)'},
  'blanc-vert':{base:'#ebeae0',body:'#fefdf3',tip:'#b4cc84',back:'#eceee0',vein:'#8db458',spd:['#e8eecc','#c8d888','#eef2d8'],src:'catalogue (niveau C) : mesure vert-olive grisee, photo ombree'},
  'vert':      {base:'#82ac41',body:'#98c255',tip:'#8ab448',back:'#9cc068',vein:'#6a9638',spd:['#f0ead0','#e2d6a8','#f6f0e0'],src:'catalogue (niveau C) : mesure olive brunatre, 19 deg LCh du nom'}};
/* the sort: only what differs from SVSPD_DEF */
/* profile (2026-10-17, photos 35, 36, 54): the blade leaves the stem at 40-50 deg (tilt .78), a light back arch turning up again at the tip (S),
   the basal lobes lifted, the margin rolled a little under, domed across but hollow at the sinus: it keeps a readable thickness edge-on */
const ANTH_SPEC={sid:ANTH_SID,stemW:.088,tilt:[1.5,.78],lean:.42,openT:[.08,.42],camb:.2,tipUp:.05,lobUp:.1,hem:.06,bow:.7,cup:[[0,.3],[.25,.16],[.5,.08],[.8,.02],[1,0]],
  /* fané (photos 29, 42): the blade dulls, its margins curl up and in from the sinus, the midrib arches, the edge ripples */
  fanCamb:.34,fanCup:.25,fanHem:.08,wav:.05};
/* the stem's colours, styled for the SVG stem: smooth, round, glossy, a tint under the head for the colourways that have one (35, 36) */
function anthStemCols(cw){const c=['#2c4622','#476b32','#739a55','#b0c994'],r=(ANTH_MAT[cw&&cw.id]||{}).stem;c.sv={gloss:.55,swell:.02,ribs:[]};if(r)Object.assign(c.sv,{red:r,redF:.55,redA:.55});return c}
function anthLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:ANTH_SID,rec:{}})):0}
/* the head for the sheets: centred on its spathe (o.center), the stub of stem below */
function anthSvg(par,B,O,D,cwId,op,seed,wl,S,o){const cm=ANTH_MAT[cwId]||ANTH_MAT.rouge,oo=Object.assign({center:true,kv:0,face:0,stubM:1.5},o||{});
  return svSpdHead(par,B,O,D,S||ANTH_SPEC,cm,op,seed,wl==null?anthLife():wl,oo)}
/* the head on the plant (anthPlant, r4a.js): the bouquet's chance consumed exactly as x3Anth2 did (its side draw unless o.side, 23 R(), and the two
   R() of open()), then the SVG head from its own seed */
/* the composer's box: c5.js measures the head's drawing fully grown (getBBox, l.205, 243, 272) to lengthen a stem past the rim and to set the
   margins, so a head whose box differs from the old drawing's moves the bouquet's chance (rtest). The old head (x3Anth2) is drawn again with
   the very draws the SVG head consumed (rec), measured fully grown, then removed (its tweens too); its box stays as one rect with no paint
   (fill-opacity 0, no stroke: getBBox still counts it; ?anthbox=0 leaves it out, to test). The SVG head is drawn inside that box or close to it */
/* ANTH_BOX (off, 2026-10-17): the rect alone does not keep rtest (rc ~0:4,~3:3,~6:2 : 1/10 IDENTIQUE with it, 0/10 without), see etat.md */
const ANTH_BOX=false;
function anthBoxRect(par,B,O,D2,op2,o,cw,rec){if(typeof x3Anth2!=='function'||!par||!par.isConnected||typeof location!=='undefined'&&/[?&]anthbox=0/.test(location.search))return;
  const r0=rnd,t0=tw.length,g=G(par);let i=0;rnd=()=>i<rec.length?rec[i++]:.5;
  try{lsAsFlower(x3Anth2,Object.assign({},o,{cw}))(g,B,O,D2,op2);for(let k=t0;k<tw.length;k++)tw[k].fn(1,1);const b=g.getBBox();
    if(b.width||b.height)E('rect',{x:f(b.x),y:f(b.y),width:f(b.width),height:f(b.height),fill:'#000','fill-opacity':0,stroke:'none'},par)}
  catch(_){}finally{rnd=r0;tw.length=t0;g.remove()}}
function anthSvFlower(o,cw,w){return(par,B,O,D2,op2)=>{const r0=rnd,rec=[];rnd=()=>{const x=r0();rec.push(x);return x};
  try{if(o.side==null)rnd();for(let i=0;i<25;i++)R(0,1)}finally{rnd=r0}
  if(ANTH_BOX)anthBoxRect(par,B,O,D2,op2,o,cw,rec);
  const seed=svSeed('anthurium',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D2*8));
  /* in a bouquet the head keeps inside the old drawing's box (svSpdKeepBox, y3-spathe.js: rtest) */
  svSpdKeepBox(par,q=>svSpdHead(q,B,O,D2,ANTH_SPEC,ANTH_MAT[cw.id]||ANTH_MAT.rouge,op2,seed,anthLife(),{neckW:w,neckL:0,pose:{yc:.12,ycO:1,k:.07,h:.04},sc:anthStemCols(cw)}),
    q=>lsAsFlower(x3Anth2,Object.assign({},o,{cw}))(q,B,O,D2,op2),rec,O)}}
/* fading colours (photos 42, 29, 38 and the brief): reds and oranges dull to brown-red then brown, violets blue, pinks go dusty, whites and creams to
   ivory then parchment with the veins greening, greens yellow-brown; near-blacks stay */
function anthWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);if(l<.12)return c;
  if(s<.18){if(l>.72){let o=mix(c,'#ebe0bf',.7*w);if(w>.5)o=mix(o,'#bfa274',(w-.5)*.8);return o}return mix(c,'#6a5a40',.4*w)}
  if(h>=55&&h<175)return typeof lifeCol==='function'?lifeCol(c,w):mix(c,'#a08a48',.6*w);
  if(h>=265&&h<345)return l2h(h-38*w,s*(1-.35*w),l*(1-.18*w));
  if(l>.62)return mix(c,'#b8907c',.55*w);
  let o=l2h(h<40?h-6*w:h+8*w,s*(1-.3*w),l*(1-.2*w));if(w>.45)o=mix(o,'#5a3020',(w-.45)*.9);return o}
SV_HEAD[ANTH_SID]=anthSvg;
if(typeof GHI!=='undefined'&&GHI[ANTH_SID])GHI[ANTH_SID].wilt=anthWiltCol;
