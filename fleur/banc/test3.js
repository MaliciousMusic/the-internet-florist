Object.assign(FRM_SPEC,JSON.parse(process.env.PAR||"{}"));DET=1;LOD=0;GDEF=new El('defs');let QCAP=null;const _d=svDrawP;svDrawP=function(par,pieces,o){QCAP=pieces;return _d(par,pieces,o)};
const vw=JSON.parse(process.env.VW||'[0,-1,0.0001]'),B=basis(V3.nz(vw),0);
for(const[op,wl]of JSON.parse(process.env.ST||'[[0.06,0],[0.2,0],[0.4,0],[0.75,0],[1,0],[1,0.35],[1,0.6],[1,0.9]]')){const g=new El('g');frmSvg(g,B,[0,0,0],100,process.env.CW||'damier',op,3,wl);
  const P=[];for(const p of QCAP)if(p.P)P.push(...p.P);const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),H=y1-y0,W=x1-x0;
  const prof=[];for(const f of[.03,.1,.2,.3,.5,.7,.9,.97]){const yy=y0+H*f,band=P.filter(p=>Math.abs(p[1]-yy)<H*.04);prof.push(band.length?((Math.max(...band.map(p=>p[0]))-Math.min(...band.map(p=>p[0])))/W).toFixed(2):'-')}
  console.log('op',op,'wl',wl,'H',H.toFixed(1),'W',W.toFixed(1),'H/W',(H/W).toFixed(2),'width at 10..95%',prof.join(' '),'pieces',QCAP.length)}
