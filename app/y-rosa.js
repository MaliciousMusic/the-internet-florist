/* ---------- y-rosa.js: the roses (Rosa), one card per sort on the rose kit (svRose, y3-rose.js) ----------
   rose-standard: the florist's hybrid tea (Rosa x hybrida), a large high-centred head, 30 to 40 petals, from the green bud in its sepals to the
   blown rose on its stamens; its fading after the photographs (refcache/rose-standard: 1396, 1403, 1411 red, 1399 orange, 590 white): the head
   bows at the neck, the margins brown and dry, the outer petals wilt or fall, the sepals yellow. The colourways are the catalogue's (CW_RSTD,
   s6a.js: ids and order unchanged), their final colours set by the finishing after coloris.md.
   A sort of the same family is a card of ten lines: ROSA_GENES with its own petal count, a spec object with what differs (L, W, cup, roll, open
   law, sep, stN...), its colour list and SV_HEAD / GHI lines (see ROSA_STD below). */
const ROSA_SID='rose-standard';
const ROSA_GENES={n:[[30,.25],[34,.45],[38,.3]],
  tep:{dL:[.88,1.1],dW:[.9,1.1],dph:[-.2,.2],da0:[-.05,.05],da1:[-.12,.12],tw:[-.1,.1],wav:[.015,.05],wk:[1.4,2.4],wph:[0,6.28],notch:[.5,1.5],tip:[1.7,2.4],asym:[-.06,.06],big:[-1,1],curl:[0,0],cup:[.9,1.1],roll:[.8,1.2],sd:'sd'},
  late:{hang:[.6,1.2],wl:[.8,1.2]},head:{rot:[0,6.28],op:[-.04,.04],dh:[-3,3],ds:[-.04,.04],dl:[-.025,.025],sd:'sd',sl:[0,4,'r']}};
/* the calyx's material: the inner face pale grey green (felted), the back darker; it yellows as the head fades (svRose) */
const ROSA_SEP={fr:'#a3b38a',bk:'#4a6a2e',shade:'#1c3210',lite:'#b8cc96',bshade:'#1a2e0e',blite:'#86a462',rim:'#c4d2ac',brim:'#7a9a56',cast:'#0e1a08',edge:'#24401a',yel:'#b4a456',rimW:.005,rimA:.3};
/* the margin band of the edged colourways: [width (share of the petal), opacity] */
const ROSA_BAND={'jaune-rouge':[.12,.92,.5],'blanc-rose':[.15,.88],champagne:[.3,.5],jumilia:[.1,.92],'rose-creme':[.2,.55],'bicolore-jaune':[.34,.62]};
const ROSA_M={};
function rosaMat(cw,key){const K=key||cw.id;if(ROSA_M[K])return ROSA_M[K];const c=cw.c,[h,s,l]=h2l(c),pale=l>.8,dark=l<.3,
    inner=cw.c2?mix(c,cw.c2,cw.k2||.7):l2h(h,Math.min(1,s*1.04),l*(pale?.97:.92)),outer=cw.green?mix(c,cw.green,.75):c,
    fr=cw.base||cw.tip?[[0,cw.base||outer],[.25,c],[.55,c],[1,cw.tip||inner]]:[[0,outer],[.2,cw.green?mix(c,cw.green,.3):c],[.5,c],[1,inner]],bk=fr.map(([f,x])=>[f,pale?mix(x,'#ece6d6',.2):mix(x,'#ffffff',dark?.06:.14)]),
    /* v3: a white petal's shade is warm (cream, ivory in shadow on the photographs), never grey-green: the hue of the petal when it has one
       (a yellowish or greenish white darkens to olive: its shade is pulled to ivory's warm hue), else ivory's */
    pC=s*(1-Math.abs(2*l-1)),pH=pC<.06||(h>=36&&h<170)?36:h,
    shade=pale?l2h(pH,Math.min(pC<.06?.38:.5,Math.max(.3,s*1.3+.1)),l*.8):l2h(h,Math.min(1,s*1.1),l*(dark?.42:.5)),lite=pale?mix(c,'#ffffff',.65):l2h(h,s*.92,Math.min(.95,l+(1-l)*.42)),
    m={fr,bk,shade,lite,bshade:mix(shade,'#ffffff',.08),blite:mix(lite,'#ffffff',.2),rim:dark?mix(c,'#14000a',.45):mix(c,'#ffffff',pale?.7:.3),brim:mix(c,'#ffffff',.4),
      rimA:dark?.5:.38,cast:pale?mix(c,'#4a3016',.72):mix(c,'#0a0408',.78),edge:pale?mix(c,'#6a4828',.45):mix(c,'#100408',.5),sep:ROSA_SEP,anth:'#e2ac28',anthE:'#9a6a14',fil:'#e0c878',urn:['#2c461c','#55803a','#8db068'],K:{}};
  if(cw.edge){const b=ROSA_BAND[cw.id]||[.28,.85];m.band={c:cw.edge,w:b[0],op:b[1],b:.006,f:b[2]||.62,hk:.42}}
  if(cw.flame)m.flames={c:cw.flame,n:[9,15],op:.85,du:.011,len:[.18,.8]};
  return ROSA_M[K]=m}
/* the faded colours by family, after the photographs (red 1396, 1403, 1411: toward wine and black red, the margins brown; orange 1399: rust then
   brown; white 590: ivory then beige blotched with brown); yellow and pink have no photograph: deduced from the orange and the red, and the
   common rule (the colour withdraws toward the base, the margins dry first) */
function rosaWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=60&&h<170&&s>.1&&l<.72)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(l<.16)return mix(c,'#1e0a0c',.4*w);
  /* v3: the dry browns (the faded margins, creases and outlines) stay brown, never turned rust by the orange family's rule */
  if(h>=15&&h<50&&s<.5&&l<.45)return mix(c,'#4a3020',.2*w);
  /* (v3: a white's own warm shade, ivory to cream, fades with it: never turned salmon by the orange family's rule) */
  if(l>.86||(s<.15&&l>.6)||(h>=20&&h<60&&s<.45&&l>.55)){let o=mix(c,'#efe2c4',.6*Math.min(1,w/.5));o=mix(o,'#c4a87e',.45*svSm((w-.45)/.4));return mix(o,'#7a5a3a',.25*svSm((w-.75)/.25))}
  /* the family by chroma, not by lightness: a red's lit and back tones stay red (toward wine), a pink's go mauve and buff */
  const C=s*(1-Math.abs(2*l-1));
  if(h>=335||h<12){if(l<.5||C>.42){/* v3: measured on 1396, 1403, 1411 (median hue 0, -5, -11, lightness .32, .37, .17): a crimson warms toward brick red as it
    fades, then darkens to black red as it dries */const hh=h<15?h+360:h,o=l2h((hh+(358-hh)*.6*Math.min(1,w/.6)-6*svSm((w-.7)/.3))%360,s*(1-.15*w),l*(1-.45*svSm((w-.55)/.4)));
    return mix(o,'#3a1218',.3*svSm((w-.7)/.3))}
    let o=mix(c,'#c89aa4',.5*Math.min(1,w/.5));o=mix(o,'#8a5a5e',.6*svSm((w-.45)/.4));return mix(o,'#6a4436',.3*svSm((w-.75)/.25))}
  if(h>=250){const o=mix(c,'#a87898',.45*Math.min(1,w/.5));return mix(o,'#6e4a5a',.55*svSm((w-.45)/.4))}
  if(h<45){let o=mix(c,l>.7?'#e4a88a':'#c0603a',.45*Math.min(1,w/.5));o=mix(o,'#8e5532',.6*svSm((w-.4)/.4));return mix(o,'#5e3a24',.3*svSm((w-.75)/.25))}
  let o=mix(c,'#d8b050',.45*Math.min(1,w/.5));o=mix(o,'#a07a3a',.6*svSm((w-.4)/.4));return mix(o,'#6e4e2a',.3*svSm((w-.75)/.25))}
function rosaLife(o,sid){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:sid||ROSA_SID,rec:{}})):0}
/* the card of the hybrid tea: the kit's defaults are its measures */
/* the measured colourways (refcache/rose-standard/coloris.md): c = body, base = the foot of the petal, tip = its end, edge = margin, flame = stripes.
   Median of the photographs of at least 2 distinct cultivars; the one with a single cultivar (orange) keeps the catalogue's colour (CW_RSTD) and is to be confirmed.
   champagne drops the catalogue's pink edge (none on the three cultivars photographed).
   Where the photographs were much darker than the catalogue (dL > 20: mondial, blush, jaune) the measured hue and chroma are kept at the catalogue's lightness. */
const ROSA_STD_CWX={
  blanc:{c:'#f2f0e8',base:'#e9ecdc',tip:'#f4f1ea'},
  creme:{c:'#ebe9db',base:'#e8e5d1',tip:'#ddd7c5'},
  champagne:{c:'#e9e1c0',base:'#f8e9ca',tip:'#e0dab9',edge:null},
  'coeur-peche':{c:'#f5e6d9',base:'#f8e8dc',tip:'#ddd2c4'},
  mondial:{green:null},
  blush:{c:'#fed9df',base:'#ffafcb',tip:'#ffedf1'},
  poudre:{c:'#d29aa4',base:'#cf7881',tip:'#c8acb1'},
  rose:{c:'#f6609e',base:'#f8569c',tip:'#f67cc2'},
  'vieux-rose':{c:'#cd7c97',base:'#da748f',tip:'#827877'},
  'rose-vif':{c:'#d3273f',base:'#e21a51',tip:'#db4262'},
  fuchsia:{},
  cerise:{c:'#f7295d',base:'#eb083b',tip:'#f5327c'},
  peche:{c:'#ffb190',base:'#ffad7f',tip:'#f7a990'},
  abricot:{c:'#ff8e4d',base:'#ff8646',tip:'#ffaa70'},
  saumon:{c:'#ff7075',base:'#ff946f',tip:'#ff7873'},
  corail:{c:'#ef5d57',base:'#f95253',tip:'#ee7f66'},
  jaune:{c:'#fccc53',base:'#ffd57e',tip:'#e5ce63'},
  'jaune-pale':{c:'#fed988',base:'#f1d7a4',tip:'#f7d795'},
  rouge:{c:'#9c0f36',base:'#8b242d',tip:'#a20714'},
  'rouge-velours':{c:'#88343f',base:'#7e283c',tip:'#903c43'},
  bordeaux:{c:'#7f3a48',base:'#763242',tip:'#78484a'},
  lavande:{c:'#baa9d4',base:'#b49dcc',tip:'#a190a9'},
  mauve:{c:'#b975be',base:'#b361a7',tip:'#b97bc2'},
  vert:{c:'#c2d278',base:'#bbc86e',tip:'#c4d082'},
  caramel:{c:'#be845e',base:'#bd744a',tip:'#c0a07e'},
  terracotta:{c:'#e36e43',base:'#e77b48',tip:'#de6741'},
  'jaune-rouge':{c:'#e8d772',edge:'#e16b31'},
  'blanc-rose':{c:'#f2ece9',edge:'#b08192'},
  'blanc-flamme':{c:'#f4e9ef',flame:'#e25f90'}};
const ROSA_STD={sid:ROSA_SID,cwl:()=>typeof CW_RSTD!=='undefined'?CW_RSTD:[],genes:s=>svGenes(s,ROSA_GENES),mat:cw=>rosaMat(Object.assign({},cw,ROSA_STD_CWX[cw.id]||{})),life:()=>rosaLife()};
/* in a bouquet the head never bows (its room decides the composition): the same card with noTip */
const ROSA_STD_BQ=Object.assign({},ROSA_STD,{noTip:1});
function rosaSvg(par,B,O,D,cwId,op,seed,wl,S,bent){S=S||ROSA_STD;if(S.pick)S=S.pick(seed);const sid=S.sid||ROSA_SID,cwx=S.cwl().find(x=>x.id===cwId)||{id:cwId,c:'#c8183a'};
  /* the rose has no GHI card (one would change how the composer treats it, e5.js recInfo): its head wilts by its own colours here, whatever
     filter the bouquet or the sheet has set (lifeCol, svaWiltCol), at the head's own life */
  const w=wl==null?rosaLife(null,sid):wl,W0=typeof WILT!=='undefined'?WILT:null;if(w>0&&typeof lifeWilt==='function')WILT=lifeWilt(w,rosaWiltCol,sid);
  try{return svRose(par,B,O,D*(S.dK||1),S,cwx,op,seed,w,bent)}finally{WILT=W0}}
SV_HEAD[ROSA_SID]=rosaSvg;
if(typeof GHI!=='undefined'&&GHI[ROSA_SID])GHI[ROSA_SID].wilt=rosaWiltCol;
/* ---------- the plant (rosePlant, r1a.js): the old drawing's chance consumed exactly, so the bouquet's composition does not move ----------
   the flower and the bud: roseFlower drew one R; the leaf: pinnateLeaf drew 4 per pair of leaflets and 1 for the terminal (plus the old
   3-or-5 choice of the second leaf, kept); the bouquet's stem leaf (stemLeaves, s0.js) has drawn one R before the sv hook: the rest here */
/* the wilting head on a plant or in a bouquet: its neck bends (photographs 1394, 1396, 1399, 1400, 1403, 1411, 1412: the neck just under the hip
   folds, the head hangs to one side). The neck is drawn here as an arc of the stem leaving the stem's end O along the head's axis (tangent to
   it, never a broken stem) and turning by the bow, over a length that grows as the rose fades; the head is set at its end, already bowed. The
   bow, its side and its length come from the wilt and the head's seed only: no draw of the bouquet's chance */
function rosaNeck(par,B,O,D,seed,wl,S){const tip=SVROSE_DEF.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0);if(!(tip>.01))return null;
  /* v2: the neck leaves the stem's end along the stem's own line in the picture (the head's axis projected: a head turned to the eye has its
     neck still rising), arches over in the picture's plane toward the side it leans to (else its seed's) and lets the head hang beyond it, seen
     from the side (photographs 1396, 590: the neck over, the head under it). Its length keeps the hanging head clear of the stem below */
  const sd=Math.round(seed)||1,b2=B[2];let t0=[b2[0],b2[1],0];const tl=Math.hypot(t0[0],t0[1]);t0=tl>.3?[t0[0]/tl,t0[1]/tl,0]:[0,1,0];
  /* v3, the stem seen whole (plant sheets: SVA_LIFE set; a card without noTip): a shepherd's crook. The neck turns until the head hangs
     straight down under it (photograph 1396) and reaches far enough sideways that the hanging head is clear of the stem below (its half
     breadth and the stem's width beyond the stem's line): the stem never runs across the head. It turns away from the leaf at the head's
     node (rosaLeafSv records it), so that the leaf does not lie over the head either. In a bouquet (noTip) the neck keeps its v2 length:
     c5 measures the head against the vase's mouth and the bouquet's chance would move */
  const crook=!(S&&S.noTip)||(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null);let side=Math.abs(t0[0])>.12?Math.sign(t0[0]):(pxHashS(sd,5,3)<.5?-1:1);
  if(crook&&Math.abs(t0[0])<.25){const lv=ROSA_LV.filter(q=>Math.hypot(q.pos[0]-O[0],q.pos[1]-O[1])<D*1.6&&Math.abs(q.H[0])>.2).sort((a,b)=>b.pos[1]-a.pos[1])[0];if(lv)side=-Math.sign(lv.H[0])}
  /* the crook's end hangs at af from the upright (to the side), whatever the stem's own lean a0 there: the neck turns by af - a0 */
  const a0=Math.atan2(side*t0[0],t0[1]),af=Math.min(2.95,tip*1.75),
    A=[0,0,-side],th=crook?Math.max(.05,af-a0):Math.min(2.45,tip*1.45),n=crook?16:12,w=D*.05,
    cs=S&&S.sid===ROSA_INT_SID?ROSA_INT_SVSC:ROSA_SVSC,hv=S&&S.noTip&&!crook?0:svSm((th-1.2)/.9),
    r=crook?Math.max(D*(.36+.12*pxHashS(sd,11,5))*Math.min(1,tip/.5)/th,hv*(D*.47*Math.max(0,-Math.cos(af))+w*1.6)/Math.max(.3,Math.cos(a0)-Math.cos(af)))
      :Math.max(D*(.36+.12*pxHashS(sd,11,5))*Math.min(1,tip/.5)/th,hv*D*Math.max(0,.62-.32*Math.sin(th))/Math.max(.3,1-Math.cos(th))),Ln=r*th;
  /* the head's frame turned onto that line (its own roll kept), then bowed with the neck */
  let b0=V3.add(B[0],V3.sc(t0,-V3.dot(B[0],t0)));if(V3l(b0)<.1)b0=V3.add(B[1],V3.sc(t0,-V3.dot(B[1],t0)));b0=V3.sc(b0,1/V3l(b0));
  let b1=V3.cr(t0,b0);if(V3.dot(V3.cr(B[0],B[1]),B[2])<0)b1=V3.sc(b1,-1);const Bs=[b0,b1,t0];
  let p=V3.add(O,V3.sc(t0,-w*.6));const C=[[p[0],-p[1]]],W=[w];p=O.slice();C.push([p[0],-p[1]]);W.push(w);
  /* the crook bends hardest at its top (the neck gives way just under the hip): the turn is spread by a sine law along the neck */
  for(let i=0;i<n;i++){const q=(i+.5)/n,t=rotA(t0,A,th*(crook?(q-.12*Math.sin(2*Math.PI*q)):q));p=V3.add(p,V3.sc(t,Ln/n));C.push([p[0],-p[1]]);W.push(w*(1-(crook?.2:.12)*(i+1)/n))}
  svStemLine(par,C,W,cs);return{B:Bs.map(v=>rotA(v,A,th)),O:p}}
/* the leaves of the plant being drawn (rosaLeafSv): where they leave the stem and toward where, for the crook to turn away from them */
const ROSA_LV=[];let ROSA_HG=null;
function rosaSvgPut(par,B,O,D,cw,op,o,S){S=S||ROSA_STD_BQ;if(!SV_ON||!cw||!cw.id)return false;const x=rnd(),k=S.sid===ROSA_SID?'':S.sid,sd=svSeed('rose'+k,cw.id,Math.floor(x*1e6)),wl=rosaLife(o,S.sid),
    sheet=typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null,hg=sheet?G(par):par,nk=rosaNeck(hg,B,O,D,sd,wl,S);rosaSvg(hg,nk?nk.B:B,nk?nk.O:O,D,cw.id,op,sd,wl,S,!!nk);
  /* on a sheet the hanging head stays over the leaves drawn after it (their parts come later in depth order, rosaLeafSv slips them under) */
  ROSA_HG=sheet&&nk?hg:null;return true}
function rosaBudSvgPut(par,B,O,s,cw,a,S){S=S||ROSA_STD_BQ;const x=rnd(),k=S.sid===ROSA_SID?'':S.sid;rosaSvg(par,B,O,s*1.3,cw.id,.03+.1*(a||0),svSeed('rose-bouton'+k,cw.id,Math.floor(x*1e6)),rosaLife(null,S.sid),S)}
/* the old leaf drawn into a detached group (its defs too) and thrown away: its chance (pinnateLeaf, and petS in each stemLeaf, which depends on
   the leaflets drawn) consumed exactly */
function rosaOldLeaf(x,y,a,l,col,lf,opt){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{pinnateLeaf(dm,x,y,a,l,col,lf,opt)}finally{GDEF=g0}}
const rosaLeafSv=(D,cw,o,sid,lk)=>{ROSA_LV.length=0;ROSA_HG=null;return(og,pos)=>{ROSA_LV.push({pos:pos.slice(),H:og.H.slice()});
  const pt=lsLeaf2D(og,pos,D*R(1.05,1.35),(par,x,y,a,l)=>{const nl=og.p.i>1?5:og.p.i===1&&rnd()<.5?3:5;
  rosaOldLeaf(x,y,a,l,'#2f5a26',nl,{w:.55,gloss:.45,side:.4});const s=svSeed('rose-feuille',cw.id,Math.round(x*8),Math.round(y*8),Math.round(l*8));
  svRoseLeaf(par,x,y,a,l*(lk||1),{n:nl,wl:rosaLife(o,sid),sd:s,side:s%5===0?-.6:.7})});
  /* a leaf drawn after the hanging head of a sheet goes under it (same order of drawing, so the same chance) */
  if(pt&&pt.fn){const f0=pt.fn;pt.fn=par=>{const hg=ROSA_HG;if(hg&&hg.parentNode===par){const t=G(par);par.insertBefore(t,hg);f0(t)}else f0(par)}}return pt}};
/* the bouquet's stem leaf: s0.js draws no R before this hook (svNoR), the old pinnate leaf's chance is consumed here */
function rosaStemLeafHook(sid,lk){if(typeof STEML==='undefined'||!STEML[sid])return;const sl=STEML[sid];sl.svNoR=1;sl.sheetY=.5;sl.sv=(par,x,y,a,l,q)=>{const nl=sl.lf||3;
  rosaOldLeaf(x,y,a,l,sl.col||'#3f6a2c',nl,{side:(q&&q.s||1)*.5,w:sl.w||.5,gloss:sl.gloss,teeth:sl.teeth});const s=svSeed('rose-feuille-tige',Math.round(x*8),Math.round(y*8),Math.round(l*8));
  svRoseLeaf(par,x,y,a,l*(lk||1),{n:nl,wl:rosaLife(null,sid),sd:s,side:s%5===0?-.6:.7})};
  /* the cut rose's upper third (photographs 1238, 1265, 1267, 1268, 1346): besides the leaf at the head's node, 1 to 3 more compound leaves,
     alternate, spaced 4 to 6.5 cm down the stem from the neck, never under the vessel's mouth; the foot stripped. Their number, places and
     sizes come from a hash of the stem's end (svRng): none of the bouquet's chance */
  sl.after=(par,P,c)=>{const e=P[3],r=svRng(svSeed('rose-tige',sid,Math.round(e[0]*4),Math.round(e[1]*4))),ne=1+Math.floor(r()*2.999),gap=(4+2.5*r())*UPC,L0=(sl.len||9)*UPC,
      pts=[],acc=[0];for(let i=0;i<=60;i++){pts.push(bz(P,1-i/60));if(i)acc.push(acc[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]))}
    const at=sd=>{for(let i=1;i<=60;i++)if(acc[i]>=sd)return 1-i/60;return null},sOf=q=>acc[Math.round((1-q)*60)];
    let side=c.qs.length?c.side:r()<.5?-1:1;
    for(let k=0;k<ne;k++){const q=at((1+.35*r())*UPC+gap*k*(.85+.3*r()));if(q==null)break;const p=bz(P,q);if(p[1]>c.yMax-1.5*UPC)break;
      if(c.qs.some(q2=>Math.abs(sOf(q2)-sOf(q))<2.5*UPC))continue;
      const p2=bz(P,Math.min(1,q+.02)),ta=Math.atan2(p2[1]-p[1],p2[0]-p[0]),ang=ta+side*(sl.up||38)*Math.PI/180*(.85+.3*r()),len=L0*(.85+.25*r())*(1-.1*k),
        sd=svSeed('rose-feuille-haut',sid,Math.round(p[0]*8),Math.round(p[1]*8)),wr=G(par);
      svRoseLeaf(wr,p[0],p[1],ang,len*(lk||1),{n:r()<.3?3:5,wl:rosaLife(null,sid),sd,side:sd%5===0?-.6:.7});if(typeof growUp==='function')growUp(wr,p[0],p[1],Math.max(0,(c.t||0)-300),500);side=-side}}}
rosaStemLeafHook(ROSA_SID);
/* the stem: smooth and glossy, reddening a little under the head; prickles on half the stems (the gene: a florist's stem thorny or dethorned) */
const ROSA_SVSC=['#26401a','#4c7630','#86ac5a','#d6e8bc'];ROSA_SVSC.sv={swell:.022,gloss:.55,red:'#6e3a28',redF:.82,redA:.22,post:svRoseThorns({p:.5})};
if(typeof GHI!=='undefined'&&GHI[ROSA_SID])GHI[ROSA_SID].sc=ROSA_SVSC;
const rosaStemOpts=(D,o)=>{const wl=rosaLife(o),b=svSm((wl-.35)/.45),tip=SVROSE_DEF.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0);
  return{w:D*.075,wig:.02,e:.02-.25*b,aimK:.24+.16*b,aimAt:ax=>{const A0=V3.cr(ax,[0,-1,0]),al=V3l(A0);if(tip<=0||al<.05)return ax;
    return rotA(ax,V3.sc(A0,1/al),.8*Math.min(tip,Math.acos(Math.max(-1,Math.min(1,-ax[1])))*.95))}}};
let ROSA_STEMO=typeof location!=='undefined'&&/[?&]rstem=1/.test(location.search);
/* ---------- rose-intermediaire-kenya: the intermediate and sweetheart roses cut in Kenya and Ethiopia (SKU 31 to 45) ----------
   After the producers' profile photographs (refcache/rose-intermediaire-kenya: Interplant, De Ruiter, Kikwetu; img.py-like measures in
   etat.md): a head of 4.5 to 5.5 cm sold half open as a goblet (head h/w about 1.0 to 1.3 with its urn), straight sided with a broad flat
   top where the spiral shows, fewer and broader rounder petals than the hybrid tea (25 to 32), the outer ones rolling back only at the tips,
   a lower centre once open; the sepals long, narrow, turned down along the urn; a slender clear green stem (stem/head width about .08) with
   smaller leaves. A third of the heads are sweethearts (Smoothie, Moonwalk, Cool Blue): a smaller round bud, fewer petals, an even lower
   heart. No faded photograph of its own: the wilt is the hybrid tea's (rosaWiltCol, tip, limp, shed). Colours: the catalogue's (CW_RINT) until
   the finishing writes the measured ones (coloris.md); the edged one (jumilia) and the rose-and-cream take the hybrid tea's margin band. */
const ROSA_INT_SID='rose-intermediaire-kenya';
const ROSA_INT_GENES=Object.assign({},ROSA_GENES,{n:[[25,.3],[28,.45],[32,.25]]}),ROSA_SWH_GENES=Object.assign({},ROSA_GENES,{n:[[20,.35],[23,.45],[26,.2]]});
/* the yellow bicolour (Fire Flare, Fire Fly: photographs 81 to 84) is yellow flushed red orange at the tips: a broad soft margin band */
/* the measured colourways (coloris.md, the median of the photographs of at least 2 cultivars): c = body, base = the foot of the petal, tip = its end,
   edge = the margin of the edged ones. The four with one cultivar only (cerise, violet, blanc bordé de rose vif, rose et crème) keep the catalogue's
   colour and are to be confirmed. */
const ROSA_INT_CWX={
  /* v2: the white's measured body (#d7ca95, C 25: photographs in shade) read as a yellow: lighter and half the chroma, a creamy white */
  blanc:{c:'#f0e9d2',base:'#e8dfbf',tip:'#f2ecd9'},
  creme:{c:'#decca6',base:'#e2c6a3',tip:'#e0dcc4'},
  rose:{c:'#e379b0',base:'#e786bc',tip:'#c585a6'},
  'rose-vif':{c:'#a91349',base:'#a61148',tip:'#c23676'},
  orange:{c:'#cc3b2c',base:'#de5b3c',tip:'#d6452f'},
  jaune:{c:'#dfb935',base:'#d8a732',tip:'#ccaf24'},
  rouge:{c:'#990f1d',base:'#8c061b',tip:'#9b1421'},
  'rouge-velours':{c:'#6c171d',base:'#3a0a0e',tip:'#660811'},
  lavande:{c:'#c69cb5',base:'#a6718e',tip:'#cab8c5'},
  brun:{c:'#9b6336',base:'#895631',tip:'#d2ab82'},
  'bicolore-jaune':{c:'#df8f0e',base:'#db930b',tip:'#d97e1f',edge:'#d87c20',c2:null}};
const ROSA_INT={sid:ROSA_INT_SID,cwl:()=>typeof CW_RINT!=='undefined'?CW_RINT:[],genes:s=>svGenes(s,ROSA_INT_GENES),
  /* its own cache key: the catalogue reuses ids (rouge, rose...) with other colours than the hybrid tea's */
  mat:cw=>rosaMat(Object.assign({},cw,ROSA_INT_CWX[cw.id]||{}),'int:'+cw.id),life:()=>rosaLife(null,ROSA_INT_SID),
  /* broader rounder petals, a lower flatter centre, tips less pointed and less rolled: the goblet of the photographs */
  L:[[0,.98],[.5,.84],[.8,.78],[1,.72]],W:[[0,1.04],[.5,1.1],[.8,1],[1,.84]],z0:[[0,-.03],[.5,.03],[.8,.15],[1,.25]],
  tipF:[[0,.78],[.35,.92],[.55,1.25],[1,1.35]],rollo:[[0,2.2],[.35,1.6],[.6,.4],[.75,0],[1,0]],a1o:[[0,1.22],[.3,1.08],[.55,.78],[.75,.3],[1,-.1]],
  a0o:[[0,.5],[.3,.42],[.55,.34],[.75,.14],[1,.04]],oLaw:[.32,.5,.5,.62],coneB:null,
  /* the bud: rounder, its widest part higher than the hybrid tea's pointed egg */
  budH:[.7,.42],budR:.35,budK:.85,
  /* long narrow sepals turned down, small appendages */
  sep:Object.assign({},SVROSE_DEF.sep,{L:.95,W:.24,lob:[1,1,1,0,0],lobA:.7}),stN:[26,46]};
const ROSA_SWH=Object.assign({},ROSA_INT,{genes:s=>svGenes(s,ROSA_SWH_GENES),dK:.88,z0:[[0,-.03],[.5,.02],[.8,.12],[1,.2]],budH:[.62,.38],budR:.38,budK:1,cupc:[[0,1.05],[1,1.35]],
  /* its outer petals stay closer round the ball (no flat wings in profile) */
  a1o:[[0,1.02],[.3,.92],[.55,.7],[.75,.28],[1,-.1]]});
const ROSA_INT_BQ=Object.assign({},ROSA_INT,{noTip:1}),ROSA_SWH_BQ=Object.assign({},ROSA_SWH,{noTip:1});
/* ?rswh=1 / 0 (sheets): every head a sweetheart / an intermediate; else a third of the heads by their seed */
let ROSA_SWHF=typeof location!=='undefined'?(location.search.match(/[?&]rswh=(\d)/)||[])[1]:null;
const rosaIntPick=bq=>seed=>{const sw=ROSA_SWHF!=null?ROSA_SWHF==='1':pxHashS(Math.round(seed)||1,61,7)<.34;return sw?(bq?ROSA_SWH_BQ:ROSA_SWH):(bq?ROSA_INT_BQ:ROSA_INT)};
const ROSA_INT_P=Object.assign({},ROSA_INT,{pick:rosaIntPick(0)}),ROSA_INT_PBQ=Object.assign({},ROSA_INT,{pick:rosaIntPick(1)});
SV_HEAD[ROSA_INT_SID]=(par,B,O,D,cwId,op,seed,wl)=>rosaSvg(par,B,O,D,cwId,op,seed,wl,ROSA_INT_P);
rosaStemLeafHook(ROSA_INT_SID,.92);
/* the stem: a clearer, bluer green than the hybrid tea's (photographs 41, 42, 94: #2e6b2d at its middle), mostly dethorned */
const ROSA_INT_SVSC=['#1c3e18','#2f6c2c','#5f9a48','#c4e0a8'];ROSA_INT_SVSC.sv={swell:.02,gloss:.6,red:'#5e3a26',redF:.86,redA:.14,post:svRoseThorns({p:.3})};
/* sheets only, for tuning: ?rosap={"limp":[0.5,0.2]} patches the rose card's defaults (SVROSE_DEF) before any head is drawn */
if(typeof location!=='undefined'){const m=/[?&]rosap=([^&]*)/.exec(location.search);if(m)try{Object.assign(SVROSE_DEF,JSON.parse(decodeURIComponent(m[1])))}catch(e){}}
