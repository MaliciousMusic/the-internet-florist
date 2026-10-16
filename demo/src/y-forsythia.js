/* ================= Pilote : le genre Forsythia en SVG natif (y-forsythia.js) =================
   One module per genus, one sheet per sort. The forsythia (Forsythia × intermedia = suspensa × viridissima): a cut branch of arching, angular
   (four-angled) shoots, olive- to red-brown and warted with pale corky lenticels, the nodes opposite (a pair of buds at each, crossing from node to
   node), the old wood at the foot grey-brown; it flowers BEFORE its leaves, on the bare wood of the year before: out of each bud of a pair, 1 to 3
   flowers (up to 6 a node) on short pedicels, nodding; each flower a short bell-shaped tube and four strap-shaped lobes (sometimes 5 or 6), joined at
   the foot, in a small green calyx of four lobes that stays when the corolla falls; two stamens borne on the tube and one style (thrum-eyed: long
   stamens, short style; pin-eyed: the reverse). Young opposite leaves show only when the flowers fade. Drawn with the generic pieces of
   y3-branche.js: svBlossom (the flower: one whorl of lobes on a corolla tube, ctube; the corolla falls whole, symp) and svBranch.
   Colourways in the catalogue's order (B29_FOR of s29a.js); added ones carry late:1. Photographs: refcache/forsythia (brief.md, brief-organes.md,
   REFERENCES-section.md); colours: coloris.md, 2nd pass (transcribed by the finishing agent, see FOR_COL). */
const FOR_SID='forsythia';
/* the colourways (to add one: an entry here with its flower type and late:1, its name in FOR_NAMES, and in B29_FOR of s29a.js {id,n,c,late:1}).
   type: a key of FOR_TYPE; base (the throat, foot of the lobes), body, tip, bud (outside of the bud), back (outside of the open lobe and the tube),
   cal (calyx), ped (pedicel), fil, anth (stamens), pist (style), lf (young leaf), lf2 (grown leaf); sz: the flower's size (x the sort's fD). */
const FOR_COL={
  /* base (the throat, r < .3): as light as the body, a little warmer and fuller (measured on Beatrix, coloris.md 2nd pass: base #c9b32b against
     body #c1b33a, L +0.6, C +5.8, h -3.2 deg); the same step applied to the other bodies (their bases are not measured).
     Finishing (refcache/forsythia/etat-finition.md): lightness free, hue and chroma of the measures kept. The three sets measured at L 72 (Lynwood,
     Beatrix, Spring Glory: amateur photos, under-exposed) are raised by 5.8 L* to L 78; Spectabilis (studio-lit Kolster photo, L 81) is not raised.
     Zones not measured keep the offsets from the body (L, C, h) read by eye by the modeller on the photos. */
  /* 0 Spectabilis (Späth 1906): golden yellow, pin-eyed; lobes narrower, their tips recurved and twisted (kept 142; organes 117, 106793158).
     Level B, measured: body #e8c733 (2 photos, as measured); the other zones not measured (read by eye on brief 100, 21). */
  or:{type:'spect',sz:.9,base:'#f2c620',body:'#e8c733',tip:'#ebcf46',bud:'#b5ad37',back:'#dfc347',cal:'#6e7c30',ped:'#66702e',fil:'#e6d070',anth:'#e4b42c',pist:'#c8c66e',lf:'#86a43c',lf2:'#5c8838'},
  /* 1 Lynwood Variety (syn. Lynwood Gold, Lynwood; sport of Spectabilis, 1935): bright yellow, thrum-eyed; broad lobes, less rolled, wide open
     (kept 136, 137, 99, 155, 156; organes 122, 123). Level B, measured: body #ceaf29 (median of 8 photos, L 72.2, C 66.9, h 91.5), raised to L 78;
     bud #a39d43 (approximate box, L 63.6, C 47.8, h 101.7) raised by the same 5.8 L*; base, tip and back not measured. */
  vif:{type:'lynwood',sz:1,base:'#e8be2c',body:'#dfbf3b',tip:'#e4c84e',bud:'#b3ac52',back:'#d8c04d',cal:'#6e7c30',ped:'#66702e',fil:'#e6d070',anth:'#e4b42c',pist:'#c8c66e',lf:'#86a43c',lf2:'#5c8838'},
  /* late:1 Beatrix Farrand (Arnold Arboretum 1944; tetraploid): large flowers, broad lobes, golden yellow, thrum-eyed (TSO). Level B, measured:
     body #c1b33a (median of 3, L 72.3, C 61.4, h 98.3), base #c9b32b, tip #c4b33b, each raised by 5.8 L*; the bud: the measured #586639 (green pixels in shade,
     approximate: L 41, C 27.3, h 119.9) renders as a dull grey sage, so the lit bud of the same photo is used (MBG t018: median #a7a94c, L 67.5, C 51.9,
     h 105.8), taken to L 70. */
  beatrix:{type:'beatrix',late:1,sz:1.25,base:'#dac33d',body:'#d2c34a',tip:'#d5c34b',bud:'#afb04c',back:'#d0c356',cal:'#6a7a30',ped:'#66702e',fil:'#e6d070',anth:'#e4b42c',pist:'#c8c66e',lf:'#86a43c',lf2:'#5c8838'},
  /* late:1 Spring Glory (sport of 'Primulina'): sulphur yellow, paler than Lynwood, thrum-eyed. Measured: body #c5b13c (median of 2, L 72.0, C 60.1, h 95.6), raised
     to L 78; existence N3 only: prov:1 (coloris.md, 2nd pass). */
  spring:{type:'lynwood',late:1,prov:1,sz:.95,base:'#dfc13f',body:'#d6c14c',tip:'#dcc95e',bud:'#b5b04c',back:'#d4c45a',cal:'#6e7c30',ped:'#66702e',fil:'#e6d070',anth:'#e4b42c',pist:'#c8c66e',lf:'#86a43c',lf2:'#5c8838'}};
const FOR_NAMES={or:'Spectabilis',vif:'Lynwood Variety',beatrix:'Beatrix Farrand',spring:'Spring Glory'};
/* the lobes: one whorl of four (now and then five), strap-shaped, joined at their foot into the tube's mouth (r0 = the tube's rim, z0 = its length);
   a lobe is about twice as long as wide, its tip obtuse, a little notched, its sides cupped up; open, the lobes leave the tube upright, then spread
   (brief 21, 100, 130, 155; organes 5, 171, 180) */
const FOR_W=(L,W,a0,a1,cup,tw,da)=>({n:4.1,dn:.45,L,W,r0:.15,z0:.3,a0,a1,cup,wav:.05,crk:0,notch:.035,nw:.02,fr:0,fd:0,tw,da,jit:1});
/* the flower types: lobes, stamens and style (thrum: the two anthers in the throat, the style hidden in the tube; pin: the reverse) */
const FOR_TYPE={
  lynwood:{wh:[FOR_W(.9,.5,[.06,.5],[.14,1.5],.2,1.2,.35)],stam:{n:2,L:.42,r:.05,show:.42,fw:.03,aw:.12,sp:.3},pist:{n:1,L:.16,leafy:0,l0:0,g0:.14}},
  spect:{wh:[FOR_W(.92,.42,[.06,.5],[.14,1.78],.26,2.6,.45)],stam:{n:2,L:.2,r:.05,show:.42,fw:.03,aw:.11,sp:.25},pist:{n:1,L:.42,leafy:0,l0:0,g0:.14}},
  beatrix:{wh:[FOR_W(.88,.56,[.06,.52],[.14,1.5],.18,1.1,.3)],stam:{n:2,L:.42,r:.05,show:.42,fw:.03,aw:.12,sp:.3},pist:{n:1,L:.16,leafy:0,l0:0,g0:.14}}};
/* the age of a lobe in its decline (organes 147: the yellow pales, the tips turn ochre first; 143: dry, beige-brown) */
const forAge=(c,k,id,part)=>part==='tip'?mix(mix(c,'#e2cc78',.3*k),'#a8803e',.45*Math.max(0,k-.35)/.65):part==='base'?mix(c,'#d8b850',.15*k):mix(c,'#e6d488',.35*k);
/* the flower (svBlossom): the bud a long egg, pointed, the lobes wrapped round it, green-yellow then yellow from the tip (brief 73, 85, 88, 219);
   it opens to a bell (lobes at 45 degrees: 88, 105), then the lobes spread to 90-120 degrees (21, 100). Decline: the lobes pale, limp, their tips
   ochre, the flower nods (147); then the corolla dries beige-brown (143) and falls whole: the green calyx stays, browning (159), with the style. */
/* ao: the throat of an open bell is lit (Beatrix base as light as its body): little occlusion at the foot of the lobes (the kit's default .5
   darkened the ring of the throat, dE 9.9 against the measure) */
/* decline and faded (organes 147, 143, 159): the lobes do not spread further; they go limp and hang, roll lengthwise and twist into a narrow
   spire (fanR), the corolla drying beige-brown before it falls whole; never a flat star (that is the open flower) */
/* the shade of a yellow lobe turns amber, not olive (a thin petal lit through: 88, 411 in shade); the bud an egg about twice as long as wide,
   widest above its middle (88: 1.6 to 2, brief 1.2 x 0.5 cm), and at .4 the lobes part to a bell (88, 105) */
const FOR_BASE={vb:.3,claw:[.62,.38],tip:2.1,aPow:1.35,open:[.25,.58],bud:[.12,.3],budH:[.5,.25],budR:.25,budE:[.1,.9],budK:1.05,budP:.72,budW:1.55,deep:0,lap:0,stag:.04,
  dec:[.12,.36],fan:[.45,.25],shed:[.66,.26],stay:null,symp:1,wA0:.05,wA1:.08,limp:.85,nod:.35,fanR:{N:.45,C:1.1,T:2.4,D:.35,L:.45},
  ctube:{L:.3,rb:.07,rt:.15,bp:.6,col:.5},
  ao:[.12,.2,.15,.3],
  calS:1,cal:{tube:.12,rt:.12,rb:.06,bp:.6,n:4,L:.2,W:.6,a:[.3,.8]},pmin:10,trans:.25,rimW:.006,rimO:.2,edgeLit:.04,
  lightIn:{dark:[.86],lit:[1.08],darkLo:[.86],litLo:[1.06]},nu:8,nv:10,
  mat:cw=>{const c=FOR_COL[cw.id]||FOR_COL.vif;return{base:c.base,body:c.body,tip:c.tip,bud:c.bud,back:c.back,cal:c.cal,fil:c.fil,anth:c.anth,pist:c.pist,
    shade:l2h(h2l(c.body)[0]-10,Math.min(1,h2l(c.body)[1]*1.1),h2l(c.body)[2]*.55),lite:mix(c.body,'#fffbe8',.55)}},
  age:forAge,
  light:Object.assign({},SVB_DEF.light,{ks:.12,gloss:16,wrap:.36,dark:[.9,.8,.68],lit:[1.1,1.22],la:.2,darkLo:[.88,.76],litLo:[1.12]})};
const FOR_SPEC={};
function forSpec(id){if(FOR_SPEC[id])return FOR_SPEC[id];const c=FOR_COL[id]||FOR_COL.vif,T=FOR_TYPE[c.type]||FOR_TYPE.lynwood;
  return FOR_SPEC[id]=Object.assign({},FOR_BASE,{wh:T.wh,stam:T.stam,pist:T.pist})}
/* how far the forsythia has faded: the sheets' override, the bouquet's element, else the bouquet's life stage */
function forLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:FOR_SID,rec:{}})):0}
/* the head of the sheets and of the branch: one flower of the colourway, opening op, faded wl */
function forSvg(par,B,O,D,cwId,op,seed,wl,lod){const c=FOR_COL[cwId]?cwId:'vif';return svBlossom(par,B,O,D,forSpec(c),{id:c,c:FOR_COL[c].body},op,seed,wl==null?forLife():wl,lod)}
SV_HEAD[FOR_SID]=forSvg;
/* the colour of a fading forsythia LOBE (the other organs: FOR_BRANCH.wilt): the yellow pales, then turns ochre (organes 147: #e0c361, #a07945),
   then dries beige-brown (143: #dac59a, #a28d70); the green parts drawn in the flower (calyx) go as the leaves do */
function forWiltFl(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=70&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;if(l<.12)return c;
  let o=mix(c,'#e8d68e',.4*Math.min(1,w/.4));if(w>.3)o=mix(o,'#ae8a4a',.5*Math.min(1,(w-.3)/.35));if(w>.6)o=mix(o,'#a8927a',.65*Math.min(1,(w-.6)/.3));return o}
/* ---------- the cut branch (svBranch on the skeleton of the old drawing b29Forsythia, whose share of the bouquet's chance is consumed as before) ----------
   Organs (brief, brief-organes, photographs by index): opposite nodes, each a pair of buds; the flowering ones open out of their brown scales (a
   small cup of bud scales stays at the foot of the cluster: 85, 88, 136), 1 to 3 flowers each on a pedicel of 4 to 8 mm, the open ones hanging
   (109, 131, organes 96, 53); the other nodes keep their pair of pointed, scaly, tan-brown buds (173, 137, 99); one-year shoots red-brown to
   olive-brown (136, 411, 109; 85, 88), dense pale lenticels (85, 88, 136), four-angled (NOT PHOTOGRAPHED: drawn from the botany of the genus,
   faint ridges at close range), the nodes a little swollen; the old wood at the foot grey-brown (5: #454126, #837250); the pith chambered in the
   internodes (221, 79: lamellate pith seen split; no clean cut photographed); a clean cut at the foot. No leaf at flowering (330, 332, 561 bare);
   young leaves, opposite, bright green, come as the flowers fade (organes 139, 162). */
const FOR_FORM={zig:.07,zigL:.1,bow:.05,taper:[8,11,2.2,1.15],latW:.55,latK:[.7,1],bare:.25,gap:[0,0],dorm:.75,tuft:[2,2],lf:[1,1]};
const FOR_BRANCH={fD:3.4*UPC,cols:cw=>FOR_COL[cw&&cw.id]||FOR_COL.vif,fsz:cw=>(FOR_COL[cw&&cw.id]||FOR_COL.vif).sz||1,
  flower:(pp,B,O,D,cw,op,sd,wl,lod)=>forSvg(pp,B,O,D,cw&&cw.id,op,sd,wl,lod),
  wood:{young:['#3c2618','#6c4a32','#987252','#d0b490'],old:['#3c3626','#6c6248','#968a6a','#c6ba96'],oldTo:.45,gloss:.3,
    lent:{col:'#e2d8bc',sp:.6,len:.1,w:.2,op:.75,young:.85,lo:[.7,.9,.85]},ring:{col:'#2a1c12',n:2,op:.4},fiss:1,rib:{u:[.3,-.45],op:.45,w:.05}},
  cut:{slant:.5,bark:'#4a3a26',cam:'#8a9440',wood:'#e2d8aa',heart:null,pith:'#d4d09a',pr:.2,kind:'chambered'},
  spur:{L:[.03,.07],w:.8,col:'#6a4a30',lite:'#9a7a58',rings:2,d1:0},
  wbud:{L:.2,W:.45,col:['#3a2414','#8a6440','#c8a878']},
  scales:{n:6,L:.08,col:'#6e4e32',inner:'#9a7a56',open:.4},
  infl:{type:'fascicle',stalk:[0,0],ped:[.1,.2],spread:[.4,.8],droop:.55,face:.25,pw:.035,bract:null,down:.2,fpl:.18,join:-.01},
  axis:(B,cw,op,wl)=>svblNod(forSpec(cw&&FOR_COL[cw.id]?cw.id:'vif'),B,op,wl),
  leaf:{L:[.6,1],W:.42,pet:.12,fold:.5,curl:.3,tw:.25,droop:.3,acu:.5,serr:14,dbl:0,tooth:.03,aris:.1,green:.9,two:.6,two1:9,glands:0,grow:.2,stip:0,petC:'#6a7a34',
    hang:.3,gloss:.5,vd:.12,vO:.6,open:.8,late:[.4,.95]},
  thorn:null,form:FOR_FORM,
  age:{a:.24,b:1.12,c:-.3,r:[-.2,.16],step:.07},
  /* fading by organ (svbWilt): lobes forWiltFl; the stamens brown; the calyx stays, browns and dries (organes 159: #b3a42a then #704e20);
     leaves and pedicels as the cherry's; wood, scales and buds unchanged; the cut a little darker */
  wilt:{fl:forWiltFl,heart:{to:'#8a6a30',k:.5,w0:.6,br:'#5a3a1e',b0:.5,bk:.6},cal:{to:'#8a8a3a',k:.25,dull:.15,br:'#6a4a24',b0:.55,bk:.6},
    lf:{to:'#6c7536',k:.6,w0:.6,dull:.3,br:'#7a5230',b0:.55,bk:.55,dk:.8},pd:{to:'#6a5a30',k:.3,dull:.2,br:'#5a4426',b0:.65,bk:.4},
    wd:0,sp:0,bud:0,th:0,cut:{to:'#a07850',k:.2}}};
const forWiltCol=svbWilt(FOR_BRANCH.wilt,forWiltFl);
if(typeof GHI!=='undefined'&&GHI[FOR_SID])GHI[FOR_SID].wilt=forWiltCol;
svBranchWrap(FOR_SID,FOR_BRANCH,{prep:(o,cap)=>{const cw=cwPick(B29_FOR,o),c0=cap.chains[0].pts[0],k=[Math.round(c0[0]*8),Math.round(c0[1]*8),Math.round(cap.L)];
  return{cw,op:Math.max(.05,Math.min(1,o.op??(.75+.25*svRng(svSeed('for-op',...k))()))),wl:forLife(o),seed:svSeed('for',cw.id,...k)}}});
