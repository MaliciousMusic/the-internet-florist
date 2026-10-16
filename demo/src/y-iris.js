/* ================= Pilote : le genre Iris en SVG natif (y-iris.js) =================
   One module per genus, one sheet (fiche) per kind. Kinds: SVI_HOLL, the Dutch iris (Iris x hollandica, Xiphium group), the cut flower of the catalogue.
   Measured on photographs (refcache/iris-hollandais, brief.md, coloris.md): three falls (the outer tepals) rising on a narrow haft then hanging their
   broad rounded blade, a yellow signal in a pale halo on it, fine dark veins fanning from it; three standards (the inner tepals) upright, narrow,
   oblanceolate, spreading a little; three petaloid style arms over the hafts, keeled, ending in a two-lobed crest; a spathe of two green bracts under
   the flower, papery and rosy at their tips. The bud a slim pointed spindle in the spathe, its colour showing at the tip; half open, the falls part
   while the standards stay furled round the style arms. Fading: the tepals roll into twisted tubes, translucent, stuck together like wet paper, the
   blue turning grey-lilac then rosy parchment, the signal orange then brown; the head nods. The plant: a round, smooth, glaucous stem; narrow channelled
   glaucous leaves sheathing it. The pieces the engine lacks (second whorl colour, furl, style arms, spathe, tube) are in y3-iris.js. */
/* ---------- the colourways: one field per zone (standards, falls, signal, style arms, veins, liseré, margin) ----------
   std/fal: b claw (haft h for the falls), c body, t tip, sh shade, li light, bk back; sig: c signal, e halo round it, v its length (part of the fall),
   w its half width; sty: c arm, cr crest; vein: s standards, f falls; lis: a band of another colour along the falls' margin {c,w,v0,op}; marg: rim.
   Measured: 0 and 2 complete (coloris-lot1.json, photos 3, 13, 37, 58, 129); the others carry the median of each measured zone (coloris-lch.md, 2026-10-09 finishing pass), the zones not measured being derived by irisZone. */
const IRIS_CW={
  bleu:{cv:'Blue Magic',lv:'A corps, C signal (coloris-lch)',std:{b:'#6b4cc1',c:'#6c43c0',t:'#7c57cc',sh:'#28176a',li:'#a690e6',bk:'#7058b4'},
    fal:{h:'#d6cfe8',c:'#402a9b',t:'#271b5b',sh:'#120944',li:'#7461d0',bk:'#4e3e96'},sig:{c:'#f6dd24',e:'#d6d2f0'},
    sty:{c:'#8a74d0',cr:'#7c57cc'},vein:{s:'#48299a',f:'#1c0f56'},lis:null,marg:null},
  'bleu-nuit':{cv:'Professor Blaauw',lv:'C (coloris-lch: teintes a 9,5 et 10,5 deg; base et pointe: une photo)',std:{c:'#5c53b2',t:'#6254d9'},fal:{b:'#4946a0',c:'#544bb7'},sig:{c:'#f2bf0d'}},
  violet:{cv:'Purple Sensation',lv:'C (coloris-lch, signal A)',std:{b:'#672473',c:'#772a76',t:'#812e7a',sh:'#2c0a36',li:'#b474bc',bk:'#7a4288'},
    fal:{h:'#d8c8e2',b:'#5d1e96',c:'#631a81',t:'#591c6d',sh:'#280746',li:'#aa6ad4',bk:'#6e3e96'},sig:{c:'#f6db0d',e:'#cdb6e4'},
    sty:{c:'#a070b4',cr:'#812e7a'},vein:{s:'#561866',f:'#3a0c62'},lis:{c:'#9a62c8',w:.014,v0:.5,op:.75},marg:'#a678d0'},
  'bleu-ciel':{cv:'Wedgwood',lv:'C (une photo de champ)',std:{c:'#b3b6ed'},fal:{c:'#b6b3e8'},sig:{c:'#f2c830'}},
  silvery:{cv:'Silvery Beauty',lv:'C (coloris-lch: teintes a 4,6 et 11,2 deg, chroma dispersee)',std:{c:'#b1aeee'},fal:{c:'#e7e6cd'},sig:{c:'#f1c709'}},
  blanc:{cv:'White Excelsior',lv:'C (coloris-lch: deux photos, blancs peu fiables en teinte)',std:{c:'#e5e3d4'},fal:{c:'#e4e0b8'},sig:{c:'#f1c91a'}},
  jaune:{cv:'Golden Harvest',lv:'B corps des standards, C le reste (coloris-lch)',std:{c:'#f5ed2f',t:'#f6f541'},fal:{c:'#fdb900',t:'#e8a600'},sig:{c:'#f5cf18'}},
  apollo:{cv:'Apollo',lv:'A corps des sepales, C le reste (pointe des standards: teinte discordante a 169 deg, valeur neutre gardee)',std:{c:'#e5e3cb',t:'#c1c4c1'},fal:{c:'#ebc708',t:'#e2cc40'},sig:{c:'#f6b621'}},
  bronze:{cv:'Red Ember',lv:'C (coloris-lch: chroma dispersee, sepales hors sRGB ecretes)',std:{c:'#8f2467',t:'#963b6f'},fal:{c:'#4b1000',t:'#480e00'},sig:{c:'#fce105'}},
  noir:{cv:'(sans représentant prouvé)',lv:'-',std:{c:'#3a1a50'},fal:{c:'#3a1a50'},sig:{c:'#f2c21c'}},
  /* the late colourways (CW_IRIS, after rank 9): measured medians of coloris-lch.md; a zone not measured is derived (irisZone) or, where noted, set from the AIS/KAVB/seller text */
  'bleu-fonce-clair':{cv:'Sapphire Beauty',lv:'A corps (coloris-lch), signal C',std:{c:'#4936a5'},fal:{c:'#6572d5'},sig:{c:'#f5d41a'}},
  'violet-blanc':{cv:'Carmen',lv:'C (coloris-lch: standards 14,7 deg; sepales: blanc translucide, teinte non fiable, valeur neutre a L mesuree); signal A',std:{c:'#ccc7da'},fal:{c:'#c8c9ce'},sig:{c:'#e5cf41'},
    vein:{s:'#8e72b8',f:'#a58fc0'}},
  'bronze-cuivre':{cv:'Autumn Princess',lv:'C (coloris-lch: deux photos, standards a 29-39 deg)',std:{c:'#9d693c',t:'#b38953'},fal:{c:'#9c7c13',t:'#b28f0e'},sig:{c:'#c39951'}},
  'bleu-bronze':{cv:'Tigereye',lv:'A standards et signal, C sepales (coloris-lch)',std:{c:'#55337b'},fal:{c:'#5e313a',t:'#5f3146'},sig:{c:'#e8bf17'}},
  'pourpre-brun-or':{cv:'Lion King',lv:'C (une photo); signal et stries derives du texte JS (or strie de brun)',std:{c:'#5f3c29'},fal:{c:'#6d550c',t:'#4b4c0d'},sig:{c:'#c3a023'},vein:{s:'#3c2314',f:'#3f2a0a'}},
  'mauve-bronze-jaune':{cv:'Romano',lv:'B standards et signal (coloris-lch); sepales non mesures: bronze-jaune du texte AIS, derive du signal',std:{c:'#66527e'},fal:{c:'#aa8a33'},sig:{c:'#debe3b'}},
  lilas:{cv:'Panther',lv:'C (une photo)',std:{c:'#b691e9'},fal:{c:'#9784cd'},sig:{c:'#fbcd19'}},
  'violet-gris-bleu':{cv:'H.C. van Vliet',lv:'C (coloris-lch: standards 14,5 deg; sepales gris-bleu du texte, teinte mesuree discordante a 104 deg, clarte mesuree); signal C',std:{c:'#8158af'},fal:{c:'#9c9fb5'},sig:{c:'#deb73d'}}};
/* a zone completed from its body where it is not measured yet (the finishing pass replaces these with photo values) */
function irisZone(z,body,fb){const c=z.c||body,[h,s,l]=h2l(c);return{b:z.b||(fb?c:mix(c,'#ffffff',.3)),h:z.h||mix(c,'#f2eef4',.72),c,t:z.t||c,sh:z.sh||l2h(h,Math.min(1,s*1.05),l*.34),
  li:z.li||mix(c,'#ffffff',.36),bk:z.bk||mix(c,'#c8c8d0',.18)}}
const IRIS_M={};
function irisMat(cwx){if(IRIS_M[cwx.id])return IRIS_M[cwx.id];const C=IRIS_CW[cwx.id]||{std:{c:cwx.c},fal:{c:cwx.fc||cwx.c},sig:{c:cwx.sig||'#f2c830'}},
    Sd=irisZone(C.std,cwx.c),F=irisZone(C.fal,cwx.fc||cwx.c,1),sg=Object.assign({e:mix(F.c,'#ffffff',.6),v:.7,w:.36},C.sig),
    vein=C.vein||{s:l2h(...h2l(Sd.c).slice(0,2),h2l(Sd.c)[2]*.62),f:l2h(...h2l(F.c).slice(0,2),h2l(F.c)[2]*.55)},sty=C.sty||{c:mix(Sd.c,'#ffffff',.2),cr:Sd.c};
  const fall={st:[[0,F.h],[.24,F.h],[.44,mix(F.h,F.b,.5)],[.62,F.b],[.8,F.c],[1,F.t]],bst:[[0,'#a9b48c'],[.3,mix(F.bk,'#c4c6c0',.3)],[.7,F.bk],[1,mix(F.bk,F.t,.3)]],
    shade:F.sh,lite:F.li,bshade:mix(F.sh,'#4a4a58',.25),blite:mix(F.bk,'#ffffff',.4),vein:vein.f,bvein:mix(F.bk,F.sh,.35),rim:C.marg||mix(F.t,'#ffffff',.25),cast:mix(F.sh,'#000000',.5),
    blot:{c:sg.c,e:sg.e,v:sg.v,w:sg.w,op:1,k:4,cv:.74},band:C.lis?{c:C.lis.c,w:C.lis.w,v0:C.lis.v0,op:C.lis.op,bk:.5}:null,flames:null};
  const std={st:[[0,Sd.b],[.14,Sd.b],[.36,mix(Sd.b,Sd.c,.6)],[.62,Sd.c],[1,Sd.t]],bst:[[0,'#b0b890'],[.25,mix(Sd.bk,'#d0d0d4',.3)],[1,Sd.bk]],shade:Sd.sh,lite:Sd.li,
    bshade:mix(Sd.sh,'#4a4a58',.2),blite:mix(Sd.bk,'#ffffff',.42),vein:vein.s,bvein:mix(Sd.bk,Sd.sh,.3),rim:mix(Sd.t,'#ffffff',.25),cast:mix(Sd.sh,'#000000',.5)};
  return IRIS_M[cwx.id]=Object.assign(fall,{inner:std,sty,sig:sg})}
/* the colour of a fading iris (photographs 138, 338, 339, 472): blues and violets go translucent and darker, violet then brown-violet (not a pale
   skeleton); the signal and the yellows orange, then ochre-brown; whites ivory, then cream-brown; the greens (spathe, tube) by the common rule */
function irisWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.1)return c;
  /* (a bouquet drawn all faded, LIFE_ALL 'fane': the spathe and the tube wilt like the stem, and the blues and violets go on to a dull brown-mauve,
     papery: nothing stays blue) */
  const fa=irisAllFane();
  if(h>=65&&h<175&&s>.1)return typeof lifeCol==='function'?lifeCol(c,(fa?.85:.3)*w):c;
  if(s<.14||l>.88){let o=mix(c,'#e6dcc2',.65*w);if(w>.45)o=mix(o,'#9c8460',(w-.45)*1.1);return o}
  if(h<65){let o=l2h(h-(h-26)*.5*w,s*(1-.3*w),l*(1-.25*w));if(w>.55)o=mix(o,'#8a5a2a',(w-.55)*.9);return o}
  /* blues and violets darken as they go limp and translucent (138 pale lilac-grey at first; 472 night violet, matted): violet, then brown-violet */
  if(h<335){let o=l2h(h+(288-h)*.55*w,s*(1-.35*w),l*(1-.42*w));if(w>.5)o=mix(o,'#4b3352',Math.min(.6,(w-.5)*1.2));if(fa)o=mix(o,'#5a443c',.6*svSm(w/.8));return o}
  let o=mix(c,'#9a6a6a',.5*w);if(w>.5)o=mix(o,'#8a6a50',(w-.5)*.8);return o}
const irisAllFane=()=>typeof LIFE_ALL!=='undefined'&&LIFE_ALL==='fane';
if(typeof GHI!=='undefined'&&GHI['iris-hollandais'])GHI['iris-hollandais'].wilt=irisWiltCol;
function irisLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'iris-hollandais',rec:{}})):0}
/* the length of the tube under the flower (x R0): the bud sits low in its spathe, the open flower stands above it */
const irisTube=op=>.55+.6*svSm((op-.2)/.45);
/* ---------- the genes: six tepals, the falls broad and rounded, the standards narrower, a little notched; standards fold inward as they fade ---------- */
const IRIS_GENES={n:[[6,1]],tep:{dL:[.95,1.05],dW:[.92,1.08],dph:[-.06,.06],da0:[-.06,.06],da1:[-.12,.12],tw:[-.12,.12],wav:[.008,.03],wk:[1.4,2.6],wph:[0,6.28],
    notch:[0,.02,.25],tip:[1.9,2.6],asym:[-.06,.06],curl:[0,.12,.4],cup:[.85,1.15],sd:'sd'},late:{hang:[.7,1.3],wl:[.8,1.2]},
  head:{rot:[-1.92,-1.22],cup:[.92,1.08],op:[-.04,.04],ring:[.9,1.1],dh:[-3,3],ds:[-.05,.05],dl:[-.02,.02],sty:[.92,1.08],spa:[0,6.28],sd:'sd'}};
function irisGenes(s){const g=svGenes(s,IRIS_GENES);for(let k=3;k<6;k++){const t=g.tep[k];t.hang=-.6*t.hang;t.wl=-.45*t.wl;t.tip*=1.15;t.notch+=.02;t.curl*=.5}return g}
/* ---------- the heart: the standards' own colour and their furl, the style arms, the spathe and the tube ---------- */
function irisHeart(ctx){const{R0,g,cw0,op,o2,bud,dec,fan,pieces}=ctx,P=SVI_HOLL._m,sh=c=>svShift(c,g.dh,g.ds,g.dl);
  svReskin(pieces,[3,4,5],svWhorlMat(P,g,op,dec,cw0.inner),cw0.inner);
  /* half open, the standards still furled round the style arms; faded, rolled together into a twisted column (wet paper) */
  const f=(1-bud)*(1-svSm((op-.42)/.22)),ff=.9*fan,fo=f>=ff;
  if(f>0||ff>0)for(let i=0;i<3;i++){const k=3+i;pieces[k]=svFurl(pieces[k],g.rot+(i+.5)/3*6.2832+g.tep[k].dph,Math.max(f,ff),fo?{R0,rf:.16,h:P.L[1]*.98,z0:.02,hw:1.35,spin:.5}:{R0,rf:.11,h:P.L[1]*.8,z0:.02,hw:1.3,spin:2.4,k:.7})}
  const falls=[];for(let i=0;i<3;i++){const t=g.tep[i];falls.push({phi:g.rot+i/3*6.2832+t.dph,a:(P.a0[0][0]+P.a0[0][1]*o2)+t.da0+P.wA0[1]*fan*t.hang,k:g.sty*(1-.45*fan),droop:.6*fan})}
  const sc=cw0.sty.c,cr=cw0.sty.cr,sm=svPlainMat(P,[[0,sh(mix(sc,'#ffffff',.3))],[.35,sh(sc)],[.68,sh(sc)],[.86,sh(mix(sc,cr,.6))],[1,sh(cr)]],[[0,'#d8d2de'],[.6,sh(mix(sc,'#ffffff',.45))],[1,sh(mix(cr,'#ffffff',.3))]],
    {veins:(s2,front)=>front?[[[[[0,.02],[0,.4],[0,.75]]],.004,sh(mix(sc,cw0.inner.shade,.45)),.45]]:[]});
  svStyleArms(ctx,falls,{w0:.34,w1:.54},sm);
  const pp=.25+.4*svSm((op-.3)/.5),gC='#6a8c58',bw=(c,v)=>fan>0?mix(c,'#c2a97c',fan*(.2+.75*v)):c,lo=DET<1.5,spm=b=>svPlainMat(P,[[0,bw('#6f8f5c',0)],[.45,bw(b?'#7d9a62':gC,.45)],...(lo?[]:[[.72,bw(mix('#86a066','#cdb49a',pp*.6),.72)]]),[.9,bw(mix('#a8a074','#d6b4a0',pp),.9)],[1,bw('#d2b8a2',1)]],
    lo?[[0,'#8aa874'],[1,'#d8c2ae']]:[[0,'#8aa874'],[.6,'#9ab480'],[.9,mix('#b6b48a','#dcc4b0',pp)],[1,'#d8c2ae']],{rim:'#e6dcc4',rw:.012,ro:.5,trans:.3,
      veins:(s2,front)=>[[[-.6,-.3,0,.3,.6].map(u=>[[u,.02],[u*.9,.5],[u*.5,.9]]),.0025,front?'#4a6a40':'#7a9468',.3]]});
  const z0=-irisTube(op),Hb=P.budH[0]+P.budH[1]*svSm((op-.02)/.3),Rb=Hb*P.budR,zb0=P.z0[0]*.5-.06,
    rz=bud>0?zR=>{const ve=(zR-zb0)/Hb;return ve<=0||ve>=1?0:bud*(Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(ve,P.budK))),P.budP)+.006)}:null;
  /* the column the flower is born from (photos 19, 284, 325, 326): the ovary in the spathe, the narrow green perianth tube above it, flaring into the
     hafts of the falls and standards (they start at r0 = .09 inside the flare): no daylight between the spathe and the flower */
  if(bud<.6){const Lc=.02-z0,hb=mix('#a9b48c',cw0.st[0][1],.3),cm=Object.assign(svPlainMat(P,[[0,'#5d7d4a'],[.8,bw('#7d9a5e',.5)],[1,bw(hb,.8)]],[[0,'#7a9866'],[1,bw(hb,.8)]],{trans:0,rw:.004}),DET<1.5?{darkLo:[],litLo:[]}:{});
    svTubeIris(ctx,z0,.02,1,cm,{face:true,nu:DET>=1.5?6:4,nv:DET>=1.5?10:7,prof:v=>{const dt=Lc*(1-v);return .046+.026*svSm((dt-.36)/.18)+.064*Math.pow(1-svSm(dt/.18),1.5)}});
    /* the throat: only the near half of the flare is drawn, and between the hafts of the falls and the claws of the standards the daylight showed
       through the heart of the flower (QA, relay 7: 11 x 18 px at 2400 px, beside the column). A funnel closes it at every stage but the bud: the
       floor of the flare (from the axis, no hole), then a skirt rising just under the flattest haft (its angle from the axis, flatter as the falls
       hang), out past the claws (darker when faded, like the faded hafts); in the head's frame, so it follows the head when it nods. Depth-sorted with the rest. */
    const af=Math.min(1.45,Math.max(...falls.map(x=>x.a))+.06),Sf=.03+.11*o2,sa=Math.sin(af),ca=Math.cos(af),c0=cw0.st[0][1],fd=c=>fan>0?mix(c,cw0.shade,.5*fan):c;
    pieces.push(svSheet(ctx.B,ctx.O,(u,v)=>{const a=(u+1)*Math.PI,s=Sf*Math.max(0,2*v-1),rr=R0*(v<.5?.18*v:.09+s*sa);return[Math.cos(a)*rr,Math.sin(a)*rr,R0*(-.016+s*ca)]},{nu:6,nv:2,
      mat:Object.assign(svPlainMat(P,[[0,fd(bw(mix(hb,c0,.25),.5))],[.5,fd(mix(hb,c0,.4))],[1,fd(mix(hb,c0,.6))]],[[0,fd(bw(hb,.5))],[1,fd(mix(hb,c0,.3))]],{trans:0,rw:0}),{darkLo:[],litLo:[]})}))}
  /* the spathe: two long valves pressed on the column, their tips close to it (not splayed in a V), drier at the point */
  svSpathe(ctx,{one:DET<1.5,z0,L:1.38-.26*svSm((op-.2)/.45),nu:DET>=1.5?7:5,nv:DET>=1.5?8:6,ph:g.spa,dph:.06,lean:.01+.02*o2,fl:.012,rz},[spm(0),spm(1)]);
  /* below DET 1.5, the closed bud's standards are wholly wrapped in the falls (relay 8: the same pixels without them): left out of the budget */
  if(DET<1.5&&bud>=.999&&!(fan>0))pieces.splice(3,3)}
/* ---------- SVI_HOLL: the Dutch iris ---------- */
const SVI_HOLL={genes:irisGenes,mat:irisMat,heart:irisHeart,
  /* falls (outer) and standards (inner): lengths x R0, widths x length (photos 13, 19, 3: falls ~ .6 of the spread from the centre, standards as tall,
     the falls' blade ~ .55 of their length wide, the standards ~ .35) */
  L:[1.28,.92],Wd:[.54,.32],r0:.09,z0:[-.01,.03],
  /* the falls' haft rises ~27 deg above the horizontal, the blade turns down to ~45 deg below (photo 19 in profile); the standards stand ~15 deg out */
  a0:[[.12,1.1],[.04,.3]],a1:[[.1,2.4],[-.04,.36]],aPow:1.6,
  cup:.32,cupW:[-.3,1.2],cupArc:true,cupFan:-2.6,vb:.7,claw:[.2,.8],clawK:3.2,
  /* the bud: a slim pointed spindle (H/W ~3 above the spathe), green from the foot, the colour at the tip */
  open:[.2,.4],bud:[.2,.2],green:[.85,.04,.2],greenTip:.2,greenC:'#6f8c5c',budPale:false,
  budH:[1.3,.55],budR:.115,budE:[.06,.92],budK:.7,budP:1.25,budW:[1.45,1.3],budHw:[1,.94],budRw:[1,.9],
  /* the decline and the faded flower: no shedding; the tepals roll and twist, go limp, translucent; the head nods */
  dec:[.12,.35],fan:[.5,.25],shed:[9,1],tip:[[.08,.2,.4],[.3,.55,.3]],wA0:[0,.1],wA1:[.35,.95],sag:[.04,.1,.2],limp:[.95,.15],wav:[.8,1.4,2.6],curl:[.3,1],tw:[.6,1.3],
  fanL:.12,fanW:.3,shedW:0,rev:[.25,.25],crk:[.05,.14],edge:{light:'#c8a676',red:'#5e0a24',other:'#7a5636',a:[.18,.7]},trans:[.24,.3],rim:[.005,.01,.2,.25],
  veinN:[22,10],veinLo:false,veinNet:[.3,0],veinFork:[.6,.3],ao:[.5,.3,.2,.3],nu:[10,12],nv:16,pmin:4,
  light:Object.assign({},SVB_DEF.light,{ks:.1,gloss:16,darkLo:[.78],litLo:[1.12]})};
/* the iris head: falls, standards, style arms, spathe, in the frame B at O, D across, opening op, wilted wl (by default the bouquet's stage) */
/* the budget below DET 1.5 (relay 8): a gradient's stops that change nothing are left out of the head: the middle of a run at one offset (the
   engine clamps the stops' projections to 0..1, so a curled tepal stacks them at its ends), the inside of a plateau, a first or last stop the
   colour of its neighbour, and a middle stop within 4/255 of the straight blend of its neighbours (same opacity). Only while the head is drawn */
const irisHex=c=>typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c)?[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)):null;
function irisStopPrune(s){const a=s.map((c,i)=>Array.isArray(c)?[+c[0],c[1],c[2]??1,c]:[i/Math.max(1,s.length-1),c,1,c]),same=(x,y)=>x[1]===y[1]&&+x[2]===+y[2];
  for(let ch=true;ch&&a.length>2;){ch=false;for(let i=0;i<a.length&&!ch;i++){const p=a[i-1],q=a[i],n=a[i+1];let dr=false;
    if(p&&n)dr=(p[0]===q[0]&&q[0]===n[0])||(same(p,q)&&same(q,n));else dr=same(q,p||n);
    if(!dr&&p&&n&&n[0]>p[0]&&+p[2]===+q[2]&&+q[2]===+n[2]){const A=irisHex(p[1]),Q=irisHex(q[1]),C=irisHex(n[1]),f=(q[0]-p[0])/(n[0]-p[0]);
      dr=!!(A&&Q&&C)&&[0,1,2].every(k=>Math.abs(A[k]+(C[k]-A[k])*f-Q[k])<=4)}
    if(dr){a.splice(i,1);ch=true}}}
  return a.length<s.length?a.map(x=>x[3]):s}
function irisSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_IRIS!=='undefined'&&CW_IRIS.find(x=>x.id===cwId))||{id:cwId,c:'#5a4aa8'};
  if(!(DET<1.5)||typeof stops!=='function')return svBloom(par,B,O,D,S||SVI_HOLL,cwx,op,seed,wl==null?irisLife():wl);
  const st0=stops;stops=(g,s)=>st0(g,irisStopPrune(s));try{return svBloom(par,B,O,D,S||SVI_HOLL,cwx,op,seed,wl==null?irisLife():wl)}finally{stops=st0}}
SV_HEAD['iris-hollandais']=irisSvg;
/* the iris of the bouquet: the old drawing's share of the bouquet's chance is consumed (bud: its two spathes, 2 draws; flower: 17), the first name the individual */
function irisSvgPut(par,B,O,D,cw,op,o){const n=op<.3?2:17;let s=0;for(let i=0;i<n;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  /* the wilting head nods on its neck: svBloom turns it about its own base O, which swung the column's foot (the spathe, the ovary) off the stem's
     top; O is moved so that the turn pivots on the stem's top instead (same tip as svBloom's): the column stays on the stem, the flower hangs */
  const wl=irisLife(o),t=irisTube(op)*D/2,tip=SVI_HOLL.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0),ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);
  if(tip>0&&al>.05){const Z2=rotA(B[2],V3.sc(ax,1/al),Math.min(tip,Math.acos(Math.max(-1,Math.min(1,-B[2][1])))*.95));O=V3.add(V3s(O,V3.sc(B[2],t)),V3.sc(Z2,t))}
  return irisSvg(par,B,O,D,cw.id,op,svSeed('iris',cw.id,s),wl)}
/* ---------- the plant: a round, smooth, yellowish green stem; narrow channelled grey-green leaves sheathing its lower part ---------- */
const IRIS_SC=['#44582e','#6e8a48','#9fb36e','#d8e2a4'];IRIS_SC.sv={swell:.03,gloss:.32};
const IRIS_SW=.1;
/* the stem fading: it stays green (339), barely dulled (the leaves yellow from their tips, svStrapLeaf's own rule); in a bouquet drawn all
   faded (LIFE_ALL 'fane') it wilts with the rest */
function irisStemCols(wl){if(!(wl>0)||typeof lifeCol!=='function')return IRIS_SC;const c=IRIS_SC.map(x=>lifeCol(x,(typeof LIFE_ALL!=='undefined'&&LIFE_ALL==='fane'?.85:.12)*wl));c.sv=IRIS_SC.sv;return c}
if(typeof GHI!=='undefined'&&GHI['iris-hollandais'])Object.assign(GHI['iris-hollandais'],{sc:IRIS_SC});
/* the leaves (295, 313, 336, 292, 376, 351, 331): linear, channelled, glaucous, MOSTLY BASAL: they sheathe the foot of the stem and rise close along it to
   about half its height, the stem bare above; on a cut stem 2 to 4 are left, the lowest ones longest; often one short clasping leaf higher up */
const IRIS_LEAF={W:[.085,.11],up:'#5f7d4a',low:'#8ba57a',lean:[.1,.24],droop:.32,tw:.85,sheath:[.14,.2],cau:{at:[.5,.62],len:[.17,.26],sheath:[.35,.45],lean:[.1,.2],W:.075}};
/* the stem below the plant's own axis as the bouquet will draw it (c5.js stemTo: a cubic from the mouth arriving in the neck along the neck), or straight
   on (the plant sheet): the leaves' feet sit on it. nk the neck, t0 the way down there (plant-local, y up). at(s): s from the neck -> {p, t upward} */
function irisBelow(nk,t0,B,up){if(!B.reach)return{L:0,at:s=>({p:V3.add(nk,V3.sc(t0,s)),t:V3.sc(t0,-1)})};
  const bp=V3.sc(up,-B.reach),P3=nk,P0=[bp[0],bp[1]-8,nk[2]],Lc=Math.hypot(P3[0]-P0[0],P3[1]-P0[1]),k=Math.max(0,Math.min(1,1-(Lc-20)/50)),hk=Lc*(.38-.2*k),
    P1=V3.add(V3.sc([P0[0]+(P3[0]-P0[0])*.06,bp[1]+.35*(P3[1]-bp[1]),nk[2]],1-k),V3.sc(V3.add(P0,V3.sc(V3s(P3,P0),.33)),k)),P2=V3.add(P3,V3.sc(t0,hk)),
    bq=q=>{const u=1-q;return V3.add(V3.add(V3.sc(P0,u*u*u),V3.sc(P1,3*u*u*q)),V3.add(V3.sc(P2,3*u*q*q),V3.sc(P3,q*q*q)))},S=[0],Q=[1];
  let acc=0,pv=P3;for(let i=1;i<=32;i++){const q=1-i/32,pt=bq(q);acc+=V3l(V3s(pt,pv));pv=pt;S.push(acc);Q.push(q)}
  return{L:acc,at:s=>{let i=1;while(i<32&&S[i]<s)i++;const f=Math.max(0,Math.min(1,(s-S[i-1])/((S[i]-S[i-1])||1))),q=Q[i-1]+(Q[i]-Q[i-1])*f,p=bq(q);
    return{p,t:V3.nz(V3s(bq(Math.min(1,q+.01)),p))}}}}
/* the leaves' drawers: feet, lengths and sides from the individual's own chance (rg), never the bouquet's. The two ranks stand across the view, each
   blade turned 13 to 35 degrees toward or away from the viewer: seen mostly edgewise, as in the photos, never hiding the stem */
function irisLeaves(res,apex,up,U0,B,D,w,wl,rg,ph0,stem){const c0=res.chains[0],P=c0.pts.map(q=>V3s(q,apex)),n0=P.length,nk=P[0],t0=V3.nz(V3s(P[0],P[Math.min(2,n0-1)]));
  const cum=[0];for(let i=n0-2;i>=0;i--)cum.unshift(cum[0]+V3l(V3s(P[i+1],P[i])));const Hp=cum[0],bl=irisBelow(nk,t0,B,up),Lv=Hp+(B.reach?bl.L*.9:Hp*1.3);
  /* a point of the stem at s from the apex, its upward tangent */
  const stemAt=s=>{if(s>=Hp)return bl.at(s-Hp);let i=0;while(i<n0-2&&cum[i+1]>s)i++;const f=(cum[i]-s)/((cum[i]-cum[i+1])||1),p=V3.add(V3.sc(P[i],1-f),V3.sc(P[i+1],f));
    return{p,t:V3.nz(V3s(P[i+1],P[i]))}};
  const R2=(a,b)=>a+(b-a)*rg(),u=rg(),n=u<.3?2:u<.75?3:4,sd0=(ph0%2<1)?0:Math.PI,cau=n>2||rg()<.5,nb=cau?n-1:n,low=R2(.93,.97),stp=R2(.05,.08),out=[],bas=[],L=IRIS_LEAF,C=L.cau;
  for(let k=0;k<n;k++){const ca=cau&&k===n-1,s=Lv*(ca?R2(...C.at):low-stp*k),{p,t}=stemAt(s),len=Lv*(ca?R2(...C.len):(.7-.07*k)*R2(.9,1.08)),
      e1=V3l(V3.cr(t,[0,0,1]))>.05?V3.nz(V3.cr(t,[0,0,1])):V3.nz(V3s(U0,V3.sc(t,V3.dot(U0,t)))),e2=V3.cr(e1,t),phi=sd0+k*Math.PI+R2(.22,.62)*(rg()<.5?-1:1),Out=V3.add(V3.sc(e1,Math.cos(phi)),V3.sc(e2,Math.sin(phi)));
    const op={len,w:D*(ca?C.W:L.W[1]-(L.W[1]-L.W[0])*k/Math.max(1,nb-1))*R2(.92,1.08)/len,sheath:ca?R2(...C.sheath):R2(...L.sheath),sr:w*.56,
      lean:ca?R2(...C.lean):R2(...L.lean),droop:L.droop*(ca?.5:1),tw:L.tw,up:L.up,low:L.low,stem,sd:svSeed('iris-feuille',Math.floor(rg()*1e6)),wl,lite:k>0,nosheath:!ca};
    out.push(svBladeLite(p,t,Out,op));if(!ca)bas.push({s,hs:len*op.sheath,Out})}
  out.sleeve=irisSleeve(bas,stemAt,w*.56,Hp,bl.L,stem);return out}
/* the basal leaves' sheaths as ONE sleeve round the stem (they clasp one another): it follows the stem's own curve from the lowest foot up to the
   highest mouth, a lengthwise gradient (paler at the foot), a little transparent so the stem's roundness shows through; the lower mouths are fine
   lines on it (no stepped bands of flat colour) */
function irisSleeve(bas,stemAt,sr,Hp,Lb,stem){if(!bas.length)return()=>{};const VZ=[0,0,1],P2=q=>[q[0],-q[1]],sBot=Math.max(...bas.map(b=>b.s)),
    fr=s=>{const{p,t}=stemAt(s);let e2=V3s(VZ,V3.sc(t,V3.dot(VZ,t)));e2=V3l(e2)>1e-3?V3.nz(e2):V3.nz(V3.cr(t,[1,0,0]));return{p,t,e1:V3.cr(t,e2),e2}},
    rad=s=>sr*(1.07+.1*Math.max(0,Math.min(1,(s-Hp)/(Lb||1)))),pt=(s,th)=>{const f=fr(s),r=rad(s);return P2(V3.add(f.p,V3.add(V3.sc(f.e1,Math.cos(th)*r),V3.sc(f.e2,Math.sin(th)*r))))};
  for(const b of bas){const f=fr(b.s);b.thb=Math.atan2(V3.dot(b.Out,f.e2),V3.dot(b.Out,f.e1))}
  const mS=(b,th)=>b.s-b.hs*(1-.55*(1-Math.cos(th-b.thb))/2),env=th=>Math.min(...bas.map(b=>mS(b,th))),M=8,c0=stem?mix(stem,mix(IRIS_LEAF.low,IRIS_LEAF.up,.5),.5):'#7d9562';
  return par=>{const P=[];for(let i=0;i<=M;i++)P.push(pt(sBot+(env(0)-sBot)*i/M,0));for(let i=1;i<M;i++){const th=Math.PI*i/M;P.push(pt(env(th),th))}
    for(let i=0;i<=M;i++)P.push(pt(env(Math.PI)+(sBot-env(Math.PI))*i/M,Math.PI));for(let i=1;i<4;i++)P.push(pt(sBot,Math.PI*(1-i/4)));
    const a=P2(fr(sBot).p),z=P2(fr(env(Math.PI/2)).p),id='isl'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(z[0]),y2:svF(z[1])},GDEF||defs);
    stops(gr,[[0,mix(c0,'#cdd6b0',.35)],[1,c0]]);E('path',{d:svSpl(P),fill:`url(#${id})`,'fill-opacity':.8},par);
    /* the rim of the highest mouths, and the lower mouths where they show below it */
    let d='';const seg=pts=>{if(pts.length>1)d+='M'+pts.map(q=>svJ([svR(q[0]),svR(q[1])])).join('L')};
    {const q=[];for(let i=0;i<=M;i++){const th=Math.PI*i/M;q.push(pt(env(th),th))}seg(q)}
    for(const b of bas){let q=[];for(let i=0;i<=M;i++){const th=Math.PI*i/M,s=mS(b,th);if(s>env(th)+.4)q.push(pt(s,th));else{seg(q);q=[]}}seg(q)}
    E('path',{d,fill:'none',stroke:mix(c0,'#22331c',.5),'stroke-opacity':.4,'stroke-width':svF(Math.max(.18,sr*.1))},par)}}
/* the plant, the old drawing's skeleton (irisPlant, s22a.js) and its chance, the head and the leaves in native SVG; the old drawing when SVG is off.
   The stem is drawn in one piece (smooth, no joints); the leaves order themselves about it: sheaths in front, blades in front or behind */
function irisPlantSv(g,t,o){if(!(typeof SV_ON!=='undefined'&&SV_ON))return irisPlant(g,t,o);
  const cw=o.cw||cwNear(CW_IRIS,o.col)||CW_IRIS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=irisStemCols(irisLife(o));
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,w=D*IRIS_SW,ph0=R(0,360),nl=o.rim?0:2,ro=o.rim?.2:1,lean=V3.nz(V3.add(up,V3.sc(face,.18))),wl=irisLife(o);
  const rules={S:()=>{const out=[['F',{l:D*.9*kr*ro,w0:w*1.12,w1:w*1.06,e:.004}]];for(let i=0;i<nl;i++)out.push(['[',{}],['/',{a:ph0+i*180+R(-20,20)}],['&',{a:R(13,19)}],['Lv',{i}],[']',{}],['F',{l:D*.5*kr,w1:w*(1.04-.03*i),e:.004}]);
    out.push(['F',{l:D*.45*kr*ro,w1:w,aim:lean,k:.15}],['K',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,1),{p:[0,0,0],H:up,U:U0,wig:.008,seg:D*.15,T:[0,1,0],e:.004,w:w*1.12});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos,c0=res.chains[0],zS=c0.pts.reduce((a,q)=>a+q[2],0)/c0.pts.length-apex[2];
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:999,organ:(og,pos)=>{
    if(og.t==='K'){const Z=V3.nz(V3.add(og.H,V3.sc(face,.35))),v=V3s(face,V3.sc(Z,V3.dot(face,Z))),Bf=frZ(Z,V3l(v)>.05?V3.sc(v,-1):og.U,R(-.25,.25));
      const Of=V3.add(pos,V3.sc(Z,D*.5*irisTube(op)));return{parts:[{z:3e4+pos[2]+Z[2]*D*.3,fn:par=>irisSvgPut(par,Bf,Of,D,cw,op,o)}]}}
    /* the old drawing's two leaves keep their draws of the bouquet's chance (rtest); the first hands over all the leaves */
    if(og.t==='Lv'){R(1.3,1.6);R(-.4,.4);if(og.p.i)return null;const L=irisLeaves(res,apex,up,U0,B,D,w,wl,svRng(svSeed('iris-plante',cw.id,Math.round(ph0*1e3))),ph0,sc[1]);
      return{ext:1,parts:[{z:zS+1e4-1,fn:L.sleeve}].concat(L.flatMap((l,i)=>[{z:zS+1e4+i,fn:l.sheath},{z:zS+(l.front?2e4:-1e4)+i,fn:l.blade}]))}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
if(typeof GH!=='undefined')GH['iris-hollandais']=irisPlantSv;
