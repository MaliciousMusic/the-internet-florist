/* ================= Serre, lot 21 — Astéracées d'été, grandies par le L-système : reine-marguerite, tagète, immortelle à bractées, cosmos chocolat, aster vivace ================= */
/* ---------- shared leaves ---------- */
/* a coarsely toothed ovate leaf on a short winged petiole (china aster): one outline, teeth pointing to the tip, the midrib and its side veins */
function dentLeaf(par,x,y,ang,len,col,o={}){const P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),pl=len*.16,bl=len-pl,W=bl*(o.w||.3),ct=Math.cos(o.tilt??R(.25,.6)),nt=o.nt||6,Lt=[],Rt=[];
  for(let i=0;i<=30;i++){const t=i/30,ov=Math.sin(Math.PI*Math.pow(t,.75))*(1-.2*t),ph=(t*nt+.3)%1,th=t>.12&&t<.94?1-.16*(1-ph)*(1-ph):1,w=W*ov*th;Lt.push([pl+bl*t,-w*ct]);Rt.push([pl+bl*t,w*ct*(.95+.08*Math.sin(t*6))])}
  E('path',{d:`M0,0L${f(pl)},0`,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.03)),'stroke-linecap':'round'},g);
  E('path',{d:'M'+Lt.concat(Rt.reverse()).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:toneAt(P,.6),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){let v=`M${f(pl)},0L${f(len*.96)},0`;for(let j=1;j<5;j++){const t=j/5.5,x0=pl+bl*t*.85,x1=pl+bl*Math.min(.96,t+.13),h=W*.72*ct*Math.sin(Math.PI*Math.min(.95,t+.1));v+=`M${f(x0)},0L${f(x1)},${f(-h)}M${f(x0)},0L${f(x1)},${f(h)}`}
    E('path',{d:v,stroke:P.l1,'stroke-width':f(Math.max(.35,len*.012)),'stroke-opacity':.5,fill:'none'},g)}return g}
/* a pinnately cut leaf (marigold, chocolate cosmos): a rachis carrying np pairs of serrate leaflets and one at its tip, all in one outline; dots = the translucent oil glands */
function cutLeaf(par,x,y,ang,len,col,o={}){const P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),ct=Math.cos(o.tilt??R(.2,.55)),np=o.np||5,lw=o.lw||.18,nt=o.teeth||6,sd=o.side??(rnd()<.5?1:-1);let d='',v='',dt='';
  const leaflet=(bx,by,a,l,w)=>{const c=Math.cos(a),s=Math.sin(a),A=[],B2=[];for(let i=0;i<=12;i++){const t=i/12,ph=(t*nt)%1,ww=w*Math.sin(Math.PI*Math.pow(t,.7))*(1-.15*t)*(t>.08&&t<.95?1-.3*(1-ph):1);
      A.push([bx+c*l*t+s*ww,by+(s*l*t-c*ww)*ct]);B2.push([bx+c*l*t-s*ww,by+(s*l*t+c*ww)*ct])}
    d+='M'+A.concat(B2.reverse()).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z';v+=`M${f(bx)},${f(by)}L${f(bx+c*l*.92)},${f(by+s*l*.92*ct)}`;
    if(o.dots&&!LOD)for(let i=1;i<4;i++){const t=.2+.22*i,q=[bx+c*l*t+s*w*.45*(i%2?1:-1),by+(s*l*t-c*w*.45*(i%2?1:-1))*ct];dt+=`M${f(q[0]-.3)},${f(q[1])}a.3,.3 0 1,0 .6,0a.3,.3 0 1,0 -.6,0`}};
  const rl=len*.94;for(let i=0;i<np;i++){const t=.14+.72*i/Math.max(1,np-1),ll=len*(o.ll||.3)*(1-.35*Math.abs(t-.45))*R(.92,1.06);for(const s of[-1,1]){const a=s*(o.la||58)*D*R(.88,1.1)+sd*.08;leaflet(rl*t,0,a,ll,ll*lw)}}
  leaflet(rl,0,R(-.08,.08),len*(o.ll||.3)*.85,len*(o.ll||.3)*.85*lw);
  E('path',{d,fill:toneAt(P,.58),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  E('path',{d:`M0,0L${f(rl)},0`+(LOD?'':v),stroke:P.d1,'stroke-width':f(Math.max(.45,len*.018)),'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},g);if(dt)E('path',{d:dt,fill:P.l2,opacity:.55},g);return g}
/* the back of a receptacle, seen from behind: it closes the ring of ray bases */
function capBack(k,B,O,r,col){E('path',{d:smooth(spDisc(B,O,r,-r*.12,12)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.35,'stroke-opacity':.6},k)}
/* ---------- china aster (Callistephus chinensis): single (one ring of rays round a big yellow disc), Matsumoto (semi-double, the disc still showing), pompon (a ball of short quilled rays), plume / ostrich (long curled, twisted rays);
   leafy green involucral bracts, round buds in them, coarsely toothed leaves, a hairy branched stem ---------- */
const CW_RM=[{id:'violet',n:'Violet (Matsumoto)',c:'#5c4fa6',t:'mat'},{id:'bleu-nuit',n:'Bleu nuit (Matsumoto)',c:'#3f3a92',t:'mat'},{id:'lavande',n:'Bleu lavande (Matsumoto)',c:'#b9a6dc',t:'mat'},
  {id:'rose',n:'Rose (Matsumoto)',c:'#e889ac',t:'mat'},{id:'blanc',n:'Blanc (Matsumoto)',c:'#f6f3ea',t:'mat'},{id:'rouge',n:'Rouge écarlate (Matsumoto)',c:'#b8202e',t:'mat'},
  {id:'abricot',n:'Abricot (Matsumoto)',c:'#f2b07a',t:'mat'},{id:'jaune',n:'Jaune pâle (Matsumoto)',c:'#f0dc90',t:'mat'},{id:'pompon-rose',n:'Rose (pompon)',c:'#f0a6c4',t:'pom'},
  {id:'pompon-blanc',n:'Blanc (pompon)',c:'#f7f4ec',t:'pom'},{id:'pompon-cramoisi',n:'Cramoisi (pompon)',c:'#8a1434',t:'pom'},{id:'plume-violet',n:'Violet (plume)',c:'#6a3a9a',t:'plu'},
  {id:'plume-rose',n:'Rose (plume)',c:'#e4a0c0',t:'plu'},{id:'plume-blanc',n:'Blanc (plume)',c:'#f6f2ea',t:'plu'},{id:'simple-bleu',n:'Bleu lavande (simple)',c:'#9a90d8',t:'sim'},{id:'simple-rose',n:'Rose (simple)',c:'#ee9cbc',t:'sim'}];
const RM_RAY=prof([[0,.4],[.25,.85],[.7,1],[1,.78]]);
/* the leafy involucre: green bracts spreading under the head */
function rmInvol(k,B,O,R0){capBracts(k,B,O,R0*.5,12,'#4f7a3a',{len:.62,w:.17,a0:1.75,a1:2.25})}
function rmFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),t=cw.t,lo=DET<1.5||LOD;if(nz<.45&&nz>=0)rmInvol(k,B,O,R0);
  const ray=(c,P,noov)=>it.push({l:ligule(B,O,P),c:mix(c,shd(c,R(-.1,.06)),.5),noov});
  if(t==='sim'||t==='mat'){const rows=t==='sim'?1:lo?2:3;for(let w=0;w<rows;w++){const n=Math.round((t==='sim'?22:24-3*w)*(lo?.8:1));for(let i=0;i<n;i++)
      ray(cw.c,{phi:i/n*6.283+rot+w*.37+R(-.06,.06),r0:R0*(t==='sim'?.28:.25-.05*w),z0:R0*.03*w,L:R0*(t==='sim'?.72:.75-.15*w)*R(.92,1.05),W:R0*(t==='sim'?.1:.1-.01*w),wp:RM_RAY,a0:.45+.9*o2-.4*w,a1:.7+1*o2-.55*w,pw:1.3,th:.35,tip:'fringe',fr:2,fd:.16,wav:.08,n:5,tw:R(-.25,.25)},w>0||(lo&&i%2))}
    drawLig(k,it);if(nz>-.2)capDisc(k,B,O,R0*(t==='sim'?.27:.21),R0*(.06+.06*o2),'#e8b520',{dots:lo?0:44,dc:'#9a6a14'})}
  else if(t==='pom'){if(nz>-.2)capDisc(k,B,O,R0*.18,R0*.3*(.6+.4*o2),shd(cw.c,-.12),{dots:0});const N=Math.round(70*(lo?.6:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.75),a0=.1+1.3*fo*(.45+.55*o2);
      ray(cw.c,{phi:i*2.39996+rot,r0:R0*(.03+.13*fr),z0:R0*.34*(1-fr)*(.6+.4*o2),L:R0*(.22+.4*Math.pow(fr,.7))*(.7+.3*o2),W:R0*(.11+.04*fr),wp:prof([[0,.5],[.4,1],[1,.85]]),a0,a1:a0-.3-.2*fo,pw:1.3,th:-1.7,tip:'round',n:4,tw:R(-.2,.2)},fr<(lo?.7:.55))}
    drawLig(k,it,{back:cw.c})}
  else{/* plume: long, broad-ish rays rolled at the margins, twisted, the outer ones drooping, the inner ones curling in over the heart */
    if(nz>-.2)capDisc(k,B,O,R0*.16,R0*.18,shd(cw.c,-.15),{dots:0});const N=Math.round(56*(lo?.65:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,a0=.2+1.1*fr*(.4+.6*o2),cu=fr<.4?-1.1:fr<.7?-.2:.75;
      ray(cw.c,{phi:i*2.39996+rot,r0:R0*(.04+.12*fr),z0:R0*.22*(1-fr),L:R0*(.4+.55*fr)*(.7+.3*o2)*R(.9,1.08),W:R0*.1,wp:prof([[0,.55],[.3,1],[.75,.85],[1,.35]]),a0,a1:a0+cu*(.5+.5*o2),pw:1.6,th:-.7,tip:'round',wav:.25,wk:3,n:6,tw:R(-2.2,2.2)},fr<(lo?.55:.35))}
    drawLig(k,it,{back:mix(cw.c,'#f4f0ec',.2)})}
  if(nz<0){capBack(k,B,O,R0*.3,'#4f7a3a');rmInvol(k,B,O,R0)}return k}
function rmPlant(g,t,o){const cw=o.cw||cwNear(CW_RM,o.col)||CW_RM[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||8)*UPC,k=G(g),sc=['#2f4a26','#4f7434','#739852','#a6c282'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.045,cols:sc,op,rr:.5,nodes:2,li:.75,lp:1.3,opp:0,leafAng:50,side:{p:cw.t==='mat'?.85:.5,n:1,top:2,len:.95,ang:34,age:[0,.9]},budD:.3,budMax:.42,wig:.035,e:.04,
    flower:(par,B,O,D2,op2)=>{if(op2<.3)capBud(par,B,O,D2*.3,cw.c,.55,'#4f7a3a');else rmFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a,'#4f7a3a'),young:(par,B,O,s,a)=>rmFlower(par,B,O,s*1.05,cw,.4+.6*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(.6,.8),(par,x,y,a,l)=>dentLeaf(par,x,y,a,l,'#4a7434'))});
  open(k,t,1000,10,.3);return r}
/* ---------- marigold (Tagetes erecta: a fully double ball of ruffled florets on a swollen peduncle; T. patula: smaller crested heads, mahogany with gold, or single with a blotch);
   the involucre a ribbed green tube with pointed teeth, finely cut aromatic leaves dotted with oil glands ---------- */
const CW_TAG=[{id:'orange',n:'Orange (erecta)',c:'#ef821e',t:'er'},{id:'or',n:'Jaune d’or (erecta)',c:'#f6b51e',t:'er'},{id:'citron',n:'Jaune citron (erecta)',c:'#f5cf38',t:'er'},
  {id:'mandarine',n:'Orange foncé (erecta)',c:'#df5e1a',t:'er'},{id:'vanille',n:'Vanille (erecta)',c:'#f2ebc6',t:'er'},{id:'acajou',n:'Acajou liseré d’or (patula)',c:'#7a2a1e',edge:'#f2b51e',crest:'#e8901e',t:'pa'},
  {id:'arlequin',n:'Acajou rayé d’or (Harlequin)',c:'#8a2a18',streak:'#f2b030',crest:'#f2a620',t:'pa'},{id:'bolero',n:'Orange flammé d’acajou (patula)',c:'#e88a1e',streak:'#8a2a14',crest:'#d8701a',t:'pa'},
  {id:'marietta',n:'Jaune à cœur acajou (simple)',c:'#f5c518',blot:'#7a1a10',t:'p1'}];
const TAG_FAN=prof([[0,.32],[.3,.8],[.7,1],[1,.95]]);
/* the involucre: a ribbed cylinder of fused bracts ending in short teeth */
function tagCup(k,B,O,r,h,lo){const pts=[];for(let i=0;i<=5;i++)for(let j=0;j<12;j++){const v=i/5,a=j/12*6.283,rr=r*(.42+.58*Math.sin(Math.PI*.5*Math.min(1,.15+v)));const p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,-h*(1-v)]);pts.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(pts)),fill:budFill('#5f8a3a'),stroke:'#2e4a22','stroke-width':.4,'stroke-opacity':.6},k);if(lo)return;
  let d='';for(let j=0;j<7;j++){const a=j/7*6.283,n0=toV(B,[Math.cos(a),Math.sin(a),0]);if(n0[2]<.05)continue;const p0=PJ(B,O,[Math.cos(a)*r*.5,Math.sin(a)*r*.5,-h*.92]),p1=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,0]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
  if(d)E('path',{d,stroke:'#3a5a2a','stroke-width':.5,'stroke-opacity':.6,fill:'none'},k)}
function tagBud(par,B,O,s,cw,a){const k=G(par),h=s*1.1,r=s*.36,it=[];tagCup(k,B,V3.add(O,toV(B,[0,0,h*.15])),r,h,LOD||DET<1.5);
  for(let i=0;i<5;i++)it.push({l:ligule(B,O,{phi:i/5*6.283+.3,r0:r*.85,z0:h*.1,L:s*.2,W:r*.42,wp:prof([[0,1],[.6,.6],[1,.05]]),a0:.2,a1:.05,tip:'point',th:.4,n:3}),c:'#5f8a3a',ink:'#2e4a22'});if(a<.15){drawLig(k,it);return k}
  for(let i=0;i<7;i++)it.push({l:ligule(B,O,{phi:i/7*6.283+R(-.2,.2),r0:r*.3,z0:h*.12,L:s*(.25+.3*a),W:r*.6,wp:TAG_FAN,a0:.15+.25*a,a1:-.1,pw:1.2,th:.6,tip:'fringe',fr:3,fd:.4,wav:.3,n:4}),c:cw.c,noov:1});drawLig(k,it);return k}
function tagFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,cup=()=>tagCup(k,B,O,R0*.26,R0*.55,lo);if(nz<.5&&nz>=0)cup();
  if(cw.t==='er'){const N=Math.round(96*(lo?.55:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.85),a0=.05+1.45*fo*(.45+.55*o2),c=mix(cw.c,shd(cw.c,-.1),(1-fr)*.6);
      it.push({l:ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.03+.16*fr),z0:R0*.5*(1-Math.pow(fr,1.5))*(.6+.4*o2),L:R0*(.26+.46*Math.pow(fr,.7))*(.72+.28*o2),W:R0*(.15+.1*fr),wp:TAG_FAN,a0,a1:a0-.2-.15*fo,pw:1.3,th:.9,tip:'fringe',fr:3,fd:.35,wav:.5,wk:4,n:5,tw:R(-.3,.3)}),c:mix(c,shd(c,R(-.08,.06)),.5),noov:fr<.45})}
    drawLig(k,it,{back:mix(cw.c,'#f2e8c8',.25)})}
  else if(cw.t==='pa'){const n=Math.round(11*(lo?.8:1));for(let i=0;i<n;i++)it.push({l:ligule(B,O,{phi:i/n*6.283+rot+R(-.08,.08),r0:R0*.22,z0:0,L:R0*.74*R(.94,1.04),W:R0*.32,wp:prof([[0,.35],[.3,.85],[.7,1],[1,.8]]),a0:.7+.75*o2,a1:.95+.75*o2,pw:1.3,th:.35,tip:'fringe',fr:3,fd:.25,wav:.3,wk:3,n:6,tw:R(-.2,.2)}),c:cw.c,edge:cw.edge,ew:5,ewd:Math.max(.7,R0*.05),streak:cw.streak});
    const N=Math.round(34*(lo?.6:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,a0=.05+1.05*fr*(.5+.5*o2);it.push({l:ligule(B,O,{phi:i*2.39996+rot,r0:R0*.06*fr,z0:R0*.3*(1-fr),L:R0*(.2+.2*fr),W:R0*.14,wp:TAG_FAN,a0,a1:a0-.3,pw:1.2,th:.9,tip:'fringe',fr:3,fd:.4,wav:.5,n:4,tw:R(-.3,.3)}),c:mix(cw.crest,cw.c,fr*.5),noov:1})}
    drawLig(k,it)}
  else{const items=[];for(let i=0;i<5;i++){const l=ligule(B,O,{phi:i/5*6.283+rot,r0:R0*.12,z0:0,L:R0*.84,W:R0*.52,wp:prof([[0,.3],[.3,.85],[.65,1],[1,.85]]),a0:.6+.8*o2,a1:.9+.75*o2,pw:1.3,th:.3,tip:'fringe',fr:3,fd:.2,wav:.15,n:6,tw:R(-.2,.2)});items.push({l,c:cw.c,lift:.25,basec:cw.blot,bf:.42,bo:.9})}
    spPetals(k,items,{});if(nz>-.2)capDisc(k,B,O,R0*.16,R0*.08,'#c8901a',{dots:lo?0:20,dc:'#6a3a10'})}
  if(nz<0)cup();return k}
function tagPlant(g,t,o){const cw=o.cw||cwNear(CW_TAG,o.col)||CW_TAG[0],op=Math.max(.05,Math.min(1,o.op??1)),er=cw.t==='er',D0=(o.cm||9)*UPC*(er?1:.55),k=G(g),sc=['#2e4a22','#4a7034','#6e9450','#a2bc80'];
  const r=lsHeadS(k,o,{D:D0,w:D0*(er?.075:.06),cols:sc,op,rr:.5,nodes:2,li:er?.95:.8,lp:er?1.2:1.1,opp:0,leafAng:50,side:{p:er?.55:.8,n:1,top:2,len:er?.6:1.2,ang:30,age:[0,.8]},budD:er?.32:.4,budMax:.45,wig:.03,e:.03,
    flower:(par,B,O,D2,op2)=>{if(op2<.3)tagBud(par,B,O,D2*.36,cw,.4);else tagFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>tagBud(par,B,O,s,cw,a),young:(par,B,O,s,a)=>tagFlower(par,B,O,s*1.1,cw,.4+.6*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(er?.85:1.2,er?1.1:1.5),(par,x,y,a,l)=>cutLeaf(par,x,y,a,l,'#3f6a2c',{np:6,lw:.16,ll:.3,teeth:7,dots:1}))});
  open(k,t,1000,10,.3);return r}
/* ---------- strawflower (Xerochrysum bracteatum): rows of papery, glossy, rigid bracts in concentric rosettes round a yellow disc; the bud a globe of incurved scales;
   lanceolate grey-green leaves, a branched stem ---------- */
const CW_XER=[{id:'or',n:'Jaune d’or',c:'#eab83a'},{id:'citron',n:'Jaune citron',c:'#f2d64a'},{id:'orange',n:'Orange',c:'#ef8a2a'},{id:'abricot',n:'Abricot',c:'#f0a060'},{id:'saumon',n:'Saumon',c:'#ee9a7a'},
  {id:'rose',n:'Rose',c:'#e7889e'},{id:'rose-pale',n:'Rose pâle',c:'#f2c4cc'},{id:'rose-pointe',n:'Rose pâle pointé de rouge',c:'#f4cad0',edge:'#b8203a'},{id:'rouge',n:'Rouge',c:'#b2422e'},
  {id:'cramoisi',n:'Cramoisi',c:'#8a2040'},{id:'pourpre',n:'Pourpre',c:'#7a2a62'},{id:'blanc',n:'Blanc argenté',c:'#efebe0'},{id:'bronze',n:'Bronze',c:'#a8642a',disc:'#c8902a'}];
const XER_BR=prof([[0,.55],[.3,.95],[.6,1],[.85,.7],[1,.2]]);
function xeroHead(par,B,O,D0,cw,op){const k=G(par),o2=sm01((op-.12)/.88),R0=D0/2*(.55+.45*o2),nz=B[2][2],lo=DET<1.5||LOD,it=[],rot=R(0,6.28),bud=o2<.25,rows=lo?3:5,disc=cw.disc||'#e2b42a';
  if(nz<.4&&o2>.2)capBracts(k,B,O,R0*.4,9,'#7a8a5a',{len:.4,w:.14,a0:1.9,a1:2.3});
  /* w: the row's place from the outside (0) to the inside (4), whatever the number of rows */
  for(let r=0;r<rows;r++){const fr=r/(rows-1),w=fr*4,n=Math.round((14-1.2*w)*(lo?(bud?.75:.95):1)),ow=sm01(o2*1.5-fr*.55),c=mix(cw.c,mix(cw.c,'#c8a870',.35),(1-fr)*.5);
    /* closed: incurved scales over the top of a globe; open: straight rigid bracts, the outer ones spread flat, the inner ones cupped round the disc */
    const ac=1.35-.24*w,a0=ac+(1.45-.2*w-ac)*ow,a1=a0+(-1.55+.12*w)*(1-ow)+(.18-.1*w)*ow,L=R0*((.36+.07*w)*(1-ow)+(.42+.03*w)*ow)*R(.95,1.04);
    for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+w*.41+R(-.05,.05),r0:R0*(.3-.03*w)*(.7+.3*ow),z0:R0*.05*w*(1-.5*ow),L,W:R0*(.2-.015*w),wp:XER_BR,a0,a1,pw:1.2,th:.75,tip:ow<.5?'round':'point',n:5,tw:R(-.15,.15)});
      it.push({l,c,edge:cw.edge,ew:3,ewd:Math.max(.6,R0*.05),mid:!lo||(w<2.5&&!bud)?lt(c,.6):null,mw:Math.max(.45,R0*.035),noov:lo})}}
  drawLig(k,it,{back:'#d8c8a0'});
  /* a bud seen from above: the tips of the inner scales meet over a little closed boss */
  if(o2<.3&&nz>.2){const w=4,ow=sm01(o2*1.5-.55),ac=1.35-.24*w,a0=ac+(1.45-.2*w-ac)*ow,a1=a0+(-1.55+.12*w)*(1-ow),L=R0*.36+R0*.07*w;let x=R0*(.3-.03*w)*(.7+.3*ow),z=R0*.05*w;for(let i=1;i<=5;i++){const a=a0+(a1-a0)*Math.pow(i/5,1.2);x+=Math.sin(a)*L/5;z+=Math.cos(a)*L/5}
    capDisc(k,B,V3.add(O,toV(B,[0,0,z-R0*.03])),Math.max(R0*.1,Math.abs(x)*1.15),R0*.05,mix(cw.c,shd(cw.c,-.12),.5),{dots:0})}if(nz<0)capBack(k,B,O,R0*.17,'#a89868');if(nz>-.2&&o2>.35)capDisc(k,B,O,R0*.3,R0*.12,disc,{dots:lo?0:40,dc:shd(disc,-.45)});return k}
function xeroPlant(g,t,o){const cw=o.cw||cwNear(CW_XER,o.col)||CW_XER[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||4.5)*UPC,k=G(g),sc=['#3a4a2c','#5a6a44','#7f8c64','#aab490'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.06,cols:sc,op,rr:.5,nodes:2,li:.9,lp:1.5,opp:0,leafAng:42,side:{p:.85,n:1,top:2,len:1.4,ang:28,age:[0,.9]},budD:.55,budMax:.5,wig:.035,e:.03,
    flower:(par,B,O,D2,op2)=>xeroHead(par,B,O,D2,cw,op2),bud:(par,B,O,s,a)=>xeroHead(par,B,O,s*1.6,cw,.06+.25*a),young:(par,B,O,s,a)=>xeroHead(par,B,O,s*1.15,cw,.35+.65*a),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),D0*R(1.1,1.4),.2,'#6a7a52',pp,{wp:LS_LANCE,droop:.18,arch:.06,fold:.25,face:.4});return pp}});
  open(k,t,1000,10,.3);return r}
/* ---------- chocolate cosmos (Cosmos atrosanguineus): eight broad velvety rays, brown-maroon, toothed at the tip, round a dark raised disc; outer bracts spread under the head;
   very long thin reddish peduncles, a bud on a side shoot, pinnate leaves low on the stem ---------- */
const CW_CHOC=[{id:'chocolat',n:'Chocolat',c:'#4a1a16',disc:'#2a0c0a'},{id:'chocamocha',n:'Brun moka (Chocamocha)',c:'#54261c',disc:'#2c100a'},{id:'noir',n:'Noir chocolat (Black Chocolate)',c:'#2a0e10',disc:'#170708'},{id:'bordeaux',n:'Bordeaux velours',c:'#5e1a20',disc:'#300a0e'}];
const CHOC_RAY=prof([[0,.3],[.2,.74],[.6,1],[1,.9]]);
function chocFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),items=[],rot=R(0,6.28),lo=DET<1.5||LOD,c0=cw.c,br=()=>capBracts(k,B,O,R0*.34,8,'#56603a',{len:.55,w:.18,a0:1.8,a1:2.2});if(nz<.45&&nz>=0)br();
  for(let i=0;i<8;i++){const l=ligule(B,O,{phi:i/8*6.283+rot+R(-.07,.07),r0:R0*.2,z0:0,L:R0*.76*R(.95,1.04),W:R0*.29,wp:CHOC_RAY,a0:.5+.75*o2,a1:.75+.8*o2,pw:1.3,th:.4,tip:'fringe',fr:3,fd:.16,wav:.03,wk:3,n:6,tw:R(-.15,.15)}),c=mix(c0,shd(c0,R(-.08,.1)),.5);
    /* velvet: dark where it faces the light, a pale sheen along the margins, a darker throat, fine ridges */
    items.push({l,c,cb:mix(c,'#6a3a3a',.3),lift:0,ink:mix(c,'#b08a80',.3),sw:.5,eo:.6,basec:lo?null:shd(c,-.4),bf:.38,bo:.7});
    if(!lo&&l.nm[2]>0)items.push({z:l.z+1e-4,fn:par2=>{let d='';for(const j of[1,2,3]){const q=l.S.slice(1,-1).map(r=>[r[j][0],r[j][1]]);d+=smooth(q,false)}E('path',{d,stroke:shd(c,-.45),'stroke-width':.35,'stroke-opacity':.45,fill:'none'},par2)}})}
  spPetals(k,items,{});if(nz>-.2)capDisc(k,B,O,R0*.24,R0*(.08+.07*o2),cw.disc,{dots:lo?0:44,dc:'#7a2a1c'});if(nz<0){capBack(k,B,O,R0*.24,'#56603a');br()}return k}
function chocPlant(g,t,o){const cw=o.cw||cwNear(CW_CHOC,o.col)||CW_CHOC[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||4)*UPC,k=G(g),sc=['#3a2418','#5a3c28','#7a5a3a','#a08460'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.035,cols:sc,op,rr:.5,nodes:1,li:1.4,lp:2.8,opp:1,leafAng:50,side:{p:.6,n:1,top:1,len:2.2,ang:24,age:[0,.7]},budD:.32,budMax:.45,wig:.06,e:.04,aimK:.2,
    flower:(par,B,O,D2,op2)=>{if(op2<.3)capBud(par,B,O,D2*.3,cw.c,.5,'#56603a');else chocFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a,'#56603a'),young:(par,B,O,s,a)=>chocFlower(par,B,O,s*1.15,cw,.4+.6*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(.9,1.15),(par,x,y,a,l)=>cutLeaf(par,x,y,a,l,'#3a5a2a',{np:2,lw:.36,ll:.42,teeth:3,la:50}))});
  open(k,t,1000,10,.3);return r}
/* ---------- perennial aster (Symphyotrichum: S. pilosum var. pringlei, S. ericoides, novi-belgii hybrids): a branched panicle of small heads (2 to 4 cm), fine rays round a yellow eye
   turning brown with age, many buds, small narrow leaves along the branches. Light by design: in the bouquet a head is two paths (its rays, its eye), a bud one ---------- */
const CW_AST=[{id:'blanc',n:'Blanc (Monte Cassino)',c:'#f6f4ec'},{id:'lavande',n:'Lavande',c:'#b7a3db'},{id:'mauve',n:'Mauve',c:'#a682c4'},{id:'rose',n:'Rose',c:'#eaa0c2'},{id:'rose-vif',n:'Rose vif',c:'#c64e8a'},
  {id:'bleu',n:'Bleu violet',c:'#7466c0'},{id:'violet',n:'Violet',c:'#7e3a8a'}];
function astHead(par,B,O,D0,cw,age){const R0=D0/2,nz=B[2][2],o2=sm01((age-.35)/.65),disc=mix('#e5b830','#a8582a',sm01((age-.8)/.2)*.8),c=cw.c,a0=.3+1.1*o2,a1=a0+.15+.2*o2,lite=h2l(c)[2]>.82;
  if(DET>=1.5&&!LOD){const k=G(par),it=[],rot=R(0,6.28),n=26;for(let i=0;i<n;i++)it.push({l:ligule(B,O,{phi:i/n*6.283+rot+R(-.05,.05),r0:R0*.25,z0:0,L:R0*.75*R(.9,1.06),W:R0*.07,wp:prof([[0,.5],[.3,1],[.8,.9],[1,.5]]),a0,a1,pw:1.2,th:.2,tip:'round',n:4,tw:R(-.3,.3)}),c:mix(c,shd(c,R(-.1,.06)),.5),ink:lite?shd(c,-.45):null,noov:1});
    drawLig(k,it);if(nz<0)capBack(k,B,O,R0*.26,'#56683a');if(nz>-.2)capDisc(k,B,O,R0*.26,R0*.12,disc,{dots:14,dc:shd(disc,-.4)});return k}
  /* light: every ray a slim wedge, all of them one path toned by the facing of the head; the eye one more */
  const back=nz<0,P=pal7(back?mix(c,'#e8e4d8',.25):c),I=lightI(back?V3.sc(B[2],-1):B[2]),rot=R(0,6.28),n=21;let d='';
  for(let i=0;i<n;i++){const ph=i/n*6.283+rot,cs=Math.cos(ph),sn=Math.sin(ph),T=[-sn*R0*.085,cs*R0*.085,0],dir=[cs*Math.sin(a0),sn*Math.sin(a0),Math.cos(a0)],dir2=[cs*Math.sin(a1),sn*Math.sin(a1),Math.cos(a1)],b=[cs*R0*.22,sn*R0*.22,0],m=V3.add(b,V3.sc(dir,R0*.42)),e=V3.add(m,V3.sc(dir2,R0*.36));
    const q=[V3.add(b,V3.sc(T,.4)),V3.add(m,T),V3.add(e,V3.sc(T,.55)),V3s(e,V3.sc(T,.55)),V3s(m,T),V3s(b,V3.sc(T,.4))].map(p=>PJ(B,O,p));d+='M'+q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}
  E('path',{d,fill:toneAt(P,I),stroke:lite?shd(c,-.45):P.d1,'stroke-width':.25,'stroke-opacity':lite?.75:.5},par);if(back)E('path',{d:smooth(spDisc(B,O,R0*.26,-R0*.03,9)),fill:'#56683a'},par);else if(nz>-.1)E('path',{d:smooth(spDisc(B,O,R0*.24,R0*.08,9)),fill:disc,stroke:shd(disc,-.45),'stroke-width':.3},par);return par}
function astBud(par,B,O,s,cw,a){spBud(par,B,V3.add(O,toV(B,[0,0,-s*.4])),s,s*.85,mix('#5f8a3a',cw.c,.08+.5*a),{tp:.3,pw:.55});return par}
const AST_LF=prof([[0,.3],[.2,.85],[.5,1],[.8,.6],[1,.05]]);
function astLeaf(par,x,y,ang,len,col){const P=pal7(col),c=Math.cos(ang),s=Math.sin(ang),ct=R(.45,.85),A=[],B2=[];for(let i=0;i<=6;i++){const t=i/6,w=len*.1*AST_LF(t)*ct;A.push([x+c*len*t-s*w,y+s*len*t+c*w]);B2.push([x+c*len*t+s*w,y+s*len*t-c*w])}
  return E('path',{d:smooth(A.concat(B2.reverse())),fill:toneAt(P,R(.45,.65)),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.5},par)}
function astPlant(g,t,o){const cw=o.cw||cwNear(CW_AST,o.col)||CW_AST[0],op=Math.max(.05,Math.min(1,o.op??1)),Hs=(o.cm||30)*UPC*(o.rim?.4:1),dh=2.8*UPC,k=G(g),sc=['#33402a','#56683a','#7a8c58','#a8b888'];
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.3,B.reach*.45/(Hs*.45))):1,L=Hs*kr,nb=o.rim?3:Math.round(R(6,8)),mid=nb>>1,pOpen=op<.3?.04:op<.7?.42:.64;
  const age=()=>rnd()<pOpen?R(.55,1):R(0,op<.3?.3:.4),hd=a=>[a>.35?'K':'Kb',{age:a}];
  /* S: the bare stem; B(i): the main axis, a branch at each node, shorter toward the top (a cone); C: a branch, alternate pedicels along it; P: a pedicel ending in a head, forking once into a little cluster */
  const rules={S:()=>[['F',{l:L*.3,w0:dh*.17,w1:dh*.14,e:.015}],['B',{i:0}]],
    B:p=>{if(p.i>=nb)return[['F',{l:L*.06,w1:Math.max(1.05,dh*.06)}],['P',{d:0}]];const q=p.i/nb,bl=L*(.34-.2*q)*R(.85,1.15);
      return[['F',{l:L*(.42/nb)*R(.8,1.2),w1:dh*(.14-.07*q)}],...(p.i===mid?[['Ap',{}]]:[]),['Lv',{s:1}],['[',{w:dh*(.08-.03*q)}],['/',{a:137.5*p.i+R(-20,20)}],['&',{a:R(34,50)}],['C',{l:bl,n:Math.max(2,Math.round(R(3,5)*(1-.35*q)))}],[']',{}],['B',{i:p.i+1}]]},
    C:p=>{const out=[],m=p.n;for(let j=0;j<m;j++)out.push(['F',{l:p.l/(m+1),w1:Math.max(1.05,dh*.05),e:.05}],['Lv',{s:.6}],['[',{w:Math.max(1.05,dh*.035)}],['/',{a:(j%2?100:-100)+R(-25,25)}],['&',{a:R(28,46)}],['P',{d:0}],[']',{}]);
      out.push(['F',{l:p.l/(m+1),w1:Math.max(1.05,dh*.04)}],['P',{d:1}]);return out},
    P:p=>{const fk=p.d<1&&rnd()<.75;return[['F',{l:dh*R(.6,1.2),w1:Math.max(1.05,dh*.03),e:.05}],...(fk?[['[',{w:Math.max(1.05,dh*.025)}],['/',{a:R(-180,180)}],['&',{a:R(30,50)}],['F',{l:dh*R(.5,1),w1:Math.max(1.05,dh*.022),e:.05}],hd(age()),[']',{}]]:[]),
      ...(fk&&rnd()<.5?[['[',{w:Math.max(1.05,dh*.025)}],['/',{a:R(-180,180)}],['&',{a:R(35,55)}],['F',{l:dh*R(.4,.9),w1:Math.max(1.05,dh*.02),e:.05}],hd(age()),[']',{}]]:[]),hd(age())]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,nb+5),{p:[0,0,0],H:up,U:U0,wig:.05,seg:dh*.5,T:[0,1,0],e:.02,w:dh*.17});for(const ch of res.chains)ch.c=sc;
  const ap=res.organs.find(q=>q.t==='Ap')||res.organs.find(q=>q.t==='K'),apex=ap.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:8,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=faceFrame(og,face,.55),s=dh*R(.85,1.12);return{parts:[{z:pos[2],fn:par=>astHead(par,Bf,pos,s,cw,og.p.age)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,0),s=dh*(.22+.2*og.p.age);return{parts:[{z:pos[2],fn:par=>astBud(par,Bf,pos,s,cw,og.p.age/.35)}]}}
    if(og.t==='Lv'){const s=og.p.s,sd=rnd()<.5?1:-1,H=V3.nz(V3.add(og.H,V3.sc(og.L,sd*1.2))),len=dh*R(.9,1.5)*s;return{ext:s>.8,parts:[lsLeaf2D(Object.assign({},og,{H}),pos,len,(par,x,y,a,l)=>astLeaf(par,x,y,a,l,'#56703a'))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
Object.assign(GH,{'reine-marguerite':rmPlant,'tagete-oeillet-d-inde':tagPlant,'immortelle-xerochrysum':xeroPlant,'cosmos-chocolat':chocPlant,'aster-vivace-symphyotrichum':astPlant});
Object.assign(CWS,{'reine-marguerite':CW_RM,'tagete-oeillet-d-inde':CW_TAG,'immortelle-xerochrysum':CW_XER,'cosmos-chocolat':CW_CHOC,'aster-vivace-symphyotrichum':CW_AST});
Object.assign(SZG,{'reine-marguerite':[6,7,8,9,10],'tagete-oeillet-d-inde':[6,7,8,9,10],'immortelle-xerochrysum':[3.5,4,4.5,5,6],'cosmos-chocolat':[3.5,4,4,4.5],'aster-vivace-symphyotrichum':[24,28,30,34]});
Object.assign(GHI,{'reine-marguerite':{form:'disque',size:2,k:'head',rk:1},'tagete-oeillet-d-inde':{form:'sphere',size:2,k:'head',rk:.95},'immortelle-xerochrysum':{form:'disque',size:1.6,k:'head',rk:1},
  'cosmos-chocolat':{form:'disque',size:1.6,k:'head',rk:1},'aster-vivace-symphyotrichum':{form:'grappe',size:2.5,k:'head',rk:.5}});
for(const id of['reine-marguerite','tagete-oeillet-d-inde','immortelle-xerochrysum','cosmos-chocolat','aster-vivace-symphyotrichum'])GH_BUDS.add(id);
