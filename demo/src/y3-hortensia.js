/* ================= y3-hortensia.js : the hydrangea floret as thin tissue sepals (svBoule sepal mode, hook P.sepDraw) =================
   svHySep(k,X) draws the open florets of a ball in place of bouSep (bouSep still draws the closed buds, wb < hy.w0, .5; hy.upY raises the young sepals toward a closed pointed bud). Each floret is drawn whole,
   far to near (painter's order): its cast shadow falls crisp on the florets behind it, and the small gaps between its sepals (narrow claws)
   show the deeper, darker florets and the ball's core (BONNES-PRATIQUES 4.8c: thin and light, never soft uniform discs).
   A sepal is a thin obovate blade on a short claw with its own 3-D surface: tilt out of the floret's plane, cross cup, a tip that lifts or
   reflexes, a twist, a faint wave toward the margin. Its outline runs through ~22 projected points (Catmull-Rom); it is filled with its own
   gradient from the throat (deep) through the body to the tip, each stop toned by the surface's normal there; the half turned from the light
   is shaded along the midrib fold; a thin pale band on the free edge where light comes through (stronger on the lit side); fine radiating
   veins as tapering slivers that stop short of the edge. No outline stroke anywhere (3.6, 3.6b). Faded (fan): margins roll in, tips twist,
   the outline dents, creases with their lit ridges, fine flecks, a browned margin of constant width (C.rimBand).
   Spec P.hy (all optional): i0 ig (lightness of a facet: (I - i0) x ig), kB (the ball's own shading), ao (the shade of a floret set deeper than
   its neighbours), thr (throat), hS (a white heart stretched to that share of the sepal, picotee-like rim: 942), claw, xm (widest point), tipP (tip roundness: 2 round .. 1.2 pointed), curl (tip lift), tw (twist), wav
   (margin wave), eb [lit, shaded] (edge light band), ebW, hs (fold shade), vn (vein opacity), vN (veins per sepal), ss (shadow of a sepal on its
   floret), fs [[offset, opacity]...] (a floret's cast shadow passes), eye (eye width x s) */
function svHyCR(Q){const n=Q.length,g=i=>Q[(i+n)%n],S=[];for(let i=0;i<n;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
    S.push([p1,[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6],p2])}return S}
const svHyP=p=>svJ([svR(p[0]),svR(p[1])]);
/* bezier segments a..b (indices, wrapping) as a path continuation (no M) */
function svHySeg(S,a,b){let d='';const n=S.length,m=((b-a+n-1)%n)+1;for(let c=0,i=a;c<m;c++,i=(i+1)%n){const s=S[i];d+='C'+svHyP(s[1])+' '+svHyP(s[2])+' '+svHyP(s[3])}return d}
function svHyLens(a,c,b,w){/* a tapering sliver from a to b bowed through c, half width w (screen) at its middle */
  const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w;
  return'M'+svHyP(a)+'Q'+svHyP([c[0]+nx*2,c[1]+ny*2])+' '+svHyP(b)+'Q'+svHyP([c[0]-nx*2,c[1]-ny*2])+' '+svHyP(a)+'z'}
function svHySep(k,X){const{B,O,P,C,fl,s,fo,fan,dec,hi,shv,clip}=X,wb=svSm((fo-.08)/.6),w0=(P.hy&&P.hy.w0)||.5;if(wb<w0)return bouSep(k,X);
  const H=Object.assign({i0:.62,ig:2.2,kB:.35,ao:.6,thr:.4,claw:.16,xm:.58,wK:1,tipP:1.7,curl:.22,tw:.25,wav:.05,eb:[.55,.2],ebW:.045,hs:.5,vn:.22,vN:5,ss:.12,
      fs:[[.55,.2],[1.05,.2]],eye:.065},P.hy||{},(C.m&&C.m.hy)||{}),
    sc3=p=>{const v=PJ(B,O,p);return[v[0],v[1]]},LL=LIGHT,V=C.vs,sA=P.sepA||[1.2,.22],al0=sA[0]+(sA[1]-sA[0])*fo,sw0=(C.m&&C.m.sepW)||P.sepW||.56,kr=X.kr,
    tp=P.sepTip||0,yg=1-svSm((wb-w0)/(.9-w0)),pW=H.tipP-.6*tp+(H.pY??-.55)*yg,clw=H.claw+(.42-H.claw)*yg,xmY=H.xm-.08*yg,cr=P.crum?fan:0,R1=X.R1||s*3,lv=[LL[0],-LL[1]],lvl=Math.hypot(lv[0],lv[1])||1,
    fsK=1+.9*svSm((hydLchOf(C.body)[0]-80)/12),cid='hc'+(gid++),clipA=a=>{a['clip-path']=`url(#${cid})`;return a};
  const tone=(vq,t)=>t>=0?mix(vq.bo,vq.li,Math.min(1,t)):t>-1?mix(vq.bo,vq.sh,-t):mix(vq.sh,vq.dp,Math.min(1,-t-1));
  /* the half width of a sepal at x (0 claw .. 1 tip), as a fraction of its widest */
  /* (H.og) an ogival tip: convex sides meeting at an acute point (61, 84), blended into the rounded superellipse */
  const og=H.og||0,wAt=x=>{if(x<=xmY)return clw+(1-clw)*Math.pow(Math.sin(1.5708*x/xmY),H.wK);const u=(x-xmY)/(1-xmY),se=Math.pow(Math.max(0,1-Math.pow(u,pW)),1/pW);return og?se+(Math.max(0,1-u*u)-se)*og:se};
  const sw=sw0*(1+.3*yg),rY=1+.12*yg;
  const XS=[.03,.1,.2,.32,.45,.58,.7,.8,.88,.94,.98],cm=C.m||{},dA=cm.dent||0,dN=cm.dentN||14,wv=cm.wav??H.wav;
  const L=fl.slice().sort((a,b)=>a.z-b.z),G=[];let cd='';
  for(const q of L){const t1=V3.nz(V3.cr(q.nf,Math.abs(q.nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(q.nf,t1),nl=q.nl,lj=j=>q.lj[((j%5)+5)%5],
      h=(m,j)=>pxHashS(q.i*7+j,m,29),dv=a=>V3.add(V3.sc(t1,Math.cos(a)),V3.sc(t2,Math.sin(a))),v=P.vpick?P.vpick(q,X):0;
    /* a floret set deeper than its neighbours sits in their shade */
    const cl=[q.c[0],q.c[1],q.c[2]/(P.flat||1)],lr=V3l(cl)/R1-1,ao=H.ao*Math.max(0,Math.min(1,-lr/.08))+(.25*Math.max(0,-q.n0v[2])),
      dB=V3.dot(q.n0v,LL)-.45,Ey=sc3(V3.add(q.c,V3.sc(q.nf,s*.03))),zf=PJ(B,O,q.c)[2];
    const seps=[],under=lj(4)<.5?0:1;
    for(let j=0;j<nl;j++){const at=q.rot+j*6.2832/nl+(lj(j)-.5)*.3,r=rY*s*kr*(1+P.lobeJ*(lj(j+2)*2-1))*(cr?1-.25*cr*Math.pow(lj(j+4),2):1),
        al=al0+(H.upY||0)*yg+(lj(j+3)-.5)*.3*wb+fan*(P.sepF??.4)*(q.dr-.3),ca=Math.cos(al),sa=Math.sin(al),u=dv(at),vv=dv(at+1.5708),
        sk=(h(1,j)-.5)*.3,roll=o=>cr?1-P.crum[0]*cr*(.5+h(o,j)):1,Wl=sw*r*(1-sk)*roll(2),Wr=sw*r*(1+sk)*roll(3),
        curl=(h(4,j)-.38)*2*H.curl+fan*.25*(h(5,j)-.2),tw=(h(6,j)-.5)*2*H.tw+(cr?P.crum[1]*cr*(h(7,j)-.5):0),wph=h(8,j)*6.28,cup=(P.sepC||0),
        /* the sepal's surface: x 0..1 along, y across (absolute) */
        S3=(x,y)=>{const W=y<0?Wl:Wr,yn=W?Math.abs(y)/W:0,z=x*r*sa+cup*y*y/r+curl*r*x*x*x+tw*y*x+wv*r*yn*yn*Math.sin(x*7.5+wph+(y<0?0:2.1));
          return V3.add(V3.add(q.c,V3.add(V3.sc(u,x*r*ca),V3.sc(vv,y))),V3.sc(q.nf,z))},
        nAt=(x,y)=>{const e=.02,a=V3.add(S3(x+e,y),V3.sc(S3(x-e,y),-1)),b=V3.add(S3(x,y+e*r),V3.sc(S3(x,y-e*r),-1));let n=V3.nz(V3.cr(a,b));if(V3.dot(n,q.nf)<0)n=V3.sc(n,-1);return n},
        /* the dried outline dented: widths pulled in or out from the genes (81) */
        dent=(i,sd)=>{if(!cr)return 1;const kk=i/3,i1=Math.floor(kk),f=kk-i1,o=sd>0?11:0,a=h(10+i1+o,j)-.5,b=h(11+i1+o,j)-.5;return 1+cr*.45*(a+(b-a)*f*f*(3-2*f))},
        /* (C.m.dent) a crisped margin (52, the creams): fine teeth on the outer half, irregular in spacing and depth, rounded by the spline
           (never a regular saw, 3.8); the tip itself nicked */
        xs=dA?XS.filter(x=>x<.42).concat(Array.from({length:dN},(_,m)=>.42+.565*Math.min(1,(m+.5+(h(30+m,j)-.5)*.7)/dN))):XS,
        cp=(i,sd)=>dA&&xs[i]>=.42?(((i+(sd>0?1:0)+(h(70+i+(sd>0?40:0),j)<.22?1:0))%2)?-1:1)*(.15+.85*h(50+i+(sd>0?40:0),j))*dA*(1-.6*fan)*r*(.6+.4*Math.min(1,xs[i]*1.4)):0,
        Lp=xs.map((x,i)=>sc3(S3(x,-Math.max(0,Wl*wAt(x)*dent(i,-1)+cp(i,-1))))),Rp=xs.map((x,i)=>sc3(S3(x,Math.max(0,Wr*wAt(x)*dent(i,1)+cp(i,1))))),
        xT=1-(dA?dA*.8*h(9,j):0),T=sc3(S3(xT,0)),B0=sc3(S3(0,0));
      const loop=[B0,...Lp,T,...Rp.slice().reverse()],SG=svHyCR(loop),nL=xs.length,iT=nL+1,i0=xs.findIndex(x=>x>=.45);
      const nm=nAt(.5,0),nmv=toV(B,nm),back=nmv[2]<0,sg=back?-1:1,Iof=(x,y)=>{const nv=toV(B,nAt(x,y));return V3.dot(V3.sc(nv,sg),LL)},
        vq=V[back&&C.bkI!=null?C.bkI:v],tv=x=>(Iof(x,0)-H.i0)*H.ig+H.kB*dB-ao,
        IL=Iof(.55,-Wl*.5),IR=Iof(.55,Wr*.5),zm=PJ(B,O,S3(.5,0))[2];
      /* the clip of the cast shadows: every sepal, wound the same way (nonzero union), so no shadow falls on the background */
      let ar=0;for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length];ar+=a[0]*b[1]-b[0]*a[1]}
      const CQ=svHyCR(ar<0?loop.slice().reverse():loop);cd+='M'+svHyP(CQ[0][0])+svHySeg(CQ,0,0)+'z';
      /* a sepal seen edge-on, twisted or crisped can pinch to nothing on screen (its two margins meet or cross): the outer part would then
         read as a loose scrap off the ball (QA: a floating piece, 19 seed 7). The real blade stays whole along its midrib: such a sepal gets
         a narrow band of its own paint along the midline (never an outline) */
      const mw=Math.max(.8,r*.06),Mp=xs.map(x=>sc3(S3(x,0))),Ms=xs.filter(x=>x<xT-.04).map(x=>sc3(S3(x,0))).concat([sc3(S3(Math.max(.5,xT-.03-mw*.5/r),0))]);let pin=0,sg0=0;
      for(let i=0;i<nL&&!pin;i++){const a=Mp[Math.max(0,i-1)],b=Mp[Math.min(nL-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,
          w=(Rp[i][0]-Lp[i][0])*nx+(Rp[i][1]-Lp[i][1])*ny,sgn=w>0?1:-1;if(Math.abs(w)<mw||sg0&&sgn!==sg0)pin=1;sg0=sgn}
      /* a sepal whose half folds over (strong curl, roll or crumple: the projected margin runs out as a thin spike and back) leaves its
         folded surface outside its own outline: the outline's area falls short of the strips midrib -> margin. Such a sepal gets an
         underbody of its own paint: the strips midrib -> 90 % of the width, each wound the same way (nonzero union), so the folded part
         stays one piece with the blade (never past the crisped teeth) */
      const qa=(a,b,c,d)=>((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1])+(c[0]-a[0])*(d[1]-a[1])-(d[0]-a[0])*(c[1]-a[1]))/2;let aq=0;
      for(let i=0;i+1<nL;i++)aq+=Math.abs(qa(Mp[i],Lp[i],Lp[i+1],Mp[i+1]))+Math.abs(qa(Mp[i],Rp[i],Rp[i+1],Mp[i+1]));
      let ub='';if(aq>Math.abs(ar)/2*1.12+mw*mw){const P9=(i,sd)=>sc3(S3(xs[i],sd*.9*Math.max(0,(sd<0?Wl:Wr)*wAt(xs[i])*dent(i,sd)))),qd=Q=>{const A=qa(...Q);if(Math.abs(A)<1e-4)return;
          const R=A<0?Q.slice().reverse():Q;ub+='M'+R.map(svHyP).join('L')+'z'};
        for(let i=0;i+1<nL;i++)for(const sd of[-1,1])qd([Mp[i],P9(i,sd),P9(i+1,sd),Mp[i+1]])}
      seps.push({j,xs,i0,SG,iT,nL,Lp,Rp,T,B0,S3,vq,tv,IL,IR,Wl,Wr,r,u,vv,back,pin,mw,Ms,ub,key:((j%2)===under?0:1)*s*.35*Math.abs(q.nv[2])+(zm-zf)})}
    seps.sort((a,b)=>a.key-b.key);G.push({q,seps,Ey})}
  E('path',{d:cd},E('clipPath',{id:cid},GDEF||defs));
  /* the cast shadows' points are kept within the box of the sepals they fall on: the clip already hides what lies beyond, and so the head's
     getBBox (which ignores clipping) stays that of its visible florets (the bouquet tests a head's bottom against the rim: rtest) */
  let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;for(const{seps}of G)for(const S of seps)for(const g of S.SG)for(const p of g)if(p){if(p[0]<bx0)bx0=p[0];if(p[0]>bx1)bx1=p[0];if(p[1]<by0)by0=p[1];if(p[1]>by1)by1=p[1]}
  const inB=p=>[Math.max(bx0,Math.min(bx1,p[0])),Math.max(by0,Math.min(by1,p[1]))];
  for(const{q,seps,Ey}of G){
    /* the floret's cast shadow on the florets behind (crisp, two passes for a narrow penumbra) */
    for(const[o,a]of H.fs){let d='';const sh=p=>inB([p[0]+shv[0]*o,p[1]+shv[1]*o]);for(const S of seps){const Q=S.SG;d+='M'+svHyP(sh(Q[0][0]));for(const g of Q)d+='C'+svHyP(sh(g[1]))+' '+svHyP(sh(g[2]))+' '+svHyP(sh(g[3]));d+='z'}
      E('path',clipA({d,fill:C.deep,'fill-opacity':svF(Math.min(.6,a*(1-.4*fan)*fsK))}),k)}
    seps.forEach((S,si)=>{const Q=S.SG,out='M'+svHyP(Q[0][0])+svHySeg(Q,0,0)+'z';
      /* a sepal laid over its neighbours casts a thin shadow on them */
      if(si>=Math.floor(seps.length/2)&&H.ss>0){const sh=p=>inB([p[0]+shv[0]*H.ss,p[1]+shv[1]*H.ss]);let d='M'+svHyP(sh(Q[0][0]));for(const g of Q)d+='C'+svHyP(sh(g[1]))+' '+svHyP(sh(g[2]))+' '+svHyP(sh(g[3]));
        E('path',clipA({d:d+'z',fill:C.deep,'fill-opacity':.26}),k)}
      /* (a sepal seen from below shows little of the throat's green) */
      const thK=S.back?.45:1;
      /* the body: its own gradient, throat -> body -> tip, each stop toned by the surface there */
      const c1=tone(S.vq,S.tv(.15)),c2=tone(S.vq,S.tv(.5)),c3=tone(S.vq,S.tv(.88)),gl=Math.hypot(S.T[0]-S.B0[0],S.T[1]-S.B0[1]);let fill=c2;
      if(gl>.8){const id='hy'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(S.B0[0]),y1:svF(S.B0[1]),x2:svF(S.T[0]),y2:svF(S.T[1])},GDEF||defs);
        const th=C.throat,tk=C.thr??H.thr;stops(gr,th&&H.hS?[[0,mix(c1,th,.95*thK)],[H.hS*.55,mix(c2,th,.9*thK)],[H.hS,mix(c2,th,.4*thK)],[Math.min(.95,H.hS+.12),c3],[1,mix(c3,S.vq.li,.25)]]:th?[[0,mix(c1,th,.9*thK)],[.13,mix(c1,th,.5*thK)],[.3,mix(c1,c2,.5)],[.5,c2],[.86,c3],[1,mix(c3,S.vq.li,.25)]]:[[0,mix(c1,S.vq.dp,tk)],[.22,mix(c1,S.vq.sh,tk*.3)],[.5,c2],[.86,c3],[1,mix(c3,S.vq.li,.25)]]);fill=`url(#${id})`}
      if(S.ub)E('path',{d:S.ub,fill},k);
      E('path',{d:out,fill},k);
      if(S.pin)E('path',{d:'M'+svHyP(S.B0)+S.Ms.map(p=>'L'+svHyP(p)).join(''),fill:'none',stroke:fill,'stroke-width':svF(S.mw),'stroke-linecap':'round','stroke-linejoin':'round'},k);
      /* the fold: the half turned from the light, shaded along the midrib */
      const dI=S.IL-S.IR,hsO=Math.min(.55,Math.abs(dI)*H.hs*2.2);if(hsO>.04){const left=dI<0,mid=[.9,.7,.5,.3,.12].map(x=>sc3(S.S3(x,0)));
        let d;if(left)d='M'+svHyP(Q[0][0])+svHySeg(Q,0,S.iT)+mid.map(p=>'L'+svHyP(p)).join('')+'z';
        else d='M'+svHyP(S.T)+svHySeg(Q,S.iT,0)+mid.slice().reverse().map(p=>'L'+svHyP(p)).join('')+'L'+svHyP(S.T)+'z';
        E('path',{d,fill:S.vq.sh,'fill-opacity':svF(hsO)},k)}
      /* light through the thin free edge: a band of constant width inside the outline, from the shoulders over the tip */
      if(!cr||fan<.5){const bw=H.ebW*S.r,i0=S.i0,in3=(x,y)=>sc3(S.S3(x,y));for(const sd of[-1,1]){const W=sd<0?S.Wl:S.Wr,sx=bouSc(B,V3.sc(S.vv,sd)),lit=(sx[0]*lv[0]+sx[1]*lv[1])/((Math.hypot(sx[0],sx[1])||1)*lvl);
          const o=(lit>0?H.eb[0]:H.eb[1])*(S.back?.6:1)*(1-fan);if(o<.03)continue;
          /* the outer edge on the body's own curve (never a hair outside it), the inner edge a constant width inside */
          const xs=S.xs.slice(i0),inner=xs.map(x=>in3(Math.min(.985,x),sd*Math.max(0,W*wAt(x)-bw))),tipI=in3(1-bw/S.r*1.2,0),nL=S.nL,iT=S.iT;let d;
          if(sd<0){d='M'+svHyP(Q[i0+1][0])+svHySeg(Q,i0+1,iT)+'L'+svHyP(tipI);for(const p of inner.slice().reverse())d+='L'+svHyP(p)}
          else{d='M'+svHyP(S.T)+svHySeg(Q,iT,iT+nL-i0);for(const p of inner)d+='L'+svHyP(p);d+='L'+svHyP(tipI)}
          E('path',{d:d+'z',fill:mix(S.vq.li,'#ffffff',.35),'fill-opacity':svF(o)},k)}}
      /* fine veins: tapering slivers from the claw, stopping short of the edge */
      if(hi&&H.vn>0){let d='';const n=H.vN,w=Math.max(.12,S.r*.009);for(let m=0;m<n;m++){const f=n>1?m/(n-1)*2-1:0,W=f<0?S.Wl:S.Wr,ye=f*W*wAt(.8)*.78,
          a=sc3(S.S3(.08,f*S.r*.03)),c=sc3(S.S3(.45,ye*.5)),b=sc3(S.S3(Math.abs(f)>.7?.72:.84,ye));d+=svHyLens(a,c,b,w*(m===(n-1)/2?1.4:1))}
        E('path',{d,fill:S.vq.dp,'fill-opacity':svF(Math.min(.5,H.vn*(1+(P.crum?P.crum[2]*fan:0))))},k)}
      /* faded: creases (a dark fold and its lit ridge), a rolled margin, fine flecks, the browned edge band */
      if(cr>.05){let dk='',dl='',dsp='';const P2=(x,y)=>sc3(S.S3(x,y));
        for(let m=0;m<(hi?3:2);m++){const a=.2+.22*m+.1*pxHashS(q.i*5+S.j,m,41),sd=pxHashS(q.i*5+S.j,m,43)>.5?1:-1,W=sd>0?S.Wr:S.Wl,b=Math.min(.86,a+.14),
            yc=sd*W*.45;dk+='M'+svHyP(P2(a,sd*W*.06))+'Q'+svHyP(P2((a+b)/2,yc))+' '+svHyP(P2(b,sd*W*.8*wAt(b)));dl+='M'+svHyP(P2(a+.03,sd*W*.1))+'Q'+svHyP(P2((a+b)/2+.03,yc))+' '+svHyP(P2(b+.02,sd*W*.72*wAt(b)))}
        const sd=q.lj[4]<.5?1:-1,W=sd>0?S.Wr:S.Wl;dk+='M'+svHyP(P2(.3,sd*W*.6*wAt(.3)))+'Q'+svHyP(P2(.6,sd*W*.84))+' '+svHyP(P2(.86,sd*W*.75*wAt(.86)));
        const nF=Math.round((hi?11:4)*(.4+.6*pxHashS(q.i,S.j,19)));for(let m=0;m<nF;m++){const uu=pxHashS(q.i*7+S.j,m,11),vv=pxHashS(q.i*7+S.j,m,23)*2-1;dsp+='M'+svHyP(P2(.2+.72*uu,vv*(vv>0?S.Wr:S.Wl)*.8*wAt(.2+.72*uu)))+'h0'}
        E('path',{d:dk,fill:'none',stroke:S.vq.dp,'stroke-width':svF(Math.max(.25,s*.02)),'stroke-opacity':svF(.42*cr),'stroke-linecap':'round'},k);
        E('path',{d:dl,fill:'none',stroke:S.vq.li,'stroke-width':svF(Math.max(.2,s*.018)),'stroke-opacity':svF(.45*cr),'stroke-linecap':'round'},k);
        E('path',{d:dsp,fill:'none',stroke:C.fleck||C.deep,'stroke-width':svF(Math.max(.45,s*.03)),'stroke-linecap':'round','stroke-opacity':svF(Math.min(.8,.95*fan))},k)}
      /* the browned margin: two bands (full width, then half) so it deepens toward the edge instead of reading as an outline (3.6) */
      if(C.rimBand&&C.rimO>0)for(const[wf,of]of C.m&&C.m.rim?[[1,1]]:[[1,.5],[.45,.62]]){const bw=(C.rimW||.08)*s*wf,in3=(x,y)=>sc3(S.S3(x,y)),inner=XS.map(x=>in3(x,-Math.max(0,S.Wl*wAt(x)-bw))),inR=XS.map(x=>in3(x,Math.max(0,S.Wr*wAt(x)-bw))).reverse();
        let d='M'+svHyP(Q[1][0])+svHySeg(Q,1,Q.length-1);for(let i=inR.length-1;i>=0;i--)d+='L'+svHyP(inR[i]);d+='L'+svHyP(in3(1-bw/S.r*1.2,0));for(let i=inner.length-1;i>=0;i--)d+='L'+svHyP(inner[i]);
        E('path',{d:d+'z',fill:C.rim,'fill-opacity':svF(C.rimO*of)},k)}});
    /* the eye: small and crisp, a fine dark ring, a pinpoint of light */
    if(q.nv[2]>.12&&fo>.3&&!LOD){const w=Math.max(.35,s*H.eye),dd='M'+svHyP(Ey)+'h0';
      E('path',{d:dd,fill:'none',stroke:C.deep,'stroke-width':svF(w*1.5),'stroke-linecap':'round','stroke-opacity':.4},k);
      E('path',{d:dd,fill:'none',stroke:C.eye,'stroke-width':svF(w),'stroke-linecap':'round'},k);
      if(hi)E('path',{d:'M'+svHyP([Ey[0]+lv[0]/lvl*w*.18,Ey[1]+lv[1]/lvl*w*.18])+'h0',fill:'none',stroke:C.eyeL||C.light,'stroke-width':svF(w*.42),'stroke-linecap':'round','stroke-opacity':.85},k)}}
  return k}
