
/* ---------- QA: floating parts and vase underlaps, measured on the pixels of the final drawing ---------- */
function renderStatic(fn){const a=tw.length,b=idle.length;const r=fn();for(const w of tw.splice(a))w.fn(1,1);idle.length=b;return r}
const XS=new XMLSerializer();
function svgXml(svg,W,H,o={}){const c=svg.cloneNode(true);
  for(const g of [...c.querySelectorAll('[data-l]')]){const k=g.dataset.l;if(o.only&&!o.only.includes(k)||o.hide&&o.hide.includes(k))g.remove()}
  if(o.oi!=null)for(const n of [...c.querySelectorAll('[data-o]')])if(+n.dataset.o!==o.oi)n.remove();
  if(o.noShadow)for(const n of c.querySelectorAll('[filter]'))n.removeAttribute('filter');
  /* a head set in front has its stem (and neck) drawn in the mass, marked data-fs: a stem, not part of the head */
  if(o.noStem)for(const n of [...c.querySelectorAll('[data-fs]')])n.remove();
  c.setAttribute('width',W);c.setAttribute('height',H);c.removeAttribute('style');c.removeAttribute('class');
  const xml=XS.serializeToString(c),ids=new Set([...xml.matchAll(/url\(#([^)"'\s]+)\)/g)].map(m=>m[1]));let extra='';
  for(const id of ids){if(c.querySelector('#'+CSS.escape(id)))continue;const el=document.getElementById(id);if(el)extra+=XS.serializeToString(el)}
  return xml.replace(/^<svg[^>]*>/,m=>m+'<defs>'+extra+'</defs>')}
async function raster(xml,W,H){/* the checks read coverage only: soft-shading blurs change nothing there and cost a lot to rasterise */xml=xml.replace(/ filter="url\(#[^)]*\)"/g,'');const img=new Image(),url=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml'}));img.src=url;try{await img.decode()}finally{URL.revokeObjectURL(url)}
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.drawImage(img,0,0,W,H);const px=x.getImageData(0,0,W,H).data;img.src='';cv.width=cv.height=0;return px}
function comps8(m,W,H){const lab=new Int32Array(W*H),out=[],st=[];let nl=0;
  for(let i=0;i<W*H;i++){if(!m[i]||lab[i])continue;nl++;let area=0,x0=1e9,y0=1e9,x1=-1,y1=-1,sx=0,sy=0;st.push(i);lab[i]=nl;
    while(st.length){const p=st.pop(),x=p%W,y=(p-x)/W;area++;sx+=x;sy+=y;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=W||Y>=H)continue;const q=Y*W+X;if(m[q]&&!lab[q]){lab[q]=nl;st.push(q)}}}
    out.push({id:nl,area,x0,y0,x1,y1,cx:sx/area,cy:sy/area})}return{lab,out}}
/* the box of every element, in the svg's user space */
function boxes(svg){const inv=svg.getScreenCTM().inverse(),B=new Map();
  for(const n of svg.querySelectorAll('[data-o]')){const i=+n.dataset.o;let b;try{b=n.getBBox()}catch(_){continue}if(!b.width&&!b.height)continue;const M=inv.multiply(n.getScreenCTM()),
    P=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>[M.a*x+M.c*y+M.e,M.b*x+M.d*y+M.f]),
    bx=[Math.min(...P.map(p=>p[0])),Math.min(...P.map(p=>p[1])),Math.max(...P.map(p=>p[0])),Math.max(...P.map(p=>p[1]))],e=B.get(i);
    B.set(i,e?[Math.min(e[0],bx[0]),Math.min(e[1],bx[1]),Math.max(e[2],bx[2]),Math.max(e[3],bx[3])]:bx)}return B}
const desc=(c,i)=>{const o=(c.list||[])[i];if(!o)return{i};return{i,kind:o.kind,role:o.role,id:o.it?o.it.p.id:o.type,f:o.it?o.it.f:'',front:!!o.front,st:o.st}};
/* one bouquet already drawn in its final state */
async function qaSvg(svg,c,vid,opt={}){const vb=svg.viewBox.baseVal,W=opt.W||480,H=Math.round(W*vb.height/vb.width),sx=vb.width/W,sy=vb.height/H,
    toS=(x,y)=>[vb.x+(x+.5)*sx,vb.y+(y+.5)*sy],toP=(X,Y)=>[(X-vb.x)/sx,(Y-vb.y)/sy],B=boxes(svg),res={W,H,floating:[],under:[],frontNoStem:[]};
  /* 1. floating parts: everything drawn must be one connected piece with the vessel or the tie */
  const full=await raster(svgXml(svg,W,H,{hide:['plinth'],noShadow:1}),W,H),m=new Uint8Array(W*H);for(let i=0;i<W*H;i++)m[i]=full[i*4+3]>14?1:0;
  const{lab,out}=comps8(m,W,H);out.sort((a,b)=>b.area-a.area);
  for(const k of out.slice(1)){if(k.area<(opt.minA||5))continue;const[cx,cy]=toS(k.cx,k.cy),cand=[...B.entries()].filter(([i,b])=>i>=0&&cx>=b[0]-2&&cx<=b[2]+2&&cy>=b[1]-2&&cy<=b[3]+2);
    let owner=null;for(const[i]of cand.sort((a,b)=>(a[1][2]-a[1][0])*(a[1][3]-a[1][1])-(b[1][2]-b[1][0])*(b[1][3]-b[1][1]))){const mm=await raster(svgXml(svg,W,H,{hide:['plinth'],oi:i,noShadow:1}),W,H);let hit=0;
      for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++){const p=y*W+x;if(lab[p]===k.id&&mm[p*4+3]>14)hit++}if(hit>k.area*.5){owner=desc(c,i);break}}
    res.floating.push({area:k.area,at:[Math.round(cx),Math.round(cy)],box:[k.x0,k.y0,k.x1,k.y1],owner})}
  /* 2. underlaps: no flower, leaf or cluster may be hidden by the body of the vessel (only stems go into the mouth) */
  const v=VZ[vid]||{};
  if(v.kind!=='hand'&&v.kind!=='wrap'){const V=await raster(svgXml(svg,W,H,{only:['vase']}),W,H),top=FL-vMh(v),mw=vMouth(v),ry=vRy(mw),mcx=VX+vMx(v);
    /* stems entering the mouth may pass behind what rises around it (the lobes of the heart): the highest silhouette over the mouth */
    let up=top;for(let i=-10;i<=10;i++)up=Math.min(up,vSilTop(v,mcx+mw*i/10));
    for(const[i,b]of B){if(i<0||b[3]<top-1)continue;const o=(c.list||[])[i];if(!o)continue;const mm=await raster(svgXml(svg,W,H,{only:['mass','back','deep'],oi:i,noShadow:1,noStem:1}),W,H);let n=0,px=[];
      for(let p=0;p<W*H;p++){if(mm[p*4+3]<30||V[p*4+3]<12)continue;const x=p%W,y=(p-x)/W,[X,Y]=toS(x,y);
        if((o.role==='line'||o.role==='foliage'||o.kind==='self')&&(((X-mcx)/mw)**2+((Y-top)/(ry*1.15))**2<=1.1||Math.abs(X-mcx)<mw*1.1&&Y>up-2&&Y<top+ry*1.2))continue;n++;if(px.length<400)px.push(p)}
      if(n>2){const p0=px[Math.floor(px.length/2)],[ux,uy]=toS(p0%W,(p0-p0%W)/W);res.under.push(Object.assign(desc(c,i),{px:n,pix:px,at:[Math.round(ux),Math.round(uy)]}))}}}
  /* 3. stems: from its base to its flower's receptacle every stem must flow — no sharp break (turn over a short stretch) and no U-turn back toward its base */
  res.kinks=[];for(const[i,o]of(c.list||[]).entries()){if(!o.stemP)continue;const smp=P=>{const a=[];for(let k=0;k<=30;k++)a.push(bz(P,k/30));return a};
    let path=(o.stemP0?smp(o.stemP0):[]).concat(smp(o.stemP)).concat(o.np?o.np.slice().reverse():[]);
    /* resample every 2 units along the path */const rs=[path[0]];let acc=0;for(let k=1;k<path.length;k++){const a=rs[rs.length-1],b=path[k],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d>=2){const n=Math.floor(d/2);for(let m=1;m<=n;m++)rs.push([a[0]+(b[0]-a[0])*m/n,a[1]+(b[1]-a[1])*m/n])}}
    const w=4,ch=[rs[rs.length-1][0]-rs[0][0],rs[rs.length-1][1]-rs[0][1]],cl=Math.hypot(ch[0],ch[1])||1;let mt=0,at=null,back=0;
    for(let k=w;k<rs.length-w;k++){const a=[rs[k][0]-rs[k-w][0],rs[k][1]-rs[k-w][1]],b=[rs[k+w][0]-rs[k][0],rs[k+w][1]-rs[k][1]],la=Math.hypot(a[0],a[1]),lb=Math.hypot(b[0],b[1]);if(la<1e-6||lb<1e-6)continue;
      const ang=Math.acos(Math.max(-1,Math.min(1,(a[0]*b[0]+a[1]*b[1])/(la*lb))))/D;if(ang>mt){mt=ang;at=rs[k]}}
    for(let k=1;k<rs.length;k++){const s=[rs[k][0]-rs[k-1][0],rs[k][1]-rs[k-1][1]],l=Math.hypot(s[0],s[1])||1;if((s[0]*ch[0]+s[1]*ch[1])/(l*cl)<-.25)back+=l}
    /* a living stem bends, it does not break: a turn sharper than about three stem widths in radius (75 degrees over 16 units) is a break */
    if(mt>75||back>18||(new URLSearchParams(location.search)).get('allk'))res.kinks.push(Object.assign(desc(c,i),{turn:Math.round(mt),back:Math.round(back),at:at?[Math.round(at[0]),Math.round(at[1])]:null,dbg:{P:o.stemP.map(p=>p.map(Math.round)),P0:o.stemP0&&o.stemP0.map(p=>p.map(Math.round)),np:o.np&&[o.np[0],o.np[o.np.length-1]].map(p=>p.map(Math.round)),h:[Math.round(o.x),Math.round(o.y)],BP:c.BP.map(Math.round),front:!!o.front,nd:o.nd&&o.nd.map(v=>+v.toFixed(2))}}))}
  return res}
/* draw a bouquet, run the QA, keep a picture with the faults marked */
const QA_HOST=(()=>{const d=document.createElement('div');d.id='qa';d.style.cssText='display:grid;grid-template-columns:repeat('+(new URLSearchParams(location.search).get('cols')||4)+',1fr);gap:4px';document.body.append(d);return d})();
async function qaRun(name,draw,vid,opt={}){const cell=document.createElement('div');cell.style.cssText='position:relative;background:#efe9e1';const s=E('svg',{viewBox:'0 0 100 100',style:'display:block;width:100%;height:auto'},cell);QA_HOST.append(cell);
  const c=renderStatic(()=>draw(s));const r=await qaSvg(s,c,vid,opt);r.name=name;
  if(opt.keep&&(r.floating.length||r.under.length||(r.kinks||[]).length||opt.keepAll)){const cv=document.createElement('canvas');cv.width=r.W;cv.height=r.H;cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';const x=cv.getContext('2d');
    x.strokeStyle='#e00';x.lineWidth=2;for(const k of r.floating){const[a,b,c2,d]=k.box;x.strokeRect(a-4,b-4,c2-a+8,d-b+8)}x.strokeStyle='#f80';x.lineWidth=3;const vb2=s.viewBox.baseVal;for(const k of(r.kinks||[]))if(k.at){const px=(k.at[0]-vb2.x)/vb2.width*r.W,py=(k.at[1]-vb2.y)/vb2.height*r.H;x.strokeRect(px-9,py-9,18,18)}x.fillStyle='rgba(0,80,255,.8)';for(const u of r.under)for(const p of u.pix)x.fillRect(p%r.W,(p-p%r.W)/r.W,1,1);
    const lb=document.createElement('b');lb.textContent=name+` F${r.floating.length} U${r.under.length}`;lb.style.cssText='position:absolute;left:4px;top:2px;font:600 11px system-ui;color:#600';cell.append(cv,lb)}
  else cell.remove();
  /* zoomed crops of each fault */
  if(opt.zoom)for(const k of r.floating.concat(r.under).slice(0,4)){const z=document.createElement('div');z.style.cssText='position:relative;background:#efe9e1;outline:2px solid #c00';const s2=s.cloneNode(true);const Z=opt.zoom;s2.setAttribute('viewBox',`${k.at[0]-Z/2} ${k.at[1]-Z/2} ${Z} ${Z}`);s2.style.cssText='display:block;width:100%;height:auto;aspect-ratio:1';z.append(s2);
    const lb=document.createElement('b');lb.textContent=(k.owner?'F '+[k.owner.kind,k.owner.role,k.owner.id].join(' '):'U '+[k.kind,k.role,k.id].join(' '));lb.style.cssText='position:absolute;left:4px;top:2px;font:600 11px system-ui;color:#600;background:#fffa';z.append(lb);QA_HOST.append(z)}
  for(const u of r.under)delete u.pix;return r}
window.QA13={
  async models(a=0,b=999,opt={}){const out=[];for(const m of MODELS.slice(a,b)){for(const sv of(opt.seeds||[7])){out.push(await qaRun(`${m.n} ${m.vase} s${sv}`,s=>{LOD=opt.lod||0;const c=buildBq(s,[],sv,m.vase,0,null,m);LOD=0;return c},m.vase,opt))}}return out},
  async composed(n=20,opt={}){const out=[],vz=opt.vases||Object.keys(VZ),oc=Object.keys(OCCS);let sd0=opt.seed||1;const rr=()=>{sd0=(sd0*16807)%2147483647;return(sd0-1)/2147483646};
    for(let k=0;k<n;k++){const nv=2+Math.floor(rr()*7),ids=[];for(let j=0;j<nv;j++)ids.push(PRODUCTS[Math.floor(rr()*PRODUCTS.length)].id);if(opt.inc){const P2=PRODUCTS.filter(p=>opt.inc.includes(p.sid));for(let j=0;j<Math.min(nv,3);j++)ids[j]=P2[Math.floor(rr()*P2.length)].id}const vid=vz[Math.floor(rr()*vz.length)],occ=oc[Math.floor(rr()*oc.length)],sv=1+Math.floor(rr()*50);
      if(opt.pick!=null&&k!==opt.pick)continue;
      out.push(await qaRun(`C${k} ${vid} ${occ}`,s=>{LOD=opt.lod||0;const c=buildBq(s,[...new Set(ids)],sv,vid,0,occ,null);LOD=0;return c},vid,opt))}return out},
  /* exact recipes of the game: every stem burned must be drawn, nothing added (r.miss lists the gaps) */
  async recipes(n=20,opt={}){const out=[],vz=opt.vases||Object.keys(VZ),oc=Object.keys(OCCS);let sd0=opt.seed||1;const rr=()=>{sd0=(sd0*16807)%2147483647;return(sd0-1)/2147483646};
    for(let k=0;k<n;k++){const nv=2+Math.floor(rr()*10),m=new Map();for(let j=0;j<nv;j++){const id=PRODUCTS[Math.floor(rr()*PRODUCTS.length)].id;m.set(id,(m.get(id)||0)+1+Math.floor(rr()*9))}const rcp=[...m],vid=vz[Math.floor(rr()*vz.length)],occ=oc[Math.floor(rr()*oc.length)],sv=1+Math.floor(rr()*50);
      if(opt.pick!=null&&k!==opt.pick)continue;let miss=null;
      const res=await qaRun(`R${k} ${vid}`,s=>{LOD=opt.lod||0;const c=buildBq(s,[],sv,vid,0,occ,null,rcp);LOD=0;const got=new Map();for(const o of c.out){if(o.kind==='garnish'||!o.it)continue;got.set(o.it.p.id,(got.get(o.it.p.id)||0)+1)}miss=rcp.filter(([id,q])=>got.get(id)!==q).map(([id,q])=>id+' '+(got.get(id)||0)+'/'+q);return c},vid,opt);
      res.miss=miss;out.push(res)}return out},
  /* the player's hand in the shop's composer: random varieties, some counts forced, places at the extremes (1–3, 7–10), proposals kept or taken in */
  async hand(n=20,opt={}){const out=[],vz=opt.vases||Object.keys(VZ),oc=Object.keys(OCCS);let sd0=opt.seed||1;const rr=()=>{sd0=(sd0*16807)%2147483647;return(sd0-1)/2147483646};
    for(let k=0;k<n;k++){const nv=2+Math.floor(rr()*6),ids=[],qty=new Map(),pos=new Map();for(let j=0;j<nv;j++){const p=PRODUCTS[Math.floor(rr()*PRODUCTS.length)];if(ids.includes(p.id))continue;ids.push(p.id);if(rr()<.6)qty.set(p.id,1+Math.floor(rr()*12));const pl=[1,2,3,8,9,10,5,7][Math.floor(rr()*8)];if(pl!==5&&!opt.nopos)pos.set(p.id,pl)}
      const vid=vz[Math.floor(rr()*vz.length)],occ=oc[Math.floor(rr()*oc.length)],sv=1+Math.floor(rr()*50),na=rr()<.5;let miss=null;
      const res=await qaRun(`H${k} ${vid} ${[...pos].map(([i,p])=>i+':'+p).join(',')}`,s=>{LOD=opt.lod||0;PLANOPT={qty,pos,noAdds:na};try{const c=buildBq(s,ids,sv,vid,0,occ,null),got=new Map();for(const o of c.out){if(o.kind==='garnish'||!o.it)continue;got.set(o.it.p.id,(got.get(o.it.p.id)||0)+1)}
          miss=[...c.P.cnt].filter(([it,q])=>got.get(it.p.id)!==q).map(([it,q])=>it.p.id+' '+(got.get(it.p.id)||0)+'/'+q);return c}finally{PLANOPT=null;LOD=0}},vid,opt);
      res.miss=miss;out.push(res)}return out},
  sum(rs){const F={},U={};let nf=0,nu=0;for(const r of rs){for(const k of r.floating){nf++;const key=k.owner?`${k.owner.kind}/${k.owner.role}/${k.owner.id}`:'?';F[key]=(F[key]||0)+1}
      for(const u of r.under){nu++;const key=`${u.kind}/${u.role}/${u.id}${u.front?'/front':''}`;U[key]=(U[key]||0)+1}}
    return{bouquets:rs.length,floating:nf,under:nu,withF:rs.filter(r=>r.floating.length).length,withU:rs.filter(r=>r.under.length).length,F,U}}};
/* the fingerprint of a drawn bouquet: viewBox, then length and FNV-1a of the markup of the bouquet and of the shared gradients */
function chainPrint(){const h=t=>{let x=0x811c9dc5;for(let i=0;i<t.length;i++){x^=t.charCodeAt(i);x=Math.imul(x,16777619)>>>0}return t.length+':'+x.toString(16)},s=document.getElementById('bq'),d=document.getElementById('defs');
  return{vb:s.getAttribute('viewBox'),bq:h(s.innerHTML),defs:h(d.innerHTML),els:s.querySelectorAll('*').length}}
/* headless batch: ?run=models&a=0&b=10 or ?run=composed&n=30&seed=3 → the results land in <pre id="out"> */
{const Qr=new URLSearchParams(location.search),run=Qr.get('run');if(Qr.get('dbg'))window.QADBG=[];
  /* life stage of every bouquet of the batch: &life=0..3 (&lu=progress in the stage) */
  if(Qr.get('dps')!=null)DEPTH_PS=+Qr.get('dps');
  if(Qr.get('life')!=null&&typeof LIFE!=='undefined')LIFE={stage:+Qr.get('life'),u:+(Qr.get('lu')||.7)};
  /* ?run=chain&skus=20,2541&amounts=12,5&vaseId=41&seed=0x…&age=10.5: the bouquet drawn exactly as the on-chain page draws it (packages/engine/boot.js),
     its markup reduced to a fingerprint (length + FNV-1a of the bouquet and of the shared gradients), to compare with the page returned by BelaiEngine.html() */
  if(run==='chain'){const L=k=>(Qr.get(k)||'').split(',').filter(Boolean).map(Number),sk=L('skus'),am=L('amounts'),rc=[];sk.forEach((n,i)=>{const p=PRODUCTS[n-1];if(p)rc.push([p.id,am[i]||1])});
    const vid=(VZ0[+Qr.get('vaseId')]||VZ0[0]).id,sv=1+parseInt(String(Qr.get('seed')||'0x1').replace(/^0x/,'').slice(0,8)||'1',16)%999983,svg=E('svg',{id:'bq'},document.body),a=tw.length;
    LIFE=lifeAt(+Qr.get('age')||0);try{buildBq(svg,[],sv,vid,0,'juste',null,rc)}finally{LIFE=null}for(const w of tw.splice(a))w.fn(1,1);
    const[x,y,w,h]=(svg.getAttribute('viewBox')||'300 600 400 440').split(/\s+/).map(Number),m=Math.max(w,h)*.04;svg.setAttribute('viewBox',[x-m,y-m,w+2*m,h+m].map(v=>+v.toFixed(2)).join(' '));
    const pre=document.createElement('pre');pre.id='out';pre.textContent=Qr.get('full')?svg.innerHTML:JSON.stringify(chainPrint());document.body.prepend(pre);document.title='QA-DONE'}
  else if(run)(async()=>{const pre=document.createElement('pre');pre.id='out';let rs=[];
    try{if(run==='models'){const ns=(Qr.get('ns')||'').split(',').filter(Boolean).map(Number);if(ns.length){for(const m of MODELS.filter(m=>ns.includes(m.n)))rs.push(...await QA13.models(MODELS.indexOf(m),MODELS.indexOf(m)+1,{keep:+Qr.get('keep')||0,keepAll:+Qr.get('all')||0,zoom:+Qr.get('zoom')||0,seeds:(Qr.get('seeds')||'7').split(',').map(Number)}))}
        else rs=await QA13.models(+Qr.get('a')||0,+Qr.get('b')||999,{keep:+Qr.get('keep')||0,seeds:(Qr.get('seeds')||'7').split(',').map(Number)})}
      else if(run==='hand')rs=await QA13.hand(+Qr.get('n')||20,{seed:+Qr.get('seed')||1,nopos:+Qr.get('nopos')||0});
      else if(run==='recipes')rs=await QA13.recipes(+Qr.get('n')||20,{seed:+Qr.get('seed')||1,vases:Qr.get('vases')?Qr.get('vases').split(','):undefined});
      else rs=await QA13.composed(+Qr.get('n')||20,{seed:+Qr.get('seed')||1,keep:+Qr.get('keep')||0,keepAll:+Qr.get('all')||0,zoom:+Qr.get('zoom')||0,pick:Qr.get('pick')!=null?+Qr.get('pick'):null,vases:Qr.get('vases')?Qr.get('vases').split(','):undefined,inc:Qr.get('inc')?Qr.get('inc').split(','):undefined});
      pre.textContent=JSON.stringify({dbg:window.QADBG||null,sum:QA13.sum(rs),rs:rs.map(r=>({n:r.name,F:r.floating.map(k=>[k.area,k.at,k.owner&&[k.owner.kind,k.owner.role,k.owner.id,k.owner.st]]),U:r.under.map(u=>[u.px,u.kind,u.role,u.id,u.front,u.st]),K:(r.kinks||[]).map(k=>[k.turn,k.back,k.kind,k.role,k.id,k.st,k.at,k.dbg]),M:r.miss||null}))})}
    catch(e){pre.textContent='ERR '+e.message+' '+e.stack}document.body.prepend(pre);document.title='QA-DONE'})()}
