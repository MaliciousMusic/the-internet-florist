<script>
setTimeout(()=>{const out=[];const RC=[
 [['rose-standard~19',12],['eucalyptus-cinerea~0',5],['gypsophile~0',3]],
 [['tulipe-simple~13',10],['tulipe-simple~7',7],['renoncule-classique~7',5],['anemone-coronaria~3',3]],
 [['pivoine-herbacee-double~0',5],['hortensia-boule~3',3],['delphinium~2',4]],
 [['lis-oriental~2',3],['phalaenopsis~0',2],['gerbera~5',7]],
 [['protea-cynaroides~0',3],['immortelle-xerochrysum~0',9],['eucalyptus-cinerea~1',6]]];
 // one big recipe: 30 varieties spread over the catalogue
 const big=[];for(let i=0;i<30;i++){const p=PRODUCTS[(i*127+11)%PRODUCTS.length];big.push([p.id,1+(i%3)])}RC.push(big);
 const vases=['cylindre-verre-clair','coupe-pied-blanche'];
 RC.forEach((rc,k)=>{for(const v of vases){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');document.body.append(svg);let c;
   try{renderStatic(()=>{c=buildBq(svg,[],7+k,v,0,'juste',null,rc)})}catch(e){out.push(`R${k+1} ${v} ERREUR ${e.message}`);continue}
   const got=new Map();for(const o of c.out){if(o.kind==='garnish')continue;const id=o.it&&o.it.p&&o.it.p.id;if(id)got.set(id,(got.get(id)||0)+1)}
   const bad=rc.filter(([id,n])=>(got.get(id)||0)!==n).map(([id,n])=>`${id} ${got.get(id)||0}/${n}`);
   const extra=[...got.keys()].filter(id=>!rc.some(r=>r[0]===id));
   const want=rc.reduce((a,r)=>a+r[1],0),have=[...got.values()].reduce((a,b)=>a+b,0);
   out.push(`R${k+1} ${v}: ${have}/${want} tiges${bad.length?' · écarts '+bad.slice(0,6).join(', '):''}${extra.length?' · en trop '+extra.join(','):''}`);svg.remove()}});
 const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=out.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
