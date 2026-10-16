/* ================= Serre, lot 76 — feuillages tropicaux 4 : feuille de bananier, vaquois (pandanus), gingembre coquille panaché, croton, aralia du Japon ================= */
/* chaque limbe est une nappe 3D (sheet3, plan de feuille l38M du lot 38) au bout de son pétiole, de sa gaine ou de sa canne poussés par le L-système (fgGrow du lot 24) ;
   nervures, panachures, taches et épines sont dessinées dans le plan de la feuille, bande par bande, et partent toutes de leur nervure ou de leur marge */

/* ---------- shared: a whole blade (no basal lobes) on the leaf's plane of lot 38, its marks painted on each face (o.marks, o.marksB), and o.edge(g, front, c, S, len)
   drawing what stands on its margin (spines) on the rows of each band; in a bouquet (o.lim) the blade shrinks until its outline stays above the vessel's mouth ---------- */
const l76Cols=c=>[shd(c,-.6),shd(c,-.25),c,shd(c,.4)];
function l76Blade(og,len,col,colB,sp,o,parts){const L0=len;let M=l38M(og,len,o);
  if(o.lim!=null)for(const k of[1,.85,.72,.6,.5]){len=L0*k;M=l38M(og,len,o);let lo=1e9;for(let i=0;i<=12;i++){const y=i/12;for(const s of[-1,1])lo=Math.min(lo,M(s*sp.out(y,s),y)[1])}if(lo>=o.lim)break}
  const P=pal7(col),PB=pal7(colB),F={k:null,B:I3,O:[0,0,0],parts:[]},S=l38Half(M,sp,0),rl=(o.roll||0)>.5,mk=rl?null:o.marks,mb=rl?null:o.marksB;
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:o.nu||6,nv:o.nv||20,across:o.across??1.1,ew:.5,eo:.4,cast:0,zb:o.zb,
    gloss:o.gl?{shin:o.shin||24,k:o.gl,thr:.2,cu:2,cv:o.gcv||5,nu:8,nv:16,lv:1.6,lu:.5,o:.55}:null,
    paint:!LOD&&(mk||mb||o.edge)?(g,front,c)=>{const L=front?mk:mb;if(L&&L.length)l38Paint(g,front,c,sp,0,S,L,len);if(o.edge)o.edge(g,front,c,S,len)}:null});
  parts.push(...ps);return{M,S,len}}
/* spines on both margins, pointing to the tip: each a small thorn whose base sits inside the margin (between v0 and v1, every dv), drawn on the band that holds it */
const l76Spines=(v0,v1,n,ls,col)=>(g,front,c,S,len)=>{const nv=c.scr.length-1,a=c.i0/nv,b=c.i1/nv+(c.i1===nv?1e-6:0),Q=(u,v)=>{const p=S(u,v);return[p[0],-p[1]]},l=Math.max(1.6,len*ls),db=Math.max(.0025,1.3/len);let d='';
  for(let i=0;i<n;i++){const v=v0+(v1-v0)*(i+.5)/n;if(v<a||v>=b)continue;for(const s of[-1,1]){const m=Q(s,v),q=Q(s*.86,v),fw=Q(s,Math.min(1,v+.01)),ox=m[0]-q[0],oy=m[1]-q[1],ol=Math.hypot(ox,oy)||1,fx=fw[0]-m[0],fy=fw[1]-m[1],fl=Math.hypot(fx,fy)||1;
      const t=[m[0]+(ox/ol*.55+fx/fl*.8)*l,m[1]+(oy/ol*.55+fy/fl*.8)*l],p0=Q(s*.9,Math.max(0,v-db)),p1=Q(s*.9,Math.min(1,v+db));d+=`M${f(p0[0])},${f(p0[1])}L${f(t[0])},${f(t[1])}L${f(p1[0])},${f(p1[1])}Z`}}
  if(d)E('path',{d,fill:col,stroke:col,'stroke-width':.5,'stroke-linejoin':'round'},g)};
/* a fill between two lines of the leaf's plane (each a list of [x, y]), closed */
const l76Band=(A,B)=>A.concat(B.slice().reverse());

/* ---------- banana leaf (Musa × paradisiaca, M. acuminata, M. basjoo; cut leaves of the trade): a very large oblong blade, rounded to truncate at the base, blunt at the tip,
   on a stout channelled petiole; a broad pale midrib, raised beneath, and very many fine lateral veins running close and parallel almost straight out to the margin;
   the blade tears along them into strips, the more so the older it is; the young leaf unrolls from a tight cigar. Sold green (the « feuille de bananier » of Thai and
   Hawaiian florists), and in ornamental forms: maroon-blotched (M. acuminata 'Zebrina', 'Sumatrana'), ruby ('Siam Ruby'), white-sectored ('Ae Ae') ---------- */
const CW_L76MU=[{id:'vert',n:'Vert franc',c:'#3f6b2c',b:'#93a98a',mr:'#c9cf8c',pc:'#86a058'},{id:'vert-tendre',n:'Vert tendre (jeune feuille)',c:'#77a142',b:'#b2c498',mr:'#dde0a0',pc:'#9ab460'},
  {id:'zebrina',n:'Vert tacheté de bordeaux (Zebrina)',c:'#4b7a36',b:'#7a3c44',mr:'#c4c88a',pc:'#7a5a3a',bl:'#5e1a26'},{id:'siam-ruby',n:'Rouge rubis taché de vert (Siam Ruby)',c:'#561820',b:'#6a2228',mr:'#a8404a',pc:'#6a2a2a',bl:'#4f7232'},
  {id:'ae-ae',n:'Panachée de blanc (Ae Ae)',c:'#4a7a36',b:'#9cb08e',mr:'#e8ead0',pc:'#a8b890',sec:'#eef0de'}];
const L76_MU=prof([[0,.5],[.03,.8],[.1,.96],[.45,1],[.8,.94],[.93,.7],[.985,.25],[1,0]]);
function l76MuMarks(spV,cw,L,tears){const out=[],nl=DET>=1.5?30:20,W=y=>spV.out(y,1);let x=L*1.37%1;const rn=()=>(x=(x*9301+.4927)%1);
  if(cw.sec)for(const s of[-1,1]){let y=.08+rn()*.1;while(y<.9){const h=.03+rn()*.12;if(rn()<.45){const y1=Math.min(.95,y+h),A=[],B=[];for(let i=0;i<=4;i++){const t=i/4;A.push([s*1.05*W(y+.04*t)*t,y+.04*t]);B.push([s*1.05*W(y1+.04*t)*t,y1+.04*t])}out.push({p:l76Band(A,B),c:cw.sec,o:.92})}y+=h+.02+rn()*.1}}
  if(cw.bl){const n=DET>=1.5?26:16;for(let i=0;i<n;i++){const y=.08+.84*rn(),s=rn()<.5?-1:1,u=s*W(y)*(.1+.8*rn()),r=.012+.03*rn(),e=1.4+rn(),p=[];for(let j=0;j<9;j++){const a=j/9*6.283,k=.75+.3*Math.sin(j*2.3+i);p.push([u+Math.cos(a)*r*k*e,y+Math.sin(a)*r*k])}out.push({p,c:cw.bl,o:.88})}}
  /* the lateral veins, close and parallel, nearly straight out to the margin; the midrib broad and pale */
  for(const s of[-1,1])for(let i=0;i<nl;i++){const y=.03+.92*(i+.5)/nl;out.push({l:[[0,y],[s*W(y)*.5,y+.012],[s*W(y+.03)*1.02,y+.03]],w:f(Math.max(1.05,L*.0018)),c:shd(cw.c,-.3),o:.45})}
  for(const q of tears)out.push({l:[[q.s*W(q.v)*(1-q.d)*.98,q.v+.004],[q.s*W(q.v)*(1-q.d*.5),q.v+.012]],w:f(Math.max(1.1,L*.002)),c:shd(cw.c,-.35),o:.5});
  out.push({l:[[0,0],[0,.5],[0,.985]],w:f(Math.max(1.4,L*.016)),c:cw.mr,o:.9});return out}
function l76Musa(g,t,o){const cw=fgCw(CW_L76MU,o);
  /* in a bouquet the leaf is cut to the spray: its blade never longer than three quarters of its spine */
  if(o.spine)o=Object.assign({},o,{cm:Math.min(o.cm||100,blen(o.spine)*.75/UPC)});
  return l38Plant(g,t,o,{cm0:100,pet:45,pc:cw.pc,w0:14,w1:10.5,arch:R(-.08,.08),wig:.006,blade:(og,len,op,parts)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),tears=[];
    /* the tears: slits along the lateral veins, from the margin toward the midrib (never through it), more on an old leaf, none on a young one */
    if(yg<.3)for(const s of[-1,1]){let v=.1+R(0,.08);while(v<.9){if(rnd()<.62)tears.push({s,v,d:R(.25,.9)});v+=R(.04,.12)}}
    const spV={lb:0,out:(y)=>.19*L76_MU(y)},sp={lb:0,out:(y,s)=>{let w=spV.out(y);for(const q of tears)if(q.s===s){const x=Math.abs(y-q.v)/.011;if(x<1)w*=1-q.d*(1-x)}return w}};
    l76Blade(og,L,cw.c,cw.b,sp,{lim:og.lim,th0:-.18+.3*yg,ka:-.55,droop:.1,fold:-.08,cup:-.05,tw:R(-.25,.25),wave:.012,nw:7,roll:yg*(yg>.5?1.9:1.3),nv:tears.length?96:24,nu:6,across:1.2,W:.19,gl:.35,shin:16,
      marks:l76MuMarks(spV,cw,L,tears),marksB:[{l:[[0,0],[0,.5],[0,.985]],w:f(Math.max(1.8,L*.022)),c:shd(cw.b,.3),o:.9}]},parts)}})}

/* ---------- screw pine (Pandanus utilis, P. tectorius 'Veitchii', 'Sanderi'; P. amaryllifolius): a stout stem ringed with leaf scars, crowned by long strap-shaped leaves
   set in three ranks that wind round it in a tight spiral (the « screw »); each leaf clasps the stem by its base, is channelled along a keeled midrib and arches out,
   its margins (and the keel beneath) armed with small hooked spines pointing to the tip — red in P. utilis; 'Veitchii' edged and striped with creamy white, 'Sanderi'
   striped with golden yellow; the young leaves stand up in the centre, folded ---------- */
const CW_L76PA=[{id:'vert',n:'Vert, épines rouges (utilis)',c:'#3e6a3a',b:'#7a9a6a',sp:'#b0303a',pc:'#6a6a4a'},{id:'veitchii',n:'Panaché blanc crème (Veitchii)',c:'#4a7a42',b:'#8aa47a',sp:'#d8d0b0',pc:'#7a7a5a',st:'#eeeacc',edge:1},
  {id:'sanderi',n:'Rayé jaune d\'or (Sanderi)',c:'#5a8434',b:'#98ac6a',sp:'#c8b860',pc:'#7a7a4a',st:'#e2c84a'},{id:'pandan',n:'Vert tendre sans épines (pandan)',c:'#5e9440',b:'#9ab878',pc:'#7a8a50'}];
const L76_PA=prof([[0,.72],[.05,.92],[.2,1],[.6,.88],[.88,.45],[1,0]]);
function l76PaMarks(spV,cw,L){const out=[],W=y=>spV.out(y,1),line=(k,y0=.03,y1=.97)=>{const P=[];for(let i=0;i<=10;i++){const y=y0+(y1-y0)*i/10;P.push([k*W(y),y])}return P};
  if(cw.edge)for(const s of[-1,1])out.push({p:l76Band(line(s*1.04),line(s*.66,.03,.95)),c:cw.st,o:.95});
  if(cw.st)for(const[a,b]of cw.edge?[[.12,.2],[-.38,-.3],[.44,.5]]:[[.08,.18],[-.3,-.22],[.36,.46],[-.62,-.52],[.74,.8]])out.push({p:l76Band(line(a,.04,.9),line(b,.04,.9)),c:cw.st,o:.9});
  for(const k of[-.5,.5])out.push({l:line(k),w:f(Math.max(1.05,L*.0016)),c:shd(cw.c,.22),o:.35});
  out.push({l:[[0,0],[0,.5],[0,.98]],w:f(Math.max(1.1,L*.004)),c:shd(cw.c,.3),o:.7});return out}
function l76Pand(g,t,o){const cw=fgCw(CW_L76PA,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=90,ks=o.spine?1:(o.cm||cm0)/cm0,len0=(o.cm||cm0)*UPC*(o.spine?Math.min(1,blen(o.spine)*.65/((o.cm||cm0)*UPC)):1),k=G(g),Lt=o.spine?blen(o.spine):40*UPC*Math.min(1.2,ks),
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.03,.09)),sc='#7a6a52',cols=l76Cols(sc),sw=o.spine?5.5:10*Math.min(1.1,ks);
  const r=fgGrow(k,A,{li:2.2*UPC,liT:.3,w0:sw,w1:sw*.85,cols,uL:2,seg:10,wig:.006,tipLv:0,node:1,
    nodeDraw:(og)=>{const[X0]=fgCross(og.H),w=og.w*.55,a=V3.add(og.pos,V3.sc(X0,-w)),b=V3.add(og.pos,V3.sc(X0,w)),q0=fgQ(a),q1=fgQ(b),m=fgQ(V3.add(og.pos,V3.sc(og.H,-og.w*.2)));
      return{z:og.pos[2]+.6,fn:par=>E('path',{d:`M${f(q0[0])},${f(q0[1])}Q${f(m[0])},${f(m[1])} ${f(q1[0])},${f(q1[1])}`,stroke:shd(sc,-.4),'stroke-width':1.1,'stroke-opacity':.6,fill:'none'},par)}},
    /* the crown: n leaves in three ranks winding round the top of the stem, the oldest outside, longest and most spread, the youngest erect and folded in the centre */
    tip:(og)=>{const parts=[],H=og.H,[X0,Y0]=fgCross(H),n=Math.round((LOD?7:o.spine?9:DET>=1.5?16:12)*(.55+.45*op)),ph=R(0,360),zt=o.spine?.7:1;
      for(let i=0;i<n;i++){const q=i/(n-1||1),az=(ph+i*(120+7.5))*D,r=V3.add(V3.sc(X0,Math.cos(az)),V3.sc(Y0,Math.sin(az))),young=Math.max(0,q-.72)/.28,
          ang=((1-q)*62+12)*D*zt,Hl=V3.nz(V3.add(V3.sc(H,Math.cos(ang)),V3.sc(r,Math.sin(ang)))),Ul=V3.nz(V3.add(V3.sc(H,Math.sin(ang)),V3.sc(r,-Math.cos(ang)))),
          P0=V3.add(og.pos,V3.sc(H,-sw*1.2*(1-q))),sh=sw*1.5,P1=V3.add(P0,V3.sc(Hl,sh)),L=len0*(1-.5*Math.pow(q,1.6))*R(.92,1.05)*(.7+.3*op);
        l38Pet(P0,P1,sw*.9,sw*.62,l76Cols(mix(cw.pc,cw.c,.5)),parts,{lite:1});
        const spV={lb:0,out:(y)=>.042*L76_PA(y)},lv={pos:P1,H:Hl,U:Ul,L:V3.cr(Ul,Hl)};if(o.spine)lv.lim=18;
        l76Blade(lv,L,cw.c,cw.b,spV,{lim:lv.lim,th0:.05,ka:-(1-young)*(o.spine?.55:.8)*R(.75,1.2),droop:(1-young)*(o.spine?.05:.08),fold:.3+.9*young,tw:R(-.3,.3),wave:.004,nw:5,roll:young*1.2,nv:22,nu:4,across:1.3,W:.042,gl:.75,shin:28,
          marks:l76PaMarks(spV,cw,L),marksB:[{l:[[0,0],[0,.5],[0,.98]],w:f(Math.max(1.2,L*.005)),c:shd(cw.b,.25),o:.8}],edge:cw.sp?l76Spines(.03,.94,DET>=1.5?30:18,.0045,cw.sp):null},parts)}
      return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- variegated shell ginger (Alpinia zerumbet 'Variegata'): a reed-like cane (the rolled leaf sheaths) bearing two ranks of alternate leaves, short-stalked,
   lanceolate with a long point, smooth and glossy; the lateral veins leave the midrib at a narrow angle and run close and parallel to the margin, and the yellow
   variegation follows them in stripes of every width, some leaves almost all gold; 'Chinese Beauty' is marbled in pale green instead. The newest leaf is rolled ---------- */
const CW_L76AL=[{id:'variegata',n:'Vert rayé de jaune (Variegata)',c:'#4c7a32',b:'#8aa86a',st:'#dcbc34',sc:'#7a9450'},{id:'creme',n:'Vert rayé de crème (Variegata, lumière douce)',c:'#4f7e38',b:'#90aa76',st:'#ece0a0',sc:'#7a9450'},
  {id:'jaune',n:'Jaune d\'or rayé de vert (Variegata)',c:'#d4b232',b:'#c8c07a',st:'#4f7a34',sc:'#8a9a4a'},{id:'chinese-beauty',n:'Vert marbré de vert tendre (Chinese Beauty)',c:'#3c6a2e',b:'#7a9a66',st:'#8db058',sc:'#6a8a44',marb:1}];
const L76_AL=prof([[0,.22],[.08,.6],[.28,.95],[.45,1],[.7,.8],[.9,.36],[1,0]]);
function l76AlMarks(sp,cw,L){const out=[],W=y=>sp.out(y,1),vein=(s,y0,x0=0)=>l38Vein(sp,s,y0,Math.min(1.02,y0+.2),1.02,6,x0);let x=L*2.71%1;const rn=()=>(x=(x*9301+.4927)%1);
  /* the stripes, each between two lateral veins (or within one span), from the midrib or from part way out, to the margin */
  for(const s of[-1,1]){let y=.02+rn()*.03;while(y<.9){const h=.012+rn()*(cw.marb?.05:.07),x0=rn()<.35?rn()*.12:0;if(rn()<(cw.marb?.42:.5))out.push({p:l76Band(vein(s,y,x0),vein(s,y+h,x0)),c:cw.st,o:cw.marb?.75:.95});y+=h+.01+rn()*.05}}
  for(const s of[-1,1])for(let i=0;i<(DET>=1.5?14:9);i++)out.push({l:vein(s,.03+i*.06),w:f(Math.max(1.05,L*.003)),c:shd(cw.c,.25),o:.35});
  out.push({l:[[0,0],[0,.5],[0,.97]],w:f(Math.max(1.1,L*.008)),c:shd(cw.c,.35),o:.75});return out}
function l76Alpi(g,t,o){const cw=fgCw(CW_L76AL,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=45,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):75*UPC*Math.min(1.15,ks),
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.16)),cols=l76Cols(cw.sc),sp={lb:0,out:(y)=>.12*L76_AL(y)},back=cw.b;
  const r=fgGrow(k,A,{li:8*UPC*kl,liT:.35,w0:6.5*kl,w1:2.6,cols,uL:o.spine?.3:.22,phy:'alt2',la:36,face:.7,lift:.5,seg:12,wig:.008,rj:10,
    leaf:(og,p)=>{const young=p.tip?Math.min(1,.55+.6*(1-op)):0,sz=(p.tip?.55:fgSz(p,.78))*kl,L=cm0*UPC*sz*R(.9,1.06)*(1-.2*young),pl=L*.06,parts=[];
      /* the sheath clasping the cane up to the short stalk, then the blade */
      const P1=V3.add(og.pos,V3.sc(og.H,pl));l38Pet(og.pos,P1,Math.max(1.4,og.w*.8),Math.max(1.2,L*.016),cols,parts,{lite:1});
      l76Blade(Object.assign({},og,{pos:P1}),L,cw.c,back,sp,{lim:o.spine?18:null,th0:-.05+.5*young,ka:-.7*R(.8,1.2)*(1-young),droop:.12*(1-young),fold:.14+.8*young,tw:R(-.45,.45),wave:.012,nw:4,roll:young*1.6,nv:30,nu:6,across:1.1,W:.12,gl:.8,shin:26,
        marks:l76AlMarks(sp,cw,L),marksB:l76AlMarks(sp,Object.assign({},cw,{c:back,st:mix(cw.st,back,.45)}),L)},parts);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- croton (Codiaeum variegatum var. pictum): a woody shoot crowded with leathery, very glossy leaves on stout stalks; their form changes from one cultivar
   to the next — broad oval ('Petra'), narrow and twisted like a corkscrew ('Mammy'), linear and arching ('Zanzibar'), lobed like an oak ('Excellent'), small and
   gold-speckled ('Gold Dust'), splashed ('Mrs Iceton'); the veins and blotches are yellow, orange, red or pink on green to almost black, the older leaves the warmer ---------- */
const CW_L76CR=[{id:'petra',n:'Vert à nervures jaunes et orange (Petra)',c:'#2f4c28',old:'#5a2232',vn:'#e8c43a',vo:'#e2602a',sh:'ov'},
  {id:'mammy',n:'Pourpre spiralé, nervures rouges (Mammy)',c:'#4a1a26',old:'#2a1a1e',vn:'#d83a48',vo:'#e8803a',sh:'sp',bl:'#e07a3a'},
  {id:'gold-dust',n:'Vert piqueté d\'or (Gold Dust)',c:'#3a6030',vn:'#5a8040',sh:'el',dots:'#ecd04a'},
  {id:'zanzibar',n:'Lanières rouge, orange et jaune (Zanzibar)',c:'#b84a2a',old:'#6a2028',vn:'#e8c43a',sh:'na',str:['#e8c43a','#3a5a2a','#d02a30']},
  {id:'excellent',n:'Feuille de chêne jaune d\'or (Excellent)',c:'#d6a830',old:'#d8842a',vn:'#b8302a',sh:'lo',mg:'#3a5a2a'},
  {id:'mrs-iceton',n:'Rouge rosé taché de noir (Mrs Iceton)',c:'#b8323a',old:'#8a1e30',vn:'#e8c040',sh:'el',bl:'#2a1a1e'}];
const L76_CRO=prof([[0,.25],[.1,.66],[.35,1],[.6,.9],[.85,.45],[1,0]]),L76_CRE=prof([[0,.18],[.12,.6],[.4,1],[.7,.82],[.92,.32],[1,0]]),L76_CRN=prof([[0,.4],[.08,.85],[.3,1],[.75,.8],[.95,.3],[1,0]]),
  L76_CRL=prof([[0,.18],[.14,.6],[.27,.95],[.33,1],[.43,.42],[.5,.36],[.6,.52],[.66,.56],[.8,.4],[.93,.16],[1,0]]);
const l76CrSp=sh=>sh==='ov'?{lb:0,out:y=>.3*L76_CRO(y)}:sh==='na'?{lb:0,out:y=>.05*L76_CRN(y)}:sh==='lo'?{lb:0,out:y=>.33*L76_CRL(y)}:sh==='sp'?{lb:0,out:y=>.13*L76_CRE(y)}:{lb:0,out:y=>.24*L76_CRE(y)};
function l76CrMarks(sp,cw,L,age){const out=[],W=y=>sp.out(y,1),vc=cw.vo?mix(cw.vn,cw.vo,age):cw.vn,vw=Math.max(1.1,L*(cw.sh==='na'?.01:.016));let x=L*3.91%1;const rn=()=>(x=(x*9301+.4927)%1);
  if(cw.str)cw.str.slice(0,DET>=1.5?3:2).forEach((c,i)=>{const k0=[-.55,.15,.6][i],k1=k0+[.3,.22,.25][i],ln=k=>{const P=[];for(let j=0;j<=10;j++){const y=.03+.92*j/10;P.push([k*W(y),y])}return P};out.push({p:l76Band(ln(k0),ln(k1)),c,o:.9})});
  if(cw.mg)for(const s of[-1,1]){const A=[],B=[];for(let j=0;j<=16;j++){const y=.02+.96*j/16;A.push([s*W(y)*1.04,y]);B.push([s*W(y)*(.68+.08*Math.sin(j*1.9)),y])}out.push({p:l76Band(A,B),c:cw.mg,o:.95})}
  if(cw.bl){const n=cw.sh==='sp'?6:10;for(let i=0;i<n;i++){const y=.1+.8*rn(),s=rn()<.5?-1:1,u=s*W(y)*(.2+.6*rn()),r=.02+.04*rn(),p=[];for(let j=0;j<8;j++){const a=j/8*6.283,kk=.7+.35*Math.sin(j*2.1+i);p.push([u+Math.cos(a)*r*kk*.8,y+Math.sin(a)*r*kk*1.3])}out.push({p,c:cw.bl,o:.88})}}
  if(cw.dots){const d=[];for(let i=0;i<(DET>=1.5?44:28);i++){const y=.05+.9*rn(),s=rn()<.5?-1:1;d.push([s*W(y)*.9*rn(),y,.009+.012*rn()])}out.push({d,c:cw.dots,o:.95})}
  /* the veins: the midrib broad, the laterals pinnate (lobed: to each lobe's tip) */
  const ys=cw.sh==='lo'?[.08,.18,.3,.5,.64]:cw.sh==='na'?[]:[.08,.2,.32,.46,.6,.74];
  for(const s of[-1,1])for(const y0 of ys)out.push({l:l38Vein(sp,s,y0,y0+(cw.sh==='lo'&&(y0===.18||y0===.5)?.12:.16),.86,6),w:f(Math.max(1.05,vw*.55)),c:vc,o:.9});
  out.push({l:[[0,0],[0,.5],[0,.97]],w:f(vw),c:vc,o:.95});return out}
function l76Crot(g,t,o){const cw=fgCw(CW_L76CR,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=22,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):40*UPC*Math.min(1.15,ks),
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.05,.12)),cols=l76Cols('#6a5a3a'),sp=l76CrSp(cw.sh),na=cw.sh==='na',spi=cw.sh==='sp';
  const r=fgGrow(k,A,{li:(na?3.2:3.4)*UPC*kl,liT:.5,w0:5*kl,w1:2.2,cols,uL:o.spine?.4:.3,phy:'spiral',la:na?34:48,face:.6,lift:.5,seg:10,wig:.01,
    leaf:(og,p)=>{const u=p.tip?1:p.u,young=p.tip?Math.min(1,.5+.6*(1-op)):0,age=Math.max(0,Math.min(1,(1-u)*1.6)),sz=(p.tip?.5:fgSz(p,.8))*kl,L=cm0*UPC*sz*R(.88,1.06)*(na?1.5:1)*(1-.2*young),pl=L*(na?.08:.16),parts=[],
        col=cw.old?mix(cw.c,cw.old,age*.6):cw.c,P1=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.06,0]));
      l38Pet(og.pos,P1,Math.max(1.3,og.w*.5),Math.max(1.15,L*.022),l76Cols(mix(col,'#6a5a3a',.4)),parts,{lite:1});
      l76Blade(Object.assign({},og,{pos:P1}),L,col,mix(col,'#c8c4a0',.35),sp,{lim:o.spine?18:null,th0:-.1+.5*young,ka:na?-1.2*R(.8,1.2):-.35,droop:na?.16:.1,fold:.16+.7*young,cup:cw.sh==='ov'?.05:0,
        tw:spi?(rnd()<.5?-1:1)*R(2.2,3):R(-.4,.4),wave:spi?.04:.015,nw:3,roll:young*.9,nv:spi?36:na?24:cw.sh==='lo'?30:22,nu:6,across:1.2,W:sp.out(.4),gl:1,shin:32,gcv:6,
        marks:l76CrMarks(sp,cw,L,age),marksB:l76CrMarks(sp,Object.assign({},cw,{vn:mix(cw.vn,'#e0dcc0',.4),vo:cw.vo&&mix(cw.vo,'#e0dcc0',.4),bl:null,dots:null,str:null,mg:null}),L,age)},parts);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- Japanese aralia (Fatsia japonica): a large leathery leaf, deeply palmate with 7 or 9 lobes (cut to about half way), each lobe oblong-ovate, pointed, its margin
   coarsely and shallowly toothed; dark green and lacquered above, paler beneath, a pale midrib in each lobe radiating from the top of a long, smooth, round petiole;
   'Variegata' has creamy white tips and margins, 'Spider's Web' is speckled and netted with white; the young leaf is folded like a closed hand and felted ---------- */
const CW_L76FA=[{id:'vert',n:'Vert laqué',c:'#1f4224',b:'#5a7a4a',vn:'#a8b878',pc:'#6a8a44'},{id:'spiders-web',n:'Moucheté de blanc (Spider\'s Web)',c:'#3a5a3a',b:'#8a9a7a',vn:'#c8d0b0',pc:'#8a9a6a',web:'#eceee2'},
  {id:'variegata',n:'Bord crème (Variegata)',c:'#2c5030',b:'#7a9a6a',vn:'#b8c48a',pc:'#7a9a5a',mg:'#ece6c4'}];
const L76_FAL=prof([[0,.12],[.2,.48],[.42,.84],[.6,1],[.78,.82],[.92,.34],[1,0]]);
function l76FaMarks(sp,cw,L,i){const out=[],W=y=>sp.out(y,1);let x=(L*.73+i*.37)%1;const rn=()=>(x=(x*9301+.4927)%1);
  if(cw.mg)for(const s of[-1,1]){const A=[],B=[];for(let j=0;j<=12;j++){const y=.46+.54*j/12;A.push([s*W(y)*1.05,y]);B.push([s*W(y)*(.62+.12*Math.sin(j*2.3+i)),Math.max(.46,y-.08)])}out.push({p:l76Band(A,B),c:cw.mg,o:.95})}
  if(cw.web){const d=[];for(let j=0;j<(DET>=1.5?34:22);j++){const y=.3+.68*rn(),s=rn()<.5?-1:1;d.push([s*W(y)*(.35+.6*rn()),y,.006+.01*rn()])}out.push({d,c:cw.web,o:.9})}
  for(const s of[-1,1])for(const y0 of[.36,.5,.64,.78])out.push({l:l38Vein(sp,s,y0,y0+.12,.82,6),w:f(Math.max(1.05,L*.004)),c:cw.vn,o:.55});
  out.push({l:[[0,0],[0,.5],[0,.96]],w:f(Math.max(1.2,L*.016)),c:cw.vn,o:.9});return out}
/* the palm: n lobes radiating in the leaf's plane from the top of the petiole; near the centre each lobe is broader than its share of the circle, so the lobes join in one blade */
function l76FaBlade(og,len,cw,op,parts){const yg=Math.max(0,.75-op)/.75,n=rnd()<.55?9:7,spr=(n===9?142:136)*D*(1-.55*yg),dA=2*spr/(n-1),tg=Math.tan(dA/2),bk=.55,H0=V3.nz(V3.add(V3.sc(og.H,Math.cos(bk)),V3.sc(og.U,-Math.sin(bk)))),U0=V3.nz(V3.add(V3.sc(og.U,Math.cos(bk)),V3.sc(og.H,Math.sin(bk)))),X0=V3.cr(H0,U0),P0=og.pos;
  const W=.5*Math.tan(Math.min(.5,(n===9?142:136)*D/(n-1)))+.02,sp={lb:0,out:(y)=>Math.max(W*L76_FAL(y)*(y>.42?l38Saw(y,11,.07):1),y<.4?1.15*y*tg*Math.min(1,(.4-y)/.06):0)};
  let k=1;if(og.lim!=null)for(const kk of[1,.85,.72,.6,.5]){k=kk;let lo=1e9;for(let i=0;i<n;i++){const a=-spr+i*dA,d=V3.add(V3.sc(H0,Math.cos(a)),V3.sc(X0,Math.sin(a))),Lk=len*kk*.52*(.6+.4*Math.pow(Math.cos(a/2),1.4));lo=Math.min(lo,P0[1]+d[1]*Lk*.9)}if(lo>=og.lim)break}
  for(let i=0;i<n;i++){const a=-spr+i*dA,d=V3.nz(V3.add(V3.sc(H0,Math.cos(a)),V3.sc(X0,Math.sin(a)))),Lk=len*k*.52*(.6+.4*Math.pow(Math.cos(a/2),1.4))*R(.95,1.04);
    l76Blade({pos:P0,H:d,U:U0,L:V3.cr(U0,d)},Lk,cw.c,cw.b,sp,{th0:.38+.3*yg,ka:-1.15*(1-.3*yg),droop:.05,fold:.1+.6*yg,tw:R(-.15,.15),wave:.02,nw:3,roll:yg*.9,nv:30,nu:6,across:1.1,W:W,gl:.95,shin:30,gcv:6,zb:-.02*Math.abs(a),
      marks:l76FaMarks(sp,cw,Lk,i),marksB:[{l:[[0,0],[0,.5],[0,.96]],w:f(Math.max(1.3,Lk*.02)),c:shd(cw.b,.3),o:.85}]},parts)}}
function l76Fats(g,t,o){const cw=fgCw(CW_L76FA,o);
  return l38Plant(g,t,o,{cm0:30,pet:32,pc:cw.pc,w0:4.6,w1:3.6,arch:R(-.1,.1),wig:.01,face:.9,blade:(og,len,op,parts)=>l76FaBlade(og,len,cw,op,parts)})}

/* ---------- registers ---------- */
Object.assign(GH,{'musa-feuille-bananier':l76Musa,'pandanus':l76Pand,'alpinia-zerumbet-variegata':l76Alpi,'codiaeum-variegatum-croton':l76Crot,'fatsia-japonica-aralia':l76Fats});
Object.assign(CWS,{'musa-feuille-bananier':CW_L76MU,'pandanus':CW_L76PA,'alpinia-zerumbet-variegata':CW_L76AL,'codiaeum-variegatum-croton':CW_L76CR,'fatsia-japonica-aralia':CW_L76FA});
/* commercial grades, in the recipe's unit: the length of the blade (banana, ginger, croton), of the longest leaves (pandanus), the span of the palm (aralia) */
Object.assign(SZG,{'musa-feuille-bananier':[60,100,140],'pandanus':[60,90,120],'alpinia-zerumbet-variegata':[30,45,60],'codiaeum-variegatum-croton':[15,22,30],'fatsia-japonica-aralia':[20,30,40]});
/* in a bouquet the big leaves rise on their petioles behind the flowers: only the top of the spine must clear the lip; the aralia's basal lobes hang back below its petiole */
l76Musa.bigLeaf={ext:14,k0:12};l76Fats.bigLeaf={ext:30,k0:12};
/* the leafy stems tell the composer their natural length and how far their leaves reach out of the spine (fx), so that their spine is checked against the lip with it */
Object.assign(GHI,{'pandanus':{form:'feuillage',size:1.1,k:'plant',rk:.3,self:50*UPC,fx:18},'alpinia-zerumbet-variegata':{form:'feuillage',size:1.1,k:'plant',rk:.44,self:70*UPC,fx:20},
  'codiaeum-variegatum-croton':{form:'feuillage',size:1.1,k:'plant',rk:.6,self:45*UPC,fx:20}});
