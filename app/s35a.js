/* ================= Serre, lot 35 — feuillages graphiques : échévéria (rosette piquée), pittosporum tenuifolium, cinéraire maritime, heuchère, agonis flexuosa ================= */
/* ---------- the lot's leaf in 3D: a blade given by its outline in its own plane (x across, y along the midrib, in leaf lengths; the right half from the base to the tip, the left half too),
   laid on a surface at P0 (midrib along H, upper face toward N): arched along the midrib, folded on it (a V), cupped, drooping under its weight, its margin waving, twisted, bent sideways (falcate).
   It is drawn as its two halves, each lit by its own normal (the fold reads as the midrib, edge-on the V keeps a width), the back with its own colour;
   a variegated blade paints its margin then its centre; veins in the leaf's own (x, y), on the face that shows ---------- */
function g35Surf(P0,H,N,len,o={}){const W0=V3.cr(N,H),ar=o.arch||0,fo=o.fold||0,cu=o.cup||0,dr=o.droop||0,tw=o.tw||0,wv=o.wave||0,wk=o.wk||5,wp=o.wph||0,bd=o.bend||0;
  return(x,y)=>{const a=tw*y,c=Math.cos(a),s=Math.sin(a),W=[W0[0]*c+N[0]*s,W0[1]*c+N[1]*s,W0[2]*c+N[2]*s],Nr=[N[0]*c-W0[0]*s,N[1]*c-W0[1]*s,N[2]*c-W0[2]*s],ax=Math.abs(x),
      h=ar*Math.sin(Math.PI*Math.max(0,y))+fo*ax+cu*x*x+(wv?wv*Math.sin(wk*Math.PI*y+wp+(x<0?1.7:0))*Math.min(1,ax*8):0),xs=x+bd*y*y;
    return[P0[0]+(H[0]*y+W[0]*xs+Nr[0]*h)*len,P0[1]+(H[1]*y+W[1]*xs+Nr[1]*h)*len-dr*len*y*y,P0[2]+(H[2]*y+W[2]*xs+Nr[2]*h)*len]}}
/* the normal of the surface at (x, y), toward its upper face */
const g35Nrm=(M,x,y)=>{const e=.02,n=V3.cr(V3s(M(x,y+e),M(x,y-e)),V3s(M(x+e,y),M(x-e,y)));return V3l(n)>1e-9?V3.nz(n):[0,0,1]};
const g35Q=p=>[p[0],-p[1]],g35D=P=>'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z';
/* outlines: a blade from a width profile (wp, its width ratio wr), its two halves alike */
function g35Prof(wp,wr,n=12){const R0=[];for(let i=0;i<=n;i++){const y=i/n;R0.push([wp(y)*wr/2,y])}R0[n]=[0,1];return{R:R0,L:R0.map(([x,y])=>[-x,y])}}
/* sh {R, L, mid (the midrib's points)}; c, cb the colours of the upper face and the back; o: surface, ink, sm (smooth outline), vr {c, k(y)} a variegated centre (k: its share of the half-width),
   veins [[x,y]…] and vAll (also at DET 1), vc vw vo, edge (a felted or pale margin), tip {c, from} the tip of the upper face flushed, dI (light) */
function g35Leaf(P0,H,N,len,sh,c,cb,o={}){const M=g35Surf(P0,H,N,len,o),det=DET>=1.5&&!LOD,P=pal7(c),PB=pal7(cb),mid=sh.mid||[[0,0],[0,.5],[0,1]];
  const half=side=>{const ol=sh[side],sg=side==='R'?1:-1;let cx=0,cy=0;for(const[x,y]of ol){cx+=x;cy+=y}cx=cx/ol.length*.6;cy/=ol.length;const n=g35Nrm(M,cx||sg*.05,cy),fr=n[2]>=0,
      pts=mid.map(([x,y])=>M(x,y)).concat(ol.slice().reverse().map(([x,y])=>M(x,y))),z=ol.reduce((a,[x,y])=>a+M(x,y)[2],0)/ol.length;
    return{ol,sg,n,fr,pts:pts.map(g35Q).filter((q,i,A)=>{const r=A[(i+1)%A.length];return Math.abs(q[0]-r[0])+Math.abs(q[1]-r[1])>1e-3}),z,I:lightI(fr?n:V3.sc(n,-1))+(o.dI||0)}};
  const hs=[half('L'),half('R')].sort((a,b)=>a.z-b.z),z=(hs[0].z+hs[1].z)/2,anyF=hs[0].fr||hs[1].fr;
  /* in a bouquet, a stem rising from the mouth keeps every leaf above it (nothing hangs behind the vessel) */
  if(o.lim!=null&&hs.some(h=>h.pts.some(q=>-q[1]<o.lim)))return(o.fk??1)>.7?g35Leaf(P0,H,N,len*.8,sh,c,cb,Object.assign({},o,{fk:(o.fk??1)*.8})):{z:0,cast:false,fn:()=>{}};
  return{z:z+(o.zb||0),cast:false,fn:par=>{const sm=o.sm?smooth:g35D;
    for(const h of hs){const col=toneAt(h.fr?P:PB,h.I);
      E('path',LOD?{d:sm(h.pts),fill:col}:{d:sm(h.pts),fill:col,stroke:o.edge||(h.fr?P:PB).ink,'stroke-width':o.ew||(det?.35:.42),'stroke-opacity':o.edge?.7:.34,'stroke-linejoin':'round'},par);
      /* the variegated centre (on the upper face only; the back shows the margin's colour through) */
      if(o.vr&&h.fr&&!LOD){const k=o.vr.k,ip=mid.map(([x,y])=>M(x,y)).concat(h.ol.slice().reverse().map(([x,y])=>M(x*k(y),y)));E('path',{d:sm(ip.map(g35Q)),fill:toneAt(pal7(o.vr.c),h.I)},par)}
      if(o.tip&&h.fr&&!LOD){const a=o.tip.from,tp=h.ol.filter(([x,y])=>y>=a),m0=M(0,a);if(tp.length>1)E('path',{d:sm([g35Q(m0)].concat(tp.map(([x,y])=>g35Q(M(x,y))),[g35Q(M(0,1))])),fill:toneAt(pal7(o.tip.c),h.I),opacity:o.tip.o??.8},par)}}
    if(!LOD&&(det||o.vAll)&&o.veins){let d='';for(const L of o.veins)d+='M'+L.map(([x,y])=>{const q=g35Q(M(x,y));return f(q[0])+','+f(q[1])}).join('L');
      E('path',{d,stroke:o.vc||(anyF?P.d1:PB.d1),'stroke-width':o.vw||.4,'stroke-opacity':o.vo??.42,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}
    else if(det)E('path',{d:'M'+mid.map(([x,y])=>{const q=g35Q(M(x,y));return f(q[0])+','+f(q[1])}).join('L'),stroke:anyF?P.l1:PB.d1,'stroke-width':.4,'stroke-opacity':.5,fill:'none'},par)
    if(o.gloss&&det&&anyF){const h=hs[1].fr?hs[1]:hs[0],sg=h.sg,A=[],B=[];for(let i=2;i<9;i++){const y=i/10;A.push(g35Q(M(sg*.1*g35Xw(sh,y),y)));B.push(g35Q(M(sg*.5*g35Xw(sh,y),y)))}E('path',{d:smooth(A.concat(B.reverse())),fill:'#ffffff',opacity:f(.2*o.gloss)},par)}}}}
/* the half-width of an outline at y */
const g35Xw=(sh,y)=>{let b=0;for(const[x,yy]of sh.R)if(Math.abs(yy-y)<.09)b=Math.max(b,x);return b};
/* a petiole: a curved stalk from a to b, sagging a little, as a part */
const g35Pet=(a,b,w,c,zb=-.05)=>{const p0=g35Q(a),p1=g35Q(b),m=[(p0[0]+p1[0])/2,(p0[1]+p1[1])/2+Math.hypot(p1[0]-p0[0],p1[1]-p0[1])*.06];
  return{z:(a[2]+b[2])/2+zb,cast:false,fn:par=>E('path',{d:`M${f(p0[0])},${f(p0[1])}Q${f(m[0])},${f(m[1])} ${f(p1[0])},${f(p1[1])}`,stroke:c,'stroke-width':f(w),fill:'none','stroke-linecap':'round'},par)}};
/* the lowest a leaf may reach: above the mouth for a stem rising from it, free for the top of a stem whose foot joins the stems, and on a sheet */
const g35Lim=o=>o.spine&&!(o.from>0)?3:null;
/* the leaf's own frame on a grown stem: its midrib along og.H, its face toward og.U (fgGrow turns it toward the front of the spray) */
const g35Fr=og=>({P0:og.pos,H:V3.nz(og.H),N:V3.nz(og.U)});
/* on a sheet the same plant from every side: its seed from the species, the colour, the size and the stage */
const g35Seed=(o,id)=>!o.spine&&!!o.ax&&o.roll===0?f15Hash(id+'|'+(o.col||'')+'|'+(o.cm||0)+'|'+Math.round((o.op??1)*20)):0;
function g35Run(o,id,fn){const s0=g35Seed(o,id),sv=seed;if(s0)seed=s0;try{return fn()}finally{if(s0)seed=sv}}

/* ---------- echeveria (Echeveria spp., Crassulaceae): a stemless rosette of fleshy spatulate leaves in a tight spiral (phyllotaxis 137.5°), the outer ones long and spread, the inner ones
   short, broad and erect round a closed bud; each leaf thick — a concave upper face over a rounded keel — ending in a short point, under a powdery bloom (pruina) that dulls it to blue-grey,
   mint or rose; some kinds flush red at the tips or along the margin. The florist sells the rosette wired or on a pick: a short fleshy stem prolonged by a green-taped pick ---------- */
const CW_G35ECH=[{id:'bleu-gris',n:'Bleu-gris poudré (E. secunda glauca)',c:'#8fa3a8',b:'#a7b8bc'},{id:'menthe',n:'Vert menthe (E. elegans)',c:'#9fc0a2',b:'#b8d2bc'},
  {id:'rose',n:'Rose poudré (Perle von Nürnberg)',c:'#d39aa6',b:'#c8a8b8',in:'#a8b0b8'},{id:'lilas',n:'Lilas nacré (Lola)',c:'#c4b2c0',b:'#cfc4cc',in:'#c0c8c4',tip:'#d89aa8'},
  {id:'vert-pointes-rouges',n:'Vert à pointes rouges (E. agavoides)',c:'#8fae6a',b:'#a4bc84',tip:'#b0303a'},{id:'pulidonis',n:'Vert pâle liseré rouge (E. pulidonis)',c:'#b4c6a2',b:'#c4d0b4',tip:'#c0404a',edge:1},
  {id:'noir',n:'Pourpre noir (Black Prince)',c:'#3a2a35',b:'#4a3640',in:'#5a4a40'},{id:'peche',n:'Pêche dorée (E. Orion)',c:'#d8b090',b:'#d8c0a8',in:'#b8c0a8'}];
const G35_ESP=prof([[0,.3],[.3,.56],[.56,.88],[.7,1],[.82,.82],[.92,.44],[1,0]]);
/* one fleshy leaf: from the rosette's local frame (B, the centre O); d its direction, N its upper face, len, its width ratio wr, th its thickness (× width) */
function g35EchLeaf(B,O,base,d,N,len,wr,th,c,cb,tip,edge,det){const W=V3.cr(N,d),hw=len*wr*.5,nv=det?9:6,U=[-1,-.5,0,.5,1],T=v=>th*hw*Math.min(1,v*3+.35)*(1-Math.pow(v,3));
  const up=(u,v)=>{const w=hw*G35_ESP(v);return V3.add(V3.add(V3.add(base,V3.sc(d,len*v)),V3.sc(W,u*w)),V3.sc(N,.18*w*u*u+len*(.04*Math.sin(Math.PI*v)+.14*v*v)))},
    lo=(u,v)=>V3.add(up(u,v),V3.sc(N,-T(v)*Math.sqrt(Math.max(0,1-u*u))*1.6)),V=p=>V3.add(O,toV(B,p));
  const rows=[],rowsU=[];let z=0;for(let i=0;i<=nv;i++){const v=i/nv,r=[],ru=[];for(const u of U){ru.push(V(up(u,v)));r.push(V(lo(u,v)))}r.push(ru[0],ru[4]);rows.push(r);rowsU.push(ru);z+=ru[2][2]}z/=nv+1;
  /* the silhouette, row by row the extreme points across the midrib (edge-on the keel gives the leaf its thickness) */
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=rowsU[Math.max(0,i-1)][2],b=rowsU[Math.min(nv,i+1)][2];let px=-(b[1]-a[1]),py=b[0]-a[0];const m=Math.hypot(px,py)||1;px/=m;py/=m;
    const cc=rowsU[i][2];let mn=1e9,mx=-1e9,pl=rows[i][0],pr=rows[i][0];for(const q of rows[i]){const s=(q[0]-cc[0])*px+(q[1]-cc[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push(g35Q(pl));Rt.push(g35Q(pr))}
  const sil=Lf.concat(Rt.slice(0,-1).reverse()),face=rowsU.map(r=>g35Q(r[0])).concat(rowsU.slice(0,-1).reverse().map(r=>g35Q(r[4]))),
    nU=V3.nz(toV(B,V3.cr(V3s(up(0,.6),up(0,.4)),V3s(up(.5,.5),up(-.5,.5))))),nL=V3.nz(toV(B,V3.cr(V3s(lo(.5,.5),lo(-.5,.5)),V3s(lo(0,.6),lo(0,.4))))),
    P=pal7(c),PB=pal7(cb),upV=nU[2]>.02,cU=toneAt(P,.62+(lightI(upV?nU:V3.sc(nU,-1))-.6)*.95),cL=toneAt(PB,lightI(nL[2]>=0?nL:V3.sc(nL,-1))*.92+.03),ti=V(up(0,1));
  return{z,cast:false,fn:par=>{E('path',{d:smooth(sil),fill:cL,stroke:PB.ink,'stroke-width':det?.32:.4,'stroke-opacity':.4,'stroke-linejoin':'round'},par);
    if(upV)E('path',{d:smooth(face),fill:cU,stroke:P.d1,'stroke-width':.3,'stroke-opacity':.35},par);
    /* the red point, or a red margin toward the tip */
    if(tip&&!LOD){const a=edge?.5:.84,q=[];for(let i=0;i<=nv;i++)if(i/nv>=a)q.push(g35Q(rowsU[i][edge&&upV?0:2]));const r=[];for(let i=nv;i>=0;i--)if(i/nv>=a)r.push(g35Q(rowsU[i][edge&&upV?4:2]));
      if(edge)E('path',{d:'M'+q.map(p=>f(p[0])+','+f(p[1])).join('L')+'M'+r.map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:tip,'stroke-width':det?.6:.8,'stroke-opacity':.8,fill:'none','stroke-linecap':'round'},par);
      if(upV){const tq=[[-1,.89],[-.8,.94],[-.5,.975]].map(([u,v])=>g35Q(V(up(u,v)))).concat([g35Q(ti)],[[.5,.975],[.8,.94],[1,.89]].map(([u,v])=>g35Q(V(up(u,v)))));E('path',{d:smooth(tq),fill:tip,opacity:.55},par)}}}}}
/* the rosette: n leaves from the outside in, longer and flatter outside; op closes it (a young rosette, its leaves erect) */
function g35Rosette(par,B,O,Dm,op,cw){const det=DET>=1.5&&!LOD,n=LOD?13:det?34:22,Ls=Dm*.52,parts=[],ph=R(0,6.283),cen=cw.in||cw.c;
  for(let i=0;i<n;i++){const t=i/(n-1),a=ph+i*137.508*D,len=Ls*(1-.66*Math.pow(t,1.05))*R(.94,1.05),el=(17+64*Math.pow(t,1.1)+(1-op)*30*(1-t))*D,
      d=[Math.cos(el)*Math.cos(a),Math.cos(el)*Math.sin(a),Math.sin(el)],N=[-Math.sin(el)*Math.cos(a),-Math.sin(el)*Math.sin(a),Math.cos(el)],base=[Math.cos(a)*Ls*.06*(1-t),Math.sin(a)*Ls*.06*(1-t),Ls*.2*t],
      c=mix(cw.c,cen,Math.pow(t,1.6)*.7),cb=mix(cw.b,cen,Math.pow(t,1.6)*.5);
    parts.push(g35EchLeaf(B,O,base,d,N,len,.36+.22*t,.42-.12*t,mix(c,shd(c,R(-.06,.06)),.5),cb,cw.tip&&t<.85?cw.tip:null,cw.edge,det))}
  drawParts(par,parts)}
const G35_ECHST=['#3e4a38','#66765c','#8a9a7e','#b8c4aa'];
function g35Ech(g,t,o){const cw=cwPick(CW_G35ECH,o),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||8)*UPC,k=G(g);
  const nk=g35Run(o,'ech',()=>lsHeadS(k,o,{D:Dm,w:Math.max(3,Dm*.07),op,cols:G35_ECHST,nodes:0,lp:.55,aimK:.4,wig:.01,e:0,flower:(par,B,P,D2,op2)=>g35Rosette(par,B,P,D2,op2,cw)}));
  open(k,t,1000,0,.4);return nk}

/* ---------- pittosporum (Pittosporum tenuifolium, kohuhu): slender black twigs, much branched; leaves alternate, crowded toward the tips of the shoots, oval to elliptic, 2–6 cm,
   glossy pale green, their margin undulate; cultivars: 'Silver Queen' (grey-green edged white), 'Variegatum' (cream margin), 'Tom Thumb' (purple-black, young leaves green),
   'Purpureum' (bronze-purple), 'Warnham Gold' (golden), 'Golf Ball' (bright green, rounder) ---------- */
const CW_G35PIT=[{id:'vert',n:'Vert brillant (type)',c:'#7aa158',g:'#6f9a4c'},{id:'golf-ball',n:'Vert tendre (Golf Ball)',c:'#8fb456',g:'#86ad4c',rd:1},
  {id:'silver-queen',n:'Panaché argent (Silver Queen)',c:'#a5b39a',g:'#7f9478',v:'#eef0e6'},{id:'variegatum',n:'Liseré crème (Variegatum)',c:'#d9d7b8',g:'#6e9050',v:'#ece4bc'},
  {id:'purpureum',n:'Pourpre bronze (Purpureum)',c:'#5a3a40',g:'#5a3a40',y:'#7a7a40'},{id:'tom-thumb',n:'Pourpre noir (Tom Thumb)',c:'#3a2028',g:'#3a2028',y:'#7a8a3a'},
  {id:'warnham-gold',n:'Doré (Warnham Gold)',c:'#c9b04a',g:'#c4ae48',y:'#b8c04a'}];
const G35_PITW=prof([[0,.2],[.1,.6],[.3,.94],[.48,1],[.7,.84],[.88,.48],[1,0]]),G35_PITR=prof([[0,.3],[.12,.74],[.35,.98],[.52,1],[.75,.84],[.9,.5],[1,0]]);
const G35_PITST=['#141012','#2a2622','#4a443e','#6e665c'];
function g35Pit(g,t,o){const cw=fgCw(CW_G35PIT,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=4,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'pit',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.22)),sh=g35Prof(cw.rd?G35_PITR:G35_PITW,cw.rd?.62:.46);
    const vr=cw.v?{c:cw.g,k:y=>.5+.08*Math.sin(y*9+1.3)}:null,lc=cw.v||cw.g;
    const r=fgGrow(k,A,{li:1.5*UPC*kl,liT:.45,w0:2.6*kl,w1:.7,cols:G35_PITST,uL:o.spine?.28:.24,phy:'spiral',la:48,face:.55,lift:.35,seg:9,wig:.05,
      side:{u0:.18,u1:.86,p:.55,len:.38,ang:44,li:.7,e:-.006,tilt:30},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.55:fgSz(p,.82))*(p.o?.84:1)*kl*(.8+.25*Math.min(1,u*1.6)),L=cm0*UPC*sz*R(.86,1.1),young=u>.82?(1-op)*.6+.25:0,
          c=cw.y&&young?mix(lc,cw.y,young):lc,cb=mix(cw.v?cw.v:cw.g,'#c8d0b0',.3),F=g35Fr(og),pl=L*.08,P0=V3.add(F.P0,V3.sc(F.H,pl));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.08,.08)),.5),cb,{lim:g35Lim(o),fold:.12,arch:.05,droop:.08,cup:.05,wave:.05,wk:4+R(0,2),wph:R(0,6),tw:R(-.3,.3),sm:1,vr,gloss:cw.v?.3:.9,dI:.02,
          veins:[[[0,0],[0,.97]]]}),...(DET>=1.5&&!LOD?[g35Pet(F.P0,P0,.6,G35_PITST[1])]:[])]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- silver ragwort (Jacobaea maritima, syn. Senecio cineraria, « cinéraire maritime »): a woody-based plant with stout white-felted stems; leaves alternate, pinnatifid,
   cut almost to the midrib into oblong lobes, themselves lobed again ('Silver Dust': lacy), or barely cut ('Cirrus': broad rounded lobes); thick, felted with white hairs on both faces,
   silver-white, a little greener on the oldest leaves and toward the centre ---------- */
const CW_G35JAC=[{id:'silver-dust',n:'Blanc argenté (Silver Dust)',c:'#d4d8d0',b:'#e4e6e0',sh:'dust'},{id:'argent',n:'Gris argent (Silver Dust)',c:'#b8bdb4',b:'#d0d4cc',sh:'dust'},
  {id:'cirrus',n:'Argent lumineux (Cirrus)',c:'#d9dcd6',b:'#e6e8e2',sh:'cirrus'},{id:'vert-de-gris',n:'Vert-de-gris (New Look)',c:'#9aa596',b:'#c4cabe',sh:'new'}];
/* the right half of a pinnatifid blade (x across, y along): a narrow wing on the midrib, n lobes cut to it, each with its lobules, a three-lobed end */
function g35JacHalf(kind){const n=kind==='cirrus'?5:kind==='new'?5:6,wg=kind==='cirrus'?.12:kind==='new'?.07:.035,out=[[0,0],[wg*.7,.03]];
  for(let j=0;j<n;j++){const q=j/(n-1),y0=.08+.74*q,Lj=(kind==='cirrus'?.17:kind==='new'?.3:.36)*(1-.5*q)*(.6+.4*Math.min(1,j/1.4))*R(.9,1.1),al=(62-26*q+R(-5,5))*D,dx=Math.sin(al),dy=Math.cos(al),
      bw=(kind==='cirrus'?.08:kind==='new'?.07:.05)*(1-.3*q),nl=kind==='dust'?3:kind==='new'?2:1,b=[wg,y0-bw*.9];
    out.push([wg*(kind==='dust'?.9:1),y0-bw*1.6]);
    /* the lower edge out to the tip, its lobules as bulges, then the upper edge back */
    const ph=R(0,.6),edge=sg=>{const pts=[],m=nl*3+2;for(let i=0;i<=m;i++){const t=.12+.88*i/m,bulge=1+(kind==='dust'?1.1:kind==='new'?.8:.25)*Math.pow(Math.max(0,Math.sin(Math.PI*(nl*t+ph+(sg>0?0:.5)))),1.5),w=bw*(1-.4*t)*bulge;pts.push([b[0]+dx*Lj*t+dy*w*sg,b[1]+dy*Lj*t-dx*w*sg])}return pts};
    const lo=edge(1),hi=edge(-1);out.push(...lo,[b[0]+dx*(Lj+bw*.7),b[1]+dy*(Lj+bw*.7)+bw*.2],...hi.reverse());out.push([wg,y0+bw*1.3])}
  out.push([wg*1.6+.04,.88],[.07,.93],[.035,.975],[0,1]);return out}
const G35_JACST=['#7a8076','#a8aea4','#d0d4cc','#eceee8'];
function g35Jac(g,t,o){const cw=fgCw(CW_G35JAC,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=10,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'jac',()=>{const Lt=o.spine?blen(o.spine):32*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.14));
    const shs=[0,1,2].map(()=>{const Rr=g35JacHalf(cw.sh),Lh=g35JacHalf(cw.sh).map(([x,y])=>[-x,y]);return{R:Rr,L:Lh,mid:[[0,0],[0,.35],[0,.7],[0,1]]}});
    const r=fgGrow(k,A,{li:1.7*UPC*kl,liT:.5,w0:4.4*kl,w1:1.8,cols:G35_JACST,uL:o.spine?.3:.12,phy:'spiral',la:50,face:.6,lift:.55,seg:10,wig:.025,
      side:{u0:.4,u1:.7,p:.18,len:.32,ang:36,li:.75,e:.004},
      leaf:(og,p)=>{const u=p.o?Math.min(1,p.u+.2):p.u,sz=(p.tip?.42:fgSz(p,.7))*(p.o?.75:1)*kl*(u<.25?.8+.8*u:1)*(u>.85?.75+.25*op:1),L=cm0*UPC*sz*R(.88,1.06),
          c=mix(cw.c,mix(cw.c,'#8a9886',.35),Math.max(0,.3-u)*1.6),F=g35Fr(og),pl=L*.14,P0=V3.add(F.P0,V3.add(V3.sc(F.H,pl),[0,-pl*.1,0])),sh=shs[Math.floor(rnd()*3)];
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.05,.05)),.5),cw.b,{lim:g35Lim(o),sm:1,fold:.13,arch:.06,droop:.14,cup:.06,tw:R(-.25,.25),edge:mix(cw.c,'#4a5448',.5),ew:.4,dI:.02,
          veins:DET>=1.5?[[[0,0],[0,.97]]]:null,vc:'#f2f2ee',vw:.55,vo:.55}),g35Pet(F.P0,V3.add(P0,V3.sc(F.H,L*.05)),Math.max(1.2,1.8*kl),G35_JACST[2])]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- heuchera (coral bells, hybrids of H. americana, micrantha, villosa): an evergreen basal rosette; leaves on long hairy petioles, the blade rounded and cordate,
   palmately five- to seven-lobed, the lobes shallow, the margin crenate-toothed, palmately veined; grown for their colours: purple ('Palace Purple', 'Obsidian'), caramel, lime,
   peach, red, silver washed between darker veins ('Silver Scrolls', 'Plum Pudding'); the underside often rosy or purple. The florist cuts single leaves with their petiole ---------- */
const CW_G35HEU=[{id:'palace-purple',n:'Pourpre (Palace Purple)',c:'#4a2236',b:'#6a3048'},{id:'caramel',n:'Caramel',c:'#b8763a',b:'#b05a4a'},
  {id:'lime',n:'Lime (Lime Marmalade)',c:'#b9c83e',b:'#c0c87a',vn:'#d8e070'},{id:'argent',n:'Argenté veiné (Silver Scrolls)',c:'#a8aca8',b:'#6a3a50',vn:'#4a2a3a',sv:1},
  {id:'obsidian',n:'Pourpre noir (Obsidian)',c:'#2a1820',b:'#3a2028'},{id:'peche',n:'Pêche (Georgia Peach)',c:'#d88a6a',b:'#a84a5a',sv:.5},
  {id:'marmalade',n:'Orange (Marmalade)',c:'#c8642e',b:'#9a2a3a'},{id:'rouge',n:'Rouge (Forever Red)',c:'#9e2232',b:'#6a1a2a'},{id:'prune',n:'Prune argentée (Plum Pudding)',c:'#6a3a58',b:'#5a2a40',sv:.6,vn:'#3a1a2a'}];
/* the right half of the blade: from the petiole in its basal sinus round the basal lobe to the tip; lobes every 50°, crenate teeth */
function g35HeuHalf(){const out=[[0,0]],c=[0,.48],nT=DET>=1.5&&!LOD?44:26,dp=R(.08,.13);for(let i=0;i<=nT;i++){const th=(176-176*i/nT)*D,lb=Math.pow(Math.sin(Math.PI*(th/D)/50),2),
    tooth=i%2?1:1.045,r=.52*(1-dp*lb)*tooth*R(.985,1.015);out.push([c[0]+Math.sin(th)*r*(th>2.2?1.06:1),c[1]+Math.cos(th)*r*(th>2.6?.9:1)])}out[out.length-1]=[0,1];return out}
const G35_HEUV=[0,45,95,140].flatMap(a=>{const P=[0,.25,.5,.75,1].map(t=>{const r=.44*t,b=(a-a*.35*(1-t))*D;return[Math.sin(b)*r,.02+(.44+Math.cos(b)*.42-.02)*t*(a?1:1)-(a?.06*Math.sin(Math.PI*t):0)]});return a?[P,P.map(([x,y])=>[-x,y])]:[P]});
function g35Heu(g,t,o){const cw=fgCw(CW_G35HEU,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=10,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'heu',()=>{const Lt=o.spine?blen(o.spine):17*UPC*(.75+.25*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),pc=mix(cw.b,'#5a4a30',.25),cols=[shd(pc,-.55),shd(pc,-.2),pc,shd(pc,.4)];
    const r=fgGrow(k,A,{li:Lt*4,liT:0,w0:2.6*kl,w1:2,cols,uL:2,seg:10,wig:.012,tipLv:0,
      tip:(og,p,Fr)=>{const L=cm0*1.15*UPC*kl*(.75+.25*op)*R(.94,1.05),H0=V3.nz(og.H);let N=V3s(Fr,V3.sc(H0,V3.dot(Fr,H0)));N=V3l(N)>1e-3?V3.nz(N):fgCross(H0)[0];
        /* the blade leans forward off its petiole (its face toward the front), a little cupped */
        const lean=R(8,22)*D,H=V3.nz(V3.add(V3.sc(H0,Math.cos(lean)),V3.sc(N,Math.sin(lean)))),N2=V3.nz(V3.add(V3.sc(N,Math.cos(lean)),V3.sc(H0,-Math.sin(lean)))),
          Rr=g35HeuHalf(),Lh=g35HeuHalf().map(([x,y])=>[-x,y]),sh={R:Rr,L:Lh,mid:[[0,0],[0,.5],[0,1]]},P0=V3.add(og.pos,V3.sc(H0,og.w*.3)),c=mix(cw.c,shd(cw.c,R(-.06,.06)),.5);
        const silver=cw.sv?{c:mix('#c8ccc8',cw.c,1-cw.sv*.9),k:y=>cw.sv>.9?.9:.96}:null;
        return[g35Leaf(P0,H,N2,L,sh,silver?cw.vn||shd(cw.c,-.3):c,cw.b,{lim:g35Lim(o),fold:0,arch:.05,droop:.05,cup:.3,wave:.035,wk:6,wph:R(0,6),tw:R(-.15,.15),vr:silver,
          veins:G35_HEUV,vAll:!!cw.sv,vc:cw.sv?cw.vn||shd(cw.c,-.45):cw.vn||(h2l(cw.c)[2]<.3?shd(cw.c,.35):shd(cw.c,-.3)),vw:cw.sv?(DET>=1.5?.8:.9):.5,vo:cw.sv?.7:.45,dI:.02,sm:1})]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- willow myrtle (Agonis flexuosa, Myrtaceae, « peppermint tree »): weeping, its long supple branchlets hanging from arching stems, finely zigzag;
   leaves alternate, narrowly lanceolate, often falcate, 5–15 cm, aromatic, the young growth coppery; 'Burgundy' deep red-purple, 'After Dark' almost black, the type green ---------- */
const CW_G35AGO=[{id:'burgundy',n:'Pourpre bordeaux (Burgundy)',c:'#4a1f2a',y:'#7a2a2a'},{id:'after-dark',n:'Pourpre noir (After Dark)',c:'#2a141c',y:'#5a1e24'},
  {id:'vert',n:'Vert (type)',c:'#4c7a35',y:'#9a6a3a'},{id:'bronze',n:'Vert bronze (pousses cuivrées)',c:'#7a5a30',y:'#a85a30'},{id:'panache',n:'Panaché doré (Lemon & Lime)',c:'#d4b030',g:'#5a7a30',v:'#dcc048',y:'#c89a40'}];
const G35_AGOW=prof([[0,.12],[.12,.6],[.3,.95],[.42,1],[.62,.8],[.84,.4],[1,0]]);
function g35Ago(g,t,o){const cw=fgCw(CW_G35AGO,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=10,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'ago',()=>{const Lt=o.spine?blen(o.spine):62*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.3,.44)),st=mix(cw.y,'#4a3020',.5),cols=[shd(st,-.6),shd(st,-.3),st,shd(st,.35)];
    const sh=g35Prof(G35_AGOW,.12,10),vr=cw.v?{c:cw.g,k:y=>.62}:null,lc=cw.v||cw.c;
    const r=fgGrow(k,A,{li:1.9*UPC*kl,liT:.35,w0:3*kl,w1:.75,cols,uL:o.spine?.3:.18,phy:'spiral',ph0:R(0,90),la:40,face:.45,lift:.15,seg:9,wig:.035,
      side:{u0:.2,u1:.85,p:.55,len:.55,ang:58,li:.9,e:-.075,tilt:30},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.5:fgSz(p,.8))*(p.o?.85:1)*kl,L=cm0*UPC*sz*R(.82,1.12),young=u>.8?.25+.5*(1-op):0,c=mix(lc,cw.y,young),F=g35Fr(og),
          P0=V3.add(F.P0,V3.sc(F.H,L*.04));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.1,.1)),.5),mix(cw.v?cw.g:c,'#8a7a60',.2),{lim:g35Lim(o),fold:.06,arch:.03,droop:.55,cup:.02,tw:R(-.6,.6),bend:R(-.05,.05),sm:1,vr,gloss:.6,
          veins:[[[0,0],[0,.97]]]})]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the rosette's diameter; for the foliage the leaf length), and how the composer treats them:
   the echeveria is a head (a rosette among the flowers); the four foliages stems of foliage along their spine, at their natural length ---------- */
Object.assign(GH,{'succulentes-echeveria':g35Ech,'pittosporum-tenuifolium':g35Pit,'jacobaea-maritima-cineraire':g35Jac,'heuchera':g35Heu,'agonis-flexuosa':g35Ago});
Object.assign(CWS,{'succulentes-echeveria':CW_G35ECH,'pittosporum-tenuifolium':CW_G35PIT,'jacobaea-maritima-cineraire':CW_G35JAC,'heuchera':CW_G35HEU,'agonis-flexuosa':CW_G35AGO});
Object.assign(SZG,{'succulentes-echeveria':[6,8,8,10,12],'pittosporum-tenuifolium':[3,4,4,5],'jacobaea-maritima-cineraire':[7,9,10,12],'heuchera':[7,9,10,12],'agonis-flexuosa':[7,9,10,12]});
const G35_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'succulentes-echeveria':{form:'rosette',size:2,k:'head',rk:1},'pittosporum-tenuifolium':G35_I(50,{fx:16}),'jacobaea-maritima-cineraire':G35_I(32,{fx:30}),
  'heuchera':G35_I(30,{fx:36}),'agonis-flexuosa':G35_I(60,{fx:22})});
