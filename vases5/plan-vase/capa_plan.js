/* The catalogue's model bouquets against the necks of their vessels (z7-plan vpFit), no drawing: for each model, its composed stems (planModel,
   times the vessel's v.bq as compose does), the fill of its vessel's neck, the scale the Composer would give the vessel, the most it takes.
   Appended to lab/qa13.html by mkcapa.sh; ?capa=1 → <pre id="out"> */
{const Q=new URLSearchParams(location.search);if(Q.get('capa')){const out=[];
  MODELS.forEach((m0,i)=>{try{const vid=vpVid(m0.vase),v=VZ[vid]||{},bq=v.bq&&v.bq!==1?v.bq:1,
      m=bq===1?m0:Object.assign({},m0,{els:m0.els.map(e=>Object.assign({},e,{n:Math.max(1,Math.round((e.n||1)*bq))}))}),P=planModel(m),F=vpFit(P,v.id||vid);
    out.push({i,n:m0.n,vase:v.id||vid,stems:F.L?F.L.n:null,fill:F.L?+F.L.fill.toFixed(3):null,k:F.k,ok:F.ok,max:F.L?F.L.max:null,maxGrow:F.L?F.L.maxGrow:null,md:F.L?F.L.md:null})}
    catch(e){out.push({i,err:String(e).slice(0,140)})}});
  /* ?alt=24,28,66: for those models, the fill in every vessel of their vessel's family (to move them to one that holds them) */
  const alt=(Q.get('alt')||'').split(',').filter(Boolean).map(Number),AL={};
  for(const n of alt){const i=MODELS.findIndex(x=>x.n===n);if(i<0)continue;const m=MODELS[i],v0=VZ[vpVid(m.vase)]||{},P=planModel(m);
    AL[n]=Object.values(VZ).filter(v=>v.fam===v0.fam&&!v.base).map(v=>{const L=vpLoad(P,v.id);return{vase:v.id,n:v.n,m:v.m,mat:v.mat,h:Math.round(v.h),fill:L?+L.fill.toFixed(2):null,max:L?L.max:null}}).sort((a,b)=>a.fill-b.fill)}
  if(alt.length){const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(AL);document.body.prepend(pre);document.title='CAPA-DONE'}
  else{const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(out);document.body.prepend(pre);document.title='CAPA-DONE'}}}
