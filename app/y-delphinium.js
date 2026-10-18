/* ================= Le delphinium (Delphinium elatum, hybrides Elatum / Pacific) en SVG natif (y-delphinium.js) =================
   Measured on photographs (refcache/delphinium: brief.md, coloris.md, fiche-resume.md; the fiche catalogue/serre/fiches/delphinium.json):
   a tall dense raceme of 32 to 44 spurred florets on short pedicels, opening from the foot up, the top fifth still in buds when it is sold
   (photographs 33, 42, 56, 65). A floret (photographs 45, 53, 64, 70): five broad petaloid sepals (length/width 1.2, obtuse, a short claw),
   spread nearly flat, a little cupped, the two laterals over the upper one; the upper sepal drawn back into a spur (1.5 to 3 cm) that runs up
   toward the stem; at the centre the 'bee' (two small upper petals, two lower ones bilobed and bearded: white, cream or pale yellow on the blues,
   dark on some); semi-doubles (Guardian, Casa Blanca) add a whorl of three smaller petals round the bee. Buds rounded eggs, green from the foot, the
   colour arriving by the tip, a short spur on their upper side (photographs 14, 17, 35). Fading (photographs 35, 40; 287, 288, 295 of larkspur):
   the oldest florets at the foot pale and go limp, then drop their sepals one by one (one may hang, shrivelled), leaving the three follicles,
   green, then brown and papery: the raceme narrows as it fades. The kit (y3-grappe.js: layout 'dresse', floret 'eperon') draws it; this sheet
   gives only the delphinium's numbers. The stem and leaves are the next step (the bouquet keeps the old drawing, s8a.js, until then). */
/* the colourways measured (coloris.md, level C; five lightness bands: shadow, dark, median, light, highlight): fr the sepals' face, bk their back,
   bs the pale zone toward the bee, be the bee, beard its tuft, bud the buds' colour, inn the inner whorl (semi-double) */
const DLP_CW={
  /* Guardian Blue (photographs 45 and t-photos of coloris.md): lilac blue, the base bluer and paler toward the bee, a little violet in the body,
     the bee white, faintly lilac, its tuft pale yellow */
  /* (comparison relay 3, photographs 33, 53, 65, 70) the render read lavender beside every photograph: a clear blue-violet, saturated, the
     zone toward the bee bluer and brighter (never a mauve wash) */
  /* (relay 3, second look) the first blue read periwinkle: deeper and a little more violet; the inner whorl read as a see-through ring: none */
  'guardian-blue':{fr:['#10084a','#22128a','#3624bc','#5a48dc','#9488f2'],bk:['#180e56','#2c1e8e','#4234b8','#6a62d6','#a8a2f0'],
    bs:['#18188a','#2830b2','#4048d0','#6a78e6','#a8b2f8'],be:['#8e8496','#c2bac8','#e4dee6','#f4f0f4','#fffcfe'],beard:'#e8d690',bud:'#4e3ec4',inn:0},
  /* Casa Blanca: pure white, semi-double; the shadows warm (never grey), the base creamy, the bee pale yellow with a golden tuft */
  'casa-blanca':{fr:['#a48a6e','#d0c0a6','#e9e1d0','#f6f2e8','#fffdf8'],bk:['#9c846c','#cab89e','#e3dac8','#f2ede2','#fcfaf3'],
    bs:['#aa9068','#d4c096','#ece0c0','#f7f0da','#fffbec'],be:['#a28c46','#d0bc74','#ece0a4','#f6eec8','#fffae6'],beard:'#dcbc52',bud:'#e2e0c8',inn:3},
  /* Morning Lights: lavender, the base bluer and lighter, the tips deeper; the bee cream with a pale yellow throat */
  'morning-lights':{fr:['#4a4890','#6f6eb4','#9392d0','#b8b7e8','#dedcf8'],bk:['#3c3a80','#5f5da0','#7e7db6','#a4a3d6','#cfcfee'],
    bs:['#5a58a8','#807ec8','#aaa9e9','#c8c8f6','#e8e8fc'],be:['#8a7e46','#bcae6c','#e0d4a0','#f0e8c0','#fffae0'],beard:'#e2cc78',bud:'#8a88c8',inn:3},
  /* Black Knight: deep violet, nearly black in the shadows, the bee dark with a gold tuft */
  'black-knight':{fr:['#1c0828','#3a0f4e','#571a6e','#7a3a92','#a878bc'],bk:['#200c2c','#3c1452','#58236e','#7c4592','#aa80be'],
    bs:['#300e48','#4c1c6c','#692a8b','#8a52a8','#b090c8'],be:['#0a0608','#1e1418','#32262c','#52444a','#7a6c72'],beard:'#b89038',bud:'#5a3a78',inn:3},
  /* Blue Indulgence: double, a steel blue, the base deeper, the tips paler and brighter; the bee pale */
  'blue-indulgence':{fr:['#1e2c58','#3c4e84','#6178ae','#90a4d0','#c4d0ec'],bk:['#24305c','#42588c','#6c88c2','#98b0dc','#cad8f0'],
    bs:['#18244e','#2e4278','#495e9a','#7088c0','#a8bce0'],be:['#8a889a','#bab8c8','#e8e6f0','#f6f4fa','#ffffff'],beard:'#d8c890',bud:'#5a70a8',inn:6}};
const DLP_GRN=['#2c3c14','#4a6224','#6c843a','#94aa5c','#c4d294'];
/* the late colourways (coloris.md: 2026-10-18), appended after the old drawing's seventeen (CW_DELPH, s8a.js: ids, order and c never change) */
if(typeof CW_DELPH!=='undefined'&&!CW_DELPH.some(x=>x.id==='guardian-blue'))CW_DELPH.push(
  {id:'guardian-blue',late:15,n:'Bleu lilas (Guardian Blue)',c:'#6a52a6',bee:'#f2eef2',beard:'#e8d690'},
  {id:'casa-blanca',late:15,n:'Blanc semi-double (Casa Blanca)',c:'#f2eee4',bee:'#ece0a4',beard:'#dcbc52'},
  {id:'morning-lights',late:15,n:'Lavande à œil crème (Morning Lights)',c:'#9392d0',bee:'#f0e8c0',beard:'#e2cc78'},
  {id:'black-knight',late:15,n:'Violet nuit à œil noir (Black Knight)',c:'#571a6e',bee:'#1e1418',beard:'#b89038'},
  {id:'blue-indulgence',late:15,n:'Bleu double (Blue Indulgence)',c:'#6178ae',bee:'#e8e6f0',beard:'#d8c890',inn:6});
/* the material of a colourway: measured (DLP_CW), else built from the old drawing's c, bee and beard (the finishing step measures the rest) */
const DLP_M={};
function dlpMat(cw){const id=(cw&&cw.id)||'?';if(DLP_M[id])return DLP_M[id];const T=DLP_CW[id],c=(cw&&cw.c)||'#6a52a6',l=h2l(c)[2],pale=l>.82;
  const fr=T?T.fr:pale?[mix(c,'#5a4628',.45),mix(c,'#7a6a4a',.22),mix(c,'#d8ceb8',.12),c,mix(c,'#ffffff',.7)]
    :[mix(c,'#0a0618',.68),mix(c,'#0a0618',.38),c,mix(c,'#ffffff',.3),mix(c,'#ffffff',.62)];
  const bee=(cw&&cw.bee)||'#f2eef0',lb=h2l(bee)[2],be=T?T.be:lb<.3?[mix(bee,'#000000',.4),bee,mix(bee,'#ffffff',.12),mix(bee,'#ffffff',.25),mix(bee,'#ffffff',.4)]
    :[mix(bee,'#6a5838',.45),mix(bee,'#8a7a5a',.2),bee,mix(bee,'#ffffff',.45),mix(bee,'#ffffff',.85)],b=T?T.bud:mix(c,'#ffffff',.1);
  return DLP_M[id]={fr,bk:T?T.bk:fr.map(x=>mix(x,'#a0a0b0',.08)),bs:T?T.bs:fr.map(x=>mix(x,'#ffffff',.2)),be,beard:(T&&T.beard)||(cw&&cw.beard)||'#e2cc78',
    bud:[mix(b,'#141018',.62),mix(b,'#141018',.34),b,mix(b,'#ffffff',.3),mix(b,'#ffffff',.58)],grn:DLP_GRN,inn:T?T.inn:(cw&&cw.inn)??3,ped:'#5f7a36'}}
/* the colour of a fading delphinium (photographs 35, 40): blues and violets pale toward mauve, pinks go dusty, whites to ivory then beige,
   greens yellow (lifeCol) */
function dlpWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.18||l>.86)return mix(c,'#e8dcbc',.55*w);
  if(h>=200&&h<300)return l2h(h+(296-h)*.4*w,s*(1-.45*w),l+(.66-l)*.35*w);
  if(h>=300||h<20)return l2h(h,s*(1-.4*w),l+(.6-l)*.2*w);
  return l2h(h+(32-h)*.3*w,s*(1-.3*w),l*(1-.08*w))}
if(typeof GHI!=='undefined'&&GHI['delphinium'])GHI['delphinium'].wilt=dlpWiltCol;
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function dlpLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'delphinium',rec:{}})):0}
/* genes of one raceme (svGenes: the draws in this order) */
const DLP_GENES={n:[[32,.15],[36,.3],[40,.35],[44,.2]],
  tep:{dphi:[-.25,.25],dth:[-.12,.12],dL:[.92,1.06],dt:[-.04,.04],roll:[-.2,.2],ph:[0,6.28],W:[.92,1.08]},
  head:{phi0:[0,6.2832],div:[134,141],H:[.95,1.04],op:[-.03,.03],sd:'sd'}};
/* the delphinium for the kit */
const DLP_S={layout:'dresse',floret:'eperon',genes:DLP_GENES,mat:dlpMat,wilt:dlpWiltCol,
  dry:['#3e2c18','#64492a','#8c6c44','#b4966a','#d8c49a'],dryW:[.66,.3],stem:['#3e5a26','#5f7a36','#94aa66'],
  /* the raceme lengthens a little as it opens (h); florets from 2 % to 97 % of its height, crowded upward and smaller (taper); buds close to the
     axis, open florets facing out, nearly level; on pedicels a third of a floret long, shorter toward the tip */
  /* (comparison, 2026-10-18: photographs 14, 33, 65) the buds stand out from the axis on slender pedicels (about their own length), never packed
     against it like a grape hyacinth: th[0] .26 -> .78, pedO .7 -> .2, pedq .55 -> .3 */
  lay:{h:[.76,.24,.25,.6],z:[.02,.97],dense:.25,L:.2,taper:.2,th:[.78,1.32],thq:.1,nod:.1,nodAt:.6,droop:.1,rr:.011,coreK:.07,coreGr:.85,ped:.55,pedTh:.75,pedW:.04,pedq:.3,pedO:.2,
    /* fading: the floret whose sepals fall draws in to the axis, its three follicles erect against it (photographs 40, 287, 295) */
    wTh:[.2,.45,.4]},
  /* foot first; a floret opens over a fifth of the stage; the top fifth still buds in full bloom; the oldest fade first */
  law:{order:'acro',t0:.2,spread:.95,w:.22,ws:.5,late:.15},
  /* buds: velvety eggs, length/width 1.61 (targets bouton.hw), a soft lit side (budLit), never a glass bead */
  fl:{budAt:.3,bud:[.4,.2],budHW:1.55,budLit:.1,budCap:1,sep:.5,sepK:[.94,1,1,1.04,1.04],sepW:[.78,.9,.9,.86,.86],psi:[90,166,14,236,304],a:[.3,1.4],ap:.12,cup:.16,r0:.035,
    spur:[.5,.62,.1,.12],inn:[0,.55,.72,.85],bee:[.22,.07,.035],
    /* (comparison relay 2, photographs 53, 70) the sepal's two halves only a soft fold apart (a hard split read as cut paper), the tuft fine hairs
       (a thick yellow bar read as a mouth on the bee) */
    fold:.5,beardW:.08,
    /* (relay 3, photographs 53, 70: pointes 2.11) the sepal obovate, broadest past its middle, ending in an obtuse tip with a short point, never a
       round paddle; its margin a little wavy when fresh (crk0) */
    wp:[[0,.22],[.1,.42],[.25,.7],[.45,.92],[.62,1],[.76,.93],[.87,.68],[.95,.36],[1,.04]],crk0:.14,dec:[.15,.4],dry:[.6,.35],sag:.45,crk:.5,shed:[.1,.4],keep:.06,pod:[.32,.06],
    green:[.85,.1,.3,.45]},
  lit:[.12,.9],ao:.66,budget:[260,1500],cost:{0:1,1:[6,3],2:[18,6]}};
/* the delphinium raceme: in the frame B (its axis B[2]) at O (its middle; o.foot: its foot), D its length in bloom */
function dlpSvg(par,B,O,D,cwId,op,seed,wl,o){
  /* (comparison, photographs 33, 53, 70) on the sheets (no o: the grid's view is a flower's facing) the raceme stands up, leaning a little with
     the view, its florets facing out toward the viewer as in a vase; seen down its axis it read as a ball of buds */
  if(!o&&B&&B[2]){const V=B[2];B=basis(V3.nz([V[0]*.35,1,.1]),0);o={}}
  const cwx=(typeof CW_DELPH!=='undefined'&&CW_DELPH.find(x=>x.id===cwId))||{id:cwId,c:'#6a52a6'};
  return grDraw(par,B,O,D,DLP_S,cwx,op,seed,wl==null?dlpLife(o):wl,o||{})}
SV_HEAD['delphinium']=dlpSvg;
/* ================= The plant: a hollow, glaucous, lightly ribbed stem; palmately cut leaves; the raceme on its tip (2026-10-18) =================
   Stem (photographs 40, 42, 270): round, hollow, smooth and bluish-green (shade #2a3d19, body #5f7132, #5c6c3a), a little ribbed, softly nodded where a leaf
   leaves, downy only under the raceme (a short, pressed hair). Leaves (photographs 12, 16, 47, 106; fiche: 5 to 7 veins, L/l 1.42, outer lobes at 64.6 degrees,
   toothed): alternate, a long petiole arching out, the blade a fan of 7 (low), 5, then 3 (high) lobes, each cut into toothed segments; the upper face a
   darker matt green with a paler midrib, the underside grey-green. Fading: the leaves go limp and yellow from the tips, the stem dulls. */
const DLP_SC=['#2a3d19','#4d6428','#7f9650','#bccb92'];
/* (comparison, photograph 17) a smooth glaucous stem: no swollen ringed nodes (they read as bamboo), faint ribs, the hair nearly unseen */
/* (comparison relay 3, photograph 17) still read as banded: two faint ribs only */
DLP_SC.sv={swell:.03,section:'ribbed',ribN:12,ribD:.006,ribs:[-.35,.3],hair:null,gloss:.3,bloom:.1};
/* the free settings of the plant (fit.py: refcache/delphinium/space-plante.json) */
/* (comparison relay 4) cut:1 the plant sheet ends the stem in a clean square cut (svStemCut), never the rounded cap of the stem's outline (7.9) */
GHI['delphinium']=Object.assign(GHI['delphinium']||{},{sc:DLP_SC,sw:.05,sv:DLP_SC.sv,cut:1,
  /* (comparison, photograph 16) the hand spread wider and its lobes narrower at the foot: lobeAng 1.13 -> 1.5, lobeW .25 -> .21 (they piled up
     into a rosette) */
  /* (comparison relay 2, photograph 16) broad wedge lobes with many sharp, shallow teeth, never oak-like round lobules: lobeW .21 -> .27,
     cut .6 -> .38, teeth n [3,4] -> [5,7], sh .25 -> .8 */
  /* (comparison relay 3, photographs 16, 17, 65) the stem read as a bamboo cane (a fifth of the raceme's width; photographs: a tenth) and the
     lobes piled over each other: stem .45 -> .32, lobeAng 1.5 -> 1.75, lobeW .27 -> .24 */
  pl:{stem:.32,raceme:.82,pet:.38,blade:.62,lobeW:.24,cut:.38,lobeAng:1.75,lift:.34,arch:.14,gut:.3,sag:.5}});
const DLP_SCK={};
function dlpStemCols(wl){const y=.5*svSm((wl-.3)/.5),key=Math.round(y*20)+(DET>=1.5?'z':'');if(DLP_SCK[key])return DLP_SCK[key];
  const c=DLP_SC.map(x=>mix(x,'#8a7e42',y));c.sv=Object.assign({},DLP_SC.sv,{});return DLP_SCK[key]=c}
const DLP_BLADE={stops:[[0,'#3f5e2b'],[.5,'#58793a'],[1,'#6f9645']],bstops:[[0,'#7f9672'],[.5,'#8fa67d'],[1,'#9db08a']],shade:'#324122',lite:'#a3c868',bshade:'#3a4e2c',blite:'#c0cfa8',
  rim:'#9bb878',cast:'#0d1c08',wrap:.25,amb:.3,dif:.7,sky:.16,trans:.1,ks:.08,gloss:12,dark:[.86,.68,.5],da:.26,lit:[1.12],la:.2,darkLo:[.72],daLo:.32,litLo:[],laLo:.22,rw:.004,ro:.15,soft:.06};
const DLP_WILT={y:'#b8ac56',b:'#7a5a34',k:[.28,.45]};
/* one cauline leaf (STEML's hook): the petiole leaves the stem at ang (screen), arches out and the blade, a fan of cut lobes, hangs from its end */
function dlpLeafSv(par,x,y,ang,len,o){const P=GHI['delphinium'].pl,s=o.s>0?1:-1,k=G(par),wl=dlpLife(),kk=o.k||0,pl=len*P.pet,w0=Math.max(.4,len*.024)*(1-.12*kk),C=[],W=[];
  const sag=P.sag*svSm((wl-.2)/.6)+P.arch;let p=[x,y];
  for(let i=0;i<=12;i++){const t=i/12;if(i){const dx=Math.cos(ang),dy=Math.sin(ang)+sag*t*.9,l=Math.hypot(dx,dy)||1;p=[p[0]+dx/l*pl/12,p[1]+dy/l*pl/12]}C.push(p);W.push(w0*(1-.4*t))}
  stemPoly(k,C,W,dlpStemCols(wl));const e=C[C.length-1],e0=C[C.length-3],hd=[e[0]-e0[0],e[1]-e0[1]],hl=Math.hypot(hd[0],hd[1])||1;
  const H=V3.nz([hd[0]/hl,-hd[1]/hl,.3-.25*svSm((wl-.3)/.5)]),A=[0,.5,.86],d=V3.dot(A,H),U=V3.nz([A[0]-H[0]*d,A[1]-H[1]*d,A[2]-H[2]*d]);
  const nl=kk<2?5:3,L7=[[-1.2,.66],[-.8,.88],[-.4,.98],[0,1],[.4,.98],[.8,.88],[1.2,.66]],L5=[[-1.13,.76],[-.57,.95],[0,1],[.57,.95],[1.13,.76]],L3=[[-.8,.8],[0,1],[.8,.8]],
    lobes=(nl===7?L7:nl===5?L5:L3).map(([an,l])=>[an*P.lobeAng/1.13,l]);
  /* (comparison relay 4, photographs 16, 17) the lobes' broad feet overlapped into a pale rosette at the centre of the hand and the narrow lobes
     with a regular saw read as a hemp leaf: each lobe now narrows to a short wedge stalk at the palm (stalk), broader in its body (lobeW .3),
     fewer, coarser and less even teeth; the midrib a soft line, never a pale stripe */
  svCutLeaf(k,{base:[e[0],-e[1],0],H,U,len:len*P.blade,sd:svSeed('delphinium-feuille',Math.round(x*8),Math.round(y*8),kk),wl,mat:DLP_BLADE,wilt:DLP_WILT,lobes,lobeJ:.1,w:P.lobeW*1.7,vb:.5,
    stalk:[.1,.14],stalkW:.022,lobeL:[.86,1.08],
    /* (comparison relay 5, photograph 16) the even saw still read as a comb (a fern, a hemp leaf): each sinus its own depth (jit .55),
       some deep incisions between shallow teeth, different from lobe to lobe and leaf to leaf (sd from the leaf's place, no draw) */
    inc:{n:[2,3],dp:P.cut*1.65,sh:.3,from:.24,to:.92,jit:.3,sd:Math.round(x*8+y*5+kk*11)%97},side:[0,0],sideP:1,up:.1,limp:[.2,.55],gut:[P.gut*.4,.2],tw:[.06,.1],nu:[3,4],nv:[6,10],mid:['#8eae68','#b8c8a0',.18,.12]});return k}
/* (main session, judge's refusal 2026-10-18, photographs 16, 65) the leaves read as fern fronds: a palmate hand of broad lobes, each cut into two or
   three coarse pointed segments (inc n [2,3], deep), its veins faint; on the stem they are shorter (18 cm) and spaced up to the raceme */
STEML['delphinium']={shape:'lance',n:[3,4],len:18,w:.3,col:'#5c7a44',up:42,arr:'alt',sv:dlpLeafSv};
/* the plant: the old drawing's chance is drawn on a scratch group first (the bouquet's composition does not move: rtest), then the kit's head with
   its own chance; the raceme stands on the end of the stem (its foot at the apex), the stem is cut below it by the bouquet or the board */
function dlpPlant(g,t,o,old){const cw=cwPick(CW_DELPH,o),bel=cw.f==='bel',op=Math.max(.05,Math.min(1,o.op??.9)),P=GHI['delphinium'].pl;
  {const tmp=G(g);try{old(tmp,t,o)}finally{tmp.remove()}}
  const k=G(g),wl=dlpLife(o),Dm=(bel?4.6:6)*UPC,Lf0=(o.cm||50)*UPC*(bel?.76:1),D=Math.min(Lf0*P.raceme,o.spine?blen(o.spine)*.4:1e9),sd=svSeed('delphinium-plante',cw.id,Math.round(Lf0)),r0=rnd,rg=svRng(sd);let r;
  rnd=()=>rg();
  const o2=o.ax&&!o.up&&!o.spine?Object.assign({},o,{ax:V3.nz([.04,1,.28])}):o;/* on the board the raceme stands up (the head's own view axis is for a flower) */
  try{r=lsHeadS(k,o2,{D,w:Dm*P.stem/1.18,cols:dlpStemCols(wl),op,rr:.5,nodes:0,lp:.06,aimK:.1,wig:.02,e:.03,
    flower:(par,B,O,D2,op2)=>dlpSvg(par,B,O,D2,cw.id,op2,svSeed('delphinium',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D2*8)),wl,{foot:1})})}
  finally{rnd=r0}
  if(r)r.ncols=dlpStemCols(wl);open(k,t,1000,10,.3);return r}
if(typeof GH!=='undefined'&&GH['delphinium']){const dlpOld=GH['delphinium'];GH['delphinium']=function(g,t,o){return typeof SV_ON!=='undefined'&&SV_ON?dlpPlant(g,t,o,dlpOld):dlpOld(g,t,o)}}
