/* ================= Serre, lot 89 — capsules et gousses 2, poussées par le L-système : scabieuse étoilée, amour-en-cage, coton, asclépiade, arbre à ballons ================= */
/* ---------- shared: a blade in 3D (lsLeafS: arched, folded, drooping) drawn by sheet3 with its own back palette (a dry valve, a papery bract: no green underside) ---------- */
function l89Sheet(parts,pos,H,U,len,wr,col,colB,o={}){const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));if(V3l(og.U)<1e-6)og.U=Math.abs(og.H[2])<.9?[0,0,1]:[0,1,0];og.L=V3.cr(og.U,og.H);
  const S=lsLeafS(og,len,wr,o),F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(colB||shd(col,.12));
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:o.nu||4,nv:o.nv||7,across:1.4,ew:.45,eo:.45,cast:0,veins:o.mid===0?[]:[{pts:[[0,.02],[0,.5],[0,.95]],w:Math.max(.45,len*.012),c:P.d1,o:.45}]});
  for(const q of ps)q.z+=o.zb||0;parts.push(...ps);return ps}
/* a pedicel grown by the turtle from p (direction H): out, then bending under its fruit's weight (gravity e); its end organ K is where the fruit hangs */
function l89Ped(p,H,U,len,w0,w1,e,cols,parts,zk){const res=lsTurtle([['F',{l:len*.4,w0,w1:(w0+w1)/2,e:e*.25}],['F',{l:len*.6,w1,e}],['K',{}]],{p,H:V3.nz(H),U:V3.nz(U),T:[0,-1,0],e,seg:Math.max(1.5,len/6),wig:.02,w:w0});
  for(const ch of res.chains)ch.c=cols;const pp=[];lsChainParts(res.chains,[0,0,0],cols,pp,{piece:4});for(const q of pp){if(zk)q.z=zk(q.z);parts.push(q)}return res.organs.find(q=>q.t==='K')}
/* the frame of the main axis at the length l, and the outward direction on its side az */
const l89At=(A,l,az)=>{const s=A.sOf(l),q=A.at(s);return{s,q,r:V3.nz(V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))))}};
const l89Perp=n=>{const a=V3.nz(V3.cr(n,Math.abs(n[1])<.9?[0,1,0]:[1,0,0]));return[a,V3.cr(n,a)]};
const l89P2=v=>`${f(v[0])},${f(-v[1])}`;

/* ---------- scabieuse étoilée (Lomelosia stellata, syn. Scabiosa stellata): an annual with wiry stems forking in pairs, nearly leafless when sold; after its pale blue flowers each
   head becomes a ball (3–4.5 cm) of 40–60 fruits, each crowned by its epicalyx: a papery funnel opening into a broad scarious cup (the « star »), veined from its centre, green
   when fresh, drying to cream, beige or bronze; in the bottom of each cup the calyx's five dark bristles make a little star round the achene. Sold fresh-green, dried natural or dyed ---------- */
const CW_L89SCA=[{id:'vert',n:'Vert tendre (frais)',c:'#c4cfa1',st:'#4a3a34',g:1},{id:'creme',n:'Crème naturel (séché)',c:'#e8dcc0',st:'#3b3027'},
  {id:'bronze',n:'Bronze (séché)',c:'#a8875b',st:'#33251a'},{id:'beige',n:'Beige doré (Sternkugel)',c:'#b99d78',st:'#3b3027'},
  {id:'blanchi',n:'Blanchi',c:'#f3efe5',st:'#6a5e52',f:1},{id:'bleu',n:'Teinté bleu',c:'#8fa3c6',st:'#2c3246',f:1},{id:'rose',n:'Teinté rose',c:'#e3b2bf',st:'#5a2a38',f:1}];
/* the head at O, its stem arriving along B[2]: D its diameter, m its ripeness (0 a tight green ball of closed funnels, 1 the open stars) */
function l89ScaHead(par,B,O,D,cw,m){const dt=DET>=1.5,k=G(par),ax=B[2],Rr=D*.5,C0=V3.add(O,V3.sc(ax,Rr*.86)),N=LOD?22:Math.max(18,Math.round((dt?54:38)*Math.min(1,D/(4*UPC)))),rc=D*(.07+.075*m),ph=R(0,6.283),
    col=cw.g?mix('#8fa86a',cw.c,.35+.65*m):mix(mix('#a9b888',cw.c,.5),cw.c,sm01(m*1.4)),P=pal7(col),st=cw.g?mix('#6a7a4a',cw.st,m):cw.st,ink=shd(col,-.72),F=[];
  for(let i=0;i<N;i++){const y=1-2*(i+.5)/N;if(y<-.8)continue;const rr=Math.sqrt(1-y*y),th=i*2.39996+ph,n=V3.nz(toV(B,[Math.cos(th)*rr,Math.sin(th)*rr,y]));if(n[2]<-.55)continue;F.push({n,z:C0[2]+n[2]*Rr})}
  F.sort((a,b)=>a.z-b.z);
  /* the core: the achenes and the funnels' feet, darker, seen between the cups */
  E('circle',{cx:f(C0[0]),cy:f(-C0[1]),r:f(Rr*.7),fill:toneAt(P,.2),stroke:ink,'stroke-width':.4,'stroke-opacity':.5},k);
  for(const q of F){const n=q.n,[e1,e2]=l89Perp(n),Cr=V3.add(C0,V3.sc(n,Rr)),Cb=V3.add(C0,V3.sc(n,Rr*.5)),rim=[],hp=[],I=lightI(n);
    for(let j=0;j<(dt?24:12);j++){const a=j/(dt?24:12)*6.283,rr=rc*(dt&&j%2?.94:1),v=V3.add(Cr,V3.add(V3.sc(e1,Math.cos(a)*rr),V3.sc(e2,Math.sin(a)*rr)));rim.push([v[0],-v[1]]);hp.push([v[0],-v[1]])}
    for(let j=0;j<6;j++){const a=j/6*6.283,v=V3.add(Cb,V3.add(V3.sc(e1,Math.cos(a)*rc*.22),V3.sc(e2,Math.sin(a)*rc*.22)));hp.push([v[0],-v[1]])}
    /* the funnel's outside, then (turned to the eye) the inside of its cup, its veins and its star */
    E('path',{d:smooth(hull2(hp)),fill:toneAt(P,Math.max(.14,Math.min(.7,.26+.4*(I-.3)))),stroke:ink,'stroke-width':.35,'stroke-opacity':.5,'stroke-linejoin':'round'},k);
    if(n[2]<.08||LOD)continue;
    E('path',{d:smooth(rim),fill:toneAt(P,Math.min(1,.7+.35*(I-.55))),stroke:shd(col,-.45),'stroke-width':dt?.35:.45,'stroke-opacity':.7},k);
    const Cs=V3.add(C0,V3.sc(n,Rr*.74));if(dt){let d='';for(let j=0;j<14;j++){const a=j/14*6.283,c=Math.cos(a),s=Math.sin(a),b=V3.add(Cs,V3.add(V3.sc(e1,c*rc*.28),V3.sc(e2,s*rc*.28))),e=V3.add(Cr,V3.add(V3.sc(e1,c*rc*.95),V3.sc(e2,s*rc*.95)));d+=`M${l89P2(b)}L${l89P2(e)}`}
      E('path',{d,stroke:shd(col,-.28),'stroke-width':.3,'stroke-opacity':.5,fill:'none'},k)}
    /* the throat: the funnel's dark mouth round the achene */
    if(dt||rc>3.2){const tr=rc*.3,tq=[];for(let j=0;j<10;j++){const a=j/10*6.283,v=V3.add(Cs,V3.add(V3.sc(e1,Math.cos(a)*tr),V3.sc(e2,Math.sin(a)*tr)));tq.push([v[0],-v[1]])}E('path',{d:smooth(tq),fill:mix(st,col,.45),opacity:.85},k)}
    if(m<.25)continue;let d='';const ab=rc*(dt?.62+.3*m:.4+.2*m);for(let j=0;j<5;j++){const a=j/5*6.283+l89Th0(n),dir=V3.nz(V3.add(V3.sc(n,.7),V3.add(V3.sc(e1,Math.cos(a)),V3.sc(e2,Math.sin(a))))),tp=V3.add(Cs,V3.sc(dir,ab));
      d+=l40Sliver([Cs[0],-Cs[1]],[tp[0],-tp[1]],dt?Math.max(.45,rc*.06):1.1)}
    const cr=Math.max(.6,rc*(dt?.13:.1));d+=`M${f(Cs[0]-cr)},${f(-Cs[1])}a${f(cr)},${f(cr)} 0 1,0 ${f(2*cr)},0a${f(cr)},${f(cr)} 0 1,0 ${f(-2*cr)},0`;
    E('path',{d,fill:dt?st:mix(st,col,.3),stroke:shd(st,-.5),'stroke-width':.25,'stroke-opacity':dt?.6:.3},k)}
  return k}
const l89Th0=n=>Math.atan2(n[1],n[0])*3.1;
function l89Scab(g,t,o){const cw=cwPick(CW_L89SCA,o),op=Math.max(.05,Math.min(1,o.op??1)),m=op,D0=(o.cm||4)*UPC,k=G(g),
    sc=gsCols(cw.g?'#7e8f5c':mix(cw.c,'#7a6a48',.5)),sz=.62+.38*op,w=Math.max(1.3,D0*.05),head=(par,B,O,D,mm)=>l89ScaHead(par,B,O,D,cw,mm);
  if(o.spine){const parts=[],A=spAxis(o,blen(o.spine),{face:R(-.5,.5),bow:R(-.08,.08)}),f1=A.at(1),L=A.L,Bf=spFrame(f1.T,f1.Fr,R(0,6.283));spStem(A,parts,[0,.3,.6,.85,1],w*1.3,w,sc);
    /* a fork with a younger head */
    if(L>D0*5){const br=bzGrow(A,L-D0*R(2.2,3),R(0,6.283),R(28,40),[['F',{l:D0*R(1.8,2.4),w1:w*.85}],['K',{}]],{w:w*.95,seg:D0*.4,T:[0,1,0],e:.02,wig:.02});bzAxes(br,sc,parts);
      for(const og of br.organs){const Bb=spFrame(og.H,[0,1,0],R(0,6.283));parts.push({z:og.pos[2]+.4,fn:par=>head(par,Bb,og.pos,D0*sz*.72,Math.min(m,.6))})}}
    parts.push({z:f1.p[2]+.5,fn:par=>head(par,Bf,f1.p,D0*sz,m)});drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w*1.3,bw1:w*1.3,bc:sc}}
  const r=lsHeadS(k,o,{D:D0,w,cols:sc,op,rr:.5,axisFirst:true,nodes:2,li:1.7,lp:2.6,aimK:.04,opp:1,side:{p:.7,n:2,top:2,len:2,ang:30,age:[.25,.9]},budD:.5,budMax:.01,wig:.03,e:.02,
    flower:(par,B,O,D2)=>head(par,gsCapF(B,.25),O,D2*sz,m),bud:(par,B,O,s,a)=>head(par,B,O,s*1.4,.2),young:(par,B,O,s,a)=>head(par,B,O,D0*sz*(.55+.3*a),Math.min(m,.25+.6*a)),
    node:(og,pos)=>({z:pos[2]+.1,cast:false,fn:par=>E('ellipse',{cx:f(pos[0]),cy:f(-pos[1]),rx:f(w*.85),ry:f(w*.55),fill:sc[1]},par)})});
  open(k,t,1000,6,.3);return r}

/* ---------- amour-en-cage (Alkekengi officinarum, syn. Physalis alkekengi): a rhizomatous perennial; its unbranched stems (40–70 cm) carry alternate ovate leaves on short petioles,
   and in each upper axil one nodding fruit on a curved pedicel: the calyx grown into a papery lantern (3.5–5 cm), five-angled with ten veins, heart-shaped at its foot round the
   pedicel, its five teeth meeting at the pointed tip, hiding a red berry. Green, then yellow, orange and orange-red; weathered, the tissue rots away and leaves a skeleton of veins
   round the berry. Stages: young (small, green), colouring, ripe ---------- */
const CW_L89PHY=[{id:'orange',n:'Orange lanterne',c:'#e8742a',b:'#d8431f'},{id:'rouge',n:'Orange-rouge (Gigantea)',c:'#d9502a',b:'#c8301a'},{id:'vert',n:'Vert (jeune)',c:'#9fb35e',b:'#8aa848',g:1},
  {id:'squelette',n:'Squelette dentelle',c:'#d8c8a2',b:'#d8431f',sk:1},{id:'jaune',n:'Jaune orangé (mûrissant)',c:'#eda43a',b:'#e07a20',f:1}];
const L89_PHY=gsProf([[0,.16],[.05,.62],[.12,.86],[.26,1],[.44,.95],[.64,.74],[.84,.4],[1,.05]]);
/* one lantern hanging from its pedicel at top along Ad (top → tip): len its length; m its ripeness */
function l89Lantern(par,top,Ad,len,cw,m,roll){const dt=DET>=1.5,k=G(par),B=spFrame(V3.nz(Ad),[.3,0,1],roll),Rm=len*.42,rf=t=>Rm*L89_PHY(t),T0=V3.add(top,V3.sc(V3.nz(Ad),-len*.07)),
    col=cw.g?mix('#7d9a48',cw.c,.4+.6*m):cw.sk?cw.c:m<.5?mix('#8fa850',mix('#c8b84a',cw.c,.4),m/.5):mix(mix('#c8b84a',cw.c,.4),cw.c,Math.min(1,(m-.5)/.4)),ink=shd(col,-.72);
  /* its heart-shaped foot: the shoulders rise above where the pedicel sinks in */
  const V=(t,a)=>V3.add(T0,toV(B,[Math.cos(a)*rf(t),Math.sin(a)*rf(t),t*len]));
  if(cw.sk){/* the skeleton: the berry inside, seen through a net of veins */
    const bo=V3.add(T0,V3.sc(toV(B,[0,0,1]),len*.52));bzFruit(k,bo,toV(B,[0,0,1]),len*.17,len*.17,cw.b,{gl:.8,big:2});
    const hp=[];for(let i=0;i<=10;i++)for(let j=0;j<12;j++){const v=V(i/10,j/12*6.283);hp.push([v[0],-v[1]])}
    E('path',{d:smooth(hull2(hp)),fill:cw.c,'fill-opacity':.22,stroke:shd(cw.c,-.35),'stroke-width':dt?.5:1.1,'stroke-opacity':.8},k);
    let d='',db='';const nm=10,nr=dt?7:3,vis=(t,a)=>{const e=.01,n=V3.cr(V3s(V(t,a+e),V(t,a-e)),V3s(V(Math.min(1,t+e),a),V(Math.max(0,t-e),a)));return n[2]};
    for(let j=0;j<nm;j++){const a=j/nm*6.283+roll*0;let s='';for(let i=0;i<=12;i++){const v=V(.02+.96*i/12,a);s+=(i?'L':'M')+l89P2(v)}if(vis(.4,a)>0)d+=s;else db+=s}
    /* the net between the veins: irregular cross-links, finer and denser toward the tip */
    for(let j=0;j<nm;j++){const a0=j/nm*6.283,a1=(j+1)/nm*6.283;for(let i=0;i<nr;i++){const t=(i+R(.2,.8))/nr*.9+.04,t2=Math.max(.03,Math.min(.97,t+R(-.07,.07))),mid=V((t+t2)/2+R(-.03,.03),(a0+a1)/2+R(-.08,.08)),s=`M${l89P2(V(t,a0))}L${l89P2(mid)}L${l89P2(V(t2,a1))}`;
      if(vis(t,(a0+a1)/2)>0)d+=s;else if(dt)db+=s}}
    if(db)E('path',{d:db,fill:'none',stroke:shd(cw.c,-.25),'stroke-width':dt?.4:1.1,'stroke-opacity':.5,'stroke-linejoin':'round'},k);
    E('path',{d,fill:'none',stroke:shd(cw.c,-.15),'stroke-width':dt?.55:1.1,'stroke-opacity':.9,'stroke-linejoin':'round'},k);return k}
  const mer=[];if(!LOD)for(let j=0;j<10;j++)mer.push({a:j/10*6.283,c:shd(col,j%2?-.16:-.3),w:j%2?(dt?.35:.4):(dt?.6:.7),op:j%2?.45:.75,t0:.03,t1:.97});
  gsRev(k,B,T0,len,rf,col,{nl:5,lob:.07,ph:0,ng:dt?30:20,ct:.75,ink,pal:pal7(col),merge:1,mer,hl:.1});return k}
function l89Phy(g,t,o){const cw=cwPick(CW_L89PHY,o),op=Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],C=(o.cm||4.5)*UPC,Lt=o.spine?blen(o.spine):C*8.5,
    A=spAxis(o,Lt,{face:R(-.6,.6),bow:(rnd()<.5?-1:1)*R(.06,.14)}),L=A.L,Lfl=Math.min(C*6,L*(o.spine?(o.short?.8:.62):.74)),s0=A.sOf(L-Lfl),
    SC=gsCols(cw.sk?'#9a8a62':'#7a7448'),lc=cw.g?'#4f7a34':mix('#56742f','#a89a40',.22),bare=cw.sk||(o.spine&&rnd()<.35),sf=o.from||0;
  spStem(A,parts,[sf,s0*.5,s0,s0+(1-s0)*.35,s0+(1-s0)*.7,1].map(x=>Math.max(sf,x)).filter((x,i,a)=>!i||x>a[i-1]+1e-3),3.4,1.4,SC,1,sf);
  const nn=Math.max(4,Math.round(Lfl/(C*1.05)));
  for(let i=0;i<nn;i++){const q=i/(nn-1),l=L-Lfl+Lfl*(.02+.93*q),az=(i*150+R(-20,20))*D,{s,q:fr,r}=l89At(A,l,az),p=fr.p,zk=z=>A.zk(s,z);if(o.spine&&(p[1]<26||s<sf+.02))continue;
    /* the leaf above, on its short petiole, ovate, a little wavy; the topmost ones smaller */
    if(!bare){const H=V3.nz(V3.add(V3.sc(r,.8),V3.sc(fr.T,.55))),len=C*R(1.6,1.95)*(1-.3*q),pk=lsTurtle([['F',{l:len*.18,w1:1.2}],['Lf',{}]],{p,H,U:fr.T,T:[0,-1,0],e:.03,seg:2,w:1.5}),
        og=pk.organs[0],pp=[];lsChainParts(pk.chains,[0,0,0],SC,pp,{piece:4});for(const x of pp){x.z=zk(x.z);parts.push(x)}
      const pt=bzBlade(og.pos,og.H,og.U,len,.66,lc,{wp:LS_OVATE,fold:.1,droop:.2,arch:.05,face:.55,vn:5,va:.2,ao:.9});pt.z=zk(pt.z);parts.push(pt)}
    /* the pedicel from the axil, arching out and down, and the lantern hanging from its end */
    const age=Math.max(0,Math.min(1,op*1.2-q*.45+R(-.06,.06))),pl=C*R(.38,.5),lr=V3.nz(V3.add(V3.sc(r,.9),V3.sc(V3.cr(fr.T,r),R(-.4,.4)))),pq=[],
      K=l89Ped(p,V3.add(V3.sc(lr,.85),V3.sc(fr.T,.35)),fr.T,pl,1.5,1.2,.2,SC,pq,zk),Ad=V3.nz(V3.add(V3.sc(K.H,.4),[0,-1,0])),ln=C*(cw.sk?.95:.5+.5*sm01(age/.75))*R(.92,1.06);
    if(o.spine&&K.pos[1]+Ad[1]*ln<14)continue;parts.push(...pq);const lz=K.pos[2]+Ad[2]*ln*.5;parts.push({z:zk(lz),fn:par=>l89Lantern(par,K.pos,Ad,ln,cw,cw.sk?1:age,R(0,6.283))})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:3.4,bc:SC}}

/* ---------- coton (Gossypium hirsutum): sold as dried woody branches (50–80 cm), the leaves fallen; the fruiting branches zigzag from node to node, each node ending in a boll.
   The boll (4–6 cm) splits along its sutures into 4–5 pointed, stiff brown valves (the bur) that spread and curl back; from each locule a lock of white fibre swells out, the locks
   together a fluffy ball; under the bur, three dried bracteoles, broad and fringed. Stages: closed boll, splitting, open ---------- */
const CW_L89COT=[{id:'blanc',n:'Blanc naturel',c:'#f5f1e7',b:'#5a3f2a'},{id:'ecru',n:'Écru (crème)',c:'#ebe3cf',b:'#5a3f2a'}];
const L89F={};function l89Fluff(c){const id=L89F[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l89f'+(gid++),gr=E('radialGradient',{id:nid,cx:.4,cy:.36,r:.68,fx:.34,fy:.28},defs);
  stops(gr,[[0,mix(c,'#ffffff',.6)],[.45,c],[.82,shd(c,-.12)],[1,shd(c,-.25)]]);L89F[c]=nid;return`url(#${nid})`}
/* one boll at O, its axis ax (out of its branch), D its diameter, m 0 closed → 1 open; its pieces go to parts (painter's order with the branch) */
function l89Boll(parts,O,ax,D,cw,m,zk){const dt=DET>=1.5,[e1,e2]=l89Perp(ax),ph=R(0,6.283),nv=rnd()<.7?4:5,bc=cw.b,bi=mix(bc,'#c8a47a',.5),Z=zk||(z=>z),br=[],va=[],lk=[],below=ax[2]<-.3;
  /* three bracteoles under the bur, cupping it, dry and fringed */
  for(let j=0;j<3;j++){const a=ph+j*2.094+.5,rd=V3.add(V3.sc(e1,Math.cos(a)),V3.sc(e2,Math.sin(a))),H=V3.nz(V3.add(V3.sc(ax,m<.3?.95:.55),V3.sc(rd,m<.3?.3:1))),p0=V3.add(O,V3.sc(rd,D*.04));
    br.push(bzBlade(p0,H,V3.sc(rd,-1),D*(m<.3?.62:.3),m<.3?1.05:.9,mix(bc,m<.3?'#6a7a40':'#7a5a3a',.35),{teeth:m<.3?7:5,td:.32,wp:LS_OVATE,fold:.3,arch:-.05,droop:.04,ao:.8}))}
  if(m<.3){/* closed: an ovoid pointed capsule, green turning brown, its sutures dark; the bracteoles clasp it */
    const hl=D*.38,r=D*.27,C=V3.add(O,V3.sc(ax,hl*.85)),col=mix('#6f8a40',bc,Math.min(1,m*3+.25));
    br.push({z:C[2]-r*.3,fn:par=>bzFruit(par,C,ax,hl,r,col,{egg:.35,gl:.12,big:2,paint:(q,c,E1,E2,mj,rr)=>{if(LOD)return;let d='';for(let j=0;j<nv;j++){const s=Math.sin(ph+j*6.283/nv),cs=Math.cos(ph+j*6.283/nv);if(cs<0)continue;
        d+=`M${f(c[0]-E1[0]*mj*.8+E2[0]*s*rr*.7)},${f(c[1]-E1[1]*mj*.8+E2[1]*s*rr*.7)}Q${f(c[0]+E2[0]*s*rr*1.02)},${f(c[1]+E2[1]*s*rr*1.02)} ${f(c[0]+E1[0]*mj*.95)},${f(c[1]+E1[1]*mj*.95)}`}
      if(d)E('path',{d,fill:'none',stroke:shd(col,-.5),'stroke-width':1.1,'stroke-opacity':.6},q)}})});
    parts.push({z:Z(C[2]),fn:par=>drawParts(G(par),br)});return}
  /* the valves: pointed, stiff, concave, spreading from the base and curling back as the boll opens */
  const u=sm01((m-.3)/.6),sp=.35+1.0*u,lockR=D*(.13+.14*u),lockD=D*(.06+.11*u);
  for(let j=0;j<nv;j++){const a=ph+j*6.283/nv,rd=V3.add(V3.sc(e1,Math.cos(a)),V3.sc(e2,Math.sin(a))),H=V3.nz(V3.add(V3.sc(ax,Math.cos(sp)),V3.sc(rd,Math.sin(sp))));
    l89Sheet(va,V3.add(O,V3.sc(ax,D*.06)),H,ax,D*R(.36,.42),.42,bi,bc,{wp:prof([[0,.35],[.25,.95],[.5,1],[.8,.55],[1,0]]),fold:.35,arch:-.12*m,droop:0,nu:3,nv:6,mid:dt?1:0})}
  /* the locks: one per locule, swollen between the valves, pressed together into a ball lifted off the bur; each a cloud of puffs, lit from the upper left */
  const Cb=V3.add(O,V3.sc(ax,D*(.12+.14*u)));
  for(let j=0;j<nv;j++){const a=ph+(j+.5)*6.283/nv,rd=V3.add(V3.sc(e1,Math.cos(a)),V3.sc(e2,Math.sin(a))),C=V3.add(Cb,V3.sc(V3.nz(V3.add(rd,V3.sc(ax,.25))),lockD)),rl=lockR*R(.94,1.06),
      sq=.82+.18*Math.abs(rd[2]),ang=Math.atan2(-rd[1],rd[0]),bmp=R(0,6.283),tone=mix(cw.c,shd(cw.c,-.1),Math.max(0,-rd[2])*.8);
    lk.push({z:C[2],fn:par=>{const pts=[],n=dt?36:22;for(let i=0;i<n;i++){const th=i/n*6.283,rr=rl*(1+.08*Math.abs(Math.sin(3.5*th+bmp))+.035*Math.sin(11*th+bmp*2)),x=Math.cos(th)*rr,y=Math.sin(th)*rr*sq;
        pts.push([C[0]+x*Math.cos(ang)-y*Math.sin(ang),-C[1]+x*Math.sin(ang)+y*Math.cos(ang)])}
      E('path',{d:smooth(pts),fill:l89Fluff(tone),stroke:shd(cw.c,-.32),'stroke-width':.4,'stroke-opacity':.55},par);
      if(!LOD&&(dt||rl>5)){let d='';for(let i=0;i<(dt?3:2);i++){const th=bmp+i*2.1+2.4,a0=[C[0]+Math.cos(th)*rl*.15,-C[1]+Math.sin(th)*rl*.15],a1=[C[0]+Math.cos(th+.6)*rl*.7,-C[1]+Math.sin(th+.6)*rl*.7];
          d+=`M${f(a0[0])},${f(a0[1])}Q${f((a0[0]+a1[0])/2+Math.cos(th+2)*rl*.15)},${f((a0[1]+a1[1])/2+Math.sin(th+2)*rl*.15)} ${f(a1[0])},${f(a1[1])}`}
        E('path',{d,fill:'none',stroke:shd(cw.c,-.2),'stroke-width':dt?.5:.6,'stroke-opacity':.55,'stroke-linecap':'round'},par)}}})}
  /* seen from its side or above, the ball covers the bur and the bur its bracteoles; from below, the other way round */
  parts.push({z:Z(Cb[2]),fn:par=>{const g=G(par);if(below){drawParts(g,lk);drawParts(g,va);drawParts(g,br)}else{drawParts(g,br);drawParts(g,va);drawParts(g,lk)}}})}
function l89Cot(g,t,o){const cw=cwPick(CW_L89COT,o),op=Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],C=(o.cm||5)*UPC,Lt=o.spine?blen(o.spine):C*7.5,
    SC=['#2a1d12','#4e3a28','#74593f','#9c8062'],w0=4.6,w1=1.9,s0=o.from||0;
  /* in a bouquet (a head of the Composer) and on a sheet: the tip of a branch, its top boll on a woody peduncle, side branchlets with younger bolls; the bouquet's stem joins its base */
  if(!o.spine){const r=lsHeadS(k,o,{D:C,w:2.6,cols:SC,op,rr:.4,axisFirst:true,nodes:2,li:.75,lp:.7,aimK:.08,opp:0,side:{p:.92,n:1,top:2,len:1,ang:48,age:[.55,1]},budD:.6,budMax:.01,wig:.06,e:.02,
      flower:(par,B,O,D2)=>{const ps=[],B2=gsCapF(B,.3);l89Boll(ps,O,B2[2],D2,cw,Math.min(1,op*1.1));drawParts(par,ps)},bud:(par,B,O,s2)=>{const ps=[];l89Boll(ps,O,B[2],s2*1.5,cw,.1);drawParts(par,ps)},
      young:(par,B,O,s2,a)=>{const ps=[];l89Boll(ps,O,V3.nz(V3.add(B[2],[0,.5,0])),C*(.75+.2*a),cw,Math.max(0,Math.min(1,op*1.1-.15+.15*a)));drawParts(par,ps)},
      node:(og,pos)=>({z:pos[2]+.1,cast:false,fn:par=>E('ellipse',{cx:f(pos[0]),cy:f(-pos[1]),rx:1.9,ry:1.4,fill:SC[1]},par)})});
    open(k,t,1000,4,.3);return r}
  const A=spAxis(o,Lt,{face:R(-.6,.6),bow:R(-.08,.08)}),L=A.L;
  spStem(A,parts,[s0,.2,.4,.6,.8,1].map(x=>Math.max(s0,x)).filter((x,i,a)=>!i||x>a[i-1]),w0,w1,SC);
  const boll=(O,ax,sz,zk)=>l89Boll(parts,O,ax,C*sz,cw,Math.max(0,Math.min(1,op*1.15+R(-.15,.05))),zk);
  /* the top boll, crowning the main axis */
  const f1=A.at(1);boll(f1.p,V3.nz(V3.add(f1.T,[0,.2,0])),R(.95,1.05),z=>A.zk(1,z));
  /* fruiting branches, alternate up the upper part: each zigzags once or twice and ends in a boll, sometimes a second boll on a spur */
  const nb=o.spine?(L>C*5?3:2):4;for(let j=0;j<nb;j++){const l=L*(.42+.42*j/Math.max(1,nb-1))*R(.95,1.03);if(l>L-C*.9)continue;let az=(j*180+R(-35,35))*D;
    /* in a bouquet a branch leaves its stem on the upper side: a boll never droops toward the lip */
    if(o.spine)for(let tr=0;tr<8&&l89At(A,l,az).r[1]<-.05;tr++)az=R(0,6.283);const{s,q}=l89At(A,l,az);if(o.spine&&q.p[1]<30)continue;
    const lb=C*R(.9,1.4)*(1-.25*j/nb),zz=R(18,30)*(rnd()<.5?1:-1),spur=rnd()<.55,
      mods=[['F',{l:lb*.5,w1:2}],['+',{a:zz}],...(spur?[['[',{w:1.6}],['-',{a:55}],['F',{l:lb*.35,w1:1.4}],['K',{s:.8}],[']',{}]]:[]),['F',{l:lb*.5,w1:1.6}],['K',{s:1}]];
    const br=bzGrow(A,l,az,R(42,58),mods,{w:2.6,seg:lb/5,T:[0,1,0],e:.03,wig:.07});if(o.spine&&br.organs.some(og=>og.pos[1]<C*.6+14))continue;for(const ch of br.chains)ch.c=SC;const pp=[];bzAxes(br,SC,pp);for(const x of pp){x.z=A.zk(s,x.z);parts.push(x)}
    for(const og of br.organs)boll(og.pos,V3.nz(V3.add(og.H,[0,.45,0])),og.p.s*R(.85,1),z=>A.zk(s,z))}
  drawParts(k,parts);open(k,t,1000,0,.4);return{k,bw:w0,bw1:w0,bc:SC}}

/* ---------- asclépiade (Asclepias tuberosa, A. curassavica, A. incarnata): erect leafy stems with many narrow lance leaves (alternate in tuberosa, opposite in incarnata); at the top
   umbels (5–8 cm) of 15–30 small flowers (about 1 cm) on slender rays, often several umbels together; each flower bends its five corolla lobes sharply down and raises a crown of five
   hooded nectaries, each with a little incurved horn, round the central column. Tuberosa orange or yellow, curassavica red lobes under golden hoods, incarnata pink, mauve or white ---------- */
const CW_L89ASC=[{id:'orange',n:'Orange (A. tuberosa)',c:'#e9772b',h:'#f39a34'},{id:'jaune',n:'Jaune (Hello Yellow)',c:'#f1c232',h:'#f7d65a'},
  {id:'rouge',n:'Rouge et or (A. curassavica)',c:'#d2352b',h:'#f3c23e'},{id:'rose',n:'Rose (A. incarnata Cinderella)',c:'#d987a6',h:'#f0ccd8'},
  {id:'mauve',n:'Mauve (A. incarnata Soulmate)',c:'#b07aa0',h:'#e2bcd0'},{id:'blanc',n:'Blanc (Ice Ballet)',c:'#f1ead8',h:'#fbf8ee'},
  {id:'or',n:'Jaune d’or (Silky Gold)',c:'#f2b12c',h:'#f8d04a',f:1}];
/* one flower at O facing n (out of its ray), s its width; a < .45: a bud */
function l89AscFl(par,O,n,s,cw,a,ph){const dt=DET>=1.5,[e1,e2]=l89Perp(n),P=pal7(cw.c),PH=pal7(cw.h),nz=n[2];
  if(a<.45){const hl=s*(.17+.14*a),C=V3.add(O,V3.sc(n,hl*.8));bzFruit(par,C,n,hl,hl*.72,mix(cw.c,'#9ab070',.45-.6*a),{egg:.3,gl:.3,big:1.6});return}
  const lob=[],hood=[];let dL='',dH='';
  for(let j=0;j<5;j++){const t=ph+j*1.2566,rd=V3.add(V3.sc(e1,Math.cos(t)),V3.sc(e2,Math.sin(t))),sd=V3.cr(n,rd);
    /* a corolla lobe, reflexed: from the centre out, then sharply back along the pedicel */
    const b=V3.add(O,V3.sc(rd,s*.06)),m1=V3.add(O,V3.add(V3.sc(rd,s*.3),V3.sc(n,-s*.05))),tp=V3.add(O,V3.add(V3.sc(rd,s*.36),V3.sc(n,-s*.42))),w=s*.13,
      q=[V3.add(b,V3.sc(sd,w*.5)),V3.add(m1,V3.sc(sd,w)),tp,V3.add(m1,V3.sc(sd,-w)),V3.add(b,V3.sc(sd,-w*.5))];dL+=smooth(q.map(v=>[v[0],-v[1]]));
    /* a hood, standing up round the column, its horn curling in */
    const hb=V3.add(O,V3.sc(rd,s*.12)),ht=V3.add(O,V3.add(V3.sc(rd,s*.17),V3.sc(n,s*.3))),hw=s*.075,h=[V3.add(hb,V3.sc(sd,hw*.8)),V3.add(V3.add(hb,V3.sc(n,s*.12)),V3.add(V3.sc(sd,hw*1.15),V3.sc(rd,s*.04))),
      V3.add(ht,V3.sc(sd,hw*.7)),V3.add(ht,V3.sc(rd,s*.03)),V3.add(ht,V3.sc(sd,-hw*.7)),V3.add(V3.add(hb,V3.sc(n,s*.12)),V3.add(V3.sc(sd,-hw*1.15),V3.sc(rd,s*.04))),V3.add(hb,V3.sc(sd,-hw*.8))];dH+=smooth(h.map(v=>[v[0],-v[1]]))}
  const lobes=()=>E('path',{d:dL,fill:toneAt(P,nz>0?.48:.62),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'},par),
    hoods=()=>{E('path',{d:dH,fill:toneAt(PH,.55+.3*Math.max(0,nz)),stroke:shd(cw.h,-.45),'stroke-width':.3,'stroke-opacity':.4},par);
      if(nz>-.2){const c=V3.add(O,V3.sc(n,s*.22)),r=s*.08;E('ellipse',{cx:f(c[0]),cy:f(-c[1]),rx:f(r),ry:f(r*Math.max(.45,Math.abs(nz))),fill:mix(cw.h,'#e8e0c0',.5),stroke:shd(cw.h,-.5),'stroke-width':.25,'stroke-opacity':.5},par)}};
  if(nz>=0){lobes();hoods()}else{hoods();lobes()}}
/* the umbel at O, its peduncle arriving along ax: D its width; rays radiate in a dome, each ending in a flower facing out; op: how many are open */
function l89Umbel(par,O,ax,D,cw,op,nF){const parts=[],dt=DET>=1.5,n=nF||Math.round((LOD?14:dt?30:22)*(.7+.3*Math.min(1,D/(6.5*UPC)))),[e1,e2]=l89Perp(ax),sc=['#3a5a26','#5f7d3a','#86a35a','#b4c88a'],s=Math.min(D*.24,1.4*UPC*Math.pow(D/(6.5*UPC),.3)),ph=R(0,6.283);
  for(let i=0;i<n;i++){const el=Math.acos(1-.88*(i+.5)/n),th=i*2.39996+ph,rd=V3.add(V3.sc(e1,Math.cos(th)),V3.sc(e2,Math.sin(th))),dir=V3.nz(V3.add(V3.sc(ax,Math.cos(el)),V3.sc(rd,Math.sin(el)))),
      a=Math.min(1,op*1.25-(el<.5?.35:0)*(1-op)+R(-.12,.08)),rl=D*.3*R(.88,1.05)*(a<.45?.85:1);
    /* the ray: one slender curved stroke (at sheet detail, a shaded stem) */
    const res=lsTurtle([['F',{l:rl,w0:1.2,w1:1.1,e:.015}],['K',{}]],{p:O,H:dir,U:ax,T:[0,1,0],e:.015,seg:rl/3,w:1.2});for(const ch of res.chains)ch.c=sc;
    if(dt)lsChainParts(res.chains,[0,0,0],sc,parts,{piece:4});else{const P=res.chains[0].pts;let z=0;for(const q of P)z+=q[2];parts.push({z:z/P.length,fn:q=>E('path',{d:smooth(P.map(v=>[v[0],-v[1]]),false),stroke:sc[1],'stroke-width':1.2,fill:'none','stroke-linecap':'round'},q)})}
    const K=res.organs[0],nn=V3.nz(V3.add(K.H,V3.sc(ax,.25)));parts.push({z:K.pos[2]+nn[2]*s*.2+.05,fn:q=>l89AscFl(q,K.pos,nn,s,cw,a,R(0,1.3))})}
  /* the knot of the rays */parts.push({z:O[2]-.02,fn:q=>E('circle',{cx:f(O[0]),cy:f(-O[1]),r:1.6,fill:sc[1]},q)});
  drawParts(par,parts)}
function l89Asc(g,t,o){const cw=cwPick(CW_L89ASC,o),op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||6.5)*UPC,k=G(g),sc=['#2e4a20','#4f6e30','#76964c','#a8c080'],lc='#4f7a30',w=Math.max(2,D0*.05),
    umb=(par,B,O,D,a)=>l89Umbel(par,O,B[2],D,cw,a),lf=(og,pos,sz)=>bzBlade(pos,og.H,og.U,D0*R(1,1.25)*sz,.2,lc,{wp:LS_LANCE,fold:.3,droop:.18,arch:.06,ao:.9});
  if(o.spine){const parts=[],A=spAxis(o,blen(o.spine),{face:R(-.5,.5),bow:R(-.06,.06)}),f1=A.at(1),L=A.L;spStem(A,parts,[0,.3,.6,.85,1],w*1.2,w,sc);
    if(L>D0*3.5){const br=bzGrow(A,L-D0*R(1,1.4),R(0,6.283),R(26,36),[['F',{l:D0*R(.8,1.1),w1:w*.75}],['K',{}]],{w:w*.85,seg:D0*.25,T:[0,1,0],e:.02,wig:.02});bzAxes(br,sc,parts);
      for(const og of br.organs)parts.push({z:og.pos[2]+.4,fn:par=>l89Umbel(par,og.pos,og.H,D0*.72,cw,Math.min(op,.6))})}
    for(let i=0;i<5;i++){const l=L-D0*(.6+.55*i);if(l<L*.4)break;const{q,r}=l89At(A,l,i*2.4+R(-.3,.3));if(q.p[1]<30)continue;const og={H:V3.nz(V3.add(V3.sc(q.T,.7),r)),U:q.T};og.L=V3.cr(og.U,og.H);parts.push(lf(og,q.p,1-.08*i))}
    parts.push({z:f1.p[2]+.5,fn:par=>umb(par,{2:f1.T},f1.p,D0,op)});drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w*1.2,bw1:w*1.2,bc:sc}}
  const r=lsHeadS(k,o,{D:D0,w,cols:sc,op,rr:.45,axisFirst:true,nodes:4,li:.42,lp:.85,aimK:.05,opp:0,leafAng:42,side:{p:.85,n:1,top:2,len:.9,ang:30,age:[.3,.9]},budD:.5,budMax:.01,wig:.02,e:.02,
    flower:(par,B,O,D2,op2)=>umb(par,B,O,D2,op),bud:(par,B,O,s,a)=>umb(par,B,O,s*1.6,.1),young:(par,B,O,s,a)=>umb(par,B,O,D0*(.6+.25*a),Math.min(op,.2+.6*a)),
    leaf:(og,pos)=>lf(og,pos,1)});
  open(k,t,1000,6,.3);return r}

/* ---------- arbre à ballons (Gomphocarpus physocarpus, syn. Asclepias physocarpa): a soft-wooded shrub (1–2 m) with narrow linear leaves in pairs; from the upper nodes, on curved
   pedicels (2–4 cm), hang its fruits: inflated, nearly round follicles (5–8 cm), pale green, thin-walled, covered in soft bristles, ending in a little beak. Sold as stems of 70–100 cm
   carrying 3–8 balloons; ripe they blush pink or bronze. Stages: young (small, deep green), swelling, full ---------- */
const CW_L89GOM=[{id:'vert-tendre',n:'Vert tendre',c:'#b5c98e'},{id:'vert',n:'Vert pomme',c:'#a9c85a'},{id:'rose',n:'Vert rosé (mûr)',c:'#cdbf98',bl:'#d79a92',f:1}];
/* one balloon hanging from its pedicel at top along Ad; len its length, m its swelling */
function l89Balloon(par,top,Ad,len,cw,m){const dt=DET>=1.5,hl=len*.5,r=len*(.37+.06*m),O=V3.add(top,V3.sc(Ad,hl*.9)),col=mix('#6f9a3e',cw.c,.35+.65*m),ink=shd(col,-.7),bc=mix(col,'#f2f6e0',.32),k=G(par),[X,Y]=l89Perp(Ad);
  /* the beak: the tip drawn out into a short curved point (behind the body when the tip turns away) */
  const tp=V3.add(O,V3.sc(Ad,hl*.86)),b2=V3.add(tp,V3.add(V3.sc(Ad,len*.11),V3.sc(X,len*.06))),beak=()=>bzSpikes(k,[[tp,b2,Math.max(1.4,r*.16)]],mix(col,'#5a7a30',.3),1.4,{ink,curl:.25});
  if(Ad[2]<0)beak();
  bzFruit(k,O,Ad,hl,r,cw.bl&&m>.6?mix(col,cw.bl,.35):col,{egg:-.1,gl:.2,big:2.5,ink,paint:(q,c,E1,E2,mj,rr)=>{if(LOD)return;/* the suture, down one side */const s=.3;
      E('path',{d:`M${f(c[0]-E1[0]*mj*.85+E2[0]*rr*s)},${f(c[1]-E1[1]*mj*.85+E2[1]*rr*s)}Q${f(c[0]+E2[0]*rr*(s+.12))},${f(c[1]+E2[1]*rr*(s+.12))} ${f(c[0]+E1[0]*mj*.92+E2[0]*rr*s*.5)},${f(c[1]+E1[1]*mj*.92+E2[1]*rr*s*.5)}`,fill:'none',stroke:shd(col,-.3),'stroke-width':1.1,'stroke-opacity':.4},q)}});
  if(Ad[2]>=0)beak();
  /* the soft bristles: from points of the visible surface, along their normals bent toward the beak, each a little curved; those on the rim stand out of the silhouette */
  let d='';const ns=LOD?0:dt?120:56;for(let j=0;j<ns;j++){const u=R(-.9,.92),a=R(0,6.283),w=Math.sqrt(1-u*u),nl=V3.nz(V3.add(V3.sc(Ad,u*r/hl),V3.add(V3.sc(X,w*Math.cos(a)),V3.sc(Y,w*Math.sin(a)))));
    if(nl[2]<-.1)continue;const b=V3.add(O,V3.add(V3.sc(Ad,u*hl*.92),V3.add(V3.sc(X,w*Math.cos(a)*r*.93),V3.sc(Y,w*Math.sin(a)*r*.93)))),dir=V3.nz(V3.add(nl,V3.sc(Ad,.55))),bl=len*R(.07,.12),
      e=V3.add(b,V3.sc(dir,bl)),mm=V3.add(V3.add(b,V3.sc(nl,bl*.6)),V3.sc(Ad,bl*.05)),B2=[b[0],-b[1]],E2=[e[0],-e[1]],M2=[mm[0],-mm[1]],dx=E2[0]-B2[0],dy=E2[1]-B2[1],l=Math.hypot(dx,dy)||1,h=(dt?Math.max(.55,len*.012):1.1)/2,nx=-dy/l*h,ny=dx/l*h;
    d+=`M${f(B2[0]+nx)},${f(B2[1]+ny)}Q${f(M2[0]+nx*.7)},${f(M2[1]+ny*.7)} ${f(E2[0])},${f(E2[1])}Q${f(M2[0]-nx*.7)},${f(M2[1]-ny*.7)} ${f(B2[0]-nx)},${f(B2[1]-ny)}Z`}
  if(d)E('path',{d,fill:bc,stroke:shd(col,-.3),'stroke-width':.2,'stroke-opacity':.45},k);return k}
function l89Gom(g,t,o){const cw=cwPick(CW_L89GOM,o),op=Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],C=(o.cm||6)*UPC,Lt=o.spine?blen(o.spine):C*8,
    A=spAxis(o,Lt,{face:R(-.6,.6),bow:(rnd()<.5?-1:1)*R(.05,.12)}),L=A.L,Lfl=Math.min(C*4.5,L*(o.spine?(o.short?.8:.62):.7)),SC=gsCols('#7f9658'),lc='#58803a',sf=o.from||0;
  spStem(A,parts,[sf,.25,.5,.7,.85,1].map(x=>Math.max(sf,x)).filter((x,i,a)=>!i||x>a[i-1]+1e-3),3.6,1.6,SC,1,sf);
  /* pairs of narrow leaves at the nodes, all the way up */
  const nl=Math.max(5,Math.round(L/(C*.75)));for(let i=0;i<nl;i++){const q=i/(nl-1),l=L*(.12+.86*q);const{s,q:fr,r}=l89At(A,l,(i*90+R(-15,15))*D);if(o.spine&&(fr.p[1]<30||s<sf+.02))continue;
    for(const sd of[1,-1]){const rr=V3.sc(r,sd),H=V3.nz(V3.add(V3.sc(rr,.8),V3.sc(fr.T,.75))),U=V3.nz(V3s(fr.T,V3.sc(H,V3.dot(fr.T,H)))),lp=[];
      const pt=bzBlade(fr.p,H,U,C*R(1.15,1.45)*(1-.3*q),.15,lc,{wp:LS_LANCE,fold:.3,droop:.22,arch:.07,ao:.9});pt.z=A.zk(s,pt.z);parts.push(pt)}}
  /* the balloons: one or two per upper node, hanging on curved pedicels */
  const nb=Math.max(3,Math.round(Lfl/(C*.95)));for(let i=0;i<nb;i++){const q=i/Math.max(1,nb-1),l=L-Lfl+Lfl*(.05+.85*q),az=(i*137.5+45+R(-20,20))*D,{s,q:fr,r}=l89At(A,l,az),zk=z=>A.zk(s,z);if(o.spine&&(fr.p[1]<30||s<sf+.02))continue;
    for(let j=0;j<(rnd()<.35?2:1);j++){const age=Math.max(0,Math.min(1,op*1.15-q*.3+R(-.08,.05))),pl=C*R(.42,.6),lr=V3.nz(V3.add(V3.sc(r,.9),V3.sc(V3.cr(fr.T,r),j?.7:R(-.3,.3)))),pq=[],
        K=l89Ped(fr.p,V3.add(V3.sc(lr,.85),V3.sc(fr.T,.45)),fr.T,pl,1.6,1.25,.22,SC,pq,zk),Ad=V3.nz(V3.add(V3.sc(K.H,.35),[0,-1,0])),ln=C*(.45+.55*sm01(age/.8))*R(.9,1.06);
      if(o.spine&&K.pos[1]+Ad[1]*ln<14)continue;parts.push(...pq);parts.push({z:zk(K.pos[2]+Ad[2]*ln*.5),fn:par=>l89Balloon(par,K.pos,Ad,ln,cw,age)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:3.6,bc:SC}}

/* ---------- registers ---------- */
Object.assign(GH,{'scabieuse-etoilee-capsules':l89Scab,'amour-en-cage':l89Phy,'coton':l89Cot,'asclepias':l89Asc,'gomphocarpus':l89Gom});
Object.assign(CWS,{'scabieuse-etoilee-capsules':CW_L89SCA,'amour-en-cage':CW_L89PHY,'coton':CW_L89COT,'asclepias':CW_L89ASC,'gomphocarpus':CW_L89GOM});
Object.assign(SZG,{'scabieuse-etoilee-capsules':[3,3.5,4,4,4.5],'amour-en-cage':[3.5,4,4.5,4.5,5],'coton':[4,4.5,5,5,6],'asclepias':[5,6,6.5,6.5,8],'gomphocarpus':[5,6,6,7,8]});
Object.assign(GHI,{'scabieuse-etoilee-capsules':{form:'sphere',size:1.5,k:'head',rk:1.2,self:45*UPC,tip:.8,fx:3*UPC},'amour-en-cage':{form:'ligne',size:1,k:'plant',self:60*UPC,tip:.55,fx:5*UPC},
  'coton':{form:'sphere',size:1.6,k:'head',rk:1.2,self:60*UPC,tip:.85,fx:3*UPC},'asclepias':{form:'sphere',size:1.6,k:'head',rk:1.1,self:55*UPC,tip:.8,fx:3*UPC},
  'gomphocarpus':{form:'ligne',size:1,k:'plant',self:70*UPC,tip:.6,fx:6*UPC}});
GH_BUDS.add('asclepias');
