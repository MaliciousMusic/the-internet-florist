/* ================= Serre, lot 45 — verdures et matières : mousses fraîches, pin, loropetalum, robinier, troène à baies ================= */
/* ---------- shared: the outline of a spheroid seen on the screen (centre O in view space, axis a, half-length hl along it, radius r across), its radius modulated by e(θ) ---------- */
function l45Sph(O,a,hl,r,n,e){const az=a[2],a2=[a[0],-a[1]],l2=Math.hypot(a2[0],a2[1]),e1=l2>1e-4?[a2[0]/l2,a2[1]/l2]:[1,0],e2=[-e1[1],e1[0]],mj=Math.sqrt(hl*hl*(1-az*az)+r*r*az*az),c=[O[0],-O[1]],P=[];
  for(let i=0;i<n;i++){const t=i/n*6.283,k=e?e(t):1;P.push([c[0]+(e1[0]*mj*Math.cos(t)+e2[0]*r*Math.sin(t))*k,c[1]+(e1[1]*mj*Math.cos(t)+e2[1]*r*Math.sin(t))*k])}return P}
/* a spindle from b to e (view space): its centreline projected, its radius rf(t) across it on the screen (buds, candles, cones, keels); zz: the radius of its scales' zigzag */
function l45Spin(b,e,rf,n=10,zz=0){const C=[];for(let i=0;i<=n;i++){const t=i/n;C.push([b[0]+(e[0]-b[0])*t,-(b[1]+(e[1]-b[1])*t)])}const dx=C[n][0]-C[0][0],dy=C[n][1]-C[0][1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,A=[],B=[];
  for(let i=0;i<=n;i++){const r=Math.max(.6,rf(i/n)*(zz&&i>0&&i<n?(i%2?1+zz:1-zz*.5):1));A.push([C[i][0]+nx*r,C[i][1]+ny*r]);B.push([C[i][0]-nx*r,C[i][1]-ny*r])}
  const fs=Math.min(1,l/(V3l(V3s(e,b))||1));return{P:A.concat(B.reverse()),C,nx,ny,fs}}
/* a stroke along screen points (pedicels, rachises, stalks): never finer than 1.1, so it reads joined at the app's detail */
const l45Line=(par,P,w,c,o={})=>E('path',{d:'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c,'stroke-width':f(Math.max(1.1,w)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round',opacity:o.op??1},par);
const l45Q=p=>[p[0],-p[1]];
/* the lowest view-space height of a set of 3D points (a leaf in a bouquet stays above the mouth it leaves) */
const l45Low=P=>P.reduce((m,p)=>Math.min(m,p[1]),1e9);

/* ---------- fresh moss: bun moss (Leucobryum glaucum, « coussinets »: dense hemispherical cushions, pale glaucous to vivid green, velvety), cushion and sheet mosses
   (Hypnum cupressiforme, « mousse plate »: a flat carpet of creeping, feathery, overlapping shoots), mood moss (Dicranum scoparium: tufts of sickle-shaped leaves, all combed one way);
   lifted with their brown mat of rhizoids and soil. The florist lays them over the floral foam or at the foot of the stems; wired on a pick in a bouquet.
   Drawn in the cushion's own frame (z its up): a brown mat (a thin prism) and on it a few domes, each one tone in shadow, one lit, one in the light, and its texture
   (velvet stipple, feathery fronds or combed strokes) as one light and one dark path: a dense fine surface for a handful of elements ---------- */
const CW_L45MOS=[{id:'vert-vif',n:'Vert vif velouté (Leucobryum, bun moss)',c:'#5f8f35',k:'bun'},{id:'vert-tendre',n:'Vert tendre glauque (Leucobryum glaucum)',c:'#9aa548',k:'bun',gl:1},
  {id:'mousse-plate',n:'Mousse plate (Hypnum, sheet moss)',c:'#6f8a34',k:'flat'},{id:'vert-sapin',n:'Vert sapin (Dicranum, mood moss)',c:'#3e5a2c',k:'mood'},
  {id:'vert-olive',n:'Vert olive (mousse plate des bois)',c:'#6b6a32',k:'flat'}];
const L45_MOSST=['#3a2c1c','#5c4630','#7e6646','#a89070'],L45_SOIL='#4e3e2a';
/* the convex hull of screen points (the mat seen from any side) */
function l45Hull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}
  return lo.slice(0,-1).concat(up.slice(0,-1))}
/* the soft roundness of a velvet dome: one shared radial fill per colour, lit from the upper left */
const L45_MF={};function l45MosFill(c){const id=L45_MF[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l45m'+(gid++),P=pal7(c),gr=E('radialGradient',{id:nid,cx:.4,cy:.34,r:.72},defs);
  stops(gr,[[0,P.l1],[.42,P.b],[.78,P.d1],[1,P.d2]]);L45_MF[c]=nid;return`url(#${nid})`}
function l45Cush(par,B,O,Dm,op,cw){const det=DET>=1.5&&!LOD,kind=cw.k,P=pal7(cw.gl?mix(cw.c,'#c8d0b0',.12):cw.c),V=p=>V3.add(O,toV(B,p)),az=B[2][2],parts=[],Rb=Dm*.5*(.86+.14*op);
  /* the domes: bun moss a few round buns, mood moss more and taller tufts, sheet moss one broad flat carpet */
  const L=[];if(kind==='flat'){L.push({c:[0,0,0],r:Rb*.96,h:Rb*.2});if(!LOD)for(let i=0;i<2;i++){const a=R(0,6.283),d=Rb*R(.15,.4);L.push({c:[Math.cos(a)*d,Math.sin(a)*d,Rb*.04],r:Rb*R(.42,.58),h:Rb*.17})}}
  else{const n=LOD?3:kind==='mood'?9:R(5,7.99)|0;L.push({c:[0,0,-Rb*.1],r:Rb*(kind==='mood'?.44:.58),h:Rb*(kind==='mood'?.6:.56)});
    for(let i=1;i<n;i++){const a=i*2.4+R(-.3,.3),d=Rb*(i>5?R(.2,.3):R(.42,.54)),r=Rb*(kind==='mood'?R(.3,.38):R(.34,.44));L.push({c:[Math.cos(a)*d,Math.sin(a)*d,-r*.22],r,h:r*(kind==='mood'?R(1,1.15):R(.85,1))})}}
  /* the brown mat under them: its footprint round every dome, a thin prism of soil and rhizoids */
  const th=Dm*.045,ring=[];for(let i=0;i<24;i++){const t=i/24*6.283,u=[Math.cos(t),Math.sin(t)];let m=Rb*.3;for(const l of L){const cu=l.c[0]*u[0]+l.c[1]*u[1],dd=(l.r*.85)**2-(l.c[0]**2+l.c[1]**2-cu*cu);if(dd>0)m=Math.max(m,cu+Math.sqrt(dd))}ring.push([u[0]*m*R(.97,1.02),u[1]*m*R(.97,1.02)])}
  /* its top and bottom outlines and the strip of wall between them, all turned the same way (so they fill as one) */
  const tR=ring.map(([x,y])=>l45Q(V([x,y,-.2]))),bR=ring.map(([x,y])=>l45Q(V([x*.94,y*.94,-th]))),ar=P=>{let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1]}return a},
    pos=P=>ar(P)<0?P.slice().reverse():P,qd=[];for(let i=0;i<24;i++){const j=(i+1)%24;qd.push(pos([tR[i],tR[j],bR[j],bR[i]]))}
  const matD=smooth(pos(tR))+smooth(pos(bR))+qd.map(q=>'M'+q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z').join(''),zm=V([0,0,-th*.5])[2],PS=pal7(L45_SOIL);
  parts.push({z:zm+(az>=0?-1e4:1e4),fn:g=>{E('path',{d:matD,fill:toneAt(PS,az<0?.5:.42)},g);
    /* seen from below: the rhizoids and crumbs of soil */
    if(az<-.1&&!LOD){let d='';for(let i=0;i<(det?70:30);i++){const ia=rnd()*24|0,a=ia/24*6.283,q=Math.sqrt(rnd())*Math.hypot(ring[ia][0],ring[ia][1])*.8,p=l45Q(V([Math.cos(a)*q,Math.sin(a)*q,-th])),b=R(0,6.283),l=R(.8,2);d+=`M${f(p[0])},${f(p[1])}l${f(Math.cos(b)*l)},${f(Math.sin(b)*l)}`}
      E('path',{d,stroke:PS.l1,'stroke-width':.6,'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g)}}});
  /* the view direction in the cushion's frame, for the outline of each dome (its silhouette, cut flat where it sits on the mat) */
  const vL=[B[0][2],B[1][2],B[2][2]],Ld=V3.nz([LIGHT[0],-LIGHT[1],0]),sweep=R(0,6.283);
  for(const l of L){const S=[l.r,l.r,l.h],w=V3.nz([vL[0]/S[0],vL[1]/S[1],vL[2]/S[2]]),u1=V3.nz(Math.abs(w[2])<.9?V3.cr(w,[0,0,1]):V3.cr(w,[1,0,0])),u2=V3.cr(w,u1),n=det?40:26,
      fz=kind==='flat'?.05:.025,fq=kind==='mood'?9:kind==='flat'?7:13,ph=R(0,6),rim=[];
    for(let i=0;i<n;i++){const t=i/n*6.283,k=1+fz*Math.sin(fq*t+ph)+fz*.6*Math.sin(2.3*fq*t)+(kind==='flat'?.07*Math.sin(3*t+ph):0),q=V3.add(V3.sc(u1,Math.cos(t)*k),V3.sc(u2,Math.sin(t)*k)),
        p=[l.c[0]+q[0]*S[0],l.c[1]+q[1]*S[1],Math.max(0,l.c[2]+q[2]*S[2])];rim.push(l45Q(V(p)))}
    const top=V([l.c[0],l.c[1],l.c[2]+l.h*.8]),I=lightI(az>=0?B[2]:V3.sc(B[2],-1)),cx=rim.reduce((a,q)=>a+q[0],0)/n,cy=rim.reduce((a,q)=>a+q[1],0)/n,
      rr=Math.max(...rim.map(q=>Math.hypot(q[0]-cx,q[1]-cy))),tq=l45Q(top),ox=(tq[0]+cx)/2,oy=(tq[1]+cy)/2,sh=(k,o)=>rim.map(q=>[ox+(q[0]-ox)*k+Ld[0]*rr*o,oy+(q[1]-oy)*k+Ld[1]*rr*o]);
    /* the texture: points on the visible upper face of the dome, light ones toward the light, dark ones in its shade */
    const tex=(m,dark)=>{let d='';for(let i=0;i<m;i++){const a=R(0,6.283),s=Math.sqrt(rnd())*.86,qx=Math.cos(a)*s,qy=Math.sin(a)*s,qz=Math.sqrt(Math.max(0,1-s*s)),
        p=V([l.c[0]+qx*l.r,l.c[1]+qy*l.r,l.c[2]+qz*l.h]),nn=V3.nz(toV(B,[qx/l.r,qy/l.r,qz/l.h]));if(nn[2]<.05)continue;const lit=V3.dot(nn,LIGHT);if(dark?lit>.62:lit<.48)continue;
      const sp=l45Q(p);if(kind==='mood'){const b=sweep+qx*.6,l2=R(1.6,2.6),m2=[sp[0]+Math.cos(b)*l2*.5+Math.sin(b)*.5,sp[1]+Math.sin(b)*l2*.5-Math.cos(b)*.5];d+=`M${f(sp[0])},${f(sp[1])}Q${f(m2[0])},${f(m2[1])} ${f(sp[0]+Math.cos(b)*l2)},${f(sp[1]+Math.sin(b)*l2)}`}
      else if(kind==='flat'){const b=a+R(-.5,.5),l2=R(1.4,2.2),cb=Math.cos(b),sb=Math.sin(b);d+=`M${f(sp[0])},${f(sp[1])}l${f(cb*l2)},${f(sb*l2)}`;if(det)for(const s2 of[-1,1])d+=`M${f(sp[0]+cb*l2*.4)},${f(sp[1]+sb*l2*.4)}l${f((cb-sb*s2)*.6)},${f((sb+cb*s2)*.6)}`}
      else{const b=R(0,6.283),l2=R(.5,.9);d+=`M${f(sp[0])},${f(sp[1])}l${f(Math.cos(b)*l2)},${f(Math.sin(b)*l2)}`}}return d};
    const area=Math.PI*rr*rr,m=LOD?0:Math.min(det?260:90,Math.round(area/(det?3.2:7)));
    parts.push({z:top[2],fn:g=>{E('path',{d:smooth(rim),fill:toneAt(P,I*.62),stroke:P.ink,'stroke-width':det?.35:.4,'stroke-opacity':.38},g);if(LOD)return;
      E('path',{d:smooth(sh(.94,.05)),fill:l45MosFill(toneAt(P,I))},g);
      if(m){E('path',{d:tex(m,1),stroke:P.d2,'stroke-width':kind==='mood'?.6:.55,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g);
        E('path',{d:tex(Math.round(m*.8),0),stroke:cw.gl?'#e4ead2':P.l2,'stroke-width':kind==='mood'?.55:.5,'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g)}}})}
  drawParts(par,parts)}
function l45Moss(g,t,o){const cw=cwPick(CW_L45MOS,o),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||10)*UPC,k=G(g);
  /* on the lip of a vessel the cushion sits up, its top toward the eye */
  const ax=axOf(o),o2=Object.assign({},o,{ax:o.rim?V3.nz([ax[0]*.35,.75,.62]):V3.nz(V3.add(ax,[0,.9,0]))});
  const nk=g35Run(o2,'l45mos',()=>lsHeadS(k,o2,{D:Dm,w:Math.max(2.4,Dm*.035),op,cols:L45_MOSST,nodes:0,lp:.42,aimK:.4,wig:.01,e:0,flower:(par,B,P,D2,op2)=>l45Cush(par,B,P,D2,op2,cw)}));
  open(k,t,1000,0,.4);return nk}

/* ---------- pine (Pinus): woody shoots clothed by needles in bundles (fascicles) set in a tight spiral, each sheathed at its base; two needles in Scots pine (P. sylvestris, 4–7 cm, twisted,
   blue-green), black pine (P. nigra, 8–14 cm, stiff, dark green) and lodgepole pine (P. contorta, 4–6 cm, twisted), five soft fine ones in white pine (P. strobus, 8–13 cm, blue-green);
   the shoot ends in a whorl of resinous buds (in spring lengthening into pale « candles »); small ovoid cones, closed, their woody scales in crossing spirals (rhombic apophyses) ---------- */
const CW_L45PIN=[{id:'sylvestre',n:'Pin sylvestre (P. sylvestris) vert bleuté',c:'#5f8580',nn:2,ln:5.5,tw:.12,cone:.65,bark:'#9a5a36'},
  {id:'weymouth',n:'Pin de Weymouth (P. strobus) bleu-vert souple',c:'#7d8e80',nn:5,ln:10,tw:.04,dr:.3,cone:.2,bark:'#6a5a46'},
  {id:'noir',n:'Pin noir (P. nigra) vert foncé',c:'#4a7040',nn:2,ln:11,tw:.05,dr:.06,cone:.45,bark:'#5a4a3a'},
  {id:'contorta',n:'Pin tordu (P. contorta) vert profond',c:'#56683e',nn:2,ln:5,tw:.16,cone:.5,bark:'#6a4a32'}];
/* the needles of a grown shoot: fascicles along every axis (from where its leafy part starts), each its two or five needles spread from the twig, forward and round;
   drawn in pieces along the axis, each piece as three strokes — the needles behind the twig (shade), in front, and those turned to the light */
function l45Needles(res,parts,cw,S){const det=DET>=1.5&&!LOD,P=pal7(cw.c),cs=[toneAt(P,.36),toneAt(P,.58),toneAt(P,.8)],sw=det?1.1:1.2;
  for(const ch of res.chains){const pts=ch.pts,n=pts.length;if(n<2)continue;const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const Lc=cum[n-1],a0=ch.ord?Lc*.02:Lc*S.u0;if(Lc-a0<4)continue;
    const at=l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const u=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),w:ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*u}};
    const nf=Math.max(2,Math.round((Lc-a0)/S.sp)),K=det?14:22;let bins=['','',''],zs=0,zc=0,cnt=0;
    const flush=()=>{if(!cnt)return;const z=zs/zc,bb=bins;parts.push({z:z-.4,cast:false,fn:g=>{if(bb[0])E('path',{d:bb[0],stroke:cs[0],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g)}});
      parts.push({z:z+.4,cast:false,fn:g=>{if(bb[1])E('path',{d:bb[1],stroke:cs[1],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g);if(bb[2])E('path',{d:bb[2],stroke:cs[2],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g)}});bins=['','',''];zs=zc=cnt=0};
    for(let i=0;i<nf;i++){const l=a0+(Lc-a0)*(i+R(-.3,.3))/nf,q=at(Math.max(0,Math.min(Lc,l))),u=(l-a0)/(Lc-a0),[X,Y]=fgCross(q.T),az=(i*137.5+R(-12,12))*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),
        /* the needles shorter toward the growing tip, more erect there */
        Ln=S.ln*(u>.82?.45+.55*(1-u)/.18:1)*R(.86,1.1),th=(S.th+R(-8,8))*(u>.85?.6:1)*D,nn=det?cw.nn:Math.min(cw.nn,3);zs+=q.p[2];zc++;
      for(let j=0;j<nn;j++){const sp=(j-(nn-1)/2)*(nn>2?.32:.5)+R(-.08,.08),rk=V3.add(V3.sc(r,Math.cos(sp)),V3.sc(V3.cr(q.T,r),Math.sin(sp))),d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(rk,Math.sin(th)))),
          b=V3.add(q.p,V3.sc(rk,q.w*.3)),dr=(cw.dr||.1)*Ln,e=V3.add(V3.add(b,V3.sc(d,Ln)),[0,-dr,0]),tw=V3.sc(V3.cr(d,rk),Ln*cw.tw*(j%2?1:-1)),m=V3.add(V3.add(V3.add(b,V3.sc(d,Ln*.5)),[0,-dr*.3,0]),V3.sc(tw,.6));
        if(S.lim!=null&&Math.min(e[1],m[1])<S.lim)continue;
        const bin=e[2]<q.p[2]-Ln*.15?0:V3.dot(rk,LIGHT)>.25?2:1,B2=l45Q(b),M2=l45Q(m),E2=l45Q(e);bins[bin]+=`M${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(E2[0])},${f(E2[1])}`;cnt++}
      if(zc>=K)flush()}flush()}}
/* buds at a shoot's tip: a resinous terminal bud and its whorl of smaller ones; young (op low) they lengthen into pale candles, scaled */
function l45PinBuds(og,op,kl,cw){const H=V3.nz(og.H),[X,Y]=fgCross(H),cand=op<.62,Lb=(cand?(3.6-3*op)*UPC:1.1*UPC)*kl,rb=(cand?.3:.28)*UPC*kl,col=cand?'#c8b88a':mix(cw.bark,'#7a3a20',.4),P=pal7(col),out=[];
  const one=(b,d,L2,r2,zb)=>{const e=V3.add(b,V3.sc(d,L2)),sp=l45Spin(V3.add(b,V3.sc(d,-r2*.3)),e,t=>r2*(t<.2?.75+t*1.25:Math.pow(1-(t-.2)/.8,.7)),10,cand?.06:.1),I=lightI(V3.nz(V3.add(fgCross(d)[0],[0,0,.5])));
    out.push({z:(b[2]+e[2])/2+zb,cast:false,fn:g=>{E('path',{d:smooth(sp.P),fill:toneAt(P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);
      if(DET>=1.5&&!LOD){let d2='';for(let i=1;i<6;i++){const c=sp.C[i*2-1],r3=r2*.8;d2+=`M${f(c[0]-sp.nx*r3)},${f(c[1]-sp.ny*r3)}Q${f(c[0]+(sp.C[i*2][0]-c[0])*.8)},${f(c[1]+(sp.C[i*2][1]-c[1])*.8)} ${f(c[0]+sp.nx*r3)},${f(c[1]+sp.ny*r3)}`}
        E('path',{d:d2,stroke:P.d1,'stroke-width':.4,'stroke-opacity':.6,fill:'none'},g)}}})};
  one(og.pos,H,Lb,rb,.3);const nl=cand?3:(rnd()<.5?3:4);for(let i=0;i<nl;i++){const a=(i/nl*360+R(-20,20))*D,d=V3.nz(V3.add(V3.sc(H,1),V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),.55)));one(og.pos,d,Lb*R(.45,.65),rb*.8,d[2]>0?.2:-.2)}
  return out}
/* a small cone on its short stalk, turned back along the shoot: an ovoid of woody scales in crossing spirals, its outline toothed by them */
function l45Cone(og,kl,cw,op){const H=V3.nz(og.H),Lc=4.2*UPC*kl*R(.85,1.1),rc=Lc*.3,a=V3.nz(V3.add(V3.add(V3.sc(H,-.35),[0,-.85,0]),V3.sc(V3.nz(og.U),.2))),b=V3.add(og.pos,V3.sc(V3.nz(V3.add(H,[0,-.6,0])),.7*UPC*kl)),
    e=V3.add(b,V3.sc(a,Lc)),rf=t=>rc*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.08+.04)),.7)*(t<.4?1:1-.22*(t-.4)/.6),sp=l45Spin(b,e,rf,14,.07),col=op<.4?'#6a6a3a':'#7a5a3a',P=pal7(col),[X,Y]=fgCross(a);
  const sc=[];if(!LOD)for(let i=1;i<9;i++){const t=i/9,nc=7;for(let j=0;j<nc;j++){const ph=(j+(i%2)*.5)/nc*6.283,rd=V3.add(V3.sc(X,Math.cos(ph)),V3.sc(Y,Math.sin(ph)));if(rd[2]<.2)continue;
      const c=V3.add(V3.add(b,V3.sc(a,Lc*t)),V3.sc(rd,rf(t)*.92)),du=V3.sc(a,Lc*.055),dv=V3.sc(V3.cr(a,rd),rf(t)*.38);sc.push([V3.add(c,du),V3.add(c,dv),V3s(c,du),V3s(c,dv)])}}
  const st=[l45Q(og.pos),l45Q(b)];
  return[{z:(b[2]+e[2])/2,cast:false,fn:g=>{l45Line(g,st,1.6,shd(cw.bark,-.3));E('path',{d:smooth(sp.P),fill:toneAt(P,.5),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55},g);
    if(sc.length){let d='';for(const q of sc){const Q=q.map(l45Q);d+='M'+Q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}E('path',{d,fill:toneAt(P,.72),stroke:P.d2,'stroke-width':.45,'stroke-opacity':.7},g)}}}]}
const L45_PINST=c=>{const b=mix(c,'#4a3a2c',.45);return[shd(b,-.6),shd(b,-.3),b,shd(b,.35)]};
function l45Pin(g,t,o){const cw=fgCw(CW_L45PIN,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=10,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l45pin',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),cols=L45_PINST(cw.bark),lim=g35Lim(o);let nc=0,mc=rnd()<cw.cone?(rnd()<.35?2:1):0;
    const r=fgGrow(k,A,{li:2.4*UPC*kl,liT:.3,w0:6*kl,w1:1.6,cols,uL:2,lp:0,phy:'spiral',seg:9,wig:.03,tipLv:0,
      side:{u0:.22,u1:.78,p:.42,len:.42,ang:52,li:.9,e:-.01,tilt:22},
      axil:{u0:.3,p:.35,ang:105},
      tip:(og)=>l45PinBuds(og,op,kl,cw),
      axDraw:(og)=>{if(nc>=mc)return null;nc++;return l45Cone(og,kl,cw,op)},
      post:(res,parts)=>l45Needles(res,parts,cw,{u0:o.spine?.04:.24,sp:(cw.nn>2?.42:.3)*UPC*kl,ln:cw.ln*UPC*kl*(o.spine?.85:1),th:cw.nn>2?32:44,lim})});
    open(k,t,1000,0,.4);return r})}

/* ---------- loropetalum (Loropetalum chinense f. rubrum, Hamamelidaceae, « fringe flower »): spreading, finely hairy shoots, often zigzag; leaves alternate, two-ranked, small (2–5 cm),
   ovate with an oblique base and a short point, matt, deep purple to black-purple (the young growth ruby), paler beneath; in spring clusters of three to six flowers at the tips
   and in the upper axils, each of four narrow strap-shaped petals 1.5–2.5 cm long, crumpled and twisted like ribbons, fuchsia pink (white in the green type) ---------- */
const CW_L45LOR=[{id:'burgundy',n:'Pourpre (Burgundy)',c:'#4a2232',y:'#8a2a40',fl:'#d0407e'},{id:'fire-dance',n:'Bordeaux, fleurs fuchsia (Fire Dance)',c:'#5a1f2a',y:'#a02a3a',fl:'#d8307a',f:1},
  {id:'black-pearl',n:'Pourpre noir (Black Pearl)',c:'#2e1a1e',y:'#6a2232',fl:'#c83a78'},{id:'ruby',n:'Rubis cuivré (Ruby)',c:'#8a3a2a',y:'#b0402e',fl:'#e0508a'},
  {id:'everred',n:'Pourpre, fleurs rouges (Ever Red)',c:'#4a1c28',y:'#8a2030',fl:'#c8243c',f:1},{id:'vert',n:'Vert (L. chinense, fleurs crème)',c:'#5a6a3a',y:'#8a8a3a',fl:'#f2ead2'},
  {id:'emerald-snow',n:'Vert profond, fleurs blanches (Emerald Snow)',c:'#2f4a2e',y:'#5a7a3a',fl:'#f6f2e6',f:1}];
const L45_LORW=prof([[0,.42],[.08,.74],[.26,.98],[.42,1],[.62,.86],[.82,.5],[.94,.18],[1,0]]),
  L45_LORV=[[[0,0],[0,.97]],...[.16,.32,.48,.64].flatMap(y=>{const e=t=>.28*.78*L45_LORW(Math.min(1,y+.2*t))*t;return[1,-1].map(s=>[[0,y],[s*e(.5),y+.1],[s*e(1),y+.2]])})];
/* a cluster of flowers at the tip of a shoot or in an axil: on a short peduncle, each flower a tiny calyx and four ribbon petals (their width never under 1.1 on the screen);
   young, the petals still rolled together in a slender pink bud */
function l45LorFl(og,cw,op,kl,n0){const H=V3.nz(og.H),[X,Y]=fgCross(H),c0=V3.add(og.pos,V3.sc(H,.45*UPC*kl)),n=n0||(DET>=1.5?R(3,6.99)|0:R(3,4.99)|0),out=[],P=pal7(cw.fl),ped=[l45Q(og.pos),l45Q(c0)];
  out.push({z:c0[2]-.2,cast:false,fn:g=>l45Line(g,ped,1.4,'#5a3a2a')});
  for(let i=0;i<n;i++){const a=(i/n*360+R(-25,25))*D,fa=V3.nz(V3.add(V3.sc(H,.75),V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),.75))),c=V3.add(c0,V3.sc(fa,.35*UPC*kl)),
      ag=Math.max(0,Math.min(1,op*1.25-i*.06+R(-.1,.1))),Lp=(1.3+1*ag)*UPC*kl*R(.85,1.1),[fx,fy]=fgCross(fa),pa=[];
    if(ag<.35){/* the bud: four petals rolled into a spindle */const e=V3.add(c,V3.sc(fa,Lp*.55)),sp=l45Spin(c,e,t=>.55*UPC*kl*Math.pow(Math.sin(Math.PI*Math.min(1,t*.9+.1)),.8)*(1-.5*t),8),cb=mix(cw.fl,'#7a8a4a',.35*(1-ag));
      out.push({z:(c[2]+e[2])/2,cast:false,fn:g=>{l45Line(g,[l45Q(c0),l45Q(c)],1.2,'#5a3a2a');E('path',{d:smooth(sp.P),fill:toneAt(pal7(cb),.62),stroke:shd(cb,-.6),'stroke-width':.4,'stroke-opacity':.5},g)}});continue}
    const spr=(20+60*Math.min(1,(ag-.35)/.5))*D,ph=R(0,6.283);
    for(let j=0;j<4;j++){const b=ph+j*1.571+R(-.2,.2),rk=V3.add(V3.sc(fx,Math.cos(b)),V3.sc(fy,Math.sin(b))),d=V3.nz(V3.add(V3.sc(fa,Math.cos(spr)),V3.sc(rk,Math.sin(spr)))),sd=V3.nz(V3.cr(d,fa)),
        tw0=R(0,6.283),wv=R(.02,.04),bd=R(-.22,.22),C=[],W=[];
      for(let s=0;s<=8;s++){const t=s/8,p=V3.add(V3.add(V3.add(c,V3.sc(d,Lp*t)),V3.sc(sd,Lp*(wv*Math.sin(t*4.5+tw0)+bd*t*t))),[0,-Lp*.12*t*t,0]);C.push(l45Q(p));W.push(Math.max(.6,.2*UPC*kl*(t<.12?.55+t*3.7:1-.55*t*t)*(.45+.55*Math.abs(Math.cos(tw0+t*2.2)))))}
      const A2=[],B2=[];for(let s=0;s<=8;s++){const a2=C[Math.max(0,s-1)],b2=C[Math.min(8,s+1)],dx=b2[0]-a2[0],dy=b2[1]-a2[1],l=Math.hypot(dx,dy)||1;A2.push([C[s][0]-dy/l*W[s],C[s][1]+dx/l*W[s]]);B2.push([C[s][0]+dy/l*W[s],C[s][1]-dx/l*W[s]])}
      pa.push({P:A2.concat(B2.reverse()),fr:V3.dot(V3.cr(d,sd),[0,0,1])>=0,z:c[2]+d[2]*Lp*.5})}
    const front=pa.filter(q=>q.z>=c[2]),back=pa.filter(q=>q.z<c[2]),pd=L=>L.map(q=>smooth(q.P)).join('');
    if(back.length)out.push({z:c[2]-.15,cast:false,fn:g=>E('path',{d:pd(back),fill:toneAt(P,.48),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.45},g)});
    out.push({z:c[2]+.15,cast:false,fn:g=>{l45Line(g,[l45Q(c0),l45Q(c)],1.2,'#5a3a2a');if(front.length)E('path',{d:pd(front),fill:toneAt(P,.66),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.45},g);
      const q=l45Q(c);E('circle',{cx:f(q[0]),cy:f(q[1]),r:f(.2*UPC*kl),fill:shd(cw.fl,-.55)},g)}})}
  return out}
function l45Lor(g,t,o){const cw=fgCw(CW_L45LOR,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=4,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l45lor',()=>{const Lt=o.spine?blen(o.spine):45*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.14,.26)),sh=g35Prof(L45_LORW,.56),st=mix(cw.c,'#4a3020',.55),cols=[shd(st,-.6),shd(st,-.3),st,shd(st,.35)],
      fl=cw.f?1:.55,lim=g35Lim(o);
    const r=fgGrow(k,A,{li:(DET>=1.5?1.5:1.9)*UPC*kl,liT:.35,w0:3.2*kl,w1:.9,cols,uL:o.spine?.2:.22,phy:'alt2',la:58,face:.7,lift:.3,seg:9,wig:.06,
      side:{u0:.2,u1:.85,p:DET>=1.5?.6:.45,len:.42,ang:50,li:.75,e:-.008,tilt:25},axil:{u0:.55,p:.16*fl,ang:30},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.8))*(p.o?.85:1)*kl,L=cm0*UPC*sz*R(.85,1.12),young=u>.8?.3+.5*(1-op):0,c=mix(cw.c,cw.y,young),F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,L*.05));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.08,.08)),.5),mix(c,'#a8909a',.32),{lim,fold:.1,arch:.05,droop:.1,cup:.04,tw:R(-.3,.3),bend:R(-.06,.06),sm:1,dI:.02,
          veins:L45_LORV,vc:shd(c,.35),vw:.4,vo:.45})]},
      tip:(og,p)=>rnd()<.75*fl&&(lim==null||og.pos[1]>lim+6)?l45LorFl(og,cw,op,kl):null,
      axDraw:(og)=>lim==null||og.pos[1]>lim+6?l45LorFl(og,cw,op,kl,2+(rnd()<.5?1:0)):null});
    open(k,t,1000,0,.4);return r})}

/* ---------- black locust (Robinia pseudoacacia, Fabaceae, « faux acacia », « robinier »): zigzag shoots, a pair of sharp stipular spines at each node; leaves alternate,
   odd-pinnate, 15–30 cm, of 7–19 opposite oval leaflets (2–5 cm, rounded, often notched with a tiny point), soft green ('Frisia': golden yellow to chartreuse);
   in late spring hanging racemes (10–20 cm) of white, fragrant pea flowers: a reflexed standard with a yellow-green blotch, two wings, the keel; a bell-shaped calyx ---------- */
const CW_L45ROB=[{id:'vert',n:'Vert tendre (type)',c:'#6a9a3a'},{id:'frisia',n:'Doré (Frisia)',c:'#c8b43a',y:'#e0d050'},{id:'frisia-chartreuse',n:'Chartreuse (Frisia, été)',c:'#a8b440',y:'#d0d050'},
  {id:'fleuri',n:'Vert, grappes blanches (en fleurs)',c:'#5f8f3a',fl:'#f6f3ea',f:1},{id:'casque-rouge',n:'Vert, grappes rose pourpré (× margaretta Casque Rouge)',c:'#5a8a3a',fl:'#c8609a',f:1}];
const L45_ROBW=prof([[0,.4],[.1,.76],[.3,.97],[.5,1],[.72,.92],[.9,.62],[1,.28]]);
/* one compound leaf from its node: the rachis arching out and drooping, the leaflets in opposite pairs (the middle ones largest) and one at the tip, each a small 3D blade */
function l45RobLeaf(og,Ll,np,lf,c,lim){const H=og.H,U=og.U,dr=.22,at=t=>V3.add(V3.add(V3.add(og.pos,V3.sc(H,Ll*t)),V3.sc(U,Ll*.07*Math.sin(Math.PI*t))),[0,-dr*Ll*t*t,0]),
    P=pal7(c),PB=pal7(mix(c,'#c8d0b8',.35)),parts=[],ra=[],seg=[];
  for(let i=0;i<=16;i++)ra.push(at(i/16));if(lim!=null&&l45Low(ra)<lim)return null;
  const blade=(b,d,N,len)=>{const S=f15BladeS(b,d,N,len,len*.31,L45_ROBW,{arch:.03,fold:.14,droop:.1,tw:R(-.2,.2)});return lim!=null&&-f15Low(S)<lim?null:f15Blade(S,P,PB,{nv:DET>=1.5?7:5,mid:P.l1,mo:.4,mt:.8})};
  for(let i=0;i<=np;i++){const t=i<np?.16+.78*(i+.5)/np:1,p=at(t),T=V3.nz(V3s(at(Math.min(1,t+.02)),at(Math.max(0,t-.02)))),N0=V3.nz(V3s(U,V3.sc(T,V3.dot(U,T)))),Sd=V3.nz(V3.cr(N0,T)),
      q=i/Math.max(1,np-1),sz=(.82+.18*Math.sin(Math.PI*Math.min(1,q*1.1+.1)))*R(.9,1.08);
    if(i<np)for(const s of[-1,1]){const an=(78-18*q+R(-6,6))*D,d=V3.nz(V3.add(V3.sc(T,Math.cos(an)),V3.sc(Sd,s*Math.sin(an)))),N=V3.nz(V3.add(N0,V3.sc(Sd,-s*.18))),pt=blade(V3.add(p,V3.sc(d,.8)),d,N,lf*sz);if(pt)parts.push(pt)}
    else{const pt=blade(p,T,N0,lf*1.05);if(pt)parts.push(pt)}}
  const st=DET>=1.5?4:8;for(let i=0;i<16;i+=st){const P2=ra.slice(i,i+st+1).map(l45Q),z=ra.slice(i,i+st+1).reduce((a,q)=>a+q[2],0)/(st+1);parts.push({z:z-.05,cast:false,fn:g=>l45Line(g,P2,1.5-.025*i,shd(c,-.35))})}
  return parts}
/* a hanging raceme from an axil: its rachis falls under its weight, the flowers on short pedicels open from the base, buds at the tip */
function l45RobRac(og,cw,op,kl,lim){const H=V3.nz(og.H),Lr=R(11,16)*UPC*kl*(.75+.25*op),pts=[og.pos];let d=V3.nz(V3.add(H,[0,.1,0])),p=og.pos;
  for(let i=0;i<14;i++){d=V3.nz(V3.add(V3.sc(d,.76),[0,-.24,0]));p=V3.add(p,V3.sc(d,Lr/14));pts.push(p)}if(lim!=null&&l45Low(pts)<lim)return null;
  const out=[],P=pal7(cw.fl),Pc=pal7('#6a7a3a'),n=DET>=1.5?18:12,cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));
  const R2=pts.map(l45Q);out.push({z:pts.reduce((a,q)=>a+q[2],0)/pts.length-.3,cast:false,fn:g=>l45Line(g,R2,1.4,'#5a6a32')});
  for(let i=0;i<n;i++){const q=i/(n-1),l=Lr*(.12+.86*q),j=Math.min(pts.length-1,Math.max(1,cum.findIndex(c=>c>=l))),base=pts[j],T=V3.nz(V3s(pts[j],pts[j-1])),[X,Y]=fgCross(T),a=(i*137.5+R(-20,20))*D,
      rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),ag=Math.max(0,Math.min(1,op*1.3-q*.9+R(-.08,.08))),sz=(.85+.55*ag)*UPC*kl,fa=V3.nz(V3.add(V3.sc(rd,.8),[0,-.55,0])),
      c=V3.add(base,V3.sc(fa,sz*1.1)),ped=[l45Q(base),l45Q(c)];
    if(ag<.3){const e=V3.add(c,V3.sc(fa,sz*.9)),sp=l45Spin(V3.add(c,V3.sc(fa,-sz*.15)),e,t=>sz*.42*Math.pow(Math.sin(Math.PI*Math.min(1,t*.92+.08)),.8),8),cb=mix(cw.fl,'#a8b878',.45*(1-ag));
      out.push({z:c[2],cast:false,fn:g=>{l45Line(g,ped,1.15,'#6a7a3a');E('path',{d:smooth(sp.P),fill:toneAt(pal7(cb),.64),stroke:shd(cb,-.55),'stroke-width':.35,'stroke-opacity':.5},g)}});continue}
    /* the open flower: calyx, keel and wings along its axis (forward and down), the standard turned up behind them */
    const kd=V3.nz(V3.add(fa,[0,-.2,0])),up=V3.nz(V3.add(V3.sc(fa,-.35),[0,1,0])),std=V3.add(c,V3.sc(up,sz*.45)),kc=V3.add(c,V3.sc(kd,sz*.62)),
      sP=l45Sph(std,V3.nz(V3.add(V3.sc(fa,.7),V3.sc(up,.3))),sz*.12,sz*.78*(.7+.3*ag),DET>=1.5?16:11,t=>1-.12*Math.max(0,Math.cos(t*2))),
      kP=l45Sph(kc,kd,sz*.62,sz*.3,DET>=1.5?14:10),cP=l45Sph(V3.add(c,V3.sc(fa,-sz*.3)),fa,sz*.26,sz*.2,8),Is=lightI(V3.nz(V3.add(fa,[0,.2,.4]))),fr=fa[2]>-.3;
    out.push({z:c[2]+(fr?.1:-.1),cast:false,fn:g=>{l45Line(g,ped,1.15,'#6a7a3a');const st=()=>{E('path',{d:smooth(sP),fill:toneAt(P,Is),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.4},g);
        if(DET>=1.5&&!LOD&&fr){const q2=l45Q(V3.add(c,V3.sc(up,sz*.3)));E('ellipse',{cx:f(q2[0]),cy:f(q2[1]),rx:f(sz*.2),ry:f(sz*.13),fill:'#c8c860',opacity:.75},g)}};
      const cx=()=>E('path',{d:smooth(cP),fill:toneAt(Pc,.6),stroke:Pc.ink,'stroke-width':.3,'stroke-opacity':.5},g);if(fr){cx();st()}E('path',{d:smooth(kP),fill:toneAt(P,Is*.9),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.45},g);if(!fr){cx();st()}}})}
  return out}
function l45Rob(g,t,o){const cw=fgCw(CW_L45ROB,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=3.5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l45rob',()=>{const Lt=o.spine?blen(o.spine):48*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.12,.22)),cols=['#3a2a1e','#5a4430','#7e6448','#a48a6a'],lim=g35Lim(o);let nr=0;const mr=cw.fl?4:0;
    const r=fgGrow(k,A,{li:(DET>=1.5?2.8:3.3)*UPC*kl,liT:.3,w0:4*kl,w1:1.3,cols,uL:o.spine?.12:.2,phy:'spiral',la:52,face:.6,lift:.35,seg:10,wig:.03,tipLv:0,node:1,
      side:{u0:.3,u1:.7,p:.3,len:.4,ang:42,li:.9,e:-.006,tilt:20},axil:cw.fl?{u0:.3,p:.6,ang:40}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.55:fgSz(p,.78))*(p.o?.8:1)*kl,np=Math.max(2,Math.round((DET>=1.5?6:5)*Math.min(1,sz+.15))),young=u>.75?.35+.4*(1-op):0,c=mix(cw.c,cw.y||mix(cw.c,'#c8d870',.4),young);
        return l45RobLeaf(og,cm0*UPC*3.6*sz*R(.9,1.1),np,cm0*UPC*sz*R(.9,1.08),mix(c,shd(c,R(-.06,.06)),.5),lim)},
      /* the stipular spines: a pair of sharp red-brown thorns at each node, from the twig */
      nodeDraw:(og)=>{const H=V3.nz(og.H),[X]=fgCross(H),sp=[],w=og.w||2,ln=.55*UPC*kl;for(const s of[-1,1]){const d=V3.nz(V3.add(V3.sc(X,s),V3.sc(H,.45))),b=og.pos,e=V3.add(b,V3.sc(d,ln+w*.4));
          sp.push([l45Q(V3.add(b,V3.sc(H,w*.55))),l45Q(e),l45Q(V3.add(b,V3.sc(H,-w*.55)))])}if(lim!=null&&og.pos[1]<lim+4)return null;
        return{z:og.pos[2]+.05,cast:false,fn:g=>E('path',{d:sp.map(q=>'M'+q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z').join(''),fill:'#6a3424',stroke:'#3a1a12','stroke-width':.3,'stroke-opacity':.6},g)}},
      axDraw:(og)=>{if(nr>=mr)return null;const rc=l45RobRac(og,cw,op,kl,lim);if(rc)nr++;return rc}});
    open(k,t,1000,0,.4);return r})}

/* ---------- privet (Ligustrum vulgare, L. ovalifolium, Oleaceae, « troène »): stiff grey-brown shoots; leaves opposite, decussate, elliptic to lance-shaped (3–6 cm), dark green, a little glossy;
   at the tip a dense pyramidal panicle (4–8 cm) of glossy round berries (6–8 mm) on short pedicels, ripening from green through violet to blue-black, under a faint bloom;
   smaller panicles in the upper axils. Grown by the berry engine of lot 20 (bzShoot, bzGrow, bzFruit, bzBlade) ---------- */
const CW_L45LIG=[{id:'noir',n:'Noir bleuté (baies mûres)',c:'#1e1f2b',g:'#7a9a40',y:'#5a3a5a'},{id:'bleu-noir',n:'Bleu-noir pruiné',c:'#2c3248',g:'#7a9a40',y:'#4a4a6a',bl:1},
  {id:'vert',n:'Vert (baies vertes)',c:'#8fb04a',g:'#8fb04a',y:'#9ab850'},{id:'mi-mur',n:'Vert et violine (mi-mûr)',c:'#4a2a4a',g:'#8aa848',y:'#7a4a6a',mx:1}];
/* the axes of a grown panicle: its stout rachis as the engine's shaded pieces, the fine pedicels as one stroke per panicle, behind its berries (few elements for many berries) */
function l45Axes(res,cols,parts){const fine=res.chains.filter(c=>c.ord>0&&Math.max(...c.ws)<1.35),thick=res.chains.filter(c=>!fine.includes(c));lsChainParts(thick,[0,0,0],cols,parts,{piece:4});
  if(!fine.length)return;let z=0,n=0,d='';for(const c of fine){d+='M'+c.pts.map(q=>f(q[0])+','+f(-q[1])).join('L');for(const q of c.pts){z+=q[2];n++}}
  parts.push({z:z/n-1.5,cast:false,fn:g=>E('path',{d,stroke:cols[1],'stroke-width':1.15,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)})}
function l45Lig(g,t,o){const cw=cwPick(CW_L45LIG,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||6)*UPC,sc=['#2e2a24','#544c42','#7e766a','#a8a094'],lc='#1c3018',dt=DET>=1.5,
    br=.36*UPC*Math.max(.85,Math.min(1.15,C/(6*UPC)))**.4;
  return bzShoot(g,t,o,{Lt:C*4.4,w0:3.4,w1:1.5,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* a panicle: opposite pairs of side branches shortening to the top, each a little cyme of berries on pedicels, a berry crowning every axis */
    const twig=(n,lv)=>{const out=[['F',{l:br*R(.7,1.05),w1:1.15}]];if(n>0)for(const s of[1,-1])out.push(['[',{w:1.15}],['+',{a:s*(42+R(-8,8))}],...twig(n-1,lv+1),[']',{}]);out.push(['F',{l:br*.6,w1:1.1}],['B',{age:lv}]);return out};
    const pan=(nl,len)=>{const out=[];for(let i=0;i<nl;i++){const q=i/nl;out.push(['F',{l:len*(.2-.08*q),w1:Math.max(1.15,1.8-.6*q)}],['/',{a:90+R(-12,12)}]);
        for(const s of[0,180])out.push(['[',{w:1.3}],['/',{a:s}],['&',{a:R(48,62)}],['F',{l:len*(.16*(1-q)+.03),w1:1.15}],...twig(q<.5?2:1,1),[']',{}])}
      out.push(['F',{l:len*.1,w1:1.15}],...twig(1,0));return out};
    const organ=(og)=>{if(og.t!=='B')return;const m=cw.mx?Math.max(0,Math.min(1,op*.9+R(-.45,.25))):Math.max(0,Math.min(1,op*1.3-og.p.age*.08+R(-.08,.04))),
        s=.78+.22*Math.min(1,op*1.4),rr=br*s*R(.9,1.08),ax=V3.nz(V3.add(og.H,[0,.15,0])),O=V3.add(og.pos,V3.sc(ax,rr*.8)),col=bzRipe(cw,m);
      parts.push({z:O[2],fn:par=>{bzFruit(par,O,ax,rr,rr*.98,col,{gl:cw.bl&&m>.8?.55:.85,eye:dt?(q,tp,a,r2)=>E('circle',{cx:f(tp[0]-a[0]*r2*.1),cy:f(tp[1]+a[1]*r2*.1),r:f(r2*.14),fill:'#1a1610',opacity:.7},q):null});
        if(cw.bl&&m>.8&&!LOD)E('ellipse',{cx:f(O[0]),cy:f(-O[1]),rx:f(rr*.95),ry:f(rr*.93),fill:'#a8b4d0',opacity:.18},par)}})};
    const top=bzGrow(A,L-.5,0,3,pan(dt?6:5,C*1.05),{w:1.9,seg:br*.8,T:[0,1,0],e:.015,wig:.03});l45Axes(top,sc,parts);for(const og of top.organs)organ(og);
    /* below: decussate leaf pairs, a smaller panicle in one or two of the upper axils */
    const nodes=7,dl=C*.4;for(let i=0;i<nodes;i++){const l=L-C*.62-dl*i*(1+.1*i);if(l<l0+6)continue;const ph=(i%2?90:0)+R(-10,10);
      for(const sd of[0,180]){const az=(ph+sd)*D;if(i<2&&rnd()<(i?.35:.6)){const bq=bzGrow(A,l,az,40+R(-6,6),[['F',{l:C*R(.25,.4),w1:1.5}],...pan(dt?3:2,C*.65)],{w:1.6,seg:br*.8,T:[0,1,0],e:.03,wig:.04});l45Axes(bq,sc,parts);for(const og of bq.organs)organ(og)}
        const f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),H=V3.nz(V3.add(V3.sc(f0.T,.55),r)),len=C*R(.72,.92)*(1-.1*Math.max(0,1-i));
        parts.push(bzBlade(V3.add(f0.p,V3.sc(r,1.1)),H,f0.T,len,.36,mix(lc,shd(lc,R(-.08,.1)),.5),{wp:LS_LANCE,droop:.16,arch:.06,fold:.2,vn:5,gloss:.6,face:.5}))}}}})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the cushion's width; for the pine a scale of its needles; the leaf or leaflet length; the berry panicle),
   and how the composer treats them: the moss a low head that sits on the lip of the vessel (rim), the three foliages stems along their spine, the privet a berry stem ---------- */
Object.assign(GH,{'mousses-fraiches':l45Moss,'pinus-pins':l45Pin,'loropetalum':l45Lor,'robinier':l45Rob,'troene-a-baies':l45Lig});
Object.assign(CWS,{'mousses-fraiches':CW_L45MOS,'pinus-pins':CW_L45PIN,'loropetalum':CW_L45LOR,'robinier':CW_L45ROB,'troene-a-baies':CW_L45LIG});
Object.assign(SZG,{'mousses-fraiches':[6,8,10,10,12],'pinus-pins':[8,10,10,12],'loropetalum':[3,4,4,5],'robinier':[3,3.5,3.5,4.5],'troene-a-baies':[5,6,6,7]});
const L45_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'mousses-fraiches':{form:'sphere',size:2,k:'head',rk:1,rim:1},'pinus-pins':L45_I(50,{fx:22}),'loropetalum':L45_I(45,{fx:16}),'robinier':L45_I(48,{fx:24}),
  'troene-a-baies':{form:'baie',size:1.2,k:'plant',rk:.85,tip:.8}});
