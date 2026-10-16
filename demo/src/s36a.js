/* ================= Serre, lot 36 — feuillages des plantes à fleurs : liane de gloriosa, feuillage de pivoine, feuilles de calla, feuilles d'hellébore, feuillage de chrysanthème ================= */
/* each is cut from a flowering plant already in the greenhouse and keeps its leaves (shape, colour, stem): grown by the L-system on the foliage contract of lots 15 and 24 (fgAxis, fgGrow, fgBlade) */
/* a plain sheet in 3D from an outline: x across (right half, x ≥ 0, mirrored for the left), y along the midrib; S(x,y) → view space. Each half lit by its own normal (Newell), its back paler */
const ff36N=P=>{const n=[0,0,0];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];n[0]+=(a[1]-b[1])*(a[2]+b[2]);n[1]+=(a[2]-b[2])*(a[0]+b[0]);n[2]+=(a[0]-b[0])*(a[1]+b[1])}return n};
function ff36Sheet(S,ol,Un,c,cb,o={}){const P=pal7(c),PB=pal7(cb),y0=ol[0][1],y1=ol[ol.length-1][1],mid=[];for(let i=1;i<8;i++)mid.push([0,y1-(y1-y0)*i/8]);
  const half=sg=>{const P3=ol.concat(mid).map(([x,y])=>S(sg*x,y));let n=ff36N(P3);if(V3.dot(n,Un)<0)n=V3.sc(n,-1);n=V3l(n)>1e-9?V3.nz(n):[0,0,1];const fr=n[2]>=0,I=lightI(fr?n:V3.sc(n,-1))+(o.dI||0);
    return{pts:P3.map(fgQ),z:P3.reduce((a,p)=>a+p[2],0)/P3.length,col:toneAt(fr?P:PB,I),fr,ink:(fr?P:PB).ink}};
  const hA=half(-1),hB=half(1),ord=hA.z<hB.z?[hA,hB]:[hB,hA],fr=hA.fr||hB.fr;
  return{z:(hA.z+hB.z)/2+(o.zb||0),fr,fn:par=>{for(const h of ord)E('path',{d:smooth(h.pts),fill:h.col,stroke:h.ink,'stroke-width':DET>=1.5?.4:.5,'stroke-opacity':.34,'stroke-linejoin':'round'},par);if(o.over)o.over(par,fr,P,ord)}}}
/* a blade of fgBlade with something drawn on its upper face (spots, marbling): the face is the one seen when its normal turns toward the eye */
function ff36Over(og,len,wr,lo,b,draw){const S=lsLeafS(og,len,wr,lo),n=V3.cr(V3s(S(0,.7),S(0,.2)),V3s(S(.5,.45),S(-.5,.45)));if(n[2]<=0||LOD)return b;const fn0=b.fn;b.fn=par=>{fn0(par);draw(par,S)};return b}
/* a stroke along 3D points */
const ff36Line=(P3,w,c,op=1)=>par=>E('path',{d:'M'+P3.map(p=>f(p[0])+','+f(-p[1])).join('L'),stroke:c,'stroke-width':f(w),'stroke-opacity':op,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);

/* ---------- gloriosa (Gloriosa superba 'Rothschildiana'): the climbing shoot cut with its leaves — slender, a little zigzag, the leaves sessile, lanceolate, glossy,
   alternate or subopposite (in threes low down), each upper leaf drawn out at its tip into a tendril that coils round a support; the shoot's tip folded and curled ---------- */
const FF36_CWG=[{id:'vert',n:'Vert franc',c:'#4a7a34'},{id:'vert-profond',n:'Vert profond',c:'#3e5c3a'},{id:'vert-tendre',n:'Vert tendre (jeunes pousses)',c:'#6a9a3a'}];
const FF36_GL=prof([[0,.2],[.1,.6],[.3,1],[.55,.84],[.78,.44],[.92,.14],[1,.02]]);
/* a tendril from the tip of a blade: a short run along it, then a coil that tightens (dn: the side it curls to) */
function ff36Tendril(tip,H,dn,Ln,w,c){const n=LOD?8:DET>=1.5?22:14,r0=Ln*.24,sd=V3.cr(H,dn),st=V3.add(tip,V3.sc(H,Ln*.3)),c0=V3.add(st,V3.sc(dn,r0)),P=[tip];
  for(let i=1;i<=n;i++){const t=i/n;if(t<=.3){P.push(V3.add(tip,V3.add(V3.sc(H,Ln*t),V3.sc(dn,Ln*.15*t*t))));continue}
    const s=(t-.3)/.7,th=s*Math.PI*2.4,r=r0*(1-.6*s);P.push(V3.add(c0,V3.add(V3.add(V3.sc(dn,-Math.cos(th)*r),V3.sc(H,Math.sin(th)*r)),V3.sc(sd,s*r0*.5))))}
  return{z:tip[2]+.05,fn:ff36Line(P,w,c,.95)}}
function ff36Glor(g,t,o){const cw=fgCw(FF36_CWG,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=12,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):55*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.2,.34));
  const sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'],tc=shd(cw.c,.12);
  const r=fgGrow(k,A,{li:3.4*UPC*kl,liT:.35,w0:2.6*kl,w1:1,cols:sc,uL:o.spine?.3:.12,phy:'spiral',la:44,face:.7,lift:.3,seg:10,wig:.045,rj:24,
    side:{u0:.35,u1:.7,p:.25,len:.38,ang:34,li:.8,e:-.01},
    leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=p.tip?1-op*.6:u>.82?(1-op)*(u-.82)/.18:0,sz=fgSz(p,.8)*(p.o?.82:1)*kl*(1-.45*young),L=cm0*UPC*sz*R(.88,1.1),c=mix(cw.c,shd(cw.c,R(-.12,.14)),.6);
      const lo={wp:FF36_GL,droop:.2+.08*u,arch:.07,fold:.12+.55*young,tw:R(-.4,.4)},parts=[fgBlade(og,L,.21,c,mix(c,'#a8c080',.25),Object.assign({gloss:.8,dI:.02},lo))];
      /* the tendril: on the upper leaves, coiled tight on the young ones */
      if(u>.3||p.o){const S=lsLeafS(og,L,.21,lo),e=S(0,1),Hd=V3.nz(V3s(e,S(0,.92))),dn0=V3.nz(V3s(og.U,V3.sc(Hd,V3.dot(og.U,Hd)))),dn=V3.sc(dn0,rnd()<.6?-1:1);
        parts.push(ff36Tendril(e,Hd,dn,L*(.28+.12*(1-young))*R(.85,1.15),Math.max(.45,L*.011),tc))}
      return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- herbaceous peony (Paeonia lactiflora): the leafy stem cut below the bud, three to five large alternate leaves, biternate — the petiole forks in three,
   each branch bears three leaflets, the terminal ones often cut again into two or three lanceolate segments; deep glossy green, red petioles and stems,
   flushed red and bronze when young and again in autumn ---------- */
const FF36_CWP=[{id:'vert-lustre',n:'Vert lustré',c:'#3e5e2a'},{id:'vert-fonce',n:'Vert foncé',c:'#2f5a28'},{id:'vert-rouge',n:'Vert à pétioles rouges (jeune)',c:'#4a6a30',au:'#8a3a2e',k:.25},
  {id:'automne',n:"Rougi d'automne",c:'#7a3a2a',au:'#b0502a',k:.7},{id:'bronze',n:'Bronze cuivré (automne)',c:'#5a3a2a',au:'#8a5a2a',k:.6}];
const FF36_PL=prof([[0,.12],[.12,.6],[.35,1],[.62,.86],[.85,.42],[1,0]]);
function ff36PeoLeaf(og,len,cw,young,pc,parts){const H=og.H,U=og.U,Lv=og.L,pl=len*.34,p1=V3.add(V3.add(og.pos,V3.sc(H,pl)),[0,-pl*.1,0]),rach=[],sp=1-.55*young;
  const leaflet=(pos,d,Lf,Uf)=>{const Lx=V3.nz(V3.cr(Uf,d)),o2={pos,H:d,U:Uf,L:Lx},c0=cw.au?mix(cw.c,cw.au,Math.min(1,Math.max(0,cw.k+R(-.3,.3)))):cw.c,c=mix(c0,shd(c0,R(-.14,.12)),.6);
    parts.push(fgBlade(o2,Lf,.3,c,mix(c,'#b0b890',.3),{wp:FF36_PL,droop:.12,arch:.07,fold:.16+.6*young,tw:R(-.35,.35),gloss:cw.k>.5?.4:.9,nv:12,veins:[[[0,0],[0,.96]]]}))};
  for(const j of[-1,0,1]){const a=(j*44+R(-6,6))*D*sp,d=V3.nz(V3.add(V3.add(V3.sc(H,Math.cos(a)),V3.sc(Lv,Math.sin(a))),[0,-.12,0])),bl=len*(j?.16:.2),q=V3.add(p1,V3.sc(d,bl));rach.push([p1,V3.add(p1,V3.sc(d,bl*.5)),q]);
    for(const m of[-1,0,1]){const b=(m*40+R(-6,6))*D*sp,Uf=V3.nz(V3.add(U,V3.sc(Lv,R(-.25,.25)+m*.18))),e=V3.nz(rotA(d,Uf,b)),Lf=len*(m?.5:.6)*(j?.9:1)*R(.9,1.08);
      /* the terminal leaflets cut again into segments */
      if(!m&&rnd()<(j?.45:.7)){const ns=rnd()<.5?2:3;for(let s=0;s<ns;s++){const c2=(s-(ns-1)/2)*24*D*sp,e2=V3.nz(rotA(e,Uf,c2));leaflet(V3.add(q,V3.sc(e,Lf*.08)),e2,Lf*(s===(ns-1)/2?.95:.82),Uf)}}
      else leaflet(q,e,Lf,Uf)}}
  /* the petiole and the rachis: red, one stroke each */
  const pp=[og.pos,V3.add(V3.add(og.pos,V3.sc(H,pl*.5)),[0,-pl*.03,0]),p1],pz=(og.pos[2]+p1[2])/2;
  parts.push({z:pz-.3,fn:par=>{ff36Line(pp,Math.max(.9,len*.014),pc)(par);for(const L3 of rach)ff36Line(L3,Math.max(.7,len*.01),pc)(par)}})}
function ff36Peo(g,t,o){const cw=fgCw(FF36_CWP,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=14,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):45*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.16));
  const cols=PEO_SC.map(c=>mix(c,'#7a3a2a',.32)),pc=mix('#7a3a2a',cw.c,.25);
  const r=fgGrow(k,A,{li:7*UPC*kl,liT:.3,w0:3.8*kl,w1:2,cols,uL:o.spine?.36:.2,phy:'spiral',la:40,face:.75,lift:.45,seg:12,wig:.02,tipLv:0,
    leaf:(og,p)=>{const u=p.u,young=u>.75?(1-op)*.9:0,L=cm0*UPC*kl*(u>.8?.72:1)*R(.9,1.06),parts=[];ff36PeoLeaf(og,L,cw,young,pc,parts);return parts},
    /* the stem ends in its last, smaller leaf (the bud removed for the foliage) */
    tip:(og)=>{const parts=[];ff36PeoLeaf(fgFace(og,A.at(1).Fr,.7),cm0*UPC*kl*.62,cw,(1-op)*.9,pc,parts);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- calla (Zantedeschia aethiopica; Z. albomaculata and Z. elliottiana hybrids): one leaf on a long fleshy, spongy petiole, sheathing at its base;
   the blade sagittate (an arrowhead: two basal lobes behind the petiole), glossy, many fine veins curving from the midrib to the margin;
   the hybrids' narrower blades speckled with white translucent spots. Stages: the young leaf still rolled, half spread, spread ---------- */
const FF36_CWC=[{id:'vert',n:'Vert uni (aethiopica)',c:'#3e6a2e',wr:1,lb:1},{id:'vert-tendre',n:'Vert tendre',c:'#4e7a34',wr:.9,lb:.9},
  {id:'mouchete',n:'Moucheté de blanc (hybrides)',c:'#2e5a2a',sp:'#e4ecd8',wr:.72,lb:.75}];
/* the right half of the arrowhead, from the petiole's point (0,0) round the basal lobe to the tip (0,1) */
const ff36CallaOl=(wr,lb)=>[[0,0],[.07*wr,-.07*lb],[.15*wr,-.18*lb],[.21*wr,-.27*lb],[.27*wr,-.22*lb],[.31*wr,-.08*lb],[.33*wr,.1],[.31*wr,.28],[.26*wr,.48],[.18*wr,.67],[.1*wr,.83],[.035*wr,.95],[0,1]];
function ff36Calla(g,t,o){const cw=fgCw(FF36_CWC,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=24,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g),Lt=o.spine?blen(o.spine):45*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14));
  const green=mix('#4a7432','#7f9a52',.3),sc=['#2c4a1e',mix('#4a7432',green,.5),mix('#79a352',green,.4),'#a8c97e'],len=cm0*UPC*(o.spine?1:ks)*R(.94,1.04)*(.55+.45*op);
  const r=fgGrow(k,A,{li:30*UPC,liT:0,w0:5.4*kl,w1:3.2*kl,cols:sc,uL:2,seg:12,wig:.012,tipLv:0,
    tip:(og)=>{const Fr=A.at(1).Fr,H0=og.H,Hb=V3.nz(V3.add(H0,V3.sc(Fr,R(-.32,-.12)))),Ub0=V3.nz(V3s(Fr,V3.sc(Hb,V3.dot(Fr,Hb)))),tw=R(-.2,.2),Ub=V3.nz(rotA(Ub0,Hb,tw)),Lb=V3.cr(Ub,Hb);
      /* young: rolled on its midrib; then the halves open, the tip arches and droops */
      const fo=.2+1.05*(1-op)**1.4,ar=.12,dr=.16*op,P0=og.pos;
      const S=(x,y)=>{const ax=Math.abs(x),lob=y<0?-y*y*.8:0;return V3.add(V3.add(V3.add(P0,V3.sc(Hb,y*len)),V3.sc(Lb,x*len*(1-.35*Math.min(1,fo-.12)))),V3.add(V3.sc(Ub,len*(fo*ax*(1+ax*1.4)+ar*(Math.sin(Math.PI*Math.max(0,Math.min(1,(y+.25)/1.25)))-Math.sin(Math.PI*.2))+lob)),[0,-len*dr*Math.max(0,y)**2,0]))};
      const ol=ff36CallaOl(cw.wr,cw.lb),c=mix(cw.c,shd(cw.c,R(-.08,.1)),.5),hw=y=>{const M=ol.slice(5);y=Math.max(M[0][1],Math.min(1,y));let i=1;while(i<M.length-1&&M[i][1]<y)i++;const p=M[i-1],q=M[i];return p[0]+(q[0]-p[0])*(y-p[1])/(q[1]-p[1]||1)};
      const sh=ff36Sheet(S,ol,Ub,c,mix(c,'#b8c8a0',.32),{over:(par,fr,P)=>{if(LOD||!fr)return;
        /* the veins: midrib and fine laterals curving to the margin */
        let d='';const q=(x,y)=>fgQ(S(x,y));for(const sg of[-1,1]){for(let i=0;i<(DET>=1.5?11:7);i++){const y=.02+i*(DET>=1.5?.072:.11),a=q(0,y),b=q(sg*hw(y+.06)*.55,y+.07),e=q(sg*hw(y+.14)*.93,y+.16);d+=`M${f(a[0])},${f(a[1])}Q${f(b[0])},${f(b[1])} ${f(e[0])},${f(e[1])}`}
          const a=q(0,0),b=q(sg*.12*cw.wr,-.12*cw.lb),e=q(sg*.2*cw.wr,-.25*cw.lb);d+=`M${f(a[0])},${f(a[1])}Q${f(b[0])},${f(b[1])} ${f(e[0])},${f(e[1])}`}
        E('path',{d,stroke:P.l1,'stroke-width':.6,'stroke-opacity':.5,fill:'none'},par);
        const m=[0,.25,.5,.75,.97].map(y=>q(0,y));E('path',{d:'M'+m.map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:P.l2,'stroke-width':f(Math.max(.6,len*.009)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par);
        /* the white speckles of the hybrids */
        if(cw.sp&&op>.3){let ds='';const n=DET>=1.5?34:18;for(let i=0;i<n;i++){const y=.04+.82*((i*.618+.13)%1),x=(i%2?1:-1)*hw(y)*R(.1,.88),p=S(x,y),rr=len*R(.012,.022),P4=fgPoly(p,V3.sc(Lb,1.6),Hb,[0,1,2,3,4,5].map(j=>[Math.cos(j*1.047)*rr*.6,Math.sin(j*1.047)*rr]));ds+=fgD(P4)}
          E('path',{d:ds,fill:cw.sp,opacity:.82},par)}}});
      return[sh]}});
  open(k,t,1000,0,.4);return r}

/* ---------- hellebore (Helleborus × hybridus, H. niger and their hybrids): the evergreen basal leaf on a long petiole, pedate — seven to nine elliptic segments from one point,
   the outer ones borne on the laterals, leathery, the margin toothed toward the tip; dark green and glossy, or veined and marbled with silver (× ericsmithii, × ballardiae).
   Stages: the young leaf hanging folded, half spread, spread like an umbrella ---------- */
const FF36_CWH=[{id:'vert-fonce',n:'Vert foncé',c:'#2e4a26'},{id:'vert-lustre',n:'Vert lustré',c:'#3e5a2e'},{id:'vert-moyen',n:'Vert moyen',c:'#557a3c'},
  {id:'marbre',n:'Marbré argent',c:'#4a5e3e',mb:'#b4c2ae'},{id:'veine',n:'Veiné crème',c:'#3a5430',vn:'#d8dcb8'}];
const FF36_HS=prof([[0,.1],[.12,.46],[.36,.9],[.62,1],[.84,.72],[.95,.3],[1,0]]);
function ff36Hell(g,t,o){const cw=fgCw(FF36_CWH,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=15,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g),Lt=o.spine?blen(o.spine):32*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14));
  const sc=['#2e3a1e','#4a5a2a','#6e7a44','#a0a878'],len=cm0*UPC*(o.spine?1:ks)*R(.92,1.05)*(.6+.4*op),nS=rnd()<.5?7:9;
  const r=fgGrow(k,A,{li:30*UPC,liT:0,w0:3.6*kl,w1:2.6*kl,cols:sc,uL:2,seg:12,wig:.015,tipLv:0,
    tip:(og)=>{const Fr=A.at(1).Fr,H0=og.H,parts=[],sp=.3+.7*op,
        /* the blade's plane: across the petiole, turned toward the front of the spray; the central segment points up along it */
        N=V3.nz(V3.add(V3.sc(Fr,.85),V3.sc(H0,.45+.25*(1-op)))),Hc0=V3s(H0,V3.sc(N,V3.dot(H0,N))),Hc=V3l(Hc0)>1e-3?V3.nz(Hc0):fgCross(N)[0],c0=mix(cw.c,shd(cw.c,R(-.06,.08)),.5);
      for(let j=0;j<nS;j++){const s=j-(nS-1)/2,th=s*(nS===7?40:32)*D*sp+R(-.05,.05),d0=rotA(Hc,N,th),
          /* the segments cup a little round the centre and droop with age; the young ones hang folded */
          dO=V3.nz(V3.add(d0,V3.sc(N,-.3-.04*Math.abs(s)))),yh=Math.pow(1-op,1.3)*.85,d=V3.nz(V3.add(V3.sc(dO,1-yh),V3.sc(V3.add(V3.sc(H0,-1),V3.add(V3.sc(N,.45),V3.sc(d0,.25))),yh))),Uf=V3.nz(V3s(N,V3.sc(d,V3.dot(N,d)))),lf=1-.36*Math.pow(Math.abs(s)/((nS-1)/2),1.3),
          base=Math.abs(s)>=2?V3.add(og.pos,V3.sc(rotA(Hc,N,Math.sign(s)*(Math.abs(s)-1)*(nS===7?40:32)*D*sp),len*.05)):og.pos,o2={pos:base,H:d,U:Uf,L:V3.nz(V3.cr(Uf,d))},
          Lj=len*lf*R(.93,1.06),c=mix(c0,shd(c0,R(-.1,.1)),.5),lo={wp:FF36_HS,droop:.14+.05*(1-op),arch:.09,fold:.14+.7*(1-op),tw:R(-.2,.2)};
        let b=fgBlade(o2,Lj,.36,c,mix(c,'#a8b08a',.35),Object.assign({tz:.07,tz1:1,nv:16,gloss:.35,dI:-.02,zb:-Math.abs(s)*.01},lo));
        if(cw.mb||cw.vn)b=ff36Over(o2,Lj,.36,lo,b,(par,S)=>{const A2=[],B2=[];for(let i=1;i<10;i++){const v=i/10;A2.push(fgQ(S(-.3,v)));B2.push(fgQ(S(.3,v)))}
          if(cw.mb){E('path',{d:smooth(A2.concat(B2.reverse())),fill:cw.mb,opacity:.42},par);let dv='';for(const u of[-.62,-.45,.45,.62]){const P=[.15,.4,.65,.85].map(v=>fgQ(S(u*(1-.4*v),v)));dv+=smooth(P,false)}E('path',{d:dv,stroke:cw.mb,'stroke-width':.9,'stroke-opacity':.5,fill:'none'},par)}
          else{let dv='M'+[0,.3,.6,.95].map(v=>{const q=fgQ(S(0,v));return f(q[0])+','+f(q[1])}).join('L');for(const v of[.2,.38,.56,.72])for(const sg of[-1,1]){const a=fgQ(S(0,v)),e=fgQ(S(sg*.8,v+.15));dv+=`M${f(a[0])},${f(a[1])}L${f(e[0])},${f(e[1])}`}
            E('path',{d:dv,stroke:cw.vn,'stroke-width':.7,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},par)}});
        parts.push(b)}
      return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- florist's chrysanthemum (Chrysanthemum × morifolium): the leafy shoot cut before the buds colour, many alternate leaves on short petioles,
   ovate, pinnately cut into three to five rounded lobes, toothed, aromatic, dull green above and grey-felted beneath; side shoots from the upper axils ---------- */
const FF36_CWM=[{id:'vert',n:'Vert',c:'#4e6a3a'},{id:'vert-gris',n:'Vert grisé',c:'#5a6a4a'},{id:'vert-fonce',n:'Vert foncé',c:'#3f6a2c'}];
/* the width of a mum leaf along its length: the ovate outline of mumLeaf, deeply lobed */
const ff36MumW=v=>{const ov=Math.sin(Math.PI*Math.pow(Math.max(0,Math.min(1,v)),.8))*(1-.25*v),lob=.5+.5*Math.pow(Math.abs(Math.sin(Math.PI*3*(v+.06))),.55);return ov*lob};
function ff36Mum(g,t,o){const cw=fgCw(FF36_CWM,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):40*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14));
  const sc=['#2e4a26','#4a6a3c','#6e9058','#a2bc88'];
  const r=fgGrow(k,A,{li:2.3*UPC*kl,liT:.35,w0:3.4*kl,w1:1.3,cols:sc,uL:o.spine?.3:.12,phy:'spiral',la:50,face:.65,lift:.4,seg:10,wig:.02,
    side:{u0:.55,u1:.85,p:.3,len:.3,ang:30,li:.75,e:-.004},
    leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=p.tip?1-op*.6:u>.85?(1-op)*(u-.85)/.15:0,sz=fgSz(p,.8)*(p.o?.75:.85+.15*Math.sin(Math.PI*Math.min(1,u+.3)))*kl*(1-.4*young),L=cm0*UPC*sz*R(.9,1.08),pl=L*.18,
        c=mix(cw.c,shd(cw.c,R(-.1,.1)),.5),base=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.1,0]));
      return fgBlade(Object.assign({},og,{pos:base}),L*.82,.72,c,mix(c,'#b4bca4',.5),{wp:ff36MumW,droop:.14,arch:.05,fold:.1+.6*young,tw:R(-.3,.3),tz:.05,nv:28,sharp:1,dI:-.02,
        veins:[[[0,0],[0,.96]],...[.2,.45,.7].flatMap(v=>[[[0,v-.1],[-.7,v+.04]],[[0,v-.1],[.7,v+.04]]])],pet:{p0:og.pos,w:Math.max(.7,1*kl),c:sc[1]}})}});
  open(k,t,1000,0,.4);return r}

/* ---------- registers ---------- */
Object.assign(GH,{'gloriosa-feuillage':ff36Glor,'pivoine-feuillage':ff36Peo,'calla-feuilles':ff36Calla,'hellebore-feuilles':ff36Hell,'chrysantheme-feuilles':ff36Mum});
Object.assign(CWS,{'gloriosa-feuillage':FF36_CWG,'pivoine-feuillage':FF36_CWP,'calla-feuilles':FF36_CWC,'hellebore-feuilles':FF36_CWH,'chrysantheme-feuilles':FF36_CWM});
/* commercial grades, in the recipe's unit: the length of a leaf (of a leaflet's whole leaf for the peony) */
Object.assign(SZG,{'gloriosa-feuillage':[10,12,14],'pivoine-feuillage':[12,14,16],'calla-feuilles':[18,24,30],'hellebore-feuilles':[12,15,18],'chrysantheme-feuilles':[6,8,10]});
