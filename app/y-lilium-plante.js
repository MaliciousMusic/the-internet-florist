/* ================= Lis oriental : la plante (tige, feuilles, grappe), 2026-10-18 =================
   The cut stem of an oriental lily (photos p002, p004 at 1:1 and the leaf of p004 measured with fleur/apparence.py): a stout smooth green stem;
   the leaves scattered in a spiral (137.5 degrees), sessile, broadly lanceolate (length about five widths), keeled along the midrib, arching
   out and down at the point, five to seven parallel veins in relief converging to the point, smaller up the stem; at the top a raceme: the
   flowers on long pedicels, the lowest open first, the youngest still buds, each pedicel from the axil of a small bract leaf. The heads are
   the oriental's own SVG head (SV_HEAD['lis-oriental'], y-lilium.js). Drawn when SV_ON (the old catalogue plant otherwise, unchanged). */
const LILP={sw:.045,tap:.32,pw:.028,pedL:.6,leafL:.88,lw:3.6,ang:40,droop:.42,gut:.55,tw:.3,wav:.018,wavN:1.4,nL:8,nF:4,bract:.42};
/* the leaf's colours, measured on p004 (upper face lit #7fa64c to #8db855, veins #b8cf6a), the underside paler; at DET >= 1.5 the fine layer
   shades it from its measured grid with the veins in relief (ribs) */
const LIL_LEAF={stops:[[0,'#3c6624'],[.5,'#46722a'],[1,'#4e7a30']],bstops:[[0,'#86ac54'],[.5,'#92b65e'],[1,'#98ba66']],shade:'#1c3a10',lite:'#a2c86a',
  bshade:'#3e6424',blite:'#c0d88a',rim:'#6e9a3a',cast:'#0c1c06',wrap:.28,amb:.3,dif:.7,sky:.16,trans:.28,ks:1,gloss:12,dark:[.8,.6,.42],da:.3,lit:[1.05],la:.22,
  darkLo:[.72],daLo:.3,litLo:[],laLo:.2,rw:.006,ro:.3,soft:.05,
  fine:{tone:.72,chroma:1.05,amb:.52,dif:.5,sat:.45,ao:.12,gloss:26,ks:.24,glow:.25,grain:.03,ribs:{n:7,a:.38,w:.03,c:'#bcd474',conv:.8,dk:.12}},
  grid:{nu:6,nv:16,c:[['#88b74c','#85ad4d','#7fa64c','#84ae4c','#7fa64f','#8cb262'],['#82ac45','#8dba55','#82ab4f','#83a94e','#8db855','#86b04f'],
    ['#83ad48','#88b452','#86b04f','#85ad4f','#87b253','#87b053'],['#80aa45','#84ae4b','#86b04e','#83ac4d','#86b051','#88b155'],
    ['#7ea843','#82ab49','#84ae4c','#82ab4b','#84ae4f','#87b054'],['#7ca641','#80a947','#82ab4a','#80a949','#82ac4d','#85ae52'],
    ['#7aa440','#7ea745','#80a948','#7ea747','#80aa4b','#83ac50'],['#78a23e','#7ca543','#7ea746','#7ca545','#7ea849','#81aa4e'],
    ['#77a13d','#7ba442','#7da645','#7ba444','#7da748','#80a94d'],['#78a23e','#7ca543','#7ea746','#7ca545','#7ea849','#81aa4e'],
    ['#7aa440','#7ea745','#80a948','#7ea747','#80aa4b','#83ac50'],['#7ca641','#80a947','#82ab4a','#80a949','#82ac4d','#85ae52'],
    ['#7ea843','#82ab49','#84ae4c','#82ab4b','#84ae4f','#87b054'],['#80aa45','#84ae4b','#86b04e','#83ac4d','#86b051','#88b155'],
    ['#83ad48','#88b452','#86b04f','#85ad4f','#87b253','#87b053'],['#86b04b','#8ab454','#88b252','#87b052','#89b456','#8ab557']]}};
const LIL_LM={};
function lilLeafMat(wl,det){const key=(wl*20|0)+(det?'h':'l');if(LIL_LM[key])return LIL_LM[key];
  /* the point yellows first, then the blade (limp, straw) */
  const wc=(c,v)=>{const a=Math.min(1,Math.max(0,wl*1.6-(1-v)*.85));return a>0?mix(mix(c,'#c2b044',Math.min(1,a*1.2)),'#8a6a30',Math.max(0,a-.7)*1.3):c};
  const ws=L=>L.map(([v,c])=>[v,wc(c,v)]),m=Object.assign({},LIL_LEAF,{stops:ws(LIL_LEAF.stops),bstops:ws(LIL_LEAF.bstops)});
  if(wl>.05)m.grid=null;  /* a fading leaf keeps its fading ramps */
  /* the vector veins (DET 1, or the fine layer off): the midrib and three pairs at constant u converging to the point, faint above, clearer beneath */
  m.veins=det?(s,front)=>[[[[[0,.03],[0,.3],[0,.6],[0,.92]]],.0045,front?'#a6c866':'#6a9230',.45],
    [[-.78,-.52,-.26,.26,.52,.78].map(u0=>[[u0,.05],[u0*.94,.35],[u0*.74,.64],[u0*.36,.9]]),.003,front?'#9cc060':'#5f8a2c',front?.3:.42]]:null;
  return LIL_LM[key]=m}
/* the blade's width (share of its widest): a narrowed sessile base, widest at a third, drawn out into an acuminate point */
const LIL_WP=[[0,.3],[.12,.78],[.3,1],[.5,.93],[.7,.64],[.88,.26],[1,.02]];
function lilWp(v){const P=LIL_WP;if(v<=0)return P[0][1];for(let i=1;i<P.length;i++)if(v<=P[i][0]){const a=P[i-1],b=P[i],t=(v-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*s}return P[P.length-1][1]}
/* one leaf: pos its base, H its direction, U the axis' side, len its length, sd its seed, wl the fading; o.bract: a small bract (narrower, straighter) */
function lilLeaf(par,pos,H,U,len,sd,wl,o){o=o||{};const P=LILP,r=svRng(sd),det=DET>=1.5,Hn=V3.nz(H),up=[0,1,0],dn=[0,-1,0],
    limp=.1+.75*svSm((wl-.15)/.6),dr=Math.min(1.3,P.droop*(o.bract?.45:1)*(.8+.4*r())+limp*.85),ns=16,tw=P.tw*r.in(-1,1),wph=r()*6.28,halfW=len/(P.lw*(o.bract?1.5:1))/2,
    roll0=Math.max(-1,Math.min(1,r.in(-.6,.6)+(o.roll||0)));
  const sp=[],dv=[];let p=pos;
  for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.93,dr*Math.pow(v,1.35)),dd=V3.nz(V3.add(V3.sc(Hn,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,len/ns));sp.push(p);dv.push(dd)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
    frame=v=>{const t=V3.nz(at(dv,v));let s0=V3.cr(t,up);if(V3l(s0)<.2)s0=V3.cr(t,[0,0,1]);s0=V3.nz(s0);const n0=V3.nz(V3.cr(s0,t)),a=roll0+tw*v,sd2=V3.add(V3.sc(s0,Math.cos(a)),V3.sc(n0,Math.sin(a)));return{t,s:sd2,n:V3.cr(sd2,t)}};
  /* across: a keel (the blade folded up from its midrib, gut), flattening toward the point; the margin a slow wave */
  const S=(u,v)=>{const c=at(sp,v),f=frame(v),hw=halfW*lilWp(v),au=Math.abs(u);
    return V3.add(V3.add(c,V3.sc(f.s,u*hw)),V3.sc(f.n,P.gut*Math.pow(au,1.15)*hw*(1-.45*v)*(1-.4*limp)+P.wav*len*au*au*Math.sin(v*P.wavN*6.2832+wph)))};
  const pieces=[svSheet(I3,[0,0,0],S,{nu:det?14:6,nv:det?32:10,mat:lilLeafMat(wl,det)})];
  const g=G(par);svDraw(g,pieces,{D:len*1.5,sd:.03,sb:.025,so:.3,shadow:det});return g}
/* the stem's colours: shade, body, light, glint; smooth, a satin gloss, three faint ribs, a slow swell, nodes where the leaves leave */
function lilStemCols(nodes){const c=['#28461a','#4a7a2c','#76a24e','#b2d088'];c.sv={swell:.03,gloss:.4,ribs:[-.45,0,.45],bloom:.02};if(nodes)c.sv.nodes=nodes;return c}
/* a bud (photos: clavate, widest about two thirds up, drawn out into a blunt point, three sutures where the outer tepals meet, smooth and
   waxy; green at the foot, flushed toward the point with the colourway's colour): three sheets, one per outer tepal, exactly abutting (never
   overlapping: BONNES-PRATIQUES §14), their outlines the sutures; a ripe bud (age near .5) is longer and more coloured */
const LIL_BUD={L:.95,R:.095,wide:.64};
function lilBud(par,pos,H,U,D,cw,age,sd){const P=LIL_BUD,r=svRng(sd),Hn=V3.nz(H);let X=V3s(U,V3.sc(Hn,V3.dot(U,Hn)));if(V3l(X)<1e-3)X=V3.cr(Hn,[0,0,1]);X=V3.nz(X);const Y=V3.cr(Hn,X),
    len=D*P.L*(.75+.5*age),R0=D*P.R*(.8+.35*age),bend=r.in(-.06,.06),rot=r()*6.28,
    C=LIL_ORI_CW[cw.id]||{},c1=C.bud||(C.grid?C.grid.c[Math.round(C.grid.nv*.45)][0]:'#f0c0d0'),tipC=mix('#b8c890',c1,.45+.45*age),
    rad=v=>{const w=P.wide;return R0*(v<w?Math.pow(Math.sin(Math.PI*.5*Math.min(1,(v+.04)/(w+.04))),.62):Math.pow(Math.max(0,1-Math.pow((v-w)/(1-w),1.5)),.8))};
  const mat={stops:[[0,'#5c8a30'],[.3,'#86aa50'],[.6,mix('#a8c070',tipC,.35)],[.85,tipC],[1,mix(tipC,'#6a8a3a',.25)]],bstops:[[0,'#5c8a30'],[1,'#86aa50']],
    shade:'#2a4a18',lite:'#e8f0d0',bshade:'#2a4a18',blite:'#d8e8b0',rim:'#4a6e28',cast:'#0c1c06',wrap:.3,amb:.32,dif:.68,sky:.14,trans:.1,ks:1,gloss:14,dark:[.82,.62],da:.26,lit:[1.06],la:.24,
    rw:.006,ro:.55,soft:.06,fine:{amb:.5,dif:.52,sat:.45,ao:.1,gloss:30,ks:.26,glow:.15,grain:.02}};
  const pieces=[];for(let k=0;k<3;k++){const a0=rot+k*2.0944;
    pieces.push(svSheet(I3,[0,0,0],(u,v)=>{const a=a0+(u+1)*1.0472,rr=rad(v)*(1-.06*Math.pow(Math.abs(u),4)),c=V3.add(pos,V3.add(V3.sc(Hn,len*v),V3.sc(X,bend*len*v*v)));
      return V3.add(c,V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)))},{nu:DET>=1.5?10:5,nv:DET>=1.5?22:10,mat}))}
  const g=G(par);svDraw(g,pieces,{D:len,sd:.02,sb:.02,so:.25,shadow:DET>=1.5});return g}
/* the whole stem: the leaves up the stem in a spiral, then the raceme; op the stage of the oldest flower (the others follow, younger) */
function lilOriPlant(g,t,o){const cw=o.cw||cwNear(CW_LORI,o.col)||CW_LORI.find(x=>x.id==='stargazer')||CW_LORI[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||16)*UPC,k=G(g),
    B=frameOf(o,.3,true),P=LILP,wl=typeof lilLifeOf==='function'?(lilLifeOf('lis-oriental').w||0):0,sc=lilStemCols();
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nT=P.nL+P.nF,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,li=D*.3*kr,ws=D*P.sw,age=i=>{const a=Math.max(0,Math.min(1,op*(1.15-.3*i)));return a>=.78?a:Math.min(.5,a*.6)},
    rules={A:p=>{if(p.n<=0)return[['F',{l:D*.2,w1:ws*(1-P.tap)}],['K',{age:age(P.nF)*.4,i:P.nF}]];const l=li*R(.85,1.15)*(p.n>P.nF?1:.8),w1=ws*(1-P.tap*(1-p.n/nT));
      if(p.n>P.nF)return[['F',{l,w1}],['[',{}],['&',{a:P.ang+R(-6,6)}],['Lv',{i:p.n,f:.7+.3*Math.min(1,(p.n-P.nF)/(P.nL*.6))}],[']',{}],['/',{a:137.5}],['A',{n:p.n-1}]];
      const i=P.nF-p.n;return[['F',{l,w1}],['[',{w:D*P.pw*.45}],['/',{a:R(-20,20)}],['&',{a:48+R(-8,8)+i*4}],['F',{l:D*P.pedL*kr*(1-.18*i),w1:D*P.pw*.38,e:-.12}],['K',{age:age(i),i}],[']',{}],
        ['[',{}],['&',{a:P.ang*.7}],['Lv',{i:p.n,bract:1,f:P.bract}],[']',{}],['/',{a:137.5}],['A',{n:p.n-1}]]}};
  const res=lsTurtle(lsDerive([['A',{n:nT}]],rules,nT+2),{p:[0,0,0],H:up,U:U0,wig:.04,seg:D*.16,T:[0,1,0],e:.02,w:ws*1.1}),Ks=res.organs.filter(q=>q.t==='K'),
    main=Ks.reduce((a,b)=>(!a||b.p.age>a.p.age)?b:a,null)||res.organs[res.organs.length-1],apex=main.pos;
  for(const ch of res.chains)ch.c=sc;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=lsFrame(og,null,R(-.3,.3)),a=og.p.age,sd=svSeed('lis-oriental',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8));
      return{parts:[{z:pos[2],fn:par=>a>.5?lilOriSvg(par,Bf,pos,D*(og===main?1.7:1.55),cw.id,Math.min(op,a),sd,wl):lilBud(par,pos,og.H,og.U,D,cw,a,sd)}]}}
    if(og.t==='Lv'){const ln=D*P.leafL*(og.p.f||1)*R(.9,1.08);
      return{ext:1,parts:[{z:pos[2]+og.H[2]*ln*.4,cast:false,fn:par=>lilLeaf(par,V3.add(pos,V3.sc(V3.nz(og.H),(og.w||2)*.4)),og.H,og.U,ln,svSeed('lil-feuille',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),og.p.bract?1:0),wl,{bract:og.p.bract})}]}}
    return null}});
  open(k,t,1000,8,.3);const rn=lsNeck(res,[0,0,0],apex);if(rn){rn.ncols=lilStemCols();rn.nw=ws*.9}return rn}
if(typeof GH!=='undefined'&&GH['lis-oriental']){const lilOldPlant=GH['lis-oriental'];GH['lis-oriental']=function(g,t,o){return typeof SV_ON!=='undefined'&&SV_ON?lilOriPlant(g,t,o):lilOldPlant(g,t,o)}}
/* the leaves of a bouquet's stem (STEML hook): screen to view space, leaning toward the eye on alternate sides */
function lilLeafSv(par,x,y,ang,len,o){const s=o&&o.s>0?1:-1,zk=.25+.3*pxHashS(o&&o.k||0,5,Math.round(x*7+y*13));
  return lilLeaf(par,[x,-y,0],[Math.cos(ang),-Math.sin(ang),zk*s],[0,0,1],len,svSeed('lil-feuille',Math.round(x*8),Math.round(y*8)),0,{roll:.4*s})}
if(typeof STEML!=='undefined'&&STEML['lis-oriental'])Object.assign(STEML['lis-oriental'],{sv:lilLeafSv});
