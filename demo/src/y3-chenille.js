/* ---------- chenille: a thick, soft cord made of thousands of tiny flowers packed in glomerules (tight clusters bristling with the awns of their
   bracts): the hanging amaranth's tails, later the plumes and spikes of celosia and the erect amaranths. Generic kit piece (svChen…).
   It is painted as ONE lit cylinder with a fine continuous grain, never a string of beads (porteur, 2026-10-17: "chapelet de perles" refused):
     0. its cast shadow on the cords painted before it (clipped to them: never on the wall);
     1. a woolly outline (soft swellings of the thickness, small clusters on the rim, a fine scallop of glomerules) in the shade colour;
     2. the glomerules: hundreds to thousands of small grains laid round the cylinder (rows of a spiral, foreshortened toward the rims), each lit by
        Lambert on the cylinder plus the small clusters they make (a woolly relief, darker in the crevices), the rims first, the middle last;
        the lit ones get a little cap: a ridge of light on the lit side, the own shadow below, never a band;
     2b. the down: the bracts' awns on the outline (pale toward the light) and their tips over the lit grains.
   Every chance here is a hash of the cord's seed (never rnd), so a bouquet's chance is never touched. The shop's light comes from the top left. ---------- */
const SVCHEN_L=[-.55,-.835];
let SVCHEN_ID=0;
function svChenH(i,j){const x=Math.sin(i*127.1+j*311.7+.37)*43758.5453;return x-Math.floor(x)}
/* a polyline resampled by arc length (n+1 points), with smoothed tangents and normals (screen space, y down) */
function svChenRs(S,n){const cum=[0];for(let i=1;i<S.length;i++)cum.push(cum[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));const L=cum[cum.length-1]||1e-6,P=[];let j=1;
  for(let i=0;i<=n;i++){const l=i/n*L;while(j<S.length-1&&cum[j]<l)j++;const t=Math.max(0,Math.min(1,(l-cum[j-1])/((cum[j]-cum[j-1])||1)));P.push([S[j-1][0]+(S[j][0]-S[j-1][0])*t,S[j-1][1]+(S[j][1]-S[j-1][1])*t])}
  const T=P.map((p,i)=>{const a=P[Math.max(0,i-2)],b=P[Math.min(n,i+2)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]});
  return{P,T,N:T.map(t=>[-t[1],t[0]]),L}}
/* one grain: a smooth irregular oval at (cx,cy), radius ra along (tx,ty) and rb across, quadratic curves through midpoints (never facets) */
function svChenGr(cx,cy,tx,ty,ra,rb,m,h1,h2){const Q=[];for(let j=0;j<m;j++){const a=(j/m+svChenH(h1,j*1.7+h2)*.09)*6.2832,rr=.74+.32*svChenH(h1+j,h2*.31+2.1),c=Math.cos(a)*ra*rr,s=Math.sin(a)*rb*rr;
    Q.push([cx+tx*c-ty*s,cy+ty*c+tx*s])}
  const M=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],m0=M(Q[m-1],Q[0]);let d='M'+f(m0[0])+','+f(m0[1]);
  for(let j=0;j<m;j++){const p=Q[j],q=M(Q[j],Q[(j+1)%m]);d+='Q'+f(p[0])+','+f(p[1])+' '+f(q[0])+','+f(q[1])}return d+'Z'}
/* the palette of a chenille from three measured tones: shade, body, light; d1 between shade and body, l2 the pale tips of the bracts */
function svChenPal(o,m,l,tip){return{d2:o,d1:mix(o,m,.5),b:m,l1:l,l2:tip||mix(l,'#ffe8ee',.32)}}
/* svChenCord(par,S,rf,cols,o): paints one cord.
   S: its centreline on screen (y down), from its attachment to its tip; rf(u): its radius at u (0 at the top, 1 at the tip); rf.K (svChenBalls): knots of balls;
   cols: a palette {d2,d1,b,l1,l2} or a function u -> palette (a colour that changes along the cord: tips of another colour, a young green base);
   o: seed, gk (grain radius x r, .17), lump (0..1, the woolly relief), pg (pompon size gradient along the cord, 0 none), pv (pompon size spread, .3), fr (down length), dry (0..1: the dried cord, flatter and matte), bins (colour bands
      along the cord when cols is a function), hi (light strength), grain (0..1: the awns), cap (0 round top, 1 top hidden at an axil),
      under (an array shared by the cords of one plant or drape: the outlines painted before, which receive this cord's cast shadow; this one is added) */
function svChenCord(par,S,rf,cols,o={}){if(!S||S.length<2)return null;const det=DET>=1.5,sd=(o.seed||1)%9973,dry=o.dry||0,fr=(o.fr??1)*(1+.5*dry),hi=(o.hi??1)*(1-.45*dry),gr=o.grain??1,k=o.g||G(par);
  let L0=0;for(let i=1;i<S.length;i++)L0+=Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]);if(L0<.5)return k;
  const rm=Math.max(.3,rf(.15)),n=Math.max(12,Math.min(1400,Math.round(L0/Math.max(.3,rm*.2)))),F=svChenRs(S,n),P=F.P,T=F.T,N=F.N,L=F.L,ds=L/n,KB=rf.K||null;
  const Rr=[];for(let i=0;i<=n;i++)Rr.push(Math.max(.25,rf(i/n)));
  const lit=N.map(q=>q[0]*SVCHEN_L[0]+q[1]*SVCHEN_L[1]);
  const fnc=typeof cols==='function',nb=fnc?Math.max(1,o.bins||4):1,pc={},palAt=u=>{if(!fnc)return cols;const b=Math.min(nb-1,Math.floor(u*nb));return pc[b]||(pc[b]=cols((b+.5)/nb))},binOf=u=>fnc?Math.min(nb-1,Math.floor(u*nb)):0;
  /* the grain: about constant along the cord (the glomerules do not shrink toward the tip, the cord gets fewer of them across: the grain goes on to the end) */
  const gk=o.gk??.085,gmin=det?.38:.5,gOf=r=>Math.max(gmin,gk*rm*(.72+.28*Math.min(1.4,r/rm)));
  /* 1. the thickness: soft slow swellings, each side its own (060: the cord is never a regular tube) */
  const ph=[0,1,2,3].map(j=>svChenH(sd,j*3.7+.9)*6.2832),wv=(a,s)=>1+.12*Math.sin(a/(rm*3.4)+ph[s>0?0:1])+.07*Math.sin(a/(rm*1.55)+ph[s>0?2:3]);
  const Ep=new Float64Array(n+1),Em=new Float64Array(n+1);for(let i=0;i<=n;i++){const a=i*ds;Ep[i]=Rr[i]*wv(a,1);Em[i]=Rr[i]*wv(a,-1)}
  /* the glomerules (t060, t023): round pompons packed over the visible half of the cylinder in staggered rows; each is lit as a small sphere (light at the
     top left), the crevices between them dark; those on a rim swell the outline into round lobes. Knotted cords (rf.K): the balls are larger spheres */
  const lm=(o.lump??1)*(1-.55*dry),pg=o.pg||0,pv=o.pv??.3,PM=[];let rhoM=0;/* pg: pompons larger near the top, finer toward the tip; pv: their spread in size */
  {let a=-rm*.1,row=0;while(a<L+rm*.2&&row<6000){const u=Math.max(0,Math.min(1,a/L)),r=Math.max(.25,rf(u)),rho=Math.max(gOf(r)*2.4,r*(.48+.2*svChenH(sd+row,32.9))*(1+pg*(.3-u))),m=Math.max(2,Math.round(Math.PI*r/(1.7*rho)));
      for(let j=0;j<m;j++){const ph=-1.5708+((j+.5+(row%2?.45:0)+(svChenH(sd+row,j+37.3)-.5)*.35)/m)*3.1416;if(Math.abs(ph)>1.62)continue;const rr=rho*(1-pv*.5+pv*svChenH(sd+row,j+39.9));
        PM.push({a:a+(svChenH(sd+row,j+38.7)-.5)*rho*.5,v:Math.max(-1,Math.min(1,Math.sin(ph))),cp:Math.cos(ph),rho:rr,h:(.65+.35*svChenH(sd+row,j+34.1))*lm});rhoM=Math.max(rhoM,rr)}
      a+=rho*(1.15+.6*svChenH(sd+row,41.3));row++}}
  PM.sort((p,q)=>p.a-q.a);const BL=KB?KB.map(b=>({a:b.u*L,v:b.v,rho:b.rr*rm,h:1})).sort((p,q)=>p.a-q.a):null;let rbM=0;if(BL)for(const b of BL)rbM=Math.max(rbM,b.rho);
  if(KB){/* knotted cords: the outline is the union of the balls on a thin cord (t075) */
    for(let i=0;i<=n;i++){Ep[i]=Em[i]=Rr[i]*.3}
    for(const b of KB){const c=b.u*L,h=b.hu*L,rr=b.rr*rm,i0=Math.max(0,Math.floor((c-rr)/ds)),i1=Math.min(n,Math.ceil((c+rr)/ds));for(let i=i0;i<=i1;i++){const d=i*ds-c;if(Math.abs(d)>=rr)continue;const s=Math.sqrt(rr*rr-d*d)*(.9+.1*h/rr);
      Ep[i]=Math.max(Ep[i],b.v*rm*.55+s);Em[i]=Math.max(Em[i],-b.v*rm*.55+s)}}}
  {const Kp=new Float64Array(n+1),Km=new Float64Array(n+1);
    for(const m of PM){const rim=sm01((Math.abs(m.v)-.5)/.4);if(rim<=0)continue;const i0=Math.max(0,Math.floor((m.a-m.rho)/ds)),i1=Math.min(n,Math.ceil((m.a+m.rho)/ds)),K=m.v>=0?Kp:Km;
      for(let i=i0;i<=i1;i++){const d=(i*ds-m.a)/m.rho,b=Math.sqrt(Math.max(0,1-d*d))*m.rho*.78*m.h*rim;if(b>K[i])K[i]=b}}
    for(let i=0;i<=n;i++){Ep[i]+=Kp[i]-Rr[i]*.08;Em[i]+=Km[i]-Rr[i]*.08}}
  /* the screen centres of the pompons and balls, once the outline is known */
  const ctr=q=>{const i=Math.max(0,Math.min(n,Math.round(q.a/ds))),E0=(q.v>=0?Ep:Em)[i],off=Math.sign(q.v)*Math.abs(q.v)*Math.max(0,E0-q.rho*.3*Math.abs(q.v));q.cx=P[i][0]+N[i][0]*off;q.cy=P[i][1]+N[i][1]*off};
  for(const q of PM)ctr(q);if(BL)for(const b of BL){const i=Math.max(0,Math.min(n,Math.round(b.a/ds))),off=b.v*rm*.55;b.cx=P[i][0]+N[i][0]*off;b.cy=P[i][1]+N[i][1]*off}
  /* the rim's fine scallop: one grain after the other */
  const sc=(a,s,g)=>g*(.22*Math.abs(Math.sin(a/g*.9+ph[s>0?0:2]))+.16*Math.abs(Math.sin(a/g*1.63+ph[s>0?1:3])));
  const edge=(i,s,x)=>{const E=(s>0?Ep:Em)[i]*(x??1)+(x==null?sc(i*ds,s,gOf(Rr[i])):0);return[P[i][0]+N[i][0]*E*s,P[i][1]+N[i][1]*E*s]};
  const pts=a=>a.map(p=>f(p[0])+','+f(p[1])).join('L');
  const outline=(i0,i1,dx,dy)=>{const A=[],B=[];for(let i=i0;i<=i1;i++){const p=edge(i,1),q=edge(i,-1);A.push([p[0]+dx,p[1]+dy]);B.push([q[0]+dx,q[1]+dy])}B.reverse();
    const e=P[i1],t=T[i1],r=Math.max(Ep[i1],Em[i1]),s0=P[i0],t0=T[i0],r0=Math.max(Ep[i0],Em[i0]),tipP=i1===n?[e[0]+t[0]*r*.95+dx,e[1]+t[1]*r*.95+dy]:null,top=i0===0&&!o.cap?[s0[0]-t0[0]*r0*.4+dx,s0[1]-t0[1]*r0*.4+dy]:null;
    return'M'+pts(A)+(tipP?'Q'+f(tipP[0])+','+f(tipP[1])+' ':'L')+pts(B)+(top?'Q'+f(top[0])+','+f(top[1])+' '+f(A[0][0])+','+f(A[0][1]):'')+'Z'};
  /* 0. the cast shadow on the cords painted before (light from the top left: it falls down and to the right), crisp, clipped to them */
  if(o.under&&o.under.length&&(o.cast??1)>0){const id='svch'+(++SVCHEN_ID),cp=E('clipPath',{id},k);E('path',{d:o.under.join(''),'clip-rule':'nonzero'},cp);
    const p0=palAt(.3),dx=rm*.55,dy=rm*.85;E('path',{d:outline(0,n,dx,dy),fill:mix(p0.d2,'#140608',.45),opacity:f((o.cast??1)*(.34-.12*dry)*100)/100,'clip-path':`url(#${id})`},k)}
  for(let b=0;b<nb;b++){const i0=Math.max(0,Math.floor(b/nb*n)-(b?1:0)),i1=Math.min(n,Math.ceil((b+1)/nb*n));E('path',{d:outline(i0,i1,0,0),fill:shd(palAt((b+.5)/nb).d2,-.18)},k)}
  if(o.under)o.under.push(outline(0,n,0,0));
  /* 2. the grains, scattered at random over the cylinder (no rows); Lambert on the cylinder (light 3D [-.4,-.6,.69]) plus the relief of the cluster each grain
        belongs to (the nearest: lit on its side toward the light, shaded on the other), the crevices between clusters darker */
  const GR=[];let lo=0;{let a=0,row=0;const cap=det?120000:40000,cov=o.cov??1.7;
    while(a<L&&GR.length<cap){const i=Math.min(n,Math.round(a/ds)),r=Math.max(Ep[i],Em[i],.3),g=gOf(Rr[i]),st=g*.9,m=Math.max(1,Math.round(cov*Math.PI*r*st/(Math.PI*g*g*.9)));
      for(let j=0;j<m;j++){const h1=svChenH(sd+row,j*1.37+.3),h2=svChenH(sd+j,row*.71+5.3),h3=svChenH(row+sd*.37,j+9.1),
          phi=-1.5708+(.02+.96*h1)*3.1416,v=Math.sin(phi),cp=Math.cos(phi),aa=a+h2*st,ii=Math.max(0,Math.min(n,Math.round(aa/ds))),Ev=(v>=0?Ep:Em)[ii];
        const xf=Math.max(0,Math.min(n,aa/ds)),i0=Math.min(n-1,Math.floor(xf)),tf=xf-i0,ip=(A,c)=>A[i0][c]+(A[i0+1][c]-A[i0][c])*tf,Ef=((v>=0?Ep:Em)[i0]*(1-tf)+(v>=0?Ep:Em)[i0+1]*tf),
          rad=Math.abs(v)*(Ef-g*.5*Math.abs(v))+g*sm01((Math.abs(v)-.86)/.12)*(h2*1.3-.35)*(1-.5*dry),sg0=Math.sign(v),x=ip(P,0)+ip(N,0)*sg0*rad,y=ip(P,1)+ip(N,1)*sg0*rad;
        let lam=(v*lit[ii]*.62+cp*.55-.04)*.6,dn=9,ex=0,ey=0,hh=0;
        while(lo<PM.length&&PM[lo].a<aa-2.2*rhoM)lo++;
        for(let t=lo;t<PM.length&&PM[t].a<aa+2.2*rhoM;t++){const q=PM[t];if(Math.abs(q.a-aa)>1.7*q.rho)continue;const dx=(x-q.cx)/q.rho,dy=(y-q.cy)/q.rho,d=Math.hypot(dx,dy)-.12*q.cp;if(d<dn){dn=d;ex=dx;ey=dy;hh=q.h}}
        {const dd=Math.min(1,Math.max(0,dn)),nz=Math.sqrt(1-dd*dd),cr=sm01((dn-.7)/.32);lam+=((ex*SVCHEN_L[0]+ey*SVCHEN_L[1])*.7+nz*.35-.25)*(1-cr)*hh-.55*cr*Math.max(hh,.3*lm)}
        if(BL){let bn=9,bx=0,by=0;for(const b of BL){if(Math.abs(b.a-aa)>1.3*b.rho)continue;const dx=(x-b.cx)/b.rho,dy=(y-b.cy)/b.rho,d=Math.hypot(dx,dy);if(d<bn){bn=d;bx=dx;by=dy}}
          if(bn<9){const dd=Math.min(1,bn),nz=Math.sqrt(1-dd*dd);lam+=((bx*SVCHEN_L[0]+by*SVCHEN_L[1])*.55+nz*.3-.22)-.4*sm01((bn-.8)/.25)}}
        lam+=(h3-.5)*.07;lam-=.14*sm01((Math.abs(v)-.84)/.16);lam=lam*(1-.3*dry)+.08*dry;
        const tone=lam<0?0:lam<.3?1:lam<.55?2:lam<.75?3:4,tier=cp<.5?0:cp<.82?1:2;
        GR.push({x,y,tx:T[ii][0],ty:T[ii][1],ra:g*(.75+.5*h3),rb:g*(.5+.5*cp)*(.75+.5*h2),tone,tier,b:binOf(Math.min(1,aa/L)),h:h1,j:row*31+j})}
      a+=st;row++}}
  /* the grains painted rims first, the middle last; in each depth the darker first, then the caps of the lit ones (their roundness) */
  const TONE=p=>[mix(p.d2,p.d1,.35),p.d1,p.b,mix(p.b,p.l1,.5),p.l1],CAP=p=>[null,null,mix(p.b,p.l1,.5),p.l1,mix(p.l1,p.l2,.5)],ms=det?8:6;
  for(let tier=0;tier<3;tier++){const A={};for(const q of GR){if(q.tier!==tier)continue;const kk=q.b*10+q.tone;A[kk]=(A[kk]||'')+svChenGr(q.x,q.y,q.tx,q.ty,q.ra,q.rb,ms,sd+q.j,q.j*.13);
      if(q.tone>=3&&hi>0&&q.h>.25){const c2=q.b*10+5+q.tone,s=q.ra*.28;A[c2]=(A[c2]||'')+svChenGr(q.x+SVCHEN_L[0]*s,q.y+SVCHEN_L[1]*s,q.tx,q.ty,q.ra*.42,q.rb*.42,5,sd+q.j+7,q.j*.29)}}
    for(let b=0;b<nb;b++){const p=palAt((b+.5)/nb),TC=TONE(p),CC=CAP(p);for(let t=0;t<5;t++)if(A[b*10+t])E('path',{d:A[b*10+t],fill:TC[t]},k);
      for(let t=2;t<5;t++)if(A[b*10+5+t])E('path',{d:A[b*10+5+t],fill:CC[t],opacity:f((t===4?.6:.7)*hi*100)/100},k)}}
  /* 2b. the down: the awns on the outline, leaning toward the tip, uneven, pale toward the light; their tips over the lit grains */
  if(gr>0){const bw=Math.max(det?.2:.28,rm*.045),Dn={},put=(kk,d)=>{Dn[kk]=(Dn[kk]||'')+d};
    for(const s of[1,-1])for(let i=0;i<=n;i++){const g=gOf(Rr[i]),st=Math.max(1,Math.round(g*.3/ds));if(i%st)continue;const h=svChenH(sd+i,s>0?5.1:6.7);if(h<.15)continue;
      const p=edge(i,s),q=lit[i]*s,ja=(svChenH(i,sd+s*2.2)-.5)*1.3,dx0=N[i][0]*s*.85+T[i][0]*.5,dy0=N[i][1]*s*.85+T[i][1]*.5,c=Math.cos(ja),sn=Math.sin(ja),ln=fr*g*(.6+1.4*svChenH(i+sd,s+4.4)),
        dx=dx0*c-dy0*sn,dy=dx0*sn+dy0*c,bk=binOf(i/n)+(q>.15?'t':q>-.25?'m':'u');put(bk,'M'+f(p[0]-dx*g*.3)+','+f(p[1]-dy*g*.3)+'l'+f(dx*ln)+','+f(dy*ln))}
    for(const q of GR){if(q.tier===0&&q.tone<2)continue;const nn=q.tone>=3?2:1;for(let t=0;t<nn;t++){const a=svChenH(q.j+t,sd+3.3)*6.2832,ln=q.ra*(.45+.4*svChenH(q.j,t+sd)),ox=(svChenH(q.j,t+1.1)-.5)*q.ra,oy=(svChenH(q.j,t+2.2)-.5)*q.ra;
        put(q.b+(q.tone>=4?'t':q.tone>=2?'m':'u'),'M'+f(q.x+ox)+','+f(q.y+oy)+'l'+f(Math.cos(a)*ln)+','+f(Math.sin(a)*ln))}}
    for(let b=0;b<nb;b++){const p=palAt((b+.5)/nb),st=(kk,c,op)=>{if(Dn[b+kk])E('path',{d:Dn[b+kk],fill:'none',stroke:c,'stroke-width':f(bw*100)/100,'stroke-opacity':f(op*gr*100)/100,'stroke-linecap':'round'},k)};
      st('u',p.b,.55);st('m',p.l1,.55);st('t',p.l2,(det?.75:.62)-.2*dry)}}
  /* 2c. knotted cords (t075): every ball bristles with fine bracts, radial on its sphere, bright on the lit side, dark in its shadow; the outer ones fringe it */
  if(BL&&gr>0){const Bn={},Ld=V3.nz([SVCHEN_L[0]*.8,SVCHEN_L[1]*.8,.6]),bw2=Math.max(det?.16:.24,rm*.028);
    for(let j=0;j<BL.length;j++){const b=BL[j],R0=b.rho,nb2=Math.round((det?1:.55)*Math.min(320,10+R0*R0*1.1)),bb=binOf(Math.min(1,b.a/L));
      for(let t=0;t<nb2;t++){const a=svChenH(j*7.1+t,sd+.71)*6.2832,rho=Math.pow(svChenH(t*1.3+j,sd+2.9),.42)*.99,x=Math.cos(a)*rho,y=Math.sin(a)*rho,z=Math.sqrt(Math.max(0,1-rho*rho)),
          lam=x*Ld[0]+y*Ld[1]+z*Ld[2]+(svChenH(t,j+sd)-.5)*.3,tw=(svChenH(t+5,j*3+sd)-.5)*.8,ct=Math.cos(tw),sn=Math.sin(tw),dx=x*ct-y*sn,dy=x*sn+y*ct,
          ln=R0*(.12+.16*svChenH(t+9,j+sd))*(.35+.65*rho),x0=b.cx+x*R0*.86,y0=b.cy+y*R0*.86,tn=lam>.62?'t':lam>.3?'l':lam>-.05?'m':'u';
        Bn[bb+tn]=(Bn[bb+tn]||'')+'M'+f(x0)+','+f(y0)+'l'+f(dx*ln)+','+f(dy*ln)}}
    for(let q=0;q<nb;q++){const p=palAt((q+.5)/nb);for(const[tn,c,op]of[['u',p.d2,.7],['m',p.b,.65],['l',p.l1,.7],['t',p.l2,.8-.25*dry]])if(Bn[q+tn])E('path',{d:Bn[q+tn],fill:'none',stroke:c,'stroke-width':f(bw2*100)/100,'stroke-opacity':f(op*gr*100)/100,'stroke-linecap':'round'},k)}}
  return k}
/* a cord of balls (Amaranthus caudatus var. gibbosus, "Dreadlocks", "Pony Tails", t075): knots of 1 to 3 round balls along a thin cord, a gap between knots;
   rf0 the plain radius, r0 its top radius, L the cord's length, bk the strength (0..1), sp the knots' spacing x r0, seed; the result carries .K for svChenCord */
function svChenBalls(rf0,r0,L,bk,sp,seed){const K=[],kn=[];let a=r0*.6,j=0;while(a<L&&j<400){const u=Math.min(1,a/L),r=Math.max(rf0(u),r0*(.3+.25*bk)*(1-.4*u)),s=Math.max(.6*r0,r*(sp||2.1)*(.8+.4*svChenH(seed+j,7.7))),nb=Math.min(4,1+Math.floor(svChenH(seed+j,9.3)*(1+2.4*bk)*(1-u*.5)));
    kn.push([a,s*.5]);for(let t=0;t<nb;t++){const rr=(r/r0)*(nb>1?.82+.18*bk:1.02+.22*bk)*(.8+.4*svChenH(seed+j,t+10.1))*bk+(1-bk)*r/r0,v=nb===1?(svChenH(seed+j,11.4)-.5)*.6:(t/(nb-1)-.5)*(1.3+.3*bk)+(svChenH(seed+j,t+12.2)-.5)*.4;
      K.push({u:(a+(svChenH(seed+j,t+13.3)-.5)*s*.3)/L,hu:rr*r0*.95/L,v,rr})}a+=s;j++}
  const fn=u=>{const x=u*L,r=rf0(u);let v=1-bk*.62;for(const[c,h]of kn){const d=(x-c)/h;if(Math.abs(d)<1.15)v=Math.max(v,(1-bk*.62)+bk*.62*Math.sqrt(Math.max(0,1-d*d)))}return r*v};fn.K=K;return fn}
/* svChenHang(p0,d0,L,o): the centreline of a hanging cord in 3D (y up), from its attachment: it leaves along d0, rises a little (o.rise, rad, at least),
   arches over and falls under its weight (o.lam x L: the length of the arch), with a soft S sideways (o.sway x L) and back under its attachment (o.back x L),
   a light curl at the tip (o.curl x L). Pure hash of o.seed. */
function svChenHang(p0,d0,L,o={}){const n=o.n||44,sd=o.seed||1,dz=V3.nz(d0),hl=Math.hypot(dz[0],dz[2]),h=hl>1e-3?[dz[0]/hl,0,dz[2]/hl]:[o.side||1,0,0],b=[-h[2],0,h[0]],
    e=Math.max(Math.asin(Math.max(-1,Math.min(1,dz[1]))),o.rise??.3),T0=Math.tan((Math.PI/2+e)/2),lam=L*(o.lam??.11),sw=(o.sway??.045)*L*(svChenH(sd,.7)<.5?-1:1),
    fq=.75+.5*svChenH(sd,1.9),ph=svChenH(sd,2.3)*6.2832,bk=(o.back??.06)*L,cu=(o.curl??0)*L,pts=[p0];let p=p0;
  for(let i=1;i<=n;i++){const s=(i-.5)/n*L,th=2*Math.atan(T0*Math.exp(-s/lam)),d=[h[0]*Math.sin(th),-Math.cos(th),h[2]*Math.sin(th)];p=V3.add(p,V3.sc(d,L/n));
    const q=i/n,w=sm01(q/.3);pts.push(V3.add(p,V3.add(V3.sc(b,sw*(Math.sin(q*fq*6.2832+ph)-Math.sin(ph))*w),V3.sc(h,-bk*sm01((q-.2)/.8)+cu*sm01((q-.78)/.22)))))}
  return pts}
/* svChenPanicle(p0,up,side,Lp,o): a young erect panicle (058): an axis with m ascending side spikes, longest at the foot (pyramidal), in a spiral;
   o.s0,o.s1: where the spikes start and end along the axis, o.bl, o.bt: their length x Lp and its fall toward the top, o.al: their angle (rad), o.up: their curl up;
   o.nod (0..1) bends the axis' upper half over toward side (and the spikes with it) as the inflorescence grows heavy. Returns {ax, br:[{P,t,l}]} (3D, y up). */
function svChenPanicle(p0,up,side,Lp,o={}){const sd=o.seed||1,nod=o.nod||0,n=24,U=V3.nz(up),S0=V3.nz(V3.add(side,V3.sc(U,-V3.dot(side,U)))),S2=V3.cr(U,S0),m=o.m||(6+Math.floor(svChenH(sd,4.1)*3));
  const ax=[p0];let p=p0,d=U;const fr=[];for(let i=1;i<=n;i++){const q=(i-.5)/n,th=(o.lean??.1)*q+nod*2*Math.pow(sm01((q-.3)/.7),1.3);d=V3.nz(V3.add(V3.sc(U,Math.cos(th)),V3.sc(S0,Math.sin(th))));p=V3.add(p,V3.sc(d,Lp/n));ax.push(p);fr.push(d)}
  const br=[];for(let j=0;j<m;j++){const t=m>1?j/(m-1):0,s=Math.min(.93,((o.s0??.06)+((o.s1??.68)-(o.s0??.06))*t)*(.96+.08*svChenH(sd+j,5.2))),i=Math.max(1,Math.round(s*n)),q0=ax[i],A=fr[Math.min(n-1,i)],
      l=Lp*(o.bl??.44)*(1-(o.bt??.62)*t)*(.8+.4*svChenH(sd+j,6.3)),az=j*2.39996+svChenH(sd,j+7.4)*.7,R0=V3.nz(V3.add(V3.sc(S0,Math.cos(az)),V3.sc(S2,Math.sin(az)))),al=(o.al??.5)+.28*svChenH(sd+j,8.5),P=[q0];let pp=q0;
    for(let k2=1;k2<=10;k2++){const q=k2/10,a2=al+(nod*.9-(o.up??.18))*q,dd=V3.nz(V3.add(V3.sc(A,Math.cos(a2)),V3.sc(R0,Math.sin(a2))));pp=V3.add(pp,V3.sc(dd,l/10));P.push(pp)}
    br.push({P,t,l,s})}
  return{ax,br}}
