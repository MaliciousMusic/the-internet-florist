DET=1;LOD=0;const rc=[['fritillaire-meleagris~0',7],['fritillaire-meleagris~0',5]],QTR=[];
for(const on of[false,true]){SV_ON=on;LIFE=null;seed=4242;const svg=G(document.body);const r0=rnd;const t=[];rnd=function(){const s=(new Error().stack||'').split('\n').slice(2,6).map(x=>(x.match(/at (\S+)/)||[])[1]).join('<');t.push(s);return r0()};
  try{renderStatic(()=>{buildBq(svg,[],11,'cylindre-verre-clair',0,'juste',null,rc)})}catch(e){}finally{rnd=r0}QTR.push(t)}
const nm=x=>/l54Bell|frmSvgPut|petS<l54Bell/.test(x)?'BELL':x;QTR[0]=QTR[0].map(nm);QTR[1]=QTR[1].map(nm);let i=0;while(i<QTR[0].length&&i<QTR[1].length&&QTR[0][i]===QTR[1][i])i++;
console.log('first divergence at',i,'of',QTR[0].length,QTR[1].length);for(let k=Math.max(0,i-3);k<i+6;k++)console.log(k,'OFF',QTR[0][k],'| ON',QTR[1][k]);
