/* ================= Serre, lot 5 — Dahlias : décoratif, balle, pompon, cactus, lacinié ================= */
/* ---------- a ligule as one projected outline: base on the receptacle, spine opening from a0 to a1 (radians off the axis), rolled (th>0 toward the face = cornet, th<0 back = quill), tip round, point or fringe ---------- */
function ligule(B,O,o){const n=o.n||6,ph=o.phi,R0=[Math.cos(ph),Math.sin(ph),0],T=[-Math.sin(ph),Math.cos(ph),0],sp=[],dv=[];let p=[R0[0]*o.r0,R0[1]*o.r0,o.z0];
  for(let i=0;i<=n;i++){const t=i/n,a=o.a0+(o.a1-o.a0)*Math.pow(t,o.pw||1.4),d=V3.add(V3.sc(R0,Math.sin(a)),[0,0,Math.cos(a)]);dv.push(d);if(i)p=V3.add(p,V3.sc(d,o.L/n));sp.push(p)}
  const tw=o.tw||0,sec=(i,u)=>{const t=i/n,d=dv[i],N0=V3.cr(d,T),c=Math.cos(tw*t),s=Math.sin(tw*t),A=V3.add(V3.sc(T,c),V3.sc(N0,s)),N=V3.cr(d,A),w=o.W*o.wp(t),th=(o.th||0)*(o.thp?o.thp(t):1);
    const x=Math.abs(th)<1e-3?w*u:w*Math.sin(u*th)/th,y=(Math.abs(th)<1e-3?0:w*(1-Math.cos(u*th))/th)+(o.wav?o.wav*w*Math.abs(u)*Math.sin(t*(o.wk||5)*Math.PI+u*1.7+ph*3):0);return V3.add(V3.add(sp[i],V3.sc(A,x)),V3.sc(N,y))};
  const S=[],Lf=[],Rt=[];for(let i=0;i<=n;i++){const row=[-1,-.5,0,.5,1].map(u=>PJ(B,O,sec(i,u)));S.push(row)}
  for(let i=0;i<=n;i++){const a=S[Math.max(0,i-1)][2],b=S[Math.min(n,i+1)][2];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;const px=-dy/l,py=dx/l,c=S[i][2];let mn=1e9,mx=-1e9,pl=S[i][0],pr=S[i][4];
    for(const q of S[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push(pl);Rt.push(pr)}
  const e=S[n][2],e0=S[n-1][2],ea=Math.atan2(e[1]-e0[1],e[0]-e0[0]),tip=[];
  if(o.tip==='point'){tip.push([e[0]+Math.cos(ea)*o.W*.5,e[1]+Math.sin(ea)*o.W*.5])}
  else if(o.tip==='fringe'){const k=o.fr||3,L0=Lf[n],R1=Rt[n];for(let j=1;j<k*2;j++){const t=j/(k*2),bx=L0[0]+(R1[0]-L0[0])*t,by=L0[1]+(R1[1]-L0[1])*t,out=(j%2?o.W*(.7+.3*Math.sin(j*3.1+ph)):-o.W*.15)*(o.fd||1);tip.push([bx+Math.cos(ea)*out,by+Math.sin(ea)*out])}}
  else{const L0=Lf[n],R1=Rt[n],mx=(L0[0]+R1[0])/2,my=(L0[1]+R1[1])/2,rr=Math.hypot(R1[0]-L0[0],R1[1]-L0[1])/2,aL=Math.atan2(L0[1]-my,L0[0]-mx),s=Math.cos(aL+Math.PI/2-ea)>0?1:-1;
    for(let j=1;j<6;j++){const a=aL+s*Math.PI*j/6;tip.push([mx+Math.cos(a)*rr,my+Math.sin(a)*rr])}}
  const out=Lf.map(q=>[q[0],q[1]]).concat(tip,Rt.slice().reverse().map(q=>[q[0],q[1]]));let z=0;for(const r of S)z+=r[2][2];z/=S.length;
  const nm=V3.nz(toV(B,V3.cr(dv[n>>1],T))),mouth=[];if(o.mouth){const i=n;for(let k=0;k<10;k++){const u=-1+2*k/9;mouth.push(PJ(B,O,sec(i,u)))}}
  return{out,z,nm,tipDir:toV(B,dv[n]),mouth,S}}
/* the colourways: c ligules, c2 toward the heart, tip (bicolour tips), back (reverse), mouth (inside of the cornets), edge (picotee of a pompon), marble */
const CW_DDEC=[
 {id:'blanc',n:'Blanc (Bridezilla)',c:'#f8f6ee',c2:'#efe8c8'},{id:'nacre',n:'Nacre rosé',c:'#f6ebe8',c2:'#f2d6dc'},{id:'creme',n:'Crème',c:'#f2e6c8',c2:'#ecd8a8'},
 {id:'peche',n:'Pêche abricot',c:'#f2b48a',c2:'#f0a060'},{id:'corail',n:'Corail',c:'#f2957a',c2:'#e8705a'},{id:'saumon',n:'Saumon et lavande',c:'#f2a898',c2:'#c8a0c8'},
 {id:'rose',n:'Rose profond',c:'#e05a8a',c2:'#c83a6a'},{id:'fuchsia',n:'Fuchsia',c:'#c62a6c',c2:'#a01a50'},{id:'lavande',n:'Bleu lavande',c:'#b7a6d8',c2:'#9a88c8'},
 {id:'pourpre',n:'Pourpre sombre',c:'#6a1a4a',c2:'#4a0a32'},{id:'rouge',n:'Rouge',c:'#c41f2e',c2:'#a0101e'},{id:'rouge-noir',n:'Rouge noir velouté',c:'#4a0c1e',c2:'#2a0410'},
 {id:'orange',n:'Orange',c:'#ef8c2a',c2:'#e06a1a'},{id:'jaune',n:'Jaune tendre',c:'#f6dc6a',c2:'#f2c840'},{id:'jaune-rose',n:'Jaune et rose mauve',c:'#f4d070',tip:'#d880a8'},
 {id:'blanc-lavande',n:'Blanc et rose lavande',c:'#f6eef4',c2:'#c8a0d0',k2:.9},{id:'corail-jaune',n:'Corail et jaune',c:'#f08a6a',c2:'#f4cc5a',k2:.9},{id:'karma-yin',n:'Pourpre à pointes blanches',c:'#8a2a5a',tip:'#f8f2f2'}];
const CW_DBAL=[
 {id:'blanc',n:'Blanc',c:'#f6f2ea',mouth:'#e8e0c8'},{id:'creme',n:'Crème',c:'#f2e6c6'},{id:'jaune',n:'Jaune',c:'#f2c23a'},{id:'abricot',n:'Abricot bronze',c:'#e8a25a',c2:'#d8843a'},
 {id:'jowey',n:'Saumon, mauve et pêche',c:'#f0a088',c2:'#c88aa8',k2:.85},{id:'corail',n:'Corail pêche',c:'#f29a7c'},{id:'orange',n:'Orange',c:'#e8782a'},{id:'bronze',n:'Bronze orangé',c:'#c8682a',c2:'#a85020'},
 {id:'caramel',n:'Caramel',c:'#c88a4a',c2:'#b06a30'},{id:'rose',n:'Rose profond',c:'#d8507e'},{id:'pourpre',n:'Pourpre sombre',c:'#5e1b3e'},{id:'rouge',n:'Rouge',c:'#c41f2e'},
 {id:'wine-eyed',n:'Crème à cœur vin',c:'#f2e8d8',c2:'#8a1a3a',k2:1},{id:'marbre',n:'Blanc marbré de pourpre',c:'#f6f0f2',marble:'#7a2a6a'}];
const CW_DPOM=[
 {id:'blanc',n:'Blanc',c:'#f7f4ee'},{id:'jaune',n:'Jaune',c:'#f5d02a'},{id:'orange',n:'Orange pêche',c:'#f0a04a'},{id:'bronze',n:'Bronze ambré',c:'#c8783a'},{id:'saumon',n:'Saumon et jaune',c:'#f2987a',c2:'#f4cc5a',k2:.8},
 {id:'rose',n:'Rose',c:'#ec8fb0'},{id:'lavande',n:'Lavande liseré',c:'#c8b0e0',edge:'#6a3a8a'},{id:'pourpre',n:'Pourpre',c:'#7a1f5a'},{id:'rouge-sombre',n:'Rouge très sombre',c:'#5a0a1e'},{id:'kasasagi',n:'Jaune liseré de rouge',c:'#f4cc3a',edge:'#c8202e'}];
const CW_DCAC=[
 {id:'blanc',n:'Blanc',c:'#f7f4ee'},{id:'citron',n:'Jaune citron',c:'#f2e05a'},{id:'jaune',n:'Jaune',c:'#f5d02a'},{id:'orange',n:'Orange',c:'#f07a1e'},{id:'rose',n:'Rose',c:'#f0a0c0'},
 {id:'rose-blanc',n:'Rose et blanc',c:'#f6e8ee',c2:'#e870a0',k2:.9},{id:'purple-gem',n:'Pourpre éclairci aux pointes',c:'#7a1f6a',tip:'#c8a0d8'},{id:'rouge',n:'Rouge',c:'#c41f2e'},
 {id:'cramoisi',n:'Rouge cramoisi',c:'#a8102e'},{id:'pourpre-noir',n:'Pourpre noir',c:'#4a0c22'},{id:'spanish',n:'Jaune et rouge',c:'#f4cc3a',tip:'#d0283a'}];
const CW_DLAC=[
 {id:'fuzzy',n:'Rose à pointes blanches',c:'#e878a8',tip:'#fbf2f6'},{id:'citron',n:'Jaune lavé de rose',c:'#f5df8a',c2:'#f0b0b8',k2:.6},{id:'mauve',n:'Mauve et orange',c:'#b48ab8',tip:'#f0a050'},
 {id:'pinelands',n:'Jaune à pointes rouges',c:'#f4cc3a',tip:'#d0283a'},{id:'show',n:'Rouge à pointes jaunes',c:'#c8202e',tip:'#f4cc3a'},{id:'or',n:'Jaune d’or',c:'#f0b82a'},
 {id:'bronze',n:'Bronze doré',c:'#c9873a',back:'#c06a9a'},{id:'blanc-rose',n:'Blanc rosé',c:'#f6ebe6',c2:'#f0c8d0',k2:.6}];
const LIG={dec:{N:78,W:.13,wp:prof([[0,.3],[.2,.75],[.55,1],[.85,.85],[1,.5]]),tip:'round',th:.3,a0:.15,a1:1.95,L0:.16,L1:.5,cupIn:.9},
 bal:{N:120,W:.085,wp:prof([[0,.5],[.3,.85],[.7,1],[1,.9]]),tip:'round',th:2.6,a0:.1,a1:2.85,L0:.12,L1:.3,mouth:1},
 pom:{N:96,W:.1,wp:prof([[0,.55],[.4,.9],[1,1]]),tip:'round',th:2.9,a0:.1,a1:2.9,L0:.12,L1:.24,mouth:1},
 cac:{N:70,W:.07,wp:prof([[0,.55],[.25,1],[.6,.75],[.9,.3],[1,.06]]),tip:'point',th:-2.4,a0:.2,a1:1.75,L0:.16,L1:.55,thp:t=>sm01((t-.05)/.4)},
 lac:{N:64,W:.11,wp:prof([[0,.4],[.3,.9],[.7,1],[1,.85]]),tip:'fringe',th:-1.2,a0:.2,a1:1.8,L0:.15,L1:.52,thp:t=>sm01((t-.35)/.5),fr:3}};
/* one dahlia head: ligules in golden-angle spirals from the tight heart to the reflexed rim, drawn far to near; green bracts behind */
/* a dahlia bud: a firm green ball held in its bracts, the colour just showing at the top */
function dahliaBud(par,B,O,D,cw){const k=G(par),s=D*.42,bc=['#2a4a1e','#3f6a2a','#5f8a3e'];
  for(let i=0;i<7;i++){const l=ligule(B,O,{phi:i/7*6.283,r0:s*.18,z0:-s*.3,L:s*.62,W:s*.2,wp:prof([[0,.5],[.4,1],[1,.1]]),a0:1.9,a1:2.5,tip:'point',th:.5});if(V3.dot(toV(B,[0,0,1]),[0,0,1])>-2)E('path',{d:smooth(l.out),fill:i%2?bc[1]:bc[2],stroke:bc[0],'stroke-width':.45,'stroke-opacity':.7},k)}
  phalBud(k,B,V3.add(O,toV(B,[0,0,-s*.25])),s,{c:mix('#6f9a42',cw.c,.18)});
  const tp=PJ(B,O,[0,0,s*.55]);E('ellipse',{cx:f(tp[0]),cy:f(tp[1]),rx:f(s*.16),ry:f(s*.12),fill:cw.c,opacity:.85},k);return k}
function dahliaFlower(par,B,O,D,cw,op,kd){if(op<.35)return dahliaBud(par,B,O,D,cw);const K=LIG[kd],k=G(par),Rr=D/2,N=Math.round(K.N*(LOD?.55:1)*(.45+.55*sm01(op/.9))),o2=sm01((op-.15)/.85),items=[],sd=R(0,6);
  /* bracts (seen from behind and the side) */
  const bc=['#2a4a1e','#3f6a2a','#5f8a3e'],ax=toV(B,[0,0,1]);if(ax[2]<.75||op<.4)for(let i=0;i<8;i++){const ph=i/8*6.283+sd,l=ligule(B,O,{phi:ph,r0:Rr*.08,z0:-Rr*.12,L:Rr*(op<.4?.7:.42),W:Rr*.12,wp:prof([[0,.5],[.4,1],[1,.1]]),a0:op<.4?.5:2.1,a1:op<.4?.3:2.6,tip:'point',th:.4});
    items.push({l,c:i%2?bc[1]:bc[2],ink:bc[0],z:l.z-Rr})}
  const ball=kd==='bal'||kd==='pom',Rs=Rr*.9*(.55+.45*sm01(op/.8)),thMax=kd==='pom'?2.7:2.55;
  for(let i=0;i<N;i++){const f0=i/N,f=Math.sqrt(f0),ph=i*2.39996+sd;let l;
    if(ball){/* cornets set on a sphere, each along its radius, wide enough to touch their neighbours (a honeycomb), the outer ones turned back to the stem */
      const cth=1-(i+.5)/N*(1-Math.cos(thMax)),th=Math.acos(cth),sz=.62+.38*Math.min(1,th/1.2);
      l=ligule(B,O,{phi:ph,r0:.68*Rs*Math.sin(th),z0:.68*Rs*Math.cos(th)-Rs*.12,L:.3*Rs*sz*R(.92,1.08),W:Rs*(kd==='pom'?.46:.42)*sz,wp:K.wp,a0:th,a1:th+.05,pw:1,th:op<.4?3.05:2.7,tip:'round',mouth:1})}
    else{const a0=K.a0+(K.a1*.8-K.a0)*f*f*o2,a1=K.a0+(K.a1-K.a0)*f*o2*(1-.15*(1-o2)),L=Rr*(K.L0+(K.L1-K.L0)*f)*(.92+.16*Math.sin(i*1.7))*(op<.4?.6:1),r0=Rr*(.03+.18*f),z0=Rr*(.08-.1*f),th=kd==='dec'?K.th*(1+(K.cupIn||0)*(1-f)*2):K.th;
      l=ligule(B,O,{phi:ph,r0,z0,L,W:Rr*K.W*(.75+.35*f),wp:K.wp,a0,a1,pw:1.5,th,thp:K.thp,tip:K.tip,fr:K.fr,tw:kd==='lac'?R(-.8,.8):kd==='dec'?R(-.15,.15):0,mouth:K.mouth})}
    let c=cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.55)*Math.pow(1-f,1.6));if(cw.marble&&Math.sin(i*7.7+sd)>.35)c=mix(c,cw.marble,.75);c=mix(c,shd(c,R(-.08,.08)),.6);
    items.push({l,c,f,i})}
  items.sort((a,b)=>a.z-b.z||a.l.z-b.l.z);const ov=floretShade(),cache={};
  /* the receptacle under the petals: a dark heart that shows (as shadow) wherever the petals part */
  {const hp=[];for(const it of items)if(!it.ink)for(const q of it.l.out)hp.push(q);if(hp.length>8){let h=hull2(hp),cx=0,cy=0;for(const q of h){cx+=q[0];cy+=q[1]}cx/=h.length;cy/=h.length;
    const sh=ball?.9:.62;h=h.map(q=>[cx+(q[0]-cx)*sh,cy+(q[1]-cy)*sh]);const bi=items.findIndex(it=>!it.ink);const und=E('path',{d:smooth(h),fill:shd(cw.c2||cw.c,-.58)});k.appendChild(und)}}
  for(const it of items){const l=it.l,back=l.nm[2]<0,cc=back&&cw.back?cw.back:back?mix(it.c,'#e8e4d8',.18):it.c,I=lightI(back?V3.sc(l.nm,-1):l.nm),key=cc+Math.round(I*14);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.d2,P.l1]}
    const d=smooth(l.out);E('path',{d,fill:it.ink?it.c:tone[0],stroke:it.ink||tone[1],'stroke-width':.45,'stroke-opacity':.75},k);
    if(it.ink)continue;
    if(!LOD&&l.out.length>8)E('path',{d,fill:ov},k);
    if(cw.tip&&it.f>.15&&!LOD){const n=l.out.length,h=Math.floor(n/2),tipPts=l.out.slice(Math.max(0,h-2),Math.min(n,h+3));if(tipPts.length>3)E('path',{d:smooth(tipPts),fill:cw.tip,opacity:.92},k)}
    if(l.mouth.length&&V3.dot(l.tipDir,[0,0,1])>.05){const mp=l.mouth.map(p=>[p[0],p[1]]);E('path',{d:smooth(mp),fill:cw.mouth||tone[2],stroke:cw.edge||tone[3],'stroke-width':cw.edge?.9:.5,'stroke-opacity':.85},k)}}
  return k}
/* a dahlia stem's head: the flower and, for the pompons, a second smaller head and a bud on side stems; the hollow stem below */
function dahliaHead(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),B=frameOf(o,1),sd=o.side??(rnd()<.5?-1:1);
  /* the hollow stem leaves the back of the receptacle and bends into its stem; the pompon's side stems branch from it */
  const F={B,O:[0,0,0],parts:[]},sc=['#2e4a20','#4a7032','#6e9a48'],nkp=neckPart(B,[0,0,0],[0,0,-D*.05],[0,0,-1],D*.55,D*.06,{cols:[sc[0],sc[1],sc[2]]}),nk=[[0,0,-D*.05],[0,-D*.1,-D*.2],[0,-D*.18,-D*.32]];F.parts.push(nkp.part);
  if(kd==='pom'){const side=[[sd*D*.75,-D*.25,-D*.2],[-sd*D*.55,D*.15,-D*.3]];for(const[j,p]of side.entries()){const n0=nk[2],P=[n0,V3.add(n0,[p[0]*.3,D*.1,0]),V3.add(p,[0,-D*.25,0]),p],pts=[];for(let i=0;i<=8;i++){const q=i/8,a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;pts.push([0,1,2].map(m=>a*P[0][m]+b*P[1][m]+c*P[2][m]+d*P[3][m]))}
      F.parts.push(tube3(F,pts,D*.018,{cols:[sc[1],sc[2]],cap:0,hl:.3,dk:.4,spec:.1,ink:sc[0],eo:.25,cast:0}))}
    drawParts(k,F.parts);const B2=frameIn(B,V3.nz([sd*.4,.1,1]),R(-1,1));dahliaFlower(k,B2,toV(B,side[0]),D*.75,cw,op,'pom');
    const bb=frameIn(B,V3.nz([-sd*.3,.6,.5]),0);phalBud(k,bb,toV(B,side[1]),D*.3,{c:mix('#7f9f4e',cw.c,.25)})}
  else drawParts(k,F.parts);
  dahliaFlower(k,B,[0,0,0],D,cw,op,kd);open(k,t,1000,10,.3);return neckOut(nkp)}
const xDahDec=(g,t,o)=>dahliaHead(g,t,o,'dec',CW_DDEC),xDahBal=(g,t,o)=>dahliaHead(g,t,o,'bal',CW_DBAL),xDahPom=(g,t,o)=>dahliaHead(g,t,o,'pom',CW_DPOM),xDahCac=(g,t,o)=>dahliaHead(g,t,o,'cac',CW_DCAC),xDahLac=(g,t,o)=>dahliaHead(g,t,o,'lac',CW_DLAC);
Object.assign(FN,{xDahlia:xDahDec});
Object.assign(GH,{'dahlia-decoratif':xDahDec,'dahlia-balle':xDahBal,'dahlia-pompon':xDahPom,'dahlia-cactus':xDahCac,'dahlia-lacinie':xDahLac});
Object.assign(CWS,{'dahlia-decoratif':CW_DDEC,'dahlia-balle':CW_DBAL,'dahlia-pompon':CW_DPOM,'dahlia-cactus':CW_DCAC,'dahlia-lacinie':CW_DLAC});
Object.assign(SZG,{'dahlia-decoratif':[10,12,14,14,16,18],'dahlia-balle':[6,8,9,10,11],'dahlia-pompon':[3,4,4,5],'dahlia-cactus':[10,12,14,16,18],'dahlia-lacinie':[12,14,16,18]});
Object.assign(STEML,{'dahlia-decoratif':{shape:'pinnate',n:[1,2],len:9,w:.5,col:'#3f6a2c',up:50,arr:'opp',lf:3},'dahlia-balle':{shape:'pinnate',n:[1,2],len:8,w:.5,col:'#3a6228',up:50,arr:'opp',lf:3},
 'dahlia-pompon':{shape:'pinnate',n:[1,2],len:6,w:.5,col:'#3f6a2c',up:50,arr:'opp',lf:3},'dahlia-cactus':{shape:'pinnate',n:[1,2],len:9,w:.48,col:'#355e26',up:50,arr:'opp',lf:5},'dahlia-lacinie':{shape:'pinnate',n:[1,2],len:9,w:.5,col:'#3a6228',up:50,arr:'opp',lf:5}});
