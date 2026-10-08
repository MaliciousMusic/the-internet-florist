/* ================= Serre, lot 91 — graminées 2, poussées par le L-système : sétaire, alpiste, amourette, miscanthus, chasmanthium ================= */
/* ---------- shared: a grass culm grown by the L-system in the line's own frame (lnAxis of lot 18, laid on the composer's spine in a bouquet, hugging it, never sinking under it):
   nC internodes held up the axis, longer upward; some nodes carry a leaf — its sheath wrapped round the culm up to the ligule, then its blade, a 3D ribbon (lnRibbon) arching out
   and drooping under its weight, alternate in two ranks; at the top the inflorescence S.top(), grown by the same turtle with the species' own rules S.rules ---------- */
function l91Base(g,o,sid,Lf0,Lf){const op=Math.max(.05,Math.min(1,o.op??1)),st=op<.3?0:op<.75?1:2,bq=!!o.spine,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt,{bow:R(-.04,.04)}),gi=GHI[sid];
  return{op,st,k:G(g),parts:[],bq,A,L:A.L,Rm:gi.rch,fd:gi.fx*.92,UP:[0,1,0],as:Math.max(.7,Math.min(1.3,A.L/Lf0)),Wq:null}}
/* the stage tint: green when young, ripening to the colourway */
const l91Ripe=(c,st,gr='#8fa456',k0=.6,k1=.25)=>st===0?mix(c,gr,k0):st===1?mix(c,gr,k1):c;
/* a grass blade's width along it (v 0 at the ligule … 1 at the tip): narrowed at the ligule, then even, tapering to a fine point */
const l91BladeW=(v,t0=.62)=>v<.08?.62+.38*v/.08:v<t0?1:Math.max(.05,Math.pow(1-(v-t0)/(1-t0),.9));
function l91Grow(C,S){const{A,L,bq,UP,parts}=C,nC=S.nC,Lcu=L-S.Ltop,wsum=[...Array(nC)].reduce((s,_,i)=>s+.55+.9*i/(nC-1),0),ph0=R(0,360),lv=[];
  for(const q of S.leaves){let y=0;for(let i=0;i<=q.i;i++)y+=Lcu*(.55+.9*i/(nC-1))/wsum;if(bq&&y<L*(S.bqMin??.36))continue;lv.push(Object.assign({y},q))}
  for(const q of lv){q.e*=2.6;q.ar=(q.ar??2)*1.6}const lvAt=new Map(lv.map((q,b)=>[q.i,Object.assign(q,{b})])),nb=10;
  const rules=Object.assign({
    /* the culm: straight up its axis (aim), the last internodes giving a little toward the head's weight */
    C:p=>{if(p.i>=nC)return S.top();const out=[['F',{l:Lcu*(.55+.9*p.i/(nC-1))/wsum*R(.94,1.06),w1:S.wc*(1-.38*(p.i+1)/nC),aim:UP,k:S.k??.14,wig:.004,e:p.i>=nC-2?(S.e1||0):0}]],q=lvAt.get(p.i);
      if(q){const sl=Math.min(q.sh,Lcu*(.55+.9*(p.i+1)/(nC-1))/wsum*.8);out.push(['Nd',{i:p.i}],['[',{c:'sh',w:S.wc*1.42}],['F',{l:sl,w1:S.wc*1.24,aim:UP,k:.3}],
        ['[',{c:'bl',w:1}],['/',{a:ph0+180*q.b+R(-20,20)}],['&',{a:q.a*R(.85,1.15)}],['$',{}],['/',{a:R(-15,15)}],['o',{b:q.b,j:0}],['Bl',{b:q.b,j:0,l:q.len/nb,e:q.e,ar:q.ar??2,tw:R(-6,6)}],[']',{}],[']',{}])}
      out.push(['C',{i:p.i+1}]);return out},
    /* the blade: arching out a little at each step, drooping more toward its tip, slowly twisting */
    Bl:p=>p.j>=nb?[]:[['/',{a:p.tw}],['&',{a:p.ar}],['F',{l:p.l,e:p.e*Math.pow((p.j+1)/nb,1.3),wig:.012}],['o',{b:p.b,j:p.j+1}],['Bl',Object.assign({},p,{j:p.j+1})]]},S.rules||{});
  const res=lsTurtle(lsDerive([['C',{i:0}]],rules,nC+nb+(S.steps||24)),{p:[0,0,0],H:UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:S.wc}),Wq=C.Wq=l40Lay(A,bq,L,C.Rm,C.fd);
  const ink=h2l(S.cul)[2]>.66?shd(S.cul,-.5):null,cul=lnCols(S.cul,'#fffaf0'),shc=lnCols(S.sheath||S.leaf);
  /* the culm, the sheaths round it, the blades */
  const c0=res.chains[0];lnTube(c0.pts.map(Wq),c0.ws,()=>cul,parts,{gloss:.3,piece:24,min:bq?.58:.45,ink});
  for(const ch of res.chains)if(ch.c==='sh')lnTube(ch.pts.map(Wq),ch.ws,()=>shc,parts,{gloss:.2,piece:24,min:bq?.66:.5,zb:.03});
  const bl=lv.map(()=>[]);for(const og of res.organs)if(og.t==='o')bl[og.p.b][og.p.j]={p:og.pos,H:og.H,U:og.U};
  const pl=lnPals(S.leaf,S.leafB||mix(S.leaf,'#b8c49a',.28),S.sheath||mix(S.leaf,'#e4dcb8',.4));
  bl.forEach((nd,b)=>{if(nd.length<3)return;const q=lv[b],{P,U,V}=lnLay(A,nd,bq,L,C.Rm,C.fd),W=V.map(v=>q.w*(q.wp?q.wp(v):l91BladeW(v)));
    lnRibbon(P,U,W,V,{pal:pl.pal,palB:pl.palB,th:bq?.8:.35,piece:14,dI:DET>=1.5?.07:.12,mid:1,zb:.01+b*.001},parts);
    /* a pale midrib (miscanthus) */
    if(S.midrib)lnRibbon(P,U,W.map((w,i)=>w*.15*(V[i]<.85?1:1-(V[i]-.85)/.15)),V,Object.assign({th:.12,piece:14,dI:.2,zb:.012+b*.001},lnPals(S.midrib,mix(S.midrib,S.leaf,.3))),parts)});
  /* the nodes, darker rings (on the sheets) */
  if(DET>=1.5&&!LOD)for(const og of res.organs){if(og.t!=='Nd')continue;const P=Wq(og.pos),H=A.Wv(og.pos,og.H),S0=[P[0],-P[1]],h2=[H[0],-H[1]],hl=Math.hypot(h2[0],h2[1])||1,w=og.w*.62;
    parts.push({z:P[2]+.05,fn:par=>E('path',{d:`M${f(S0[0]-h2[1]/hl*w)},${f(S0[1]+h2[0]/hl*w)}L${f(S0[0]+h2[1]/hl*w)},${f(S0[1]-h2[0]/hl*w)}`,stroke:shd(S.cul,-.42),'stroke-width':.8,'stroke-linecap':'round'},par)})}
  return res}
/* the screen polyline of a chain (view space laid by Wq), its mean depth */
function l91Scr(C,ch){const P=ch.pts.map(C.Wq);let z=0;for(const p of P)z+=p[2];return{P,S:P.map(p=>[p[0],-p[1]]),z:z/P.length}}
/* the sheath of the flag leaf swollen round an inflorescence still in the boot: a spindle along the first part of its screen axis S (up to fr of it) */
function l91Boot(parts,S,z,fr,w,col){const n=Math.max(2,Math.round((S.length-1)*fr)),Q=S.slice(0,n+1);
  parts.push({z:z+.6,fn:par=>E('path',{d:polyRibbon(Q,i=>w*(.75+.45*Math.sin(Math.PI*Math.min(1,i/n*.85))*(1-.55*Math.pow(i/n,3)))),fill:toneAt(pal7(col),.6),stroke:shd(col,-.5),'stroke-width':.3,'stroke-opacity':.5},par)})}
/* a hanging pedicel: from its branch tip p0 (view space) curving out then down to the base b of what it carries; never finer than 1.1 in a bouquet (it stays joined) */
function l91Ped(parts,p0,b,out,col,bq){const m=V3.add(p0,V3.sc(out,V3l(V3s(b,p0))*.55));
  parts.push({z:(p0[2]+b[2])/2,fn:par=>E('path',{d:`M${f(p0[0])},${f(-p0[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`,fill:'none',stroke:col,'stroke-width':bq?1.15:.62,'stroke-linecap':'round'},par)})}
/* the screen frame of a small body hanging along h3 (view space): its screen direction, its foreshortening, and the unit across it */
function l91Scrn(h3){const s=[h3[0],-h3[1]],l=Math.hypot(s[0],s[1]);const u=l>1e-4?[s[0]/l,s[1]/l]:[0,1];return{u,v:[-u[1],u[0]],fs:Math.max(.35,l)}}

/* ---------- sétaire (Setaria italica, millet des oiseaux 'Lowrey', 'Red Jewel'; S. viridis smaller): a leafy culm with broad flat blades, ending in a dense cylindrical
   false spike (12–20 cm × 1.5–2.5 cm) of crowded spikelets, each with long rough bristles that make it soft and silky; the head arches and nods under its weight.
   Green, ripening to gold and bronze; purple-tinged and dyed forms ---------- */
const L91_CW_SET=[
 {id:'vert',n:'Vert (Lowrey)',c:'#8fa34e',br:'#b4c27a'},
 {id:'vert-fonce',n:'Vert foncé',c:'#5c7434',br:'#8a9a5a'},
 {id:'anis',n:'Vert anis',c:'#b9c84a',br:'#d4dc8a'},
 {id:'dore',n:'Doré (séché)',c:'#c9ab68',br:'#e0cc96'},
 {id:'bronze',n:'Bronze (mûr)',c:'#9a7a45',br:'#c4a26a'},
 {id:'pourpre',n:'Pourpre fumé (Red Jewel)',c:'#7c6f86',br:'#a08a9a'},
 {id:'bordeaux',n:'Teint bordeaux',c:'#8e2438',br:'#b4505e'}];
const L91_SETP=v=>(v<.14?.42+.58*Math.sin(v/.14*Math.PI/2):1)*(1-.6*Math.pow(Math.max(0,(v-.58)/.42),1.6));
function l91Setaria(g,t,o){const cw=cwPick(L91_CW_SET,o),C=l91Base(g,o,'setaria',75*UPC,(o.cm||75)*UPC),{st,L,bq,as,parts}=C,dry=h2l(cw.c)[2]>.5&&cw.id!=='anis'||cw.id==='bordeaux';
  const Ls=R(12,16)*UPC*as*[.6,.85,1][st],Rb=R(.7,.82)*UPC*as*[.6,.85,1][st],n=12,nod=[.6,3.2,5.6][st]*R(.8,1.2),gs=dry?'#a8a070':'#7d9448';
  const res=l91Grow(C,{nC:7,wc:Math.max(1.3,.32*UPC*Math.pow(as,.4)),Ltop:Ls*.82,k:.12,e1:[0,.02,.035][st],cul:dry?mix(cw.c,'#c4b88a',.6):'#7d9448',leaf:dry?mix(cw.c,'#b8ac78',.55):'#5f8436',
    leaves:[{i:1,len:R(22,28)*UPC*as,w:R(1.5,2)*UPC*as,sh:7*UPC*as,a:28,e:.13},{i:3,len:R(20,26)*UPC*as,w:R(1.4,1.8)*UPC*as,sh:7*UPC*as,a:26,e:.12},{i:5,len:R(15,20)*UPC*as*(bq?.7:1),w:R(1.2,1.5)*UPC*as,sh:6*UPC*as,a:22,e:.1}],
    /* the head: its axis on from the culm, nodding more as it ripens and grows heavy */
    top:()=>[['[',{c:'spk',w:Rb*.6}],['&',{a:[2,8,14][st]*R(.7,1.3)}],['Sp',{j:0}],[']',{}]],
    rules:{Sp:p=>p.j>=n?[]:[['&',{a:nod*(.5+p.j/n)}],['F',{l:Ls/n,w1:Rb*.6,e:.02,wig:.006}],['Sp',{j:p.j+1}]]}});
  const ch=res.chains.find(c=>c.c==='spk');
  if(ch){const{S,z}=l91Scr(C,ch),[Q]=lnSub(ch.pts.map(C.Wq)),S2=Q.map(p=>[p[0],-p[1]]),hw=S2.map((_,i)=>Rb*L91_SETP(i/(S2.length-1))+.6),col=l91Ripe(cw.c,st,gs),brc=l91Ripe(cw.br,st,'#a8b870',.5,.2);
    parts.push({z:z+.5,fn:par=>l91Bristle(par,S2,hw,col,brc,st)});if(st===0)l91Boot(parts,S,z,.45,Rb*1.05,dry?mix(cw.c,'#a8a070',.4):'#7f9f56')}
  drawParts(C.k,parts);open(C.k,t,1100,0,.5);const sc=dry?mix(cw.c,'#c4b88a',.6):'#7d9448';return{k:C.k,bw:2.4,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}
/* a bristly cylinder: a silky halo of bristles round the woolly body (lot 37's spike), and on the sheets the bristles themselves, rough, combed toward the tip */
function l91Bristle(par,S,hw,col,brc,st){const n=S.length,ds=S.map((_,i)=>{const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]}),ph=R(0,6.28);
  const side=(s,k)=>S.map((c,i)=>{const[dx,dy]=ds[i],r=hw[i]*k*(1+.06*Math.sin(i*1.9+s+ph));return[c[0]-dy*r*s,c[1]+dx*r*s]}),tp=[S[n-1][0]+ds[n-1][0]*hw[n-1]*.9,S[n-1][1]+ds[n-1][1]*hw[n-1]*.9];
  const kh=[1.25,1.42,1.5][st];E('path',{d:smooth(side(1,kh).concat([tp],side(-1,kh).reverse())),fill:brc,opacity:LOD?.4:.34},par);
  g37LagSpike(par,S,hw,col,Math.min(1,st));
  if(LOD||DET<1.5)return;let d='',dd='';
  for(let i=1;i<n-1;i++)for(const s of[-1,1])for(let k=0;k<2;k++){const[dx,dy]=ds[i],r=hw[i],u=R(.55,.9),bx=S[i][0]-dy*r*s*u,by=S[i][1]+dx*r*s*u,h=r*R(.45,.75)*[.5,.85,1][st],a=R(.25,.6),
      seg=`M${f(bx)},${f(by)}l${f(-dy*s*h*(1-a*.5)+dx*h*a)},${f(dx*s*h*(1-a*.5)+dy*h*a)}`;if(s<0)dd+=seg;else d+=seg}
  E('path',{d,stroke:mix(brc,'#ffffff',.2),'stroke-width':.26,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},par);E('path',{d:dd,stroke:shd(brc,-.25),'stroke-width':.26,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},par)}

/* ---------- alpiste (Phalaris canariensis): a stiff upright culm, few narrow leaves, the upper sheath inflated; at its top one compact ovoid head (2–4 cm × 1.2–1.8 cm)
   of tightly packed, laterally flattened spikelets: each glume keeled and winged, white-papery with green veins and a green keel, so the head looks striped green on white.
   Fresh pale green, then cream and straw when dried; bleached and dyed ---------- */
const L91_CW_PHA=[
 {id:'vert',n:'Vert pâle (frais)',c:'#a6b37d',kc:'#56743a'},
 {id:'creme',n:'Naturel crème',c:'#e9e1cc',kc:'#a6a070'},
 {id:'blanc',n:'Blanchi',c:'#f6f4ee',kc:'#c8c2a8'},
 {id:'grege',n:'Grège',c:'#ddd6c6',kc:'#a49a84'},
 {id:'terracotta',n:'Teint terracotta',c:'#b4643f',kc:'#7a3e26'},
 {id:'chocolat',n:'Teint chocolat',c:'#5a3a2b',kc:'#3a241a'}];
const L91_PHAP=prof([[0,.3],[.14,.78],[.4,1],[.68,.86],[.88,.52],[1,.1]]);
function l91Phalaris(g,t,o){const cw=cwPick(L91_CW_PHA,o),C=l91Base(g,o,'phalaris',50*UPC,(o.cm||50)*UPC),{st,L,bq,as,parts,A}=C,fresh=cw.id==='vert';
  const Lh=R(2.5,3.2)*UPC*as*[.65,.88,1][st],Wh=Lh*R(.5,.58),sc=fresh?'#7f9a50':mix(cw.c,'#c3b98f',.55);
  const res=l91Grow(C,{nC:6,wc:Math.max(1.2,.24*UPC*Math.pow(as,.4)),Ltop:Lh*.95,k:.24,cul:sc,leaf:fresh?'#6f8f48':mix(cw.c,'#b8ae80',.5),
    leaves:[{i:1,len:R(13,17)*UPC*as,w:.75*UPC*as,sh:6*UPC*as,a:24,e:.07},{i:3,len:R(10,14)*UPC*as,w:.7*UPC*as,sh:7*UPC*as,a:20,e:.06}],
    top:()=>[['[',{c:'pdc',w:1}],['F',{l:Lh*.12,aim:[0,1,0],k:.2}],['Hd',{}],[']',{}]]});
  const hd=res.organs.find(q=>q.t==='Hd'),pdc=res.chains.find(c=>c.c==='pdc');if(pdc)lnTube(pdc.pts.map(C.Wq),pdc.ws.map(()=>Math.max(1.2,.24*UPC*Math.pow(as,.4))*.62),()=>lnCols(sc,'#fffaf0'),parts,{piece:24,min:bq?.58:.45});
  if(hd){const p=C.Wq(hd.pos),h=A.Wv(hd.pos,hd.H),col=l91Ripe(cw.c,st,'#9fb26a',.55,.2),kc=l91Ripe(cw.kc,st,'#56743a',.6,.25);l91Ovoid(parts,p,h,Lh,Wh,col,kc,st);
    if(st===0){const b0=V3.add(p,V3.sc(h,-Lh*.35)),S=[...Array(9)].map((_,i)=>{const q=V3.add(b0,V3.sc(h,Lh*1.1*i/8));return[q[0],-q[1]]});l91Boot(parts,S,p[2]+Wh*.3,.75,Wh*.42,fresh?'#86a45a':mix(cw.c,'#b0a878',.5))}}
  drawParts(C.k,parts);open(C.k,t,1100,0,.4);return{k:C.k,bw:2,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}
/* the ovoid head in 3D from its base p along h: a body (its silhouette, the shade between the spikelets), then the spikelets seen on its surface, back to front, those turned away dropped;
   each a keeled glume: its winged outline pale and lit by its own normal, its green keel a stripe up its middle */
function l91Ovoid(parts,p,h,Lh,Wh,col,kc,st){const[X,Y]=l23Across(h),nu=DET>=1.5?7:5,nf=DET>=1.5?8:6,ls=Lh/nu*1.75,ws=Math.PI*Wh/nf*.95,P=pal7(col),pts=[],sp=[];
  const rad_=u=>Wh/2*L91_PHAP(u),rot=R(0,6.283);
  for(let i=0;i<=12;i++)for(let j=0;j<12;j++){const u=i/12,a=j/12*6.283,r=rad_(u),q=V3.add(V3.add(p,V3.sc(h,u*Lh)),V3.add(V3.sc(X,Math.cos(a)*r),V3.sc(Y,Math.sin(a)*r)));pts.push([q[0],-q[1]])}
  const body=l23Hull(pts),zc=p[2]+h[2]*Lh*.5;parts.push({z:zc-Wh*.55,fn:par=>E('path',{d:smooth(body),fill:mix(kc,col,.55),stroke:shd(kc,-.4),'stroke-width':.3,'stroke-opacity':.5},par)});
  for(let i=0;i<nu;i++)for(let j=0;j<nf;j++){const u=.03+.86*(i+.5)/nu,a=rot+(j+(i%2)*.5)/nf*6.283,r=rad_(u),dr=(rad_(Math.min(1,u+.02))-rad_(Math.max(0,u-.02)))/(.04*Lh),ra=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),
      c=V3.add(V3.add(p,V3.sc(h,u*Lh)),V3.sc(ra,r*.92)),n=V3.nz(V3s(ra,V3.sc(h,dr))),m=V3.nz(V3.add(V3.add(h,V3.sc(ra,Math.max(-.5,Math.min(.35,dr)))),V3.sc(ra,.22*[.2,.7,1][st]))),tv=V3.nz(V3.cr(n,m));
    if(n[2]<-.12)continue;const I=Math.max(.2,Math.min(1,lightI(n)*.8+.25)),l=ls*(1-.25*Math.abs(u-.45)),w=ws*Math.min(1,r/(Wh*.35)),L_=[],R_=[],K=[];
    for(let k=0;k<=8;k++){const x=k/8,y=Math.pow(Math.sin(Math.PI*Math.min(1,x*1.02)),.55)*(1-.22*x),b=V3.add(c,V3.sc(m,(x-.4)*l)),e1=V3.add(b,V3.sc(tv,y*w*.5)),e2=V3.add(b,V3.sc(tv,-y*w*.5)),k1=V3.add(b,V3.sc(tv,y*w*.09));
      L_.push([e1[0],-e1[1]]);R_.push([e2[0],-e2[1]]);K.push([k1[0],-k1[1]])}
    const out=L_.concat(R_.slice(1,-1).reverse()),kl=K.concat(R_.slice(1,-1).map((q,ii)=>{const b=L_[ii+1];return[q[0]*.6+b[0]*.4,q[1]*.6+b[1]*.4]}).reverse()),tone=toneAt(P,I),ink=shd(kc,-.35);
    sp.push({z:c[2],fn:par=>{E('path',{d:smooth(out),fill:tone,stroke:LOD?'none':ink,'stroke-width':.25,'stroke-opacity':.5},par);E('path',{d:smooth(kl),fill:kc,opacity:LOD?.7:.85},par)}})}
  parts.push(...sp)}

/* ---------- amourette (Briza maxima; B. media smaller): a slender culm, a few short flat leaves, and a loose, open panicle of hair-thin branches, nodding;
   from each hangs on its fine pedicel one plump ovate spikelet (1–2.5 cm), heart-shaped at its base: a locket of 7–20 florets whose broad rounded lemmas lie in two ranks,
   so it looks braided across, each lemma margined paler; it trembles at a breath. Green, often tinged purple-brown, ripening to gold and straw ---------- */
const L91_CW_BRI=[
 {id:'vert',n:'Vert tendre (frais)',c:'#a5b778',mg:'#e4ead0'},
 {id:'olive',n:'Vert olive',c:'#6f7f45',mg:'#c8d0a0'},
 {id:'pourpre',n:'Vert teinté pourpre',c:'#7a5a6a',mg:'#d8c8b8'},
 {id:'dore',n:'Doré naturel (séché)',c:'#d8bf7a',mg:'#f2e8c8'},
 {id:'blanc',n:'Blanchi',c:'#f2eee2',mg:'#fbfaf4'},
 {id:'framboise',n:'Teint framboise',c:'#b8324f',mg:'#e89aac'}];
const L91_BRIP=prof([[0,.4],[.08,.82],[.3,1],[.58,.9],[.84,.56],[1,.14]]);
function l91Briza(g,t,o){const cw=cwPick(L91_CW_BRI,o),Hp=(o.cm||15)*UPC,C=l91Base(g,o,'briza',45*UPC,Hp*3),{st,L,bq,parts,A}=C,as=Math.max(.7,Math.min(1.3,Hp/(15*UPC))),dry=['dore','blanc','framboise'].includes(cw.id);
  const Lp=Math.min(L*.4,Hp*R(.9,1.05))*[.6,.85,1][st],nb=Math.round(R(4,6)),sc=dry?mix(cw.c,'#c8b884',.55):'#8a9c5c',Ls=R(1.7,2.2)*UPC*as*[.55,.85,1][st],Ws=Ls*R(.64,.72);
  const res=l91Grow(C,{nC:6,wc:Math.max(1.15,.18*UPC),Ltop:Lp*.7,k:.13,e1:.02,cul:sc,leaf:dry?mix(cw.c,'#c0b080',.55):'#7a9a4a',
    leaves:[{i:1,len:R(9,13)*UPC*as,w:.6*UPC*as,sh:5*UPC*as,a:30,e:.12},{i:3,len:R(7,10)*UPC*as,w:.55*UPC*as,sh:5*UPC*as,a:28,e:.1}],bqMin:.45,
    /* the panicle: a nodding rachis; at its nodes one branch, alternate, spreading and bowed, sometimes forked; a spikelet at every tip */
    top:()=>[['[',{c:'rach',w:.9}],['&',{a:[3,10,16][st]*R(.7,1.3)}],['Ra',{j:0}],[']',{}]],steps:16,
    rules:{Ra:p=>{if(p.j>=nb)return[['F',{l:Lp/nb*.6,e:[.01,.04,.06][st],w1:.5}],['Sk',{}]];const q=p.j/nb,bl=Lp*(.6-.3*q)*R(.85,1.15),a=[14,45,62][st]*R(.8,1.2)*(1-.3*q);
      const out=[['&',{a:[.5,3,5][st]}],['F',{l:Lp/nb*R(.85,1.15),e:[.005,.03,.05][st],w1:.8-.3*q,wig:.008}],['[',{c:'br',w:.6}],['/',{a:p.j*180+R(-35,35)}],['&',{a}],['F',{l:bl*.55,e:.12,w1:.5}]];
      if(q<.5&&rnd()<.6)out.push(['[',{c:'br',w:.5}],['/',{a:R(60,120)}],['&',{a:R(20,35)}],['F',{l:bl*.35,e:.05,w1:.45}],['Sk',{}],[']',{}]);
      out.push(['&',{a:[2,10,16][st]}],['F',{l:bl*.45,e:.15,w1:.45}],['Sk',{}],[']',{}],['Ra',{j:p.j+1}]);return out}}});
  /* the rachis and branches, hair-thin (never under 1.1 in a bouquet) */
  const bc=lnCols(sc,'#fffaf0');for(const ch of res.chains)if(ch.c==='rach'||ch.c==='br')lnTube(ch.pts.map(C.Wq),ch.ws,()=>bc,parts,{piece:24,min:bq?.56:.3});
  const col=l91Ripe(cw.c,st,'#9fb46a',.6,.22),mg=l91Ripe(cw.mg,st,'#dfe8c0',.5,.2),down=[0,-1,0];
  for(const og of res.organs){if(og.t!=='Sk')continue;const p0=C.Wq(og.pos),H=A.Wv(og.pos,og.H),dn=A.Wv(og.pos,down),out=V3.nz(V3.add(H,V3.sc(dn,.2))),lp=R(.5,1.1)*UPC*as,
      b=V3.add(p0,V3.add(V3.sc(out,lp*.45),V3.sc(dn,lp*.75))),h3=V3.nz(V3.add(V3.sc(dn,[.35,.8,1][st]),V3.add(V3.sc(out,[.9,.35,.2][st]),[R(-.15,.15),0,R(-.15,.15)]))),n3=V3.nz(V3.cr(h3,V3.nz([R(-1,1),R(-.2,.2),R(-1,1)])));
    l91Ped(parts,p0,b,out,bc[3],bq);const s=Ls*R(.8,1.15),w=Ws*R(.9,1.1);parts.push({z:b[2]+h3[2]*s*.5+.05,fn:par=>l91Locket(par,b,h3,n3,s,w,col,mg,st)})}
  drawParts(C.k,parts);open(C.k,t,1000,0,.6);return{k:C.k,bw:2,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}
/* one briza spikelet from its base b (view space) along h3, plump (its thickness 0.6 of its width), its face n3: the heart-shaped outline scalloped by the lemmas,
   lit from the upper left, the lemmas' rounded backs across it in two alternate ranks, each with its pale margin */
function l91Locket(par,b,h3,n3,Ls,W,col,mg,st){const{u,v,fs}=l91Scrn(h3),v3=V3.nz(V3.cr(n3,h3)),pv=[v3[0],-v3[1]],pn=[n3[0],-n3[1]],we=W*Math.max(.55,Math.min(1.05,Math.abs(pv[0]*v[0]+pv[1]*v[1])+.6*Math.abs(pn[0]*v[0]+pn[1]*v[1]))),
    L=Ls*fs,B=[b[0],-b[1]],P=pal7(col),nf=Math.max(5,Math.round(Ls/(.17*UPC))),sc=x=>1+.07*Math.abs(Math.sin(x*nf*Math.PI)),pt=(x,y)=>[B[0]+u[0]*x*L+v[0]*y,B[1]+u[1]*x*L+v[1]*y],m=14,lt_=[],rt_=[];
  for(let i=0;i<=m;i++){const x=i/m,hw=we/2*L91_BRIP(x)*sc(x);lt_.push(pt(x,hw));rt_.push(pt(x,-hw))}
  const lit=-(v[0]+v[1])>0?1:-1,I=Math.abs(lightI(n3))*.5+.4,ink=shd(col,-.5);
  E('path',{d:smooth(lt_.concat(rt_.reverse())),fill:LOD?toneAt(P,I):ugrad(...pt(.5,we/2*lit),...pt(.5,-we/2*lit),[[0,toneAt(P,Math.min(1,I+.22))],[1,toneAt(P,Math.max(.15,I-.22))]]),stroke:ink,'stroke-width':.3,'stroke-opacity':.55},par);
  if(LOD)return;let d='',dm='';
  for(let k=1;k<nf;k++){const x=k/nf*.92+.04,hw=we/2*L91_BRIP(x)*.96,s=k%2?1:-1,a=pt(x-.02,hw*s),c=pt(x+.06,0),e=pt(x-.01,-hw*s*.35);
    d+=`M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`;if(DET>=1.5){const a2=pt(x-.05,hw*s*.95),c2=pt(x+.02,hw*s*.2);dm+=`M${f(a2[0])},${f(a2[1])}Q${f(c2[0])},${f(c2[1])} ${f(e[0])},${f(e[1])}`}}
  E('path',{d,fill:'none',stroke:ink,'stroke-width':DET>=1.5?.32:.45,'stroke-opacity':.5,'stroke-linecap':'round'},par);if(dm)E('path',{d:dm,fill:'none',stroke:mg,'stroke-width':.4,'stroke-opacity':.75,'stroke-linecap':'round'},par)}

/* ---------- miscanthus (Miscanthus sinensis 'Gracillimus', 'Malepartus', 'Rotsilber', 'Silberfeder'): a tall stiff culm, long ribbon leaves (1–2 cm wide) with a white midrib,
   arching; at its top a large fan-shaped plume (20–30 cm) of 10–25 slender racemes from a short axis, their paired spikelets wrapped in long silky hairs:
   held close and coppery pink when it comes out of the sheath, then spreading and fluffing into a silver or rose feather, the racemes curling out at their tips ---------- */
const L91_CW_MIS=[
 {id:'argent',n:'Argenté (Silberfeder)',c:'#e9e4d8'},
 {id:'blanc',n:'Blanc crème',c:'#f2eee4'},
 {id:'creme',n:'Crème doré (séché)',c:'#d9cdb3'},
 {id:'rose',n:'Vieux rose (Rotsilber)',c:'#dba0aa'},
 {id:'peche',n:'Pêche (Flamingo)',c:'#e7ad84'},
 {id:'cuivre',n:'Rouge cuivré (Malepartus)',c:'#a2463f'},
 {id:'bordeaux',n:'Bordeaux',c:'#6e2433'}];
function l91Misc(g,t,o){const cw=cwPick(L91_CW_MIS,o),C=l91Base(g,o,'miscanthus',80*UPC,(o.cm||80)*UPC),{st,L,bq,as,parts}=C;
  const Lp=Math.min(L*.36,R(22,28)*UPC*Math.pow(as,.7))*[.7,.9,1][st],Lr=Lp*.32,nR=Math.round(R(6,8)),sc='#b9a982',lc='#5f7f3e';
  const res=l91Grow(C,{nC:7,wc:Math.max(1.4,.42*UPC*Math.pow(as,.4)),Ltop:Lp*.9,k:.18,e1:[0,.008,.015][st],cul:sc,leaf:lc,leafB:'#7f9a68',sheath:'#a8a878',midrib:'#eef0dc',
    leaves:[{i:1,len:R(40,52)*UPC*as,w:R(1.3,1.6)*UPC*as,sh:12*UPC*as,a:16,e:.14,ar:2.5},{i:3,len:R(36,46)*UPC*as*(bq?.55:1),w:R(1.2,1.5)*UPC*as,sh:12*UPC*as,a:14,e:.13,ar:2.5},{i:5,len:R(28,36)*UPC*as*(bq?.5:1),w:R(1.1,1.3)*UPC*as,sh:10*UPC*as,a:12,e:.12,ar:2}],
    /* the plume: a short axis with two racemes at each node, the lower ones longest; held close in the sheath, then spreading; their tips curl out when the plume is open */
    top:()=>[['[',{c:'rach',w:1.2}],['Ra',{j:0}],[']',{}]],steps:20,
    rules:{Ra:p=>{if(p.j>=nR)return[['F',{l:Lr/nR*.5,w1:.6}],['[',{c:'rm',w:.7}],['Rm',{j:0,l:Lp*.62/6,e:[.005,.03,.06][st]}],[']',{}]];const q=p.j/nR,out=[['F',{l:Lr/nR*R(.85,1.15),w1:1.1-.4*q,aim:[0,1,0],k:.15}]];
      for(let b=0;b<2;b++){const a=[3,12,30][st]*R(.8,1.25)*(1-.35*q),bl=Lp*(.8-.22*q)*R(.88,1.08);out.push(['[',{c:'rm',w:.7}],['/',{a:p.j*137.5+b*180+R(-30,30)}],['&',{a}],['Rm',{j:0,l:bl/6,e:[.005,.04,.085][st]*R(.8,1.2)}],[']',{}])}
      out.push(['Ra',{j:p.j+1}]);return out},
      Rm:p=>p.j>=6?[]:[['&',{a:[0,1.5,5][st]*p.j/5}],['F',{l:p.l,e:p.e*Math.pow((p.j+1)/6,1.4),w1:.6-.05*p.j,wig:.01}],['Rm',Object.assign({},p,{j:p.j+1})]]}});
  const col=st===0?mix(cw.c,'#9a5a4a',.42):st===1?mix(cw.c,'#b07a6a',.18):cw.c,dk=h2l(col)[2]<.35,body=shd(col,.06),shade=h2l(col)[2]>.85?mix(col,'#9c8f78',.5):mix(shd(col,-.45),'#7a6048',.15),thread=shd(col,-.3),barb=shd(col,-.28);
  const rc=lnCols(sc,'#fffaf0'),rach=res.chains.find(c=>c.c==='rach');if(rach)lnTube(rach.pts.map(C.Wq),rach.ws,()=>rc,parts,{piece:24,min:bq?.6:.45});
  const rms=res.chains.filter(c=>c.c==='rm').map(ch=>l91Scr(C,ch)),zc=rms.length?rms.reduce((a,r)=>a+r.z,0)/rms.length:0,hw0=[.3,.6,1.2][st]*R(.55,.7)*UPC*Math.pow(as,.5),op0=dk?.82:.6;
  for(const r of rms){const sx=Math.max(-1,Math.min(1,(r.z-zc)/(Lp*.15))),kd=Math.max(0,Math.min(.7,.3-.3*sx));
    l40Veil(r.P,{hw:v=>hw0*Math.pow(Math.sin(Math.PI*Math.min(1,.08+.92*v)),.5)*(1-.25*v)+.55,body:mix(body,shade,kd*.7),shade,thread,barb,op:op0,halo:st?1.3:1.1,tw:.5},parts)}
  if(st===0){const rm0=res.chains.filter(c=>c.c==='rm')[0];if(rach&&rm0){const{S,z}=l91Scr(C,{pts:rach.pts.concat(rm0.pts.slice(1))});l91Boot(parts,S,z+2,.62,.42*UPC*as,'#a8a878')}}
  drawParts(C.k,parts);open(C.k,t,1100,0,.5);return{k:C.k,bw:2.8,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}

/* ---------- chasmanthium (Chasmanthium latifolium, northern sea oats): an arching culm clothed in broad, flat, bamboo-like leaves held out from it (10–20 cm × 1–2 cm);
   at its top a loose, nodding panicle whose thin branches bow under flat spikelets (2–4 cm × 1–1.5 cm) dangling on short pedicels: each laterally flattened like a fish or an oat,
   its 6–14 florets overlapping in a herringbone, its edges toothed by their keeled tips; green, then bronze and copper, then straw when dried ---------- */
const L91_CW_CHA=[
 {id:'vert',n:'Vert (frais)',c:'#8ea35a'},
 {id:'vert-bronze',n:'Vert bronze',c:'#a39350'},
 {id:'bronze',n:'Bronze cuivré',c:'#b5793f'},
 {id:'brun',n:'Brun doré',c:'#9a7a45'},
 {id:'paille',n:'Paille (séché)',c:'#d6c38e'}];
const L91_CHAL=prof([[0,.3],[.06,.55],[.25,.95],[.4,1],[.65,.75],[.88,.32],[1,.03]]),L91_CHAP=prof([[0,.24],[.1,.72],[.32,1],[.6,.92],[.84,.58],[.96,.22],[1,.05]]);
function l91Chasm(g,t,o){const cw=cwPick(L91_CW_CHA,o),Hp=(o.cm||25)*UPC,C=l91Base(g,o,'chasmanthium',70*UPC,Hp*2.8),{st,L,bq,parts,A}=C,as=Math.max(.7,Math.min(1.3,Hp/(25*UPC))),dry=cw.id!=='vert';
  const Lp=Math.min(L*.42,Hp*R(.95,1.1))*[.65,.88,1][st],nb=Math.round(R(4,6)),sc=dry?mix(cw.c,'#b8a878',.5):'#7f9450',lc=dry?mix(cw.c,'#a8a070',.5):'#5f8a3a',Ls=R(2.6,3.3)*UPC*as*[.6,.88,1][st],Ws=Ls*R(.5,.56);
  const lv=[];for(let i=1;i<6;i++)lv.push({i,len:R(15,20)*UPC*as*(1-.08*Math.abs(i-3)),w:R(1.5,1.9)*UPC*as,sh:5*UPC*as,a:R(48,62),e:.05,ar:1.4,wp:L91_CHAL});
  const res=l91Grow(C,{nC:7,wc:Math.max(1.2,.22*UPC),Ltop:Lp*.7,k:.1,e1:[.01,.03,.045][st],cul:sc,leaf:lc,leafB:dry?mix(lc,'#c8bc90',.3):'#86a466',leaves:lv,bqMin:.5,
    /* the panicle: a nodding rachis; one branch at each node, alternate, bowed down by its spikelets; two to four spikelets on short pedicels along it */
    top:()=>[['[',{c:'rach',w:1}],['&',{a:[3,9,14][st]*R(.7,1.3)}],['Ra',{j:0}],[']',{}]],steps:16,
    rules:{Ra:p=>{if(p.j>=nb)return[['&',{a:[1,6,9][st]}],['F',{l:Lp/nb*.5,e:[.02,.06,.09][st],w1:.55}],['Sk',{}]];const q=p.j/nb,bl=Lp*(.55-.25*q)*R(.85,1.15),a=[12,36,52][st]*R(.8,1.2),ns=q<.4?3:2;
      const out=[['&',{a:[.5,4,7][st]}],['F',{l:Lp/nb*R(.85,1.15),e:[.01,.04,.06][st],w1:.9-.35*q,wig:.008}],['[',{c:'br',w:.65}],['/',{a:p.j*180+R(-35,35)}],['&',{a}]];
      for(let s=0;s<ns;s++)out.push(['&',{a:[1,7,11][st]}],['F',{l:bl/ns,e:[.03,.1,.14][st],w1:.6-.1*s}],['Sk',{}]);out.push([']',{}],['Ra',{j:p.j+1}]);return out}}});
  const bc=lnCols(sc,'#fffaf0');for(const ch of res.chains)if(ch.c==='rach'||ch.c==='br')lnTube(ch.pts.map(C.Wq),ch.ws,()=>bc,parts,{piece:24,min:bq?.56:.32});
  const col=l91Ripe(cw.c,st,'#8ea35a',.65,.25),down=[0,-1,0];
  for(const og of res.organs){if(og.t!=='Sk')continue;const p0=C.Wq(og.pos),H=A.Wv(og.pos,og.H),dn=A.Wv(og.pos,down),out=V3.nz(V3.add(H,V3.sc(dn,.3))),lp=R(.5,1.2)*UPC*as,
      b=V3.add(p0,V3.add(V3.sc(out,lp*.4),V3.sc(dn,lp*.7))),h3=V3.nz(V3.add(V3.sc(dn,[.3,.85,1][st]),V3.add(V3.sc(out,[1,.4,.22][st]),[R(-.2,.2),0,R(-.2,.2)]))),n3=V3.nz(V3.cr(h3,V3.nz([R(-1,1),R(-.15,.15),R(-1,1)])));
    l91Ped(parts,p0,b,out,bc[3],bq);const s=Ls*R(.85,1.12),w=Ws*R(.9,1.1);parts.push({z:b[2]+h3[2]*s*.5+.05,fn:par=>l91Oat(par,b,h3,n3,s,w,col,st)})}
  drawParts(C.k,parts);open(C.k,t,1100,0,.55);return{k:C.k,bw:2.2,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}
/* one flat chasmanthium spikelet from its base b along h3, its flat face n3, really flat: seen edge on it narrows to its thickness; the outline toothed by the floret tips,
   each face its own tone (lit or in shade), the rachilla and the florets in a herringbone on the sheets */
function l91Oat(par,b,h3,n3,Ls,W,col,st){const v3=V3.nz(V3.cr(n3,h3)),m=16,nf=Math.max(5,Math.round(Ls/(.24*UPC))),Cs=[],Es=[],P=pal7(col),ink=shd(col,-.5);
  for(let i=0;i<=m;i++){const x=i/m,c=V3.add(b,V3.sc(h3,x*Ls)),e=V3.sc(v3,W/2*L91_CHAP(x)*(1+.1*Math.max(0,Math.sin(x*nf*Math.PI))));Cs.push([c[0],-c[1]]);Es.push([e[0],-e[1]])}
  /* never thinner than its thickness (a flat spikelet still has a body edge on) */
  const out=[[],[]];for(let i=0;i<=m;i++){const a=Cs[Math.max(0,i-1)],c=Cs[Math.min(m,i+1)],dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,el=Math.abs(Es[i][0]*nx+Es[i][1]*ny),
      th=Math.max(0,.6*Math.min(1,L91_CHAP(i/m)*1.4)-el);for(const s of[0,1]){const sg=s?-1:1;out[s].push([Cs[i][0]+Es[i][0]*sg+nx*th*Math.sign(Es[i][0]*nx+Es[i][1]*ny||1)*sg,Cs[i][1]+Es[i][1]*sg+ny*th*Math.sign(Es[i][0]*nx+Es[i][1]*ny||1)*sg])}}
  const I=Math.max(.2,Math.min(.95,(n3[2]>=0?lightI(n3):lightI(V3.sc(n3,-1))*.85)*.75+.25));
  E('path',{d:smooth(out[0].concat(out[1].reverse())),fill:toneAt(P,I),stroke:ink,'stroke-width':.3,'stroke-opacity':.6,'stroke-linejoin':'round'},par);
  if(LOD)return;const fw=Math.hypot(...Es[Math.round(m*.4)]);if(fw<1.2)return;let d=`M${f(Cs[1][0])},${f(Cs[1][1])}`;for(let i=2;i<m;i++)d+=`L${f(Cs[i][0])},${f(Cs[i][1])}`;
  if(DET>=1.5)for(let k=1;k<nf;k++){const x=k/nf,i=Math.min(m-1,Math.round(x*m)),j=Math.min(m,i+1),s=k%2?1:-1,e=[Cs[j][0]+Es[j][0]*s*.9,Cs[j][1]+Es[j][1]*s*.9];d+=`M${f(Cs[i][0])},${f(Cs[i][1])}L${f(e[0])},${f(e[1])}`}
  E('path',{d,fill:'none',stroke:ink,'stroke-width':DET>=1.5?.3:.42,'stroke-opacity':.45,'stroke-linecap':'round'},par)}

/* ---------- registers: five grasses, lines on their own spine in a bouquet (the heads above the mass, never under the lip); briza and chasmanthium sized by their panicle ---------- */
Object.assign(GH,{'setaria':l91Setaria,'phalaris':l91Phalaris,'briza':l91Briza,'miscanthus':l91Misc,'chasmanthium':l91Chasm});
Object.assign(CWS,{'setaria':L91_CW_SET,'phalaris':L91_CW_PHA,'briza':L91_CW_BRI,'miscanthus':L91_CW_MIS,'chasmanthium':L91_CW_CHA});
Object.assign(SZG,{'setaria':[60,70,75,75,80,90],'phalaris':[40,45,50,50,55,60],'briza':[10,12,15,15,18],'miscanthus':[60,80,80,100,120],'chasmanthium':[18,22,25,25,30]});
Object.assign(GHI,{'setaria':{form:'ligne',size:1,k:'plant',self:75*UPC,tip:.92,fx:3.5*UPC,rch:6*UPC},'phalaris':{form:'ligne',size:1,k:'plant',self:50*UPC,tip:.96,fx:3*UPC,rch:5*UPC},
 'briza':{form:'ligne',size:1,k:'plant',self:45*UPC,tip:.93,fx:3.5*UPC,rch:6*UPC},'miscanthus':{form:'ligne',size:1,k:'plant',self:80*UPC,tip:.94,fx:4*UPC,rch:8*UPC},
 'chasmanthium':{form:'ligne',size:1,k:'plant',self:70*UPC,tip:.92,fx:4*UPC,rch:7*UPC}});
