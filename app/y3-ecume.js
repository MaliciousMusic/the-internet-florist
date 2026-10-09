/* ================= y3-ecume.js : a froth of loose cymes, a pleated palmate leaf, water drops (lady's mantle; also gypsophila, sea lavender...) =================
   Three self-contained pieces (y1.js helpers only, no other y3-*.js):
   1. svEcGrow / svEcParts / svEcume: a cloud of loose cymes. Thin twigs fork several times (2 or 3 children, the fork's plane turned a quarter round
      at each order, spreading wider as the cloud opens, sagging as it ages); each tip, and some forks, carry a glomerule: a tight ball of tiny florets.
      Drawn far to near in a few depth bands; in each band one path per class: the twigs (by width), the glomerules' dark cores (circles), then the
      florets as round dots, one path per tone (bud, shade, body, lit, glint, brown) lit by their normal on the ball. Close up (DET >= 1.5) the florets
      that face the viewer are 4-pointed stars (4 sepals, 4 small epicalyx teeth between) with a yellow disc.
   2. svEcLeaf: a palmate, kidney-round leaf (7 to 11 shallow lobes, finely toothed), cupped, pleated like a fan with the veins in the valleys,
      silver-haired at its rim, on a hairy petiole; it droops, yellows and browns from the margin as it wilts.
   3. Water drops on that leaf: a big bead in the funnel, pearls in the vein valleys, small beads scattered, guttation pearls hanging from the teeth.
      Each a lens: its shadow cast on the blade (an ellipse in the blade's plane), a dark rim, a light centre (the blade seen through), a glint up-left.
   Space: view space (x right, y up, z toward the viewer); the screen is (x,-y). Sizes in drawing units; st.k scales the absolute ones (twigs, florets). */

/* ---------- colours: CIE LCh (D65) to #rrggbb, and a colour curve [[phase,L,C,h]...] read in Lab ---------- */
function svEcLch(L,C,h){const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180),fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,
    iv=t=>t>.206893?t*t*t:(t-16/116)/7.787,X=.95047*iv(fx),Y=iv(fy),Z=1.08883*iv(fz),g=v=>{v=v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055;return Math.max(0,Math.min(255,Math.round(v*255)))};
  const r=g(3.2406*X-1.5372*Y-.4986*Z),gg=g(-.9689*X+1.8758*Y+.0415*Z),bb=g(.0557*X-.204*Y+1.057*Z);return'#'+[r,gg,bb].map(v=>v.toString(16).padStart(2,'0')).join('')}
/* the curve at phase p; dl: lightness shift, kc: chroma factor, kl: lightness factor */
function svEcCurve(T,p,dl=0,kc=1,kl=1){p=Math.max(T[0][0],Math.min(T[T.length-1][0],p));let i=1;while(i<T.length-1&&p>T[i][0])i++;const A=T[i-1],Q=T[i],t=(p-A[0])/((Q[0]-A[0])||1),
    ab=q=>[q[2]*Math.cos(q[3]*Math.PI/180),q[2]*Math.sin(q[3]*Math.PI/180)],a0=ab(A),a1=ab(Q),L=(A[1]+(Q[1]-A[1])*t)*kl+dl,a=(a0[0]+(a1[0]-a0[0])*t)*kc,b=(a0[1]+(a1[1]-a0[1])*t)*kc;
  return svEcLch(Math.max(0,Math.min(100,L)),Math.hypot(a,b),Math.atan2(b,a)*180/Math.PI)}
/* the lightness of a curve at p */
function svEcCurveL(T,p){p=Math.max(T[0][0],Math.min(T[T.length-1][0],p));let i=1;while(i<T.length-1&&p>T[i][0])i++;const A=T[i-1],Q=T[i];return A[1]+(Q[1]-A[1])*(p-A[0])/((Q[0]-A[0])||1)}

/* ---------- 1. the cloud of cymes ----------
   depth: forks per branch; kids: [[children, weight]...]; spread: half-angle of a fork (deg) [bud, open]; lr, wr: length and width of a child
   (x its parent); wig: waver of a twig (x its length); lift: the open cloud's outer twigs turn up a little; sag: tip droop [open, decline, faded];
   grow: the reach [bud, open] (x the full reach); gR: glomerule radius (x reach) [bud, open]; gJ: its spread; lump: up to lump[0] smaller balls
   (lump[1] of its size) pressed on each glomerule, so a cluster is never a sphere (at most lump[2] drawn at DET 1: the geometry stays the same); forkP, forkG: a glomerule at a fork (probability, size);
   gCov: how densely the florets cover a ball [DET 1, DET 1.5] (a smaller ball carries fewer, at the same size: the florets of a species are all
   alike), gMax: at most so many on a ball; fR: floret radius (units x st.k) [bud, open] x [DET 1, DET 1.5]; open: when the florets open (spread of
   their thresholds, duration); shed: florets fall [start, duration] up to shedK; shrink: the ball shrinks as it dries; bands: depth bands
   [DET 1, DET 1.5]; twW: twig width at a branch's foot [DET 1, DET 1.5], twMin: the thinnest twig [DET 1, DET 1.5] (a twig thinner than a pixel
   at the shop's size breaks into floating bits); star: florets facing the viewer more than this (normal z) are stars close up.
   Hooks: phase(cwx,op,wl,o) -> colour phase; col(p,cwx,{dec,fan}) -> {deep,shade,body,lit,hi,bud,budS,brown,disc,tw,tw2} */
const SVEC_DEF={depth:3,kids:[[2,.55],[3,.45]],spread:[12,46],lr:.62,wr:.72,wig:.14,lift:.25,sag:[.1,.3,.55],grow:[.5,1],
  gR:[.036,.058],gJ:.3,lump:[2,.62,1],forkP:.8,forkG:.7,gCov:[.85,1.05],gMax:[18,56],fR:[[1.05,1.45],[.75,1.1]],open:[.65,.3],shed:[.55,.3],shedK:.45,shrink:.3,
  bands:[5,7],twW:[1.7,1.5],twMin:[1.05,.6],star:.3,phase:null,col:null};
const svEcSpec=S=>S._m||(S._m=Object.assign({},SVEC_DEF,S));
/* default colours from the colourway (a species gives col()) */
function svEcColDef(p,cwx){const c=cwx.c||'#c3c94b';return{deep:mix(c,'#2c3a18',.6),shade:mix(c,'#4a5a2a',.3),body:c,lit:mix(c,'#ffffff',.25),hi:mix(c,'#ffffff',.5),
  bud:mix(c,'#6f8a34',.5),budS:mix(c,'#3c5222',.5),brown:mix(c,'#8a6a44',.6),disc:mix(c,'#d8c030',.5),tw:'#7d9a3c',tw2:'#93ad4a'}}
/* the state of a cloud: its spec, opening and life, colour phase and colours */
function svEcState(S,op,wl,cwx,o){const P=svEcSpec(S),g=svSm((op-.02)/.75),dec=svSm((wl-.1)/.4),fan=svSm((wl-.5)/.3),
    shed=P.shedK*svSm((wl-P.shed[0])/P.shed[1]),p=P.phase?P.phase(cwx,op,wl,o||{}):.4;
  return{P,g,op,wl,dec,fan,shed,p,k:1,col:P.col?P.col(p,cwx,{dec,fan}):svEcColDef(p,cwx)}}
const svEcG=(c,d,r,age,rg)=>({c:V3.add(c,V3.sc(d,r*.5)),d,r,age,sd:(rg()*4294967295)>>>0,z:c[2]});
/* a glomerule and the smaller balls pressed on it (each a ball of its own, leaning out from the first) */
function svEcGl(cl,P,c,d,r,age,rg){const g0=svEcG(c,d,r,age,rg);cl.gl.push(g0);const nl=Math.floor(rg()*(P.lump[0]+.999));
  for(let i=0;i<nl;i++){const a=rg()*6.283,ux=V3.nz(V3.cr(d,Math.abs(d[2])<.9?[0,0,1]:[1,0,0])),uy=V3.cr(d,ux),dir=V3.nz(V3.add(V3.sc(d,.15+.5*rg()),V3.add(V3.sc(ux,Math.cos(a)),V3.sc(uy,Math.sin(a))))),
    r2=r*P.lump[1]*(.8+.4*rg()),g2=svEcG(V3.add(g0.c,V3.sc(dir,r*.78)),dir,r2,age+.05,rg);if(DET>=1.5||i<P.lump[2])cl.gl.push(g2)}}
/* one loose cyme into the cloud cl={tw:[],gl:[]}: from base along H (U: a direction across it), reaching about reach; rg the random source.
   o: {depth, w (foot width), age (0 the youngest), floor (view y: no twig ends lower)} */
function svEcGrow(cl,st,base,H,U,reach,rg,o={}){const P=st.P,hi=DET>=1.5?1:0,dep=o.depth??P.depth,g=st.g,spr=(P.spread[0]+(P.spread[1]-P.spread[0])*g)*Math.PI/180,
    sag=P.sag[0]*g+P.sag[1]*st.dec+P.sag[2]*st.fan,gr=P.grow[0]+(P.grow[1]-P.grow[0])*g;
  let tot=0;for(let k=0;k<=dep;k++)tot+=Math.pow(P.lr,k);
  const len0=reach*gr/tot,rG=reach*(P.gR[0]+(P.gR[1]-P.gR[0])*g)*(1-P.shrink*st.fan),wm=P.twMin[hi]*st.k,
    kidsN=()=>{let x=rg(),k=P.kids[0][0];for(const[n,wt]of P.kids){if(x<wt){k=n;break}x-=wt}return k};
  const br=(p,d,u,len,w,lev,age)=>{
    /* the twig leaves p along d, droops as it goes (the outer orders more, more as the cloud ages) and wavers */
    const out=1-lev/(dep+1),d1=V3.nz(V3.add(d,[0,-sag*(.35+.65*out),0])),sd=V3.nz(V3.cr(d1,u)),
      m=V3.add(p,V3.add(V3.sc(d,len*.5),V3.sc(sd,len*P.wig*(rg()-.5)))),e=V3.add(p,V3.add(V3.sc(d1,len),V3.sc(sd,len*P.wig*(rg()-.5)*.5))),dE=V3.nz(V3s(e,m));
    if(o.floor!=null){if(e[1]<o.floor)e[1]=o.floor;if(m[1]<o.floor)m[1]=o.floor}
    cl.tw.push({a:p,m,b:e,w:Math.max(wm,w),z:(p[2]+m[2]+e[2])/3});
    if(lev<=0){svEcGl(cl,P,e,dE,rG*(1-P.gJ/2+P.gJ*rg()),age,rg);return}
    if(rg()<P.forkP)svEcGl(cl,P,e,dE,rG*P.forkG*(.85+.3*rg()),age+.3,rg);
    /* the fork: its plane turned a quarter round from the parent's; with three children the middle one goes nearly straight on */
    const k=kidsN(),a0=rg()*.6-.3,u2=V3.nz(V3s(u,V3.sc(dE,V3.dot(u,dE)))),v2=V3.cr(dE,u2);
    for(let i=0;i<k;i++){const phi=a0+(k===2?i*Math.PI:i*2.094),a=spr*(.75+.5*rg())*(k===3&&i===0?.3:1),pl=V3.add(V3.sc(u2,Math.cos(phi)),V3.sc(v2,Math.sin(phi))),
        cd=V3.nz(V3.add(V3.add(V3.sc(dE,Math.cos(a)),V3.sc(pl,Math.sin(a))),[0,P.lift*g*out*.3,0]));
      br(e,cd,v2,len*P.lr*(.82+.36*rg()),w*P.wr,lev-1,age+.1+.06*rg())}};
  br(base,V3.nz(H),V3.nz(U),len0,(o.w??P.twW[hi])*st.k,dep,o.age||0)}
/* the extent of a cloud in view space [min x, max x, min y] (geometry only, as getBBox measures it: florets inside their ball's radius, stars a
   little beyond) */
function svEcExt(cl,st){const P=st.P,f=Math.max(P.fR[1][0],P.fR[1][1])*st.k*1.4;let x0=1e9,x1=-1e9,y0=1e9;
  for(const t of cl.tw)for(const p of[t.a,t.m,t.b]){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1])}
  for(const q of cl.gl){const e=q.r*1.05+f;x0=Math.min(x0,q.c[0]-e);x1=Math.max(x1,q.c[0]+e);y0=Math.min(y0,q.c[1]-e)}return[x0,x1,y0]}
/* the cloud into the painter's parts: depth bands, far to near */
function svEcParts(cl,st){const P=st.P,nb=P.bands[DET>=1.5?1:0],items=[];for(const t of cl.tw)items.push({z:t.z,t});for(const q of cl.gl)items.push({z:q.z,q});
  if(!items.length)return[];items.sort((a,b)=>a.z-b.z);const per=Math.max(1,Math.ceil(items.length/nb)),parts=[];
  for(let i=0;i<items.length;i+=per){const sl=items.slice(i,i+per);let z=0;for(const x of sl)z+=x.z;z/=sl.length;parts.push({z,cast:false,fn:par=>svEcBand(par,sl,st,cl)})}
  return parts}
/* round dots as path data: absolute first, then relative moves between rounded points (q: rounding step), each a zero-length stroke */
function svEcDots(P,q){let d='',px=0,py=0;for(let i=0;i<P.length;i++){const x=Math.round(P[i][0]/q)*q,y=Math.round(P[i][1]/q)*q;d+=(i?'m'+svJ([svR(x-px),svR(y-py)]):'M'+svJ([x,y]))+'h0';px=x;py=y}return d}
/* a circle as path data (screen) */
const svEcO=(x,y,r)=>{r=Math.max(.1,svR(r));return'M'+svJ([svR(x-r),svR(y)])+'a'+svJ([r,r])+' 0 1 0 '+svJ([2*r,0])+'a'+svJ([r,r])+' 0 1 0 '+svJ([-2*r,0])};
/* one depth band */
function svEcBand(par,sl,st,cl){const P=st.P,hi=DET>=1.5,C=st.col,lod=typeof LOD!=='undefined'&&LOD,S2=p=>[p[0],-p[1]],g=G(par),
    fRb=P.fR[0][hi?1:0]*st.k,fRo=P.fR[1][hi?1:0]*st.k,tw=[[],[],[]],ws=[0,0,0],nw=[0,0,0],wTop=P.twW[hi?1:0]*st.k;
  const cores=[],dots={bs:[],bb:[],s:[],b:[],l:[],h:[],r:[]},stars={s:'',b:'',l:'',h:'',r:''},disc=[];
  for(const it of sl){
    if(it.t){const t=it.t,a=S2(t.a),m=S2(t.m),b=S2(t.b),c=t.w>=wTop*.7?0:t.w>=wTop*.45?1:2;
      tw[c].push('M'+svJ([svR(a[0]),svR(a[1])])+'Q'+svJ([svR(m[0]),svR(m[1]),svR(b[0]),svR(b[1])]));ws[c]+=t.w;nw[c]++;continue}
    const q=it.q,r=q.r,dz=q.d,ux=V3.nz(V3.cr(dz,Math.abs(dz[2])<.9?[0,0,1]:[1,0,0])),uy=V3.cr(dz,ux),sc=S2(q.c);
    const n=Math.max(5,Math.min(P.gMax[hi?1:0],Math.round(4*Math.pow(r/fRo,2)*P.gCov[hi?1:0]*(lod?.5:1)*(.85+.3*pxHashS(1,2,q.sd))))),ph=pxHashS(3,4,q.sd)*6.283;
    cores.push([sc[0],sc[1],r*(hi?.66:.56)]);
    for(let i=0;i<n;i++){const y=1-2*(i+.5)/n;if(y<-.5)continue;const rr=Math.sqrt(Math.max(0,1-y*y)),a=i*2.39996+ph,
        nv=V3.add(V3.sc(dz,y),V3.add(V3.sc(ux,rr*Math.cos(a)),V3.sc(uy,rr*Math.sin(a))));if(nv[2]<-.2)continue;
      if(st.shed>0&&pxHashS(i,7,q.sd)<st.shed*(.7+.3*q.age))continue;
      const th=pxHashS(i,8,q.sd)*P.open[0]*(1-.4*q.age),op=svSm((st.g-th)/P.open[1]),pos=V3.add(q.c,V3.sc(nv,Math.min(r*(.9+.12*op),r*(hi?.66:.56)*.85+fRo*.85))),s=S2(pos),
        I=V3.dot(nv,LIGHT)+.12*nv[2],brown=st.dec>0&&pxHashS(i,9,q.sd)<st.dec*(.45+.35*q.age)+.25*st.fan;
      if(op<.5&&!brown){(I<.15?dots.bs:dots.bb).push([svR(s[0]),svR(s[1])]);continue}
      const tn=brown?'r':I<-.05?'s':I<.42?'b':I<.8?'l':'h';
      /* close up: a floret facing the viewer is a star of 4 sepals with 4 small teeth between, turned at random, and its yellow disc */
      if(hi&&nv[2]>P.star&&op>.6){const fr=fRo*(1.12+.22*pxHashS(i,10,q.sd)),t1=V3.nz(V3.cr(nv,Math.abs(nv[1])<.9?[0,1,0]:[1,0,0])),t2=V3.cr(nv,t1),a0=pxHashS(i,11,q.sd)*1.57;
        let d='',px=0,py=0;for(let k=0;k<16;k++){const ang=a0+k*Math.PI/8,rk=k%4===0?fr:k%2?fr*.36:fr*.62,v=V3.add(pos,V3.add(V3.sc(t1,Math.cos(ang)*rk),V3.sc(t2,Math.sin(ang)*rk))),x=svR(v[0]),yy=svR(-v[1]);
          d+=k?'l'+svJ([svR(x-px),svR(yy-py)]):'M'+svJ([x,yy]);px=x;py=yy}stars[tn]+=d+'z';if(!brown)disc.push([svR(s[0]),svR(s[1])]);continue}
      dots[tn].push([svR(s[0]),svR(s[1])])}}
  const sk=(c,w,op)=>({fill:'none',stroke:c,'stroke-width':svF(w),'stroke-linecap':'round','stroke-linejoin':'round','stroke-opacity':op??1});
  for(let c=0;c<3;c++)if(tw[c].length)E('path',Object.assign({d:tw[c].join('')},sk(c?C.tw2:C.tw,ws[c]/nw[c])),g);
  /* the cores: round dots in three sizes (cheaper than circles) */
  const rq=hi?.1:1;if(cores.length){cores.sort((a,b)=>a[2]-b[2]);const m=Math.ceil(cores.length/(hi?5:3));for(let i=0;i<cores.length;i+=m){const cs=cores.slice(i,i+m),w=cs.reduce((a,c)=>a+c[2],0)/cs.length*2;
    E('path',Object.assign({d:svEcDots(cs,rq)},sk(C.deep,w)),g)}}
  const dw={bs:fRb,bb:fRb,s:fRo,b:fRo,l:fRo*.95,h:fRo*.8,r:fRo*.9},dc={bs:C.budS,bb:C.bud,s:C.shade,b:C.body,l:C.lit,h:C.hi,r:C.brown};
  for(const k of['bs','bb','r','s','b','l','h'])if(dots[k].length)E('path',Object.assign({d:svEcDots(dots[k],rq)},sk(dc[k],dw[k]*2)),g);
  for(const k of['r','s','b','l','h'])if(stars[k])E('path',{d:stars[k],fill:dc[k],stroke:C.shade,'stroke-width':svF(fRo*.1),'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(disc.length)E('path',Object.assign({d:svEcDots(disc,rq)},sk(C.disc,fRo*.62)),g);
  return g}
/* a sprig drawn at once (a head of the grid sheet): B frame (B[2] along the sprig), O its centre (view space), D its size */
function svEcume(par,B,O,D,S,cwx,op,seed,wl,o={}){const st=svEcState(S,op,wl,cwx,o),rg=svRng(seed),cl={tw:[],gl:[]};st.k=o.k??D/(7*UPC);
  const base=V3.add(O,toV(B,[0,0,-D*.55])),H=toV(B,[0,0,1]),U=toV(B,[0,1,0]);svEcGrow(cl,st,base,H,U,D*(o.reach??.95),rg,{depth:o.depth});
  const k=G(par),parts=svEcParts(cl,st).sort((a,b)=>a.z-b.z);for(const p of parts)p.fn(k);return k}

/* ---------- 2. the palmate leaf ----------
   len: blade width; ax: the blade's length along its axis (x its width: a kidney under 1); n lobes; sin: depth of the sinuses between lobes (x radius), lp: their sharpness (a higher power: broader, rounder lobes);
   gap: the basal sinus (rad); bas: size of the two basal lobes; nt: teeth per lobe [DET 1, DET 1.5], td: their height (x radius);
   cup: the funnel; pleat: the fan folds (veins in the valleys); arch: the blade sags beyond its centre; droop: how far the petiole's slope
   is flattened; curl: the margin rolls down; wav: a slow wave of the margin; face: the normal pulled toward the viewer; tilt: at random about its axis;
   pet: petiole length (x len), petW: its width (x len), petA: its brown-pink tinge; drops: amount of water (0 none .. 1);
   colours: up/upL/upD the upper face (body, light, shade), low/lowL/lowD the silver-haired underside, vein, veinLow, hair (the rim),
   edge (dry margin), dry (dry blade), pc/pr the petiole, drop/dropR the drops' centre and rim; wl: wilt 0..1; sd: seed */
const SVEC_LEAF={len:60,ax:1,n:9,sin:.15,lp:2.6,gap:.34,bas:.88,nt:[6,10],td:[.034,.028],cup:.22,pleat:.075,arch:.18,droop:.4,curl:.05,wav:.012,face:.9,tilt:.35,
  pet:.8,petW:.028,petA:.15,drops:1,
  up:'#5c8f3c',upL:'#86b65e',upD:'#3c6522',low:'#93a681',lowL:'#c6d0b1',lowD:'#5e6f50',vein:'#a8c47c',veinLow:'#d3dcc2',hair:'#e8eedc',edge:'#8a6a3e',dry:'#9a9550',
  pc:'#6b891d',pr:'#a48968',drop:'#aac697',dropR:'#4b6a3a',wl:0,sd:1};
function svEcLeaf(par,pos,Hd,up,o){const P=Object.assign({},SVEC_LEAF,o);let R=P.len/2;const rg=svRng(P.sd),hi=DET>=1.5,k=G(par),wl=P.wl||0,dec=svSm((wl-.12)/.4),fan=svSm((wl-.45)/.4),
    n=P.n,thB=Math.PI-P.gap/2,Dl=2*thB/n,lz=[];for(let j=0;j<n;j++)lz.push((1+(rg()-.5)*.12)*(j===0||j===n-1?P.bas:1));
  /* frame: the blade's forward axis X (the petiole's direction, lowered toward the horizontal), its upper normal Z (turned toward the viewer), Y across */
  Hd=V3.nz(Hd);up=V3.nz(up);const el=Math.asin(Math.max(-1,Math.min(1,V3.dot(Hd,up)))),hz=V3s(Hd,V3.sc(up,V3.dot(Hd,up))),hl=V3l(hz)>1e-3?V3.sc(hz,1/V3l(hz)):V3.nz(V3.cr(up,[0,0,1])),
    e2=el*(1-P.droop)-.35*wl-.08;let X=V3.nz(V3.add(V3.sc(hl,Math.cos(e2)),V3.sc(up,Math.sin(e2))));
  /* the blade turned toward the viewer (face), whatever way it points (a blade pointing at the viewer would show its edge), and a little about
     its axis at random */
  let Z=V3.nz(V3s(up,V3.sc(X,V3.dot(up,X))));const Y0=V3.cr(Z,X),tl=(rg()-.5)*2*P.tilt;
  Z=V3.nz(V3.add(V3.add(Z,[0,0,P.face]),V3.sc(Y0,tl)));X=V3.nz(V3s(X,V3.sc(Z,V3.dot(X,Z))));const Y=V3.nz(V3.cr(Z,X)),S2=p=>[p[0],-p[1]];
  /* the petiole: up and out from pos, arching into the blade's centre (the sinus) */
  let pl=P.len*P.pet,b0=V3.add(pos,V3.add(V3.sc(Hd,pl*.72),V3.sc(X,pl*.32))),p1=V3.add(pos,V3.sc(Hd,pl*.62)),
    cup=P.cup*(1-.35*fan),pleat=P.pleat*(1+.7*fan),arch=P.arch+.3*wl,curl=P.curl+.22*fan,wv=rg()*6.28;
  /* the margin radius (x R) at angle th: lobes as broad rounded bumps; their size blends from lobe to lobe */
  const lobeAt=th=>{const f=(th+thB)/Dl,j=Math.max(0,Math.min(n-1,Math.floor(f))),phi=(f-j-.5)*2,c=f-.5,j0=Math.max(0,Math.min(n-1,Math.floor(c))),j1=Math.min(n-1,j0+1),
      t=svSm(Math.max(0,Math.min(1,c-j0))),s=lz[j0]+(lz[j1]-lz[j0])*t;return[(1-P.sin*Math.pow(Math.abs(phi),P.lp))*s,j,phi]};
  const at=(th,rho,rM)=>{const rr=rho*rM*R,x=rr*Math.cos(th)*P.ax,y=rr*Math.sin(th),phi=lobeAt(th)[2];
      const z=cup*R*rho*rho-pleat*R*rho*(.35+.65*rho)*Math.cos(Math.PI*phi)+P.wav*R*Math.pow(rho,3)*Math.sin(5*th+wv)-arch*R*Math.pow(Math.max(0,x)/R,2)-arch*.5*R*Math.pow(y/R,2)-curl*R*Math.pow(rho,6);
      return V3.add(b0,V3.add(V3.add(V3.sc(X,x),V3.sc(Y,y)),V3.sc(Z,z)))};
  const nAt=(th,rho)=>{const r=lobeAt(th)[0],a=at(th,rho,r),b=at(th+.03,rho,r),c=at(th,Math.min(1,rho+.04),r);return V3.nz(V3.cr(V3s(c,a),V3s(b,a)))};
  /* the outline: [th, rho (x margin radius), margin radius, is a tooth tip] from one side of the basal sinus round to the other */
  const nt=P.nt[hi?1:0],td=P.td[hi?1:0],out=[],tips=[];
  for(let j=0;j<n;j++){const tc=-thB+(j+.5)*Dl;
    /* the sinus bottom before the lobe, then its teeth across |phi| < .86, the next sinus is the following lobe's */
    const ta=tc-Dl*.43,tb=tc+Dl*.43;out.push([-thB+j*Dl+(j?0:.001),1,lobeAt(-thB+j*Dl+(j?0:.001))[0],0]);
    for(let t=0;t<nt;t++){const a=ta+(tb-ta)*t/nt,b=ta+(tb-ta)*(t+1)/nt,fw=(a+b)/2<tc?.66:.34,tp=a+(b-a)*fw,rm=lobeAt(tp)[0],h=td*(.75+.5*pxHashS(t,j,P.sd))/rm;
      out.push([a,1,lobeAt(a)[0],0]);if(hi)out.push([a+(tp-a)*.55,1+h*.62,lobeAt(a+(tp-a)*.55)[0],0]);out.push([tp,1+h,rm,1]);tips.push([tp,1+h,rm,j]);
      if(hi)out.push([tp+(b-tp)*.45,1+h*.5,lobeAt(tp+(b-tp)*.45)[0],0])}}
  out.push([thB-.001,1,lobeAt(thB-.001)[0],0]);
  /* box [x0,x1,y0] (view space): the leaf must stay inside it (the composer measures the whole stem's box against the vase's rim): if it would
     not, the leaf (blade and petiole) shrinks about its foot, the drops and hanging pearls kept inside by a margin */
  if(P.box){let x0=1e9,x1=-1e9,y0=1e9;for(const q of out){const v=at(q[0],q[1],q[2]);x0=Math.min(x0,v[0]);x1=Math.max(x1,v[0]);y0=Math.min(y0,v[1])}
    for(const v of[pos,p1,b0]){x0=Math.min(x0,v[0]);x1=Math.max(x1,v[0]);y0=Math.min(y0,v[1])}
    const m=R*.14,[bx0,bx1,by]=P.box;let s=1;if(x1+m>bx1)s=Math.min(s,(bx1-pos[0])/Math.max(1e-6,x1+m-pos[0]));if(x0-m<bx0)s=Math.min(s,(pos[0]-bx0)/Math.max(1e-6,pos[0]-x0+m));
    if(y0-m<by)s=Math.min(s,(pos[1]-by)/Math.max(1e-6,pos[1]-y0+m));if(s<1){s=Math.max(.05,s*.97);R*=s;pl*=s;b0=V3.add(pos,V3.add(V3.sc(Hd,pl*.72),V3.sc(X,pl*.32)));p1=V3.add(pos,V3.sc(Hd,pl*.62))}}
  const O2=out.map(q=>S2(at(q[0],q[1],q[2]))),c2=S2(b0);
  /* which face shows, and how lit (the normal near the middle of the blade) */
  const nc=nAt(0,.45),front=nc[2]>=0,I0=Math.max(0,V3.dot(front?nc:V3.sc(nc,-1),LIGHT)),yel=c=>dec>0?mix(c,P.dry,.55*dec):c,
    base=yel(front?mix(P.upD,P.upL,.2+.65*I0):mix(P.lowD,P.lowL,.3+.55*I0));
  /* the petiole, hairy (close up: a fringe of silver hairs) */
  const pa=S2(pos),pm=S2(p1),pw=Math.max(hi?.6:1.05,P.len*P.petW*(1-.15*wl));
  E('path',{d:'M'+svJ([svR(pa[0]),svR(pa[1])])+'Q'+svJ([svR(pm[0]),svR(pm[1]),svR(c2[0]),svR(c2[1])]),fill:'none',stroke:yel(mix(P.pc,P.pr,P.petA)),'stroke-width':svF(pw),'stroke-linecap':'round'},k);
  if(hi){let dh='';for(let i=1;i<14;i++){const t=i/14,x=(1-t)*(1-t)*pa[0]+2*(1-t)*t*pm[0]+t*t*c2[0],y=(1-t)*(1-t)*pa[1]+2*(1-t)*t*pm[1]+t*t*c2[1],
      dx=2*(1-t)*(pm[0]-pa[0])+2*t*(c2[0]-pm[0]),dy=2*(1-t)*(pm[1]-pa[1])+2*t*(c2[1]-pm[1]),l=Math.hypot(dx,dy)||1,s=i%2?1:-1,hx=-dy/l*s,hy=dx/l*s;
      dh+='M'+svJ([svR(x+hx*pw*.45),svR(y+hy*pw*.45)])+'l'+svJ([svR(hx*pw*.7+dx/l*pw*.5),svR(hy*pw*.7+dy/l*pw*.5)])}
    E('path',{d:dh,fill:'none',stroke:P.hair,'stroke-width':svF(pw*.18),'stroke-opacity':.7,'stroke-linecap':'round'},k)}
  /* the blade, its silver-haired rim as its stroke */
  let d='M'+svJ([svR(c2[0]),svR(c2[1])]),cx=svR(c2[0]),cy=svR(c2[1]);for(const p of O2){const x=svR(p[0]),y=svR(p[1]);if(x===cx&&y===cy)continue;d+='l'+svJ([svR(x-cx),svR(y-cy)]);cx=x;cy=y}d+='z';
  E('path',{d,fill:base,stroke:front?mix(P.hair,base,.25+.5*dec):P.lowL,'stroke-width':svF(Math.max(hi?.3:.45,R*.022)),'stroke-opacity':svF(.85-.3*fan),'stroke-linejoin':'round'},k);
  /* the fan folds: each lobe's half turned from the light shaded, the other lit (smooth margin, a little inside the teeth) */
  let dsh='',dli='';const half=(th0,th1)=>{const m=Math.max(3,Math.round(Math.abs(th1-th0)/(hi?.05:.09))),pts=[c2];for(let i=0;i<=m;i++){const th=th0+(th1-th0)*i/m;pts.push(S2(at(th,.985,lobeAt(th)[0])))}
      let s='M'+svJ([svR(pts[0][0]),svR(pts[0][1])]),x=svR(pts[0][0]),y=svR(pts[0][1]);for(let i=1;i<pts.length;i++){const a=svR(pts[i][0]),b=svR(pts[i][1]);s+='l'+svJ([svR(a-x),svR(b-y)]);x=a;y=b}return s+'z'};
  for(let j=0;j<n;j++){const tc=-thB+(j+.5)*Dl,I=[-1,1].map(s=>{const nn=nAt(tc+s*Dl*.25,.6);return V3.dot(front?nn:V3.sc(nn,-1),LIGHT)});
    const dk=I[0]<I[1]?-1:1;dsh+=half(tc,tc+dk*Dl/2);if(Math.abs(I[0]-I[1])>.04)dli+=half(tc,tc-dk*Dl/2)}
  if(dsh)E('path',{d:dsh,fill:yel(front?P.upD:P.lowD),'fill-opacity':svF(front?.42:.3)},k);
  if(dli&&front)E('path',{d:dli,fill:yel(P.upL),'fill-opacity':.22},k);
  /* the veins: one in each lobe's valley from the centre nearly to its tip (close up: side veins running toward the teeth) */
  let dv='',ds='';for(let j=0;j<n;j++){const tc=-thB+(j+.5)*Dl,r=lobeAt(tc)[0];dv+=svQuad([0,.3,.6,.9].map(t=>S2(at(tc,t,r))));
    if(hi)for(const t of[.32,.52,.7])for(const s of[-1,1]){const e=tc+s*Dl*.36,re=lobeAt(e)[0];ds+=svQuad([S2(at(tc,t,r)),S2(at(tc+s*Dl*.2,t+.14,lobeAt(tc+s*Dl*.2)[0])),S2(at(e,Math.min(.95,t+.26),re))])}}
  E('path',{d:dv,fill:'none',stroke:yel(front?P.vein:P.veinLow),'stroke-width':svF(Math.max(hi?.3:.5,R*.022)),'stroke-opacity':front?.55:.7,'stroke-linecap':'round'},k);
  if(ds)E('path',{d:ds,fill:'none',stroke:yel(front?P.vein:P.veinLow),'stroke-width':svF(Math.max(.2,R*.009)),'stroke-opacity':front?.4:.5,'stroke-linecap':'round'},k);
  /* close up: the silky hairs of the rim, a few at each tooth */
  if(hi){let dh='';for(const t of tips){const a=at(t[0],t[1],t[2]),b=at(t[0],t[1]+.035,t[2]),A=S2(a),Bq=S2(b);for(const s of[-1,1])dh+='M'+svJ([svR(A[0]),svR(A[1])])+'l'+svJ([svR((Bq[0]-A[0])*1.2-s*(Bq[1]-A[1])*.5),svR((Bq[1]-A[1])*1.2+s*(Bq[0]-A[0])*.5)])}
    E('path',{d:dh,fill:'none',stroke:P.hair,'stroke-width':svF(Math.max(.15,R*.006)),'stroke-opacity':.75,'stroke-linecap':'round'},k)}
  /* the dry margin: a brown band from the edge inward as the leaf wilts */
  const bw=.05+.14*fan;if(wl>.3){let dd='';const m=hi?160:90;for(let i=0;i<=m;i++){const th=-thB+2*thB*i/m,p=S2(at(th,1.01,lobeAt(th)[0]));dd+=(i?'L':'M')+svJ([svR(p[0]),svR(p[1])])}
    for(let i=m;i>=0;i--){const th=-thB+2*thB*i/m,p=S2(at(th,1-bw*(.7+.6*pxHashS(i>>3,5,P.sd)),lobeAt(th)[0]));dd+='L'+svJ([svR(p[0]),svR(p[1])])}
    E('path',{d:dd+'z',fill:P.edge,'fill-opacity':svF(.85*svSm((wl-.3)/.3))},k)}
  /* the drops (upper face only; they dry up as the bouquet ages) */
  if(front&&P.drops>0)svEcDrops(k,P,{at,lobeAt,tips,thB,Dl,n,R,X,Y,Z,rg,hi,base,amt:P.drops*(1-svSm((wl-.12)/.3))});
  return k}
/* ---------- 3. water drops on the leaf ---------- */
function svEcDrops(k,P,L){const{at,lobeAt,tips,thB,Dl,n,R,X,Y,Z,rg,hi,amt}=L;if(amt<=.02)return;const S2=p=>[p[0],-p[1]],dr=[];
  /* a big bead in the funnel, pearls in the vein valleys, small beads scattered, guttation pearls hanging from the teeth (sizes x the blade's width) */
  if(rg()<.8*amt)dr.push([(rg()-.5)*1.8*thB,.04+.06*rg(),R*2*(1/18+rg()*.012),0]);
  for(let j=0;j<n;j++)if(rg()<.4*amt){const tc=-thB+(j+.5)*Dl;dr.push([tc+(rg()-.5)*.12,.35+.4*rg(),R*2*(1/30+rg()*.01),0])}
  const ns=Math.round((hi?24:9)*amt);for(let i=0;i<ns;i++)dr.push([-thB+2*thB*(.03+.94*rg()),.15+.75*rg(),R*2*(1/55+rg()*.006),0]);
  const pt=(hi?.3:.16)*amt;for(const t of tips)if(rg()<pt)dr.push([t[0],t[1],R*2*(1/45+rg()*.008),1,t[2]]);
  let dS='',dB='',dL='',dH='',dC='';const sh=V3s(LIGHT,V3.sc(Z,V3.dot(LIGHT,Z)));const shl=V3l(sh)||1;
  for(const q of dr){const r=q[2],rM=q[3]?q[4]:lobeAt(q[0])[0],s0=at(q[0],q[1],rM),c=q[3]?V3.add(s0,[0,-r*.45,0]):V3.add(s0,V3.sc(Z,r*.72)),s=S2(c);
    if(!q[3]){/* the shadow: a circle in the blade's plane, pushed away from the light, as an ellipse (4 cubic arcs) */
      const o=V3.add(s0,V3.sc(sh,-r*.55/shl)),A=S2(o),m1=V3.sc(X,r*1.05),m2=V3.sc(Y,r*1.05),u=[m1[0],-m1[1]],v=[m2[0],-m2[1]],K=.5523,P0=[A[0]+u[0],A[1]+u[1]];
      const pts=[[u,v],[v,[-u[0],-u[1]]],[[-u[0],-u[1]],[-v[0],-v[1]]],[[-v[0],-v[1]],u]];dS+='M'+svJ([svR(P0[0]),svR(P0[1])]);
      for(const[a,b]of pts)dS+='C'+svJ([svR(A[0]+a[0]+K*b[0]),svR(A[1]+a[1]+K*b[1]),svR(A[0]+b[0]+K*a[0]),svR(A[1]+b[1]+K*a[1]),svR(A[0]+b[0]),svR(A[1]+b[1])])}
    dB+=svEcO(s[0],s[1],r);dL+=svEcO(s[0]+r*.1,s[1]+r*.13,r*.7);dH+=svEcO(s[0]-r*.36,s[1]-r*.38,r*.2);
    if(hi)dC+='M'+svJ([svR(s[0]-r*.45),svR(s[1]+r*.38)])+'q'+svJ([svR(r*.45),svR(r*.3),svR(r*.88),svR(-r*.1)])}
  if(dS)E('path',{d:dS,fill:P.upD,'fill-opacity':.38},k);
  E('path',{d:dB,fill:mix(P.dropR,L.base,.2)},k);E('path',{d:dL,fill:mix(P.drop,L.base,.15)},k);
  if(dC)E('path',{d:dC,fill:'none',stroke:'#e4f0d6','stroke-width':svF(R*.006),'stroke-opacity':.55,'stroke-linecap':'round'},k);
  E('path',{d:dH,fill:'#ffffff','fill-opacity':.92},k)}
