/* automated QA of every recipe: renders each species once and flags errors, empty or oversized drawings */
window.QA=function(){const host=E('svg',{width:300,height:300,viewBox:'-300 -300 600 600'},document.body),bad=[];let n=0;
  for(const r of RECIPES){const g=G(host);n++;try{LOD=1;renderStatic(()=>drawRec(g,0,r,{col:r.cols[0]}));LOD=0;const b=g.getBBox(),nodes=g.querySelectorAll('*').length,sz=Math.max(b.width,b.height),want=(r.cm||6)*UPC;
      if(!nodes||!b.width)bad.push([r.id,r.a,'vide']);else if(sz>Math.max(want*5,1400))bad.push([r.id,r.a,'géant '+Math.round(sz)]);else if(sz<4)bad.push([r.id,r.a,'minuscule']);else if(nodes>2500)bad.push([r.id,r.a,'lourd '+nodes])}
    catch(e){LOD=0;bad.push([r.id,r.a,'erreur '+e.message])}g.remove()}host.remove();return{n,bad}};
