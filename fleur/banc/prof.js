DET=+(process.env.DET||1);LOD=0;const Qesc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const Qser=n=>'<'+n.tag+Object.entries(n.attrs).map(([k,v])=>' '+k+'="'+Qesc(v)+'"').join('')+'>'+(n.children||[]).map(Qser).join('')+'</'+n.tag+'>';
const Qcnt=n=>1+(n.children||[]).reduce((a,c)=>a+Qcnt(c),0);
const meas=()=>[Qcnt(ROOT)+Qcnt(GDEF),Qser(ROOT).length+Qser(GDEF).length];let ROOT=null;const acc={};let depth=0;
const wrap=(name)=>{const f=global[name];global[name]=function(...a){if(depth){return f.apply(this,a)}depth++;const m0=meas();try{return f.apply(this,a)}finally{const m1=meas();depth--;const q=acc[name]||(acc[name]={n:0,el:0,b:0});q.n++;q.el+=m1[0]-m0[0];q.b+=m1[1]-m0[1]}}};
for(const n of (process.env.WRAP||'frmSvg,svStrapLeaf').split(','))wrap(n);
const sid='fritillaire-meleagris',rec=RBY[sid],cw=(CWS[sid]||[]).find(x=>x.id===(process.env.CW||'damier')),st=(process.env.ST||'1:0').split(',').map(x=>x.split(':').map(Number)),vw=[-.45,.15,.88],full=+(process.env.FULL||14),own=GHI[sid].wilt;
st.forEach(([op,wl])=>{for(const k in acc)delete acc[k];GDEF=new El('defs');ROOT=new El('g');const k=new El('g');ROOT.appendChild(k);SVA_LIFE=wl||null;const T0=WILT;if(wl>0)WILT=lifeWilt(wl,own,sid);
  try{renderStatic(()=>{const r=drawRec(k,0,rec,{vw,ax:vw,op,cw,col:cw&&cw.c,roll:0});if(full&&r&&r.neck)svtStem(k,r,sid,full)})}catch(e){console.log('ERR',e.message,(e.stack||'').split('\n').slice(1,3).join('|'))}finally{WILT=T0;SVA_LIFE=null}
  const m=meas(),tags={};const walk=n=>{tags[n.tag]=(tags[n.tag]||0)+1;(n.children||[]).forEach(walk)};walk(ROOT);walk(GDEF);
  console.log('st',op+':'+wl,'TOTAL el',m[0],'kb',(m[1]/1024).toFixed(1),'|',Object.entries(acc).map(([n,q])=>n+' x'+q.n+' el '+q.el+' kb '+(q.b/1024).toFixed(1)).join(' | '));
  console.log('  tags',Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,9).map(x=>x.join(':')).join(' '));
  if(process.env.OUT)require('fs').writeFileSync(process.env.OUT,'<svg xmlns="http://www.w3.org/2000/svg">'+Qser(GDEF)+Qser(ROOT)+'</svg>')});
