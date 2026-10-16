/* ================= y3-damier.js : le damier (Fritillaria meleagris) et le crochet de peinture des matières =================
   1. svDrawP: svDraw (y1.js) to the letter, plus one hook: a material may paint its own pattern on each visible face (m.paint(put,{sh,s,front,Dm,tol,hi}): put(el) places an element there),
      inside the face's clip and under its washes, so the light still models it and the patches carry it; and one option, o.wt, the washes' tolerance
      (x D, .008 in svDraw: coarser at DET 1). A copy, so that y1.js stays untouched:
      once the hook line is merged into svDraw, svDrawP = svDraw and this copy goes.
   2. svDamier: the chequer of the snake's head fritillary, a generic piece (genes, one compound path of dark checks per face). */
function svDrawP(par,pieces,o){const Dm=o.D,tol=Math.max(.06,Dm*.0035),k=G(par),items=[];
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
        const d=svLoopsD(sh,svIso(sh.nu,sh.nv,V,0),Math.max(tol*2.5,Dm*(o.wt||.008)));if(d)E('path',{d,fill:col,'fill-opacity':a,'fill-rule':'evenodd'},bg)}};
    /* flames (streaks of a second colour along the tissue: Tigre, Rainbow), soft wide strokes in the blurred washes */
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
    /* the material's own pattern (a chequer...), painted on the face under the washes, so the light still models it */
    if(m.paint&&!LOD)m.paint(el=>cg.insertBefore(el,bg),{sh,s:it.s,front,Dm,tol,hi:DET>=1.5});
const hi=DET>=1.5;wash(hi?m.dark||[.92,.8,.68,.56,.44]:m.darkLo||m.dark||[.9,.76,.62],front?m.shade:m.bshade,hi?m.da??.2:m.daLo??m.da??.26,1);wash(hi?m.lit||[1.08,1.2]:m.litLo||m.lit||[1.1],front?m.lite:m.blite,hi?m.la??.22:m.laLo??m.la??.24,0);
    /* veins: their runs on this face only */
    if(m.veins&&(DET>=1||!o.small)){const VL=m.veins(sh,front);for(const[set,w,col,op]of VL){let d='';for(const pl of set){let run=[];const flush=()=>{if(run.length>1)d+=svQuad(run);run=[]};
          for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>.03)run.push(svAt(sh,u,v));else flush()}flush()}
        if(d)E('path',{d,fill:'none',stroke:hi?svFaceFill(sh,[[0,col,0],[.12,col,op],[.55,col,op*.75],[1,col,op*.3]],Dm):col,'stroke-opacity':hi?1:op*.7,'stroke-width':svF(Dm*w),'stroke-linecap':'round','stroke-linejoin':'round'},cg)}}
    if(m.rw)E('use',{href:'#'+it.id,fill:'none',stroke:front?m.rim:m.brim||m.rim,'stroke-width':svF(Dm*m.rw),'stroke-opacity':m.ro??.4},cg);patch(it)}
  return k}
/* ---------- the chequer: a net of irregular checks on a sheet, in its (u,v) ----------
   Columns run along the veins (lines of u that waver a little), rows run across (lines of v, unevenly spaced); every other cell is dark (a
   checkerboard) and each dark check is drawn a little larger than its cell (kd), so that the light cells between them shrink to spots, more so
   toward the tip (kdV). The checks are mapped through the sheet, so they follow its curvature and foreshorten with it; at the margins they are cut
   by the outline, along the fold by the face's clip. One compound path per tone (dark, mid) per face, under the washes (svDrawP's paint hook): about 25 to 40 checks
   per face at DET 1 (four corners each), rounded (eight points, a closed spline) in close-ups. Genes per sheet: the counts, the row spacing (rp > 1: closer toward the claw), each
   column's waver, each check's size; a few checks missing (skip), none on the claw (v0) nor on the tip (tip, the plain point of the tepal).
   net (> 0, inverted only): the dark cells hold a light spot too, net x the size of their neighbours', in the second tone: the dark ground is left
   as a fine continuous net round light cells of two sizes, the chequer still read at a distance (79, 122) */
const SVD_DEF={nu:[6,7],nv:[12,14],v0:.05,tip:[.92,.97],jit:.7,wob:.5,kd:[1.18,1.4],kdV:[-.12,.14],kdJ:.1,skip:.04,cr:.2,min:.6,mid:.3,rp:1,net:0};
/* the genes of one chequer (one face of one tepal), from its seed */
function svDamGenes(seed,o0){const o=Object.assign({},SVD_DEF,o0),r=svRng(seed),nu=Math.round(r.in(o.nu[0],o.nu[1]+.49)),nv=Math.round(r.in(o.nv[0],o.nv[1]+.49)),
    tipV=r.in(o.tip[0],o.tip[1]),kd=r.in(o.kd[0],o.kd[1]),par=r()<.5?0:1,ph=[],rows=[],cells=[];
  for(let i=0;i<=nu;i++)ph.push([r.in(0,6.28),r.in(3,9)]);
  for(let j=0;j<=nv;j++)rows.push(o.v0+(tipV-o.v0)*Math.pow(j/nv,o.rp)+(j>0&&j<nv?(r()-.5)*o.jit*(tipV-o.v0)/nv*Math.min(1,o.rp*Math.pow(j/nv,o.rp-1)):0));
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++)cells.push({k:kd*(1+o.kdV[0]+(o.kdV[1]-o.kdV[0])*j/Math.max(1,nv-1)+(r()-.5)*o.kdJ),sk:r()<o.skip,du:(r()-.5)*.18,dv:(r()-.5)*.18,t:r()<o.mid?1:0});
  return{nu,nv,rows,ph,cells,par,o,kd}}
/* the path of the dark checks on the face s of the sheet sh (screen space): '' when none shows */
function svDamPath(sh,gn,s,hi,tone=0,ks=1,inv=false){const{nu,nv,rows,ph,cells,par,o}=gn,U=(i,v)=>i<=0?-1.06:i>=nu?1.06:-1+2*i/nu+o.wob/nu*Math.sin(ph[i][0]+ph[i][1]*v),cl=x=>Math.max(-1,Math.min(1,x));
  let d='';const a2=o.min*o.min;
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const nc=(i+j+par+(inv?1:0))%2===1;if(nc&&!(inv&&o.net))continue;const c=cells[j*nu+i];
    if(nc?tone!==1:((c.sk&&!inv)||c.t!==tone))continue;
    const va=rows[j],vb=rows[j+1],vm=(va+vb)/2,cu=(U(i,vm)+U(i+1,vm))/2+c.du*2/nu,cv=vm+c.dv*(vb-va);
    if(s*svLerp(sh,sh.F,cl(cu),cv)<-.12)continue;
    const k=nc?Math.max(.1,(2-c.k*ks)*o.net):inv?Math.max(.1,2-c.k*ks):c.k*ks,Q=[[U(i,va),va],[U(i+1,va),va],[U(i+1,vb),vb],[U(i,vb),vb]].map(([u,v])=>[cu+(u-cu)*k,cv+(v-cv)*k]);
    let P;if(hi){P=[];for(let q=0;q<4;q++){const A=Q[q],B2=Q[(q+1)%4];for(const t of[o.cr,1-o.cr])P.push([A[0]+(B2[0]-A[0])*t,A[1]+(B2[1]-A[1])*t])}}else P=Q;
    const S=P.map(([u,v])=>svAt(sh,cl(u),Math.max(0,Math.min(1,v))));
    /* too small to see (foreshortened, far): skipped */
    if(svArea(S)<a2)continue;
    if(hi)d+=svSpl(S);else{const x0=svR(S[0][0]),y0=svR(S[0][1]);d+='M'+svJ([x0,y0])+'l'+svJ([svR(S[1][0])-x0,svR(S[1][1])-y0,svR(S[2][0])-svR(S[1][0]),svR(S[2][1])-svR(S[1][1]),svR(S[3][0])-svR(S[2][0]),svR(S[3][1])-svR(S[2][1])])+'z'}}
  return d}
/* a material's paint hook for svDrawP: the chequer of each face (genes per face), its colour a ramp from the claw to the tip ([[v,colour,opacity]...]) */
/* the second tone (mid checks, a fraction mid of them) is a ramp too, or null (one tone only); ks scales every check (the bud's
   checks smaller, apart, then growing until they meet); inv draws the other cells instead, as light spots of size 2 - k: the same image
   (an exact checkerboard at k = 1), so a sheet whose dark checks grow past their cells swaps its ground to dark and paints the light spots */
function svDamier(gOut,gIn,rOut,rIn,mOut,mIn,ks=1,inv=false){return(put,x)=>{const gn=x.front?gIn:gOut,rp=x.front?rIn:rOut,mp=x.front?mIn:mOut;if(!gn||!rp)return;
  for(const[t2,ramp]of[[0,rp],[1,mp]]){if(!ramp)continue;const d=svDamPath(x.sh,gn,x.s,x.hi,t2,ks,inv);if(!d)continue;
    /* in close-ups the colour runs along the piece; at DET 1 one flat colour (no gradient: the budget) */
    const q=ramp[Math.floor((ramp.length-1)/2)];put(E('path',x.hi?{d,fill:svFaceFill(x.sh,ramp,x.Dm)}:{d,fill:q[1],'fill-opacity':svF(q[2]??1)}))}}}
/* ---------- svDrawLean: the lean drawer of small sheets at DET 1 (leaves of a bouquet stem) ----------
   One gradient fill per visible face, in svDraw's order, its colours shaded by the face's mean light (so each face of a twisted or folded blade
   keeps its own tone: the volume without washes), then its veins as flat strokes; no clip, wash, blur, cast shadow nor patch. Gradients keep three
   stops. About 6 elements per face where svDraw spends 16 to 20 */
function svDrawLean(par,pieces,o){const Dm=o.D,tol=Math.max(.06,Dm*.0035)*1.5,k=G(par),items=[];for(const p of pieces)items.push(...svRegions(p,{tol}));
  const thin=st=>st.length>3?[st[0],st[Math.floor(st.length/2)],st[st.length-1]]:st;
  for(const it of svOrder(items,Dm*.005)){if(it.kind!=='reg')continue;const sh=it.sh,m=sh.mat,front=it.s>0,K=svShade(sh);let sk=0,nk=0;
    for(let q=0;q<K.length;q++)if(it.s*sh.F[q]>0){sk+=K[q];nk++}const f=Math.max(.55,Math.min(1.25,nk?sk/nk:1)),sc=front?m.shade:m.bshade,lc=front?m.lite:m.blite,
      tone=c=>f<1?mix(c,sc,(1-f)*.85):mix(c,lc,(f-1)*1.6);
    E('path',{d:it.d,fill:svFaceFill(sh,thin(front?m.stops:m.bstops).map(([v,c,a])=>[v,tone(c),a]),Dm)},k);
    if(m.veins)for(const[set,w,col,op]of m.veins(sh,front)){let d='';for(const pl of set){let run=[];const flush=()=>{if(run.length>1)d+=svQuad(run);run=[]};
        for(const[u,v]of pl){if(it.s*svLerp(sh,sh.F,u,v)>.03)run.push(svAt(sh,u,v));else flush()}flush()}
      if(d)E('path',{d,fill:'none',stroke:col,'stroke-opacity':svF(op*.8),'stroke-width':svF(Dm*w),'stroke-linecap':'round'},k)}}
  return k}
