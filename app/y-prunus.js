/* ================= Pilote : le genre Prunus en SVG natif (y-prunus.js) =================
   One module per genus, one sheet per sort. The Japanese flowering cherry, Sato-zakura group (Prunus serrulata): a cut branch of glossy chestnut wood
   barred with pale lenticels, short spurs crowded with bud-scale scars, and from each spur a hanging corymb of double flowers on long pedicels, with
   young leaves (bronze in 'Kanzan', 'Pink Perfection', 'Ukon'; bronze-green in 'Ichiyo'; fresh green in 'Shirotae'). Drawn with the generic pieces of
   y3-branche.js: svBlossom (the flower) and svBranch (the branch). Colourways in the catalogue's order (L55_SATO); one added later carries late:1.
   Measured on photographs (refcache/cerisier-du-japon-sato-zakura: brief.md, coloris.md, coloris-mesures.json; REFERENCES-section.md). */
const PRU_SID='cerisier-du-japon-sato-zakura';
/* the colourways, one entry each (to add one: an entry here with its flower type and late:1, its name in PRU_NAMES, and in L55_SATO of s55a.js
   {id,n,c,bud,lf,dbl,late:1}, so that the SKU numbers stay). type: a key of PRU_TYPE (the whorls, stamens, pistils of the flower); base (foot of the
   petals, front), body, tip, bud (outside of the bud), back (outside of the open petal), cal (calyx), ped (pedicel), fil, anth (stamens), pist,
   lf (young leaf), lf2 (grown leaf); optional: heart (the colour the inner whorls deepen to, else bud), age:{to,k,base,kb} (the cultivar's ageing:
   toward to by k, its base toward base by kb; else PRU_AGE0).
   base, body and tip: coloris2.md (second pass, in sun or neutral light, 2026-10-09), transcribed as measured; they prevail over coloris.md (overcast).
   The render darkens a median by its shading (wrap light, occlusion): mat() lifts every colourway alike by PRU_LIFT toward white (checked
   2026-10-09 with img.py ring on face views at op 1: tips within dE 1 to 2.5 of the measures for all five). bud, back: not measured (visual: Keele
   4002-03 deep pink buds; Kanzan buds deep rose, brief 108/131 #bf233a/#cd4856). Young leaves: bronze (Pink Perfection c007, Kanzan 196-203, Ukon
   iNat 346184137 russet), bronze-green (Ichiyo: photos disagree), green with a bronze touch (Shirotae: c022 Keele #4a5f27..#576b2c, Sirotae 17, 18). */
const PRU_LIFT=.1;
const PRU_COL={
  kanzan:{type:'kanzan',base:'#e2b3ba',body:'#e4b2b7',tip:'#e3adb5',bud:'#b02e50',back:'#d891a4',cal:'#6e3a28',ped:'#6e5a2c',fil:'#f0d8dc',anth:'#e2c060',pist:'#7a9e3c',lf:'#8c4a26',lf2:'#5e8a34',
    age:{to:'#b88aac',k:.45}},
  pink:{type:'double',base:'#e8bbd3',body:'#e6b5cd',tip:'#eebcd5',bud:'#cc5c86',back:'#e0a2c0',cal:'#6a5a2c',ped:'#86774a',fil:'#f4e8e2',anth:'#e8cc6a',pist:'#9ab050',lf:'#84502c',lf2:'#6e9a3c'},
  ichiyo:{type:'ichiyo',base:'#dacdc0',body:'#d7cec1',tip:'#d6cbbf',bud:'#dc84a0',back:'#dcbcc0',cal:'#6a6a30',ped:'#7a8a3a',fil:'#f4ece8',anth:'#e6c868',pist:'#8eaa48',lf:'#7a7436',lf2:'#62923a'},
  shirotae:{type:'semi',base:'#d1d1cc',body:'#d4d5d1',tip:'#d4d4d0',bud:'#eedad6',back:'#dcd4d2',cal:'#6a7a38',ped:'#7a8e3c',fil:'#f6f2e6',anth:'#e8c030',pist:'#a6b860',lf:'#8a9a48',lf2:'#5e9038',
    age:{to:'#efe6d2',k:.5}},
  ukon:{type:'semi',base:'#c7c19c',body:'#cac6a8',tip:'#cfcaae',bud:'#d0d09a',back:'#c4c8a0',cal:'#6a7030',ped:'#7a8a3a',fil:'#f2eed8',anth:'#e0b840',pist:'#a0b25a',lf:'#86602e',lf2:'#62903a',
    age:{to:'#ead2c2',k:.4,base:'#c4506a',kb:.7}}};
const PRU_NAMES={kanzan:'Kanzan',pink:'Pink Perfection',ichiyo:'Ichiyo',shirotae:'Shirotae',ukon:'Ukon'};
/* the default ageing (Keele, photos 167 and 170): the pinks pale toward white */
const PRU_AGE0={to:'#f4e8ee',k:.55};
/* the flower of each cultivar: petals per whorl counted on face photographs (Pink Perfection: 8 to 10 outer petals seen, about 30 in all; Kanzan
   20 to 50; Ichiyo about 20 to 25, two leafy pistils; Shirotae and Ukon semi-double, 10 to 20, a ring of yellow stamens) */
const PRU_W=(n,dn,L,W,r0,z0,a0,a1,cup,wav,crk,notch,fr,fd,nw)=>({n,dn,L,W,r0,z0,a0,a1,cup,wav,crk,notch,fr,fd,nw:nw||.022,jit:1+Math.max(0,.9-L)*2.2});
/* the petals: obovate-orbicular on a short narrow claw, the tip notched (a clear V, 10 to 15 % of the length: photos c001, c004, fallen petals 167, 170);
   the inner whorls upright, smaller, crumpled; Pink Perfection and Kanzan end in a heart of small tight crumpled petals (c001, c004, brief 80, 91).
   simple and chrys are presets for the colourways to come (not yet checked on a sheet): five broad petals and a crown of long stamens (single
   cultivars); about 60 narrow petals in six whorls, a pompon (chrysanthemum-flowered cherries). */
const PRU_WH={
  simple:[PRU_W(5,0,1,.92,.12,0,[.1,1.35],[.2,1.7],.22,.05,.02,.12,1,.03)],
  semi:[PRU_W(7,1,1,.86,.12,0,[.1,1.45],[.2,1.75],.3,.06,.03,.12,1,.04),PRU_W(5,1,.86,.8,.1,.02,[.08,1.05],[.16,1.4],.36,.08,.05,.11,1,.04),
    PRU_W(3,1,.6,.72,.07,.05,[.05,.6],[.12,.95],.42,.1,.12,.09,1,.03)],
  double:[PRU_W(10,1,.97,.8,.12,0,[.1,1.05],[.2,1.5],.38,.1,.04,.13,2,.05),PRU_W(9,1,.92,.78,.1,.02,[.08,.74],[.16,1.12],.42,.12,.08,.12,2,.05),
    PRU_W(7,1,.86,.76,.07,.05,[.05,.48],[.12,.82],.46,.16,.22,.1,2,.04),PRU_W(6,1,.76,.74,.045,.07,[.03,.3],[.08,.6],.5,.18,.3,.08,1,.03),
    PRU_W(6,1,.6,.72,.025,.1,[.02,.16],[.05,.4],.55,.18,.36,.06,1,.03)],
  kanzan:[PRU_W(12,1,.98,.74,.12,0,[.1,1.4],[.2,1.85],.36,.1,.05,.13,2,.06),PRU_W(11,1,.9,.72,.1,.02,[.08,1.08],[.16,1.5],.4,.12,.08,.12,2,.06),
    PRU_W(9,1,.76,.7,.08,.04,[.06,.72],[.12,1.1],.45,.14,.2,.1,2,.05),PRU_W(7,1,.6,.7,.05,.06,[.04,.42],[.1,.8],.5,.16,.28,.08,2,.04),PRU_W(6,1,.42,.68,.03,.08,[.02,.2],[.06,.48],.55,.18,.34,.06,1,.03)],
  ichiyo:[PRU_W(9,1,.98,.82,.12,0,[.1,1.38],[.2,1.75],.34,.08,.04,.13,2,.04),PRU_W(8,1,.88,.78,.1,.02,[.08,.98],[.16,1.4],.4,.1,.07,.12,2,.04),
    PRU_W(6,1,.66,.74,.07,.05,[.05,.55],[.12,.95],.45,.14,.18,.1,1,.03)],
  chrys:[PRU_W(14,1,.98,.44,.12,0,[.1,1.4],[.2,1.8],.3,.06,.04,.08,1,.03),PRU_W(13,1,.92,.44,.1,.02,[.08,1.1],[.16,1.5],.34,.08,.06,.07,1,.03),
    PRU_W(12,1,.84,.44,.08,.04,[.06,.8],[.12,1.2],.38,.1,.12,.06,1,.03),PRU_W(11,1,.74,.44,.06,.06,[.05,.55],[.1,.9],.42,.12,.2,.05,1,.03),
    PRU_W(10,1,.62,.44,.04,.08,[.04,.36],[.08,.62],.48,.14,.28,.04,1,.02),PRU_W(8,1,.48,.44,.03,.1,[.02,.2],[.05,.42],.52,.16,.32,.04,1,.02)]};
/* the two outer whorls (drawn as lit sheets at close range): less random twist, so that neighbours and whorls do not pass through one another */
for(const k in PRU_WH)PRU_WH[k].forEach((W,w)=>{W.arc=w<2?1:.6;if(w<2){W.tw=.45;W.da=.3;W.fd=.012;W.cup=.07;W.wav=Math.min(W.wav,.06);W.crk=Math.min(W.crk,.04)}
  /* the second whorl stands up inside the first (its pieces crossed the first whorl's near the foot: dbgp w0-w1, 110 to 15 patched cells) */
  if(w===1){W.a0=[W.a0[0],W.a0[1]*.82];W.a1=[W.a1[0],W.a1[1]*.86];W.z0+=.02}});
/* the flower types: the whorls (PRU_WH), stamens and pistils, and what a type changes in the sheet (edge: the body colour holds to that share of the
   petal, then the tip colour: white petals with a pink rim; deep: how far the inner whorls turn to the heart colour: a green centre) */
const PRU_TYPE={
  simple:{wh:'simple',stam:{n:32,L:.4,r:.11,show:.35},pist:{n:1,L:.36,leafy:0}},
  semi:{wh:'semi',stam:{n:26,L:.34,r:.1,show:.4},pist:{n:1,L:.3,leafy:0}},
  double:{wh:'double',stam:{n:7,L:.16,r:.06,show:.8},pist:{n:1,L:.3,leafy:0}},
  kanzan:{wh:'kanzan',stam:{n:6,L:.16,r:.06,show:.65},pist:{n:2,L:.34,leafy:1}},
  ichiyo:{wh:'ichiyo',stam:{n:6,L:.16,r:.06,show:.65},pist:{n:2,L:.34,leafy:1}},
  chrys:{wh:'chrys',stam:{n:0,L:.16,r:.06,show:.9},pist:{n:1,L:.2,leafy:0}},
  edge:{wh:'semi',stam:{n:24,L:.32,r:.1,show:.4},pist:{n:1,L:.3,leafy:0},edge:.7},
  green:{wh:'semi',stam:{n:20,L:.3,r:.09,show:.45},pist:{n:2,L:.34,leafy:1},deep:.3}};
const PRU_BASE={vb:.45,claw:[.12,.88],tip:2.2,aPow:1.25,open:[.3,.6],bud:[.12,.3],budH:[.6,.36],budR:.36,budE:[.05,.95],budK:1.05,budP:.7,budW:1.45,deep:.12,lap:.2,
  dec:[.08,.45],fan:[.45,.3],shed:[.6,.32],wA0:.18,wA1:.45,limp:.6,nod:.35,cal:{tube:.22,rt:.12,n:5,L:.3,W:.42,a:[.45,2.15]},pmin:10,trans:.34,rimW:.009,rimO:.32,edgeLit:.1,lightIn:{dark:[.84],lit:[1.1],darkLo:[.84],litLo:[1.08]},nu:8,nv:10,
  mat:cw=>{const c0=PRU_COL[cw.id]||PRU_COL.pink,lf=x=>mix(x,'#ffffff',PRU_LIFT),c=Object.assign({},c0,{base:lf(c0.base),body:lf(c0.body),tip:lf(c0.tip),back:lf(c0.back)});return{base:c.base,body:c.body,tip:c.tip,bud:c.bud,back:c.back,cal:c.cal,fil:c.fil,anth:c.anth,pist:c.pist,heart:c.heart,
    shade:l2h(h2l(c.body)[0],Math.min(1,h2l(c.body)[1]*1.05),h2l(c.body)[2]*.42),lite:mix(c.body,'#ffffff',.6)}},
  /* the cultivar's own ageing (PRU_COL[id].age, else PRU_AGE0): 'Kanzan' turns bluish mauve; 'Ukon' reddens at the heart; whites go ivory */
  age:(c,k,id,part)=>{const a=(PRU_COL[id]&&PRU_COL[id].age)||PRU_AGE0;return part==='base'&&a.base?mix(c,a.base,a.kb*k):mix(c,a.to,a.k*k)},
  light:Object.assign({},SVB_DEF.light,{ks:.1,gloss:16,wrap:.36,dark:[.9,.78,.66],lit:[1.14,1.3],la:.22,darkLo:[.88,.74],litLo:[1.16]})};
const PRU_SPEC={};
function pruSpec(id){if(PRU_SPEC[id])return PRU_SPEC[id];const T=PRU_TYPE[(PRU_COL[id]||{}).type]||PRU_TYPE.double;
  return PRU_SPEC[id]=Object.assign({},PRU_BASE,{wh:PRU_WH[T.wh],stam:T.stam,pist:T.pist},T.edge?{edge:T.edge}:{},T.deep!=null?{deep:T.deep}:{})}
/* how far the cherry has faded: the sheets' override, the bouquet's element, else the bouquet's life stage */
function pruLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:PRU_SID,rec:{}})):0}
/* the head of the sheets: one flower of the colourway, opening op, faded wl */
function satoSvg(par,B,O,D,cwId,op,seed,wl,lod){const c=PRU_COL[cwId]?cwId:'pink';return svBlossom(par,B,O,D,pruSpec(c),{id:c,c:PRU_COL[c].body},op,seed,wl==null?pruLife():wl,lod)}
SV_HEAD[PRU_SID]=satoSvg;
/* the colour of a fading cherry (the bouquet's WILT): pinks pale and dull, then tan at the margins; whites to ivory, then parchment; greens as lifeCol */
function pruWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=50&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;if(l<.2)return c;
  if(s<.18||l>.88){let o=mix(c,'#ece2cc',.6*w);if(w>.55)o=mix(o,'#b89a76',(w-.55)*.7);return o}
  let o=mix(c,mix(c,'#efe2e8',.6),.8*w);o=l2h(h2l(o)[0],h2l(o)[1]*(1-.35*w),h2l(o)[2]);if(w>.55)o=mix(o,'#a98068',(w-.55)*.75);return o}
if(typeof GHI!=='undefined'&&GHI[PRU_SID])GHI[PRU_SID].wilt=pruWiltCol;
/* ---------- the cut branch (svBranch on the skeleton of the old drawing l55Sato, whose share of the bouquet's chance is consumed as before) ----------
   Organs (brief-organes.md): older bark grey-brown #989080 with pale grey lenticels #c9c4b9 (organes 19, 20); the cut, sapwood #ecba80 and dark
   heartwood #604229 (156); petiole red-brown #603028 with two yellow-green glands half its width (150); leaves 1.7 to 2 times as long as wide, fine
   sharp teeth (18, 117). Wood (brief 126, 134; kept 131, 196): young shoots glossy chestnut, older wood grey-brown with a copper sheen, pale horizontal lenticels, ring scars;
   knobbly spurs ending in reflexed brown bud scales (reddish inside); corymbs of 2 to 5 flowers on a short common stalk, pedicels about one flower
   across, arching then hanging; young leaves with the flowers, folded on the midrib, acuminate, finely and doubly serrate with bristle tips, two glands on the petiole, narrow
   stipules (bronze; green with a bronze touch for Shirotae); a clean cut, pale sapwood and dark heartwood. */
const PRU_BRANCH={fD:5.4*UPC,cols:cw=>PRU_COL[cw&&cw.id]||PRU_COL.pink,
  flower:(pp,B,O,D,cw,op,sd,wl,lod)=>satoSvg(pp,B,O,D,cw&&cw.id,op,sd,wl,lod),
  wood:{young:['#2a160f','#5a3024','#8a5642','#d8b8a4'],old:['#36302a','#6a6258','#989080','#cdc8bc'],oldTo:.45,gloss:.6,
    lent:{col:'#c9c2b4',sp:1.4,len:.5,w:.14,op:.65,young:.35},ring:{col:'#22120c',n:3,op:.55},fiss:3},
  cut:{slant:.5,bark:'#3a2a1e',cam:'#8a8a40',wood:'#e6bc86',heart:'#6e4a2e',pith:'#4e3420',pr:.1,kind:'solid'},
  spur:{L:[.12,.3],w:.6,col:'#4a2a1e',lite:'#9a6a52',rings:3},
  scales:{n:6,L:.12,col:'#6a3a24',inner:'#a0503a',open:.5},
  infl:{type:'corymb',stalk:[.08,.3],ped:[.8,1.25],spread:[.45,.85],droop:.3,face:.35,pw:.017,bract:{L:.13,col:'#7e7a34'}},
  leaf:{L:[.62,.95],W:.52,pet:.16,fold:.75,curl:.55,tw:.4,droop:.45,acu:.75,serr:22,dbl:1,tooth:.045,aris:.5,green:1.05,two:.55,glands:2,glC:'#b4b04a',grow:.8,stip:.14,petC:'#6a3228',
    hang:1.2,Wy:.1,und:'#e8c0b0',undK:.35,gloss:.7,vd:.8,open:.8},
  /* the silhouette (brief 134, 139, 144, 149, 163; organes 19, 244): a gently zigzag axis, 8 to 12 mm at the cut and tapering, one to three short side
     shoots, the flowers in hanging clusters of 3 to 5 on knobbly spurs a good hand apart, bare wood between, a tuft of young bronze leaves at the tip */
  form:{zig:.12,zigL:.2,bow:.05,taper:[8,12,2.4,1.3],latW:.6,latK:[.5,.75],bare:.25,gap:[1.4,1],gapL:50,dorm:.45,nF:[3,5],tuft:[3,5],lf:[.3,2]}};
svBranchWrap(PRU_SID,PRU_BRANCH,{prep:(o,cap)=>{const cw=cwPick(L55_SATO,o),c0=cap.chains[0].pts[0],k=[Math.round(c0[0]*8),Math.round(c0[1]*8),Math.round(cap.L)];
  return{cw,op:Math.max(.05,Math.min(1,o.op??(.75+.25*svRng(svSeed('sato-op',...k))()))),wl:pruLife(o),seed:svSeed('sato',cw.id,...k)}}});
