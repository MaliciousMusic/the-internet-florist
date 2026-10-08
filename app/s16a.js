/* ================= Serre, lot 16 — Protéacées, poussées par le L-système : leucadendrons rouges et jaunes, leucospermum, protée royale, protées hybrides ================= */
/* ---------- shared pieces: woody stems crowded with leathery leaves in a tight spiral, heads of coloured bracts round a cone or a dome of florets ---------- */
const PROT_WOOD=['#3a2216','#5a3624','#82563a','#b48a68'],PROT_GREY=['#36402a','#56623e','#808c66','#b4bc98'];
/* a frame whose face looks along Z, its top toward up */
function protFrame(Z,up,roll=0){Z=V3.nz(Z);let Y=V3s(up,V3.sc(Z,V3.dot(up,Z)));if(V3l(Y)<1e-4)Y=Math.abs(Z[1])<.9?[0,1,0]:[1,0,0];Y=V3.nz(V3s(Y,V3.sc(Z,V3.dot(Y,Z))));
  const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* rows i0..i1 of a ligule's outline (left edge up, the tip if i1 is the last row, right edge down) */
function protLigRows(l,i0,i1,open){const n=l.S.length-1,o=l.out,m=o.length,Lf=o.slice(i0,i1+1),Rr=[];for(let i=i1;i>=i0;i--)Rr.push(o[m-1-i]);return i1===n?Lf.concat(o.slice(n+1,m-n-1),Rr):Lf.concat(Rr)}
/* ---------- a leathery leaf on its node: the blade of lsLeafS (arched, folded, drooping a little) drawn as one projected outline per visible face, toned by its facing,
   with its midrib; perhaps a petiole (protea), a toothed apex (pincushion), a tip flushed with colour (conebush) or a pale margin (variegated) ---------- */
function protLeaf(og,pos,len,wr,col,o={}){const pl=len*(o.pet||0),H=og.H,bl=len-pl,P0=V3.add(pos,V3.sc(H,pl)),
    S=lsLeafS({pos:P0,H,U:og.U,L:og.L},bl,wr,{wp:o.wp||LS_LANCE,droop:o.droop??.05,arch:o.arch??.07,fold:o.fold??.14,face:o.face??.3,tw:o.tw??R(-.35,.35)}),
    nv=LOD?4:DET>=1.5?10:6,US=[-1,-.5,0,.5,1],scr=[],nrm=[],e=.03,P3=p=>[p[0],-p[1],p[2]];
  for(let i=0;i<=nv;i++){const v=i/nv;scr.push(US.map(u=>P3(S(u,v))));const du=V3s(S(.1,v),S(-.1,v)),dv=V3s(S(0,Math.min(1,v+e)),S(0,Math.max(0,v-e))),n=V3.cr(du,dv);nrm.push(V3l(n)>1e-9?V3.nz(n):null)}
  for(let i=0;i<=nv;i++)if(!nrm[i])nrm[i]=nrm[i-1]||nrm[i+1]||[0,0,1];
  /* the outline row by row: the extreme points across the midrib */
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=scr[Math.max(0,i-1)][2],b=scr[Math.min(nv,i+1)][2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),px=l<1e-6?1:-dy/l,py=l<1e-6?0:dx/l,c=scr[i][2];
    let mn=1e9,mx=-1e9,ql=scr[i][0],qr=scr[i][4];for(const q of scr[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;ql=q}if(s>mx){mx=s;qr=q}}Lf.push(ql);Rt.push(qr)}
  /* the apex: blunt teeth across it (pincushion), a rounded end (protea), or the point the blade already narrows to */
  let tip=[],calli=[];const nd=Lf[nv],ne=Rt[nv];
  if(o.teeth){/* a rounded apex with small horny teeth along it */const nt=o.teeth,T=[];for(let j=0;j<=2*nt;j++){const u=-1+j/nt,bul=bl*(o.bulge??.1)*(1-u*u),p=V3.add(S(u*.98,1),V3.sc(H,bul+(j%2?bl*.035:0)));T.push(P3(p))}
    const d0=Math.hypot(T[0][0]-nd[0],T[0][1]-nd[1]),d1=Math.hypot(T[2*nt][0]-nd[0],T[2*nt][1]-nd[1]);if(d1<d0)T.reverse();tip=T;calli=T.filter((q,j)=>j%2)}
  else if(o.round){const mx=(nd[0]+ne[0])/2,my=(nd[1]+ne[1])/2,rr=Math.hypot(ne[0]-nd[0],ne[1]-nd[1])/2,a=scr[nv-1][2],ea=Math.atan2(scr[nv][2][1]-a[1],scr[nv][2][0]-a[0]),aL=Math.atan2(nd[1]-my,nd[0]-mx),sg=Math.cos(aL+Math.PI/2-ea)>0?1:-1;
    for(let j=1;j<6;j++){const an=aL+sg*Math.PI*j/6;tip.push([mx+Math.cos(an)*rr,my+Math.sin(an)*rr,ne[2]])}}
  /* bands of rows that show the same face (the upper face is the one turned toward the stem's tip) */
  const up=i=>nrm[i][2]<0,bands=[];let a0=0,cur=up(0);for(let i=1;i<=nv;i++){const u=up(i);if(u!==cur){bands.push([a0,i,cur]);a0=i;cur=u}}bands.push([a0,nv,cur]);
  const sil=(i0,i1)=>{const L=Lf.slice(i0,i1+1),Rr=Rt.slice(i0,i1+1).reverse();return L.concat(i1===nv?tip:[],Rr).map(q=>[q[0],q[1]])};
  let z=0;for(let i=0;i<=nv;i++)z+=scr[i][2][2];z/=nv+1;
  const P=pal7(col),PB=pal7(o.bc||mix(shd(col,.2),'#b8c2a6',.3));
  return{z:z+(o.zb||0),cast:false,fn:par=>{const g=G(par);
    if(pl>0){const a=P3(pos),b=P3(P0),m=P3(V3.add(V3.add(pos,V3.sc(H,pl*.5)),V3.sc(og.U,pl*.06)));E('path',{d:`M${f(a[0])},${f(a[1])}Q${f(m[0])},${f(m[1])} ${f(b[0])},${f(b[1])}`,stroke:o.pc||P.d1,'stroke-width':f(o.pw||1.2),fill:'none','stroke-linecap':'round'},g)}
    for(const[i0,i1,u]of bands){const s=sil(i0,i1),im=(i0+i1)>>1,pp=u?P:PB,I=lightI(u?V3.sc(nrm[im],-1):nrm[im]),tn=toneAt(pp,I+(o.lift||0)),d=smooth(s);
      if(o.vc&&!LOD){/* variegated: the blade in its pale margin colour, then its green heart */E('path',{d,fill:toneAt(pal7(o.vc),I),stroke:pp.ink,'stroke-width':o.ew||.4,'stroke-opacity':o.eo??.4,'stroke-linejoin':'round'},g);
        const inn=[],inr=[];for(let i=Math.max(1,i0);i<=Math.min(nv-1,i1);i++){const v=i/nv;inn.push(P3(S(-.55*(1-.35*v),v)));inr.push(P3(S(.55*(1-.35*v),v)))}if(inn.length>1)E('path',{d:smooth(inn.concat(inr.reverse()).map(q=>[q[0],q[1]])),fill:tn},g)}
      else E('path',{d,fill:tn,stroke:o.ec||pp.ink,'stroke-width':o.ew||.4,'stroke-opacity':o.eo??.42,'stroke-linejoin':'round'},g);
      if(LOD)continue;
      /* a tip flushed with the colour of the bracts above it */
      if(o.flush&&i1===nv){const j0=Math.max(i0,Math.round(nv*(o.ff??.5))),fc=toneAt(pal7(o.flush),I);if(j0<nv){if(DET>=1.5){const j1=Math.min(nv-1,j0+2);E('path',{d:smooth(sil(j0,nv)),fill:fc,opacity:(o.fo??.75)*.5},g);E('path',{d:smooth(sil(j1,nv)),fill:fc,opacity:(o.fo??.75)*.6},g)}
        else E('path',{d:smooth(sil(j0,nv)),fill:fc,opacity:o.fo??.75},g)}}
      /* the midrib: a pale groove on the upper face, a raised rib below */
      const mr=[];for(let i=i0;i<=i1;i++){const q=scr[i][2];mr.push([q[0],q[1]])}if(i1===nv&&mr.length>2)mr[mr.length-1]=[(mr[mr.length-1][0]*.7+mr[mr.length-2][0]*.3),(mr[mr.length-1][1]*.7+mr[mr.length-2][1]*.3)];
      if(mr.length>1&&len>9)E('path',{d:smooth(mr,false),stroke:u?pp.l1:pp.l2,'stroke-width':f(Math.max(.35,len*(o.mw||.011))),'stroke-opacity':u?.5:.4,fill:'none','stroke-linecap':'round'},g)}
    /* the horny tips of the teeth */
    if(calli.length&&DET>=1.5&&!LOD){let d='';const r=Math.max(.4,bl*.012);for(const q of calli)d+=`M${f(q[0]-r)},${f(q[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;E('path',{d,fill:o.tc||'#7a2a1e'},g)}}}}
/* ---------- the plant: the L-system grows a woody axis with its leaves in a tight spiral (divergence 137.5°), perhaps leafy side branches ending in younger heads, and the main head at its tip.
     S → F(bare) A(n)      A(n>0) → +ε F N(n) A(n−1)      A(0) → F F(aim) K
     N(i) → [ /φᵢ &α Lv ]  [ /φᵢ+180 &β Bn(m) ] (a side branch, by chance)      Bn(m>0) → F M Bn(m−1)      Bn(0) → F Kl
   P: D head size; op; w stem width under the head; cols; nodes, li, lp, bare (lengths in units); leaf {ang, draw(og,pos) → part}; lat {p, n, top, nodes, li, lp, ang, age, sz, e};
      head(par,B,O,D,op,info) draws a head; rr, aimK, e, wig, zz (zigzag at the nodes, degrees) ---------- */
function protRules(P,latAt,ph0){const lf=P.leaf,la=P.lat||{};return{
  N:p=>{const phi=ph0+p.i*137.5,top=(P.topAng||0)*sm01(1-(p.i-1)/4),ang=typeof lf.ang==='function'?lf.ang(p.i):lf.ang+top,out=[['[',{}],['/',{a:phi+R(-12,12)}],['&',{a:ang*R(.88,1.12)}],['Lv',{i:p.i}],[']',{}]];
    if(latAt&&latAt.has(p.i))out.push(['[',{w:P.w*.66}],['/',{a:phi+R(150,210)}],['&',{a:la.ang*R(.88,1.12)}],['Bn',{n:la.nodes,age:latAt.get(p.i),i:p.i}],[']',{}]);return out},
  Bn:p=>p.n>0?[['F',{l:la.li*R(.85,1.15),w1:P.w*(.52+.1*p.n/la.nodes),e:la.e??.06}],['M',{i:p.n,age:p.age}],['Bn',{n:p.n-1,age:p.age}]]
    :[['F',{l:la.lp*.5,w1:P.w*.5,e:la.e??.06}],['F',{l:la.lp*.5,w1:P.w*.48,e:(la.e??.06)*.5}],['Kl',{age:p.age}]],
  M:p=>[['[',{}],['/',{a:ph0*1.7+p.i*137.5+R(-12,12)}],['&',{a:(typeof lf.ang==='function'?lf.ang(p.i,1):lf.ang)*R(.88,1.12)}],['Lv',{i:p.i,lat:1,age:p.age}],[']',{}]]}}
/* the side branches: at which nodes (counted from the top) and how old their heads are */
function protLats(P,nN){const m=new Map(),la=P.lat;if(!la||nN<3||rnd()>=la.p)return m;const nl=Math.round(R(la.n[0],la.n[1]));
  for(let j=0;j<nl;j++){const i=Math.round(R(la.top[0],la.top[1]))+j*2;if(i>=1&&i<=nN-1&&!m.has(i))m.set(i,R(la.age[0],la.age[1]))}return m}
/* drawing the grown plant: the axes and leaves (in a bouquet they join the stems layer, behind every head), the heads in the painter's order */
function protDraw(k,res,c){const parts=[],ext=[],P=c.P,off=c.off,X=NECK_X&&!c.self?ext:parts,c0=res.chains[0],ci=lsCut(res,c.apex),
    low={pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1),c:c0.c,ord:0},high=ci<c0.pts.length-1?{pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:c0.c,ord:0}:null;
  lsChainParts([low].concat(high?[high]:[],res.chains.slice(1)),off,P.cols,X,{piece:P.piece||8});
  for(const og of res.organs){const pos=V3.add(og.pos,off);
    if(og.t==='K'){const Bh=c.Bh||c.B;parts.push({z:pos[2]+(c.zh||0),fn:par=>P.head(par,Bh,pos,P.D,P.op,{main:1})})}
    else if(og.t==='Kl'){const a=Math.min(og.p.age,P.op*1.1),Bf=protFrame(V3.add(V3.sc(og.H,.7),V3.sc(c.ax||og.H,.3)),og.U,R(-.3,.3)),Dl=P.D*(P.lat.sz||.8)*(.78+.22*a);
      parts.push({z:pos[2]+(c.zh||0)*.7,fn:par=>P.head(par,Bf,pos,Dl,a,{main:0,age:a})})}
    else if(og.t==='Lv'){const pt=P.leaf.draw(og,pos);if(pt)X.push(pt)}}
  if(X===ext&&EXT)EXT.push(par=>drawParts(par,ext));else if(X===ext)parts.push(...ext);drawParts(k,parts)}
function protGrow(k,o,P){const B=frameOf(o,P.rr??.25,false),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2],w=P.w,aK=P.aimK??.1;
  let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  /* in a bouquet the plant keeps at most 40 % of the way down to its base (the rest is the bouquet's stem); in a hand-tied bunch (a card) its woody stem goes down to the tie,
     stripped of its leaves near it; a head on the lip keeps only its short peduncle */
  const card=B.reach&&!NECK_X,kr=card?.96:.4,lp=Math.min(P.lp*(o.rim?.7:1),B.reach?B.reach*kr*.75:1e9),bare=o.rim?0:B.reach?(card?B.reach*.3:0):P.bare||0,
    Lmax=B.reach?B.reach*kr-bare:1e9,nN=o.rim?0:Math.max(0,Math.min(P.nodes,Math.floor((Lmax-lp)/P.li))),zz=P.zz??2.5,ph0=R(0,360),latAt=protLats(P,nN);
  const rules=Object.assign({S:()=>(bare?[['F',{l:bare,w0:w*1.34,w1:w*1.3}]]:[]).concat([['A',{n:nN}]]),
    A:p=>p.n>0?[['+',{a:R(-zz,zz)}],['F',{l:P.li*R(.86,1.14),w1:w*(1+.3*p.n/Math.max(1,nN)),aim:ax,k:aK*Math.pow(Math.max(0,1-p.n/(nN+1.5)),2)}],['N',{i:p.n}],['A',{n:p.n-1}]]
      :[['F',{l:lp*.55,w1:w*1.03,aim:ax,k:aK*2}],['F',{l:lp*.45,w1:w,aim:ax,k:aK*3.6}],['K',{main:1}]]},protRules(P,latAt,ph0));
  const res=lsTurtle(lsDerive([['S',{}]],rules,nN+(P.lat?P.lat.nodes:0)+5),{p:[0,0,0],H:up,U:U0,wig:P.wig??.012,seg:P.seg||6,T:[0,1,0],e:P.e??.008,w:w*1.3});
  for(const ch of res.chains)ch.c=P.cols;const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  /* a head facing the eye is drawn over the leaves just under it; one turned away lets them pass in front */
  protDraw(k,res,{P,B,ax,apex,off:V3s([0,0,0],apex),zh:Math.max(0,ax[2])*P.D*(P.zhk??.3)});return lsNeck(res,[0,0,0],apex)}
/* ---------- the same plant as a leafy stem rising from the mouth along the composer's spine (the conebush as foliage): the turtle is led along the spine, its leaves and head grown on the way ---------- */
function protAlong(k,o,P){const C=o.spine.map(p=>[p[0],-p[1],0]),cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[a*C[0][0]+b*C[1][0]+c*C[2][0]+d*C[3][0],a*C[0][1]+b*C[1][1]+c*C[2][1]+d*C[3][1],0]},
    s0=o.from||0,N=36,pts=[],cum=[0];for(let i=0;i<=N;i++)pts.push(cb(s0+(1-s0)*i/N));for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));
  const Lt=cum[N],w=P.w,lp=P.lp,nN=Math.max(1,Math.min(P.nodes,Math.floor((Lt*.5-lp)/P.li))),wAt=l=>w*(1.35-.35*l/Lt),ph0=R(0,360),latAt=protLats(P,nN),mods=[];
  let i=nN,next=Lt-lp-(nN-1)*P.li;
  for(let j=1;j<=N;j++){const T=V3.nz(V3s(pts[j],pts[j-1]));let a=cum[j-1];
    while(i>=1&&next<=cum[j]+1e-6){if(next-a>1e-3)mods.push(['F',{l:next-a,aim:T,k:1,wig:0,w1:wAt(next)}]);mods.push(['N',{i}]);a=next;i--;next+=P.li}
    if(cum[j]-a>1e-3)mods.push(['F',{l:cum[j]-a,aim:T,k:1,wig:0,w1:wAt(cum[j])}])}
  mods.push(['K',{main:1}]);
  const res=lsTurtle(lsDerive(mods,protRules(P,latAt,ph0),(P.lat?P.lat.nodes:0)+3),{p:pts[0],H:V3.nz(V3s(pts[1],pts[0])),U:[0,0,1],seg:7,T:[0,1,0],e:0,w:wAt(0)});
  for(const ch of res.chains)ch.c=P.cols;const main=res.organs.find(q=>q.t==='K'),He=main.H,Bh=protFrame(V3.add(He,[0,0,.5]),[0,1,0],R(-.2,.2));
  protDraw(k,res,{P,B:Bh,ax:Bh[2],apex:main.pos,off:[0,0,0],self:1,zh:P.D*.1});return{k,bw:w*1.35,bc:P.cols}}
/* ---------- bracts drawn far to near: {l (ligule), z, c inner face, cb outer face, ov (the shared floret shading), basec/bf (a flush at the base), tipc/tf (a coloured tip),
   rim (a coloured margin toward the tip), hair (silky hairs along the margin toward the tip: colour, width, hf from which row), sheen (a silver streak down the outer face), ink} ---------- */
function protLig(k,items){items.sort((a,b)=>a.z-b.z);const ov=floretShade(),cache={};
  for(const it of items){if(it.fn){it.fn(k);continue}const l=it.l,n=l.S.length-1,back=l.nm[2]<0,cc=back?(it.cb||it.c):it.c,I=lightI(back?V3.sc(l.nm,-1):l.nm)*(it.ao||1)+(it.lift||0),key=cc+Math.round(I*16);let tone=cache[key];
    if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1,P.ink]}const d=smooth(l.out);
    E('path',{d,fill:tone[0],stroke:it.ink||tone[1],'stroke-width':it.sw||.4,'stroke-opacity':it.eo??.6,'stroke-linejoin':'round'},k);if(LOD)continue;
    if(it.basec&&n>2){const i1=Math.max(1,Math.round(n*(it.bf||.35)));E('path',{d:smooth(protLigRows(l,0,i1)),fill:it.basec,opacity:it.bo??.55},k)}
    if(it.tipc&&n>2){const i0=Math.min(n-1,Math.round(n*(it.tf||.65)));E('path',{d:smooth(protLigRows(l,i0,n)),fill:it.tipc,opacity:it.to??.7},k)}
    if(it.ov)E('path',{d,fill:ov,opacity:it.ov},k);
    if(it.sheen&&back&&n>2){const q=l.S.slice(1,n).map(r=>[r[2][0],r[2][1]]);E('path',{d:smooth(q,false),stroke:'#ffffff','stroke-width':f(it.sheen),'stroke-opacity':.22,fill:'none','stroke-linecap':'round'},k)}
    if(it.rim&&n>2){const q=protLigRows(l,Math.round(n*(it.rf??.4)),n);E('path',{d:smooth(q,false),stroke:it.rim,'stroke-width':f(it.rw||.9),'stroke-opacity':.85,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},k)}
    if(it.hair&&n>2){const q=protLigRows(l,Math.round(n*(it.hf??.45)),n),hw=it.hw||.8,dd=smooth(q,false);
      if(it.fz)E('path',{d:dd,stroke:it.hair,'stroke-width':f(hw*it.fz),'stroke-opacity':.22,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},k);
      E('path',{d:dd,stroke:it.hair,'stroke-width':f(hw),'stroke-opacity':it.ho??.7,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},k);
      /* close up, the hairs themselves: short strokes standing off the margin */
      if(it.hl&&DET>=1.5&&!LOD){let hd='';const m=q.length,st=1;for(let j=1;j<m-1;j+=st){const a=q[j-1],b=q[j+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=dy/L,ny=-dx/L;
          for(const[t,sc]of[[.25,.7],[.75,1]]){const px=q[j][0]+(b[0]-q[j][0])*t,py=q[j][1]+(b[1]-q[j][1])*t,s=sc*it.hl*(.75+.25*Math.sin(j*2.7+t*5));hd+=`M${f(px-nx*s*.35)},${f(py-ny*s*.35)}l${f(nx*s+dx/L*s*.25)},${f(ny*s+dy/L*s*.25)}`}}
        if(hd)E('path',{d:hd,stroke:it.hair,'stroke-width':f(hw*.5),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},k)}}}}
/* the depth of a bract for the painter's order: outer rows come forward on the side facing the eye and go back on the far side */
const protZ=(l,B,phi,rank,Dh)=>l.z+toV(B,[Math.cos(phi),Math.sin(phi),0])[2]*rank*Dh*.035;
/* ---------- the dome of florets in a protea's cup: a rounded cone of silky florets in spiral rows, coloured at its apex; the ring of open florets round its foot ---------- */
function protDome(k,B,O,rb,h,o={}){const col=o.col||'#f2ece6',pk=o.pk||1.7,rf=t=>rb*Math.pow(Math.max(0,1-Math.pow(t,pk)),.55),hp=(t0)=>{const pts=[];for(let i=0;i<=8;i++){const t=t0+(1-t0)*i/8,r=rf(t);for(let j=0;j<16;j++){const a=j/16*6.283,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,h*t]);pts.push([p[0],p[1]])}}return hull2(pts)};
  E('path',{d:smooth(hp(0)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.55},k);if(LOD)return;
  /* the apex flushed with the colour of the youngest florets */
  if(o.tip&&toV(B,[0,0,1])[2]>-.5)E('path',{d:smooth(hp(.58)),fill:mix(col,o.tip,.4),opacity:.5},k);
  /* the florets: a golden-angle lattice over the dome (the spirals of a pine cone seen from above), each a silky bump, shaded below and lit above, only where the dome faces the eye */
  const nf=DET>=1.5?170:80,rr0=rb*(DET>=1.5?.05:.07);let dd='',dl='';
  for(let i=0;i<nf;i++){const q=(i+.5)/nf,t=Math.min(.93,1-Math.sqrt(1-q*.96)),a=i*2.39996,r=rf(t),dr=(rf(Math.min(1,t+.02))-rf(Math.max(0,t-.02)))/.04,nV=toV(B,V3.nz([Math.cos(a),Math.sin(a),-dr/h]))[2];if(nV<.08)continue;
    const s0=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,h*t]),rr=rr0*(.75+.35*(1-t))*(.6+.4*nV),dx=rr*.35,dy=rr*.45;
    dd+=`M${f(s0[0]+dx-rr)},${f(s0[1]+dy)}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;const rl=rr*.55;dl+=`M${f(s0[0]-dx-rl)},${f(s0[1]-dy)}a${f(rl)},${f(rl)} 0 1,0 ${f(2*rl)},0a${f(rl)},${f(rl)} 0 1,0 ${f(-2*rl)},0`}
  if(dd){E('path',{d:dd,fill:shd(col,-.38),opacity:.42},k);E('path',{d:dl,fill:lt(col,.6),opacity:.8},k)}
  /* the coloured tips at the apex */
  if(o.tip&&toV(B,[0,0,1])[2]>-.3){let td='';const nt=DET>=1.5?14:8,rr=Math.max(.45,rb*.045);for(let i=0;i<nt;i++){const q=Math.sqrt((i+.5)/nt),a=i*2.39996,t=1-.2*q,r=rf(t)*.95,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,h*t]);
      td+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}E('path',{d:td,fill:o.tip,opacity:.75},k)}
  /* the open florets round the foot: fine styles curving out of the dome */
  if(o.ring){let sd='';const nr=DET>=1.5?34:20;for(let i=0;i<nr;i++){const a=i/nr*6.283+R(-.05,.05),c0=[Math.cos(a),Math.sin(a)],p0=[c0[0]*rb*.92,c0[1]*rb*.92,h*.06],p1=[c0[0]*rb*1.12,c0[1]*rb*1.12,h*.32],p2=[c0[0]*rb*1.22,c0[1]*rb*1.22,h*.46];
      if(toV(B,[c0[0],c0[1],.4])[2]<-.25)continue;const q=[p0,p1,p2].map(p=>PJ(B,O,p));sd+=`M${f(q[0][0])},${f(q[0][1])}Q${f(q[1][0])},${f(q[1][1])} ${f(q[2][0])},${f(q[2][1])}`}
    if(sd)E('path',{d:sd,stroke:o.ring,'stroke-width':f(Math.max(.35,rb*.02)),'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},k)}}
/* ---------- the receptacle under a head (the swollen tip of the stem, clad in the bases of the bracts): a body of revolution from z0 to z1, radius r at its widest; it closes the head seen from behind ---------- */
/* its radius at the height z (the bracts are set on it, never beside it) */
const protBodyR=(r,z0,z1,o={})=>z=>{const t=Math.max(0,Math.min(1,(z-z0)/(z1-z0)));return r*Math.pow(Math.sin(Math.PI*(.08+.84*t)),o.pw??.6)*(1-(o.taper??0)*(1-t))};
function protBody(k,B,O,r,z0,z1,col,o={}){const pts=[],rz=protBodyR(r,z0,z1,o),rad=t=>rz(z0+(z1-z0)*t);
  for(let i=0;i<=8;i++){const t=i/8,rr=rad(t),z=z0+(z1-z0)*t;for(let j=0;j<14;j++){const a=j/14*6.283,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]);pts.push([p[0],p[1]])}}
  E('path',{d:smooth(hull2(pts)),fill:LOD?col:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.5},k);
  /* the small imbricate scales that clad it, where it faces the eye */
  if(o.scales&&!LOD){let d='';const n=o.scales;for(let i=0;i<n;i++){const t=.12+.7*((i*.618)%1),a=i*2.39996,rr=rad(t),z=z0+(z1-z0)*t,nV=toV(B,[Math.cos(a),Math.sin(a),-.4])[2];if(nV<.15)continue;
      const w=r*.22,c=[Math.cos(a)*rr,Math.sin(a)*rr,z],tg=[-Math.sin(a),Math.cos(a),0],p0=PJ(B,O,V3.add(c,V3.sc(tg,-w))),p1=PJ(B,O,V3.add(V3.add(c,[0,0,-(z1-z0)*.12]),V3.sc([Math.cos(a),Math.sin(a),0],r*.06))),p2=PJ(B,O,V3.add(c,V3.sc(tg,w)));
      d+=`M${f(p0[0])},${f(p0[1])}Q${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}`}if(d)E('path',{d,stroke:shd(col,-.45),'stroke-width':f(Math.max(.35,r*.03)),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},k)}}
/* ---------- the cone of a conebush in the heart of its cup: an egg of spiral scales (female), or a rounded head of tiny flowers (male) ---------- */
function protCone(k,B,O,r,h,col,o={}){const pts=[],z0=-h*.12;for(let i=0;i<=8;i++){const u=i/8*Math.PI,rr=r*Math.sin(u)*(1-.12*Math.cos(u)),z=z0+(h-z0)*(1-Math.cos(u))/2;for(let j=0;j<14;j++){const a=j/14*6.283,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]);pts.push([p[0],p[1]])}}
  E('path',{d:smooth(hull2(pts)),fill:budFill(col),stroke:shd(col,-.55),'stroke-width':.4,'stroke-opacity':.6},k);if(LOD)return;
  if(o.male){let d='';const n=DET>=1.5?40:22,rr=Math.max(.4,r*.09);for(let i=0;i<n;i++){const q=(i+.5)/n,u=Math.acos(Math.max(-1,1-q*1.4)),a=i*2.39996,ro=r*Math.sin(u)*(1+.12*Math.cos(u)),z=h-(h-z0)*(1-Math.cos(u))/2,nV=toV(B,[Math.cos(a)*Math.sin(u),Math.sin(a)*Math.sin(u),Math.cos(u)*.6]);
      if(nV[2]<.1)continue;const p=PJ(B,O,[Math.cos(a)*ro,Math.sin(a)*ro,z]);d+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
    if(d)E('path',{d,fill:o.dc||shd(col,.35),opacity:.75},k);return}
  /* the scales: short arcs in two spiral families, on the side facing the eye */
  let d='';const ns=DET>=1.5?13:8;for(const sg of[1,-1])for(let s=0;s<ns;s++){const a0=s/ns*6.283;let run=[];const fl=()=>{if(run.length>1)d+=smooth(run,false);run=[]};
    for(let i=0;i<=7;i++){const u=(.12+.8*i/7)*Math.PI,a=a0+sg*u*.9,rr=r*Math.sin(u)*(1-.12*Math.cos(u)),z=z0+(h-z0)*(1-Math.cos(u))/2,nV=toV(B,[Math.cos(a)*Math.sin(u),Math.sin(a)*Math.sin(u),-Math.cos(u)*.6]);
      if(nV[2]<.12){fl();continue}const p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,z]);run.push([p[0],p[1]])}fl()}
  if(d)E('path',{d,stroke:shd(col,-.45),'stroke-width':f(Math.max(.3,r*.04)),'stroke-opacity':.55,fill:'none'},k);
  if(o.silver)E('path',{d:smooth(hull2(pts)),fill:'#ffffff',opacity:.18},k)}
/* ---------- conebushes (Leucadendron salignum × laureolum and kin): the top leaves of a leafy woody stem turn colour and close into a tulip-shaped cup of bracts round the cone;
   the leaves below blush from green to the colour of the bracts toward the top; the stems branch, each branch ending in its own head ---------- */
const CW_LEUCAD_R=[{id:'safari-sunset',n:'Rouge vin (Safari Sunset)',c:'#9a2434',lf:'#862a30',g:'#5a5e32',cone:'#5a2420',base:'#c8a03c'},
  {id:'red-gem',n:'Rouge bronze (Red Gem)',c:'#a8462e',lf:'#8e4a2e',g:'#5c6834',cone:'#e2d29a',base:'#d4b45a'},
  {id:'red-devil',n:'Cramoisi (Red Devil)',c:'#8c1a2a',lf:'#741c28',g:'#4e4c2c',cone:'#481818'},
  {id:'burgundy-sunset',n:'Framboise, feuillage pourpre (Burgundy Sunset)',c:'#9c2a4a',lf:'#4a1a28',g:'#3e2a24',cone:'#3a1418'},
  {id:'bordeaux',n:'Bordeaux profond',c:'#5e1626',lf:'#4e1a24',g:'#463e2a',cone:'#361216'},
  {id:'pourpre-noir',n:'Pourpre noir',c:'#3e1019',lf:'#361219',g:'#3a3024',cone:'#2a0c10'},
  {id:'jester',n:'Rouge, feuillage panaché crème (Jester)',c:'#b23644',lf:'#c06870',g:'#6a7a40',cone:'#5a2420',v:'#ecd8b0',base:'#e0c070'}];
const CW_LEUCAD_J=[{id:'inca-gold',n:'Jaune d’or liseré de rouge (Inca Gold)',c:'#e8b42a',lf:'#d6aa36',g:'#5c6c30',cone:'#e0c060',rim:'#c2402a',m:1,stc:PROT_WOOD},
  {id:'goldstrike',n:'Jaune vif (Safari Goldstrike)',c:'#f0ca2c',lf:'#e2c040',g:'#526a2c',cone:'#c89c2a',stc:PROT_WOOD},
  {id:'discolor',n:'Crème à cœur rouge (Discolor)',c:'#ece0a0',lf:'#d6d08c',g:'#5a7038',cone:'#d4402a',m:1,dc:'#f0a060',stc:PROT_GREY},
  {id:'jubilee-crown',n:'Vert à cône rubis (Jubilee Crown)',c:'#a6b866',lf:'#90a45a',g:'#4c6830',cone:'#b0304c',tipc:'#c87888',stc:PROT_GREY},
  {id:'pisa',n:'Vert argenté (Pisa)',c:'#b6c2a4',lf:'#a6b49a',g:'#7c8e76',cone:'#ccd0c8',sv:1,stc:PROT_GREY},
  {id:'vert-anis',n:'Vert anis',c:'#bac85a',lf:'#a6b84e',g:'#587832',cone:'#98a03c',stc:PROT_GREY},
  {id:'creme',n:'Jaune crème',c:'#efe2b2',lf:'#ddd29a',g:'#667a44',cone:'#d4bc6a',stc:PROT_GREY}];
const LEUCAD_BR=prof([[0,.3],[.12,.62],[.4,.95],[.62,1],[.86,.6],[1,.1]]),LEUCAD_LF=prof([[0,.22],[.12,.6],[.4,.98],[.6,1],[.85,.6],[1,.04]]);
/* the head: a cup of coloured leaves in a spiral round the cone, closed into a pointed bud, a tulip half open, a star-cup once open */
function leucadHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),n=LOD?9:DET>=1.5?17:13,items=[],green=.28*(1-o2),bo={taper:.55},rb=protBodyR(Dh*.115,-Dh*.38,Dh*.02,bo);
  for(let i=0;i<n;i++){const fr=i/(n-1),out=1-fr,phi=i*2.39996+rot,a0=LERP(.08+.04*out,.38+.18*out,o2)+R(-.03,.03),a1=LERP(-.2-.1*out,.52+.3*out,o2)+R(-.05,.05),
      l=ligule(B,O,{phi,r0:rb(-Dh*(.04+.3*out))*.85,z0:-Dh*(.04+.3*out),L:Dh*LERP(.74-.2*fr,.72+.1*fr,o2)*R(.94,1.05),W:Dh*(.15+.025*fr),wp:LEUCAD_BR,a0,a1,pw:1.3,th:.85,tip:'round',tw:R(-.2,.2),n:7}),
      c=mix(mix(cw.c,cw.lf||cw.c,.35*out*out),cw.g,green);
    items.push({l,z:protZ(l,B,phi,out*2,Dh),c,cb:mix(c,shd(c,-.12),.5),ov:DET>=1.5?.55:fr>.4?.35:0,basec:cw.base&&o2>.45&&fr>.3?mix(cw.base,c,.5):null,bf:.3,bo:.45*sm01((o2-.45)/.4),tipc:cw.tipc||null,tf:.72,to:.6,rim:cw.rim||null,rw:Math.max(.45,Dh*.007),rf:.68,sw:.45})}
  /* the cone in the heart: hidden in the bud, seen once the cup opens; from behind it is drawn first */
  /* the swollen stem tip clad in the bases of the leaves, under the cone */
  {const bc=shd(mix(cw.lf||cw.c,cw.c,.5),-.22);items.push({z:PJ(B,O,[0,0,-Dh*.18])[2],fn:kk=>protBody(kk,B,O,Dh*.115,-Dh*.38,Dh*.02,bc,bo)})}
  if(o2>.15){const cr=Dh*(cw.m?.16:.12),ch=Dh*(cw.m?.22:.34)*(.6+.4*o2),cz=nz<-.15?-1e9:PJ(B,O,[0,0,ch*.4])[2];items.push({z:cz,fn:kk=>protCone(kk,B,O,cr,ch,cw.cone,{male:cw.m,silver:cw.sv,dc:cw.dc})})}
  protLig(k,items);return k}
function leucadPlant(g,t,o,list,LL){const cw=cwPick(list,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||8)*UPC*(cw.sz||1),k=G(g),
    /* the leaves blush toward the top: green below with a red margin, then a flushed tip, then wholly the colour of the bracts */
    lf=(og,pos)=>{const i=og.p.i,tt=sm01(1-(i-1)/(og.p.lat?4:8)),c=tt>.72?mix(cw.lf,cw.c,(tt-.72)*2.2):mix(cw.g,cw.lf,tt*.75),len=LL*UPC*R(.86,1.08)*(og.p.lat?.8:1)*(1-.18*tt);
      return protLeaf(og,pos,len,.27,c,{wp:LEUCAD_LF,droop:.04,arch:.06,fold:.16,face:.3,flush:tt>.04&&tt<=.72?mix(cw.lf,cw.c,.5):null,ff:.66-.5*tt,fo:.92,vc:cw.v&&tt<.6?cw.v:null,ec:shd(cw.lf,-.3),eo:.35+.3*tt,bc:tt>.3?mix(c,shd(c,.15),.6):undefined})},
    P={D:Dh,op,w:.46*UPC,cols:cw.stc||PROT_WOOD,nodes:20,li:1.15*UPC,lp:.45*UPC,bare:6*UPC,aimK:.1,leaf:{ang:(i,lat)=>{const tt=sm01(1-(i-1)/(lat?3:5));return 26-tt*(14-10*sm01(op))},draw:lf},
      lat:{p:.62,n:[1,2.6],top:[3,7],nodes:4,li:1.1*UPC,lp:.7*UPC,ang:34,age:[.5,1],sz:.82,e:.05},head:(par,B,O,D2,op2,inf)=>leucadHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- pincushion (Leucospermum cordifolium and hybrids): a flattened globe of a hundred flowers whose long wiry styles spring out of their curled perianths and curve toward the top,
   each tipped with its knob (the pollen presenter); the flowers open from the rim to the centre; obovate grey-green leaves with three to six horny teeth at the tip (the upper ones entire) ---------- */
const CW_LEUCOSP=[{id:'tango',n:'Orange (Tango)',c:'#f07a22',st:'#f48e2e',pp:'#c84814'},
  {id:'high-gold',n:'Jaune d’or (High Gold)',c:'#f2bc22',st:'#f6cc3a',pp:'#d88a10'},
  {id:'succession',n:'Orange rouge (Succession)',c:'#e8562a',st:'#ee682e',pp:'#a82814'},
  {id:'scarlet-ribbon',n:'Rouge écarlate (Scarlet Ribbon)',c:'#d42c2a',st:'#dc3a2e',pp:'#8a1416'},
  {id:'saumon',n:'Saumon',c:'#f09078',st:'#f4a48a',pp:'#d05a44'},
  {id:'veldfire',n:'Jaune à rubans rouges (Veldfire)',c:'#e8481f',st:'#f2c530',pp:'#d88c14',cu:'#e65a24',f:'bi'}];
const LEUCOSP_SC=['#344326','#506238','#7a8c5e','#aab892'],LEUCOSP_LF=prof([[0,.55],[.15,.82],[.45,1],[.75,.94],[.92,.74],[1,.5]]);
function leucospHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.08)/.92),q=sm01((op-.22)/.62),rot=R(0,6.283),det=DET>=1.5,
    a=Dh*(.22+.03*o2),hz=Dh*(.17+.02*o2),zc=Dh*.05,bud=q<.02,cu=bud?mix(cw.cu||shd(cw.c,-.12),'#8f9c78',.52):cw.cu||shd(cw.c,-.12);
  const sp=(th,ph)=>[a*Math.sin(th)*Math.cos(ph),a*Math.sin(th)*Math.sin(ph),zc+hz*Math.cos(th)],sn=(th,ph)=>V3.nz([Math.sin(th)*Math.cos(ph)/a,Math.sin(th)*Math.sin(ph)/a,Math.cos(th)/hz]);
  /* the small grey involucral bracts under the head, seen from the side and from behind */
  const br=()=>capBracts(k,B,O,a*1.15,11,'#8a9474',{len:.34,w:.22,a0:1.9,a1:2.5});if(nz<.45&&nz>=0)br();
  const N=Math.round((det?120:66)*(LOD?.5:1)),thM=2.05,grp={b:[],m:[],f:[]},stubs=[],curls=[];
  for(let i=0;i<N;i++){const t=(i+.5)/N,th=Math.acos(1-t*(1-Math.cos(thM))),ph=i*2.39996+rot,p0=sp(th,ph),n=sn(th,ph),nv=toV(B,n)[2];
    if(th/thM>1-q){const Ls=Dh*(.27+.08*Math.sin(th))*R(.94,1.06)*(.8+.2*q),kc=.35+.3*Math.sin(th),e=V3.nz(V3.add(V3.sc(n,1-kc),[0,0,kc])),p1=V3.add(p0,V3.sc(n,Ls*.55)),p2=V3.add(p1,V3.sc(e,Ls*.5));
      (nv<-.2?grp.b:nv<.3?grp.m:grp.f).push([p0,p1,p2,e]);if(nv>-.1)curls.push([p0,n])}
    else if(nv>-.05)stubs.push([p0,n,th])}
  const pS=pal7(cw.st),pK=pal7(cw.pp),ws=Math.max(.55,Dh*.011),kr=Dh*.017,ky=Dh*.0095;
  const styles=(L,I)=>{if(!L.length)return;let d='',dk='',dh='';for(const[p0,p1,p2,e]of L){const s0=PJ(B,O,p0),s1=PJ(B,O,p1),s2=PJ(B,O,p2),ev=toV(B,e),el=Math.hypot(ev[0],ev[1])||1,ux=ev[0]/el,uy=-ev[1]/el,rx=kr*(.45+.55*el);
      d+=`M${f(s0[0])},${f(s0[1])}Q${f(s1[0])},${f(s1[1])} ${f(s2[0])},${f(s2[1])}`;const an=Math.atan2(uy,ux)/D;
      dk+=`M${f(s2[0]-ux*rx*.5)},${f(s2[1]-uy*rx*.5)}a${f(rx)},${f(ky)} ${f(an)} 1,0 ${f(ux*rx*2)},${f(uy*rx*2)}a${f(rx)},${f(ky)} ${f(an)} 1,0 ${f(-ux*rx*2)},${f(-uy*rx*2)}`;
      if(det&&I>.6)dh+=`M${f(s1[0]-.3)},${f(s1[1]-.3)}L${f(s2[0]-.3)},${f(s2[1]-.3)}`}
    E('path',{d,stroke:toneAt(pS,I),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);if(dh)E('path',{d:dh,stroke:pS.l2,'stroke-width':f(ws*.4),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);
    E('path',{d:dk,fill:toneAt(pK,I),stroke:pK.ink,'stroke-width':.25,'stroke-opacity':det?.5:0},k)};
  styles(grp.b,.36);
  /* the cushion of curled perianths (in the bud: the closed flowers, felted, the colour only showing) */
  const hp=[];for(let i=0;i<=10;i++)for(let j=0;j<14;j++){const p=PJ(B,O,sp(i/10*Math.PI,j/14*6.283));hp.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(hp)),fill:budFill(cu),stroke:shd(cu,-.5),'stroke-width':.4,'stroke-opacity':.55},k);
  /* the perianths split and curled back round each style: little ribbons over the cushion, shaded and lit */
  if(!LOD){let dc='',dl='';for(const[p0,n]of curls){const r=V3.nz([n[0]+R(-.4,.4),n[1]+R(-.4,.4),0]),c1=V3.add(p0,V3.sc(n,Dh*.04)),c2=V3.add(V3.add(p0,V3.sc(n,Dh*.022)),V3.sc(r,Dh*.04)),s0=PJ(B,O,p0),s1=PJ(B,O,c1),s2=PJ(B,O,c2);
      dc+=`M${f(s0[0])},${f(s0[1])}Q${f(s1[0])},${f(s1[1])} ${f(s2[0])},${f(s2[1])}`;dl+=`M${f(s0[0]-.35)},${f(s0[1]-.4)}Q${f(s1[0]-.35)},${f(s1[1]-.4)} ${f(s2[0]-.35)},${f(s2[1]-.4)}`}
    if(dc){E('path',{d:dc,stroke:shd(cu,-.38),'stroke-width':f(Math.max(.45,Dh*.012)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);E('path',{d:dl,stroke:shd(cu,.35),'stroke-width':f(Math.max(.3,Dh*.006)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},k)}
    /* the flowers still closed: hooked perianth tips standing in the centre, felted */
    if(stubs.length){let ds='',dl='';const sc=bud?mix(cw.c,'#9ca88a',.5):lt(cw.c,.12);for(const[p0,n,th]of stubs){const tp=V3.add(p0,V3.sc(V3.nz(V3.add(n,[0,0,.5])),Dh*(bud?.035:.05))),s0=PJ(B,O,p0),s1=PJ(B,O,tp);ds+=`M${f(s0[0])},${f(s0[1])}L${f(s1[0])},${f(s1[1])}`;if(det)dl+=`M${f(s1[0]-.25)},${f(s1[1]-.3)}l.01,0`}
      E('path',{d:ds,stroke:toneAt(pal7(sc),.62),'stroke-width':f(Math.max(.8,Dh*.024)),fill:'none','stroke-linecap':'round','stroke-opacity':.95},k);E('path',{d:ds,stroke:shd(sc,-.4),'stroke-width':f(Math.max(.3,Dh*.008)),fill:'none','stroke-linecap':'round','stroke-opacity':.5},k);
      if(dl)E('path',{d:dl,stroke:'#ffffff','stroke-width':f(Dh*.012),'stroke-opacity':.5,'stroke-linecap':'round'},k)}}
  styles(grp.m,.54);styles(grp.f,.7);if(nz<0)br();return k}
function leucospPlant(g,t,o){const cw=cwPick(CW_LEUCOSP,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||11)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>{const i=og.p.i,top=i<=2,len=5.6*UPC*R(.88,1.1)*(og.p.lat?.75:1)*(top?.8:1);
      return protLeaf(og,pos,len,.46,'#7c9468',{wp:LEUCOSP_LF,teeth:top?0:Math.round(R(3,5)),round:top,bulge:.14,droop:.05,arch:.05,fold:.1,face:.35,tc:'#8a3a26',ec:'#c4d0b0',eo:.55,bc:'#a8b496'})},
    P={D:Dh,op,w:.58*UPC,cols:LEUCOSP_SC,nodes:13,li:1.8*UPC,lp:2.2*UPC,bare:6*UPC,aimK:.13,topAng:22,leaf:{ang:32,draw:lf},
      lat:{p:.35,n:[1,1],top:[1,3],nodes:2,li:1.4*UPC,lp:1.6*UPC,ang:46,age:[.05,.8],sz:.85,e:.04},head:(par,B,O,D2,op2,inf)=>leucospHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- king protea (Protea cynaroides): a huge bowl of bracts in spiral rows — short brown silky ones outside, long pointed coloured ones inside, hairy on their margins —
   round a high dome of silky florets; the bud an artichoke; a thick woody stem with a few round glossy leaves on long red petioles ---------- */
const CW_PROT_KING=[{id:'rose',n:'Rose argenté',c:'#eaa2b6',tc:'#d87090',bc:'#f2d8dc',ob:'#a88a7a',dome:'#f3e6e4',tip:'#d88aa0'},
  {id:'rose-vif',n:'Rose soutenu',c:'#e07a98',tc:'#c84a72',bc:'#f0c4cc',ob:'#9a6a62',dome:'#f6ece8',tip:'#c8607a'},
  {id:'rouge',n:'Rouge (Red King)',c:'#b8283e',tc:'#8e1a2e',bc:'#e08a96',ob:'#7a4a3a',dome:'#f2e6e2',tip:'#a83048'},
  {id:'arctic-ice',n:'Blanc crème (Arctic Ice)',c:'#f2ecdc',tc:'#e8dcc0',bc:'#e2e6c6',ob:'#b8a888',dome:'#f6f2ea',tip:'#d4c4a4',hair:'#ffffff'},
  {id:'saumon',n:'Rose saumoné',c:'#f0a690',tc:'#e07a68',bc:'#f6d8c8',ob:'#a8806a',dome:'#f6eee6',tip:'#d8806a'},
  {id:'madiba',n:'Rose rouge, petite tête (Madiba)',c:'#d0506e',tc:'#b03050',bc:'#ecb0bc',ob:'#8a5a52',dome:'#f4e8e6',tip:'#c04060',sz:.72,f:'petite'},
  {id:'little-prince',n:'Rouge à cœur blanc, petite tête (Little Prince)',c:'#c43448',tc:'#9a2034',bc:'#e8a0aa',ob:'#7a4a3a',dome:'#faf2f0',tip:'#e0a0b0',sz:.6,f:'petite'}];
const PROTK_OB=prof([[0,.55],[.3,1],[.7,.75],[1,.05]]),PROTK_MB=prof([[0,.5],[.25,.95],[.5,1],[.8,.55],[1,.04]]),PROTK_IB=prof([[0,.55],[.15,.86],[.4,1],[.66,.86],[.86,.46],[1,.02]]),
  PROTK_LF=prof([[0,.42],[.15,.8],[.45,1],[.75,.9],[.92,.58],[1,.14]]);
function protKingHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),items=[],det=DET>=1.5,ns=LOD?[5,6,10]:det?[9,12,26]:[7,9,16],hair=cw.hair||'#f8f4f4',
    rc=Dh*LERP(.1,.165,o2),ro={pw:.5},rr=protBodyR(rc,-Dh*.13,Dh*.01,ro),
    /* the small scale-like bracts that clad the underside of the receptacle, turned back toward the stem (seen from the side and from behind) */
    nb=LOD?0:det?13:9,scl=mix(cw.ob,'#4a3022',.2),
    /* each row: length, half-width, its opening (bud → open) at the base and at the tip, where it starts (radius and height, bud → open) */
    S=[{L:[.13,.16],W:.085,a0:[.65,1.2],a1:[.1,1.5],r0:[.11,.15],z0:-.1,c:mix(cw.ob,cw.c,.2),wp:PROTK_OB,th:.5,n:4},
       {L:[.25,.3],W:.072,a0:[.45,.85],a1:[-.3,1.02],r0:[.1,.16],z0:-.06,c:mix(cw.c,cw.ob,.45),wp:PROTK_MB,th:.6,n:6},
       {L:[.36,.48],W:.066,a0:[.3,.46],a1:[-.78,.66],r0:[.09,.17],z0:-.02,c:cw.c,wp:PROTK_IB,th:.75,n:8}];
  S.forEach((s,si)=>{const nn=ns[si],rank=2-si,inner=si===2;for(let i=0;i<nn;i++){const phi=(i+si*.37)/nn*6.283+rot+R(-.08,.08),
      l=ligule(B,O,{phi,r0:Math.min(Dh*LERP(s.r0[0],s.r0[1],o2),rr(Dh*s.z0)*.92),z0:Dh*s.z0,L:Dh*LERP(s.L[0],s.L[1],o2)*R(.93,1.05),W:Dh*s.W*R(.92,1.08),wp:s.wp,a0:LERP(s.a0[0],s.a0[1],o2)+R(-.04,.04),a1:LERP(s.a1[0],s.a1[1],o2)+R(-.05,.05),pw:1.25,th:s.th,tip:'point',tw:R(-.2,.2),wav:inner?.03:0,n:s.n}),
      c=inner?mix(cw.c,shd(cw.c,R(-.07,.05)),.5):s.c;
    items.push({l,z:protZ(l,B,phi,rank,Dh),c,cb:mix(c,'#efe8ee',inner?.07:.16),ov:inner||det&&si?(det?.38:.3):0,tipc:inner?cw.tc:null,tf:.72,to:.32,basec:inner&&o2>.3&&det?cw.bc:null,bf:.28,bo:.5,
      hair:inner?null:hair,hw:Math.max(.35,Dh*.006),ho:(si?.28:.55)*(.6+.4*o2),hf:si?.4:.05,sheen:inner&&det?Math.max(.5,Dh*.007):0,sw:.4})}});
  if(nz<.5)for(let i=0;i<nb;i++){const phi=i/nb*6.283+rot+.3,l=ligule(B,O,{phi,r0:rr(-Dh*.07)*.85,z0:-Dh*.07,L:Dh*.13*R(.9,1.1),W:Dh*.065,wp:PROTK_OB,a0:1.95,a1:2.5,pw:1.2,th:.5,tip:'point',n:3});
    items.push({l,z:l.z+toV(B,[0,0,-1])[2]*Dh*.02,c:scl,cb:mix(scl,'#e8dcd4',.22),hair,hw:Math.max(.35,Dh*.005),ho:.55,hf:.1,sw:.4})}
  /* the receptacle under the bowl, clad in the bases of the outer bracts (it closes the head seen from behind) */
  {const bc=mix(cw.ob,cw.c,.15);items.push({z:PJ(B,O,[0,0,-Dh*.06])[2],fn:kk=>protBody(kk,B,O,rc,-Dh*.13,Dh*.01,bc,ro)})}
  /* the dome of florets, hidden in the bud; from behind it goes first */
  if(o2>.3){const h=Dh*(.18+.1*o2),rb=Dh*.15,cz=nz<-.1?-1e9:PJ(B,O,[0,0,h*.35])[2];items.push({z:cz,fn:kk=>protDome(kk,B,O,rb,h,{col:cw.dome,tip:cw.tip,ring:o2>.85?lt(cw.dome,.25):null,pk:1.8})})}
  protLig(k,items);return k}
function protKingPlant(g,t,o){const cw=cwPick(CW_PROT_KING,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||20)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>protLeaf(og,pos,13*UPC*R(.86,1.08)*(og.p.i<=1?.8:1),.62,'#3d5a30',{pet:.33,pc:'#7a3a2a',pw:2.2,wp:PROTK_LF,droop:.06,arch:.05,fold:.08,face:.45,ec:'#8a3a2c',eo:.6,bc:'#7a9068',mw:.008}),
    P={D:Dh,op,w:1.2*UPC,cols:PROT_WOOD,nodes:6,li:3.5*UPC,lp:3.4*UPC,bare:6*UPC,aimK:.12,topAng:30,leaf:{ang:40,draw:lf},head:(par,B,O,D2,op2,inf)=>protKingHead(par,B,O,D2,op2,cw,inf),zhk:.35,piece:9};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- hybrid proteas (Pink Ice, Sylvia, Niobe… and the little proteas): a tall goblet of spoon-shaped bracts, their tips fringed with silky down (a dark beard in Niobe),
   the dome of florets hidden inside until it opens; narrow leathery grey-green leaves pressed up the stem ---------- */
const CW_PROT_HYB=[{id:'pink-ice',n:'Rose givré (Pink Ice)',c:'#e2809c',tc:'#c85a7a',fr:'#f6f0f2',ob:'#9a7062',dome:'#f4e4e8',tip:'#a02848'},
  {id:'sylvia',n:'Cerise (Sylvia)',c:'#c83a5c',tc:'#a8243e',fr:'#efe0e4',ob:'#8a5048',dome:'#f2e2e6',tip:'#8a1a34'},
  {id:'niobe',n:'Crème à barbe pourpre (Niobe)',c:'#ece2c4',tc:'#d8c8a0',fr:'#3a1830',ob:'#9a8a6a',dome:'#f0e8e8',tip:'#4a1a3a',beard:1},
  {id:'cardinal',n:'Rouge (Cardinal)',c:'#ae2a3c',tc:'#8a1a2c',fr:'#f0e4e6',ob:'#7a4a3a',dome:'#f2e6e6',tip:'#7a1a2a'},
  {id:'susara',n:'Rose crème (Susara)',c:'#ecbcc4',tc:'#e09aaa',fr:'#faf4f2',ob:'#a88a7a',dome:'#f6eeee',tip:'#c87a8a'},
  {id:'brenda',n:'Rose framboise (Brenda)',c:'#d6607c',tc:'#b84462',fr:'#f4e8ec',ob:'#8a5a52',dome:'#f4e6ea',tip:'#9a2a4a'},
  {id:'scolymocephala',n:'Petite protée vert crème (P. scolymocephala)',c:'#d9dca4',tc:'#c8cc8a',fr:null,ob:'#9aa070',dome:'#e8c8b0',tip:'#b84a3a',sz:.42,f:'petite',mini:1}];
const PROTH_OB=prof([[0,.6],[.35,1],[.75,.85],[1,.4]]),PROTH_IB=prof([[0,.46],[.2,.66],[.55,.92],[.8,1],[.95,.8],[1,.45]]),PROTH_LF=prof([[0,.32],[.12,.72],[.4,.97],[.72,1],[.92,.7],[1,.2]]);
function protHybHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),items=[],det=DET>=1.5,mini=!!cw.mini,ns=LOD?[5,6,8]:det?[8,11,18]:[7,9,13],ro={pw:.5},rr=protBodyR(Dh*.115,-Dh*.09,Dh*.01,ro),
    S=[{L:.17,W:.095,a0:[.3,.42],a1:[.1,.3],r0:.1,z0:-.05,c:mix(cw.ob,cw.c,.25),wp:PROTH_OB,th:.6,n:4},
       {L:.42,W:.085,a0:[.14,.32],a1:[-.02,.42],r0:.11,z0:-.03,c:mix(cw.c,cw.ob,.3),wp:PROTH_IB,th:.6,n:6},
       {L:mini?.6:.74,W:mini?.1:.078,a0:[.06,mini?.22:.15],a1:[-.16,mini?.32:.16],r0:.12,z0:-.01,c:cw.c,wp:PROTH_IB,th:.65,n:8}];
  S.forEach((s,si)=>{const nn=ns[si],rank=2-si,inner=si===2;for(let i=0;i<nn;i++){const phi=(i+si*.41)/nn*6.283+rot+R(-.08,.08),
      l=ligule(B,O,{phi,r0:Math.min(Dh*s.r0,rr(Dh*s.z0)*.92),z0:Dh*s.z0,L:Dh*s.L*R(.93,1.05)*(inner?.8+.2*o2:1),W:Dh*s.W*R(.92,1.08),wp:s.wp,a0:LERP(s.a0[0],s.a0[1],o2)+R(-.03,.03),a1:LERP(s.a1[0],s.a1[1],o2)+R(-.05,.05),pw:1.3,th:s.th,tip:'round',tw:R(-.2,.2),n:s.n}),
      c=inner?mix(cw.c,shd(cw.c,R(-.07,.06)),.5):s.c,fr=si>0&&cw.fr;
    /* the fringe: the tip frosted with down (its colour washed over the end of the bract), its margin hairy */
    items.push({l,z:protZ(l,B,phi,rank,Dh),c,cb:mix(c,'#efe6ea',.1),ov:inner||det&&si?(det?.45:.35):0,tipc:fr?cw.fr:inner?cw.tc:null,tf:fr?(cw.beard?.8:.84):.55,to:fr?(cw.beard?.7:.5):.45,
      hair:fr?cw.fr:det?'#f2eef0':null,hw:fr?Math.max(.45,Dh*(cw.beard?.012:.007)):Math.max(.35,Dh*.006),fz:0,ho:fr?.85:.4,hf:fr?.8:.1,hl:fr?Dh*(cw.beard?.026:.02):0,sw:.4})}});
  {const bc=mix(cw.ob,cw.c,.15);items.push({z:PJ(B,O,[0,0,-Dh*.04])[2],fn:kk=>protBody(kk,B,O,Dh*.115,-Dh*.09,Dh*.01,bc,Object.assign({scales:DET>=1.5?12:7},ro))})}
  if(o2>.3){const h=Dh*(.3+.2*o2),rb=Dh*.1,cz=nz<-.1?-1e9:PJ(B,O,[0,0,h*.4])[2];items.push({z:cz,fn:kk=>protDome(kk,B,O,rb,h,{col:cw.dome,tip:cw.tip,pk:1.5})})}
  protLig(k,items);return k}
function protHybPlant(g,t,o){const cw=cwPick(CW_PROT_HYB,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||11)*UPC*(cw.sz||1),k=G(g),mini=!!cw.mini,
    lf=(og,pos)=>protLeaf(og,pos,(mini?5:10.5)*UPC*R(.86,1.08)*(og.p.lat?.75:1)*(og.p.lat?1:1-.4*sm01(1-(og.p.i-1)/5)),mini?.15:.23,'#6e8a78',{wp:PROTH_LF,round:1,droop:.04,arch:.05,fold:.14,face:.3,ec:'#9a5a52',eo:.45,bc:'#a4b4a8'}),
    P={D:Dh,op,w:(mini?.4:.7)*UPC,cols:['#3e2e22','#5e4a36','#86704f','#b4a07e'],nodes:mini?16:14,li:(mini?1.1:1.6)*UPC,lp:1.1*UPC,bare:6*UPC,aimK:.11,topAng:28,leaf:{ang:22,draw:lf},
      lat:{p:mini?.6:.18,n:[1,mini?2:1],top:[2,5],nodes:3,li:1.2*UPC,lp:1*UPC,ang:30,age:[.05,mini?.9:.35],sz:.8,e:.05},head:(par,B,O,D2,op2,inf)=>protHybHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- the registers ---------- */
Object.assign(GH,{'leucadendron-rouges':(g,t,o)=>leucadPlant(g,t,o,CW_LEUCAD_R,8),'leucadendron-jaunes-verts':(g,t,o)=>leucadPlant(g,t,o,CW_LEUCAD_J,7.2),'leucospermum':leucospPlant,'protea-cynaroides':protKingPlant,'protea-hybrides':protHybPlant});
Object.assign(CWS,{'leucadendron-rouges':CW_LEUCAD_R,'leucadendron-jaunes-verts':CW_LEUCAD_J,'leucospermum':CW_LEUCOSP,'protea-cynaroides':CW_PROT_KING,'protea-hybrides':CW_PROT_HYB});
Object.assign(SZG,{'leucadendron-rouges':[6,7,7,8,9],'leucadendron-jaunes-verts':[5,6,6,7,8],'leucospermum':[8,9,10,11,12],'protea-cynaroides':[14,16,18,20,22,25],'protea-hybrides':[8,9,10,11,12]});
Object.assign(GHI,{'leucadendron-rouges':{form:'cornet',size:2,k:'head',rk:.9},'leucadendron-jaunes-verts':{form:'cornet',size:2,k:'head',rk:.9},'leucospermum':{form:'sphere',size:2.5,k:'head',rk:1},
  'protea-cynaroides':{form:'disque',size:3,k:'head',rk:1},'protea-hybrides':{form:'cornet',size:2.5,k:'head',rk:.85}});
for(const id of['leucadendron-rouges','leucadendron-jaunes-verts','leucospermum','protea-cynaroides','protea-hybrides'])GH_BUDS.add(id);
