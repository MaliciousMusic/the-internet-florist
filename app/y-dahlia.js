/* ================= Pilote : le dahlia décoratif (Dahlia pinnata hybrides, groupe Decorative) en SVG natif, sur la pièce capitule (y-dahlia.js) =================
   One module for the genus, one sheet per form, all on svcapDraw (y3-capitule.js). From the photographs of refcache/dahlia-decoratif (brief.md, the
   colourways' photographs in refcache/dahlia-decoratif-coloris-a and -b):
   - the head is fully double, no disc showing: rows of rays (ligules) packed close, the outer ones longest, the inner ones short, cupped and
     upright, closing over the heart (138 Eveline, 126, 129 Duet; the colourways' photographs); seen from the side a little wider than high
     (158, 168: about 0.7 to 0.8), the outer rows laid back toward the stem (168, 171);
   - FORMAL (Center Court, Lady Liberty, Beets Me, Diva, Ryan C., Checkers...): broad rays, about 2:1, flat to a little spooned (margins up), the
     tip rounded, set in a regular imbricate pattern, the heart closed;
   - INFORMAL (Labyrinth, Otto's Thrill, Bluetiful, Honeymoon, October Sky...): longer pointed rays, about 3:1, wavy and twisted, looser and
     irregular, the margins a little rolled back toward the tip (162 Camano Titan, 181);
   - the back (244, 182): five broad leafy green bracts spreading and turned down, then a cup of eight broad blunt pale yellow-green membranous
     bracts pressed under the rays;
   - the bud (173, 176, 177, 178): a round green ball a little wider than high, the pale striate inner bracts wrapped round it, the leafy outer
     ones spreading under it; opening (175, 152, 179, 209): the colour shows at the top, the rays push out as a tight tuft, then spread from the
     outer rows in;
   - fading (no photograph of a faded named decorative: the text of the brief and the two dry heads 190, 192 as proxies only): the outer rays
     go limp, turn down, brown and dry from their tips and margins; the head closes into a cone, the heart shrinking; the head nods a little.
   - the plant (163, 164, 165, 242; 156, 160, 169, 172, 183, 218, 241): a hollow round stem, green or purplish, finely striate, swollen at the
     nodes; leaves opposite, pinnate, 3 or 5 ovate toothed leaflets (about 2:1, the terminal one larger), pinnate veins; never a tuber.
   Colours: DAH_MAT[id], the medians of the colourways' photographs (catalogue/serre/sources/dahlia-decoratif.json, coloris-a.md, coloris-b.md),
   their lightness lifted where the photographs are under foliage (the rule: hue and saturation of the median, the lightness free); the
   radial measures (inner ring, body, tip ring) go to inner (the inner rows), body, tip. The form of a colourway: DAH_FORM_OF[id]. */
var DAH_MAT=typeof DAH_MAT!=='undefined'?DAH_MAT:{};
Object.assign(DAH_MAT,{
  /* whites and creams: the pure white of the varieties (the measured median is green-cast by the foliage), a creamier heart (Center Court) */
  blanc:{base:'#f3eedc',body:'#f8f6ee',tip:'#faf8f2',inner:'#f3e9c6',shade:'#e0d2b2',shadow:'#d8c49c',lite:'#fffdf6',ink:'#cdbb98',vein:'#ece2c8',shMin:.32,wTone:{lMax:.62,lK:.75,sMin:.32,sK:1,tip:.45,body:.12}},
  nacre:{base:'#eed6bc',body:'#f0cccb',tip:'#f2d5d7',inner:'#f0dfb2',shade:'#cc9e92',shadow:'#c99a84',ink:'#dcb6aa',shMin:.18,wTone:{lMax:.62,lK:.75,sMin:.32,sK:1,tip:.45,body:.12}},
  creme:{base:'#e6daa2',body:'#f0e6bc',tip:'#f2eccc',inner:'#e6d58c',shade:'#cfb07a',shadow:'#c8a46c',ink:'#d8c294',shMin:.18,wTone:{lMax:.62,lK:.75,sMin:.32,sK:1,tip:.45,body:.12}},
  /* peach, coral, salmon */
  peche:{base:'#eab070',body:'#f0c08e',tip:'#f3cdaa',inner:'#eeb060'},
  corail:{base:'#cc4448',body:'#e06a64',tip:'#ea8c86',inner:'#c83a40'},
  saumon:{base:'#cf6048',body:'#d8705e',tip:'#e09a9c',inner:'#c95638'},
  /* pinks, magentas, violets */
  rose:{base:'#cc2e52',body:'#d84a6c',tip:'#de7690',inner:'#c01c40'},
  fuchsia:{base:'#b01848',body:'#c81c57',tip:'#c0186a',inner:'#9a1636'},
  lavande:{base:'#8e3a96',body:'#a656b8',tip:'#b068c4',inner:'#7a2878'},
  pourpre:{base:'#3a0a18',body:'#4a0f1e',tip:'#541428',inner:'#2d060e',lite:'#8a2a48',litS:.5,litL:1.4},
  /* reds */
  rouge:{base:'#b8060f',body:'#c00818',tip:'#c81020',inner:'#a20511'},
  'rouge-noir':{base:'#2c0e10',body:'#3a1218',tip:'#40141a',inner:'#250d0d',shade:'#150102',lite:'#8e2436',litS:.45,litL:1.5},
  /* orange, yellow */
  orange:{base:'#d86c18',body:'#e07a26',tip:'#e48a3a',inner:'#cc5e08'},
  jaune:{base:'#f2cc34',body:'#f2d64a',tip:'#f4dc66',inner:'#f2c82a'},
  /* bicolours: yellow tipped pink-mauve, white tipped lavender, coral with a yellow heart, purple tipped white */
  'jaune-rose':{base:'#d6a848',body:'#e0b860',tip:'#e0b066',inner:'#d4a040',tips:'#d795a4',tipsV:.74,tipsM:.12,tipsB:.15,tipsBV:.1},
  'blanc-lavande':{base:'#e6d6bc',body:'#efe2d0',tip:'#ece0dc',inner:'#e6cc98',tips:'#b88cc2',tipsV:.76,tipsM:.12,tipsB:.2,tipsBV:.12,shade:'#c4a6a8',shadow:'#bf9c98',ink:'#d8c4c0',shMin:.18},
  'corail-jaune':{base:'#e0a040',body:'#d9603a',tip:'#de6e58',inner:'#ecbe4a',innerB:'#f0c850',halo:'#eeb848',haloV:.3,haloM:.14},
  'karma-yin':{base:'#7a2450',body:'#87285c',tip:'#8e2e62',inner:'#6f1e2d',tips:'#ecdcec',tipsV:.84,tipsM:.06,tipsB:.1,tipsBV:.06},
  /* late:9 */
  'rouge-blanc':{base:'#a00808',body:'#c70a07',tip:'#c80c0c',inner:'#8e0608',tips:'#f6ece8',tipsV:.8,tipsM:.08,tipsB:.08,tipsBV:.06},
  'rose-strie-blanc':{base:'#d87e98',body:'#dc8aa2',tip:'#de96b4',inner:'#d47a96',fleck:{c:'#f8eef2',n:3,v0:.1,v1:.5,l:.5,w:.11,op:.9}},
  'blanc-bordeaux':{base:'#e6d4d0',body:'#ebdbd9',tip:'#eee2e0',inner:'#e2ccc8',fleck:{c:'#753f48',n:7,v0:.15,v1:.9,l:.03,w:.07,op:.95},shade:'#c8aa9e',shadow:'#c0a092',ink:'#d8c4bc',shMin:.18},
  'violet-vif':{base:'#560c66',body:'#661a82',tip:'#6e2088',inner:'#4b1148',lite:'#8a3ab0'},
  caramel:{base:'#c8601c',body:'#d27530',tip:'#dc9048',inner:'#c14b05'}});
/* the colourway's form, after its named varieties (the json: Swan Island's bloom style) and the look of its photographs */
const DAH_FORM_OF={blanc:'formel',nacre:'formel',creme:'informel',peche:'formel',corail:'informel',saumon:'informel',rose:'informel',fuchsia:'formel',
  lavande:'informel',pourpre:'formel',rouge:'formel','rouge-noir':'formel',orange:'informel',jaune:'formel','jaune-rose':'informel','blanc-lavande':'informel',
  'corail-jaune':'informel','karma-yin':'formel','rouge-blanc':'formel','rose-strie-blanc':'informel','blanc-bordeaux':'formel','violet-vif':'formel',caramel:'formel'};
/* the two forms (only what differs from SVCAP_DEF): nine rows, the outer laid back past flat, the middle ones spread, the inner ones upright and
   bent in over the heart (a1 below a0); innerK: how far a row takes the heart's colour */
const DAH_FORMS={
  formel:{rows:9,n:[[0,13],[.5,11],[1,7]],nJ:.04,stag:.5,L:[[0,.68],[.25,.74],[.5,.74],[.75,.62],[.9,.48],[1,.3]],W:[[0,.5],[.5,.45],[.75,.38],[1,.32]],
    r0:[[0,.2],[.5,.14],[1,.02]],z0:[[0,-.02],[.25,.04],[.5,.12],[.75,.26],[1,.45]],a0o:[[0,1.85],[.25,1.62],[.5,1.32],[.75,1.05],[.9,.8],[1,.45]],a1o:[[0,2.7],[.25,1.4],[.5,1.0],[.75,.75],[.9,.5],[1,.15]],aPow:1.2,
    claw:.4,vb:.6,taper:.06,tipE:2.6,tipH:.6,teeth:[1,0],cup:.85,quill:0,tw:0,wav:0,curl:0,
    jL:.06,jW:.05,jA:.1,jPh:.05,jTw:.14,jCurl:.08,jBend:.08,jRip:.04,jLift:[.04,-.06],jDrop:[.03,.14],jFold:[0,.25],jTip:.12,
    innerK:[[0,0],[.5,.15],[.8,.6],[1,.9]],shadeF:.62,lnF:.6,rowSh:[.08,.6,.6],lag:.42},
  informel:{rows:8,n:[[0,12],[.5,10],[1,7]],nJ:.08,stag:.5,L:[[0,.8],[.3,.84],[.6,.8],[.85,.62],[1,.38]],W:[[0,.46],[.5,.42],[.8,.35],[1,.3]],
    r0:[[0,.2],[.5,.13],[1,.02]],z0:[[0,-.02],[.3,.08],[.6,.22],[1,.58]],a0o:[[0,1.8],[.3,1.2],[.6,.87],[1,.5]],a1o:[[0,2.6],[.3,1.58],[.6,1.12],[1,.35]],aPow:1.15,
    claw:.38,vb:.55,taper:.16,tipE:2.05,tipH:.88,teeth:[1,0],cup:.45,quill:.14,tw:.06,wav:.1,curl:.04,
    jL:.09,jW:.07,jA:.12,jPh:.09,jTw:.2,jCurl:.14,jBend:.14,jRip:.05,jLift:[.1,-.3],jDrop:[.1,.28],jFold:[0,.3],jTip:.15,
    innerK:[[0,0],[.5,.15],[.8,.6],[1,.9]],shadeF:.6,lnF:.6,rowSh:[.08,.6,.6],lag:.42}};
/* the involucre (244, 182): an outer row of five leafy bracts spreading and turned down (already in the bud, 173, 177), an inner row of eight broad
   blunt membranous bracts wrapped round the bud (176, 178), pressed under the rays once open; the receptacle a shallow cup */
const DAH_INV={rows:2,n:[5,8],L:[.54,.42],W:[.17,.3],round:1,r0:.17,z0:-.03,rowA:[[1.45,1.85,1.5,2.1],[1.3,-1.45,1.75,2.5]],bud:2.3,budS:[0,.75],budR:[.6,1],budW:2.2,ob:[.18,.3],edge:.4,wA:[.3,.4],under:0,fanShow:1};
/* the life: the bud green (col), the rays coloured before they part; opening from the outer rows in (lag); fading: the outer rows go limp and
   turn down, the inner ones rise and close into a cone (wA by row), the rays brown from the tips and margins keeping their hue (wTone); the head
   nods a little (tip); no shedding */
const DAH_LIFE={z0g:.3,open:[.18,.7],grow:[.3,.75],budL:.08,budE:[.1,.35],col:[.12,.36],a0c:[[0,.12],[1,.04]],a1c:[[0,-.55],[1,-.9]],
  dec:[.12,.4],fan:[.45,.35],shed:[.75,.25],tip:[[.38,.45,.4]],wA0:[[[0,.25],[1,.05]],[[0,.6],[.35,.2],[.6,-.3],[1,-.4]]],wA1:[[[0,.35],[1,0]],[[0,1],[.35,.3],[.6,-.7],[1,-.9]]],
  wCurl:[.2,.62],wQuill:[.08,.3],wW:.18,wL:.2,wGrav:.35,wWav:.3,wBrown:[.1,.55],edge:.2,rows1:6,shadeF1:.45,budHide:.09,wTone:{tip:.55,body:.15,wash:.5,v:.72,mg:.4},shLens:.62,shR:1,tipN1:1,rowShFan:1.4,
  heart:{off:1,wall:.001,wallI:-.18,wallNz:-.35,r:.06,disc:.04,h:.02},shade:[.12,1.3],ao:.3,light:{kD:.8},
  /* the light (svcapLitG): the spooned rays lit at their tips and crests, shaded at the foot and toward the deep heart (138, 129, 126) */
  lit:{g:[[0,'s',.95],[.3,'s',.45],[.52,'s',0],[.66,'l',0],[1,'l',.6]],lv:[.75,.95],ls:[1,.85,.7],ll:[.4,.7,1],v0:0,hF:.8,hF1:.6,sK:1,lens1:0}};
const DAH_SPEC={};
/* the bud's drawn width / the open head's D at op .05 (to set a bouquet bud of the old bud's size) */
const DAH_BUDK=.36;
/* the involucre's greens (244, 182, 176): the outer leafy bracts mid green, the inner membranous ones pale yellow-green */
const DAH_GREENS={bract:'#4c7a36',bract2:'#a3b466',bractTip:'#8a8a4a',recep:'#7a9a4a',green:'#6f9a48'};
function dahSpec(form){return DAH_SPEC[form]||(DAH_SPEC[form]=Object.assign({mat:cwx=>svcapMat(cwx,Object.assign({},DAH_GREENS,DAH_MAT[cwx.id])),inv:DAH_INV},DAH_LIFE,DAH_FORMS[form]))}
function dahForm(cwx){return cwx.form||DAH_FORM_OF[cwx.id]||'formel'}
/* the colour of fading (no photograph of a faded named decorative: the brief's text and the dry heads 190, 192, by proxy): each hue dulls and
   darkens its own way, then all dry to a warm brown; greens (stem, leaves, bracts) go the bouquet's way (lifeCol) */
function dahWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c),k=svSm((w-.4)/.45),k2=svSm((w-.78)/.22);if(k<=0)return c;
  if(h>=65&&h<170&&s>.12&&l<.75)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.15||l>.84)return mix(mix(c,'#d9b886',.65*k),'#9a6c40',.25*k2);/* whites and creams to a warm tan, never grey (the dry proxies) */
  const d=((28-h+540)%360)-180,o=l2h(h+d*.3*k,s*(1-.35*k),l*(1-.18*k));return k2>0?mix(o,l2h(h+d*.5,s*.55,Math.min(.5,l*.8)),.4*k2):o}
function dahLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'dahlia-decoratif',rec:{}})):0}
/* the head, any colourway of the list ('rouge~informel': a colourway in the other form, test sheets only). The dahlia has no GHI card (one would
   change how the composer treats it, e5.js recInfo): the head wilts by its own colours here, whatever filter is set */
function dahSvg(par,B,O,D,cwId,op,seed,wl,S){const[cid,fo]=String(cwId).split('~'),c0=(typeof CW_DDEC!=='undefined'&&CW_DDEC.find(x=>x.id===cid))||{id:cid,c:'#e05a8a'},
    cwx=fo&&DAH_FORMS[fo]?Object.assign({},c0,{form:fo}):c0,w=wl==null?dahLife():wl,W0=typeof WILT!=='undefined'?WILT:null;
  if(w>0&&typeof lifeWilt==='function')WILT=lifeWilt(w,dahWiltCol,'dahlia-decoratif');
  try{return svcapDraw(par,B,O,D,S||dahSpec(dahForm(cwx)),cwx,op,seed,w)}finally{WILT=W0}}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['dahlia-decoratif']=dahSvg;
/* the old drawing run into a detached group and thrown away (its defs too): the bouquet's chance it draws is consumed exactly, whatever it is */
function dahOld(fn){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{fn(dm)}finally{GDEF=g0}}
/* the stem (163, 164, 165, 242): hollow, round, smooth with fine striae, a light gloss; green, or purplish on a third of the stems (a gene of the
   stem's place, no draw), swelling a little at the nodes */
const DAH_SC=['#284620','#4a7a34','#7aa456','#c4dca4'];DAH_SC.sv={swell:.025,gloss:.4,ribs:[-.42,-.14,.16,.44],red:'#6a2a3a',redF:.55,redA:.18};
const DAH_SCP=['#2e1a1e','#5a2c34','#8a5058','#d0b0b4'];DAH_SCP.sv={swell:.025,gloss:.45,ribs:[-.42,-.14,.16,.44],red:'#4a7a34',redF:.2,redA:.12};
/* the node: the opposite leaves' bases clasp a swollen ring (163) */
function dahNode(par,x,y,a,w,c){const ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,s=w*.62,L=w*.55;E('path',{d:`M${svF(x-nx*s-ux*L)},${svF(y-ny*s-uy*L)}Q${svF(x-nx*s*1.25)},${svF(y-ny*s*1.25)} ${svF(x-nx*s+ux*L)},${svF(y-ny*s+uy*L)}L${svF(x+nx*s+ux*L)},${svF(y+ny*s+uy*L)}Q${svF(x+nx*s*1.25)},${svF(y+ny*s*1.25)} ${svF(x+nx*s-ux*L)},${svF(y+ny*s-uy*L)}Z`,fill:c[1],stroke:c[0],'stroke-width':svF(w*.06),'stroke-opacity':.5},par)}
/* the leaf drawn in its place (opposite pairs on the plant, the bouquet's stem leaves): the old pinnate leaf's chance consumed, then the SVG one */
/* the leaflets broad ovate, the terminal one the largest (156, 160, 169, 172: a leaf 15 to 20 cm, its leaflets nearly half its length) */
function dahLeaf(par,x,y,a,l,nl,o,wl,sd){svcapLeaf(par,x,y,a,l,{n:nl,wl,sd,side:sd%4===0?-.6:.6,lf:.46,ar:1.85,term:1.35})}
/* the plant of the bouquet: dahliaPlant (r1a.js) for the decorative only, its chance consumed as before: the same lsHeadS call (its draws in the
   same order), the old head, bud and leaf drawn into a thrown-away group before the SVG ones */
function dahDecPlant(g,t,o){if(typeof SV_ON==='undefined'||!SV_ON||typeof CW_DDEC==='undefined')return dahliaPlant(g,t,o,'dec',CW_DDEC);
  const list=CW_DDEC,cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),wl=dahLife(o),
    pur=svSeed('dahlia-tige',cw.id,Math.round((o.cm||14)*10),Math.round((o.len||0)*10))%3===0,sc=pur?DAH_SCP:DAH_SC;
  const r=lsHeadS(k,o,{D,w:D*.07,cols:sc,op,rr:1,nodes:rnd()<.4?2:1,li:.5,lp:.95,opp:1,leafAng:58,side:{p:.55,n:2,top:1,len:.42,ang:36,age:[0,.3]},budD:.3,
    flower:(par,B,O,D2,op2)=>{dahOld(dm=>dahliaFlower(dm,B,O,D2,cw,op2,'dec'));dahSvg(par,B,O,D2,cw.id,op2,svSeed('dahlia',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D2*8)),wl)},
    bud:(par,B,O,s,a)=>{dahOld(dm=>dahliaBud(dm,B,O,s/.42,cw));dahSvg(par,B,O,s/DAH_BUDK,cw.id,.04+.12*(a||0),svSeed('dahlia-bouton',cw.id,Math.round(O[0]*8),Math.round(O[1]*8)),wl*.6)},
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.62,.82),(par,x,y,a,l)=>{const nl=og.p.i>1?5:3;dahOld(dm=>pinnateLeaf(dm,x,y,a,l,'#3a6a2c',nl,{w:.48,side:.3}));
      dahLeaf(par,x,y,a,l*1.35,nl,{},wl,svSeed('dahlia-feuille',cw.id,Math.round(x*8),Math.round(y*8)))}),
    node:(og,pos)=>({z:pos[2]+.1,cast:false,fn:par=>{const h=[og.H[0],-og.H[1]];dahNode(par,pos[0],-pos[1],Math.atan2(h[1],h[0]),D*.07,sc)}})});
  open(k,t,1000,10,.3);return r}
if(typeof GH!=='undefined')GH['dahlia-decoratif']=dahDecPlant;
/* the bouquet's stem leaves (s0.js stemLeaves): no R drawn before the hook (svNoR), the old pinnate leaf's chance consumed here */
if(typeof STEML!=='undefined'&&STEML['dahlia-decoratif']){const sl=STEML['dahlia-decoratif'];sl.svNoR=1;
  sl.sv=(par,x,y,a,l,q)=>{const nl=sl.lf||3;dahOld(dm=>pinnateLeaf(dm,x,y,a,l,sl.col||'#3f6a2c',nl,{side:(q&&q.s||1)*.5,w:sl.w||.5,gloss:sl.gloss,teeth:sl.teeth}));
    dahLeaf(par,x,y,a,l*1.3,nl,{},dahLife(null),svSeed('dahlia-feuille-tige',Math.round(x*8),Math.round(y*8),Math.round(l*8)))}}
