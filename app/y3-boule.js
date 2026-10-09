/* ================= y3-boule.js : a ball of sterile florets (snowball viburnum; also V. macrocephalum, V. plicatum 'Sterile', mophead hydrangeas) =================
   svBoule(par,B,O,D,S,cwx,op,seed,wl,o): florets laid on an ellipsoid (a jittered golden spiral), each a flat wheel of 4 or 5 rounded lobes facing
   along the ball's normal (tilted at random), the young ones small and closed (buttons), the open ones large and overlapping. Drawn far to near in a
   few depth bands; in each band one path per tone (the tones are radial gradients over the whole ball, so the ball reads as a sphere), the band's
   shadow cast on the bands behind it (one path of ellipses), the floret eyes (one path). DET 1: lobes as quadratic arches; DET >= 1.5: throats washed,
   lobe creases.
   B local frame (B[2] = the ball's axis, from its stalk through its top), O centre, D outer diameter, op opening 0 (bud) .. 1 (full), wl wilt 0..1.
   S (merged on SVBOU_DEF, cached in S._m): genes and life below; hooks phase(cwx,op,wl,o) -> colour phase, col(phase,cwx) -> {body,light,shade,
   deep,eye,brown,stalk}. o: {att: the stalk's end in view space (offset from O), age: 0..1 of the bouquet's bloom}. Self-contained (y1.js helpers). */
const SVBOU_DEF={n:[100,210],nD:7,s:[.40,.33],r1:.8,flat:.93,
  grow:[[0,.42],[.1,.48],[.35,.72],[.7,.95],[1,1]],sz:[[0,.5],[.1,.55],[.35,.7],[.7,.93],[1,1]],fo:[.3,.5],cap:-.86,jit:[.1,.5],lump:[.025,.1],
  lobes:[[5,.8],[4,.2]],notch:.42,lw:.5,lobeJ:.16,cup:.2,fold:.55,dec:[.1,.4],fan:[.55,.2],shed:[.72,.22],shedF:.62,droop:1.1,droopF:.42,shriv:.27,tip:[.55,.55,.3],
  bands:[7,12],shade:.17,sh:[.4,.55],gr:1.05,wall:[.8,.4,.55,.15],core:.96,eye:.16,stalkW:.07};
const bouIp=(T,x)=>{if(x<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(x<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
/* CIE L*C*h (D65) to #rrggbb, clipped to sRGB */
function bouLch(L,C,h){const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180),fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,
    iv=t=>t>.206893?t*t*t:(t-16/116)/7.787,X=.95047*iv(fx),Y=iv(fy),Z=1.08883*iv(fz),g=v=>{v=v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055;return Math.max(0,Math.min(255,Math.round(v*255)))};
  const r=g(3.2406*X-1.5372*Y-.4986*Z),gg=g(-.9689*X+1.8758*Y+.0415*Z),bb=g(.0557*X-.204*Y+1.057*Z);return'#'+[r,gg,bb].map(v=>v.toString(16).padStart(2,'0')).join('')}
/* CIE Lab to #rrggbb */
const bouLab=(L,a,b)=>bouLch(L,Math.hypot(a,b),Math.atan2(b,a)*180/Math.PI);
/* a colour curve [[phase,L,C,h]...] at phase p as [L,a,b] (interpolated in Lab) */
function bouCurveLab(T,p){p=Math.max(T[0][0],Math.min(T[T.length-1][0],p));let i=1;while(i<T.length-1&&p>T[i][0])i++;const A=T[i-1],Bq=T[i],t=(p-A[0])/((Bq[0]-A[0])||1),
    ab=q=>[q[2]*Math.cos(q[3]*Math.PI/180),q[2]*Math.sin(q[3]*Math.PI/180)],a0=ab(A),a1=ab(Bq);return[A[1]+(Bq[1]-A[1])*t,a0[0]+(a1[0]-a0[0])*t,a0[1]+(a1[1]-a0[1])*t]}
/* a colour curve [[phase,L,C,h]...] read at phase p (interpolated in Lab, so a near-neutral white does not swing its hue); dl, kc: lightness shift, chroma factor */
function bouCurve(T,p,dl=0,kc=1){p=Math.max(T[0][0],Math.min(T[T.length-1][0],p));let i=1;while(i<T.length-1&&p>T[i][0])i++;const A=T[i-1],Bq=T[i],t=(p-A[0])/((Bq[0]-A[0])||1),
    ab=q=>[q[2]*Math.cos(q[3]*Math.PI/180),q[2]*Math.sin(q[3]*Math.PI/180)],a0=ab(A),a1=ab(Bq),L=A[1]+(Bq[1]-A[1])*t,a=(a0[0]+(a1[0]-a0[0])*t)*kc,b=(a0[1]+(a1[1]-a0[1])*t)*kc;
  return bouLch(Math.max(0,Math.min(100,L+dl)),Math.hypot(a,b),Math.atan2(b,a)*180/Math.PI)}
/* the default colours of a ball from its colourway (a species gives col()) */
function bouColDef(p,cwx){const c=cwx.c||'#dfe6c8';return{body:c,light:mix(c,'#ffffff',.35),shade:mix(c,'#4a5a3a',.32),deep:mix(c,'#2e3a24',.62),eye:mix(c,'#9cb05a',.5),brown:mix(c,'#8a6a44',.6),stalk:'#6a7a44'}}
/* 2x2 singular values of the map M (columns m1, m2 on the screen): [s1, s2, angle of the major axis (rad)] */
function bouSvd(m1,m2){const E=(m1[0]+m2[1])/2,F=(m1[0]-m2[1])/2,G2=(m1[1]+m2[0])/2,H=(m1[1]-m2[0])/2,Q=Math.hypot(E,H),Rr=Math.hypot(F,G2),a1=Math.atan2(G2,F),a2=Math.atan2(H,E);
  return[Q+Rr,Math.abs(Q-Rr),(a2+a1)/2]}
const bouSc=(B,v)=>{const q=toV(B,v);return[q[0],-q[1]]};
function bouRot(v,k,a){const c=Math.cos(a),s=Math.sin(a),d=V3.dot(k,v),x=V3.cr(k,v);return[v[0]*c+x[0]*s+k[0]*d*(1-c),v[1]*c+x[1]*s+k[1]*d*(1-c),v[2]*c+x[2]*s+k[2]*d*(1-c)]}
function svBoule(par,B,O,D,S,cwx,op,seed,wl,o={}){const P=S._m||(S._m=Object.assign({},SVBOU_DEF,S)),r=svRng(seed),hi=DET>=1.5?1:0,sm=(x,q)=>svSm((x-q[0])/q[1]),
    dec=sm(wl,P.dec),fan=sm(wl,P.fan),shd=sm(wl,P.shed),R0=D/2,R1m=R0*P.r1,k=G(par),T0=WILT;
  /* the nod of a fading ball: the whole frame turns about the stalk's end, toward the ground */
  const att=o.att?V3.sc(o.att,1):toV(B,[0,0,-R0*.86]),nod=P.tip[0]*sm(wl,[P.tip[1],P.tip[2]]);
  if(nod>.01){const Z=B[2],ax=V3.cr(Z,[0,-1,0]),al=V3l(ax);if(al>.05){const kk=V3.sc(ax,1/al);B=B.map(v=>bouRot(v,kk,nod));const rel=V3.sc(att,-1);O=V3.add(V3.add(O,att),bouRot(rel,kk,nod))}}
  const ph=P.phase?P.phase(cwx,op,wl,o):0,C=P.col?P.col(ph,cwx,{dec,fan,wl}):bouColDef(ph,cwx);
  const rp=P.ripe?P.ripe(ph):1,R1=R1m*bouIp(P.grow,op)*(1+.07*dec),s=R1m*P.s[hi]*bouIp(P.sz,op)*(1-P.shriv*fan)*(.62+.38*rp),fo=svSm((op-P.fo[0])/P.fo[1])*(.5+.5*rp)*(1-.22*fan),
    N=Math.max(24,Math.round(P.n[hi]*Math.min(1,Math.pow(D/(P.nD*(typeof UPC!=='undefined'?UPC:6.5)),1.2))*(LOD?.6:1))),gw=P.lobes,
    upL=[B[0][1],B[1][1],B[2][1]],dn=V3.sc(upL,-1),jit=P.jit[0]+(P.jit[1]-P.jit[0])*fo+.25*dec,lumpA=P.lump[0]+(P.lump[1]-P.lump[0])*fo+.05*dec;
  const fl=[];for(let i=0;i<N;i++){
    /* genes first (the same florets whatever the view) */
    const ja=r()*6.283,jr=r(),lu=r()*2-1,ta=r()*6.283,tm=r(),rot=r()*6.283,u5=r(),lj=[r(),r(),r(),r(),r()],gone=r(),dr=r(),cl=r();
    const z0=1-2*(i+.5)/N;if(z0<P.cap)continue;const rr=Math.sqrt(Math.max(0,1-z0*z0)),a=i*2.399963+seed%7,sp=1.6/Math.sqrt(N);
    let n0=V3.nz([Math.cos(a)*rr+Math.cos(ja)*sp*jr*.45,Math.sin(a)*rr+Math.sin(ja)*sp*jr*.45,z0]);
    if(gone<shd*P.shedF*(.55+.45*Math.max(0,-n0[2]+.5)))continue;
    const lump=1+lumpA*lu,c=[n0[0]*R1*lump,n0[1]*R1*lump,n0[2]*R1*lump*P.flat];
    let nf=V3.nz([n0[0],n0[1],n0[2]/P.flat]);{const t=V3.nz(V3.cr(nf,Math.abs(nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(nf,t),d=V3.add(V3.sc(t,Math.cos(ta)),V3.sc(t2,Math.sin(ta)));nf=V3.nz(V3.add(nf,V3.sc(d,Math.tan(jit*tm))))}
    if(fan>0||dec>0)nf=V3.nz(V3.add(nf,V3.sc(dn,P.droop*(fan*P.droopF*(.45+.55*dr)+.25*dec*dr))));
    const nv=toV(B,nf),n0v=toV(B,n0);if(n0v[2]<-.3||nv[2]<-.55)continue;
    let nl=gw[0][0];{let x=u5;for(const[g2,w]of gw){if(x<w){nl=g2;break}x-=w}}
    fl.push({c,nf,nv,n0v,nl,rot,lj,cl,z:PJ(B,O,c)[2]})}
  if(!fl.length)return k;WILT=null;
  try{
    const ctr=PJ(B,O,[0,0,0]),Lx=-LIGHT[0],Ly=LIGHT[1],ll=Math.hypot(Lx,Ly)||1,shv=[Lx/ll*s*P.sh[0],Ly/ll*s*P.sh[0]];
    /* tones: radial gradients over the ball (lit toward the light), one per tone class */
    const gR=(R1+s)*1.25,grad=st=>{const id='bo'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(ctr[0]+LIGHT[0]*gR*.38),cy:svF(ctr[1]-LIGHT[1]*gR*.38),r:svF(gR*P.gr)},GDEF||defs);stops(gr,st);return`url(#${id})`};
    const fills=[grad([[0,C.light],[.5,C.body],[.84,mix(C.body,C.shade,.6)],[1,C.shade]]),grad([[0,mix(C.light,C.body,.6)],[.45,mix(C.body,C.shade,.5)],[.85,C.shade],[1,mix(C.shade,C.deep,.3)]])];
    if(dec>.05||fan>0){const bw=mix(C.body,C.brown,.45+.55*fan);fills.push(grad([[0,mix(bw,C.light,.25)],[.55,bw],[1,mix(bw,C.deep,.45)]]))}
    /* a faded ball is not one brown: some florets dry pale and papery (C.paper), most go rust-brown, the rest stay the body's tan */
    if(fan>.02&&C.paper)fills.push(grad([[0,mix(C.paper,C.light,.3)],[.6,C.paper],[1,mix(C.paper,C.deep,.35)]]));
    /* the crevices: the ball's core in deep shade, seen between the florets */
    let clip=null;{const hp=[];for(let i=0;i<28;i++){const a=i/28*6.283;for(const zz of[-.92,-.6,0,.6,.92,1]){const q=Math.sqrt(1-zz*zz),p=PJ(B,O,[Math.cos(a)*q*R1*.97,Math.sin(a)*q*R1*.97,zz*R1*.97*P.flat]);hp.push([p[0],p[1]])}}
      const h=hull2(hp);if(h.length>2){const hd=svSpl(h.map(p=>[ctr[0]+(p[0]-ctr[0])*P.core*(1-.5*shd),ctr[1]+(p[1]-ctr[1])*P.core*(1-.5*shd)]));E('path',{d:hd,fill:C.deep},k);
        clip='bc'+(gid++);E('path',{d:svSpl(h.map(p=>[ctr[0]+(p[0]-ctr[0])*1.04,ctr[1]+(p[1]-ctr[1])*1.04]))},E('clipPath',{id:clip},GDEF||defs))}}
    /* the stalk into the ball, and the bare cyme where florets have fallen */
    {const a2=[ctr[0]+att[0],ctr[1]-att[1]],w=Math.max(.5,R0*P.stalkW);let d='M'+svJ([svR(a2[0]),svR(a2[1])])+'L'+svJ([svR(ctr[0]),svR(ctr[1])]),db='';
      if(shd>.05){const n=Math.round(5+12*shd);for(let j=0;j<n;j++){const q=fl[Math.floor(pxHashS(j,3,seed)*fl.length)],m=PJ(B,O,V3.sc(q.c,.55)),e=PJ(B,O,V3.sc(q.c,.9));db+='M'+svJ([svR(ctr[0]),svR(ctr[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(e[0]),svR(e[1])])}
        /* a floret left alone where its neighbours have fallen (its disc touches neither the shrunken core nor a floret that does) keeps its own bare
           cyme branch to the core: no floret floats beside the ball (porteur 2026-10-09). Conservative discs: the core R1 x core x (1 - shd/2) x flat,
           a floret .6 s (between its notches and its lobe tips); one branch per lone group, to its floret nearest the core */
        const cR=R1*.97*P.core*(1-.5*shd)*P.flat,fr=s*(.7+.3*fo)*.6,ps=fl.map(q=>PJ(B,O,q.c)),dc=ps.map(p=>Math.hypot(p[0]-ctr[0],p[1]-ctr[1])),on=dc.map(d=>d<cR+fr*.5),st=[];
        for(let i=0;i<fl.length;i++)if(on[i])st.push(i);
        const grow=()=>{while(st.length){const i=st.pop();for(let j=0;j<fl.length;j++)if(!on[j]&&Math.hypot(ps[i][0]-ps[j][0],ps[i][1]-ps[j][1])<fr*1.6){on[j]=true;st.push(j)}}};grow();
        for(;;){let bi=-1;for(let i=0;i<fl.length;i++)if(!on[i]&&(bi<0||dc[i]<dc[bi]))bi=i;if(bi<0)break;
          const q=fl[bi],m=PJ(B,O,V3.sc(q.c,.55)),e=PJ(B,O,V3.sc(q.c,.9));db+='M'+svJ([svR(ctr[0]),svR(ctr[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(e[0]),svR(e[1])]);on[bi]=true;st.push(bi);grow()}}
      if(db)E('path',{d:db,fill:'none',stroke:C.stalk,'stroke-width':svF(w*.45),'stroke-linecap':'round'},k);
      E('path',{d,fill:'none',stroke:C.stalk,'stroke-width':svF(w),'stroke-linecap':'round'},k)}
    /* the florets, far to near, in depth bands */
    fl.sort((a,b)=>a.z-b.z);const K=P.bands[hi],z0=fl[0].z,z1=fl[fl.length-1].z,bands=[];for(const q of fl){const b=Math.min(K-1,Math.floor((q.z-z0)/((z1-z0)||1)*K));(bands[b]=bands[b]||[]).push(q)}
    const kr=.7+.3*fo,lift=s*(1-fo)*P.fold*(1-.6*fan),cup=s*P.cup*fo*(1-.8*fan)-s*.25*dec;
    for(let b=0;b<K;b++){const L=bands[b];if(!L)continue;const dd=fills.map(()=>''),de=[];let dsh='',dth='',dlt='',dcr='';
      for(const q of L){const t1=V3.nz(V3.cr(q.nf,Math.abs(q.nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(q.nf,t1),nl=q.nl,at=[],rt=[];
        for(let j=0;j<nl;j++){at.push(q.rot+j*6.2832/nl+(q.lj[j]-.5)*.35);rt.push(s*(1+P.lobeJ*(q.lj[(j+2)%5]*2-1)))}
        const pt=(a,rad,h)=>V3.add(V3.add(q.c,V3.sc(V3.add(V3.sc(t1,Math.cos(a)),V3.sc(t2,Math.sin(a))),rad*kr)),V3.sc(q.nf,h)),
          liftAt=rad=>lift*(rad/s)+cup*(rad/s)*(rad/s),notch=j=>{const a0=at[j],a1=at[(j+1)%nl]+(j===nl-1?6.2832:0),rn=s*P.notch*(.5+.5*(rt[j]+rt[(j+1)%nl])/(2*s));return pt((a0+a1)/2,rn,liftAt(rn))};
        const N3=[],T3=[],C1=[],C2=[];for(let j=0;j<nl;j++){const r0=rt[j],h=liftAt(r0),yw=s*P.lw*(r0/s),ca=Math.cos(at[j]),sa=Math.sin(at[j]),
            pp=(x,y)=>V3.add(V3.add(q.c,V3.sc(V3.add(V3.sc(t1,ca*x-sa*y),V3.sc(t2,sa*x+ca*y)),kr)),V3.sc(q.nf,h));N3.push(notch(j));T3.push(pp(r0,0));C1.push(pp(r0*.97,-yw));C2.push(pp(r0*.97,yw))}
        const sc3=p=>{const v=PJ(B,O,p);return[v[0],v[1]]};let Ns=N3.map(sc3),Ts=T3.map(sc3),C1s=C1.map(sc3),C2s=C2.map(sc3);const wb=svSm(fo/.75);
        if(wb<.995){const rb=s*kr*.92,cs=sc3(V3.add(q.c,V3.sc(q.nf,rb*.5))),bt=(p,j,f)=>{let dx=p[0]-cs[0],dy=p[1]-cs[1],l=Math.hypot(dx,dy);
            if(l<rb*.25){const v=bouSc(B,V3.add(V3.sc(t1,Math.cos(at[j])),V3.sc(t2,Math.sin(at[j]))));dx=v[0];dy=v[1];l=Math.hypot(dx,dy)||1}
            const b=[cs[0]+dx/l*rb*f,cs[1]+dy/l*rb*f];return[b[0]+(p[0]-b[0])*wb,b[1]+(p[1]-b[1])*wb]};
          Ts=Ts.map((p,j)=>bt(p,j,1+.06*(q.lj[j]-.5)));C1s=C1s.map((p,j)=>bt(p,j,1.04));C2s=C2s.map((p,j)=>bt(p,j,1.04));Ns=Ns.map((p,j)=>bt(p,j,.84))}
        /* the outline: from notch to notch over each lobe, two quadratic arches meeting at its tip (a rounded, broad lobe) */
        let x=svR(Ns[nl-1][0]),y=svR(Ns[nl-1][1]),d='M'+svJ([x,y]);
        for(let j=0;j<nl;j++){const Tt=[svR(Ts[j][0]),svR(Ts[j][1])],Bn=[svR(Ns[j][0]),svR(Ns[j][1])];
          if(!hi){const A=Ns[(j+nl-1)%nl],cx=2*Ts[j][0]-(A[0]+Ns[j][0])/2,cy=2*Ts[j][1]-(A[1]+Ns[j][1])/2;d+='q'+svJ([svR(cx)-x,svR(cy)-y,Bn[0]-x,Bn[1]-y]);x=Bn[0];y=Bn[1];continue}
          d+='q'+svJ([svR(C1s[j][0])-x,svR(C1s[j][1])-y,Tt[0]-x,Tt[1]-y])+'q'+svJ([svR(C2s[j][0])-Tt[0],svR(C2s[j][1])-Tt[1],Bn[0]-Tt[0],Bn[1]-Tt[1]]);x=Bn[0];y=Bn[1]}
        /* tone: the floret's own tilt against the ball's normal; the oldest florets brown first */
        const I=V3.dot(q.nv,LIGHT)-V3.dot(q.n0v,LIGHT);let ci=I<-P.shade?1:0;if(fills.length>2){if(q.cl<dec*.07+fan*.62)ci=2;else if(fills.length>3&&q.cl>1-fan*.24)ci=3}dd[ci]+=d+'z';
        /* the shadow it casts on the florets behind: its disc as an ellipse */
        if(b>0){const cs=sc3(q.c),sv=bouSvd(bouSc(B,t1),bouSc(B,t2)),rx=s*kr*.92*sv[0],ry=Math.max(.2,s*kr*.92*sv[1]),ca=Math.cos(sv[2]),sa=Math.sin(sv[2]),p0=[svR(cs[0]+shv[0]+ca*rx),svR(cs[1]+shv[1]+sa*rx)],
            p1=[svR(cs[0]+shv[0]-ca*rx),svR(cs[1]+shv[1]-sa*rx)],ar='a'+svJ([svR(rx),svR(ry)])+' '+Math.round(sv[2]*180/Math.PI)+' 1 0 ';
          dsh+='M'+svJ(p0)+ar+svJ([p1[0]-p0[0],p1[1]-p0[1]])+ar+svJ([p0[0]-p1[0],p0[1]-p1[1]])}
        /* the eye: the small green centre of a sterile floret, and (close up) its throat and lobe creases */
        if(q.nv[2]>.15){const e=sc3(V3.add(q.c,V3.sc(q.nf,lift*.6)));de.push(e);
          if(hi&&fo>.2){const ls=Math.hypot(shv[0],shv[1])||1;for(let j=0;j<nl;j++){const v=bouSc(B,V3.add(V3.sc(t1,Math.cos(at[j])),V3.sc(t2,Math.sin(at[j])))),vl=Math.hypot(v[0],v[1]);const dl=-(v[0]*shv[0]+v[1]*shv[1])/(vl*ls);if(vl<.2||Math.abs(dl)<P.wall[3])continue;
            const A=Ns[(j+nl-1)%nl],Bn=Ns[j],w=P.wall[0],tx=e[0]+(Ts[j][0]-e[0])*w,ty=e[1]+(Ts[j][1]-e[1])*w,cx=2*tx-(A[0]+Bn[0])/2,cy=2*ty-(A[1]+Bn[1])/2;
            const wd='M'+svJ([svR(e[0]),svR(e[1])])+'L'+svJ([svR(A[0]),svR(A[1])])+'Q'+svJ([svR(cx),svR(cy),svR(Bn[0]),svR(Bn[1])])+'z';if(dl>0)dth+=wd;else dlt+=wd}for(let j=0;j<nl;j++){const p1=sc3(pt(at[j],s*.2,liftAt(s*.2))),p2=sc3(pt(at[j],rt[j]*.72,liftAt(rt[j]*.72)));dcr+='M'+svJ([svR(p1[0]),svR(p1[1])])+'l'+svJ([svR(p2[0]-p1[0]),svR(p2[1]-p1[1])])}}}}
      if(dsh){const a={d:dsh,fill:C.deep,'fill-opacity':P.sh[1]};if(clip)a['clip-path']=`url(#${clip})`;E('path',a,k)}
      dd.forEach((d,i)=>{if(d)E('path',{d,fill:fills[i]},k)});
      if(dth)E('path',{d:dth,fill:C.shade,'fill-opacity':svF(P.wall[1]+.2*(1-rp))},k);if(dlt)E('path',{d:dlt,fill:C.light,'fill-opacity':P.wall[2]},k);if(dcr)E('path',{d:dcr,fill:'none',stroke:C.shade,'stroke-width':svF(Math.max(.15,s*.025)),'stroke-opacity':.4},k);
      if(de.length&&!LOD)E('path',{d:svDots(de),fill:'none',stroke:C.eye,'stroke-width':svF(Math.max(.35,s*P.eye*(.55+.45*fo))),'stroke-linecap':'round'},k)}
  }finally{WILT=T0}
  return k}
