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
  'guardian-blue':{fr:['#2a1a58','#47328a','#6a52a6','#9180c6','#c4b8ea'],bk:['#342a62','#544893','#7466b2','#9a8fcf','#ccc4ec'],
    bs:['#3e3a88','#5e5aae','#837ec8','#aaa6de','#d4d2f2'],be:['#8e8496','#c2bac8','#e4dee6','#f4f0f4','#fffcfe'],beard:'#e8d690',bud:'#7a68c4',inn:3},
  /* Casa Blanca: pure white, semi-double; the shadows warm (never grey), the base creamy, the bee pale yellow with a golden tuft */
  'casa-blanca':{fr:['#a48a6e','#d0c0a6','#e9e1d0','#f6f2e8','#fffdf8'],bk:['#9c846c','#cab89e','#e3dac8','#f2ede2','#fcfaf3'],
    bs:['#aa9068','#d4c096','#ece0c0','#f7f0da','#fffbec'],be:['#a28c46','#d0bc74','#ece0a4','#f6eec8','#fffae6'],beard:'#dcbc52',bud:'#e2e0c8',inn:3}};
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
  lay:{h:[.76,.24,.25,.6],z:[.02,.97],dense:.25,L:.2,taper:.2,th:[.26,1.32],thq:.1,nod:.1,nodAt:.6,droop:.1,rr:.016,ped:.42,pedTh:.75,pedW:.04,pedq:.55,pedO:.7,
    /* fading: the floret whose sepals fall draws in to the axis, its three follicles erect against it (photographs 40, 287, 295) */
    wTh:[.2,.45,.4]},
  /* foot first; a floret opens over a fifth of the stage; the top fifth still buds in full bloom; the oldest fade first */
  law:{order:'acro',t0:.2,spread:.95,w:.22,ws:.5,late:.15},
  /* buds: velvety eggs, length/width 1.61 (targets bouton.hw), a soft lit side (budLit), never a glass bead */
  fl:{budAt:.3,bud:[.4,.2],budHW:1.55,budLit:.1,budCap:1,sep:.5,sepK:[.94,1,1,1.04,1.04],sepW:[.78,.9,.9,.86,.86],psi:[90,166,14,236,304],a:[.3,1.4],ap:.12,cup:.16,r0:.035,
    spur:[.5,.62,.1,.12],inn:[0,.55,.72,.85],bee:[.13,.07,.035],dec:[.15,.4],dry:[.6,.35],sag:.45,crk:.5,shed:[.2,.65],keep:.1,pod:[.32,.06],
    green:[.85,.1,.3,.45]},
  lit:[.12,.9],ao:.66,budget:[260,1500],cost:{0:1,1:[6,3],2:[18,6]}};
/* the delphinium raceme: in the frame B (its axis B[2]) at O (its middle; o.foot: its foot), D its length in bloom */
function dlpSvg(par,B,O,D,cwId,op,seed,wl,o){const cwx=(typeof CW_DELPH!=='undefined'&&CW_DELPH.find(x=>x.id===cwId))||{id:cwId,c:'#6a52a6'};
  return grDraw(par,B,O,D,DLP_S,cwx,op,seed,wl==null?dlpLife(o):wl,o||{})}
SV_HEAD['delphinium']=dlpSvg;
