/* ================= Serre, lot 69 — myrtacées : eucalyptus polyanthemos, eucalyptus kruseana, melaleuca, leptospermum (arbre à thé), lophomyrtus ================= */
/* chaque tige coupée est poussée par le L-système (le moteur des feuillages du lot 15, f15BladeS / f15Blade / f15Chains) : axe principal sur l'épine du Composer ou dressé sur une planche,
   nœuds alternes ou opposés, rameaux, feuilles en nappes 3D ; fleurs axillaires (leptospermum), épis en goupillon (melaleuca) ; les feuilles minuscules et les fleurs nombreuses
   sont dessinées en lots (l30Batch du lot 30) ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
/* ---------- the lot's stem: grown node by node by the rules (as f15Sprig, with flowers and spikes at the nodes)
     A(i)  → F…F N(i) A(i+1)            (the main axis: along the spine in a bouquet, standing with its tropism on a sheet; then the apex)
     N(i)  → [ /φᵢ &α Lv ]×(1|2)  [ /φ' &β Fl ] (an axillary flower, by chance)  [ /φ'' &γ B(n) ] (a side shoot, at chosen nodes)   — or Sp (a ring of flowers round the axis, in a spike zone)
     B(n)  → F M(n) B(n−1)       M(n) → leaves, a flower or a spike ring as N        B(0) → F Ap
   S: id, cm0 (the recipe's leaf size: on a sheet o.cm ≤ 15 scales the leaves), len, leafy, inter, opp, div, ang, w0, w1 (≥ 1.15: every axis stays a visible, connected line), cols, e, wig, tip, br,
      fl(q, onBranch) → chance of an axillary flower, spk(q, qb, onBranch) → the node is a spike ring, leaf(og, lim, X), flower(og, X), spike(og, X), apex(og, X) → parts (X.items: batched items) ---------- */
function l69Sprig(g,t,o,S){const k=G(g),parts=[],items=[],sp=o.spine,fr=sp?Math.max(0,Math.min(.92,o.from||0)):0,op=Math.max(.05,Math.min(1,o.op??1)),sv=seed;
  const rs=!sp&&!!o.ax&&o.roll===0;if(rs)seed=f15Hash(S.id+'|'+(o.cm||0)+'|'+Math.round(op*20));
  const ks=sp||!(o.cm>0&&o.cm<=15)?1:Math.max(.55,Math.min(1.6,o.cm/S.cm0));
  let P0=[0,0,0],H0,U0,Lt,pts=null,cum=null,af=0;
  if(sp){af=fr>0?blen(bseg(sp,0,fr)):0;const N=48;pts=[];for(let i=0;i<=N;i++){const q=bz(sp,fr+(1-fr)*i/N);pts.push([q[0],-q[1],0])}cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));Lt=cum[N];P0=pts[0];H0=V3.nz(V3s(pts[1],pts[0]));U0=[0,0,1]}
  else{const B=frameOf(o,0),U=toV(B,[0,0,1]);Lt=(o.cm>15?o.cm:S.len)*UPC*(.62+.38*op);H0=rotA(toV(B,[0,1,0]),U,R(-.07,.07));U0=U}
  const at=a=>{let i=1;while(i<cum.length-1&&cum[i]<a)i++;const t2=Math.max(0,Math.min(1,(a-cum[i-1])/((cum[i]-cum[i-1])||1)));return V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t2))};
  const a0=sp?(fr>0?Lt*.04:Math.max(Lt*(1-S.leafy),Lt*.17)):Lt*(1-S.leafy),nodes=[];
  for(let a=a0;a<Lt-UPC*(S.tip??1);){nodes.push(a);const q=(a-a0)/Math.max(1,Lt-a0);a+=UPC*ks*(S.inter[0]+(S.inter[1]-S.inter[0])*q)*R(.86,1.14)*(.75+.25*op)}
  const nN=nodes.length,qOf=i=>nN>1?i/(nN-1):1,wm=Math.max(1.15,S.w1),wAt=a=>wm+(S.w0-wm)*Math.pow(Math.max(0,1-(af+a)/(af+Lt)),.85),w0=wAt(0);
  const chord=(a,b)=>{if(!sp)return[['F',{l:Math.max(.5,b-a),w1:wAt(b),e:S.e??0}]];const out=[];let x=a;while(x<b-1e-6){const y=Math.min(b,x+8),p=at(x),q=at(y),d=V3s(q,p),l=V3l(d);if(l>1e-6)out.push(['F',{l,aim:V3.sc(d,1/l),k:1,wig:0,w1:wAt(y)}]);x=y}return out};
  const br=S.br,brAt=new Map();if(br){let c=0;for(let i=0;i<nN&&c<br.max;i++){const q=qOf(i);if(q>=br.zone[0]&&q<=br.zone[1]&&rnd()<br.p){brAt.set(i,c++);i+=br.gapC?Math.max(1,Math.round(br.gapC/S.inter[0]/ks)):br.gap||1}}}
  const ph0=R(0,360),angAt=q=>S.ang[0]+(S.ang[1]-S.ang[0])*q,nl=S.opp?2:1,div=S.div||(S.opp?90:137.5);
  const leaves=(i,q,s,ph,ang)=>{const out=[];for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:ph+j*(360/nl)+R(-9,9)}],['&',{a:ang+R(-7,7)}],['Lv',{i,j,q,s}],[']',{}]);return out};
  /* what grows at a node: a spike ring, or its leaves with perhaps a flower in an axil */
  const node=(i,q,qb,s,ph,ang,onB)=>{if(S.spk&&S.spk(q,qb,onB))return[['Sp',{q,qb,onB}]];const out=leaves(i,q,s,ph,ang);
    if(S.fl&&rnd()<S.fl(q,onB))out.push(['[',{}],['/',{a:ph+(nl===2?90:R(40,140))+R(-20,20)}],['&',{a:(S.flAng||46)+R(-10,10)}],['Fl',{q,onB}],[']',{}]);return out};
  const rules={A:p=>{const i=p.i;if(i>=nN)return[...chord(nN?nodes[nN-1]:0,Lt),['Ap',{q:1}]];return[...chord(i?nodes[i-1]:0,nodes[i]),['N',{i}],['A',{i:i+1}]]},
    N:p=>{const i=p.i,q=qOf(i),ph=ph0+(S.alt!=null?(i%2?S.alt:0):i*div)+R(-8,8),out=node(i,q,0,1,ph,angAt(q),0);
      if(brAt.has(i)){const c=brAt.get(i),n=Math.round(R(br.n[0],br.n[1])*(1-.35*q)),li=br.li*UPC*ks,wb=Math.max(wm,wAt(nodes[i])*(br.wk||.55));
        if(n>0)out.push(['[',{w:wb}],['/',{a:ph+(S.opp?90:70)+(c%2?180:0)+R(-25,25)}],['&',{a:br.ang+R(-8,8)}],['B',{n,n0:n,li,q,w:wb,c}],[']',{}])}
      return out},
    B:p=>{if(p.n<=0)return[['F',{l:p.li*.55,w1:wm,e:br.eb}],['Ap',{q:1,b:1}]];const qb=1-p.n/p.n0;
      return[['F',{l:p.li*R(.85,1.15)*(1-.3*qb),w1:Math.max(wm,p.w*(1-.6*qb)),e:br.eb}],['M',{n:p.n,qb,q:p.q,c:p.c}],['B',Object.assign({},p,{n:p.n-1})]]},
    M:p=>node(-1,Math.min(1,p.q+.5*p.qb),p.qb,br.ls||.85,(S.alt!=null?p.c*90+(p.n%2?S.alt:0):R(0,360)+p.n*div),angAt(Math.min(1,p.q+.4+.4*p.qb)),1)};
  const mods=lsDerive([['A',{i:0}]],rules,nN+(br?br.n[1]:0)+4),res=lsTurtle(mods,{p:P0,H:H0,U:U0,w:w0,T:[0,1,0],e:0,wig:S.wig||0,seg:7});
  for(const ch of res.chains)ch.c=S.cols;
  const lim=sp&&fr===0?-3:null,X={items,ks,op,lim};
  for(const og of res.organs){const fn=og.t==='Lv'?S.leaf:og.t==='Fl'?S.flower:og.t==='Sp'?S.spike:og.t==='Ap'?S.apex:null,pp=fn?fn(og,X):null;if(pp)parts.push(...pp)}
  f15Chains(res.chains,S.cols,parts,sp?16:8);if(items.length)S.batch(parts,items);drawParts(k,parts);if(rs)seed=sv;
  open(k,t,1000,0,.4);const l=Math.hypot(H0[0],H0[1])||1;return{k,bw:S.w0,bw1:fr>0?w0:undefined,bc:S.cols,neck:[P0[0],-P0[1]],nd:[-H0[0]/l,H0[1]/l]}}
/* ---------- shared drawing: a small blade as a batched item (its outline, its tone class by the light on its face), keys of tones, a flower of five round petals ---------- */
/* a tiny leaf (needle, scale) from its surface S: the outline of its two margins; tone class 0–2 on the face, 3–5 on the back; z its middle */
function l69Bit(S,mt=.7,nv=4){const A=[],B=[];let z=0;for(let i=0;i<=nv;i++){const v=i/nv,a=S(-1,v),b=S(1,v);A.push(f(a[0])+','+f(-a[1]));B.push(f(b[0])+','+f(-b[1]));z+=(a[2]+b[2])/2}
  const n=f15Nrm(S,-1,1),fc=n[2]>=0,I=.6+(lightI(fc?n:V3.sc(n,-1))-.6)*mt,c=I<.5?0:I<.72?1:2;return{z:z/(nv+1),d:'M'+A.join('L')+'L'+B.reverse().join('L')+'Z',c:fc?c:c+3}}
/* the six tone keys of a batch of small leaves (face and back, three lights each) */
function l69BitKeys(pre,P,PB,ew){const out=[],lv=[.4,.62,.82];for(let j=0;j<6;j++){const c=toneAt(j<3?P:PB,lv[j%3]);out.push([pre+j,LOD?{fill:c}:{fill:c,stroke:shd(c,-.45),'stroke-width':f(ew),'stroke-opacity':.45,'stroke-linejoin':'round'}])}return out}
/* a flower of five round petals (myrtle family: leptospermum) as batched items: O its centre, ax its face, r its radius, m its age (< .3 a bud; .3–1 opening; > 1.05 the disc darkening),
   dbl: rings of petals within; keys p (face), q (back) by light, c the disc, st its stamens, k the calyx, bs/bb/bl the bud */
function l69Flower(fl,O,ax,r,m,dbl,up=[0,1,0]){if(m<.3){const rb=r*(.36+.3*Math.max(0,m+.2)),c=V3.add(O,V3.sc(ax,rb*.6));
    fl.push({z:c[2],fn:B=>{l30Add(B,'bs',l30O(c[0]+rb*.14,c[1]-rb*.18,rb));l30Add(B,'bb',l30O(c[0],c[1],rb*.9));if(!LOD)l30Add(B,'bl',l30O(c[0]-rb*.3,c[1]+rb*.32,rb*.32))}});return}
  const o2=Math.min(1,(m-.3)/.5),rr=r*(.62+.38*o2),Bf=l30Fr(ax,up,R(0,6.283)),cup=.7-.5*o2,n=ax[2],I=Math.max(.3,Math.min(1,lightI(n<-.15?V3.sc(ax,-1):ax))),li=Math.min(2,Math.floor(I*3));
  fl.push({z:O[2],fn:B=>{const NK=DET>=1.5?12:7,pet=(R0,dc,rp,ph0,np,tag)=>{for(let i=0;i<np;i++){const a=ph0+i*6.283/np,e=[Math.cos(a),Math.sin(a),0],tg=[-e[1],e[0],0],pts=[];
      for(let k2=0;k2<NK;k2++){const th=k2/NK*6.283,dd=dc+rp*Math.cos(th),ss=rp*Math.sin(th)*.95,z=cup*R0*(dd/R0)**2;pts.push(PJ(Bf,O,[e[0]*dd+tg[0]*ss,e[1]*dd+tg[1]*ss,z]))}
      const kk=(n<-.15?'q':'p')+tag+li;l30Add(B,kk,DET>=1.5?smooth(pts.map(p=>[p[0],p[1]])):l30Poly(pts))}};
    const ph=R(0,6.283);if(n<-.15){const cb=spDisc(Bf,O,rr*.3,-rr*.12,7);l30Add(B,'k',l30Poly(cb))}
    pet(rr,rr*.58,rr*.42,ph,5,'');if(dbl){pet(rr*.72,rr*.4,rr*.3,ph+.63,5,'i');pet(rr*.48,rr*.24,rr*.2,ph+.2,6,'i')}
    if(n>-.15&&!dbl){const dc=spDisc(Bf,O,rr*.27,cup*rr*.03,DET>=1.5?12:7);l30Add(B,'c',DET>=1.5?smooth(dc):l30Poly(dc));
      if(DET>=1.5){let d='';for(let i=0;i<14;i++){const a=i/14*6.283,pp=PJ(Bf,O,[Math.cos(a)*rr*.34,Math.sin(a)*rr*.34,cup*rr*.06]);d+=l30O(pp[0],-pp[1],.3)}l30Add(B,'st',d)}}
    else if(n>-.15&&dbl){const dc=spDisc(Bf,O,rr*.1,cup*rr*.05,6);l30Add(B,'c',l30Poly(dc))}}})}
/* the keys of those flowers: petal tones from the colour, the disc, the stamens, the calyx, the bud */
function l69FlKeys(col,ctr,bud,cal){const P=pal7(col),keys=[],tone=q=>toneAt(P,[.56,.72,.86][q]),ink=P.ink,sw=LOD?{}:{stroke:ink,'stroke-width':.3,'stroke-opacity':.35};
  keys.push(['k',{fill:cal,stroke:shd(cal,-.4),'stroke-width':.3}]);
  for(const tag of['','i'])for(let q=0;q<3;q++)keys.push(['q'+tag+q,Object.assign({fill:mix(tone(q),cal,.08)},sw)]);
  for(const tag of['','i'])for(let q=0;q<3;q++)keys.push(['p'+tag+q,Object.assign({fill:tag?shd(tone(q),-.06):tone(q)},sw)]);
  keys.push(['c',{fill:ctr,stroke:shd(ctr,-.4),'stroke-width':.4,'stroke-opacity':.7}],['st',{fill:mix(col,'#f0e0b0',.5)}],['bs',{fill:shd(bud,-.4)}],['bb',{fill:bud}],['bl',{fill:'#ffffff',opacity:.55}]);return keys}
const l69Stem=c=>[shd(c,-.5),shd(c,-.22),c,shd(c,.32)];
/* ---------- eucalyptus polyanthemos (red box, « silver dollar » of the florists' trade): brown to red-brown stems; adult leaves alternate, petiolate (petiole 1–2 cm), broadly ovate
   to orbicular, 4–8 cm, dull grey-green to silvery blue-grey with a light bloom, the midrib pale, fine side veins at an acute angle; the leaves hang on their petioles, turned a little on edge;
   sold fresh in 50–80 cm stems, also preserved and dyed (glycerine) ---------- */
const CW_L69POL=[{id:'gris-vert',n:'Gris-vert argenté',c:'#9aaba2'},{id:'bleu',n:'Bleu argenté',c:'#8ea2a8'},{id:'vert-gris',n:'Vert-gris (feuille adulte)',c:'#8f9c84'},
  {id:'stab-vert',n:'Stabilisé vert',c:'#5f7a52',dy:1},{id:'stab-bleu',n:'Stabilisé bleu',c:'#6a8ea0',dy:1},{id:'stab-bordeaux',n:'Stabilisé bordeaux',c:'#6a2432',dy:1}];
const L69_POLW=prof([[0,.42],[.08,.74],[.26,.97],[.46,1],[.68,.88],[.86,.56],[1,.04]]),L69_POLST=['#3a2219','#68402f','#8e6250','#c09a86'];
function l69PolLeaf(og,X,cw){const p=og.p,q=p.q??0,sz=6*UPC*X.ks*(1-.5*Math.pow(q,1.4))*(p.s||1)*R(.85,1.12),H=og.H,pl=UPC*X.ks*R(1,1.5)*(1-.3*q),
    N=f15Face(og,(26+R(-14,16))*D,rnd()<.5?1:-1),dy=cw.dy,c=dy?mix(cw.c,shd(cw.c,R(-.14,.08)),.6):mix(cw.c,lt(cw.c,.28),Math.max(0,q-.5)*.8+R(-.06,.06)),cb=dy?shd(c,.06):mix(c,'#d8e0dc',.25);
  /* the petiole bows down a little from the node, the blade hangs from its end */
  const Hp=V3.nz(V3.add(H,[0,-.25,0])),P1=V3.add(og.pos,V3.sc(Hp,pl)),Hb=V3.nz(V3.add(Hp,[0,-.3,0])),Nb=V3.nz(V3s(N,V3.sc(Hb,V3.dot(N,Hb))));
  const mk=len=>f15BladeS(P1,Hb,Nb,len,len*.84*.5,L69_POLW,{arch:.04,fold:.06,cup:.12,droop:.12,curl:.04,tw:R(-.25,.25)}),S=f15Fit(mk,sz,X.lim);if(!S)return null;
  const P=pal7(c),PB=pal7(cb),mid=dy?shd(c,.18):mix(c,'#efe2cc',.5),a=og.pos,b=V3.add(P1,V3.sc(Hb,sz*.04)),pw=Math.max(1.15,og.w*.42),pc=dy?shd(c,-.3):mix('#8a5a44',c,.25);
  return[f15Blade(S,P,PB,{mt:dy?.72:.6,mid:DET>=1.5?mid:null,mw:.5,veins:DET>=1.5?EU_VR:null,vc:mid,vo:.26,bloom:dy?0:.4}),
    {z:(a[2]+b[2])/2-.02,cast:false,fn:par=>{const m=V3.add(V3.sc(V3.add(a,b),.5),[0,pl*.08,0]);E('path',{d:`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`,stroke:pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par)}}]}
function l69Pol(g,t,o){const cw=cwPick(CW_L69POL,o),st=cw.dy?f15DyeStem(cw.c):L69_POLST;
  return l69Sprig(g,t,o,{id:'pol',cm0:5,len:62,leafy:.84,inter:[3.4,1.8],opp:false,div:137.5,ang:[62,40],w0:3.4,w1:1.2,cols:st,e:-.012,wig:.014,tip:1,
    br:{zone:[.08,.75],p:.6,max:3,gapC:7,n:[3,6],li:2.8,ang:44,eb:-.02,ls:.8,wk:.55},leaf:(og,X)=>l69PolLeaf(og,X,cw),apex:og=>eucApex(og,cw.dy?st[1]:'#9a7a6a')})}
/* ---------- eucalyptus kruseana (bookleaf mallee): slender, arching red-brown stems dusted white; the leaves stay juvenile — opposite, sessile, orbicular, 1–2 cm, crowded in
   decussate pairs so close that they overlap like the pages of a book, held flat across the stem, silver-grey under a powdery bloom, the young pairs paler ---------- */
const CW_L69KRU=[{id:'argent',n:'Gris argenté poudré',c:'#aab4b2'},{id:'bleu-gris',n:'Bleu-gris',c:'#93a5aa'},{id:'vert-de-gris',n:'Vert-de-gris',c:'#9aa896'}];
const L69_KRUW=prof([[0,.5],[.06,.8],[.22,.97],[.45,1],[.7,.9],[.88,.6],[1,.08]]),L69_KRUST=['#4a3430','#7a5c56','#a48c86','#d4c8c4'];
function l69KruLeaf(og,X,cw){const p=og.p,q=p.q??0,sz=1.7*UPC*X.ks*(1-.38*Math.pow(q,1.6))*(p.s||1)*R(.88,1.1),H=og.H,sg=p.j?-1:1,N=f15Face(og,(76+R(-10,10))*D,sg),
    c=mix(cw.c,lt(cw.c,.32),Math.max(0,q-.55)*.9+R(-.05,.06)),cb=mix(c,'#e2e8e6',.25),P0=V3.add(og.pos,V3.sc(H,-og.w*.25));
  const mk=len=>f15BladeS(P0,H,N,len,len*.98*.5,L69_KRUW,{arch:.03,fold:.04,cup:.16,droop:.06,curl:.06,tw:R(-.2,.2)}),S=f15Fit(mk,sz,X.lim);if(!S)return null;
  /* at bouquet detail the leaves are batched by tone (a stem of a few hundred leaves in a few dozen paths) */
  if(DET<1.5){const b=l69Bit(S,.55,6);X.items.push({z:b.z,fn:B=>l30Add(B,'k'+b.c,b.d)});return null}
  return[f15Blade(S,pal7(c),pal7(cb),{mt:.55,mid:DET>=1.5?mix(c,'#f0ece4',.4):null,mw:.35,mo:.35,bloom:.5,ew:.36})]}
function l69Kru(g,t,o){const cw=cwPick(CW_L69KRU,o);
  return l69Sprig(g,t,o,{id:'kru',cm0:1.8,len:50,leafy:.88,inter:[.85,.55],opp:true,div:90,alt:28,ang:[78,62],w0:2.6,w1:1.15,cols:L69_KRUST,e:-.02,wig:.02,tip:.5,
    br:{zone:[.05,.82],p:.7,max:5,gapC:5,n:[6,12],li:.95,ang:46,eb:-.03,ls:.86,wk:.6},leaf:(og,X)=>l69KruLeaf(og,X,cw),apex:og=>eucApex(og,'#b0a09c'),
    batch:(parts,items)=>l30Batch(parts,items,l69BitKeys('k',pal7(cw.c),pal7(mix(cw.c,'#e2e8e6',.25)),.36),10)})}
/* ---------- melaleuca (honey myrtle: M. bracteata 'Revolution Green', 'Revolution Gold', M. alternifolia, M. armillaris): soft, much-branched pale brown twigs crowded with small
   linear to needle-like leaves (1–2.5 cm, alternate in a dense spiral, pointing forward); some stems in flower: bottlebrush spikes of cream flowers round the axis, the axis growing on
   beyond them with leaves — each flower a tuft of long stamens (in five bundles) round a tiny cup; in bud the spike is a cylinder of round greenish-cream buds ---------- */
const CW_L69MEL=[{id:'fleur',n:'Vert vif, épis crème (en fleur)',c:'#5a8a3a',fl:1},{id:'vert',n:'Vert vif (Revolution Green)',c:'#679a3e'},{id:'dore',n:'Vert doré (Revolution Gold)',c:'#b6b24a'},
  {id:'gris-vert',n:'Gris-vert (alternifolia)',c:'#7c8f78'}];
const L69_MELW=prof([[0,.75],[.15,.95],[.5,1],[.8,.75],[1,.05]]),L69_MELST=['#4a3626','#7a5e44','#a08466','#c8b496'];
function l69MelLeaf(og,X,c){const q=og.p.q??0,len=UPC*X.ks*R(1.5,2.3)*(1-.3*q)*(og.p.s||1),N=f15Face(og,R(20,80)*D,rnd()<.5?1:-1),P0=V3.add(og.pos,V3.sc(og.H,-og.w*.2)),
    S=f15BladeS(P0,og.H,N,len,.74,L69_MELW,{arch:.06,fold:.3,droop:.06,curl:-.04});
  if(X.lim!=null&&f15Low(S)>X.lim)return null;const b=l69Bit(S,.6,3);X.items.push({z:b.z,fn:B=>l30Add(B,'n'+b.c,b.d)});return null}
/* a ring of flowers round the axis at a node of the spike: buds (young), stamen tufts (open); the cream mist at their base joins them to the axis */
function l69MelSpike(og,X,cw){const pos=og.pos,H=og.H,U=og.U,L=og.L,m=X.op*1.25-(og.p.onB?.15:0)+R(-.15,.1),n=6,ph=R(0,6.283),det=DET>=1.5&&!LOD;
  if(m<.4){for(let j=0;j<n;j++){const a=ph+j*6.283/n,r=V3.add(V3.sc(U,Math.cos(a)),V3.sc(L,Math.sin(a))),rb=UPC*R(.14,.18),c=V3.add(pos,V3.sc(r,rb*1.1+og.w*.4));
      X.items.push({z:c[2],fn:B=>{l30Add(B,'ms',l30O(c[0]+rb*.15,c[1]-rb*.2,rb));l30Add(B,'mb',l30O(c[0],c[1],rb*.88))}})}return null}
  const Ls=UPC*R(.6,.8)*Math.min(1,.5+.6*(m-.4));X.items.push({z:pos[2]+1.5,fn:B=>l30Add(B,'mm',l30O(pos[0],pos[1],Ls*.34))});
  for(let j=0;j<n;j++){const a=ph+j*6.283/n,r=V3.add(V3.sc(U,Math.cos(a)),V3.sc(L,Math.sin(a))),bs=V3.add(pos,V3.sc(r,og.w*.4));
    for(let s=0;s<(det?7:4);s++){const sp2=R(-.5,.5),d=V3.nz(V3.add(V3.add(r,V3.sc(H,.25+sp2*.5)),V3.sc(V3.cr(H,r),R(-.45,.45)))),e=V3.add(bs,V3.sc(d,Ls*R(.75,1.05))),fr2=e[2]>pos[2];
      X.items.push({z:pos[2]+(fr2?2:-2),fn:B=>{l30Add(B,fr2?'mf':'mg',`M${f(bs[0])},${f(-bs[1])}L${f(e[0])},${f(-e[1])}`);if(det)l30Add(B,'ma',l30O(e[0],e[1],.26))}})}}return null}
function l69Mel(g,t,o){const cw=cwPick(CW_L69MEL,o),fl=!!cw.fl||(!!o.spine&&rnd()<.3),P=pal7(cw.c),PB=pal7(mix(cw.c,'#c8d0b8',.3)),cr='#f1ead0';
  return l69Sprig(g,t,o,{id:'mel'+(fl?'f':''),cm0:1.2,len:55,leafy:.9,inter:[.3,.22],opp:false,div:137.5,ang:[44,30],w0:2.6,w1:1.15,cols:L69_MELST,e:-.006,wig:.03,tip:.4,
    br:{zone:[.03,.9],p:.75,max:12,gapC:2.4,n:[20,36],li:.32,ang:36,eb:-.012,ls:.92,wk:.55},
    spk:fl?(q,qb,onB)=>onB?qb>.34&&qb<.52:q>.5&&q<.58:null,
    leaf:(og,X)=>l69MelLeaf(og,X,cw.c),spike:(og,X)=>l69MelSpike(og,X,cw),
    batch:(parts,items)=>l30Batch(parts,items,l69BitKeys('n',P,PB,.3).concat([['ms',{fill:'#8a8e5a'}],['mb',{fill:'#dcd8a8'}],['mg',{stroke:shd(cr,-.16),'stroke-width':DET>=1.5?.55:1.15,fill:'none','stroke-linecap':'round'}],
      ['mm',{fill:shd(cr,-.1)}],['mf',{stroke:'#f8f3e2','stroke-width':DET>=1.5?.55:1.15,fill:'none','stroke-linecap':'round'}],['ma',{fill:'#e6d48e'}]]),DET>=1.5?14:7)})}
/* ---------- leptospermum (Leptospermum scoparium, mānuka, tea tree): wiry, much-branched red-brown twigs; tiny leaves (5–12 mm), narrowly lanceolate, stiff, sharply pointed,
   alternate in a spiral, dark green or bronze-purple in the red cultivars; flowers sessile, solitary in the leaf axils all along the shoots, 1–2 cm: five round spreading petals,
   a cup-shaped hypanthium with a dark disc (green-brown, crimson in the coloured forms) ringed with short stamens — or double (rosettes of petals); round buds among them ---------- */
const CW_L69LEP=[{id:'blanc',n:'Blanc simple, cœur vert',c:'#f8f5ef',ctr:'#6e6a2c',bud:'#e8e2cc',lf:'#3c5a32'},{id:'blanc-double',n:'Blanc double (Snow White)',c:'#f6f3ec',dbl:1,ctr:'#c8c49a',bud:'#e6e0c8',lf:'#3c5a32'},
  {id:'rose',n:'Rose, cœur sombre (Martini)',c:'#e6a0b6',ctr:'#5a1a26',bud:'#c8708a',lf:'#3a4a2c'},{id:'rose-pale',n:'Rose pâle double (Apple Blossom)',c:'#f2cdd6',dbl:1,ctr:'#e0a0b0',bud:'#e3a6b4',lf:'#3e5a34'},
  {id:'rouge',n:'Rouge rubis simple (Nanum Ruby)',c:'#b42a48',ctr:'#3a0a16',bud:'#8a1a30',lf:'#40382a'},{id:'rouge-double',n:'Rouge double (Red Damask)',c:'#9e1c34',dbl:1,ctr:'#701020',bud:'#7a1626',lf:'#4a3026'}];
const L69_LEPW=prof([[0,.5],[.15,.9],[.4,1],[.7,.7],[1,0]]),L69_LEPST=['#3a1c14','#62362a','#86584a','#b08a7a'];
function l69LepLeaf(og,X){const q=og.p.q??0,len=UPC*X.ks*R(.7,1.1)*(1-.25*q)*(og.p.s||1),N=f15Face(og,R(30,85)*D,rnd()<.5?1:-1),P0=V3.add(og.pos,V3.sc(og.H,-og.w*.2)),
    S=f15BladeS(P0,og.H,N,len,len*.1+.3,L69_LEPW,{arch:.05,fold:.2,droop:.04,curl:.05});
  if(X.lim!=null&&f15Low(S)>X.lim)return null;const b=l69Bit(S,.65,3);X.items.push({z:b.z,fn:B=>l30Add(B,'n'+b.c,b.d)});return null}
/* a flower in an axil: sessile, its petals over the twig; older lower down the shoot, buds toward its tip */
function l69LepFl(og,X,cw){const q=og.p.q??0,m=X.op*1.25-Math.max(0,q-.55)*1.1+R(-.25,.2),r=UPC*X.ks*R(.72,.95)*(cw.dbl?.9:1),ax=V3.nz(V3.add(V3.add(og.H,V3.sc(og.U,.3)),[0,.35,0])),
    O=V3.add(og.pos,V3.sc(og.H,og.w*.3+(m<.3?0:r*.18)));if(X.lim!=null&&-O[1]+r>X.lim)return null;l69Flower(X.fl,O,ax,r,m,cw.dbl);return null}
function l69Lep(g,t,o){const cw=cwPick(CW_L69LEP,o),P=pal7(cw.lf),PB=pal7(mix(cw.lf,'#9aa080',.3)),fl=[];
  return l69Sprig(g,t,o,{id:'lep',cm0:1,len:50,leafy:.9,inter:[.34,.25],opp:false,div:137.5,ang:[46,34],w0:2.6,w1:1.15,cols:L69_LEPST,e:-.004,wig:.04,tip:.4,
    br:{zone:[.03,.9],p:.75,max:13,gapC:2,n:[14,26],li:.36,ang:42,eb:-.006,ls:.92,wk:.55},fl:(q,onB)=>onB?.62:q>.22?.5:.1,flAng:50,
    leaf:(og,X)=>l69LepLeaf(og,X),flower:(og,X)=>{X.fl=fl;return l69LepFl(og,X,cw)},
    apex:(og,X)=>{X.fl=fl;l69Flower(fl,V3.add(og.pos,V3.sc(og.H,.6)),og.H,UPC*.42,.1,0);return null},
    batch:(parts,items)=>{l30Batch(parts,items,l69BitKeys('n',P,PB,.25),DET>=1.5?10:5);l30Flowers(parts,fl,l69FlKeys(cw.c,cw.ctr,cw.bud,'#6a4a30'),DET>=1.5?10:5)}})}
/* ---------- lophomyrtus (Lophomyrtus × ralphii, New Zealand myrtle: 'Red Dragon', 'Black Stallion', 'Kathryn', 'Magic Dragon', 'Little Star'): red twigs; leaves opposite, on very short
   petioles, broadly ovate to round, 1–2.5 cm, bullate (puckered between the veins) and glossy; deep burgundy or near black, or green variegated with a cream margin flushed pink and red ---------- */
const CW_L69LOP=[{id:'red-dragon',n:'Bordeaux (Red Dragon)',c:'#5c1a28'},{id:'black-stallion',n:'Pourpre noir (Black Stallion)',c:'#2e1219'},{id:'kathryn',n:'Pourpre bronze (Kathryn)',c:'#5a2c24'},
  {id:'magic-dragon',n:'Vert panaché crème et rose (Magic Dragon)',c:'#6e8c48',v:'#efe4c2',pk:'#d8788a'},{id:'little-star',n:'Panaché crème, vert et rose (Little Star)',c:'#7a9454',v:'#f2ead2',pk:'#e6a8b4',sm:1}];
const L69_LOPV=[0,1,2,3].map(k=>{const v=.16+.17*k;return[[0,v],[.3,v+.1],[.55,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]),L69_LOPW=prof([[0,.36],[.08,.72],[.28,.97],[.48,1],[.7,.86],[.88,.52],[1,.04]]),L69_LOPST=['#3a0e12','#6a1e22','#94383a','#c06a68'];
function l69LopLeaf(og,X,cw){const p=og.p,q=p.q??0,sz=(cw.sm?1.5:1.9)*UPC*X.ks*(1-.4*Math.pow(q,1.5))*(p.s||1)*R(.86,1.12),H=og.H,sg=p.j?-1:1,N=f15Face(og,(58+R(-14,14))*D,sg),
    vg=!!cw.v,base=vg?mix(cw.v,cw.pk,Math.max(0,Math.min(.6,.06+q*.4+R(-.08,.12)))):mix(cw.c,lt(cw.c,.12),Math.max(0,q-.6)+R(-.05,.05)),P0=V3.add(og.pos,V3.sc(H,og.w*.2));
  const mk=len=>f15BladeS(P0,H,N,len,len*.82*.5,L69_LOPW,{arch:.07,fold:.12,cup:.1,droop:.08,curl:.08,tw:R(-.2,.2)}),S=f15Fit(mk,sz,X.lim);if(!S)return null;
  const P=pal7(base),PB=pal7(vg?mix(base,'#c8c8a0',.2):shd(base,.12)),det=DET>=1.5&&!LOD,out=[f15Blade(S,P,PB,{mt:vg?.5:.9,mid:det&&!vg?shd(base,.25):null,mw:.4,mo:.4,ew:.36})];
  /* the variegation: an irregular green centre over the cream margin */
  if(vg){const j1=R(.55,.72),wb=R(0,6.283),Si=(u,v)=>S(u*j1*(1+.12*Math.sin(v*9+wb)),.05+.83*v),gc=mix(cw.c,shd(cw.c,R(-.12,.08)),.6);
    out.push(Object.assign(f15Blade(Si,pal7(gc),pal7(mix(gc,'#a8b890',.3)),{mt:.9,flat:1,ew:.2,eo:.25,mid:det?shd(gc,.3):null}),{z:out[0].z+.02}))}
  /* the puckered, glossy blade: deep side veins between the blisters, and one gloss streak on the half toward the light */
  const n=f15Nrm(S,-1,1),dk=h2l(base)[2]<.35,z=out[out.length-1].z+.01,vc=vg?shd(cw.c,-.35):shd(base,-.4);
  out.push({z,cast:false,fn:par=>{if(det){let d='';for(const L of L69_LOPV){d+=smooth(L.map(([u,v])=>{const a=S(u,v);return[a[0],-a[1]]}),false)}E('path',{d,fill:'none',stroke:vc,'stroke-width':.35,'stroke-opacity':.24,'stroke-linecap':'round'},par)}
    if(n[2]>.05&&!LOD){const sd=n[0]<0?-1:1,q2=[[.18,.2],[.42,.4],[.5,.62],[.36,.78]].map(([u,v])=>{const a=S(-sd*u,v);return[a[0],-a[1]]});E('path',{d:smooth(q2,false),fill:'none',stroke:'#ffffff','stroke-width':f(Math.max(.6,sz*.045)),'stroke-opacity':dk?.16:.24,'stroke-linecap':'round'},par)}}});
  return out}
function l69Lop(g,t,o){const cw=cwPick(CW_L69LOP,o);
  return l69Sprig(g,t,o,{id:'lop',cm0:2.2,len:45,leafy:.86,inter:[1.7,1.05],opp:true,div:90,ang:[66,48],w0:2.6,w1:1.15,cols:L69_LOPST,e:-.008,wig:.03,tip:.5,
    br:{zone:[.05,.82],p:.65,max:6,gapC:4,n:[4,8],li:1.2,ang:44,eb:-.02,ls:.86,wk:.6},leaf:(og,X)=>l69LopLeaf(og,X,cw),apex:og=>eucApex(og,'#8a2a30')})}
/* ---------- registries: drawers, colourways, trade grades (the length of the cut stem, cm, as lot 15), and how the composer treats them: stems of foliage along their spine ---------- */
Object.assign(GH,{'eucalyptus-polyanthemos':l69Pol,'eucalyptus-kruseana':l69Kru,'melaleuca-feuillage':l69Mel,'leptospermum-arbre-a-the':l69Lep,'lophomyrtus':l69Lop});
Object.assign(CWS,{'eucalyptus-polyanthemos':CW_L69POL,'eucalyptus-kruseana':CW_L69KRU,'melaleuca-feuillage':CW_L69MEL,'leptospermum-arbre-a-the':CW_L69LEP,'lophomyrtus':CW_L69LOP});
Object.assign(SZG,{'eucalyptus-polyanthemos':[50,60,60,70,80],'eucalyptus-kruseana':[40,50,50,60],'melaleuca-feuillage':[50,60,60,70],'leptospermum-arbre-a-the':[40,50,50,60],'lophomyrtus':[40,50,50,60]});
const L69_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'eucalyptus-polyanthemos':L69_I(60,{fx:22}),'eucalyptus-kruseana':L69_I(50,{fx:16}),'melaleuca-feuillage':L69_I(55,{fx:18}),'leptospermum-arbre-a-the':L69_I(50,{fx:16}),'lophomyrtus':L69_I(45,{fx:16})});
