
/* ================= Composer v3 — garnish art and rendering ================= */
function gBerries(g,c){const k=G(g),n=7;for(let i=0;i<n;i++){const a=i/n*6.28+R(-.3,.3),r=R(5,12),x=Math.cos(a)*r,y=Math.sin(a)*r*.8-4;
  E('path',{d:`M0,10Q${f(x*.5)},${f(y*.5+6)} ${f(x)},${f(y)}`,stroke:'#5a4a2a','stroke-width':.7,fill:'none'},k);E('circle',{cx:f(x),cy:f(y),r:f(R(3,4.2)),fill:rad([[0,lt(c,.45)],[.6,c],[1,dk(c,.45)]],.35,.32,.75)},k);glint(k,x-1.2,y-1.4,1,.8,0,.7)}return k}
function gBurnet(g,c){const k=G(g);for(let i=0;i<3;i++){const ex=R(-18,18),ey=R(-30,-14);E('path',{d:`M0,12Q${f(ex*.3)},${f(ey*.4)} ${f(ex)},${f(ey)}`,stroke:'#4a3a2a','stroke-width':.7,fill:'none'},k);
  const h=G(k,{transform:`translate(${f(ex)},${f(ey)}) rotate(${f(R(-30,30))})`});E('ellipse',{rx:3.2,ry:5.2,fill:rad([[0,lt(c,.3)],[1,dk(c,.3)]],.4,.35,.7)},h);
  let d='';for(let j=0;j<10;j++){const y=R(-4.5,4.5),x=R(-2.6,2.6)*(1-Math.abs(y)/6);d+=`M${f(x-.4)},${f(y)}a.4,.4 0 1,0 .8,0a.4,.4 0 1,0 -.8,0`}E('path',{d,fill:dk(c,.45),opacity:.6},h)}return k}
function gBuds(g,c){const k=G(g);for(let i=0;i<3;i++){const x=R(-14,14),y=R(-18,4),h=G(k,{transform:`translate(${f(x)},${f(y)}) rotate(${f(R(-35,35))})`});
  E('path',{d:'M0,-9C5,-8 6,-2 4,3C2,6 -2,6 -4,3C-6,-2 -5,-8 0,-9Z',fill:lin([dk(c,.2),c,lt(c,.3)],0,1,0,0),stroke:dk(c,.4),'stroke-width':.5},h);
  for(const s of[-1,1])E('path',{d:`M0,5C${s*3},3 ${s*6},-1 ${s*6},-5C${s*4},-2 ${s*2},1 0,2Z`,fill:'#4f7a34'},h);E('path',{d:'M0,5V12',stroke:'#4f7a34','stroke-width':1.2},h)}return k}
function gGrass(g,c){const k=G(g);for(let i=0;i<3;i++){const P=[[0,10],[R(-6,6),-8],[R(-14,14),-24],[R(-22,22),-38]];E('path',{d:cp(P),stroke:'#8a7a5a','stroke-width':.6,fill:'none'},k);
  for(let j=0;j<9;j++){const q=bz(P,.55+j*.05);E('ellipse',{cx:f(q[0]+R(-1.5,1.5)),cy:f(q[1]),rx:.9,ry:2.2,fill:c,transform:`rotate(${f(R(-30,30))} ${f(q[0])} ${f(q[1])})`},k)}}return k}
function garnishArt(g,type,P){const items=P.items,dark=items.slice().sort((a,b)=>a.L-b.L)[0],warm=items.find(it=>it.S>.3)||items[0];
  if(type==='baies')return gBerries(g,dark&&dark.L<.4?'#3a0a1e':warm&&warm.H<50?'#a8321e':'#efe6d0');
  if(type==='sanguisorbe')return gBurnet(g,'#6a0e24');if(type==='boutons')return gBuds(g,(warm&&warm.p.col)||'#e8a0b0');return gGrass(g,'#c8b28a')}
/* where the visual centre of a view sits above its art origin (views drawn base-at-origin) */
function vcen(f0,vw){const R0=RAD[f0]||40;
  if(f0==='xCalla')return vw==='front'?92:vw==='bud'?59:96;
  if(vw==='side'){if(f0==='xRose'||f0==='xRanunc')return R0*.6;if(f0==='xCarn')return 31;if(f0==='xLily')return 52;if(f0==='xGlor')return 18;return 0}
  if(vw==='half'){if(f0==='xRose')return 15;if(f0==='xLily')return 50;return 0}
  if(vw==='bud'){if(f0==='xRose')return R0*.39;if(f0==='xCarn')return R0*.44;if(f0==='xLily')return 31;if(f0==='xAnth')return 29;return R0*.31}
  return 0}
/* render the chosen candidate */
function buildBq(svg,ids,sv,vid,t0=150,occ){const c=compose(ids,sv,occ||S.occ,vid);sd(sv*7+3);svg.innerHTML='';GDEF=E('defs',{},svg);const L={};for(const k of['plinth','vback','stems','back','mass','vase','front'])L[k]=G(svg);
  const v=VZ[vid]||VZ['coupe-blanche'],BP=c.BP,list=c.out.slice().sort((a,b)=>a.z-b.z);let n=0;const step=Math.max(40,1500/list.length),T=i=>t0+380+i*step;
  if(v.kind==='hand'||v.kind==='wrap'){stemsBelow(L.stems,14,vid);if(v.kind==='wrap')wrapBack(L.back,BP,v.paper)}
  else{plinth(L.plinth,v.pl);vessel(L.vback,vid,t0,{noPlinth:1,part:'back'});if(v.kind==='glass'||v.kind==='kenzan')stemsBelow(L.stems,12,vid);vessel(L.vase,vid,t0,{noPlinth:1,part:'front'})}
  const SC=['#24401c','#3c6229','#5f8a3e','#a9c97a'];
  for(const o of list){const t=T(n++);
    if(o.kind==='leaf'){const g=G(L.back);xAnthLeaf(g,t,{c:o.dark?['#060e09','#10261a','#1f4430','#3f6e4a','#86b48a']:undefined,pl:30,rot:0});bloom(g,o.x,o.y+30,o.rot,o.scale,t,900,-12);continue}
    if(o.kind==='drape'){const g=G(L.front);if(o.it.f==='xPhalSpray')xPhalSpray(G(g,{transform:`scale(${o.side},1)`}),t,Object.assign({},o.it.p.o,{hang:1,side:1,len:o.len*.75,n:5}));
      else[[1,0,0],[.8,-20,-8],[.62,24,9]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(${dx*(o.side||1)},${j*3})`});amaranth(h,t+j*90,Object.assign({},o.it.p.o,{len:o.len*k,sway:o.sway+sw*(o.side||1)}))});
      bloom(g,o.x,o.y,0,1,t,1300,0);continue}
    if(o.kind==='garnish'){const g=G(L.mass);garnishArt(g,o.type,c.P);bloom(g,o.x,o.y,o.rot,o.scale,t,800,-10);
      const sp=E('path',{d:`M${f(BP[0]+R(-12,12))},${f(BP[1]+6)}Q${f((BP[0]+o.x)/2)},${f((BP[1]+o.y)/2+20)} ${f(o.x)},${f(o.y+10)}`,stroke:'#4a6a34','stroke-width':1.6,fill:'none'},L.stems);grow(sp,Math.max(0,t-400),500);continue}
    const sp=o.it.sp,fn=FN[o.it.f],opt=Object.assign({},o.it.p.o);
    if(o.kind==='self'){if(sp.self===0)opt.len=o.len;const g=G(L.back);fn(g,t,opt);bloom(g,o.x,o.y,o.rot,o.scale,t,1000,-10);continue}
    /* real-size head: 3D species are oriented along their stem; 2D drawings are rotated and scaled to their real size */
    const inCore=(c.lobes||[c.ell]).some(l=>((o.x-l.cx)/l.rx)**2+((o.y-l.cy)/l.ry)**2<.7),rr=o.rr||(sp.r||40);let ex,ey,g;
    if(o.it.d3){const a=o.ax||[0,0,1];ex=o.x-a[0]*rr*.3;ey=o.y+a[1]*rr*.3;g=G(o.front?L.front:L.mass);if(!o.front&&o.behind)ao(g,4,8,rr*.95,rr*.85,.2);
      fn(g,t,Object.assign(opt,{ax:a,cm:o.cm,op:o.st==='bud'?.14:o.st==='half'?.5:R(.86,1),roll:R(-.6,.6)}));bloom(g,o.x,o.y,0,1,t,1000,-12)}
    else{const vw=o.st==='bud'&&hasView(o.it.f,'bud')?'bud':o.st==='half'&&hasView(o.it.f,'half')?'half':'face',sc=artK(o.it.f)*(o.cm||CM[o.it.f]||7)/(CM[o.it.f]||7),dyA=vw!=='face'?vcen(o.it.f,vw):(sp.an?-sp.an[1]:0),th=o.rot*D;
      ex=o.x-dyA*sc*Math.sin(th);ey=o.y+dyA*sc*Math.cos(th);g=G(o.front?L.front:L.mass);if(!o.front&&o.behind)ao(g,4,8,rr*.95,rr*.85,.2);
      const inner=dyA?G(g,{transform:`translate(0,${f(dyA)})`}):g;drawView(inner,t,o.it.f,opt,vw);bloom(g,o.x,o.y,o.rot,sc,t,1000,-20)}
    /* stems show only where the eye can see them: outer flowers, lines, and the bundle entering the mouth */
    const bx=BP[0]+R(-14,14),dy=BP[1]-ey,full=o.outer||o.role==='line'||o.role==='rim'||v.kind==='glass'||v.kind==='kenzan'||v.kind==='hand'||v.kind==='wrap',
      P=[[bx,BP[1]+8],[bx+R(-8,8),BP[1]-dy*.35],[ex-(ex-bx)*.3,ey+dy*.35],[ex,ey]];
    if(full||rnd()<.35){const st=stem3(L.stems,full?P:[P[0],P[1],bz(P,.45),bz(P,.6)],o.role==='line'?3.2:4,full?2.4:3.4,SC,14);fade(st,Math.max(0,t-450),450,0)}}
  if(v.kind==='wrap'){wrapFront(L.front,BP,v.paper);bow(L.front,BP[0],BP[1]+30,v.rib,.6)}
  if(v.kind==='hand')bow(L.front,BP[0],BP[1]+16,v.rib,.8);if(v.kind==='kenzan')bow(L.front,BP[0],BP[1]+4,'#b98a4a',.35);
  /* frame on the real silhouette */
  let x0=BP[0]-120,x1=BP[0]+120,y0=BP[1]-c.H,y1=v.kind==='hand'||v.kind==='wrap'?BP[1]+170:FL+22;
  for(const o of c.out){if(o.kind==='head'||o.kind==='leaf'||o.kind==='garnish'){const r=o.kind==='leaf'?110*o.scale:o.kind==='garnish'?24*o.scale:(o.rr||40);x0=Math.min(x0,o.x-r);x1=Math.max(x1,o.x+r);y0=Math.min(y0,o.y-r)}
    if(o.role==='line'){x0=Math.min(x0,o.ex-36);x1=Math.max(x1,o.ex+36);y0=Math.min(y0,o.ey-50)}
    if(o.kind==='drape'){x0=Math.min(x0,o.x-Math.abs(o.sway)-30);x1=Math.max(x1,o.x+Math.abs(o.sway)+30);y1=Math.max(y1,o.y+o.len+20)}}
  GDEF=null;const cx=(x0+x1)/2,w=x1-x0+60,h=y1-y0+50;svg.setAttribute('viewBox',`${f(cx-w/2)} ${f(y0-30)} ${f(w)} ${f(h)}`);svg.dataset.tpl=c.tk;svg.dataset.n=c.out.filter(o=>o.kind==='head'||o.kind==='self'||o.kind==='drape').length;return c}
