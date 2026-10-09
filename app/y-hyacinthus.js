/* ================= Pilote, lot 3 : la jacinthe (Hyacinthus orientalis) en SVG natif (y-hyacinthus.js) =================
   Measured on photographs (refcache/jacinthe: brief.md, coloris.md, the growers' studio photographs; REFERENCES-jacinthe.md): an upright, dense
   raceme of 28 to 36 waxy florets on a stout fleshy scape, opening from the foot up; the top buds stay closed longest, green when young, then the
   variety's colour paler. A floret: a short tube swollen at its foot, six lobes (two whorls of three, the outer a little broader), spreading then
   curled back at their tips; on the inside a darker midrib, wide at the foot, and a paler margin (Delft Blue lilac-lavender, Pink Pearl magenta
   rose); the throat dark, small pale yellow anthers. The raceme: height over width 1.8 to 2.2 in full bloom (studio photographs), 2.5 to 3 half
   open, the florets standing at 10 to 20 degrees from the axis as buds, 60 to 75 open, the lower ones nodding. Fading (photographs 6, 166, 167; the
   order foot first and the decline colours are deduced, not photographed): the florets go limp, pale and grey, then dry to a papery brown, their
   lobes rolled into tight ringlets; they stay on the scape, which stays green and upright. Leaves: 4 to 6, strap-shaped, channelled, sheathing,
   bright green (the plant, v2, below: a cut stem, never a bulb). The kit (y3-grappe.js) draws the raceme; this sheet gives only the hyacinth's numbers. */
/* the colourways measured (studio photographs of Jan de Wit en Zonen, five lightness bands: shadow, dark, median, light, highlight; coloris.md for
   the margin, the throat, the buds): fr the inner face, bk the outer, mid the midrib, edge the pale margin, throat, anth, bud */
const HYA_CW={
  bleu:{fr:['#2c2656','#5d5290','#8a7cb6','#ab9dd2','#d2c7ee'],bk:['#34305e','#655c98','#9388bf','#b5abd8','#d9d1f2'],mid:'#55489c',edge:'#d8d0f2',throat:'#2a2350',bud:'#8a7ec8'},
  'bleu-nuit':{fr:['#18174a','#38357e','#5e58aa','#8780d0','#bdb3f6'],bk:['#201e52','#423e88','#6a64b2','#9089d4','#c4bcf6'],mid:'#2c2878',edge:'#b6aef0',throat:'#16143e',bud:'#8a82d4'},
  violet:{fr:['#0e0830','#22185a','#3c2f84','#5c4cb0','#8c7ad8'],bk:['#181040','#2e2266','#4c3e92','#7060c0','#a090e6'],mid:'#20165a',edge:'#8e7cd8',throat:'#0e0828',bud:'#5a46ac'},
  mauve:{fr:['#4a2446','#8a5684','#a87aa4','#c6a2c2','#ead2e8'],bk:['#52304e','#90608a','#ae84aa','#caaac6','#ecd8ea'],mid:'#7a4472',edge:'#e6d0e4',throat:'#462c3d',bud:'#8c6a8c'},
  rose:{fl:{lw:.2,a1:[-.26,3.55],sweep:.7,tw:1.6,js:.6},fr:['#560f28','#9c2560','#c4408a','#dc5eaa','#f49ad4'],bk:['#5e1830','#a03866','#ca5c94','#e584bc','#f7bede'],mid:'#a01e5c',edge:'#f6bedc',throat:'#5c1a34',bud:'#e07a9c'},
  'rose-pale':{fr:['#80385a','#b46e96','#ca94b6','#dcb4d0','#f2d8ec'],bk:['#86425e','#b8789c','#cc9cba','#dfbad4','#f4def0'],mid:'#a2668c',edge:'#f6e4f0',throat:'#824e64',bud:'#dcb0c8'},
  fuchsia:{fr:['#640a10','#a20f22','#bc2240','#d03a5e','#ea6a90'],bk:['#6a1018','#a61a2c','#c0304a','#d44a68','#ec7898'],mid:'#8a0c1e',edge:'#e8728e',throat:'#4a0810',bud:'#c8305a'},
  blanc:{fr:['#7d806a','#b4b6a8','#dcdcd2','#efefe8','#fcfcf8'],bk:['#7a8068','#b0b6a2','#d6dacb','#eaeee2','#f8faf2'],mid:'#cdd0bc',edge:'#ffffff',throat:'#9a9c80',bud:'#e6e6d2',anth:'#d8c870'},
  creme:{fr:['#8a7a26','#c4b25a','#dacb84','#ebdfa6','#f8f2cc'],bk:['#8a7e30','#c4b660','#dacd8a','#ece2aa','#f8f4d0'],mid:'#c4ae4a',edge:'#f8f2d0',throat:'#968f2a',bud:'#e1d587',anth:'#d8b840'},
  saumon:{fr:['#7e3e24','#ba7052','#cc907a','#dcae9e','#f2ccc4'],bk:['#84442a','#bc7658','#ce9682','#deb2a4','#f2d0c8'],mid:'#b06048','edge':'#f6d8d0',throat:'#914d37',bud:'#eaa868'},
  pourpre:{fr:['#300a1a','#5a163a','#7a2c5e','#9c4888','#c87ec0'],bk:['#36101e','#601c40','#803466','#a2508e','#cc86c4'],mid:'#4a0e30',edge:'#b46aa8',throat:'#250818',bud:'#9a3a7e'}};
/* the late colourways (KAVB names, level B; coloris.md: the proposals): the same bands from the measures (throat = shadow, lobe = dark, the median between the lobe and the pale margin) */
Object.assign(HYA_CW,{
  magenta:{fr:['#72276e','#a650a4','#be6bbd','#da9eda','#e9c4e8'],mid:'#a650a4',edge:'#e9c4e8',throat:'#72276e',bud:'#9b4392'},
  'violet-pourpre':{fr:['#44235e','#7a499d','#9e6ebe','#c8a4df','#dec9ec'],mid:'#7a499d',edge:'#dec9ec',throat:'#44235e',bud:'#793b84'}});
const HYA_GRN=['#2a3a14','#4a6a26','#6c9838','#98bc58','#c6dc8a'];
/* the material of a colourway for the kit: its ramps (the buds' from their colour) */
const HYA_M={};
function hyaMat(cw){const id=cw&&cw.id;if(HYA_M[id])return HYA_M[id];const S=HYA_CW[id]||(()=>{const c=(cw&&cw.c)||'#8a7cb6';return{fr:[mix(c,'#100818',.7),mix(c,'#100818',.38),c,mix(c,'#ffffff',.25),mix(c,'#ffffff',.55)],
    mid:mix(c,'#100818',.35),edge:mix(c,'#ffffff',.6),throat:mix(c,'#100818',.65),bud:mix(c,'#ffffff',.15)}})(),b=S.bud;
  return HYA_M[id]=Object.assign({},S,{bk:S.bk||S.fr,bud:[mix(b,'#141018',.62),mix(b,'#141018',.34),b,mix(b,'#ffffff',.3),mix(b,'#ffffff',.58)],grn:HYA_GRN,anth:S.anth||'#c8bc6a',
    /* the dark varieties' rachis flushed like their scape (the kit's m.stem) */
    stem:typeof HYA_SCT!=='undefined'&&HYA_SCT[id]?hyaScCols(id).ax:undefined})}
/* the colour of a fading hyacinth (deduced: no photograph of a fading blue or pink raceme was found; the dried tissue is measured on photograph 6):
   blues and violets pale and grey toward a lilac grey; pinks, reds and purples go dusty; whites and creams to ivory; greens yellow (lifeCol) */
function hyaWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.16||l>.86)return mix(c,'#ece2c6',.6*w);
  if(h>=200&&h<300)return l2h(h+(288-h)*.35*w,s*(1-.5*w),l+(.6-l)*.3*w);
  if(h>=300||h<20)return l2h(h,s*(1-.42*w),l+(.56-l)*.18*w);
  return l2h(h+(32-h)*.3*w,s*(1-.32*w),l*(1-.08*w))}
if(typeof GHI!=='undefined'&&GHI['jacinthe'])GHI['jacinthe'].wilt=hyaWiltCol;
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function hyaLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'jacinthe',rec:{}})):0}
/* genes of one raceme (svGenes: the draws in this order) */
const HYA_GENES={n:[[28,.1],[30,.18],[32,.26],[34,.26],[36,.2]],
  tep:{dphi:[-.3,.3],dth:[-.22,.22],dL:[.92,1.06],dt:[-.04,.04],roll:[-.3,.3],roll2:[0,1.047],W:[.9,1.1],cup:[.85,1.15],curl:[.85,1.15],ph:[0,6.28],tw:[-1,1]},
  head:{phi0:[0,6.2832],div:[134,141],H:[.95,1.04],op:[-.03,.03],sd:'sd'}};
/* the hyacinth for the kit */
const HYA_S={layout:'dresse',floret:'clochette',genes:HYA_GENES,mat:hyaMat,wilt:hyaWiltCol,
  dry:['#3a1f0b','#5d441d','#80603c','#a8865e','#d2b48e'],stem:['#3c5e2c','#5f8a42','#9cc474'],
  /* the raceme lengthens as it opens (h); florets from 3 % to 90 % of its height, crowded upward; 10 to 20 degrees as buds, 60 to 75 open */
  lay:{h:[.6,.4,.3,.6],z:[.03,.9],dense:.3,L:.34,taper:.4,th:[.36,1.25],thq:.32,nod:.3,nodAt:.55,droop:.22,rr:.045,ped:.12},
  /* foot first; a floret opens over a fifth of the stage; the top tenth still buds in full bloom; the oldest fade first; the buds go on opening */
  law:{order:'acro',t0:.25,spread:.82,w:.24,ws:.5,late:.18},
  fl:{budAt:.22,bud:[.62,.25],budHW:1.55,tube:.44,r:[.075,.15,-.02],lobe:.66,lg:[.6,.4],lw:.26,wO:1.1,a0:[-.06,1.1],a1:[-.26,3.0],ap:1.8,cup:.36,sweep:.25,tw:.5,jl:.14,ja:.4,js:.35,mouth:.5,throatL:.3,
    sag:.55,curl:3.4,dec:[.12,.4],dry:[.5,.3],green:[.9,.03,.15,.08],wMin:.3},
  /* waxy and bright: the light lifted (lit [base, range]), the shade inside the raceme soft (ao) */
  lit:[.2,.9],ao:.72,budget:[170,320],cost:{2:[8,4],1:[3,2]},
  /* the dried ringlets' path written once, stroked two or three times by reference (the kit's S.reuse) */
  reuse:1};
/* the hyacinth raceme: in the frame B (its axis B[2]) at O (its middle; o.foot: its foot), D its length in bloom */
function hyaSvg(par,B,O,D,cwId,op,seed,wl,o){const cwx=(typeof CW_HYA!=='undefined'&&CW_HYA.find(x=>x.id===cwId))||{id:cwId,c:'#8a7cb6'};
  return grDraw(par,B,O,D,HYA_S,cwx,op,seed,wl==null?hyaLife():wl,o||{})}
SV_HEAD['jacinthe']=hyaSvg;
/* ---------- the plant, v2 (2026-10-08): a cut stem with its leaves, never a bulb (STANDARD-RENDU 4 ter, 8 bis and 8 ter) ----------
   Measured (refcache/jacinthe/REFERENCES-jacinthe-organes.md: photograph 1, a cut stem on white; the growers' studio photographs; the IBC guide to
   cut hyacinths):
   - the scape: round, fleshy, smooth with fine striae, satin; its width .1 to .2 of the raceme's (photograph 1 .095, Jan de Wit .2), even, a little
     stouter at its foot; green, a little olive (photograph 1: #73893e, light #8ca152, shade #59614a; 51: #88b255, #668934; matched to the kit's axis #5f8a42 where it enters the raceme), flushed toward the raceme with the variety's colour
     (Woodstock, Peter Stuyvesant maroon nearly to the leaves; Blue Jacket, Jan Bos flushed; Delft Blue, Pink Pearl barely; the pale ones green);
   - the leaves: at least four on a cut stem (the auction's norm; five here), all from the foot, each sheathing the scape and the leaves inside it,
     the foot a tight pale bundle three to four times the scape's width; broad straps (length over width 7), deeply channelled, the tip blunt and
     hooded; erect along the scape (10 degrees), the tips flaring to 20 to 30, reaching the raceme's foot, never above it (the auction's norm);
     glossy bright green above, a duller paler green below along its keel, the foot yellow-green then ivory;
   - the cut (deduced: the shop sells cut stems, the bulb is never shown): oblique, the scape's pale flesh ringed by the leaves' sheaths;
   - fading (photographs 6, 166; the limp leaf deduced): the leaves go limp, arch and hang, yellow from the tip, then dry and curl; the scape stays
     upright, olive.
   The bouquet's chance is consumed as the old drawing did (the leaves' lengths, then 27 draws where the bulb drew its roots); all the rest comes
   from the plant's own seed. */
const HYA_SC=['#34501e','#5f863e','#92b662','#cfe2a8'];HYA_SC.sv={swell:.025,gloss:.4,ribs:[-.62,-.22,.2,.58]};
/* the variety's flush toward the raceme: [colour, strength, where it starts (0 the foot, 1 the raceme)]; the green-stemmed ones (Delft Blue, Pink
   Pearl, the pale ones) none, their scape meeting the kit's green axis */
const HYA_SCT={pourpre:['#3c1230',.72,.08],violet:['#2c1a44',.62,.12],'bleu-nuit':['#382a58',.42,.35],fuchsia:['#5e1626',.42,.35],mauve:['#5a3a58',.16,.55]};
/* the scape's colours of a colourway: lo even (the bouquet's stem below the plant), hi with its flush toward the raceme, ax the rachis' (flushed) */
const HYA_SCK={};
function hyaScCols(id){if(HYA_SCK[id])return HYA_SCK[id];const t=HYA_SCT[id],lo=t?HYA_SC.map(c=>mix(c,t[0],t[1]*t[1]*.45)):HYA_SC.slice();lo.sv=HYA_SC.sv;
  const hi=lo.slice();hi.sv=Object.assign({},HYA_SC.sv,t?{red:t[0],redA:t[1],redF:t[2]}:{});
  return HYA_SCK[id]={lo,hi,ax:t?[mix(lo[0],t[0],t[1]),mix(lo[1],t[0],t[1]),mix(lo[2],t[0],t[1]*.8)]:null}}
/* a leaf: a broad strap, channelled, hooded at its blunt tip, glossy above, matt and paler below along its keel; its foot sheathing at radius sr */
const HYA_LEAF={w:.15,wp:[[0,.6],[.1,.62],[.32,.84],[.6,1],[.8,.96],[.9,.82],[.96,.55],[1,0]],sheath:.2,tw:.25,gut:.72,wav:.018,wavN:2,hood:.5,bloom:.12,
  up:'#568a2a',low:'#76a04a',base:'#a8c860',shade:'#20360a',bshade:'#2e4a18',veinLo:1,nv:13};
/* below DET 1.5 (the shop's size, budget 50 KB a stem): no parallel veins, fewer rows, one dark wash */
const HYA_LEAF_LO={veinLo:0,nv:11,mLo:{dark:[.7],darkLo:[.7]}};
/* fading, the leaf goes limp beyond the kit's own sag: it leans out and its blade arches over and hangs (deduced: no photograph of a limp leaf) */
const hyaLimp=(l,d,wl)=>{const w=svSm((wl-.5)/.45);return[l*(1+.4*w),Math.min(.9,d+.12*w)]};
function hyaLeaf(par,pos,up,Out,len,sr,lean,droop,sd,wl){const[l,d]=hyaLimp(lean,droop,wl);
  return svStrapLeaf(par,pos,up,Out,Object.assign({},HYA_LEAF,{len,sr,lean:l,droop:d,sd,wl,dry:.85*svSm((wl-.6)/.35),dryC:'#9c7e46'},DET<1.5?HYA_LEAF_LO:{}))}
/* the foot (sheet only, the plant upright): the outer sheath round the bundle, its mouth slanting, cut obliquely toward the viewer (22 degrees):
   the cut face shows the leaves' sheaths in rings round the scape's pale flesh and its ring of bundles; ivory below, yellow-green up the sheath */
function hyaFoot(par,F,rS,R,hb,srs,sd){const r=svRng(sd),ta=Math.tan(.38),g=G(par),m=r.in(-.3,.3),topC='#a8c860',
    body=[];for(let i=0;i<=6;i++){const x=-R+2*R*i/6;body.push([F[0]+x,F[1]-hb*(1+m*x/R)])}
  for(let i=0;i<=8;i++){const t=Math.PI*i/8;body.push([F[0]+R*Math.cos(t),F[1]-R*ta*Math.sin(t)])}
  const gh='hf'+(gid++),b=E('linearGradient',{id:gh,gradientUnits:'userSpaceOnUse',x1:svF(F[0]-R),y1:0,x2:svF(F[0]+R),y2:0},GDEF||defs);
  stops(b,[[0,'#7e9a48'],[.3,'#d6e2a2'],[.55,topC],[1,'#5e7a30']]);E('path',{d:'M'+body.map(p=>svJ([svR(p[0]),svR(p[1])])).join('L')+'Z',fill:`url(#${gh})`},g);
  /* the sheath's parallel veins, its mouth's pale rim */
  let dv='';for(const u of[-.78,-.52,-.26,.02,.3,.56,.8]){const x=F[0]+u*R,y0=F[1]-R*ta*Math.sqrt(1-u*u)*.98,y1=F[1]-hb*(1+m*u)+hb*.06;dv+='M'+svJ([svR(x),svR(y0)])+'L'+svJ([svR(x+u*R*.04),svR(y1)])}
  E('path',{d:dv,fill:'none',stroke:'#7e9846','stroke-width':svF(R*.035),'stroke-opacity':.35},g);
  E('path',{d:'M'+body.slice(0,7).map(p=>svJ([svR(p[0]),svR(p[1])])).join('L'),fill:'none',stroke:'#eef2d2','stroke-width':svF(R*.06),'stroke-opacity':.8,'stroke-linecap':'round'},g);
  /* the cut face: the sheaths' rings, the scape's flesh, its ring of bundles */
  const ea=rr=>{const a=svR(rr),b=svR(rr*ta);return'M'+svJ([svR(F[0]-rr),svR(F[1])])+'a'+a+','+b+' 0 1 0 '+svR(2*rr)+',0a'+a+','+b+' 0 1 0 '+svR(-2*rr)+',0'};
  E('path',{d:ea(R),fill:'#eef0d4',stroke:'#9cb064','stroke-width':svF(R*.04)},g);
  let dr='';for(const s of srs)dr+=ea(s);E('path',{d:dr,fill:'none',stroke:'#a8bc72','stroke-width':svF(R*.028),'stroke-opacity':.7},g);
  E('path',{d:ea(rS),fill:'#d2e2a2',stroke:'#7e9a48','stroke-width':svF(rS*.08)},g);
  let dd='';for(let i=0;i<11;i++){const t=(i+r.in(0,.6))/11*6.2832,rr=rS*r.in(.6,.82),x=F[0]+rr*Math.cos(t),y=F[1]-rr*ta*Math.sin(t);dd+='M'+svJ([svR(x),svR(y)])+'h.01'}
  E('path',{d:dd,fill:'none',stroke:'#8ea65a','stroke-width':svF(rS*.13),'stroke-linecap':'round','stroke-opacity':.8},g);return g}
/* the hyacinth plant in SVG (hyaPlant's branch when SV_ON): the raceme by the kit, the scape a lit cylinder flushed toward it; on the sheet the
   leaves, all from the foot, and the cut foot */
function hyaSvPlant(k,t,o,X){const{res,apex,cw,op,D,sheet,up,face,n,ph0}=X,wl=hyaLife(o),c0=res.chains[0],ci=lsCut(res,apex),top=c0.pts[c0.pts.length-1],SC=hyaScCols(cw.id);
  for(const ch of res.chains)ch.c=SC.lo;
  /* the scape's width (photographs 1 and 124: .095 and .12 of the raceme's): .055 D, a little stouter at its foot, swelling over its last tenth into
     the raceme's fleshy axis (the kit's, .09 D); set on the chain itself, so the bouquet's stem below follows */
  {const P=c0.pts,ac=[0];for(let i=1;i<=ci;i++)ac.push(ac[i-1]+V3l(V3s(P[i],P[i-1])));const Lc=ac[ci]||1;
    for(let i=0;i<=ci;i++){const t=ac[i]/Lc;c0.ws[i]=D*(.055*(1+.1*(1-t))+.035*svSm((t-.88)/.12))}}
  /* on the sheet the scape starts a node above the cut (its rounded end hidden in the sheaths; the cut face shows its flesh) */
  const Z=V3l(V3s(top,apex))>1e-3?V3.nz(V3s(top,apex)):up,Bf=frZ(Z,face,0),seed=svSeed('jacinthe',cw.id,n,Math.round(ph0*100)),i0=sheet?1:0,res2={chains:[{pts:c0.pts.slice(i0,ci+1),ws:c0.ws.slice(i0,ci+1),c:SC.hi,ord:0}].concat(res.chains.slice(1)),organs:res.organs};
  /* the leaves sheathe one another round the scape: the outermost (the L-system's first) widest; two younger ones inside, between them */
  let lk=0;const foot=c0.pts[0],rS=c0.ws[0]/2,lay=[4,3,2],srOf=l=>rS*(1.1+.45*l),srs=[];
  lsPlant(k,res2,{O:[0,0,0],apex,cols:SC.hi,piece:99,organ:(og,pos)=>{
    if(og.t==='N0')return{parts:[{z:pos[2]+Z[2]*D*.5,fn:par=>hyaSvg(par,Bf,pos,D,cw.id,op,seed,wl,{foot:1})}]};
    if(og.t==='Lv'){const len=D*R(.8,1)*1.2,kk=lk++,sd=svSeed('jacinthe-feuille',cw.id,n,kk),r=svRng(sd+3),Hh=V3s(og.H,V3.sc(up,V3.dot(og.H,up))),
        O0=V3l(Hh)>1e-3?V3.nz(Hh):[1,0,0],Out=V3.nz(V3.add(O0,[0,0,.2])),parts=[],l0=lay[kk]||2;srs.push(srOf(l0));
      parts.push({z:pos[2]+Out[2]*len*.3,fn:par=>hyaLeaf(par,pos,up,Out,len,srOf(l0),r.in(.2,.28),r.in(.22,.3),sd,wl)});
      /* a younger leaf inside, halfway to the next */
      if(kk<2){const O2=V3.nz(V3.add(rotA(O0,up,Math.PI*(.34+.06*r())),[0,0,.2])),len2=len*r.in(.94,1.04),l2=1-kk;srs.push(srOf(l2));
        parts.push({z:pos[2]+O2[2]*len2*.3,fn:par=>hyaLeaf(par,pos,up,O2,len2,srOf(l2),r.in(.12,.18),r.in(.16,.22),sd+9,wl)})}
      return{ext:1,parts}}
    return null}});
  /* where the bulb drew its roots (the chance as before), the cut foot */
  if(sheet){for(let i=0;i<27;i++)R();hyaFoot(k,[foot[0]-apex[0],-(foot[1]-apex[1])],rS,srOf(4.2),D*.06,srs,seed+7)}
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
