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
  bands:[7,12],shade:.17,sh:[.4,.55],gr:1.05,wall:[.8,.4,.55,.15],core:.96,eye:.16,stalkW:.07,
  /* off by default (the snowball does not use them): sep, the sepal mode of bouSep (hydrangeas); clus, the lumps of the sub-corymbs (amplitude, count, tilt) */
  sep:0,clus:0,clusN:18,clusT:0};
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
  const rp=P.ripe?P.ripe(ph):1,R1=R1m*bouIp(P.grow,op)*(1+(P.decR??.07)*dec),s=R1m*P.s[hi]*bouIp(P.sz,op)*(1-P.shriv*fan)*(.62+.38*rp),fo=svSm((op-P.fo[0])/P.fo[1])*(.5+.5*rp)*(1-(P.foF??.22)*fan),
    N=Math.max(24,Math.round(P.n[hi]*Math.min(1,Math.pow(D/(P.nD*(typeof UPC!=='undefined'?UPC:6.5)),1.2))*(LOD?.6:1))),gw=P.lobes,
    upL=[B[0][1],B[1][1],B[2][1]],dn=V3.sc(upL,-1),jit=P.jit[0]+(P.jit[1]-P.jit[0])*fo+.25*dec,lumpA=P.lump[0]+(P.lump[1]-P.lump[0])*fo+.05*dec;
  const fl=[];for(let i=0;i<N;i++){
    /* genes first (the same florets whatever the view) */
    const ja=r()*6.283,jr=r(),lu=r()*2-1,ta=r()*6.283,tm=r(),rot=r()*6.283,u5=r(),lj=[r(),r(),r(),r(),r()],gone=r(),dr=r(),cl=r();
    const z0=1-2*(i+.5)/N;if(z0<P.cap)continue;const rr=Math.sqrt(Math.max(0,1-z0*z0)),a=i*2.399963+seed%7,sp=1.6/Math.sqrt(N);
    let n0=V3.nz([Math.cos(a)*rr+Math.cos(ja)*sp*jr*.45,Math.sin(a)*rr+Math.sin(ja)*sp*jr*.45,z0]);
    if(gone<shd*P.shedF*(.55+.45*Math.max(0,-n0[2]+.5)))continue;
    const cb=P.clus?bouClus(n0,seed,P.clusN):null,lump=1+lumpA*lu+(cb?P.clus*cb[0]:0),c=[n0[0]*R1*lump,n0[1]*R1*lump,n0[2]*R1*lump*P.flat];
    let nf=V3.nz([n0[0],n0[1],n0[2]/P.flat]);if(cb&&P.clusT)nf=V3.nz(V3.add(nf,V3.sc(cb[1],P.clusT)));{const t=V3.nz(V3.cr(nf,Math.abs(nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(nf,t),d=V3.add(V3.sc(t,Math.cos(ta)),V3.sc(t2,Math.sin(ta)));nf=V3.nz(V3.add(nf,V3.sc(d,Math.tan(jit*tm))))}
    if(fan>0||dec>0)nf=V3.nz(V3.add(nf,V3.sc(dn,P.droop*(fan*P.droopF*(.45+.55*dr)+.25*dec*dr))));
    if(P.faceV)nf=V3.nz(V3.add(nf,V3.sc([B[0][2],B[1][2],B[2][2]],P.faceV*(1-Math.abs(V3.dot(nf,[B[0][2],B[1][2],B[2][2]]))))));
    const nv=toV(B,nf),n0v=toV(B,n0);if(n0v[2]<-.3||nv[2]<(P.cullV??-.55))continue;
    let nl=gw[0][0];{let x=u5;for(const[g2,w]of gw){if(x<w){nl=g2;break}x-=w}}
    fl.push({c,nf,nv,n0v,nl,rot,lj,cl,dr,i,z:PJ(B,O,c)[2]})}
  if(!fl.length)return k;WILT=null;
  try{
    const ctr=PJ(B,O,[0,0,0]),Lx=-LIGHT[0],Ly=LIGHT[1],ll=Math.hypot(Lx,Ly)||1,shv=[Lx/ll*s*P.sh[0],Ly/ll*s*P.sh[0]];
    /* tones: radial gradients over the ball (lit toward the light), one per tone class */
    const gR=(R1+s)*1.25,grad=st=>{const id='bo'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(ctr[0]+LIGHT[0]*gR*.38),cy:svF(ctr[1]-LIGHT[1]*gR*.38),r:svF(gR*P.gr)},GDEF||defs);stops(gr,st);return`url(#${id})`};
    const fills=[];if(!P.sep){fills.push(grad([[0,C.light],[.5,C.body],[.84,mix(C.body,C.shade,.6)],[1,C.shade]]),grad([[0,mix(C.light,C.body,.6)],[.45,mix(C.body,C.shade,.5)],[.85,C.shade],[1,mix(C.shade,C.deep,.3)]]));
    if(dec>.05||fan>0){const bw=mix(C.body,C.brown,.45+.55*fan);fills.push(grad([[0,mix(bw,C.light,.25)],[.55,bw],[1,mix(bw,C.deep,.45)]]))}
    /* a faded ball is not one brown: some florets dry pale and papery (C.paper), most go rust-brown, the rest stay the body's tan */
    if(fan>.02&&C.paper)fills.push(grad([[0,mix(C.paper,C.light,.3)],[.6,C.paper],[1,mix(C.paper,C.deep,.35)]]))}
    /* the crevices: the ball's core in deep shade, seen between the florets */
    let clip=null;{const hp=[];for(let i=0;i<28;i++){const a=i/28*6.283;for(const zz of[-.92,-.6,0,.6,.92,1]){const q=Math.sqrt(1-zz*zz),p=PJ(B,O,[Math.cos(a)*q*R1*.97,Math.sin(a)*q*R1*.97,zz*R1*.97*P.flat]);hp.push([p[0],p[1]])}}
      const h=hull2(hp);if(h.length>2){const hd=svSpl(h.map(p=>[ctr[0]+(p[0]-ctr[0])*P.core*(1-.5*shd),ctr[1]+(p[1]-ctr[1])*P.core*(1-.5*shd)]));
        /* (coreG) the core shaded as the hollow it is: lit toward the light, deep on the far side (seen between the florets, it reads as depth) */
        E('path',{d:hd,fill:P.coreG?grad([[0,C.core||C.deep],[.6,mix(C.core||C.deep,C.deep,.6)],[1,mix(C.deep,'#000000',P.coreG)]]):C.core||C.deep},k);
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
    /* sepal mode: bouSep draws the florets (layers without overlap, a lit facet per sepal), or P.sepDraw (a species' own floret, y3-hortensia.js) */
    if(P.sep){(P.sepDraw||bouSep)(k,{B,O,P,C,fl,s:s*(P.sepK||1)*Math.sqrt(P.n[hi]/N),fo,rp,dec,fan,hi,shv,grad,clip,seed,kr:.7+.3*fo,op,wl,R1});return k}
    /* the florets, far to near, in depth bands */
    fl.sort((a,b)=>a.z-b.z);const K=P.bands[hi],z0=fl[0].z,z1=fl[fl.length-1].z,bands=[];for(const q of fl){const b=Math.min(K-1,Math.floor((q.z-z0)/((z1-z0)||1)*K));(bands[b]=bands[b]||[]).push(q)}
    const kr=.7+.3*fo,lift=s*(1-fo)*P.fold*(1-.6*fan),cup=s*P.cup*fo*(1-.8*fan)-s*.25*dec;
    for(let b=0;b<K;b++){const L=bands[b];if(!L)continue;const dd=fills.map(()=>''),de=[];let dsh='',dth='',dlt='',dcr='';
      /* the band's florets kept for the morning dew (y3-rosee.js, dewBall), only when there is dew */
      const DWB=typeof dewBall==='function'&&dewNow()>0&&!LOD?[]:null;
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
        if(DWB)DWB.push({z:q.z,nv:q.nv,o:Ns.flatMap((p,j)=>[p,Ts[j]]),pt,r:Math.min(...rt),kr,lift:liftAt,sc:sc3});
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
      if(de.length&&!LOD)E('path',{d:svDots(de),fill:'none',stroke:C.eye,'stroke-width':svF(Math.max(.35,s*P.eye*(.55+.45*fo))),'stroke-linecap':'round'},k);
      if(DWB&&DWB.length)dewBall(k,DWB,C)}
  }finally{WILT=T0}
  return k}
/* ---------- the sub-corymbs of a mophead (P.clus): [radial bump -.4 .. .6, the tilt of a floret away from its cluster's centre] ----------
   nC cluster centres on a jittered golden spiral (from the seed, no draw); a floret near the edge of its cluster sits lower and leans outward */
function bouClus(n0,seed,nC){const key=seed+'/'+nC;if(bouClus._k!==key){const c=[];for(let i=0;i<nC;i++){const z=1-2*(i+.5)/nC,r=Math.sqrt(Math.max(0,1-z*z)),a=i*2.399963+(seed%11)*.37+pxHashS(i,9,seed)*.6;
    c.push(V3.nz([Math.cos(a)*r,Math.sin(a)*r,z+(pxHashS(i,4,seed)-.5)*.25]))}bouClus._c=c;bouClus._k=key}
  let m=-2,bk=null;for(const ck of bouClus._c){const d=V3.dot(n0,ck);if(d>m){m=d;bk=ck}}
  const t=Math.min(1,Math.acos(Math.max(-1,Math.min(1,m)))/(2.3/Math.sqrt(nC))),tv=V3.add(n0,V3.sc(bk,-m)),tl=V3l(tv);return[.6-t*t,tl>1e-4?V3.sc(tv,t/tl):[0,0,0]]}
/* ---------- sepal mode (P.sep): hydrangea florets ----------
   Each floret is 3 to 5 broad sepals round a small fertile eye; each sepal is its own facet (centre -> notch -> rounded tip -> notch -> centre),
   lit by its own normal (the sepal tilts up by its cup angle, twists a little), so every floret has volume; adjacent facets share their boundary,
   which bows toward the sepal underneath (the edge of the one on top). Closed florets are valvate beads: the sepals are the lunes of a small egg
   meeting at its top (back-facing lunes culled: a convex bead never overlaps itself). Florets are laid in LAYERS where no two overlap on screen
   (a floret goes one layer above every farther floret it touches), so the one-path-per-tone drawing never paints a far floret over a near one.
   Per layer: cast shadows, the facets (one path per colour variant x light class, the class's gradient spread over the whole ball), the pale heart
   streaks, the under-shade along the overlapping edges, a satin sheen and fine veins (DET >= 1.5), the edge band (picotee or browned margin,
   constant width), the eyes. Colours C: vs [{li,bo,sh,dp}] (variants; bkI the index of the sepals' underside), heart heartO heartL heartW, eye eyeL,
   vein, rim rimO rimW (x s), light, deep. Spec: sepA [closed, open] tilt (rad), sepW (half width x length), sepC (cross cup), notch, sepTip
   (0 round .. 1 pointed), cls (light-class thresholds), relK, ovK [DET 1, DET 1.5] (overlap tolerance), unO snO vnO (opacities), vpick(q,X) */
/* an absolute path (M C Q L z) rewritten relative (shorter): the first M stays absolute; rd rounds the differences */
function bouRelD(d,rd){const tk=d.match(/[MCQLZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);if(!tk)return d;let o='',cx=0,cy=0,sx=0,sy=0,cmd='',first=1,i=0;
  const n=()=>+tk[i++];
  while(i<tk.length){const t=tk[i];if(/[A-Za-z]/.test(t)){cmd=t;i++;if(t==='z'||t==='Z'){o+='z';cx=sx;cy=sy;continue}}
    const k=cmd==='C'?3:cmd==='Q'?2:1,v=[];let lx=0,ly=0;for(let j=0;j<k;j++){const x=n(),y=n();v.push(rd(x-cx),rd(y-cy));lx=x;ly=y}
    if(cmd==='M'){if(first){o+='M'+svJ([lx,ly]);first=0}else o+='m'+svJ(v);sx=lx;sy=ly}else o+=cmd.toLowerCase()+svJ(v);cx=lx;cy=ly}
  return o}
/* the part t0..t1 of a cubic (de Casteljau) */
function bouSub(p0,p1,p2,p3,t0,t1){const L=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],at=t=>{const a=L(p0,p1,t),b=L(p1,p2,t),c=L(p2,p3,t),d=L(a,b,t),e=L(b,c,t);return[L(d,e,t),d,e,a,c]};
  const A=at(t0)[0],B=at(t1)[0],dA=[3*((1-t0)*(1-t0)*(p1[0]-p0[0])+2*(1-t0)*t0*(p2[0]-p1[0])+t0*t0*(p3[0]-p2[0])),3*((1-t0)*(1-t0)*(p1[1]-p0[1])+2*(1-t0)*t0*(p2[1]-p1[1])+t0*t0*(p3[1]-p2[1]))],
    dB=[3*((1-t1)*(1-t1)*(p1[0]-p0[0])+2*(1-t1)*t1*(p2[0]-p1[0])+t1*t1*(p3[0]-p2[0])),3*((1-t1)*(1-t1)*(p1[1]-p0[1])+2*(1-t1)*t1*(p2[1]-p1[1])+t1*t1*(p3[1]-p2[1]))],h=(t1-t0)/3;
  return[A,[A[0]+dA[0]*h,A[1]+dA[1]*h],[B[0]-dB[0]*h,B[1]-dB[1]*h],B]}
function bouSep(k,X){const{B,O,P,C,fl,s,fo,fan,hi,shv,grad,clip}=X,sc3=p=>{const v=PJ(B,O,p);return[v[0],v[1]]},R2=X.hi?p=>[svR(p[0]),svR(p[1])]:p=>[Math.round(p[0]),Math.round(p[1])],
    V=C.vs,gc={},cls=P.cls||[-.3,-.1,.12],sA=P.sepA||[1.2,.22],wb=svSm((fo-.08)/.6),al0=sA[0]+(sA[1]-sA[0])*fo,sw=P.sepW||.56,tp=P.sepTipY!=null?P.sepTipY+((P.sepTip||0)-P.sepTipY)*svSm((fo-.2)/.6):(P.sepTip||0),kr=X.kr,
    relK=P.relK??.7,ovK=(P.ovK||[.86,.97])[hi],LL=LIGHT,open=wb>.6,bm=wb<.5,fillOf=(v,c)=>{const key=v+'_'+c;if(gc[key])return gc[key];const q=V[v];let st;
      /* (volK) the ball's own shade deeper on its far side (the florets of the bottom and of the shadow flank in shade, refcache 70, 84) */
      const vk=P.volK||0;if(vk){if(c===3)st=[[0,mix(q.li,'#ffffff',P.liW??.12)],[.42,q.li],[.74,q.bo],[1,mix(q.sh,q.dp,vk*.5)]];else if(c===2)st=[[0,q.li],[.4,q.bo],[.74,mix(q.bo,q.sh,.65)],[1,mix(q.sh,q.dp,vk)]];
        else if(c===1)st=[[0,mix(q.li,q.bo,.65)],[.38,mix(q.bo,q.sh,.55)],[.72,q.sh],[1,mix(q.sh,q.dp,.3+.7*vk)]];else st=[[0,mix(q.bo,q.sh,.6)],[.42,mix(q.sh,q.dp,.25)],[1,q.dp]];return gc[key]=grad(st)}
      if(c===3)st=[[0,mix(q.li,'#ffffff',.1)],[.5,q.li],[.86,q.bo],[1,q.sh]];else if(c===2)st=[[0,q.li],[.5,q.bo],[.86,mix(q.bo,q.sh,.6)],[1,q.sh]];
      else if(c===1)st=[[0,mix(q.li,q.bo,.65)],[.45,mix(q.bo,q.sh,.5)],[.86,q.sh],[1,mix(q.sh,q.dp,.3)]];else st=[[0,mix(q.bo,q.sh,.55)],[.5,q.sh],[1,mix(q.sh,q.dp,.5)]];
      return gc[key]=grad(st)};
  const L=[];
  for(const q of fl){const t1=V3.nz(V3.cr(q.nf,Math.abs(q.nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(q.nf,t1),nl=q.nl,dir=q.lj[4]<.5?1:-1,lj=j=>q.lj[((j%5)+5)%5];
    const at=[],rr=[],al=[];for(let j=0;j<nl;j++){at.push(q.rot+j*6.2832/nl+(lj(j)-.5)*.32);rr.push(s*kr*(1+P.lobeJ*(lj(j+2)*2-1))*(P.crum&&fan>0?1-.3*fan*Math.pow(lj(j+4),3):1));al.push(al0+(lj(j+3)-.5)*.3*wb+fan*(P.sepF??.4)*(q.dr-.3))}
    const dv=a=>V3.add(V3.sc(t1,Math.cos(a)),V3.sc(t2,Math.sin(a))),rb=s*kr*(P.beadR||.4),bc=V3.add(q.c,V3.sc(q.nf,rb*.5)),
      bead=(phi,rho)=>{const th=Math.PI*(1-Math.min(1,rho))*.94;return V3.add(V3.add(bc,V3.sc(dv(phi),rb*Math.sin(th))),V3.sc(q.nf,rb*1.12*Math.cos(th)))},
      mixP=(a,b)=>b,
      sp=(j,x,y)=>{const r=rr[j],ca=Math.cos(al[j]),sa=Math.sin(al[j]),u=dv(at[j]),v=dv(at[j]+1.5708),
          o3=V3.add(V3.add(q.c,V3.add(V3.sc(u,x*ca),V3.sc(v,y))),V3.sc(q.nf,x*sa+(P.sepC||0)*y*y/r));return wb>=.999?o3:mixP(bead(at[j]+Math.atan2(y,x),Math.min(y?.93:1,Math.hypot(x,y)/r)),o3)},
      nb=[],nbM=[];
    for(let j=0;j<nl;j++){const j2=(j+1)%nl,a1=at[j2]+(j2===0?6.2832:0),m=(at[j]+a1)/2,rn=P.notch*(rr[j]+rr[j2])/2*(.9+.2*lj(j+1)),am=(al[j]+al[j2])/2,
        o3=V3.add(V3.add(q.c,V3.sc(dv(m),rn*Math.cos(am))),V3.sc(q.nf,rn*Math.sin(am)));
      nb.push(mixP(bead(m,P.notch),o3));nbM.push([m,rn])}
    const E3=mixP(bead(0,0),V3.add(q.c,V3.sc(q.nf,s*.03))),E=sc3(E3),N2=nb.map(sc3);
    /* the boundary j|j+1 bows toward the sepal underneath (dir: which way the sepals overlap, a pinwheel) */
    /* (a bead: the boundary is the meridian of the egg from the notch down to its foot, a quadratic through its middle) */
    const eB=bead(0,0),ctl=nbM.map(([m,rn],j)=>{const mid=V3.sc(V3.add(E3,nb[j]),.5),oc=V3.add(mid,V3.sc(dv(m+1.5708),dir*.13*rn*wb));if(wb>=.999)return sc3(oc);
        const nB0=bead(m,P.notch),bc2=V3.add(V3.sc(bead(m,P.notch*.5),2),V3.sc(V3.add(nB0,eB),-.5));return sc3(mixP(bc2,oc))}),
      ctl2=nbM.map(([m,rn],j)=>{const mid=V3.sc(V3.add(E3,nb[j]),.5);return sc3(V3.add(mid,V3.sc(dv(m+1.5708),dir*.28*rn*wb)))});
    const sep=[];let rs=0;const cs=sc3(q.c);
    /* (a bead: the outline of a lune follows its two meridians up to the egg's top, controls a little outside the surface) */
    const thN=Math.PI*.94*(1-P.notch),bAt=(phi,th,kk)=>V3.add(V3.add(bc,V3.sc(dv(phi),rb*Math.sin(th)*kk)),V3.sc(q.nf,rb*1.12*Math.cos(th)*kk)),
      op3=(j,x,y)=>{const r=rr[j],ca=Math.cos(al[j]),sa=Math.sin(al[j]),u=dv(at[j]),v=dv(at[j]+1.5708);return V3.add(V3.add(q.c,V3.add(V3.sc(u,x*ca),V3.sc(v,y))),V3.sc(q.nf,x*sa+(P.sepC||0)*y*y/r))};
    if(bm&&P.beadRound&&wb<P.beadRound){/* (beadRound) a closed floret as a round bead: its outline (the hull of the egg seen), toned by its normal, a lit cap toward the
         light, and at close range the valvate seams of its sepals as fine dark lunes from the top to the equator (refcache photos 97, 99) */
      const f2=p=>svJ(R2(sc3(p))),pts=[];for(let a=0;a<16;a++)for(const th of[.25,.6,1,1.35,1.5708,1.85,2.2,2.55,2.85])pts.push(sc3(bAt(a*.3927,th,1)));
      const h=hull2(pts);if(h.length>2){const n=h.length,cen=h.reduce((u,p)=>[u[0]+p[0]/n,u[1]+p[1]/n],[0,0]),
          splA=Q=>{const m=Q.length,g=i=>Q[(i+m)%m];let d='M'+svJ(R2(Q[0]));for(let i=0;i<m;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
            d+='C'+svJ([...R2([p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6]),...R2([p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6]),...R2(p2)])}return d+'z'};
        const I0=V3.dot(q.nv,LL)-relK*V3.dot(q.n0v,LL);let c0=I0<cls[0]?0:I0<cls[1]?1:I0<cls[2]?2:3;if(c0===0)c0=1;
        sep.push({d:splA(h),c:Math.max(hi?0:1,c0-1)});
        /* the lit cap: the outline shrunk toward a point offset to the light */
        const lv=[LL[0],-LL[1]],ll=Math.hypot(lv[0],lv[1])||1,rpx=Math.max(...h.map(p=>Math.hypot(p[0]-cen[0],p[1]-cen[1]))),cap=(k,o,c)=>{const lc=[cen[0]+lv[0]/ll*rpx*o,cen[1]+lv[1]/ll*rpx*o];sep.push({d:splA(h.map(p=>[lc[0]+(p[0]-cen[0])*k,lc[1]+(p[1]-cen[1])*k])),c})};
        cap(.8,.16,c0);cap(.4,.42,Math.min(3,c0+1));
        if(hi){const top=bAt(0,0,1);for(let j=0;j<nl;j++){const m=nbM[j][0],nn=V3.nz(V3.add(V3.sc(dv(m),.7),V3.sc(q.nf,.7)));if(toV(B,nn)[2]<.05)continue;
            const w=.05;sep.push({d:'M'+f2(top)+'Q'+f2(bAt(m-w,.8,1.02))+' '+f2(bAt(m,1.45,1))+'Q'+f2(bAt(m+w,.8,1.02))+' '+f2(top)+'z',c:0})}}
        for(const p of h)rs=Math.max(rs,Math.hypot(p[0]-cs[0],p[1]-cs[1]))}
      if(sep.length)L.push({q,sep,cs,rs,nl,v:P.vpick?P.vpick(q,X):0,z:q.z});continue}
    if(bm){/* a closed floret: a valvate bead, each sepal a lune of the egg in two halves (above and below its equator), back-facing halves culled */
      const top=bAt(0,0,1),bot=bAt(0,Math.PI*.94,1),f2=p=>svJ(R2(sc3(p)));
      for(let j=0;j<nl;j++){const mL=nbM[(j+nl-1)%nl][0]-(j===0?6.2832:0),mR=nbM[j][0],mm=(mL+mR)/2,kq=1/Math.cos((mR-mL)/2),eL=bAt(mL,1.5708,1),eR=bAt(mR,1.5708,1),eM=bAt(mm,1.5708,kq);
        const half=[['M'+f2(top)+'C'+f2(bAt(mL,.52,1.05))+' '+f2(bAt(mL,1.05,1.05))+' '+f2(eL)+'Q'+f2(eM)+' '+f2(eR)+'C'+f2(bAt(mR,1.05,1.05))+' '+f2(bAt(mR,.52,1.05))+' '+f2(top)+'z',V3.nz(V3.add(V3.sc(dv(mm),.62),V3.sc(q.nf,.78)))],
          ['M'+f2(eL)+'Q'+f2(eM)+' '+f2(eR)+'C'+f2(bAt(mR,2.05,1.05))+' '+f2(bAt(mR,2.6,1.05))+' '+f2(bot)+'C'+f2(bAt(mL,2.6,1.05))+' '+f2(bAt(mL,2.05,1.05))+' '+f2(eL)+'z',V3.nz(V3.add(V3.sc(dv(mm),.75),V3.sc(q.nf,-.66)))]];
        for(const[d,n]of half){const nvj=toV(B,n);if(nvj[2]<.02)continue;const I=V3.dot(nvj,LL)-relK*V3.dot(q.n0v,LL);let c=I<cls[0]?0:I<cls[1]?1:I<cls[2]?2:3;if(!hi&&c===0)c=1;sep.push({d,c})}
        for(const p of[eL,top,bot]){const v=sc3(p);rs=Math.max(rs,Math.hypot(v[0]-cs[0],v[1]-cs[1]))}}
      if(sep.length)L.push({q,sep,cs,rs,nl,v:P.vpick?P.vpick(q,X):0,z:q.z});continue}
    /* (crum) a drying sepal crumples: its margins roll in (narrower, unevenly), its tip twists aside and shortens */
    const cr=P.crum?fan:0,cRl=o=>cr?1-P.crum[0]*cr*(.5+lj(o)):1;
    for(let j=0;j<nl;j++){const r=rr[j],sk=(lj(j+1)-.5)*.3,yl=sw*r*(1-sk)*cRl(j+1),yr=sw*r*(1+sk)*cRl(j+2),xs=.62*r,tw=cr?P.crum[1]*cr*(lj(j+3)-.5)*r:0,mL=nbM[(j+nl-1)%nl][0]-(j===0?6.2832:0),mR=nbM[j][0],
        bp=(o3,b3)=>sc3(wb>=.999?o3:mixP(b3,o3)),
        /* (crum) the dried outline dented and uneven: shoulders and tips pulled in or out from the genes, so the margin waves (81) */
        wv=k2=>cr?1+cr*.6*(pxHashS(q.i*5+j,k2,17)-.5):1,
        P1=bp(op3(j,xs*.75*wv(1),-yl*1.12*wv(2)),bAt(mL,thN*.64,1.07)),P2=bp(op3(j,r,-yl*.62*(1-tp)*wv(4)+tw*.5),bAt(mL,thN*.3,1.07)),T=bp(op3(j,r*(1+.05*tp)*(1-.12*cr*lj(j)),tw),bAt(at[j],0,1)),
        P3=bp(op3(j,r,yr*.62*(1-tp)*wv(6)+tw*.5),bAt(mR,thN*.3,1.07)),P4=bp(op3(j,xs*.75*wv(7),yr*1.12*wv(8)),bAt(mR,thN*.64,1.07));
      rs=Math.max(rs,Math.hypot(T[0]-cs[0],T[1]-cs[1]));
      /* the facet's normal: the tilted sepal (open) or the bead's lune (closed), twisted a little */
      const u=dv(at[j]),v=dv(at[j]+1.5708),ca=Math.cos(al[j]),sa=Math.sin(al[j]),nO=V3.nz(V3.add(V3.add(V3.sc(q.nf,ca),V3.sc(u,-sa)),V3.sc(v,(lj(j+4)-.5)*.45))),
        nB=V3.nz(V3.add(V3.sc(u,.55),V3.sc(q.nf,.8))),nj=V3.nz(V3.add(V3.sc(nB,1-wb),V3.sc(nO,wb))),nvj=toV(B,nj);
      const back=nvj[2]<-.04;if(back&&wb<.5)continue;
      const I=V3.dot(back?V3.sc(nvj,-1):nvj,LL)-relK*V3.dot(q.n0v,LL);let c=I<cls[0]?0:I<cls[1]?1:I<cls[2]?2:3;if(!hi&&c===0)c=1;
      sep.push({j,P1,P2,T,P3,P4,c,back,r,yl,yr,side:Math.sign(V3.dot(toV(B,v),LL))||1})}
    if(!sep.length)continue;
    L.push({q,E,N2,ctl,ctl2,sep,cs,rs,nl,v:P.vpick?P.vpick(q,X):0,sp,z:q.z,dir})}
  /* layers: a floret one above every farther floret it overlaps on screen */
  L.sort((a,b)=>a.z-b.z);const lay=[];
  for(let i=0;i<L.length;i++){const a=L[i];let h=0;for(let j=0;j<i;j++){const b=L[j];if(b.ly+1>h&&Math.hypot(a.cs[0]-b.cs[0],a.cs[1]-b.cs[1])<(a.rs+b.rs)*ovK)h=b.ly+1}a.ly=h;(lay[h]=lay[h]||[]).push(a)}
  X.layers=lay.length;
  const lj2=(F,j)=>F.q.lj[((j%5)+5)%5],J=svJ,eyeW=Math.max(.35,s*P.eye*(.55+.45*fo)),ls=Math.hypot(shv[0],shv[1])||1,hlo=[-shv[0]/ls*eyeW*.24,-shv[1]/ls*eyeW*.24];
  for(let li=0;li<lay.length;li++){const Ly=lay[li];if(!Ly)continue;const dd={};let dsh='',dun='',dht='',dhs='',dsn='',dvn='',drm='';const drl=['',''],dss=['',''],dle=['','',''];let dcr='',dro='',dsp='';const de=[],deh=[];
    const dfl=[];for(const F of Ly){const{q,E,N2,ctl,ctl2,sep,nl}=F;let dF='';
      for(const S of sep){if(S.d){const key=F.v+'_'+S.c;dd[key]=(dd[key]||'')+S.d;if(P.floG&&!S.back)dF+=S.d;continue}const j=S.j,jp=(j+nl-1)%nl,A=N2[jp],Bn=N2[j],
          d='M'+J(R2(A))+'C'+J([...R2(S.P1),...R2(S.P2),...R2(S.T)])+'C'+J([...R2(S.P3),...R2(S.P4),...R2(Bn)])+'Q'+J([...R2(ctl[j]),...R2(E)])+'Q'+J([...R2(ctl[jp]),...R2(A)])+'z',
          vk=S.back&&C.bkI!=null?C.bkI:F.v,key=vk+'_'+S.c;dd[key]=(dd[key]||'')+d;if(P.floG&&!S.back)dF+=d;
        /* (shSep) the sepal's own cast shadow on the florets behind: its outline pushed away from the light, twice (a soft penumbra) */
        if(P.shSep&&li>0)for(let m=0;m<2;m++){const f=P.shSep[0]*(m?1:.5),o=p=>R2([p[0]+shv[0]*f,p[1]+shv[1]*f]);
          dss[m]+='M'+J(o(A))+'C'+J([...o(S.P1),...o(S.P2),...o(S.T)])+'C'+J([...o(S.P3),...o(S.P4),...o(Bn)])+'Q'+J([...o(ctl[j]),...o(E)])+'Q'+J([...o(ctl[jp]),...o(A)])+'z'}
        if(!open||S.back)continue;const P2s=(x,y)=>R2(sc3(F.sp(j,x,y))),r=S.r;
        /* (edgeL) the thin free edge paler where the light comes through it: a band of constant width inside the outline, by light class */
        if(P.edgeL&&S.c>=1){const w=P.edgeL[0]*r,pin=p=>{const dx=E[0]-p[0],dy=E[1]-p[1],l=Math.hypot(dx,dy)||1,t=Math.min(.35,w/l);return R2([p[0]+dx*t,p[1]+dy*t])};
          dle[S.c-1]+='M'+J(R2(A))+'C'+J([...R2(S.P1),...R2(S.P2),...R2(S.T)])+'C'+J([...R2(S.P3),...R2(S.P4),...R2(Bn)])+'L'+J(pin(Bn))+'C'+J([...pin(S.P4),...pin(S.P3),...pin(S.T)])+'C'+J([...pin(S.P2),...pin(S.P1),...pin(A)])+'z'}
        /* the pale heart: a streak at the base of each sepal */
        if(C.heartO>0&&(!P.heartSh||S.c>=2||C.heartO>.6)){const hl=(C.heartL||.45)*r*(P.heartSh&&S.c<2?P.heartSh[0]:1),hw=r*(C.heartW||.16);if(P.heartSh&&S.c<2)dhs+='M'+J(R2(E))+'Q'+J([...P2s(hl*.45,-hw),...P2s(hl,0)])+'Q'+J([...P2s(hl*.45,hw),...R2(E)])+'z';else dht+='M'+J(R2(E))+'Q'+J([...P2s(hl*.45,-hw),...P2s(hl,0)])+'Q'+J([...P2s(hl*.45,hw),...R2(E)])+'z'}
        /* satin sheen on the half turned to the light; veins (close up) */
        if(hi&&S.c>=2){const sd=S.side,yy=sd>0?S.yr:S.yl,y0=sd*yy*.22;dsn+='M'+J(P2s(r*.3,y0))+'Q'+J([...P2s(r*.58,y0+sd*.36*yy),...P2s(r*.88,y0*.5)])+'Q'+J([...P2s(r*.6,y0-sd*.1*r),...P2s(r*.3,y0)])+'z'}
        if(hi)dvn+='M'+J(P2s(r*.1,0))+'Q'+J([...P2s(r*.45,r*.035*S.side),...P2s(r*.8,0)])+'M'+J(P2s(r*.22,0))+'Q'+J([...P2s(r*.48,-S.yl*.14),...P2s(r*.66,-S.yl*.44)])+'M'+J(P2s(r*.22,0))+'Q'+J([...P2s(r*.48,S.yr*.14),...P2s(r*.66,S.yr*.44)]);
        /* (crum) the dried sepal's creases (short folds from the midrib toward the margin, a dark fold and its lit ridge) and the rolled
           margin on one side (a lit roll over a shaded groove), never past the outline */
        if(P.crum&&fan>.05){const g=t=>lj2(F,j+t),nm=hi?3:2;for(let m=0;m<nm;m++){const a=.18+.24*m+.12*g(m),sd=g(m+1)>.5?1:-1,Y=sd>0?S.yr:S.yl,b=Math.min(.86,a+.12+.1*g(m+2));
            const p0=P2s(r*a,sd*Y*.08),pc=P2s(r*(a+b)/2,sd*Y*.45+r*.05*(g(m+3)-.5)),p1=P2s(r*b,sd*Y*.8);dcr+='M'+J(p0)+'Q'+J([...pc,...p1]);
            dro+='M'+J(P2s(r*a+r*.03,sd*Y*.12))+'Q'+J([...P2s(r*(a+b)/2+r*.03,sd*Y*.45+r*.05*(g(m+3)-.5)),...P2s(r*b+r*.03,sd*Y*.74)])}
          const sd=F.dir,Y=sd>0?S.yr:S.yl;dcr+='M'+J(P2s(r*.3,sd*Y*.62))+'Q'+J([...P2s(r*.6,sd*Y*.74),...P2s(r*.86,sd*Y*.36)]);
          dro+='M'+J(P2s(r*.3,sd*Y*.74))+'Q'+J([...P2s(r*.6,sd*Y*.86),...P2s(r*.84,sd*Y*.44)]);
          /* the dried sepal's fine speckles (81: wine flecks over the tan), from its genes */
          const ns=hi?5:2;for(let m=0;m<ns;m++){const u=pxHashS(F.q.i*7+j,m,11),v=pxHashS(F.q.i*7+j,m,23)*2-1;dsp+='M'+J(P2s(r*(.25+.6*u),v*(v>0?S.yr:S.yl)*.6*(1-.5*u)))+'z'}}
        /* the edge band, of constant width (a picotee, or a browning margin) */
        if(P.rimLine&&!C.rimBand){/* (rimLine) the free edge as fine interrupted strokes a shade darker than the sepal, set inside its outline,
             none near the notches nor along the side that slips under its neighbour (BONNES-PRATIQUES 3.6, 3.6b) */
          const w=Math.max(.3,r*P.rimLine[0]),pin=p=>{const dx=E[0]-p[0],dy=E[1]-p[1],l=Math.hypot(dx,dy)||1,t=Math.min(.3,w*.6/l);return[p[0]+dx*t,p[1]+dy*t]},
            c1=[A,S.P1,S.P2,S.T].map(pin),c2=[S.T,S.P3,S.P4,Bn].map(pin),u0=(F.dir>0?.6:.3)+.15*lj2(F,j+2),u1=(F.dir<0?1.4:1.7)-.15*lj2(F,j+4),ug=u0+(u1-u0)*(.3+.4*lj2(F,j+1)),gw=.1+.08*lj2(F,j+3),
            seg=(a,b)=>{if(b-a<.08)return;const pc=(u,v,cv,o)=>{const Q=bouSub(...cv,u-o,v-o);return'C'+J([...R2(Q[1]),...R2(Q[2]),...R2(Q[3])])};
              let d='M'+J(R2(a<1?bouSub(...c1,a,a+.01)[0]:bouSub(...c2,a-1,a-.99)[0]));if(a<1){d+=pc(a,Math.min(1,b),c1,0);if(b>1)d+=pc(1,b,c2,1)}else d+=pc(a,b,c2,1);drl[S.c>=2?0:1]+=d};
          seg(u0,ug-gw/2);seg(ug+gw/2,u1)}
        else if(C.rimO>0&&C.rimW>0){const w=C.rimW*s,pin=p=>{const dx=E[0]-p[0],dy=E[1]-p[1],l=Math.hypot(dx,dy)||1,t=Math.min(.45,w/l);return R2([p[0]+dx*t,p[1]+dy*t])};
          drm+='M'+J(R2(A))+'C'+J([...R2(S.P1),...R2(S.P2),...R2(S.T)])+'C'+J([...R2(S.P3),...R2(S.P4),...R2(Bn)])+'L'+J(pin(Bn))+'C'+J([...pin(S.P4),...pin(S.P3),...pin(S.T)])+'C'+J([...pin(S.P2),...pin(S.P1),...pin(A)])+'z'}}
      if(dF)dfl.push(dF);
      if(open){/* the under-shade along each overlapping edge, on the sepal underneath */
        for(let j=0;j<nl;j++)dun+='M'+J(R2(N2[j]))+'Q'+J([...R2(ctl[j]),...R2(E)])+'Q'+J([...R2(ctl2[j]),...R2(N2[j])])+'z';
        if(q.nv[2]>.12&&fo>.3){de.push([E[0],E[1]]);deh.push([E[0]+hlo[0],E[1]+hlo[1]])}}
      /* the shadow it casts on the florets behind: its disc as an ellipse */
      if(li>0){const t1=V3.nz(V3.cr(q.nf,Math.abs(q.nf[2])<.9?[0,0,1]:[1,0,0])),t2=V3.cr(q.nf,t1),sv=bouSvd(bouSc(B,t1),bouSc(B,t2)),rx=F.rs*(P.shR||.85),ry=Math.max(.2,F.rs*(P.shR||.85)*sv[1]/(sv[0]||1)),
          ca=Math.cos(sv[2]),sa=Math.sin(sv[2]),c0=F.cs,p0=[svR(c0[0]+shv[0]+ca*rx),svR(c0[1]+shv[1]+sa*rx)],p1=[svR(c0[0]+shv[0]-ca*rx),svR(c0[1]+shv[1]-sa*rx)],ar='a'+J([svR(rx),svR(ry)])+' '+Math.round(sv[2]*180/Math.PI)+' 1 0 ';
        dsh+='M'+J(p0)+ar+J([p1[0]-p0[0],p1[1]-p0[1]])+ar+J([p0[0]-p1[0],p0[1]-p1[1]])}}
    if(dsh){const a={d:dsh,fill:C.deep,'fill-opacity':P.sh[1]};if(clip)a['clip-path']=`url(#${clip})`;E('path',a,k)}
    const rd=hi?svR:Math.round,RL=d=>bouRelD(d,rd);
    for(let m=0;m<2;m++)if(dss[m]){const a={d:RL(dss[m]),fill:C.deep,'fill-opacity':svF(P.shSep[1])};if(clip)a['clip-path']=`url(#${clip})`;E('path',a,k)}
    for(const key of Object.keys(dd).sort()){const vc=key.split('_').map(Number);E('path',{d:RL(dd[key]),fill:fillOf(vc[0],vc[1])},k)}
    /* (floG [light, deep]) each floret's own relief: one shared gradient over its bounding box, its sepals toward the light paler and those
       away from it deeper, so that florets stand apart from their neighbours (refcache 84, 70: lit edge against the next one's shade) */
    if(dfl.length){if(!X.fg){const lx=LL[0],ly=-LL[1],l=Math.hypot(lx,ly)||1,id='bo'+(gid++),gr=E('linearGradient',{id,x1:svF(.5+.5*lx/l),y1:svF(.5+.5*ly/l),x2:svF(.5-.5*lx/l),y2:svF(.5-.5*ly/l)},GDEF||defs);
        stops(gr,[[0,C.light,P.floG[0]],[.45,C.light,0],[.55,C.deep,0],[1,C.deep,P.floG[1]]]);X.fg=`url(#${id})`}
      for(const d of dfl)E('path',{d:RL(d),fill:X.fg},k)}
    if(dht)E('path',{d:RL(dht),fill:C.heart,'fill-opacity':svF(C.heartO)},k);
    if(dhs)E('path',{d:RL(dhs),fill:C.heart,'fill-opacity':svF(C.heartO*P.heartSh[1])},k);
    for(let c=0;c<3;c++)if(dle[c])E('path',{d:RL(dle[c]),fill:C.edgeL||C.light,'fill-opacity':svF(P.edgeL[1]*[.3,.6,1][c])},k);
    if(dun)E('path',{d:RL(dun),fill:C.deep,'fill-opacity':svF(P.unO??.3)},k);
    if(dsn)E('path',{d:RL(dsn),fill:C.light,'fill-opacity':svF(P.snO??.22)},k);
    if(dvn)E('path',{d:RL(dvn),fill:'none',stroke:C.vein||C.deep,'stroke-width':svF(Math.max(.12,s*.014)),'stroke-opacity':svF(Math.min(.42,(P.vnO??.2)*(1+(P.crum?P.crum[2]*fan:0)))),'stroke-linecap':'round'},k);
    if(dsp)E('path',{d:dsp,fill:'none',stroke:C.fleck||C.deep,'stroke-width':svF(Math.max(.4,s*.035)),'stroke-linecap':'round','stroke-opacity':svF(Math.min(.55,.6*fan))},k);
    if(dcr){E('path',{d:RL(dcr),fill:'none',stroke:C.deep,'stroke-width':svF(Math.max(.25,s*.02)),'stroke-opacity':svF(Math.min(.42,.42*fan)),'stroke-linecap':'round'},k);
      E('path',{d:RL(dro),fill:'none',stroke:C.light,'stroke-width':svF(Math.max(.2,s*.018)),'stroke-opacity':svF(Math.min(.45,.42*fan)),'stroke-linecap':'round'},k)}
    if(drm)E('path',{d:RL(drm),fill:C.rim,'fill-opacity':svF(C.rimO)},k);
    for(let i=0;i<2;i++)if(drl[i])E('path',{d:RL(drl[i]),fill:'none',stroke:i?C.shade:mix(C.body,C.shade,.5),'stroke-width':svF(Math.max(.3,s*P.rimLine[1])),'stroke-opacity':svF(P.rimLine[2+i]),'stroke-linecap':'round'},k);
    if(de.length&&!LOD){if(hi)E('path',{d:svDots(de),fill:'none',stroke:C.deep,'stroke-width':svF(eyeW*1.35),'stroke-linecap':'round','stroke-opacity':.35},k);
      E('path',{d:svDots(de),fill:'none',stroke:C.eye,'stroke-width':svF(eyeW),'stroke-linecap':'round'},k);
      if(hi)E('path',{d:svDots(deh),fill:'none',stroke:C.eyeL||C.light,'stroke-width':svF(eyeW*.42),'stroke-linecap':'round','stroke-opacity':.85},k)}}
  return k}
