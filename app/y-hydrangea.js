/* ================= y-hydrangea.js : the mophead hydrangea, Hydrangea macrophylla (hortensia-boule), drawn in SVG =================
   A dome of sterile florets (y3-boule.js, sepal mode bouSep): 4 broad rounded sepals (sometimes 3 or 5) round a small fertile eye, the florets
   gathered in lumpy sub-corymbs; the head opens green (a tight dome of valvate beads, refcache photos 97, 99, 100), the florets spread and take
   their colour; it fades in its own hue (35, 81, 85: the florets dull, go papery, brown from the edges, the head sags). Woody cut stem, pale bark,
   leaf scars at the nodes (92, 91); one or two pairs of broad, ovate, serrate, opposite leaves under the head (99, 115, 87).
   Names: hyd* / HYD_* (free in the atelier and every ch copy, 2026-10-17). */
function hydLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'hortensia-boule',rec:{}})):0}
/* ---------- colour: CIE LCh (D65) ---------- */
function hydLchOf(hex){const v=[1,3,5].map(i=>{const c=parseInt(hex.slice(i,i+2),16)/255;return c>.04045?Math.pow((c+.055)/1.055,2.4):c/12.92}),
    X=(.4124*v[0]+.3576*v[1]+.1805*v[2])/.95047,Y=.2126*v[0]+.7152*v[1]+.0722*v[2],Z=(.0193*v[0]+.1192*v[1]+.9505*v[2])/1.08883,F=t=>t>.008856?Math.cbrt(t):7.787*t+16/116,
    a=500*(F(X)-F(Y)),b=200*(F(Y)-F(Z));return[116*F(Y)-16,Math.hypot(a,b),(Math.atan2(b,a)*180/Math.PI+360)%360]}
const hydHex=q=>bouLch(Math.max(0,Math.min(100,q[0])),Math.max(0,q[1]),q[2]);
/* mix two LCh colours in Lab (a neutral never swings its hue) */
function hydMixL(p,q,t){if(t<=0)return p;if(t>=1)return q;const ab=x=>[x[1]*Math.cos(x[2]*Math.PI/180),x[1]*Math.sin(x[2]*Math.PI/180)],A=ab(p),Bq=ab(q),a=A[0]+(Bq[0]-A[0])*t,b=A[1]+(Bq[1]-A[1])*t;
  return[p[0]+(q[0]-p[0])*t,Math.hypot(a,b),(Math.atan2(b,a)*180/Math.PI+360)%360]}
/* ---------- the material of each colourway (ids, order and c of CW_HMOP unchanged; the late:12 ones at the end) ----------
   Measured (refcache/hortensia-boule/coloris.md, catalogue/serre/sources/hortensia-boule.json `mesures`, 2026-10-17): LCh triples. Per id: c the body
   (median of the lit florets), li its light, sh its shade (the photo's shade hue at a mid lightness: the P10 of the photos is the cavities), b the
   sepal's base round the eye, e its edge, eye the fertile bud, jv [dL,dh] the floret-to-floret variation (two jittered variants, sigma of the
   measures x 1.5), c2 + k2 a second body mottled in soft patches (pH, age), bk the underside (optional).
   Motifs: rim {c,w,o} an edge of constant width (w x the floret's radius), grad {c,k,lo} a second tone by zones (lo: by latitude), heart {o,L,W} a
   pale or green centre (opacity, length and width of the streak x the sepal), hO/eO the heart and edge strengths of the plain colourways.
   Special cases: vert (930) level D, no named photo: provisional, from the catalogue's c and photos 100/97 (question); bleu-profond (933) from photos
   70/43 (the measure is a single habit photo); bleu (932) between the measure and photo 44; lavande (934) between the measure and photo 45; the
   antiques are already a late-season stage (their fading starts there): antique-rouge (944) burgundy over green (green heart and patches),
   antique-bleu (943) blue-grey to green (55) */
const HYD_MAT={
  'blanc':{c:[95,2,100],li:[99.5,1,100],sh:[82,10,82],th:[86,28,108],b:[93,9,110],e:[90,6,95],eye:[91,4,95],c2:[93,9,108],k2:.15,jv:[2.5,3],eO:.2,dent:.02,dentN:18},
  'vert':{c:[76,46,118],li:[88,34,112],b:[84,32,114],e:[72,48,121],eye:[70,42,118],c2:[84,38,112],k2:.4,jv:[3,4]},
  'vert-antique':{c:[69,34,104],li:[88,18,95],sh:[52,30,96],b:[76,26,104],e:[58,28,20],eye:[68,24,104],c2:[62,28,14],k2:.3,jv:[4,8],eO:.45},
  'bleu':{c:[63,48,278],li:[78,34,274],sh:[46,50,282],b:[76,26,268],e:[58,42,280],eye:[88,10,95],c2:[70,34,282],k2:.15,jv:[2,-.8]},
  'bleu-profond':{dh:3,c:[52,30,283],li:[80,22,280],sh:[36,32,286],b:[60,30,286],e:[45,38,290],eye:[40,34,290],c2:[46,34,287],k2:.3,jv:[4,-1]},
  'lavande':{c:[64,24,288],li:[80,14,290],sh:[47,24,292],b:[74,16,286],e:[60,26,292],eye:[44,22,290],c2:[70,20,296],k2:.4,jv:[3,4]},
  'lilas':{c:[66,40,330],li:[84,20,326],sh:[48,38,334],b:[76,28,326],e:[60,40,332],eye:[58,34,330],c2:[72,32,320],k2:.4,jv:[3,3]},
  'rose-pale':{hy:{og:.75,xm:.48,vn:.1},sepW:.39,c:[88,12,345],li:[98,4,337],sh:[62,26,357],b:[72,32,345],e:[91,8,342],eye:[76,26,345],c2:[93,10,335],k2:.5,jv:[4,2],heart:{o:.6,L:.48,W:.3},eO:.35},
  'rose':{c:[65,38,345],li:[80,24,343],sh:[47,44,350],b:[74,30,345],e:[60,40,348],eye:[80,16,78],c2:[71,32,350],k2:.4,jv:[2.5,3]},
  'rose-fonce':{c:[63,58,354],li:[78,34,350],sh:[46,56,358],b:[70,44,352],e:[57,56,357],eye:[52,48,352],c2:[66,50,356],k2:.4,jv:[3.5,3]},
  'rouge':{hy:{og:.85,xm:.48,vn:.13,eb:[.55,.25],ebW:.04,wav:.14},c:[48,62,10],li:[60,50,3],sh:[35,52,16],b:[56,50,12],e:[44,56,16],eye:[76,22,20],c2:[54,52,6],k2:.35,jv:[3.5,1.5]},
  'pourpre':{c:[55,38,334],li:[72,28,340],sh:[40,36,336],b:[62,32,332],e:[50,38,336],eye:[50,30,322],c2:[50,40,330],k2:.4,jv:[3,5]},
  'aubergine':{c:[22,32,317],li:[38,24,312],sh:[19,28,320],b:[34,30,316],e:[24,32,320],eye:[40,20,320],c2:[32,34,325],k2:.35,jv:[2.5,8]},
  'coeur-blanc':{hy:{hS:.62},c:[68,56,346],li:[80,32,346],sh:[52,58,350],b:[95,4,350],e:[62,56,350],eye:[66,52,345],heart:{o:.95,L:.84,W:.5},jv:[2.5,2]},
  'antique-bleu':{c:[56,16,234],li:[72,12,226],sh:[41,16,230],b:[66,12,220],e:[54,16,245],eye:[56,14,200],c2:[56,18,150],k2:.38,jv:[3,6]},
  'antique-rouge':{c:[43,38,32],li:[56,26,36],sh:[31,32,30],b:[60,28,110],e:[38,36,28],eye:[55,22,100],heart:{o:.85,L:.55,W:.3},c2:[56,24,105],k2:.4,jv:[3,8]},
  /* late:12 (json `late`, names generic) */
  'lisere-blanc':{c:[60,56,4],li:[76,36,358],sh:[44,54,8],b:[52,55,12],e:[58,56,6],eye:[66,40,355],rim:{c:[93,7,355],w:.09,o:.95},jv:[3,2]},
  'rose-vert-citron':{c:[52,54,8],li:[70,36,5],sh:[38,50,12],b:[62,46,40],e:[50,50,20],eye:[58,30,40],grad:{c:[78,50,114],k:.55},c2:[62,48,55],k2:.3,jv:[3,8]},
  'rouge-brique':{c:[30,42,22],li:[50,40,20],sh:[20,30,24],b:[34,36,22],e:[26,34,22],eye:[42,24,30],jv:[3,3]},
  'creme-bleu-poudre':{c:[88,10,95],li:[95,6,95],sh:[74,14,72],b:[90,9,95],e:[84,10,90],eye:[70,14,280],c2:[76,14,282],k2:.3,jv:[2.5,6],eO:.2,dent:.03,dentN:14,wav:.22},
  'rose-antique':{c:[73,14,28],li:[90,7,60],sh:[56,14,30],b:[66,14,28],e:[70,14,40],eye:[70,14,90],c2:[80,14,98],k2:.42,jv:[4,10]},
  'bordeaux-antique':{c:[33,27,30],li:[54,21,47],sh:[24,22,32],b:[36,24,30],e:[30,26,28],eye:[44,18,80],c2:[40,18,85],k2:.3,jv:[3,6]}};
/* the bud green (97, 99: lime beads, #9ecb20 in the light, #5b980b) and the opening green (100) */
const HYD_BUD=[70,62,118],HYD_OPEN=[84,38,110];
/* one tone set {li,bo,sh,dp} from a body colour: the shade hue-shifted as on the photos (blues toward violet, pinks toward magenta, whites and
   creams warm, never grey: BONNES-PRATIQUES 3.7) */
function hydSet(q,lq,sq,dhO){const h=q[2],C=q[1],w=C<6||(h>=55&&h<=125&&C<16),bl=h>200&&h<300,pk=h>=300||h<40,dh=dhO!=null?dhO:bl?12:pk?(q[0]>78?0:-6):h>=50&&h<100?-10:0;
  /* pale colourways (L > 78): the shaded bottom and flanks of the ball stay the colour, deeper and warmer (white: warm cream to tan; pale pink:
     a fuller rose), never the grey-mauve or khaki of a darkened pastel (chef 2026-10-17, r7c) */
  const pl=!w&&q[0]>78&&C<22;
  let sh=w?[q[0]*.87,Math.max(C,10),84]:pl?[q[0]*.76,Math.max(C*1.6,22),(h+dh+360)%360]:[q[0]*.72,C*1.12,(h+dh+360)%360],
    dp=w?[q[0]*.78,15,76]:pl?[q[0]*.62,Math.max(C*2,30),(h+dh*1.3+360)%360]:[Math.max(q[0]*.55,Math.min(30,q[0]*.8)),C*(q[0]>78?1.6:1.12),(h+dh*1.3+360)%360];let li=[Math.min(99,q[0]+(100-q[0])*.38),C*.86,(h-dh*.4+360)%360];
  if(lq)li=lq;if(sq){sh=sq;if(pl)dp=[sq[0]*.86,Math.max(sq[1]*1.1,30),sq[2]]}
  return{li:hydHex(li),bo:hydHex(q),sh:hydHex(sh),dp:hydHex(dp),_q:q}}
/* the fading of one colour in its own hue (6.4; photos 35, 81, 85, 55): the vivid colour goes first (dec), the head turns to a muted tone
   (fan), then dries to its brown (dry): blues and purples grey-mauve then purple-brown, pinks dusty then rust, reds wine then brown, whites
   ivory then beige, greens olive-beige then tan (no green left in a faded bouquet, the antiques excepted: their parchment) */
function hydFamOf(q){const h=q[2],C=q[1];return C<9?'w':h>=75&&h<180?'g':h>=180&&h<335?(C<14&&h<200?'w':'b'):(h>=335||h<5)?'p':'r'}
function hydFade(q,dec,fan,dry){dry=dry||0;if(dec<=0&&fan<=0)return q;const L=q[0],C=q[1],h=q[2],f=hydFamOf(q);let d1,d2,d3;
  if(f==='w'){d1=[Math.min(L,92),10,88];d2=[85,13,82];d3=[77,16,74]}
  else if(f==='g'){d1=[L*.92,C*.45,92];d2=[L*.86,17,80];d3=[Math.min(L*.76,62),18,66]}
  else if(f==='b'){d1=[L*.97,Math.max(9,C*.3),h<300?310:328];d2=[Math.max(L*.9,50),13,332];d3=[Math.max(L*.62,34),15,350]}
  else if(f==='p'){d1=[Math.min(96,L*1.02),Math.min(24,Math.max(C*.6,9)),358];d2=[Math.min(L*.92,74),Math.min(20,Math.max(C*.5,15)),18];d3=[Math.min(L*.8,56),26,42]}
  else{d1=[L*.82,C*.62,2];d2=[L*.86,Math.min(30,C*.5),10];d3=[Math.min(L*.82,40),25,32]}
  return hydMixL(hydMixL(hydMixL(q,d1,dec),d2,fan),d3,dry)}
/* the ripening of a floret: hue carried round the shorter way, chroma and lightness straight (green to blue through teal, to pink through cream:
   never the grey of a Lab mix, BONNES-PRATIQUES 5.4) */
function hydMixH(p,q,t){if(t<=0)return p;if(t>=1)return q;const bw=Math.sin(Math.PI*t);if(q[1]<12){const m=hydMixL(p,q,t);return[m[0]+6*bw,m[1],m[2]]}let dh=((q[2]-p[2]+540)%360)-180;
  /* pinks and reds: lime, then cream (chroma dropped), then blush and the red (never the salmon-tan of a straight hue path through 60) */
  const wm=q[2]>=320||q[2]<40,th=wm?svSm((t-.25)/.4):t;
  return[p[0]+(q[0]-p[0])*t+12*bw,(p[1]+(q[1]-p[1])*t)*(1-(q[2]>180&&q[2]<300?.75:wm?.8:.45)*bw),(p[2]+dh*th+360)%360]}
/* the material of a colourway, cached by sort and id */
const HYD_MC={};
/* the rendering's calibration against the measures (hmed.py: median of the lit pixels of the open head against the measured body): the facets'
   gradients run from the light to the shade, so the body is set a little deeper and richer, and the light halfway to the measured P97 */
const HYD_CAL={L:0,C:1,li:.85,jvK:1.6};
function hydMat(cwx){const id=cwx.id||'?';if(HYD_MC[id])return HYD_MC[id];const m=HYD_MAT[id]||{},c=m.c||hydLchOf(cwx.c||'#e88aaa');
  return HYD_MC[id]=Object.assign({c,b:m.b||[Math.min(97,c[0]+9),c[1]*.7,c[2]],e:m.e||[c[0]-4,c[1]*1.08,c[2]],eye:m.eye||[c[0]*.85,c[1]*.9,c[2]],
    c2:m.c2||(cwx.c2?hydLchOf(cwx.c2):null),k2:m.k2??cwx.k2??0},m)}
/* the colours of a ball: ripeness (green bud -> colourway), then the fading (dec, fan) */
function hydCol(ph,cwx,l){const m=hydMat(cwx),dec=(l&&l.dec)||0,fan=(l&&l.fan)||0,dry=svSm((((l&&l.wl)||0)-.68)/.22),rc=ph,gr=hydMixL(HYD_BUD,HYD_OPEN,svSm(rc/.22)),
    at=q=>hydFade(hydMixH(gr,q,rc),dec,fan,dry),dz=q=>[q[0]+dl,q[1],(q[2]+dh-(q[2]>200&&q[2]<300?Math.max(-6,Math.min(6,dl*.6)):0)+360)%360],cal=q=>[q[0]+HYD_CAL.L*svSm((q[0]-20)/30),q[1]*HYD_CAL.C,q[2]],ms=(q0,k)=>{const q=cal(q0);return hydSet(at(q),m.li&&at(cal(hydMixL(m.c,m.li,HYD_CAL.li)).map((x,i)=>i?x:x+(q0[0]-m.c[0]))),m.sh&&at(cal([m.sh[0]+(q0[0]-m.c[0]),m.sh[1],(m.sh[2]+(q0[2]-m.c[2])+360)%360])),m.dh)},
    jv=m.jv||[2.5,3];let dl=0,dh=0;const vs=[ms(m.c)],ix={};
  /* the floret-to-floret variation: four variants round the body, jv x HYD_CAL.jvK (70: pale lavender-blue to blue-purple; 84: bright pink to
     deep red), the paler ones a little greyer, the deeper ones richer */
  ix.js=[];for(const[a,b,kc]of[[1,1,.92],[-1,-1,1.08],[1.8,-1.2,.82],[-1.7,1.5,1.12]]){dl=jv[0]*a*HYD_CAL.jvK;dh=jv[1]*b*HYD_CAL.jvK;ix.js.push(vs.length);const q=dz(m.c);vs.push(ms([q[0],q[1]*kc,q[2]]))}
  if(m.c2&&m.k2>0){ix.c2=vs.length;vs.push(hydSet(at(cal(m.c2))))}
  if(m.grad){ix.gr=vs.length;vs.push(hydSet(at(cal(m.grad.c))))}
  if(rc>.02&&rc<.97){ix.green=vs.length;vs.push(hydSet(hydFade(hydMixH(gr,m.c,rc*.3),dec,fan,dry)))}
  if(fan>.05){const fm=hydFamOf(m.c);ix.brown=vs.length;vs.push(hydSet(hydMixL(at(m.c),{w:[60,19,64],g:[52,20,60],b:[40,17,346],p:[44,26,38],r:[34,22,30]}[fm],.55)));
    /* parchment: the dried florets gone pale and papery, in the colourway's own tint (the antiques: green-beige, 85) */
    ix.parch=vs.length;const pq=hydMixL([82-7*dry,13,74-6*dry],at(m.c),fm==='w'?.4:.25);vs.push(/antique/.test(cwx.id||'')?hydSet(hydMixL([74,22,100],at(m.c),.2)):hydSet(pq,null,[pq[0]*.84,16,64]))}
  /* the sepals' underside: paler, a little greener (green bud: the same) */
  const bh=m.c[2],bB=bh>200&&bh<300,bq=m.bk||[Math.min(97,m.c[0]+5),m.c[1]<9?m.c[1]*.72:Math.max(9.5,m.c[1]*.72),m.c[1]<9?100:(bh+(bB?6:0))%360];ix.bk=vs.length;
  /* (the underside of a blue is not greened: a green mix turns it cyan; a pale pink keeps C >= 9.5, below that hydSet reads it as a white) */
  vs.push(hydSet(bB?at(bq):hydMixL(at(bq),[80,26,112],.04*(1-fan))));
  const v0=vs[0],hr=m.heart||{},heart=at(m.b),edge=m.rim?at(m.rim.c):at(m.e),brownE=[42,26,48],ed=Math.max(dec*.8,fan);
  return{vs,ix,dry,bkI:ix.bk,light:mix(v0.li,'#ffffff',.25),body:v0.bo,shade:v0.sh,deep:v0.dp,vein:v0.sh,core:mix(mix(mix(v0.dp,v0.sh,.3*(1-fan)),m.c[0]>78?'#33441c':'#1c2216',.55*(1-Math.max(fan,dec*.5))),'#5a4030',Math.min(.62,Math.max(fan*2.2,dec*.45))),rimBand:!!m.rim||ed>.05,
    heart:hydHex(heart),throat:m.th?hydHex(at(cal(m.th))):m.heart?hydHex(heart):null,thr:m.thr,heartO:(hr.o??m.hO??.3)*(1-.6*fan)*svSm((rc-.3)/.5),heartL:hr.L||.4,heartW:hr.W||.22,
    rim:hydHex(ed>.02?hydMixL(edge,brownE,Math.min(.8,ed*.9)):edge),rimO:Math.max(m.rim?m.rim.o:(m.eO??.28),ed*.3)*svSm((rc-.2)/.5),rimW:m.rim?m.rim.w:(.075+.12*ed),fleck:hydHex(m.c[1]<16||(m.c[2]>=60&&m.c[2]<200)?[40,26,40]:[36,44,m.c[2]>=200&&m.c[2]<300?330:8]),
    eye:hydHex(hydFade(hydMixH(gr,m.eye,rc),dec,fan,dry)),eyeL:mix(hydHex(hydFade(m.eye,dec,fan,dry)),'#ffffff',.6),
    stalk:hydHex(hydMixL(hydFade([52,30,118],dec,fan,dry),[34,16,38],fan)),brown:hydHex([44,24,52]),paper:hydHex([80,12,84]),m}}
/* a floret's colour variant: the soft patches of c2 (a smooth noise of the direction), the gradation, the late-ripening greener florets, the
   most dried ones browned first */
function hydPick(q,X){const C=X.C,ix=C.ix,m=C.m,n=V3.nz(q.c),sd=(X.seed%97)*.13;
  /* fading: a third of the florets parchment (fan), then the oldest browned (dry): never one isolated brown floret early (6.6) */
  const dy=C.dry||0;if(ix.brown!=null&&q.cl<dy*.3)return ix.brown;
  if(ix.parch!=null&&q.cl<dy*.38+X.fan*.3)return ix.parch;
  if(ix.green!=null&&q.cl>.2+.8*svSm((X.op-.3)/.5))return ix.green;
  if(ix.gr!=null){const t=m.grad.lo?svSm((.35-n[2])/1.1):.5+.5*Math.sin(n[0]*2.3+sd)*Math.cos(n[1]*2.1+sd*1.7);if(t*(m.grad.k??1)>(q.lj[3]*.5+.25))return ix.gr}
  /* the second body: florets scattered one by one, a little denser in loose zones (photos 61, 70, 84: no blotches) */
  if(ix.c2!=null){const p=.5+.5*Math.sin(n[0]*5.3+sd)*Math.cos(n[1]*4.7+sd*1.3)*Math.sin(n[2]*4.1+sd*.7);if(q.lj[2]*.8+p*.2<m.k2*.8)return ix.c2}
  /* the floret-to-floret variation (jv): a third of the florets a little lighter, a third darker */
  const u=q.lj[1];return u<.24?0:ix.js[Math.min(ix.js.length-1,Math.floor((u-.24)/.76*ix.js.length))]}
/* ---------- the head ----------
   Measures (kept photos, at the eye ±25 %): 6 to 7 florets across the head (45, 44, 33); a floret 4 sepals (3 or 5 now and then), broad obovate,
   widest beyond the middle, rounded tips, overlapping a quarter of their width as a pinwheel, the notches between them at about .55 of the radius;
   the eye about .08 of the floret's width; the head a dome a little flatter than a ball (H/W .85-.9), lumpy with its sub-corymbs (about 20) */
const HYD_SPEC={sep:1,n:[76,80],nD:7,s:[.335,.33],r1:.8,flat:.88,cap:-.72,jit:[.15,.32],lump:[.04,.09],clus:.11,clusN:20,clusT:.2,
  lobes:[[4,.84],[5,.09],[3,.07]],notch:.55,lobeJ:.13,relK:.85,volK:.7,liW:.25,sepA:[1.2,.2],sepW:.5,sepC:.25,sepTip:.3,sepTipY:.9,shSep:[1,.22],edgeL:[.07,.5],floG:[.4,.4],beadR:.95,beadRound:.3,cullV:-.25,faceV:.12,eye:.125,
  grow:[[0,.36],[.2,.44],[.45,.7],[.75,.95],[1,1]],sz:[[0,.4],[.2,.52],[.45,.9],[.75,.98],[1,1]],fo:[.2,.42],
  /* shriv < 0: the dried florets keep the ball full while their sepals roll in (81) */
  dec:[.1,.42],fan:[.52,.3],shed:[3,.1],shedF:0,droop:.4,droopF:.14,decR:0,shriv:-.3,foF:.08,sepF:.35,crum:[.22,.6,1.6],coreG:.45,tip:[.3,.55,.3],core:1,sh:[.32,.16],shR:.62,gr:1.05,cls:[-.24,-.06,.1],rimLine:[.022,.012,.4,.28],heartSh:[.55,.3],snO:.3,vnO:.26,stalkW:.06,
  sepDraw:(k,X)=>svHySep(k,X),hy:{w0:.32,upY:.7,pY:.2,ig:1.6,kB:.9,ao:.45,vn:.06,vN:4,ebW:.028,eb:[.28,0],hs:.12,xm:.58,wK:.6,tipP:1.9,claw:.1,curl:.38,wav:.08},phase:(cwx,op)=>svSm((op-.3)/.5),col:hydCol,ripe:()=>1,vpick:(q,X)=>hydPick(q,X)};
function hydSvg(par,B,O,D,cwId,op,seed,wl,S,o){const cwx=(typeof CW_HMOP!=='undefined'&&CW_HMOP.find(x=>x.id===cwId))||{id:cwId,c:'#e88aaa'},Sp=S||HYD_SPEC;
  return svBoule(par,B,O,D,Sp,cwx,op,seed,wl==null?hydLife():wl,o||{})}
if(typeof SV_HEAD!=='undefined')SV_HEAD['hortensia-boule']=hydSvg;
/* the head in the bouquet and on the plant (hydraHead, s4a.js): the old drawing's share of the chance is consumed there (1 + 3 x its florets);
   sd, its first draw, names the individual. HYD_K: the ball is drawn at HYD_K x the old D (the old dome, florets included, spread about 1.25 D);
   the ball's centre sits over the neck's top so the woody peduncle enters the dome from below (the old dome's centre was .15 Rd low, its foot
   -.4 Rd) */
const HYD_K=1.18;
function hydSvgPut(par,B,D,cw,op,sd,g0){const Dk=D*HYD_K,R1=Dk/2*HYD_SPEC.r1*bouIp(HYD_SPEC.grow,op),Rd=D/2,zn=-Rd*.32*g0,zc=zn+R1*HYD_SPEC.flat*.62,O=toV(B,[0,0,zc]),att=toV(B,[0,0,zn-zc]);
  return hydSvg(par,B,O,Dk,cw.id,op,svSeed('hydrangea',cw.id,Math.round(sd*1e4)),null,null,{att})}
/* ---------- the stem: woody, pale olive-tan bark (92: #9a8a70 in the light), greener toward the head (the current year's wood), fine pale
   lenticels, leaf scars at the nodes below the leaves (91, 92: a pale shield across the stem, the node a little swollen) ---------- */
function hydStemPost(g,cg,C,Wd,N,T,W0){if(DET<1||LOD)return;const n=C.length;let acc=0;const len=[0];for(let i=1;i<n;i++){acc+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);len.push(acc)}
  const tot=acc,u=typeof UPC!=='undefined'?UPC:6.5,ph=(C[0][0]*.37+C[0][1]*.11);let dl='',ds='',dn='';
  /* lenticels: short pale dashes along the bark, from a hash */
  const step=W0*(DET>=1.5?.9:1.6);for(let k=0;k*step<tot;k++){const s=k*step+pxHashS(k,1,ph|0)*step,i=len.findIndex(x=>x>=s);if(i<1)continue;
    const w=Wd[i]/2,o=(pxHashS(k,2,ph|0)*2-1)*.72*w,q=[C[i][0]+N[i][0]*o,C[i][1]+N[i][1]*o],h=w*(.14+.12*pxHashS(k,3,ph|0));dl+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(T[i][0]*h),svR(T[i][1]*h)])}
  /* nodes: every 9 cm from 16 cm below the head end, a scar and a slight ring */
  for(let d=16*u;d<tot-4*u;d+=9*u){const s=tot-d,i=len.findIndex(x=>x>=s);if(i<1)continue;const w=Wd[i]/2,c=C[i],t=T[i],nn=N[i],sg=((d/(9*u))|0)%2?1:-1;
    dn+='M'+svJ([svR(c[0]+nn[0]*w),svR(c[1]+nn[1]*w)])+'Q'+svJ([svR(c[0]+t[0]*w*.25),svR(c[1]+t[1]*w*.25),svR(c[0]-nn[0]*w),svR(c[1]-nn[1]*w)]);
    const sc=[c[0]+nn[0]*w*.25*sg+t[0]*w*.15,c[1]+nn[1]*w*.25*sg+t[1]*w*.15],a=w*.48,b=w*.2;
    ds+='M'+svJ([svR(sc[0]-nn[0]*a),svR(sc[1]-nn[1]*a)])+'Q'+svJ([svR(sc[0]-t[0]*b*2.2),svR(sc[1]-t[1]*b*2.2),svR(sc[0]+nn[0]*a),svR(sc[1]+nn[1]*a)])+'Q'+svJ([svR(sc[0]-t[0]*b*.6),svR(sc[1]-t[1]*b*.6),svR(sc[0]-nn[0]*a),svR(sc[1]-nn[1]*a)])+'z'}
  if(dl)E('path',{d:dl,fill:'none',stroke:'#d8cfa6','stroke-width':svF(Math.max(.1,W0*.07)),'stroke-linecap':'round','stroke-opacity':.55},cg);
  if(dn)E('path',{d:dn,fill:'none',stroke:'#4a4128','stroke-width':svF(Math.max(.12,W0*.05)),'stroke-opacity':.35},cg);
  if(ds)E('path',{d:ds,fill:'#d9cfac',stroke:'#6a5c3a','stroke-width':svF(Math.max(.08,W0*.03)),'stroke-opacity':.5},cg)}
/* bark measured on 92 and 91 (lit half: L 58-66, C 16-20, h 65): a pale grey-tan, a little greener toward the head (the current year's wood) */
/* nc: no cut (the neck and the plant's head stem, whose first point is a junction, not the cut end) */
function hydStemCols(nc){const c=['#5d5442','#8a7f68','#ada28a','#d8d0bc'];c.sv={swell:.03,gloss:.2,ribs:[-.35,.3],post:hydStemPost};if(!nc){c.sv.cut=.3;c.sv.cutC='#e8e2cc'}return c}
/* ---------- the leaves: opposite, broad ovate (L/W 1.5 on 99 and 115), a short drawn-out tip, a regular serrate margin of forward teeth (about
   20 a side), pinnate veins impressed above (7 to 9 pairs), upper face mid green and a little glossy, the underside paler; a petiole 1/6 of the
   blade. Through svbLeaf (y3-branche.js), lit half by half */
/* leaf green measured on 99, 115, 87, 123 (median L 48, C 50, h 122; the shade side of 131 L 19): a fresh, rather yellow green, glossy */
const HYD_LFS={fD:40,leaf:{L:[1,1],W:.7,ovB:.75,vMid:.05,vEnd:.22,pet:.17,fold:.22,curl:.12,tw:.25,droop:.32,acu:.3,serr:18,tooth:.11,face:.6,dbl:0,aris:0,glands:0,gloss:.6,sheen:.25,quilt:1,warp:.07,petW:.03,wk:.45,green:.5,vd:.6,vO:1,und:'#b8c890',undK:.38,petC:'#6e8a3a'},
  cols:()=>({lf:'#6a9a32',lf2:'#3c6a1e'})};
/* the plant sheet (hydraPlant, r1a.js): the stem's width x D (a cut stem about 1 cm under an 18 cm head); a petiole leaves the stem at its side:
   pinH x the stem's half width out of the axis (rw, set by hydraPlant for the stem drawn next), pin x the leaf's length without it */
const HYD_PLANT={w:.055,pin:.026,pinH:.92};
function hydWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.1)return mix(c,mix('#9a8a4c','#6e5434',svSm((w-.4)/.5)),Math.min(1,w*1.15));return mix(c,'#6a5e4c',.25*w)}
function hydLeafSv(par,x,y,ang,len,o){const wl=hydLife(),W0=WILT;if(wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(wl,hydWiltCol,'hortensia-boule');
  try{HYD_LFS._wl=wl;HYD_LFS.fD=len*.6;const s=(o&&o.s)||1,H0=V3.nz([Math.cos(ang),-Math.sin(ang),.32*s]),ta=o&&o.ta!=null?o.ta:ang,sd=Math.sign(Math.sin(ang-ta))||s,rw=HYD_PLANT.rw?Math.min(HYD_PLANT.rw*HYD_PLANT.pinH,len*.06):len*HYD_PLANT.pin;
    x+=-Math.sin(ta)*sd*rw;y+=Math.cos(ta)*sd*rw;
    return svbLeaf(par,[x,-y,0],H0,len*1.05,HYD_LFS,null,{age:3,seed:svSeed('hyd-feuille',Math.round(x*8),Math.round(y*8))})}finally{WILT=W0}}
if(typeof STEML!=='undefined'&&STEML['hortensia-boule'])STEML['hortensia-boule'].sv=hydLeafSv;
/* a leaf of the plant sheet's head pair (lsHeadS organ og: pos, H heading), the same leaf as the stem's, its petiole out of the stem's side.
   The pair is set from the upright stem, not from the turtle's frame (at .9 the nodding head's frame turned both leaves to one side, one
   of them end on, a folded shard behind the stem): the two calls of a node are kept (HYD_PLANT._pr) and, when the parts are sorted and
   drawn, the pair's line (H1 - H2) laid level, 16° above the horizontal, at least 45° off the line of sight; alone, the heading only
   kept within 17° of the horizontal */
function hydPairH(og,pos0){const pr=HYD_PLANT._pr,clamp=H=>V3.nz([H[0],Math.max(-.3,Math.min(.3,H[1])),H[2]||0]);
  if(!pr||pr.k!==pos0.map(v=>Math.round(v*10)).join()||pr.H.length!==2||pr.H.indexOf(og.H)<0)return clamp(og.H);
  const o=pr.H[1-pr.H.indexOf(og.H)];let dx=og.H[0]-o[0],dz=(og.H[2]||0)-(o[2]||0),dh=Math.hypot(dx,dz);if(dh<1e-6){dx=pr.H.indexOf(og.H)?-1:1;dz=0;dh=1}dx/=dh;dz/=dh;
  if(Math.abs(dx)<.71){const sx=Math.sign(dx)||1;dx=sx*.71;dz=(Math.sign(dz)||-sx)*.704}return V3.nz([dx*.96,.28,dz*.96])}
function hydLeafPart(og,pos0,len,D){const k=pos0.map(v=>Math.round(v*10)).join();if(!HYD_PLANT._pr||HYD_PLANT._pr.k!==k)HYD_PLANT._pr={k,H:[]};HYD_PLANT._pr.H.push(og.H);
  const rw=D*HYD_PLANT.w*.5*HYD_PLANT.pinH,at=()=>{const H=hydPairH(og,pos0),h=Math.hypot(H[0],H[2]||0)||1;return[H,[pos0[0]+H[0]/h*rw,pos0[1],pos0[2]+(H[2]||0)/h*rw]]};
  return[{get z(){return at()[1][2]},fn:par=>{const[H,pos]=at(),wl=hydLife(),W0=WILT;if(wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(wl,hydWiltCol,'hortensia-boule');
  try{HYD_LFS._wl=wl;HYD_LFS.fD=D*.6;return svbLeaf(par,pos,H,len,HYD_LFS,null,{age:3,seed:svSeed('hyd-feuille',Math.round(pos[0]*8),Math.round(pos[1]*8))})}finally{WILT=W0}}}]}
