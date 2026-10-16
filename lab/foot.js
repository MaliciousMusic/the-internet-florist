/* foot.js — the real footprint of each species' head, measured on drawn bouquets, for the composer (app/z6.js FOOT_SP).
   Each head of a drawn bouquet is rasterized alone (its groups in the mass, front and back layers, filters off) and its
   painted pixels are reduced to their centroid and second moments. In the frame of its stem (along: from the stem's base
   to the head; across: to the right of it), relative to the point the composer placed (o.x, o.y) and in units of the radius
   the composer gave it (o.rr): [across offset, along offset, semi-axis across, semi-axis along] (semi-axis = 2 sigma, so a
   solid ellipse gives its own axes back), and its neck (nk). Usage: const s = await footSamples(svg, c); then footTable([...samples]). */
async function footSamples(svg,c,o={}){const lst=c.list||[],BP=c.BP,XS=new XMLSerializer(),PX=o.px||4,out=[];
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);
  /* heads (at the place c5 drew them) and clusters on their own stem (kind self, at the place the composer aimed them: c.heads X Y) */
  const aim=new Map();for(const e of c.heads||[])if(e.o&&e.o.kind==='self')aim.set(e.o,[e.X??e.x,e.Y??e.y,e.r]);
  for(let i=0;i<lst.length;i++){const h0=lst[i];if(!h0.it||h0.kind!=='head'&&!aim.has(h0))continue;const A=aim.get(h0),h=A?{x:A[0],y:A[1],rr:A[2],it:h0.it,st:h0.st,rim:h0.rim}:h0;
    const gs=[...svg.querySelectorAll(`[data-l=mass]>[data-o="${i}"],[data-l=front]>[data-o="${i}"],[data-l=back]>[data-o="${i}"]`)];if(!gs.length)continue;
    let bb=null;for(const g of gs){const b=g.getBBox();if(!b.width)continue;bb=bb?[Math.min(bb[0],b.x),Math.min(bb[1],b.y),Math.max(bb[2],b.x+b.width),Math.max(bb[3],b.y+b.height)]:[b.x,b.y,b.x+b.width,b.y+b.height]}
    if(!bb)continue;const m=2,x0=bb[0]-m,y0=bb[1]-m,w=bb[2]-bb[0]+2*m,hh=bb[3]-bb[1]+2*m,sc=Math.min(PX,700/Math.max(w,hh)),W=Math.ceil(w*sc),H=Math.ceil(hh*sc);
    const seen=new Set();let defs='';const add=x=>{for(const mm of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=mm[1]||mm[2];if(seen.has(id)||/^cs\d/.test(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);defs+=s;add(s)}}};
    const body=gs.map(g=>XS.serializeToString(g)).join('').replace(/\sfilter="url\(#[^"]+\)"/g,'');add(body);
    const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${x0} ${y0} ${w} ${hh}"><defs>${defs}</defs>${body}</svg>`;
    const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;try{await img.decode()}catch(_){URL.revokeObjectURL(url);continue}URL.revokeObjectURL(url);
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(img,0,0,W,H);const px=cx.getImageData(0,0,W,H).data;
    let n=0,sx=0,sy=0,sxx=0,syy=0,sxy=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(px[(y*W+x)*4+3]<128)continue;const X=x0+(x+.5)/sc,Y=y0+(y+.5)/sc;n++;sx+=X;sy+=Y;sxx+=X*X;syy+=Y*Y;sxy+=X*Y}
    if(n<20)continue;const mx=sx/n,my=sy/n,vxx=sxx/n-mx*mx,vyy=syy/n-my*my,vxy=sxy/n-mx*my;
    /* the stem's frame: from its base (the binding point) to the head */
    let ux=h.x-BP[0],uy=h.y-BP[1];const l=Math.hypot(ux,uy);if(l<6){ux=0;uy=-1}else{ux/=l;uy/=l}const px_=-uy,py_=ux,dx=mx-h.x,dy=my-h.y,r=h.rr||20;
    const va=ux*ux*vxx+2*ux*uy*vxy+uy*uy*vyy,vc=px_*px_*vxx+2*px_*py_*vxy+py_*py_*vyy;
    /* its neck: how far toward the stem's base the point where the bouquet stem takes over lies (c5's 60 % rule), in r */
    const ne=h.stemP&&h.it.d3?h.stemP[3]:null,hb=[BP[0]-h.x,BP[1]-h.y],Lb=Math.hypot(hb[0],hb[1])||1,nk=ne?((ne[0]-h.x)*hb[0]+(ne[1]-h.y)*hb[1])/Lb/r:0;
    out.push({sid:h.it.p.sid,st:h.st,rim:!!h.rim,area:n/(sc*sc)/(r*r),nk,f:[(dx*px_+dy*py_)/r,(dx*ux+dy*uy)/r,2*Math.sqrt(Math.max(0,vc))/r,2*Math.sqrt(Math.max(0,va))/r]})
    if(o.yield&&i%8===0)await new Promise(r=>setTimeout(r,0))}
  return out}
/* per species, for app/z6.js: [offset along, semi-axis across (+ half the median sideways offset: one-sided sprays), semi-axis along, n]
   medians over its open heads off the rim (all its heads when fewer than 2); rounded */
function footTable(S){const by={};for(const s of S)(by[s.sid]=by[s.sid]||[]).push(s);const T={};
  for(const k of Object.keys(by).sort()){let a=by[k].filter(s=>s.st==='open'&&!s.rim);if(a.length<2)a=by[k];const q=(L,f,p)=>{const v=L.map(f).sort((x,y)=>x-y);return v[Math.min(v.length-1,Math.floor(v.length*p))]},r2=x=>Math.round(x*100)/100;
    T[k]=[r2(q(a,s=>s.f[1],.5)),r2(q(a,s=>s.f[2],.5)+q(a,s=>Math.abs(s.f[0]),.5)*.5),r2(q(a,s=>s.f[3],.5)),a.length]}return T}
