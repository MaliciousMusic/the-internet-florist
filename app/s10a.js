/* ================= Serre, lot 10 — Marguerites et cousines, grandies par le L-système : cosmos, scabieuse, anémone, pensée, échinacée ================= */
/* ---------- shared pieces of a capitulum ---------- */
/* a domed disc of tiny florets (the yellow eye of a cosmos, the cushion of a scabious): its projected dome, lit, sprinkled with its florets */
function capDisc(k,B,O,r,h,col,o={}){const pts=[];for(let i=0;i<=6;i++)for(let j=0;j<12;j++){const u=i/6*Math.PI/2,a=j/12*6.283,p=PJ(B,O,[Math.cos(a)*Math.sin(u)*r,Math.sin(a)*Math.sin(u)*r,Math.cos(u)*h]);pts.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(pts)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.35,'stroke-opacity':.5},k);if(LOD||!o.dots)return;
  let d='';const n=o.dots,rr=Math.max(.35,r*.07);for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n),a=i*2.39996,x=Math.cos(a)*q*r*.92,y=Math.sin(a)*q*r*.92,z=h*Math.sqrt(Math.max(0,1-q*q)),nz=toV(B,[x/r,y/r,1])[2];if(nz<.05)continue;const p=PJ(B,O,[x,y,z]);d+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
  if(d)E('path',{d,fill:o.dc||shd(col,-.35),opacity:.6},k)}
/* green involucral bracts behind a head (seen from the side or behind) */
function capBracts(k,B,O,R0,n,col,o={}){const it=[];for(let i=0;i<n;i++)it.push({l:ligule(B,O,{phi:i/n*6.283+R(-.2,.2),r0:R0*.6,z0:-R0*.15,L:R0*(o.len||.55),W:R0*(o.w||.12),wp:prof([[0,.8],[.5,1],[1,.08]]),a0:o.a0??2.2,a1:o.a1??2.6,tip:'point',th:.5,n:3}),c:col,ink:shd(col,-.5)});drawLig(k,it)}
/* a round bud in its involucre: bracts clasped round it, a little colour at its tip as it swells */
function capBud(k,B,O,s,col,age,bc='#5f8a40'){spBud(k,B,V3.add(O,toV(B,[0,0,-s*.25])),s*1.05,s*.95,mix(bc,col,.15+.6*age),{tp:.15,pw:.6});
  const it=[];for(let i=0;i<7;i++)it.push({l:ligule(B,O,{phi:i/7*6.283+R(-.2,.2),r0:s*.2,z0:-s*.3,L:s*.55,W:s*.16,wp:prof([[0,.8],[.5,1],[1,.08]]),a0:.25,a1:.15,tip:'point',th:1.2,n:3}),c:bc,ink:shd(bc,-.5)});drawLig(k,it)}
/* ---------- cosmos (Cosmos bipinnatus, C. sulphureus): eight broad rays notched at the tip round a yellow disc; a wiry branched stem, threadlike leaves, buds in green cups ---------- */
const CW_COS=[{id:'blanc',n:'Blanc (Purity)',c:'#f7f5ee'},{id:'rose-pale',n:'Rose pâle',c:'#f4c9d2',c2:'#e88aa8'},{id:'rose',n:'Rose',c:'#ec8fb4'},{id:'magenta',n:'Magenta (Dazzler)',c:'#c8205a'},
  {id:'rubis',n:'Rouge rubis',c:'#a8183a'},{id:'abricot',n:'Abricot',c:'#f2b48e',c2:'#e8906a'},{id:'picotee',n:'Blanc liseré de rose',c:'#f7f2f2',edge:'#d8306a'},{id:'rayures',n:'Blanc rayé de cerise',c:'#f7f2f2',streak:'#c8205a'},
  {id:'orange',n:'Orange (sulphureus)',c:'#f07a1e',k:'sul'},{id:'jaune',n:'Jaune d’or (sulphureus)',c:'#f6c030',k:'sul'},{id:'chocolat',n:'Chocolat',c:'#4a1a18',disc:'#2a0e0e'}];
const COS_RAY=prof([[0,.32],[.25,.78],[.65,1],[1,.92]]);
function cosmosFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),items=[],rot=R(0,6.28),sul=cw.k==='sul';if(nz<.45)capBracts(k,B,O,R0*.3,8,'#5f8a40');
  const n=sul?8:8;for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+R(-.08,.08),r0:R0*.2,z0:0,L:R0*(sul?.68:.76)*R(.94,1.04),W:R0*(sul?.24:.27),wp:COS_RAY,a0:.55+.65*o2,a1:.75+.8*o2,pw:1.3,th:.3,tip:'fringe',fr:3,fd:.28,wav:.12,wk:3,n:6,tw:R(-.2,.2)});
    let c=cw.c;if(cw.c2)c=mix(c,cw.c2,R(0,.35));items.push({l,c:mix(c,shd(c,R(-.1,.08)),.5),edge:cw.edge,ew:4,ewd:Math.max(.7,R0*.04),streak:cw.streak,mid:DET>=1.5?shd(c,-.2):null,mw:.4})}
  drawLig(k,items);if(nz>-.1)capDisc(k,B,O,R0*(sul?.24:.2),R0*.1,cw.disc||(sul?'#e8a020':'#e8b416'),{dots:DET>=1.5?60:30});return k}
function cosmosPlant(g,t,o){const cw=o.cw||cwNear(CW_COS,o.col)||CW_COS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'];
  const r=lsHeadS(k,o,{D,w:D*.04,cols:sc,op,rr:.5,nodes:2,li:.9,lp:1.6,opp:1,leafAng:48,side:{p:.75,n:1,top:2,len:1.45,ang:30,age:[0,.85]},budD:.24,budMax:.4,wig:.05,e:.05,
    flower:(par,B,O,D2,op2)=>{if(op2<.3)capBud(par,B,O,D2*.24,cw.c,.6);else cosmosFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a),young:(par,B,O,s,a)=>cosmosFlower(par,B,O,s,cw,.4+.6*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.75,1),(par,x,y,a,l)=>fineLeaf(par,x,y,a,l,'#4a7a38'))});
  open(k,t,1000,10,.3);return r}
/* ---------- scabious (Scabiosa atropurpurea, S. caucasica): the pincushion — a ring of frilled, uneven marginal florets, smaller ones inside, a dome of tiny florets bristling with pale pins ---------- */
const CW_SCAB=[{id:'noir',n:'Pourpre noir',c:'#3a0c1c',pin:'#f2ece8'},{id:'bordeaux',n:'Bordeaux',c:'#5a1030',pin:'#f4eef0'},{id:'vin',n:'Lie-de-vin',c:'#7a1f3c',pin:'#f4eef0'},{id:'framboise',n:'Framboise',c:'#a8285a',pin:'#f6eef2'},
  {id:'rose',n:'Rose',c:'#e8a2bc',pin:'#fbf2f6'},{id:'rose-poudre',n:'Rose poudré',c:'#f0c8d4',pin:'#fbf4f6'},{id:'lavande',n:'Lavande',c:'#a29bd2',pin:'#f2f0fa',dome:'#c8c2e8'},{id:'bleu',n:'Bleu (Fama)',c:'#8a8ed0',pin:'#eef0fa',dome:'#b8bce6'},
  {id:'blanc',n:'Blanc',c:'#f6f2ea',pin:'#ffffff',dome:'#e8e4c8'},{id:'creme',n:'Crème abricot',c:'#f2dcb8',pin:'#fff6e8',dome:'#e6c890'},{id:'saumon',n:'Saumon',c:'#f2a890',pin:'#fff2ea'}];
function scabFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),items=[],rot=R(0,6.28),dome=cw.dome||shd(cw.c,-.25);if(nz<.45)capBracts(k,B,O,R0*.5,10,'#6a8a50',{len:.5,w:.08});
  const n=10;for(let i=0;i<n;i++){const big=.8+.4*Math.abs(Math.sin(i*1.7+rot)),l=ligule(B,O,{phi:i/n*6.283+rot+R(-.1,.1),r0:R0*.32,z0:0,L:R0*.6*big,W:R0*.26*big,wp:prof([[0,.4],[.3,.85],[.7,1],[1,.7]]),a0:.9+.5*o2,a1:1.25+.4*o2,pw:1.3,th:.4,tip:'fringe',fr:3,fd:.55,wav:.55,wk:3,n:6,tw:R(-.4,.4)});
    items.push({l,c:mix(cw.c,shd(cw.c,R(-.12,.1)),.6)})}
  for(let i=0;i<12;i++){const l=ligule(B,O,{phi:i/12*6.283+rot+.26,r0:R0*.26,z0:R0*.06,L:R0*.32,W:R0*.14,wp:prof([[0,.4],[.4,1],[1,.6]]),a0:.6+.4*o2,a1:.9+.3*o2,pw:1.2,th:.5,tip:'fringe',fr:2,fd:.5,wav:.4,n:4});items.push({l,c:shd(cw.c,-.08)})}
  drawLig(k,items);if(nz>-.2){capDisc(k,B,O,R0*.34,R0*.28*(.6+.4*o2),dome,{dots:DET>=1.5?50:26,dc:shd(dome,-.4)});
    /* the pins: stamens and styles bristling from the dome, pale heads */
    if(!LOD){let ds='',dh='';const np=DET>=1.5?34:18,rh=Math.max(.45,R0*.035);for(let i=0;i<np;i++){const q=Math.sqrt((i+.5)/np),a=i*2.39996+rot,x=Math.cos(a)*q*R0*.3,y=Math.sin(a)*q*R0*.3,z=R0*.28*(.6+.4*o2)*Math.sqrt(Math.max(0,1-q*q)),n0=V3.nz([x,y,R0*.3]);
        if(toV(B,n0)[2]<0)continue;const a3=PJ(B,O,[x,y,z]),b3=PJ(B,O,V3.add([x,y,z],V3.sc(n0,R0*.12)));ds+=`M${f(a3[0])},${f(a3[1])}L${f(b3[0])},${f(b3[1])}`;dh+=`M${f(b3[0]-rh)},${f(b3[1])}a${f(rh)},${f(rh)} 0 1,0 ${f(2*rh)},0a${f(rh)},${f(rh)} 0 1,0 ${f(-2*rh)},0`}
      E('path',{d:ds,stroke:mix(cw.pin,dome,.4),'stroke-width':f(Math.max(.35,R0*.018)),fill:'none'},k);E('path',{d:dh,fill:cw.pin},k)}}
  return k}
function scabPlant(g,t,o){const cw=o.cw||cwNear(CW_SCAB,o.col)||CW_SCAB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||5)*UPC,k=G(g),sc=['#33502a','#55784a','#7c9c6c','#adc69e'];
  const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:.6,nodes:2,li:1.2,lp:2.1,opp:1,leafAng:40,side:{p:.6,n:1,top:2,len:1.7,ang:26,age:[0,.55]},budD:.34,budMax:.45,wig:.055,e:.05,
    flower:(par,B,O,D2,op2)=>{if(op2<.3)capBud(par,B,O,D2*.34,cw.c,.5,'#6a8a50');else scabFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a,'#6a8a50'),young:(par,B,O,s,a)=>scabFlower(par,B,O,s*1.4,cw,.45+.5*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(1,1.35),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.1,'#55784a',{side:og.p.j?.4:-.4,arch:10}))});
  open(k,t,1000,10,.3);return r}
/* ---------- anemone (Anemone coronaria): six to eight broad satin tepals, cupped, round a dark dome of pistils ringed with dark stamens (a white ring in some); the green ruff of cut bracts below the flower ---------- */
const CW_ANEM=[{id:'blanc',n:'Blanc à cœur noir (Mistral Bianco Centro Nero, Panda)',c:'#f7f5f0',eye:'#1e1628'},{id:'blanc-vert',n:'Blanc à cœur vert (The Bride)',c:'#f7f5f0',eye:'#5f7a40',st:'#2e3a28'},{id:'rouge',n:'Rouge à anneau blanc (Hollandia, Mistral Rosso)',c:'#c8102e',eye:'#1e1628',ring:'#f2ece8'},
  {id:'bleu',n:'Bleu violet (Mr Fokker, De Caen)',c:'#5b4aa8',eye:'#1e1628',ring:'#ece8f4'},{id:'lilas',n:'Lilas (Harmony Lavender)',c:'#b8a2d8',eye:'#2a2440',ring:'#f2eef8'},{id:'fuchsia',n:'Fuchsia (Mistral Fucsia, Sylphide)',c:'#d81f7a',eye:'#1e1628'},
  {id:'rose-pale',n:'Rose pâle (Mistral Rosa Chiaro)',c:'#f2c4cf',eye:'#2a2440'},{id:'saumon',n:'Rose saumon',c:'#f2a8a0',eye:'#2a2030'},{id:'bordeaux',n:'Bordeaux (Mistral Bordeaux)',c:'#6b0f2a',eye:'#160c14'},
  {id:'prune',n:'Prune noire',c:'#2a1028',eye:'#0e0810'},{id:'bicolore',n:'Blanc cerclé de rouge (Bicolor)',c:'#f6eef0',eye:'#1e1628',ring:'#c8203a',rb:1},
  {id:'bleu-roi',n:'Bleu roi (Mistral Blu)',c:'#4c34bc',eye:'#1a1838',late:1},{id:'bleu-lavande',n:'Bleu lavande (Galilee Blue)',c:'#9078d6',eye:'#1e1a36',late:1},
  {id:'azzurro',n:'Lavande à cœur blanc (Mistral Azzurro)',c:'#9e66cf',eye:'#221a34',late:1},{id:'bleu-blanc',n:'Blanc à cœur bleu (Rainbow Blue/White)',c:'#f2f0f6',eye:'#1c1834',late:1},
  {id:'rose-vif',n:'Rose vif (Galilee Pink)',c:'#e577bd',eye:'#221628',late:1},{id:'rarity',n:'Mauve rosé (Mistral Rarity)',c:'#c480a0',eye:'#24142a',late:1},
  {id:'ecarlate',n:'Écarlate (Galilee Red)',c:'#ee1414',eye:'#141018',late:1},{id:'rouge-blanc',n:'Rouge et blanc (Rainbow Red/White)',c:'#e91047',eye:'#1c1430',late:1},
  {id:'tigre',n:'Blanc flammé de rouge (Mistral Tigre)',c:'#d3053d',eye:'#160c18',late:1},{id:'tigre-vin',n:'Blanc flammé de pourpre (Mistral Tigre Wine)',c:'#f2eef4',eye:'#1a1424',late:1},
  {id:'raisin',n:'Raisin à œil bleu (Mistral Grape)',c:'#86205e',eye:'#141020',late:1},{id:'blush',n:'Blanc rosé (Mistral Blush)',c:'#f6ece8',eye:'#221a28',late:1}];
const ANE_TEP=prof([[0,.42],[.3,.9],[.65,1],[1,.62]]),D2R=Math.PI/180;
function anemFlower(par,B,O,D,cw,op){if(typeof anemSvgPut==='function'){const k=G(par);if(anemSvgPut(k,B,O,D,cw,op))return k;par.removeChild(k)}return anemDrawn(par,B,O,D,cw,op)}
function anemDrawn(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=R(0,6.28),cache={};
  for(let w=0;w<2;w++){const n=w?3:6;for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+(w?.5:0)+R(-.1,.1),r0:R0*.1,z0:w?R0*.03:0,L:R0*(w?.72:.86)*R(.95,1.04),W:R0*(w?.32:.4),wp:ANE_TEP,a0:.35+.75*o2-(w?.15:0),a1:.55+.95*o2-(w?.2:0),pw:1.3,th:.55,tip:'round',wav:.1,wk:3,n:6,tw:R(-.2,.2)});
    it.push({l,c:cw.c,cb:mix(cw.c,'#e8e4d8',.25),lift:.3,basec:cw.ring&&!cw.rb?cw.ring:null,bf:.3,bo:.8})}}
  spPetals(k,it,cache);if(cw.rb&&nz>.1&&!LOD)E('path',{d:smooth(spDisc(B,O,R0*.5,R0*.05)),fill:'none',stroke:cw.ring,'stroke-width':f(R0*.18),'stroke-opacity':.85},k);
  if(nz>-.15&&o2>.15){if(!LOD){let d='',fl='';const ns=DET>=1.5?40:22,rr=Math.max(.45,R0*.04);for(let i=0;i<ns;i++){const a=i*2.39996+rot,q=.28+.14*((i*.618)%1),p=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*(.08+.05*(1-q))]),p0=PJ(B,O,[Math.cos(a)*R0*.18,Math.sin(a)*R0*.18,R0*.1]);d+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;fl+=`M${f(p0[0])},${f(p0[1])}L${f(p[0])},${f(p[1])}`}
      E('path',{d:fl,stroke:cw.st||cw.eye,'stroke-width':f(Math.max(.55,rr*.7)),'stroke-opacity':.85,fill:'none'},k);E('path',{d,fill:cw.st||cw.eye,opacity:.9},k)}
    capDisc(k,B,O,R0*.22,R0*.2,cw.eye,{dots:DET>=1.5?24:0,dc:shd(cw.eye,.3)})}
  return k}
function anemPlant(g,t,o){const cw=o.cw||cwNear(CW_ANEM,o.col)||CW_ANEM[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),sv=typeof svaStemCols==='function'&&SV_ON,sc=sv?svaStemCols(['#33532a','#5a8644','#86ae68','#bcd8a2']):['#33502a','#527a40','#7a9e62','#a8c890'];
  const r=lsHeadS(k,o,{D,w:D*.06,cols:sc,op,rr:.6,nodes:1,li:.9,lp:.55,whorl:3,leafAng:62,side:null,wig:sv?.09:.05,e:.05,aimK:.28,
    flower:(par,B,O,D2,op2)=>{if(op2<.3&&!sv){spBud(par,B,V3.add(O,toV(B,[0,0,-D2*.12])),D2*.42,D2*.38,mix(cw.c,'#7f9f5a',.25),{tp:.3,pw:.55});return}anemFlower(par,B,O,D2,cw,op2)},
    leaf:(og,pos)=>{if(sv){const len=D*R(.5,.65);return{z:pos[2],cast:false,fn:par=>svaBract3(par,og,pos,len,svSeed('collerette',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(og.H[0]*40)),svaLife())}}return lsLeaf2D(og,pos,D*R(.5,.65),(par,x,y,a,l)=>fineLeaf(par,x,y,a,l,'#4a7a38'))}});
  open(k,t,1000,10,.3);return r}
/* ---------- pansy (Viola × wittrockiana): five velvety petals, two upright behind, two at the sides, the broad lower one in front; the face (blotch), the whiskers, the yellow eye ---------- */
const CW_PANS=[{id:'violet',n:'Violet à face',c:'#5a2a9a',bl:'#1e0e2a',top:'#6a38a8'},{id:'jaune',n:'Jaune à face',c:'#ecd21e',bl:'#3a1a3a',top:'#f2dc40'},{id:'jaune-clair',n:'Jaune clair',c:'#f2e070',wh:1},
  {id:'bleu',n:'Bleu à face',c:'#4f62c0',bl:'#141838',top:'#5a72cc'},{id:'bleu-ciel',n:'Bleu ciel',c:'#8fa6e2',wh:1,top:'#a8bcea'},{id:'pourpre',n:'Pourpre',c:'#8a1a5a',bl:'#2a0818'},
  {id:'blanc',n:'Blanc à face',c:'#f2f0ec',bl:'#3a2a4a'},{id:'blanc-clair',n:'Blanc',c:'#f4f2ec',wh:1},{id:'lavande',n:'Lavande',c:'#a99ee0',wh:1,top:'#b8aee8'},
  {id:'orange',n:'Orange',c:'#e0661e',wh:1,top:'#e87a2a'},{id:'rouge',n:'Rouge à face',c:'#b81a1e',bl:'#2a0808'},{id:'noir',n:'Noir velours',c:'#2a1e30',wh:0},
  {id:'violet-jaune',n:'Violet et jaune',c:'#f0d030',bl:'#3a1a4a',top:'#6a38a8'},{id:'mauve',n:'Mauve rosé',c:'#c890b8',bl:'#4a1a3a',top:'#d8a8c8'}];
function pansyFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],cache={},a0=.95+.4*o2,a1=1.3+.25*o2,pc=[];
  const P5=[[90+26,.72,.44,cw.top||cw.c,-.03],[90-26,.72,.44,cw.top||cw.c,-.03],[205,.64,.37,cw.c,0],[335,.64,.37,cw.c,0],[270,.74,.54,cw.c,.03]];
  P5.forEach(([ph,Lk,Wk,c,dz],j)=>{const l=ligule(B,O,{phi:ph*D2R+R(-.05,.05),r0:R0*.06,z0:R0*dz,L:R0*Lk,W:R0*Wk,wp:prof([[0,.35],[.25,.85],[.6,1],[1,.75]]),a0,a1,pw:1.2,th:.25,tip:'round',wav:.16,wk:3,n:6,tw:R(-.15,.15)});pc.push(l);
    it.push({l,c,cb:mix(c,'#e8e4d8',.2),lift:.35,basec:cw.bl&&j>1?cw.bl:null,bf:j===4?.62:.55,bo:.95})});
  spPetals(k,it,cache);if(LOD||nz<.05)return k;
  /* whiskers on the three lower petals, then the eye */
  let d='';for(const l of pc.slice(2)){const n=l.S.length-1;for(const c of[1,2,3]){const q=[];for(let i=0;i<=3;i++){const ii=Math.round(i/3*n*.45);q.push([l.S[ii][c][0],l.S[ii][c][1]])}d+=smooth(q,false)}}
  E('path',{d,stroke:cw.wh===0?'#000':cw.bl||shd(cw.c,-.7),'stroke-width':f(Math.max(.35,R0*.025)),'stroke-opacity':cw.bl?.6:.75,fill:'none','stroke-linecap':'round'},k);
  const e=PJ(B,O,[0,-R0*.04,R0*.06]),er=R0*.09;E('path',{d:`M${f(e[0]-er)},${f(e[1])}a${f(er)},${f(er*.8)} 0 1,0 ${f(2*er)},0a${f(er)},${f(er*.8)} 0 1,0 ${f(-2*er)},0`,fill:'#f4d23c',stroke:'#b88a10','stroke-width':.3},k);return k}
function pansyPlant(g,t,o){const cw=o.cw||cwNear(CW_PANS,o.col)||CW_PANS[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6.5)*UPC,k=G(g),sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'];
  const r=lsHeadS(k,o,{D,w:D*.045,cols:sc,op,rr:.4,nodes:0,lp:1.5,aimK:.32,wig:.06,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){spBud(par,B,V3.add(O,toV(B,[0,0,-D2*.15])),D2*.4,D2*.26,mix(cw.c,'#6f9a4a',.35),{tp:.5,pw:.6});return}pansyFlower(par,B,O,D2,cw,op2)}});
  open(k,t,1000,10,.3);return r}
/* ---------- echinacea: narrow rays drooping round a raised, bristling cone (the cone alone as a seed head) ---------- */
const CW_ECH=[{id:'pourpre',n:'Rose pourpre',c:'#c45a8e',cone:'#b0581e'},{id:'blanc',n:'Blanc (White Swan)',c:'#f4f1e4',cone:'#c8902e'},{id:'rose',n:'Rose',c:'#ef8ab6',cone:'#a85a20'},
  {id:'orange',n:'Orange',c:'#ef8a3c',cone:'#8a4a18'},{id:'rouge',n:'Rouge',c:'#b42a5a',cone:'#7a3a18'},{id:'jaune',n:'Jaune',c:'#f1e2a2',cone:'#b8862a'},{id:'vert',n:'Vert (Green Jewel)',c:'#b8c890',cone:'#6a8a38'},
  {id:'cone',n:'Cône séché',c:'#5a2a18',cone:'#4a2412',seed:1}];
function echFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),items=[],rot=R(0,6.28),ch=R0*(cw.seed?.42:.36);
  if(!cw.seed){if(nz<.4)capBracts(k,B,O,R0*.35,10,'#4a6a30');const n=Math.round(14*(LOD?.7:1));for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+R(-.07,.07),r0:R0*.26,z0:-R0*.02,L:R0*.68*R(.94,1.05),W:R0*.13,wp:prof([[0,.5],[.3,.9],[.8,1],[1,.5]]),a0:.9+.75*o2,a1:1.2+.9*o2,pw:1.2,th:.35,tip:'fringe',fr:2,fd:.3,n:6,tw:R(-.3,.3)});
      items.push({l,c:mix(cw.c,shd(cw.c,R(-.1,.08)),.5),mid:DET>=1.5?shd(cw.c,-.15):null,mw:.4})}drawLig(k,items)}
  if(nz>-.3){capDisc(k,B,O,R0*.3,ch,cw.cone,{dots:0});if(!LOD){let d='',dl='';const ns=DET>=1.5?80:40;for(let i=0;i<ns;i++){const q=Math.sqrt((i+.5)/ns),a=i*2.39996,x=Math.cos(a)*q*R0*.28,y=Math.sin(a)*q*R0*.28,z=ch*Math.sqrt(Math.max(0,1-q*q)),n0=V3.nz([x,y,R0*.3]);if(toV(B,n0)[2]<.05)continue;
      const a3=PJ(B,O,[x,y,z]),b3=PJ(B,O,V3.add([x,y,z],V3.sc(n0,R0*.05)));d+=`M${f(a3[0])},${f(a3[1])}L${f(b3[0])},${f(b3[1])}`;if(V3.dot(toV(B,n0),LIGHT)>.3)dl+=`M${f(b3[0])},${f(b3[1])}l.3,.3`}
    E('path',{d,stroke:shd(cw.cone,-.45),'stroke-width':f(Math.max(.5,R0*.03)),fill:'none','stroke-linecap':'round'},k);if(dl)E('path',{d:dl,stroke:shd(cw.cone,.5),'stroke-width':f(Math.max(.4,R0*.02)),fill:'none','stroke-linecap':'round'},k)}}
  return k}
function echPlant(g,t,o){const cw=o.cw||cwNear(CW_ECH,o.col)||CW_ECH[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||11)*UPC,k=G(g),sc=['#2a4420','#466a30','#6c9046','#a2bc7a'];
  const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:.5,nodes:1,li:.6,lp:1.05,opp:0,leafAng:42,side:{p:.25,n:1,top:1,len:.8,ang:30,age:[0,.4]},budD:.3,wig:.03,
    flower:(par,B,O,D2,op2)=>{if(op2<.3&&!cw.seed){capBud(par,B,O,D2*.3,'#6a8a3a',.3,'#4a6a30');return}echFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,'#6a8a3a',a,'#4a6a30'),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(.8,1),(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,.22,'#3f6a2c',{side:.4,arch:10,par:1}))});
  open(k,t,1000,10,.3);return r}
Object.assign(GH,{'cosmos':cosmosPlant,'scabieuse':scabPlant,'anemone-coronaria':anemPlant,'pensee':pansyPlant,'echinacea':echPlant});
Object.assign(CWS,{'cosmos':CW_COS,'scabieuse':CW_SCAB,'anemone-coronaria':CW_ANEM,'pensee':CW_PANS,'echinacea':CW_ECH});
Object.assign(SZG,{'cosmos':[6,7,7,8,9],'scabieuse':[4,4.5,5,5,5.5],'anemone-coronaria':[5,6,7,7,8],'pensee':[5,6,6.5,7],'echinacea':[9,10,11,12]});
Object.assign(GHI,{'cosmos':{form:'disque',size:1.8,k:'head',rk:1},'scabieuse':{form:'disque',size:1.6,k:'head',rk:1},'anemone-coronaria':{form:'disque',size:2,k:'head',rk:1},'pensee':{form:'disque',size:1.6,k:'head',rk:1},'echinacea':{form:'disque',size:2.5,k:'head',rk:.9}});
for(const id of['cosmos','scabieuse','anemone-coronaria','pensee','echinacea'])GH_BUDS.add(id);
