<script>
setTimeout(async()=>{const out=[],p=(...a)=>out.push(a.join(' '));let host;
try{const d=GARDEN.find(b=>b.kind==='recu');const t0=performance.now();const sn=wSnap(d);p('snap ms',Math.round(performance.now()-t0),'svg KB',Math.round(sn.src.length/1024),'bz',(sn.src.match(/data-bz=/g)||[]).length,'vb',sn.vb.map(Math.round).join(' '));
 const bg=bgCol(d.bg);document.body.innerHTML='';document.body.style.cssText='margin:0;background:#888';host=document.createElement('div');host.style.cssText='display:flex;gap:6px;align-items:flex-start;flex-wrap:wrap;padding:6px';document.body.append(host);
 for(const k of['carre','tel','pc']){const t1=performance.now();const b=await wPng(sn,bg,WFMT[k]);p(k,'png KB',Math.round(b.size/1024),'ms',Math.round(performance.now()-t1));const im=new Image();im.src=URL.createObjectURL(b);im.style.cssText='height:'+(k==='pc'?300:k==='tel'?560:300)+'px;border:1px solid #333';host.append(im);await new Promise(r=>im.onload=r)}
 const h=wHtml(sn,bg,d);p('html KB',Math.round(h.length/1024));const fr=document.createElement('iframe');fr.style.cssText='width:520px;height:300px;border:1px solid #333';fr.srcdoc=h;host.append(fr);await new Promise(r=>fr.onload=r);await new Promise(r=>setTimeout(r,6000));
 const g=fr.contentDocument.querySelectorAll('[data-bz]');p('anim groups',g.length,'transform',g[0]&&g[0].getAttribute('transform'));
 const cls=(sn.src.match(/ class="[^"]*"/g)||[]).slice(0,5);p('class attrs',cls.length?cls.join(' '):'none');
}catch(e){p('ERR',e.message,e.stack)}
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=out.join(String.fromCharCode(10));document.body.prepend(pre);document.title='GAL-DONE'},3000);
</script>
