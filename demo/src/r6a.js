/* ================= Serre, reprise 6 — poussés par le L-système : oncidium (panicule ramifiée de « danseuses »), dahlia pompon (tige ramifiée, bouton latéral), amarante retombante (cordons et tige feuillée), amarante dressée (plumet ramifié de glomérules) ================= */
/* ---------- oncidium (Oncidium et Oncidesa, hybrides Gomesa × Oncidium): a long bare peduncle, then an arching panicle; side branches alternate along the rachis,
   the lowest the longest; each carries little « dancing ladies » on curving pedicels (the oldest at its base, buds at its tip), the top of the rachis ends in single flowers and buds.
   The flower: a big flaring lip (the skirt: two small side lobes, a narrow isthmus, a broad kidney-shaped mid-lobe notched at its tip, a crested callus at its base),
   small undulate sepals and petals barred with brown (the hat and the raised arms), the two lateral sepals hidden behind the lip, the short winged column (the head).
   Rules: rachis R(i<nB) → F(li) N(branch i) R(i+1), R(i<n) → F(li) K(single) R(i+1);  branch Y(j<n) → F(lb) K(age_j) /(180±δ) Y(j+1),  Y(n) → F(tip) ---------- */
const ONC_PAT={'golden-shower':{bk:.62,lipb:'#a8521e',lband:1,lbv:.44},'choco':{bk:.5,lipb:'#4a2014',lband:1,lbv:.42},'sharry':{lbv:.46},'pourpre':{lbv:.34},'monarch':{bk:.74,lbv:.4},'rouge':{lipb:'#9a1626',lband:1,lbv:.4}};
const CW_ONC2=CW_ONC.map(w=>Object.assign({},w,ONC_PAT[w.id]||{})).concat([
 {id:'sweet-sugar',n:'Jaune (Sweet Sugar)',c:'#f8d523',bar:'#b8862a',bk:.22,lipc:'#f9d81e',lipb:'#eeaa12',lbv:.52,soft:1,cal:'#e8941c'},
 {id:'twinkle-blanc',n:'Blanc parfumé (Twinkle)',c:'#fbf9f2',lipc:'#fefcf6',lipb:'#f4e49a',lbv:.32,soft:1,cal:'#f0c832'},
 {id:'rose-poudre',n:'Rose poudré',c:'#f0c4d4',lipc:'#f6d8e4',cal:'#f2c84a'},
 {id:'framboise',n:'Framboise à labelle blanc',c:'#b03c5e',lipc:'#f6eef0',lipb:'#b03c5e',lbv:.4,cal:'#f0c040'},
 {id:'caramel',n:'Caramel doré',c:'#c48e50',bar:'#7a4420',bk:.45,lipc:'#dcae5e',lipb:'#9a5a26',lband:1,lbv:.42,cal:'#8a3a14'},
 {id:'wildcat',n:'Jaune taché de rouge (Wildcat)',c:'#f0c63c',bar:'#a8301c',bk:.82,lipc:'#f4cc3e',lsp:'#a8301c',lipb:'#a8301c',lbv:.3,cal:'#a8301c'}]);
const ONC_TEP=prof([[0,.32],[.25,.72],[.62,1],[.88,.86],[1,.35]]);
/* the lip as an outline in its own plane: v along (0 at the column, 1 at the tip), u across (× half width), right side down to the notch at its tip */
const ONC_LIPO=[[0,.1],[.06,.17],[.12,.34],[.19,.45],[.26,.37],[.32,.21],[.38,.26],[.46,.64],[.56,.92],[.67,1],[.78,.96],[.88,.75],[.96,.42],[1,.17],[.94,0]];
const oncU=v=>{for(let i=1;i<14;i++){const a=ONC_LIPO[i-1],b=ONC_LIPO[i];if(v<=b[0]){const t=(v-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*Math.max(0,t)}}return .17};
/* one dancing lady in its frame B at O (view space): pieces far to near; at the app's detail the sepals and petals are one outline, the lip one, its blotch and callus one each */
function oncLady(par,B,O,D,cw,op,PC){const det=DET>=1.5,nz=B[2][2],o2=sm01((op-.25)/.75),pal=c=>PC[c]||(PC[c]=pal7(c)),
    tone=(c,n,bk)=>{const back=n[2]<0;return toneAt(pal(back?mix(c,bk||'#d8d6b2',.32):c),lightI(back?V3.sc(n,-1):n)*(back?.92:1))},A=a=>Math.PI/2-(Math.PI/2-a)*(.45+.55*o2),it=[];
  /* sepals and petals: the lateral sepals point down behind the lip, the dorsal one stands up (a little hooded), the petals spread like raised arms */
  const tp=[];for(const s of[-1,1])tp.push(ligule(B,O,{phi:(270+s*17+R(-4,4))*D2R,r0:D*.02,z0:-D*.04,L:D*.23,W:D*.075,wp:ONC_TEP,a0:A(1.38),a1:A(1.78),pw:1.2,th:.3,tip:'round',wav:.2,wk:3,n:det?5:4,tw:s*.2}));
  tp.push(ligule(B,O,{phi:(90+R(-5,5))*D2R,r0:D*.03,z0:-D*.012,L:D*.25,W:D*.1,wp:ONC_TEP,a0:A(1.2),a1:A(1.62),pw:1.2,th:.45,tip:'round',wav:.28,wk:3,n:det?6:4,tw:R(-.15,.15)}));
  for(const s of[-1,1])tp.push(ligule(B,O,{phi:(90+s*80+R(-6,6))*D2R,r0:D*.04,z0:-D*.004,L:D*.27,W:D*.105,wp:ONC_TEP,a0:A(1.32),a1:A(1.66),pw:1.2,th:.35,tip:'round',wav:.3,wk:3,n:det?6:4,tw:s*-.25}));
  /* the bars across the sepals and petals (golden-shower types nearly solid brown with yellow tips, sweet sugar only a few at their base) */
  const bars=cw.bar&&cw.bk&&(nz>-.15||det)?(()=>{let d='';const nb=det?4:3,span=.14+.64*cw.bk,bw=span/nb*(.38+.42*cw.bk);for(const l of tp){const S=l.S,n=S.length-1,row=(v,c)=>{const x=Math.max(0,Math.min(n,v*n)),i=Math.min(n-1,Math.floor(x)),t=x-i,m=[(S[i][0][0]+S[i][4][0])/2,(S[i][0][1]+S[i][4][1])/2],p=[S[i][c][0]+(S[i+1][c][0]-S[i][c][0])*t,S[i][c][1]+(S[i+1][c][1]-S[i][c][1])*t];return[m[0]+(p[0]-m[0])*.9,m[1]+(p[1]-m[1])*.9]};
      for(let j=0;j<nb;j++){const v0=.1+span*j/nb,v1=v0+bw*(1+.25*Math.sin(j*2.3+l.z)),q=[row(v0,0),row(v1,0),row(v1,4),row(v0,4)];d+='M'+q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}}return d})():null;
  /* the lip: its outline in its plane, mapped on a skirt that comes forward off the column and hangs, its sides swept back, its margin a little wavy */
  const Ll=D*.6*(.62+.38*o2),Wl=D*.42*(.55+.45*o2),Yb=-D*.035,Zb=D*.04,ph=R(0,6),wv=det?.05:.03,
    lipAt=(u,v)=>[u*Wl,Yb-Ll*v,Zb+Ll*(.3*v-.42*v*v)-Wl*.22*u*u*sm01((v-.3)/.45)],
    LO=ONC_LIPO.map(([v,u])=>[v,u*(v>.42?1+wv*Math.sin(v*23+ph):1)]),out=LO.concat(LO.slice(0,-1).reverse().map(([v,u])=>[v,-u])),lp=out.map(([v,u])=>PJ(B,O,lipAt(u,v)));
  let lz=0;for(const p of lp)lz+=p[2];lz/=lp.length;
  const ln=(()=>{const du=V3s(lipAt(.02,.62),lipAt(-.02,.62)),dv=V3s(lipAt(0,.64),lipAt(0,.6));return V3.nz(toV(B,V3.cr(dv,du)))})(),lipc=cw.lipc||cw.c,lfront=ln[2]>=0;
  /* a region of the lip between v0 and v1 (the blotch at its base, the belt across the skirt) */
  const region=(v0,v1)=>{const q=[];for(let i=0;i<=5;i++){const v=v0+(v1-v0)*i/5;q.push(lipAt(oncU(v)*.97,v))}for(let i=1;i<4;i++){const u=.97*oncU(v1)*(1-2*i/4);q.push(lipAt(u,v1+.025*Math.sin(i*2.1+ph)))}
    for(let i=5;i>=0;i--){const v=v0+(v1-v0)*i/5;q.push(lipAt(-oncU(v)*.97,v))}if(v0>.01)for(let i=1;i<4;i++)q.push(lipAt(-.97*oncU(v0)*(1-2*i/4),v0));return q.map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]})};
  const tepFill=c=>tone(c,tp[2].nm),zt=tp[2].z,lipD=smooth(lp.map(p=>[p[0],p[1]]));
  if(det)for(let j=0;j<tp.length;j++){const l=tp[j],c=cw.c;it.push({z:l.z,fn:k=>E('path',{d:smooth(l.out),fill:tone(c,l.nm),stroke:pal(c).d1,'stroke-width':.3,'stroke-opacity':.55},k)})}
  else it.push({z:zt,fn:k=>E('path',{d:tp.map(l=>smooth(l.out)).join(''),fill:tepFill(cw.c)},k)});
  if(bars)it.push({z:det?zt+D*.02:zt+1e-3,fn:k=>E('path',{d:bars,fill:cw.bar,opacity:nz<0?.3:.86,'stroke-linejoin':'round'},k)});
  it.push({z:lz,fn:k=>{E('path',{d:lipD,fill:tone(lipc,ln,'#e2dcc0'),stroke:pal(lipc).d1,'stroke-width':det?.35:.3,'stroke-opacity':.6},k);if(det&&!LOD)E('path',{d:lipD,fill:floretShade(),opacity:.55},k);
    if(!lfront)return;
    if(cw.lipb){const d=smooth(cw.lband?region(.3,cw.lbv||.42):region(0,cw.lbv||.42));E('path',{d,fill:cw.lipb,opacity:cw.soft?.5:cw.lband?.72:.88},k)}
    if(cw.lsp){let d='';const n=det?14:7;for(let i=0;i<n;i++){const v=.47+.42*((i*.618+ph*.13)%1),u=(((i*.7549+ph*.31)%1)*2-1)*.74*oncU(v),c=PJ(B,O,lipAt(u,v)),r=D*(.012+.012*((i*.71)%1));d+=`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}E('path',{d,fill:cw.lsp,opacity:.8},k)}}});
  /* the crested callus at the base of the lip, and the column with its wings (the dancer's bodice and head) */
  if(nz>-.1&&lfront){const cc=[[0,.08],[.13,.17],[0,.28],[-.13,.17]].map(([u,v])=>{const p=lipAt(u,v);p[2]+=D*.02;const s=PJ(B,O,p);return[s[0],s[1]]});
    it.push({z:lz+D*.05,fn:k=>{E('path',{d:smooth(cc),fill:tone(cw.cal||'#e8a030',ln),stroke:shd(cw.cal||'#e8a030',-.5),'stroke-width':.25,'stroke-opacity':.5},k);
      if(det){let d='';for(const v of[.12,.18,.24]){const s=PJ(B,O,V3.add(lipAt(0,v),[0,0,D*.03])),r=D*.012;d+=`M${f(s[0]-r)},${f(s[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}E('path',{d,fill:shd(cw.cal||'#e8a030',-.4),opacity:.7},k)}}});
    if(det){const cl=cw.col||mix(lipc,'#fffaee',.55),q=[[0,D*.075,D*.05],[D*.055,D*.03,D*.065],[D*.07,-D*.005,D*.07],[D*.03,-D*.03,D*.08],[-D*.03,-D*.03,D*.08],[-D*.07,-D*.005,D*.07],[-D*.055,D*.03,D*.065]].map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]}),an=PJ(B,O,[0,D*.06,D*.07]);
      it.push({z:lz+D*.08,fn:k=>{E('path',{d:smooth(q),fill:tone(cl,B[2]),stroke:shd(cl,-.5),'stroke-width':.25,'stroke-opacity':.55},k);E('ellipse',{cx:f(an[0]),cy:f(an[1]),rx:f(D*.028),ry:f(D*.022),fill:mix(cw.cal||'#e8a030','#f6e070',.5)},k)}})}}
  it.sort((a,b)=>a.z-b.z);for(const x of it)x.fn(par)}
/* a bud: a small pointed egg on its pedicel, green, the colour showing through as it swells (the barred kinds striped) */
function oncBud(par,B,O,s,cw,age){const c=mix('#a6b45c',cw.c,.2+.55*age),a=PJ(B,O,[0,0,-s*.1]),b=PJ(B,O,[0,0,s*.9]),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),rl=Math.max(s*.34,l*.5),cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2;
  E('ellipse',{cx:f(cx),cy:f(cy),rx:f(rl),ry:f(s*.3),transform:`rotate(${f(Math.atan2(dy,dx)/D2R)} ${f(cx)} ${f(cy)})`,fill:toneAt(pal7(c),.62),stroke:shd(c,-.5),'stroke-width':.3,'stroke-opacity':.6},par);
  if(cw.bar&&cw.bk>.3&&age>.4&&DET>=1.5){const ux=dx/(l||1),uy=dy/(l||1);let d='';for(const q of[-.2,.15,.45]){const px=cx+ux*rl*q,py=cy+uy*rl*q;d+=`M${f(px-uy*s*.24)},${f(py+ux*s*.24)}L${f(px+uy*s*.24)},${f(py-ux*s*.24)}`}E('path',{d,stroke:cw.bar,'stroke-width':f(s*.12),'stroke-opacity':.45},par)}}
/* a flower's frame: its face between the spray's face and its pedicel, its dorsal sepal toward the sky (resupinate, lip down), a little roll */
function oncFrame(face,dir){const Z=V3.nz(V3.add(V3.add(V3.sc(face,.86),V3.sc(dir,.26)),[R(-.1,.1),R(-.08,.08),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=[0,0,-1];Y=V3.nz(Y);
  const X=V3.cr(Y,Z),j=R(-.22,.22),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* the spray: its rachis (the composer's bent stem in a bouquet, its own growth on a sheet or a card: the peduncle rises, the panicle leans and its weight bends it over),
   the branches the L-system grows from its nodes, the single flowers and buds at its top */
function oncPlant(g,t,o){const cw=cwPick(CW_ONC2,o),spine=!!o.spine,card=!spine&&!o.ax,op=spine?R(.86,1):Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||2.5)*UPC*R(.95,1.05),k=G(g),PC={},parts=[];
  const SC=['#24401c','#3c6229','#5f8a3e','#a9c97a'],BC=['#2c4620','#4a6a30','#6f9048','#a8c27c'],up=[0,1,0],sd=rnd()<.5?-1:1;let face,bw=2.6,main,Lfl,l0,frameAt;
  const frames=(pts,ws,U0)=>{const cum=[0],N=pts.length-1;for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));
    return[cum[N],l=>{let i=1;while(i<N&&cum[i]<l)i++;const t=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1))),p=V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t)),H=V3.nz(V3s(pts[i],pts[i-1]));
      let U=V3s(face,V3.sc(H,V3.dot(face,H)));if(V3l(U)<1e-3)U=U0;U=V3.nz(U);return{pos:p,H,U,L:V3.cr(U,H),w:ws[i]}}]};
  if(spine){const f0=o.from||0,Lsp=blen(o.spine),fr=f0>0?Math.min(f0,Math.max(.3,1-Math.min(.62,17*UPC/Lsp))):0,C=bseg(o.spine,fr,1),N=36,pts=[];for(let i=0;i<=N;i++){const q=bz(C,i/N);pts.push([q[0],-q[1],0])}face=V3.nz([R(-.3,.3),R(-.02,.16),1]);
    /* a cluster from the mass: its panicle takes the upper part of the composer's stem (which draws the stem below, 3.4 to 2.4 wide up to its cut) */
    let L=0;for(let i=1;i<=N;i++)L+=V3l(V3s(pts[i],pts[i-1]));const w0=f0>0?3.4-fr/(f0+.03):3.3;bw=f0>0?3.4:w0;
    /* a cluster from the mass is all panicle; a line keeps its bare peduncle from the mouth and flowers in its upper part */
    Lfl=fr>0?L*.96:Math.min(L*.58,D*22);l0=L-Lfl;let acc=0;const ws=pts.map((p,i)=>{if(i)acc+=V3l(V3s(p,pts[i-1]));return w0+(1-w0)*Math.pow(acc/L,1.3)});main={pts,ws,c:SC,ord:0};frameAt=frames(pts,ws,[0,0,1])[1]}
  else{const B=frameOf(o,.3,true);face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
    const Lp=(card?6:24)*UPC*R(.92,1.08);Lfl=(card?24:38)*UPC*R(.92,1.08);l0=Lp;
    const n=24,lean=sd*R(16,26),mods=[['F',{l:Lp,w0:3.4,w1:2.9,e:.012}]];for(let i=0;i<n;i++){if(i<8)mods.push(['+',{a:lean/8}]);mods.push(['F',{l:Lfl/n,w1:2.9-1.9*(i+1)/n,e:-.042*R(.8,1.2)}])}
    const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.018,seg:UPC*.9,T:up,e:0,w:3.4});main=res.chains[0];main.c=SC;const fa=frames(main.pts,main.ws,U0);l0=fa[0]-Lfl;frameAt=fa[1]}
  /* the nodes: branches on the lower two thirds of the panicle, the lowest the longest, alternating sides; the stage decides how many flowers are open on each */
  const stage=op<.3?0:op<.7?.5:1,nB=Math.max(spine&&o.from?2:3,Math.min(12,Math.round(Lfl*.68/(2.4*UPC)))),nT=Math.max(2,Math.min(9,Math.round(Lfl*.28/(1.1*UPC)))),Lb0=Math.min(12*UPC,Lfl*.4),ch=[main],flw=[];
  /* one branch grown by the L-system from a frame: flowers alternating along it (the first close to its base), buds closing up at its tip; the lowest branches fork once */
  const branch=(F0,Lb,q,roll,pitch,w,sub)=>{const nf=Math.max(2,Math.round(Lb/(1.3*UPC))),nbud=nf>4?2:1,no=stage?Math.max(stage<1?1:0,Math.round((nf-nbud)*(stage<1?.55:1))):0,li=Lb/(nf-.4);
    const rules={Y:p=>p.j<p.n?[['F',{l:li*(p.j?p.j>=p.no?.62:R(.85,1.15):.55),w1:Math.max(.68,w*(1-.4*p.j/p.n))}],['K',{j:p.j,n:p.n,no:p.no}],['/',{a:180+R(-28,28)}],['Y',{j:p.j+1,n:p.n,no:p.no}]]:[['F',{l:li*.3,w1:.62}]]};
    const r=lsTurtle([['/',{a:roll}],['&',{a:pitch}]].concat(lsDerive([['Y',{j:0,n:nf,no}]],rules,nf+2)),{p:F0.pos,H:F0.H,U:F0.U,wig:.03,seg:UPC*.75,T:up,e:-.024,w});for(const c of r.chains)c.c=BC;ch.push(...r.chains);
    for(const og of r.organs)if(og.t==='K'){const j=og.p.j,bud=j>=og.p.no;flw.push({og,bud,age:bud?.12+(stage?.3:.75)*(1-(j-og.p.no)/Math.max(1,og.p.n-og.p.no)):1-.08*j,sz:1-.1*q-.025*j});
      if(sub&&j===1){const H=og.H,U=og.U;branch({pos:og.pos,H,U},Lb*.42,q+.3,(og.L[1]>0?-1:1)*90*(V3.dot(V3.cr(U,H),[0,1,0])>0?1:-1)+R(-20,20),R(38,50),w*.8,0)}}};
  for(let i=0;i<nB;i++){const q=i/Math.max(1,nB-1),F0=frameAt(l0+Lfl*(.03+.64*q));branch(F0,Lb0*(1-.6*q)*R(.86,1.08),q,(i%2?90:-90)*sd+R(-24,24),R(44,60)+10*q,Math.min(1.15,F0.w*.7),i<3&&Lfl>30*UPC)}
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),F0=frameAt(l0+Lfl*(.7+.29*Math.pow(q,.8))),nbt=Math.min(2,nT-1),bud=!stage||i>=nT-nbt||(stage<1&&i>=nT-nbt-2),s=i%2?1:-1;
    flw.push({og:{pos:F0.pos,H:F0.H,U:F0.U,L:V3.sc(F0.L,s)},bud,age:bud?.12+.3*(1-q):1,sz:.88-.06*q})}
  /* the axes in the painter's order; each flower with its curving pedicel (behind it, or in front when it turns its back), each bud tight on its branch */
  lsChainParts(ch,[0,0,0],SC,parts,{piece:12});const pc=mix(BC[2],cw.c,.15);
  for(const fl of flw){const og=fl.og,dir=V3.nz(V3.add(V3.add(V3.sc(og.H,.42),V3.sc(og.L,.86)),V3.sc(face,.28))),n0=og.pos;
    if(fl.bud){const s=D*(.2+.26*fl.age)*fl.sz,Bb=basis(V3.nz(V3.add(V3.add(V3.sc(dir,.8),V3.sc(face,.2)),[0,.15,0])),0),O=V3.add(n0,V3.sc(dir,s*.25));parts.push({z:O[2],fn:par=>oncBud(par,Bb,O,s,cw,fl.age)});continue}
    const lp=D*R(.62,.82),e=V3.add(V3.add(n0,V3.sc(dir,lp)),[0,lp*.06,0]),m=V3.add(V3.add(n0,V3.sc(dir,lp*.5)),[0,lp*.16,0]),Bf=oncFrame(face,dir),O=V3.add(e,V3.sc(Bf[2],D*.03)),pw=Math.max(.7,D*.042),
      opf=stage<1?(fl.age>.99?.85:.55):R(.9,1);
    parts.push({z:O[2],fn:par=>{const ped=()=>E('path',{d:`M${f(n0[0])},${f(-n0[1])}Q${f(m[0])},${f(-m[1])} ${f(e[0])},${f(-e[1])}`,stroke:pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par);
      const facing=Bf[2][2]>0;if(facing)ped();oncLady(par,Bf,O,D*fl.sz,cw,opf,PC);if(!facing)ped()}})}
  drawParts(k,parts);open(k,t,1000,0,.4);return spine?{k,bw,bc:SC}:{k}}
Object.assign(GH,{'oncidium':oncPlant});Object.assign(FN,{oncidium:oncPlant});CWS['oncidium']=CW_ONC2;
GHI['oncidium']={form:'grappe',size:1,k:'plant',rk:3.4,self:58*UPC,fx:6*UPC};
/* ---------- dahlia pompon (Dahlia × hortensis, groupe pompon): a ball under 5 cm of tightly involute florets (each a little cornet showing its mouth) on a long hollow stem that branches;
   opposite pinnate leaves (three to five toothed leaflets) at its upper nodes, a side shoot from their axils ending in a bud in its green bracts or in a younger, half-open ball.
   Rules (lsHeadS): A(n>0) → F N(n) A(n−1),  A(0) → F F(aim) K,  N(i) → [ Lv ] [ Lv ] [ F Kb(age) ]? — lengths in real centimetres, whatever the grade of the ball ---------- */
/* the trade colourways: the lot 5 list, completed with the pompons sold by the growers (Wizard of Oz, Franz Kafka, Burlesca, Little Robert) */
const CW_DPOM2=CW_DPOM.concat([{id:'blush',n:'Rose poudré (Wizard of Oz)',c:'#f4cad4'},{id:'lilas',n:'Lilas rosé (Franz Kafka)',c:'#d69ac6'},{id:'framboise',n:'Framboise (Burlesca)',c:'#c4325e'},{id:'rouge',n:'Rouge (Little Robert)',c:'#c01e2c'}]);
/* the lot 5 head; at the app's detail (a 4 cm ball is 20 to 40 pixels on a phone) 60 cornets without their shading veil, fewer on the smaller side balls */
const pomFlower=(par,B,O,D,cw,op,nk=1)=>{const N0=LIG.pom.N,L0=LOD,app=DET<1.5&&!LOD;LIG.pom.N=Math.round((app?60/.55:96)*nk);if(app)LOD=1;try{return dahliaFlower(par,B,O,D,cw,op,'pom')}finally{LIG.pom.N=N0;LOD=L0}};
function pomPlant(g,t,o){const cw=o.cw||cwNear(CW_DPOM2,o.col)||CW_DPOM2[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4)*UPC,cm=D/UPC,k=G(g),sc=['#2a4420','#466c30','#6c9846','#a6c87c'],
    /* a card's bunch draws its heads one after another: there the leaves stay small and few, so they never hide the next ball */
    card=!NECK_X&&!!o.up,lk=card?.62:1;
  const r=lsHeadS(k,o,{D,w:.5*UPC,cols:sc,op,rr:1,nodes:card?1:rnd()<.5?2:1,li:4.8/cm,lp:8.5/cm*R(.9,1.1),opp:1,leafAng:52,side:{p:.72,n:1,top:2,len:7/cm,ang:34,age:[0,.85]},budD:.42,budMax:.45,wig:.035,aimK:.09,
    flower:(par,B,O,D2,op2)=>pomFlower(par,B,O,D2,cw,op2),bud:(par,B,O,s)=>dahliaBud(par,B,O,s/.42,cw),young:(par,B,O,s,a)=>pomFlower(par,B,O,s,cw,.45+.45*a,.6),
    leaf:(og,pos)=>lsLeaf2D(og,pos,UPC*R(6,7.6)*(og.p.i>1?1.15:1)*lk,(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#3a6a2c',og.p.i>1&&DET>=1.5?5:3,{w:.5,side:.3}))});
  open(k,t,1000,10,.3);return r}
GH['dahlia-pompon']=pomPlant;CWS['dahlia-pompon']=CW_DPOM2;GH_BUDS.add('dahlia-pompon');if(STEML['dahlia-pompon'])STEML['dahlia-pompon']=Object.assign({},STEML['dahlia-pompon'],{n:[0,1]});
/* ---------- amarante queue-de-renard (Amaranthus caudatus): a stout stem, alternate ovate leaves on long petioles; at its top the inflorescence, a thick cord of glomerules
   (tight clusters of tiny flowers in their bristly bracts) that arches over and hangs under its own weight, dense like chenille near the top, strung apart like beads toward its tip;
   shorter cords hang from the axils of the upper leaves, and short branchlets fork from the top of the longest cords ---------- */
/* a hanging cord's centreline (view space, y up): it leaves p0 along d0; its weight turns it down (the angle from the vertical falls as tan(θ/2)·e^(−c·s)),
   its lower part swings out (swing), its tip curls (curl), a little wander */
function amarHang(p0,d0,L,o={}){const n=o.n||32,G0=[0,-1,0],dz=V3.nz(d0),h0=V3s(dz,V3.sc(G0,V3.dot(dz,G0))),h=V3l(h0)>1e-4?V3.nz(h0):[o.side||1,0,0],
    th0=Math.min(2.95,Math.acos(Math.max(-1,Math.min(1,V3.dot(dz,G0))))),c=(o.c||15)/L,T0=Math.tan(th0/2),sw=o.swing||0,cu=o.curl||0,wz=o.wz??R(-.06,.06),pts=[p0];let p=p0;
  for(let i=1;i<=n;i++){const s=(i-.5)/n*L,th=2*Math.atan(T0*Math.exp(-c*s)),d=V3.add(V3.sc(G0,Math.cos(th)),V3.sc(h,Math.sin(th)));p=V3.add(p,V3.sc(d,L/n));
    const q=i/n,off=V3.add(V3.add(V3.sc(h,sw*Math.pow(q,1.5)+cu*sm01((q-.72)/.28)),[0,0,wz*L*q*q]),[R(-.4,.4),0,R(-.4,.4)]);pts.push(V3.add(p,off))}
  return pts}
/* the glomerules along a cord: packed round its centreline in a spiral, thick and dense near its top, a little swollen here and there, thinning and parting into beads toward its tip */
function amarBeads(P,r0,o={}){const n=P.length-1,cum=[0];for(let i=1;i<=n;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[n],ph=R(0,6),kn=o.knob??.14,
    at=s=>{const l=s*L;let i=1;while(i<n&&cum[i]<l)i++;const t=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return[V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),t)),V3.nz(V3s(P[i],P[i-1]))]},
    rOf=s=>r0*(1-(o.tap??.72)*Math.pow(s,.9))*(1+kn*Math.sin(s*29+ph)*Math.sin(s*7.3+ph*.7)),beads=[];let s=o.s0||0,i=0;
  while(s<1&&i<1400){const[q,T]=at(s);let N1=V3.cr(T,[0,0,1]);if(V3l(N1)<.15)N1=V3.cr(T,[1,0,0]);N1=V3.nz(N1);const N2=V3.cr(T,N1),r=rOf(s)*(.85+.3*rnd()),a=i*2.4,rad=r*(s<.55?.62:.25+.3*(1-s)),
      off=V3.add(V3.sc(N1,Math.cos(a)*rad),V3.sc(N2,Math.sin(a)*rad));beads.push([q[0]+off[0],q[1]+off[1],q[2]+off[2],r*(.62+.2*rnd()),s]);
    s+=(s<.5?.0055:s<.8?.009:.014)*(L>160?160/L:1)*(r0/(L*.032))*(.8+.4*rnd())/(o.dens||1);i++}
  return{beads,L,at,rOf}}
/* the core of a cord under its beads: a tapered ribbon in the shade colour (never thinner than a thread, so the last beads stay strung) */
function amarCore(P,r0,col,o={}){const S=P.map(p=>[p[0],-p[1]]),n=S.length-1;return E('path',{d:polyRibbon(S,i=>Math.max(.8,r0*.48*(1-(o.tap??.72)*Math.pow(i/n,.9)))),fill:col})}
/* beads painted in four passes (body in shade, colour, light, a glint), one path each; a tint toward the tips when the colourway has one, the colour mottled in two tones */
function amarPaint(par,beads,col,o={}){if(!beads.length)return;const tip=o.tip,bins={};for(const b of beads){const kk=tip?Math.round(sm01((b[4]-.45)/.45)*3):0;(bins[kk]=bins[kk]||[]).push(b)}
  const c=(cx,cy,rr)=>`M${f(cx-rr)},${f(cy)}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;
  for(const kk in bins){const B=bins[kk],cc=tip?mix(col,tip,kk/3):col,P=o.pc&&o.pc[cc]||pal7(cc);if(o.pc)o.pc[cc]=P;let d0='',d1='',d1b='',d2='',d3='';
    B.forEach(([x,y,z,r],j)=>{const X=x,Y=-y;d0+=c(X,Y,r);if(j%3===1)d1b+=c(X-r*.12,Y-r*.15,r*.78);else d1+=c(X-r*.12,Y-r*.15,r*.78);d2+=c(X-r*.3,Y-r*.34,r*.42);if(r>1.6&&!LOD)d3+=c(X-r*.38,Y-r*.42,r*.15)});
    E('path',{d:d0,fill:P.d2},par);E('path',{d:d1,fill:P.b},par);if(d1b)E('path',{d:d1b,fill:mix(P.b,P.d1,.38)},par);E('path',{d:d2,fill:P.l1,opacity:o.matte?.62:.85},par);if(d3&&!o.matte)E('path',{d:d3,fill:P.l2,opacity:.5},par)}}
/* one cord with its branchlets: centreline, beads, the short forks near its top (each its own little hanging cord) */
function amarCord(p0,d0,L,r0,o={}){const P=amarHang(p0,d0,L,o),B=amarBeads(P,r0,o),subs=[];
  const ns=o.subs??(L>110?(rnd()<.55?1:rnd()<.5?2:0):0);for(let j=0;j<ns;j++){const s=R(.04,.22),[q,T]=B.at(s),sd=(j%2?-1:1)*(o.side||1),dir=V3.nz(V3.add(V3.add(V3.sc(T,.45),[sd*.8,.1,R(-.3,.4)]),[0,0,0])),Ls=L*R(.16,.32);
    const Ps=amarHang(q,dir,Ls,{c:R(9,13),swing:sd*R(2,8),curl:R(-1,1)*Ls*.08,side:sd}),Bs=amarBeads(Ps,B.rOf(s)*R(.5,.62),{tap:.6});subs.push({P:Ps,B:Bs,r0:B.rOf(s)*.56})}
  return{P,B,r0,subs}}
/* the cord drawn on its own (a drape in a bouquet): the branchlets behind, the core, the beads behind the centreline, then those in front */
function amarCordDraw(par,cd,col,o={}){const pc={},tip=o.tip;for(const s of cd.subs){par.appendChild(amarCore(s.P,s.r0,pal7(col).d2,{tap:.6}));const b=s.B.beads.sort((a,b)=>a[2]-b[2]);amarPaint(par,b,col,{tip,pc})}
  par.appendChild(amarCore(cd.P,cd.r0,pal7(col).d2));const b=cd.B.beads.slice().sort((a,b)=>a[2]-b[2]),zc=b.length?b.reduce((a,q)=>a+q[2],0)/b.length:0;
  amarPaint(par,b.filter(q=>q[2]<zc),col,{tip,pc});amarPaint(par,b.filter(q=>q[2]>=zc),col,{tip,pc})}
/* in a bouquet: each call of the drape is one cord (the composer hangs three from the lip: the longest and two shorter ones); it leaves the mouth outward, arches over the lip and hangs */
function amarDrape(g,t,o){const cw=cwNear(CW_AMAR,o.col)||CW_AMAR[0],col=o.col||cw.c,L=o.len||220,sw=o.sway??R(-30,30),side=o.side||(sw<0?-1:1),k=G(g),e=R(14,34)*D2R;
  const cd=amarCord([0,0,0],V3.nz([side*Math.cos(e),Math.sin(e),R(-.2,.3)]),L,Math.min(L*.032,1.25*UPC),{c:R(13,18),swing:sw*.55,curl:R(-1,1)*L*.05,side});amarCordDraw(k,cd,col,{tip:cw.tip});
  open(k,t,1300,0,0);return k}
/* the view of a plant grown upright in the garden: turned round its stem to the asked side, tilted toward the eye when seen from above (only a share of the elevation) */
function amarView(ax){const a=V3.nz(ax||[0,0,1]),yaw=Math.atan2(a[0],a[2]),pit=Math.asin(Math.max(-1,Math.min(1,a[1])))*.55,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pit),sp=Math.sin(pit);
  return v=>{const x=v[0]*cy+v[2]*sy,z=-v[0]*sy+v[2]*cy;return[x,v[1]*cp-z*sp,v[1]*sp+z*cp]}}
/* a cord as parts in the painter's order: its core and the beads behind its centreline, then the beads in front (two layers along its whole length, so no seam crosses it) */
function amarCordParts(parts,cd,col,M,o={}){const pc=o.pc||{},tip=o.tip,all=[[cd.P,cd.B,cd.r0,.72]].concat(cd.subs.map(s=>[s.P,s.B,s.r0,.6]));
  for(const[P0,B,r0,tap]of all){const P=P0.map(M),n=P.length-1,S=P.map(p=>[p[0],-p[1]]),w=i=>Math.max(.8,r0*.48*(1-tap*Math.pow(i/n,.9)));let zc=0;for(const p of P)zc+=p[2];zc/=P.length;
    const bs=B.beads.map(b=>{const q=M(b),a=P[Math.min(n,Math.round(b[4]*n))];return[q[0],q[1],q[2],b[3],b[4],q[2]-a[2]]});
    for(const fr of[0,1]){const h=bs.filter(b=>fr?b[5]>=0:b[5]<0).sort((a,b)=>a[2]-b[2]);parts.push({z:zc+(fr?r0*.4:-r0*.4),cast:false,fn:par=>{if(!fr)E('path',{d:polyRibbon(S,w),fill:pal7(col).d2},par);amarPaint(par,h,col,{tip,pc})}})}}}
/* the garden form (sheets and cards): the L-system grows the stem with its alternate long-stalked ovate leaves and the cords in the axils of the upper ones; the top cord continues the stem,
   arches over and hangs. Rules: A(n>0) → F N(n) /137.5 A(n−1),  A(0) → F C(top),  N(i) → [ &α F(petiole) Lv ] [ &β C ]? (upper nodes) ---------- */
function amarPlant(g,t,o){const cw=o.cw||cwNear(CW_AMAR,o.col)||CW_AMAR[0],col0=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),card=!o.ax,k=G(g),parts=[],M=amarView(o.ax),pc={};
  const gr=.42+.58*sm01((op-.05)/.85),young=op<.3,col=young?mix(col0,'#86a04e',.3):op<.7?mix(col0,'#86a04e',.1):col0,Lc=(o.cm||45)*UPC*(card?.78:1)*gr,r0=Math.min(Lc*.032,1.2*UPC)*(.72+.28*gr);
  const st=mix('#5a7430',col0,.28),sc=[shd(st,-.55),shd(st,-.22),st,shd(st,.4)],lc=mix('#3f6024',col0,.1),nN=card?3:5,w0=(card?.85:1.1)*UPC;
  const rules={A:p=>p.n>0?[['F',{l:UPC*R(4.4,5.6),w1:w0*(.6+.4*p.n/nN),e:.008}],['N',{i:p.n}],['/',{a:137.5+R(-12,12)}],['A',{n:p.n-1}]]:[['F',{l:UPC*R(2.5,3.5),w1:w0*.52}],['C',{top:1}]],
    N:p=>{const out=[['[',{w:.3*UPC}],['&',{a:R(50,62)}],['F',{l:UPC*R(3.4,5)*(p.i>2?1.1:.85),w1:.15*UPC,e:-.035}],['Lv',{i:p.i}],[']',{}]];
      if(p.i<=(card?1:2))out.push(['[',{w:.4*UPC}],['/',{a:R(-30,30)}],['&',{a:R(24,38)}],['C',{i:p.i}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:[0,1,0],U:[0,0,1],wig:.02,seg:UPC*1.2,T:[0,1,0],e:.008,w:w0});
  for(const ch of res.chains){ch.pts=ch.pts.map(M);ch.c=sc}lsChainParts(res.chains,[0,0,0],sc,parts,{piece:8});
  for(const og of res.organs){const g2={pos:M(og.pos),H:M(og.H),U:M(og.U),L:M(og.L),p:og.p};
    if(og.t==='Lv'){lsLeafParts(g2,UPC*(5.6+1.25*og.p.i)*R(.9,1.08)*(card?.85:1),.6,lc,parts,{wp:LS_OVATE,droop:.3,arch:.06,fold:.16,par:1,face:.35});continue}
    if(og.t==='C'){const top=!!og.p.top,sd=rnd()<.5?-1:1,d0=top?V3.nz(V3.add(og.H,[sd*.22,0,R(-.1,.15)])):og.H,L=top?Lc:Lc*R(.42,.66),
      cd=amarCord(og.pos,d0,L,top?r0:r0*.68,{c:young?5:op<.7?9:R(12,15),swing:sd*L*R(.04,.1),curl:R(-1,1)*L*.05,side:sd,subs:young?0:undefined});amarCordParts(parts,cd,col,M,{tip:cw.tip,pc})}}
  drawParts(k,parts);open(k,t,1300,0,.4);return k}
Object.assign(GH,{'amarante-retombante':amarPlant});Object.assign(FN,{amaranthPlant:amarPlant});SZG['amarante-retombante']=[30,40,45,50,60];
/* the composer hangs the amaranth from the lip (a drape): its drawer now grows organic cords; the other drapes keep theirs */
{const gD=GEN.drape;GEN.drape=(g,t,rec,o)=>!rec.id&&(rec.p||{}).type==='chenille'?amarDrape(g,t,o):gD(g,t,rec,o)}
/* ---------- amarante dressée (Amaranthus hypochondriacus, A. cruentus): a stout ribbed stem, alternate ovate leaves on long petioles, topped by an erect plume —
   a dense terminal spike of glomerules (velvety, bristling with the awns of their bracts) and shorter side spikes from its lower half, ascending and curving up round it like a candelabrum;
   a young plume is slim and greenish, its colour deepens as it ripens.
   Rules: plume nodes N(i<n) → [ /137.5·i &α S(len_i) ],  side spike S → F F F … (each step turning toward the sky);  stem nodes → [ &β F(petiole) Lv ] ---------- */
const CW_AMD=[
 {id:'velours',n:'Rouge velours (Velvet Curtains)',c:'#8b1c2c'},{id:'opopeo',n:'Bordeaux profond (Opopeo)',c:'#5e1626'},{id:'chocolat',n:'Rouge chocolat (Red Spike)',c:'#5a2228',lc:'#3e4628'},
 {id:'hopi',n:'Rouge vif (Hopi Red Dye)',c:'#b0222e'},{id:'grenat',n:'Grenat framboise (Red Garnet)',c:'#8e1d4a'},{id:'lie-de-vin',n:'Lie-de-vin (Pygmy Torch)',c:'#6a1b30'},
 {id:'prune',n:'Prune',c:'#5b2342'},{id:'vieux-rose',n:'Vieux rose',c:'#9a4452'},{id:'corail',n:'Corail',c:'#cc6f60'},
 {id:'cannelle',n:'Cannelle cuivrée (Hot Biscuits)',c:'#b8703c',tip:'#cc9254'},{id:'orange',n:'Orange doré (Golden Giant)',c:'#d48a2a'},{id:'bronze',n:'Bronze',c:'#7b4a2b'},
 {id:'pistache-bronze',n:'Vert pistache et bronze (Autumn’s Touch)',c:'#a9b46a',tip:'#9a6a3a',g:1},{id:'vert-pomme',n:'Vert pomme (Green Thumb)',c:'#8fa94b',g:1},{id:'vert-anis',n:'Vert anis',c:'#b8c06c',g:1}];
/* the glomerules of an upright spike: packed round its axis in a spiral, dense all along, the spike thick at its base and tapering to a blunt tip, knobbly */
function amdBeads(P,r0,o={}){const n=P.length-1,cum=[0];for(let i=1;i<=n;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[n],ph=R(0,6),beads=[];
  const at=s=>{const l=s*L;let i=1;while(i<n&&cum[i]<l)i++;const t=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return[V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),t)),V3.nz(V3s(P[i],P[i-1]))]},
    rOf=s=>r0*(.72+.28*sm01(s/.14))*(1-(o.tap??.62)*Math.pow(s,1.3))*(1+.12*Math.sin(s*31+ph)*Math.sin(s*9.1+ph)),step=Math.max(.6,r0*.11)/Math.max(1,L);let s=0,i=0;
  while(s<1&&i<900){const[q,T]=at(s);let N1=V3.cr(T,[0,0,1]);if(V3l(N1)<.15)N1=V3.cr(T,[1,0,0]);N1=V3.nz(N1);const N2=V3.cr(T,N1),r=rOf(s)*(.88+.24*rnd()),a=i*2.4,rad=r*.6,
      off=V3.add(V3.sc(N1,Math.cos(a)*rad),V3.sc(N2,Math.sin(a)*rad));beads.push([q[0]+off[0],q[1]+off[1],q[2]+off[2],r*(.5+.16*rnd()),s,off]);s+=step*(.75+.5*rnd())/(o.dens||1);i++}
  return{beads,L,at,rOf}}
/* the awns: short bristles out of the glomerules on the outline of a spike (sheets only) */
function amdAwns(par,bs,col){if(DET<1.5||LOD)return;let d='';for(const b of bs){if(rnd()<.55)continue;const o=b[5],l=Math.hypot(o[0],o[1])||1,ux=o[0]/l,uy=-o[1]/l,r=b[3],x=b[0]+o[0]*.15,y=-b[1]-o[1]*.15;
    d+=`M${f(x+ux*r*.7)},${f(y+uy*r*.7)}l${f(ux*r*.55+R(-.2,.2))},${f(uy*r*.55+R(-.2,.2))}`}if(d)E('path',{d,stroke:shd(col,.35),'stroke-width':.35,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par)}
/* a spike as parts: in segments along it, each with its core, its beads behind the axis, then in front */
function amdSpikeParts(parts,P,r0,col,o={}){const B=amdBeads(P,r0,o),n=P.length-1,nc=o.nc||3,pc=o.pc||{},tip=o.tip;
  for(let c=0;c<nc;c++){const seg=B.beads.filter(b=>b[4]>=c/nc&&b[4]<(c+1)/nc+(c===nc-1?1:0));if(!seg.length)continue;let zs=0;for(const b of seg)zs+=b[2];zs/=seg.length;
    const i0=Math.floor(n*c/nc),i1=Math.min(n,Math.ceil(n*(c+1)/nc)),S=P.slice(i0,i1+1).map(p=>[p[0],-p[1]]),w=i=>Math.max(.7,B.rOf((i0+i)/n)*.5);
    for(const fr of[0,1]){const h=seg.filter(b=>fr?b[2]>=zs:b[2]<zs).sort((a,b)=>a[2]-b[2]);parts.push({z:(o.zk?o.zk(c):zs)+(fr?r0*.4:-r0*.4),cast:false,fn:par=>{if(!fr&&S.length>1)E('path',{d:polyRibbon(S,w),fill:pal7(col).d2},par);amarPaint(par,h,col,{tip,pc,matte:1});if(fr)amdAwns(par,h,col)}})}}
  return B}
/* the plant: along its axis (the composer's spine in a bouquet, standing in the view on a sheet or a card); the bare stem with its leaves, then the plume */
function amdPlant(g,t,o){const cw=cwPick(CW_AMD,o),op=o.spine?R(.86,1):Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],pc={},young=op<.3,gr=.45+.55*sm01((op-.05)/.85),card=!o.spine&&!o.ax;
  const col=young?mix(cw.c,'#9ab060',.24):op<.7?mix(cw.c,'#9ab060',.1):cw.c,Lf0=(o.cm||35)*UPC*gr*(card?.8:1),Lt=o.spine?blen(o.spine):Lf0/gr*(card?1.5:1.8),M=o.spine?null:amarView(o.ax),bw=R(-.05,.05),A=spAxis(o,Lt,M?{C:[[0,0,0],[bw*Lt*.12,Lt*.34,0],[bw*Lt*.5,Lt*.68,0],[bw*Lt,Lt,0]].map(M),Fr:M([0,0,1])}:{face:R(-.8,.8)}),L=A.L;
  const Lfl=Math.min(Lf0,L*(o.spine?o.short?.78:.56:.5)),s0=A.sOf(L-Lfl),st=cw.g?'#5a7a34':mix('#5a6a30',cw.c,.38),SC=[shd(st,-.55),shd(st,-.22),st,shd(st,.4)],lc=cw.lc||mix('#3f6024',cw.c,.1),
    w0=o.spine?(o.short?4.6:6.4):1.1*UPC,Rp=Math.min(1.5*UPC,Lfl*.06)*(.62+.38*gr)*(young?.85:1),up=M?M([0,1,0]):[0,1,0];
  /* the stem, its core running up inside the plume */
  spStem(A,parts,[0,s0*.5,s0],w0,w0*.8,SC,s0);
  /* leaves on the bare stem (above the mouth in a bouquet): long petioles, ovate blades drooping a little, smaller toward the plume */
  const nl=o.short?1:card?2:4;for(let j=0;j<nl;j++){const l=(L-Lfl)*(.34+.64*j/Math.max(1,nl-1))*R(.95,1.02);if(o.spine&&l<15*UPC)continue;const s=A.sOf(l),fa=A.at(s),az=(j*137.5+R(-20,20))*D2R+(o.spine?(j%2?-1.2:1.2):0),
      r=V3.add(V3.sc(fa.Fr,Math.cos(az)),V3.sc(fa.Sd,Math.sin(az))),dp=V3.nz(V3.add(V3.sc(fa.T,.6),V3.sc(r,.8))),lp=UPC*R(3.6,5.6)*(1-.14*j),pe=V3.add(fa.p,V3.sc(dp,lp)),H=V3.nz(V3.add(dp,[0,-.3,0]));
    let U=V3s(up,V3.sc(H,V3.dot(up,H)));if(V3l(U)<1e-3)U=[0,0,1];U=V3.nz(U);const og={pos:pe,H,U,L:V3.cr(U,H)},pz=(fa.p[2]+pe[2])/2;
    parts.push({z:A.zk(s,pz),cast:false,fn:par=>E('path',{d:`M${f(fa.p[0])},${f(-fa.p[1])}Q${f(fa.p[0]+dp[0]*lp*.5)},${f(-fa.p[1]-dp[1]*lp*.5-lp*.08)} ${f(pe[0])},${f(-pe[1])}`,stroke:SC[1],'stroke-width':f(Math.max(.9,w0*.22)),fill:'none','stroke-linecap':'round'},par)});
    const lpz=[];lsLeafParts(og,UPC*R(11,15)*(1-.12*j)*(o.spine?.85:1),.62,lc,lpz,{wp:LS_OVATE,droop:.26,arch:.06,fold:.16,par:1,face:.4});for(const p of lpz){p.z=A.zk(s,p.z);parts.push(p)}}
  /* the plume: its terminal spike along the axis, the side spikes the L-system grows from its lower nodes, curving up */
  const N=24,Pm=[];for(let i=0;i<=N;i++)Pm.push(A.cb(s0+(1-s0)*i/N));const nS=young?Math.round(R(4,6)):Math.round(R(12,16)*(o.short?.65:1)),tip=cw.tip&&!young?cw.tip:null;
  amdSpikeParts(parts,Pm,Rp,col,{nc:DET>=1.5?4:3,pc,tip,zk:c=>A.zk(s0+(1-s0)*(c+.5)/3,A.cb(s0+(1-s0)*(c+.5)/3)[2])});
  /* the side spikes, gathered in two masses (behind and in front of the terminal spike) so that a plume stays light to draw */
  const gs=[[],[]],zc=A.cb(s0+(1-s0)*.3)[2],side=(p0,d0,Ls,rr,fork)=>{const res=lsTurtle([['F',{l:Ls}]],{p:p0,H:d0,U:Math.abs(d0[2])<.9?[0,0,1]:[1,0,0],wig:.025,seg:Ls/10,T:up,e:.06,w:1}),P=res.chains[0].pts,B=amdBeads(P,rr,{tap:.55});
    gs[P[P.length>>1][2]>=zc?1:0].push({P,B});
    if(fork){const i=Math.round(P.length*R(.25,.4)),T=V3.nz(V3s(P[i+1],P[i])),sx=V3.nz(V3.cr(T,[R(-.3,.3),R(-.2,.2),1])),d1=V3.nz(V3.add(V3.sc(T,.7),V3.sc(sx,(rnd()<.5?-1:1)*.7)));side(P[i],d1,Ls*R(.35,.5),rr*.72,0)}};
  for(let j=0;j<nS;j++){const q=j/Math.max(1,nS-1),s=s0+(1-s0)*(.02+.68*q),fa=A.at(s),az=(j*137.5+R(-18,18))*D2R,r=V3.add(V3.sc(fa.Fr,Math.cos(az)),V3.sc(fa.Sd,Math.sin(az))),
      Ls=Lfl*(.47-.34*q)*R(.85,1.12)*(young?.55:1),a=R(22,38)*D2R,d0=V3.nz(V3.add(V3.sc(fa.T,Math.cos(a)),V3.sc(r,Math.sin(a)))),p0=V3.add(fa.p,V3.sc(r,Rp*.35));
    side(p0,d0,Ls,Rp*(.68-.24*q),!young&&j<4&&!o.short)}
  gs.forEach((g2,fr)=>{if(!g2.length)return;const bs=[].concat(...g2.map(x=>x.B.beads)).sort((a,b)=>a[2]-b[2]);
    parts.push({z:zc+(fr?Rp*.7:-Rp*.7),cast:false,fn:par=>{let d='';for(const x of g2){const n=x.P.length-1,S=x.P.map(p=>[p[0],-p[1]]);d+=polyRibbon(S,i=>Math.max(.7,x.B.rOf(i/n)*.5))}E('path',{d,fill:pal7(col).d2},par);
      amarPaint(par,bs,col,{tip,pc,matte:1});if(fr)amdAwns(par,bs,col)}})});
  drawParts(k,parts);open(k,t,1100,0,.5);return o.spine?{k,bw:w0,bc:SC}:{k}}
Object.assign(GH,{'amarante-dressee':amdPlant});CWS['amarante-dressee']=CW_AMD;SZG['amarante-dressee']=[25,30,35,40,45];
GHI['amarante-dressee']={form:'epi',size:1,k:'plant',self:70*UPC,tip:.82,fx:5.5*UPC};
