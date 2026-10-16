
/* ================= Moteur 3D des fleurs : pétales en volume, projetés et ombrés pour chaque angle de vue ================= */
let GDEF=null;/* per-bouquet <defs> for one-off gradients, so re-composing never piles them up */
const UPC=6.5;/* SVG units per centimetre: vessels, flowers and stems share this real-world scale */
const V3={add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sc:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  cr:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nz:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}};
const LIGHT=V3.nz([-.45,.6,.66]);/* view space: x right, y up, z toward the viewer */
/* orthonormal frame whose Z is the flower axis (where the face looks), rolled around it */
function basis(ax=[0,0,1],roll=0){const Z=V3.nz(ax),up=Math.abs(Z[1])>.96?[1,0,0]:[0,1,0],X0=V3.nz(V3.cr(up,Z)),Y0=V3.cr(Z,X0),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X0,c),V3.sc(Y0,s)),V3.add(V3.sc(Y0,c),V3.sc(X0,-s)),Z]}
const toV=(B,p)=>[B[0][0]*p[0]+B[1][0]*p[1]+B[2][0]*p[2],B[0][1]*p[0]+B[1][1]*p[1]+B[2][1]*p[2],B[0][2]*p[0]+B[1][2]*p[1]+B[2][2]*p[2]];
/* local point -> screen [x, y down, depth] with an optional view-space offset */
const PJ=(B,O,p)=>{const v=toV(B,p);return[v[0]+O[0],-(v[1]+O[1]),v[2]+O[2]]};
/* frame of a sub-part (floret, tepal group): axis given in the parent's local space */
function subBasis(B,axL,roll=0){return basis(toV(B,axL),roll)}
/* a petal as a curved surface: base on a ring (r0, z0, phi), spine opening from angle a0 to a1 (radians off the axis),
   width profile pf, cross curvature cup (<0 = hollow inner face), waves on the margin (ruf, rk), fan = broad frilled tip */
function petalGeo(o){const{r0=0,z0=0,phi=0,L,W,pf,a0,a1,pw=1.5,cup=-.3,ruf=0,rk=6,n=9,tw=0}=o,cp=Math.cos(phi),sp=Math.sin(phi),Rv=[cp,sp,0],T=[-sp,cp,0];
  let p=[r0*cp,r0*sp,z0];const S=[p],Dv=[];for(let i=0;i<=n;i++){const t=i/n,a=a0+(a1-a0)*Math.pow(t,pw);Dv.push([Rv[0]*Math.sin(a),Rv[1]*Math.sin(a),Math.cos(a)])}
  for(let i=1;i<=n;i++)p=V3.add(p,V3.sc(Dv[i],L/n)),S.push(p);
  const sec=[],N=[];for(let i=0;i<=n;i++){const t=i/n,w=W*pf(Math.min(.985,t)),nrm=V3.cr(Dv[i],T),tws=tw*t,Tt=V3.add(V3.sc(T,Math.cos(tws)),V3.sc(nrm,Math.sin(tws)));N.push(nrm);const row=[];
    for(const u of[-1,-.5,0,.5,1]){const wave=ruf?Math.sin(t*rk*Math.PI+u*2.2+phi*3)*ruf*w*t:0;row.push(V3.add(V3.add(S[i],V3.sc(Tt,u*w)),V3.sc(nrm,cup*w*(1-u*u)+wave)))}sec.push(row)}
  let tip=null;if(o.fan){tip=[];const w=W*pf(1),nt=o.fan;for(let k=0;k<=nt;k++){const u=-1+2*k/nt,bump=(k%2?-1:1)*o.fd*w*R(.6,1.2);tip.push(V3.add(V3.add(S[n],V3.sc(T,u*w)),V3.add(V3.sc(Dv[n],bump),V3.sc(N[n],cup*w*(1-u*u)))))}}
  return{S,sec,N,T,tip,n}}
/* project a petal: silhouette of the curved surface, which face shows, Lambert shading, spine gradient */
function petalPart(geo,B,O,cf,cb,o={}){const n=geo.n,PS=geo.sec.map(r=>r.map(p=>PJ(B,O,p))),SP=geo.S.map(p=>PJ(B,O,p)),Lf=[],Rt=[];
  for(let i=0;i<=n;i++){const a=SP[Math.max(0,i-1)],b=SP[Math.min(n,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy);let px,py;
    if(l<.01){const t=toV(B,geo.T);px=t[0];py=-t[1]}else{px=-dy/l;py=dx/l}let mn=1e9,mx=-1e9,pl=PS[i][0],pr=PS[i][4];
    for(const q of PS[i]){const s=(q[0]-SP[i][0])*px+(q[1]-SP[i][1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push(pl);Rt.push(pr)}
  let pts;if(geo.tip){let tp=geo.tip.map(p=>PJ(B,O,p));const e=Lf[n];if(Math.hypot(tp[0][0]-e[0],tp[0][1]-e[1])>Math.hypot(tp[tp.length-1][0]-e[0],tp[tp.length-1][1]-e[1]))tp=tp.reverse();pts=Lf.concat(tp,Rt.slice().reverse())}
  else pts=Lf.concat(Rt.slice().reverse());
  const mi=n>>1,nv=toV(B,geo.N[mi]),face=nv[2]>=0,pal=face?cf:cb,nn=face?nv:V3.sc(nv,-1),lam=Math.max(0,V3.dot(V3.nz(nn),LIGHT)),sh=.28+.72*lam;
  const body=sh<.5?mix(pal[1],pal[2],sh*2):mix(pal[2],pal[3],(sh-.5)*2),base=o.bc||mix(body,pal[1],.65),tipc=mix(body,pal[4],.25+.3*sh),z=PS[mi][2][2];
  return{z,fn:par=>{const d=smooth(pts.map(p=>[p[0],p[1]]));
    if(LOD||o.flat){E('path',{d,fill:body},par);const k=Math.max(2,Math.round(n*.38)),bd=smooth(Lf.slice(0,k+1).concat(Rt.slice(0,k+1).reverse()).map(p=>[p[0],p[1]]));E('path',{d:bd,fill:base,opacity:.55},par)}
    else{const id='q'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:f(SP[0][0]),y1:f(SP[0][1]),x2:f(SP[n][0]),y2:f(SP[n][1])},GDEF||defs);stops(gr,[[0,base],[.42,body],[1,tipc]]);E('path',{d,fill:`url(#${id})`},par)}
    if(o.vein&&!LOD)E('path',{d:'M'+SP.slice(1,Math.round(n*.85)).map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:o.vc||pal[0],'stroke-width':o.vw||.5,'stroke-opacity':o.vo||.3,fill:'none'},par);
    if(o.dots)for(const[ti,u,r,c]of o.dots){const i=Math.min(n,Math.round(ti*n)),row=PS[i],k=(u+1)*2,j=Math.min(3,Math.floor(k)),fr=k-j,q=[row[j][0]+(row[j+1][0]-row[j][0])*fr,row[j][1]+(row[j+1][1]-row[j][1])*fr];if(face)E('circle',{cx:f(q[0]),cy:f(q[1]),r:f(r),fill:c},par)}
    if(o.edge)E('path',{d,fill:'none',stroke:o.edge,'stroke-width':1.3,'stroke-opacity':.85},par);
    if(!LOD)E('path',{d,fill:'none',stroke:pal[4],'stroke-width':.7,'stroke-opacity':f(.3*sh)},par);
    E('path',{d,fill:'none',stroke:pal[0],'stroke-width':o.sw||.5,'stroke-opacity':o.so??.45,'stroke-linejoin':'round'},par)}}}
/* flat disc / dome of florets (dahlia eye, scabiosa pincushion, sunflower) */
function domePart(B,O,rc,zc,h,cols,nd,o={}){const ring=[];for(let i=0;i<30;i++){const a=i/30*2*Math.PI;ring.push(PJ(B,O,[Math.cos(a)*rc,Math.sin(a)*rc,zc]))}
  const top=PJ(B,O,[0,0,zc+h]),ax=toV(B,[0,0,1]),face=ax[2];
  return{z:PJ(B,O,[0,0,zc+h*.5])[2]+(o.zb||0),fn:par=>{E('path',{d:smooth(ring.map(p=>[p[0],p[1]])),fill:cols[1]},par);
    if(h>0){const sil=[];for(let i=0;i<30;i++){const a=i/30*2*Math.PI;sil.push(PJ(B,O,[Math.cos(a)*rc*.98,Math.sin(a)*rc*.98,zc+h*.15]))}
      const hp=[];for(let i=0;i<=12;i++){const a=i/12*Math.PI*2;hp.push(PJ(B,O,[Math.cos(a)*rc*.55,Math.sin(a)*rc*.55,zc+h*.85]))}
      E('path',{d:smooth(sil.map(p=>[p[0],p[1]])),fill:cols[2]},par);if(face>-.2)E('path',{d:smooth(hp.map(p=>[p[0],p[1]])),fill:cols[3],opacity:.6},par)}
    if(nd){let d1='';const pts=[];for(let i=0;i<nd;i++){const q=Math.sqrt((i+.5)/nd),a=i*137.508*D,lx=Math.cos(a)*q*rc*.92,ly=Math.sin(a)*q*rc*.92,lz=zc+h*Math.sqrt(Math.max(0,1-q*q));
        const nrm=toV(B,V3.nz([lx,ly,h?lz-zc+rc*.2:1]));if(nrm[2]<-.15)continue;pts.push([PJ(B,O,[lx,ly,lz]),nrm[2]])}
      pts.sort((a,b)=>a[0][2]-b[0][2]);const r0=o.dr||rc*.09;for(const[p,fz]of pts){const r=r0*(.55+.45*Math.max(0,fz));d1+=`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}
      E('path',{d:d1,fill:cols[3],stroke:cols[0],'stroke-width':.3},par);if(o.pins){let d2='';for(const[p]of pts.filter((_,i)=>i%2))d2+=`M${f(p[0]-.5)},${f(p[1]-1)}a.5,.5 0 1,0 1,0a.5,.5 0 1,0 -1,0`;E('path',{d:d2,fill:o.pins},par)}}
    E('path',{d:smooth(ring.map(p=>[p[0],p[1]])),fill:'none',stroke:cols[0],'stroke-width':.4,'stroke-opacity':.5},par)}}}
/* a 3D curve (filament, style, spadix) drawn as a stroke with an end cap */
function curvePart(B,O,pts3,w,col,cap){const P=pts3.map(p=>PJ(B,O,p)),z=P[P.length-1][2];
  return{z,fn:par=>{E('path',{d:'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:col,'stroke-width':f(w),fill:'none','stroke-linecap':'round'},par);
    if(cap){const e=P[P.length-1],a=P[P.length-2];E('ellipse',{cx:f(e[0]),cy:f(e[1]),rx:f(cap[0]),ry:f(cap[1]),fill:cap[2],transform:`rotate(${f(Math.atan2(e[1]-a[1],e[0]-a[0])/D+90)} ${f(e[0])} ${f(e[1])})`},par)}}}}
/* green bracts / receptacle behind a bloom: hidden from the front, visible from behind and in profile */
function bracts(parts,B,O,Rr,n=7,len=.42){const c=['#1c3416','#365e26','#628c40','#a6c67a','#c8e09a'];for(let i=0;i<n;i++)parts.push(petalPart(petalGeo({r0:Rr*.06,z0:-Rr*.04,phi:(i*360/n+R(-10,10))*D,L:Rr*len*R(.8,1.1),W:Rr*.16,pf:sinP(.55,.06),a0:(105+R(-8,8))*D,a1:(120+R(0,25))*D,cup:-.2,n:4}),B,O,c,c,{flat:1}));
  parts.push(domePart(B,O,Rr*.12,-Rr*.12,-Rr*.06,c,0,{zb:-1}))}
/* painter's algorithm: far parts first */
function drawParts(par,parts){parts.sort((a,b)=>a.z-b.z);for(const p of parts)p.fn(par)}
/* default view axis: face toward the viewer unless the composer or garden asks for another direction */
const axOf=o=>o.ax||[0,0,1];
