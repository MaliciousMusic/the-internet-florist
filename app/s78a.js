/* ================= Serre, lot 78 — lauriers et feuillages persistants : laurier-sauce, laurier-cerise, laurier-tin, magnolia grandiflora, camélia ================= */
/* Les cinq feuillages poussent sur le moteur des feuillages du lot 24 (fgGrow : axe le long de l'épine du Composer, nœuds, rameaux, organes axillaires et terminaux)
   et leurs feuilles sont les lames 3D du lot 35 (g35Leaf : deux moitiés éclairées chacune par sa normale, la face et le revers de leurs couleurs propres).
   Ce lot ajoute : des contours dentés (dents tournées vers la pointe), des nervures pennées, un pétiole qui part toujours du rameau (jamais plus fin que 1,15),
   des feuilles retournées (magnolia : le revers feutré roux), des corymbes et des grappes de fleurs et de boutons, et les bourgeons terminaux. */
/* ---------- shared: outlines, veins, the leaf on its petiole ---------- */
/* an outline from a width profile (like g35Prof), its margin toothed: tz the depth of the sinus (share of the half-width), the teeth leaning toward the tip, from y0 to y1 */
function l78Prof(wp,wr,n=14,tz=0,y0=.12,y1=.93){const R0=[];for(let i=0;i<=n;i++){const y=i/n;R0.push([wp(y)*wr/2,y]);if(tz&&i<n){const ym=(i+.72)/n;if(ym>y0&&ym<y1)R0.push([wp(ym)*wr/2*(1-tz),ym])}}
  R0[R0.length-1]=[0,1];return{R:R0,L:R0.map(([x,y])=>[-x,y])}}
/* pinnate veins: the midrib and n pairs of laterals, each from the midrib forward to near the margin (sl: how far forward, k: how near the margin) */
function l78Veins(wp,wr,n=6,sl=.13,k=.78,y0=.12,y1=.82){const V=[[[0,.01],[0,.97]]];for(let i=0;i<n;i++){const y=y0+(y1-y0)*i/Math.max(1,n-1),e=t=>wr*.5*k*wp(Math.min(1,y+sl*t))*t;
    for(const s of[1,-1])V.push([[0,y],[s*e(.5),y+sl*.55],[s*e(1),y+sl]])}return V}
/* a leaf at its node: the petiole from the axis (a curved stalk ≥ 1.15 units) and the blade at its end; L {len (units), sh, c, cb, pet (units), pw, pc, flip, o (g35Leaf options)};
   flipped, the blade turns over on its midrib and shows its back */
function l78Leaf(og,L,lim){const F=g35Fr(og);let H=F.H,N=F.N;
  /* a blade pointing straight at the front of the spray leans aside (k: how much), so it never reads as a dark disc seen end-on */
  if(L.Fr&&L.fl){const d=V3.dot(H,L.Fr);if(Math.abs(d)>.35){H=V3.nz(V3s(H,V3.sc(L.Fr,d*L.fl)));const q=V3s(L.Fr,V3.sc(H,V3.dot(L.Fr,H)));N=V3.add(V3.sc(N,.4),V3.sc(V3l(q)>1e-4?V3.nz(q):N,.6));N=V3s(N,V3.sc(H,V3.dot(N,H)));N=V3l(N)>1e-4?V3.nz(N):F.N}}
  if(L.flip)N=V3.sc(N,-1);const pl=L.pet||0,d=V3.nz(V3.add(H,[0,-.12,0])),P0=V3.add(F.P0,V3.sc(d,pl));
  if(lim!=null&&P0[1]<lim+1)return null;
  const bl=g35Leaf(P0,H,N,L.len,L.sh,L.c,L.cb,Object.assign({lim,sm:L.sm??1},L.o));if(!bl.fn.length)return null;if(!pl)return[bl];
  return[g35Pet(F.P0,P0,Math.max(1.15,L.pw||1.2),L.pc||shd(L.c,-.2)),bl]}
/* ---------- florets: buds, flowers and berries at the ends of their pedicels, the pedicels drawn first, then in two depth bins (behind and before the cluster's centre),
   each bin as a few batched paths (buds, their light, flowers seen from the front, from the back, their eyes) so a cluster costs a handful of elements ---------- */
const l78Lobed=(c,n,r,nl,ph,k)=>{const[X,Y]=fgCross(n),P=[];for(let i=0;i<20;i++){const t=i/20*6.283,q=r*(1-k+k*Math.abs(Math.cos(nl*(t+ph)/2)));P.push(fgQ(V3.add(c,V3.add(V3.sc(X,Math.cos(t)*q),V3.sc(Y,Math.sin(t)*q)))))}return P};
/* fl: [{q (pedicel base), m (its middle, or null), p (the floret's centre), n (its face), k:'b'|'f'|'y', r}], C {ped, pw, bud, fl, flb, eye, berry, nl (lobes), cut (lobe depth)} */
function l78Florets(fl,C,zc){const out=[],det=DET>=1.5&&!LOD;if(!fl.length)return out;let pd='';
  for(const q of fl){const a=fgQ(q.q),b=fgQ(q.p);if(q.m){const m=fgQ(q.m);pd+=`M${f(a[0])},${f(a[1])}Q${f(m[0])},${f(m[1])} ${f(b[0])},${f(b[1])}`}else pd+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}
  out.push({z:zc-.3,cast:false,fn:g=>E('path',{d:pd,stroke:C.ped,'stroke-width':f(Math.max(1.15,C.pw||1.2)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)});
  const PB=pal7(C.bud),PF=pal7(C.fl),PK=pal7(C.flb||C.fl),PY=pal7(C.berry||C.bud);
  for(const bin of[0,1]){const L=fl.filter(q=>(q.p[2]>=zc)===!!bin).sort((a,b)=>a.p[2]-b.p[2]);if(!L.length)continue;let db='',dl='',dy='',dyl='',dff='',dfb='',de='';
    for(const q of L){const s=fgQ(q.p);
      if(q.k==='b'){db+=l41C(s[0],s[1],q.r);if(!LOD)dl+=l41C(s[0]-q.r*.3,s[1]-q.r*.32,q.r*.45)}
      else if(q.k==='y'){dy+=l41C(s[0],s[1],q.r);if(!LOD)dyl+=l41C(s[0]-q.r*.34,s[1]-q.r*.36,q.r*.28)}
      else{const fr=q.n[2]>=0,P=l78Lobed(q.p,q.n,q.r,C.nl||5,q.ph||0,C.cut??.32);if(fr){dff+=smooth(P);de+=l41C(s[0],s[1],Math.max(.55,q.r*.24))}else dfb+=smooth(P)}}
    out.push({z:zc+(bin?.3:-.15),cast:false,fn:g=>{
      if(db){E('path',{d:db,fill:toneAt(PB,.5),stroke:PB.ink,'stroke-width':.35,'stroke-opacity':.5},g);if(dl)E('path',{d:dl,fill:toneAt(PB,.82),opacity:.75},g)}
      if(dy){E('path',{d:dy,fill:toneAt(PY,.45),stroke:PY.ink,'stroke-width':.35,'stroke-opacity':.55},g);if(dyl)E('path',{d:dyl,fill:'#ffffff',opacity:det?.55:.4},g)}
      if(dfb)E('path',{d:dfb,fill:toneAt(PK,.55),stroke:PK.ink,'stroke-width':.3,'stroke-opacity':.4},g);
      if(dff){E('path',{d:dff,fill:toneAt(PF,.78),stroke:PF.ink,'stroke-width':.3,'stroke-opacity':.4},g);if(de)E('path',{d:de,fill:C.eye||'#d8c878'},g)}}})}
  return out}
/* a corymb (cyme) at the tip of a shoot: a peduncle along the shoot, rays spreading to a flat-topped dome of florets; the centre opens first;
   op: the stage (buds, then more and more flowers; berry forms carry drupes); C {R, pd (cm), n, nr, rb, rf, ...colours} */
function l78Cyme(og,op,kl,C,lim){const H=V3.nz(og.H),a=V3.nz(V3.add(V3.sc(H,.7),[0,.3,0])),[X,Y]=fgCross(a),Rr=C.R*UPC*kl,c0=V3.add(og.pos,V3.sc(a,C.pd*UPC*kl)),n=C.n||(DET>=1.5?28:18),nr=C.nr||5;
  if(lim!=null&&c0[1]<lim+6)return null;
  const rays=[],ph=R(0,6.283);for(let j=0;j<nr;j++){const t=ph+j/nr*6.283+R(-.2,.2),rd=V3.add(V3.sc(X,Math.cos(t)),V3.sc(Y,Math.sin(t)));rays.push({rd,e:V3.add(V3.add(c0,V3.sc(rd,Rr*.42)),V3.sc(a,Rr*.16))})}
  const fl=[];
  /* the peduncle and rays as pedicels of the dome: one stroke from the shoot's tip to the corymb's centre, one to each ray's end */
  const st=[{q:og.pos,m:null,p:c0}].concat(rays.map(r=>({q:c0,m:V3.add(V3.add(c0,V3.sc(r.rd,Rr*.2)),V3.sc(a,Rr*.12)),p:r.e})));
  for(let i=0;i<n;i++){const rho=Math.sqrt((i+.5)/n),t=i*2.39996+ph,rd=V3.add(V3.sc(X,Math.cos(t)),V3.sc(Y,Math.sin(t))),p=V3.add(V3.add(c0,V3.sc(rd,Rr*rho)),V3.sc(a,Rr*(.5-.34*rho*rho)+R(-.03,.03)*Rr));
    let best=rays[0],bd=1e9;for(const r of rays){const d=V3l(V3s(r.e,p));if(d<bd){bd=d;best=r}}const src=rho<.3?c0:best.e,m=V3.add(V3.sc(V3.add(src,p),.5),V3.sc(a,Rr*.06));
    const ag=C.berry?1:op*1.45-.15-rho*.55+R(-.15,.15),k=C.berry?'y':ag>.5?'f':'b',nn=V3.nz(V3.add(a,V3.sc(rd,.45*rho)));
    fl.push({q:src,m,p,n:nn,k,ph:R(0,1.3),r:(k==='y'?C.ry:k==='f'?C.rf*(.75+.25*Math.min(1,(ag-.5)*2.5)):C.rb*(.8+.25*Math.min(1,Math.max(0,ag)*2)))*UPC*kl})}
  const zc=fl.reduce((s,q)=>s+q.p[2],0)/fl.length,parts=l78Florets(fl,C,zc);
  let sd='';for(const q of st){const A=fgQ(q.q),B=fgQ(q.p);if(q.m){const M=fgQ(q.m);sd+=`M${f(A[0])},${f(A[1])}Q${f(M[0])},${f(M[1])} ${f(B[0])},${f(B[1])}`}else sd+=`M${f(A[0])},${f(A[1])}L${f(B[0])},${f(B[1])}`}
  parts.push({z:zc-.5,cast:false,fn:g=>E('path',{d:sd,stroke:C.ped,'stroke-width':f(Math.max(1.3,1.7*kl)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)});
  return parts}
/* a raceme (cherry laurel): an erect axis from the leaf's axil, florets spiralling on short pedicels, buds toward its tip */
function l78Raceme(og,op,kl,C,lim){const H=V3.nz(og.H),up=[0,1,0],a=V3.nz(V3.add(V3.sc(H,.45),V3.sc(up,.55))),Lr=C.L*UPC*kl*R(.85,1.1),n=C.n||(DET>=1.5?22:14),P0=og.pos;
  if(lim!=null&&P0[1]<lim+4)return null;
  const ax=[];for(let i=0;i<=8;i++){const t=i/8;ax.push(V3.add(V3.add(P0,V3.sc(a,Lr*t)),[0,0,0]))}const fl=[],ph=R(0,6.283);
  for(let i=0;i<n;i++){const t=.12+.86*i/(n-1),c=V3.add(P0,V3.sc(a,Lr*t)),[X,Y]=fgCross(a),az=ph+i*2.4,rd=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),pl=C.pl*UPC*kl*(1-.4*t),
      p=V3.add(V3.add(c,V3.sc(rd,pl)),V3.sc(a,pl*.35)),ag=op*1.6-.2-t*.9+R(-.1,.1),k=ag>.45?'f':'b';fl.push({q:c,m:null,p,n:V3.nz(V3.add(rd,V3.sc(a,.4))),k,ph:R(0,1.3),r:(k==='f'?C.rf:C.rb*(1-.35*t))*UPC*kl})}
  const zc=fl.reduce((s,q)=>s+q.p[2],0)/fl.length,parts=l78Florets(fl,C,zc),A2=ax.map(fgQ);
  parts.push({z:zc-.4,cast:false,fn:g=>l45Line(g,A2,Math.max(1.3,1.5*kl),C.ped)});return parts}
/* an ovoid bud at a shoot's tip, along it (magnolia's furry terminal bud, camellia's flower bud); two layers: its petals (col2, showing at the top) inside its scales (col) */
function l78Bud(og,len,w,col,o={}){const H=V3.nz(V3.add(V3.nz(og.H),[0,.15,0])),P=V3.add(og.pos,V3.sc(H,-len*.06)),
    pt=o.c2?l39Ovoid(V3.add(P,V3.sc(H,len*.25)),H,len*.8,w*.92,v=>Math.pow(Math.sin(Math.PI*Math.min(1,v*.92+.08)),.75)*(1-.25*v),o.c2,{glint:.4}):null,
    sc=l39Ovoid(P,H,len*(o.c2?.66:1),w,o.rp||(v=>Math.pow(Math.sin(Math.PI*Math.min(1,v*.9+.1)),.7)*(o.c2?1:1-.45*v*v)),col,{scales:o.scales||0,ink:o.ink});
  return[{z:sc.z+.05,cast:false,fn:g=>{if(pt)pt.fn(g);sc.fn(g)}}]}
/* wood colours: four tones from the bark's colour */
const L78_ST=c=>[shd(c,-.6),shd(c,-.3),c,shd(c,.35)];
/* one grown spray: the frame shared by the five species (size scale, axis, stems, leaf call with its size along the shoot) */
function l78Spray(g,t,o,id,list,S){const cw=fgCw(list,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=S.cm0,ks=o.spine?1:(o.cm||cm0)/cm0*(cw.ks||1),kl=o.spine?(cw.ks||1)*.92:.55+.45*ks,k=G(g);
  return g35Run(o,id,()=>{const Lt=o.spine?blen(o.spine):S.len*UPC*(.7+.3*Math.min(1.3,ks)),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.22)),lim=g35Lim(o),cols=L78_ST(cw.st||S.st);
    const G2=S.grow(cw,op,kl,lim),leaf=G2.leaf;
    const r=fgGrow(k,A,Object.assign({li:S.li*UPC*kl,liT:.3,w0:S.w0*kl,w1:S.w1||1,cols,uL:o.spine?.18:.24,phy:'spiral',la:52,face:.72,lift:.3,seg:9,wig:.035,
      side:{u0:.18,u1:.75,p:.4,len:.45,ang:42,li:.8,e:-.006,tilt:22}},G2,{leaf:(og,p,Fr)=>{const sz=(p.tip?.42:fgSz(p,.78))*(p.o?.86:1)*kl;return leaf(og,p,cm0*UPC*sz*R(.86,1.1),lim,Fr)}}));
    open(k,t,1000,0,.4);return r})}

/* ---------- bay laurel (Laurus nobilis, Lauraceae, « laurier-sauce », « laurier noble »): a dense evergreen; stiff, slightly zigzag twigs, green to red-tinged young, the wood grey-brown;
   leaves alternate (spiral), lanceolate to elliptic-lanceolate, 5–10 cm × 2–3.5 cm, acute at both ends, leathery, the margin entire and slightly wavy, dark matt to dull-glossy green above,
   paler and yellower beneath, the midrib pale, short reddish petiole (0.5–1 cm), aromatic when crushed. Dioecious: in late winter small axillary umbels of four to six buds in a round
   involucre open into creamy yellow flowers of four tepals; females later carry glossy black ovoid berries. Sold as cut foliage all year, in bunches of 40–60 cm stems;
   'Angustifolia' (willow-leaf bay) has narrow, wavier, paler leaves; 'Aurea' golden-green ---------- */
const CW_L78LAU=[{id:'vert-sombre',n:'Vert sombre mat (L. nobilis)',c:'#22401f',cb:'#56683a',st:'#5a5a34'},{id:'feuille-de-saule',n:'Vert olive, feuille étroite (Angustifolia)',c:'#5f6a36',cb:'#7f8a52',st:'#6a6234',nw:1},
  {id:'dore',n:'Vert doré (Aurea)',c:'#8a8a30',cb:'#a6a25a',st:'#7a6a34'},{id:'en-boutons',n:'Vert sombre, en boutons floraux (mâle)',c:'#24422a',cb:'#56683a',st:'#5a5a34',fl:1,f:1}];
const L78_LAUW=prof([[0,.08],[.1,.46],[.28,.88],[.45,1],[.64,.86],[.84,.46],[.95,.14],[1,0]]),L78_LAUV=l78Veins(L78_LAUW,.32,7,.12,.82);
function l78Laurus(g,t,o){return l78Spray(g,t,o,'l78lau',CW_L78LAU,{cm0:8,len:48,li:1.9,w0:4,w1:1,st:'#5a5a34',grow:(cw,op,kl,lim)=>{
  const wr=cw.nw?.22:.32,sh=g35Prof(L78_LAUW,wr,14),V=cw.nw?l78Veins(L78_LAUW,.22,7,.12,.82):L78_LAUV,pc=mix(cw.st,'#8a3a2a',.35);
  return{phy:'spiral',la:46,liT:.35,side:{u0:.2,u1:.7,p:.38,len:.42,ang:38,li:.75,e:-.004,tilt:20},axil:cw.fl?{u0:.4,p:.38,ang:40}:null,
    leaf:(og,p,len,lim,Fr)=>{const c=mix(cw.c,shd(cw.c,R(-.07,.07)),.5),y=p.tip?.4:0;
      return l78Leaf(og,{Fr,fl:.5,len:len*(cw.nw?1.08:1),sh,c:mix(c,'#7a8a3a',y),cb:cw.cb,pet:len*.08,pw:1.2,pc,o:{fold:.1,arch:.05,droop:.08,cup:.03,wave:cw.nw?.035:.022,wk:6+R(0,2),wph:R(0,6),tw:R(-.25,.25),bend:R(-.05,.05),dI:-.02,
        veins:V,vc:mix(c,'#c8cc98',.4),vw:.4,vo:.5,gloss:.15}},lim)},
    /* the axillary umbels: a round cluster of four to six buds on a short stalk, the flowers creamy yellow with four tepals */
    axDraw:cw.fl?(og)=>l78Cyme(og,op*.85,kl,{R:.55,pd:.35,n:DET>=1.5?6:4,nr:2,rb:.2,rf:.32,nl:4,cut:.2,ped:'#7a7a3a',pw:1.15,bud:'#b8b45a',fl:'#ece0a0',flb:'#d8cc80',eye:'#c8a830'},lim):null}}})}

/* ---------- cherry laurel (Prunus laurocerasus, Rosaceae, « laurier-cerise », « laurier-palme »): stout green shoots; leaves alternate, large, oblong to obovate-oblong, 10–15 (25) cm
   × 4–6 cm, thick and leathery, very glossy deep green above, pale yellow-green beneath, the margin entire or with a few remote teeth, the tip short-pointed, a short green petiole
   (0.6–1.3 cm) with two to four glands at the base of the blade; in April erect axillary racemes 7–12 cm long of small white five-petalled flowers, scented, their stamens long.
   Cultivars sold: the type ('Rotundifolia', 'Caucasica'), 'Otto Luyken' (narrow, smaller), 'Etna' (bronze young growth), 'Castlewellan' (marbled white) ---------- */
const CW_L78PRU=[{id:'vert-profond',n:'Vert profond luisant (P. laurocerasus)',c:'#1f3f1e',cb:'#7a9a52',st:'#4f7a35'},{id:'otto-luyken',n:'Vert foncé, feuille étroite (Otto Luyken)',c:'#24452a',cb:'#7a9a56',st:'#4f7a35',nw:1,ks:.75},
  {id:'etna',n:'Vert profond, pousses bronze (Etna)',c:'#5f5a30',cg:'#1f3f1e',cb:'#7a9a52',st:'#5a6a30',br:1},{id:'castlewellan',n:'Marbré blanc crème (Castlewellan)',c:'#c4c69a',cg:'#2f5a2a',cb:'#a8b88a',st:'#5a8a40',vr:1},
  {id:'en-fleurs',n:'Vert profond, en grappes de fleurs blanches',c:'#21412a',cb:'#7a9a52',st:'#4f7a35',fl:1,f:1}];
const L78_PRUW=prof([[0,.26],[.08,.62],[.25,.9],[.5,1],[.74,.93],[.88,.66],[.96,.3],[1,0]]);
function l78Prunus(g,t,o){return l78Spray(g,t,o,'l78pru',CW_L78PRU,{cm0:12,len:52,li:2.3,w0:5.2,w1:1.2,st:'#4f7a35',grow:(cw,op,kl,lim)=>{
  const wr=cw.nw?.27:.36,sh=l78Prof(L78_PRUW,wr,16,.02,.3,.9),V=l78Veins(L78_PRUW,wr,8,.1,.82,.1,.84),green=cw.cg||cw.c;
  return{phy:'spiral',la:56,liT:.28,face:.78,side:{u0:.24,u1:.66,p:.3,len:.4,ang:40,li:.8,e:-.005,tilt:18},axil:cw.fl?{u0:.4,p:.55,ang:28}:null,
    leaf:(og,p,len,lim,Fr)=>{const u=p.o?(p.b??1):p.u,young=p.tip||u>.82?1:0,c0=mix(green,shd(green,R(-.06,.06)),.5),c=cw.br&&young?mix('#6a4a26',c0,p.tip?.1:.45):young?mix(c0,'#5a8a34',.3):c0;
      /* the marbled form: the blade's centre deep green, the margin cream (irregular, as the white runs in streaks) */
      const vr=cw.vr?{c:c0,k:y=>.45+.25*Math.sin(y*9+R(0,6))}:null;
      return l78Leaf(og,{Fr,fl:.5,len,sh,sm:0,c:cw.vr?'#dcdcb0':c,cb:cw.cb,pet:len*.08,pw:1.4,pc:mix(cw.st,'#7a9a3a',.3),o:{fold:.14,arch:.06,droop:.1,cup:.02,tw:R(-.22,.22),bend:R(-.04,.04),
        veins:V,vc:mix(c,'#b8d07a',.35),vw:.4,vo:.4,gloss:.55,vr,dI:.02}},lim)},
    axDraw:cw.fl?(og)=>l78Raceme(og,op,kl,{L:10,n:DET>=1.5?30:20,pl:.5,rb:.26,rf:.6,nl:5,cut:.15,ped:'#6a8a3a',pw:1.15,bud:'#e8ecd0',fl:'#f6f4ea',flb:'#e2e6cc',eye:'#d8c860'},lim):null}}})}

/* ---------- laurustinus (Viburnum tinus, Adoxaceae, « laurier-tin »): reddish young twigs, grey with age; leaves opposite (decussate), ovate to oblong-elliptic, 4–10 cm × 2–4 cm,
   entire, leathery, dark glossy green above, paler beneath with tufts of hairs in the vein axils, the margin finely ciliate, petiole 1–2 cm, often reddish; from November to April flat-topped
   terminal cymes (corymbs) 5–10 cm across, many deep pink to carmine buds opening into small white flowers (6–8 mm, five rounded lobes, pink outside); then ovoid drupes turning
   metallic blue-black. Cultivars: the type (pink buds, white flowers), 'Eve Price' (carmine buds, pink-tinged flowers), 'French White' (pale buds, white flowers), the berried stems ---------- */
const CW_L78VIB=[{id:'boutons-roses',n:'Boutons roses, fleurs blanches (V. tinus)',c:'#d98fa3',lc:'#22401f',bud:'#c8607a',fl:'#f6f0ee',flb:'#e8b8c4',st:'#6a4a3a'},
  {id:'eve-price',n:'Boutons carmin, fleurs rosées (Eve Price)',c:'#b5384e',lc:'#203c1e',bud:'#a82a44',fl:'#f6e4e8',flb:'#d88898',st:'#6a3a34'},
  {id:'french-white',n:'Boutons rose pâle, fleurs blanches (French White)',c:'#f3efe6',lc:'#28462a',bud:'#e8c4c8',fl:'#faf8f2',flb:'#ece2dc',st:'#6a5a3a'},
  {id:'baies-bleues',n:'Baies bleu métallique',c:'#4a5d8f',lc:'#22401f',bud:'#c8607a',fl:'#f6f0ee',berry:'#3e4f86',st:'#5a4a3a',fr:1}];
const L78_VIBW=prof([[0,.42],[.1,.78],[.3,.98],[.45,1],[.68,.84],[.86,.5],[.96,.16],[1,0]]),L78_VIBV=l78Veins(L78_VIBW,.46,5,.16,.8,.12,.72);
function l78Viburnum(g,t,o){return l78Spray(g,t,o,'l78vib',CW_L78VIB,{cm0:7,len:46,li:2.6,w0:4.2,w1:1.1,st:'#6a4a3a',grow:(cw,op,kl,lim)=>{
  const sh=g35Prof(L78_VIBW,.46,14),pc=mix(cw.st,'#8a3a3a',.3);
  return{phy:'opp',la:56,liT:.22,tipLv:0,side:{u0:.3,u1:.72,p:.42,len:.36,ang:34,li:.9,e:-.004,tilt:16,pair:1},
    leaf:(og,p,len,lim,Fr)=>{const c=mix(cw.lc,shd(cw.lc,R(-.07,.07)),.5);
      return l78Leaf(og,{Fr,fl:.75,len:len*(p.tip?1.7:1),sh,c,cb:'#6a7f4a',pet:len*.13,pw:1.2,pc,o:{fold:.16,arch:.05,droop:.09,cup:.03,tw:R(-.22,.22),bend:R(-.05,.05),
        veins:L78_VIBV,vc:mix(c,'#b8c890',.4),vw:.45,vo:.5,gloss:.4}},lim)},
    /* every shoot ends in its corymb */
    tip:(og)=>l78Cyme(og,cw.fr?1:op,kl,{R:3.6,pd:1,nr:6,n:DET>=1.5?44:30,rb:.24,rf:.38,ry:.34,nl:5,cut:.3,ped:mix(cw.st,'#8a4a4a',.4),pw:1.15,bud:cw.bud,fl:cw.fl,flb:cw.flb,eye:'#e8dca8',berry:cw.fr?cw.berry:null},lim)}}})}

/* ---------- southern magnolia (Magnolia grandiflora, Magnoliaceae, « magnolia à grandes fleurs »): stout shoots, rusty-felted when young; leaves alternate, crowded toward the
   tip of each shoot, elliptic to obovate-oblong, 12–20 (25) cm × 6–10 cm, thick and leathery, the margin entire and a little rolled under, glossy dark green above, felted rusty brown
   beneath (deepest in 'Brackens Brown Beauty' and 'Little Gem', the latter with smaller leaves), petiole stout 1.5–3 cm, rusty; a silky, rusty, pointed terminal bud.
   Florists show both faces: many leaves turn over and show their bronze back. Also sold preserved (« stabilisé »), bronze-brown on both faces ---------- */
const CW_L78MAG=[{id:'vert',n:'Vert luisant, revers roux (M. grandiflora)',c:'#22401f',cb:'#8b4c26',st:'#7a6a5a',fp:.32},
  {id:'brackens',n:'Vert profond, revers brun roux (Brackens Brown Beauty)',c:'#1e3a1e',cb:'#7a3e1c',st:'#6a5040',fp:.42},
  {id:'little-gem',n:'Petite feuille, revers roux (Little Gem)',c:'#26442a',cb:'#8a4a22',st:'#6a5a48',fp:.38,ks:.68},
  {id:'stabilise',n:'Stabilisé bronze (feuillage préservé)',c:'#7a5a32',cb:'#9a7046',st:'#5a4632',fp:.38,pres:1}];
const L78_MAGW=prof([[0,.2],[.08,.55],[.25,.88],[.48,1],[.7,.92],[.86,.62],[.96,.24],[1,0]]),L78_MAGV=l78Veins(L78_MAGW,.44,9,.09,.84,.08,.86);
function l78Magnolia(g,t,o){return l78Spray(g,t,o,'l78mag',CW_L78MAG,{cm0:16,len:56,li:2.4,w0:7,w1:1.8,st:'#7a6a5a',grow:(cw,op,kl,lim)=>{
  const sh=g35Prof(L78_MAGW,.44,16),pc=mix(cw.st,'#8a4a26',.5);
  return{phy:'spiral',la:50,liT:.6,face:.66,lift:.25,side:{u0:.25,u1:.62,p:.32,len:.42,ang:38,li:.75,e:-.006,tilt:20},
    leaf:(og,p,len,lim,Fr)=>{const c=mix(cw.c,shd(cw.c,R(-.06,.06)),.5),flip=!p.tip&&rnd()<cw.fp;
      return l78Leaf(og,{Fr,fl:.5,len,sh,c,cb:cw.cb,flip,pet:len*.11,pw:Math.max(1.4,2*kl),pc,o:{fold:.15,arch:.07,droop:.11,cup:-.05,tw:R(-.3,.3)+(flip?R(-.2,.2):0),bend:R(-.04,.04),
        veins:L78_MAGV,vc:mix(c,cw.pres?'#c8a878':'#a8b878',.35),vw:.42,vo:.45,gloss:cw.pres?.25:.5,dI:-.04}},lim)},
    /* the silky rusty bud at each shoot's tip */
    tip:(og)=>lim!=null&&og.pos[1]<lim+6?null:l78Bud(og,2.6*UPC*kl,.85*UPC*kl,cw.pres?'#6a4a2a':'#9a6034',{scales:3,ink:'#4a2a14'})}}})}

/* ---------- camellia (Camellia japonica, Theaceae): grey-brown twigs, greenish brown when young; leaves alternate, two-ranked on side shoots, ovate to broadly elliptic, 5–10 cm × 3–5 cm,
   the tip abruptly acuminate, the margin finely and sharply serrate, thick and leathery, dark glossy green above, paler and matt beneath, petiole short (0.5–1 cm);
   flower buds at the shoot tips (sometimes in the upper axils), round to ovoid, wrapped in green to brown imbricate bracts, the colour of the petals showing at the top as they swell ---------- */
const CW_L78CAM=[{id:'vert-sombre',n:'Vert sombre luisant (C. japonica)',c:'#1f3f1e',cb:'#5f7a44',st:'#6a6050'},
  {id:'bouton-rouge',n:'Vert sombre, boutons rouges',c:'#b8182a',lc:'#1f3f1e',cb:'#5f7a44',st:'#6a6050',bud:'#b8182a',f:1},
  {id:'bouton-rose',n:'Vert sombre, boutons roses',c:'#e07894',lc:'#21412a',cb:'#5f7a44',st:'#6a6050',bud:'#e07894',f:1},
  {id:'bouton-blanc',n:'Vert sombre, boutons blancs',c:'#f4eee2',lc:'#203e22',cb:'#5f7a44',st:'#6a6050',bud:'#f4eee2',f:1}];
const L78_CAMW=prof([[0,.36],[.1,.74],[.3,.98],[.42,1],[.64,.88],[.82,.56],[.92,.26],[1,0]]),L78_CAMV=l78Veins(L78_CAMW,.5,6,.12,.78,.12,.78);
function l78Camellia(g,t,o){return l78Spray(g,t,o,'l78cam',CW_L78CAM,{cm0:8,len:48,li:1.8,w0:4.4,w1:1.1,st:'#6a6050',grow:(cw,op,kl,lim)=>{
  const sh=l78Prof(L78_CAMW,.5,18,.06,.18,.92),pc=mix(cw.st,'#5a6a3a',.4),pb=cw.bud?.8:rnd()<.2?.5:0,buds=[];
  return{phy:'spiral',la:54,liT:.3,face:.6,side:{u0:.22,u1:.72,p:.4,len:.42,ang:40,li:.8,e:-.005,tilt:22},
    leaf:(og,p,len,lim,Fr)=>{if(p.tip&&buds.some(b=>V3l(V3s(b,og.pos))<2))return null;const c0=cw.lc||cw.c,c=mix(c0,shd(c0,R(-.07,.07)),.5);
      return l78Leaf(og,{Fr,fl:.5,len,sh,sm:0,c:p.tip?mix(c,'#4a7a2a',.35):c,cb:cw.cb,pet:len*.07,pw:1.2,pc,o:{fold:.12,arch:.07,droop:.08,cup:.03,tw:R(-.25,.25),bend:R(-.05,.05),
        veins:L78_CAMV,vc:mix(c,'#a8c080',.35),vw:.4,vo:.4,gloss:.5}},lim)},
    /* a flower bud at some tips (the young leaves of that tip give way to it): its bracts green-brown, the petals' colour at its top from the half-open stage; on the plain form now and then a green bud only */
    tip:(og)=>{if(rnd()>=pb||lim!=null&&og.pos[1]<lim+6)return null;const s=(.75+.45*op)*kl,col=cw.bud;buds.push(og.pos);
      return l78Bud(og,(col?2.4:1.5)*UPC*s,(col?1.9:1.1)*UPC*s,'#5a6a34',{c2:col&&op>.3?mix('#7a8a40',col,Math.min(1,(op-.3)*2)):null,scales:4,ink:'#2a3418',rp:v=>Math.pow(Math.sin(Math.PI*Math.min(1,v*.75+.25)),.8)})}}}})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf's length, cm), and how the composer treats them (foliage stems along their spine) ---------- */
Object.assign(GH,{'laurus-nobilis-laurier-sauce':l78Laurus,'prunus-laurocerasus-laurier-cerise':l78Prunus,'viburnum-tinus-laurier-tin':l78Viburnum,
  'magnolia-grandiflora-feuillage':l78Magnolia,'camellia-japonica-feuillage':l78Camellia});
Object.assign(CWS,{'laurus-nobilis-laurier-sauce':CW_L78LAU,'prunus-laurocerasus-laurier-cerise':CW_L78PRU,'viburnum-tinus-laurier-tin':CW_L78VIB,
  'magnolia-grandiflora-feuillage':CW_L78MAG,'camellia-japonica-feuillage':CW_L78CAM});
Object.assign(SZG,{'laurus-nobilis-laurier-sauce':[6,8,8,10],'prunus-laurocerasus-laurier-cerise':[10,12,12,15],'viburnum-tinus-laurier-tin':[5,7,7,9],
  'magnolia-grandiflora-feuillage':[12,16,16,20],'camellia-japonica-feuillage':[6,8,8,10]});
const L78_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'laurus-nobilis-laurier-sauce':L78_I(45,{fx:18}),'prunus-laurocerasus-laurier-cerise':L78_I(50,{fx:20}),'viburnum-tinus-laurier-tin':L78_I(45,{fx:18}),
  'magnolia-grandiflora-feuillage':L78_I(50,{fx:20,size:1.2}),'camellia-japonica-feuillage':L78_I(50,{fx:18})});
GH_BUDS.add('viburnum-tinus-laurier-tin');
