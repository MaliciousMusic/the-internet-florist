/* ================= Serre, reprise 1 — les plantes poussent (L-système) : dahlias, roses, œillet standard, hortensias, gloriosa ; boutons et rameaux latéraux ================= */
/* dahlias: the hollow stem, a pair of pinnate leaves at its top node, side shoots in their axils ending in buds (as cut), the flower on its long peduncle */
function dahliaPlant(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),sc=['#2a4420','#466c30','#6c9846','#a6c87c'];
  const r=lsHeadS(k,o,{D,w:D*.055,cols:sc,op,rr:1,nodes:rnd()<.4?2:1,li:.5,lp:.95,opp:1,leafAng:58,side:{p:.55,n:2,top:1,len:.42,ang:36,age:[0,.3]},budD:.3,
    flower:(par,B,O,D2,op2)=>dahliaFlower(par,B,O,D2,cw,op2,kd),bud:(par,B,O,s)=>dahliaBud(par,B,O,s/.42,cw),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.62,.82),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#3a6a2c',og.p.i>1?5:3,{w:.48,side:.3}))});
  open(k,t,1000,10,.3);return r}
/* roses: the hip under the flower; alternate leaves of five toothed glossy leaflets; garden roses keep a side shoot or two with a bud or a younger flower, and their thorns */
function roseHip(par,B,O,D){const Rr=D/2,F={B,O,parts:[]};F.parts.push(tube3(F,[[0,0,-Rr*.08],[0,0,-Rr*.2],[0,0,-Rr*.32]],q=>Rr*(.16-.08*q),{cols:['#5f8a3e','#4a7032'],cap:1,hl:.35,dk:.45,spec:.2,ink:'#2e4a20',eo:.3,cast:0}));drawParts(par,F.parts)}
function rosePlant(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#a4c47a'],soft=kd==='jar'||kd==='ang'||kd==='asp',
    lc=kd==='std'||kd==='int'?'#2f5a26':'#3f6a2c';
  /* the standard and intermediate roses are drawn in SVG (y-rosa.js), the bouquet's chance consumed as before */const sv=(kd==='std'||kd==='int')&&typeof rosaSvgPut==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id,iS=kd==='int'?ROSA_INT_PBQ:undefined,iSid=kd==='int'?ROSA_INT_SID:undefined;
  const r=lsHeadS(k,o,Object.assign({D,w:D*.05,cols:sv?(kd==='int'?ROSA_INT_SVSC:ROSA_SVSC):sc,op,rr:1,nodes:soft?2:1,li:.7,lp:soft?.95:.8,opp:0,leafAng:46,side:soft?{p:.42,n:1,top:2,len:.72,ang:30,age:[0,.7]}:null,budD:.5,budMax:.45,
    flower:sv?(par,B,O,D2,op2)=>{rosaSvgPut(par,B,O,D2,cw,op2,o,iS)}:(par,B,O,D2,op2)=>{roseHip(par,B,O,D2);roseFlower(par,B,O,D2,cw,op2,kd)},
    bud:sv?(par,B,O,s)=>{rosaBudSvgPut(par,B,O,s,cw,0,iS)}:(par,B,O,s)=>{roseHip(par,B,O,s);roseFlower(par,B,O,s,cw,.14,kd)},
    young:sv?(par,B,O,s,a)=>{rosaSvgPut(par,B,O,s,cw,.3+.5*a,o,iS)}:(par,B,O,s,a)=>{roseHip(par,B,O,s);roseFlower(par,B,O,s,cw,.3+.5*a,kd)},
    leaf:sv?rosaLeafSv(D,cw,o,iSid,kd==='int'?.92:1):(og,pos)=>lsLeaf2D(og,pos,D*R(1.05,1.35),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,lc,og.p.i>1?5:og.p.i===1&&rnd()<.5?3:5,{w:.55,gloss:.45,side:.4})),
    node:soft?(og,pos)=>({z:pos[2]+.2,cast:false,fn:par=>{const p=[pos[0],-pos[1]],h=[og.H[0],-og.H[1]],l=Math.hypot(h[0],h[1])||1,ux=h[0]/l,uy=h[1]/l,w=D*.05;let d='';
      for(const s of[-1,1]){const bx=p[0]-ux*w*1.4+(-uy)*s*w*.5,by=p[1]-uy*w*1.4+ux*s*w*.5,tx=bx+(-uy)*s*w*.9-ux*w*.5,ty=by+ux*s*w*.9-uy*w*.5;d+=`M${f(bx-ux*w*.5)},${f(by-uy*w*.5)}L${f(tx)},${f(ty)}L${f(bx+ux*w*.5)},${f(by+uy*w*.5)}Z`}
      E('path',{d,fill:'#7a5a3a',stroke:'#4a3420','stroke-width':.3},par)}}):null},sv&&ROSA_STEMO?rosaStemOpts(D,o):null));
  open(k,t,1000,8,.3);return r}
/* the standard carnation: disbudded, two pairs of narrow glaucous leaves clasping swollen nodes, the long last internode under the calyx */
function carnPlant(g,t,o,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),sc=['#2e4a3a','#5f7f6a','#88a894','#b4ccbc'];
  const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:1,nodes:2,li:.8,lp:1.05,opp:1,leafAng:28,side:null,wig:.02,
    flower:(par,B,O,D2,op2)=>carnFlower(par,B,O,D2,cw,op2),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.85,1.1),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.09,'#7f9f8a',{side:og.p.j?.4:-.4,arch:14})),
    node:(og,pos)=>({z:pos[2]+.15,cast:false,fn:par=>{const p=[pos[0],-pos[1]],a=Math.atan2(-og.H[1],og.H[0])/D;E('ellipse',{cx:f(p[0]),cy:f(p[1]),rx:f(D*.05*.75),ry:f(D*.05*.95),fill:sc[1],stroke:sc[0],'stroke-width':.35,transform:`rotate(${f(a)} ${f(p[0])} ${f(p[1])})`},par)}})});
  open(k,t,1000,8,.3);return r}
/* hydrangeas: the woody stem ends in the head just above a pair of large toothed leaves (dried heads keep no leaves) */
function hydraPlant(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||18)*UPC,k=G(g),sc=['#3a4a28','#5a6e3c','#80965a','#b0c08a'],dry=kd==='dry';
  const r=lsHeadS(k,o,{D,w:D*.05,cols:dry?['#5a4a32','#7a6a4a','#9a8a68','#c0b090']:sc,op,rr:.5,nodes:dry?0:1,li:.35,lp:dry?.55:.72,opp:1,leafAng:74,side:null,aimK:.3,
    flower:(par,B)=>hydraHead(par,0,{Bf:B,noNeck:1,cm:o.cm,op,cw,col:o.col},kd,list),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.72,.88),.6,'#3f6a2e',pp,{wp:LS_OVATE,droop:.22,arch:.06,fold:.18,gloss:.3,par:1,face:.6});return pp}});
  open(k,t,1000,6,.3);return r}
/* gloriosa: a leafy climbing shoot; each upper leaf ends in a tendril; from the axils, long pedicels arching out, the flowers nodding with their tepals swept up; buds above, the shoot's tip with young leaves */
function gloriosaPlant(g,t,o){const cw=o.cw||cwNear(CW_GLOR,o.col)||CW_GLOR[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),B=frameOf(o,.3,true),sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'];
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.03,cols:sc,op,rr:.3,nodes:0,lp:.6,flower:(par,Bf,O,D2,op2)=>lilyFlower(par,Bf,O,D2,cw,op2,'gloriosa')});open(k,t,1000,8,.3);return r}
  const nN=4,nf=op<.3?0:op<.7?1:2,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.45))):1,li=D*.5*kr,rules={A:p=>p.n>0?[['F',{l:li*R(.85,1.15),w1:D*(.03+.004*p.n)}],['N',{i:p.n}],['/',{a:137.5}],['A',{n:p.n-1}]]:[['F',{l:D*.35,w1:D*.02}],['Lv',{tip:1}]],
    N:p=>{const fl=p.i>nN-nf,bu=!fl&&p.i>=nN-nf-1,out=[['[',{}],['&',{a:52+R(-8,8)}],['Lv',{i:p.i}],[']',{}]];
      if(fl||bu)out.push(['[',{w:D*.016}],['/',{a:120+R(-25,25)}],['&',{a:58+R(-10,10)}],['F',{l:D*(fl?.95:.7)*kr,w1:D*.014,e:-.1}],['K',{age:fl?1:.2,i:p.i}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:.05,seg:D*.18,T:[0,1,0],e:.02,w:D*.036}),Ks=res.organs.filter(q=>q.t==='K'),main=Ks.find(q=>q.p.age===1)||Ks[0]||res.organs[res.organs.length-1],apex=main.pos;
  for(const ch of res.chains)ch.c=sc;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=lsFrame(og,null,R(-.3,.3));return{parts:[{z:pos[2],fn:par=>{if(og.p.age<.5)lilyBud(par,Bf,pos,D*.55,cw,'gloriosa');else lilyFlower(par,Bf,pos,D*(og===main?1:.9),cw,op,'gloriosa')}}]}}
    if(og.t==='Lv')return{ext:1,parts:[lsLeaf2D(og,pos,D*(og.p.tip?.5:R(.85,1.05)),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.24,'#4a7a34',{side:.4,arch:12,par:1,gloss:.35,tendril:true}))]};return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* the greenhouse now grows these species as plants */
Object.assign(GH,{'dahlia-decoratif':(g,t,o)=>dahliaPlant(g,t,o,'dec',CW_DDEC),'dahlia-balle':(g,t,o)=>dahliaPlant(g,t,o,'bal',CW_DBAL),'dahlia-cactus':(g,t,o)=>dahliaPlant(g,t,o,'cac',CW_DCAC),'dahlia-lacinie':(g,t,o)=>dahliaPlant(g,t,o,'lac',CW_DLAC),
  'rose-standard':(g,t,o)=>rosePlant(g,t,o,'std',CW_RSTD),'rose-intermediaire-kenya':(g,t,o)=>rosePlant(g,t,o,'int',CW_RINT),'rose-de-jardin':(g,t,o)=>rosePlant(g,t,o,'jar',CW_RJAR),'rose-aspect-jardin':(g,t,o)=>rosePlant(g,t,o,'asp',CW_RASP),'rose-anglaise-david-austin':(g,t,o)=>rosePlant(g,t,o,'ang',CW_RANG),
  'oeillet-standard':(g,t,o)=>carnPlant(g,t,o,CW_CARN),
  'hortensia-boule':(g,t,o)=>hydraPlant(g,t,o,'mop',CW_HMOP),'hortensia-seche-stabilise':(g,t,o)=>hydraPlant(g,t,o,'dry',CW_HDRY),'hortensia-lacecap':(g,t,o)=>hydraPlant(g,t,o,'lace',CW_HLACE),'hortensia-paniculata':(g,t,o)=>hydraPlant(g,t,o,'pan',CW_HPAN),'hortensia-arborescens':(g,t,o)=>hydraPlant(g,t,o,'arb',CW_HARB),
  'gloriosa':gloriosaPlant});
/* their heads now carry their own top leaves: fewer leaves lower on the bouquet stem */
for(const id of['rose-standard','rose-intermediaire-kenya','rose-de-jardin','rose-aspect-jardin','rose-anglaise-david-austin'])if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[0,1]});
if(STEML['oeillet-standard'])STEML['oeillet-standard']=Object.assign({},STEML['oeillet-standard'],{n:[0,1]});if(STEML['gloriosa'])STEML['gloriosa']=Object.assign({},STEML['gloriosa'],{n:[0,1]});
for(const id of['dahlia-decoratif','dahlia-balle','dahlia-cactus','dahlia-lacinie','hortensia-boule','hortensia-lacecap','hortensia-paniculata','hortensia-arborescens'])if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[0,1]});
/* buds in the bouquets for the species that show them on the market */
for(const id of['dahlia-decoratif','dahlia-balle','dahlia-cactus','dahlia-lacinie','rose-standard','rose-intermediaire-kenya','rose-de-jardin','rose-aspect-jardin','rose-anglaise-david-austin','oeillet-standard','gloriosa'])GH_BUDS.add(id);
