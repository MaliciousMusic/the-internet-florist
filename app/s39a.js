/* ================= Serre, lot 39 — Branches feuillées et bois, poussées par le L-système : hêtre, chêne et glands, bouleau, sarments de vigne, tamaris ================= */
/* ---------- the branch engine: a cut woody branch grown by the L-system — its main axis (along the composer's spine in a bouquet, standing in the view on a sheet or a card),
   its nodes (each one an organ Nd: buds, leaf scars, acorns, tendrils, catkins), side shoots with their own nodes, leaves as curved 3D blades, the bark drawn with its texture;
   like the foliages of lot 15 it hands back {k, bw, bw1, bc}. The rules:
     A(i)  → F…F Nd(i) [ /φᵢ &α Lv ]… [ /φ' &β B(n) ] A(i+1)        A(nN) → F…F Ap
     B(n)  → F Nd [ /φ &α Lv ]… (zig) B(n−1)                          B(0) → F Ap
   S: id, len (cm), leafy, inter [base, tip] (cm), nl (leaves per node), div (phyllotaxis), ph0 (the first roll, distichous twigs), ang [base, tip], w0, w1, cols, e, wig, zig,
      br {zone, p, max, gap, n, li (cm), ang, eb, ls, wk}, leaf(og, lim) → parts, node(og, lim) → parts, apex(og, lim) → parts, bark(chains, parts, sp) (else plain ribbons) ---------- */
function l39Sprig(g,t,o,S){const k=G(g),parts=[],sp=o.spine,fr=sp?Math.max(0,Math.min(.92,o.from||0)):0,op=Math.max(.05,Math.min(1,o.op??1)),sv=seed;
  const rs=!sp&&!!o.ax&&o.roll===0;if(rs)seed=f15Hash(S.id+'|'+(o.cm||0)+'|'+Math.round(op*20));
  let P0=[0,0,0],H0,U0,Lt,pts=null,cum=null,af=0;
  if(sp){af=fr>0?blen(bseg(sp,0,fr)):0;const N=48;pts=[];for(let i=0;i<=N;i++){const q=bz(sp,fr+(1-fr)*i/N);pts.push([q[0],-q[1],0])}cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));Lt=cum[N];P0=pts[0];H0=V3.nz(V3s(pts[1],pts[0]));U0=[0,0,1]}
  else{const B=frameOf(o,0),U=toV(B,[0,0,1]);Lt=(o.cm>(S.cmMin||15)?o.cm:S.len)*UPC*(.9+.1*op);H0=rotA(toV(B,[0,1,0]),U,R(-.05,.05));U0=U}
  const at=a=>{let i=1;while(i<cum.length-1&&cum[i]<a)i++;const t2=Math.max(0,Math.min(1,(a-cum[i-1])/((cum[i]-cum[i-1])||1)));return V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t2))};
  /* where the nodes start: above the mouth for a stem rising from it, at once for the top of a stem whose foot joins the bouquet's stems, above the bare foot on a sheet */
  const a0=sp?(fr>0?Lt*.04:Math.max(Lt*(1-S.leafy),Lt*.17)):Lt*(1-S.leafy),nodes=[];
  for(let a=a0;a<Lt-UPC*(S.tip??1);){nodes.push(a);const q=(a-a0)/Math.max(1,Lt-a0);a+=UPC*(S.inter[0]+(S.inter[1]-S.inter[0])*q)*R(.86,1.14)}
  const nN=nodes.length,qOf=i=>nN>1?i/(nN-1):1,wAt=a=>S.w1+(S.w0-S.w1)*Math.pow(Math.max(0,1-(af+a)/(af+Lt)),S.wp??.85),w0=wAt(0);
  const chord=(a,b)=>{if(!sp)return[['F',{l:Math.max(.5,b-a),w1:wAt(b),e:S.e??0}]];const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+8),p=at(x),q=at(y),d=V3s(q,p),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  const br=S.br,brAt=new Map();if(br){let c=0;for(let i=0;i<nN&&c<br.max;i++){const q=qOf(i);if(q>=br.zone[0]&&q<=br.zone[1]&&rnd()<br.p){brAt.set(i,c++);i+=br.gap||0}}}
  const ph0=S.ph0??R(0,360),angAt=q=>S.ang[0]+(S.ang[1]-S.ang[0])*q,nl=S.nl??1,div=S.div||137.5;
  const leaves=(i,q,s,ph,ang,b)=>{const out=[];for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:ph+j*360/Math.max(1,nl)+R(-9,9)}],['&',{a:ang+R(-7,7)}],['Lv',{i,j,q,s,b,ph}],[']',{}]);return out};
  const rules={A:p=>{const i=p.i;if(i>=nN)return[...chord(nN?nodes[nN-1]:0,Lt),['Ap',{q:1,b:0}]];const zg=S.zig&&!sp?[['+',{a:(i%2?1:-1)*S.zig}]]:[];if(S.twist&&!sp)zg.push(['/',{a:R(-S.twist,S.twist)}]);return[...chord(i?nodes[i-1]:0,nodes[i]),['N',{i}],...zg,['A',{i:i+1}]]},
    N:p=>{const i=p.i,q=qOf(i),ph=ph0+i*div+R(-8,8),out=[['Nd',{i,q,b:0,ph,s:i%2?1:-1,br:brAt.has(i)?1:0}],...leaves(i,q,1,ph,angAt(q),0)];
      if(brAt.has(i)){const c=brAt.get(i),n=Math.round(R(br.n[0],br.n[1])*(1-.35*q)),li=br.li*UPC,wb=Math.max(S.w1,wAt(nodes[i])*(br.wk||.55));
        if(n>0)out.push(['[',{w:wb}],['/',{a:ph+(br.dph??70)+(c%2?180:0)+R(-25,25)}],['&',{a:br.ang+R(-8,8)}],['B',{n,n0:n,li,q,w:wb,c}],[']',{}])}
      return out},
    B:p=>{if(p.n<=0)return[['F',{l:p.li*.55,w1:S.w1*.8,e:br.eb}],['Ap',{q:1,b:1,c:p.c}]];const qb=1-p.n/p.n0,ph=(S.bph??R(0,360))+p.n*div;
      return[['F',{l:p.li*R(.85,1.15)*(1-.3*qb),w1:Math.max(S.w1*.85,p.w*(1-.6*qb)),e:br.eb}],['Nd',{q:Math.min(1,p.q+.5*qb),b:1,qb,ph,s:p.n%2?1:-1,c:p.c}],
        ...leaves(-1,Math.min(1,p.q+.5*qb),br.ls||.85,ph,angAt(Math.min(1,p.q+.4+.4*qb)),1),...(S.zig?[['+',{a:(p.n%2?1:-1)*S.zig}]]:[]),['B',Object.assign({},p,{n:p.n-1})]]}};
  const mods=lsDerive([['A',{i:0}]],rules,nN+(br?br.n[1]:0)+4),res=lsTurtle(mods,{p:P0,H:H0,U:U0,w:w0,T:[0,1,0],e:0,wig:S.wig||0,seg:7});
  for(const ch of res.chains)ch.c=S.cols;
  /* in a bouquet, a stem rising from the mouth keeps every leaf and side shoot above it (nothing hangs behind the vessel) */
  const lim=sp&&fr===0?-3:null;if(lim!=null)for(const ch of res.chains)if(ch.ord)for(const q of ch.pts)q[1]=Math.max(q[1],-lim+(S.clr||0));
  if(lim!=null)for(const og of res.organs)if(og.ord)og.pos[1]=Math.max(og.pos[1],-lim+(S.clr||0));
  for(const og of res.organs){const pp=og.t==='Lv'&&S.leaf?S.leaf(og,lim,U0):og.t==='Ap'&&S.apex?S.apex(og,lim,U0):og.t==='Nd'&&S.node?S.node(og,lim,U0):null;if(pp)parts.push(...pp)}
  if(S.bark)S.bark(res.chains,parts,sp);else f15Chains(res.chains,S.cols,parts,sp?16:8);
  if(S.post)S.post(res,parts,lim);
  drawParts(k,parts);if(rs)seed=sv;
  open(k,t,1000,0,.4);return{k,bw:S.w0,bw1:fr>0?w0:undefined,bc:S.cols}}
/* ---------- shared drawing ---------- */
/* a blade like lot 15's, its half-width wp(v, u) free to differ on its two sides (lobes that do not mirror) */
function l39BladeS(P0,Ax,N,len,hw,wp,o={}){const W=V3.cr(N,Ax),ar=o.arch||0,fo=o.fold||0,cu=o.cup||0,dr=o.droop||0,cl=o.curl||0,tw=o.tw||0,wv=o.wave||0,wn=o.wn||9;
  return(u,v)=>{const w=hw*wp(v,u),a=tw*v,c=Math.cos(a),s=Math.sin(a),h=len*ar*Math.sin(Math.PI*v)+w*(fo*Math.abs(u)+cu*u*u)+len*cl*v*v*v+(wv?w*wv*Math.abs(u)*Math.sin(v*wn*Math.PI)*Math.abs(u):0),x=len*v,uw=u*w;
    return[P0[0]+Ax[0]*x+(W[0]*c+N[0]*s)*uw+(N[0]*c-W[0]*s)*h,P0[1]+Ax[1]*x+(W[1]*c+N[1]*s)*uw+(N[1]*c-W[1]*s)*h-len*dr*v*v,P0[2]+Ax[2]*x+(W[2]*c+N[2]*s)*uw+(N[2]*c-W[2]*s)*h]}}
/* a leaf at an organ: its size, its face (rho: 0 on edge, 90° flat toward the tip), its blade function by length; fitted above the mouth; drawn by f15Blade (nv rows) */
function l39Leaf(og,lim,L){const Hd=og.H,N=L.N||f15Face(og,L.rho*D,L.sg||(rnd()<.5?1:-1)),P0=V3.add(og.pos,V3.sc(Hd,L.pet||og.w*.35)),
    mk=len=>l39BladeS(P0,Hd,N,len,len*L.wr*.5,L.wp,L.sh),S=f15Fit(mk,L.sz,lim);if(!S)return null;
  const parts=[f15Blade(S,pal7(L.c),pal7(L.cb||shd(L.c,.12)),Object.assign({nv:L.nv,mt:L.mt??.8},L.bo))];
  /* the petiole: never finer than 1.1 units, so the blade stays joined to its twig in every bouquet */
  if(L.pet){const a=og.pos,b=S(0,0),w=Math.max(1.1,L.pw||og.w*.4);parts.push({z:(a[2]+b[2])/2-.02,cast:false,fn:par=>E('path',{d:`M${f(a[0])},${f(-a[1])}Q${f((a[0]+b[0])/2)},${f(-(a[1]+b[1])/2-L.pet*.12)} ${f(b[0])},${f(-b[1])}`,stroke:L.pc||shd(L.c,-.3),'stroke-width':f(w),'stroke-linecap':'round',fill:'none'},par)})}
  return parts}
/* the face of a leaf held flat in the plane of its twig (distichous ranks): the plane's normal U0 (else the twig's own up, recovered from the leaf's roll ph), tipped by tilt (rad) round the leaf's axis */
function l39Flat(og,tilt=0,U0){const ph=(og.p.ph||0)*D,n=U0||V3.add(V3.sc(og.L,Math.sin(ph)),V3.sc(og.U,Math.cos(ph))),m=V3s(n,V3.sc(og.H,V3.dot(n,og.H)));if(V3l(m)<1e-6)return og.U;
  return rotA(V3.nz(m),og.H,tilt)}
/* an ovoid (bud, acorn, berry) at P (view space) along the unit Z: profile r(v) (×w/2), length len; its silhouette (hull of the projected rings), a lit side, a fine edge;
   o.scales draws the overlapping scales of a bud (chevrons along it) */
function l39Ovoid(P,Z,len,w,rp,col,o={}){const X0=Math.abs(Z[2])<.9?V3.nz(V3.cr(Z,[0,0,1])):V3.nz(V3.cr(Z,[1,0,0])),Y0=V3.cr(Z,X0),pts=[],lit=[],L2=[-.45,.6];
  for(let i=0;i<=10;i++){const v=i/10,r=w*.5*rp(v);for(let j=0;j<12;j++){const a=j/12*6.283,q=V3.add(V3.add(P,V3.sc(Z,v*len)),V3.add(V3.sc(X0,Math.cos(a)*r),V3.sc(Y0,Math.sin(a)*r)));pts.push([q[0],-q[1]])}
    const c=V3.add(P,V3.sc(Z,v*len));lit.push([c[0]+L2[0]*r*.38,-c[1]-L2[1]*r*.38,r*.5])}
  const hull=hull2(pts),Pl=pal7(col),zc=P[2]+Z[2]*len*.5,ink=o.ink||Pl.ink;
  return{z:zc+(o.zb||0),cast:false,fn:par=>{E('path',{d:smooth(hull),fill:toneAt(Pl,.5),stroke:ink,'stroke-width':o.ew||.35,'stroke-opacity':o.eo??.55},par);if(LOD)return;
    /* the lit side: a narrower body shifted toward the light */
    const lp=[];for(const[x,y,r]of lit)for(let j=0;j<8;j++){const a=j/8*6.283;lp.push([x+Math.cos(a)*r,y+Math.sin(a)*r])}E('path',{d:smooth(hull2(lp)),fill:toneAt(Pl,.76),opacity:o.lo??.8},par);
    if(o.glint&&DET>=1.5){const c=lit[4];E('path',{d:`M${f(c[0]-c[2]*.3)},${f(c[1]-c[2]*.6)}q${f(c[2]*.2)},${f(-c[2]*.5)} ${f(c[2]*.5)},${f(-c[2]*.7)}`,stroke:'#ffffff','stroke-width':f(Math.max(.3,c[2]*.25)),'stroke-opacity':o.glint,fill:'none','stroke-linecap':'round'},par)}
    if(o.scales&&DET>=1.5){let d='';const n=o.scales;for(let i=1;i<n;i++){const v=i/n*.92,r=w*.5*rp(v)*.95,c=V3.add(P,V3.sc(Z,v*len)),t2=V3.add(P,V3.sc(Z,Math.min(1,v+.9/n)*len)),sg=i%2?1:-1,e=V3.add(c,V3.sc(X0,r*sg)),m=V3.add(V3.add(c,V3.sc(X0,r*.1*sg)),V3.sc(V3s(t2,c),.55));
        d+=`M${f(e[0])},${f(-e[1])}Q${f(m[0])},${f(-m[1])} ${f(t2[0]+(m[0]-c[0])*.1)},${f(-t2[1])}`}E('path',{d,fill:'none',stroke:ink,'stroke-width':.3,'stroke-opacity':.5},par)}
    if(o.after)o.after(par,Pl)}}}
/* the bark: each chain cut into pieces (each at its own depth), smoothed, a tapered ribbon lit from the upper left (three tones on wood, two on a twig, one in thumbnails),
   then its texture drawn inside it: tex(par, P, W, ch, piece) with the screen points and widths of the piece; cols(ch) gives the four tones of a chain */
function l39Bark(chains,parts,mx,cols,tex,ink){chains.forEach((ch,ci)=>{const n=ch.pts.length,c=cols(ch);for(let a=0;a<n-1;a+=mx-1){const b=Math.min(n-1,a+mx-1),P=[],W=[];let z=0;
    for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2];if(i===a){P.push([q[0],-q[1]]);W.push(ch.ws[i]);continue}
      const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)],t=.5,t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
      P.push([cr(0),-cr(1)]);W.push((ch.ws[i-1]+ch.ws[i])/2);P.push([q[0],-q[1]]);W.push(ch.ws[i])}
    const wm=Math.max(...W),T=tex&&!LOD?tex(P,W,ch,ci,a):null;
    parts.push({z:z/(b-a+1),cast:false,fn:par=>{const wf=i=>Math.max(.55,W[i]/2);E('path',{d:polyRibbon(P,wf),fill:c[0]},par);if(LOD)return;
      if(wm>2){E('path',{d:polyRibbon(P,i=>wf(i)*.66,i=>wf(i)*.26),fill:c[1]},par);E('path',{d:polyRibbon(P,i=>wf(i)*.24,i=>wf(i)*.44),fill:c[2],opacity:.85},par)}
      else if(DET>=1.5||wm>=1.6)E('path',{d:polyRibbon(P,i=>wf(i)*.5,i=>wf(i)*.3),fill:c[2],opacity:.8},par);
      if(T)T(par);if(ink)E('path',{d:lnSides(P,wf),fill:'none',stroke:ink,'stroke-width':.35,'stroke-opacity':.6},par)}})}})}
/* points along a piece of bark: the screen point, its unit tangent and normal, the half-width, at a fraction s of the piece */
function l39Along(P,W,s){const n=P.length,x=s*(n-1),i=Math.min(n-2,Math.floor(x)),u=x-i,a=P[i],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
  return{p:[a[0]+dx*u,a[1]+dy*u],t:[dx/l,dy/l],nm:[-dy/l,dx/l],w:(W[i]+(W[i+1]-W[i])*u)/2}}
/* lenticels: short pale dashes across the bark (horizontal on the trunk, so across the axis), as many as its length asks */
function l39Lenti(P,W,dens,col,o={}){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);const n=Math.min(o.max||40,Math.floor(L*dens*R(.7,1.3))),d=[];
  for(let j=0;j<n;j++){const A=l39Along(P,W,R(.04,.96));if(A.w<(o.wmin||.9))continue;const off=R(-.6,.6)*A.w,ln=A.w*R(o.l0||.25,o.l1||.55),c=[A.p[0]+A.nm[0]*off,A.p[1]+A.nm[1]*off];
    d.push(`M${f(c[0]-A.nm[0]*ln/2)},${f(c[1]-A.nm[1]*ln/2)}l${f(A.nm[0]*ln)},${f(A.nm[1]*ln)}`)}
  if(!d.length)return null;const dd=d.join('');return par=>E('path',{d:dd,stroke:col,'stroke-width':f(o.w||.45),'stroke-opacity':o.op??.8,'stroke-linecap':'round',fill:'none'},par)}
/* the colours of a branch's bark: shadowed body, the lit band, the highlight, and a fine twig's one tone */
const l39Wood=c=>{const P=pal7(c);return[toneAt(P,.38),toneAt(P,.6),toneAt(P,.82),toneAt(P,.5)]};
/* a spindle bud at a node (beech, birch): pointed, pressed toward the tip of its twig, on the side of its leaf; its scales on sheets */
const L39_SPIN=v=>Math.min(1,.15+.85*Math.sqrt(v/.28))*(1-Math.pow(v,1.7)),L39_EGG=v=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.04+.96*v))),.62)*(1-.18*v);
function l39NodeBud(og,len,w,col,side=.38,o={}){const Hd=og.H,sd=V3.nz(V3.add(V3.sc(og.U,-Math.cos((og.p.ph||0)*D)),V3.sc(og.L,Math.sin((og.p.ph||0)*D)))),Z=V3.nz(V3.add(V3.sc(Hd,.88),V3.sc(sd,side))),
    P=V3.add(og.pos,V3.sc(sd,og.w*.18));return l39Ovoid(P,Z,len,Math.max(1.2,w),o.rp||L39_SPIN,col,{scales:o.scales??5,zb:.03,eo:.6})}
/* ---------- beech (Fagus sylvatica; the copper beech is its purple form 'Purpurea'): a slender twig zigzagging from node to node, its leaves alternate in two ranks (distichous),
   held flat in one plane; the blade ovate-elliptic, 5–10 cm, its margin wavy, 5–9 pairs of straight parallel veins, young leaves pleated along them and silky;
   in every axil a long spindle bud, sharp, brown, of overlapping scales, a longer one at the tip. Sold fresh (green, copper beech purple), in autumn colours, and preserved (stabilisé:
   copper, brown, red, green — matte, the twig taking the dye) ---------- */
const CW_L39HE=[{id:'vert',n:'Vert (frais)',c:'#6a9a3e'},{id:'vert-tendre',n:'Vert tendre (jeunes feuilles)',c:'#9ab84e',young:1},{id:'pourpre',n:'Pourpre (hêtre pourpre)',c:'#5a2232',pur:1},
  {id:'cuivre',n:'Cuivré (stabilisé)',c:'#a85e32',stab:1},{id:'brun',n:'Brun (stabilisé)',c:'#6e4a32',stab:1},{id:'rouge',n:'Rouge (stabilisé)',c:'#9a3026',stab:1},{id:'vert-stab',n:'Vert (stabilisé)',c:'#4e6e36',stab:1},
  {id:'orange',n:'Orange d’automne',c:'#d9822e',aut:['#b8562a','#e0a03a']},{id:'or',n:'Jaune d’or (automne)',c:'#d8b83a',aut:['#c88a2a','#c8c050']}];
const L39_HE_ST=['#3a2e28','#5a4838','#806a56','#ab967e'],L39_HE_WP=prof([[0,.32],[.1,.68],[.3,.97],[.45,1],[.65,.86],[.83,.54],[.95,.2],[1,0]]),
  L39_HE_V=[0,1,2,3,4,5,6].map(k=>{const v=.08+.115*k;return[[0,v],[.5,v+.075],[.93,v+.16]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]);
/* the margin waves once between two veins */
const l39HeWp=(v,u)=>L39_HE_WP(v)*(1+.022*Math.sin((v-.08)/.115*2*Math.PI));
function l39HeLeaf(og,lim,cw,op,U0){const q=og.p.q??0,y=Math.max(0,Math.min(1,op)),sz=UPC*7*(1-.3*Math.pow(q,1.4))*(og.p.s||1)*R(.86,1.1)*(.42+.58*y),
    c0=cw.aut?mix(cw.aut[0],cw.aut[1],rnd()):cw.c,c=cw.stab?mix(cw.c,shd(cw.c,R(-.12,.08)),.6):mix(mix(c0,shd(c0,R(-.12,.08)),.6),cw.pur?'#8a2a38':'#c8d890',(1-y)*(cw.pur?.35:.3)),
    fold=.06+.5*Math.pow(1-y,1.5),pleat=y<.55;
  return l39Leaf(og,lim,{sz,wr:.62,wp:l39HeWp,N:l39Flat(og,R(-.5,.5)+(og.p.b?R(-.4,.4):0),U0),c,cb:cw.stab?shd(c,.05):mix(c,cw.pur?'#7a4a52':'#c8d0a8',.25),nv:DET>=1.5?14:6,mt:cw.stab?.7:.8,
    pet:DET>=1.5&&!LOD?UPC*.7:0,pw:1.1,pc:shd(c,-.35),sh:{arch:.05,fold,cup:.05,droop:.07,curl:-.02,tw:R(-.2,.2),wave:.05,wn:16},
    bo:{mid:DET>=1.5?mix(c,cw.pur?'#d8a0a0':'#e8ecc8',.35):null,mo:.5,veins:DET>=1.5?L39_HE_V:null,vc:pleat?shd(c,-.35):mix(c,'#e8ecc8',.3),vo:pleat?.5:.32,vw:pleat?.4:.3}})}
function l39HetrePlant(g,t,o){const cw=cwPick(CW_L39HE,o),op=cw.young?Math.min(o.op??1,.45):(o.op??1),st=cw.stab?f15DyeStem(cw.c):L39_HE_ST,bud=cw.stab?shd(cw.c,-.3):'#8a5634';
  return l39Sprig(g,t,o,{id:'he-'+cw.id,len:60,leafy:.82,inter:[3.6,2.4],nl:1,div:180,ph0:R(75,105),ang:[62,48],w0:4,w1:1.15,cols:st,e:.002,wig:.008,zig:13,twist:9,tip:1.4,
    bph:0,br:{zone:[.05,.78],p:.6,max:5,gap:1,n:[3,6],li:2.8,ang:46,eb:.004,ls:.86,wk:.5,dph:0},
    leaf:(og,lim,U0)=>l39HeLeaf(og,lim,cw,op,U0),
    node:og=>DET>=1.5||og.w>1.6?[l39NodeBud(og,UPC*R(.9,1.2)*(og.p.b?.8:1),og.w*.42+.6,bud,.42)]:null,
    apex:og=>[l39Ovoid(og.pos,og.H,UPC*R(1.5,2),Math.max(1.3,og.w*.9),L39_SPIN,bud,{scales:7,zb:.03,eo:.6})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>cw.stab?st:ch.ord?l39Wood('#6a5444'):l39Wood('#5e4e42'),(P,W)=>DET>=1.5?l39Lenti(P,W,.06,'#c8b8a0',{l0:.15,l1:.3,w:.4,op:.6}):null)})}
Object.assign(GH,{'hetre-branches':l39HetrePlant});CWS['hetre-branches']=CW_L39HE;SZG['hetre-branches']=[40,50,60,60,70,80];
GHI['hetre-branches']={form:'feuillage',size:1.2,k:'plant',rk:.6,self:60*UPC,fx:22};
/* ---------- oak: the pedunculate oak (Quercus robur) carries its leaves crowded toward the tips of its shoots, alternate in a spiral, almost sessile, obovate, 7–12 cm,
   with 4–6 rounded lobes a side that do not mirror each other and two small auricles at the base; its acorns (2–2.5 cm) hang 1 to 3 together on a long peduncle (3–7 cm),
   a third of each set in a cupule of tight, appressed grey-brown scales; green in summer, the leaves turn russet and gold, the acorns glossy brown.
   The red oak (Q. rubra) has larger leaves with pointed, bristle-tipped lobes on a long petiole, crimson in autumn, and squat acorns in a shallow saucer, almost sessile.
   The tip of every shoot bears a cluster of blunt ovoid buds. Sold fresh, in autumn colour and preserved (stabilisé) ---------- */
const CW_L39CH=[{id:'vert',n:'Vert (frais, glands verts)',c:'#5a7a3a',m:'r',ac:'g'},{id:'roux',n:'Roux d’automne',c:'#9a5a2a',m:'r',ac:'b',aut:['#86461f','#b27630']},
  {id:'cuivre',n:'Orangé cuivré (automne)',c:'#b06a3a',m:'r',ac:'b',aut:['#a4542a','#c98c3c']},{id:'or',n:'Or (automne)',c:'#c9a03c',m:'r',ac:'b',aut:['#b8842a','#d4b44a']},
  {id:'rouge',n:'Rouge (chêne rouge d’Amérique)',c:'#a8322a',m:'u',ac:'b',aut:['#8a2020','#c4462c']},{id:'brun',n:'Brun (stabilisé)',c:'#4a2e22',m:'r',ac:'s',stab:1},
  {id:'vert-stab',n:'Vert (stabilisé)',c:'#4c6634',m:'r',ac:'s',stab:1}];
const L39_CH_ST=['#3a3430','#5c544c','#827a70','#aca296'],L39_ROB=prof([[0,.2],[.05,.36],[.12,.4],[.3,.62],[.55,.88],[.72,.98],[.85,.84],[.95,.48],[1,0]]),L39_RUB=prof([[0,.3],[.1,.62],[.35,.92],[.55,1],[.75,.9],[.9,.55],[1,0]]);
/* the lobes: robur rounded (a sinus every 1/5 of the blade, the two sides out of step), rubra pointed with deep sinuses */
const l39RobWp=(v,u)=>{const ph=u<0?.3:0,x=Math.abs(Math.sin(Math.PI*(v*4.6+ph)));return L39_ROB(v)*(.5+.5*Math.pow(x,.55))},
  l39RubWp=(v,u)=>{const ph=u<0?.18:0,x=(v*3.2+ph+.5)%1,tri=1-Math.abs(x-.5)*2;return L39_RUB(v)*(v<.12?.7:.3+.7*Math.pow(tri,1.7))};
const L39_ROB_V=[0,1,2,3,4].map(k=>[[0,(k+.2)/4.6],[.5,(k+.4)/4.6],[.92,(k+.5)/4.6]]).concat([0,1,2,3,4].map(k=>[[0,(k+.25)/4.6],[-.5,(k+.55)/4.6],[-.92,(k+.8)/4.6]])).filter(L=>L[2][1]<.92),
  L39_RUB_V=[0,1,2].map(k=>[[0,(k+.05)/3.2+.02],[.5,(k+.1)/3.2+.06],[.95,(k+.5)/3.2-.02]]).concat([0,1,2].map(k=>[[0,(k+.12)/3.2+.02],[-.5,(k+.28)/3.2+.06],[-.95,(k+.68)/3.2-.02]])).filter(L=>L[2][1]<.95);
function l39ChLeaf(og,lim,cw,op){const q=og.p.q??0,y=Math.max(0,Math.min(1,op)),ru=cw.m==='u',sz=UPC*(ru?11:9)*(1-.25*Math.pow(q,1.3))*(og.p.s||1)*R(.82,1.12)*(.45+.55*y),
    c0=cw.aut?(rnd()<.15?mix(cw.aut[1],'#7a7a34',.35):mix(cw.aut[0],cw.aut[1],rnd())):cw.c,c=cw.stab?mix(cw.c,shd(cw.c,R(-.12,.08)),.6):mix(mix(c0,shd(c0,R(-.12,.1)),.6),'#b88a50',(1-y)*.35);
  return l39Leaf(og,lim,{sz,wr:ru?.62:.58,wp:ru?l39RubWp:l39RobWp,rho:R(55,85),c,cb:cw.stab?shd(c,.05):mix(c,'#c8c4a0',.28),nv:DET>=1.5?34:16,mt:cw.stab?.7:.8,
    pet:ru?UPC*R(1.8,2.6):DET>=1.5&&!LOD?UPC*.35:0,pw:1.15,pc:shd(c,-.25),sh:{arch:.06,fold:.1+.3*(1-y),cup:-.04,droop:.06,curl:.02,tw:R(-.3,.3)},
    bo:{mid:DET>=1.5?mix(c,'#ece4c0',.4):null,mo:.55,veins:DET>=1.5?(ru?L39_RUB_V:L39_ROB_V):null,vc:mix(c,'#ece4c0',.32),vo:.38,vw:.32,sharp:ru?1:0}})}
/* an acorn: the nut (an egg, its point at the tip, a fine apiculus) set in its cupule, along Z from P; its scales drawn as rows of small arcs */
const L39_NUT=v=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.5+.5*v))),.7)*(v<.5?1:1)*(1-.0*v),L39_NUTR=v=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.2+.8*v))),.62);
function l39Acorn(P,Z,len,ru,col,cup,parts){const wN=len*(ru?.82:.62),cl=len*(ru?.3:.42),Pn=V3.add(P,V3.sc(Z,cl*.35)),
    nut=l39Ovoid(Pn,Z,len*(ru?.82:1),wN,L39_NUTR,col,{glint:.5,zb:0,eo:.5}),
    cupP=l39Ovoid(P,Z,cl,wN*1.08,v=>.45+.6*Math.sqrt(v),cup,{zb:0,eo:.6,lo:.6,after:(par,Pl)=>{if(DET<1.5||LOD)return;
      const X0=Math.abs(Z[2])<.9?V3.nz(V3.cr(Z,[0,0,1])):V3.nz(V3.cr(Z,[1,0,0])),Y0=V3.cr(Z,X0);let d='';
      for(let i=1;i<=4;i++){const v=i/4.6,r=wN*.5*(.45+.6*Math.sqrt(v))*.98;for(let j=0;j<14;j++){const a=(j+(i%2)*.5)/14*6.283,n=V3.add(V3.sc(X0,Math.cos(a)),V3.sc(Y0,Math.sin(a)));if(n[2]<-.1)continue;
        const c=V3.add(V3.add(P,V3.sc(Z,v*cl)),V3.sc(n,r)),e=V3.sc(Z,-cl*.16),s2=V3.sc(V3.cr(Z,n),r*.16);d+=`M${f(c[0]+s2[0]+e[0])},${f(-(c[1]+s2[1]+e[1]))}L${f(c[0])},${f(-c[1])}L${f(c[0]-s2[0]+e[0])},${f(-(c[1]-s2[1]+e[1]))}`}}
      E('path',{d,fill:'none',stroke:Pl.d2,'stroke-width':.32,'stroke-opacity':.6,'stroke-linejoin':'round'},par)}});
  /* the apiculus at the tip of the nut */
  const tp=V3.add(Pn,V3.sc(Z,len*(ru?.82:1))),te=V3.add(tp,V3.sc(Z,len*.05));
  /* the cupule wraps the nut: in front of it, unless the nut points at the eye */
  cupP.z=nut.z+(Z[2]>.75?-.05:.05);parts.push(nut,cupP,{z:tp[2],cast:false,fn:par=>E('path',{d:`M${f(tp[0])},${f(-tp[1])}L${f(te[0])},${f(-te[1])}`,stroke:shd(col,-.5),'stroke-width':1.1,'stroke-linecap':'round'},par)})}
/* acorns at a node: on a peduncle that leaves the axil and droops (robur), or almost sessile against the twig (rubra); 1–3 together, the rest of the node's acorns lost */
function l39ChAcorns(og,lim,cw,op){const ru=cw.m==='u',y=Math.min(1,op),parts=[],sd=V3.nz(V3.add(V3.sc(og.U,-Math.cos((og.p.ph||0)*D+2)),V3.sc(og.L,Math.sin((og.p.ph||0)*D+2)))),
    pl=ru?UPC*.4:UPC*R(2.6,4.2)*(.6+.4*y),d0=V3.nz(V3.add(V3.sc(og.H,.55),V3.sc(sd,.8))),P0=og.pos,P1=V3.add(V3.add(P0,V3.sc(d0,pl*.55)),[0,-pl*.05,0]),P2=V3.add(V3.add(P1,V3.sc(d0,pl*.35)),[0,-pl*.32,0]),
    na=ru?R(1,2.6)|0:1+(rnd()<.55)+(rnd()<.25),len=UPC*(ru?1.7:2.2)*(.55+.45*y)*R(.92,1.08),
    ac=cw.ac==='g'?['#98a444','#7f8650']:cw.ac==='s'?[shd(cw.c,-.05),shd(cw.c,.12)]:['#8a5526','#9a8a6c'];
  if(lim!=null&&-Math.min(P2[1],P0[1])+len*1.4>lim)return null;
  const wp=Math.max(1.2,og.w*.32),pc=cw.ac==='g'?'#6e7440':shd(ac[1],-.25);
  parts.push({z:(P0[2]+P2[2])/2,cast:false,fn:par=>E('path',{d:`M${f(P0[0])},${f(-P0[1])}Q${f(P1[0])},${f(-P1[1])} ${f(P2[0])},${f(-P2[1])}`,stroke:pc,'stroke-width':f(wp),'stroke-linecap':'round',fill:'none'},par)});
  for(let j=0;j<na;j++){const a=(j-(na-1)/2)*.9+R(-.2,.2),dz=V3.nz(V3.add(V3.add(V3.sc(d0,.5),[0,-.9,0]),V3.add(V3.sc(sd,Math.sin(a)*.8),V3.sc(og.H,Math.cos(a)*.15)))),
      base=V3.add(P2,V3.sc(V3.nz(V3.add(d0,V3.sc(sd,Math.sin(a)))),j===((na-1)/2|0)?0:len*.1));
    if(j!==((na-1)/2|0))parts.push({z:base[2],cast:false,fn:par=>E('path',{d:`M${f(P2[0])},${f(-P2[1])}L${f(base[0])},${f(-base[1])}`,stroke:pc,'stroke-width':f(wp),'stroke-linecap':'round'},par)});
    l39Acorn(base,dz,len,ru,ac[0],ac[1],parts)}
  return parts}
function l39ChenePlant(g,t,o){const cw=cwPick(CW_L39CH,o),op=o.op??1,st=cw.stab?f15DyeStem(cw.c):L39_CH_ST,bud=cw.stab?shd(cw.c,-.25):'#7a5236';let nA=0;const mA=o.spine?3:5;
  return l39Sprig(g,t,o,{id:'ch-'+cw.id,len:50,leafy:.78,inter:[3.8,.9],nl:1,div:144,ang:[58,40],w0:4.6,w1:1.3,cols:st,e:.004,wig:.012,zig:8,twist:14,tip:1,
    br:{zone:[.05,.75],p:.6,max:4,gap:1,n:[4,7],li:2,ang:42,eb:.004,ls:.9,wk:.52},
    leaf:(og,lim)=>l39ChLeaf(og,lim,cw,op),
    node:(og,lim)=>{const pp=[];if(op>.25&&nA<mA&&(og.p.q??0)>.3&&rnd()<.4){const a=l39ChAcorns(og,lim,cw,op);if(a){nA++;pp.push(...a)}}
      if(DET>=1.5&&og.w>1.4)pp.push(l39NodeBud(og,UPC*.45,og.w*.5+.6,bud,.5,{rp:L39_EGG,scales:4}));return pp},
    apex:og=>{const pp=[l39Ovoid(og.pos,og.H,UPC*.6,Math.max(1.4,UPC*.42),L39_EGG,bud,{scales:4,zb:.04,eo:.6})];
      for(let j=0;j<3;j++){const a=j*2.1+R(-.3,.3),dr=V3.nz(V3.add(V3.sc(og.H,.75),V3.add(V3.sc(og.U,Math.cos(a)*.5),V3.sc(og.L,Math.sin(a)*.5))));pp.push(l39Ovoid(og.pos,dr,UPC*.45,Math.max(1.3,UPC*.34),L39_EGG,shd(bud,R(-.1,.1)),{scales:3,zb:.02,eo:.6}))}return pp},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>cw.stab?st:l39Wood(ch.ord?'#6c645a':'#5e5850'),(P,W)=>DET>=1.5?l39Lenti(P,W,.07,'#c4bcae',{l0:.12,l1:.28,w:.45,op:.55}):null)})}
Object.assign(GH,{'chene-branches-glands':l39ChenePlant});CWS['chene-branches-glands']=CW_L39CH;SZG['chene-branches-glands']=[40,50,50,60,70];
GHI['chene-branches-glands']={form:'feuillage',size:1.2,k:'plant',rk:.6,self:50*UPC,fx:20};
/* ---------- birch (Betula pendula, the silver birch; the white-barked Himalayan birch B. utilis var. jacquemontii): slender purplish-brown twigs, glossy, dotted with pale warty
   lenticels, their fine side shoots hanging; at their tips, from autumn to spring, the male catkins in twos or threes — tight, stiff and purple-brown in winter (2–3 cm),
   loosening and hanging, long (5–6 cm) and yellow with pollen in April; the leaves alternate on long slender petioles (2–3 cm), triangular-rhombic, 4–6 cm, doubly toothed,
   with the small green female catkins hanging among them, golden in autumn. The trade also sells the branches of white bark: chalky white, banded with dark horizontal lenticels,
   black chevrons under every branch, the bark peeling in papery strips ---------- */
const CW_L39BO=[{id:'chatons',n:'Rameaux brun pourpré à chatons',c:'#5a3332',m:'cat'},{id:'vert',n:'Vert (rameaux feuillés)',c:'#6f9a3c',m:'leaf'},
  {id:'or',n:'Or (feuillage d’automne)',c:'#c9a54a',m:'leaf',aut:['#c4922e','#dcc458']},{id:'blanc',n:'Écorce blanche (bouleau de l’Himalaya)',c:'#efece4',m:'bark'},
  {id:'argent',n:'Gris argenté (écorce)',c:'#c8c8c8',m:'bark'}];
const L39_BO_WP=prof([[0,.6],[.05,.86],[.17,1],[.38,.8],[.6,.5],[.8,.22],[.92,.07],[1,0]]),
  l39BoWp=nv=>(v,u)=>{const k=Math.round(v*nv);return L39_BO_WP(v)*(v>.97||v<.04?1:nv>20?(k%3===0?1:k%3===1?.9:.95):(k%2?.95:1))},
  L39_BO_V=[0,1,2,3,4,5].map(k=>{const v=.06+.13*k;return[[0,v],[.5,v+.09],[.9,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]);
function l39BoLeaf(og,lim,cw,op){const q=og.p.q??0,y=Math.max(0,Math.min(1,op)),sz=UPC*5*(1-.25*Math.pow(q,1.3))*(og.p.s||1)*R(.82,1.12)*(.42+.58*y),nv=DET>=1.5?30:12,
    c0=cw.aut?(rnd()<.18?mix(cw.aut[1],'#8a9a3a',.4):mix(cw.aut[0],cw.aut[1],rnd())):cw.c,c=mix(mix(c0,shd(c0,R(-.12,.1)),.6),'#c8d890',(1-y)*.3);
  return l39Leaf(og,lim,{sz,wr:.78,wp:l39BoWp(nv),rho:R(30,85),c,cb:mix(c,'#c8d0a8',.25),nv,mt:.8,pet:UPC*R(1.5,2.3)*(.6+.4*y),pw:1.1,pc:shd(c,-.4),
    sh:{arch:.04,fold:.1+.3*(1-y),cup:.02,droop:.12,curl:-.02,tw:R(-.4,.4)},bo:{mid:DET>=1.5?mix(c,'#ecf0c8',.38):null,mo:.5,veins:DET>=1.5?L39_BO_V:null,vc:mix(c,'#ecf0c8',.3),vo:.34,vw:.3,sharp:1}})}
/* a catkin: a scaly cylinder hanging from P along a curve (its stalk first, then the body bending under its weight), width w, length len; tight or loose scales in diamonds;
   drawn as one tapered ribbon, its lit side, its scales; lim keeps it above the mouth in a bouquet */
function l39Catkin(P,d0,len,w,col,lim,o={}){const n=12,pts=[],ws=[],hang=o.hang??.8;let d=V3.nz(d0),p=P.slice();pts.push(p.slice());ws.push(1.15);
  for(let i=1;i<=n;i++){const s=i/n;d=V3.nz(V3.add(d,V3.sc([0,-1,0],hang*.22)));p=V3.add(p,V3.sc(d,len/n));pts.push(p.slice());ws.push(s<.12?1.15+(w-1.15)*s/.12:w*(s>.86?Math.max(.35,Math.sqrt((1-s)/.14)):1))}
  if(lim!=null&&Math.max(...pts.map(q=>-q[1]))>lim)return null;
  const S=pts.map(q=>[q[0],-q[1]]),Pl=pal7(col),z=pts.reduce((a,q)=>a+q[2],0)/pts.length,sc=o.scales??1;
  return{z,cast:false,fn:par=>{E('path',{d:polyRibbon(S,i=>ws[i]/2),fill:toneAt(Pl,.45),stroke:Pl.d2,'stroke-width':.3,'stroke-opacity':.5},par);if(LOD)return;
    E('path',{d:polyRibbon(S,i=>ws[i]*.22,i=>ws[i]*.16),fill:toneAt(Pl,.72),opacity:.85},par);
    if(DET>=1.5||w>3){let dd='';for(let i=2;i<n;i++){const A=l39Along(S,ws,i/n),k=Math.max(2,Math.round(A.w/1.1));for(let j=0;j<k;j++){const u=-1+(2*j+1+(i%2?.5:-.5))/k;if(Math.abs(u)>.92)continue;const c=[A.p[0]+A.nm[0]*u*A.w,A.p[1]+A.nm[1]*u*A.w],l=len/n*.55*sc,hw=A.w/k*.9;
        dd+=`M${f(c[0]-A.nm[0]*hw)},${f(c[1]-A.nm[1]*hw)}Q${f(c[0]+A.t[0]*l)},${f(c[1]+A.t[1]*l)} ${f(c[0]+A.nm[0]*hw)},${f(c[1]+A.nm[1]*hw)}`}}
      E('path',{d:dd,fill:'none',stroke:o.sc2||Pl.d2,'stroke-width':.32,'stroke-opacity':.65},par)}
    if(o.pollen&&DET>=1.5){let dd='';for(let i=3;i<n;i+=1){const A=l39Along(S,ws,i/n+.04);for(const u of[-.55,.1,.6]){const c=[A.p[0]+A.nm[0]*u*A.w,A.p[1]+A.nm[1]*u*A.w];dd+=`M${f(c[0])},${f(c[1])}h.01`}}
      E('path',{d:dd,stroke:o.pollen,'stroke-width':.9,'stroke-linecap':'round','stroke-opacity':.9},par)}}}}
/* the male catkins at a tip: two or three, from tight and held out (winter) to long, hanging and yellow (spring) */
function l39BoCatkins(og,lim,op,n){const y=Math.max(0,Math.min(1,op)),len=UPC*(2.2+3.4*y)*R(.85,1.1),w=UPC*(.34+.16*y),col=mix('#6a3a30','#a88a3a',Math.max(0,y-.25)*1.3),out=[];
  for(let j=0;j<n;j++){const a=j*2.4+R(-.4,.4),d0=V3.nz(V3.add(V3.sc(og.H,.8-.5*y),V3.add(V3.sc(og.U,Math.cos(a)*.6),V3.add(V3.sc(og.L,Math.sin(a)*.6),[0,-.3-.6*y,0])))),
      c=l39Catkin(og.pos,d0,len*R(.85,1.05),w,col,lim,{hang:.15+.9*y,scales:1-.35*y,pollen:y>.7?'#e8d060':null,sc2:shd(col,-.5)});if(c)out.push(c)}return out}
function l39BouleauPlant(g,t,o){const cw=cwPick(CW_L39BO,o),op=o.op??1,bark=cw.m==='bark',W=bark?{c:cw.c,tw:'#4a2c2c'}:null,lc=cw.m==='leaf';
  const twig=l39Wood('#5a3332'),wood=bark?l39Wood(cw.c):twig,mark=bark?(cw.id==='blanc'?'#3a3634':'#2e2c2c'):'#d8c8c0';let nC=0;
  return l39Sprig(g,t,o,{id:'bo-'+cw.id,len:bark?80:70,leafy:bark?.7:.85,inter:bark?[9,6]:[3.4,2.2],nl:bark?0:1,div:137.5,ang:[55,40],w0:bark?UPC*2.1:3.8,w1:bark?UPC*.7:1.1,wp:bark?.6:.85,cols:bark?wood:twig,
    e:bark?.002:-.004,wig:bark?.006:.014,zig:bark?3:7,twist:12,tip:bark?2:1,clr:4,
    br:bark?{zone:[.1,.85],p:.6,max:4,gap:1,n:[2,5],li:4,ang:34,eb:-.004,ls:.8,wk:.4}:{zone:[0,.95],p:.75,max:12,gap:1,n:[5,10],li:2.2,ang:38,eb:-.035,ls:.86,wk:.5},
    leaf:lc?(og,lim)=>l39BoLeaf(og,lim,cw,op):null,
    node:(og,lim)=>{const pp=[];
      /* female catkins hanging among the leaves (green, golden brown in autumn) */
      if(lc&&op>.3&&og.p.b&&rnd()<.22){const c=l39Catkin(og.pos,V3.nz(V3.add(og.H,[0,-1,0])),UPC*R(2,2.8)*(.6+.4*op),UPC*.4,cw.aut?'#9a7a3a':'#7c9446',lim,{hang:.9,scales:.8});if(c)pp.push(c)}
      if(cw.m==='cat'&&og.p.b&&nC<(o.spine?9:16)&&rnd()<.18){const c=l39BoCatkins(og,lim,op,rnd()<.5?1:2);if(c.length){nC++;pp.push(...c)}}
      if(!bark&&DET>=1.5&&og.w>1.3)pp.push(l39NodeBud(og,UPC*R(.4,.6),og.w*.45+.6,'#5a2e2a',.5,{rp:L39_SPIN,scales:3}));
      /* the white bark: a black chevron under each side branch */
      if(bark&&og.w>4&&og.p.b===0&&(og.p.br||rnd()<.35)){const P=og.pos,H=og.H,s=V3.nz(V3.cr(H,[0,0,1])),w=og.w*.47,k=og.p.br?1:R(.5,.8),a=V3.add(P,V3.add(V3.sc(s,-w),V3.sc(H,-og.w*.75*k))),b=V3.add(P,V3.add(V3.sc(s,w),V3.sc(H,-og.w*.75*k))),
          m=V3.add(P,V3.sc(H,og.w*.25)),m2=V3.add(P,V3.sc(H,-og.w*.3*k));
        pp.push({z:P[2]+og.w*.3,cast:false,fn:par=>E('path',{d:`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}Q${f(m2[0])},${f(-m2[1])} ${f(a[0])},${f(-a[1])}Z`,fill:mark,opacity:.88},par)})}
      return pp},
    apex:(og,lim)=>{if(bark)return og.p.b?[l39NodeBud(og,UPC*.5,Math.max(1.3,og.w*.8),'#4a2626',0,{rp:L39_SPIN,scales:3})]:null;
      if(cw.m==='cat'&&nC<(o.spine?9:16)){const pp=l39BoCatkins(og,lim,op,og.p.b?(rnd()<.5?2:3):2);nC+=pp.length?1:0;if(pp.length)return pp}
      return[l39Ovoid(og.pos,og.H,UPC*.7,Math.max(1.3,og.w*.9),L39_SPIN,'#5a2e2a',{scales:3,zb:.03,eo:.6})]},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>bark?(ch.ord?l39Wood(mix(cw.c,'#7a5a52',.25)):wood):twig,(P,W,ch)=>{
      if(!bark)return DET>=1.5?l39Lenti(P,W,.09,'#d8c4bc',{l0:.15,l1:.3,w:.45,op:.7,wmin:.8}):null;
      /* white bark: dark lenticels across it, long and short, and on the trunk a few papery strips lifting */
      const a=l39Lenti(P,W,.22,mark,{l0:.25,l1:.9,w:Math.max(.5,Math.min(1.1,W[0]*.07)),op:.75,max:60,wmin:1.5}),b=l39Lenti(P,W,.05,'#c8a898',{l0:.5,l1:1,w:Math.max(.6,W[0]*.1),op:.55,wmin:4});
      return par=>{if(b)b(par);if(a)a(par)}},bark?shd(cw.c,-.55):null)})}
Object.assign(GH,{'bouleau':l39BouleauPlant});CWS['bouleau']=CW_L39BO;SZG['bouleau']=[60,80,80,100,120,150];
GHI['bouleau']={form:'ligne',size:1,k:'plant',self:90*UPC,tip:.85,fx:4*UPC,rch:9*UPC};
/* ---------- grapevine canes (Vitis vinifera; the crimson autumn leaves are those of V. coignetiae): a ripened cane, woody, thick (8–12 mm), bending from node to node,
   its bark brown and fibrous, coming away in long thin shreds; swollen nodes every 6–12 cm, each with its winter bud (the 'eye', a blunt cone of two hairy scales) and,
   opposite it on two nodes out of three, a tendril — forked, coiled round nothing, dry and brittle on a cut cane; the cane is pruned, its ends cut clean on the pale wood and its pith.
   Fresh, it carries its large palmate leaves (12–15 cm, on long petioles), its green tendrils and now and then a small bunch of grapes. Sold dry (natural brown, bleached,
   weathered grey) or fresh in leaf ---------- */
const CW_L39VI=[{id:'brun',n:'Brun naturel (sarment sec)',c:'#6e5038',m:'sec'},{id:'blanchi',n:'Blanchi (sarment écorcé)',c:'#cdb791',m:'sec',pale:1},{id:'gris',n:'Gris argenté (vieux sarment)',c:'#8f8273',m:'sec'},
  {id:'vert',n:'Vert (feuillé, petite grappe)',c:'#7a9a45',m:'vert'},{id:'rouge',n:'Rouge d’automne (Vitis coignetiae)',c:'#a8322a',m:'rouge'}];
const L39_VI_WP=prof([[0,.55],[.06,.9],[.16,1],[.27,.94],[.35,.66],[.44,.82],[.54,.76],[.62,.5],[.7,.54],[.8,.36],[.9,.16],[1,0]]),L39_VC_WP=prof([[0,.62],[.08,.94],[.25,1],[.5,.88],[.72,.6],[.88,.28],[1,0]]),
  l39ViWp=(P,nv)=>(v,u)=>{const k=Math.round(v*nv);return P(v)*(v>.97||v<.04?1:(k%2?.94:1))},
  L39_VI_V=[[[0,.02],[.5,.18],[.94,.3]],[[0,.02],[.42,.36],[.74,.62]],[[0,.02],[-.5,.18],[-.94,.3]],[[0,.02],[-.42,.36],[-.74,.62]],[[0,.4],[.4,.55],[.5,.8]],[[0,.4],[-.4,.55],[-.5,.8]]];
function l39ViLeaf(og,lim,cw,op){const y=Math.max(0,Math.min(1,op)),co=cw.m==='rouge',nv=DET>=1.5?30:14,sz=UPC*(co?10:9)*R(.8,1.1)*(.45+.55*y),
    c0=co?mix('#8e2424',rnd()<.3?'#c0602a':'#b8382c',rnd()):cw.c,c=mix(mix(c0,shd(c0,R(-.12,.1)),.6),'#c8d890',(1-y)*.3);
  return l39Leaf(og,lim,{sz,wr:co?.95:.92,wp:l39ViWp(co?L39_VC_WP:L39_VI_WP,nv),rho:R(45,85),c,cb:mix(c,'#d0d4b8',.3),nv,mt:.8,pet:UPC*R(4,6)*(.6+.4*y),pw:1.5,pc:shd(c,-.25),
    sh:{arch:.04,fold:.06,cup:.12,droop:.08,curl:-.03,tw:R(-.3,.3)},bo:{mid:DET>=1.5?mix(c,'#ecf0c8',.35):null,mo:.5,veins:DET>=1.5?L39_VI_V:null,vc:mix(c,'#ecf0c8',.3),vo:.4,vw:.4}})}
/* a tendril: from P straight out along d, then forked, each arm coiling (a helix narrowing toward its tip); never finer than 1.1 units */
function l39Tendril(P,d,len,col,lim){const st=V3.add(P,V3.sc(d,len*.35)),out=[[P,V3.add(P,V3.sc(d,len*.18)),st]],ax0=V3.nz(V3.add(d,[0,-.35,0]));
  for(const sg of[1,-1]){const a=V3.nz(V3.add(ax0,V3.sc(V3.nz(V3.cr(d,[0,0,1])),sg*.7))),e1=V3.nz(V3.cr(a,[0,0,1])),e2=V3.cr(a,e1),r0=len*R(.09,.13)*(sg>0?1:.8),turns=R(1.6,2.6)*(sg>0?1:.7),pt=[st],n=Math.round(turns*14);
    let C=V3.add(st,V3.sc(e1,-r0));for(let i=1;i<=n;i++){const th=i/n*turns*6.283,r=r0*(1-.45*i/n),p=V3.add(V3.add(C,V3.sc(a,len*.32*i/n)),V3.add(V3.sc(e1,r*Math.cos(th)),V3.sc(e2,r*Math.sin(th))));pt.push(p)}out.push(pt)}
  if(lim!=null&&Math.max(...out.flat().map(q=>-q[1]))>lim)return null;
  const z=out.flat().reduce((s,q)=>s+q[2],0)/out.flat().length,d2=out.map(L=>smooth(L.map(q=>[q[0],-q[1]]),false)).join('');
  return{z,cast:false,fn:par=>{E('path',{d:d2,fill:'none',stroke:col,'stroke-width':1.2,'stroke-linecap':'round','stroke-linejoin':'round'},par);
    if(DET>=1.5&&!LOD)E('path',{d:d2,fill:'none',stroke:shd(col,.35),'stroke-width':.4,'stroke-opacity':.6,'stroke-linecap':'round',transform:'translate(-.25,-.25)'},par)}}}
/* a small bunch: a peduncle, then a loose cone of berries hanging under it (the nearest drawn last), each touching its neighbours and the rachis */
function l39Grapes(og,lim,cw,op,sd){const y=Math.max(.3,Math.min(1,op)),P0=og.pos,pl=UPC*2.2,d0=V3.nz(V3.add(V3.sc(sd,.7),[0,-.5,0])),P1=V3.add(P0,V3.sc(d0,pl)),Lc=UPC*R(6,8)*y,rb=UPC*R(.5,.6)*(.6+.4*y),
    ax=V3.nz(V3.add(d0,[0,-1.6,0])),e1=V3.nz(V3.cr(ax,[0,0,1])),e2=V3.cr(ax,e1),B=[];
  for(let i=0;i<26;i++){const t=Math.pow(i/25,.9),rr=Lc*.32*(1-.75*t)*Math.sqrt(R(.3,1)),a=i*2.4;B.push(V3.add(V3.add(P1,V3.sc(ax,rb+t*Lc)),V3.add(V3.sc(e1,rr*Math.cos(a)),V3.sc(e2,rr*Math.sin(a)))))}
  if(lim!=null&&Math.max(...B.map(q=>-q[1]))+rb>lim)return null;
  const col=cw.m==='rouge'?'#4a2a48':'#a8b450',Pl=pal7(col),rch=[P1,V3.add(P1,V3.sc(ax,Lc*.7))],pc='#6e7a3a',parts=[];
  parts.push({z:(P0[2]+P1[2])/2,cast:false,fn:par=>E('path',{d:`M${f(P0[0])},${f(-P0[1])}L${f(P1[0])},${f(-P1[1])}L${f(rch[1][0])},${f(-rch[1][1])}`,stroke:pc,'stroke-width':1.4,'stroke-linecap':'round','stroke-linejoin':'round',fill:'none'},par)});
  for(const q of B)parts.push({z:q[2],cast:false,fn:par=>{const x=q[0],yy=-q[1];E('circle',{cx:f(x),cy:f(yy),r:f(rb),fill:toneAt(Pl,.5),stroke:Pl.d2,'stroke-width':.35,'stroke-opacity':.6},par);if(LOD)return;
    E('circle',{cx:f(x-rb*.22),cy:f(yy-rb*.25),r:f(rb*.62),fill:toneAt(Pl,.74),opacity:.8},par);if(cw.m==='rouge')E('circle',{cx:f(x),cy:f(yy),r:f(rb),fill:'#c8c0d8',opacity:.22},par);
    if(DET>=1.5)E('circle',{cx:f(x-rb*.35),cy:f(yy-rb*.4),r:f(rb*.16),fill:'#ffffff',opacity:.6},par)}});
  return parts}
function l39VignePlant(g,t,o){const cw=cwPick(CW_L39VI,o),op=o.op??1,fresh=cw.m!=='sec',bc=fresh?(cw.m==='vert'?'#7a6a40':'#6e5038'):cw.c,wood=l39Wood(bc),lw=l39Wood(mix(bc,'#7a5a3a',.2)),
    fib=cw.pale?'#a89070':shd(bc,-.45),fibL=cw.pale?'#e8dcc0':shd(bc,.35),cut=cw.pale?'#e8d8b4':'#d0b080',tc=fresh&&cw.m==='vert'?'#8a9a48':mix(bc,'#b0a080',.35);let nG=0,nT=0;
  return l39Sprig(g,t,o,{id:'vi-'+cw.id,len:90,leafy:.9,inter:[9,6.5],nl:0,div:180,ph0:R(60,120),ang:[60,50],w0:UPC*1.15,w1:UPC*.6,wp:.6,cols:wood,e:-.003,wig:.022,zig:16,twist:22,tip:3,clr:3,
    br:{zone:[.1,.8],p:.3,max:2,gap:2,n:[2,4],li:6,ang:38,eb:-.006,ls:.9,wk:.62},
    node:(og,lim)=>{const pp=[],ph=(og.p.ph||0)*D,sd=V3.nz(V3.add(V3.sc(og.U,-Math.cos(ph)),V3.sc(og.L,Math.sin(ph)))),P=og.pos,w=og.w,H=og.H;
      /* the swollen node: a short, wider band across the cane */
      const nm=V3.nz(V3.cr(H,[0,0,1])),A=V3.add(P,V3.sc(H,-w*.45)),B2=V3.add(P,V3.sc(H,w*.45)),hw=w*.62;
      pp.push({z:P[2]+.02,cast:false,fn:par=>{const pts=[V3.add(A,V3.sc(nm,hw*.86)),V3.add(P,V3.sc(nm,hw)),V3.add(B2,V3.sc(nm,hw*.86)),V3.add(B2,V3.sc(nm,-hw*.86)),V3.add(P,V3.sc(nm,-hw)),V3.add(A,V3.sc(nm,-hw*.86))].map(q=>[q[0],-q[1]]);
        E('path',{d:smooth(pts),fill:wood[0]},par);if(LOD)return;E('path',{d:smooth(pts.map(([x,y])=>[x-nm[0]*hw*.2+(P[0]-x)*.25,y+nm[1]*hw*.2+(-P[1]-y)*.25])),fill:wood[1],opacity:.8},par);
        if(DET>=1.5)E('path',{d:`M${f(pts[0][0])},${f(pts[0][1])}Q${f(pts[1][0])},${f(pts[1][1])} ${f(pts[2][0])},${f(pts[2][1])}M${f(pts[5][0])},${f(pts[5][1])}Q${f(pts[4][0])},${f(pts[4][1])} ${f(pts[3][0])},${f(pts[3][1])}`,stroke:fib,'stroke-width':.4,'stroke-opacity':.6,fill:'none'},par)}});
      /* the eye on one side; on fresh canes its leaf */
      pp.push(l39Ovoid(V3.add(P,V3.sc(sd,w*.3)),V3.nz(V3.add(V3.sc(H,.55),V3.sc(sd,.8))),UPC*.55,Math.max(1.6,UPC*.48),L39_EGG,cw.pale?'#b09070':'#6a4430',{scales:2,zb:.05,eo:.6}));
      if(fresh&&op>.15&&(!o.spine||(og.p.i??1)%2===0||og.p.b)){const lv=l39ViLeaf(Object.assign({},og,{H:V3.nz(V3.add(V3.sc(H,.5),V3.add(V3.sc(sd,.85),[0,.15,0]))),pos:V3.add(P,V3.sc(sd,w*.3))}),lim,cw,op);if(lv)pp.push(...lv)}
      /* opposite: a tendril on two nodes out of three, or once a small bunch */
      const so=V3.sc(sd,-1),i=og.p.i??(og.p.qb*7|0);
      if(fresh&&op>.4&&nG<1&&(og.p.q??0)>.25&&rnd()<.35){const gr=l39Grapes(og,lim,cw,op,so);if(gr){nG++;pp.push(...gr);return pp}}
      if((i+(og.p.b?1:0))%3!==2&&nT<(o.spine?7:12)){const td=l39Tendril(V3.add(P,V3.sc(so,w*.3)),V3.nz(V3.add(V3.sc(H,.55),V3.add(V3.sc(so,.8),[0,.15,0]))),UPC*R(6,9),tc,lim);if(td){nT++;pp.push(td)}}
      return pp},
    /* the pruned end: the cut face, pale wood round the darker pith */
    apex:og=>{const P=og.pos,H=og.H,r=og.w*.5,hz=Math.abs(H[2]),ry=Math.max(.6,r*Math.sqrt(1-hz*hz)*.0+r*Math.max(.25,hz)),ang=Math.atan2(-H[1],H[0])/D+90;
      return[{z:P[2]+H[2]*.5,cast:false,fn:par=>{const gg=G(par,{transform:`translate(${f(P[0])},${f(-P[1])}) rotate(${f(ang)})`});E('ellipse',{cx:0,cy:0,rx:f(r),ry:f(ry),fill:cut,stroke:fib,'stroke-width':.4},gg);
        if(!LOD)E('ellipse',{cx:0,cy:0,rx:f(r*.3),ry:f(ry*.3),fill:'#8a6a48',opacity:.85},gg)}}]},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?14:8,ch=>ch.ord?lw:wood,(P,W)=>{if(LOD)return null;const ws=Math.max(...W);if(ws<2.4||DET<1.5&&ws<4)return null;
      /* the fibrous bark: long streaks along the cane, dark between the fibres, pale on their ridges, and a shred lifting here and there */
      let dk='',lt2='';const n=P.length;for(const u of[-.62,-.3,.05,.38,.66]){const q=[];for(let i=0;i<n;i++){const A=l39Along(P,W,i/(n-1)),uu=u+.08*Math.sin(i*1.7+u*9);q.push([A.p[0]+A.nm[0]*uu*A.w,A.p[1]+A.nm[1]*uu*A.w])}
        if(u<0||u>.3)dk+=pD(q);else lt2+=pD(q)}
      let sh='';if(!cw.pale&&DET>=1.5)for(let j=0;j<2;j++){if(rnd()<.5)continue;const s0=R(.1,.7),a=l39Along(P,W,s0),b=l39Along(P,W,s0+.22),u=R(-.5,.5);
        sh+=`M${f(a.p[0]+a.nm[0]*u*a.w)},${f(a.p[1]+a.nm[1]*u*a.w)}L${f(b.p[0]+b.nm[0]*(u+.25)*b.w)},${f(b.p[1]+b.nm[1]*(u+.25)*b.w)}L${f(b.p[0]+b.nm[0]*(u+.05)*b.w)},${f(b.p[1]+b.nm[1]*(u+.05)*b.w)}Z`}
      return par=>{E('path',{d:dk,fill:'none',stroke:fib,'stroke-width':.45,'stroke-opacity':cw.pale?.35:.55},par);E('path',{d:lt2,fill:'none',stroke:fibL,'stroke-width':.4,'stroke-opacity':.45},par);if(sh)E('path',{d:sh,fill:fibL,opacity:.7},par)}},shd(bc,-.6))})}
Object.assign(GH,{'vigne-sarments':l39VignePlant});CWS['vigne-sarments']=CW_L39VI;SZG['vigne-sarments']=[60,80,80,100,120];
GHI['vigne-sarments']={form:'ligne',size:1,k:'plant',self:90*UPC,tip:.8,fx:5*UPC,rch:10*UPC};
/* ---------- tamarisk (Tamarix ramosissima, T. tetrandra, T. parviflora): long supple reddish-brown wands, arching, thick with fine side shoots; the leaves are minute scales (1.5–3 mm)
   pressed on slender green twiglets, so the foliage is a glaucous mist of feathery plumes; the flowers, tiny (2–3 mm), five-petalled, pink, crowd in slender racemes 3–6 cm long
   (gathered in plumy panicles at the tips in summer, along the old wood in spring), deep pink in bud, paler and fluffy open with their stamens out. Sold pink, deep pink, pale pink, white.
   Thousands of scales and flowers for a few elements: each shoot's plumes are one path, its racemes one body and one path of florets ---------- */
const CW_L39TA=[{id:'rose',n:'Rose (Pink Cascade)',c:'#e8a6be'},{id:'rose-vif',n:'Rose soutenu (Rubra)',c:'#d0708f'},{id:'rose-pale',n:'Rose pâle',c:'#f2cfda'},{id:'blanc',n:'Blanc (Alba)',c:'#f1ebe6'}];
const L39_TA_ST=['#4a2620','#6e3a2e','#945848','#c08a78'];
/* a slim body along a 3D centreline from P (direction d, bending by bend toward bd), its half-width hw(s); hands back the screen outline, the centreline and its widths */
function l39Plume(P,d,len,hw,bd,bend,n=8){const C=[],Wd=[];let p=P.slice(),dd=V3.nz(d);C.push(p.slice());Wd.push(hw(0));for(let i=1;i<=n;i++){dd=V3.nz(V3.add(dd,V3.sc(bd,bend/n)));p=V3.add(p,V3.sc(dd,len/n));C.push(p.slice());Wd.push(hw(i/n))}
  const S=C.map(q=>[q[0],-q[1]]),A=[],B=[];for(let i=0;i<=n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;A.push([S[i][0]+nx*Wd[i],S[i][1]+ny*Wd[i]]);B.push([S[i][0]-nx*Wd[i],S[i][1]-ny*Wd[i]])}
  return{C,S,W:Wd,out:A.concat(B.reverse()),low:Math.max(...S.map(q=>q[1]))+Math.max(...Wd),z:C.reduce((s,q)=>s+q[2],0)/C.length}}
function l39TamarisPlant(g,t,o){const cw=cwPick(CW_L39TA,o),op=Math.max(.05,Math.min(1,o.op??1)),y=op,pale=h2l(cw.c)[2]>.85,fol='#7e9a6c',FP=pal7(fol),RP=pal7(cw.c),buds=shd(cw.c,-.3),bk=new Map();
  const bucket=og=>{const key=og.p.b?'b'+og.p.c:'m'+Math.floor((og.p.q??0)*4);let b=bk.get(key);if(!b){b={pl:[],rc:[],z:0,n:0};bk.set(key,b)}return b};
  /* a raceme at P along d: deep pink buds when young, opening from its base upward */
  const raceme=(og,P,d,lim)=>{const len=UPC*R(3,5)*(.6+.4*y),wm=UPC*(.2+.16*y),r=l39Plume(P,V3.nz(V3.add(d,[0,.35,0])),len,s=>s<.1?Math.max(.6,wm*.5*s/.1):wm*.5*(s>.85?Math.max(.3,Math.sqrt((1-s)/.15)):1),[0,1,0],.25);
    if(lim!=null&&r.low>lim)return;const b=bucket(og);b.rc.push(r);b.z+=r.z;b.n++};
  return l39Sprig(g,t,o,{id:'ta-'+cw.id,len:60,cmMin:40,leafy:.92,inter:[2.6,1.6],nl:1,div:137.5,ang:[55,40],w0:3.6,w1:1.1,cols:L39_TA_ST,e:-.008,wig:.02,zig:4,twist:10,tip:.6,clr:2,
    br:{zone:[0,.95],p:.8,max:12,gap:0,n:[6,11],li:1.9,ang:36,eb:-.022,ls:.9,wk:.45},
    /* the plumes of scale leaves on every node; in the upper half of a shoot some nodes carry a raceme instead */
    leaf:(og,lim)=>{const q=og.p.q??0;if(q>.3&&rnd()<.55*(og.p.b?1:.5)){raceme(og,og.pos,og.H,lim);return null}
      const len=UPC*R(2.2,3.6)*(1-.3*q),pl=l39Plume(og.pos,og.H,len,()=>.6,[0,-1,0],.3,6);pl.L=len;
      if(lim!=null&&pl.low>lim)return null;const b=bucket(og);b.pl.push(pl);b.z+=pl.z;b.n++;return null},
    apex:(og,lim)=>{raceme(og,og.pos,og.H,lim);return null},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,()=>L39_TA_ST,(P,W)=>DET>=1.5?l39Lenti(P,W,.05,'#c8a090',{l0:.15,l1:.3,w:.4,op:.5,wmin:1.2}):null),
    post:(res,parts)=>{for(const b of bk.values()){if(!b.n)continue;const z=b.z/b.n+.02,det=DET>=1.5&&!LOD;
      /* the plumes: each a fine twiglet and its side twiglets (strokes of 1.1 units), their scales as pale ticks on sheets */
      let dp='',dt='';for(const p of b.pl){const S=p.S,n=S.length-1;dp+=pD(S);for(let k=1;k<n-1;k++){const s2=k/n,A=l39Along(S,p.W,s2),sg=k%2?1:-1,ca=Math.cos(.65),sa=Math.sin(.65)*sg,dx=A.t[0]*ca-A.t[1]*sa,dy=A.t[0]*sa+A.t[1]*ca,l=p.L*(1-s2)*.42;
          dp+=`M${f(A.p[0])},${f(A.p[1])}q${f(dx*l*.5)},${f(dy*l*.5)} ${f(dx*l+A.t[0]*l*.2)},${f(dy*l+A.t[1]*l*.2+l*.1)}`;
          if(det)for(let j=1;j<=3;j++){const q=[A.p[0]+dx*l*j/3.4,A.p[1]+dy*l*j/3.4];dt+=`M${f(q[0])},${f(q[1])}l${f(dx*.9-dy*.6*sg)},${f(dy*.9+dx*.6*sg)}M${f(q[0])},${f(q[1])}l${f(dx*.9+dy*.6*sg)},${f(dy*.9-dx*.6*sg)}`}}}
      let rb='',rd='',rs='';for(const r of b.rc){rb+=smooth(r.out);const W2=r.W.map(x=>2*x);
        for(let k=2;k<=30;k++){const s=k/31,A=l39Along(r.S,W2,s),open=s<y*1.15-.05,m=open?3:2;for(let j=0;j<m;j++){const u=open?(j-1)*(k%2?.95:.8)+(k%2?.12:-.12):(j-.5)*(k%2?1.1:.9),e=open?1.05:.62,c=[A.p[0]+A.nm[0]*u*A.w*e,A.p[1]+A.nm[1]*u*A.w*e],rr=(open?.82:.55)*(DET>=1.5?1:1.1);
          const dot=`M${f(c[0]-rr)},${f(c[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;if(open)rd+=dot;else rs+=dot}}}
      parts.push({z,cast:false,fn:par=>{if(dp){E('path',{d:dp,fill:'none',stroke:toneAt(FP,.5),'stroke-width':1.15,'stroke-linecap':'round'},par);if(dt)E('path',{d:dt,fill:'none',stroke:toneAt(FP,.78),'stroke-width':.45,'stroke-linecap':'round'},par)}
        if(rb){E('path',{d:rb,fill:toneAt(RP,.3),stroke:pale?RP.d2:RP.d1,'stroke-width':pale?.4:.3,'stroke-opacity':.5},par);if(LOD)return;if(rs)E('path',{d:rs,fill:buds,opacity:.95},par);if(rd)E('path',{d:rd,fill:toneAt(RP,.84),stroke:pale?RP.d2:RP.d1,'stroke-width':pale?.3:.18,'stroke-opacity':pale?.6:.4},par)}}})}}})}
Object.assign(GH,{'tamaris':l39TamarisPlant});CWS['tamaris']=CW_L39TA;SZG['tamaris']=[50,60,60,70,80];
GHI['tamaris']={form:'grappe',size:1.4,k:'plant',rk:.55,self:60*UPC,tip:.7,fx:5*UPC};
