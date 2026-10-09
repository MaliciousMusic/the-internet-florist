/* ================= Pilote : narcisse-bouquet (Narcissus division 8, Tazetta), sorte du module de genre y-narcissus.js =================
   From the photographs (refcache/narcisse-bouquet: brief.md, organes.md, kept.jpg; journal.md for the measures) and the old drawing (s106a.js,
   l106NbPlant), a tazetta for the bouquet: several small scented flowers in an umbel at the top of a solid scape, out of a papery spathe.
   - one flower (svBloom, SVN_TAZETTA): six broad, overlapping tepals spread flat round a short cup (svCorona, y3-couronne.js: Avalanche's cup is
     large for a tazetta, its mouth .37-.45 of the perianth across on the growers' photographs 88 and 89; .22 on the wild tazetta 29), short
     stamens deep in the cup, behind it a long slender floral tube and the green ovary (40: tube and ovary ~.5 of the flower long, the ovary a dark
     green knob, 88);
   - the umbel (nbqSvPlant, l106NbPlant's own turtle and draws): pedicels of unequal length from the spathe, the oldest flowers outermost and
     turned out, the young buds erect in the middle, then nodding as they grow (papyraceus, same section: refcache/nbq-boutons 28-30); the spathe
     a translucent green-white sheath round the young umbel (nbq-boutons 3), split, then dry and papery, standing beside the umbel (9, 10, 88);
   - each flower has its own level of detail (NBQ_COST, NBQ_BUDGET): the whole engine for the best placed, one flat region per sheet (nbqLean)
     for the others, one outline for the smallest, within the shop's budget per stem;
   - fading (44, 45, 82): the tepals go limp, cream then papery, crinkle and hang; the cup keeps its yellow longer and browns from the rim; the
     scape stays green longest and bows under the umbel (stem drawn alone).
   Keys of the materials: NARM 'nar-taz-<id of CW_L106NB>' (fleur-finition adds one line per colourway; the cup is its own colour: c, ci, th, cr,
   cb, cs, cl). */
/* ---------- the materials (NARM's fields, y-narcissus.js) ---------- */
/* Avalanche (8 W-Y; Jacques Amand 88, Van Engelen 89): a white perianth, faintly green-cream at the throat; a lemon cup, deeper and warmer inside
   (refs.py pal 89: lit #efda33, inside #c79c06, rim highlight #e8de8c), orange-yellow anthers in the cup */
NARM['nar-taz-avalanche']={t:'#f6f5ee',tb:'#ecebdf',tg:'#dcdeb4',ti:'#f9f9f4',sh:'#8c9084',li:'#ffffff',c:'#f0d630',ci:'#e4c21a',th:'#c49a08',cr:'#f4dc42',
  cb:'#d4cc4c',cs:'#86660a',cl:'#fff08c',an:'#e4a01c',fi:'#e2e2ae',sg:'#ebe8bc'};
/* The other colourways, measured by hand on one isolated flower of each vendor photograph (refcache/narcisse-bouquet-coloris, photo numbers below;
   tables in refcache/narcisse-bouquet/finition/m1.txt, m2.txt: cup throat = darkest fifth, wall = median, lit = brightest tenth; perianth = bright
   low-saturation ring round the cup). The photographs are dark or tinted (a cool or a warm cast, whites at .75-.9 of pure white), so a white
   perianth is read as ivory, cream or pure white by its chroma only, never its lightness; the engine darkens a little, so the lit values serve for
   the body. Levels: Geranium A; Ziva, Minnow, Cragford, Silver Chimes, Martinette, Golden Dawn B; Grand Soleil d'Or, Chinese Sacred Lily C. */
/* Ziva (8 W-W; photo 2, clumps, the cup is not legible): a pure white perianth, a white cup with a cream-yellow throat */
NARM['nar-taz-paperwhite']={t:'#f9f9f5',tb:'#f0f0ea',tg:'#e4e8cc',ti:'#fcfcf9',sh:'#949a90',li:'#ffffff',c:'#faf7e8',ci:'#f4efd8',th:'#e0d696',cr:'#fdfbf0',
  cb:'#e8e4c0',cs:'#bcb088',cl:'#fffcea',an:'#e6b02c',fi:'#e6e6c0',sg:'#ecebc4'};
/* Geranium (8 W-O; photos 3, 4, 5, 6): an ivory-white perianth, a small bright orange cup (wall #ec860e, throat #be6506 on the best exposed
   photograph 6; redder, #d05931, on the cool-lit photo 5) */
NARM['nar-taz-geranium']={t:'#f8f6ee',tb:'#ece9dc',tg:'#dedcb0',ti:'#faf8f0',sh:'#968e72',li:'#ffffff',c:'#ff9a22',ci:'#fc8a10',th:'#c8660a',cr:'#ffb040',
  cb:'#e49a36',cs:'#7c3604',cl:'#ffc882',an:'#e4981c',fi:'#e2dcae',sg:'#ebe6bc'};
/* Minnow (8 W-Y; photos 7, 8): a cream-white perianth with a faint lemon cast (photo 8 #edf0db, lit #f9fde2; photo 7 #dad699), a small lemon cup,
   greener than Avalanche's (wall #ddc641 and #cbbc4b, throat #a89833, lit #f8ed98) */
NARM['nar-taz-minnow']={t:'#f6f3d6',tb:'#efecce',tg:'#e0e0b0',ti:'#f9f7e6',sh:'#a09c80',li:'#fffff0',c:'#f2e66a',ci:'#ecd74e',th:'#bca838',cr:'#f6ee84',
  cb:'#d2d070',cs:'#847a10',cl:'#fcf6a0',an:'#e4b82a',fi:'#e2e2ae',sg:'#e9e8b8'};
/* Grand Soleil d'Or (8 Y-O; photo 9, level C, one photograph): a golden-yellow perianth (hue 44 degrees: base #c19207, body #c19417 on a dark
   photograph), a red-orange cup (wall #c85d02, throat #a13f01, lit #fb9e1f) */
NARM['nar-taz-soleil-d-or']={t:'#eab61a',tb:'#dca814',tg:'#c8a424',ti:'#f0c42c',sh:'#8a5e04',li:'#fcdc70',c:'#f88a1a',ci:'#f67507',th:'#b84c04',cr:'#fca030',
  cb:'#d88a20',cs:'#7a3202',cl:'#ffbc5a',an:'#e4981c',fi:'#e2d49a',sg:'#ebdc9c'};
/* Cragford (8 W-O; photo 10): a white perianth (cool-lit photograph: whites #bbc8c1), a red-orange cup, the deepest of the group (wall #b5530c,
   throat #8c2603; hue 22-25 degrees against Geranium's 28-32) */
NARM['nar-taz-cragford']={t:'#f7f6f1',tb:'#edece4',tg:'#dfe2c0',ti:'#fafaf6',sh:'#90968c',li:'#ffffff',c:'#ee741c',ci:'#e36410',th:'#a02e06',cr:'#f27c32',
  cb:'#cc7c38',cs:'#6e1c02',cl:'#ffa468',an:'#e0901c',fi:'#e2dcae',sg:'#ebe4b8'};
/* Chinese Sacred Lily (N. tazetta subsp. chinensis; photo 11, level C): a pure white perianth (cool, dark photograph), a golden-yellow cup (wall
   #c89303, lit #d5ab22, throat #9d6e05) */
NARM['nar-taz-chinensis']={t:'#f8f7f2',tb:'#eeede6',tg:'#e0e3c4',ti:'#fbfbf7',sh:'#929890',li:'#ffffff',c:'#f8c418',ci:'#f2b40a',th:'#c08404',cr:'#fcd23c',
  cb:'#d8b038',cs:'#80560a',cl:'#ffe07a',an:'#e49a18',fi:'#e2dca8',sg:'#ebe3b0'};
/* Silver Chimes (8 W-W; photos 12, 13): a cream-white perianth (photo 13 #f9f7e8 body, #e3e5cd in the shade), a cream cup, not pure white (lit
   #f3eeb9, wall #ccc374, throat #a2994d) */
NARM['nar-taz-silver-chimes']={t:'#f8f5e6',tb:'#eeead6',tg:'#dedcb0',ti:'#fbf9ee',sh:'#928e78',li:'#ffffff',c:'#faf4cc',ci:'#ece4a8',th:'#cfc27a',cr:'#fcf8e0',
  cb:'#e6e0b4',cs:'#b8a870',cl:'#fffbe6',an:'#e6b82c',fi:'#e6e4b8',sg:'#eceac0'};
/* Martinette (8 Y-O; photos 14, 15): a lemon-gold perianth (hue 50 degrees: body #c6ac27, deeper at the foot #d09e0e), a bright orange cup, yellower
   than Grand Soleil d'Or's (wall #e48801, lit #fe9c02, throat #b25f02) */
NARM['nar-taz-martinette']={t:'#e2ca30',tb:'#d6bc24',tg:'#d4aa1e',ti:'#ecd844',sh:'#8a6c08',li:'#fff0a0',c:'#ffa214',ci:'#fe9604',th:'#c86404',cr:'#ffb232',
  cb:'#e0a020',cs:'#7e3c02',cl:'#ffcc66',an:'#e8a41c',fi:'#e6dc9c',sg:'#eee0a0'};
/* Golden Dawn (8 Y-O; photos 17, 18; late): a deep golden perianth (hue 49-50 degrees: #c2a406 body, #cfb307 lit), an orange cup (wall #d37503,
   lit #df8607, throat #aa5c04) */
NARM['nar-taz-golden-dawn']={t:'#ecd028',tb:'#dec220',tg:'#d4b01c',ti:'#f2dc3c',sh:'#8a6806',li:'#fff4a4',c:'#fe9a14',ci:'#f68a04',th:'#c86e04',cr:'#ffae30',
  cb:'#d89a20',cs:'#783800',cl:'#ffc060',an:'#e49a18',fi:'#e4d898',sg:'#ecdc9c'};
const nbqMat=cwx=>narMat({id:'taz-'+cwx.id,c:cwx.c,tr:cwx.tr});
/* the colour of a fading tazetta (44, 45, 82): the white perianth goes ivory, then a pale papery parchment (lighter than the trumpet's); the
   cup keeps its yellow longer, dulls, then browns (svCorona browns its rim first); greens as the common rule */
function nbqWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=30&&h<72&&s>.25){let o=l2h(h+(40-h)*.4*w,s*(1-.35*w),l+(.62-l)*.3*w);if(w>.55)o=mix(o,'#b08a50',(w-.55)*.9);return o}
  if(l>.8&&s<.6){let o=mix(c,'#efe6c8',.7*Math.min(1,w*1.4));if(w>.5)o=mix(o,'#d2c096',(w-.5)*.9);return o}
  return typeof lifeCol==='function'?lifeCol(c,w):c}
/* ---------- genes: six tepals, broad and rounded with a small point, each its own; the cup's length and mouth */
const NBQ_GENES={n:[[6,1]],tep:{dL:[.95,1.05],dW:[.93,1.07],dph:[-.04,.04],da0:[-.05,.05],da1:[-.08,.08],tw:[-.15,.15],wav:[.015,.04],wk:[2,3.5],wph:[0,6.28],
    notch:[0,0],tip:[1.6,2],asym:[-.05,.05],curl:[0,.05],cup:[.8,1.2],sd:'sd'},late:{hang:[.7,1.3],wl:[.85,1.15]},
  head:{rot:[0,6.2832],cup:[.9,1.1],op:[-.03,.03],ring:[.95,1.05],dh:[-2,2],ds:[-.04,.03],dl:[-.02,.015],cL:[.92,1.08],cM:[.94,1.06],cK:'sd',stL:[.94,1.06],sd:'sd'}};
/* ---------- the heart: the cup, the stamens deep in it, the floral tube and the ovary behind ---------- */
/* the cup (Avalanche): mouth Ø .4 of the perianth (rm + fl = .41 R0; render .43, photos 88/89 .37-.45), a bowl rounding into the tube's mouth
   (foot .14 R0, pw .5: a true cup, its yellow running down to the throat), .32 R0 deep (40: depth ~.4 of the cup width), the rim a little wavy */
const NBQ_COR=svCorona({light:Object.assign({},SVB_DEF.light,{darkLo:[.8],litLo:[1.1]}),L:.32,rb:.14,rm:.36,pw:.5,fl:.05,flV:.6,flK:1.2,flB:.15,nF:6,aF:.014,rF:.012,
  nK:[16,8],aK:.008,kV:.3,irr:.45,nG:6,aG:.004,L0:.7,M0:.7,fanL:.3,fanM:.25,crk:2,droop:.15,brown:[.35,.6],floor:[.04,.03,.3]});
/* six stamens in two ranks inside the cup, their anthers below its mouth (89), the style among them, its stigma at the mouth, not beyond (89) */
const NBQ_H6=svHeart6({n:6,ovH:.26,ovR:.016,ovT:.85,styL:.01,sgR:.045,sgUp:.5,filL:.14,filR:.06,filW:.016,filA:.05,anL:.07,anW:.026,vers:0,budMax:.45,hide:.2,lo:1});
/* the back of the flower: the perianth's tube (slender, pale green, .62 R0) then the ovary (a darker green knob with three faint ribs, .34 R0),
   and, drawn alone (sheets), the pedicel's foot bending down */
/* the tube and the ovary stay green as the flower fades (44, 45): only a little toward olive (the global wilt filter is not laid over them) */
/* (LIFE_ALL 'fane', z1.js: a bouquet drawn all faded) nothing stays green: the tube and the ovary go to olive, then straw (lifeCol), their shade and rims with them */
const nbqFaneAll=()=>typeof LIFE_ALL!=='undefined'&&LIFE_ALL==='fane';
const nbqBackW=(c,w)=>!(w>0)?c:nbqFaneAll()&&typeof lifeCol==='function'?lifeCol(mix(c,'#8a8a4a',.88*svSm((w-.3)/.5)),.8):mix(c,'#8a8a4a',.35*svSm((w-.3)/.5));
const NBQ_BACK=[[0,'#dfe2b0'],[.2,'#c4cc86'],[.5,'#a2b46a'],[.62,'#6e8e46'],[.8,'#557a38'],[1,'#5a7c3c']];
function nbqBack(ctx,stub){const{B,O,R0,g,bud,fan,cw0,pieces}=ctx,hi=DET>=1.5;const dn=narDown(B),zt=R0*.02,Lt=R0*.62,Lo=R0*.34,zo=zt-Lt-Lo,La=zt-zo,
    Ls=stub?R0*.55:0,Lb=La+Ls,ka=1.1/(Ls||1),sq=1-.25*bud;
  const spine=v=>{const s=v*Lb;if(s<=La)return[[0,0,zt-s],[0,0,-1]];const a=(s-La)*ka;
      return[V3.add([0,0,zo],V3.add(V3.sc([0,0,-1],Math.sin(a)/ka),V3.sc(dn,(1-Math.cos(a))/ka))),V3.add(V3.sc([0,0,-1],Math.cos(a)),V3.sc(dn,Math.sin(a)))]},
    rad=(v,th)=>{const x=v*Lb/R0;let r;if(x<.08)r=.062+.06*(1-.7*bud)*Math.pow(1-x/.08,1.6);/* the tube's mouth opening into the perianth */
      else if(x<.64)r=.058+.01*(x-.08)/.56;else if(x<.98){const t=(x-.64)/.34;r=(.068+.062*Math.pow(Math.sin(Math.PI*t),.7))*(1+.06*Math.cos(3*th+(g.rot||0)))*(1+.2*fan)}
      else r=.05+.015*svSm((1.02-x)/.04);return R0*r*sq},
    sh=c=>nbqBackW(svShift(c,g.dh||0,g.ds||0,g.dl||0),(ctx.dec+ctx.fan)/2),st=(cw0.back||NBQ_BACK).map(([x,c])=>[Math.min(1,x*La/Lb),sh(c)]).filter((q,i,a)=>!i||q[0]>a[i-1][0]),
    fk=c=>nbqFaneAll()?nbqBackW(c,(ctx.dec+ctx.fan)/2):c,mat=Object.assign({stops:st,bstops:st,shade:fk('#34461a'),lite:fk('#f2f6cc'),bshade:fk('#34461a'),blite:fk('#f2f6cc'),rim:fk('#566a2a'),brim:fk('#566a2a'),cast:cw0.cast},SVB_DEF.light,{trans:.05,rw:hi?.004:0,ro:.3,darkLo:[.8],litLo:[]});
  const to={spine,rad,ref:V3.nz(V3.cr([0,0,1],dn)),vs:.3,half:true,nu:hi?10:7,nv:hi?14:9,mat},tb=svTubeN(B,O,to),
    nw=f=>k=>{const w0=WILT;WILT=null;try{f(k)}finally{WILT=w0}};pieces.push({fn:nw(hi?k=>svDraw(k,[tb],{D:ctx.D,pmin:3,shadow:false}):k=>svTubeLite(k,B,O,to)),proxy:tb})}
let NBQ_STUB=true,NBQ_LV=2;/* drawn alone (sheets): with the pedicel's foot; NBQ_LV: the level of detail of the flower being drawn */
/* the heart's pieces carry a tag (nbq: cup, h6, back) for the lean levels; ?narx=cor,h6,back leaves those parts out, to weigh each one */
function nbqHeart(ctx){const P=ctx.pieces,tag=(t,f)=>{const n0=P.length;f();for(let i=n0;i<P.length;i++){P[i].nbq=t;if(P[i].proxy)P[i].proxy.nbq=t}};
  if(!NAR_X.has('cor'))tag('cup',()=>NBQ_COR(ctx));if(NBQ_LV>=2&&!NAR_X.has('h6')&&ctx.fan<.3)tag('h6',()=>NBQ_H6(ctx));if(!NAR_X.has('back'))tag('back',()=>nbqBack(ctx,NBQ_STUB))}
/* ---------- the tazetta flower (division 8): only what differs from SVB_DEF ---------- */
const SVN_TAZETTA={genes:s=>svGenes(s,NBQ_GENES),mat:nbqMat,heart:nbqHeart,
  /* tepals: broad obovate with a small point, broadest above the middle, narrowed to the throat (89), overlapping (Avalanche) */
  L:[.86,.82],Wd:[.86,.78],r0:.14,z0:[-.012,.012],vb:.56,claw:[.38,.62],clawK:1.1,aPow:1,cup:.14,cupW:[1,1.1],lap:.06,sag:[.02,.08,.15],
  /* the opening: cupped forward round the cup in the young flower (88, top), then spreading and swept back into a shallow cone behind the cup,
     the outer three more (40, 28: in profile the tepals show their faces and the cup juts from the perianth: jut .41 of its length on 40) */
  a0:[[.34,1.42],[.32,1.3]],a1:[[.3,1.76],[.28,1.56]],open:[.24,.5],
  /* the bud: an elongated egg, 2.4 times as long as wide, green-cream from the foot, white from the tip (nbq-boutons 30) */
  bud:[.1,.3],budH:[.72,.4],budR:.21,budE:[.06,.92],budK:1.15,budP:.9,budW:[1.25,1.15],green:[.55,.06,.16],greenC:'#a8b450',greenTip:.3,
  /* the decline and the faded (44, 45, 82): limp, translucent then papery, crinkled, hanging; the tepals stay on */
  dec:[.1,.35],fan:[.5,.25],shed:[3,1],tip:[[.15,.12,.35],[.6,.45,.35]],wA0:[.05,.15],wA1:[.2,.35],limp:[.85,.12],curl:[.2,.35],tw:[.5,.5],
  wav:[.6,1.6,3],fanL:.18,fanW:.4,rev:[.2,.35],crk:[.06,.2],edge:{light:'#dccb94',red:'#6a2434',other:'#c8a45c',a:[.18,.45]},trans:[.22,.3],
  veinLo:false,veinN:[14,8],veinNet:[0,0],veinFork:[.15,.05],nu:[10,12],nv:14,pmin:6,light:Object.assign({},SVB_DEF.light,{darkLo:[.82],litLo:[]})};
/* the faded flower (wilt .3 and more): the same tepals and genes, lighter to draw (the faded stem weighed 56 Ko at DET 1, kd): a coarser mesh,
   calmer crinkles (a crinkled tepal's regions were the heaviest paths of the stem), rarer patches; NBQ_TOLK: the lean level's region tolerance */
const SVN_TAZETTA_FAN=Object.assign({},SVN_TAZETTA,{nu:[8,8],nv:9,pmin:12,wav:[.6,1.1,1.7],crk:[.04,.1]});
let NBQ_TOLK=.012;
/* how far the bouquet has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function nbqLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'narcisse-bouquet',rec:{}})):0}
/* ---------- the levels of detail. 2: the engine (svBloom, svDraw). 1: the same sheets, each region one flat lit colour with a thin edge (svDraw
   is lent nbqLean for the time of the flower). 0: one outline for the perianth (the six tepals as one path), the cup and its mouth, the tube ---------- */
const nbqRamp=(st,v)=>{for(let i=1;i<st.length;i++)if(v<=st[i][0]){const a=st[i-1],b=st[i],t=(v-a[0])/Math.max(1e-6,b[0]-a[0]);return mix(a[1],b[1],Math.max(0,Math.min(1,t)))}return st[st.length-1][1]};
function nbqRegCol(sh,s){const m=sh.mat||{},st=(s>0?m.stops:m.bstops)||m.stops||[[0,'#f0f0f0'],[1,'#f0f0f0']],K=svShade(sh);let a=0,n=0;
  for(let q=0;q<K.length;q++)if(s*sh.F[q]>0){a+=K[q];n++}const cup=sh.nbq==='cup',k=n?a/n:1,base=nbqRamp(st,cup?.8:.58),sd=(s>0?m.shade:m.bshade)||m.shade||'#404040',li=(s>0?m.lite:m.blite)||'#ffffff';
  return k<1?mix(base,sd,Math.min(.85,(1-k)*(cup?.5:.9))):mix(base,li,Math.min(.8,(k-1)*.7))}
function nbqArea(P){let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2}
function nbqLean(par,pieces,o,lv,B){const Dm=o.D,tol=Math.max(.06,Dm*.0035),k=G(par),fz=B[2][2];
  if(lv>=1){const items=[];for(const p of pieces){const sh=p.fn?p.proxy:p;if(!sh)continue;for(const r of svRegions(sh,{tol:Math.max(tol,Dm*NBQ_TOLK)}))items.push(r)}
    const ord=svOrder(items,Dm*.005),ew=svF(Math.max(.12,Dm*.011));/* the edges' common width and opacity once on the group (bytes) */
    k.setAttribute('stroke-width',ew);k.setAttribute('stroke-opacity',.6);k.setAttribute('stroke-linejoin','round');
    for(const it of ord){if(it.kind!=='reg')continue;const c=nbqRegCol(it.sh,it.s),cup=it.sh.nbq==='cup';
      const at={d:it.d,fill:c,stroke:mix(c,(it.sh.mat&&it.sh.mat.shade)||'#606060',cup?.35:.55)};if(cup)at['stroke-opacity']=.5;const w0=WILT;if(it.sh.nbq==='back')WILT=null;try{E('path',at,k)}finally{WILT=w0}}/* tube and ovary stay green (as level 2) */
    return k}
  /* level 0: outlines (each piece's boundary, wound the same way so the perianth's tepals union under nonzero) */
  const tep=[],oth=[];for(const p of pieces){const sh=p.fn?p.proxy:p;if(!sh)continue;(sh.nbq?oth:tep).push(sh)}
  const ol=sh=>{const P=[],n=5;for(let i=0;i<=n;i++)P.push(svAt(sh,-1,i/n));for(let i=1;i<n;i++)P.push(svAt(sh,-1+2*i/n,1));for(let i=n;i>=0;i--)P.push(svAt(sh,1,i/n));
      const Q=P.map(q=>[q[0],q[1]]);return nbqArea(Q)<0?Q.reverse():Q},
    hull=sh=>{const P=[];for(let j=0;j<=4;j++)for(let i=0;i<=8;i++){const q=svAt(sh,-1+i/4,j/4);P.push([q[0],q[1]])}return hull2(P)},
    col=(sh,s)=>{const m=sh.mat||{},st=(s>0?m.stops:m.bstops)||m.stops;return st?nbqRamp(st,.58):'#e8e8e0'};
  const drawT=()=>{if(!tep.length)return;const bud=tep.length&&NBQ_LV0BUD;let d='';if(bud){const P=[];for(const sh of tep)for(const q of ol(sh))P.push(q);d=svSpl(hull2(P))}else for(const sh of tep)d+=svSpl(ol(sh));
      E('path',{d,fill:col(tep[0],fz>=0?1:-1),stroke:mix(col(tep[0],1),'#707060',.5),'stroke-width':svF(Math.max(.12,Dm*.01)),'stroke-opacity':.5},k)},
    drawO=t=>{for(const sh of oth){if(sh.nbq!==t)continue;const w0=WILT;if(t==='back')WILT=null;try{E('path',{d:svSpl(hull(sh)),fill:col(sh,-1)},k)}finally{WILT=w0}
      if(t==='cup'&&fz>.25){const P=[];for(let i=0;i<=10;i++){const q=svAt(sh,-1+i/5,1);P.push([q[0],q[1]])}E('path',{d:svSpl(P),fill:col(sh,1),'fill-opacity':.9},k)}}};
  if(fz>=0){drawO('back');drawT();drawO('cup')}else{drawO('cup');drawT();drawO('back')}return k}
let NBQ_LV0BUD=false;
/* one flower at a level of detail */
function nbqHead(par,B,O,D,cw,op,seed,wl,lv){const L0=NBQ_LV,b0=NBQ_LV0BUD,t0=NBQ_TOLK,fan=wl>=.3,SP=fan?SVN_TAZETTA_FAN:SVN_TAZETTA;NBQ_LV=lv;
  NBQ_LV0BUD=op<SVN_TAZETTA.bud[0]+SVN_TAZETTA.bud[1]*.8;NBQ_TOLK=fan?.02:.012;
  if(lv>=2)try{return svBloom(par,B,O,D,SP,cw,op,seed,wl)}finally{NBQ_LV=L0;NBQ_LV0BUD=b0;NBQ_TOLK=t0}
  const sd=svDraw;svDraw=(p,pieces,o)=>nbqLean(p,pieces,o,lv,B);try{return svBloom(par,B,O,D,SP,cw,op,seed,wl)}finally{svDraw=sd;NBQ_LV=L0;NBQ_LV0BUD=b0;NBQ_TOLK=t0}}
/* the head of the sheets (one flower; ?narx=lv1 or lv0 draws that level) */
function nbqSvg(par,B,O,D,cwId,op,seed,wl){const w=wl==null?nbqLife():wl,cw=(typeof CW_L106NB!=='undefined'&&CW_L106NB.find(x=>x.id===cwId))||{id:cwId,c:'#f9f7ee',tr:'#f2cc3a'};
  return nbqHead(par,B,O,D,cw,op,seed,w,NAR_X.has('lv0')?0:NAR_X.has('lv1')?1:2)}
SV_HEAD['narcisse-bouquet']=nbqSvg;
/* the cost of a flower at each level (elements at DET 1, measured: journal), [open, bud]; the stem's own (scape, pedicels, spathe: base + per
   pedicel); the budget of a stem [DET 1, DET 1.5] */
const NBQ_COST={2:[260,200],1:[16,10],0:[5,3]},NBQ_STEMC=[40,3],NBQ_BUDGET=[280,1400];
function nbqLod(U){const fl=U.fl,hi=DET>=1.5,C=NBQ_COST,lim=LOD?0:(hi?NBQ_BUDGET[1]:NBQ_BUDGET[0])-NBQ_STEMC[0]-NBQ_STEMC[1]*fl.length;let tot=0;
  const cw=f=>f.wl>.3?1.6:1;/* a fading flower has more regions (crinkled, hanging): kd 1:.6 */
  for(const f of fl){f.lod=0;tot+=C[0][f.bud?1:0]}
  const sc=fl.map(f=>[1.2*Math.max(0,f.B[2][2])+.6*f.a+.5*Math.max(-1,Math.min(1,f.zr))+(f.bud?-.4:0),f]).sort((a,b)=>b[0]-a[0]);
  for(const[,f]of sc){const c=(C[1][f.bud?1:0]-C[0][f.bud?1:0])*cw(f);if(tot+c<=lim){f.lod=1;tot+=c}}
  for(const[,f]of sc){if(f.lod!==1||U.op<.12)continue;/* closed spathe: the buds hidden in it, none drawn whole */const c=(C[2][f.bud?1:0]-C[1][f.bud?1:0])*cw(f);if(tot+c<=lim){f.lod=2;tot+=c}}}
function nbqUmbelFlower(par,U,f){if(!U.done){const zs=U.fl.map(q=>q.c[2]),zm=zs.reduce((a,b)=>a+b,0)/zs.length;for(const q of U.fl)q.zr=(q.c[2]-zm)/(U.D*.8);nbqLod(U);U.done=1}
  const T0=NBQ_STUB;NBQ_STUB=false;try{return nbqHead(par,f.B,f.c,U.D,U.cw,f.a,f.seed,f.wl,f.lod)}finally{NBQ_STUB=T0}}
/* ---------- the spathe of the umbel: a translucent green-white sheath round the young umbel (op < .12), split as the buds push (to .3), then dry,
   papery, leaning back beside the umbel (narSpatheSheet / narSpatheLite / narSpatheMat of the genus) ---------- */
function nbqSpathe(par,U,og,pos,ph,tw,w){const D=U.D,R0=D/2,op=U.op,face=U.face,cl=1-svSm((op-.1)/.2),dry=Math.max(svSm((op-.12)/.3),.85*svSm((U.wl-.1)/.5));
  const lean=V3.nz(V3.add(og.H,V3.sc(face,-.3*(1-cl)))),Bs=l41Fr(lean,V3.sc(face,-1),0),X=[Math.sin(ph)*(1-cl),Math.cos(ph)*(1-cl)+cl*-1,0],
    egg=v=>Math.pow(Math.sin(Math.PI*Math.min(1,.12+.88*v)),.75),
    so={p0:[0,0,-D*.06],A:[0,0,1],X:V3l(X)>.1?V3.nz(X):[0,1,0],L:D*(1.35+.25*cl),lean:.02+.22*(1-cl),wr:.97-.55*(1-cl),tp:2.2-.6*(1-cl),tw:tw*(1-.5*cl),
      rad:v=>Math.max(w*.55,R0*.12)+R0*(cl*.36*egg(v)+(1-cl)*.18*v),mat:narSpatheMat(dry)},al=.8+.2*Math.max(dry,1-cl*.9);
  const g=al<.97?G(par,{opacity:svF(al)}):par;return DET>=1.5?svDraw(g,[narSpatheSheet(Bs,pos,so)],{D,pmin:3,shadow:false}):narSpatheLite(g,Bs,pos,so)}
/* ---------- the stem: the scape (solid, a little flattened, smooth, green; y3-plante-nar.js) and the pedicels (one ribbon and a light line) ---------- */
const NBQ_SC=['#38532f','#5f8450','#8fb07a','#c4d8b4'];
NBQ_SC.sv={line:svStemLineN,cut:svStemCutN,flat:.5,swell:.012,ripple:0,edges:[.28,.12],bloom:.05,gloss:.36,ribs:[-.42,.38],hollow:0,cutY:.24,ownWilt:1};
const NBQ_SCW=['#4a4a2e','#8c8a58','#b0ab78','#d2cda4'];
/* the scape stays green longest (brief): its colours drift toward straw only from wl .6; the pedicels with it; in a bouquet drawn all faded
   (LIFE_ALL 'fane') nothing stays green: they go all the way to straw */
function nbqScW(sc,wl){const fa=nbqFaneAll()&&typeof lifeCol==='function',k=(fa?.92:.5)*svSm((wl-.6)/.35);if(!(k>0))return sc;const r=sc.map((c,i)=>fa?lifeCol(mix(c,NBQ_SCW[i],k),.8):mix(c,NBQ_SCW[i],k));r.sv=sc.sv;return r}
function nbqPedLine(par,C,W,c){const n=C.length;if(n<2)return par;const lx=LIGHT[0],ly=-LIGHT[1],H=[];
  for(let i=0;i<n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,s=nx*lx+ny*ly>0?1:-1;
    H.push([C[i][0]+nx*W[i]*.2*s,C[i][1]+ny*W[i]*.2*s])}
  E('path',{d:polyRibbon(C,i=>W[i]/2),fill:c[1],stroke:c[0],'stroke-width':svF(Math.max(.15,W[0]*.14)),'stroke-opacity':.55},par);
  E('path',{d:svSpl(H,false),fill:'none',stroke:c[2],'stroke-width':svF(W[0]*.3),'stroke-opacity':.75,'stroke-linecap':'round'},par);return par}
const NBQ_PC=['#3a5630','#64884e','#a2c282','#cfe0bc'];NBQ_PC.sv={line:nbqPedLine};
/* ---------- the plant (l106NbPlant's line, s106a.js): l106NbPlant's turtle and draws exactly, in the same order (the bouquet's chance does not move):
   R(.6,1) when no op is given, R(nn) for the count, per flower [R age (all but the first), R azimuth, R elevation, R pedicel], lsTurtle's own,
   one R per flower or bud (its roll), two for the spathe (its side, its twist), open()'s two ---------- */
function nbqSvPlant(g,t,o){const cw=cwPick(CW_L106NB,o),op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||3)*UPC*(cw.sz||1),k=G(g),gh=GHI['narcisse-bouquet']||{},wl=nbqLife(o),
    sc=nbqScW(gh.sc||NBQ_SC,wl);
  const B=frameOf(o,.3,true),up=l54Up(B),face=B[2],U0=l54U0(face,up),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*4.4))):1,w=Math.max(2,D*.14),Ls=D*(o.rim?.9:4.4)*kr;
  const n=o.rim?2:Math.min(DET>=1.5?12:7,Math.round(R(cw.nn[0],cw.nn[1]+.4))),mods=[['F',{l:Ls,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:D*.1,w1:w*.9}]];
  for(let i=0;i<n;i++){const age=i===0?op:Math.max(0,Math.min(1,op*1.15-i/n*(op<.6?.8:.6)+R(-.08,.08))),a=i*137.5+R(-12,12),el=i===0?R(6,14):age<.3?R(8,18):R(22,44);
    mods.push(['[',{w:Math.max(1.2,w*.4)}],['/',{a}],['&',{a:el}],['F',{l:D*(age<.3?.5:.65+.4*age)*R(.85,1.15)*(o.rim?.7:1),w1:Math.max(1.12,w*.3),e:age<.3?.02:-.04}],[i?'Kb':'K',{age,i}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.015,seg:D*.12,T:[0,1,0],e:.01,w:w*1.1});res.chains.forEach((ch,i)=>{ch.c=i?nbqScW(NBQ_PC,wl):sc});
  const bq=typeof NECK_X!=='undefined'&&NECK_X,bent=!bq&&nbqBend(res,up,face,1.1*svSm((wl-.45)/.45)),unpack=nbqPack(res,up,.65*(1-svSm((op-.1)/.2)));
  const sp=res.organs.find(q=>q.t==='Sp'),c0=res.chains[0].pts,apex=bent?c0[c0.length-1]:V3.add(sp.pos,V3.sc(up,D*.1)),R0=D/2,La=R0*.98,U={fl:[],D,cw,op,wl,face,up,done:0},RV=new Map();
  /* in a bouquet the drawing goes into a marker (nbqOldBox): the head's box stays the old drawing's */
  const mk=bq?E('marker',{id:'nbm'+(gid++),markerUnits:'userSpaceOnUse',overflow:'visible',markerWidth:1,markerHeight:1,orient:0},GDEF||defs):null;
  lsPlant(mk?G(mk):k,res,{O:[0,0,0],apex,cols:sc,piece:99,organ:(og,pos)=>{
    if(og.t==='K'||og.t==='Kb'){const a=Math.min(og.p.age,op*1.1),rr=R(-.2,.2),bud=a<.3;RV.set(og,rr);
      /* the bud erect, nodding outward as it swells (papyraceus 28-30); the flower looking out and toward the eye (the old drawing's axis) */
      let ax;if(bud){const hz=V3s(og.H,V3.sc(up,V3.dot(og.H,up))),out=V3l(hz)>.05?V3.nz(hz):face,nd=1.05*svSm((a-.12)/.16);ax=V3.nz(V3.add(V3.sc(og.H,Math.cos(nd)),V3.sc(V3.nz(V3s(out,V3.sc(up,.25))),Math.sin(nd))))}
      else ax=V3.nz(V3.add(og.H,V3.sc(face,.55)));
      const Bf=l41Fr(ax,up,rr),c=V3.add(pos,V3.sc(ax,La)),f={B:Bf,c,a,bud,wl:wl>0?Math.min(1,wl*(1+.25*(a-.7))):0,
        seed:svSeed('narcisse-bouquet',cw.id,Math.round(rr*1e6),Math.round(c[0]*8),Math.round(c[1]*8))};U.fl.push(f);
      return{parts:[{z:c[2]+ax[2]*D*.1,fn:par=>nbqUmbelFlower(par,U,f)}]}}
    if(og.t==='Sp'){const ph=R(-.4,.4),tw=R(-.4,.4),cl=op<.13;RV.set(og,[ph,tw]);return{parts:[{z:cl?pos[2]+D*2:pos[2]-1e-3,fn:par=>nbqSpathe(par,U,og,pos,ph,tw,w)}]}}
    return null}});
  if(unpack)unpack();if(mk)nbqOldBox(k,mk,res,apex,cw,op,D,w,up,face,RV);
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* the bouquet places a head by its box (c5.js: a head behind the vessel is raised and drawn again when its box dips below the rim; each drawing
   draws the bouquet's chance): the old drawing is made again from the same turtle and rolls (l106NbPlant's organs: no draw of chance), its box
   measured, then removed; an empty rect keeps that box in the head, and the new drawing, in a marker (whose content a box does not count), is
   shown through a path of no length at the box's centre. So the composition does not move, whatever the new drawing's extent. */
function nbqOldBox(k,mk,res,apex,cw,op,D,w,up,face,RV){const tmp=G(k),cache={},sc=['#2e4a32','#557a58','#80a682','#b2ccb0'],cs=res.chains.map(c=>c.c),E0=EXT;
  EXT=[];res.chains.forEach(c=>{c.c=sc});
  try{lsPlant(tmp,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
      if(og.t==='K'||og.t==='Kb'){const a=Math.min(og.p.age,op*1.1),rr=RV.get(og);if(a<.3){const Bf=l41Fr(og.H,up,rr);return{parts:[{z:pos[2]+og.H[2]*D*.2,fn:par=>l106TazBud(par,Bf,pos,D,cw,a/.3)}]}}
        const ax=V3.nz(V3.add(og.H,V3.sc(face,.55))),Bf=l41Fr(ax,up,rr),c=V3.add(pos,V3.sc(ax,D*.34));return{parts:[{z:c[2]+ax[2]*D*.1,fn:par=>l106TazFlower(par,Bf,c,D,cw,a,cache)}]}}
      if(og.t==='Sp'){const[ph,tw]=RV.get(og),Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(face,-.3))),V3.sc(face,-1),0),
          l=ligule(Bs,V3.add(pos,V3.sc(og.H,-D*.12)),{phi:ph,r0:w*.4,z0:0,L:D*1.2,W:D*.28,wp:NAR_SPA,a0:.12,a1:.32,pw:1.2,th:1.6,tip:'point',n:5,tw});
        return{parts:[{z:pos[2]-1e-3,fn:par=>drawLig(par,[{l,c:'#d6c296',ink:'#8a7650'}])}]}}
      return null}});
    const b=tmp.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;E('rect',{x:b.x,y:b.y,width:b.width,height:b.height,fill:'none',stroke:'none'},k);
    mk.setAttribute('refX',cx);mk.setAttribute('refY',cy);E('path',{d:`M${cx} ${cy}h.01`,fill:'none',stroke:'none','marker-start':`url(#${mk.id})`},k)}
  finally{tmp.remove();EXT=E0;res.chains.forEach((c,i)=>{c.c=cs[i]})}}
/* ---------- the scape bows under the fading umbel (brief, organes.md: the scape stays green longest and gives way at the top under the umbel's
   weight; 44, 45): drawn alone (sheets) only, the bouquet's own stem and box untouched. The main axis bends along its length, more toward the top
   (power 1.6), sideways in the picture toward the side the umbel faces; all above it (pedicels, flowers, spathe) turns with its tip ---------- */
function nbqBend(res,up,face,th){if(!(th>.005))return false;let o=V3s([face[0]>=0?1:-1,0,0],V3.sc(up,up[0]*(face[0]>=0?1:-1)));if(V3l(o)<.1)return false;o=V3.nz(o);
  const ax=V3.nz(V3.cr(up,o)),rot=(v,a)=>{const c=Math.cos(a),s=Math.sin(a);return V3.add(V3.add(V3.sc(v,c),V3.sc(V3.cr(ax,v),s)),V3.sc(ax,V3.dot(ax,v)*(1-c)))};
  const P=res.chains[0].pts,n=P.length,sl=[0];for(let i=1;i<n;i++)sl.push(sl[i-1]+V3l(V3s(P[i],P[i-1])));const S=sl[n-1]||1,Q=[P[0]],A=[0];
  for(let i=1;i<n;i++){const a=th*Math.pow((sl[i-1]+sl[i])/2/S,1.6);A.push(a);Q.push(V3.add(Q[i-1],rot(V3s(P[i],P[i-1]),a)))}
  const tf=(x,i)=>V3.add(Q[i],rot(V3s(x,P[i]),A[i]));
  for(const og of res.organs){const j=P.indexOf(og.pos),i=j<0?n-1:j;og.pos=tf(og.pos,i);og.H=rot(og.H,A[i]);og.U=rot(og.U,A[i]);og.L=rot(og.L,A[i])}
  for(let c=1;c<res.chains.length;c++)res.chains[c].pts=res.chains[c].pts.map(x=>tf(x,n-1));
  res.chains[0].pts=Q;return true}
/* ---------- the young umbel packed in its spathe (nbq-boutons 3: the buds side by side in the closed sheath, none out of it): while the spathe
   is closed (op < .1) the pedicels and buds are drawn toward the scape's axis (k of their spread), letting go as it splits (to op .3).
   Drawing only: the turtle and its draws are untouched, and the geometry is put back after (the bouquet's box: nbqOldBox) ---------- */
function nbqPack(res,up,k){if(!(k>.005))return null;const P=res.chains[0].pts,a=P[P.length-1],undo=[],
    sq=x=>{const d=V3s(x,a),h=V3.dot(d,up);return V3.add(a,V3.add(V3.sc(up,h),V3.sc(V3s(d,V3.sc(up,h)),1-k)))};
  for(let c=1;c<res.chains.length;c++){const ch=res.chains[c],p0=ch.pts;ch.pts=p0.map(sq);undo.push(()=>{ch.pts=p0})}
  for(const og of res.organs){if(og.t!=='K'&&og.t!=='Kb')continue;const p0=og.pos,h0=og.H;og.pos=sq(p0);og.H=V3.nz(V3.add(V3.sc(h0,1-k),V3.sc(up,k)));undo.push(()=>{og.pos=p0;og.H=h0})}
  return()=>undo.forEach(f=>f())}
/* ---------- the plant's leaves (plant sheets: GHI.basal, called by svtStem behind then in front of the scape) ----------
   Measured (nbq_runs.py, row runs of green, and by eye): 31 (a whole plant, the flower ~50 px across): six leaves, the broadest .3-.38 of the flower
   across, their tips at ~.75-.8 of the scape's height (~7.5 flowers long, so length/width ~23 there), upright then arching a little; 34, 37 (tufts):
   flat straps, glaucous green, an obtuse tip, the outer ones arching out; brief: 30-40 cm x ~1 cm (~35), 6 to 8, upper face glossy, under face
   matt, sheathing foot. Drawn: six flat strap leaves a little keeled, in two ranks round the scape (the fan turned ~30° from the eye), .36 of the
   flower across, the longest .9 of the scape (length/width 22 to 36; render: leaf width / scape height .038, photo 31 .033), the outer short ones arching out; grey-green above, paler and glaucous below,
   pale at the sheathing foot; fading from the tip (yellow, tan, straw), limp, the outer ones lying down. No bulb, no root: cut square with the scape.
   [azimuth (rad, x toward z), length (x the whole scape), lean (rad), droop, fold, twist, sheath rank, flop, flopAt (wilting)] */
const NBQ_BASAL=[[3.9,.6,.34,.4,0,.5,5,.7,.36],[.5,.68,.28,.3,[.42,.55,.4,.8,.3],.4,4,.4,.46],[3.55,.75,.2,.2,0,.6,3,.6,.5],[.78,.82,.15,.14,0,.45,2,.45,.58],
    [3.3,.87,.1,.1,0,.35,1,.4,.64],[1.02,.9,.06,.06,0,.3,0,.3,.7]],
  NBQ_LEAF={wp:[[0,.7],[.04,.85],[.1,1],[.6,1],[.85,.93],[.94,.76],[.98,.5],[1,.16]],sheath:.06,gut:.4,keel:.3,wav:.008,wavN:2,hood:.2,nu:5,nv:16,bloom:.55,
    flopDn:.75,up:'#5d7d58',low:'#86a083',base:'#c2c697',fade:{yel:'#c9bd52',tan:'#b39657',dry:'#d8c9a0',w0:.5,dw:.8}};/* the leaves of a cut stem stay green while the umbel fades (44) */
function nbqBasal(par,P,L,w,side){if(NAR_X.has('bas'))return;const p0=[P[0][0],-P[0][1],0],wl=nbqLife(),D=w/(.14*1.188),Lt=L+D*4.4;
  /* the shoot is cut square with its scape: the sheaths' feet clipped at the cut (a box under it), the cut face laid on in front */
  const W0=WILT,f=svF,x0=P[0][0],y0=P[0][1],bw=w*2.4,id='nbb'+(gid++);
  E('path',{d:`M-1e5 -1e5H1e5V1e5H-1e5ZM${f(x0-bw)} ${f(y0)}H${f(x0+bw)}V${f(y0+bw*4)}H${f(x0-bw)}Z`,'clip-rule':'evenodd'},E('clipPath',{id},GDEF||defs));
  const g=G(par,{'clip-path':`url(#${id})`});WILT=null;
  try{NBQ_BASAL.forEach(([az,k,ln,dr,fo,tw,rk,fl,fa],i)=>{const Out=[Math.cos(az),0,Math.sin(az)];if((Out[2]<0?-1:1)!==side)return;
      svStrapLeafX(g,p0,[0,1,0],Out,Object.assign({},NBQ_LEAF,{len:Lt*k,w:.36*D/(Lt*k),sr:w*(.55+.12*rk),lean:ln,droop:dr,fold:fo||null,flop:fl,flopAt:fa,tw,
        sd:svSeed('narcisse-bouquet-basale',i),wl}))});
    if(side>0){const sc=nbqScW((GHI['narcisse-bouquet']||{}).sc||NBQ_SC,wl);svCutFace(par,[x0,y0],[1,0],w,sc,sc.sv,{bundle:1.35,rings:[.88,.76,.64],bc:'#ccd4a8'})}}
  finally{WILT=W0}}
if(typeof GHI!=='undefined'&&GHI['narcisse-bouquet'])Object.assign(GHI['narcisse-bouquet'],{sc:NBQ_SC,wilt:nbqWiltCol,cut:1,basal:nbqBasal});
