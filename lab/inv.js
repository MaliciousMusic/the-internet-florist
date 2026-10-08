/* ?inv=1 : per-species inventory of the flower renderer, as CSV in <pre id="out"> */
{const Qi=new URLSearchParams(location.search);if(Qi.get('inv'))(async()=>{const STEMC=new Set(['spike','spray','line','foliage','berries','drape','accessory']),SPF=new Set(['xDelph','xAllium','oncidium','xSanders','xSnake','xLichen','xSmoke','amaranthPlant']),
  L={'3D param':'volume (paramétrique)','3D main':'volume (dessin dédié)','tige':'tige portée','2D main':'à plat (dessin dédié)','2D param':'à plat (paramétrique)'},host=E('svg',{width:300,height:300,viewBox:'-400 -400 800 800'},document.body),rows=[];
  for(const r of RECIPES){const fn=r.a==='custom'?(r.p||{}).fn:null,m=MBY[r.id]||{},d3=is3D(r);let c,views,stages;
    if(d3){c='3D '+(fn?'main':'param');views='tous';stages=(fn&&BUD3.has(fn))||OPENABLE.has(r.a)?3:1}else if(fn&&SPF.has(fn)||STEMC.has(r.a)){c='tige';views=1;stages=1}
    else{c=fn?'2D main':'2D param';views=fn?1+Object.keys(VW[fn]||{}).length:1;stages=fn&&hasView(fn,'bud')?(hasView(fn,'half')?3:2):1}
    const g=G(host);let nodes=0;try{const a=tw.length,b=idle.length;drawRec(g,0,r,{col:(r.cols||['#e8a0b0'])[0]});for(const w of tw.splice(a))w.fn(1,1);idle.length=b;nodes=g.querySelectorAll('*').length}catch(e){nodes=-1}g.remove();
    rows.push([r.id,(m.n||'').replace(/;/g,','),m.c,m.r,L[c],views,stages,(r.cols||[]).length,Math.min(4,(r.cols||[]).length),nodes,r.a+(fn?'/'+fn:''),(r.stem&&r.stem.leaf)||'none'].join(';'))}
  const pre=document.createElement('pre');pre.id='out';pre.textContent='id;nom;categorie;role;rendu;angles;stades;couleurs_definies;couleurs_proposees;elements_svg;archetype;feuille_de_tige\n'+rows.join('\n');document.body.prepend(pre)})()}
