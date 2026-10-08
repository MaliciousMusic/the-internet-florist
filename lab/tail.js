function renderStatic(fn){const a=tw.length,b=idle.length;fn();for(const w of tw.splice(a))w.fn(1,1);idle.length=b}
function cell(name,vb,draw){const d=document.createElement('div');d.className='c';d.innerHTML=`<b>${name}</b>`;const s=E('svg',{viewBox:vb},d);$('w').append(d);renderStatic(()=>draw(s))}
const Q=new URLSearchParams(location.search);document.body.style.setProperty('--cols',Q.get('cols')||4);
const FQ=Q.get('f');(window.LAB||[]).filter(([n])=>!FQ||FQ.toLowerCase().split('|').some(q=>n.toLowerCase().includes(q))).forEach(([n,vb,fn])=>cell(n,vb,fn));
if(window.FIT)document.querySelectorAll('.c svg').forEach(s=>{const b=s.getBBox(),m=Math.max(b.width,b.height)*.08+3,z=Math.max(b.width,b.height)+2*m;s.setAttribute('viewBox',`${b.x+b.width/2-z/2} ${b.y+b.height/2-z/2} ${z} ${z}`)});
</script></body></html>
