
/* ================= Composer v3 — garnish art and rendering ================= */
/* where the drape being drawn hangs (its origin, side, the vessel's lip and floor), for the species that route their strands over the lip */
let DRAPEX=null;
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
/* the stems seen inside the vessel are marked, so the grow-in (z5.js) makes them grow from the mouth down */
const inStems=el=>{if(el&&el.setAttribute)el.setAttribute('data-in','1');return el};
const growUp=(el,x,y,t,d)=>tween(t,d,e=>el.setAttribute('transform',`translate(${f(x)},${f(y)}) scale(${(.01+.99*e).toFixed(3)}) translate(${f(-x)},${f(-y)})`),eo);
/* render the chosen candidate */
/* ---------- depth: the bouquet seen in three planes ----------
   every element takes its depth from its rank in the drawing order (0 the very front … 1 the very back): the front stays as it is and
   casts the clearest shadow; the middle sits a touch in the bouquet's own shade; the back is veiled by the room's air, a little paler
   toward the wall's colour (DEPTH_BG, the bouquet's background) and less saturated. No blur, no glow. */
let DEPTH_BG='#efe8de',DEPTH_PS=.16;
const DEPTH_LV=[null,{sh:.05},{sh:.09},{v:.16,ds:.15,sh:.03},{v:.28,ds:.26,sh:.02}],depthLevel=dd=>dd<.34?0:dd<.5?1:dd<.67?2:dd<.84?3:4;
function depthTint(lv){const P=DEPTH_LV[lv];if(!P)return null;const bg=DEPTH_BG,memo=new Map(),
    col=c=>{let x=memo.get(c);if(x)return x;const[r,g,b]=hx(c),y=.3*r+.59*g+.11*b;x=P.ds?hs([r+(y-r)*P.ds,g+(y-g)*P.ds,b+(y-b)*P.ds]):c;if(P.v)x=mix(x,bg,P.v);if(P.sh)x=mix(x,'#2b211c',P.sh);memo.set(c,x);return x},
    fn=a=>{let o=null;for(const k of LIFE_KEYS){const v=a[k];if(typeof v==='string'&&v.length===7&&v[0]==='#'){const nv=col(v);if(nv!==v){if(!o)o=Object.assign({},a);o[k]=nv}}}return o||a};
  fn.key='~d'+lv+bg;return fn}
/* heartsFree: the last word on overlaps, on the shapes as drawn. Pieces: in the back, mass and front layers, a head's own groups (data-h)
   make one piece with a heart (the middle of its box, a third of its smaller half-side: 5 points); every other group (a cluster, a drape, the
   stem a rim flower lays over the lip) is a piece of its own. A heart is covered by a piece painted after it when that piece's geometry
   (fill or stroke, <use> resolved) holds 3 of its 5 points: computed once, the order alone then decides. While some heart is covered, the
   head is lifted just above the piece, or the piece sent just below the head (same layer; never a head the player set at the back out of
   its layer), whichever leaves fewer hearts covered (three passes). Returns the hearts still covered (c.heartsLeft) */
function heartsFree(L,list,c){const lay=[L.deep,L.back,L.mass,L.front],P=[],byEl=new Map();
  lay.forEach((Ly,li)=>{for(const n of Ly.children){const i=+n.getAttribute('data-o');if(!(i>=0))continue;const o=list[i];
    if(n.hasAttribute('data-h')&&o&&o.kind==='head'){let p=byEl.get(i);if(!p){p={i,o,gs:[],li,head:1};byEl.set(i,p);P.push(p)}p.gs.push(n)}else P.push({i,o,gs:[n],li})}});
  const box=gs=>{let bb=null;for(const g of gs){const b=g.getBBox();if(!b.width&&!b.height)continue;bb=bb?[Math.min(bb[0],b.x),Math.min(bb[1],b.y),Math.max(bb[2],b.x+b.width),Math.max(bb[3],b.y+b.height)]:[b.x,b.y,b.x+b.width,b.y+b.height]}return bb};
  const svg=L.mass.ownerSVGElement,ref=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id),GEO='path,ellipse,circle,rect,polygon,polyline,line';
  /* the painted shapes of a piece: [element, matrix from the root to its own space] (a <use> resolved to what it shows, one level deep) */
  const shapes=p=>{const S=[];for(const g of p.gs)for(const el of g.querySelectorAll(GEO+',use')){if(el.closest('clipPath,mask'))continue;const M=el.getCTM();if(!M)continue;
      if(el.tagName!=='use'){S.push([el,M.inverse()]);continue}
      const t=ref((el.getAttribute('href')||el.getAttribute('xlink:href')||'').slice(1));if(!t)continue;const m0=M.translate(+el.getAttribute('x')||0,+el.getAttribute('y')||0);
      const add=(k,m)=>{const tf=k.transform&&k.transform.baseVal.consolidate(),mm=tf?m.multiply(tf.matrix):m;if(k.matches(GEO))S.push([k,mm.inverse(),el]);else for(const ch of k.children)add(ch,mm)};add(t,m0)}
    return S};
  const paints=(S,x,y)=>{for(const[el,Mi,u]of S){const q=new DOMPoint(x,y).matrixTransform(Mi),src=u||el,f=src.getAttribute('fill')??el.getAttribute('fill'),st=el.getAttribute('stroke');
      try{if(f!=='none'&&el.isPointInFill(q))return true;if(st&&st!=='none'&&el.isPointInStroke(q))return true}catch(_){}}return false};
  for(const p of P){p.bb=box(p.gs);if(p.head&&p.bb){const w=(p.bb[2]-p.bb[0])/2,h=(p.bb[3]-p.bb[1])/2,cx=p.bb[0]+w,cy=p.bb[1]+h,r=Math.min(w,h)*.35;p.k=[[cx,cy],[cx-r*.6,cy],[cx+r*.6,cy],[cx,cy-r*.6],[cx,cy+r*.6]]}}
  /* a head clearly bigger (1.3 times its box) hiding a smaller one's heart is depth, not clipping */
  const area=p=>p.bb?(p.bb[2]-p.bb[0])*(p.bb[3]-p.bb[1]):0;
  const cov=new Map();for(const a of P){if(!a.bb)continue;let S=null;for(const b of P){if(!b.k||b===a||b.i===a.i||a.head&&area(a)>=area(b)*1.3)continue;const[x,y]=b.k[0];if(x<a.bb[0]||x>a.bb[2]||y<a.bb[1]||y>a.bb[3])continue;
      S=S||shapes(a);let n=0;for(const[px,py]of b.k)if(paints(S,px,py)&&++n>=3)break;if(n>=3){if(!cov.has(a))cov.set(a,new Set());cov.get(a).add(b)}}}
  const key=p=>p.li*1e6+[...p.gs[0].parentNode.children].indexOf(p.gs[0]),
    covered=()=>{const K=new Map(P.map(p=>[p,key(p)])),R=[];for(const[a,B]of cov)for(const b of B)if(K.get(a)>K.get(b))R.push([a,b]);return R};
  const at=gs=>gs.map(g=>[g,g.nextSibling,g.parentNode]),back=A=>{for(const[g,nx,par]of A.slice().reverse())par.insertBefore(g,nx)};
  let R=covered();for(let pass=0;pass<3&&R.length;pass++){for(const[a,b]of R){if(!(key(a)>key(b)))continue;const n0=covered().length;
      if(!(b.o.back&&a.li!==b.li)){const s=at(b.gs);a.gs[a.gs.length-1].after(...b.gs);if(covered().length<n0)continue;back(s)}
      if(a.gs[0].parentNode===b.gs[0].parentNode){const s=at(a.gs);b.gs[0].before(...a.gs);if(covered().length<n0)continue;back(s)}}
    R=covered()}
  c.heartsLeft=R.length;return R.length}
/* stemsOver: in a fading bouquet (LIFE: Déclin, Fané) the heads nod and spread past the footprints c4 composed them on, so a head painted
   behind another may come to lie over that other's stem, which then seems to run through it. The stem stays in front of it: what that stem
   carries in the stems layers (its stem, its neck, the axis of a plant head) is drawn again over the heads it runs under, by reference
   (<use>, nothing copied), masked to those heads and the shadows they cast (a little wider, for the breeze), less the stems of the heads in
   front of its own painted below it that pass there: it shows only over those heads, meets the stem below without a seam and never crosses
   a stem it passed behind. It is a still piece (no data-o: z5 keeps it with the stems; data-so names the stem), kept above the vessel; the
   heads keep their order, the composition its places. On the shapes as drawn, as heartsFree (every animation at its end), the stem sampled
   as lab/coeurs.js does. Returns the stems brought forward */
function stemsOver(L,list,c,v){const svg=L.mass.ownerSVGElement,R0=L.mass.getCTM(),DF=GDEF||defs;if(!svg||!R0||!DF)return 0;const Ri=R0.inverse(),key=new Map();
  [...svg.children].filter(n=>n.getAttribute&&n.getAttribute('data-l')).forEach((Ly,li)=>{let j=0;for(const n of Ly.children)key.set(n,li*1e6+j++)});
  const GEO='path,ellipse,circle,rect,polygon,polyline,line',ref=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id),
    top=x=>v&&v.prof?vSilTop(v,x):c.BP[1],box=(el,M)=>{try{const b=el.getBBox(),P=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(M)),X=P.map(p=>p.x),Y=P.map(p=>p.y);
      return[Math.min(...X)-1,Math.min(...Y)-1,Math.max(...X)+1,Math.max(...Y)+1]}catch(_){return null}},inB=(b,x,y)=>b&&x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3],
    meet=(a,b)=>a&&b&&a[0]<=b[2]&&b[0]<=a[2]&&a[1]<=b[3]&&b[1]<=a[3],NB=new Map(),nbox=n=>{if(!NB.has(n)){const C=n.getCTM();NB.set(n,C?box(n,Ri.multiply(C)):null)}return NB.get(n)};
  /* the painted shapes of a piece: {el, M from its own space to the root, Mi, its box in the root, u the <use> it is seen through} */
  const SH=new Map(),shapes=n=>{let S=SH.get(n);if(S)return S;S=[];SH.set(n,S);
    for(const el of n.matches(GEO+',use')?[n]:n.querySelectorAll(GEO+',use')){if(el.closest('clipPath,mask,defs,symbol,pattern,marker'))continue;const C=el.getCTM();if(!C)continue;const M=Ri.multiply(C),bb=box(el,M);if(!bb)continue;
      if(el.tagName!=='use'){S.push({el,M,Mi:M.inverse(),bb});continue}
      const t=ref((el.getAttribute('href')||el.getAttribute('xlink:href')||'').slice(1));if(!t)continue;
      const add=(k,m)=>{const tf=k.transform&&k.transform.baseVal.consolidate(),mm=tf?m.multiply(tf.matrix):m;if(k.matches(GEO))S.push({el:k,M:mm,Mi:mm.inverse(),bb,u:el});else for(const ch of k.children)add(ch,mm)};
      add(t,M.translate(+el.getAttribute('x')||0,+el.getAttribute('y')||0))}
    return S};
  /* whether a shape is filled, stroked */
  const pnt=s=>{if(!s.p){const a=k=>(s.u||s.el).getAttribute(k)??s.el.getAttribute(k)??(s.u?null:getComputedStyle(s.el)[k]),st=a('stroke');s.p=[a('fill')!=='none',!!st&&st!=='none']}return s.p};
  const paints=(S,x,y)=>{for(const s of S){if(!inB(s.bb,x,y))continue;const q=new DOMPoint(x,y).matrixTransform(s.Mi),[pf,ps]=pnt(s);
      try{if(pf&&s.el.isPointInFill(q))return true;if(ps&&s.el.isPointInStroke(q))return true}catch(_){}}return false};
  /* the pieces painted in the head layers (a head's groups, a cluster, a drape...), the topmost first; where each element stands (its first piece) */
  const pcs=[],hk=new Map();for(const Ly of[L.back,L.mass,L.front])for(const n of Ly.children){const e=+n.getAttribute('data-o');if(e>=0){const k=key.get(n);pcs.push({n,e,k});if(!(hk.get(e)<=k))hk.set(e,k)}}pcs.sort((a,b)=>b.k-a.k);
  const stl=[];for(const Ly of[L.stems,L.fst])for(const n of Ly.children){const e=+n.getAttribute('data-o');if(e>=0)stl.push({n,e,k:key.get(n)})}
  const jobs=[];
  for(let i=0;i<list.length;i++){const o=list[i];if(o.kind!=='head'||!o.stemP||!o.stN||!o.stN.length||o.rim)continue;const k0=key.get(o.stN[0]);let k1=Infinity,h1=null;
    for(const p of pcs)if(p.e===i&&p.n.hasAttribute('data-h')&&p.k<k1){k1=p.k;h1=p.n}if(!(k0>=0)||!h1)continue;
    /* painted after the stem and before its head: behind the head, yet over the stem */
    const cand=pcs.filter(p=>p.e!==i&&p.k>k0&&p.k<k1);if(!cand.length)continue;
    for(const p of cand)if(p.bb===undefined)p.bb=nbox(p.n);
    const pts=[...Array(61)].map((_,j)=>bz(o.stemP,j/60)).concat(o.np||[]),ks=new Set(),hit=[];
    for(const q of pts){if(q[1]>top(q[0])-1)continue;for(const p of cand)if(inB(p.bb,q[0],q[1])&&paints(shapes(p.n),q[0],q[1])){ks.add(p);hit.push(q);break}}
    if(ks.size)jobs.push({i,o,h1,k1,hit,ks:[...ks].sort((a,b)=>a.k-b.k)})}
  const useOf=(n,par,a={})=>{if(!n.id)n.id='so'+(gid++);return E('use',Object.assign({href:'#'+n.id},a),par)},AX='[clip-path^="url(#sc"]',
    isAx=e=>{const cp=ref(e.getAttribute('clip-path').slice(5,-1));return!!(cp&&cp.firstElementChild&&cp.firstElementChild.tagName==='path'&&e.firstElementChild&&e.firstElementChild.hasAttribute('filter'))},
    mat=m=>`matrix(${[m.a,m.b,m.c,m.d,m.e,m.f].map(x=>+x.toFixed(4)).join(',')})`;
  /* the mask filters: wherever a piece paints, even faintly, in white widened by 2, in white, or in black */
  let fW=null,fw,fB;const flt=(col,dil)=>{const fi=E('filter',{id:'so'+(gid++),x:'-10%',y:'-10%',width:'120%',height:'120%'},DF),ct=E('feComponentTransfer',{in:'SourceAlpha',result:'a'},fi);E('feFuncA',{type:'linear',slope:1000},ct);
    if(dil)E('feMorphology',{in:'a',operator:'dilate',radius:2,result:'a'},fi);E('feFlood',{'flood-color':col},fi);E('feComposite',{in2:'a',operator:'in'},fi);return`url(#${fi.id})`};
  for(const{i,o,h1,k1,hit,ks}of jobs){if(!fW){fW=flt('#fff',1);fw=flt('#fff',0);fB=flt('#000',0)}let bb=null;
    /* where it goes: just under its own head, or at the end of the layer of the topmost head it runs under when that layer lies lower (the
       forward stems, painted between, stay over it) */
    const hi=ks[ks.length-1],same=hi.n.parentNode===h1.parentNode,Pk=same?k1-.5:Math.floor(hi.k/1e6)*1e6+999999;
    for(const p of ks)bb=bb?[Math.min(bb[0],p.bb[0]),Math.min(bb[1],p.bb[1]),Math.max(bb[2],p.bb[2]),Math.max(bb[3],p.bb[3])]:p.bb.slice();bb=[bb[0]-12,bb[1]-12,bb[2]+12,bb[3]+12];
    /* the mask (every piece drawn by reference, nothing copied): the heads the stem runs under in white, widened, with the shadows they cast;
       less every stem of a head in front of this one, but inside each of those heads only the stems painted over it */
    const mk=E('mask',{id:'so'+(gid++),maskUnits:'userSpaceOnUse',x:f(bb[0]),y:f(bb[1]),width:f(bb[2]-bb[0]),height:f(bb[3]-bb[1])},DF);for(const p of ks)useOf(p.n,mk,{filter:fW});
    const fr=stl.filter(s=>s.e!==i&&hk.get(s.e)>k1&&s.k<Pk&&meet(nbox(s.n),bb)),black=(lo,hi)=>{const a=fr.filter(s=>s.k>lo&&s.k<hi);if(!a.length)return;const g=E('g',{filter:fB},mk);for(const s of a)useOf(s.n,g)};
    black(-1,Infinity);ks.forEach((p,j)=>{const t=p.n.getAttribute('transform'),g=G(E('g',{filter:fw},mk),t?{transform:t}:{});for(const ch of p.n.children)useOf(ch,g);black(p.k,j+1<ks.length?ks[j+1].k:Infinity)});
    /* never below the rim of the vessel (a copy under a head resting on the lip paints after the vessel) */
    const cp=E('clipPath',{id:'so'+(gid++),clipPathUnits:'userSpaceOnUse'},DF),rim=[];for(let x=bb[0];x<bb[2]+3;x+=3)rim.push([x,Math.min(bb[3],top(x)-1)]);
    E('path',{d:`M${f(bb[0])},${f(bb[1])}L${f(bb[2]+3)},${f(bb[1])}`+rim.reverse().map(p=>`L${f(p[0])},${f(p[1])}`).join('')+'Z'},cp);
    /* the copy: its stem and neck, by reference */
    const w=document.createElementNS('http://www.w3.org/2000/svg','g');w.setAttribute('mask',`url(#${mk.id})`);w.setAttribute('clip-path',`url(#${cp.id})`);w.setAttribute('data-so',i);if(same)h1.before(w);else hi.n.parentNode.append(w);
    for(const Ly of[L.stems,L.fst])for(const n of Ly.children){if(+n.getAttribute('data-o')!==i||n.hasAttribute('data-h')||n.hasAttribute('data-lf'))continue;if(o.stN.includes(n)){useOf(n,w);continue}
      /* a plant's axes and leaves (ext): only the stretches of axis (svStemLine groups: clipped by an sc… path, blurred inside) the stem's line
         runs through where it is covered, not the leaves */
      for(const g of[...n.querySelectorAll(AX)].filter(isAx).map(e=>e.parentNode).filter((g,j,A)=>A.indexOf(g)===j&&hit.some(q=>paints(shapes(g),q[0],q[1])))){const C=g.parentNode.getCTM();if(C)useOf(g,w,{transform:mat(Ri.multiply(C))})}}}
  return jobs.length}
function buildBq(svg,ids,sv,vid,t0=150,occ,model,recipe){if(svg._alive)svg._alive.stop();const c=compose(ids,sv,occ||S.occ,vid,model,recipe),tw0=tw.length;sd(sv*7+3);WILT=null;svg.innerHTML='';GDEF=E('defs',{},svg);
  /* cast shadow: each flower throws its own silhouette down and to the right onto what lies behind it (no blurred halo) */
  /* one per plane: the front throws the longest, clearest shadow onto what lies behind it, the back the faintest */
  const mkCs=(op,dx,dy)=>{const id='cs'+(gid++),cf=E('filter',{id,x:'-30%',y:'-30%',width:'170%',height:'170%','color-interpolation-filters':'sRGB'},GDEF);
    E('feFlood',{'flood-color':'#2a160e','flood-opacity':op,result:'c'},cf);E('feComposite',{in:'c',in2:'SourceAlpha',operator:'in',result:'s'},cf);E('feOffset',{in:'s',dx,dy,result:'o'},cf);
    E('feGaussianBlur',{in:'o',stdDeviation:.6,result:'b'},cf);const fm=E('feMerge',{},cf);E('feMergeNode',{in:'b'},fm);E('feMergeNode',{in:'SourceGraphic'},fm);return id};
  const csF=mkCs(.28,6,10),csM=mkCs(.22,5,8),csB=mkCs(.13,4,6);let CUR_DD=0;
  /* layers, back to front: the plinth, the back of the vessel, deep (the lines and big leaves at the back of the bouquet: every stem passes in
     front of them), the stems, back (heads the player set at the back), fst, the mass, the vessel, the front (what rests on the lip) */
  const cast=(par,rr)=>{const w=G(par);if(rr>(LOD?24:14))w.setAttribute('filter',`url(#${CUR_DD<.34?csF:CUR_DD<.67?csM:csB})`);return w};const L={};for(const k of['plinth','vback','deep','stems','back','fst','mass','vase','front'])L[k]=G(svg,{'data-l':k});
  let BP=c.BP;const v=VZ[vid]||VZ['coupe-blanche'],list=c.out.slice().sort((a,b)=>a.z-b.z);
  /* one stage for every head (LIFE_ALL): a bud or a half-open head opens within its own footprint (its size kept), the composition untouched */
  if(LIFE_ALL)for(const o of list){if(!o.st||o.st==='open'||o.kind!=='head'&&o.kind!=='self')continue;if(o.kind==='head')o.cm=(o.cm||cmOf(o.it.p))*(o.st==='bud'?.62:.86);o.st='open'}
  let n=0;list.forEach((o,i)=>{o.dd=list.length>1?1-i/(list.length-1):0});const TF=[0,1,2,3,4].map(depthTint);const step=Math.max(40,1500/list.length),T=i=>t0+380+i*step;
  const pl=!STAGES?null:model?(model.plinth==='none'?null:model.plinth||v.pl):v.pl;
  /* the cut stems in the glass (or on the pins) rise first, from their cut ends */
  let stShow=22;
  /* glass: the stems under the mouth are drawn last, each continuing its own stem (feet gathered while the bouquet is drawn) */
  /* a glass that hides them under its own painting (SVGB sover) has them drawn over its body, faded to that opacity, tinted by it;
     an opaque vessel open down its front (a slit, a spathe's throat: SVGB inner) shows them in that window the same way */
  const SBW=v.svgb&&typeof SVGB!=='undefined'?SVGB[v.svgb]:null,GL=(v.mat==='glass'||!!(SBW&&SBW.inner&&SBW.fr))&&!!v.prof&&v.kind!=='hand'&&v.kind!=='wrap',feet=[];
  /* the vessel is there, whole, from the first frame (it never fades in); the stems seen inside it grow from the mouth downward */
  {const sg=stage(L.plinth,v);stShow=sg.show;vessel(L.vback,vid,0,{noPlinth:1,part:'back',shClip:sg.top});if(v.kind==='kenzan'||v.mat==='glass'&&!GL){WILT=LIFE?lifeWilt(lifeW(LIFE)*.85):null;try{growUp(inStems(stemsBelow(L.stems,12,vid)),BP[0],BP[1],t0+250,700)}finally{WILT=null}}vessel(L.vase,vid,0,{noPlinth:1,part:'front'})}
  let FWD=false;const SC=['#24401c','#3c6229','#5f8a3e','#a9c97a'],held=v.kind==='hand'||v.kind==='wrap';let vTop=held?BP[1]:FL-vMh(v),mwV=vMouth(v)||26,mcx=VX+vMx(v);
  /* an item of another mouth (o.mouth, c4 composeMouths) draws its stem from there; useMouth(null) is the main one again */
  /* a mouth opening on the vessel's front (m.front: a slit in the body) holds flowers that stand before the vessel: its items are drawn in
     the front layer, their stems under their heads */
  const M0={BP,vTop,mwV,mcx,lean:LEANMAX},L0=Object.assign({},L);let FS=null,FM=null;
  const useMouth=m=>{Object.assign(L,L0);if(!m){({BP,vTop,mwV,mcx}=M0);LEANMAX=M0.lean;return}BP=m.BP;vTop=FL-m.mh;mwV=m.mo||26;mcx=VX+m.mx;LEANMAX=m.lean;
    if(m.front){if(!FS){FS=G(L.front,{'data-m':'stems'});FM=G(L.front,{'data-m':'mass'})}L.deep=L.stems=FS;L.back=L.fst=L.mass=FM}};
  /* below the tie of a held bouquet every stem goes on straight in its own direction (the stems cross at the binding point and fan out below it) */
  const below=(x,y,tx,ty,w,cols,t)=>{let l=Math.hypot(tx,ty)||1,ux=tx/l,uy=ty/l;if(uy>-.2)return;const an=Math.max(-.32,Math.min(.32,Math.atan2(ux,-uy)))+R(-.05,.05);ux=Math.sin(an);uy=-Math.cos(an);const Lb=R(118,142),Q=[[x,y],[x-ux*Lb*.34,y-uy*Lb*.34],[x-ux*Lb*.67,y-uy*Lb*.67],[x-ux*Lb+R(-3,3),y-uy*Lb]];
    growUp(stem3(L.stems,Q,w,w*.96,cols,6),x,y,Math.max(0,t-520),520)};
  function stemTo(ex,ey,t,w0,w1,front,head,nd,cols){const SCc=cols||SC,bx=BP[0]+Math.max(-1,Math.min(1,(ex-BP[0])/Math.max(60,c.W*.5)))*mwV*.45+R(-3,3);
    const lx0=mcx+Math.max(-.9,Math.min(.9,(ex-mcx)/mwV))*mwV;
    /* a head resting on the lip: its stem comes over the lip in front of the vessel — unless its neck already ends at the lip (then it simply enters the mouth) */
    if(!held&&front&&ey>vTop+2&&v.kind!=='kenzan'&&Math.hypot(ex-lx0,ey-(vTop-5))>14){const lx=lx0,ly=vTop-5,
        Lq=Math.hypot(ex-lx,ey-ly),A=[[bx,BP[1]+8],[bx+(lx-bx)*.2,ly-6],[lx-(lx-bx)*.25,ly-4],[lx,ly]],Bq=[[lx,ly],[lx+(ex-lx)*.45,ly-3],nd?[ex+nd[0]*Lq*.4,ey+nd[1]*Lq*.4]:[ex,ly+(ey-ly)*.4],[ex,ey]],
        s1=stem3(L.stems,A,w0,w0*.85,SCc,10),s2=stem3(L.front,Bq,w0*.85,w1,SCc,10);let hn=head;while(hn&&hn.parentNode!==L.front)hn=hn.parentNode;if(hn)L.front.insertBefore(s2,hn);
      growUp(s1,bx,BP[1]+8,Math.max(0,t-520),520);growUp(s2,lx,ly,Math.max(0,t-260),300);s1.P=Bq;s1.P0=A;s1.s2=s2;s1.nk={par:L.front,before:hn,gu:[lx,ly,Math.max(0,t-260),300]};if(GL)feet.push({p:A[0],d:[A[0][0]-A[1][0],A[0][1]-A[1][1]],w:w0,c:SCc,tn:TINT});return s1}
    /* a long stem leaves the mouth already leaning toward its head (stems pivot at the lip, they do not rise straight then turn) and arrives in its neck
       along the neck's direction; a short one (a head lying near the rim) goes almost straight, without overshooting; c4 stemSamples is the same curve */
    const dy=BP[1]-ey,Lc=Math.hypot(ex-bx,BP[1]+8-ey),sh=Math.max(0,Math.min(1,1-(Lc-20)/50)),hk=Lc*(.38-.2*sh),P1=[bx+(ex-bx)*.22,BP[1]-dy*.33],P1s=[bx+(ex-bx)*.33,BP[1]+8+(ey-BP[1]-8)*.33],
      P=leanP([[bx,BP[1]+8],[P1[0]+(P1s[0]-P1[0])*sh,P1[1]+(P1s[1]-P1[1])*sh],nd?[ex+nd[0]*hk,ey+nd[1]*hk]:[ex-(ex-bx)*.3,ey+dy*.35],[ex,ey]]),st=stem3(FWD?L.fst:L.stems,P,w0,w1,SCc,14);growUp(st,bx,BP[1]+8,Math.max(0,t-520),520);st.P=P;if(GL)feet.push({p:P[0],d:[P[0][0]-P[1][0],P[0][1]-P[1][1]],w:w0,c:SCc,tn:TINT});
    if(held)below(P[0][0],P[0][1],P[1][0]-P[0][0],P[1][1]-P[0][1],w0,SCc,t);st.nk={par:FWD?L.fst:L.stems,gu:[bx,BP[1]+8,Math.max(0,t-520),520]};return st}
  /* a head's neck, handed back by the head, drawn with the stems: continuous with its bouquet stem, behind every flower */
  const neckDraw=(nk,st,ext,x,y,nod=0,ps=1)=>{if(!st||!st.nk)return;const put=el=>{if(st.nk.before)st.nk.par.insertBefore(el,st.nk.before);growUp(el,...st.nk.gu)};
    if(nk&&nk.cp)put(st.nkEl=stem3(st.nk.par,nk.cp,nk.w,nk.w*1.12,nk.cols,8));
    /* what a plant head grows besides its flowers (axes, side shoots, leaves) joins the stems, at the head's place */
    if(ext&&ext.length){const eg=G(st.nk.par),ig=G(eg,{transform:`translate(${f(x)},${f(y)})`+(nod?` rotate(${f(nod)})`:'')+(ps!==1?` scale(${ps.toFixed(3)})`:'')});for(const fn of ext)fn(ig);put(eg)}};
  /* every node an element draws is tagged with its index, whatever layer it lands in */
  let mk=null;const mark=i=>{if(mk)for(const k in L){const ch=L[k].children;for(let j=mk[k];j<ch.length;j++)ch[j].setAttribute('data-o',mk.i)}mk={i};for(const k in L)mk[k]=L[k].children.length};
  /* a stage render (LIFE): each element draws from its own random stream, so a bouquet keeps the same details from bud to faded; its colours wilt with it */
  try{for(const o of list){useMouth(o.mouth);mark(n);const t=T(n++);CUR_DD=o.dd;TINT=TF[depthLevel(o.dd)];if(LIFE){sd(sv*7+3+n*7919);WILT=lifeWilt(lifeWEl(LIFE,o.it&&o.it.p?lifeProfile(o.it.p):null),o.it&&o.it.p&&(GHI[o.it.p.sid]||{}).wilt,o.it&&o.it.p&&o.it.p.sid)}
    if(o.kind==='leaf'){const g=G(L.deep);xAnthLeaf(g,t,{c:o.dark?['#060e09','#10261a','#1f4430','#3f6e4a','#86b48a']:undefined,pl:30,rot:0});bloom(g,o.x,o.y+30,o.rot,o.scale,t,900,-12);continue}
    if(o.kind==='drape'){const g=G(cast(L.front,30)),rec=o.it.p.rec,dr=rec.a==='drape'?rec:{a:'drape',cm:60,cols:[o.it.p.col],p:{type:'chenille'}};
      DRAPEX={x:o.x,y:o.y,side:o.side||1,held,top:vTop,mw:mwV,mcx,FL};try{[[1,0,0],[.8,-20,0],[.62,24,0]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(0,${j*1.5})`});drawRec(h,t+j*90,dr,{col:o.it.p.col,len:o.len*k,sway:o.sway+sw*(o.side||1)})})}finally{DRAPEX=null}
      bloom(g,o.x,o.y,0,1,t,1300,0);continue}
    if(o.kind==='garnish'){const g=G(L.mass);garnishArt(g,o.type,c.P);bloom(g,o.x,o.y,o.rot,o.scale,t,800,-10);
      const ga=o.rot*D;stemTo(o.x-12*o.scale*Math.sin(ga),o.y+12*o.scale*Math.cos(ga),t,2.6,1.2,false,null,[-Math.sin(ga),Math.cos(ga)]);continue}
    const sp=o.it.sp,rec=o.it.p.rec,cust=rec.a==='custom',c0=cmOf(o.it.p),col=o.it.p.col;
    if(o.kind==='self'){const clu=!(o.role==='line'&&!o.short||o.role==='foliage');let wrap=null;
      /* a bent stem: the element follows its spine from the mouth; the lower part of a cluster's stem joins the other stems */
      const draw=()=>{wrap=(clu||o.fwd)&&!o.back?cast(o.front?L.front:L.mass,o.rr||20):null;const g=G(wrap||(clu?L.back:L.deep));
        if(o.spine){const rs=drawRec(g,t,rec,{col,spine:o.spine,from:o.from||0,short:o.short,op:LIFE&&LIFE.stage===0&&GH_BUDS.has(o.it.p.sid)?.2+.25*LIFE.u:undefined,life:LIFE?{stage:LIFE.stage,u:LIFE.u,w:lifeWEl(LIFE,lifeProfile(o.it.p))}:undefined});if(rs&&rs.bw)o.sb={w:rs.bw,bw1:rs.bw1,c:rs.bc};bloom(g,o.x,o.y,0,1,t,1000,-4)}
        else{drawRec(g,t,rec,{col,len:sp.self===0?o.len:undefined});bloom(g,o.x,o.y,o.rot,o.scale,t,1000,-10)}};
      const w0=tw.length;draw();
      /* a cluster never hangs behind the vessel: measured in full, its stem is lengthened until the fruit clears the rim */
      if(clu&&o.spine&&!held&&!o.short)for(let k=0;k<4;k++){try{const ws=tw.slice(w0);for(const w of ws)w.fn(1,1);const b=wrap.getBBox();for(const w of ws)w.fn(0,0);const bot=b.y+b.height;
          let lim=FL;for(let i=0;i<=8;i++)lim=Math.min(lim,vSilTop(v,b.x+b.width*i/8));const ey=o.spine[3][1];if(!b.width||bot<=lim-8||ey>-5)break;
          const s=1+(bot-(lim-12))/Math.abs(ey);o.spine=o.spine.map(p=>[p[0],p[1]*s]);wrap.remove();tw.length=w0;draw()}catch(_){break}}
      if(o.spine&&o.from){const sb=o.sb||{},st=stem3(L.stems,bseg(o.spine.map(p=>[p[0]+o.x,p[1]+o.y]),0,Math.min(1,o.from+.03)),sb.bw1?sb.w:3.4,sb.bw1||2.4,sb.c||SC,12);growUp(st,o.x,o.y,Math.max(0,t-520),520)}
      if(GL&&o.spine){const sb=o.sb||{},p0=[o.x+o.spine[0][0],o.y+o.spine[0][1]],p1=[o.x+o.spine[1][0],o.y+o.spine[1][1]];feet.push({p:p0,d:[p0[0]-p1[0],p0[1]-p1[1]],w:sb.w||3.2,c:sb.c||SC,tn:TINT})}
      if(held&&o.spine){const sb=o.sb||{};below(o.x,o.y,o.spine[1][0]-o.spine[0][0],o.spine[1][1]-o.spine[0][1],o.from?3.4:sb.w||3.2,sb.c||SC,t)}
      continue}
    /* real-size head: 3D species are oriented along their stem; 2D drawings are rotated and scaled to their real size */
    const rr=o.rr||(sp.r||40),ps=1+DEPTH_PS*(.5-(o.dd||0));let ex,ey,g,nd=null,np=null,nk=null,ext=null,kr=1;
    /* at Déclin and Fané a head nods outward and down from its neck; at Bourgeon it closes back */
    const LP=LIFE?lifeProfile(o.it.p):null,hN=LIFE?lifeH(sv,o.x,o.y):0,nod0=LIFE?lifeNod(LIFE,LP,hN)*(o.x>BP[0]+8?1:o.x<BP[0]-8?-1:lifeH(sv,o.y,3)<.5?-1:1):0;let nod=nod0;
    const head=()=>{const par=cast(o.front?L.front:o.back?L.back:L.mass,rr);par.setAttribute('data-h','');g=G(par);nod=nod0;
      if(o.it.d3){const a=o.ax||[0,0,1];ex=o.x;ey=o.y;nd=null;np=null;
        /* the head is held by its stem: its own down points at the stem's base (held bouquets: the tie), only a little roll; its neck bends into the stem */
        const gh=!!CWS[o.it.p.sid],up=[o.x-BP[0],BP[1]-o.y,0];NECK_X=gh;EXT=gh?[]:null;let r;try{r=drawRec(g,t,rec,{col,ax:a,cm:o.cm,op:LIFE_ALL==='open'?1:lifeOp(LIFE,o.st,o.st==='bud'?.14:o.st==='half'?.5:R(.86,1),hN,lifeBudOK(o.it)),roll:gh?R(-.12,.12):R(-.6,.6),up:Math.hypot(up[0],up[1])>6?[up[0]*kr,up[1]*kr,0]:undefined,rim:!!o.rim,dry:LIFE&&LIFE.stage===3&&LP.dry?1:undefined,life:LIFE?{stage:LIFE.stage,u:LIFE.u,w:lifeWEl(LIFE,LP)}:undefined})}finally{NECK_X=false;ext=EXT;EXT=null}
        /* the nod never turns the neck more than 50 degrees away from the way its stem comes up (no broken stem) */
        if(nod&&r&&r.nd&&r.neck){const bx0=BP[0]-(o.x+r.neck[0]),by0=BP[1]+8-(o.y+r.neck[1]),d0=((Math.atan2(r.nd[1],r.nd[0])-Math.atan2(by0,bx0))/D+540)%360-180,na=Math.max(-50-d0,Math.min(50-d0,nod));nod=Math.sign(na)===Math.sign(nod)?na:0;
          /* and the head stays above the end of its neck: a nodding head never hangs below its own stem */
          const above=a=>{const vx=-r.neck[0],vy=-r.neck[1],l=Math.hypot(vx,vy)||1;return vx*Math.sin(a*D)+vy*Math.cos(a*D)<-.15*l};for(let k=0;k<8&&nod&&!above(nod);k++)nod*=.7;if(nod&&!above(nod))nod=0}
        /* a head whose neck ends barely above the foot of its stem (resting low on the rim) hardly nods: its stem could not turn back to meet it */
        if(nod&&r&&r.neck){const dyb=BP[1]+8-(o.y+r.neck[1]);if(dyb<45)nod*=Math.max(0,(dyb-15)/30)}
        if(nod&&r){const cs=Math.cos(nod*D),sn=Math.sin(nod*D),rt=p=>[p[0]*cs-p[1]*sn,p[0]*sn+p[1]*cs];if(r.neck)r.neck=rt(r.neck);if(r.nd)r.nd=rt(r.nd);if(r.np)r.np=r.np.map(rt);if(r.ncp)r.ncp=r.ncp.map(rt)}
        if(r&&ps!==1){const sc=p=>[p[0]*ps,p[1]*ps];if(r.neck)r.neck=sc(r.neck);if(r.np)r.np=r.np.map(sc);if(r.ncp)r.ncp=r.ncp.map(sc);if(r.nw)r.nw*=ps}
        nk=r&&(r.ncp||r.lsx)?{cp:r.ncp?r.ncp.map(p=>[p[0]+o.x,p[1]+o.y]):null,w:r.nw,cols:r.ncols}:null;
        if(r&&r.neck){ex=o.x+r.neck[0];ey=o.y+r.neck[1];if(r.nd)nd=r.nd;if(r.np)np=r.np.map(p=>[p[0]+o.x,p[1]+o.y])}bloom(g,o.x,o.y,nod,ps,t,1000,-12)}
      else{const fn=cust?(rec.p||{}).fn:null,vw=fn&&o.st==='bud'&&hasView(fn,'bud')?'bud':fn&&o.st==='half'&&hasView(fn,'half')?'half':'face',sc=(cust?artK(fn):1)*(o.cm||c0)/c0*ps,dyA=vw!=='face'?vcen(fn,vw):(sp.an?-sp.an[1]:0),th=(o.rot+nod)*D;
        ex=o.x-dyA*sc*Math.sin(th);ey=o.y+dyA*sc*Math.cos(th);const inner=dyA?G(g,{transform:`translate(0,${f(dyA)})`}):g;if(cust&&vw!=='face')drawView(inner,t,fn,customOpts(fn,col,rec.c2),vw);else drawRec(inner,t,rec,{col});bloom(g,o.x,o.y,o.rot+nod,sc,t,1000,-20)}
      return par};
    const w0=tw.length;let hp=head();
    /* a head whose own stem (neck, foot of its raceme) would reach more than 60% of the way to its base is moved away from the base along its stem, so its stem never has to turn back
       — unless that neck goes straight into the mouth of an opaque vessel (a low head over the mouth: its neck is its stem, the vessel hides the rest; c4 FOOT_SP knows) */
    const intoMouth=()=>!held&&!GL&&v.kind!=='kenzan'&&v.mat!=='glass'&&Math.abs(ex-mcx)<=mwV*.8&&ey>=vTop-12;
    /* first its neck gives way (the head drawn for a shorter reach: the bouquet stem takes over higher up), the head staying where c4 put it; only a
       neck that cannot shrink enough moves the head */
    for(let k=0;k<6&&o.it.d3&&(ex!==o.x||ey!==o.y);k++){const hb=[BP[0]-o.x,BP[1]-o.y],L=Math.hypot(hb[0],hb[1])||1,pr=((ex-o.x)*hb[0]+(ey-o.y)*hb[1])/L;if(pr<=.6*L||intoMouth())break;
      if(k<3&&kr>.25){kr*=Math.max(.25,.57*L/pr);hp.remove();tw.length=w0;hp=head();continue}
      const s=pr/.6-L+2,ux=L>1?-hb[0]/L:0,uy=L>1?-hb[1]/L:-1;hp.remove();tw.length=w0;o.x+=ux*s;o.y+=uy*s;hp=head()}
    /* a head behind the vessel never dips below its rim: measured in full bloom, it is raised before its stem is drawn */
    if(!held&&!o.front&&Math.max(o.y+rr*(nk&&!nk.cp?9:4),ey+6)>FL-vH(v))try{const ws=tw.slice(w0);for(const w of ws)w.fn(1,1);const b=hp.getBBox();for(const w of ws)w.fn(0,0);const bot=b.y+b.height;
      /* the silhouette of the vessel under the head (its rim, its shoulders, the lobes of a heart) */
      let lim=FL;for(let i=0;i<=16;i++)lim=Math.min(lim,vSilTop(v,b.x+b.width*i/16));
      /* a head that reaches the rim rests ON the lip, in front of it (never cut by it); one hanging lower is first raised to overhang the lip by at most half its size */
      if(b.width&&(bot>lim-(nk&&!nk.cp?14:8)||bot>FL-2)){
        /* a head the player set at the back never comes to rest on the lip in front: it is raised clear of the rim, and stays behind */
        if(o.back){hp.remove();tw.length=w0;o.y-=bot-(lim-(nk&&!nk.cp?16:10));hp=head()}
        else{const ok=Math.max(0,Math.min(rr*.6,FL-2-lim));
        if(bot>lim+ok){hp.remove();tw.length=w0;o.y-=bot-(lim+ok);hp=head()}L.front.appendChild(hp);o.front=true}}}catch(_){}
    /* every head keeps its whole stem from the mouth to its receptacle */
    FWD=!!o.fwd&&!o.front&&!held;const nw1=nk?nk.w*1.12:2.4,st=stemTo(ex,ey,t,Math.max(o.role==='line'?3.2:4,nw1*1.1),nw1,!!o.front,g,nd,nk&&nk.cols);neckDraw(nk,st,ext,o.x,o.y,nod,ps);FWD=false;if(st&&st.P){o.stemP=st.P;o.stemP0=st.P0||null;o.stN=[st.s2||st,st.nkEl].filter(Boolean);o.nd=nd;o.np=np||(Math.hypot(ex-o.x,ey-o.y)>3?[[o.x,o.y],[ex,ey]]:null)}
    /* the leaves its stem carries, on the part seen above the mouth (or above the tie); tagged data-lf (leaves, not bare stem, for lab/nues.js) */
    if(st&&st.P&&STEML[o.it.p.sid]){let lim=held?BP[1]:FL;if(!held)for(let i=0;i<=6;i++)lim=Math.min(lim,vSilTop(v,st.P[0][0]+(st.P[3][0]-st.P[0][0])*i/6));const n0=L.stems.children.length;stemLeaves(L.stems,st.P,o.it.p.sid,lim-6,rr,t);for(let j=n0;j<L.stems.children.length;j++)L.stems.children[j].setAttribute('data-lf',1)}}
  }finally{WILT=null;TINT=null}
  mark(-1);mk=null;
  /* the last word on overlaps, on the shapes as drawn (every animation at its end): no flower's heart under something painted after it */
  /* then, in a fading bouquet, no stem seen running under a head painted behind its own head (stemsOver) */
  try{const ws=tw.slice(tw0);for(const w of ws)w.fn(1,1);try{heartsFree(L,list,c);if(LIFE&&(LIFE.stage>=2||LIFE.cont&&lifeW(LIFE)>0))stemsOver(L,list,c,v)}finally{for(const w of ws)w.fn(0,0)}}catch(_){}
  /* in a glass vessel every stem goes on under the mouth: the continuation of its own stem, down to the bottom */
  useMouth(null);
  if(GL&&feet.length){WILT=LIFE?lifeWilt(lifeW(LIFE)*.85):null;try{growUp(inStems(stemsIn(SBW&&SBW.sover?L.vase:L.stems,feet,vid)),BP[0],BP[1],t0+250,700)}finally{WILT=null}}
  /* petals fallen on the table (not swayed by the breeze, outside the frame measure) */
  if(LIFE&&LIFE.stage>=2&&!held)lifeFallen(L.plinth,LIFE,list.filter(o=>o.kind==='head'),BP,mwV,stShow,sv);
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
  for(const k of['stems','mass','front'])breeze(L[k],BP[0],BP[1],.32);for(const k of['deep','back'])breeze(L[k],BP[0],BP[1],held?.32:.55,held?0:420);svg.dataset.tpl=c.tk;c.list=list;svg.dataset.n=c.out.filter(o=>o.kind==='head'||o.kind==='self'||o.kind==='drape').length;return c}
