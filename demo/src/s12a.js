/* ================= Serre, lot 12 — Pivoines, grandies par le L-système : herbacée double, herbacée simple, arbustive, corail, Itoh ================= */
/* colourways: c the guard petals, c2 the heart (petaloids, or the cream boss of a 'Bowl of Beauty'), fl a dark flare at the base of the petals, st the stamens */
const CW_PDBL=[{id:'rose',n:'Rose (Sarah Bernhardt)',c:'#f0a6c0',c2:'#f4bccc'},{id:'blanc',n:'Blanc (Duchesse de Nemours)',c:'#f7f1e6',c2:'#f2e8c8'},{id:'blush',n:'Blush (Shirley Temple)',c:'#f6cfd6',c2:'#f8e2e0'},
  {id:'rouge',n:'Rouge (Red Charm)',c:'#c81f4c',c2:'#b01840'},{id:'fuchsia',n:'Fuchsia (Karl Rosenfield)',c:'#d2357e',c2:'#c42a70'},{id:'cerise',n:'Cerise (Kansas)',c:'#d8305a'},{id:'bordeaux',n:'Bordeaux',c:'#7a0f2a',c2:'#5a0a1e'},
  {id:'vieux-rose',n:'Vieux rose',c:'#e8bccb',c2:'#f0d0d8'},{id:'lilas',n:'Rose lilas',c:'#cfa0c6',c2:'#dcb4d2'},{id:'framboise',n:'Framboise',c:'#d878a8'},{id:'noir',n:'Pourpre noir',c:'#5a1a24',c2:'#40101a'}];
const CW_PSIM=[{id:'rose',n:'Rose',c:'#ec8fb4'},{id:'blanc',n:'Blanc',c:'#f7f3ea'},{id:'magenta',n:'Magenta',c:'#e0457b'},{id:'rouge',n:'Rouge',c:'#d6212f'},{id:'corail',n:'Corail',c:'#f2836a'},
  {id:'creme',n:'Crème',c:'#f1dcc0'},{id:'bowl',n:'Rose à cœur crème (Bowl of Beauty)',c:'#e88aae',c2:'#f4e2b0',jap:1},{id:'rouge-jap',n:'Rouge à cœur doré (japonaise)',c:'#c8203a',c2:'#f0c040',jap:1}];
const CW_PARB=[{id:'rose',n:'Rose',c:'#e9a4c0',fl:'#7a1a4a'},{id:'blanc',n:'Blanc à macule pourpre',c:'#f7f3ec',fl:'#6a1a4a'},{id:'rouge',n:'Rouge',c:'#c8203a',fl:'#4a0a18'},{id:'pourpre',n:'Pourpre',c:'#7a2a6e',fl:'#3a0a2a'},
  {id:'jaune',n:'Jaune',c:'#f5d23e',fl:'#a8302a'},{id:'saumon',n:'Saumon',c:'#f2a08a',fl:'#a83a3a'},{id:'lavande',n:'Lavande',c:'#c8a8d8',fl:'#5a2a6a'}];
const CW_PCOR=[{id:'corail-vif',n:'Corail vif',c:'#f2715a'},{id:'corail',n:'Corail',c:'#f49a82'},{id:'saumon',n:'Saumon',c:'#f4b3a0'},{id:'peche',n:'Pêche',c:'#f6c49e'},{id:'abricot',n:'Abricot',c:'#f3a46a'},{id:'creme',n:'Crème (fanée)',c:'#f4ebd8'}];
const CW_PITO=[{id:'jaune',n:'Jaune (Bartzella)',c:'#f2d73a',fl:'#d0402a'},{id:'blanc',n:'Blanc à macule (Cora Louise)',c:'#f3ead8',fl:'#8a2a5a'},{id:'orange',n:'Orange cuivré',c:'#f2a35e',fl:'#c8402a'},
  {id:'magenta',n:'Magenta',c:'#c63c7e',fl:'#6a1030'},{id:'lilas',n:'Lilas rosé',c:'#d9a3c4',fl:'#7a2a5a'},{id:'rouge',n:'Rouge',c:'#c0272e',fl:'#5a0a14'}];
const PEO_G=prof([[0,.38],[.3,.88],[.65,1],[1,.8]]);
/* the stamen boss: hundreds of golden filaments in a ring round the carpels, anthers catching the light */
function peoBoss(k,B,O,R0,cw,o={}){if(LOD)return;const rot=R(0,6.28),n=DET>=1.5?70:38;let fd='',ad='';const st=cw.st||'#e8b52a',rr=Math.max(.45,R0*.03);
  for(let i=0;i<n;i++){const a=i*2.39996+rot,q=.32+.4*((i*.618)%1),b=PJ(B,O,[Math.cos(a)*R0*.12,Math.sin(a)*R0*.12,R0*.04]),e=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*(.16-.12*q)]);fd+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`;ad+=`M${f(e[0]-rr)},${f(e[1])}a${f(rr)},${f(rr*.8)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr*.8)} 0 1,0 ${f(-2*rr)},0`}
  E('path',{d:fd,stroke:mix(st,'#f4eac0',.4),'stroke-width':f(Math.max(.35,R0*.012)),'stroke-opacity':.85,fill:'none'},k);E('path',{d:ad,fill:st},k);
  if(o.carp!==0)capDisc(k,B,O,R0*.13,R0*.12,o.carp||'#a8c46a',{dots:0})}
/* a peony flower in its frame: guard petals, then the heart — a ball of ruffled petaloids (double), cream petaloids (japanese), or rings of petals round the boss (single, semi-double) */
function peoFlower(par,B,O,D,cw,op,kd){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),items=[],rot=R(0,6.28),dbl=kd==='dbl',big=kd==='arb',semi=kd==='arb'||kd==='cor'||kd==='ito';if(nz<.4)capBracts(k,B,O,R0*.38,5,'#4a6a2c',{len:.5,w:.28,a0:2.2,a1:2.6});
  const guard=dbl?7:semi?9:7;for(let i=0;i<guard;i++){const l=ligule(B,O,{phi:i/guard*6.283+rot+R(-.1,.1),r0:R0*.1,z0:0,L:R0*(dbl?.62:.8)*R(.92,1.05),W:R0*(dbl?.36:.38),wp:PEO_G,a0:(dbl?.75:.55)+.6*o2,a1:(dbl?1.05:.8)+.6*o2,pw:1.3,th:.9,tip:'round',wav:big?.45:.16,wk:big?6:3,n:7,tw:R(-.25,.25)});
    items.push({l,c:cw.c,mid:null})}
  if(semi)for(let i=0;i<8;i++){const l=ligule(B,O,{phi:i/8*6.283+rot+.4,r0:R0*.08,z0:R0*.04,L:R0*.6,W:R0*.3,wp:PEO_G,a0:.4+.5*o2,a1:.65+.5*o2,pw:1.3,th:1,tip:'round',wav:big?.5:.2,wk:big?6:3,n:6,tw:R(-.3,.3)});items.push({l,c:mix(cw.c,shd(cw.c,.08),.5)})}
  drawLig(k,items);
  if(dbl||cw.jap){/* the heart: petaloids heaped in a ball (double) or a cushion of narrow cream ones (japanese) */const N=Math.round((cw.jap?40:56)*(DET>=1.5?1.2:1)*(LOD?.6:1)),it2=[];
    for(let i=0;i<N;i++){const fr=(i+.5)/N,ph=i*2.39996+rot,l=ligule(B,O,{phi:ph,r0:R0*(.03+.2*fr),z0:R0*(cw.jap?.06:.12+.22*(1-fr))*(.6+.4*o2),L:R0*(cw.jap?.22+.12*fr:.24+.3*Math.pow(fr,.7))*(.75+.25*o2),W:R0*(cw.jap?.06:.14+.08*fr),wp:prof([[0,.5],[.4,1],[1,.7]]),
        a0:(cw.jap?.15:.1)+.9*fr*o2,a1:(cw.jap?.3:.35)+.8*fr*o2,pw:1.2,th:cw.jap?1.6:1.3,tip:'round',wav:cw.jap?.2:.5,wk:4,n:5,tw:R(-.5,.5)});const c=cw.c2||cw.c;it2.push({l,c:mix(c,shd(c,R(-.12,.08)),.6),noov:fr<.3})}
    drawLig(k,it2)}
  else if(nz>-.2&&o2>.25)peoBoss(k,B,O,R0,cw,{carp:kd==='arb'?'#e8a0b8':'#a8c46a'});
  /* the dark flares at the base of the petals (tree and Itoh peonies) */
  if(cw.fl&&nz>.15&&!LOD&&o2>.3)E('path',{d:smooth(spDisc(B,O,R0*.3,R0*.04)),fill:flushFill(cw.fl,.85)},k);
  return k}
/* the bud: a round ball in its sepals, the 'marshmallow' showing its colour */
function peoBud(par,B,O,s,cw,a){capBud(par,B,O,s,cw.c,.35+.6*a,'#4a6a2c')}
const PEO_SC=['#3a4a24','#5b6a35','#7f8f52','#b0bc84'],PEO_WSC=['#4a3a28','#6b5a44','#8f7a60','#bcae90'];
function peoPlant(g,t,o,list,kd){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||15)*UPC,k=G(g),tree=kd==='arb';
  const r=lsHeadS(k,o,{D,w:D*(tree?.055:.045),cols:tree?PEO_WSC:PEO_SC,op,rr:.6,nodes:tree?1:2,li:.42,lp:.62,opp:0,leafAng:48,side:tree?null:{p:kd==='dbl'||kd==='sim'?.6:.35,n:1,top:2,len:.45,ang:30,age:[0,.3]},budD:.24,wig:.03,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){peoBud(par,B,O,D2*.36,cw,.8);return}peoFlower(par,B,O,D2,cw,op2,kd)},bud:(par,B,O,s,a)=>peoBud(par,B,O,s,cw,a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.85,1.1),(par,x,y,a,l)=>tree?palmLeaf(par,x,y,a,l,'#5a7a3c',{lobes:3,spread:100,wl:.3,pet:.3}):pinnateLeaf(par,x,y,a,l,'#2f5a28',5,{w:.36,gloss:.4,side:.3}))});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'pivoine-herbacee-double':(g,t,o)=>peoPlant(g,t,o,CW_PDBL,'dbl'),'pivoine-herbacee-simple':(g,t,o)=>peoPlant(g,t,o,CW_PSIM,'sim'),'pivoine-arbustive':(g,t,o)=>peoPlant(g,t,o,CW_PARB,'arb'),
  'pivoine-corail':(g,t,o)=>peoPlant(g,t,o,CW_PCOR,'cor'),'pivoine-itoh':(g,t,o)=>peoPlant(g,t,o,CW_PITO,'ito')});
Object.assign(CWS,{'pivoine-herbacee-double':CW_PDBL,'pivoine-herbacee-simple':CW_PSIM,'pivoine-arbustive':CW_PARB,'pivoine-corail':CW_PCOR,'pivoine-itoh':CW_PITO});
Object.assign(SZG,{'pivoine-herbacee-double':[13,14,15,15,16,17],'pivoine-herbacee-simple':[10,11,12,13],'pivoine-arbustive':[17,19,20,22],'pivoine-corail':[13,14,15,16],'pivoine-itoh':[15,16,17,18]});
Object.assign(GHI,{'pivoine-herbacee-double':{form:'rosette',size:3,k:'head',rk:1},'pivoine-herbacee-simple':{form:'disque',size:3,k:'head',rk:1},'pivoine-arbustive':{form:'rosette',size:3,k:'head',rk:1},
  'pivoine-corail':{form:'rosette',size:3,k:'head',rk:1},'pivoine-itoh':{form:'disque',size:3,k:'head',rk:1}});
for(const id of['pivoine-herbacee-double','pivoine-herbacee-simple','pivoine-arbustive','pivoine-corail','pivoine-itoh'])GH_BUDS.add(id);
