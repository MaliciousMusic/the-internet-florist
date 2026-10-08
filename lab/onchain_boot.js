
/* ---------- the living bouquet, redrawn from the chain alone ----------
   BELAI = {id, createdAt (unix seconds), vaseId (index in the vessel list), seed ('0x…' bytes32), skus:[…], amounts:[…]}
   SKU n is the n-th product of the frozen catalogue (the order the stems contract registered them in); the stage comes from
   the creation time and the viewer's clock, exactly as stageOf() on-chain: bud < 3 days, bloom < 20, decline < 30, faded.
   The bouquet is drawn at once in its final state (a marketplace thumbnail sees it whole), then only the breeze moves it */
function finished(){}
(()=>{const B=window.BELAI||{},svg=document.getElementById('bq');if(B.id)document.title=`Bouquet n° ${B.id} · Belai's Flowers`;
  const rc=[];(B.skus||[]).forEach((n,i)=>{const p=PRODUCTS[n-1];if(p)rc.push([p.id,+(B.amounts||[])[i]||1])});
  const vid=(VZ0[B.vaseId]||VZ0[0]).id,sv=1+parseInt(String(B.seed||'0x1').replace(/^0x/,'').slice(0,8)||'1',16)%999983;
  const age=Math.max(0,(Date.now()/1000-(+B.createdAt||Date.now()/1000))/86400),a=tw.length;
  LIFE=lifeAt(age);try{buildBq(svg,[],sv,vid,0,'juste',null,rc)}finally{LIFE=null}
  for(const w of tw.splice(a))w.fn(1,1);
  /* the frame of the living vase (as « Sur mon écran »): a little air around, the stand running on past the bottom edge */
  const[x,y,w,h]=(svg.getAttribute('viewBox')||'300 600 400 440').split(/\s+/).map(Number),m=Math.max(w,h)*.04;
  svg.setAttribute('viewBox',[x-m,y-m,w+2*m,h+m].map(v=>+v.toFixed(2)).join(' '));svg.setAttribute('preserveAspectRatio','xMidYMax meet');
  startIdle()})();
