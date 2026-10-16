
/* ================= Le bouquet vivant, léger à animer =================
   Once a bouquet is drawn, it is cut into still images in its own stacking order: what never moves (the plinth, the stems, the vase) in a few,
   every moving flower, line, drape, leaf or sprig in its own. The breeze then turns those images on the graphics card (Web Animations,
   transforms only, nothing computed per frame): each round its own joint — a head at the end of its neck, a line or a spray where it leaves
   the mass, a drape where it hangs — never all together, more or less and faster or slower by how light it is. The browser never repaints the
   drawing again (the old breeze rotated whole layers of 5 000 elements, gradients and shadows, every frame). */
const ALIVE=new Set();
function aliveStopAll(){for(const h of[...ALIVE])h.stop()}
/* how an element moves: A degrees each way, a cycle of 2T seconds, round its joint j (user space); null: it stays still */
function aliveMotion(o){if(!o)return null;const it=o.it||{};
  if(o.kind==='head'){const rr=Math.max(10,o.rr||30);let A=Math.min(2.6,Math.max(.45,1.9*Math.sqrt(24/rr)));if(it.piv)A*=.65;if(o.rim)A*=.5;
    return{A,T:3.4+rr*.055,j:o.stemP?o.stemP[3]:[o.x,o.y+rr*.4]}}
  if(o.kind==='self'&&o.spine){const L=o.len||120,p=bz(o.spine,Math.max(.12,o.from||0));let A=Math.min(3.4,.7+L/160);if(o.role==='foliage')A*=.75;if(o.short)A*=.7;
    return{A,T:2.8+L/240,j:[o.x+p[0],o.y+p[1]]}}
  if(o.kind==='drape')return{A:1.7,T:4.6,j:[o.x,o.y]};
  if(o.kind==='leaf')return{A:.9,T:6.2,j:[o.x,o.y+30]};
  if(o.kind==='garnish')return{A:.7,T:4.2,j:[o.x,o.y+12*(o.scale||1)]};
  if(o.kind==='self')return{A:1,T:4.5,j:[o.x,o.y]};
  return null}
/* the layers that move element by element; the others are still */
const ALIVE_DYN={deep:1,back:1,mass:1,front:1};
async function aliveBq(svg,c,opt={}){if(!svg||!c||!c.list||(RM&&!opt.still))return null;svg._aliveArgs=[c,opt];if(svg._alive)svg._alive.stop();idleOn=false;
  const host=svg.parentNode,sr=svg.getBoundingClientRect(),M=svg.getScreenCTM();if(!host||!M)return null;
  /* not laid out yet (a hidden tab, a closed panel): it comes alive as soon as it has a size */
  if(sr.width<4||sr.height<4){if(window.ResizeObserver){const tk={};svg._aliveTok=tk;const ro=new ResizeObserver(()=>{const b=svg.getBoundingClientRect();if(b.width>=4&&b.height>=4){ro.disconnect();if(svg._aliveTok===tk&&svg.isConnected)aliveBq(svg,c,opt)}});ro.observe(svg)}return null}
  const inv=M.inverse(),dpr=Math.min(2,window.devicePixelRatio||1),XS=new XMLSerializer(),token={};svg._aliveTok=token;
  /* runs: consecutive nodes drawn by the same moving element, or still nodes, in stacking order */
  const runs=[];let cur=null;
  for(const g of[...svg.children]){const l=g.getAttribute&&g.getAttribute('data-l');if(!l)continue;
    if(!ALIVE_DYN[l]){if(!cur||cur.m){cur={nodes:[],m:null};runs.push(cur)}cur.nodes.push(g);continue}
    for(const ch of[...g.children]){const k=ch.getAttribute('data-o'),mo=k!=null?aliveMotion(c.list[+k]):null;
      if(mo){if(!cur||cur.key!==k){cur={nodes:[],m:mo,key:k,i:+k};runs.push(cur)}cur.nodes.push(ch)}
      else{if(!cur||cur.m){cur={nodes:[],m:null};runs.push(cur)}cur.nodes.push(ch)}}}
  /* the defs a piece of the drawing refers to (gradients, clips, shadows), with those they refer to in turn */
  const find=id=>{const q='#'+CSS.escape(id);return svg.querySelector(q)||document.getElementById(id)||(typeof defs!=='undefined'&&defs.querySelector&&defs.querySelector(q))},
    defsOf=xml=>{let out='';const seen=new Set(),add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);out+=s;add(s)}}};add(xml);return out};
  const P=(x,y,m)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(m)};
  const wrap=document.createElement('div'),cs=getComputedStyle(svg);if(getComputedStyle(host).position==='static')host.style.position='relative';
  const hr=host.getBoundingClientRect();wrap.style.cssText=`position:absolute;left:${sr.left-hr.left+host.scrollLeft}px;top:${sr.top-hr.top+host.scrollTop}px;width:${sr.width}px;height:${sr.height}px;pointer-events:none;overflow:hidden;z-index:${cs.zIndex==='auto'?1:cs.zIndex}`;
  const jobs=[];
  for(const r of runs){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const n of r.nodes){const b=n.getBoundingClientRect();if(!b.width&&!b.height)continue;x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom)}
    if(x1<=x0||y1<=y0)continue;const pad=16;x0=Math.floor(Math.max(sr.left-pad,x0-pad));y0=Math.floor(Math.max(sr.top-pad,y0-pad));x1=Math.ceil(Math.min(sr.right+pad,x1+pad));y1=Math.ceil(Math.min(sr.bottom+pad,y1+pad));if(x1<=x0||y1<=y0)continue;
    const a=P(x0,y0,inv),b=P(x1,y1,inv),W=x1-x0,H=y1-y0,xml=r.nodes.map(n=>XS.serializeToString(n)).join('');
    const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${a.x} ${a.y} ${b.x-a.x} ${b.y-a.y}" preserveAspectRatio="none"><defs>${defsOf(xml)}</defs>${xml}</svg>`;
    jobs.push((async()=>{const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;try{await img.decode()}finally{URL.revokeObjectURL(url)}
      const cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(W*dpr));cv.height=Math.max(1,Math.round(H*dpr));cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      cv.style.cssText=`position:absolute;left:${x0-sr.left}px;top:${y0-sr.top}px;width:${W}px;height:${H}px`;return{cv,r,x0,y0}})())}
  let done;try{done=await Promise.all(jobs)}catch(e){return null}
  if(svg._aliveTok!==token||!svg.isConnected)return null;
  for(const{cv}of done)wrap.append(cv);svg.after(wrap);
  /* the still drawing gives way to its images (its background, if any, stays) */
  const layers=[...svg.children].filter(g=>g.getAttribute&&g.getAttribute('data-l'));for(const g of layers)g.style.visibility='hidden';
  /* each moving image swings round its joint: starting from rest, its own way, period and amplitude; a light hold before it starts */
  const anims=[];
  for(const{cv,r,x0,y0}of done){if(!r.m||opt.still)continue;const{A,T,j}=r.m,h=Math.abs(Math.sin((r.i+1)*12.9898)*43758.5453)%1,sg=h<.5?-1:1,a2=(A*(.85+.3*h)).toFixed(3),T2=T*(.88+.24*((h*7)%1)),
      q=P(j[0],j[1],M);cv.style.transformOrigin=`${(q.x-x0).toFixed(1)}px ${(q.y-y0).toFixed(1)}px`;cv.style.willChange='transform';
    anims.push(cv.animate([{transform:'rotate(0deg)',easing:'ease-out'},{transform:`rotate(${sg*a2}deg)`,easing:'ease-in'},{transform:'rotate(0deg)',easing:'ease-out'},{transform:`rotate(${-sg*a2}deg)`,easing:'ease-in'},{transform:'rotate(0deg)'}],
      {duration:T2*2000,iterations:Infinity,delay:h*1500}))}
  /* a change of size redraws the images at the new size */
  let ro=null,first=true;const h0={svg,stop(){for(const an of anims)an.cancel();wrap.remove();for(const g of layers)g.style.visibility='';if(ro)ro.disconnect();ALIVE.delete(h0);if(svg._alive===h0)svg._alive=null}};
  if(window.ResizeObserver){let tm=0;ro=new ResizeObserver(()=>{if(first){first=false;return}clearTimeout(tm);tm=setTimeout(()=>{if(svg._alive===h0&&svg.isConnected){h0.stop();aliveBq(svg,c,opt)}},250)});ro.observe(svg)}
  svg._alive=h0;ALIVE.add(h0);return h0}
