/* ---------- y3-frange.js: toothed and ruffled petals for the rosette kit (svRosette's opt-in hooks P.marg and P.ruf) ----------
   Carnations first (Dianthus: a fan-shaped limb, its outer margin cut in irregular teeth, the limb pleated across); pinks, cornflowers, fringed
   tulips or lisianthus next. Unlike svMarge (y3-marge.js, sampled at the sheet's grid nodes), the cut here is a continuous function of u: the
   rosette samples the tip line itself at P.tipN points (svAt evaluates the surface exactly), so teeth narrower than a grid cell keep their shape.
   - svDent(o) -> P.marg(u,t,q): n teeth across the tip line ([a,b] per piece), each notch its own depth (dp [a,b], a share of the piece's length,
     scaled by k [a,b] per piece), each tooth's apex placed off its middle by up to sk (a lopsided tooth), the notch's shape by p (1 a straight V,
     more a slit with broad teeth, less a round scallop), a fine second order of small teeth on the flanks (t2: their depth, a share of dp) and
     the cut fading out toward the shoulders past |u| > span (fade: how far); in the bud (q.bud) the teeth are pressed together (bud: kept).
   - svRuffle(o) -> P.ruf(u,v,t,q): pleats across the limb, a few broad folds (n [a,b] half waves, the gene t.pn if given) of amplitude a (half
     widths; the gene t.pa if given), from v0 of the length on (grown over dv), stronger at the margin (edge: the extra at |u| = 1), with a finer
     crumple of the margin along it (c: its share, cn its waves); the bud keeps bud of it; the wilting crinkle (q.crk, the kit's crk by decline
     and fading) adds w times its share to the crumple. Each piece its own phase (t.pph, else from t.sd). */
const SVFR_DENT={n:[7,12],dp:[.06,.13],k:[.75,1.2],sk:.22,p:1.15,t2:.25,span:.92,fade:.12,bud:.3};
function svDent(o0){const o=Object.assign({},SVFR_DENT,o0);
  return(u,t,q)=>{let M=t._dn;
    if(!M){const r=svRng(((t.sd||1)*13+577)>>>0),k=r.in(o.k[0],o.k[1]),n=Math.max(2,Math.round(r.in(o.n[0],o.n[1]))),D=[],A=[];
      for(let i=0;i<=n;i++)D.push(k*r.in(o.dp[0],o.dp[1]));for(let i=0;i<n;i++)A.push(.5+o.sk*(r()*2-1));
      M=t._dn={n,D,A,ph:r.in(-.35,.35)}}
    const x=Math.max(0,Math.min(M.n-1e-6,((u+1)/2)*M.n+M.ph*Math.min(1,(1-Math.abs(u))*4))),i=Math.floor(x),s=x-i,a=M.A[i];
    let d=s<a?M.D[i]*Math.pow(1-s/a,o.p):M.D[i+1]*Math.pow((s-a)/(1-a),o.p);
    /* the small teeth on the flanks of the big ones */
    if(o.t2)d+=o.t2*(M.D[i]+M.D[i+1])*.5*Math.pow(Math.abs(Math.sin(s*Math.PI*3)),1.6)*Math.sin(s*Math.PI);
    const au=Math.abs(u);if(au>o.span)d*=Math.max(0,1-(au-o.span)/o.fade);
    return d*(1-(1-o.bud)*(q&&q.bud||0))}}
/* fk: the amplitude grows toward the heart by that share at rank f = 1 (the inner petals crumpled more than the outer ones) */
const SVFR_RUF={n:[3,5],a:.22,v0:.4,dv:.4,edge:.6,c:.35,cn:5,bud:.15,w:6,fk:0};
function svRuffle(o0){const o=Object.assign({},SVFR_RUF,o0);
  return(u,v,t,q)=>{const n=t.pn||((o.n[0]+o.n[1])/2),a=(t.pa||o.a)*(1-(1-o.bud)*(q.bud||0))*(1+o.fk*(q.f||0)),ph=t.pph!=null?t.pph:((t.sd||1)%628)/100;
    if(a<=0)return 0;const g=svSm((v-o.v0)/o.dv),au=Math.abs(u),e=1+o.edge*au*au;
    const lift=Math.sin(n*Math.PI*(u+1)/2+ph)+(o.c+o.w*(q.crk||0))*Math.sin(o.cn*Math.PI*u+ph*2.3+v*7)*svSm((v-.7)/.25);
    return a*g*e*lift}}
/* svFrBand(o) -> svrDraw's run hook (lf.run, y3-rosette.js): a coloured margin that follows the cut outline exactly (the picotee carnation's
   band, its teeth coloured to their tips), where a band read from the sheet's grid (one cell for several teeth) would leave the teeth bare and
   blur. For each petal of the run: the strip between its tip line (v = 1, the teeth included, sampled at n points) and the line v = 1 - w (a share
   of the length, each petal its own by a hash of its rank and place; the inner ranks narrower by wf), drawn flat where both its edges are seen
   (neither under a later petal of the run nor, under zvis, under any nearer surface), on the face seen there (the back at bk of the opacity);
   under it a fainter feather fw times as wide (opacity fa): the colour bleeds inward. The washes are laid after it (the band takes the shading).
   o: {c, w [a,b], op, bk, fw, fa, wf, n [DET 1, DET 1.5]}, the colourway's own in its material (mt.marB: none, no band) over the kind's (o0);
   h (svrDraw's helpers): {hid2, zHid, Dm, tol, big} */
const SVFR_BAND={c:'#8a1a6a',w:[.05,.08],op:.92,bk:.6,fw:2.4,fa:.3,wf:.35,n:[28,48]};
function svFrBand(o0){const O=Object.assign({},SVFR_BAND,o0);
  return(run,vis,k,h)=>{const mb=run[0]&&run[0].mt&&run[0].mt.marB;if(!mb||!h||typeof SVR_OFF!=='undefined'&&SVR_OFF.includes('band'))return;
    const o=Object.assign({},O,mb),hi=DET>=1.5,n=o.n[hi?1:0],d=[['',''],['','']];
    run.forEach((it,j)=>{if(it.grp!=='p'||!it.sh||(h.big&&!h.big(it)))return;const sh=it.sh,sd=(Math.round(it.f*991)+Math.round(it.bb[0]*3+it.bb[1]*5))>>>0,
        w0=(o.w[0]+(o.w[1]-o.w[0])*pxHashS(3,7,sd))*(1-o.wf*it.f);
      /* a point of the strip: its screen place and the face seen there (0: hidden or edge-on) */
      const seen=(u,v)=>{const p=svAt(sh,u,v),F=svLerp(sh,sh.F,u,v);if(Math.abs(F)<.02)return[p,0];
        const hd=h.zHid&&it.ouv?h.zHid(it,p[0],p[1],svLerp(sh,sh.Z,u,v)):h.hid2(j,p[0],p[1]);return[p,hd?0:F>0?1:-1]};
      for(let L=0;L<2;L++){const w=L?w0:w0*o.fw,inn=u=>[u*(1-1.6*w*Math.pow(Math.abs(u),3)),1-w];let A=[],Bi=[],fc=0;
        /* o.mn (opt-in): the fewest samples a seen stretch needs (a crumpled heart's pieces left two-sample ticks of band: 3.6b) */
        const flush=()=>{if(A.length>Math.max(1,(o.mn||2)-1)){const f=fc>=0?0:1;d[L][f]+='M'+A.concat(Bi.reverse()).map(p=>svF(p[0])+','+svF(p[1])).join('L')+'Z'}A=[];Bi=[];fc=0};
        for(let i=0;i<n;i++){const u=-1+2*i/(n-1),a=seen(u,1),ui=inn(u),b=seen(ui[0],ui[1]);
          if(a[1]&&a[1]===b[1]){A.push(a[0]);Bi.push(b[0]);fc+=a[1]}else flush()}flush()}});
    for(let L=0;L<2;L++)for(let f=0;f<2;f++)if(d[L][f])E('path',{d:d[L][f],fill:o.c,'fill-opacity':(L?o.op:o.fa)*(f?o.bk:1)},k)}}
/* svFrBandP(o) -> svrDraw's per-piece hook (lf.pfx): the same band, laid right after its own piece's fill, so that the paint order hides it
   under the pieces drawn after. The run-level hook kept only the samples whose two edges were both seen: on the pleated, overlapping petals
   the band broke into ticks across the margin (photographs 38 and 55 band every petal's seen margin, the heart's too: 4.7). Kept here: the
   samples where both edges of the strip face the same way and neither is edge-on; the strip clipped to its piece's own fill (nothing past the
   petal: 3.6b) and kept on the piece (it.xd) so that a patch of it shows its band. mnD: the smallest piece banded (its box, x D) */
function svFrBandP(o0){const O=Object.assign({},SVFR_BAND,{mnD:.03},o0);
  return(it,g,h)=>{const mb=it.mt&&it.mt.marB;if(!mb||it.grp!=='p'||!it.sh||!h||typeof SVR_OFF!=='undefined'&&SVR_OFF.includes('band'))return;
    const o=Object.assign({},O,mb),hi=DET>=1.5,n=o.n[hi?1:0],sh=it.sh,bb=it.bb;if((bb[2]-bb[0])+(bb[3]-bb[1])<h.Dm*o.mnD)return;
    const sd=(Math.round(it.f*991)+Math.round(bb[0]*3+bb[1]*5))>>>0,w0=(o.w[0]+(o.w[1]-o.w[0])*pxHashS(3,7,sd))*(1-o.wf*it.f),d=[['',''],['','']],
      seen=(u,v)=>{const p=svAt(sh,u,v),F=svLerp(sh,sh.F,u,v);return[p,Math.abs(F)<.02?0:F>0?1:-1]};
    for(let L=0;L<2;L++){const w=L?w0:w0*o.fw,inn=u=>[u*(1-1.6*w*Math.pow(Math.abs(u),3)),1-w];let A=[],Bi=[],fc=0;
      /* the inner line smoothed over sm samples each side (at v = 1 - w it copied the teeth: a saw-edged band, 3.8; the band's inner edge is
         soft on the photographs) */
      const smo=P=>{const m=o.sm==null?2:o.sm;if(!m)return P;return P.map((p,i)=>{let x=0,y=0,s=0;for(let j=-m;j<=m;j++){const q=P[Math.max(0,Math.min(P.length-1,i+j))],c=m+1-Math.abs(j);x+=q[0]*c;y+=q[1]*c;s+=c}return[x/s,y/s]})};
      const flush=()=>{if(A.length>Math.max(1,(o.mn||2)-1)){const f=fc>=0?0:1;d[L][f]+='M'+A.concat(smo(Bi).reverse()).map(p=>svF(p[0])+','+svF(p[1])).join('L')+'Z'}A=[];Bi=[];fc=0};
      for(let i=0;i<n;i++){const u=-1+2*i/(n-1),a=seen(u,1),ui=inn(u),b=seen(ui[0],ui[1]);if(a[1]&&a[1]===b[1]){A.push(a[0]);Bi.push(b[0]);fc+=a[1]}else flush()}flush()}
    if(!d[0][0]&&!d[0][1]&&!d[1][0]&&!d[1][1])return;
    const cid=it.pid||it.lid;let gg=g;if(cid){const id='sb'+(gid++);E('use',{href:'#'+cid},E('clipPath',{id},h.dd||GDEF||defs));gg=G(g,{'clip-path':`url(#${id})`})}
    for(let L=0;L<2;L++)for(let f=0;f<2;f++)if(d[L][f]){const at={d:d[L][f],fill:o.c,'fill-opacity':svF((L?o.op:o.fa)*(f?o.bk:1))};E('path',at,gg);(it.xd||(it.xd=[])).push(at)}}}
