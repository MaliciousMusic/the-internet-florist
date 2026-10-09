/* ================= y3-lobee.js : a palmately lobed leaf in volume (viburnum, currant, maple, ivy...) =================
   svLobedLeaf(par,pos,Hd,up,o): the petiole from pos (on the stem, view space, y up) along Hd, then the blade: a polar margin (lobes as bumps,
   coarse forward teeth on their outer part, a truncate base), folded in a V along each lobe's midrib, arched and drooping under its weight,
   twisted toward the viewer a little. Drawn as: petiole (one stroke; close up its glands and stipules), the blade (one path, its rim stroked:
   dark when fresh, brown when wilting), the shaded half of each lobe (one path), the main veins (one path; close up the secondary veins too).
   The face seen decides the colours (upper face darker, underside paler, its veins raised). Self-contained (y1.js helpers). */
const SVLB_DEF={lobes:[[0,1,1,1],[1,.76,.9,.5],[-1,.76,.9,.5]],lp:.6,base:.48,floor:.12,thB:2.62,tooth:[4,.055,.45],pet:.3,petW:.034,petA:.25,
  fold:.2,arch:.3,droop:.5,face:1,tilt:.45,curl:.05,acu:.22,
  up:'#4b6f31',upL:'#7aa354',upD:'#2c4520',low:'#8eab78',lowL:'#b0c69a',vein:'#a2c27e',veinLow:'#d2dfbc',pc:'#6d6a3a',pr:'#8a4a34',gland:'#7a2e22',edge:'#8a6a3e',wl:0,sd:1};
/* the margin radius (x len) at angle th; the lobe that rules there */
function svlbR(P,th,jit){let r=Math.max(P.base*Math.cos(th*.62),P.floor),k=-1;
  P.lobes.forEach((L,j)=>{const d=Math.abs(th-L[0])/L[2];if(d<1){const v=L[1]*(1+(jit[j]||0))*Math.pow(Math.cos(d*1.5708),P.lp)*(1+P.acu*L[3]*Math.exp(-d*d/.012));if(v>r){r=v;k=j}}});return[r,k]}
function svLobedLeaf(par,pos,Hd,up,o){const P=Object.assign({},SVLB_DEF,o),rg=svRng(P.sd),len=P.len,wl=P.wl||0,hi=DET>=1.5,k=G(par),fan=svSm((wl-.45)/.4),
    jit=P.lobes.map(()=>(rg()-.5)*.14),tj=[];for(let i=0;i<40;i++)tj.push(rg());
  /* frame: the blade's forward direction (Hd lowered toward the horizontal), its upper normal (up, turned toward the viewer), its left */
  Hd=V3.nz(Hd);up=V3.nz(up);const el=Math.asin(Math.max(-1,Math.min(1,V3.dot(Hd,up)))),hz=V3s(Hd,V3.sc(up,V3.dot(Hd,up))),hl=V3l(hz)>1e-3?V3.sc(hz,1/V3l(hz)):V3.nz(V3.cr(up,[0,0,1])),
    e2=el*(1-P.droop)-.3*wl-.12,X=V3.nz(V3.add(V3.sc(hl,Math.cos(e2)),V3.sc(up,Math.sin(e2))));
  let Z=V3s(up,V3.sc(X,V3.dot(up,X)));Z=V3.nz(Z);const vw=V3s([0,0,1],V3.sc(X,X[2])),Y0=V3.cr(Z,X),tl=(tj[0]-.5)*2*P.tilt;
  Z=V3.nz(V3.add(V3.add(Z,V3.sc(vw,P.face)),V3.sc(Y0,tl)));const Y=V3.nz(V3.cr(Z,X));
  /* the petiole: up and out, arching; the blade starts at its end */
  const pl=len*P.pet,p1=V3.add(pos,V3.add(V3.sc(Hd,pl*.62),V3.sc(up,pl*.08))),b0=V3.add(pos,V3.add(V3.sc(Hd,pl*.55),V3.sc(X,pl*.5))),
    S2=p=>[p[0],-p[1]],arch=P.arch+.28*wl,fold=P.fold*(1-.3*wl),curl=P.curl+.12*wl,wsh=1-.1*wl;
  /* a blade point at polar angle th, fraction rho of the margin radius r */
  const at=(th,rho,r)=>{const rr=rho*r*len,x=rr*Math.cos(th),y=rr*Math.sin(th)*wsh;let dm=9;for(const L of P.lobes)dm=Math.min(dm,Math.abs(th-L[0]));
      const z=fold*rr*Math.sin(Math.min(1.2,dm))-arch*len*Math.pow(Math.max(0,x/len),2)-arch*.55*len*Math.pow(y/len,2)-curl*len*Math.pow(rho,5)*r;
      return V3.add(b0,V3.add(V3.add(V3.sc(X,x),V3.sc(Y,y)),V3.sc(Z,z)))};
  /* the margin, with its teeth: walk the outline finely, then lay the teeth along its toothed stretches (where a lobe rules, beyond tooth[2] of its length) */
  const M=hi?150:90,ths=[],rs=[],ks=[];for(let i=0;i<=M;i++){const th=-P.thB+2*P.thB*i/M,[r,kk]=svlbR(P,th,jit);ths.push(th);rs.push(r);ks.push(kk)}
  const out=[];let i=0;while(i<=M){const kk=ks[i],L=kk>=0?P.lobes[kk]:null,tz=L&&rs[i]>L[1]*P.tooth[2];
    if(!tz){if(i%(hi?3:5)===0||i===M)out.push([ths[i],1,rs[i]]);i++;continue}
    let j=i;while(j<=M&&ks[j]===kk&&rs[j]>L[1]*P.tooth[2])j++;j--;
    const n=Math.max(1,Math.round(P.tooth[0]*2*(ths[j]-ths[i])/(L[2]*1.6))),apex=L[0];
    for(let t=0;t<n;t++){const a=ths[i]+(ths[j]-ths[i])*t/n,b=ths[i]+(ths[j]-ths[i])*(t+1)/n,fw=(a+b)/2<apex?.72:.28,tp=a+(b-a)*fw,am=P.tooth[1]*(.6+.8*tj[(t*3+kk*7)%40])*(hi?1:.85);
      out.push([a,1,svlbR(P,a,jit)[0]]);
      /* close up, each tooth's flanks bulge outward (convex, blunt-tipped teeth, photo 118), the long leading flank more */
      if(hi){const m=a+(tp-a)*.5,rm=svlbR(P,m,jit)[0];out.push([m,1+am*.7/rm,rm])}
      out.push([tp,1+am/svlbR(P,tp,jit)[0],svlbR(P,tp,jit)[0]]);
      if(hi){const m=tp+(b-tp)*.42,rm=svlbR(P,m,jit)[0];out.push([m,1+am*.56/rm,rm])}}
    i=j+1;if(i<=M)out.push([ths[j],1,rs[j]])}
  const O3=out.map(q=>at(q[0],q[1],q[2])),O2=O3.map(S2);
  /* which face shows, and how lit: the blade's normal near its middle */
  const nAt=(th,rho)=>{const r=svlbR(P,th,jit)[0],a=at(th,rho,r),b=at(th+.04,rho,r),c=at(th,Math.min(1,rho+.05),r);return V3.nz(V3.cr(V3s(c,a),V3s(b,a)))};
  const nc=nAt(0,.45),front=nc[2]>=0,I=Math.max(0,V3.dot(front?nc:V3.sc(nc,-1),LIGHT)),base=front?mix(P.upD,P.upL,.25+.7*I):mix(P.low,P.lowL,.3+.6*I);
  /* the petiole, with (close up) its pair of glands under the blade and two thread-like stipules at its foot */
  const pa=S2(pos),pm=S2(p1),pe=S2(b0),pw=Math.max(.5,len*P.petW*(1-.2*wl));
  E('path',{d:'M'+svJ([svR(pa[0]),svR(pa[1])])+'Q'+svJ([svR(pm[0]),svR(pm[1]),svR(pe[0]),svR(pe[1])]),fill:'none',stroke:mix(P.pc,P.pr,P.petA),'stroke-width':svF(pw),'stroke-linecap':'round'},k);
  if(hi){const g1=S2(V3.add(b0,V3.sc(Hd,-pl*.12))),g2=S2(V3.add(b0,V3.add(V3.sc(Hd,-pl*.2),V3.sc(Y,pw*.3))));
    let ds='';for(const s of[-1,1]){const f0=V3.add(pos,V3.sc(Hd,pl*.06)),f1=V3.add(f0,V3.add(V3.sc(Hd,pl*.16),V3.sc(Y,s*pl*.07))),a=S2(f0),b=S2(f1);ds+='M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])])}
    E('path',{d:ds,fill:'none',stroke:P.pc,'stroke-width':svF(pw*.35),'stroke-linecap':'round'},k);
    E('path',{d:svDots([g1,g2]),fill:'none',stroke:P.gland,'stroke-width':svF(pw*1.05),'stroke-linecap':'round'},k)}
  /* the blade */
  let d='M'+svJ([svR(O2[0][0]),svR(O2[0][1])]),cx=svR(O2[0][0]),cy=svR(O2[0][1]);for(let q=1;q<O2.length;q++){const x=svR(O2[q][0]),y=svR(O2[q][1]);if(x===cx&&y===cy)continue;d+='l'+svJ([x-cx,y-cy]);cx=x;cy=y}
  E('path',{d:d+'z',fill:base,stroke:fan>0?mix(P.upD,P.edge,fan):P.upD,'stroke-width':svF(Math.max(.3,len*(.006+.02*fan))),'stroke-opacity':svF(.45+.3*fan),'stroke-linejoin':'round'},k);
  /* each lobe's half turned from the light, shaded (the fold reads) */
  let dsh='';const L3=P.lobes;for(let j=0;j<L3.length;j++){const th=L3[j][0];
    for(const s of[-1,1]){const n=nAt(th+s*.3,.6),If=V3.dot(front?n:V3.sc(n,-1),LIGHT),n2=nAt(th-s*.3,.6),I2=V3.dot(front?n2:V3.sc(n2,-1),LIGHT);if(If>I2)continue;
      let lim=s>0?P.thB:-P.thB;for(let m=0;m<L3.length;m++){const t2=L3[m][0];if(m!==j&&Math.sign(t2-th)===s&&Math.abs(t2-th)<Math.abs(lim-th))lim=(th+t2)/2}
      const pts=[S2(b0)];for(const q of out)if((q[0]-th)*s>=0&&(q[0]-lim)*s<=0)pts.push(S2(at(q[0],q[1],q[2])));if(pts.length<3)continue;
      dsh+='M'+svJ([svR(pts[0][0]),svR(pts[0][1])]);let x=svR(pts[0][0]),y=svR(pts[0][1]);for(let q=1;q<pts.length;q++){const a=svR(pts[q][0]),b=svR(pts[q][1]);dsh+='l'+svJ([a-x,b-y]);x=a;y=b}dsh+='z'}}
  if(dsh)E('path',{d:dsh,fill:front?P.upD:P.up,'fill-opacity':.3},k);
  /* the veins: three main ones from the petiole's end to the lobe tips; close up, their side veins running to the teeth */
  let dv='',ds='';for(const L of L3){const r=svlbR(P,L[0],jit)[0],pts=[0,.25,.5,.72,.9].map(t=>S2(at(L[0],t,r)));dv+=svQuad(pts);
    if(hi)for(const t of[.2,.38,.56,.72])for(const s of[-1,1]){/* a side vein leaves the midrib at about 50 deg toward the lobe's tip and runs to the margin */
      const a0=t*r,ux=Math.cos(L[0]),uy=Math.sin(L[0]),dx=Math.cos(L[0]+s*.85),dy=Math.sin(L[0]+s*.85);let e=null;
      for(let m=1;m<=24;m++){const q=m/24*r*.9,px=a0*ux+dx*q,py=a0*uy+dy*q,th=Math.atan2(py,px),rr=Math.hypot(px,py),rm=svlbR(P,th,jit)[0];if(rr>rm*.86||Math.abs(th)>P.thB)break;e=[th,rr/rm,rm]}
      /* arched forward a little (118: the side veins bow toward the lobe tip), thin and faint */
      if(e){const sx=a0*ux,sy=a0*uy,ex=Math.cos(e[0])*e[1]*e[2],ey=Math.sin(e[0])*e[1]*e[2],gl=Math.hypot(ex-sx,ey-sy),mx=(sx+ex)/2+ux*gl*.13,my=(sy+ey)/2+uy*gl*.13,
          mt=Math.atan2(my,mx),mr=svlbR(P,mt,jit)[0];ds+=svQuad([S2(at(L[0],t,r)),S2(at(mt,Math.hypot(mx,my)/mr,mr)),S2(at(e[0],e[1],e[2]))])}}}
  E('path',{d:dv,fill:'none',stroke:front?P.vein:P.veinLow,'stroke-width':svF(Math.max(.3,len*.0095)),'stroke-opacity':front?.48:.7,'stroke-linecap':'round'},k);
  if(ds)E('path',{d:ds,fill:'none',stroke:front?P.vein:P.veinLow,'stroke-width':svF(Math.max(.2,len*.0055)),'stroke-opacity':front?.34:.5,'stroke-linecap':'round'},k);
  return k}
