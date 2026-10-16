DET=1;LOD=0;const sid='fritillaire-meleagris',rec=RBY[sid];
for(const cwid of['damier','blanc'])for(const op of[.06,.3,1])for(const wl of[0,.5]){const cw=CWS[sid].find(x=>x.id===cwid),res=[];
  for(const on of[false,true]){SV_ON=on;seed=987654;LIFE=wl?{stage:3,u:wl}:null;const r0=rnd;let nn=0;rnd=function(){nn++;return r0()};
    let note='';try{renderStatic(()=>{const r=drawRec(G(document.body),0,rec,{vw:[-.45,.15,.88],op,cw,col:cw.c,roll:0})})}catch(e){note=' ERR '+e.message}finally{rnd=r0}
    res.push(nn+note)}
  console.log(cwid,op,wl,res.join(' / '))}
