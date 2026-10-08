/* ================= Serre, lot 11 — Renoncules, grandies par le L-système : classique, Cloni, Pon-Pon, Butterfly, Natura ================= */
/* colourways: c petals, c2 toward the heart, edge a picotee, eye the heart (green in the Pon-Pon, dark in the Butterfly) */
const CW_RCLA=[{id:'blanc',n:'Blanc',c:'#f7f3ea',c2:'#eef0d8'},{id:'creme',n:'Crème',c:'#f4ead0',c2:'#ece0b0'},{id:'rose-pale',n:'Rose pâle',c:'#f3c4cc',c2:'#f8dde0'},{id:'rose',n:'Rose',c:'#ec8fb0'},
  {id:'fuchsia',n:'Fuchsia',c:'#e2457b'},{id:'rouge',n:'Rouge',c:'#c41e2e',c2:'#9a1020'},{id:'bordeaux',n:'Bordeaux',c:'#6a1426',c2:'#4a0a1a'},{id:'orange',n:'Orange',c:'#f07a2a',c2:'#e8601e'},
  {id:'orange-brule',n:'Orange brûlé',c:'#e04a20',c2:'#c8381a'},{id:'jaune',n:'Jaune',c:'#f5d02e',c2:'#e8b820'},{id:'abricot',n:'Abricot',c:'#f4b090',c2:'#f8c8a8'},{id:'peche',n:'Pêche',c:'#f6c4a6'},
  {id:'prune',n:'Prune',c:'#7a2a6a'},{id:'lilas',n:'Lilas',c:'#c8a8d8'},{id:'picotee',n:'Blanc liseré de rose',c:'#f6eef0',edge:'#e05a8a'},{id:'bicolore',n:'Jaune bordé de rouge',c:'#f5d02e',edge:'#d8302a'}];
const CW_RCLO=[{id:'hanoi',n:'Rose blush (Hanoi)',c:'#efc4c8',c2:'#f4e2d8'},{id:'blanc',n:'Blanc',c:'#f7f3ea',c2:'#eef0d8'},{id:'peche',n:'Pêche',c:'#f6c4a6',c2:'#f8dcc8'},{id:'abricot',n:'Abricot',c:'#f2a46e'},
  {id:'corail',n:'Corail',c:'#f2765e'},{id:'fuchsia',n:'Fuchsia',c:'#d81f7a'},{id:'rose',n:'Rose',c:'#ee98b6',c2:'#f6c8d6'},{id:'jaune-pale',n:'Jaune pâle',c:'#f4e2a0'},{id:'rouge',n:'Rouge',c:'#c41e2e'},{id:'picotee',n:'Picotée rose',c:'#f6eaee',edge:'#e05a8a'}];
const CW_RPON=[{id:'blanc',n:'Blanc à cœur vert',c:'#f7f3ea',eye:'#a9c35a'},{id:'rose-pale',n:'Rose pâle à cœur vert',c:'#f2c4d0',eye:'#a9c35a'},{id:'rose',n:'Rose à cœur vert',c:'#e98fb0',eye:'#9ab84a'},
  {id:'lilas',n:'Lilas à cœur vert',c:'#b48ab8',eye:'#9ab84a'},{id:'prune',n:'Prune à cœur vert',c:'#7a2a6a',eye:'#8aa848'},{id:'jaune',n:'Jaune à cœur vert',c:'#f2b33a',eye:'#9ab84a'},{id:'corail',n:'Corail à cœur vert',c:'#f28a6e',eye:'#a9c35a'}];
const CW_RBUT=[{id:'rose',n:'Rose (Hermione)',c:'#f3c4cc',eye:'#2e4a20'},{id:'creme',n:'Crème (Ariadne)',c:'#f7eedb',eye:'#3a5a28'},{id:'rose-vif',n:'Rose vif',c:'#e98fa8',eye:'#2e4a20'},{id:'orange',n:'Orange (Apollon)',c:'#f2a06a',eye:'#2e4a20'},
  {id:'jaune',n:'Jaune (Ataraxie)',c:'#f2e04a',eye:'#3a5a28'},{id:'pourpre',n:'Pourpre (Kalya)',c:'#7a2a6a',eye:'#1e2a14'},{id:'lilas',n:'Lilas',c:'#c8a8dc',eye:'#2e4a20'},{id:'corail',n:'Corail',c:'#f08a7a',eye:'#2e4a20'},{id:'blanc',n:'Blanc',c:'#f8f6f0',eye:'#3a5a28'}];
const CW_RNAT=[{id:'blanc',n:'Blanc',c:'#f6efe0',eye:'#c8b030'},{id:'jaune',n:'Jaune',c:'#f5cf3a',eye:'#8a7a20'},{id:'orange',n:'Orange',c:'#f08a3a',eye:'#6a4a18'},{id:'peche',n:'Pêche',c:'#f4c09a',eye:'#8a6a30'},
  {id:'fuchsia',n:'Fuchsia',c:'#e0457b',eye:'#4a2a2a'},{id:'prune',n:'Prune',c:'#5a1a4a',eye:'#2a1a20'},{id:'rose',n:'Rose',c:'#f2a8c0',eye:'#5a4a2a'}];
const RAN_P=prof([[0,.45],[.3,.9],[.65,1],[1,.78]]);
/* the double ranunculus: dozens of thin cupped petals in a spiral on a domed receptacle, upright and tight at the heart (green in the Pon-Pon), opening outward; the sepals behind */
function ranFlower(par,B,O,D,cw,op,kd){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.15)/.85),pon=kd==='pon',N=Math.round((kd==='clo'?64:52)*(DET>=1.5?1.25:1)*(LOD?.6:1)),items=[],rot=R(0,6.28);
  if(nz<.45)capBracts(k,B,O,R0*.42,5,'#5f8a40',{len:.42,w:.2,a0:2.3,a1:2.75});
  for(let i=0;i<N;i++){const f=(i+.5)/N,fo=Math.pow(f,.85),ph=i*2.39996+rot,heart=pon&&f<.2,a0=.06+1.05*fo*(.35+.65*o2)+(heart?0:.04),a1=a0+.2+.45*fo*o2,
      L=R0*(heart?.2:.24+.66*Math.pow(f,.75))*(.72+.28*o2),W=R0*(heart?.12:.17+.2*f),l=ligule(B,O,{phi:ph,r0:R0*(.03+.13*f),z0:R0*.2*(1-f)*(.5+.5*o2),L,W,wp:RAN_P,a0,a1,pw:1.2,th:heart?2:.9+.6*(1-f),tip:'round',wav:.06,n:5,tw:R(-.15,.15)});
    let c=cw.c;if(cw.c2)c=mix(cw.c2,cw.c,sm01(f/.7));if(heart)c=mix(cw.eye,cw.c,f*2.5);items.push({l,c:mix(c,shd(c,R(-.1,.06)),.5),edge:cw.edge&&f>.35?cw.edge:null,ew:4,ewd:Math.max(.6,R0*.04),noov:f<.25})}
  drawLig(k,items);if(!pon&&!LOD&&nz>.3&&o2<.6){const e=PJ(B,O,[0,0,R0*.24]),r=R0*.08;E('path',{d:`M${f(e[0]-r)},${f(e[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`,fill:mix(cw.c,'#9ab84a',.35),opacity:.8},k)}return k}
/* single or semi-double (Butterfly, Natura): five to eight lacquered petals, a second ring in the Natura, the dark heart and its stamens */
function ranSingle(par,B,O,D,cw,op,dbl){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=R(0,6.28),cache={},pet=[];if(nz<.45)capBracts(k,B,O,R0*.35,5,'#5f8a40',{len:.4,w:.18});
  for(let w=0;w<(dbl?2:1);w++){const n=w?6:Math.round(R(5,8));for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+(w?.4:0)+R(-.12,.12),r0:R0*.12,z0:w?R0*.04:0,L:R0*(w?.62:.84)*R(.92,1.05),W:R0*(w?.32:.42),wp:prof([[0,.4],[.3,.92],[.65,1],[1,.7]]),a0:.45+.8*o2-(w?.2:0),a1:.7+.8*o2-(w?.25:0),pw:1.3,th:.5,tip:'round',wav:.08,n:6,tw:R(-.2,.2)});pet.push(l);
    it.push({l,c:cw.c,cb:mix(cw.c,'#e8e4d8',.2),lift:.32})}}
  spPetals(k,it,cache);if(LOD)return k;
  /* the lacquer: a crisp highlight on each petal facing the light */
  let dg='';for(const l of pet){if(l.nm[2]<.2||V3.dot(l.nm,LIGHT)<.35)continue;const m=l.S[Math.round(l.S.length*.55)][1],m2=l.S[Math.round(l.S.length*.35)][1];dg+=`M${f(m2[0])},${f(m2[1])}L${f(m[0])},${f(m[1])}`}
  if(dg)E('path',{d:dg,stroke:'#ffffff','stroke-width':f(Math.max(.6,R0*.05)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);
  if(nz>-.15){let d='';const ns=DET>=1.5?30:16,rr=Math.max(.4,R0*.035);for(let i=0;i<ns;i++){const a=i*2.39996+rot,q=.18+.1*((i*.618)%1),p=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*.08]);d+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
    E('path',{d,fill:dbl?'#e8c838':'#c8b048',opacity:.9},k);capDisc(k,B,O,R0*.15,R0*.12,cw.eye,{dots:DET>=1.5?16:0})}
  return k}
/* the plants: a hollow stem, a deeply cut three-lobed leaf at a node, a side bud often (standard types); the sprays branch again and again, buds and young flowers on every shoot */
const RAN_SC=['#3a5a2a','#5f8a3e','#86ac64','#b8d494'],ranLeaf=(D,col)=>(og,pos)=>lsLeaf2D(og,pos,D*R(.6,.8),(par,x,y,a,l)=>palmLeaf(par,x,y,a,l,col,{lobes:3,spread:110,wl:.24,pet:.22,tilt:R(.3,.6)}));
function ranPlant(g,t,o,list,kd){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),spray=kd==='but'||kd==='nat',Dh=(o.cm||(spray?25:6))*UPC,D=spray?Dh*.2:Dh,k=G(g);
  const S=spray?{nodes:3,li:1.1,lp:1.3,opp:0,leafAng:45,side:{p:.92,n:1,top:3,len:1.5,ang:32,age:[0,.9]},budD:.3,budMax:.35,wig:.05,e:.05}:{nodes:1,li:.8,lp:1.15,opp:0,leafAng:45,side:{p:.45,n:1,top:1,len:.9,ang:30,age:[0,.35]},budD:.42,wig:.04,e:.03};
  const fl=(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*(spray?.3:.42),cw.c,.7,'#5f8a40');return}if(spray)ranSingle(par,B,O,D2,cw,op2,kd==='nat');else ranFlower(par,B,O,D2,cw,op2,kd)};
  const r=lsHeadS(k,o,Object.assign({D,w:D*(spray?.05:.075),cols:RAN_SC,op,rr:.5,flower:fl,bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a,'#5f8a40'),young:(par,B,O,s,a)=>fl(par,B,O,s,.45+.55*a),leaf:ranLeaf(D,'#4a7a34')},S));
  open(k,t,1000,10,.3);return r}
Object.assign(GH,{'renoncule-classique':(g,t,o)=>ranPlant(g,t,o,CW_RCLA,'cla'),'renoncule-cloni':(g,t,o)=>ranPlant(g,t,o,CW_RCLO,'clo'),'renoncule-pon-pon':(g,t,o)=>ranPlant(g,t,o,CW_RPON,'pon'),
  'renoncule-butterfly':(g,t,o)=>ranPlant(g,t,o,CW_RBUT,'but'),'renoncule-natura-moderna':(g,t,o)=>ranPlant(g,t,o,CW_RNAT,'nat')});
Object.assign(CWS,{'renoncule-classique':CW_RCLA,'renoncule-cloni':CW_RCLO,'renoncule-pon-pon':CW_RPON,'renoncule-butterfly':CW_RBUT,'renoncule-natura-moderna':CW_RNAT});
Object.assign(SZG,{'renoncule-classique':[5,5.5,6,6,6.5,7],'renoncule-cloni':[8,9,10,10,11],'renoncule-pon-pon':[5,6,6,7],'renoncule-butterfly':[20,24,25,28],'renoncule-natura-moderna':[20,24,25,28]});
Object.assign(GHI,{'renoncule-classique':{form:'rosette',size:2,k:'head',rk:1},'renoncule-cloni':{form:'rosette',size:2.5,k:'head',rk:1},'renoncule-pon-pon':{form:'rosette',size:2,k:'head',rk:1},
  'renoncule-butterfly':{form:'disque',size:2.5,k:'head',rk:.55},'renoncule-natura-moderna':{form:'disque',size:2.5,k:'head',rk:.55}});
for(const id of['renoncule-classique','renoncule-cloni','renoncule-pon-pon','renoncule-butterfly','renoncule-natura-moderna'])GH_BUDS.add(id);
