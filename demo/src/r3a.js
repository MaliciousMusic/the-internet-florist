/* ================= Serre, reprise 3 — les orchidées en tige poussent (L-système) : phalaenopsis, cymbidium, cymbidium mini, dendrobium, mokara ================= */
/* an orchid spray: the peduncle rises, the raceme arches under its own weight (gravitropism after the first flowers), flowers alternate along it on short pedicels,
   all turned to face the same side (resupinate, lip down), the oldest at the base; buds toward the tip on curving pedicels, ever smaller and greener.
   Rules: S → F(peduncle) A(0)   A(i<n) → F(li) [ /φ &α F(pedicel, e) K(age_i) ] /(180±δ) A(i+1)   A(n) → F(tip) */
function orchidPlant(g,t,o,P){const cw=o.cw||cwNear(P.list.filter(x=>!x.late),o.col)||P.list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||P.cm)*UPC,k=G(g),sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*P.sw*1.4,cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B,O,D2,op2)=>P.flower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nf=op<.3?0:op<.7?Math.max(1,Math.ceil(P.nf[0]*.5)):Math.round(R(P.nf[0],P.nf[1])),nb=P.nb+(op<.3?2:0),n=nf+nb,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(P.pd0+.5)))):1,li=D*P.li*kr,sd=rnd()<.5?-1:1;
  /* the raceme leans to one side as it leaves the peduncle; its weight does the rest */
  const rules={S:()=>[['F',{l:D*P.pd0*kr,w0:D*P.sw*1.5,w1:D*P.sw*1.3,e:.02}],['+',{a:sd*(P.lean||22)*R(.8,1.2)}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.5,w1:D*P.sw*.5,e:P.e}]];const fl=p.i<nf,age=fl?1-.1*p.i:.34*(1-(p.i-nf)/Math.max(1,nb)),q=p.i/Math.max(1,n-1);
      return[['F',{l:li*(fl?1:.62)*R(.9,1.1),w1:D*P.sw*(1.25-.6*q),e:p.i?P.e:.01}],['[',{w:D*P.sw*.55}],['/',{a:(p.i%2?90:-90)*sd+R(-15,15)}],['&',{a:(fl?P.pa:P.pa*.7)+R(-6,6)}],['F',{l:D*(fl?P.ped:P.ped*.75)*kr,w1:D*P.sw*.45,e:fl?.05:-.04}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:R(-12,12)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.025,seg:D*.12,T:[0,1,0],e:.01,w:D*P.sw*1.5});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  /* every flower of the spray faces the same side, its lip down: its axis between the spray's face and its pedicel, its top toward the sky */
  const fFrame=og=>{const Z=V3.nz(V3.add(V3.add(V3.sc(face,.82),V3.sc(og.H,.3)),[R(-.08,.08),R(-.06,.06),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.12,.12),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  const organ=(og,pos)=>{
    if(og.t==='K'){const sz=1-P.grade*og.p.i/Math.max(1,nf),Bf=fFrame(og);return{parts:[{z:pos[2],fn:par=>P.flower(par,Bf,pos,D*sz,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=lsFrame(og,null,0),s=D*P.bs*(.45+1.6*a);return{parts:[{z:pos[2],fn:par=>phalBud(par,Bf,pos,s,{c:P.budc?P.budc(cw,a):mix(cw.c,'#b8c48a',.55-.8*a)})}]}}
    return null};
  /* a sort drawn by the SVG kit (P.sv: the phalaenopsis, y-phalaenopsis.js) is handed the old drawing (old(par): its chance, its box) */
  if(P.sv&&SV_ON)return P.sv(k,t,o,P,{res,apex,op,cw,D,face,up,sd,old:par=>lsPlant(par,res,{O:[0,0,0],apex,cols:sc,organ})});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}
const ORP={
  phalaenopsis:{list:CW_PHAL,cm:9,nf:[3,5],nb:3,pd0:.85,li:.5,ped:.32,pa:48,e:-.11,lean:34,sw:.045,grade:.07,bs:.3,flower:(par,B,O,D,cw,op)=>phalFlower(par,B,O,D,cw,op,0),scol:['#2e3f22','#4a5e30','#6c7f44','#9fb070']},
  'cymbidium-grandes-fleurs':{list:CW_CYMB,cm:9,nf:[3,5],nb:2,pd0:.7,li:.62,ped:.3,pa:44,e:-.05,lean:22,sw:.06,grade:.06,bs:.34,flower:(par,B,O,D,cw,op)=>cymbFlower(par,B,O,D,cw,op),scol:['#2e3f22','#4f6534','#76884a','#a8b878']},
  'cymbidium-mini':{list:CW_CYMI,cm:5.5,nf:[5,8],nb:3,pd0:.8,li:.55,ped:.32,pa:46,e:-.06,lean:24,sw:.05,grade:.1,bs:.34,flower:(par,B,O,D,cw,op)=>cymbFlower(par,B,O,D,cw,op)},
  'dendrobium-coupe':{list:CW_DEND,cm:6.5,nf:[5,7],nb:4,pd0:.8,li:.52,ped:.34,pa:50,e:-.075,lean:28,sw:.045,grade:.14,bs:.3,flower:dendFlower},
  mokara:{list:CW_MOK,cm:7,nf:[5,6],nb:3,pd0:.7,li:.55,ped:.3,pa:44,e:-.03,lean:16,sw:.05,grade:.08,bs:.26,flower:mokFlower}};
Object.assign(GH,{'phalaenopsis':(g,t,o)=>orchidPlant(g,t,o,ORP.phalaenopsis),'cymbidium-grandes-fleurs':(g,t,o)=>orchidPlant(g,t,o,ORP['cymbidium-grandes-fleurs']),
  'cymbidium-mini':(g,t,o)=>orchidPlant(g,t,o,ORP['cymbidium-mini']),'dendrobium-coupe':(g,t,o)=>orchidPlant(g,t,o,ORP['dendrobium-coupe']),'mokara':(g,t,o)=>orchidPlant(g,t,o,ORP.mokara)});
for(const id of['phalaenopsis','cymbidium-grandes-fleurs','cymbidium-mini','dendrobium-coupe','mokara'])GH_BUDS.add(id);
