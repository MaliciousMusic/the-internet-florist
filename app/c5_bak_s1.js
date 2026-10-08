
/* ================= Composer v3 — garnish art and rendering ================= */
function gBerries(g,c){const k=G(g),n=7;for(let i=0;i<n;i++){const a=i/n*6.28+R(-.3,.3),r=R(5,12),x=Math.cos(a)*r,y=Math.sin(a)*r*.8-4;
  E('path',{d:`M0,12Q${f(x*.5)},${f(y*.5+6)} ${f(x)},${f(y)}`,stroke:'#5a4a2a','stroke-width':.7,fill:'none'},k);E('circle',{cx:f(x),cy:f(y),r:f(R(3,4.2)),fill:rad([[0,lt(c,.45)],[.6,c],[1,dk(c,.45)]],.35,.32,.75)},k);glint(k,x-1.2,y-1.4,1,.8,0,.7)}return k}
function gBurnet(g,c){const k=G(g);for(let i=0;i<3;i++){const ex=R(-18,18),ey=R(-30,-14);E('path',{d:`M0,12Q${f(ex*.3)},${f(ey*.4)} ${f(ex)},${f(ey)}`,stroke:'#4a3a2a','stroke-width':.7,fill:'none'},k);
  const h=G(k,{transform:`translate(${f(ex)},${f(ey)}) rotate(${f(R(-30,30))})`});E('ellipse',{rx:3.2,ry:5.2,fill:rad([[0,lt(c,.3)],[1,dk(c,.3)]],.4,.35,.7)},h);
  let d='';for(let j=0;j<10;j++){const y=R(-4.5,4.5),x=R(-2.6,2.6)*(1-Math.abs(y)/6);d+=`M${f(x-.4)},${f(y)}a.4,.4 0 1,0 .8,0a.4,.4 0 1,0 -.8,0`}E('path',{d,fill:dk(c,.45),opacity:.6},h)}return k}
function gBuds(g,c){const k=G(g);for(let i=0;i<3;i++){const x=R(-14,14),y=R(-18,4),ra=R(-35,35),bx=x-5*Math.sin(ra*D),by=y+5*Math.cos(ra*D);
  E('path',{d:`M0,12Q${f(bx*.3)},${f((by+12)/2)} ${f(bx)},${f(by)}`,stroke:'#4f7a34','stroke-width':1.1,fill:'none','stroke-linecap':'round'},k);const h=G(k,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ra)})`});
  E('path',{d:'M0,-9C5,-8 6,-2 4,3C2,6 -2,6 -4,3C-6,-2 -5,-8 0,-9Z',fill:lin([dk(c,.2),c,lt(c,.3)],0,1,0,0),stroke:dk(c,.4),'stroke-width':.5},h);
  for(const s of[-1,1])E('path',{d:`M0,5C${s*3},3 ${s*6},-1 ${s*6},-5C${s*4},-2 ${s*2},1 0,2Z`,fill:'#4f7a34'},h)}return k}
function gGrass(g,c){const k=G(g);for(let i=0;i<3;i++){const P=[[0,12],[R(-6,6),-8],[R(-14,14),-24],[R(-22,22),-38]];E('path',{d:cp(P),stroke:'#8a7a5a','stroke-width':.6,fill:'none'},k);
  for(let j=0;j<9;j++){const q=bz(P,.55+j*.05);E('ellipse',{cx:f(q[0]+R(-1.5,1.5)),cy:f(q[1]),rx:.9,ry:2.2,fill:c,transform:`rotate(${f(R(-30,30))} ${f(q[0])} ${f(q[1])})`},k)}}return k}
function garnishArt(g,type,P){const items=P.items.length?P.items:[{L:.5,S:.4,H:0,p:{col:'#e8a0b0'}}],dark=items.slice().sort((a,b)=>a.L-b.L)[0],warm=items.find(it=>it.S>.3)||items[0];
  if(type==='baies')return gBerries(g,dark&&dark.L<.4?'#3a0a1e':warm&&warm.H<50?'#a8321e':'#efe6d0');
  if(type==='sanguisorbe')return gBurnet(g,'#6a0e24');if(type==='boutons')return gBuds(g,(warm&&warm.p.col)||'#e8a0b0');return gGrass(g,'#c8b28a')}
/* where the visual centre of a view sits above its art origin (views drawn base-at-origin) */
function vcen(f0,vw){const R0=RAD[f0]||40;
  if(f0==='xCalla')return vw==='front'?92:vw==='bud'?59:96;
  if(vw==='side'){if(f0==='xRose'||f0==='xRanunc')return R0*.6;if(f0==='xCarn')return 31;if(f0==='xLily')return 52;if(f0==='xGlor')return 18;return 0}
  if(vw==='half'){if(f0==='xRose')return 15;if(f0==='xLily')return 50;return 0}
  if(vw==='bud'){if(f0==='xRose')return R0*.39;if(f0==='xCarn')return R0*.44;if(f0==='xLily')return 31;if(f0==='xAnth')return 29;return R0*.31}
  return 0}
/* growth from the base: an element scales up from the point where its stem starts, so stems rise from the vase (or the tie) before their flowers open */
const growUp=(el,x,y,t,d)=>tween(t,d,e=>el.setAttribute('transform',`translate(${f(x)},${f(y)}) scale(${(.01+.99*e).toFixed(3)}) translate(${f(-x)},${f(-y)})`),eo);
/* render the chosen candidate */
function buildBq(svg,ids,sv,vid,t0=150,occ,model,pc){const c=compose(ids,sv,occ||S.occ,vid,model),vc=model&&model.vcol&&vid===model.vase&&((VZ[vid]||{}).kind==='hand'||(VZ[vid]||{}).kind==='wrap')?model.vcol:null,tw0=tw.length;sd(sv*7+3);svg.innerHTML='';GDEF=E('defs',{},svg);
  /* cast shadow: each flower throws its own silhouette down and to the right onto what lies behind it (no blurred halo) */
  const csId='cs'+(gid++),cf=E('filter',{id:csId,x:'-30%',y:'-30%',width:'170%',height:'170%','color-interpolation-filters':'sRGB'},GDEF);
  E('feFlood',{'flood-color':'#2a160e','flood-opacity':.24,result:'c'},cf);E('feComposite',{in:'c',in2:'SourceAlpha',operator:'in',result:'s'},cf);E('feOffset',{in:'s',dx:5,dy:8,result:'o'},cf);
  E('feGaussianBlur',{in:'o',stdDeviation:.6,result:'b'},cf);const fm=E('feMerge',{},cf);E('feMergeNode',{in:'b'},fm);E('feMergeNode',{in:'SourceGraphic'},fm);
  const cast=(par,rr)=>{const w=G(par);if(rr>(LOD?24:14))w.setAttribute('filter',`url(#${csId})`);return w};const L={};for(const k of['plinth','vback','stems','back','mass','vase','front'])L[k]=G(svg,{'data-l':k});
  const v=VZ[vid]||VZ['coupe-blanche'],BP=c.BP,list=c.out.slice().sort((a,b)=>a.z-b.z);let n=0;const step=Math.max(40,1500/list.length),T=i=>t0+380+i*step;
  const pl=model?(model.plinth==='none'?null:model.plinth||v.pl):v.pl;
  /* the cut stems under the tie (or in the glass) rise first, from their cut ends */
  let stShow=22;
  if(v.kind==='hand'||v.kind==='wrap'){growUp(stemsBelow(L.stems,14,vid),BP[0],BP[1]+128,t0,560);if(v.kind==='wrap')wrapBack(L.back,BP,pc||vc||v.paper,c)}
  else{const sg=stage(L.plinth,v);stShow=sg.show;vessel(L.vback,vid,t0,{noPlinth:1,part:'back',shClip:sg.top});if(v.mat==='glass'||v.kind==='kenzan')growUp(stemsBelow(L.stems,12,vid),BP[0],FL-6,t0,560);vessel(L.vase,vid,t0,{noPlinth:1,part:'front'})}
  const SC=['#24401c','#3c6229','#5f8a3e','#a9c97a'],held=v.kind==='hand'||v.kind==='wrap',vTop=held?BP[1]:FL-vMh(v),mwV=vMouth(v)||26,mcx=VX+vMx(v);
  function stemTo(ex,ey,t,w0,w1,front,head){const bx=BP[0]+Math.max(-1,Math.min(1,(ex-BP[0])/Math.max(60,c.W*.5)))*mwV*.45+R(-3,3);
    if(!held&&front&&ey>vTop-4&&v.kind!=='kenzan'){const lx=mcx+Math.max(-.9,Math.min(.9,(ex-mcx)/mwV))*mwV,ly=vTop-5,
        A=[[bx,BP[1]+8],[bx+(lx-bx)*.2,ly-6],[lx-(lx-bx)*.25,ly-4],[lx,ly]],Bq=[[lx,ly],[lx+(ex-lx)*.45,ly-3],[ex,ly+(ey-ly)*.4],[ex,ey]],
        s1=stem3(L.stems,A,w0,w0*.85,SC,10),s2=stem3(L.front,Bq,w0*.85,w1,SC,10);let hn=head;while(hn&&hn.parentNode!==L.front)hn=hn.parentNode;if(hn)L.front.insertBefore(s2,hn);
      growUp(s1,bx,BP[1]+8,Math.max(0,t-520),520);growUp(s2,lx,ly,Math.max(0,t-260),300);return s1}
    const dy=BP[1]-ey,P=[[bx,BP[1]+8],[bx+(ex-bx)*.06,BP[1]-dy*.35],[ex-(ex-bx)*.3,ey+dy*.35],[ex,ey]],st=stem3(L.stems,P,w0,w1,SC,14);growUp(st,bx,BP[1]+8,Math.max(0,t-520),520);return st}
  /* every node an element draws is tagged with its index, whatever layer it lands in */
  let mk=null;const mark=i=>{if(mk)for(const k in L){const ch=L[k].children;for(let j=mk[k];j<ch.length;j++)ch[j].setAttribute('data-o',mk.i)}mk={i};for(const k in L)mk[k]=L[k].children.length};
  for(const o of list){mark(n);const t=T(n++);
    if(o.kind==='leaf'){const g=G(L.back);xAnthLeaf(g,t,{c:o.dark?['#060e09','#10261a','#1f4430','#3f6e4a','#86b48a']:undefined,pl:30,rot:0});bloom(g,o.x,o.y+30,o.rot,o.scale,t,900,-12);continue}
    if(o.kind==='drape'){const g=G(cast(L.front,30)),rec=o.it.p.rec,dr=rec.a==='drape'?rec:{a:'drape',cm:60,cols:[o.it.p.col],p:{type:'chenille'}};
      [[1,0,0],[.8,-20,0],[.62,24,0]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(0,${j*1.5})`});drawRec(h,t+j*90,dr,{col:o.it.p.col,len:o.len*k,sway:o.sway+sw*(o.side||1)})});
      bloom(g,o.x,o.y,0,1,t,1300,0);continue}
    if(o.kind==='garnish'){const g=G(L.mass);garnishArt(g,o.type,c.P);bloom(g,o.x,o.y,o.rot,o.scale,t,800,-10);
      const ga=o.rot*D;stemTo(o.x-12*o.scale*Math.sin(ga),o.y+12*o.scale*Math.cos(ga),t,2.6,1.2,false);continue}
    const sp=o.it.sp,rec=o.it.p.rec,cust=rec.a==='custom',c0=cmOf(o.it.p),col=o.it.p.col;
    if(o.kind==='self'){const clu=!(o.role==='line'||o.role==='foliage');let wrap=null;
      /* a bent stem: the element follows its spine from the mouth; the lower part of a cluster's stem joins the other stems */
      const draw=()=>{wrap=clu?cast(o.front?L.front:L.mass,o.rr||20):null;const g=G(wrap||L.back);
        if(o.spine){drawRec(g,t,rec,{col,spine:o.spine,from:o.from||0});bloom(g,o.x,o.y,0,1,t,1000,-4)}
        else{drawRec(g,t,rec,{col,len:sp.self===0?o.len:undefined});bloom(g,o.x,o.y,o.rot,o.scale,t,1000,-10)}};
      const w0=tw.length;draw();
      /* a cluster never hangs behind the vessel: measured in full, its stem is lengthened until the fruit clears the rim */
      if(clu&&o.spine&&!held)for(let k=0;k<4;k++){try{const ws=tw.slice(w0);for(const w of ws)w.fn(1,1);const b=wrap.getBBox();for(const w of ws)w.fn(0,0);const bot=b.y+b.height;
          let lim=FL;for(let i=0;i<=8;i++)lim=Math.min(lim,vSilTop(v,b.x+b.width*i/8));const ey=o.spine[3][1];if(!b.width||bot<=lim-8||ey>-5)break;
          const s=1+(bot-(lim-12))/Math.abs(ey);o.spine=o.spine.map(p=>[p[0],p[1]*s]);wrap.remove();tw.length=w0;draw()}catch(_){break}}
      if(o.spine&&o.from){const st=stem3(L.stems,bseg(o.spine.map(p=>[p[0]+o.x,p[1]+o.y]),0,Math.min(1,o.from+.03)),3.4,2.4,SC,12);growUp(st,o.x,o.y,Math.max(0,t-520),520)}
      continue}
    /* real-size head: 3D species are oriented along their stem; 2D drawings are rotated and scaled to their real size */
    const rr=o.rr||(sp.r||40);let ex,ey,g;
    const head=()=>{const par=cast(o.front?L.front:L.mass,rr);g=G(par);
      if(o.it.d3){const a=o.ax||[0,0,1];ex=o.x;ey=o.y;drawRec(g,t,rec,{col,ax:a,cm:o.cm,op:o.st==='bud'?.14:o.st==='half'?.5:R(.86,1),roll:R(-.6,.6)});bloom(g,o.x,o.y,0,1,t,1000,-12)}
      else{const fn=cust?(rec.p||{}).fn:null,vw=fn&&o.st==='bud'&&hasView(fn,'bud')?'bud':fn&&o.st==='half'&&hasView(fn,'half')?'half':'face',sc=(cust?artK(fn):1)*(o.cm||c0)/c0,dyA=vw!=='face'?vcen(fn,vw):(sp.an?-sp.an[1]:0),th=o.rot*D;
        ex=o.x-dyA*sc*Math.sin(th);ey=o.y+dyA*sc*Math.cos(th);const inner=dyA?G(g,{transform:`translate(0,${f(dyA)})`}):g;if(cust&&vw!=='face')drawView(inner,t,fn,customOpts(fn,col,rec.c2),vw);else drawRec(inner,t,rec,{col});bloom(g,o.x,o.y,o.rot,sc,t,1000,-20)}
      return par};
    const w0=tw.length;let hp=head();
    /* a head behind the vessel never dips below its rim: measured in full bloom, it is raised before its stem is drawn */
    if(!held&&!o.front&&o.y+rr*4>FL-vH(v))try{const ws=tw.slice(w0);for(const w of ws)w.fn(1,1);const b=hp.getBBox();for(const w of ws)w.fn(0,0);const bot=b.y+b.height;
      /* the silhouette of the vessel under the head (its rim, its shoulders, the lobes of a heart) */
      let lim=FL;for(let i=0;i<=8;i++)lim=Math.min(lim,vSilTop(v,b.x+b.width*i/8));
      /* a head that reaches the rim rests ON the lip, in front of it (never cut by it); one hanging lower is first raised to overhang the lip by at most half its size */
      if(b.width&&(bot>lim-8||bot>FL-2)){{const ok=Math.max(0,Math.min(rr*.6,FL-2-lim));
        if(bot>lim+ok){hp.remove();tw.length=w0;o.y-=bot-(lim+ok);hp=head()}L.front.appendChild(hp);o.front=true}}}catch(_){}
    /* every head keeps its whole stem from the mouth to its receptacle */
    stemTo(ex,ey,t,o.role==='line'?3.2:4,2.4,!!o.front,g)}
  mark(-1);mk=null;
  if(v.kind==='wrap'){wrapFront(L.front,BP,pc||vc||v.paper,c);growUp(bow(L.front,BP[0],BP[1]+30,v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
  if(v.kind==='hand')growUp(bow(L.front,BP[0],BP[1]+16,vc||v.rib,.8),BP[0],BP[1]+16,t0+420,420);
  /* frame on the real silhouette */
  let x0=BP[0]-120,x1=BP[0]+120,y0=BP[1]-c.H,y1=v.kind==='hand'||v.kind==='wrap'?BP[1]+170:FL+stShow;
  for(const o of c.out){if(o.kind==='head'||o.kind==='leaf'||o.kind==='garnish'){const r=o.kind==='leaf'?110*o.scale:o.kind==='garnish'?24*o.scale:(o.rr||40);x0=Math.min(x0,o.x-r);x1=Math.max(x1,o.x+r);y0=Math.min(y0,o.y-r)}
    if(o.role==='line'){x0=Math.min(x0,o.ex-36);x1=Math.max(x1,o.ex+36);y0=Math.min(y0,o.ey-50)}
    if(o.kind==='drape'){x0=Math.min(x0,o.x-Math.abs(o.sway)-30);x1=Math.max(x1,o.x+Math.abs(o.sway)+30);y1=Math.max(y1,o.y+o.len+20)}}
  /* then frame on what is really drawn: every layer measured with its animations at their end, so nothing is ever cut off */
  let mg=30;try{const ws=tw.slice(tw0);for(const w of ws)w.fn(1,1);let bb=null;for(const k in L){if(k==='plinth')continue;const b=L[k].getBBox();if(!(b.width||b.height))continue;
      bb=bb?[Math.min(bb[0],b.x),Math.min(bb[1],b.y),Math.max(bb[2],b.x+b.width),Math.max(bb[3],b.y+b.height)]:[b.x,b.y,b.x+b.width,b.y+b.height]}
    for(const w of ws)w.fn(0,0);if(bb&&bb[2]-bb[0]>60){x0=bb[0];x1=bb[2];y0=bb[1];y1=v.kind==='hand'||v.kind==='wrap'?bb[3]:Math.max(bb[3],FL+stShow);mg=Math.max(x1-x0,y1-y0)*.035}}catch(_){}
  GDEF=null;const cx=(x0+x1)/2,w=x1-x0+2*mg,h=y1-y0+2*mg;svg.setAttribute('viewBox',`${f(cx-w/2)} ${f(y0-mg)} ${f(w)} ${f(h)}`);
  /* the breeze: the whole bouquet sways a third of a degree around the mouth; lines and leaves a little more and a beat later; a held bouquet sways as one */
  for(const k of['stems','mass','front'])breeze(L[k],BP[0],BP[1],.32);breeze(L.back,BP[0],BP[1],held?.32:.55,held?0:420);svg.dataset.tpl=c.tk;c.list=list;svg.dataset.n=c.out.filter(o=>o.kind==='head'||o.kind==='self'||o.kind==='drape').length;return c}
