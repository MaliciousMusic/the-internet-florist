/* ================= Serre, lot 79 — persistants : pittosporum tobira, salal, huckleberry, olivier, lentisque ================= */
/* ---------- shared: the lot's grower is lot 24's (fgGrow) with one more gesture, a main axis that zigzags softly from node to node (zig: the angle of each swing, radians);
   the blades are lot 35's (g35Leaf, 3D halves, gloss, variegation), their outline from a width profile, finely toothed when the species is; fruits are lot 20's (bzFruit) ---------- */
function l79Grow(k,A,S){if(!S.zig)return fgGrow(k,A,S);const Le=A.L,f0=A.at(A.s0),mid=A.at(.6),Fr=V3.nz(V3.add(mid.Fr,V3.sc(mid.T,S.lift??.35))),wAt=l=>S.w0+(S.w1-S.w0)*Math.min(1,l/Le),ph=S.phy||'spiral';
  /* each internode aims off the spine's tangent, to one side then the other, and turns there gently (k small: a curve, never an elbow) */
  const aimF=(l,len,i)=>{const a=A.at(A.sOf(l+len*.6)),z=S.zig*(i%2?1:-1)*Math.min(1,(Le-l)/(S.li*2));return{l:len,w1:wAt(l+len),aim:V3.nz(V3.add(V3.sc(a.T,Math.cos(z)),V3.sc(a.Sd,Math.sin(z)))),k:S.zk??.3}};
  const tipLv=o=>S.tipLv===0?[]:[['[',{}],['/',{a:R(-30,30)}],['&',{a:16}],['Lv',{u:1,o,j:0,tip:1}],[']',{}]].concat(ph==='spiral'&&rnd()<.5?[]:[['[',{}],['/',{a:180+R(-30,30)}],['&',{a:24}],['Lv',{u:.96,o,j:1,tip:1}],[']',{}]]);
  const rules={A:p=>{const li=S.li*(1-(S.liT??.3)*p.l/Le)*R(.85,1.15);if(p.l+li>Le-S.li*.35)return[['F',aimF(p.l,Math.max(1,Le-p.l),p.i)],['T',{u:1,o:0}],...tipLv(0)];return[['F',aimF(p.l,li,p.i)],['N',{u:(p.l+li)/Le,i:p.i,o:0}],['A',{l:p.l+li,i:p.i+1}]]},
    B:p=>{const sd=S.side,li=S.li*(sd.li??.8)*R(.85,1.15);if(p.l+li>p.Lb-S.li*.3)return[['F',{l:Math.max(1,p.Lb-p.l),w1:p.w*.45,e:sd.e??-.012}],['T',{u:1,o:1}],...tipLv(1)];
      return[['F',{l:li,w1:p.w*(1-.5*(p.l+li)/p.Lb),e:sd.e??-.012}],['N',{u:p.u0+(1-p.u0)*(p.l+li)/p.Lb,b:(p.l+li)/p.Lb,i:p.i+p.k,o:1}],['B',Object.assign({},p,{l:p.l+li,i:p.i+1})]]},
    N:p=>{const out=[],i=p.i,r0=ph==='alt2'?(i%2?90:-90):ph==='opp'?(i%2?90:0):i*137.5+(S.ph0||0);if(S.node)out.push(['Nd',{u:p.u,o:p.o}]);
      if(p.o||p.u>=S.uL){const nl=ph==='opp'?2:1;for(let j=0;j<nl;j++)if(rnd()<(S.lp??1))out.push(['[',{}],['/',{a:r0+j*180+R(-(S.rj??14),S.rj??14)}],['&',{a:S.la+R(-8,8)}],['Lv',{u:p.u,b:p.b,o:p.o,j}],[']',{}])}
      const sd=S.side;if(!p.o&&sd&&p.u>=sd.u0&&p.u<=sd.u1){const ns=ph==='opp'&&sd.pair?2:1;for(let j=0;j<ns;j++)if(rnd()<sd.p){const Lb=Le*(1-p.u)*sd.len*R(.75,1.1);if(Lb<S.li*1.6)continue;
        const w=wAt(p.u*Le)*.62;out.push(['[',{w}],['/',{a:r0+j*180+(ph==='opp'?0:R(-25,25))}],['&',{a:sd.ang+R(-8,8)}],['$',{v:Fr}],['^',{a:R(-(sd.tilt??0),sd.tilt??0)}],['B',{l:0,Lb,i:0,k:j*5+3,u0:p.u,w}],[']',{}])}}
      const ax=S.axil;if(ax&&p.u>=(ax.u0||0)&&(p.o||p.u>=S.uL)&&rnd()<ax.p)out.push(['[',{}],['/',{a:r0+(ph==='opp'?90:180)+R(-20,20)}],['&',{a:(ax.ang??30)+R(-6,6)}],['X',{u:p.u,o:p.o}],[']',{}]);
      return out}};
  const steps=2*Math.ceil(Le/(S.li*.55))+8,res=lsTurtle(lsDerive([['A',{l:A.l0,i:0}]],rules,steps),{p:f0.p,H:f0.T,U:f0.Fr,w:wAt(A.l0),seg:S.seg||12,T:A.up,e:0,wig:S.wig??.02});
  for(const ch of res.chains)ch.c=S.cols;const parts=[];lsChainParts(res.chains,[0,0,0],S.cols,parts,{piece:S.piece||9});
  for(const og of res.organs){const fn=og.t==='Lv'?S.leaf:og.t==='T'?S.tip:og.t==='X'?S.axDraw:og.t==='Nd'?S.nodeDraw:null;if(!fn)continue;const r=fn(og.t==='Lv'?fgFace(og,Fr,S.face??.75):og,og.p,Fr);if(r)parts.push(...[].concat(r))}
  if(S.post)S.post(res,parts,Fr);drawParts(k,parts);
  const b=res.chains[0].pts[0],T0=f0.T,l=Math.hypot(T0[0],T0[1])||1;return{k,bw:Math.max(wAt(A.l0)*1.15,2.4),bw1:wAt(A.l0),bc:S.cols,neck:[b[0],-b[1]],nd:[-T0[0]/l,T0[1]/l]}}
/* an outline from a width profile (wr its width ratio); nt teeth (serrate: each tooth's point leans toward the tip, td its depth) from y0 to y1; fewer at the app's detail */
function l79Prof(wp,wr,n=12,nt=0,td=.1,y0=.14,y1=.94){if(nt&&DET<1.5)nt=Math.ceil(nt*.6);if(!nt)return g35Prof(wp,wr,n);const R0=[[wp(0)*wr/2,0]],st=(y1-y0)/nt;
  for(let y=.04;y<y0;y+=.05)R0.push([wp(y)*wr/2,y]);for(let i=0;i<nt;i++){const ya=y0+st*i,yb=ya+st*.72;R0.push([wp(ya)*wr/2*(1-td),ya],[wp(yb)*wr/2,yb])}
  for(let y=y1+.02;y<1;y+=.03)R0.push([wp(y)*wr/2,y]);R0.push([0,1]);return{R:R0,L:R0.map(([x,y])=>[-x,y])}}
/* a stroke along view-space points, never finer than 1.15 (it reads joined at the app's detail) */
const l79Line=(par,P,w,c)=>E('path',{d:'M'+P.map(p=>f(p[0])+','+f(-p[1])).join('L'),stroke:c,'stroke-width':f(Math.max(1.15,w)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
const l79Low=P=>P.reduce((m,p)=>Math.min(m,p[1]),1e9);
const l79Op=o=>Math.max(.05,Math.min(1,o.op??1));
/* a small hanging cluster from an axil: its stalk (n0 points falling under the weight, length Lr), fruits on short pedicels along its last part, each from the stalk; col(i) the fruit's colour */
function l79Cluster(og,Lr,n,rr,col,o={}){const H=V3.nz(og.H),pts=[og.pos];let d=V3.nz(V3.add(H,[0,o.lift??.05,0])),p=og.pos;
  for(let i=0;i<8;i++){d=V3.nz(V3.add(V3.sc(d,.8),[0,-(o.fall??.2),0]));p=V3.add(p,V3.sc(d,Lr/8));pts.push(p)}if(o.lim!=null&&l79Low(pts)<o.lim+rr*2)return null;
  const out=[],sc=o.sc||'#5a3a2a',z0=pts.reduce((a,q)=>a+q[2],0)/pts.length;out.push({z:z0-.4,cast:false,fn:g=>l79Line(g,pts,o.w??1.3,sc)});
  for(let i=0;i<n;i++){const q=n>1?i/(n-1):1,j=Math.max(1,Math.min(8,Math.round(8*((o.from??.35)+(1-(o.from??.35))*q)))),b=pts[j],T=V3.nz(V3s(pts[j],pts[j-1])),[X,Y]=fgCross(T),a=(i*137.5+R(-25,25))*D,
      rd=V3.nz(V3.add(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),V3.sc(T,.25))),r=rr*R(.88,1.08)*(i===n-1&&o.top?1.05:1),pl=(o.ped??.9)*rr,c=V3.add(b,V3.sc(rd,pl+r*.85)),ax=V3.nz(V3.add(rd,[0,-.35,0])),cl=col(i,q);
    out.push({z:c[2],fn:g=>{l79Line(g,[b,V3.add(b,V3.sc(rd,pl+r*.3))],1.15,sc);bzFruit(g,c,ax,r*(o.egg?1.12:1),r,cl,{gl:o.gl??.85,egg:o.egg||0,eye:DET>=1.5&&o.eye?o.eye:null})}})}
  return out}

/* ---------- Japanese pittosporum (Pittosporum tobira, Pittosporaceae, « pittosporum du Japon »): stout grey-brown shoots, branching in tiers; the leaves alternate but crowded in false whorls
   at the tips of the shoots, obovate (5–10 cm), the tip rounded, the base narrowed into a short petiole, thick and leathery, dark glossy green with a pale midrib, the margin rolled under;
   'Variegatum' grey-green with an irregular cream margin. Sold as cut stems 40–70 cm, the rosettes of leaves on short side shoots ---------- */
const CW_L79PIT=[{id:'vert',n:'Vert brillant (type)',c:'#35552c',b:'#8a9c74',y:'#5c8038'},{id:'variegatum',n:'Panaché crème (Variegatum)',c:'#e4dcb4',b:'#d0d2b8',g:'#8d9b84',v:1},
  {id:'vert-tendre',n:'Vert tendre (jeunes pousses)',c:'#5a7e3a',b:'#9aae80',y:'#86a44c'}];
const L79_PITW=prof([[0,.16],[.12,.34],[.4,.66],[.68,.96],[.82,1],[.92,.86],[.98,.5],[1,0]]),L79_PITST=['#3a342c','#5e564a','#857c6e','#aaa294'];
function l79Pit(g,t,o){const cw=fgCw(CW_L79PIT,o),op=l79Op(o),cm0=7,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l79pit',()=>{const Lt=o.spine?blen(o.spine):48*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),sh=l79Prof(L79_PITW,.44,14);
    const vr=cw.v?{c:cw.g,k:y=>.62+.1*Math.sin(y*11+R(0,1))}:null;
    const r=fgGrow(k,A,{li:1.7*UPC*kl,liT:.75,w0:4.4*kl,w1:1.6,cols:L79_PITST,uL:o.spine?.8:.78,phy:'spiral',la:50,face:.55,lift:.35,seg:9,wig:.03,
      side:{u0:.16,u1:.72,p:.7,len:.3,ang:42,li:.36,e:-.004,tilt:30},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u;if(p.o&&u<.42)return null;const sz=(p.tip?.5:fgSz(p,.86))*kl*(.85+.2*Math.min(1,u)),L=cm0*UPC*sz*R(.86,1.1),young=u>.9&&cw.y?(1-op)*.5+.25:0,
          c=young?mix(cw.c,cw.y,young):cw.c,F=g35Fr(og),pl=L*.06,P0=V3.add(F.P0,V3.sc(F.H,pl));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.06,.06)),.5),cw.b,{lim:g35Lim(o),fold:.08,arch:.06,droop:.12,cup:-.12,tw:R(-.3,.3),sm:1,vr,gloss:cw.v?.35:.95,dI:.02,
          veins:[[[0,0],[0,.95]]],vAll:1,vc:cw.v?'#eee8cc':mix(c,'#d8e0b0',.55),vw:.55,vo:.6})]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- salal (Gaultheria shallon, Ericaceae, « lemon leaf »): an evergreen shrub of the Pacific coast whose stems zigzag from leaf to leaf, reddish and glandular-hairy;
   leaves alternate in two ranks, broadly ovate (5–10 cm), the tip shortly pointed, the base rounded, thick and leathery, glossy dark green above, paler beneath,
   finely and sharply serrate, the veins netted; the trade sells the full stems (« salal », « lemon leaf ») and the tender terminal shoots (« salal tips ») ---------- */
const CW_L79GAU=[{id:'vert-fonce',n:'Vert profond (lemon leaf)',c:'#2c4a2c',b:'#748a5e'},{id:'vert',n:'Vert (salal)',c:'#3d5a35',b:'#7f9468'},
  {id:'tips',n:'Vert tendre (salal tips)',c:'#56703a',b:'#93a676',y:'#86a048',tips:1}];
const L79_GAUW=prof([[0,.46],[.1,.8],[.3,1],[.5,.96],[.72,.74],[.9,.36],[1,0]]),L79_GAUST=['#4a2a20','#74402e','#9a5e42','#bc8466'];
/* the midrib and four pairs of arching side veins, kept inside the blade (their reach from its half-width at each height) */
const L79_GAUV=[[[0,0],[0,.96]],...[.14,.3,.46,.62].flatMap(y=>[1,-1].map(s=>[0,.5,.78].map(t=>[s*t*.33*.72*L79_GAUW(Math.min(1,y+.2*t)),y+.2*t])))];
function l79Gau(g,t,o){const cw=fgCw(CW_L79GAU,o),op=l79Op(o),cm0=8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l79gau',()=>{const Lt=o.spine?blen(o.spine):(cw.tips?30:45)*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),shs=[0,1].map(()=>l79Prof(L79_GAUW,.66,14,26,.03));
    const r=l79Grow(k,A,{li:(cw.tips?2.2:2.8)*UPC*kl,liT:.4,w0:3.4*kl,w1:1.3,cols:L79_GAUST,uL:o.spine?.16:.14,phy:'alt2',la:56,face:.5,lift:.3,seg:7,wig:.02,zig:.3,zk:.4,
      side:cw.tips?null:{u0:.25,u1:.7,p:.4,len:.42,ang:38,li:.8,e:-.006,tilt:20},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.42:fgSz(p,.78))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.88,1.08),young=cw.y&&u>.7?(u-.7)*2:0,c=young?mix(cw.c,cw.y,young):cw.c,
          F=g35Fr(og),pl=L*.1,P0=V3.add(F.P0,V3.sc(F.H,pl)),sh=shs[Math.floor(rnd()*2)];
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.07,.07)),.5),cw.b,{lim:g35Lim(o),fold:.1,arch:.07,droop:.14,cup:.04,wave:.02,wk:3,tw:R(-.25,.25),gloss:.45,dI:.02,
          veins:L79_GAUV,vc:mix(c,'#c8d4a0',.4),vw:.4,vo:.45}),g35Pet(F.P0,V3.add(P0,V3.sc(F.H,L*.04)),1.3*kl+.3,L79_GAUST[1])]}});
    open(k,t,1000,0,.4);return r})}

/* ---------- evergreen huckleberry (Vaccinium ovatum, Ericaceae, « myrtille de Californie », « huckleberry »): long arching sprays, the young twigs red and finely hairy;
   leaves alternate in two flat ranks, crowded, ovate to lance-ovate (2–5 cm), pointed, sharply serrate, leathery and glossy dark green, the new growth bronze-red;
   in autumn round berries (5–9 mm), purple-black, a few together in the axils. Sold as foliage sprays 40–60 cm ---------- */
const CW_L79VAC=[{id:'vert',n:'Vert brillant, tiges rouges',c:'#2a4a2c',b:'#6c845c',y:'#a03828'},{id:'pousses-rouges',n:'Vert à pousses bronze-rouge',c:'#34502e',b:'#74885e',y:'#a8402c',ry:1},
  {id:'baies',n:'Vert, baies noires',c:'#2e4630',b:'#6c845c',y:'#a03828',fr:'#2a1e2e',f:1}];
const L79_VACW=prof([[0,.4],[.1,.78],[.3,1],[.55,.86],[.8,.5],[1,0]]),L79_VACST=['#4a1a16','#7a2a22','#a8443a','#cc6a5a'];
function l79Vac(g,t,o){const cw=fgCw(CW_L79VAC,o),op=l79Op(o),cm0=3,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l79vac',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.2,.32)),sh=l79Prof(L79_VACW,.5,12,10,.08),lim=g35Lim(o);let nb=0;
    const r=fgGrow(k,A,{li:1.05*UPC*kl,liT:.3,w0:3*kl,w1:1.2,cols:L79_VACST,uL:o.spine?.14:.1,phy:'alt2',la:62,face:.6,lift:.2,seg:6,wig:.03,
      side:{u0:.15,u1:.82,p:.5,len:.4,ang:44,li:.9,e:-.035,tilt:16},axil:cw.f?{u0:.2,p:.4,ang:55}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.45:fgSz(p,.8))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.12),young=u>.78?(cw.ry?.55:.3)+.3*(1-op)*(u-.78)*4:0,c=mix(cw.c,cw.y,Math.min(.85,young)),
          F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,L*.05));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.06,.06)),.5),cw.b,{lim,fold:.12,arch:.05,droop:.08,cup:.03,tw:R(-.2,.2),gloss:.8,dI:.02,veins:[[[0,0],[0,.95]]],vc:mix(c,'#b8c890',.4),vw:.4,vo:.45})]},
      axDraw:og=>{if(nb>=12)return null;const n=2+Math.floor(rnd()*3),cl=l79Cluster(og,.7*UPC*kl,n,.4*UPC*kl,(i,q)=>mix(cw.fr,'#5a3050',op<.6&&q>.6?.5:R(0,.15)),{lim,sc:L79_VACST[1],ped:.6,from:.7,fall:.3,gl:.55,
          eye:(q,tp,a,r2)=>E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(r2*.22),fill:'#1a1216',opacity:.7},q)});if(cl)nb++;return cl}});
    open(k,t,1000,0,.4);return r})}

/* ---------- olive (Olea europaea, Oleaceae, « olivier »): slender twigs, grey and four-angled when young; leaves opposite and decussate, narrowly lanceolate (4–8 cm, 1–1.5 cm wide),
   tipped with a fine point, leathery, dull grey-green above, silvery-white beneath with scales, the margin rolled under; drupes ellipsoid (1.5–3 cm) on short stalks, single or a few together
   in the axils, green ripening through violet to black, glossy. Sold as foliage branches and, in autumn, fruiting branches ---------- */
const CW_L79OLE=[{id:'vert-argent',n:'Gris-vert argenté',c:'#6c7a58',b:'#c8ccc0'},{id:'olives-vertes',n:'Gris-vert, olives vertes',c:'#71805a',b:'#c8ccc0',fr:'#8e9a3a',f:1},
  {id:'olives-noires',n:'Gris-vert, olives noires',c:'#66734f',b:'#c4c8bc',fr:'#241c22',f:1,mix:1},{id:'vert-fonce',n:'Vert sombre (Picual)',c:'#4f6040',b:'#b8beb0'}];
const L79_OLEW=prof([[0,.16],[.08,.5],[.28,.92],[.45,1],[.68,.8],[.88,.4],[.97,.12],[1,0]]),L79_OLEST=['#4a463a','#6e6a5c','#948e7e','#bab4a6'];
function l79Ole(g,t,o){const cw=fgCw(CW_L79OLE,o),op=l79Op(o),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l79ole',()=>{const Lt=o.spine?blen(o.spine):58*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.14,.26)),sh=l79Prof(L79_OLEW,.2,12),lim=g35Lim(o);let nf=0;
    const r=fgGrow(k,A,{li:1.9*UPC*kl,liT:.35,w0:3.6*kl,w1:1.25,cols:L79_OLEST,uL:o.spine?.14:.12,phy:'opp',la:44,face:.4,lift:.25,seg:8,wig:.03,rj:10,
      side:{u0:.18,u1:.8,p:.42,len:.42,ang:40,li:.85,e:-.01,tilt:22,pair:1},axil:cw.f?{u0:.2,p:.3,ang:26}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.45:fgSz(p,.8))*(p.o?.86:1)*kl,L=cm0*UPC*sz*R(.86,1.12),c=mix(cw.c,'#8a9a6a',u>.85?.3:0),F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,L*.04));
        return[g35Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.05,.05)),.5),cw.b,{lim,fold:.16,arch:.06,droop:.18,cup:-.06,tw:R(-1.1,1.1),bend:R(-.03,.03),sm:1,gloss:.2,dI:.02,
          veins:null,vc:mix(c,'#d8dcc8',.5),vw:.45,vo:.5})]},
      /* the olives: one to three on a short stalk from the axil, hanging; green, or ripening unevenly from green through violet to black */
      axDraw:og=>{if(nf>=8)return null;const n=rnd()<.6?1:2+Math.floor(rnd()*2),rr=.62*UPC*kl*(.75+.25*op),
          cl=l79Cluster(og,.45*UPC*kl,n,rr,(i,q)=>{if(!cw.mix)return mix(cw.fr,'#a8b048',R(0,.25));const m=Math.min(1,Math.max(0,op*1.1+R(-.55,.25)));return m>.66?cw.fr:m>.33?'#5a2a3e':'#8e9a3a'},
            {lim,sc:L79_OLEST[1],ped:1.1,from:.9,fall:.32,egg:.18,gl:.8,w:1.4,eye:(q,tp,a,r2)=>E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(r2*.12),fill:'#4a3a2a',opacity:.5},q)});if(cl)nf++;return cl}});
    open(k,t,1000,0,.4);return r})}

/* ---------- mastic tree (Pistacia lentiscus, Anacardiaceae, « lentisque », « pistachier lentisque »): a dense shrub of the Mediterranean maquis, its young twigs and leaf stalks red;
   leaves alternate, paripinnate (no end leaflet), 5–10 cm, the rachis flattened and narrowly winged, of 2–6 pairs (usually 4–5) of opposite leaflets, elliptic-lanceolate (1–5 cm),
   leathery, glossy dark green, blunt with a tiny point; female plants bear dense axillary clusters of small round drupes (4 mm), red then black. Sold as foliage and berried branches ---------- */
const CW_L79PIS=[{id:'vert',n:'Vert profond',c:'#2c4426',b:'#7a8a62'},{id:'vert-olive',n:'Vert olive (plein soleil)',c:'#56602e',b:'#949a70'},
  {id:'baies-rouges',n:'Vert, baies rouges',c:'#30482a',b:'#7a8a62',fr:'#c0303a',f:1}];
const L79_PISW=prof([[0,.3],[.1,.7],[.35,1],[.6,.92],[.85,.5],[1,.08]]),L79_PISST=['#4a1c18','#78302a','#a24a3e','#c8705e'];
/* one paripinnate leaf from its node: the red rachis arching out, np opposite pairs of leaflets (the upper ones largest), two at its end */
function l79PisLeaf(og,Ll,np,lf,c,cb,lim){const H=og.H,U=og.U,at=t=>V3.add(V3.add(V3.add(og.pos,V3.sc(H,Ll*t)),V3.sc(U,Ll*.06*Math.sin(Math.PI*t))),[0,-.16*Ll*t*t,0]),parts=[],ra=[];
  for(let i=0;i<=12;i++)ra.push(at(i/12));if(lim!=null&&l79Low(ra)<lim+lf*.5)return null;const sh=l79Prof(L79_PISW,.42,10);
  for(let i=0;i<np;i++){const q=np>1?i/(np-1):1,t=.22+.78*q,p=at(t),T=V3.nz(V3s(at(Math.min(1,t+.02)),at(Math.max(0,t-.02)))),N0=V3.nz(V3s(U,V3.sc(T,V3.dot(U,T)))),Sd=V3.nz(V3.cr(N0,T)),sz=(.8+.22*q)*R(.9,1.08);
    for(const s of[-1,1]){const an=(i===np-1?34:64-14*q+R(-6,6))*D,d=V3.nz(V3.add(V3.sc(T,Math.cos(an)),V3.sc(Sd,s*Math.sin(an)))),N=V3.nz(V3.add(N0,V3.sc(Sd,-s*.16)));
      parts.push(g35Leaf(V3.add(p,V3.sc(d,.4)),d,N,lf*sz,sh,mix(c,shd(c,R(-.06,.06)),.5),cb,{lim,fold:.12,arch:.04,droop:.06,cup:-.03,tw:R(-.2,.2),sm:1,gloss:.85,dI:.02,veins:[[[0,0],[0,.94]]],vc:mix(c,'#c0cc98',.4),vw:.38,vo:.42}))}}
  const st=DET>=1.5?3:6;for(let i=0;i<12;i+=st){const P2=ra.slice(i,i+st+1),z=P2.reduce((a,q)=>a+q[2],0)/P2.length;parts.push({z:z-.05,cast:false,fn:g=>l79Line(g,P2,1.6-.04*i,L79_PISST[1])})}
  return parts}
function l79Pis(g,t,o){const cw=fgCw(CW_L79PIS,o),op=l79Op(o),cm0=8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l79pis',()=>{const Lt=o.spine?blen(o.spine):48*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.12,.24)),lim=g35Lim(o);let nb=0;
    const r=fgGrow(k,A,{li:1.6*UPC*kl,liT:.35,w0:3.6*kl,w1:1.3,cols:L79_PISST,uL:o.spine?.14:.12,phy:'spiral',la:50,face:.7,lift:.35,seg:8,wig:.03,tipLv:0,
      side:{u0:.2,u1:.72,p:.4,len:.4,ang:40,li:.9,e:-.008,tilt:20},axil:cw.f?{u0:.18,p:.32,ang:34}:null,
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,sz=(p.tip?.6:fgSz(p,.78))*(p.o?.84:1)*kl,np=Math.max(2,Math.round(4.6*Math.min(1,sz+.1))),c=mix(cw.c,'#7a8a3a',u>.86?.3:0);
        return l79PisLeaf(og,cm0*UPC*.82*sz*R(.9,1.1),np,cm0*UPC*.33*sz*R(.9,1.08),c,cw.b,lim)},
      /* the drupes: a dense little cluster on a red stalk from the axil */
      axDraw:og=>{if(nb>=7)return null;const n=DET>=1.5?9:6,cl=l79Cluster(og,1.6*UPC*kl,n,.24*UPC*kl,(i,q)=>{const m=op*1.2-q*.4+R(-.2,.2);return m>.95?'#3a1a20':m>.5?cw.fr:mix(cw.fr,'#e8a0a0',.35)},
          {lim,sc:L79_PISST[1],ped:.8,from:.25,fall:.18,gl:.9,w:1.25});if(cl)nb++;return cl}});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf length; for the lentisk the whole compound leaf), and how the composer treats them:
   five stems of foliage along their spine, at their natural length ---------- */
Object.assign(GH,{'pittosporum-tobira':l79Pit,'gaultheria-shallon-salal':l79Gau,'vaccinium-ovatum-huckleberry':l79Vac,'olea-europaea-olivier':l79Ole,'pistacia-lentiscus-pistachier':l79Pis});
Object.assign(CWS,{'pittosporum-tobira':CW_L79PIT,'gaultheria-shallon-salal':CW_L79GAU,'vaccinium-ovatum-huckleberry':CW_L79VAC,'olea-europaea-olivier':CW_L79OLE,'pistacia-lentiscus-pistachier':CW_L79PIS});
Object.assign(SZG,{'pittosporum-tobira':[5,7,7,9],'gaultheria-shallon-salal':[6,8,8,10],'vaccinium-ovatum-huckleberry':[2.5,3,3,4],'olea-europaea-olivier':[5,6,6,8],'pistacia-lentiscus-pistachier':[6,8,8,10]});
const L79_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'pittosporum-tobira':L79_I(48,{fx:18}),'gaultheria-shallon-salal':L79_I(45,{fx:20}),'vaccinium-ovatum-huckleberry':L79_I(50,{fx:24}),
  'olea-europaea-olivier':L79_I(58,{fx:22}),'pistacia-lentiscus-pistachier':L79_I(48,{fx:20})});
