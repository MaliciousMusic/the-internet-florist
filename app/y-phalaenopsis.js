/* ================= y-phalaenopsis.js : l'orchidée papillon (Phalaenopsis), une hampe coupée en vase, sur le kit y3-orchidee.js =================
   References: refcache/phalaenopsis/brief.md (25 kept photographs, kept.jpg) and fane-inat.jpg (fading flowers, iNaturalist). Never a pot, a root
   or a basal leaf: the scape is cut and stands in the vase. « hypothèse »: no photograph of a whole cut scape, nor of a full fading series. */
/* the colours of the colourways (CW_PHAL, s1c.js; ids, order and c never change; the late:14 ones are appended below). Measured by hand on
   the photographs (refcache/phalaenopsis/coloris.md, 2026-10-17): body (the petal's median), base (at the claw), tip (the edge), back (the
   reverse), sep / sepL (dorsal / lateral sepals), lip (the mid-lobe), side (the side lobes), sideV (their stripes), cal (the callus), dot (its
   dots), vein / spot / blot / band / eye (the patterns). Whites stay a warm healthy white (the photos' grey is their lighting); lightness lifted
   where the photographs are under-exposed (hue and chroma kept: the rule « clarté libre »); src = colourway number, level, photographs. */
const PHAL_CW={
  'blanc':{body:'#f9f7f1',base:'#ead9bf',tip:'#fcfbf8',back:'#efebe2',sep:'#f8f5ee',lip:'#f0e2c0',lipB:'#f0b830',side:'#e8b040',cal:'#e0862a',dot:'#cf452c',sideV:'#d0602a',src:'1403 B ph. 0-4 : labelle crème, lobes jaunes, callosité orange ; blanc gardé chaud'},
  'blanc-rouge':{body:'#f9f7f1',base:'#ead9bf',tip:'#fcfbf8',back:'#efebe2',sep:'#f8f5ee',lip:'#882a48',side:'#c4555a',cal:'#c8643f',dot:'#5a0a24',band:{c:'#d8b8d8',w:.0024,v0:.1,op:.35,edge:1,glow:8},src:'1404 B ph. 5-7 : labelle magenta foncé ; picotis lilas fin (ph. 7) ; v3 : lobes latéraux corail à pointe blanche et callosité orange-rouge mesurés sur la photo 29, balance des blancs corrigée sur le pétale (#b94d53, pointe #e2aea2, callosité #bc5f41)'},
  'blanc-jaune':{body:'#f9f7f1',base:'#f1eadc',tip:'#fbfaf7',back:'#efebe2',sep:'#f8f6f0',lip:'#e6dbad',lipB:'#dcb838',side:'#d1b738',cal:'#c47f29',dot:'#c8401e',sideV:'#a0401e',src:'1405 B ph. 10,11,14 : lobes jaunes striés rouge-brun'},
  'rose-pale':{body:'#f2e6f1',base:'#f1c9ee',tip:'#f7f0f6',sep:'#edebf1',lip:'#e6c6c3',side:'#d47161',cal:'#cb7b19',dot:'#b8203e',eye:{c:'#e6c4e2',v:.4,w:.5,op:.55},vein:{c:'#d4a0cc',n:12,w:.0024,op:.35},src:'1406 C ph. 17,18 (16 borne haute) : blanc à peine rose-lilas, lavis au centre'},
  'rose':{body:'#c87cc0',base:'#ca97cf',tip:'#d7c4dd',sep:'#a3739c',sepL:'#b27da0',lip:'#8d4681',side:'#873a65',cal:'#c9a43a',dot:'#8a2a20',band:{c:'#e2d2e2',w:.0036,v0:.1,op:.6,edge:1,glow:8},vein:{c:'#9c5f9c',n:12,w:.0026,op:.4},src:'1407 B ph. 19-21 : rose-mauve, centre pâle, bord blanc lavé (ph. 19, 20 sous-exposées : clarté +10)'},
  /* (v3, orchestrator 2026-10-17: the median of 8 well-lit photographs of the colourway, 27, 13, 36, 37, Rosini 0-1, Jetgreen Pixie 1, Mary
     Pixie 0: L60 C61 h343 LCh, HSL s .72; 27's lit body L56 C77 h348; its dorsal redder h355, its lateral sepals darker L47; recensement 22-24
     h337 C57 kept as the low bound. Fine darker magenta veins in a net (27)) */
  'fuchsia':{body:'#e94fad',base:'#d83c94',tip:'#e862b7',sep:'#e2398b',sepL:'#c73380',lip:'#a42450',side:'#b3305f',cal:'#d68a30',dot:'#a8183c',shade:'#781250',band:{c:'#fde8f6',w:.0032,v0:.06,op:.92,edge:1,glow:6},vein:{c:'#bc146e',n:30,w:.0042,op:.17,net:1.4,wob:.014,v0:.12},src:'1408 B : médiane de 8 photos bien éclairées L60 C61 h343 (27 : L56 C77 h348) ; liseré clair fin, réseau de nervures magenta foncé'},
  'lilas':{body:'#be7cca',base:'#a15b98',tip:'#b78ebf',sep:'#906190',sepL:'#996c98',lip:'#481834',side:'#91418f',cal:'#743a08',dot:'#3a0a2a',spot:{c:'#5a1a5a',n:14,r:[.004,.009],v:[.03,.5],op:.7,k:1.5},vein:{c:'#db96e6',n:10,w:.0024,op:.3},src:'1409 B ph. 26-28 : lilas, petites taches pourpres, nervures claires'},
  'pourpre':{body:'#cc73e6',base:'#deb5e0',tip:'#b66aba',sep:'#b664bd',sepL:'#904f86',lip:'#62295c',side:'#c275b6',cal:'#b86fa9',dot:'#3a0428',src:'1410 B ph. 30-32 : violet-pourpre uni, centre pâle'},
  'jaune':{body:'#d9bc3d',base:'#ccc8ac',tip:'#c8ae30',sep:'#bfb250',sepL:'#9c8018',lip:'#a55222',side:'#a04107',cal:'#b24508',dot:'#7a2a0a',vein:{c:'#b8541e',n:12,w:.003,op:.5},src:'1411 B ph. 33-37 : jaune, nervures rouge-orange'},
  'citron':{body:'#e2e0b8',base:'#d8d8a8',tip:'#e8e6c4',sep:'#dcdcac',lip:'#ddd5b8',side:'#c0ad70',cal:'#925d32',dot:'#8a3a14',src:'1412 C ph. 38-40 : crème-citron (Golden Chief), entre Summer Beach (vert) et 39-40 (crème)'},
  'cuivre':{body:'#d89465',base:'#dfc48f',tip:'#e4c67d',sep:'#b97f38',sepL:'#c99845',lip:'#d34a62',side:'#d5351e',cal:'#eda816',dot:'#801a10',spot:{c:'#c26c46',n:30,r:[.003,.007],v:[.04,.6],op:.6,k:1.4},vein:{c:'#c27850',n:12,w:.0026,op:.4},src:'1413 B ph. 41-44 : abricot à bord jaune, ponctuations brun-orange'},
  'vin':{body:'#ca3641',base:'#ca1e2f',tip:'#e5657c',sep:'#c22a2f',sepL:'#aa1a1e',lip:'#fcb5f2',side:'#f08ac8',cal:'#c92a28',dot:'#7a0a18',src:'1414 C ph. 45,46 : rouge vif velours, labelle rose vif (photo, pas rouge vin)'},
  'vert':{body:'#bdcb69',base:'#b2bf4e',tip:'#c5ca7a',sep:'#b1ba42',lip:'#c4ac37',side:'#c8a830',cal:'#d09020',dot:'#b0402a',src:'1415 C ph. 38 : jaune-vert (clarté +12, voile de serre)'},
  'strie':{body:'#ead8e4',base:'#ea8cb7',tip:'#f0e4ec',sep:'#d7b5cb',lip:'#831e39',side:'#82121e',cal:'#a93814',dot:'#5a0a20',vein:{c:'#82396a',n:22,w:.0045,op:.85,net:.25},src:'1416 B ph. 47-49 : fond blanc-lilas, nervures pourpres réticulées'},
  'arlequin':{body:'#f9f7f1',base:'#f1eadc',tip:'#fbfaf7',back:'#efebe2',sep:'#f8f6f0',lip:'#f8f3f7',side:'#efd99a',sideV:'#854842',cal:'#9a5048',dot:'#5a1a30',blot:{c:'#961d66',n:[3,5],r:[.1,.22],v:[.05,.42],op:.92,rag:1},spot:{c:'#961d66',n:10,r:[.004,.008],v:[.5,.95],op:.75,k:.8},src:'1417 B ph. 50-52 : blanc, grandes taches magenta-baie à la base'},
  'borde':{body:'#f9f7f1',base:'#f1eadc',tip:'#fbfaf7',back:'#efebe2',sep:'#f8f6f0',lip:'#edd790',side:'#f0c8a9',cal:'#ca8e3b',dot:'#8a3a14',eye:{c:'#e285cc',v:.36,w:.6,op:.7},src:'1418 B ph. 55-57 : blanc lavé de rose depuis la colonne, bord blanc (photo, pas bordé)'},
  'coeur-orange':{body:'#d468ca',base:'#ee98e6',tip:'#d8bdd3',sep:'#d484c8',sepL:'#c694c8',lip:'#bb3081',side:'#b31e9b',cal:'#af581f',dot:'#6a0a30',band:{c:'#e6d0e2',w:.0028,v0:.1,op:.55,edge:1,glow:8},vein:{c:'#e8b8e2',n:10,w:.0022,op:.3},src:'1419 B ph. 58,59,22 : rose-magenta, liseré clair, callosité orange'},
  'mouchete':{body:'#f2e8f1',base:'#e2a2cf',tip:'#f6eef4',sep:'#f0d4e7',lip:'#8e0b28',side:'#611716',cal:'#781c04',dot:'#4a0a10',spot:{c:'#a33b9c',n:70,r:[.005,.014],v:[.02,.92],op:.85,k:1.3},src:'1420 C ph. 60,63,64 : fond blanc (ombre retirée), mouchetures magenta en nappes'},
  'tigre':{body:'#d9b675',base:'#e8c87a',tip:'#e0c088',sep:'#d0a860',sepL:'#b67c3a',lip:'#e8c87c',side:'#d8a050',cal:'#c86a30',dot:'#7a2a10',blot:{c:'#b95833',n:[9,13],r:[.1,.2],v:[.08,.95],op:.9,bar:1},src:'late:14 C ph. 66,67 (Mambo) : barres rouge-brun sur jaune-orangé'},
  'blanc-mouchete-rouge':{body:'#f9f7f1',base:'#f1eadc',tip:'#fbfaf7',back:'#efebe2',sep:'#f8f6f0',lip:'#e0a898',side:'#b0624e',cal:'#c0402a',dot:'#6a0a10',blot:{c:'#85121b',n:[3,5],r:[.08,.18],v:[.05,.4],op:.9,rag:1},spot:{c:'#85121b',n:16,r:[.004,.009],v:[.2,.7],op:.8,k:1},src:'late:14 C ph. 68,70 (Taiwan Glory) : blanc non mesurable, taches rouge cramoisi'},
  'grandes-levres':{body:'#dd68ac',base:'#e57eb0',tip:'#cb849d',sep:'#e764b2',sepL:'#d05d95',lip:'#fdead9',side:'#e6aaae',cal:'#b34435',dot:'#8a1a20',spot:{c:'#b02040',n:8,r:[.003,.006],v:[.02,.2],op:.6,k:1.5},src:'late:14 C ph. 71 (Lipperose) : rose, très grand labelle crème'}};
/* the material of a colourway: ramps by kind for the kit (svorMatOf), cached by sort and id */
/* the colourways added (late:14, after the waves of the other chantiers; appended at the end, no SKU number moves): the photographs' new
   cultivars of coloris.md (the bright red is already 1414, not doubled). Level C (1-2 photographs each): questions in etat.md */
if(typeof CW_PHAL!=='undefined'&&!CW_PHAL.some(x=>x.id==='tigre'))CW_PHAL.push(
 {id:'tigre',n:'Tigré orange (Mambo)',c:'#d9b675',spots:'#b95833',lip:'#e8c87c',lip2:'#d8a050',cal:'#c86a30',dots:'#7a2a10',late:14},
 {id:'blanc-mouchete-rouge',n:'Blanc moucheté de rouge (Taiwan Glory)',c:'#f9f4f0',spots:'#85121b',lip:'#e0a898',lip2:'#b0624e',cal:'#c0402a',dots:'#6a0a10',late:14},
 {id:'grandes-levres',n:'Rose à grand labelle (Lipperose)',c:'#dd68ac',lip:'#fdead9',lip2:'#e6aaae',cal:'#b34435',dots:'#8a1a20',late:14});
const PHAL_MAT={};
function phalMat(cwx){const id=cwx&&cwx.id;if(PHAL_MAT[id])return PHAL_MAT[id];const c=PHAL_CW[id]||{body:(cwx&&cwx.c)||'#f7f4ee',lip:(cwx&&cwx.lip)||'#c83070',side:(cwx&&cwx.lip2)||'#e05a8a',cal:'#f2c240',dot:'#8a1040'};
  const base=c.base||c.body,tip=c.tip||c.body,back=c.back||mix(c.body,'#ffffff',h2l(c.body)[2]>.8?.3:.12),l=h2l(c.body)[2],light=l>.8,
    shade=c.shade||(light?'#c4ae90':mix(c.body,'#2a0a26',.42)),bshade=light?'#c8b8a0':mix(back,'#3a1a30',.38),
    per={st:[[0,base],[.25,mix(base,c.body,.6)],[.55,c.body],[.85,mix(c.body,tip,.6)],[1,tip]],bst:[[0,mix(back,'#c8d4a0',light?.35:.2)],[.3,back],[.7,back],[1,mix(back,tip,.4)]],shade,lite:light?'#ffffff':mix(c.body,'#ffffff',.6),bshade,blite:'#ffffff',rim:c.band?c.band.c:light?'#e8dcc8':mix(c.body,'#ffffff',.25)},
    /* the side lobes (v2, photographs 3, 27): the inner face (toward the column, the one the front view shows) yellow at its foot by the
       callus and striped, then the lobe's colour, whitening toward the top on the light ones (3); paler at its foot on the dark ones, their
       margin darker (27); the outer face (the profile's) the flower's colour, only its foot tinged */
    side={st:light?[[0,mix(c.cal,c.side,.5)],[.14,c.side],[.32,mix(c.side,c.body,.45)],[.52,mix(c.side,c.body,.85)],[1,c.body]]
        /* (v3, 27, 29: on the dark ones the inner face pale, a creamy white by the callus, then a pale pink streaked red, the lobe's colour
           only toward its upper margin) */
        :[[0,mix(c.cal,'#fff4e6',.55)],[.1,mix(c.cal,'#fff2e0',.74)],[.2,mix(c.side,'#fbe8ef',.82)],[.4,mix(c.side,'#f6dce8',.62)],[.62,mix(c.side,'#f0d0e0',.28)],[.8,c.side],[1,mix(c.side,'#2a0a1a',.12)]],
      bst:light?[[0,mix(c.side,c.body,.4)],[.25,mix(c.side,c.body,.8)],[.5,mix(c.side,c.body,.95)],[1,c.body]]:[[0,mix(c.side,c.body,.3)],[.5,c.side],[1,mix(c.side,c.body,.25)]],
      shade:light?mix(c.side,'#9a5a20',.4):mix(c.side,'#3a0a2a',.4),lite:'#fff4e0',rim:light?mix(c.side,'#ffffff',.2):mix(c.side,'#2a0a1a',.18),vein:c.sideV||mix(c.side,c.dot,.55)},
    /* the mid-lobe: lipB a yellow band at its foot fading to the lip's colour (photograph 3's white) */
    mid={st:c.lipB?[[0,mix(c.cal,c.lipB,.5)],[.12,c.lipB],[.38,mix(c.lipB,c.lip,.6)],[.7,c.lip],[1,mix(c.lip,'#ffffff',.35)]]:(light?[[0,mix(c.lip,c.cal,.35)],[.25,c.lip],[.7,c.lip],[1,mix(c.lip,'#ffffff',.12)]]:[[0,mix(c.lip,'#fbe6ee',.6)],[.28,mix(c.lip,'#fbe6ee',.15)],[.5,c.lip],[1,mix(c.lip,'#2a0a1a',.1)]]),shade:mix(c.lip,'#2a0a1a',.5),lite:light?'#fff0f0':mix(c.lip,'#ffd8e8',.5),rim:mix(c.lip,'#ffffff',.2)},
    /* the sepals: their own measured colour when given (dorsal, lateral mixed in toward the tip), the petals' ramp otherwise */
    sepR=c.sep?Object.assign({},per,{st:[[0,mix(base,c.sep,.55)],[.3,c.sep],[.7,c.sep],[1,mix(c.sep,tip,.3)]]}):per,
    /* (v3) the lateral sepals in their own measured colour (27: darker than the dorsal), the dorsal in its own */
    sepLR=c.sepL?Object.assign({},per,{st:[[0,mix(base,c.sepL,.6)],[.3,c.sepL],[.7,c.sepL],[1,mix(c.sepL,tip,.25)]],shade:light?per.shade:mix(c.sepL,'#2a0a26',.45)}):sepR,
    /* (v6: a banded colourway's rim in its band's colour: the rim, drawn last over the margin, made a pink line outside the light band, 3.6b) */
    pat={on:{sep:1,pet:1}};
  for(const k of['vein','spot','blot','band','eye'])if(c[k])pat[k]=c[k];
  /* every colourway: fine veins along sepals and petals (photographs 3, 13, 27: faint, a shade of the body), standing out as it fades */
  /* (v3: the coloured ones show a fine net of darker veins over the whole blade, 27, 13; the whites barely, 3) */
  if(!pat.vein)pat.vein=light?{c:mix(c.body,'#a89070',.32),n:8,w:.0015,op:.16,faint:1}:{c:mix(c.body,'#3a0a2a',.25),n:24,w:.0016,op:.34,net:1.2,wob:.014,v0:.12,faint:1};
  /* the stem: green; tinged purple-brown under the coloured ones (photographs 13, 36: dark stems; 22, 25: green) - « à l'œil » */
  const dark=!light&&h2l(c.body)[1]>.35&&(h2l(c.body)[0]>280||h2l(c.body)[0]<20),stem=dark?['#2a2418','#4e4a2c','#7a7448','#c0b890']:['#26341a','#4a6232','#7c9658','#c4d4a0'];
  /* the column: white, its foot in the flower's colour on the coloured ones (photograph 27), the cap a warm white (3: pinkish cream) */
  /* the tissue per colourway (v3): on the coloured ones the lit ridges fainter (they paled the colour toward mauve) and the crystalline
     sparkle of the blade (« diamond dust », 27, 13); on the whites the sparkle unseen, the ridges kept */
  const tex=c.tex||(light?{wob:.018,net:.5}:{opL:.06,op:.1,wob:.016,net:.6,v0:.12,dust:{n:0,r:.0007,sl:.0012,op:.5,n2:260,r2:.0008,op2:.5,lk2:.85,cmp:1},grain:{s:.07,n:900,r:.0005,op:.34,lk:.42,dn:700,dk:.3,dop:.3,hsl:1}});
  return PHAL_MAT[id]={tex,sep:sepR,sepL:sepLR,pet:per,side,mid,pat,cal:c.cal,dot:c.dot,cir:c.cir||(light?mix(c.side,c.cal,.3):mix(c.lip,'#fbe0ec',.62)),col:mix(c.body,'#fbf7f0',light?.55:.78),colB:light?null:c.body,cap:light?'#f4e6d8':'#f8f2ea',ped:mix('#7c9658',c.body,.25),stem,cast:light?'#4a3a28':'#2a1024'}}
/* the fading of one colour (fane-inat 2, 3, 6, 7 ; brief 4): a white turns ivory, flushed pink-beige, then papery beige-brown; a pink or a purple
   dulls toward mauve, then brownish; a yellow to ochre then brown; a wine darkens toward brown; the greens yellow */
function phalWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);let o;
  /* (v2, fane-inat 9, 10: the declining white stays an ivory flushed pink with its veins; tan only once shrivelled) */
  if(l>.8&&s<.5){o=mix(c,'#f2e8d6',Math.min(1,w*1.6));if(w>.3)o=mix(o,'#e6cbbd',Math.min(.55,(w-.3)*1.4));if(w>.62)o=mix(o,'#bf9f80',(w-.62)/.38*.75)}
  else if(h>=40&&h<75){o=mix(c,'#c49a3a',Math.min(1,w*1.2));if(w>.6)o=mix(o,'#8a6a3a',(w-.6)/.4*.7)}
  else if(h>=75&&h<170){o=mix(c,'#c8b860',Math.min(1,w*1.3));if(w>.6)o=mix(o,'#8a7a40',(w-.6)/.4*.7)}
  /* (v5: a red (vin, h 356, L .5) turns wine then brick-brown, never the pinks' mauve: BONNES-PRATIQUES 6.4) */
  else if((h<20||h>=345)&&(l<.45||l<.62&&s>.4)){o=l2h(h<20?h+5*w:h,s*(1-.45*w),l*(1-.25*w));if(w>.6)o=mix(o,'#4a2a20',(w-.6)/.4*.6)}
  else if(h>=250||h<20){const ht=h<20?h+360:h;o=l2h((ht+(330-ht)*.35*w)%360,s*(1-.55*w),l+(.62-l)*.25*w);if(w>.55)o=mix(o,'#9a7068',(w-.55)/.45*.45)}
  else o=typeof lifeCol==='function'?lifeCol(c,w):c;return o}
/* genes of one flower (8 pieces: dorsal sepal, lateral sepals, petals, side lobes, mid-lobe) */
const PHAL_GENES={n:[[8,1]],tep:{dL:[.95,1.05],dW:[.94,1.06],dphi:[-4,4],da0:[-3,3],da1:[-4,4],tw:[-.08,.08],wph:[0,6.28],tip:[.9,1.1],asym:[-.04,.04],cup:[-.03,.03],wk:[0,.8],hang:[0,1],sd:'sd'},
  late:{},head:{op:[-.03,.03],dh:[-3,3],ds:[-.05,.05],dl:[-.015,.015],sd:'sd'}};
/* the sort's sheet */
/* the standard hybrid's proportions (kept 27, 13, 3, 29: photo against render): the petals dominate, broad and rounded, nearly level, over
   the dorsal sepal's sides; the dorsal smaller; the lateral sepals tucked down under the petals and the lip; the lip about a third of the
   flower across: side lobes erect beside the column, the mid-lobe a broad diamond under the callus */
/* (v2, the lip and the column against photographs 3, 27, 29 at 1280 px, R0 = half the span: the anther cap .06 under the centre, .12 across; the
   side lobes from the callus (-.27) up to the centre's level, out to .28, their tips curled in over the column to .2; the callus a yellow plate
   .14 x .14 forked in two horns at its top, spotted red; the mid-lobe from -.3 to -.53, broadest at its foot, narrowing like an anchor to two
   cirri curling out; the tissue: fine translucent veins, a satin sheen) */
/* lod 2: the shop draws the flowers in full detail too (porteur 2026-10-17: « le poids je m'en fiche, je veux la meilleure qualité ») */
/* the wilt (v2, fane-inat 3, 9, 10): the pieces fold forward like a closing hand and hang limp, never a ball; the colour turns later */
/* (v4, f03, f10, c8: smooth margins rolled back softly, never torn paper: the crumple and the waves low, the pieces thinner and hanging from the
   pedicel; the dorsal sepal a rounded hood, half folded) */
const PHAL_S={genes:s=>{const g=svGenes(s,PHAL_GENES);g.pc=g.tep;return g},mat:phalMat,wilt:phalWiltCol,tip:[.2,.7],budTip:.5,budPt:.28,budR:.43,lod:2,wClose:[8,26],wLimp:[.3,.9],wFold:[10,40],wCrk:[.008,.025],wWav:[.12,.3],wShrink:[.06,.46],wCol:[.22,.6],
  pk:{ds:{L:.86,W:.6,a0:[30,84],a1:[40,96],closeK:1.4,limpK:.9,tip:2,cup:.2,twist:12,foldK:.8,curlF:.25,aPow:1.6},ls:{mat:'sepL',at:[.025,-.02,-.058],L:.86,W:.56,phi:-43,tip:2.1,cup:.22,twist:22,revF:.4,a0:[30,84],a1:[40,97]},pt:{L:1.06,W:1.14,phi:13,cup:.13,budLag:.04,a0:[28,82],a1:[22,94],revF:.5,limpK:1,prof:[[0,.08],[.12,.28],[.3,.7],[.48,.93],[.62,1]],vb:.62,tip:2.1},
    sl:{budLag:.08,at:[.145,-.37,.1],phi:80,a0:[10,72],a1:[0,50],roll:-46,cup:.75,hook:12,hookV:.55,curl:.12,prof:[[0,.38],[.3,.92],[.5,1]],vb:.5,tip:1.15,L:.6,W:.92,wU:.5},
    ml:{budLag:.08,at:[0,-.35,.08],L:.53,W:.95,a0:[10,48],a1:[0,72],prof:[[0,.3],[.2,.5],[.45,1],[.75,.6],[1,.2]],vb:.85,tip:1.5,cup:.24}},
  col:{at:[0,.02,-.02],L:.28,R:.036,Rt:.055,fl:1.1,bend:.3,a:8,cap:.064,capL:.056,capH:.72,wing:.022,beak:.05,stig:.5,zb:.06},
  /* (v5, 27 at the same R0: a small orange crest, forked at its top in two rounded horns beside the column's foot, narrowing down to a stalk on the
     mid-lobe's foot; freckled and streaked red so it reads orange-red, a darker furrow down its middle; never a yellow plate) */
  cal:{at:[0,-.262,.11],w:.078,h:.18,z:.04,n:1,notch:.26,nu:.3,sl:0,tilt:22,prof:[[0,.42],[.3,.62],[.55,.8],[.8,.94],[1,1]],gn:[12,10],dots:72,dw:.0036,dl:.07,dop:1,
    mot:[40,1.7,.92,.08],fur:[.8,1.6],foot:.76,footV:.46,topL:.12,shC:'#7a1a10',shK:.42},
  sideV:{u:[-.62,-.4,-.18,.04,.26,.48],len:[.26,.36,.42,.42,.34,.24],w:.0026,op:.6},
  cir:{L:.2,w:.012,curl:.75,at:.97,u:.22,dir:.75,zk:.25},
  /* the spray (c7, c3, c6): the flowers turned either way in three-quarter view, a fifth near profile, tilted down and leaning back where the arch descends */
  /* (v3, « terne et pauvre »: the light deeper and franker, the cast shadow of a petal on a sepal, of the lip on the petals, crisper) */
  hideB:-.3,ao:[.5,.42,.2,.32],light:Object.assign({},SVOR_DEF.light,{dark:[.94,.85,.75,.65,.55],da:.22,lit:[1.05,1.12,1.2],la:.2,ks:.14,gloss:16}),cast:{so:.4,sd:.018,sb:.01},
  /* (v4, c7: 8 to 12 flowers close and overlapped, 3 or 4 of them turned away showing their backs where the spray crests; none wholly edge-on:
     zMax; the sepals twisted and cupped, their tips round: seen from the side a spoon, never a thorn, c1, c4) */
  /* (v3, c7: the arch turns on until its tip points down; harc keeps the bouquet's head arch as before: .7 x 117.5 = .58 x 142.5) */
    /* (v5, relecture « paquet, fantômes » against c7: the flowers follow one another along the arch, each readable, their centres .8 to .9 of a
     flower apart, overlapping by their margins only; their pedicels alternate either side of the rachis; turned nearly to the front with
     moderate yaws, a few marked three-quarters; one or two turned away, in the reverse's colour) */
  scape:{n:[8,10],arc:[130,155],harc:.58,parc:[165,185],pcurv:.5,pli:[.74,.84],alt:.3,altN:.2,faceE:.7,yawAbs:1,yaw:[8,32],prof:.16,yawP:50,pitch:22,pitchJ:9,rollK:28,rollJ:10,back:[.18,.2,.85],zMax:66,pedU:1,lb0:2.2},
  tex:{n:24,w:.0012,op:.16,opL:.24,k:.4,lk:.7,du:.025,net:.15,fine:.5,sat:.05,satW:.04}};
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function phalLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'phalaenopsis',rec:{}})):0}
/* one flower (the sheets' grid and the generic pages) */
function phalSvg(par,B,O,D,cwId,op,seed,wl){const cwx=(typeof CW_PHAL!=='undefined'&&CW_PHAL.find(x=>x.id===cwId))||{id:cwId,c:'#f7f4ee'},W0=typeof WILT!=='undefined'?WILT:null;
  try{if(W0)WILT=null;return svorFlower(par,B,O,D,PHAL_S,cwx,op,seed,wl==null?phalLife():wl)}finally{if(W0)WILT=W0}}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['phalaenopsis']=phalSvg;
if(typeof GHI!=='undefined'&&GHI['phalaenopsis'])GHI['phalaenopsis'].wilt=phalWiltCol;
/* the old drawing's flower (phalFlower, s1c.js: the bouquets' old sprays, the rim heads): the same draws of chance (13 R if op > .3, else 10), then this flower */
function phalSvPut(par,B,O,D,cw,op){const n=op>.3?13:10;let a=0;for(let i=0;i<n;i++)a+=R(0,1);
  if(typeof SVDBG!=='undefined'&&SVDBG)SVDBG.push({p:'put',cw:cw.id,D:Math.round(D),O:O.slice(0,2).map(Math.round)});
  const sd=svSeed('phalaenopsis',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8));return phalSvg(par,B,O,D,cw.id,op,sd,phalLife())}
/* the plant (orchidPlant, r3a.js): the scape drawn by the kit along the old peduncle (the bouquet's neck unchanged). The bouquet places a head by
   its box (c5.js raises and draws again a head whose box dips below the rim, each drawing drawing the bouquet's chance; its masks are cut to the
   box): there the old drawing is made (its own chance), measured and removed, an empty rect keeps its box, and the scape is fitted inside it
   (svorScape o.room). Elsewhere the old chance is drawn by count: 3 for each flower's frame, 13 or 10 for each flower. */
function phalSvPlant(k,t,o,P,x){const{res,apex,op,cw,D,face,up,sd}=x,bq=typeof NECK_X!=='undefined'&&NECK_X;let par=k,room=null;
  if(bq&&x.old){const tmp=G(k),E0=EXT,S0=SV_ON;EXT=[];SV_ON=false;let b=null;try{x.old(tmp);b=tmp.getBBox()}finally{tmp.remove();EXT=E0;SV_ON=S0}
    E('rect',{x:b.x,y:b.y,width:b.width,height:b.height,fill:'none',stroke:'none'},k);room=[b.x,b.x+b.width,-(b.y+b.height),-b.y]}
  else{let nK=0;for(const og of res.organs)if(og.t==='K')nK++;const per=3+(op>.3?13:10);for(let i=0;i<nK*per;i++)R(0,1)}
  const c0=res.chains[0],ci=lsCut(res,apex),ped=c0.pts.slice(0,ci+1).map(q=>V3s(q,apex)),side=V3.nz(V3.cr(face,up)),
    seed=svSeed('phalaenopsis',cw.id,Math.round(ped[0][0]*4),Math.round(ped[0][1]*4),Math.round(D*8));
  const so={D,ped,up,face,sideV:V3.sc(side,sd),room,rach:c0.pts.slice(ci).map(q=>V3s(q,apex)),pw0:c0.ws[0]};
  /* in a bouquet: the head drawn, measured, drawn again smaller if it goes out of the old box (its peduncle, in the bouquet's stems layer, is drawn once) */
  let sc=null;for(let it=0;it<3;it++){const ex=[];so.defer=bq&&EXT?fn=>ex.push(fn):null;sc=svorScape(par,PHAL_S,cw,op,seed,phalLife(o),so);if(!room)break;
    const b=sc.k.getBBox(),w=room[1]-room[0],h=room[3]-room[2],q=Math.min(1,w/Math.max(1e-6,b.width),h/Math.max(1e-6,b.height),
      (b.x+b.width>room[1]+.5||b.x<room[0]-.5||-b.y>room[3]+.5||-(b.y+b.height)<room[2]-.5)?.92:1);
    if(q>=1||it===2){if(EXT)EXT.push(...ex);break}sc.k.remove();so.fitK=(so.fitG||1)*q*.98}
  /* the bouquet's stem goes on below the cut peduncle in its colours (its width is the old neck's: c0.ws[0]) */
  if(typeof SVDBG!=='undefined'&&SVDBG)SVDBG.push({p:'plant',cw:cw.id,D:Math.round(D),room:room&&room.map(Math.round),fitG:so.fitG&&+so.fitG.toFixed(2),bb:(b=>[b.x,b.y,b.width,b.height].map(Math.round))(sc.k.getBBox()),el:sc.k.querySelectorAll('*').length,kb:Math.round(new XMLSerializer().serializeToString(sc.k).length/102.4)/10});
  open(k,t,1000,10,.3);const r=lsNeck(res,[0,0,0],apex);r.ncols=sc.cols;return r}
if(typeof ORP!=='undefined'&&ORP.phalaenopsis)ORP.phalaenopsis.sv=phalSvPlant;
