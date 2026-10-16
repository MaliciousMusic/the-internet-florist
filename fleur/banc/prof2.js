Object.assign(FRM_SPEC,JSON.parse(process.env.PAR||"{}"));
DET=+(process.env.DET||1);LOD=0;const QD=+(process.env.D||110),cell=Math.round(QD*1.15);
const QVW=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0],[0,-.97,-.24,0],[.35,-.9,.26,.3],[0,-.55,.83,0],[0,-1,.0001,0]];
const Qesc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const Qser=n=>'<'+n.tag+Object.entries(n.attrs).map(([k,v])=>' '+k+'="'+Qesc(v)+'"').join('')+'>'+(n.children||[]).map(Qser).join('')+'</'+n.tag+'>';
const Qcnt=n=>1+(n.children||[]).reduce((a,c)=>a+Qcnt(c),0);const acc={};
const wrapS=(name)=>{const f=global[name];global[name]=function(...a){const r=f.apply(this,a);const q=acc[name]||(acc[name]={n:0,b:0});q.n++;q.b+=typeof r==='string'?r.length:0;return r}};
for(const n of['svDamPath','svLoopsD'])wrapS(n);
const Qcws=(process.env.CWS||'damier').split(','),views=(process.env.VIEWS||'8,10').split(',').map(Number),st=(process.env.ST||'.2:0,1:0,1:.35,1:.75').split(',').map(x=>x.split(':').map(Number));let idx=0;
for(const cw of Qcws)for(const v of views)for(const[op,wl]of st){for(const k in acc)delete acc[k];const V=QVW[v],B=basis(V3.nz([V[0],V[1],V[2]]),V[3]);GDEF=new El('defs');const g=new El('g');
  const T0=WILT;if(wl>0)WILT=lifeWilt(wl,GHI['fritillaire-meleagris'].wilt,'fritillaire-meleagris');
  try{frmSvg(g,B,[cell/2-V[0]*.42*QD,-cell*.5-V[1]*.42*QD,0],QD,cw,op,3+idx++,wl)}catch(e){console.log('ERR',e.message,(e.stack||'').split('\n').slice(1,3).join('|'))}finally{WILT=T0}
  const tb={};const walk=n=>{const s=Qser({tag:n.tag,attrs:n.attrs,children:[]}).length;const q=tb[n.tag]||(tb[n.tag]={n:0,b:0});q.n++;q.b+=s;(n.children||[]).forEach(walk)};walk(g);walk(GDEF);
  const tot=Qser(g).length+Qser(GDEF).length;
  console.log(cw,'v'+v,op+':'+wl,'el',Qcnt(g)+Qcnt(GDEF),'kb',(tot/1024).toFixed(1),'| dam',acc.svDamPath?((acc.svDamPath.b/1024).toFixed(1)+'kb/'+acc.svDamPath.n):0,'wash',acc.svLoopsD?((acc.svLoopsD.b/1024).toFixed(1)+'kb/'+acc.svLoopsD.n):0,'|',Object.entries(tb).sort((a,b)=>b[1].b-a[1].b).slice(0,6).map(([t,q])=>t+':'+q.n+'/'+(q.b/1024).toFixed(1)).join(' '))}
