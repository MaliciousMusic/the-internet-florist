DET=+(process.env.DET||1.5);LOD=0;const Qesc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const Qser=n=>'<'+n.tag+Object.entries(n.attrs).map(([k,v])=>' '+k+'="'+Qesc(v)+'"').join('')+'>'+(n.children||[]).map(Qser).join('')+'</'+n.tag+'>';
const Qcnt=n=>1+(n.children||[]).reduce((a,c)=>a+Qcnt(c),0);
const sid='fritillaire-meleagris',rec=RBY[sid],cwid=process.env.CW||'damier',cw=(CWS[sid]||[]).find(x=>x.id===cwid),st=(process.env.ST||'.1:0,.3:0,.6:0,1:0,1:.4,1:.75').split(',').map(x=>x.split(':').map(Number)),
  vw=(process.env.VW||'-.45,.15,.88').split(',').map(Number),full=+(process.env.FULL||0),own=GHI[sid].wilt;
console.log('rec',!!rec,'cw',!!cw,'GH',typeof GH[sid]);
st.forEach(([op,wl],i)=>{GDEF=new El('defs');const g=new El('g'),k=new El('g');g.appendChild(k);SVA_LIFE=wl||null;const T0=WILT;if(wl>0)WILT=lifeWilt(wl,own,sid);
  try{renderStatic(()=>{const r=drawRec(k,0,rec,{vw,ax:process.env.AXV?vw:undefined,op,cw,col:cw&&cw.c,roll:0});if(full&&r&&r.neck)svtStem(k,r,sid,full)})}catch(e){console.log('ERR',op,wl,e.message,(e.stack||'').split('\n').slice(1,4).join('|'))}finally{WILT=T0;SVA_LIFE=null}
  require('fs').writeFileSync('cells/p'+i+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -500 600 700">'+Qser(GDEF)+Qser(g)+'</svg>');console.log('stage',op,wl,'el',Qcnt(g)+Qcnt(GDEF))});
