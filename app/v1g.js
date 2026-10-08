
/* ================= Le bronze coulé : un vase de bronze patiné à reliefs, rendu point par point =================
   A cast vessel (v.cast names its design in CAST_DESIGNS) carries its reliefs as a height field over its turned surface, angle round the axis
   by height: the water in low relief (crests rising gently to a steep front, incised and raised threads, bubbles, a splash), the carp in high
   relief (a rounded body between its back and belly contours, scales lying like tiles, the gill cover, the eye, rayed fins). Its body is
   rendered into an image pixel by pixel: the view ray finds the relief (the carp stands out of the surface, even past the silhouette), the
   light gives a wrapped diffuse, the patina's satin sheen and the studio's reflection (bright where the surface looks up, dark where it
   looks at the floor), the relief casts soft shadows and darkens its hollows, the patina is mottled and grained with a few bright specks,
   and the high points are rubbed back to the warm metal. Made once per vessel and size. */
const CAST_CACHE={};
const castBump=x=>x<1?(1-x*x)*(1-x*x):0;
const castHash=(i,j)=>{let x=Math.imul(i,374761393)+Math.imul(j,668265263)|0;x=Math.imul(x^(x>>>13),1274126177);return((x^(x>>>16))>>>0)/4294967296};
function castNoise(x,y){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,a=castHash(i,j),b=castHash(i+1,j),c=castHash(i,j+1),d=castHash(i+1,j+1),su=u*u*(3-2*u),sv=v*v*(3-2*v);
  return a+(b-a)*su+(c-a)*sv+(a-b-c+d)*su*sv}
function castInside(P){return(x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}}
/* every texel within R units of a line (closed: a loop): fn(k,d,side,s,L) with k the texel, d its distance, side +1 on the left of the line's
   way (angle to the right, height up) and -1 on its right, s the length along the line to the nearest point, L the line's length */
function castNear(F,pts,R,fn,closed){const{U0,du,dh,Nu,Nv,rr}=F,P=closed?pts.concat([pts[0]]):pts,n=P.length,Ls=[0],rAt=h=>rr[Math.max(0,Math.min(Nv-1,Math.round(h/dh)))];
  let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;
  for(let i=0;i<n;i++){const p=P[i];a0=Math.min(a0,p[0]);a1=Math.max(a1,p[0]);b0=Math.min(b0,p[1]);b1=Math.max(b1,p[1]);
    if(i)Ls.push(Ls[i-1]+Math.hypot((p[0]-P[i-1][0])*rAt((p[1]+P[i-1][1])/2),p[1]-P[i-1][1]))}
  /* each segment visits only the texels near it, keeping for every texel its nearest point so far */
  const rmn=Math.max(6,Math.min(rAt(b0-R),rAt(b1+R))),iA=Math.max(0,Math.floor((a0-R/rmn-U0)/du)),iB=Math.min(Nu-1,Math.ceil((a1+R/rmn-U0)/du)),
    jA=Math.max(0,Math.floor((b0-R)/dh)),jB=Math.min(Nv-1,Math.ceil((b1+R)/dh)),BW=iB-iA+1,BH=jB-jA+1;if(BW<=0||BH<=0)return;
  const R2=R*R,BD=new Float32Array(BW*BH).fill(R2),BS=new Int8Array(BW*BH),BL=new Float32Array(BW*BH),L=Ls[n-1];
  for(let k=0;k<n-1;k++){const p0=P[k],p1=P[k+1],sa=Math.min(p0[1],p1[1])-R,sb=Math.max(p0[1],p1[1])+R,ja=Math.max(jA,Math.floor(sa/dh)),jb=Math.min(jB,Math.ceil(sb/dh));
    for(let j=ja;j<=jb;j++){const h=j*dh,r=rr[j],da=R/Math.max(6,r),ia=Math.max(iA,Math.floor((Math.min(p0[0],p1[0])-da-U0)/du)),ib=Math.min(iB,Math.ceil((Math.max(p0[0],p1[0])+da-U0)/du)),
        ay=p0[1]-h,ex=(p1[0]-p0[0])*r,ey=p1[1]-p0[1],l2=ex*ex+ey*ey||1e-9,ll=Math.sqrt(l2),o=(j-jA)*BW-iA;
      for(let i=ia;i<=ib;i++){const ax=(p0[0]-U0-i*du)*r;let t=-(ax*ex+ay*ey)/l2;t=t<0?0:t>1?1:t;const qx=ax+ex*t,qy=ay+ey*t,d=qx*qx+qy*qy,m=o+i;
        if(d<BD[m]){BD[m]=d;BS[m]=ey*ax-ex*ay>=0?1:-1;BL[m]=Ls[k]+t*ll}}}}
  for(let j=jA;j<=jB;j++){const o=(j-jA)*BW;for(let i=iA;i<=iB;i++){const m=o+i-iA;if(BS[m])fn(j*Nu+i,Math.sqrt(BD[m]),BS[m],BL[m],L)}}}
/* the water: crests (a gentle back rising to the crest, then a steep front), incised and raised threads, bubbles, the splash */
function castWater(F,des){const{Hf,Wb,Nu,U0,du,dh,rr,Nv}=F;
  for(const[A,w,Lb,side,ti,to,P]of des.crest||[])castNear(F,P,Math.max(Lb,w),(k,d,sd,s,L)=>{const tp=sm01(s/ti)*sm01((L-s)/to);if(tp<=0)return;
    Hf[k]+=A*tp*(sd===side?1-sm01(d/Lb):1-sm01(d/w));if(d<w*1.6)Wb[k]=Math.max(Wb[k],.12*tp*(1-d/(w*1.6)))});
  for(const[a,w,P]of des.groove||[])castNear(F,P,w,(k,d,sd,s,L)=>{Hf[k]-=a*castBump(d/w)*sm01(s/2)*sm01((L-s)/2)});
  for(const[a,w,P]of des.ridge||[])castNear(F,P,w,(k,d,sd,s,L)=>{const e=castBump(d/w)*sm01(s/1.2)*sm01((L-s)/1.2);Hf[k]+=a*e;Wb[k]=Math.max(Wb[k],.15*e)});
  for(const[a,w,ph,h,Rr]of des.ring||[]){const r=rr[Math.max(0,Math.min(Nv-1,Math.round(h/dh)))],P=[];for(let i=0;i<28;i++){const an=i/28*2*Math.PI;P.push([ph+Rr*Math.cos(an)/r,h+Rr*Math.sin(an)])}
    castNear(F,P,w,(k,d)=>{const e=castBump(d/w);Hf[k]+=a*e;Wb[k]=Math.max(Wb[k],.2*e)},true)}
  for(const[a,w,P]of des.blob||[]){const ins=castInside(P);castNear(F,P,w*3,(k,d)=>{const i=k%Nu,j=(k-i)/Nu;if(!ins(U0+i*du,j*dh))return;
    const e=.75*sm01(d/w)+.25*sm01(d/(w*3));Hf[k]+=a*e;Wb[k]=Math.max(Wb[k],.25*e)},true)}}
/* the carp in high relief, leaping, seen from the back. Its body is the strip between its two contours (snout to tail base), mapped as (t along,
   q across: -1 the inner flank, +1 the outer), rounded about the crest of its back; scales lie like tiles on both halves, each over the next
   toward the tail, its free edge raised and stepped; the dorsal fin rises from the crest over the inner flank; the gill cover stands proud,
   the eye is a ringed dome with a sunk pupil, mouth and nostril are cut in; the pectoral and pelvic fins and the tail are thin rayed plates */
function castCarp(F,C){const{U0,du,dh,Nu,Nv,rr,Hf,Wb}=F,D=C.D,V=C.V,n=D.length,T=C.T,rAt=h=>rr[Math.max(0,Math.min(Nv-1,Math.round(h/dh)))];
  for(const fn of C.fins){const O=fn.o,c=fn.c,ins=castInside(O),rc=rAt(c[1]),A=[];let rmx=0,sx=0,sy=0;
    for(const p of O){const x=(p[0]-c[0])*rc,y=p[1]-c[1],a=Math.atan2(y,x);rmx=Math.max(rmx,Math.hypot(x,y));A.push(a);sx+=Math.cos(a);sy+=Math.sin(a)}
    const am=Math.atan2(sy,sx),wrap=a=>{a-=am;while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};let lo=0,hi=0;for(const a of A){const d=wrap(a);lo=Math.min(lo,d);hi=Math.max(hi,d)}
    castNear(F,O,7,(k,d)=>{const i=k%Nu,j=(k-i)/Nu,ph=U0+i*du,h=j*dh;if(!ins(ph,h))return;const x=(ph-c[0])*rr[j],y=h-c[1],rho=Math.min(1,Math.hypot(x,y)/rmx),
        a=(wrap(Math.atan2(y,x))-lo)/((hi-lo)||1)*fn.n,ray=Math.pow(Math.cos(Math.PI*a)**2,6),e=sm01(d/.4),
        hg=(fn.t0+(fn.t1-fn.t0)*rho)*e+(.15*ray-.05)*Math.min(1,.35+rmx/12)*sm01(d/.8)*(.3+.7*rho)-.12*rho*rho*e*(1-rho);
      if(hg>Hf[k]){Hf[k]=hg;Wb[k]=Math.max(Wb[k],.12*ray*e+.28*(1-e))}},true)}
  /* the strip: its mid line's length, its half width, the scale rows and columns (their pitch follows the width, smaller toward the tail) */
  const Lm=[0],Wd=[];
  for(let i=0;i<n;i++){const r=rAt((D[i][1]+V[i][1])/2);Wd.push(Math.hypot((D[i][0]-V[i][0])*r,D[i][1]-V[i][1])/2);
    if(i){const mx=(D[i][0]+V[i][0]-D[i-1][0]-V[i-1][0])/2,my=(D[i][1]+V[i][1]-D[i-1][1]-V[i-1][1])/2;Lm.push(Lm[i-1]+Math.hypot(mx*r,my))}}
  const Wmax=Math.max(...Wd),at=(A,t)=>{const i=Math.min(n-2,Math.max(0,Math.floor(t))),u=t-i;return A[i]+(A[i+1]-A[i])*u},
    PT=Wd.map(w=>2.05*Math.max(.55,Math.min(1,w/Wmax))),PS=Wd.map(w=>1.5*Math.max(.55,Math.min(1,w/Wmax))),Tau=[0];
  for(let i=1;i<n;i++)Tau.push(Tau[i-1]+(Lm[i]-Lm[i-1])*2/(PT[i-1]+PT[i]));
  /* a point of the strip from its place: the inverse of one quad (bilinear), then of the quad holding it */
  const inv=(i,ph,h)=>{const r=rAt(h),a=V[i],b=V[i+1],c=D[i+1],d=D[i],ex=(b[0]-a[0])*r,ey=b[1]-a[1],fx=(d[0]-a[0])*r,fy=d[1]-a[1],gx=(a[0]-b[0]+c[0]-d[0])*r,gy=a[1]-b[1]+c[1]-d[1],
      hx=(ph-a[0])*r,hy=h-a[1],k2=gx*fy-gy*fx,k1=ex*fy-ey*fx+hx*gy-hy*gx,k0=hx*ey-hy*ex,
      uOf=v=>{const dx=ex+gx*v,dy=ey+gy*v;return Math.abs(dx)>Math.abs(dy)?(hx-fx*v)/dx:(hy-fy*v)/dy},ok=(u,v)=>u>=-1e-4&&u<=1+1e-4&&v>=-1e-4&&v<=1+1e-4;
    let u,v;if(Math.abs(k2)<1e-5){if(Math.abs(k1)<1e-9)return null;v=-k0/k1;u=uOf(v)}
    else{let w=k1*k1-4*k0*k2;if(w<0)return null;w=Math.sqrt(w);const ik=.5/k2;v=(-k1-w)*ik;u=uOf(v);if(!ok(u,v)){v=(-k1+w)*ik;u=uOf(v)}}
    return ok(u,v)?[i+Math.max(0,Math.min(1,u)),Math.max(0,Math.min(1,v))*2-1]:null};
  const QB=[];for(let i=0;i<n-1;i++){const xs=[V[i][0],V[i+1][0],D[i+1][0],D[i][0]],ys=[V[i][1],V[i+1][1],D[i+1][1],D[i][1]];QB.push([Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)])}
  const where=(ph,h)=>{for(let i=0;i<n-1;i++){const q=QB[i];if(ph<q[0]-1e-4||ph>q[1]+1e-4||h<q[2]-1e-3||h>q[3]+1e-3)continue;const r=inv(i,ph,h);if(r)return r}return null};
  /* the gill cover's free edge, across the body */
  const G=[];for(const p of C.gill){const r=where(p[0],p[1]);if(r)G.push(r)}G.sort((a,b)=>a[1]-b[1]);
  const tg=q=>{if(!G.length)return 3.5;if(q<=G[0][1])return G[0][0];for(let i=1;i<G.length;i++)if(G[i][1]>=q){const a=G[i-1],b=G[i],u=(q-a[1])/((b[1]-a[1])||1);return a[0]+(b[0]-a[0])*u}return G[G.length-1][0]};
  let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;for(const q of QB){a0=Math.min(a0,q[0]);a1=Math.max(a1,q[1]);b0=Math.min(b0,q[2]);b1=Math.max(b1,q[3])}
  const jA=Math.max(0,Math.floor(b0/dh)),jB=Math.min(Nv-1,Math.ceil(b1/dh)),iA=Math.max(0,Math.floor((a0-U0)/du)),iB=Math.min(Nu-1,Math.ceil((a1-U0)/du)),E0=C.eye,Re=E0[2],N0=C.nostril;
  /* seen from the back: the crest of the back (qm) runs along the body, the dorsal fin rises from it over the inner flank (F0..F1) */
  const qm=C.mid??-.2,F0=(C.fin||[.44,.94])[0]*(n-1),F1=(C.fin||[.44,.94])[1]*(n-1),LF=at(Lm,F0);
  for(let j=jA;j<=jB;j++){const h=j*dh,r=rr[j];
    for(let i=iA;i<=iB;i++){const ph=U0+i*du,tq=where(ph,h);if(!tq)continue;const[t,q]=tq,k=j*Nu+i,th=at(T,t),W=at(Wd,t),z=q<qm?(q-qm)/(1+qm):(q-qm)/(1-qm),
        prof=Math.pow(Math.max(0,1-Math.pow(Math.abs(z),2.4)),.42),Lt=at(Lm,t),Lg=at(Lm,tg(q));let hb=th*prof*(.3+.7*sm01(W/(1.1*th))),wb=.12*Math.pow(prof,8);
      /* the gill cover: a plate rising toward its free edge, proud of the body */
      if(Lt<Lg+.3){const op=sm01((Lt-(Lg-5))/3.5)*(1-sm01((Lt-Lg)/.3));hb+=.62*op*prof;wb+=.25*op*op*op}
      /* the dorsal fin: a smooth plate with fine rays raking back, rising from the crest and leaning over the inner flank, its free edge
         standing proud of the vessel and rubbed bright; its front edge rakes back from the crest */
      const fa=sm01((t-F0)/1.6)*sm01((F1-t)/1.2),qe=qm-(1+qm)*fa;
      if(fa>.02&&q<qm+.03&&q>qe-.02){const u=Math.max(0,Math.min(1,(qm-q)/((qm-qe)||1))),eg=sm01((q-qe)*W/.35),
          ray=Math.pow(Math.cos(Math.PI*((Lt-LF)/.75-u*2.6))**2,4),hf=(th*(1.03-.3*u)+.07*ray*(.3+.7*u))*eg*(.6+.4*fa)-.12*castBump((qm-q)*W/.3);
        if(hf>hb){hb=hf;wb=Math.max(wb,.42+.28*u*eg)}}
      else{/* scales on both halves of the back, mirrored about its crest, their rows in chevrons; the top one is the nearest the head */
        const sc=sm01((Lt-Lg+.05)/.45)*sm01((n-1.25-t)/.5);
        if(sc>0){const sig=Math.abs(q-qm)*W/at(PS,t),tau=at(Tau,t)-.3*sig,R0=.72;let bt=1e9,bx=0,bd=0;
          for(let rw=Math.floor(tau)-1;rw<=Math.floor(tau)+1;rw++){const off=(rw&1)?.5:0,c0=Math.round(sig-off);
            for(let c=c0-1;c<=c0+1;c++){const dt=tau-(rw+.5),ds=sig-(c+off),d2=dt*dt+ds*ds;if(d2<R0*R0&&rw<bt){bt=rw;bx=dt;bd=Math.sqrt(d2)}}}
          if(bt<1e9){const as=.42*Math.sqrt(Math.max(.3,W/Wmax))*sc,rise=sm01((bx/R0+1)/2),edge=bx>0?1-.7*sm01((bd/R0-.82)/.18):1;
            hb+=as*(.25+.55*rise+.3*(1-bd*bd/(R0*R0)))*edge*Math.min(1,prof*3);wb+=.1*rise*rise*rise*sc}}}
      /* the eye: a dome ringed by its iris, the pupil sunk; the nostril */
      const ed=Math.hypot((ph-E0[0])*r,h-E0[1]);if(ed<Re*2.2){hb+=.55*castBump(ed/(Re*1.9))+.24*castBump(Math.abs(ed-Re*.86)/(Re*.28))-.5*castBump(ed/(Re*.42));wb+=.3*castBump(Math.abs(ed-Re*.86)/(Re*.3))}
      hb-=.28*castBump(Math.hypot((ph-N0[0])*r,h-N0[1])/.42);
      if(hb>Hf[k]){Hf[k]=hb;Wb[k]=Math.max(Wb[k],Math.min(1,wb))}}}
  /* the mouth, cut along the snout */
  castNear(F,C.mouth,.45,(k,d)=>{Hf[k]-=.3*castBump(d/.45)})}
/* a box blur along one line of a map (three passes make it nearly gaussian) */
function castBox(A,o,st,n,r,T){let s=0;for(let i=-r;i<=r;i++)s+=A[o+st*Math.min(n-1,Math.max(0,i))];
  for(let i=0;i<n;i++){T[i]=s/(2*r+1);s+=A[o+st*Math.min(n-1,i+r+1)]-A[o+st*Math.max(0,i-r)]}for(let i=0;i<n;i++)A[o+st*i]=T[i]}
function castBlur(F,A,R,passes=3){const{Nu,Nv,du,dh,rr}=F,B=new Float32Array(A),T=new Float32Array(Math.max(Nu,Nv)),k=1/Math.sqrt(passes);
  for(let p=0;p<passes;p++){for(let j=0;j<Nv;j++)castBox(B,j*Nu,1,Nu,Math.max(1,Math.round(R*k/(du*Math.max(6,rr[j])))),T);
    const rv=Math.max(1,Math.round(R*k/dh));for(let i=0;i<Nu;i++)castBox(B,i,Nu,Nv,rv,T)}return B}
/* the whole field of a vessel: heights (softened a little), hollows (ambient occlusion), rubbed high points, and a coarse map of the
   highest relief around each place (to know where the view and light rays must look for it) */
function castBuild(v,S,ts,des){des=des||{};const H=S[S.length-1][0],rmax=Math.max(...S.map(s=>s[1])),U0=-1.75,du=ts/rmax,Nu=Math.ceil(3.5/du)+1,dh=ts,Nv=Math.ceil(H/dh)+2,N=Nu*Nv,
    rr=new Float32Array(Nv),sl=new Float32Array(Nv);
  for(let j=0;j<Nv;j++){const h=Math.min(H,j*dh);rr[j]=sRad(S,h);sl[j]=(sRad(S,Math.min(H,h+.6))-sRad(S,Math.max(0,h-.6)))/((Math.min(H,h+.6)-Math.max(0,h-.6))||1)}
  /* the profile's slope smoothed (a turned surface bends gently: no bands where its samples join) */
  {const T=new Float32Array(Nv),rv=Math.max(1,Math.round(1.2/dh));for(let p=0;p<3;p++)castBox(sl,0,1,Nv,rv,T)}
  const F={U0,du,dh,Nu,Nv,H,rr,sl,ts,Hf:new Float32Array(N),Wb:new Float32Array(N)};
  castWater(F,des);if(des.carp)castCarp(F,des.carp);
  const Hs=castBlur(F,F.Hf,ts*1.1,1);F.Hf=null;const B1=castBlur(F,Hs,.9),B2=castBlur(F,Hs,3.6),AO=new Float32Array(N),Wr=new Float32Array(N);
  for(let k=0;k<N;k++){const c1=B1[k]-Hs[k],c2=B2[k]-Hs[k];AO[k]=1-.62*Math.min(1,Math.max(0,c2/1.25))-.42*Math.min(1,Math.max(0,c1/.22));
    Wr[k]=Math.min(1,Math.max(0,F.Wb[k]+.8*Math.max(0,-c1-.03)))}
  F.Wb=null;F.Hs=Hs;F.Hb=B1;F.AO=AO;F.Wr=Wr;
  /* the highest relief in blocks of 12 texels, spread to the neighbouring blocks */
  const BS=12,MU=Math.ceil(Nu/BS),MV=Math.ceil(Nv/BS),M0=new Float32Array(MU*MV),Mx=new Float32Array(MU*MV);
  for(let j=0;j<Nv;j++)for(let i=0;i<Nu;i++){const m=((j/BS)|0)*MU+((i/BS)|0),x=Hs[j*Nu+i];if(x>M0[m])M0[m]=x}
  for(let b=0;b<MV;b++)for(let a=0;a<MU;a++){let m=0;for(let db=-2;db<=2;db++)for(let da=-2;da<=2;da++){const bb=b+db,aa=a+da;if(bb>=0&&bb<MV&&aa>=0&&aa<MU)m=Math.max(m,M0[bb*MU+aa])}Mx[b*MU+a]=m}
  F.Mx=Mx;F.MU=MU;F.MV=MV;F.BS=BS;let g=0;for(const x of M0)g=Math.max(g,x);F.Mg=g;return F}
/* the image's resolution (pixels per unit): set it higher for a large render, 0 lets the level of detail decide */
let CAST_S=0;
const CAST_LOOK=[1.5,4,8,13];
/* the body of a cast vessel in pixels (RGBA, W x H) and its place in user space, s pixels per unit. It reads only its arguments: env carries
   the constants (VX, FL, LV, the shadow look-ahead, the design, a debug pass), so the same function runs in a worker */
function castPixels(v,S,s,env){const{VX,FL,LV:L,LOOK,des,dbg}=env,ts=Math.max(.12,Math.min(.5,1.15/s)),
    F=castBuild(v,S,ts,des),{U0,du,dh,Nu,Nv,rr,sl,Hs,Hb,AO,Wr,Mx,MU,MV,BS,Mg,H}=F,rmax=Math.max(...S.map(q=>q[1])),m=Mg+1,
    x0=VX-rmax-m,x1=VX+rmax+m,y0=FL-H-.6,y1=FL+.6,W=Math.ceil((x1-x0)*s),Ht=Math.ceil((y1-y0)*s),
    px=new Uint8ClampedArray(W*Ht*4),
    samp=(A,ph,h)=>{let x=(ph-U0)/du,y=h/dh;x=x<0?0:x>Nu-1.001?Nu-1.001:x;y=y<0?0:y>Nv-1.001?Nv-1.001:y;const i=x|0,j=y|0,u=x-i,w=y-j,k=j*Nu+i;
      return(A[k]*(1-u)+A[k+1]*u)*(1-w)+(A[k+Nu]*(1-u)+A[k+Nu+1]*u)*w},
    row=h=>Math.max(0,Math.min(Nv-1,Math.round(h/dh))),
    lin1=(A,h)=>{let y=h/dh;y=y<0?0:y>Nv-1.001?Nv-1.001:y;const j=y|0,u=y-j;return A[j]+(A[j+1]-A[j])*u},
    mxAt=(ph,h)=>Mx[Math.max(0,Math.min(MV-1,(h/dh/BS)|0))*MU+Math.max(0,Math.min(MU-1,((ph-U0)/du/BS)|0))],
    /* the patina: a dark olive brown, a greyer olive, a warmer brown; the metal where it is rubbed */
    P1=[92,82,62],P2=[104,100,82],P3=[110,86,54],MT=[150,110,60];
  for(let py=0;py<Ht;py++){const y=y0+(py+.5)/s,h0=FL-y,cvV=Math.min(1,Math.max(0,h0*s+.5))*Math.min(1,Math.max(0,(H-h0)*s+.5));if(cvV<=0)continue;
    const hc=Math.max(0,Math.min(H,h0)),rb=sRad(S,hc),s0=lin1(sl,hc),cb=1/Math.sqrt(1+s0*s0),sb=-s0*cb;
    for(let qx=0;qx<W;qx++){const x=x0+(qx+.5)/s,dx=x-VX,adx=Math.abs(dx);if(adx>rb+Mg+.5)continue;
      const M=mxAt(Math.asin(Math.max(-1,Math.min(1,dx/rb))),hc);if(adx>rb+M+.3&&adx>rb+.5/s)continue;
      let ph,hb,d,cov=1;
      if(M<.9){if(adx>=rb+.5/s)continue;
        /* low relief: the surface point, moved by its relief along the ray */
        cov=Math.min(1,Math.max(0,(rb-adx)*s+.5));const dxx=Math.sign(dx)*Math.min(adx,rb*.9999);ph=Math.asin(dxx/rb);d=0;hb=hc;
        for(let it=0;it<2;it++){d=samp(Hs,ph,hb);ph=Math.asin(Math.max(-1,Math.min(1,dxx/(rb+d*cb))));hb=hc-d*sb}}
      else{/* high relief: the view ray marched down onto it, then refined */
        const zT=Math.sqrt(Math.max(0,(rb+M+.3)**2-dx*dx)),zB=adx<rb?Math.sqrt(rb*rb-dx*dx):0,st=Math.max(.06,Math.min(.3,1.6/s));let zo=zT,zi=-1;
        for(let z=zT;;z-=st){const zz=Math.max(z,zB),rho=Math.sqrt(dx*dx+zz*zz),e=(rho-rb)*cb;if(e<=samp(Hs,Math.atan2(dx,zz),hc-e*sb)){zi=zz;break}zo=zz;if(zz<=zB)break}
        if(zi<0){if(adx>=rb-.5/s){if(adx>=rb+.5/s)continue;cov=Math.min(1,Math.max(0,(rb-adx)*s+.5))}zi=zB}
        for(let it=0;it<6&&zo>zi;it++){const zm=(zo+zi)/2,rho=Math.sqrt(dx*dx+zm*zm),e=(rho-rb)*cb;if(e<=samp(Hs,Math.atan2(dx,zm),hc-e*sb))zi=zm;else zo=zm}
        const rho=Math.sqrt(dx*dx+zi*zi);ph=Math.atan2(dx,zi);d=(rho-rb)*cb;hb=hc-d*sb}
      /* the normal: the turned surface's, bent by the relief's slopes */
      const rh=lin1(rr,hb),s1=lin1(sl,hb),cbh=1/Math.sqrt(1+s1*s1),sbh=-s1*cbh,sp=Math.sin(ph),cp=Math.cos(ph),
        gu=(samp(Hs,ph+du,hb)-samp(Hs,ph-du,hb))/(2*du*(rh+d)),gv=(samp(Hs,ph,hb+dh)-samp(Hs,ph,hb-dh))*cbh/(2*dh);
      let nx=sp*cbh-gu*cp+gv*sp*sbh,ny=sbh-gv*cbh,nz=cp*cbh+gu*sp+gv*cp*sbh;const nl0=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;nx/=nl0;ny/=nl0;nz/=nl0;
      /* soft shadow: the light ray marched over the relief, softened (only the relief casts, and only its forms: the scales' own hollows are the
         occlusion's business, the body's turning away the diffuse's) */
      const ro=rh+d*cbh,PX=ro*sp+nx*.15,PY=hb+d*sbh+ny*.15,PZ=ro*cp+nz*.15;let sh=1;
      let near=false;if(Mg>.5)for(let q4=0;q4<4;q4++){const tt=LOOK[q4];const X=PX+L[0]*tt,Y=PY+L[1]*tt,Z=PZ+L[2]*tt;if(Y>H)break;if(mxAt(Math.atan2(X,Z),Math.max(0,Y))>d+.1){near=true;break}}
      if(near){let t=.35;for(let k=0;k<44&&t<18;k++){const X=PX+L[0]*t,Y=PY+L[1]*t,Z=PZ+L[2]*t;if(Y<0||Y>H)break;const s2=lin1(sl,Y),cq=1/Math.sqrt(1+s2*s2),
          e=(Math.sqrt(X*X+Z*Z)-lin1(rr,Y))*cq;if(e<-.4)break;const Hq=samp(Hb,Math.atan2(X,Z),Y+e*s2*cq),cl=e-Hq;
          if(Hq>.04){if(cl<-.07){sh=0;break}sh=Math.min(sh,10*(cl+.04)/t)}if(e>Mg+.3)break;t+=Math.max(.1,Math.abs(cl)*.5)}
        sh=sh<0?0:sh>1?1:sh;sh=sh*sh*(3-2*sh)}
      /* light: wrapped diffuse and sky; the studio mirrored in the satin patina (floor dark, walls, a bright ceiling, the key light, a fill
         from the right), more sharply and warmer where the bronze is rubbed */
      const ao=samp(AO,ph,hb),wr=samp(Wr,ph,hb),nl=nx*L[0]+ny*L[1]+nz*L[2],wrap=Math.max(0,(nl+.12)/1.12),I=(.16+.12*ny)*(.4+.6*ao)*(.55+.45*sm01((hb-1)/26))+.9*wrap*sh*(.7+.3*ao),
        rx=2*nz*nx,ry=2*nz*ny,rz=2*nz*nz-1,rl=Math.max(0,rx*L[0]+ry*L[1]+rz*L[2]),r2=rl*rl,r4=r2*r2,r8=r4*r4,r9=r8*rl,r18=r9*r9,r36=r18*r18,fz=1-Math.max(0,nz),fz2=fz*fz,
        og=.4+.6*sm01((hb-1)/26),env=(.05+.22*sm01((ry+.35)/.5)+.62*sm01((ry-.1)/.7)+.2*Math.pow(Math.max(0,.82*rx+.26*ry+.51*rz),6))*(.45+.55*ao)*og,key=(1.1*r9+.6*r36+wr*2*r36*r36*r8)*sh,
        F0=.24+.3*wr,Fk=(F0+(1-F0)*fz2*fz2*fz*.6)*255,Fr=Fk*env,Fw=Fk*key;
      /* the patina: mottled, grained (fine and coarser cast grain), darker low down and in the hollows, rubbed to the metal on the high points */
      const X=ph*rmax,nA=castNoise(X/14,hb/14)*.6+castNoise(X/5,hb/5)*.4,nB=castNoise(X/9+31,hb/9+17),gi=((ph-U0)/du)|0,gj=(hb/dh)|0,gr=castHash(gi,gj),g2c=castHash(gi>>1,(gj>>1)+5003),
        dk=(.55+.45*sm01((hb-4)/80))*(.84+.1*gr+.08*g2c)*(.78+.22*ao),mb=Math.max(0,nB-.45)*.9,mw=wr*.42;
      let R=(P1[0]+(P2[0]-P1[0])*nA)*(1-mb)+P3[0]*mb,G=(P1[1]+(P2[1]-P1[1])*nA)*(1-mb)+P3[1]*mb,B=(P1[2]+(P2[2]-P1[2])*nA)*(1-mb)+P3[2]*mb;
      /* the studio mirrored neutral and cool; the key light's sheen warmer, as the metal shows through the thin patina */
      R=(R*dk*(1-mw)+MT[0]*mw)*I+Fr*(.9+.1*wr)+Fw;G=(G*dk*(1-mw)+MT[1]*mw)*I+Fr*(.92-.1*wr)+Fw*(.9-.08*wr);B=(B*dk*(1-mw)+MT[2]*mw)*I+Fr*(.94-.38*wr)+Fw*(.74-.3*wr);
      /* a few bright grains catching the light */
      if(castHash(gi+7919,gj+104729)>.9985-.0015*(1-sm01((hb-20)/60))){const g2=(.3+.7*wrap)*sh*.6;R+=110*g2;G+=86*g2;B+=50*g2}
      if(dbg){const q=dbg==='sh'?sh:dbg==='ao'?ao:dbg==='wr'?wr:dbg==='i'?Math.min(1,I/1.3):Math.max(0,Math.min(1,d/6));R=G=B=255*q}
      const o=(py*W+qx)*4;px[o]=R;px[o+1]=G;px[o+2]=B;px[o+3]=255*cov*cvV}}
  return{data:px,W,H:Ht,x:x0,y:y0,w:x1-x0,h:y1-y0}}
const castEnv=v=>({VX,FL,LV,LOOK:CAST_LOOK,des:CAST_DESIGNS[v.cast]||{},dbg:typeof CAST_DBG!=='undefined'?CAST_DBG:0});
/* pixels to an image: WebP keeps the vessel about fifteen times lighter than PNG; a browser that cannot write WebP gives PNG instead */
function castEncode(r){const cv=document.createElement('canvas');cv.width=r.W;cv.height=r.H;const cx=cv.getContext('2d'),im=cx.createImageData(r.W,r.H);im.data.set(r.data);cx.putImageData(im,0,0);
  return{url:cv.toDataURL('image/webp',.92),x:r.x,y:r.y,w:r.w,h:r.h}}
/* the body of a cast vessel as an image {url,x,y,w,h} in user space, made here and now (exports, tools) */
function castImage(v,S,s){const key=v.id+'|'+s;if(!CAST_CACHE[key])CAST_CACHE[key]=castEncode(castPixels(v,S,s,castEnv(v)));return CAST_CACHE[key]}
/* ---------- made beside the page: a worker built from these very functions (by their own names, which minifying may change), the turned
   body shown in plain bronze meanwhile, then the image put in its place; without a worker, the same work a moment after the page is drawn ---------- */
let CAST_WK,CAST_SYNC=0;const CAST_JOBS={},CAST_PAR={};
function castWorker(){if(CAST_WK!==undefined)return CAST_WK;CAST_WK=null;
  try{if(typeof Worker==='undefined'||typeof Blob==='undefined'||typeof URL==='undefined')return null;
    const fns=[sm01,sRad,castBump,castHash,castNoise,castInside,castNear,castWater,castCarp,castBox,castBlur,castBuild,castPixels],
      src=fns.map(fn=>'const '+fn.name+'='+String(fn)+';').join('\n')+'\nonmessage=async e=>{const{key,v,S,s,env}=e.data;try{const r='+castPixels.name+'(v,S,s,env);let url=null;'+
        'if(typeof OffscreenCanvas!=="undefined")try{const oc=new OffscreenCanvas(r.W,r.H);oc.getContext("2d").putImageData(new ImageData(r.data,r.W,r.H),0,0);'+
        'const b=await oc.convertToBlob({type:"image/webp",quality:.92});url=new FileReaderSync().readAsDataURL(b)}catch(_){url=null}'+
        'postMessage(url?{key,out:{url,x:r.x,y:r.y,w:r.w,h:r.h}}:{key,r},url?[]:[r.data.buffer])}catch(err){postMessage({key,err:String(err)})}}',
      w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
    w.onmessage=e=>{const m=e.data;if(m.err)castLocal(m.key);else castDone(m.key,m.out||castEncode(m.r))};
    w.onerror=e=>{if(e&&e.preventDefault)e.preventDefault();CAST_WK=null;for(const k in CAST_PAR)castLocal(k)};CAST_WK=w}catch(_){CAST_WK=null}
  return CAST_WK}
function castDone(key,out){CAST_CACHE[key]=out;const p=CAST_PAR[key];delete CAST_PAR[key];if(p)p.res(out)}
function castLocal(key){const p=CAST_PAR[key];if(p)setTimeout(()=>{if(CAST_PAR[key]===p)castDone(key,castEncode(castPixels(p.v,p.S,p.s,castEnv(p.v))))},40)}
/* the image of a cast vessel at s pixels per unit: a promise, kept while it is being made */
function castRequest(v,S,s){const key=v.id+'|'+s;if(CAST_CACHE[key])return Promise.resolve(CAST_CACHE[key]);if(CAST_JOBS[key])return CAST_JOBS[key];
  CAST_JOBS[key]=new Promise(res=>{CAST_PAR[key]={v,S,s,res};const w=castWorker();if(w)w.postMessage({key,v:{id:v.id,cast:v.cast},S,s,env:castEnv(v)});else castLocal(key)});
  return CAST_JOBS[key]}
/* every image still being made */
const castPending=()=>Promise.all(Object.values(CAST_JOBS));
function castImg(im){const e=document.createElementNS(NS,'image');for(const[k,x]of[['href',im.url],['x',f(im.x)],['y',f(im.y)],['width',f(im.w)],['height',f(im.h)],['preserveAspectRatio','none']])e.setAttribute(k,x);return e}
/* the body of a cast vessel, in place of the turned bands and their textures. The first time, the turned body in plain bronze meanwhile;
   when the image comes, it takes its place, and a bouquet already swaying is cut into images again */
function castBody(g,v,S){const s=CAST_S||(LOD?2.5:6),key=v.id+'|'+s;let im=CAST_CACHE[key];if(!im&&CAST_SYNC)im=castImage(v,S,s);
  if(im){g.appendChild(castImg(im));return}
  const k=G(g,{'data-cast':v.id});vBody(k,v,S);
  castRequest(v,S,s).then(out=>{if(!k.parentNode)return;const e=castImg(out);k.replaceWith(e);const svg=e.ownerSVGElement;
    if(svg&&svg._aliveArgs&&typeof aliveBq==='function'){if(svg._alive)svg._alive.stop();aliveBq(svg,svg._aliveArgs[0],svg._aliveArgs[1])}})}
/* soon after the page opens, the cast vessels of the catalogue are made beside it, at the shop's size and the thumbnails' */
if(typeof window!=='undefined'&&typeof VZ0!=='undefined')setTimeout(()=>{for(const v of VZ0)if(v.cast&&v.prof){castRequest(v,profSamples(v.prof,90),6);castRequest(v,profSamples(v.prof,28),2.5)}},2500);
