/* ================= Serre, lot 98 — bois graphiques : saule fascié 'Sekka', noisetier tortueux à chatons, érable du Japon, mélèze à cônes, pin à cônes ================= */
/* des branches coupées poussées par le L-système : un bois tordu en 3D qui se courbe et s'enroule sans jamais faire de coude (chaque entre-nœud est un arc en petits pas),
   les tiges fasciées du saule 'Sekka' en rubans plats qui s'élargissent et s'enroulent en crosse, le tire-bouchon du noisetier et ses chatons pendants,
   les feuilles palmées très découpées de l'érable du Japon (chaque lobe une lame 3D partant du pétiole), les rameaux du mélèze à rosettes d'aiguilles et petits cônes en rose,
   le pin à aiguilles en faisceaux et ses cônes fermés ou ouverts ; dans le Composer ce sont des lignes ou des feuillages qui suivent l'épine (o.spine) */
const l98C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),l98Q=p=>[p[0],-p[1]];
/* ---------- the tortuous wood: a cut branch grown by the L-system in its own straight frame (y up its axis, lnAxis of lot 18), then laid along its axis (the composer's spine,
   the frame of the view). Every internode is cut into q short steps that all turn the same way — an even arc, never a corner —, the plane of the turn rolling a little at each step
   (rl: a helix, the corkscrew of the hazel); from node to node the arc swings to the other side (ps: its chance; else it goes on winding the same way). The rules:
     M(i<n) → ( +a/q /rl F(li/q) u )×q  Bd(i)  [ /φᵢ &β Br(0) ]?  /ρ  M(i+1)                 M(n) → Bd(tip)
     Br(j<m) → the same, tighter (zb, lb), now and then a twig Br of its own                    Br(m) → Bd(tip)
   a fasciated axis (fl) widens into a flat band (its width carried by w, its face by the organ u recorded at every step) and its last internodes curl into a crook (ck degrees, the
   same way, ever tighter). S: li zz lb zb q rl ps w0 w1 wp up, br(i,n,L) → the length of the shoot at node i (0: none), tw (twig chance), fl(i,n) → band width or 0, ck, rch, fd ---------- */
function l98Grow(o,Lt,S){const bq=!!o.spine,A=lnAxis(o,Lt,{bow:R(-.06,.06)}),L=A.L,UP=[0,1,0],q=S.q||6,nM=Math.max(4,Math.round(L/(S.li*.88))),wAt=i=>S.w0+(S.w1-S.w0)*Math.pow(Math.min(1,i/nM),S.wp||1.25);
  const br=new Map();for(let i=1;i<nM;i++){const l=S.br(i,nM,L);if(l)br.set(i,l)}
  /* one internode: q steps turning a in all, each rolled rl; a flat axis records its face (u) at every step */
  const arc=(s,a,l,w0,w1,ex,fl,rl)=>{const out=[];for(let k=0;k<q;k++){out.push(['+',{a:s*a/q*R(.88,1.12)}]);if(rl)out.push(['/',{a:S.rlz?rl*R(-1,1):rl*R(.6,1.4)}]);out.push(['F',Object.assign({l:l/q*R(.92,1.08),w1:w0+(w1-w0)*(k+1)/q},ex)]);if(fl)out.push(['u',{}])}return out};
  const rules={
    M:p=>{const i=p.i;if(i>=nM)return[['Bd',{s:p.s,tip:1}]];const nk=S.ck?S.ckn||3:0,crook=nk&&i>=nM-nk,cq=crook?(i-(nM-nk)+1)/nk:0,fa=S.fl?S.fl(i,nM):0,fb=S.fl?S.fl(i+1,nM):0,
        a=crook?S.ck/nk*(.7+.6*cq):i?S.zz:S.zz/2,s=crook?p.cs:p.s,l=crook?S.li*(1-.45*cq):S.li,out=arc(s,a,l,fa||wAt(i),fb||wAt(i+1),crook?{}:{aim:UP,k:S.up??.09},!!S.fl,crook?0:S.rl);
      out.push(['Bd',{s}]);const bl=br.get(i);
      /* a shoot (bl > 0), or a second fasciated band (bl < 0: its length −bl, its width S.flw, longer internodes and a gentler swing) */
      if(bl){const fl=bl<0,wb=S.wb?S.wb(i,nM):wAt(i)*.45,lb=fl?S.li*.8:S.lb;out.push(['[',{w:wb}],['/',{a:i*144+R(-25,25)}],['&',{a:fl?R(16,26):R(28,44)}],['Br',{j:0,n:Math.max(2,Math.round(Math.abs(bl)/lb)),l:lb,w:wb,ord:1,z:fl?S.zz*1.2:S.zb,s:rnd()<.5?1:-1,fl:fl?S.flw:0}],[']',{}])}
      const s2=rnd()<(S.ps??1)?-s:s;out.push(['/',{a:R(-(S.rn??50),S.rn??50)}],['M',{i:i+1,s:s2,cs:p.cs}]);return out},
    Br:p=>{if(p.j>=p.n)return[['Bd',{s:p.s,tip:1}]];const fl=p.fl,nk=fl&&S.ck?2:0,crook=nk&&p.j>=p.n-nk,cq=crook?(p.j-(p.n-nk)+1)/nk:0,
        a=crook?S.ck*.8/nk*(.7+.6*cq):p.j?p.z:p.z/2,wj=p.w+((S.wt||.08*UPC)-p.w)*(p.j+1)/p.n,bw=u=>u<.2?p.w+(fl-p.w)*u/.2:u<.7?fl:fl+((S.wend||fl*.4)-fl)*(u-.7)/.3,fa=fl?bw(p.j/p.n):0,fb=fl?bw((p.j+1)/p.n):0,
        out=arc(p.s,a,p.l*(crook?1-.4*cq:1),fa||(p.j?p.w+((S.wt||.08*UPC)-p.w)*p.j/p.n:p.w),fb||wj,{e:S.e??.012},!!fl,crook?0:S.rl);
      out.push(['Bd',{s:p.s}]);
      if(!fl&&p.ord<2&&p.j>0&&p.j<p.n-2&&rnd()<(S.tw??.4))out.push(['[',{w:wj*.7}],['/',{a:R(0,360)}],['&',{a:R(28,42)}],['Br',{j:0,n:Math.max(2,Math.round((p.n-p.j)*R(.3,.55))),l:p.l*.85,w:wj*.7,ord:2,z:p.z,s:rnd()<.5?1:-1,fl:0}],[']',{}]);
      const s2=crook?p.s:rnd()<(S.ps??1)?-p.s:p.s;out.push(['/',{a:crook?0:R(-(S.rn??60),S.rn??60)}],['Br',Object.assign({},p,{j:p.j+1,s:s2})]);return out}};
  const res=lsTurtle(lsDerive([['M',{i:0,s:rnd()<.5?1:-1,cs:rnd()<.5?1:-1}]],rules,nM+30),{p:[0,0,0],H:UP,U:[0,0,1],T:UP,e:0,wig:0,seg:1e6,w:S.w0});
  /* the main axis brought back onto its axis (its drift sheared off) and to its length; in a bouquet the whole branch hugs the spine */
  const c0=res.chains[0];let top=c0.pts[c0.pts.length-1];if(S.ck){/* a crook ends lower than where it turned: shear on the highest point of the axis */for(const q2 of c0.pts)if(q2[1]>top[1])top=q2}
  const[ex,ey,ez]=top,sy=Math.max(.8,Math.min(1.25,L/Math.max(1,ey))),seen=new Set();
  for(const ch of res.chains)for(const q2 of ch.pts){if(seen.has(q2))continue;seen.add(q2);const f2=q2[1]/ey;q2[0]-=ex*f2;q2[2]-=ez*f2;q2[1]*=sy;if(bq)lnHug(q2,L,S.rch)}
  const idx=new Map();res.chains.forEach((ch,ci)=>ch.pts.forEach((q2,pi)=>{if(!idx.has(q2))idx.set(q2,[ci,pi])}));const vw=new Map(),Wq=q2=>{let v=vw.get(q2);if(!v){v=bq?lnSink(A,q2,A.W(q2),L,S.fd):A.W(q2);vw.set(q2,v)}return v};
  /* the faces of the bands, by point */
  const face=new Map();for(const og of res.organs)if(og.t==='u')face.set(og.pos,og.U);
  const nodes=[];for(const og of res.organs){if(og.t!=='Bd')continue;const id=idx.get(og.pos);if(!id)continue;const[ci,pi]=id;
    nodes.push({ci,pi,P:Wq(og.pos),H:A.Wv(og.pos,og.H),U:A.Wv(og.pos,og.U),Lv:A.Wv(og.pos,og.L),s:og.p.s,tip:!!og.p.tip,w:res.chains[ci].ws[pi]||1,ord:res.chains[ci].ord,flat:face.has(og.pos)})}
  return{A,L,bq,res,Wq,face,nodes,chains:res.chains}}
/* a flat band (a fasciated stem) along its chain: lnRibbon of lot 18 with the faces recorded by the L-system, its round foot as thick as th; o: pal palB gloss */
function l98Band(G0,ch,parts,o){const P=ch.pts.map(G0.Wq),n=P.length,U=ch.pts.map((q,i)=>{let u=G0.face.get(q);if(!u){for(let k=1;k<n&&!u;k++)u=G0.face.get(ch.pts[Math.min(n-1,i+k)])||G0.face.get(ch.pts[Math.max(0,i-k)])}
    return u?V3.nz(G0.A.Wv(q,u)):[0,0,1]}),V=P.map((_,i)=>i/(n-1));
  /* square the faces to the band's course in view space */
  for(let i=0;i<n;i++){const T=V3.nz(V3s(P[Math.min(n-1,i+1)],P[Math.max(0,i-1)])),u=V3s(U[i],V3.sc(T,V3.dot(U[i],T)));if(V3l(u)>1e-6)U[i]=V3.nz(u)}
  lnRibbon(P,U,ch.ws,V,o,parts);
  /* the ribs of the fasciation: fine lines along the band (dark grooves, one pale crest catching the light), in pieces at the band's depth; its tip rounded */
  if(o.ribs&&!LOD&&DET>=1.5){const m=8;for(let a=0;a<n-1;a+=m-1){const b=Math.min(n-1,a+m),L2=[];let z=0;
      for(let i=a;i<=b;i++)z+=P[i][2];for(const[u,c,so,sw]of o.ribs){const Q=[];for(let i=a;i<=b;i++){const T=V3.nz(V3s(P[Math.min(n-1,i+1)],P[Math.max(0,i-1)])),Bv=V3.nz(V3.cr(T,U[i])),hw=ch.ws[i]/2;
          if(hw<o.th*.9){Q.length&&L2.push([Q.splice(0),c,so,sw]);continue}Q.push(l98Q(V3.add(P[i],V3.sc(Bv,hw*u))))}if(Q.length>1)L2.push([Q,c,so,sw])}
      if(L2.length)parts.push({z:z/(b-a+1)+.03,cast:false,fn:par=>{for(const[Q,c,so,sw]of L2)if(Q.length>1)E('path',{d:'M'+Q.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c,'stroke-width':sw,'stroke-opacity':so,fill:'none','stroke-linecap':'round'},par)}})}}
  const e=P[n-1],r=Math.max(o.th/2,ch.ws[n-1]/2)*.95,pc=o.pal(1);parts.push({z:e[2]+.02,cast:false,fn:par=>E('circle',{cx:f(e[0]),cy:f(-e[1]),r:f(r),fill:toneAt(pc,.5)},par)});
  return{P,U}}
/* a scaled bud pressed to the wood on the outside of the bend, pointed toward the tip (as on the curly willow), and its leaf scar */
function l98Bud(nd,len,w,col,ink){const Hv=nd.H,sd=V3.nz(V3.sc(nd.Lv,-nd.s)),bd=nd.tip?Hv:V3.nz(V3.add(V3.sc(Hv,.9),V3.sc(sd,.42))),B0=nd.tip?nd.P:V3.add(nd.P,V3.sc(sd,nd.w*.32)),T0=V3.add(B0,V3.sc(bd,len)),
    B=l98Q(B0),T=l98Q(T0),dx=T[0]-B[0],dy=T[1]-B[1],l=Math.hypot(dx,dy)||1,hw=Math.max(.6,w*.65),nx=-dy/l*hw,ny=dx/l*hw,mx=B[0]+dx*.42,my=B[1]+dy*.42;
  return{z:B0[2]+.05,cast:false,fn:par=>E('path',{d:`M${f(B[0])},${f(B[1])}Q${f(mx+nx)},${f(my+ny)} ${f(T[0])},${f(T[1])}Q${f(mx-nx)},${f(my-ny)} ${f(B[0])},${f(B[1])}Z`,fill:col,stroke:ink,'stroke-width':.25,'stroke-opacity':.5},par)}}
/* the round wood: each chain a lnTube (lot 18) shaded from its tone, cols(chain, v) */
function l98Tubes(G0,parts,cols,o={}){G0.chains.forEach((ch,ci)=>{if(o.skip&&o.skip(ch,ci))return;const P=ch.pts.map(G0.Wq),cache={};
  lnTube(P,ch.ws,v=>{const k=Math.round(v*6)/6;return cache[k]||(cache[k]=cols(ch,k))},parts,{gloss:o.gloss??.4,piece:ch.ord?18:24,min:G0.bq?.56:.4,ink:o.ink||null,after:o.after?(par,a,b)=>o.after(par,ch,ci,P,a,b):null})})}

/* ---------- saule fascié 'Sekka' (Salix udensis 'Sekka', syn. S. sachalinensis 'Sekka', « saule dragon »): a male clone whose stems are fasciated — flattened, widening upward
   into ribbed bands 2–5 cm wide that twist and curl at the top into a shepherd's crook, sometimes two side by side; the bark smooth, glossy, red-brown to chestnut, the young round
   shoots redder; in late winter the catkins break from their red-brown caps along the stems and the edges of the bands, small (1.5–2.5 cm), silky silver-grey, and at the last
   push their yellow anthers. Cut in 60–150 cm lengths, natural (with or without catkins) and painted ---------- */
const CW_L98SEK=[{id:'naturel',n:'Brun-rouge luisant',c:'#5a2e22',y:'#7a3424',cat:0},{id:'chatons',n:'Brun-rouge à chatons argentés',c:'#c4c2bd',w:'#5a2e22',y:'#7a3424',cat:1},
 {id:'acajou',n:'Acajou (bois foncé)',c:'#3e2420',y:'#5a2a22',cat:0},{id:'blanc',n:'Peint blanc',c:'#efeae0',paint:1},{id:'or',n:'Peint or',c:'#c9a54a',paint:1,met:'#fff6d6'}];
function l98Sekka(g,t,o){return g35Run(o,'l98sek',()=>l98SekkaP(g,t,o))}
function l98SekkaP(g,t,o){const cw=cwPick(CW_L98SEK,o),op=l98C(o.op??1,.05,1),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||100)*UPC,Lt=bq?blen(o.spine):Lf,sz=l98C(Lt/(100*UPC),.5,1.5),gi=GHI['saule-fascie-sekka'];
  const wood=cw.paint?cw.c:cw.w||cw.c,w0=UPC*R(.8,1)*(.55+.45*sz),Wf=UPC*R(3.6,4.8)*(.6+.4*sz)*(bq?.8:1),nfb=rnd()<.55?1:2;let fb=0;
  const G0=l98Grow(o,Lt,{li:Math.min(R(7,9)*UPC*Math.pow(sz,.3),Lt/7),zz:R(18,30),lb:R(3,4)*UPC,zb:R(50,70),q:6,rl:R(3,6),rlz:1,ps:.75,rn:10,w0,w1:Wf,wp:1,up:.05,ck:Lt<45*UPC?R(220,300):R(320,420),ckn:Lt<45*UPC?2:Lt<70*UPC?3:4,rch:gi.rch,fd:gi.fx*.92,e:.01,tw:.3,
    /* the band: round at the cut end, flattening from a fifth of the way up, widest under the crook, which narrows as it curls */
    fl:(i,n)=>{const u=i/n,u0=bq?Math.min(.62,Math.max(.36,14*UPC/Lt)):.18;return u<u0?w0:u<.84?w0+(Wf-w0)*Math.pow((u-u0)/(.84-u0),.8):Wf+(w0*.45-Wf)*Math.pow((u-.84)/.16,.8)},
    br:(i,n,L)=>{const u=i/n;if(u<(bq?.35:.22)||u>.8)return 0;if(fb<nfb&&u>.36&&u<.72&&rnd()<.7){fb++;return -L*R(.3,.42)*(1-.4*u)}return rnd()<.6?L*(bq?R(.12,.2):R(.16,.3))*(1-.5*u):0},
    wb:(i,n)=>Math.max(1.4,w0*.42),wend:w0*.45,flw:Wf*R(.55,.75)});
  const wht=h2l(cw.c)[2]>.85,pal=lnPals(wht?'#d6cfc0':cw.paint?cw.c:wood,wht?'#d0c8b8':cw.paint?shd(cw.c,-.08):shd(wood,.06)),gl=cw.met?.8:cw.paint?.35:.55;
  const isFl=ch=>G0.face.has(ch.pts[Math.min(1,ch.pts.length-1)]),bands=[];for(const ch of G0.chains)if(isFl(ch))bands.push([ch,l98Band(G0,ch,parts,{pal:pal.pal,palB:pal.palB,th:w0*.5,gloss:gl,shin:28,mid:0,piece:10,pale:wht,ribs:[[-.62,shd(wood,-.45),.45,.4],[-.2,shd(wood,-.45),.4,.35],[.28,shd(wood,-.45),.45,.4],[.66,shd(wood,-.45),.35,.35],[-.42,cw.met||mix(wood,'#ffffff',.5),.35,.5],[.06,cw.met||mix(wood,'#ffffff',.45),.25,.4]]})]);
  const twig=cw.paint?cw.c:cw.y;l98Tubes(G0,parts,(ch,v)=>lnCols(wht?'#ddd6c8':cw.paint?cw.c:mix(wood,twig,.3+.5*v),cw.met||'#f6e8e0'),{gloss:gl,skip:isFl,ink:cw.paint&&h2l(cw.c)[2]>.7?shd(cw.c,-.5):null});
  /* buds and catkins along the round shoots and on the edges of the bands */
  const budC=cw.paint?shd(cw.c,-.12):'#6a2a1c',ink=shd(budC,-.6),cat=cw.cat&&!cw.paint,CC={c:'#c4c2bd',id:'argent'};
  /* on the bands, every 2–3 cm along one edge or the other (not in the crook), a bud or a catkin set on the edge, leaning out and up */
  const sites=[];for(const[ch,bd]of bands){const P=bd.P,U=bd.U,n=P.length;let acc=R(0,2)*UPC,sg=rnd()<.5?1:-1;
    for(let i=1;i<n;i++){acc-=V3l(V3s(P[i],P[i-1]));if(acc>0)continue;acc=R(2,3.2)*UPC;if(i/n>.86||ch.ws[i]<w0*1.1)continue;if(bq&&P[i][1]<14)continue;
      const T=V3.nz(V3s(P[Math.min(n-1,i+1)],P[i-1])),ed=V3.nz(V3.cr(T,U[i]));sg=rnd()<.7?-sg:sg;sites.push({P:V3.add(P[i],V3.sc(ed,sg*ch.ws[i]*.44)),H:T,U:U[i],Lv:V3.sc(ed,-sg),s:1,w:0,tip:false})}}
  for(const nd of G0.nodes.filter(nd=>!nd.flat).concat(sites)){if(bq&&nd.P[1]<14)continue;const P=nd.P,nd2=nd;
    if(cat&&!nd.tip&&rnd()<.8){const age=l98C(.1+op*1.05+R(-.15,.1)),len=UPC*(age<.25?.9+.6*age:1.4+1*age)*R(.85,1.1)*(.8+.2*sz),rad=len*(age<.25?.3:.33),
        sd=V3.nz(V3.sc(nd2.Lv,-nd2.s)),H=V3.nz(V3.add(V3.sc(nd.H,.75),V3.sc(sd,.6))),B=spFrame(H,[0,1,0],R(0,6)),O=V3.add(P,V3.sc(sd,nd2.w*.25));
      parts.push({z:O[2]+H[2]*len*.5+.1,fn:par=>b29Catkin(par,B,O,len,rad,CC,age,{male:age>.9&&rnd()<.3,scale:rnd()<.35,sc:'#5e2418'})});continue}
    parts.push(l98Bud(nd2,UPC*(nd.tip?.45:.55)*R(.85,1.15),UPC*.14,budC,ink))}
  drawParts(k,parts);open(k,t,1100,0,.5);const Pb=pal7(cw.paint?cw.c:wood);return{k,bw:w0,bc:[Pb.d2,Pb.d1,Pb.b,Pb.l1]}}

/* ---------- noisetier tortueux (Corylus avellana 'Contorta', « bâton de Harry Lauder »; 'Red Majestic' its purple form): the twigs wind in corkscrews and loops, every
   internode turning the same way while the plane of the turn rolls round it, the side shoots as tortuous; the bark grey-brown, finely downy, dotted with pale lenticels;
   from late winter the male catkins hang at the nodes in ones to threes on short stalks — tight, grey-green and 2–3 cm in winter, then loose, 5–8 cm, pale yellow with pollen
   (purplish on 'Red Majestic'); the female flowers are buds with a tuft of crimson styles; the buds ovoid, green-brown ---------- */
const CW_L98NOI=[{id:'naturel',n:'Brun gris à chatons jaunes',c:'#7a6a5a',y:'#8a7a5a',cat:'#d6c27a',c0:'#8a7e5a'},{id:'red-majestic',n:'Pourpre à chatons pourpres (Red Majestic)',c:'#5a3040',y:'#6a3a40',cat:'#c08a7a',c0:'#6a3a48'},
 {id:'nu',n:'Brun gris (rameaux nus)',c:'#6e6050',y:'#86745a',cat:null}];
function l98Noisetier(g,t,o){return g35Run(o,'l98noi',()=>l98NoisetierP(g,t,o))}
function l98NoisetierP(g,t,o){const cw=cwPick(CW_L98NOI,o),op=l98C(o.op??1,.05,1),k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||80)*UPC,Lt=bq?blen(o.spine):Lf,sz=l98C(Lt/(80*UPC),.5,1.5),gi=GHI['noisetier-tortueux-chatons'];
  const w0=UPC*R(.85,1.05)*(.6+.4*sz),G0=l98Grow(o,Lt,{li:R(3.2,4.2)*UPC*Math.pow(sz,.3),zz:R(80,100),lb:R(2.4,3)*UPC,zb:R(90,120),q:7,rl:R(16,24),ps:.3,rn:50,w0,w1:.16*UPC,wp:.9,up:.12,rch:gi.rch,fd:gi.fx*.92,e:.008,tw:.22,wt:.12*UPC,
    br:(i,n,L)=>{const u=i/n;if(u<(bq?.32:.18))return 0;return rnd()<.5?L*(bq?R(.12,.2):R(.16,.3))*(1-.5*u):0}});
  const P0=pal7(cw.c),lent=shd(cw.c,.45);
  l98Tubes(G0,parts,(ch,v)=>lnCols(ch.ord?mix(cw.c,cw.y,.25+.5*v):mix(shd(cw.c,-.08),cw.c,v),'#efe6da'),{gloss:.22,after:(par,ch,ci,P,a,b)=>{if(DET<1.5||LOD||ch.ord>1)return;let d='';
    for(let i=Math.max(1,a);i<=b&&i<P.length;i+=3){const w=ch.ws[Math.min(ch.ws.length-1,Math.floor(i/3))]||1;if(w<2.2||rnd()<.4)continue;const p=l98Q(P[i]),q2=l98Q(P[i-1]),dx=p[0]-q2[0],dy=p[1]-q2[1],l=Math.hypot(dx,dy)||1,o2=R(-.3,.3)*w,nx=-dy/l,ny=dx/l;
      d+=`M${f(p[0]+nx*o2-nx*w*.12)},${f(p[1]+ny*o2-ny*w*.12)}l${f(nx*w*.24)},${f(ny*w*.24)}`}
    if(d)E('path',{d,stroke:lent,'stroke-width':.5,'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},par)}});
  const budC=cw.id==='red-majestic'?'#5a3a2a':'#6e6a3e',ink=shd(budC,-.6),lim=bq?-3:null,nn=G0.nodes.filter(nd=>!nd.tip).length,pC=Math.min(.6,(bq?8:16)/Math.max(1,nn));
  for(const nd of G0.nodes){if(bq&&nd.P[1]<14)continue;const sd=V3.nz(V3.sc(nd.Lv,-nd.s));
    /* catkins: one to three on short stalks from the node, hanging; held out stiff while tight */
    if(cw.cat&&!nd.tip&&rnd()<pC){const y=op,n=rnd()<.3?1:rnd()<.6?2:3,len=UPC*(2.4+4.6*y)*(.85+.15*sz),w=UPC*(.42+.14*y),col=mix(cw.c0,cw.cat,l98C(y*1.25-.15)),P=V3.add(nd.P,V3.sc(sd,nd.w*.3));let ok=0;
      for(let j=0;j<n;j++){const a=j*2.2+R(-.4,.4),d0=V3.nz(V3.add(V3.sc(sd,.6-.3*y),V3.add(V3.sc(nd.U,Math.cos(a)*.35),V3.add(V3.sc(nd.H,Math.sin(a)*.35+.15*(1-y)),[0,-.5-.6*y,0])))),
          c=l39Catkin(P,d0,len*R(.8,1.05),w,col,lim,{hang:.12+.95*y,scales:1-.4*y,pollen:y>.7?mix(cw.cat,'#f0dc70',.5):null,sc2:shd(col,-.45)});if(c){parts.push(c);ok=1}}
      if(ok)continue}
    /* a female flower: a bud with its tuft of crimson styles */
    if(!nd.tip&&op>.3&&rnd()<.05){const Z=V3.nz(V3.add(V3.sc(nd.H,.85),V3.sc(sd,.5))),Pb=V3.add(nd.P,V3.sc(sd,nd.w*.25)),len=UPC*.42,tip=V3.add(Pb,V3.sc(Z,len*.92)),[X,Y]=fgCross(Z),st=[];
      for(let j=0;j<6;j++){const a=j/6*6.283+R(-.3,.3),d=V3.nz(V3.add(V3.sc(Z,.8),V3.add(V3.sc(X,Math.cos(a)*.7),V3.sc(Y,Math.sin(a)*.7))));st.push([l98Q(tip),l98Q(V3.add(tip,V3.sc(d,UPC*R(.12,.2)*(.5+.5*op))))])}
      parts.push(l39Ovoid(Pb,Z,len,Math.max(1.6,UPC*.32),L39_EGG,budC,{scales:3,zb:.05,eo:.6,after:par=>E('path',{d:st.map(([a,b])=>`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`).join(''),stroke:'#c0203a','stroke-width':1.15,'stroke-linecap':'round',fill:'none'},par)}));continue}
    if(DET>=1.5||nd.tip||rnd()<.45)parts.push(l98Bud(nd,UPC*(nd.tip?.42:.5)*R(.85,1.15),UPC*.17,budC,ink))}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:[P0.d2,P0.d1,P0.b,P0.l1]}}

/* ---------- érable du Japon (Acer palmatum; the lace-leaf maples are its Dissectum group): slender twigs, glossy, green or red-purple (coral red on 'Sango-kaku'), the nodes opposite
   and crossing (decussate); each leaf on a long slender petiole (3–5 cm), the blade 5–8 cm, palmately cut deep toward its heart into five to seven (nine) lobes, lanceolate,
   long-pointed and doubly toothed, spreading like a hand — the Dissectum's nine to eleven lobes cut to the base and themselves cut into lace. Green in summer, deep red-purple
   on 'Bloodgood' and 'Atropurpureum' all season, and in autumn scarlet, orange or gold, the leaves of one twig often of several tints. Each lobe is drawn as a 3D blade
   from the top of the petiole (they all leave the same point, overlapping at the heart, so no lobe floats), its halves lit by their own normals, its margin toothed ---------- */
const CW_L98ERA=[{id:'vert',n:'Vert (été)',c:'#6f9a3e',st:'#7a6a3a',pc:'#a04a32'},{id:'rouge',n:'Rouge écarlate (automne, Osakazuki)',c:'#c0302a',st:'#6a3a32',pc:'#8a2a24'},
 {id:'orange',n:'Orange (automne)',c:'#e0782a',st:'#6a3a32',pc:'#a8502a'},{id:'or',n:'Jaune d’or (automne, Katsura)',c:'#e6b830',st:'#7a5a3a',pc:'#b08a2a'},
 {id:'pourpre',n:'Pourpre foncé (Bloodgood, Atropurpureum)',c:'#5a1f2e',st:'#4a2228',pc:'#6a1f2a'},
 {id:'automne',n:'Mélange d’automne (vert, or, orange, rouge)',c:'#d0582a',st:'#6a3a32',pc:'#9a3a2a',mixc:['#7a9a3e','#e6b830','#e0782a','#c0302a','#a82a2a']},
 {id:'sango',n:'Vert tendre, bois corail (Sango-kaku)',c:'#a8b84a',st:'#c8503a',pc:'#c8603a',coral:1},
 {id:'dissectum-vert',n:'Vert, feuilles en dentelle (Dissectum Viridis)',c:'#7aa040',st:'#7a6a3a',pc:'#8a8a3a',dis:1},
 {id:'dissectum-rouge',n:'Pourpre, feuilles en dentelle (Dissectum Garnet)',c:'#6e1e2a',st:'#4a2228',pc:'#6a1f2a',dis:1}];
const L98_LOBE=prof([[0,.1],[.12,.5],[.36,1],[.62,.8],[.85,.34],[1,0]]),L98_LACE=prof([[0,.16],[.1,.75],[.3,1],[.6,.8],[.85,.4],[1,0]]);
/* one lobe as a blade from C along d in the plane of normal N: its two halves (or one outline at the app's detail), toothed (tz), its midrib */
function l98Lobe(C,d,N,len,wr,o){const og={pos:C,H:d,U:N,L:V3.cr(N,d)},S=lsLeafS(og,len,wr,{wp:o.wp,droop:o.droop??.08,arch:o.arch??.05,fold:o.fold??.15,tw:o.tw||0}),nv=o.nv,tz=o.tz||0,Lf=[],M=[],Rt=[];
  for(let i=0;i<=nv;i++){const v=i/nv,tf=tz&&i>0&&i<nv?(i%2?1+tz*.35:1-tz):1;Lf.push(S(-tf,v));M.push(S(0,v));Rt.push(S(tf,v))}
  const nA=[0,0,0],nB=[0,0,0];let z=0;for(let i=0;i<nv;i++){const dv=V3s(M[i+1],M[i]),na=V3.cr(dv,V3s(M[i],Lf[i])),nb=V3.cr(dv,V3s(Rt[i],M[i]));for(let j=0;j<3;j++){nA[j]+=na[j];nB[j]+=nb[j]}z+=M[i][2]}
  return{z:z/nv,M,Lf,Rt,nA,nB}}
function l98Palm(og,lim,cw,op,kL=1){const y=l98C(op),q=og.p.q??0,dis=!!cw.dis,sz=UPC*(dis?6:5.6)*kL*(1-.28*Math.pow(q,1.3))*(og.p.s||1)*R(.84,1.12)*(.3+.7*y),
    c0=cw.mixc?pick(cw.mixc):cw.c,c=mix(mix(c0,shd(c0,R(-.1,.1)),.6),cw.id==='vert'||dis&&cw.id==='dissectum-vert'?'#b8a050':'#a8402a',(1-y)*.35),cb=mix(c,'#d8d4b8',.28),P=pal7(c),PB=pal7(cb);
  /* the petiole leaves along H, the blade spreads at its top, held flat toward the light, its tip on along the petiole */
  const sg=og.p.j?-1:1,N=V3.nz(V3.add(f15Face(og,R(50,85)*D,sg),[0,.35,0])),pl=sz*R(.55,.75)*(.6+.4*y),Hd=og.H,C=V3.add(V3.add(og.pos,V3.sc(Hd,pl)),[0,-pl*.12,0]);
  let Y=V3s(Hd,V3.sc(N,V3.dot(Hd,N)));if(V3l(Y)<1e-4)Y=V3.cr(N,og.L);Y=V3.nz(Y);
  const n=dis?9:cw.id==='or'&&rnd()<.3?5:7,step=(dis?25:33)*D,mid=(n-1)/2,lobes=[],det=DET>=1.5&&!LOD,nv=det?(dis?24:16):dis?14:8;
  for(let k=0;k<n;k++){const a=(k-mid)*step*R(.92,1.08),d=V3.nz(rotA(Y,N,a)),r=Math.abs(k-mid)/mid,ln=sz*(1-.5*Math.pow(r,1.6))*R(.94,1.04);
    lobes.push(l98Lobe(V3.add(C,V3.sc(d,-ln*.05)),d,N,ln,dis?.2:.36,{wp:dis?L98_LACE:L98_LOBE,nv,tz:det?(dis?.75:.22):dis?.6:0,fold:.12+.5*(1-y),droop:.06+.06*r,arch:.04,tw:R(-.2,.2)}))}
  if(lim!=null){let lo=1e9;for(const L of lobes)for(const p of L.M)lo=Math.min(lo,p[1]);if(lo<-lim+2)return null}
  lobes.sort((a,b)=>a.z-b.z);const pc=cw.pc,pw=Math.max(1.15,og.w*.42),a0=l98Q(og.pos),a1=l98Q(C),am=[(a0[0]+a1[0])/2,(a0[1]+a1[1])/2+pl*.08];
  const tone=(n2)=>{const nn=V3l(n2)>1e-9?V3.nz(n2):[0,0,1],fr=nn[2]>=0;return{col:toneAt(fr?P:PB,lightI(fr?nn:V3.sc(nn,-1))),fr,ink:(fr?P:PB).ink}};
  return[{z:C[2],cast:false,fn:par=>{E('path',{d:`M${f(a0[0])},${f(a0[1])}Q${f(am[0])},${f(am[1])} ${f(a1[0])},${f(a1[1])}`,stroke:pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par);
    let vd='',ld='';for(const L of lobes){const M2=L.M.map(l98Q);
      if(det){for(const[E2,nn]of[[L.Lf,L.nA],[L.Rt,L.nB]]){const t2=tone(nn);E('path',{d:'M'+M2.concat(E2.map(l98Q).reverse()).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:t2.col,stroke:t2.ink,'stroke-width':.3,'stroke-opacity':.35,'stroke-linejoin':'round'},par)}
        vd+='M'+M2.slice(0,-2).map(p=>f(p[0])+','+f(p[1])).join('L')}
      else ld+='M'+L.Lf.map(l98Q).concat(L.Rt.map(l98Q).reverse()).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}
    /* at the app's detail the lobes of a leaf in one path, one tone; a lobe seen on edge keeps at least 1.1 units (its outline stroked in its own tone) */
    if(ld){const t2=tone(lobes.reduce((a,L)=>V3.add(a,V3.add(L.nA,L.nB)),[0,0,0]));E('path',{d:ld,fill:t2.col,stroke:t2.col,'stroke-width':1.1,'stroke-linejoin':'round'},par)}
    if(vd)E('path',{d:vd,stroke:mix(c,'#f0e8c0',.35),'stroke-width':.4,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par)}}]}
/* o.cm up to 15: the recipe's leaf size (cm), else the length of the cut branch */
function l98Erable(g,t,o){const cw=cwPick(CW_L98ERA,o),op=o.op??1,dis=!!cw.dis,st=cw.coral?l39Wood('#c8503a'):l39Wood(cw.st),old=l39Wood(mix(cw.st,'#6a6a5a',.45));
  return l39Sprig(g,t,o,{id:'era-'+cw.id,len:60,leafy:.8,inter:dis?[4.4,3.2]:[5.4,3.8],nl:2,div:90,ang:[56,42],w0:UPC*.75,w1:1.3,wp:.8,cols:st,e:-.002,wig:.016,zig:6,twist:6,tip:1,clr:4,
    br:{zone:[.05,.75],p:.6,max:4,gap:1,n:[3,5],li:dis?3.2:3.8,ang:48,eb:-.02,ls:.85,wk:.5},
    leaf:(og,lim)=>l98Palm(og,lim,cw,op,o.cm>0&&o.cm<=15?o.cm/7:1),
    apex:(og,lim)=>[l39Ovoid(og.pos,og.H,UPC*.4,Math.max(1.3,og.w*.9),L39_EGG,cw.coral?'#c84a3a':'#8a3a2a',{scales:2,zb:.03,eo:.6})],
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>ch.ord?st:cw.coral?st:old,(P,W)=>DET>=1.5?l39Lenti(P,W,.05,'#e8d8c0',{l0:.12,l1:.25,w:.4,op:.5,wmin:1.4}):null)})}

/* ---------- a cone of woody scales round its axis Z from its base P (larch, pine): n scales set by the golden angle up the axis, each a wedge from near the axis out to its lip,
   lying up along the axis when closed, spread out when open (sp: 0 … 1); prof(t) the cone's radius (×rad); o.lip the shape of a scale's free edge ('round': the larch's
   rose, 'boss': the pine's rhombic apophysis with its umbo). Drawn back to front; at the app's detail the scales of one tone run together in one path ---------- */
function l98Cone(P,Z,len,rad,col,sp,o={}){const[X,Y]=fgCross(Z),Pl=pal7(col),n=o.n||48,det=DET>=1.5&&!LOD,sc=[],lip=o.lip||'boss',ga=2.39996,ink=o.ink||Pl.ink,hi=o.hi||Pl.l1;
  for(let i=0;i<n;i++){const t=.04+.92*(i+.5)/n,az=i*ga+(o.ph||0),rd=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),r=rad*o.prof(t),
      /* the scale's direction: along the axis (closed) to out from it, the lower ones dipping when wide open */
      el=(sp*(o.spread??70)*(1-.35*t)+(1-sp)*(o.el0??22))*D,dd=V3.nz(V3.add(V3.sc(rd,Math.sin(el)),V3.sc(Z,Math.cos(el)))),b=V3.add(P,V3.add(V3.sc(Z,len*(t-.04)),V3.sc(rd,r*.25))),
      ln=(r*.95+len*.05)*(1+sp*.25),tip=V3.add(b,V3.sc(dd,ln)),tg=V3.nz(V3.cr(dd,rd)),hw=Math.max(.8,(o.wk??1.1)*r*Math.PI/Math.sqrt(n)*.75),fn=V3.nz(V3.cr(tg,dd));
    sc.push({b,tip,dd,tg,hw,ln,z:(b[2]+tip[2])/2+(tip[2]-P[2])*.02,I:lightI(fn[2]>=0?fn:V3.sc(fn,-1)),vis:V3.dot(fn,[0,0,1])})}
  sc.sort((a,b)=>a.z-b.z);const z=sc.reduce((s,q)=>s+q.z,0)/n;
  const out=q=>{const a=V3.add(q.b,V3.sc(q.tg,-q.hw*.35)),b=V3.add(q.b,V3.sc(q.tg,q.hw*.35)),c=V3.add(q.tip,V3.sc(q.tg,q.hw)),d=V3.add(q.tip,V3.sc(q.tg,-q.hw)),e=V3.add(q.tip,V3.sc(q.dd,q.hw*(lip==='round'?.55:.3))),
      A=l98Q(a),B=l98Q(b),C=l98Q(c),Dd=l98Q(d),Ee=l98Q(e);return`M${f(A[0])},${f(A[1])}L${f(B[0])},${f(B[1])}L${f(C[0])},${f(C[1])}Q${f(Ee[0]+(C[0]-Dd[0])*.35)},${f(Ee[1]+(C[1]-Dd[1])*.35)} ${f(Ee[0])},${f(Ee[1])}Q${f(Ee[0]-(C[0]-Dd[0])*.35)},${f(Ee[1]-(C[1]-Dd[1])*.35)} ${f(Dd[0])},${f(Dd[1])}Z`};
  const boss=q=>{const c=V3.add(q.tip,V3.sc(q.dd,-q.ln*.12)),u=V3.sc(q.tg,q.hw*.8),v=V3.sc(q.dd,q.ln*.16),p=[V3.add(c,u),V3.add(c,v),V3s(c,u),V3s(c,v)].map(l98Q);return'M'+p.map(x=>f(x[0])+','+f(x[1])).join('L')+'Z'};
  return{z:z+(o.zb||0),cast:false,fn:par=>{if(o.stalk)E('path',{d:'M'+o.stalk.map(q=>{const x=l98Q(q);return f(x[0])+','+f(x[1])}).join('L'),stroke:o.sc||shd(col,-.45),'stroke-width':f(o.sw||1.6),fill:'none','stroke-linecap':'round'},par);
    /* the core under the scales (between open scales it shows dark) */
    const c0=V3.add(P,V3.sc(Z,len*.02)),c1=V3.add(P,V3.sc(Z,len*.96)),cr=Math.max(1.1,rad*(sp>.3?.32:.75));E('path',{d:polyRibbon([l98Q(c0),l98Q(V3.add(P,V3.sc(Z,len*.5))),l98Q(c1)],i=>cr*(i===1?1:.7)),fill:shd(col,-.55)},par);
    if(det){for(const q of sc){E('path',{d:out(q),fill:toneAt(Pl,.25+.6*q.I),stroke:ink,'stroke-width':.35,'stroke-opacity':.6,'stroke-linejoin':'round'},par);
        if(lip==='boss'&&q.vis>-.2)E('path',{d:boss(q),fill:toneAt(Pl,.45+.45*q.I),stroke:ink,'stroke-width':.3,'stroke-opacity':.55},par);
        else if(lip==='round'&&q.vis>-.1){const C=l98Q(V3.add(q.tip,V3.sc(q.tg,q.hw*.85))),Dd=l98Q(V3.add(q.tip,V3.sc(q.tg,-q.hw*.85))),Ee=l98Q(V3.add(q.tip,V3.sc(q.dd,q.hw*.5)));E('path',{d:`M${f(C[0])},${f(C[1])}Q${f(Ee[0])},${f(Ee[1])} ${f(Dd[0])},${f(Dd[1])}`,stroke:hi,'stroke-width':.5,'stroke-opacity':.7,fill:'none'},par)}}}
    else{let d='',k=-1;const flush=()=>{if(d)E('path',{d,fill:toneAt(Pl,.25+.6*k/3),stroke:ink,'stroke-width':.3,'stroke-opacity':.5},par);d=''};
      for(const q of sc){const kk=Math.round(q.I*3);if(kk!==k){flush();k=kk}d+=out(q)}flush()}
    if(o.frost&&!LOD){let d='';for(const q of sc)if(q.vis>0){const a=l98Q(V3.add(q.tip,V3.sc(q.tg,-q.hw*.8))),b=l98Q(V3.add(q.tip,V3.sc(q.tg,q.hw*.8)));d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}
      E('path',{d,stroke:o.frost,'stroke-width':f(Math.max(1.1,rad*.18)),'stroke-linecap':'round','stroke-opacity':.9,fill:'none'},par)}}}}

/* ---------- mélèze (Larix decidua, European larch; L. kaempferi, Japanese larch, its shoots red-purple, its cone scales turned back like a rose): a deciduous conifer whose cut
   branches are sold bare, with their cones, or in leaf. The long shoots straw-yellow to red-brown, supple, the side twigs hanging; on the older wood short knobby spur shoots,
   each crowned in spring by a rosette of twenty to forty soft flat needles (2–3.5 cm), fresh bright green, golden in autumn; the cones stand upright on the spurs, small
   (2–4 cm), egg-shaped to round, of thin rounded scales, red-pink when young (the « roses »), then brown, staying years on the bare twigs where they grey ---------- */
const CW_L98MEL=[{id:'brun',n:'Brun naturel à cônes (rameaux nus)',c:'#8a6a48',sh:'#9a7a52',cone:'#7a5638',nd:0},{id:'gris',n:'Gris argenté (vieux rameaux, cônes anciens)',c:'#8e8a84',sh:'#8a847a',cone:'#7a6e62',nd:0,lich:1},
 {id:'vert',n:'Vert tendre (aiguilles de printemps)',c:'#a8c46a',sh:'#a07a4a',cone:'#8a5a3a',nd:'#9cc05a',young:1},{id:'or',n:'Or d’automne (aiguilles dorées)',c:'#d8a83a',sh:'#9a6a40',cone:'#7a5236',nd:'#d8a83a'},
 {id:'japon',n:'Mélèze du Japon, rameaux pourpres (L. kaempferi)',c:'#6a3a34',sh:'#7a3a30',cone:'#6e4a32',nd:0,kae:1}];
const L98_LCON=t=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.06+.94*t))),.55)*(1-.25*t);
function l98Tuft(P,d,len,n,col,lim,acc){const[X,Y]=fgCross(d),Pl=pal7(col),bins=acc?acc.b:['','',''],det=DET>=1.5&&!LOD;let z=0,cnt=0;
  for(let i=0;i<n;i++){const az=i*2.39996+R(-.2,.2),th=R(35,80)*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),dd=V3.nz(V3.add(V3.sc(d,Math.cos(th)),V3.sc(r,Math.sin(th)))),
      ln=len*R(.75,1.05),e=V3.add(V3.add(P,V3.sc(dd,ln)),[0,-ln*.12,0]),m=V3.add(V3.add(P,V3.sc(dd,ln*.5)),[0,-ln*.02,0]);if(lim!=null&&e[1]<-lim)continue;
    const bin=e[2]<P[2]-ln*.2?0:V3.dot(r,LIGHT)>.2?2:1,a=l98Q(P),b=l98Q(m),c=l98Q(e);bins[bin]+=`M${f(a[0])},${f(a[1])}Q${f(b[0])},${f(b[1])} ${f(c[0])},${f(c[1])}`;z+=e[2];cnt++}
  if(acc){acc.z+=z;acc.n+=cnt;acc.c=col}if(!cnt||acc)return null;const cs=[toneAt(Pl,.36),toneAt(Pl,.58),toneAt(Pl,.82)],sw=1.15;
  return{z:z/cnt,cast:false,fn:par=>{for(let k=0;k<3;k++)if(bins[k])E('path',{d:bins[k],stroke:cs[k],'stroke-width':sw,fill:'none','stroke-linecap':'round'},par)}}}
function l98Meleze(g,t,o){const cw=cwPick(CW_L98MEL,o),op=o.op??1,y=l98C(op),st=l39Wood(cw.sh),old=l39Wood(mix(cw.sh,'#5a5048',.45)),spur=mix(cw.sh,'#3a2e26',.45),lite=DET<1.5||LOD,SP={d:'',z:0,n:0},TA={b:['','',''],z:0,n:0};let nC=0;const mC=o.spine?5:11;
  return l39Sprig(g,t,o,{id:'mel-'+cw.id,len:70,leafy:.82,inter:[1.7,1.2],nl:0,div:137.5,ang:[60,50],w0:UPC*.7,w1:1.2,wp:.8,cols:st,e:-.004,wig:.014,zig:3,twist:8,tip:1.2,clr:4,
    br:{zone:[.04,.88],p:.5,max:9,gap:1,n:[8,16],li:1.6,ang:52,eb:-.06,ls:.85,wk:.45},
    node:(og,lim)=>{const ph=(og.p.ph||0)*D,sd=V3.nz(V3.add(V3.sc(og.U,-Math.cos(ph)),V3.sc(og.L,Math.sin(ph)))),q=og.p.q??0,young=og.p.b&&og.p.qb>.75,pp=[];if(young&&!cw.nd)return null;
      const Zs=V3.nz(V3.add(V3.sc(og.H,.45),V3.sc(sd,.9))),ls=UPC*R(.3,.45),P0=V3.add(og.pos,V3.sc(sd,og.w*.2)),tipP=V3.add(P0,V3.sc(Zs,ls));
      /* the spur: a short knob ringed by the scars of its needles */
      if(!young){if(lite){/* at the app's detail all the spurs of the branch in one stroke path */const a=l98Q(P0),b=l98Q(V3.add(P0,V3.sc(Zs,ls*1.1)));SP.d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;SP.z+=P0[2];SP.n++}
        else pp.push(l39Ovoid(P0,Zs,ls*1.15,Math.max(1.6,UPC*.32),t2=>.85+.15*Math.sin(Math.PI*t2),spur,{scales:3,zb:.02,eo:.6}))}
      /* a cone on the spur, upright */
      const cp=og.p.b?.1:.16;if(!young&&nC<mC&&q>.12&&rnd()<cp){nC++;const Zc=V3.nz(V3.add(V3.sc(Zs,.45),[0,.9,0])),lc=UPC*R(2.2,3.2)*(cw.young?.75+.25*y:1),rc=lc*.42,P1=V3.add(tipP,V3.sc(Zc,-lc*.04));
        if(lim==null||P1[1]>-lim+2){const col=cw.young&&y<.8?mix('#b0405a',cw.cone,l98C(y*1.2)):cw.cone;
          pp.push(l98Cone(P1,Zc,lc,rc,col,cw.kae?.65:.4,{n:DET>=1.5?34:26,prof:L98_LCON,lip:'round',spread:cw.kae?95:70,el0:30,wk:1.25,ph:R(0,6),zb:.05,hi:mix(col,'#f0e0c8',.5)}));
          if(cw.lich&&DET>=1.5){const c=V3.add(P0,V3.sc(og.H,og.w*.6));pp.push({z:c[2]+.04,cast:false,fn:par=>E('circle',{cx:f(c[0]),cy:f(-c[1]),r:f(Math.max(1.1,og.w*.35)),fill:'#a8b098',opacity:.7},par)})}}}
      /* the rosette of needles on the spur (a few single needles on the young tips) */
      if(cw.nd){const tl=UPC*(1.2+1.8*y)*R(.85,1.1),tu=l98Tuft(young?og.pos:tipP,young?V3.nz(V3.add(og.H,V3.sc(sd,.4))):Zs,young?tl*.8:tl,young?4:Math.round((DET>=1.5?22:9)*(.6+.4*y)),cw.young?mix(cw.nd,'#d8e890',(1-y)*.4):cw.nd,lim,lite?TA:null);if(tu)pp.push(tu)}
      return pp},
    apex:(og,lim)=>[l39Ovoid(og.pos,og.H,UPC*.35,Math.max(1.3,og.w*.9),L39_EGG,spur,{scales:2,zb:.03,eo:.6})],
    post:(res,parts)=>{if(SP.n){const d=SP.d;parts.push({z:SP.z/SP.n+.5,cast:false,fn:par=>E('path',{d,stroke:spur,'stroke-width':f(Math.max(1.6,UPC*.3)),'stroke-linecap':'round',fill:'none'},par)})}
      if(TA.n){const Pl=pal7(TA.c),cs=[toneAt(Pl,.36),toneAt(Pl,.58),toneAt(Pl,.82)],b=TA.b;parts.push({z:TA.z/TA.n+.6,cast:false,fn:par=>{for(let k=0;k<3;k++)if(b[k])E('path',{d:b[k],stroke:cs[k],'stroke-width':1.15,fill:'none','stroke-linecap':'round'},par)}})}},
    bark:(chains,parts,sp)=>l39Bark(chains,parts,sp?16:8,ch=>ch.ord?st:old,(P,W)=>DET>=1.5?l39Lenti(P,W,.05,mix(cw.sh,'#f0e0c8',.5),{l0:.12,l1:.25,w:.4,op:.5,wmin:1.4}):null)})}

/* ---------- pin à cônes (Pinus): woody shoots clothed with needles in bundles (fascicles) set in a tight spiral, sheathed at their base — two in Scots and black pine, five soft
   fine ones in white pine —, the shoot ending in a whorl of resinous buds; the cones hang on short stalks behind the young growth: green and closed in their second summer,
   ripening brown and still closed, then opening in dry weather, their woody scales spread in crossing spirals (8 and 13), each ending in its rhombic boss (apophysis) with
   its umbo. Scots pine cones 3–7 cm, ovoid-conical, grey-brown; black pine 5–8 cm, glossy yellow-brown; white pine 8–15 cm, long, slender and curved, the thin scales tipped
   with resin. For the holidays the cones come frosted white or gilded ---------- */
const CW_L98PIN=[{id:'sylvestre',n:'Pin sylvestre à cônes bruns',c:'#7a5232',nc:'#5f8580',nn:2,ln:5.5,tw:.12,dr:.1,bark:'#9a5a36',cl:5.2,cr:.36,cn:72},
 {id:'noir',n:'Pin noir à cônes blonds',c:'#a0683a',nc:'#4a7040',nn:2,ln:11,tw:.05,dr:.06,bark:'#5a4a3a',cl:6.5,cr:.38,cn:84},
 {id:'weymouth',n:'Pin de Weymouth à longs cônes',c:'#8a6440',nc:'#7d8e80',nn:5,ln:10,tw:.04,dr:.3,bark:'#6a5a46',cl:11,cr:.2,cn:64,long:1},
 {id:'givre',n:'Givré blanc (cônes et aiguilles)',c:'#efebe2',nc:'#5f8580',nn:2,ln:5.5,tw:.12,dr:.1,bark:'#9a5a36',cl:5.2,cr:.36,cn:72,frost:'#fbfaf6',base:'#7a5232'},
 {id:'or',n:'Cônes dorés',c:'#c9a54a',nc:'#4a7040',nn:2,ln:9,tw:.06,dr:.06,bark:'#5a4a3a',cl:6,cr:.38,cn:80,gold:1}];
const L98_PCON=t=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.04+.96*t))),.6)*(1-.45*Math.pow(t,1.3)),L98_PLONG=t=>Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(.999,.03+.97*t))),.5)*(1-.4*t);
/* a cone hanging from its twig: closed green (young), closed brown, or open; its stalk rooted on the twig */
function l98PinCone(og,kl,cw,op,lim,kc=1){const H=V3.nz(og.H),st=op<.3?0:op<.7?1:2,Lc=cw.cl*UPC*kl*kc*R(.85,1.1)*(st?1:.7),rc=Lc*cw.cr*(st===2?1:.82),
    a=V3.nz(V3.add(V3.add(V3.sc(H,-.3),[0,-.9,0]),V3.sc(V3.nz(og.U),.25))),b=V3.add(og.pos,V3.sc(V3.nz(V3.add(H,[0,-.6,0])),.9*UPC*kl));
  if(lim!=null&&b[1]+a[1]*Lc<lim+2)return null;
  const col=st===0?(cw.gold?cw.c:cw.frost?'#7a8a4a':'#6e7a40'):cw.gold?cw.c:cw.frost?cw.base:cw.c,sp=st===2?(cw.long?.55:.85):0;
  /* the cone grows from its stalk outward: its base at b, its axis down the hang (a), drawn tip-first from the twig */
  return[l98Cone(b,a,Lc,rc,col,sp,{n:DET>=1.5?cw.cn:Math.round(cw.cn*.6),prof:cw.long?L98_PLONG:L98_PCON,lip:'boss',spread:cw.long?60:78,el0:14,wk:cw.long?1.3:1.05,ph:R(0,6),
    stalk:[og.pos,b],sw:1.8,sc:shd(cw.bark,-.35),zb:3,frost:cw.frost||null,hi:cw.gold?'#fff4c8':null,ink:cw.gold?'#6a4a1a':null})]}
/* o.cm up to 15: the recipe's cone size (cm, 7 for the usual cone), else the length of the cut branch */
function l98Pin(g,t,o){const cw=fgCw(CW_L98PIN,o),op=Math.max(.05,Math.min(1,o.op??1)),ks=o.spine?1:(o.cm>15?o.cm:50)/50,kl=o.spine?1:.7+.3*ks,k=G(g);
  return g35Run(o,'l98pin',()=>{const Lt=o.spine?blen(o.spine):50*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),cols=L45_PINST(cw.bark),lim=g35Lim(o);let nc=0;const mc=o.spine?(rnd()<.5?1:2):rnd()<.4?2:rnd()<.6?3:4;
    /* frosted: the needles hoary, the cones rimed on their scales */const ndc={c:cw.frost?mix(cw.nc,'#eef0ec',.42):cw.nc,nn:cw.nn,tw:cw.tw,dr:cw.dr};
    const r=fgGrow(k,A,{li:2.4*UPC*kl,liT:.3,w0:6.5*kl,w1:1.6,cols,uL:2,lp:0,phy:'spiral',seg:9,wig:.03,tipLv:0,
      side:{u0:.22,u1:.75,p:.4,len:.42,ang:52,li:.9,e:-.01,tilt:22},
      axil:{u0:.45,p:.6,ang:110},
      tip:(og)=>l45PinBuds(og,op>.62?.8:op,kl,{bark:cw.bark}),
      axDraw:(og)=>{if(nc>=mc||(og.p.u??0)<.45||rnd()<.3)return null;const c=l98PinCone(og,kl,cw,op,lim,o.cm>0&&o.cm<=15?o.cm/7:1);if(c)nc++;return c},
      post:(res,parts)=>{l45Needles(res,parts,ndc,{u0:o.spine?.04:.22,sp:(cw.nn>2?.42:.3)*UPC*kl,ln:cw.ln*UPC*kl*(o.spine?.85:1),th:cw.nn>2?32:44,lim});
      }});
    open(k,t,1000,0,.4);return r})}

/* ---------- registers: drawers, colourways, trade lengths (cm), composer infos ---------- */
Object.assign(GH,{'saule-fascie-sekka':l98Sekka,'noisetier-tortueux-chatons':l98Noisetier,'erable-du-japon':l98Erable,'meleze-a-cones':l98Meleze,'pin-a-cones':l98Pin});
Object.assign(CWS,{'saule-fascie-sekka':CW_L98SEK,'noisetier-tortueux-chatons':CW_L98NOI,'erable-du-japon':CW_L98ERA,'meleze-a-cones':CW_L98MEL,'pin-a-cones':CW_L98PIN});
Object.assign(SZG,{'saule-fascie-sekka':[60,80,100,100,120,150],'noisetier-tortueux-chatons':[50,60,80,80,100],'erable-du-japon':[40,50,60,60,80],'meleze-a-cones':[50,60,70,70,90],'pin-a-cones':[40,50,50,60,80]});
Object.assign(GHI,{'saule-fascie-sekka':{form:'ligne',size:1,k:'plant',self:100*UPC,tip:.9,fx:4*UPC,rch:10*UPC},'noisetier-tortueux-chatons':{form:'ligne',size:1,k:'plant',self:80*UPC,tip:.85,fx:6*UPC,rch:9*UPC},
 'erable-du-japon':{form:'feuillage',size:1.2,k:'plant',rk:.6,self:60*UPC,fx:22},'meleze-a-cones':{form:'ligne',size:1,k:'plant',self:70*UPC,tip:.8,fx:5*UPC,rch:10*UPC},
 'pin-a-cones':{form:'feuillage',size:1.1,k:'plant',rk:.44,self:50*UPC,fx:24}});
