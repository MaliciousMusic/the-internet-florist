/* ================= Serre, lot 73 — palmes 1 : palmier areca (Dypsis lutescens), Chamaedorea elegans « chico », palmier dattier nain (Phoenix roebelenii), Licuala grandis, Livistona rotundifolia ================= */
/* chaque palme est poussée par le L-système : le pétiole puis le rachis suivent leur axe (épine du Composer, arc d'une planche), ses nœuds portent les folioles alternées ou subopposées, pliées en V (induplication),
   ou les acanthophylles (épines du dattier) ; l'éventail des palmiers palmés est l'organe terminal du pétiole : plis rayonnant de l'hastule, bord crénelé (Licuala) ou divisé en segments bifides retombants (Livistona, costapalmé).
   La jeune palme sort en lance (folioles serrées le long du rachis, éventail replié en accordéon) puis s'étale. Moteurs réutilisés : l58 (fougères : axe, nappes de pennes, lots par ton), l44 (croissance sur l'axe), fg (lot 24),
   sunPalm (éventail plissé), t34 (grande feuille sur pétiole). Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l73Op=o=>Math.max(.05,Math.min(1,o.op??1));
/* ---------- the pinnate leaf grower shared by the three feather palms. X: cws, cm (the leaf's length, petiole included), arch, bow, u0 (the petiole's share), w0 w1, dl dt (the step between leaflets and its shortening),
   pr (leaflets in pairs: the second of a pair a hair further), pl(q) (a leaflet's length in blade lengths, q from the base to the tip of the blade), ang(q) dih (angle to the rachis, and up out of its plane: the V of the leaf),
   jit (leaflets set in a few planes, Phoenix), ol tw fold cup droop (the leaflet: outline, twist, induplicate fold, cup, drooping tip), spn {n, l, c} (acanthophylls: spines replacing the lowest leaflets) ---------- */
function l73Pinnate(g,t,o,X){const cw=fgCw(X.cws,o),op=l73Op(o),cm0=X.cm,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,X.id,()=>{const yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),Lt=o.spine?blen(o.spine):cm0*UPC*ks,
      A=l58Axis(o,Lt,(rnd()<.5?-1:1)*R(X.arch[0],X.arch[1])*(1-.75*yg),X.bow*R(.8,1.2)*(1-.7*yg)),Le=A.L,l0=A.l0||0,lb=l0+(Le-l0)*(o.spine?X.u0*.8:X.u0),Lb=Le-lb,
      cols=l44Cols(cw.st),lim=g35Lim(o),P=pal7(cw.c),PB=pal7(cw.b),C={P,PB,lv:det?4:3,gl:cw.gl??X.gl,lim,wr:cw.wr||X.ol.wr},nodes=[],kind=[];
    /* the acanthophylls: on the last stretch of the petiole, below the first leaflets, spines grading into leaflets */
    if(X.spn){const n=X.spn.n,z0=lb-Lb*X.spn.z;for(let i=0;i<n;i++){nodes.push(z0+(lb-z0)*i/n);kind.push(1)}}
    for(let x=lb,j=0;x<Le-.03*Lb;j++){nodes.push(x);kind.push(0);const q=(x-lb)/Lb,st=Lb*X.dl*(1-X.dt*q)*R(.92,1.08);x+=X.pr&&j%2===0?st*X.pr:st*(X.pr?2-X.pr:1)}
    /* the young leaf (a spear): its leaflets held up along the rachis, folded shut, not yet drooping; they spread with the stage */
    const fy=1-.18*yg,sp=1-.9*yg,rules={},pinO=c=>({tw:(X.tw+R(-8,8))*D*sp,fold:X.fold+.5*yg,cup:X.cup*sp,arch:X.archP||0,droop:X.droop*R(.8,1.2)*(1-yg),wave:0});
    const res=l44Main(A,nodes,{w0:X.w0*Math.min(1.1,kz),w1:X.w1,cols,step:o.spine?8:6,depth:4,rules,
      node:(i,u,w)=>{const x=nodes[i],s=i%2?1:-1;
        if(kind[i]){const qq=i/X.spn.n;return[['[',{}],['+',{a:s*(X.spn.a+R(-6,6))*(.4+.6*sp)}],['&',{a:X.dih*.6+R(-6,6)}],['Sp',{L:X.spn.l*UPC*kz*(.55+.6*qq)*R(.85,1.1),qq}],[']',{}]]}
        const q=(x-lb)/Lb,Lp=X.pl(q)*Lb*fy*R(.94,1.06),a=X.ang(q)*sp+4*yg+R(-4,4),dh=(X.dih+(X.jit?R(-X.jit,X.jit):0))*sp+R(-4,4);
        return[['[',{}],['+',{a:s*a}],['&',{a:dh}],['Pa',{q,s,L:Lp}],[']',{}]]}});
    /* the leaflets, the spines */
    const polys=[],add=r=>{if(r)polys.push(...r)},lo=!det,ols=[0,1,2].map(()=>l58Ol(Object.assign({},X.ol,{wr:C.wr}),lo)),olT=l58Ol(Object.assign({},X.ol,{wr:C.wr*.9,au:0,fa:0}),lo),spk=[];
    for(const og of res.organs){
      if(og.t==='Pa')add(l58Pin(og,og.p.L,ols[Math.floor(rnd()*3)],-og.p.s,pinO(0),C));
      else if(og.t==='T'){const len=X.pl(1)*Lb*fy*1.3;add(l58Pin(og,len,olT,1,pinO(0),C))}
      else if(og.t==='Sp'){const H=V3.nz(og.H),[a1,a2]=fgCross(H),b=Math.max(.75,og.w*.45),tip=V3.add(og.pos,V3.sc(H,og.p.L)),pts=[V3.add(og.pos,V3.sc(a1,b)),V3.add(V3.add(og.pos,V3.sc(H,og.p.L*.35)),V3.sc(a2,b*.7)),tip,V3.add(og.pos,V3.sc(a1,-b)),V3.add(og.pos,V3.sc(a2,-b*.7))];
        if(lim!=null&&pts.some(p=>p[1]<lim))continue;spk.push({pts:pts.map(fgQ),z:pts.reduce((a,p)=>a+p[2],0)/5})}}
    const parts=[],away=A.at(.6).Fr[2]<0;l58Rachis(res.chains[0],cols,parts,away?3:.4,null);
    /* the spines: stiff, yellowish, glossy at their base, each set on the rachis */
    if(spk.length){const sc=X.spn.c;for(const q of spk)parts.push({z:q.z+.2,cast:false,fn:par=>E('path',{d:fgD(q.pts),fill:sc,stroke:shd(sc,-.45),'stroke-width':.35,'stroke-opacity':.6,'stroke-linejoin':'round'},par)})}
    l58Batch(polys,det?4:3,parts,{ink:shd(cw.c,-.5),eo:.4});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- areca palm (Dypsis lutescens, syn. Chrysalidocarpus lutescens — « palmier areca », golden cane palm): the leaf strongly arched, 60 to 150 cm cut, on a short petiole, yellow like the rachis
   (whence its name), smooth, the rachis channelled above; forty to sixty pairs of leaflets, narrow, linear-lanceolate, long-acuminate, soft, regularly spaced, induplicate (folded in a V along their midrib),
   bright green, held up in a V along the rachis and hanging at their tips like the barbs of a feather. Cut in Costa Rica, Florida, Sri Lanka, sold by the stem ---------- */
const CW_L73DY=[{id:'vert-franc',n:'Vert franc (rachis doré)',c:'#4c7a35',b:'#7a9a5a',st:'#c4b048'},{id:'vert-jaune',n:'Vert jaune (plein soleil)',c:'#86a03c',b:'#a6b46a',st:'#d0b640'}];
const L73_DY={id:'l73dy',cws:CW_L73DY,cm:100,arch:[.34,.46],bow:.22,u0:.2,w0:5,w1:1.2,dl:.0105,dt:.1,pr:0,pl:q=>.36*(.5+.5*Math.sin(Math.min(1,q/.3)*Math.PI/2))*(1-.72*Math.pow(Math.max(0,(q-.55)/.45),1.3)),
  ang:q=>42-10*q,dih:26,tw:12,fold:.22,cup:.02,droop:.3,gl:.4,
  ol:{wr:.085,nt:0,t0:.12,fa:.05,wp:prof([[0,.4],[.05,.85],[.2,1],[.55,.82],[.85,.4],[1,0]])}};
function l73Dyp(g,t,o){return l73Pinnate(g,t,o,L73_DY)}

/* ---------- parlour palm (Chamaedorea elegans « Chico », « Chico Jumbo » — Mexico, Guatemala): a small leaf, 30 to 60 cm cut, on a short slender petiole, green, sheathing at its foot; ten to twenty pairs of
   leaflets, lanceolate, a little sigmoid, broader than the other palms', thin and supple, set almost at right angles and drooping a little at their tips, dark green, a fine raised midrib; the airy lace of the trade ---------- */
const CW_L73CH=[{id:'vert-sombre',n:'Vert sombre (Chico)',c:'#2c5230',b:'#5e7c54',st:'#4f7a35'},{id:'vert-franc',n:'Vert franc',c:'#4f7d38',b:'#7c9c62',st:'#5c843c'},
  {id:'vert-noir',n:'Vert noir (Negrita)',c:'#24452a',b:'#52704c',st:'#456a32'}];
const L73_CH={id:'l73ch',cws:CW_L73CH,cm:45,arch:[.2,.3],bow:.16,u0:.24,w0:3.2,w1:1.2,dl:.042,dt:.15,pr:.85,pl:q=>.36*(.68+.32*Math.sin(Math.min(1,q/.35)*Math.PI/2))*(1-.62*Math.pow(Math.max(0,(q-.6)/.4),1.4)),
  ang:q=>66-14*q,dih:12,tw:14,fold:.12,cup:.05,droop:.1,gl:.3,
  ol:{wr:.15,nt:0,t0:.12,fa:.1,wp:prof([[0,.3],[.06,.7],[.25,1],[.5,.94],[.78,.56],[.93,.2],[1,0]])}};
function l73Cha(g,t,o){return l73Pinnate(g,t,o,L73_CH)}

/* ---------- pygmy date palm (Phoenix roebelenii — « palmier dattier nain », roebelenii): a fine leaf, 60 to 120 cm, gracefully arched, about a hundred leaflets, narrow, soft, drooping, induplicate,
   dark green a little bluish, with a whitish bloom (scurf) beneath; at the foot of the leaf the lowest leaflets turn into long stiff spines, yellowish and sharp (acanthophylls). Sold green or painted ---------- */
const CW_L73PH=[{id:'vert-fonce',n:'Vert foncé',c:'#2f4a30',b:'#9aa898',st:'#7a8048'},{id:'vert-bleute',n:'Vert bleuté',c:'#4f6e64',b:'#a8b6ae',st:'#7a8452'},
  {id:'cuivre',n:'Peint cuivre',c:'#a8643a',b:'#8a5a3a',st:'#8a5634',gl:.6,f:1},{id:'or',n:'Peint or',c:'#c9a646',b:'#a88e4e',st:'#9a8040',gl:.6,f:1}];
const L73_PH={id:'l73ph',cws:CW_L73PH,cm:90,arch:[.3,.42],bow:.2,u0:.14,w0:4.2,w1:1.15,dl:.0108,dt:.1,pr:.7,pl:q=>.27*(.45+.55*Math.sin(Math.min(1,q/.3)*Math.PI/2))*(1-.7*Math.pow(Math.max(0,(q-.6)/.4),1.3)),
  ang:q=>48-10*q,dih:18,jit:14,tw:18,fold:.24,cup:.02,droop:.18,gl:.25,spn:{n:8,z:.12,l:5,a:34,c:'#c9b46a'},
  ol:{wr:.055,nt:0,t0:.12,fa:.04,wp:prof([[0,.5],[.05,.9],[.2,1],[.6,.8],[.88,.38],[1,0]])}};
function l73Phx(g,t,o){return l73Pinnate(g,t,o,L73_PH)}

/* ---------- the fan of a palmate palm, at the top of its petiole (og: H along the petiole, U toward the front of the leaf): plis radiating from the hastula over ±th, each pleat a facet lit by its own normal,
   ridges and valleys alternating; F: R0 (radius), n (facets), sinus (the radius shortened toward the cleft over the petiole), cr (crenate margin, Licuala), seg (split share, Livistona: segments bifid, drooping),
   costa (costapalmate: the halves bent back along the costa), op (the fan opening: folded shut like an accordion in the young leaf) ---------- */
function l73FanBlade(og,F,cw,parts,lim){const det=DET>=1.5&&!LOD,Y=V3.nz(og.H);let Z=V3s(og.U,V3.sc(Y,V3.dot(og.U,Y)));Z=V3l(Z)>1e-3?V3.nz(Z):fgCross(Y)[0];const X=V3.cr(Y,Z),R0=F.R0,O=og.pos;
  const n=F.n,q=.08+.92*F.op,thF=F.th*D,th=thF*q,dF=thF/n,phi=34*D,hk=Math.sqrt(Math.max(0,1/Math.cos(phi)**2-q*q))*(F.pk||1),P=pal7(cw.c),PB=pal7(cw.b),lv=det?6:4,sd=F.seg||0,rs=1-sd;
  const rA=a=>1-F.sinus*Math.pow(Math.abs(a)/thF,3);
  /* a point of the fan: on the fold line x (between −th and th, fractional between two folds), at the share r of its radius; the pleat's height a triangle wave (ridges on the even folds) */
  const tri=x=>{const m=((x%2)+2)%2;return 1-2*Math.min(m,2-m)};
  const at=(x,r)=>{const u=-thF+2*thF*x/n,a=-th+2*th*x/n,rr=r*R0*rA(u),h=rr*dF/2*hk*tri(x)*Math.min(1,r/.12),sa=Math.sin(a),ca=Math.cos(a);
    let zz=h-F.cup*rr*rr/R0+R0*.08*Math.max(0,-ca)*Math.min(1,r*2)+(F.ruf?R0*F.ruf*r*r*Math.sin(u*3.2+F.ph):0),dy=0;
    if(F.costa){zz-=F.costa*rr*Math.abs(sa)*Math.min(1,r*1.6);dy-=F.costa*.35*rr*Math.abs(sa)}
    if(sd&&r>rs){const e=(r-rs)/sd;zz-=R0*F.dr*e*e*.6;dy-=R0*F.dr*e*e}
    return V3.add(V3.add(O,V3.add(V3.add(V3.sc(X,sa*rr),V3.sc(Y,ca*rr)),V3.sc(Z,zz))),[0,dy,0])};
  const polys=[];let low=false;
  /* each facet lit by its own normal, the pleat's two sides pushed apart (a light ridge, a dark valley), quantised so that the fan batches into few paths; the gloss where the light glances */
  const facet=(pts3,par)=>{const m=pts3.length;let nr=V3.cr(V3s(pts3[Math.floor(m/2)],pts3[0]),V3s(pts3[m-1],pts3[1]));nr=V3l(nr)>1e-9?V3.nz(nr):[0,0,1];const fr=nr[2]>=0,mm=fr?nr:V3.sc(nr,-1),
      I=lightI(mm)+(par?.07:-.07),qq=Math.round(Math.max(0,Math.min(1,(I-.26)/.68))*(lv-1))/(lv-1);let col=toneAt(fr?P:PB,.26+.68*qq);if(F.gl&&fr&&V3.dot(mm,HV3)>.94)col=mix(col,'#ffffff',.18*F.gl);const tn={col};
    if(lim!=null&&pts3.some(p=>p[1]<lim))low=true;polys.push({pts:pts3.map(fgQ),z:pts3.reduce((a,p)=>a+p[2],0)/m,col:tn.col})};
  const sk=(det?[.04,.25,.5,.75]:[.04,.4,.75]).filter(s=>s<rs-.02).concat(sd?[rs]:[]),rE=i=>i%2?.955:1;
  for(let i=0;i<n;i++){const A1=sk.map(s=>at(i,s)),B1=sk.map(s=>at(i+1,s));
    /* Licuala: the facet runs to the margin, crenate — scalloped between the folds, with fine teeth on each lobe */
    if(!sd){const m=det?4:2,out=[];for(let j=0;j<=m;j++){const t=j/m;out.push(at(i+t,rE(i)+(rE(i+1)-rE(i))*t-(F.cr&&det&&j%2?.014:0)))}facet(A1.concat(out,B1.slice().reverse()),i%2);continue}
    facet(A1.concat(B1.slice().reverse()),i%2)}
  /* Livistona: beyond the split each segment (two facets round a ridge) stands free, narrowed, drooping, its tip bifid */
  if(sd)for(let j=0;j<n;j+=2){const c=j+1,ss=det?[rs,rs+sd*.35,rs+sd*.7,1]:[rs,rs+sd*.5,1],gap=.14,ns=ss.length-1;
    for(const[e0,sg]of[[j,1],[j+2,-1]]){const side=ss.slice(0,-1).map((s,k)=>at(e0+sg*gap*k/ns,s)),mid=ss.slice(0,-1).map(s=>at(c,s));
      facet(side.concat([at(e0+(c-e0)*.4,1),at(c,.86)]).concat(mid.slice().reverse()),sg>0?1:0)}}
  if(low)return false;
  l58Batch(polys,det?7:4,parts,{ink:P.d2,eo:.42});
  /* the hastula: a little crest where the pleats meet the petiole, on the front */
  const hz=V3.add(O,V3.sc(Z,Math.min(.6,R0*.006))),hp=[[-R0*.06,-R0*.015],[0,R0*.075],[R0*.06,-R0*.015],[0,-R0*.04]].map(([x,y])=>V3.add(hz,V3.add(V3.sc(X,x),V3.sc(Y,y))));
  parts.push({z:hz[2]+(Z[2]>=0?.6:-.6),cast:false,fn:par=>E('path',{d:fgD(hp.map(fgQ)),fill:shd(cw.st,-.12),stroke:shd(cw.st,-.5),'stroke-width':.4,'stroke-opacity':.5},par)});
  return true}
/* ---------- a palmate palm leaf: the petiole grown along its axis (on a sheet the arc of the view; in a bouquet the composer's spine, stopping short so the fan, not its edge, sits at the edge of the mass),
   its margins armed with small curved spines on the lower part, the fan at its top. F: cws, cm0 (fan diameter), pet (petiole length), w0 w1, sp {u, n, l, c} (spines along the petiole), fan options ---------- */
function l73Palmate(g,t,o,F){const cw=fgCw(F.cws,o),op=l73Op(o),cm0=F.cm0,ks=o.spine?1:(o.cm||cm0)/cm0,dia=(o.cm||cm0)*UPC,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,F.id,()=>{const Lt=o.spine?blen(o.spine):F.pet*UPC*Math.sqrt(ks),A=fgAxis(o,Lt,R(-.1,.1)),lim=g35Lim(o);
    if(o.spine)A.L=Math.min(A.L,Math.max(A.L*.8,A.l0+12*UPC,A.L-dia*.12));
    const pc=cw.st,cols=[shd(pc,-.6),shd(pc,-.25),pc,shd(pc,.42)],sE=A.sOf(A.L),yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66));
    let ok=true;
    const r=fgGrow(k,A,{li:9*UPC,liT:0,w0:F.w0*Math.min(1.15,ks),w1:F.w1*Math.min(1.15,ks),cols,uL:2,seg:12,wig:.008,tipLv:0,
      /* in a bouquet the fan must stay above the lip: the largest trade grade that fits (down to the smallest), then a fan held a little less open */
      tip:og=>{const parts=[],Fr=A.at(sE).Fr,of=fgFace(og,Fr,.85),ph=R(0,6.283),tries=lim==null?[[1,1]]:[[1,1],[.88,1],[.76,1],[F.kMin,1],[F.kMin,.8],[F.kMin,.62],[F.kMin*.85,.5]];
        for(const[kd,ko]of tries){parts.length=0;ok=l73FanBlade(of,Object.assign({},F.fan,{ph,R0:dia/2*kd*(1-.25*yg),op:Math.min(1,.06+op*1.05)*ko}),cw,parts,lim);if(ok)break}
        if(!ok)parts.length=0;return parts},
      /* the petiole's spines: small hooked teeth on both margins of its lower part, each grown from the edge of the petiole */
      post:(res,parts)=>{if(!F.sp||LOD)return;const ch=res.chains[0],n=ch.pts.length,nS=Math.round(n*F.sp.u),sp=[];let z=0;
        for(let i=2;i<nS;i+=Math.max(1,Math.round(nS/F.sp.n))){const p=fgQ(ch.pts[i]),q=fgQ(ch.pts[Math.min(n-1,i+1)]),dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,w=ch.ws[i]/2,sg=(i>>1)%2?1:-1,L=F.sp.l*(.7+.3*rnd());
          const b0=[p[0]+nx*w*.35*sg-ux*1.3,p[1]+ny*w*.35*sg-uy*1.3],b1=[p[0]+nx*w*.35*sg+ux*1.3,p[1]+ny*w*.35*sg+uy*1.3],tp=[p[0]+nx*(w+L)*sg-ux*L*.55,p[1]+ny*(w+L)*sg-uy*L*.55];sp.push([b0,b1,tp]);z+=ch.pts[i][2]}
        if(sp.length)parts.push({z:z/sp.length-.05,cast:false,fn:par=>E('path',{d:sp.map(fgD).join(''),fill:F.sp.c,stroke:shd(F.sp.c,-.4),'stroke-width':.3,'stroke-opacity':.5},par)})}});
    open(k,t,1000,0,.4);return r})}

/* ---------- ruffled fan palm (Licuala grandis — Vanuatu): a single leaf, nearly orbicular, undivided, 30 to 60 cm across in the trade, pleated like an accordion from the hastula, the margin crenate —
   each pleat ends in a short truncate lobe finely toothed; glossy emerald green, each pleat a light ridge and a dark valley; on a long slender petiole armed with short spines on its lower half ---------- */
const CW_L73LG=[{id:'emeraude',n:'Vert émeraude brillant',c:'#2f7a3a',b:'#5a9a5a',st:'#4a6a34'},{id:'vert-profond',n:'Vert profond',c:'#1f6b45',b:'#4a8a64',st:'#3e5e30'}];
const L73_LG={id:'l73lg',cws:CW_L73LG,cm0:45,kMin:30/45,pet:55,w0:4.2,w1:2.8,sp:{u:.5,n:9,l:3,c:'#5a4a2a'},fan:{th:172,n:48,sinus:.2,cr:1,cup:.1,gl:1,pk:1,ruf:.035}};
function l73Lic(g,t,o){return l73Palmate(g,t,o,DET>=1.5&&!LOD?L73_LG:Object.assign({},L73_LG,{fan:Object.assign({},L73_LG.fan,{n:40})}))}

/* ---------- footstool palm (Saribus rotundifolius, syn. Livistona rotundifolia — « palmier tabouret »): the cut juvenile leaf nearly circular, 40 to 80 cm, costapalmate (the petiole running a little into the blade
   as a costa, the halves bent back along it), divided from the margin over a third of its radius into many regular segments, each induplicate, its tip bifid and drooping a little; glossy bright green;
   a long petiole edged with small curved brown spines ---------- */
const CW_L73LR=[{id:'vert-brillant',n:'Vert brillant',c:'#357530',b:'#6a9a5a',st:'#5a6a3a'},{id:'vert-franc',n:'Vert franc',c:'#4c7a35',b:'#7a9a5e',st:'#62703e'}];
const L73_LR={id:'l73lr',cws:CW_L73LR,cm0:60,kMin:40/60,pet:65,w0:4.6,w1:3,sp:{u:.7,n:14,l:3.6,c:'#6a4a2a'},fan:{th:160,n:56,sinus:.1,seg:.36,dr:.07,costa:.12,cup:.06,gl:.8,pk:.8}};
function l73Liv(g,t,o){return l73Palmate(g,t,o,DET>=1.5&&!LOD?L73_LR:Object.assign({},L73_LR,{fan:Object.assign({},L73_LR.fan,{n:44})}))}
/* a big leaf on its petiole: in the composer only the top of its spine, where the fan starts, must clear the lip, by its radius */
l73Lic.bigLeaf={ext:90,k0:12};l73Liv.bigLeaf={ext:110,k0:12};

/* ---------- registries: drawers, colourways, trade grades (the leaf's length in cm for the feather palms, the fan's diameter for the fan palms), and how the composer treats them ---------- */
Object.assign(GH,{'dypsis-lutescens-areca':l73Dyp,'chamaedorea-chico':l73Cha,'phoenix-roebelenii':l73Phx,'licuala-grandis':l73Lic,'livistona-rotundifolia':l73Liv});
Object.assign(CWS,{'dypsis-lutescens-areca':CW_L73DY,'chamaedorea-chico':CW_L73CH,'phoenix-roebelenii':CW_L73PH,'licuala-grandis':CW_L73LG,'livistona-rotundifolia':CW_L73LR});
Object.assign(SZG,{'dypsis-lutescens-areca':[70,90,100,130],'chamaedorea-chico':[30,40,45,60],'phoenix-roebelenii':[60,80,90,120],'licuala-grandis':[30,40,45,60],'livistona-rotundifolia':[40,50,60,80]});
const L73_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'dypsis-lutescens-areca':L73_I(90,{fx:34}),'chamaedorea-chico':L73_I(45,{fx:26}),'phoenix-roebelenii':L73_I(85,{fx:30})});
