/* ================= Serre, lot 7 — Œillets (standard, spray, de poète), nérine, agapanthe ================= */
/* draw a list of ligule-like items far to near: {l (from ligule), c colour, edge, streak, mid (midline colour), ink} — one path each, toned by its facing, the shared floret shading on top */
function drawLig(k,items,o={}){items.sort((a,b)=>a.l.z-b.l.z);const ov=floretShade(),cache={};
  for(const it of items){const l=it.l,back=l.nm[2]<0,cc=back?mix(it.c,o.back||'#e8e4d8',.2):it.c,I=lightI(back?V3.sc(l.nm,-1):l.nm)*(it.ao||1),key=cc+Math.round(I*14);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1]}
    const d=smooth(l.out);E('path',{d,fill:it.flat||tone[0],stroke:it.ink||tone[1],'stroke-width':it.sw||.45,'stroke-opacity':.7},k);if(it.flat||LOD)continue;if(l.out.length>8&&!it.noov)E('path',{d,fill:ov},k);
    if(it.mid&&!back){const q=l.S.map(r=>[r[2][0],r[2][1]]);E('path',{d:smooth(q.slice(0,-1),false),stroke:it.mid,'stroke-width':f(it.mw||.6),'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},k)}
    if(it.streak&&!back){let sd='';for(const j of[1,3]){const q=l.S.map(r=>[r[j][0],r[j][1]]);sd+=smooth(q,false)}E('path',{d:sd,stroke:it.streak,'stroke-width':.7,'stroke-opacity':.8,fill:'none'},k)}
    if(it.edge&&!back){const n=l.out.length,h=Math.floor(n/2),tp=l.out.slice(Math.max(0,h-(it.ew||5)),Math.min(n,h+(it.ew||5)+1));if(tp.length>3)E('path',{d:smooth(tp,false),stroke:it.edge,'stroke-width':f(it.ewd||1.4),'stroke-opacity':.9,fill:'none','stroke-linejoin':'round'},k)}}}
/* ---------- carnation: a loose dome of fan petals with serrated, frilled margins, out of a glaucous tubular calyx with bracts at its base ---------- */
const CW_CARN=[
 {id:'blanc',n:'Blanc',c:'#f8f6ee'},{id:'creme',n:'Crème',c:'#f4e8c8'},{id:'jaune',n:'Jaune',c:'#f4d23a'},{id:'peche',n:'Pêche',c:'#f6b890'},{id:'orange',n:'Orange',c:'#f08a2a'},
 {id:'rose-clair',n:'Rose clair',c:'#f4c0cc'},{id:'rose',n:'Rose',c:'#ec7fa0'},{id:'cerise',n:'Cerise (Bizet)',c:'#d8205a'},{id:'fuchsia',n:'Fuchsia',c:'#c81c78'},{id:'rouge',n:'Rouge',c:'#c41f2e'},
 {id:'cramoisi',n:'Cramoisi',c:'#8a0a22'},{id:'lavande',n:'Lavande',c:'#b8a4d4'},{id:'violet',n:'Violet',c:'#7a3a8a'},{id:'pourpre',n:'Pourpre',c:'#7a2a6a'},{id:'vert',n:'Vert (Goblin)',c:'#b5cf6a'},
 {id:'menthe',n:'Vert menthe',c:'#cfe2b8'},{id:'brun',n:'Tons terre',c:'#b0785a',edge:'#e8c0a0'},{id:'peppermint',n:'Blanc strié de rouge',c:'#faf4f2',streak:'#c8203a'},
 {id:'antigua',n:'Jaune liseré de rouge',c:'#f4d23a',edge:'#c41f2e'},{id:'picotee',n:'Blanc liseré de pourpre',c:'#f8f4f2',edge:'#8a1a6a'},{id:'bacarat',n:'Pourpre bicolore',c:'#f2e0ec',edge:'#7a1a5a',c2:'#9a2a7a'}];
const CW_CARS=[
 {id:'blanc',n:'Blanc',c:'#f7f5ee'},{id:'champagne',n:'Champagne',c:'#f0dcc0'},{id:'jaune',n:'Jaune',c:'#f5d22c'},{id:'orange',n:'Orange',c:'#f08a2a'},{id:'rose',n:'Rose',c:'#f2b8c8'},
 {id:'cerise',n:'Cerise',c:'#e2457e'},{id:'rouge',n:'Rouge',c:'#c41f2e'},{id:'pourpre',n:'Pourpre',c:'#8a2a7a'},{id:'vert',n:'Vert (Broccoli)',c:'#b5cf6a'},{id:'bicolore',n:'Bicolore liseré',c:'#f6eef0',edge:'#d0306a'}];
const CARN_WP=prof([[0,.1],[.3,.22],[.6,.62],[.85,.92],[1,1]]);
function carnCalyx(F,R,op,cw){const cg=['#55786a','#7f9f8a','#a8c4b2'],L=R*(op<.4?.95:.62),r=R*(op<.4?.24:.15);
  F.parts.push(tube3(F,[[0,0,-L],[0,0,-L*.5],[0,0,-R*.02]],q=>r*(.82+.18*q),{cols:[cg[0],cg[1],cg[2]],cap:0,hl:.35,dk:.45,spec:.2,ink:'#2e4a3a',eo:.35,cast:0,zb:-R*.4}));
  /* fine striations on the calyx and its five pointed teeth; the epicalyx bracts at its base */
  const ln=[];for(let i=0;i<10;i++){const a=i/10*6.283,q=[0,.3,.6,.95].map(s=>PJ(F.B,F.O,[Math.cos(a)*r*(.85+.15*s),Math.sin(a)*r*(.85+.15*s),-L+L*s*.98]));if(toV(F.B,[Math.cos(a),Math.sin(a),0])[2]>0)ln.push(q)}
  F.parts.push({z:PJ(F.B,F.O,[0,0,-L*.5])[2]+R*.01-R*.4,fn:par=>{if(LOD)return;E('path',{d:ln.map(q=>smooth(q.map(p=>[p[0],p[1]]),false)).join(''),stroke:'#4a6a5a','stroke-width':.4,'stroke-opacity':.45,fill:'none'},par)}});
  const items=[];for(let i=0;i<5;i++)items.push({l:ligule(F.B,F.O,{phi:i/5*6.283+.3,r0:r*.95,z0:-R*.04,L:R*.12,W:r*.5,wp:prof([[0,1],[.6,.6],[1,.05]]),a0:.15,a1:.3,tip:'point',th:.3}),c:cg[1],ink:'#2e4a3a'});
  for(let i=0;i<4;i++)items.push({l:ligule(F.B,F.O,{phi:i/4*6.283,r0:r*.9,z0:-L,L:R*.16,W:r*.35,wp:prof([[0,1],[.5,.7],[1,.05]]),a0:.25,a1:.15,tip:'point',th:.3}),c:cg[0],ink:'#2e4a3a'});
  F.parts.push({z:PJ(F.B,F.O,[0,0,-R*.05])[2]-R*.38,fn:par=>drawLig(par,items)});return L}
function carnFlower(par,B,O,D,cw,op,o={}){const k=G(par),R=D/2,F={k,B,O,parts:[]},o2=sm01((op-.15)/.85),bud=op<.4,N=Math.round((bud?10:o.n||40)*(LOD?.6:1));
  const Lc=carnCalyx(F,R,op,cw);drawParts(k,F.parts);const items=[];
  for(let i=0;i<N;i++){const f0=(i+.5)/N,f=Math.sqrt(f0),ph=i*2.39996+(o.rot||0);
    const a0=bud?.05:.22+(1.15-.22)*f*f*o2,a1=bud?.1+.05*f:.45+(1.78-.45)*Math.pow(f,1.3)*o2,L=R*(bud?.3:.48+.5*f)*(.9+.2*Math.sin(i*3.7)),W=R*(bud?.12:.2+.18*f);
    const l=ligule(B,O,{phi:ph,r0:R*.1*(bud?.8:1),z0:-R*.02,L,W,wp:CARN_WP,a0,a1,pw:1.3,th:.5,tip:'fringe',fr:bud?3:6,tw:Math.sin(i*5.1)*.7,wav:bud?0:.35,wk:3,n:8});
    let c=cw.c;if(cw.c2)c=mix(c,cw.c2,.6*(1-f));c=mix(c,shd(c,Math.sin(i*2.3)*.12),.6);items.push({l,c,edge:cw.edge,ew:4,ewd:Math.max(.7,R*.028),streak:cw.streak,ao:.78+.22*f})}
  drawLig(k,items);return{k,Lc}}
function carnHead(g,t,o,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),B=frameOf(o,1),R0=D/2;
  /* the stem continues the calyx and bends into its direction */
  const F={B,O:[0,0,0],parts:[]},nkp=neckPart(B,[0,0,0],[0,0,-R0*(op<.4?.95:.62)],[0,0,-1],D*.62,D*.05,{cols:['#2e4a3a','#5f7f6a','#88a894']});F.parts.push(nkp.part);drawParts(k,F.parts);
  carnFlower(k,B,[0,0,0],D,cw,op);open(k,t,1000,8,.3);return neckOut(nkp)}
/* the spray: a branched stem with three to five little carnations at different stages and pointed buds */
function carnSprayHead(g,t,o,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||15)*UPC,d=Dh*.32,k=G(g),Bc=frameOf(o,.4,true),sd=o.side??(rnd()<.5?-1:1);
  const node=[0,-Dh*.28,-d*.4],ends=[[0,Dh*.1,0,1],[sd*Dh*.28,-Dh*.02,-d*.3,.8],[-sd*Dh*.26,Dh*.04,-d*.2,.6],[sd*Dh*.1,Dh*.3,-d*.5,.2],[-sd*Dh*.1,-Dh*.1,d*.3,.45]];
  const F={B:Bc,O:[0,0,0],parts:[]},sc=['#3a5a4a','#6f8f7a','#8aa894'],nkp=neckPart(Bc,[0,0,0],node,[0,-1,0],Dh*.42,d*.1,{cols:['#2e4a3a',sc[1],sc[2]]});F.parts.push(nkp.part);
  for(const e of ends){const P=[node,V3.add(node,[e[0]*.2,Dh*.08,0]),V3.add(e,[0,-d*.6,-d*.2]),V3.add(e,[0,-d*.4,-d*.1])],pts=[];for(let i=0;i<=8;i++){const q=i/8,a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,dd=q**3;pts.push([0,1,2].map(m=>a*P[0][m]+b*P[1][m]+c*P[2][m]+dd*P[3][m]))}
    F.parts.push(tube3(F,pts,d*.03,{cols:[sc[1],sc[2]],cap:0,hl:.3,dk:.4,spec:.1,ink:sc[0],eo:.25,cast:0}))}
  drawParts(k,F.parts);ends.sort((a,b)=>toV(Bc,a)[2]-toV(Bc,b)[2]);
  for(const e of ends){const st=Math.min(op,e[3]),Bf=frameIn(Bc,V3.nz([e[0]/Dh*.9,.25+e[1]/Dh*.6,1]),R(-1,1));carnFlower(k,Bf,toV(Bc,e),d*(st<.4?.9:1),cw,st,{n:28})}
  open(k,t,1000,8,.3);return neckOut(nkp)}
/* ---------- sweet william (Dianthus barbatus): a flat corymb of little five-petalled toothed flowers with an eye, threadlike bracts between; 'Green Trick' is a mossy ball of bracts ---------- */
const CW_BARB=[
 {id:'blanc',n:'Blanc',c:'#f7f5ee',eye:'#e8d0d8'},{id:'saumon',n:'Saumon',c:'#f29a88',eye:'#c8504a'},{id:'corail',n:'Corail',c:'#f07a6a',eye:'#b8303a'},{id:'rose',n:'Rose',c:'#e98fb0',eye:'#b8306a'},
 {id:'rose-magic',n:'Blanc virant au rose',c:'#f6e6ea',c2:'#e870a0',eye:'#c04a7a'},{id:'cerise',n:'Cerise néon',c:'#c8204a',eye:'#7a0a2a'},{id:'ecarlate',n:'Écarlate',c:'#d8202e',eye:'#8a0a18'},
 {id:'rouge',n:'Rouge',c:'#b8182a',eye:'#6a0414'},{id:'rouge-noir',n:'Rouge noir (Black Cherry)',c:'#4a0c1e',eye:'#2a0410'},{id:'pourpre',n:'Pourpre',c:'#9a2a7a',eye:'#5a0a48'},
 {id:'neon',n:'Pourpre néon',c:'#b82a9a',eye:'#6a0a58'},{id:'lavande',n:'Lavande',c:'#b8a0d8',eye:'#7a5aa8'},{id:'bicolore',n:'Pourpre et blanc',c:'#9a2a7a',ring:'#f6eef2',eye:'#5a0a48'},
 {id:'green-trick',n:'Vert mousse (Green Trick)',c:'#a8c86a',moss:1}];
function barbHead(g,t,o,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||10)*UPC*(cw.moss?.62:1),k=G(g),B=frameOf(o,1),Rr=D/2,sd=R(0,6);
  const F={B,O:[0,0,0],parts:[]},nkp=neckPart(B,[0,0,0],[0,0,-Rr*.12],[0,0,-1],D*.55,D*.06,{cols:['#2a4a1e','#4a7032','#5f8a3e']});F.parts.push(nkp.part);drawParts(k,F.parts);
  if(cw.moss){/* a ball of fine green threads */const n=LOD?120:260,dd=[[],[],[]];for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996+sd,dir=[Math.cos(a)*r,Math.sin(a)*r,y];if(toV(B,dir)[2]<-.2)continue;
      const p0=PJ(B,[0,0,0],V3.sc(dir,Rr*.55)),p1=PJ(B,[0,0,0],V3.sc(V3.nz(V3.add(dir,[R(-.3,.3),R(-.3,.3),R(-.3,.3)])),Rr*R(.9,1.05))),lv=Math.max(0,Math.min(2,Math.floor(lightI(toV(B,dir))*2.4)));dd[lv].push(`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`)}
    const P=pal7(cw.c);E('circle',{cx:0,cy:0,r:f(Rr*.62),fill:P.d2},k);[P.d1,P.b,P.l1].forEach((c,i)=>E('path',{d:dd[i].join(''),stroke:c,'stroke-width':f(Math.max(.5,Rr*.025)),'stroke-linecap':'round'},k))}
  else{/* the corymb: florets on a gently domed disc, bracts like threads between */const nf=Math.round(36*(LOD?.6:1)*(.4+.6*op)),fl=[];
    E('path',{d:smooth(hull2((()=>{const h=[];for(let i=0;i<24;i++){const a=i/24*6.283;const p=PJ(B,[0,0,0],[Math.cos(a)*Rr*.62,Math.sin(a)*Rr*.62,-Rr*.02]);h.push([p[0],p[1]])}return h})())),fill:op<.4?'#355e26':shd(cw.c,-.5)},k);
    let br='';for(let i=0;i<40;i++){const a=i*2.39996,r=Rr*Math.sqrt((i+.5)/40)*.7,z=Rr*.26*(1-(r/Rr/.8)**2),p0=PJ(B,[0,0,0],[Math.cos(a)*r,Math.sin(a)*r,z]),p1=PJ(B,[0,0,0],[Math.cos(a+.2)*r*1.08,Math.sin(a+.2)*r*1.08,z+Rr*.14]);br+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`}
    E('path',{d:br,stroke:'#6a8a48','stroke-width':.6,'stroke-opacity':.85},k);
    const nf2=op<.4?Math.round(64*(LOD?.6:1)):nf,qs=op<.4?.6:.8;for(let i=0;i<nf2;i++){const q=Math.sqrt((i+.5)/nf2),a=i*2.39996+sd,x=Math.cos(a)*q*Rr*qs,y=Math.sin(a)*q*Rr*qs,z=Rr*.26*(1-q*q),Bf=frameIn(B,V3.nz([x/Rr*.5,y/Rr*.5,1]),R(0,6));fl.push({Bf,O:toV(B,[x,y,z]),q})}
    fl.sort((a,b)=>a.O[2]-b.O[2]);const d0=Rr*.24;
    if(op<.4){/* buds: a dome of tight, round green buds tipped with colour */let d0='',d1='',d2='';const bd=Rr*.072;for(const it of fl){const e=PJ(it.Bf,it.O,[0,0,bd*.4]),c=(cx,cy,r)=>`M${f(cx-r)},${f(cy)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;d0+=c(e[0],e[1],bd);d1+=c(e[0]-bd*.15,e[1]-bd*.2,bd*.68);d2+=c(e[0]-bd*.35,e[1]-bd*.4,bd*.3)}
      E('path',{d:d0,fill:'#3f6a2c'},k);E('path',{d:d1,fill:mix('#7f9f4e',cw.c,.18)},k);E('path',{d:d2,fill:'#c8dca0',opacity:.7},k)}
    else for(const it of fl){const items=[];let c=cw.c;if(cw.c2)c=mix(cw.c,cw.c2,it.q);
      for(let j=0;j<5;j++){const l=ligule(it.Bf,it.O,{phi:j/5*6.283,r0:d0*.08,z0:0,L:d0*(op<.4?.42:.92),W:d0*(op<.4?.26:.36),wp:CARN_WP,a0:op<.4?.12:1.35,a1:op<.4?.05:1.6,tip:op<.4?'point':'fringe',fr:4,th:op<.4?1.2:.2});items.push({l,c,noov:1})}
      drawLig(k,items);if(op>=.4){const e=PJ(it.Bf,it.O,[0,0,d0*.04]);if(cw.ring)E('circle',{cx:f(e[0]),cy:f(e[1]),r:f(d0*.55),fill:'none',stroke:cw.ring,'stroke-width':f(d0*.22),'stroke-opacity':.9},k);
        E('circle',{cx:f(e[0]),cy:f(e[1]),r:f(d0*.26),fill:cw.eye,opacity:.92},k);E('circle',{cx:f(e[0]),cy:f(e[1]),r:f(d0*.08),fill:'#f6f0e8'},k)}}}
  open(k,t,1000,8,.3);return neckOut(nkp)}
/* ---------- umbels of the amaryllis family: nerine (narrow crimped recurved tepals, long upturned stamens) and agapanthe (a ball of little blue trumpets) ---------- */
const CW_NER=[
 {id:'rose-vif',n:'Rose vif',c:'#e8578a',mid:'#c8306a'},{id:'rose',n:'Rose',c:'#f19bbb',mid:'#e0608e'},{id:'rose-pale',n:'Rose pâle',c:'#f6c9d8',mid:'#e890b0'},{id:'blanc',n:'Blanc',c:'#f7f4ee',mid:'#e8dcd0'},
 {id:'rouge',n:'Rouge profond',c:'#a8122f',mid:'#7a0a20'},{id:'cerise',n:'Cerise',c:'#d02050',mid:'#a0103a'},{id:'ecarlate',n:'Rouge écarlate',c:'#d8302a',mid:'#a81a18'},
 {id:'saumon',n:'Orange saumon',c:'#f07a6a',mid:'#d0504a'},{id:'lipstick',n:'Blanc bordé de rose foncé',c:'#f8f0f2',edge:'#d03a78',mid:'#e8b0c8'},{id:'bionce',n:'Blanc bordé de rose pâle',c:'#fbf6f6',edge:'#f0a8c0',mid:'#f0d0dc'}];
const CW_AGA=[
 {id:'bleu',n:'Bleu',c:'#5d72c6',mid:'#34449a'},{id:'blanc',n:'Blanc',c:'#f4f5ef',mid:'#d8dcd0'},{id:'bleu-profond',n:'Bleu profond',c:'#34449a',mid:'#1e2a6a'},{id:'bleu-pale',n:'Bleu pâle',c:'#a9badf',mid:'#6f84c8'},
 {id:'bleu-ciel',n:'Bleu ciel',c:'#9ac0ec',mid:'#5a86c8'},{id:'bleu-vif',n:'Bleu vif',c:'#4a62d8',mid:'#2a3ca8'},{id:'violet',n:'Bleu violet',c:'#5e53ad',mid:'#3a2e80'},{id:'lavande',n:'Lavande',c:'#a8a0d8',mid:'#6a5ab0'},
 {id:'pourpre',n:'Pourpre',c:'#6c4a98',mid:'#4a2a70'},{id:'jacaranda',n:'Bleu à strie sombre',c:'#7a8ad8',mid:'#2a2a7a'},{id:'fireworks',n:'Blanc et pourpre',c:'#f2eef6',mid:'#6a3a98',base:'#6a3a98'}];
function umbelHead(g,t,o,list,kd){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||(kd==='ner'?13:15))*UPC,k=G(g),B=frameOf(o,1,true),Rr=D/2,sd=R(0,6),ner=kd==='ner';
  const F={B,O:[0,0,0],parts:[]},c0=ner?[0,-Rr*.3,-Rr*.2]:[0,0,0],nkp=neckPart(B,[0,0,0],c0,ner?[0,-1,-.35]:[0,-1,0],D*.62,D*(ner?.056:.064),{cols:['#2a4a1e','#4a7032','#6e9a48']});
  F.parts.push(nkp.part);
  /* the papery spathe at the top of the scape (split open when flowering) */
  if(op<.35){const sp=ligule(B,[0,0,0],{phi:0,r0:0,z0:c0[2],L:Rr*.9,W:Rr*.35,wp:prof([[0,.6],[.4,1],[1,.05]]),a0:.05,a1:.02,tip:'point',th:2.4});drawParts(k,F.parts);
    const items=[{l:sp,c:ner?'#d8c8a8':'#a8b880',ink:'#7a6a4a'}];drawLig(k,items);open(k,t,1000,8,.3);return neckOut(nkp)}
  const n=ner?Math.round(R(7,10)):Math.round(46*(LOD?.55:1)),fl=[];
  for(let i=0;i<n;i++){let dir;if(ner){const a=i/n*6.283+sd+R(-.2,.2),el=R(.35,.95);dir=V3.nz([Math.cos(a)*Math.cos(el),Math.sin(a)*Math.cos(el)+.25,Math.sin(el)])}else{const y=1-2*(i+.5)/n*.92,r=Math.sqrt(1-y*y),a=i*2.39996+sd;dir=[Math.cos(a)*r,Math.sin(a)*r,y]}
    const len=Rr*(ner?R(.55,.8):.62),p=V3.add(c0,V3.sc(dir,len));fl.push({dir,p,len,bud:!ner&&op<.7&&i%3===0})}
  /* pedicels from the centre */
  for(const it of fl)F.parts.push(tube3(F,[c0,V3.add(c0,V3.sc(it.dir,it.len*.5)),it.p],Math.max(.5,D*.008),{cols:['#6a9048','#86a85a'],cap:0,hl:.2,dk:.3,spec:0,ink:'#3a5a28',eo:.2,cast:0,zb:-Rr}));
  drawParts(k,F.parts);fl.sort((a,b)=>toV(B,a.p)[2]-toV(B,b.p)[2]);
  for(const it of fl){const Bf=frameIn(B,it.dir,R(0,6)),O=toV(B,it.p),d=ner?Rr*.62:Rr*.3,items=[];
    if(it.bud){const l=ligule(Bf,O,{phi:0,r0:0,z0:0,L:d*.9,W:d*.16,wp:prof([[0,.5],[.5,1],[1,.1]]),a0:.02,a1:.01,tip:'round',th:3});items.push({l,c:mix(cw.c,'#9ab070',.3)});drawLig(k,items);continue}
    for(let j=0;j<6;j++){const l=ligule(Bf,O,ner?{phi:j/6*6.283+R(-.15,.15),r0:d*.03,z0:0,L:d*R(.85,1),W:d*.1,wp:prof([[0,.35],[.2,.8],[.6,1],[1,.15]]),a0:.35,a1:2.2,pw:1.4,th:-.6,tip:'point',wav:.9,wk:6,n:14,tw:R(-.6,.6)}:
        {phi:j/6*6.283,r0:d*.04,z0:0,L:d*.95,W:d*.22,wp:prof([[0,.3],[.3,.75],[.7,1],[1,.35]]),a0:.22,a1:.85,pw:1.6,th:.6,tip:'round',n:7});
      items.push({l,c:cw.base&&!ner?mix(cw.c,cw.base,.15):cw.c,mid:cw.mid,mw:Math.max(.5,d*.03),edge:cw.edge,ew:7,ewd:Math.max(.8,d*.035)})}
    drawLig(k,items);
    /* stamens: nerine's long and upturned, agapanthe's short with dark anthers */
    const sp=[];for(let j=0;j<6;j++){const a=j/6*6.283+.5,P0=[0,0,d*.05],P1=ner?[Math.cos(a)*d*.25,Math.sin(a)*d*.25+d*.1,d*.75]:[Math.cos(a)*d*.15,Math.sin(a)*d*.15,d*.75],e=PJ(Bf,O,P1),b=PJ(Bf,O,P0);sp.push([b,e])}
    let sd2='',an='';for(const[b,e]of sp){sd2+=`M${f(b[0])},${f(b[1])}Q${f((b[0]+e[0])/2)},${f((b[1]+e[1])/2-d*.08)} ${f(e[0])},${f(e[1])}`;an+=`M${f(e[0]-d*.035)},${f(e[1])}a${f(d*.035)},${f(d*.035)} 0 1,0 ${f(d*.07)},0a${f(d*.035)},${f(d*.035)} 0 1,0 ${f(-d*.07)},0`}
    if(!LOD){E('path',{d:sd2,stroke:ner?mix(cw.c,'#ffffff',.3):'#e8eef8','stroke-width':f(Math.max(.4,d*.018)),fill:'none','stroke-linecap':'round'},k);E('path',{d:an,fill:ner?'#7a3a4a':'#3a3046'},k)}}
  open(k,t,1000,8,.3);return neckOut(nkp)}
const xCarnStd=(g,t,o)=>carnHead(g,t,o,CW_CARN),xCarnSpr=(g,t,o)=>carnSprayHead(g,t,o,CW_CARS),xBarb=(g,t,o)=>barbHead(g,t,o,CW_BARB),xNer=(g,t,o)=>umbelHead(g,t,o,CW_NER,'ner'),xAga=(g,t,o)=>umbelHead(g,t,o,CW_AGA,'aga');
Object.assign(FN,{xCarn:xCarnStd,xNerine:xNer});
Object.assign(GH,{'oeillet-standard':xCarnStd,'oeillet-spray':xCarnSpr,'oeillet-de-poete-dianthus':xBarb,'nerine':xNer,'agapanthe':xAga});
Object.assign(CWS,{'oeillet-standard':CW_CARN,'oeillet-spray':CW_CARS,'oeillet-de-poete-dianthus':CW_BARB,'nerine':CW_NER,'agapanthe':CW_AGA});
Object.assign(SZG,{'oeillet-standard':[6,7,7,8],'oeillet-spray':[13,15,16],'oeillet-de-poete-dianthus':[8,10,11,12],'nerine':[11,13,14],'agapanthe':[12,15,18,20]});
Object.assign(GHI,{'oeillet-spray':{form:'disque',size:2.5,k:'head',rk:.8},'oeillet-de-poete-dianthus':{form:'disque',size:2,k:'head',rk:1},'agapanthe':{form:'sphere',size:3,k:'head',rk:1}});
/* carnations: narrow glaucous opposite leaves clasping the swollen nodes; sweet william: broader green lance leaves */
Object.assign(STEML,{'oeillet-standard':{shape:'lance',n:[1,2],len:9,w:.1,col:'#7f9f8a',up:30,arr:'opp'},'oeillet-spray':{shape:'lance',n:[1,2],len:8,w:.1,col:'#7f9f8a',up:30,arr:'opp'},
 'oeillet-de-poete-dianthus':{shape:'lance',n:[1,2],len:8,w:.2,col:'#4a7a34',up:35,arr:'opp',par:1}});
