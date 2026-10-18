
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
/* ---------- opt-in layers of a material (2026-10-18, audit v4 A5): read only when the material has the key (m.cross, m.transmit); without it svDraw writes the
   same bytes. Drawn from the piece's own sheet, inside its clip: nothing outside the piece, no outline of another piece, no chance drawn ---------- */
/* nested level sets of a coverage field C (0..1 at the grid's vertices) on one face of a sheet (FF > 0): n paths, each a little more opaque inside the
   last, so that together they lay C rounded to n steps (blur: softened by a filter). They are the luminance of a mask (white at their opacity, or mf: a
   white gradient; never tinted by WILT or TINT, which only move #rrggbb) over the piece's own outline (it.id) painted with fill (a colour or a paint server): the layer can
   never pass the piece, not even by a spline's overshoot at a pointed tip, and the head's getBBox (c5 places a bouquet's heads by it) stays the piece's */
function svLevels(it,sh,C,FF,n,fill,par,tol,blur,mf){let gm=0;for(let q=0;q<C.length;q++)if(FF[q]>0&&C[q]>gm)gm=C[q];if(gm<.004)return;gm=Math.min(.96,gm);let c0=0;const L=[];
  for(let i=1;i<=n;i++){const t=gm*(i-.5)/n,c1=gm*i/n,a=1-(1-c1)/(1-c0);c0=c1;const V=Array.from(C,(x,q)=>Math.min(x-t,FF[q]));if(!V.some(x=>x>0))continue;
    const d=svLoopsD(sh,svIso(sh.nu,sh.nv,V,0),tol);if(d)L.push([d,a])}
  if(!L.length)return;const id='sm'+(gid++),mk=E('mask',{id},GDEF||defs),mg=blur?G(mk,{filter:blur}):mk;for(const[d,a]of L)E('path',{d,fill:mf||'white','fill-opacity':svF(a),'fill-rule':'evenodd'},mg);
  E('use',{href:'#'+it.id,fill,mask:`url(#${id})`},par)}
/* m.cross: colour zones ACROSS a piece, not only along it (porteur, cymbidium: « des aplats avec zones », BONNES-PRATIQUES 4.8d): a darker midline,
   paler margins, a hue that changes from the middle to the edge. One zone or a list of zones {st, sg, tip, v, bk, k, n, soft} (or the stops alone):
   st [[x, colour, alpha]...] on x = |u| (0 the midline .. 1 the margin; sg:1 x = u, -1 .. 1: one half unlike the other); tip: from v = tip on, the tip
   counts as margin (x = max(|u|, (v-tip)/(1-tip))); v [a,b] or [a,b,c,d]: only along v, in from a to b (out from c to d); bk: on the back face (× its
   alpha, 0 by default); k: an overall factor (the kit's bud); n [zoom, normal]: steps per colour ([6,3]); soft: their blur (× the piece's length, .025;
   0 crisp; the paths simplified as the washes when soft). Each colour of the stops is its own field (its share of the stops' alpha), laid as nested
   level sets (svLevels) over the face's colour and under every wash, flame, blotch and band (inserted before the washes' group bg), so the light still
   models the zone */
const svCrossL=c=>Array.isArray(c)?typeof c[0][0]==='number'?[{st:c}]:c:[c];
function svCross(cg,bg,it,sh,front,Dm,Ls,tol){const hi=DET>=1.5,FF=sh.F.map(x=>it.s*x*3);
  for(const z of svCrossL(sh.mat.cross)){const f=(front?1:z.bk||0)*(z.k??1);if(f<=0)continue;const st=(z.st||z).map(([x,c,a])=>[x,c,a??1]).sort((a,b)=>a[0]-b[0]),ns=st.length,vw=z.v,
      par=G(cg),bl=z.soft===0?null:svBlur(Ls*(z.soft??.025)),X=[],W=[];cg.insertBefore(par,bg);
    for(let j=0;j<=sh.nv;j++)for(let i=0;i<=sh.nu;i++){const u=-1+2*i/sh.nu,v=j/sh.nv;let x=z.sg?u:Math.abs(u);if(z.tip!=null&&!z.sg&&v>z.tip)x=Math.max(x,(v-z.tip)/(1-z.tip));X.push(x);
      W.push(vw?svSm((v-vw[0])/((vw[1]-vw[0])||1e-6))*(vw.length>3?1-svSm((v-vw[2])/((vw[3]-vw[2])||1e-6)):1):1)}
    for(const c of new Set(st.map(s=>s[1]))){const Gc=X.map((x,q)=>{let a=0;if(x<=st[0][0])a=st[0][1]===c?st[0][2]:0;else if(x>=st[ns-1][0])a=st[ns-1][1]===c?st[ns-1][2]:0;
        else for(let i=0;i+1<ns;i++)if(x<=st[i+1][0]){const t=(x-st[i][0])/((st[i+1][0]-st[i][0])||1e-9);a=(st[i][1]===c?(1-t)*st[i][2]:0)+(st[i+1][1]===c?t*st[i+1][2]:0);break}
        return a*W[q]*f});svLevels(it,sh,Gc,FF,(z.n||[6,3])[hi?0:1],c,par,bl?Math.max(tol*2.5,Dm*.008):tol,bl)}}}
/* m.transmit: the light through the thin tissue (porteur, cymbidium: « les pétales ont de légères transparences », 4.8e): the margins and the thin zones
   brighter, as lit from behind; the piece stays opaque. The light through only LIGHTENS the piece's own colour (porteur, 2026-10-18: neither warmer nor
   more saturated): by default every layer is the face's own ramp (stops / bstops) lifted in lightness by lk (HSL: hue and saturation kept).
   {a, thin, dk, wr, n, lk, w, eo, ev, ep, en, tc, ec, bk, k}: lk [wash, edge] the share of the way to white of the lightness ([.4,.55]); tc, ec an explicit
   colour of the wash, of the edge (none by default; ec falls back on tc); bk on the back face (× the alphas, 1); k an overall factor.
   (a) a wash where the visible face turns from the light (its other face is lit: the light comes through), × a thinness map thin [t0, ku, kv]
   (1 - (1-t0)·(1-|u|)^ku·(1-v)^kv: t0 at the foot of the midrib, 1 at the margins and the tip; [.3,1.4,1.2]) at alpha a (none without it), whole once
   the face turns dk from the light (.5); wr: how far it reaches into the lit side (0: only where the face turns from the light; up to .4: the soft
   glow of a thin white even where it is half lit, never a grey flat, 3.7); n [zoom, normal] steps ([4,2]); softened as the washes, over them.
   (b) the edge light (w): a band of constant width w × D inside the margins and over the tip (the distance to the outline measured along the sheet in
   3D: never along the claw nor a fold), luminous at the edge and fading inward as (1-d/w)^ep (1.4) in en [zoom, normal] steps ([4,3]), from v = ev[0]
   to ev[1] on ([.06,.26]: the thick foot without it), at alpha eo[0] on the side toward the light down to eo[1] on the far side (a white gradient
   along the light's direction on the screen, in the mask, [.55,.2]): the hortensia's band of light (y3-hortensia.js) and the orchids' band edge + glow
   (above), for any svDraw piece; crisp, over the washes, under the veins and the rim */
function svTrans(cg,it,sh,front,Dm,Ls,tol){const t=sh.mat.transmit,hi=DET>=1.5,f=(front?1:t.bk??1)*(t.k??1);if(f<=0)return;const FF=sh.F.map(x=>it.s*x*3),nu=sh.nu,nv=sh.nv,W=sh.W,
    lk=Array.isArray(t.lk)?t.lk:t.lk!=null?[t.lk,t.lk]:[.4,.55],own=k=>svFaceFill(sh,(front?sh.mat.stops:sh.mat.bstops).map(([v,c,a])=>{const[h,s,l]=h2l(c);return[v,l2h(h,s,l+(1-l)*k),a]}),Dm);
  if(t.a){const th=t.thin||[.3,1.4,1.2],wr=t.wr||0,dk=(t.dk||.5)+wr,Ga=new Array(sh.P.length);for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const q=j*W+i,n=sh.F[q]>=0?sh.N[q]:V3.sc(sh.N[q],-1),
        tn=1-(1-th[0])*Math.pow(1-Math.abs(-1+2*i/nu),th[1])*Math.pow(1-j/nv,th[2]);Ga[q]=t.a*f*tn*Math.min(1,Math.max(0,wr-V3.dot(n,LIGHT))/dk)}
    if(Ga.some((x,q)=>x>.004&&FF[q]>0))svLevels(it,sh,Ga,FF,(t.n||[4,2])[hi?0:1],t.tc||own(lk[0]),cg,Math.max(tol*2.5,Dm*.008),svBlur(Ls*(sh.mat.soft??.05)))}
  if(t.w){/* the distance of every vertex to the margins (along its row) and to the tip (along its column), on the sheet in 3D; kept on the sheet for its other face */
    if(!sh.E){const P3=[],d3=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++)P3.push(sh.S(-1+2*i/nu,j/nv));const E2=new Float32Array(P3.length);
      for(let j=0;j<=nv;j++){const a=[0];for(let i=1;i<=nu;i++)a.push(a[i-1]+d3(P3[j*W+i],P3[j*W+i-1]));for(let i=0;i<=nu;i++)E2[j*W+i]=Math.min(a[i],a[nu]-a[i])}
      for(let i=0;i<=nu;i++){let b=0;for(let j=nv;j>=0;j--){if(j<nv)b+=d3(P3[j*W+i],P3[(j+1)*W+i]);if(b<E2[j*W+i])E2[j*W+i]=b}}sh.E=E2}
    const bw=Dm*t.w,eo=t.eo||[.55,.2],ev=t.ev||[.06,.26],Ge=Array.from(sh.E,(e,q)=>{const s=e/bw;return s>=1?0:eo[0]*f*Math.pow(1-s,t.ep??1.4)*svSm((Math.floor(q/W)/nv-ev[0])/((ev[1]-ev[0])||1e-6))});
    if(!Ge.some((x,q)=>x>.004&&FF[q]>0))return;
    const b=it.bb,cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2,r=Math.hypot(b[2]-b[0],b[3]-b[1])/2,ll=Math.hypot(LIGHT[0],LIGHT[1])||1,lx=LIGHT[0]/ll,ly=-LIGHT[1]/ll,id='sg'+(gid++),
      gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(cx-lx*r),y1:svF(cy-ly*r),x2:svF(cx+lx*r),y2:svF(cy+ly*r)},GDEF||defs);
    stops(gr,[[0,'white',svF(Math.min(1,eo[1]/(eo[0]||1)))],[1,'white',1]]);svLevels(it,sh,Ge,FF,(t.en||[4,3])[hi?0:1],t.ec||t.tc||own(lk[1]),cg,tol,null,`url(#${id})`)}}
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
    /* (m.cross: colour zones across the piece, under everything else: svCross above; none by default) */
    if(m.cross)svCross(cg,bg,it,sh,front,Dm,Ls,tol);
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
    /* (b.edge: the band hugs the piece's margin: sampled densely (48 points a side) so its spline never wanders inside the outline nor out of
       it (12 points drew a light line detached from the edge here and none there: orchid petals, BONNES-PRATIQUES 3.6b); the crisp stroke
       centred on the margin and clipped, its visible inner half b.w; its soft inner glow (b.glow x b.w) in the blurred washes; off by default) */
    if(m.band){const hi=DET>=1.5,b=m.band,ed=!!b.edge,ns=ed?48:12,pl=[];for(let q=0;q<=ns;q++)pl.push([-1,b.v0+(1-b.v0)*q/ns]);for(let q=1;q<2*ns;q++)pl.push([-1+q/ns,1]);for(let q=0;q<=ns;q++)pl.push([1,1-(1-b.v0)*q/ns]);
      let run=[],d='';const flush=()=>{if(run.length>2)d+=svSpl(run,false);run=[]};for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>-.02)run.push(svAt(sh,u,v));else flush()}flush();
      if(d){const w=Dm*b.w*(front?1:b.bk??.8);if(hi)E('path',{d,fill:'none',stroke:b.c,'stroke-width':svF(w*(ed?2*(b.glow??5):3.2)),'stroke-opacity':b.op*(ed?.45:.55),'stroke-linejoin':'round'},bg);
        E('path',{d,fill:'none',stroke:b.c,'stroke-width':svF(w*(ed?2:.8)),'stroke-opacity':b.op,'stroke-linejoin':'round'},cg)}}
/* blotches (browning tissue): soft spots at given (u,v), in the blurred washes */
    if(m.spots){for(const[u,v,r0,col,op]of m.spots){if(it.s*svLerp(sh,sh.F,u,v)<=0)continue;const p=svAt(sh,u,v),q=svAt(sh,Math.min(1,u+.12),v),rr=Math.max(.3,Math.hypot(q[0]-p[0],q[1]-p[1])*r0*8);
      E('path',{d:'M'+svJ([svR(p[0]-rr),svR(p[1])])+'a'+svJ([svR(rr),svR(rr*.7)])+' 0 1,0 '+svJ([svR(2*rr),0])+'a'+svJ([svR(rr),svR(rr*.7)])+' 0 1,0 '+svJ([svR(-2*rr),0]),fill:col,'fill-opacity':op},bg)}}
const hi=DET>=1.5;wash(hi?m.dark||[.92,.8,.68,.56,.44]:m.darkLo||m.dark||[.9,.76,.62],front?m.shade:m.bshade,hi?m.da??.2:m.daLo??m.da??.26,1);wash(hi?m.lit||[1.08,1.2]:m.litLo||m.lit||[1.1],front?m.lite:m.blite,hi?m.la??.22:m.laLo??m.la??.24,0);
    /* (m.transmit: the light through the thin tissue, over the washes and under the veins: svTrans above; none by default) */
    if(m.transmit)svTrans(cg,it,sh,front,Dm,Ls,tol);
    /* veins: their runs on this face only */
    if(m.veins&&(DET>=1||!o.small)){const VL=m.veins(sh,front);for(const[set,w,col,op,fl]of VL){let d='';for(const pl of set){let run=[];const flush=()=>{if(run.length>1)d+=svQuad(run);run=[]};
          for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>.03)run.push(svAt(sh,u,v));else flush()}flush()}
        if(d)E('path',{d,fill:'none',stroke:hi&&!fl?svFaceFill(sh,[[0,col,0],[.12,col,op],[.55,col,op*.75],[1,col,op*.3]],Dm):col,'stroke-opacity':fl?op:hi?1:op*.7,'stroke-width':svF(Dm*w),'stroke-linecap':'round','stroke-linejoin':'round'},cg)}}
    /* m.over(cg,it,sh,front,Dm): a sort's own layer over the washes and veins, under the rim, clipped to the piece (orchids: the tissue's grain); none by default */
    if(m.over)m.over(cg,it,sh,front,Dm);
    if(m.rw)E('use',{href:'#'+it.id,fill:'none',stroke:front?m.rim:m.brim||m.rim,'stroke-width':svF(Dm*m.rw),'stroke-opacity':m.ro??.4},cg);patch(it)}
  return k}
/* ---------- stems in SVG: a lit cylinder along any centre line ----------
   The outline; inside it, washes laid along the stem (the side away from the light darker, a soft highlight on the lit side, a thin gloss) blurred
   together and clipped; fine hairs standing out of the silhouette, leaning toward the flower; a tint toward the head (an anemone's stem reddens under
   its collar). A colour list carries its style in c.sv = {hair, hairK (spacing × width), hairL / hairA (length and angle from the stem, × 1), hairOp / hairFOp (opacity of the edge and face hairs), red, redF (where the tint starts, 0..1 toward the head), gloss}.
   Opt-in keys (all absent: the drawing above, to the byte). C[0] is the foot, C[n-1] the head's end (nodes.up -1 for the other way):
   - sv.nodes: swollen nodes inside the stem's own outline (the outline bulges smoothly), their flanks lit by the same light, a fine ring, an
     optional sheath of leaf bases; a list, a function or a generator (svNodeList, SVN_DEF, SVN_SH);
   - sv.section: 'round' (default), 'ribbed' (ribN ribs around the stem modulate its light and, very slightly, its outline: ribD, ribTw, ribA,
     ribPh), 'square' (two visible flat faces, each with its own light, lit edges: sqRot (.7), sqTw, edgeA, sqR), 'hollow' (the cut only: hollow, hollowC);
   - sv.bloom: a glaucous waxy veil, bluish, stronger on the lit side, rubbed off in a few streaks (a number = its opacity, or SVB_BLOOM's keys);
   - sv.join: a stem drawn in pieces (lsChainParts gives each piece C.j): the pieces meet cut square along a shared normal, the washes run on
     past the joined ends under one mask, blurred alike, and the swell is read from the page: nothing fades, narrows or rounds at a join.
   With any of them the ends are closed by half circles (no spike, BONNES-PRATIQUES 7.9). Chance only by hash (pxHashS) of sv.sd or of the
   stem's place; nothing is drawn outside the outline, which never grows beyond the nodes' swell. */
/* a node's defaults (× the local width w): sw the radius' swell at its peak, len the swell's length, sk where its peak is (-1 foot .. 1 head side),
   ring / ro / rw its ring line (colour, null: the shade c[0]; opacity; width), lip a lit line just above the ring (× ro), bow the ring's sag toward
   the foot (the stem seen a little from above), fk the light on the swell's two flanks, ra the ring's place (share of the half length, + toward the
   head; null: at the peak), rot0 the first leaf pair's turn around the stem (rad; then a quarter turn per node: decussate; rot fixes one node's),
   sheath: null or its keys (SVN_SH: len from the peak to the rim × w, t its thickness × w, wrap 1 a closed tube / less a slit between the leaves,
   ears × w: the rim rises into the leaf bases, c null = body lightened, a opacity, rim null = c[3], ro rim opacity, rw rim width × w, soft × w:
   how gently the sleeve's rim steps down to the stem) */
const SVN_DEF={sw:.3,len:1.5,sk:.2,ring:null,ro:.25,rw:.045,lip:.6,bow:.12,fk:.4,ra:null,rot0:.6,sheath:null};
const SVN_SH={len:.9,t:.045,wrap:1,ears:.2,c:null,a:.32,rim:null,ro:.45,rw:.04,soft:.22};
/* the bloom's defaults: a opacity, c its colour, lit (× a on the lit side), n rubbed streaks per 10 widths of length (lit half), so their opacity (× a),
   w their width (× w) */
const SVB_BLOOM={a:.3,c:'#c3d1d6',lit:1.2,n:1.5,so:1,w:.16};
/* the nodes along a whole stem (or chain) of length Lt: sv.nodes is a list [{s: share of the length | d: units, own keys}...], a function
   (Lt,C,W) -> such a list, or a generator {n, from, to (shares of the length) | d0, l (units: the first node, the first internode), k (each
   internode k × the one before it, counted from the ref end: < 1 shorter away from it), jit (hash jitter of the internodes, share), ref ('foot':
   C[0], 'head'), up (1: the head is at C[n-1]), sd (seed)} with the nodes' own keys (SVN_DEF). Each node: d (distance from C[0]), i (rank) */
function svNodeList(nd,Lt,C,W,sd){const base=Object.assign({},SVN_DEF,nd&&typeof nd==='object'&&!Array.isArray(nd)?nd:{}),hd=base.ref==='head',
    raw=typeof nd==='function'?nd(Lt,C,W):Array.isArray(nd)?nd:null,L=[],h=(i,k)=>pxHashS(i,k,base.sd??sd),jit=base.jit??.06,k=base.k??1;
  if(raw)raw.forEach((q,i)=>{const d=q.d!=null?q.d:(q.s??0)*Lt;L.push(Object.assign({},base,q,{d:hd?Lt-d:d,i}))});
  else{const n=base.n||0,P=[];if(base.l!=null){let d=base.d0??0,l=base.l;for(let i=0;i<n;i++){P.push(d);d+=l*(1+jit*(2*h(i,3)-1));l*=k}}
    else if(n>0){const a=base.from??.08,b=base.to??.9,ls=[];let l=1,s=0;for(let i=0;i<n-1;i++){ls.push(l*(1+jit*(2*h(i,3)-1)));s+=ls[i];l*=k}
      let d=a;for(let i=0;i<n;i++){P.push(d*Lt);if(i<n-1)d+=(b-a)*ls[i]/(s||1)}}
    P.forEach((d,i)=>L.push(Object.assign({},base,{d:hd?Lt-d:d,i})))}
  return L}
/* the centre line for the opt-in drawing: arc lengths S (of the line as given: the swell keeps its phase), both ends run on by e = 1.2 w (for the
   washes; the outline uses C[i0..i1]), a joined end of a piece (C.j = [point before, point after, where the piece starts along its chain, the
   chain's length, its mean width]) with the tangent shared with the neighbour, the line densified around the nodes (Catmull-Rom: the curve is
   kept). Returns {C,W,S,i0,i1,t0,t1 (end tangents), j0,j1 (joined ends),nodes,Lt,sd,sOff,sTot,Wc} */
function svStemPrep(C0,W0,sv,jn){const n0=C0.length,S0=[0];for(let i=1;i<n0;i++)S0.push(S0[i-1]+Math.hypot(C0[i][0]-C0[i-1][0],C0[i][1]-C0[i-1][1]));
  /* (a piece of a chain: its seed, lengths and width those of the whole chain, so its nodes, ribs and streaks go on across the joins) */
  const Lt=S0[n0-1],sOff=jn?jn[2]||0:0,sTot=jn&&jn[3]?jn[3]:Lt,sd=sv.sd??(jn?Math.round(sTot*7+(jn[4]||0)*131):Math.round(C0[0][0]*7+C0[0][1]*13)),nodes=[],zones=[],
    wAt=s=>{let i=1;while(i<n0-1&&S0[i]<s)i++;const t=Math.max(0,Math.min(1,(s-S0[i-1])/((S0[i]-S0[i-1])||1)));return W0[i-1]+(W0[i]-W0[i-1])*t};
  if(sv.nodes)for(const q of svNodeList(sv.nodes,sTot,C0,W0,sd)){const d=q.d-sOff,w=wAt(d),up=q.up??1,hl=q.len*w/2,p=Math.max(-.9,Math.min(.9,q.sk)),sw=q.sw,
      sh=q.sheath?Object.assign({},SVN_SH,q.sheath):null,top=p*hl+(sh?(sh.len+(sh.ears||0)+(sh.soft??.22)+.05)*w:0);
    /* the sheath stays inside the swell: thickness at most .45 sw, its flare into the leaf bases at most .85 sw with it */
    if(sh){sh.t=Math.min(sh.t,sw*.45);sh.fl=Math.min(.5*(sh.ears||0),Math.max(0,sw*.85-sh.t))}
    const a=up>0?d-hl*1.05:d-Math.max(hl,top)*1.05,b=up>0?d+Math.max(hl,top)*1.05:d+hl*1.05;if(b<-w||a>Lt+w)continue;
    nodes.push(Object.assign({},q,{d,w,up,hl,p,sh,rot:q.rot??q.rot0+q.i*Math.PI/2}));zones.push([a,b,w*.08])}
  const C=[C0[0]],W=[W0[0]],S=[0],cr=(i,t)=>{const p0=C0[Math.max(0,i-2)],p1=C0[i-1],p2=C0[i],p3=C0[Math.min(n0-1,i+1)],t2=t*t,t3=t2*t;
      return[0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3))};
  for(let i=1;i<n0;i++){const a=S0[i-1],b=S0[i],L=b-a;if(L>0)for(const[za,zb,st]of zones){if(zb<=a||za>=b)continue;const x1=Math.min(b,zb);
      for(let s=Math.ceil(Math.max(a,za)/st)*st;s<x1;s+=st){if(s<=a+st*.3||s>=b-st*.3||S[S.length-1]>=s-st*.3)continue;const t=(s-a)/L;C.push(cr(i,t));W.push(W0[i-1]+(W0[i]-W0[i-1])*t);S.push(s)}}
    C.push(C0[i]);W.push(W0[i]);S.push(b)}
  let i0=0,i1=C.length-1,t0=null,t1=null;const e=W0.reduce((x,y)=>x+y,0)/n0*1.2,nz=v=>{const l=Math.hypot(v[0],v[1])||1;return[v[0]/l,v[1]/l]};
  if(jn&&jn[0])t0=nz([C0[1][0]-jn[0][0],C0[1][1]-jn[0][1]]);if(jn&&jn[1])t1=nz([jn[1][0]-C0[n0-2][0],jn[1][1]-C0[n0-2][1]]);
  /* both ends run on (a free end too: the washes and the veil then also cover its half-circle cap) */
  const u0=t0||nz([C0[1][0]-C0[0][0],C0[1][1]-C0[0][1]]),u1=t1||nz([C0[n0-1][0]-C0[n0-2][0],C0[n0-1][1]-C0[n0-2][1]]);
  C.unshift([C0[0][0]-u0[0]*e,C0[0][1]-u0[1]*e]);W.unshift(W0[0]);S.unshift(-e);i0=1;i1++;C.push([C0[n0-1][0]+u1[0]*e,C0[n0-1][1]+u1[1]*e]);W.push(W0[n0-1]);S.push(Lt+e);
  return{C,W,S,i0,i1,t0:t0||u0,t1:t1||u1,j0:!!t0,j1:!!t1,nodes,Lt,sd,sOff,sTot,Wc:jn&&jn[4]||0}}
/* a node's extra radius (share of the half width) at arc length s: the swell, a bell of length 2 hl with its peak at p, C2 at both ends (no kink),
   plus its sheath's sleeve rising over the swell's head side, ending at the rim (higher at the sides where a leaf leaves: ears × sin² rot),
   flaring a little into the leaf bases there */
function svNodeK(q,s){const u=(s-q.d)*q.up/q.hl;let r=0;if(u>-1&&u<1){const t=u<q.p?(u-q.p)/(1+q.p):(u-q.p)/(1-q.p),b=1-t*t;r=q.sw*b*b*b}
  const sh=q.sh;if(sh){const w=q.w,sg=(s-q.d)*q.up,s0=q.p*q.hl,sr2=Math.pow(Math.sin(q.rot),2),er=sh.ears*w*sr2,sr=s0+sh.len*w+er;
    if(sg>s0&&sg<sr+sh.soft*w){const rise=svSm((sg-s0)/Math.max(1e-6,(1-q.p)*q.hl)),fall=1-svSm((sg-sr)/(sh.soft*w)),fl=er>0?sh.fl*sr2*svSm((sg-s0-sh.len*w*.6)/Math.max(1e-6,sh.len*w*.4+er)):0;r+=(sh.t+fl)*rise*fall}}
  return r}
function svStemLine(par,C0,Wd1,c){const g=G(par);if(C0.length<2)return g;const sv=c.sv||{},sec=sv.section,jn=sv.join&&C0.j||null,
    X=!!(sv.nodes||sec==='ribbed'||sec==='square'||sv.bloom||jn),pr=X?svStemPrep(C0,Wd1,sv,jn):null,C=X?pr.C:C0,Wd0=X?pr.W:Wd1,n=C.length,T=[],N=[],ph=(C0[0][0]*.37+C0[0][1]*.11)%6.28;
  /* a slow swell of the width along the stem (a living stem is never a ruled tube); joined pieces read it from the page (continuous at a join) */
  let acc0=0;const Wd=Wd0.map((w,i)=>{if(X){if(jn){const s=(C[i][1]+C[i][0]*.3)/w;return w*(1+(sv.swell??.05)*Math.sin(s/9)+.025*Math.sin(s/3.1))}acc0=pr.S[i]}
    else if(i)acc0+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);return w*(1+(sv.swell??.05)*Math.sin(acc0/(w*9)+ph)+.025*Math.sin(acc0/(w*3.1)+ph*2))});
  for(let i=0;i<n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;T.push([dx/l,dy/l]);N.push([-dy/l,dx/l])}
  /* (opt-in) the shared tangent at a joined end; the half widths of each side: the nodes' swell and sheath, the ribs' ripple (the silhouette
     falls on a rib or in a groove as they turn round the stem) */
  let hA=null,hB=null,rPh=null;if(X){const fix=(i,t)=>{T[i]=t;N[i]=[-t[1],t[0]]};fix(0,pr.t0);fix(1,pr.t0);fix(n-1,pr.t1);fix(n-2,pr.t1)
    hA=[];hB=[];const rib=sec==='ribbed',rn=sv.ribN||10,rd=sv.ribD??.035,W1=pr.Wc||Wd.reduce((a,b)=>a+b,0)/n;if(rib)rPh=pr.S.map(s=>(sv.ribPh??pxHashS(1,9,pr.sd)*6.28)+(sv.ribTw??.012)*(s+pr.sOff)/W1);
    for(let i=0;i<n;i++){let k=1;for(const q of pr.nodes)k+=svNodeK(q,pr.S[i]);const w=Wd[i]/2*k;
      hA.push(rib?w*(1-rd*(1-Math.cos(rn*(Math.PI/2-rPh[i])))/2):w);hB.push(rib?w*(1-rd*(1-Math.cos(rn*(-Math.PI/2-rPh[i])))/2):w)}}
  const lt=[LIGHT[0],-LIGHT[1]],ll=Math.hypot(lt[0],lt[1]),L=[lt[0]/ll,lt[1]/ll],kk=N.map(q=>Math.max(-1,Math.min(1,(q[0]*L[0]+q[1]*L[1])*2.5))),
    off=(f0,f1,ia=0,ib=n-1)=>{const A=[],B2=[];for(let i=ia;i<=ib;i++){const s=kk[i],w=hA?(f0*s>0?hA[i]:hB[i]):Wd[i]/2,w1=hA?(f1*s>0?hA[i]:hB[i]):w,o0=w*f0*s,o1=w1*f1*s;A.push([C[i][0]+N[i][0]*o0,C[i][1]+N[i][1]*o0]);B2.push([C[i][0]+N[i][0]*o1,C[i][1]+N[i][1]*o1])}return A.concat(B2.reverse())},
    line=f0=>{const A=[];for(let i=0;i<n;i++){const o0=(hA?(f0>0?hA[i]:hB[i]):Wd[i]/2)*f0;A.push([C[i][0]+N[i][0]*o0,C[i][1]+N[i][1]*o0])}return A},
    /* (joined pieces: the striations and washes simplified 3 times finer, else their lines jog at a join) */
    tol=Math.max(.04,Math.min(...Wd)*(jn?.015:.05)),W0=Wd.reduce((a,b)=>a+b,0)/n;
  const ct=sv.cut!=null;let od,out=null;
  if(!X){out=[];for(let i=0;i<n;i++)out.push([C[i][0]+N[i][0]*Wd[i]/2,C[i][1]+N[i][1]*Wd[i]/2]);for(let i=n-1;i>=0;i--)out.push([C[i][0]-N[i][0]*Wd[i]/2,C[i][1]-N[i][1]*Wd[i]/2]);
  /* a cut stem (sv.cut: the slant of the cut, as a tangent): its first end C[0] cut straight across or slanted, never rounded; a pale lip on the cut */
    if(ct){const s=sv.cut*Wd[0]/2,m=out.length-1;out[0]=[out[0][0]+T[0][0]*s,out[0][1]+T[0][1]*s];out[m]=[out[m][0]-T[0][0]*s,out[m][1]-T[0][1]*s]}
    od=ct?svSpl(svSimp(out,tol),false)+'Z':svSpl(svSimp(out,tol))}
  else{/* (opt-in) each side an open spline; each end cut square (a join: the far end running .2 w over the next piece), slanted (sv.cut) or closed
     by a half circle tangent to both sides */
    const i0=pr.i0,i1=pr.i1,sA=[],sB=[];for(let i=i0;i<=i1;i++){sA.push([C[i][0]+N[i][0]*hA[i],C[i][1]+N[i][1]*hA[i]]);sB.push([C[i][0]-N[i][0]*hB[i],C[i][1]-N[i][1]*hB[i]])}
    if(pr.j1){const o=W0*.2,t=pr.t1;sA.push([sA[sA.length-1][0]+t[0]*o,sA[sA.length-1][1]+t[1]*o]);sB.push([sB[sB.length-1][0]+t[0]*o,sB[sB.length-1][1]+t[1]*o])}
    if(ct&&!pr.j0){const s=sv.cut*Wd[i0]/2;sA[0]=[sA[0][0]+T[i0][0]*s,sA[0][1]+T[i0][1]*s];sB[0]=[sB[0][0]-T[i0][0]*s,sB[0][1]-T[i0][1]*s]}
    /* (a finer tolerance than the washes': the swell and the sheath's step are small beside the width, simplified away they make corners) */
    const tO=Math.max(.04,Math.min(...Wd)*.01),pA=sA[0],a=svSpl(svSimpO(sA,tO),false);sB.reverse();const pB=sB[0],b=svSpl(svSimpO(sB,tO),false),bc=b.slice(1+b.slice(1).search(/[a-zA-Z]/)),
      cap=(r,p)=>'A'+svJ([svR(r),svR(r)])+' 0 0 0 '+svJ([svR(p[0]),svR(p[1])]);
    od=a+(pr.j1?'L'+b.slice(1):cap((hA[i1]+hB[i1])/2,pB)+bc)+(pr.j0||ct?'Z':cap((hA[i0]+hB[i0])/2,pA)+'Z')}
  /* (a joined piece: the body and everything over it painted as one layer under one mask, so the piece drawn later meets the other along a single
     anti-aliased edge: two layers cut by the same clip left a light hairline at every join; the washes' blur from the chain's mean width, C.j[4],
     the same for every piece: a blur per piece left a step of light at each join) */
  const jm=X&&jn&&!LOD&&!(sv.lean&&DET<1.5);if(!jm)E('path',{d:od,fill:c[1]},g);if(LOD)return g;
  /* sv.lean (a plant's stem seen whole, below DET 1.5): one shaded wash inside the outline (no clip, no blur) instead of two, no gloss stripe,
     no tint toward the head */
  /* (opt-in) a band wider than the stem over the whole run-on line: what fills the stem inside its clip or mask is cut by it alone (a fill along
     the outline's own edge, under the same edge, is anti-aliased twice: a line at every join, a rim on the silhouette) */
  const wide=X?(f=1.3)=>{const A=[],B=[];for(let i=0;i<n;i++){A.push([C[i][0]+N[i][0]*hA[i]*f,C[i][1]+N[i][1]*hA[i]*f]);B.push([C[i][0]-N[i][0]*hB[i]*f,C[i][1]-N[i][1]*hB[i]*f])}return svSpl(svSimp(A.concat(B.reverse()),tol))}:null;
  const lean=sv.lean&&DET<1.5;let cg=g,bg=g;if(jm){const id='sm'+(gid++);E('path',{d:od,fill:'#fff'},E('mask',{id,maskUnits:'userSpaceOnUse'},GDEF||defs));cg=G(g,{mask:`url(#${id})`});E('path',{d:wide(),fill:c[1]},cg);bg=G(cg,{filter:svBlur((jn[4]||W0)*.16)})}
  else if(!lean){const id='sc'+(gid++);E('path',{d:od},E('clipPath',{id},GDEF||defs));cg=G(g,{'clip-path':`url(#${id})`});bg=G(cg,{filter:svBlur(W0*.16)})}
  if(sec==='square')svStemSquare(cg,bg,C,N,hA,hB,c,sv,pr,W0,tol,lean);
  else{E('path',{d:svSpl(svSimp(lean?off(-.97,-.3):off(-1.4,-.25),tol)),fill:c[0],'fill-opacity':lean?.7:.85},bg);if(!lean)E('path',{d:svSpl(svSimp(off(-1.4,-.68),tol)),fill:c[0],'fill-opacity':.6},bg);
    E('path',{d:svSpl(svSimp(lean?off(.1,.55):off(.02,.62),tol)),fill:c[2],'fill-opacity':lean?.55:.8},bg);if(!lean)E('path',{d:svSpl(svSimp(off(.18,.42),tol)),fill:c[3],'fill-opacity':sv.gloss??.5},bg)}
  if(X&&pr.nodes.length&&!lean&&DET>=1.5)svNodeFlanks(bg,C,T,c,pr,L,off,tol);
  if(X&&sv.bloom)svStemBloom(cg,bg,lean?od:wide(),C,N,T,hA,hB,c,sv,pr,L,off,tol,W0,lean);
  if(sec==='ribbed'&&!lean)svStemRibs(cg,C,N,hA,hB,c,sv,pr,rPh,W0,tol);
  /* fine striations along the stem (its ribs), darker on the shaded side */
  if(sv.ribs&&DET>=1){let d='';for(const f0 of sv.ribs)d+=svSpl(svSimpO(line(f0),tol),false);E('path',{d,fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.06,W0*.05)),'stroke-opacity':.28},cg)}
  if(X&&pr.nodes.length)svNodeRings(cg,bg,C,N,T,hA,hB,c,pr,lean);
  if(ct){const i0=X?pr.i0:0,s=sv.cut*Wd[i0]/2,a=X?[C[i0][0]+N[i0][0]*hA[i0]+T[i0][0]*s,C[i0][1]+N[i0][1]*hA[i0]+T[i0][1]*s]:out[0],b=X?[C[i0][0]-N[i0][0]*hB[i0]-T[i0][0]*s,C[i0][1]-N[i0][1]*hB[i0]-T[i0][1]*s]:out[out.length-1];
    E('path',{d:'M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])]),fill:'none',stroke:sv.cutC||'#dde6c4','stroke-width':svF(Wd[i0]*.34),'stroke-opacity':.9},cg);
    /* section 'hollow': the hollow seen in the cut, a dark core (sv.hollow: its share of the width) in the middle of the pale lip */
    if(sec==='hollow'){const k=sv.hollow??.55,u=[a[0]+(b[0]-a[0])*(.5-k/2),a[1]+(b[1]-a[1])*(.5-k/2)],v=[a[0]+(b[0]-a[0])*(.5+k/2),a[1]+(b[1]-a[1])*(.5+k/2)];
      E('path',{d:'M'+svJ([svR(u[0]),svR(u[1])])+'L'+svJ([svR(v[0]),svR(v[1])]),fill:'none',stroke:sv.hollowC||'#2f3a2a','stroke-width':svF(Wd[i0]*.2),'stroke-opacity':.85,'stroke-linecap':'round'},cg)}}
  /* the tint toward the head (only where a whole stem is drawn in one piece) */
  if(sv.red&&!lean){const a=C[X?pr.i0:0],b=C[X?pr.i1:n-1],gid2='sg'+(gid++),gr=E('linearGradient',{id:gid2,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
    const f0=sv.redF??.75;stops(gr,[[0,sv.red,0],[f0,sv.red,0],[1,sv.red,sv.redA??.45]]);E('path',{d:od,fill:`url(#${gid2})`},cg)}
  /* silky hairs pressed along the stem, leaning toward its end: many, fine, short, half transparent; on the silhouette they stand a little out of it, on the
     face they catch the light as a sheen */
  if(sv.hair){let de='',df='';const step=W0*(sv.hairK??.7)*(DET>=1.5?.6:1.2),h0=X?pr.i0:0,h1=X?pr.i1:n-1;let acc=0,k=0;for(let i=h0+1;i<=h1;i++){const sl=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);acc+=sl;while(acc>=step){acc-=step;k++;/* hairI: each hair at its own place along the segment (a continuous fur), not all at its end */const u=sv.hairI&&sl>0?Math.min(1,acc/sl):0,X=[C[i][0]+(C[i-1][0]-C[i][0])*u,C[i][1]+(C[i-1][1]-C[i][1])*u];
      const w=Wd[i]/2,r1=pxHashS(k,3,n),r2=pxHashS(k,5,n),r3=pxHashS(k,7,n);
      for(const s of[1,-1]){const h=w*(.35+.4*r1)*(sv.hairL??1),q=[X[0]+N[i][0]*w*s*(.82+.1*r2),X[1]+N[i][1]*w*s*(.82+.1*r2)],a=(.22+.3*r3)*(sv.hairA??1),dir=[N[i][0]*s*a+T[i][0],N[i][1]*s*a+T[i][1]],dl=Math.hypot(dir[0],dir[1]);
        de+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(dir[0]/dl*h),svR(dir[1]/dl*h)])}
      if(DET>=1.5&&r1<.6){const o=(r2*2-1)*.7*w,q=[X[0]+N[i][0]*o,X[1]+N[i][1]*o],h=w*(.3+.3*r3);df+='M'+svJ([svR(q[0]),svR(q[1])])+'l'+svJ([svR(T[i][0]*h),svR(T[i][1]*h)])}}}
    if(de)E('path',{d:de,fill:'none',stroke:sv.hair,'stroke-width':svF(Math.max(.04,W0*.026)),'stroke-opacity':sv.hairOp??.38,'stroke-linecap':'round'},g);
    if(df)E('path',{d:df,fill:'none',stroke:sv.hair,'stroke-width':svF(Math.max(.04,W0*.022)),'stroke-opacity':sv.hairFOp??.1,'stroke-linecap':'round'},cg)}
  /* a kind's own surface marks (lenticels, nodes of a woody stem): sv.post(g, clipped group, centre line, widths, normals, tangents, mean width) */
  if(sv.post){if(X){const q=a=>a.slice(pr.i0,pr.i1+1);sv.post(g,cg,q(C),q(Wd),q(N),q(T),W0)}else sv.post(g,cg,C,Wd,N,T,W0)}
  return g}
/* ---- the opt-in parts of svStemLine (nodes, sections, bloom) ---- */
/* the stem's point, normal, tangent and half widths at arc length s (interpolated on the drawn line) */
function svStemAt(C,N,hA,hB,S,s){let i=1;const n=C.length;while(i<n-1&&S[i]<s)i++;const t=Math.max(0,Math.min(1,(s-S[i-1])/((S[i]-S[i-1])||1))),l=(a,b)=>a+(b-a)*t,
    nn=[l(N[i-1][0],N[i][0]),l(N[i-1][1],N[i][1])],nl=Math.hypot(nn[0],nn[1])||1,m=[nn[0]/nl,nn[1]/nl];
  return{p:[l(C[i-1][0],C[i][0]),l(C[i-1][1],C[i][1])],n:m,t:[m[1],-m[0]],a:l(hA[i-1],hA[i]),b:l(hB[i-1],hB[i])}}
/* a point x (-1..1 of the half widths, + toward N) across the stem at q (svStemAt) */
const svAcross=(q,x)=>{const w=(x>0?q.a:q.b)*x;return[q.p[0]+q.n[0]*w,q.p[1]+q.n[1]*w]};
/* a thin lens across the stem at arc length s (a ring, a rim): its middle sags toward the foot by bow × w, its ends taper to nothing; rise(x)
   lifts it toward the head (× w: the sheath's rim climbing into the leaf bases). Path data */
function svLensD(C,N,hA,hB,S,s,up,w,bow,th,rise,x0=-1,x1=1){const q=svStemAt(C,N,hA,hB,S,s),A=[],B=[],m=DET>=1.5?8:5;
  for(let k=0;k<=m;k++){const x=x0+(x1-x0)*k/m,sg=-bow*w*Math.sqrt(Math.max(0,1-x*x))+(rise?rise(x)*w:0),t=th*w*Math.pow(Math.max(0,1-x*x),.6)/2,
      c=svAcross(q,x*.985),d=[q.t[0]*up,q.t[1]*up];A.push([c[0]+d[0]*(sg+t),c[1]+d[1]*(sg+t)]);B.push([c[0]+d[0]*(sg-t),c[1]+d[1]*(sg-t)])}
  return svSpl(A.concat(B.reverse()))}
/* the light on the nodes' flanks: the flank turned toward the light along the stem a little lighter, the other darker (soft: in the blurred washes) */
function svNodeFlanks(bg,C,T,c,pr,L,off,tol){let dl='',dd='',a=0;const S=pr.S,n=C.length,idx=s=>{let i=0;while(i<n-1&&S[i]<s)i++;return i},
    band=(r,f0,f1)=>{const ia=idx(r[0]),ib=Math.min(n-1,Math.max(ia+1,idx(r[1])));return svSpl(svSimp(off(f0,f1,ia,ib),tol))};
  for(const q of pr.nodes){const i=idx(q.d),lT=(T[i][0]*L[0]+T[i][1]*L[1])*q.up,s0=q.d+q.up*q.p*q.hl,s1=q.d-q.up*q.hl,s2=q.d+q.up*q.hl,
      lo=[Math.min(s1,s0),Math.max(s1,s0)],hi=[Math.min(s0,s2),Math.max(s0,s2)];dl+=band(lT>=0?hi:lo,-.5,1.4);dd+=band(lT>=0?lo:hi,-1.4,.6);a+=Math.abs(lT)*q.fk}
  a/=pr.nodes.length;if(dl)E('path',{d:dl,fill:c[2],'fill-opacity':svF(Math.min(.6,a*.5))},bg);if(dd)E('path',{d:dd,fill:c[0],'fill-opacity':svF(Math.min(.5,a*.45))},bg)}
/* each node's ring (where the leaves are inserted: a fine tapered line, half transparent, never a dark outline) and its lit lip; the sheath of leaf
   bases above it: a paler sleeve, its rim (rising into the leaf bases), its slit if it does not close. At DET 1: rings and rims only */
function svNodeRings(cg,bg,C,N,T,hA,hB,c,pr,lean){const hi=DET>=1.5&&!lean,S=pr.S,q0=pr.nodes[0];let dr='',dp='',ds='',dm='',dsl='',sa=0,sro=0,ns=0,sh0=null;
  for(const q of pr.nodes){const w=q.w,up=q.up,sr=q.d+up*q.hl*(q.ra??q.p);dr+=svLensD(C,N,hA,hB,S,sr,up,w,q.bow,q.rw);if(hi)dp+=svLensD(C,N,hA,hB,S,sr+up*q.rw*w*.9,up,w,q.bow,q.rw*.55);
    const sh=q.sh;if(!sh)continue;sh0=sh0||sh;const s0=q.d+up*q.p*q.hl,s1=s0+up*sh.len*w,rot=q.rot,er=sh.ears||0,
      rise=x=>er*Math.pow(Math.cos(Math.asin(Math.max(-1,Math.min(1,x)))-rot),2),rimAt=x=>svStemAt(C,N,hA,hB,S,s1+up*(rise(x)-q.bow*Math.sqrt(Math.max(0,1-x*x)))*w);
    /* the slit (wrap < 1): centred between the two leaves, drawn where it faces the viewer */
    let gap=null;if(sh.wrap<1){const g0=Math.PI*(1-sh.wrap);let ts=((rot+Math.PI/2)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(ts)>Math.PI/2)ts+=ts>0?-Math.PI:Math.PI;
      const a=Math.max(-Math.PI/2,ts-g0),b=Math.min(Math.PI/2,ts+g0);if(b>a)gap=[Math.sin(a),Math.sin(b)]}
    const spans=gap?[[-1,gap[0]],[gap[1],1]].filter(r=>r[1]-r[0]>.05):[[-1,1]];
    if(hi){const a=svStemAt(C,N,hA,hB,S,s0-up*.25*q.hl);for(const[x0,x1]of spans){const A=[],B=[];for(let j=0;j<=8;j++){const x=x0+(x1-x0)*j/8;A.push(svAcross(a,x));B.push(svAcross(rimAt(x),x))}ds+=svSpl(A.concat(B.reverse()))}
      if(gap)for(const x of gap)if(x>-.98&&x<.98){const p=svAcross(svStemAt(C,N,hA,hB,S,s0),x),r=svAcross(rimAt(x),x);dsl+='M'+svJ([svR(p[0]),svR(p[1])])+'L'+svJ([svR(r[0]),svR(r[1])])}}
    for(const[x0,x1]of spans)dm+=svLensD(C,N,hA,hB,S,s1,up,w,q.bow,sh.rw,rise,x0,x1);sa+=sh.a;sro+=sh.ro;ns++}
  if(ds)E('path',{d:ds,fill:sh0.c||mix(c[1],c[3],.3),'fill-opacity':svF(sa/ns)},bg);
  if(dr)E('path',{d:dr,fill:q0.ring||c[0],'fill-opacity':svF(q0.ro)},cg);if(dp)E('path',{d:dp,fill:c[3],'fill-opacity':svF(q0.ro*q0.lip)},cg);
  if(dsl)E('path',{d:dsl,fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.04,q0.w*.03)),'stroke-opacity':.35,'stroke-linecap':'round'},cg);
  if(dm)E('path',{d:dm,fill:sh0.rim||c[3],'fill-opacity':svF(sro/ns)},cg)}
/* the glaucous bloom: a bluish waxy veil over the whole stem (vd: a band wider than the stem, cut by its clip; lean: the outline), stronger on
   the lit side (blurred), rubbed off in a few soft streaks along the stem
   where the green shows through, a few denser ones (hash-placed, mostly on the lit side where the wax shows). At DET 1: the two veils */
function svStemBloom(cg,bg,vd,C,N,T,hA,hB,c,sv,pr,L,off,tol,W0,lean){const b=Object.assign({},SVB_BLOOM,typeof sv.bloom==='object'?sv.bloom:{a:sv.bloom}),S=pr.S;
  E('path',{d:vd,fill:b.c,'fill-opacity':svF(b.a*.5)},cg);if(lean)return;
  E('path',{d:svSpl(svSimp(off(-.15,1.4),tol)),fill:b.c,'fill-opacity':svF(Math.min(.9,b.a*.6*b.lit))},bg);
  /* (along the whole chain for a joined piece: each piece draws the part of each streak it carries) */
  if(DET<1.5||!(b.n>0))return;const s0=-pr.sOff,Ls=pr.sTot,m=Math.max(1,Math.round(Ls/((pr.Wc||W0)*10)*b.n)),sd=pr.sd,sMin=S[0],sMax=S[S.length-1];let d1='',d2='';
  /* each streak a spindle along the stem (its width b.w × w at most, tapering to both ends), a little askew */
  for(let k=0;k<m;k++){const h=j=>pxHashS(k,j,sd+71),a=s0+h(1)*Ls,len=W0*(1+2.5*h(2)),x=-.05+.85*h(3),dx=(h(4)-.5)*.2,ww=b.w*(.6+.6*h(6)),A=[],B=[];
    for(let j=0;j<=6;j++){const t=j/6,s=Math.min(s0+Ls,a+len*t);if(s<sMin||s>sMax)continue;const q=svStemAt(C,N,hA,hB,S,s),sg=q.n[0]*L[0]+q.n[1]*L[1]>=0?1:-1,xc=x+dx*t,hw=ww*Math.pow(Math.sin(Math.PI*t),.8);
      A.push(svAcross(q,Math.max(-.95,Math.min(.95,xc+hw))*sg));B.push(svAcross(q,Math.max(-.95,Math.min(.95,xc-hw))*sg))}
    if(A.length<2)continue;const dd=svSpl(A.concat(B.reverse()));if(h(5)<.7)d1+=dd;else d2+=dd}
  const sg=G(cg,{filter:svBlur(W0*.07)});if(d1)E('path',{d:d1,fill:c[1],'fill-opacity':svF(Math.min(.9,b.a*b.so))},sg);
  if(d2)E('path',{d:d2,fill:b.c,'fill-opacity':svF(Math.min(.9,b.a*b.so*.8))},sg)}
/* the cylinder's light at angle th around the stem (0: facing the viewer, + toward N), as svLight's wrapped diffuse (0..1) */
const svRingLit=(Ni,th)=>Math.max(0,(V3.dot([Math.sin(th)*Ni[0],-Math.sin(th)*Ni[1],Math.cos(th)],LIGHT)+.3)/1.3);
/* section 'ribbed': ribN ribs round the stem (turning slowly by ribTw rad per width of length from ribPh), each crest a fine light line, each
   groove a fine dark one, their strength from the light where they face (3 classes); foreshortened toward the silhouette. At DET 1: the grooves */
function svStemRibs(cg,C,N,hA,hB,c,sv,pr,rPh,W0,tol){const rn=sv.ribN||10,ra=sv.ribA??.55,hi=DET>=1.5,cr=['','',''],gr=['','',''],k2=hi?3:1,TP=2*Math.PI;
  for(let k=0;k<rn;k++)for(const o of hi?[0,.5]:[.5]){let run=[],li=0;const flush=()=>{if(run.length>2){const cl=Math.min(k2-1,Math.floor(li/run.length*k2));(o?gr:cr)[cl]+=svSpl(svSimpO(run,tol*.6),false)}run=[];li=0};
    for(let i=pr.i0;i<=pr.i1;i++){const th=((rPh[i]+TP*(k+o)/rn)%TP+TP*1.5)%TP-Math.PI;if(Math.cos(th)<.12){flush();continue}const x=Math.sin(th),w=(x>0?hA[i]:hB[i])*x;
      run.push([C[i][0]+N[i][0]*w,C[i][1]+N[i][1]*w]);li+=svRingLit(N[i],th)}flush()}
  const rg=G(cg,{filter:svBlur(W0*.035)});for(let q=0;q<k2;q++){const I=k2>1?(q+.5)/k2:.5;
    if(gr[q])E('path',{d:gr[q],fill:'none',stroke:c[0],'stroke-width':svF(Math.max(.05,W0*.06)),'stroke-opacity':svF(ra*(.3+.4*(1-I)))},rg);
    if(cr[q])E('path',{d:cr[q],fill:'none',stroke:c[3],'stroke-width':svF(Math.max(.05,W0*.05)),'stroke-opacity':svF(ra*.6*I)},rg)}}
/* section 'square': four edges round the stem at sqRot rad (default .7: two faces of clearly different light) + sqTw rad per width of length; the two visible faces flat, each one colour from its own
   light (a gradient along the stem as the stem bends), the edge between them and the lit silhouette edge catch a fine line of light (edgeA),
   the faces' meeting a little rounded (sqR × w of blur). Drawn under the blurred group (the nodes' flanks and the bloom over them) */
function svStemSquare(cg,bg,C,N,hA,hB,c,sv,pr,W0,tol,lean){const S=pr.S,i0=pr.i0,i1=pr.i1,hp=Math.PI/2,ea=sv.edgeA??.5,
    psi=i=>{const v=(sv.sqRot??.7)+(sv.sqTw??0)*(S[i]+pr.sOff)/(pr.Wc||W0);return(v%hp+hp)%hp},xe=i=>{const t=psi(i)+Math.PI/4;return-Math.cos(t)/Math.sin(t)},
    col=I=>I<.45?mix(c[0],c[1],I/.45):I<.85?mix(c[1],c[2],(I-.45)/.4):mix(c[2],c[3],Math.min(1,(I-.85)/.3)),
    sq=G(cg,lean?{}:{filter:svBlur(W0*(sv.sqR??.05))});cg.insertBefore(sq,bg===cg?null:bg);
  const K=8,smp=[];for(let k=0;k<=K;k++){const i=Math.round(i0+(i1-i0)*k/K),p=psi(i);smp.push([i,svRingLit(N[i],p-hp),svRingLit(N[i],p)])}
  const a=C[i0],b=C[i1],dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy||1,face=(xa,xb,f)=>{const A=[],B=[];for(let i=0;i<C.length;i++){const qa=xa(i),qb=xb(i),wa=(qa>0?hA[i]:hB[i])*qa,wb=(qb>0?hA[i]:hB[i])*qb;
        A.push([C[i][0]+N[i][0]*wa,C[i][1]+N[i][1]*wa]);B.push([C[i][0]+N[i][0]*wb,C[i][1]+N[i][1]*wb])}
      let fill;if(lean)fill=col(smp.reduce((s,q)=>s+q[f],0)/smp.length);else{const id='sg'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
        stops(gr,smp.map(([i,...I])=>[svF(Math.max(0,Math.min(1,((C[i][0]-a[0])*dx+(C[i][1]-a[1])*dy)/l2))),col(I[f-1])]).sort((p,q)=>p[0]-q[0]));fill=`url(#${id})`}
      E('path',{d:svSpl(svSimp(A.concat(B.reverse()),tol)),fill},sq)},lim=lean?1:1.05;
  face(()=>-lim,xe,1);face(xe,()=>lim,2);if(lean)return;
  /* the edges: between the faces, then the silhouette edge of the lit face */
  let de='',dsil='';const IL=smp.reduce((s,q)=>s+q[1],0)/smp.length,IR=smp.reduce((s,q)=>s+q[2],0)/smp.length;let run=[];
  const flush=()=>{if(run.length>2)de+=svSpl(svSimpO(run,tol*.6),false);run=[]};for(let i=i0;i<=i1;i++){const x=xe(i);if(x<-.96||x>.96){flush();continue}const w=(x>0?hA[i]:hB[i])*x;run.push([C[i][0]+N[i][0]*w,C[i][1]+N[i][1]*w])}flush();
  const xs=IR>=IL?.93:-.93;for(let i=i0;i<=i1;i++){const w=(xs>0?hA[i]:hB[i])*xs;run.push([C[i][0]+N[i][0]*w,C[i][1]+N[i][1]*w])}if(run.length>2)dsil=svSpl(svSimpO(run,tol*.6),false);
  if(de)E('path',{d:de,fill:'none',stroke:c[3],'stroke-width':svF(Math.max(.05,W0*.06)),'stroke-opacity':svF(ea*Math.max(IL,IR))},sq);
  if(dsil)E('path',{d:dsil,fill:'none',stroke:c[2],'stroke-width':svF(Math.max(.05,W0*.05)),'stroke-opacity':svF(ea*.6*Math.max(IL,IR))},sq)}
/* the shared stem drawers hand a styled stem to svStemLine: a cubic (stem3) or a polyline with widths (stemPoly) */
function svStem3(par,P,w0,w1,c,n){const C=[],W=[],m=Math.max(10,n*2);for(let i=0;i<=m;i++){const t=i/m,u=1-t,q=[0,1].map(j=>u*u*u*P[0][j]+3*u*u*t*P[1][j]+3*u*t*t*P[2][j]+t*t*t*P[3][j]);C.push(q);W.push(w0+(w1-w0)*t)}return svStemLine(par,C,W,c)}
