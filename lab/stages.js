<script>
/* stage sheet: each row one bouquet, each column one life stage (Bourgeon, Éclosion, Déclin, Fané); ?rows=a|b|c with a = comma separated product ids, &vase=…, &seed=… */
setTimeout(()=>{const Q=new URLSearchParams(location.search),seed=+(Q.get('seed')||7),vase=Q.get('vase')||'cylindre-verre-clair';
  const ROWS=(Q.get('rows')||'rose-standard~19,rose-standard~0,eucalyptus-cinerea~0,gypsophile~0|tulipe-simple~13,tulipe-simple~7,renoncule-classique~7,anemone-coronaria~3|pivoine-herbacee-double~0,hortensia-boule~3,delphinium~2|lis-oriental~2,phalaenopsis~0,gerbera~5|protea-cynaroides~0,immortelle-xerochrysum~0,eucalyptus-cinerea~1').split('|').map(r=>r.split(',').filter(id=>PBY[id]));
  const NAMES=['Bourgeon','Éclosion','Déclin','Fané'],stages=(Q.get('stages')||'0,1,2,3').split(',').map(Number);
  document.body.innerHTML='';document.body.style.cssText='margin:0;background:#e9e3da;font:600 13px system-ui';
  const host=document.createElement('div');host.style.cssText=`display:grid;grid-template-columns:repeat(${stages.length},1fr);gap:4px;padding:4px`;document.body.append(host);
  const t0=performance.now();let n=0;
  for(const ids of ROWS)for(const st of stages){const d=document.createElement('div');d.style.cssText='position:relative;background:'+bgCss(bgCol('lin'));
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.style.cssText='display:block;width:100%;aspect-ratio:3/4';d.append(s);host.append(d);
    LIFE={stage:st,u:+(Q.get("u")||.6)};
    try{renderStatic(()=>buildBq(s,ids,seed,vase,0,'juste',null));n++}catch(e){d.append(String(e&&e.stack||e).slice(0,300))}
    LIFE=null;
    const b=document.createElement('b');b.textContent=NAMES[st]+' · '+ids.map(i=>PBY[i].n).join(', ');b.style.cssText='position:absolute;left:6px;top:4px;color:#2a2020;background:#fff9;padding:1px 4px;max-width:92%';d.append(b)}
  const pre=document.createElement('pre');pre.id='dbgout';pre.textContent='rendered '+n+' in '+Math.round(performance.now()-t0)+' ms';document.body.append(pre);document.title='GAL-DONE'},3000);
</script>
