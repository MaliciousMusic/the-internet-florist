window.LAB=Object.keys(VZ).map(id=>[VZ[id].n,'340 740 320 290',s=>{const v=VZ[id];
  if(v.kind==='glass'){plinth(s,v.pl);stemsBelow(s,9,id);vessel(s,id,0,{noPlinth:1})}
  else if(v.kind==='hand'){stemsBelow(s,11,id);bow(s,VX,FL-120,v.rib,.6)}
  else if(v.kind==='wrap'){wrapBack(s,[VX,FL-110],v.paper);stemsBelow(s,11,id);wrapFront(s,[VX,FL-110],v.paper);bow(s,VX,FL-80,v.rib,.5)}
  else if(v.kind==='kenzan'){vessel(s,id);stemsBelow(s,9,id);bow(s,VX,FL-vH(v),'#b98a4a',.3)}
  else vessel(s,id)}]);
