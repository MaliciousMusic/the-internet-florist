/* ================= Serre, lot 70 — asparagus : asparagus virgatus (« tree fern »), asparagus macowanii (« Ming fern »), asparagus densiflorus 'Sprengeri', asparagus densiflorus 'Myersii' (« queue de renard »), asparagus falcatus ================= */
/* chaque tige coupée est poussée par le L-système (l44Main du lot 44 : l'axe principal suit son chemin — épine du Composer, arc d'une planche, bouquet d'une carte —, ses nœuds portent rameaux, ramilles, éperons et houppes) ;
   les « feuilles » des asparagus sont des cladodes (rameaux aplatis ou en aiguilles, par fascicules à l'aisselle d'une écaille) : elles habillent chaque axe après la pousse, dessinées par lots de chemins (l30Batch du lot 30) ;
   jeunes pousses en turion au stade bouton, baies quand l'espèce en porte, épines recourbées ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
/* ---------- shared: stem colours from a stem tone, the young growth of a stage (share of every axis pale and soft at its tip), a point to the screen ---------- */
const l70St=c=>[shd(c,-.55),shd(c,-.25),c,shd(c,.38)],l70Fz=op=>op<.42?.3:op<.75?.12:0,l70Q=p=>[p[0],-p[1]];
/* the axis of a stem: fgAxis (spine, card, sheet), or on a sheet an arching stem that rises then bows over (dr: how far its tip falls back) */
function l70Axis(o,Lt,arch,dr){if(!dr||o.spine||o.up&&Math.hypot(o.up[0],o.up[1])>6)return fgAxis(o,Lt,arch);const B=frameOf(o,0),a=Math.sign(arch)||1;
  let C=[[0,0,0],[a*Lt*.04,Lt*.48,0],[a*Lt*(.2+.1*dr),Lt*(.84-.04*dr),0],[a*Lt*(.42+.12*dr),Lt*(.84-.22*dr),0]];const A0=spAxis(o,Lt,{C,Fr:[0,0,1]}),k=Lt/A0.L;C=C.map(p=>toV(B,V3.sc(p,k)));
  const A=spAxis(o,Lt,{C,Fr:toV(B,[0,0,1])});A.up=V3.nz(toV(B,[0,1,0]));A.s0=0;A.l0=0;return A}
/* the nodes of the main axis: from the share u0 of its length to its tip, the internodes going from li0 to li1 */
function l70Nodes(A,u0,li0,li1){const Le=A.L,l0=A.l0||0,out=[];let l=l0+(Le-l0)*u0;while(l<Le-li1*.6){out.push(l);const u=(l-l0)/Math.max(1,Le-l0);l+=(li0+(li1-li0)*u)*R(.86,1.14)}return out}
/* a run on a sheet: one seed per species, colour, size and stage (the same stem from every side); the stem's length is a trade grade (cm above 15; below, the recipe's cladode size rc scales the usual length), a little shorter in bud */
function l70Run(g,t,o,id,list,len,arch,dr,fn,rc){const cw=fgCw(list,o),op=l44Op(o),k=G(g),cm=o.cm>15?o.cm:o.cm&&rc?len*o.cm/rc:len,kl=o.spine?1:Math.min(1.12,Math.max(.85,Math.sqrt(cm/len)));
  return g35Run(o,id,()=>{const Lt=o.spine?blen(o.spine):cm*UPC*(.84+.16*op),A=l70Axis(o,Lt,(rnd()<.5?-1:1)*R(arch[0],arch[1]),dr),r=fn(k,A,cw,op,kl,g35Lim(o));open(k,t,1000,0,.4);return r})}
/* ---------- the grower: l44Main pushes the main axis along its path and the species' rules grow the rest; the stout axes are shaded ribbons, the fine ones (finer than S.wide)
   strokes batched with the cladodes, never finer than 1.15. In a bouquet a stem rising from the mouth keeps everything above it: a side axis stops where it would dip below.
   S: nodes, node(i,u,w) → modules, rules, w0 w1 cols, wide, clad(items,res) (the cladodes, after growth), organ(og,items,parts), keys (the batched kinds in their drawing order), nb ---------- */
function l70Grow(k,A,S,lim){const res=l44Main(A,S.nodes,{w0:S.w0,w1:S.w1,cols:S.cols,rules:S.rules,node:S.node,depth:S.depth||12,wig:S.wig??.02,step:S.step||7}),parts=[],items=[];
  if(lim!=null)for(const ch of res.chains){if(!ch.ord)continue;const n=ch.pts.findIndex(p=>p[1]<lim);if(n>=0){ch.pts.length=n;ch.ws.length=n;ch.cut=1}}
  res.chains=res.chains.filter((c,i)=>!i||c.pts.length>1);
  const wide=[],fine=[];for(const ch of res.chains)(!ch.ord||ch.ws[0]>=(S.wide||1.8)?wide:fine).push(ch);
  lsChainParts(wide,[0,0,0],S.cols,parts,{piece:12});l30Twigs(items,{chains:fine},[[1.45,'t2'],[0,'t1']]);
  if(S.clad)S.clad(items,res,parts);
  for(const og of res.organs){if(lim!=null&&og.pos[1]<lim+1)continue;if(S.organ)S.organ(og,items,parts)}
  const nb=Math.max(4,Math.min(DET>=1.5?28:14,Math.round(items.length/(DET>=1.5?160:260))));l30Batch(parts,items,S.keys,nb);drawParts(k,parts);return l44Out(k,A,res,S.cols)}
/* the batched kinds: twigs (t1, t2), the heart of a tuft or a plume (core), needles in shade, half light, light and young (n0…ny), the same seen face on when flat (w0…wy),
   sickle cladodes by tone (c0…c3 front, b0 b1 back), their gloss and midrib, berries (bp stalk, bb ripe, bu unripe, bh light), spines (sp) */
function l70Keys(c,o={}){const P=pal7(c),cy=o.cy||mix(c,'#c8de84',.55),tw=o.tw||shd(c,-.32),sw=Math.max(1.12,o.sw||1.15),sw2=o.sw2||1.8,K=[];
  const st=(k,col,w,x={})=>K.push([k,Object.assign({fill:'none',stroke:col,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'},x)]);
  st('t2',tw,1.6);st('t1',tw,1.15);if(o.core)K.push(['core',{fill:toneAt(P,.22)}]);
  const ns=[toneAt(P,.3),toneAt(P,.52),toneAt(P,.76),cy];['0','1','2','y'].forEach((s,i)=>st('n'+s,ns[i],sw));if(o.flat)['0','1','2','y'].forEach((s,i)=>st('w'+s,ns[i],sw2));
  if(o.sickle){const PB=pal7(o.cb||mix(c,'#a8c090',.3));for(let i=0;i<4;i++){const cc=toneAt(P,.3+.56*i/3);K.push(['c'+i,{fill:cc,stroke:P.ink,'stroke-width':DET>=1.5?.32:.38,'stroke-opacity':.42,'stroke-linejoin':'round'}])}
    for(let i=0;i<2;i++){const cc=toneAt(PB,.4+.3*i);K.push(['b'+i,{fill:cc,stroke:PB.ink,'stroke-width':.36,'stroke-opacity':.42,'stroke-linejoin':'round'}])}
    K.push(['gl',{fill:'#ffffff',opacity:DET>=1.5?.34:.26}]);st('mr',shd(c,-.3),.45,{'stroke-opacity':.5})}
  if(o.berry){st('bp',tw,1.2);K.push(['bu',{fill:o.bu||'#8aa84a',stroke:'#3a4a22','stroke-width':.4,'stroke-opacity':.5}],['bb',{fill:o.berry,stroke:shd(o.berry,-.6),'stroke-width':.4,'stroke-opacity':.55}],['bh',{fill:'#ffffff',opacity:.5}])}
  if(o.spine)K.push(['sp',{fill:o.spine,stroke:shd(o.spine,-.5),'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'}]);
  return K}
/* ---------- the cladodes along every axis: fascicles of nn set in a spiral from where its leafy part starts (u0 of the main axis, at once on the side axes), spread th° from the axis,
   incurved (inc), drooping (dr), pulled toward the plane of the spray (pk); smaller toward each tip (from tu); the youngest pale and short at the tips (fz, the share of each axis).
   Each starts on its axis (its base on the axis' surface) and is one curved stroke, never finer than 1.12: a needle; a flat cladode (flat) is a wider stroke when seen face on ---------- */
function l70Clad(items,res,S,Fr){const det=DET>=1.5&&!LOD,Fq=V3.nz(Fr||[0,0,1]),tu=S.tu??.8;
  for(const ch of res.chains){if(ch.nc)continue;const C=l57At(ch),Lc=C.L,a0=ch.ord?Math.min(Lc*.1,UPC*.3):Lc*S.u0;if(Lc-a0<UPC*.25)continue;
    const nf=Math.max(1,Math.round((Lc-a0)/(S.sp*(det?1:S.lo||1.45)))),fz=ch.cut?0:S.fz||0;
    for(let i=0;i<nf;i++){const l=Math.min(Lc,a0+(Lc-a0)*(i+.5+R(-.3,.3))/nf),q=C.at(l),u=(l-a0)/Math.max(1e-6,Lc-a0),[X,Y]=fgCross(q.T),Sd=V3.nz(V3.cr(q.T,Fq)),young=fz&&u>1-fz,
        Ln0=S.ln*(ch.ord?1:S.lm??1)*(u>tu?.42+.58*(1-u)/(1-tu):1)*(young?.72:1)*(S.lf?S.lf(ch,u):1),nn=S.nn+(S.nr&&rnd()<S.nr?1:0);
      for(let j=0;j<nn;j++){let az=(i*137.5+j*360/nn+R(-22,22))*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az)));
        if(S.pk){const s=V3.dot(r,Sd)<0?-1:1;r=V3.nz(V3.add(V3.sc(r,1-S.pk),V3.sc(Sd,s*S.pk)))}
        const Ln=Ln0*R(.78,1.14),th=(S.th*(young?.6:1)+R(-10,10))*D,d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(r,Math.sin(th)))),b=V3.add(q.p,V3.sc(r,q.w*.25)),dr=(S.dr||0)*Ln,inc=(S.inc||0)*Ln,
          e=V3.add(V3.add(V3.add(b,V3.sc(d,Ln)),V3.sc(r,-inc*.6)),[0,-dr,0]),m=V3.add(V3.add(V3.add(b,V3.sc(d,Ln*.5)),V3.sc(r,inc*.4)),[0,-dr*.3,0]);
        if(S.lim!=null&&Math.min(e[1],m[1])<S.lim)continue;
        let key=young?'y':String(e[2]<q.p[2]-Ln*.2?0:V3.dot(r,LIGHT)>.2?2:1);
        /* a flat cladode turns its face round its own axis: face on it is a ribbon, on edge a thread */
        if(S.flat){const W=V3.nz(V3.cr(d,rotA(r,d,R(-1.2,1.2))));key=(Math.abs(W[2])>.62?'n':'w')+key}else key='n'+key;
        const B2=l70Q(b),M2=l70Q(m),E2=l70Q(e);items.push({z:m[2],fn:B=>l30Add(B,key,`M${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(E2[0])},${f(E2[1])}`)})}}}}
/* ---------- a tuft (Ming fern): a ball of needle cladodes radiating from the end of its spur, thrown outward (away from the spur, dir), over a dark heart that gives it its density;
   every needle starts within the heart ---------- */
function l70Puff(items,c,dir,r,S){const n=Math.round(S.n*(DET>=1.5&&!LOD?1:.42)),fz=S.fz||0;
  items.push({z:c[2]-r*.3,fn:B=>l30Add(B,'core',l30O(c[0],c[1],r*.5))});
  for(let i=0;i<n;i++){let v=[R(-1,1),R(-1,1),R(-1,1)];if(V3l(v)>1||V3l(v)<.1){i--;continue}v=V3.nz(V3.add(V3.nz(v),V3.sc(dir,.55)));
    const Ln=r*R(.45,.95),b=V3.add(c,V3.sc(v,r*R(.05,.3))),side=V3.nz(V3.cr(v,[0,1,0])),e=V3.add(V3.add(b,V3.sc(v,Ln)),[0,Ln*.08,0]),m=V3.add(V3.add(b,V3.sc(v,Ln*.5)),V3.sc(side,Ln*R(-.08,.08)));
    if(S.lim!=null&&Math.min(e[1],m[1])<S.lim)continue;const young=fz&&rnd()<fz*.7,key='n'+(young?'y':v[2]<-.35?0:V3.dot(v,LIGHT)>.25?2:1),B2=l70Q(b),M2=l70Q(m),E2=l70Q(e);
    items.push({z:m[2],fn:B=>l30Add(B,key,`M${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(E2[0])},${f(E2[1])}`)})}}
/* a cloud pad (Ming fern): a few tufts packed round the end of the spur, flattened and domed like the cloud of a bonsai, each tuft's heart overlapping the first */
function l70Pad(items,og,r,S){const H=V3.nz(og.H),[X,Y]=fgCross(H),c=og.pos,m=DET<1.5||LOD?2:rnd()<.4?2:rnd()<.6?3:4,a0=R(0,6.283);l70Puff(items,V3.add(c,V3.sc(H,r*.15)),H,r,S);
  for(let i=0;i<m;i++){const a=a0+i*6.283/m+R(-.4,.4),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),p=V3.add(V3.add(c,V3.sc(rd,r*R(.4,.55))),[0,r*.05,0]),q=V3.nz(V3.add(rd,V3.sc(H,.4)));l70Puff(items,p,q,r*R(.62,.78),S)}}
/* ---------- a young shoot (turion): the tip of an axis still closed, a tapering spear clad in small triangular scale leaves, tinged at its point ---------- */
function l70Spear(og,len,rad,col,tint){const H=V3.nz(og.H),b=og.pos,e=V3.add(b,V3.sc(H,len)),sp=l45Spin(b,e,t=>rad*(t<.12?.82+t*1.5:Math.pow(Math.max(0,1-(t-.12)/.88),.62)),12),P=pal7(col),
    I=lightI(V3.nz(V3.add(fgCross(H)[0],[0,0,.7]))),tp=l45Spin(V3.add(b,V3.sc(H,len*.62)),e,t=>rad*.62*Math.pow(Math.max(0,1-t),.62)*(t<.1?.8+t*2:1),8);
  return{z:b[2]+.4,cast:false,fn:g=>{E('path',{d:smooth(sp.P),fill:toneAt(P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.45},g);E('path',{d:smooth(tp.P),fill:tint,opacity:.55},g);
    if(LOD)return;let d='';for(let i=2;i<11;i++){const c=sp.C[i],s=i%2?1:-1,w=rad*Math.pow(Math.max(0,1-(i/12-.12)/.88),.62)*.92,c2=sp.C[Math.min(12,i+1)];
      d+=`M${f(c[0]+sp.nx*w*s)},${f(c[1]+sp.ny*w*s)}Q${f(c[0]+sp.nx*w*s*.2)},${f(c[1]+sp.ny*w*s*.2)} ${f(c2[0]+sp.nx*w*s*.25)},${f(c2[1]+sp.ny*w*s*.25)}`}
    E('path',{d,fill:'none',stroke:P.d1,'stroke-width':.45,'stroke-opacity':.6,'stroke-linecap':'round'},g)}}}
/* ---------- a recurved spine at a node: a little hook from the axis, its base on the axis, bent back toward the stem's foot ---------- */
function l70Hook(items,og,len,bw){const H=V3.nz(og.H),[X,Y]=fgCross(H),a=R(0,6.283),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),p=og.pos,
    s=V3.sc(r,og.w*.4+len*.55),t0=V3.add(V3.add(p,s),V3.sc(H,len*.12)),tip=V3.add(V3.add(p,V3.sc(r,og.w*.4+len*.75)),V3.sc(H,-len*.45)),[Q,_]=fgCross(V3.nz(V3s(tip,p))),
    a1=V3.add(p,V3.sc(Q,bw*.5)),a2=V3.add(p,V3.sc(Q,-bw*.5)),P=[a1,t0,tip,V3.add(t0,V3.sc(Q,-bw*.25)),a2].map(l70Q);
  items.push({z:p[2]+(r[2]>0?.5:-.5),fn:B=>l30Add(B,'sp',l30Poly(P))})}
/* ---------- a flat sickle cladode (falcatus): from its base b along d, flat in the plane of its face nf, curved sideways like a sickle (bend), widest a third of the way, sharp-pointed;
   filled in the tone of the face that shows, the gloss of its upper face as a streak, the midrib on sheets ---------- */
const L70_SK=prof([[0,.22],[.1,.62],[.3,1],[.55,.9],[.78,.6],[.92,.28],[1,0]]);
function l70Sickle(items,b,d,nf,L,hw,bend,o={}){const W=V3.nz(V3.cr(nf,d)),n=LOD?6:DET>=1.5?12:8,C=[],Lf=[],Rt=[],Ws=[];
  for(let i=0;i<=n;i++){const v=i/n,c=V3.add(V3.add(V3.add(b,V3.sc(d,L*v)),V3.sc(W,bend*L*v*v)),[0,-(o.dr||0)*L*v*v,0]),t=V3.nz(V3.add(V3.sc(d,L),V3.sc(W,2*bend*L*v))),Wv=rotA(V3.nz(V3.cr(nf,t)),t,(o.tw||0)*v),w=hw*L70_SK(v);
    C.push(c);Ws.push(Wv);Lf.push(V3.add(c,V3.sc(Wv,w)));Rt.push(V3.add(c,V3.sc(Wv,-w)))}
  if(o.lim!=null&&Math.min(...C.map(p=>p[1]))<o.lim)return;
  let z=0;for(const c of C)z+=c[2];z/=n+1;const fr=nf[2]>=0,I=lightI(fr?nf:V3.sc(nf,-1)),q=Math.round(Math.max(0,Math.min(1,(I-.3)/.56))*3),key=fr?'c'+q:'b'+Math.min(1,q>>1),
    out=Lf.concat(Rt.slice().reverse()).map(l70Q);items.push({z,fn:B=>l30Add(B,key,l30Poly(out))});
  if(LOD)return;
  /* the gloss: a streak along the lit half of a front face */
  if(fr&&q>=1){const s=V3.dot(W,LIGHT)>0?1:-1,G1=[],G2=[];for(let i=2;i<n-1;i++){const t=i/n,c=C[i],w=hw*L70_SK(t),Wv=Ws[i];G1.push(l70Q(V3.add(c,V3.sc(Wv,s*w*.18))));G2.push(l70Q(V3.add(c,V3.sc(Wv,s*w*.62))))}
    items.push({z:z+.01,fn:B=>l30Add(B,'gl',l30Poly(G1.concat(G2.reverse())))})}
  if(DET>=1.5)items.push({z:z+.02,fn:B=>l30Add(B,'mr','M'+C.slice(0,n).map(p=>{const q=l70Q(p);return f(q[0])+','+f(q[1])}).join('L'))})}
/* ---------- berries on short stalks from a node: one to three, green, then orange, ripe red; each stalk starts on its axis ---------- */
function l70Berries(items,og,n,r,ripe,lim){const H=V3.nz(og.H),[X,Y]=fgCross(H);
  for(let i=0;i<n;i++){const a=R(0,6.283),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),d=V3.nz(V3.add(V3.add(V3.sc(rd,.9),V3.sc(H,.25)),[0,-.35,0])),Ls=r*R(1.6,2.4),
      b=V3.add(og.pos,V3.sc(rd,og.w*.3)),c=V3.add(b,V3.sc(d,Ls+r*.8));if(lim!=null&&c[1]-r<lim)continue;const rp=rnd()<ripe,B2=l70Q(b),C2=l70Q(c),rr=r*R(.9,1.1);
    items.push({z:c[2]+.2,fn:B=>{l30Add(B,'bp',`M${f(B2[0])},${f(B2[1])}L${f(C2[0])},${f(C2[1])}`);l30Add(B,rp?'bb':'bu',l30O(c[0],c[1],rr));l30Add(B,'bh',l30O(c[0]-rr*.32,c[1]+rr*.34,rr*.28))}})}}

/* ---------- asparagus virgatus (Asparagus virgatus, Asparagaceae, « tree fern », « broom fern »): a thin, stiff, erect stem, bare at its foot but for small scale leaves, carrying in its
   upper two thirds horizontal tiers of fine branches, each branched again in the same level plane, so that the stem stands like a little tree in layers; the cladodes are
   very fine needles (0.5–1.2 cm), three by three, dark green, the whole airy and misty. Sold natural, 50 to 80 cm ---------- */
const CW_L70VI=[{id:'vert-fonce',n:'Vert foncé',c:'#3b6430',st:'#56743a'},{id:'vert',n:'Vert',c:'#4d7d3a',st:'#5d7d3e'}];
function l70Vir(g,t,o){return l70Run(g,t,o,'l70vir',CW_L70VI,60,[.03,.1],0,(k,A,cw,op,kl,lim)=>{const s=.72+.28*op,ph0=R(0,360),up=A.up||[0,1,0],cols=l70St(cw.st),fz=l70Fz(op),cl=DET>=1.5?.8:1.3,
    nodes=l70Nodes(A,o.spine?(o.from>0?.05:.3):.36,5.2*UPC*kl,2.8*UPC*kl);let tier=0;
  return l70Grow(k,A,{nodes,w0:3.2,w1:1.2,cols,wide:1.7,depth:18,wig:.012,keys:l70Keys(cw.c,{tw:shd(cw.st,-.3),sw:1.12}),
    /* a tier: three to five branches round the stem, held out level */
    node:(i,u,w)=>{const n=rnd()<.35?3:rnd()<.6?4:5,out=[],ph=ph0+tier++*47,Lb=(19*Math.pow(1-u,.85)+3)*UPC*kl*s*R(.85,1.1);
      for(let j=0;j<n;j++){const L=Lb*R(.75,1.1),li=1.5*UPC*kl;out.push(['[',{w:Math.max(1.25,w*.42)}],['/',{a:ph+j*360/n+R(-18,18)}],['&',{a:R(70,86)}],['$',{v:up}],['B',{n:Math.max(2,Math.round(L/li)),li,w:Math.max(1.25,w*.42),k:0}],[']',{}])}
      return out},
    rules:{B:p=>{if(p.n<=0)return[['F',{l:p.li*.5,w1:1.15,e:.002}],['T',{o:1}]];const sd=p.k%2?1:-1,Lc=p.li*(1.3+2.2*Math.min(1,p.n/5))*R(.8,1.1);
        return[['F',{l:p.li*R(.85,1.1),w1:Math.max(1.15,p.w*.86),e:-.006}],...(DET<1.5&&p.k%4>1&&p.n>1?[]:[['[',{w:1.15}],['$',{v:up}],['+',{a:sd*R(48,64)}],['C',{n:Math.max(1,Math.round(Lc/(cl*UPC))),li:cl*UPC,k:p.k}],[']',{}]]),['B',Object.assign({},p,{n:p.n-1,k:p.k+1,w:Math.max(1.15,p.w*.86)})]]},
      C:p=>p.n<=0?[['T',{o:2}]]:[['F',{l:p.li*R(.85,1.1),w1:1.15,e:.002}],...(p.n===2&&rnd()<.5?[['[',{w:1.15}],['$',{v:up}],['+',{a:(p.k%2?-1:1)*R(40,55)}],['F',{l:p.li*R(.8,1.3),w1:1.15}],[']',{}]]:[]),['C',Object.assign({},p,{n:p.n-1})]]},
    clad:(items,res)=>l70Clad(items,res,{u0:.35,sp:.4*UPC*kl,nn:DET>=1.5?3:2,ln:.75*UPC*kl,th:58,inc:.04,dr:.05,lm:.5,fz,lim,lo:1.7},null),
    organ:(og,items,parts)=>{if(og.t==='T'&&!og.p.o&&op<.42)parts.push(l70Spear(og,2.2*UPC*kl,1.5,mix(cw.c,'#b8d07a',.5),'#8a6a5a'))}},lim)},12)}

/* ---------- asparagus macowanii (Asparagus macowanii, syn. A. myriocladus, « Ming fern »): a woody, pale, gently zigzag stem with alternate ascending branches; along the branches,
   short spurs crowned by dense round tufts of needle cladodes (0.5–1.5 cm, in fascicles), the tufts layered like the clouds of a bonsai, deep green. Sold natural, 40 to 60 cm ---------- */
const CW_L70MC=[{id:'vert-profond',n:'Vert profond',c:'#2f5a2c',st:'#7a7458'},{id:'vert-mousse',n:'Vert mousse',c:'#46703a',st:'#7d7a5a'}];
function l70Mac(g,t,o){return l70Run(g,t,o,'l70mac',CW_L70MC,50,[.06,.16],0,(k,A,cw,op,kl,lim)=>{const s=.72+.28*op,cols=l70St(cw.st),fz=l70Fz(op),ph0=R(0,360),
    nodes=l70Nodes(A,o.spine?(o.from>0?.04:.24):.24,4.2*UPC*kl,2.6*UPC*kl),rT=u=>(1.75+.6*rnd())*UPC*kl*(1-.28*u)*(.82+.18*op);let nb=0;
  const spur=(a,l,u,big)=>[['[',{w:1.2}],['/',{a}],['&',{a:R(32,50)}],['F',{l,w1:1.15,e:.03}],['X',{r:rT(u)*(big?1.12:1)}],[']',{}]];
  return l70Grow(k,A,{nodes,w0:3.8,w1:1.5,cols,wide:1.6,depth:14,wig:.016,keys:l70Keys(cw.c,{tw:shd(cw.st,-.25),core:1}),
    node:(i,u,w)=>{const a=ph0+i*137.5+R(-12,12);
      if(u<.86&&rnd()<.72){nb++;const Lb=(15*Math.pow(1-u,.7)+3.5)*UPC*kl*s*R(.8,1.1),li=2.7*UPC*kl,bw=Math.max(1.3,w*.5);
        return[['[',{w:bw}],['/',{a}],['&',{a:R(55,72)}],['B',{n:Math.max(1,Math.round(Lb/li)),li,w:bw,k:0,u}],[']',{}]]}
      return spur(a,R(.9,1.6)*UPC*kl,u,0)},
    rules:{B:p=>{if(p.n<=0)return[['F',{l:p.li*.5,w1:1.15,e:.006}],['X',{r:rT(p.u)*1.15}]];
        return[['F',{l:p.li*R(.85,1.12),w1:Math.max(1.15,p.w*.84),e:.002}],['+',{a:(p.k%2?1:-1)*R(8,16)}],...spur((p.k%2?90:-90)+R(-30,30),R(.9,1.7)*UPC*kl,p.u,0),['B',Object.assign({},p,{n:p.n-1,k:p.k+1,w:Math.max(1.15,p.w*.84)})]]}},
    organ:(og,items,parts)=>{if(og.t==='X')l70Pad(items,og,og.p.r,{n:70,fz,lim});
      else if(og.t==='T'){if(op<.42)parts.push(l70Spear(og,2*UPC*kl,1.6,mix(cw.c,'#b8c87a',.45),'#7a5a6a'));else l70Pad(items,og,rT(1)*1.1,{n:70,fz,lim})}}},lim)},5)}

/* ---------- asparagus densiflorus 'Sprengeri' (Asparagus aethiopicus, « Sprengeri »): long arching to trailing stems, with small hooked spines at the nodes, clothed along their length
   and on short side shoots in flat linear cladodes (1–3 cm × 2–3 mm) by fascicles of three to five, bright light green; small fragrant white flowers then berries green, ripening red ---------- */
const CW_L70SP=[{id:'vert-tendre',n:'Vert tendre',c:'#68a63e',st:'#5f8f3c'},{id:'vert',n:'Vert',c:'#4f9a3a',st:'#5a8a3a'},{id:'baies',n:'Vert à baies rouges',c:'#5f9f3c',st:'#5a8a3a',f:1}];
function l70Spr(g,t,o){return l70Run(g,t,o,'l70spr',CW_L70SP,60,[.3,.45],.8,(k,A,cw,op,kl,lim)=>{const s=.72+.28*op,cols=l70St(cw.st),fz=l70Fz(op),ph0=R(0,360),ber=cw.f&&op>.4,
    nodes=l70Nodes(A,o.spine?(o.from>0?.03:.14):.1,1.9*UPC*kl,1.2*UPC*kl);let nbx=0;
  return l70Grow(k,A,{nodes,w0:3,w1:1.3,cols,wide:1.7,depth:10,wig:.02,keys:l70Keys(cw.c,{tw:shd(cw.st,-.2),flat:1,sw:1.15,sw2:1.75,berry:op>.75?'#c8281e':'#de7a2a',bu:'#86ab4a',spine:'#b0a070'}),
    node:(i,u,w)=>{const out=[['Sp',{}]],a=ph0+i*137.5+R(-15,15);
      if(u>.06&&u<.9&&rnd()<.62){const Lb=(5.5*(1-.45*u)+1.6)*UPC*kl*s*R(.7,1.15),li=.9*UPC*kl;out.push(['[',{w:1.3}],['/',{a}],['&',{a:R(38,58)}],['B',{n:Math.max(1,Math.round(Lb/li)),li,k:0}],[']',{}])}
      return out},
    rules:{B:p=>p.n<=0?[['F',{l:p.li*.4,w1:1.15,e:-.01}],['T',{o:1}]]:[['F',{l:p.li*R(.85,1.15),w1:1.15,e:-.012}],...(ber&&nbx<14&&rnd()<.2?(nbx++,[['Bx',{}]]):[]),['B',Object.assign({},p,{n:p.n-1,k:p.k+1})]]},
    clad:(items,res)=>l70Clad(items,res,{u0:.08,sp:.78*UPC*kl,nn:3,nr:.5,ln:1.85*UPC*kl,th:50,inc:-.04,dr:.06,flat:1,fz,lim,tu:.84,lo:1.05},null),
    organ:(og,items,parts)=>{if(og.t==='Sp'&&DET>=1.5&&!LOD)l70Hook(items,og,.45*UPC,1.3);
      else if(og.t==='Bx')l70Berries(items,og,rnd()<.4?1:rnd()<.6?2:3,.36*UPC*kl,op>.75?.8:.15,lim);
      else if(og.t==='T'&&!og.p.o&&op<.42)parts.push(l70Spear(og,2.4*UPC*kl,1.5,mix(cw.c,'#c8dc8a',.5),'#9a6a7a'))}},lim)})}

/* ---------- asparagus densiflorus 'Myersii' (« queue de renard », foxtail fern): stiff upright plumes, cylindrical and dense, tapering to a point: the stem carries all round,
   in a tight spiral, short ascending branchlets clothed like itself in needle cladodes (0.8–1.5 cm) by threes; widest a little below the middle, narrowing toward the foot
   and drawn out to the tip; bright mid-green, the young plume paler. Sold natural, 30 to 60 cm ---------- */
const CW_L70MY=[{id:'vert-vif',n:'Vert vif',c:'#4f8a38',st:'#4a7634'},{id:'vert-fonce',n:'Vert foncé',c:'#36622e',st:'#44682f'}];
/* the reach of the branchlets along the plume (share u of its length) */
const l70MyR=u=>u<.28?.58+.42*u/.28:.12+.88*Math.pow((1-u)/.72,.8);
function l70Mye(g,t,o){return l70Run(g,t,o,'l70mye',CW_L70MY,45,[.02,.08],0,(k,A,cw,op,kl,lim)=>{const s=.8+.2*op,cols=l70St(cw.st),fz=l70Fz(op),ph0=R(0,360),u0=o.spine?(o.from>0?.03:.12):.14,
    nodes=l70Nodes(A,u0,.62*UPC*kl,.42*UPC*kl),Rm=4.3*UPC*kl*s,uP=u=>Math.max(0,(u-u0)/(1-u0)),ax=[];
  return l70Grow(k,A,{nodes,w0:3.6,w1:1.4,cols,wide:1.8,depth:4,wig:.008,step:5,keys:l70Keys(cw.c,{tw:shd(cw.st,-.25),core:1}),
    node:(i,u,w)=>{const L=Rm*l70MyR(uP(u))*R(.82,1.12);return[['[',{w:1.15}],['/',{a:ph0+i*137.5+R(-10,10)}],['&',{a:R(50,62)}],['F',{l:L*.5,w1:1.15,e:.02}],['F',{l:L*.5,w1:1.15,e:.03}],[']',{}]]},
    clad:(items,res,parts)=>{l70Clad(items,res,{u0,sp:.24*UPC*kl,nn:3,ln:1.3*UPC*kl,th:50,inc:.12,dr:.02,fz,lim,tu:.7,lo:1.45},null);
      /* the heart of the plume: a dark core along the stem, as wide as the branchlets reach (what is seen between the needles) */
      const C=l57At(res.chains[0]),Lc=C.L,a0=Lc*u0,n=24;for(let i=0;i<n;i++){const P=[],W=[];let z=0;for(let j=0;j<=3;j++){const l=a0+(Lc-a0)*(i*3+j)/(n*3),q=C.at(Math.min(Lc,l)),u=(l-a0)/(Lc-a0);P.push(q.p);W.push(Rm*l70MyR(u)*.42+.6);z+=q.p[2]}
        const S2=P.map(l70Q);items.push({z:z/4-Rm*.25,fn:B=>l30Add(B,'core',polyRibbon(S2,j=>W[j]))})}},
    organ:(og,items,parts)=>{if(og.t==='T'&&op<.42)parts.push(l70Spear(og,1.8*UPC*kl,1.6,mix(cw.c,'#c8dc8a',.5),'#8a6a5a'))}},lim)})}

/* ---------- asparagus falcatus (Asparagus falcatus, sicklethorn): long, stout, pale stems, woody below, with strong recurved spines at the nodes; at every node a cluster of three to five
   flat sickle-shaped cladodes (5–8 cm × 5–8 mm), curved, sharp-pointed, glossy deep green with a raised midrib; side shoots like the stem, younger and smaller toward their tips.
   Sold natural, 60 to 100 cm ---------- */
const CW_L70FA=[{id:'vert-lustre',n:'Vert lustré',c:'#2f6a2c',st:'#8a7c62'},{id:'vert',n:'Vert',c:'#3d7330',st:'#7a6c56'}];
function l70Fal(g,t,o){return l70Run(g,t,o,'l70fal',CW_L70FA,70,[.08,.2],0,(k,A,cw,op,kl,lim)=>{const s=.75+.25*op,cols=l70St(cw.st),ph0=R(0,360),
    nodes=l70Nodes(A,o.spine?(o.from>0?.04:.2):.2,3.4*UPC*kl,2.3*UPC*kl),Fr=V3.nz(A.at(.6).Fr);
  /* a cluster at a node: its cladodes fanned round the axis, turned toward the front of the spray, smaller toward the tip of their axis (q), pale and short when young */
  const cluster=(items,og)=>{const H=V3.nz(og.H),[X,Y]=fgCross(H),q=og.p.q??0,young=op<.42&&q>.7||op<.75&&q>.88,n=q>.92?2:rnd()<.3?3:rnd()<.6?4:5,a0=R(0,6.283),
      L0=(6.5*(1-.45*Math.pow(q,1.6)))*UPC*kl*(young?.55:1)*(.85+.15*op);
    for(let j=0;j<n;j++){const a=a0+j*6.283/n+R(-.3,.3),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),th=R(38,70)*D,d=V3.nz(V3.add(V3.sc(H,Math.cos(th)),V3.sc(r,Math.sin(th))));
      let nf=V3s(Fr,V3.sc(d,V3.dot(Fr,d)));nf=V3l(nf)<.2?V3.nz(V3.cr(d,r)):V3.nz(nf);nf=rotA(nf,d,R(-1,1));
      l70Sickle(items,V3.add(og.pos,V3.sc(r,og.w*.3)),d,nf,L0*R(.8,1.12),L0*R(.055,.07),(rnd()<.5?-1:1)*R(.14,.24),{dr:.05,tw:R(-.9,.9),lim})}};
  return l70Grow(k,A,{nodes,w0:4.2,w1:1.5,cols,wide:1.7,depth:13,wig:.014,keys:l70Keys(cw.c,{tw:shd(cw.st,-.2),sickle:1,cb:mix(cw.c,'#9ab88a',.35),spine:'#9a7a52'}),
    node:(i,u,w)=>{const out=[['K',{q:u}],['Sp',{}]];
      if(u>.12&&u<.82&&rnd()<.45){const Lb=(18*(1-.5*u)+5)*UPC*kl*s*R(.75,1.1),li=2.4*UPC*kl,bw=Math.max(1.4,w*.5);out.push(['[',{w:bw}],['/',{a:ph0+i*137.5+R(-20,20)}],['&',{a:R(42,58)}],['B',{n:Math.max(2,Math.round(Lb/li)),n0:Math.max(2,Math.round(Lb/li)),li,w:bw}],[']',{}])}
      return out},
    rules:{B:p=>{const qb=1-p.n/p.n0;if(p.n<=0)return[['F',{l:p.li*.4,w1:1.2,e:.004}],['K',{q:.96}]];return[['F',{l:p.li*R(.85,1.12)*(1-.3*qb),w1:Math.max(1.2,p.w*(1-.5*qb)),e:.004}],['K',{q:.4+.55*qb}],['Sp',{}],['B',Object.assign({},p,{n:p.n-1})]]}},
    organ:(og,items,parts)=>{if(og.t==='K')cluster(items,og);else if(og.t==='Sp')l70Hook(items,og,.75*UPC*kl,Math.max(1.6,og.w*.55));
      else if(og.t==='T'){if(op<.42)parts.push(l70Spear(og,3*UPC*kl,1.8,mix(cw.c,'#b8d07a',.5),'#8a5a5a'));else cluster(items,Object.assign({},og,{p:{q:1}}))}}},lim)},6.5)}

/* ---------- registries: drawers, colourways, trade grades (the length of the cut stem, cm), and how the composer treats them: a stem of foliage drawn along its spine,
   its natural length (self), its reserved radius in the mass (rk), its own clearance (fx), a stiff upright line for the foxtail (tip) ---------- */
Object.assign(GH,{'asparagus-virgatus-tree-fern':l70Vir,'asparagus-macowanii-ming-fern':l70Mac,'asparagus-densiflorus-sprengeri':l70Spr,'asparagus-densiflorus-myersii':l70Mye,'asparagus-falcatus':l70Fal});
Object.assign(CWS,{'asparagus-virgatus-tree-fern':CW_L70VI,'asparagus-macowanii-ming-fern':CW_L70MC,'asparagus-densiflorus-sprengeri':CW_L70SP,'asparagus-densiflorus-myersii':CW_L70MY,'asparagus-falcatus':CW_L70FA});
Object.assign(SZG,{'asparagus-virgatus-tree-fern':[50,60,60,80],'asparagus-macowanii-ming-fern':[40,50,50,60],'asparagus-densiflorus-sprengeri':[40,60,60,80],'asparagus-densiflorus-myersii':[30,45,45,60],'asparagus-falcatus':[60,70,70,100]});
const l70I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'asparagus-virgatus-tree-fern':l70I(60,{fx:24}),'asparagus-macowanii-ming-fern':l70I(50,{fx:22}),'asparagus-densiflorus-sprengeri':l70I(60,{fx:20}),'asparagus-densiflorus-myersii':l70I(45,{fx:16,tip:1}),'asparagus-falcatus':l70I(70,{fx:26})});
