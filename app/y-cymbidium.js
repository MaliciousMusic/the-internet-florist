/* ================= y-cymbidium.js : le cymbidium à grandes fleurs (Cymbidium hybrides), une hampe coupée en vase, sur le kit y3-orchidee.js =================
   References: refcache/cymbidium-grandes-fleurs/brief.md (24 kept photographs, kept.jpg), coloris.md (measured by hand), recensement.md. Never a
   pot, a pseudobulb, a root or a leaf: the spike is cut and stands in the vase. « hypothèse »: no photograph of a fading cymbidium (fane-inat.jpg
   shows plants in the wild), no back view, one profile (122). */
/* the colours of the colourways (CW_CYMB, s1d.js; ids, order and c never change; the late:14 ones are appended below). Measured by hand on the
   photographs (coloris.md, 2026-10-17): body (the petal's median), base (at the claw), tip (the edge), sep / sepL (dorsal / lateral sepals), lip
   (the mid-lobe's ground), side (the side lobes), sideV (their stripes), dot (the lip's spots, n: their density x 100), cal (the two ridges of the
   callus), col / colDot (the column, its spots), lipB (the lip's coloured margin), vein / band / eye (the tepals' patterns). Lightness lifted where
   the photographs are under-exposed (hue and chroma kept: « clarté libre »); whites and ivories kept healthy (the photographs' grey is their
   light); src = colourway number, level, the measure. */
const CYMB_CW={
  'blanc':{body:'#f6f6f1',base:'#e9eedb',tip:'#f9f9f6',sep:'#f3f4ef',sepL:'#ecede6',lip:'#f6f2f0',side:'#f2ecea',sideV:'#b04050',dot:'#9a1c32',n:30,thr:.4,thrC:'#ecc838',spN:3.2,mkN:.35,cal:'#eadd5a',col:'#f4efe2',colDot:'#a02a3a',src:'1421 B : blanc, labelle blanc peu taché, callosité jaune'},
  'ivoire':{body:'#efe9d6',base:'#e8e6c8',tip:'#f3eedf',sep:'#ecebe2',sepL:'#e3e1d1',lip:'#f3f1f2',side:'#eee4dc',sideV:'#a0384a',dot:'#6a1424',n:54,thr:.6,cal:'#f0d9a1',col:'#ecdcc4',colDot:'#8a2a3a',src:'1422 B : ivoire, labelle blanc piqué de bordeaux'},
  'creme-rose':{body:'#eedcc2',base:'#ecdcb0',tip:'#f2e2cc',sep:'#efdcbc',sepL:'#e5cc9c',lip:'#e1879e',side:'#dca596',sideV:'#9a4a4a',dot:'#8a4440',n:64,cal:'#efcf5e',col:'#efdcb8',colDot:'#a04450',lipB:'#f2d6da',src:'1423 B : crème, labelle rose dense'},
  'blanc-rouge':{body:'#f8f7f2',base:'#efe5e8',tip:'#fafaf7',sep:'#f4f5f2',sepL:'#eff1ee',lip:'#e0b0ba',side:'#d27aa8',sideV:'#7a1830',dot:'#72182e',n:51,cal:'#efcf4a',col:'#f0d6c6',colDot:'#a02a3a',src:'1424 B : blanc, labelle rose-rouge très taché'},
  'vert-pomme':{body:'#cfcb78',base:'#c4c464',tip:'#d6d48a',sep:'#d6d55a',sepL:'#b8c25a',lip:'#ebe2a8',side:'#cfc596',sideV:'#9a7a36',dot:'#9a7a36',n:37,cal:'#efcf48',col:'#ecebc4',colDot:'#9a6a30',src:'1425 B : vert-jaune, labelle crème piqué d\'ocre'},
  'vert-menthe':{body:'#cddc98',base:'#c2d488',tip:'#d4e0a2',sep:'#d4dc84',sepL:'#c6d47c',lip:'#f4eedc',side:'#e6e2b4',sideV:'#8a2a28',dot:'#8a1a26',n:58,thrC:'#e8c848',spN:1.6,cal:'#efcf48',col:'#d6dc8a',cap:'#f8f6e8',colDot:'#7a1a20',src:'1426 B : vert tendre jaunâtre (mesure), labelle crème piqué de rouge'},
  'jaune':{body:'#dcbf48',base:'#d4b840',tip:'#e0c658',sep:'#dccb58',sepL:'#ddcb5a',lip:'#ecc882',side:'#dcb04a',sideV:'#9e4433',dot:'#9e4433',n:58,cal:'#f0c040',col:'#eec94a',colDot:'#a04a30',src:'1427 B : jaune, labelle jaune taché brun-rouge'},
  'rose-pale':{body:'#efe7ee',base:'#efdfe6',tip:'#ebe0e4',sep:'#ebdcdc',sepL:'#e8e4f0',lip:'#ecc8c6',side:'#e8c4c0',sideV:'#974c66',dot:'#974c66',n:42,cal:'#efcf4a',col:'#ecd4ca',colDot:'#a0506a',src:'1428 B : blanc à peine rose-lilas (mesure), labelle rose piqué'},
  'rose':{body:'#dca8bc',base:'#e4bcca',tip:'#e2b4c4',sep:'#ecd6e2',sepL:'#dca6c8',lip:'#e8b0be',side:'#e2a4b4',sideV:'#7a2a3a',dot:'#641b2b',n:45,cal:'#efcf4a',col:'#efd8be',colDot:'#8a2a40',vein:{c:'#c27894',n:12,w:.0022,op:.35},src:'1429 B : rose mauve, labelle rose piqué de bordeaux'},
  'saumon':{body:'#e6a486',base:'#eab494',tip:'#e29a90',sep:'#e8ae9a',sepL:'#dcab92',lip:'#e2ab80',side:'#dea07c',sideV:'#7a1a14',dot:'#6d0f0b',n:51,cal:'#efc040',col:'#efd0b0',colDot:'#8a2a1a',vein:{c:'#c47a64',n:12,w:.0022,op:.4},src:'1430 B : saumon, labelle abricot taché rouge sang'},
  'orange':{body:'#c87a62',base:'#d09068',tip:'#c27866',sep:'#c47a4c',sepL:'#c07a6c',lip:'#e0b878',side:'#d8a868',sideV:'#823810',dot:'#823810',n:37,cal:'#efb838',col:'#e8c49a',colDot:'#8a3a14',vein:{c:'#a85a40',n:14,w:.0024,op:.45},src:'1431 B : orange bronze, labelle jaune-ocre taché brun'},
  'caramel':{body:'#d8925a',base:'#f2c672',tip:'#d08a52',sep:'#de9e5e',sepL:'#d09050',eye:{c:'#f0c878',e:'#e4a85e',v:.4,w:.45,op:.7},band:{c:'#f2d8a8',w:.005,v0:.08,op:.7,edge:1,glow:4},lip:'#f6ead2',side:'#e6b450',sideV:'#8a3418',dot:'#9a2a14',n:58,lipB:'#e0a838',thrC:'#e8b848',cal:'#efc040',col:'#eab84c',colDot:'#8a3a1a',vein:{c:'#c03e22',n:24,w:.003,op:.72},src:'1432 C : orangé caramel strié de rouge (décision 2026-10-17 : t045 Valley Picture « Temptation », variété du SKU, = c98 ; mesure c98 tépales q50 #b4734b, ombre #9c693c, lumière #deb07c, pied #eecb98 ; la médiane #a89222 venait surtout des 3 photos Goldenrod, jaune doré proche de 1427), labelle crème piqué de rouge'},
  'rouge':{body:'#d6606a',base:'#eeb4b2',tip:'#bc4a56',sep:'#d86872',sepL:'#c25258',eye:{c:'#f4cfcb',e:'#e8a2a4',v:.5,w:.5,op:.85},band:{c:'#f6d2d0',w:.0035,v0:.06,op:.8,edge:1,glow:4},
    mark:{c:'#8e1a34',n:24,r:[.003,.009],len:[.008,.03],gap:[.008,.03],band:[.16,1],clear:.018,v0:.2,bar:.04,jit:.03,cv:.01,blot:.35,op:.8},lip:'#f8eee6',side:'#ecc8c6',sideN:2.4,sideR:1.5,sideV:'#5a1020',dot:'#4a0a18',n:67,lipB:'#6a1424',lipBw:.022,thrC:'#e8c040',cal:'#efc040',col:'#f2e6d6',colDot:'#7a2a24',vein:{c:'#a8344a',n:14,w:.0024,op:.4},src:'1433 B : rouge corail, labelle crème très taché'},
  'bordeaux':{body:'#a1304c',base:'#b04458',tip:'#aa3a48',sep:'#ac445e',sepL:'#b43e47',lip:'#f6e9da',side:'#ecd2c4',sideV:'#761422',dot:'#761422',n:42,cal:'#efc040',col:'#e8c8c0',colDot:'#761422',lipB:'#b8304a',src:'1434 B : bordeaux, labelle blanc taché et bordé de bordeaux'},
  'brun':{body:'#aa4c3a',base:'#b45c44',tip:'#8a3e2e',sep:'#be6346',sepL:'#934830',lip:'#4a1c14',side:'#5a2a1c',sideV:'#2a0c08',dot:'#1e0806',n:83,cal:'#e0b040',col:'#d8b08a',colDot:'#4a1a10',vein:{c:'#7a2a1e',n:14,w:.0024,op:.45},src:'1435 B : brun rouge, labelle brun très sombre'},
  'noir':{body:'#9a3446',base:'#a84452',tip:'#8a2c3e',sep:'#9a2c42',sepL:'#7a1424',lip:'#e2d6ce',side:'#d8c4bc',sideV:'#671f24',dot:'#671f24',n:43,cal:'#eeb438',col:'#e0c4bc',colDot:'#671f24',lipB:'#8a2a3a',src:'1436 C : pourpre-rouge foncé (mesure), labelle blanc piqué de bordeaux'},
  /* late:14 (the colourways the census adds, all at the end: no SKU number moves; level C: one to three photographs of one author) */
  'vert-olive':{body:'#a8b864',base:'#9cae58',tip:'#a8aa52',sep:'#8e8a52',sepL:'#86a050',lip:'#d0b07a',side:'#c4a46c',sideV:'#5f4533',dot:'#5f4533',n:56,cal:'#e8cd65',col:'#ecd884',colDot:'#6a4a30',src:'late:14 C (Peter Pan) : vert olive, labelle crème taché brun'},
  'fuchsia':{body:'#dd4e79',base:'#e4688c',tip:'#d4507a',sep:'#c8284e',sepL:'#b42a52',lip:'#8a1424',side:'#9a2234',sideV:'#4a0010',dot:'#5a0010',n:77,cal:'#e8c040',col:'#e8b8c0',colDot:'#6a0a1a',lipB:'#e0bab9',band:{c:'#f2dde4',w:.007,v0:.12,op:.6},src:'late:14 C (Rolf Bolin) : fuchsia à liseré blanc, labelle bordeaux sombre'},
  'cafe-au-lait':{body:'#bd927e',base:'#c8a490',tip:'#c4a38d',sep:'#bb9388',sepL:'#b08c70',lip:'#f0dcd8',side:'#e8ccc4',sideV:'#7e3642',dot:'#7e3642',n:30,cal:'#ecd070',col:'#eff2bb',colDot:'#7e3642',vein:{c:'#94564e',n:16,w:.003,op:.6,net:.15},src:'late:14 C (Cafe Au Lait) : brun rosé veiné, labelle blanc rosé piqué de bordeaux'},
  'chartreuse-picote':{body:'#c4be52',base:'#bcb848',tip:'#c8c26a',sep:'#c4c03a',sepL:'#c6c464',lip:'#f2e4e4',side:'#ecd6d6',sideV:'#6e2f26',dot:'#6e2f26',n:29,cal:'#ecd060',col:'#eaf2ac',colDot:'#6e2f26',src:'late:14 C (Debbie Adams) : vert chartreuse, labelle blanc picoté de bordeaux'},
  'vert-labelle-bordeaux':{body:'#c4c078',base:'#bab468',tip:'#b8a648',sep:'#e6deb9',sepL:'#d8d0a4',lip:'#5a1a0a',side:'#6a2410',sideV:'#260101',dot:'#2a0402',n:61,cal:'#e0c040',col:'#e8e0b0',colDot:'#4a1008',lipB:'#c8a040',src:'late:14 C (Drusilla) : vert tendre, labelle bordeaux liseré jaune'},
  'moutarde':{body:'#cccf8a',base:'#c4c070',tip:'#b4a040',sep:'#bfa858',sepL:'#c8b48c',lip:'#d97a92',side:'#d88aa0',sideV:'#a84060',dot:'#b84a68',n:49,cal:'#f0d050',col:'#f8f69e',colDot:'#b84a68',src:'late:14 C (French Mustard) : jaune moutarde, labelle rose rouge'}};
if(typeof CW_CYMB!=='undefined'&&!CW_CYMB.some(x=>x.id==='vert-olive'))CW_CYMB.push(
 {id:'vert-olive',n:'Vert olive (Peter Pan)',c:'#a8b864',lip:'#d0b07a',dots:'#5f4533',cal:'#e8cd65',col:'#ecd884',late:14},
 {id:'fuchsia',n:'Fuchsia à labelle bordeaux (Rolf Bolin)',c:'#dd4e79',lip:'#8a1424',dots:'#5a0010',cal:'#e8c040',col:'#e8b8c0',solid:1,late:14},
 {id:'cafe-au-lait',n:'Brun café au lait veiné (Cafe Au Lait)',c:'#bd927e',vein:'#94564e',lip:'#f0dcd8',dots:'#7e3642',cal:'#ecd070',col:'#eff2bb',late:14},
 {id:'chartreuse-picote',n:'Chartreuse à labelle picoté (Debbie Adams)',c:'#c4be52',lip:'#f2e4e4',dots:'#6e2f26',cal:'#ecd060',col:'#eaf2ac',late:14},
 {id:'vert-labelle-bordeaux',n:'Vert tendre à labelle bordeaux (Drusilla)',c:'#c4c078',lip:'#5a1a0a',dots:'#2a0402',cal:'#e0c040',col:'#e8e0b0',solid:1,late:14},
 {id:'moutarde',n:'Jaune moutarde à labelle rose (French Mustard)',c:'#cccf8a',lip:'#d97a92',dots:'#b84a68',cal:'#f0d050',col:'#f8f69e',late:14});
/* the material of a colourway: ramps by kind for the kit (svorMatOf), cached by id; the lip's own patterns (patK): the mid-lobe's spots, densest
   toward its foot (photographs 29, 46, 98, 84) and its coloured margin; the side lobes' stripes converging to their tips (84, 98) */
const CYMB_MAT={};
function cymbMat(cwx){const id=cwx&&cwx.id;if(CYMB_MAT[id])return CYMB_MAT[id];
  const c=CYMB_CW[id]||{body:(cwx&&cwx.c)||'#f6f6f1',lip:(cwx&&cwx.lip)||'#f4eef0',side:(cwx&&cwx.lip)||'#f0e6e4',dot:(cwx&&cwx.dots)||'#8a2a3a',n:40,cal:(cwx&&cwx.cal)||'#eadd5a',col:(cwx&&cwx.col)||'#f3ecd8'};
  const base=c.base||c.body,tip=c.tip||c.body,back=c.back||mix(c.body,'#ffffff',.18),L=h2l(c.body)[2],light=L>.8,
    /* waxy: a firm shade of the body itself, warm on the pale ones (never grey), the back a little paler and greener at the foot */
    shade=light?mix(c.body,'#9a8a62',.45):mix(c.body,'#2a1410',.4),bshade=light?mix(back,'#a89a74',.4):mix(back,'#3a2018',.36),
    per={st:[[0,base],[.3,mix(base,c.body,.7)],[.6,c.body],[1,tip]],bst:[[0,mix(back,'#b8c890',.3)],[.3,back],[1,mix(back,tip,.4)]],shade,lite:'#fffdf4',bshade,blite:'#fffdf4',rim:light?mix(c.body,'#c8b890',.25):mix(c.body,'#ffffff',.18)},
    sepR=Object.assign({},per,{st:[[0,mix(base,c.sep||c.body,.5)],[.35,c.sep||c.body],[.75,c.sepL?mix(c.sep||c.body,c.sepL,.5):(c.sep||c.body)],[1,mix(c.sepL||c.sep||c.body,tip,.3)]]}),
    lipL=h2l(c.lip)[2],hl=h2l(c.side)[0],red=(hl<25||hl>290)&&!c.thr,dk=mix(c.dot,'#1a0408',.35),T=c.thr??1,
    /* (v2-4, c84: the column's ventral face and the throat deep crimson in the lip's tube (median #441213, lit #7f3641), densely streaked; the
       anther cap a mauve hood, cream inside, two yellow pollinia under its front; a pale column, streaked, on the green, yellow and caramel ones) */
    colF=c.colF||mix(c.col,c.colDot||c.dot,.06),
    side={st:[[0,mix(c.side,dk,.5*T)],[.3,mix(c.side,dk,.15*T)],[.55,c.side],[1,mix(c.side,'#fbf0f2',.55)]],shade:mix(c.side,lipL>.6?'#7a3a18':'#2a0a10',.26),lite:'#fffaf0',rim:mix(c.side,'#ffffff',.5),vein:c.sideV||mix(c.side,c.dot,.6)},
    mid={st:c.thrC?[[0,mix(c.thrC,dk,.4)],[.2,c.thrC],[.34,mix(c.thrC,c.lip,.5)],[.46,c.lip],[.75,c.lip],[1,c.lipB?mix(c.lip,c.lipB,.6):mix(c.lip,'#ffffff',.08)]]:[[0,mix(c.side,dk,.66*T)],[.2,mix(c.side,dk,.36*T)],[.34,mix(c.side,c.lip,.6)],[.46,c.lip],[.75,c.lip],[1,c.lipB?mix(c.lip,c.lipB,.6):mix(c.lip,'#ffffff',.08)]],shade:mix(c.lip,'#2a0a10',lipL>.6?.32:.45),lite:'#fffaf4',rim:mix(c.lip,c.lipB||'#ffffff',.25)},
    pat={on:{sep:1,pet:1}},n=c.n||40;
  for(const k of['vein','band','eye','mark'])if(c[k])pat[k]=c[k];
  /* (v3, 4.8e: the thin margin lit as if from behind, a fine paler edge with a soft inner glow, on every colourway without its own band) */
  if(!pat.band)pat.band={c:mix(c.tip||c.body,'#ffffff',light?.5:.42),w:.003,v0:.08,op:light?.5:.6,edge:1,glow:4};
  /* (v2, 4.8b against c98, c16: the striations dense and plain at a glance, never a faint hatching) */
  if(c.vein)pat.vein=Object.assign({},c.vein,{n:Math.round(c.vein.n*1.7),op:Math.min(.85,c.vein.op*1.35)});
  /* every colourway: fine veins along the tepals (photographs 16, 29, 98: a shade of the body), standing out as it fades */
  if(!pat.vein)pat.vein={c:light?mix(c.body,'#a89070',.32):mix(c.body,'#3a0a14',.3),n:22,w:.0018,op:light?.22:.42,faint:1};
  /* (v2, c84, c98, c16: the mid-lobe's spots blotches and dashes of uneven size crowding toward its margin round a paler middle, a red line down its midrib) */
  const patK={side:{spot:{c:c.dot,n:Math.round((8+n*1.1)*(c.sideN||1)),r:[.003*(c.sideR||1),.009*(c.sideR||1)],v:[.2,.97],op:.9,k:.6,ring:.75,el:1.8}},mid:{spot:{c:c.dot,n:Math.round((10+n*.4)*(c.spN||1)),r:[.003,.006],v:[.04,.3],op:.85,k:1,ring:.5,el:1.4},
    mark:{c:c.dot,n:Math.round(22*(c.mkN??1)),r:[.004,.012],len:[.02,.09],gap:[.02,.06],band:[.08,.2+.2*n/100],clear:.07,mid:.04+.2*n/100,bar:.12,jit:.04,cv:.04,blot:.16,com:.22,v0:.14,op:.95},stripe:{c:c.dot,w:.007,op:.8,v:[.02,.62]}}};
  /* (c84, c16: a paler margin round the mid-lobe when it has no coloured one) */
  if(c.lipB)patK.side.band={c:c.lipB,w:.008,v0:.35,op:.75,edge:1,glow:2};
  patK.mid.band=c.lipB?{c:c.lipB,w:c.lipBw||.012,v0:.25,op:.85}:{c:mix(c.lip,'#fffaf6',.6),w:.012,v0:.3,op:.7};
  /* the spike: green, flushed brown-purple under the dark ones (photographs 28, 105) - « à l'œil » */
  const dark=!light&&L<.55&&(h2l(c.body)[0]>300||h2l(c.body)[0]<30),stem=dark?['#2c2a18','#4e4e2c','#78764a','#bab48a']:['#2e3f22','#4f6534','#76884a','#b0bc80'];
  return CYMB_MAT[id]={sep:sepR,pet:per,side,mid,pat,patK,cal:mix(mix(c.cal,c.lip,.3),'#8a5a20',.3),col:colF,colDot:mix(c.colDot||c.dot,'#1a0206',red?.4:.2),colV:mix(c.col,c.colDot||c.dot,.5),colCav:c.thrC?mix(c.thrC,c.dot,.5):mix(mix(c.cal,c.col,.5),c.dot,.32),poll:null,cap:c.cap||mix(c.col,'#fffaf0',.4),stig:mix(colF,'#f6e8d0',.35),ped:mix('#7c9658',c.body,.22),stem,cast:light?'#4a3a28':'#2a1410'}}
/* the fading (« hypothèse », brief 4; no photograph): the tepals dull and thin, a white to ivory then beige-brown with darker veins, a green yellows
   to olive then brown, a pink to dusty mauve-brown, a red to wine then brown, a yellow to ochre; the lip flushes red (a cymbidium's lip reddens
   once its flower is spent), then browns */
function cymbWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);let o;
  if(l>.82&&s<.5){o=mix(c,'#efe2c4',Math.min(1,w*1.5));if(w>.45)o=mix(o,'#c8a878',(w-.45)/.55*.75)}
  else if(h>=38&&h<75){o=mix(c,'#c49a3a',Math.min(1,w*1.1));if(w>.55)o=mix(o,'#8a6a3a',(w-.55)/.45*.7)}
  else if(h>=75&&h<170){o=mix(c,'#c0b45a',Math.min(1,w*1.2));if(w>.55)o=mix(o,'#8a7440',(w-.55)/.45*.7)}
  else if((h<30||h>=340)&&l<.55){o=l2h(h<30?h+4*w:h,s*(1-.45*w),l*(1-.22*w));if(w>.55)o=mix(o,'#4a2a20',(w-.55)/.45*.6)}
  else{o=mix(c,'#b48478',Math.min(.7,w*.9));if(w>.55)o=mix(o,'#8a6450',(w-.55)/.45*.6)}return o}
function cymbLipWilt(c,w){if(w<=0||typeof c!=='string'||c.length!==7)return c;let o=mix(c,'#b82a3e',Math.min(.6,w*.9));if(w>.5)o=mix(o,'#6a2a22',(w-.5)/.5*.6);return o}
/* genes of one flower (8 pieces: dorsal sepal, lateral sepals, petals, side lobes, mid-lobe) */
const CYMB_GENES={n:[[8,1]],tep:{dL:[.95,1.05],dW:[.93,1.07],dphi:[-5,5],da0:[-4,4],da1:[-5,5],tw:[-.1,.1],wph:[0,6.28],tip:[.9,1.1],asym:[-.05,.05],cup:[-.03,.03],wk:[0,.8],hang:[0,1],sd:'sd'},
  late:{},head:{op:[-.03,.03],dh:[-3,3],ds:[-.05,.05],dl:[-.015,.015],sd:'sd'}};
/* (relais 2, pair with photograph 98: the tepals broad and blunt, W/L about .5 to .6, touching; the lip as broad as the gap between the lateral
   sepals: W .42 drew a star of narrow tepals and a small apron) */
/* the sort's sheet: the standard large-flowered hybrid (photographs 16, 29, 46, 98: face; 122: profile). Five waxy tepals of one form, narrow
   elliptic (W/L about .36), firm, the dorsal upright and hooding a little over the column, the petals up and out (about 25° over the level) and
   held a little forward, the lateral sepals down and out (about 40° under it); the lip: the side lobes erect round the column (a tube), the
   mid-lobe broad, rolled down and back, its margin waved, spotted; two yellow ridges (the callus) at its foot; the column long, arching over
   the lip, spotted under, its anther cap yellow */
const CYMB_TEP=[[0,.44],[.18,.8],[.45,.98],[1,1]];
const CYMB_S={genes:s=>{const g=svGenes(s,CYMB_GENES);g.pc=g.tep;return g},mat:cymbMat,wilt:cymbWiltCol,wiltK:{mid:cymbLipWilt,side:cymbLipWilt},tip:[.1,.4],
  /* the bud: round-ovoid, its tip blunt (photographs 66, 105: H/L about 1.25, about .4 of the open flower across); it stays round while it
     splits (bud [.3,.28]: at .4 the tepals only part at the tip, never a pointed tulip) */
  budS:[.28,.7,.32],budR:.4,bud:[.3,.28],lipBud:.78,budTip:1,innerBud:.62,greenC:'#a8b86a',
  /* (v2, « terne et pauvre »: a waxy tissue: deeper shading, a franker light and gloss, crisp cast shadows between pieces, fine striations and satin
     streaks (P.tex, c98, c46, c16); full detail in the shop too) */
  light:{wrap:.3,amb:.28,dif:.7,sky:.14,ks:.28,gloss:20,dark:[.94,.85,.75,.65,.55],da:.2,lit:[1.05,1.12,1.18],la:.2,darkLo:[.88,.72],daLo:.22,litLo:[1.1],laLo:.22,soft:.05},
  lod:2,cast:{so:.4,sd:.018,sb:.01},ao:[.45,.35,.2,.3],tex:{n:16,w:.0012,op:.12,opL:.18,k:.35,lk:.6,du:.02,net:0,fine:.4,sat:.06,satW:.035},
  pk:{ds:{L:.96,W:.7,a0:[8,72],a1:[4,84],prof:CYMB_TEP,vb:.6,tip:1.25,cup:.4,wav:.03,limpK:.4,curlF:.3},
    ls:{L:.95,W:.68,phi:-40,a0:[8,82],a1:[4,92],prof:CYMB_TEP,vb:.6,tip:1.2,cup:.34,wav:.03},
    pt:{L:.9,W:.68,phi:24,a0:[6,66],a1:[2,80],prof:[[0,.38],[.18,.76],[.45,.97],[1,1]],vb:.6,tip:1.3,cup:.34,wav:.035,limpK:.6},
    /* (v2, the lip against c16, c84, c98 at the same R0: the side lobes erect walls either side of the column, from the lip's foot (-.3) up past the
       anther cap (+.1), their inner faces toward the eye, their free tips turned out; the mid-lobe broad (.8 R0), from the tube's mouth down to
       -.85, rolled down and back, its margin waved) */
    sl:{at:[.13,-.42,.06],phi:84,L:.5,W:.64,a0:[10,62],a1:[0,50],roll:-50,hook:26,hookV:.5,cup:.55,rev:.46,curl:.36,wav:.05,wk:3,prof:[[0,.85],[.3,1],[.62,.97],[1,.85]],vb:.42,tip:2,aoU:[.9,-1,1]},
    ml:{at:[0,-.32,.02],L:.74,W:1.6,a0:[8,22],a1:[0,150],aPow:1.4,prof:[[0,.36],[.14,.72],[.32,.95],[.7,.97],[1,.75]],vb:.5,tip:1.8,cup:.06,wav:.15,wk:6,rev:.2,ruf:.09,rk:6,rkT:4}},
  /* the side lobes' stripes: fine, many, of unequal lengths, fading before the margin (photographs 84, 98; D 700: the four even bars read as a barcode) */
  sideV:{u:[-.78,-.64,-.5,-.37,-.24,-.11,.02,.15,.28,.41,.54,.67,.8],len:[.3,.44,.52,.6,.66,.7,.72,.7,.66,.6,.52,.42,.3],w:.003,op:.6},
  cal:{at:[0,-.38,.1],w:.03,h:.08,z:.022,n:2,gap:.068,notch:0,tilt:30,dots:10,dw:.004,foot:.5,footV:.45,topL:.05,shK:.55,prof:[[0,.5],[.3,.95],[.8,1],[1,.7]]},cir:null,
  /* (v2-5, c98 and c16 face on: the column short, seen foreshortened, lighter than c84's ventral face seen from under) (v2, c84: the column arched over the lip, rising then bending down, its tip the anther cap (cream, two yellow pollinia), its underside streaked red) */
  col:{at:[0,-.3,0],L:.38,R:.07,Rt:.12,fl:1.3,bend:1,a:-72,cap:.058,capL:.045,capH:.62,capF:1.6,capBall:1,capV:1,helm:{w:.92,l:1.1,h:1.1,up:.1,fwd:.15,full:1,sh:.38,cav:{gut:1,w:.92,tw:.6,i0:.05,dots:170,dw:.012}},wing:.02,beak:.04,stig:0,gl:.7,dots:0,stk:1,stkW:.003,stkL:[.015,.07],stkDot:.4,dotW:.009},
  /* the spike: stiff, upright to arching (kept 15, 22, 28, 37, 54, 86), 6 to 15 waxy flowers close together on long pedicels (the ovary), facing
     out all round, round-ovoid buds at the tip; stout (about .08 of the flower across) */
  scape:{n:[9,13],nb:[2,4],li:[.64,.8],liK:.22,lb:[.22,.13],arc:[15,55],lean:[4,12],pedLF:.45,curv:.75,kink:4,ped:.62,pedB:.2,pw:[.026,.038],grade:.12,
    span:.55,op0:.26,budOp:[.24,.06],sw:.075,swTip:.55,pnodes:[2,[.2,.65],.13],fb:.06,face:.5,alt:.14,hang:[.1,.2],droop:.7,stem:['#2e3f22','#4f6534','#76884a','#b0bc80'],
    /* (v2-5, model 12: the old box drew 4-7 flowers of ~20 px, smaller than their neighbours; fewer, larger waxy flowers in the same box) */
    hn:[3,5],hnb:[1,2],harc:.7,hfl:.68,
    /* the whole spike: the flower 9 to 12 cm across (brief 3; the old D drew 6) */
    pD:1.5,
    /* (v2, 8.1b against c28 and 54: the flowers spaced, alternately left and right on long pedicels leaving the rachis at about 45° up, each
       turned its own way about the front (some in marked three-quarter view, one near profile), never all facing us; from the scape's hash) */
    pli:[.38,.48],pedT:.7,altN:.62,faceE:.6,yawAbs:1,yaw:[28,60],prof:.3,yawP:66,pitchJ:8,rollJ:8,zMax:64,pedU:1}};
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function cymbLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'cymbidium-grandes-fleurs',rec:{}})):0}
/* one flower (the sheets' grid and the generic pages) */
function cymbSvg(par,B,O,D,cwId,op,seed,wl){const cwx=(typeof CW_CYMB!=='undefined'&&CW_CYMB.find(x=>x.id===cwId))||{id:cwId,c:'#f6f6f1'},W0=typeof WILT!=='undefined'?WILT:null;
  try{if(W0)WILT=null;return svorFlower(par,B,O,D,CYMB_S,cwx,op,seed,wl==null?cymbLife():wl)}finally{if(W0)WILT=W0}}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['cymbidium-grandes-fleurs']=cymbSvg;
if(typeof GHI!=='undefined'&&GHI['cymbidium-grandes-fleurs'])GHI['cymbidium-grandes-fleurs'].wilt=cymbWiltCol;
/* the old drawing's flower (cymbFlower, s1d.js, for the large-flowered colourways only: the bouquets' old sprays, the rim heads): the same draws
   of chance (13 R if op > .3, else 10: five tepals and three lip pieces, each R(-3,3) and petS's own), then this flower */
function cymbSvPut(par,B,O,D,cw,op){const n=op>.3?13:10;let a=0;for(let i=0;i<n;i++)a+=R(0,1);
  if(typeof SVDBG!=='undefined'&&SVDBG)SVDBG.push({p:'put',sid:'cymb',cw:cw.id,D:Math.round(D),O:O.slice(0,2).map(Math.round)});
  const sd=svSeed('cymbidium-grandes-fleurs',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8));return cymbSvg(par,B,O,D,cw.id,op,sd,cymbLife())}
/* the plant (orchidPlant, r3a.js): the kit's scape along the old peduncle (svorPlant, y3-orchidee.js) */
function cymbSvPlant(k,t,o,P,x){return svorPlant(k,t,o,P,x,CYMB_S,'cymbidium-grandes-fleurs',cymbLife(o))}
if(typeof ORP!=='undefined'&&ORP['cymbidium-grandes-fleurs'])ORP['cymbidium-grandes-fleurs'].sv=cymbSvPlant;
