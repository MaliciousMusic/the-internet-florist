/* ================= Serre, lot 100 — branches à fruits, poussées par le L-système (moteur des baies du lot 20) : arbousier, ronce à mûres, liane de kiwi, grenadier, figuier ================= */
/* le bois suit l'épine du Composer (bzShoot) ; les rameaux, pétioles, pédoncules et pédicelles sont des chaînes de la tortue, qui se courbent sous leur tropisme (jamais de coude) ;
   chaque fruit est pendu au bout de son pédicelle, dans l'axe de sa dernière pousse, et un fruit lourd fait ployer le rameau qui le porte ; la maturité suit le stade (bouton = vert, mi-ouvert = virage,
   ouvert = mûr) et varie d'un fruit à l'autre ; les feuilles sont des limbes 3D (bzBlade), dentés, lobés ou composés. Aucun trait ne fait moins de 1,15 unité, et tout détail part de sa courbe porteuse */

/* ---------- shared: a ripeness for a fruit of age a (0 the oldest), m0 the ripeness of the stage; the colourways that mix their stages (mx) spread it from green to ripe ---------- */
const l100M=(cw,op,a)=>{const b=Math.min(1,op*1.3);return Math.max(0,Math.min(1,cw.mx?b*(1.25-1.1*cw.mx*a)+R(-.08,.08):b-.12*a+R(-.06,.04)))};
/* a turtle grown from an organ (its tip, its heading): the extension keeps the line it leaves */
const l100From=(og,mods,o={})=>lsTurtle(mods,Object.assign({p:og.pos,H:og.H,U:og.U,w:Math.max(1.2,og.w)},o));
/* points on the visible face of a spheroid drawn by bzFruit (c centre, e1 its axis on screen, e2 across, mj half length, rr radius): n of them spread by the golden angle, with how much each faces us */
function l100Skin(c,e1,e2,mj,rr,n,t0=-.86,t1=.86,wk=null){const out=[];for(let i=0;i<n;i++){const tt=t0+(t1-t0)*(i+.5)/n,aa=i*2.39996,cs=Math.cos(aa);if(cs<-.05)continue;const wv=rr*Math.sqrt(Math.max(0,1-tt*tt))*(wk?wk(tt):1),
    sn=Math.sin(aa);out.push({x:c[0]+e1[0]*mj*tt*.94+e2[0]*wv*sn*.94,y:c[1]+e1[1]*mj*tt*.94+e2[1]*wv*sn*.94,cs,tt,sn})}return out}
/* the axes of a grown branch: the stout ones as shaded ribbons (bzAxes), the fine ones (pedicels, petiolules, a coiled tip) each as one smooth stroke of their mean width, never under 1.15 */
function l100Axes(res,cols,parts,wf=1.75){const fine=res.chains.filter(c=>c.ord>0&&Math.max(...c.ws)<wf),thick=res.chains.filter(c=>!fine.includes(c));lsChainParts(thick,[0,0,0],cols,parts,{piece:DET>=1.5?4:7});
  for(const ch of fine){const P=ch.pts.map(q=>[q[0],-q[1]]),c=ch.c||cols,w=Math.max(1.15,ch.ws.reduce((a,b)=>a+b,0)/ch.ws.length);let z=0;for(const q of ch.pts)z+=q[2];z/=ch.pts.length;
    parts.push({z,cast:false,fn:g=>E('path',{d:smooth(P,false),stroke:c[1],'stroke-width':f(w),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)})}}
/* a colour along stops [[m, colour]…] */
const l100Step=(m,S)=>{if(m<=S[0][0])return S[0][1];for(let i=1;i<S.length;i++)if(m<=S[i][0])return mix(S[i-1][1],S[i][1],(m-S[i-1][0])/(S[i][0]-S[i-1][0]));return S[S.length-1][1]};
/* a soft flush: a radial gradient of c fading out at its rim */
const L100G={};function l100Soft(c,a=.6){const k=c+a,id=L100G[k];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l100g'+(gid++),gr=E('radialGradient',{id:nid},defs);stops(gr,[[0,c,a],[.55,c,a*.6],[1,c,0]]);L100G[k]=nid;return`url(#${nid})`}
const l100Dot=(x,y,rx,ry)=>`M${f(x-rx)},${f(y)}a${f(rx)},${f(ry)} 0 1,0 ${f(2*rx)},0a${f(rx)},${f(ry)} 0 1,0 ${f(-2*rx)},0`;
/* a leaf at the tip of its petiole (the organ og of a grown chain): its face toward the sky and a little toward us */
const l100Leaf=(og,len,wr,col,o)=>bzBlade(og.pos,og.H,V3.add(og.U,[0,o.up??.7,0]),len,wr,col,o);
/* a lobed or compound leaf in one plane: lobes (or leaflets) [angle from the midrib (rad), length, width ratio], all from the tip of the petiole, faced like l100Leaf */
function l100Fan(og,len,lobes,col,o,parts){let N=V3.add(V3.add(og.U,[0,o.up??.8,0]),o.N0||[0,0,0]);N=V3s(N,V3.sc(og.H,V3.dot(N,og.H)));if(V3l(N)<1e-3)N=og.L;N=V3.nz(N);const X=V3.cr(N,og.H);
  for(const[a,l,wr,c2]of lobes){const d=V3.nz(V3.add(V3.sc(og.H,Math.cos(a)),V3.sc(X,Math.sin(a))));parts.push(bzBlade(V3.add(og.pos,V3.sc(d,o.off||0)),d,N,len*l,wr,c2||col,Object.assign({},o,{droop:(o.droop??.12)*(1+.6*Math.abs(Math.sin(a)))})))}}
/* hooked prickles along a grown chain or the main axis: [p (centre), T (tangent), w (width)] → small curved thorns leaving the surface */
function l100Prick(parts,list,col,ink,sz){for(const[p,T,w,az]of list){const sd=V3.nz(V3.cr(T,[Math.cos(az),0,Math.sin(az)])),rd=V3.nz(V3.add(sd,[0,0,.3*Math.sin(az)])),h=w*.5,s=sz,
    b0=V3.add(p,V3.add(V3.sc(rd,h*.7),V3.sc(T,-s*.75))),b1=V3.add(p,V3.add(V3.sc(rd,h*.7),V3.sc(T,s*.65))),tp=V3.add(p,V3.add(V3.sc(rd,h+s),V3.sc(T,-s*.7))),mid=V3.add(p,V3.add(V3.sc(rd,h+s*.5),V3.sc(T,s*.1)));
  parts.push({z:p[2]+rd[2]*h,fn:par=>E('path',{d:`M${f(b0[0])},${f(-b0[1])}Q${f(mid[0])},${f(-mid[1])} ${f(tp[0])},${f(-tp[1])}Q${f(mid[0]+T[0]*s*.5)},${f(-mid[1]-T[1]*s*.5)} ${f(b1[0])},${f(-b1[1])}Z`,fill:col,stroke:ink,'stroke-width':.3,'stroke-opacity':.7},par)})}}
/* points along the main axis of a shoot between la and lb (view space): its centre, tangent, width */
const l100Ax=(A,w0,w1,l)=>{const s=A.sOf(l),q=A.at(s);return{s,p:q.p,T:q.T,Fr:q.Fr,Sd:q.Sd,w:w0+(w1-w0)*s}};

/* ---------- arbousier (Arbutus unedo): red-brown young shoots, the leaves crowded toward their tips, alternate, elliptic-oblong, serrate, leathery and glossy on red petioles;
   at the tips, drooping panicles of round berries (1.5–2 cm) whose skin is covered in small conical warts, ripening over a year from green to yellow, orange and scarlet — so that
   the fruits of every colour hang together, often beside the white urn-shaped flowers of the next year ---------- */
const L100_CW_ARB=[{id:'mele',n:'Fruits mêlés vert, jaune, orange et rouge',c:'#d4452a',y:'#e6a43a',mx:.9},{id:'rouge',n:'Rouge (fruits mûrs)',c:'#c8261f',y:'#e2862a'},{id:'orange',n:'Orange',c:'#e5782a',y:'#e6b43a'},
  {id:'jaune',n:'Jaune',c:'#e6c03a',y:'#d8c860'},{id:'vert',n:'Vert (fruits verts)',c:'#9fb04a',y:'#a8b450'},{id:'fleurs',n:'Fruits rouges et fleurs blanches',c:'#c42a2a',y:'#e6943a',mx:.5,fl:1}];
const L100_ARBW=prof([[0,.12],[.1,.5],[.3,.92],[.5,1],[.72,.84],[.9,.42],[1,.04]]);
function l100Arb(g,t,o){const cw=cwPick(L100_CW_ARB,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,dt=DET>=1.5,sc=['#3a1812','#68281c','#984632','#c4765c'],pc=['#561812','#882a1e','#b44a36','#d8846a'],
    lc='#1e3c1c',rb=.9*UPC*Math.max(.85,Math.min(1.2,C/(8*UPC)))**.3;
  return bzShoot(g,t,o,{Lt:C*4.4,w0:4.2,w1:2.4,sc,bow:R(-.12,.12),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* a berry: its warts as small cones (a dark foot, a lit tip) over the face we see; green at first, then yellow, orange, scarlet */
    const berry=(og,a)=>{const m=l100M(cw,op,a),ax=V3.nz(V3.add(og.H,[0,-.35,0])),r=rb*R(.9,1.08)*(.8+.2*Math.min(1,op*1.5)),O=V3.add(og.pos,V3.sc(ax,r*.82)),col=bzRipe(cw,m),dk=shd(col,-.38),lt=mix(col,'#fff4d8',.45);
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,r*.98,r,col,{gl:.5,big:3,ink:shd(col,-.7),paint:(q,c,e1,e2,mj,rr)=>{if(LOD)return;let d='',h='';for(const p of l100Skin(c,e1,e2,mj,rr,dt?46:20)){const s=Math.max(.38,rr*.1)*(.5+.5*p.cs);d+=l100Dot(p.x+s*.25,p.y+s*.3,s,s);if(dt||p.cs>.5)h+=l100Dot(p.x-s*.25,p.y-s*.3,s*.5,s*.5)}
        E('path',{d,fill:dk,opacity:.42},q);if(h)E('path',{d:h,fill:lt,opacity:.55},q)}})})};
    /* a flower: a white urn hanging mouth down, its five tiny lobes rolled back round the mouth */
    const urn=og=>{const ax=V3.nz(V3.add(og.H,[0,-.8,0])),r=rb*.5,O=V3.add(og.pos,V3.sc(ax,r*1.1));
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,r*1.3,r,'#f4efe2',{egg:.32,gl:.3,big:9,ink:'#9a9480',eye:(q,tp,a2,rr)=>E('ellipse',{cx:f(tp[0]),cy:f(tp[1]),rx:f(rr*.42),ry:f(rr*.42*Math.max(.35,Math.abs(a2[2]))),fill:'#e8dcc0',stroke:'#8a8470','stroke-width':.3},q)})})};
    /* a panicle: the peduncle leaves the tip of the shoot on its line and arches down under its fruits; pedicels along it, the oldest fruits lowest */
    const panicle=(og,n,fl)=>{const m=[['F',{l:C*.14,w1:1.8,e:.2}]];for(let j=0;j<n;j++)m.push(['F',{l:C*.06*R(.8,1.2),w1:Math.max(1.25,1.8-.5*j/n),e:.08}],['[',{w:1.25}],['/',{a:j*137.5+R(-15,15)}],['&',{a:R(38,62)}],['F',{l:rb*R(1.3,2),w1:1.2,e:.12}],[fl?'U':'B',{a:j/n}],[']',{}]);
      m.push(['F',{l:rb*1.4,w1:1.2}],[fl?'U':'B',{a:1}]);const res=l100From(og,m,{seg:rb*.7,T:[0,-1,0],e:.07,wig:.03});l100Axes(res,pc,parts);
      for(const q of res.organs)q.t==='U'?urn(q):berry(q,q.p.a)};
    const leaf=og=>parts.push(l100Leaf(og,C*R(.85,1.05)*(.75+.25*og.p.i),.33,mix(lc,'#2c4c22',R(0,.5)),{wp:L100_ARBW,teeth:dt?13:9,td:.05,droop:.1,arch:.06,fold:.24,vn:dt?7:0,gloss:1,face:.7}));
    /* a shoot of the year: bare at its foot, its leaves crowded toward its tip on red petioles, then the panicle */
    const shoot=(len,nl,fl)=>{const m=[['F',{l:len*.4,w1:2.4,c:pc}]];for(let i=0;i<nl;i++)m.push(['F',{l:len*.6/nl*R(.8,1.2),w1:2.3-.7*(i+1)/nl}],['[',{w:1.4,c:pc}],['/',{a:i*137.5+R(-15,15)}],['&',{a:R(42,64)}],['F',{l:C*.13,w1:1.25,e:-.05}],['Lf',{i:i/nl}],[']',{}]);
      m.push(['Pn',{fl}]);return m};
    const run=res=>{l100Axes(res,sc,parts);for(const og of res.organs){if(og.t==='Lf')leaf(og);else if(og.t==='Pn')panicle(og,og.p.fl?(dt?9:6):(dt?8:6),og.p.fl)}};
    /* the leader ends in a shoot; two or three more from just below, spread round it, bending under their fruit */
    run(bzGrow(A,L-.5,0,3,shoot(C*1.1,dt?8:6,0),{w:2.4,seg:4,T:[0,1,0],e:-.02,wig:.03}));
    const ns=dt?3:2,a0=R(0,6);for(let i=0;i<ns;i++){const l=L-C*(.35+.55*i)*R(.9,1.1);if(l<l0+6)continue;
      run(bzGrow(A,l,a0+i*2.4+R(-.3,.3),R(32,46),shoot(C*R(.9,1.15),dt?7:5,cw.fl&&i===0),{w:2.4,seg:4,T:[0,1,0],e:-.025,wig:.03}))}}})}

/* ---------- ronce à mûres (Rubus fruticosus agg.; the raspberry R. idaeus): arching angled canes, purplish red, armed with stout hooked prickles; palmately compound leaves of three
   or five ovate, doubly serrate leaflets with pleated veins, pale beneath; fruiting laterals end in panicles of aggregate fruits (1.5–2.5 cm), each a dome of glossy drupelets on a
   small calyx turned back: the terminal fruit ripens first, from green to red, then black — green, red and black on one cluster ---------- */
const L100_CW_RON=[{id:'mele',n:'Mûres mêlées vertes, rouges et noires',c:'#24161e',y:'#b52a3a',g:'#8aa646',mx:1},{id:'noir',n:'Noires (mûres mûres)',c:'#1c1420',y:'#8a2234',g:'#8aa646'},
  {id:'rouge',n:'Rouges (mûres qui tournent)',c:'#b52a3a',y:'#d0584a',g:'#8aa646'},{id:'vert',n:'Vertes (mûres vertes)',c:'#8aa646',y:'#a8b858',g:'#8aa646'},
  {id:'framboise',n:'Framboises (Rubus idaeus)',c:'#cc3550',y:'#e8a0a0',g:'#c8cc88',rasp:1}];
function l100Ron(g,t,o){const cw=cwPick(L100_CW_RON,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,dt=DET>=1.5,sc=cw.rasp?['#3a3428','#625a44','#8a8064','#b4aa8c']:['#3a1424','#62243a','#8a3e52','#b47088'],
    lc='#24401c',fh=1*UPC*Math.max(.85,Math.min(1.2,C/(8*UPC)))**.35,pk=cw.rasp?'#9a7a62':'#b0583a';
  return bzShoot(g,t,o,{Lt:C*4.6,w0:4.2,w1:2.2,sc,bow:R(.3,.42)*(rnd()<.5?-1:1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* an aggregate fruit: a dome of drupelets (one path, each with its crisp light), on its sepals turned back */
    const fruit=(og,a)=>{const m=l100M(cw,op,a),ax=V3.nz(V3.add(og.H,[0,-.25,0])),s=.6+.4*Math.min(1,m*1.6),hl=fh*s*R(.92,1.06),r=hl*(cw.rasp?.86:.78),O=V3.add(og.pos,V3.sc(ax,hl*.8)),
        col=cw.rasp?bzRipe(cw,m):l100Step(m,[[0,cw.g],[.3,mix(cw.g,'#c8c070',.35)],[.42,'#d07a62'],[.55,cw.y],[.7,cw.y],[.92,cw.c]]),blk=h2l(col)[2]<.25,P=pal7(col),ink=shd(col,-.7);
      parts.push({z:og.pos[2]-ax[2]*1.2,fn:par=>bzSpikes(par,bzRing(ax,5,m>.5?2.2:1.6,R(0,6)).map(d=>[og.pos,V3.add(og.pos,V3.sc(d,hl*.6)),hl*.3]),'#5a7a32',1.2,{ink:'#2a3a18'})});
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,r,col,{gl:0,big:1,ink,paint:(q,c,e1,e2,mj,rr)=>{if(LOD)return;const pts=l100Skin(c,e1,e2,mj,rr,dt?40:18,-.8,.9).sort((u,v)=>u.cs-v.cs);let d='',h='';
          for(const p of pts){const s=rr*(dt?.24:.3)*(.55+.45*p.cs);d+=l100Dot(p.x,p.y,s,s*(.75+.25*p.cs));if(!cw.rasp||dt)h+=l100Dot(p.x-s*.32,p.y-s*.36,s*.3,s*.26)}
          E('path',{d,fill:bzFill(col,0),stroke:ink,'stroke-width':.35,'stroke-opacity':.55},q);if(h)E('path',{d:h,fill:'#ffffff',opacity:cw.rasp?.25:blk?.55:.42},q)}})})};
    /* the compound leaf: a petiole, two (or four) leaflets at its tip, the terminal one on its own stalk; doubly serrate, pleated */
    const leaf=(og,len)=>{const five=dt&&rnd()<.5,c=mix(lc,'#34582a',R(0,.4)),bo={wp:LS_OVATE,teeth:dt?14:9,td:.1,droop:.14,arch:.05,fold:.26,vn:dt?7:0,va:.12,pleat:1,face:.7};
      const lobes=[[R(.9,1.05),.78,.5],[-R(.9,1.05),.78,.5]];if(five)lobes.push([R(1.9,2.1),.6,.5],[-R(1.9,2.1),.6,.5]);l100Fan(og,len,lobes,c,bo,parts);
      const tr=l100From(og,[['F',{l:len*.18,w1:1.2}],['T',{}]],{seg:2,T:[0,-1,0],e:.02});l100Axes(tr,['#2c3a1c','#4a5e2c','#6a8040','#98ac6c'],parts);
      for(const q of tr.organs)parts.push(bzBlade(q.pos,q.H,V3.add(q.U,[0,.8,0]),len*.95,.56,c,bo))};
    const panicle=(og,n)=>{const m=[['F',{l:fh*1.2,w1:1.6}]];const ord=[];for(let j=0;j<n;j++){ord.push(j);m.push(['[',{w:1.3}],['/',{a:j*137.5+R(-15,15)}],['&',{a:R(35,60)}],['F',{l:fh*R(.9,1.5),w1:1.2,e:.06}],['B',{a:.2+.8*(n-j)/n*R(.7,1.1)}],[']',{}],['F',{l:fh*R(.45,.75),w1:Math.max(1.2,1.6-.4*j/n)}])}
      m.push(['F',{l:fh*.9,w1:1.2}],['B',{a:0}]);const res=l100From(og,m,{seg:fh*.6,T:[0,-1,0],e:.05,wig:.04});l100Axes(res,sc,parts);for(const q of res.organs)fruit(q,q.p.a)};
    /* a fruiting lateral: a short cane with one or two leaves, ending in its panicle, bowed by it */
    const lat=(len,nl)=>{const m=[['F',{l:len*.35,w1:2}]];for(let i=0;i<nl;i++)m.push(['[',{w:1.5}],['/',{a:i*180+R(-30,30)}],['&',{a:R(50,70)}],['F',{l:C*.35,w1:1.3,e:-.04}],['Lf',{}],[']',{}],['F',{l:len*.65/nl,w1:2-.5*(i+1)/nl}]);m.push(['Pn',{}]);return m};
    const run=res=>{l100Axes(res,sc,parts);for(const og of res.organs){if(og.t==='Lf')leaf(og,C*R(.62,.75));else if(og.t==='Pn')panicle(og,dt?Math.round(R(6,9)):Math.round(R(4,6)))}};
    run(bzGrow(A,L-.5,0,3,lat(C*.7,1),{w:2.2,seg:4,T:[0,1,0],e:-.03,wig:.03}));
    const ns=dt?3:2,a0=R(0,6);for(let i=0;i<ns;i++){const l=L-C*(.7+.8*i)*R(.92,1.08);if(l<l0+6)continue;run(bzGrow(A,l,a0+i*2.5+R(-.3,.3),R(34,48),lat(C*R(.75,1),i?2:1),{w:2.2,seg:4,T:[0,1,0],e:-.03,wig:.03}))}
    /* the cane's own leaves, alternate, and its hooked prickles */
    const nl=dt?3:2;for(let i=0;i<nl;i++){const l=L-C*(1.05+.8*i)*R(.92,1.08);if(l<l0+6)continue;const res=bzGrow(A,l,a0+1.2+i*2.4,R(48,62),[['F',{l:C*.5,w1:1.4,e:-.05}],['Lf',{}]],{w:1.8,seg:4,T:[0,1,0],e:0,wig:.03});l100Axes(res,sc,parts);
      for(const og of res.organs)leaf(og,C*R(.75,.9))}
    const pr=[];for(let l=l0+5;l<L-6;l+=C*R(.16,.26)){const q=l100Ax(A,4.2,2.2,l);pr.push([q.p,q.T,q.w,R(0,6.283)])}l100Prick(parts,pr,pk,shd(pk,-.6),C*.05+1)}})}

/* ---------- liane de kiwi (Actinidia deliciosa 'Hayward', A. chinensis 'Gold'; the kiwiberry A. arguta): a woody twining cane, brown and rough, dotted with lenticels; shoots of the
   year, red-bristly, with big round heart-shaped leaves on long petioles, dark above, felted pale beneath; the fruits hang one to three from the lower axils on stout stalks: kiwis ovoid,
   brown and furred (golden and almost smooth in 'Gold'), or kiwaïs small and smooth, green or red, in bunches; the tips twine round nothing. Sold bare too, as dry twisted canes ---------- */
const L100_CW_KIW=[{id:'hayward',n:'Kiwis bruns duveteux (Hayward)',c:'#8a6a42',y:'#8a7a48',g:'#7a7a42',k:'kiwi',fur:1},{id:'gold',n:'Kiwis dorés (Actinidia chinensis Gold)',c:'#a88446',y:'#a08a4a',g:'#8a8a48',k:'kiwi',fur:.35},
  {id:'kiwai',n:'Kiwaïs verts (A. arguta Issai)',c:'#8aac3a',y:'#9ab448',g:'#7a9a3a',k:'kiwai'},{id:'kiwai-rouge',n:'Kiwaïs rouges (Ken\'s Red)',c:'#7a2a3e',y:'#8a5a3a',g:'#7a9a3a',k:'kiwai'},
  {id:'sarment',n:'Sarment nu (liane sèche)',c:'#6e4a32',k:'nu'}];
const L100_KIWW=prof([[0,.62],[.08,.86],[.3,1],[.58,.94],[.8,.66],[.94,.3],[1,.04]]);
function l100Kiw(g,t,o){const cw=cwPick(L100_CW_KIW,o),op=Math.max(.05,Math.min(1,o.op??1)),Lf=(o.cm||120)*UPC,Lr=120*UPC,dt=DET>=1.5,nu=cw.k==='nu',sc=nu?['#2e2018','#56402e','#7e6248','#a88a6e']:['#30221a','#5a4030','#84644a','#ae9070'],
    yc=['#4a2c22','#7a4a36','#a26a50','#c8947a'],lc='#22401c',kw=cw.k==='kiwai',u=UPC;
  /* a cane rising from the mouth hangs nothing below it: what would fall under its level is not grown */
  const lim=o.spine&&!(o.from>0)?4:-1e9;
  return bzShoot(g,t,o,{Lt:Lf*.85,w0:nu?9:7,w1:nu?3.4:2.6,sc,bow:R(.12,.2)*(rnd()<.5?-1:1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the fruit: an ovoid furred kiwi (its fur a ragged halo round the skin), or a small smooth glossy kiwaï; a dry calyx where it hangs, a tuft of dry styles at its tip */
    const fruit=(og,a)=>{const m=l100M(cw,op,a),s=.55+.45*Math.min(1,m*1.5),hl=(kw?1.2:3)*u*s*R(.92,1.06),r=hl*(kw?.82:.78),ax=V3.nz(V3.add(V3.sc(og.H,.35),[0,-1,0])),O=V3.add(og.pos,V3.sc(ax,hl*.88)),col=bzRipe(cw,m),
        ink=shd(col,-.65),fz=mix(col,'#c8a878',.35);if(O[1]-hl*1.1<lim)return;
      parts.push({z:O[2],fn:par=>{if(cw.fur&&!LOD){const c=[O[0],-O[1]],a2=[ax[0],-ax[1]],l2=Math.hypot(a2[0],a2[1])||1,e1=[a2[0]/l2,a2[1]/l2],e2=[-e1[1],e1[0]],mj=Math.sqrt(hl*hl*(1-ax[2]*ax[2])+r*r*ax[2]*ax[2]),n=dt?64:30,P=[];
          for(let i=0;i<n;i++){const th=i/n*6.283,k=1+(i%2?.06:.015)*cw.fur*(dt?1:1.4);P.push([c[0]+(e1[0]*mj*Math.cos(th)+e2[0]*r*Math.sin(th))*k,c[1]+(e1[1]*mj*Math.cos(th)+e2[1]*r*Math.sin(th))*k])}
          E('path',{d:'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:fz,stroke:shd(fz,-.3),'stroke-width':.3,'stroke-opacity':.5},par)}
        bzFruit(par,O,ax,hl,r,col,{gl:kw?.9:cw.fur?.12:.3,big:kw?2.6:30,ink,paint:kw?null:(q,c,e1,e2,mj,rr)=>{if(LOD||!dt)return;let d='';for(const p of l100Skin(c,e1,e2,mj,rr,40))d+=l100Dot(p.x,p.y,.45,.45);E('path',{d,fill:shd(col,-.3),opacity:.35},q)},
          eye:(q,tp,a2,rr)=>{if(kw&&!dt)return;const b=[tp[0],-tp[1],0];bzSpikes(q,bzRing(a2,6,.9,R(0,6)).map(dd=>[V3.add(b,V3.sc(a2,-rr*.1)),V3.add(b,V3.sc(dd,rr*(kw?.3:.16))),Math.max(1.2,rr*.07)]),'#3a2a1c',1.2,{ink:'#1a120c'})}})}});
      /* the dry calyx clasping its top */
      parts.push({z:og.pos[2]+ax[2]*hl*.3,fn:par=>bzSpikes(par,bzRing(ax,5,1.1,R(0,6)).map(d=>[og.pos,V3.add(og.pos,V3.sc(d,hl*(kw?.4:.28))),Math.max(1.3,hl*.14)]),'#5a4430',1.3,{ink:'#2a1c12'})})};
    /* a fruiting stalk from an axil: stout, turned down by the weight it carries (a kiwaï's bunch forks) */
    const hang=(og,n,a)=>{if(og.pos[1]-u*8<lim)return;const m=[];if(n>1){m.push(['F',{l:u*.6,w1:1.6}]);for(let j=0;j<n;j++)m.push(['[',{w:1.4}],['/',{a:j*360/n+R(-20,20)}],['&',{a:R(30,50)}],['F',{l:u*R(1.4,2.2),w1:1.25,e:.25}],['K',{a:a+j*.15}],[']',{}])}
      else m.push(['F',{l:u*R(2.4,3.4),w1:1.8,e:.3}],['K',{a}]);const res=l100From(og,m,{seg:u*.4,T:[0,-1,0],e:.18,wig:.02,w:2});l100Axes(res,yc,parts);for(const q of res.organs)fruit(q,q.p.a)};
    /* the leaf: a round heart-shaped blade (two basal lobes on each side of the petiole), faced to the light */
    const Fr=A.at(.85).Fr,leaf=(og,len)=>{if(og.pos[1]-len*1.1<lim)return;const c=mix(lc,'#2e5226',R(0,.4)),bo={N0:V3.sc(Fr,.9),up:.5,wp:L100_KIWW,teeth:dt?16:0,td:.025,droop:.1,arch:.05,fold:.12,vn:dt?6:0,va:.2,face:.7};
      l100Fan(og,len,dt?[[R(1.95,2.15),.42,1.05],[-R(1.95,2.15),.42,1.05],[0,1,.95]]:[[0,1,.95]],c,bo,parts)};
    /* a shoot of the year: its nodes alternate, a leaf on each; fruits from the lower axils; its tip twines (a coil of shrinking turns) */
    const shoot=(len,n,fr)=>{const m=[];for(let i=0;i<n;i++){m.push(['F',{l:len/(n+1)*R(.85,1.15),w1:Math.max(1.4,2.6-1.1*i/n)}],['[',{w:1.6,c:yc}],['/',{a:i*180+R(-25,25)}],['&',{a:R(50,66)}],['F',{l:Lr*.07,w1:1.3,e:-.06}],['Lf',{}],[']',{}]);
        if(fr&&i<2&&!nu)m.push(['[',{w:1.8}],['/',{a:i*180+90+R(-20,20)}],['&',{a:R(60,80)}],['H',{n:kw?Math.round(R(2,4)):(rnd()<.5?2:1),a:i*.3}],[']',{}])}
      m.push(['F',{l:len*.2,w1:1.3}]);for(let j=0;j<(dt?16:11);j++)m.push(['F',{l:u*(1.3-.045*j),w1:1.2}],['+',{a:30+j*1.6}],['&',{a:7}]);return m};
    const run=res=>{l100Axes(res,nu?sc:yc,parts);for(const og of res.organs){if(og.t==='Lf')leaf(og,Lr*R(.085,.105));else if(og.t==='H')hang(og,og.p.n,og.p.a)}};
    /* the bare cane: twisted side canes that loop back, cut short */
    if(nu){const n=dt?4:3;for(let i=0;i<n;i++){const l=l0+(L-l0)*(.25+.65*i/n)*R(.95,1.05);const m=[['F',{l:Lr*.08,w1:3.2}]];for(let j=0;j<16;j++)m.push(['F',{l:Lr*.022,w1:Math.max(1.8,3.2-.09*j)}],['+',{a:22+j}],['&',{a:9}]);
        l100Axes(bzGrow(A,l,i*2.4+R(-.3,.3),R(35,55),m,{w:3.4,seg:5,T:[0,1,0],e:0,wig:.04}),sc,parts)}return}
    run(bzGrow(A,L-.5,0,3,shoot(Math.min(Lr*.3,L*.4),dt?4:3,0),{w:2.6,seg:5,T:[0,1,0],e:-.012,wig:.03}));
    const ns=dt?4:3;for(let i=0;i<ns;i++){const l=L-(L/.85)*(.18+.17*i)*R(.92,1.08);if(l<l0+8||A.at(A.sOf(l)).p[1]<lim+L*.12)continue;run(bzGrow(A,l,i*2.5+R(-.3,.3),R(40,58),shoot(Math.min(Lr*R(.24,.32),L*.4),dt?4:3,1),{w:2.8,seg:5,T:[0,1,0],e:-.02,wig:.03}))}
    /* lenticels on the old wood */
    if(!LOD)for(let i=0,n=dt?40:16;i<n;i++){const l=l0+4+(L-l0-8)*(i+.5)/n,q=l100Ax(A,7,2.6,l),sd=V3.nz(V3.cr(q.T,[0,0,1])),p=V3.add(q.p,V3.sc(sd,q.w*.45*R(-.6,.6))),T=q.T,w=q.w;
      parts.push({z:(A.zk?A.zk(q.s,q.p[2]):q.p[2])+.002,fn:par=>E('ellipse',{cx:f(p[0]),cy:f(-p[1]),rx:f(Math.max(.6,w*.12)),ry:f(Math.max(.4,w*.06)),fill:'#b8a088',opacity:.6,transform:`rotate(${f(Math.atan2(-T[1],T[0])/D)} ${f(p[0])} ${f(-p[1])})`},par)})}}})}

/* ---------- grenadier (Punica granatum): stiff grey-brown wood, the young twigs reddish and angled, some ending in a spine; leaves opposite or in clusters, narrow-oblong, entire, glossy,
   bronze when young; the pomegranates (6–12 cm) hang at the ends of short shoots, heavy enough to bow them: a leathery rind, round and a little angular, flushed and finely flecked, crowned
   by the tube of the calyx and its five to eight stiff triangular lobes ---------- */
const L100_CW_GRE=[{id:'wonderful',n:'Rouge profond (Wonderful)',c:'#b8292f',y:'#c8783a',g:'#9aa04a',bl:'#8a1a24'},{id:'mollar',n:'Rouge orangé (Mollar)',c:'#d4532f',y:'#d89a40',g:'#9aa04a',bl:'#b8302a'},
  {id:'jaune',n:'Jaune doré à joue rose (Mollar de Elche)',c:'#d9b058',y:'#d8c060',g:'#a8a850',bl:'#d0605a'},{id:'vert',n:'Vert (grenades vertes)',c:'#93a04c',y:'#a8a850',g:'#93a04c',bl:'#b8784a'},
  {id:'bordeaux',n:'Bordeaux (Purple Heart)',c:'#7a1c28',y:'#a8402a',g:'#9aa04a',bl:'#5a1220'},{id:'noir',n:'Pourpre noir (Black, Kara Kalinsky)',c:'#5e1a26',y:'#8a3a2a',g:'#9aa04a',bl:'#3a0e18'}];
function l100Gre(g,t,o){const cw=cwPick(L100_CW_GRE,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,dt=DET>=1.5,sc=['#2e2822','#544a40','#7c7064','#a89a8c'],tc=['#3a1c16','#683228','#94503e','#bc8068'],lc='#2a4a1c';
  return bzShoot(g,t,o,{Lt:C*4.2,w0:4.8,w1:2.4,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the fruit, hung from its stalk; the calyx crown drawn on its own depth, so that it shows behind the fruit when turned away */
    const fruit=(og,a,sz)=>{const m=l100M(cw,op,a),s=(.55+.45*Math.min(1,m*1.4))*sz,r=C*.5*s*R(.94,1.04),ax=V3.nz(V3.add(V3.sc(og.H,.6),[0,-1,0])),O=V3.add(og.pos,V3.sc(ax,r*.8)),col=bzRipe(cw,m),bl=mix(col,cw.bl,Math.min(1,m*1.2)),ink=shd(col,-.7);
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,r*.94,r,col,{gl:.5,big:1,ink,paint:(q,c,e1,e2,mj,rr)=>{if(LOD)return;const fl=[c[0]-e2[0]*rr*.2+e1[0]*mj*.1,c[1]-e2[1]*rr*.2+e1[1]*mj*.1];
          E('ellipse',{cx:f(fl[0]),cy:f(fl[1]),rx:f(rr*.7),ry:f(mj*.78),fill:l100Soft(bl),transform:`rotate(${f(Math.atan2(e1[1],e1[0])/D+90)} ${f(fl[0])} ${f(fl[1])})`},q);
          if(dt){let d='';for(const p of l100Skin(c,e1,e2,mj,rr,36))d+=l100Dot(p.x,p.y,.5*(.6+.4*p.cs),.4);E('path',{d,fill:mix(col,'#f0d8a0',.5),opacity:.45},q)}}})});
      /* the stalk swelling into the fruit's foot */
      parts.push({z:O[2]-.01,fn:par=>bzSpikes(par,[[og.pos,V3.add(og.pos,V3.sc(ax,r*.3)),Math.max(2.4,r*.16)]],mix(tc[1],col,.35),2.4,{ink:tc[0]})});
      /* the crown: the tube of the calyx standing on the tip, its stiff lobes spread round its mouth (those behind it drawn first) */
      const n=Math.round(R(5,7)),b=V3.add(O,V3.sc(ax,r*.84)),tt=V3.add(O,V3.sc(ax,r*1.14)),cc=mix(shd(col,-.12),'#6a4a2a',.22),lb=bzRing(ax,n,1.2,R(0,6)).map(d=>[V3.add(tt,V3.sc(d,r*.12)),V3.add(tt,V3.add(V3.sc(d,r*.3),V3.sc(ax,r*.06))),Math.max(1.6,r*.12),d[2]]);
      parts.push({z:tt[2],fn:par=>{const sc2=q=>[q[0],-q[1]],a2=[ax[0],-ax[1]],l2=Math.hypot(a2[0],a2[1])||1,nx=-a2[1]/l2,ny=a2[0]/l2,B=sc2(b),T=sc2(tt),w0=r*.2,w1=r*.15,ink=shd(cc,-.6);
        bzSpikes(par,lb.filter(q=>q[3]<0),shd(cc,-.15),1.6,{ink});
        E('path',{d:`M${f(B[0]+nx*w0)},${f(B[1]+ny*w0)}L${f(T[0]+nx*w1)},${f(T[1]+ny*w1)}L${f(T[0]-nx*w1)},${f(T[1]-ny*w1)}L${f(B[0]-nx*w0)},${f(B[1]-ny*w0)}Z`,fill:cc,stroke:ink,'stroke-width':.4,'stroke-opacity':.6},par);
        if(ax[2]>.15)E('ellipse',{cx:f(T[0]),cy:f(T[1]),rx:f(w1),ry:f(w1*ax[2]),fill:shd(cc,-.5)},par);
        bzSpikes(par,lb.filter(q=>q[3]>=0),cc,1.6,{ink})}})};
    const leafy=(og,j)=>parts.push(l100Leaf(og,C*R(.6,.8),.24,j?mix(lc,'#8a5a2a',.3):mix(lc,'#3a5c22',R(0,.4)),{wp:LS_LANCE,droop:.14,arch:.06,fold:.22,vn:0,gloss:1.2,face:.7}));
    /* a shoot: opposite pairs of leaves; a fruiting shoot ends in the fruit and bows under it, the others in young bronze leaves (or a spine) */
    const shoot=(len,np,fr,sz)=>{const m=[];for(let i=0;i<np;i++){m.push(['F',{l:len/(np+.5)*R(.85,1.15),w1:Math.max(1.3,2.4-1*i/np),c:tc}]);for(const sd of[0,180])m.push(['[',{w:1.3,c:tc}],['/',{a:sd+i*90+R(-12,12)}],['&',{a:R(45,62)}],['F',{l:C*.04,w1:1.2}],['Lf',{j:i===np-1&&!fr?1:0}],[']',{}])}
      if(fr)m.push(['F',{l:C*.16,w1:2.2,c:tc,e:-.3}],['K',{sz}]);else m.push(['F',{l:len*.15,w1:1.2,c:tc}],['Lf',{j:1}]);return m};
    const run=res=>{l100Axes(res,tc,parts);for(const og of res.organs){if(og.t==='Lf')leafy(og,og.p.j);else if(og.t==='K')fruit(og,R(0,.3),og.p.sz)}};
    run(bzGrow(A,L-.5,0,3,shoot(C*.75,dt?4:3,0,1),{w:2.4,seg:4,T:[0,1,0],e:-.01,wig:.02}));
    const ns=dt?4:3,a0=R(0,6);let nf=0;for(let i=0;i<ns;i++){const l=L-C*(.45+.62*i)*R(.92,1.08);if(l<l0+6)continue;const fr=i<2||(i===2&&rnd()<.5);nf+=fr;
      run(bzGrow(A,l,a0+i*2.4+R(-.3,.3),fr?R(50,64):R(32,44),shoot(C*R(.75,1),dt?3:2,fr,i?R(.8,.92):1),{w:2.4,seg:4,T:[0,1,0],e:fr?-.075:-.01,wig:.02}))}}})}

/* ---------- figuier (Ficus carica): stout smooth grey branches, the tip a pointed green bud; big leaves (10–25 cm) on long petioles, palmate, with three or five rounded lobes, rough,
   pale-veined; the figs, single in the axils on very short stalks, pear-shaped (3–6 cm), ribbed and flecked, an eye at their tip; green, then soft and coloured — green-yellow, violet,
   brown-violet or black by the variety, striped yellow and green in the 'Panachée' ---------- */
const L100_CW_FIG=[{id:'vert',n:'Vertes (figues vertes)',c:'#8fa64a',y:'#9aaa4c',g:'#7a9a3e'},{id:'blanche',n:'Jaune-vert (Blanche d\'Argenteuil)',c:'#c9b44a',y:'#b8b44c',g:'#8aa244'},
  {id:'violette',n:'Violettes (Violette Dauphine)',c:'#5e2e52',y:'#8a6a4a',g:'#8aa244'},{id:'brune',n:'Brun violacé (Brown Turkey)',c:'#4e2a30',y:'#7a5a3a',g:'#8aa244'},
  {id:'noire',n:'Noires (Noire de Caromb)',c:'#2e1a28',y:'#5a3a3e',g:'#8aa244'},{id:'panachee',n:'Panachées (Panachée, Tiger)',c:'#c4c98a',y:'#c0c47a',g:'#a8b064',st:'#6e8e3a'}];
const L100_FIGL=prof([[0,.4],[.12,.72],[.35,1],[.6,.9],[.82,.56],[.95,.2],[1,.03]]);
function l100Fig(g,t,o){const cw=cwPick(L100_CW_FIG,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||4)*UPC,dt=DET>=1.5,sc=['#4a4640','#78726a','#a29c92','#c8c2b8'],gc=['#3a4a24','#5a6e34','#7e9450','#a8ba7c'],lc='#2e4c22';
  return bzShoot(g,t,o,{Lt:C*10,w0:6,w1:3.6,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* the fig: pear-shaped, narrowing into its stalk; meridian ribs, pale flecks, its eye at the tip (stripes on the 'Panachée') */
    const fig=(og,a)=>{const m=l100M(cw,op,a),s=.55+.45*Math.min(1,m*1.4),hl=C*.5*s*R(.94,1.06),r=hl*.82,ax=V3.nz(V3.add(V3.sc(og.H,1),[0,-.5*m,0])),O=V3.add(og.pos,V3.sc(ax,hl*.88)),col=bzRipe(cw,m),ink=shd(col,-.7);
      parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,r,col,{egg:-.5,gl:.25,big:1,ink,paint:(q,c,e1,e2,mj,rr)=>{if(LOD)return;const nr=dt?10:6,eg=.5*Math.min(1,Math.hypot(ax[0],ax[1])*1.3);let d='',st='';
          for(let i=0;i<nr;i++){const aa=(i+.5)/nr*Math.PI-Math.PI/2,sn=Math.sin(aa),P=[];for(let j=0;j<=8;j++){const tt=-.92+1.84*j/8,w=rr*Math.sqrt(1-tt*tt)*(1+eg*tt)*.97;P.push([c[0]+e1[0]*mj*tt*.96+e2[0]*w*sn,c[1]+e1[1]*mj*tt*.96+e2[1]*w*sn])}
            d+='M'+P.map(p=>f(p[0])+','+f(p[1])).join('L');if(cw.st&&i%2){const P2=[];for(let j=8;j>=0;j--){const tt=-.92+1.84*j/8,w=rr*Math.sqrt(1-tt*tt)*(1+eg*tt)*.97;P2.push([c[0]+e1[0]*mj*tt*.96+e2[0]*w*Math.sin(aa+Math.PI/nr*.8),c[1]+e1[1]*mj*tt*.96+e2[1]*w*Math.sin(aa+Math.PI/nr*.8)])}st+='M'+P.concat(P2).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}}
          if(st)E('path',{d:st,fill:cw.st,opacity:.55},q);E('path',{d,stroke:shd(col,-.3),'stroke-width':.4,'stroke-opacity':.4,fill:'none'},q);
          if(dt){let h='';for(const p of l100Skin(c,e1,e2,mj,rr,30,-.8,.86,tt=>(1+eg*tt)*.9))h+=l100Dot(p.x,p.y,.45,.45);E('path',{d:h,fill:mix(col,'#f4ecd0',.55),opacity:.5},q)}},
        eye:(q,tp,a2,rr)=>E('ellipse',{cx:f(tp[0]-a2[0]*rr*.06),cy:f(tp[1]+a2[1]*rr*.06),rx:f(rr*.12),ry:f(rr*.12*Math.max(.35,Math.abs(a2[2]))),fill:shd(col,-.5),stroke:mix(col,'#e8d8b8',.4),'stroke-width':.5},q)})})};
    /* the leaf: three or five lobes from the top of the petiole, rough and dull, pale-veined */
    const Fr=A.at(.85).Fr,leaf=(og,len)=>{const c=mix(lc,'#3c5e2a',R(0,.4)),five=rnd()<.6,bo={N0:V3.sc(Fr,1.3),up:.3,wp:L100_FIGL,teeth:dt?7:0,td:.06,droop:.12,arch:.05,fold:.16,vn:dt?5:0,va:.16,face:.7,ao:.8};
      const lobes=[[0,1,.46],[R(.85,1),.8,.42],[-R(.85,1),.8,.42]];if(five)lobes.push([R(1.9,2.1),.48,.44],[-R(1.9,2.1),.48,.44]);l100Fan(og,len,lobes,c,bo,parts)};
    /* the nodes of the top of the branch: a leaf on each (long petiole, spread round the stem), a fig in its axil; the terminal bud */
    const n=dt?5:4,ph=R(0,6);for(let i=0;i<n;i++){const l=L-C*(.45+.85*i)*R(.92,1.08);if(l<l0+6)continue;const az=ph+i*2.4+R(-.2,.2),q=l100Ax(A,6,3.6,l);
      const res=bzGrow(A,l,az,R(48,64),[['F',{l:C*R(1.5,1.9),w1:1.6,e:-.05,c:gc}],['Lf',{}]],{w:2.2,seg:5,T:[0,1,0],e:0,wig:.02});l100Axes(res,gc,parts);for(const og of res.organs)leaf(og,C*R(2.6,3.1)*(i?1:.75));
      if(i<n-1||rnd()<.5){const fr=bzGrow(A,l+C*.1,az+R(.4,.8)*(rnd()<.5?1:-1),R(30,45),[['F',{l:C*.18,w1:2.2,c:gc}],['K',{}]],{w:2.6,seg:2,T:[0,1,0],e:0});l100Axes(fr,gc,parts);for(const og of fr.organs)fig(og,i*.22)}}
    const tip=bzGrow(A,L-.4,0,2,[['F',{l:C*.1,w1:3.2,c:gc}],['F',{l:C*.28,w1:1.2,c:gc}]],{w:3.6,seg:2,T:[0,1,0],e:0});l100Axes(tip,gc,parts)}})}

/* ---------- registers: drawers, colourways, trade grades in the recipe's unit (the width of the cluster for the arbutus and the blackberry, the fruit for the pomegranate and the fig,
   the length of the cane for the kiwi vine), and how the composer treats them: berry stems, the kiwi vine a line ---------- */
Object.assign(GH,{'arbousier-a-fruits':l100Arb,'ronce-mures-en-fruits':l100Ron,'liane-de-kiwi':l100Kiw,'grenade-branche':l100Gre,'figuier-branche':l100Fig});
Object.assign(CWS,{'arbousier-a-fruits':L100_CW_ARB,'ronce-mures-en-fruits':L100_CW_RON,'liane-de-kiwi':L100_CW_KIW,'grenade-branche':L100_CW_GRE,'figuier-branche':L100_CW_FIG});
Object.assign(SZG,{'arbousier-a-fruits':[6,7,8,8,10],'ronce-mures-en-fruits':[6,7,8,8,10],'liane-de-kiwi':[80,100,120,120,150],'grenade-branche':[6,7,8,8,10],'figuier-branche':[3,4,4,5,6]});
Object.assign(GHI,{'arbousier-a-fruits':{form:'baie',size:1.3,k:'plant',rk:.85,tip:.8},'ronce-mures-en-fruits':{form:'baie',size:1.3,k:'plant',rk:.85,tip:.7},
  'liane-de-kiwi':{form:'ligne',size:1,k:'plant',self:100*UPC,tip:.8,fx:8*UPC},'grenade-branche':{form:'baie',size:1.5,k:'plant',rk:.9,tip:.85},'figuier-branche':{form:'baie',size:1.6,k:'plant',rk:.9,tip:.9}});
