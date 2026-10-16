/* ================= Serre, lot 52 — Protéacées 2, poussées par le L-système (moteur du lot 16) : banksias, protée duchesse, protée reine, protée à feuilles de laurier-rose, protée sucrière ================= */
/* ---------- shared: a leathery leaf whose margin is cut into teeth (banksias): the blade of lsLeafS sampled row by row, a notch then a tooth leaning toward the apex at every step of the margin;
   the outline is taken, row by row, from the extreme points across the midrib (as protLeaf does), so the teeth shrink with the blade seen edge on ---------- */
function l52Leaf(og,pos,len,wr,col,o={}){const H=og.H,S=lsLeafS({pos,H,U:og.U,L:og.L},len,wr,{wp:o.wp||LS_LANCE,droop:o.droop??.05,arch:o.arch??.06,fold:o.fold??.12,face:o.face??.3,tw:o.tw??R(-.3,.3)}),
    nt=LOD?Math.min(o.teeth||0,6):o.teeth||0,v0=o.t0??.12,td=o.td??.3,P3=p=>[p[0],-p[1],p[2]],US=[-1,-.5,0,.5,1],e=.03,rows=[];
  if(nt){for(let i=0;i<4;i++)rows.push([v0*i/4,1]);const st=(1-v0)/nt;for(let j=0;j<nt;j++){rows.push([v0+(j+.1)*st,1-td*(o.tdk?o.tdk(j/nt):1)]);rows.push([v0+(j+.85)*st,1])}rows.push([1,1])}
  else{const nv=LOD?4:DET>=1.5?10:6;for(let i=0;i<=nv;i++)rows.push([i/nv,1])}
  const nv=rows.length-1,scr=[],nrm=[];
  for(const[v]of rows){scr.push(US.map(u=>P3(S(u,v))));const du=V3s(S(.1,v),S(-.1,v)),dv=V3s(S(0,Math.min(1,v+e)),S(0,Math.max(0,v-e))),n=V3.cr(du,dv);nrm.push(V3l(n)>1e-9?V3.nz(n):null)}
  for(let i=0;i<=nv;i++)if(!nrm[i])nrm[i]=nrm[i-1]||nrm[i+1]||[0,0,1];
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=scr[Math.max(0,i-1)][2],b=scr[Math.min(nv,i+1)][2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),px=l<1e-6?1:-dy/l,py=l<1e-6?0:dx/l,c=scr[i][2],dk=rows[i][1];
    let mn=1e9,mx=-1e9,ql=scr[i][0],qr=scr[i][4];for(const q of scr[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;ql=q}if(s>mx){mx=s;qr=q}}
    Lf.push([c[0]+(ql[0]-c[0])*dk,c[1]+(ql[1]-c[1])*dk]);Rt.push([c[0]+(qr[0]-c[0])*dk,c[1]+(qr[1]-c[1])*dk])}
  const up=i=>nrm[i][2]<0,bands=[];let a0=0,cur=up(0);for(let i=1;i<=nv;i++){const u=up(i);if(u!==cur){bands.push([a0,i,cur]);a0=i;cur=u}}bands.push([a0,nv,cur]);
  const sil=(i0,i1)=>Lf.slice(i0,i1+1).concat(Rt.slice(i0,i1+1).reverse());
  let z=0;for(let i=0;i<=nv;i++)z+=scr[i][2][2];z/=nv+1;
  const P=pal7(col),PB=pal7(o.bc||mix(shd(col,.2),'#c8ccb8',.4));
  return{z,cast:false,fn:par=>{const g=G(par);
    for(const[i0,i1,u]of bands){const pp=u?P:PB,im=(i0+i1)>>1,I=lightI(u?V3.sc(nrm[im],-1):nrm[im]),tn=toneAt(pp,I+(o.lift||0));
      /* teeth want sharp corners: a polygon, not a smoothed outline */
      E('path',{d:'M'+sil(i0,i1).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:tn,stroke:o.ec||pp.ink,'stroke-width':o.ew||.4,'stroke-opacity':o.eo??.42,'stroke-linejoin':'round'},g);if(LOD)continue;
      const mr=[];for(let i=i0;i<=i1;i++){const q=scr[i][2];mr.push([q[0],q[1]])}
      if(mr.length>1&&len>9)E('path',{d:smooth(mr,false),stroke:u?pp.l1:pp.l2,'stroke-width':f(Math.max(.35,len*(o.mw||.011))),'stroke-opacity':u?.5:.45,fill:'none','stroke-linecap':'round'},g)}}}}
/* ---------- shared: the cup of a protea, its bracts in rows (outer short and silky, inner long and coloured) round the receptacle and the dome of florets;
   K = {rows:[{L:[bud,open],W,a0,a1,r0,z0,c,wp,th,n,ns:[lod,det1,det2],pw,ear (inner bracts longer on two sides), it (extra fields of each bract)}], dome:{h,rb,col,tip,ring,pk}, gloss, scales} ---------- */
function l52Cup(par,B,O,Dh,op,K){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),items=[],det=DET>=1.5,ro={pw:.5},br=Dh*(K.br||.115),bz=Dh*(K.bz||.1),rr=protBodyR(br,-bz,Dh*.01,ro),nR=K.rows.length;
  K.rows.forEach((s,si)=>{const nn=LOD?s.ns[0]:det?s.ns[2]:s.ns[1],rank=nR-1-si,inner=si===nR-1;
    for(let i=0;i<nn;i++){const phi=(i+si*.39)/nn*6.283+rot+R(-.08,.08),ear=s.ear?1+s.ear*Math.pow(Math.cos(phi-rot),2)-s.ear*.3:1,
        l=ligule(B,O,{phi,r0:Math.min(Dh*s.r0,rr(Dh*s.z0)*.92),z0:Dh*s.z0,L:Dh*LERP(s.L[0],s.L[1],o2)*ear*R(.93,1.05),W:Dh*s.W*R(.92,1.08),wp:s.wp,a0:LERP(s.a0[0],s.a0[1],o2)+R(-.03,.03),
          a1:LERP(s.a1[0],s.a1[1],o2)*(s.ear?1+.25*(ear-1):1)+R(-.05,.05),pw:s.pw||1.3,th:s.th,tip:s.tip||'round',tw:R(-.2,.2),wav:s.wav||0,n:s.n}),
        c=inner?mix(s.c,shd(s.c,R(-.07,.05)),.5):s.c,it=Object.assign({l,z:protZ(l,B,phi,rank,Dh),c,cb:mix(c,'#efe6ea',inner?.08:.15),sw:.4,ov:inner||det&&si?(det?.42:.32):0},s.it||{});
      items.push(it);
      /* the glossy bracts of the sugarbush: a highlight down each one, on whichever face is seen */
      if(K.gloss&&!LOD&&si){const n=l.S.length-1,back=l.nm[2]<0,I=lightI(back?V3.sc(l.nm,-1):l.nm),ga=K.gloss*Math.max(0,Math.min(1,(I-.35)*1.6));
        if(ga>.04&&n>3){const sd=back?3:1,q=[];for(let j=1;j<n;j++)q.push([l.S[j][sd][0]*.6+l.S[j][2][0]*.4,l.S[j][sd][1]*.6+l.S[j][2][1]*.4]);
          items.push({z:it.z+1e-6,fn:kk=>E('path',{d:smooth(q,false),stroke:'#ffffff','stroke-width':f(Math.max(.6,Dh*s.W*.16)),'stroke-opacity':ga,fill:'none','stroke-linecap':'round'},kk)})}}}});
  {const bc=mix(K.ob,K.c,.15);items.push({z:PJ(B,O,[0,0,-bz*.45])[2],fn:kk=>protBody(kk,B,O,br,-bz,Dh*.01,bc,Object.assign({scales:K.scales?DET>=1.5?12:7:0},ro))})}
  const d=K.dome;if(o2>(d.from??.3)){const h=Dh*LERP(d.h[0],d.h[1],o2),rb=Dh*d.rb,cz=nz<-.1?-1e9:PJ(B,O,[0,0,h*.4])[2];items.push({z:cz,fn:kk=>protDome(kk,B,O,rb,h,{col:d.col,tip:d.tip,ring:o2>.85?d.ring:null,pk:d.pk||1.7})})}
  protLig(k,items);return k}
const L52_SPOON=prof([[0,.3],[.25,.46],[.55,.8],[.8,1],[.94,.86],[1,.45]]),L52_LONG=prof([[0,.46],[.2,.7],[.55,.94],[.82,1],[.95,.82],[1,.45]]),L52_FUN=prof([[0,.5],[.25,.72],[.6,.96],[.85,1],[.96,.8],[1,.4]]),
  L52_CORD=prof([[0,.62],[.12,.92],[.35,1],[.65,.84],[.88,.48],[1,.1]]),L52_OBL=prof([[0,.5],[.12,.84],[.4,1],[.75,.95],[.92,.7],[1,.22]]),L52_NAR=prof([[0,.3],[.1,.74],[.4,1],[.75,.9],[.93,.55],[1,.16]]);
/* a protea on its woody stem (protGrow of lot 16), or along the composer's spine */
function l52Grow(g,t,o,P){const k=G(g),r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
const l52Op=o=>Math.max(.05,Math.min(1,o.op??R(.86,1)));
/* ---------- duchess protea (Protea eximia): spoon-shaped bracts in salmon pink spreading wide round a high dome of florets tipped with deep purple, the longest inner bracts
   standing out like ears on two sides; the outer bracts short and silky; sessile ovate leaves, heart-shaped at the base and clasping the stem, glaucous grey-green edged with purple ---------- */
const L52_CWEXI=[{id:'rose-saumon',n:'Rose saumoné',c:'#e8aaa2',tc:'#dc928c',ob:'#a07068',dome:'#5a2446',tip:'#2c0e22'},
  {id:'rose-carmin',n:'Rose carmin',c:'#d8506e',tc:'#b8304e',ob:'#8a5458',dome:'#4e1c3c',tip:'#260a1c'},
  {id:'rose-tendre',n:'Rose tendre',c:'#eeaab4',tc:'#e08494',ob:'#a8847a',dome:'#62304e',tip:'#341428'},
  {id:'fiery-duchess',n:'Rouge (Fiery Duchess)',c:'#c42c40',tc:'#9a1a2e',ob:'#7a4438',dome:'#4a1830',tip:'#200814'},
  {id:'corail',n:'Corail',c:'#ec9a84',tc:'#dc7a66',ob:'#a07462',dome:'#5a2840',tip:'#2c1020'}];
function l52ExiHead(par,B,O,Dh,op,cw){const hr={hair:'#f8f2f2',hw:Math.max(.35,Dh*.005),ho:.5,hf:.1,lift:.08};
  return l52Cup(par,B,O,Dh,op,{c:cw.c,ob:cw.ob,br:.17,bz:.1,
    rows:[{L:[.15,.18],W:.095,a0:[.5,1.05],a1:[.25,1.35],r0:.15,z0:-.08,c:mix(cw.ob,cw.c,.25),wp:PROTK_OB,th:.5,n:4,ns:[5,7,9],it:hr},
      {L:[.3,.38],W:.11,a0:[.3,.7],a1:[.02,.9],r0:.16,z0:-.05,c:mix(cw.c,cw.ob,.35),wp:L52_SPOON,th:.6,n:6,ns:[6,9,12],it:{hair:'#f6eef0',hw:Math.max(.35,Dh*.005),ho:.3,hf:.5,lift:.2}},
      {L:[.46,.62],W:.13,ear:.3,a0:[.1,.34],a1:[-.1,.66],r0:.17,z0:-.02,c:cw.c,wp:L52_SPOON,th:.8,n:8,ns:[6,9,13],it:{lift:.28,tipc:cw.tc,tf:.72,to:.28,hair:'#f6eef0',hw:Math.max(.35,Dh*.005),ho:.3,hf:.6}}],
    dome:{h:[.2,.5],rb:.165,from:.4,col:cw.dome,tip:cw.tip,ring:lt(cw.dome,.55),pk:1.6}})}
function l52Exi(g,t,o){const cw=cwPick(L52_CWEXI,o),op=l52Op(o),Dh=(o.cm||11)*UPC*(cw.sz||1),
    lf=(og,pos)=>protLeaf(og,pos,7.5*UPC*R(.86,1.08)*(og.p.lat?.75:1)*(og.p.lat?1:1-.3*sm01(1-(og.p.i-1)/4)),.52,'#7a8e78',{wp:L52_CORD,round:1,droop:.03,arch:.04,fold:.1,face:.35,ec:'#8a3a52',eo:.6,bc:'#a4b2a0'});
  return l52Grow(g,t,o,{D:Dh,op,w:.62*UPC,cols:['#4a3428','#6a4c38','#8e6c50','#b89a7c'],nodes:10,li:1.9*UPC,lp:1.6*UPC,bare:6*UPC,aimK:.11,topAng:22,leaf:{ang:30,draw:lf},
    lat:{p:.22,n:[1,1],top:[2,4],nodes:3,li:1.3*UPC,lp:1*UPC,ang:32,age:[.05,.4],sz:.8,e:.05},head:(par,B,O,D2,op2)=>l52ExiHead(par,B,O,D2,op2,cw)})}
/* ---------- queen protea (Protea magnifica, syn. P. barbigera): a great bowl of long bracts, cream to pink or carmine, their margins fringed with white silky hairs toward the tips,
   round a broad dome of florets woolly white below and velvety black on top; broad oblong leaves, sessile, glaucous blue-grey, edged with red ---------- */
const L52_CWMAG=[{id:'creme',n:'Crème',c:'#f2ead4',tc:'#e4d6b4',ob:'#a89478'},
  {id:'vert-pale',n:'Vert pâle',c:'#dfe2b8',tc:'#cdd29a',ob:'#9a9a72'},
  {id:'rose-pale',n:'Rose pâle',c:'#f2c6cc',tc:'#e8a8b4',ob:'#a8887a'},
  {id:'rose',n:'Rose',c:'#e898ae',tc:'#d8768e',ob:'#9a7068'},
  {id:'carmin',n:'Carmin',c:'#c4405e',tc:'#a02a46',ob:'#7a4a42'}];
function l52MagHead(par,B,O,Dh,op,cw){const hair='#ffffff',hw=Math.max(.4,Dh*.006);
  return l52Cup(par,B,O,Dh,op,{c:cw.c,ob:cw.ob,br:.155,bz:.1,
    rows:[{L:[.14,.17],W:.09,a0:[.7,1.3],a1:[.35,1.6],r0:.13,z0:-.08,c:mix(cw.ob,'#6a4a3a',.25),wp:PROTK_OB,th:.5,n:4,ns:[5,8,10],it:{hair,hw,ho:.6,hf:.05}},
      {L:[.32,.4],W:.085,a0:[.4,.62],a1:[0,.52],r0:.14,z0:-.05,c:mix(cw.c,cw.ob,.4),wp:PROTK_MB,th:.6,n:6,ns:[6,10,13],it:{hair,hw,ho:.5,hf:.3}},
      {L:[.52,.66],W:.088,a0:[.12,.28],a1:[-.34,.06],r0:.155,z0:-.02,c:cw.c,wp:L52_LONG,th:.75,n:8,ns:[8,12,18],it:{tipc:cw.tc,tf:.72,to:.4,hair,hw:Math.max(.5,Dh*.009),ho:.85,hf:.5,hl:Dh*.018}}],
    dome:{h:[.16,.26],rb:.145,col:'#2e1e24',tip:'#140a0e',ring:'#f2ece6',pk:2.2}})}
function l52Mag(g,t,o){const cw=cwPick(L52_CWMAG,o),op=l52Op(o),Dh=(o.cm||16)*UPC*(cw.sz||1),
    lf=(og,pos)=>protLeaf(og,pos,9.5*UPC*R(.86,1.08)*(1-.3*sm01(1-(og.p.i-1)/4)),.34,'#728a86',{wp:L52_OBL,round:1,droop:.04,arch:.05,fold:.12,face:.35,ec:'#9a4048',eo:.6,bc:'#9cb0aa'});
  return l52Grow(g,t,o,{D:Dh,op,w:.85*UPC,cols:['#3e2e24','#5e4636','#86684e','#b0927a'],nodes:8,li:2.2*UPC,lp:1.6*UPC,bare:6*UPC,aimK:.12,topAng:26,leaf:{ang:30,draw:lf},zhk:.32,piece:9,
    head:(par,B,O,D2,op2)=>l52MagHead(par,B,O,D2,op2,cw)})}
/* ---------- oleander-leaf protea (Protea neriifolia): a tall cup of long bracts curving inward at their tips, each tip set with a dense beard of black (or white) hairs,
   the florets hidden inside; narrow oblong leaves like an oleander's, crowded up the stem ---------- */
const L52_CWNER=[{id:'pink-mink',n:'Rose à barbe noire (Pink Mink)',c:'#e690a8',ob:'#9a6a60',fr:'#1e1418'},
  {id:'rose-fonce',n:'Rose foncé à barbe noire',c:'#c43a5e',ob:'#7a4448',fr:'#1a1014'},
  {id:'white-mink',n:'Blanc à barbe noire (White Mink)',c:'#f2eee2',ob:'#a89a80',fr:'#22181a'},
  {id:'vert-creme',n:'Vert crème à barbe noire',c:'#d8dca0',ob:'#9a9a6e',fr:'#241a18'},
  {id:'rose-barbe-blanche',n:'Rose à barbe blanche',c:'#ec9eb0',ob:'#a07a70',fr:'#f8f4f2',wb:1},
  {id:'saumon',n:'Saumon à barbe noire',c:'#ef9e8c',ob:'#a07462',fr:'#2a1a18'}];
function l52NerHead(par,B,O,Dh,op,cw){const fr=cw.fr,bw=Math.max(.6,Dh*.014);
  return l52Cup(par,B,O,Dh,op,{c:cw.c,ob:cw.ob,br:.11,bz:.09,scales:1,
    rows:[{L:[.14,.17],W:.09,a0:[.4,.62],a1:[.12,.42],r0:.1,z0:-.05,c:mix(cw.ob,cw.c,.25),wp:PROTH_OB,th:.6,n:4,ns:[5,7,8],it:{hair:'#efe6e2',hw:Math.max(.35,Dh*.005),ho:.4,hf:.1}},
      {L:[.42,.5],W:.1,a0:[.14,.3],a1:[-.06,.26],r0:.11,z0:-.03,c:mix(cw.c,cw.ob,.3),wp:PROTH_IB,th:.6,n:6,ns:[6,10,12],it:{hair:'#f4ecea',hw:Math.max(.35,Dh*.005),ho:.45,hf:.4}},
      {L:[.84,.96],W:.1,a0:[.06,.17],a1:[-.34,-.14],r0:.12,z0:-.01,c:cw.c,wp:PROTH_IB,th:.65,n:8,pw:1.6,ns:[7,12,18],it:{tipc:fr,tf:.8,to:.8,hair:fr,hw:bw,ho:.9,hf:.74,hl:Dh*.03}}],
    dome:{h:[.3,.48],rb:.1,col:'#f2e6e2',tip:cw.wb?'#d8b8c0':'#5a2a3a',pk:1.5,from:.5}})}
function l52Ner(g,t,o){const cw=cwPick(L52_CWNER,o),op=l52Op(o),Dh=(o.cm||11)*UPC*(cw.sz||1),
    lf=(og,pos)=>protLeaf(og,pos,10.5*UPC*R(.86,1.1)*(og.p.lat?.75:1)*(og.p.lat?1:1-.35*sm01(1-(og.p.i-1)/5)),.13,'#4e6a3e',{wp:L52_NAR,round:1,droop:.03,arch:.05,fold:.16,face:.3,ec:'#6a4a34',eo:.5,bc:'#8a9a78'});
  return l52Grow(g,t,o,{D:Dh,op,w:.62*UPC,cols:['#3e2e22','#5e4a36','#86704f','#b4a07e'],nodes:16,li:1.25*UPC,lp:1*UPC,bare:6*UPC,aimK:.11,topAng:22,leaf:{ang:20,draw:lf},
    lat:{p:.12,n:[1,1],top:[2,5],nodes:3,li:1.2*UPC,lp:1*UPC,ang:28,age:[.05,.35],sz:.8,e:.05},head:(par,B,O,D2,op2)=>l52NerHead(par,B,O,D2,op2,cw)})}
/* ---------- sugarbush (Protea repens): a funnel of smooth bracts, sticky and glossy, closed at first then flaring at the lip, cream, pink or red (cream ones often tipped with red),
   the creamy florets filling the funnel; narrow linear leaves, bright green, pointing up ---------- */
const L52_CWREP=[{id:'rouge',n:'Rouge',c:'#b8283a',tc:'#8e1a2c',ob:'#7a4a3a'},
  {id:'rose',n:'Rose',c:'#ec9ab0',tc:'#d8708e',ob:'#a07a6a'},
  {id:'creme-pointe-rouge',n:'Crème à pointes rouges',c:'#f0e6c8',tc:'#c43a4a',ob:'#a8946e',tf:.78},
  {id:'creme',n:'Blanc crème',c:'#f2ecd8',tc:'#e6dcb8',ob:'#a89a7a'},
  {id:'rose-pale',n:'Rose pâle',c:'#f4c8d0',tc:'#e8a4b4',ob:'#a8887a'}];
function l52RepHead(par,B,O,Dh,op,cw){
  return l52Cup(par,B,O,Dh,op,{c:cw.c,ob:cw.ob,br:.1,bz:.09,scales:1,gloss:.55,
    rows:[{L:[.12,.15],W:.1,a0:[.36,.6],a1:[.12,.5],r0:.09,z0:-.05,c:mix(cw.ob,cw.c,.4),wp:PROTH_OB,th:.6,n:4,ns:[5,7,8]},
      {L:[.5,.58],W:.11,a0:[.14,.28],a1:[-.02,.34],r0:.1,z0:-.03,c:mix(cw.c,cw.ob,.25),wp:L52_FUN,th:.55,n:6,ns:[6,9,12],it:{tipc:cw.tc,tf:.7,to:.5}},
      {L:[1,1.15],W:.1,a0:[.05,.16],a1:[-.1,.3],r0:.11,z0:-.01,c:cw.c,wp:L52_FUN,th:.5,n:8,pw:2,ns:[7,11,16],it:{tipc:cw.tc,tf:cw.tf||.62,to:cw.tf?.8:.5}}],
    dome:{h:[.5,.72],rb:.1,col:'#f0e6cc',tip:'#e0cc9a',pk:1.4,from:.45}})}
function l52Rep(g,t,o){const cw=cwPick(L52_CWREP,o),op=l52Op(o),Dh=(o.cm||8)*UPC*(cw.sz||1),
    lf=(og,pos)=>protLeaf(og,pos,7.5*UPC*R(.86,1.1)*(og.p.lat?.75:1)*(og.p.lat?1:1-.35*sm01(1-(og.p.i-1)/5)),.11,'#5c7c44',{wp:LS_LANCE,droop:.03,arch:.05,fold:.18,face:.3,ec:'#6a5a3a',eo:.45,bc:'#8ca070'});
  return l52Grow(g,t,o,{D:Dh,op,w:.5*UPC,cols:['#3a2a1e','#5a4430','#82684a','#ae9878'],nodes:16,li:1.1*UPC,lp:1*UPC,bare:6*UPC,aimK:.11,topAng:20,leaf:{ang:18,draw:lf},
    lat:{p:.35,n:[1,2],top:[2,5],nodes:3,li:1.1*UPC,lp:.9*UPC,ang:28,age:[.05,.6],sz:.8,e:.05},head:(par,B,O,D2,op2)=>l52RepHead(par,B,O,D2,op2,cw)})}
/* ---------- banksias (Banksia coccinea, prionotes, baxteri, hookeriana, speciosa, menziesii): a spike of a thousand flowers packed in pairs in rows up a woody axis;
   in each closed flower the style is caught by the tip of its perianth and bows out into a hook, the hooks in rows making the stripes of the spike; the flowers open from the bottom up,
   each style springing straight out, tipped with its pollen presenter; the spike sits among stiff leaves whose margins are sawn into teeth (cut down to the midrib in baxteri and speciosa).
   cw: c (style, the colour sold), pc (closed perianths), hc (hooks), pp (presenters), hr (height / width), sq (squareness of the profile), qm (how far up the spike opens), ls (style), sz, lf (leaf) ---------- */
const L52_CWBANK=[{id:'coccinea',n:'Rouge écarlate (B. coccinea)',c:'#c8282a',pc:'#dcd6ca',hc:'#c42a2a',pp:'#e04a3a',body:'#d8b8b0',hr:.72,sq:2.6,qm:1,ls:.11,tk:.5,sz:.85,cols:1,
    lf:{len:6.5,wr:.62,teeth:6,td:.2,t0:.2,wp:prof([[0,.3],[.2,.7],[.5,.95],[.8,1],[1,.86]]),col:'#4a6238',bc:'#d6dac8'}},
  {id:'prionotes',n:'Orange gland (B. prionotes)',c:'#e8782a',pc:'#f2eadc',hc:'#efe4d0',pp:'#f09a3a',body:'#e8862e',hr:1.75,sq:3.2,qm:.72,ls:.09,tk:.22,sz:1.1,
    lf:{len:19,wr:.08,teeth:20,td:.55,t0:.06,wp:prof([[0,.4],[.1,.85],[.5,1],[.9,.85],[1,.2]]),col:'#56704a',bc:'#cfd4c2'}},
  {id:'baxteri',n:'Jaune-vert (B. baxteri)',c:'#d4c84e',pc:'#c6c290',hc:'#ccc254',pp:'#e4d86a',hr:.95,sq:2.1,qm:1,ls:.12,tk:.45,sz:.75,
    lf:{len:13,wr:.36,teeth:7,td:.86,t0:.04,wp:prof([[0,.5],[.15,.9],[.5,1],[.85,.9],[1,.5]]),col:'#4e6a3a',bc:'#a8b494'}},
  {id:'hookeriana',n:'Orange et crème (B. hookeriana)',c:'#ee8a28',pc:'#f4ecdc',hc:'#f2e2c8',pp:'#f4a640',body:'#ee962e',hr:1.4,sq:2.8,qm:.8,ls:.09,tk:.25,sz:.9,
    lf:{len:15,wr:.07,teeth:16,td:.45,t0:.06,wp:prof([[0,.4],[.1,.85],[.5,1],[.9,.85],[1,.2]]),col:'#4c6a40',bc:'#c8d0bc'}},
  {id:'speciosa',n:'Crème jaune (B. speciosa)',c:'#e8dc8a',pc:'#e8e2c4',hc:'#e2d68a',pp:'#e8d070',hr:1.55,sq:3,qm:1,ls:.1,tk:.22,sz:1.05,
    lf:{len:24,wr:.08,teeth:26,td:.88,t0:.04,wp:prof([[0,.5],[.1,.9],[.5,1],[.9,.9],[1,.4]]),col:'#56704a',bc:'#dcdcd0'}},
  {id:'menziesii',n:'Bordeaux et or (B. menziesii)',c:'#8a2638',pc:'#c8a86a',hc:'#9a3040',pp:'#e0b04a',hr:1.25,sq:2.6,qm:.9,ls:.1,tk:.28,sz:.9,
    lf:{len:15,wr:.14,teeth:14,td:.28,t0:.08,wp:prof([[0,.4],[.15,.85],[.5,1],[.85,.85],[1,.3]]),col:'#4e6640',bc:'#c4ccb8'}}];
function l52BankHead(par,B,O,S,op,cw){const k=G(par),det=DET>=1.5,nz=B[2][2],hr=cw.hr,g0=.68+.32*sm01(op/.55),W=(hr>=1?S/hr:S)*g0,Hh=(hr>=1?S:S*hr)*g0,Rr=W/2,rot=R(0,6.283),
    qo=op<.2?0:Math.min(cw.qm,sm01((op-.18)/.72)*cw.qm),bud=sm01(1-op/.45),pe=cw.sq,z0=-Hh*.03,
    rt=t=>Rr*Math.pow(Math.max(0,1-Math.pow(Math.abs(2*t-1),pe)),1/pe),zt=t=>z0+Hh*t,ls=Rr*cw.ls*(.6+.4*sm01((op-.2)/.6)),
    nc=Math.round(LOD?14:det?40:26),
    pc=mix(cw.pc,'#9aa48a',bud*.45),hc=mix(cw.hc,'#a4ac90',bud*.55),oc=mix(cw.body||cw.c,cw.pc,.3);
  /* the receptacle and the axis under the spike, clad in small woolly bracts */
  const body=()=>protBody(k,B,O,Math.min(Rr*.3,UPC*.9),-Hh*.12,Hh*.05,'#6a5442',{pw:.6});
  if(nz>=0)body();
  /* the florets: rows spaced evenly along the profile from pole to pole (so the ends of the spike are clothed too), columns round it in proportion to its girth
     (straight in coccinea, a gentle spiral in the others); each floret on the surface with its outward normal n and the tangent Tg up the profile */
  const back=[],fr=[[],[],[]],hk=[[],[],[]],kn=[],NS=120,pr=[],cum=[0];for(let i=0;i<=NS;i++){const t=i/NS;pr.push([rt(t),zt(t),t]);if(i)cum.push(cum[i-1]+Math.hypot(pr[i][0]-pr[i-1][0],pr[i][1]-pr[i-1][1]))}
  const Ltot=cum[NS],cell=Math.PI*W/nc,nr2=Math.max(4,Math.round(Ltot/cell*1.15));let q=0;
  for(let i=0;i<nr2;i++){const sv=(i+.5)/nr2*Ltot;while(q<NS-1&&cum[q+1]<sv)q++;const u=(sv-cum[q])/Math.max(1e-6,cum[q+1]-cum[q]),r=LERP(pr[q][0],pr[q+1][0],u),z=LERP(pr[q][1],pr[q+1][1],u),t=LERP(pr[q][2],pr[q+1][2],u),
      dr=pr[q+1][0]-pr[q][0],dz=pr[q+1][1]-pr[q][1],dl=Math.hypot(dr,dz)||1,N0=dz/dl,N1=-dr/dl,T0=dr/dl,T1=dz/dl,open=t<qo,ni=Math.max(1,Math.round(nc*r/Rr)),dai=6.283/ni,h=Ltot/nr2;
    for(let j=0;j<ni;j++){const a=rot+j*dai+(cw.cols&&ni===nc?0:i*dai*.38)+(i%2&&!cw.cols?dai*.5:0),ca=Math.cos(a),sa=Math.sin(a),n=[ca*N0,sa*N0,N1],Tg=[ca*T0,sa*T0,T1],Ps=[ca*r,sa*r,z],nv=toV(B,n),
        I=lightI(nv),tb=I<.5?0:I<.7?1:2,at=(p,kn2,kt)=>V3.add(V3.add(Ps,V3.sc(n,kn2)),V3.sc(Tg,kt));
      if(open){if(nv[2]<-.4)continue;const s=[at(0,-Rr*.12,0),at(0,ls*.45,ls*.05),at(0,ls,ls*.22)].map(p=>PJ(B,O,p));(nv[2]<0?back:fr[tb]).push(s);if(nv[2]>=0)kn.push(s[2])}
      else{if(nv[2]<.02)continue;hk[tb].push([at(0,-Rr*.08,0),at(0,Rr*.05,h*.45),at(0,-Rr*.02,h*.8)].map(p=>PJ(B,O,p)))}}}
  const ws=Math.max(1.1,W*.016),hw=Math.max(.55,W*.012),pS=pal7(cw.c),pH=pal7(hc),Q=L=>L.map(s=>`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`).join('');
  if(back.length)E('path',{d:Q(back),stroke:toneAt(pS,.36),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);
  /* the body of the spike: open flowers below (the colour of their styles), closed ones above */
  const hull=(t0,t1,ex)=>{const pts=[];for(let i=0;i<=12;i++){const t=t0+(t1-t0)*i/12;for(let j=0;j<18;j++){const a=j/18*6.283,p=PJ(B,O,[Math.cos(a)*(rt(t)+ex),Math.sin(a)*(rt(t)+ex),zt(t)]);pts.push([p[0],p[1]])}}return smooth(hull2(pts))};
  if(qo>0)E('path',{d:hull(0,1,ls*.35),fill:budFill(oc),stroke:shd(oc,-.5),'stroke-width':.4,'stroke-opacity':.5},k);
  if(qo<1)E('path',{d:hull(qo>0?Math.max(0,qo-.03):0,1,0),fill:budFill(pc),stroke:shd(pc,-.45),'stroke-width':.4,'stroke-opacity':qo>0?.25:.5},k);
  if(LOD){if(nz<0)body();return k}
  /* the hooked styles of the closed flowers */
  for(let b=0;b<3;b++)if(hk[b].length)E('path',{d:Q(hk[b]),stroke:toneAt(pH,[.4,.6,.8][b]),'stroke-width':f(hw),fill:'none','stroke-linecap':'round'},k);
  /* the open flowers: their styles, then the presenters at their tips */
  for(let b=0;b<3;b++)if(fr[b].length)E('path',{d:Q(fr[b]),stroke:toneAt(pS,[.42,.6,.78][b]),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);
  if(kn.length)E('path',{d:kn.map(p=>`M${f(p[0])},${f(p[1])}l.01,0`).join(''),stroke:cw.pp,'stroke-width':f(ws*1.6),'stroke-linecap':'round',fill:'none'},k);
  if(nz<0)body();return k}
function l52Bank(g,t,o){const cw=cwPick(L52_CWBANK,o),op=l52Op(o),S=(o.cm||12)*UPC*(cw.sz||1),L=cw.lf,
    /* the spike carries on the line of its stem: it turns only part of the way toward the face asked for (a short drum further than a tall spike) */
    ax=axOf(o),uv=o.up&&Math.hypot(o.up[0],o.up[1])>1e-6?V3.nz([o.up[0],o.up[1],0]):[0,1,0],tk=cw.tk??.3,ax2=V3.nz(V3.add(V3.sc(V3.nz(ax),tk),V3.sc(uv,1-tk)));o=Object.assign({},o,{ax:ax2});const
    lf=(og,pos)=>l52Leaf(og,pos,L.len*UPC*R(.86,1.08)*(1-.25*sm01(1-(og.p.i-1)/4)),L.wr,L.col,{wp:L.wp,teeth:L.teeth,td:L.td,t0:L.t0,droop:.05,arch:.06,fold:.12,face:.3,ec:shd(L.col,-.3),eo:.5,bc:L.bc});
  return l52Grow(g,t,o,{D:S,op,w:.6*UPC,cols:['#4a3a2c','#6a5442','#8e765e','#b8a084'],nodes:12,li:(L.len>12?1.6:1.2)*UPC,lp:.8*UPC,bare:6*UPC,aimK:.12,topAng:14,leaf:{ang:(i)=>44+10*sm01(1-(i-1)/3),draw:lf},
    zhk:.2,head:(par,B,O,D2,op2)=>l52BankHead(par,B,O,D2,op2,cw)})}
/* ---------- the registers ---------- */
Object.assign(GH,{'banksia':l52Bank,'protea-eximia':l52Exi,'protea-magnifica':l52Mag,'protea-neriifolia':l52Ner,'protea-repens':l52Rep});
Object.assign(CWS,{'banksia':L52_CWBANK,'protea-eximia':L52_CWEXI,'protea-magnifica':L52_CWMAG,'protea-neriifolia':L52_CWNER,'protea-repens':L52_CWREP});
Object.assign(SZG,{'banksia':[9,10,12,12,14],'protea-eximia':[9,10,11,12,14],'protea-magnifica':[12,14,16,18,20],'protea-neriifolia':[9,10,11,12,13],'protea-repens':[7,8,9,10,12]});
Object.assign(GHI,{'banksia':{form:'sphere',size:2.5,k:'head',rk:1},'protea-eximia':{form:'disque',size:2.5,k:'head',rk:1},'protea-magnifica':{form:'disque',size:3,k:'head',rk:1},
  'protea-neriifolia':{form:'cornet',size:2.5,k:'head',rk:.85},'protea-repens':{form:'cornet',size:2,k:'head',rk:.85}});
for(const id of['banksia','protea-eximia','protea-magnifica','protea-neriifolia','protea-repens'])GH_BUDS.add(id);
