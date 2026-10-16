/* ================= Serre, reprise 2 — les plantes poussent (L-système) : lis (oriental, asiatique, double, tigre), nérine, agapanthe ================= */
/* lilies: a raceme grown node by node: at each node a bract leaf and a pedicel curving up (nodding in the tiger lily), the lowest flowers open first, buds above;
   lance leaves scattered below; the rules: A(i<n) → F [/φ &β Lv] [/φ &α F(e) K(age_i)] /137.5 A(i+1)   A(n) → F Kb */
const LILY_LS={oriental:{D:18,li:.3,ped:.42,a:52,e:.05,nF:[1,2],nB:2,lw:.26,lc:'#355f2a'},asiatic:{D:12,li:.28,ped:.4,a:36,e:.09,nF:[2,3],nB:2,lw:.2,lc:'#3a6a2c'},
  double:{D:17,li:.3,ped:.42,a:50,e:.05,nF:[1,2],nB:1,lw:.26,lc:'#355f2a'},tiger:{D:10,li:.34,ped:.55,a:62,e:-.07,nF:[2,4],nB:2,lw:.13,lc:'#3f6a2a'}};
function lilyPlant(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),K=LILY_LS[kd],D=(o.cm||K.D)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#9cc070'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.035,cols:sc,op,rr:.4,nodes:0,lp:.5,flower:(par,B,O,D2,op2)=>lilyFlower(par,B,O,D2,cw,op2,kd)});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nF=op<.3?0:op<.7?1:Math.round(R(K.nF[0],K.nF[1])),nB=K.nB+(op<.3?1:0),n=nF+nB,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(K.li*1.5+K.ped)))):1,li=D*K.li*kr;
  const rules={S:()=>[['F',{l:li*1.3,w1:D*.04}],['[',{}],['/',{a:R(0,360)}],['&',{a:42}],['Lv',{big:1}],[']',{}],['F',{l:li*.6,w1:D*.038}],['[',{}],['/',{a:R(0,360)}],['&',{a:40}],['Lv',{big:1}],[']',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.45,w1:D*.02}],['Kb',{age:.05,tip:1}]];const fl=p.i<nF,age=fl?1-.12*p.i:.32-.24*(p.i-nF)/Math.max(1,nB);
      return[['F',{l:li*R(.85,1.15)*(p.i?1:.4),w1:D*(.036-.003*p.i)}],['[',{}],['&',{a:30}],['Lv',{bract:1}],[']',{}],['[',{w:D*.016}],['&',{a:K.a*(fl?1:.6)+R(-6,6)}],['F',{l:D*K.ped*kr*(fl?1:.55),w1:D*.013,e:fl?K.e:.09}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:137.5+R(-10,10)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.12,T:[0,1,0],e:.015,w:D*.042});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=og===main&&kd!=='tiger'?B:lsFrame(og,null,R(-.25,.25));return{parts:[{z:pos[2],fn:par=>lilyFlower(par,Bf,pos,D*(og===main?1:.94),cw,op,kd)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,R(-.3,.3)),len=D*(og.p.tip?.22:.3+.35*og.p.age);return{parts:[{z:pos[2],fn:par=>lilyBud(par,Bf,pos,len,cw,kd)}]}}
    if(og.t==='Lv'){const len=D*(og.p.bract?.32:.62)*(kd==='tiger'?.8:1),w=og.p.bract?K.lw*.8:K.lw;return{ext:1,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,w,K.lc,{side:.4,arch:12,par:1,gloss:.45}))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* nerine and agapanthe: a leafless scape, a papery spathe split at its top, the umbel's pedicels radiating from it, curving up; florets of every age, the youngest in bud */
function nerFloret(k,Bf,O,d,cw,ner,cache){const items=[];
  for(let j=0;j<6;j++){const l=ligule(Bf,O,ner?{phi:j/6*6.283+R(-.15,.15),r0:d*.03,z0:0,L:d*R(.85,1),W:d*.1,wp:prof([[0,.35],[.2,.8],[.6,1],[1,.15]]),a0:.35,a1:2.2,pw:1.4,th:-.6,tip:'point',wav:.9,wk:6,n:14,tw:R(-.6,.6)}:
      {phi:j/6*6.283,r0:d*.04,z0:0,L:d*.95,W:d*.22,wp:prof([[0,.3],[.3,.75],[.7,1],[1,.35]]),a0:.22,a1:.85,pw:1.6,th:.6,tip:'round',n:7});
    items.push({l,c:cw.base&&!ner?mix(cw.c,cw.base,.15):cw.c,mid:cw.mid,mw:Math.max(.5,d*.03),edge:cw.edge,ew:7,ewd:Math.max(.8,d*.035)})}
  drawLig(k,items);if(LOD)return;
  const sp=[];for(let j=0;j<6;j++){const a=j/6*6.283+.5,P0=[0,0,d*.05],P1=ner?[Math.cos(a)*d*.25,Math.sin(a)*d*.25+d*.1,d*.75]:[Math.cos(a)*d*.15,Math.sin(a)*d*.15,d*.75],e=PJ(Bf,O,P1),b=PJ(Bf,O,P0);sp.push([b,e])}
  let s2='',an='';for(const[b,e]of sp){s2+=`M${f(b[0])},${f(b[1])}Q${f((b[0]+e[0])/2)},${f((b[1]+e[1])/2-d*.08)} ${f(e[0])},${f(e[1])}`;an+=`M${f(e[0]-d*.035)},${f(e[1])}a${f(d*.035)},${f(d*.035)} 0 1,0 ${f(d*.07)},0a${f(d*.035)},${f(d*.035)} 0 1,0 ${f(-d*.07)},0`}
  E('path',{d:s2,stroke:ner?mix(cw.c,'#ffffff',.3):'#e8eef8','stroke-width':f(Math.max(.4,d*.018)),fill:'none','stroke-linecap':'round'},k);E('path',{d:an,fill:ner?'#7a3a4a':'#3a3046'},k)}
function umbelPlant(g,t,o,list,kd){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),ner=kd==='ner',D=(o.cm||(ner?13:15))*UPC,Rr=D/2,k=G(g),B=frameOf(o,.6,true),sc=['#2a4a1e','#4a7032','#6e9a48','#9cc070'];
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const n=op<.35?0:ner?Math.round(R(7,10)):Math.round(34*(LOD?.55:1)),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*.9))):1,pl=Rr*(ner?.68:.62),mods=[['F',{l:D*.55*kr,w0:D*(ner?.052:.06),w1:D*(ner?.048:.056)}],['F',{l:D*.2*kr,aim:V3.nz(V3.add(up,V3.sc(ax,.5))),k:.3}],['Sp',{}]];
  for(let i=0;i<n;i++){const a=ner?i/n*360+R(-14,14):i*137.5,el=ner?R(25,72):Math.acos(1-1.84*(i+.5)/n)/D,age=ner?(rnd()<.22?R(.05,.3):R(.75,1)):(op<.7&&i%3===0?R(.05,.3):R(.7,1));
    mods.push(['[',{w:Math.max(.6,D*.008)}],['/',{a}],['&',{a:el}],['F',{l:pl*R(.8,1.05)*(age<.4?.8:1),w1:Math.max(.5,D*.007),e:ner?.05:.02}],['K',{age}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.1,T:[0,1,0],e:.01,w:D*.05});for(const ch of res.chains)ch.c=sc;
  const sp=res.organs.find(q=>q.t==='Sp'),apex=V3.add(sp.pos,V3.sc(sp.H,Rr*.4));
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='Sp'){const Bs=lsFrame(og,null,0);if(op<.35){const l=ligule(Bs,pos,{phi:0,r0:0,z0:0,L:Rr*.9,W:Rr*.35,wp:prof([[0,.6],[.4,1],[1,.05]]),a0:.05,a1:.02,tip:'point',th:2.4});return{parts:[{z:pos[2]+Rr*.2,fn:par=>drawLig(par,[{l,c:ner?'#d8c8a8':'#a8b880',ink:'#7a6a4a'}])}]}}
      /* the spathe split in two, papery, hanging under the umbel */
      const it=[];for(const s of[-1,1])it.push({l:ligule(Bs,pos,{phi:s*1.571,r0:D*.02,z0:-D*.01,L:Rr*.42,W:Rr*.12,wp:prof([[0,.8],[.5,1],[1,.05]]),a0:2.2,a1:2.6,tip:'point',th:1.2}),c:ner?'#d8c8a8':'#b8c090',ink:'#7a6a4a'});
      return{parts:[{z:pos[2]-Rr*.2,fn:par=>drawLig(par,it)}]}}
    if(og.t==='K'){const Bf=lsFrame(og,null,R(0,6)),d=ner?Rr*.62:Rr*.3,a=og.p.age;
      if(a<.4){const l=ligule(Bf,pos,{phi:0,r0:0,z0:0,L:d*(.6+.6*a),W:d*.16,wp:prof([[0,.5],[.5,1],[1,.1]]),a0:.02,a1:.01,tip:'round',th:3});return{parts:[{z:pos[2],fn:par=>drawLig(par,[{l,c:mix(cw.c,'#9ab070',.35-.3*a)}])}]}}
      return{parts:[{z:pos[2],fn:par=>nerFloret(par,Bf,pos,d*(.85+.15*a),cw,ner)}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
Object.assign(GH,{'lis-oriental':(g,t,o)=>lilyPlant(g,t,o,'oriental',CW_LORI),'lis-asiatique-la':(g,t,o)=>lilyPlant(g,t,o,'asiatic',CW_LASI),'lis-oriental-double':(g,t,o)=>lilyPlant(g,t,o,'double',CW_LDBL),'lis-tigre':(g,t,o)=>lilyPlant(g,t,o,'tiger',CW_LTIG),
  'nerine':(g,t,o)=>umbelPlant(g,t,o,CW_NER,'ner'),'agapanthe':(g,t,o)=>umbelPlant(g,t,o,CW_AGA,'aga')});
for(const id of['lis-oriental','lis-asiatique-la','lis-oriental-double','lis-tigre'])if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[1,2]});
for(const id of['lis-oriental','lis-asiatique-la','lis-oriental-double','lis-tigre','nerine','agapanthe'])GH_BUDS.add(id);
