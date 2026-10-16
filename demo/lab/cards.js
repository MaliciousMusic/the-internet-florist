/* the Composer's cards of some species (?cards=sid,sid&k=6): each colourway drawn as in the app */
{const Q=new URLSearchParams(location.search);if(Q.get('cards')){document.body.style.cssText='margin:0;background:#efe9e1';const host=document.createElement('div');host.style.cssText='display:grid;grid-template-columns:repeat('+(Q.get('cols')||6)+',1fr);gap:6px;padding:6px';document.body.append(host);
  for(const sid of Q.get('cards').split(',')){const ps=PRODUCTS.filter(p=>p.sid===sid).slice(0,+(Q.get('k')||6));
    for(const p of ps){const d=document.createElement('div');d.style.cssText='position:relative;background:#f4efe8;border-radius:10px';const s=E('svg',{viewBox:'0 0 10 10',style:'display:block;width:100%;aspect-ratio:4/5'},d);host.append(d);
      LOD=1;renderStatic(()=>{if(CWS[p.sid])LOD=0;bunchArt(s,p)});LOD=0;fitBox(s,.07);const b=document.createElement('b');b.textContent=p.n+' · '+p.cn;b.style.cssText='position:absolute;left:6px;bottom:4px;font:600 10px system-ui;color:#4a3a30';d.append(b)}}
  document.title='CARDS-DONE'}}
