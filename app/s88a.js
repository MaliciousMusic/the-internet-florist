/* ================= Serre, lot 88 — ombelles et vert acide, poussés par le L-système : buplèvre, alchémille, aneth, orlaya, tanaisie ================= */
/* ---------- shared: every stalk, ray and pedicel is a stroke of at least L88_PW from the point of its carrier; small bodies (florets, buttons, bracteoles) are items at their own depth,
   sorted and cut into a few bins (l30Batch of lot 30), each bin one path per key: a cloud of hundreds of florets costs a few dozen elements ---------- */
const L88_PW=1.1;
const l88Seg=(a,b)=>`M${f(a[0])},${f(-a[1])}L${f(b[0])},${f(-b[1])}`;
const l88Q=(a,m,b)=>`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`;
/* view-space points (y up) as a closed screen path */
const l88Poly=P=>'M'+P.map(p=>f(p[0])+','+f(-p[1])).join('L')+'Z';
/* a circle of radius r round c (view space) in the plane across n, as a screen ellipse sub-path */
const l88Ell=(c,n,r,rmin=.45)=>{const[X,Y]=l31Fr(n);return chpEll([c[0],-c[1]],[X[0]*r,-X[1]*r],[Y[0]*r,-Y[1]*r],rmin)};
/* stroked keys */
const l88SK=(c,w,o={})=>Object.assign({fill:'none',stroke:c,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'},o);

/* ---------- a round blade in 3D (lady's mantle, the perfoliate leaves of bupleurum): a fan of wedges round its centre, each toned by its own facing,
   lobed and toothed at its margin, pleated along its main veins (the veins in the valleys), cupped; a basal sinus where the petiole arrives (sinus > 0),
   or the stem passing right through it (perfoliate: the attachment point inside the blade). A0 attachment point, d0 toward the tip, n0 its upper face (view space) ---------- */
function l88Disc(A0,d0,n0,Rl,col,o={}){const n=V3.nz(n0),d=V3.nz(V3s(d0,V3.sc(n,V3.dot(d0,n)))),e2=V3.cr(n,d),nl=o.nl||9,det=DET>=1.5,ns=o.ns||(det?nl*2:nl*2),pl=o.pleat||0,cup=o.cup||0,sn=o.sinus||0,el=o.el||1,
    C=V3.add(A0,V3.sc(d,Rl*el*(o.off??.25))),wr=o.wav||0,
    rad=p=>{let r=1+(o.lobe||0)*Math.cos(nl*p);if(sn){const dp=Math.atan2(Math.sin(p-Math.PI),Math.cos(p-Math.PI));r*=1-sn*Math.exp(-((dp/.2)**2))}
      if(o.tip)r*=1+o.tip*Math.pow(Math.max(0,Math.cos(p)),10);return r},
    pt=(rho,p,th=0)=>{const r=Rl*rad(p)*(1+th)*rho,x=Math.cos(p)*r*el,y=Math.sin(p)*r,h=cup*Rl*rho*rho-pl*Rl*rho*Math.cos(nl*p)+wr*Rl*rho*rho*Math.sin(3*p+1);
      return V3.add(V3.add(C,V3.add(V3.sc(d,x),V3.sc(e2,y))),V3.add(V3.sc(n,h),[0,-(o.droop||0)*Rl*rho*rho*(1+Math.cos(p))*.5,0]))},
    P=pal7(col),PB=pal7(mix(shd(col,.22),'#b8c6a4',.32)),ink=shd(col,-.72),W=[],nm=Math.max(2,Math.round((det?12:7)*8/ns));
  for(let k=0;k<ns;k++){const pa=Math.PI+k*6.2832/ns,pb=pa+6.2832/ns,poly=[pt(0,pa)];for(const r of[.4,.75])poly.push(pt(r,pa));
    for(let i=0;i<=nm;i++){const p=pa+(pb-pa)*i/nm,th=o.teeth&&det?(i%2?o.teeth:-o.teeth*.3):0;poly.push(pt(1,p,th))}for(const r of[.75,.4])poly.push(pt(r,pb));
    const a=pt(.05,(pa+pb)/2),u=V3s(pt(.75,pa),a),v=V3s(pt(.75,pb),a);let nw=V3.nz(V3.cr(u,v));if(V3.dot(nw,n)<0)nw=V3.sc(nw,-1);const up=nw[2]>=0,I=lightI(up?nw:V3.sc(nw,-1))*(up?1:.88)*(o.ao||.94);
    let z=0;for(const q of poly)z+=q[2];W.push({poly,z:z/poly.length,up,I:Math.round(Math.max(.22,Math.min(.95,I))*7)/7})}
  let zt=0;for(const w of W)zt+=w.z;zt/=W.length;
  return{z:zt+(o.zb||0),cast:false,fn:par=>{const g=G(par),ws=W.slice().sort((p,q)=>p.z-q.z);let run=null;
    const flush=()=>{if(run)E('path',{d:run.d,fill:toneAt(run.up?P:PB,run.I),stroke:ink,'stroke-width':.35,'stroke-opacity':.4,'stroke-linejoin':'round'},g);run=null};
    for(const w of ws){if(!run||run.up!==w.up||run.I!==w.I){flush();run={d:'',up:w.up,I:w.I}}run.d+=l88Poly(w.poly)}flush();
    if(!LOD&&(det||Rl>(o.vmin||0))){let dv='';const nv=o.nv||nl;for(let k=0;k<nv;k++){const p=(k+.5)*6.2832/nv+Math.PI;if(sn&&Math.abs(Math.atan2(Math.sin(p-Math.PI),Math.cos(p-Math.PI)))<.4)continue;
        const a=o.vb?A0:pt(0,p),m=pt(.5,p),b=pt(.9,p);dv+=l88Q(a,m,b)}
      if(dv){const vis=ws.filter(w=>w.up).length>=ws.length/2;E('path',{d:dv,stroke:vis?(pl?P.d1:P.l1):PB.d1,'stroke-width':f(Math.max(.4,Rl*.022)),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},g)}}
    if(o.after)o.after(g,ws.filter(w=>w.up).length>=ws.length/2)}}}

/* ---------- a cut leaf in 2D with a sheathing petiole (dill, orlaya): pairs of pinnae cut again into narrow lobes; o.fork splits every lobe again at its tip (dill's threads) ---------- */
function l88Cut(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),sh=o.sh??.1,bend=(o.bend??R(-.14,.14))*len,np=o.np||4,nl=o.nl||3,ct=o.ct??1,
    at=t=>[len*t,bend*t*t],ta=t=>Math.atan2(2*bend*t,len),sw=Math.max(2.2,o.sw||len*.06),rw=Math.max(L88_PW+.25,len*.016),lw=Math.max(L88_PW,len*(o.lw??.03));
  const s1=at(sh);E('path',{d:`M0,${f(-sw/2)}Q${f(len*sh*.5)},${f(-sw*.42)} ${f(s1[0])},${f(s1[1]-rw/2)}L${f(s1[0])},${f(s1[1]+rw/2)}Q${f(len*sh*.5)},${f(sw*.42)} 0,${f(sw/2)}Z`,fill:toneAt(P,.66),stroke:P.d1,'stroke-width':.35,'stroke-opacity':.6},g);
  let dm=`M${f(s1[0])},${f(s1[1])}`;for(let i=1;i<=8;i++){const p=at(sh+(1-sh)*i/8);dm+=`L${f(p[0])},${f(p[1])}`}let dl='';
  const seg=(px,py,a,l)=>{const ex=px+Math.cos(a)*l,ey=py+Math.sin(a)*l*ct;let q=`M${f(px)},${f(py)}L${f(ex)},${f(ey)}`;
    if(o.fork){for(const s of[-1,1]){const b=a+s*.42;q+=`M${f(ex)},${f(ey)}l${f(Math.cos(b)*l*.32)},${f(Math.sin(b)*l*.32*ct)}`}}return q};
  const lob=(px,py,a,l,s)=>{let d=`M${f(px)},${f(py)}l${f(Math.cos(a)*l)},${f(Math.sin(a)*l*ct)}`,q='';
    for(let j=0;j<nl;j++){const u=(j+.6)/(nl+.4),bx=px+Math.cos(a)*l*u,by=py+Math.sin(a)*l*u*ct,ll=l*(o.ll??.32)*(1-.45*u);for(const ss of[-1,1]){if(j===0&&ss===s&&nl>2)continue;q+=seg(bx,by,a+ss*(o.la??.7),ll)}}
    q+=seg(px+Math.cos(a)*l,py+Math.sin(a)*l*ct,a,l*.18);return[d,q]};
  for(let k=0;k<np;k++){const t=sh+(1-sh)*(.08+.82*k/Math.max(1,np-1)),a0=ta(t),l=len*(o.pl??.36)*(1-.55*k/Math.max(1,np))*R(.9,1.08);
    for(const s of[-1,1]){const pp=at(Math.min(.98,t+(s>0?.035:0))),[d,q]=lob(pp[0],pp[1],a0+s*(o.pa??.95)*R(.88,1.1),l,s);dm+=d;dl+=q}}
  const e=at(1),[d,q]=lob(e[0],e[1],ta(1),len*.14,1);dm+=d;dl+=q;
  E('path',{d:dm,stroke:P.d1,'stroke-width':f(rw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
  E('path',{d:dl,stroke:toneAt(P,.6),'stroke-width':f(lw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
  if(!LOD&&DET>=1.5)E('path',{d:dl,stroke:P.l1,'stroke-width':f(lw*.35),'stroke-opacity':.5,fill:'none','stroke-linecap':'round',transform:'translate(-.2,-.25)'},g);return g}

/* ---------- a pinnate leaf in 2D (tansy): a narrowly winged rachis, many pairs of lanceolate segments, each cut into sharp forward teeth; lower halves shaded ---------- */
function l88Fern(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),det=DET>=1.5,np=o.np||(det?10:7),pl=len*.08,bend=R(-.09,.09)*len,ct=o.ct??.85,
    at=t=>[pl+(len-pl)*t,bend*t*t],ta=t=>Math.atan2(2*bend*t,len-pl),nt=det?6:4;let dr='M0,0',ds='',dh='',dv='';for(let i=1;i<=10;i++){const p=at(i/10);dr+=`L${f(p[0])},${f(p[1])}`}
  const segm=(p,a,ls,ws)=>{const ca=Math.cos(a),sa=Math.sin(a),T=(u,v)=>[p[0]+ca*u-sa*v,p[1]+(sa*u+ca*v)*ct],up=[],dn=[];
    for(let i=0;i<=nt*2;i++){const u=i/(nt*2),w=ws*Math.pow(Math.sin(Math.PI*Math.min(.97,.1+u*.9)),.75)*(1-.3*u),tooth=i%2?1.38:.82;up.push(T(ls*(u+(i%2?.03:0)),w*tooth));dn.push(T(ls*(u+(i%2?.03:0)),-w*tooth))}
    const tip=T(ls*1.04,0),o1=[T(0,0)].concat(up,[tip],dn.reverse());ds+=pD(o1)+'Z';dh+=pD([T(0,0)].concat(dn.slice().reverse(),[tip]))+'Z';dv+=`M${f(p[0])},${f(p[1])}L${f(tip[0])},${f(tip[1])}`};
  for(let k=0;k<np;k++){const t=.05+.86*k/(np-1),env=Math.pow(Math.sin(Math.PI*Math.min(.95,.22+t*.78)),.75),ls=len*.27*env*R(.9,1.08);
    for(const s of[-1,1]){const p=at(Math.min(.97,t+(s>0?.025:0))),a=ta(t)+s*(1.1-.35*t)+R(-.07,.07);segm(p,a,ls,ls*.17)}}
  {const e=at(1);segm([e[0]-len*.04,e[1]],ta(1),len*.1,len*.025)}
  E('path',{d:dr,stroke:P.d1,'stroke-width':f(Math.max(L88_PW+.3,len*.018)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:ds,fill:toneAt(P,o.I??.58),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.45,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:dh,fill:P.d1,opacity:.32},g);if(det)E('path',{d:dv,stroke:P.l1,'stroke-width':.45,'stroke-opacity':.5,fill:'none'},g)}return g}

/* ---------- the plant of a head species (an umbel, a corymb): chpHeadS of lot 17 grows the stem, its nodes and leaves, and side shoots ending in younger heads ---------- */
function l88HeadPlant(g,t,o,K){const cw=cwPick(K.cws,o),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,Ru=Dm/2,k=G(g),
    B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,K.upK??.4))),sc=cw.st||K.sc,lc=cw.lc||K.lc;
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:K.aimK??.2,D:Dm,w:Dm*K.w,cols:sc,op,nodes:K.nodes,li:K.li,lp:K.lp,leafAng:K.leafAng??46,side:K.side,seg:.1,wig:K.wig??.035,e:.012,
    apex:Bm=>V3.sc(Bm[2],Ru*(K.ap??.25)),
    flower:(par,Bf,O,op2)=>K.head(par,Bf,O,Ru,op2,cw,0),
    young:(par,Bf,O,a)=>K.head(par,Bf,O,Ru*(.5+.25*a),a,cw,1),
    leaf:(og,pos)=>{const top=og.p.i<=1,len=Dm*(top?R(.55,.75):R(.9,1.2))*(K.lk||1);return lsLeaf2D(og,pos,len,(par,x,y,a,l)=>K.leaf(par,x,y,a,l,lc,top,Dm))}});
  open(k,t,1000,8,.3);return r}

/* ---------- a compound umbel (dill, orlaya): primary rays from the top of the peduncle to the umbellets, each a little dome of tiny florets on a shaded cushion so none floats.
   It opens from a tight ball (the bud) through a cup to a flat lace. In orlaya the outer florets of the outer umbellets carry one huge two-lobed outer petal and two smaller side ones,
   all turned outward: the ring of lace round the umbel. Fruiting umbels (cw.seed): ribbed fruits instead of florets, no petals.
   U: nR rays, nf florets per umbellet, dome (< 0 domed), ruK umbellet radius, fl floret size, rw ray width (×Ru), mp marginal petal (×Ru), br involucre {n,len}, rc/bud/eye colours ---------- */
function l88Umb(par,Bu,O,Ru,a,cw,U,young){const seed=!!cw.seed,q=seed?1:sm01((a-.08)/.82),det=DET>=1.5,lod=LOD?.6:1,g=G(par),
    nR=Math.max(5,Math.round(U.nR*(young?.75:1)*(det?1:.75)*lod)),nF=Math.max(5,Math.round(U.nf*(det?1:.6)*lod)),
    Rs=Ru*(U.rsK||1)*(seed?.85:.2+.8*q),kap=seed?.12:q<.5?.32:LERP(.32,U.dome,(q-.5)/.5),H0=Ru*(seed?.28:.2+.18*q),ru0=Ru*U.ruK*(seed?.9:.55+.45*q),rot=R(0,6.283),
    tb=seed?1:sm01((q-.1)/.36),Rb=Ru*(.14+.1*q),Hb=Ru*.14+Rb,el=toV(Bu,[0,0,1])[2],bc=U.bud,
    cO=seed?cw.c:mix(cw.c,bc,(1-q)*.7),cI=seed?shd(cw.c,-.12):mix(cw.c2||cw.c,bc,(1-q)*.7),orl=U.kind==='orl'&&!seed&&q>.22;
  const um=[];for(let i=0;i<nR;i++){const rho=Math.min(1,Math.sqrt((i+.6)/nR)*R(.95,1.02)),ph=i*2.39996+rot+R(-.1,.1),cp=Math.cos(ph),sp=Math.sin(ph),th=rho*1.9,
      nS=V3.nz([-2*kap*rho*cp,-2*kap*rho*sp,1]),nB=[Math.sin(th)*cp,Math.sin(th)*sp,Math.cos(th)],n=V3.nz(V3.add(V3.sc(nB,1-tb),V3.sc(nS,tb))),ru=ru0*(.72+.38*rho)*R(.9,1.08),
      PS=[rho*Rs*cp,rho*Rs*sp,H0+kap*Rs*rho*rho],PB=[Rb*Math.sin(th)*cp,Rb*Math.sin(th)*sp,Hb+Rb*Math.cos(th)],C=V3.add(V3.add(V3.sc(PB,1-tb),V3.sc(PS,tb)),V3.sc(n,ru*.12));
    um.push({i,rho,ph,n,ru,C,nV:toV(Bu,n),z:PJ(Bu,O,C)[2],col:rho<.5&&cw.c2?1:0})}
  /* rays: quadratic curves from the top of the peduncle to the foot of each umbellet's cushion, bowed outward in the cup */
  const bx=LERP(.4,LERP(.95,.45,q),tb),bz=LERP(.8,LERP(.3,.6,q),tb),rw=Math.max(L88_PW,Ru*(U.rw||.01)),r0=PJ(Bu,O,[0,0,Ru*.012]);
  for(const u of um){const Pb=V3s(u.C,V3.sc(u.n,u.ru*.14)),c=PJ(Bu,O,[Pb[0]*bx,Pb[1]*bx,Pb[2]*bz]),e=PJ(Bu,O,Pb);u.ray=`M${f(r0[0])},${f(r0[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`}
  /* the involucre (orlaya): a few short lanceolate bracts with pale margins, spreading under the umbel */
  const brs=[];if(U.br&&!seed){const b=U.br;for(let j=0;j<b.n;j++){const th=j/b.n*6.283+rot*.7+R(-.2,.2),be=LERP(40,-25,q)*D+R(-.1,.1),Lb=Ru*b.len*R(.8,1.15),dir=[Math.cos(th)*Math.cos(be),Math.sin(th)*Math.cos(be),Math.sin(be)],
      tg=[-Math.sin(th),Math.cos(th),0],w=Math.max(.8,Lb*.16),p0=PJ(Bu,O,V3.add([0,0,-Ru*.01],V3.sc(tg,w))),p1=PJ(Bu,O,V3.add([0,0,-Ru*.01],V3.sc(tg,-w))),pm=PJ(Bu,O,V3.add(V3.sc(dir,Lb*.5),[0,0,-Lb*.08])),pe=PJ(Bu,O,V3.add(V3.sc(dir,Lb),[0,0,-Lb*.2]));
    brs.push({d:`M${f(p0[0])},${f(p0[1])}Q${f(pm[0])},${f(pm[1])} ${f(pe[0])},${f(pe[1])}Q${f(pm[0])},${f(pm[1])} ${f(p1[0])},${f(p1[1])}Z`,front:pm[2]>O[2]})}}
  /* the outer petals of orlaya: two-lobed, widest near the notched tip, cupped a little; along the umbellet's outward direction, in its plane */
  const petal=(base,dir,tg,nn,Lp,Wp)=>{const nk=det?6:4,P2=[],x0=Lp-Wp*.5,T=(x,y)=>PJ(Bu,O,V3.add(V3.add(base,V3.sc(dir,x)),V3.add(V3.sc(tg,y),V3.sc(nn,Lp*.08*Math.sin(Math.PI*Math.min(1,x/Lp))))));
    for(let i=0;i<=nk;i++){const s=i/nk;P2.push(T(x0*s,Wp*(.16+.84*Math.pow(s,.6))))}
    for(const cy of[.5,-.5])for(let i=1;i<=nk;i++){const a=Math.PI/2-Math.PI*i/nk;P2.push(T(x0+Wp*.5*Math.cos(a),Wp*(cy+.5*Math.sin(a))))}
    for(let i=nk;i>=0;i--){const s=i/nk;P2.push(T(x0*s,-Wp*(.16+.84*Math.pow(s,.6))))}
    return'M'+P2.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'};
  const PO=pal7(cO),PI=pal7(cI),lite=h2l(cO)[2]>.84,drawSet=list=>{let dr='',dc='',dO='',dI='',dB='',de='',dh='',dP='',dQ='',IO=0,II=0,nO=0,nI=0,IP=0,nP=0;
    for(const u of list){const[Xu,Yu]=l31Fr(u.n),C0=V3s(u.C,V3.sc(u.n,u.ru*.12)),cs=PJ(Bu,O,C0),e1=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Xu,u.ru*.92))),cs),e2=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Yu,u.ru*.92))),cs);
      dc+=chpEll(cs,e1,e2,Math.max(.6,u.ru*.3));const front=u.nV[2]>=0,I=.6+(lightI(front?u.nV:V3.sc(u.nV,-1))-.6)*.55-(front?0:.08);if(u.col){II+=I;nI++}else{IO+=I;nO++}
      if(orl&&u.rho>.62){/* the marginal florets: outward in the umbel's plane, tilted up a little */const out=V3.nz(V3s([Math.cos(u.ph),Math.sin(u.ph),0],V3.sc(u.n,V3.dot([Math.cos(u.ph),Math.sin(u.ph),0],u.n)))),
          tgo=V3.cr(u.n,out),pk=sm01((q-.22)/.6),Lp=Ru*U.mp*(.35+.65*pk)*(.75+.35*u.rho)*R(.88,1.1),nm=det?3:2;
        for(let m=0;m<nm;m++){const da=(m-(nm-1)/2)*(nm>2?.42:.5)+R(-.05,.05),dir=V3.nz(V3.add(V3.add(V3.sc(out,Math.cos(da)),V3.sc(tgo,Math.sin(da))),V3.sc(u.n,.12))),tg=V3.cr(u.n,dir),
            base=V3.add(u.C,V3.sc(dir,u.ru*.62)),nv=toV(Bu,u.n),fr=nv[2]>=0;const pth=petal(base,dir,tg,u.n,Lp*(m===(nm-1)/2||nm===2?1:.82),Lp*.42)+petal(V3.add(base,V3.sc(tg,Lp*.12)),V3.nz(V3.add(V3.sc(dir,.35),V3.sc(tg,.95))),V3.nz(V3.add(V3.sc(tg,-.35),V3.sc(dir,.95))),u.n,Lp*.3,Lp*.15)+petal(V3.add(base,V3.sc(tg,-Lp*.12)),V3.nz(V3.add(V3.sc(dir,.35),V3.sc(tg,-.95))),V3.nz(V3.add(V3.sc(tg,.35),V3.sc(dir,.95))),u.n,Lp*.3,Lp*.15);
          if(fr){dP+=pth;IP+=lightI(nv);nP++}else dQ+=pth}}
      const rf0=u.ru*U.fl/Math.sqrt(nF),lit=front&&V3.dot(u.nV,LIGHT)>.2;
      for(let j=0;j<nF;j++){const sg=Math.sqrt((j+.5)/nF),ps=j*2.39996+u.i*1.7,rf=rf0*(seed?1.25:.7+.3*q),
          p=V3.add(u.C,V3.add(V3.add(V3.sc(Xu,Math.cos(ps)*sg*u.ru*.9),V3.sc(Yu,Math.sin(ps)*sg*u.ru*.9)),V3.sc(u.n,u.ru*.3*(1-sg*sg)))),s=PJ(Bu,O,p),rr=Math.max(.5,rf*(.7+.3*Math.abs(u.nV[2])));
        const dd=seed?chpEll([s[0],s[1]],[Math.cos(ps)*rr*1.3,Math.sin(ps)*rr*1.3*(.5+.5*Math.abs(u.nV[2]))],[-Math.sin(ps)*rr*.75,Math.cos(ps)*rr*.75],.45):chpDot(s[0],s[1],rr);
        if(!front)dB+=dd;else if(u.col)dI+=dd;else dO+=dd;if(det&&front&&q>.45&&!seed&&j%2===0)de+=chpDot(s[0],s[1],rr*.32);if(U.rl&&det&&q>.3&&sg>.55){const b0=PJ(Bu,O,V3s(u.C,V3.sc(u.n,u.ru*.1)));dr+=`M${f(b0[0])},${f(b0[1])}L${f(s[0])},${f(s[1])}`}if(lit&&sg<.8&&j%3===0)dh+=chpDot(s[0]-rr*.22,s[1]-rr*.28,rr*.45)}}
    if(dc)E('path',{d:dc,fill:shd(cO,lite?-.3:-.36)},g);if(dr)E('path',{d:dr,stroke:cw.ray||U.rc,'stroke-width':.6,'stroke-opacity':.8,fill:'none'},g);
    if(dQ)E('path',{d:dQ,fill:toneAt(pal7(mix(cO,'#b4bca4',.25)),.5),stroke:shd(cO,-.4),'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
    if(dP)E('path',{d:dP,fill:toneAt(PO,Math.min(.92,.62+(IP/nP-.6)*.6)),stroke:shd(cO,-.4),'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
    const sw=lite?.26:.22,so=lite?.5:.35,sk=lite?shd(cO,-.42):PO.d1;
    if(dB){const cb=mix(cO,'#8c9a74',.3);E('path',{d:dB,fill:toneAt(pal7(cb),.48),stroke:shd(cb,-.4),'stroke-width':.24,'stroke-opacity':.5},g)}
    if(dO)E('path',{d:dO,fill:toneAt(PO,nO?IO/nO:.6),stroke:sk,'stroke-width':seed?.35:sw,'stroke-opacity':seed?.7:so},g);if(dI)E('path',{d:dI,fill:toneAt(PI,nI?II/nI:.6),stroke:lite?shd(cI,-.42):PI.d1,'stroke-width':sw,'stroke-opacity':so},g);
    if(de)E('path',{d:de,fill:U.eye||shd(cO,-.2),opacity:.6},g);if(dh&&!LOD)E('path',{d:dh,fill:PO.l2,opacity:.65},g)};
  const sets=um.slice().sort((p,r)=>p.z-r.z),half=[sets.slice(0,sets.length>>1),sets.slice(sets.length>>1)],
    bracts=fr=>{let d='';for(const b of brs)if(b.front===fr)d+=b.d;if(d)E('path',{d,fill:'#86a462',stroke:'#e8ecd8','stroke-width':.45,'stroke-opacity':.8,'stroke-linejoin':'round'},g)},
    rays=list=>{let d='';for(const u of list)d+=u.ray;if(d)E('path',{d,stroke:cw.ray||U.rc,'stroke-width':f(rw),fill:'none','stroke-linecap':'round'},g)};
  if(el>.3){bracts(false);bracts(true);rays(um);for(const h of half)drawSet(h)}
  else if(el<-.25){for(const h of half)drawSet(h);rays(um);bracts(false);bracts(true)}
  else{bracts(false);for(const h of half){rays(h);drawSet(h)}bracts(true)}
  return g}

/* ---------- dill (Anethum graveolens; 'Mammoth', 'Bouquet', 'Dukat'): a tall hollow, finely striped blue-green stem; a broad flat umbel 10–20 cm of 15–40 slender unequal rays,
   no involucre and no involucels; each umbellet a loose dome of tiny bright yellow florets with incurved petals; leaves three or four times cut into thread-like segments,
   on wide sheathing petioles; younger umbels on side shoots; in seed the umbel stays open, crowded with flat ribbed fruits ---------- */
const CW_L88AN=[{id:'jaune-vert',n:'Jaune verdâtre (Bouquet)',c:'#c9c93b'},{id:'jaune',n:'Jaune vif (Mammoth)',c:'#d8d03c'},{id:'or',n:'Jaune d’or (Dukat)',c:'#e3c834'},
  {id:'graines',n:'Vert en graines',c:'#8fa556',seed:1,f:'seed',ray:'#8a9a5a'}];
const L88_AN={cws:CW_L88AN,cm:12,w:.045,nodes:2,li:.6,lp:1.25,upK:.42,ap:.28,side:{p:.85,n:1,top:2,len:1.2,ang:30,age:[.1,.7],e:.05},sc:['#2c4a3a','#4e7260','#7c9c8a','#b2c8b8'],lc:'#5c8a64',
  head:(par,B,O,Ru,a,cw,y)=>l88Umb(par,B,O,Ru,a,cw,{nR:30,nf:20,dome:-.05,ruK:.12,fl:.86,rl:1,rw:.009,rc:'#86a468',bud:'#9cae5c',eye:'#a89a24'},y),
  leaf:(par,x,y,a,l,lc,top,Dm)=>l88Cut(par,x,y,a,l,lc,top?{np:3,nl:3,lw:.012,pl:.42,ll:.42,la:.5,fork:1,sw:Dm*.06}:{np:4,nl:3,lw:.012,pl:.44,ll:.42,la:.55,fork:1,sw:Dm*.07})};
const l88Aneth=(g,t,o)=>l88HeadPlant(g,t,o,L88_AN);

/* ---------- orlaya (Orlaya grandiflora, 'White Lace'): a flat white umbel 5–10 cm of 5–12 rays; the outer florets of the outer umbellets bear one huge notched outer petal
   (up to 1.5 cm) and two smaller side ones, all turned outward — a ring of lace round small inner umbellets; a few short bracts with white margins under it;
   leaves two or three times cut into narrow lobes; in fruit, spiny ovoid fruits ---------- */
const CW_L88OR=[{id:'blanc',n:'Blanc pur (White Lace)',c:'#f8f8f3'},{id:'blanc-verdi',n:'Blanc verdi (jeune)',c:'#e9eedb',c2:'#dce4c4'},{id:'fruits',n:'En fruits (vert)',c:'#a0b46b',seed:1,f:'seed'}];
const L88_OR={cws:CW_L88OR,cm:8,w:.05,nodes:2,li:.7,lp:1.25,upK:.42,ap:.25,side:{p:.9,n:1,top:2,len:1.25,ang:30,age:[.12,.8],e:.05},sc:['#2e4a22','#4f7038','#78985c','#a8c48c'],lc:'#55783a',
  head:(par,B,O,Ru,a,cw,y)=>l88Umb(par,B,O,Ru,a,cw,{kind:'orl',nR:9,nf:14,dome:-.03,ruK:.19,fl:.9,rw:.014,mp:.46,rsK:.66,br:{n:6,len:.22},rc:'#7f9e60',bud:'#c4ceaa',eye:'#dcdcb4'},y),
  leaf:(par,x,y,a,l,lc,top,Dm)=>l88Cut(par,x,y,a,l,lc,top?{np:3,nl:2,lw:.022,pl:.34,ll:.38,sw:Dm*.06}:{np:4,nl:3,lw:.022,pl:.38,ll:.36,sw:Dm*.07})};
const l88Orlaya=(g,t,o)=>l88HeadPlant(g,t,o,L88_OR);

/* ---------- tansy (Tanacetum vulgare): a flat-topped corymb 7–12 cm of 20–80 golden buttons (7–10 mm), rayless heads of tiny tubular florets, flat or a little domed, their centre
   slightly sunk, on a green involucre of overlapping bracts; the branches of the corymb leave the stem at several heights and bring the buttons level; a stiff ridged stem,
   often reddish below; leaves pinnate, 10–20 cm, of many pairs of toothed lanceolate segments on a winged rachis, dark green and aromatic ---------- */
const CW_L88TA=[{id:'or',n:'Jaune d’or',c:'#e2b31f'},{id:'citron',n:'Jaune citron (jeune)',c:'#e8cc3a'},{id:'ocre',n:'Ocre doré (mûr)',c:'#c79a2a'},
  {id:'isla',n:'Jaune d’or, feuillage doré (Isla Gold)',c:'#e4b628',lc:'#9aa83e'}];
/* the corymb: clusters of buttons on branched peduncles, on a flat or slightly domed surface; buttons a lower ellipse (involucre) and a domed top, toned by their facing */
function l88Tan(par,Bu,O,Ru,a,cw,y){const q=sm01((a-.05)/.8),det=DET>=1.5,lod=LOD?.6:1,g=G(par),nC=Math.max(4,Math.round((y?7:13)*(det?1:.8)*lod)),Rs=Ru*(.42+.58*q),kap=LERP(-.5,-.1,q),H0=Ru*.2,rot=R(0,6.283),
    bc='#8e9a4c',col=mix(cw.c,bc,(1-q)*.75),P=pal7(col),PV=pal7(mix(col,'#6f8a3c',.55)),items=[],rb0=Ru*.088*(.55+.45*q);
  for(let i=0;i<nC;i++){const rho=Math.min(1,Math.sqrt((i+.6)/nC)*R(.95,1.03)),ph=i*2.39996+rot+R(-.12,.12),cp=Math.cos(ph),sp=Math.sin(ph),n=V3.nz([-2*kap*rho*cp*.6,-2*kap*rho*sp*.6,1]),
      C=[rho*Rs*cp,rho*Rs*sp,H0+kap*Rs*rho*rho],nb=Math.max(2,Math.round((det?5:4)*R(.75,1.25))),rc=Ru*.2*(.6+.4*q),[Xc,Yc]=l31Fr(n),fk=V3s(C,V3.sc(n,Ru*(.22+.1*rho)));
    /* the branch from the top of the peduncle (the outer ones from lower down) to the fork under the cluster */
    const o0=[0,0,-Ru*.25*rho*rho],m0=[fk[0]*.5,fk[1]*.5,fk[2]*.35+o0[2]*.65],pa=PJ(Bu,O,o0),pm=PJ(Bu,O,m0),pf=PJ(Bu,O,fk);
    items.push({z:(pa[2]+pf[2])/2-.2,fn:B=>l30Add(B,'r',`M${f(pa[0])},${f(pa[1])}Q${f(pm[0])},${f(pm[1])} ${f(pf[0])},${f(pf[1])}`)});
    for(let j=0;j<nb;j++){const sg=Math.sqrt((j+.4)/nb),ps=j*2.39996+i,rb=rb0*R(.85,1.12)*(j?1:1.08),P0=V3.add(C,V3.add(V3.sc(Xc,Math.cos(ps)*sg*rc),V3.sc(Yc,Math.sin(ps)*sg*rc))),
        nn=V3.nz(V3.add(n,V3.add(V3.sc(Xc,Math.cos(ps)*sg*.25),V3.sc(Yc,Math.sin(ps)*sg*.25)))),nV=toV(Bu,nn),ft=V3s(P0,V3.sc(nn,rb*.45)),pft=PJ(Bu,O,ft),pk=PJ(Bu,O,fk);
      const front=nV[2]>=0,I=lightI(front?nV:V3.sc(nV,-1)),top=V3.add(P0,V3.sc(nn,rb*.12)),bot=V3s(P0,V3.sc(nn,rb*.32)),tV=PJ(Bu,O,top),bV=PJ(Bu,O,bot),[Xn,Yn]=l31Fr(nn),
        hullB=()=>{const pp=[];for(let m=0;m<10;m++){const aa=m*.6283;for(const[cc,r]of[[top,rb*.98],[V3s(bot,V3.sc(nn,rb*.1)),rb*.8]]){const v=PJ(Bu,O,V3.add(cc,V3.add(V3.sc(Xn,Math.cos(aa)*r),V3.sc(Yn,Math.sin(aa)*r))));pp.push([v[0],v[1]])}}const a=PJ(Bu,O,V3.add(P0,V3.sc(nn,rb*.45)));pp.push([a[0],a[1]]);return pD(l30Hull(pp))+'Z'},
        ell=(c,r,s=1)=>{const a1=V3s(PJ(Bu,O,V3.add(c,V3.sc(Xn,r))),PJ(Bu,O,c)),a2=V3s(PJ(Bu,O,V3.add(c,V3.sc(Yn,r*s))),PJ(Bu,O,c));const cc=PJ(Bu,O,c);return chpEll([cc[0],cc[1]],a1,a2,.5)};
      items.push({z:tV[2],fn:B=>{l30Add(B,'p',`M${f(pk[0])},${f(pk[1])}L${f(pft[0])},${f(pft[1])}`);
        if(front){l30Add(B,'iv',hullB());l30Add(B,'b'+(I>.74?2:I>.56?1:0),ell(top,rb));if(q>.3&&(det||rb>2.6))l30Add(B,'nv',chpDot(tV[0],tV[1],Math.max(.45,rb*.22)));
          if(det&&q>.3){let d='';for(let m=0;m<7;m++){const aa=m*.8976+ps,pp=PJ(Bu,O,V3.add(top,V3.add(V3.sc(Xn,Math.cos(aa)*rb*.58),V3.sc(Yn,Math.sin(aa)*rb*.58))));d+=chpDot(pp[0],pp[1],rb*.11)}l30Add(B,'gr',d)}
          if(I>.66&&!LOD)l30Add(B,'h',chpDot(tV[0]-rb*.28,tV[1]-rb*.3,rb*.3))}
        else{l30Add(B,'bq',hullB());l30Add(B,'ivb',ell(bot,rb*.9))}}})}}
  const bins=[],nbn=det?8:4;items.sort((p,r)=>p.z-r.z);const per=Math.max(1,Math.ceil(items.length/nbn));for(let i=0;i<items.length;i+=per)bins.push(items.slice(i,i+per));
  const tw=mix('#55703a',col,.1),keys=[['r',l88SK(tw,Math.max(L88_PW+.2,Ru*.016))],['p',l88SK(tw,L88_PW)],['iv',{fill:toneAt(PV,.5),stroke:PV.d2,'stroke-width':.3,'stroke-opacity':.6}],
    ['bq',{fill:toneAt(P,.4),stroke:P.d2,'stroke-width':.3,'stroke-opacity':.6}],['b0',{fill:toneAt(P,.48),stroke:P.d2,'stroke-width':.3,'stroke-opacity':.55}],
    ['b1',{fill:toneAt(P,.62),stroke:P.d1,'stroke-width':.3,'stroke-opacity':.55}],['b2',{fill:toneAt(P,.76),stroke:P.d1,'stroke-width':.3,'stroke-opacity':.5}],
    ['ivb',{fill:toneAt(PV,.42),stroke:PV.d2,'stroke-width':.3,'stroke-opacity':.6}],['gr',{fill:P.d1,opacity:.5}],['nv',{fill:P.d2,opacity:.55}],['h',{fill:P.l2,opacity:.55}]];
  for(const sl of bins){const B={};for(const it of sl)it.fn(B);for(const[k,at]of keys)if(B[k])E('path',Object.assign({d:B[k]},at),g)}
  return g}
const L88_TA={cws:CW_L88TA,cm:9,w:.06,nodes:3,li:.5,lp:.75,upK:.3,aimK:.35,ap:.16,side:{p:.75,n:1,top:2,len:.95,ang:28,age:[.08,.7],e:.05},sc:['#3a3a1e','#5e5c34','#868250','#b4b082'],lc:'#4a7434',lk:1.05,leafAng:44,
  head:(par,B,O,Ru,a,cw,y)=>l88Tan(par,B,O,Ru,a,cw,y),
  leaf:(par,x,y,a,l,lc,top)=>l88Fern(par,x,y,a,l,lc,top?{np:DET>=1.5?8:6}:{})};
const l88Tanaisie=(g,t,o)=>l88HeadPlant(g,t,o,L88_TA);

/* ---------- bupleurum (Bupleurum rotundifolium, sold as B. griffithii 'Green Gold'): a glaucous branched stem; every branch passes through a round-ovate perfoliate leaf
   (the blade wraps the stem, fine veins radiating from it); at the tips small compound umbels of 4–8 short rays, each umbellet a cup of five broad pointed yellow-green
   bracteoles round a tight knot of tiny yellow flowers; the branches fork under the umbels, each fork through its own small leaf ---------- */
const CW_L88BU=[{id:'vert-acide',n:'Vert acide (Green Gold)',c:'#b5c43d'},{id:'jaune-vert',n:'Jaune-vert (Griffithii)',c:'#c5cf50'},{id:'vert',n:'Vert tendre (Garden Green)',c:'#9dba5b'}];
/* a small umbel at O (view space) leaving along Z: its rays, umbellets of five bracteoles and florets, as items for the batches */
function l88BupUmb(items,O,Z,s,age,cw){const q=sm01((age-.05)/.75),det=DET>=1.5,nr=Math.max(4,Math.round((det?7:5)*R(.8,1.15))),[X,Y]=l31Fr(Z),ph0=R(0,6.283),bl=s*(.52+.14*q),rot=R(0,1.2);
  for(let i=0;i<nr;i++){const ph=ph0+i*6.283/nr+R(-.15,.15),rd=V3.add(V3.sc(X,Math.cos(ph)),V3.sc(Y,Math.sin(ph))),cen=i===0&&nr>5,el=cen?0:(18+34*q)*D,dir=V3.nz(V3.add(V3.sc(Z,Math.cos(el)),V3.sc(rd,Math.sin(el)))),
      ls=s*(cen?.55:.8+.2*q)*R(.85,1.1),c=V3.add(O,V3.sc(dir,ls)),nu=V3.nz(V3.add(V3.sc(dir,.55),V3.sc(Z,.55))),[Xu,Yu]=l31Fr(nu),bel=(10+36*q)*D,cz=c[2];
    items.push({z:(O[2]+cz)/2-.1,fn:B=>l30Add(B,'ry',l88Seg(O,c))});
    /* five bracteoles: broad, pointed, cupped toward the flowers; behind or in front of them by depth, each toned by the face it shows */
    for(let j=0;j<5;j++){const a=rot+j*1.2566,ra=V3.add(V3.sc(Xu,Math.cos(a)),V3.sc(Yu,Math.sin(a))),tg=V3.add(V3.sc(Xu,-Math.sin(a)),V3.sc(Yu,Math.cos(a))),db=V3.nz(V3.add(V3.sc(nu,Math.cos(bel)),V3.sc(ra,Math.sin(bel)))),
        nI=V3.nz(V3.cr(tg,db)),inner=V3.dot(nI,nu)>0?nI:V3.sc(nI,-1),L1=[],R1=[],nk=det?6:4;
      for(let k=0;k<=nk;k++){const v=k/nk,w=bl*.44*Math.pow(Math.sin(Math.PI*Math.min(.98,.1+v*.9)),.7)*(1-.3*v*v),cu=bl*.12*(1-Math.abs(.5-v)*2)*.6,
          m=V3.add(V3.add(c,V3.sc(ra,bl*.06)),V3.add(V3.sc(db,bl*v),V3.sc(inner,cu)));L1.push(V3.add(m,V3.sc(tg,w)));R1.push(V3.add(m,V3.sc(tg,-w)))}
      const tip=V3.add(V3.add(c,V3.sc(ra,bl*.06)),V3.sc(db,bl*1.1)),poly=L1.concat([tip],R1.reverse()),mid=V3.add(c,V3.sc(db,bl*.5)),vis=inner[2]>=0,I=lightI(vis?inner:V3.sc(inner,-1)),
        k0=vis?(I>.62?'i1':'i0'):'o',front=mid[2]>cz+bl*.05&&Math.abs(toV(I3,nu)[2])<.75,vn=l88Seg(V3.add(c,V3.sc(db,bl*.1)),V3.add(c,V3.sc(db,bl*.92)));
      items.push({z:front?mid[2]+.05:cz-.05+mid[2]*.001,fn:B=>{l30Add(B,(front?'f':'k')+k0,l88Poly(poly));if(det)l30Add(B,front?'vf':'vk',vn)}})}
    /* the knot of florets inside the cup */
    const nf=det?11:6,rf=Math.max(.5,s*.07);items.push({z:cz+.02,fn:B=>{let d='',e='';for(let m=0;m<nf;m++){const sg=Math.sqrt((m+.5)/nf),aa=m*2.39996,p=V3.add(V3.add(c,V3.sc(nu,bl*(.18+.12*(1-sg*sg)))),V3.add(V3.sc(Xu,Math.cos(aa)*sg*bl*.26),V3.sc(Yu,Math.sin(aa)*sg*bl*.26)));
        d+=chpDot(p[0],-p[1],rf*(q<.3?.8:1));if(det&&q>.4&&m%2===0)e+=chpDot(p[0],-p[1],rf*.4)}l30Add(B,'fl',d);if(e)l30Add(B,'fe',e)}})}}
function l88Bupleurum(g,t,o){const cw=cwPick(CW_L88BU,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||25)*UPC,det=DET>=1.5,sc=['#33503a','#56785e','#82a28a','#b8ccb8'],tw='#5c7e60',lc=cw.lc||'#7f9e7a',w0=3,w1=1.4;
  return bzShoot(g,t,o,{Lt:C*2,w0,w1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Lb=UPC*3.6*Math.sqrt(C/(25*UPC));
    /* a perfoliate leaf at P: its plane across the axis H, tilted so its tip (toward side d) droops; the axis drawn again through it on the side that faces us */
    const perf=(P,H,d0,len,w,z0,tc)=>{H=V3.nz(H);let d=V3.nz(V3s(d0,V3.sc(H,V3.dot(d0,H))));const be=R(28,42)*D,dd=V3.nz(V3.add(V3.sc(d,Math.cos(be)),V3.sc(H,-Math.sin(be)))),nn=V3.nz(V3.add(V3.sc(H,Math.cos(be)),V3.sc(d,Math.sin(be)))),
        nf=V3.nz(V3.add(nn,[0,0,.35*Math.sign(nn[2]||1)])),ws=Math.max(1.2,w);
      const pt=l88Disc(P,dd,nf,len*.5,lc,{nl:7,ns:2,el:1.18,off:.32,tip:.22,cup:.06,droop:.04,vb:1,nv:7,ao:.95,vmin:9,
        after:(gg,upv)=>{const a=V3.add(P,V3.sc(H,upv?len*.32:-len*.32)),Pp=[[P[0],-P[1]],[(P[0]+a[0])/2,-(P[1]+a[1])/2],[a[0],-a[1]]];if(tc||!det)E('path',{d:`M${f(Pp[0][0])},${f(Pp[0][1])}L${f(Pp[2][0])},${f(Pp[2][1])}`,stroke:tc?tw:sc[1],'stroke-width':f(tc||ws),'stroke-linecap':'round',fill:'none'},gg);else stemPoly(gg,Pp,[ws,ws*.98,ws*.96],sc)}});
      if(z0!=null)pt.z=z0;parts.push(pt)};
    const tip=(l,age,sz)=>[['F',{l:l*.78,w1:1.2,aim:[0,1,0],k:.1}],['P',{s:sz}],['F',{l:Math.max(UPC*.45,l*.22),w1:1.15}],['U',{age}]],
      fork=(l,lv)=>lv<1&&rnd()<.8?[['F',{l:l*.5,w1:1.35}],...(det?[['P',{s:.62}]]:[]),['[',{w:1.25}],['+',{a:R(24,34)}],...tip(l*.55,lv+.25,.42),[']',{}],['[',{w:1.25}],['/',{a:R(160,200)}],['+',{a:R(22,32)}],...tip(l*.45,lv+.55,.38),[']',{}]]:tip(l,lv,.5);
    const grown=res=>{l30Twigs(items,res,[[1.3,'t0'],[0,'t1']]);for(const og of res.organs){if(og.t==='U')l88BupUmb(items,og.pos,og.H,UPC*1.05*R(.85,1.12)*(.7+.3*Math.min(1,op*1.3)),Math.max(0,Math.min(1,op*1.15-og.p.age*.3)),cw);
      if(og.t==='P'){let d=V3s(og.U,V3.sc(og.H,V3.dot(og.U,og.H)));if(V3l(d)<1e-3)d=og.L;perf(og.pos,og.H,d,Lb*og.p.s*R(.9,1.1),og.w,null,og.w>=1.3?1.55:L88_PW+.05)}}};
    /* the terminal umbel above its leaf */
    {const q0=A.at(1);l88BupUmb(items,q0.p,q0.T,UPC*1.15*(.7+.3*Math.min(1,op*1.3)),Math.min(1,op*1.15),cw);const q1=A.at(A.sOf(L-UPC*.7));perf(q1.p,q1.T,q1.Fr,Lb*.6,w1+.1,null)}
    /* the branches, alternate, longer below so their umbels come level; each through a leaf on the main axis */
    const nb=det?6:5,span=C*.85;for(let i=0;i<nb;i++){const u=(i+.5)/nb,l=L-UPC*1.3-span*u;if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D,len=C*(.2+.42*u)*R(.9,1.1);
      const br=bzGrow(A,l,az,R(30,40),fork(len,0),{w:1.5,seg:UPC*.5,T:[0,1,0],e:.03,wig:.03});grown(br);
      const s=A.sOf(l),q=A.at(s),r=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),ww=w0+(w1-w0)*s;perf(q.p,q.T,r,Lb*(.75+.4*u)*R(.9,1.1),ww,null)}
    /* lower down, larger perfoliate leaves on the bare stem (above the mouth in a bouquet) */
    const lmin=o.spine?10*UPC:l0+6;for(let j=0;j<3;j++){const l=L-UPC*1.3-span-C*(.18+.24*j);if(l<lmin)continue;const s=A.sOf(l),q=A.at(s),az=(j*150+R(-20,20))*D,r=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az)));
      perf(q.p,q.T,r,Lb*(1.25+.1*j)*R(.9,1.1),w0+(w1-w0)*s,null)}
    const P=pal7(cw.c),PO=pal7(mix(cw.c,'#6f9a4a',.35)),keys=[['t0',l88SK(tw,1.55)],['t1',l88SK(tw,L88_PW+.05)],['ry',l88SK(mix(tw,cw.c,.3),L88_PW)],
      ['ko',{fill:toneAt(PO,.5),stroke:PO.d2,'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'}],['ki0',{fill:toneAt(P,.5),stroke:P.d2,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'}],
      ['ki1',{fill:toneAt(P,.68),stroke:P.d1,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'}],['vk',l88SK(P.d1,.35,{'stroke-opacity':.5})],
      ['fl',{fill:mix('#e8d23a',cw.c,.25),stroke:'#8a7a1a','stroke-width':.2,'stroke-opacity':.5}],['fe',{fill:'#b89a18',opacity:.7}],
      ['fo',{fill:toneAt(PO,.52),stroke:PO.d2,'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'}],['fi0',{fill:toneAt(P,.52),stroke:P.d2,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'}],
      ['fi1',{fill:toneAt(P,.7),stroke:P.d1,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'}],['vf',l88SK(P.d1,.35,{'stroke-opacity':.5})]];
    l30Batch(parts,items,keys,det?8:3)}})}

/* ---------- lady's mantle (Alchemilla mollis): a soft hairy stem branching into loose, repeatedly forked cymes — a froth of tiny petal-less flowers (3–5 mm), four pointed sepals
   alternating with four small epicalyx lobes round a yellow disc, acid green-yellow, clustered at the tips; the leaves round, shallowly lobed (9–11 lobes), finely toothed,
   pleated along their veins like a fan and cupped, soft grey-green; small leaves with leafy stipules on the flowering stem ---------- */
const CW_L88AL=[{id:'vert-acide',n:'Vert acide (mollis)',c:'#c3c94b'},{id:'jaune-vert',n:'Jaune-vert (Thriller)',c:'#d0d064'},{id:'vert-tendre',n:'Vert tendre (Robusta)',c:'#aabd56'}];
function l88Alchemille(g,t,o){const cw=cwPick(CW_L88AL,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,det=DET>=1.5,sc=['#3e5228','#62783e','#8ca064','#bccb98'],tw='#6e8a44',lc=cw.lc||'#7f9c58',w0=2.8,w1=1.3;
  return bzShoot(g,t,o,{Lt:C*2.5,w0,w1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],rf0=UPC*.19*Math.max(.85,Math.min(1.15,C/(15*UPC)))**.3,FW=A.at(.9).Fr;
    /* one flower at pos on the tip of its stalk H: an eight-pointed star (four sepals, four smaller epicalyx lobes) or a green bud */
    const flower=(pos,H,age)=>{const m=op*1.35-age*.42+R(-.06,.06),ax=V3.nz(V3.add(V3.add(V3.sc(H,.55),[0,.6,0]),V3.sc(FW,.45))),rf=rf0*R(.85,1.12),c=V3.add(pos,V3.sc(ax,rf*.25));
      if(m<.32){const rb=rf*(.42+.25*Math.max(0,m/.32));items.push({z:c[2],fn:B=>l30Add(B,'bd',chpDot(c[0],-c[1],Math.max(.55,rb)))});return}
      const op2=Math.min(1,(m-.32)/.45),r=rf*(.6+.4*op2),front=ax[2]>=-.05,I=lightI(front?ax:V3.sc(ax,-1)),[X,Y]=l31Fr(ax),ph=R(0,1.6);
      items.push({z:c[2]+(front?.02:-.02),fn:B=>{let d;if(det){const pts=[];for(let i=0;i<16;i++){const a=ph+i*.3927,rr=i%2?r*.36:(i%4===0?r:r*.66),p=V3.add(c,V3.add(V3.sc(X,Math.cos(a)*rr),V3.add(V3.sc(Y,Math.sin(a)*rr),V3.sc(ax,i%2?r*.06:-r*.04))));pts.push(p)}d=l88Poly(pts)}
          else d=l88Ell(c,ax,r*.78,.5);l30Add(B,front?(I>.62?'f1':'f0'):'fk',d);if(front&&det&&op2>.4)l30Add(B,'fc',l88Ell(V3.add(c,V3.sc(ax,r*.05)),ax,r*.3,.3))}})};
    /* a cyme: a flower at each fork (the oldest), two younger branches turned a quarter round; at its tips small glomerules of flowers on short pedicels */
    const cyme=(l,n,age)=>n<=0?[['F',{l:l*.6,w1:1.1,e:.05}],['K',{age,tip:1}]]:[['F',{l:l*.42,w1:1.15}],['K',{age}],['/',{a:90+R(-25,25)}],
      ['[',{w:1.15}],['+',{a:R(26,40)}],...cyme(l*.62,n-1,age+.16),[']',{}],['[',{w:1.15}],['-',{a:R(26,40)}],...cyme(l*.56,n-1,age+.24),[']',{}]];
    const grown=res=>{l30Twigs(items,res,[[1.25,'t0'],[0,'t1']]);for(const og of res.organs)if(og.t==='K'){flower(og.pos,og.H,og.p.age);
      if(og.p.tip){const ne=det?5:3;for(let j=0;j<ne;j++){const[X,Y]=l31Fr(og.H),aa=R(0,6.283),dir=V3.nz(V3.add(V3.sc(og.H,.75),V3.add(V3.sc(X,Math.cos(aa)*.7),V3.sc(Y,Math.sin(aa)*.7)))),e=V3.add(og.pos,V3.sc(dir,rf0*R(1.5,2.4)));
        items.push({z:(og.pos[2]+e[2])/2,fn:B=>l30Add(B,'t2',l88Seg(og.pos,e))});flower(e,dir,og.p.age+.1+.1*j)}}}};
    const dep=det?4:3,top=bzGrow(A,L-.5,0,4,cyme(C*.3,dep-1,0),{w:1.3,seg:UPC*.45,T:[0,1,0],e:.03,wig:.05});grown(top);
    const nb=det?6:5,span=C*.8;for(let i=0;i<nb;i++){const u=(i+.5)/nb,l=L-UPC*.8-span*u;if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D;
      grown(bzGrow(A,l,az,R(40,56),cyme(C*(.3+.26*u)*R(.9,1.1),dep-(u<.3?1:0),.1+.1*u),{w:1.4,seg:UPC*.45,T:[0,1,0],e:.035,wig:.05}))}
    /* the leaves: small kidney-shaped ones at the forks of the stem, larger round ones lower, on their petioles; each blade pleated, cupped, held toward the light */
    const lmin=o.spine?10*UPC:l0+6,nl=o.spine?2:3;for(let j=0;j<nl;j++){const l=L-span*(.55+.42*j)-UPC*1.2;if(l<lmin)continue;const s=A.sOf(l),q=A.at(s),az=(j*160+R(-20,20)+40)*D,
        r=V3.nz(V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az)))),pdir=V3.nz(V3.add(V3.sc(q.T,.55),r)),pl=UPC*(1.1+.7*j)*R(.9,1.1),Rl=UPC*(1.7+.55*j)*R(.9,1.1),
        ww=w0+(w1-w0)*s,pb=V3.add(q.p,V3.sc(r,ww*.3)),pe=V3.add(V3.add(pb,V3.sc(pdir,pl)),[0,pl*.08,0]),pm=V3.add(V3.add(pb,V3.sc(pdir,pl*.5)),[0,pl*.12,0]),
        nn=V3.nz(V3.add(V3.add([0,1,0],V3.sc(r,.3)),[0,0,.55])),dd=V3.nz(V3.add(r,V3.sc(q.T,.25)));
      const Pp=[];for(let i=0;i<=6;i++){const tt=i/6,a=(1-tt)*(1-tt),b=2*(1-tt)*tt,c2=tt*tt;Pp.push([a*pb[0]+b*pm[0]+c2*pe[0],-(a*pb[1]+b*pm[1]+c2*pe[1])])}
      parts.push({z:(pb[2]+pe[2])/2-.05,fn:par=>stemPoly(par,Pp,Pp.map((_,i)=>Math.max(1.3,1.7-.3*i/6)),sc)});
      /* the leafy stipule clasping the node */
      parts.push({z:q.p[2]+.06,fn:par=>{const st=[];for(let i=0;i<=8;i++){const a=i/8*6.283,p=V3.add(V3.add(q.p,V3.sc(q.T,UPC*.12*Math.sin(a*3)*.5)),V3.add(V3.sc(q.Fr,Math.cos(a)*ww*1.1),V3.sc(q.Sd,Math.sin(a)*ww*1.1)));st.push(p)}
        const P7=pal7(lc);E('path',{d:smooth(st.map(p=>[p[0],-p[1]])),fill:toneAt(P7,.55),stroke:P7.d2,'stroke-width':.35,'stroke-opacity':.5},par)}});
      const lf=l88Disc(pe,dd,nn,Rl,lc,{nl:j?9:7,sinus:.62,off:.38,lobe:.06,pleat:.045,cup:.16,teeth:.05,ao:.95});lf.z=Math.max(lf.z,pe[2]+.1);parts.push(lf)}
    const P=pal7(cw.c),PK=pal7(mix(cw.c,'#7a9450',.4)),keys=[['t0',l88SK(tw,1.3)],['t1',l88SK(mix(tw,'#a8bc78',.2),L88_PW+.02)],['t2',l88SK(mix(tw,cw.c,.35),L88_PW)],
      ['bd',{fill:toneAt(pal7('#8faa4c'),.55),stroke:'#4a6a2a','stroke-width':.25,'stroke-opacity':.5}],['fk',{fill:toneAt(PK,.5),stroke:PK.d2,'stroke-width':.25,'stroke-opacity':.5,'stroke-linejoin':'round'}],
      ['f0',{fill:toneAt(P,.52),stroke:P.d2,'stroke-width':.25,'stroke-opacity':.5,'stroke-linejoin':'round'}],['f1',{fill:toneAt(P,.7),stroke:P.d1,'stroke-width':.25,'stroke-opacity':.45,'stroke-linejoin':'round'}],
      ['fc',{fill:mix('#d8b828',cw.c,.3),opacity:.85}]];
    l30Batch(parts,items,keys,det?8:4)}})}

/* ---------- registries: dill, orlaya and tansy are heads grown on their stem; bupleurum and lady's mantle are branched sprays along the composer's spine ---------- */
Object.assign(GH,{'bupleurum':l88Bupleurum,'alchemille':l88Alchemille,'aneth':l88Aneth,'orlaya':l88Orlaya,'tanaisie':l88Tanaisie});
Object.assign(CWS,{'bupleurum':CW_L88BU,'alchemille':CW_L88AL,'aneth':CW_L88AN,'orlaya':CW_L88OR,'tanaisie':CW_L88TA});
Object.assign(SZG,{'bupleurum':[20,25,25,30],'alchemille':[12,15,15,18],'aneth':[10,12,12,15,18],'orlaya':[6,7,8,8,10],'tanaisie':[6,8,9,9,12]});
Object.assign(GHI,{'aneth':{form:'disque',size:1.8,k:'head',rk:1},'orlaya':{form:'disque',size:1.8,k:'head',rk:1},'tanaisie':{form:'disque',size:1.8,k:'head',rk:1},
  'bupleurum':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'alchemille':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8}});
for(const id of['aneth','orlaya','tanaisie'])GH_BUDS.add(id);
