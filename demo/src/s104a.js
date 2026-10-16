/* ================= Serre, lot 104 — australes : aulax, patte de kangourou, isopogon, hakea ; poussés par le L-système (moteurs des lots 16, 52 et 53 : protGrow, l53Grow, protAlong) ================= */
/* ---------- shared pieces ---------- */
const L104_P3=p=>[p[0],-p[1],p[2]];
const l104Op=o=>Math.max(.05,Math.min(1,o.op??R(.86,1)));
const l104Dot=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a needle or a narrow channelled leaf, round in section: its midline in 3D (arched, drooping a little), drawn as a tapered ribbon on the screen, toned by its facing, with its groove;
   o: {w half width at the base (never under .6, so it never reads as a hair), tip (half width at the tip ×w), droop, arch, face, groove} */
function l104Needle(og,pos,len,col,o={}){const fa=(o.face??.25)*Math.atan2(og.L[2],og.U[2]),U=V3.add(V3.sc(og.U,Math.cos(fa)),V3.sc(og.L,Math.sin(fa))),H=og.H,
    dr=o.droop??.06,ar=o.arch??.05,cv=o.cv||0,Lx=og.L,rc=v=>V3.add(V3.add(pos,V3.sc(H,len*v)),V3.add(V3.add(V3.sc(U,len*ar*Math.sin(Math.PI*v)),V3.sc(Lx,len*cv*v*v)),[0,-len*dr*v*v,0])),
    n=LOD?4:6,P=[],W=[],w0=Math.max(.6,o.w||.7),tp=o.tip??.55;let z=0;
  for(let i=0;i<=n;i++){const v=i/n,p=rc(v),s=L104_P3(p);P.push([s[0],s[1]]);z+=p[2];W.push(w0*(1-(1-tp)*Math.pow(v,1.3)))}
  const I=lightI(U[2]>=0?U:V3.sc(U,-1)),pp=pal7(col),tn=toneAt(pp,I);
  return{z:z/(n+1),cast:false,fn:par=>{const g=G(par);E('path',{d:polyRibbon(P,i=>W[i]),fill:tn,stroke:pp.d1,'stroke-width':.3,'stroke-opacity':.35},g);
    if(!LOD&&DET>=1.5&&o.groove&&w0>.75)E('path',{d:polyRibbon(P,i=>W[i]*.3,i=>W[i]*.3),fill:pp.l1,opacity:.5},g)}}}
/* a ball of crowded small flowers (the cushion of a hakea, the heart of an isopogon): its hull, shaded, and the bumps of the flowers where it faces the eye */
function l104Ball(k,B,O,a,hz,col,o={}){const pts=[],zc=o.zc||0;for(let i=0;i<=10;i++)for(let j=0;j<14;j++){const th=i/10*Math.PI,ph=j/14*6.283,p=PJ(B,O,[a*Math.sin(th)*Math.cos(ph),a*Math.sin(th)*Math.sin(ph),zc+hz*Math.cos(th)]);pts.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(pts)),fill:LOD?col:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.55},k);if(LOD)return;
  const nf=o.n||(DET>=1.5?60:30),rr0=a*(o.br||.14);let dd='',dl='';
  for(let i=0;i<nf;i++){const t=(i+.5)/nf,th=Math.acos(1-2*t),ph=i*2.39996,n=V3.nz([Math.sin(th)*Math.cos(ph)/a,Math.sin(th)*Math.sin(ph)/a,Math.cos(th)/hz]),nV=toV(B,n)[2];if(nV<.15)continue;
    const s=PJ(B,O,[a*Math.sin(th)*Math.cos(ph)*.97,a*Math.sin(th)*Math.sin(ph)*.97,zc+hz*Math.cos(th)*.97]),rr=rr0*(.55+.45*nV);dd+=l104Dot(s[0]+rr*.3,s[1]+rr*.4,rr);dl+=l104Dot(s[0]-rr*.3,s[1]-rr*.35,rr*.5)}
  if(dd){E('path',{d:dd,fill:shd(col,-.35),opacity:.4},k);E('path',{d:dl,fill:lt(col,.5),opacity:o.lo??.5},k)}}
/* the plant: the woody (or velvety) axis of protGrow, its head turned along the tip of the axis (l53Grow), or along the composer's spine */
function l104Grow(g,t,o,P){const k=G(g),r=o.spine?protAlong(k,o,P):l53Grow(k,o,P);open(k,t,1000,8,.3);return r}

/* ---------- aulax (Aulax cancellata, featherbush): a dioecious fynbos shrub, its upright branches crowded with needle-like channelled leaves;
   the female plant ends each branch in a globose cup of twenty to thirty-eight incurved bundles of short branchlets, flushed red, round a short axis of stalked female flowers
   that ripens into a woody cone; the male plant carries at its tips clusters of five to fifteen lax racemes, 3 to 5 cm long, fluffy with yellow flowers ---------- */
const L104_CWAUL=[{id:'rouge',n:'Coupe rouge (femelle)',c:'#b4282e',tc:'#8a1620',g:'#6a6a32',cn:'#6a2418',fl:'#ead2b4'},
  {id:'bordeaux',n:'Coupe bordeaux (femelle)',c:'#7c1c2c',tc:'#5a0e1c',g:'#545430',cn:'#4a1612',fl:'#e2c4ac'},
  {id:'vert-rouge',n:'Coupe verte rougie (femelle)',c:'#8c8a3c',tc:'#b02a2c',g:'#5e7034',cn:'#5a3418',fl:'#ecdcb4'},
  {id:'jaune',n:'Épis jaunes plumeux (mâle)',c:'#ecc936',m:1},
  {id:'citron',n:'Épis jaune citron (mâle)',c:'#dcd44e',m:1}];
const L104_AULB=prof([[0,.55],[.2,.9],[.5,1],[.8,.85],[1,.35]]);
function l104AulF(par,B,O,Dh,op,cw){const k=G(par),nz=B[2][2],o2=sm01((op-.08)/.92),rot=R(0,6.283),det=DET>=1.5,n=LOD?10:det?28:14,items=[],bo={taper:.5},rb=protBodyR(Dh*.13,-Dh*.3,Dh*.03,bo);
  for(let i=0;i<n;i++){const fr=i/(n-1),out=1-fr,phi=i*2.39996+rot,z0=-Dh*(.04+.22*out),
      /* each bundle springs out from the receptacle, then curves in over the heart: closed in the bud, a globe once open */
      l=ligule(B,O,{phi,r0:rb(z0)*.85,z0,L:Dh*(.58+.14*out)*R(.93,1.06),W:Dh*(.075+.02*out),wp:L104_AULB,a0:LERP(.25+.1*out,.7+.25*out,o2)+R(-.04,.04),a1:LERP(-.55,-.2+.35*out,o2)+R(-.06,.06),pw:1.2,th:1.1,tip:'round',tw:R(-.3,.3),n:6}),
      c=mix(cw.c,cw.g,.18*out+.3*(1-o2));
    items.push({l,z:protZ(l,B,phi,out*2,Dh),c,cb:mix(c,shd(c,-.15),.5),tipc:cw.tc,tf:.6,to:.55,ov:det?.35:0,sw:.45})}
  {const bc=shd(mix(cw.c,cw.g,.5),-.25);items.push({z:PJ(B,O,[0,0,-Dh*.15])[2],fn:kk=>protBody(kk,B,O,Dh*.13,-Dh*.3,Dh*.03,bc,Object.assign({scales:det?10:6},bo))})}
  /* the heart: the female flowers, pale and feathery, ripening into the dark cone; seen down the mouth of the cup */
  if(o2>.2){const cr=Dh*.15,ch=Dh*(.22+.12*o2),cz=nz<-.1?-1e9:PJ(B,O,[0,0,ch*.4])[2];
    items.push({z:cz,fn:kk=>{protCone(kk,B,O,cr,ch,mix(cw.fl,cw.cn,.55+.3*(1-o2)),{});if(LOD||nz<.25)return;let d='';const nn=det?16:9,rr=Math.max(.6,cr*.12);
      for(let i=0;i<nn;i++){const a=i*2.39996,t=Math.sqrt((i+.5)/nn),p=PJ(B,O,[Math.cos(a)*cr*.75*t,Math.sin(a)*cr*.75*t,ch*(1-.25*t*t)]);d+=l104Dot(p[0],p[1],rr)}E('path',{d,fill:lt(cw.fl,.3),opacity:.85},kk)}})}
  protLig(k,items);return k}
function l104AulM(par,B,O,Dh,op,cw){const k=G(par),o2=sm01((op-.05)/.95),det=DET>=1.5,nr=LOD?5:det?11:8,rot=R(0,6.283),items=[],Z=[0,0,1],pC=pal7(cw.c),sc=mix(cw.c,'#7a8a3a',.35*(1-o2)+.15);
  for(let i=0;i<nr;i++){const ph=rot+i*2.39996,cen=i===0,a=cen?R(0,.1):R(.35,.95)*(.75+.25*o2),R0=[Math.cos(ph),Math.sin(ph),0],d=V3.nz(V3.add(V3.sc(R0,Math.sin(a)),V3.sc(Z,Math.cos(a)))),
      st=Dh*R(.05,.1),Lr=Dh*R(.36,.5)*(.5+.5*o2),bend=R(.12,.28)*(.4+.6*o2),
      /* the stalk, then the lax raceme arching out under its weight */
      c=s=>s<0?V3.sc(d,st*(1+s)):V3.add(V3.add(V3.sc(d,st+s*Lr),V3.sc(R0,bend*s*s*Lr)),V3.sc(Z,-bend*.6*s*s*Lr)),
      P=[],ws=[];let z=0;const rw=Dh*.04*(.6+.4*o2);
    for(let j=0;j<=8;j++){const s=j/8,p=c(s),q=PJ(B,O,p);P.push([q[0],q[1]]);z+=q[2];ws.push(rw*(s<.08?.5+6*s:1-.45*Math.pow(s,2)))}
    const s0=PJ(B,O,c(-1)),s1=PJ(B,O,c(0)),I=lightI(toV(B,V3.nz(V3.add(R0,[0,0,.4])))),tn=toneAt(pal7(o2<.3?sc:cw.c),I);
    items.push({z:z/9,fn:kk=>{E('path',{d:`M${f(s0[0])},${f(s0[1])}L${f(s1[0])},${f(s1[1])}`,stroke:'#7a6a3a','stroke-width':f(Math.max(1.15,Dh*.012)),'stroke-linecap':'round',fill:'none'},kk);
      E('path',{d:polyRibbon(P,j=>ws[j]),fill:tn,stroke:pC.d1,'stroke-width':.35,'stroke-opacity':.5},kk);if(LOD)return;
      /* the feathery flowers: their stamens and perianth lobes standing off the raceme, each from inside it */
      let dd='',dk='';const nt=det?34:18;for(let j=0;j<nt;j++){const s=.04+.94*((j*.618034)%1),m=Math.min(7,Math.floor(s*8)),u=s*8-m,ax=[LERP(P[m][0],P[m+1][0],u),LERP(P[m][1],P[m+1][1],u)],
          dx=P[m+1][0]-P[m][0],dy=P[m+1][1]-P[m][1],l=Math.hypot(dx,dy)||1,sg=j%2?1:-1,an=R(-.6,.6),ca=Math.cos(an),sa=Math.sin(an),nx0=-dy/l*sg,ny0=dx/l*sg,nx=nx0*ca-ny0*sa,ny=nx0*sa+ny0*ca,
          w=LERP(ws[m],ws[m+1],u),ln=w*R(.5,1.1)*(o2>.3?1:.6),x0=ax[0]+nx0*w*R(-.2,.6),y0=ax[1]+ny0*w*R(-.2,.6),seg=`M${f(x0)},${f(y0)}l${f(nx*ln+dx/l*ln*.3)},${f(ny*ln+dy/l*ln*.3)}`;
        if(j%3)dd+=seg;else dk+=seg}
      E('path',{d:dk,stroke:shd(o2<.3?sc:cw.c,-.15),'stroke-width':f(Math.max(1.1,Dh*.01)),'stroke-opacity':.8,fill:'none','stroke-linecap':'round'},kk);
      E('path',{d:dd,stroke:lt(o2<.3?sc:cw.c,.3),'stroke-width':f(Math.max(1.1,Dh*.01)),'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},kk)}})}
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn(k);return k}
function l104Aulax(g,t,o){const cw=cwPick(L104_CWAUL,o),op=l104Op(o),Dh=(o.cm||25)/5*UPC*(cw.m?1.7:1)/* the size sold is the whole spray (25 cm): the female cup is a fifth of it */,
    lf=(og,pos)=>l104Needle(og,pos,(cw.m?5.5:6.5)*UPC*R(.85,1.1)*(og.p.lat?.8:1)*(1-.3*sm01(1-(og.p.i-1)/5)),'#5a7a36',{w:.75,tip:.5,droop:.04,arch:.06,cv:R(-.08,.08),groove:1});
  return l104Grow(g,t,o,{D:Dh,op,w:.4*UPC,cols:['#4a2c1e','#6a4230','#8e6448','#b48c6c'],nodes:20,li:.75*UPC,lp:(cw.m?.6:1.2)*UPC,bare:6*UPC,aimK:.1,topAng:8,follow:.7,zhk:.25,piece:8,
    leaf:{ang:i=>18+10*sm01(1-(i-1)/4),draw:lf},lat:{p:cw.m?.3:.2,n:[1,2],top:[3,8],nodes:4,li:.6*UPC,lp:.6*UPC,ang:26,age:[.2,1],sz:.8,e:.04},
    head:(par,B,O,D2,op2)=>cw.m?l104AulM(par,B,O,D2,op2,cw):l104AulF(par,B,O,D2,op2,cw)})}

/* ---------- kangaroo paw (Anigozanthos flavidus, A. manglesii and the hybrids 'Bush Gems', 'Big Red', 'Kings Park'): a tall leafless scape, velvety, branching at its top
   into a few short one-sided racemes; each flower a curved tube 3 to 6 cm long felted with branched hairs, split down its lower side and opening at the tip into six spreading lobes —
   the claw of the paw — the six stamens standing in its mouth; the flowers open from the base of each branch, the curved buds crowded at its tip ---------- */
const L104_CWANI=[{id:'rouge',n:'Rouge (Big Red)',c:'#c4262c',st:'#8e1c24',lc:'#d8443a',an:'#f2d8a0'},
  {id:'jaune',n:'Jaune (Bush Gold)',c:'#e9c43a',st:'#b8962e',lc:'#f0d460',an:'#f6eab8'},
  {id:'orange',n:'Orange (Orange Cross)',c:'#ec7a2c',st:'#b4542a',lc:'#f2953e',an:'#f6dca0'},
  {id:'rose',n:'Rose (Pink Joey)',c:'#e48aa6',st:'#a85a6e',lc:'#eea6bc',an:'#f6e2d4'},
  {id:'vert-rouge',n:'Vert à tige rouge (A. manglesii)',c:'#5c9a3e',st:'#b0222a',lc:'#7cb04c',an:'#e8e4a8',base:'#b0222a'},
  {id:'vert-jaune',n:'Vert chartreuse (Kings Park)',c:'#a8b84a',st:'#6e7a34',lc:'#c4cc62',an:'#eef0b8'},
  {id:'bordeaux',n:'Bordeaux (Bush Ruby)',c:'#8a2236',st:'#5e1a26',lc:'#a83448',an:'#ecc8a0'}];
function l104AniHead(par,B,O,Dh,op,cw){const k=G(par),det=DET>=1.5,q=op<.2?-1:sm01((op-.2)/.75),items=[],rot=R(0,6.283),Z=[0,0,1],Lf=Dh*.42,bw=Math.max(1.5,Dh*.024),
    nb=LOD?2:Math.round(R(2,4.4)),pF=pal7(cw.c),pS=pal7(cw.st),vel=lt(cw.c,.32);
  const brs=[],mk=(b0,d,L,bend)=>s=>V3.add(V3.add(b0,V3.sc(d,s*L)),V3.sc(Z,bend*s*s*L));
  /* the scape carries on as the first branch; the others leave it low down, each curving up; every raceme has its flowers on one side (sd) */
  const gr=.55+.45*sm01(op/.6);brs.push({c:mk([0,0,0],V3.nz([R(-.06,.06),R(-.06,.06),1]),Dh*R(.55,.65)*gr,0),w0:bw,s0:0,sd:[Math.cos(rot+Math.PI),Math.sin(rot+Math.PI),0]});
  for(let i=1;i<nb;i++){const ph=rot+i*6.283/(nb-1)+R(-.4,.4),a=R(.45,.7),R0=[Math.cos(ph),Math.sin(ph),0],d=V3.nz(V3.add(V3.sc(R0,Math.sin(a)),V3.sc(Z,Math.cos(a)))),s0=R(.05,.25),b0=brs[0].c(s0);
    brs.push({c:mk(b0,d,Dh*R(.32,.46)*gr,.6),w0:bw*.8,s0,sd:V3.nz(V3.add(R0,[0,0,.6]))})}
  for(const br of brs){const P=[],W=[];let z=0;for(let j=0;j<=8;j++){const s=j/8,p=PJ(B,O,br.c(s));P.push([p[0],p[1]]);W.push(br.w0*(1-.4*s));z+=p[2]}
    items.push({z:z/9-Dh*.01,fn:kk=>{E('path',{d:polyRibbon(P,j=>W[j]),fill:toneAt(pS,.6),stroke:pS.d1,'stroke-width':.3,'stroke-opacity':.4},kk);if(!LOD)E('path',{d:polyRibbon(P,j=>W[j]*.45,j=>W[j]*.4),fill:lt(cw.st,.3),opacity:.6},kk)}});
    /* the flowers, all on the upper side of the branch, open from its base, the buds crowded at its tip */
    const nf=LOD?3:det?7:5,sd=br.sd;for(let j=0;j<nf;j++){const s=Math.min(.97,.16+.81*(j+R(-.15,.15))/(nf-1)),b=br.c(s),T=V3.nz(V3s(br.c(s+.02),br.c(s-.02))),Sx=V3s(sd,V3.sc(T,V3.dot(sd,T))),S=V3l(Sx)>.1?V3.nz(Sx):V3.nz(V3.cr(T,[1,0,0])),X=V3.cr(T,S),
        isO=s<=.1+.75*q,Lfl=isO?Lf*R(.9,1.08):Lf*(.72-.25*s)*(.7+.3*Math.max(0,q)),fd=V3.nz(V3.add(V3.add(V3.sc(T,.85),V3.sc(S,isO?.45:.3)),V3.sc(X,R(-.3,.3)))),
        fp=t=>V3.add(V3.add(b,V3.sc(fd,t*Lfl)),V3.sc(Z,t*t*Lfl*.22)),nt=LOD?4:7,P2=[],W2=[];let zf=0;
      for(let i=0;i<=nt;i++){const t=i/nt,p=PJ(B,O,fp(t));P2.push([p[0],p[1]]);zf+=p[2];
        W2.push(Math.max(.6,Lfl*(.028+.064*sm01(t/.55))*(isO?(t>.85?1-.25*(t-.85)/.15:1):(t>.7?1-.7*(t-.7)/.3:.9))))}
      const e=fp(1),e0=fp(.9),ft=V3.nz(V3s(e,e0)),fx=V3.nz(V3.cr(ft,Math.abs(ft[0])<.9?[1,0,0]:[0,1,0])),fy=V3.cr(ft,fx),Ll=Lfl*.25,lob=[],sta=[];
      if(isO){for(let m=0;m<6;m++){const an=m/6*6.283+R(-.2,.2),rd=V3.add(V3.sc(fx,Math.cos(an)),V3.sc(fy,Math.sin(an))),m1=V3.add(e,V3.add(V3.sc(ft,Ll*.3),V3.sc(rd,Ll*.5))),m2=V3.add(e,V3.add(V3.sc(ft,Ll*.05),V3.sc(rd,Ll*1.05)));lob.push([e,m1,m2].map(p=>PJ(B,O,p)))}
        for(let m=0;m<3;m++){const rd=V3.add(V3.sc(fx,R(-.3,.3)),V3.sc(fy,R(-.3,.3)));sta.push([V3.add(e,V3.sc(ft,-Ll*.2)),V3.add(e,V3.add(V3.sc(ft,Ll*.75),V3.sc(rd,Ll*.4)))].map(p=>PJ(B,O,p)))}}
      const mainC=isO?cw.c:mix(cw.c,cw.st,.25),pM=pal7(mainC),I=lightI(toV(B,S)),hw=Lfl*.092;
      items.push({z:zf/(nt+1),fn:kk=>{E('path',{d:polyRibbon(P2,i=>W2[i]),fill:toneAt(pM,I),stroke:pM.d1,'stroke-width':.35,'stroke-opacity':.5},kk);
        if(cw.base){const nb2=Math.ceil(nt*.4);E('path',{d:polyRibbon(P2.slice(0,nb2+1),i=>W2[i]*1.02),fill:cw.base,opacity:.85},kk)}
        if(!LOD){E('path',{d:polyRibbon(P2,i=>W2[i]*.5,i=>W2[i]*.42),fill:isO?vel:lt(mainC,.3),opacity:.55},kk);
          /* the felt: a soft, paler fringe round the tube (close up) */
          if(det)E('path',{d:polyRibbon(P2,i=>W2[i]),fill:'none',stroke:vel,'stroke-width':f(Math.max(.5,hw*.22)),'stroke-opacity':.35,'stroke-dasharray':'.6 .9'},kk)}
        if(lob.length){E('path',{d:lob.map(s=>`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`).join(''),stroke:toneAt(pal7(cw.lc),I+.05),'stroke-width':f(Math.max(1.15,hw*.7)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},kk);
          if(det)E('path',{d:sta.map(s=>`M${f(s[0][0])},${f(s[0][1])}L${f(s[1][0])},${f(s[1][1])}`).join(''),stroke:cw.an,'stroke-width':f(Math.max(1.1,hw*.3)),fill:'none','stroke-linecap':'round'},kk)}}})}}
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn(k);return k}
function l104Ani(g,t,o){const cw=cwPick(L104_CWANI,o),op=l104Op(o),Dh=(o.cm||10)*UPC*(cw.sz||1),st=cw.st,
    /* the tall scape keeps upright: its head turns only part of the way toward the face asked for */
    ax=axOf(o),uv=o.up&&Math.hypot(o.up[0],o.up[1])>1e-6?V3.nz([o.up[0],o.up[1],0]):[0,1,0],ax2=V3.nz(V3.add(V3.sc(V3.nz(ax),.4),V3.sc(uv,.6)));o=Object.assign({},o,{ax:ax2});const
    lf=(og,pos)=>protLeaf(og,pos,3*UPC*R(.8,1.15),.14,mix(st,'#5a7a3a',.45),{wp:LS_LANCE,droop:.02,arch:.04,fold:.2,face:.3,ec:shd(st,-.3),eo:.4});
  return l104Grow(g,t,o,{D:Dh,op,w:.42*UPC,cols:[shd(st,-.35),st,lt(st,.18),lt(st,.42)],nodes:3,li:7*UPC,lp:3*UPC,bare:8*UPC,aimK:.12,follow:.85,zhk:.15,leaf:{ang:14,draw:lf},
    lat:{p:.15,n:[1,1],top:[1,2],nodes:1,li:4*UPC,lp:3*UPC,ang:24,age:[.1,.6],sz:.7,e:.03},head:(par,B,O,D2,op2)=>l104AniHead(par,B,O,D2,op2,cw)})}

/* ---------- isopogon (Isopogon anemonifolius, drumsticks; I. formosus and I. dubius, rose coneflowers): a round head of a hundred slender flowers, each a hairy tube
   ending in a club, which splits into four curled segments and lets out its fine style; the head sits on a cone of overlapping scales which, once the flowers fall,
   ripens into the grey drumstick, sold dried; the leaves divided two or three times into narrow flat lobes (anemonifolius) or fine prickly ones (formosus) ---------- */
const L104_CWISO=[{id:'jaune',n:'Jaune (I. anemonifolius)',c:'#eccd3a',sty:'#f4de6a',tp:'#d4a820',lf:{col:'#58763e',lw:1.5,fork:.55,ll:.42,nl:1}},
  {id:'jaune-citron',n:'Jaune citron',c:'#e2d65a',sty:'#eee67e',tp:'#c8b434',lf:{col:'#58763e',lw:1.5,fork:.55,ll:.42,nl:1}},
  {id:'rose',n:'Rose (I. formosus)',c:'#e68cb2',sty:'#f2b4cc',tp:'#c25a8a',lf:{col:'#4e6a3a',lw:1.12,fork:.7,ll:.36,nl:3}},
  {id:'magenta',n:'Rose magenta (I. dubius)',c:'#c4568e',sty:'#de86b0',tp:'#8e2c62',lf:{col:'#4e6a3a',lw:1.12,fork:.7,ll:.36,nl:3}},
  {id:'cone-naturel',n:'Cône séché naturel',c:'#7a6450',dry:1,lf:{col:'#6e6a4a',lw:1.4,fork:.55,ll:.42,nl:1}},
  {id:'cone-argent',n:'Cône séché gris argent',c:'#a8a294',dry:1,lf:{col:'#8a8a72',lw:1.4,fork:.55,ll:.42,nl:1}}];
function l104IsoCone(k,B,O,Dh,col){const r=Dh*.27,h=Dh*.52;protBody(k,B,O,Dh*.08,-Dh*.1,Dh*.02,shd(col,-.3),{pw:.6});protCone(k,B,O,r,h,col,{});if(LOD)return;
  /* the pale woolly rims of the scales where the cone faces the eye */
  let d='';const nn=DET>=1.5?34:18,rr=Math.max(.6,r*.08),z0=-h*.12;for(let i=0;i<nn;i++){const u=(.15+.75*(i+.5)/nn)*Math.PI,a=i*2.39996,ro=r*Math.sin(u)*(1-.12*Math.cos(u))*.97,z=z0+(h-z0)*(1-Math.cos(u))/2,nV=toV(B,[Math.cos(a)*Math.sin(u),Math.sin(a)*Math.sin(u),-Math.cos(u)*.6])[2];
    if(nV<.2)continue;const p=PJ(B,O,[Math.cos(a)*ro,Math.sin(a)*ro,z]);d+=l104Dot(p[0],p[1]+rr*.4,rr)}if(d)E('path',{d,fill:lt(col,.45),opacity:.7},k)}
function l104IsoHead(par,B,O,Dh,op,cw,info={}){const k=G(par);if(cw.dry||info.cone){l104IsoCone(k,B,O,Dh,cw.dry?cw.c:'#857560');return k}
  const nz=B[2][2],o2=sm01((op-.05)/.95),q=op<.2?0:sm01((op-.2)/.72),det=DET>=1.5,a=Dh*.2,hz=Dh*.17,zc=Dh*.08,thM=2.15,rot=R(0,6.283),bud=q<.02,
    sp=(th,ph)=>[a*Math.sin(th)*Math.cos(ph),a*Math.sin(th)*Math.sin(ph),zc+hz*Math.cos(th)],sn=(th,ph)=>V3.nz([Math.sin(th)*Math.cos(ph)/a,Math.sin(th)*Math.sin(ph)/a,Math.cos(th)/hz]),
    N=Math.round((det?110:60)*(LOD?.5:1)),grp=[[],[],[]],bg=[[],[],[]],cu=bud?mix(cw.c,'#9aa070',.45):shd(cw.c,-.08);
  const br=()=>capBracts(k,B,O,a*1.2,7,'#8a7a5a',{len:.4,w:.2,a0:1.9,a1:2.5});if(nz>=0)br();
  for(let i=0;i<N;i++){const t=(i+.5)/N,th=Math.acos(1-t*(1-Math.cos(thM))),ph=i*2.39996+rot,p0=sp(th,ph),n=sn(th,ph),nv=toV(B,n)[2],gi=nv<-.2?0:nv<.35?1:2,kc=.25+.2*Math.sin(th),e=V3.nz(V3.add(V3.sc(n,1-kc),[0,0,kc]));
    if(th/thM>1-q){const Lt=Dh*(.2+.05*Math.sin(th))*R(.92,1.06)*(.85+.15*o2),p1=V3.add(p0,V3.sc(e,Lt)),p2=V3.add(p1,V3.add(V3.sc(e,Dh*.13),V3.sc(n,Dh*.03))),c1=V3.add(p1,V3.sc(V3.nz(V3.add(V3.sc(n,-.4),[0,0,-.6])),Dh*.035));grp[gi].push([p0,p1,p2,c1])}
    else if(nv>-.3){const Lb=Dh*(bud?.1:.13)*(1-.25*(th/thM)),p1=V3.add(p0,V3.sc(e,Lb));bg[gi].push([p0,p1])}}
  const pC=pal7(cw.c),pY=pal7(cw.sty),wt=Math.max(1.15,Dh*.032),ws=Math.max(1.1,Dh*.012),wb=Math.max(1.4,Dh*.05);
  const draw=(gi,I)=>{let dt='',ds='',dc='',db='',dk='';
    for(const[p0,p1,p2,c1]of grp[gi]){const s=[p0,p1,p2,c1].map(p=>PJ(B,O,p));dt+=`M${f(s[0][0])},${f(s[0][1])}L${f(s[1][0])},${f(s[1][1])}`;ds+=`M${f(s[1][0])},${f(s[1][1])}L${f(s[2][0])},${f(s[2][1])}`;dc+=`M${f(s[1][0])},${f(s[1][1])}L${f(s[3][0])},${f(s[3][1])}`}
    for(const[p0,p1]of bg[gi]){const s0=PJ(B,O,p0),s1=PJ(B,O,p1);db+=`M${f(s0[0])},${f(s0[1])}L${f(s1[0])},${f(s1[1])}`;dk+=l104Dot(s1[0],s1[1],wb*.62)}
    if(db){const bc=bud?mix(cw.c,'#a8b07a',.4):cw.c;E('path',{d:db,stroke:toneAt(pal7(bc),I-.05),'stroke-width':f(wb*.7),fill:'none','stroke-linecap':'round'},k);E('path',{d:dk,fill:toneAt(pal7(bc),I+.05)},k)}
    if(dt){E('path',{d:ds,stroke:toneAt(pY,I),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);E('path',{d:dt,stroke:toneAt(pC,I),'stroke-width':f(wt),fill:'none','stroke-linecap':'round'},k);
      if(!LOD)E('path',{d:dc,stroke:toneAt(pal7(cw.tp),I),'stroke-width':f(wt*.8),fill:'none','stroke-linecap':'round'},k)}};
  draw(0,.38);l104Ball(k,B,O,a,hz,cu,{zc,n:det?40:18,br:.16});draw(1,.56);draw(2,.74);if(nz<0)br();return k}
function l104Iso(g,t,o){const cw=cwPick(L104_CWISO,o),op=cw.dry?1:l104Op(o),Dh=(o.cm||4)*UPC*(cw.sz||1),L=cw.lf,
    lf=(og,pos)=>l53Cut(og,pos,5.2*UPC*R(.85,1.12)*(og.p.lat?.75:1),L.col,{bc:mix(L.col,'#b8c0a0',.4),nl:L.nl,ll:L.ll,lw:L.lw,rw:L.lw*1.2,ang:32,fork:L.fork,droop:.06,arch:.05,v0:.3,term:1});
  return l104Grow(g,t,o,{D:Dh,op,w:.36*UPC,cols:cw.dry?['#3a2a1e','#584232','#7c644e','#a48c74']:['#5a2a22','#7a4234','#9a624c','#c08a70'],nodes:14,li:1.1*UPC,lp:1.3*UPC,bare:6*UPC,aimK:.12,topAng:14,follow:.4,zhk:.9,
    leaf:{ang:34,draw:lf},lat:{p:.45,n:[1,2],top:[3,7],nodes:3,li:1*UPC,lp:.6*UPC,ang:34,age:[.05,.9],sz:.85,e:.05},
    head:(par,B,O,D2,op2,inf)=>l104IsoHead(par,B,O,D2,op2,cw,{cone:!cw.dry&&inf&&!inf.main&&inf.age<.3})})}

/* ---------- pincushion hakea (Hakea laurina): globular clusters of crowded flowers in the axils near the tips, the crimson perianths packed into a ball out of which
   the long cream styles spring straight in every direction — the pins of the cushion; in the bud each style is still caught by its perianth and bows out in a loop;
   the styles turn golden with age; the leaves narrowly elliptic, grey-green, leathery, with three faint veins running their length ---------- */
const L104_CWHAK=[{id:'rouge-creme',n:'Rouge à épingles crème',c:'#c4202e',st:'#f2e8cc',kn:'#e6d8a2'},
  {id:'cramoisi-or',n:'Cramoisi à épingles dorées',c:'#9c1a2e',st:'#ecd282',kn:'#d8b44a'},
  {id:'rose-blanc',n:'Rose à épingles blanches',c:'#e05a7e',st:'#faf6ec',kn:'#f0e2c0'},
  {id:'rouge-rose',n:'Rouge rosé à épingles roses',c:'#cc3248',st:'#f4ccd2',kn:'#eab0ba'}];
function l104HakHead(par,B,O,Dh,op,cw){const k=G(par),nz=B[2][2],o2=sm01((op-.05)/.95),q=op<.22?0:sm01((op-.22)/.7),det=DET>=1.5,a=Dh*(.2+.06*o2),hz=a*.95,rot=R(0,6.283),
    N=Math.round((det?96:54)*(LOD?.5:1)),gs=[[],[],[]],gl=[[],[],[]],bc=mix(cw.c,'#8a6a4a',.3*(1-o2));
  const br=()=>capBracts(k,B,O,a*1.15,7,'#6a4a32',{len:.38,w:.24,a0:2.1,a1:2.6});if(nz>-.4)br();
  for(let i=0;i<N;i++){const t=(i+.5)/N,th=Math.acos(1-1.82*t),ph=i*2.39996+rot,cs=[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)],p0=[a*cs[0]*.92,a*cs[1]*.92,hz*cs[2]*.92],
      n=V3.nz([cs[0]/a,cs[1]/a,cs[2]/hz]),nv=toV(B,n)[2],gi=nv<-.15?0:nv<.35?1:2;
    if(((i*.618034)%1)<q){const Ls=Dh*R(.21,.26),cv=V3.nz([-Math.sin(ph),Math.cos(ph),0]),p1=V3.add(p0,V3.add(V3.sc(n,Ls*.55),V3.sc(cv,Ls*.04))),p2=V3.add(p0,V3.add(V3.sc(n,Ls),V3.sc(cv,Ls*.1)));gs[gi].push([p0,p1,p2])}
    else if(nv>-.4){const tg=V3.nz(V3.cr(n,[0,0,1])),Lb=Dh*(.07+.05*o2),p1=V3.add(p0,V3.add(V3.sc(n,Lb*1.6),V3.sc(tg,Lb*.4))),p2=V3.add(p0,V3.sc(tg,Lb*.55));gl[gi].push([p0,p1,p2])}}
  const pS=pal7(cw.st),pL=pal7(mix(cw.st,cw.c,.55)),ws=Math.max(1.12,Dh*.013),kr=Math.max(.7,ws*.68);
  const draw=(gi,I)=>{let ds='',dk='',dl='';
    for(const[p0,p1,p2]of gs[gi]){const s=[p0,p1,p2].map(p=>PJ(B,O,p));ds+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`;dk+=l104Dot(s[2][0],s[2][1],kr)}
    for(const[p0,p1,p2]of gl[gi]){const s=[p0,p1,p2].map(p=>PJ(B,O,p));dl+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`}
    if(dl)E('path',{d:dl,stroke:toneAt(pL,I),'stroke-width':f(ws*1.1),fill:'none','stroke-linecap':'round'},k);
    if(ds){E('path',{d:ds,stroke:toneAt(pS,I),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);if(!LOD)E('path',{d:dk,fill:toneAt(pal7(cw.kn),I)},k)}};
  draw(0,.4);l104Ball(k,B,O,a,hz,bc,{n:det?56:28,br:.15});draw(1,.58);draw(2,.76);if(nz<=-.4)br();return k}
function l104Hak(g,t,o){const cw=cwPick(L104_CWHAK,o),op=l104Op(o),Dh=(o.cm||5)*UPC*(cw.sz||1),
    lf=(og,pos)=>protLeaf(og,pos,10*UPC*R(.85,1.1)*(og.p.lat?.75:1)*(1-.3*sm01(1-(og.p.i-1)/4)),.15,'#6a866a',{pet:.06,wp:LS_LANCE,droop:.06,arch:.05,fold:.08,face:.3,ec:'#b8a86a',eo:.55,bc:'#9cae98',pc:'#8a6a4a',pw:1.3});
  return l104Grow(g,t,o,{D:Dh,op,w:.45*UPC,cols:['#4a3424','#6a4c36','#8e6e52','#b89878'],nodes:9,li:2.1*UPC,lp:.7*UPC,bare:6*UPC,aimK:.1,topAng:16,follow:.3,zhk:.9,leaf:{ang:38,draw:lf},
    lat:{p:.75,n:[1,2.2],top:[1,4],nodes:0,li:UPC,lp:.6*UPC,ang:48,age:[.1,1],sz:.9,e:.03},head:(par,B,O,D2,op2)=>l104HakHead(par,B,O,D2,op2,cw)})}

/* ---------- the registers ---------- */
Object.assign(GH,{'aulax':l104Aulax,'anigozanthos':l104Ani,'isopogon':l104Iso,'hakea':l104Hak});
Object.assign(CWS,{'aulax':L104_CWAUL,'anigozanthos':L104_CWANI,'isopogon':L104_CWISO,'hakea':L104_CWHAK});
Object.assign(SZG,{'aulax':[18,20,25,28,30],'anigozanthos':[7,8,10,12,14],'isopogon':[3,3.5,4,4.5,5],'hakea':[4,4.5,5,5.5,6]});
Object.assign(GHI,{'aulax':{form:'cornet',size:2,k:'head',rk:.85},'anigozanthos':{form:'grappe',size:2.4,k:'head',rk:.8},'isopogon':{form:'sphere',size:1.5,k:'head',rk:.9},'hakea':{form:'sphere',size:1.6,k:'head',rk:.9}});
for(const id of['aulax','anigozanthos','isopogon','hakea'])GH_BUDS.add(id);
