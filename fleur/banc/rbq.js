DET=1;LOD=0;const rc=[['fritillaire-meleagris~0',7],['fritillaire-meleagris~0',5]];
for(const L of[null,{stage:3,u:1}])for(const v of['cylindre-verre-clair']){const res=[];
  for(const on of[false,true]){SV_ON=on;LIFE=L;seed=4242;const svg=G(document.body);const r0=rnd;let nn=0,log=[];rnd=function(){nn++;return r0()};
    let note='';try{renderStatic(()=>{buildBq(svg,[],11,v,0,'juste',null,rc)})}catch(e){note=' ERR '+String(e.message).slice(0,120)}finally{rnd=r0}res.push(nn+note)}
  console.log(L?L.u:'-',v,res.join(' / '))}
