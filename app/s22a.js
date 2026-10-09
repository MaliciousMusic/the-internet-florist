/* ================= Serre, lot 22 — printemps 2, poussés par le L-système : hellébore d'Orient, cyclamen, freesia, iris de Hollande, jacinthe ================= */
/* a frame whose face looks along Z, its top toward Yh (view space), turned by roll round Z */
function frZ(Z,Yh,roll=0){Z=V3.nz(Z);let Y=V3s(Yh,V3.sc(Z,V3.dot(Yh,Z)));if(V3l(Y)<1e-4){Y=Math.abs(Z[1])<.9?[0,1,0]:[0,0,1];Y=V3s(Y,V3.sc(Z,V3.dot(Y,Z)))}Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* a point of a drawn ligule: t along it (0 base, 1 tip), u across (−1..1), read on its projected rows */
function ligAt(l,t,u){const S=l.S,n=S.length-1,x=Math.max(0,Math.min(n-1e-6,t*n)),i=Math.floor(x),a=x-i,c=Math.max(0,Math.min(3.999,(u+1)*2)),j=Math.floor(c),b=c-j,P=r=>[r[j][0]+(r[j+1][0]-r[j][0])*b,r[j][1]+(r[j+1][1]-r[j][1])*b];
  const p=P(S[i]),q=P(S[i+1]);return[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a]}
/* a leaf cut into toothed lobes from one point (hellebore bracts): one outline, the far half of each lobe darker, the midribs */
function toothLeaf(par,x,y,ang,len,col,o={}){const n=o.lobes||3,sp=(o.spread||80)*D,ct=Math.cos(o.tilt??R(.25,.6)),P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),nt=o.teeth||7,out=[],dk=[],vn=[];
  for(let j=0;j<n;j++){const th=n>1?-sp/2+sp*j/(n-1):0,Lj=len*(1-.3*Math.abs(th)/(sp/2||1))*R(.9,1.05),wj=Lj*(o.w||.2),c=Math.cos(th),s=Math.sin(th),side=[];
    for(const sg of[-1,1]){const q=[];for(let i=0;i<=nt*2;i++){const t=i/(nt*2),tooth=i%2&&t>.25?1.18:1,h=wj*Math.pow(Math.sin(Math.PI*Math.min(.995,.04+t*.96)),.8)*(1-.3*t)*tooth*(1+.05*Math.sin(j*3+i));q.push([t*Lj,sg*h])}side.push(sg<0?q:q.reverse())}
    const lob=side[0].concat(side[1]).map(([a,b])=>[a*c-b*s,(a*s+b*c)*ct]);out.push(...lob);dk.push(side[1].map(([a,b])=>[a*c-b*s,(a*s+b*c)*ct]).concat([[0,0]]));vn.push([Lj*.92*c,Lj*.92*s*ct])}
  E('path',{d:smooth(out),fill:toneAt(P,.6),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:dk.map(h=>smooth(h)).join(''),fill:P.d1,opacity:.4},g);E('path',{d:vn.map(v=>`M0,0L${f(v[0])},${f(v[1])}`).join(''),stroke:P.l1,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.5,fill:'none'},g)}return g}

/* ---------- hellebore (Helleborus × hybridus, syn. H. orientalis hybrids): a branched stem, a leafy toothed bract at each fork, two to four nodding saucers —
   five broad overlapping petaloid sepals (plain, speckled, veined or edged, single or double), a ring of little green nectary cups, a boss of cream stamens round three to five green carpels ---------- */
const CW_HELL=[{id:'blanc',n:'Blanc',c:'#f5f2e6'},{id:'blanc-mouchete',n:'Blanc moucheté de pourpre',c:'#f6f0ea',sp:'#7a2050'},{id:'jaune',n:'Jaune primevère',c:'#f0e3a2'},
  {id:'vert',n:'Vert anis',c:'#d2dca6'},{id:'rose-pale',n:'Rose pâle',c:'#f2d2da'},{id:'rose-mouchete',n:'Rose moucheté',c:'#ecb2c6',sp:'#8a1e4e'},
  {id:'picotee',n:'Blanc liseré de rose (picotee)',c:'#f6eeea',edge:'#c63a6e',vein:'#d06a8e'},{id:'abricot',n:'Abricot',c:'#f2c8a2',sp:'#b8506a'},
  {id:'vieux-rose',n:'Vieux rose',c:'#c88aa0',vein:'#9a4a6a'},{id:'prune',n:'Prune',c:'#7a2a5a'},{id:'rouge-vin',n:'Rouge vin',c:'#8e1f40'},
  {id:'ardoise',n:'Ardoise (presque noir)',c:'#3a2438',cb:'#4a3a48',bloom:'#8a8aa6'},
  {id:'double-blanc',n:'Double blanc moucheté',c:'#f6f0ea',sp:'#8a2a5a',dbl:1},{id:'double-rose',n:'Double rose',c:'#e6a4bc',dbl:1},{id:'double-prune',n:'Double prune',c:'#6e2050',dbl:1}];
const HL_SEP=prof([[0,.3],[.2,.78],[.5,1],[.8,.86],[.95,.5],[1,.14]]);
/* the speckles of a sepal: denser toward its base, one path */
function hellSpots(k,l,col,R0,seed){let d='';const n=DET>=1.5?16:8;for(let i=0;i<n;i++){const t=.12+.55*Math.pow(((i*.618+seed)%1),1.4),u=Math.sin(i*2.7+seed*9)*.62*(1-.4*t),p=ligAt(l,t,u),r=Math.max(.35,R0*(.035-.02*t));
    d+=`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r*.8)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r*.8)} 0 1,0 ${f(-2*r)},0`}E('path',{d,fill:col,opacity:.85},k)}
/* the fine veins of a sepal (picotee and old-rose strains): three strokes fanning from the base */
function hellVeins(k,l,col,R0){let d='';for(const u of[-.45,0,.45]){const q=[];for(const t of[.05,.3,.55,.8])q.push(ligAt(l,t,u*(.4+.6*t)));d+=smooth(q,false)}E('path',{d,stroke:col,'stroke-width':f(Math.max(.3,R0*.018)),'stroke-opacity':.55,fill:'none'},k)}
function hellFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.12)/.88),it=[],fr=[],rot=R(0,6.28),cache={},det=DET>=1.5,cb=cw.cb||mix(cw.c,'#b4c890',.3),heart=kk=>{
    /* the heart: nectary cups, the stamens, the carpels */
    if(LOD||o2<.3)return;const nc=det?14:10;let nd='';for(let i=0;i<nc;i++){const a=i/nc*6.283+rot,p=PJ(B,O,[Math.cos(a)*R0*.2,Math.sin(a)*R0*.2,R0*.07]),q=PJ(B,O,[Math.cos(a)*R0*.27,Math.sin(a)*R0*.27,R0*.13]),r=Math.max(.4,R0*.045);
      nd+=`M${f(p[0])},${f(p[1])}L${f(q[0]-r)},${f(q[1])}L${f(q[0]+r)},${f(q[1])}Z`}E('path',{d:nd,fill:cw.nec||'#a8bc5a',stroke:'#5a7a30','stroke-width':.3,'stroke-opacity':.6},kk);
    peoBoss(kk,B,O,R0*(cw.dbl?.4:.52),{st:cw.st||'#f0e2a0'},{carp:'#8aa850'})};
  const ring=(n,sc,a0,a1,ph0,zz,dark)=>{for(let i=0;i<n;i++){const l=ligule(B,O,{phi:ph0+i/n*6.283+R(-.05,.05),r0:R0*.1*sc,z0:zz,L:R0*.95*sc*R(.95,1.04),W:R0*.64*sc,wp:HL_SEP,a0:a0+R(-.04,.04),a1:a1+R(-.06,.06),pw:1.3,th:.5,tip:'round',n:det?8:6,tw:R(-.1,.1)}),
      c=dark?shd(cw.c,dark):cw.c,sd=i*.37+ph0,ph=ph0+i/n*6.283,near=nz<=.3&&V3.dot(toV(B,[Math.cos(ph),Math.sin(ph),0]),[0,0,1])>.2;(near?fr:it).push({l,c,cb,lift:.18,edgec:cw.edge,ew:Math.max(.6,R0*.05),eo:.55});
      if(!LOD&&o2>.2&&l.nm[2]>0&&(cw.sp||cw.vein||cw.bloom))(near?fr:it).push({z:l.z+1e-4,fn:kk=>{if(cw.vein)hellVeins(kk,l,cw.vein,R0);if(cw.sp)hellSpots(kk,l,cw.sp,R0,sd);if(cw.bloom)E('path',{d:smooth(l.out),fill:flushFill(cw.bloom,.4),opacity:.55},kk)}})}};
  const a0=.16+.5*o2,a1=.5+1.02*o2;ring(5,1,a0,a1,rot,0,0);
  /* a double: two more rings of sepal-like petals (the nectaries turned petaloid), smaller and more cupped */
  if(cw.dbl&&o2>.15){ring(5,.82,a0*.8,a1*.86,rot+.63,R0*.05,-.05);ring(5,.62,a0*.6,a1*.7,rot+.31,R0*.1,-.1)}
  /* the heart over the sepals behind it, under the near ones (seen from the side), before all of them seen from behind */
  if(nz<-.1)heart(k);spPetals(k,it,cache);if(nz>=-.1)heart(k);spPetals(k,fr,cache);return k}
/* a bud: the five sepals still clasped into a pointed globe, tinted green, the colour showing as it swells */
function hellBud(par,B,O,s,cw,a){const k=G(par),c=mix(cw.cb||mix(cw.c,'#b4c890',.3),'#8aac64',.6-.45*a);spBud(k,B,O,s*.78,s*.66,c,{tp:.3,pw:.5});if(LOD)return k;
  /* the five sepal seams, meeting at the tip */
  const rot=R(0,6.28);let d='';for(let i=0;i<5;i++){const a2=rot+i/5*6.283,q=[];for(let j=1;j<=6;j++){const v=j/6,r=s*.33*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.5)*(1-.3*v);q.push(PJ(B,O,[Math.cos(a2+v*.3)*r,Math.sin(a2+v*.3)*r,v*s*.78]))}
    if(V3.dot(toV(B,[Math.cos(a2),Math.sin(a2),0]),[0,0,1])>-.1)d+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d,stroke:shd(c,-.4),'stroke-width':.4,'stroke-opacity':.55,fill:'none'},k);return k}
function hellPlant(g,t,o){const cw=o.cw||cwNear(CW_HELL,o.col)||CW_HELL[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6.5)*UPC,k=G(g),sc=['#2e4a22','#557a3a','#7fa25a','#b0c890'],red=h2l(cw.c)[2]<.45;
  if(red)sc[1]=mix(sc[1],'#6a3a40',.35),sc[2]=mix(sc[2],'#8a5a5a',.3);
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.07,cols:sc,op,rr:.3,nodes:0,lp:.5,flower:(par,B2,O,D2,op2)=>op2<.3?hellBud(par,B2,O,D2*.42,cw,.5):hellFlower(par,B2,O,D2,cw,op2)});open(k,t,1000,8,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.9))):1,w=D*.075,ph0=R(0,360),nf=Math.round(R(2,3.4)),sd=rnd()<.5?-1:1;
  /* S: the stem to the upper fork, a bract, the side branches (older first), then the short top internode to the terminal flower, which nods a little toward the face */
  const nod=V3.nz(V3.add(V3.sc(face,.8),[0,-.35,0])),rules={
    S:()=>[['F',{l:D*1.1*kr,w0:w*1.3,w1:w*1.18,e:.02}],['N',{i:1}],['F',{l:D*.55*kr,w1:w*1.08,e:.02}],['N',{i:0}],['F',{l:D*.42*kr,w1:w}],['F',{l:D*.5*kr,w1:w*.9,aim:nod,k:.3}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],r0=ph0+p.i*140,nb=p.i?1:nf-1;
      /* the bract: sessile, one or two at the fork, cut into toothed lobes */
      for(let j=0;j<(p.i?1:2);j++)out.push(['[',{}],['/',{a:r0+j*170+R(-15,15)}],['&',{a:52+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      for(let j=0;j<nb;j++){const age=p.i?R(0,.45):R(.55,1);out.push(['[',{w:w*.72}],['/',{a:r0+90+j*(360/Math.max(1,nb))*.6*sd+R(-20,20)}],['&',{a:34+R(-6,8)}],['F',{l:D*(p.i?.7:.95)*kr*R(.85,1.1),w1:w*.62,e:.04}],['F',{l:D*.45*kr,w1:w*.55,e:-.16}],['Kb',{age,i:p.i}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,4),{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.16,T:[0,1,0],e:.02,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=frZ(V3.add(og.H,V3.sc(nod,.6)),up,R(-.2,.2));return{parts:[{z:pos[2]+Bf[2][2]*D*.25,fn:par=>op<.3?hellBud(par,Bf,pos,D*.42,cw,op/.3):hellFlower(par,Bf,pos,D,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age*Math.min(1,op*1.15),Bf=frZ(V3.add(og.H,[0,-.25,0]),up,R(-.3,.3));return{parts:[{z:pos[2]+Bf[2][2]*D*.22,fn:par=>a<.4?hellBud(par,Bf,pos,D*(.3+.25*a),cw,a):hellFlower(par,Bf,pos,D*(.8+.18*a),cw,(a-.3)/.7)}]}}
    if(og.t==='Lv')return{ext:1,parts:[lsLeaf2D(og,pos,D*R(.55,.75)*(og.p.i?1:.85),(par,x,y,a,l)=>toothLeaf(par,x,y,a,l,'#557a3c',{lobes:og.p.i?5:3,spread:og.p.i?110:75,w:.17,teeth:7}))]};
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- florist's cyclamen (Cyclamen persicum): one flower on a bare fleshy peduncle that rises and curls over into a crook; the flower hangs, its mouth (the nose) down,
   its five petals swept straight back and up from the nose and twisted, like a flower in flight; a darker eye round the mouth; the buds furled in a spiral, hanging ---------- */
const CW_CYC=[{id:'blanc',n:'Blanc pur',c:'#f8f6f2',eye:'#ecd8e0'},{id:'blanc-oeil',n:'Blanc à œil rose',c:'#f8f4f4',eye:'#c8306a'},{id:'rose-pale',n:'Rose pâle',c:'#f4c8d6',eye:'#c43a72'},
  {id:'rose',n:'Rose',c:'#ec9ab8',eye:'#b0185a'},{id:'saumon',n:'Saumon',c:'#f2a494',eye:'#c43a4c'},{id:'fuchsia',n:'Fuchsia',c:'#d63c7c',eye:'#7a0a3c'},{id:'rouge',n:'Rouge',c:'#c01f35',eye:'#5a0a18'},
  {id:'bordeaux',n:'Bordeaux',c:'#7e1432',eye:'#3a0414'},{id:'lilas',n:'Lilas',c:'#caa8dc',eye:'#7a3a8a'},{id:'violet',n:'Violet',c:'#7f4fa0',eye:'#3a1450'},
  {id:'flamme',n:'Blanc flammé de fuchsia',c:'#f6eef2',eye:'#b0185a',flame:'#d63c7c'},{id:'picotee',n:'Blanc liseré de rose (Victoria)',c:'#f8f2f2',eye:'#c8306a',edge:'#d63c7c'},
  {id:'bicolore',n:'Rose pâle à pointes fuchsia',c:'#f2c4d6',eye:'#a0104a',tipc:'#d63c7c'}];
const CY_PET=prof([[0,.24],[.1,.36],[.4,.9],[.72,1],[.92,.72],[1,.22]]);
/* the flower in its frame: local Z the mouth, the peduncle arriving at −Z; the petals leave the mouth and sweep back past the peduncle */
function cycFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=R(0,6.28),cache={},det=DET>=1.5,cb=mix(cw.c,'#e6e0d8',.15),sw=rnd()<.5?-1:1;
  /* the nose: a short cone from the peduncle to the mouth */
  const nc=mix(cw.c,'#9a8a70',.25);it.push(tubeFlat(B,O,[[0,0,-R0*.26],[0,0,-R0*.12],[0,0,0]],R0*.08,R0*.15,toneAt(pal7(nc),.6),{ink:shd(nc,-.5)}));
  for(let i=0;i<5;i++){const tw=sw*(.7+R(-.15,.2)),l=ligule(B,O,{phi:rot+i/5*6.283+R(-.08,.08),r0:R0*.13,z0:0,L:D*.86*R(.93,1.05),W:R0*.36,wp:CY_PET,a0:.3+.8*o2,a1:.55+2.25*Math.pow(o2,1.6)+R(-.1,.1),pw:.26,th:.3,tip:'round',wav:.06,wk:2,n:det?9:6,tw});
    it.push({l,c:cw.c,cb,lift:.2,basec:cw.eye,bf:.2,bo:.9,edgec:cw.edge,ew:Math.max(.6,R0*.05),tipc:cw.tipc,tf:.55});
    if(cw.flame&&!LOD&&l.nm[2]>0)it.push({z:l.z+1e-4,fn:kk=>{let d='';for(const u of[-.4,0,.4]){const q=[];for(const t of[.1,.35,.6])q.push(ligAt(l,t,u));d+=smooth(q,false)}E('path',{d,stroke:cw.flame,'stroke-width':f(Math.max(.5,R0*.06)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},kk)}})}
  /* the mouth seen from below: the dark ring of the eye, the style just showing */
  if(nz>.15&&!LOD)it.push({z:PJ(B,O,[0,0,R0*.02])[2]+R0*.5,fn:kk=>{E('path',{d:smooth(spDisc(B,O,R0*.16,R0*.01,10)),fill:cw.eye,stroke:shd(cw.eye,-.4),'stroke-width':.3},kk);const a=PJ(B,O,[0,0,0]),b=PJ(B,O,[0,0,R0*.12]);E('path',{d:`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`,stroke:'#e8dcc8','stroke-width':f(Math.max(.4,R0*.03)),'stroke-linecap':'round'},kk)}});
  spPetals(k,it,cache);return k}
/* a bud: a slim spindle hanging from the crook, its petals furled in a spiral, the colour at its tip */
function cycBud(par,B,O,s,cw,a){const k=G(par),c=mix(cw.c,'#8a7a60',.5-.35*a);spBud(k,B,O,s,s*.3,c,{tp:.75,pw:.55});if(LOD)return k;let d='';const sw=rnd()<.5?-1:1;
  for(let i=0;i<5;i++){const q=[];for(let j=1;j<=7;j++){const v=j/7,an=i/5*6.283+sw*v*2.4,r=s*.15*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.55)*(1-.7*v),p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*s]);if(V3.dot(toV(B,[Math.cos(an),Math.sin(an),0]),[0,0,1])>-.15)q.push([p[0],p[1]]);else if(q.length>1){d+=smooth(q,false);q.length=0}}
    if(q.length>1)d+=smooth(q,false)}if(d)E('path',{d,stroke:shd(c,-.45),'stroke-width':.4,'stroke-opacity':.6,fill:'none'},k);return k}
function cycPlant(g,t,o){const cw=o.cw||cwNear(CW_CYC,o.col)||CW_CYC[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||5)*UPC,k=G(g),lum=h2l(cw.c)[2],
    sc=lum>.85&&!cw.edge&&!cw.flame?['#34442a','#5f7048','#869868','#b0c094']:['#3e2c22','#6e4e3e','#957060','#bc9a8a'];
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2],sd=rnd()<.5?-1:1;let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  /* the crook leans out toward the face and a little to one side; the mouth hangs, turned a little back under it */
  const sx=V3.nz(V3.cr(up,U0)),hd=V3.nz(V3.add(V3.sc(U0,.6),V3.sc(sx,sd*.8))),M=V3.nz(V3.add(V3.sc(up,-1),V3.sc(hd,-.22))),bud=op<.3,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*2.6))):1,w=D*.075,ro=o.rim?.25:1;
  const rules={S:()=>[['F',{l:D*2*kr*ro,w0:w*1.2,w1:w*1.05,e:.012}],['N0',{}],['F',{l:D*.42*kr,w1:w,aim:V3.nz(V3.add(up,V3.sc(hd,1.2))),k:.3}],['F',{l:D*(bud?.32:.4)*kr,w1:w*.92,aim:hd,k:.4}],['F',{l:D*(bud?.38:.3)*kr,w1:w*.85,aim:M,k:.55}],['K',{}]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.1,T:[0,1,0],e:.01,w:w*1.2});for(const ch of res.chains)ch.c=sc;
  /* the bouquet stem ends where the crook begins: the crook belongs to the head */
  const apex=res.organs.find(q=>q.t==='N0').pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{if(og.t!=='K')return null;const Bf=frZ(og.H,hd,R(-.3,.3)),R0=D/2;
    if(bud)return{parts:[{z:pos[2],fn:par=>cycBud(par,Bf,pos,D*(.55+.3*op/.3),cw,op/.3)}]};
    const Of=V3.add(pos,V3.sc(og.H,R0*.26));return{parts:[{z:pos[2]-og.H[2]*D*.3,fn:par=>cycFlower(par,Bf,Of,D,cw,op)}]}}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- freesia (Freesia × hybrida): a wiry scape that turns at a right angle into a one-sided spike (the 'hand'); along its upper side, alternately a little left and right,
   funnel flowers in pairs of small bracts, open at the elbow, younger toward the tip where the buds lie tight and green, nearly along the axis; single (six tepals) or double ---------- */
const CW_FRE=[{id:'blanc',n:'Blanc (Ambiance)',c:'#e8e6dc',th:'#ecd9a0'},{id:'creme',n:'Crème (Maya)',c:'#dfcf58',th:'#e6c030'},{id:'jaune',n:'Jaune (Gold River)',c:'#f0c40b',th:'#e0b00f'},{id:'orange',ret:1,n:'Orange',c:'#f08a2a',th:'#f6c030'},
  {id:'rouge',n:'Rouge (Red Passion)',c:'#c81a1a',th:'#c85a14'},{id:'rose-pale',n:'Rose pâle',c:'#f4c6d4',th:'#f6e2a0'},{id:'rose',n:'Rose (Emily)',c:'#a06280',th:'#d8cbbb'},{id:'fuchsia',n:'Fuchsia',c:'#e04a8a',th:'#f4d870'},
  {id:'mauve',n:'Mauve (Delta River)',c:'#b192d0',th:'#d2c0cc'},{id:'lavande',n:'Lavande (Vera)',c:'#c6b3e8',th:'#e0d6e4'},{id:'violet',n:'Violet (Blue Velvet)',c:'#9a5fba',th:'#c8aebf'},{id:'bleu',n:'Bleu lavande (Mercurius)',c:'#9775d0',th:'#ddd0df'}];
const FR_TEP=prof([[0,.4],[.3,.9],[.65,1],[.88,.72],[.97,.36],[1,.1]]);
/* one flower in its frame (local Z its mouth): the narrow tube widening into a funnel, six (or twice six) rounded tepals, the throat flushed yellow */
function freFlower(par,B,O,L,cw,op,dbl){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),it=[],rot=R(0,6.28),cache={},det=DET>=1.5,c=cw.c,cb=mix(c,'#e8e2c8',.18),tc=mix(c,'#e8e4b8',.3);
  it.push(tubeFlat(B,O,[[0,0,0],[0,0,L*.22],[0,0,L*.45]],L*.045,L*.13,toneAt(pal7(tc),.62),{ink:shd(tc,-.45)}));
  const ring=(sc,ph,a0,a1,z0)=>{for(let i=0;i<6;i++){const up=Math.sin(ph+i/6*6.283)>0,l=ligule(B,O,{phi:ph+i/6*6.283+R(-.06,.06),r0:L*.1*sc,z0,L:L*.52*sc*(up?1.05:.95)*R(.95,1.04),W:L*.26*sc,wp:FR_TEP,a0,a1:a1+R(-.08,.08),pw:1.2,th:.55,tip:'round',n:det?7:5,tw:R(-.08,.08)});it.push({l,c,cb,lift:.25})}};
  ring(1,rot,.32+.2*o2,.55+.85*o2,L*.42);if(dbl&&o2>.2)ring(.72,rot+.52,.25+.15*o2,.45+.6*o2,L*.46);
  if(nz>.15&&o2>.2&&!LOD)it.push({z:PJ(B,O,[0,0,L*.45])[2]+(nz>.6?L:0),fn:kk=>E('path',{d:smooth(spDisc(B,O,L*.15,L*.45,12)),fill:flushFill(cw.th,.9)},kk)});
  spPetals(k,it,cache);return k}
function frePlant(g,t,o){const cw=o.cw||cwNear(CW_FRE,o.col)||CW_FRE[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,k=G(g),sc=['#2e4a20','#527a36','#7aa052','#aac888'],dbl=rnd()<.45,Lf=4.8*UPC*Math.pow(D/(8*UPC),.3);
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2],sd=rnd()<.5?-1:1;let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  /* the spike turns toward one side, a little toward the face */
  const sx=V3.nz(V3.cr(up,U0)),hd=V3.nz(V3.add(V3.sc(sx,sd),V3.sc(U0,.55))),n=Math.round(R(8,10)),nf=op<.3?0:op<.7?Math.round(R(1,2)):Math.round(R(3,5)),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*2.2))):1,w=D*.04,li=D*.95/n,ro=o.rim?.15:1;
  const rules={S:()=>[['F',{l:D*1.9*kr*ro,w0:w*1.3,w1:w*1.12,e:.01}],['N0',{}],['F',{l:D*.3,w1:w*1.05,aim:V3.nz(V3.add(hd,[0,-.12,0])),k:.6}],['$',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.4,w1:w*.3,e:.02}]];const q=p.i/(n-1),fl=p.i<nf,age=fl?1-.12*p.i:Math.max(0,.45-.5*(p.i-nf)/Math.max(1,n-nf));
      return[['F',{l:D*(p.i?.14-.1*q:.06)*R(.9,1.1),w1:w*(1-.55*q),e:.006+.012*q}],['Nd',{i:p.i}],['[',{w:w*.5}],['+',{a:(p.i%2?1:-1)*R(12,22)}],['^',{a:fl?R(44,54):R(22,38)*(1-.5*q)+8}],['F',{l:D*.03,w1:w*.4}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.12,T:[0,1,0],e:.01,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  /* the bouquet stem ends at the elbow: the hand belongs to the head */
  const apex=res.organs.find(q=>q.t==='N0').pos;
  /* native SVG (y-freesia.js): the spike by the kit y3-grappe.js, from the elbow; the chance above and the old flowers' draws are consumed as before */
  if(typeof freSvPlant==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return freSvPlant(k,t,o,{res,apex,cw,op,D,up,hd,n,nf,dbl,sx,U0,sheet:!B.reach&&!o.rim});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='Nd'){/* the two little bracts at the node */const Bn=frZ(V3.add(og.H,[0,.5,0]),up,0);return{parts:[{z:pos[2]-.2,fn:par=>{if(LOD)return;let d='';for(const ph of[70,110])d+=smooth(ligule(Bn,pos,{phi:ph*D2R,r0:0,z0:0,L:Lf*.16,W:Lf*.06,wp:prof([[0,1],[.5,.8],[1,.05]]),a0:.3,a1:.5,th:.8,tip:'point',n:3}).out);E('path',{d,fill:'#8a9a5a',stroke:'#4a5a28','stroke-width':.35,'stroke-opacity':.6},par)}}]}}
    if(og.t==='K'){const Bf=frZ(og.H,up,R(-.3,.3)),s=1-.1*og.p.i;return{parts:[{z:pos[2]+og.H[2]*Lf*.4,fn:par=>freFlower(par,Bf,pos,Lf*s,cw,Math.min(1,op*1.1)*(1-.12*og.p.i),dbl)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=frZ(og.H,up,0),s=Lf*(.28+.5*a);return{parts:[{z:pos[2]+og.H[2]*s*.4,fn:par=>spBud(par,Bf,pos,s,s*.3,mix(cw.c,'#7f9f5a',Math.min(1,.85-1.4*a)),{tp:.6,pw:.65})}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- Dutch iris (Iris × hollandica): one flower out of two green spathes at the top of a stiff stem, two or three linear channelled leaves sheathing it;
   three falls (the outer tepals) rising on a narrow haft then hanging their blade, a yellow signal on it; three standards (the inner tepals) upright; three petaloid style arms arching over the hafts ---------- */
const CW_IRIS=[{id:'bleu',n:'Bleu (Blue Magic)',c:'#4a44a8',sig:'#f2c21c'},{id:'bleu-nuit',n:'Bleu gentiane (Professor Blaauw)',c:'#26307a',sig:'#f0b818'},{id:'violet',n:'Violet (Purple Sensation)',c:'#5a2a90',sig:'#f0c020'},
  {id:'bleu-ciel',n:'Bleu ciel (Wedgwood)',c:'#8a9ad8',sig:'#f2c830'},{id:'silvery',n:'Bleu pâle et blanc (Silvery Beauty)',c:'#b0bce8',fc:'#f4f4f8',sig:'#f2c830'},{id:'blanc',n:'Blanc (White Excelsior)',c:'#f7f5ee',sig:'#f2d040'},
  {id:'jaune',n:'Jaune (Golden Harvest)',c:'#f5d02a',sig:'#f09810'},{id:'apollo',n:'Blanc et jaune (Apollo)',c:'#f6f4ec',fc:'#f5d02a',sig:'#f0a018'},
  {id:'bronze',n:'Pourpre et bronze (Red Ember)',c:'#6a3a7a',fc:'#9a4a2e',sig:'#f0b020'},{id:'noir',n:'Pourpre noir',c:'#3a1a50',sig:'#f2c21c'},
  /* late colourways (measured, coloris-lch.md): after rank 9, so no existing number moves */
  {id:'violet-blanc',n:'Violet et blanc (Carmen)',c:'#ccc7da',fc:'#c8c9ce',sig:'#e5cf41',late:6},{id:'bronze-cuivre',n:'Bronze cuivre (Autumn Princess)',c:'#9d693c',fc:'#9c7c13',sig:'#c39951',late:6},
  {id:'bleu-bronze',n:'Bleu-violet et bronze (Tigereye)',c:'#55337b',fc:'#5e313a',sig:'#e8bf17',late:6},{id:'pourpre-brun-or',n:'Pourpre-brun et or (Lion King)',c:'#5f3c29',fc:'#6d550c',sig:'#c3a023',late:6},
  {id:'mauve-bronze-jaune',n:'Mauve et bronze-jaune (Romano)',c:'#66527e',fc:'#aa8a33',sig:'#debe3b',late:6},{id:'lilas',n:'Lilas (Panther)',c:'#b691e9',fc:'#9784cd',sig:'#fbcd19',late:6}];
const IR_FALL=prof([[0,.2],[.35,.32],[.55,.82],[.8,1],[.95,.72],[1,.24]]),IR_STD=prof([[0,.18],[.35,.5],[.75,1],[.95,.62],[1,.2]]),IR_STY=prof([[0,.5],[.5,.85],[.8,1],[1,.35]]);
/* the two spathes round the base of the flower (or the bud), green, their tips papery */
function irisSpathes(it,B,O,R0){for(const[ph,Lk]of[[R(0,6.28),1],[R(0,6.28)+2.8,.8]])it.push({l:ligule(B,O,{phi:ph,r0:R0*.12,z0:-R0*.85,L:R0*1.2*Lk,W:R0*.27,wp:prof([[0,.9],[.5,.8],[.85,.4],[1,.05]]),a0:.12,a1:.04,pw:1,th:1.6,tip:'point',n:5}),c:'#5f8a4a',cb:'#7a9a5a',ink:'#2e4a22',lift:.2,tipc:'#c8c098',tf:.7})}
function irisFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,o2=sm01((op-.15)/.85),it=[],cache={},det=DET>=1.5,c=cw.c,fc=cw.fc||c,cb=mix(c,'#d8dce8',.15),fb=mix(fc,'#d8dce8',.2),sty=mix(c,'#f4f2f8',.35);
  irisSpathes(it,B,O,R0);it.push(tubeFlat(B,O,[[0,0,-R0*.7],[0,0,-R0*.3],[0,0,R0*.05]],R0*.08,R0*.1,'#6f9a52',{ink:'#2e4a22'}));
  const fall=[],nm=[];for(let i=0;i<3;i++){const ph=-Math.PI/2+i*2.094;
    /* the fall: haft rising, blade hanging; its signal a yellow tongue at the turn */
    const l=ligule(B,O,{phi:ph+R(-.04,.04),r0:R0*.08,z0:R0*.05,L:R0*1.15,W:R0*.5,wp:IR_FALL,a0:.45+.2*o2,a1:.9+1.35*o2,pw:1.7,th:.5,tip:'round',wav:.05,n:det?9:6,tw:R(-.08,.08)});
    it.push({l,c:fc,cb:fb,lift:.15,mid:shd(fc,-.25),mw:Math.max(.4,R0*.03),mo:.5});
    if(!LOD&&l.nm[2]>-.05&&o2>.3)it.push({z:l.z+1e-4,fn:kk=>{const q=[];for(const[t,u]of[[.3,0],[.42,-.24],[.6,-.3],[.74,0],[.6,.3],[.42,.24]])q.push(ligAt(l,t,u));E('path',{d:smooth(q),fill:cw.sig,stroke:shd(cw.sig,-.3),'stroke-width':.3,'stroke-opacity':.6},kk);
      const v=[];for(const t of[.32,.5,.66])v.push(ligAt(l,t,0));E('path',{d:smooth(v,false),stroke:shd(cw.sig,-.45),'stroke-width':f(Math.max(.4,R0*.03)),'stroke-opacity':.7,fill:'none'},kk)}});
    /* the style arm over its haft, keeled, two little crests at its tip */
    it.push({l:ligule(B,O,{phi:ph+R(-.03,.03),r0:R0*.04,z0:R0*.14,L:R0*.68,W:R0*.2,wp:IR_STY,a0:.3+.15*o2,a1:.75+.55*o2,pw:1.3,th:-.7,tip:'point',n:det?6:4}),c:sty,cb:mix(sty,'#e0e0ea',.2),lift:.25});
    /* the standard, upright between two falls */
    const ps=ph+Math.PI/3;it.push({l:ligule(B,O,{phi:ps+R(-.05,.05),r0:R0*.06,z0:R0*.12,L:R0*.95,W:R0*.3,wp:IR_STD,a0:.06+.08*o2,a1:.18+.28*o2,pw:1.2,th:.7,tip:'round',wav:.06,n:det?7:5,tw:R(-.15,.15)}),c,cb,lift:.2,mid:shd(c,-.2),mw:Math.max(.3,R0*.02),mo:.4})}
  spPetals(k,it,cache);return k}
/* the bud: a slim pencil, its colour showing above the spathes */
function irisBud(par,B,O,D,cw,a){const k=G(par),R0=D/2,it=[],c=mix(cw.fc&&a<.5?cw.fc:cw.c,'#6f8a5a',.5-.45*a);irisSpathes(it,B,O,R0);const s=R0*(1.5+.6*a);
  it.push({z:PJ(B,O,[0,0,R0*.2])[2]-R0*.3,fn:kk=>{spBud(kk,B,V3.add(O,toV(B,[0,0,-R0*.5])),s,R0*(.32+.12*a),c,{tp:.8,pw:.6});if(!LOD){const q=[];for(let j=0;j<=6;j++){const v=j/6,an=1.2+v*1.5,r=R0*(.15+.06*a)*Math.sin(Math.PI*Math.min(.98,.05+.95*v));q.push(PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,-R0*.5+v*s]))}E('path',{d:smooth(q.map(p=>[p[0],p[1]]),false),stroke:shd(c,-.4),'stroke-width':.4,'stroke-opacity':.6,fill:'none'},kk)}}});
  spPetals(k,it,{});return k}
function irisPlant(g,t,o){const cw=o.cw||cwNear(CW_IRIS,o.col)||CW_IRIS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=['#2e4a3a','#557a64','#7ea08a','#b0c8b8'];
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,w=D*.055,ph0=R(0,360),nl=o.rim?0:2,ro=o.rim?.2:1,lean=V3.nz(V3.add(up,V3.sc(face,.18)));
  /* a stiff stem: hardly any tropism, two leaves sheathing it and rising close along it, then the flower */
  const rules={S:()=>{const out=[['F',{l:D*.9*kr*ro,w0:w*1.25,w1:w*1.15,e:.004}]];for(let i=0;i<nl;i++)out.push(['[',{}],['/',{a:ph0+i*180+R(-20,20)}],['&',{a:R(13,19)}],['Lv',{i}],[']',{}],['F',{l:D*.5*kr,w1:w*(1.1-.04*i),e:.004}]);
    out.push(['F',{l:D*.45*kr*ro,w1:w,aim:lean,k:.15}],['K',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,1),{p:[0,0,0],H:up,U:U0,wig:.008,seg:D*.15,T:[0,1,0],e:.004,w:w*1.25});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){/* the flower's axis along the stem, tipped a little toward the face; a fall turned toward the face */const Z=V3.nz(V3.add(og.H,V3.sc(face,.35))),v=V3s(face,V3.sc(Z,V3.dot(face,Z))),Bf=frZ(Z,V3l(v)>.05?V3.sc(v,-1):og.U,R(-.25,.25));
      const Of=V3.add(pos,V3.sc(Z,D*.35));return{parts:[{z:pos[2]+Z[2]*D*.3,fn:par=>op<.3?irisBud(par,Bf,Of,D,cw,op/.3):irisFlower(par,Bf,Of,D,cw,op)}]}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(1.3,1.6)*(og.p.i?.75:1),.085,'#5a7f68',pp,{wp:LS_STRAP,droop:.1,arch:.04,fold:.4,face:.3,tw:R(-.4,.4)});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- hyacinth (Hyacinthus orientalis): a fleshy scape carrying a dense spike of twenty to forty waxy florets, each a short bell opening into six star lobes curled back at their tips;
   they open from the bottom up, the top ones still tight green-tinted buds; cut with its bulb (on the sheet), the bulb in its papery tunic, roots and strap leaves.
   Light on purpose: a floret is three paths (lobes behind, bell, lobes in front), one blob when it turns its back, a bud one path ---------- */
const CW_HYA=[{id:'bleu',n:'Bleu (Delft Blue)',c:'#8a7cb6',tun:'#7a5a8a'},{id:'bleu-nuit',n:'Bleu-violet (Blue Jacket)',c:'#5e58aa',tun:'#5a3a6a'},{id:'violet',n:'Violet (Peter Stuyvesant)',c:'#3c2f84',tun:'#5a3a6a'},
  {id:'mauve',n:'Mauve (Splendid Cornelia)',c:'#a87aa4',tun:'#8a6a8a'},{id:'rose',n:'Rose (Pink Pearl)',c:'#c4408a',tun:'#9a6a7a'},{id:'rose-pale',n:'Rose pâle (Fondant)',c:'#ca94b6',tun:'#a88a8a'},
  {id:'fuchsia',n:'Rouge cerise (Jan Bos)',c:'#bc2240',tun:'#7a3a4a'},{id:'blanc',n:'Blanc (Carnegie)',c:'#dcdcd2',tun:'#c8b8a0'},{id:'creme',n:'Crème (City of Haarlem)',c:'#dacb84',tun:'#c0a880'},
  {id:'saumon',n:'Saumon (Gipsy Queen)',c:'#cc907a',tun:'#b08a7a'},{id:'pourpre',n:'Pourpre (Woodstock)',c:'#7a2c5e',tun:'#5a2a4a'},
  /* added late (wave late:4, after the SKU numbers already published): KAVB names, level B */
  {id:'magenta',late:4,n:'Magenta (Miss Saigon)',c:'#be6bbd',tun:'#7a4a7a'},{id:'violet-pourpre',late:4,n:'Violet pourpré (Purple Sensation)',c:'#9e6ebe',tun:'#5a3a6a'}];
/* one floret in its frame (local Z its mouth), length L, open a (0 bud … 1); cache holds the tones */
function hyaFloret(par,B,O,L,cw,a,cache){const nz=B[2][2],c=cw.c;
  if(a<.35){const bc=mix(c,'#9ab878',.6-1.3*a);spBud(par,B,O,L*(.5+.25*a/.35),L*(.26+.1*a/.35),bc,{tp:.25,pw:.6});return}
  const P=k=>{const key=c+k;return cache[key]||(cache[key]=toneAt(pal7(c),k/14))},inkc=cache['i'+c]||(cache['i'+c]=shd(c,h2l(c)[2]>.8?-.45:-.35)),o2=Math.min(1,(a-.35)/.65),zr=L*.52,rr=L*(.14+.05*o2),bell=[],back=[],front=[];
  for(let i=0;i<=4;i++){const v=i/4,r=L*(.07+.13*Math.pow(v,.8))*(rr/(L*.19)),z=v*zr;for(let j=0;j<8;j++){const an=j/8*6.283,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,z]);bell.push([p[0],p[1]])}}
  const rot=(O[0]*.37+O[1]*.11)%6.283,zc=PJ(B,O,[0,0,zr*.5])[2];
  for(let i=0;i<6;i++){const ph=rot+i/6*6.283,R0=[Math.cos(ph),Math.sin(ph),0],T=[-Math.sin(ph),Math.cos(ph),0],ll=L*(.34+.08*o2),pts=[];let p=[R0[0]*rr,R0[1]*rr,zr],Lp=[],Rp=[];
    for(let j=0;j<=4;j++){const t=j/4,an=.55+(.7+1.4*o2)*Math.pow(t,1.3),d=V3.add(V3.sc(R0,Math.sin(an)),[0,0,Math.cos(an)]),w=L*.13*Math.sin(Math.PI*Math.min(.97,.25+.75*t))*(1-.45*t);if(j)p=V3.add(p,V3.sc(d,ll/4));
      const a1=PJ(B,O,V3.add(p,V3.sc(T,w))),b1=PJ(B,O,V3.add(p,V3.sc(T,-w)));Lp.push([a1[0],a1[1]]);Rp.push([b1[0],b1[1]])}
    const tp=PJ(B,O,V3.add(p,V3.sc(V3.add(V3.sc(R0,Math.sin(.55+.7+1.4*o2)),[0,0,Math.cos(.55+.7+1.4*o2)]),L*.04))),mid=PJ(B,O,V3.add(V3.sc(R0,rr*1.3),[0,0,zr]));
    (mid[2]<zc?back:front).push(Lp.concat([[tp[0],tp[1]]],Rp.reverse()))}
  const sw=.35,Ib=Math.round(Math.max(0,Math.min(1,lightI(V3.nz(V3.add(B[2],[-.3,.5,.4])))))*14),If=Math.round(Math.max(0,Math.min(1,lightI(B[2])+.08))*14);
  if(back.length)E('path',{d:back.map(q=>smooth(q)).join(''),fill:P(Math.max(0,Ib-1)),stroke:inkc,'stroke-width':sw,'stroke-opacity':.55},par);
  E('path',{d:smooth(hull2(bell)),fill:P(Ib),stroke:inkc,'stroke-width':sw,'stroke-opacity':.55},par);
  if(nz>.25&&!LOD){const m=spDisc(B,O,rr*.8,zr,8);E('path',{d:smooth(m),fill:shd(c,-.32),opacity:.85},par)}
  if(front.length)E('path',{d:front.map(q=>smooth(q)).join(''),fill:P(If),stroke:inkc,'stroke-width':sw,'stroke-opacity':.55},par)}
function hyaPlant(g,t,o){const cw=o.cw||cwNear(CW_HYA,o.col)||CW_HYA[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||12)*UPC,k=G(g),sc=['#3a5a2a','#6a9a4a','#94bc6e','#c4dca4'],Lf=3.6*UPC*Math.pow(D/(12*UPC),.25),cache={};
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const sheet=!B.reach&&!o.rim,n=Math.round(R(30,36)),nOpen=Math.round(n*(op<.3?0:op<.7?.45:.82)),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.4))):1,w=D*.085,li=D/n,ph0=R(0,360);
  const rules={S:()=>{const out=[];if(sheet)for(let i=0;i<3;i++)out.push(['[',{}],['/',{a:ph0+i*125+R(-15,15)}],['&',{a:R(20,30)}],['Lv',{i}],[']',{}]);
      out.push(['F',{l:D*(sheet?1.1:.75)*kr*(o.rim?.2:1),w0:w*1.15,w1:w,e:.004}],['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.6,w1:w*.35}]];const q=p.i/(n-1);
      return[['F',{l:li*R(.9,1.1),w1:w*(.55-.3*q),e:.004}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:w*.2}],['/',{a:ph0+p.i*137.5}],['&',{a:(p.i<nOpen?100-28*q:op<.3?52-30*q:64-40*q)+R(-6,6)}],['f',{l:w*(.26-.14*q)+Lf*.03}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.006,seg:D*.1,T:[0,1,0],e:.004,w:w*1.15});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  /* native SVG (y-hyacinthus.js): the raceme by the kit y3-grappe.js, the scape a lit cylinder; the chance above is consumed as before */
  if(typeof hyaSvPlant==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return hyaSvPlant(k,t,o,{res,apex,cw,op,D,sheet,up,face,n,ph0});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const i=og.p.i,a=i<nOpen?Math.min(1,.55+.45*(1-i/Math.max(1,nOpen))+(op>.9?.2:0)):Math.max(0,.3-.3*(i-nOpen)/Math.max(1,n-nOpen)),Bf=frZ(og.H,up,0),s=Lf*(1-.25*og.p.q);
      return{parts:[{z:pos[2]+og.H[2]*s*.4,fn:par=>hyaFloret(par,Bf,pos,s,cw,a,cache)}]}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.8,1),.13,'#4f7a3a',pp,{wp:LS_STRAP,droop:.18,arch:.06,fold:.35,face:.3,gloss:.3});return{ext:1,parts:pp}}
    return null}});
  /* never a bulb (STANDARD-RENDU 8 ter): its roots' 27 draws are still made, the chance as before */
  if(sheet)for(let i=0;i<27;i++)R();
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'jacinthe':hyaPlant,'iris-hollandais':irisPlant,'freesia':frePlant,'hellebore-orientalis':hellPlant,'cyclamen-fleur-coupee':cycPlant});
Object.assign(CWS,{'jacinthe':CW_HYA,'iris-hollandais':CW_IRIS,'freesia':CW_FRE,'hellebore-orientalis':CW_HELL,'cyclamen-fleur-coupee':CW_CYC});
Object.assign(SZG,{'jacinthe':[10,12,12,14,15],'iris-hollandais':[8,9,9,10,11],'freesia':[6,7,8,8,9],'hellebore-orientalis':[5,6,6.5,7,8],'cyclamen-fleur-coupee':[4,4.5,5,5.5,6]});
Object.assign(GHI,{'jacinthe':{form:'grappe',size:2,k:'head',rk:.7},'iris-hollandais':{form:'etoile',size:2.5,k:'head',rk:.85},'freesia':{form:'grappe',size:2,k:'head',rk:.6},'hellebore-orientalis':{form:'cornet',size:2,k:'head',rk:.95},'cyclamen-fleur-coupee':{form:'etoile',size:1.8,k:'head',rk:.8}});
for(const id of['jacinthe','iris-hollandais','freesia','hellebore-orientalis','cyclamen-fleur-coupee'])GH_BUDS.add(id);
