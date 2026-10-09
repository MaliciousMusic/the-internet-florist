/* ================= Pilote : le genre Chaenomeles en SVG natif (y-chaenomeles.js) =================
   One module per genus, one sheet per sort. The flowering quince (Chaenomeles japonica, speciosa, × superba): a cut branch of stiff, angular,
   grey-brown wood that zigzags from node to node, armed with straight thorns at the nodes; on short knobbly spurs of the old wood, fascicles of 2 to
   5 almost sessile flowers, each a cup of five broad rounded petals round a brush of forty-odd stamens with golden anthers, in a green bell-shaped
   calyx with short erect sepals; round, deeply coloured buds; young leaves (bronze, red-brown or green) coming with or after the flowers, with
   kidney-shaped stipules at the foot of their petioles. Drawn with the generic pieces of y3-branche.js: svBlossom (the flower) and svBranch.
   Colourways in the catalogue's order (B29_COG of s29a.js); added ones carry late:1. Photographs: refcache/cognassier-du-japon (brief.md,
   brief-organes.md, REFERENCES-section.md). Colours: measured on photographs for the colourways of evidence level A or B
   (refcache/cognassier-du-japon: coloris.md, 2nd pass prevails, and coloris-mesures.json; sources json in the catalogue); the others stay as first
   read by eye on the photographs and carry prov:1 (level C or D). */
const CHA_SID='cognassier-du-japon';
/* the colourways, one entry each (to add one: an entry here with its flower type and late:1, its name in CHA_NAMES, and in B29_COG of s29a.js
   {id,n,c,late:1}, so that the SKU numbers stay). type: a key of CHA_TYPE; base (foot of the petals, front), body, tip, bud (outside of the bud),
   back (outside of the open petal), cal (calyx), ped (pedicel), fil, anth (stamens), pist (styles), lf (young leaf), lf2 (grown leaf); optional:
   heart (the colour the inner whorls deepen to), age:{to,k} (the cultivar's ageing, else CHA_AGE0), mix:[[id,weight]...] (a branch of several
   colours: each flower draws one of these colourways from its own seed: 'Toyo-Nishiki'), split:[id,share] (some petals of a flower of that
   colourway take the other one: the white-and-pink flowers of 'Toyo-Nishiki'), form (what the colourway changes in the branch's silhouette:
   'Contorta'), thorn (its thorns: 'Cameo' nearly thornless). */
const CHA_COL={
  /* 0 Salmon Horizon (× superba; RHS 154370): single, coral-salmon, orange-pink at the foot; buds deeper coral-red (kept 63, 141, 178, 179, 252).
     Level B, measured (2nd pass): body #bc6356 (L 52.1 C 41.8 h 33.9, median of 3 photos), base #d76252, tip #a86751, anthers #c49045. Lightness raised
     by 5 L* (hue and chroma kept: the holder's rule, lightness is free; the render lands within dh 1 and chroma x 1.1 of the measure); back = body +4 L*, chroma x .9 (not measured); bud, calyx, filaments: not measured. */
  corail:{type:'simple',base:'#e66f5e',body:'#cb7062',tip:'#b6745d',bud:'#d4523c',back:'#d17d70',cal:'#6e7a34',ped:'#5e5a2c',fil:'#ece2a6',anth:'#c49045',pist:'#c8c886',lf:'#9a5428',lf2:'#4e7c2c'},
  /* 1 Crimson and Gold: single, bright red (the photographs: h 35, C 68; not the deep crimson of the old description), golden anthers (kept 41, 68).
     Level B, measured: body #dc4a3c (L 52.3 C 68.3 h 35.2, 3 photos), base #d95d46 (approximate), anthers #ceb25b (Kew 036); tip not measured (= body).
     Lightness raised by 1.5 L* only (the render darkens a little; a bright red must stay a red); back = body +4 L*, chroma x .9; bud and ageing: not measured. */
  rouge:{type:'simple',base:'#de614a',body:'#e14e3f',tip:'#e14e3f',bud:'#9a1022',back:'#e6604f',cal:'#5e6a2c',ped:'#56502a',fil:'#e8c890',anth:'#ceb25b',pist:'#bcbc7c',lf:'#8a3a22',lf2:'#4a7428',
    age:{to:'#c03848',k:.3}},
  /* 2 Pink Lady: single, deep rose-pink (organes 171, 174, 175). Level C (the photographs disagree: rose h 4 to 14 or salmon h 33 to 42): colours
     kept as first read, prov:1 */
  rose:{type:'simple',prov:1,base:'#cc3a5a',body:'#e2607c',tip:'#ea7890',bud:'#c02e4c',back:'#de6a84',cal:'#667030',ped:'#5a562c',fil:'#f2d8b0',anth:'#e8b830',pist:'#c4c486',lf:'#8e4a2a',lf2:'#4e7c2c'},
  /* 3 Nivalis: single, pure white, a faint green-cream at the foot (kept 206, 213; organes 181, 182). Level C (hue unstable between photographs,
     h 90 to 134 at C < 5): colours kept, prov:1 */
  blanc:{type:'simple',prov:1,base:'#ebe6d2',body:'#f7f3ec',tip:'#faf7f2',bud:'#efe4d6',back:'#efe9e0',cal:'#768436',ped:'#626030',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e',
    age:{to:'#f2ead6',k:.4}},
  /* 4 Cameo (× superba, the catalogue's « saumon abricot »): double, peach-apricot salmon; nearly thornless (Weber 1963; MoBot: thorn-tipped) (kept 200, 203).
     Level B, measured (1st pass; 3 concordant photos): body #d79472 (L 67.1 C 35.2 h 52.2), anthers #bba45a; base and tip not measured (= body). Lightness
     raised by 4 L* (hue and chroma kept); back = body +4 L*, chroma x .9; bud: not measured. */
  saumon:{type:'double',base:'#e39f7c',body:'#e39f7c',tip:'#e39f7c',bud:'#e2745a',back:'#eaab8b',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2d8a8',anth:'#bba45a',pist:'#c8c886',lf:'#946030',lf2:'#527e2e',
    thorn:{p:0,keep:.25}},
  /* 5 Orange Trail: single, vivid orange-scarlet (kept 130, 98; organes 121). Level D (no photograph of a flower): colours kept, prov:1 */
  orange:{type:'simple',prov:1,base:'#d83a1e',body:'#ee5a30',tip:'#f26c3e',bud:'#cc3a22',back:'#e8603a',cal:'#6a7432',ped:'#5a562c',fil:'#f0d090',anth:'#e8b020',pist:'#c4c07e',lf:'#8e4a24',lf2:'#4e7a2a'},
  /* 6 Toyo-Nishiki (speciosa): white, pink and red flowers, and white flowers splashed with pink, on the same branch. Level C (one fiche, the red
     not seen: the photographs show a white, a light pink and a deep pink only): colours kept, prov:1 */
  toyo:{type:'simple',prov:1,base:'#ee9aa8',body:'#f4b4bc',tip:'#f6c4ca',bud:'#e4808e',back:'#f0b0ba',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e0b0',anth:'#e8b42c',pist:'#c8c886',lf:'#7e6a2e',lf2:'#527e2e',
    mix:[['toyoW',.3],['toyoP',.3],['toyoR',.2],['toyoS',.2]]},
  toyoW:{type:'simple',prov:1,base:'#efe6d8',body:'#fbf6f1',tip:'#fcf8f4',bud:'#f2e2dc',back:'#f2ebe4',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e',sub:1},
  toyoP:{type:'simple',prov:1,base:'#e8909e',body:'#f4bcc4',tip:'#f6c8ce',bud:'#e2808e',back:'#f0b4bc',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e0b0',anth:'#e8b42c',pist:'#c8c886',lf:'#7e6a2e',lf2:'#527e2e',sub:1},
  toyoR:{type:'simple',prov:1,base:'#b8202e',body:'#d23c48',tip:'#d84a54',bud:'#b01e2c',back:'#cc4450',cal:'#626e30',ped:'#5a562c',fil:'#ecd09c',anth:'#e8b020',pist:'#c0bc80',lf:'#7e6a2e',lf2:'#527e2e',sub:1},
  toyoS:{type:'simple',prov:1,base:'#efe2d6',body:'#faf2ee',tip:'#fbf5f2',bud:'#f0c8cc',back:'#f2e6e2',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e',sub:1,
    split:['toyoP',.4]},
  /* late:1, out of the catalogue (census n7, n8, n10, n11: evidence level C, not sold; colours from Weber's descriptions) */
  simonii:{type:'semi',late:1,base:'#7e0e1c',body:'#a01624',tip:'#a81e28',bud:'#7a0c1a',back:'#962030',cal:'#5a642a',ped:'#524c28',fil:'#e0c088',anth:'#e0a820',pist:'#b8b47a',lf:'#843a22',lf2:'#4a7228'},
  moerloosei:{type:'simple',late:1,base:'#f0c6cc',body:'#f8ece8',tip:'#f6dcde',bud:'#eeb4bc',back:'#f2dcdc',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e',
    split:['moerP',.35]},
  moerP:{type:'simple',sub:1,base:'#e490a0',body:'#f0b8c2',tip:'#f2c4cc',bud:'#e08e9c',back:'#ecb4be',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e'},
  /* Kinshiden (speciosa; census n9, level B): double, cream-green (« vert-blanc »). Measured (2nd pass; Esveld N3 and two concordant Commons photos):
     body #c0be9f (L 76.4 C 16.5 h 105.8), anthers #b8b050; base and tip not measured (= body). Lightness raised to L* 85 (hue and chroma kept); back =
     body -2 L*, chroma x .9; heart (the inner whorls) = the same hue at C 20 (the first reading had a green centre); bud: not measured. prov:1: the
     double's shape is the modeller's and its centre is not measured. */
  kinshiden:{type:'double',late:1,prov:1,base:'#d8d6b6',body:'#d8d6b6',tip:'#d8d6b6',bud:'#d6e0b4',back:'#d2d0b4',cal:'#728236',ped:'#626030',fil:'#eee8c0',anth:'#b8b050',pist:'#c4cc8a',lf:'#6e7a30',lf2:'#527e2e',heart:'#c9c9a3'},
  contorta:{type:'simple',late:1,base:'#f0c4c4',body:'#faeeea',tip:'#f8e4e2',bud:'#f0bcc0',back:'#f4e0dc',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e8c0',anth:'#e4b42a',pist:'#c8cc8e',lf:'#7e6a2e',lf2:'#527e2e',
    form:{wave:[.32,1.1],zig:.42,zigL:.45}},
  falconnet:{type:'semi',late:1,base:'#e47a8e',body:'#f0a4b2',tip:'#f2b4c0',bud:'#dc6a80',back:'#eca2b0',cal:'#6e7a34',ped:'#5e5a2c',fil:'#f2e0b0',anth:'#e8b42c',pist:'#c8c886',lf:'#8a4a2a',lf2:'#4e7c2c'}};
const CHA_NAMES={corail:'Salmon Horizon',rouge:'Crimson and Gold',rose:'Pink Lady',blanc:'Nivalis',saumon:'Cameo',orange:'Orange Trail',toyo:'Toyo-Nishiki',
  simonii:'Simonii',moerloosei:'Moerloosei',kinshiden:'Kinshiden',contorta:'Contorta',falconnet:'Falconnet Charlet'};
/* the default ageing of an open flower: the colour washes out a little toward a pale pink-cream (organes 161, 162: pale flowers, margins whitened) */
const CHA_AGE0={to:'#f8e8de',k:.22};
/* the colourway one flower takes: a mixed branch ('Toyo-Nishiki') draws one of its colourways from the flower's own seed */
function chaPick(id,seed){const c=CHA_COL[id]?id:'corail',m=CHA_COL[c].mix;if(!m)return c;let x=svRng(svSeed('cha-mix',seed))(),t=0;for(const[k,w]of m){t+=w;if(x<t)return k}return m[m.length-1][0]}
/* the whorls: five broad rounded petals on a short claw, entire (no notch), imbricate, cupped (kept 63, 141, 213; organes 96, 141, 147); the
   semi-double (Simonii, Falconnet Charlet) 10 to 15, the double (Cameo, Kinshiden) 15 to 25 in four whorls, a boss of stamens still showing (kept 200, 203) */
const CHA_W=(n,dn,L,W,r0,z0,a0,a1,cup,wav,crk)=>({n,dn,L,W,r0,z0,a0,a1,cup,wav,crk,notch:0,fr:0,fd:0,nw:.02,jit:1+Math.max(0,.9-L)*2});
const CHA_WH={
  simple:[CHA_W(5,0,.98,1.16,.15,0,[.1,1.0],[.2,1.6],.12,.12,.04)],
  semi:[CHA_W(6,1,.98,1.06,.15,0,[.1,1.06],[.2,1.6],.12,.12,.04),CHA_W(5,1,.84,.98,.12,.02,[.08,.82],[.16,1.24],.12,.12,.06)],
  double:[CHA_W(6,1,.98,1.0,.15,0,[.1,1.1],[.2,1.6],.12,.12,.04),CHA_W(6,1,.86,.94,.12,.02,[.08,.86],[.16,1.3],.12,.12,.06),
    CHA_W(5,1,.7,.84,.09,.04,[.06,.6],[.12,1.0],.12,.12,.12),CHA_W(4,1,.52,.8,.06,.06,[.04,.36],[.08,.7],.14,.14,.2)]};
for(const k in CHA_WH)CHA_WH[k].forEach((W,w)=>{W.arc=w<2?1:.6;if(w<2){W.tw=.15;W.da=.3}});
/* the flower types: whorls, stamens (40 to 60 in two rows: a dense brush a third of the petal long, organes 114, 150) and the five styles joined
   at the foot (one bundle) */
const CHA_TYPE={
  simple:{wh:'simple',stam:{n:60,L:.3,r:.15,show:.35,fw:.022,aw:.075,h0:.24,sp:1.5,px:1},pist:{n:2,L:.3,leafy:0,l0:0}},
  semi:{wh:'semi',stam:{n:48,L:.28,r:.14,show:.4,fw:.022,aw:.075,h0:.28,sp:1.4,px:1},pist:{n:2,L:.28,leafy:0,l0:0}},
  double:{wh:'double',stam:{n:26,L:.24,r:.1,show:.5,fw:.022,aw:.075,h0:.4,sp:1.2},pist:{n:2,L:.26,leafy:0,l0:0}}};
/* the flower (svBlossom): bud a blunt egg, widest a little above its middle, coloured all over, in the green bell of the calyx (kept 50, 172, 186;
   organes 97); it opens to a cup, then a wide saucer (op 1); the sepals short, broad, rounded and erect (Weber 1963). Decline: the petals pale,
   their margins wave and crumple, the flower nods a little; then they fall (none or one stays), the calyx and the browning brush remain. */
const CHA_BASE={vb:.32,claw:[.32,.68],tip:2,aPow:1.15,open:[.28,.62],bud:[.1,.34],budH:[.62,.34],budR:.34,budE:[.06,.9],budK:1.25,budP:.62,budW:1.5,deep:.08,lap:.13,stag:.1,
  dec:[.08,.42],fan:[.42,.3],shed:[.58,.3],stay:[0,1],wA0:.08,wA1:.18,limp:.35,nod:.25,lapD:.8,cal0:.85,calS:1,calV:1,cal:{tube:.38,rt:.34,rb:.12,bp:.45,n:5,L:.24,W:1.2,a:[.12,.62]},pmin:10,trans:.22,rimW:.006,rimO:.22,edgeLit:.06,
  lightIn:{dark:[.86],lit:[1.08],darkLo:[.86],litLo:[1.06]},nu:8,nv:10,
  mat:cw=>{const c=CHA_COL[cw.id]||CHA_COL.corail;return{base:c.base,body:c.body,tip:c.tip,bud:c.bud,back:c.back,cal:c.cal,fil:c.fil,anth:c.anth,pist:c.pist,heart:c.heart,
    shade:l2h(h2l(c.body)[0],Math.min(1,h2l(c.body)[1]*1.05),h2l(c.body)[2]*.42),lite:mix(c.body,'#ffffff',.6)}},
  age:(c,k,id,part)=>{const a=(CHA_COL[id]&&CHA_COL[id].age)||CHA_AGE0;return mix(c,a.to,a.k*k)},
  light:Object.assign({},SVB_DEF.light,{ks:.11,gloss:16,wrap:.36,dark:[.9,.78,.66],lit:[1.12,1.26],la:.2,darkLo:[.88,.74],litLo:[1.14]})};
const CHA_SPEC={};
function chaSpec(id){if(CHA_SPEC[id])return CHA_SPEC[id];const c=CHA_COL[id]||CHA_COL.corail,T=CHA_TYPE[c.type]||CHA_TYPE.simple;
  const sp=c.split,pcw=sp?(cwx,g,w,i)=>svRng(g.sd+w*31+i*7)()<sp[1]?sp[0]:null:null;
  return CHA_SPEC[id]=Object.assign({},CHA_BASE,{wh:CHA_WH[T.wh],stam:T.stam,pist:T.pist},c.heart?{deep:.25}:{},pcw?{pcw}:{})}
/* how far the quince has faded: the sheets' override, the bouquet's element, else the bouquet's life stage */
function chaLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:CHA_SID,rec:{}})):0}
/* the head of the sheets and of the branch: one flower of the colourway (a mixed one draws its own), opening op, faded wl */
function chaSvg(par,B,O,D,cwId,op,seed,wl,lod){const c=chaPick(cwId,seed);return svBlossom(par,B,O,D,chaSpec(c),{id:c,c:CHA_COL[c].body},op,seed,wl==null?chaLife():wl,lod)}
SV_HEAD[CHA_SID]=chaSvg;
/* the colour of a fading quince PETAL (the other organs: CHA_BRANCH.wilt). No photograph of a fading flower (brief, brief-organes): the rule of the
   genus is that the petals fall still coloured; before that they pale and dull a little (organes 161, 162, doubtful) and brown at the very end.
   Reds and corals toward a dull rose, whites to ivory then parchment. */
function chaWiltFl(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=50&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;if(l<.15)return c;
  if(s<.2||l>.9){let o=mix(c,'#efe4cc',.55*w);if(w>.55)o=mix(o,'#b49470',(w-.55)*.7);return o}
  let o=l2h(h,s*(1-.32*w),l+(1-l)*.28*w);if(w>.55)o=mix(o,'#9a6a52',(w-.55)*.8);return o}
/* ---------- the cut branch (svBranch on the skeleton of the old drawing b29Quince, whose share of the bouquet's chance is consumed as before) ----------
   Organs (brief-organes.md, photographs by index): thorns at the nodes, straight, about 1 cm long on a 3.7 mm shoot, 2 mm at the foot, red-brown,
   at 70 to 110 degrees to the axis, pointing back down (organes 62, the only sharp one; kept 50); one-year shoots grey-brown (organes 22), older
   wood grey-brown, darker, a greyer bloom on it (kept 50, 172; organes 91, 92), no clear photograph of its lenticels (small, sparse: drawn faint);
   short knobbly spurs crowded with scale scars, each a fascicle of 2 to 5 flowers on very short pedicels (kept 110, 172; organes 22, 48, 49);
   winter buds small, round, red-brown (organes 92); young leaves bronze to red-brown, glossy, finely toothed, obovate to oblong, a short petiole
   (kept 48, 57; organes 52, 119, 159, 170), grown leaves fresh glossy green (kept 79, 93; organes 136); stipules kidney-shaped, toothed (TSO,
   Weber 1963: NOT PHOTOGRAPHED); a clean cut. The flowers come on the bare old wood before the leaves or with them (kept 50, 110, 170, 172: bare;
   63, 141, 178: young leaves among the flowers). */
const CHA_THORN={p:.12,L:3,col:'#7a4232',mm:[8,16],bw:2.2,ang:[.55,1.85],lit:'#c08868',tip:'#3a1a12',keep:1,fat:.5,cap:.8};
const CHA_FORM={zig:.3,zigL:.36,bow:.05,taper:[8,12,2,1.2],latW:.6,latK:[.55,.85],bare:.12,gap:[.55,.5],gapL:50,dorm:.5,nF:[2,5],tuft:[2,3],lf:[0,.8]};
const CHA_BRANCH={fD:4*UPC,cols:cw=>CHA_COL[cw&&cw.id]||CHA_COL.corail,
  flower:(pp,B,O,D,cw,op,sd,wl,lod)=>chaSvg(pp,B,O,D,cw&&cw.id,op,sd,wl,lod),
  wood:{young:['#2a1a12','#4c3226','#76564a','#b49686'],old:['#363029','#5e544a','#867a6e','#b8ad9f'],oldTo:.5,gloss:.45,
    lent:{col:'#b4a48e',sp:.9,len:.2,w:.16,op:.5,young:.3,lo:[.7,.8,.8]},ring:{col:'#22140e',n:2,op:.45},fiss:2},
  cut:{slant:.5,bark:'#3a2a1e',cam:'#8a9440',wood:'#e8d6ae',heart:'#c49c6c',pith:'#6a4a30',pr:.08,kind:'solid'},
  spur:{L:[.1,.25],w:.7,col:'#4a3022',lite:'#8a6450',rings:4},
  wbud:{L:.12,W:.75,col:['#2e1610','#6e3422','#a86048']},
  scales:{n:6,L:.09,col:'#5e3424',inner:'#9a4a32',open:.5},
  infl:{type:'fascicle',stalk:[0,0],ped:[.05,.1],spread:[.55,.95],droop:.04,face:.3,pw:.035,bract:null,down:.12,fpl:.2,join:.13},
  axis:(B,cw,op,wl)=>svblNod(chaSpec(cw&&CHA_COL[cw.id]?cw.id:'corail'),B,op,wl),
  leaf:{L:[.35,.65],W:.52,pet:.1,fold:.6,curl:.4,tw:.3,droop:.25,acu:.15,serr:20,dbl:0,tooth:.035,aris:.15,green:.7,two:.6,two1:9,glands:0,grow:.35,stip:.12,stipF:'reni',stipC:'#5e6e2c',stipT:.8,petC:'#6a3a24',
    hang:.2,Wy:.08,und:'#d8a888',undK:.3,gloss:.75,vd:.1,vO:.45,open:.8},
  kinds:{th:'th',lf:'lf'},
  thorn:cw=>{const c=CHA_COL[cw&&cw.id];return c&&c.thorn?Object.assign({},CHA_THORN,c.thorn):CHA_THORN},
  form:cw=>{const c=CHA_COL[cw&&cw.id];return c&&c.form?Object.assign({},CHA_FORM,c.form):CHA_FORM},
  age:{a:.24,b:1.12,c:-.3,r:[-.2,.16],step:.07},
  /* fading by organ (svbWilt): petals chaWiltFl; the stamens brown; the calyx stays, dulls and browns at the tips; leaves and pedicels as the cherry's;
     wood, spurs, buds and thorns unchanged; the cut a little darker */
  wilt:{fl:chaWiltFl,heart:{to:'#8a6a30',k:.5,w0:.6,br:'#5a3a1e',b0:.5,bk:.6},cal:{to:'#7a7a3a',k:.2,dull:.15,br:'#5a4426',b0:.7,bk:.35},
    lf:{to:'#6c7536',k:.6,w0:.6,dull:.3,br:'#7a5230',b0:.55,bk:.55,dk:.8},pd:{to:'#6a5a30',k:.3,dull:.2,br:'#5a4426',b0:.65,bk:.4},
    wd:0,sp:0,bud:0,th:0,cut:{to:'#a07850',k:.2}}};
const chaWiltCol=svbWilt(CHA_BRANCH.wilt,chaWiltFl);
if(typeof GHI!=='undefined'&&GHI[CHA_SID])GHI[CHA_SID].wilt=chaWiltCol;
svBranchWrap(CHA_SID,CHA_BRANCH,{prep:(o,cap)=>{const cw=cwPick(B29_COG,o),c0=cap.chains[0].pts[0],k=[Math.round(c0[0]*8),Math.round(c0[1]*8),Math.round(cap.L)];
  return{cw,op:Math.max(.05,Math.min(1,o.op??(.75+.25*svRng(svSeed('cha-op',...k))()))),wl:chaLife(o),seed:svSeed('cha',cw.id,...k)}}});
