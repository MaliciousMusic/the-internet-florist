/* perf3: time spent in each drawing function while building every model bouquet */
{const Q=new URLSearchParams(location.search);if(Q.get('perf3')){const T={},C={};const wrap=(obj,k,name)=>{const f0=obj[k];obj[k]=function(...a){const t0=performance.now();try{return f0.apply(this,a)}finally{T[name]=(T[name]||0)+performance.now()-t0;C[name]=(C[name]||0)+1}}};
  for(const k of['xAnth','xCalla','xPhalCluster','xCymbCluster','amaranthPlant'])if(FN[k])wrap(FN,k,k);for(const k in GH)wrap(GH,k,k);
  const s=E('svg',{viewBox:'0 0 1000 1000'},document.body);let tot=0;const t0=performance.now();
  for(const m of MODELS){LOD=+(Q.get('lod')||0);renderStatic(()=>buildBq(s,[],7,m.vase,0,null,m));LOD=0}tot=performance.now()-t0;
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify({tot:Math.round(tot),fn:Object.fromEntries(Object.entries(T).map(([k,v])=>[k,[Math.round(v),C[k],+(v/C[k]).toFixed(1)]]))});document.body.prepend(pre)}}
