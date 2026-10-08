/* ================= Serre, lot 72 — ruscus et petits persistants : ruscus israélien, fragon (petit houx), galax, myrte, buis ================= */
/* ---------- the lot's leaf: the lot 35 surface (g35Surf: arched, folded on its midrib, cupped, drooping, twisted) under a given outline; on the sheets (DET 2) the full g35Leaf
   (two halves each lit by its own normal, veins, gloss), in a bouquet one silhouette — its two edges, never flat edge-on since the fold lifts the margins — filled with the tone
   of its mean face, so a stem of a few hundred small leaves stays light; a leaf that would hang below the mouth is shortened, or left out ---------- */
function l72Leaf(P0,H,N,len,sh,c,cb,o={}){let M=g35Surf(P0,H,N,len,o),pts=null;const ring=Mm=>sh.R.map(([x,y])=>Mm(x,y)).concat(sh.L.slice().reverse().map(([x,y])=>Mm(x,y)));
  if(o.lim!=null){let k=1;const low=P=>P.some(p=>p[1]<o.lim);pts=ring(M);while(low(pts)&&k>.62){k*=.8;M=g35Surf(P0,H,N,len*k,o);pts=ring(M)}if(low(pts))return null;len*=k}
  /* on the sheets, and for a big single leaf (o.full) in a bouquet too: the two halves, veins and gloss; a blade edged with another colour (o.inner {c, k, ctr}) paints its centre over it,
     each half scaled toward the centre of the blade (a rim of even width all round), the veins on top */
  if(!LOD&&(DET>=1.5||o.full)){const base=g35Leaf(P0,H,N,len,sh,c,cb,Object.assign({},o,{lim:null},o.inner?{veins:null,gloss:0}:null));if(!o.inner)return base;
    const{k:ki,ctr}=o.inner,Pi=pal7(o.inner.c),PBi=pal7(mix(o.inner.c,cb,.5)),sc=([x,y])=>M(ctr[0]+(x-ctr[0])*ki,ctr[1]+(y-ctr[1])*ki),
      hs=['L','R'].map(sd=>{const ol=sh[sd],sg=sd==='R'?1:-1,n=g35Nrm(M,sg*.2,ctr[1]),fr=n[2]>=0,pts=sh.mid.map(sc).concat(ol.slice().reverse().map(sc));
        return{q:pts.map(g35Q),z:pts.reduce((a,p)=>a+p[2],0)/pts.length,col:toneAt(fr?Pi:PBi,lightI(fr?n:V3.sc(n,-1))+(o.dI||0))}}).sort((a,b)=>a.z-b.z),det=DET>=1.5;
    return[base,{z:base.z+.01,cast:false,fn:par=>{for(const h of hs)E('path',{d:smooth(h.q),fill:h.col},par);
      if((det||o.vAll)&&o.veins){let d='';for(const L of o.veins)d+='M'+L.map(([x,y])=>{const q=g35Q(M(x,y));return f(q[0])+','+f(q[1])}).join('L');E('path',{d,stroke:o.vc||Pi.d1,'stroke-width':o.vw||.4,'stroke-opacity':o.vo??.42,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}}}]}
  /* o.qc: in a batched stem the leaf takes its colour unjittered and its light in a few steps, so its run shares a few paths */
  if(!pts)pts=ring(M);const P=l72Pal(o.qc||c),PB=l72Pal(cb),nR=g35Nrm(M,.12,.45),nL=g35Nrm(M,-.12,.45),
    n=V3.nz(V3.add(nR,nL)),fr=n[2]>=0,I0=lightI(fr?n:V3.sc(n,-1))+(o.dI||0),I=o.qc?Math.round(I0*7)/7:I0,col=toneAt(fr?P:PB,I),z=pts.reduce((a,p)=>a+p[2],0)/pts.length,
    q=pts.map(g35Q).filter((a,i,A)=>{const b=A[(i+1)%A.length];return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])>1e-3});
  /* a variegated leaf: its pale margin, then its green centre */
  const vq=o.vr&&fr&&!LOD?sh.R.map(([x,y])=>M(x*o.vr.k(y),y)).concat(sh.L.slice().reverse().map(([x,y])=>M(x*o.vr.k(y),y))).map(g35Q):null;
  const d=o.sharp||o.qc?g35D(q):smooth(q),ink=(fr?P:PB).ink,vc=vq?toneAt(l72Pal(o.vr.c),I):null,vd=vq?(o.qc?g35D(vq):smooth(vq)):null;
  return{z:z+(o.zb||0),cast:false,l72:{d,col,ink,vd,vc},fn:par=>{E('path',LOD?{d,fill:col}:{d,fill:col,stroke:ink,'stroke-width':.42,'stroke-opacity':.34,'stroke-linejoin':'round'},par);
    if(vd)E('path',{d:vd,fill:vc},par)}}}
/* a stem of many small leaves in a bouquet: its leaves taken far to near in runs of gs, each run drawn as one path per tone (the tones rounded a little), the variegated centres after them;
   the leaves of a run lie at almost the same depth, so the order of the painter holds while a box spray of several hundred leaves stays a few hundred elements */
const l72Q=c=>{const h=hx(c);return'#'+h.map(v=>Math.min(255,Math.round(v/22)*22).toString(16).padStart(2,'0')).join('')};
function l72Batch(parts,gs){if(DET>=1.5)return;const L=parts.filter(p=>p.l72&&!p.keep);if(L.length<gs*2)return;const rest=parts.filter(p=>!p.l72||p.keep);L.sort((a,b)=>a.z-b.z);parts.length=0;parts.push(...rest);
  for(let i=0;i<L.length;i+=gs){const grp=L.slice(i,i+gs),bk=new Map(),bv=new Map();let z=0;
    for(const p of grp){const l=p.l72,k=l72Q(l.col);z+=p.z;const b=bk.get(k)||{c:k,ink:l.ink,d:'',z:0,n:0};b.d+=l.d;b.z+=p.z;b.n++;bk.set(k,b);
      if(l.vd){const k2=l72Q(l.vc),v=bv.get(k2)||{c:k2,d:'',z:0,n:0};v.d+=l.vd;v.z+=p.z;v.n++;bv.set(k2,v)}}
    const srt=m=>[...m.values()].sort((a,b)=>a.z/a.n-b.z/b.n),bs=srt(bk),vs=srt(bv);
    parts.push({z:z/grp.length,cast:false,fn:par=>{for(const b of bs)E('path',LOD?{d:b.d,fill:b.c}:{d:b.d,fill:b.c,stroke:b.ink,'stroke-width':.42,'stroke-opacity':.34,'stroke-linejoin':'round'},par);
      for(const v of vs)E('path',{d:v.d,fill:v.c},par)}})}}
/* palettes asked again and again by a stem of small leaves, kept */
const L72_PAL=new Map(),l72Pal=c=>{let p=L72_PAL.get(c);if(!p){p=pal7(c);L72_PAL.set(c,p)}return p};
/* an outline from explicit right-half points (base → tip, x across, y along, in leaf lengths); the left half mirrored */
const l72Sh=(R0,mid)=>({R:R0,L:R0.map(([x,y])=>[-x,y]),mid});
/* the seed of a sheet drawing (the same stem from every side), the leaf frame and limit: the lot 35 helpers */
const l72Run=(o,id,fn)=>g35Run(o,id,fn);
/* a fine stalk (pedicel, petiole) between screen points: never under 1.1, so it reads joined at the app's detail */
const l72Stalk=(par,P,w,c)=>E('path',{d:'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c,'stroke-width':f(Math.max(1.15,w)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);

/* ---------- Israeli ruscus (Ruscus hypophyllum, Asparagaceae, « ruscus israélien »): smooth green stems arching from the base, 50–80 cm, bare below; along their upper part
   alternate cladodes (flattened shoots doing the work of leaves) held in one plane, ovate-lanceolate and acuminate, 5–10 × 2–3.5 cm, flat, leathery, glossy deep green on both faces,
   with fine parallel veins converging to the tip and no midrib; a few short side shoots on the strongest stems; the young tip still folded. The tiny flowers and red berries
   it bears on the underside of its cladodes are not seen on cut stems ---------- */
const CW_L72RHY=[{id:'vert-profond',n:'Vert profond lustré',c:'#2b5226',b:'#4a6e3a'},{id:'vert-franc',n:'Vert franc (jeunes tiges)',c:'#3c6a30',b:'#5a8448'},
  {id:'vert-noir',n:'Vert bouteille',c:'#22401f',b:'#3f5a34'}];
const L72_RHYW=prof([[0,.12],[.08,.55],[.22,.92],[.36,1],[.56,.88],[.78,.52],[.92,.18],[1,0]]),
  L72_RHYV=[.3,.6].flatMap(a=>[1,-1].map(s=>[[0,.01],[s*a*.16,.2],[s*a*.2,.5],[s*a*.12,.8],[0,.99]]));
function l72Rhy(g,t,o){const cw=fgCw(CW_L72RHY,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return l72Run(o,'l72rhy',()=>{const Lt=o.spine?blen(o.spine):65*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.45,.6)),sh=g35Prof(L72_RHYW,.42,14),lim=g35Lim(o),
      sc=mix(cw.c,'#7a9a4a',.4),cols=[shd(sc,-.6),shd(sc,-.28),sc,shd(sc,.42)];
    const r=fgGrow(k,A,{li:2.5*UPC*kl,liT:.45,w0:3.2*kl,w1:1.1,cols,uL:o.spine?.3:.26,phy:'alt2',la:50,face:.8,lift:.25,seg:11,wig:.02,rj:22,
      side:{u0:.3,u1:.62,p:.22,len:.32,ang:36,li:.8,e:-.008,tilt:20},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.84?(1-op)*(u-.84)/.16:0,sz=(p.tip?.5:fgSz(p,.78))*(p.o?.78:1)*kl*(1-.45*young),L=cm0*UPC*sz*R(.88,1.1),
          c=mix(cw.c,shd(cw.c,R(-.1,.12)),.6),F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,og.w*.3));
        return l72Leaf(P0,F.H,F.N,L,sh,c,mix(cw.b,c,.4),{lim,arch:.05,fold:.04+.45*young,cup:-.02,droop:.07+.04*u,tw:R(-.4,.4),bend:R(-.05,.05),sm:1,gloss:.5,dI:.03,veins:L72_RHYV,vc:shd(c,.2),vw:.35,vo:.32})}});
    open(k,t,1000,0,.4);return r})}

/* ---------- butcher's broom (Ruscus aculeatus, « fragon », « petit houx »): stiff upright stems, finely grooved, branched in their upper half; the cladodes small (1.5–3 cm),
   ovate, rigid, twisted at their base so they stand every way, each ending in a sharp spine; on the female plants, in winter, a round scarlet berry (about 1 cm) sitting
   in the middle of the upper face of a cladode, where the flower was. Stages: the berries green, then orange, then scarlet ---------- */
const CW_L72RAC=[{id:'baies',n:'Vert à baies rouges',c:'#3c5a2a',b:'#5e7a44',fr:1},{id:'vert',n:'Vert (sans baies)',c:'#425e2c',b:'#627e48'}];
/* the cladode with its spine drawn out of its outline (one shape, so the spine never floats) */
const L72_RACSH=l72Sh([[0,0],[.1,.05],[.21,.15],[.27,.3],[.27,.45],[.23,.6],[.15,.74],[.07,.86],[.025,.94],[0,1]],[[0,0],[0,.5],[0,.94]]),
  L72_RACV=[1,-1].map(s=>[[0,.02],[s*.12,.25],[s*.14,.5],[s*.07,.78],[0,.92]]);
function l72Rac(g,t,o){const cw=fgCw(CW_L72RAC,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=2.5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g),fr=!!cw.fr;
  return l72Run(o,'l72rac',()=>{const Lt=o.spine?blen(o.spine):55*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14)),lim=g35Lim(o),sc=mix(cw.c,'#6a8040',.35),
      cols=[shd(sc,-.6),shd(sc,-.3),sc,shd(sc,.4)],ripe=Math.max(0,Math.min(1,op*1.15)),bc=ripe<.35?mix('#7a9a40','#c8a030',ripe/.35):ripe<.7?mix('#c8a030','#d0401e',(ripe-.35)/.35):mix('#d0401e','#c41620',(ripe-.7)/.3);
    let nb=0;const nbMax=o.spine?6:DET>=1.5?10:8;
    const r=fgGrow(k,A,{li:.95*UPC*kl,liT:.3,w0:3.6*kl,w1:1.1,cols,uL:o.spine?.28:.26,phy:'spiral',la:60,piece:DET>=1.5?9:20,face:.35,lift:.3,seg:8,wig:.012,rj:18,
      side:{u0:.3,u1:.88,p:.85,len:.55,ang:50,li:.8,e:.001,tilt:35},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.6:fgSz(p,.85))*(p.o?.85:1)*kl,L=cm0*UPC*sz*R(.82,1.15),c=mix(cw.c,shd(cw.c,R(-.12,.12)),.6),F=g35Fr(og),
          N=V3.nz(rotA(F.N,F.H,R(-.9,.9))),P0=V3.add(F.P0,V3.sc(F.H,og.w*.25)),opt={lim,qc:cw.c,arch:.03,fold:.06,cup:-.03,droop:.02,tw:R(-.3,.3),dI:.02,gloss:.5,sharp:1,veins:L72_RACV,vc:shd(c,.18),vw:.3,vo:.3},
          lf=l72Leaf(P0,F.H,N,L,L72_RACSH,c,mix(cw.b,c,.35),opt);
        if(!lf)return null;
        /* a berry on the upper face, mid-cladode: in front of its cladode when that face looks at us, hidden behind it otherwise */
        if(fr&&!p.tip&&u>.35&&nb<nbMax&&rnd()<.22){const M=g35Surf(P0,F.H,N,L,opt),n=g35Nrm(M,0,.45),rb=.5*UPC*Math.min(1.15,kl)*(.75+.25*ripe)*R(.9,1.08),O=V3.add(M(0,.45),V3.sc(n,rb*.72));
          if(lim==null||O[1]-rb>lim){nb++;lf.keep=1;return[lf,{z:lf.z+(n[2]>=0?.2:-.2),cast:false,fn:par=>bzFruit(par,O,V3.nz(V3.add(n,[0,.3,0])),rb,rb*.96,bc,{gl:.85,eye:DET>=1.5?(q,tp,a,r2)=>E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(Math.max(.55,r2*.12)),fill:'#3a1a10',opacity:.75},q):null})}]}}
        return lf},post:(res,parts)=>l72Batch(parts,18)});
    open(k,t,1000,0,.4);return r})}

/* ---------- galax (Galax urceolata, Diapensiaceae): an evergreen of the Appalachian woods, cut and sold leaf by leaf (in bunches of 25): a blade almost round (5–15 cm),
   deeply cordate at its base, its margin crenate-serrate with small rounded teeth, leathery, very glossy, palmately veined, on a long slender petiole (10–25 cm);
   green in summer, bronze to burgundy red in winter (the margin turning first). Stages: the young leaf still folded on its midrib, then flat ---------- */
const CW_L72GAL=[{id:'vert',n:'Vert lustré',c:'#2c5628',b:'#5a7a46',pc:'#5a6a34'},{id:'bronze',n:'Bronze rouge (hiver)',c:'#6a2a22',b:'#7a4a38',pc:'#6a3424'},
  {id:'vert-bronze',n:'Vert bordé de bronze',c:'#7a3426',b:'#6a5a3c',pc:'#5a4a2c',v:'#3a5a2a'},{id:'bordeaux',n:'Bordeaux (plein hiver)',c:'#4a1a22',b:'#6a3036',pc:'#5a2228'}];
/* the outline: a round blade on a centre a little above the petiole's top, the basal sinus at the petiole, rounded teeth all round (n per half) */
function l72GalSh(n,tooth){const R0=[[0,0]],c=.37,rx=.55,ry=.5,nT=9,a0=-76;for(let i=0;i<=n;i++){const t=i/n,ph=(a0+(90-a0)*t)*D,cr=1+tooth*(.5+.5*Math.cos(nT*2*Math.PI*t))*Math.min(1,(1-t)*6);
    R0.push([rx*Math.cos(ph)*cr,c+ry*Math.sin(ph)*cr])}R0[R0.length-1]=[0,c+ry*(1+tooth*.5)];return l72Sh(R0,[[0,0],[0,.45],[0,c+ry*.97]])}
const L72_GALV=[[22,.86],[52,.74],[88,.6],[124,.48]].flatMap(([a,l])=>[1,-1].map(s=>{const P=[];for(let i=0;i<=4;i++){const t=i/4,b=(a*(1-.25*t))*D,r=l*.52*t;P.push([s*Math.sin(b)*r*1.05,Math.cos(b)*r+.02*t])}return P}));
/* the leaf rises on its petiole (the axis, without nodes), the blade at its top turned toward the front, a little tilted back from the petiole's line */
function l72Gal(g,t,o){const cw=fgCw(CW_L72GAL,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,len=(o.cm||cm0)*UPC,k=G(g);
  return l72Run(o,'l72gal',()=>{const Lt=o.spine?blen(o.spine):19*UPC*(.6+.4*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16));
    /* in a bouquet the petiole stops short of the spine's end, so the blade, not its tip, sits at the edge of the mass */
    if(o.spine)A.L=Math.min(A.L,Math.max(A.L*.6,A.l0+10*UPC,A.L-len*.55));
    const pc=cw.pc,cols=[shd(pc,-.6),shd(pc,-.25),pc,shd(pc,.42)],sE=A.sOf(A.L);
    const r=fgGrow(k,A,{li:1.6*UPC,liT:0,w0:2.2*Math.min(1.15,ks),w1:1.5,cols,uL:2,seg:7,wig:.008,tipLv:0,
      tip:og=>{const of=fgFace(og,A.at(sE).Fr,.9),det=DET>=1.5&&!LOD,yg=Math.max(0,.6-op)/.6,sh=l72GalSh(det?64:30,det?.03:.022),L=len*(1-.25*yg),c=mix(cw.c,shd(cw.c,R(-.06,.08)),.6),
          inner=cw.v?{c:cw.v,k:.74,ctr:[0,.36]}:null,H=V3.nz(V3.add(of.H,V3.sc(of.U,-.3))),N=V3.nz(V3s(of.U,V3.sc(H,V3.dot(of.U,H))));
        const lf=l72Leaf(V3.add(of.pos,V3.sc(H,-L*.015)),H,N,L,sh,c,mix(cw.b,c,.3),{arch:.03,fold:.06+.4*yg,cup:.08,droop:.03,tw:R(-.12,.12),sm:1,dI:.04,inner,full:1,vAll:1,
          veins:[[[0,0],[0,.84]],...L72_GALV],vc:shd(cw.v||c,.3),vw:.55,vo:.45});return lf?[].concat(lf):null}});
    open(k,t,1000,0,.4);return r})}

/* ---------- myrtle (Myrtus communis, Myrtaceae, « myrte »): aromatic upright stems, much branched, the young shoots reddish; leaves opposite and decussate, almost sessile,
   ovate-lanceolate and pointed, 2–5 cm, leathery, glossy dark green dotted with oil glands ('Tarentina': small and narrow, 1.5 cm; 'Variegata': edged with cream);
   in summer solitary white flowers in the axils, on slender pedicels as long as the leaves — five round petals round a puff of countless long stamens tipped with yellow anthers;
   in autumn ellipsoid berries, blue-black under a bloom, crowned by the persistent calyx. Stages: buds (round, white flushed pink), flowers opening, open; berries green to blue-black ---------- */
const CW_L72MYR=[{id:'vert',n:'Vert lustré (type)',c:'#2e4a26',b:'#5a6e46'},{id:'tarentina',n:'Petites feuilles (Tarentina)',c:'#34522a',b:'#5e744a',sm:1},
  {id:'variegata',n:'Liseré crème (Variegata)',c:'#d8d4ae',b:'#b8b896',v:'#4a6a34'},{id:'fleuri',n:'Vert fleuri blanc',c:'#30502a',b:'#5a7046',fl:1,f:1},
  {id:'baies',n:'À baies bleu-noir',c:'#2c4626',b:'#566a44',fr:1,f:1}];
const L72_MYRW=prof([[0,.22],[.1,.62],[.3,.96],[.42,1],[.62,.82],[.82,.45],[.94,.14],[1,0]]),L72_MYRTW=prof([[0,.25],[.12,.7],[.35,1],[.6,.8],[.85,.35],[1,0]]);
/* a flower at the end of its pedicel: five petals cupped round the axis d, the puff of stamens (one starburst shape, anthers on its rays); a round bud when young */
function l72MyrFl(og,op,kl,lim,Fr){const H=V3.nz(og.H),pl=1.9*UPC*kl*R(.85,1.1),dir=V3.nz(V3.add(H,[0,.35,0])),c=V3.add(V3.add(og.pos,V3.sc(dir,pl)),[0,-pl*.12,0]);
  if(lim!=null&&c[1]<lim+5)return null;const ag=Math.max(0,Math.min(1,op*1.3+R(-.25,.15))),d=V3.nz(V3.add(V3.add(V3.sc(dir,.55),V3.sc(Fr||[0,0,1],.75)),[0,.25,0])),[X,Y]=fgCross(d),mid=V3.add(og.pos,V3.add(V3.sc(dir,pl*.55),[0,-pl*.1,0])),
    ped=[g35Q(og.pos),g35Q(mid),g35Q(c)],front=d[2]>=-.05,det=DET>=1.5&&!LOD,PW=pal7('#f6f2ea'),PP=pal7('#f0dede');
  if(ag<.4){const rb=(.28+.22*ag/.4)*UPC*kl,O=V3.add(c,V3.sc(d,rb*.8)),bc=mix('#e8c8c8','#f4eee6',ag/.4);
    return[{z:c[2],cast:false,fn:par=>{l72Stalk(par,ped,1.2,'#6a4a2e');const s=[c,V3.add(c,V3.add(V3.sc(X,rb*.7),V3.sc(d,rb*.5))),V3.add(c,V3.add(V3.sc(X,-rb*.7),V3.sc(d,rb*.5)))].map(g35Q);
      bzFruit(par,O,d,rb,rb,bc,{gl:.4});E('path',{d:'M'+s.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:'#5a6a34',stroke:'#3a4a24','stroke-width':.35,'stroke-opacity':.5},par)}}]}
  const rp=(.6+.4*Math.min(1,(ag-.4)/.45))*1.05*UPC*kl,cup=.5-.38*Math.min(1,(ag-.4)/.5),ph=R(0,6.283),pet=[];
  for(let j=0;j<5;j++){const a=ph+j*1.2566,rk=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),sd=V3.cr(d,rk),o2=[];for(let i=0;i<=10;i++){const th=i/10*6.283,u=.5+.5*Math.cos(th+Math.PI),w=.5*Math.sin(th);
      const pr=V3.add(V3.add(c,V3.sc(rk,rp*u)),V3.add(V3.sc(sd,rp*w*Math.min(1,u*2.2+.25)),V3.sc(d,rp*cup*u*u)));o2.push(pr)}
    const nn=V3.nz(V3.add(V3.sc(d,1-cup),V3.sc(rk,-cup))),z=o2.reduce((s,p)=>s+p[2],0)/o2.length;pet.push({P:o2.map(g35Q),col:toneAt(nn[2]>=0?PW:PP,lightI(nn[2]>=0?nn:V3.sc(nn,-1))*.6+.4),z})}
  pet.sort((a,b)=>a.z-b.z);
  /* the puff: n rays leaning out of the cup, their tips the anthers */
  const nr=det?30:14,ray=[],tips=[];for(let i=0;i<nr;i++){const a=ph+i*2.39996,s=.3+.7*((i*.618)%1),rk=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),e=V3.add(c,V3.add(V3.sc(rk,rp*s*.72),V3.sc(d,rp*(.3+.2*s))));
    ray.push({a,e});tips.push(g35Q(e))}
  ray.sort((p,q)=>p.a-q.a);const star=[];for(let i=0;i<ray.length;i++){star.push(g35Q(ray[i].e));const m=V3.add(c,V3.add(V3.sc(V3.add(V3.sc(X,Math.cos(ray[i].a+.09)),V3.sc(Y,Math.sin(ray[i].a+.09))),rp*.18),V3.sc(d,rp*.12)));star.push(g35Q(m))}
  const ar=Math.max(.56,rp*.05),q0=g35Q(c);
  const puff=par=>{E('path',{d:'M'+star.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:'#f6f0e2',stroke:'#d8ccb0','stroke-width':.3,'stroke-opacity':.6,'stroke-linejoin':'round'},par);
    if(det){let dd='';for(const q of tips)dd+=`M${f(q0[0])},${f(q0[1])}L${f(q[0])},${f(q[1])}`;E('path',{d:dd,stroke:'#e8dcc0','stroke-width':.35,fill:'none'},par)}
    let da='';for(const q of tips)da+=`M${f(q[0]-ar)},${f(q[1])}a${f(ar)},${f(ar)} 0 1,0 ${f(ar*2)},0a${f(ar)},${f(ar)} 0 1,0 ${f(-ar*2)},0`;E('path',{d:da,fill:'#ecd88a',stroke:'#b89a40','stroke-width':.2,'stroke-opacity':.5},par);
    E('circle',{cx:f(q0[0]),cy:f(q0[1]),r:f(Math.max(.6,rp*.09)),fill:'#c8b878'},par)};
  return[{z:c[2],cast:false,fn:par=>{l72Stalk(par,ped,1.2,'#6a4a2e');if(!front)puff(par);for(const p of pet)E('path',{d:smooth(p.P),fill:p.col,stroke:'#b8ac98','stroke-width':.35,'stroke-opacity':.55},par);if(front)puff(par)}}]}
/* a berry: an ellipsoid hanging from its pedicel, the calyx a dark little crown at its tip; green, then purple, then blue-black under a bloom */
function l72MyrBerry(og,op,kl,lim){const H=V3.nz(og.H),pl=1.6*UPC*kl*R(.85,1.1),dir=V3.nz(V3.add(H,[0,-.25,0])),c=V3.add(og.pos,V3.sc(dir,pl));if(lim!=null&&c[1]<lim+8)return null;
  const m=Math.max(0,Math.min(1,op*1.25+R(-.2,.1))),col=m<.4?mix('#8aa04a','#7a4a5a',m/.4):m<.75?mix('#7a4a5a','#3a2a44',(m-.4)/.35):mix('#3a2a44','#232236',(m-.75)/.25),
    rb=.45*UPC*kl*(.75+.25*m),ax=V3.nz(V3.add(dir,[0,-.4,0])),O=V3.add(c,V3.sc(ax,rb*1.15)),ped=[g35Q(og.pos),g35Q(V3.add(og.pos,V3.add(V3.sc(dir,pl*.5),[0,pl*.05,0]))),g35Q(c)];
  return[{z:O[2],cast:false,fn:par=>{l72Stalk(par,ped,1.2,'#5a4a30');
    bzFruit(par,O,ax,rb*1.25,rb,col,{gl:m>.75?.45:.75,eye:(q,tp,a,r2)=>{const s=Math.max(.7,r2*.32);let d='';for(let i=0;i<5;i++){const b=i*1.2566;d+=`M${f(tp[0])},${f(tp[1])}L${f(tp[0]+Math.cos(b)*s)},${f(tp[1]+Math.sin(b)*s)}`}
      E('path',{d,stroke:'#2a2218','stroke-width':.9,'stroke-linecap':'round'},q);E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(s*.55),fill:'#3a2c20'},q)}});
    if(m>.75&&!LOD)E('ellipse',{cx:f(O[0]),cy:f(-O[1]),rx:f(rb*.95),ry:f(rb*.95),fill:'#9aa4c4',opacity:.2},par)}}]}
function l72Myr(g,t,o){const cw=fgCw(CW_L72MYR,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=cw.sm?1.7:3,ks=o.spine?1:(o.cm||3)/3,kl=o.spine?1:.6+.4*ks,k=G(g);
  return l72Run(o,'l72myr',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),sh=g35Prof(cw.sm?L72_MYRTW:L72_MYRW,cw.sm?.3:.4,12),lim=g35Lim(o),
      st='#5a4a34',cols=[shd(st,-.55),shd(st,-.25),st,shd(st,.4)],vr=cw.v?{c:cw.v,k:y=>.7+.07*Math.sin(y*8+.7)}:null,org=cw.fl||cw.fr,
      oo={li:(cw.sm?.95:1.5)*UPC*kl,liT:.35,w0:2.8*kl,w1:1.1,cols,uL:o.spine?.26:.24,phy:'opp',piece:DET>=1.5?9:18,la:46,face:.6,lift:.3,seg:9,wig:.03,rj:12,
      side:{u0:.22,u1:.86,p:DET>=1.5?.5:.42,len:.36,ang:40,li:.8,e:-.004,tilt:25,pair:0},axil:org?{u0:.45,p:cw.fl?.32:.3,ang:42}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.82))*(p.o?.82:1)*kl,L=cm0*UPC*sz*R(.86,1.1),young=u>.82?Math.round((.25+.35*(1-op))*4)/4:0,
          c0=cw.v&&!young?cw.c:cw.v?mix(cw.c,'#8a9a5a',.5):cw.c,c=mix(young?mix(c0,'#6a7a3a',young):c0,shd(c0,R(-.08,.08)),.5),F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,og.w*.35));
        return l72Leaf(P0,F.H,F.N,L,sh,c,mix(cw.b,c,.3),{lim,qc:young?mix(c0,'#6a7a3a',young):c0,arch:.06,fold:.16,cup:.02,droop:.06,tw:R(-.3,.3),bend:R(-.06,.06),sm:1,gloss:cw.v?.4:.9,dI:.02,vr,veins:[[[0,0],[0,.96]]]})},
      axDraw:(og,p,Fr)=>cw.fl?l72MyrFl(og,op,kl,lim,Fr):cw.fr?l72MyrBerry(og,op,kl,lim):null,
      tip:(og,p,Fr)=>cw.fl&&p.o&&rnd()<.35?l72MyrFl(og,op,kl,lim,Fr):null,post:(res,parts)=>l72Batch(parts,cw.v?7:14)};
    const r=fgGrow(k,A,oo);open(k,t,1000,0,.4);return r})}

/* ---------- common box (Buxus sempervirens, Buxaceae, « buis »): dense, much-branched green twigs (quadrangular when young, then grey-brown); leaves opposite, very close,
   tiny (1.5–2.5 cm), ovate to elliptic, a little notched at the tip, on a very short petiole, thick and glossy, deep green above, paler and yellowish beneath, folded slightly
   on the midrib; the sprays are cut 30–50 cm. 'Elegantissima' is edged with cream; preserved box (« buis stabilisé ») matte. Stages: the young shoots paler, then hardened ---------- */
const CW_L72BUX=[{id:'vert',n:'Vert foncé lustré (type)',c:'#2c4a24',b:'#7a8a4a'},{id:'vert-tendre',n:'Vert tendre (pousses de printemps)',c:'#4f7a2e',b:'#8a9a54'},
  {id:'elegantissima',n:'Panaché crème (Elegantissima)',c:'#dcd6a8',b:'#c4c090',v:'#46683a'},{id:'stabilise',n:'Stabilisé vert mat',c:'#3e5a32',b:'#6a7a50',mt:1}];
/* the emarginate tip: the outline comes back a little into the midrib */
const L72_BUXSH=l72Sh([[0,0],[.08,.04],[.19,.14],[.26,.32],[.27,.5],[.24,.68],[.17,.84],[.08,.95],[.035,.98],[0,.955]],[[0,0],[0,.5],[0,.955]]);
/* a twig in an axil: a short green axis with two or three pairs of small leaves, the density of the box drawn cheaply */
function l72BuxTwig(og,kl,leaf,cols,lim){const H=V3.nz(V3.add(og.H,[0,.15,0])),n=2+(rnd()<.5?1:0),L=1.15*UPC*kl*n,pts=[og.pos],[X]=fgCross(H),out=[];let p=og.pos;
  for(let i=1;i<=n;i++){p=V3.add(p,V3.add(V3.sc(H,L/n),[0,-L/n*.05*i,0]));pts.push(p)}
  if(lim!=null&&p[1]<lim+4)return null;let z=0;for(const q of pts)z+=q[2];
  out.push({z:z/pts.length-.05,cast:false,fn:par=>l72Stalk(par,pts.map(g35Q),1.2,cols[1])});
  for(let i=1;i<=n;i++){const r0=(i%2?0:90)*D+R(-.2,.2);for(const s of[0,Math.PI]){const a=r0+s,rk=V3.nz(V3.add(V3.sc(X,Math.cos(a)),V3.sc(V3.cr(H,X),Math.sin(a)))),Hd=V3.nz(V3.add(V3.sc(H,.55),rk));
      const U=V3.nz(V3s([0,0,1],V3.sc(Hd,Hd[2]))),og2={pos:pts[i],H:Hd,U:V3l(U)>1e-3?U:[0,1,0],w:1};og2.L=V3.cr(og2.U,Hd);const lf=leaf(og2,{u:1,o:1,b:.6+.4*i/n,tw:1});if(lf)out.push(lf)}}
  return out}
function l72Bux(g,t,o){const cw=fgCw(CW_L72BUX,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=2,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return l72Run(o,'l72bux',()=>{const Lt=o.spine?blen(o.spine):40*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),lim=g35Lim(o),st='#6a5a3e',cols=[shd(st,-.55),shd(st,-.25),st,shd(st,.4)],
      vr=cw.v?{c:cw.v,k:y=>.72+.06*Math.sin(y*6)}:null,yc=mix(cw.v||cw.c,'#8ab04a',.5);
    const leaf=(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.55:fgSz(p,.86))*(p.o?.86:1)*kl*(p.tw?.85:1),L=cm0*UPC*sz*R(.85,1.12),young=u>.8?Math.round((.2+.5*(1-op))*4)/4:0,
        c0=young&&!cw.v?mix(cw.c,yc,young):cw.c,c=mix(c0,shd(c0,R(-.08,.08)),.5),F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,Math.max(og.w*.35,.4)));
      return l72Leaf(P0,F.H,F.N,L,L72_BUXSH,c,mix(cw.b,c,.25),{lim,qc:c0,arch:.05,fold:.2,cup:.06,droop:.03,tw:R(-.35,.35),dI:cw.mt?-.02:.03,gloss:cw.mt||cw.v?.2:.9,vr,veins:[[[0,0],[0,.94]]],vc:shd(c,.3),vw:.32,vo:.4})};
    const r=fgGrow(k,A,{li:(o.spine?1.25:1.05)*UPC*kl,liT:.3,w0:3*kl,w1:1.1,cols,uL:o.spine?.24:.2,phy:'opp',piece:DET>=1.5?9:20,la:50,face:.55,lift:.3,seg:8,wig:.035,rj:14,
      side:{u0:.12,u1:.92,p:o.spine?.45:.55,len:.3,ang:46,li:.8,e:-.003,tilt:35,pair:1},axil:{u0:.3,p:DET>=1.5?.4:o.spine?.14:.22,ang:52},
      leaf,axDraw:og=>l72BuxTwig(og,kl,leaf,cols,lim),post:(res,parts)=>l72Batch(parts,cw.v?9:20)});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the cladode or leaf length of a stem of 50–80 cm; for the galax the blade's width: small, medium, large),
   how the composer treats them (foliage stems along their spine; the galax a big leaf rising on its petiole, only its blade cleared above the lip) ---------- */
Object.assign(GH,{'ruscus-hypophyllum-israelien':l72Rhy,'ruscus-aculeatus-petit-houx':l72Rac,'galax-urceolata':l72Gal,'myrtus-communis-myrte':l72Myr,'buxus-sempervirens-buis':l72Bux});
Object.assign(CWS,{'ruscus-hypophyllum-israelien':CW_L72RHY,'ruscus-aculeatus-petit-houx':CW_L72RAC,'galax-urceolata':CW_L72GAL,'myrtus-communis-myrte':CW_L72MYR,'buxus-sempervirens-buis':CW_L72BUX});
Object.assign(SZG,{'ruscus-hypophyllum-israelien':[5,6,6,7.5],'ruscus-aculeatus-petit-houx':[2,2.5,2.5,3],'galax-urceolata':[5.5,7,7,10],'myrtus-communis-myrte':[2.5,3,3,3.6],'buxus-sempervirens-buis':[1.6,2,2,2.4]});
l72Gal.bigLeaf={ext:22,k0:12};
const L72_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'ruscus-hypophyllum-israelien':L72_I(65,{fx:22}),'ruscus-aculeatus-petit-houx':L72_I(55,{fx:12,tip:1}),'galax-urceolata':L72_I(30,{fx:28}),
  'myrtus-communis-myrte':L72_I(50,{fx:14}),'buxus-sempervirens-buis':L72_I(40,{fx:12})});
