/* perf: build model bouquets and report the time and the size of the drawing */
{const Q=new URLSearchParams(location.search);if(Q.get('perf')){const ns=(Q.get('ns')||'').split(',').filter(Boolean).map(Number),out=[];const s=E('svg',{viewBox:'0 0 1000 1000',style:'width:600px;height:600px'},document.body);
  let tT=0,tE=0,tG=0;for(const m of MODELS.filter(m=>!ns.length||ns.includes(m.n))){const t0=performance.now();LOD=+(Q.get('lod')||0);renderStatic(()=>buildBq(s,[],7,m.vase,0,null,m));LOD=0;const dt=performance.now()-t0,el=s.querySelectorAll('*').length,gr=s.querySelectorAll('linearGradient,radialGradient').length;
    tT+=dt;tE+=el;tG+=gr;out.push([m.n,Math.round(dt),el,gr])}
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify({n:out.length,avgMs:Math.round(tT/out.length),avgEl:Math.round(tE/out.length),avgGrad:Math.round(tG/out.length),max:out.sort((a,b)=>b[2]-a[2]).slice(0,8)});document.body.prepend(pre)}}
