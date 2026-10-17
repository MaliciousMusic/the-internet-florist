/* ---------- y3-rose3.js: the quartered garden rose's sutures on the rose kit (svRose, y3-rose.js; quarters: svRose2Quarter, y3-rose2.js) ----------
   An old rose seen from above (Charles de Mills 94, 103, Mme Hardy 118, Koenigin von Daenemark 177, Jacques Cartier 68): its flat heart parts
   into three to five quarters, each a fan of short folded petals round its own centre, and between two quarters runs a dark crease from the
   eye toward the rim. svRose2Quarter sinks the petals at a sector's edge; the crease itself is drawn here, as a thin strip lying on the heart
   along each sector's border, sorted in depth with the petals (the quarters' middles rise over its edges, a front outer petal patches over it
   on a three-quarter view). It is a heart hook of svRose (P.heart): svRose3Sutures(o) returns it; it draws nothing on the bud or a head seen
   from behind, and fades as the head fades. o: the strip from r0 to r1 (x R0) from the axis, its half width w (x R0) widest at wm, its height
   z (x R0) on the heart dipping by zr toward the rim, its darkness (op, the heart's shade mixed toward deep by dk), its age at [start, span]
   (op + decK x dec), like the quarters'. */
/* Irregular quarters (irr > 0; the photographs: Mme Hardy 118, Charles de Mills 94 never part into equal sectors): the head's quarters get
   unequal widths (irr), their borders bend along the radius (bend, radians at x = r/R0 = .5, an S by a second term) and their centres sit at
   unequal distances; all from a hash of the head (g.sd), cached on the genes. svRose3Sec(g,n,irr,bend) -> {a: borders' angles at the axis
   (n+1, the last = the first + 2 pi), b(j,x): border j's angle at x, at(phi): the quarter j holding angle phi near the axis, rk: centres' radius factors} */
function svRose3Sec(g,n,irr,bend){const key=n+':'+irr+':'+bend;if(g._s3&&g._s3.key===key)return g._s3;const sd=g.sd||1,rot=g.qr||0,w=[];let tw=0;
  for(let j=0;j<n;j++){const x=1+irr*(pxHashS(j,41,sd)-.5)*1.6;w.push(x);tw+=x}const a=[rot];for(let j=0;j<n;j++)a.push(a[j]+2*Math.PI*w[j]/tw);
  const bw=[],bs=[],rk=[];for(let j=0;j<=n;j++){bw.push(bend*(pxHashS(j%n,43,sd)-.5)*2);bs.push(bend*.6*(pxHashS(j%n,47,sd)-.5)*2)}
  for(let j=0;j<n;j++)rk.push(1+irr*.5*(pxHashS(j,53,sd)-.5));
  const b=(j,x)=>a[j]+bw[j]*4*x*x+bs[j]*Math.sin(Math.PI*Math.min(1,x/.55)),
    at=phi=>{let d=(phi-a[0])%(2*Math.PI);if(d<0)d+=2*Math.PI;for(let j=0;j<n;j++)if(d<a[j+1]-a[0])return j;return n-1};
  return g._s3={key,a,b,at,rk}}
const SVROSE3_SUT={r0:.05,r1:.6,w:.035,wm:.35,z:.3,zr:-.06,op:.8,dk:.35,deep:'#1a0a0c',at:[.42,.35],decK:.6,nv:7};
function svRose3Sutures(o){const Q=Object.assign({},SVROSE3_SUT,o||{});
  return c=>{const{B,O,R0,g,cw,op,bud,dec,fan,items}=c;if(bud>.2||toV(B,[0,0,1])[2]<-.05)return;
    const k=(g.qk==null?1:g.qk)*svSm((op+Q.decK*(dec||0)-Q.at[0])/Q.at[1])*(1-bud)*(1-(1-(Q.fk||0))*svSm((fan||0)/.6));if(k<.05)return;
    const n=Math.max(2,g.qn||4),sec=2*Math.PI/n,rot=g.qr||0,col=mix(mix(cw.shade,'#3a2014',(Q.fk||0)*svSm((fan||0)/.6)),Q.deep,Q.dk),SC=Q.irr?svRose3Sec(g,n,Q.irr,Q.bend||0):null;
    for(let j=0;j<n;j++){const a=SC?SC.a[j]:rot+j*sec+.12*(pxHashS(j,5,g.sd||1)-.5),ca=Math.cos(a),sa=Math.sin(a),
        /* the crease bends a little, as the folded petals push it (a hash of the head and the border) */bw=.18*(pxHashS(j,9,g.sd||1)-.5),
        r0j=Q.r0*(SC?.6+.9*pxHashS(j,59,g.sd||1):1),Sf=(u,v)=>{const r=R0*(r0j+(Q.r1-r0j)*v),b=SC?SC.b(j,r/R0):a+bw*v*v,hw=R0*Q.w*k*Math.pow(v<Q.wm?Math.sin(Math.PI/2*v/Q.wm):Math.cos(Math.PI/2*(v-Q.wm)/(1-Q.wm)),.8)+R0*.004,
          cb=Math.cos(b),sb=Math.sin(b);return[cb*r-sb*hw*u,sb*r+cb*hw*u,R0*(Q.z+Q.zr*v)]},
        px=svSheet(B,O,Sf,{nu:2,nv:Q.nv});
      items.push(Object.assign(svrFn(k2=>{const L=[],Rr=[],nv=DET<1.5&&Q.lo?Math.min(Q.nv,4):Q.nv;for(let i=0;i<=nv;i++){const v=i/nv;L.push(PJ(B,O,Sf(-1,v)));Rr.push(PJ(B,O,Sf(1,v)))}
        const pts=L.concat(Rr.reverse()).map(p=>[p[0],p[1]]);E('path',{d:svSpl(pts),fill:col,'fill-opacity':Q.op*k},k2)},px,R0*.01),{sut:1}))}}}
/* The quarters themselves (Mme Hardy 118, Charles de Mills 94, Souvenir de la Malmaison): each quarter is a group of short petals folded down
   toward its own centre, so from above it reads as petal margins lying in a spiral round that centre, their ends running into the creases.
   svRose3Rings(o) is a heart hook that lays them on the flat heart: per quarter its floor (one path: the heart's tone, dk darker, bounded by
   rho x R0 round the quarter's centre, rq x R0 out on the sector's middle), then S margins round the centre (radius from rho down to rho x
   (1-shrink), turned by the golden angle, each spanning sp radians): the shadow under each margin (one path for all, sh) and the lit lips
   (one path for all, th thick, lip lighter). Every point is squeezed softly into its sector (gap x R0 from the crease) and inside r1 x R0,
   on a low dome (z, dome x R0). Three paths a quarter. Fades as the sutures do. */
const SVROSE3_RG={fh:.55,rq:.3,rho:.26,fl:1.15,S:9,shrink:.85,sp:[.8,1.25],th:.05,sh:.035,gap:.025,r1:.52,z:.42,dome:.1,dk:.25,lip:.3,shOp:.5,jit:.06,at:[.42,.35],decK:.6,nt:9};
function svRose3Rings(o){const Q=Object.assign({},SVROSE3_RG,o||{}),ss=(x,p)=>x/Math.pow(1+Math.pow(Math.abs(x),p),1/p);
  return c=>{const{B,O,R0,g,cw,op,bud,dec,fan,items}=c;if(bud>.2||toV(B,[0,0,1])[2]<-.05)return;
    const k=(g.qk==null?1:g.qk)*svSm((op+Q.decK*(dec||0)-Q.at[0])/Q.at[1])*(1-bud)*(1-(1-(Q.fk||0))*svSm((fan||0)/.6));if(k<.05)return;
    const n=Math.max(2,g.qn||4),sec=2*Math.PI/n,rot=g.qr||0,sd=g.sd||1,fr=cw.fr,base=fr[fr.length-1][1],mid=(fr.find(x=>x[0]>=.6)||fr[fr.length-1])[1],
      R1=R0*Q.r1,fz=(Q.fk||0)*svSm((fan||0)/.6),tone=mix(mix(mix(mid,base,.5),cw.shade,Q.dk*k),'#5a3622',.6*fz),lipC=mix(tone,mix(cw.lite||'#ffffff','#b89878',fz),Q.lip*(1-.4*fz)),shC=mix(cw.shade,'#000000',.2+.3*fz),
      SC=Q.irr?svRose3Sec(g,n,Q.irr,Q.bend||0):null,
      /* the sector of quarter j at radius r: its middle angle and half width (bent borders when irregular) */
      sw=(j,r)=>{if(!SC){const cq=rot+(j+.5)*sec;return[cq,sec/2]}const x=Math.min(r,R1)/R0,lo=SC.b(j,x),hi=SC.b(j+1,x)+(j+1===n?0:0);return[(lo+hi)/2,(hi-lo)/2]},
      pt=(j,r,an)=>{const[cm,hs]=sw(j,r);let da=an-cm;da=Math.atan2(Math.sin(da),Math.cos(da));const m=Math.max(.05,hs-Q.gap*R0/Math.max(r,R0*.03)),a=cm+m*ss(da/m,4),rr=R1*ss(r/R1,6),h=1-(rr/R1)*(rr/R1);
        return[Math.cos(a)*rr,Math.sin(a)*rr,R0*(Q.z+Q.dome*h)]},
      P2=(j,x,y)=>{const p=PJ(B,O,pt(j,Math.hypot(x,y),Math.atan2(y,x)));return[p[0],p[1]]};
    for(let j=0;j<n;j++){const cq0=sw(j,R0*Q.rq)[0],cq=SC?cq0+.25*(sw(j,R0*Q.rq)[1])*(pxHashS(j,61,sd)-.5):cq0,rqj=Q.rq*(SC?SC.rk[j]:1),Cx=Math.cos(cq)*R0*rqj,Cy=Math.sin(cq)*R0*rqj,th0=6.28*pxHashS(j,17,sd),
        Sf=(u,v)=>{const r=R1*(.08+.92*v),[cm,hs]=sw(j,r);return pt(j,r,cm+u*hs)},px=svSheet(B,O,Sf,{nu:2,nv:4});
      /* arc mode (Q.arc; Mme Hardy 118, Charles de Mills 94, Souvenir de la Malmaison): the quarter is its whole SECTOR filled to the cup's rim, its
         short petals folded over as open arcs spanning the sector from fold to fold (bowed toward the rim, their ends tucked down into the folds),
         nested from the rim toward the eye, none closed round a centre; each quarter its own count, bow, tilt and tone (no repeated motif) */
      if(Q.arc){const hq=(i,s)=>pxHashS(j*29+i,s,sd),bow=Q.arc[0]+(Q.arc[1]-Q.arc[0])*hq(0,71),tilt=(hq(0,73)-.5)*Q.arc[2];let tq=mix(tone,cw.shade,.16*hq(0,79)*k);
        /* soft (Q.soft [floor, lip, shadow]): the quarters in the petals' own tone, read by folds and shades, never by dark floors (BP 3.6):
           the floor the body's tone a little shaded, the lips lit toward lite, the shade under a lip between the shade and the floor */
        let lC=lipC,sC=shC;if(Q.soft){const s=Q.soft,m0=mix(mid,fr[0][1],.5);tq=mix(mix(m0,cw.shade,s[0]*(.75+.5*hq(0,79))*k),'#5a3622',.6*fz);lC=mix(m0,cw.lite||'#ffffff',s[1]);sC=mix(cw.shade,tq,s[2])}
        items.push(Object.assign(svrFn(k2=>{const lo=DET<1.5,nt=lo?5:11,nS=Math.max(4,Math.round((lo?Q.S*(Q.lo||.7):Q.S)*(.8+.4*hq(0,83)))),SP=(u,v)=>{const p=PJ(B,O,Sf(u,v));return[p[0],p[1]]};
          const so=[];for(let t=0;t<=nt;t++)so.push(SP(-1+2*t/nt,1));for(let t=nt;t>=0;t-=2)so.push(SP(-1+2*t/nt,.02));E('path',{d:svSpl(so),fill:tq},k2);
          let dS='',dL='',dI='';
          /* one fold: the arc from u0 to u1 at depth v (its middle bowed out by bw), a lens back toward the eye from d0 to d1 (v units) */
          const arc=(v,u0,u1,bw,d0,d1)=>{const A=[],Bk=[];for(let t=0;t<=nt;t++){const s=t/nt,u=u0+(u1-u0)*s,b=.18+.82*Math.pow(Math.sin(Math.PI*s),.7),x=(2*s-1),vv=v+bw*(1-x*x)+tilt*u+(Q.wav||0)*.5*Math.sin(Math.PI*s*(Q.wn||3)+v*9)*b;
              A.push(SP(u,Math.min(1,vv-d0*b)));Bk.push(SP(u,Math.max(.01,vv-d1*b)))}return svSpl(A.concat(Bk.reverse()))};
          const gv=[];let gs=0;for(let i=0;i<nS;i++){const gg=.45+1.1*hq(i+1,23);gv.push(gs+gg);gs+=gg}
          for(let i=0;i<nS;i++){const x=i/Math.max(1,nS-1),h1=hq(i+1,11),h2=hq(i+1,19),v=.97-.86*Math.pow(gv[i]/gs,.85),
              c0=(h2-.5)*.9*(1-.4*x),hl=(.45+.5*h1)*(1-.2*x),u0=Math.max(-.92,c0-hl),u1=Math.min(.92,c0+hl),bw=bow*(1-.5*x)*(.7+.6*h2),th=Q.th*2.4*(.6+.4*(1-x));
            dS+=arc(v-th*.4,u0,u1,bw,0,Q.sh*2.6+th*.6);if(x>.55)dI+=arc(v,u0+.04,u1-.04,bw,0,th);else dL+=arc(v,u0+.04,u1-.04,bw,0,th)}
          E('path',{d:dS,fill:sC,'fill-opacity':Q.shOp*k},k2);E('path',{d:dL,fill:lC},k2);if(dI)E('path',{d:dI,fill:mix(lC,tq,.45)},k2)},px,R0*.01),{sut:1}));continue}
      items.push(Object.assign(svrFn(k2=>{const fl=[];
        const nF=DET<1.5&&Q.lo?12:20;for(let t=0;t<nF;t++){const a=t/nF*6.283,w=1+Q.jit*Math.sin(2*a+th0)+Q.jit*Math.sin(3*a+2*th0);fl.push(P2(j,Cx+Math.cos(a)*R0*Q.rho*Q.fl*w,Cy+Math.sin(a)*R0*Q.rho*Q.fl*w))}
        E("path",{d:svSpl(fl),fill:tone},k2);let dS='',dL='';
        /* below DET 1.5 fewer margins, of fewer points (the budget) */const lo=DET<1.5,nt=lo?Math.max(4,Q.nt-4):Q.nt,nS=lo?Math.round(Q.S*(Q.lo||.7)):Q.S;
        /* a margin: the arc at radius r from a-s to a+s round the centre, and back along r - d x bump (a lens) */
        const lens=(r,a,s,d0,d1)=>{const A=[],Bk=[];for(let t=0;t<=nt;t++){const u=t/nt,b=Math.sin(Math.PI*u),aa=a-s+2*s*u,ca=Math.cos(aa),sa=Math.sin(aa);
            const wv=1+(Q.wav||0)*Math.sin(Math.PI*u*(Q.wn||3)+a*3.7)*b;A.push(P2(j,Cx+ca*(r*wv-d0*b),Cy+sa*(r*wv-d0*b)));Bk.push(P2(j,Cx+ca*(r*wv-d1*b),Cy+sa*(r*wv-d1*b)))}return svSpl(A.concat(Bk.reverse()))};
        for(let i=0;i<nS;i++){const u=i/Math.max(1,nS-1),h1=pxHashS(j*13+i,11,sd),h2=pxHashS(j*13+i,19,sd),r=R0*Q.rho*(1-Q.shrink*u)*(1+Q.jit*(h1-.5)),
            a=th0+i*2.39996+.4*(h2-.5),s=Q.sp[0]+(Q.sp[1]-Q.sp[0])*h1,th=R0*Q.th*(.55+.45*(1-u));
          dS+=lens(r-th*.4,a,s*1.02,0,R0*Q.sh+th*.6);dL+=lens(r,a,s,0,th)}
        E('path',{d:dS,fill:shC,'fill-opacity':Q.shOp*k},k2);E('path',{d:dL,fill:lipC},k2)},px,R0*.01),{sut:1}))}}}
/* the heart's petals under the quarters: once the quarters are laid (svRose3Rings, same age law), the ranks beyond fh would only poke through
   them (and cost elements), so the petal hook base (svRose2Quarter) is followed by q.skip on those ranks (svRose draws no piece for them) */
function svRose3Under(base,o){const Q=Object.assign({},SVROSE3_RG,o||{});
  return(q,c)=>{if(base)base(q,c);const g=c.g;if(q.f<=Q.fh||c.bud>.2)return;
    const k=(g.qk==null?1:g.qk)*svSm((c.op+Q.decK*(c.dec||0)-Q.at[0])/Q.at[1])*(1-c.bud)*(1-(1-(Q.fk||0))*svSm((c.fan||0)/.6));if(k>=.05)q.skip=1}}
