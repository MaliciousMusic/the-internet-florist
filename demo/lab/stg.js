
/* ---------- stage sheet (?stg=1): each row one bouquet, each column one life stage (Bourgeon, Éclosion, Déclin, Fané)
   rows=a,b|c,d   bouquets as product ids (sid~colourway)      sp=<sid>&cw=0,3,7   one bouquet per colourway of a species
   stages=0,1,2,3  seed=7  vase=cylindre-verre-clair  u=.7 (progress within each stage) ---------- */
{const Q=new URLSearchParams(location.search);if(Q.get('stg'))setTimeout(()=>{
  const seed=+(Q.get('seed')||7),vase=Q.get('vase')||'cylindre-verre-clair',sp=Q.get('sp');
  const rows=sp?(Q.get('cw')||'0,1,2,3').split(',').map(i=>[`${sp}~${i}`]):(Q.get('rows')||'rose-standard~19,rose-standard~0,eucalyptus-cinerea~0,gypsophile~0|tulipe-simple~13,tulipe-simple~7,renoncule-classique~7,anemone-coronaria~3|pivoine-herbacee-double~0,hortensia-boule~3,delphinium~2|lis-oriental~2,phalaenopsis~0,gerbera~5|protea-cynaroides~0,immortelle-xerochrysum~0,eucalyptus-cinerea~1').split('|').map(r=>r.split(','));
  const ROWS=rows.map(r=>r.filter(id=>PBY[id])).filter(r=>r.length),NAMES=['Bourgeon','Éclosion','Déclin','Fané'],stages=(Q.get('stages')||'0,1,2,3').split(',').map(Number);
  document.body.innerHTML='';document.body.style.cssText='margin:0;background:#e9e3da;font:600 13px system-ui';
  const host=document.createElement('div');host.style.cssText=`display:grid;grid-template-columns:repeat(${stages.length},1fr);gap:4px;padding:4px`;document.body.append(host);
  let n=0;for(const ids of ROWS)for(const st of stages){const d=document.createElement('div');d.style.cssText='position:relative;background:radial-gradient(ellipse 85% 70% at 50% 38%,#f6f1ea,#efe8de 78%)';
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.style.cssText='display:block;width:100%;aspect-ratio:3/4';d.append(s);host.append(d);
    LIFE={stage:st,u:+(Q.get('u')||.7)};
    try{renderStatic(()=>buildBq(s,ids,seed,vase,0,'juste',null));n++}catch(e){d.append(String(e&&e.stack||e).slice(0,300))}finally{LIFE=null}
    const b=document.createElement('b');b.textContent=NAMES[st]+' · '+ids.map(i=>PBY[i].n+' '+PBY[i].cn).join(', ');b.style.cssText='position:absolute;left:6px;top:4px;color:#2a2020;background:#fff9;padding:1px 4px;max-width:92%';d.append(b)}
  document.title='STAGES-DONE '+n},1500)}
