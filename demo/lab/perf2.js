/* perf2: which species weigh what in a bouquet (elements and gradients per drawn element) */
{const Q=new URLSearchParams(location.search);if(Q.get('perf2')){const ns=(Q.get('ns')||'').split(',').filter(Boolean).map(Number),agg={};const s=E('svg',{viewBox:'0 0 1000 1000'},document.body);
  for(const m of MODELS.filter(m=>!ns.length||ns.includes(m.n))){let c;renderStatic(()=>{c=buildBq(s,[],7,m.vase,0,null,m)});const list=c.list;
    const byO={};for(const n of s.querySelectorAll('[data-o]')){const i=+n.dataset.o,cnt=n.querySelectorAll('*').length+1;byO[i]=(byO[i]||0)+cnt}
    const grads=s.querySelectorAll('linearGradient,radialGradient').length;
    list.forEach((o,i)=>{const id=o.kind==='head'||o.kind==='self'||o.kind==='drape'?(o.it&&o.it.p.sid)+'/'+o.kind:o.kind;const a=agg[id]=agg[id]||{n:0,el:0};a.n++;a.el+=byO[i]||0})}
  const rows=Object.entries(agg).map(([k,v])=>[k,v.n,Math.round(v.el/v.n),v.el]).sort((a,b)=>b[3]-a[3]).slice(0,400);
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(rows);document.body.prepend(pre)}}
