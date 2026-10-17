/* ================= Serre, lot 1 — Cymbidium à grandes fleurs : tépales cireux, pétales tenus en avant, labelle en langue recourbée et tachée, cal à deux crêtes, colonne courbe, épi ================= */
/* colourways: tepals (with an optional central flush and fine veins), lip ground and its spots, column */
const CW_CYMB=[
 {id:'blanc',n:'Blanc',c:'#f9f6ee',lip:'#fbf6ee',dots:'#b8203a',cal:'#f2c840',col:'#f4ecdc'},
 {id:'ivoire',n:'Ivoire',c:'#f4ecd8',lip:'#f8f0e0',dots:'#c03040',cal:'#f0c040',col:'#efe2c8'},
 {id:'creme-rose',n:'Crème à labelle rose',c:'#f3e8d6',lip:'#f2c6cc',dots:'#c03a5a',cal:'#f2c840',col:'#f0dccc'},
 {id:'blanc-rouge',n:'Blanc à labelle rouge',c:'#f9f6ee',lip:'#b81c34',dots:'#6a0a18',cal:'#f2c840',col:'#f2e4dc',solid:1},
 {id:'vert-pomme',n:'Vert pomme',c:'#bfd176',flush:'#a8bc56',lip:'#f6f0dc',dots:'#a8102a',cal:'#f0c838',col:'#d8e0a8'},
 {id:'vert-menthe',n:'Vert menthe',c:'#cfe0b0',flush:'#b6cc92',lip:'#f8f2e2',dots:'#b0283c',cal:'#f0c838',col:'#dfe8c8'},
 {id:'jaune',n:'Jaune',c:'#efd476',flush:'#e2bc4e',lip:'#f8ecc8',dots:'#b02a1e',cal:'#f0b030',col:'#efdca0'},
 {id:'rose-pale',n:'Rose pâle',c:'#f0cdd4',vein:'#dca2b0',lip:'#f6dde2',dots:'#b8304e',cal:'#f2c840',col:'#efd4da'},
 {id:'rose',n:'Rose',c:'#e9a3bc',vein:'#cf7896',lip:'#f2d0da',dots:'#a01a40',cal:'#f2c840',col:'#e8b4c4'},
 {id:'saumon',n:'Rose saumon',c:'#eeab98',vein:'#d88470',lip:'#f6dccc',dots:'#a82a2a',cal:'#f0b838',col:'#efc0b0'},
 {id:'orange',n:'Orange bronze',c:'#dd8a46',vein:'#b8642a',lip:'#f2d8b8',dots:'#8a1a14',cal:'#f0b030',col:'#e2a874'},
 {id:'caramel',n:'Caramel',c:'#c49058',vein:'#9a6a38',lip:'#f0dcc0',dots:'#7a1a18',cal:'#f0b838',col:'#d0a878'},
 {id:'rouge',n:'Rouge',c:'#b8283a',vein:'#8a1424',lip:'#f2d8d4',dots:'#6a0812',cal:'#f2c040',col:'#c8505e'},
 {id:'bordeaux',n:'Bordeaux',c:'#7a1f33',vein:'#5a1022',lip:'#e8c8cc',dots:'#4a0614',cal:'#f0b838',col:'#8e3a4c'},
 {id:'brun',n:'Brun',c:'#7e4a30',vein:'#5e321e',lip:'#f0dcc4',dots:'#5a1410',cal:'#f0b838',col:'#946048'},
 {id:'noir',n:'Pourpre noir',c:'#3e1424',vein:'#2a0814',lip:'#e6c4cc',dots:'#2a0410',cal:'#eeb438',col:'#5a2638'}];
const CY_TEP=prof([[0,.36],[.14,.7],[.4,.96],[.62,1],[.8,.86],[.93,.55],[1,.16]]),CY_LIP=prof([[0,.42],[.25,.78],[.55,1],[.78,.92],[.92,.6],[1,.2]]),CY_SIDE=prof([[0,.6],[.35,1],[.75,.85],[1,.3]]);
function cymbFlower(par,B,O,D,cw,op,t){if(SV_ON&&typeof cymbSvPut==='function'&&CW_CYMB.indexOf(cw)>=0)return cymbSvPut(par,B,O,D,cw,op);const F={k:G(par),B,O,parts:[],so:.2,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.08),'#d8d8b8',.15)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>a*(.45+.55*o2),r=D/2;
  /* waxy tepal: a central flush, fine parallel veins, a soft waxy sheen */
  const deco=S=>(g,front,X)=>{if(!front||LOD)return;
    if(cw.flush)E('path',{d:X.d,fill:ugrad(...PJ3(F,S(0,.05)).slice(0,2),...PJ3(F,S(0,.9)).slice(0,2),[[0,cw.flush,.8],[.6,cw.flush,.35],[1,cw.flush,0]])},g);
    const n=cw.vein?9:7,dd=[];for(let k=0;k<n;k++){const u=-.8+1.6*k/(n-1),q=[];for(let i=0;i<=6;i++)q.push(PJ3(F,S(u,.04+.86*i/6)));dd.push(smooth(q.map(p=>[p[0],p[1]]),false))}
    E('path',{d:dd.join(''),stroke:cw.vein||Pc.d1,'stroke-width':f(D*.0045),'stroke-opacity':cw.vein?.55:.28,fill:'none'},g)};
  const tep=(o)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:7,nv:12,across:1.5,ew:.5,eo:.3,cast:1,paint:deco(S)}),...sheen3(F,S,{side:1,shin:16,thr:.35,w:D*.016,op:.5,v0:.15,v1:.85}));return S};
  tep({phi:90+R(-3,3),r0:D*.02,z0:-D*.01,L:r*.92,W:r*.25,wp:CY_TEP,a0:A(62),a1:A(78),cup:-.22,bow:.02});
  for(const s of[-1,1])tep({phi:270+s*58+R(-3,3),r0:D*.025,z0:-D*.014,L:r*.88,W:r*.25,wp:CY_TEP,a0:A(82),a1:A(94),cup:-.2,tw:s*8});
  for(const s of[-1,1])tep({phi:90+s*-52+R(-3,3),r0:D*.03,z0:D*.006,L:r*.82,W:r*.23,wp:CY_TEP,a0:A(60),a1:A(76),cup:-.25,tw:s*-10});
  if(op>.3){
    /* side lobes rise round the column like a tube */
    for(const s of[-1,1]){const S=petS({phi:270+s*34,r0:D*.03,z0:D*.03,L:r*.32,W:r*.12,wp:CY_SIDE,a0:A(26),a1:A(14),cup:-.55,tw:s*30});F.parts.push(...sheet3(F,S,{pal:Pl,palB:Pl,nu:6,nv:8,across:1.4,ew:.45,eo:.4,cast:.8,
      paint:(g,front,X)=>{if(LOD)return;let dd='';for(let k=0;k<5;k++){const u=-.7+k*.35,P=[.12,.42,.72].map(v=>PJ3(F,S(u,v)));dd+=smooth(P.map(p=>[p[0],p[1]]),false)}E('path',{d:dd,stroke:cw.dots,'stroke-width':f(D*.007),'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},g)}}))}
    /* the tongue: broad, rolling down and back, spotted (or solid red) */
    const SM=petS({phi:270,r0:D*.06,z0:D*.07,L:r*.52,W:r*.24,wp:CY_LIP,a0:A(48),a1:A(150),pw:1.15,cup:-.18,ruf:.07,rk:4});
    F.parts.push(...sheet3(F,SM,{pal:Pl,palB:pal7(shd(cw.lip,-.1)),nu:8,nv:12,across:1.3,ew:.55,eo:.45,cast:.9,paint:(g,front,X)=>{if(!front||LOD)return;
      if(cw.solid){E('path',{d:X.d,fill:ugrad(...PJ3(F,SM(0,.05)).slice(0,2),...PJ3(F,SM(0,.95)).slice(0,2),[[0,cw.dots,.5],[.5,cw.dots,0]])},g);return}
      let dd='';for(let k=0;k<46;k++){const v=.18+.74*Math.abs(Math.sin(k*12.9898+3.1)),u=Math.sin(k*78.233+1.7)*(.85-.3*v),c=PJ3(F,SM(u,v)),rr=D*(.006+.006*Math.abs(Math.sin(k*4.1)))*(1.2-.5*v);
        dd+=`M${f(c[0]-rr)},${f(c[1])}a${f(rr)},${f(rr*.8)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr*.8)} 0 1,0 ${f(-2*rr)},0`}E('path',{d:dd,fill:cw.dots,opacity:.85},g);
      const rim=[];for(let i=0;i<=10;i++)rim.push(PJ3(F,SM(-.97+1.94*i/10,.92)));E('path',{d:smooth(rim.map(p=>[p[0],p[1]]),false),stroke:cw.dots,'stroke-width':f(D*.006),'stroke-opacity':.5,fill:'none'},g)}}));
    /* callus: two yellow ridges at the base of the tongue */
    for(const s of[-1,1]){const b=SM(s*.18,.02),q=[b,SM(s*.16,.16),SM(s*.12,.32)].map(p=>V3.add(p,[0,0,D*.012]));F.parts.push(tube3(F,q,D*.012,{cols:[cw.cal,shd(cw.cal,.25)],cap:1,hl:.45,dk:.3,spec:.4,ink:shd(cw.cal,-.6),eo:.35,cast:.5,zb:D*.03}))}
    /* the column arching over the tongue, spotted beneath, the anther cap at its tip */
    const cl=[[0,D*.012,D*.02],[0,D*.004,D*.07],[0,-D*.02,D*.12],[0,-D*.045,D*.15]];F.parts.push(tube3(F,cl,q=>D*.03*(1-.12*q),{cols:[shd(cw.col,-.1),cw.col,lt(cw.col,.25)],cap:1,dots:{n:22,r:D*.004,c:cw.dots,o:.8},hl:.45,dk:.4,spec:.4,ink:shd(cw.col,-.6),eo:.35,cast:.8,zb:D*.04}));
    const an=cl[3];F.parts.push(tube3(F,[V3.add(an,[0,D*.008,-D*.006]),V3.add(an,[0,-D*.006,D*.006])],D*.02,{cols:['#f4d860','#fff2b8'],cap:1,hl:.5,dk:.3,spec:.5,ink:'#a08030',eo:.4,cast:0,zb:D*.05}))}
  const pd=[[0,0,-D*.02],[0,-D*.03,-D*.1],[0,-D*.05,-D*.18]];F.parts.push(tube3(F,pd,D*.026,{cols:[mix(cw.c,'#9ab07a',.5),'#8aa06a'],cap:0,hl:.3,dk:.4,spec:.2,ink:'#3a4a2a',eo:.3,cast:0,zb:-D*.05}));
  render3(F,D*.5);return F}
/* the spike: upright and gently arching, flowers facing out on short pedicels, round buds at the top */
function x3CymbSpray2(g,t,o){const cw=o.cw||cwNear(CW_CYMB.filter(x=>!x.late),o.col)||CW_CYMB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),Bc=frameOf(o,.25,true),r=D/2,sd=o.side??(rnd()<.5?-1:1);
  const nf=o.nf||(op<.3?0:op<.7?2:4),nb=op<.3?5:2;
  const C=[fitDown(Bc,[-sd*r*.2,-r*1.7,-r*.4],.3),[-sd*r*.15,-r*.5,-r*.35],[sd*r*.05,r*.7,-r*.35],[sd*r*.4,r*1.65,-r*.45]],cb=q=>{const a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const items=[],stem=[];for(let i=0;i<=14;i++)stem.push(cb(i/14));
  const n=nf+nb;for(let i=0;i<n;i++){const bud=i>=nf,q=bud?.86+.12*(i-nf)/Math.max(1,nb-1):.22+.52*i/Math.max(1,nf-.5),p=cb(q),alt=i%2?1:-1;
    if(!bud){const sz=1-.05*i,pos=V3.add(p,[alt*r*.62,r*.05,r*.42]),axL=V3.nz([alt*.32+R(-.06,.06),.1+R(-.06,.06),1]);items.push({bud:0,pos,axL,sz,node:p})}
    else{const j=i-nf,sz=.36-.08*j,pos=V3.add(p,[alt*r*.2,r*.04,r*.15]);items.push({bud:1,pos,sz,node:p,ang:alt})}}
  const scol=['#2e3f22','#4f6534','#76884a','#a8b878'],FS={B:Bc,O:[0,0,0],parts:[]};FS.parts.push(tube3(FS,stem,q=>r*.06*(1-.3*q),{cols:[scol[1],scol[2],scol[1]],cap:1,hl:.3,dk:.45,spec:.2,ink:scol[0],eo:.3,cast:0}));
  for(const it of items){const pd=[it.node,V3.add(it.node,V3.sc(V3s(it.pos,it.node),.5)),it.pos];FS.parts.push(tube3(FS,pd,r*.026,{cols:[scol[1],mix(scol[2],cw.c,.3)],cap:0,hl:.3,dk:.4,spec:.15,ink:scol[0],eo:.25,cast:0}))}
  const nkp=neckPart(Bc,[0,0,0],C[0],V3s(C[0],C[1]),r*.9,r*.12*1.3,{cols:scol});FS.parts.push(nkp.part);drawParts(k,FS.parts);items.sort((a,b)=>toV(Bc,a.pos)[2]-toV(Bc,b.pos)[2]);
  const bc={c:mix(cw.c,'#b8c48a',.3)};for(const it of items){const Ov=toV(Bc,it.pos);if(it.bud){phalBud(k,frameIn(Bc,V3.nz([it.ang*.4,.8,.45]),0),Ov,D*it.sz*.62,bc);continue}cymbFlower(k,frameIn(Bc,it.axL,R(-.1,.1)),Ov,D*it.sz,cw,op,t)}
  open(k,t,1000,10,.3);return neckOut(nkp)}
Object.assign(FN,{xCymbCluster:x3CymbSpray2});CWS['cymbidium-grandes-fleurs']=CW_CYMB;
SZG['cymbidium-grandes-fleurs']=[8,9,10,10,11];
