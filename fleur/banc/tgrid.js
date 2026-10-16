Object.assign(FRM_SPEC,JSON.parse(process.env.PAR||"{}"));
DET=+(process.env.DET||1.5);LOD=0;const QD=+(process.env.D||110),cell=Math.round(QD*1.15);
const QVW=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0],[0,-.97,-.24,0],[.35,-.9,.26,.3],[0,-.55,.83,0],[0,-1,.0001,0]];
const Qcws=(process.env.CWS||'damier').split(','),views=(process.env.VIEWS||'8').split(',').map(Number),st=(process.env.ST||'.06:0,.2:0,.4:0,.75:0,1:0,1:.35,1:.6,1:.75,1:.9').split(',').map(x=>x.split(':').map(Number));
const Qesc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const Qser=n=>'<'+n.tag+Object.entries(n.attrs).map(([k,v])=>' '+k+'="'+Qesc(v)+'"').join('')+'>'+(n.children||[]).map(Qser).join('')+'</'+n.tag+'>';
const Qfs=require('fs');let idx=0,lay=[];const Qcnt=n=>1+(n.children||[]).reduce((a,c)=>a+Qcnt(c),0);
for(const cw of Qcws)for(const v of views)for(const[op,wl]of st){const V=QVW[v],B=basis(V3.nz([V[0],V[1],V[2]]),V[3]);GDEF=new El('defs');const g=new El('g');
  const T0=WILT;if(wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(wl,(GHI['fritillaire-meleagris']&&GHI['fritillaire-meleagris'].wilt)||svaWiltCol,'fritillaire-meleagris');
  try{const oz=+(process.env.OZ||.42);frmSvg(g,B,[cell/2-V[0]*oz*QD,-cell*.5-V[1]*oz*QD,0],QD,cw,op,(+(process.env.SEED||3))+idx,wl)}catch(e){console.log('ERR',cw,v,op,wl,e.message,(e.stack||'').split('\n').slice(1,3).join('|'))}finally{WILT=T0}
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+cell+' '+cell+'">'+Qser(GDEF)+Qser(g)+'</svg>';Qfs.writeFileSync('cells/c'+idx+'.svg',svg);
  const nf=GDEF.children.filter(c=>c.tag==='filter').reduce((a,c)=>a+Qcnt(c),0);lay.push({i:idx,cw,v,op,wl,el:Qcnt(g)+Qcnt(GDEF)-1-nf,kb:+(svg.length/1024).toFixed(1)});idx++}
Qfs.writeFileSync('cells/lay.json',JSON.stringify({cols:st.length,cell,lay}));
const QE1=lay.map(x=>x.el),QK1=lay.map(x=>x.kb);console.log('cells',lay.length,'el/head',Math.round(QE1.reduce((a,b)=>a+b)/QE1.length),'max',Math.max(...QE1),'KB/head',(QK1.reduce((a,b)=>a+b)/QK1.length).toFixed(1));
