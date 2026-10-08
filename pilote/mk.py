"""mk.py: the pilot page: the bouquet « Printemps à la carpe » (seed 23, bronze carp vessel) drawn before and after the pixel heads, side by side
(pilote/bq.html), and alone with pixel heads, alive (pilote/bqp.html)."""
import json
sp = r'C:/Users/agent/Desktop/flower-atelier/'
h = open(sp + 'demo7.html', encoding='utf-8').read()
src = open(sp + 'bronze/bq.py', encoding='utf-8').read()
ns = {}
exec(src[src.index('R = ['):src.index('SNAP = ')], ns)
R = ns['R']
SNAP = src[src.index('SNAP = r"""') + 11:src.index('"""', src.index('SNAP = r"""') + 11)]
HEAD = ("<script>const BZ_R=" + json.dumps(R) + ";" + SNAP + r"""
function bzBuild(c,sv,bg,px){const ids=BZ_R.map(r=>r[0]).filter(id=>PBY[id]),qty=new Map(BZ_R.map(r=>[r[0],r[1]])),pos=new Map(BZ_R.map(r=>[r[0],r[2]]));const s=E('svg',{},c);
  const a=tw.length;PLANOPT={qty,pos,noAdds:true};DEPTH_BG=bg;SV_ON=px;const ag=new URLSearchParams(location.search).get('age');if(ag!=null)LIFE=lifeAt(+ag);let r;try{r=buildBq(s,ids,sv,'bronze-carpe',0,'juste',null)}finally{PLANOPT=null;DEPTH_BG='#efe8de';SV_ON=true;LIFE=null}for(const w of tw.splice(a))w.fn(1,1);idle.length=0;
  const[x,y,w,hh]=s.getAttribute('viewBox').split(/\s+/).map(Number),m=Math.max(w,hh)*.04;s.setAttribute('viewBox',[x-m,y-m,w+2*m,hh+m].join(' '));s.setAttribute('preserveAspectRatio','xMidYMax meet');
  return{s,r}}
window.svgImg=async function(svg,W){const XS=new XMLSerializer(),vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number),H=Math.round(W*vb[3]/vb[2]);
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);let out='';const seen=new Set();
  const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);out+=s;add(s)}}};
  const body=[...svg.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('');add(body);
  const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${vb.join(' ')}"><defs>${out}</defs>${body}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);return[img,W,H]};
window.snapPair=async function(name,W=1100,crop){const L=[];for(const o of BZ_OUT)L.push(await svgImg(o.s,W));const H=Math.max(...L.map(x=>x[2])),cv=document.createElement('canvas');cv.width=W*L.length+12*(L.length-1);cv.height=H;
  const c=cv.getContext('2d');c.fillStyle='#ece6dc';c.fillRect(0,0,cv.width,cv.height);L.forEach(([im,w,h],i)=>c.drawImage(im,i*(W+12),H-h,w,h));if(crop){const[x0,y0,x1,y1]=crop,cw=Math.round((x1-x0)*W),ch=Math.round((y1-y0)*H),c2=document.createElement('canvas');c2.width=2*cw+12;c2.height=ch;const q=c2.getContext('2d');q.fillStyle='#ece6dc';q.fillRect(0,0,c2.width,c2.height);for(let i=0;i<2;i++)q.drawImage(cv,i*(W+12)+x0*W,y0*H,cw,ch,i*(cw+12),0,cw,ch);const r2=await fetch('http://127.0.0.1:8781/save?name=z_'+name,{method:'POST',body:c2.toDataURL('image/jpeg',.92)})}
  const r=await fetch('http://127.0.0.1:8781/save?name='+name,{method:'POST',body:cv.toDataURL('image/jpeg',.92)});document.title='pair '+r.status};
function bzClear(bg){const dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);document.body.style.cssText='margin:0;background:'+bg}
""")
gal = HEAD + r"""setTimeout(()=>{const Q=new URLSearchParams(location.search),sv=+(Q.get('s')||23),bg=bgCol(Q.get('bg')||'platre');CAST_S=+(Q.get('cs')||3);if(typeof CAST_SYNC!=='undefined')CAST_SYNC=true;bzClear(bg);
  const Wd=document.createElement('div');Wd.style.cssText='display:grid;grid-template-columns:repeat(2,1fr)';document.body.append(Wd);window.BZ_OUT=[];
  for(const px of[false,true]){const c=document.createElement('div');c.style.cssText='position:relative;height:900px;background:'+bgCss(bg);Wd.append(c);const o=bzBuild(c,sv,bg,px);o.s.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    const b=document.createElement('b');b.textContent=px?'après : pétales SVG (pilote)':'avant : dessin actuel';b.style.cssText='position:absolute;left:10px;top:8px;font:600 14px system-ui;color:#5a4a40';c.append(b);BZ_OUT.push(o)}if(Q.get('snap'))snapPair(Q.get('snap'),+(Q.get('sw')||1100),Q.get('crop')?Q.get('crop').split(',').map(Number):null)},500);</script></body>"""
i = h.rindex('</body>')
open(sp + 'pilote/bq.html', 'w', encoding='utf-8').write(h[:i] + gal + h[i + 7:])
print('ok', sum(r[1] for r in R), 'tiges')
