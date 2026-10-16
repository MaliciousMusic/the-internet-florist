/* ================= Serre, lot 82 — persistants 4 : feuillage de gardénia, troène (feuillage), cocculus, arbousier (feuillage), nandina (bambou sacré) ================= */
/* ---------- shared: a leafy woody shoot grown by the feuillage engine of lot 24 (fgAxis, fgGrow), its leaves the 3D blades of lot 35 (g35Leaf); here the outlines (toothed or not),
   the veins (pinnate or three from the base), stalks drawn as tapered ribbons along curves (never a sharp elbow, never finer than 1.1 on the screen) ---------- */
const l82Q=p=>[p[0],-p[1]];
/* the midrib in short steps (a chord would cut across an arched blade) */
const L82_MID=[0,.01,.12,.25,.38,.5,.62,.74,.86,.97].map(y=>[0,y]);
const l82St=c=>[shd(c,-.6),shd(c,-.3),c,shd(c,.35)];
/* an outline from a width profile; tz the depth of forward-pointing teeth (a share of the half-width) from y0 to the tip */
function l82Prof(wp,wr,n,tz=0,y0=.12){const R0=[[wp(0)*wr/2,0]];for(let i=1;i<n;i++){const y=i/n;R0.push([wp(y)*wr/2,y]);if(tz&&y>=y0&&i<n-1){const y2=y+.62/n;R0.push([wp(y2)*wr/2*(1-tz),y2])}}R0.push([0,1]);return{R:R0,L:R0.map(([x,y])=>[-x,y])}}
/* pinnate veins: n pairs from the midrib, curving forward toward the margin (reach: how far out, d: how far they climb) */
function l82Veins(wp,wr,n,d=.16,reach=.82){const V=[L82_MID];for(let i=1;i<=n;i++){const y=.06+.8*i/(n+1),y1=Math.min(.97,y+d),xw=wp(y1)*wr/2*reach;for(const s of[-1,1])V.push([[0,y],[s*xw*.55,y+d*.42],[s*xw,y1]])}return V}
/* three veins from the base (cocculus): the midrib and two arcs following the margin to near the tip */
function l82Tri(wp,wr){const V=[L82_MID];for(const s of[-1,1])V.push([[0,.015],[s*wp(.12)*wr/2*.55,.12],[s*wp(.35)*wr/2*.62,.35],[s*wp(.6)*wr/2*.6,.6],[s*wp(.8)*wr/2*.5,.8],[s*.008,.95]]);return V}
/* a quadratic curve in view space, n+1 points */
const l82Bz=(a,b,c,n=8)=>{const P=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;P.push([u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1],u*u*a[2]+2*u*t*b[2]+t*t*c[2]])}return P};
/* a tapered ribbon along view-space points (stalks, sheaths, lobes): wf(t) its half-width, never under .55 (1.1 across) */
function l82Rib(P3,wf){const C=P3.map(l82Q),n=C.length,A=[],B=[];for(let i=0;i<n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=Math.max(.55,wf(i/(n-1)));
  A.push([C[i][0]-dy/l*w,C[i][1]+dx/l*w]);B.push([C[i][0]+dy/l*w,C[i][1]-dx/l*w])}return A.concat(B.reverse())}
const l82Pd=P=>'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z';
const l82Avz=P=>P.reduce((a,q)=>a+q[2],0)/P.length;
/* a leaf on its node: a short petiole (a curved stalk from the twig) then the 3D blade; o.pet its length, o.pc its colour */
function l82Leaf(og,L,sh,c,cb,o){const F=g35Fr(og),pl=o.pet||0,P0=V3.add(F.P0,V3.sc(F.H,pl+(og.w||2)*.3)),out=[g35Leaf(P0,F.H,F.N,L,sh,c,cb,o)];
  if(pl>1){const P=l82Bz(F.P0,V3.add(V3.add(F.P0,V3.sc(F.H,(pl+(og.w||2)*.3)*.5)),V3.sc(F.N,pl*.08)),V3.add(P0,V3.sc(F.H,L*.03)),4),w=o.pw||1.3;
    out.push({z:l82Avz(P)-.05,cast:false,fn:g=>E('path',{d:l82Pd(l82Rib(P,t=>w*(.62-.1*t))),fill:o.pc,stroke:shd(o.pc,-.5),'stroke-width':.3,'stroke-opacity':.5},g)})}
  return out}
/* a whorl (or a pair) of leaves set on a node by hand: the stem's tangent H, nl leaves at az0, each la from the stem, its face toward the stem's tip, then toward the spray's front */
function l82Whorl(og,nl,az0,la,Fr,face){const T=V3.nz(og.H),X=V3.nz(og.U),Y=V3.cr(T,X),out=[];
  for(let j=0;j<nl;j++){const a=(az0+j*360/nl+R(-12,12))*D,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),l=(la+R(-7,7))*D,d=V3.nz(V3.add(V3.sc(T,Math.cos(l)),V3.sc(r,Math.sin(l))));
    let U=V3s(T,V3.sc(d,V3.dot(T,d)));U=V3l(U)<1e-4?r:V3.nz(U);const lo={pos:V3.add(og.pos,V3.sc(r,(og.w||2)*.35)),H:d,U,L:V3.cr(U,d),w:og.w,j};out.push(fgFace(lo,Fr,face))}
  return out}

/* ---------- gardenia foliage (Gardenia jasminoides, Rubiaceae, « feuillage de gardénia »): a woody evergreen shrub; stiff green then grey-brown twigs, an interpetiolar stipule sheathing each node;
   leaves opposite or in whorls of three, almost sessile, elliptic to obovate (5–12 cm), pointed at both ends, thick and leathery, deep green and very glossy above, paler beneath,
   the 8–12 pairs of lateral veins deeply impressed (the blade quilted between them); a solitary terminal bud, long and pointed, its white petals furled in a spiral, held in a ribbed
   green calyx with 5–7 long linear lobes. Sold as leafy stems 30–40 cm, green, sometimes with buds; a cream-margined form ('Variegata') ---------- */
const CW_L82GAR=[{id:'vert-sombre',n:'Vert sombre luisant (type)',c:'#1f4224'},{id:'vert-profond',n:'Vert profond (grandes feuilles, Mystery)',c:'#2a4a2c',big:1},
  {id:'boutons',n:'Vert sombre, boutons blancs',c:'#1f4426',f:1},{id:'panache',n:'Panaché crème (Variegata)',c:'#7c8a5c',m:'#e2dcb2',g:'#2c4c2c'}];
const L82_GARW=prof([[0,.1],[.1,.46],[.28,.84],[.52,1],[.72,.9],[.88,.56],[1,0]]),L82_GARS=l82Prof(L82_GARW,.46,12),L82_GARV=l82Veins(L82_GARW,.46,9,.13,.86);
/* the bud: a ribbed calyx tube and its linear lobes, the furled petals a long spindle twisted in a spiral (green-white young, white, its tips loosening when about to open) */
function l82GarBud(og,op,kl,lim){const H=V3.nz(og.H),[X,Y]=fgCross(H),b0=og.pos,b=V3.add(b0,V3.sc(H,.9*UPC*kl)),rc=.3*UPC*kl,c1=V3.add(b,V3.sc(H,.75*UPC*kl)),y=Math.max(0,Math.min(1,op)),Lb=(1.8+2.2*y)*UPC*kl,rb=(.42+.2*y)*UPC*kl,
    e=V3.add(c1,V3.sc(H,Lb)),out=[],PC=pal7('#4a6a32'),col=mix('#b8c890','#f8f5e8',Math.min(1,y*1.5)),P=pal7(col);
  if(lim!=null&&Math.min(e[1],c1[1])<lim)return null;
  const rf=t=>rb*Math.pow(Math.sin(Math.PI*Math.min(1,t*.86+.14)),.75)*(1-.25*t),sp=l45Spin(V3.add(c1,V3.sc(H,-rc*.3)),e,rf,12),cx=l45Spin(b,c1,t=>rc*(.62+.38*t),6);
  /* the calyx lobes: narrow and keeled, from the rim of the tube along the bud, a little spread */
  const lobes=[],nl=6,ph=R(0,6.283);for(let i=0;i<nl;i++){const a=ph+i/nl*6.283,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),d=V3.nz(V3.add(V3.sc(H,.86),V3.sc(r,.32+.18*y))),s=V3.add(c1,V3.sc(r,rc*.85)),
      ll=(1.1+.5*y)*UPC*kl*R(.85,1.1),P3=l82Bz(s,V3.add(s,V3.sc(d,ll*.5)),V3.add(V3.add(s,V3.sc(d,ll)),V3.sc(r,ll*.12)),5);lobes.push({P:l82Rib(P3,t=>.13*UPC*kl*(1-t)),z:l82Avz(P3),fr:r[2]>0})}
  /* the spiral furl: three lines winding up the spindle, drawn on its front only */
  let fl='';for(let k=0;k<3;k++){let on=0;for(let i=0;i<=14;i++){const t=.08+.9*i/14,a=ph+k*2.094+t*2.6,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),p=l82Q(V3.add(V3.add(c1,V3.sc(H,Lb*t)),V3.sc(r,rf(t)*.96)));
    if(r[2]>.1){fl+=(on?'L':'M')+f(p[0])+','+f(p[1]);on=1}else on=0}}
  /* about to open: the outer petals' tips turned out at the top */
  const tips=[];if(y>.78){const k2=(y-.78)/.22;for(let i=0;i<5;i++){const a=ph+i*1.257,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),s=V3.add(c1,V3.sc(H,Lb*.62)),
      P3=l82Bz(V3.add(s,V3.sc(r,rf(.62)*.8)),V3.add(V3.add(s,V3.sc(H,Lb*.22)),V3.sc(r,rf(.62)*(1+.4*k2))),V3.add(V3.add(s,V3.sc(H,Lb*.34)),V3.sc(r,rf(.62)*(.6+1.1*k2))),5);
    tips.push({P:l82Rib(P3,t=>rb*.55*Math.sin(Math.PI*Math.min(1,t*.85+.15))),fr:r[2]>0,I:lightI(V3.nz(V3.add(r,V3.sc(H,.3))))})}}
  const pdn=l82Bz(b0,V3.add(b0,V3.sc(H,.5*UPC*kl)),V3.add(b,V3.sc(H,.2*UPC*kl)),4),zc=(b[2]+e[2])/2,Ib=lightI(V3.nz(V3.add(X,[0,0,1.2])));
  out.push({z:zc-.3,cast:false,fn:g=>{const bl=lobes.filter(q=>!q.fr);if(bl.length)E('path',{d:bl.map(q=>l82Pd(q.P)).join(''),fill:toneAt(PC,.42),stroke:PC.ink,'stroke-width':.3,'stroke-opacity':.5},g);
    const bt=tips.filter(q=>!q.fr);if(bt.length)E('path',{d:bt.map(q=>smooth(q.P)).join(''),fill:toneAt(P,.5),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.4},g)}});
  out.push({z:zc,cast:false,fn:g=>{E('path',{d:l82Pd(l82Rib(pdn,t=>1.4*kl*(1-.2*t))),fill:'#4a6a32'},g);E('path',{d:smooth(cx.P),fill:toneAt(PC,.55),stroke:PC.ink,'stroke-width':.35,'stroke-opacity':.5},g);
    E('path',{d:smooth(sp.P),fill:toneAt(P,Ib*.95),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.45},g);
    if(!LOD&&fl)E('path',{d:fl,stroke:P.d1,'stroke-width':.5,'stroke-opacity':.55,fill:'none','stroke-linejoin':'round'},g);
    const ft=tips.filter(q=>q.fr);for(const q of ft)E('path',{d:smooth(q.P),fill:toneAt(P,q.I),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.4},g)}});
  out.push({z:zc+.3,cast:false,fn:g=>{const fr=lobes.filter(q=>q.fr);if(fr.length)E('path',{d:fr.map(q=>l82Pd(q.P)).join(''),fill:toneAt(PC,.66),stroke:PC.ink,'stroke-width':.3,'stroke-opacity':.5},g)}});
  return out}
function l82Gar(g,t,o){const cw=fgCw(CW_L82GAR,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=9,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l82gar',()=>{const Lt=o.spine?blen(o.spine):35*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),cols=l82St('#5a6a44'),lim=g35Lim(o),uL=o.spine?.22:.16;let ni=0,nb=0;
    const mb=cw.f?3:rnd()<.12?1:0,big=cw.big?1.15:1;
    const lf=(lo,sz,u)=>{const L=cm0*UPC*sz*big*R(.88,1.08),young=u>.82?(u-.82)/.18*(.5+.5*(1-op)):0,c0=cw.m||cw.c,c=mix(young?mix(c0,'#4f8a3a',young*.6):c0,shd(c0,R(-.06,.06)),.5);
      return l82Leaf(lo,L,L82_GARS,c,mix(cw.g||cw.c,'#9fb890',.42),{lim,pet:DET>=1.5?.25*UPC*kl:0,pc:cols[2],sm:1,fold:.2+.3*young,arch:.12,droop:.1,cup:.08,wave:.006,wk:9,wph:R(0,6),tw:R(-.2,.2),bend:R(-.05,.05),
        gloss:.4,dI:.04,veins:L82_GARV,vAll:1,vc:shd(cw.g||cw.c,-.5),vw:.55,vo:.6,vr:cw.m&&!young?{c:cw.g,k:y=>.58+.12*Math.sin(y*9+lo.j*2)}:null})};
    const r=fgGrow(k,A,{li:3.3*UPC*kl,liT:.45,w0:3.6*kl,w1:1.6,cols,uL,lp:0,tipLv:0,node:1,phy:'opp',seg:9,wig:.03,
      side:{u0:.25,u1:.7,p:.22,len:.36,ang:34,li:.75,e:-.006,pair:1,tilt:20},
      /* the nodes: opposite pairs crossing, here and there a whorl of three; a little sheathing stipule between the petioles */
      nodeDraw:(og,p,Fr)=>{if(!p.o&&p.u<uL)return null;const nl=rnd()<.25?3:2,u=p.o?.75+.25*p.u:p.u,sz=fgSz({u,o:0},.7)*(p.o?.8:1)*kl,out=[];
        for(const lo of l82Whorl(og,nl,(ni++)*90,50,Fr,.6))out.push(...lf(lo,sz,u));
        const T=V3.nz(og.H),st=l82Bz(V3.add(og.pos,V3.sc(T,-1.2*kl)),V3.add(og.pos,V3.sc(T,.3)),V3.add(og.pos,V3.sc(T,1.4*kl)),3);
        out.push({z:og.pos[2]+.1,cast:false,fn:g=>E('path',{d:l82Pd(l82Rib(st,t=>(og.w||2)*.62*(1-.3*t))),fill:cols[1],stroke:cols[0],'stroke-width':.3,'stroke-opacity':.5},g)});return out},
      /* the tip: its young pair of leaves, and on a flowering stem the bud between them */
      tip:(og,p,Fr)=>{const out=[];for(const lo of l82Whorl(og,2,(ni++)*90,nb<mb&&!p.o?38:22,Fr,.4))out.push(...lf(lo,.42*(p.o?.85:1)*kl,1));
        if((!p.o?nb<mb+1:nb<mb-1&&rnd()<.6)&&mb&&(lim==null||og.pos[1]>lim+8)){const bd=l82GarBud(og,op*(p.o?.8:1),kl,lim);if(bd){nb++;out.push(...bd)}}return out}});
    open(k,t,1000,0,.4);return r})}

/* ---------- privet foliage (Ligustrum japonicum, L. lucidum, L. ovalifolium, Oleaceae, « troène »): stiff grey-brown twigs dotted with lenticels; leaves opposite and decussate,
   short-stalked, ovate to elliptic (4–8 cm), pointed, entire, leathery and glossy, deep green above and paler beneath; golden privet (L. ovalifolium 'Aureum') edged broadly with
   golden yellow, silver privet ('Argenteum', L. sinense 'Variegatum') with cream; in early summer dense pyramidal panicles (6–12 cm) of tiny white flowers, each a short tube and
   four spreading lobes, two stamens standing out. Sold as leafy stems 40–60 cm (the berried privet is « troène à baies », lot 45) ---------- */
const CW_L82LIG=[{id:'vert',n:'Vert luisant (L. japonicum)',c:'#22401f'},{id:'panache-creme',n:'Panaché crème (Argenteum)',c:'#c4c69a',m:'#e8e4c4',g:'#4a6a3a'},
  {id:'dore',n:'Doré (Aureum)',c:'#b8b04a',m:'#d8c450',g:'#5a7a32'},{id:'fleuri',n:'Vert, panicules blanches (en fleurs)',c:'#24421f',f:1}];
const L82_LIGW=prof([[0,.36],[.1,.74],[.3,.98],[.48,1],[.7,.84],[.88,.48],[1,0]]),L82_LIGS=l82Prof(L82_LIGW,.52,12),L82_LIGV=l82Veins(L82_LIGW,.52,5,.18,.8);
/* a panicle of tiny white flowers at a shoot's tip: its rachis rising, opposite pairs of side branches crossing and shortening upward, each a little cyme; the flowers open from the base */
function l82LigPan(og,op,kl,lim){const H=V3.nz(V3.add(og.H,[0,.25,0])),Lr=(6+3*op)*UPC*kl,ra=l82Bz(og.pos,V3.add(og.pos,V3.sc(og.H,Lr*.45)),V3.add(og.pos,V3.sc(H,Lr)),10);
  if(lim!=null&&l45Low(ra)<lim)return null;
  const det=DET>=1.5&&!LOD,ax='#7a8a5a',PF=pal7('#f6f4ea'),PB=pal7(mix('#f6f4ea','#b8c890',.4)),axes=[ra],fls=[],np=det?8:6,y=Math.max(0,Math.min(1,op)),rf=.36*UPC*kl;
  const flower=(p,fa,q)=>{const ag=Math.max(0,Math.min(1,y*1.5-q*.7+R(-.1,.1)));fls.push({p,fa:V3.nz(fa),ag})};
  for(let i=0;i<np;i++){const q=i/np,t=.1+.78*q,j=Math.round(t*10),p=ra[j],T=V3.nz(V3s(ra[Math.min(10,j+1)],ra[Math.max(0,j-1)])),[X,Y]=fgCross(T),ph=(i%2?90:0)+R(-10,10);
    for(const s of[0,180]){const a=(ph+s)*D,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),d=V3.nz(V3.add(V3.sc(T,.6),V3.sc(r,.8))),bl=Lr*(.26*(1-q)+.07)*R(.85,1.1),
        e=V3.add(V3.add(p,V3.sc(d,bl)),[0,bl*.12,0]),br=l82Bz(p,V3.add(p,V3.sc(d,bl*.55)),e,6);axes.push(br);
      /* the little cyme: a flower on the end, short-stalked pairs along the branch */
      flower(e,V3.add(d,[0,.4,0]),q);const[X2]=fgCross(d);for(const m of q<.6?[br[2],br[4]]:[br[4]])for(const s2 of[-1,1]){const dd=V3.nz(V3.add(V3.sc(d,.55),V3.sc(X2,s2*.8))),e2=V3.add(m,V3.sc(dd,rf*1.7));
        axes.push(l82Bz(m,V3.add(m,V3.sc(dd,rf*.85)),e2,3));flower(e2,dd,q+.15)}}}
  const tp=ra[10];flower(tp,H,1);for(const s of[-1,1]){const[X]=fgCross(H),dd=V3.nz(V3.add(H,V3.sc(X,s))),e2=V3.add(ra[8],V3.sc(dd,rf*2.4));axes.push(l82Bz(ra[8],V3.add(ra[8],V3.sc(dd,rf*1.2)),e2,3));flower(e2,dd,.9)}
  const zc=l82Avz(ra),out=[];let d0='';for(const P3 of axes)d0+='M'+P3.map(q=>{const s=l82Q(q);return f(s[0])+','+f(s[1])}).join('L');
  out.push({z:zc-1,cast:false,fn:g=>E('path',{d:d0,stroke:ax,'stroke-width':1.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)});
  /* the flowers in two layers (behind the rachis, in front of it): open ones a four-lobed star with its two stamens, buds small white balls */
  const lay=[[],[]];for(const q of fls)lay[q.p[2]>=zc?1:0].push(q);
  lay.forEach((L,li)=>{if(!L.length)return;let ds='',db='',dc='';for(const q of L){const[X,Y]=fgCross(q.fa),c=V3.add(q.p,V3.sc(q.fa,rf*.35));
      if(q.ag<.4){const P=l45Sph(c,q.fa,rf*.62,rf*.5,8);db+=smooth(P)}
      else{const sp=rf*(.8+.35*q.ag),pts=[];for(let i=0;i<16;i++){const th=i/16*6.283+.4,rr=sp*(.38+.62*Math.pow(Math.abs(Math.cos(th*2)),.6));pts.push([Math.cos(th)*rr,Math.sin(th)*rr])}
        ds+=smooth(fgPoly(c,X,Y,pts));if(det){for(const s of[-1,1]){const a=l82Q(V3.add(V3.add(c,V3.sc(q.fa,rf*.7)),V3.sc(X,s*rf*.35)));dc+=`M${f(a[0]-.5)},${f(a[1])}a.5,.5 0 1,0 1,0a.5,.5 0 1,0 -1,0`}}}}
    out.push({z:zc+(li?1:-.6),cast:false,fn:g=>{if(ds)E('path',{d:ds,fill:toneAt(PF,li?.78:.6),stroke:PF.ink,'stroke-width':.3,'stroke-opacity':.4},g);
      if(db)E('path',{d:db,fill:toneAt(PB,li?.72:.56),stroke:PB.ink,'stroke-width':.3,'stroke-opacity':.45},g);if(dc)E('path',{d:dc,fill:'#a89050'},g)}})});
  return out}
function l82Lig(g,t,o){const cw=fgCw(CW_L82LIG,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l82lig',()=>{const Lt=o.spine?blen(o.spine):45*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),cols=l82St('#6e665a'),lim=g35Lim(o);let np=0;const mp=cw.f?4:0;
    const r=fgGrow(k,A,{li:(DET>=1.5?2.5:3)*UPC*kl,liT:.4,w0:3.4*kl,w1:1.4,cols,uL:o.spine?.2:.14,phy:'opp',la:52,face:.65,lift:.4,seg:9,wig:.03,tipLv:cw.f?0:undefined,
      side:{u0:.22,u1:.72,p:DET>=1.5?.4:.3,len:.38,ang:36,li:.75,e:-.006,pair:1,tilt:22},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.84?(u-.84)/.16*(.4+.6*(1-op)):0,sz=(p.tip?.45:fgSz(p,.74))*(p.o?.82:1)*kl,L=cm0*UPC*sz*R(.86,1.1),c0=cw.m||cw.c,
          c=mix(young&&!cw.m?mix(c0,'#5a8a3a',young*.6):c0,shd(c0,R(-.06,.06)),.5);
        return l82Leaf(og,L,L82_LIGS,c,mix(cw.g||cw.c,'#a8b890',.45),{lim,pet:DET>=1.5?.45*UPC*kl:0,pc:cols[2],pw:1.2,sm:1,fold:.14+.35*young,arch:.08,droop:.08,cup:.04,tw:R(-.25,.25),bend:R(-.06,.06),
          gloss:1,dI:.03,veins:L82_LIGV,vc:shd(cw.g||cw.c,-.3),vw:.4,vo:.4,vr:cw.m&&!young?{c:cw.g,k:y=>.5+.14*Math.sin(y*7+og.p.j*3+u*20)}:null})},
      tip:(og,p)=>{if(!mp||(p.o&&(np>=mp-1||rnd()<.4)))return null;const pn=l82LigPan(og,op,kl*(p.o?.8:1),lim);if(pn)np++;return pn}});
    open(k,t,1000,0,.4);return r})}

/* ---------- cocculus (Cocculus laurifolius, now Pachygone laurifolia, Menispermaceae, « laurier-coque »): an evergreen shrub with long arching green shoots; leaves alternate,
   short-stalked, lanceolate to narrowly elliptic (8–15 cm), tapering to a long point, thick and very glossy, deep green, the three main veins running from the base to near the tip
   in pale raised lines, the margin a little wavy. Sold as arching leafy stems 60–90 cm ---------- */
const CW_L82COC=[{id:'vert',n:'Vert luisant (type)',c:'#3f6e32'},{id:'vert-sombre',n:'Vert sombre',c:'#26442a'}];
const L82_COCW=prof([[0,.22],[.08,.62],[.25,.94],[.4,1],[.6,.86],[.8,.52],[.93,.2],[1,0]]),L82_COCS=l82Prof(L82_COCW,.32,14),L82_COCV=l82Tri(L82_COCW,.32);
function l82Coc(g,t,o){const cw=fgCw(CW_L82COC,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=11,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l82coc',()=>{const Lt=o.spine?blen(o.spine):60*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.2,.32)),cols=l82St('#4f6a35'),lim=g35Lim(o);
    const r=fgGrow(k,A,{li:2.9*UPC*kl,liT:.35,w0:3.6*kl,w1:1.4,cols,uL:o.spine?.16:.14,phy:'spiral',la:56,face:.72,lift:.3,seg:10,wig:.025,
      side:{u0:.3,u1:.7,p:.22,len:.36,ang:34,li:.8,e:-.01,tilt:22},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.85?(u-.85)/.15*(.4+.6*(1-op)):0,sz=(p.tip?.42:fgSz(p,.78))*(p.o?.82:1)*kl,L=cm0*UPC*sz*R(.86,1.1),
          c=mix(young?mix(cw.c,'#7aa04a',young*.6):cw.c,shd(cw.c,R(-.06,.06)),.5);
        return l82Leaf(og,L,L82_COCS,c,mix(cw.c,'#a8c098',.45),{lim,pet:.6*UPC*kl,pc:mix(cols[2],'#6a8a40',.4),pw:1.25,sm:1,fold:.12+.35*young,arch:.06,droop:.12,cup:.03,wave:.01,wk:6,wph:R(0,6),
          tw:R(-.3,.3),bend:R(-.08,.08),gloss:.6,dI:.04,veins:L82_COCV,vAll:1,vc:mix(c,'#d8e0a8',.45),vw:.6,vo:.6})}});
    open(k,t,1000,0,.4);return r})}

/* ---------- strawberry-tree foliage (Arbutus unedo, Ericaceae, « arbousier »): red-brown shoots, the young ones red and glandular-hairy; leaves alternate, crowded, on short red petioles,
   oblong-elliptic to obovate (5–10 cm), the margin serrate, leathery and glossy, deep green above, paler beneath, the midrib pale; in autumn drooping terminal panicles (15–30 flowers)
   of small urn-shaped flowers (7–9 mm), creamy white or pink-flushed ('Rubra'), their mouth narrowed to five tiny recurved lobes; at the same time the round fruits of the year before
   (1.5–2 cm), warty, ripening from yellow through orange to scarlet. Sold as leafy stems 40–60 cm, sometimes in flower, sometimes with fruits ---------- */
const CW_L82ARB=[{id:'vert',n:'Vert sombre luisant (A. unedo)',c:'#22401f'},{id:'fleuri',n:'Vert, grappes blanches (en fleurs)',c:'#24421f',fl:'#f4f0de',f:1},
  {id:'fleuri-rose',n:'Vert, grappes rosées (Rubra)',c:'#26421f',fl:'#e8b8b8',f:1},{id:'fruits',n:'Vert, fleurs et fruits rouges',c:'#22421f',fl:'#f4f0de',fr:1,f:1}];
const L82_ARBW=prof([[0,.3],[.1,.68],[.3,.94],[.52,1],[.72,.88],[.88,.56],[1,0]]),L82_ARBS=[l82Prof(L82_ARBW,.36,17,.09),l82Prof(L82_ARBW,.36,11,.08)],L82_ARBV=l82Veins(L82_ARBW,.36,7,.14,.8);
/* a drooping panicle from a shoot's tip: its peduncle arching out and down, a few branchlets, urn-shaped flowers hanging mouth down on short pedicels */
function l82ArbPan(og,cw,op,kl,lim){const H=V3.nz(og.H),y=Math.max(0,Math.min(1,op)),Lr=(3.4+1.6*y)*UPC*kl,pts=[og.pos];let d=V3.nz(V3.add(H,[0,-.1,0])),p=og.pos;
  for(let i=0;i<10;i++){d=V3.nz(V3.add(V3.sc(d,.7),[0,-.3,0]));p=V3.add(p,V3.sc(d,Lr/10));pts.push(p)}if(lim!=null&&l45Low(pts)<lim+3*UPC*kl)return null;
  const det=DET>=1.5&&!LOD,P=pal7(cw.fl),ped='#a85a40',axes=[pts],fls=[],n=det?16:11,rr=.36*UPC*kl,hl=.42*UPC*kl;
  for(let i=0;i<n;i++){const q=i/(n-1),j=Math.min(10,1+Math.round(q*9)),b=pts[j],T=V3.nz(V3s(pts[Math.min(10,j+1)],pts[j-1])),[X,Y]=fgCross(T),a=(i*137.5+R(-20,20))*D,
      r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),pl=(.55+.25*(1-q))*UPC*kl,pd=V3.nz(V3.add(V3.sc(r,.9),[0,-.35,0])),c=V3.add(b,V3.sc(pd,pl)),P3=l82Bz(b,V3.add(b,V3.sc(pd,pl*.6)),c,3);
    axes.push(P3);const ag=Math.max(0,Math.min(1,y*1.4-(1-q)*.5+R(-.1,.1))),ax=V3.nz(V3.add(V3.sc(pd,.35),[0,-1,0]));fls.push({c,ax,ag})}
  const zc=l82Avz(pts),out=[];let d0='';for(const P3 of axes)d0+='M'+P3.map(q=>{const s=l82Q(q);return f(s[0])+','+f(s[1])}).join('L');
  out.push({z:zc-1,cast:false,fn:g=>E('path',{d:d0,stroke:ped,'stroke-width':1.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)});
  /* each urn: a spindle swelling below its base then narrowed to the mouth, the mouth's lobes a small dark ring, a light flush toward the light; buds greener, smaller, closed */
  const lay=[[],[]];for(const q of fls)lay[q.c[2]>=zc?1:0].push(q);
  lay.forEach((L,li)=>{if(!L.length)return;let du='',dl='',dm='';for(const q of L){const s=.6+.4*q.ag,L2=hl*2*s,r2=rr*s,e=V3.add(q.c,V3.sc(q.ax,L2)),
      sp=l45Spin(q.c,e,t=>r2*(t<.62?.55+.45*Math.sin(Math.PI*t/1.24):.45+.55*Math.cos(Math.PI*(t-.62)/.76))*(q.ag<.3?.85:1),10);du+=smooth(sp.P);
    if(det){const sp2=l45Spin(V3.add(q.c,V3.sc(q.ax,L2*.15)),V3.add(q.c,V3.sc(q.ax,L2*.7)),t=>r2*.4*Math.sin(Math.PI*t),6);dl+=smooth(sp2.P.map(z=>[z[0]-r2*.25,z[1]-r2*.15]))}
    if(q.ag>=.3){const m=l82Q(e);dm+=`M${f(m[0]-r2*.5)},${f(m[1])}a${f(r2*.5)},${f(Math.max(.6,r2*.5*Math.abs(q.ax[2])+.5))} 0 1,0 ${f(r2)},0a${f(r2*.5)},${f(Math.max(.6,r2*.5*Math.abs(q.ax[2])+.5))} 0 1,0 ${f(-r2)},0`}}
    const col=L.some(q=>q.ag<.3)&&y<.35?mix(cw.fl,'#c8d0a0',.35):cw.fl,PP=pal7(col);
    out.push({z:zc+(li?1:-.6),cast:false,fn:g=>{E('path',{d:du,fill:toneAt(PP,li?.66:.52),stroke:PP.ink,'stroke-width':.35,'stroke-opacity':.5},g);if(dl)E('path',{d:dl,fill:PP.l2,opacity:.55},g);
      if(dm)E('path',{d:dm,fill:shd(cw.fl,-.45),stroke:PP.ink,'stroke-width':.3,'stroke-opacity':.5},g)}})});
  return out}
/* the round warty fruits, hanging on long stalks from the leaf axils, of mixed ripeness */
function l82ArbFr(og,op,kl,lim){const H=V3.nz(og.H),n=rnd()<.5?2:1,out=[];
  for(let i=0;i<n;i++){const pd=V3.nz(V3.add(V3.sc(H,.5),[R(-.4,.4),-.8,R(-.3,.3)])),pl=(1.6+R(0,.9))*UPC*kl,rr=(.7+.15*op)*UPC*kl*R(.9,1.08),c=V3.add(og.pos,V3.sc(pd,pl+rr)),
      st=l82Bz(og.pos,V3.add(og.pos,V3.sc(V3.nz(V3.add(H,pd)),pl*.55)),V3.add(og.pos,V3.sc(pd,pl+rr*.3)),5);if(lim!=null&&c[1]-rr<lim)continue;
    const m=Math.max(0,Math.min(1,op*1.1+R(-.45,.25))),col=m<.4?mix('#c8c048','#e8a030',m/.4):m<.75?mix('#e8a030','#e05a24',(m-.4)/.35):mix('#e05a24','#c0281c',(m-.75)/.25),ax=V3.nz(V3.add(pd,[0,0,.3]));
    out.push({z:c[2],cast:false,fn:g=>{l45Line(g,st.map(l82Q),1.3,'#6a4a2a');bzFruit(g,c,ax,rr*.98,rr,col,{gl:.5,paint:(par,cc,e1,e2,mj,r)=>{if(LOD)return;let d='';const nw=DET>=1.5?26:14;
        for(let j=0;j<nw;j++){const a=j*2.4,s=Math.sqrt((j+.5)/nw)*.86,x=cc[0]+(e1[0]*mj*Math.cos(a)+e2[0]*r*Math.sin(a))*s,yy=cc[1]+(e1[1]*mj*Math.cos(a)+e2[1]*r*Math.sin(a))*s;d+=`M${f(x-.6)},${f(yy)}a.6,.6 0 1,0 1.2,0a.6,.6 0 1,0 -1.2,0`}
        E('path',{d,fill:shd(col,-.35),opacity:.55},par)}})}})}
  return out}
function l82Arb(g,t,o){const cw=fgCw(CW_L82ARB,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7.5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l82arb',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),cols=l82St('#7a3a26'),lim=g35Lim(o),pc='#a8402e';let np=0,nf=0;
    const mp=cw.f?3:0,mf=cw.fr?3:0,sh=DET>=1.5?L82_ARBS[0]:L82_ARBS[1];
    const r=fgGrow(k,A,{li:1.7*UPC*kl,liT:.3,w0:3.8*kl,w1:1.5,cols,uL:o.spine?.16:.14,phy:'spiral',la:50,face:.7,lift:.35,seg:9,wig:.03,tipLv:cw.f?0:undefined,
      side:{u0:.25,u1:.72,p:.3,len:.36,ang:34,li:.8,e:-.006,tilt:22},axil:cw.fr?{u0:.35,p:.25,ang:40}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.86?(u-.86)/.14*(.4+.6*(1-op)):0,sz=(p.tip?.45:fgSz(p,.76))*(p.o?.82:1)*kl,L=cm0*UPC*sz*R(.86,1.1),
          c=mix(young?mix(cw.c,'#6a7a2a',young*.6):cw.c,shd(cw.c,R(-.06,.06)),.5);
        return l82Leaf(og,L,sh,c,mix(cw.c,'#a0b088',.42),{lim,pet:.7*UPC*kl,pc,pw:1.2,fold:.12+.3*young,arch:.06,droop:.08,cup:.04,tw:R(-.25,.25),bend:R(-.06,.06),
          gloss:.4,dI:.03,veins:L82_ARBV,vc:shd(cw.c,-.35),vw:.4,vo:.42})},
      tip:(og,p)=>{if(!mp||(p.o&&(np>=mp-1||rnd()<.35)))return null;const pn=l82ArbPan(og,cw,op,kl*(p.o?.85:1),lim);if(pn)np++;return pn},
      axDraw:(og)=>{if(nf>=mf||(lim!=null&&og.pos[1]<lim+8))return null;const fr=l82ArbFr(og,op,kl,lim);if(fr.length)nf++;return fr}});
    open(k,t,1000,0,.4);return r})}

/* ---------- heavenly bamboo (Nandina domestica, Berberidaceae, « bambou sacré »): upright unbranched canes, smooth, light brown, the leaves crowded toward their tops; each leaf large
   (30–50 cm), alternate, two to three times pinnate, its petiole sheathing the cane at its base, the rachis jointed (a red-brown swelling at every joint); the leaflets lanceolate (3–7 cm),
   long-pointed, entire, thin but glossy, green flushed with red (the young leaves bronze-red), turning crimson in winter ('Firepower', 'Obsessed' orange-red, 'Gulf Stream' coppery).
   Sold as leafy canes 50–70 cm ---------- */
const CW_L82NAN=[{id:'vert',n:'Vert teinté de rouge',c:'#4c7a35',t:'#a8402a'},{id:'rouge',n:'Rouge d\'hiver',c:'#c0302a',t:'#8a1a1e',w:1},
  {id:'cuivre',n:'Bronze cuivré (Gulf Stream)',c:'#b77a6a',t:'#8a3a2a',g:'#6a7a3a'},{id:'orange',n:'Orange feu (Firepower, Obsessed)',c:'#d9762a',t:'#c03020',g:'#a8a03a'}];
const L82_NANW=prof([[0,.3],[.1,.72],[.28,.98],[.42,1],[.62,.82],[.82,.46],[.95,.14],[1,0]]),L82_NANS=l82Prof(L82_NANW,.27,10),L82_NANV=[L82_MID];
/* one compound leaf: the sheathing petiole, the rachis arching and drooping, opposite pinnae at its joints (each a little rachis with two pairs of leaflets and one at its end) and a terminal pinna */
function l82NanLeaf(og,Ll,cw,young,lim,kl){const H=V3.nz(og.H),N0=V3.nz(og.U),dr=.18,at=t=>V3.add(V3.add(V3.add(og.pos,V3.sc(H,Ll*t)),V3.sc(N0,Ll*.08*Math.sin(Math.PI*t))),[0,-dr*Ll*t*t,0]),
    det=DET>=1.5&&!LOD,ra=[];for(let i=0;i<=16;i++)ra.push(at(.82*i/16));if(lim!=null&&l45Low(ra)<lim)return null;
  const parts=[],rc=cw.w?mix(cw.t,'#5a4a2a',.3):mix(mix(cw.t,cw.g||cw.c,.45),'#5a4a2a',.2),c0=cw.c,cg=cw.g||c0,lfc=()=>{const k2=rnd(),base=cw.w?c0:mix(c0,cw.t,Math.max(young,.08+.2*k2*k2));return mix(base,shd(base,R(-.08,.08)),.5)};
  const blade=(b,d,N,len,tip)=>{const c=lfc(),S={lim,sm:1,fold:.14+.3*young,arch:.05,droop:.06,cup:.03,tw:R(-.2,.2),bend:R(-.05,.05),gloss:.8,dI:.03,veins:L82_NANV,vc:mix(c,'#e8d8a0',.3),vw:.45,vo:.5,
      tip:!cw.w&&!young&&rnd()<.6?{c:cw.t,from:R(.55,.75),o:.55}:null};return g35Leaf(b,d,N,len,L82_NANS,c,mix(cg,'#c8b8a0',.4),S)};
  const pin=(p,d,N,Lp,np)=>{/* a pinna: its rachis from the joint, leaflets in np opposite pairs and one at its end */
    const q=t=>V3.add(V3.add(V3.add(p,V3.sc(d,Lp*t)),V3.sc(N,Lp*.05*Math.sin(Math.PI*t))),[0,-.1*Lp*t*t,0]),pr=[];for(let i=0;i<=6;i++)pr.push(q(.62*i/6));
    if(lim!=null&&l45Low(pr)<lim)return;parts.push({z:l82Avz(pr)-.05,cast:false,fn:g=>l45Line(g,pr.map(l82Q),1.2,rc)});
    for(let i=0;i<np;i++){const t=.18+.38*i/Math.max(1,np),b=q(t),T=V3.nz(V3s(q(t+.02),q(t-.02))),Sd=V3.nz(V3.cr(N,T));for(const s of[-1,1]){const an=(52+R(-6,6))*D,dd=V3.nz(V3.add(V3.sc(T,Math.cos(an)),V3.sc(Sd,s*Math.sin(an))));
        const pt=blade(V3.add(b,V3.sc(dd,.5)),dd,V3.nz(V3.add(N,V3.sc(Sd,-s*.15))),Lp*.42*R(.9,1.08));if(pt)parts.push(pt)}}
    const e=q(.62),T=V3.nz(V3s(q(.64),q(.6))),pt=blade(e,T,N,Lp*.5*R(.95,1.08));if(pt)parts.push(pt)};
  /* the joints with their pinnae, then the terminal pinna */
  const js=det?[.3,.5,.68]:[.34,.6];js.forEach((t,i)=>{const p=at(t),T=V3.nz(V3s(at(t+.02),at(t-.02))),Sd=V3.nz(V3.cr(N0,T));
    for(const s of[-1,1]){const an=(60-10*i+R(-6,6))*D,d=V3.nz(V3.add(V3.add(V3.sc(T,Math.cos(an)),V3.sc(Sd,s*Math.sin(an))),[0,-.05,0])),N=V3.nz(V3.add(N0,V3.sc(Sd,-s*.2)));
      pin(p,d,N,Ll*(.36-.07*i)*R(.92,1.06),det?(i<js.length-1?3:2):2)}});
  const pe=at(.82),Te=V3.nz(V3s(at(.84),at(.8)));pin(pe,Te,N0,Ll*.3,det?2:1);
  /* the rachis: a sheath clasping the cane at its foot, then tapering, a darker swelling at every joint */
  const w0=Math.max(1.05,(og.w||3)*.42);parts.push({z:l82Avz(ra)-.1,cast:false,fn:g=>{E('path',{d:smooth(l82Rib(ra,t=>t<.1?w0+(1.05-w0)*t/.1:Math.max(.62,1.05*(1-.45*t))),true),fill:rc,stroke:shd(rc,-.5),'stroke-width':.3,'stroke-opacity':.5},g);
    if(det){let d='';for(const t of js.concat([.82])){const p=l82Q(at(t));d+=`M${f(p[0]-1)},${f(p[1])}a1,1 0 1,0 2,0a1,1 0 1,0 -2,0`}E('path',{d,fill:shd(rc,-.35)},g)}}});
  return parts}
function l82Nan(g,t,o){const cw=fgCw(CW_L82NAN,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=30,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l82nan',()=>{const Lt=o.spine?blen(o.spine):60*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.04,.1)),cols=l82St('#8a7550'),lim=g35Lim(o);
    const r=fgGrow(k,A,{li:(DET>=1.5?5:6.5)*UPC*kl,liT:.35,w0:4.2*kl,w1:2.2,cols,uL:o.spine?.3:.42,phy:'spiral',la:40,face:.7,lift:.25,seg:10,wig:.015,rj:20,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.85?(u-.85)/.15*(.5+.5*(1-op)):0,sz=(p.tip?.45:fgSz(p,.82))*kl,Ll=cm0*UPC*sz*R(.88,1.08);return l82NanLeaf(og,Ll,cw,young,lim,kl)}});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf length; for the nandina the whole compound leaf), and how the composer treats them:
   leafy stems along their spine at their natural length (fx the clearance their leaves need) ---------- */
Object.assign(GH,{'gardenia-feuillage':l82Gar,'ligustrum-troene':l82Lig,'cocculus-laurifolius':l82Coc,'arbutus-arbousier':l82Arb,'nandina-domestica-bambou-sacre':l82Nan});
Object.assign(CWS,{'gardenia-feuillage':CW_L82GAR,'ligustrum-troene':CW_L82LIG,'cocculus-laurifolius':CW_L82COC,'arbutus-arbousier':CW_L82ARB,'nandina-domestica-bambou-sacre':CW_L82NAN});
Object.assign(SZG,{'gardenia-feuillage':[7,9,9,11],'ligustrum-troene':[5,7,7,9],'cocculus-laurifolius':[9,11,11,13],'arbutus-arbousier':[6,7.5,7.5,9],'nandina-domestica-bambou-sacre':[25,30,30,40]});
const L82_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'gardenia-feuillage':L82_I(35,{fx:22}),'ligustrum-troene':L82_I(45,{fx:18}),'cocculus-laurifolius':L82_I(65,{fx:26}),'arbutus-arbousier':L82_I(50,{fx:20}),
  'nandina-domestica-bambou-sacre':L82_I(60,{fx:40})});
