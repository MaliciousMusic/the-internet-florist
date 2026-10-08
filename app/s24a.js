/* ================= Serre, lot 24 — feuillages 2 : palmier soleil séché, physocarpe, ruscus italien (Danae), géranium odorant, fusain ailé ================= */
/* ---------- a leafy stem grown by the L-system. In a bouquet its main axis follows the composer's spine (from o.from, where it leaves the stems, to its tip);
   on a sheet or a card it stands in the frame of the view (o.ax = where its front looks), arched to one side. Its nodes carry leaves by their phyllotaxis,
   side shoots and axillary organs; the leaves turn their upper face toward the front of the spray (Fr), as cut foliage is arranged ---------- */
const fgArc=(A,s)=>{let l=0,p=A.cb(0);for(let i=1;i<=40;i++){const q=A.cb(s*i/40);l+=V3l(V3s(q,p));p=q}return l};
function fgAxis(o,Lt,arch){let A;
  if(o.spine){A=spAxis(o,Lt,{face:R(-.4,.4)});A.up=[0,1,0]}
  /* a card's bunch: the stem rises from the tie (o.up = from the tie to this stem's place), so the whole stem keeps its own colour */
  else if(o.up&&Math.hypot(o.up[0],o.up[1])>6){const u=V3.nz([o.up[0],o.up[1],0]),sd=[u[1],-u[0],0],P0=[-o.up[0],-o.up[1],0],L2=Math.max(Lt,Math.hypot(o.up[0],o.up[1])*1.6),a=arch*L2*.5,
      C=[P0,V3.add(P0,V3.sc(u,L2*.36)),V3.add(V3.add(P0,V3.sc(u,L2*.7)),V3.sc(sd,a*.4)),V3.add(V3.add(P0,V3.sc(u,L2*.97)),V3.sc(sd,a))];A=spAxis(o,L2,{C,Fr:[0,0,1]});A.up=[0,1,0]}
  else{const B=frameOf(o,0),a=arch*Lt,C=[[0,0,0],[a*.06,Lt*.36,0],[a*.45,Lt*.7,0],[a,Lt*(1-.1*Math.abs(arch)),0]].map(p=>toV(B,p));A=spAxis(o,Lt,{C,Fr:toV(B,[0,0,1])});A.up=V3.nz(toV(B,[0,1,0]))}
  A.s0=o.spine?Math.max(0,Math.min(.95,o.from||0)):0;A.l0=A.s0?fgArc(A,A.s0):0;return A}
/* the colourway asked for: its exact colour (a product), else the nearest of the plain forms (a model's colour never lands on a flowering or fruiting form) */
const fgCw=(list,o)=>o.cw||list.find(w=>w.c===o.col)||cwNear(list.filter(w=>!w.f),o.col)||list[0];
/* the leaf's own frame: its blade turned toward the front of the spray (k of the way), its midrib kept */
/* the size of a leaf along its shoot: full, then smaller toward the tip (t0: where it starts to shrink) */
const fgSz=(p,t0=.8)=>{const x=p.o?(p.b??1):p.u;return x>t0?.42+.58*(1-x)/(1-t0):1};
function fgFace(og,F,k){const H=og.H;let T=V3s(F,V3.sc(H,V3.dot(F,H)));if(V3l(T)<1e-3)return og;T=V3.nz(T);let U=V3.add(V3.sc(og.U,1-k),V3.sc(T,k));U=V3s(U,V3.sc(H,V3.dot(U,H)));if(V3l(U)<1e-3)return og;U=V3.nz(U);return Object.assign({},og,{U,L:V3.cr(U,H)})}
/* S: li internode, liT its shortening to the tip, w0 w1 widths, cols, uL first leafy node (share of the axis), phy 'spiral'|'alt2'|'opp', la leaf angle, lp chance of a leaf,
   side {u0,u1,p,len,ang,li,e,pair}, axil {u0,p,ang}, leaf/tip/axil/node(og) → parts, post(res,parts) */
function fgGrow(k,A,S){const Le=A.L,f0=A.at(A.s0),mid=A.at(.6),Fr=V3.nz(V3.add(mid.Fr,V3.sc(mid.T,S.lift??.35))),wAt=l=>S.w0+(S.w1-S.w0)*Math.min(1,l/Le),ph=S.phy||'spiral';
  const aimF=(l,len)=>({l:len,w1:wAt(l+len),aim:A.at(A.sOf(l+len*.6)).T,k:.8});
  /* every axis ends in its young leaves, folded round the bud */
  const tipLv=o=>S.tipLv===0?[]:[['[',{}],['/',{a:R(-30,30)}],['&',{a:16}],['Lv',{u:1,o,j:0,tip:1}],[']',{}]].concat(ph==='spiral'&&rnd()<.5?[]:[['[',{}],['/',{a:180+R(-30,30)}],['&',{a:24}],['Lv',{u:.96,o,j:1,tip:1}],[']',{}]]);
  const rules={A:p=>{const li=S.li*(1-(S.liT??.3)*p.l/Le)*R(.85,1.15);if(p.l+li>Le-S.li*.35)return[['F',aimF(p.l,Math.max(1,Le-p.l))],['T',{u:1,o:0}],...tipLv(0)];return[['F',aimF(p.l,li)],['N',{u:(p.l+li)/Le,i:p.i,o:0}],['A',{l:p.l+li,i:p.i+1}]]},
    B:p=>{const sd=S.side,li=S.li*(sd.li??.8)*R(.85,1.15);if(p.l+li>p.Lb-S.li*.3)return[['F',{l:Math.max(1,p.Lb-p.l),w1:p.w*.45,e:sd.e??-.012}],['T',{u:1,o:1}],...tipLv(1)];
      return[['F',{l:li,w1:p.w*(1-.5*(p.l+li)/p.Lb),e:sd.e??-.012}],['N',{u:p.u0+(1-p.u0)*(p.l+li)/p.Lb,b:(p.l+li)/p.Lb,i:p.i+p.k,o:1}],['B',Object.assign({},p,{l:p.l+li,i:p.i+1})]]},
    N:p=>{const out=[],i=p.i,r0=ph==='alt2'?(i%2?90:-90):ph==='opp'?(i%2?90:0):i*137.5+(S.ph0||0);if(S.node)out.push(['Nd',{u:p.u,o:p.o}]);
      if(p.o||p.u>=S.uL){const nl=ph==='opp'?2:1;for(let j=0;j<nl;j++)if(rnd()<(S.lp??1))out.push(['[',{}],['/',{a:r0+j*180+R(-(S.rj??14),S.rj??14)}],['&',{a:S.la+R(-8,8)}],['Lv',{u:p.u,b:p.b,o:p.o,j}],[']',{}])}
      const sd=S.side;if(!p.o&&sd&&p.u>=sd.u0&&p.u<=sd.u1){const ns=ph==='opp'&&sd.pair?2:1;for(let j=0;j<ns;j++)if(rnd()<sd.p){const Lb=Le*(1-p.u)*sd.len*R(.75,1.1);if(Lb<S.li*1.6)continue;
        const w=wAt(p.u*Le)*.62;out.push(['[',{w}],['/',{a:r0+j*180+(ph==='opp'?0:R(-25,25))}],['&',{a:sd.ang+R(-8,8)}],['$',{v:Fr}],['^',{a:R(-(sd.tilt??0),sd.tilt??0)}],['B',{l:0,Lb,i:0,k:j*5+3,u0:p.u,w}],[']',{}])}}
      const ax=S.axil;if(ax&&p.u>=(ax.u0||0)&&(p.o||p.u>=S.uL)&&rnd()<ax.p)out.push(['[',{}],['/',{a:r0+(ph==='opp'?90:180)+R(-20,20)}],['&',{a:(ax.ang??30)+R(-6,6)}],['X',{u:p.u,o:p.o}],[']',{}]);
      return out}};
  const steps=2*Math.ceil(Le/(S.li*.55))+8,res=lsTurtle(lsDerive([['A',{l:A.l0,i:0}]],rules,steps),{p:f0.p,H:f0.T,U:f0.Fr,w:wAt(A.l0),seg:S.seg||12,T:A.up,e:0,wig:S.wig??.02});
  for(const ch of res.chains)ch.c=S.cols;const parts=[];lsChainParts(res.chains,[0,0,0],S.cols,parts,{piece:S.piece||9});
  for(const og of res.organs){const fn=og.t==='Lv'?S.leaf:og.t==='T'?S.tip:og.t==='X'?S.axDraw:og.t==='Nd'?S.nodeDraw:null;if(!fn)continue;const r=fn(og.t==='Lv'?fgFace(og,Fr,S.face??.75):og,og.p,Fr);if(r)parts.push(...[].concat(r))}
  if(S.post)S.post(res,parts,Fr);drawParts(k,parts);
  const b=res.chains[0].pts[0],T0=f0.T,l=Math.hypot(T0[0],T0[1])||1;return{k,bw:Math.max(wAt(A.l0)*1.15,2.4),bw1:wAt(A.l0),bc:S.cols,neck:[b[0],-b[1]],nd:[-T0[0]/l,T0[1]/l]}}
/* ---------- a blade in 3D on the engine's leaf surface (lsLeafS: along H, across L, folded on its midrib, arched, drooping): drawn as its two halves,
   each lit by its own normal (the fold between them reads as the midrib), teeth as a zigzag of the margin, an optional petiole, veins and gloss on the sheets ---------- */
const fgQ=p=>[p[0],-p[1]],fgD=P=>'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z';
function fgBlade(og,len,wr,c,cb,o={}){const S=lsLeafS(og,len,wr,o),nv=LOD?6:Math.max(6,Math.round((o.nv||14)*(DET>=1.5?1:.7))),tz=LOD||DET<1.5&&!o.tz1?0:o.tz||0,P=pal7(c),PB=pal7(cb);
  const Lf=[],M=[],Rt=[],nA=[0,0,0],nB=[0,0,0];let z=0,zA=0,zB=0;
  for(let i=0;i<=nv;i++){const v=i/nv,tf=tz&&i>0&&i<nv?(i%2?1+tz:1-tz*.6):1,a=S(-tf,v),m=S(0,v),b=S(tf,v);Lf.push(a);M.push(m);Rt.push(b);z+=m[2];zA+=a[2];zB+=b[2]}
  for(let i=0;i<nv;i++){const dv=V3s(M[i+1],M[i]),na=V3.cr(dv,V3s(M[i],Lf[i])),nb=V3.cr(dv,V3s(Rt[i],M[i]));for(let j=0;j<3;j++){nA[j]+=na[j];nB[j]+=nb[j]}}
  const half=(E2,n)=>{const nn=V3l(n)>1e-9?V3.nz(n):[0,0,1],fr=nn[2]>=0,I=lightI(fr?nn:V3.sc(nn,-1))+(o.dI||0);return{pts:M.map(fgQ).concat(E2.map(fgQ).reverse()),col:toneAt(fr?P:PB,I),fr,ink:(fr?P:PB).ink}};
  const hA=half(Lf,nA),hB=half(Rt,nB),ord=zA<zB?[hA,hB]:[hB,hA],sm=!tz&&!o.sharp;
  return{z:z/(nv+1)+(o.zb||0),fn:par=>{if(o.pet){const p0=fgQ(o.pet.p0),p1=fgQ(M[0]),m=[(p0[0]+p1[0])/2,(p0[1]+p1[1])/2+Math.hypot(p1[0]-p0[0],p1[1]-p0[1])*.08];
      E('path',{d:`M${f(p0[0])},${f(p0[1])}Q${f(m[0])},${f(m[1])} ${f(p1[0])},${f(p1[1])}`,stroke:o.pet.c,'stroke-width':f(o.pet.w),fill:'none','stroke-linecap':'round'},par)}
    for(const h of ord)E('path',{d:sm?smooth(h.pts):fgD(h.pts),fill:h.col,stroke:h.ink,'stroke-width':DET>=1.5?.35:.45,'stroke-opacity':.32,'stroke-linejoin':'round'},par);
    if(!LOD&&DET>=1.5){const fr=hA.fr||hB.fr;
      if(o.veins&&fr){let d='';for(const L of o.veins)d+='M'+L.map(([u,v])=>{const q=fgQ(S(u,v));return f(q[0])+','+f(q[1])}).join('L');E('path',{d,stroke:P.d1,'stroke-width':.4,'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},par)}
      if(o.gloss&&fr){const sg=hA.col>hB.col?-1:1,A2=[],B2=[];for(let i=1;i<nv;i++){const v=i/nv;A2.push(fgQ(S(sg*.12,v)));B2.push(fgQ(S(sg*.55,v)))}E('path',{d:smooth(A2.concat(B2.reverse())),fill:'#ffffff',opacity:f(.22*o.gloss)},par)}}}}}
/* a small 3D batch helper: a polygon of points in view space round centre c in the plane (X,Y) */
const fgPoly=(c,X,Y,pts)=>pts.map(([x,y])=>fgQ(V3.add(c,V3.add(V3.sc(X,x),V3.sc(Y,y)))));
/* two unit vectors across a direction d */
function fgCross(d){const a=Math.abs(d[1])<.9?[0,1,0]:[1,0,0],X=V3.nz(V3.cr(a,d));return[X,V3.cr(d,X)]}

/* ---------- dried sun palm (Licuala grandis, Saribus rotundifolius — « sun palm », anahaw): an orbicular fan pleated like an accordion, the pleats radiating from the hastula
   at the top of a long flat petiole and ending in pointed rays; dried, bleached or dyed (the petiole dyed with it). Stages: the fan folded shut, half spread, fully spread ---------- */
const CW_SUN=[{id:'naturel',n:'Naturel paille',c:'#d6c3a0'},{id:'blanchi',n:'Blanchi',c:'#f3efe6'},{id:'creme',n:'Crème',c:'#eadcbc'},{id:'noir',n:'Noir',c:'#2a2628'},
  {id:'rose-poudre',n:'Rose poudré',c:'#efc2cc'},{id:'fuchsia',n:'Fuchsia',c:'#b8325a'},{id:'rouge',n:'Rouge',c:'#b5313a'},{id:'bordeaux',n:'Bordeaux',c:'#6e1a26'},
  {id:'terracotta',n:'Terracotta',c:'#b8623e'},{id:'orange',n:'Orange brûlé',c:'#d8742a'},{id:'lilas',n:'Lilas',c:'#bfaed6'},{id:'bleu',n:'Bleu nuit',c:'#2e3a6a'},{id:'or',n:'Doré',c:'#c9a050'}];
function sunPalm(g,t,o){const cw=fgCw(CW_SUN,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=22,ks=o.spine?1:(o.cm||cm0)/cm0,R0=(o.spine?(o.cm||cm0):(o.cm||cm0))*UPC/2,k=G(g);
  const nat=cw.id==='naturel'||cw.id==='creme',pc=nat?'#b89a6a':shd(cw.c,-.1),cols=[shd(pc,-.62),shd(pc,-.3),pc,shd(pc,.42)],Lt=o.spine?blen(o.spine):45*UPC*ks,A=fgAxis(o,Lt,R(-.08,.08));
  const r=fgGrow(k,A,{li:9*UPC,liT:0,w0:4.6,w1:3.4,cols,uL:2,seg:14,wig:.01,tipLv:0,
    tip:(og)=>{const parts=[],T=og.H,Fz=V3s(A.at(1).Fr,V3.sc(T,V3.dot(A.at(1).Fr,T))),Z=V3l(Fz)>1e-3?V3.nz(Fz):fgCross(T)[0],Y=T,X=V3.cr(Y,Z),O=V3.add(og.pos,V3.sc(Y,R0*.02)),
        n=LOD?16:DET>=1.5?40:28,thF=158*D,q=.1+.9*op,th=thF*q,dF=thF/n,phi=34*D,hk=Math.sqrt(Math.max(0,1/Math.cos(phi)**2-q*q)),P=pal7(cw.c),PB=pal7(mix(cw.c,nat?'#e8dcc0':shd(cw.c,.15),.3));
      const rTip=[];for(let i=0;i<=n;i++)rTip.push(R0*(i%2?.84+R(-.02,.02):1+R(-.03,.03))*(1-.18*(1-q)));
      const at=(i,r)=>{const a=-th+2*th*i/n,h=r*dF/2*hk*(i%2?-1:1)*Math.min(1,r/(R0*.12)),zz=h-.12*r*r/R0+R0*.1*Math.max(0,-Math.cos(a))*Math.min(1,r/R0*2);return V3.add(O,V3.add(V3.add(V3.sc(X,Math.sin(a)*r),V3.sc(Y,Math.cos(a)*r)),V3.sc(Z,zz)))};
      const sk=[.06,.5,1];for(let i=0;i<n;i++){const P3=[...sk.map(s=>at(i,s*(s===1?rTip[i]:R0))),...sk.slice().reverse().map(s=>at(i+1,s*(s===1?rTip[i+1]:R0)))];
        let nr=V3.cr(V3s(P3[2],P3[0]),V3s(P3[4],P3[1]));nr=V3l(nr)>1e-9?V3.nz(nr):[0,0,1];const fr=nr[2]>=0,I=lightI(fr?nr:V3.sc(nr,-1))+R(-.035,.035),col=toneAt(fr?P:PB,I),zz=P3.reduce((a,p)=>a+p[2],0)/6,pts=P3.map(fgQ);
        parts.push({z:zz,fn:par=>E('path',{d:fgD(pts),fill:col,stroke:P.d2,'stroke-width':DET>=1.5?.3:.4,'stroke-opacity':.42,'stroke-linejoin':'round'},par)})}
      /* the hastula: a little crest where the pleats meet the petiole, on the front */
      const hz=V3.add(O,V3.sc(Z,R0*.04));parts.push({z:hz[2]+.5,fn:par=>E('path',{d:fgD(fgPoly(hz,X,Y,[[-R0*.07,-R0*.02],[0,R0*.1],[R0*.07,-R0*.02],[0,-R0*.05]])),fill:shd(pc,-.15),stroke:shd(pc,-.5),'stroke-width':.4,'stroke-opacity':.5},par)});
      return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- ninebark (Physocarpus opulifolius 'Diabolo', 'Dart's Gold'…): arching branches with peeling bark, alternate three-lobed leaves doubly toothed, palmately veined;
   side shoots ending in domed corymbs of small white flowers with pink stamens (June), then clusters of inflated red follicles ---------- */
const CW_PHY=[{id:'diabolo',n:'Pourpre noir (Diabolo)',c:'#3a1f2a',tip:'#6a2436',b:'#5a4048',st:'#3a2420'},{id:'red-baron',n:'Bordeaux (Red Baron)',c:'#5e1f2e',tip:'#8a2a36',b:'#6a4a4a',st:'#4a2a22'},
  {id:'lady-in-red',n:'Rouge cuivré (Lady in Red)',c:'#7a2a24',tip:'#b0402a',b:'#8a5a4a',st:'#4e2a20'},{id:'coppertina',n:'Cuivre (Coppertina)',c:'#b0683a',tip:'#c8702e',b:'#a08060',st:'#5a3a26'},
  {id:'amber',n:'Ambre (Amber Jubilee)',c:'#c88a30',tip:'#d8602a',b:'#b0a060',st:'#5e4228'},{id:'darts-gold',n:"Doré (Dart's Gold)",c:'#c9a830',tip:'#e2cc3c',old:'#9aa83a',b:'#c0c080',st:'#6a4a2c'},
  {id:'vert',n:'Vert (type)',c:'#5c7d3a',tip:'#7a9a40',b:'#8aa070',st:'#5a3e2a'},
  {id:'diabolo-fleuri',n:'Pourpre noir fleuri',c:'#40222c',tip:'#6a2436',b:'#5a4048',st:'#3a2420',fl:1,f:1},{id:'darts-gold-fleuri',n:'Doré fleuri',c:'#c2a438',tip:'#e2cc3c',old:'#9aa83a',b:'#c0c080',st:'#6a4a2c',fl:1,f:1},
  {id:'diabolo-fruits',n:'Pourpre noir en fruits rouges',c:'#46202c',tip:'#6a2436',b:'#5a4048',st:'#3a2420',fr:1,f:1}];
const PHY_LEAF=prof([[0,.5],[.1,.78],[.3,1],[.44,.6],[.56,.66],[.78,.42],[1,0]]),PHY_V=[[[0,0],[0,.97]],[[0,.02],[-.9,.33]],[[0,.02],[.9,.33]],[[0,.3],[-.55,.55]],[[0,.3],[.55,.55]]];
/* a corymb (flowers) or a cluster of follicles (fruits): a dome of pedicels from the tip, the florets as small 3D stars, drawn as one batch */
function phyCluster(og,Dm,op,fr,red){const H=og.H,n=LOD?9:DET>=1.5?22:15,c=V3.add(og.pos,V3.sc(H,Dm*.16)),fl=[],[X0,Y0]=fgCross(H);
  for(let j=0;j<n;j++){const a=j*2.4+R(-.3,.3),sp=Math.sqrt((j+.5)/n)*1.7,d=V3.nz(V3.add(H,V3.add(V3.sc(X0,Math.cos(a)*sp),V3.sc(Y0,Math.sin(a)*sp)))),p=V3.add(c,V3.sc(d,Dm*.3*R(.9,1.06)));fl.push({d,p,a})}
  fl.sort((a,b)=>a.p[2]-b.p[2]);const zz=fl.reduce((a,q)=>a+q.p[2],0)/n;
  return{z:zz,fn:par=>{let dp='',dpet='',dc='';const c0=fgQ(og.pos);
    for(const q of fl){const s=fgQ(q.p),m=fgQ(V3.add(og.pos,V3.sc(V3.add(q.d,H),Dm*.2)));dp+=`M${f(c0[0])},${f(c0[1])}Q${f(m[0])},${f(m[1])} ${f(s[0])},${f(s[1])}`;
      const[X,Y]=fgCross(q.d);if(fr){for(let i=0;i<3;i++){const a=i*2.09+q.a,dd=V3.nz(V3.add(q.d,V3.add(V3.sc(X,Math.cos(a)*.6),V3.sc(Y,Math.sin(a)*.6)))),[X2,Y2]=fgCross(dd),L=Dm*.12;
          dpet+=fgD(fgPoly(q.p,dd,X2,[[0,0],[L*.45,L*.22],[L,0],[L*.45,-L*.22]].map(([x,y])=>[x,y])))}}
      else if(op<.35){const r=Dm*.06;dpet+=fgD(fgPoly(q.p,X,Y,[0,1,2,3,4,5].map(i=>[Math.cos(i*1.047)*r,Math.sin(i*1.047)*r])))}
      else{const r=Dm*.1*Math.min(1,.45+.55*op),P5=[];for(let i=0;i<10;i++){const a=i*Math.PI/5+q.a,rr=i%2?r*.42:r;P5.push([Math.cos(a)*rr,Math.sin(a)*rr])}dpet+=fgD(fgPoly(q.p,X,Y,P5));
        dc+=fgD(fgPoly(V3.add(q.p,V3.sc(q.d,.4)),X,Y,[[-r*.25,0],[0,r*.25],[r*.25,0],[0,-r*.25]]))}}
    E('path',{d:dp,stroke:fr?'#6a2a24':'#5e4a3a','stroke-width':Math.max(.7,Dm*.01),fill:'none','stroke-linecap':'round'},par);
    E('path',{d:dpet,fill:fr?red:op<.35?'#f2e4e2':'#f8f4ec',stroke:fr?shd(red,-.5):'#b0a090','stroke-width':.35,'stroke-opacity':.6,'stroke-linejoin':'round'},par);if(dc)E('path',{d:dc,fill:'#d07a90'},par)}}}
function physoPlant(g,t,o){const cw=fgCw(CW_PHY,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):55*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.18,.3));
  const st=cw.st,cols=[shd(st,-.55),st,shd(st,.3),shd(st,.55)],infl=cw.fl||cw.fr;
  const r=fgGrow(k,A,{li:2.6*UPC*kl,liT:.35,w0:3.6*kl,w1:1.3,cols,uL:o.spine?.3:.14,phy:'spiral',la:52,face:.6,lift:.5,seg:11,
    side:{u0:.35,u1:.82,p:infl?.55:.32,len:.42,ang:38,li:.8,e:-.012},
    leaf:(og,p)=>{const u=p.o?Math.min(1,p.u+.15):p.u,sz=fgSz(p,.78)*(p.o?.82:.75+.25*Math.sin(Math.PI*Math.min(.92,.25+u*.8)))*kl,young=u>.85?1-op:0,L=cm0*UPC*sz*R(.9,1.08),
        c=u>.7&&cw.tip?mix(cw.c,cw.tip,(u-.7)/.3):cw.old&&u<.5?mix(cw.c,cw.old,(.5-u)*1.4):cw.c,pl=L*.32,base=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.12,0]));
      return fgBlade(Object.assign({},og,{pos:base}),L,.92,mix(c,shd(c,R(-.15,.15)),.5),cw.b,{wp:PHY_LEAF,droop:.16,arch:.06,fold:.16+.4*young,tw:R(-.3,.3),tz:.06,nv:22,veins:PHY_V,sharp:1,pet:{p0:og.pos,w:Math.max(.8,1.1*kl),c:shd(st,.1)}})},
    tip:(og,p)=>{if(!infl)return null;return phyCluster(og,5*UPC*kl*(p.o?1:1.15),op,!!cw.fr,'#b8302a')}});
  open(k,t,1000,0,.4);return r}

/* ---------- Alexandrian laurel (Danae racemosa, « ruscus italien »): long supple arching stems, alternate lanceolate cladodes (flattened shoots, not leaves) twisted into one plane,
   glossy on both faces, sessile and acuminate; secondary shoots from the middle nodes. Stages: the young tip still closed, then spread ---------- */
const CW_DAN=[{id:'vert-franc',n:'Vert franc',c:'#4f8a3a'},{id:'vert-profond',n:'Vert profond',c:'#3a7432'},{id:'vert-tendre',n:'Vert tendre (jeunes pousses)',c:'#7aa54f'}];
const DAN_LEAF=prof([[0,.1],[.1,.55],[.32,1],[.6,.84],[.84,.38],[1,0]]);
function danaePlant(g,t,o){const cw=fgCw(CW_DAN,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):75*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.48,.62));
  const sc=mix(cw.c,'#8ab05a',.45),cols=[shd(sc,-.6),shd(sc,-.25),sc,shd(sc,.45)];
  const r=fgGrow(k,A,{li:2.7*UPC*kl,liT:.5,w0:3*kl,w1:1,cols,uL:o.spine?.32:.18,phy:'alt2',la:46,face:.62,lift:.2,seg:12,wig:.03,rj:30,
    side:{u0:.3,u1:.72,p:.42,len:.5,ang:42,li:.75,e:-.01,tilt:28},
    leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.78?(1-op)*(u-.78)/.22:0,sz=fgSz(p,.74)*(p.o?.8:1)*kl*(1-.5*young),L=cm0*UPC*sz*R(.88,1.1),c=mix(cw.c,shd(cw.c,R(-.12,.15)),.6);
      return fgBlade(og,L,.27,c,mix(c,'#9ac070',.12),{wp:DAN_LEAF,droop:.1+.06*u,arch:.06,fold:.1+.5*young,tw:R(-.45,.45),gloss:.9,dI:.03})}});
  open(k,t,1000,0,.4);return r}

/* ---------- rose-scented geranium (Pelargonium graveolens and its hybrids): stiff hairy stems, alternate leaves on long petioles, the blade deeply cut into five to seven
   lobes, each lobe cut again, soft and velvety (pale haze on the margin); 'Lady Plymouth' edged with cream, 'Chocolate Peppermint' blotched; small umbels of pink flowers,
   the two upper petals larger and veined with purple ---------- */
const CW_PEL=[{id:'graveolens',n:'Vert tendre (rosat)',c:'#7fa35a'},{id:'citronnelle',n:'Vert acide (Mabel Grey)',c:'#93a848'},{id:'lady-plymouth',n:'Panaché crème (Lady Plymouth)',c:'#c4c69a',g:'#7a9a58',v:'#eee8c8'},
  {id:'chocolat',n:'Vert sombre maculé (Chocolate Peppermint)',c:'#5d6236',g:'#5d7236',bl:'#4a3424'},{id:'graveolens-fleuri',n:'Vert tendre fleuri rose',c:'#86a85e',fl:1,f:1}];
/* the cut outline in the leaf's plane (x across, y along the petiole's line, in leaf lengths): five main lobes, each pinnately cut, a cordate basal sinus */
function pelOutline(){const out=[[0,0]],A=[-102,-52,0,52,102],Lk=[.5,.78,1,.78,.5];
  for(let j=0;j<5;j++){const a=(A[j]+R(-6,6))*D,dx=Math.sin(a),dy=Math.cos(a),px=dy,py=-dx,L=Lk[j]*R(.92,1.06),rs=.34,w=.2*(.75+.25*Lk[j]),sd=[],sg=[];
    for(let i=0;i<=6;i++){const t=i/6,r=rs+(L-rs)*t,hw=w*(1-t*.8)*(i%2?.7:1.18)*(i===0?.85:1),cx=dx*r,cy=dy*r;sd.push([cx+px*hw,cy+py*hw]);sg.push([cx-px*hw,cy-py*hw])}
    if(j)out.push([Math.sin((A[j]-26)*D)*.27,Math.cos((A[j]-26)*D)*.27]);out.push(...sg,[dx*(L+.03),dy*(L+.03)],...sd.reverse())}
  out.push([0,0]);return out}
function pelLeaf(og,len,cw,parts){const H=og.H,Lv=og.L,U=og.U,cup=R(.1,.18),pts3=o=>o.map(([x,y])=>V3.add(og.pos,V3.add(V3.add(V3.sc(H,y*len),V3.sc(Lv,x*len)),V3.add(V3.sc(U,cup*len*(x*x+(y-.35)**2)),[0,-.12*len*y*y,0])))),
  ol=pelOutline(),P3=pts3(ol),nr=V3.nz(V3.add(U,V3.sc(H,.15))),fr=nr[2]>=0,base=cw.g||cw.c,P=pal7(base),PB=pal7(mix(base,'#c8d0b0',.4)),I=lightI(fr?nr:V3.sc(nr,-1)),col=toneAt(fr?P:PB,I);
  const z=P3.reduce((a,p)=>a+p[2],0)/P3.length,sc=(s,cx=0,cy=.3)=>pts3(ol.map(([x,y])=>[cx+(x-cx)*s,cy+(y-cy)*s]));
  parts.push({z,fn:par=>{const d=smooth(P3.map(fgQ));
    if(cw.v&&fr){E('path',{d,fill:toneAt(pal7(cw.v),I),stroke:shd(cw.v,-.4),'stroke-width':.4,'stroke-opacity':.4},par);E('path',{d:smooth(sc(.7+R(-.04,.04)).map(fgQ)),fill:col},par)}
    else E('path',{d,fill:cw.v&&!fr?toneAt(pal7(mix(cw.v,base,.5)),I):col,stroke:P.l2,'stroke-width':DET>=1.5?.7:.8,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
    if(cw.bl&&fr&&!LOD)E('path',{d:smooth(sc(.42,0,.12).map(fgQ)),fill:cw.bl,opacity:.72},par);
    if(!LOD){let dv='';const o0=fgQ(P3[0]);for(const a of[-102,-52,0,52,102]){const L=a===0?.95:Math.abs(a)>90?.45:.72,q=fgQ(pts3([[Math.sin(a*D)*L,Math.cos(a*D)*L]])[0]);dv+=`M${f(o0[0])},${f(o0[1])}L${f(q[0])},${f(q[1])}`}
      E('path',{d:dv,stroke:fr?P.l1:PB.d1,'stroke-width':DET>=1.5?.5:.6,'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},par)}}});return P3[0]}
/* a pseudo-umbel: a long peduncle, five to nine flowers on pedicels; each flower two broad upper petals veined with purple, three narrow lower ones */
function pelUmbel(og,Dm,op,parts){const H=og.H,pd=Dm*2.2,c=V3.add(V3.add(og.pos,V3.sc(H,pd)),[0,pd*.08,0]),n=LOD?5:DET>=1.5?8:6,fl=[],[X0,Y0]=fgCross(H);
  for(let j=0;j<n;j++){const a=j*2.39+R(-.3,.3),sp=.75+R(-.1,.15),d=V3.nz(V3.add(H,V3.add(V3.sc(X0,Math.cos(a)*sp),V3.sc(Y0,Math.sin(a)*sp)))),p=V3.add(c,V3.sc(d,Dm*.6*R(.8,1.1))),age=Math.min(1,op*1.4-j*.08);fl.push({d,p,age})}
  fl.sort((a,b)=>a.p[2]-b.p[2]);
  parts.push({z:c[2]+1,fn:par=>{const p0=fgQ(og.pos),c0=fgQ(c);let dp=`M${f(p0[0])},${f(p0[1])}L${f(c0[0])},${f(c0[1])}`,du='',dl='',dv='',db='';
    for(const q of fl){const s=fgQ(q.p);dp+=`M${f(c0[0])},${f(c0[1])}L${f(s[0])},${f(s[1])}`;const up=V3.nz(V3s([0,1,0],V3.sc(q.d,q.d[1]))),Xf=V3.cr(up,q.d);
      if(q.age<.35){const r=Dm*.16;db+=fgD(fgPoly(q.p,q.d,Xf,[[0,-r*.35],[r*.9,-r*.2],[r*1.3,0],[r*.9,r*.2],[0,r*.35]]));continue}
      const r=Dm*.5*Math.min(1,.5+.5*q.age),pet=(a,L,W)=>{const ca=Math.cos(a),sa=Math.sin(a),pt=([x,y])=>[x*ca-y*sa,x*sa+y*ca];return fgD(fgPoly(q.p,Xf,up,[[0,0],[L*.45,-W],[L*.95,-W*.6],[L,0],[L*.95,W*.6],[L*.45,W]].map(pt)))};
      for(const a of[60,120])du+=pet(a*D,r,r*.38);for(const a of[230,270,310])dl+=pet(a*D,r*.8,r*.2);
      if(!LOD)for(const a of[60,120]){const ca=Math.cos(a*D),sa=Math.sin(a*D);for(const o of[-.12,0,.12]){const P=fgPoly(q.p,Xf,up,[[r*.15*ca-o*r*sa,r*.15*sa+o*r*ca],[r*.62*ca-o*r*sa*1.3,r*.62*sa+o*r*ca*1.3]]);dv+=`M${f(P[0][0])},${f(P[0][1])}L${f(P[1][0])},${f(P[1][1])}`}}}
    E('path',{d:dp,stroke:'#5f7a3a','stroke-width':Math.max(.9,Dm*.05),fill:'none','stroke-linecap':'round'},par);if(db)E('path',{d:db,fill:'#d89aa8',stroke:'#8a5a4a','stroke-width':.3,'stroke-opacity':.5},par);
    if(dl)E('path',{d:dl,fill:'#eab0c8',stroke:'#b07090','stroke-width':.3,'stroke-opacity':.5},par);if(du)E('path',{d:du,fill:'#e49ab8',stroke:'#a05a80','stroke-width':.3,'stroke-opacity':.5},par);if(dv)E('path',{d:dv,stroke:'#7a1e52','stroke-width':.45,'stroke-opacity':.8,fill:'none'},par)}})}
function pelPlant(g,t,o){const cw=fgCw(CW_PEL,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):35*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.16));
  const sc='#6f8c48',cols=[shd(sc,-.55),shd(sc,-.2),sc,shd(sc,.45)];
  const r=fgGrow(k,A,{li:1.9*UPC*kl,liT:.35,w0:4.6*kl,w1:2.2,cols,uL:o.spine?.36:.22,phy:'spiral',la:56,face:.55,lift:.6,seg:10,
    side:{u0:.4,u1:.75,p:.22,len:.4,ang:34,li:.8,e:.006},axil:cw.fl?{u0:.45,p:.5,ang:24}:null,
    leaf:(og,p)=>{const u=p.o?Math.min(1,p.u+.15):p.u,sz=fgSz(p,.82)*(p.o?.8:1)*kl*(u>.85?.6+.4*op:1),L=cm0*UPC*sz*R(.88,1.06),pl=L*R(.45,.7),parts=[];
      const og2=Object.assign({},og,{pos:V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.1,0]))}),p1=pelLeaf(og2,L,cw,parts),p0=fgQ(og.pos),q1=fgQ(p1),m=[(p0[0]+q1[0])/2,(p0[1]+q1[1])/2+pl*.06];
      parts.push({z:(og.pos[2]+p1[2])/2-.2,fn:par=>E('path',{d:`M${f(p0[0])},${f(p0[1])}Q${f(m[0])},${f(m[1])} ${f(q1[0])},${f(q1[1])}`,stroke:cols[1],'stroke-width':f(Math.max(.9,1.5*kl)),fill:'none','stroke-linecap':'round'},par)});return parts},
    axDraw:(og)=>{const parts=[];pelUmbel(og,1.7*UPC*kl,op,parts);return parts},
    tip:(og)=>{if(!cw.fl)return null;const parts=[];pelUmbel(og,1.7*UPC*kl,op,parts);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- winged spindle (Euonymus alatus): stiff twigs with two to four broad corky wings, brown; opposite elliptic leaves finely toothed, green in summer and carmine,
   scarlet or pink in autumn; capsules of one to four purplish-red lobes splitting to show seeds in orange arils ---------- */
const CW_FUS=[{id:'carmin',n:'Rouge carmin (automne)',c:'#b0202a',alt:'#d0402a'},{id:'ecarlate',n:'Écarlate',c:'#d0405a',alt:'#e06040'},{id:'rose',n:'Rose fuchsia (automne)',c:'#e07684',alt:'#c84a6a'},
  {id:'corail',n:'Corail orangé (début d’automne)',c:'#e07a5a',alt:'#c8a040'},{id:'vieux-rose',n:'Vieux rose',c:'#c86a8a',alt:'#a8405a'},{id:'vert',n:'Vert (été)',c:'#4f7a3a',alt:'#6a8a3a'},
  {id:'capsules',n:'Rameaux à capsules orangées',c:'#c8402e',alt:'#a02a3a',fr:1,f:1}];
const FUS_LEAF=prof([[0,.18],[.15,.68],[.45,1],[.74,.74],[.92,.26],[1,0]]);
function fusCyme(og,Dm,op,parts){const H=og.H,pd=Dm*2.2,c=V3.add(V3.add(og.pos,V3.sc(H,pd)),[0,-pd*.35,0]),n=rnd()<.35?1:rnd()<.6?2:3,cs=[],[X0]=fgCross(H);
  for(let j=0;j<n;j++){const p=n===1?c:V3.add(c,V3.add(V3.sc(X0,(j-(n-1)/2)*Dm*1.3),[0,-Dm*.6*(j%2),0]));cs.push({p,d:V3.nz(V3.add(V3s(p,og.pos),[0,-Dm,0]))})}
  parts.push({z:c[2]+.5,fn:par=>{const p0=fgQ(og.pos),c0=fgQ(V3.add(og.pos,V3.sc(H,pd*.6)));let dp='',dc='',da='';
    for(const q of cs){const s=fgQ(q.p);dp+=`M${f(p0[0])},${f(p0[1])}Q${f(c0[0])},${f(c0[1])} ${f(s[0])},${f(s[1])}`;const[X,Y]=fgCross(q.d),r=Dm*.55,sp=op>.5?Math.min(1,(op-.5)*2.2):0,nl=4;
      for(let i=0;i<nl;i++){const a=i/nl*6.283+.4,dd=V3.nz(V3.add(V3.sc(q.d,.6),V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))))),[X2]=fgCross(dd),ct=V3.add(q.p,V3.sc(dd,r*(.5+.5*sp)));
        dc+=fgD(fgPoly(ct,dd,X2,[[-r*.55,0],[0,r*(.45-.15*sp)],[r*.6,0],[0,-r*(.45-.15*sp)]]));if(sp>0){const ar=V3.add(q.p,V3.add(V3.sc(dd,r*.25),V3.sc(q.d,r*.55)));da+=fgD(fgPoly(ar,X,Y,[0,1,2,3,4,5].map(i=>[Math.cos(i*1.05)*r*.3*sp,Math.sin(i*1.05)*r*.3*sp])))}}}
    E('path',{d:dp,stroke:'#6a5034','stroke-width':Math.max(.8,Dm*.07),fill:'none','stroke-linecap':'round'},par);E('path',{d:dc,fill:'#b8304a',stroke:'#5a1428','stroke-width':.4,'stroke-opacity':.6},par);
    if(da)E('path',{d:da,fill:'#f07a1a',stroke:'#a84a10','stroke-width':.35,'stroke-opacity':.6},par)}})}
/* the corky wings: thin flanges along the twig at ±45° from the plane of the spray, each a ribbon lit by its own face */
function fusWings(res,parts,Fr,ww){const P=pal7('#9a7650');for(const ch of res.chains){if(ch.ord>1||ch.pts.length<3)continue;const n=ch.pts.length,w0=ww*(ch.ord?.55:1);
    for(const sg of ch.ord&&DET<1.5?[[1,1],[-1,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1]]){const inner=[],outer=[];let z=0,nr=[0,0,0];
      for(let i=0;i<n;i++){const a=ch.pts[Math.max(0,i-1)],b=ch.pts[Math.min(n-1,i+1)],T=V3.nz(V3s(b,a)),F=V3.nz(V3s(Fr,V3.sc(T,V3.dot(Fr,T)))),S=V3.cr(T,F),W=V3.nz(V3.add(V3.sc(F,sg[0]),V3.sc(S,sg[1]))),
          t=i/(n-1),w=w0*Math.min(1,t*5)*(1-t*.7)*(i%2?.78:1),p=ch.pts[i],q=V3.add(p,V3.sc(W,w+ch.ws[i]*.5));inner.push(fgQ(p));outer.push(fgQ(q));z+=q[2];const nn=V3.cr(T,W);for(let j=0;j<3;j++)nr[j]+=nn[j]}
      nr=V3.nz(nr);const col=toneAt(P,lightI(nr[2]>=0?nr:V3.sc(nr,-1))),pts=inner.concat(outer.reverse());parts.push({z:z/n,fn:par=>E('path',{d:fgD(pts),fill:col,stroke:P.ink,'stroke-width':.45,'stroke-opacity':.6,'stroke-linejoin':'round'},par)})}}}
function fusPlant(g,t,o){const cw=fgCw(CW_FUS,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):55*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14));
  const sc='#5a5236',cols=[shd(sc,-.55),shd(sc,-.2),sc,shd(sc,.4)],fr=!!cw.fr;
  const r=fgGrow(k,A,{li:3*UPC*kl,liT:.3,w0:2.8*kl,w1:1.1,cols,uL:o.spine?.3:.14,phy:'opp',la:50,lp:fr?.45:1,face:.7,lift:.3,seg:11,wig:.03,piece:DET>=1.5?9:14,
    side:{u0:.28,u1:.8,p:.42,len:.42,ang:52,li:.8,e:-.004,pair:1},axil:fr?{u0:.25,p:.85,ang:40}:null,
    leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=fgSz(p,.78)*(p.o?.85:1)*kl*(u>.85?.6+.4*op:1),L=cm0*UPC*sz*R(.88,1.1),c=mix(cw.c,cw.alt,R(0,.45)),pl=L*.06;
      return fgBlade(Object.assign({},og,{pos:V3.add(og.pos,V3.sc(og.H,pl))}),L,.44,mix(c,shd(c,R(-.12,.12)),.5),mix(c,'#d8b0a0',.3),{wp:FUS_LEAF,droop:.16,arch:.06,fold:.14,tw:R(-.35,.35),tz:.035,nv:20,
        veins:[[[0,0],[0,.96]],...[.25,.45,.65].flatMap(v=>[[[0,v],[-.85,v+.16]],[[0,v],[.85,v+.16]]])],pet:DET>=1.5?{p0:og.pos,w:1,c:cols[1]}:null})},
    axDraw:(og)=>{const parts=[];fusCyme(og,1.25*UPC*kl,op,parts);return parts},
    post:(res,parts,Fr)=>fusWings(res,parts,Fr,.8*UPC*kl)});
  open(k,t,1000,0,.4);return r}

/* ---------- registers ---------- */
Object.assign(GH,{'sun-palm-seche':sunPalm,'physocarpus-opulifolius':physoPlant,'danae-racemosa-ruscus-italien':danaePlant,'pelargonium-geranium-odorant':pelPlant,'fusain-aile':fusPlant});
Object.assign(CWS,{'sun-palm-seche':CW_SUN,'physocarpus-opulifolius':CW_PHY,'danae-racemosa-ruscus-italien':CW_DAN,'pelargonium-geranium-odorant':CW_PEL,'fusain-aile':CW_FUS});
/* commercial grades, in the recipe's unit (the fan's diameter; for the leafy stems the leaf length of a stem of 50, 60, 70, 80 cm) */
Object.assign(SZG,{'sun-palm-seche':[22,30,38,45],'physocarpus-opulifolius':[5,6,7,8],'danae-racemosa-ruscus-italien':[6,7,8,9],'pelargonium-geranium-odorant':[6,7,8],'fusain-aile':[4,5,6,7]});
