/* ================= Serre, lot 83 — aiguilles et australiennes : podocarpus, nagi, if, acacia en feuillage, adenanthos (feuillages coupés poussés par le L-système) ================= */
/* ---------- the lot's branch: fgGrow (lot 24) grows the main axis along the composer's spine and its side shoots, l56Kids (lot 56) adds the younger orders; then every axis is clothed,
   step by step, by its species (S.nd): flat blades in 3D (two halves lit by their own normals, a raised midrib, fine parallel veins, a gloss), strokes for needles and cut lobes,
   arils on their stalks. Hundreds of organs become items at their depth, sorted and cut into a few bins (l30Batch, lot 30), each bin one path per tone: a branch costs a few dozen elements.
   Every organ starts on the point of its carrying axis; every stroke is at least 1.1 wide ---------- */
const L83_MW=1.12;
const l83Pd=P=>'M'+P.map(q=>f(q[0])+','+f(-q[1])).join('L');
const l83Qd=(a,m,e)=>`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(e[0])},${f(-e[1])}`;
/* an ellipse on the screen (centre in view space, y up), its first axis along the screen angle th */
const l83Ell=(c,rx,ry,th,n=14)=>{const ct=Math.cos(th),st=Math.sin(th);let d='';for(let i=0;i<n;i++){const t=i/n*6.283,x=Math.cos(t)*rx,y=Math.sin(t)*ry;d+=(i?'L':'M')+f(c[0]+x*ct-y*st)+','+f(-c[1]+x*st+y*ct)}return d+'Z'};
/* outlines of the lot (width along the blade, 0 base → 1 tip) */
const L83_STRAP=prof([[0,.34],[.1,.86],[.28,1],[.72,.88],[.9,.46],[1,0]]),L83_OVL=prof([[0,.24],[.1,.62],[.3,.95],[.45,1],[.7,.8],[.9,.4],[1,0]]),
  L83_NDL=prof([[0,.42],[.07,.9],[.2,1],[.8,.94],[.93,.55],[1,0]]),L83_RND=prof([[0,.3],[.12,.74],[.42,1],[.72,.9],[.9,.56],[1,0]]),L83_TRI=prof([[0,.2],[.15,.82],[.36,1],[.56,.8],[.84,.34],[1,0]]);
/* ---------- the foliage of a grown branch. S: u0 (bare foot of the main axis), sp (step along an axis), lv (younger orders, l56Kids), nd(q,u,pl,em,a) the organs at a step,
   yz (share of each axis tip in young growth at the bud stage), tw twig colour, sw stroke width, lim (nothing below the vessel's mouth) ---------- */
function l83Fol(res,parts,Fr,cw,S,op){const det=DET>=1.5&&!LOD,P=pal7(cw.c),PB=pal7(cw.u||mix(cw.c,'#d0d6cc',.32)),PY=pal7(cw.y||S.young||mix(cw.c,'#b8d070',.5)),items=[],sw=Math.max(L83_MW,S.sw||1.15);
  const ok=Q=>S.lim==null||Q.every(p=>p[1]>=S.lim),tw=S.tw||'#6a5a40',yz=(S.yz0??.05)+(S.yz??.3)*Math.max(0,1-op);
  /* the tone of a face from its normal n: the back (pale), else dark, mid or lit; young growth in its own colour */
  const tone=(n,y)=>{const fr=n[2]>=0,I=lightI(fr?n:V3.sc(n,-1))+R(-.05,.05);if(!fr&&!S.both)return I>.62?'b1':'b0';return(y?'y':'f')+(I<.5?0:I<.7?1:2)};
  const em={Fr,det,op,
    /* a flat blade from b along d, its upper face toward N: len, wid, o {wp outline, ar arch, dr droop, fo fold, mr midrib, vn veins (count), gl gloss, pet (the axis point: a stalk to the blade), y young, bent} */
    blade:(b,d,N,len,wid,o={})=>{d=V3.nz(d);let W=V3.cr(N,d);if(V3l(W)<1e-4)W=fgCross(d)[0];W=V3.nz(W);const N2=V3.cr(d,W),wp=o.wp||L83_STRAP,ar=o.ar??.05,dr=o.dr??.08,fo=o.fo??.12,bt=o.bent||0,nv=det?9:6,
        C=[],Wd=[];for(let i=0;i<=nv;i++){const v=i/nv;C.push(V3.add(V3.add(V3.add(b,V3.sc(d,len*v)),V3.sc(N2,len*ar*Math.sin(Math.PI*v))),V3.add(V3.sc(W,bt*len*v*v),[0,-len*dr*v*v,0])));Wd.push(wid*.5*wp(v))}
      const ed=s=>C.map((c,i)=>V3.add(V3.add(c,V3.sc(W,s*Wd[i])),V3.sc(N2,fo*Wd[i]))),EA=ed(1),EB=ed(-1),Q=[...EA,...EB,...(o.pet?[o.pet]:[])];if(!ok(Q))return 0;
      let z=0;for(const c of C)z+=c[2];z/=C.length;
      const nA=V3.nz(V3s(N2,V3.sc(W,fo))),nB=V3.nz(V3.add(N2,V3.sc(W,fo))),hs=[[EA,nA],[EB,nB]].map(([E2,n])=>({d:l83Pd(C.concat(E2.slice().reverse()))+'Z',k:tone(n,o.y),z:E2.reduce((a,p)=>a+p[2],0)/E2.length,fr:n[2]>=0}));
      hs.sort((x,y)=>x.z-y.z);const fr=N2[2]>=0,mid=l83Pd(C.slice(1,nv));
      items.push({z,fn:B=>{if(o.pet)l30Add(B,'pt',l83Pd([o.pet,C[0]]));for(const h of hs)l30Add(B,'F'+h.k,h.d);
        if(det&&o.vn&&fr){for(let j=0;j<o.vn;j++){const s=(j+.5)/o.vn*2-1;l30Add(B,'vn',l83Pd(C.map((c,i)=>V3.add(V3.add(c,V3.sc(W,s*Wd[i]*.82)),V3.sc(N2,fo*Math.abs(s)*Wd[i]*.82)))))}}
        if(o.mr&&!LOD)l30Add(B,fr?(o.y?'my':'mr'):'mb',mid);
        if(det&&o.gl&&fr){const sg=lightI(nA)>=lightI(nB)?1:-1,A2=[],B2=[];for(let i=1;i<nv;i++){const c=C[i];const k=Math.sin(Math.PI*i/nv);A2.push(V3.add(c,V3.sc(W,sg*Wd[i]*.22)));B2.push(V3.add(c,V3.sc(W,sg*Wd[i]*(.22+.3*k))))}l30Add(B,'gl',l83Pd(A2.concat(B2.reverse()))+'Z')}}});return 1},
    /* a stroke (a needle seen as a line, a lobe), toned by n */
    str:(Q,n,y,hi)=>{if(!ok(Q))return 0;const k='S'+tone(n,y);items.push({z:Q.reduce((a,p)=>a+p[2],0)/Q.length,fn:B=>{const d=Q.length===3?l83Qd(...Q):l83Pd(Q);l30Add(B,k,d);if(hi&&k[1]!=='b')l30Add(B,'sk',hi)}});return 1},
    /* a twig (a younger axis), from its parent */
    tw:(Q,w)=>{if(!ok(Q.slice(1)))return;items.push({z:Q.reduce((a,p)=>a+p[2],0)/Q.length-.3,fn:B=>l30Add(B,w>1.7?'t0':'t1',l83Pd(Q))})},
    raw:(z,fn)=>items.push({z,fn}),ok,tone};
  /* the younger orders of every axis, kept with their parents */
  const fam=[];for(const ch of res.chains){if(ch.pts.length<2)continue;const top={pts:ch.pts,ws:ch.ws,ord:ch.ord?1:0},grp=[top];let gen=[top];
    for(const L of S.lv||[]){const nx=[];for(const a of gen)if(a.ord>=(L.from??0))nx.push(...l56Kids(a,Fr,L));grp.push(...nx);gen=nx}fam.push(...grp)}
  for(const a of fam){const ax=l56Ax(a.pts,a.ws),a0=a.ord?0:ax.L*S.u0;if(ax.L-a0<3)continue;if(a.sub)em.tw(a.pts,a.ws[0]);
    const n=Math.max(2,Math.round((ax.L-a0)/S.sp));for(let i=0;i<n;i++){const l=Math.max(0,Math.min(ax.L,a0+(ax.L-a0)*(i+.5+R(-.2,.2))/n)),q=ax.at(l),u=(l-a0)/(ax.L-a0);
      S.nd(q,u,l56Pl(q.T,Fr),em,a,u>1-yz)}
    if(S.tip)S.tip(ax.at(ax.L),a,em)}
  const det2=DET>=1.5,ik=c=>shd(c,-.38),fl=(c,o={})=>Object.assign({fill:c,stroke:ik(c),'stroke-width':det2?.28:.34,'stroke-opacity':.55,'stroke-linejoin':'round'},o),
    st=(c,w)=>({fill:'none',stroke:c,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'}),
    T={f0:toneAt(P,.3),f1:toneAt(P,.55),f2:toneAt(P,.78),b0:toneAt(PB,.45),b1:toneAt(PB,.7),y0:toneAt(PY,.38),y1:toneAt(PY,.6),y2:toneAt(PY,.8)};
  const keys=[['t0',st(tw,1.7)],['t1',st(mix(tw,toneAt(P,.4),.3),1.2)],['pt',st(S.pc||mix(tw,toneAt(P,.45),.5),Math.max(L83_MW,S.pw||1.2))],
    ...['b0','b1'].map(k=>['F'+k,fl(T[k])]),...['b0','b1'].map(k=>['S'+k,st(T[k],sw)]),['mb',st(toneAt(PB,.86),L83_MW)],
    ...['f0','f1','f2','y0','y1','y2'].map(k=>['F'+k,fl(T[k])]),...['f0','f1','f2','y0','y1','y2'].map(k=>['S'+k,st(T[k],sw)]),
    ['vn',{fill:'none',stroke:P.l1,'stroke-width':.36,'stroke-opacity':.3,'stroke-linecap':'round'}],['mr',st(cw.mr||toneAt(P,.7),L83_MW)],['my',st(toneAt(PY,.9),L83_MW)],
    ['gl',{fill:'#ffffff',opacity:.11}],['sk',{fill:'none',stroke:cw.sk||mix(toneAt(P,.95),'#ffffff',.5),'stroke-width':.55,'stroke-opacity':.75,'stroke-linecap':'round'}],...(S.keys?S.keys(cw,op):[])];
  l30Batch(parts,items,keys,det?16:9)}
/* the whole branch: its colourway, its size (the recipe's unit), its stage, the L-system and the lot's foliage */
function l83Plant(g,t,o,list,id,cm0,SP){const cw=fgCw(list,o),op=Math.max(.05,Math.min(1,o.op??1)),ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.62+.38*ks,k=G(g);
  return g35Run(o,id,()=>{const Lt=o.spine?blen(o.spine):SP.L*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(SP.arch[0],SP.arch[1])),lim=g35Lim(o),bk=cw.bark||SP.bark,cols=l56St(bk);
    const r=fgGrow(k,A,{li:SP.li*UPC*kl,liT:.3,w0:SP.w0*kl,w1:1.3,cols,uL:2,lp:0,phy:SP.phy||'spiral',seg:10,piece:16,wig:SP.wig??.025,tipLv:0,lift:SP.lift,side:SP.side,
      post:(res,parts,Fr)=>l83Fol(res,parts,Fr,cw,SP.fol(cw,op,kl,lim,o),op)});
    open(k,t,1000,0,.4);return r})}
/* a direction leaving the axis at th from T toward r */
const l83Dir=(T,r,th)=>V3.nz(V3.add(V3.sc(T,Math.cos(th)),V3.sc(r,Math.sin(th))));
/* the face a leaf turns to: its own normal (n0) pulled toward the front of the spray (k), kept across its blade d */
const l83Face=(d,n0,F,k)=>{let n=V3.add(V3.sc(n0,1-k),V3.sc(F,k));n=V3s(n,V3.sc(d,V3.dot(n,d)));return V3l(n)<1e-3?fgCross(d)[0]:V3.nz(n)};
/* the size of an organ along its shoot: smaller at its foot and toward its tip */
const l83Sz=(u,a=.12,b=.82,m=.55)=>u<a?.65+.35*u/a:u>b?m+(1-m)*(1-u)/(1-b):1;

/* ---------- podocarpus (Podocarpus macrophyllus, « pin des bouddhistes », kusamaki): stiff, slightly ridged green twigs turning grey-brown; leaves spirally set and crowded toward the
   tips of the shoots, spreading then ascending, linear-lanceolate, 7–12 cm long and 0.7–1 cm wide, narrowed to a short petiole, the tip acute; thick and leathery, dark glossy green above
   with a raised midrib, paler and dull beneath with two faint glaucous bands. New growth in spring a bright light green. The plum-like seeds on a red receptacle are female and rare on cut
   greens. Sold in long sprays (50–80 cm) for oriental and tropical work ---------- */
const CW_L83POD=[{id:'vert-sombre',n:'Vert sombre lustré (P. macrophyllus)',c:'#26442a',u:'#7a9070',bark:'#6a6a44'},{id:'vert-maki',n:'Vert franc (var. maki)',c:'#33582f',u:'#86a07a',bark:'#6e6a46'},
  {id:'pousses-claires',n:'Vert sombre à jeunes pousses claires',c:'#26442a',u:'#7a9070',bark:'#6a6a44',y:'#9cc062',f:1}];
function l83Pod(g,t,o){return l83Plant(g,t,o,CW_L83POD,'l83pod',9,{L:50,arch:[.05,.14],li:3.2,w0:4.6,bark:'#6a6a44',phy:'spiral',lift:.25,wig:.02,
  side:{u0:.28,u1:.78,p:.5,len:.42,ang:38,li:.9,e:-.006,tilt:22},
  fol:(cw,op,kl,lim)=>{const ln=8.5*UPC*kl,yz=cw.f?.45:.3;let az=R(0,6.283);
    return{u0:.3,sp:.62*UPC*kl,lim,tw:shd(cw.bark,-.1),yz,yz0:cw.f?.22:.05,young:cw.y||'#9cc062',pc:mix(cw.bark,cw.c,.5),pw:1.5,
      nd:(q,u,pl,em,a,y)=>{az+=137.5*D;const r=V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az))),th=(u>.8?34:58-14*u+R(-8,8))*D,d=V3.nz(V3.add(l83Dir(q.T,r,th),[0,-.08,0])),
        Ln=ln*l83Sz(u,.1,.78,.4)*R(.86,1.08)*(a.ord?.85:1)*(y&&!cw.f?.85:1),n=l83Face(d,V3.nz(V3s(q.T,V3.sc(d,V3.dot(q.T,d)))),pl.N,.6),b=V3.add(q.p,V3.sc(r,q.w*.3));
        em.blade(V3.add(b,V3.sc(d,Ln*.05)),d,n,Ln,Ln*.105,{wp:L83_STRAP,ar:.04,dr:.05,fo:.16,mr:1,gl:1,pet:q.p,y,bent:R(-.04,.04)})}}}})}

/* ---------- nagi (Nageia nagi, syn. Podocarpus nagi, « arbre de la paix » of the Shinto shrines): green twigs, the leaves opposite or nearly so, decussate on the leader and turned into one
   plane on the side shoots; ovate-lanceolate to elliptic, 4–9 cm by 1.5–3 cm, on a very short twisted petiole; thick and leathery, glossy dark green above, paler beneath, WITHOUT a midrib —
   many fine parallel veins run from the base to the tip, like a bamboo leaf; the leaf hard to tear (hence its symbol of a tie that will not break). Young pairs light green. Sold in sprays ---------- */
const CW_L83NAG=[{id:'vert-sombre',n:'Vert sombre brillant (N. nagi)',c:'#22401f',u:'#6c8a62',bark:'#4f7a35'},{id:'vert-clair',n:'Vert clair (jeunes rameaux)',c:'#3c6a30',u:'#88a87a',bark:'#5a8a3c',y:'#8fb35a'},
  {id:'panache',n:'Panaché crème (N. nagi Variegata)',c:'#2c4c26',u:'#7a9670',bark:'#5a7a3c',var:'#e2dcae',f:1}];
function l83Nag(g,t,o){return l83Plant(g,t,o,CW_L83NAG,'l83nag',9,{L:48,arch:[.05,.14],li:4.6,w0:4.2,bark:'#4f7a35',phy:'opp',lift:.25,wig:.02,
  side:{u0:.26,u1:.8,p:.55,len:.38,ang:44,li:.9,e:-.008,tilt:10,pair:1},
  fol:(cw,op,kl,lim)=>{const ln=6.8*UPC*kl;let k0=0;
    return{u0:.24,sp:2.3*UPC*kl,lim,tw:shd(cw.bark,-.15),yz:.3,young:cw.y||'#8fb35a',pc:mix(cw.bark,cw.c,.4),pw:1.4,
      keys:cw=>cw.var?[['vr',{fill:cw.var,opacity:.85}]]:[],
      nd:(q,u,pl,em,a,y)=>{k0++;const dec=!a.ord&&k0%2,sd=dec?pl.N:pl.S,th=(u>.85?30:52+R(-7,7))*D,Ln=ln*l83Sz(u,.1,.8,.42)*R(.88,1.08)*(a.ord?.9:1);
        for(const s of[-1,1]){const r=V3.nz(V3.add(V3.sc(sd,s),V3.sc(dec?pl.S:pl.N,R(-.1,.18)))),d=V3.nz(V3.add(l83Dir(q.T,r,th),[0,-.06,0])),n=l83Face(d,dec?V3.sc(pl.S,1):pl.N,pl.N,.7),
            b=V3.add(V3.add(q.p,V3.sc(r,q.w*.3)),V3.sc(d,Ln*.05));
          if(em.blade(b,d,n,Ln,Ln*.34,{wp:L83_OVL,ar:.06,dr:.06,fo:.07,vn:9,gl:1.3,pet:q.p,y,bent:R(-.06,.06)})&&cw.var&&!y&&!LOD){/* the variegation: a cream margin streak along one side */
            const W=V3.nz(V3.cr(n,d)),sg=rnd()<.5?1:-1,A2=[],B2=[];for(let i=1;i<9;i++){const v=i/9,c=V3.add(V3.add(b,V3.sc(d,Ln*v)),[0,-Ln*.06*v*v,0]),w=Ln*.17*L83_OVL(v);A2.push(V3.add(c,V3.sc(W,sg*w*.98)));B2.push(V3.add(c,V3.sc(W,sg*w*.55)))}
            if(n[2]>=0)em.raw(b[2]+d[2]*Ln*.5+.05,B=>l30Add(B,'vr',l83Pd(A2.concat(B2.reverse()))+'Z'))}}}}}})}

/* ---------- yew (Taxus baccata, « if commun »; 'Fastigiata Aurea' golden): green twigs turning red-brown; needles spirally set but twisted at their base into two flat ranks on the side shoots
   (radial on the leader), linear, flat, 1.5–3.5 cm by 2–3 mm, abruptly pointed, their bases running down the twig; dark glossy green above with a raised midrib, beneath two pale yellow-green
   bands. Female sprigs carry, in late summer, single seeds each half sunk in a fleshy cup, the aril (8–12 mm), green then scarlet and translucent, open at the end on the dark olive seed;
   each on a very short stalk under the shoot ---------- */
const CW_L83TAX=[{id:'vert-sombre',n:'Vert sombre (T. baccata)',c:'#1f3a24',u:'#8ea464',bark:'#7b4a32'},{id:'dore',n:'Doré (T. baccata Aurea)',c:'#7c8a34',u:'#b8b468',bark:'#7b5032',y:'#d4c048'},
  {id:'baies',n:'Vert sombre à arilles rouges (if femelle)',c:'#1f3a24',u:'#8ea464',bark:'#7b4a32',ar:1,f:1}];
function l83TaxAril(q,pl,em,kl,op,lim){const r0=.48*UPC*kl,dn=V3.nz(V3.add(V3.add(V3.sc(pl.N,R(.15,.45)),[0,-.9,0]),V3.add(V3.sc(q.T,.2),V3.sc(pl.S,R(-.4,.4))))),c=V3.add(q.p,V3.sc(dn,q.w*.3+r0*1.25));
  if(!em.ok([c,V3.add(c,V3.sc(dn,r0))]))return;const ph=op<.45?0:op<.8?1:2,lk=['ag','ao','ar'][ph],sp=Math.atan2(-dn[1],dn[0]),ez=Math.abs(dn[2]),rr=r0*(ph?1:.72),
    e=V3.add(c,V3.sc(dn,rr*.92)),sd=V3.add(c,V3.sc(dn,rr*(ph?.55:.85)));
  em.raw(c[2]+2.5,B=>{l30Add(B,'as',l83Pd([q.p,V3.add(q.p,V3.sc(dn,q.w*.3+r0*.3))]));l30Add(B,lk,l83Ell(c,rr*1.05,rr*.92,sp));
    /* the open end of the cup, foreshortened, the seed seen in it (young: the seed stands out of a low green ring) */
    l30Add(B,'ae',l83Ell(e,rr*.55*Math.max(.35,1-ez*.5),rr*.62,sp));l30Add(B,'sd',l83Ell(sd,rr*(ph?.36:.62)*Math.max(.4,1-ez*.4),rr*(ph?.38:.6),sp));
    if(!LOD)l30Add(B,'ah',l83Ell(V3.add(c,[-rr*.35,rr*.35,0]),rr*.28,rr*.18,-.6))})}
function l83Tax(g,t,o){return l83Plant(g,t,o,CW_L83TAX,'l83tax',2.5,{L:45,arch:[.06,.16],li:2.6,w0:4.6,bark:'#7b4a32',phy:'alt2',lift:.2,wig:.02,
  side:{u0:.24,u1:.84,p:.8,len:.5,ang:52,li:.85,e:-.01,tilt:8},
  fol:(cw,op,kl,lim)=>{const ln=2.4*UPC*kl,wd=Math.max(1.4,.26*UPC*kl);let na=0;const nA=cw.ar?(op<.3?4:R(6,10)|0):0;
    return{u0:.24,sp:(DET>=1.5?.27:.31)*UPC*kl,lim,tw:shd(cw.bark,-.1),yz:.25,young:cw.y||'#7aa048',sw:wd,
      lv:[{from:1,u0:.16,sp:3.2*UPC*kl,len:6*UPC*kl,taper:.7,ang:50,flat:1,min:1.8*UPC*kl,w:2.2,w1:1.3,fw:.1,te:.22}],
      keys:()=>[['as',{fill:'none',stroke:'#5a6a2a','stroke-width':1.3,'stroke-linecap':'round'}],['ag',fl83('#7a9a40')],['ao',fl83('#d8602a')],['ar',fl83('#c8262c')],
        ['ae',{fill:'#8a1018',opacity:.75}],['sd',fl83('#3a3a26')],['ah',{fill:'#ffffff',opacity:.35}]],
      nd:(q,u,pl,em,a,y)=>{const tip=l83Sz(u,.06,.84,.42),Ln=ln*tip*R(.85,1.08)*(a.sub?.88:1),rad=!a.ord&&rnd()<.35;
        for(const s of[-1,1]){const th=(76+R(-10,8))*(u>.9?.7:1)*D,r=rad?V3.nz(V3.add(V3.sc(pl.S,s*R(.2,1)),V3.sc(pl.N,R(.3,1)))):V3.nz(V3.add(V3.sc(pl.S,s),V3.sc(pl.N,R(.06,.22)))),
            d=V3.nz(V3.add(l83Dir(q.T,r,th),[0,-.05,0])),n=l83Face(d,pl.N,pl.N,.4),b=V3.add(q.p,V3.sc(r,q.w*.25));
          if(em.det)em.blade(b,d,n,Ln,wd*(Ln/ln*.4+.6),{wp:L83_NDL,ar:.04,dr:.04,fo:.2,y,bent:s*R(0,.08)});else em.str([b,V3.add(V3.add(b,V3.sc(d,Ln*.5)),V3.sc(n,Ln*.03)),V3.add(V3.add(b,V3.sc(d,Ln)),[0,-Ln*.04,0])],n,y)}
        if(nA&&a.ord<=1&&u>.2&&u<.85&&na<nA&&rnd()<(a.ord?.06:.03)){na++;l83TaxAril(q,pl,em,kl,op,lim)}}}}})}
const fl83=c=>({fill:c,stroke:shd(c,-.45),'stroke-width':.35,'stroke-opacity':.6});

/* ---------- acacia foliage (wattles cut for their leaves, Fabaceae): A. baileyana (Cootamundra wattle), its bipinnate leaves 2–5 cm with 2–4 pairs of pinnae, each of 8–20 pairs of tiny
   crowded leaflets, glaucous grey-blue, on pruinose twigs; in 'Purpurea' the young shoots and leaves are deep purple. A. podalyriifolia 'Pearl' (Queensland silver wattle): phyllodes
   (flattened leaf stalks) broadly ovate to round, 2–4 cm, silvery grey and velvety, a small gland on the upper margin, set alternate and close along white-felted twigs.
   A. cultriformis (knife-leaf wattle): triangular grey-green phyllodes pressed upward along the twig. Sold in 50–70 cm sprays ---------- */
const CW_L83ACA=[{id:'gris-bleu',n:'Gris-bleu (A. baileyana)',c:'#8fa2a6',u:'#b4c2c6',bark:'#7a8a80',fm:'bip'},
  {id:'pourpre',n:'Gris-bleu aux pousses pourpres (A. baileyana Purpurea)',c:'#8a98a2',u:'#b2bcc4',bark:'#7a6a7a',fm:'bip',y:'#6a3a5a',yz:.45},
  {id:'argent',n:'Argenté (A. podalyriifolia Pearl)',c:'#a2ad9c',u:'#c4ccc0',bark:'#a8ac9e',fm:'rnd',sk:'#eef0e8'},
  {id:'couteau',n:'Gris-vert (A. cultriformis)',c:'#7d9070',u:'#a4b29a',bark:'#7a8060',fm:'tri'}];
/* a bipinnate leaf: its rachis from the twig, its pairs of pinnae in the leaf's plane, each a fringed strip of leaflets */
function l83Bip(q,d,n,len,np,em,y,kl){const W=V3.nz(V3.cr(n,d)),dn=[0,-1,0],rc=t=>V3.add(V3.add(q.p,V3.sc(d,len*t)),V3.sc(dn,len*.12*t*t)),R0=[];for(let i=0;i<=5;i++)R0.push(rc(i/5));
  if(!em.ok(R0))return;const lw=Math.max(.75,.09*UPC*kl);let z=0;const pols=[];
  for(let j=0;j<np;j++){const t=.3+.66*(j+.5)/np,b=rc(t),hl=len*.42*(1-.3*Math.abs(t-.62)*2)*R(.9,1.08);
    for(const s of[-1,1]){const dd=V3.nz(V3.add(V3.add(V3.sc(W,s),V3.sc(d,.55)),V3.sc(dn,.12))),ac=V3.nz(V3.cr(n,dd)),nt=em.det?10:7,L1=[],L2=[];
      for(let i=0;i<=nt;i++){const u=i/nt,c=V3.add(b,V3.sc(dd,hl*u)),w=lw*(1-.5*u)*(i%2?1.45:.55);L1.push(V3.add(c,V3.sc(ac,w)));L2.push(V3.add(c,V3.sc(ac,-w)))}
      if(!em.ok(L1.concat(L2)))continue;pols.push({d:l83Pd(L1.concat(L2.reverse()))+'Z',n:V3.nz(V3.add(n,V3.sc(dd,-.2*s)))});z+=b[2]}}
  const ks=pols.map(p=>{const fr=p.n[2]>=0,I=lightI(fr?p.n:V3.sc(p.n,-1))+R(-.05,.05);return fr?(y?'y':'f')+(I<.5?0:I<.7?1:2):I>.62?'b1':'b0'});
  em.raw(pols.length?z/(pols.length/2):q.p[2],B=>{l30Add(B,'pt',l83Pd(R0));pols.forEach((p,i)=>l30Add(B,'F'+ks[i],p.d))})}
function l83Aca(g,t,o){return l83Plant(g,t,o,CW_L83ACA,'l83aca',2.5,{L:52,arch:[.06,.16],li:3,w0:4,bark:'#7a8a80',phy:'spiral',lift:.25,wig:.03,
  side:{u0:.22,u1:.82,p:.6,len:.42,ang:42,li:.85,e:-.012,tilt:20},
  fol:(cw,op,kl,lim)=>{const fm=cw.fm;let az=R(0,6.283);
    return{u0:.22,sp:(fm==='bip'?.85:fm==='rnd'?1.05:.8)*UPC*kl,lim,tw:shd(cw.bark,-.08),yz:cw.yz??.28,yz0:cw.yz?.18:.05,young:cw.y||(fm==='rnd'?'#d4dcc8':'#a8bca0'),pc:mix(cw.bark,cw.c,.4),pw:1.25,both:fm!=='bip'?1:0,
      lv:fm==='bip'?[{from:1,u0:.2,sp:4*UPC*kl,len:6*UPC*kl,taper:.6,ang:46,flat:0,min:2*UPC*kl,w:2,w1:1.3,fw:.1,te:.25}]:[],
      nd:(q,u,pl,em,a,y)=>{az+=137.5*D;const r=V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az))),sz=l83Sz(u,.1,.8,.45)*R(.86,1.1)*(a.sub?.85:1);
        if(fm==='bip'){const th=(u>.85?35:55+R(-8,8))*D,d=V3.nz(V3.add(l83Dir(q.T,r,th),[0,-.1,0])),n=l83Face(d,pl.N,pl.N,.6);l83Bip(q,d,n,3.8*UPC*kl*sz,(y?2:R(2,4.99)|0),em,y,kl);return}
        const tri=fm==='tri',th=(tri?24+R(-6,6):40+R(-8,8))*D,d=l83Dir(q.T,r,th),n=l83Face(d,tri?r:pl.N,pl.N,tri?.3:.55),Ln=(tri?1.9:2.8)*UPC*kl*sz,b=V3.add(q.p,V3.sc(r,q.w*.3));
        em.blade(V3.add(b,V3.sc(d,Ln*.06)),d,n,Ln,Ln*(tri?.7:.82),{wp:tri?L83_TRI:L83_RND,ar:.05,dr:.03,fo:.05,mr:em.det?1:0,pet:q.p,y,bent:tri?.18:R(-.05,.05)})}}}})}

/* ---------- woolly bush (Adenanthos sericeus, Proteaceae, south coast of Western Australia): erect grey stems; leaves crowded all round them, 1.5–3 cm, each divided almost to its base
   into 3–7 needle-fine linear lobes (≤1 mm), the whole covered with long silky hairs, so that a shoot is a soft silvery-grey fur, greener toward the base where the hairs wear off;
   the youngest leaves at the tips almost white. Small solitary red tubular flowers hide among the leaves in winter–spring (rare on cut stems). Sold for its texture, 40–60 cm ---------- */
const CW_L83ADE=[{id:'argent',n:'Gris argenté soyeux',c:'#a2ad9c',u:'#8a9686',bark:'#8a9488',y:'#dfe4da'},{id:'vert-gris',n:'Vert-gris (A. sericeus)',c:'#8d9c86',u:'#7a8a74',bark:'#7e8a7a',y:'#cdd8c4'}];
function l83Ade(g,t,o){return l83Plant(g,t,o,CW_L83ADE,'l83ade',4,{L:48,arch:[.05,.14],li:2.6,w0:4.4,bark:'#8a9488',phy:'spiral',lift:.25,wig:.03,
  side:{u0:.22,u1:.84,p:.75,len:.45,ang:40,li:.85,e:-.008,tilt:30},
  fol:(cw,op,kl,lim)=>{const ln=2.4*UPC*kl;let az=R(0,6.283);
    return{u0:.24,sp:(DET>=1.5?.26:.32)*UPC*kl,lim,tw:shd(cw.bark,-.1),yz:.14,young:cw.y,both:1,sw:L83_MW,
      lv:[{from:1,u0:.25,sp:3*UPC*kl,len:5*UPC*kl,taper:.6,ang:38,flat:0,min:1.6*UPC*kl,w:1.9,w1:1.3,fw:.12,te:.3}],
      nd:(q,u,pl,em,a,y)=>{const nl=a.sub||!em.det?2:3;for(let j=0;j<nl;j++){az+=137.5*D;const r=V3.add(V3.sc(pl.N,Math.cos(az)),V3.sc(pl.S,Math.sin(az))),th=(u>.86?24:48+R(-10,10))*D,
          d=V3.nz(V3.add(l83Dir(q.T,r,th),[0,-.04,0])),Ln=ln*l83Sz(u,.08,.8,.5)*R(.8,1.12),b=V3.add(q.p,V3.sc(r,q.w*.25)),fk=V3.add(b,V3.sc(d,Ln*.3)),[X]=fgCross(d),side=V3.nz(V3.add(V3.sc(X,.6),V3.sc(V3.cr(d,X),.4))),
          /* the hairy lobes face the light by where they stand round the stem */
          nn=V3.nz(V3.add(r,[0,.35,.25])),nb=3+(rnd()*(em.det?3:2)|0);
        let dd=l83Pd([b,fk]),hh='';const Q=[b,fk];
        for(let i=0;i<nb;i++){const s=(i/(nb-1)-.5)*2,dl=V3.nz(V3.add(V3.add(d,V3.sc(side,s*.55)),V3.sc(r,R(-.12,.12)))),Ll=Ln*.7*(1-.25*Math.abs(s))*R(.85,1.1),
            e=V3.add(V3.add(fk,V3.sc(dl,Ll)),V3.sc(q.T,Ll*.18)),m=V3.add(fk,V3.sc(dl,Ll*.5));Q.push(e);dd+=l83Qd(fk,m,e);
          if(nn[2]>.2&&rnd()<.6)hh+=l83Qd(m,V3.add(m,V3.sc(dl,Ll*.25)),V3.add(m,V3.sc(dl,Ll*.48)))}
        if(!em.ok(Q))continue;const k='S'+em.tone(nn,y);em.raw((b[2]+fk[2]+Q[Q.length-1][2])/3,B=>{l30Add(B,k,dd);if(hh)l30Add(B,'sk',hh)})}}}}})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (podocarpus and nagi: the leaf length; yew and acacia: the leaf or needle; woolly bush: the leaf), and how the
   composer treats them: cut foliage along its spine ---------- */
Object.assign(GH,{'podocarpus-macrophyllus':l83Pod,'nageia-nagi':l83Nag,'taxus-baccata-if':l83Tax,'acacia-feuillage':l83Aca,'adenanthos-sericeus-woolly-bush':l83Ade});
Object.assign(CWS,{'podocarpus-macrophyllus':CW_L83POD,'nageia-nagi':CW_L83NAG,'taxus-baccata-if':CW_L83TAX,'acacia-feuillage':CW_L83ACA,'adenanthos-sericeus-woolly-bush':CW_L83ADE});
Object.assign(SZG,{'podocarpus-macrophyllus':[7,9,9,11],'nageia-nagi':[6,8,9,10],'taxus-baccata-if':[2,2.5,2.5,3],'acacia-feuillage':[2,2.5,2.5,3.2],'adenanthos-sericeus-woolly-bush':[3,4,4,5]});
const L83_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'podocarpus-macrophyllus':L83_I(50,{fx:30}),'nageia-nagi':L83_I(48,{fx:28}),'taxus-baccata-if':L83_I(45,{fx:24}),'acacia-feuillage':L83_I(52,{fx:26}),'adenanthos-sericeus-woolly-bush':L83_I(48,{fx:24})});
