/* timing of the spikes: each species drawn 12 times along a bouquet spine, time and elements per spike */
{const Q=new URLSearchParams(location.search);if(Q.get('sptime')){const s=E('svg',{viewBox:'-400 -800 800 900',style:'width:400px;height:450px'},document.body),out={};
  for(const sid of['delphinium','pied-alouette-annuel','muflier','giroflee-matthiole','glaieul']){const rec=RBY[sid],cws=CWS[sid];let t=0,el=0;
    for(let i=0;i<12;i++){s.innerHTML='';GDEF=E('defs',{},s);const g=G(s),th=(i%5-2)*14,len=380+i*8,S=spineFor(th,len,GHI[sid].tip);const t0=performance.now();renderStatic(()=>drawRec(g,0,rec,{col:cws[i%cws.length].c,spine:S,from:0,short:i%3===0}));t+=performance.now()-t0;el+=s.querySelectorAll('*').length;GDEF=null}
    out[sid]=[+(t/12).toFixed(1),Math.round(el/12)]}
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(out);document.body.prepend(pre)}}
/* debug of a plant head: ?lsdbg=<sid> — organs grown, leaves drawn, errors */
{const Q=new URLSearchParams(location.search);if(Q.get('lsdbg')){const sid=Q.get('lsdbg'),out={};const s=E('svg',{viewBox:'-300 -300 600 600'},document.body);DET=2;
  const lt=lsTurtle;let last=null;window.lsTurtle=function(m,o){const r=lt(m,o);last=r;return r};
  try{GDEF=E('defs',{},s);const g=G(s);renderStatic(()=>drawRec(g,0,RBY[sid],{col:(RBY[sid].cols||[])[0],ax:[0,0,1],op:1,cm:RBY[sid].cm,roll:0}));GDEF=null;
    out.organs={};for(const og of(last?last.organs:[]))out.organs[og.t]=(out.organs[og.t]||0)+1;out.chains=last?last.chains.length:0;out.paths=s.querySelectorAll('path').length;
    const lv=(last?last.organs:[]).filter(q=>q.t==='Lv').map(q=>({H:q.H.map(v=>+v.toFixed(2)),pos:q.pos.map(v=>Math.round(v))}));out.leaves=lv}catch(e){out.err=e.message+' '+e.stack.slice(0,400)}
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(out);document.body.prepend(pre)}}
