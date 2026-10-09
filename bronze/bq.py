"""bq.py: a spring bouquet of 70 stems in the bronze carp vessel: bronze/bq.html (seeds side by side) and bronze/bqp.html (the chosen one, alive)."""
import json
sp = r'C:/Users/agent/Desktop/flower-atelier/'
h = open(sp + 'demo7.html', encoding='utf-8').read()
PROF = json.loads(open(sp + 'bronze/prof.json').read())
V = {"id": "bronze-carpe", "refs": [], "n": "Vase en bronze à la carpe", "m": "bronze patiné, carpe en haut-relief", "fam": "boule", "shape": "lathe", "p": 0,
     "mat": "metal", "fin": "patina", "col": "#4a4436", "col2": None, "lip": "rolled", "lipw": 3.6, "why": "", "prof": PROF, "h": PROF[-1][0],
     "mo": round(PROF[-1][1] - 3.9, 1), "sf": "none", "cast": "carpe"}
R = [  # [product, stems, place 1 (back) .. 10 (front)]
    ["cerisier-du-japon-sato-zakura~1", 3, 1], ["cognassier-du-japon~0", 2, 2], ["forsythia~1", 2, 2],
    ["iris-hollandais~0", 3, 3], ["iris-hollandais~2", 2, 3], ["lilas~0", 2, 4],
    ["tulipe-perroquet~0", 3, 5], ["tulipe-double~4", 3, 5], ["tulipe-simple~7", 3, 6], ["tulipe-simple~12", 2, 6], ["tulipe-frangee~6", 2, 6],
    ["renoncule-classique~16", 3, 7], ["renoncule-classique~7", 3, 6], ["renoncule-classique~3", 2, 6],
    ["narcisse-trompette~0", 3, 5], ["narcisse-bouquet~3", 3, 6], ["jacinthe~0", 2, 7], ["jacinthe~4", 2, 7],
    ["anemone-coronaria~3", 3, 8], ["anemone-sauvage~0", 2, 8], ["freesia~2", 2, 6], ["pois-de-senteur~3", 3, 7], ["pois-de-senteur~10", 2, 7],
    ["muscari~0", 4, 9], ["fritillaire-meleagris~0", 2, 8], ["glycine~1", 2, 9], ["viburnum-roseum~0", 3, 5], ["alchemille~0", 2, 6]]
SNAP = r"""window.snapSvg=async function(svg,W,name,bg){const XS=new XMLSerializer(),vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number),H=Math.round(W*vb[3]/vb[2]);
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);let out='';const seen=new Set();
  const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);out+=s;add(s)}}};
  const body=[...svg.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('');add(body);
  const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${vb.join(' ')}"><defs>${out}</defs>${body}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');if(bg){cx.fillStyle=bg;cx.fillRect(0,0,W,H)}
  cx.drawImage(img,0,0,W,H);const d=cv.toDataURL('image/png');const r=await fetch('http://127.0.0.1:8781/save?name='+name,{method:'POST',body:d});return[r.status,W,H]};"""
HEAD = ("<script>const BZ_V=" + json.dumps(V, ensure_ascii=False) + ";VZ0.push(BZ_V);VZ[BZ_V.id]=BZ_V;const BZ_R=" + json.dumps(R) + ";" + SNAP + r"""
function bzBuild(c,sv,bg){const ids=BZ_R.map(r=>r[0]).filter(id=>PBY[id]),qty=new Map(BZ_R.map(r=>[r[0],r[1]])),pos=new Map(BZ_R.map(r=>[r[0],r[2]]));const s=E('svg',{},c);
  const a=tw.length;PLANOPT={qty,pos,noAdds:true};DEPTH_BG=bg;let r;try{r=buildBq(s,ids,sv,BZ_V.id,0,'juste',null)}finally{PLANOPT=null;DEPTH_BG='#efe8de'}for(const w of tw.splice(a))w.fn(1,1);idle.length=0;
  const[x,y,w,hh]=s.getAttribute('viewBox').split(/\s+/).map(Number),m=Math.max(w,hh)*.04;s.setAttribute('viewBox',[x-m,y-m,w+2*m,hh+m].join(' '));s.setAttribute('preserveAspectRatio','xMidYMax meet');
  const got={};let n=0;for(const o of r.out){if(o.kind==='garnish'||!o.it)continue;n++;got[o.it.p.id]=(got[o.it.p.id]||0)+1}
  return{s,r,n,miss:BZ_R.filter(q=>!PBY[q[0]]).map(q=>q[0]),bad:BZ_R.filter(q=>(got[q[0]]||0)!==q[1]).map(q=>q[0]+' '+(got[q[0]]||0)+'/'+q[1])}}
function bzClear(bg){const dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);document.body.style.cssText='margin:0;background:'+bg}
""")
gal = HEAD + r"""setTimeout(()=>{const Q=new URLSearchParams(location.search),seeds=(Q.get('seeds')||'7').split(',').map(Number),bg=bgCol(Q.get('bg')||'platre');CAST_S=+(Q.get('cs')||3);bzClear(bg);
  const Wd=document.createElement('div');Wd.style.cssText='display:grid;grid-template-columns:repeat(2,1fr)';document.body.append(Wd);window.BZ_OUT=[];
  for(const sv of seeds){const c=document.createElement('div');c.style.cssText='position:relative;height:900px;background:'+bgCss(bg);Wd.append(c);const o=bzBuild(c,sv,bg);o.s.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    const b=document.createElement('b');b.textContent='graine '+sv+' · '+o.n+' tiges';b.style.cssText='position:absolute;left:10px;top:8px;font:600 14px system-ui;color:#5a4a40';c.append(b);BZ_OUT.push({sv,n:o.n,bad:o.bad,miss:o.miss})}},500);</script></body>"""
pv = HEAD + r"""setTimeout(()=>{const Q=new URLSearchParams(location.search),sv=+(Q.get('s')||7),bg=bgCol(Q.get('bg')||'platre');CAST_S=+(Q.get('cs')||5);document.title='Printemps à la carpe';bzClear(bg);
  document.body.style.cssText+=';font-family:Georgia,serif;height:100vh;overflow:hidden';const c=document.createElement('div');c.style.cssText='position:relative;height:100vh;background:'+bgCss(bg)+';overflow:hidden';document.body.append(c);
  const o=bzBuild(c,sv,bg);o.s.style.cssText='position:absolute;left:2%;top:1%;width:96%;height:88%';window.BZ_OUT=o;
  const cap=document.createElement('div');cap.style.cssText='position:absolute;left:0;right:0;bottom:3%;text-align:center;color:#3a2c26';
  cap.innerHTML='<div style="font-style:italic;font-size:clamp(22px,2.6vw,36px)">Printemps à la carpe</div><div style="font:500 clamp(11px,1vw,14px) system-ui;letter-spacing:.18em;text-transform:uppercase;opacity:.7;margin-top:6px">vase en bronze à la carpe · '+o.n+' tiges</div>';c.append(cap);
  if(!Q.get('still')){const t0=performance.now();aliveBq(o.s,o.r).then(()=>{window.ALIVE_MS=Math.round(performance.now()-t0)})}},400);</script></body>"""
i = h.rindex('</body>')
open(sp + 'bronze/bq.html', 'w', encoding='utf-8').write(h[:i] + gal + h[i + 7:])
open(sp + 'bronze/bqp.html', 'w', encoding='utf-8').write(h[:i] + pv + h[i + 7:])
print('ok', len(R), 'variétés', sum(r[1] for r in R), 'tiges')
