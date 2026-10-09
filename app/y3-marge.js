/* ---------- y3-marge.js: cut margins for svBloom (its hook P.marg) ----------
   A piece's outline above its broadest point is its tip line (v=1, u from -1 at one shoulder over the tip to 1 at the other). svBloom asks the
   spec's hook P.marg(u,t,g) how much of the piece's length to cut back there. svMarge(o) builds that hook from a few numbers; each piece cuts its
   own margin from its seed (t.sd), so no two are alike. Parrot tulips (lacerated, feathered tepals); the fringed tulip, carnations, cornflowers next.
   - cuts: n incisions ([a,b]), each a V (power p: 1 straight, more a slit) dp deep ([a,b], share of the length), hw grid steps wide on each side
     ([a,b]), spread over |u| <= span (0 the apex, 1 the shoulders), toward the shoulders as wk grows (0 even);
   - teeth: a fine irregular serration between them, every other node cut by up to ta (a fringe: ta large, n small);
   - lobes: broad waves of the outline, ln across, la deep;
   - k: the whole cut scaled per piece ([a,b]: one piece barely cut, its neighbour torn).
   The outline is only sampled at the sheet's grid nodes (u=-1+2i/nu, nu the spec's nu, x1.3 at DET 1.5 as in svBloom): the incisions sit on nodes,
   so none falls between two and vanishes. o.nu must be the spec's nu (the same for its two stages). The cut is continuous in u (the flames and
   veins drawn at any u follow it). Depths are shares of the length: the cut never reaches below the broadest point (vb) by more than dp. */
const SVM_DEF={nu:12,n:[3,6],dp:[.05,.14],hw:[.8,1.4],p:1.4,span:.95,wk:.5,ta:.015,la:0,ln:3,k:[.7,1.2]};
function svMarge(o0){const o=Object.assign({},SVM_DEF,o0);
  return(u,t)=>{const nu=Math.round(o.nu*(DET>=1.5?1.3:1));let M=t._mg;
    if(!M||M.nu!==nu){const r=svRng((t.sd*7+911)>>>0),k=r.in(o.k[0],o.k[1]),n=Math.round(r.in(o.n[0],o.n[1])),cuts=[],used=new Set(),tee=[];
      for(let q=0;q<n;q++){let i=0;for(let tr=0;tr<8;tr++){const a=o.span*Math.pow(r(),1/(1+2*o.wk))*(r()<.5?-1:1);i=Math.round((a+1)/2*nu);if(!used.has(i))break}
        used.add(i);cuts.push([-1+2*i/nu,k*r.in(o.dp[0],o.dp[1]),r.in(o.hw[0],o.hw[1])*2/nu])}
      for(let i=0;i<=nu;i++)tee.push(used.has(i)?0:(i%2?1:.2)*r.in(.35,1)*o.ta*k);
      M=t._mg={nu,cuts,tee,ph:r.in(0,6.28),k}}
    let d=0;for(const[c,dp,w]of M.cuts){const x=1-Math.abs(u-c)/w;if(x>0)d+=dp*Math.pow(x,o.p)}
    if(o.ta){const x=Math.max(0,Math.min(nu,(u+1)/2*nu)),i=Math.min(nu-1,Math.floor(x)),f=x-i;d+=M.tee[i]*(1-f)+M.tee[i+1]*f}
    if(o.la)d+=o.la*M.k*(.5-.5*Math.cos(Math.PI*o.ln*u+M.ph));
    return d}}
/* ---------- svFringe: a fringe of fine needles along a piece's upper margin, drawn apart from its sheet ----------
   svMarge cuts the outline itself, which is only sampled at the grid's nodes: too coarse for a fringe a tenth of a tepal wide (the fringed tulip;
   carnations, cornflowers next). svFringe(o) returns a hook for the spec's heart (heart:ctx=>{fringe(ctx);heart6(ctx)}): for every sheet already in
   ctx.pieces (the petals) it lays a comb of needles in the sheet's own surface, standing out of its margin from one flank (from: share of the side
   edge, 0 claw .. 1 shoulder) over the tip line to the other. One closed path per seen face (needle after needle, then back along a narrow crystal
   band inside the margin), a drawn part ordered by a thin proxy sheet (the needles' band). Each piece its own chance (spacing, length, slant).
   - n: needles per piece [DET>=1.5, DET 1] (halved in LOD); len: their length, share of R0 [mean, spread +-]; taper: share of the fringed run at
     each end over which they grow to full length; w: a needle's foot, share of the spacing (slits between); band: the crystal band inside the margin (share of the length); lean: tilt toward the apex;
     jit: irregularity (spacing, slant);
   - life: bud: length kept on the closed bud, budC: its colour drawn toward the tepal's tip; green, greenC: the young bud's green (the spec's
     green and greenC: [part, until, over]); dec, fan: shortening as it declines and fades; brown, br: the faded fringe browns (thin, it dries first);
   - colours from the material: m.fr (inner face), m.bfr (outer face), shaded by the piece's light at its margin (shd: how much; a crystal fringe lets light through); op: opacity. */
const SVF_DEF={n:[44,26],from:.8,len:[.1,.3],w:.5,taper:.2,band:.3,lean:.12,jit:.35,shd:.7,budC:.35,bud:.6,dec:.15,fan:.4,brown:'#8a6a4a',br:.45,op:1,nf:6,nt:24};
function svFringe(o0){const o=Object.assign({},SVF_DEF,o0);
  return ctx=>{const{pieces,R0,g,cw0,bud,dec,fan}=ctx,lod=typeof LOD!=='undefined'&&LOD,N=Math.max(6,Math.round((DET>=1.5?o.n[0]:o.n[1])*(lod?.5:1))),
      sf=c=>svShift(c,g.dh,g.ds,g.dl),tipC=st=>st[st.length-1][1],fr0=cw0.fr||mix(tipC(cw0.st),'#ffffff',.35),bfr0=cw0.bfr||mix(fr0,tipC(cw0.bst),.3),
      Lm=R0*o.len[0]*(1-bud*(1-o.bud))*Math.max(.2,1-o.dec*dec-o.fan*fan),cl=(x,a,b)=>Math.max(a,Math.min(b,x)),e=.02;
    if(Lm<R0*.004)return;
    pieces.filter(p=>p&&p.S&&p.mat&&!p.fn).forEach((sh,k)=>{const S=sh.S,Bq=sh.B,Oq=sh.O,m=sh.mat,r=svRng((((g.sd||1)*31+k*977+13)>>>0)),uv=[];
      for(let i=0;i<o.nf;i++)uv.push([-1,o.from+(1-o.from)*i/o.nf]);for(let i=0;i<=o.nt;i++)uv.push([-1+2*i/o.nt,1]);for(let i=o.nf-1;i>=0;i--)uv.push([1,o.from+(1-o.from)*i/o.nf]);
      const C=S(0,.5),Pm=uv.map(([u,v])=>S(u,v)),M=Pm.length,Ac=[0];for(let i=1;i<M;i++)Ac.push(Ac[i-1]+V3l(V3s(Pm[i],Pm[i-1])));const A=Ac[M-1];if(A<R0*.05)return;
      /* along the margin: the outward direction in the sheet (square to the margin, leaning to the apex), the face seen, its light */
      const Dm=[],Fm=[],Km=[],r0=svLight([0,0,1],m,1);
      for(let i=0;i<M;i++){const[u,v]=uv[i],Su=V3s(S(cl(u+e,-1,1),v),S(cl(u-e,-1,1),v)),Sv=V3s(S(u,cl(v+e,0,1)),S(u,cl(v-e,0,1))),Nn=V3.nz(V3.cr(Sv,Su)),
          T=V3.nz(V3s(Pm[Math.min(M-1,i+1)],Pm[Math.max(0,i-1)]));let D=V3.nz(V3.cr(T,Nn));if(V3.dot(D,V3s(Pm[i],C))<0)D=V3.sc(D,-1);
        Dm.push(V3.nz(V3.add(D,V3.sc(T,o.lean*(Ac[i]<A/2?1:-1)))));const nv=toV(Bq,Nn);Fm.push(nv[2]);Km.push(svLight(nv[2]>=0?nv:V3.sc(nv,-1),m,1)/r0)}
      const at=a=>{let i=1;while(i<M-1&&Ac[i]<a)i++;const f=cl((a-Ac[i-1])/((Ac[i]-Ac[i-1])||1),0,1);
          return[V3.add(V3.sc(Pm[i-1],1-f),V3.sc(Pm[i],f)),V3.nz(V3.add(V3.sc(Dm[i-1],1-f),V3.sc(Dm[i],f))),Fm[i-1]*(1-f)+Fm[i]*f,Km[i-1]*(1-f)+Km[i]*f]},
        env=a=>svSm(a/(o.taper*A))*svSm((A-a)/(o.taper*A)),s=A/N,hw=o.w*s/2,pj=p=>{const x=PJ(Bq,Oq,p);return[x[0],x[1]]};
      /* the needles: a narrow foot on the margin (w of the spacing: slits between them), a tip out in the sheet (its anchor slid along: a slant) */
      const nd=[];for(let j=0;j<N;j++){const a=cl((j+.5)*s+(r()-.5)*o.jit*s,hw,A-hw),q=at(cl(a+(r()-.5)*o.jit*s*1.4,0,A)),q0=at(a),l=Lm*(1+o.len[1]*(r()*2-1))*env(a),
          ql=at(a-hw),qr=at(a+hw),ib=-o.band*Lm*env(a);
        nd.push({l:pj(ql[0]),t:pj(V3.add(q[0],V3.sc(q0[1],l))),r:pj(qr[0]),i:pj(V3.add(q0[0],V3.sc(q0[1],ib))),f:q0[2]>=0?0:1,K:q0[3]})}
      /* runs of needles on one face: needle after needle, then back inside the margin */
      const wr=P=>{let cx=svR(P[0][0]),cy=svR(P[0][1]);const d=[];for(let i=1;i<P.length;i++){const x=svR(P[i][0]),y=svR(P[i][1]);d.push(x-cx,y-cy);cx=x;cy=y}return'M'+svJ([svR(P[0][0]),svR(P[0][1])])+'l'+svJ(d)+'z'};
      const dd=['',''],kk=[0,0],nn=[0,0];let j0=0;
      for(let j=1;j<=N;j++){if(j<N&&nd[j].f===nd[j0].f)continue;const P=[],F=nd[j0].f;for(let q=j0;q<j;q++){P.push(nd[q].l,nd[q].t,nd[q].r);kk[F]+=nd[q].K;nn[F]++}
        for(let q=j-1;q>j0;q-=2)P.push(nd[q].i);P.push(nd[j0].i);dd[F]+=wr(P);j0=j}
      const out=[];for(const F of[0,1]){if(!dd[F])continue;const K=kk[F]/nn[F],sd=F?m.bshade:m.shade;let c=sf(F?bfr0:fr0);
        if(bud>0)c=mix(c,tipC(F?m.bstops:m.stops),o.budC*bud);if(o.green){const gt=o.green[0]*(1-svSm((ctx.op-o.green[1])/o.green[2]));if(gt>0)c=mix(c,o.greenC||'#7f9e52',gt*.8)}c=K<1?mix(c,sd,Math.min(.5,(1-K)*o.shd)):mix(c,'#ffffff',Math.min(.45,(K-1)*.8));if(fan>0)c=mix(c,o.brown,o.br*fan);out.push([dd[F],c])}
      const Lp=Lm*.8,prox=svSheet(Bq,Oq,(u,v)=>{const a=(u+1)/2*A,q=at(a);return V3.add(q[0],V3.sc(q[1],Lp*v*Math.max(.35,env(a))))},{nu:12,nv:1});
      pieces.push({proxy:prox,zb:sh.zb||0,fn:par=>{for(const[d,c]of out)E('path',o.op<1?{d,fill:c,'fill-opacity':o.op}:{d,fill:c},par)}})})}}
