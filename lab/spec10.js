window.FIT=1;const Q2=new URLSearchParams(location.search),A=+(Q2.get('a')||0),B=+(Q2.get('b')||60),MN=Object.fromEntries(CATMETA.map(m=>[m.id,m.n]));
window.LAB=RECIPES.filter(r=>!r.fb).slice(A,B).map(r=>[`${MN[r.id]||r.id} · ${r.a}`,'0 0 10 10',s=>{seed=r.id.length*17;drawRec(s,0,r,{col:r.cols[0],ax:[.22,.4,.89],roll:0})}]);
