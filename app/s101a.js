/* ================= Serre, lot 101 — fruits 2 et gui, grandis par le L-système (moteur des baies des lots 20 et 61) : litchi, kumquat, gui ================= */
/* des rameaux ligneux ou verts poussés par bzShoot et bzGrow : l'axe suit l'épine du Composer, ses rameaux, pédicelles et feuilles poussent de ses nœuds ;
   les fruits pendent au bout de leurs pédicelles (le fruit chevauche toujours le bout de son pédicelle), les feuilles partent de leur rachis ou de leur nœud.
   Litchi : panicule pendante de drupes rondes à peau rouge tuberculée, feuilles pennées luisantes (2 à 4 paires de folioles, sans foliole terminale).
   Kumquat : petits agrumes ovales ou ronds, calice vert en étoile, glandes à huile ; feuilles alternes coriaces et luisantes.
   Gui : touffe en fourches répétées (dichotomie, plans croisés), paires de feuilles épaisses au bout des pousses, baies blanches translucides sessiles dans les fourches.
   Toute liaison (pédicelle, rachis, rameau) fait au moins 1,3 unité */

/* ---------- shared: a lean blade (one path at the app's detail, toned by its mean facing; faint parallel veins at sheet detail), for the thick leaves of the mistletoe ---------- */
function l101Blade(pos,H,U,len,wr,col,o={}){const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));og.L=V3.cr(og.U,og.H);
  const S=lsLeafS(og,len,wr,o),nv=DET>=1.5?12:8,Lf=[],Rt=[];for(let i=0;i<=nv;i++){const v=i/nv;Lf.push(S(-1,v));Rt.push(S(1,v))}
  const e=.01,n=V3.nz(V3.cr(V3s(S(e,.5),S(-e,.5)),V3s(S(0,.52),S(0,.48)))),back=n[2]<0,P=pal7(col),PB=pal7(mix(shd(col,.15),'#c8cc9a',.25)),I=Math.max(.3,lightI(back?V3.sc(n,-1):n)*(o.ao||.86)),ink=shd(col,-.62);
  let z=0;for(const q of Lf.concat(Rt))z+=q[2];z/=Lf.length*2;
  return{z:z+(o.zb||0),cast:false,fn:par=>{const poly=Lf.concat(Rt.slice().reverse()).map(q=>[q[0],-q[1]]);E('path',{d:smooth(poly),fill:toneAt(back?PB:P,I),stroke:ink,'stroke-width':.45,'stroke-opacity':.45,'stroke-linejoin':'round'},par);
    if(DET>=1.5&&!LOD){let d='';for(const u of[-.42,0,.42]){const q=[];for(let i=1;i<=8;i++){const p=S(u*(.3+.7*Math.sin(Math.PI*i/9)),i/9*.92);q.push([p[0],-p[1]])}d+=smooth(q,false)}
      E('path',{d,stroke:back?PB.d1:P.l1,'stroke-width':.4,'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},par)}}}}
/* a pinnate leaf grown from the main axis at l (side az, el degrees from it): its rachis (a petiole, then pairs of leaflets, alternate to subopposite), no terminal leaflet when even */
function l101Pinnate(A,parts,l,az,el,len,pairs,lfl,wr,col,rc,o={}){const m=[['F',{l:len*.2,w1:1.8}]];for(let i=0;i<pairs;i++){m.push(['F',{l:len*.8/pairs*(i?1:.4),w1:Math.max(1.35,1.8-.4*i/pairs)}],['Lp',{i,s:1}]);
    m.push(['F',{l:len*.05,w1:Math.max(1.35,1.75-.4*i/pairs)}],['Lp',{i,s:-1}])}if(o.odd)m.push(['F',{l:len*.04,w1:1.35}],['Lt',{}]);
  const res=bzGrow(A,l,az,el,m,{w:2,seg:5,T:[0,-1,0],e:o.e??.02,wig:.02});lsChainParts(res.chains,[0,0,0],rc,parts,{piece:4});
  for(const og of res.organs){const u=og.t==='Lt'?1:og.p.i/Math.max(1,pairs-1),lf=lfl*(o.grad?(.75+.3*Math.sin(Math.PI*Math.min(1,.25+.8*u))):1)*R(.92,1.06),c=mix(col,o.c2||col,R(0,.5));
    const H=og.t==='Lt'?og.H:V3.nz(V3.add(V3.sc(og.L,og.p.s),V3.sc(og.H,o.fwd??.7)));parts.push(bzBlade(og.pos,H,og.U,lf,wr,c,{wp:o.wp||LS_LANCE,droop:o.droop??.12,arch:.06,fold:.18,vn:DET>=1.5?(o.vn||7):0,va:.1,gloss:o.gloss??1.2,face:.45}))}
  return res}
/* the outline point of a spheroid drawn by bzFruit (its screen frame), at the angle th and a fraction k of its radius */
const l101On=(c,e1,e2,mj,r,a,b)=>[c[0]+e1[0]*mj*a+e2[0]*r*b,c[1]+e1[1]*mj*a+e2[1]*r*b];

/* ---------- litchi (Litchi chinensis, Sapindaceae): a grey-brown woody twig; leaves alternate, paripinnate (2–4 pairs of elliptic-lanceolate, leathery, very glossy leaflets, 6–12 cm);
   at its tip a loose drooping panicle of round to heart-shaped drupes (3–4 cm), each on a stout short pedicel; the thin brittle rind red, covered with low pointed tubercles ---------- */
const L101_CW_LIT=[{id:'rouge-vif',n:'Rouge vif (Feizixiao)',c:'#cf2a3a',y:'#c89a4e',g:'#8fa242'},{id:'carmin',n:'Rouge carmin (Guiwei)',c:'#b41e34',y:'#bc8446',g:'#8fa242'},
  {id:'rose',n:'Rouge rosé (Brewster)',c:'#dc4c5c',y:'#d0a868',g:'#8fa242'},{id:'profond',n:'Rouge profond (Nuomici)',c:'#951a2c',y:'#a86c3c',g:'#8fa242'},
  {id:'rose-vert',n:'Rose épaulé de vert (Mauritius)',c:'#d65468',y:'#c8b060',g:'#8fa242',sh:'#d8c866'}];
function l101Lychee(parts,og,cw,rr,m){const ax=V3.nz(V3.add(og.H,[0,-.3,0])),hl=rr*1.04,O=V3.add(og.pos,V3.sc(ax,hl*.84)),col=mix(bzRipe(cw,m),shd(cw.c,-.25),R(0,.16)),dt=DET>=1.5,P=pal7(col),
    sh=cw.sh&&m>.6?cw.sh:m<.75?mix(cw.g,col,.5):null,ink=shd(col,-.66);
  parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,rr,col,{egg:.1,gl:.55,big:3,ink,paint:LOD?null:(q,c,e1,e2,mj,r)=>{
    /* the shoulders round the pedicel stay greener (unripe fruit, Mauritius): a crescent on the base side */
    if(sh){const a=[];for(let i=0;i<=8;i++){const th=Math.PI*(.62+.76*i/8);a.push(l101On(c,e1,e2,mj*.97,r*.97,Math.cos(th),Math.sin(th)))}for(let i=8;i>=0;i--){const th=Math.PI*(.7+.6*i/8);a.push(l101On(c,e1,e2,mj*.66,r*.86,Math.cos(th),Math.sin(th)))}
      E('path',{d:smooth(a),fill:sh,opacity:.38},q)}
    /* the tubercles: a staggered grid on the visible face, each a little pointed boss (its shaded lower rim, its lit upper rim at sheet detail), smaller toward the outline */
    const s=dt?.22:.3,d=Math.min(mj,r)*s*.4;let a1='',a2='';for(let j=-5;j<=5;j++)for(let i=-5;i<=5;i++){const a=(i+(j&1?.5:0))*s,b=j*s*.87,rho=a*a+b*b;if(rho>.8)continue;
      const k=Math.sqrt(1-rho),[x,y]=l101On(c,e1,e2,mj,r,a,b),dd=d*(.5+.5*k);a1+=`M${f(x-dd)},${f(y-dd*.15)}L${f(x)},${f(y+dd*.75)}L${f(x+dd)},${f(y-dd*.15)}`;
      if(dt)a2+=`M${f(x-dd*.8)},${f(y-dd*.2)}L${f(x)},${f(y-dd*.95)}L${f(x+dd*.8)},${f(y-dd*.2)}`}
    E('path',{d:a1,stroke:P.d2,'stroke-width':f(Math.max(.45,d*.32)),'stroke-opacity':.55,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},q);
    if(a2)E('path',{d:a2,stroke:P.l2,'stroke-width':f(Math.max(.4,d*.25)),'stroke-opacity':.35,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},q)}})});return O}
function l101Litchi(g,t,o){const cw=cwPick(L101_CW_LIT,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,sc=['#2e2622','#54463c','#7e6e62','#aa9a8c'],dt=DET>=1.5,
    rf=1.6*UPC*Math.max(.9,Math.min(1.1,C/(15*UPC)))**.3,lc='#1b3a1c';
  return bzShoot(g,t,o,{Lt:C*3.2,w0:4.4,w1:2.8,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the panicle: a rachis arching over under the fruit's weight; side branches spiral round it, each with one to three fruits on stout pedicels, one fruit at every tip */
    const nb=dt?5:4,pan=[['F',{l:C*.1,w1:2.4}]];for(let i=0;i<nb;i++){const q=i/nb,nf=rnd()<.55?2:1;pan.push(['F',{l:C*(.11-.03*q)*R(.85,1.15),w1:Math.max(1.8,2.3-.5*q)}],['/',{a:137.5+R(-15,15)}],
        ['[',{w:1.9}],['&',{a:R(42,62)}],['F',{l:C*(.15-.05*q)*R(.85,1.15),w1:1.6}]);
      for(let k=0;k<nf;k++)pan.push(['[',{w:1.5}],['/',{a:k*150+R(-25,25)}],['&',{a:R(35,55)}],['F',{l:rf*R(.9,1.3),w1:1.45}],['B',{q}],[']',{}]);pan.push(['F',{l:rf*.8,w1:1.45}],['B',{q}],[']',{}])}
    pan.push(['F',{l:rf*1.1,w1:1.5}],['B',{q:1}]);
    /* it leaves the twig straight on, then arches over toward one side under the weight of its fruit (a tropism toward the side and down: a curve, never a bend) */
    const az0=R(0,6.28),{r:r0}=l61At(A,L-.5,az0),top=bzGrow(A,L-.5,az0,R(2,5),pan,{w:2.8,seg:rf*.5,T:V3.nz(V3.add(V3.sc(r0,.6),[0,-1,0])),e:.075,wig:.03});lsChainParts(top.chains,[0,0,0],sc,parts,{piece:4});
    const grow=.72+.28*Math.min(1,op*1.4);for(const og of top.organs)if(og.t==='B'){const m=Math.max(0,Math.min(1,op*1.35-og.p.q*.1+R(-.08,.04)));l101Lychee(parts,og,cw,rf*grow*R(.92,1.06),m)}
    /* the leaves below the panicle: paripinnate, two to four pairs of glossy leaflets, the rachis spreading then bowing */
    const nl=dt?3:2;for(let i=0;i<nl;i++){const l=L-C*(.18+.42*i)*R(.92,1.08);if(l<l0+6)continue;const pr=dt?(i?3:2)+(rnd()<.4?1:0):2;
      l101Pinnate(A,parts,l,(i*150+R(-25,25))*D,R(42,58),C*R(.75,.95),pr,C*R(.42,.5),.3,mix(lc,'#2a5226',R(0,.35)),['#2a3a1a','#46582c','#6a7c46','#94a470'],{c2:'#24461e',grad:1,fwd:.6})}}})}

/* ---------- kumquat (Citrus japonica, syn. Fortunella; Rutaceae): green, slightly angular young shoots, older wood grey-green; leaves alternate, lanceolate-elliptic (4–9 cm), leathery,
   glossy dark green, paler beneath, on short narrowly winged petioles; small citrus fruits (2.5–4 cm) oval (Nagami) or round (Marumi, Meiwa), bright orange, the rind dotted with oil glands,
   a five-lobed green calyx at the base, the stylar scar at the tip; one to three in the upper axils, on short stalks ---------- */
const L101_CW_KUM=[{id:'nagami',n:'Orange vif (Nagami, ovale)',c:'#f2851a',y:'#e6c040',g:'#6c9630',sh:.7},{id:'meiwa',n:'Orange doré (Meiwa, rond)',c:'#f49d22',y:'#e8c848',g:'#6c9630',sh:.93},
  {id:'marumi',n:'Orange (Marumi, rond)',c:'#ec7c1c',y:'#e2b840',g:'#6c9630',sh:.92},{id:'fukushu',n:'Orange profond (Fukushu)',c:'#e2681a',y:'#dca83c',g:'#6c9630',sh:.84},
  {id:'centennial',n:'Panaché vert et or (Centennial Variegated)',c:'#f2a52a',y:'#e6c448',g:'#6c9630',sh:.68,st:'#6e9634'},{id:'vert',n:'Vert (fruits verts)',c:'#7c9e34',y:'#94ae40',g:'#6c9630',sh:.7}];
const L101_KUMW=prof([[0,.16],[.12,.6],[.4,1],[.7,.84],[.9,.42],[1,.05]]);
function l101Kumquat(g,t,o){const cw=cwPick(L101_CW_KUM,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||3.5)*UPC,sc=['#24341a','#3e5428','#5e7a3c','#8ca666'],dt=DET>=1.5,lc='#17321a',Cs=3.5*UPC*(C/(3.5*UPC))**.25;/* the fruit's grade sets the fruit; the twig and its leaves barely change */
  return bzShoot(g,t,o,{Lt:Cs*10,w0:3.6,w1:1.9,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,gr=.62+.38*Math.min(1,op*1.4);
    const fruit=og=>{const m=Math.max(0,Math.min(1,op*1.35+R(-.1,.04))),hl=C*.5*gr*R(.9,1.06),r=hl*cw.sh*R(.96,1.04),ax=V3.nz(V3.add(og.H,[0,-.45,0])),O=V3.add(og.pos,V3.sc(ax,hl*.9)),
        col=mix(bzRipe(cw,m),shd(cw.c,-.2),R(0,.14)),P=pal7(col),base=V3.add(O,V3.sc(ax,-hl*.94)),ph=R(0,6.28),seed=R(0,1000);
      /* the calyx: five broad short green lobes hugging the base; seen through the fruit only when the base faces us */
      const cal=par=>bzSpikes(par,bzRing(ax,5,1.15,ph).map(d=>[base,V3.add(base,V3.sc(V3.nz(V3.add(d,V3.sc(ax,.35))),r*.42)),r*.32]),'#4c6e26',r*.3,{ink:'#22361a'});
      parts.push({z:O[2],fn:par=>{const front=ax[2]<-.15;if(!front&&!LOD)cal(par);
        bzFruit(par,O,ax,hl,r,col,{egg:.06,gl:.85,big:3,ink:shd(col,-.62),paint:LOD?null:(q,c,e1,e2,mj,rr)=>{
          /* Centennial: pale green stripes running from base to tip */
          if(cw.st&&m>.5){let d='';for(const b0 of[-.62,-.18,.3,.7]){const w=.11,a=[];for(let i=0;i<=8;i++){const u=-1+2*i/8,k=Math.sqrt(Math.max(0,1-u*u));a.push(l101On(c,e1,e2,mj*.98,rr,u,(b0-w)*k))}
              for(let i=8;i>=0;i--){const u=-1+2*i/8,k=Math.sqrt(Math.max(0,1-u*u));a.push(l101On(c,e1,e2,mj*.98,rr,u,(b0+w)*k))}d+=smooth(a)}E('path',{d,fill:cw.st,opacity:.55},q)}
          /* the oil glands: small sunken dots, sparser toward the outline */
          let s2=seed,d='';const rn=()=>(s2=(s2*9301+49297)%233280)/233280,n=DET>=1.5?46:16,dr=Math.max(.3,Math.min(mj,rr)*.032);
          for(let i=0;i<n;i++){const a=rn()*2-1,b=rn()*2-1;if(a*a+b*b>.82)continue;const[x,y]=l101On(c,e1,e2,mj,rr,a,b);d+=`M${f(x-dr)},${f(y)}a${f(dr)},${f(dr)} 0 1 0 ${f(2*dr)},0a${f(dr)},${f(dr)} 0 1 0 ${f(-2*dr)},0`}
          if(d)E("path",{d,fill:P.d1,opacity:.3},q)},
          eye:(q,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.08),cy:f(tp[1]+a[1]*r2*.08),rx:f(Math.max(.5,r2*.07)),ry:f(Math.max(.4,r2*.07*Math.max(.4,Math.abs(a[2])))),fill:shd(col,-.55),opacity:.8},q)});
        if(front&&!LOD)cal(par)}})};
    const leaf=(p,H,T,len)=>parts.push(bzBlade(p,H,T,len,.36,mix(lc,'#24452a',R(0,.45)),{wp:L101_KUMW,droop:.12,arch:.06,fold:.24,vn:dt?6:0,va:.12,gloss:1.25,face:.5,ao:.9}));
    /* along the main axis: leaves spirally (2/5), the upper axils bearing fruit on short stalks */
    const step=Cs*(dt?.55:.72),n=Math.floor((Math.min(L-l0,Cs*7)-6)/step);let nfr=0;for(let i=0;i<n;i++){const l=L-2-step*i*R(.92,1.08);if(l<l0+5)break;const az=(i*144+R(-15,15))*D,s=A.sOf(l),{q,r}=l61At(A,l,az),w=3.6+(1.9-3.6)*s,el=38+i*4+R(-6,6);
      const H=V3.nz(V3.add(V3.sc(q.T,Math.cos(Math.min(80,el)*D)),V3.sc(r,Math.sin(Math.min(80,el)*D))));leaf(V3.add(q.p,V3.sc(r,w*.3)),H,q.T,Cs*R(1.5,1.9)*(i<1?.7:1));
      if(i>=1&&i<(dt?7:5)&&rnd()<(nfr<1?.9:.55)){nfr++;const res=bzGrow(A,l-Cs*.06,az+R(-.5,.5),R(55,75),[['F',{l:Cs*R(.22,.34),w1:1.45}],['B',{}]],{w:1.7,seg:2,T:[0,-1,0],e:.07,wig:.03});
        lsChainParts(res.chains,[0,0,0],sc,parts,{piece:4});for(const og of res.organs)fruit(og)}}
    /* side shoots from below, leafy, ending in a fruit or two */
    const ns=dt?2:1;for(let j=0;j<ns;j++){const l=L-Cs*(3.3+1.6*j)*R(.94,1.06);if(l<l0+8)continue;const az=(j*170+R(-30,30)+60)*D,m=[];
      for(let k=0;k<(dt?4:3);k++)m.push(['F',{l:Cs*R(.5,.7),w1:Math.max(1.5,2.4-.3*k)}],['Lv',{k}]);m.push(['F',{l:Cs*.3,w1:1.5}],['[',{w:1.5}],['&',{a:R(30,50)}],['F',{l:Cs*.28,w1:1.45}],['B',{}],[']',{}],['F',{l:Cs*.25,w1:1.45}],['B',{}]);
      const res=bzGrow(A,l,az,R(32,44),m,{w:2.6,seg:4,T:[0,-1,0],e:.012,wig:.03});lsChainParts(res.chains,[0,0,0],sc,parts,{piece:4});
      let k=0;for(const og of res.organs){if(og.t==='B'){fruit(og);continue}const a=k++*2.4+R(-.2,.2),rd=V3.add(V3.sc(og.L,Math.cos(a)),V3.sc(og.U,Math.sin(a)));leaf(og.pos,V3.nz(V3.add(V3.sc(og.H,.75),rd)),V3.add(og.U,[0,.6,0]),Cs*R(1.4,1.75))}}}})}

/* ---------- gui (Viscum album, Santalaceae): an evergreen tuft branched in repeated forks (each year's segment, 2–5 cm, ends in a node from which two, sometimes three, shoots fork
   in a plane crossed with the one before); stems smooth, cylindrical, yellow-green, a little swollen at the joints; at each shoot tip a pair of opposite, thick, leathery, oblong-obovate
   blunt leaves (2–8 cm) with faint parallel veins; the round berries (6–10 mm) white and translucent, sessile in small clusters in the forks, a dark dot at their tip ---------- */
const L101_CW_GUI=[{id:'blanc',n:'Baies blanc nacré (naturel)',c:'#f4f2e4',y:'#e6e8cc',g:'#bcc884'},{id:'ivoire',n:'Baies ivoire (bien mûres)',c:'#efe6c6',y:'#e6e0b8',g:'#bcc884'},
  {id:'vert-eau',n:'Baies vert d\'eau (cueillette précoce)',c:'#e2e8c8',y:'#dde4c0',g:'#bcc884'},{id:'male',n:'Rameau sans baies (pied mâle)',c:'#f4f2e4',g:'#bcc884',nb:1}];
const L101_GUIW=prof([[0,.3],[.18,.52],[.5,.8],[.78,1],[.93,.76],[1,.18]]);
function l101Gui(g,t,o){const cw=cwPick(L101_CW_GUI,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,sc=['#46541a','#6e7e2c','#96a64a','#c2cc7c'],dt=DET>=1.5,
    rb=.45*UPC*Math.max(.9,Math.min(1.1,C/(15*UPC)))**.3,li=C*.25,lc='#8a9a36';
  return bzShoot(g,t,o,{Lt:C*1.9,w0:3.6,w1:2.6,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the fork: an internode, its node; at the node two (or three) shoots, rolled a quarter turn from the fork below; the last shoots end in a leaf pair, the forks under them carry
       the older leaves (when still there) and the berries */
    const X=(n,w)=>{const out=[['F',{l:li*R(.8,1.15)*(n?1:.85),w1:Math.max(1.5,w*.9)}],['Nd',{n}]];if(!n)return out.concat([['Lv',{young:1}]]);
      const kd=rnd()<.22?3:2;out.push(['/',{a:90+R(-20,20)}]);if(n===1||n===2&&rnd()<.35)out.push(['Lv',{young:0}]);
      for(let j=0;j<kd;j++){const a=kd===2?(j?1:-1)*R(24,36):(j-1)*R(30,38);out.push(['[',{w:Math.max(1.5,w*.88)}],['+',{a}],['&',{a:kd===3&&j===1?R(-12,12):R(-6,6)}],...X(n-1,w*.88),[']',{}])}return out};
    const dep=dt?3:2,trees=[];
    trees.push(bzGrow(A,L-.5,R(0,6.28),R(2,6),X(dep,2.6),{w:2.6,seg:li*.25,T:[0,1,0],e:.004,wig:.035}));
    const nl=dt?3:2;for(let i=0;i<nl;i++){const l=L-li*(1+i)*R(.94,1.06);if(l<l0+6)continue;trees.push(bzGrow(A,l,(i*90+R(-15,15))*D+(i&1?Math.PI:0),R(28,40),X(Math.max(1,dep-(i>0?1:0)),2.4),{w:2.4,seg:li*.25,T:[0,1,0],e:.004,wig:.035}))}
    for(const res of trees){lsChainParts(res.chains,[0,0,0],sc,parts,{piece:4});
      for(const og of res.organs){
        if(og.t==='Lv'){if(!og.p.young&&rnd()<.7)continue;const a=R(28,44)*D,len=C*R(.26,.36)*(og.p.young?(.7+.3*Math.min(1,op*1.3)):1),c=og.p.young?mix(lc,'#a8b448',R(0,.5)):mix(lc,'#6e7e2a',R(0,.5));
          for(const s of[-1,1]){const H=V3.nz(V3.add(V3.sc(og.H,Math.cos(a)),V3.sc(og.L,s*Math.sin(a))));parts.push(l101Blade(og.pos,H,og.U,len*R(.9,1.08),.3,c,{wp:L101_GUIW,droop:.05,arch:.05,fold:.08,face:.5,tw:s*R(.1,.3)}))}}
        else if(og.t==='Nd'&&og.p.n>=1&&og.p.n<=2&&!cw.nb&&rnd()<(og.p.n===1?.85:.5)){
          /* the berries: sessile in the fork, crowded round the node on both sides of the fork's plane (the shoots fork across the node's U, a quarter turn on), the oldest the largest */
          const nbr=dt?Math.round(R(2.5,4.6)):Math.round(R(2,3.6)),m=Math.max(0,Math.min(1,op*1.3+R(-.1,.05)));for(let j=0;j<nbr;j++){
            const aj=j*2.4+R(-.3,.3),d=V3.nz(V3.add(V3.sc(og.H,.55),V3.add(V3.sc(og.L,Math.cos(aj)),V3.sc(og.U,.4*Math.sin(aj))))),rr=rb*R(.85,1.1)*(.75+.25*Math.min(1,op*1.4)),O=V3.add(og.pos,V3.sc(d,rr*.82)),
              col=bzRipe(cw,m),seed=mix(col,'#a8b07a',.45);
            parts.push({z:O[2]+rr*.3*d[2],fn:par=>bzFruit(par,O,d,rr*.97,rr,col,{gl:.8,big:3,ink:'#8e9264',paint:LOD?null:(q,c,e1,e2,mj,r)=>{
                /* translucent flesh: the seed and its sticky pulp seen through the skin, a soft disc low on the far side */
                const p=l101On(c,e1,e2,mj,r,.05,.12);E('ellipse',{cx:f(p[0]+r*.12),cy:f(p[1]+r*.14),rx:f(r*.34),ry:f(r*.3),fill:seed,opacity:.22},q)},
              eye:(q,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.12),cy:f(tp[1]+a[1]*r2*.12),rx:f(Math.max(.5,r2*.12)),ry:f(Math.max(.45,r2*.12*Math.max(.4,Math.abs(a[2])))),fill:'#3a3a26',opacity:.75},q)})})}}}}}})}

/* ---------- registers: drawers, colourways, trade grades in the recipe's unit (the litchi's cluster, the kumquat's fruit, the mistletoe's tuft), and the composer's berry stems ---------- */
Object.assign(GH,{'litchi-branche':l101Litchi,'kumquat-branche':l101Kumquat,'gui':l101Gui});
Object.assign(CWS,{'litchi-branche':L101_CW_LIT,'kumquat-branche':L101_CW_KUM,'gui':L101_CW_GUI});
Object.assign(SZG,{'litchi-branche':[12,15,15,18,20],'kumquat-branche':[2.5,3,3.5,3.5,4],'gui':[10,15,15,20,25]});
Object.assign(GHI,{'litchi-branche':{form:'baie',size:1.5,k:'plant',rk:.9,tip:.7},'kumquat-branche':{form:'baie',size:1.3,k:'plant',rk:.88,tip:.8},'gui':{form:'baie',size:1.4,k:'plant',rk:.85,tip:.75}});
