/* ================= Serre, lot 80 — persistants 2 : photinia 'Red Robin', chalef (Elaeagnus × ebbingei), fusain du Japon, griselinia, aucuba du Japon ================= */
/* Feuillages persistants coupés, poussés par le L-système (fgGrow du lot 24) : rameaux ligneux qui se courbent, feuilles en nappes 3D à deux faces (g35Leaf du lot 35),
   marges dentées, panachures (liseré ou cœur), taches d'or, écailles argentées et rousses du revers, jeunes pousses colorées ; corymbes du photinia, fleurs d'automne du chalef,
   baies de l'aucuba (bzFruit du lot 20). Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */

/* ---------- the lot's outlines: a blade from its width profile (wp, width ratio wr); its margin toothed from y0 to the tip (n teeth, d their depth as a share of the half-width,
   each point leaning toward the tip), its base oblique (ob: the left half narrower near the base); the two halves as g35Leaf takes them ---------- */
function l80Prof(wp,wr,o={}){const n=o.n||0,d=o.d||0,y0=o.y0??.12,ob=o.ob||0,m=14,half=sg=>{const P=[];
    if(!n)for(let i=0;i<m;i++){const y=i/m;P.push([sg*wp(y)*wr/2,y])}
    else{const k=Math.max(2,Math.round(y0*m));for(let i=0;i<k;i++){const y=i/k*y0;P.push([sg*wp(y)*wr/2,y])}
      for(let j=0;j<n;j++){const a=y0+(.97-y0)*j/n,b=y0+(.97-y0)*(j+1)/n,bt=b-(b-a)*.14;P.push([sg*wp(a)*wr/2*(1-d),a],[sg*wp(bt)*wr/2,bt])}}
    P.push([0,1]);if(ob&&sg<0)for(const q of P)q[0]*=1-ob*Math.pow(Math.max(0,1-q[1]/.4),1.4);return P};
  return{R:half(1),L:half(-1),mid:[[0,0],[0,.5],[0,1]]}}
/* a variegated centre as an irregular splash: its share of the half-width along the blade (narrow at the base and the tip, wavy) */
const l80Splash=(a=.62)=>{const p1=R(0,6),p2=R(0,6);return y=>Math.max(.05,a*Math.pow(Math.sin(Math.PI*Math.min(1,y*1.08)),.6)*(1+.16*Math.sin(y*11+p1)+.08*Math.sin(y*23+p2)))};
const l80Mg=k=>{const p=R(0,6);return y=>k+.06*Math.sin(y*9+p)};
/* ---------- the lot's leaf: g35Leaf (two halves lit apart, the back its own colour, variegation, gloss), kept above the mouth like it (tried at 1, .8, .64 of its length),
   then marks laid on its surface: spots on the upper face (sp {c, n, r}: gold flecks), dots on the back (dt {c, n, r}: the rusty scales), both in one path per half ---------- */
function l80Leaf(F,len,sh,c,cb,o={}){let L=len;
  if(o.lim!=null){const ok=l=>{const M=g35Surf(F.P0,F.H,F.N,l,o);return sh.R.concat(sh.L).every(([x,y])=>M(x,y)[1]>=o.lim)};let i=0;while(i<3&&!ok(L)){L*=.8;i++}if(i===3)return{z:0,cast:false,fn:()=>{}}}
  const base=g35Leaf(F.P0,F.H,F.N,L,sh,c,cb,Object.assign({},o,{lim:null}));if(LOD||!(o.sp||o.dt))return base;
  const M=g35Surf(F.P0,F.H,F.N,L,o),nR=g35Nrm(M,.15,.5),nL=g35Nrm(M,-.15,.5),fr=x=>(x>0?nR:nL)[2]>=0,det=DET>=1.5;
  const marks=(spec,face)=>{if(!spec)return[];const out=[[],[]],n=Math.round(spec.n*(det?1:.6));
    for(let i=0;i<n;i++){const y=R(.06,.93),sg=rnd()<.5?-1:1,xw=g35Xw(sh,y),r=spec.r*R(.5,1.35)*(det?1:1.25);if(xw<r*2.2)continue;const x=sg*R(.06,1)*(xw*.9-r);if(fr(x)!==face)continue;
      const e=R(.55,1),a0=R(0,3.14),pts=[];for(let j=0;j<6;j++){const a=j/6*6.283,ca=Math.cos(a)*r,sa=Math.sin(a)*r*e;pts.push(g35Q(M(x+ca*Math.cos(a0)-sa*Math.sin(a0),y+ca*Math.sin(a0)+sa*Math.cos(a0))))}
      out[x>0?1:0].push(pts)}return out};
  const S=marks(o.sp,true),B=marks(o.dt,false),tone=(col,x)=>toneAt(pal7(col),lightI((x>0?nR:nL)[2]>=0?(x>0?nR:nL):V3.sc(x>0?nR:nL,-1))),dd=L2=>L2.map(p=>(o.spSm?smooth(p):g35D(p))).join('');
  return{z:base.z,cast:false,fn:par=>{base.fn(par);for(const[k2,x]of[[0,-1],[1,1]]){if(S[k2]&&S[k2].length)E('path',{d:dd(S[k2]),fill:tone(o.sp.c,x)},par);if(B[k2]&&B[k2].length)E('path',{d:dd(B[k2]),fill:tone(o.dt.c,x),opacity:.85},par)}}}}
/* the colours of a woody stem from its bark colour */
const l80Cols=c=>[shd(c,-.6),shd(c,-.3),c,shd(c,.35)];
/* a stalk from a to b in view space, bowed a little, never thinner than 1.15 (anything finer reads as loose) */
const l80Stalk=(a,b,w,c,zb=-.05)=>g35Pet(a,b,Math.max(1.15,w),c,zb);
/* the leaf's position on its node: a short petiole pushes the blade out along its midrib */
const l80At=(og,L,k,fan=0,Fr=[0,0,1])=>{const F=g35Fr(og);if(fan){const H=V3.nz(V3s(F.H,V3.sc(Fr,fan*V3.dot(F.H,Fr)))),N0=V3s(F.N,V3.sc(H,V3.dot(F.N,H)));if(V3l(N0)>1e-3){F.H=H;F.N=V3.nz(N0)}}return{F,P0:V3.add(F.P0,V3.sc(F.H,L*k))}};
/* (fan: the decussate pairs pointing to the front of the spray or away from it turned a little toward the sides, as the florist spreads an opposite-leaved spray flat) */

/* ---------- red-tip photinia (Photinia × fraseri 'Red Robin', Rosaceae): a dense evergreen shrub; stiff shoots, red when young, then brown-grey; leaves alternate, oblong-elliptic,
   7–12 cm, leathery and glossy, finely serrulate, on short petioles; the young growth bright red at the top of every shoot, turning bronze then deep green as it hardens;
   in spring flat terminal corymbs 10–15 cm across of many small white five-petalled flowers. 'Louise' and 'Pink Marble' are variegated (white or cream margin, pink young growth) ---------- */
const CW_L80PHO=[{id:'red-robin',n:'Vert, pousses rouge vif (Red Robin)',c:'#2c4826',y:'#c41e2a',st:'#6e2a24'},{id:'little-red-robin',n:'Compact, pousses rouges (Little Red Robin)',c:'#33502a',y:'#b4232c',st:'#6e2a24',sm:.75},
  {id:'carre-rouge',n:'Rouge carmin brillant (Carré Rouge)',c:'#28421f',y:'#a8121e',st:'#5a1c1c',yr:1},{id:'louise',n:'Liseré blanc, pousses roses (Louise)',c:'#e6e2cc',g:'#36562c',y:'#d4687a',st:'#6e3a30',vk:.7},
  {id:'pink-marble',n:'Marbré crème et rose (Pink Marble)',c:'#e2d9bc',g:'#46663a',y:'#da5a7c',st:'#7a3a34',vk:.6},{id:'en-fleurs',n:'Red Robin en fleurs (corymbes blancs)',c:'#2d4a27',y:'#c41e2a',st:'#6e2a24',fl:'#f6f2e6',f:1}];
const L80_PHOW=prof([[0,.24],[.1,.62],[.28,.9],[.5,1],[.72,.9],[.88,.56],[1,0]]),
  L80_PHOV=[[[0,0],[0,.97]],...[.14,.26,.38,.5,.62,.74].flatMap(y=>[1,-1].map(s=>[[0,y],[s*.08,y+.06],[s*.15*L80_PHOW(y+.1),y+.12]]))];
/* a corymb at the tip of a shoot: a short peduncle, rays to a flat dome, each ray ending in a little cyme of flowers (buds green-white at first) */
function l80Cory(og,cw,op,kl){const H=V3.nz(V3.add(og.H,[0,.5,0])),[X,Y]=fgCross(H),c0=V3.add(og.pos,V3.sc(H,1.4*UPC*kl)),Rc=(2.4+2*op)*UPC*kl,n=DET>=1.5?17:11,out=[],rays=[],fl=[];
  out.push(l80Stalk(og.pos,c0,1.6,cw.st,-.1));
  for(let i=0;i<n;i++){const a=(i/n*360+R(-14,14))*D,rr=Rc*Math.sqrt(R(.25,1)),e=V3.add(V3.add(c0,V3.sc(H,Rc*.75*(1-rr*rr/(Rc*Rc))+R(.2,.6)*UPC*kl)),V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)));rays.push([c0,e]);
    const nf=R(3,5.99)|0;for(let j=0;j<nf;j++){const b=(j/nf*360+R(0,60))*D,rj=j?.85:0,p=V3.add(e,V3.add(V3.sc(X,Math.cos(b)*rj*UPC*kl),V3.add(V3.sc(Y,Math.sin(b)*rj*UPC*kl),V3.sc(H,(j?.25:.45)*UPC*kl))));rays.push([e,p]);
      fl.push({p,ag:Math.max(0,Math.min(1,op*1.35-R(0,.45)))})}}
  let rz=0;const rd=rays.map(([a,b])=>{rz+=(a[2]+b[2])/2;return'M'+f(a[0])+','+f(-a[1])+'L'+f(b[0])+','+f(-b[1])}).join('');rz/=rays.length;
  out.push({z:rz-.3,cast:false,fn:g=>E('path',{d:rd,stroke:mix(cw.st,'#7a7a3a',.35),'stroke-width':1.15,fill:'none','stroke-linecap':'round'},g)});
  const P=pal7(cw.fl),PB=pal7(mix(cw.fl,'#b8c890',.5)),az=Math.abs(H[2]);
  for(const q of fl){const r=(q.ag<.35?.24+.2*q.ag:.4+.12*q.ag)*UPC*kl*R(.9,1.1),c=[q.p[0],-q.p[1]],pts=[];
    if(q.ag<.35){for(let j=0;j<8;j++){const a=j/8*6.283;pts.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r])}out.push({z:q.p[2],cast:false,fn:g=>E('circle',{cx:f(c[0]),cy:f(c[1]),r:f(Math.max(.9,r)),fill:toneAt(PB,.64),stroke:PB.ink,'stroke-width':.3,'stroke-opacity':.5},g)});continue}
    const ph=R(0,1.26),ey=.55+.45*Math.max(az,.3);for(let j=0;j<10;j++){const a=ph+j/10*6.283,rr=j%2?r*.62:r;pts.push([c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr*ey])}
    out.push({z:q.p[2],cast:false,fn:g=>{E('path',{d:smooth(pts),fill:toneAt(P,.7+R(-.06,.06)),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.45},g);if(!LOD)E('circle',{cx:f(c[0]),cy:f(c[1]),r:f(r*.28),fill:'#b8a45a'},g)}})}
  return out}
function l80Pho(g,t,o){const cw=fgCw(CW_L80PHO,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=9,ks=o.spine?1:(o.cm||cm0)/cm0,kl=(o.spine?1:.55+.45*ks)*(cw.sm||1),k=G(g);
  return g35Run(o,'l80pho',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),cols=l80Cols(cw.st),lim=g35Lim(o),
      sh=[0,1].map(()=>l80Prof(L80_PHOW,.36,{n:DET>=1.5?16:11,d:.05,y0:.14})),vg=cw.vk?1:0;
    const r=fgGrow(k,A,{li:2.1*UPC*kl,liT:.45,w0:3.6*kl,w1:1.1,cols,uL:o.spine?.24:.2,phy:'spiral',la:46,face:.68,lift:.32,seg:9,wig:.03,
      side:{u0:.2,u1:.78,p:.42,len:.4,ang:40,li:.75,e:-.004,tilt:22},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.78))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.1),
          /* the young growth: red at the top of every shoot, bronzing down to the hardened green */
          yg=Math.min(1,Math.max(0,(u-.6)/.32))*(cw.yr?1:.85+.15*(1-op)),c0=cw.c,c=yg>0?mix(mix(c0,'#8a5a2a',Math.min(1,yg*2.2)*.45),cw.y,Math.pow(yg,.7)):c0,
          cb=mix(c,'#c0c8a8',.34),vr=vg?{c:yg>0?mix(cw.g,cw.y,yg*.8):cw.g,k:l80Mg(cw.vk)}:null,{F,P0}=l80At(og,L,.07);
        return[l80Leaf({P0,H:F.H,N:F.N},L,sh[rnd()<.5?0:1],mix(c,shd(c,R(-.06,.06)),.5),cb,{lim,fold:.1,arch:.06,droop:.07,cup:.05,tw:R(-.25,.25),bend:R(-.04,.04),vr,gloss:yg>.3?.6:.5,dI:.02,
          veins:L80_PHOV,vc:yg>.3?shd(c,.3):'#7a9a5a',vw:.4,vo:.45}),l80Stalk(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.3*kl,yg>.4?cw.y:cw.st)]},
      tip:(og,p)=>cw.fl&&(lim==null||og.pos[1]>lim+8)&&(p.o?rnd()<.6:1)?l80Cory(og,cw,op,kl):null});
    open(k,t,1000,0,.4);return r})}

/* ---------- oleaster (Elaeagnus × submacrophylla, syn. E. × ebbingei, « chalef », Elaeagnaceae): vigorous, its young shoots brown and covered in rusty scales; leaves alternate,
   ovate-elliptic, 5–10 cm, leathery, the margin entire and a little wavy, dark glossy green above (silvery-scurfy when young), silver beneath and dotted with rust-brown scales;
   in autumn small hanging silvery-cream tubular flowers in the axils, very fragrant. 'Limelight' has a gold-and-lime centre, 'Gilt Edge' a broad gold margin ---------- */
const CW_L80ELA=[{id:'vert',n:'Vert sombre, revers argenté (E. × ebbingei)',c:'#34492c',b:'#d4d2c2'},{id:'limelight',n:'Cœur doré et lime (Limelight)',c:'#354b2d',b:'#d4d2c2',vc:'#cdb846',spl:.66},
  {id:'gilt-edge',n:'Liseré or (Gilt Edge)',c:'#d6b23a',g:'#34492c',b:'#d8d4c0',vk:.66},{id:'compacta',n:'Vert argenté, petites feuilles (Compacta)',c:'#4c6240',b:'#dcdacc',sm:.78},
  {id:'fleuri',n:"Vert, fleurs argentées d'automne",c:'#33482b',b:'#d4d2c2',fl:'#ece6d4',f:1}];
const L80_ELAW=prof([[0,.36],[.1,.72],[.3,.96],[.46,1],[.68,.88],[.86,.56],[1,0]]),
  L80_ELAV=[[[0,0],[0,.97]],...[.16,.32,.48,.64,.78].flatMap(y=>[1,-1].map(s=>[[0,y],[s*.1,y+.08],[s*.2*L80_ELAW(y+.1),y+.15]]))];
/* a cluster of autumn flowers in an axil: two to four hanging four-lobed tubes, silvery, on short stalks */
function l80ElaFl(og,cw,op,kl){const H=V3.nz(og.H),out=[],n=R(2,4.99)|0,P=pal7(cw.fl);
  for(let i=0;i<n;i++){const d=V3.nz(V3.add(V3.add(V3.sc(H,.4),[R(-.5,.5),-1,R(-.4,.4)]),[0,0,0])),c=V3.add(og.pos,V3.sc(V3.nz(V3.add(H,d)),.45*UPC*kl)),Lb=(.7+.4*op)*UPC*kl*R(.9,1.1),e=V3.add(c,V3.sc(d,Lb));
    out.push(l80Stalk(og.pos,c,1.2,'#9a6a40',-.1));const p0=[c[0],-c[1]],p1=[e[0],-e[1]],dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w0=.18*UPC*kl,w1=(.22+.22*op)*UPC*kl;
    const pts=[[p0[0]+nx*w0,p0[1]+ny*w0],[p0[0]+dx*.6+nx*w0*1.2,p0[1]+dy*.6+ny*w0*1.2],[p1[0]+nx*w1,p1[1]+ny*w1],[p1[0]+dx/l*w1*.5+nx*w1*.3,p1[1]+dy/l*w1*.5+ny*w1*.3],[p1[0]+dx/l*w1*.15,p1[1]+dy/l*w1*.15],
      [p1[0]+dx/l*w1*.5-nx*w1*.3,p1[1]+dy/l*w1*.5-ny*w1*.3],[p1[0]-nx*w1,p1[1]-ny*w1],[p0[0]+dx*.6-nx*w0*1.2,p0[1]+dy*.6-ny*w0*1.2],[p0[0]-nx*w0,p0[1]-ny*w0]];
    out.push({z:(c[2]+e[2])/2,cast:false,fn:g=>E('path',{d:smooth(pts),fill:toneAt(P,.64),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.5},g)})}
  return out}
function l80Ela(g,t,o){const cw=fgCw(CW_L80ELA,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=(o.spine?1:.55+.45*ks)*(cw.sm||1),k=G(g);
  return g35Run(o,'l80ela',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.12,.24)),cols=l80Cols('#86593a'),lim=g35Lim(o),sh=l80Prof(L80_ELAW,.48);
    const r=fgGrow(k,A,{li:2*UPC*kl,liT:.4,w0:3.4*kl,w1:1.05,cols,uL:o.spine?.22:.18,phy:'spiral',la:56,face:.42,lift:.3,seg:9,wig:.04,
      side:{u0:.18,u1:.8,p:.5,len:.42,ang:46,li:.75,e:-.008,tilt:26},axil:cw.fl?{u0:.3,p:.5,ang:35}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.48:fgSz(p,.8))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.1),
          /* the young leaves still silvery above with their scales */
          yg=Math.min(1,Math.max(0,(u-.72)/.25))*(.7+.3*(1-op)),c=mix(cw.c,'#a4a890',yg*(cw.vk?.25:.55)),
          vr=cw.vk?{c:mix(cw.g,'#a4a890',yg*.5),k:l80Mg(cw.vk)}:cw.spl?{c:mix(cw.vc,'#d8dcae',yg*.4),k:l80Splash(cw.spl)}:null,{F,P0}=l80At(og,L,.06);
        return[l80Leaf({P0,H:F.H,N:F.N},L,sh,mix(c,shd(c,R(-.06,.06)),.5),cw.b,{lim,fold:.12,arch:.05,droop:.15,cup:.05,wave:.035,wk:3+R(0,2),wph:R(0,6),tw:R(-.55,.55),bend:R(-.05,.05),sm:1,vr,
          gloss:.4,dI:.02,veins:L80_ELAV,vw:.35,vo:.36,dt:{c:'#9a5a32',n:22,r:.011},spSm:0,sp:yg>.2?{c:'#c8c8b4',n:8,r:.009}:null}),l80Stalk(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.25*kl,'#8a6040')]},
      axDraw:(og)=>lim==null||og.pos[1]>lim+6?l80ElaFl(og,cw,op,kl):null,
      /* the brown twigs flecked with their scales (on the sheets) */
      post:(res,parts)=>{if(LOD||DET<1.5||o.spine)return;let d='',z=0,n=0;for(const ch of res.chains)for(let i=1;i<ch.pts.length;i+=2){if(ch.ws[i]<1.6)continue;const q=ch.pts[i],r2=ch.ws[i]*.16;
          d+=`M${f(q[0]-r2)},${f(-q[1])}a${f(r2)},${f(r2*.7)} 0 1,0 ${f(2*r2)},0a${f(r2)},${f(r2*.7)} 0 1,0 ${f(-2*r2)},0`;z+=q[2];n++}
        if(n)parts.push({z:z/n+.02,cast:false,fn:g=>E('path',{d,fill:'#c4a07a',opacity:.75},g)})}});
    open(k,t,1000,0,.4);return r})}

/* ---------- Japanese spindle (Euonymus japonicus, « fusain du Japon », Celastraceae): a dense upright evergreen; green, somewhat four-angled shoots; leaves opposite, decussate,
   obovate to elliptic, 3–7 cm, thick and leathery, very glossy, the margin finely crenate-toothed, on short petioles; grown above all in its variegated forms:
   gold-edged ('Aureomarginatus', 'Ovatus Aureus'), cream-edged ('Président Gauthier', 'Bravo'), gold-centred ('Aureopictus'), small-leaved ('Microphyllus Albovariegatus') ---------- */
const CW_L80EUO=[{id:'vert',n:'Vert brillant (type)',c:'#2a5026'},{id:'aureomarginatus',n:'Liseré or (Aureomarginatus)',c:'#d4b632',g:'#2c5226',vk:.64},
  {id:'president-gauthier',n:'Liseré blanc crème (Président Gauthier)',c:'#ebe5c6',g:'#3a5e32',vk:.6},{id:'aureopictus',n:'Cœur doré (Aureopictus)',c:'#2c5226',vc:'#d6be3a',spl:.62},
  {id:'bravo',n:'Panaché crème irrégulier (Bravo)',c:'#ded6a6',g:'#3a6030',vk:.52,irr:1},{id:'microphyllus',n:'Petites feuilles liserées de blanc (Microphyllus Albovariegatus)',c:'#e8e6d0',g:'#2e5430',vk:.58,sm:.5}];
const L80_EUOW=prof([[0,.3],[.12,.62],[.32,.88],[.55,1],[.75,.94],[.9,.62],[1,0]]),
  L80_EUOV=[[[0,0],[0,.97]],...[.18,.34,.5,.66].flatMap(y=>[1,-1].map(s=>[[0,y],[s*.12,y+.08],[s*.22*L80_EUOW(y+.12),y+.16]]))];
function l80Euo(g,t,o){const cw=fgCw(CW_L80EUO,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=5,ks=o.spine?1:(o.cm||cm0)/cm0,kl0=o.spine?1:.55+.45*ks,kl=kl0*(cw.sm||1),k=G(g);
  return g35Run(o,'l80euo',()=>{const Lt=o.spine?blen(o.spine):40*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14)),cols=l80Cols('#4c7834'),lim=g35Lim(o),
      sh=[0,1].map(()=>l80Prof(L80_EUOW,.56,{n:DET>=1.5?11:8,d:.06,y0:.22}));
    const r=fgGrow(k,A,{li:(cw.sm?1.5:2.3)*UPC*kl0,liT:.5,w0:3.4*kl0,w1:1.1,cols,uL:o.spine?.22:.2,phy:'opp',la:52,face:.55,lift:.34,seg:9,wig:.025,
      side:{u0:.24,u1:.72,p:.3,len:.38,ang:40,li:.8,e:-.004,tilt:18,pair:1},
      leaf:(og,p,Fr)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.8))*(p.o?.88:1)*kl,L=cm0*UPC*sz*R(.88,1.08),yg=Math.min(1,Math.max(0,(u-.78)/.2))*(.6+.4*(1-op)),
          c=mix(cw.c,cw.vk?mix(cw.c,'#f0ecb0',.4):'#7aa83a',yg*.6),vk=cw.irr?l80Splash(cw.vk):cw.vk?l80Mg(cw.vk):null,
          vr=vk?{c:mix(cw.g,'#6a9a3a',yg*.6),k:vk}:cw.spl?{c:cw.vc,k:l80Splash(cw.spl)}:null,{F,P0}=l80At(og,L,.05,.5,Fr);
        return[l80Leaf({P0,H:F.H,N:F.N},L,sh[rnd()<.5?0:1],mix(c,shd(c,R(-.05,.05)),.5),mix(cw.vk?cw.c:c,'#b8c49a',.35),{lim,fold:.08,arch:.05,droop:.05,cup:.1,tw:R(-.2,.2),vr,gloss:.5,dI:.03,
          veins:L80_EUOV,vc:'#6a8a4a',vw:.35,vo:.35}),l80Stalk(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.3*kl0,cols[2])]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- griselinia (Griselinia littoralis, « broadleaf », Griseliniaceae, New Zealand): a coastal evergreen; stout yellow-green shoots; leaves alternate, broadly ovate,
   4–10 cm, thick and leathery, the base often oblique, the margin entire, bright glossy apple green, paler beneath, on stout pale petioles;
   'Variegata' has a creamy-white margin, 'Dixon's Cream' a cream centre splashed through the green ---------- */
const CW_L80GRI=[{id:'vert-pomme',n:'Vert pomme brillant (type)',c:'#6ea636'},{id:'variegata',n:'Liseré crème (Variegata)',c:'#e8e2b4',g:'#6a9a38',vk:.66},
  {id:'dixons-cream',n:"Cœur crème éclaboussé (Dixon's Cream)",c:'#6c9c38',vc:'#e8e2b0',spl:.42},{id:'green-jewel',n:'Vert franc bordé lime (Green Jewel)',c:'#c4cc58',g:'#4e8a30',vk:.7,irr:1}];
const L80_GRIW=prof([[0,.4],[.1,.76],[.28,.97],[.44,1],[.66,.9],[.86,.58],[1,0]]),
  L80_GRIV=[[[0,0],[0,.97]],...[.14,.3,.46,.62,.76].flatMap(y=>[1,-1].map(s=>[[0,y],[s*.12,y+.08],[s*.22*L80_GRIW(y+.1),y+.16]]))];
function l80Gri(g,t,o){const cw=fgCw(CW_L80GRI,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l80gri',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),cols=l80Cols('#a2b046'),lim=g35Lim(o),
      sh=[0,1].map(()=>l80Prof(L80_GRIW,.6,{ob:R(.18,.3)}));
    const r=fgGrow(k,A,{li:2.2*UPC*kl,liT:.42,w0:3.8*kl,w1:1.15,cols,uL:o.spine?.22:.18,phy:'spiral',la:50,face:.7,lift:.3,seg:9,wig:.03,
      side:{u0:.2,u1:.78,p:.42,len:.4,ang:42,li:.8,e:-.005,tilt:22},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.8))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.1),yg=Math.min(1,Math.max(0,(u-.76)/.22))*(.6+.4*(1-op)),
          c=mix(cw.c,cw.vk?mix(cw.c,'#f0eec0',.3):'#a8cc58',yg*.55),vr=cw.vk?{c:mix(cw.g,'#9ac050',yg*.5),k:cw.irr?l80Splash(cw.vk):l80Mg(cw.vk)}:cw.spl?{c:cw.vc,k:l80Splash(cw.spl)}:null,
          {F,P0}=l80At(og,L,.1);
        return[l80Leaf({P0,H:F.H,N:F.N},L,sh[rnd()<.5?0:1],mix(c,shd(c,R(-.05,.05)),.5),mix(cw.vk?cw.g:c,'#d0dca8',.4),{lim,fold:.07,arch:.05,droop:.07,cup:.12,tw:R(-.25,.25),bend:R(-.04,.04),sm:1,vr,
          gloss:.5,dI:.03,veins:L80_GRIV,vc:'#a8c870',vw:.4,vo:.4}),l80Stalk(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.7*kl,'#b8c060')]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- spotted laurel (Aucuba japonica, « aucuba du Japon », Garryaceae): stout, smooth, bright green shoots; leaves opposite, large, 8–20 cm, elliptic to lanceolate,
   thick and very glossy, coarsely toothed in their upper half, dark green, in the trade most often flecked or splashed with gold ('Variegata', a female clone; 'Crotonifolia';
   'Picturata', a gold centre); dioecious: the female plants carry clusters of glossy scarlet ellipsoid drupes (1–1.5 cm) at the tips of the shoots in winter ('Rozannie', self-fertile) ---------- */
const CW_L80AUC=[{id:'vert',n:'Vert sombre luisant (type)',c:'#23441e'},{id:'variegata',n:'Moucheté d’or (Variegata)',c:'#2a4a22',sp:{c:'#d8c03e',n:30,r:.014}},
  {id:'crotonifolia',n:'Éclaboussé d’or (Crotonifolia)',c:'#2e4e26',sp:{c:'#dcc84e',n:44,r:.024}},{id:'picturata',n:'Cœur doré moucheté (Picturata)',c:'#28481f',vc:'#d6bc38',spl:.5,sp:{c:'#d8c03e',n:14,r:.01}},
  {id:'variegata-baies',n:'Moucheté d’or à baies rouges (Variegata)',c:'#2b4b23',sp:{c:'#d8c03e',n:30,r:.014},bc:'#c01c22',f:1},{id:'rozannie',n:'Vert à baies rouges (Rozannie)',c:'#24451f',bc:'#c41a22',f:1}];
const L80_AUCW=prof([[0,.22],[.12,.6],[.32,.92],[.5,1],[.7,.88],[.88,.5],[1,0]]),
  L80_AUCV=[[[0,0],[0,.97]],...[.12,.24,.36,.48,.6,.72].flatMap(y=>[1,-1].map(s=>[[0,y],[s*.08,y+.07],[s*.16*L80_AUCW(y+.1),y+.14]]))];
/* a cluster of drupes at a shoot's tip: short stalks from the node, each berry an ellipsoid along its stalk, green turning scarlet */
function l80AucBer(og,cw,op,kl,Fr){const H=V3.nz(V3.add(og.H,V3.sc(Fr,.6))),[X,Y]=fgCross(H),n=DET>=1.5?R(4,7.99)|0:R(3,5.99)|0,out=[],c0=V3.add(og.pos,V3.sc(H,.5*UPC*kl));out.push(l80Stalk(og.pos,c0,1.6,'#4c7834',-.1));
  for(let i=0;i<n;i++){const a=(i/n*360+R(-20,20))*D,d=V3.nz(V3.add(V3.add(V3.sc(H,.55),V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),.8)),[0,-.25,0])),Ls=R(.8,1.3)*UPC*kl,c=V3.add(c0,V3.sc(d,Ls)),
      m=Math.max(0,Math.min(1,op*1.3-R(0,.3))),hl=(.66+.12*m)*UPC*kl*R(.92,1.08),rr=hl*.68,O=V3.add(c,V3.sc(d,hl*.85)),col=m<.5?mix('#6a8a3a','#9a6a2a',m/.5):mix('#9a6a2a',cw.bc,(m-.5)/.5);
    out.push(l80Stalk(c0,c,1.25,'#4c7834',-.08));out.push({z:O[2],cast:false,fn:g=>bzFruit(g,O,d,hl,rr,col,{gl:.9})})}
  return out}
function l80Auc(g,t,o){const cw=fgCw(CW_L80AUC,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=13,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l80auc',()=>{const Lt=o.spine?blen(o.spine):45*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14)),cols=l80Cols('#4c7c34'),lim=g35Lim(o),
      sh=[0,1].map(()=>l80Prof(L80_AUCW,.42,{n:DET>=1.5?7:6,d:.09,y0:.4}));
    const r=fgGrow(k,A,{li:4.4*UPC*kl,liT:.5,w0:5.4*kl,w1:1.6,cols,uL:o.spine?.3:.22,phy:'opp',la:48,face:.7,lift:.34,seg:10,wig:.02,
      side:{u0:.3,u1:.6,p:.22,len:.4,ang:38,li:.8,e:-.004,tilt:14,pair:1},
      leaf:(og,p,Fr)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.48:fgSz(p,.76))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.08),yg=Math.min(1,Math.max(0,(u-.8)/.18))*(.6+.4*(1-op)),
          c=mix(cw.c,'#5a8a34',yg*.5),vr=cw.spl?{c:cw.vc,k:l80Splash(cw.spl)}:null,{F,P0}=l80At(og,L,.07,.6,Fr);
        return[l80Leaf({P0,H:F.H,N:F.N},L,sh[rnd()<.5?0:1],mix(c,shd(c,R(-.05,.05)),.5),mix(c,'#a8b890',.4),{lim,fold:.1,arch:.05,droop:.1,cup:.06,tw:R(-.2,.2),bend:R(-.04,.04),vr,gloss:.5,dI:.03,
          veins:L80_AUCV,vc:'#5a7a44',vw:.4,vo:.4,sp:cw.sp?Object.assign({},cw.sp,{n:cw.sp.n*(u>.85?.5:1)}):null,spSm:1}),l80Stalk(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.9*kl,cols[2])]},
      tip:(og,p,Fr)=>cw.bc&&(lim==null||og.pos[1]>lim+8)&&(p.o?rnd()<.7:1)?l80AucBer(og,cw,op,kl,Fr):null});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf length), and how the composer treats them: stems of foliage along their spine, at their natural length ---------- */
Object.assign(GH,{'photinia-red-robin':l80Pho,'elaeagnus-chalef':l80Ela,'euonymus-japonicus-fusain':l80Euo,'griselinia-littoralis':l80Gri,'aucuba-japonica':l80Auc});
Object.assign(CWS,{'photinia-red-robin':CW_L80PHO,'elaeagnus-chalef':CW_L80ELA,'euonymus-japonicus-fusain':CW_L80EUO,'griselinia-littoralis':CW_L80GRI,'aucuba-japonica':CW_L80AUC});
Object.assign(SZG,{'photinia-red-robin':[7,9,9,11],'elaeagnus-chalef':[5,7,7,9],'euonymus-japonicus-fusain':[4,5,5,6],'griselinia-littoralis':[5,7,7,9],'aucuba-japonica':[10,13,13,16]});
const L80_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'photinia-red-robin':L80_I(50,{fx:22}),'elaeagnus-chalef':L80_I(50,{fx:20}),'euonymus-japonicus-fusain':L80_I(40,{fx:16}),'griselinia-littoralis':L80_I(50,{fx:20}),
  'aucuba-japonica':L80_I(45,{fx:32})});
