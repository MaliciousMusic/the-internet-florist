/* ================= Serre, lot 64 — Orchidées 5, poussées par le L-système (moteur des orchidées de la reprise 3) : ascocenda, rhynchostylis, epidendrum, coelogyne, lycaste ================= */
/* ---------- the spray of lot 64: orchidPlant's raceme (r3a), grown further: a leafy monopodial base (distichous leaves), sheathing bracts on the peduncle,
   a bract at every node, flowers distichous (facing the spray's face) or spiralled round the rachis (facing out), a pendent rachis, a ball of long pedicels, a solitary flower.
   Rules: S → [F Lv /180]×nl [F Bt]×nbt F(peduncle) +lean A(0)
          A(i<n) → F(li) Nb [ /φ(i) &α(i) F(pedicel) K(age_i) ] /δ A(i+1)   A(n) → F(tip)   (φ: ±90 distichous or i·137.5 spiral; α from P.pa or P.paf(q)) ---------- */
const L64_W=w=>Math.max(1.15,w);/* nothing finer than 1.15 units: a thinner axis breaks off on the bouquet's raster */
function l64Plant(g,t,o,P){const cw=o.cw||cwNear(P.list,o.col)||P.list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||P.cm)*UPC,k=G(g),sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:L64_W(D*P.sw*1.4),cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B,O,D2,op2)=>P.flower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const solo=!!P.solo,nk=o.nk||1,nf=op<.3?0:solo?1:op<.7?Math.max(1,Math.ceil(P.nf[0]*nk*.5)):Math.round(R(P.nf[0],P.nf[1])*nk),nb=solo?(op<.3?1:0):P.nb+(op<.3?2:0),n=nf+nb,
    kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(P.pd0+(P.kl??.5))))):1,li=D*P.li*kr,sd=rnd()<.5?-1:1,W=x=>L64_W(D*P.sw*x),nl=P.leaves||0,nbt=P.bracts||0,pl=D*P.pd0*kr/(nbt+1);
  const rules={S:()=>{const out=[];for(let j=0;j<nl;j++)out.push(['F',{l:D*(P.ll0||.14)*kr,w0:W(2.1),w1:W(2),e:.005}],['[',{}],['/',{a:90}],['&',{a:(P.leafAng||58)-j*6+R(-6,6)}],['Lv',{j}],[']',{}],['/',{a:180+R(-8,8)}]);
      for(let j=0;j<nbt;j++)out.push(['F',{l:pl*R(.85,1.1),w0:W(1.5),w1:W(1.4),e:P.pe??.02}],['Bt',{j}]);
      const ln=sd*(P.lean||22)*R(.8,1.2);out.push(['F',{l:pl*.6,w1:W(1.35),e:P.pe??.02}]);for(let j=0;j<4;j++)out.push(['F',{l:pl*.1,w1:W(1.3),e:P.pe??.02}],['+',{a:ln/4}]);out.push(['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return solo?[]:[['F',{l:li*.5,w1:W(.5),e:P.e}]];const fl=p.i<nf,age=fl?1-.1*p.i:.34*(1-(p.i-nf)/Math.max(1,nb)),q=p.i/Math.max(1,n-1);
      const roll=P.spiral?p.i*137.5+R(-12,12):(p.i%2?90:-90)*sd+R(-15,15),pa=(P.paf?P.paf(q,fl):fl?P.pa:P.pa*.7)+R(-6,6);
      return[['F',{l:li*(fl?1:P.lb??.62)*R(.9,1.1),w1:W(1.25-.6*q),e:p.i?P.e:.01}],...(P.nodeBract?[['Nb',{i:p.i,fl}]]:[]),['[',{w:W(.55)}],['/',{a:roll}],['&',{a:pa}],
        ['F',{l:D*(fl?P.ped:P.ped*(P.pbk??.75))*kr,w1:W(.45),e:fl?(P.pde??.05):-.04}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:R(-12,12)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+4),{p:[0,0,0],H:up,U:U0,wig:P.wig??.025,seg:D*(P.seg||.12),T:[0,1,0],e:.01,w:W(2)}),pc=P.pedc?(c=>[shd(c,-.5),shd(c,-.2),c,shd(c,.35)])(P.pedc(cw)):sc;for(const ch of res.chains)ch.c=ch.ord>0?pc:sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  /* the flower's frame: distichous sprays face the spray's face (orchidPlant), spiralled ones look out along their pedicel; the top of every flower toward the sky, its lip down */
  const fFrame=og=>{const Z=P.out?V3.nz(V3.add(V3.add(V3.sc(og.H,P.out),V3.sc(face,1-P.out*.75)),[R(-.06,.06),R(-.05,.05),0])):V3.nz(V3.add(V3.add(V3.sc(face,.82),V3.sc(og.H,.3)),[R(-.08,.08),R(-.06,.06),0]));
    let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<.2)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.12,.12)+(P.rollJ||0)*R(-1,1),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const sz=1-P.grade*og.p.i/Math.max(1,nf),Bf=fFrame(og);return{parts:[{z:pos[2]+Bf[2][2]*D*sz*.2,fn:par=>P.flower(par,Bf,pos,D*sz,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=lsFrame(og,null,0),s=D*P.bs*(.45+1.6*a)*(solo?1.6:1);return{parts:[{z:pos[2],fn:par=>P.bud?P.bud(par,Bf,pos,s,cw,a):phalBud(par,Bf,pos,s,{c:P.budc?P.budc(cw,a):mix(cw.c,'#b8c48a',.55-.8*a)})}]}}
    if(og.t==='Lv'&&P.leaf){const pt=P.leaf(og,pos,D,kr);return pt?{ext:1,parts:[].concat(pt)}:null}
    if(og.t==='Bt'){const pt=l64Sheath(og,pos,D*(P.btl||.5)*kr,W(1.4),P.btc||sc);return{ext:1,parts:[pt]}}
    if(og.t==='Nb'&&P.nodeBract){const pt=P.nodeBract(og,pos,D,sc);return pt?{parts:[].concat(pt)}:null}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}
/* a sheathing bract round the peduncle: a short sleeve a little wider than the axis, closing to a point (drawn with the stem) */
function l64Sheath(og,pos,len,w,sc){const F={k:null,B:I3,O:[0,0,0],parts:[]},H=og.H,b=V3.add(pos,V3.sc(H,-len*.15)),Q=[b,V3.add(b,V3.sc(H,len*.45)),V3.add(V3.add(b,V3.sc(H,len)),V3.sc(og.U,w*.35))];
  return tube3(F,Q,q=>Math.max(.6,w*(.72-.5*q*q)),{cols:[sc[1],mix(sc[2],'#c8b88a',.35),mix(sc[3],'#d8c8a0',.4)],cap:1,hl:.3,dk:.4,spec:.15,ink:sc[0],eo:.4,cast:0,zb:.2})}
/* ---------- small flowers kept light (dense sprays): each group of segments one flat outline, one tone from its facing, its spots on top ---------- */
function l64Out(F,S,nv=7){const L=[],Rr=[];for(let i=0;i<=nv;i++){const v=i/nv;L.push(PJ3(F,S(-1,v)));Rr.push(PJ3(F,S(1,v)))}return L.concat(Rr.reverse())}
function l64Nrm(F,S,u=0,v=.5){const du=V3s(S(u+.05,v),S(u-.05,v)),dv=V3s(S(u,v+.05),S(u,Math.max(0,v-.05)));return V3.nz(toV(F.B,V3.cr(du,dv)))}
function l64Grp(F,Ss,pal,o={}){const outs=Ss.map(S=>l64Out(F,S,o.nv)),N=Ss.map(S=>l64Nrm(F,S));let nz=0,z=0,c=0;for(const n of N)nz+=n[2];const front=nz>=0;
  let nr=[0,0,0];for(const n of N)nr=V3.add(nr,V3.sc(n,front?1:-1));nr=V3.nz(nr);for(const P of outs)for(const p of P){z+=p[2];c++}
  const tone=toneAt(front?pal:(o.palB||pal),lightI(nr)+(o.dI||0));
  return{z:z/c+(o.zb||0),cast:0,fn:par=>{const d=outs.map(P=>smooth(P.map(p=>[p[0],p[1]]))).join('');E('path',{d,fill:tone,stroke:o.ink||pal.ink,'stroke-width':o.ew??.3,'stroke-opacity':o.eo??.38,'stroke-linejoin':'round'},par);
    if(front&&o.paint)o.paint(par,outs)}}}
/* dots on segments (u,v) seen from the front, one path */
function l64Dots(F,Ss,col,D,o={}){let dd='';const n=o.n||6;Ss.forEach((S,si)=>{if(l64Nrm(F,S)[2]<0)return;for(let k=0;k<n;k++){const h=Math.abs(Math.sin((k+1)*12.99+si*7.7+(o.seed||0))),v=(o.v0??.25)+(o.v1??.9-(o.v0??.25))*h,u=Math.sin((k+1)*78.23+si*3.1)*.62,c=PJ3(F,S(u,v)),r=D*(o.r||.028)*(.7+.5*Math.abs(Math.sin(k*5.1+si)));
    dd+=`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r*.85)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r*.85)} 0 1,0 ${f(-2*r)},0`}});return dd}

/* ---------- Ascocenda (× Ascocenda = Vanda × Ascocentrum): an upright raceme of round flat flowers, 3.5 to 5 cm, five broad sub-equal segments overlapping,
   often tessellated (Vanda) or spotted, a small fleshy three-lobed lip with a short spur behind (Ascocentrum); the leafy monopodial stem, its leaves distichous, V-folded, notched at the tip ---------- */
const CW_L64ASC=[
 {id:'orange',n:'Orange',c:'#f07a22',lip:'#c43c14'},{id:'mandarine',n:'Mandarine réticulé',c:'#f49a34',tess:'#c84a14',lip:'#b02a10'},
 {id:'rouge',n:'Rouge',c:'#c8262c',tess:'#8a0c16',lip:'#7a0a12'},{id:'rose-vif',n:'Rose vif',c:'#e04a8a',lip:'#a01a50'},
 {id:'magenta',n:'Magenta réticulé',c:'#c8307a',tess:'#7a0a44',lip:'#6a0a3a'},{id:'pourpre',n:'Pourpre',c:'#8a2a7a',tess:'#5a0a4a',lip:'#4a0a3a'},
 {id:'bleu',n:'Bleu-violet réticulé',c:'#7a6ac8',tess:'#3e2e90',lip:'#4a2a7a'},{id:'jaune',n:'Jaune',c:'#f2c430',lip:'#d0701a'},
 {id:'jaune-tache',n:'Jaune tacheté de rouge',c:'#f2d050',spots:'#b0301a',lip:'#c04a1a'},{id:'rose-pale',n:'Rose pâle réticulé',c:'#f2b8cc',tess:'#c8608a',lip:'#b0306a'},
 {id:'corail',n:'Corail',c:'#f48a6a',lip:'#c0402e'}];
const L64_ASEG=prof([[0,.34],[.18,.78],[.48,1],[.78,.97],[.93,.72],[1,.26]]);
function l64AscoFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e0dcd8',.2)),Pd=pal7(shd(cw.c,-.14)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  const seg=(o,pal,sd2)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal,palB:PcB,nu:7,nv:10,across:1.2,ew:.5,eo:.3,cast:1,paint:orchDeco(F,S,cw,D,sd2)}));return S};
  seg({phi:90+R(-3,3),r0:D*.02,z0:-D*.012,L:r*.84,W:r*.5,wp:L64_ASEG,a0:A(80),a1:A(96),cup:-.1,ruf:.03},Pc,1);
  for(const s of[-1,1])seg({phi:270+s*40,r0:D*.02,z0:-D*.014,L:r*.88,W:r*.54,wp:L64_ASEG,a0:A(82),a1:A(96),cup:-.08,ruf:.03,tw:s*4},cw.tess?Pd:Pc,2+s);
  for(const s of[-1,1])seg({phi:90-s*60,r0:D*.02,z0:D*.004,L:r*.82,W:r*.48,wp:L64_ASEG,a0:A(82),a1:A(95),cup:-.08,ruf:.04,tw:-s*6},Pc,5+s);
  if(op>.3){/* the lip: two small erect side lobes, a tongue-like midlobe, a short spur behind; the column white with its anther cap */
    const SL=petS({phi:270,r0:D*.04,z0:D*.04,L:r*.36,W:r*.13,wp:prof([[0,.75],[.3,1],[.65,.8],[1,.35]]),a0:A(40),a1:A(102),cup:-.45});F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:5,nv:6,across:1.4,ew:.45,eo:.45,cast:.6}));
    for(const s of[-1,1]){const SS=petS({phi:270+s*58,r0:D*.03,z0:D*.03,L:r*.13,W:r*.07,a0:A(20),a1:A(46),cup:-.3});F.parts.push(...sheet3(F,SS,{pal:Pl,palB:Pl,nu:3,nv:4,across:1,ew:.4,eo:.4,cast:0,zb:-D*.005}))}
    F.parts.push(tube3(F,[[0,D*.01,D*.02],[0,0,D*.05],[0,-D*.012,D*.064]],Math.max(.6,D*.026),{cols:['#f4f0ea','#fffaf4'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:.5,zb:D*.03}))}
  F.parts.push(tube3(F,[[0,-D*.03,-D*.006],[0,-D*.06,-D*.05],[0,-D*.075,-D*.1]],q=>Math.max(.6,D*(.028-.01*q)),{cols:[Pl.b,Pl.d1],cap:1,hl:.3,dk:.4,spec:.1,ink:Pl.ink,eo:.3,cast:0,zb:-D*.05}));
  render3(F,D*.5);return F}
/* the leaves of the monopodial stem: strap-shaped, V-folded on the midrib, arching, their tip unequally notched */
const L64_STRAP=prof([[0,.52],[.08,.86],[.45,1],[.85,.9],[.96,.62],[1,.38]]);
function l64AscoLeaf(og,pos,D,kr){const len=D*R(2.5,2.9)*(1-.08*og.p.j)*Math.max(.5,kr),ps=[];lsLeafParts(og,len,.14,'#4f6a2e',ps,{O:V3s(pos,og.pos),wp:L64_STRAP,fold:.45,droop:.3,arch:.1,face:.4,gloss:.5});return ps}
const L64P_ASC={list:CW_L64ASC,cm:4.5,nf:[8,11],nb:3,pd0:.9,li:.42,ped:.42,pa:44,e:-.006,lean:8,sw:.06,grade:.05,bs:.3,leaves:3,ll0:.16,kl:1.2,flower:l64AscoFlower,leaf:l64AscoLeaf,scol:['#34452a','#55693c','#7c8e56','#aeba86']};

/* ---------- Rhynchostylis (R. gigantea, R. retusa: the foxtail orchid): a dense cylindrical raceme hanging from a short arching peduncle, 30 to 50 small waxy flowers spiralled round it,
   2 to 3 cm: an elliptic dorsal sepal, broader ovate laterals, narrower petals, all spotted; a fleshy entire lip, darker, with a laterally flattened spur pointing back ---------- */
const CW_L64RHY=[
 {id:'blanc-pourpre',n:'Blanc moucheté de pourpre',c:'#f6f2f4',spots:'#8a1e5a',lip:'#a01e5e'},{id:'blanc',n:'Blanc pur',c:'#f8f6f2',lip:'#f2ece4'},
 {id:'rose-tache',n:'Rose pâle moucheté',c:'#f2cadb',spots:'#a8286a',lip:'#a8205a'},{id:'rouge',n:'Rouge carmin',c:'#8e1e3e',lip:'#6a0e2a'},
 {id:'bleu',n:'Bleu lavande (R. coelestis)',c:'#d8d2ee',tip:'#6a5ab8',lip:'#5a4aa8'}];
const L64_RSEP=prof([[0,.4],[.25,.9],[.6,1],[.88,.7],[1,.2]]),L64_RPET=prof([[0,.35],[.3,.8],[.65,1],[.9,.7],[1,.25]]);
function l64RhyFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:0,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#e4e0d0',.2)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  const sep=[petS({phi:90,r0:D*.03,z0:-D*.01,L:r*.86,W:r*.34,wp:L64_RSEP,a0:A(66),a1:A(88),cup:-.2})];for(const s of[-1,1])sep.push(petS({phi:270+s*44,r0:D*.03,z0:-D*.012,L:r*.84,W:r*.42,wp:L64_RSEP,a0:A(70),a1:A(92),cup:-.18,tw:s*6}));
  const pet=[];for(const s of[-1,1])pet.push(petS({phi:90-s*58,r0:D*.03,z0:D*.004,L:r*.74,W:r*.26,wp:L64_RPET,a0:A(66),a1:A(88),cup:-.15,tw:-s*8}));
  const tip=cw.tip?(g,outs)=>{/* R. coelestis: every segment tipped violet-blue */let d='';for(const S of sep.concat(pet)){const q=[];for(let i=0;i<=5;i++)q.push(PJ3(F,S(-1,.55+.45*i/5)));for(let i=5;i>=0;i--)q.push(PJ3(F,S(1,.55+.45*i/5)));d+=smooth(q.map(p=>[p[0],p[1]]))}E('path',{d,fill:cw.tip,opacity:.75},g)}:null;
  const dots=cw.spots?(Ss,seed)=>(g)=>{const dd=l64Dots(F,Ss,cw.spots,D,{n:8,seed,r:.026});if(dd)E('path',{d:dd,fill:cw.spots,opacity:.9},g)}:()=>null,pnt=(Ss,sd2)=>{const dt=dots(Ss,sd2);return(g,outs)=>{if(dt)dt(g);if(tip)tip(g,outs)}};
  F.parts.push(l64Grp(F,sep,Pc,{palB:PcB,paint:cw.spots||cw.tip?(g,o)=>pnt(sep,1)(g,o):null}),l64Grp(F,pet,Pc,{palB:PcB,zb:D*.01,paint:cw.spots||cw.tip?(g,o)=>pnt(pet,2)(g,o):null}));
  if(op>.3){const SL=petS({phi:270,r0:D*.03,z0:D*.03,L:r*.6,W:r*.15,wp:prof([[0,.45],[.3,.8],[.7,1],[.92,.75],[1,.3]]),a0:A(40),a1:A(98),cup:-.35}),SP=petS({phi:270,r0:D*.02,z0:-D*.01,L:r*.42,W:r*.09,a0:160,a1:172,cup:-.2});
    F.parts.push(l64Grp(F,[SL],Pl,{zb:D*.04,ew:.45,eo:.5}),l64Grp(F,[SP],Pl,{zb:-D*.08}),l64Grp(F,[petS({phi:90,r0:0,z0:D*.02,L:r*.2,W:r*.1,a0:8,a1:22,cup:-.3})],pal7('#f6f2ec'),{zb:D*.05}))}
  render3(F,D*.5);return F}
const L64P_RHY={list:CW_L64RHY,cm:2.4,nf:[38,46],nb:6,pd0:1.4,li:.2,ped:.3,pa:66,e:-.2,lean:62,sw:.06,grade:.25,bs:.36,spiral:1,out:.72,kl:5,lb:.45,pbk:.6,pde:.02,seg:.24,wig:.015,flower:l64RhyFlower,
  budc:(cw,a)=>mix(cw.c,'#c4cc98',.5-.6*a),scol:['#34452a','#55693c','#7c8e56','#aeba86']};

/* ---------- Epidendrum (E. ibaguense, E. radicans and their hybrids: the crucifix orchid): a ball of small starry flowers on long pedicels at the top of a long thin reed-like stem,
   2.5 to 3.5 cm: narrow spreading sepals and petals, the lip cross-shaped (three lobes, the midlobe notched), all its margins fringed, a yellow callus; the column fused to the lip ---------- */
const CW_L64EPI=[
 {id:'orange',n:'Orange',c:'#f07a22',cal:'#f6d040'},{id:'rouge',n:'Rouge',c:'#c8282a',cal:'#f2c430'},{id:'rouge-orange',n:'Rouge orangé',c:'#e0482a',cal:'#f4c838'},
 {id:'jaune',n:'Jaune',c:'#f2c430',cal:'#f08a20'},{id:'rose',n:'Rose',c:'#e888b0',cal:'#f6e2a0'},{id:'fuchsia',n:'Fuchsia',c:'#c8348a',cal:'#f4d04a'},
 {id:'lavande',n:'Lavande',c:'#b880c0',cal:'#f4e6a8'},{id:'blanc',n:'Blanc',c:'#f6f4ee',cal:'#f2d860'}];
const L64_ESEG=prof([[0,.3],[.3,.7],[.65,1],[.88,.8],[1,.25]]);
function l64EpiLip(r,o2){/* the cruciform lip in its own plane: two fan-shaped side lobes, a broad notched midlobe, all edges cut into a fringe (one closed outline) */
  const P=[],N=150,dA=(x,y)=>((x-y+540)%360)-180,lob=(x,w)=>Math.exp(-Math.pow(x/w,2));for(let i=0;i<N;i++){const a=i/N*6.283,ad=a/D2R,
      side=Math.max(lob(dA(ad,-12),30),lob(dA(ad,192),30)),mid=lob(dA(ad,270),34)*1.1,top=lob(dA(ad,90),40),notch=1-.4*lob(dA(ad,270),7),
      base=Math.max(.42-.2*top,Math.max(side*.92,mid*notch)),w=Math.min(1,(side+mid)*1.4),fr=1+.11*w*(i%2?1:-1);
    const rr=r*base*fr*(.55+.45*o2);P.push([Math.cos(a)*rr,Math.sin(a)*rr])}return P}
function l64EpiFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:0,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e4e0d0',.15)),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.3+.7*o2),r=D/2;
  const ss=[];for(const[ph,L,W2]of[[90,.86,.22],[218,.84,.24],[322,.84,.24],[150,.8,.16],[30,.8,.16]])ss.push(petS({phi:ph+R(-5,5),r0:D*.03,z0:ph===150||ph===30?D*.004:-D*.01,L:r*L,W:r*W2,wp:L64_ESEG,a0:A(76),a1:A(100),cup:-.15,tw:R(-10,10)}));
  F.parts.push(l64Grp(F,ss,Pc,{palB:PcB,nv:6}));
  if(op>.3){/* the lip held below the column, tilted forward a little: a plane through the column's tip */
    const lc=[0,-r*.46,D*.09],tl=-.42,ly=[0,Math.cos(tl),Math.sin(tl)],lx=[1,0,0],pts=l64EpiLip(r*.66,o2).map(([x,y])=>PJ3(F,V3.add(lc,V3.add(V3.sc(lx,x),V3.sc(ly,y))))),
      nz=toV(B,V3.cr(lx,ly))[2],tone=toneAt(nz>=0?Pc:PcB,lightI(V3.nz(toV(B,V3.cr(lx,ly))))+.06);let z=0;for(const p of pts)z+=p[2];
    const cal=[[0,.2],[.1,.06],[.05,-.12],[0,-.18],[-.05,-.12],[-.1,.06]].map(([x,y])=>PJ3(F,V3.add(lc,V3.add(V3.sc(lx,x*r),V3.sc(ly,y*r+r*.02))))),col=[[0,0,D*.02],[0,-r*.22,D*.07],[0,-r*.36,D*.09]];
    F.parts.push({z:z/pts.length+D*.04,cast:0,fn:par=>{E('path',{d:smooth(pts.map(p=>[p[0],p[1]])),fill:tone,stroke:Pc.ink,'stroke-width':.3,'stroke-opacity':.3,'stroke-linejoin':'round'},par);
      if(nz>=0)E('path',{d:smooth(cal.map(p=>[p[0],p[1]])),fill:cw.cal,stroke:shd(cw.cal,-.4),'stroke-width':.3,'stroke-opacity':.5},par)}});
    F.parts.push(tube3(F,col,Math.max(.6,D*.04),{cols:[Pc.d1,Pc.b],cap:1,hl:.4,dk:.3,spec:.3,ink:Pc.ink,eo:.35,cast:0,zb:D*.03}))}
  render3(F,D*.5);return F}
/* the ball: the oldest flowers at its base point out and down, the youngest and the buds point up at its top */
const L64P_EPI={list:CW_L64EPI,cm:2.8,nf:[20,26],nb:7,pd0:7,li:.045,ped:.6,pa:60,paf:(q,fl)=>fl?118-92*q:34-22*q,e:-.004,lean:3,sw:.07,grade:.14,bs:.3,spiral:1,out:.86,kl:.6,lb:.6,pbk:.7,pde:.03,bracts:3,btl:1.2,seg:.3,flower:l64EpiFlower,
  pedc:cw=>mix('#6a8a44',cw.c,.3),budc:(cw,a)=>mix(cw.c,'#a8b878',.25-.3*a),scol:['#33472a','#536a3a','#7a8e54','#acba84']};

/* ---------- Coelogyne (C. cristata, C. flaccida, C. mooreana, C. pandurata): a pendent raceme of 5 to 9 flowers, 5 to 8 cm, white and waxy, each in the axil of a papery bract;
   sepals and petals oblong, wavy, half spread; the lip three-lobed, its side lobes erect round the column, the midlobe broad and recurved, keeled with fringed crests, yellow, orange or brown ---------- */
const CW_L64COE=[
 {id:'cristata',n:'Blanc à crêtes jaunes',c:'#f8f8f4',lip:'#fbfaf4',keel:'#f0b828',disk:'#f6d050'},{id:'citron',n:'Blanc à crêtes citron',c:'#f8f8f2',lip:'#fbfaf2',keel:'#e2d84a',disk:'#f0ec90'},
 {id:'mooreana',n:'Blanc à gorge orangée',c:'#f9f8f4',lip:'#fbf8f2',keel:'#f09a20',disk:'#f4b030'},{id:'flaccida',n:'Crème à labelle brun',c:'#f4eedc',lip:'#f6f0e0',keel:'#e0a830',disk:'#e8c060',lv:'#8a4a1a'},
 {id:'pandurata',n:'Vert jade à labelle noir',c:'#b8cc6a',lip:'#c8d878',keel:'#2a1a12',disk:'#3a2a18',lv:'#2a1a10'},{id:'ochracea',n:'Blanc à yeux ocre',c:'#f8f6f0',lip:'#faf6ee',keel:'#e89a2a',disk:'#f0b040',eye:'#d0701e'}];
const L64_CSEP=prof([[0,.3],[.2,.75],[.5,1],[.82,.8],[1,.18]]),L64_CPET=prof([[0,.22],[.25,.6],[.55,1],[.85,.75],[1,.15]]);
function l64CoeFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.14,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#e2e2d2',.2)),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.3+.7*o2),r=D/2;
  const seg=(o,sd2)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:6,nv:10,across:1.3,ew:.45,eo:.3,cast:1}));return S};
  seg({phi:90+R(-3,3),r0:D*.02,z0:-D*.012,L:r*.9,W:r*.3,wp:L64_CSEP,a0:A(58),a1:A(84),cup:-.18,ruf:.07,rk:4},1);
  for(const s of[-1,1])seg({phi:270+s*36,r0:D*.02,z0:-D*.014,L:r*.88,W:r*.3,wp:L64_CSEP,a0:A(62),a1:A(88),cup:-.15,ruf:.07,rk:4,tw:s*8},2+s);
  for(const s of[-1,1])seg({phi:90-s*62,r0:D*.02,z0:D*.004,L:r*.86,W:r*.22,wp:L64_CPET,a0:A(64),a1:A(96),cup:-.1,ruf:.1,rk:5,tw:-s*14},5+s);
  if(op>.3){/* the lip: side lobes cupped round the column, the midlobe recurved; the crests run from its base onto the midlobe */
    const SL=petS({phi:270,r0:D*.03,z0:D*.03,L:r*.66,W:r*.3,wp:prof([[0,.55],[.3,1],[.55,.78],[.72,.9],[.9,.75],[1,.3]]),a0:A(24),a1:A(118),pw:1.2,cup:-.55,ruf:.06,rk:6});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:7,nv:10,across:1.4,ew:.5,eo:.4,cast:.8,paint:(g,front)=>{if(!front||LOD)return;
      const blot=[];for(let i=0;i<=6;i++)blot.push(PJ3(F,SL(-.55+1.1*i/6,.42+.1*Math.sin(i/6*Math.PI))));for(let i=6;i>=0;i--)blot.push(PJ3(F,SL(-.5+1*i/6,.86)));
      E('path',{d:smooth(blot.map(p=>[p[0],p[1]])),fill:cw.disk,opacity:.55},g);
      let kd='',fd='';for(const u of[-.3,-.1,.1,.3]){const q=[.08,.3,.5,.68].map(v=>PJ3(F,SL(u*(1-.3*v),v)));kd+=smooth(q.map(p=>[p[0],p[1]]),false);for(let j=0;j<5;j++){const v=.4+.06*j,c=PJ3(F,SL(u*(1-.3*v),v));fd+=`M${f(c[0]-D*.012)},${f(c[1])}h${f(D*.024)}`}}
      E('path',{d:kd,stroke:cw.keel,'stroke-width':f(D*.018),fill:'none','stroke-linecap':'round'},g);E('path',{d:fd,stroke:shd(cw.keel,-.2),'stroke-width':f(D*.008),fill:'none','stroke-linecap':'round'},g);
      if(cw.lv){let vd='';for(const u of[-.7,-.5,.5,.7]){const q=[.15,.4,.62].map(v=>PJ3(F,SL(u,v)));vd+=smooth(q.map(p=>[p[0],p[1]]),false)}E('path',{d:vd,stroke:cw.lv,'stroke-width':f(D*.008),'stroke-opacity':.7,fill:'none'},g)}
      if(cw.eye)for(const s of[-1,1]){const c=PJ3(F,SL(s*.42,.36));E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(D*.035),ry:f(D*.028),fill:cw.eye,opacity:.8},g)}}}));
    F.parts.push(tube3(F,[[0,D*.012,D*.01],[0,-D*.03,D*.07],[0,-D*.07,D*.1]],q=>Math.max(.6,D*(.026+.01*q)),{cols:['#f6f4ee','#fffdf8'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a8a090',eo:.35,cast:.5,zb:D*.035}))}
  render3(F,D*.5);return F}
/* the floral bract: a papery boat at each node, pale green to straw */
function l64CoeBract(og,pos,D,sc){const F={k:null,B:I3,O:V3s(pos,og.pos)},S=lsLeafS(og,D*.32,.32,{wp:prof([[0,.6],[.3,1],[.7,.7],[1,.1]]),fold:.6,droop:-.05,arch:.1,face:.3});
  return l64Grp(F,[S],pal7('#c8cc9a'),{palB:pal7('#b8bc88'),ew:.4,eo:.5,zb:-.5})}
const L64P_COE={list:CW_L64COE,cm:6.5,nf:[5,8],nb:2,pd0:1.1,li:.5,ped:.34,pa:40,e:-.08,lean:48,sw:.045,grade:.08,bs:.3,kl:2,lb:.55,pde:.02,seg:.14,nodeBract:l64CoeBract,bracts:1,btl:.4,flower:l64CoeFlower,
  budc:(cw,a)=>mix(cw.c,'#c8d0a0',.4-.6*a),scol:['#34452a','#55693c','#7c8e56','#aeba86']};

/* ---------- Lycaste (L. skinneri = virginalis, L. aromatica and the Shoalhaven hybrids): one big triangular flower, 10 to 15 cm, on an upright peduncle sheathed by bracts;
   three broad waxy sepals spread as a triangle, the two petals much smaller held forward round the column, their tips flared; a small lip with a tongue-shaped callus ---------- */
const CW_L64LYC=[
 {id:'blanc',n:'Blanc (virginalis alba)',c:'#f8f6f0',pet:'#fbfaf6',lip:'#f6f0e4',cal:'#f2d070'},{id:'rose',n:'Rose (skinneri)',c:'#f0c8d4',pet:'#e690ac',lip:'#ec9cb6',dots:'#a01a50',cal:'#f4e4ea'},
 {id:'rose-vif',n:'Rose vif',c:'#e898b4',pet:'#cc4474',lip:'#d05c86',dots:'#8a0a3a',cal:'#f6dce4'},{id:'rouge',n:'Rouge',c:'#b8283a',pet:'#a01a2c',lip:'#8a1424',cal:'#f0c040'},
 {id:'jaune',n:'Jaune (aromatica)',c:'#f0cc4a',pet:'#eab22c',lip:'#e89a1c',dots:'#b0501a',cal:'#f4a020'},{id:'vert',n:'Vert pomme',c:'#c4cc78',pet:'#f2f0dc',lip:'#f4f0d8',dots:'#9a4a2a',cal:'#f0d070'},
 {id:'olive',n:'Olive à pétales blancs (macrophylla)',c:'#9a7a44',pet:'#f6f0ea',lip:'#f4ece8',dots:'#a02a4a',cal:'#f0d070'}];
const L64_LSEP=prof([[0,.22],[.18,.62],[.48,1],[.78,.9],[.94,.55],[1,.12]]),L64_LPET=prof([[0,.3],[.3,.8],[.6,1],[.85,.8],[1,.3]]);
function l64LycFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.18,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.08),'#e0dcc8',.2)),Pp=pal7(cw.pet||cw.c),Pl=pal7(cw.lip),o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.3+.7*o2),r=D/2,
    gl=DET>=1.5?{shin:24,k:.7,thr:.3,cu:2,cv:3,nu:8,nv:12,lv:1.6,lu:.5,o:.5}:null;
  const seg=(o,pal,pb,x={})=>{const S=petS(o);F.parts.push(...sheet3(F,S,Object.assign({pal,palB:pb,nu:7,nv:11,across:1.5,ew:.45,eo:.3,cast:1,gloss:gl,rim:[.6,.35]},x)));return S};
  seg({phi:90+R(-3,3),r0:D*.02,z0:-D*.014,L:r*.92,W:r*.34,wp:L64_LSEP,a0:A(58),a1:A(84),cup:-.14,bow:.02},Pc,PcB);
  for(const s of[-1,1])seg({phi:270+s*58,r0:D*.02,z0:-D*.016,L:r*.96,W:r*.36,wp:L64_LSEP,a0:A(66),a1:A(92),cup:-.12,tw:s*10},Pc,PcB);
  for(const s of[-1,1])seg({phi:90-s*46,r0:D*.02,z0:D*.004,L:r*.5,W:r*.24,wp:L64_LPET,a0:A(26),a1:A(74),pw:1.6,cup:-.25,tw:-s*18},Pp,pal7(mix(cw.pet||cw.c,'#e8e4d4',.2)),
    {paint:cw.dots?(g,front,X)=>{if(!front||LOD)return;const dd=l64Dots(F,[X.S],cw.dots,D,{n:9,v0:.05,v1:.45,r:.01,seed:s});if(dd)E('path',{d:dd,fill:cw.dots,opacity:.7},g)}:null});
  if(op>.3){const SL=petS({phi:270,r0:D*.03,z0:D*.03,L:r*.5,W:r*.17,wp:prof([[0,.6],[.35,1],[.6,.68],[.8,.85],[1,.35]]),a0:A(26),a1:A(116),pw:1.3,cup:-.5});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:6,nv:8,across:1.4,ew:.5,eo:.4,cast:.7,paint:(g,front)=>{if(!front||LOD)return;const c=[.1,.25,.4].map(v=>PJ3(F,SL(0,v)));
      E('path',{d:smooth(c.map(p=>[p[0],p[1]]),false),stroke:cw.cal,'stroke-width':f(D*.022),fill:'none','stroke-linecap':'round'},g);
      if(cw.dots){const dd=l64Dots(F,[SL],cw.dots,D,{n:10,v0:.1,v1:.85,r:.008,seed:3});if(dd)E('path',{d:dd,fill:cw.dots,opacity:.75},g)}}}));
    F.parts.push(tube3(F,[[0,D*.01,D*.01],[0,-D*.02,D*.06],[0,-D*.05,D*.09]],q=>Math.max(.6,D*(.03+.008*q)),{cols:[mix(cw.pet||cw.c,'#f8f4ec',.6),'#fffaf2'],cap:1,hl:.45,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:.5,zb:D*.04}))}
  render3(F,D*.5);return F}
/* the bud: a plump triangular bud, its three sepals closed in a keeled cone */
function l64LycBud(par,B,O,s,cw,a){const F={k:G(par),B,O,parts:[],so:.14,sd:null},c=mix(cw.c,'#b8c488',.45-.4*a),P=pal7(c),PB=pal7(shd(c,-.1));
  for(let i=0;i<3;i++){const ph=90+i*120,S=(u,v)=>{const w=s*.34*Math.sin(Math.PI*Math.min(.98,.08+.9*v))**.8*(1-.3*v),ang=ph*D2R+u*.95,rr=w*(1-.25*u*u);return[Math.cos(ang)*rr,Math.sin(ang)*rr,v*s*1.3-s*.25]};
    F.parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:5,nv:8,across:1.3,ew:.5,eo:.4,cast:.5}))}
  render3(F,s*.5);return F}
const L64P_LYC={list:CW_L64LYC,cm:12,nf:[1,1],nb:0,solo:1,pd0:1.25,li:.12,ped:.16,pa:22,e:.004,lean:6,sw:.04,grade:0,bs:.28,bracts:3,btl:.3,kl:1,pde:.01,flower:l64LycFlower,bud:l64LycBud,scol:['#34452a','#55693c','#7c8e56','#aeba86']};

/* ---------- registers ---------- */
/* the foxtail is sold by the length of its raceme, the crucifix orchid by the width of its ball: the flowers grow a little with it, their number most */
const l64Size=(o,c0,f0)=>{const q=(o.cm||c0)/c0;return Object.assign({},o,{cm:f0*Math.pow(q,.35),nk:Math.pow(q,.65)})};
Object.assign(GH,{'ascocenda':(g,t,o)=>l64Plant(g,t,o,L64P_ASC),'rhynchostylis':(g,t,o)=>l64Plant(g,t,l64Size(o,25,2.4),L64P_RHY),
  'epidendrum':(g,t,o)=>l64Plant(g,t,l64Size(o,8,2.8),L64P_EPI),'coelogyne':(g,t,o)=>l64Plant(g,t,o,L64P_COE),'lycaste':(g,t,o)=>l64Plant(g,t,o,L64P_LYC)});
Object.assign(CWS,{'ascocenda':CW_L64ASC,'rhynchostylis':CW_L64RHY,'epidendrum':CW_L64EPI,'coelogyne':CW_L64COE,'lycaste':CW_L64LYC});
Object.assign(SZG,{'ascocenda':[3.5,4,4.5,5],'rhynchostylis':[20,25,25,30],'epidendrum':[6,8,8,10],'coelogyne':[5,6.5,6.5,8],'lycaste':[10,12,12,14]});
GHI['rhynchostylis']={form:'orchidee',size:1.9,k:'head',rk:.75};GHI['epidendrum']={form:'sphere',size:1.8,k:'head',rk:1.1};
for(const id of['ascocenda','rhynchostylis','epidendrum','coelogyne','lycaste'])GH_BUDS.add(id);
