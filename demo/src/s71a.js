/* ================= Serre, lot 71 — Lianes vertes, poussées par le L-système : smilax des fleuristes (Asparagus asparagoides), smilax du Sud (Smilax smallii, « Jackson vine »),
   lierre (Hedera helix, juvénile et adulte en baies), jasmin étoilé (Trachelospermum jasminoides), chèvrefeuille (Lonicera) ================= */
/* ---------- the vine engine: a long supple stem whose main axis follows a path (over the vessel's lip and down in a bouquet's drape, along the composer's spine,
   arched then hanging on a sheet), wound a little on itself as a twiner is; the L-system grows on it the nodes, the leaves by their phyllotaxis, side shoots that droop,
   the axillary organs (cymes, umbels) and the young tip; every axis drawn as a ribbon, every leaf as a curved 3D blade from its outline. It hands back {k, bw, bw1, bc, neck, nd}.
     A(i) → F…F N(i) A(i+1)        A(n) → F…F Ap        N(i) → Nd [ /φᵢ &α Lv ]… [ /φ' &β X ] [ /φ'' &γ B(m) ]        B(m) → F Nd [ /φ &α Lv ] B(m−1)        B(0) → F Ap ---------- */
const l71Q=p=>f(p[0])+','+f(-p[1]),l71S=p=>[p[0],-p[1]];
const l71C01=x=>Math.max(0,Math.min(1,x));
/* a tone at a light level; in the app (DET 1) the levels are rounded so that neighbouring flowers share their paths */
const l71T=(P,I)=>toneAt(P,DET>=1.5?I:Math.round(I*6)/6);
/* two unit vectors across a direction */
function l71X(d,ref){let a=V3.cr(d,ref||[0,0,1]);if(V3l(a)<1e-3)a=V3.cr(d,[1,0,0]);a=V3.nz(a);return[a,V3.cr(d,a)]}
/* the path of the main axis, view space (y up): its points, its length table, a point and tangent at a length; mode drape | spine | sheet */
function l71Path(o,S){const X=typeof DRAPEX!=='undefined'&&DRAPEX;let C=null,B=I3,mode,pts=[];
  if(o.spine){mode='spine';const sp=o.spine,fr=Math.max(0,Math.min(.92,o.from||0)),N=48;for(let i=0;i<=N;i++){const q=bz(sp,fr+(1-fr)*i/N);pts.push([q[0],-q[1],0])}}
  else if(X||o.len){mode='drape';B=o.ax?frameOf(o,0):I3;
    /* one strand hanging from the origin: it rises out of the mouth, crests over the lip (never under it) and falls */
    const side=X?X.side||1:(o.sway||0)<0?-1:1,Lv0=o.len||(o.cm||80)*UPC,sw=(o.sway??R(10,30)*side)*R(.7,1.3);let hc=R(6,12),dxc=side*R(8,18),Lh=Lv0*.88;
    if(X){hc=Math.max(5,X.y-(X.top-R(5,10)));if(!X.held){const room=X.FL-3-X.y;Lh=Math.min(Lh,room)}dxc=side*Math.max(6,Math.min(26,X.mw-Math.abs(X.x-X.mcx)+R(4,10)))}
    Lh=Math.max(40,Lh);C=[[0,0,0],[dxc*.45,hc*1.5,R(-3,3)],[dxc+(sw-dxc)*.12+side*Lh*.08,-Lh*.32,R(-8,8)],[sw-side*Lh*.04,-Lh,R(-12,12)]]}
  else{mode='sheet';B=frameOf(o,0);const L=(o.cm>=20?o.cm:S.cm)*UPC,sd=1,U=[[0,0,0],[.02*sd,.3,.03],[.42*sd,.36,.12],[.34*sd,-.3,-.05]];
    /* the garland on a sheet: it rises from its cut end, arches over and hangs; scaled so its length is the asked one */
    let l=0,p=U[0];for(let i=1;i<=40;i++){const q=l71Bz(U,i/40);l+=V3l(V3s(q,p));p=q}C=U.map(q=>V3.sc(q,L/l))}
  if(C){const N=Math.max(24,Math.round(l71BzL(C)/6));for(let i=0;i<=N;i++)pts.push(toV(B,l71Bz(C,i/N)))}
  /* the twiner's own winding round its line, growing from the base, and the zigzag of its nodes */
  const Fr=V3.nz(toV(B,[0,0,1])),n=pts.length,T=i=>V3.nz(V3s(pts[Math.min(n-1,i+1)],pts[Math.max(0,i-1)])),cum0=[0];for(let i=1;i<n;i++)cum0.push(cum0[i-1]+V3l(V3s(pts[i],pts[i-1])));
  const am=S.twA||1.6,per=(S.twP||60)*R(.85,1.15),ph=R(0,6.28),out=[];
  for(let i=0;i<n;i++){const[a,b]=l71X(T(i),Fr),s=cum0[i],k=Math.min(1,s/30),t=ph+s/per*6.283;out.push(V3.add(pts[i],V3.add(V3.sc(a,Math.cos(t)*am*k),V3.sc(b,Math.sin(t)*am*k*.7))))}
  const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(out[i],out[i-1])));const Lt=cum[n-1];
  const at=l=>{l=Math.max(0,Math.min(Lt,l));let i=1;while(i<n-1&&cum[i]<l)i++;const t=(l-cum[i-1])/((cum[i]-cum[i-1])||1);return{p:V3.add(V3.sc(out[i-1],1-t),V3.sc(out[i],t)),T:V3.nz(V3s(out[i],out[i-1]))}};
  return{mode,B,Fr,up:V3.nz(toV(B,[0,1,0])),down:mode==='sheet'?V3.nz(toV(B,[0,-1,0])):[0,-1,0],L:Lt,at}}
const l71Bz=(C,s)=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
const l71BzL=C=>{let l=0,p=C[0];for(let i=1;i<=30;i++){const q=l71Bz(C,i/30);l+=V3l(V3s(q,p));p=q}return l};
/* ---------- a blade from its outline: the right half (x ≥ 0) from the petiole's point to the tip (0,1), mirrored; S(x,y) its surface; each half lit by its own normal,
   its underside paler; on the upper face: a variegation (an inner outline of another colour), veins and a soft gloss ---------- */
const l71N=P=>{const n=[0,0,0];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];n[0]+=(a[1]-b[1])*(a[2]+b[2]);n[1]+=(a[2]-b[2])*(a[0]+b[0]);n[2]+=(a[0]-b[0])*(a[1]+b[1])}return n};
function l71Sheet(S,ol,Un,P,PB,o={}){const y0=ol[0][1],y1=ol[ol.length-1][1],mid=[];for(let i=1;i<6;i++)mid.push([0,y1-(y1-y0)*i/6]);
  const half=sg=>{const P3=ol.concat(mid).map(([x,y])=>S(sg*x,y));let n=l71N(P3);if(V3.dot(n,Un)<0)n=V3.sc(n,-1);n=V3l(n)>1e-9?V3.nz(n):[0,0,1];const fr=n[2]>=0,I=lightI(fr?n:V3.sc(n,-1))+(o.dI||0);
    return{sg,pts:P3.map(l71S),z:P3.reduce((a,p)=>a+p[2],0)/P3.length,col:toneAt(fr?P:PB,I),I,fr,ink:(fr?P:PB).ink}};
  const hA=half(-1),hB=half(1),ord=hA.z<hB.z?[hA,hB]:[hB,hA],fr=hA.fr||hB.fr,line=L=>'M'+L.map(([x,y])=>l71Q(S(x,y))).join('L');
  return{z:(hA.z+hB.z)/2+(o.zb||0),fr,fn:par=>{if(o.pre)o.pre(par);
    for(const h of ord){E('path',{d:smooth(h.pts),fill:h.col,stroke:h.ink,'stroke-width':DET>=1.5?.35:.45,'stroke-opacity':.32,'stroke-linejoin':'round'},par);
      /* the variegation: the inner outline of the same half, seen only on the upper face */
      if(o.inner&&h.fr){const iol=o.inner.ol;E('path',{d:smooth(iol.map(([x,y])=>l71S(S(h.sg*x,y))).concat(iol.slice(1,-1).reverse().map(([x,y])=>l71S(S(0,y))))),fill:toneAt(o.inner.P,h.I)},par)}}
    if(LOD)return;
    if(o.veins&&fr&&(DET>=1.5||o.veins1)){let d='';for(const L of o.veins)for(const sg of[-1,1])d+=line(L.map(([x,y])=>[sg*x,y]));E('path',{d,stroke:o.vc||P.d1,'stroke-width':f(o.vw||.4),'stroke-opacity':o.vo??.42,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}
    if(o.gloss&&fr&&DET>=1.5){const h=hA.I>hB.I?hA:hB;if(h.fr){const hw=l71Hw(ol),A2=[],B2=[];for(let i=0;i<=8;i++){const y=.14+.68*i/8,w=hw(y);A2.push(l71S(S(h.sg*w*.2,y)));B2.push(l71S(S(h.sg*w*(.42+.08*Math.sin(Math.PI*i/8)),y)))}
      E('path',{d:smooth(A2.concat(B2.reverse())),fill:'#ffffff',opacity:f(.13*o.gloss)},par)}}}}}
/* the half width of an outline at a height (the widest crossing) */
const l71Hw=ol=>y=>{let w=0;for(let i=1;i<ol.length;i++){const a=ol[i-1],b=ol[i];if((a[1]-y)*(b[1]-y)<=0&&a[1]!==b[1]){const t=(y-a[1])/(b[1]-a[1]);w=Math.max(w,a[0]+(b[0]-a[0])*t)}}return w};
/* a leaf at a node: its petiole out along H, then its blade turned toward the front (Fr) and drooping toward the ground (gk), arched, folded on its midrib */
function l71Leaf(og,Fr,down,L,ol,P,PB,o={}){const pl0=o.pl||0,dp=pl0>.5&&(DET>=1.5||pl0>4),pl=dp?pl0:0,H0=og.H;let Hb=V3.nz(V3.add(V3.sc(H0,1-(o.gk||0)),V3.sc(down,o.gk||0)));
  let Ub=V3s(V3.add(V3.sc(og.U,1-(o.face??.6)),V3.sc(Fr,o.face??.6)),V3.sc(Hb,0));Ub=V3s(Ub,V3.sc(Hb,V3.dot(Ub,Hb)));if(V3l(Ub)<1e-3)Ub=og.U;Ub=V3.nz(Ub);
  if(o.tw)Ub=V3.nz(rotA(Ub,Hb,o.tw));const Lb=V3.cr(Ub,Hb),Pb=V3.add(V3.add(og.pos,V3.sc(H0,pl*.55)),V3.sc(Hb,pl*.45)),y0=ol[0][1],ar=o.arch??.08,fo=o.fold??.15,dr=o.dr??.12,cup=o.cup||0;
  const S=(x,y)=>{const ax=Math.abs(x),ya=Math.max(0,y);return V3.add(V3.add(V3.add(Pb,V3.sc(Hb,L*y)),V3.sc(Lb,L*x)),V3.add(V3.sc(Ub,L*(ar*Math.sin(Math.PI*l71C01((y-y0)/(1-y0)))+fo*ax-cup*ax*ax*4)),[0,-L*dr*ya*ya,0]))};
  const pw=Math.max(1.15,o.pw||L*.03),pc=o.pc,pre=dp?par=>{const a=og.pos,m=V3.add(og.pos,V3.sc(H0,pl*.7)),b=S(0,y0);E('path',{d:`M${l71Q(a)}Q${l71Q(m)} ${l71Q(b)}`,stroke:pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par)}:null;
  const sh=l71Sheet(S,ol,Ub,P,PB,Object.assign({},o.sheet||{},{pre}));sh.S=S;sh.tip=S(0,1);sh.base=S(0,y0);return sh}
/* a curve drawn as a stroke along view-space points (pedicels, tendrils, roots): never thinner than what reads as one piece */
const l71Line=(P3,w,c,op=1)=>'M'+P3.map(l71Q).join('L');
/* the painter's batches: an item is a list of [d, attrs] at its depth; on the sheets each item is its own part, in the app a few neighbours share their paths */
function l71Emit(parts,items,zb=0){items.sort((a,b)=>a.z-b.z);const ch=DET>=1.5?1:6;for(let i=0;i<items.length;i+=ch){const grp=items.slice(i,i+ch),m=new Map();let z=0;
  for(const it of grp){z+=it.z;for(const[d,a]of it.c){if(!d)continue;const k=JSON.stringify(a),e=m.get(k);if(e)e.d+=d;else m.set(k,{d,a})}}
  parts.push({z:z/grp.length+zb,fn:par=>{for(const{d,a}of m.values())E('path',Object.assign({d},a),par)}})}}
/* the vine itself. S: id, cm (sheet length), inter [base, tip] (cm), phy alt|opp|spiral, ang, w0, w1, cols(cw), twA twP (winding), zig, side {p, n, ang, u0},
   leaf(og, ctx) → parts, node(og, ctx), axil(og, ctx) → parts (with px(q, ctx): its chance), apex(og, ctx) → parts */
function l71Vine(g,t,o,S){const k=G(g),parts=[],op=Math.max(.05,Math.min(1,o.op??1)),cw=cwPick(S.cws,o),sv=seed,rs=!o.spine&&!!o.ax&&o.roll===0;
  if(rs)seed=f15Hash(S.id+'|'+(o.cm||0)+'|'+Math.round(op*20)+'|'+cw.id);
  const A=l71Path(o,S),Lt=A.L,cols=S.cols(cw),ctx={o,op,cw,A,Fr:A.Fr,down:A.down,up:A.up,S},sp=A.mode==='spine',fr0=sp?Math.max(0,o.from||0):0;
  /* where the nodes start: just out of the mouth for a drape, at once for a stem whose foot joins the bouquet's stems, after the bare cut end on a sheet */
  const a0=A.mode==='drape'?R(9,14):sp?(fr0>0?4:Lt*.05):S.bare*UPC,nodes=[];
  for(let a=a0;a<Lt-UPC*1.2;){nodes.push(a);const q=a/Lt;a+=UPC*(S.inter[0]+(S.inter[1]-S.inter[0])*q)*R(.82,1.18)}
  const nN=nodes.length,wAt=a=>Math.max(1.15,S.w0+(S.w1-S.w0)*Math.min(1,a/Math.max(Lt,40*UPC))),qOf=i=>nodes[i]/Lt;ctx.yz=.12+.3*(1-op);
  /* the main axis follows its path exactly, in chords; between two nodes a twiner's stem swings a little to the side of each node (a smooth zigzag) */
  const zig=S.zig||0,zs=a=>{if(!zig)return 0;let i=0;while(i<nN&&nodes[i]<a)i++;const lo=i?nodes[i-1]:0,hi=i<nN?nodes[i]:Lt,u=(a-lo)/((hi-lo)||1);return zig*((i%2?1:-1)*Math.cos(Math.PI*u))*Math.min(1,a/20)};
  const pAt=a=>{const r=A.at(a);if(!zig)return r.p;const[sx]=l71X(r.T,A.Fr);return V3.add(r.p,V3.sc(sx,zs(a)))};
  const chord=(a,b)=>{const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+7.5),p=pAt(x),q=pAt(y),d=V3s(q,p),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  const sd=S.side,ph0=R(0,360),phy=S.phy||'alt',rollAt=i=>phy==='opp'?(i%2?90:0):phy==='alt'?(i%2?90:-90)+R(-25,25):i*137.5;
  const leaves=(i,q,b)=>{const nl=phy==='opp'?2:1,r0=ph0+rollAt(i),out=[];for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:r0+j*180+R(-12,12)}],['&',{a:S.ang+R(-8,8)}],['Lv',{i,j,q,b}],[']',{}]);return out};
  const rules={A:p=>{const i=p.i;if(i>=nN)return[...chord(nN?nodes[nN-1]:0,Lt),['Ap',{q:1,b:0}]];return[...chord(i?nodes[i-1]:0,nodes[i]),['N',{i}],['A',{i:i+1}]]},
    N:p=>{const i=p.i,q=qOf(i),r0=ph0+rollAt(i),out=[['Nd',{i,q}],...leaves(i,q,0)];
      if(S.axil&&rnd()<S.px(q,ctx)){const nl=phy==='opp'?2:1;for(let j=0;j<nl;j++)if(!j||rnd()<.6)out.push(['[',{}],['/',{a:r0+j*180+R(-10,10)}],['&',{a:(S.xang||40)+R(-8,8)}],['X',{i,q,j}],[']',{}])}
      if(sd&&q>=(sd.u0||.1)&&q<.9&&rnd()<sd.p){const n=Math.round(R(sd.n[0],sd.n[1])),w=Math.max(1.15,wAt(nodes[i])*.62);if(n>0)out.push(['[',{w}],['/',{a:r0+(phy==='opp'?90:180)+R(-30,30)}],['&',{a:sd.ang+R(-10,10)}],['B',{n,n0:n,q,w}],[']',{}])}
      return out},
    B:p=>{const li=UPC*S.inter[1]*R(.75,1.05),qb=1-p.n/p.n0;if(p.n<=0)return[['F',{l:li*.6,w1:1.15,e:sd.e??.04}],['Ap',{q:1,b:1}]];
      return[['F',{l:li,w1:Math.max(1.15,p.w*(1-.5*qb)),e:sd.e??.04}],['Nd',{q:p.q,b:1}],...leaves(p.n+3,Math.min(1,p.q+.3*qb+.1),1),['B',Object.assign({},p,{n:p.n-1})]]}};
  const base=A.at(0),H0=V3.nz(V3s(pAt(Math.min(Lt,6)),pAt(0)));let U0=V3s(A.Fr,V3.sc(H0,V3.dot(A.Fr,H0)));if(V3l(U0)<1e-3)U0=A.up;U0=V3.nz(U0);
  const res=lsTurtle(lsDerive([['A',{i:0}]],rules,nN+(sd?sd.n[1]:0)+6),{p:base.p,H:H0,U:U0,w:wAt(0),T:A.down,e:0,wig:0,seg:7});
  for(const ch of res.chains)ch.c=cols;
  /* a stem rising from the mouth keeps every side shoot and organ above it */
  if(sp&&fr0===0){for(const ch of res.chains)if(ch.ord)for(const q of ch.pts)q[1]=Math.max(q[1],3);for(const og of res.organs)if(og.ord)og.pos[1]=Math.max(og.pos[1],3)}
  lsChainParts(res.chains,[0,0,0],cols,parts,{piece:DET>=1.5?8:15});
  for(const og of res.organs){const fn=og.t==='Lv'?S.leaf:og.t==='Ap'?S.apex:og.t==='X'?S.axil:og.t==='Nd'?S.node:null;if(!fn)continue;const r=fn(og,ctx);if(r)parts.push(...[].concat(r))}
  drawParts(k,parts);if(rs)seed=sv;open(k,t,1100,0,A.mode==='drape'?0:.4);
  const T0=H0,l=Math.hypot(T0[0],T0[1])||1;return{k,bw:Math.max(wAt(0)*1.15,2),bw1:wAt(0),bc:cols,neck:[base.p[0],-base.p[1]],nd:[-T0[0]/l,T0[1]/l]}}
/* the size of a leaf along the vine: full, then smaller toward the young tip (yz: the share of the young growth, longer at the bud stage) */
const l71Sz=(p,ctx)=>{const q=p.q??1,y0=1-ctx.yz;return q>y0?.34+.66*(1-q)/ctx.yz:1};
const l71Young=(p,ctx)=>{const q=p.q??1,y0=1-ctx.yz;return q>y0?(q-y0)/ctx.yz:0};
/* stem palettes */
const l71Cols=c=>{const P=pal7(c);return[P.d2,P.d1,P.b,P.l1]};
/* the twining tip: the last young internodes coil on themselves (a twiner seeking its support), two small folded leaves at the coil's foot */
function l71Curl(og,ctx,o){const H=og.H,[a]=l71X(H,ctx.Fr),sg=rnd()<.5?1:-1,sdv=V3.nz(V3.add(V3.sc(a,sg),V3.sc(ctx.down,.3))),r0=(o.r||4)*R(.85,1.15),n=12,P=[og.pos];let p=og.pos;
  for(let i=1;i<=n;i++){const t=i/n,th=t*Math.PI*(o.turn||1.7),r=r0*(1-.55*t);P.push(V3.add(og.pos,V3.add(V3.sc(H,Math.sin(th)*r+t*r0*.4),V3.sc(sdv,(1-Math.cos(th))*r))))}
  let z=0;for(const q of P)z+=q[2];return{z:z/P.length+.02,fn:par=>E('path',{d:'M'+P.map(l71Q).join('L'),stroke:o.c,'stroke-width':f(Math.max(1.15,o.w||1.2)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}}
/* a tendril: a short run, then a coil that tightens */
function l71Tendril(p0,H,dn,Ln,c){const n=LOD?8:DET>=1.5?20:13,r0=Ln*.22,sdv=V3.cr(H,dn),st=V3.add(p0,V3.sc(H,Ln*.35)),c0=V3.add(st,V3.sc(dn,r0)),P=[p0];
  for(let i=1;i<=n;i++){const t=i/n;if(t<=.35){P.push(V3.add(p0,V3.add(V3.sc(H,Ln*t),V3.sc(dn,Ln*.12*t*t))));continue}const s=(t-.35)/.65,th=s*Math.PI*2.6,r=r0*(1-.6*s);
    P.push(V3.add(c0,V3.add(V3.add(V3.sc(dn,-Math.cos(th)*r),V3.sc(H,Math.sin(th)*r)),V3.sc(sdv,s*r0*.6))))}
  let z=0;for(const q of P)z+=q[2];return{z:z/P.length,fn:par=>E('path',{d:'M'+P.map(l71Q).join('L'),stroke:c,'stroke-width':1.15,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}}
/* a berry on its pedicel, seen as a glossy sphere (shared radial fill per colour), its calyx scar, a glint */
function l71Berry(it,b,r,col,dir,o={}){const s=l71S(b),P=pal7(col);it.c.push([`M${f(s[0]-r)},${f(s[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`,{fill:budFill(col),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.5}]);
  if(LOD)return;const g=r*.28;it.c.push([`M${f(s[0]-r*.38-g)},${f(s[1]-r*.4)}a${f(g)},${f(g*.8)} 0 1,0 ${f(2*g)},0a${f(g)},${f(g*.8)} 0 1,0 ${f(-2*g)},0`,{fill:'#ffffff',opacity:o.gl??.55}]);
  if(DET>=1.5&&dir[2]>-.2){const c=V3.add(b,V3.sc(dir,r*.72)),q=l71S(c),rr=r*(o.cr??.26);it.c.push([`M${f(q[0]-rr)},${f(q[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`,{fill:'none',stroke:o.cc||P.d2,'stroke-width':.45,opacity:.85}])}}
/* a cluster of berries round a hub: n rays in a cone round d (spread th), each ending in a berry; the rays as one stroke, behind */
function l71Cluster(parts,hub,d,n,ray,r,col,pc,o={}){const[a,b]=l71X(d,[0,0,1]),items=[];let ped='';
  for(let i=0;i<n;i++){const th=(o.th??70)*D*Math.sqrt((i+.5)/n),ph=i*2.4+R(-.3,.3),dir=V3.nz(V3.add(V3.sc(d,Math.cos(th)),V3.sc(V3.add(V3.sc(a,Math.cos(ph)),V3.sc(b,Math.sin(ph))),Math.sin(th)))),
      L=ray*R(.8,1.15),bc=V3.add(hub,V3.sc(dir,L+r*.7)),it={z:bc[2],c:[]};
    if(L>.8)ped+=`M${l71Q(hub)}Q${l71Q(V3.add(hub,V3.add(V3.sc(dir,L*.55),V3.sc(d,L*.12))))} ${l71Q(V3.add(hub,V3.sc(dir,L+r*.2)))}`;l71Berry(it,bc,r*R(.9,1.08),o.cf?o.cf(i):col,dir,o);items.push(it)}
  if(ped)parts.push({z:hub[2]-.3,fn:par=>E('path',{d:ped,stroke:pc,'stroke-width':f(Math.max(1.15,o.pw||1.2)),fill:'none','stroke-linecap':'round'},par)});l71Emit(parts,items)}
/* the foliage colour of a leaf: its colourway, a little varied, paler and yellower when young */
const l71Lc=(c,young,yc)=>mix(mix(c,shd(c,R(-.1,.12)),.5),yc||mix(c,'#a8c050',.6),young*.55);
/* ---------- florists' smilax (Asparagus asparagoides): a very slender twining stem, green, slightly zigzag; at each node, in the axil of a tiny scale,
   one cladode (a flattened shoot doing the leaf's work): ovate, 1.5–3 cm, base rounded to subcordate, tip acute, glossy bright green, many fine parallel veins, almost sessile;
   alternate in two ranks, spread flat; a few short side shoots. Sold in strands of 1.5–2.5 m ('Myrtifolius', the « baby smilax », with smaller cladodes) ---------- */
const L71_CW_SMI=[{id:'vert',n:'Vert brillant',c:'#3f7a2e',lc:2.5},{id:'vert-tendre',n:'Vert tendre (jeunes pousses)',c:'#6a9a3a',lc:2.3},{id:'myrtifolius',n:'Myrtifolius (baby smilax, petits cladodes)',c:'#3a6e2c',lc:1.5}];
const L71_OL_SMI=[[0,.02],[.07,-.03],[.16,-.04],[.25,.03],[.32,.15],[.35,.3],[.33,.47],[.27,.64],[.18,.79],[.09,.91],[.03,.97],[0,1]];
const L71_V_SMI=[[[.06,.06],[.11,.3],[.1,.6],[.05,.88]],[[.13,.03],[.21,.25],[.2,.52],[.11,.8]]];
function l71Smilax(g,t,o){return l71Vine(g,t,o,{id:'smilax',cws:L71_CW_SMI,cm:150,bare:4,inter:[3,2.4],phy:'alt',ang:72,w0:1.45,w1:1.2,twA:1.2,twP:55,zig:1.1,cols:cw=>l71Cols(mix('#5f8f3c',cw.c,.35)),
    side:{p:.12,n:[2,4],ang:40,u0:.2,e:.03},
    leaf:(og,c)=>{const young=l71Young(og.p,c),L=c.cw.lc*UPC*l71Sz(og.p,c)*R(.86,1.12),col=l71Lc(c.cw.c,young),P=pal7(col),PB=pal7(mix(col,'#b8c8a0',.3));
      return l71Leaf(og,c.Fr,c.down,L,L71_OL_SMI,P,PB,{pl:0,gk:.12,face:.62,fold:.06+.4*young,arch:.06,dr:.06,tw:R(-.3,.3),sheet:{gloss:.9,veins:L71_V_SMI,vc:P.d1,vw:.3,vo:.35}})},
    apex:(og,c)=>{const col=mix(c.cw.c,'#a8c050',.45),P=pal7(col),out=[l71Curl(og,c,{c:mix('#5f8f3c',c.cw.c,.2),r:3.4,turn:1.9})];
      for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(rotA(og.H,og.U,s*.7))});out.push(l71Leaf(o2,c.Fr,c.down,c.cw.lc*UPC*.32,L71_OL_SMI,P,pal7(mix(col,'#c8d8a8',.3)),{fold:.6,arch:.1,dr:.02}))}return out}})}
/* ---------- southern smilax (Smilax smallii, « Jackson vine »): long wiry green stems that fall in heavy garlands; leaves alternate, 5–9 cm, lanceolate-ovate,
   base rounded, tip acuminate, leathery, deep glossy green, 3 (5) veins arching from the base to the tip; a short petiole whose sheath bears a pair of coiled tendrils.
   Cut in winter in the South-East of the United States, sold in strands of 1.5 to 3 m ---------- */
const L71_CW_SSM=[{id:'vert-fonce',n:'Vert foncé brillant',c:'#2f5a28'},{id:'vert',n:'Vert franc',c:'#3f6e30'},{id:'vert-olive',n:"Vert olive (fin d'hiver)",c:'#4f6230'}];
const L71_OL_SSM=[[0,0],[.08,.015],[.15,.08],[.19,.2],[.2,.34],[.18,.5],[.14,.65],[.09,.79],[.045,.9],[.012,.97],[0,1]];
const L71_V_SSM=[[[0,0],[.1,.22],[.12,.48],[.07,.76],[.012,.96]],[[.02,.01],[.16,.25],[.17,.48],[.1,.72],[.03,.9]]];
function l71Jackson(g,t,o){return l71Vine(g,t,o,{id:'ssmilax',cws:L71_CW_SSM,cm:180,bare:5,inter:[5.5,4],phy:'alt',ang:62,w0:1.9,w1:1.25,twA:1.8,twP:70,zig:1.4,cols:cw=>l71Cols(mix('#4f7f34',cw.c,.3)),
    side:{p:.16,n:[2,4],ang:38,u0:.2,e:.04},
    leaf:(og,c)=>{const young=l71Young(og.p,c),L=7*UPC*l71Sz(og.p,c)*R(.85,1.12),col=l71Lc(c.cw.c,young),P=pal7(col),PB=pal7(mix(col,'#a8b890',.32)),out=[];
      const lf=l71Leaf(og,c.Fr,c.down,L,L71_OL_SSM,P,PB,{pl:.9*UPC,pc:mix('#4f7f34',c.cw.c,.3),gk:.22,face:.6,fold:.1+.45*young,arch:.07,dr:.1,tw:R(-.3,.3),sheet:{gloss:1,veins:L71_V_SSM,vc:P.d1,vw:.45,vo:.5,veins1:1}});out.push(lf);
      /* the tendrils, from the petiole's sheath, on the younger part of the vine */
      if(!LOD&&(og.p.q??0)>.25&&rnd()<.45){const H=V3.nz(V3.add(og.H,V3.sc(c.Fr,.25))),[a]=l71X(H,c.Fr),dn=V3.sc(a,rnd()<.5?1:-1);out.push(l71Tendril(V3.add(og.pos,V3.sc(og.H,1.5)),H,dn,UPC*R(1.8,2.6),mix('#5f8f3c',c.cw.c,.2)))}
      return out},
    apex:(og,c)=>{const col=mix(c.cw.c,'#90b048',.4),P=pal7(col),out=[l71Curl(og,c,{c:mix('#4f7f34',c.cw.c,.2),r:4,turn:1.6,w:1.2})];
      out.push(l71Leaf(og,c.Fr,c.down,7*UPC*.28,L71_OL_SSM,P,pal7(mix(col,'#c8d8a8',.3)),{fold:.7,arch:.08,dr:.02}));return out}})}
/* ---------- ivy (Hedera helix): the creeping and climbing stem of the juvenile form, alternate leaves in two ranks on long petioles, the blades held flat to the light,
   3–5 lobed (the terminal lobe longest), base cordate, glossy dark green with pale veins, or variegated (cream, gold); tufts of aerial roots under the nodes.
   The adult form (flowering shoots, sold « en baies »): no roots, leaves entire, ovate-rhombic, in a spiral; at the tip, umbels of berries, green, then purple-black ---------- */
const L71_CW_IVY=[{id:'vert',n:'Vert foncé, nervures claires',c:'#26442a'},
 {id:'glacier',n:'Glacier (panaché gris-crème)',c:'#7a8c76',var:'#e8e6cc',vm:1,lob:.6},
 {id:'goldchild',n:'Goldchild (bordé doré)',c:'#4e7036',var:'#dcc85a',vm:1,lob:.7},
 {id:'goldheart',n:'Goldheart (cœur doré)',c:'#2c4a2a',var:'#d2c440',vm:0},
 {id:'baies-noires',n:'Arborescent en baies noires',c:'#2a4628',adult:1,fr:'#1d1b24',f:1},
 {id:'baies-vertes',n:'Arborescent en baies vertes',c:'#2e4c2c',adult:1,fr:'#6e8a46',fv:1,f:1}];
/* the juvenile outline: basal lobes, lateral lobes, the terminal lobe (lob: depth of the sinuses, 1 = five clear lobes) */
const l71IvyOl=lob=>{const s=lob;return[[0,-.03],[.09,-.1],[.19,-.12],[.27,-.09],[.3,-.06],[.3-.04*s,.0],[.3-.06*s,.05],[.37,.09],[.45,.14],[.5,.2],[.5,.23],[.43,.27],[.32-.05*s,.31],[.24-.06*s,.37],[.21,.47],[.17,.6],[.12,.73],[.07,.85],[.03,.94],[0,1]]};
const l71IvyIn=(ol,k)=>ol.map(([x,y])=>[x*k,.12+(y-.12)*k]);
const L71_OL_IVA=[[0,0],[.1,.03],[.2,.12],[.27,.27],[.28,.4],[.24,.54],[.17,.69],[.1,.82],[.04,.93],[0,1]];
const L71_V_IVY=[[[0,0],[.12,.08],[.28,.15],[.44,.21]],[[0,0],[.1,-.03],[.2,-.06],[.26,-.07]],[[0,.3],[.08,.36],[.14,.4]],[[0,.55],[.06,.6],[.1,.63]]];
const L71_V_IVA=[[[0,.02],[.1,.12],[.18,.24],[.22,.36]],[[0,.28],[.08,.38],[.14,.5]],[[0,.5],[.06,.6],[.1,.68]]];
function l71Ivy(g,t,o){const cw0=cwPick(L71_CW_IVY,o),ad=!!cw0.adult;
  return l71Vine(g,t,o,{id:'ivy',cws:L71_CW_IVY,cm:120,bare:5,inter:ad?[2.8,2.2]:[4.2,3.2],phy:ad?'spiral':'alt',ang:ad?50:68,w0:ad?3:2.5,w1:1.4,twA:.9,twP:80,zig:ad?0:1.2,
    cols:cw=>l71Cols(ad?'#6a6a48':'#665a44'),side:{p:ad?.1:.18,n:[2,4],ang:40,u0:.2,e:.035},
    leaf:(og,c)=>{const cw=c.cw,young=l71Young(og.p,c),sz=l71Sz(og.p,c),L=(ad?6.4:5.4)*UPC*sz*R(.86,1.1),col0=young>.3&&!ad?mix(cw.c,'#7a6a3a',.25*young):cw.c,col=l71Lc(col0,young,mix(cw.c,'#90a848',.5)),
        P=pal7(col),PB=pal7(mix(col,'#b0b890',.35)),ol=ad?L71_OL_IVA:l71IvyOl(cw.lob??1),inner=cw.var?{ol:cw.vm?l71IvyIn(ol,.72):l71IvyIn(ol,.42).map(([x,y])=>[x*1.1,y*.95+.02]),P:pal7(cw.vm?col:cw.var)}:null;
      /* variegated by its margin: the base of the blade is the pale colour, the inner field the green */
      const Pf=cw.var&&cw.vm?pal7(mix(cw.var,col,.08)):P;
      return l71Leaf(og,c.Fr,c.down,L,ol,Pf,PB,{pl:(ad?2.4:3.4)*UPC*sz,pc:mix('#5a4a3a',cw.c,.3),pw:1.3,gk:ad?.25:.42,face:.75,fold:ad?.08:.05,cup:ad?0:.05,arch:.05,dr:.05,tw:R(-.25,.25),
        sheet:{inner,gloss:.8,veins:ad?L71_V_IVA:L71_V_IVY,vc:ad?mix(col,'#c8d0a8',.3):mix(col,'#e4ecc8',cw.var?.35:.62),vw:ad?.4:.55,vo:ad?.45:.85,veins1:!ad}})},
    /* aerial roots: short brown tufts on the shaded side of the juvenile stem's nodes */
    node:ad?null:(og,c)=>{if(LOD||og.p.b||rnd()<.35)return null;const back=V3.nz(V3.add(V3.sc(c.Fr,-.8),V3.sc(c.down,.4))),[a]=l71X(og.H,back);let d='';
      for(let i=0;i<4;i++){const dir=V3.nz(V3.add(V3.add(back,V3.sc(a,R(-.9,.9))),V3.sc(og.H,R(-.4,.4)))),l=R(1.6,3.2),m=V3.add(og.pos,V3.add(V3.sc(dir,l*.5),V3.sc(a,R(-.6,.6))));d+=`M${l71Q(og.pos)}Q${l71Q(m)} ${l71Q(V3.add(og.pos,V3.sc(dir,l)))}`}
      return{z:og.pos[2]-.4,fn:par=>E('path',{d,stroke:'#7a6248','stroke-width':1.15,fill:'none','stroke-linecap':'round',opacity:.9},par)}},
    /* the adult form's umbels: a short raceme of them at the tip of the shoots, one now and then in an upper axil */
    axil:ad?(og,c)=>l71IvyUmb(og,c,1):null,px:(q,c)=>q>.6?.12:0,xang:35,
    apex:(og,c)=>{if(ad)return l71IvyUmb(og,c,og.p.b?1:Math.round(R(2,3)));const col=mix(c.cw.c,'#8a7a40',.35),P=pal7(col),out=[];
      for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(rotA(og.H,og.U,s*.55))});out.push(l71Leaf(o2,c.Fr,c.down,5*UPC*.3,l71IvyOl(c.cw.lob??1),P,pal7(mix(col,'#c8c0a0',.3)),{pl:3,pc:'#6a5a44',fold:.45,arch:.06,dr:.02}))}return out}})}
/* the umbels on their peduncle: a lone umbel's hub sits a little past the peduncle's end, so the peduncle runs on to it (never a gap) */
function l71IvyUmb(og,c,nu){const parts=[],cw=c.cw,op=c.op,ripe=cw.fv?0:op,col=ripe<.3?mix('#7e9a50',cw.fr,.15):ripe<.75?mix('#4a3048',cw.fr,.5):cw.fr,pc='#6a6a48';let st='';
  const d0=V3.nz(V3.add(V3.add(og.H,V3.sc(c.up,.6)),V3.sc(c.Fr,.35))),hub0=V3.add(og.pos,V3.sc(d0,UPC*R(1.4,2)));st+=`M${l71Q(og.pos)}L${l71Q(hub0)}`;
  for(let u=0;u<nu;u++){const[a,b]=l71X(d0,[0,0,1]),ph=u*2.4+R(-.4,.4),dd=nu>1?V3.nz(V3.add(V3.sc(d0,.75),V3.sc(V3.add(V3.sc(a,Math.cos(ph)),V3.sc(b,Math.sin(ph))),.65))):d0,
      hub=V3.add(hub0,V3.sc(dd,nu>1?UPC*R(1.6,2.6):UPC*.4));st+=nu>1?`M${l71Q(hub0)}Q${l71Q(V3.add(hub0,V3.sc(dd,UPC*.9)))} ${l71Q(hub)}`:`M${l71Q(hub0)}L${l71Q(hub)}`;
    l71Cluster(parts,hub,dd,Math.round(R(8,13)),UPC*R(.9,1.3),UPC*R(.36,.42)*(.75+.25*Math.min(1,op*1.5)),col,pc,{th:80,cc:'#3a3a2a',cr:.3,gl:ripe>.5?.6:.4,
      cf:ripe>.3&&ripe<.9?()=>mix(col,ripe<.6?'#6a8a46':cw.fr,R(0,.5)):null})}
  parts.push({z:hub0[2]-.4,fn:par=>E('path',{d:st,stroke:pc,'stroke-width':1.5,fill:'none','stroke-linecap':'round'},par)});return parts}
/* ---------- star jasmine (Trachelospermum jasminoides): a twining woody stem, red-brown when young; leaves opposite, elliptic to ovate, 4–7 cm, leathery, glossy deep green
   (reddened in winter; 'Variegatum' edged cream); in late spring, long-stalked axillary and terminal cymes of white flowers, scented: a narrow tube (8 mm) swollen at the middle,
   five spreading lobes twisted like a propeller (2–2.5 cm across), turning cream with age; the buds slender, their lobes wound in a spiral ---------- */
const L71_CW_TRA=[{id:'fleuri',n:'Fleuri blanc',c:'#22401f',fl:.78,f:1},{id:'boutons',n:'En boutons',c:'#24421f',fl:.1,f:1},{id:'toscana',n:'Star of Toscana (fleurs crème)',c:'#2a4824',fl:.7,flc:'#f4e8c0',f:1},
 {id:'feuillage',n:'Feuillage vert sombre',c:'#26442a'},{id:'variegatum',n:'Variegatum (bordé crème)',c:'#486a38',var:'#ebe4c4'},{id:'hiver',n:"Rougi d'hiver",c:'#74382a'}];
const L71_OL_TRA=[[0,0],[.07,.03],[.135,.12],[.175,.26],[.185,.42],[.17,.58],[.13,.73],[.08,.86],[.03,.95],[0,1]];
const L71_V_TRA=[[[0,.15],[.08,.24],[.14,.32]],[[0,.35],[.08,.44],[.14,.52]],[[0,.55],[.07,.63],[.12,.7]]];
function l71Trachelo(g,t,o){return l71Vine(g,t,o,{id:'trachelo',cws:L71_CW_TRA,cm:100,bare:5,inter:[5,3.6],phy:'opp',ang:62,w0:2.1,w1:1.25,twA:1.6,twP:60,zig:0,
    cols:cw=>l71Cols(cw.id==='hiver'?'#6a3a2e':'#6a4a36'),side:{p:.14,n:[2,3],ang:40,u0:.25,e:.035},
    leaf:(og,c)=>{const cw=c.cw,young=l71Young(og.p,c),L=5.6*UPC*l71Sz(og.p,c)*R(.86,1.1),col=l71Lc(cw.c,young,cw.id==='hiver'?'#a0602e':'#8aa848'),P=pal7(col),PB=pal7(mix(col,'#a8b890',.35)),
        inner=cw.var?{ol:L71_OL_TRA.map(([x,y])=>[x*.62,.06+y*.86]),P}:null;
      return l71Leaf(og,c.Fr,c.down,L,L71_OL_TRA,cw.var?pal7(mix(cw.var,col,.06)):P,PB,{pl:.5*UPC,pc:'#6a4a36',gk:.3,face:.6,fold:.12+.4*young,arch:.08,dr:.08,tw:R(-.3,.3),
        sheet:{inner,gloss:1,veins:L71_V_TRA,vc:P.d1,vw:.35,vo:.35}})},
    axil:(og,c)=>c.cw.fl?l71StarCyme(og,c,Math.round(R(5,10))):null,px:(q,c)=>c.cw.fl&&q>.2?.5:0,xang:35,
    apex:(og,c)=>{const out=[l71Curl(og,c,{c:'#7a4a3a',r:3.5,turn:1.5,w:1.2})];if(c.cw.fl)out.push(...l71StarCyme(og,c,Math.round(R(7,12))));
      else{const col=mix(c.cw.c,'#90a848',.4),P=pal7(col);for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(rotA(og.H,og.U,s*.6))});out.push(l71Leaf(o2,c.Fr,c.down,5.6*UPC*.3,L71_OL_TRA,P,pal7(mix(col,'#c8d8a8',.3)),{fold:.6,arch:.1,dr:.02}))}}return out}})}
/* a cyme: a long peduncle out of the axil, rising to the light; pedicels fanning from its forks, a flower or a bud on each */
function l71StarCyme(og,c,nf){const parts=[],items=[],cw=c.cw,op=c.op,fo=cw.fl*l71C01((op-.18)/.7),d0=V3.nz(V3.add(V3.add(og.H,V3.sc(c.up,.8)),V3.sc(c.Fr,.45))),pl=UPC*R(2.4,3.6),
    hub=V3.add(V3.add(og.pos,V3.sc(d0,pl)),V3.sc(c.up,pl*.08)),pc='#6a5a3a',sz=R(.92,1.08);let st=`M${l71Q(og.pos)}Q${l71Q(V3.add(og.pos,V3.add(V3.sc(og.H,pl*.35),V3.sc(d0,pl*.3))))} ${l71Q(hub)}`;
  const forks=[0,1,2].map(i=>{const[a,b]=l71X(d0,[0,0,1]),ph=i*2.1+R(-.3,.3),dd=V3.nz(V3.add(V3.sc(d0,.7),V3.sc(V3.add(V3.sc(a,Math.cos(ph)),V3.sc(b,Math.sin(ph))),.7))),q=V3.add(hub,V3.sc(dd,UPC*R(.6,1)));st+=`M${l71Q(hub)}L${l71Q(q)}`;return{q,dd}});
  for(let i=0;i<nf;i++){const fk=forks[i%3],[a,b]=l71X(fk.dd,[0,0,1]),ph=R(0,6.28),dir=V3.nz(V3.add(V3.add(V3.sc(fk.dd,.8),V3.sc(V3.add(V3.sc(a,Math.cos(ph)),V3.sc(b,Math.sin(ph))),R(.5,.9))),V3.sc(c.up,.25))),
      pe=V3.add(fk.q,V3.sc(dir,UPC*R(.5,1.1)));st+=`M${l71Q(fk.q)}L${l71Q(pe)}`;const open=rnd()<fo,a2=open?1:Math.min(1,op*1.15)*R(.6,1);items.push(l71Star(pe,dir,c,sz,open,a2,cw))}
  parts.push({z:hub[2]-.5,fn:par=>E('path',{d:st,stroke:pc,'stroke-width':1.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)});l71Emit(parts,items);return parts}
const L71_LOBE=[[.13,.05],[.4,.15],[.7,.25],[.9,.33],[.99,.25],[1,.06],[.93,-.1],[.77,-.25],[.52,-.32],[.29,-.25],[.13,-.08]];
function l71Star(p0,d,c,sz,open,a,cw){const it={z:p0[2],c:[]},wh=pal7(cw.flc||'#fbf9f3'),gs=pal7(mix('#5a7a3a','#8a6a4a',.3));
  /* the calyx: a small green cup at the top of the pedicel */
  const ca=l71S(p0);it.c.push([`M${f(ca[0]-1)},${f(ca[1])}a1,1 0 1,0 2,0a1,1 0 1,0 -2,0`,{fill:gs.d1}]);
  if(!open){/* the bud: the tube, then the lobes wound into a twisted spindle */
    const tl=(.75+.6*a)*UPC*sz,P3=[p0,V3.add(p0,V3.sc(d,tl*.35)),V3.add(p0,V3.sc(d,tl*.7)),V3.add(p0,V3.sc(d,tl))],P=P3.map(l71S),wf=i=>[.6,.7,.95+.3*a,.25][i]*sz,
      I=.62+R(-.06,.06),col=l71T(pal7(mix(cw.flc||'#f6f2ea','#e8d8c8',.15+.25*(1-a))),I);it.z=P3[2][2];
    it.c.push([polyRibbon(P,wf),{fill:col,stroke:shd(col,-.45),'stroke-width':.3}]);
    if(!LOD&&DET>=1.5){let sp='';for(let j=0;j<3;j++){const u=.5+j*.14,p=V3.add(p0,V3.sc(d,tl*u)),q=V3.add(p0,V3.sc(d,tl*(u+.16))),n=l71X(d,[0,0,1])[0];sp+=`M${l71Q(V3.add(p,V3.sc(n,-1)))}L${l71Q(V3.add(q,V3.sc(n,1)))}`}
      it.c.push([sp,{stroke:shd(col,-.3),'stroke-width':.3,fill:'none',opacity:.6}])}return it}
  /* the open flower: the tube, then five lobes spread like a propeller, facing out and up */
  const tl=.8*UPC*sz,m=V3.add(p0,V3.sc(d,tl)),Nf=V3.nz(V3.add(V3.add(V3.sc(d,.55),V3.sc(c.Fr,.55)),[R(-.25,.25),R(-.05,.3),0])),[Ux,Vx]=l71X(Nf,[0,1,0]),rl=1.15*UPC*sz*R(.92,1.06),ph=R(0,1.26),front=Nf[2]>=0;
  const P=[l71S(p0),l71S(m)],tub=polyRibbon(P,i=>i?1:.7),tc=toneAt(wh,.52);
  let lob='';for(let j=0;j<5;j++){const t=ph+j*1.2566,u=V3.add(V3.sc(Ux,Math.cos(t)),V3.sc(Vx,Math.sin(t))),v=V3.cr(Nf,u);
    lob+='M'+L71_LOBE.map(([x,y])=>l71Q(V3.add(V3.add(m,V3.sc(V3.add(V3.sc(u,x),V3.sc(v,y)),rl)),V3.sc(Nf,-rl*.1*x*x)))).join('L')+'Z'}
  const I=lightI(front?Nf:V3.sc(Nf,-1))+(front?0:-.08),lc=l71T(wh,Math.min(.95,I+.06)),ink=wh.d2,lobes=[lob,{fill:lc,stroke:ink,'stroke-width':.35,'stroke-opacity':.7,'stroke-linejoin':'round'}],tube=[tub,{fill:tc,stroke:wh.d1,'stroke-width':.3}];
  it.z=m[2];if(front){it.c.push(tube,lobes);if(!LOD){const q=l71S(m),r=.75*sz;it.c.push([`M${f(q[0]-r)},${f(q[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`,{fill:mix('#e8d8a0',lc,.35)}])}}
  else it.c.push(lobes,tube);return it}
/* ---------- honeysuckle (Lonicera periclymenum, L. japonica 'Halliana'): a twining stem, reddish; leaves opposite, ovate to elliptic, 4–7 cm, entire, blunt, grey-green beneath;
   at the tip of the shoots, whorled heads of tubular flowers, 4–5 cm, two-lipped (the upper lip four-lobed, the lower a single strap, both curled back), stamens and style
   far out of the mouth; red-purple or pink outside and cream within (periclymenum), white turning yellow (japonica), yellow ('Graham Thomas'); then clusters of red berries ---------- */
const L71_CW_LON=[{id:'serotina',n:'Serotina (pourpre et crème)',c:'#4a6e34',fl:.75,out:'#a8406a',inn:'#f6ecd4',age:'#ecd480',bud:'#98385c',f:1},
 {id:'belgica',n:'Belgica (rose et crème)',c:'#4c7234',fl:.75,out:'#d4809c',inn:'#f8e8dc',age:'#f0d890',bud:'#c86a8a',f:1},
 {id:'halliana',n:'Japonica Halliana (blanc puis jaune)',c:'#4e7a35',fl:.75,out:'#f4efe0',inn:'#fbf8ee',age:'#efcc62',bud:'#ece4c8',f:1},
 {id:'graham-thomas',n:'Graham Thomas (jaune)',c:'#527a38',fl:.75,out:'#f0d878',inn:'#f8eab0',age:'#e8b840',bud:'#e6d090',f:1},
 {id:'baies',n:'En baies rouges',c:'#4a6e30',fr:'#c8202a',f:1},{id:'feuillage',n:'Feuillage glauque',c:'#5e7f62'}];
const L71_OL_LON=[[0,0],[.08,.03],[.16,.12],[.22,.26],[.245,.42],[.235,.58],[.2,.73],[.14,.86],[.07,.95],[0,1]];
const L71_V_LON=[[[0,.12],[.1,.22],[.18,.32]],[[0,.32],[.1,.42],[.18,.52]],[[0,.52],[.09,.62],[.15,.7]]];
function l71Lonicera(g,t,o){const cw0=cwPick(L71_CW_LON,o),rich=!!(cw0.out||cw0.fr);return l71Vine(g,t,o,{id:'lonicera',cws:L71_CW_LON,cm:100,bare:5,inter:[5,3.8],phy:'opp',ang:64,w0:2.2,w1:1.3,twA:1.7,twP:55,zig:0,
    cols:()=>l71Cols('#7a4a3a'),side:rich?{p:.42,n:[1,3],ang:42,u0:.12,e:.03}:{p:.2,n:[2,3],ang:38,u0:.3,e:.03},
    /* japonica: its flowers in pairs on a short stalk in the upper leaf axils */
    axil:(og,c)=>c.cw.id==='halliana'?l71HoneyPair(og,c):null,px:(q,c)=>c.cw.id==='halliana'&&q>.25?.3:0,xang:40,
    leaf:(og,c)=>{const young=l71Young(og.p,c),L=5.6*UPC*l71Sz(og.p,c)*R(.86,1.1),col=l71Lc(c.cw.c,young),P=pal7(col),PB=pal7(mix(col,'#c0ccc0',.45));
      return l71Leaf(og,c.Fr,c.down,L,L71_OL_LON,P,PB,{pl:.4*UPC,pc:'#7a5a40',gk:.3,face:.6,fold:.1+.45*young,arch:.07,dr:.09,tw:R(-.3,.3),sheet:{gloss:.35,veins:L71_V_LON,vc:P.d1,vw:.35,vo:.32}})},
    apex:(og,c)=>{const cw=c.cw;if(cw.out)return l71HoneyHead(og,c,og.p.b?Math.round(R(5,8)):Math.round(R(8,13)));if(cw.fr)return l71HoneyBerries(og,c);
      const out=[l71Curl(og,c,{c:'#7a4a3a',r:3.5,turn:1.5,w:1.2})],col=mix(cw.c,'#90a848',.4),P=pal7(col);
      for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(rotA(og.H,og.U,s*.6))});out.push(l71Leaf(o2,c.Fr,c.down,5.6*UPC*.32,L71_OL_LON,P,pal7(mix(col,'#c8d8a8',.3)),{fold:.55,arch:.1,dr:.02}))}return out}})}
/* the head: under it a last pair of leaves (often joined round the stem); the flowers in one or two whorls, radiating out and up; outer ones open first */
function l71HoneyHead(og,c,nf){const parts=[],items=[],cw=c.cw,op=c.op,fo=cw.fl*l71C01((op-.2)/.65),H=V3.nz(V3.add(V3.sc(og.H,.6),V3.sc(c.up,.7))),hub=V3.add(og.pos,V3.sc(H,UPC*.5)),[a,b]=l71X(H,[0,0,1]);
  const lc=mix(cw.c,'#90a848',.15),P=pal7(lc);for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(V3.add(V3.sc(a,s),V3.sc(H,-.2)))});parts.push(l71Leaf(o2,c.Fr,c.down,3.2*UPC,L71_OL_LON,P,pal7(mix(lc,'#c0ccc0',.45)),{gk:.2,face:.5,fold:.15,arch:.05,dr:.05}))}
  for(let i=0;i<nf;i++){const ring=i<nf*.62?0:1,ph=i*2.39996+R(-.2,.2),el=ring?R(.5,.95):R(.05,.45),dir=V3.nz(V3.add(V3.sc(V3.add(V3.sc(a,Math.cos(ph)),V3.sc(b,Math.sin(ph))),Math.cos(el)),V3.sc(H,Math.sin(el)+.15))),
      open=ring?rnd()<fo*.55:rnd()<fo,age=open&&op>.8?(ring?R(0,.3):R(.2,1)):0;items.push(l71Honey(V3.add(hub,V3.sc(dir,.8)),dir,H,c,open,open?1:Math.min(1,.35+op*.8)*R(.7,1),age,cw))}
  /* the receptacle: a small knot of bracts and ovaries at the head's heart */
  const q=l71S(hub);parts.push({z:hub[2]-.2,fn:par=>E('path',{d:`M${f(q[0]-2)},${f(q[1])}a2,1.7 0 1,0 4,0a2,1.7 0 1,0 -4,0`,fill:pal7('#6a8a3a').d1},par)});
  l71Emit(parts,items);return parts}
function l71Honey(p0,d,Hh,c,open,a,age,cw){const it={z:p0[2],c:[]},sz=R(.92,1.08),Uu0=V3s(Hh,V3.sc(d,V3.dot(Hh,d)));const Uu=V3l(Uu0)>1e-3?V3.nz(Uu0):l71X(d,[0,0,1])[1];
  /* the tube, curving upward a little */
  const tl=(open?2.6:1.2+1.6*a)*UPC*sz,P3=[0,.25,.5,.75,1].map(t=>V3.add(V3.add(p0,V3.sc(d,tl*t)),V3.sc(Uu,tl*.12*t*t))),P=P3.map(l71S),out=pal7(mix(cw.out,cw.age,age*.8));
  const n=V3.nz(V3.cr(V3s(P3[3],P3[1]),[0,0,1])),I=lightI(V3.nz(V3.add(V3.sc(n,.5),[0,0,.8])))+R(-.05,.05),tc=l71T(open?out:pal7(cw.bud),I);
  if(!open){const wf=i=>[.62,.72,.85,1.15+.35*a,.75][i]*sz;it.c.push([polyRibbon(P,wf),{fill:tc,stroke:shd(tc,-.4),'stroke-width':.3}]);
    if(!LOD)it.c.push([polyRibbon(P.map(p=>[p[0]-.35,p[1]-.35]),i=>wf(i)*.35),{fill:shd(tc,.35),opacity:.6}]);it.z=P3[2][2];return it}
  const wf=i=>[.6,.68,.78,.95,1.2][i]*sz;const tube=[polyRibbon(P,wf),{fill:tc,stroke:out.d1,'stroke-width':.3}],m=P3[4],e=V3.nz(V3s(P3[4],P3[3])),Uv=V3.nz(V3s(Uu,V3.sc(e,V3.dot(Uu,e)))),Sd=V3.cr(e,Uv);
  /* the lips: arcs curling back from the mouth (upper toward the head's axis, the lower away), their inner face cream, their outer the colour of the tube */
  const inn=pal7(mix(cw.inn,cw.age,age)),lip=(wf,lob,sg,Ll,Wl,phi)=>{const tw=R(-.45,.45),Q=(s,t)=>{const th=t*phi,N=V3.add(V3.sc(e,-Math.sin(th)),V3.sc(Uv,sg*Math.cos(th))),a=tw*t,
        Sx=V3.add(V3.sc(Sd,Math.cos(a)),V3.sc(N,Math.sin(a))),Nx=V3.add(V3.sc(N,Math.cos(a)),V3.sc(Sd,-Math.sin(a))),w=s*Wl;
        return V3.add(V3.add(V3.add(m,V3.sc(Sx,w)),V3.sc(Nx,-.5*w*w/Wl*(.4+t))),V3.sc(V3.add(V3.sc(e,Math.sin(th)),V3.sc(Uv,sg*(1-Math.cos(th)))),Ll/phi))};
      /* the inner face: the one that looks at the other lip where the lips leave the mouth */
      const nrm=(t)=>V3.cr(V3s(Q(.2,t),Q(-.2,t)),V3s(Q(0,t+.05),Q(0,t-.05))),s0=Math.sign(V3.dot(nrm(.06),V3.sc(Uv,-sg)))||1,out2=[];
      for(const[t0,t1]of DET>=1.5?[[0,.5],[.46,1]]:[[0,1]]){const T=[0,1,2,3,4].map(i=>t0+(t1-t0)*i/4),L=T.map(t=>Q(-wf(t),t)),Rr=T.map(t=>Q(wf(t),t)).reverse(),tip=t1===1?lob.map(([u,dv])=>Q(u*wf(1),1+dv)):[],P3l=L.concat(tip,Rr);
        const nin=V3.nz(V3.sc(nrm(t1-t0>.6?.3:(t0+t1)/2),s0)),seen=nin[2]>=0,Ii=lightI(seen?nin:V3.sc(nin,-1)),pal=seen?inn:out,col=l71T(pal,Ii+.04);let z=0;for(const q of P3l)z+=q[2];
        out2.push({z:z/P3l.length,c:[smooth(P3l.map(l71S)),{fill:col,stroke:pal.d1,'stroke-width':.3,'stroke-linejoin':'round'}]})}return out2};
  const Wl=1.1*UPC*.78*sz,up=lip(t=>.42+.2*Math.sin(Math.PI*Math.min(1,t*1.15)/2),[[-.75,.02],[-.5,.06],[-.25,0],[0,.06],[.25,0],[.5,.06],[.75,.02]],1,1.6*UPC*sz,Wl,2.3),
    lo=lip(t=>.16+.04*Math.sin(Math.PI*t),[[0,.06]],-1,1.55*UPC*sz,Wl,2.6);
  /* stamens and style: long, fine, out of the mouth, curving up; anthers across their tips */
  let fi='',an='',sg2='';const sl=2.2*UPC*sz;for(let j=0;j<6;j++){const st=j===5,dv=V3.nz(V3.add(V3.add(e,V3.sc(Uv,(st?.1:.22)+R(-.08,.12))),V3.sc(Sd,st?R(-.05,.05):(j-2)*.17+R(-.04,.04)))),L=sl*(st?1.2:R(.85,1)),q0=V3.add(m,V3.sc(e,-1)),
      q1=V3.add(V3.add(m,V3.sc(dv,L*.55)),V3.sc(Uv,L*.06)),q2=V3.add(V3.add(m,V3.sc(dv,L)),V3.sc(Uv,L*.2));fi+=`M${l71Q(q0)}Q${l71Q(q1)} ${l71Q(q2)}`;
    const s2=l71S(q2);if(st)sg2+=`M${f(s2[0]-1.1)},${f(s2[1])}a1.1,1.1 0 1,0 2.2,0a1.1,1.1 0 1,0 -2.2,0`;else{const ax=l71S(V3.add(q2,V3.sc(Sd,.65))),bx=l71S(V3.add(q2,V3.sc(Sd,-.65)));an+=`M${f(ax[0])},${f(ax[1])}L${f(bx[0])},${f(bx[1])}`}}
  const fil=[fi,{stroke:mix(cw.inn,'#d8c8a0',.45),'stroke-width':1.1,fill:'none','stroke-linecap':'round'}],ant=[an,{stroke:'#c09a3a',fill:'none','stroke-width':1.3,'stroke-linecap':'round'}],stg=[sg2,{fill:'#7a9a3e'}];
  const segs=[{z:P3[2][2],c:tube},...up,...lo,{z:m[2]+(e[2]>0?.6:-.6),c:fil},{z:m[2]+(e[2]>0?.62:-.62),c:ant},{z:m[2]+(e[2]>0?.63:-.63),c:stg}].sort((x,y)=>x.z-y.z);it.c=segs.map(s=>s.c);if(LOD)it.c=it.c.filter(c=>c!==fil&&c!==ant&&c!==stg);it.z=m[2];return it}
function l71HoneyPair(og,c){const parts=[],items=[],cw=c.cw,op=c.op,fo=cw.fl*l71C01((op-.2)/.65),d0=V3.nz(V3.add(V3.add(og.H,V3.sc(c.up,.5)),V3.sc(c.Fr,.4))),hub=V3.add(og.pos,V3.sc(d0,UPC*.5)),[a]=l71X(d0,[0,0,1]);
  for(const s of[-1,1]){const dir=V3.nz(V3.add(V3.add(d0,V3.sc(a,s*R(.35,.6))),V3.sc(c.up,.3))),open=rnd()<fo,age=open&&op>.8?R(0,1):0;items.push(l71Honey(hub,dir,c.up,c,open,open?1:Math.min(1,.35+op*.8)*R(.7,1),age,cw))}
  parts.push({z:hub[2]-.3,fn:par=>E('path',{d:`M${l71Q(og.pos)}L${l71Q(hub)}`,stroke:'#6a5a3a','stroke-width':1.3,fill:'none','stroke-linecap':'round'},par)});l71Emit(parts,items);return parts}
/* after the flowers: a tight cluster of glossy berries at the tip of the shoot, green, then orange, then scarlet */
function l71HoneyBerries(og,c){const parts=[],cw=c.cw,op=c.op,col=op<.3?'#8aa84a':op<.7?'#e07a2a':cw.fr,H=V3.nz(V3.add(V3.sc(og.H,.6),V3.sc(c.up,.6))),hub=V3.add(og.pos,V3.sc(H,UPC*.4)),[a]=l71X(H,[0,0,1]),lc=mix(cw.c,'#90a848',.15);
  for(const s of[-1,1]){const o2=Object.assign({},og,{H:V3.nz(V3.add(V3.sc(a,s),V3.sc(H,-.2)))});parts.push(l71Leaf(o2,c.Fr,c.down,3*UPC,L71_OL_LON,pal7(lc),pal7(mix(lc,'#c0ccc0',.45)),{gk:.2,face:.5,fold:.15,arch:.05,dr:.05}))}
  l71Cluster(parts,hub,H,Math.round(R(8,12)),UPC*.45,UPC*.46*(.8+.2*op),col,'#7a5a3a',{th:75,cc:'#5a3a2a',cr:.18,gl:.7,cf:op>.3&&op<.95?()=>mix(col,cw.fr,R(0,.6)):null});return parts}
/* ---------- registers ---------- */
Object.assign(GH,{'asparagus-asparagoides-smilax':l71Smilax,'smilax-smallii-southern-smilax':l71Jackson,'hedera-helix-lierre':l71Ivy,'trachelospermum-jasmin-etoile':l71Trachelo,'lonicera-chevrefeuille':l71Lonicera});
Object.assign(CWS,{'asparagus-asparagoides-smilax':L71_CW_SMI,'smilax-smallii-southern-smilax':L71_CW_SSM,'hedera-helix-lierre':L71_CW_IVY,'trachelospermum-jasmin-etoile':L71_CW_TRA,'lonicera-chevrefeuille':L71_CW_LON});
Object.assign(SZG,{'asparagus-asparagoides-smilax':[100,150,200,250],'smilax-smallii-southern-smilax':[150,180,240,300],'hedera-helix-lierre':[60,90,120,150],'trachelospermum-jasmin-etoile':[60,80,100,120],'lonicera-chevrefeuille':[60,80,100,120]});
for(const s of['asparagus-asparagoides-smilax','smilax-smallii-southern-smilax','hedera-helix-lierre','trachelospermum-jasmin-etoile','lonicera-chevrefeuille'])GHI[s]={form:'retombante',size:2,k:'drape',self:100*UPC};
