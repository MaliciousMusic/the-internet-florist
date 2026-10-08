window.FIT=1;const Q4=new URLSearchParams(location.search),IDS=(Q4.get('ids')||'').split(',').filter(Boolean),MN4=Object.fromEntries(CATMETA.map(m=>[m.id,m.n]));
window.LAB=RECIPES.filter(r=>IDS.length?IDS.includes(r.id):!r.fb).map(r=>[`${MN4[r.id]||r.id} · ${r.a}`,'0 0 10 10',s=>{seed=r.id.length*17;drawRec(s,0,r,{col:r.cols[+(Q4.get('c')||0)]||r.cols[0],ax:[.22,.4,.89],roll:0})}]);
