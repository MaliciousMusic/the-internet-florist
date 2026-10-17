/* ================= Serre, lot 13 — grandis par le L-système : pois de senteur, lisianthus, clématite, chrysanthème disbud, chrysanthème araignée ================= */
/* a frame facing the asked side (sprays and racemes turn their flowers toward the light), its top toward the sky */
function faceFrame(og,face,k=.82){const Z=V3.nz(V3.add(V3.add(V3.sc(face,k),V3.sc(og.H,1-k+.12)),[R(-.08,.08),R(-.06,.06),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);
  const X=V3.cr(Y,Z),j=R(-.15,.15),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* ---------- sweet pea (Lathyrus odoratus): a raceme of three to five butterfly flowers on a long bare peduncle — the ruffled banner standing up, two wings round the keel; a bud at the tip ---------- */
const CW_PEA=[{id:'blanc',n:'Blanc (Aphrodite)',c:'#f7f3ec'},{id:'creme',n:'Crème (Castle of Mey)',c:'#f2e8c8'},{id:'rose-pale',n:'Rose pâle (Mrs Bernard Jones)',c:'#f2c6d2'},{id:'rose',n:'Rose (Banty)',c:'#f2b6c8',w:'#f6ccd8'},{id:'saumon',n:'Saumon (William and Catherine)',c:'#f2a08a',w:'#f6b8a4'},
  {id:'corail',n:'Corail (Valerie Harrod)',c:'#f08070'},{id:'cerise',n:'Cerise (Mark Williams)',c:'#e2457e'},{id:'rouge',n:'Rouge',c:'#c8203a'},{id:'bordeaux',n:'Bordeaux (Almost Black)',c:'#7a1f3a'},{id:'mauve',n:'Mauve',c:'#c46aa8',w:'#d890c0'},
  {id:'lavande',n:'Lavande (Jacqueline Ann)',c:'#c9a6dc'},{id:'lilas',n:'Lilas bleuté',c:'#a99ad8'},{id:'violet',n:'Violet (Triple G)',c:'#6a4ab0'},{id:'bleu',n:'Bleu nuit',c:'#4a4aa8',w:'#6a6ac0'},
  {id:'rose-flamme',n:'Blanc flammé de rose (Pink Candy)',c:'#f6eef0',edge:'#d84a7a'},{id:'picotee',n:'Blanc liseré de rose (Anniversary)',c:'#f4ecd8',edge:'#e07aa0'},
  {id:'blanc-raye-prune',n:'Blanc strié de prune (Lisa Marie)',c:'#9f838e',late:7},{id:'blanc-raye-lilas',n:'Blanc rayé de lilas (Sir Jimmy Shand)',c:'#a098a3',late:7},{id:'blanc-flamme-carmin',n:'Blanc flammé de carmin (Our Heroes)',c:'#e4638c',late:7},{id:'blanc-lisere-bleu',n:'Blanc liseré de bleu (Albutt Blue)',c:'#c1bdc3',edge:'#8f86c8',late:7},{id:'creme-lisere-violet',n:'Crème liseré de violet (High Scent)',c:'#d2d5bd',edge:'#9a78c4',late:7},{id:'bleu-pale-lavande',n:'Bleu pâle lavande (Ballerina Blue)',c:'#b7b2c6',late:7}];
function peaFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,o2=sm01((op-.2)/.8),it=[];
  /* the standard: a broad ruffled fan standing up behind, its claw hidden, reflexed back once open */
  it.push({l:ligule(B,O,{phi:Math.PI/2+R(-.06,.06),r0:R0*.05,z0:-R0*.08,L:R0*.9,W:R0*(.5+.22*o2),wp:prof([[0,.16],[.15,.42],[.4,.84],[.7,1],[.92,.9],[1,.55]]),a0:.9+.35*o2,a1:1.3+.45*o2,pw:1.2,th:.5-.35*o2,tip:'round',wav:.2+.1*o2,wk:4,n:8,tw:R(-.1,.1)}),c:cw.c,edge:cw.edge,ew:7,ewd:Math.max(.6,R0*.06)});
  /* the wings, cupped round the keel, spread down and forward like a butterfly's */
  for(const s of[-1,1])it.push({l:ligule(B,O,{phi:(270+s*48)*D2R,r0:R0*.05,z0:R0*.06,L:R0*.6,W:R0*.3,wp:prof([[0,.3],[.3,.85],[.65,1],[1,.7]]),a0:.5,a1:.95+.3*o2,pw:1.2,th:.8,tip:'round',wav:.12,n:6,tw:s*.3}),c:cw.w||mix(cw.c,shd(cw.c,.12),.5),edge:cw.edge,ew:4,ewd:Math.max(.5,R0*.05)});
  /* the keel, a pale boat between them */
  it.push({l:ligule(B,O,{phi:Math.PI*1.5,r0:R0*.02,z0:R0*.1,L:R0*.42,W:R0*.13,wp:prof([[0,.5],[.5,1],[1,.4]]),a0:.45,a1:.8,pw:1.2,th:1.8,tip:'round',n:4}),c:lt(cw.c,.25)});drawLig(k,it);return k}
function peaPlant(g,t,o){const cw=o.cw||cwNear(CW_PEA,o.col)||CW_PEA[0],op=Math.max(.05,Math.min(1,o.op??1)),D=4.6*UPC*R(.94,1.06),k=G(g),sc=['#3a5a2a','#5f8a42','#86ac64','#b8d494'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.06,cols:sc,op,rr:.3,nodes:0,lp:.5,flower:(par,B,O,D2,op2)=>peaFlower(par,B,O,D2,cw,op2)});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nf=op<.3?0:op<.7?2:Math.round(R(3,4)),n=nf+(op<.3?3:1),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.6))):1,sd=rnd()<.5?-1:1;
  const rules={S:()=>[['F',{l:D*1.1*kr,w0:D*.07,w1:D*.06,e:.03}],['+',{a:sd*R(8,18)}],['A',{i:0}]],A:p=>{if(p.i>=n)return[['F',{l:D*.25,w1:D*.03}]];const fl=p.i<nf,age=fl?1-.1*p.i:.3-.2*(p.i-nf);
    return[['F',{l:D*(p.i?.5:.15)*kr,w1:D*(.06-.006*p.i),e:-.02}],['[',{w:D*.035}],['/',{a:(p.i%2?90:-90)+R(-20,20)}],['&',{a:fl?52:35}],['F',{l:D*(fl?.42:.3),w1:D*.03,e:.06}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.04,seg:D*.15,T:[0,1,0],e:.02,w:D*.07});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{if(og.t==='K'){const Bf=faceFrame(og,face);return{parts:[{z:pos[2],fn:par=>peaFlower(par,Bf,pos,D*(1-.06*og.p.i),cw,op)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,0),s=D*(.25+.45*og.p.age);return{parts:[{z:pos[2],fn:par=>spBud(par,Bf,pos,s,s*.5,mix(cw.c,'#7f9f5a',.5-.5*og.p.age),{tp:.5,pw:.6})}]}}return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* ---------- lisianthus (Eustoma): satin cups, single or double and ruffled, on a branched glaucous stem; the long buds furled in a spiral ---------- */
const CW_LIS=[{id:'blanc',n:'Blanc',c:'#f7f5ee'},{id:'champagne',n:'Champagne',c:'#ecdcc2'},{id:'jaune',n:'Jaune pâle',c:'#ece2a8'},{id:'vert',n:'Vert (Arena Green)',c:'#d6e3a6'},
  {id:'rose-pale',n:'Rose pâle',c:'#f2c4d2'},{id:'rose',n:'Rose',c:'#eeb0c0'},{id:'rose-vif',n:'Rose vif',c:'#d84a8a'},{id:'abricot',n:'Abricot',c:'#f4c8aa'},
  {id:'lavande',n:'Lavande',c:'#c5b2e0'},{id:'lilas',n:'Lilas',c:'#b07ad6'},{id:'violet',n:'Violet profond',c:'#4b2c8c'},{id:'picotee-violet',n:'Blanc liseré de violet',c:'#f6f2f2',edge:'#6a3a9a'},{id:'picotee-rose',n:'Blanc liseré de rose',c:'#f6f0f0',edge:'#d84a8a'}];
function lisFlower(par,B,O,D,cw,op,dbl){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=R(0,6.28),pic=!!cw.edge&&!LOD,br=()=>capBracts(k,B,O,R0*.3,5,'#6f8f6a',{len:.5,w:.14});if(nz<.45&&nz>=0)br();
  /* single: five satin petals furled in a spiral into a deep cup flaring at the rim; double: three ruffled whorls, like a rose */
  const rings=dbl?[[7,1,.42,.75,.45,.55],[6,.8,.22,.5,.45,.55],[5,.58,.08,.3,.4,.5]]:[[5,1,.18,.42,.32,.5]];
  rings.forEach(([n,sc,a0,a1,k0,k1],ri)=>{for(let i=0;i<n;i++){const P={phi:i/n*6.283+rot+ri*.45+R(-.08,.08),r0:R0*.08,z0:R0*.03*ri,L:R0*.9*sc*R(.94,1.04),W:R0*(dbl?.42:.5)*sc,wp:prof([[0,.32],[.28,.8],[.62,1],[1,.88]]),a0:a0+k0*o2,a1:a1+k1*o2,pw:1.3,th:.55+.3*ri,tip:'round',wav:dbl?.22:.12,wk:4,n:6,tw:(dbl?.35:.55)+R(-.1,.1)};
    const l=ligule(B,O,P),c=ri?mix(cw.c,shd(cw.c,.06),.5):cw.c;
    /* a picotee flushes the margin: the petal in the edge colour, then its heart in two steps */
    if(pic&&ri===0){it.push({l,c:mix(cw.edge,cw.c,.15)});for(const[q,m]of[[.86,.5],[.7,1]]){const l2=ligule(B,O,Object.assign({},P,{L:P.L*q,W:P.W*(q+.06),wav:P.wav*q}));l2.z=l.z+.001*m;it.push({l:l2,c:mix(cw.edge,c,m),noov:1,ink:'none'})}}
    else it.push({l,c,edge:cw.edge,ew:2,ewd:Math.max(.5,R0*.035),noov:dbl&&ri>0})}});
  drawLig(k,it);if(!dbl&&nz>.2&&o2>.3&&!LOD){const st=PJ(B,O,[0,0,R0*.35]),r=R0*.05;E('path',{d:`M${f(st[0]-r*1.6)},${f(st[1])}a${f(r*1.6)},${f(r)} 0 1,0 ${f(r*3.2)},0a${f(r*1.6)},${f(r)} 0 1,0 ${f(-r*3.2)},0`,fill:'#f0ead0',stroke:'#a8a070','stroke-width':.3},k)}if(nz<0)br();return k}
function lisBud(par,B,O,s,cw,a){const col=mix(cw.c,'#9ab88a',.55-.4*a);spBud(par,B,O,s,s*.36,col,{tp:.7,pw:.7});if(LOD)return;const q=[];for(let i=0;i<3;i++){const pts=[];for(let j=0;j<=6;j++){const v=j/6,an=i*2.09+v*3.2,r=s*.18*Math.sin(Math.PI*Math.min(.98,.05+.95*v))*(1-.5*v);pts.push(PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*s]))}q.push(smooth(pts.map(p=>[p[0],p[1]]),false))}
  E('path',{d:q.join(''),stroke:shd(col,-.35),'stroke-width':.4,'stroke-opacity':.6,fill:'none'},par)}
function lisPlant(g,t,o){const cw=o.cw||cwNear(CW_LIS,o.col)||CW_LIS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6)*UPC,k=G(g),sc=['#3a5a44','#5f7f6a','#88a894','#b4ccbc'],dbl=rnd()<.7;
  const r=lsHeadS(k,o,{D,w:D*.06,cols:sc,op,rr:.5,nodes:3,li:.85,lp:1.1,opp:1,leafAng:44,side:{p:.85,n:1,top:3,len:1.3,ang:30,age:[0,.95]},budD:.62,budMax:.5,wig:.04,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){lisBud(par,B,O,D2*.62,cw,.6);return}lisFlower(par,B,O,D2,cw,op2,dbl)},bud:(par,B,O,s,a)=>lisBud(par,B,O,s,cw,a),young:(par,B,O,s,a)=>lisFlower(par,B,O,s*1.2,cw,.35+.6*a,dbl),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.85,1.05),.48,'#6f8f78',pp,{wp:LS_OVATE,droop:.15,arch:.08,fold:.15,face:.5});return pp}});
  open(k,t,1000,8,.3);return r}
/* ---------- clematis: a vine — flat star of pointed tepals (barred in some) round a boss of stamens, on long pedicels from the leaf axils; trifoliate leaves, buds ---------- */
const CW_CLE=[{id:'bleu',n:'Bleu violet',c:'#5f5aa8',st:'#efe6b8'},{id:'pourpre',n:'Pourpre (Jackmanii)',c:'#5b3a8c',st:'#d8d0a0'},{id:'blanc',n:'Blanc',c:'#f6f4ee',st:'#e8d890'},{id:'rose-barre',n:'Rose barré (Nelly Moser)',c:'#e8b8d0',bar:'#c8507e',st:'#7a2a4a'},
  {id:'rose',n:'Rose',c:'#dea0c0',st:'#f0e6c0'},{id:'lilas',n:'Lilas',c:'#b9a0d2',st:'#f0e8c0'},{id:'rouge',n:'Rouge sombre',c:'#6e1e3a',st:'#e8d890'},{id:'vin',n:'Lie-de-vin',c:'#a2345e',st:'#efe0b0'},
  {id:'mauve',n:'Mauve',c:'#b06898',st:'#f0e0b8'},{id:'vert',n:'Vert tendre',c:'#b8cc90',st:'#e8e0b0'},{id:'lavande-pale',n:'Lavande pâle',c:'#d2c4dc',st:'#e8d890'}];
function cleFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=R(0,6.28),n=rnd()<.6?6:rnd()<.5?5:8;
  for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+R(-.06,.06),r0:R0*.1,z0:0,L:R0*.9*R(.95,1.03),W:R0*(n>6?.3:.38),wp:prof([[0,.35],[.3,.85],[.6,1],[.88,.6],[1,.08]]),a0:.9+.45*o2,a1:1.2+.35*o2,pw:1.2,th:.2,tip:'point',wav:.18,wk:4,n:7,tw:R(-.2,.2)});
    it.push({l,c:cw.c,mid:cw.bar||shd(cw.c,-.15),mw:cw.bar?Math.max(1.2,R0*.12):Math.max(.4,R0*.03),mo:cw.bar?.75:.45})}
  drawLig(k,it);if(nz>-.2&&o2>.2)peoBoss(k,B,O,R0*.55,{st:cw.st},{carp:mix(cw.st,'#c8c890',.4)});return k}
function clePlant(g,t,o){const cw=o.cw||cwNear(CW_CLE,o.col)||CW_CLE[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||13)*UPC,k=G(g),sc=['#3a4a24','#5a7a3a','#7f9a5a','#b0c48a'];
  const r=lsHeadS(k,o,{D,w:D*.025,cols:sc,op,rr:.5,nodes:2,li:.55,lp:.75,opp:1,leafAng:58,side:{p:.55,n:1,top:2,len:.85,ang:40,age:[0,.6]},budD:.28,budMax:.5,wig:.09,e:.02,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){spBud(par,B,O,D2*.3,D2*.16,mix(cw.c,'#8aa060',.5),{tp:.6,pw:.6});return}cleFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>spBud(par,B,O,s,s*.5,mix(cw.c,'#8aa060',.6-.4*a),{tp:.6,pw:.6}),
    young:(par,B,O,s,a)=>cleFlower(par,B,O,s*1.3,cw,.4+.6*a),leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.5,.65),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#3f6a2c',3,{w:.5,side:.3}))});
  open(k,t,1000,8,.3);return r}
/* ---------- chrysanthemums: the disbud ball (florets curving in over the heart) and the spider (long tubular rays ending in hooks); lobed aromatic leaves ---------- */
const CW_MUMD=[{id:'blanc',n:'Blanc',c:'#f7f5ee'},{id:'creme',n:'Crème',c:'#f2ead0'},{id:'jaune',n:'Jaune',c:'#f5d22c'},{id:'vert',n:'Vert',c:'#c8d86a'},{id:'rose',n:'Rose',c:'#e8b0c0'},{id:'rose-poudre',n:'Rose poudré',c:'#e2cfdb'},
  {id:'lilas',n:'Lilas',c:'#c3a6dc'},{id:'violet',n:'Violet',c:'#7a2a6a'},{id:'prune',n:'Prune',c:'#80304e'},{id:'bordeaux',n:'Bordeaux',c:'#5a1832'},{id:'orange',n:'Orange',c:'#f08a2a'},{id:'rouille',n:'Rouille',c:'#b8582a'},
  {id:'bleu',n:'Bleu (teinté)',c:'#6a9cd6'},{id:'noir',n:'Pourpre noir',c:'#3e1228'},
  /* added late (wave late:9, after the SKU numbers already published): the documented colourways of catalogue/serre/sources/chrysantheme-disbud.json */
  {id:'saumon',late:9,n:'Saumon',c:'#eabe90'},{id:'blanc-coeur-vert',late:9,n:'Blanc à cœur vert',c:'#ecedd2'},{id:'rose-blanc-strie',late:9,n:'Rose strié de blanc',c:'#b8508a',c2:'#f6ecf2',k2:.3}];
const CW_MUMS=[{id:'blanc',n:'Blanc',c:'#f7f5ee'},{id:'vert',n:'Vert (Anastasia)',c:'#b8cf5a'},{id:'jaune',n:'Jaune',c:'#f5d22c'},{id:'bronze',n:'Bronze',c:'#c8823a'},{id:'lilas',n:'Lilas',c:'#c3a6dc'},{id:'rose',n:'Rose',c:'#ec9fb8'},{id:'saumon',n:'Saumon',c:'#f0a888'},{id:'violet',n:'Violet',c:'#8a3a7a'}];
function mumFlower(par,B,O,D,cw,op,spider){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),items=[],rot=R(0,6.28),br=()=>{/* the involucre: a green cup of overlapping bracts under the head */const q=[];for(let i=0;i<16;i++){const a=i/16*6.283;q.push(PJ(B,O,[Math.cos(a)*R0*.2,Math.sin(a)*R0*.2,-R0*.06]))}E('path',{d:smooth(q),fill:'#4f7a3a',stroke:'#2e4a22','stroke-width':.4},k);capBracts(k,B,O,R0*.34,13,'#4a6a34',{len:.5,w:.2})};if(nz<.45&&nz>=0)br();
  if(spider){const N=Math.round(34*(LOD?.6:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,l=ligule(B,O,{phi:i*2.39996+rot,r0:R0*.16,z0:R0*.04*(1-fr),L:R0*(.62+.38*fr)*R(.92,1.06),W:R0*.055,wp:prof([[0,.6],[.3,1],[.85,.9],[1,.35]]),a0:.35+.9*fr*o2,a1:(.9+1.4*fr)*(.4+.6*o2),pw:1.6,th:-2.6,tip:'point',n:7,tw:R(-.3,.3)});items.push({l,c:mix(cw.c,shd(cw.c,R(-.12,.06)),.6)})}
    const N2=Math.round(30*(LOD?.6:1));for(let i=0;i<N2;i++){const fr=(i+.5)/N2,l=ligule(B,O,{phi:i*2.39996+rot+.3,r0:R0*.04*fr,z0:R0*.12,L:R0*(.16+.12*fr),W:R0*.05,wp:prof([[0,.6],[.5,1],[1,.5]]),a0:.1+.4*fr,a1:-.2+.3*fr,pw:1.2,th:-2.2,tip:'round',n:4});items.push({l,c:shd(cw.c,.05),noov:1})}}
  else{const N=Math.round(78*(DET>=1.5?1.25:1)*(LOD?.55:1));for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.8),a0=.12+1.25*fo*(.4+.6*o2),l=ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.04+.14*fr),z0:R0*.26*(1-fr),L:R0*(.24+.46*Math.pow(fr,.7))*(.7+.3*o2),W:R0*(.1+.07*fr),wp:prof([[0,.5],[.35,.95],[.75,1],[1,.75]]),a0,a1:a0-.35-.25*fo,pw:1.3,th:1.4,tip:'round',n:5,tw:R(-.15,.15)});
      items.push({l,c:mix(cw.c,shd(cw.c,R(-.1,.05)),.55),noov:fr<.3})}}
  drawLig(k,items);if(nz<0)br();return k}
/* a chrysanthemum leaf: ovate, cut along its midrib into toothed lobes, on a short petiole */
function mumLeaf(par,x,y,ang,len,col,o={}){const P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),pl=len*.18,bl=len-pl,W=bl*.36,ct=Math.cos(o.tilt??R(.25,.6)),nl=o.nl||3,Lt=[],Rt=[];
  for(let i=0;i<=24;i++){const t=i/24,ov=Math.sin(Math.PI*Math.pow(t,.8))*(1-.25*t),lob=.52+.48*Math.pow(Math.abs(Math.sin(Math.PI*nl*(t+.06))),.55),th=1+.07*Math.sin(t*44),w=W*ov*lob*th;
    Lt.push([pl+bl*t,-w*ct]);Rt.push([pl+bl*t,w*ct*(.94+.1*Math.sin(t*7))])}
  E('path',{d:`M0,0L${f(pl)},0`,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.025)),'stroke-linecap':'round'},g);
  E('path',{d:smooth(Lt.concat(Rt.reverse())),fill:toneAt(P,.6),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){let v=`M${f(pl)},0L${f(len*.97)},0`;for(let j=1;j<nl*2;j+=2){const t=j/(2*nl)-.06;if(t<.1)continue;const x0=pl+bl*t*.8,x1=pl+bl*Math.min(.98,t+.08),h=W*.75*ct*Math.sin(Math.PI*t);v+=`M${f(x0)},0L${f(x1)},${f(-h)}M${f(x0)},0L${f(x1)},${f(h)}`}
    E('path',{d:v,stroke:P.l1,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.55,fill:'none'},g)}return g}
function mumPlant(g,t,o,list,spider){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||(spider?14:15))*UPC,k=G(g),sc=['#2e4a26','#4a6a3c','#6e9058','#a2bc88'];
  const r=lsHeadS(k,o,{D,w:D*.04,cols:sc,op,rr:.6,nodes:2,li:.4,lp:.65,opp:0,leafAng:52,side:null,wig:.025,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*.22,cw.c,.5,'#4a6a34');return}mumFlower(par,B,O,D2,cw,op2,spider)},
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.55,.7),(par,x,y,a,l)=>mumLeaf(par,x,y,a,l,'#3f6a2c'))});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'pois-de-senteur':peaPlant,'lisianthus':lisPlant,'clematite':clePlant,'chrysantheme-disbud':(g,t,o)=>mumPlant(g,t,o,CW_MUMD,0),'chrysantheme-araignee':(g,t,o)=>mumPlant(g,t,o,CW_MUMS,1)});
Object.assign(CWS,{'pois-de-senteur':CW_PEA,'lisianthus':CW_LIS,'clematite':CW_CLE,'chrysantheme-disbud':CW_MUMD,'chrysantheme-araignee':CW_MUMS});
Object.assign(SZG,{'pois-de-senteur':[10,12,12,14],'lisianthus':[5,5.5,6,6,6.5],'clematite':[10,12,13,14],'chrysantheme-disbud':[12,13,14,15,16],'chrysantheme-araignee':[12,13,14,15]});
Object.assign(GHI,{'pois-de-senteur':{form:'grappe',size:2,k:'head',rk:.45},'lisianthus':{form:'rosette',size:2,k:'head',rk:1},'clematite':{form:'etoile',size:2.5,k:'head',rk:.9},
  'chrysantheme-disbud':{form:'sphere',size:3,k:'head',rk:.95},'chrysantheme-araignee':{form:'etoile',size:3,k:'head',rk:.9}});
for(const id of['pois-de-senteur','lisianthus','clematite','chrysantheme-disbud','chrysantheme-araignee'])GH_BUDS.add(id);
