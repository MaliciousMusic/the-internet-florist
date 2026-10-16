/* ================= Serre, lot 61 — baies 2, grandies par le L-système (moteur des baies du lot 20) : buisson ardent, callicarpa, cotonéaster, houx à baies, sorbier ================= */
/* ---------- shared: a berry on its pedicel (an organ of a grown branch); its tip crowned by the dried calyx of a pome (a dark puckered ring and five tiny sepals) or a stigma dot ---------- */
/* og the organ (pos, H), rr its radius, m its ripeness (0 green → 1 ripe); o: {fl flattening (hl/r), lift (toward the sky), gl gloss, eye 'pome'|'dot', ink} */
function l61Berry(parts,og,cw,rr,m,o={}){const ax=V3.nz(V3.add(og.H,[0,o.lift??.15,0])),hl=rr*(o.fl??.9),O=V3.add(og.pos,V3.sc(ax,hl*.78)),col=mix(bzRipe(cw,m),shd(cw.c,-.22),o.dk??R(0,.22)),dt=DET>=1.5,ink=o.ink||shd(cw.c,-.72);
  const eye=!dt&&rr<3.2?null:o.eye==='dot'?(q,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.1),cy:f(tp[1]+a[1]*r2*.1),rx:f(r2*.15),ry:f(r2*.15*Math.max(.35,Math.abs(a[2]))),fill:'#1c1410',opacity:.75},q)
    :(q,tp,a,r2)=>{const b=[tp[0],-tp[1],0];if(a[2]>.2)E('ellipse',{cx:f(tp[0]),cy:f(tp[1]),rx:f(r2*.24),ry:f(r2*.24*Math.max(.3,a[2])),fill:shd(col,-.62),opacity:.85},q);
      bzSpikes(q,bzRing(a,5,.9+R(-.15,.15),R(0,6)).map(d=>[V3.add(b,V3.sc(a,-r2*.1)),V3.add(b,V3.sc(d,r2*.3)),r2*.13]),'#3a2418',.4,{ink:'#1a0e08'})};
  parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,rr,col,{gl:o.gl??.9,big:o.big??3.6,ink,eye})});return O}
/* a cluster of n berries round an axil: pedicels of the turtle spread from p (radiating round H), short or long, each ending in a berry */
function l61Clu(p,H,U,n,rb,pl,o={}){const m=[['F',{l:rb*(o.st??.6),w1:o.w??1.25}]];for(let j=0;j<n;j++)m.push(['[',{w:1.15}],['/',{a:j*137.5+R(-15,15)}],['&',{a:(o.a0??15)+(o.a1??70)*Math.sqrt((j+.5)/n)+R(-8,8)}],['F',{l:pl*R(.75,1.25),w1:1.15}],['B',{j}],[']',{}]);
  return lsTurtle(m,{p,H:V3.nz(H),U:V3.nz(U),w:o.w??1.25,seg:2.5,T:[0,1,0],e:o.e??.02,wig:.05})}
/* the frame of the main axis at the length l, and the outward direction on its side az */
const l61At=(A,l,az)=>{const q=A.at(A.sOf(l));return{q,r:V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az)))}};
/* a straight sharp thorn from the stem surface (view space): base inside the stem, broad enough to stay one piece with it */
function l61Thorn(A,parts,l,az,w,len,col){const s=A.sOf(l),{q,r}=l61At(A,l,az),b=V3.add(q.p,V3.sc(r,w*.3)),tp=V3.add(b,V3.add(V3.sc(r,len+w*.2),V3.sc(q.T,len*.45)));
  parts.push({z:A.zk?A.zk(s,q.p[2]+r[2]*w*.5):q.p[2]+r[2]*w*.5,fn:par=>bzSpikes(par,[[b,tp,Math.max(1.7,w*.55)]],col,1.7,{ink:shd(col,-.6)})})}
/* ---------- a leaf blade (bzBlade of the lot 20) with what this lot adds: a spiny margin (teeth cut to points, waved up and down on each side), a variegated margin (o.vr: its colour, the green inside) ---------- */
function l61Blade(pos,H,U,len,wr,col,o={}){if(!o.vr&&!o.wave)return bzBlade(pos,H,U,len,wr,col,o);const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));og.L=V3.cr(og.U,og.H);
  const nt=o.teeth||0,fr=x=>x-Math.floor(x),wp0=o.wp||LS_OVATE,wp=nt?v=>{const x=fr(nt*v);return wp0(v)*(1-(o.td||.12)*4*x*(1-x))}:wp0,S0=lsLeafS(og,len,wr,Object.assign({},o,{wp})),wv=o.wave||0,
    S=(u,v)=>V3.add(S0(u,v),V3.sc(og.U,len*wv*u*u*Math.cos(Math.PI*nt*v)*(u>0?1:-1)*Math.sin(Math.PI*Math.min(1,v*1.15)))),nv=nt?nt*(DET>=1.5?6:4):DET>=1.5?12:8,Lf=[],M=[],Rt=[];
  for(let i=0;i<=nv;i++){const v=i/nv;Lf.push(S(-1,v));M.push(S(0,v));Rt.push(S(1,v))}
  const nrm=u=>{const e=.01,du=V3s(S(u+e,.45),S(u-e,.45)),dv=V3s(S(u,.47),S(u,.43));return V3.nz(V3.cr(du,dv))},nL=nrm(-.5),nR=nrm(.5),sc=q=>[q[0],-q[1]];let z=0;for(const q of M)z+=q[2];z/=M.length;
  const base=o.vr||col,P=pal7(base),PB=pal7(mix(shd(base,.2),'#b8c4a0',.3)),Pi=pal7(col),PiB=pal7(mix(shd(col,.2),'#b8c4a0',.3)),ink=shd(col,-.7);
  return{z:z+(o.zb||0),cast:false,fn:par=>{const g=G(par),half=(E1,n,s)=>{const back=n[2]<0,I=Math.max(.28,lightI(back?V3.sc(n,-1):n)*(o.ao||.84)),poly=E1.concat(M.slice().reverse()).map(sc);
      E('path',{d:nt?pD(poly)+'Z':smooth(poly),fill:toneAt(back?PB:P,I),stroke:ink,'stroke-width':.4,'stroke-opacity':.42,'stroke-linejoin':'round'},g);
      /* the green heart of a variegated leaf: an irregular band inside the margin */
      if(o.vr&&!LOD){const k=v=>.58+.12*Math.sin(v*17+s*2)+.06*Math.sin(v*41),inn=[];for(let i=1;i<nv*2;i++){const v=.03+.9*i/(nv*2);inn.push(S(s*k(v)*(1-.4*v*v),v))}
        E('path',{d:smooth(inn.concat(M.slice(1,-1).reverse()).map(sc)),fill:toneAt(back?PiB:Pi,I)},g)}return{back,I}};
    const zl=Lf.reduce((a,q)=>a+q[2],0),zr=Rt.reduce((a,q)=>a+q[2],0),hs=zl<zr?[[Lf,nL,-1],[Rt,nR,1]]:[[Rt,nR,1],[Lf,nL,-1]],res={};for(const[E1,n,s]of hs)res[s]=half(E1,n,s);
    if(LOD)return;const fr=!res[1].back||!res[-1].back,mc=fr?Pi.l1:PiB.d1;E('path',{d:smooth(M.map(sc),false),stroke:mc,'stroke-width':f(Math.max(.4,len*.014)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g);
    if(o.gloss&&fr){const s=res[1].I>res[-1].I?1:-1,q=[];for(let i=2;i<=8;i++){const p=S(s*.36,i/10);q.push([p[0],-p[1]])}E('path',{d:smooth(q,false),stroke:'#ffffff','stroke-width':f(len*wr*.07),'stroke-opacity':f(.26*o.gloss),fill:'none','stroke-linecap':'round'},g)}}}}

/* ---------- buisson ardent (Pyracantha coccinea and hybrids): stiff grey-brown stems armed with straight sharp thorns; alternate spurs, each with a tuft of small elliptic, finely crenate
   and glossy leaves; at the spur tips, crowded corymbs of small globose pomes (5–8 mm), each crowned by its dark calyx ---------- */
const L61_CW_PYR=[{id:'orange',n:'Orange (Orange Glow)',c:'#e4651c',y:'#e8b23a'},{id:'orange-vif',n:'Orange vif (Saphyr Orange)',c:'#ef7a22',y:'#e8c040'},{id:'rouge',n:'Rouge (Saphyr Rouge)',c:'#c4262a',y:'#e2862a'},
  {id:'rouge-orange',n:'Rouge orangé (Red Column)',c:'#d8401e',y:'#e0902c'},{id:'jaune',n:'Jaune (Soleil d\'Or)',c:'#e9b52a',y:'#d8c860'},{id:'jaune-or',n:'Jaune or (Saphyr Jaune)',c:'#f0c43a',y:'#d8cc66'}];
function l61Pyr(g,t,o){const cw=cwPick(L61_CW_PYR,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||6)*UPC,sc=['#2e2620','#54483e','#7c7064','#a89c90'],lc='#1e3a1a',dt=DET>=1.5,
    br=.33*UPC*Math.max(.85,Math.min(1.15,C/(6*UPC)))**.3;
  return bzShoot(g,t,o,{Lt:C*4.6,w0:3.4,w1:1.6,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the corymb: short rays round the tip of the spur, each forking into pedicels; the berries packed into a dome */
    const cor=n=>{const m=[['F',{l:C*.05,w1:1.3}]];for(let j=0;j<n;j++){const q=j/n;m.push(['[',{w:1.25}],['/',{a:j*137.5+R(-12,12)}],['&',{a:22+40*Math.sqrt(q)+R(-6,6)}],['F',{l:C*(.06+.12*Math.sqrt(q))*R(.85,1.15),w1:1.15}]);
        for(let k=0;k<3;k++)m.push(['[',{w:1.15}],['/',{a:k*120+R(-25,25)}],['&',{a:R(25,48)}],['F',{l:br*R(1.6,2.4),w1:1.15}],['B',{age:1+q}],[']',{}]);m.push(['F',{l:br*1.3,w1:1.15}],['B',{age:q}],[']',{}])}
      m.push(['F',{l:br*1.6,w1:1.15}],['B',{age:0}]);return m};
    const leafy=(og,len)=>{const H=V3.nz(V3.add(V3.sc(og.H,.35+R(0,.3)),V3.add(V3.sc(og.L,Math.cos(og.p.a)),V3.sc(og.U,Math.sin(og.p.a))))),c=mix(lc,'#2f5226',R(0,.45));
      parts.push(bzBlade(og.pos,H,og.H,len*R(.8,1.1),.38,c,{wp:LS_OVATE,teeth:dt?7:0,td:.04,droop:.14,arch:.05,fold:.22,vn:4,gloss:1,face:.45}))};
    const run=res=>{l45Axes(res,sc,parts);for(const og of res.organs){if(og.t==='B'){const m=Math.max(0,Math.min(1,op*1.3-og.p.age*.1+R(-.06,.04)));l61Berry(parts,og,cw,br*R(.9,1.08)*(.8+.2*Math.min(1,op*1.5)),m,{fl:.86,eye:'pome',gl:.85})}
      else if(og.t==='Lf')leafy(og,C*.38)}};
    /* a spur: a short shoot with its tuft of leaves, ending in a corymb (upper spurs) or a thorn */
    const tuft=(n,ph)=>{const m=[];for(let i=0;i<n;i++)m.push(['Lf',{a:ph+i*2.4}]);return m};
    const top=bzGrow(A,L-.5,0,4,[['F',{l:C*.18,w1:1.5}],...tuft(dt?5:4,R(0,6)),...cor(dt?9:7)],{w:1.7,seg:br,T:[0,1,0],e:.02,wig:.03});run(top);
    const nn=dt?7:6;for(let i=0;i<nn;i++){const l=L-C*(.42+.5*i)*R(.92,1.08);if(l<l0+5)continue;const az=(i*144+R(-20,20))*D,w=3.4+(1.6-3.4)*A.sOf(l),fr=i<4&&(i<2||rnd()<.6);
      const sp=bzGrow(A,l,az,R(38,55),fr?[['F',{l:C*R(.12,.22),w1:1.4}],...tuft(dt?4:3,R(0,6)),['F',{l:C*.06,w1:1.3}],...cor(dt?7:5)]:[['F',{l:C*R(.1,.16),w1:1.3}],...tuft(dt?4:3,R(0,6)),['F',{l:C*.1,w1:1.2,w0:1.3}]],{w:1.6,seg:br,T:[0,1,0],e:.03,wig:.04});run(sp);
      if(!fr){const ch=sp.chains[0],e=ch.pts[ch.pts.length-1],d=V3.nz(V3s(e,ch.pts[ch.pts.length-2])),tp=V3.add(e,V3.sc(d,C*.16));parts.push({z:e[2],fn:par=>bzSpikes(par,[[e,tp,1.6]],'#6a5a4a',1.6,{ink:'#2a2018'})})}
      /* the leaf that subtends the spur, and a thorn beside it */
      const{q,r}=l61At(A,l,az);parts.push(bzBlade(V3.add(q.p,V3.sc(r,w*.3)),V3.nz(V3.add(V3.sc(q.T,.6),r)),q.T,C*.4*R(.85,1.05),.38,lc,{wp:LS_OVATE,teeth:dt?7:0,td:.04,droop:.15,fold:.22,vn:4,gloss:1,face:.45}));
      l61Thorn(A,parts,l-C*.08,az+R(1.6,2.4),w,C*R(.14,.2),'#7a6a5a')}}})}

/* ---------- arbuste aux bonbons (Callicarpa bodinieri 'Profusion', C. dichotoma, C. japonica): long arching wands, opposite at each node a dense ball of tiny glossy drupes (3–4 mm)
   of a vivid metallic violet (white in 'Alba'), pressed into the leaf axils; sold leafless, or still with its opposite lanceolate, finely toothed leaves turning yellow ---------- */
const L61_CW_CAL=[{id:'violet',n:'Violet vif (Profusion)',c:'#9a4fb0',y:'#c8a0c8'},{id:'violet-fonce',n:'Violet profond (Issai)',c:'#76308a',y:'#b088b0'},{id:'lilas',n:'Lilas (C. dichotoma)',c:'#b47ac8',y:'#d0b4d4'},
  {id:'blanc',n:'Blanc nacré (Alba)',c:'#f2eee6',y:'#e4e8cc',g:'#b8c890'},{id:'violet-feuille',n:'Violet, feuillage d\'automne',c:'#9a4fb0',y:'#c8a0c8',lf:1}];
function l61Cal(g,t,o){const cw=cwPick(L61_CW_CAL,o),op=Math.max(.05,Math.min(1,o.op??1)),Lf=(o.cm||40)*UPC,sc=['#3a2a24','#62504a','#8a786e','#b4a49a'],dt=DET>=1.5,rb=.21*UPC*(dt?1:1.15);
  return bzShoot(g,t,o,{Lt:Lf*1.25,w0:3.8,w1:1.3,sc,bow:R(.16,.26)*(rnd()<.5?-1:1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=cw.id==='blanc'?'#7a7068':shd(cw.c,-.75);
    /* a ball of berries in an axil: pedicels from the node, all round its outer side */
    const ball=(p,rd,T,n,tip)=>{const res=l61Clu(p,V3.add(rd,V3.sc(T,.3)),T,n,rb,rb*(1.6+.06*n),{st:.3,a0:8,a1:110});l45Axes(res,sc,parts);
      for(const og of res.organs){const m=Math.max(0,Math.min(1,op*1.3-tip*.25+R(-.12,.05)));l61Berry(parts,og,cw,rb*R(.9,1.12)*(.82+.18*Math.min(1,op*1.4)),m,{fl:.95,eye:'dot',gl:.95,big:5,ink,lift:0})}};
    const leaf=(p,rd,T,len)=>parts.push(bzBlade(p,V3.nz(V3.add(V3.sc(T,.5),rd)),T,len,.34,mix('#8a9a3a','#c8b04a',R(0,.7)),{wp:LS_LANCE,teeth:dt?10:0,td:.05,droop:.25,arch:.05,fold:.2,vn:6,face:.45}));
    /* the nodes of an axis between la and lb: decussate pairs, each with its two balls (smaller toward the tip) */
    const nodes=(node,la,lb,step,ph0)=>{let i=0;for(let l=la;l<lb;l+=step*R(.9,1.1),i++){const q=node(l),u=(l-la)/Math.max(1,lb-la),ph=ph0+(i%2?90:0)+R(-12,12);
      for(const sd of[0,180]){const az=(ph+sd)*D,rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),n=Math.max(dt?5:4,Math.round((dt?26:7)*(1-.4*u)*R(.85,1.1)));
        ball(V3.add(q.p,V3.sc(rd,q.w*.3)),rd,q.T,n,u);if(cw.lf)leaf(V3.add(q.p,V3.sc(rd,q.w*.3)),rd,q.T,Lf*.2*(1-.4*u)*R(.85,1.05))}}};
    const S0w=s=>3.8+(1.3-3.8)*s,mainNode=l=>{const s=A.sOf(l),q=A.at(s);return{p:q.p,T:q.T,Fr:q.Fr,Sd:q.Sd,w:S0w(s)}};
    nodes(mainNode,Math.max(l0+5,L*.3,L-Lf*.95),L-3,Lf*(dt?.095:.11),R(0,90));
    /* one or two opposite side wands from the lower nodes, with their own balls */
    const ns=rnd()<.6?2:1;for(let i=0;i<ns;i++){const l=Math.max(L*.3,L-Lf*.9)+Lf*.16*i*R(.92,1.08);if(l<l0+8)continue;const az=(i*180+R(-20,20)+90)*D,ll=(L-l)*R(.42,.6);
      const res=bzGrow(A,l,az,R(28,40),[['F',{l:ll,w1:1.3}]],{w:2.2,seg:6,T:[0,1,0],e:.012,wig:.02});bzAxes(res,sc,parts);const P=res.chains[0].pts,ws=res.chains[0].ws,cum=[0];for(let j=1;j<P.length;j++)cum.push(cum[j-1]+V3l(V3s(P[j],P[j-1])));const Lc=cum[cum.length-1];
      const node=l2=>{let j=1;while(j<P.length-1&&cum[j]<l2)j++;const u=(l2-cum[j-1])/((cum[j]-cum[j-1])||1),p=V3.add(P[j-1],V3.sc(V3s(P[j],P[j-1]),u)),T=V3.nz(V3s(P[j],P[j-1])),Sd=V3.nz(V3.cr(T,[0,0,1])),Fr=V3.cr(Sd,T);return{p,T,Fr,Sd,w:ws[j-1]+(ws[j]-ws[j-1])*u}};
      nodes(node,Lc*.2,Lc-2,Lf*(dt?.1:.12),R(0,90))}}})}

/* ---------- cotonéaster (Cotoneaster horizontalis and kin): flat sprays branched like a fish's bones, alternate branchlets in one plane, set with two ranks of small rounded glossy leaves;
   small red pomes (5–7 mm), one or two at a node, on very short stalks along the branchlets ---------- */
const L61_CW_COT=[{id:'rouge',n:'Rouge (horizontalis)',c:'#c0262c',y:'#e0862a'},{id:'rouge-vif',n:'Rouge vif (Coral Beauty)',c:'#d63426',y:'#e2902c'},{id:'orange',n:'Orange (franchetii)',c:'#e0702a',y:'#e2b040'},
  {id:'creme',n:'Jaune crème (Rothschildianus)',c:'#ead9a0',y:'#d8dc98'},{id:'vert',n:'Vert (baies vertes)',c:'#9fae5a',y:'#a8b860'}];
function l61Cot(g,t,o){const cw=cwPick(L61_CW_COT,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||6)*UPC,sc=['#2a1c1a','#4e3632','#765a52','#a2867c'],dt=DET>=1.5,lc='#1e3a1c',br=.29*UPC,ll=1.1*UPC;
  return bzShoot(g,t,o,{Lt:C*3.8,w0:3,w1:1.4,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ph=R(-.5,.5),N=V3.nz(V3.add(A.at(.7).Fr,[0,.45,0]));
    /* a branchlet: nodes alternate in the plane, each a leaf on its side, sometimes a berry; branchlets of the next order from the lower nodes */
    const twig=(len,lv,n)=>{const m=[],st=len/n;for(let i=0;i<n;i++){const s=i%2?1:-1;m.push(['F',{l:st*R(.85,1.15),w1:Math.max(1.15,(lv?1.3:1.8)*(1-.4*i/n))}],['Lf',{s,u:i/n}]);if(rnd()<(dt?.55:.45)&&i<n-1)m.push(['B',{s:-s,u:i/n}]);
        if(lv<1&&i%2===0&&i<n-2)m.push(['[',{w:1.3}],['/',{a:R(-30,30)}],['&',{a:s*R(45,58)}],...twig(len*(.48-.3*i/n),lv+1,dt?Math.max(3,Math.round(n*.5)):2),[']',{}])}
      m.push(['F',{l:st*.6,w1:1.15}],['Lf',{s:0,u:1}]);return m};
    const run=res=>{l45Axes(res,sc,parts);for(const og of res.organs){if(og.t==='Lf'){const H=V3.nz(V3.add(V3.sc(og.H,og.p.s?.55:1),V3.sc(og.U,og.p.s)));
        parts.push(bzBlade(og.pos,H,V3.add(N,V3.add(V3.sc(og.L,R(-.4,.4)),V3.sc(og.H,R(-.3,.3)))),ll*R(.85,1.1)*(1-.3*og.p.u),.72,mix(lc,'#2c4a22',R(0,.5)),{wp:LS_OVATE,droop:.08,arch:.05,vn:dt?3:0,gloss:dt?1.1:0,fold:.25}))}
      else if(og.t==='B'){const og2={pos:og.pos,H:V3.nz(V3.add(V3.sc(og.U,og.p.s),V3.add(V3.sc(og.L,.5),V3.sc(og.H,.3))))},m=Math.max(0,Math.min(1,op*1.3-og.p.u*.2+R(-.08,.04)));
        l61Berry(parts,og2,cw,br*R(.9,1.1)*(.8+.2*Math.min(1,op*1.5)),m,{fl:.88,eye:'pome',gl:.9,lift:.1})}}};
    /* the main axis ends in its own branchlet; below, alternate branchlets left and right in the plane of the spray */
    run(bzGrow(A,L-.5,0,4,twig(C*.7,1,dt?7:5),{w:1.6,seg:3,T:[0,1,0],e:.01,wig:.02}));
    const nb=dt?7:4;for(let i=0;i<nb;i++){const l=L-C*(.32+.42*i)*R(.94,1.06);if(l<l0+5)continue;const s=i%2?1:-1,az=Math.PI/2*s+ph+R(-.45,.45),len=C*(.75+.45*Math.min(1,i/3))*R(.9,1.1);
      run(bzGrow(A,l,az,R(60,72),twig(len,0,dt?8:5),{w:1.9,seg:3,T:[0,1,0],e:.008,wig:.02}))}}})}

/* ---------- houx à baies (Ilex aquifolium and I. × meserveae): stout green stems; alternate, leathery, very glossy dark leaves, waved and edged with sharp spines (cream- or gold-margined
   in the variegated cultivars); clusters of round red berries (8–10 mm) on short stalks in the leaf axils, a dark stigma at their tip ---------- */
const L61_CW_HOL=[{id:'rouge',n:'Rouge (J.C. van Tol)',c:'#b51d24',y:'#c87a2a'},{id:'rouge-vif',n:'Rouge vif (Alaska)',c:'#cc2228',y:'#d0802a'},{id:'jaune',n:'Jaune (Bacciflava)',c:'#e2b62c',y:'#c8c450'},
  {id:'orange',n:'Orange (Amber)',c:'#e07a2a',y:'#d0a840'},{id:'panache-argent',n:'Panaché crème, baies rouges (Argentea Marginata)',c:'#c01e26',y:'#c87a2a',vr:'#ecead0'},
  {id:'panache-or',n:'Panaché doré, baies rouges (Golden King)',c:'#c01e26',y:'#c87a2a',vr:'#e2c866'}];
const L61_HOLW=prof([[0,.1],[.1,.6],[.35,1],[.65,.9],[.88,.45],[1,.04]]);
function l61Hol(g,t,o){const cw=cwPick(L61_CW_HOL,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||5)*UPC,sc=['#1e2a18','#34442a','#56663e','#86966a'],dt=DET>=1.5,lc='#17301a',rb=.42*UPC*Math.max(.9,Math.min(1.1,C/(5*UPC)))**.3;
  return bzShoot(g,t,o,{Lt:C*5.2,w0:3.8,w1:1.8,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=shd(cw.c,-.7);
    const leaf=(p,H,T,len)=>{const sp=rnd()<.8;parts.push(l61Blade(p,H,T,len,.5,mix(lc,'#24442a',R(0,.4)),{wp:L61_HOLW,teeth:sp?Math.round(R(4,6)):0,td:.26,wave:sp?.09:.03,droop:.12,arch:.07,fold:.28,vn:dt?5:0,gloss:1.1,face:.7,vr:cw.vr,ao:.9}))};
    const berries=(p,rd,T,n,u)=>{const res=l61Clu(p,V3.add(rd,V3.sc(T,.15)),T,n,rb,rb*1.5,{st:.4,a0:20,a1:70});l45Axes(res,['#24301a','#3e4e2a','#5e6e3e','#8a9a68'],parts);
      for(const og of res.organs){const m=Math.max(0,Math.min(1,op*1.3-u*.15+R(-.08,.04)));l61Berry(parts,og,cw,rb*R(.9,1.08)*(.8+.2*Math.min(1,op*1.4)),m,{fl:1,eye:'dot',gl:.95,ink,lift:.1})}};
    /* the leafy tip (this year's growth) and, lower, the older wood with berry clusters in the axils; leaves all along, spirally (2/5) */
    const step=C*(dt?.3:.36),n=Math.floor((Math.min(L-l0,C*5.4)-6)/step);for(let i=0;i<n;i++){const l=L-2-step*i*R(.92,1.08);if(l<l0+5)break;const az=(i*144+R(-15,15))*D,s=A.sOf(l),{q,r}=l61At(A,l,az),w=3.8+(1.8-3.8)*s,el=40+i*4+R(-6,6);
      const H=V3.nz(V3.add(V3.sc(q.T,Math.cos(Math.min(85,el)*D)),V3.sc(r,Math.sin(Math.min(85,el)*D)))),len=C*R(1.05,1.3)*(i<2?.75:1);leaf(V3.add(q.p,V3.sc(r,w*.3)),H,q.T,len);
      if(i>=3&&i<n-1&&rnd()<.85){const az2=az+R(-.5,.5),{r:r2}=l61At(A,l-C*.04,az2),q2=A.at(A.sOf(l-C*.04));berries(V3.add(q2.p,V3.sc(r2,w*.3)),r2,q2.T,dt?Math.round(R(4,7)):Math.round(R(3,4.4)),i/n)}}
    /* a side shoot from below, with its own leaves */
    const l=L-C*R(2.3,2.8);if(l>l0+8){const az=R(0,6),res=bzGrow(A,l,az,R(30,42),[['F',{l:C*.5,w1:2.2}],['Lv',{}],['F',{l:C*.4,w1:1.9}],...(dt?[['Lv',{}]]:[]),['F',{l:C*.35,w1:1.6}],['Lv',{}],['Lv',{t:1}]],{w:2.6,seg:4,T:[0,1,0],e:.02,wig:.03});bzAxes(res,sc,parts);
      let k=0;for(const og of res.organs){const a=k++*2.5+R(-.2,.2),rd=V3.add(V3.sc(og.L,Math.cos(a)),V3.sc(og.U,Math.sin(a)));leaf(og.pos,og.p.t?og.H:V3.nz(V3.add(V3.sc(og.H,.6),rd)),V3.add(og.U,[0,.6,0]),C*R(.95,1.2)*(og.p.t?.7:1))}}}})}

/* ---------- sorbier (Sorbus aucuparia, S. hupehensis, S. cashmiriana, 'Joseph Rock'): a stout stem; pinnate leaves (6–7 pairs of oblong serrate leaflets and one at the tip);
   at its top a heavy flat-topped corymb of many small round pomes (7–9 mm), orange-red, red, pink, white or yellow by the variety ---------- */
const L61_CW_SOR=[{id:'orange',n:'Orange vif (aucuparia)',c:'#e5602a',y:'#e8b03a'},{id:'rouge',n:'Rouge (Autumn Spire)',c:'#c62a28',y:'#e2802a'},{id:'corail',n:'Rouge corail (Rossica Major)',c:'#e0442a',y:'#e8a03a'},
  {id:'rose',n:'Rose (Pink Pagoda, hupehensis)',c:'#e8a3b6',y:'#eedbd4',g:'#c8cca0'},{id:'blanc',n:'Blanc (cashmiriana)',c:'#f4f1ea',y:'#eeecd4',g:'#c8d0a8'},{id:'jaune',n:'Jaune (Joseph Rock)',c:'#efd47a',y:'#e4dc98'}];
function l61Sor(g,t,o){const cw=cwPick(L61_CW_SOR,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||12)*UPC,sc=['#2c2420','#504640','#7a6e66','#a89c94'],dt=DET>=1.5,rb=.4*UPC*Math.max(.9,Math.min(1.1,C/(12*UPC)))**.3;
  return bzShoot(g,t,o,{Lt:C*2.4,w0:4.2,w1:2.6,sc,bow:R(-.06,.06),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the corymb: rays from the top of the peduncle, the outer ones longer and lower so that all the berries reach one rounded plane; each ray forks twice */
    const np=dt?9:7,mods=[['F',{l:C*.08,w1:2}]];for(let j=0;j<np;j++){const q=(j+.5)/np,el=14+58*Math.sqrt(q)+R(-6,6),l1=C*(.14+.26*Math.sqrt(q))*R(.9,1.1);
      mods.push(['[',{w:1.7}],['/',{a:j*137.5+R(-12,12)}],['&',{a:el}],['F',{l:l1,w1:1.4}]);const n2=dt?3:2;
      for(let k=0;k<n2;k++){mods.push(['[',{w:1.3}],['/',{a:k*360/n2+R(-30,30)}],['&',{a:R(24,42)}],['F',{l:C*R(.09,.14),w1:1.15}]);for(let m=0;m<3;m++)mods.push(['[',{w:1.15}],['/',{a:m*120+R(-25,25)}],['&',{a:R(25,45)}],['F',{l:rb*R(1.5,2.3),w1:1.15}],['B',{q}],[']',{}]);mods.push([']',{}])}
      mods.push(['F',{l:rb*1.5,w1:1.15}],['B',{q}],[']',{}])}
    const top=bzGrow(A,L-.5,0,3,mods,{w:2.2,seg:rb,T:[0,1,0],e:.035,wig:.03});l45Axes(top,sc,parts);
    for(const og of top.organs){const m=Math.max(0,Math.min(1,op*1.3-og.p.q*.12+R(-.08,.04)));l61Berry(parts,og,cw,rb*R(.9,1.08)*(.8+.2*Math.min(1,op*1.5)),m,{fl:.9,eye:'pome',gl:cw.id==='blanc'?.6:.85,lift:.3})}
    /* pinnate leaves below: a rachis with its pairs of toothed leaflets and one at the tip */
    const leaf=(l,az,len)=>{const pairs=dt?6:5,m=[['F',{l:len*.14,w1:1.4}]];for(let i=0;i<pairs;i++)m.push(['Lp',{i}],['F',{l:len*.86/pairs,w1:Math.max(1.15,1.4-.3*i/pairs)}]);m.push(['Lt',{}]);
      const res=bzGrow(A,l,az,R(45,60),m,{w:1.6,seg:5,T:[0,-1,0],e:.025,wig:.02}),lc=rnd()<.25?mix('#3e5a24','#a8802a',R(.2,.6)):'#2a4a20';l45Axes(res,['#283a18','#3e5a28','#5e7c3c','#8aa868'],parts);
      for(const og of res.organs){const u=og.t==='Lt'?1:og.p.i/pairs,lf=len*.3*(og.t==='Lt'?.85:.8+.25*Math.sin(Math.PI*Math.min(1,u*1.2+.2)));
        if(og.t==='Lt')parts.push(bzBlade(og.pos,og.H,og.U,lf,.3,lc,{wp:LS_LANCE,teeth:dt?9:6,td:.08,droop:.12,fold:.2,vn:dt?6:0,face:.4}));
        else for(const s of[-1,1])parts.push(bzBlade(og.pos,V3.nz(V3.add(V3.sc(og.L,s),V3.sc(og.H,.45))),og.U,lf,.3,mix(lc,'#3a6226',R(0,.3)),{wp:LS_LANCE,teeth:dt?9:6,td:.08,droop:.16,fold:.2,vn:dt?6:0,face:.4}))}};
    const nl=dt?3:2;for(let i=0;i<nl;i++){const l=L-C*(.3+.5*i)*R(.92,1.08);if(l<l0+6)continue;leaf(l,(i*150+R(-25,25))*D,C*R(1.05,1.25))}}})}

/* ---------- registers: drawers, colourways, trade grades in the recipe's unit (the corymb's width; for the callicarpa the wand's length; for the holly the leaf; for the cotoneaster the spray),
   and how the composer treats them: berry stems, the callicarpa a line like the winterberry ---------- */
Object.assign(GH,{'buisson-ardent':l61Pyr,'callicarpa':l61Cal,'cotoneaster':l61Cot,'houx-a-baies':l61Hol,'sorbier-baies':l61Sor});
Object.assign(CWS,{'buisson-ardent':L61_CW_PYR,'callicarpa':L61_CW_CAL,'cotoneaster':L61_CW_COT,'houx-a-baies':L61_CW_HOL,'sorbier-baies':L61_CW_SOR});
Object.assign(SZG,{'buisson-ardent':[4,5,6,6,7],'callicarpa':[40,50,50,60,70],'cotoneaster':[4,5,6,6,7],'houx-a-baies':[4,5,5,6],'sorbier-baies':[9,10,12,12,14]});
Object.assign(GHI,{'buisson-ardent':{form:'baie',size:1.3,k:'plant',rk:.85,tip:.8},'callicarpa':{form:'ligne',size:1,k:'plant',self:65*UPC,tip:.9,fx:3*UPC},'cotoneaster':{form:'baie',size:1.2,k:'plant',rk:.85,tip:.75},
  'houx-a-baies':{form:'baie',size:1.3,k:'plant',rk:.88,tip:.85},'sorbier-baies':{form:'baie',size:1.5,k:'plant',rk:.9,tip:.7}});
