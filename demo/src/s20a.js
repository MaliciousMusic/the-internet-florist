/* ================= Serre, lot 20 — baies, grandies par le L-système : fraisier des bois, rosier à cynorrhodons, skimmia, houx verticillé, millepertuis ================= */
/* ---------- shared: a fruit is a spheroid lit from the upper left; its crisp highlight sits where its surface mirrors the light (at the app's detail, small fruits carry it inside their fill: one element each) ---------- */
const BZF={};function bzFill(c,hl){const key=c+(hl?'h'+f(hl):'');const id=BZF[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='bz'+(gid++),P=pal7(c),gr=E('radialGradient',{id:nid,cx:.44,cy:.4,r:.66,fx:.34,fy:.3},defs);
  stops(gr,hl?[[0,'#ffffff',hl],[.12,'#ffffff',hl*.85],[.19,P.l1],[.5,P.b],[.84,P.d1],[1,P.d2]]:[[0,P.l1],[.4,P.b],[.82,P.d1],[1,P.d2]]);BZF[key]=nid;return`url(#${nid})`}
/* O centre (view space, y up), ax its axis (base → tip), hl half its length, r its radius; egg > 0 narrows it toward its tip; eye(par,tip,ax,r) draws what crowns its tip (calyx, style, sepals) */
function bzFruit(par,O,ax,hl,r,col,o={}){const az=ax[2],a2=[ax[0],-ax[1]],l2=Math.hypot(a2[0],a2[1]),e1=l2>1e-4?[a2[0]/l2,a2[1]/l2]:[0,-1],e2=[-e1[1],e1[0]],mj=Math.sqrt(hl*hl*(1-az*az)+r*r*az*az),
    c=[O[0],-O[1]],eg=(o.egg||0)*Math.min(1,l2*1.3),n=DET>=1.5?22:14,pts=[];
  for(let i=0;i<n;i++){const th=i/n*6.283,tc=Math.cos(th),w=r*Math.sin(th)*(1-eg*tc)*(o.cone?1-o.cone*Math.max(0,tc)*l2:1);pts.push([c[0]+e1[0]*mj*tc+e2[0]*w,c[1]+e1[1]*mj*tc+e2[1]*w])}
  const gl=LOD?0:o.gl??.9,sm=DET<1.5&&r<(o.big||3.4),P=pal7(col);
  E('path',{d:smooth(pts),fill:bzFill(col,sm&&gl>.3?gl:0),stroke:o.ink||P.ink,'stroke-width':f(Math.min(.45,r*.12)),'stroke-opacity':.5},par);
  if(o.paint)o.paint(par,c,e1,e2,mj,r);
  if(!sm&&gl>0){const na=V3.dot(HV3,ax),np=V3s(HV3,V3.sc(ax,na)),nl=Math.sqrt(hl*hl*na*na+r*r*V3.dot(np,np))||1,p=V3.sc(V3.add(V3.sc(ax,hl*hl*na),V3.sc(np,r*r)),1/nl),x=c[0]+p[0]*.9,y=c[1]-p[1]*.9,ang=Math.atan2(e1[1],e1[0])/D;
    E('ellipse',{cx:f(x),cy:f(y),rx:f(Math.max(.35,mj*.19)),ry:f(Math.max(.3,r*.13)),fill:'#ffffff',opacity:f(gl),transform:`rotate(${f(ang)} ${f(x)} ${f(y)})`},par);
    if(DET>=1.5&&r>2.5)E('ellipse',{cx:f(c[0]-p[0]*.55),cy:f(c[1]+p[1]*.55),rx:f(mj*.22),ry:f(r*.1),fill:P.l1,opacity:.28,transform:`rotate(${f(ang)} ${f(c[0]-p[0]*.55)} ${f(c[1]+p[1]*.55)})`},par)}
  const tip=[c[0]+a2[0]*hl,c[1]+a2[1]*hl];if(o.eye&&!LOD&&az>-.12)o.eye(par,tip,ax,r);return{c,tip}}
/* sepals, styles, crowns: slender tapered strokes in view space from p along directions, one path */
function bzSpikes(par,list,col,w0,o={}){let d='';for(const[p,q,w]of list){const a=[p[0],-p[1]],b=[q[0],-q[1]],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*(w||w0)/2,ny=dx/l*(w||w0)/2,m=[a[0]+dx*.45+(o.curl||0)*ny*4,a[1]+dy*.45-(o.curl||0)*nx*4];
    d+=`M${f(a[0]+nx)},${f(a[1]+ny)}Q${f(m[0]+nx)},${f(m[1]+ny)} ${f(b[0])},${f(b[1])}Q${f(m[0]-nx)},${f(m[1]-ny)} ${f(a[0]-nx)},${f(a[1]-ny)}Z`}
  if(d)E('path',{d,fill:col,stroke:o.ink||shd(col,-.5),'stroke-width':.3,'stroke-opacity':.6,'stroke-linejoin':'round'},par)}
/* n directions spread round ax at angle sp (radians) from it */
function bzRing(ax,n,sp,ph=0){const up=Math.abs(ax[1])>.9?[1,0,0]:[0,1,0],X=V3.nz(V3.cr(up,ax)),Y=V3.cr(ax,X),out=[];for(let i=0;i<n;i++){const a=ph+i/n*6.283,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a)));out.push(V3.nz(V3.add(V3.sc(ax,Math.cos(sp)),V3.sc(r,Math.sin(sp)))))}return out}
/* ---------- a leaf blade in 3D (lsLeafS: arched, folded on its midrib, drooping), drawn lean: each half toned by its own facing, the midrib, the veins and a gloss streak at sheet detail; teeth cut in the margin ---------- */
function bzBlade(pos,H,U,len,wr,col,o={}){const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));og.L=V3.cr(og.U,og.H);
  const nt=DET<1.5&&o.teeth?Math.ceil(o.teeth*.75):o.teeth||0,wp0=o.wp||LS_OVATE,wp=nt?v=>wp0(v)*(1-(o.td||.12)*.5*(1-Math.cos(2*Math.PI*nt*v))):wp0,S=lsLeafS(og,len,wr,Object.assign({},o,{wp})),nv=nt?nt*2:DET>=1.5?12:8,
    Lf=[],M=[],Rt=[];for(let i=0;i<=nv;i++){const v=i/nv;Lf.push(S(-1,v));M.push(S(0,v));Rt.push(S(1,v))}
  const nrm=u=>{const e=.01,du=V3s(S(u+e,.45),S(u-e,.45)),dv=V3s(S(u,.47),S(u,.43));return V3.nz(V3.cr(du,dv))},nL=nrm(-.5),nR=nrm(.5),sc=q=>[q[0],-q[1]];let z=0;for(const q of M)z+=q[2];z/=M.length;
  const P=pal7(col),PB=pal7(mix(shd(col,.2),'#b8c4a0',.3)),ink=shd(col,-.7);
  return{z:z+(o.zb||0),cast:false,fn:par=>{const g=G(par),half=(E1,n)=>{const back=n[2]<0,pal=back?PB:P,I=Math.max(.28,lightI(back?V3.sc(n,-1):n)*(o.ao||.84)),poly=E1.concat(M.slice().reverse()).map(sc);
      E('path',{d:nt?pD(poly)+'Z':smooth(poly),fill:toneAt(pal,I),stroke:ink,'stroke-width':.4,'stroke-opacity':.42,'stroke-linejoin':'round'},g);return{back,I}};
    const zl=Lf.reduce((a,q)=>a+q[2],0),zr=Rt.reduce((a,q)=>a+q[2],0),hs=zl<zr?[[Lf,nL,-1],[Rt,nR,1]]:[[Rt,nR,1],[Lf,nL,-1]],res={};for(const[E1,n,s]of hs)res[s]=half(E1,n);
    if(LOD)return;const fr=!res[1].back||!res[-1].back,mc=fr?P.l1:PB.d1;E('path',{d:smooth(M.map(sc),false),stroke:mc,'stroke-width':f(Math.max(.4,len*.014)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g);
    if(DET>=1.5&&o.vn){let d='';for(let j=1;j<=o.vn;j++){const v=j/(o.vn+1)*.9,v2=Math.min(.98,v+(o.va||.14));for(const s of[-1,1]){const a=S(0,v),m=S(s*.5,(v+v2)/2+.02),b=S(s*.88,v2);d+=`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`}}
      E('path',{d,stroke:o.pleat?P.d1:mc,'stroke-width':f(Math.max(.3,len*(o.pleat?.012:.007))),'stroke-opacity':o.pleat?.55:.45,fill:'none','stroke-linecap':'round'},g)}
    if(o.gloss&&fr){const s=res[1].I>res[-1].I?1:-1,q=[];for(let i=2;i<=8;i++){const p=S(s*.38,i/10);q.push([p[0],-p[1]])}E('path',{d:smooth(q,false),stroke:'#ffffff','stroke-width':f(len*wr*.07),'stroke-opacity':f(.24*o.gloss),fill:'none','stroke-linecap':'round'},g)}}}}
/* ---------- the shoot: its main axis along the Composer's spine (in a bouquet, from where the bouquet's stems leave it) or standing in the view (sheet, card);
   the L-system grows its side branches, pedicels and leaves from nodes of that axis; returns what a spine species returns ({k, bw, bc}) ---------- */
function bzShoot(g,t,o,S){const k=G(g),parts=[],Lt=o.spine?blen(o.spine):S.Lt,A=spAxis(o,Lt,{face:R(-.6,.6),bow:S.bow??R(-.06,.06)}),s0=o.from||0,wAt=s=>S.w0+(S.w1-S.w0)*s;
  const cuts=[s0];for(let i=1;i<=6;i++)cuts.push(s0+((S.s1??1)-s0)*i/6);spStem(A,parts,cuts,wAt(s0),wAt(S.s1??1),S.sc,S.s1??1,s0);
  S.grow(A,parts,s0);drawParts(k,parts);open(k,t,1000,0,.4);return{k,bw:S.w0,bw1:wAt(s0),bc:S.sc}}
/* a branch grown by the L-system from the length l of the main axis, leaving it el degrees on the side az; its turtle's own options in o */
function bzGrow(A,l,az,el,mods,o={}){const s=A.sOf(l),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),H=V3.nz(V3.add(V3.sc(f0.T,Math.cos(el*D)),V3.sc(r,Math.sin(el*D))));
  let U=V3s(f0.T,V3.sc(H,V3.dot(f0.T,H)));if(V3l(U)<1e-3)U=r;const res=lsTurtle(mods,Object.assign({p:f0.p,H,U:V3.nz(U)},o));res.s=s;res.r=r;return res}
/* the axes of a grown branch into the painter's parts, each drawn with its own colours */
const bzAxes=(res,cols,parts)=>lsChainParts(res.chains,[0,0,0],cols,parts,{piece:4});
/* a ripening colour: green, then (for some) a pale stage, then the colour of the colourway */
function bzRipe(cw,m,pale){const g0=cw.g||'#8aa848';if(m>=1)return cw.c;if(pale&&m<.7)return m<.4?mix(g0,pale,m/.4):mix(pale,cw.c,(m-.4)/.3*.25);return m<.5?mix(g0,cw.y||mix(g0,cw.c,.45),m/.5):mix(cw.y||mix(g0,cw.c,.45),cw.c,(m-.5)/.5)}

/* ---------- millepertuis (Hypericum × inodorum): stiff reddish stems with decussate pairs of sessile ovate leaves; at the top and in the upper axils, cymes of ovoid glossy berries
   (1–1.4 cm), each on its pedicel among five narrow green sepals, crowned by three persistent styles ---------- */
const CW_HYP=[{id:'rouge',n:'Rouge vif (Magical Red)',c:'#b5202c'},{id:'rouge-fonce',n:'Rouge profond (Magical Red Flame)',c:'#7c1626'},{id:'chocolat',n:'Brun chocolat (Coco)',c:'#5b3326',y:'#8a5a30'},
  {id:'rose',n:'Rose (Magical Beauty)',c:'#e9889e',y:'#c8d088'},{id:'peche',n:'Pêche orangé (Magical Pumpkin)',c:'#ef9d6e',y:'#d8cc78'},{id:'creme',n:'Ivoire (Magical Ivory)',c:'#efe6c4',y:'#d6dca0'},
  {id:'vert',n:'Vert (Magical Greenfall)',c:'#9cb84e',y:'#a8c058'}];
function hypPlant(g,t,o){const cw=cwPick(CW_HYP,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||6)*UPC,sc=['#3a1c14','#6a3222','#93533a','#c08466'],lc='#26481f',bh=.62*UPC*Math.max(.85,Math.min(1.15,C/(6*UPC)))**.4;
  return bzShoot(g,t,o,{Lt:C*3.1,w0:3,w1:1.5,sc,grow:(A,parts,s0)=>{const L=A.L,l0=A.L*s0;
    /* a cyme: a central berry, the oldest, and two side ones (or a pair of side cymes) on longer pedicels */
    const cyme=(n,lv)=>[['F',{l:bh*(lv?1.6:.9),w1:.7}],['[',{w:.75}],['+',{a:40+R(-8,8)}],...(n>1?cyme(n-1,lv+1):[['F',{l:bh*1.8,w1:.5}],['B',{age:lv+1}]]),[']',{}],['[',{w:.75}],['-',{a:40+R(-8,8)}],...(n>1?cyme(n-1,lv+1):[['F',{l:bh*1.8,w1:.5}],['B',{age:lv+1}]]),[']',{}],['F',{l:bh*.9,w1:.55}],['B',{age:lv}]];
    const organ=(res,og)=>{if(og.t!=='B')return;const m=Math.max(0,Math.min(1,op*1.25-og.p.age*.12+R(-.05,.05))),s=.72+.28*Math.min(1,op*1.4),hl=bh*s*R(.92,1.08),r=hl*.72,ax=V3.nz(V3.add(og.H,[0,.25,0])),O=V3.add(og.pos,V3.sc(ax,hl*.82)),col=bzRipe(cw,m);
      parts.push({z:O[2],fn:par=>{bzFruit(par,O,ax,hl,r,col,{egg:.18,gl:cw.id==='creme'?.7:.9,eye:DET>=1.5||hl>4.5?(q,tp,a,rr)=>{const b=[tp[0],-tp[1],0],L3=[];for(const d of bzRing(a,3,.32,R(0,6)))L3.push([[b[0],b[1]],V3.add(b,V3.sc(d,rr*.75)),.35]);bzSpikes(q,L3.map(([p,e,w])=>[[p[0],p[1],0],e,w]),'#4a3a2a',.35)}:null})}});
      /* five narrow sepals spread from the base, a little behind the berry */
      const base=og.pos,sp=bzRing(ax,5,1.45+R(-.1,.1),R(0,6)).map(d=>[base,V3.add(base,V3.sc(V3.nz(V3.add(d,V3.sc(ax,-.15))),hl*.95)),hl*.3]);
      parts.push({z:base[2]+ax[2]*hl*.2-.05,fn:par=>bzSpikes(par,sp,mix('#5f8a3a',col,.12),.9)})};
    /* the top cyme, and side cymes in the upper axils; below, decussate leaf pairs */
    const top=bzGrow(A,L-.5,0,4,cyme(2,0),{w:1.2,seg:bh*.6,T:[0,1,0],e:.02,wig:.04});bzAxes(top,sc,parts);for(const og of top.organs)organ(top,og);
    const nodes=4,dl=C*.42;for(let i=0;i<nodes;i++){const l=L-C*.2-dl*i*(1+.15*i);if(l<l0+6)continue;const ph=(i%2?90:0)+R(-10,10);
      for(const sd of[0,180]){const az=(ph+sd)*D;if(i<2&&rnd()<(i?.55:.85)){const br=bzGrow(A,l,az,38+R(-6,6),[['F',{l:C*R(.2,.3),w1:.9}],...cyme(i?1:2,1)],{w:1.3,seg:bh*.6,T:[0,1,0],e:.04,wig:.05});bzAxes(br,sc,parts);for(const og of br.organs)organ(br,og)}
        const f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),H=V3.nz(V3.add(V3.sc(f0.T,.45),r)),len=C*R(.85,1.05)*(1-.12*Math.max(0,1-i));
        parts.push(bzBlade(V3.add(f0.p,V3.sc(r,1.2)),H,f0.T,len,.5,lc,{wp:LS_OVATE,droop:.18,arch:.06,fold:.25,vn:4,face:.5}))}}}})}

/* ---------- houx verticillé (Ilex verticillata): bare grey-brown twigs, alternate side shoots rising stiffly, crowded along their length with round berries (6–9 mm) on very short stalks,
   one to three at each node, a black stigma dot at their tip: a graphic line ---------- */
const CW_ILEX=[{id:'rouge',n:'Rouge (Winter Red)',c:'#c4161f'},{id:'rouge-vif',n:'Rouge orangé (Berry Heavy)',c:'#d63a22'},{id:'orange',n:'Orange (Winter Gold)',c:'#e8782c'},
  {id:'saumon',n:'Saumon rosé (Winter Gold)',c:'#ee9a78'},{id:'jaune',n:'Jaune or (Berry Heavy Gold)',c:'#eec03a'}];
function ilexPlant(g,t,o){const cw=cwPick(CW_ILEX,o),op=Math.max(.05,Math.min(1,o.op??1)),Lf=(o.cm||50)*UPC,sc=['#2e2622','#564a42','#7f736a','#aaa096'],dt=DET>=1.5,br=.38*UPC;
  return bzShoot(g,t,o,{Lt:Lf*1.3,w0:4.6,w1:1.1,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=shd(cw.c,-.7);
    /* berries at the nodes of an axis between la and lb: phyllotaxis 2/5, one to three per node, pressed against the twig */
    const berries=(node,la,lb,step)=>{for(let l=la,i=0;l<lb;l+=step*R(.85,1.15),i++){const q=node(l),nb=dt?(rnd()<.5?2:rnd()<.5?3:1):(rnd()<.45?1:2);
      for(let j=0;j<nb;j++){const az=(i*144+j*(360/nb)*.55+R(-25,25))*D,rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),ax=V3.nz(V3.add(V3.sc(rd,1),V3.sc(q.T,R(.2,.7)))),
        rr=br*R(.88,1.1)*(.8+.2*Math.min(1,op*1.5)),O=V3.add(q.p,V3.add(V3.sc(rd,q.w*.5+rr*.82),V3.sc(q.T,rr*.3))),m=Math.min(1,op*1.3+R(-.12,.05)),col=mix(bzRipe(cw,m),shd(cw.c,-.2),R(0,.25));
        parts.push({z:O[2]+.02,fn:par=>bzFruit(par,O,ax,rr,rr,col,{gl:.95,big:3.6,ink,eye:dt?(k2,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.08),cy:f(tp[1]+a[1]*r2*.08),rx:f(r2*.17),ry:f(r2*.17*Math.max(.35,Math.abs(a[2]))),fill:'#1c1410',opacity:.8},k2):null})})}}};
    const mainNode=l=>{const s=A.sOf(l),q=A.at(s),w=S0w(s);return{p:q.p,T:q.T,Fr:q.Fr,Sd:q.Sd,w}},S0w=s=>4.6+(1.1-4.6)*s;
    berries(mainNode,Math.max(l0+4,L*.3),L-2,dt?5.5:7.5);
    /* alternate side shoots, rising stiffly; each carries its own berries (and sometimes a short spur) */
    const ns=2+(rnd()<.6?1:0)+(rnd()<.4?1:0);for(let i=0;i<ns;i++){const l=L*(.18+.5*i/Math.max(1,ns-1))*R(.92,1.08);if(l<l0+8)continue;const az=(i*150+R(-25,25))*D,ll=(L-l)*R(.5,.75);
      const res=bzGrow(A,l,az,R(24,36),[['F',{l:ll*.5,w1:2.2-.3*i}],['[',{w:1.2}],['+',{a:R(25,40)}],['F',{l:ll*R(.22,.35),w1:.8}],[']',{}],['F',{l:ll*.5,w1:.9}]],{w:2.6-.3*i,seg:8,T:[0,1,0],e:.012,wig:.025});bzAxes(res,sc,parts);
      for(const ch of res.chains){const P=ch.pts,cum=[0];for(let j=1;j<P.length;j++)cum.push(cum[j-1]+V3l(V3s(P[j],P[j-1])));const Lc=cum[cum.length-1];if(Lc<10)continue;
        const node=l2=>{let j=1;while(j<P.length-1&&cum[j]<l2)j++;const u=(l2-cum[j-1])/((cum[j]-cum[j-1])||1),p=V3.add(P[j-1],V3.sc(V3s(P[j],P[j-1]),u)),T=V3.nz(V3s(P[j],P[j-1])),Sd=V3.nz(V3.cr(T,[0,0,1]).map((v,ii)=>v||(ii?0:1e-3))),Fr=V3.cr(Sd,T);
          return{p,T,Fr,Sd,w:ch.ws[j-1]+(ch.ws[j]-ch.ws[j-1])*u}};berries(node,Lc*(ch.ord?.1:.25),Lc-1.5,dt?5.5:7.5)}}}})}

/* ---------- skimmia (Skimmia japonica): a stout stem crowned by a rosette of leathery, glossy elliptic leaves; above it a dense conical panicle of round buds on red or green pedicels
   (male 'Rubella', 'Kew Green'), opening to small starry four-petalled white flowers; the female plants carry a cluster of glossy round red berries instead ---------- */
const CW_SKIM=[{id:'rubella',n:'Boutons rouges (Rubella)',c:'#8a2232',ped:'#6a1e26',fl:'#f6eef0'},{id:'rubesta',n:'Boutons pourpres foncés',c:'#55182a',ped:'#4a1a22',fl:'#f2e6ea'},
  {id:'marlot',n:'Boutons rose crème (Magic Marlot)',c:'#d8a6a8',ped:'#8a4a48',fl:'#f8f2ee'},{id:'kew-green',n:'Boutons verts (Kew Green)',c:'#c5cc9c',ped:'#6f8a3e',fl:'#f4f2e2',g:'#a8b878'},
  {id:'baies',n:'Baies rouges (pied femelle)',c:'#c41c26',ped:'#5a6a2e',berry:1}];
function skimPlant(g,t,o){const cw=cwPick(CW_SKIM,o),op=Math.max(.05,Math.min(1,o.op??(cw.berry?1:R(.1,.3)))),C=(o.cm||6)*UPC,sc=['#24301a','#3e5428','#62803e','#9cb878'],lc='#1d3c18',dt=DET>=1.5;
  return bzShoot(g,t,o,{Lt:C*2.3,w0:4.4,w1:2.6,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the rosette: leaves crowded on the top centimetres of the stem, spirally (137.5°), spreading more the lower they are */
    const nl=dt?11:8;for(let i=0;i<nl;i++){const l=L-C*.78-C*.3*i/nl;if(l<l0+3)continue;const az=(i*137.5+R(-12,12))*D,f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),el=(70+26*i/nl+R(-6,6))*D;
      const H=V3.nz(V3.add(V3.sc(f0.T,Math.cos(el)),V3.sc(r,Math.sin(el)))),len=C*R(1.25,1.5)*(1-.1*i/nl);parts.push(bzBlade(V3.add(f0.p,V3.sc(r,1.6)),H,f0.T,len,.4,mix(lc,'#3a5a26',R(0,.4)),{wp:LS_OVATE,droop:.22,arch:.05,fold:.3,vn:5,va:.2,gloss:1,face:.4}))}
    /* the panicle (male) or the fruiting cluster (female): side branches spiralled up the short rachis, each with its pedicels */
    const pc=cw.ped,lb=C*.5,ns=dt?16:10,fl=[];
    for(let i=0;i<ns;i++){const q=i/(ns-1),l=L-lb*(1-q*.92);const az=(i*137.5)*D,el=86-56*q+R(-6,6),bl=C*(.4-.28*q)*R(.9,1.1),np=cw.berry?(q<.85?2:1):Math.round((dt?7:6)-(dt?4:3.5)*q+R(0,1));
      const mods=[['F',{l:bl*.4,w1:.7}]];for(let j=0;j<np;j++)mods.push(['[',{w:.5}],['/',{a:j*137.5}],['&',{a:R(30,50)}],['F',{l:bl*(cw.berry?.35:.13)*R(.8,1.2),w1:.4}],['K',{j}],[']',{}],['F',{l:bl*.6/np,w1:.6-.2*j/np}]);mods.push(['K',{j:np}]);
      const res=bzGrow(A,l,az,el,mods,{w:.9,seg:3,T:[0,1,0],e:.05,wig:.06});bzAxes(res,[shd(pc,-.4),pc,shd(pc,.2),shd(pc,.5)],parts);for(const og of res.organs)fl.push(og)}
    const top=A.at(1);fl.push({pos:V3.add(top.p,V3.sc(top.T,1)),H:top.T,p:{j:0}});
    for(const og of fl){const ax=V3.nz(V3.add(og.H,[0,.3,0]));
      if(cw.berry){const rr=.42*UPC*R(.9,1.08),O=V3.add(og.pos,V3.sc(ax,rr*.85)),m=Math.min(1,op*1.3+R(-.1,.05)),col=mix(bzRipe(cw,m),shd(cw.c,-.25),R(0,.2));
        parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,rr*1.04,rr,col,{gl:.9,big:3.6,eye:dt?(k2,tp,a,r2)=>E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(r2*.14),fill:'#3a1a14',opacity:.75},k2):null})});continue}
      /* a bud swells, colours, then opens to a small white star of four petals round yellow anthers */
      const age=Math.max(0,Math.min(1,op*.75-.06+R(-.16,.16)+(1-og.p.j/4)*.08)),opn=age>.72,rb=.21*UPC*(.8+.3*Math.min(1,age*1.6))*R(.9,1.1),O=V3.add(og.pos,V3.sc(ax,rb*.8));
      if(!opn){const col=age<.32?mix(cw.g||'#8a9a52',cw.c,.25+.75*age/.32):cw.c;parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,rb*1.06,rb,mix(col,shd(col,-.25),R(0,.3)),{gl:.45,big:9})});continue}
      const Bf=spFrame(ax,[0,1,0],R(0,1.5)),R0=.42*UPC*R(.9,1.1);
      parts.push({z:O[2],fn:par=>{const k2=G(par);if(!dt){const P=[];for(let j=0;j<8;j++){const a=j/8*6.283,rr=j%2?R0*.3:R0,p=PJ(Bf,O,[Math.cos(a)*rr,Math.sin(a)*rr,0]);P.push([p[0],p[1]])}E('path',{d:pD(P)+'Z',fill:toneAt(pal7(cw.fl),lightI(Bf[2][2]<0?V3.sc(Bf[2],-1):Bf[2])),stroke:shd(cw.c,-.2),'stroke-width':.35,'stroke-opacity':.7,'stroke-linejoin':'round'},k2)}
        else{const it=[];for(let j=0;j<4;j++)it.push({l:ligule(Bf,O,{phi:j*1.5708+.785,r0:R0*.05,z0:0,L:R0,W:R0*.42,wp:prof([[0,.4],[.4,1],[1,.5]]),a0:1.2,a1:1.65,pw:1.2,th:.6,tip:'round',n:3}),c:cw.fl,ink:shd(cw.c,-.1)});drawLig(k2,it)}
        const ce=PJ(Bf,O,[0,0,R0*.1]);E('circle',{cx:f(ce[0]),cy:f(ce[1]),r:f(R0*.2),fill:'#e2c84a',stroke:'#9a7a2a','stroke-width':.25},k2)}})}}})}

/* ---------- rosier à cynorrhodons (Rosa canina, R. rugosa and fruiting roses): woody stems with hooked prickles, pinnate toothed leaves, and at the tips corymbs of ovoid glossy hips (1.5–2.5 cm)
   crowned by their dried sepals ---------- */
const CW_HIP=[{id:'rouge',n:'Rouge',c:'#c0202a',y:'#e2782a'},{id:'rouge-orange',n:'Rouge orangé',c:'#d8401f',y:'#e2862a'},{id:'orange',n:'Orange',c:'#e6672a',y:'#d8a03a'},{id:'bordeaux',n:'Bordeaux',c:'#74141f',y:'#a83a26'},{id:'vert',n:'Vert (fruits verts)',c:'#9aac4e',y:'#a8b450'}];
function hipPlant(g,t,o){const cw=cwPick(CW_HIP,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,sc=['#2e1810','#5a2c1c','#86483a','#b47a62'],dt=DET>=1.5,hh=1*UPC*Math.max(.85,Math.min(1.2,C/(8*UPC)))**.35;
  return bzShoot(g,t,o,{Lt:C*2.9,w0:3.6,w1:1.6,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* a corymb of hips: two to four pedicels from the tip, rising and fanning out, the central hip the largest */
    const corymb=n=>{const m=[['F',{l:hh*1.2,w1:.9}]];for(let j=0;j<n-1;j++)m.push(['[',{w:.7}],['/',{a:j*360/(n-1)+R(-20,20)}],['&',{a:R(28,44)}],['F',{l:hh*R(2.2,3),w1:.55}],['H',{s:R(.82,.95)}],[']',{}]);m.push(['F',{l:hh*R(1.8,2.4),w1:.6}],['H',{s:1}]);return m};
    const ink=shd(cw.c,-.7),hip=(og)=>{const s=og.p.s*(.75+.25*Math.min(1,op*1.4)),hl=hh*s,r=hl*.66,ax=V3.nz(V3.add(og.H,[0,.2,0])),O=V3.add(og.pos,V3.sc(ax,hl*.95)),m=Math.min(1,op*1.25+R(-.1,.05)),col=bzRipe(cw,m);
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,r,col,{egg:.22,gl:.95,ink,eye:(q,tp,a,rr)=>{const b=[tp[0],-tp[1],0],sp=bzRing(a,5,R(.55,.95),R(0,6)).map(d=>[V3.add(b,V3.sc(a,-rr*.08)),V3.add(b,V3.sc(d,rr*R(.75,1.05))),rr*.16]);
        const mo=a[2]>.25;if(mo)E('ellipse',{cx:f(tp[0]),cy:f(tp[1]),rx:f(rr*.2),ry:f(rr*.2*Math.max(.3,a[2])),fill:'#2a1610',opacity:.85},q);bzSpikes(q,sp,'#3c2418',.5,{curl:.25,ink:'#1a0e08'})}})});
      /* the neck of the hip: the pedicel thickens into it */
      parts.push({z:og.pos[2]-.01,fn:par=>bzSpikes(par,[[og.pos,V3.add(og.pos,V3.sc(ax,hl*.5)),r*.5]],mix('#6a5a2a',col,.35),1)})};
    const run=(res)=>{bzAxes(res,sc,parts);for(const og of res.organs){if(og.t==='H')hip(og);else if(og.t==='P'){const p=og.pos,sd=og.p.s,rr=V3.nz(V3.cr(og.H,[0,0,1]).map((v,i)=>v+(i===2?sd*.6:0))),w=og.w*.5,tipP=V3.add(V3.add(p,V3.sc(rr,w+2.1)),V3.sc(og.H,-1.3));
        parts.push({z:p[2]+rr[2]*w,fn:par=>E('path',{d:`M${f(p[0]-og.H[0]*1.5+rr[0]*w*.8)},${f(-(p[1]-og.H[1]*1.5+rr[1]*w*.8))}Q${f(p[0]+rr[0]*(w+1))},${f(-(p[1]+rr[1]*(w+1)))} ${f(tipP[0])},${f(-tipP[1])}L${f(p[0]+og.H[0]*1.2+rr[0]*w*.8)},${f(-(p[1]+og.H[1]*1.2+rr[1]*w*.8))}Z`,fill:'#9a4a32',stroke:'#4a1e14','stroke-width':.3,'stroke-opacity':.7},par)})}}};
    /* pinnate leaf: a rachis carrying pairs of toothed leaflets and one at its tip */
    const leaf=(l,az,len)=>{const f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),res=bzGrow(A,l,az,R(48,62),[['F',{l:len*.3,w1:.5}],['Lp',{i:0}],['F',{l:len*.24,w1:.45}],['Lp',{i:1}],['F',{l:len*.22,w1:.35}],['Lt',{}]],{w:.7,seg:4,T:[0,-1,0],e:.03,wig:.03}),
      lc=rnd()<.2?'#6a7a2a':'#244019';bzAxes(res,['#283a18','#3e5a28','#5e7c3c','#8aa868'],parts);
      for(const og of res.organs){const ll=len*(og.t==='Lt'?.42:.36+.04*og.p.i);if(og.t==='Lt')parts.push(bzBlade(og.pos,og.H,og.U,ll,.55,lc,{teeth:6,td:.14,droop:.15,fold:.25,vn:4,face:.4}));
        else for(const s of[-1,1]){const H=V3.nz(V3.add(V3.sc(og.L,s),V3.sc(og.H,.55))),pt=bzBlade(og.pos,H,og.U,ll,.55,mix(lc,'#3a6a2a',R(0,.3)),{teeth:6,td:.14,droop:.2,fold:.25,vn:4,face:.4});parts.push(pt)}}};
    /* the main shoot ends in a corymb; side shoots, alternate, end in theirs; prickles and leaves along the way */
    const tr=bzGrow(A,L-.4,0,4,corymb(dt?4:3),{w:1.6,seg:5,T:[0,1,0],e:.02,wig:.04});run(tr);
    const ns=dt?4:3;for(let i=0;i<ns;i++){const l=L-C*(.45+.42*i)*R(.9,1.1);if(l<l0+6)continue;const az=(i*144+R(-25,25))*D,ll=C*R(.5,.8),mods=[['F',{l:ll*.4,w1:1.4}],['P',{s:1}],['F',{l:ll*.6,w1:1.1}],...corymb(i%2?2:3+(rnd()<.4?1:0))];
      run(bzGrow(A,l,az,R(30,45),mods,{w:2,seg:5,T:[0,1,0],e:.03,wig:.05}));leaf(l-C*.12,az+2.4,C*R(.85,1.05))}
    leaf(L-C*.28,R(0,6),C*R(.75,.95));
    /* hooked prickles on the main stem, on every side */
    for(let l=l0+5;l<L-6;l+=R(9,15)){const s=A.sOf(l),q=A.at(s),az=R(0,6.283),rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),w=(3.6+(1.6-3.6)*s)*.5,p=q.p,b0=V3.add(p,V3.add(V3.sc(rd,w*.8),V3.sc(q.T,-1.8))),b1=V3.add(p,V3.add(V3.sc(rd,w*.8),V3.sc(q.T,1.6))),tp=V3.add(p,V3.add(V3.sc(rd,w+2.4),V3.sc(q.T,-1.6))),mid=V3.add(p,V3.add(V3.sc(rd,w+1.2),V3.sc(q.T,.2)));
      parts.push({z:A.zk?A.zk(s,p[2]+rd[2]*w):p[2]+rd[2]*w,fn:par=>E('path',{d:`M${f(b0[0])},${f(-b0[1])}Q${f(mid[0])},${f(-mid[1])} ${f(tp[0])},${f(-tp[1])}Q${f(mid[0]+q.T[0])},${f(-mid[1]-q.T[1]*2)} ${f(b1[0])},${f(-b1[1])}Z`,fill:'#a0503a',stroke:'#4a1e14','stroke-width':.3,'stroke-opacity':.7},par)})}}})}

/* ---------- fraisier des bois (Fragaria vesca): a slender hairy scape forking into a cyme — the oldest fruit ripe and hanging, the younger white or green, the last still in flower
   (five round white petals round a yellow cone); a trifoliate, coarsely toothed and pleated leaf on its long petiole; a red runner arching away ---------- */
const CW_FRA=[{id:'rouge',n:'Rouge (des bois)',c:'#c8202a'},{id:'vermillon',n:'Rouge vermillon (Mara des bois)',c:'#de3a26'},{id:'blanc',n:'Blanc (White Soul)',c:'#f2ead2',y:'#e8ecc8',ach:'#c8a050'},
  {id:'jaune',n:'Jaune pâle (Yellow Wonder)',c:'#eedc98',y:'#e6e8b8',ach:'#c09038'},{id:'vert',n:'Fruits verts et fleurs',c:'#a8bc5a',y:'#c8d48a',green:1}];
function fraPlant(g,t,o){const cw=cwPick(CW_FRA,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,sc=['#3a3a18','#5e6a2c','#869a4e','#b8c488'],dt=DET>=1.5,fh=.7*UPC*Math.max(.85,Math.min(1.15,C/(8*UPC)))**.35,lc='#3c6a2a';
  return bzShoot(g,t,o,{Lt:C*2,w0:1.7,w1:1,sc,bow:R(-.15,.15),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the cyme: each fork carries an older flower in its angle; ages fall with the order */
    const cy=(n,lv)=>n?[['F',{l:C*(.16-.03*lv)*R(.85,1.15),w1:.8-.1*lv}],['[',{w:.55}],['+',{a:R(30,42)}],...cy(n-1,lv+1),[']',{}],['[',{w:.55}],['-',{a:R(30,42)}],...cy(n-1,lv+1),[']',{}],['[',{w:.45}],['&',{a:R(15,30)}],['F',{l:C*.24,w1:.45,e:.3}],['X',{lv}],[']',{}]]:[['F',{l:C*.26,w1:.42,e:.3}],['X',{lv}]];
    const res=bzGrow(A,L-.3,0,6,cy(dt?3:2,0),{w:1,seg:3,T:[0,-1,0],e:.02,wig:.05});bzAxes(res,sc,parts);
    for(const og of res.organs){const m=op*1.2+.1-og.p.lv*.45+R(-.06,.06)+(cw.green?-.3:0);
      if(m<.15){/* a flower (or a bud), facing out and up */const ax=V3.nz(V3.add(og.H,[0,1.1,.5])),Bf=spFrame(ax,og.H,R(0,1)),R0=.75*UPC*R(.9,1.08),bud=m<-.3,O=og.pos;
        parts.push({z:O[2],fn:par=>{const k2=G(par);if(bud){spBud(k2,Bf,O,R0*.75,R0*.7,'#e8ecd8',{tp:.4,pw:.6});bzSpikes(k2,bzRing(ax,5,.4,R(0,6)).map(d=>[O,V3.add(O,V3.sc(d,R0*.7)),R0*.25]),'#5a8a3a',.8);return}
          bzSpikes(k2,bzRing(ax,5,1.2,R(0,6)).map(d=>[O,V3.add(O,V3.sc(d,R0*.85)),R0*.3]),'#5a8a3a',.8);
          const it=[],rot=R(0,6.28);for(let j=0;j<5;j++)it.push({l:ligule(Bf,O,{phi:j*1.2566+rot,r0:R0*.12,z0:R0*.05,L:R0*.85,W:R0*.4,wp:prof([[0,.35],[.35,.9],[.7,1],[1,.75]]),a0:1.25,a1:1.5,pw:1.2,th:.35,tip:'round',n:dt?5:3}),c:'#f8f6ee',ink:'#a8a890'});drawLig(k2,it);
          capDisc(k2,Bf,V3.add(O,toV(Bf,[0,0,R0*.08])),R0*.28,R0*.18,'#d8c040',{dots:dt?14:0,dc:'#9a8a20'})}});continue}
      /* a fruit: hanging from its calyx, conical, achenes on its skin; green, then white, then ripe */
      const mm=Math.min(1,(m-.15)/.7),s=.55+.45*mm,hl=fh*s*R(.92,1.08),r=hl*.8,ax=V3.nz(V3.add(V3.sc(og.H,.5),[0,-1,0])),O=V3.add(og.pos,V3.sc(ax,hl*.95)),col=bzRipe(cw,mm,cw.y?null:'#f2ecd8'),ach=cw.ach||(mm>.8?'#e8c048':'#c8c890');
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,r,col,{egg:-.25,cone:.35,gl:.85,big:2.5,paint:(q,c,e1,e2,mj,rr)=>{if(LOD)return;let d='',dd='';const n=dt?26:12;for(let i=0;i<n;i++){const tt=-.75+1.6*((i*.618)%1),aa=i*2.4,cs=Math.cos(aa);if(cs<.1)continue;
          const wv=rr*Math.sqrt(Math.max(0,1-tt*tt))*(1+.25*tt)*(1-.35*Math.max(0,tt)),x=c[0]+e1[0]*mj*tt*.92+e2[0]*wv*Math.sin(aa)*.9,y=c[1]+e1[1]*mj*tt*.92+e2[1]*wv*Math.sin(aa)*.9,s2=Math.max(.28,rr*.09)*(.5+.5*cs);
          d+=`M${f(x-s2)},${f(y)}a${f(s2)},${f(s2*.8)} 0 1,0 ${f(2*s2)},0a${f(s2)},${f(s2*.8)} 0 1,0 ${f(-2*s2)},0`;dd+=`M${f(x-s2*1.5)},${f(y+s2*.3)}a${f(s2*1.5)},${f(s2)} 0 1,0 ${f(3*s2)},0`}
        if(dt&&dd)E('path',{d:dd,fill:'none',stroke:shd(col,-.35),'stroke-width':.3,'stroke-opacity':.5},q);if(d)E('path',{d,fill:ach,opacity:.9},q)}})});
      /* its calyx, spread back flat (ripe) or clasping (young) */
      const cs=bzRing(ax,10,mm>.5?2.1:1.4,R(0,6)).map((d,i)=>[og.pos,V3.add(og.pos,V3.sc(d,hl*(i%2?.55:.85))),hl*(i%2?.18:.3)]);parts.push({z:og.pos[2]-ax[2]*1.5,fn:par=>bzSpikes(par,cs,'#4f7a32',.8)})}
    /* the trifoliate leaf on its long petiole, and the bract leaf at the first fork */
    const tri=(l,az,len,el)=>{const res=bzGrow(A,l,az,el,[['F',{l:len*1.3,w1:.6}],['[',{}],['+',{a:55}],['Lf',{}],[']',{}],['[',{}],['-',{a:55}],['Lf',{}],[']',{}],['Lf',{c:1}]],{w:.8,seg:5,T:[0,-1,0],e:.025,wig:.03});bzAxes(res,sc,parts);
      for(const og of res.organs)parts.push(bzBlade(og.pos,og.H,og.U,len*(og.p.c?1:.9),.64,mix(lc,'#4a7a32',R(0,.3)),{wp:LS_OVATE,teeth:8,td:.16,droop:.12,arch:.04,fold:.32,vn:7,va:.12,pleat:1,face:.45}))};
    if(L-C*1.15>l0+4)tri(L-C*1.15,R(0,6),C*.42,R(30,45));tri(L-C*.95+C*.4,R(2,4),C*.22,R(40,55));
    /* the runner: thin, red, arching out and down, a small plantlet at its node */
    const rl=L-C*1.6;if(rl>l0+3){const ru=bzGrow(A,rl,R(0,6),R(55,75),[['F',{l:C*.9,w1:.65,c:['#4a1a14','#7a2a20','#a84a38','#d08a70']}],['F',{l:C*.5,w1:.55,e:.05}],['Pl',{}],['F',{l:C*.25,w1:.4}]],{w:.75,seg:4,T:[0,-1,0],e:.03,wig:.03});
      bzAxes(ru,sc,parts);for(const og of ru.organs)for(let j=0;j<3;j++){const az=j*2.1+R(-.2,.2),H=V3.nz(V3.add(V3.sc(og.U,.9),V3.add(V3.sc(og.L,Math.cos(az)*.8),V3.sc(og.H,Math.sin(az)*.6))));parts.push(bzBlade(og.pos,H,og.H,C*R(.13,.17),.7,'#5a8a3a',{teeth:5,td:.15,droop:.05,fold:.3,face:.4}))}}}})}

/* ---------- registers ---------- */
Object.assign(GH,{'hypericum':hypPlant,'houx-verticille-ilex':ilexPlant,'skimmia-japonica':skimPlant,'rosier-a-cynorrhodons':hipPlant,'fraisier-des-bois':fraPlant});
Object.assign(CWS,{'hypericum':CW_HYP,'houx-verticille-ilex':CW_ILEX,'skimmia-japonica':CW_SKIM,'rosier-a-cynorrhodons':CW_HIP,'fraisier-des-bois':CW_FRA});
Object.assign(SZG,{'hypericum':[5,6,6,7,8],'houx-verticille-ilex':[40,50,50,60,70],'skimmia-japonica':[5,6,6,7,8],'rosier-a-cynorrhodons':[6,8,8,10],'fraisier-des-bois':[6,8,8,10]});
Object.assign(GHI,{'hypericum':{form:'baie',size:1.1,k:'plant',rk:.85,tip:.8},'skimmia-japonica':{form:'baie',size:1.4,k:'plant',rk:.9,tip:.9},'rosier-a-cynorrhodons':{form:'baie',size:1.2,k:'plant',rk:.9,tip:.75},
  'fraisier-des-bois':{form:'baie',size:1.1,k:'plant',rk:.8},'houx-verticille-ilex':{form:'ligne',size:1,k:'plant',self:75*UPC,tip:.95,fx:3*UPC}});
