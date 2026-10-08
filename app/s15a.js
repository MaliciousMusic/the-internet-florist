/* ================= Serre, lot 15 — Feuillages 1, grandis par le L-système : eucalyptus stabilisé, eucalyptus cinerea, eucalyptus parvifolia, asparagus plumosus, ruscus séché teint ================= */
/* ---------- the foliage engine: a cut stem grown by the L-system — its main axis (along the composer's spine in a bouquet, standing in the view on a sheet or a card),
   its nodes (decussate pairs or an alternate spiral), side shoots, leaves as curved 3D blades, drawn far to near; like the spikes it hands back {k, bw, bw1, bc}
   (bw, bc: the width and colours of its stem at the mouth, bw1 its width where a cluster's drawing starts, so the stems below go on with them) ---------- */
/* a blade at P0, along Ax, its face N (unit, ⊥ Ax), its width axis W = N × Ax; len, half-width hw·wp(v); arch (the midrib rising along N, ×len), fold (the halves rising toward the margins, a V),
   cup (across, u²), droop (sagging along −y under its weight, ×len·v²), curl (the tip turning toward N, ×len·v³), tw (the width axis turning round the midrib along v, radians) */
function f15BladeS(P0,Ax,N,len,hw,wp,o={}){const W=V3.cr(N,Ax),ar=o.arch||0,fo=o.fold||0,cu=o.cup||0,dr=o.droop||0,cl=o.curl||0,tw=o.tw||0;
  return(u,v)=>{const w=hw*wp(v),a=tw*v,c=Math.cos(a),s=Math.sin(a),h=len*ar*Math.sin(Math.PI*v)+w*(fo*Math.abs(u)+cu*u*u)+len*cl*v*v*v,x=len*v,uw=u*w;
    return[P0[0]+Ax[0]*x+(W[0]*c+N[0]*s)*uw+(N[0]*c-W[0]*s)*h,P0[1]+Ax[1]*x+(W[1]*c+N[1]*s)*uw+(N[1]*c-W[1]*s)*h-len*dr*v*v,P0[2]+Ax[2]*x+(W[2]*c+N[2]*s)*uw+(N[2]*c-W[2]*s)*h]}}
/* the face of a blade between u=a and u=b, at mid-length (view space, toward its upper side N) */
const f15Nrm=(S,a,b,v=.5)=>{const m=(a+b)/2,du=V3s(S(b,v),S(a,v)),dv=V3s(S(m,Math.min(1,v+.12)),S(m,Math.max(0,v-.12))),n=V3.cr(dv,du);return V3l(n)>1e-9?V3.nz(n):[0,0,1]};
/* the tone a face turns to the light: lit up-left, the colour itself face on; matte surfaces (bloom, dried, preserved) keep a shorter range */
const f15Tone=(P,PB,n,mt=.8)=>{const f=n[2]>=0,I=lightI(f?n:V3.sc(n,-1));return toneAt(f?P:PB,.6+(I-.6)*mt)};
/* one blade as a part of the painter's order: its outline taken row by row as the extreme points across its midrib (its true silhouette, edge-on too),
   filled flat with the tone of its face (no gradient); on sheets (DET 2) its two halves folded on the midrib, each with its own tone, the midrib and the side veins */
const F15_U5=[-1,-.5,0,.5,1];
function f15Blade(S,P,PB,o={}){const nv=o.nv||(DET>=1.5?8:5),rows=[];let z=0;
  for(let i=0;i<=nv;i++){const v=i/nv,r=F15_U5.map(u=>{const p=S(u,v);return[p[0],-p[1],p[2]]});rows.push(r);z+=r[2][2]}z/=nv+1;
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=rows[Math.max(0,i-1)][2],b=rows[Math.min(nv,i+1)][2];let px=-(b[1]-a[1]),py=b[0]-a[0];if(Math.hypot(px,py)<1e-6){px=rows[i][4][0]-rows[i][0][0];py=rows[i][4][1]-rows[i][0][1]}
    const m=Math.hypot(px,py)||1;px/=m;py/=m;let mn=1e9,mx=-1e9,pl=rows[i][0],pr=rows[i][4];const c=rows[i][2];for(const q of rows[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push([pl[0],pl[1]]);Rt.push([pr[0],pr[1]])}
  if(o.sharp){const e=rows[nv][2];Lf.push([e[0],e[1]])}
  const out=Lf.concat(Rt.reverse()),nC=f15Nrm(S,-1,1),mt=o.mt??.8,tc=f15Tone(P,PB,nC,mt),lite=h2l(tc)[2]>.76,ink=o.ink||shd(tc,-.5),eo=o.eo??(lite?.85:.45);
  return{z:z+(o.zb||0),cast:false,fn:par=>{const d=smooth(out);
    if(DET>=1.5&&!LOD&&!o.flat){const half=j=>{const q=[];for(let i=0;i<=nv;i++)q.push([rows[i][j][0],rows[i][j][1]]);for(let i=nv;i>=0;i--)q.push([rows[i][2][0],rows[i][2][1]]);return q},
        hs=[[0,f15Nrm(S,-1,0),rows.reduce((s,r)=>s+r[0][2],0)],[4,f15Nrm(S,0,1),rows.reduce((s,r)=>s+r[4][2],0)]].sort((a,b)=>a[2]-b[2]);
      for(const[j,n]of hs)E('path',{d:smooth(half(j)),fill:f15Tone(P,PB,n,mt)},par);
      if(o.mid)E('path',{d:smooth(rows.slice(0,nv).map(r=>[r[2][0],r[2][1]]),false),stroke:o.mid,'stroke-width':f(o.mw||.45),'stroke-opacity':o.mo??.45,fill:'none','stroke-linecap':'round'},par);
      /* the side veins, curves in the blade's own (u, v) */
      if(o.veins){let dv='';for(const L of o.veins){const q=L.map(([u,v])=>{const p=S(u,v);return[p[0],-p[1]]});dv+=smooth(q,false)}E('path',{d:dv,stroke:o.vc||o.mid||ink,'stroke-width':f(o.vw||.3),'stroke-opacity':o.vo??.3,fill:'none','stroke-linecap':'round'},par)}
      /* the waxy bloom of a glaucous leaf: one shared soft light over the blade, brightest a little up-left of its centre */
      if(o.bloom)E('path',{d,fill:f15BloomFill(),opacity:o.bloom},par);
      E('path',{d,fill:'none',stroke:ink,'stroke-width':o.ew||.42,'stroke-opacity':Math.min(.85,eo+.05),'stroke-linejoin':'round'},par)}
    else E('path',LOD&&!lite?{d,fill:tc}:{d,fill:tc,stroke:ink,'stroke-width':o.ew||.4,'stroke-opacity':eo,'stroke-linejoin':'round'},par)}}}
let F15_BLOOM=null;function f15BloomFill(){if(F15_BLOOM&&document.getElementById(F15_BLOOM))return`url(#${F15_BLOOM})`;F15_BLOOM='f15b'+(gid++);const gr=E('radialGradient',{id:F15_BLOOM,cx:.4,cy:.36,r:.7},defs);stops(gr,[[0,'#ffffff',.5],[.55,'#ffffff',.18],[1,'#ffffff',0]]);return`url(#${F15_BLOOM})`}
/* the lowest point a blade reaches on the screen (y down), to keep a bouquet stem's leaves above the mouth they leave */
const f15Low=S=>{let y=-1e9;for(const v of[.25,.5,.75,1])for(const u of[-1,0,1])y=Math.max(y,-S(u,v)[1]);return y};
/* a leaf that would hang below the mouth is shortened, or left out when it would get too small */
function f15Fit(mk,len,lim){if(lim==null)return mk(len);for(const k of[1,.8,.62]){const S=mk(len*k);if(f15Low(S)<=lim)return S}return null}
/* the face of a leaf at an organ of the turtle: ρ = 0 holds the blade along the stem (eucalyptus and ruscus turn their blades on edge), ρ = 90° flat with its upper side toward the tip;
   sg = ±1 its side (the two leaves of a pair turn the same way, like one disc pierced by the stem) */
const f15Face=(og,rho,sg=1)=>V3.nz(V3.add(V3.sc(og.L,-sg*Math.cos(rho)),V3.sc(og.U,Math.sin(rho))));
/* a little deterministic hash, so a sheet shows the same stem from every side */
const f15Hash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%2147483;return h*48271%2147483647||1};
/* ---------- the stem: grown node by node by the rules
     A(i)  → F…F N(i) A(i+1)            (the main axis: along the spine in a bouquet, free with its tropism on a sheet; then the apex)
     N(i)  → [ /φᵢ &α Lv ] (twice, opposite, for decussate pairs)  [ /φ' &β B(n) ] (a side shoot, at chosen nodes)
     B(n)  → F M(n) B(n−1)       M(n) → [ /φ &α Lv ]…        B(0) → F Ap
   S: id, len (cm), leafy (share of the stem bearing leaves), inter [base, tip] (cm), opp, div (spiral angle), ang [base, tip] (leaf angle to the stem),
      w0, w1 (widths), cols (stem colours), e (tropism of the main axis on a sheet, < 0 droops), wig, zig (a zigzag at each node, degrees), br {zone:[a,b], p, max, n:[a,b], li (cm), ang, eb, ls},
      leaf(og, lim) → parts (a blade, a frond), apex(og) → parts.
   o.cm on a sheet: a trade grade (the length of the cut stem, cm) when above 15; the recipe's own cm (a leaf size) means the usual length ---------- */
/* the axes as parts of the painter's order: each chain cut into pieces (each at its own depth), smoothed, drawn as a tapered ribbon lit from the upper left:
   three tones on a stout stem, two on a fine one, one on a twig in a bouquet or in thumbnails */
function f15Chains(chains,cols,parts,mx){for(const ch of chains){const n=ch.pts.length,c=ch.c||cols;for(let a=0;a<n-1;a+=mx-1){const b=Math.min(n-1,a+mx-1),P=[],W=[];let z=0;
    for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2];if(i===a){P.push([q[0],-q[1]]);W.push(ch.ws[i]);continue}
      const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[.5]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);P.push([cr(0),-cr(1)]);W.push((ch.ws[i-1]+ch.ws[i])/2)}P.push([q[0],-q[1]]);W.push(ch.ws[i])}
    const wm=Math.max(...W);parts.push({z:z/(b-a+1),cast:false,fn:par=>{const wf=i=>W[i]/2;E('path',{d:polyRibbon(P,wf),fill:c[0]},par);if(LOD||DET<1.5&&wm<1.6)return;
      if(wm>2){E('path',{d:polyRibbon(P,i=>wf(i)*.66,i=>wf(i)*.26),fill:c[1]},par);E('path',{d:polyRibbon(P,i=>wf(i)*.24,i=>wf(i)*.44),fill:c[2],opacity:.85},par)}
      else E('path',{d:polyRibbon(P,i=>wf(i)*.5,i=>wf(i)*.3),fill:c[2],opacity:.8},par)}})}}}
function f15Sprig(g,t,o,S){const k=G(g),parts=[],sp=o.spine,fr=sp?Math.max(0,Math.min(.92,o.from||0)):0,op=Math.max(.05,Math.min(1,o.op??1)),sv=seed;
  const rs=!sp&&!!o.ax&&o.roll===0;if(rs)seed=f15Hash(S.id+'|'+(o.cm||0)+'|'+Math.round(op*20));
  let P0=[0,0,0],H0,U0,Lt,pts=null,cum=null,af=0;
  if(sp){af=fr>0?blen(bseg(sp,0,fr)):0;const N=48;pts=[];for(let i=0;i<=N;i++){const q=bz(sp,fr+(1-fr)*i/N);pts.push([q[0],-q[1],0])}cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));Lt=cum[N];P0=pts[0];H0=V3.nz(V3s(pts[1],pts[0]));U0=[0,0,1]}
  else{const B=frameOf(o,0),U=toV(B,[0,0,1]);Lt=(o.cm>15?o.cm:S.len)*UPC*(.62+.38*op);H0=rotA(toV(B,[0,1,0]),U,R(-.07,.07));U0=U}
  const at=a=>{let i=1;while(i<cum.length-1&&cum[i]<a)i++;const t2=Math.max(0,Math.min(1,(a-cum[i-1])/((cum[i]-cum[i-1])||1)));return V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t2))};
  /* where the leaves start: above the mouth for a stem rising from it, at once for the top of a stem whose foot joins the bouquet's stems, above the bare foot on a sheet */
  const a0=sp?(fr>0?Lt*.04:Math.max(Lt*(1-S.leafy),Lt*.17)):Lt*(1-S.leafy),nodes=[];
  for(let a=a0;a<Lt-UPC*(S.tip??1);){nodes.push(a);const q=(a-a0)/Math.max(1,Lt-a0);a+=UPC*(S.inter[0]+(S.inter[1]-S.inter[0])*q)*R(.86,1.14)*(.75+.25*op)}
  const nN=nodes.length,qOf=i=>nN>1?i/(nN-1):1,wAt=a=>S.w1+(S.w0-S.w1)*Math.pow(Math.max(0,1-(af+a)/(af+Lt)),.85),w0=wAt(0);
  const chord=(a,b)=>{if(!sp)return[['F',{l:Math.max(.5,b-a),w1:wAt(b),e:S.e??0}]];const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+8),p=at(x),q=at(y),d=V3s(q,p),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  /* side shoots: at chosen nodes in their zone, alternating sides */
  const br=S.br,brAt=new Map();if(br){let c=0;for(let i=0;i<nN&&c<br.max;i++){const q=qOf(i);if(q>=br.zone[0]&&q<=br.zone[1]&&rnd()<br.p){brAt.set(i,c++);i+=br.gap||1}}}
  const ph0=R(0,360),angAt=q=>S.ang[0]+(S.ang[1]-S.ang[0])*q,nl=S.opp?2:1,div=S.opp?90:S.div||137.5;
  const leaves=(i,q,s,ph,ang)=>{const out=[];for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:ph+j*180+R(-9,9)}],['&',{a:ang+R(-7,7)}],['Lv',{i,j,q,s}],[']',{}]);return out};
  const rules={A:p=>{const i=p.i;if(i>=nN)return[...chord(nN?nodes[nN-1]:0,Lt),['Ap',{q:1}]];return[...chord(i?nodes[i-1]:0,nodes[i]),['N',{i}],...(S.zig?[['+',{a:(i%2?1:-1)*S.zig}]]:[]),['A',{i:i+1}]]},
    N:p=>{const i=p.i,q=qOf(i),ph=ph0+i*div+R(-8,8),out=leaves(i,q,1,ph,angAt(q));
      if(brAt.has(i)){const c=brAt.get(i),n=Math.round(R(br.n[0],br.n[1])*(1-.35*q)),li=br.li*UPC;if(n>0)out.push(['[',{w:Math.max(S.w1,wAt(nodes[i])*(br.wk||.55))}],['/',{a:ph+(S.opp?90:70)+(c%2?180:0)+R(-25,25)}],['&',{a:br.ang+R(-8,8)}],['B',{n,n0:n,li,q,w:wAt(nodes[i])*(br.wk||.55)}],[']',{}])}
      return out},
    B:p=>{if(p.n<=0)return[['F',{l:p.li*.55,w1:S.w1*.75,e:br.eb}],['Ap',{q:1,b:1}]];const qb=1-p.n/p.n0;
      return[['F',{l:p.li*R(.85,1.15)*(1-.3*qb),w1:Math.max(S.w1*.8,p.w*(1-.6*qb)),e:br.eb}],['M',{n:p.n,qb,q:p.q}],...(S.zig?[['+',{a:(p.n%2?1:-1)*S.zig}]]:[]),['B',Object.assign({},p,{n:p.n-1})]]},
    M:p=>leaves(-1,Math.min(1,p.q+.5*p.qb),br.ls||.85,R(0,360)+p.n*div,angAt(Math.min(1,p.q+.4+.4*p.qb)))};
  const mods=lsDerive([['A',{i:0}]],rules,nN+(br?br.n[1]:0)+4),res=lsTurtle(mods,{p:P0,H:H0,U:U0,w:w0,T:[0,1,0],e:0,wig:S.wig||0,seg:7});
  for(const ch of res.chains)ch.c=S.cols;
  /* in a bouquet, a stem rising from the mouth keeps every leaf above it (nothing hangs behind the vessel) */
  const lim=sp&&fr===0?-3:null;
  for(const og of res.organs){const pp=og.t==='Lv'?S.leaf(og,lim):og.t==='Ap'&&S.apex?S.apex(og):null;if(pp)parts.push(...pp)}
  f15Chains(res.chains,S.cols,parts,sp?16:8);drawParts(k,parts);if(rs)seed=sv;
  open(k,t,1000,0,.4);return{k,bw:S.w0,bw1:fr>0?w0:undefined,bc:S.cols}}
/* the stem colours of a dyed or preserved stem: the dye taken darker, a little browner */
const f15DyeStem=c=>{const b=mix(c,'#5a4632',.18);return[shd(b,-.72),shd(b,-.45),shd(b,-.18),shd(b,.25)]};
/* ---------- eucalyptus: the cinerea ('silver dollar') grows its juvenile round leaves in decussate pairs, sessile, their broad bases meeting round a reddish stem, under a glaucous powdery bloom;
   the parvifolia carries small lance-shaped leaves alternate in a dense spiral on fine reddish branchlets, a little hanging; the trade preserves and dyes both (matte leaves, a supple stem) ---------- */
const EU_RND=prof([[0,.36],[.1,.76],[.3,.97],[.5,1],[.72,.85],[.88,.54],[1,.04]]),EU_LAN=prof([[0,.1],[.14,.6],[.34,.95],[.5,1],[.72,.76],[.9,.34],[1,.02]]);
/* side veins (u, v): eucalyptus leaves have fine lateral veins at an acute angle, joined near the margin by an intramarginal vein */
const EU_VR=[0,1,2,3].map(k=>{const v=.18+.17*k;return[[0,v],[.42,v+.08],[.8,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]).concat([[[.8,.12],[.88,.45],[.62,.84]],[[-.8,.12],[-.88,.45],[-.62,.84]]]),
  EU_VL=[0,1,2].map(k=>{const v=.2+.22*k;return[[0,v],[.5,v+.12],[.86,v+.26]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]);
/* the two leaf forms: round (cinerea) and lanceolate (parvifolia) */
const EU_M={c:{ls:5.4,wr:.94,wp:EU_RND,pet:0,rho:36,arch:.05,fold:.07,cup:.14,droop:.05,curl:.05,tw:0,mt:.62,tipK:.66,veins:EU_VR},
  p:{ls:4.4,wr:.25,wp:EU_LAN,pet:.4,rho:12,arch:.07,fold:.13,cup:.04,droop:.2,curl:-.03,tw:.4,mt:.74,tipK:.58,veins:EU_VL}};
/* one eucalyptus leaf at an organ: its size falls toward the tip, the youngest leaves paler with bloom (natural) or the dye a little uneven (preserved) */
function eucLeaf(og,lim,M,col,o={}){const p=og.p,q=p.q??0,sz=M.ls*UPC*(1-M.tipK*Math.pow(q,1.5))*(p.s||1)*R(.9,1.08),Hd=og.H,sg=p.j?-1:1,rho=(M.rho+R(-14,14))*D,N=f15Face(og,rho,o.opp?sg:(rnd()<.5?1:-1)),
    c=o.dyed?mix(col,shd(col,R(-.14,.1)),.6):mix(col,o.young||lt(col,.3),Math.max(0,q-.45)*.7+R(-.06,.08)),cb=o.dyed?shd(c,.06):mix(c,o.back||'#d6ded8',.22),
    P0=V3.add(og.pos,V3.sc(Hd,M.pet&&DET>=1.5&&!LOD?M.pet*UPC:og.w*.35)),mk=len=>f15BladeS(P0,Hd,N,len,len*M.wr*.5,M.wp,{arch:M.arch,fold:M.fold,cup:M.cup,droop:M.droop*(o.soft||1),curl:M.curl,tw:M.tw*R(-1,1)}),S=f15Fit(mk,sz,lim);
  if(!S)return null;const P=pal7(c),PB=pal7(cb),mid=o.dyed?shd(c,.18):mix(c,'#efe6d8',.45),parts=[f15Blade(S,P,PB,{mt:o.dyed?.72:M.mt,mid:DET>=1.5?mid:null,veins:DET>=1.5?M.veins:null,vc:mid,vo:.28,ink:o.ink,bloom:o.bloom})];
  /* the short petiole of the lanceolate leaf (on sheets; in a bouquet the blade starts at the node) */
  if(M.pet&&DET>=1.5&&!LOD){const a=og.pos,b=P0;parts.push({z:(a[2]+b[2])/2-.01,cast:false,fn:par=>E('path',{d:`M${f(a[0])},${f(-a[1])}L${f(b[0])},${f(-b[1])}`,stroke:o.pc||shd(c,-.3),'stroke-width':f(Math.max(.55,og.w*.45)),'stroke-linecap':'round'},par)})}
  return parts}
/* the apex: a small pointed bud between the last, youngest leaves */
function eucApex(og,col){const Bf=lsFrame(og,null,0),s=UPC*R(.45,.6);return[{z:og.pos[2]+.01,cast:false,fn:par=>spBud(par,Bf,og.pos,s,s*.42,col,{tp:.55,pw:.7})}]}
/* the stem of a eucalyptus, by its form */
function eucStem(g,t,o,M,col,cfg){const m=M===EU_M.c;
  return f15Sprig(g,t,o,{id:cfg.id,len:cfg.len,leafy:m?.85:.84,inter:m?[2.8,1.4]:[1.5,.85],opp:m,div:137.5,ang:m?[78,48]:[56,40],w0:m?3.4:2.5,w1:m?1.05:.7,cols:cfg.cols,e:cfg.soft?-.016:-.009,wig:m?.012:.02,tip:m?1.2:.8,
    br:m?{zone:[.1,.7],p:.6,max:3,gap:1,n:[3,6],li:2.4,ang:48,eb:-.02,ls:.84,wk:.6}:{zone:[0,.78],p:.65,max:6,gap:1,n:[7,12],li:1.45,ang:55,eb:-.028,ls:.92,wk:.5},
    leaf:(og,lim)=>eucLeaf(og,lim,M,col,{opp:m,dyed:cfg.dyed,soft:cfg.soft?1.3:1,young:cfg.young,back:cfg.back,pc:cfg.cols[1],bloom:cfg.bloom}),apex:og=>eucApex(og,cfg.bud||mix(col,cfg.cols[1],.5))})}
/* ---------- eucalyptus cinerea ---------- */
const CW_ECIN=[{id:'bleu-gris',n:'Bleu-gris (Silver Dollar)',c:'#8fa7a8'},{id:'argent',n:'Gris argenté',c:'#a9b5b3'},{id:'vert-gris',n:'Vert-de-gris',c:'#8a9c8a'}];
const ECIN_ST=['#3c2a2c','#6e5050','#957a78','#c4b4b0'];
function ecinPlant(g,t,o){const cw=cwPick(CW_ECIN,o);return eucStem(g,t,o,EU_M.c,cw.c,{id:'ecin',len:60,cols:ECIN_ST,young:mix(cw.c,'#dfe8ea',.55),back:'#dde4e2',bud:'#a89494',bloom:.55})}
/* ---------- eucalyptus parvifolia ---------- */
const CW_EPAR=[{id:'vert-bleu',n:'Vert bleuté',c:'#5d7d76'},{id:'vert',n:'Vert',c:'#667a62'},{id:'vert-gris',n:'Vert grisé',c:'#7f8f80'}];
const EPAR_ST=['#3a1c1c','#6e3a34','#94584c','#c08a7c'];
function eparPlant(g,t,o){const cw=cwPick(CW_EPAR,o);return eucStem(g,t,o,EU_M.p,cw.c,{id:'epar',len:60,cols:EPAR_ST,young:mix(cw.c,'#b0846e',.35),back:'#c8d4cc',bud:'#8a4a40',bloom:.3})}
/* ---------- preserved eucalyptus: the colourways of the preserving houses, each on the form it is sold in (m: c = cinerea, p = parvifolia) ---------- */
const CW_ESTAB=[{id:'vert',n:'Vert naturel',c:'#5d7656',m:'p'},{id:'vert-tendre',n:'Vert tendre',c:'#8db866',m:'c'},{id:'bleu',n:'Bleu',c:'#6d93a3',m:'c'},{id:'aigue-marine',n:'Aigue-marine',c:'#6fa49b',m:'c'},
  {id:'blanc',n:'Blanc',c:'#e9e1cc',m:'p'},{id:'rose',n:'Rose poudré',c:'#dcaab0',m:'p'},{id:'vieux-rose',n:'Vieux rose',c:'#a56c71',m:'c'},{id:'lavande',n:'Lavande',c:'#a99ac6',m:'p'},
  {id:'jaune',n:'Jaune d’or',c:'#d4a73c',m:'p'},{id:'orange',n:'Orange automne',c:'#df6a26',m:'p'},{id:'rouge',n:'Rouge',c:'#9c2430',m:'c'},{id:'grenat',n:'Grenat',c:'#6a2234',m:'c'},
  {id:'brun',n:'Brun vintage',c:'#7a5a3e',m:'c'},{id:'cuivre',n:'Cuivre',c:'#9a6a32',m:'p'}];
function estabPlant(g,t,o){const cw=cwPick(CW_ESTAB,o),M=EU_M[cw.m||'c'],st=f15DyeStem(cw.c);return eucStem(g,t,o,M,cw.c,{id:'estab-'+cw.id,len:60,cols:st,dyed:1,soft:1,bud:st[1]})}
/* ---------- asparagus plumosus (Asparagus setaceus): a wiry green stem carrying, in tiers, flat triangular fronds held out almost level — each a rachis with close alternate pinnae
   in its plane, longest at its base, and along every pinna fascicles of needle-like cladodes fanned out; a light plume, younger and smaller toward the tip.
   A frond is three paths: the mist of its pinnae, the comb of their needles (one dashed stroke: thousands of needles for a few points), its axes; on sheets the needles one by one ---------- */
const CW_ASP=[{id:'vert-tendre',n:'Vert tendre',c:'#7fa65a'},{id:'vert',n:'Vert',c:'#5f8f3f'},{id:'rose',n:'Rose (teinté)',c:'#e08a96'},{id:'framboise',n:'Framboise (teinté)',c:'#c64e60'},
  {id:'magenta',n:'Magenta (teinté)',c:'#a02c6c'},{id:'rouge',n:'Rouge (teinté)',c:'#a8283c'},{id:'lavande',n:'Lavande (teinté)',c:'#b6aedc'},{id:'jaune',n:'Jaune (teinté)',c:'#e4cf62'},
  {id:'peche',n:'Pêche (teinté)',c:'#eec795'},{id:'or-rose',n:'Or rose (teinté)',c:'#d9a28c'}];
const ASP_ST=['#2c461c','#4e7631','#78a052','#b0cc88'];
/* one frond at its node: the rachis rises a little and flattens, the plane of the frond tilted τ round it */
function aspFrond(og,lim,c,dyed){const q=og.p.q??0,Hd=og.H,tau=R(14,38)*D*(rnd()<.5?-1:1),Wp=rotA(og.L,Hd,tau),Nf=V3.nz(V3.cr(Hd,Wp)),det=DET>=1.5&&!LOD,hn=UPC*.4*(1-.2*q);
  const build=Lf=>{const P=og.pos,Rt=t=>V3.add(V3.add(P,V3.sc(Hd,Lf*t)),V3.add(V3.sc(Nf,Lf*.07*Math.sin(Math.PI*t)),[0,-Lf*.12*t*t,0])),np=Math.max(6,Math.min(28,Math.round(Lf/(.5*UPC)))),
      rach=[];for(let i=0;i<=6;i++)rach.push(Rt(i/6));const axes=[rach],mist=[],comb=[],ndl=[];
    for(let j=0;j<np;j++){const tj=.04+.9*j/(np-1),s=j%2?1:-1,be=(62-20*tj+R(-5,5))*D,pd=V3.nz(V3.add(V3.sc(Hd,Math.cos(be)),V3.sc(Wp,s*Math.sin(be)))),lp=Lf*(.48*Math.pow(1-tj,.9)+.05)*R(.9,1.1),
        A0=Rt(tj),wq=V3.nz(V3.cr(Nf,pd)),C=u=>V3.add(V3.add(A0,V3.sc(pd,lp*u)),[0,-lp*.1*u*u,0]),h=hn*Math.min(1,.5+lp/(2.5*UPC));
      axes.push([A0,C(.5),C(1)]);comb.push([C(Math.min(.3,hn*.5/lp)+R(0,.06)),C(.55),C(1)]);
      mist.push([A0,V3.add(C(.3),V3.sc(wq,h*.85)),V3.add(C(.75),V3.sc(wq,h*.6)),V3.add(C(1),V3.sc(pd,h*.6)),V3.add(C(.75),V3.sc(wq,-h*.6)),V3.add(C(.3),V3.sc(wq,-h*.85))]);
      /* on sheets: every fascicle a flat fan of five needles, a little out of the plane */
      if(det){const K=Math.max(2,Math.round(lp/(.3*UPC)));for(let k=1;k<=K;k++){const u=k/K,F=C(u-.45/K),nl=h*(1-.4*u),al=k%2?1:-1;
        for(const[a,cz]of[[-72,.25],[-38,-.3],[0,.15],[38,-.25],[72,.3]]){const an=(a+R(-8,8))*D,l=nl*R(.8,1.05);ndl.push([F,V3.add(F,V3.add(V3.add(V3.sc(pd,Math.cos(an)*l),V3.sc(wq,Math.sin(an)*l)),V3.sc(Nf,cz*al*l)))])}}}}
    comb.push([rach[5],rach[6]]);mist.push([rach[5],V3.add(rach[6],V3.sc(Wp,hn*.5)),V3.add(rach[6],V3.sc(Hd,hn)),V3.add(rach[6],V3.sc(Wp,-hn*.5))]);return{axes,mist,comb,ndl}};
  let Lf=(11*(1-.78*Math.pow(q,1.05))+1.6)*UPC*R(.88,1.1)*(og.p.s||1),fd=build(Lf);
  const low=d=>{let y=-1e9;for(const a of d.mist)for(const p of a)y=Math.max(y,-p[1]);return y};
  if(lim!=null){for(const k of[.8,.62]){if(low(fd)<=lim-hn)break;Lf*=k;fd=build(Lf)}if(low(fd)>lim-hn)return null}
  let z=0,n=0;for(const a of fd.axes)for(const p of a){z+=p[2];n++}z/=n;
  const P7=pal7(c),tc=f15Tone(P7,pal7(dyed?shd(c,.05):mix(c,'#c8d8a8',.18)),Nf,.5),tA=shd(tc,-.25),tL=mix(tc,lt(tc,.3),.45),sc=([x,y])=>f(x)+','+f(-y),pl=a=>'M'+a.map(sc).join('L');
  const dm=fd.mist.map(a=>pl(a)+'Z').join(''),dc=fd.comb.map(pl).join(''),da=fd.axes.map(pl).join('');let dn='';for(const[a,b]of fd.ndl)dn+='M'+sc(a)+'L'+sc(b);
  return[{z,cast:false,fn:par=>{E('path',{d:dm,fill:tc,'fill-opacity':det?.32:.46},par);
    if(!det&&!LOD)E('path',{d:dc,stroke:tc,'stroke-width':f(hn*.8),'stroke-dasharray':'.28 .38 .22 .44','stroke-opacity':.9,fill:'none','stroke-linejoin':'round'},par);
    E('path',{d:da,stroke:tA,'stroke-width':det?.4:.42,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
    if(dn)E('path',{d:dn,stroke:tL,'stroke-width':.26,fill:'none','stroke-linecap':'round'},par)}}]}
function aspPlant(g,t,o){const cw=cwPick(CW_ASP,o),dyed=CW_ASP.indexOf(cw)>1,st=dyed?f15DyeStem(cw.c):ASP_ST;
  return f15Sprig(g,t,o,{id:'asp',len:50,leafy:.86,inter:[3.6,1.6],opp:false,div:152,ang:[80,56],w0:1.8,w1:.55,cols:st,e:-.014,wig:.035,tip:.5,
    leaf:(og,lim)=>aspFrond(og,lim,cw.c,dyed)})}
/* ---------- dried, dyed ruscus (Ruscus aculeatus, butcher's broom): a stiff zigzag stem, branched in its upper part; its 'leaves' are cladodes — flattened shoots, ovate, ending
   in a sharp spine, sessile, alternate in a spiral and turned on edge; dried and dyed in the trade's colours, matte, the stem taking the dye ---------- */
const CW_RUS=[{id:'vert',n:'Vert naturel',c:'#566f3c'},{id:'sauge',n:'Vert sauge',c:'#9fb8a0'},{id:'blanchi',n:'Blanchi',c:'#eeeadc'},{id:'ivoire',n:'Ivoire',c:'#ece2c5'},{id:'champagne',n:'Champagne',c:'#e1cdac'},
  {id:'rose-poudre',n:'Rose poudré',c:'#e3b8b6'},{id:'rose',n:'Rose',c:'#e08aa4'},{id:'corail',n:'Corail',c:'#e84a48'},{id:'rouge',n:'Rouge',c:'#b8202e'},{id:'bordeaux',n:'Bordeaux',c:'#6e1a28'},
  {id:'violet',n:'Violet',c:'#6a3c8c'},{id:'bleu',n:'Bleu',c:'#6a88d8'},{id:'noir',n:'Noir',c:'#2c2829'},{id:'or',n:'Or',c:'#c9a24e'}];
const RU_WP=prof([[0,.16],[.12,.64],[.3,1],[.55,.86],[.78,.48],[.93,.13],[1,0]]),RU_V=[[[.3,.06],[.42,.4],[.2,.84]],[[-.3,.06],[-.42,.4],[-.2,.84]],[[.58,.14],[.6,.38],[.38,.7]],[[-.58,.14],[-.6,.38],[-.38,.7]]],RUS_ST=['#2a361c','#4a5e30','#6c844a','#a4b882'];
function rusLeaf(og,lim,c){const p=og.p,q=p.q??0,sz=UPC*2.2*(1-.4*Math.pow(q,1.3))*(p.s||1)*R(.88,1.1),Hd=og.H,N=f15Face(og,R(-30,30)*D,rnd()<.5?1:-1),cc=mix(c,shd(c,R(-.12,.08)),.55),
    P0=V3.add(og.pos,V3.sc(Hd,og.w*.3)),mk=len=>f15BladeS(P0,Hd,N,len,len*.26,RU_WP,{arch:.04,fold:.05,cup:-.07,curl:.03,tw:R(-.3,.3)}),S=f15Fit(mk,sz,lim);
  if(!S)return null;const pp=[f15Blade(S,pal7(cc),pal7(shd(cc,.05)),{mt:.74,sharp:1,mid:DET>=1.5?shd(cc,.2):null,mo:.35,veins:DET>=1.5?RU_V:null,vc:shd(cc,.16),vo:.3})];
  /* the spine that ends the cladode */
  if(DET>=1.5&&!LOD){const a=S(0,.97),b=S(0,1),d=V3.nz(V3s(b,a)),e=V3.add(b,V3.sc(d,UPC*.18));pp.push({z:b[2]+.01,cast:false,fn:par=>E('path',{d:`M${f(b[0])},${f(-b[1])}L${f(e[0])},${f(-e[1])}`,stroke:shd(cc,-.35),'stroke-width':.35,'stroke-linecap':'round'},par)})}
  return pp}
/* the end of a shoot: one last cladode along its axis */
function rusApex(og,c){const S=f15BladeS(og.pos,og.H,f15Face(og,R(-20,20)*D,1),UPC*1.3,UPC*1.3*.24,RU_WP,{arch:.03,fold:.04,cup:-.06}),cc=mix(c,shd(c,R(-.1,.06)),.55);return[f15Blade(S,pal7(cc),pal7(shd(cc,.05)),{mt:.74,sharp:1})]}
function rusPlant(g,t,o){const cw=cwPick(CW_RUS,o),st=cw.id==='vert'?RUS_ST:f15DyeStem(cw.c);
  return f15Sprig(g,t,o,{id:'rus',len:60,leafy:.8,inter:[1.2,.82],opp:false,div:137.5,ang:[62,40],w0:2.8,w1:.8,cols:st,e:.004,wig:.016,tip:.5,zig:7,
    br:{zone:[.02,.9],p:.82,max:9,gap:1,n:[5,10],li:.88,ang:60,eb:.004,ls:.86,wk:.5},leaf:(og,lim)=>rusLeaf(og,lim,cw.c),apex:og=>rusApex(og,cw.c)})}
/* ---------- registries: drawers, colourways, trade grades (for a foliage: the length of the cut stem, cm), and how the composer treats them:
   a stem of foliage ('plant', drawn along its spine), its natural length (self), its reserved radius in the mass (rk: r·cm/c0 ≈ 0.22 of the stem), a stiff line for the ruscus (tip) ---------- */
Object.assign(GH,{'eucalyptus-stabilise':estabPlant,'eucalyptus-cinerea':ecinPlant,'eucalyptus-parvifolia':eparPlant,'asparagus-setaceus-plumosus':aspPlant,'ruscus-seche-teint':rusPlant});
Object.assign(CWS,{'eucalyptus-stabilise':CW_ESTAB,'eucalyptus-cinerea':CW_ECIN,'eucalyptus-parvifolia':CW_EPAR,'asparagus-setaceus-plumosus':CW_ASP,'ruscus-seche-teint':CW_RUS});
Object.assign(SZG,{'eucalyptus-stabilise':[50,60,60,70],'eucalyptus-cinerea':[50,60,60,70,80],'eucalyptus-parvifolia':[50,60,60,70],'asparagus-setaceus-plumosus':[40,50,50,60],'ruscus-seche-teint':[50,60,60,70,75]});
const F15_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'eucalyptus-stabilise':F15_I(60,{fx:20}),'eucalyptus-cinerea':F15_I(60,{fx:22}),'eucalyptus-parvifolia':F15_I(60,{fx:17}),'asparagus-setaceus-plumosus':F15_I(50,{fx:24}),'ruscus-seche-teint':F15_I(60,{fx:15,tip:1})});
