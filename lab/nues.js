/* nues.js — how much bare stem a drawn bouquet shows above the rim.
   The bouquet svg is rasterized without its filters; every stem drawn in the stems layers (stems, fst) is painted
   in a key colour that carries its element index (not the leaves a stem carries, tagged data-lf by c5), so what
   the canvas still shows of that colour is the bare stem seen between the flowers. Usage (in a page that drew the bouquet): await nues(svg, c) → {share, bands, top, len}
   share: bare-stem pixels / painted pixels above the rim; bands: the same share by tenth of height, from the rim up;
   len: bare stem in stem-widths (≈ length in svg units / 4); top: the elements that show the most. */
async function nues(svg,c,o={}){const W=o.W||900,vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number),H=Math.round(W*vb[3]/vb[2]);
  const XS=new XMLSerializer(),find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id),seen=new Set();let defs='';
  const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id)||/^cs\d/.test(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);defs+=s;add(s)}}};
  let body=[...svg.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('').replace(/\sfilter="url\(#[^"]+\)"/g,'');add(body);
  /* the key colour of element i: rgb(255, i, 255) */
  const idx=new Set();for(const m of body.matchAll(/data-o="(\d+)"/g))idx.add(+m[1]);
  let css='';for(const i of idx){if(i>250)continue;const k=s=>['stems','fst'].map(l=>`[data-l=${l}]>[data-o="${i}"]:not([data-lf])${s},[data-l=${l}]>[data-o="${i}"]:not([data-lf]) *${s}`).join(',');
    css+=`${k('')}{opacity:1!important;fill-opacity:1!important;stroke-opacity:1!important}${k('[fill]:not([fill=none])')}{fill:rgb(255,${i},255)!important}${k('[stroke]:not([stroke=none])')}{stroke:rgb(255,${i},255)!important}`}
  const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${vb.join(' ')}"><style>${css}</style><defs>${defs}</defs>${body}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(img,0,0,W,H);const px=cx.getImageData(0,0,W,H).data;
  const v=VZ[o.vid||(c.P&&c.P.vid)]||o.v,held=v&&(v.kind==='hand'||v.kind==='wrap'),rimY=held?c.BP[1]:FL-vMh(v),sc=W/vb[2],ry=Math.round((rimY-vb[1])*sc);
  let paint=0,bare=0;const per={},bT=new Array(10).fill(0),bB=new Array(10).fill(0);let top=H;
  for(let y=0;y<Math.min(H,ry);y++)for(let x=0;x<W;x++){const j=(y*W+x)*4;if(px[j+3]<128)continue;if(y<top)top=y}
  for(let y=top;y<Math.min(H,ry);y++){const b=Math.min(9,Math.floor((ry-y)/Math.max(1,ry-top)*10));for(let x=0;x<W;x++){const j=(y*W+x)*4;if(px[j+3]<128)continue;paint++;bT[b]++;
    if(px[j]===255&&px[j+2]===255&&px[j+3]===255){bare++;bB[b]++;const i=px[j+1];per[i]=(per[i]||0)+1}}}
  const lst=c.list||[],u2=1/(sc*sc);
  const topE=Object.entries(per).map(([i,n])=>{const e=lst[+i];return{i:+i,id:e?(e.it?e.it.p.id:e.kind):'?',k:e?e.kind+'/'+e.role:'',len:Math.round(n*u2/4)}}).sort((a,b)=>b.len-a.len);
  return{share:+(bare/Math.max(1,paint)).toFixed(4),bands:bB.map((n,i)=>+(n/Math.max(1,bT[i])).toFixed(3)),len:Math.round(bare*u2/4),top:topE.slice(0,o.n||15),png:o.png?cv.toDataURL('image/png'):undefined}}
