/* ================= Serre, lot 2 — Lys (oriental, asiatique, oriental double, tigré) et gloriosa ================= */
/* the colourways: tepal colour; spots and papillae; nectary; edge band, central stripe, tips, heart; anthers */
const CW_LORI=[
 {id:'blanc',n:'Blanc (Casa Blanca)',c:'#fbf9f2',nect:'#a9c56a',pap:'#e8e0c8',spots:null,an:'#a8501e'},
 {id:'blanc-mouchete',n:'Blanc moucheté de rose',c:'#fbf5f2',nect:'#a9c56a',pap:'#e8a8b8',spots:'#d0607e',an:'#a8501e'},
 {id:'stargazer',n:'Cramoisi bordé de blanc (Stargazer)',c:'#d33a74',edge:'#fbeef3',nect:'#c8d890',pap:'#8a0a3a',spots:'#7a0830',an:'#9a3c1a'},
 {id:'rose-tendre',n:'Rose tendre',c:'#f4c2d2',nect:'#b8d080',pap:'#e898b2',spots:'#d86a92',an:'#a8501e'},
 {id:'rose',n:'Rose à bord clair',c:'#ea8ab0',edge:'#f8dde8',nect:'#b8d080',pap:'#c8306a',spots:'#b02a5e',an:'#9a3c1a'},
 {id:'fuchsia',n:'Rose fuchsia',c:'#cf3f7c',nect:'#c0d088',pap:'#8a0a46',spots:'#80083e',an:'#8a3418'},
 {id:'saumon',n:'Rose saumoné',c:'#f2a08e',nect:'#c0d088',pap:'#d86a5e',spots:'#c04a44',an:'#9a3c1a'},
 {id:'rouge-borde',n:'Rouge bordé de blanc',c:'#b8203c',edge:'#f8eef0',nect:'#c8d890',pap:'#6a0820',spots:'#600618',an:'#8a3418'},
 {id:'blanc-strie',n:'Blanc strié cramoisi',c:'#fbf6f4',stripe:'#c0204e',nect:'#a9c56a',pap:'#c0204e',spots:'#b01a48',an:'#a8501e'}];
const CW_LASI=[
 {id:'blanc',n:'Blanc',c:'#faf7ee',spots:'#c8a890',an:'#b0602a'},{id:'jaune',n:'Jaune',c:'#f4cd3a',spots:'#8a3a1a',an:'#b8501a'},
 {id:'abricot',n:'Abricot',c:'#f3a868',spots:'#8a3418',an:'#a8441a'},{id:'orange',n:'Orange',c:'#ec7a24',spots:'#5a1a0c',an:'#8a2c10'},
 {id:'rose',n:'Rose',c:'#ec8cae',spots:'#9a2a50',an:'#9a3c1a'},{id:'rouge',n:'Rouge',c:'#c0242e',spots:'#4a0a10',an:'#6a1a0c'},
 {id:'rouge-noir',n:'Rouge noir',c:'#5c0e1c',spots:'#1c0208',an:'#3a0a08'},{id:'coeur-noir',n:'Rouge à cœur noir',c:'#c8282e',heart:'#2a0610',spots:'#2a0610',an:'#4a0c0a'},
 {id:'pointes',n:'Blanc liseré',c:'#faf6ee',spots:'#260306',an:'#7a4a4c'},{id:'coeur-pourpre',n:'Jaune moucheté à cœur pourpre',c:'#eab212',heart:'#4a0c10',spots:'#5a1214',an:'#2c0b05'}];
const CW_LDBL=[
 {id:'rose',n:'Rose',c:'#f2a6c4'},{id:'blanc',n:'Blanc',c:'#faf6ee'},{id:'creme',n:'Crème jaune',c:'#f6e6b8'},{id:'fuchsia',n:'Fuchsia',c:'#d8508a'},{id:'rose-pale',n:'Rose pâle',c:'#f6d0dc'}];
const CW_LTIG=[
 {id:'orange',n:'Orange tigré',c:'#e8742a',spots:'#2a0c08',an:'#4a1408'},{id:'jaune',n:'Jaune tigré',c:'#f2c41e',spots:'#3a1a08',an:'#5a2a0c'},
 {id:'rouge',n:'Rouge tigré',c:'#d8402a',spots:'#2a0806',an:'#3a0c08'},{id:'rose',n:'Rose tigré',c:'#ec9a8a',spots:'#5a1a1a',an:'#5a1a10'}];
const CW_GLOR=[
 {id:'rothschildiana',n:'Rouge bordé de jaune',c:'#cc1f2e',edge:'#f2c83a',base:'#f0c040'},{id:'jaune',n:'Jaune',c:'#f0c838',edge:'#f6dc6a',base:'#c8c040'},
 {id:'orange',n:'Orange',c:'#ee7a2a',edge:'#f6c040',base:'#f0b030'},{id:'rouge',n:'Rouge',c:'#c41c2a',edge:'#e85a3a',base:'#e8a030'},{id:'bordeaux',n:'Bordeaux',c:'#7a1a2a',edge:'#c8603a',base:'#d89030'}];
/* the shape of each kind: tepal spread (a0 → a1 degrees off the axis), length and widths (× flower diameter), ruffle, how the flower is held */
const LILY_K={
 oriental:{L:.62,Wo:.12,Wi:.17,a0:26,a1:128,pw:2.5,cup:-.34,ruf:.07,rk:6,st:6,face:'out'},
 asiatic:{L:.56,Wo:.11,Wi:.14,a0:24,a1:94,pw:1.8,cup:-.3,ruf:.025,rk:5,st:6,face:'up'},
 double:{L:.56,Wo:.13,Wi:.15,a0:26,a1:104,pw:1.8,cup:-.32,ruf:.1,rk:7,st:0,face:'out',layers:3},
 tiger:{L:.55,Wo:.065,Wi:.075,a0:42,a1:205,pw:1.25,cup:-.22,ruf:.03,rk:5,st:6,face:'nod'},
 gloriosa:{L:.62,Wo:.055,Wi:.06,a0:96,a1:150,pw:1.1,cup:-.2,ruf:.24,rk:9,st:6,face:'nod'}};
const LILY_TEP=prof([[0,.12],[.08,.3],[.25,.76],[.45,1],[.66,.86],[.86,.46],[1,.04]]),GLOR_TEP=prof([[0,.2],[.15,.6],[.4,1],[.7,.9],[.9,.5],[1,.08]]);
/* one lily (or gloriosa) in its frame; D = flower diameter in units; op opening */
function lilyFlower(par,B,O,D,cw,op,kd){const K=LILY_K[kd],F={k:G(par),B,O,parts:[],so:.18,sd:null},o2=sm01((op-.2)/.8),A=a=>K.a0*.35+(a-K.a0*.35)*(.28+.72*o2),
    cP=pal7(cw.c),cB=pal7(mix(shd(cw.c,.1),kd==='gloriosa'?shd(cw.c,.2):'#e0e4c8',kd==='gloriosa'?.1:.2)),Ln=D*K.L,glo=kd==='gloriosa';
  /* the painted details of a tepal, in its own (u,v) space */
  const deco=(S,inner,sd)=>(g,front,X)=>{if(LOD)return;const P3=(u,v)=>PJ3(F,S(u,v)),line=(pts,c,w,op2)=>E('path',{d:smooth(pts.map(q=>{const p=P3(q[0],q[1]);return[p[0],p[1]]}),false),stroke:c,'stroke-width':f(w),'stroke-opacity':op2,fill:'none','stroke-linecap':'round'},g);
    if(!front){if(glo&&cw.base)E('path',{d:X.d,fill:ugrad(...P3(0,0).slice(0,2),...P3(0,.5).slice(0,2),[[0,cw.base,.9],[1,cw.base,0]])},g);return}
    E('path',{d:X.d,fill:ugrad(...P3(0,0).slice(0,2),...P3(0,.42).slice(0,2),[[0,cw.throat||(h2l(cw.c)[2]>.8?'#dfe8b8':shd(cw.c,.25)),.85],[1,cw.throat||'#dfe8b8',0]])},g);
    if(cw.heart)E('path',{d:X.d,fill:ugrad(...P3(0,0).slice(0,2),...P3(0,.62).slice(0,2),[[0,cw.heart,.95],[.55,cw.heart,.6],[1,cw.heart,0]])},g);
    if(cw.tips)E('path',{d:X.d,fill:ugrad(...P3(0,.45).slice(0,2),...P3(0,1).slice(0,2),[[0,cw.tips,0],[.5,cw.tips,.55],[1,cw.tips,.95]])},g);
    if(glo&&cw.base)E('path',{d:X.d,fill:ugrad(...P3(0,0).slice(0,2),...P3(0,.45).slice(0,2),[[0,cw.base,.95],[.6,cw.base,.35],[1,cw.base,0]])},g);
    if(cw.stripe)line([[0,.04],[0,.3],[0,.6],[0,.86]],cw.stripe,D*.03,.75);
    if(cw.edge){const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:cw.edge,'stroke-width':f(D*(glo?.022:.03)),'stroke-opacity':.92,'clip-path':`url(#${id})`},g)}
    if(K.st&&cw.nect!==null&&!glo)line([[0,0],[0,.14],[0,.3]],cw.nect||'#b8cc78',D*.016,.85);
    /* papillae and spots toward the throat */
    const ns=cw.spots?(kd==='tiger'?26:18):0,np=kd==='oriental'?14:0;let dd='',dp='';
    for(let k=0;k<ns+np;k++){const pap=k>=ns,v=pap?.06+.24*Math.abs(Math.sin(k*7.3+sd)):.1+.42*Math.abs(Math.sin(k*12.9898+sd*3)),u=Math.sin(k*78.233+sd)*(.7-.5*v)*(pap?.5:1),c=P3(u,v),r=D*(pap?.004:kd==='tiger'?.009:.006)*(1.1-.6*v);
      const s=`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;if(pap)dp+=s;else dd+=s}
    if(dd)E('path',{d:dd,fill:cw.spots,opacity:.88},g);if(dp)E('path',{d:dp,fill:cw.pap||cP.d1,opacity:.8},g)};
  /* the tepals: three outer (narrower) and three inner; the double has more rows, smaller inward */
  const rows=K.layers?[[0,1],[1,.86],[2,.7]]:[[0,1]];let sd=1;
  for(const[li,sc]of rows)for(let i=0;i<6;i++){const inner=i%2===1,ph=90+i*60+(li?30*li:0)+R(-5,5),W=D*(inner?K.Wi:K.Wo)*sc*(li?.95:1);
    const S=petS({phi:ph,r0:D*.03*(1-li*.3),z0:inner?D*.006:0+li*D*.03,L:Ln*sc*R(.95,1.03),W,wp:glo?GLOR_TEP:LILY_TEP,a0:A(K.a0-li*8),a1:A(K.a1-li*18),pw:K.pw,cup:K.cup,ruf:K.ruf*(li?1.2:1),rk:K.rk,tw:R(-8,8)});
    F.parts.push(...sheet3(F,S,{pal:cP,palB:cB,nu:7,nv:glo?14:12,across:1.7,ew:.5,eo:.3,cast:1,paint:deco(S,inner,sd++)}));
    if(!glo&&op>.4)F.parts.push(...sheen3(F,S,{side:1,shin:18,thr:.4,w:W*.35,op:.35,v0:.2,v1:.8}))}
  /* stamens and pistil */
  if(K.st&&op>.45){const an=cw.an||'#9a4a1c',fil=mix('#dfe6c0',cw.c,.15);
    for(let i=0;i<6;i++){const a=(90+i*60+30+R(-8,8))*D,dx=Math.cos(a),dy=Math.sin(a),sl=D*(glo?.42:.36)*R(.92,1.05);
      const P=glo?[[dx*D*.02,dy*D*.02,D*.02],[dx*sl*.35,dy*sl*.35,D*.05],[dx*sl*.7,dy*sl*.7,D*.06],[dx*sl,dy*sl,D*.055]]:[[dx*D*.02,dy*D*.02,D*.02],[dx*sl*.18,dy*sl*.18,sl*.45],[dx*sl*.45,dy*sl*.45,sl*.75],[dx*sl*.62,dy*sl*.62,sl*.82]];
      F.parts.push(tube3(F,P,D*.009,{cols:[shd(fil,-.2),fil],cap:0,hl:.35,dk:.35,spec:0,ink:shd(fil,-.65),eo:.4,cast:0}));
      const e=P[3],tdir=V3.nz([-dy,dx,0]),hl=D*.04;F.parts.push(tube3(F,[V3.add(e,V3.sc(tdir,-hl)),V3.add(e,[0,0,D*.006]),V3.add(e,V3.sc(tdir,hl))],D*.012,{cols:[shd(an,-.1),an,shd(an,.15)],cap:1,dots:{n:10,r:D*.004,c:shd(an,.35),o:.7},hl:.35,dk:.4,spec:.2,ink:shd(an,-.6),eo:.35,cast:0,zb:D*.01}))}
    const sty=glo?[[0,0,D*.02],[0,0,D*.08],[D*.12,-D*.02,D*.1],[D*.3,-D*.03,D*.1]]:[[0,0,D*.02],[0,D*.02,D*.3],[0,D*.04,D*.56],[0,D*.05,D*.66]],sc2=mix('#d8e0b0',cw.c,.1);
    F.parts.push(tube3(F,sty,D*.008,{cols:[shd(sc2,-.1),sc2],cap:0,hl:.3,dk:.3,spec:0,ink:shd(sc2,-.6),eo:.25,cast:0}));
    const tp=sty[3],sg=glo?'#c8b860':kd==='oriental'?'#7a5a6a':'#8a9a4a';F.parts.push(tube3(F,[tp,V3.add(tp,glo?[D*.03,0,0]:[0,D*.008,D*.03])],D*.02,{cols:[sg,shd(sg,.2)],cap:1,hl:.4,dk:.4,spec:.3,ink:shd(sg,-.6),eo:.35,cast:0,zb:D*.02}))}
  /* the ovary behind the flower, where the pedicel joins it */
  F.parts.push(tube3(F,[[0,0,D*.02],[0,0,-D*.05],[0,0,-D*.11]],q=>D*(.034-.012*q),{cols:['#7a9a50','#5f8240'],cap:0,hl:.3,dk:.45,spec:.15,ink:'#2e4a20',eo:.3,cast:0,zb:-D*.02}));
  if(K.layers)F.parts.push(tube3(F,[[0,0,D*.04],[0,0,D*.1]],D*.04,{cols:[cP.d1,cP.b],cap:1,hl:.3,dk:.4,spec:0,ink:cP.ink,eo:.2,cast:0}));
  render3(F,D*.5);return F}
/* a lily bud: a long club with three ribs, green tinged with its colour toward the tip */
function lilyBud(par,B,O,len,cw,kd){const g=G(par),lum=h2l(cw.c)[2],c=lum>.85?mix('#c8d8a0',cw.c,.55):mix(cw.c,'#b8c890',.28),P=pal7(c),ov=(a,v)=>{const r=len*.16*Math.pow(Math.sin(Math.PI*Math.min(.99,.05+.95*v*.98)),.6)*(.45+.55*Math.min(1,v*1.6))*(1+.1*Math.cos(3*a));return[Math.sin(a)*r,Math.cos(a)*r,v*len]};
  const pts=[];for(let i=0;i<=16;i++)for(let j=0;j<18;j++){const p=PJ(B,O,ov(j/18*6.283,i/16));pts.push([p[0],p[1]])}const h=hull2(pts),d=smooth(h);let cx=0,cy=0;for(const p of h){cx+=p[0];cy+=p[1]}cx/=h.length;cy/=h.length;let ext=0;for(const p of h)ext=Math.max(ext,Math.hypot(p[0]-cx,p[1]-cy));
  const id='q'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:f(cx-ext*.25),cy:f(cy-ext*.3),r:f(ext*1.25)},GDEF||defs);stops(gr,[[0,P.l1],[.45,P.b],[1,P.d2]]);E('path',{d,fill:`url(#${id})`},g);
  const b0=PJ(B,O,ov(0,.02)),tip=PJ(B,O,ov(0,1));E('path',{d,fill:ugrad(b0[0],b0[1],tip[0],tip[1],[[0,'#6f8f3e',.95],[.42,'#7f9f4e',.55],[.8,'#8faf5e',.08],[1,'#8faf5e',0]])},g);
  if(!LOD){let rd='';for(let k=0;k<3;k++){const a=(k/3)*6.283+.35,q=[.08,.35,.65,.92].map(v=>PJ(B,O,ov(a,v)));const vis=toV(B,[Math.sin(a),Math.cos(a),0])[2];if(vis>-.2)rd+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d:rd,stroke:P.d2,'stroke-width':.6,'stroke-opacity':.5,fill:'none'},g)}
  E('path',{d,fill:'none',stroke:P.ink,'stroke-width':.5,'stroke-opacity':.35},g)}
/* a lily stem's head: a raceme — the stem rises behind the open flower(s), the youngest buds highest; its lower end is where the bouquet stem meets it */
function lilyHead(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||16)*UPC,k=G(g),Bc=frameOf(o,.4,true),K=LILY_K[kd],nod=K.face==='nod',sd=o.side??(rnd()<.5?-1:1);
  const nf=op<.3?0:kd==='asiatic'?2+(rnd()<.5?1:0):kd==='tiger'?2:1,nb=op<.3?3:kd==='gloriosa'?1:2,items=[];
  /* the stem: from the neck end, up behind the flowers, slightly bowed */
  const S0=fitDown(Bc,[sd*D*.05,-D*1.05,-D*.36],.3),S3=[-sd*D*.04,D*(nod?.75:.62),-D*.42],SC=[S0,[sd*D*.06,-D*.4,-D*.4],[0,D*.2,-D*.42],S3],sAt=q=>{const a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;return[0,1,2].map(j=>a*SC[0][j]+b*SC[1][j]+c*SC[2][j]+d*SC[3][j])};
  for(let i=0;i<nf;i++){const main=i===0,sx=main?0:(i%2?1:-1)*sd,q=main?.42:.36+.1*i,ax=nod?V3.nz([sx*.3+R(-.1,.1),-.8,.5]):V3.nz([sx*.5+R(-.08,.08),main?.06:-.08,1]),
      c=main?(nod?[0,-D*.12,D*.05]:[0,0,0]):[sx*D*.6,nod?-D*.05:-D*.18+D*.06*i,-D*.12];items.push({c,ax,bud:0,sz:main?1:.88,q})}
  for(let i=0;i<nb;i++){const s=(i%2?-1:1)*sd,q=(op<.3?.5:.66)+.12*i,n0=sAt(Math.min(.97,q)),len=D*(op<.3?[.64,.52,.42][i]:[.56,.44][i]||.36),ax=V3.nz([s*.32+R(-.08,.08),.9,nod?-.15:.22]);
    items.push({c:V3.add(n0,[s*D*.1,D*.08,D*.06]),ax,bud:1,len,q})}
  const scol=['#2e4a20','#4a7032','#6e9a48','#9cc070'],FS={B:Bc,O:[0,0,0],parts:[]},stem=[];for(let i=0;i<=12;i++)stem.push(sAt(i/12));
  FS.parts.push(tube3(FS,stem,q=>D*.028*(1-.4*q),{cols:[scol[1],scol[2],scol[1]],cap:1,hl:.3,dk:.45,spec:.2,ink:scol[0],eo:.3,cast:0}));
  for(const it of items){const n0=sAt(it.q),R0=it.bud?it.c:V3.add(it.c,V3.sc(it.ax,-D*.1)),P=[n0,V3.add(n0,[0,D*.1,D*.04]),V3.add(R0,V3.sc(it.ax,-D*.16)),R0],pts=[];for(let i=0;i<=8;i++){const q=i/8,a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;pts.push([0,1,2].map(j=>a*P[0][j]+b*P[1][j]+c*P[2][j]+d*P[3][j]))}
    FS.parts.push(tube3(FS,pts,D*.016,{cols:[scol[1],scol[2]],cap:0,hl:.3,dk:.4,spec:.15,ink:scol[0],eo:.25,cast:0}))}
  const nkp=neckPart(Bc,[0,0,0],S0,V3s(S0,SC[1]),D*.32,D*.056*1.1,{cols:scol});FS.parts.push(nkp.part);drawParts(k,FS.parts);items.sort((a,b)=>toV(Bc,a.c)[2]-toV(Bc,b.c)[2]);
  for(const it of items){const Ov=toV(Bc,it.c),Bf=frameIn(Bc,it.ax,R(-.2,.2));if(it.bud)lilyBud(k,Bf,Ov,it.len,cw,kd);else lilyFlower(k,Bf,Ov,D*it.sz,cw,op,kd)}
  open(k,t,1000,8,.3);return neckOut(nkp)}
const xLilyOri=(g,t,o)=>lilyHead(g,t,o,'oriental',CW_LORI),xLilyAsi=(g,t,o)=>lilyHead(g,t,o,'asiatic',CW_LASI),xLilyDbl=(g,t,o)=>lilyHead(g,t,o,'double',CW_LDBL),
  xLilyTig=(g,t,o)=>lilyHead(g,t,o,'tiger',CW_LTIG),xGlor2=(g,t,o)=>lilyHead(g,t,o,'gloriosa',CW_GLOR);
Object.assign(FN,{xLily:xLilyOri,xGlor:xGlor2});
Object.assign(GH,{'lis-oriental':xLilyOri,'lis-asiatique-la':xLilyAsi,'lis-oriental-double':xLilyDbl,'lis-tigre':xLilyTig,'gloriosa':xGlor2});
Object.assign(CWS,{'lis-oriental':CW_LORI,'lis-asiatique-la':CW_LASI,'lis-oriental-double':CW_LDBL,'lis-tigre':CW_LTIG,'gloriosa':CW_GLOR});
Object.assign(SZG,{'lis-oriental':[16,18,19,20,22],'lis-asiatique-la':[11,12,13,14,15],'lis-oriental-double':[15,16,17,18],'lis-tigre':[9,10,11],'gloriosa':[8,9,10,11]});
/* the leaves on their stems: lilies carry glossy lance leaves with parallel veins, scattered (asiatic, tiger: many and narrow); gloriosa ends its leaves in tendrils */
Object.assign(STEML,{'lis-oriental':{shape:'lance',n:[2,3],len:12,w:.26,col:'#355f2a',up:34,par:1,gloss:.5},'lis-oriental-double':{shape:'lance',n:[2,3],len:11,w:.26,col:'#355f2a',up:34,par:1,gloss:.5},
 'lis-asiatique-la':{shape:'lance',n:[3,4],len:9,w:.2,col:'#3a6a2c',up:30,par:1,gloss:.4},'lis-tigre':{shape:'lance',n:[3,5],len:9,w:.14,col:'#3f6a2a',up:40,par:1,gloss:.3},'gloriosa':{shape:'tendril',n:[2,3],len:9,w:.24,col:'#4a7a34',up:46,par:1,gloss:.35}});
