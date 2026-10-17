/* ================= Pilote : le chrysanthème disbud (Chrysanthemum × morifolium, grosse fleur coupée, une tête par tige) en SVG natif, sur la pièce capitule (y-chrysanthemum.js) =================
   One module for the genus, one sheet per form, all on svcapDraw (y3-capitule.js). From the photographs of refcache/chrysantheme-disbud (brief.md,
   kept.jpg, ph/ the named cut varieties of the colourways, refcache/chrysantheme-disbud-coloris-a and -b):
   - the head is fully double, no disc showing: many rows of narrow rays (ligules) packed close, the tip rounded; the innermost short, cupped and
     bent in over the heart, which shows only as a small greener (or deeper) eye among them (Salma, Leonov, Rossano, Desna Dark, Couture Dark);
   - REFLEXE (the cut disbud's main form: Salma, Whooper, Stravina, Leonov, Fiebre, Pibe, Boda, Annie Girl, Honeymoon, Desna Dark, Campari,
     Balance, Bellavista, Gaviria...): a dome, the inner rows incurved, the middle ones spread, the outer ones longer, reflexed past flat into a
     skirt round the stem (Boda in profile; 60, 482); seen from the side about 0.8 as high as wide skirt included;
   - INCURVE (Fuzzball, Greenbelt, Skater; 59, 271, 476, Gillette): a ball, every row curving up and in, the rays shorter and broader (about
     2:1), only the lowest row a little spread; about 0.9 as high as wide;
   - the back (267, 160, 491): a shallow cup of small imbricate grey-green bracts in three rows, rounded, a little felted;
   - the bud (160, 267, 65, 185): a ball of those bracts about as high as wide, the colour showing at the top as a tuft of ray tips, then the
     outer rays spreading from the bracts;
   - fading (502, 423, 424, 455; 370 is a wild C. indicum, left out): the rays go limp and hang, brown from their tips and margins keeping their
     hue, the outer ones first; the head nods and hangs from the top of the stem (423); the bracts stay green (491); little shedding;
   - the plant (96, 334, 420, 257, 138, 59): a woody striate stem of a mid green, finely downy, about 1/13 of the head; leaves alternate,
     petioled, ovate, deeply cut into 5 rounded toothed lobes, dark matt green above, paler grey-green and felted below; never a root.
   Colours: CHRY_MAT[id], the medians of the colourways' photographs (catalogue/serre/sources/chrysantheme-disbud.json, coloris-a.md, coloris-b.md),
   their lightness lifted where the photographs are in shadow (the rule: hue and saturation of the median, the lightness free); the radial
   measures (inner ring, body, tip ring) go to inner (the inner rows), body, tip. The form of a colourway: CHRY_FORM_OF[id]. */
var CHRY_MAT=typeof CHRY_MAT!=='undefined'?CHRY_MAT:{};
Object.assign(CHRY_MAT,{
  /* dark colourways: the back of the rays (the incurved dome seen from outside) in the body's own dark, not paled toward beige, so the dome
     never reads lighter than the skirt (v2 defect); their light (litL) kept low, a velvet, not a sheen */
  /* white and cream: a true white (the medians are cast by the background), the heart's eye pale green (Salma, Leonov) */
  blanc:{wTone:{lMax:.62,lK:.75,sMin:.32,sK:1,tip:.45,body:.12},base:'#f2f1e4',body:'#f9f8f2',tip:'#fbfaf6',inner:'#eaeec8',innerB:'#d8e09e',shade:'#e2d5ba',shadow:'#cdb48a',lite:'#fffefa',ink:'#d4c6a6',vein:'#ece4d0',shMin:.3},
  creme:{base:'#e8d396',body:'#f2e2b0',tip:'#f5e9c6',inner:'#e6d184',innerB:'#d6c66e',shade:'#d2b07a',shadow:'#c6a06a',lite:'#fff8e4',ink:'#d8c08c',shMin:.2},
  jaune:{base:'#e6bc12',body:'#efc81c',tip:'#f0cd2c',inner:'#e2cc3a',innerB:'#c8bc34',shade:'#c08a10'},
  vert:{base:'#a2b434',body:'#96aa2e',tip:'#a6b63c',inner:'#b2c44e',lite:'#d4e07a'},
  rose:{base:'#c77089',body:'#cf8aa3',tip:'#dcb0c5',inner:'#d692ac',innerB:'#c8869e'},
  'rose-poudre':{base:'#e0b8bc',body:'#e7c2d1',tip:'#ead2dc',inner:'#ecccd2',shade:'#b4949e',ink:'#d0aab6',shMin:.1},
  lilas:{base:'#9a6a80',body:'#b583a2',tip:'#c09ab2',inner:'#c8a0b8'},
  violet:{base:'#6a1c58',body:'#8e2474',tip:'#a8448e',inner:'#9a3e82',back:'#8a2a72'},
  prune:{wTone:{lK:1.3,lMin:.24},base:'#4e1632',body:'#6a1444',tip:'#84205a',inner:'#72204c',back:'#661844',litL:.9},
  bordeaux:{wTone:{lK:1.3,lMin:.24},base:'#420a16',body:'#5c0a24',tip:'#6e102c',inner:'#62102a',lite:'#741a36',back:'#560c24',litL:.75},
  orange:{base:'#b4400e',body:'#d8661e',tip:'#eca040',inner:'#dc8a2c'},
  rouille:{base:'#843016',body:'#a64a20',tip:'#c87438',inner:'#b4642c'},
  bleu:{base:'#1e539e',body:'#2c6cbe',tip:'#3a7ccc',inner:'#a6b04a',innerB:'#8a9a3a'},
  noir:{wTone:{lK:1.3,lMin:.22},base:'#280a16',body:'#3c0a24',tip:'#521034',inner:'#40102a',shade:'#120108',lite:'#4e1634',back:'#3a0c22',litS:.6,litL:.9},
  /* late:9 */
  saumon:{base:'#e0a078',body:'#f0c8a0',tip:'#f4dcc0',inner:'#ecbc92'},
  'blanc-coeur-vert':{base:'#d6e0a0',body:'#e6ecc8',tip:'#f0f2e0',inner:'#86a02a',innerB:'#748e22',shade:'#c4c6a8',ink:'#cdd0ae',shMin:.1},
  'rose-blanc-strie':{base:'#a03a72',body:'#b8508a',tip:'#c06898',inner:'#c8609a',tips:'#f6ecf2',tipsV:.8,tipsM:.1,tipsB:.15,tipsBV:.1,fleck:{c:'#f6eaf2',n:3,v0:.12,v1:.6,l:.45,w:.1,op:.85}}});
/* the colourway's form, after its named cut varieties (the json) and the look of their photographs */
const CHRY_FORM_OF={vert:'incurve'};
/* the two forms (only what differs from SVCAP_DEF): ten rows; innerK how far a row takes the heart's colour */
const CHRY_FORMS={
  /* v2 (Salma, Whooper, Leonov, Boda): many tight rows of narrow spoon-like rays, a narrow channelled (tubular) foot widening to a rounded cupped
     tip; the dome made by the inner rows standing up and curving in (no raised cone: the receptacle stays low), the outer rows reflexed into a skirt */
  reflexe:{rows:14,n:[[0,30],[.5,28],[1,12]],nJ:.05,stag:.5,L:[[0,.95],[.3,.88],[.5,.82],[.56,.8],[.8,.64],[1,.5]],W:[[0,.22],[.5,.2],[1,.15]],
    r0:[[0,.22],[.4,.18],[.7,.1],[1,.03]],z0:[[0,0],[.4,.08],[.7,.14],[1,.18]],
    a0o:[[0,1.65],[.25,1.5],[.5,1.25],[.56,1.2],[.8,.85],[1,.6]],a1o:[[0,2.9],[.25,2.35],[.5,1.25],[.56,-.2],[.8,-1.1],[1,-1.7]],
    aPow:[[0,1.2],[.5,1],[.56,1.6],[1,1.4]],
    claw:.2,vb:.8,taper:.06,tipE:2,tipH:.9,teeth:[1,0],cup:.45,quill:0,tw:0,wav:0,curl:0,
    jL:.06,jW:.08,jA:.05,jPh:.1,jTw:.1,jCurl:.08,jBend:.06,jRip:.04,jLift:[.03,-.08],jDrop:[.08,.22],jFold:[.04,.3],jTip:.12,
    innerK:[[0,0],[.7,0],[.9,.35],[1,.7]],shade:[.1,1.1],shadeF:1,lnF:.5,rowSh:[.07,.5,.5],lag:.42},
  incurve:{rows:12,n:[[0,20],[.5,16],[1,9]],nJ:.05,stag:.5,L:[[0,.62],[.12,.78],[.32,.96],[.42,1],[.54,1],[.66,.94],[.8,.8],[.92,.62],[1,.46]],W:[[0,.34],[.5,.3],[1,.2]],
    r0:[[0,.2],[.3,.17],[.6,.12],[.9,.05],[1,.02]],z0:[[0,-.03],[.12,.02],[.22,.07],[.32,.13],[.42,.2],[.54,.3],[.66,.42],[.8,.57],[.92,.72],[1,.85]],
    a0o:[[0,2.2],[.12,1.9],[.22,1.65],[.32,1.35],[.42,1.05],[.54,.75],[.66,.5],[.8,.32],[.92,.2],[1,.1]],a1o:[[0,.5],[.12,.35],[.22,.2],[.32,0],[.42,-.25],[.54,-.5],[.66,-.7],[.8,-.9],[.92,-1],[1,-1.05]],
    aPow:[[0,.7],[.32,.85],[1,.9]],
    claw:.32,vb:.55,taper:.1,tipE:2.4,tipH:.85,teeth:[1,0],cup:.38,quill:0,tw:0,wav:0,curl:0,
    jL:.07,jW:.07,jA:.1,jPh:.1,jTw:.12,jCurl:.08,jBend:.1,jRip:.03,jLift:[.05,-.15],jDrop:[.05,.2],jFold:[.03,.3],jTip:.12,
    innerK:[[0,0],[.6,.05],[.85,.32],[1,.75]],shade:[.04,.6],shadeF:.62,lnF:.35,rowSh:[.08,.5,.8],lag:.42}};
/* the involucre (267, 160, 491): three rows of small rounded imbricate bracts, grey-green, closed round the bud, pressed under the rays once open */
const CHRY_INV={rows:3,n:[13,12,10],L:[.22,.19,.16],W:[.13,.12,.11],round:1,r0:.15,z0:-.04,rowA:[[1.1,-.6,1.55,2],[1,-.9,1.45,1.9],[.9,-1.1,1.35,1.8]],bud:4.2,budS:[0,.75],budR:[.7,1,1],budW:2.3,ob:[.18,.3],edge:.4,wA:[.3,.4],under:0,fanShow:1};
/* the life: the bud green, the rays coloured at the top before they part; opening from the outer rows in (lag); fading: the rays go limp and
   hang (wGrav), the inner ones close, brown from the tips and margins keeping their hue (wTone); the head nods then hangs (tip, 423); little shedding */
const CHRY_LIFE={z0g:.3,open:[.18,.7],grow:[.78,.75],budL:.16,budE:[.1,.35],col:[.12,.36],a0c:[[0,.12],[1,.04]],a1c:[[0,-.55],[1,-.9]],
  dec:[.12,.4],fan:[.45,.35],shed:[.85,.2],tip:[[.5,.45,.4]],wA0:[[[0,.15],[1,0]],[[0,.2],[.35,.05],[.6,-.2],[1,-.3]]],wA1:[[[0,.2],[1,0]],[[0,.3],[.35,.1],[.6,-.3],[1,-.5]]],
  wCurl:[.1,.35],wQuill:[.08,.3],wW:.18,wL:.15,wGrav:.4,wWav:.3,wBrown:[.55,.8],edge:.35,rows1:9,nK1:.42,wK1:1.28,shadeF1:.3,budHide:.09,wTone:{tip:.55,body:.1,wash:.8,v:.72,mg:.4},shLens:.62,shR:1,tipN1:1,
  heart:{off:1,wall:.25,wallI:-.12,wallNz:-.35,r:.06,disc:.04,h:.02},shade:[.12,1.3],ao:.3,light:{kD:.8,kL:.2},
  /* the light (svcapLitG): each spoon lit along its tube to the tip, shaded at its foot between the rows, the dome's feet deep (Salma, Whooper) */
  lit:{g:[[0,'s',.95],[.3,'s',.45],[.52,'s',0],[.66,'l',0],[1,'l',.6]],lv:[.75,.95],ls:[1,.85,.7],ll:[.4,.7,1],v0:0,hF:1,hF0:.1,hF1:.6,sK:1,lens1:0,br:.35,wzTop:1,rW:.7},
  /* fading (502, 423): the rays stay readable one by one, their light weakened not put out (lit.br), the browned tips over it (wzTop), the
     rows' shadows kept (rowShFan), each ray its own browning and dulling (wBrownJ, wJit) and a firmer edge (wEdge), the eye's green lost */
  rowShFan:.5,wInner:1,wJit:1.5,wEdge:.4,wBrownJ:1};
const CHRY_SPEC={};
/* the involucre's greens (267, 160): grey-green felted bracts, the receptacle a little paler */
const CHRY_GREENS={bract:'#5a7446',bract2:'#7d9064',bractTip:'#9aa680',recep:'#6f8a50',green:'#6f8a4c',dry:'#8a8456'};
function chrySpec(form){return CHRY_SPEC[form]||(CHRY_SPEC[form]=Object.assign({mat:cwx=>svcapMat(cwx,Object.assign({},CHRY_GREENS,CHRY_MAT[cwx.id])),inv:CHRY_INV},CHRY_LIFE,CHRY_FORMS[form]))}
function chryForm(cwx){return cwx.form||CHRY_FORM_OF[cwx.id]||'reflexe'}
/* the colour of fading (502, 423, 455): each hue dulls and darkens its own way (the mauves to a dull brownish mauve, the yellows browning from
   the margin), then all dry to a warm brown; greens (stem, leaves, bracts) go the bouquet's way (lifeCol) */
function chryWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c),k=svSm((w-.5)/.42),k2=svSm((w-.8)/.2);if(k<=0)return c;
  if(h>=65&&h<170&&s>.12&&l<.75)return typeof lifeCol==='function'?lifeCol(c,w):c;
  /* whites and creams to an ivory then a light tan, their light and shade kept (a mix toward one tan flattened the head to a grey mass) */
  if(s<.15||l>.84){const t=l2h(40,Math.min(.5,s+.3*k),l*(1-.1*k)-.04*k);return k2>0?mix(t,'#a07a4c',.2*k2):t}
  /* a hue far from the browns (a dyed blue) keeps its own, dulled: no drift through purple; the last drying a little darker, never a brown-black */
  const d=((28-h+540)%360)-180,fd=Math.max(0,Math.min(1,1-(Math.abs(d)-60)/50)),o=l2h(h+d*.3*fd*k,s*(1-.35*k),l*(1-.1*k));return k2>0?mix(o,l2h(h+d*.45*fd,s*.6,Math.min(.5,l*.88)),.35*k2):o}
if(typeof GHI!=='undefined'&&GHI['chrysantheme-disbud'])GHI['chrysantheme-disbud'].wilt=chryWiltCol;
function chryLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'chrysantheme-disbud',rec:{}})):0}
/* the head, any colourway of the list ('blanc~incurve': a colourway in the other form, test sheets only) */
function chrySvg(par,B,O,D,cwId,op,seed,wl,S){const[cid,fo]=String(cwId).split('~'),c0=(typeof CW_MUMD!=='undefined'&&CW_MUMD.find(x=>x.id===cid))||{id:cid,c:'#f6f5ee'},
    cwx=fo&&CHRY_FORMS[fo]?Object.assign({},c0,{form:fo}):c0,w=wl==null?chryLife():wl,W0=typeof WILT!=='undefined'?WILT:null;
  /* the head's colours under its own fading (as the dahlia: in a bouquet the head fades with its own w and colour rule) */
  if(w>0&&typeof lifeWilt==='function')WILT=lifeWilt(w,chryWiltCol,'chrysantheme-disbud');
  try{return svcapDraw(par,B,O,D,S||chrySpec(chryForm(cwx)),cwx,op,seed,w)}finally{WILT=W0}}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['chrysantheme-disbud']=chrySvg;
/* the old drawing run into a detached group and thrown away (its defs too): the bouquet's chance it draws is consumed exactly, whatever it is */
function chryOld(fn){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{fn(dm)}finally{GDEF=g0}}
/* the stem (96, 334, 482, 59): woody, striate, a mid green, finely downy (hairs short and sparse) */
const CHRY_SC=['#2c4422','#4c6a38','#6e8e52','#a8be8a'];CHRY_SC.sv={hair:'#dfe6d4',hairK:1.6,hairL:.35,hairA:.5,hairOp:.3,hairFOp:.1,ribs:[-.5,-.2,.12,.42],swell:.012,gloss:.15};
/* the leaf (420, 257, 138, 96): petioled, ovate, five rounded lobes cut about half way, blunt teeth; about 1.4 as long as wide, as long as
   half the head or more; a few leaves show their felted underside */
function chryLeaf(par,x,y,a,l,wl,sd){svcapLobed(par,x,y,a,l,{wl,sd,side:sd%5===0?-.6:.6})}
/* the plant of the bouquet: mumPlant (s13a.js) for the disbud only (the spider keeps it), its chance consumed as before: the same lsHeadS call
   (its draws in the same order), the old head, bud and leaf drawn into a thrown-away group before the SVG ones */
function chryPlant(g,t,o){if(typeof SV_ON==='undefined'||!SV_ON)return mumPlant(g,t,o,CW_MUMD,0);
  const list=CW_MUMD,cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||15)*UPC,k=G(g),wl=chryLife(o);
  const r=lsHeadS(k,o,{D,w:D*.065,cols:CHRY_SC,op,rr:.6,nodes:2,li:.4,lp:.65,opp:0,leafAng:52,side:null,wig:.025,
    flower:(par,B,O,D2,op2)=>{chryOld(dm=>{if(op2<.3){capBud(dm,B,O,D2*.22,cw.c,.5,'#4a6a34');return}mumFlower(dm,B,O,D2,cw,op2,0)});
      chrySvg(par,B,O,D2,cw.id,op2,svSeed('chrysantheme',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D2*8)),wl)},
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.55,.7),(par,x,y,a,l)=>{chryOld(dm=>mumLeaf(dm,x,y,a,l,'#3f6a2c'));
      chryLeaf(par,x,y,a,l*1.35,wl,svSeed('chrysantheme-feuille',cw.id,Math.round(x*8),Math.round(y*8)))})});
  open(k,t,1000,8,.3);return r}
if(typeof GH!=='undefined')GH['chrysantheme-disbud']=chryPlant;
