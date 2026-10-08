function renderStatic(fn){const a=tw.length,b=idle.length;fn();for(const w of tw.splice(a))w.fn(1,1);idle.length=b}
const SECT=[['Les focales','Les fleurs qui portent le regard : posées en triangle, à trois hauteurs.',p=>['xAnth','xPhalCluster','xCymbCluster','xLily','xDahlia'].includes(p.f)],
 ['Les secondaires','Elles construisent la masse, en dérives de couleur.',p=>['xRose','xRanunc','xCalla','xMum','xCarn'].includes(p.f)],
 ['Les texturées','Légèreté, frange et pointillés entre les têtes.',p=>['xNerine','xGlor','xPea','xScab'].includes(p.f)],
 ['Lignes & retombées','Ce qui dépasse et ce qui tombe : la signature des bouquets contemporains.',p=>['xDelph','xAllium','amaranthPlant','xPhalSpray','allium','grassLoop','willow','bareLine'].includes(p.f)]];
const W=$('w');
function card(par,name,sub,draw){const d=document.createElement('div');d.className='c';d.innerHTML=`<b>${name}</b><small>${sub}</small>`;const s=E('svg',{viewBox:'0 0 10 10'},null);d.prepend(s);par.append(d);
  renderStatic(()=>draw(s));const b=s.getBBox(),m=Math.max(b.width,b.height)*.06+4,sz=Math.max(b.width,b.height)+2*m;s.setAttribute('viewBox',`${f(b.x+b.width/2-sz/2)} ${f(b.y+b.height/2-sz/2)} ${f(sz)} ${f(sz)}`)}
for(const[t,sub,fl]of SECT){const sec=document.createElement('section');sec.innerHTML=`<h2>${t}</h2><p>${sub}</p><div class="g"></div>`;W.append(sec);const g=sec.querySelector('.g');
  for(const p of CAT.filter(fl))card(g,p.n,RAR[p.rar][0],s=>{seed=7+p.id.length*13;const o=Object.assign({},p.o);if(p.f==='xPhalSpray')Object.assign(o,{hang:1,side:1,len:200,n:6});FN[p.f](s,0,o)})}
{const sec=document.createElement('section');sec.innerHTML='<h2>Angles & stades</h2><p>Chaque fleur est modélisée en volume : pétales courbes projetés et ombrés selon l’angle. De face, de trois-quarts, de profil, de dos, mi-ouverte ou en bouton, à sa taille réelle.</p><div class="g"></div>';W.append(sec);const g=sec.querySelector('.g');
  const AX=[['de face',[0,0,1],1],['trois-quarts',[.55,.5,.67],1],['profil',[0,1,.1],1],['de dos',[.2,.35,-.9],1],['mi-ouverte',[.3,.5,.8],.5],['bouton',[0,.6,.8],.14]];
  for(const id of['dahlia-cafe','rose-peche','oeillet-corail','lys-stargazer','anthurium-bordeaux','renoncule-rose','scabieuse-noire','chrysantheme-mauve','tulipe-rouge','phalaenopsis-magenta'])for(const[nm,ax,op]of AX){const p=BYID[id];if(op<1&&!BUD3.has(p.f))continue;if(nm==='de dos'&&(p.f==='xPhalCluster'))continue;card(g,p.n,nm,s=>{seed=17;FN[p.f](s,0,Object.assign({},p.o,{ax,op,roll:0}))})}}
{const sec=document.createElement('section');sec.innerHTML='<h2>Les contenants</h2><p>Tirés de tes 82 références : coupes sur pied, boules émaillées, verre, métal, pique-fleurs, bouquet noué, papier.</p><div class="g"></div>';W.append(sec);const g=sec.querySelector('.g');
  for(const[id,v]of Object.entries(VZ))card(g,v.n,v.m,s=>{seed=31;if(v.kind==='hand'||v.kind==='wrap'){const bp=[VX,830];if(v.kind==='wrap')wrapBack(s,bp,v.paper);stemsBelow(s,9,id);if(v.kind==='wrap'){wrapFront(s,bp,v.paper);bow(s,VX,860,v.rib,.4)}else bow(s,VX,846,v.rib,.45)}
    else{if(v.kind==='kenzan'||v.kind==='glass')stemsBelow(s,7,id);vessel(s,id,0,{noPlinth:1})}})}
</script>
</body>
</html>
