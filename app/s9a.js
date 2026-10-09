/* ================= Serre, lot 9 — Tulipes : simple, française, frangée, perroquet, double ================= */
/* colourways: c the inside of the tepals, cb their outside if it differs, bl the blotch at the base inside (ble its rim), edge a picotee, flame feathering from the base,
   g a green flush at the base outside, fr the colour of the fringe, an the anthers */
const CW_TSIM=[
 {id:'rouge',n:'Rouge (Ile de France)',c:'#c81f2c',bl:'#241216',ble:'#e2b83c'},{id:'rouge-feu',n:'Rouge feu (World’s Favourite)',c:'#d8342a',bl:'#3a2412'},
 {id:'orange',n:'Orange (Orange Juice)',c:'#f0772a',cb:'#e4642a',bl:'#3a3020'},{id:'orange-or',n:'Orange à base d’or (Sri Chinmoy)',c:'#e6532a',edge:'#f2c03a',bl:'#e6c040'},
 {id:'or',n:'Or (Strong Gold)',c:'#ebb23c',cb:'#e8a438',bl:'#4a3a20'},{id:'abricot',n:'Abricot (Apricot Impression)',c:'#f2a86a',cb:'#eea078',bl:'#e8c868'},{id:'corail',n:'Corail (Princess Irene)',c:'#f08468',bl:'#f0d070'},
 {id:'jaune',n:'Jaune (Golden Parade)',c:'#f6cf2a',bl:'#3a3a28'},{id:'citron-vert',n:'Citron vert (Green Power)',c:'#d6d272',cb:'#bcc86a',bl:'#c8c060',g:.6},{id:'creme',n:'Crème (Ivory Floradale)',c:'#f5ecc8',bl:'#e8d890',g:.4},
 {id:'blanc',n:'Blanc (Maureen)',c:'#f6f3ea',bl:'#e8e4b8',g:.5},{id:'rose-pale',n:'Rose pâle (Pink Diamond)',c:'#f4c6d2',bl:'#f2e8c0'},{id:'rose',n:'Rose (Pink Impression)',c:'#ec8aac',bl:'#283048'},
 {id:'fuchsia',n:'Fuchsia (Dynasty)',c:'#d63a7e',bl:'#26283e'},{id:'mauve',n:'Mauve (Havran)',c:'#a85a8e',bl:'#262040'},{id:'lilas',n:'Lilas (Bleu Aimable)',c:'#c3a2d6',bl:'#f0eef0'},
 {id:'violet',n:'Violet (Purple Prince)',c:'#6b2f86',bl:'#1e1830'},{id:'noir',n:'Pourpre noir (Queen of Night)',c:'#3c1428',bl:'#1a0c14'},
 {id:'blanc-pourpre',n:'Blanc liseré de pourpre (Shirley)',c:'#f6f0f0',edge:'#8a3a8a',bl:'#f0e8c8'},{id:'flamme-rose',n:'Blanc flammé de rose (Camargue)',c:'#f7eef0',flame:'#e47a9c',bl:'#f0e0a0'},
 {id:'ecarlate',n:'Écarlate (Apeldoorn)',c:'#dd4f47',bl:'#1a1014',late:1},{id:'pourpre-velours',n:'Pourpre velours (Negrita)',c:'#5d1642',bl:'#1e1830',late:1},
 {id:'peche-rose',n:'Pêche rosé (Blushing Lady)',c:'#f4b595',bl:'#f0d070',late:1},{id:'blanc-pur',n:'Blanc pur (Clearwater)',c:'#f6f4ec',bl:'#eeecd8',g:.3,late:1}];
const CW_TFR=[
 {id:'blanc',n:'Blanc',c:'#f6f3ea',bl:'#ece6c0',g:.45},{id:'creme',n:'Crème',c:'#f3ebcf',bl:'#ecdca0',g:.35},{id:'blush',n:'Rose blush',c:'#f6d6d2',bl:'#f2e2c0'},
 {id:'menton',n:'Rose abricot',c:'#f4b49e',cb:'#f0a890',bl:'#f2d090'},{id:'saumon',n:'Saumon',c:'#f08c74',bl:'#f0c070'},{id:'abricot',n:'Abricot',c:'#f6c3a0',bl:'#f0d498'},
 {id:'rose',n:'Rose',c:'#ee98b4',bl:'#f0e0c8'},{id:'jaune',n:'Jaune',c:'#f4d24a',bl:'#3a3a26'},{id:'rouge',n:'Rouge',c:'#d8302a',bl:'#2a1a12'},
 {id:'violet',n:'Violet',c:'#7a3a8a',bl:'#1e1830'},{id:'noir',n:'Pourpre noir',c:'#3c1428',bl:'#1a0c14'}];
const CW_TFRG=[
 {id:'rose',n:'Rose à cœur blanc',c:'#e99ab6',bl:'#f6f0f0',fr:'#f6d6e2'},{id:'blanc',n:'Blanc',c:'#f7f3ea',bl:'#ece6c0',fr:'#ffffff',g:.4},{id:'jaune',n:'Jaune',c:'#f6d02a',bl:'#e8b828',fr:'#faea8a'},
 {id:'rouge',n:'Rouge cramoisi',c:'#a3182e',bl:'#2a1218',fr:'#c8405a'},{id:'lilas',n:'Mauve à franges blanches',c:'#a888c8',bl:'#f0eef6',fr:'#d0c0e4'},{id:'noir',n:'Pourpre noir',c:'#3a0f2c',bl:'#1a0814',fr:'#6a3a5a'},
 {id:'fuchsia',n:'Rose fuchsia à cœur bleu',c:'#d8508a',bl:'#2a2a40',fr:'#f0a0c4'},{id:'orange',n:'Orange abricot à franges dorées',c:'#f08a5a',bl:'#f2c040',fr:'#f8c870'},{id:'jaune-rose',ret:1,n:'Crème jaune frangé de rose',c:'#f4dc6a',edge:'#e87aa0',bl:'#e8c040',fr:'#f2a0bc'}];
const CW_TPAR=[
 {id:'abricot',n:'Abricot',c:'#f4a873',flame:'#8aa858',bl:'#e8c060'},{id:'rouge',n:'Rouge',c:'#c41f2c',flame:'#5f8a3e',bl:'#2a1418'},{id:'blanc',n:'Blanc',c:'#f6f1e2',flame:'#9ab870',bl:'#e8e0b0'},
 {id:'jaune',n:'Jaune d’or',c:'#f5cf2e',flame:'#8aa848',bl:'#d8a020'},{id:'noir',n:'Pourpre noir',c:'#3f1030',flame:'#4a5a2a',bl:'#1a0814'},{id:'saumon',n:'Saumon',c:'#f28a6e',flame:'#8aa858',bl:'#f0c060'},
 {id:'rose',n:'Rose',c:'#f2a2bc',flame:'#8aa868',bl:'#f0e0b8'},{id:'cerise',n:'Orange (Amazing Parrot)',c:'#c8407e',flame:'#6a8a48',bl:'#2a2440'},{id:'lilas',n:'Violet (Blue Parrot)',c:'#9a7ab8',flame:'#7a9a68',bl:'#2a2440'},
 {id:'flamme',n:'Jaune flammé de rouge',c:'#f4d050',flame:'#d8302a',bl:'#3a2a18'},{id:'rouge-blanc',n:'Rouge et blanc (Estella Rijnveld)',c:'#f6eeee',flame:'#c8202c',bl:'#e8d8a0'},{id:'vert-rose',n:'Rose ondé de vert',c:'#ef9ab8',flame:'#7f9f4e',bl:'#f0e0b8'}];
const CW_TDBL=[
 {id:'rose-pale',n:'Rose pâle',c:'#f3bccb',cb:'#eeb2c2',g:.3},{id:'blanc',n:'Blanc',c:'#f6f2e8',g:.45},{id:'abricot',n:'Abricot poudré',c:'#f0c4a8',cb:'#e8b8a0',g:.25},
 {id:'peche',n:'Pêche',c:'#f6c0a0',g:.25},{id:'rose-vif',n:'Rose vif',c:'#e2457e',g:.2},{id:'jaune',n:'Jaune',c:'#f4d23c',g:.3},{id:'orange',n:'Orange flammé de pourpre',c:'#f08040',flame:'#8a3a6a',g:.2},
 {id:'rouge',n:'Rouge',c:'#c41e3a',g:.2},{id:'lilas',n:'Lilas',c:'#c8a2d4',g:.25},{id:'mauve',n:'Mauve rosé',c:'#d4b0c4',cb:'#c8a2b8',g:.25},{id:'bordeaux',n:'Bordeaux',c:'#8a2440',g:.2},{id:'noir',n:'Pourpre noir',c:'#3a1028',g:.15}];
/* a satin palette: the tepal's own colour shaded gently (a tulip is waxy and satiny, never metal: no ink-dark shadow, no white flare) */
const tuPal=(c,k=1)=>({c,ink:shd(c,-.5),d2:shd(c,-.3*k),d1:shd(c,-.15*k),b:c,l1:shd(c,.12*k),l2:shd(c,.24*k)});
/* the fine veins running up a tepal, in its own (u,v) space */
const TU_VEINS=[-.62,-.38,-.15,.08,.3,.55].map(u=>[[u*.35,.03],[u*.8,.35],[u*.95,.7],[u*.9,.93]]);
/* tepal outlines: obovate with a rounded tip (single), long and pointed (French), cut and notched (parrot), broad and round (double) */
const TU_TEP=prof([[0,.36],[.2,.72],[.48,.96],[.7,1],[.86,.9],[.95,.66],[1,.16]]),TU_FR=prof([[0,.34],[.24,.74],[.55,.98],[.76,.84],[.9,.5],[1,.05]]),TU_DBL=prof([[0,.3],[.22,.78],[.55,1],[.8,.94],[.93,.68],[1,.22]]),TU_PAR0=prof([[0,.34],[.2,.72],[.5,.98],[.72,1],[.88,.86],[1,.34]]),
  /* a parrot tepal's own cut margin: irregular lacinia, deeper toward the tip */
  /* a parrot tepal's margin: a few broad lobes and a fine feathered serration, only on its upper half */
  TU_PARf=()=>{const k1=R(3.5,5.5),k2=R(12,16),k3=R(26,34),p1=R(0,6.3),p2=R(0,6.3),p3=R(0,6.3),a1=R(.14,.22),a2=R(.06,.1),a3=R(.05,.08);
    return v=>TU_PAR0(v)*(1-(a1*Math.pow(Math.abs(Math.sin(v*Math.PI*k1+p1)),2)+a2*Math.pow(Math.abs(Math.sin(v*Math.PI*k2+p2)),1.5)+a3*Math.abs(Math.sin(v*Math.PI*k3+p3)))*sm01((v-.42)/.35))};
const TUK={simple:{L:.86,Wo:.37,Wi:.35,cup:-.5,bow:.05,wp:TU_TEP},french:{L:1.02,Wo:.31,Wi:.3,cup:-.46,bow:.04,wp:TU_FR},fringe:{L:.84,Wo:.35,Wi:.33,cup:-.48,bow:.04,wp:TU_TEP,fr:1},
  parrot:{L:.72,Wo:.5,Wi:.47,cup:-.4,bow:.02,wpf:TU_PARf,ruf:.55,rk:5,par:1},double:{L:.56,Wo:.42,Wi:.4,cup:-.56,bow:.03,wp:TU_DBL,dbl:1}};
/* one tulip in its frame (local Z its axis): six tepals in two whorls (or the rows of a double), closed in an egg, a goblet, then open; the satin sheen, the blotch, stamens and pistil */
function tulipFlower(par,B,O,Dm,cw,op,kd){return tulipDrawn(par,B,O,Dm,cw,op,kd)}
function tulipDrawn(par,B,O,Dm,cw,op,kd){const K=TUK[kd],F={k:G(par),B,O,parts:[],so:.18,sd:null},o2=sm01((op-.12)/.88),Ln=Dm*K.L,c=cw.c,cP=tuPal(c,1.3),cB=tuPal(cw.cb||mix(shd(c,.06),'#e8e4d4',h2l(c)[2]>.8?.06:.1),1.3);
  const deco=(S,sd,inner)=>(g,front,X)=>{if(LOD)return;const P3=(u,v)=>PJ3(F,S(u,v)),gr=(v0,v1,st)=>E('path',{d:X.d,fill:ugrad(...P3(0,v0).slice(0,2),...P3(0,v1).slice(0,2),st)},g);
    if(!front){if(cw.g&&o2<.7)gr(0,.5,[[0,'#7f9a5a',cw.g*(1-o2)],[1,'#7f9a5a',0]]);/* the flame on the outside: a feather of colour up the midrib from the foot, widest low, fading upward, combed with a few fine streaks */
        if(cw.flame){const vt=kd==='parrot'?.72:.6,hw=v=>(kd==='parrot'?.34:.26)*Math.pow(Math.sin(Math.PI*Math.min(1,.15+v/vt*.85)),.8)*(1-.35*v/vt),L0=[],R0=[];
          for(let i=0;i<=10;i++){const v=.02+vt*i/10,w=hw(v)*(1+.25*Math.sin(sd*3+i*1.7));L0.push(P3(-w+.05*Math.sin(sd+i),v));R0.push(P3(w+.05*Math.sin(sd+i*1.3),v))}
          const b0=P3(0,.02),b1=P3(0,vt);E('path',{d:smooth(L0.concat(R0.reverse()).map(p=>[p[0],p[1]])),fill:ugrad(b0[0],b0[1],b1[0]+(b1[0]===b0[0]&&b1[1]===b0[1]?.1:0),b1[1],[[0,cw.flame,.75],[.55,cw.flame,.45],[1,cw.flame,0]])},g);
          let d='';for(let j=0;j<3;j++){const u=(j-1)*.12+Math.sin(sd+j)*.04,q=[];for(let i=0;i<=6;i++){const v=.05+vt*.85*i/6;q.push(P3(u*(1-.4*v),v))}d+=smooth(q.map(p=>[p[0],p[1]]),false)}
          E('path',{d,stroke:shd(cw.flame,-.25),'stroke-width':f(Math.max(.35,Dm*.008)),'stroke-opacity':.35,fill:'none','stroke-linecap':'round'},g)}return}
    if(cw.bl&&o2>.5){const a=Math.min(1,(o2-.5)*2.5),vb=.3,wb=v=>.8*Math.pow(Math.max(0,1-Math.pow(v/vb,2.4)),.5),q=[];for(let i=0;i<=8;i++)q.push([-wb(vb*i/8),vb*i/8]);for(let i=8;i>=0;i--)q.push([wb(vb*i/8),vb*i/8]);
      const b0=P3(0,0),b1=P3(0,vb);E('path',{d:smooth(q.map(([u,v])=>{const p=P3(u,v);return[p[0],p[1]]})),fill:ugrad(b0[0],b0[1],b1[0]+(b1[0]===b0[0]&&b1[1]===b0[1]?.1:0),b1[1],[[0,cw.bl,.95*a],[.6,cw.bl,.88*a],[.84,cw.ble||cw.bl,cw.ble?.85*a:.35*a],[1,cw.ble||cw.bl,0]])},g)}
    if(cw.flame&&kd!=='parrot'){let d='';for(let j=0;j<3;j++){const u=-.35+j*.35,q=[];for(let i=0;i<=5;i++){const v=.05+.6*i/5;q.push(P3(u*(1-.4*v),v))}d+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d,stroke:cw.flame,'stroke-width':f(Dm*.03),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g)}
    if(cw.edge){const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:cw.edge,'stroke-width':f(Dm*.06),'stroke-opacity':.9,'clip-path':`url(#${id})`},g)}};
  /* the whorls: outer tepals a little wider and more open; a double adds rows inward */
  const rows=K.dbl?[[0,1,0],[1,.86,30],[2,.7,0],[3,.5,30]]:[[0,1,0]];let sd=1;const tep=[];
  for(const[ri,sc,rot]of rows)for(let i=0;i<6;i++){const inner=i%2===1,out=!inner&&!ri,ph=90+i*60+rot+R(-6,6),W=Ln*(inner?K.Wi:K.Wo)*sc*(K.dbl?R(.92,1.08):1);
    let a0,a1;if(kd==='parrot'){a0=10+38*o2+R(-8,8);a1=14+74*Math.pow(o2,1.3)+R(-16,16)}
    else if(K.dbl){const ro=[[22,34,32,52],[12,26,14,38],[6,14,0,22],[2,6,-8,6]][ri];a0=ro[0]+ro[1]*o2;a1=ro[2]+ro[3]*o2}
    else{const wide=op>.985?1:0;a0=14+(20+8*wide)*Math.pow(o2,1.15)+(out?3:0);a1=-4+(56+22*wide)*Math.pow(o2,1.7)+(out?6:0)}
    const S=petS({phi:ph,r0:Dm*(inner?.03:.05)*(1-ri*.25),z0:inner?Dm*.008:ri*Dm*.03,L:Ln*sc*R(.96,1.03),W,wp:K.wpf?K.wpf():K.wp,a0,a1,pw:1.35,cup:K.cup,bow:K.bow*(1.3-o2),ruf:(K.ruf||0)*(ri?.8:1),rk:K.rk||5,tw:kd==='parrot'?R(-40,40):R(-6,6)});tep.push(S);
    /* satin: gentle light along (the foot in the cup's shade, the tip a little lighter) and across, fine veins, a translucent rim; no sheen */
    F.parts.push(...sheet3(F,S,{pal:cP,palB:cB,nu:kd==='parrot'?9:8,nv:kd==='parrot'?26:16,across:.65,along:v=>-.2*(1-v)*(1-v)+.07*v,ew:.45,eo:.2,edge:cP.d1,
      rim:[Math.max(.5,Dm*.012),.3],veins:TU_VEINS,vw:Math.max(.35,Dm*.006),vo:.16,vlo:.14,cast:1,paint:deco(S,sd++,inner)}),
      ...sheen3(F,S,{side:-1,shin:6,thr:.2,w:W*.6,op:.13,v0:.15,v1:.85}),...(o2>.55?sheen3(F,S,{side:1,shin:6,thr:.22,w:W*.5,op:.1,v0:.3,v1:.85}):[]));
    /* the crystal fringe along the upper margins */
    if(K.fr&&!LOD){const fp=[];for(const su of[-1,1])for(let j=0;j<9;j++){const v=.42+.56*j/8,a=PJ3(F,S(su,v)),b=PJ3(F,S(su*.82,v)),dx=a[0]-b[0],dy=a[1]-b[1],l=Math.hypot(dx,dy)||1,fl=Dm*(.035+.025*Math.sin(j*2.7+sd));fp.push([a,[a[0]+dx/l*fl,a[1]+dy/l*fl]])}
      for(let j=0;j<5;j++){const u=-.8+.4*j,a=PJ3(F,S(u,.99)),b=PJ3(F,S(u,.9)),dx=a[0]-b[0],dy=a[1]-b[1],l=Math.hypot(dx,dy)||1,fl=Dm*.05;fp.push([a,[a[0]+dx/l*fl,a[1]+dy/l*fl]])}
      let z=0;for(const q of fp)z+=q[0][2];z/=fp.length;F.parts.push({z:z+.2,cast:false,fn:pp=>E('path',{d:fp.map(([a,b])=>`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`).join(''),stroke:cw.fr||lt(c,.3),'stroke-width':f(Math.max(.45,Dm*.012)),'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},pp)})}}
  /* stamens round the pistil, seen once the cup opens */
  if(o2>.42&&!LOD){const an=cw.an||(h2l(c)[2]<.35?'#1c1418':'#2a2430'),fil=[],ant=[];for(let i=0;i<6;i++){const a=(i*60+30)*D,cx=Math.cos(a),sy=Math.sin(a);fil.push([[cx*Dm*.04,sy*Dm*.04,Dm*.01],[cx*Dm*.07,sy*Dm*.07,Dm*.12]]);ant.push([[cx*Dm*.07,sy*Dm*.07,Dm*.11],[cx*Dm*.085,sy*Dm*.085,Dm*.2]])}
    const pz=PJ3(F,[0,0,Dm*.12])[2];F.parts.push({z:pz,cast:false,fn:pp=>{const P=q=>PJ3(F,q);E('path',{d:fil.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:'#3a3a34','stroke-width':f(Math.max(.4,Dm*.014)),fill:'none'},pp);
      const pi=tubeFlat(F.B,F.O,[[0,0,0],[0,0,Dm*.1],[0,0,Dm*.18]],Dm*.045,Dm*.04,'#d8dcb0',{ink:'#7a8a50'});pi.fn(pp);const st=P([0,0,Dm*.19]),r=Dm*.03;E('path',{d:`M${f(st[0]-r*1.4)},${f(st[1])}a${f(r*1.4)},${f(r)} 0 1,0 ${f(r*2.8)},0a${f(r*1.4)},${f(r)} 0 1,0 ${f(-r*2.8)},0`,fill:'#efe6b8',stroke:'#a09a60','stroke-width':.35},pp);
      E('path',{d:ant.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:an,'stroke-width':f(Math.max(.8,Dm*.028)),fill:'none','stroke-linecap':'round'},pp)}})}
  render3(F,Dm*.5);return F}
/* the head on its stem, grown by the L-system: the fleshy peduncle rises along the stem, bends little by little toward where the flower looks, wanders a little; the flower at its tip */
function tulipHead(g,t,o,list,kd){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??R(.6,.85))),Dm=(o.cm||6)*UPC,k=G(g),B=frameOf(o,.25),gh=GHI[kd==='simple'?'tulipe-simple':'tulipe-'+kd]||{};
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2],sw=gh.sw||Dm*.1,Lp=Dm*R(1.4,1.8)*(kd==='french'?1.25:1),Lq=B.reach?Math.max(Dm*.7,Math.min(Lp,B.reach*.38)):Lp;
  let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  /* the single tulip in native SVG (y-tulipa.js): its head by svBloom, held nearly upright on its stem (the U seen from the side), its neck lengthening
     and bending as it fades (on the sheets only: in a bouquet the neck keeps the old geometry); the bouquet's chance consumed as before */
  const sv=kd==='simple'&&typeof tulSvgPut==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id,aim=sv?V3.nz(V3.add(V3.sc(ax,.45),V3.sc(up,.85))):ax;
  if(kd==='parrot'&&typeof tulParHead==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return tulParHead(g,t,o,cw,op,Dm,k,B,up,ax,U0,Lq);/* the parrot in native SVG (yz-tulipa-perroquet.js) */
  if(kd==='fringe'&&typeof tulFrgHead==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return tulFrgHead(g,t,o,cw,op,Dm,k,B,up,ax,U0,Lq);/* the fringed tulip in native SVG (yz-tulipa-frangee.js) */
  if(kd==='double'&&typeof tdbHead==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return tdbHead(g,t,o,{cw,op,Dm,k,gh,up,ax,sw,Lq,U0});/* the double tulip in native SVG (yz-tulipa-double.js), the same draws */
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.06,c:gh.sc||TUL_SC}],['F',{l:Lq*.55,w1:sw,aim,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,wig:.035,seg:Dm*.22}),og=res.organs[0];
  if(sv&&typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)tulNeckBend(res,og,tulLife(o));const apex=og.pos;/* the bent neck on the sheets only (y-tulipa.js) */
  lsPlant(k,res,{O:[0,0,0],apex,cols:gh.sc||TUL_SC,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>sv?tulSvgPut(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,o):tulipFlower(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,kd)}]})});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}
const TUL_SC=['#33503a','#56785c','#80a384','#b2cdb0'];
const xTulSim=(g,t,o)=>tulipHead(g,t,o,CW_TSIM,'simple'),xTulFr=(g,t,o)=>tulipHead(g,t,o,CW_TFR,'french'),xTulFrg=(g,t,o)=>tulipHead(g,t,o,CW_TFRG,'fringe'),xTulPar=(g,t,o)=>tulipHead(g,t,o,CW_TPAR,'parrot'),xTulDbl=(g,t,o)=>tulipHead(g,t,o,CW_TDBL,'double');
Object.assign(GH,{'tulipe-simple':xTulSim,'tulipe-francaise':xTulFr,'tulipe-frangee':xTulFrg,'tulipe-perroquet':xTulPar,'tulipe-double':xTulDbl});
Object.assign(CWS,{'tulipe-simple':CW_TSIM,'tulipe-francaise':CW_TFR,'tulipe-frangee':CW_TFRG,'tulipe-perroquet':CW_TPAR,'tulipe-double':CW_TDBL});
Object.assign(SZG,{'tulipe-simple':[5.5,6,6,6.5,7],'tulipe-francaise':[7,7.5,8,8.5],'tulipe-frangee':[6,6.5,7,7.5],'tulipe-perroquet':[10,11,12,13,14],'tulipe-double':[8,9,9,10,11]});
Object.assign(GHI,{'tulipe-simple':{form:'cornet',size:2,k:'head',rk:.95,sw:4,sc:TUL_SC},'tulipe-francaise':{form:'cornet',size:2,k:'head',rk:.95,sw:4.2,sc:TUL_SC},'tulipe-frangee':{form:'cornet',size:2,k:'head',rk:.95,sw:4,sc:TUL_SC,buds:1},
  'tulipe-perroquet':{form:'etoile',size:2.5,k:'head',rk:.85,sw:4.5,sc:TUL_SC},'tulipe-double':{form:'rosette',size:2.5,k:'head',rk:.9,sw:4.5,sc:TUL_SC}});
/* tulip leaves: broad, glaucous, clasping, one or two low on the stem */
for(const id of['tulipe-simple','tulipe-francaise','tulipe-frangee','tulipe-perroquet','tulipe-double'])STEML[id]={shape:'lance',n:[1,2],len:17,w:.3,col:'#6f907a',up:18,arr:'alt',par:1,gloss:.25};
