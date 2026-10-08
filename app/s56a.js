/* ================= Serre, lot 56 — conifères : sapin de Nordmann, sapin noble, cèdre, faux-cyprès de Lawson, cyprès bleus ================= */
/* ---------- the lot's conifer: a cut branch grown by the L-system (fgGrow: the main axis along the composer's spine, its side shoots levelled into the plane of the spray),
   then, in post, its younger orders (l56Kids: the side shoots of the side shoots, flat in the spray's plane for firs and false cypress, all round for the cypress),
   and on every axis its foliage — needles one by one (combed in two ranks, brushed upward, in rosettes on short spurs) or scale leaves as ribbons — gathered by tone into a few paths per piece ---------- */
const l56Q=p=>[p[0],-p[1]];
/* an axis (3D points and widths) walked by its length */
function l56Ax(pts,ws){const n=pts.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));
  return{L:cum[n-1],at:l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const u=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),w:ws[i-1]+(ws[i]-ws[i-1])*u}}}}
/* the spray's frame at a point: N its face (the front of the spray made normal to the axis), S across it in its plane */
function l56Pl(T,Fr){let N=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));if(V3l(N)<1e-4)N=fgCross(T)[0];N=V3.nz(N);return{N,S:V3.cr(N,T)}}
/* the younger shoots of an axis: alternate in the plane (flat) or in a spiral round it, each a short arc bending forward along its parent, shorter toward the parent's tip (taper) */
function l56Kids(par,Fr,L){const ax=l56Ax(par.pts,par.ws),out=[];if(ax.L<L.min*1.2)return out;let l=ax.L*(par.ord?L.u0:L.m0??L.u0),s=rnd()<.5?1:-1,az=R(0,6.283);
  while(l<ax.L*(1-(L.te??.08))){const q=ax.at(l),u=l/ax.L,pl=l56Pl(q.T,Fr),Lb=L.len*(L.taper?1-L.taper*u:1)*R(.78,1.15);
    if(Lb>=L.min){let r;if(L.flat){r=V3.add(V3.sc(pl.S,s),V3.sc(pl.N,R(-.08,.12)));s=-s}else{az+=137.5*D+R(-.3,.3);r=V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az)))}
      const a=(L.ang+R(-8,8))*D,n=4,w0=Math.max(L.w1,Math.min(q.w*.72,L.w)),pts=[V3.add(q.p,V3.sc(q.T,-q.w*.2))],ws=[w0];let d=V3.nz(V3.add(V3.sc(q.T,Math.cos(a)),V3.sc(r,Math.sin(a)))),p=q.p;
      for(let i=1;i<=n;i++){d=V3.nz(V3.add(d,V3.sc(q.T,L.fw??.14)));p=V3.add(V3.add(p,V3.sc(d,Lb/n)),[0,-(L.dr||0)*Lb*i/n/n,0]);pts.push(p);ws.push(w0+(L.w1-w0)*i/n)}
      out.push({pts,ws,ord:par.ord+1,sub:1,u0:u})}
    l+=L.sp*R(.8,1.2)}
  return out}
/* the foliage of a grown branch. S: u0 (the bare foot of the main axis), lv (the younger orders, from the oldest), and either nd (needles at each step sp of an axis) or scale (the axes themselves clothed);
   tw: twig colour, sw needle stroke, lim (nothing below the vessel's mouth), tipD (a bud or a young tuft at the tip of a young shoot) ---------- */
function l56Fol(res,parts,Fr,cw,S){const det=DET>=1.5&&!LOD,P=pal7(cw.c),PU=pal7(cw.u||mix(cw.c,'#d4dcd6',.28)),K=det?60:170,sw=S.sw*(det?1:1.18),spk=det?1:S.spk??1.4,
    TN=[toneAt(P,.3),toneAt(P,.52),toneAt(P,S.hi??.76),toneAt(PU,.58)],tw=mix(S.tw||cw.bark||'#6a5040',toneAt(P,.22),S.twm??.45);
  let bins={},zs=0,zc=0,cnt=0;
  const ok=(...Q)=>S.lim==null||Q.every(p=>p[1]>=S.lim),Qs=p=>{const a=l56Q(p);return f(a[0])+','+f(a[1])};
  const add=(k,d)=>{bins[k]=(bins[k]||'')+d;cnt++};
  /* the styles: per layer (0 behind the axes of the piece, 1 in front), in their order of drawing */
  const ST={tw:[0,{stroke:tw,'stroke-width':f(1.25)}],n0:[0,{stroke:TN[0]}],n1:[1,{stroke:TN[1]}],n2:[1,{stroke:TN[2]}],n3:[1,{stroke:TN[3]}],sn:[1,{stroke:'#f4f4f0','stroke-width':f(sw*1.25)}],
    bd:[1,{stroke:cw.band||'#e8eee8','stroke-width':f(det?.42:.55),'stroke-opacity':.9}],
    w0:[1,{stroke:TN[0]}],w1:[1,{stroke:TN[1]}],w2:[1,{stroke:TN[2]}],w3:[1,{stroke:TN[3]}],tx:[1,{stroke:cw.tx||P.l2,'stroke-dasharray':det?'1.1 1.5':'1.3 1.8','stroke-opacity':.75}],
    tu:[1,{stroke:cw.mark||'#eef2ee','stroke-dasharray':'.9 2.2','stroke-opacity':.8}],bud:[1,{fill:S.budC||'#7a5a3a',stroke:shd(S.budC||'#7a5a3a',-.4),'stroke-width':.4}],
    yg:[1,{stroke:S.young||'#a8c860'}],rd:[1,{fill:cw.male||'#b03a3a',stroke:shd(cw.male||'#b03a3a',-.4),'stroke-width':.35}]};
  const flush=()=>{if(!cnt)return;const z=zs/(zc||1),bb=bins;bins={};zs=zc=cnt=0;
    for(const ly of[0,1])parts.push({z:z+(ly?(S.scale?2.5:.4):-.4),cast:false,fn:g=>{for(const k0 in ST)for(const k of[k0+'W',k0]){if(ST[k0][0]!==ly||!bb[k])continue;const st=ST[k0][1],wk=k0[0]==='w'||k0==='tx'||k0==='tu'?S.ws(k):k0==='yg'?sw:null;
      E('path',Object.assign({d:bb[k],fill:'none','stroke-linecap':'round','stroke-linejoin':'round','stroke-width':f(Math.max(1.1,sw))},st,wk?{'stroke-width':f(wk)}:{},st.fill?{}:{fill:'none'}),g)}}})};
  /* the tone of a needle from its face n (seen from behind: its underside, banded), and whether it lies behind its axis */
  const em={needle:(b,m,e,n,pz,un=1)=>{if(!ok(b,m,e))return;let k;if(un&&n[2]<-.08)k='n3';else{const I=lightI(n[2]>=0?n:V3.sc(n,-1))+R(-.04,.04);k=e[2]<pz-1.2?'n0':I>.64?'n2':'n1'}
      const d=`M${Qs(b)}Q${Qs(m)} ${Qs(e)}`;if(cw.snow&&k!=='n3'&&k!=='n0'&&rnd()<cw.snow)k='sn';add(k,d);if(k==='n3'&&!LOD)add('bd',d)},
    line:(k,Q)=>{if(!ok(...Q))return;add(k,'M'+Q.map(Qs).join('L'))},
    blob:(k,c,ax,hl,r)=>{if(!ok(c))return;const sp=l45Spin(V3.add(c,V3.sc(ax,-hl)),V3.add(c,V3.sc(ax,hl)),t=>r*Math.pow(Math.sin(Math.PI*Math.min(1,t*.92+.06)),.6),8);add(k,smooth(sp.P))},
    at:p=>{zs+=p[2];zc++},Fr};
  /* the younger orders of every axis, kept with their parents */
  const fam=[];for(const ch of res.chains){if(ch.pts.length<2)continue;const top={pts:ch.pts,ws:ch.ws,ord:ch.ord?1:0},grp=[top];let gen=[top];
    for(const L of S.lv||[]){const nx=[];for(const a of gen)if(a.ord>=(L.from??0))nx.push(...l56Kids(a,Fr,L));grp.push(...nx);gen=nx}fam.push(grp)}
  for(const grp of fam){for(const a of grp){const ax=l56Ax(a.pts,a.ws),a0=a.ord?0:ax.L*S.u0;if(ax.L-a0<3)continue;
      if(a.sub&&S.nd)em.line('tw',a.pts);
      if(S.nd){const n=Math.max(2,Math.round((ax.L-a0)/(S.sp*spk)));for(let i=0;i<n;i++){const l=a0+(ax.L-a0)*(i+R(-.25,.25))/n,q=ax.at(Math.max(0,Math.min(ax.L,l))),u=(l-a0)/(ax.L-a0);em.at(q.p);
          S.nd(q,u,l56Pl(q.T,Fr),em,a);if(cnt>=K)flush()}}
      else if(S.scale){/* the scale-clad axis: its points from the start of its leafy part, as a ribbon in the tone of its face */
        const Q=[];for(let l=a0;l<=ax.L+.01;l+=Math.max(2.5,ax.L/14))Q.push(ax.at(Math.min(ax.L,l)).p);if(V3l(V3s(Q[Q.length-1],ax.at(ax.L).p))>.5)Q.push(ax.at(ax.L).p);
        const mid=ax.at((a0+ax.L)/2),pl=l56Pl(mid.T,Fr),n=S.scale.flat?pl.N:V3.nz(V3.add(V3.sc(pl.N,.5),[0,.3,.8])),cl=a.ord<=1?'W':'';let k;
        if(S.scale.flat&&n[2]<-.08)k='w3';else{const I=lightI(n[2]>=0?n:V3.sc(n,-1))+R(-.14,.14)+(S.scale.flat?0:(a.ord-1.5)*.06);k=I<.46?'w0':I>.68?'w2':'w1'}
        for(const p of Q)em.at(p);em.line(k+cl,Q);if(!LOD&&(det||a.ord>=1))em.line((k==='w3'?'tu':'tx')+cl,Q);
        if(S.tipD&&a.sub)S.tipD(Q[Q.length-1],ax.at(ax.L).T,a,em)}
      if(S.nd&&S.tipD)S.tipD(ax.at(ax.L).p,ax.at(ax.L).T,a,em);
      if(cnt>=K)flush()}
    if(cnt>=K/4)flush()}
  flush()}
/* the twig colours of a conifer (its bark), from dark to light */
const l56St=b=>[shd(b,-.6),shd(b,-.3),b,shd(b,.35)];
/* a bud (or a few, set round the tip): an ovoid of brown scales, its scales a fine zigzag, as a part */
function l56Buds(og,kl,col,o={}){const H=V3.nz(og.H),[X,Y]=fgCross(H),P=pal7(col),out=[],L0=(o.len||.5)*UPC*kl,r0=(o.r||.18)*UPC*kl;
  const one=(b,d,L2,r2,zb)=>{const e=V3.add(b,V3.sc(d,L2)),sp=l45Spin(V3.add(b,V3.sc(d,-r2*.4)),e,t=>r2*Math.pow(Math.sin(Math.PI*Math.min(1,t*.85+.15)),.65)*(t<.6?1:1-.35*(t-.6)/.4),10,o.zz??.06),
      I=lightI(V3.nz(V3.add(fgCross(d)[0],[0,0,.5])));if(o.lim!=null&&Math.min(b[1],e[1])<o.lim)return;
    out.push({z:(b[2]+e[2])/2+zb,cast:false,fn:g=>{E('path',{d:smooth(sp.P),fill:toneAt(P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);
      if(o.res&&!LOD)E('path',{d:smooth(sp.P.map(q=>[q[0]*.55+sp.C[5][0]*.45,q[1]*.55+sp.C[5][1]*.45])),fill:'#e8dcc0',opacity:.35},g)}})};
  one(og.pos,H,L0,r0,.3);const nl=o.n??2;for(let i=0;i<nl;i++){const a=(nl===2?(i?.5:-.5)*Math.PI+R(-.2,.2):i/nl*6.283),side=o.N?V3.cr(o.N,H):X,dd=V3.nz(V3.add(H,V3.sc(V3.add(V3.sc(side,Math.cos(a)),V3.sc(o.N||Y,Math.sin(a)*(nl===2?.3:1))),.7)));
    one(V3.add(og.pos,V3.sc(H,-L0*.15)),dd,L0*.7,r0*.85,dd[2]>0?.2:-.2)}
  return out}
/* the whole branch: the colourway, its size (the recipe's unit), its stage, the L-system and the lot's foliage */
function l56Plant(g,t,o,list,id,cm0,SP){const cw=fgCw(list,o),op=Math.max(.05,Math.min(1,o.op??1)),ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.62+.38*ks,k=G(g);
  return g35Run(o,id,()=>{const Lt=o.spine?blen(o.spine):SP.L*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(SP.arch[0],SP.arch[1])),lim=g35Lim(o),cols=l56St(SP.stc?mix(cw.bark||SP.bark,shd(cw.c,-.35),SP.stc):cw.bark||SP.bark);let nc=0;const mc=SP.cones?SP.cones(cw,op):0;
    const r=fgGrow(k,A,{li:SP.li*UPC*kl,liT:.3,w0:SP.w0*kl,w1:1.3,cols,uL:2,lp:0,phy:SP.phy||'alt2',seg:10,piece:16,wig:SP.wig??.025,tipLv:0,lift:SP.lift,side:SP.side,axil:SP.axil,
      tip:og=>SP.tip?SP.tip(og,op,kl,cw,lim):null,axDraw:og=>{if(nc>=mc||!SP.cone)return null;nc++;return SP.cone(og,kl,cw,op,lim)},
      post:(res,parts,Fr)=>l56Fol(res,parts,Fr,cw,SP.fol(cw,op,kl,lim,o))});
    open(k,t,1000,0,.4);return r})}

/* ---------- Nordmann fir (Abies nordmanniana, Caucasus): stiff flat sprays, the side shoots in pairs at the end of each year's growth, all in one plane; the needles short (2–3 cm), flat,
   blunt and notched at the tip, dark glossy green above with two white stomatal bands beneath, set all round the shoot but twisted into a comb — two spread ranks at the sides and
   shorter ones pressed forward over the top, hiding the twig; buds ovoid, brown, not resinous, three at the tip of a shoot. No cones on the cut spray (they stand erect high in the tree
   and shatter there). In spring the buds break into soft tufts of lime-green needles ---------- */
const CW_L56NOR=[{id:'vert-sapin',n:'Vert sapin brillant (Nordmann)',c:'#2e4b2c',u:'#5c7868',bark:'#6e5e4c'},{id:'vert-bleute',n:'Vert bleuté (Nordmann sélection)',c:'#33504a',u:'#62807a',bark:'#6a5e50'},
  {id:'floque',n:'Floqué blanc (Nordmann enneigé)',c:'#2e4b2c',u:'#5c7868',bark:'#6e5e4c',snow:.35,f:1}];
/* the comb: at each step two ranks spread in the plane (th from the shoot), a little raised, and short ones over the top bent forward */
function l56NorNd(S){return(q,u,pl,em,a)=>{const tip=u>.86?.5+.5*(1-u)/.14:1,Ln=S.ln*tip*R(.86,1.08)*(a.ord>1?.85:1),bw=q.w*.32;
  for(const s of[-1,1]){const th=(S.th+R(-12,12))*(u>.9?.6:1)*D,d=V3.nz(V3.add(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(pl.S,s*Math.sin(th))),V3.sc(pl.N,R(.04,.22)))),
      b=V3.add(q.p,V3.sc(pl.S,s*bw)),e=V3.add(b,V3.sc(d,Ln)),m=V3.add(V3.add(b,V3.sc(d,Ln*.5)),V3.sc(pl.N,Ln*.07));em.needle(b,m,e,V3.nz(V3.add(pl.N,V3.sc(pl.S,s*.55))),q.p[2])}
  if(rnd()<S.top){const s=R(-1,1),d=V3.nz(V3.add(V3.add(V3.sc(q.T,.85),V3.sc(pl.N,.42)),V3.sc(pl.S,s*.45))),Lt=Ln*R(.55,.75),b=V3.add(q.p,V3.sc(pl.N,bw)),e=V3.add(b,V3.sc(d,Lt)),
      m=V3.add(V3.add(b,V3.sc(d,Lt*.5)),V3.sc(pl.N,Lt*.08));em.needle(b,m,e,V3.nz(V3.add(pl.N,V3.sc(q.T,-.4))),q.p[2]+1.5,0)}}}
/* the buds at a shoot's tip, or (young) its pale tuft breaking out of the bud scales */
function l56FirTip(q,T,a,em,S){const pl=l56Pl(T,S.Fr||[0,0,1]);if(S.op<.6){const n=LOD?3:6,Ly=S.ln*(.35+.55*(.6-S.op)/.55);
    for(let i=0;i<n;i++){const s=(i/(n-1)-.5)*2,d=V3.nz(V3.add(V3.add(T,V3.sc(pl.S,s*.45)),V3.sc(pl.N,R(.05,.3)))),e=V3.add(q,V3.sc(d,Ly*R(.8,1.05))),m=V3.add(V3.add(q,V3.sc(d,Ly*.5)),V3.sc(pl.N,Ly*.06));
      if(S.lim==null||e[1]>=S.lim)em.line('yg',[q,m,e])}}
  em.blob('bud',V3.add(q,V3.sc(T,S.bl*.45)),T,S.bl*.5,S.br)}
function l56Nor(g,t,o){return l56Plant(g,t,o,CW_L56NOR,'l56nor',2.6,{L:52,arch:[.06,.16],li:2.2,w0:5.2,bark:'#6e5e4c',phy:'alt2',lift:.2,
  side:{u0:.26,u1:.84,p:.85,len:.55,ang:56,li:.85,e:-.006,tilt:6},
  fol:(cw,op,kl,lim)=>{const ln=2.4*UPC*kl,S={u0:.26,sp:.24*UPC*kl,sw:1.45,hi:.82,tw:shd('#6e5e4c',-.15),lim,
      lv:[{from:1,u0:.18,sp:4.2*UPC*kl,len:7*UPC*kl,taper:.75,ang:50,flat:1,min:2.2*UPC*kl,w:2.4,w1:1.3,fw:.1,te:.25}],
      nd:l56NorNd({ln,th:74,top:.6})};
    S.tipD=(q,T,a,em)=>{if(a.ord<=2)l56FirTip(q,T,a,em,{op,ln,lim,bl:.42*UPC*kl,br:.15*UPC*kl,Fr:em.Fr})};S.budC='#8a6a48';S.young='#a6c656';return S}})}

/* ---------- noble fir (Abies procera, « sapin noble », Pacific Northwest; sold as « Noble » greens): stiff, rather short shoots densely clothed; the needles 2.5–3.5 cm, four-angled,
   blue-green to glaucous silver on both faces (stomata on both sides), each from a short sideways base curved sharply upward like a hockey stick, so that the upper side is a dense brush
   and the underside of the shoot shows bare between the ranks; buds small, rounded, resinous, red-brown, hidden in the needles. Its huge erect cones are not on the cut greens ---------- */
const CW_L56NOB=[{id:'bleu-vert',n:'Bleu-vert glauque (Noble)',c:'#5f8483',bark:'#7a4b33'},{id:'argente',n:'Bleu argenté (Noble Glauca)',c:'#7d9ea4',bark:'#7a4b33'},
  {id:'vert-gris',n:'Vert gris (Noble)',c:'#5a7a68',bark:'#7a5038'}];
function l56NobNd(S){return(q,u,pl,em,a)=>{const tip=u>.84?.45+.55*(1-u)/.16:1,n=a.ord>1?2:3;
  for(let j=0;j<n;j++){const az=(R(-1,1)*80)*D,r=V3.nz(V3.add(V3.sc(pl.S,Math.sin(az)),V3.sc(pl.N,Math.cos(az)*.7+.15))),Ln=S.ln*tip*R(.8,1.08),th=(S.th+R(-10,10))*D,
      b=V3.add(q.p,V3.sc(r,q.w*.3)),d0=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(r,Math.sin(th)))),
      /* the hockey stick: out from the shoot, then up toward the face of the spray and forward */
      m=V3.add(V3.add(b,V3.sc(d0,Ln*.45)),V3.sc(pl.N,Ln*.06)),e=V3.add(V3.add(V3.add(b,V3.sc(d0,Ln*.55)),V3.sc(pl.N,Ln*.42)),V3.sc(q.T,Ln*.3));
    em.needle(b,m,e,V3.nz(V3.add(V3.sc(r,.6),V3.sc(pl.N,.5))),q.p[2]+(Math.cos(az)>.2?1.5:0),0)}}}
function l56Nob(g,t,o){return l56Plant(g,t,o,CW_L56NOB,'l56nob',2.5,{stc:.45,L:50,arch:[.03,.1],li:2,w0:5.6,bark:'#7a4b33',phy:'alt2',lift:.25,wig:.015,
  side:{u0:.26,u1:.84,p:.85,len:.45,ang:54,li:.8,e:-.003,tilt:6},
  fol:(cw,op,kl,lim)=>{const ln=2.8*UPC*kl,S={u0:.26,sp:.26*UPC*kl,sw:1.3,hi:.84,tw:shd(cw.bark,-.1),twm:.7,lim,
      lv:[{from:1,u0:.18,sp:3.6*UPC*kl,len:5.5*UPC*kl,taper:.7,ang:48,flat:1,min:2*UPC*kl,w:2.6,w1:1.4,fw:.1,te:.25}],
      nd:l56NobNd({ln,th:62})};
    S.tipD=(q,T,a,em)=>{if(a.ord<=2)l56FirTip(q,T,a,em,{op,ln:ln*.8,lim,bl:.3*UPC*kl,br:.14*UPC*kl,Fr:em.Fr})};S.budC='#8a4a2c';S.young='#9fc4a8';return S}})}

/* ---------- cedar (Cedrus atlantica 'Glauca', Atlas cedar; C. deodara, Himalayan cedar): long shoots carrying scattered single needles (the year's growth), and on the older wood short
   spur shoots, each a peg crowned by a rosette of 15–35 needles; needles stiff, three- to four-angled, 1.5–2.5 cm and silvery blue in the Atlas cedar 'Glauca', 2.5–5 cm, softer and
   grey-green in the deodar, whose branch tips and leader droop; 'Aurea' golden. In autumn the male cones stand on the spurs, erect pale cylinders 3–5 cm; the barrel-shaped female cones
   (5–10 cm) are not on the cut branches ---------- */
const CW_L56CED=[{id:'bleu-argente',n:'Bleu argenté (C. atlantica Glauca)',c:'#86a2ac',bark:'#7d7a74',ln:2,pd:0},{id:'vert-gris',n:'Vert gris retombant (C. deodara)',c:'#6c8a72',bark:'#6e675c',ln:3.6,pd:1},
  {id:'dore',n:'Doré (C. deodara Aurea)',c:'#a4a65a',bark:'#7a6e58',ln:3,pd:1},{id:'bleu-vert',n:'Bleu-vert (C. atlantica)',c:'#6f8f8c',bark:'#77726a',ln:2.1,pd:0}];
function l56CedNd(S){return(q,u,pl,em,a)=>{const young=u>S.yu;
  for(let j=0;j<(young?3:rnd()<.3?1:0);j++){/* single needles on the long shoot, spiral round it */const az=R(0,6.283),r=V3.nz(V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az)))),Ln=S.ln*R(.5,.75)*(u>.9?.6:1),th=R(30,55)*D,
      d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(r,Math.sin(th)))),b=V3.add(q.p,V3.sc(r,q.w*.3)),e=V3.add(b,V3.sc(d,Ln));em.needle(b,V3.add(b,V3.sc(d,Ln*.5)),e,r,q.p[2],0)}if(young)return;
  /* the spur: a short peg toward the face or the sides, crowned by its rosette */
  const az=R(-1,1)*(S.pd?1.9:1.5),r=V3.nz(V3.add(V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az))),V3.sc(q.T,.35))),sl=S.sl,b=V3.add(q.p,V3.sc(r,q.w*.2)),c=V3.add(b,V3.sc(r,sl));
  em.line('tw',[q.p,c]);const [X,Y]=fgCross(r),n=S.nn,ph=R(0,6.283);
  for(let i=0;i<n;i++){const t=ph+i*2.4,cone=(i/n*40+18)*D,d=V3.nz(V3.add(V3.add(V3.sc(r,Math.cos(cone)),V3.sc(V3.add(V3.sc(X,Math.cos(t)),V3.sc(Y,Math.sin(t))),Math.sin(cone))),[0,-S.pd*.25*Math.sin(cone),0])),
      Ln=S.ln*R(.72,1.05),e=V3.add(c,V3.sc(d,Ln)),m=V3.add(V3.add(c,V3.sc(d,Ln*.5)),[0,-S.pd*Ln*.05,0]);em.needle(c,m,e,V3.nz(V3.add(d,V3.sc(r,.3))),c[2]-.5,0)}}}
/* the male cone: an erect pale cylinder on a spur, scales spiralled */
function l56CedCone(og,kl,cw,op,lim){if(op<.55)return null;const H=V3.nz(V3.add(V3.sc(V3.nz(og.H),.5),[0,.8,.25])),b=og.pos,Lc=R(2.8,4)*UPC*kl,e=V3.add(b,V3.sc(H,Lc)),rc=.42*UPC*kl;
  if(lim!=null&&Math.min(b[1],e[1])<lim)return null;const col=op<.85?'#b8b48a':'#a88a5a',P=pal7(col),sp=l45Spin(b,e,t=>rc*Math.pow(Math.sin(Math.PI*Math.min(1,t*.9+.1)),.45),12,.08);
  return[{z:(b[2]+e[2])/2,cast:false,fn:g=>{E('path',{d:smooth(sp.P),fill:toneAt(P,.62),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);
    if(!LOD){let d='';for(let i=1;i<12;i++){const c=sp.C[i],r3=rc*.85;d+=`M${f(c[0]-sp.nx*r3)},${f(c[1]-sp.ny*r3)}L${f(c[0]+sp.nx*r3*.2+(sp.C[i+1][0]-c[0])*.6)},${f(c[1]+sp.ny*r3*.2+(sp.C[i+1][1]-c[1])*.6)}`}
      E('path',{d,stroke:P.d1,'stroke-width':.45,'stroke-opacity':.6,fill:'none'},g)}}}]}
function l56Ced(g,t,o){const cw0=fgCw(CW_L56CED,o);return l56Plant(g,t,o,CW_L56CED,'l56ced',2.5,{L:55,arch:cw0.pd?[.14,.24]:[.06,.14],li:2.6,w0:5,bark:'#7d7a74',phy:'spiral',lift:.15,wig:.02,
  side:{u0:.22,u1:.86,p:.62,len:cw0.pd?.55:.48,ang:cw0.pd?62:52,li:.9,e:cw0.pd?-.05:-.012,tilt:16},
  axil:{u0:.35,p:.18,ang:40},cones:(cw,op)=>op<.55?0:rnd()<.55?(rnd()<.5?3:2):0,cone:l56CedCone,
  tip:(og,op,kl,cw,lim)=>DET>=1.5&&!LOD?l56Buds(og,kl,'#7a6450',{len:.22,r:.12,n:0,lim}):null,
  fol:(cw,op,kl,lim)=>{const ln=cw.ln*UPC*(.85+.15*kl)*(op<.5?.75:1),pd=cw.pd;return{u0:.2,sp:.62*UPC*kl,sw:1.2,hi:.86,tw:shd(cw.bark,-.15),lim,
      lv:[{from:0,m0:.3,u0:.15,sp:2*UPC*kl,len:(pd?8:6)*UPC*kl,taper:.5,ang:pd?58:50,flat:0,min:1.6*UPC*kl,w:2.2,w1:1.3,fw:.08,dr:pd?.5:.12,te:.2}],
      nd:l56CedNd({ln,yu:.86,sl:.32*UPC*kl,nn:DET>=1.5&&!LOD?14:8,pd})}}})}

/* ---------- Lawson false cypress (Chamaecyparis lawsoniana, « faux-cyprès de Lawson »): soft flattened sprays held in one plane, branched three or four times, alternately, like a fern;
   the ultimate branchlets 1.5–2 mm wide, clad in tiny scale leaves pressed in opposite pairs (the facial ones flat, the laterals keeled), with indistinct white X marks beneath;
   the leader and branch tips droop. Many cultivars sold for greens: green, blue ('Pembury Blue', 'Columnaris'), golden ('Stardust', 'Lane'). Small round cones, 8–10 mm, of eight
   shield-shaped scales, glaucous blue-green then red-brown; in spring the male cones crimson at the branchlet tips ---------- */
const CW_L56LAW=[{id:'vert',n:'Vert (Lawson type)',c:'#3e6a3c',bark:'#7a5a40',male:'#b0303a'},{id:'bleu',n:'Bleu (Pembury Blue)',c:'#7d9ca4',bark:'#7a5a48',male:'#a83848'},
  {id:'bleu-vert',n:'Bleu-vert (Columnaris)',c:'#5c8480',bark:'#7a5a44',male:'#a83a40'},{id:'dore',n:'Doré (Stardust)',c:'#b8a43c',bark:'#86643e',male:'#b04a30',tx:'#e8dc8a'}];
/* the cone: a small sphere on its short stalk, its shield-shaped scales meeting in a cross, each with its little boss */
function l56Globe(og,kl,cw,op,lim,o){const H=V3.nz(og.H),rc=o.r*UPC*kl,b=og.pos,c=V3.add(V3.add(b,V3.sc(H,rc*1.1)),[0,-rc*.25,0]);if(lim!=null&&c[1]-rc<lim)return null;
  const col=op<o.ripe?o.young:o.old,P=pal7(col),cq=l56Q(c),bq=l56Q(b),ns=o.ns,ph=R(0,6.283);
  return[{z:c[2]+rc*.5,cast:false,fn:g=>{l45Line(g,[bq,cq],Math.max(1.2,rc*.35),shd(cw.bark,-.25));E('circle',{cx:f(cq[0]),cy:f(cq[1]),r:f(rc),fill:toneAt(P,.56),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55},g);
    if(!LOD){/* the sutures between the scales: from a central point, offset toward the light, out to the rim */const o2=[cq[0]-rc*.18,cq[1]-rc*.2];let d='',bo='';
      for(let i=0;i<ns;i++){const a=ph+i/ns*6.283,e=[cq[0]+Math.cos(a)*rc*.98,cq[1]+Math.sin(a)*rc*.98];d+=`M${f(o2[0])},${f(o2[1])}L${f(e[0])},${f(e[1])}`;
        const a2=a+3.1416/ns,m=[o2[0]*.45+(cq[0]+Math.cos(a2)*rc*.7)*.55,o2[1]*.45+(cq[1]+Math.sin(a2)*rc*.7)*.55];bo+=`M${f(m[0])},${f(m[1])}l.01,0`}
      E('path',{d,stroke:P.d2,'stroke-width':.5,'stroke-opacity':.7,fill:'none'},g);E('path',{d:bo,stroke:P.l2,'stroke-width':1.3,'stroke-linecap':'round',fill:'none'},g);
      E('path',{d:`M${f(cq[0]-rc*.62)},${f(cq[1]-rc*.1)}A${f(rc*.66)},${f(rc*.66)} 0 0 1 ${f(cq[0]+rc*.1)},${f(cq[1]-rc*.64)}`,stroke:P.l2,'stroke-width':.8,'stroke-opacity':.55,fill:'none'},g)}}}]}
function l56Law(g,t,o){return l56Plant(g,t,o,CW_L56LAW,'l56law',12,{L:50,arch:[.12,.22],li:2.6,w0:4.6,bark:'#7a5a40',phy:'alt2',lift:.2,
  side:{u0:.24,u1:.84,p:.7,len:.5,ang:56,li:.9,e:-.025,tilt:8},
  axil:{u0:.4,p:.3,ang:45},cones:(cw,op)=>op<.4?0:R(2,5)|0,cone:(og,kl,cw,op,lim)=>l56Globe(og,kl,cw,op,lim,{r:.42,ns:4,ripe:.85,young:mix(cw.c,'#8fa8a0',.5),old:'#8a5a3a'}),
  fol:(cw,op,kl,lim)=>{const det=DET>=1.5&&!LOD,wS=det?1.7:2.1;return{u0:.24,lim,scale:{flat:1},
      ws:k=>{const w=k.endsWith('W')?wS*1.8:wS;return k[0]==='t'?Math.max(.55,w*.42):w},
      lv:[{from:0,m0:.28,u0:.05,sp:(det?1.1:1.3)*UPC*kl,len:4.2*UPC*kl,taper:.75,ang:50,flat:1,min:.5*UPC*kl,w:2.4,w1:1.5,fw:.1,dr:.1,te:.04},
        {from:1,u0:.1,sp:(det?.6:.75)*UPC*kl,len:1.3*UPC*kl,taper:.65,ang:48,flat:1,min:.3*UPC*kl,w:1.8,w1:1.3,fw:.12,te:.06},
        ...(det?[{from:2,u0:.2,sp:.42*UPC*kl,len:.55*UPC*kl,taper:.5,ang:45,flat:1,min:.3*UPC*kl,w:1.5,w1:1.2,fw:.1,te:.28}]:[])],
      tipD:(q,T,a,em)=>{if(op<.45&&a.ord===2&&rnd()<.35)em.blob('rd',V3.add(q,V3.sc(T,.9)),T,1.1,1.1)}}}})}

/* ---------- blue cypress (Hesperocyparis arizonica syn. Cupressus arizonica 'Blue Ice', Arizona cypress; × Cuprocyparis leylandii, Leyland): stiff dense shoots branching all round, not in a
   plane — the ultimate branchlets four-angled, 1.5–2 mm thick, clad in tiny closely pressed scale leaves under a silvery bloom, often dotted white with resin glands; the young twigs plum-red
   in 'Blue Ice'; Leyland greener and flatter. Cones globose, 1.5–2.5 cm, of six to eight thick peltate scales each with a small central point, glaucous blue then grey-brown,
   persisting on the branches ---------- */
const CW_L56CUP=[{id:'blue-ice',n:'Bleu argenté (Blue Ice)',c:'#8aa8b0',bark:'#7a4a46',mark:'#f2f4f2'},{id:'carolina',n:'Bleu-vert (Carolina Sapphire)',c:'#6f9294',bark:'#7a5046'},
  {id:'leyland',n:'Vert (× Cuprocyparis leylandii)',c:'#4c6e3e',bark:'#7b5b45',fl:1},{id:'dore',n:'Doré (Castlewellan Gold)',c:'#a89c40',bark:'#806040',fl:1,tx:'#e2d688'}];
function l56Cup(g,t,o){return l56Plant(g,t,o,CW_L56CUP,'l56cup',8,{L:48,arch:[.04,.12],li:2.2,w0:5,bark:'#7a4a46',phy:'spiral',lift:.2,wig:.03,
  side:{u0:.22,u1:.82,p:.55,len:.38,ang:44,li:.85,e:-.006,tilt:30},
  axil:{u0:.3,p:.3,ang:55},cones:(cw,op)=>rnd()<.7?(R(1,3.99)|0):0,cone:(og,kl,cw,op,lim)=>l56Globe(og,kl,cw,op,lim,{r:1,ns:6,ripe:.6,young:mix(cw.c,'#7a9a94',.4),old:'#7a6a5a'}),
  fol:(cw,op,kl,lim)=>{const det=DET>=1.5&&!LOD,wS=det?1.8:2.2,fl=!!cw.fl;return{u0:.22,lim,scale:{flat:fl},
      ws:k=>{const w=k.endsWith('W')?wS*1.8:wS;return k[0]==='t'?Math.max(.55,w*.4):w},
      lv:[{from:0,m0:.26,u0:.03,sp:(det?.48:.58)*UPC*kl,len:3.2*UPC*kl,taper:.5,ang:fl?50:44,flat:fl,min:.8*UPC*kl,w:2.4,w1:1.6,fw:.12,te:.04},
        {from:1,u0:.08,sp:(det?.28:.42)*UPC*kl,len:1*UPC*kl,taper:.4,ang:42,flat:fl,min:.35*UPC*kl,w:1.9,w1:1.4,fw:.12,te:.1}]}}})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the firs and the cedar: the needle length, cm; the false cypress: the width of a spray; the cypress: a shoot),
   and how the composer treats them: cut foliage along its spine ---------- */
Object.assign(GH,{'abies-nordmanniana-nordmann':l56Nor,'abies-procera-nobilis':l56Nob,'cedrus-cedre':l56Ced,'chamaecyparis-lawsoniana':l56Law,'cupressus-cypres-bleus':l56Cup});
Object.assign(CWS,{'abies-nordmanniana-nordmann':CW_L56NOR,'abies-procera-nobilis':CW_L56NOB,'cedrus-cedre':CW_L56CED,'chamaecyparis-lawsoniana':CW_L56LAW,'cupressus-cypres-bleus':CW_L56CUP});
Object.assign(SZG,{'abies-nordmanniana-nordmann':[2.2,2.6,2.6,3],'abies-procera-nobilis':[2.2,2.5,2.5,3],'cedrus-cedre':[2,2.5,2.5,3],'chamaecyparis-lawsoniana':[10,12,12,14],'cupressus-cypres-bleus':[6,8,8,10]});
const L56_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'abies-nordmanniana-nordmann':L56_I(52,{fx:26}),'abies-procera-nobilis':L56_I(50,{fx:24}),'cedrus-cedre':L56_I(55,{fx:24}),'chamaecyparis-lawsoniana':L56_I(50,{fx:28}),'cupressus-cypres-bleus':L56_I(48,{fx:22})});
