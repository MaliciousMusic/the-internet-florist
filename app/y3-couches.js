/* ---------- the layers of a head (2026-10-19, BONNES-PRATIQUES §14: no piece passes through another). svLayers(list, pairs, o) takes the sheets
   of one head before they are drawn, list[k].Sf(u,v) (u -1..1, v 0..1 from the base; the head's axis is z), and pairs [[out, in, auto], ...]:
   wherever out and in lie at the same azimuth and height, in is nearer the axis than out by the gap o.m at least, never through it.
   Cylindrical, not along normals: around the axis "inside" means the same thing for every sheet, whatever way its faces turn (two margins curled
   toward each other, two faces looking at each other across the axis), so the correction is a plain order. For each pair in turn, every sample of
   in that has a sample of out at its azimuth and height (closer than o.near along the cylinder, its margins included, short of its tip) and is
   not inside it by m/2 is drawn toward the axis by what it lacks to m, never nearer the axis than o.rmin (the column): what in cannot give there,
   out gives, moving outward. The moves are kept per sample (the largest), smoothed over the grid (never below the sample's own), faded to nothing
   at the shared base (v < o.v0), and the next pair sees them; the sweep runs o.it times (a cycle of neighbours in a whorl closes on the second).
   A pair marked auto takes the order the two sheets mostly have already (the smallest move). Each Sf is then replaced by Sf moved by its
   displacement (bilinear over the grid). Where nothing crosses nor comes closer than m nothing moves: such a head is drawn exactly as before.
   The nearest sample is looked up in bins (azimuth x height), so a head costs a few grids of o.nu x o.nv, not their square. */
function svLayers(list,pairs,o={}){const NU=o.nu||16,NV=o.nv||32,W=NU+1,n=W*(NV+1),m=o.m,near=o.near,rmin=o.rmin||0,rgap=o.rgap||near*2.5,col=o.col,rminZ=z=>col?Math.max(rmin,col(z)):rmin,v0=o.v0??.06,it=o.it||2,TAU=2*Math.PI,NB=72,dB=TAU/NB;
  if(!(list.length>1&&pairs.length))return 0;
  const D=list.map(()=>new Float64Array(n)),J=new Int32Array(n);for(let a=0;a<n;a++)J[a]=Math.floor(a/W);
  const raw=list.map(L=>{const X=new Float64Array(n*3);for(let a=0;a<n;a++){const p=L.Sf(-1+2*(a%W)/NU,J[a]/NV);X[a*3]=p[0];X[a*3+1]=p[1];X[a*3+2]=p[2]}return X});
  /* a sheet's samples now (radius, azimuth, height) and its bins */
  const grid=k=>{const X=raw[k],d=D[k],R=new Float64Array(n),T=new Float64Array(n),Z=new Float64Array(n),bins=new Map();
    for(let a=0;a<n;a++){const r0=Math.hypot(X[a*3],X[a*3+1]),r=Math.max(0,r0-d[a]);R[a]=r;T[a]=Math.atan2(X[a*3+1],X[a*3]);Z[a]=X[a*3+2];
      const key=Math.floor((Z[a])/near)*NB+Math.floor((T[a]+Math.PI)/dB)%NB;let b=bins.get(key);if(!b)bins.set(key,b=[]);b.push(a)}
    return{R,T,Z,bins}};
  /* for each sample of X, Y's nearest sample at its azimuth and height (-1 where Y is not there) */
  const under=(X,Y)=>{const ix=new Int32Array(n).fill(-1);
    for(let a=0;a<n;a++){if(J[a]/NV<v0)continue;const rx=X.R[a],tx=X.T[a],zx=X.Z[a],zb=Math.floor(zx/near),tb=Math.floor((tx+Math.PI)/dB)%NB,
        kw=Math.min(NB>>1,Math.ceil(2*near/Math.max(rx,near*.25)/dB)+1);let bd=near*near,bk=-1;
      for(let z2=zb-1;z2<=zb+1;z2++)for(let t2=-kw;t2<=kw;t2++){const b=Y.bins.get(z2*NB+((tb+t2)%NB+NB)%NB);if(!b)continue;
        for(const k of b){let dt=Math.abs(tx-Y.T[k]);if(dt>Math.PI)dt=TAU-dt;const rr=(rx+Y.R[k])*.5,dz=zx-Y.Z[k],d2=dt*dt*rr*rr+dz*dz;if(d2<bd){bd=d2;bk=k}}}
      if(bk>=0&&Math.abs(rx-Y.R[bk])<rgap)ix[a]=bk}  /* only where the two are near in radius too: a reflexed blade far below or beyond is not over it */
    return ix};
  /* a move field over a grid: smoothed (a 5 x 5 tent, never below the sample's own), faded at the base, added (sg +1: toward the axis) */
  const spread=(need,d,sg)=>{for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){let sx=0,sw=0;
      for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const ii=i+di,jj=j+dj;if(ii<0||ii>NU||jj<0||jj>NV)continue;const w=(3-Math.abs(di))*(3-Math.abs(dj));sx+=need[jj*W+ii]*w;sw+=w}
      const q=j*W+i,x=Math.max(sx/sw,need[q]);if(x>0)d[q]+=sg*x*svSm((j/NV-v0*.5)/v0)}};
  let moved=0;
  /* the stamen column (o.col(z): the radius the filaments and the style fill at height z, 0 where there are none): no sheet comes nearer the
     axis than that; a sample inside it moves out to it, past the shared base (v0) where the feet meet the receptacle */
  if(col)for(let k=0;k<list.length;k++){const g0=grid(k),need=new Float64Array(n);let any=0;
    for(let q=0;q<n;q++){if(J[q]/NV<v0)continue;const c=col(g0.Z[q]);if(g0.R[q]<c){need[q]=c-g0.R[q];any=1}}
    if(any){spread(need,D[k],-1);moved++}}
  for(let pass=0;pass<(o.sweep===false?0:it);pass++){let lack=0;  /* (sweep false: an open head, only the measure's own rounds below) */
    for(const pr of pairs){let[a,b]=pr;let A=grid(a),Bq=grid(b);
      if(pr[2]){let v=0;const ix=under(Bq,A);for(let q=0;q<n;q++)if(ix[q]>=0)v+=Math.sign(A.R[ix[q]]-Bq.R[q]);if(v<0){pr[0]=b;pr[1]=a;[a,b]=[b,a];[A,Bq]=[Bq,A]}pr[2]=false}
      const ix=under(Bq,A),need=new Float64Array(n),give=new Float64Array(n);let any=0,anyO=0;
      for(let q=0;q<n;q++){const k=ix[q];if(k<0)continue;const e=Bq.R[q]-(A.R[k]-m);if(e>m*.5){const ei=Math.min(e,Math.max(0,Bq.R[q]-rminZ(Bq.Z[q])));need[q]=ei;any++;
        if(e-ei>1e-9){give[k]=Math.max(give[k],e-ei);anyO=1}}}
      if(!any)continue;lack+=any;spread(need,D[b],1);if(anyO)spread(give,D[a],-1)}
    if(typeof SVL_LOG!=='undefined')SVL_LOG.push(lack);
    if(!lack)break;moved+=lack}
  /* the moved sheet k: Sf drawn toward (or away from) the axis by its displacement, bilinear over the grid */
  const E=list.map(()=>new Float64Array(n*3));
  const mvd=k=>{const S0=list[k].Sf,d=D[k],e=E[k];if(!d.some(x=>x)&&!e.some(x=>x))return S0;
    return(u,v)=>{const x=Math.max(0,Math.min(NU,(u+1)/2*NU)),y=Math.max(0,Math.min(NV,v*NV)),i=Math.min(NU-1,Math.floor(x)),j=Math.min(NV-1,Math.floor(y)),fx=x-i,fy=y-j,
      dr=(d[j*W+i]*(1-fx)+d[j*W+i+1]*fx)*(1-fy)+(d[(j+1)*W+i]*(1-fx)+d[(j+1)*W+i+1]*fx)*fy,p=S0(u,v),r=Math.hypot(p[0],p[1]);
      const bl=c=>(e[(j*W+i)*3+c]*(1-fx)+e[(j*W+i+1)*3+c]*fx)*(1-fy)+(e[((j+1)*W+i)*3+c]*(1-fx)+e[((j+1)*W+i+1)*3+c]*fx)*fy,f=dr&&r>1e-9?Math.max(0,r-dr)/r:1;
      return[p[0]*f+bl(0),p[1]*f+bl(1),p[2]+bl(2)]}};
  /* the last word is the measure's own (y3-qa3d.js: an edge of one sheet's 13 x 25 grid whose two ends lie on the two sides of the other, both
     near it): each crossing still found pulls in toward the axis at that place, by what puts it inside out's radius there by m (where in has no
     room left, out moves outward instead), as a small tent on the grid; past o.fixR rounds the push goes along the normals instead (below); again until none is found (o.fix rounds) */
  const role=new Map();for(const[a,b]of pairs){role.set(a+','+b,[a,b]);role.set(b+','+a,[a,b])}
  const CU=12,CV=24,CW=CU+1,cv0=.1;
  let best=Infinity,bD=null,bE=null;
  for(let round=0;round<(o.fix??6);round++){
    const C=list.map((_,k)=>{const S=mvd(k),P=[];for(let j=0;j<=CV;j++)for(let i=0;i<=CU;i++){const u=-1+2*i/CU,v=cv0+(1-cv0)*j/CV;P.push([S(u,v),u,v])}
      const N=[];for(let j=0;j<=CV;j++)for(let i=0;i<=CU;i++){const a2=P[j*CW+Math.min(CU,i+1)][0],b2=P[j*CW+Math.max(0,i-1)][0],c2=P[Math.min(CV,j+1)*CW+i][0],e2=P[Math.max(0,j-1)*CW+i][0];
        N.push(V3.nz(V3.cr(V3s(c2,e2),V3s(a2,b2))))}
      let sp=0,ns=0;for(let j=0;j<=CV;j++)for(let i=0;i<CU;i++){sp+=V3l(V3s(P[j*CW+i+1][0],P[j*CW+i][0]));ns++}for(let j=0;j<CV;j++)for(let i=0;i<=CU;i++){sp+=V3l(V3s(P[(j+1)*CW+i][0],P[j*CW+i][0]));ns++}
      return{P,N,h:sp/ns}});
    const bump=list.map(()=>new Float64Array(n)),bumpO=list.map(()=>new Float64Array(n)),push=list.map(()=>new Float64Array(n*4));let found=0;const nrm=round>=(o.fixR??3);
    const put=(k,u,v,amt)=>{const ci=(u+1)/2*NU,cj=v*NV;for(let j=Math.max(0,Math.floor(cj-2));j<=Math.min(NV,Math.ceil(cj+2));j++)for(let i=Math.max(0,Math.floor(ci-2));i<=Math.min(NU,Math.ceil(ci+2));i++){
      const w=Math.max(0,1-Math.hypot(i-ci,j-cj)/2.6);if(w>0){const q=j*W+i,X=amt<0?bumpO:bump;X[k][q]=Math.max(X[k][q],Math.abs(amt)*w)}}};  /* amt < 0: away from the axis (bumpO), kept apart from the pulls */
    for(let a=0;a<list.length;a++)for(let b=0;b<list.length;b++){if(a===b)continue;const rl=role.get(a+','+b);if(!rl)continue;const A=C[a],Bg=C[b],near2=1.5*Bg.h,
        sd=A.P.map(([p])=>{let bd=1e18,bk=0;for(let k=0;k<Bg.P.length;k++){const q=Bg.P[k][0],dx=p[0]-q[0],dy=p[1]-q[1],dz=p[2]-q[2],d2=dx*dx+dy*dy+dz*dz;if(d2<bd){bd=d2;bk=k}}
          const q=Bg.P[bk][0],nn=Bg.N[bk],bi=bk%CW,bj=Math.floor(bk/CW);return[(p[0]-q[0])*nn[0]+(p[1]-q[1])*nn[1]+(p[2]-q[2])*nn[2],bi>0&&bi<CU&&bj>0&&bj<CV&&Math.sqrt(bd)<near2,bk]});
      const edge=(x,y)=>{const s1=sd[x],t1=sd[y];if(!(s1[1]&&t1[1]&&s1[0]*t1[0]<0&&Math.max(Math.abs(s1[0]),Math.abs(t1[0]))>Bg.h*.05))return;found++;
        /* the place on in, and the radii of in and out there */
        const pa=A.P[x],pb=Bg.P[s1[2]],inA=rl[1]===a,pin=inA?pa:pb,pout=inA?pb:pa,kin=rl[1],kout=rl[0],ri=Math.hypot(pin[0][0],pin[0][1]),ro=Math.hypot(pout[0][0],pout[0][1]),
          amt=Math.max(m,ri-ro+m)+Math.max(Math.abs(s1[0]),Math.abs(t1[0]));
        if(!nrm){if(ri-amt>=rminZ(pin[0][2]))put(kin,pin[1],(pin[2]),amt);else put(kout,pout[1],pout[2],-amt);return}
        /* past the first rounds (two margins meeting in a V, side by side around the axis, where a pull toward it does not part them): the end of
           the edge on the smaller side moves along the other sheet's normal to the side the rest of the edge is on, by what it lacks */
        const big=Math.abs(s1[0])>=Math.abs(t1[0]),sg=Math.sign(big?s1[0]:t1[0]),me=big?y:x,sm=(Math.abs(big?t1[0]:s1[0])+m*.5)*.5,nn=Bg.N[(big?t1:s1)[2]],
          pm=A.P[me],ci=(pm[1]+1)/2*NU,cj=pm[2]*NV,pk=push[a];
        for(let j=Math.max(0,Math.floor(cj-2));j<=Math.min(NV,Math.ceil(cj+2));j++)for(let i=Math.max(0,Math.floor(ci-2));i<=Math.min(NU,Math.ceil(ci+2));i++){
          const w=Math.max(0,1-Math.hypot(i-ci,j-cj)/2.6),q=j*W+i;if(w>0&&sm*w>pk[q*4+3]){pk[q*4]=sg*nn[0]*sm*w;pk[q*4+1]=sg*nn[1]*sm*w;pk[q*4+2]=sg*nn[2]*sm*w;pk[q*4+3]=sm*w}}};
      for(let j=0;j<=CV;j++)for(let i=0;i<CU;i++)edge(j*CW+i,j*CW+i+1);
      for(let j=0;j<CV;j++)for(let i=0;i<=CU;i++)edge(j*CW+i,(j+1)*CW+i)}
    /* the heart's tubes as obstacles (o.tubes [{P, r0, r1}], built dry): a sample of a sheet nearer a tube's axis than its radius + m, past the shared
       insertion, moves along its own normal, away from the tube, by what it lacks: a tepal lies under a filament, never through it */
    if(o.tubes)for(let k=0;k<list.length;k++){const Ck=C[k],pk=push[k];
      for(let q=0;q<Ck.P.length;q++){const[p,u,v]=Ck.P[q],nq=Ck.N[q];let bd=Infinity,bc=null,br=0;
        for(const T of o.tubes){const nT=T.P.length-1;for(let i=Math.ceil(nT*(T.ins??.3));i<nT;i++){const a0=T.P[i],a1=T.P[i+1],dv=V3s(a1,a0),l2=V3.dot(dv,dv),
          t=l2>1e-12?Math.max(0,Math.min(1,V3.dot(V3s(p,a0),dv)/l2)):0,c=V3.add(a0,V3.sc(dv,t)),d=V3l(V3s(p,c));if(d<bd){bd=d;bc=c;br=T.r0+(T.r1-T.r0)*(i+t)/nT}}}
        /* the distance that counts is to the sheet's tangent plane (a tube lying along a blade touches it before its axis comes near any sample);
           o.tgap: the least clearance under a tube; counted as the measure counts (into the tube), pushed out to the clearance */
        const tg=Math.max(m,o.tgap||0);if(!bc||bd>=2*br+tg+Ck.h)continue;const s2=V3.dot(V3s(bc,p),nq),pd=Math.abs(s2);if(pd>=br+tg)continue;if(pd<br*.9)found++;
        const dir=s2>=0?-1:1,amt=(br+tg-pd)*1.1,
         ci=(u+1)/2*NU,cj=v*NV;  /* away from the tube, on whichever side it is */
        for(let j=Math.max(0,Math.floor(cj-2));j<=Math.min(NV,Math.ceil(cj+2));j++)for(let i=Math.max(0,Math.floor(ci-2));i<=Math.min(NU,Math.ceil(ci+2));i++){
          const w=Math.max(0,1-Math.hypot(i-ci,j-cj)/2.6),q2=j*W+i;if(w>0&&amt*w>pk[q2*4+3]){pk[q2*4]=dir*nq[0]*amt*w;pk[q2*4+1]=dir*nq[1]*amt*w;pk[q2*4+2]=dir*nq[2]*amt*w;pk[q2*4+3]=amt*w}}}}
    if(typeof SVL_LOG!=='undefined')SVL_LOG.push('x'+found);
    if(found<best){best=found;bD=D.map(x=>x.slice());bE=E.map(x=>x.slice())}  /* the best state met is the one kept: a round never leaves it worse */
    if(!found)break;moved+=found;
    for(let k=0;k<list.length;k++){const d=D[k],bp=bump[k],bo=bumpO[k],e=E[k],pk=push[k];for(let q=0;q<n;q++){const f=svSm((J[q]/NV-v0*.5)/v0);if(bp[q])d[q]+=bp[q]*f;if(bo[q])d[q]-=bo[q]*f;
      if(pk[q*4+3]){e[q*3]+=pk[q*4]*f;e[q*3+1]+=pk[q*4+1]*f;e[q*3+2]+=pk[q*4+2]*f}}}}
  if(bD){for(let k=0;k<list.length;k++){D[k].set(bD[k]);E[k].set(bE[k])}}
  svLayers.left=best===Infinity?0:best;  /* the crossings the measure still finds (0: none) */
  if(!moved)return 0;
  list.forEach((it2,k)=>{it2.Sf=mvd(k)});
  return moved}
/* svInside(pieces, P3, gap, near, rad, own): a drawn piece of the heart (a filament, the style: its 3D polyline P3, its radius rad(k) at point k)
   kept in the throat and on its tepal (BONNES-PRATIQUES §14: the feet of the filaments came through the inner tepals' claws). First, around the
   axis: each point that has a sheet of the head at its azimuth and height (closer than near along the cylinder) and is not nearer the axis than it
   by gap + its radius is drawn toward the axis to that. Then, with own (the index of the tepal it stands in front of, among the head's sheets):
   each point whose nearest sample of that tepal is not on its inner face (the normal cr(dS/dv, dS/du), y3-qa3d.js) by gap + its radius moves
   along that normal by what it lacks (over an open or sagging blade the inner face looks up: the filament lies on it, never through it). The
   moves are eased along the polyline (a share of the neighbours'); no point goes nearer the axis than the piece's own insertion. */
function svInside(pieces,P3,gap,near,rad,own,behind){  /* behind: only the points that went through a sheet (no pull to the axis, no clearance on its own tepal) */const S=pieces.filter(p=>!p.fn&&p.S&&p.qa!==false);if(!S.length)return P3;const NU=12,NV=24,W=NU+1,TAU=2*Math.PI;
  const rk=k=>gap+(rad?rad(k):0),r00=Math.hypot(P3[0][0],P3[0][1])*.95,ease=mv=>mv.map((x,k)=>{let b=x,bl=x?V3l(x):0;
      for(const[dk,w]of[[-1,.6],[1,.6],[-2,.3],[2,.3]]){const m2=mv[k+dk];if(m2&&V3l(m2)*w>bl){b=V3.sc(m2,w);bl=V3l(m2)*w}}return b}),
    apply=(Q,mv)=>Q.map((p,k)=>{if(!mv[k]||k===0)return p;let q=V3.add(p,mv[k]);const r=Math.hypot(q[0],q[1]);if(r<r00&&r>1e-9){const f=r00/r;q=[q[0]*f,q[1]*f,q[2]]}return q});
  /* around the axis, against every sheet */
  const cyl=[];for(const sh of S)for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const p=sh.S(-1+2*i/NU,j/NV);cyl.push([Math.hypot(p[0],p[1]),Math.atan2(p[1],p[0]),p[2]])}
  let Q=behind?P3:apply(P3,ease(P3.map((p,k)=>{const r=Math.hypot(p[0],p[1]),t=Math.atan2(p[1],p[0]);let lim=Infinity;
    for(const[rq,tq,zq]of cyl){let dt=Math.abs(t-tq);if(dt>Math.PI)dt=TAU-dt;const rr=(r+rq)*.5,d2=dt*dt*rr*rr+(p[2]-zq)*(p[2]-zq);if(d2<near*near)lim=Math.min(lim,rq-rk(k))}
    if(!(lim<r)||r<1e-9)return null;const f=Math.max(r00,lim)/r;return f<1?[p[0]*(f-1),p[1]*(f-1),0]:null})));
  /* on the tepals' inner faces: its own tepal's, by gap + its radius; any other's, only where it went through it (behind its face) */
  const face=x=>{const sh=S[x],P=[],pts=[];for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++)P.push(sh.S(-1+2*i/NU,j/NV));
    for(let j=1;j<NV;j++)for(let i=1;i<NU;i++){const a=P[j*W+i+1],b=P[j*W+i-1],c=P[(j+1)*W+i],e=P[(j-1)*W+i];pts.push([P[j*W+i],V3.nz(V3.cr(V3s(c,e),V3s(a,b)))])}return pts};
  for(let x=0;x<S.length;x++){const mine=x===own&&!behind,pts=face(x);
    Q=apply(Q,ease(Q.map((p,k)=>{let bd=near*near,bq=null;for(const q of pts){const dx=p[0]-q[0][0],dy=p[1]-q[0][1],dz=p[2]-q[0][2],d2=dx*dx+dy*dy+dz*dz;if(d2<bd){bd=d2;bq=q}}
      if(!bq||k===0)return null;const[q,n]=bq,s=(p[0]-q[0])*n[0]+(p[1]-q[1])*n[1]+(p[2]-q[2])*n[2];if(!mine&&s>=0)return null;const need=rk(k)-s;return need>0?V3.sc(n,need):null})))}
  return Q}
/* svApart(tubes, gap, ins): tubes [{P (3D polyline), rad(k)}] of one heart kept apart: past the shared insertion (the first ins of each one's
   length, where they rise together from the receptacle), two points of two tubes nearer than their radii + gap are pushed apart along the line
   between them, half each, the push eased along each polyline; returns the new polylines (BONNES-PRATIQUES §14: the declinate style passing among
   the stamens, two filaments brushing) */
function svApart(T,gap,ins,rounds){let P=T.map(t=>t.P.map(p=>p.slice()));for(let it=0;it<(rounds||4);it++){const mv=P.map(Q=>Q.map(()=>[0,0,0]));
  for(let a=0;a<T.length;a++)for(let b=a+1;b<T.length;b++){const A=P[a],B=P[b],na=A.length-1,nb=B.length-1;
    /* each point of one against each segment of the other (both ways): the nearest point on the segment, the push shared by its two ends */
    const one=(X,Y,x,y,nx,ny)=>{for(let i=Math.ceil(nx*ins);i<=nx;i++)for(let j=Math.max(0,Math.ceil(ny*ins)-1);j<ny;j++){const a0=Y[j],a1=Y[j+1],dv=V3s(a1,a0),l2=V3.dot(dv,dv),
        t=l2>1e-12?Math.max(0,Math.min(1,V3.dot(V3s(X[i],a0),dv)/l2)):0;if((j+t)/ny<ins)continue;const c=V3.add(a0,V3.sc(dv,t)),d=V3s(X[i],c),l=V3l(d),need=T[x].rad(i)+T[y].rad(j+t)+gap-l;
      if(need>0){const dir=l>1e-9?V3.sc(d,1/l):[1,0,0],h=need*.5;mv[x][i]=V3.add(mv[x][i],V3.sc(dir,h));mv[y][j]=V3.add(mv[y][j],V3.sc(dir,-h*(1-t)));mv[y][j+1]=V3.add(mv[y][j+1],V3.sc(dir,-h*t))}}};
    one(A,B,a,b,na,nb);one(B,A,b,a,nb,na)}
  P=P.map((Q,x)=>{const m=mv[x],e=m.map((v,k)=>{let b=v,bl=V3l(v);for(const[dk,w]of[[-1,.6],[1,.6],[-2,.3],[2,.3]]){const m2=m[k+dk];if(m2&&V3l(m2)*w>bl){b=V3.sc(m2,w);bl=V3l(m2)*w}}return b});
    return Q.map((p,k)=>k===0?p:V3.add(p,e[k]))})}
  return P}
