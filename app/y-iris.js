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
   Measured: 0 and 2 complete (coloris-lot1.json, photos 3, 13, 37, 58, 129); the others carry the measured bodies and signal only (level C, to finish). */
const IRIS_CW={
  bleu:{cv:'Blue Magic',lv:'A corps, C signal (coloris-lch)',std:{b:'#6b4cc1',c:'#6c43c0',t:'#7c57cc',sh:'#28176a',li:'#a690e6',bk:'#7058b4'},
    fal:{h:'#d6cfe8',c:'#402a9b',t:'#271b5b',sh:'#120944',li:'#7461d0',bk:'#4e3e96'},sig:{c:'#f6dd24',e:'#d6d2f0'},
    sty:{c:'#8a74d0',cr:'#7c57cc'},vein:{s:'#48299a',f:'#1c0f56'},lis:null,marg:null},
  'bleu-nuit':{cv:'Professor Blaauw',lv:'C',std:{c:'#514fa2',t:'#6255d7'},fal:{b:'#49469e',c:'#4644a2'},sig:{c:'#f2bf0a'}},
  violet:{cv:'Purple Sensation',lv:'C (coloris-lch, signal A)',std:{b:'#672473',c:'#772a76',t:'#812e7a',sh:'#2c0a36',li:'#b474bc',bk:'#7a4288'},
    fal:{h:'#d8c8e2',b:'#5d1e96',c:'#631a81',t:'#591c6d',sh:'#280746',li:'#aa6ad4',bk:'#6e3e96'},sig:{c:'#f6db0d',e:'#cdb6e4'},
    sty:{c:'#a070b4',cr:'#812e7a'},vein:{s:'#561866',f:'#3a0c62'},lis:{c:'#9a62c8',w:.014,v0:.5,op:.75},marg:'#a678d0'},
  'bleu-ciel':{cv:'Wedgwood',lv:'C (une photo de champ)',std:{c:'#b3b6ed'},fal:{c:'#b6b3e8'},sig:{c:'#f2c830'}},
  silvery:{cv:'Silvery Beauty',lv:'C',std:{c:'#b3afee'},fal:{c:'#e6e5d6'},sig:{c:'#f1c709'}},
  blanc:{cv:'White Excelsior',lv:'C (provisoire)',std:{c:'#e6e3d3'},fal:{c:'#e6e0b6'},sig:{c:'#f1ca1a'}},
  jaune:{cv:'Golden Harvest',lv:'C',std:{c:'#f4ee28',t:'#f5f53e'},fal:{c:'#fdb922',t:'#e8a627'},sig:{c:'#f8cf18'}},
  apollo:{cv:'Apollo',lv:'A corps, C signal',std:{c:'#e6e4cb',t:'#c1c4c1'},fal:{c:'#eac708',t:'#d7cd44'},sig:{c:'#e6b502'}},
  bronze:{cv:'Red Ember',lv:'C',std:{c:'#99116b',t:'#ad2e84'},fal:{c:'#501403',t:'#4b1405'},sig:{c:'#fce106'}},
  noir:{cv:'(sans représentant prouvé)',lv:'-',std:{c:'#3a1a50'},fal:{c:'#3a1a50'},sig:{c:'#f2c21c'}}};
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
/* the colour of a fading iris (photographs 138, 132, 280, 281, 282): blues and violets go translucent grey-lilac, then rosy-grey parchment; the signal
   orange, then brown; whites ivory, then parchment; the greens (spathe, tube) by the common rule */
function irisWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.1)return c;
  if(h>=65&&h<175&&s>.1)return typeof lifeCol==='function'?lifeCol(c,.3*w):c;
  if(s<.14||l>.88){let o=mix(c,'#e6dcc2',.65*w);if(w>.5)o=mix(o,'#b8a080',(w-.5)*.9);return o}
  if(h<65){let o=l2h(h-(h-26)*.5*w,s*(1-.3*w),l*(1-.25*w));if(w>.55)o=mix(o,'#8a5a2a',(w-.55)*.9);return o}
  if(h<335){let o=l2h(h+(285-h)*.35*w,s*(1-.7*w),l+(.6-l)*.4*w);if(w>.45)o=mix(o,'#a49cb0',(w-.45)*1.1);if(w>.62)o=mix(o,'#d6be8c',Math.min(1,(w-.62)*2.2));return o}
  let o=mix(c,'#9a6a6a',.5*w);if(w>.5)o=mix(o,'#8a6a50',(w-.5)*.8);return o}
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
  if(f>0||ff>0)for(let i=0;i<3;i++){const k=3+i;pieces[k]=svFurl(pieces[k],g.rot+(i+.5)/3*6.2832+g.tep[k].dph,Math.max(f,ff),fo?{R0,rf:.16,h:P.L[1]*.98,z0:.02,hw:1.35,spin:.5}:{R0,rf:.085,h:P.L[1]*.8,z0:.02,hw:1.2,spin:1.7,k:.7})}
  const falls=[];for(let i=0;i<3;i++){const t=g.tep[i];falls.push({phi:g.rot+i/3*6.2832+t.dph,a:(P.a0[0][0]+P.a0[0][1]*o2)+t.da0+P.wA0[1]*fan*t.hang,k:g.sty*(1-.45*fan),droop:.6*fan})}
  const sc=cw0.sty.c,cr=cw0.sty.cr,sm=svPlainMat(P,[[0,sh(mix(sc,'#ffffff',.3))],[.35,sh(sc)],[.68,sh(sc)],[.86,sh(mix(sc,cr,.6))],[1,sh(cr)]],[[0,'#d8d2de'],[.6,sh(mix(sc,'#ffffff',.45))],[1,sh(mix(cr,'#ffffff',.3))]],
    {veins:(s2,front)=>front?[[[[[0,.02],[0,.4],[0,.75]]],.004,sh(mix(sc,cw0.inner.shade,.45)),.45]]:[]});
  svStyleArms(ctx,falls,{w0:.34,w1:.54},sm);
  const pp=.25+.4*svSm((op-.3)/.5),gC='#6a8c58',bw=(c,v)=>fan>0?mix(c,'#a08a5c',fan*(.1+.7*v)):c,spm=b=>svPlainMat(P,[[0,bw('#6f8f5c',0)],[.45,bw(b?'#7d9a62':gC,.45)],[.72,bw(mix('#86a066','#cdb49a',pp*.6),.72)],[.9,bw(mix('#a8a074','#d6b4a0',pp),.9)],[1,bw('#d2b8a2',1)]],
    [[0,'#8aa874'],[.6,'#9ab480'],[.9,mix('#b6b48a','#dcc4b0',pp)],[1,'#d8c2ae']],{rim:'#e6dcc4',rw:.012,ro:.5,trans:.3,
      veins:(s2,front)=>[[[-.6,-.3,0,.3,.6].map(u=>[[u,.02],[u*.9,.5],[u*.5,.9]]),.0025,front?'#4a6a40':'#7a9468',.3]]});
  const z0=-irisTube(op),Hb=P.budH[0]+P.budH[1]*svSm((op-.02)/.3),Rb=Hb*P.budR,zb0=P.z0[0]*.5-.06,
    rz=bud>0?zR=>{const ve=(zR-zb0)/Hb;return ve<=0||ve>=1?0:bud*(Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(ve,P.budK))),P.budP)+.006)}:null;svSpathe(ctx,{one:DET<1.5,z0,L:1.38-.26*svSm((op-.2)/.45),nu:DET>=1.5?7:5,nv:DET>=1.5?8:6,ph:g.spa,dph:.06,lean:.02+.06*o2,fl:.03,rz},[spm(0),spm(1)])}
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
  dec:[.12,.35],fan:[.5,.25],shed:[9,1],tip:[[.08,.2,.4],[.3,.55,.3]],wA0:[0,.1],wA1:[.35,.95],sag:[.04,.1,.2],limp:[.95,.15],wav:[.8,1.4,2.6],curl:[.25,.7],tw:[.6,.9],
  fanL:.12,fanW:.62,shedW:0,rev:[.25,.25],crk:[.05,.14],edge:{light:'#c8a676',red:'#5e0a24',other:'#7a5636',a:[.18,.7]},trans:[.24,.3],rim:[.005,.01,.2,.25],
  veinN:[22,10],veinLo:false,veinNet:[.3,0],veinFork:[.6,.3],ao:[.5,.3,.2,.3],nu:[10,12],nv:16,pmin:4,
  light:Object.assign({},SVB_DEF.light,{ks:.1,gloss:16,darkLo:[.78],litLo:[1.12]})};
/* the iris head: falls, standards, style arms, spathe, in the frame B at O, D across, opening op, wilted wl (by default the bouquet's stage) */
function irisSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_IRIS!=='undefined'&&CW_IRIS.find(x=>x.id===cwId))||{id:cwId,c:'#5a4aa8'};
  return svBloom(par,B,O,D,S||SVI_HOLL,cwx,op,seed,wl==null?irisLife():wl)}
SV_HEAD['iris-hollandais']=irisSvg;
/* the iris of the bouquet: the old drawing's share of the bouquet's chance is consumed (bud: its two spathes, 2 draws; flower: 17), the first name the individual */
function irisSvgPut(par,B,O,D,cw,op,o){const n=op<.3?2:17;let s=0;for(let i=0;i<n;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return irisSvg(par,B,O,D,cw.id,op,svSeed('iris',cw.id,s),irisLife(o))}
/* ---------- the plant: a round, smooth, yellowish green stem; narrow channelled grey-green leaves sheathing its lower part ---------- */
const IRIS_SC=['#44582e','#6e8a48','#9fb36e','#d8e2a4'];IRIS_SC.sv={swell:.03,gloss:.32};
const IRIS_SW=.1;
/* the stem fading: it stays green (339), barely dulled (the leaves yellow from their tips, svStrapLeaf's own rule) */
function irisStemCols(wl){if(!(wl>0)||typeof lifeCol!=='function')return IRIS_SC;const c=IRIS_SC.map(x=>lifeCol(x,.12*wl));c.sv=IRIS_SC.sv;return c}
if(typeof GHI!=='undefined'&&GHI['iris-hollandais'])Object.assign(GHI['iris-hollandais'],{sc:IRIS_SC});
/* one leaf of the stem: its foot at pos on the stem's axis, leaving it toward og.H; long, narrow (L/W 20 to 30), channelled, grey-green, the sheath long */
function irisLeafSv(par,og,pos,up,len,tw,sr,wl,sh=.3){const h=og.H,c=V3.dot(h,up),pe=V3s(h,V3.sc(up,c)),pl=V3l(pe),Out=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr(up,[0,0,1]));
  return svStrapLeaf(par,pos,up,Out,{len,w:.052,nu:6,nv:12,wp:[[0,.62],[.12,.8],[.3,1],[.62,.86],[.86,.5],[1,0]],sheath:sh,sr,lean:Math.acos(Math.max(-1,Math.min(1,c)))*.9+.1,droop:.34,tw:.35+Math.abs(tw)*.4,gut:.7,
    wav:.012,wavN:2,hood:.08,up:'#66804e',low:'#8fa47c',base:'#9ab088',bloom:.65,sd:svSeed('iris-feuille',Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(len)),wl})}
/* the plant, the old drawing's skeleton (irisPlant, s22a.js) and its chance, the head and the leaves in native SVG; the old drawing when SVG is off */
function irisPlantSv(g,t,o){if(!(typeof SV_ON!=='undefined'&&SV_ON))return irisPlant(g,t,o);
  const cw=o.cw||cwNear(CW_IRIS,o.col)||CW_IRIS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=irisStemCols(irisLife(o));
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,w=D*IRIS_SW,ph0=R(0,360),nl=o.rim?0:2,ro=o.rim?.2:1,lean=V3.nz(V3.add(up,V3.sc(face,.18))),wl=irisLife(o);
  const rules={S:()=>{const out=[['F',{l:D*.9*kr*ro,w0:w*1.12,w1:w*1.06,e:.004}]];for(let i=0;i<nl;i++)out.push(['[',{}],['/',{a:ph0+i*180+R(-20,20)}],['&',{a:R(13,19)}],['Lv',{i}],[']',{}],['F',{l:D*.5*kr,w1:w*(1.04-.03*i),e:.004}]);
    out.push(['F',{l:D*.45*kr*ro,w1:w,aim:lean,k:.15}],['K',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,1),{p:[0,0,0],H:up,U:U0,wig:.008,seg:D*.15,T:[0,1,0],e:.004,w:w*1.12});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Z=V3.nz(V3.add(og.H,V3.sc(face,.35))),v=V3s(face,V3.sc(Z,V3.dot(face,Z))),Bf=frZ(Z,V3l(v)>.05?V3.sc(v,-1):og.U,R(-.25,.25));
      const Of=V3.add(pos,V3.sc(Z,D*.5*irisTube(op)));return{parts:[{z:pos[2]+Z[2]*D*.3,fn:par=>irisSvgPut(par,Bf,Of,D,cw,op,o)}]}}
    if(og.t==='Lv'){const i=og.p.i,j=R(1.3,1.6)/1.45,tw=R(-.4,.4),Hp=V3.dot(apex,up),Hv=B.reach?Math.max(Hp*1.05,B.reach):Hp*2.2,hf=-(Hv-Hp)*.92+(i?.1*Hv:0),
      len=Hv*(i?.44:.58)*j,ft=V3.add(pos,V3.sc(up,hf-Hp-V3.dot(pos,up)));return{ext:1,parts:[{z:pos[2],fn:par=>irisLeafSv(par,og,ft,up,len,tw,w*.62,wl,i?.32:.26)}]}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
if(typeof GH!=='undefined')GH['iris-hollandais']=irisPlantSv;
