/* ================= Serre, lot 38 — feuillages colorés : anthurium cristal, bégonia rex, coléus, caladium, feuilles de vigne ================= */
/* chaque limbe est une nappe 3D (sheet3) tendue de sa nervure à sa marge, en deux moitiés quand sa base est en cœur ; ses panachures et ses nervures sont peintes dans le plan
   de la feuille, coupées à chaque face visible ; les pétioles, les tiges carrées du coléus et les sarments de la vigne sont poussés par le L-système (fgGrow du lot 24) */

/* ---------- shared: the leaf's plane bent in 3D. x across (right +), y along the midrib (0 where the petiole joins, 1 at the tip, the basal lobes at y < 0), in blade lengths.
   The midrib leaves along H tilted th0 toward the face U and curls (ka over the blade); across it the blade folds on the midrib (fold), cups (cup), rolls when young (roll),
   waves at the margin (wave, nw waves), twists along (tw), leans in its plane (lean) and droops under its weight (droop) ---------- */
function l38M(og,len,o){const U=og.U,ln=o.lean||0,H=V3.add(V3.sc(og.H,Math.cos(ln)),V3.sc(V3.cr(og.H,U),Math.sin(ln))),X=V3.cr(H,U),P0=og.pos,t0=o.th0||0,ka=o.ka||0,dr=o.droop??.12,fo=o.fold??.1,cu=o.cup||0,tw=o.tw||0,wa=o.wave||0,nw=o.nw||5,rl=o.roll||0,W=(o.W||.4)*len,ph=o.ph||0;
  return(x,y)=>{const yp=Math.max(0,y),t=t0+ka*yp,ct=Math.cos(t),st=Math.sin(t);let mx,my;
    if(Math.abs(ka)>1e-4){mx=(st-Math.sin(t0))/ka;my=(Math.cos(t0)-ct)/ka}else{mx=yp*Math.cos(t0);my=yp*Math.sin(t0)}
    if(y<0){mx+=y*Math.cos(t0);my+=y*Math.sin(t0)}
    const Uv=V3.add(V3.sc(U,ct),V3.sc(H,-st)),a=x*len;let px,py;
    if(rl>.02){const r=W/(rl*Math.PI);px=r*Math.sin(a/r);py=r*(1-Math.cos(a/r))}else{px=a;py=fo*Math.abs(a)+cu*a*a/W}
    py+=wa*len*x*x*Math.sin(nw*6.283*y+(x<0?-1.7:1.7)+ph);
    const c=Math.cos(tw*y),sn=Math.sin(tw*y),x2=px*c-py*sn,y2=px*sn+py*c;
    return V3.add(V3.add(V3.add(P0,V3.add(V3.sc(H,mx*len),V3.sc(U,my*len))),V3.add(V3.sc(X,x2),V3.sc(Uv,y2))),[0,-len*dr*y*y,0])}}
/* a blade's outline sp: out(y, s) its half width on side s (−1 left, 1 right), inn(y, s) the edge of the basal sinus (y < 0), lb how far the basal lobes reach back ([left, right] when unequal) */
const l38Lb=(sp,s)=>Array.isArray(sp.lb)?sp.lb[s<0?0:1]:sp.lb||0;
/* the sheet of one half (s = ±1), u from the midrib (or the sinus) to the margin, v from the back of the basal lobe to the tip; s = 0: the whole blade, u across, v along */
function l38Half(M,sp,s){if(!s)return(u,v)=>M(u*sp.out(v,u<0?-1:1),v);const lb=l38Lb(sp,s);
  return(u,v)=>{const y=-lb+v*(1+lb),xi=y<0?sp.inn(y,s):0,xo=sp.out(y,s),r=s>0?(u+1)/2:(1-u)/2;return M(s*(xi+r*(xo-xi)),y)}}
/* a point of the leaf's plane (x, y) in the (u, v) of the sheet of side s: what lies across the midrib or in the sinus is pinned to the edge of this half */
function l38UV(sp,s,x,y){if(!s){const w=sp.out(Math.max(0,Math.min(1,y)),x<0?-1:1)||1e-6;return[Math.max(-1,Math.min(1,x/w)),Math.max(0,Math.min(1,y))]}
  const lb=l38Lb(sp,s),yy=Math.max(-lb,Math.min(1,y)),xi=yy<0?sp.inn(yy,s):0,xo=sp.out(yy,s),r=Math.max(0,Math.min(1,(s*x-xi)/Math.max(1e-6,xo-xi)));return[s>0?2*r-1:1-2*r,(yy+lb)/(1+lb)]}
/* the margin of side s scaled by k toward the petiole (k < 1: a ring inside the blade), from the back of the lobe to the tip; j(y0) jitters it (zones that follow the veins) */
function l38Ring(sp,s,k,n=16,j){const lb=l38Lb(sp,s||1),out=[];for(let i=0;i<=n;i++){const y0=-lb+(1+lb)*i/n,kk=Math.max(0,k+(j?j(y0):0));out.push([(s||1)*kk*sp.out(y0,s||1),kk*y0])}return out}
/* a zone between two rings (k0 < k1); k0 = 0: the heart of the leaf, from the petiole */
const l38Zone=(sp,s,k0,k1,n,j0,j1)=>{const A=l38Ring(sp,s,k1,n,j1);return k0<=0?[[0,0]].concat(A):A.concat(l38Ring(sp,s,k0,n,j0).reverse())};
/* the marks of a blade, painted on each band of each half: fills {p, c, o} (closed, smoothed), lines {l, w, c, o} (veins), dots {d:[[x, y, r]], c, o};
   a fill or a line is cut to the rows of the band; a line is kept on the half that holds it (the midrib on both, each half drawing its side of the stroke) */
function l38Paint(g,front,c,sp,s,S,list,Lm){const nv=c.scr.length-1,a=c.i0/nv-1e-6,b=c.i1/nv+1e-6,Q=(u,v)=>{const p=S(u,v);return[p[0],-p[1]]},fills=new Map(),lines=new Map(),dots=new Map();
  const add=(M,key,d)=>M.set(key,(M.get(key)||'')+d),mine=P=>!s||P.some(q=>s*q[0]>1e-6)||P.every(q=>Math.abs(q[0])<1e-6);
  for(const m of list){
    if(m.p){if(!mine(m.p))continue;let lo=1,hi=0;const uv=m.p.map(([x,y])=>{const q=l38UV(sp,s,x,y);lo=Math.min(lo,q[1]);hi=Math.max(hi,q[1]);return q});if(hi<a||lo>b)continue;
      add(fills,m.c+'|'+(m.o??1),smooth(uv.map(([u,v])=>Q(u,Math.max(a,Math.min(b,v))))))}
    else if(m.l){if(!mine(m.l))continue;const P=[];for(let i=0;i<m.l.length-1;i++)for(let t=0;t<4;t++){const p0=m.l[i],p1=m.l[i+1],e=t/4;P.push([p0[0]+(p1[0]-p0[0])*e,p0[1]+(p1[1]-p0[1])*e])}P.push(m.l[m.l.length-1]);
      let d='',run=[];const flush=()=>{if(run.length>1)d+=smooth(run,false);run=[]};for(const[x,y]of P){const[u,v]=l38UV(sp,s,x,y);if(v<a||v>b){flush();continue}run.push(Q(u,v))}flush();
      if(d)add(lines,m.c+'|'+(m.o??1)+'|'+f(m.w),d)}
    else if(m.d)for(const[x,y,r]of m.d){if(s&&s*x<0)continue;const[u,v]=l38UV(sp,s,x,y);if(v<a||v>b)continue;const q=Q(u,v),rr=Math.max(.55,r*Lm);add(dots,m.c+'|'+(m.o??1),`M${f(q[0]-rr)},${f(q[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(rr*2)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-rr*2)},0`)}}
  for(const[k,d]of fills){const[cc,o]=k.split('|');E('path',{d,fill:cc,opacity:o},g)}
  for(const[k,d]of dots){const[cc,o]=k.split('|');E('path',{d,fill:cc,opacity:o},g)}
  for(const[k,d]of lines){const[cc,o,w]=k.split('|');E('path',{d,stroke:cc,'stroke-opacity':o,'stroke-width':w,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)}}
/* the blade: its halves (or the whole) as sheets with the face palette and the underside palette, marks on the face (o.marks) and on the underside (o.marksB);
   o.op < 1 lets the light through a thin blade */
function l38Blade(og,len,col,colB,sp,o,parts){const L0=len;let M=l38M(og,len,o);
  /* in a bouquet (o.lim: the height of the vessel's mouth, head-local) the blade shrinks until its whole outline, lobes included, stays above it */
  if(o.lim!=null)for(const k of[1,.85,.72,.6,.5]){len=L0*k;M=l38M(og,len,o);let lo=1e9;for(const s of[-1,1])for(const q of l38Ring(sp,sp.lb?s:s,1,12))lo=Math.min(lo,M(q[0],q[1])[1]);if(lo>=o.lim)break}
  const P=pal7(col),PB=pal7(colB),F={k:null,B:I3,O:[0,0,0],parts:[]},sides=sp.lb?[-1,1]:[0];
  for(const s of sides){const S=l38Half(M,sp,s),rl=(o.roll||0)>.5,mk=rl?null:o.marks,mb=rl?null:o.marksB;
    const ps=sheet3(F,S,{pal:P,palB:PB,nu:o.nu||(s?4:6),nv:o.nv||20,across:o.across??1.1,ew:.5,eo:.4,cast:0,zb:o.zb,
      gloss:o.gl?{shin:o.shin||24,k:o.gl,thr:.2,cu:2,cv:o.gcv||5,nu:8,nv:16,lv:1.6,lu:.5,o:.55}:null,
      paint:!LOD&&(mk||mb)?(g,front,c)=>{const L=front?mk:mb;if(L&&L.length)l38Paint(g,front,c,sp,s,S,L,len)}:null});
    if(o.op1)for(const p of ps){const fn=p.fn;p.fn=par=>fn(G(par,{opacity:o.op1}))}
    parts.push(...ps)}
  return M}
/* a vein in the leaf's plane: from (x0, y0) toward the margin at the share r of the half width, rising by dy, on side s */
const l38Vein=(sp,s,y0,y1,r,n=6,x0=0)=>{n=Math.max(6,n);const P=[[x0*s,y0]];for(let i=1;i<=n;i++){const t=i/n,y=y0+(y1-y0)*t,w=sp.out(Math.max(-l38Lb(sp,s),Math.min(1,y)),s);P.push([s*(Math.abs(x0)+(r*w-Math.abs(x0))*Math.pow(t,.8)),y])}return P};
/* teeth along a margin: a saw of n teeth (k deep), sharper on its tip side */
const l38Saw=(y,n,k)=>{const x=(y*n)%1;return 1-k*(x<.7?x/.7:(1-x)/.3)};
/* a short petiole or joint between two 3D points, slightly sagging (lite: one ribbon and its light, for the many leaves of a stem) */
function l38Pet(P0,P1,w0,w1,cols,parts,o={}){const P=[],W=[],n=6;let z=0;for(let i=0;i<=n;i++){const t=i/n,q=V3.add(V3.add(P0,V3.sc(V3s(P1,P0),t)),[0,-V3l(V3s(P1,P0))*.06*Math.sin(Math.PI*t),0]);P.push([q[0],-q[1]]);W.push(Math.max(1.1,w0+(w1-w0)*t));z+=q[2]}
  parts.push({z:z/(n+1),cast:false,ax:1,fn:par=>{if(o.lite){E('path',{d:polyRibbon(P,i=>W[i]/2),fill:cols[1]},par);if(!LOD&&Math.max(...W)>1.6)E('path',{d:polyRibbon(P,i=>W[i]*.2,i=>W[i]*.3),fill:cols[3],opacity:.7},par)}else stemPoly(par,P,W,cols)}})}
const l38Cols=c=>[shd(c,-.6),shd(c,-.25),c,shd(c,.4)];
/* a big leaf on its petiole: the petiole grown by the L-system (along the bouquet's spine, or standing in the view's frame), the blade at its tip facing the front of the spray;
   c: cm0 (blade), pet (petiole, cm), pc (its colour), w0 w1, arch, wig, blade(og, len, op, parts, cols) */
function l38Plant(g,t,o,c){const op=Math.max(.05,Math.min(1,o.op??1)),cm0=c.cm0,ks=o.spine?1:(o.cm||cm0)/cm0,len=(o.cm||cm0)*UPC,k=G(g),Lt=o.spine?blen(o.spine):c.pet*UPC*ks,A=fgAxis(o,Lt,c.arch??R(-.1,.1));
  /* in a bouquet the petiole stops short of the spine's tip, so that the blade, not beyond it, sits at the edge of the mass; the blade keeps above the vessel's mouth (lim) */
  if(o.spine)A.L=Math.min(A.L,Math.max(A.L*.6,A.l0+12*UPC,A.L-len*.5));
  const cols=l38Cols(c.pc),sE=A.sOf(A.L);
  const r=fgGrow(k,A,{li:9*UPC,liT:0,w0:c.w0*Math.min(1.15,ks),w1:c.w1*Math.min(1.15,ks),cols,uL:2,seg:12,wig:c.wig??.012,tipLv:0,
    tip:og=>{const parts=[],Fr=A.at(sE).Fr,of=fgFace(og,Fr,c.face??.85);if(o.spine)of.lim=18;c.blade(of,len,op,parts,cols);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- crystal anthurium (Anthurium crystallinum; A. clarinervium, A. magnificum): a large cordate blade, thick and velvety, deep green, the primary veins and the
   collective vein near the margin raised and silvery white; it hangs from a geniculum, a swollen joint at the top of a long terete petiole (square-winged in magnificum);
   the young leaf unrolls bronze or pinkish purple. Sold as single cut leaves ---------- */
const CW_L38AN=[{id:'crystallinum',n:'Vert velours, nervures argent (crystallinum)',c:'#1f3a26',v:'#d6e2d0',b:'#9aae8c'},{id:'clarinervium',n:'Vert noir, nervures ivoire (clarinervium)',c:'#192a1d',v:'#ecebd8',b:'#8a9a7c',rd:1},
  {id:'magnificum',n:'Vert profond, nervures olive (magnificum)',c:'#2e4a2a',v:'#b8c89c',b:'#a0b088'},{id:'jeune-bronze',n:'Jeune feuille bronze rosé',c:'#5a3a34',v:'#e2c4bc',b:'#b09088'},
  {id:'sombre',n:'Vert sombre velouté',c:'#2a3620',v:'#c8d4b8',b:'#8e9c80'}];
const L38_ANP=prof([[0,.36],[.05,.62],[.13,.9],[.24,1],[.42,.92],[.62,.72],[.8,.44],[.93,.16],[1,0]]),L38_ANR=prof([[0,.4],[.05,.68],[.13,.94],[.26,1],[.46,.95],[.66,.78],[.84,.48],[.95,.16],[1,0]]);
const l38AnSp=(rd)=>{const lb=rd?.34:.3,W=rd?.42:.37,pr=rd?L38_ANR:L38_ANP,xl=W*pr(0);return{lb,out:(y)=>W*pr((y+lb)/(1+lb)),inn:(y)=>xl*Math.pow(-y/lb,2.6)}};
function l38AnMarks(sp,cw,L){const w=Math.max(1.1,L*.011)/L,h=w*2.8,V=[],H=[];
  for(const s of[-1,1]){V.push(l38Vein(sp,s,0,.93,.6,10),l38Vein(sp,s,0,.86,.86,10),l38Vein(sp,s,0,-.24,.55,6),l38Vein(sp,s,0,-.16,.85,6));
    V.push(l38Vein(sp,s,.3,.52,.66,6))}
  V.push([[0,-.0],[0,.5],[0,.985]]);
  return[{p:l38Zone(sp,-1,.94,1.01),c:mix(cw.c,'#b8c4b0',.28),o:.5},{p:l38Zone(sp,1,.94,1.01),c:mix(cw.c,'#b8c4b0',.28),o:.5},
    ...V.map(l=>({l,w:f(h*L),c:mix(cw.v,cw.c,.45),o:.45})),...V.map(l=>({l,w:f(w*L),c:cw.v,o:.95}))]}
function l38Anth(g,t,o){const cw=fgCw(CW_L38AN,o),sp=l38AnSp(cw.rd);
  return l38Plant(g,t,o,{cm0:28,pet:42,pc:mix(cw.c,'#7a8a5a',.45),w0:3.6,w1:2.8,arch:R(-.14,.14),face:.7,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),col=yg>0?mix(cw.c,'#6a3a3a',yg*.8):cw.c,
    gl=V3.add(og.pos,V3.sc(og.H,L*.07));
    /* the geniculum: a swollen joint, paler, at the top of the petiole; the blade hangs from it */
    l38Pet(og.pos,gl,og.w*1.25,og.w*1.4,l38Cols(mix(cols[2],'#c8c8a0',.25)),parts);
    l38Blade(Object.assign({},og,{pos:gl}),L,col,cw.b,sp,{lim:og.lim,th0:-.28+.4*yg,ka:.8,lean:R(-.25,.25),droop:.1,fold:.22+(yg>.6?0:1.8*yg),cup:.14,tw:(rnd()<.5?-1:1)*R(.55,.85),roll:yg>.6?yg*1.9:0,nv:22,across:.7,W:.4,
      marks:l38AnMarks(sp,cw,L),marksB:[[[0,0],[0,.5],[0,.98]],...[-1,1].flatMap(s=>[l38Vein(sp,s,0,.9,.62,5),l38Vein(sp,s,0,-.2,.55,3)])].map(l=>({l,w:Math.max(1.2,L*.009),c:shd(cw.b,.28),o:.85}))},parts)}})}

/* ---------- painted-leaf begonia (Begonia rex-cultorum): an oblique, ear-shaped blade, one basal lobe far larger than the other, acuminate, finely toothed and ciliate,
   puckered between palmate sunken veins; painted in zones round the petiole: silver, purple-black, wine red, pink, green; 'Escargot' coils a silver spiral; the underside
   red, the petiole red and hairy ---------- */
const CW_L38BE=[{id:'silver-queen',n:'Argent, cœur vert (Silver Queen)',c:'#b8bcc0',z:[[0,.22,'#3e5a3c']],vn:'#4a6248',mg:'#4a6a44'},
  {id:'fireworks',n:'Argent veiné de pourpre noir (Fireworks)',c:'#c4c2ca',z:[[0,.3,'#3a1a32'],[.88,1.01,'#4a2040']],vn:'#3a1a32',vf:1},
  {id:'escargot',n:'Spirale argent sur vert (Escargot)',c:'#566a48',z:[[0,.14,'#2c3a2a']],sp:'#c8ccc4',vn:'#3a4a34'},
  {id:'inca-flame',n:'Rouge braise, cœur noir (Inca Flame)',c:'#9a3a3c',z:[[0,.32,'#3a1020'],[.9,1.01,'#4a1424']],vn:'#4a1424',dots:'#d8a0a8'},
  {id:'helen-lewis',n:'Pourpre et bande argent (Helen Lewis)',c:'#3a2a30',z:[[.34,.7,'#bcb6c4']],vn:'#24141e',mg:'#2a1424'},
  {id:'merry-christmas',n:'Bandes rouge, rose, argent et vert (Merry Christmas)',c:'#4a5a3a',z:[[0,.2,'#4a1020'],[.2,.44,'#b8304a'],[.44,.62,'#d8c4cc'],[.62,.84,'#4a6a3a']],vn:'#3a1424',mg:'#7a1a2a'},
  {id:'rose-argent',n:'Rose argenté (Pink Champagne)',c:'#c890a8',z:[[0,.24,'#6a2a3a']],vn:'#6a2a3a',dots:'#ece0e6',mg:'#7a3a4a'},
  {id:'vert-argent',n:'Vert moucheté argent',c:'#4a6a3a',z:[[0,.18,'#2a3a24']],vn:'#2e4228',dots:'#d0d4cc'}];
/* the oblique blade: the right side carries the big basal lobe */
const L38_BER=prof([[0,.32],[.06,.62],[.18,.9],[.32,1],[.5,.88],[.7,.6],[.86,.3],[.96,.08],[1,0]]),L38_BEL=prof([[0,.34],[.1,.7],[.28,.96],[.42,1],[.62,.82],[.8,.5],[.93,.16],[1,0]]);
const l38BeSp=(m)=>{const lb=[.13,.42],W=[.3,.56],xl=[W[0]*L38_BEL(0),W[1]*L38_BER(0)],sg=s=>s*m<0?0:1;
  return{lb:m>0?lb:[lb[1],lb[0]],out:(y,s)=>{const i=sg(s),l=lb[i];return W[i]*(i?L38_BER:L38_BEL)((y+l)/(1+l))*l38Saw(y+(i?.5:0),34,.05)},inn:(y,s)=>{const i=sg(s);return xl[i]*Math.pow(-y/lb[i],1.5)}}};
function l38BeMarks(sp,cw,L,m){const out=[],jit=(a,b)=>y=>a*Math.sin(y*b*6.283);
  for(const s of[-1,1]){for(const[k0,k1,c]of cw.z)out.push({p:l38Zone(sp,s,k0,k1,22,k0>0?jit(.035,5):null,k1<1?jit(.04,5):null),c,o:.94});
    if(cw.mg)out.push({p:l38Zone(sp,s,.95,1.01,22),c:cw.mg,o:.85})}
  if(cw.sp){/* the spiral: a band coiling out from the petiole, one turn and a half */const A=[],B=[],n=60,bw=.09;
    for(let i=0;i<=n;i++){const th=.4+i/n*9.4,r=.05+.042*th,cx=0,cy=.12,a=th*m;A.push([cx+Math.sin(a)*r*1.05,cy+Math.cos(a)*r*1.25]);B.push([cx+Math.sin(a)*(r+bw*Math.min(1,th/3))*1.05,cy+Math.cos(a)*(r+bw*Math.min(1,th/3))*1.25])}
    for(const s of[-1,1]){const P=A.concat(B.reverse()).map(([x,y])=>[x,y]);B.reverse();out.push({p:P.map(([x,y])=>s*x<0?[0,y]:[x,y]),c:cw.sp,o:.92})}}
  if(cw.dots){let x=L*7.31%1;const d=[];for(let i=0;i<46;i++){x=(x*9301+.4927)%1;const y=-.2+1.1*((i*.618)%1),s=x<.5?-1:1,w=sp.out(Math.max(-l38Lb(sp,s),y),s);d.push([s*w*(.15+.75*((x*2)%1)),y,.006+.006*x])}out.push({d,c:cw.dots,o:.85})}
  /* palmate veins from the petiole, sunken: dark lines, the silver forms feathered along them */
  const V=[[[0,0],[0,.5],[0,.97]]];for(const s of[-1,1]){V.push(l38Vein(sp,s,0,.7,.62,4),l38Vein(sp,s,0,.32,.92,4),l38Vein(sp,s,0,-.1,.85,3));if(s*m>0)V.push(l38Vein(sp,s,0,-.3,.6,3))}
  if(cw.vf)out.push(...V.map(l=>({l,w:f(Math.max(2,L*.05)),c:cw.vn,o:.35})));out.push(...V.map(l=>({l,w:f(Math.max(1.1,L*.012)),c:cw.vn,o:.85})));return out}
function l38Bego(g,t,o){const cw=fgCw(CW_L38BE,o),m=rnd()<.5?-1:1,sp=l38BeSp(m);
  return l38Plant(g,t,o,{cm0:16,pet:22,pc:'#8a3238',w0:3,w1:2.4,arch:R(-.16,.16),wig:.016,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.4*yg);
    l38Blade(og,L,cw.c,'#8a2a36',sp,{lim:og.lim,th0:-.42+.5*yg,ka:.45,lean:-m*R(.12,.3),droop:.06,fold:.16+(yg>.6?0:1.8*yg),cup:.14,tw:(rnd()<.5?-1:1)*R(.4,.6),wave:.04,nw:4,roll:yg>.6?yg*1.8:0,nv:30,across:.9,W:.5,gl:.25,shin:16,
      marks:l38BeMarks(sp,cw,L,m),marksB:[[[0,0],[0,.5],[0,.97]],...[-1,1].flatMap(s=>[l38Vein(sp,s,0,.7,.62,4),l38Vein(sp,s,0,.32,.92,4)])].map(l=>({l,w:Math.max(1.3,L*.016),c:'#b84a54',o:.9}))},parts)}})}

/* ---------- coleus (Plectranthus scutellarioides, syn. Solenostemon): square, succulent stems tinted like the leaves, opposite and decussate ovate leaves, crenate-toothed,
   on short petioles; painted in vivid zones: burgundy, lime, rose, copper, near black, often edged with another colour. The young tip folded ---------- */
const CW_L38CO=[{id:'wasabi',n:'Lime (Wasabi)',c:'#a8c43a',vn:'#c8dc6a',st:'#7a9a3a'},{id:'velvet-red',n:'Bordeaux bordé de lime (Wizard Velvet Red)',c:'#6a1a3a',z:[[.9,1.01,'#a8c43a']],vn:'#9a2a4a',st:'#5a2a32'},
  {id:'kong-rose',n:'Cœur rose, bord vert (Kong Rose)',c:'#d0507a',z:[[.42,.7,'#7a1a3a'],[.7,1.01,'#5a8a3a']],vn:'#e88aa8',st:'#7a4a3a',jz:1},{id:'rustic-orange',n:'Cuivre, liseré doré (Rustic Orange)',c:'#b0582a',z:[[.92,1.01,'#d8b03a']],vn:'#7a2a1a',st:'#7a3a22'},
  {id:'black-dragon',n:'Noir pourpré, cœur cramoisi (Black Dragon)',c:'#2a1420',z:[[0,.45,'#7a1430']],vn:'#8a1a3a',st:'#3a1a22',deep:1,jz:1},
  {id:'henna',n:'Chartreuse cuivré, revers bordeaux (Henna)',c:'#a88a2a',b:'#6a1a2a',vn:'#7a4a1a',st:'#6a3a22',deep:1},{id:'pineapple',n:'Jaune ananas, nervure bordeaux (Pineapple)',c:'#c8b83a',z:[[0,.2,'#7a1a2a']],vn:'#8a2a2a',st:'#7a6a2a'},
  {id:'chocolate-mint',n:'Chocolat bordé de vert (Chocolate Mint)',c:'#4a2a20',z:[[.82,1.01,'#6a9a3a']],vn:'#2a1a12',st:'#4a2a22',jz:1},
  {id:'mosaic',n:'Vert taché de bordeaux et crème (Wizard Mosaic)',c:'#5a8a3a',vn:'#3a6a2a',st:'#5a5a2a',sp:['#7a1a3a','#e8e0b0']}];
const L38_COL=prof([[0,.28],[.1,.7],[.3,1],[.55,.9],[.78,.52],[.94,.14],[1,0]]);
const l38CoSp=(deep)=>({lb:0,out:(y)=>.36*L38_COL(y)*l38Saw(y+.03,deep?9:11,deep?.2:.12)});
function l38CoMarks(sp,cw,L){const out=[],jit=cw.jz?(y=>.06*Math.sin(y*31)):null;
  for(const s of[-1,1]){for(const[k0,k1,c]of cw.z||[])out.push({p:l38Zone(sp,s,k0,k1,18,k0>0?jit:null,k1<1?jit:null),c,o:.95})}
  if(cw.sp){let x=L*3.17%1;for(const c of cw.sp){const d=[];for(let i=0;i<14;i++){x=(x*9301+.4927)%1;const y=.1+.8*((i*.618+x*.3)%1),w=sp.out(y,1);d.push([(x<.5?-1:1)*w*(.12+.7*((x*3)%1)),y,.03+.03*x])}out.push({d,c,o:.9})}}
  const V=[[[0,0],[0,.5],[0,.96]]];for(const s of[-1,1])for(const y0 of[.06,.24,.44,.62])V.push(l38Vein(sp,s,y0,y0+.22,.82,3));
  out.push(...V.map(l=>({l,w:f(Math.max(1.05,L*.012)),c:cw.vn,o:.8})));return out}
function l38Cole(g,t,o){const cw=fgCw(CW_L38CO,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=9,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):30*UPC*ks,
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),cols=l38Cols(cw.st),sp=l38CoSp(cw.deep),back=cw.b||mix(cw.c,'#e0dcc8',.3);
  const r=fgGrow(k,A,{li:4*UPC*kl,liT:.45,w0:4*kl,w1:1.6,cols,uL:o.spine?.32:.2,phy:'opp',la:58,face:.62,lift:.45,seg:10,wig:.012,
    leaf:(og,p)=>{const u=p.tip?1:p.u,young=p.tip?Math.min(1,.4+.8*(1-op)):0,sz=(p.tip?.42:fgSz(p,.74))*kl,L=cm0*UPC*sz*R(.9,1.06)*(1-.3*young),pl=L*.22,parts=[],
        P1=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.1,0]));
      l38Pet(og.pos,P1,Math.max(1.2,og.w*.5),Math.max(1.1,L*.03),cols,parts,{lite:1});
      l38Blade(Object.assign({},og,{pos:P1}),L,cw.c,back,sp,{th0:-.12+.5*young,ka:.4,droop:.14,fold:.18+.7*young,tw:R(-.4,.4),wave:.05,nw:3,roll:young*1.3,nv:26,nu:6,across:1,W:.36,
        marks:l38CoMarks(sp,cw,L),marksB:[{l:[[0,0],[0,.5],[0,.96]],w:Math.max(1.1,L*.014),c:shd(back,.25),o:.8}]},parts);return parts},
    /* the square stem: a lit face with a sharp edge along each axis */
    post:(res,parts)=>{for(const ch of res.chains){const n=ch.pts.length;for(let a=0;a<n-1;a+=5){const b=Math.min(n-1,a+6),P=[],W=[];let z=0;for(let i=a;i<=b;i++){const q=ch.pts[i];P.push([q[0],-q[1]]);W.push(ch.ws[i]);z+=q[2]}
      if(Math.max(...W)<1.6)continue;parts.push({z:z/(b-a+1)+.02,cast:false,ax:1,fn:par=>E('path',{d:polyRibbon(P,i=>W[i]*.2,i=>W[i]*.24),fill:shd(cw.st,.32),opacity:.75},par)})}}}});
  open(k,t,1000,0,.4);return r}

/* ---------- fancy-leaved caladium (Caladium × hortulanum, C. bicolor): a large cordate-sagittate blade, thin as paper and translucent, on a long slender petiole;
   white, pink, red or green, the veins standing out in green, red or rose, the margin often green, flecked in some ('Miss Muffet', 'Red Flash') ---------- */
const CW_L38CA=[{id:'white-christmas',n:'Blanc, nervures vertes (White Christmas)',c:'#f4f1ea',vn:'#4f7a3a',z:[[.96,1.01,'#5f8a3e']],vf:1,pc:'#8aa070'},
  {id:'candidum',n:'Blanc bordé de vert (Candidum)',c:'#eceee2',vn:'#4a7a3a',z:[[.82,1.01,'#5f8a3e']],jz:1,vf:1,pc:'#8aa070'},
  {id:'pink-beauty',n:'Rose, nervures rouges, bord vert (Pink Beauty)',c:'#e8a0b4',vn:'#c0304a',z:[[.8,1.01,'#5f8a3e']],jz:1,pc:'#a87a7a'},
  {id:'florida-sweetheart',n:'Rose soutenu, liseré vert (Florida Sweetheart)',c:'#dc7890',vn:'#a82a40',z:[[.93,1.01,'#4f7a3a']],pc:'#a87070'},
  {id:'red-flash',n:'Vert, cœur rouge moucheté de rose (Red Flash)',c:'#5f8a3e',vn:'#c0303e',z:[[0,.55,'#b8303e']],jz:1,dots:'#f0b8c8',pc:'#7a6a4a'},
  {id:'freida-hemple',n:'Rouge, bord vert (Freida Hemple)',c:'#c0303e',vn:'#8a1a2a',z:[[.84,1.01,'#4f7a3a']],jz:1,pc:'#8a4a4a'},
  {id:'miss-muffet',n:'Chartreuse moucheté de bordeaux (Miss Muffet)',c:'#c8d46a',vn:'#c8d46a',dots:'#8a1a2a',rib:'#8a1a2a',pc:'#a0a86a'},
  {id:'burgundy',n:'Bordeaux, bord vert (Red Belly)',c:'#6a1a2a',vn:'#a83040',z:[[.9,1.01,'#3f6a2e']],pc:'#6a3a34'}];
const L38_CAP=prof([[0,.32],[.06,.66],[.17,.92],[.3,1],[.5,.86],[.7,.6],[.86,.32],[.96,.08],[1,0]]);
const l38CaSp=()=>{const lb=.4,W=.47,xl=W*L38_CAP(0);return{lb,out:(y)=>W*L38_CAP((y+lb)/(1+lb)),inn:(y)=>xl*Math.pow(-y/lb,1.25)}};
function l38CaMarks(sp,cw,L,back){const out=[],jit=cw.jz?(y=>.045*Math.sin(y*37)+.025*Math.sin(y*83)):null,o=back?.55:1;
  for(const s of[-1,1])for(const[k0,k1,c]of cw.z||[])out.push({p:l38Zone(sp,s,k0,k1,24,k0>0?jit:null,k1<1?jit:null),c,o:.95*o});
  if(cw.dots&&!back){let x=L*5.71%1;const d=[];for(let i=0;i<40;i++){x=(x*9301+.4927)%1;const y=-.25+1.15*((i*.618)%1),s=x<.5?-1:1,w=sp.out(Math.max(-.4,y),s),xi=y<0?sp.inn(y,s):0;d.push([s*(xi+(w-xi)*(.12+.78*((x*2)%1))),y,.007+.008*x])}out.push({d,c:cw.dots,o:.9})}
  /* the veins: the midrib, the primaries out to the margin, the basal ones into the lobes, and a collective vein near the margin */
  const V=[[[0,0],[0,.5],[0,.97]]];for(const s of[-1,1]){for(const y0 of[.02,.18,.36,.56])V.push(l38Vein(sp,s,y0,y0+.24,.88,3));V.push(l38Vein(sp,s,0,-.34,.6,3),l38Vein(sp,s,0,-.18,.88,3))}
  const w=Math.max(1.15,L*.01);if(cw.vf&&!back)out.push(...V.map(l=>({l,w:f(w*3.2),c:cw.vn,o:.28})));out.push(...V.map(l=>({l,w:f(w),c:cw.vn,o:.9*o})));
  if(cw.rib)out.push({l:[[0,0],[0,.5],[0,.97]],w:f(w*1.5),c:cw.rib,o:.9*o});return out}
function l38Cala(g,t,o){const cw=fgCw(CW_L38CA,o),sp=l38CaSp();
  return l38Plant(g,t,o,{cm0:25,pet:40,pc:cw.pc,w0:2.8,w1:2.1,arch:R(-.16,.16),wig:.016,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.4*yg);
    l38Blade(og,L,cw.c,mix(cw.c,'#e8e4d0',.22),sp,{lim:og.lim,th0:-.3+.45*yg,ka:.7,lean:R(-.25,.25),droop:.1,fold:.14+(yg>.6?0:1.8*yg),cup:-.06,tw:(rnd()<.5?-1:1)*R(.4,.7),wave:.035,nw:4,roll:yg>.6?yg*1.9:0,nv:24,across:1,W:.4,op1:.93,
      marks:l38CaMarks(sp,cw,L,0),marksB:l38CaMarks(sp,cw,L,1)},parts)}})}

/* ---------- grapevine leaves (Vitis vinifera; V. coignetiae, V. 'Purpurea'): a cane with alternate leaves in two ranks on long petioles, each blade palmate, five-lobed,
   coarsely toothed, with a U-shaped petiolar sinus; branched tendrils coiling at their tips, opposite the leaves on two nodes of three; cut in summer green or in autumn,
   red, wine, copper or gold, the veins staying paler ---------- */
const CW_L38VI=[{id:'vert',n:'Vert (été)',c:'#4a6a2a',vn:'#8aa05a',st:'#6a5a34'},{id:'rouge',n:'Rouge automne',c:'#b0242a',vn:'#d8a04a',st:'#7a3a2a'},
  {id:'orange',n:'Orange cuivré',c:'#d0602a',vn:'#e8b84a',st:'#7a4a2a'},{id:'bordeaux',n:'Bordeaux (Purpurea)',c:'#8a1a3a',vn:'#5a1024',st:'#6a2a2a',b:'#b8a0a8'},
  {id:'or',n:'Or (vendanges)',c:'#d4a82a',vn:'#e8d47a',st:'#7a5a2a'},{id:'automne',n:'Vert rougissant (automne)',c:'#6a7a2a',vn:'#a8a84a',st:'#7a4a2a',z:[[.55,1.01,'#b0242a']]},
  {id:'pourpre-rouge',n:'Rouge sombre (coignetiae)',c:'#7a1a2a',vn:'#b04a3a',st:'#5a2a22'}];
const L38_VIL=prof([[0,.3],[.07,.5],[.15,.56],[.24,.48],[.29,.4],[.38,.58],[.48,.7],[.56,.42],[.61,.26],[.7,.34],[.82,.28],[.93,.1],[1,0]]);
const l38ViSp=()=>{const lb=.18;return{lb,out:(y)=>L38_VIL((y+lb)/(1+lb))*l38Saw(y+.02,24,.08),inn:(y)=>.3*Math.pow(-y/lb,1.6)}};
function l38ViMarks(sp,cw,L){const out=[],jit=y=>.07*Math.sin(y*23)+.04*Math.sin(y*61);
  for(const s of[-1,1])for(const[k0,k1,c]of cw.z||[])out.push({p:l38Zone(sp,s,k0,k1,30,jit,null),c,o:.9});
  /* five main veins from the petiole, one into each lobe, and their side veins */
  const V=[[[0,0],[0,.5],[0,.97]]];for(const s of[-1,1]){V.push([[0,0],[s*.3,.19],[s*.66,.38]],[[0,0],[s*.24,-.02],[s*.46,-.08]],[[0,.32],[s*.18,.5],[s*.28,.62]],[[s*.2,.13],[s*.36,.08],[s*.48,.18]],[[s*.4,.26],[s*.45,.46]])}
  out.push(...V.map(l=>({l,w:f(Math.max(1.1,L*.012)),c:cw.vn,o:.8})));return out}
/* a tendril: out along H, forked, each branch coiling at its tip */
function l38Tendril(og,len,c){const H=og.H,[X,Y]=fgCross(H),P0=og.pos,br=[],k0=V3.add(P0,V3.sc(H,len*.45)),pts0=[];for(let i=0;i<=4;i++)pts0.push(V3.add(P0,V3.add(V3.sc(H,len*.45*i/4),[0,len*.06*Math.sin(Math.PI*i/4),0])));
  for(const sg of[-1,1]){const d=V3.nz(V3.add(H,V3.sc(X,sg*.55))),pts=[k0],ph=R(0,6.28),rr=len*(sg>0?.09:.07),L2=len*(sg>0?.55:.4);
    for(let i=1;i<=22;i++){const t=i/22,c0=Math.max(0,(t-.35)/.65),r=rr*c0*(1-.45*c0),a=ph+sg*c0*12;pts.push(V3.add(V3.add(k0,V3.sc(d,L2*(t*.75+.25*Math.sqrt(t)))),V3.add(V3.sc(X,Math.cos(a)*r),V3.sc(Y,Math.sin(a)*r))))}br.push(pts)}
  const all=[pts0,...br],z=all.flat().reduce((a,p)=>a+p[2],0)/all.flat().length;
  return{z,cast:false,fn:par=>E('path',{d:all.map(P=>'M'+P.map(q=>f(q[0])+','+f(-q[1])).join('L')).join(''),stroke:c,'stroke-width':1.3,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}}
function l38Vigne(g,t,o){const cw=fgCw(CW_L38VI,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=12,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g),Lt=o.spine?blen(o.spine):45*UPC*ks,
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.14,.26)),cols=l38Cols(cw.st),sp=l38ViSp(),back=cw.b||mix(cw.c,'#d8d4bc',.4),tc=mix(cw.st,'#8a9a4a',.5);
  const r=fgGrow(k,A,{li:6*UPC*kl,liT:.4,w0:4.2*kl,w1:1.6,cols,uL:o.spine?.3:.16,phy:'alt2',la:50,face:.7,lift:.5,seg:12,wig:.03,rj:24,
    axil:{u0:.15,p:.62,ang:40},axDraw:(og)=>l38Tendril(og,cm0*UPC*kl*R(.6,.85),tc),
    leaf:(og,p)=>{const young=p.tip?Math.min(1,.45+.8*(1-op)):0,sz=(p.tip?.4:fgSz(p,.7))*kl,L=cm0*UPC*sz*R(.9,1.06)*(1-.25*young),pl=L*.55,parts=[],
        P1=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,-pl*.08,0]));
      l38Pet(og.pos,P1,Math.max(1.3,og.w*.45),Math.max(1.15,L*.022),l38Cols(mix(cw.st,cw.c,.4)),parts,{lite:1});
      l38Blade(Object.assign({},og,{pos:P1}),L,young?mix(cw.c,'#b08a4a',.3):cw.c,back,sp,{th0:-.18+.5*young,ka:.35,droop:.08,fold:.12+1.5*young,cup:.06,tw:R(-.4,.4),wave:.03,nw:4,nv:40,across:.9,W:.6,
        marks:l38ViMarks(sp,cw,L),marksB:[[[0,0],[0,.5],[0,.97]],[[0,0],[.3,.19],[.66,.38]],[[0,0],[-.3,.19],[-.66,.38]]].map(l=>({l,w:Math.max(1.1,L*.013),c:shd(back,.3),o:.85}))},parts);return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- registers ---------- */
Object.assign(GH,{'anthurium-cristal':l38Anth,'begonia-feuillage':l38Bego,'coleus':l38Cole,'caladium':l38Cala,'vigne-feuilles':l38Vigne});
Object.assign(CWS,{'anthurium-cristal':CW_L38AN,'begonia-feuillage':CW_L38BE,'coleus':CW_L38CO,'caladium':CW_L38CA,'vigne-feuilles':CW_L38VI});
/* commercial grades, in the recipe's unit: the length of the blade (coleus, vine: of the leaves of a stem of 30 and 45 cm) */
Object.assign(SZG,{'anthurium-cristal':[20,28,35],'begonia-feuillage':[12,16,20],'coleus':[6,9,12],'caladium':[20,25,30],'vigne-feuilles':[9,12,15]});
/* in a bouquet the composer lets the big leaves rise on their petioles behind the flowers: only the top of the spine, where the blade starts, must clear the lip (c4.js) */
for(const fn of[l38Anth,l38Bego])fn.bigLeaf={ext:14,k0:12};
/* the caladium's sagittate lobes hang far back below the petiole's top: it keeps more room above the lip */
l38Cala.bigLeaf={ext:30,k0:12};
