/* ================= Serre, reprise 4 — les plantes poussent (L-système) : anthurium, arum, vanda, œillet spray, œillet de poète ================= */
/* anthurium and calla: one spathe on a long leafless peduncle (scape), which the L-system bends and lets wander a little; the spathe keeps its own frame along the stem */
function anthPlant(g,t,o){const cw=o.cw||cwNear(CW_ANTH,o.col)||CW_ANTH[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||12)*UPC,k=G(g),sc=['#2c4a1e','#4a7432','#79a352','#a8c97e'];
  const r=lsHeadS(k,o,{D,w:(o.sw||5)/10*UPC*1.1,cols:sc,op,rr:.6,axisFirst:true,nodes:0,lp:.95,wig:.035,flower:lsAsFlower(x3Anth2,Object.assign({},o,{cw}))});open(k,t,1000,10,.3);return r}
function callaPlant(g,t,o){const cw=o.cw||cwNear(CW_CALLA,o.col)||CW_CALLA[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||12)*UPC,k=G(g),green=mix('#4a7432','#7f9a52',.3),sc=['#2c4a1e',mix('#4a7432',green,.5),mix('#79a352',green,.4),'#a8c97e'];
  const r=lsHeadS(k,o,{D,w:(o.sw||9)/10*UPC*Math.sqrt(D/(12*UPC)),cols:sc,op,rr:.5,axisFirst:true,nodes:0,lp:.9,wig:.025,aimK:.18,flower:lsAsFlower(x3Calla2,Object.assign({},o,{cw}))});open(k,t,1000,10,.3);return r}
/* vanda: an upright raceme of large flat flowers, buds at its top */
ORP.vanda={list:CW_VANDA,cm:10,nf:[4,6],nb:2,pd0:.6,li:.6,ped:.3,pa:42,e:-.014,lean:10,sw:.06,grade:.06,bs:.28,flower:vandaFlower,scol:['#3a4a2a','#5a6e3e','#7f9058','#b0bc88']};
/* the spray carnation: a cyme; the top flower first, side shoots from the upper nodes ending in younger flowers and buds; narrow glaucous leaves on swollen nodes */
function carnSprayPlant(g,t,o){const cw=o.cw||cwNear(CW_CARS,o.col)||CW_CARS[0],op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||15)*UPC,D=Dh*.32,k=G(g),sc=['#2e4a3a','#5f7f6a','#88a894','#b4ccbc'];
  const r=lsHeadS(k,o,{D,w:D*.07,cols:sc,op,rr:.6,nodes:3,li:1.05,lp:1.15,opp:1,leafAng:30,side:{p:.9,n:1,top:3,len:1.35,ang:30,age:[0,.95]},budD:.38,budMax:.35,wig:.03,
    flower:(par,B,O,D2,op2)=>carnFlower(par,B,O,D2,cw,op2,{n:26}),bud:(par,B,O,s)=>carnFlower(par,B,O,s/.38*.5,cw,.14,{n:10}),young:(par,B,O,s,a)=>carnFlower(par,B,O,s,cw,.35+.6*a,{n:20}),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(1,1.3),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.09,'#7f9f8a',{side:og.p.j?.4:-.4,arch:14})),
    node:(og,pos)=>({z:pos[2]+.15,cast:false,fn:par=>{const p=[pos[0],-pos[1]],a=Math.atan2(-og.H[1],og.H[0])/D2R;E('ellipse',{cx:f(p[0]),cy:f(p[1]),rx:f(D*.05),ry:f(D*.065),fill:sc[1],stroke:sc[0],'stroke-width':.3,transform:`rotate(${f(a)} ${f(p[0])} ${f(p[1])})`},par)}})});
  open(k,t,1000,8,.3);return r}
/* sweet william: the flat head of florets sits on a pair of narrow leafy bracts, a pair of lance leaves lower down */
function barbPlant(g,t,o){const cw=o.cw||cwNear(CW_BARB,o.col)||CW_BARB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||10)*UPC,k=G(g),sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'];
  const r=lsHeadS(k,o,{D,w:D*.045,cols:sc,op,rr:1,nodes:1,li:.6,lp:.5,opp:1,leafAng:40,side:null,wig:.03,flower:lsAsFlower((gg,tt,oo)=>barbHead(gg,tt,oo,CW_BARB),Object.assign({},o,{cw})),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.6,.8),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.2,'#4a7a34',{side:og.p.j?.4:-.4,arch:12,par:1}))});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'anthurium-andraeanum':anthPlant,'arum-calla':callaPlant,'vanda':(g,t,o)=>orchidPlant(g,t,o,ORP.vanda),'oeillet-spray':carnSprayPlant,'oeillet-de-poete-dianthus':barbPlant});
for(const id of['oeillet-spray','oeillet-de-poete-dianthus'])if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[0,1]});
for(const id of['vanda','oeillet-spray','arum-calla','anthurium-andraeanum'])GH_BUDS.add(id);
