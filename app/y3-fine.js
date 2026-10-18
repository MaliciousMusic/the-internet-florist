/* ---------- the fine material (2026-10-18, owner: « the very best quality possible »; generalised from the oriental lily's prototype)
   Opt-in by a material's key `fine` (true or settings over SVFN_DEF), read by svDraw at DET >= 1.5: the colour-and-light layer of a sheet (its
   flat fill and its washes) is shaded sample by sample like a photograph, laid as small facets of about SVFN_DEF.cell px under a light blur,
   inside the region's own clip; every other layer of the material (flames, blot, band, spots, transmit, veins, over, rim) is still drawn over it.
   The colour of a sample: the measured colour grid of the piece when the material has one (m.grid: fleur/apparence.py grille, the median
   tissue colour over several photos, |u| bands by rows from base to tip; m.gridV = [v0, v1] blends the hand colour below v0 into the grid
   above v1), else its ramps (stops / bstops) and colour zones (cross). The light: a lit normal with wrap, the sky, an occlusion at the base, a
   satin sheen along the veins, the glow of the thin margins and of a face lit from behind, a fine grain; a shadow keeps its colour (darker and
   a little more saturated, never grey). Its weight follows the drawn size (facets of a fixed pixel size): light in a bouquet, heavy only in
   close-ups. Without `fine` in a material nothing here runs: every other sort is drawn as before. */
const SVFN_DEF={chroma:1,cell:2.4,q:5,blur:.9,grain:.025,gloss:34,ks:.16,amb:.46,dif:.54,sky:.08,wrap:.3,ao:.28,glow:.4,sat:.35,maxV:320,maxU:180};
const SVFN_X={};
const SVFN_OFF=typeof location!=='undefined'&&/[?&]nofine=1/.test(location.search||'');  /* test only: &nofine=1 draws every sort without the fine layer */
const svfRgb=h=>SVFN_X[h]||(SVFN_X[h]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
const svfMix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function svfRamp(S,v){for(let j=1;j<S.length;j++)if(v<=S[j][0]){const a=S[j-1],b=S[j];return svfMix(svfRgb(a[1]),svfRgb(b[1]),Math.max(0,Math.min(1,(v-a[0])/Math.max(1e-6,b[0]-a[0]))))}
  return svfRgb(S[S.length-1][1])}
function svfZone(z,u,v){let x=Math.abs(u);if(z.tip!=null&&v>z.tip)x=Math.max(x,(v-z.tip)/(1-z.tip));const st=z.st;let c,a;
  if(x<=st[0][0]){c=svfRgb(st[0][1]);a=st[0][2]??1}else if(x>=st[st.length-1][0]){c=svfRgb(st[st.length-1][1]);a=st[st.length-1][2]??1}
  else for(let j=1;j<st.length;j++)if(x<=st[j][0]){const p=st[j-1],q=st[j],f=(x-p[0])/Math.max(1e-6,q[0]-p[0]);c=svfMix(svfRgb(p[1]),svfRgb(q[1]),f);a=(p[2]??1)+((q[2]??1)-(p[2]??1))*f;break}
  if(z.v){const[v0,v1,v2,v3]=z.v,up=v1>v0?svSm((v-v0)/(v1-v0)):(v>=v0?1:0),dn=v3>v2?1-svSm((v-v2)/(v3-v2)):(v<=v2?1:0);a*=up*dn}
  return[c,a]}
/* the measured grid at (u, v): bilinear between cell centres (|u| bands from the axis to the edge, rows from the base to the tip) */
function svfGrid(gr,u,v){const nu=gr.nu,nv=gr.nv,x=Math.max(0,Math.min(nu-1,Math.abs(u)*nu-.5)),y=Math.max(0,Math.min(nv-1,v*nv-.5)),
    i0=Math.floor(x),j0=Math.floor(y),i1=Math.min(nu-1,i0+1),j1=Math.min(nv-1,j0+1),fx=x-i0,fy=y-j0,c=gr.c;
  return svfMix(svfMix(svfRgb(c[j0][i0]),svfRgb(c[j0][i1]),fx),svfMix(svfRgb(c[j1][i0]),svfRgb(c[j1][i1]),fx),fy)}
/* the colour of the tissue at (u, v) on the face that is seen, before the light */
function svfTissue(m,u,v,inner){const gr=inner?m.grid:m.bgrid;let c=null;
  const hand=()=>{let h=svfRamp(inner?m.stops:m.bstops,v);
    for(const z of(m.cross||[])){const f=inner?1:(z.bk||0);if(f<=0)continue;const[zc,a]=svfZone(z,u,v);if(a>0)h=svfMix(h,zc,Math.min(1,a*f))}return h};
  if(gr){c=svfGrid(gr,u,v);const gv=m.gridV;if(gv){const t=svSm((v-gv[0])/Math.max(1e-6,gv[1]-gv[0]));if(t<1)c=svfMix(hand(),c,t)}
    /* a zone marked fine:1 is another component on the piece (the nectary's green furrow): the grid's medians lose it, it is laid over them */
    for(const z of(m.cross||[])){if(!z.fine)continue;const f=inner?1:(z.bk||0);if(f<=0)continue;const[zc,a]=svfZone(z,u,v);if(a>0)c=svfMix(c,zc,Math.min(1,a*f))}}
  else c=hand();
  return c}
const svfHex=c=>'#'+c.map(x=>x.toString(16).padStart(2,'0')).join('');
/* svDraw's hook: the fine colour-and-light layer of one region (it: its side it.s, its clip cg already set) of the sheet sh */
function svFine(cg,it,sh,front,Dm){const m=sh.mat,F=m.fine===true?SVFN_DEF:Object.assign({},SVFN_DEF,m.fine),B=sh.B,O=sh.O,Sf=sh.S,e=1e-3;
  /* the grid: about F.cell px per facet along and across (the piece's drawn length and width) */
  const ext=(a,b)=>{const p=PJ(B,O,Sf(a[0],a[1])),q=PJ(B,O,Sf(b[0],b[1]));return Math.hypot(p[0]-q[0],p[1]-q[1])};
  let lenPx=0,widPx=0;for(let s=0;s<8;s++)lenPx+=ext([0,s/8],[0,(s+1)/8]);for(const v of[.3,.5,.7])widPx=Math.max(widPx,ext([-1,v],[0,v])+ext([0,v],[1,v]));
  const NV=Math.max(6,Math.min(F.maxV,Math.round(lenPx/F.cell))),NU=Math.max(4,Math.min(F.maxU,Math.round(widPx/F.cell))),W=NU+1;
  const S=[],Nn=[],Tv=[],Fz=[];
  for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const u=-1+2*i/NU,v=j/NV,p=Sf(u,v),s=PJ(B,O,p),ua=Math.max(-1,u-e),ub=Math.min(1,u+e),va=Math.max(0,v-e),vb=Math.min(1,v+e),
      dv=V3s(Sf(u,vb),Sf(u,va)),du=V3s(Sf(ub,v),Sf(ua,v)),n=V3.nz(toV(B,V3.cr(dv,du)));S.push(s);Nn.push(n);Tv.push(V3.nz(toV(B,dv)));Fz.push(n[2])}
  const seed=(m.seed||1)+Math.round(lenPx),hsh=(i,j)=>{let h=Math.imul(i+1,374761393)^Math.imul(j+7,668265263)^seed;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
  const inner=front,col=(i,j)=>{const q=j*W+i,u=-1+2*i/NU,v=j/NV,n=Fz[q]>0?Nn[q]:V3.sc(Nn[q],-1);let c=svfTissue(m,u,v,inner);
    /* F.chroma: the tissue's saturation before the light (a grid of photos under a soft sky reads a little pale; the measures say by how much) */
    if(F.chroma!==1){const m0=(c[0]+c[1]+c[2])/3;c=c.map(x=>Math.max(0,Math.min(255,m0+(x-m0)*F.chroma)))}
    const dl=V3.dot(n,LIGHT),dif=Math.max(0,(dl+F.wrap)/(1+F.wrap)),sky=.5+.5*n[1],th=V3.dot(Tv[q],HV3),
      sp=Math.pow(Math.sqrt(Math.max(0,1-th*th)),F.gloss)*F.ks*(inner?1:.6),ao=1-F.ao*(1-svSm(v/.2))*(inner?1:.6),
      gr=1+F.grain*(Math.sin(u*Math.PI*26+3.1*Math.sin(v*6+seed))*.7+(hsh(i,j)-.5)*.6),lum=ao*(F.amb+F.dif*dif+F.sky*sky)*gr;
    const mx=Math.max(c[0],c[1],c[2]),sat=c.map(x=>mx-(mx-x)*(1+F.sat*(1-Math.min(1,lum))));
    let r=lum<1?[sat[0]*lum,sat[1]*lum,sat[2]*lum]:svfMix(c,[255,255,255],Math.min(.22,(lum-1)*.45));
    const thin=svSm((Math.abs(u)-.55)/.45)*.6+svSm((v-.75)/.25)*.4,gl=F.glow*Math.min(1,thin*.5+Math.max(0,-dl)*.8);
    if(gl>0)r=svfMix(r,svfMix(c,[255,255,255],.35),gl*.5);
    r=svfMix(r,[255,255,255],Math.min(.85,sp));return[Math.min(255,r[0]),Math.min(255,r[1]),Math.min(255,r[2])]};
  const C=new Array(S.length);for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++)C[j*W+i]=col(i,j);
  /* the facets of this region's side (its clip trims the fold), farthest first in a few slabs, each slab one path per colour */
  const cells=[],sg=it.s,qq=F.q;
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*W+i,b=a+1,c2=a+W+1,d=a+W;if(Math.max(Fz[a]*sg,Fz[b]*sg,Fz[c2]*sg,Fz[d]*sg)<-.18)continue;  /* along a fold the region's smoothed outline reaches past the turn: its cells stay (the clip trims them), never a notch of the fill */
    const z=(S[a][2]+S[b][2]+S[c2][2]+S[d][2])/4,key=[0,1,2].map(k=>Math.max(0,Math.min(255,Math.round((C[a][k]+C[b][k]+C[c2][k]+C[d][k])/4/qq)*qq)));cells.push([z,a,b,c2,d,key])}
  if(!cells.length)return;
  cells.sort((x,y)=>x[0]-y[0]);
  const gb=G(cg,{filter:svBlur(F.blur)}),slabs=cells.length>400?6:2,per=Math.ceil(cells.length/slabs),grow=.45;
  for(let s0=0;s0<cells.length;s0+=per){const by=new Map();
    for(const[,a,b,c2,d,key]of cells.slice(s0,s0+per)){const k=key.join(','),P4=[S[a],S[b],S[c2],S[d]],cx=(P4[0][0]+P4[1][0]+P4[2][0]+P4[3][0])/4,cy=(P4[0][1]+P4[1][1]+P4[2][1]+P4[3][1])/4;
      let dd='M';for(let q=0;q<4;q++){const p=P4[q],dx=p[0]-cx,dy=p[1]-cy,l=Math.hypot(dx,dy)||1;dd+=(q?'L':'')+svF(p[0]+dx/l*grow)+','+svF(p[1]+dy/l*grow)}dd+='Z';
      by.set(k,(by.get(k)||'')+dd)}
    for(const[k,dd]of by)E('path',{d:dd,fill:svfHex(k.split(',').map(Number))},gb)}}
