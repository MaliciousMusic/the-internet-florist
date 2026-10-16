/* ================= Serre, lot 44 — feuillages 7 : lance de palmier séchée, bambou de la chance (Dracaena sanderiana), capillaire (Adiantum raddianum), arroche rouge (Atriplex hortensis), grevillea ================= */
/* chaque tige est poussée par le L-système : l'axe principal suit son chemin (épine du Composer, arc d'une planche, hélice du bambou en spirale), ses nœuds portent feuilles, pennes, rameaux et grappes ;
   les feuilles sont des nappes 3D (g35Leaf du lot 35, lance plissée, éventails des pinnules) ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
/* a vein given by a few (x, y) points, resampled so that it follows the curved blade (never a chord across it) */
const l44V=L=>L.map(P=>{const out=[];for(let i=0;i<P.length-1;i++)for(let k=0;k<5;k++){const t=k/5;out.push([P[i][0]+(P[i+1][0]-P[i][0])*t,P[i][1]+(P[i+1][1]-P[i][1])*t])}out.push(P[P.length-1]);return out});
const L44_MID=Array.from({length:15},(_,i)=>[0,i/14]),l44Op=o=>Math.max(.05,Math.min(1,o.op??1)),l44Cols=c=>[shd(c,-.58),shd(c,-.25),c,shd(c,.4)];
/* ---------- the lot's grower: the main axis follows its path exactly (chords of a few units, each aimed at the next point of the path: a spine, an arch, a helix), its nodes at given lengths;
   the species' own rules grow the branches, shoots and organs from them. M(i) → chord N…(i) M(i+1); M(end) → chord T ---------- */
function l44Main(A,nodes,S){const Le=S.end??A.L,l0=A.l0||0,wAt=l=>S.w0+(S.w1-S.w0)*Math.min(1,Math.max(0,(l-l0)/Math.max(1,Le-l0))),P=l=>A.at(A.sOf(l)).p,st=S.step||8;
  const chord=(a,b)=>{const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+st),d=V3s(P(y),P(x)),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  const rules=Object.assign({},S.rules,{M:p=>{const i=p.i;if(i>=nodes.length)return[...chord(i?nodes[i-1]:l0,Le),['T',{u:1}]];return[...chord(i?nodes[i-1]:l0,nodes[i]),...S.node(i,(nodes[i]-l0)/Math.max(1,Le-l0),wAt(nodes[i])),['M',{i:i+1}]]}});
  const f0=A.at(A.s0||0),res=lsTurtle(lsDerive([['M',{i:0}]],rules,nodes.length+(S.depth||6)+2),{p:f0.p,H:f0.T,U:f0.Fr,w:wAt(l0),seg:st,T:A.up||[0,1,0],e:0,wig:S.wig||0});
  for(const ch of res.chains)ch.c=ch.c||S.cols;return res}
/* what a grown stem hands back to the bouquet: the width and colours of its foot, where it starts and toward where */
function l44Out(k,A,res,cols){const c0=res.chains[0],b=c0.pts[0],w=c0.ws[0],T0=A.at(A.s0||0).T,l=Math.hypot(T0[0],T0[1])||1;return{k,bw:Math.max(w*1.15,2.4),bw1:w,bc:cols,neck:[b[0],-b[1]],nd:[-T0[0]/l,T0[1]/l]}}
/* a helix wound round an axis (the spiral lucky bamboo): between the shares a and b of its length, radius r, n turns, eased in and out; same interface as spAxis */
function l44Helix(A0,a,b,r,n){const N=220,pts=[],ph=R(0,6.283);for(let i=0;i<=N;i++){const s=i/N,q=A0.at(s),Sd=V3.cr(q.T,q.Fr),t=Math.max(0,Math.min(1,(s-a)/(b-a))),e=Math.sin(Math.PI*Math.min(1,t*3,(1-t)*3)/2)**2,th=ph+6.283*n*t;
    pts.push(V3.add(q.p,V3.add(V3.sc(Sd,Math.cos(th)*r*e),V3.sc(q.Fr,Math.sin(th)*r*e))))}
  const cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const L=cum[N],ix=s=>{const l=s*L;let i=1;while(i<N&&cum[i]<l)i++;return[i,Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)))]};
  const at=s=>{s=Math.max(0,Math.min(1,s));const[i,t]=ix(s),p=V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t)),j=Math.min(N,i+1),T=V3.nz(V3s(pts[j],pts[Math.max(0,i-2)])),F0=A0.at(cum[i]/L).Fr;let Fr=V3s(F0,V3.sc(T,V3.dot(F0,T)));Fr=V3l(Fr)>1e-6?V3.nz(Fr):[0,0,1];return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  return{at,L,sOf:l=>Math.max(0,Math.min(1,l/L)),s0:A0.s0||0,l0:(A0.l0||0)*L/A0.L,up:A0.up,C:A0.C,cb:s=>at(s).p}}
/* a light tone, quantised (so a fern's pinnules or a panicle's discs batch into a few paths): the face that shows, lit up-left */
const l44Tone=(P,PB,n,lv=3)=>{const fr=n[2]>=0,I=lightI(fr?n:V3.sc(n,-1)),q=Math.round(Math.max(0,Math.min(1,(I-.32)/.56))*(lv-1))/(lv-1);return{fr,col:toneAt(fr?P:PB,.32+.56*q)}};
/* batches of flat polygons drawn far to near in nb depth bands, each band one path per colour (the light fronds and panicles stay within the budget) */
function l44Batch(polys,nb,parts,o={}){if(!polys.length)return;polys.sort((a,b)=>a.z-b.z);const per=Math.ceil(polys.length/nb);
  for(let b=0;b<nb;b++){const sl=polys.slice(b*per,(b+1)*per);if(!sl.length)continue;const by=new Map();let z=0;for(const q of sl){z+=q.z;if(!by.has(q.col))by.set(q.col,[]);by.get(q.col).push(q.pts)}
    parts.push({z:z/sl.length+(o.zb||0),cast:false,fn:par=>{for(const[c,L]of by)E('path',{d:L.map(fgD).join(''),fill:c,stroke:o.ink||shd(c,-.45),'stroke-width':o.ew||(DET>=1.5?.3:.38),'stroke-opacity':o.eo??.45,'stroke-linejoin':'round','fill-opacity':o.fo??1},par)}})}}

/* ---------- dried palm spear (young unopened leaf of a fan palm, Chamaerops/Trachycarpus — « palm spear »): the blade still folded like an accordion along its ribs, a tight pointed lance
   on a long petiole; as it opens, its pleats spread into a narrow fan whose segments part at their tips (each segment V-folded on its upper rib). Dried natural straw, bleached or dyed,
   the petiole dyed with it. Stages: the lance closed, beginning to spread, opened as a narrow fan ---------- */
const CW_L44PS=[{id:'naturel',n:'Naturel paille',c:'#c9ac78'},{id:'blanchi',n:'Blanchi',c:'#f2ede2'},{id:'noir',n:'Noir',c:'#2a2826'},{id:'bleu',n:'Bleu',c:'#3f5f9a'},{id:'bordeaux',n:'Bordeaux',c:'#6e1f33'},
  {id:'or',n:'Doré',c:'#c9a24a'},{id:'rouille',n:'Rouille (cuivre)',c:'#8a4426'},{id:'rose',n:'Rose poudré',c:'#e2b4b8'},{id:'sauge',n:'Vert sauge',c:'#8e9c74'}];
const L44_PSW=prof([[0,.1],[.1,.48],[.3,.9],[.5,1],[.7,.82],[.88,.42],[1,0]]);
/* the spear at the end of its petiole: n+1 ribs, alternately up (the segments' midribs, ending in their points) and down (the folds between segments, shorter once the fan opens);
   closed, the ribs lie side by side under a lance outline and the pleats are deep (the true width of the folded blade); open, they fan out by the angle Θ and the pleats flatten */
function l44Spear(og,Fr,Ls,op,c,cb){const Y=V3.nz(og.H);let Z=V3s(Fr,V3.sc(Y,V3.dot(Fr,Y)));Z=V3l(Z)>1e-3?V3.nz(Z):fgCross(Y)[0];const X=V3.cr(Y,Z),O=og.pos,det=DET>=1.5&&!LOD,
    n=LOD?8:det?16:12,s=Math.max(0,Math.min(1,(op-.16)/.84))**1.9,Th=(36+10*s)*D,Wc=Ls*.15,P=pal7(c),PB=pal7(cb),parts=[],bow=R(-.03,.03),rs=[0,.06,.16,.3,.46,.62,.76,.88,.96,1];
  const rib=(i,r)=>{const ci=i/n-.5,up=i%2===1,Li=up?1:1-(i===0||i===n?.16:.1+.18*s)*Math.min(1,s*6),wp=L44_PSW(r),xc=ci*Wc*wp,yc=r*Ls*(up?1:.985),a=ci*Th,rr=r*Ls*Li*(1-(1-s)*.5*Math.pow(Math.abs(2*ci),1.4)),xo=Math.sin(a)*rr,yo=Math.cos(a)*rr,
      x=xc+(xo-xc)*s,y=yc+(yo-yc)*s,wt=r*Ls*Th/n,dx=Wc*wp/n*(1-s)+Math.sin(Th/n)*rr*s,h=Math.max(wt*.1,.5*Math.sqrt(Math.max(0,wt*wt-dx*dx)))*((1-s)*Math.min(1,wp*1.5)+s)*.9,
      z=(i===0||i===n?0:up?h:-h)+Ls*bow*Math.sin(Math.PI*r)*(1-s)-s*.07*Ls*r*r;
    return V3.add(O,V3.add(V3.add(V3.sc(X,x),V3.sc(Y,y)),V3.sc(Z,z)))};
  for(let i=0;i<n;i++){const A0=rs.map(r=>rib(i,r)),B0=rs.map(r=>rib(i+1,r)),m=k=>V3.sc(V3.add(A0[k],B0[k]),.5);let nr=V3.cr(V3s(B0[5],A0[5]),V3s(m(8),m(2)));nr=V3l(nr)>1e-9?V3.nz(nr):[0,0,1];
    const fr=nr[2]>=0,col=toneAt(fr?P:PB,lightI(fr?nr:V3.sc(nr,-1))+R(-.03,.03)),pts=A0.concat(B0.slice().reverse()).map(fgQ),z=A0.concat(B0).reduce((a,p)=>a+p[2],0)/(2*rs.length),
      st=det?[2,3,4,5,6,7].map(k=>fgQ(m(k))):null;
    parts.push({z,cast:false,fn:par=>{E('path',{d:fgD(pts),fill:col,stroke:P.d2,'stroke-width':det?.3:.4,'stroke-opacity':.42,'stroke-linejoin':'round'},par);
      /* the fine lengthwise striation of a dried blade, along the middle of the pleat */
      if(st)E('path',{d:'M'+st.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:shd(col,-.14),'stroke-width':.35,'stroke-opacity':.5,fill:'none'},par)}})}
  return parts}
function l44Palm(g,t,o){const cw=fgCw(CW_L44PS,o),cm0=30,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l44ps',()=>{const op=o.spine?(rnd()<.45?R(.08,.2):R(.62,1)):l44Op(o),Lt=o.spine?blen(o.spine):cm0*UPC*ks*1.55,A=fgAxis(o,Lt,R(-.04,.04)),Ls=o.spine?Math.min(cm0*UPC,(A.L-(A.l0||0))*.62):cm0*UPC*ks,
      nat=cw.id==='naturel',pc=nat?'#ad8f5e':cw.id==='blanchi'?'#ddd2bc':shd(cw.c,-.12),cols=l44Cols(pc),cb=mix(cw.c,nat?'#e2d4b4':shd(cw.c,.14),.35);
    const res=l44Main(A,[],{w0:4.2*Math.min(1.15,.8+.2*ks),w1:3.2,cols,end:A.L-Ls*.97,step:10}),parts=[];
    lsChainParts(res.chains,[0,0,0],cols,parts,{piece:DET>=1.5?9:16});const T=res.organs.find(q=>q.t==='T');if(T)parts.push(...l44Spear(T,A.at(1).Fr,Ls,op,cw.c,cb));
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- lucky bamboo (Dracaena sanderiana, syn. D. braunii): a smooth green cane ringed every few centimetres by its nodes (a pale ring over a darker scar), cut and sealed with wax
   at the top; from the uppermost nodes one or two shoots carry a tuft of lanceolate leaves, glossy, a little twisted, sheathing at their base. Sold straight or trained into a spiral;
   golden canes, and the variegated form with cream-edged leaves. Stages: the shoots' young leaves still rolled, then spread ---------- */
const CW_L44LB=[{id:'vert',n:'Vert (canne droite)',c:'#5f8f3a',cane:'#5f8f3a',lf:'#3f7a2c'},{id:'dore',n:'Doré (canne jaune)',c:'#a3b440',cane:'#b4b84a',lf:'#4f8530'},
  {id:'panache',n:'Panaché crème (Ribbon)',c:'#cdd2b8',cane:'#7aa04a',lf:'#e4e2c4',g:'#4a8232'},{id:'vert-spirale',n:'Vert en spirale',c:'#5a8a36',cane:'#5f8f3a',lf:'#3f7a2c',sp:1,f:1},
  {id:'dore-spirale',n:'Doré en spirale',c:'#aab446',cane:'#b4b84a',lf:'#4f8530',sp:1,f:1}];
const L44_LBV=l44V([[[0,0],[0,.97]],[[.034,.06],[.04,.5],[.016,.9]],[[-.034,.06],[-.04,.5],[-.016,.9]]]),L44_LBW=prof([[0,.12],[.08,.4],[.25,.86],[.45,1],[.68,.82],[.86,.44],[1,0]]);
/* a node: the ring's front half (where the cane faces the eye), a pale band edged by the scar */
function l44Ring(og,w,cane){let F=V3s([0,0,1],V3.sc(og.H,og.H[2]));F=V3l(F)>1e-3?V3.nz(F):fgCross(og.H)[0];const S=V3.cr(og.H,F),
    half=(o2,k)=>{const a=[];for(let i=0;i<=12;i++){const t=Math.PI*i/12;a.push(fgQ(V3.add(V3.add(og.pos,V3.sc(og.H,o2)),V3.sc(V3.add(V3.sc(S,Math.cos(t)),V3.sc(F,Math.sin(t))),w*.5*k))))}return a};
  const A=half(.9,1.04),B=half(-.9,1.04).reverse(),z=og.pos[2]+w*.5;
  return{z,cast:false,fn:par=>E('path',{d:fgD(A.concat(B)),fill:mix(cane,'#f2f0c0',.55),stroke:shd(cane,-.62),'stroke-width':.8,'stroke-opacity':.7,'stroke-linejoin':'round'},par)}}
function l44Lucky(g,t,o){const cw=fgCw(CW_L44LB,o),op=l44Op(o),cm0=20,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l44lb',()=>{const Lt=o.spine?blen(o.spine):50*UPC*ks,A0=fgAxis(o,Lt,R(-.02,.02)),A=cw.sp?l44Helix(A0,.1,.82,3.3*UPC*kl,Math.max(1.5,Math.round(A0.L*.72/(14*UPC))+.5)):A0,
      w=(o.spine?9.5:11*kl),cols=l44Cols(cw.cane),Le=A.L,l0=A.l0||0,nodes=[];for(let l=l0+(o.spine?2.5:3)*UPC;l<Le-1.4*UPC;l+=5.6*UPC*R(.9,1.1)*(o.spine?1:kl))nodes.push(l);
    const nn=nodes.length,top=new Set([nn-1,nn-2].filter(i=>i>=0&&(i===nn-1||rnd()<.75))),sh=Object.assign(g35Prof(L44_LBW,.15,14),{mid:L44_MID}),Fr=A.at(.85).Fr,lc=cw.lf,vr=cw.g?{c:cw.g,k:y=>.48+.06*Math.sin(y*7)}:null;
    /* a shoot: S(n) → F [ /φ &α Lv ] S(n−1), its leaves on a tight spiral, the youngest at its tip */
    const rules={S:p=>p.n<=0?[['F',{l:.5*UPC*kl,w1:1.4,e:.02}],['[',{}],['&',{a:6}],['Lv',{q:1,n0:p.n0}],[']',{}]]:[['F',{l:.65*UPC*kl*R(.8,1.2),w1:Math.max(1.6,p.w*(.55+.45*p.n/p.n0)),e:.03}],
      ['[',{}],['/',{a:p.ph+137.5*p.n}],['&',{a:(30+22*p.n/p.n0)+R(-6,6)}],['Lv',{q:1-p.n/p.n0,n0:p.n0}],[']',{}],['S',Object.assign({},p,{n:p.n-1})]]};
    const res=l44Main(A,nodes,{w0:w,w1:w*.94,cols,step:cw.sp?5:9,depth:10,rules,
      node:(i,u,ww)=>{const out=[['Nd',{i}]];if(top.has(i)){const n0=Math.round(R(4,6)*(i===nn-1?1:.85));out.push(['[',{w:3*kl,c:l44Cols(mix(cw.cane,'#6a9a3a',.4))}],['/',{a:(i===nn-1?0:150)+R(-30,30)}],['&',{a:R(24,34)}],['S',{n:n0,n0,w:3*kl,ph:R(0,360)}],[']',{}])}return out}});
    const parts=[];lsChainParts(res.chains,[0,0,0],cols,parts,{piece:DET>=1.5?(cw.sp?6:9):(cw.sp?9:14)});
    for(const og of res.organs){
      if(og.t==='Nd')parts.push(l44Ring(og,og.w,cw.cane));
      /* the cut top sealed with wax: its face where it turns to the eye, else the cane's rounded end */
      else if(og.t==='T'){const[X,Y]=fgCross(og.H),pts=[];for(let i=0;i<16;i++){const a=i*Math.PI/8;pts.push(fgQ(V3.add(og.pos,V3.add(V3.sc(X,Math.cos(a)*og.w*.5),V3.sc(Y,Math.sin(a)*og.w*.5)))))}
        const vis=og.H[2]>0;parts.push({z:og.pos[2]+.2,cast:false,fn:par=>E('path',{d:fgD(pts),fill:vis?'#5a6a2c':cols[1],stroke:shd(cw.cane,-.55),'stroke-width':.5,'stroke-opacity':.6},par)})}
      else if(og.t==='Lv'){const q=og.p.q,yg=Math.max(0,q-.55)/.45*Math.max(0,1-op*1.15),L=cm0*UPC*kl*(o.spine?1:ks/kl*.6+.4)*(1-.45*Math.max(0,q-.5))*R(.88,1.08)*(1-.4*yg),F=g35Fr(fgFace(og,Fr,.45)),
          P0=F.P0,c=mix(lc,shd(lc,R(-.08,.1)),.5);
        parts.push(g35Leaf(P0,F.H,F.N,L,sh,c,mix(vr?cw.g:lc,'#b8c890',.25),{lim:g35Lim(o),fold:.18+.9*yg,arch:.1,droop:.12+.1*(1-q),cup:.04,wave:.03,wk:3,wph:R(0,6),tw:R(-.7,.7),bend:R(-.06,.06),sm:1,vr,gloss:vr?.4:1,dI:.02,
          veins:L44_LBV}))}}
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- maidenhair fern (Adiantum raddianum, « capillaire »): a frond on a wiry stipe black and glossy, the blade deltoid, two- to three-pinnate, its pinnae alternate on the black rachis,
   longest at the base; the pinnules fan-shaped (flabellate), cuneate at the base on hair-thin black stalklets, the outer margin lobed, the sori under its reflexed lobes; soft fresh green,
   the young fronds flushed pink-bronze. Light: a frond is a few paths — its axes, its pinnules batched by depth and tone ---------- */
const CW_L44AD=[{id:'vert-tendre',n:'Vert tendre',c:'#9cc062'},{id:'vert',n:'Vert franc',c:'#86b440'},{id:'vert-profond',n:'Vert profond (Fritz Luth)',c:'#5f9a3a'},{id:'bronze',n:'Jeunes frondes rosées',c:'#a8b070',y:'#d4908a'}];
function l44Adi(g,t,o){const cw=fgCw(CW_L44AD,o),op=l44Op(o),cm0=35,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l44ad',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.16,.26)),Le=A.L,l0=A.l0||0,u0=o.spine?.4:.44,Lb=(Le-l0)*(1-u0),
      yg=Math.max(0,1-op*1.25),nodes=[];for(let x=l0+(Le-l0)*u0;x<Le-1.2*UPC;){nodes.push(x);const q=(x-l0)/(Le-l0);x+=Lb*.085*(1-.5*Math.max(0,(q-u0)/(1-u0)))*R(.9,1.1)}
    const blk=['#100c0c','#2a2020','#4a3c3a','#8a7a76'],rp0=.95*UPC*kz,lim=g35Lim(o);
    /* a pinna: P(n) → F [ ±α Q ] P(n−1) (its pinnules alternate), the lowest pinnae branching once more (sub-pinnae); P(0) → F Q */
    const rules={P:p=>{if(p.n<=0)return[['F',{l:p.li*.55,w1:1.15,e:-.02}],['Q',{sz:.85*p.k,end:1}]];const tq=1-p.n/p.n0,out=[['F',{l:p.li*R(.88,1.12),w1:Math.max(1.15,p.w*(1-.5*tq)),e:-.022+.01*yg}]];
        if(p.bi&&tq<.34&&p.n>2){const m=Math.max(2,Math.round(p.n0*.45*(1-tq)));out.push(['[',{w:1.2}],['+',{a:p.s*R(36,46)}],['&',{a:R(-10,10)}],['P',{n:m,n0:m,li:p.li*.8,s:-p.s,k:p.k*.82,w:1.2,bi:0}],[']',{}])}
        else out.push(['[',{}],['+',{a:p.s*R(52,68)}],['Q',{sz:p.k*(1-.3*tq)}],[']',{}]);
        out.push(['P',Object.assign({},p,{n:p.n-1,s:-p.s})]);return out}};
    const res=l44Main(A,nodes,{w0:2.6*Math.min(1.1,kz),w1:1.25,cols:blk,step:8,depth:16,rules,
      node:(i,u,w)=>{const q=Math.max(0,(u-u0)/(1-u0)),s=i%2?1:-1;
        if(q>.84)return[['[',{}],['+',{a:s*R(40,55)}],['Q',{sz:.8}],[']',{}]];
        const Lp=Lb*(.4*Math.pow(1-q,.9)+.07)*(.45+.55*op)*R(.9,1.08),li=.58*UPC*kz*(.75+.25*op),n=Math.max(1,Math.round(Lp/li));
        return[['[',{w:Math.max(1.2,w*.6)}],['+',{a:s*R(50,62)*(1-.3*q)*(1-.35*yg)}],['&',{a:R(-16,16)}],['P',{n,n0:n,li:Lp/n,s,k:1-.25*q,w:Math.max(1.2,w*.6),bi:q<.2?1:0}],[']',{}]]}});
    const parts=[],P=pal7(cw.c),PB=pal7(mix(cw.c,'#c8d8a0',.35)),Py=cw.y?pal7(mix(cw.c,cw.y,.65)):pal7(mix(cw.c,'#c49a7a',.55)),polys=[],stalk=[],sori=[];
    for(const og of res.organs){if(og.t!=='Q')continue;const rp=rp0*og.p.sz*(1-.35*yg)*R(.85,1.12),sl=rp*.42,B=V3.add(og.pos,V3.sc(og.H,sl)),tau=R(-42,42)*D,W=V3.add(V3.sc(og.L,Math.cos(tau)),V3.sc(og.U,Math.sin(tau))),
        Nn=V3.nz(V3.cr(og.H,W)),dir=ps=>V3.add(V3.sc(og.H,Math.cos(ps)),V3.sc(W,Math.sin(ps))),pa=R(52,64)*D,pb=R(64,78)*D,nl=rnd()<.5?3:4,m=det?14:9,pts=[B];
      for(let j=0;j<=m;j++){const tt=j/m,ps=-pa+(pa+pb)*tt,r=rp*(1-.15*Math.abs(Math.sin(nl*Math.PI*tt)))*(.82+.18*Math.sin(Math.PI*tt)),cu=V3.sc(Nn,rp*.12*Math.sin(Math.PI*tt));pts.push(V3.add(V3.add(B,V3.sc(dir(ps),r)),cu))}
      if(lim!=null&&pts.some(p=>p[1]<lim))continue;
      const tn=l44Tone(cw.y||yg>.55?Py:P,PB,Nn,det?4:3),z=pts.reduce((a,p)=>a+p[2],0)/pts.length;
      polys.push({pts:pts.map(fgQ),z,col:tn.col});stalk.push([fgQ(og.pos),fgQ(V3.add(B,V3.sc(og.H,rp*.1)))]);
      /* the sori: dark crescents under the reflexed lobes of the outer margin (on the back, and showing through at the edge) */
      if(det)for(let j=1;j<nl+1;j++){const t0=(j-.75)/nl,t1=(j-.25)/nl,c=[];for(const tt of[t0,(t0+t1)/2,t1]){const ps=-pa+(pa+pb)*tt;c.push(fgQ(V3.add(B,V3.sc(dir(ps),rp*.86))))}sori.push(c)}}
    /* the axes: the stipe and rachis one glossy black ribbon, the pinnae's axes and the stalklets one stroke each (never under 1.1: they hold the pinnules) */
    const c0=res.chains[0],sc=c0.pts.map(fgQ),wf=i=>c0.ws[i]/2,zc=c0.pts.reduce((a,p)=>a+p[2],0)/c0.pts.length;let da='',zA=0,nA=0;
    for(const ch of res.chains.slice(1)){da+='M'+ch.pts.map(p=>{zA+=p[2];nA++;const q=fgQ(p);return f(q[0])+','+f(q[1])}).join('L')}
    const ds=stalk.map(([a,b])=>`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`).join('');
    parts.push({z:zc-1,cast:false,fn:par=>{E('path',{d:polyRibbon(sc,wf),fill:blk[0]},par);if(!LOD)E('path',{d:polyRibbon(sc,i=>wf(i)*.3,i=>wf(i)*.45),fill:blk[3],opacity:.7},par)}});
    parts.push({z:(nA?zA/nA:zc)-.5,cast:false,fn:par=>{if(da)E('path',{d:da,stroke:blk[1],'stroke-width':1.1,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
      if(ds)E('path',{d:ds,stroke:blk[0],'stroke-width':1.1,fill:'none','stroke-linecap':'round'},par)}});
    l44Batch(polys,det?3:2,parts,{ink:shd(cw.c,-.5),eo:.4});
    if(sori.length){const zs=polys.length?polys.reduce((a,q)=>Math.max(a,q.z),-1e9):zc;parts.push({z:zs+.01,cast:false,fn:par=>E('path',{d:sori.map(c=>'M'+c.map(q=>f(q[0])+','+f(q[1])).join('L')).join(''),stroke:'#5a4a2a','stroke-width':.7,'stroke-opacity':.3,fill:'none','stroke-linecap':'round'},par)})}
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,blk)})}

/* ---------- red orach (Atriplex hortensis 'Rubra', « arroche rouge »): a tall erect stem, ribbed, stained like its leaves; leaves alternate on long petioles, the blade triangular to hastate
   (two spreading basal lobes), the margin a little wavy, mealy beneath, smaller and narrower up the stem; the top a panicle of spikes, and spikes in the upper axils, crowded with fruits:
   each seed held between two round papery bracteoles, flat discs of a centimetre, the colour of the plant, paler and tan as they dry. Stages: young spikes of small discs, then full ---------- */
const CW_L44AT=[{id:'rouge',n:'Rouge pourpre (Rubra)',c:'#6a1f35',b:'#9a5a6a',st:'#5a2030',fr:'#8a3a4a'},{id:'pourpre',n:'Pourpre noir (Purple Plume)',c:'#542048',b:'#7a5070',st:'#3e1830',fr:'#7a3858'},
  {id:'rouge-vif',n:'Rouge vif (Red Plume)',c:'#8e2236',b:'#b0606a',st:'#6a2030',fr:'#b04050'},{id:'vert',n:'Vert (type)',c:'#7fb24a',b:'#b8cc98',st:'#6a8a3a',fr:'#b4b860'},
  {id:'dore',n:'Vert doré (Gold)',c:'#b4b444',b:'#d0cc90',st:'#8a8a3a',fr:'#c8b45a'}];
const L44_ATV=l44V([[[0,0],[0,.95]],[[0,.06],[.22,.08],[.34,.06]],[[0,.06],[-.22,.08],[-.34,.06]],[[0,.25],[.18,.36]],[[0,.25],[-.18,.36]]]),L44_ATH={R:[[.06,0],[.2,-.03],[.4,.02],[.36,.1],[.31,.22],[.25,.42],[.16,.66],[.07,.86],[0,1]]},L44_ATL={R:[[.04,0],[.12,-.01],[.2,.05],[.17,.14],[.16,.3],[.12,.55],[.07,.8],[0,1]]};
for(const s of[L44_ATH,L44_ATL]){s.L=s.R.map(([x,y])=>[-x,y]);s.mid=L44_MID}
/* a spike or a panicle of fruits: Pn(n) → F [ /φ &α Br(m) ] D Pn(n−1); Br(m) → F D Br(m−1); every D a cluster of two or three discs set round the axis, touching it */
function l44AtrFruit(og,len,op,cw,parts,lim,pan,acc){const rules={Pn:p=>p.n<=0?[['F',{l:p.li*.6,w1:1.2,e:.01}],['D',{}],['D',{}]]:[['F',{l:p.li*R(.85,1.15),w1:Math.max(1.2,p.w*(.6+.4*p.n/p.n0)),e:.012}],
      ...(pan&&p.n<p.n0-1&&p.n>1&&rnd()<.75?[['[',{w:1.3}],['/',{a:137.5*p.n+R(-20,20)}],['&',{a:R(30,44)}],['Br',{m:Math.round(R(2,4)*p.n/p.n0+1),li:p.li*.8}],[']',{}]]:[]),['D',{}],['Pn',Object.assign({},p,{n:p.n-1})]],
    Br:p=>p.m<=0?[['D',{}]]:[['F',{l:p.li*R(.85,1.15),w1:1.2,e:-.01}],['D',{}],['Br',Object.assign({},p,{m:p.m-1})]]};
  const n0=Math.max(3,Math.round(len/(1.1*UPC))),res=lsTurtle(lsDerive([['Pn',{n:n0,n0,li:len/n0,w:Math.max(1.4,og.w*.8)}]],rules,n0+8),{p:og.pos,H:og.H,U:og.U,w:Math.max(1.4,og.w*.8),seg:6,T:[0,1,0],e:0,wig:.04});
  const rd0=.55*UPC*(.42+.58*op),fc=mix(cw.fr,'#a8b870',Math.max(0,.5-op)*.6),P=pal7(fc),PB=pal7(mix(fc,'#d8c8a8',.3)),polys=[],seeds=[],det=DET>=1.5&&!LOD;
  for(const d of res.organs){if(d.t!=='D')continue;const nd=rnd()<.5?2:3,ph=R(0,6.283);
    for(let j=0;j<nd;j++){const a=ph+j*6.283/nd,out=V3.add(V3.sc(d.L,Math.cos(a)),V3.sc(d.U,Math.sin(a))),rd=rd0*R(.8,1.1),C=V3.add(V3.add(d.pos,V3.sc(out,rd*.62)),V3.sc(d.H,rd*R(-.2,.3))),
        Nn=V3.nz(V3.add(V3.sc(out,R(.2,.6)),V3.add(V3.sc(d.H,R(-.5,.5)),[0,0,R(.3,.9)]))),[X,Y]=fgCross(Nn),pts=[];
      for(let i=0;i<(det?12:8);i++){const b=i*6.283/(det?12:8),r=rd*(1+.05*Math.sin(b*3));pts.push(V3.add(C,V3.add(V3.sc(X,Math.cos(b)*r),V3.sc(Y,Math.sin(b)*r))))}
      if(lim!=null&&pts.some(p=>p[1]<lim))continue;const tn=l44Tone(P,PB,Nn,det?3:2);polys.push({pts:pts.map(fgQ),z:C[2]+Nn[2]*.1,col:tn.col});
      if(det&&tn.fr&&rnd()<.7){const sc=V3.add(C,V3.sc(X,rd*.12));seeds.push(fgPoly(sc,X,Y,[0,1,2,3,4,5].map(i=>[Math.cos(i*1.05)*rd*.2,Math.sin(i*1.05)*rd*.2])))}}}
  let da='',z=0,n=0;for(const ch of res.chains){da+='M'+ch.pts.map(p=>{z+=p[2];n++;const q=fgQ(p);return f(q[0])+','+f(q[1])}).join('L')}
  const sc=cw.st;parts.push({z:n?z/n-.3:og.pos[2],cast:false,fn:par=>E('path',{d:da,stroke:sc,'stroke-width':1.3,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)});
  acc.polys.push(...polys);acc.seeds.push(...seeds);acc.fc=fc}
/* every disc of the stem in a few batches (far to near), its seeds over them */
function l44AtrDiscs(acc,parts){const det=DET>=1.5&&!LOD,fc=acc.fc;if(!fc)return;l44Batch(acc.polys,det?3:2,parts,{ink:shd(fc,-.5),eo:.5,fo:.95,zb:.2});
  if(acc.seeds.length){const zz=acc.polys.reduce((a,q)=>Math.max(a,q.z),-1e9);parts.push({z:zz+.21,cast:false,fn:par=>E('path',{d:acc.seeds.map(fgD).join(''),fill:shd(fc,-.3),opacity:.55},par)})}}
function l44Atr(g,t,o){const cw=fgCw(CW_L44AT,o),op=l44Op(o),cm0=10,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l44at',()=>{const Lt=o.spine?blen(o.spine):70*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.04,.1)),cols=l44Cols(cw.st),lim=g35Lim(o),acc={polys:[],seeds:[]};
    const r=fgGrow(k,A,{li:3.4*UPC*kl,liT:.45,piece:DET>=1.5?9:14,post:(res,parts)=>l44AtrDiscs(acc,parts),w0:4.6*kl,w1:1.6,cols,uL:o.spine?.28:.16,phy:'spiral',la:48,face:.55,lift:.4,seg:10,wig:.02,tipLv:0,
      side:{u0:.42,u1:.74,p:.35,len:.36,ang:28,li:.75,e:.006,tilt:20},axil:{u0:.5,p:.75,ang:22},
      leaf:(og,p)=>{const u=p.o?Math.min(1,p.u+.25):p.u;if(u>.9)return null;const nar=u>.62,sz=fgSz(p,.5)*(p.o?.7:1)*kl*1.25*(1-.42*u),L=cm0*UPC*sz*R(.88,1.1),pl=L*R(.35,.5),F=g35Fr(og),
          P0=V3.add(F.P0,V3.add(V3.sc(F.H,pl),[0,-pl*.08,0])),c=mix(cw.c,shd(cw.c,R(-.1,.1)),.5);
        return[g35Leaf(P0,F.H,F.N,L,nar?L44_ATL:L44_ATH,c,cw.b,{lim,fold:.1,arch:.05,droop:.14,cup:.05,wave:.035,wk:4,wph:R(0,6),tw:R(-.4,.4),sm:1,dI:.02,
          veins:L44_ATV}),g35Pet(og.pos,V3.add(P0,V3.sc(F.H,L*.04)),Math.max(1.15,1.4*kl),cols[1])]},
      axDraw:(og,p)=>{const parts=[];l44AtrFruit(og,(4+5*(p.u||.5))*UPC*kl*(.6+.4*op),op,cw,parts,lim,false,acc);return parts},
      tip:(og,p)=>{const parts=[];l44AtrFruit(og,(p.o?7:12)*UPC*kl*(.55+.45*op),op,cw,parts,lim,!p.o,acc);return parts}});
    open(k,t,1000,0,.4);return r})}

/* ---------- grevillea foliage (Grevillea 'Ivanhoe', 'Moonlight', G. robusta): woody rusty-silky twigs, leaves alternate, deeply pinnatifid like a comb — narrow lobes cut almost to the
   midrib, alternate on its two sides, pointed; dark glossy green above, silky beneath (silver to rusty-brown); 'Ivanhoe' with broad lobes and bronze-red young growth, 'Moonlight'
   grey-green with long linear lobes, silver beneath; the silky oak (G. robusta) fern-like, its lobes cut again, golden beneath ---------- */
const CW_L44GR=[{id:'ivanhoe',n:'Vert profond (Ivanhoe)',c:'#2f4a2a',b:'#bfae94',y:'#8a4a32',sh:'iv',k:.66},{id:'ivanhoe-bronze',n:'Pousses bronze (Ivanhoe)',c:'#6a3a2e',b:'#c8a48a',y:'#9a3a2c',sh:'iv',k:.62},
  {id:'moonlight',n:'Gris-vert argenté (Moonlight)',c:'#7e907c',b:'#e2e4dc',y:'#9aa890',sh:'ml',k:.92},{id:'robusta',n:'Vert, revers doré (robusta)',c:'#4a6a34',b:'#c8a870',y:'#9a8a4a',sh:'rb',k:1}];
const L44_GRS={iv:{n:4,lj:.3,bw:.055,al:56,wg:.035,sub:0},ml:{n:6,lj:.42,bw:.022,al:34,wg:.016,sub:0},rb:{n:8,lj:.26,bw:.045,al:68,wg:.03,sub:2}};
/* one half of a comb-cut blade (x across, y along the midrib, in leaf lengths): the narrow wing on the midrib, n pointed lobes cut almost to it (off shifts them: the lobes alternate),
   lobes cut again into sub teeth (robusta), a narrow end lobe */
function l44Comb(S,off){const out=[[0,0],[S.wg*.6,.025]],n=S.n;
  for(let j=0;j<n;j++){const q=j/Math.max(1,n-1),y0=.07+.76*(j+off)/n,Lj=S.lj*(1-.45*q)*(.7+.3*Math.min(1,(j+off)/1.3))*R(.9,1.1),al=(S.al+14*q+R(-5,5))*D,dx=Math.sin(al),dy=Math.cos(al),bw=S.bw*(1-.25*q),b=[S.wg,y0];
    out.push([S.wg,y0-bw*1.5]);const m=S.sub?S.sub*3+2:4,edge=sg=>{const pts=[];for(let i=0;i<=m;i++){const t=.1+.84*i/m,bu=S.sub?1+.9*Math.max(0,Math.sin(Math.PI*(S.sub*t+(sg>0?.1:.6))))**2:1,w=bw*(1-.75*t)*bu;pts.push([b[0]+dx*Lj*t+dy*w*sg,b[1]+dy*Lj*t-dx*w*sg])}return pts};
    const lo=edge(1),hi=edge(-1);out.push(...lo,[b[0]+dx*(Lj+bw*.5),b[1]+dy*(Lj+bw*.5)],...hi.reverse(),[S.wg,y0+bw*1.4])}
  out.push([S.wg,.88],[S.bw*.7,.94],[0,1]);return out}
const L44_GRV=l44V([[[0,0],[0,.96]]]),L44_GRST=['#3a2018','#62382a','#8a5a40','#b4886a'];
function l44Grev(g,t,o){const cw=fgCw(CW_L44GR,o),op=l44Op(o),cm0=18,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l44gr',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),S=L44_GRS[cw.sh],lim=g35Lim(o);
    const shs=[0,1,2].map(()=>({R:l44Comb(S,0),L:l44Comb(S,.5).map(([x,y])=>[-x,y]),mid:L44_MID}));
    const r=fgGrow(k,A,{li:2.8*UPC*kl,liT:.45,w0:3.6*kl,w1:1.2,cols:L44_GRST,piece:DET>=1.5?9:14,uL:o.spine?.36:.2,phy:'spiral',la:44,face:.5,lift:.4,seg:10,wig:.03,
      side:{u0:.3,u1:.75,p:.24,len:.36,ang:40,li:.95,e:-.008,tilt:25},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,yg=u>.82?Math.max(0,(u-.82)/.18)*(.4+.6*(1-op)):0,sz=(p.tip?.45:fgSz(p,.78))*(p.o?.82:1)*kl*(1-.4*yg),L=cm0*cw.k*UPC*sz*R(.86,1.1),
          c=mix(cw.c,cw.y,yg*.85),F=g35Fr(og),dp=DET>=1.5&&!LOD,pl=dp?L*.07:og.w*.3,P0=V3.add(F.P0,V3.sc(F.H,pl));
        return[g35Leaf(P0,F.H,F.N,L,shs[Math.floor(rnd()*3)],mix(c,shd(c,R(-.06,.06)),.5),mix(cw.b,cw.y,yg*.5),{lim,fold:.14+.5*yg,arch:.07,droop:.12,cup:-.04,tw:R(-.6,.6),bend:R(-.06,.06),sm:0,dI:.02,ew:.32,
          veins:DET>=1.5?L44_GRV:null,vc:mix(cw.c,'#e8e0c8',.5),vw:.5,vo:.5}),...(dp?[g35Pet(F.P0,V3.add(P0,V3.sc(F.H,L*.03)),1.2,L44_GRST[1])]:[])]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the spear's length; the bamboo's leaf (canes of 35 to 65 cm); the frond; the leaf), and how the composer treats them:
   the spear and the cane are stiff lines along their spine; the fern, the orach and the grevillea stems of foliage at their natural length ---------- */
Object.assign(GH,{'palm-spear-seche':l44Palm,'dracaena-sanderiana-lucky-bamboo':l44Lucky,'adiantum-capillaire':l44Adi,'atriplex-hortensis-arroche':l44Atr,'grevillea-feuillage':l44Grev});
Object.assign(CWS,{'palm-spear-seche':CW_L44PS,'dracaena-sanderiana-lucky-bamboo':CW_L44LB,'adiantum-capillaire':CW_L44AD,'atriplex-hortensis-arroche':CW_L44AT,'grevillea-feuillage':CW_L44GR});
Object.assign(SZG,{'palm-spear-seche':[25,30,40,50],'dracaena-sanderiana-lucky-bamboo':[14,20,20,26],'adiantum-capillaire':[25,35,35,45],'atriplex-hortensis-arroche':[7,10,10,13],'grevillea-feuillage':[12,15,18,22]});
const L44_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'palm-spear-seche':L44_I(48,{form:'ligne',size:1,tip:1,fx:4*UPC}),'dracaena-sanderiana-lucky-bamboo':L44_I(50,{form:'ligne',size:1,tip:1,fx:4*UPC}),
  'adiantum-capillaire':L44_I(35,{fx:26}),'atriplex-hortensis-arroche':L44_I(65,{fx:28}),'grevillea-feuillage':L44_I(50,{fx:22})});
