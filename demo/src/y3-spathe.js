/* ================= y3-spathe.js — kit piece: spathe and spadix (Araceae: anthurium, obake, calla) =================
   One spathe (a single svSheet: its upper face is the front) at the tip of the stem, one spadix and a stub of stem (drawn pieces, each with a proxy
   sheet for the order), all drawn together by svDraw. Head frame B: B[2] = the stem's tangent at its tip; the sinus (where the stem joins the back of
   the spathe) sits at O. The blade's normal leans from the stem's tangent by `tilt` toward the world's up, so the open spathe hangs forward and faces
   up, at 40 to 50 degrees to the stem; the bud continues the stem, rolled round its spadix.
   A sort gives only what differs from SVSPD_DEF (y-anthurium.js). Names: svSpd… / SVSPD_… only. */

/* half outline (sinus -> lobe -> flank -> tip), in spathe lengths: the heart of Anthurium andraeanum (lot 1 shape, checked on photos 2, 19, 62) */
const SVSPD_HEART=[[0,0],[.05,-.05],[.13,-.11],[.23,-.145],[.33,-.135],[.41,-.08],[.455,0],[.465,.1],[.445,.22],[.41,.36],[.35,.5],[.27,.635],[.185,.76],[.105,.865],[.045,.945],[0,1]];
/* a cornet's outline (calla: no lobes, a narrow rolled foot, a broad throat, a pointed lip) and a lance (obake: narrow, long tip), for the next sorts */
const SVSPD_CORNET=[[0,0],[.08,.02],[.17,.1],[.27,.22],[.36,.36],[.42,.5],[.43,.62],[.39,.74],[.3,.84],[.18,.92],[.07,.975],[0,1]];
const SVSPD_LANCE=[[0,0],[.04,-.03],[.1,-.06],[.17,-.07],[.24,-.04],[.29,.04],[.31,.16],[.3,.3],[.27,.45],[.22,.6],[.16,.73],[.1,.84],[.045,.93],[0,1]];

const SVSPD_DEF={
  pts:SVSPD_HEART,w:1,lb:1,tp:1,         /* outline, its width, lobe depth (y<0 part), tip (<1 sharper: the top fifth narrowed) */
  len:1,budL:.64,growR:[0,.75],                          /* spathe length x D ; the bud's length x the open one */
  open:[.12,.6],openT:null,green:[.02,.09],greenC:'#6e9a4a',  /* opening (op) ; the young bud's green, until */
  tilt:[1.5,.45],droop:.5,                /* angle (rad) between the stem's tangent and the blade's normal: bud, open ; lost at full fané (the spathe hangs) */
  roll:[[0,.9],[.5,.62],[1,.5]],rollO:[[0,0],[1,0]],  /* rolled: share of a half-turn of the widest half, along v (closed, open) ; cornet: rollO > 0 */
  ovl:.07,                                /* one half rolls outside the other (convolute) */
  cup:[[0,.3],[.3,.06],[.55,-.1],[.8,-.16],[1,-.12]],       /* across: + the margins rise to the front (the hollow round the spadix), - the blade is domed */
  camb:.46,lobUp:.08,hem:.02,             /* the midrib arches back (tip behind) ; the lobes lift to the front ; the margin rolls under (x L) */
  tipUp:0,bow:0,                          /* the tip turns up to the front again (S-arch, x L) ; posed head: the neck bows at full fané (rad, toward the face) */
  fanCamb:.16,fanHem:.05,fanCup:-.08,fanL:.08,wav:.03,  /* fané: more arch, more hem, flatter, shorter, rippled margin */
  dec:[.12,.4],fan:[.35,.5],              /* decline and fané from wl */
  veinF:[.17,.34,.51,.68,.85],            /* the arching laterals: share of the way from the midrib to the margin */
  quilt:[9,1],glint:.6,                   /* blisters between the veins (rows along a strip, strength) and their lacquer glints */
  spd:{len:.6,bud:.85,r0:.036,r1:.026,el:[.75,1.15],az:[-1.1,1.1],curve:[-.05,.45],grain:[60,130],sh:.5},
  neck:{len:.4,w:.085},                   /* the stub of stem drawn with the head (x L) */
  nu:[12,18],nv:[16,22],
  light:{wrap:.22,amb:.3,dif:.66,sky:.12,ks:.62,gloss:16,trans:.03,dark:[.95,.87,.79,.71,.63],da:.15,lit:[1.1,1.24,1.4],la:.22,darkLo:[.9,.78,.66],daLo:.2,litLo:[1.14,1.34],laLo:.22,soft:.04},
  genes:{size:[.92,1.08],as:[-.06,.06],bend:[-.035,.035],tw:[-.14,.14],psi:[-.35,.35],tilt:[-.2,.2],camb:[-.04,.05],cup:[-.03,.03],lb:[.85,1.2],tp:[.85,1.15],
    quilt:[.75,1.25],el:[0,1],az:[0,1],curve:[0,1],ph:[0,6.28],sd:[0,1e6]}
};
/* the spec merged on the defaults (cached on the spec: do not change a spec after its first head) */
function svSpdSpec(S){if(S&&S._m)return S._m;const D=SVSPD_DEF,m=Object.assign({},D,S||{});m.spd=Object.assign({},D.spd,(S||{}).spd);m.light=Object.assign({},D.light,(S||{}).light);
  m.neck=Object.assign({},D.neck,(S||{}).neck);m.genes=Object.assign({},D.genes,(S||{}).genes);if(S)S._m=m;return m}
/* genes from the head's own seed (never the bouquet's chance): table {key:[a,b]}, drawn in key order */
function svSpdGenes(seed,T){const r=svRng(seed>>>0),g={};for(const k in T){const[a,b]=T[k];g[k]=a+(b-a)*r()}return g}
/* a table [[v,value]...] at v (linear) */
function svSpdTab(T,v){if(!T.length)return 0;if(v<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(v<=T[i][0]){const[a,x]=T[i-1],[b,y]=T[i];return x+(y-x)*(v-a)/((b-a)||1)}return T[T.length-1][1]}
/* one half outline, resampled by arc length: {at(t)->[x,y], wmax} ; s = side (-1 left, 1 right) */
/* S.hw (a cornet, calla): the half width as a table [[y,hw]...] instead of points: v is then y itself, the foot (y=0) as wide as the roll round the stem */
function svSpdOutline(S,g,s){const w=S.w*(g.w??1)*(1+s*(g.as||0)),lb=S.lb*(g.lb??1),tp=S.tp*(g.tp??1);
  if(S.hw){const hx=y=>svSpdTab(S.hw,y)*w*(y>.7?1-(1-tp)*svSm((y-.7)/.3):1);let wm=0;for(let i=0;i<=40;i++)wm=Math.max(wm,hx(i/40));
    return{wmax:wm,at:t=>{const y=Math.max(0,Math.min(1,t));return[hx(y),y]}}}
  const P=S.pts.map(([x,y])=>[x*w*(y>.7?1-(1-tp)*svSm((y-.7)/.3):1),y<0?y*lb:y]),n=P.length,Q=[],K=6;
  for(let i=0;i<n-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(n-1,i+2)];for(let k=0;k<K;k++){const t=k/K,t2=t*t,t3=t2*t;
      Q.push([0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)))}}Q.push(P[n-1]);
  const cum=[0];let wmax=0;for(let i=1;i<Q.length;i++)cum.push(cum[i-1]+Math.hypot(Q[i][0]-Q[i-1][0],Q[i][1]-Q[i-1][1]));for(const q of Q)wmax=Math.max(wmax,q[0]);const T=cum[cum.length-1];
  return{wmax,at:t=>{const d=Math.max(.004,Math.min(1,t))*T;let lo=1,hi=cum.length-1;while(lo<hi){const md=(lo+hi)>>1;if(cum[md]<d)lo=md+1;else hi=md}
    const a=cum[lo-1],b=cum[lo],k=b>a?(d-a)/(b-a):0;return[Q[lo-1][0]+(Q[lo][0]-Q[lo-1][0])*k,Q[lo-1][1]+(Q[lo][1]-Q[lo-1][1])*k]}}}
const svSpdL=(c,dl,ds=0)=>{const[h,s,l]=h2l(c);return l2h(h,s*(1+ds),l+dl)};
/* the material of one head: cm = the colourway's row {base, body, tip, back, vein, spd:[base, middle, tip], grain?, edge?} ; st = {gr, dec, fan} */
/* the young bud is green with its colour only at the tip and along the margin (photos of buds): body, base and back go nearly all the way to the
   green (no muddy half-mix of a red and a green), the tip keeps most of its hue */
function svSpdMat(cm,S,st,veins){const kG=Math.min(1,st.gr*1.7)*.9,gm=c=>st.gr>0?mix(c,S.greenC,kG):c,gt=c=>st.gr>0?mix(c,S.greenC,st.gr*.45):c,
    body=gm(cm.body),tip=gt(cm.tip||cm.body),base=gm(cm.base||cm.body),back=gm(cm.back||svSpdL(cm.body,.05,-.25));
  const[,,lb]=h2l(body),dark=lb<.22,lite=dark?mix(svSpdL(body,.22,-.2),'#ffffff',.15):mix(svSpdL(body,.1,.05),'#ffffff',.12),L=S.light;
  const m=Object.assign({},L,{stops:[[0,base],[.32,body],[.72,mix(body,tip,.45)],[1,tip]],bstops:[[0,mix(back,'#6f8a4e',.25)],[.3,back],[1,svSpdL(back,-.03)]],
    shade:svSpdL(body,dark?-.08:-.2,.12),lite,bshade:svSpdL(back,-.18,.05),blite:mix(back,'#ffffff',.3),rim:svSpdL(body,dark?-.05:-.24,.1),rw:.0035,ro:.45,cast:svSpdL(body,-.4,-.2),
    ks:L.ks*(1-.8*st.fan)*(1-.3*st.dec),gloss:L.gloss*(1-.5*st.fan),veins});
  if(st.fan>0||st.dec>.3){const e=cm.edge||'#6b3a1c',k=Math.max(st.fan,(st.dec-.3)*.6);m.band={c:e,w:.012+.035*k,v0:.04,op:Math.min(.92,1.2*k),bk:1}}
  m.vein=gm(cm.vein||svSpdL(cm.body,-.15,.05));m.glintC=mix(lite,'#ffffff',.7);
  const sb=c=>mix(st.gr>0?mix(c,'#d8e2a8',st.gr*.5):c,'#2a1810',.78*st.fan);m.spd=(cm.spd||['#f2e8c4','#eedc84','#f8f2dc']).map(sb);m.grain=sb(cm.grain||svSpdL(m.spd[1],-.2,.1));
  return m}
/* the veins, the cross veinlets and the blisters between them (relief by light: a glint on the side of each blister that faces the light, a dark
   crescent opposite), all as runs on the face they belong to (svDraw clips them, the patches redraw them) */
function svSpdVeins(S,g,st,mref){return(sh,front)=>{const out=[];if(LOD)return out;const hi=DET>=1.5,VF=S.veinF,m=mref.m,q=S.quilt[1]*g.quilt*(1+.6*st.fan),n=hi?14:9;
    const vl=(u,a,b)=>{const p=[];for(let i=0;i<=n;i++)p.push([u,a+(b-a)*i/n]);return p},lat=[vl(0,.01,.975)];for(const s of[-1,1])for(const f of VF)lat.push(vl(s*f,.02+f*.03,.965-f*.06));
    out.push([lat,(front?.0045:.0035)*(1+.5*st.fan),m.vein,(front?.5:.3)*(1+.5*st.fan)]);if(!front||q<=0)return out;
    const E2=[0,...VF,.985],nr0=Math.max(4,Math.round(S.quilt[0]*(hi?1:.75))),K=svShade(sh),L2=Math.hypot(LIGHT[0],LIGHT[1])||1,lx=LIGHT[0]/L2,ly=-LIGHT[1]/L2,cr=[],gl=[],gw=[],dk=[],cells=[];
    for(const s of[-1,1])for(let i=0;i<E2.length-1;i++){const hs=pxHashS(i*7+1,s+5,g.sd|0),nr=Math.max(3,nr0+Math.round((hs-.5)*3)),a=E2[i],b=E2[i+1],va=.03+a*.03,vb=.965-b*.06,hu=(b-a)/2,hv0=(vb-va)/nr/2;
      for(let k=0;k<nr;k++){const h2=pxHashS(i*31+k,s+11,g.sd|0),hv=hv0*(.75+.5*h2),t0=(k+(i%2)*.5+(h2-.5)*.45)/nr,v0=va+(vb-va)*t0,v1=v0+2*hv;if(v1>vb+1e-6)continue;const h=pxHashS(i*31+k,s+3,g.sd|0);
        if(k||i%2)cr.push([[s*a,v0],[s*(a+hu*(1+.3*(h-.5))),v0+hv*.35],[s*b,v0+hv*(.1+.2*h)]]);
        const cu=s*(a+hu),cv=v0+hv,p=svAt(sh,cu,cv),pu=svAt(sh,cu+.02,cv),pv=svAt(sh,cu,cv+.02),du=[(pu[0]-p[0])/.02,(pu[1]-p[1])/.02],dv=[(pv[0]-p[0])/.02,(pv[1]-p[1])/.02],
          det=du[0]*dv[1]-du[1]*dv[0];if(Math.abs(det)<1e-6)continue;let ou=(lx*dv[1]-ly*dv[0])/det,ov=(du[0]*ly-du[1]*lx)/det;const kk=.42/Math.max(Math.abs(ou)/hu,Math.abs(ov)/hv,1e-6);ou*=kk;ov*=kk;
        const kv=svLerp(sh,K,cu+ou*.6,cv+ov*.6),e0=v0+2*hv*(.16+.1*h),e1=v1-2*hv*(.16+.1*(1-h)),sv2=ov*.4;
        if(h2>.18)cells.push({sc:kv+.14*(h-.5),kv,g:[[cu+ou*.55,e0+sv2],[cu+ou,cv+sv2],[cu+ou*.55,e1+sv2]],d:[[cu-ou*.5,e0-sv2],[cu-ou*.95,cv-sv2],[cu-ou*.5,e1-sv2]],h})
        }}
    cells.sort((x,y)=>y.sc-x.sc);cells.forEach((c,j)=>{const r=j/cells.length;if(c.kv>.8&&r<.16)gl.push(c.g);else if(c.kv>.75&&r<.42)gw.push(c.g);else if(c.h>.3&&r>.5)dk.push(c.d)});
    out.push([cr,.0032*(1+.6*st.fan),m.vein,.5*Math.min(1.5,q)],[dk,.012,m.shade,.22*Math.min(1.5,q)]);
    if(S.glint>0){const gf=1-.85*st.fan;out.push([gw.concat(gl),.03,m.glintC,.2*S.glint*gf],[gw,.012,m.glintC,.4*S.glint*gf],[gl,.011,'#ffffff',.8*S.glint*gf])}
    return out}}
/* a ribbon proxy sheet along local points P with radii Rr (for the paint order of a drawn piece) */
function svSpdRibbon(B,O,P,Rr){const V=[B[0][2],B[1][2],B[2][2]],n=P.length-1,side=[];for(let i=0;i<=n;i++){const t=V3.nz(V3s(P[Math.min(n,i+1)],P[Math.max(0,i-1)]));let sd=V3.cr(t,V);
    if(Math.hypot(...sd)<1e-3)sd=V3.cr(t,[1,0,0]);side.push(V3.sc(V3.nz(sd),Rr[i]))}
  return svSheet(B,O,(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),f=x-i,p=V3.add(V3.sc(P[i],1-f),V3.sc(P[i+1],f)),s=V3.add(V3.sc(side[i],1-f),V3.sc(side[i+1],f));return V3.add(p,V3.sc(s,u))},{nu:2,nv:Math.max(2,n)})}
/* the spadix: a lit cylinder with a rounded light tip and a honeycomb of florets on the visible side; its shadow on the spathe */
function svSpdSpadix(B,O,P,Rr,m,o){const Sp=P.map(p=>PJ(B,O,p)),n=P.length-1,L2=Math.hypot(LIGHT[0],LIGHT[1])||1,lx=LIGHT[0]/L2,ly=-LIGHT[1]/L2;
  return k=>{const dd=GDEF||defs,Lr=[],Rt=[];let len=0;for(let i=1;i<=n;i++)len+=Math.hypot(Sp[i][0]-Sp[i-1][0],Sp[i][1]-Sp[i-1][1]);
    /* the shadow on the blade (along the light, onto the plane of the sinus), clipped to the spathe */
    if(!LOD&&o.shadow&&o.clip){const Ll=[V3.dot(B[0],LIGHT),V3.dot(B[1],LIGHT),V3.dot(B[2],LIGHT)],ln=V3.dot(Ll,o.nrm);if(ln>.12){let d='';P.forEach((p,i)=>{const h=V3.dot(p,o.nrm),q=PJ(B,O,V3.add(p,V3.sc(Ll,-h/ln)));d+=(i?'L':'M')+svJ([q[0],q[1]])});
        E('path',{d,fill:'none',stroke:m.cast,'stroke-width':svF(Rr[0]*2.2),'stroke-linecap':'round','stroke-opacity':o.so??.3,filter:svBlur(Rr[0]*1.1),'clip-path':`url(#${o.clip})`},k)}}
    /* o.throat (cornet): the hollow of the throat, a soft dark disc on the tube's cross-section, under the spadix (hidden with it by the front wall) */
    if(o.throat){const t=o.throat,gi='sg'+(gid++),gr=E('radialGradient',{id:gi,gradientUnits:'userSpaceOnUse',cx:svF(t.cx),cy:svF(t.cy),r:svF(t.r*.8)},dd);
      stops(gr,[[0,t.c,t.a],[.5,t.c,t.a*.72],[1,t.c,0]]);E('path',{d:svSpl(t.pts,true),fill:`url(#${gi})`},k);
      /* the inner margin seen from within: a lit edge over its soft shadow, the spiral of the rolled foot */
      if(t.edge){const d=svSpl(t.edge,false),ci='tc'+(gid++);E('path',{d:svSpl(t.pts,true)},E('clipPath',{id:ci},dd));const kc=G(k,{'clip-path':`url(#${ci})`});E('path',{d,fill:'none',stroke:t.c,'stroke-width':svF(t.r*.09),'stroke-opacity':svF(t.a*.6),'stroke-linecap':'round',filter:svBlur(t.r*.05)},kc);
        E('path',{d,fill:'none',stroke:t.lite,'stroke-width':svF(t.r*.035),'stroke-opacity':.7,'stroke-linecap':'round'},kc)}}
    if(len<Rr[0]*.9){const p=Sp[n];E('circle',{cx:svF(p[0]),cy:svF(p[1]),r:svF(Rr[n]*1.05),fill:m.spd[2]},k);return}
    const N=[];for(let i=0;i<=n;i++){const a=Sp[Math.max(0,i-1)],b=Sp[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;N.push([-dy/l,dx/l]);Lr.push([Sp[i][0]-dy/l*Rr[i],Sp[i][1]+dx/l*Rr[i]]);Rt.push([Sp[i][0]+dy/l*Rr[i],Sp[i][1]-dx/l*Rr[i]])}
    const tn=[-N[n][1],N[n][0]],cap=[];for(let j=1;j<6;j++){const a=Math.PI*j/6,c=Math.cos(a),s=Math.sin(a);cap.push([Sp[n][0]+(-N[n][0]*c+tn[0]*s)*Rr[n],Sp[n][1]+(-N[n][1]*c+tn[1]*s)*Rr[n]])}
    const d=svSpl(Lr.concat(cap.reverse().map(p=>p),Rt.reverse()),true),id='sd'+(gid++);E('path',{id,d},dd);
    const g1='sg'+(gid++),gr=E('linearGradient',{id:g1,gradientUnits:'userSpaceOnUse',x1:svF(Sp[0][0]),y1:svF(Sp[0][1]),x2:svF(Sp[n][0]+tn[0]*Rr[n]),y2:svF(Sp[n][1]+tn[1]*Rr[n])},dd);
    stops(gr,[[0,m.spd[0]],[.45,m.spd[1]],[.86,m.spd[1]],[1,m.spd[2]]]);E('use',{href:'#'+id,fill:`url(#${g1})`},k);if(LOD)return;
    /* across: the lit side toward the light, the far side dark (one gradient across the chord) */
    const im=n>>1,Nm=N[im],lit=Nm[0]*lx+Nm[1]*ly>0?1:-1,Rm=Math.max(...Rr),c0=Sp[im],g2='sg'+(gid++),gx=E('linearGradient',{id:g2,gradientUnits:'userSpaceOnUse',x1:svF(c0[0]+Nm[0]*Rm*lit),y1:svF(c0[1]+Nm[1]*Rm*lit),x2:svF(c0[0]-Nm[0]*Rm*lit),y2:svF(c0[1]-Nm[1]*Rm*lit)},dd);
    stops(gx,[[0,'#ffffff',.32],[.28,'#ffffff',0],[.55,m.grain,0],[1,m.grain,.7]]);E('use',{href:'#'+id,fill:`url(#${g2})`},k);
    /* the florets: a spiral lattice (a honeycomb), dots where the surface faces the viewer, a light fleck on those facing the light */
    const nG=Math.round((DET>=1.5?o.grain[1]:o.grain[0])*Math.min(1.4,len/(Rr[0]*12))),T=P.map((p,i)=>V3.nz(V3s(P[Math.min(n,i+1)],P[Math.max(0,i-1)]))),Vw=[B[0][2],B[1][2],B[2][2]],dots=[],fl=[];
    for(let j=0;j<nG;j++){const t=(j+.5)/nG*.96,x=t*n,i=Math.min(n-1,Math.floor(x)),f=x-i,p=V3.add(V3.sc(P[i],1-f),V3.sc(P[i+1],f)),tt=T[i],r=Rr[i]*(1-f)+Rr[i+1]*f;
      let q1=V3.cr(tt,[0,0,1]);if(Math.hypot(...q1)<.1)q1=V3.cr(tt,[1,0,0]);q1=V3.nz(q1);const q2=V3.cr(tt,q1),ph=j*2.39996,nv=V3.add(V3.sc(q1,Math.cos(ph)),V3.sc(q2,Math.sin(ph))),wn=toV(B,nv);
      if(wn[2]<.18)continue;const s=PJ(B,O,V3.add(p,V3.sc(nv,r)));dots.push(s);if(V3.dot(wn,LIGHT)>.45)fl.push([s[0]+lx*r*.3,s[1]+ly*r*.3])}
    const dw=Math.max(.35,Math.sqrt(len*Math.PI*Rr[0]*2/Math.max(8,nG))*.55),cg=G(k,{'clip-path':`url(#c${id})`});E('use',{href:'#'+id},E('clipPath',{id:'c'+id},dd));
    E('path',{d:svDots(dots),stroke:m.grain,'stroke-width':svF(Math.min(dw,Rr[0]*.5)),'stroke-linecap':'round','stroke-opacity':o.sh??.5,fill:'none'},cg);
    if(fl.length)E('path',{d:svDots(fl),stroke:'#ffffff','stroke-width':svF(Math.min(dw,Rr[0]*.5)*.45),'stroke-linecap':'round','stroke-opacity':.45,fill:'none'},cg);
    E('use',{href:'#'+id,fill:'none',stroke:svSpdL(m.grain,-.15),'stroke-width':svF(Math.max(.3,Rr[0]*.08)),'stroke-opacity':.4},k)}}
/* the head: returns svDraw's group. o = {neckW, neckL, sc (stem colours with .sv), shadow} */
function svSpdHead(par,B,O,D,S0,cm,op,seed,wl,o={}){const S=svSpdSpec(S0),g=svSpdGenes(seed,S.genes),wl0=wl||0,dec=svSm((wl0-S.dec[0])/S.dec[1]),fan=svSm((wl0-S.fan[0])/S.fan[1]),
    o2=svSm((op-S.open[0])/S.open[1]),gr=1-svSm((op-S.green[0])/S.green[1]),grow=svSm((op-S.growR[0])/S.growR[1]),L=D*S.len*g.size*(S.budL+(1-S.budL)*grow)*(1-S.fanL*fan),st={gr,dec,fan};
  const HL=svSpdOutline(S,g,-1),HR=svSpdOutline(S,g,1),wmax=Math.max(HL.wmax,HR.wmax);
  /* the frame of the blade: n (upper face), m (midrib, sinus -> tip), e (across) */
  const U=[B[0][1],B[1][1],B[2][1]],Vw=[B[0][2],B[1][2],B[2][2]],kv=o.kv??.8;let up=[U[0]+kv*Vw[0],U[1]+kv*Vw[1]+.25,0];if(Math.hypot(up[0],up[1])<1e-3)up=[0,1,0];up=V3.nz(up);const cp=Math.cos(g.psi),sp=Math.sin(g.psi),uh=[cp*up[0]-sp*up[1],sp*up[0]+cp*up[1],0];
  const oT=S.openT?svSm((op-S.openT[0])/S.openT[1]):o2,/* openT: the blade turns to face before it unrolls (no V seen from the tip half-open) */a=S.tilt[0]+(S.tilt[1]-S.tilt[0])*oT+g.tilt*oT-S.droop*fan,ca=Math.cos(a),sa=Math.sin(a);let n=[sa*uh[0],sa*uh[1],ca],m=[-ca*uh[0],-ca*uh[1],sa],e=V3.cr(n,m);
  /* the bud stands up on its stem whatever the head's axis: its midrib turns to the world's up while it is closed (o.budUp false: off) */
  const wb=o.budUp===false?0:Math.pow(1-o2,2);if(wb>0){/* a sheet turned to its face (o.face): the bud continues its stem */const up0=o.face!=null?[0,0,1]:V3.nz(U);m=V3.nz(V3.add(V3.sc(m,1-wb),V3.sc(up0,wb)));let e2=V3.add(e,V3.sc(m,-V3.dot(e,m)));
    if(Math.hypot(...e2)>1e-3){e=V3.nz(e2);n=V3.cr(m,e)}}
  /* S.lean (blade): the open blade turns about its cross axis, the tip rising toward its face: seen from the side it leans back, an arc, never a flat
     table at the stem's top (anthurium, 2026-10-17) */
  if(S.lean&&o2>0){const ph=S.lean*o2,c=Math.cos(ph),s2=Math.sin(ph),m2=V3.add(V3.sc(m,c),V3.sc(n,s2));n=V3.add(V3.sc(n,c),V3.sc(m,-s2));m=m2}
  /* S.wrapL (cornet): the roll is measured on the local half width (1: the margins meet round the axis, < 0: rolled outward) ; S.fanRoll: the
     spathe closes again as it fades ; S.bowS (cornet): -1 bows the faded head away from its face, with the stem's lean (gravity) ; o.bowK scales that bow (in a bouquet, where c5 nods the head already) ; g.ro: the individual opens its cornet a little more or less */
  const rho=v=>svSpdTab(S.roll,v)*(1-o2)+svSpdTab(S.rollO,v)*o2*(g.ro??1)+(S.fanRoll?svSpdTab(S.fanRoll,v)*fan:0),camb=(S.camb+g.camb)*o2+S.fanCamb*fan,hem=(S.hem*o2+S.fanHem*fan),lbD=.145*S.lb*g.lb,tw=g.tw*o2,cupK=1+S.fanCup*fan/.1;
  const Sf=(u,v)=>{const s=u<0?-1:1,f=Math.abs(u),Ed=(s<0?HL:HR).at(v),mx=g.bend*Math.sin(Math.PI*v),x=mx+(Ed[0]*s-mx)*f,y=v+(Ed[1]-v)*f;let X=x-mx,Z=0;const rh=rho(v);
    if(S.wrapL){if(Math.abs(rh)>.01){const rr=Math.max(1e-4,Ed[0])/(Math.PI*rh)*(1+S.ovl*s),sA=Math.abs(X),K=S.reflex&&rh>0?svSpdTab(S.reflex,v)*o2:0,s0=(S.reflexF??.65)*Math.max(1e-4,Ed[0]);
      /* S.reflex (cornet, curvature x 1/L along v) : past s0 the margin rolls back the other way, a lip that curls outward (the arc's angle decreases) */
      if(K>0&&sA>s0){const t0=s0/rr,t1=t0-(sA-s0)*K;X=Math.sign(X)*(rr*Math.sin(t0)+(Math.sin(t0)-Math.sin(t1))/K);Z=rr*(1-Math.cos(t0))+(Math.cos(t1)-Math.cos(t0))/K}
      else{const th=sA/rr;X=Math.sign(X)*rr*Math.sin(th);Z=rr*(1-Math.cos(th))}}}
    else if(rh>.01){const rr=wmax/(Math.PI*rh)*(1+S.ovl*s),th=Math.abs(X)/rr;X=Math.sign(X)*rr*Math.sin(th);Z=rr*(1-Math.cos(th))}
    const flat=1-Math.min(1,Math.abs(rh)*2);Z+=(svSpdTab(S.cup,v)+g.cup)*cupK*Math.pow(x/wmax-mx/wmax,2)*wmax*flat;
    if(y<0)Z+=S.lobUp*svSm(-y/lbD)*o2;if(S.tipUp)Z+=S.tipUp*o2*svSm((y-.55)/.45);Z-=camb*Math.pow(Math.max(0,y),2);Z-=hem*Math.pow(Math.max(0,(f-.8)/.2),2)*(S.hemV?svSpdTab(S.hemV,v):1);if(fan>0)Z+=S.wav*fan*Math.sin(v*17+g.ph)*f*f*f;
    const ta=tw*Math.max(0,y),ct=Math.cos(ta),stt=Math.sin(ta),X2=X*ct-Z*stt,Z2=X*stt+Z*ct,px=mx+X2;
    return[(e[0]*px+m[0]*y+n[0]*Z2)*L,(e[1]*px+m[1]*y+n[1]*Z2)*L,(e[2]*px+m[2]*y+n[2]*Z2)*L]};
  /* o.face (sheets only): the views are taken about the open spathe's face, as a flower's about its axis. The face's axis f (the open blade's
     normal, turned by o.face rad toward its midrib: a cornet's mouth) is brought onto the flower axis, the stem leaning back by as much: view 0
     looks at the face, 2 at three-quarters, 7 along it. The open frame's tilt, turned in with the opening */
  if(o.face!=null){const A=S.tilt[1]+g.tilt+(S.lean||0),f0=[Math.sin(A)*uh[0],Math.sin(A)*uh[1],Math.cos(A)],m0=[-Math.cos(A)*uh[0],-Math.cos(A)*uh[1],Math.sin(A)],
      f=V3.nz(V3.add(V3.sc(f0,Math.cos(o.face)),V3.sc(m0,Math.sin(o.face)))),k0=V3.cr(f,[0,0,1]),sk=Math.hypot(...k0);
    if(sk>1e-4){/* the turn grows with the opening: the closed bud stands on its stem as before */const k=V3.sc(k0,1/sk),th=Math.atan2(sk,f[2])*o2,c=Math.cos(th),s=Math.sin(th),R=v=>{const kv=V3.dot(k,v),kx=V3.cr(k,v);return[0,1,2].map(j=>v[j]*c+kx[j]*s+k[j]*kv*(1-c))};
      /* toV(B',p) = toV(B,R p), R turning f onto z: the head built in its own frame and seen through B' has f where B had its axis */
      /* o.flip: half a turn about the axis as well, the stem below the face (a cornet's tip above its throat, as photographed) */
      const F=o.flip?(v=>[-v[0],-v[1],v[2]]):(v=>v),X=[F(R([1,0,0])),F(R([0,1,0])),F(R([0,0,1]))];B=[0,1,2].map(i=>toV(B,X[i]))}}
  if(o.center){const c=toV(B,V3.sc(m,L*.38));O=[O[0]-c[0],O[1]-c[1],O[2]-c[2]]}
  /* o.pose = {yc, k, h}: the bouquet's pose of an older drawing that was centred on its blade: the point yc of the midrib, k under the blade, sits on O
     (the stem's end), and the neck is drawn from O, tangent to the stem, curving under the blade back to the sinus */
  let PO=null;if(o.pose){const q=o.pose,yc=(q.yc??.4)*(q.ycO?o2:1);/* ycO: the bud sits level on its stem, the pose point moves up the midrib as it opens */
    if(S.bow&&fan>0){const th=S.bow*fan*(o.bowK??1),c=Math.cos(th),s=Math.sin(th),k=[-uh[1],uh[0],0],rot=v=>{const kv=V3.dot(k,v),kx=V3.cr(k,v);return[0,1,2].map(j=>v[j]*c+kx[j]*s+k[j]*kv*(1-c))};n=rot(n);m=rot(m);e=rot(e)}PO=V3.add(V3.sc(m,L*yc),V3.sc(n,-L*((q.k??.07)+camb*yc*yc)));/* k under the arched blade (camb), never in front of it */const c=toV(B,PO);O=[O[0]-c[0],O[1]-c[1],O[2]-c[2]]}
  /* S.footO (cornet): the roll's axis at the foot sits on O, the stem enters the base of the tube ; o.sink lowers the head along the stem (x L) ;
     at fané (S.bow) the neck is an arc of stem from O, tangent to the stem, to the foot of the bowed head (o.arcL x L at full fané) */
  let C0=null,PA=null,arc=null,rF=0;if(S.footO){const rh0=rho(.02);rF=Math.max(1e-4,(HL.at(.02)[0]+HR.at(.02)[0])/2)/(Math.PI*Math.max(.3,Math.abs(rh0)))*L;
    const bs=S.bowS??1,th=S.bow*fan*bs*(o.bowK??1),kx=[-uh[1],uh[0],0];if(Math.abs(th)>1e-3){const c=Math.cos(th),s=Math.sin(th),rot=v=>{const kv=V3.dot(kx,v),kc=V3.cr(kx,v);return[0,1,2].map(j=>v[j]*c+kc[j]*s+kx[j]*kv*(1-c))};n=rot(n);m=rot(m);e=rot(e)}
    C0=V3.sc(n,rF);const al=(o.arcL||0)*L*fan;let E0=[0,0,0];const ta=Math.abs(th);if(ta>1e-3&&al>0){const rc=al/ta;arc=t=>V3.add(V3.sc([0,0,1],rc*Math.sin(ta*t)),V3.sc([uh[0],uh[1],0],bs*rc*(1-Math.cos(ta*t))));E0=arc(1)}
    PA=V3.add([C0[0]-E0[0],C0[1]-E0[1],C0[2]-E0[2]],[0,0,(o.sink||0)*L]);const c=toV(B,PA);O=[O[0]-c[0],O[1]-c[1],O[2]-c[2]]}
  /* S.aoT[2] (cornet): the throat. The rim is where the roll first falls under aoT[2] ; the inner face darkens with its depth below that rim
     (aoT[1]: the depth, x L, to full shade), the deep tube a hollow, never the flat cream of the limb */
  let vR=null;if(S.aoT&&S.aoT[2]!=null){vR=1;for(let i=0;i<=50;i++)if(rho(i/50)<S.aoT[2]){vR=i/50;break}}
  const hi=DET>=1.5,mref={},mat=(S.matFn||svSpdMat)(cm,S,st,null);mref.m=mat;mat.veins=(S.veinsFn||svSpdVeins)(S,g,st,mref);
  const sh=svSheet(B,O,Sf,{nu:LOD?8:hi?S.nu[1]:S.nu[0],nv:LOD?10:hi?S.nv[1]:S.nv[0],mat,ao:(u,v,fr)=>fr?(vR!=null?1-S.aoT[0]*svSm((vR-v)/S.aoT[1]+.25)*(1-.25*Math.abs(u)):1-(S.aoT?S.aoT[0]:.28)*Math.exp(-v/(S.aoT?S.aoT[1]:.08))*(1-.5*Math.abs(u))):svSpdOvlAO(S,rho(v),u)});
  /* the spadix: from the sinus, leaning out of the blade (el) and toward the base or the tip (az), bending toward the light above; in the bud, along
     the midrib inside the roll */
  const Uw=V3.nz(U),el=S.spd.el[0]+(S.spd.el[1]-S.spd.el[0])*g.el,az=S.spd.az[0]+(S.spd.az[1]-S.spd.az[0])*g.az,ce=Math.cos(el),
    dO=V3.nz([0,1,2].map(j=>ce*(-Math.cos(az)*m[j]+Math.sin(az)*e[j])+Math.sin(el)*n[j])),rb=wmax/(Math.PI*Math.max(.35,rho(.4))),d0=V3.nz(V3.add(V3.sc(m,1-o2),V3.sc(dO,o2))),
    cv=S.spd.curve[0]+(S.spd.curve[1]-S.spd.curve[0])*g.curve,d1=V3.nz(V3.add(d0,V3.sc(Uw,cv*o2-.6*fan))),sl=L*(S.spd.bud*(1-o2)+S.spd.len*o2),NP=hi?10:7,P=[],Rr=[];
  let p=C0?V3.add(V3.sc(n,rF*(S.spd.foot??.7)),V3.sc(m,L*.02)):V3.add(V3.sc(n,L*(S.spd.r0*(1-o2)+.006)),V3.sc(m,L*.012*o2));/* cornet: on the inner wall of the tube's foot, deep in the throat *//* foot on the midrib at the sinus at every stage (never floating) */for(let i=0;i<=NP;i++){const t=i/NP;P.push(p);Rr.push(L*(S.spd.r0*(1-t)+S.spd.r1*t)*(1-.15*fan)*(.85+.15*o2)*(t<.8?1:Math.sqrt(Math.max(.1,1-((t-.8)/.2)**2))));/* the tip rounds off, never a cut tube */p=V3.add(p,V3.sc(V3.nz(V3.add(V3.sc(d0,1-t),V3.sc(d1,t))),sl/NP))}
  /* the outline of the spathe, to clip the spadix's shadow */
  let clip=null;if(!LOD&&o.shadow!==false){const q=[];for(let i=0;i<=16;i++)q.push(svAt(sh,-1,i/16));for(let i=16;i>=0;i--)q.push(svAt(sh,1,i/16));clip='sc'+(gid++);E('path',{d:svSpl(q,true)},E('clipPath',{id:clip},GDEF||defs))}
  /* the broad sheen of the lacquer: soft spots where the upper face meets the light best */
  if(!LOD&&S.glint>0&&fan<.9){const K=svShade(sh),c=[];for(let j=2;j<sh.nv-1;j++)for(let i=1;i<sh.nu;i++){const q=j*sh.W+i;if(sh.F[q]>.1)c.push([K[q],-1+2*i/sh.nu,j/sh.nv])}
    c.sort((x,y)=>y[0]-x[0]);const sp=[],lc=mix(mat.lite,'#ffffff',.5);for(const[k,u,v]of c){if(sp.length>=3)break;if(sp.some(p=>Math.abs(p[0]-u)<.45&&Math.abs(p[1]-v)<.22))continue;sp.push([u,v,.32-.06*sp.length,lc,(.34-.08*sp.length)*S.glint*(1-fan)])}
    mat.spots=(mat.spots||[]).concat(sp)}
  /* S.throat [v, opacity, darkening] (cornet): the tube's cross-section at v, drawn shrunk round its centre */
  let thr=null;if(!LOD&&S.throat&&S.wrapL&&o2>.3){const q=[];for(let i=0;i<=20;i++)q.push(svAt(sh,-1+i/10,S.throat[0]));const cx=q.reduce((a,p)=>a+p[0],0)/q.length,cy=q.reduce((a,p)=>a+p[1],0)/q.length;
    let r=0;for(const p of q)r=Math.max(r,Math.hypot(p[0]-cx,p[1]-cy));const dp=C0?PJ(B,O,V3.add(C0,V3.sc(m,L*.1))):[cx,cy],ed=[];for(let i=0;i<=8;i++)ed.push(svAt(sh,-1,S.throat[0]*.8*i/8));
    thr={pts:q.map(p=>[cx+(p[0]-cx)*.92,cy+(p[1]-cy)*.92]),cx:(cx+dp[0])/2,cy:(cy+dp[1])/2,r:r*1.1,edge:ed,lite:mix(mat.lite||'#ffffff','#ffffff',.3),c:mix(mat.shade,S.throatC||'#4e4a22',S.throat[2]),a:S.throat[1]*svSm((o2-.3)/.4)*(1-.5*fan)}}
  const pieces=[sh,{fn:svSpdSpadix(B,O,P,Rr,mat,{throat:thr,shadow:o2>.3,clip,nrm:n,so:.3,grain:S.spd.grain,sh:S.spd.sh}),proxy:svSpdRibbon(B,O,P,Rr)}];
  /* the stub of stem, joining the back of the sinus */
  const nl=L*(o.neckL??S.neck.len),nw=o.neckW||L*S.neck.w*S.len;
  /* cornet: the stub of stem below O, then the bowed neck's arc up to the foot of the tube */
  if(C0){const C=[],W=[];if(nl>0)for(let i=0;i<=5;i++){C.push(V3.add(PA,[0,0,-nl*(1-i/5)]));W.push(nw)}if(arc)for(let i=C.length?1:0;i<=8;i++){C.push(V3.add(PA,arc(i/8)));W.push(nw*(1-.05*i/8))}
    if(C.length>1){const sc=o.sc||(()=>{const c=['#2e4a24','#4b7036','#7a9e5a','#b2cc96'];c.sv={gloss:.5,swell:.02};return c})();
      /* seen down the tube (its axis toward the viewer), the stub lies behind the foot: drawn first, never through the throat */
      pieces.push({fn:k=>{svStemLine(k,C.map(q=>{const s=PJ(B,O,q);return[s[0],s[1]]}),W,sc)},proxy:svSpdRibbon(B,O,C,W.map(w=>w/2)),zb:toV(B,m)[2]>.35?-1e6:0})}}
  else if(nl>0||PO){const C=[],W=[],NC=PO?10:6;
    if(PO){const h=L*(o.pose.h??.06),P1=V3.add(PO,[0,0,h]),P2=V3.add(V3.sc(n,-L*.09),V3.sc(m,-L*.03)),P3=V3.sc(n,-L*.004);
      for(let i=0;i<=NC;i++){const t=i/NC,u=1-t,b0=u*u*u,b1=3*u*u*t,b2=3*u*t*t,b3=t*t*t;C.push([0,1,2].map(j=>b0*PO[j]+b1*P1[j]+b2*P2[j]+b3*P3[j]));W.push(nw*(1-.12*t))}}
    /* o.stubM (sheets of a hanging blade): the peduncle runs down behind the blade from the sinus, along the midrib, as cut stems are seen */
    else if(o.stubM){/* the peduncle keeps the open frame (the stem does not droop with the fading blade) */const A=S.tilt[1]+g.tilt+(S.lean||0),n=[Math.sin(A)*uh[0],Math.sin(A)*uh[1],Math.cos(A)],m=[-Math.cos(A)*uh[0],-Math.cos(A)*uh[1],Math.sin(A)];
      const Q=[V3.sc(n,-L*.004),V3.add(V3.sc(n,-L*.12),V3.sc(m,-L*.02)),V3.add(V3.sc(n,-L*.16),V3.sc(m,L*.3)),V3.add(V3.sc(n,-L*.17),V3.sc(m,L*o.stubM))];
      /* the closed bud keeps the straight stub along its stem ; the peduncle bends behind the blade as it opens */
      for(let i=0;i<=NC;i++){const t=1-i/NC,u=1-t,b=[u*u*u,3*u*u*t,3*u*t*t,t*t*t],q=[0,1,2].map(j=>b[0]*Q[3][j]+b[1]*Q[2][j]+b[2]*Q[1][j]+b[3]*Q[0][j]),z=[0,0,-L*o.stubM*.6*t-L*.004];
        C.push([0,1,2].map(j=>z[j]+(q[j]-z[j])*o2));W.push(nw*(1+.06*t))}}
    else for(let i=0;i<=NC;i++){const t=1-i/NC,pp=[0,0,-nl*t-L*.004];C.push(pp);W.push(nw*(1+.06*t))}
    const sc=o.sc||(()=>{const c=['#2e4a24','#4b7036','#7a9e5a','#b2cc96'];c.sv={gloss:.5,swell:.02};return c})();
    /* the sheet's peduncle (stubM) lies behind the whole blade: drawn first, under the head */
    if(o.stubM)svStemLine(G(par),C.map(q=>{const s=PJ(B,O,q);return[s[0],s[1]]}),W,sc);
    else pieces.push({fn:k=>{svStemLine(k,C.map(q=>{const s=PJ(B,O,q);return[s[0],s[1]]}),W,sc)},proxy:svSpdRibbon(B,O,C,W.map(w=>w/2))})}
  return svDraw(par,pieces,{D:L,pmin:3,sd:.02,sb:.015,so:.28,shadow:o.shadow!==false})}
/* S.ovlSh (cornet, wrapL): where the margins overlap at the foot, the outer margin (u > 0, the larger radius) shades the inner one just past its
   edge: the spiral of the rolled foot reads as one soft line. The inner half is covered from fe on (its outer face, seen from outside) */
function svSpdOvlAO(S,rh,u){if(!S.ovlSh||!S.wrapL||u>=0||!(rh>0))return 1;const ov=S.ovl||0,fe=(2-rh/(1+ov))*(1-ov)/rh;if(fe>=1)return 1;
  return 1-S.ovlSh*svSm((-u-fe+.26)/.26)}
/* ---------- the bouquet's box (rtest) ----------
   c5.js measures each head group fully grown (getBBox of its [data-h] group, l.243) to raise a head over the vessel's rim: a SVG head whose box
   leaves the old drawing's box moves the bouquet's chance. In a bouquet only (GDEF is set while buildBq runs), the old head is drawn again with
   the draws it consumed (rec), measured fully grown and removed (its tweens too); its box stays as a rect with no paint. The SVG head is drawn
   by draw into its own group; once the plant has drawn its stem (svSpdFitPlant, called by the plant after lsHeadS), that group is scaled about
   its anchor A (the stem's tip) until it lies inside the union of that box and of the stem on the sides c5 reads (left, right, bottom; the
   top is free). Sheets, plants and close-ups (no GDEF) keep the true size. ?spdbox=0 turns it off (to test) */
let SVSPD_PEND=[];
const svSpdToPar=(par,el)=>{const b=el.getBBox();if(!(b.width||b.height))return null;const M=par.getCTM().inverse().multiply(el.getCTM()),
  P=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(M));
  return[Math.min(...P.map(p=>p.x)),Math.min(...P.map(p=>p.y)),Math.max(...P.map(p=>p.x)),Math.max(...P.map(p=>p.y))]};
function svSpdKeepBox(par,draw,oldFn,rec,A){
  const bq=typeof GDEF!=='undefined'&&!!GDEF&&!!par&&par.isConnected&&!(typeof location!=='undefined'&&/[?&]spdbox=0/.test(location.search));
  if(!bq){draw(par);return}
  let Bo=null;{const r0=rnd,t1=tw.length,gO=G(par);let i=0;rnd=()=>i<rec.length?rec[i++]:.5;
    try{oldFn(gO);for(let k=t1;k<tw.length;k++)tw[k].fn(1,1);Bo=svSpdToPar(par,gO)}catch(_){}finally{rnd=r0;tw.length=t1;gO.remove()}}
  const t2=tw.length,gN=G(par);draw(gN);if(!Bo)return;
  E('rect',{x:f(Bo[0]),y:f(Bo[1]),width:f(Bo[2]-Bo[0]),height:f(Bo[3]-Bo[1]),fill:'#000','fill-opacity':0,stroke:'none'},par);
  SVSPD_PEND.push({par,gN,Bo,A:[A[0],A[1]],t2,t3:tw.length})}
/* the fit, once the plant k is drawn (t0: the tweens' length when the plant began) */
function svSpdFitPlant(k,t0){const pend=SVSPD_PEND;SVSPD_PEND=[];
  for(const q of pend){const{par,gN,Bo,A}=q;if(!gN.isConnected||!k.contains(gN))continue;
    const ws=tw.slice(t0);for(const w of ws)w.fn(1,1);let C=null,Bn=null;
    try{Bn=svSpdToPar(par,gN);const nx=gN.nextSibling,pp=gN.parentNode;gN.remove();try{C=svSpdToPar(par,k)}finally{pp.insertBefore(gN,nx)}}catch(_){}finally{for(const w of ws)w.fn(0,0)}
    if(!Bn)continue;C=C?[Math.min(C[0],Bo[0]),Math.min(C[1],Bo[1]),Math.max(C[2],Bo[2]),Math.max(C[3],Bo[3])]:Bo;
    const e=.05,ax=A[0],ay=A[1];let s=1;
    if(Bn[0]<C[0]+e)s=Math.min(s,ax>C[0]+e?(ax-C[0]-e)/Math.max(1e-6,ax-Bn[0]):0);
    if(Bn[2]>C[2]-e)s=Math.min(s,ax<C[2]-e?(C[2]-e-ax)/Math.max(1e-6,Bn[2]-ax):0);
    if(Bn[3]>C[3]-e)s=Math.min(s,ay<C[3]-e?(C[3]-e-ay)/Math.max(1e-6,Bn[3]-ay):0);
    if(typeof SPD_BOXLOG!=='undefined')SPD_BOXLOG.push([+s.toFixed(3),Bo.map(v=>+v.toFixed(1)),Bn.map(v=>+v.toFixed(1)),C.map(v=>+v.toFixed(1)),[+ax.toFixed(1),+ay.toFixed(1)]]);
    s=Math.max(.05,s);if(s<1)gN.setAttribute('transform',`translate(${f(ax)},${f(ay)}) scale(${s.toFixed(4)}) translate(${f(-ax)},${f(-ay)})`)}}
