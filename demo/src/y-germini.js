/* ================= Pilote : le germini (gerbera miniature, Gerbera × hybrida à petites têtes) en SVG natif, sur la pièce capitule (y-germini.js) =================
   The miniature gerbera on the same kit piece as the gerbera (svcapDraw, y3-capitule.js) and its life (GRB_LIFE, GRB_INV, grbWiltCol, grbNeckBend,
   y-gerbera.js); only what the photographs of the mini show DIFFERENT from the standard (refcache/germini/brief.md):
   - the head 5 to 9 cm (Danziger Petiwaei 5-6, Microwhite 7-9), against 7.5 to 13: the size is the recipe's (SZG 6 to 7 cm), not the sheet's;
   - two or three rows of narrower rays, packed into a full disc with no gap (102, 105, 108, 97), the tips blunt and rounded;
   - the heart (crown and disc) about a third of the diameter (83, 105, 108, 97): r .34 against .29, the disc broader;
   - the involucre: fewer, narrow, pointed, downy green bracts (112), on a hairy neck (112: the peduncle densely furred under the head);
   - the bud (115): a small green ovoid on a long thin scape, the tips of the rays showing only at its apex;
   - the scape bare, leafless on a cut stem (104, 106, 107), downy; the stem's length is not shorter than the standard's (Petiwaei 50-55 cm) and
     its width keeps the old drawing's (.075 of the head, 112, 115), so the bouquet's chance does not move;
   - fading: no photograph of a faded mini; the standard gerbera's (121, 70, 15, 137 of refcache/gerbera) stand: grbWiltCol and the bending neck.
   Forms: simple / semi-double (the default 'mini', 1017 to 1029) and pompon (1030 'double rose': Terra Cupid, Panucci, 'mini-double').
   The spider / pasta mini is another sort (gerbera-araignee), not here.
   Colours: GRM_MAT[id], the measured table (refcache/germini/coloris.md, catalogue/serre/sources/germini.json), same fields as GRB_MAT. */
var GRM_MAT=typeof GRM_MAT!=='undefined'?GRM_MAT:{};
/* medians of the retained photographs, front views (the back derived by svcapMat). The disc's measure is the heart; the crown its ring of trans
   florets; pollen only where half the photographs or more show it (else the crown's tone). The photograph wins over the catalogue hex: 1029 is
   red with yellow tips (not orange with a yellow ring), 1018 a beige cream. Level C, transcribed so that the SKU keeps its colour: 1018, 1021, 1030 */
Object.assign(GRM_MAT,{
  /* 1017 to 1030 (L27_CW_GERM, s27a.js) */
  blanc:{base:'#e0dcd6',body:'#e2e2e2',tip:'#dddddc',heart:'#b2a438',crown:'#d8d0b4',pollen:'#c3a641'},
  creme:{base:'#e8b47e',body:'#eac8aa',tip:'#e6d3bc',heart:'#250908',crown:'#d49756',pollen:'#d49756'},/* C */
  jaune:{base:'#f9bd01',body:'#fcc901',tip:'#f2c901',heart:'#100902',crown:'#e29b04',pollen:'#de9c06'},
  orange:{base:'#e55016',body:'#e85e15',tip:'#ed7215',heart:'#4e1610',crown:'#cf3419',pollen:'#cf3419'},
  peche:{base:'#e58747',body:'#e7a176',tip:'#efbb83',heart:'#9c6711',crown:'#d76739',pollen:'#d76739'},/* C */
  corail:{base:'#f66d57',body:'#f9a588',tip:'#eaae8b',heart:'#bd7d23',crown:'#f36841',pollen:'#c19632'},
  rouge:{base:'#9a0a12',body:'#c20218',tip:'#d50116',heart:'#0b0304',crown:'#6a0a12',pollen:'#6a0a12'},
  cerise:{base:'#aa103c',body:'#b02540',tip:'#b8354e',heart:'#1c1114',crown:'#981840',pollen:'#981840'},
  'rose-pale':{base:'#ec9cb4',body:'#f3a8c2',tip:'#f2adc1',heart:'#b17d10',crown:'#dc7691',pollen:'#caa045'},
  rose:{base:'#e970a0',body:'#f182b2',tip:'#f292b6',heart:'#ab842d',crown:'#e26a7e',pollen:'#e26a7e'},
  fuchsia:{base:'#cc045d',body:'#d30369',tip:'#d00b74',heart:'#5e391d',crown:'#93092e',pollen:'#93092e'},
  lilas:{base:'#e68fc2',body:'#ee9ad0',tip:'#e8a0ce',heart:'#1e0c0e',crown:'#ca83a4',pollen:'#ca83a4'},
  /* 1029: red, the tips yellow (seven photographs agree; catalogue: orange with a yellow halo) */
  halo:{base:'#dd2a23',body:'#de2727',tip:'#f7a52b',heart:'#4e1c09',crown:'#c63d18',pollen:'#c63d18',tips:'#f7a52b',tipsV:.7,tipsM:.14,tipsB:.3,tipsBV:.16},
  /* the pompon's heart from the photographs of the type, not the mean (#723628, brown: other forms' hearts): Terra Cupid shows a green-yellow
     disc (#889220 at its centre, #9b9e36 out to its rim) ringed by ochre florets (#be8849), Panucci a small ochre-green one (#ac8b32) */
  double:{base:'#e6808d',body:'#f398a5',tip:'#f696a5',heart:'#8c9a2a',crown:'#be8849',pollen:'#be8849'},/* C: pompon on two varieties */
  /* late:8, level B */
  'blanc-noir':{base:'#e1e1d7',body:'#e4e4db',tip:'#e3e2dc',heart:'#130808',crown:'#cab9ae',pollen:'#cab9ae'},
  'jaune-vert':{base:'#f0b501',body:'#f0bb01',tip:'#eec001',heart:'#bd9310',crown:'#eaae02',pollen:'#e4a708'},
  'creme-vert':{base:'#dbb491',body:'#e3c4a6',tip:'#decbab',heart:'#ac8d39',crown:'#d4ab77',pollen:'#bf9a48'},
  'citron-vert':{base:'#ebcb40',body:'#e8d676',tip:'#e9d87e',heart:'#a69811',crown:'#e4bc2c',pollen:'#d8ad26'},
  'rouge-vert':{base:'#b50c18',body:'#bd0f1a',tip:'#c2151b',heart:'#a78224',crown:'#af1b19',pollen:'#af1b19'},
  vermillon:{base:'#e2291a',body:'#f54420',tip:'#f15919',heart:'#201606',crown:'#cd1f18',pollen:'#cd1f18'},
  'blanc-anneau':{base:'#daafae',body:'#eaded7',tip:'#e1dcd5',heart:'#0b0201',crown:'#cb3f50',pollen:'#cb3f50',halo:'#cb3f50',haloV:.3,haloM:.12},
  'fuchsia-pointes':{base:'#b33548',body:'#ad0c42',tip:'#dc94a4',heart:'#a79620',crown:'#cf9064',pollen:'#c39e41',tips:'#dc94a4',tipsV:.72,tipsM:.12}});
/* the mini's forms (only what differs from the gerbera's sheet) */
const GRM_FORMS={
  /* simple / semi-double (102, 105, 108, 97, 83): three rows of narrow blunt rays packed into a full disc, the inner row short; heart a third */
  mini:{rows:3,n:[[0,26],[.5,24],[1,21]],L:[[0,.66],[.5,.54],[1,.4]],W:[[0,.21],[.5,.2],[1,.165]],r0:[[0,.31],[.5,.3],[1,.28]],z0:[[0,-.012],[.5,.004],[1,.02]],
    a0o:[[0,1.18],[.5,.98],[1,.72]],a1o:[[0,1.86],[.5,1.62],[1,1.3]],aPow:1.7,claw:.3,vb:.62,taper:.28,tipE:1.85,tipH:1.3,cup:.12,jL:.06,jA:.08,jPh:.07,jLift:[.08,-.25],jDrop:[.06,.2],jFold:[.04,.4],jRip:.03,lag:.3,rowSh:[.07,.45,.75],
    heart:{r:.34,disc:.14,crownL:.14,crownRows:3,crownN:54,crownW:.032}},
  /* pompon (Terra Cupid, Panucci): a dome of six rows of short broad rays set on a domed receptacle (their feet rise row by row), the outer
     ones bowed down past flat into a skirt, the inner ones standing round a small green disc in a shallow crater (Terra Cupid) */
  'mini-double':{rows:6,n:[[0,26],[.2,28],[.4,30],[.6,30],[.8,28],[1,24]],nJ:.05,L:[[0,.55],[.2,.47],[.4,.41],[.6,.36],[.8,.3],[1,.25]],
    W:[[0,.16],[.4,.13],[.8,.1],[1,.085]],r0:[[0,.3],[.2,.29],[.4,.27],[.6,.25],[.8,.23],[1,.21]],z0:[[0,-.02],[.2,.05],[.4,.12],[.6,.19],[.8,.25],[1,.28]],
    a0o:[[0,1.62],[.2,1.3],[.4,1],[.6,.75],[.8,.5],[1,.3]],a1o:[[0,2.3],[.2,1.8],[.4,1.42],[.6,1.06],[.8,.76],[1,.5]],aPow:1.4,claw:.3,vb:.55,taper:.35,tipE:1.55,tipH:1.5,cup:.2,lag:.4,shadeF:.3,lnF:.35,rowSh:[.06,.4,.7],
    jL:.06,jA:.07,jPh:.08,jLift:[.06,-.2],jDrop:[.05,.2],jFold:[.03,.4],
    heart:{r:.2,disc:.12,crownN:30,crownL:.05,crownRows:2,wall:.6}}};
/* the involucre of the mini: fewer, narrower bracts (112); closed round the bud into a pointed ovoid (29, 133: the bracts nearly parallel to the
   axis, their tips meeting at the apex), the bud longer than wide (H/W 1.4 to 1.9) */
const GRM_INV=Object.assign({},GRB_INV,{n:[18,14],W:[.045,.04],a0c:.16,a1c:-.95,bud:3.8,budW:1.6,budS:[.12,.36],obU:[.2,.3],a1u:-.35});
/* the mini's life: the bud is a third of the open head across (115, 151), not a pea; the rays come out of it as a pointed cone of their tips
   (115, 151: the brush of coloured tips converging beyond the bracts) before they part */
const GRM_LIFE=Object.assign({},GRB_LIFE,{grow:[.7,.6],a0c:[[0,-.42],[1,-.48]],a1c:[[0,-.62],[1,-.7]]});
const GRM_SPEC={};
function grmSpec(form){return GRM_SPEC[form]||(GRM_SPEC[form]=Object.assign({mat:cwx=>svcapMat(cwx,GRM_MAT[cwx.id]),inv:GRM_INV},GRM_LIFE,GRM_FORMS[form]||GRM_FORMS.mini))}
/* how far the germini has wilted: the sheets' override, else the bouquet's stage */
function grmLife(){return typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null?SVA_LIFE:(typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'germini',rec:{}})):0)}
/* the head, any colourway of the list ('rouge~mini-double': a colourway in another form, test sheets only) */
function grmSvg(par,B,O,D,cwId,op,seed,wl,S){const[cid,fo]=String(cwId).split('~'),c0=(typeof L27_CW_GERM!=='undefined'&&L27_CW_GERM.find(x=>x.id===cid))||{id:cid,c:'#f07a1e',eye:'#2a160e'},
    form=fo&&GRM_FORMS[fo]?fo:c0.dbl?'mini-double':'mini';
  return svcapDraw(par,B,O,D,S||grmSpec(form),c0,op,seed,wl==null?grmLife():wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['germini']=grmSvg;
/* the germini of the bouquet (list L27_CW_GERM): the old head's draws first (grbOldDraws, mini), so that the composition stays the same */
function grmSvgPut(par,B,O,D,cw,op,cws){if(typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id||cws!==L27_CW_GERM)return false;const n=grbOldDraws(cw,op,B[2][2],1);for(let i=0;i<n;i++)R(0,1);
  grmSvg(par,B,O,D,cw.id,op,svSeed('germini',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)));return true}
/* the scape: bare, downy, the neck furred under the head (112); the cut stem ends clean */
if(typeof GHI!=='undefined'&&GHI['germini'])Object.assign(GHI['germini'],{wilt:grbWiltCol,scSv:{hair:'#e6eedc',hairK:.6,hairI:1,hairL:.6,hairA:.45,hairOp:.36,hairFOp:.16,ribs:[-.35,.3],swell:.03,gloss:.32},cut:1});
