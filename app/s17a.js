/* ================= Serre, lot 17 — champêtres, grandis par le L-système : carotte sauvage (Daucus carota 'Dara'), ammi (majus et visnaga), sanguisorbe, célosie crête-de-coq, célosie plumeuse ================= */
/* ---------- shared pieces ---------- */
/* a tiny round dot as one sub-path (florets, anthers, fruits): many of them share one path */
const chpDot=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a projected circle as one sub-path: centre c (screen) and its two radii e1, e2 as screen vectors (the ellipse they span, never thinner than rmin) */
function chpEll(c,e1,e2,rmin=.3){const a=e1[0]*e1[0]+e2[0]*e2[0],b=e1[0]*e1[1]+e2[0]*e2[1],d=e1[1]*e1[1]+e2[1]*e2[1],h=Math.sqrt(Math.max(0,(a-d)*(a-d)/4+b*b)),l1=(a+d)/2+h,l2=Math.max(0,(a+d)/2-h),
    an=Math.abs(b)>1e-9?Math.atan2(l1-a,b):(a>=d?0:Math.PI/2),rx=Math.max(rmin,Math.sqrt(l1)),ry=Math.max(rmin,Math.sqrt(l2)),ux=Math.cos(an)*rx,uy=Math.sin(an)*rx,dg=f(an/D);
  return`M${f(c[0]+ux)},${f(c[1]+uy)}A${f(rx)},${f(ry)} ${dg} 1,0 ${f(c[0]-ux)},${f(c[1]-uy)}A${f(rx)},${f(ry)} ${dg} 1,0 ${f(c[0]+ux)},${f(c[1]+uy)}Z`}
/* the outline of a round tube along screen points C with radii rs, its ends rounded (caps: 1 base, 2 tip): a burnet head, a plume, the rolled ridge of a crest */
function chpTube(C,rs,caps=3){const n=C.length-1,Lf=[],Rt=[],ds=[];let last=[0,-1];
  for(let i=0;i<=n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);const d=l>1e-6?[dx/l,dy/l]:last;ds.push(d);last=d}
  for(let i=0;i<=n;i++){const[dx,dy]=ds[i],r=rs[i];Lf.push([C[i][0]-dy*r,C[i][1]+dx*r]);Rt.push([C[i][0]+dy*r,C[i][1]-dx*r])}
  const arc=(c,a0,r)=>{const q=[];for(let k=1;k<8;k++){const a=a0-Math.PI*k/8;q.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r])}return q},ea=Math.atan2(ds[n][1],ds[n][0]),sa=Math.atan2(ds[0][1],ds[0][0]);
  return Lf.concat(caps&2?arc(C[n],ea+Math.PI/2,rs[n]):[],Rt.reverse(),caps&1?arc(C[0],sa-Math.PI/2,rs[0]):[])}
/* a stem laid along the composer's spine (or standing in the frame of the view on a sheet), wandering a little round it: its points in view space (y up) and its frames */
function chpAxis(o,Lt,opt={}){const A0=spAxis(o,Lt,opt),N=opt.n||40,amp=opt.amp||0,nw=opt.nw||1.5,p1=R(0,6.28),p2=R(0,6.28),P=[];
  for(let i=0;i<=N;i++){const s=i/N,fr=A0.at(s),env=Math.pow(Math.sin(Math.PI/2*Math.min(1,s/(opt.e0||.3))),1.5),w1=Math.sin(6.283*nw*s+p1)+.35*Math.sin(6.283*nw*2.6*s+p2),w2=.6*Math.cos(6.283*nw*.8*s+p2);
    P.push(V3.add(fr.p,V3.add(V3.sc(fr.Sd,w1*amp*env),V3.sc(fr.Fr,w2*amp*env))))}
  const cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[N]||1;
  const loc=l=>{l=Math.max(0,Math.min(L,l));let i=1;while(i<N&&cum[i]<l)i++;return[i-1,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1))]},
    cb=s=>{const[i,t]=loc(s*L);return V3.add(P[i],V3.sc(V3s(P[i+1],P[i]),t))},
    at=s=>{const d=Math.min(.05,3/L),p=cb(s),T=V3.nz(V3s(cb(Math.min(1,s+d)),cb(Math.max(0,s-d))));let Fr=A0.at(s).Fr;Fr=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));if(V3l(Fr)<1e-6)Fr=Math.abs(T[2])<.9?[0,0,1]:[1,0,0];Fr=V3.nz(Fr);return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  return{P,L,cb,at,sOf:l=>Math.max(0,Math.min(1,l/L)),A0}}
/* the main stem of a plant laid on its axis, as pieces in the painter's order (cuts: fractions of its length), tapered from w0 to w1 */
function chpStem(A,parts,cuts,w0,w1,cols){for(let j=0;j<cuts.length-1;j++){const a=cuts[j],b=cuts[j+1];if(b-a<1e-3)continue;const P=[],W=[];let z=0;const n=Math.max(3,Math.round((b-a)*40));
  for(let i=0;i<=n;i++){const s=a+(b-a)*i/n,p=A.cb(s);P.push([p[0],-p[1]]);W.push(w0+(w1-w0)*s);z+=p[2]}parts.push({z:z/(n+1)-.02,fn:par=>stemPoly(par,P,W,cols)})}}
/* a thin axis (a branch, a pedicel) as one tapered ribbon, lit on one side: polyline P3 in view space */
function chpTwig(par,P3,w0,w1,cols){const P=P3.map(p=>[p[0],-p[1]]),n=P.length-1,wf=i=>(w0+(w1-w0)*i/n)/2;E('path',{d:polyRibbon(P,wf),fill:cols[1]},par);if(!LOD&&w0>1.3)E('path',{d:polyRibbon(P,i=>wf(i)*.4,i=>wf(i)*.45),fill:cols[2],opacity:.7},par)}
/* ---------- leaves ---------- */
/* a finely cut leaf (carrot, ammi): a sheathing petiole, a rachis with pairs of pinnae, each cut again into narrow lobes; o.lw lobe width (×len), o.np pinnae pairs, o.nl lobes a side, o.sw sheath width */
function chpCutLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),sh=o.sh??.14,bend=(o.bend??R(-.14,.14))*len,np=o.np||4,nl=o.nl||3,
    at=t=>[len*t,bend*t*t],ta=t=>Math.atan2(2*bend*t,len),sw=o.sw||len*.06,rw=Math.max(.5,len*.016);
  /* the sheath clasping the stem, then the bare petiole */
  const s1=at(sh);E('path',{d:`M0,${f(-sw/2)}Q${f(len*sh*.5)},${f(-sw*.42)} ${f(s1[0])},${f(s1[1]-rw/2)}L${f(s1[0])},${f(s1[1]+rw/2)}Q${f(len*sh*.5)},${f(sw*.42)} 0,${f(sw/2)}Z`,fill:toneAt(P,.66),stroke:P.d1,'stroke-width':.35,'stroke-opacity':.6},g);
  let dm=`M${f(s1[0])},${f(s1[1])}`;for(let i=1;i<=8;i++){const p=at(sh+(1-sh)*i/8);dm+=`L${f(p[0])},${f(p[1])}`}let dl='';
  const lob=(px,py,a,l,s)=>{/* one pinna: its midrib and its narrow lobes, alternate, angled forward */let d=`M${f(px)},${f(py)}l${f(Math.cos(a)*l)},${f(Math.sin(a)*l)}`,q='';
    for(let j=0;j<nl;j++){const u=(j+.6)/(nl+.4),bx=px+Math.cos(a)*l*u,by=py+Math.sin(a)*l*u,ll=l*(o.ll??.32)*(1-.45*u);for(const ss of[-1,1]){if(j===0&&ss===s&&nl>2)continue;const b=a+ss*(o.la??.7);q+=`M${f(bx)},${f(by)}l${f(Math.cos(b)*ll)},${f(Math.sin(b)*ll)}`}}
    q+=`M${f(px+Math.cos(a)*l)},${f(py+Math.sin(a)*l)}l${f(Math.cos(a)*l*.16)},${f(Math.sin(a)*l*.16)}`;return[d,q]};
  for(let k=0;k<np;k++){const t=sh+(1-sh)*(.08+.82*k/Math.max(1,np-1)),p=at(t),a0=ta(t),l=len*(o.pl??.36)*(1-.55*k/Math.max(1,np))*R(.9,1.08);
    for(const s of[-1,1]){const tt=Math.min(.98,t+(s>0?.035:0)),pp=at(tt),[d,q]=lob(pp[0],pp[1],a0+s*(o.pa??.95)*R(.88,1.1),l,s);dm+=d;dl+=q}}
  const e=at(1),[d,q]=lob(e[0],e[1],ta(1),len*.14,1);dm+=d;dl+=q;
  E('path',{d:dm,stroke:P.d1,'stroke-width':f(rw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
  E('path',{d:dl,stroke:toneAt(P,.62),'stroke-width':f(Math.max(.6,len*(o.lw??.03))),fill:'none','stroke-linecap':'round'},g);
  if(!LOD&&DET>=1.5)E('path',{d:dl,stroke:P.l1,'stroke-width':f(Math.max(.25,len*(o.lw??.03)*.3)),'stroke-opacity':.5,fill:'none','stroke-linecap':'round',transform:'translate(-.25,-.3)'},g);return g}
/* a lanceolate leaf in 3D on a node (celosias): blade along H, width across, arched, folded on its midrib, drooping; both halves toned by their own facing, no gradient */
function chpLeaf3(og,pos,len,wr,col,o={}){const S=lsLeafS(Object.assign({},og,{pos}),len,wr,{wp:o.wp||LS_LANCE,droop:o.droop??.22,arch:o.arch??.1,fold:o.fold??.28,tw:o.tw??R(-.4,.4),face:o.face??.35}),n=10,Lp=[],Mp=[],Rp=[];
  for(let i=0;i<=n;i++){const v=i/n,a=S(-1,v),m=S(0,v),b=S(1,v);Lp.push([a[0],-a[1],a[2]]);Mp.push([m[0],-m[1],m[2]]);Rp.push([b[0],-b[1],b[2]])}
  const nrm=s=>{const a=S(0,.5),b=S(s,.5),c=S(0,.62),u=V3s(b,a),v=V3s(c,a);let nn=V3.nz(V3.cr(u,v));return s<0?nn:V3.sc(nn,-1)};/* toward the upper face of the blade */let z=0;for(const p of Mp)z+=p[2];z/=Mp.length;
  return{z,cast:false,fn:par=>{const P=pal7(col),PB=pal7(mix(shd(col,.15),'#b8c8a0',.3)),g=G(par);
    for(const[side,s]of[[Lp,-1],[Rp,1]]){let nn=nrm(s);const back=nn[2]<0;if(back)nn=V3.sc(nn,-1);const I=lightI(nn)*(back?.85:1),pp=side.map(p=>[p[0],p[1]]).concat(Mp.slice().reverse().map(p=>[p[0],p[1]]));
      E('path',{d:smooth(pp),fill:toneAt(back?PB:P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.45,'stroke-linejoin':'round'},g)}
    if(!LOD)E('path',{d:smooth(Mp.slice(0,n).map(p=>[p[0],p[1]]),false),stroke:P.l1,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.55,fill:'none'},g)}}}
/* an odd-pinnate leaf with toothed oval leaflets (burnet): a rachis, pairs of stalked leaflets and one at its tip; leaflets in one path, their shaded halves in another */
function chpPinLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),pairs=o.pairs||4,bend=R(-.08,.08)*len,at=t=>[len*t,bend*t*t];
  let dr=`M0,0`;for(let i=1;i<=8;i++){const p=at(i/8);dr+=`L${f(p[0])},${f(p[1])}`}let dl='',ds='',dv='';
  const leaflet=(cx,cy,a,l,w)=>{/* a toothed oval from its stalk at (cx,cy) along a */const n=14,ca=Math.cos(a),sa=Math.sin(a),pts=[],mid=[];
    for(let i=0;i<=n;i++){const t=i/n,ww=w*Math.pow(Math.sin(Math.PI*Math.min(.97,.04+t*.96)),.8)*(1-.15*t),tooth=1+(i%2?.12:-.04);pts.push([t*l,-ww*tooth])}
    for(let i=n;i>=0;i--){const t=i/n,ww=w*Math.pow(Math.sin(Math.PI*Math.min(.97,.04+t*.96)),.8)*(1-.15*t),tooth=1+(i%2?.12:-.04);pts.push([t*l,ww*tooth*.92])}
    const tr=p=>[cx+p[0]*ca-p[1]*sa,cy+p[0]*sa+p[1]*ca],O=pts.map(tr);dl+='M'+O.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z';
    const H=pts.slice(n+1).map(tr);ds+='M'+tr([0,0]).map(f).join(',')+'L'+H.map(p=>f(p[0])+','+f(p[1])).join('L')+'L'+tr([l,0]).map(f).join(',')+'Z';const a0=tr([l*.04,0]),a1=tr([l*.9,0]);dv+=`M${f(a0[0])},${f(a0[1])}L${f(a1[0])},${f(a1[1])}`};
  for(let i=0;i<pairs;i++){const t=.18+.66*i/Math.max(1,pairs-1),p=at(t),l=len*(.24+.06*i/pairs)*R(.9,1.08),w=l*.34;for(const s of[-1,1]){const a=s*(.95+R(-.12,.12)),st=len*.03;dr+=`M${f(p[0])},${f(p[1])}l${f(Math.cos(a)*st)},${f(Math.sin(a)*st)}`;leaflet(p[0]+Math.cos(a)*st,p[1]+Math.sin(a)*st,a+s*-.25,l,w)}}
  const e=at(1);leaflet(e[0],e[1],0,len*.26,len*.09);
  E('path',{d:dr,stroke:P.d1,'stroke-width':f(Math.max(.5,len*.018)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:dl,fill:toneAt(P,.6),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.5,'stroke-linejoin':'round'},g);if(!LOD){E('path',{d:ds,fill:P.d1,opacity:.35},g);E('path',{d:dv,stroke:P.l1,'stroke-width':.4,'stroke-opacity':.55,fill:'none'},g)}return g}
/* ---------- a compound umbel (Apiaceae): primary rays from the top of the peduncle to the umbellets, each a little dome of tiny florets (the outer florets of the outer umbellets larger:
   zygomorphic), the involucre of cut bracts under it. It opens from a closed nest (the bud) through a cup to a flat or domed lace, and folds again into a bird's nest when it fruits.
   Florets are grouped in a few paths (far half then near half; outer and inner colour), each umbellet on a shaded cushion so none floats; rays and bracts are strokes.
   Bu: its frame (z up its axis), O: the top of its peduncle (view space), Ru: its radius open, a: its age 0..1, cw: colourway, U: the species ---------- */
function chpUmbel(k,Bu,O,Ru,a,cw,U){const nest=!!cw.nest,q=nest?.6:sm01((a-.08)/.82),det=DET>=1.5,lod=LOD?.6:1,
    nR=Math.max(7,Math.round(U.nR*(det?1:.72)*lod)),nF=Math.max(4,Math.round(U.nf*(det?1:.5)*lod)),
    Rs=Ru*(nest?.6:.2+.8*q),kap=nest?.92:q<.5?.32:LERP(.32,U.dome,(q-.5)/.5),H0=Ru*(nest?.32:.2+.18*q),ru0=Ru*U.ruK*(nest?.8:.52+.48*q),rot=R(0,6.283),
    tb=nest?1:sm01((q-.12)/.36),Rb=Ru*(.16+.1*q),Hb=Ru*.16+Rb,
    el=toV(Bu,[0,0,1])[2],bc=cw.bud||U.bud||'#8aa060',cO=nest?cw.c:mix(cw.c,bc,(1-q)*.45),cI=nest?shd(cw.c,-.15):mix(cw.c2||cw.c,bc,(1-q)*.45),g=G(k);
  /* the umbellets: in bud packed into a ball wrapped by the outer ones; opening, on the surface z = H0 + kap·Rs·ρ² (kap > 0 a cup, < 0 a dome), each facing along its surface */
  const um=[];for(let i=0;i<nR;i++){const rho=Math.min(1,Math.sqrt((i+.6)/nR)*R(.95,1.02)),ph=i*2.39996+rot+R(-.1,.1),cp=Math.cos(ph),sp=Math.sin(ph),th=rho*1.9,
      nS=V3.nz([-2*kap*rho*cp,-2*kap*rho*sp,1]),nB=[Math.sin(th)*cp,Math.sin(th)*sp,Math.cos(th)],n=V3.nz(V3.add(V3.sc(nB,1-tb),V3.sc(nS,tb))),ru=ru0*(.82+.3*rho)*R(.9,1.08),
      PS=[rho*Rs*cp,rho*Rs*sp,H0+kap*Rs*rho*rho],PB=[Rb*Math.sin(th)*cp,Rb*Math.sin(th)*sp,Hb+Rb*Math.cos(th)],C=V3.add(V3.add(V3.sc(PB,1-tb),V3.sc(PS,tb)),V3.sc(n,ru*.12));
    um.push({i,rho,n,ru,C,nV:toV(Bu,n),z:PJ(Bu,O,C)[2],col:rho<.5&&(cw.c2||nest)?1:0})}
  /* rays: quadratic curves from the top of the peduncle, bowed outward in the cup and the nest */
  const bx=nest?1.08:LERP(.4,LERP(.95,.42,q),tb),bz=nest?.26:LERP(.8,LERP(.3,.62,q),tb),rw=Math.max(.55,Ru*.011),r0=PJ(Bu,O,[0,0,Ru*.015]);
  for(const u of um){const Pb=V3s(u.C,V3.sc(u.n,u.ru*.42)),c=PJ(Bu,O,[Pb[0]*bx,Pb[1]*bx,Pb[2]*bz]),e=PJ(Bu,O,Pb);u.ray=`M${f(r0[0])},${f(r0[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`}
  /* the involucre: bracts cut into narrow lobes, clasping the bud, spreading or turned down under the open umbel */
  const brs=[];if(U.br){const b=U.br,nb=Math.max(3,Math.round(b.n*(det?1:.8)*lod));for(let j=0;j<nb;j++){const th=j/nb*6.283+rot*.7+R(-.15,.15),be=(nest?20:LERP(64,b.el,q))*D+R(-.12,.12),
      Lb=Ru*b.len*R(.8,1.15)*(nest?.85:.8+.2*q),dir=[Math.cos(th)*Math.cos(be),Math.sin(th)*Math.cos(be),Math.sin(be)],tg=[-Math.sin(th),Math.cos(th),0],b0=[Math.cos(th)*Ru*.03,Math.sin(th)*Ru*.03,-Ru*.02],
      mid=t=>V3.add(b0,V3.add(V3.sc(dir,Lb*t),[0,0,-Lb*(b.droop??.18)*t*t])),P2=[0,.25,.5,.75,1].map(t=>PJ(Bu,O,mid(t)));let d=smooth(P2.map(p=>[p[0],p[1]]),false);
    for(const tl of b.lob)for(const s of[-1,1]){const m=mid(tl),ld=V3.nz(V3.add(V3.sc(dir,.75),V3.sc(tg,s*.66))),e=V3.add(m,V3.sc(ld,Lb*(b.ll??.3)*(1-.45*tl))),pm=PJ(Bu,O,m),pe=PJ(Bu,O,e);d+=`M${f(pm[0])},${f(pm[1])}L${f(pe[0])},${f(pe[1])}`}
    brs.push({d,front:P2[2][2]>O[2]})}}
  /* the florets of a set of umbellets: cushions, florets (outer and inner colour), their eyes, the lit ones */
  const PO=pal7(cO),PI=pal7(cI),drawSet=list=>{let dc='',dO='',dI='',dB='',de='',dh='',IO=0,II=0,nO=0,nI=0;
    for(const u of list){const Xu=V3.nz(V3.cr(Math.abs(u.n[1])<.9?[0,1,0]:[1,0,0],u.n)),Yu=V3.cr(u.n,Xu),C0=V3s(u.C,V3.sc(u.n,u.ru*.12)),cs=PJ(Bu,O,C0),
        e1=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Xu,u.ru*.92))),cs),e2=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Yu,u.ru*.92))),cs);dc+=chpEll(cs,e1,e2,Math.max(.5,u.ru*.25));
      const front=u.nV[2]>=0,I=.6+(lightI(front?u.nV:V3.sc(u.nV,-1))-.6)*.55-(front?0:.08);/* a lace of tiny matt florets: soft light */if(u.col){II+=I;nI++}else{IO+=I;nO++}
      const rf0=u.ru*U.fl/Math.sqrt(nF),lit=front&&V3.dot(u.nV,LIGHT)>.2;
      for(let j=0;j<nF;j++){const sg=Math.sqrt((j+.5)/nF),ps=j*2.39996+u.i*1.7,rf=rf0*(1+U.zyg*sg*sg*u.rho*q)*(nest?.85:.7+.3*q),
          p=V3.add(u.C,V3.add(V3.add(V3.sc(Xu,Math.cos(ps)*sg*u.ru*.9),V3.sc(Yu,Math.sin(ps)*sg*u.ru*.9)),V3.sc(u.n,u.ru*.3*(1-sg*sg)))),s=PJ(Bu,O,p),rr=Math.max(.45,rf*(.7+.3*Math.abs(u.nV[2]))),dd=chpDot(s[0],s[1],rr);
        if(!front&&!nest)dB+=dd;else if(u.col)dI+=dd;else dO+=dd;if(det&&front&&q>.45&&j%2===0)de+=chpDot(s[0],s[1],rr*.3);if(lit&&sg<.8&&j%3===0)dh+=chpDot(s[0]-rr*.22,s[1]-rr*.28,rr*.5)}}
    if(dc)E('path',{d:dc,fill:shd(nO>=nI?cO:cI,-.32)},g);
    const lite=h2l(cO)[2]>.84,sw=nest?.35:lite?.26:.22,so=nest?.55:lite?.5:.32,sk=lite?shd(cO,-.42):PO.d1;
    /* deep colours stay dusky (the 'Dara' wines and chocolates are matt): their light is held closer to the colour itself */
    const dk=c=>h2l(c)[2]<.4,ti=(P,I,c)=>toneAt(P,dk(c)?.55+(I-.55)*.45:I);
    if(dO)E('path',{d:dO,fill:ti(PO,nO?IO/nO:.6,cO),stroke:sk,'stroke-width':sw,'stroke-opacity':so},g);if(dI)E('path',{d:dI,fill:ti(PI,nI?II/nI:.6,cI),stroke:lite?shd(cI,-.42):PI.d1,'stroke-width':sw,'stroke-opacity':so},g);
    /* florets seen from beneath: their undersides and pedicels, greener and in shade */
    if(dB){const cb=mix(cO,'#8c9a74',.3);E('path',{d:dB,fill:toneAt(pal7(cb),.48),stroke:shd(cb,-.4),'stroke-width':.24,'stroke-opacity':.5},g)}
    if(de)E('path',{d:de,fill:nest?shd(cO,-.5):U.eye||shd(cO,-.18),opacity:nest?.75:.55},g);if(dh&&!LOD)E('path',{d:dh,fill:PO.l2,opacity:.7},g)};
  const sets=um.slice().sort((p,r)=>p.z-r.z),half=[sets.slice(0,sets.length>>1),sets.slice(sets.length>>1)],bw=Math.max(.45,Ru*.01),
    bracts=fr=>{let d='';for(const b of brs)if(b.front===fr)d+=b.d;if(d)E('path',{d,stroke:U.brc||'#6a8a48','stroke-width':f(bw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)},
    rays=list=>{let d='';for(const u of list)d+=u.ray;if(d)E('path',{d,stroke:cw.ray||U.rc||'#7a9a58','stroke-width':f(rw),fill:'none','stroke-linecap':'round'},g)};
  /* seen from above the lace hides its rays; from below the rays and bracts come first; from the side each half brings its own rays */
  if(el>.3){bracts(false);bracts(true);rays(um);for(const h of half)drawSet(h)}
  else if(el<-.25){for(const h of half)drawSet(h);rays(um);bracts(false);bracts(true)}
  else{bracts(false);for(const h of half){rays(h);drawSet(h)}bracts(true)}
  /* the wild carrot's single dark floret in the heart of the umbel */
  if(cw.ctr&&q>.55&&el>.3){const c=PJ(Bu,O,[0,0,H0+ru0*.45]),rr=Math.max(.9,Ru*.04);E('path',{d:chpDot(c[0],c[1],rr),fill:cw.ctr,stroke:shd(cw.ctr,-.4),'stroke-width':.3},g)}
  return g}
/* ---------- a stem grown by the L-system that ends in one head (an umbel, a crest). As lsHeadS, but the main head may keep the frame of its own peduncle
   (an umbel is symmetric round it), the peduncle aims where the caller asks, the centre of the head sits where the caller says, and the side shoots end in younger heads.
     A(n>0) → F N(n) A(n−1)        A(0) → F F(aim) K        N(i) → [ /φ &α Lv ] (twice if opposite)  [ /φ' &β F F(e) Kb(age) ] (by chance, in the upper axils) ---------- */
function chpHeadS(k,o,S){const B=S.B,up=S.up,Dm=S.D,w=S.w,op=S.op;let U0=V3s(S.face,V3.sc(up,V3.dot(S.face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nN=o.rim?0:S.nodes??1,li=Dm*(S.li??.5),lp=Dm*(S.lp??1)*(o.rim?.55:1),Lh=nN*li+lp,sc=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lh)):1,sd=o.rim?null:S.side,ph0=R(0,360);
  const rules={A:p=>p.n>0?[['F',{l:li*sc*R(.85,1.15),w1:w*(1.06+.05*p.n)}],['N',{i:p.n}],['A',{n:p.n-1}]]:[['F',{l:lp*sc*.4,w1:w*1.03,aim:S.aim,k:(S.aimK??.2)*.45}],['F',{l:lp*sc*.6,w1:w,aim:S.aim,k:S.aimK??.2}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],nl=S.opp?2:1,r0=ph0+p.i*(nl===2?90:137.5);
      for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:r0+j*180+R(-14,14)}],['&',{a:(S.leafAng??50)+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      if(sd&&p.i<=(sd.top??1))for(let j=0;j<(sd.n||1);j++)if(rnd()<(sd.p??.5)){const L1=Dm*(sd.len||.8)*sc*R(.8,1.15),ws=w*(sd.w??.62);
        out.push(['[',{w:ws}],['/',{a:r0+(S.opp?90:24)+j*180+R(-20,20)}],['&',{a:(sd.ang||32)+R(-8,8)}],['F',{l:L1*.45,w1:ws*.85,e:sd.e??.05}],['F',{l:L1*.55,w1:ws*.7,e:sd.e??.05}],['Kb',{age:R(sd.age[0],sd.age[1]),i:p.i}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:S.wig??.03,seg:Dm*(S.seg||.12),T:[0,1,0],e:S.e??.02,w:w*1.18}),main=res.organs.find(q=>q.t==='K');
  for(const ch of res.chains)ch.c=S.cols;const Bm=S.mainB||lsFrame(main,null,R(-.25,.25)),apex=V3.add(main.pos,S.apex?S.apex(Bm):[0,0,0]);
  lsPlant(k,res,{O:[0,0,0],apex,cols:S.cols,piece:S.piece,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2],fn:par=>S.flower(par,Bm,pos,op,og)}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,op*1.1),Bf=lsFrame(og,null,R(-.3,.3));return{parts:[{z:pos[2],fn:par=>S.young(par,Bf,pos,a,og)}]}}
    if(og.t==='Lv'&&S.leaf){const pt=S.leaf(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    if(og.t==='Nd'&&S.node){const pt=S.node(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    return null}});
  return lsNeck(res,[0,0,0],apex)}
/* ---------- the plant of an umbellifer: a ridged stem, finely cut leaves with sheathing bases, the terminal umbel first in flower, younger umbels on side shoots from the upper axils ---------- */
function chpUmbPlant(g,t,o,K){const cw=o.cw||cwNear(K.cws.filter(w=>!w.f||w.c===o.col),o.col)||K.cws[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,Ru=Dm/2,k=G(g),U=K.U(cw),
    B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,K.upK??.4))),sc=cw.st||K.sc,lc=cw.lc||K.lc;
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.2,D:Dm,w:Dm*K.w,cols:sc,op,nodes:K.nodes,li:K.li,lp:K.lp,leafAng:K.leafAng??46,side:K.side,seg:.1,wig:K.wig??.035,e:.012,
    apex:Bm=>V3.sc(Bm[2],Ru*.3),
    flower:(par,Bf,O,op2)=>chpUmbel(par,Bf,O,Ru,op2,cw,U),
    young:(par,Bf,O,a)=>chpUmbel(par,Bf,O,Ru*(.5+.25*a),cw.nest?1:a,cw,U),
    leaf:(og,pos)=>{const top=og.p.i<=1,len=Dm*(top?R(.55,.75):R(.9,1.2))*(K.lk||1);return lsLeaf2D(og,pos,len,(par,x,y,a,l)=>chpCutLeaf(par,x,y,a,l,lc,Object.assign({sw:Dm*K.w*1.25,sh:.09},top?K.leafT||K.leaf:K.leaf)))}});
  open(k,t,1000,8,.3);return r}
/* ---------- wild carrot (Daucus carota; 'Dara' and its kin): a flat lace of 20–40 rays round a single dark floret (the wild type), the outer florets enlarged;
   the involucre of long bracts cut into thread-like lobes; buds and fruiting umbels folded into a bird's nest; leaves two or three times cut into narrow lobes ---------- */
const CW_DAUC=[{id:'blanc',n:'Blanc à cœur pourpre (type sauvage)',c:'#f6f3ea',ctr:'#3e1430',bud:'#d4b4b8'},{id:'rose-poudre',n:'Rose poudré (Dara)',c:'#e2bcc2',c2:'#c8909e'},{id:'bordeaux',n:'Bordeaux (Dara)',c:'#7a2a48',c2:'#5a1a36',ray:'#7a6a4a'},
  {id:'creme',n:'Crème rosé (Dara)',c:'#efe4d6',c2:'#e2c4c4'},{id:'blush',n:'Rose blush (Dara)',c:'#ecd0d0',c2:'#dcaab2'},{id:'rose',n:'Rose (Dara)',c:'#d98ba7',c2:'#b8607e'},
  {id:'mauve',n:'Vieux rose mauve (Dara)',c:'#c4909e',c2:'#9a5a72'},{id:'prune',n:'Prune (Dara)',c:'#5e2142',c2:'#4c1527',ray:'#6a5a40'},{id:'chocolat',n:'Chocolat (Dara)',c:'#4b2329',c2:'#36161c',ray:'#5f5a3a'},
  {id:'noir',n:'Pourpre noir (Black Knight)',c:'#3a1426',c2:'#28101c',ray:'#5a4a3a'},{id:'nid',n:'Nid d’oiseau (ombelle en graines)',c:'#8a9a62',nest:1,f:'nest'}];
const DAUC_K={cws:CW_DAUC,cm:9,w:.055,nodes:2,li:.55,lp:1.15,upK:.4,side:{p:.85,n:1,top:2,len:1.15,ang:30,age:[.1,.75],e:.05},sc:['#2c4420','#4c6a34','#73945a','#a6c08a'],lc:'#4f7438',
  leaf:{np:4,nl:3,lw:.028,pl:.38,ll:.34},leafT:{np:3,nl:2,lw:.026,pl:.32,ll:.3},
  U:cw=>({nR:30,nf:16,dome:.04,ruK:.16,fl:.86,zyg:.9,br:{n:10,len:.72,lob:[.3,.5,.68,.84],el:-24,droop:.2},brc:cw.nest?'#7a8a52':'#5f8044',rc:'#7a9658',bud:'#b4b48c',eye:cw.ctr?'#d8d2b0':null})};
function daucPlant(g,t,o){return chpUmbPlant(g,t,o,DAUC_K)}
/* ---------- ammi: A. majus, a broad airy lace of 30–60 slender rays, flat or slightly domed, bracts three-cleft; A. visnaga, denser and domed, green before it whitens,
   long bracts cut like combs, thread-like leaves; both branched, the side umbels younger ---------- */
const CW_AMMI=[{id:'blanc',n:'Blanc (majus Graceland)',c:'#f7f6ef',k:'maj'},{id:'ivoire',n:'Ivoire (majus)',c:'#f1ecd8',k:'maj'},{id:'vert-pale',n:'Blanc verdi (majus, jeune)',c:'#e3e8cf',c2:'#d4dcb2',k:'maj'},
  {id:'visnaga',n:'Blanc dense (visnaga)',c:'#f3f3e6',c2:'#e6ead0',k:'vis'},{id:'vert',n:'Vert (visnaga Green Mist)',c:'#c4d29c',c2:'#b2c486',k:'vis'}];
const AMMI_K={cws:CW_AMMI,cm:10,w:.05,nodes:2,li:.6,lp:1.2,upK:.45,side:{p:.9,n:1,top:2,len:1.25,ang:28,age:[.15,.8],e:.05},sc:['#2e4a22','#4f7038','#78985c','#a8c48c'],lc:'#4a7034'};
const AMMI_U={maj:{nR:34,nf:16,dome:-.07,ruK:.14,fl:.95,zyg:.6,br:{n:8,len:.36,lob:[.55],el:-40,droop:.1,ll:.42},brc:'#6a8a4a',rc:'#86a468',bud:'#a8bc84',eye:'#e2e2c0'},
  vis:{nR:46,nf:16,dome:-.3,ruK:.13,fl:1.05,zyg:.25,br:{n:12,len:.62,lob:[.3,.48,.64,.8],el:-18,droop:.16},brc:'#5f8044',rc:'#7f9e60',bud:'#9cb478',eye:'#d8dcb4'}};
function ammiPlant(g,t,o){const cw=o.cw||cwNear(CW_AMMI,o.col)||CW_AMMI[0],vis=cw.k==='vis';
  return chpUmbPlant(g,t,Object.assign({},o,{cw}),Object.assign({},AMMI_K,{U:()=>AMMI_U[vis?'vis':'maj'],leaf:vis?{np:4,nl:3,lw:.012,pl:.42,ll:.42,la:.55}:{np:3,nl:2,lw:.05,pl:.34,ll:.36},leafT:vis?{np:3,nl:2,lw:.011,pl:.4,ll:.4,la:.5}:{np:3,nl:2,lw:.022,pl:.36,ll:.4}}))}
/* ---------- great burnet (Sanguisorba officinalis and its kin): a wiry stem branching high into long bare, wandering branches, each ending in a small dense head
   of petal-less florets (four sepals, four stamens): ovoid and erect in officinalis, flowering from its top down; long, nodding cylinders frothy with stamens in tenuifolia and
   'Pink Elephant', fluffy and pink in hakusanensis; pinnate leaves of toothed oval leaflets low on the stem. In a bouquet it is a line: the plant follows the composer's spine.
     the branches, from the nodes of the flowering top: B(o,l) → F(l·.55) [ /137 &θ B(o+1, l·.55) ]? F(l·.45) Hd ---------- */
const CW_SANG=[{id:'bordeaux',n:'Bordeaux (officinalis)',c:'#6e1a2c',k:'off'},{id:'rubis',n:'Rouge rubis (Red Thunder)',c:'#8c1c30',k:'off',lk:1.35},{id:'noir',n:'Pourpre noir (Chocolate Tip)',c:'#421822',k:'off',up:1},
  {id:'rose',n:'Rose framboise (Pink Tanna)',c:'#c45478',k:'off',lk:.8},{id:'framboise',n:'Framboise (Pink Elephant)',c:'#c03a6a',k:'ten'},{id:'rose-tendre',n:'Rose tendre (hakusanensis)',c:'#e8a4bc',k:'hak'},
  {id:'blanc',n:'Blanc crème (tenuifolia Alba)',c:'#efe9dc',k:'ten'}];
/* the head kinds: length and width (cm, open), how much it nods, how far its stamens stand out (× its width) */
const SANG_H={off:{L:2,W:1.15,droop:0,st:.12},ten:{L:5,W:1.05,droop:.55,st:.5},hak:{L:6,W:1.5,droop:.75,st:.62}};
/* one head on the tip P (view space) of its branch, leaving along ax: its body lit from the upper left, its florets as dots (buds dark, open ones paler), stamens on the open part */
function sangHead(par,P,ax,Lh,Wh,cw,K,a){const g=G(par),n=9,dr=K.droop*(.35+.65*a),C3=[],rs=[],det=DET>=1.5,lite=h2l(cw.c)[2]>.8,col=a<.5?mix(cw.c,'#7a8a4a',(.5-a)*.9):lite?mix(cw.c,'#c8c4a0',.18):cw.c,P7=pal7(col),ten=cw.k!=='off';
  for(let i=0;i<=n;i++){const v=i/n,q=V3.add(V3.add(P,V3.sc(ax,Lh*v*(1-.35*dr*v))),[0,-dr*Lh*.55*v*v,0]);C3.push(q);
    rs.push(Wh/2*(ten?Math.pow(Math.sin(Math.PI*Math.min(.97,.05+.95*v)),.35)*(1-.3*v):Math.pow(Math.sin(Math.PI*Math.min(.97,.07+.93*v)),.55)*(1-.12*v)))}
  const C=C3.map(q=>[q[0],-q[1]]),out=chpTube(C,rs);E('path',{d:smooth(out),fill:budFill(col),stroke:lite?shd(col,-.55):P7.d2,'stroke-width':lite?.45:.35,'stroke-opacity':lite?.85:.6},g);if(LOD)return g;
  /* florets in a spiral over the head; officinalis opens from its top down (tenuifolia too), 'Chocolate Tip' from its foot up: the open band grows with age */
  let dd='',dl='',ds='',da='';const N=Math.round((det?1:.6)*Math.max(14,Lh*Wh*.9)),rr=Math.max(.45,Wh*(ten?.07:.085)),openFrom=1-Math.min(1,a*1.05);
  for(let k=0;k<N;k++){const v=(k+.5)/N,i=Math.min(n-1,Math.floor(v*n)),t=v*n-i,c=V3.add(C3[i],V3.sc(V3s(C3[i+1],C3[i]),t)),T=V3.nz(V3s(C3[i+1],C3[i])),
      X=V3.nz(V3.cr(Math.abs(T[2])<.9?[0,0,1]:[1,0,0],T)),Y=V3.cr(T,X),ps=k*2.39996,rad=V3.add(V3.sc(X,Math.cos(ps)),V3.sc(Y,Math.sin(ps)));if(rad[2]<.12)continue;
    const r=(rs[i]+(rs[i+1]-rs[i])*t)*.92,p=V3.add(c,V3.sc(rad,r)),s=[p[0],-p[1]],op=cw.up?v<=1-openFrom:v>=openFrom;/* 'Chocolate Tip' opens from the bottom up */
    if(op){dl+=chpDot(s[0]-rr*.2,s[1]-rr*.2,rr*.9);if(det||ten){const e=V3.add(p,V3.sc(rad,Wh*K.st*R(.7,1.1))),se=[e[0],-e[1]];ds+=`M${f(s[0])},${f(s[1])}L${f(se[0])},${f(se[1])}`;if(det)da+=chpDot(se[0],se[1],rr*.42)}}
    else dd+=chpDot(s[0],s[1],rr*(ten?.6:.85))}
  if(dd)E('path',{d:dd,fill:ten&&!lite?P7.d1:P7.d2,opacity:ten?.4:.55},g);if(dl)E('path',{d:dl,fill:ten?P7.l1:P7.b,opacity:ten?.85:.9},g);
  if(ds)E('path',{d:ds,stroke:ten?(lite?shd(col,-.12):P7.l1):P7.d1,'stroke-width':f(Math.max(.3,Wh*.025)),'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},g);if(da)E('path',{d:da,fill:ten?shd(col,-.2):'#2a1a12',opacity:.8},g);return g}
function sangPlant(g,t,o){const cw=cwPick(CW_SANG,o),K=SANG_H[cw.k]||SANG_H.off,op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],SC=['#2a2a18','#4e4a2c','#77704a','#a49c72'],
    Lf0=(o.cm||25)*UPC,Lt=o.spine?blen(o.spine):Lf0*2.6,A=chpAxis(o,Lt,{face:R(-.8,.8),amp:.9*UPC,nw:1.3,e0:.35}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.6:.48:.55)),s0=A.sOf(L-Lfl),
    hk=(o.cm||25)/25,Lh=K.L*(cw.lk||1)*UPC*Math.sqrt(hk),Wh=K.W*(cw.k==='off'?(cw.lk||1)**-.3:1)*UPC*Math.sqrt(hk),a0=op,leafC='#4c6a34';
  chpStem(A,parts,[0,s0*.6,s0,s0+(1-s0)*.5,1],2.6,1.3,SC);
  /* the branches of the flowering top, alternate, the lower ones longer; each may fork once more; they wander and turn up toward the light */
  const nb=Math.max(3,Math.round((o.short?4:6)*(LOD?.7:1))),hds=[];
  const rules={B:p=>{const out=[['F',{l:p.l*.55,w1:Math.max(1,p.w*.85)}]];if(p.o<1&&rnd()<.6)out.push(['[',{w:Math.max(1,p.w*.8)}],['/',{a:137+R(-30,30)}],['&',{a:R(26,40)}],['B',{o:p.o+1,l:p.l*R(.45,.6),w:Math.max(1,p.w*.8)}],[']',{}]);
    out.push(['F',{l:p.l*.45,w1:1}],['Hd',{o:p.o}]);return out}};
  for(let j=0;j<nb;j++){const u=(j+.5)/nb,s=s0+(1-s0)*(.05+.78*u),fr=A.at(s),az=(j*137.5+R(-15,15))*D,th=(34+R(-8,8)-10*u)*D,side=V3.add(V3.sc(fr.Fr,Math.cos(az)*.55),V3.sc(fr.Sd,Math.sin(az))),
      dir=V3.nz(V3.add(V3.sc(fr.T,Math.cos(th)),V3.sc(V3.nz(side),Math.sin(th)))),len=Lfl*(.62-.38*u)*R(.85,1.1);
    const res=lsTurtle(lsDerive([['B',{o:0,l:len,w:1.35}]],rules,4),{p:fr.p,H:dir,U:fr.Fr,wig:.07,seg:Math.max(4,len/9),T:[0,1,0],e:.045,w:1.35});
    for(const ch of res.chains){let z=0;for(const q of ch.pts)z+=q[2];parts.push({z:z/ch.pts.length,fn:par=>chpTwig(par,ch.pts,ch.ws[0],ch.ws[ch.ws.length-1],SC)})}
    for(const og of res.organs)if(og.t==='Hd')hds.push({P:og.pos,ax:og.H,age:Math.max(0,Math.min(1,a0*(1.05-.12*og.p.o)-.05*u)),sz:og.p.o?.8:.92});
    /* a small leafy bract at the fork */
    if(!LOD&&rnd()<.6){const lp=fr.p,ang=Math.atan2(-dir[1],dir[0])+(rnd()<.5?-1:1)*.5,ll=Lfl*.09;parts.push({z:lp[2]+.3,fn:par=>chpPinLeaf(par,lp[0],-lp[1],ang,ll,leafC,{pairs:2})})}}
  const top=A.at(1);hds.push({P:top.p,ax:top.T,age:a0,sz:1});
  for(const h of hds){const sz=h.sz*(.62+.38*Math.min(1,h.age*1.6));parts.push({z:h.P[2]+.5,fn:par=>sangHead(par,h.P,h.ax,Lh*sz,Wh*sz,cw,K,h.age)})}
  /* pinnate leaves on the lower stem, above the mouth in a bouquet; on a sheet, the big toothed basal leaves too */
  const lmin=o.spine?11*UPC:0,nl=o.spine?2:3;for(let j=0;j<nl;j++){const l=(L-Lfl)*(.25+.55*j/Math.max(1,nl-1))*R(.9,1.05);if(l<lmin)continue;const s=A.sOf(l),fr=A.at(s),sd=j%2?1:-1,
      ang=Math.atan2(-fr.T[1],fr.T[0])+sd*R(38,52)*D,len=Lfl*R(.32,.42)*(1-.2*j);parts.push({z:fr.p[2]+(j%2?.4:-.4),fn:par=>chpPinLeaf(par,fr.p[0],-fr.p[1],ang,len,leafC,{pairs:3})})}
  if(!o.spine&&o.ax)for(const sd of[-1,1]){const fr=A.at(.02),ang=Math.atan2(-fr.T[1],fr.T[0])+sd*R(55,68)*D,len=Lf0*R(.45,.55);parts.push({z:fr.p[2]+sd*.5,fn:par=>chpPinLeaf(par,fr.p[0],-fr.p[1],ang,len,leafC,{pairs:5})})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:2.6,bc:SC}}
/* ---------- cockscomb (Celosia argentea var. cristata): the tip of the stem flattened into a fan (fasciation) whose top rolls and folds on itself like a brain or a coral,
   a dense velvet of tiny flowers; the fan pleated in deep folds, the rolled crest on top crinkled into small convolutions; a thick ribbed stem, often tinted,
   alternate lanceolate leaves, sometimes a small young crest on a side shoot. Velvet: no shine, deep valleys, the rounded ridges catching the light. ---------- */
const CW_CELC=[{id:'rouge',n:'Rouge',c:'#b3122c',lc:'#4a5a2c',st:['#3a1a14','#6a2a22','#8a4a34','#b07a5a']},{id:'bordeaux',n:'Bordeaux (Cramer’s Burgundy)',c:'#6e1631',lc:'#4a4a2a',st:['#2e1414','#58262a','#7a4040','#a07070']},
  {id:'rose',n:'Rose (Bombay Pink)',c:'#d75b8d'},{id:'jaune',n:'Jaune d’or (Chief Gold)',c:'#e6ae2a',lc:'#5a7a30'},{id:'orange',n:'Orange (Chief Persimmon)',c:'#e5772c',lc:'#56702e'},
  {id:'carmin',n:'Carmin (Chief Carmine)',c:'#b8164a',lc:'#4a5a2c',st:['#3a1a1e','#6a2a34','#8a4a50','#b07a80']},{id:'fuchsia',n:'Fuchsia (Bombay Purple)',c:'#b02a78',lc:'#4a5a34'},
  {id:'rose-tendre',n:'Rose tendre',c:'#e8a2b6'},{id:'firosa',n:'Rose à reflets orange (Bombay Firosa)',c:'#e0607c',c2:'#f0943c'},{id:'pourpre',n:'Pourpre sombre',c:'#5a0e22',lc:'#3e4428',st:['#2a1012','#4a2024','#6a3a3a','#906464']},
  {id:'citron',n:'Vert citron (Cramer’s Lemon Lime)',c:'#cfd060',lc:'#5f8034'}];
/* a fill darkening the foot of a crest, shared by colour (the lower fan is paler and greener in life, shadowed by the comb above it) */
const CELC_F={};function celcFoot(c){const id=CELC_F[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='cf'+(gid++),gr=E('linearGradient',{id:nid,x1:0,y1:1,x2:0,y2:0},defs);stops(gr,[[0,shd(mix(c,'#5a7a3a',.35),-.45),.7],[.45,shd(c,-.3),.25],[.75,c,0]]);CELC_F[c]=nid;return`url(#${nid})`}
/* the crest (Celosia cristata) in its frame B (x across, y up the stem, z its face) at O, Dm wide when grown — drawn after photographs:
   the fasciated stem widens into a fleshy trumpet (pale pink-green, granular, stippled with tiny florets), crowned along its arching top by the comb:
   rows of crowded velvet frills — small ruffled cups, deep in their folds, bright at their fringed rims — the arch rising over the trumpet and curling
   down at one end like a breaking wave. Far to near: the trumpet, then every frill by its depth. */
function celcCrest(par,B,O,Dm,cw,op){const k=G(par),q=sm01((op-.08)/.92),det=DET>=1.5,W=Dm*(.55+.45*q),Hc=W*(.64-.04*q),T=W*.32,hk=R(0,1)<.5?-1:1,
    col=mix(cw.c,'#8aa060',(1-q)*.3),dk=shd(col,-.52),br=cw.c2?mix(cw.c2,shd(col,.2),.45):shd(col,.2),ph0=R(0,6.28);
  /* the arch: s 0..1 across (0 the hooked end); its crown rises over the middle and the hooked end curls down */
  const ax=s=>hk*W*(-.5+1.0*s),ay=s=>Hc*(.6+.4*Math.pow(Math.sin(Math.PI*Math.min(1,.06+s*.98)),.7))-(s<.3?Hc*.62*Math.pow(1-s/.3,1.6):0)+Hc*.03*Math.sin(s*9+ph0),
    fy=s=>ay(s)-Hc*.3;
  /* the trumpet: from the stem top, its sides curving out (the hooked side deeper), its top hidden under the frills */
  const tr=[],nb=det?14:9,P=(x,y,z)=>PJ(B,O,[x,y,z]);
  for(let i=0;i<=nb;i++){const t=i/nb;tr.push([hk*(W*.06+(Math.abs(ax(.97))-W*.06)*Math.pow(t,1.7)*.92),fy(.97)*t])}
  for(let i=0;i<=nb;i++){const s2=.97-.87*i/nb;tr.push([ax(s2),fy(s2)])}
  for(let i=0;i<=nb;i++){const t=1-i/nb;tr.push([-hk*W*.06+(ax(.1)+hk*W*.06)*Math.pow(t,.62),fy(.1)*t])}
  const trP=tr.map(([x,y])=>P(x,y,T*.22));
  const trumpet=()=>{const lo=P(0,0,T*.22),hi=P(0,fy(.5),T*.22),pk=mix(col,'#f2d6dc',.4);
    E('path',{d:smooth(trP.map(p=>[p[0],p[1]])),fill:ugrad(lo[0],lo[1],hi[0]+(hi[0]===lo[0]&&hi[1]===lo[1]?.1:0),hi[1],[[0,'#a2b878'],[.3,mix(pk,'#a2b878',.5)],[1,shd(pk,-.08)]]),stroke:mix(col,'#6a8a4a',.4),'stroke-width':f(Math.max(.4,W*.006)),'stroke-opacity':.5},k);
    if(LOD)return;
    /* the granular skin: tiny florets stippled over it, pink, rose and a few green */
    const nd=det?260:70,dots=[['',mix(col,'#ffffff',.45),.8],['',shd(col,-.15),.7],['','#8eae6a',.6]];
    for(let i=0;i<nd;i++){const s2=R(.12,.95),t=Math.pow(R(0,1),.75),xl=-hk*W*.06+(ax(.1)+hk*W*.06)*Math.pow(t,.62),xr=hk*(W*.06+(Math.abs(ax(.97))-W*.06)*Math.pow(t,1.7)*.92),
        x=xl+(xr-xl)*R(.06,.94),y=Math.min(fy(s2),t*fy(.5))*R(.9,1),c=P(x,y,T*.24),rr=W*R(.006,.012)*(det?1:1.3),j=i%9<4?0:i%9<8?1:2;
      dots[j][0]+=`M${f(c[0]-rr)},${f(c[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
    for(const[d,c,o]of dots)if(d)E('path',{d,fill:c,'fill-opacity':o},k)};
  /* the frills: rows along the arch (the crown, a near row lower and in front, a far row behind, a low near row), each frill a ruffled velvet cup */
  const rows=[[0,0,1],[.5,-.14,.95],[-.5,-.04,.9],[.8,-.28,.85],[1,-.4,.72]],fr=[];
  for(const[dz,dy,rs]of rows){const r0=W*.13*rs,n=Math.max(4,Math.round(1.3/(r0/W*.82)));
    for(let i=0;i<n;i++){const s2=Math.min(1,Math.max(0,(i+.5)/n+R(-.25,.25)/n)),r=r0*R(.78,1.15)*(.62+.38*Math.sin(Math.PI*Math.min(1,.08+s2*.95)));
      const c=P(ax(s2)+R(-.3,.3)*r,ay(s2)+dy*Hc+R(-.25,.25)*r,dz*T+R(-.2,.2)*T);fr.push({c,r,ph:R(0,6.28),N:6+(i*3+Math.round(dz*7))%3,t:R(0,1)})}}
  fr.sort((a2,b2)=>a2.c[2]-b2.c[2]);
  const fill3=[0,1,2].map(j=>rad([[0,shd(dk,-.15)],[.38,mix(dk,col,.6)],[.72,col],[.9,mix(col,br,.6)],[1,br]],j===0?.42:j===1?.55:.48,.56,.6));
  const frill=F0=>{const{c,r,ph,N,t}=F0,n=det?30:16,pts=[];for(let i=0;i<n;i++){const a2=i/n*6.283,rr=r*(1+.24*Math.sin(N*a2+ph)+.1*Math.sin(2.3*N*a2+ph*2));pts.push([c[0]+Math.cos(a2)*rr,c[1]+Math.sin(a2)*rr*.84])}
    E('path',{d:smooth(pts),fill:fill3[(t*3)|0],stroke:dk,'stroke-width':f(Math.max(.35,r*.05)),'stroke-opacity':.35},k);if(LOD)return;
    /* its inner fold, curling into the cup */
    const a0=ph,fx=c[0]-r*.1,fy2=c[1]+r*.08,ri=r*.55,d1=`M${f(fx+Math.cos(a0)*ri)},${f(fy2+Math.sin(a0)*ri*.84)}A${f(ri)},${f(ri*.84)} 0 1,1 ${f(fx+Math.cos(a0+3.6)*ri)},${f(fy2+Math.sin(a0+3.6)*ri*.84)}`;
    E('path',{d:d1,stroke:shd(dk,-.25),'stroke-width':f(Math.max(.45,r*.22)),'stroke-opacity':.72,fill:'none','stroke-linecap':'round'},k);
    /* the velvet fringe along its rim */
    if(det){let d2='';for(let i=0;i<n;i+=2){const a2=i/n*6.283,rr=r*(1+.2*Math.sin(N*a2+ph)+.09*Math.sin(2.3*N*a2+ph*2)),cx=Math.cos(a2),sy=Math.sin(a2)*.84;
        d2+=`M${f(c[0]+cx*rr*.9)},${f(c[1]+sy*rr*.9)}L${f(c[0]+cx*rr*1.07)},${f(c[1]+sy*rr*1.07)}`}
      E('path',{d:d2,stroke:br,'stroke-width':f(Math.max(.3,r*.05)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},k)}};
  const band=()=>{const up=[],dn=[];for(let i=0;i<=16;i++){const s2=i/16,a2=P(ax(s2),ay(s2)+Hc*.06,0),b2=P(ax(s2),ay(s2)-Hc*.36,T*.3);up.push([a2[0],a2[1]]);dn.push([b2[0],b2[1]])}
    E('path',{d:smooth(up.concat(dn.reverse())),fill:mix(dk,col,.25),stroke:mix(dk,col,.25),'stroke-width':f(W*.05),'stroke-linejoin':'round'},k)};
  trumpet();band();for(const F0 of fr)frill(F0);return k}
/* a frame for a crest on a side shoot: its y along the shoot, its face as near the asked one as it can */
function celcFrame(Y,Zh){Y=V3.nz(Y);let Z=V3s(Zh,V3.sc(Y,V3.dot(Zh,Y)));if(V3l(Z)<.1)Z=V3s([0,0,1],V3.sc(Y,Y[2]));Z=V3.nz(Z);return[V3.cr(Y,Z),Y,Z]}
function celcPlant(g,t,o){const cw=o.cw||cwNear(CW_CELC,o.col)||CW_CELC[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||10)*UPC,k=G(g),B=frameOf(o,.12,true),
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],sc=cw.st||['#2e4a20','#4a6e30','#6e9448','#a2c07a'],lc=mix(cw.lc||'#4f7a34','#6aa448',.45),q=sm01((op-.08)/.92),Hc=Dm*(.5+.5*q)*(.74-.12*q);
  const r=chpHeadS(k,o,{B,up,face:B[2],aim:B[1],aimK:.3,D:Dm,w:Dm*.1,cols:sc,op,nodes:2,li:.5,lp:.55,leafAng:40,side:{p:.35,n:1,top:1,len:.6,ang:30,age:[.1,.5],e:.07,w:.55},seg:.12,wig:.02,e:.01,mainB:B,
    apex:Bm=>V3.sc(Bm[1],Hc*.48),
    flower:(par,Bf,O,op2)=>celcCrest(par,Bf,O,Dm,cw,op2),
    young:(par,Bf,O,a)=>celcCrest(par,celcFrame(Bf[2],B[2]),O,Dm*(.3+.2*a),cw,.1+.25*a),
    leaf:(og,pos)=>chpLeaf3(og,pos,Dm*(og.p.i<=1?R(.75,.95):R(1,1.25)),.32,lc,{droop:.18,arch:.1})});
  open(k,t,1000,6,.3);return r}
/* ---------- plume celosia (Celosia argentea var. plumosa): a flame of tiny shining florets and papery bracts, feathered upward, widest low and drawn out into a fine tip
   that bends a little; younger, smaller plumes on side shoots from the upper axils round the main one (candelabra); a stiff ribbed stem, alternate lanceolate leaves.
   In a bouquet it is a line, its plumes rising above the mass along the composer's spine. ---------- */
const CW_CELP=[{id:'rouge',n:'Rouge (Celway Red)',c:'#c3263b',lc:'#4a5a2c'},{id:'orange',n:'Orange (Sunday Orange)',c:'#ea7a2a'},{id:'jaune',n:'Jaune d’or (Sunday Gold)',c:'#efb127'},
  {id:'rose',n:'Rose vif (Sunday Bright Pink)',c:'#df4f8c'},{id:'cerise',n:'Cerise (Sunday Cherry)',c:'#b81c48',lc:'#4a5a2c'},{id:'rose-fonce',n:'Rose foncé (Sunday Dark Pink)',c:'#c43a78'},
  {id:'pourpre',n:'Pourpre (Celway Purple)',c:'#8a2050',lc:'#4a4e2c',st:['#2a1418','#52262e','#784048','#a06c72']},{id:'terracotta',n:'Terracotta (Celway Terracotta)',c:'#c8603a'},
  {id:'creme',n:'Crème argenté (Celway White)',c:'#efe8c8',lc:'#5f8a3a'},{id:'vert',n:'Vert tendre (Sunday Green)',c:'#a9c25a',lc:'#55803a'}];
/* a plume along its axis C3 (view space points from its foot to its tip), Wp wide at its widest: its feathered outline (wisps combed up and out),
   then the barbs of its florets and bracts, short strokes rising up its surface and flaring out — dark ones in the shade, lit ones toward the light, the young tip paler */
function celpPlume(par,C3,Wp,cw,a){const n=C3.length-1,g=G(par),det=DET>=1.5,col=a<.45?mix(cw.c,'#8aa060',(.45-a)*1.1):cw.c,P7=pal7(col),ph=R(0,6.28),
    rv=v=>Wp/2*(v<.22?Math.pow(Math.sin(Math.PI/2*v/.22),.55):Math.pow((1-v)/.78,1.08))*(1+.06*Math.sin(v*19+ph)),C=C3.map(p=>[p[0],-p[1]]),rs=C3.map((p,i)=>Math.max(.4,rv(i/n)));
  const Tg=i=>{const a0=C3[Math.max(0,i-1)],b0=C3[Math.min(n,i+1)];return V3.nz(V3s(b0,a0))},FR=C3.map((p,i)=>{const T=Tg(i),X=V3.nz(V3.cr(Math.abs(T[2])<.9?[0,0,1]:[1,0,0],T));return[T,X,V3.cr(T,X)]});
  /* the outline: the tube with wisps all round its sides, combed toward the tip */
  const base=chpTube(C,rs,1),m=base.length,ax=[C[n][0]-C[0][0],C[n][1]-C[0][1]],al=Math.hypot(ax[0],ax[1])||1,ux=ax[0]/al,uy=ax[1]/al,cx=C.reduce((s0,c)=>s0+c[0],0)/C.length,cy=C.reduce((s0,c)=>s0+c[1],0)/C.length,fe=[];
  for(let i=0;i<m;i++){const p=base[i],q=base[(i+1)%m];fe.push(p);if(i<m-1){const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,ox=mx-cx,oy=my-cy,ol=Math.hypot(ox,oy)||1,w=Wp*.045*R(.5,1.3);fe.push([mx+ox/ol*w+ux*w*1.4,my+oy/ol*w+uy*w*1.4])}}
  E('path',{d:smooth(fe),fill:budFill(col),stroke:P7.d1,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},g);if(LOD)return g;
  let dd='',dl='',dt='';const nb=Math.round((det?150:64)*Math.min(1.4,Math.max(.5,(n?1:1)))),bl=Wp*(det?.16:.2);
  for(let k=0;k<nb;k++){const v=.04+.92*(k+.5)/nb,i=Math.min(n-1,Math.floor(v*n)),t=v*n-i,ps=k*2.39996+ph,[T,X,Y]=FR[i],rad=V3.add(V3.sc(X,Math.cos(ps)),V3.sc(Y,Math.sin(ps)));if(rad[2]<.08)continue;
    const r=(rs[i]+(rs[i+1]-rs[i])*t)*.9,c=V3.add(C3[i],V3.sc(V3s(C3[i+1],C3[i]),t)),p=V3.add(c,V3.sc(rad,r)),L=bl*(1-.45*v)*R(.7,1.2),e=V3.add(p,V3.add(V3.sc(T,L),V3.sc(rad,L*.35))),
      mm=V3.add(p,V3.add(V3.sc(T,L*.5),V3.sc(rad,L*.08))),d=`M${f(p[0])},${f(-p[1])}Q${f(mm[0])},${f(-mm[1])} ${f(e[0])},${f(-e[1])}`;
    if(v>.8)dt+=d;else if(V3.dot(rad,LIGHT)>.15)dl+=d;else dd+=d}
  const sw=Math.max(.35,Wp*.018);if(dd)E('path',{d:dd,stroke:P7.d2,'stroke-width':f(sw),'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},g);
  if(dl)E('path',{d:dl,stroke:P7.l1,'stroke-width':f(sw*.8),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g);
  if(dt)E('path',{d:dt,stroke:shd(mix(col,'#f4eed0',.25),.35),'stroke-width':f(sw*.8),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g);return g}
function celpPlant(g,t,o){const cw=cwPick(CW_CELP,o),op=Math.max(.05,Math.min(1,o.op??R(.8,1))),k=G(g),parts=[],SC=cw.st||['#2c4a1e','#4a7232','#76a050','#acc886'],lc=cw.lc||'#4f7a34',
    Lf0=(o.cm||15)*UPC,Lt=o.spine?blen(o.spine):Lf0*2.5,A=chpAxis(o,Lt,{face:R(-.6,.6),amp:.22*UPC,nw:1.1,e0:.35}),L=A.L,q=sm01((op-.08)/.92),
    Lp=Math.min(Lf0*.8*(.5+.5*q),L*(o.spine?o.short?.42:.3:.34)),Wp=Lp*.42,sP=A.sOf(L-Lp);
  chpStem(A,parts,[0,sP*.5,Math.min(1,sP+(1-sP)*.04)],4.6,3,SC);
  /* the main plume on the top of the stem */
  const C3=[];for(let i=0;i<=12;i++)C3.push(A.cb(sP+(1-sP)*i/12));let zp=0;for(const p of C3)zp+=p[2];parts.push({z:zp/C3.length+.5,fn:par=>celpPlume(par,C3,Wp,cw,op)});
  /* side plumes from the upper axils, younger, curving up; each under a leaf */
  const ns=Math.max(1,Math.round((o.spine?o.short?1:2:3)*(.6+.4*q)+rnd()*.8)),lz=L-Lp;
  for(let j=0;j<ns;j++){const l=lz-Lf0*(.08+.3*j/Math.max(1,ns))*R(.9,1.1);if(l<(o.spine?L*.45:0))continue;const s=A.sOf(l),fr=A.at(s),az=(j*137.5+R(-20,20))*D,th=(42+R(-6,6))*D,
      side=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)*.5),V3.sc(fr.Sd,Math.sin(az)))),dir=V3.nz(V3.add(V3.sc(fr.T,Math.cos(th)),V3.sc(side,Math.sin(th)))),
      lb=Lf0*R(.22,.32),lps=Lp*R(.45,.6)*(1-.1*j),res=lsTurtle([['F',{l:lb,w0:2.4,w1:1.8}],['F',{l:lps,w0:1.8,w1:1.2}]],{p:fr.p,H:dir,U:fr.Fr,wig:.02,seg:Math.max(3,(lb+lps)/12),T:[0,1,0],e:.06,w:2.4}),
      P=res.chains[0].pts,cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const ib=cum.findIndex(c=>c>=lb),stalk=P.slice(0,Math.max(2,ib+1)),pl=P.slice(Math.max(0,ib));
    let zs=0;for(const p of stalk)zs+=p[2];parts.push({z:zs/stalk.length,fn:par=>chpTwig(par,stalk,2.4,1.8,SC)});
    if(pl.length>2){let z2=0;for(const p of pl)z2+=p[2];const a=Math.max(.15,Math.min(1,op*(.85-.12*j)));parts.push({z:z2/pl.length+.4,fn:par=>celpPlume(par,pl,Wp*R(.5,.62),cw,a)})}
    /* its subtending leaf */const Lx=V3.nz(V3.cr(fr.T,side)),H=V3.nz(V3.add(V3.sc(fr.T,Math.cos(58*D)),V3.sc(side,Math.sin(58*D)))),og={pos:fr.p,H,L:Lx,U:V3.cr(H,Lx)};
    parts.push(chpLeaf3(og,fr.p,Lf0*R(.42,.55),.24,lc,{droop:.25}))}
  /* the leaves of the stem, alternate, above the mouth in a bouquet */
  const lmin=o.spine?10*UPC:Lf0*.15,nl=o.spine?3:5;for(let j=0;j<nl;j++){const l=lmin+(lz-Lf0*.3-lmin)*(j+.3)/nl;if(l<lmin||l>lz-Lf0*.1)continue;const s=A.sOf(l),fr=A.at(s),az=(j*137.5+R(-20,20))*D,
      side=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)*.6),V3.sc(fr.Sd,Math.sin(az)))),Lx=V3.nz(V3.cr(fr.T,side)),H=V3.nz(V3.add(V3.sc(fr.T,Math.cos(48*D)),V3.sc(side,Math.sin(48*D)))),og={pos:fr.p,H,L:Lx,U:V3.cr(H,Lx)};
    parts.push(chpLeaf3(og,fr.p,Lf0*R(.7,.88)*(1-.06*j),.27,lc,{droop:.3}))}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.6,bc:SC}}
/* ---------- registries: the umbels and the cockscomb are heads grown on their stem; burnet and plume celosia are lines along the composer's spine ---------- */
Object.assign(GH,{'daucus-carota':daucPlant,'ammi':ammiPlant,'sanguisorbe':sangPlant,'celosie-crete-de-coq':celcPlant,'celosie-plumeuse':celpPlant});
Object.assign(CWS,{'daucus-carota':CW_DAUC,'ammi':CW_AMMI,'sanguisorbe':CW_SANG,'celosie-crete-de-coq':CW_CELC,'celosie-plumeuse':CW_CELP});
Object.assign(SZG,{'daucus-carota':[7,8,9,9,10,11],'ammi':[8,10,10,12,14],'sanguisorbe':[20,25,25,30],'celosie-crete-de-coq':[8,10,10,12,14],'celosie-plumeuse':[12,15,15,18,20]});
Object.assign(GHI,{'daucus-carota':{form:'disque',size:1.8,k:'head',rk:1},'ammi':{form:'disque',size:1.8,k:'head',rk:1},'celosie-crete-de-coq':{form:'disque',size:2.5,k:'head',rk:1},
  'sanguisorbe':{form:'ligne',size:1,k:'plant',self:75*UPC,tip:.95,fx:3.5*UPC},'celosie-plumeuse':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.85,fx:3.5*UPC}});
for(const id of['daucus-carota','ammi'])GH_BUDS.add(id);
