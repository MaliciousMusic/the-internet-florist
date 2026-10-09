
/* ================= Pétales en SVG natif : le modelé calculé, dessiné en chemins lisses =================
   Every piece of a flower (tepal, petal, sepal) is a smooth sheet S(u,v) in the head's frame: u across (-1..1), v from the base (0) to the tip (1).
   - It is cut where it folds over itself in the view: there the visible face changes (inner face, back), and each side becomes one outline.
   - The light is computed on the sheet (wrapped diffuse, sky, light through the thin tissue, occlusion toward the heart, satin) and drawn as a
     few nested washes inside that outline, softened by one SVG blur and clipped to it; the colour runs from the base to the tip along the piece.
   - Veins follow the sheet. The margin is a little lighter where the tissue is thin.
   - Pieces are ordered pair by pair, comparing their depths where they overlap; the ones in front cast soft shadows on those behind.
   Only SVG: paths, gradients, clip paths, one Gaussian blur. No image, no mesh. */
/* the individual's own chance (its identity hashed, then mulberry32): the bouquet's chance is never touched */
function svSeed(...a){let h=2166136261;for(const ch of a.join('|')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function svRng(s){let a=s>>>0;const r=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
  r.in=(x,y)=>x+(y-x)*r();r.pick=L=>{let s=r()*L.reduce((q,w)=>q+w[1],0);for(const[v,w]of L){s-=w;if(s<=0)return v}return L[L.length-1][0]};
  r.n=()=>{let s=0;for(let i=0;i<4;i++)s+=r();return(s-2)*1.732};return r}
/* a deterministic hash in [0,1) of an index under a seed */
function pxHashS(i,k,s){let h=Math.imul(i+1,374761393)^Math.imul(k+7,668265263)^s;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
const svSm=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const svF=n=>Math.round(n*100)/100;
/* compact path data: numbers at 0.1 unit, relative moves (rounded positions are tracked, so nothing drifts) */
const svN=x=>{let t=String(Math.round(x*10)/10);if(t.startsWith('0.'))t=t.slice(1);else if(t.startsWith('-0.'))t='-'+t.slice(2);return t==='-0'?'0':t};
const svJ=a=>{let o='';for(const x of a){const t=svN(x);o+=o&&t[0]!=='-'?' '+t:t}return o};
const svR=x=>Math.round(x*10)/10;
/* a spline through points (Catmull-Rom as cubic Béziers), open or closed, written relative */
function svSpl(P,closed=true){const n=P.length;if(n<2)return'';const g=i=>closed?P[(i+n)%n]:P[Math.max(0,Math.min(n-1,i))];let cx=svR(P[0][0]),cy=svR(P[0][1]),d='M'+svJ([cx,cy]);
  for(let i=0;i<(closed?n:n-1);i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2),c1=[svR(p1[0]+(p2[0]-p0[0])/6),svR(p1[1]+(p2[1]-p0[1])/6)],c2=[svR(p2[0]-(p3[0]-p1[0])/6),svR(p2[1]-(p3[1]-p1[1])/6)],e=[svR(p2[0]),svR(p2[1])];
    d+='c'+svJ([c1[0]-cx,c1[1]-cy,c2[0]-cx,c2[1]-cy,e[0]-cx,e[1]-cy]);cx=e[0];cy=e[1]}return d+(closed?'z':'')}
/* a short curve through a run of points, as one or two quadratic Béziers passing through its middle points (veins: light to write) */
function svQuad(P){const n=P.length;if(n<2)return'';const q=(a,m,e)=>{const c=[2*m[0]-(a[0]+e[0])/2,2*m[1]-(a[1]+e[1])/2],A=[svR(a[0]),svR(a[1])];return'M'+svJ(A)+'q'+svJ([c[0]-A[0],c[1]-A[1],svR(e[0])-A[0],svR(e[1])-A[1]])};
  if(n<3)return'M'+svJ([svR(P[0][0]),svR(P[0][1])])+'l'+svJ([svR(P[1][0])-svR(P[0][0]),svR(P[1][1])-svR(P[0][1])]);if(n<7)return q(P[0],P[n>>1],P[n-1]);
  const h=n>>1;return q(P[0],P[h>>1],P[h])+q(P[h],P[(h+n-1)>>1],P[n-1])}
/* dots as zero-length strokes with round caps (one path for many) */
const svDots=P=>{let d='';for(const p of P)d+='M'+svJ([p[0],p[1]])+'h0';return d};
/* a sheet sampled on its grid: screen points, depths, view normals of the inner face, facing (> 0: the inner face is seen) */
function svSheet(B,O,S,o={}){const nu=o.nu||10,nv=o.nv||16,W=nu+1,P=[],Z=[],N=[],F=[],e=1e-3;
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const u=-1+2*i/nu,v=j/nv,p=S(u,v),s=PJ(B,O,p),ua=Math.max(-1,u-e),ub=Math.min(1,u+e),va=Math.max(0,v-e),vb=Math.min(1,v+e),
      n=V3.nz(toV(B,V3.cr(V3s(S(u,vb),S(u,va)),V3s(S(ub,v),S(ua,v)))));P.push([s[0],s[1]]);Z.push(s[2]);N.push(n);F.push(n[2])}
  return Object.assign({B,O,S,nu,nv,W,P,Z,N,F},o)}
/* the screen point of a sheet at (u,v) */
const svAt=(sh,u,v)=>{const p=PJ(sh.B,sh.O,sh.S(Math.max(-1,Math.min(1,u)),Math.max(0,Math.min(1,v))));return[p[0],p[1]]};
/* where a grid value is at least t: closed loops in grid coordinates (marching squares; the grid is padded so every loop closes along its border) */
function svIso(nu,nv,V,t){const W=nu+1,g=(i,j)=>i<0||j<0||i>nu||j>nv?-1e9:V[j*W+i]-t,pts={},segs=[];
  const pt=(k,i0,j0,i1,j1)=>{if(!pts[k]){const a=g(i0,j0),b=g(i1,j1),q=Math.max(0,Math.min(1,a/(a-b)));pts[k]=[Math.max(0,Math.min(nu,i0+(i1-i0)*q)),Math.max(0,Math.min(nv,j0+(j1-j0)*q))]}return k};
  for(let j=-1;j<=nv;j++)for(let i=-1;i<=nu;i++){const a=g(i,j),b=g(i+1,j),c=g(i+1,j+1),d=g(i,j+1),cs=(a>=0?1:0)|(b>=0?2:0)|(c>=0?4:0)|(d>=0?8:0);if(!cs||cs===15)continue;
    const e0=()=>pt('h'+i+'_'+j,i,j,i+1,j),e1=()=>pt('v'+(i+1)+'_'+j,i+1,j,i+1,j+1),e2=()=>pt('h'+i+'_'+(j+1),i,j+1,i+1,j+1),e3=()=>pt('v'+i+'_'+j,i,j,i,j+1),S=(x,y)=>segs.push([x(),y()]);
    const mid=(a+b+c+d)/4>=0;
    switch(cs){case 1:S(e3,e0);break;case 2:S(e0,e1);break;case 3:S(e3,e1);break;case 4:S(e1,e2);break;case 5:if(mid){S(e0,e1);S(e2,e3)}else{S(e3,e0);S(e1,e2)}break;
      case 6:S(e0,e2);break;case 7:S(e3,e2);break;case 8:S(e2,e3);break;case 9:S(e0,e2);break;case 10:if(mid){S(e3,e0);S(e1,e2)}else{S(e0,e1);S(e2,e3)}break;
      case 11:S(e1,e2);break;case 12:S(e1,e3);break;case 13:S(e0,e1);break;case 14:S(e3,e0);break}}
  const at={};segs.forEach((s,k)=>{for(const e of s)(at[e]=at[e]||[]).push(k)});const used=new Uint8Array(segs.length),loops=[];
  for(let k=0;k<segs.length;k++){if(used[k])continue;used[k]=1;const L=[pts[segs[k][0]]];let cur=segs[k][1],guard=0;
    while(guard++<1e5){L.push(pts[cur]);const nx=(at[cur]||[]).find(q=>!used[q]);if(nx===undefined)break;used[nx]=1;cur=segs[nx][0]===cur?segs[nx][1]:segs[nx][0]}
    if(L.length>3)loops.push(L)}
  return loops}
/* Douglas-Peucker on a closed screen loop */
function svSimp(P,tol){if(P.length<8)return P;const n=P.length,keep=new Uint8Array(n),d2=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;if(l<1e-12)return(p[0]-a[0])**2+(p[1]-a[1])**2;
    const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l));return(p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2};
  let far=0,fd=-1;for(let i=1;i<n;i++){const d=(P[i][0]-P[0][0])**2+(P[i][1]-P[0][1])**2;if(d>fd){fd=d;far=i}}
  const rec=(i0,i1)=>{let m=-1,md=tol*tol;for(let i=i0+1;i<i1;i++){const d=d2(P[i%n],P[i0%n],P[i1%n]);if(d>md){md=d;m=i}}if(m>=0){keep[m%n]=1;rec(i0,m);rec(m,i1)}};
  keep[0]=keep[far]=1;rec(0,far);rec(far,n);const out=[];for(let i=0;i<n;i++)if(keep[i])out.push(P[i]);return out}
/* Douglas-Peucker on an open polyline */
function svSimpO(P,tol){const n=P.length;if(n<3)return P;const keep=new Uint8Array(n);keep[0]=keep[n-1]=1;const rec=(i0,i1)=>{const a=P[i0],b=P[i1],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let m=-1,md=tol*tol;
    for(let i=i0+1;i<i1;i++){const p=P[i],t=l<1e-12?0:Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l)),d=(p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2;if(d>md){md=d;m=i}}if(m>=0){keep[m]=1;rec(i0,m);rec(m,i1)}};
  rec(0,n-1);return P.filter((_,i)=>keep[i])}
/* grid loops -> smooth screen path (exact points of the sheet, simplified, then a closed spline) */
function svLoopsD(sh,loops,tol){let d='';for(const L of loops){const q=[];for(const[gi,gj]of L){const p=svAt(sh,-1+2*gi/sh.nu,gj/sh.nv);const l=q[q.length-1];if(!l||Math.abs(l[0]-p[0])+Math.abs(l[1]-p[1])>tol*.3)q.push(p)}
    if(q.length<3)continue;const s=svSimp(q,tol);if(s.length>2)d+=svSpl(s)}return d}
const svArea=L=>{let a=0;for(let i=0,n=L.length;i<n;i++){const p=L[i],q=L[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return Math.abs(a/2)};
/* the light on one vertex of a sheet: its visible face's normal, the occlusion there; 1 = the face lit straight on */
function svLight(n,m,ao){const L=LIGHT,dl=V3.dot(n,L),w=m.wrap??.35,dif=Math.max(0,(dl+w)/(1+w)),sky=.5+.5*n[1],H=HV3,sp=Math.pow(Math.max(0,V3.dot(n,H)),m.gloss||12)*(m.ks??.12);
  return ao*((m.amb??.36)+(m.dif??.58)*dif+(m.sky??.16)*sky)+(dl<0?-dl*(m.trans??.2):0)+sp}
/* the grid value at (u,v), bilinear */
function svLerp(sh,A,u,v){const x=Math.max(0,Math.min(sh.nu-1e-9,(u+1)/2*sh.nu)),y=Math.max(0,Math.min(sh.nv-1e-9,v*sh.nv)),i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,W=sh.W;
  return(A[j*W+i]*(1-fx)+A[j*W+i+1]*fx)*(1-fy)+(A[(j+1)*W+i]*(1-fx)+A[(j+1)*W+i+1]*fx)*fy}
/* the cells of a sheet on one side of its fold, for ordering: corners, bbox, centre and its depth */
function svCells(sh,s){const W=sh.W,c=[];for(let j=0;j<sh.nv;j++)for(let i=0;i<sh.nu;i++){const q=[j*W+i,j*W+i+1,(j+1)*W+i+1,(j+1)*W+i];
    if(s&&s*(sh.F[q[0]]+sh.F[q[1]]+sh.F[q[2]]+sh.F[q[3]])<0)continue;const P=q.map(k=>sh.P[k]),Z=q.map(k=>sh.Z[k]);
    c.push({P,Z,x0:Math.min(P[0][0],P[1][0],P[2][0],P[3][0]),x1:Math.max(P[0][0],P[1][0],P[2][0],P[3][0]),y0:Math.min(P[0][1],P[1][1],P[2][1],P[3][1]),y1:Math.max(P[0][1],P[1][1],P[2][1],P[3][1]),
      cx:(P[0][0]+P[1][0]+P[2][0]+P[3][0])/4,cy:(P[0][1]+P[1][1]+P[2][1]+P[3][1])/4,cz:(Z[0]+Z[1]+Z[2]+Z[3])/4})}return c}
/* the depth of an item's surface under a screen point (null where it is not) */
function svDepthAt(it,x,y){if(x<it.bb[0]||x>it.bb[2]||y<it.bb[1]||y>it.bb[3])return null;
  for(const c of it.cells){if(x<c.x0||x>c.x1||y<c.y0||y>c.y1)continue;for(const[a,b,d]of[[0,1,2],[0,2,3]]){const A=c.P[a],B2=c.P[b],C=c.P[d],den=(B2[1]-C[1])*(A[0]-C[0])+(C[0]-B2[0])*(A[1]-C[1]);if(Math.abs(den)<1e-12)continue;
      const l1=((B2[1]-C[1])*(x-C[0])+(C[0]-B2[0])*(y-C[1]))/den,l2=((C[1]-A[1])*(x-C[0])+(A[0]-C[0])*(y-C[1]))/den,l3=1-l1-l2;if(l1>=-1e-6&&l2>=-1e-6&&l3>=-1e-6)return l1*c.Z[a]+l2*c.Z[b]+l3*c.Z[d]}}return null}
/* paint order: for each pair that overlaps, which is in front where they overlap; then a topological order (far first), cycles broken by mean depth.
   The pairs where each is in front somewhere (by more than eps) are kept in out.fr: a whole piece cannot be both, so svDraw patches them */
function svOrder(items,eps=0){const n=items.length,before=items.map(()=>new Set()),indeg=new Array(n).fill(0),fr=[];
  for(let a=0;a<n;a++)for(let b=a+1;b<n;b++){const A=items[a],B2=items[b];if(A.bb[2]<B2.bb[0]||B2.bb[2]<A.bb[0]||A.bb[3]<B2.bb[1]||B2.bb[3]<A.bb[1])continue;if(A.grp&&A.grp===B2.grp&&A.fixed)continue;
    let vote=0,fa=0,fb=0;for(const c of A.cells){const z=svDepthAt(B2,c.cx,c.cy);if(z!==null){vote+=c.cz>z?1:-1;if(c.cz>z+eps)fa++;else if(c.cz<z-eps)fb++}}
    for(const c of B2.cells){const z=svDepthAt(A,c.cx,c.cy);if(z!==null){vote+=c.cz>z?-1:1;if(c.cz>z+eps)fb++;else if(c.cz<z-eps)fa++}}if(fa&&fb)fr.push([A,B2,fa,fb]);
    if(vote>0){before[a].add(b)}else if(vote<0){before[b].add(a)}}
  /* before[x] holds the items drawn before x */
  const after=items.map(()=>[]);for(let x=0;x<n;x++)for(const y of before[x]){after[y].push(x);indeg[x]++}
  const out=[],done=new Uint8Array(n);while(out.length<n){let pick=-1;for(let x=0;x<n;x++)if(!done[x]&&!indeg[x]&&(pick<0||items[x].z<items[pick].z))pick=x;
    if(pick<0){for(let x=0;x<n;x++)if(!done[x]&&(pick<0||items[x].z<items[pick].z))pick=x}done[pick]=1;out.push(items[pick]);for(const y of after[pick])indeg[y]--}
  out.fr=fr;return out}
/* the patches can be switched off to compare (?nopatch=1 on a test page) */
const SV_PATCH=!(typeof location!=='undefined'&&/[?&]nopatch=1/.test(location.search));
/* where item A is in front of item B (by eps), as a path on A's sheet (its proxy for a drawn part); '' where it never is */
function svFrontD(A,B,eps,tol,Dm){const sh=A.kind==='reg'?A.sh:A.px,V=new Array(sh.P.length);
  for(let q=0;q<V.length;q++){const p=sh.P[q],z=svDepthAt(B,p[0],p[1]);let v=z===null?-Dm*.02:sh.Z[q]-z-eps;if(A.kind==='reg')v=Math.min(v,A.s*sh.F[q]*Dm*.3);V[q]=v}
  const loops=svIso(sh.nu,sh.nv,V,0).filter(L=>L.length>3);return loops.length?svLoopsD(sh,loops,tol):''}
/* one blur per strength (user units) */
const SVBLUR={};function svBlur(s){const k=Math.max(.1,Math.round(s*10)/10),key=k+(GDEF?'g':'d');const id=SVBLUR[key];if(id&&document.getElementById(id))return`url(#${id})`;
  const nid='sb'+(gid++),fl=E('filter',{id:nid,x:'-25%',y:'-25%',width:'150%',height:'150%','color-interpolation-filters':'sRGB'},GDEF||defs);E('feGaussianBlur',{stdDeviation:k},fl);SVBLUR[key]=nid;return`url(#${nid})`}
/* the regions of a sheet (one per visible face, cut along the fold) */
function svRegions(sh,o){const out=[],tol=o.tol;for(const s of[1,-1]){const V=sh.F.map(x=>s*x);if(!V.some(x=>x>0))continue;const loops=svIso(sh.nu,sh.nv,V,0).filter(L=>L.length>4);if(!loops.length)continue;
    const d=svLoopsD(sh,loops,tol);if(!d)continue;const cells=svCells(sh,s);if(!cells.length)continue;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,z=0;for(const c of cells){x0=Math.min(x0,c.x0);y0=Math.min(y0,c.y0);x1=Math.max(x1,c.x1);y1=Math.max(y1,c.y1);z+=c.cz}
    out.push({kind:'reg',sh,s,loops,d,cells,bb:[x0,y0,x1,y1],z:z/cells.length+(sh.zb||0),grp:sh.grp})}return out}
/* the colour of a face along the piece: a linear gradient from its base to its tip on the screen, stops placed where the sheet puts them */
function svFaceFill(sh,st,Dm){const pb=svAt(sh,0,0),pt=svAt(sh,0,1),dx=pt[0]-pb[0],dy=pt[1]-pb[1],l2=dx*dx+dy*dy;if(l2<(Dm*.04)**2)return st[Math.floor(st.length/2)][1];
  const off=st.map(([v,c,a])=>{const p=svAt(sh,0,v);return[Math.max(0,Math.min(1,((p[0]-pb[0])*dx+(p[1]-pb[1])*dy)/l2)),c,a??1]}).sort((a,b)=>a[0]-b[0]);
  const id='sg'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(pb[0]),y1:svF(pb[1]),x2:svF(pt[0]),y2:svF(pt[1])},GDEF||defs);stops(gr,off.map(([t,c,a])=>[svF(t),c,a]));return`url(#${id})`}
/* the light of every vertex of a sheet, relative to its face lit straight on */
function svShade(sh){if(sh.K)return sh.K;const m=sh.mat,r=svLight([0,0,1],m,1),K=new Float32Array(sh.F.length);
  for(let j=0;j<=sh.nv;j++)for(let i=0;i<=sh.nu;i++){const q=j*sh.W+i,n=sh.N[q],nf=sh.F[q]>=0?n:V3.sc(n,-1),ao=sh.ao?sh.ao(-1+2*i/sh.nu,j/sh.nv,sh.F[q]>=0):1;K[q]=svLight(nf,m,ao)/r}return sh.K=K}
/* draw the pieces of one flower: pieces are sheets (svSheet with a material) or drawn parts {fn, proxy (a sheet, for the order only)} */
function svDraw(par,pieces,o){const Dm=o.D,tol=Math.max(.06,Dm*.0035),k=G(par),items=[];
  for(const p of pieces){if(p.fn){const cells=svCells(p.proxy,0);if(!cells.length){items.push({kind:'fn',fn:p.fn,cells:[],bb:[0,0,-1,-1],z:p.z??0});continue}let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,z=0;
      for(const c of cells){x0=Math.min(x0,c.x0);y0=Math.min(y0,c.y0);x1=Math.max(x1,c.x1);y1=Math.max(y1,c.y1);z+=c.cz}items.push({kind:'fn',fn:p.fn,px:p.proxy,cells,bb:[x0,y0,x1,y1],z:z/cells.length+(p.zb||0)})}
    else items.push(...svRegions(p,{tol}))}
  const eps=Dm*.005,order=svOrder(items,eps),regs=order.filter(it=>it.kind==='reg'),dd=GDEF||defs;
  /* the patches: where a piece drawn earlier is in front of a later one (a tepal curling over its neighbour, the stamens over a tepal's claw), the earlier
     piece is drawn again over the later one, clipped to where it is in front */
  order.forEach((it,i)=>it.oi=i);if(SV_PATCH)for(const[A,B2,fa,fb]of order.fr){const[e,l,c]=A.oi<B2.oi?[A,B2,fa]:[B2,A,fb];if(c<(o.pmin||3))continue;const d=svFrontD(e,l,eps,tol,Dm);if(!d)continue;
    (l.patch=l.patch||[]).push([e.oi,e,d]);if(!e.gid)e.gid='sk'+(gid++)}
  for(const it of regs){it.id='sp'+(gid++);E('path',{id:it.id,d:it.d},dd);it.cid='sc'+(gid++);E('use',{href:'#'+it.id},E('clipPath',{id:it.cid},dd))}
  let uid=null;if(!LOD&&o.shadow!==false&&regs.length>1){uid='su'+(gid++);const cl=E('clipPath',{id:uid},dd);for(const it of regs)E('use',{href:'#'+it.id},cl)}
  const L2=Math.hypot(LIGHT[0],LIGHT[1])||1,sdx=-LIGHT[0]/L2,sdy=LIGHT[1]/L2,sOff=Dm*(o.sd??.024),sBl=svBlur(Dm*(o.sb??.016));let drawn=0;
  const patch=it=>{if(!it.patch)return;it.patch.sort((a,b)=>a[0]-b[0]);const host=it.kind==='reg'?G(k,{'clip-path':`url(#${it.cid})`}):k;
    for(const[,e,d]of it.patch){const pc='sq'+(gid++);E('path',{d,'clip-rule':'evenodd'},E('clipPath',{id:pc},dd));E('use',{href:'#'+e.gid,'clip-path':`url(#${pc})`},host)}};
  for(const it of order){if(it.kind==='fn'){it.fn(it.gid?G(k,{id:it.gid}):k);patch(it);continue}const sh=it.sh,m=sh.mat,front=it.s>0;
    if(uid&&drawn++)E('path',{d:it.d,transform:`translate(${svF(sdx*sOff)},${svF(sdy*sOff)})`,fill:m.cast||'#1a1030','fill-opacity':o.so??.34,filter:sBl},G(k,{'clip-path':`url(#${uid})`}));
    const ik=it.gid?G(k,{id:it.gid}):k;E('use',{href:'#'+it.id,fill:svFaceFill(sh,front?m.stops:m.bstops,Dm)},ik);if(LOD){patch(it);continue}
    const cg=G(ik,{'clip-path':`url(#${it.cid})`}),K=svShade(sh),FF=sh.F.map(x=>it.s*x*3),pb=svAt(sh,0,0),pt=svAt(sh,0,1),Ls=Math.max(Math.hypot(pt[0]-pb[0],pt[1]-pb[1]),(it.bb[2]-it.bb[0]+it.bb[3]-it.bb[1])*.35),
      bg=G(cg,{filter:svBlur(Ls*(m.soft??.05))}),wash=(lv,col,a,dark)=>{for(const t of lv){const V=Array.from(K,(x,q)=>Math.min(dark?t-x:x-t,FF[q]));if(!V.some(x=>x>0))continue;
        const d=svLoopsD(sh,svIso(sh.nu,sh.nv,V,0),Math.max(tol*2.5,Dm*.008));if(d)E('path',{d,fill:col,'fill-opacity':a,'fill-rule':'evenodd'},bg)}};
    /* flames (streaks of a second colour along the tissue: the flamed anemones), soft wide strokes in the blurred washes */
    if(m.flames&&!(m.flames.side&&m.flames.side!==it.s)){let k2=0;for(const[pl,w]of m.flames.list){k2++;let run=[],dF='',dH='';const flush=()=>{if(run.length>2){const n=run.length,L=[],Rr=[];for(let q=0;q<n;q++){const a=run[Math.max(0,q-1)],b=run[Math.min(n-1,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,t=q/(n-1),
          ww=Dm*w*.5*Math.pow(Math.sin(Math.PI*Math.min(.97,.04+.93*t)),.7)*(.75+.5*pxHashS(q,k2,7));L.push([run[q][0]-dy/l*ww,run[q][1]+dx/l*ww]);Rr.push([run[q][0]+dy/l*ww*(.6+.4*pxHashS(q,k2,9)),run[q][1]-dx/l*ww*(.6+.4*pxHashS(q,k2,9))])}
        const d=svSpl(L.concat(Rr.reverse()));dF+=d}run=[]};
      for(const[u2,v]of pl){if(it.s*svLerp(sh,sh.F,u2,v)>.03)run.push(svAt(sh,u2,v));else flush()}flush();
      if(dF){const fs=it.s>0||m.flames.side;E('path',{d:dF,fill:m.flames.c,'fill-opacity':m.flames.op*.5*(fs?1:.6)},bg);E('path',{d:dF,fill:m.flames.c,'fill-opacity':m.flames.op*.8*(fs?1:.55)},cg)}}}
/* the blotch at the foot of the inner face (tulips, poppies): a shape in (u,v) from the claw, rounded at its top (b.k), its colour running into an
   edge colour (b.e) then the tissue; drawn under the washes, so the light still models it */
    if(m.blot&&front){const hi=DET>=1.5,b=m.blot,n=9,L=[],Rr=[];let on=0;for(let q=0;q<=n;q++){const v=b.v*q/n,hw=b.w*Math.pow(Math.max(0,1-Math.pow(q/n,b.k||2.6)),.55)+.015;
        for(const u of[-hw,hw])if(svLerp(sh,sh.F,u,v)>0)on++;L.push(svAt(sh,-hw,v));Rr.push(svAt(sh,hw,v))}
      if(on>(n+1)*1.2){const fl=svFaceFill(sh,[[0,b.c,b.op],[b.v*(b.cv??.5),b.c,b.op],[b.v*.8,b.e||b.c,b.op*.9],[b.v*1.04,b.e||b.c,0]],Dm),d=svSpl(L.concat(Rr.reverse()));
        if(hi)E('path',{d,fill:fl},bg);E('path',{d,fill:fl,'fill-opacity':hi?.85:1},cg)}}
/* a picotee: a band of a second colour along the margin from b.v0 (sides) over the tip, soft inward (blurred) and crisp at the edge */
    if(m.band){const hi=DET>=1.5,b=m.band,ns=12,pl=[];for(let q=0;q<=ns;q++)pl.push([-1,b.v0+(1-b.v0)*q/ns]);for(let q=1;q<2*ns;q++)pl.push([-1+q/ns,1]);for(let q=0;q<=ns;q++)pl.push([1,1-(1-b.v0)*q/ns]);
      let run=[],d='';const flush=()=>{if(run.length>2)d+=svSpl(run,false);run=[]};for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>-.02)run.push(svAt(sh,u,v));else flush()}flush();
      if(d){const w=Dm*b.w*(front?1:b.bk??.8);if(hi)E('path',{d,fill:'none',stroke:b.c,'stroke-width':svF(w*3.2),'stroke-opacity':b.op*.55,'stroke-linejoin':'round'},bg);
        E('path',{d,fill:'none',stroke:b.c,'stroke-width':svF(w*.8),'stroke-opacity':b.op,'stroke-linejoin':'round'},cg)}}
/* blotches (browning tissue): soft spots at given (u,v), in the blurred washes */
    if(m.spots){for(const[u,v,r0,col,op]of m.spots){if(it.s*svLerp(sh,sh.F,u,v)<=0)continue;const p=svAt(sh,u,v),q=svAt(sh,Math.min(1,u+.12),v),rr=Math.max(.3,Math.hypot(q[0]-p[0],q[1]-p[1])*r0*8);
      E('path',{d:'M'+svJ([svR(p[0]-rr),svR(p[1])])+'a'+svJ([svR(rr),svR(rr*.7)])+' 0 1,0 '+svJ([svR(2*rr),0])+'a'+svJ([svR(rr),svR(rr*.7)])+' 0 1,0 '+svJ([svR(-2*rr),0]),fill:col,'fill-opacity':op},bg)}}
const hi=DET>=1.5;wash(hi?m.dark||[.92,.8,.68,.56,.44]:m.darkLo||m.dark||[.9,.76,.62],front?m.shade:m.bshade,hi?m.da??.2:m.daLo??m.da??.26,1);wash(hi?m.lit||[1.08,1.2]:m.litLo||m.lit||[1.1],front?m.lite:m.blite,hi?m.la??.22:m.laLo??m.la??.24,0);
    /* veins: their runs on this face only */
    if(m.veins&&(DET>=1||!o.small)){const VL=m.veins(sh,front);for(const[set,w,col,op]of VL){let d='';for(const pl of set){let run=[];const flush=()=>{if(run.length>1)d+=svQuad(run);run=[]};
          for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>.03)run.push(svAt(sh,u,v));else flush()}flush()}
        if(d)E('path',{d,fill:'none',stroke:hi?svFaceFill(sh,[[0,col,0],[.12,col,op],[.55,col,op*.75],[1,col,op*.3]],Dm):col,'stroke-opacity':hi?1:op*.7,'stroke-width':svF(Dm*w),'stroke-linecap':'round','stroke-linejoin':'round'},cg)}}
    if(m.rw)E('use',{href:'#'+it.id,fill:'none',stroke:front?m.rim:m.brim||m.rim,'stroke-width':svF(Dm*m.rw),'stroke-opacity':m.ro??.4},cg);patch(it)}
  return k}
/* ---------- stems in SVG: a lit cylinder along any centre line ----------
   The outline; inside it, washes laid along the stem (the side away from the light darker, a soft highlight on the lit side, a thin gloss) blurred
   together and clipped; fine hairs standing out of the silhouette, leaning toward the flower; a tint toward the head (an anemone's stem reddens under
   its collar). A colour list carries its style in c.sv = {hair, hairK (spacing × width), red, redF (where the tint starts, 0..1 toward the head), gloss}. */
function svStemLine(par,C,Wd0,c){const n=C.length,g=G(par);if(n<2)return g;const T=[],N=[],sv=c.sv||{},ph=(C[0][0]*.37+C[0][1]*.11)%6.28;
  /* a slow swell of the width along the stem (a living stem is never a ruled tube) */
  let acc0=0;const Wd=Wd0.map((w,i)=>{if(i)acc0+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);return w*(1+(sv.swell??.05)*Math.sin(acc0/(w*9)+ph)+.025*Math.sin(acc0/(w*3.1)+ph*2))});
  for(let i=0;i<n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;T.push([dx/l,dy/l]);N.push([-dy/l,dx/l])}
  const lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1]),L=[lt[0]/ll,lt[1]/ll],kk=N.map(q=>Math.max(-1,Math.min(1,(q[0]*L[0]+q[1]*L[1])*2.5))),
    off=(f0,f1)=>{const A=[],B2=[];for(let i=0;i<n;i++){const w=Wd[i]/2,s=kk[i],o0=w*f0*s,o1=w*f1*s;A.push([C[i][0]+N[i][0]*o0,C[i][1]+N[i][1]*o0]);B2.push([C[i][0]+N[i][0]*o1,C[i][1]+N[i][1]*o1])}return A.concat(B2.reverse())},
    line=f0=>{const A=[];for(let i=0;i<n;i++){const o0=Wd[i]/2*f0;A.push([C[i][0]+N[i][0]*o0,C[i][1]+N[i][1]*o0])}return A},
    tol=Math.max(.04,Math.min(...Wd)*.05),W0=Wd.reduce((a,b)=>a+b,0)/n;
  const out=[];for(let i=0;i<n;i++)out.push([C[i][0]+N[i][0]*Wd[i]/2,C[i][1]+N[i][1]*Wd[i]/2]);for(let i=n-1;i>=0;i--)out.push([C[i][0]-N[i][0]*Wd[i]/2,C[i][1]-N[i][1]*Wd[i]/2]);
  /* a cut stem (sv.cut: the slant of the cut, as a tangent): its first end C[0] cut straight across or slanted, never rounded; a pale lip on the cut */
  const ct=sv.cut!=null;if(ct){const s=sv.cut*Wd[0]/2,m=out.length-1;out[0]=[out[0][0]+T[0][0]*s,out[0][1]+T[0][1]*s];out[m]=[out[m][0]-T[0][0]*s,out[m][1]-T[0][1]*s]}
  const od=ct?svSpl(svSimp(out,tol),false)+'Z':svSpl(svSimp(out,tol));E('path',{d:od,fill:c[1]},g);if(LOD)return g;
  const id='sc'+(gid++);E('path',{d:od},E('clipPath',{id},GDEF||defs));const cg=G(g,{'clip-path':`url(#${id})`}),bg=G(cg,{filter:svBlur(W0*.16)});
  E('path',{d:svSpl(svSimp(off(-1.4,-.25),tol)),fill:c[0],'fill-opacity':.85},bg);E('path',{d:svSpl(svSimp(off(-1.4,-.68),tol)),fill:c[0],'fill-opacity':.6},bg);
  E('path',{d:svSpl(svSimp(off(.02,.62),tol)),fill:c[2],'fill-opacity':.8},bg);E('path',{d:svSpl(svSimp(off(.18,.42),tol)),fill:c[3],'fill-opacity':sv.gloss??.5},bg);
  /* fine striations along the stem (its ribs), darker on the shaded side */
  if(sv.ribs&&DET>=1){let d='';for(const f0 of sv.ribs)d+=svSpl(svSimpO(line(f0),tol),false);E('path',{d,fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.06,W0*.05)),'stroke-opacity':.28},cg)}
  if(ct){const a=out[0],b=out[out.length-1];E('path',{d:'M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])]),fill:'none',stroke:sv.cutC||'#dde6c4','stroke-width':svF(Wd[0]*.34),'stroke-opacity':.9},cg)}
  /* the tint toward the head (only where a whole stem is drawn in one piece) */
  if(sv.red){const a=C[0],b=C[n-1],gid2='sg'+(gid++),gr=E('linearGradient',{id:gid2,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
    const f0=sv.redF??.75;stops(gr,[[0,sv.red,0],[f0,sv.red,0],[1,sv.red,sv.redA??.45]]);E('path',{d:od,fill:`url(#${gid2})`},cg)}
  /* silky hairs pressed along the stem, leaning toward its end: many, fine, short, half transparent; on the silhouette they stand a little out of it, on the
     face they catch the light as a sheen */
  if(sv.hair){let de='',df='';const step=W0*(sv.hairK??.7)*(DET>=1.5?.6:1.2);let acc=0,k=0;for(let i=1;i<n;i++){acc+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);while(acc>=step){acc-=step;k++;
      const w=Wd[i]/2,r1=pxHashS(k,3,n),r2=pxHashS(k,5,n),r3=pxHashS(k,7,n);
      for(const s of[1,-1]){const h=w*(.35+.4*r1),q=[C[i][0]+N[i][0]*w*s*(.82+.1*r2),C[i][1]+N[i][1]*w*s*(.82+.1*r2)],a=.22+.3*r3,dir=[N[i][0]*s*a+T[i][0],N[i][1]*s*a+T[i][1]],dl=Math.hypot(dir[0],dir[1]);
        de+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(dir[0]/dl*h),svR(dir[1]/dl*h)])}
      if(DET>=1.5&&r1<.6){const o=(r2*2-1)*.7*w,q=[C[i][0]+N[i][0]*o,C[i][1]+N[i][1]*o],h=w*(.3+.3*r3);df+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(T[i][0]*h),svR(T[i][1]*h)])}}}
    if(de)E('path',{d:de,fill:'none',stroke:sv.hair,'stroke-width':svF(Math.max(.04,W0*.026)),'stroke-opacity':.38,'stroke-linecap':'round'},g);
    if(df)E('path',{d:df,fill:'none',stroke:sv.hair,'stroke-width':svF(Math.max(.04,W0*.022)),'stroke-opacity':.1,'stroke-linecap':'round'},cg)}
  return g}
/* the shared stem drawers hand a styled stem to svStemLine: a cubic (stem3) or a polyline with widths (stemPoly) */
function svStem3(par,P,w0,w1,c,n){const C=[],W=[],m=Math.max(10,n*2);for(let i=0;i<=m;i++){const t=i/m,u=1-t,q=[0,1].map(j=>u*u*u*P[0][j]+3*u*u*t*P[1][j]+3*u*t*t*P[2][j]+t*t*t*P[3][j]);C.push(q);W.push(w0+(w1-w0)*t)}return svStemLine(par,C,W,c)}
