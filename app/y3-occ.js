/* ---------- occlusion between pieces and cast shadows (2026-10-20, owner on the peony: « le truc qui positionne la distribution des lights et opacité
   dans les calques je le veux améliorer »). Measured first (fleur/carte.py): on the photos of a full double the hollows between petals cover 7 to 31 %
   of the flower, on our renders 2 to 5 %; the only occlusion was each piece's own base (ao), so a petal deep in the heart was lit like one on top.
   Opt-in: svDraw(par, pieces, {..., occ: true or settings over SVOC_DEF}). For every sheet, at its grid vertices and on the face that is seen:
     sh.occA  the ambient light that reaches it (0..1): rays over the hemisphere around its normal, blocked by the other pieces' vertices
              (a point cloud in the page's 3D frame, hashed), nearer blockers weigh more;
     sh.sunA  the direct light that reaches it (0..1): a few rays toward LIGHT (a small soft cone), blocked the same way: the cast shadow.
   svShade (washes, DET < 1.5) and svFine (DET >= 1.5) read them: the ambient and sky terms by occA, the direct, specular and back-lit terms by sunA.
   Without o.occ nothing here runs and every sort draws the same bytes. Distances are in head radii R0 (o.D / 2). */
const SVOC_DEF={k:.5,dirs:14,steps:[.06,.14,.26,.42],sun:.9,sunK:.6,soft:.07,rays:3,self:.22,cell:.03,blur:1,eps:.012};
const SVOC_OFF=typeof location!=='undefined'&&/[?&]noocc=1/.test(location.search||'');  /* test only: &noocc=1 draws without it */
function svOcclude(sheets,R0,cfg){const C=cfg===true?SVOC_DEF:Object.assign({},SVOC_DEF,cfg),cs=C.cell*R0,H=new Map(),key=(x,y,z)=>x+','+y+','+z,pts=[];
  /* the cloud: every vertex of every sheet, x right, y up, z toward the eye (the projection is orthographic: the screen with y turned up) */
  sheets.forEach((sh,si)=>{for(let j=0;j<=sh.nv;j++)for(let i=0;i<=sh.nu;i++){const q=j*sh.W+i,p=[sh.P[q][0],-sh.P[q][1],sh.Z[q]],k=key(Math.floor(p[0]/cs),Math.floor(p[1]/cs),Math.floor(p[2]/cs));
    let b=H.get(k);if(!b)H.set(k,b=[]);b.push([p[0],p[1],p[2],si,-1+2*i/sh.nu,j/sh.nv])}});
  const hit=(x,y,z,rr,si,u,v)=>{const r2=rr*rr,a=Math.floor((x-rr)/cs),b=Math.floor((x+rr)/cs),c=Math.floor((y-rr)/cs),d=Math.floor((y+rr)/cs),e=Math.floor((z-rr)/cs),f=Math.floor((z+rr)/cs);
    for(let X=a;X<=b;X++)for(let Y=c;Y<=d;Y++)for(let Z=e;Z<=f;Z++){const bk=H.get(key(X,Y,Z));if(!bk)continue;
      for(const q of bk){if(q[3]===si&&Math.abs(q[4]-u)*.5+Math.abs(q[5]-v)<C.self)continue;const dx=q[0]-x,dy=q[1]-y,dz=q[2]-z;if(dx*dx+dy*dy+dz*dz<r2)return true}}return false};
  /* the hemisphere's directions (Fibonacci, cosine weighted) in a frame around +z, turned onto each normal */
  const D=[];for(let k=0;k<C.dirs;k++){const t=(k+.5)/C.dirs,r=Math.sqrt(t),ph=k*2.39996;D.push([r*Math.cos(ph),r*Math.sin(ph),Math.sqrt(1-t)])}
  const basis=n=>{const a=Math.abs(n[0])<.9?[1,0,0]:[0,1,0],t=V3.nz(V3.cr(a,n)),b=V3.cr(n,t);return[t,b]};
  const sunD=[LIGHT];for(let k=1;k<C.rays;k++){const[t,b]=basis(LIGHT),ph=k*2.39996;sunD.push(V3.nz([LIGHT[0]+C.soft*(t[0]*Math.cos(ph)+b[0]*Math.sin(ph)),LIGHT[1]+C.soft*(t[1]*Math.cos(ph)+b[1]*Math.sin(ph)),LIGHT[2]+C.soft*(t[2]*Math.cos(ph)+b[2]*Math.sin(ph))]))}
  const sunSteps=[];for(let k=1;k<=8;k++)sunSteps.push(C.sun*R0*Math.pow(k/8,1.5));
  sheets.forEach((sh,si)=>{const n0=sh.P.length,A=new Float32Array(n0),S=new Float32Array(n0);
    for(let j=0;j<=sh.nv;j++)for(let i=0;i<=sh.nu;i++){const q=j*sh.W+i,u=-1+2*i/sh.nu,v=j/sh.nv,n=sh.F[q]>=0?sh.N[q]:V3.sc(sh.N[q],-1),
        p0=[sh.P[q][0]+n[0]*C.eps*R0,-sh.P[q][1]+n[1]*C.eps*R0,sh.Z[q]+n[2]*C.eps*R0],[t,b]=basis(n);
      let bl=0;for(const d0 of D){const d=[t[0]*d0[0]+b[0]*d0[1]+n[0]*d0[2],t[1]*d0[0]+b[1]*d0[1]+n[1]*d0[2],t[2]*d0[0]+b[2]*d0[1]+n[2]*d0[2]];
        for(let s=0;s<C.steps.length;s++){const L=C.steps[s]*R0,rr=Math.max(cs*.9,L*.3);if(hit(p0[0]+d[0]*L,p0[1]+d[1]*L,p0[2]+d[2]*L,rr,si,u,v)){bl+=1-s/(C.steps.length+1);break}}}
      A[q]=1-C.k*bl/D.length;
      let sb=0;for(const d of sunD){for(const L of sunSteps){if(hit(p0[0]+d[0]*L,p0[1]+d[1]*L,p0[2]+d[2]*L,Math.max(cs*.8,L*.06),si,u,v)){sb++;break}}}
      S[q]=1-C.sunK*sb/sunD.length}
    /* a light blur over the grid (the cloud is coarse: one vertex every few px) */
    const sm=X=>{if(!C.blur)return X;const Y=new Float32Array(n0);for(let j=0;j<=sh.nv;j++)for(let i=0;i<=sh.nu;i++){let s=0,w=0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const jj=j+dj,ii=i+di;if(jj<0||jj>sh.nv||ii<0||ii>sh.nu)continue;const ww=dj||di?1:2;s+=X[jj*sh.W+ii]*ww;w+=ww}Y[j*sh.W+i]=s/w}return Y};
    sh.occA=sm(A);sh.sunA=sm(S);sh.K=null})}
/* svLight with the two visibilities: the ambient and the sky by occA, the direct, the specular and the light through a face lit from behind by sunA */
function svLightO(n,m,ao,oa,sa){const L=LIGHT,dl=V3.dot(n,L),w=m.wrap??.35,dif=Math.max(0,(dl+w)/(1+w)),sky=.5+.5*n[1],H=HV3,sp=Math.pow(Math.max(0,V3.dot(n,H)),m.gloss||12)*(m.ks??.12);
  return ao*(oa*((m.amb??.36)+(m.sky??.16)*sky)+sa*(m.dif??.58)*dif)+sa*((dl<0?-dl*(m.trans??.2):0)+sp)}
