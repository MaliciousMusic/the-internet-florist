<script>
setTimeout(()=>{const Q=new URLSearchParams(location.search),ns=(Q.get('ns')||'').split(',').map(Number);document.body.innerHTML='';document.body.style.cssText='margin:0;background:#e9e3da';
const host=document.createElement('div');host.style.cssText='display:grid;grid-template-columns:repeat('+(Q.get('cols')||3)+',1fr);gap:4px';document.body.append(host);
for(const n of ns){const m=MODELS.find(x=>x.n===n);if(!m)continue;const d=document.createElement('div');d.style.cssText='position:relative;background:'+bgCss(bgCol(m.bg||'lin'));
const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.style.cssText='display:block;width:100%;aspect-ratio:3/4';d.append(s);host.append(d);
try{renderStatic(()=>buildBq(s,[],7,m.vase,0,null,JSON.parse(JSON.stringify(m))))}catch(e){d.append(e.message)}
const b=document.createElement('b');b.textContent=m.n+' '+m.nom+' · '+VZ[m.vase].n;b.style.cssText='position:absolute;left:6px;top:4px;font:600 13px system-ui;color:#2a2020;background:#fff8;padding:1px 4px';d.append(b)}
document.title='GAL-DONE'},3000);
</script>
