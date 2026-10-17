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
  'rose-vif':{c:'#d9456d',base:'#d65a82',tip:'#c0416c'},
  fuchsia:{},
  cerise:{c:'#f7295d',base:'#eb083b',tip:'#f5327c'},
  peche:{c:'#eca590',base:'#eab09b',tip:'#d68d72'},
  abricot:{c:'#ff8e4d',base:'#ff8646',tip:'#ffaa70'},
  saumon:{c:'#ff7075',base:'#ff946f',tip:'#ff7873'},
  corail:{c:'#ef5d57',base:'#f95253',tip:'#ee7f66'},
  jaune:{c:'#f8cc45',base:'#f0d57a',tip:'#e9bb2e'},
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
  const w=wl==null?rosaLife(null,sid):wl,W0=typeof WILT!=='undefined'?WILT:null;if(w>0&&typeof lifeWilt==='function')WILT=lifeWilt(w,S.wilt||rosaWiltCol,sid);
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
    cs=S&&S.svsc?S.svsc:S&&S.sid===ROSA_INT_SID?ROSA_INT_SVSC:ROSA_SVSC,hv=S&&S.noTip&&!crook?0:svSm((th-1.2)/.9),
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
/* the composer measures a bouquet's head (c5.js getBBox: a head near the rim is raised and drawn again, new draws of chance). A card with okd
   (the old drawing's kind) hands it the old head's box: the old hip and head drawn in a scratch group (their one draw of chance kept for the
   seed), measured, thrown away, and an invisible rectangle left in their place; the SVG head is then drawn out of the measure (rosaObMark) */
function rosaOldBox(par,B,O,D,cw,op,S){const r0=rnd;let x0=null;rnd=()=>{const v=r0();if(x0===null)x0=v;return v};const tmp=G(par),g0=GDEF;GDEF=document.createElementNS('http://www.w3.org/2000/svg','g');let b=null;
  try{roseHip(tmp,B,O,D);roseFlower(tmp,B,O,D,cw,op,S.okd);const q=tmp.getBBox();if(q.width||q.height)b=q}catch(_){b=null}finally{rnd=r0;GDEF=g0;tmp.remove()}
  if(x0===null)x0=rnd();if(b)E('rect',{x:f(b.x),y:f(b.y),width:f(b.width),height:f(b.height),fill:'none',stroke:'none'},par);return{x:x0,b}}
/* the SVG head drawn whole, out of the composer's measure: inside a marker (getBBox leaves markers out) set on a point of zero length at the old
   box's centre, its content in the head's own coordinates (refX, refY = that point); without an old box, or without defs, a plain group */
function rosaObMark(par,b,draw){const dh=GDEF;if(!b||!dh){draw(G(par));return}const cx=b.x+b.width/2,cy=b.y+b.height/2,id='rjm'+(gid++),
  m=E('marker',{id,markerUnits:'userSpaceOnUse',markerWidth:1,markerHeight:1,refX:f(cx),refY:f(cy),orient:0,overflow:'visible'},dh);draw(G(m));
  E('path',{d:`M${f(cx)},${f(cy)}h0`,fill:'none',stroke:'none','marker-start':`url(#${id})`},par)}
function rosaSvgPut(par,B,O,D,cw,op,o,S){S=S||ROSA_STD_BQ;if(!SV_ON||!cw||!cw.id)return false;const sheet0=typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null,ob=S.okd&&!sheet0?rosaOldBox(par,B,O,D,cw,op,S):null;
  if(ob){const sd=svSeed('rose'+S.sid,cw.id,Math.floor(ob.x*1e6)),wl=rosaLife(o,S.sid);rosaObMark(par,ob.b,g=>{const nk=rosaNeck(g,B,O,D,sd,wl,S);rosaSvg(g,nk?nk.B:B,nk?nk.O:O,D,cw.id,op,sd,wl,S,!!nk)});ROSA_HG=null;return true}
  const x=rnd(),k=S.sid===ROSA_SID?'':S.sid,sd=svSeed('rose'+k,cw.id,Math.floor(x*1e6)),wl=rosaLife(o,S.sid),
    sheet=typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null,hg=sheet?G(par):par,nk=rosaNeck(hg,B,O,D,sd,wl,S);rosaSvg(hg,nk?nk.B:B,nk?nk.O:O,D,cw.id,op,sd,wl,S,!!nk);
  /* on a sheet the hanging head stays over the leaves drawn after it (their parts come later in depth order, rosaLeafSv slips them under) */
  ROSA_HG=sheet&&nk?hg:null;return true}
function rosaBudSvgPut(par,B,O,s,cw,a,S){S=S||ROSA_STD_BQ;const sheet0=typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null;
  if(S.okd&&!sheet0){const ob=rosaOldBox(par,B,O,s,cw,.14,S);rosaObMark(par,ob.b,g=>rosaSvg(g,B,O,s*1.3,cw.id,.03+.1*(a||0),svSeed('rose-bouton'+S.sid,cw.id,Math.floor(ob.x*1e6)),rosaLife(null,S.sid),S));return}
  const x=rnd(),k=S.sid===ROSA_SID?'':S.sid;rosaSvg(par,B,O,s*1.3,cw.id,.03+.1*(a||0),svSeed('rose-bouton'+k,cw.id,Math.floor(x*1e6)),rosaLife(null,S.sid),S)}
/* the old leaf drawn into a detached group (its defs too) and thrown away: its chance (pinnateLeaf, and petS in each stemLeaf, which depends on
   the leaflets drawn) consumed exactly */
function rosaOldLeaf(x,y,a,l,col,lf,opt){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{pinnateLeaf(dm,x,y,a,l,col,lf,opt)}finally{GDEF=g0}}
const rosaLeafSv=(D,cw,o,sid,lk,lo)=>{ROSA_LV.length=0;ROSA_HG=null;return(og,pos)=>{ROSA_LV.push({pos:pos.slice(),H:og.H.slice()});
  const pt=lsLeaf2D(og,pos,D*R(1.05,1.35),(par,x,y,a,l)=>{const nl=og.p.i>1?5:og.p.i===1&&rnd()<.5?3:5;
  rosaOldLeaf(x,y,a,l,'#2f5a26',nl,{w:.55,gloss:.45,side:.4});const s=svSeed('rose-feuille',cw.id,Math.round(x*8),Math.round(y*8),Math.round(l*8));
  svRoseLeaf(par,x,y,a,l*(lk||1),Object.assign({n:nl,wl:rosaLife(o,sid),sd:s,side:s%5===0?-.6:.7},lo))});
  /* a leaf drawn after the hanging head of a sheet goes under it (same order of drawing, so the same chance) */
  if(pt&&pt.fn){const f0=pt.fn;pt.fn=par=>{const hg=ROSA_HG;if(hg&&hg.parentNode===par){const t=G(par);par.insertBefore(t,hg);f0(t)}else f0(par)}}return pt}};
/* the bouquet's stem leaf: s0.js draws no R before this hook (svNoR), the old pinnate leaf's chance is consumed here */
function rosaStemLeafHook(sid,lk,lo){if(typeof STEML==='undefined'||!STEML[sid])return;const sl=STEML[sid];sl.svNoR=1;sl.sheetY=.5;sl.sv=(par,x,y,a,l,q)=>{const nl=sl.lf||3;
  rosaOldLeaf(x,y,a,l,sl.col||'#3f6a2c',nl,{side:(q&&q.s||1)*.5,w:sl.w||.5,gloss:sl.gloss,teeth:sl.teeth});const s=svSeed('rose-feuille-tige',Math.round(x*8),Math.round(y*8),Math.round(l*8));
  svRoseLeaf(par,x,y,a,l*(lk||1),Object.assign({n:nl,wl:rosaLife(null,sid),sd:s,side:s%5===0?-.6:.7},lo))};
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
      svRoseLeaf(wr,p[0],p[1],ang,len*(lk||1),Object.assign({n:r()<.3?3:5,wl:rosaLife(null,sid),sd,side:sd%5===0?-.6:.7},lo));if(typeof growUp==='function')growUp(wr,p[0],p[1],Math.max(0,(c.t||0)-300),500);side=-side}}}
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
/* ---------- rose-aspect-jardin: florist's roses with a garden rose's look (SKU 46 to 67), a full round cup ----------
   After the photographs (refcache/rose-aspect-jardin: Yves Piaget 123, 133, Toffee 149, 150, Sahara 78, 79, Pierre de Ronsard 163 to 201,
   Augusta Luise 176 to 180, Garden Caramel Antike 187; measures in REFERENCES.md): a broad round cup, wider than high, of many short round
   petals (45 to 60 here; 60 and more on the garden roses themselves), the outer ones cupped round the ball, only the outermost two or three
   rolling back at their tips; no high cone: the heart stands as a low dome of incurved petals inside the cup, then with age parts into quarters
   round a button eye on some heads (svRose2Quarter, y3-rose2.js). The bud is round, blunt topped, widest at its middle, in long sepals with
   leafy appendages. The stem is thorny (a cut garden-look rose keeps most of its prickles), the leaves matte, their underside pale and dull.
   Its fading after the photographs of the bouquets (Cafe Latte 160, Sahara Sensation 162: the petals crumple and brown at their margins, the cup
   sags open) and the hybrid tea's bent neck (1396, 590). Colours: the catalogue's (CW_RASP, ids and order unchanged) until the finishing
   writes the measured ones into ROSA_ASP_CWX; the structure of the bicolours (an eye, a heart, a green margin) is in ROSA_ASP_ST. */
const ROSA_ASP_SID='rose-aspect-jardin';
const ROSA_ASP_GENES={n:[[46,.25],[52,.45],[58,.3]],
  tep:Object.assign({},ROSA_GENES.tep,{wav:[.03,.08],tip:[1.9,2.6],dL:[.86,1.1],roll:[.7,1.2]}),late:ROSA_GENES.late,
  head:Object.assign({},ROSA_GENES.head,{qn:[3,5,'r'],qk:[.45,1],qr:[0,6.28],eye:[.6,1,.45]})};
/* the measured colours by colourway (fleur-finition fills them, coloris.md): c = body, base = the outer ranks, tip = the heart; an empty entry keeps
   the catalogue's colour */
/* v2 (finishing): the measured colourways (refcache/rose-aspect-jardin/coloris.md): c = the lit body of the petal, base = the outer ranks, tip = the heart.
   Median of the named photographs (light backgrounds first; the black backgrounds of the FSQ sleeves warm the hue), hue within 10 degrees LCh of the
   photographs, lightness free; the doubtful measures were decided by eye on the photographs (46, 50, 52, 56, 58, 59, 62, 64, 65, 67). lvl C = drawn but
   not for the shop (fewer than 3 cultivars or one source). The late:10 ones (magenta, jaune-bord-rouge, then the C ones) are added to CW_RASP. */
const ROSA_ASP_CWX={
  blanc:{c:'#eeeadf',base:'#e6e1d0',tip:'#e9dfc2',c2:null}, /* 46 Blanc nacré lvl C */
  creme:{c:'#ead0a0',base:'#eed8b0',tip:'#e2bd8a',c2:null}, /* 47 Crème lvl C */
  champagne:{c:'#d2a888',base:'#c9a07e',tip:'#b88f68',c2:null}, /* 48 Champagne sable lvl C */
  'rose-pale':{c:'#eabbbb',base:'#eac3bd',tip:'#d9a0a4',c2:null}, /* 49 Rose pâle lvl B */
  rose:{c:'#e583ac',base:'#dd7aa0',tip:'#c46a88',c2:null}, /* 50 Rose moyen lvl C */
  bonbon:{c:'#ef9ba5',base:'#e68592',tip:'#d68a9a',c2:null}, /* 51 Rose bonbon lvl B */
  'rose-vif':{c:'#d84475',base:'#d65a84',tip:'#c0416e',c2:null}, /* 52 Rose vif lvl B */
  peche:{c:'#e8a58a',base:'#e8b09a',tip:'#d68d70',c2:null}, /* 53 Pêche lvl B */
  mandarin:{c:'#f27826',base:'#f26e1c',tip:'#e0661c',c2:null}, /* 54 Orange à cœur vert lvl C */
  abricot:{c:'#f09462',base:'#e88850',tip:'#e48552',c2:null}, /* 55 Abricot lvl B */
  corail:{c:'#ec6a58',base:'#e05a46',tip:'#d9584a',c2:null}, /* 56 Corail lvl B */
  orange:{c:'#ee7a3e',base:'#ed6c30',tip:'#d9622c',c2:null}, /* 57 Orange lvl B */
  sunset:{c:'#ee8058',base:'#f09a74',tip:'#e8873a',c2:null}, /* 58 Orange à cœur jaune lvl B */
  moutarde:{c:'#e8b43c',base:'#e8c46a',tip:'#dca02a',c2:null}, /* 59 Jaune doré lvl C */
  jaune:{c:'#f2d044',base:'#efd777',tip:'#e9bd2c',c2:null}, /* 60 Jaune lvl B */
  cramoisi:{c:'#bd152c',base:'#a40f26',tip:'#a8132c',c2:null}, /* 61 Rouge cramoisi lvl B */
  lavande:{c:'#c496b6',base:'#b886aa',tip:'#a67297',c2:null}, /* 62 Lavande lvl B */
  lilas:{c:'#cab6c2',base:'#b79fb3',tip:'#bca7b9',c2:null}, /* 63 Gris lilas lvl C */
  vert:{c:'#d3dc78',base:'#c6d26a',tip:'#b9c654',c2:null}, /* 64 Vert tendre lvl C */
  terre:{c:'#d19a82',base:'#cf9c86',tip:'#b9805e',c2:null}, /* 65 Caramel café lvl B */
  'free-spirit':{c:'#ee8650',base:'#f09a64',tip:'#c8553a',c2:null}, /* 66 Cuivre multicolore lvl B */
  'rose-vert':{c:'#e8c4c0',base:'#e6dcc0',tip:'#d3949e',c2:null}, /* 67 Rose bordé de vert lvl B */
  magenta:{c:'#d23f84',base:'#c44283',tip:'#b83a70',c2:null}, /* late:10 Magenta intense lvl B */
  'jaune-bord-rouge':{c:'#ebae4e',base:'#e8bf5a',tip:'#dc9a34',c2:null}, /* late:10 Jaune bordé de rouge lvl B */
  'mauve-taupe':{c:'#ccb0a7',base:'#bf9f98',tip:'#a88079',c2:null}, /* late:10 Mauve gris taupe lvl C */
  'blanc-coeur-vert':{c:'#efeee0',base:'#e6e8d4',tip:'#d6dcb8',c2:null}, /* late:10 Blanc à cœur vert lvl C */
  chocolat:{c:'#a34543',base:'#8a3a34',tip:'#722c2a',c2:null}, /* late:10 Brun chocolat lvl C */
  'rose-bord-blanc':{c:'#e0587f',base:'#e87a9a',tip:'#c4406a',c2:null}, /* late:10 Rose à bordure blanche lvl C */
};
/* the structure of the bicolours and shaded ones (not their colours): eye = the button eye's colour mixed into the innermost ranks (green eye),
   heartF = where the heart's colour (c2) starts by rank, band = a margin of another colour on the outer ranks [colour, width, opacity, up to rank] */
const ROSA_ASP_ST={mandarin:{eye:'#a9bd6e'},sunset:{heartF:.3},'free-spirit':{heartF:.2,band:['#c0583a',.22,.55,.5]},'rose-vert':{band:['#c2cf92',.24,.8,.55]},
  vert:{eye:'#b4c482'},'jaune-bord-rouge':{band:['#d8502c',.2,.6,.55]},'blanc-coeur-vert':{eye:'#8fae5a'},'rose-bord-blanc':{band:['#f2bcc8',.3,.85,.7]}};
function rosaAspMat(cw){return rosaStMat(cw,'asp:',ROSA_ASP_CWX,ROSA_ASP_ST)}
/* the faded colours of the garden-look rose, after the bouquets photographed to day 10 (Cafe Latte 160: mauve caramel to mauve brown #9f6662,
   margins #7d4542; Sahara Sensation 162: apricot beige to buff #c2a17d, margins browner; Quicksand 156: beige mauve to grey mauve): the pinks
   and mauves dull toward a dusty mauve then a mauve brown (never the crimson's wine), the pale warm ones (peach, apricot, cream, champagne,
   caramel) toward buff then a light brown; the reds, yellows, greens and whites by the hybrid tea's rule. v2: a grey lilac (chroma .06 to .12: Mammy Blue, Quicksand 156) also goes dusty mauve, not cream */
function rosaAspWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(s>.06&&l>.45&&l<.93&&(h>=290||h<12)){let o=mix(c,'#b8909c',.5*Math.min(1,w/.5));o=mix(o,'#8e646c',.6*svSm((w-.4)/.4));return mix(o,'#5e4044',.3*svSm((w-.75)/.25))}
  if(s>.12&&l>.55&&l<.93&&h>=12&&h<50){let o=mix(c,'#d2b292',.5*Math.min(1,w/.5));o=mix(o,'#a8845e',.55*svSm((w-.4)/.4));return mix(o,'#6e5034',.3*svSm((w-.75)/.25))}
  return rosaWiltCol(c,w)}
const ROSA_ASP_RG={arc:[.06,.15,.12],th:.075,S:8,rho:.3,rq:.29,fl:1.35,lip:.45,dk:.15,soft:[.3,.35,.4],shOp:.3,sh:.028,gap:.008,irr:.7,bend:.22,jit:.13,wav:.02,wn:2,fk:0,lo:.55};
const ROSA_ASP={sid:ROSA_ASP_SID,dK:1.1,cwl:()=>typeof CW_RASP!=='undefined'?CW_RASP:[],genes:s=>svGenes(s,ROSA_ASP_GENES),mat:rosaAspMat,wilt:rosaAspWiltCol,life:()=>rosaLife(null,ROSA_ASP_SID),
  /* short round petals, broad, the heart low inside the cup */
  L:[[0,.94],[.3,.88],[.6,.8],[.85,.68],[1,.58]],W:[[0,1.22],[.3,1.18],[.6,1.04],[.85,.86],[1,.72]],r0:[[0,.2],[.4,.16],[.8,.1],[1,.05]],
  z0:[[0,-.04],[.4,.06],[.8,.2],[1,.28]],tipF:[[0,1.25],[.5,1.4],[1,1.5]],
  /* deep cupped petals; the outermost roll back at their tips only */
  cupo:[[0,.6],[.3,.82],[.6,1],[1,1.15]],rollc:[[0,.4],[.4,.1],[1,0]],rollo:[[0,.65],[.12,.3],[.3,.06],[.5,0],[1,0]],
  /* the bowl seen in profile as a ball (Pierre de Ronsard 165, 171, 190, 195: width over height 1 to 1.2): feet spread out, the guard petals'
     tips barely flared (no flat wings), the inner ones curved in over a dome that reaches the rim */
  a0o:[[0,.8],[.12,.72],[.3,.62],[.5,.52],[.75,.42],[1,.3]],a1o:[[0,.5],[.12,.18],[.3,-.12],[.5,-.3],[.75,-.45],[1,-.5]],
  oLaw:[.3,.4,.5,.55],coneB:null,
  /* the round bud, blunt, widest at its middle */
  budH:[.58,.4],budR:.42,budK:1.15,budE:[.04,.86],budP:.72,
  /* long sepals with leafy appendages */
  sep:Object.assign({},SVROSE_DEF.sep,{L:.95,W:.27,lob:[2,2,1,0,0],lobA:1}),stN:[40,64],
  /* ruffled, crumpling as it fades */
  crk:[.05,.025],wav:[.5,1.6,.5],edgeB:[.3,.4],edgeBW:.6,peelP:.06,peel:[.14,.28],pmax:[12,24],
  /* the faded head stays full longer (Cafe Latte 160, Sahara Sensation 162 at day 10: a crumpled full cup, few petals fallen): fewer petals shed,
     later, the outer ones limp and curled back much less than the hybrid tea's (else they hang past the calyx in two flat lobes); with fifty petals the dry outlines and pleats lighter than the hybrid tea's (else a scribbled ball) */
  shed:[.78,.2],shedF:.2,limp:[.35,.1],rev:[.1,.08],curl:[.05,.06],fanM:Object.assign({},SVROSE_DEF.fanM,{bk:1,bkP:.35,lt:.85,ltP:.35,ea:.3,ew:1,edgeK:.25,dryW:.5,dryB:.015,curl:.12,lclip:1,pleat:Object.assign({},SVROSE_DEF.fanM.pleat,{a:.12,w:.0042,c:null,v0:.86,n:[2,4]})}),
  /* the heart darker toward the axis and the quarters parted by sunk furrows (dark sutures, Toffee 149, Pierre de Ronsard 191, 196) */
  /* v3: the quarters read from the front as the garden rose's (y3-rose3.js): the petals parted round four centres, laid over as margins with
     soft creases (Q.soft: floors in the petal's own body tone), the heart's own ranks beyond fh dropped under them */
  heartSh:.55,qmod:typeof svRose3Under==='function'?svRose3Under(svRose2Quarter({fur:.3,furL:.55,furS:.3,rq:.36,at:[.42,.35],f0:.15,spread:3.4,rr:.4,conK:1.4,irr:.7,bend:.22}),{fh:.4,fk:0}):null,
  heart:typeof svRose3Rings==='function'?svRose3Rings(ROSA_ASP_RG):null};
const ROSA_ASP_BQ=Object.assign({},ROSA_ASP,{noTip:1});
SV_HEAD[ROSA_ASP_SID]=(par,B,O,D,cwId,op,seed,wl)=>rosaSvg(par,B,O,D,cwId,op,seed,wl,ROSA_ASP);
/* matte leaves: little shine on the upper face, a dull grey-green underside */
const ROSA_ASP_LEAF={lean:.45,up:'#34552a',upL:'#55784a',upD:'#1e3418',low:'#86997a',lowL:'#a3b196',vein:'#7f9a6c',veinLow:'#bccab0'};
rosaStemLeafHook(ROSA_ASP_SID,1,ROSA_ASP_LEAF);
/* the stem: thorny on most stems, a little duller than the hybrid tea's */
const ROSA_ASP_SVSC=['#263f1a','#46702e','#7ca356','#cfe0b4'];ROSA_ASP_SVSC.sv={lean:1,swell:.025,gloss:.42,red:'#6e3a28',redF:.8,redA:.24,post:svRoseThorns({p:.78,step:[4,8],lean:1.7})};
ROSA_ASP.svsc=ROSA_ASP_SVSC;ROSA_ASP_BQ.svsc=ROSA_ASP_SVSC;
/* ---------- the garden rose (rose-de-jardin: old roses and their kind, Souvenir de la Malmaison, Mme Hardy, Charles de Mills, Ispahan, Mme Pierre
   Oger, Jacques Cartier, Reine des Violettes, Comte de Chambord, Koenigin von Daenemark) ----------
   A cup that opens into a FLAT rosette: very many short petals packed tight (more than the garden-look rose), the heart filling the cup up to its rim
   and parting into three to five sharp quarters (dark sutures between them), often round a button eye (the innermost petals folded in over the
   centre, green on Mme Hardy); the outer petals stay a cup round them, their margins waving. A round bud under long feathery sepals, a thorny cut
   stem, matte compound leaves. Fading (Mme Pierre Oger 49): the cup sags open, the petals crumple and brown at their margins, then FALL (a few
   petals and the heart remain), the neck bends. Colours: the catalogue's (CW_RJAR, ids and order unchanged) until the finishing writes the measured
   ones into ROSA_JAR_CWX; the structure of the bicolours and shaded ones is in ROSA_JAR_ST. */
const ROSA_JAR_SID='rose-de-jardin';
const ROSA_JAR_RG={arc:[.06,.15,.12],th:.075,S:8,rho:.3,rq:.29,fl:1.35,lip:.45,dk:.15,soft:[.3,.35,.4],shOp:.3,sh:.028,gap:.008,irr:.7,bend:.22,jit:.13,wav:.02,wn:2,fk:0,lo:.55};
const ROSA_JAR_GENES={n:[[68,.3],[76,.45],[84,.25]],
  tep:Object.assign({},ROSA_GENES.tep,{wav:[.04,.1],tip:[2,2.8],dL:[.86,1.12],roll:[.6,1.1]}),late:ROSA_GENES.late,
  head:Object.assign({},ROSA_GENES.head,{qn:[3,5,'r'],qk:[.8,1],qr:[0,6.28],eye:[.6,1,.55]})};
/* the measured colours by colourway (fleur-finition fills them): c = the lit body of the petal, base = the outer ranks, tip = the heart; an empty
   entry keeps the catalogue's colour. Ids and order of CW_RJAR (SKU 68 to 92) */
const ROSA_JAR_CWX={
  /* v2 (finishing): the measured colourways (refcache/rose-de-jardin/coloris.md): c = the lit body of the petal, base = the outer ranks, tip = the heart.
     Hue within 10 degrees LCh of the photographs (light backgrounds first), lightness free; the doubtful measures were decided by eye on the
     photographs (68, 69, 71, 74, 75, 77, 78, 79, 80, 81, 82, 85, 86, 87, 91, 92). lvl C = drawn but not for the shop. 88 and 89 have no proof (lvl D):
     the catalogue's colour stays. The late:10 ones are added to CW_RJAR. */
  'blanc-creme':{c:'#eee6d6',base:'#e0d8c2',tip:'#e6d6ae',c2:null}, /* 68 lvl B */
  ivoire:{c:'#efe6cf',base:'#e4d9bc',tip:'#ecdcb6',c2:null}, /* 69 lvl B (near 68) */
  beurre:{c:'#f0e4a8',base:'#e6d484',tip:'#ecc864',c2:null}, /* 70 lvl C */
  blush:{c:'#f1d8d6',base:'#ecd2cc',tip:'#e0aaac',c2:null}, /* 71 lvl B */
  'rose-pale':{c:'#ebc2d0',base:'#eed0d6',tip:'#dc9aab',c2:null}, /* 72 lvl C */
  dragee:{c:'#f4b4c4',base:'#f4bfcc',tip:'#e8809c',c2:null}, /* 73 lvl C */
  rose:{c:'#e07aa6',base:'#e690ac',tip:'#cf6a92',c2:null}, /* 74 lvl B (Misaki pink; Meivility is the lilac-edged white of 91) */
  'vieux-rose':{c:'#d9a898',base:'#e0b4a4',tip:'#d49478',c2:null}, /* 75 lvl C (Moon Dust: salmon taupe, not rose) */
  magenta:{c:'#cf4a8e',base:'#d65a9c',tip:'#b92a6c',c2:null}, /* 76 lvl B */
  fuchsia:{c:'#d6086a',base:'#dc3a84',tip:'#a8024f',c2:null}, /* 77 lvl B */
  peche:{c:'#eebc9e',base:'#f0c8b0',tip:'#e2a085',c2:null}, /* 78 lvl B */
  abricot:{c:'#eaa95a',base:'#eec088',tip:'#e09a48',c2:null}, /* 79 lvl B */
  corail:{c:'#ec7466',base:'#f08a7c',tip:'#d9503e',c2:null}, /* 80 lvl C (2 cultivars) */
  orange:{c:'#e5663f',base:'#dc5a46',tip:'#f08a44',c2:null}, /* 81 lvl C (Vuvuzela: red orange) */
  citron:{c:'#efe1a0',base:'#e8ecc0',tip:'#d6b050',c2:null}, /* 82 lvl C */
  moutarde:{c:'#e2b030',base:'#e8c050',tip:'#d09418',c2:null}, /* 83 lvl C */
  caramel:{c:'#d6a678',base:'#dcb890',tip:'#bd8458',c2:null}, /* 84 lvl B */
  sable:{c:'#dccfbc',base:'#e4d8ce',tip:'#c8b4a6',c2:null}, /* 85 lvl C (taupe ivory, no green seen) */
  rouge:{c:'#cc1634',base:'#c8203c',tip:'#a00c28',c2:null}, /* 86 lvl C */
  cramoisi:{c:'#a8082a',base:'#b0102e',tip:'#860220',c2:null}, /* 87 lvl C */
  rouille:{}, /* 88 lvl D: no proof, the catalogue's colour */
  lavande:{}, /* 89 lvl D: no proof, the catalogue's colour */
  moka:{c:'#c99a98',base:'#d4acaa',tip:'#b47a72',c2:null}, /* 90 lvl B */
  'creme-rose':{c:'#efdde3',base:'#f3e8e8',tip:'#d98ab0',c2:null}, /* 91 lvl B (Meivility: white, pink heart and fringe) */
  'blanc-vert':{c:'#efeadb',base:'#e8ebd2',tip:'#e0dcc0',c2:null}, /* 92 lvl C */
  'blanc-lisere-rose':{c:'#efe0e6',base:'#f0e6ea',tip:'#d86a9c',c2:null}, /* late:10 lvl C (Meivility again) */
  'brique-nuance':{c:'#bf6a5c',base:'#c98a62',tip:'#a8483f',c2:null}, /* late:10 lvl C (Princess Pinku spray, one photo) */
};
/* the structure (not the colours): eye = the button eye's colour mixed into the innermost ranks, heartF = where the heart's colour (c2) starts by
   rank, band = a margin of another colour on the outer ranks [colour, width, opacity, up to rank], cup = the outer ranks' colour (a green cup) */
const ROSA_JAR_ST={citron:{cup:'#d8e2a8'},sable:{},'creme-rose':{band:['#dc7aa6',.22,.75,.65]},
  'blanc-vert':{band:['#d2dcae',.2,.4,.55]},'vieux-rose':{heartF:.35},caramel:{heartF:.3},'blanc-lisere-rose':{band:['#d8609a',.28,.85,.7]},'brique-nuance':{heartF:.3,band:['#d6a45a',.2,.5,.6]}};
/* a rose card's colours with its structure (the garden-look rose and the garden rose): K the cache key's prefix, X the measured colours, T the structure */
function rosaStMat(cw,K0,X,T){const K=K0+cw.id;if(ROSA_M[K])return ROSA_M[K];const st=T[cw.id]||{},m=rosaMat(Object.assign({},cw,X[cw.id]||{}),K);
  if(st.heartF!=null){const o=m.fr[0][1],i2=m.fr[m.fr.length-1][1],mid=m.fr.find(x=>x[0]>=.5)[1];m.fr=[[0,o],[st.heartF,mid],[Math.min(.95,st.heartF+.35),mix(mid,i2,.7)],[1,i2]];
    m.bk=m.fr.map(([f,x])=>[f,mix(x,'#ffffff',.12)])}
  if(st.eye){const i2=m.fr[m.fr.length-1][1];m.fr=m.fr.filter(x=>x[0]<.8).concat([[.82,i2],[.9,mix(i2,st.eye,.45)],[1,st.eye]]);m.bk=m.fr.map(([f,x])=>[f,mix(x,'#ffffff',.1)])}
  if(st.cup){m.fr=[[0,st.cup],[.18,mix(st.cup,m.fr[1][1],.5)]].concat(m.fr.filter(x=>x[0]>=.3));m.bk=m.fr.map(([f,x])=>[f,mix(x,'#ffffff',.1)])}
  if(st.band)m.band={c:st.band[0],w:st.band[1],op:st.band[2],b:.006,f:st.band[3],hk:0};
  return m}
const rosaJarMat=cw=>rosaStMat(cw,'jar:',ROSA_JAR_CWX,ROSA_JAR_ST);
const ROSA_JAR={sid:ROSA_JAR_SID,dK:1.1,cwl:()=>typeof CW_RJAR!=='undefined'?CW_RJAR:[],genes:s=>svGenes(s,ROSA_JAR_GENES),mat:rosaJarMat,wilt:rosaAspWiltCol,life:()=>rosaLife(null,ROSA_JAR_SID),
  /* short broad petals, the inner ones very short; the heart high, filling the cup to its rim (flat top) */
  L:[[0,.86],[.1,.7],[.25,.52],[.5,.42],[.8,.36],[1,.3]],W:[[0,1.2],[.3,1.12],[.6,.98],[.85,.82],[1,.7]],r0:[[0,.22],[.2,.26],[.45,.22],[.7,.15],[1,.06]],
  z0:[[0,-.04],[.2,.1],[.5,.2],[.8,.26],[1,.3]],tipF:[[0,1.3],[.5,1.5],[1,1.6]],
  cupo:[[0,.55],[.3,.8],[.6,1],[1,1.15]],rollc:[[0,.35],[.4,.08],[1,0]],rollo:[[0,.55],[.12,.25],[.3,.05],[.5,0],[1,0]],
  /* the open head a flat rosette: the outer petals spread wide (a shallow saucer), the inner ones standing up round their quarters' centres */
  a0o:[[0,1.05],[.12,.9],[.3,.72],[.5,.58],[.75,.45],[1,.32]],a1o:[[0,.85],[.12,.5],[.3,.12],[.5,-.12],[.75,-.3],[1,-.4]],
  oLaw:[.28,.36,.5,.5],coneB:null,
  budH:[.56,.38],budR:.44,budK:1.12,budE:[.04,.86],budP:.75,
  sep:Object.assign({},SVROSE_DEF.sep,{L:1,W:.26,lob:[2,2,1,0,0],lobA:1.1}),stN:[40,64],
  edgeB:[.3,.4],edgeBW:.6,peelP:.04,peel:[.14,.28],pmax:[6,24],thin:[.2,2],
  /* the fall (6.3): at .75 half the outer ranks stripped, at .9 a few narrow flat petals hanging apart round a crumpled heart (no bag: shedK .86,
     fanK W .55 and cup .8, limpF 1 keeps the heart ranks up); each faded petal its own brown, kept faint (fanVar .3: no rust plates) */
  shed:[.6,.22],shedF:.5,shedK:.86,fanVar:.3,limp:[.9,.2],limpF:1,rev:[.2,.6],curl:[.1,.45],rollD:[0,.4],wav:[.5,.5,1.2],crk:[.015,.07],fanK:[.1,.55,.8],
  /* the faded lines fine and in the petal's own darkened tint, clipped to the petals (lclip), the creases stopping short of the margin (v0) */
  fanM:Object.assign({},SVROSE_DEF.fanM,{bk:1,bkP:.35,ea:.42,ew:1,edgeK:.18,wb:.5,dryW:.6,dryB:.01,curl:.3,lclip:1,shLo:1,pleat:Object.assign({},SVROSE_DEF.fanM.pleat,{a:.13,w:.0042,c:null,v0:.86,n:[2,5],len:[.22,.5],laLo:0})}),
  /* the quarters: the petals parted (svRose2Quarter), then laid over as margins round four centres with creases in a cross (svRose3Rings,
     svRose3Sutures), the heart's own ranks beyond fh dropped under them (svRose3Under) */
  heartSh:.3,qmod:typeof svRose3Under==='function'?svRose3Under(svRose2Quarter({fur:.3,furL:.55,furS:.3,rq:.36,at:[.42,.35],f0:.15,spread:3.4,rr:.4,conK:1.4,irr:.7,bend:.22}),{fh:.4,fk:0}):null,
  heart:typeof svRose3Rings==='function'?(()=>{const h2=svRose3Rings(ROSA_JAR_RG);return c=>h2(c)})():null};
const ROSA_JAR_BQ=Object.assign({},ROSA_JAR,{noTip:1,okd:'jar'});
SV_HEAD[ROSA_JAR_SID]=(par,B,O,D,cwId,op,seed,wl)=>rosaSvg(par,B,O,D,cwId,op,seed,wl,ROSA_JAR);
/* matte leaves, 5 to 7 leaflets, a dull grey-green underside */
const ROSA_JAR_LEAF={lean:.45,up:'#36552c',upL:'#56764a',upD:'#1f3419',low:'#8a9b7e',lowL:'#a6b39a',vein:'#7f9a6c',veinLow:'#bccab0'};
rosaStemLeafHook(ROSA_JAR_SID,1,ROSA_JAR_LEAF);
/* the stem: thorny (garden roses are cut with their prickles), a little duller than the hybrid tea's */
const ROSA_JAR_SVSC=['#263f1a','#44692c','#789e54','#cbdcb0'];ROSA_JAR_SVSC.sv={lean:1,swell:.03,gloss:.36,red:'#6e3a28',redF:.8,redA:.26,post:svRoseThorns({p:.9,step:[3.5,7],lean:1.7})};
ROSA_JAR.svsc=ROSA_JAR_SVSC;ROSA_JAR_BQ.svsc=ROSA_JAR_SVSC;
/* sheets only, for tuning: ?jarp={"thin":[0.5,2]} patches the garden rose's card (ROSA_JAR, ROSA_JAR_BQ) ; "q":{..} = the quarters' options */
if(typeof location!=='undefined'){const m=/[?&]jarp=([^&]*)/.exec(location.search);if(m)try{const o=JSON.parse(decodeURIComponent(m[1]));if(o.q){o.qmod=svRose2Quarter(o.q);delete o.q}if(o.fh!=null){o.qmod=svRose3Under(o.qmod||ROSA_JAR.qmod,Object.assign({},o.rg||{},{fh:o.fh}));delete o.fh}if(o.su||o.rg){const h1=o.su?svRose3Sutures(o.su):null,h2=o.rg?svRose3Rings(o.rg):null;o.heart=c=>{if(h1)h1(c);if(h2)h2(c)};delete o.su;delete o.rg}if(o.fanMx){o.fanM=Object.assign({},ROSA_JAR.fanM,o.fanMx);delete o.fanMx}Object.assign(ROSA_JAR,o);Object.assign(ROSA_JAR_BQ,o)}catch(e){}}
/* sheets only, for tuning: ?rosap={"limp":[0.5,0.2]} patches the rose card's defaults (SVROSE_DEF) before any head is drawn */
if(typeof location!=='undefined'){const m=/[?&]rosap=([^&]*)/.exec(location.search);if(m)try{Object.assign(SVROSE_DEF,JSON.parse(decodeURIComponent(m[1])))}catch(e){}}
/* sheets only, for tuning: ?aspp={"peelP":0} patches the garden-look rose's card (ROSA_ASP, ROSA_ASP_BQ) ; "q" quarters, "rg" rings heart, "fh" heart under, "fanMx" merged into fanM */
if(typeof location!=='undefined'){const m=/[?&]aspp=([^&]*)/.exec(location.search);if(m)try{const o=JSON.parse(decodeURIComponent(m[1]));if(o.q){o.qmod=svRose2Quarter(o.q);delete o.q}if(o.fh!=null){o.qmod=svRose3Under(o.qmod||ROSA_ASP.qmod,Object.assign({},o.rg||{},{fh:o.fh}));delete o.fh}if(o.rg){o.heart=svRose3Rings(o.rg);delete o.rg}if(o.fanMx){o.fanM=Object.assign({},ROSA_ASP.fanM,o.fanMx);delete o.fanMx}Object.assign(ROSA_ASP,o);Object.assign(ROSA_ASP_BQ,o)}catch(e){}}
