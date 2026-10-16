/* coeurs.js — the clipping audit of a drawn bouquet: how much of each flower's heart is covered by something drawn over it.
   A head's heart is measured on the head alone (rasterized with its groups only): the centroid of its painted pixels and a circle of
   .35 of its equivalent radius (2 sigma, as lab/foot.js). Then the whole bouquet is rasterized with every element painted in a key
   colour (element i: rgb(i, 17, 211)), stems and vessel hidden: a heart pixel that shows another element's key is covered by it.
   await coeurs(svg, c, {vid}) → {n, hits: [{i, id, by, byKind, cov}], pierce: [{i, id, through, n}]}: cov the covered share of the heart
   (a hit is cov > lim, .3; deep: hidden by a clearly bigger head, depth; veil: under a light spray on its own stem, up to .6, as florists
   veil); pierce, the stems that seem to run through a flower behind their own head (see 3). */
async function coeurs(svg,c,o={}){const lst=c.list||[],XS=new XMLSerializer(),lim=o.lim??.3,PX=o.px||3,vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number);
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);
  const raster=async(body,x0,y0,w,h,sc,css='')=>{const seen=new Set();let defs='';const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id)||/^cs\d/.test(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);defs+=s;add(s)}}};add(body);
    const W=Math.ceil(w*sc),H=Math.ceil(h*sc),src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${x0} ${y0} ${w} ${h}"><style>${css}</style><defs>${defs}</defs>${body}</svg>`;
    const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(img,0,0,W,H);return{W,H,px:cx.getImageData(0,0,W,H).data}};
  const groups=i=>[...svg.querySelectorAll(`[data-l=mass]>[data-o="${i}"],[data-l=front]>[data-o="${i}"],[data-l=back]>[data-o="${i}"]`)];
  /* 1. the hearts, head by head */
  const hearts=[];for(let i=0;i<lst.length&&i<250;i++){const h=lst[i];if(h.kind!=='head'||!h.it)continue;const gs=groups(i);if(!gs.length)continue;
    let bb=null;for(const g of gs){const b=g.getBBox();if(!b.width)continue;bb=bb?[Math.min(bb[0],b.x),Math.min(bb[1],b.y),Math.max(bb[2],b.x+b.width),Math.max(bb[3],b.y+b.height)]:[b.x,b.y,b.x+b.width,b.y+b.height]}if(!bb)continue;
    const w=bb[2]-bb[0]+4,hh=bb[3]-bb[1]+4,sc=Math.min(PX,500/Math.max(w,hh)),R=await raster(gs.map(g=>XS.serializeToString(g)).join('').replace(/\sfilter="url\(#[^"]+\)"/g,''),bb[0]-2,bb[1]-2,w,hh,sc);
    let n=0,sx=0,sy=0,sxx=0,syy=0,sxy=0;for(let y=0;y<R.H;y++)for(let x=0;x<R.W;x++){if(R.px[(y*R.W+x)*4+3]<128)continue;const X=bb[0]-2+(x+.5)/sc,Y=bb[1]-2+(y+.5)/sc;n++;sx+=X;sy+=Y;sxx+=X*X;syy+=Y*Y;sxy+=X*Y}
    if(n<12)continue;const mx=sx/n,my=sy/n,vxx=sxx/n-mx*mx,vyy=syy/n-my*my,vxy=sxy/n-mx*my,rad=2*Math.sqrt(Math.sqrt(Math.max(1e-6,vxx*vyy-vxy*vxy))),hr=rad*.35;
    /* the heart's own painted pixels (in bouquet units) */
    const pts=[];for(let y=0;y<R.H;y++)for(let x=0;x<R.W;x++){if(R.px[(y*R.W+x)*4+3]<128)continue;const X=bb[0]-2+(x+.5)/sc,Y=bb[1]-2+(y+.5)/sc;if((X-mx)**2+(Y-my)**2<=hr*hr)pts.push([X,Y])}
    hearts.push({i,id:h.it.p.id,x:mx,y:my,hr,pts,n:n/(sc*sc)});if(o.yield&&i%10===0)await new Promise(r=>setTimeout(r,0))}
  /* 2. every element in its key colour, in its drawing order; stems, vessel and plinth hidden. The <use> clones are expanded first
     (the page's style rules do not reach inside them) */
  const cl=svg.cloneNode(true),NS='http://www.w3.org/2000/svg';
  for(let pass=0;pass<4;pass++){const us=[...cl.querySelectorAll('use')].filter(u=>!u.closest('defs'));if(!us.length)break;
    for(const u of us){const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').slice(1),ref=find(id),g=document.createElementNS(NS,'g');
      let tf=u.getAttribute('transform')||'';const ux=+u.getAttribute('x')||0,uy=+u.getAttribute('y')||0;if(ux||uy)tf+=` translate(${ux},${uy})`;if(tf)g.setAttribute('transform',tf);
      for(const a of['fill','stroke','opacity','fill-opacity','stroke-width'])if(u.hasAttribute(a))g.setAttribute(a,u.getAttribute(a));
      if(ref){const k=ref.cloneNode(true);k.removeAttribute('id');if(k.tagName==='symbol'){const kg=document.createElementNS(NS,'g');while(k.firstChild)kg.append(k.firstChild);g.append(kg)}else g.append(k)}u.replaceWith(g)}}
  const body=[...cl.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('').replace(/\sfilter="url\(#[^"]+\)"/g,'');
  let css='[data-l=stems],[data-l=fst],[data-l=vase],[data-l=vback],[data-l=plinth]{display:none}';
  for(let i=0;i<lst.length&&i<250;i++){const k=['mass','front','back','deep'].map(l=>`[data-l=${l}]>[data-o="${i}"]`),col=`rgb(${i},17,211)`;
    css+=`${k.join(',')},${k.map(s=>s+' *').join(',')}{opacity:1!important;fill-opacity:1!important;stroke-opacity:1!important}`+
      `${k.map(s=>s+'[fill]:not([fill=none]),'+s+' [fill]:not([fill=none])').join(',')}{fill:${col}!important}${k.map(s=>s+'[stroke]:not([stroke=none]),'+s+' [stroke]:not([stroke=none])').join(',')}{stroke:${col}!important}`}
  const sc=o.sc||Math.min(4,1600/vb[2]),A=await raster(body,vb[0],vb[1],vb[2],vb[3],sc,css),hits=[];let deeps=0,veils=0;
  for(const h of hearts){let n=0;const by={};for(const[X,Y]of h.pts){const x=Math.floor((X-vb[0])*sc),y=Math.floor((Y-vb[1])*sc);if(x<0||y<0||x>=A.W||y>=A.H)continue;const j=(y*A.W+x)*4;n++;
      if(A.px[j+1]===17&&A.px[j+2]===211&&A.px[j]!==h.i)by[A.px[j]]=(by[A.px[j]]||0)+1}
    /* a head clearly bigger (1.3 times the painted area) hiding a smaller one's heart is depth, counted apart (deep), not as a hit */
    const big=k=>{const hk=hearts.find(e=>e.i===+k);return hk&&hk.n>=h.n*1.3};let deep=0;for(const k in by)if(big(k)){deep+=by[k];delete by[k]}
    let bi=-1,bn=0,tot=0;for(const k in by){tot+=by[k];if(by[k]>bn){bn=by[k];bi=+k}}const cov=n?tot/n:0;if(n&&deep/n>lim)deeps++;
    const eb=lst[bi];if(cov>lim&&eb&&eb.kind==='self'&&cov<=.6){veils++;continue}
    if(cov>lim){const e=lst[bi];hits.push({i:h.i,id:h.id,bi,by:e?(e.it?e.it.p.id:e.kind):'?',byKind:e?e.kind+'/'+(e.role||''):'',cov:+cov.toFixed(2),hx:+h.x.toFixed(1),hy:+h.y.toFixed(1),hr:+h.hr.toFixed(1)})}}
  /* 3. stems run through: a head's stem (c5 stemP, and its neck) sampled above the vessel; where a flower drawn BEHIND that head hides it
     (in the back, mass or front layers: the deep layer lies under the stems),
     the stem seems to run through that flower (3 samples or more, every 3 units, make one) */
  const rank=new Map();for(const l of['deep','back','mass','front'])for(const n of svg.querySelectorAll(`[data-l=${l}]>[data-o]`)){const i=+n.dataset.o;rank.set(i,['deep','back','mass','front'].indexOf(l)*1e6+i)}
  const v=o.v||VZ[o.vid]||null,top=x=>v&&v.prof?vSilTop(v,x):(c.BP?c.BP[1]:1e9),pierce=[];
  for(let i=0;i<lst.length&&i<250;i++){const h=lst[i];if(h.kind!=='head'||!h.stemP||h.rim)continue;const P=h.stemP,pts=[];
    for(let k=0;k<=60;k++)pts.push(bz(P,k/60));if(h.np)for(const q of h.np)pts.push(q);const by={};
    for(const[X,Y]of pts){if(Y>top(X)-1)continue;const x=Math.floor((X-vb[0])*sc),y=Math.floor((Y-vb[1])*sc);if(x<0||y<0||x>=A.W||y>=A.H)continue;const j=(y*A.W+x)*4;
      if(A.px[j+1]!==17||A.px[j+2]!==211)continue;const k2=A.px[j];if(k2===i)continue;const rk=rank.get(k2)??-1;if(rk>=1e6&&rk<(rank.get(i)??0))by[k2]=(by[k2]||0)+1}
    for(const k in by)if(by[k]>=3){const e=lst[+k];pierce.push({i,id:h.it.p.id,through:e?(e.it?e.it.p.id:e.kind):'?',n:by[k]})}}
  return{n:hearts.length,hits:hits.sort((a,b)=>b.cov-a.cov),pierce,deep:deeps,veil:veils}}
