/* ================= Serre, lot 46 — Dahlias 2, grandis par le L-système : dahlia « assiette », dahlia nénuphar, dahlia collerette, dahlia simple, chrysanthème santini pompon ================= */
/* ---------- shared pieces: the involucre behind a head (outer green reflexed bracts, inner pale ones, the receptacle), the plant (lsHeadS: hollow stem, opposite pinnate leaves at the upper nodes,
   side shoots from their axils ending in a bud or a younger flower); lengths in real centimetres, whatever the grade of the head ---------- */
function l46Back(B,O,R0,it){if(B[2][2]>=.55)return;m32Phyl(B,O,8,{r0:R0*.16,z0:-R0*.05,L:R0*.3,W:R0*.11,a0:2.0,a1:2.6,tip:'point',wp:prof([[0,.6],[.4,1],[1,.1]])},'#3f6a2a','#24401a',it);
  m32Phyl(B,O,8,{ph:.4,r0:R0*.13,z0:-R0*.08,L:R0*.18,W:R0*.11,a0:2.5,a1:2.9,th:.8},'#6a8a4a','#3a5a28',it);it.push(l27Recep(B,O,R0*.2,R0*.12,'#4a7032'))}
/* a ray's colour: c, toward the heart c2 (k2 of the way), a blush (bl) on some, a little jitter */
function l46Col(cw,fr){let c=cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.55)*Math.pow(1-fr,1.5));if(cw.bl)c=mix(c,cw.bl,R(0,.45)*(.4+.6*fr));return mix(c,shd(c,R(-.07,.05)),.5)}
const L46_SG=['#2a4420','#466c30','#6c9846','#a6c87c'],L46_SK=['#24161a','#3e2a2c','#5e4440','#86685c'];
function l46Plant(g,t,o,list,S){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||S.cm)*UPC,cm=D/UPC,k=G(g),dk=!!cw.dk,sc=dk?L46_SK:L46_SG,lc=dk?'#3a2430':'#3a6a2c';
  const card=!NECK_X&&!!o.up,lk=card?.7:1;
  const r=lsHeadS(k,o,{D,w:UPC*S.w,cols:sc,op,rr:S.rr??.6,nodes:card?1:rnd()<.45?2:1,li:S.li/cm,lp:S.lp/cm*R(.9,1.1),opp:1,leafAng:56,side:{p:.62,n:2,top:2,len:S.sl/cm,ang:36,age:[0,S.young?.9:.4]},
    budD:Math.min(2.8,cm*.32)/cm,budMax:.45,wig:.03,aimK:.2,
    flower:(par,B,O,D2,op2)=>{if(op2<.33){dahliaBud(par,B,O,UPC*Math.min(cm*.4,5.5)*(.8+.6*op2)/.42,cw);return}S.fl(par,B,O,D2,cw,op2)},
    bud:(par,B,O,s)=>dahliaBud(par,B,O,s/.42,cw),young:S.young?(par,B,O,s,a)=>S.fl(par,B,O,s,cw,.45+.4*a):null,
    leaf:(og,pos)=>lsLeaf2D(og,pos,UPC*S.lf*R(.85,1.1)*(og.p.i>1?1.12:1)*lk,(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,lc,og.p.i>1&&DET>=1.5?5:3,{w:.5,side:.3}))});
  open(k,t,1000,10,.3);return r}
/* ---------- dinner-plate dahlia (Dahlia × hortensis, giant informal decorative, 'Café au Lait'): a huge head of 20 to 25 cm, fully double, of broad, softly waved and twisted rays
   packed in tight overlapping rows, cupped and incurved toward the closed heart, flat to slightly reflexed at the rim; peach cream, blush, ivory, also the strong colours of the giant group ---------- */
const L46_ASS=[{id:'cafe-au-lait',n:'Crème pêche (Café au Lait)',c:'#f2d8c4',c2:'#f0c4a8',bl:'#efc0c0',k2:.6},{id:'rose',n:'Rose poudré (Café au Lait Rosé)',c:'#f0c2c6',c2:'#e8a8b0',k2:.6},
  {id:'royal',n:'Rose lilas (Café au Lait Royal)',c:'#dca6c0',c2:'#c888ac',k2:.6},{id:'ivoire',n:'Ivoire crème',c:'#f7f3e8',c2:'#f0e6c8',k2:.7},
  {id:'peche',n:'Pêche saumon (Penhill Watermelon)',c:'#f4b49a',c2:'#f4cc8a',bl:'#ec8c9a',k2:.7},{id:'jaune',n:'Jaune pâle (Kelvin Floodlight)',c:'#f6dc6a',c2:'#f2c840',k2:.6},
  {id:'orange',n:'Orange bronze (Babylon Bronze)',c:'#ec8a3a',c2:'#e8a050',k2:.6},{id:'rose-vif',n:'Rose (Otto’s Thrill)',c:'#ec98b4',c2:'#e07ea0',k2:.5},
  {id:'framboise',n:'Framboise (Emory Paul)',c:'#a3305e',c2:'#8a1e4a',k2:.6},{id:'pourpre',n:'Pourpre sombre (Thomas Edison)',c:'#6e1a4a',c2:'#4e0e36',k2:.6},
  {id:'vancouver',n:'Pourpre liseré blanc (Vancouver)',c:'#8a1e52',tip:'#f6eef2',k2:0}];
const L46_ARAY=prof([[0,.28],[.18,.7],[.5,1],[.78,.88],[.93,.55],[1,.22]]);
/* the shared floret shading over one ray (lit in its middle, darker at its margins), drawn just above it */
const l46Ov=(it,l)=>{if(LOD)return;it.push({z:l.z+1e-6,fn:p=>E('path',{d:smooth(l.out),fill:floretShade()},p)})};
function l46AssFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,N=Math.round((lo?54:110)*(LOD?.8:1)*(.6+.4*o2));
  for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.9),a0=.1+1.34*fo*(.35+.65*o2),c=l46Col(cw,fr);
    const l=ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.02+.15*fr),z0:R0*.36*(1-Math.pow(fr,1.25))*(.5+.5*o2),L:R0*(.16+.76*Math.pow(fr,.8))*(.7+.3*o2)*R(.93,1.05),W:R0*(.12+.15*fr),wp:L46_ARAY,
      a0,a1:a0+.12+.36*fr*o2,pw:1.4,th:.6+1.7*Math.pow(1-fr,2),tip:fr<.3?'round':'fringe',fr:1,fd:.4,wav:.06+.1*fr,wk:3,n:lo?5:7,tw:R(-.6,.6)*fr});
    it.push({l,c,cb:mix(c,'#efe6d8',.25),lift:.05,ao:.72+.28*fr,mid:lo?null:shd(c,-.14),mw:.6,mo:.4,tipc:cw.tip&&fr>.2?cw.tip:null,tf:.62});l46Ov(it,l)}
  l46Back(B,O,R0,it);spPetals(k,it,{});return k}
/* ---------- waterlily dahlia (Dahlia × hortensis, waterlily group): fully double but flat, few broad rays in open rows, each shallowly hollowed like a cup and the outer ones tipped up,
   the heart closed by small incurved rays; side view shallow — the head seen from the side shows a plate, not a ball ---------- */
const L46_NEN=[{id:'blanc',n:'Blanc crème (Le Castel)',c:'#f6efdc',c2:'#f0e0b0',k2:.7},{id:'jaune',n:'Jaune (Glorie van Heemstede)',c:'#f2c22a',c2:'#eeae18',k2:.5},
  {id:'rose',n:'Rose tendre (Gerrie Hoek)',c:'#f2b8c8',c2:'#e8a4b8',k2:.4},{id:'peche',n:'Pêche abricot (Linda’s Baby)',c:'#f6c4a4',c2:'#f2a878',k2:.6},
  {id:'orange',n:'Orange cuivré (Brown Sugar)',c:'#e88a3a',c2:'#d0662a',k2:.5},{id:'lavande',n:'Lavande (Lauren Michele)',c:'#c8a8d8',c2:'#b48ac8',k2:.5},
  {id:'rose-blanc',n:'Blanc lavé de rose (Sweet Nathalie)',c:'#f6e6ec',c2:'#e898b4',k2:.85},{id:'karma',n:'Rouge chocolat (Karma Choc)',c:'#5a1e1e',c2:'#3e0e14',k2:.5}];
const L46_NRAY=prof([[0,.3],[.2,.78],[.52,1],[.8,.86],[.94,.5],[1,.2]]);
function l46NenFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,N=Math.round((lo?30:44)*(.6+.4*o2));
  for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.55),a0=.25+1.3*fo*(.35+.65*o2),c=l46Col(cw,fr),heart=fr<.22;
    const l=ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.02+.14*fr),z0:R0*.12*(1-Math.pow(fr,1.4))*(.6+.4*o2),L:R0*(.14+.76*Math.pow(fr,.85))*(.72+.28*o2)*R(.95,1.04),W:R0*(.17+.2*fr),wp:L46_NRAY,
      a0,a1:heart?a0-.35:a0-.08-.1*fr,pw:1.3,th:heart?1.9:.55+.4*(1-fr),tip:heart?'round':'fringe',fr:1,fd:.28,wav:.04,wk:3,n:lo?5:7,tw:R(-.12,.12)});
    it.push({l,c,cb:mix(c,'#efe6d8',.25),lift:.08,ao:.75+.25*fr,mid:lo?null:shd(c,-.14),mw:.55,mo:.4});l46Ov(it,l)}
  l46Back(B,O,R0,it);spPetals(k,it,{});return k}
/* ---------- the disc of a single or collarette dahlia: the cushion of tubular florets (green-gold buds at the centre, the open ring with its golden pollen) ---------- */
function l46Disc(it,B,O,R0,rd,hd,cw,lo){const nz=B[2][2];if(nz<=-.12)return;const p0=PJ(B,O,[0,0,hd*.5]);
  it.push({z:nz>.15?p0[2]+R0:p0[2],fn:p=>m32Cushion(p,B,O,rd,hd,cw.d||'#e3a91c',lo?34:64,cw.pt||'#c8781a')})}
const L46_RAY=prof([[0,.28],[.22,.78],[.56,1],[.84,.86],[.95,.55],[1,.25]]);
/* one ring of n broad flat rays */
function l46Ring(it,B,O,R0,rd,n,cw,o2,rot,o){for(let i=0;i<n;i++){const a0=(o.a0||.45)+1.05*o2+R(-.06,.06),fr=1,c=l46Col(cw,fr);
  const l=ligule(B,O,{phi:i/n*6.283+rot+R(-.05,.05),r0:rd*.9,z0:o.z0||0,L:R0*o.L*R(.95,1.04),W:R0*o.W,wp:o.wp||L46_RAY,a0,a1:a0+.1+.14*o2,pw:1.4,th:o.th??.3,tip:o.tip||'fringe',fr:o.fr||1,fd:o.fd??.22,wav:o.wav??0,wk:3,n:o.lo?5:7,tw:R(-.15,.15)});
  it.push({l,c:o.c||c,cb:mix(o.c||c,'#ece6dc',.22),lift:.22,mid:o.lo?null:shd(o.c||c,-.12),mw:.45,mo:.4,basec:o.eye,bf:.32,bo:.9,tipc:o.tipc,tf:.6})}}
/* ---------- collarette dahlia (Dahlia × hortensis, collerette group): one ring of eight broad flat rays, inside it a collar of short narrow petaloids, often of a contrasting colour,
   round the open yellow disc ---------- */
const L46_COL=[{id:'night-butterfly',n:'Rouge sombre à collerette blanche (Night Butterfly)',c:'#7a0f22',co:'#f6eee6'},{id:'la-gioconda',n:'Écarlate à collerette jaune (La Gioconda)',c:'#c41f2e',co:'#f2c43a'},
  {id:'pooh',n:'Rouge à pointes jaunes (Pooh)',c:'#d0282a',tip:'#f2c22a',co:'#f4cc3a'},{id:'corail',n:'Corail à collerette crème',c:'#f2724e',co:'#f6e8cc'},
  {id:'orange',n:'Orange à collerette jaune (Alstergruss)',c:'#f08a2a',co:'#f6d04a'},{id:'creme',n:'Crème à collerette blanche (Dentelle de Venise)',c:'#f4ead2',co:'#fbf8f0'},
  {id:'rose',n:'Rose à collerette pâle (Teesbrooke Audrey)',c:'#e98fb0',c2:'#c2457a',k2:.7,co:'#f6dce6'},{id:'bumble',n:'Pourpre rosé à collerette blanche (Bumble Rumble)',c:'#b8487a',co:'#f8f2f2'}];
function l46ColFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,rd=R0*.24,hd=R0*.1*(.6+.4*o2);
  l46Ring(it,B,O,R0,rd,8,cw,o2,rot,{L:.68,W:.36,lo,tipc:cw.tip});
  l46Ring(it,B,O,R0,rd*.92,8,cw,o2*.9,rot+.39,{L:.34,W:.12,z0:R0*.03,a0:.35,th:.6,tip:'fringe',fr:2,fd:.3,wav:.15,wp:prof([[0,.5],[.3,.9],[.75,1],[1,.7]]),c:cw.co,lo});
  l46Disc(it,B,O,R0,rd,hd,cw,lo);l46Back(B,O,R0,it);spPetals(k,it,{});return k}
/* ---------- single dahlia (Dahlia × hortensis, single group: 'Bishop' series, Mignon): one ring of eight broad rays round a big disc, a dark eye at their base in some;
   the Bishops on purple-black foliage and dark stems ---------- */
const L46_SIM=[{id:'llandaff',n:'Écarlate, feuillage noir (Bishop of Llandaff)',c:'#d8281e',eye:'#6a0e10',d:'#5a2a14',pt:'#e8b21e',dk:1},{id:'york',n:'Jaune, feuillage noir (Bishop of York)',c:'#f5d02a',dk:1},
  {id:'oxford',n:'Orange, feuillage noir (Bishop of Oxford)',c:'#f08a2a',dk:1},{id:'canterbury',n:'Magenta, feuillage noir (Bishop of Canterbury)',c:'#c22a7a',eye:'#6a1040',dk:1},
  {id:'dover',n:'Blanc, feuillage noir (Bishop of Dover)',c:'#f7f4ee',dk:1},{id:'moonfire',n:'Abricot à œil rouge, feuillage noir (Moonfire)',c:'#f4c25a',eye:'#b0281e',dk:1},
  {id:'rose',n:'Rose (Mignon)',c:'#e98fb0',eye:'#c2507e'},{id:'rouge',n:'Rouge (Mignon)',c:'#c41f2e'}];
function l46SimFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,rd=R0*.3,hd=R0*.12*(.6+.4*o2);
  l46Ring(it,B,O,R0,rd,8,cw,o2,rot,{L:.64,W:.38,lo,eye:cw.eye});
  l46Disc(it,B,O,R0,rd,hd,cw,lo);l46Back(B,O,R0,it);spPetals(k,it,{});return k}
/* ---------- santini pompon chrysanthemum (Chrysanthemum × morifolium, small-flowered spray): a stiff leafy stem branching above into a spray of little balls of 3 to 4 cm,
   each a pompon of short, crowded, cupped florets (the heart tinted green in 'Kermit' and 'Maverick Sunny'), some heads still in bud; lobed aromatic leaves.
   Drawn like the lot 30 sprays: the fine axes and the balls in batches, a ball a few florets of each tone in shared paths ---------- */
const L46_SAN=[{id:'kermit',n:'Vert chartreuse (Kermit)',c:'#b8cc48',e:'#7a9a2a'},{id:'yoko',n:'Vert anis (Yoko Ono)',c:'#c8d66e',e:'#8aa83a',btn:1},
  {id:'sunny',n:'Jaune à cœur vert (Maverick Sunny)',c:'#f5d22c',e:'#a8b830'},{id:'blanc',n:'Blanc (Madiba)',c:'#f7f5ee',e:'#dfe4c0'},
  {id:'rose',n:'Rose (Madiba)',c:'#e8a0be',e:'#d0789e'},{id:'lilas',n:'Lilas (Madiba)',c:'#c3a6dc',e:'#a888c8'},{id:'fuchsia',n:'Rose fuchsia',c:'#d8508a',e:'#b8306a'},{id:'creme',n:'Crème (Madiba)',c:'#f2e8c4',e:'#e0d898'}];
function l46San(g,t,o){const cw=cwPick(L46_SAN,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,sc=['#2e4a22','#4a6a36','#6e9050','#a4c080'],tw='#4f7236',lc='#3f6a2c';
  const P=pal7(cw.c),hr=UPC*(cw.btn?1.45:1.75);
  return bzShoot(g,t,o,{Lt:C*1.8,w0:3,w1:1.5,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a ball on its peduncle, its axis toward the light above */
    const head=(og,age)=>{const m=op*1.3-age*.2+R(-.08,.08),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.5),[0,.7,0]),V3.sc(FW,.6))),pos=og.pos;
      if(m<.35){const r=hr*R(.36,.44)*(.7+.6*Math.max(0,m)),c=V3.add(pos,V3.sc(ax,r*.7));hd.push({z:c[2],fn:B=>{l30Add(B,'gs',l30O(c[0]+r*.15,c[1]-r*.2,r));l30Add(B,'gb',l30O(c[0],c[1],r*.86));if(m>.12)l30Add(B,'gt',l30O(c[0]-r*.05,c[1]+r*.25,r*.55*Math.min(1,m/.35)));if(!LOD)l30Add(B,'gl',l30O(c[0]-r*.3,c[1]+r*.3,r*.28))}});return}
      const op2=Math.min(1,(m-.35)/.5),r=hr*R(.9,1.08)*(.6+.4*op2),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=pos,rot=R(0,6.283),N=DET>=1.5?84:44,tM=1.5+.9*op2,c0=PJ(Bf,O,[0,0,r*.8]);
      hd.push({z:c0[2],fn:B=>{const zc=r*.8;l30Add(B,'b0',m32Ell(c0,r*.98,[0,0,1]));if(Bf[2][2]<-.1){const iv=[];for(const[zz,rr]of[[zc-r*.55,r*.7],[zc-r*.85,r*.45],[zc-r,r*.15]])for(const p of spDisc(Bf,O,rr,zz,10))iv.push(p);l30Add(B,'iv',l30Poly(l30Hull(iv)))}
        for(let j=0;j<N;j++){const th=Math.acos(1-(j+.5)/N*(1-Math.cos(tM))),ph=j*2.39996+rot,n=[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)],nv=toV(Bf,n);if(nv[2]<.04)continue;
          const rf=r*(.2+.12*Math.min(1,th/1.3)),p=PJ(Bf,O,[n[0]*r,n[1]*r,zc+n[2]*r]),I=V3.dot(nv,LIGHT),hk=cw.e&&th<.5?'e':'f';l30Add(B,hk+(I>.5?2:I>.1?1:0),m32Ell(p,rf,nv));
          if(!LOD&&nv[2]>.3)l30Add(B,'m',m32Ell(PJ(Bf,O,[n[0]*r*1.04,n[1]*r*1.04,zc+n[2]*r*1.04]),rf*.38,nv))}}})};
    /* the spray: peduncles from the upper nodes, longer below so the balls come nearly level; most fork again, one ball open and one younger */
    const span=C*.85;let l,i=0;{const q=A.at(1);head({pos:q.p,H:q.T},0)}
    for(l=L-UPC*.8;l>Math.max(l0+3,L-span);l-=UPC*R(1.3,1.8)*(1+(L-l)/span),i++){const u=(L-l)/span,az=(i*137.5+R(-15,15))*D,len=(L-l)*R(.75,1.1)/Math.cos(.7)+UPC*1.2;
      const fork=u>.25&&rnd()<.8,mods=fork?[['F',{l:len*.55,w1:1.3}],['[',{w:1.15}],['+',{a:R(32,48)}],['F',{l:len*.42,w1:1.1,aim:[0,1,0],k:.25}],['K',{a:1.2}],[']',{}],['F',{l:len*.45,w1:1.15,aim:[0,1,0],k:.2}],['K',{a:.4}]]
        :[['F',{l:len,w1:1.15,aim:[0,1,0],k:.12}],['K',{a:u*.8}]];
      const br=bzGrow(A,l,az,R(40,56),mods,{w:1.5,seg:UPC*.6,T:[0,1,0],e:.03,wig:.04});l30Twigs(items,br,[[1.25,'t0'],[0,'t1']]);for(const og of br.organs)if(og.t==='K')head(og,og.p.a);
      if(rnd()<.75){const q=l30On(A,l,az+R(-.4,.4),.6),H=l30Tilt(q.T,q.r,R(.7,1)),p=q.p,ln=UPC*R(2.6,3.6)*(.6+u);parts.push(lsLeaf2D({H},p,ln,(par,x,y,an,ll)=>mumLeaf(par,x,y,an,ll,lc)))}}
    /* below, alternate leaves up the stem */
    for(let ll=L-span-UPC*.8;ll>l0+6;ll-=UPC*R(2.4,3.2)){const q=l30On(A,ll,R(0,6.283),.8),H=l30Tilt(q.T,q.r,R(.75,1.05)),v=Math.min(1,(L-ll)/(C*1.5));parts.push(lsLeaf2D({H},q.p,UPC*(3.6+3.4*v)*R(.9,1.1),(par,x,y,an,ll2)=>mumLeaf(par,x,y,an,ll2,lc)))}
    l30Batch(parts,items,l30TwKeys([['t0',tw,1.45],['t1',mix(tw,'#8ab070',.2),1.2]]),DET>=1.5?6:3);
    const ink=P.ink,PE=pal7(cw.e||cw.c),keys=[['iv',{fill:'#5f8a3e',stroke:'#2e4a22','stroke-width':.3,'stroke-opacity':.6}],['b0',{fill:toneAt(P,.32),stroke:ink,'stroke-width':.3,'stroke-opacity':.5}]];
    for(const j of[0,1,2])keys.push(['f'+j,{fill:toneAt(P,.42+.2*j),stroke:ink,'stroke-width':.22,'stroke-opacity':.32}]);
    for(const j of[0,1,2])keys.push(['e'+j,{fill:toneAt(PE,.42+.2*j),stroke:PE.ink,'stroke-width':.22,'stroke-opacity':.32}]);
    keys.push(['m',{fill:shd(cw.c,-.22),opacity:.55}],['gs',{fill:'#4a6e30'}],['gb',{fill:'#7fa652'}],['gt',{fill:mix(cw.c,'#e0e8c8',.2)}],['gl',{fill:'#c8dca8',opacity:.8}]);
    l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}
/* ---------- registers ---------- */
Object.assign(GH,{'dahlia-assiette':(g,t,o)=>l46Plant(g,t,o,L46_ASS,{cm:25,w:1.1,rr:.7,li:14,lp:20,sl:13,lf:16,fl:l46AssFlower}),
  'dahlia-nenuphar':(g,t,o)=>l46Plant(g,t,o,L46_NEN,{cm:11,w:.7,li:10,lp:17,sl:10,lf:12,fl:l46NenFlower,young:1}),
  'dahlia-collerette':(g,t,o)=>l46Plant(g,t,o,L46_COL,{cm:9,w:.55,li:9,lp:15,sl:10,lf:10,fl:l46ColFlower,young:1}),
  'dahlia-simple':(g,t,o)=>l46Plant(g,t,o,L46_SIM,{cm:8,w:.55,li:9,lp:14,sl:10,lf:10,fl:l46SimFlower,young:1}),
  'chrysantheme-santini-pompon':l46San});
Object.assign(CWS,{'dahlia-assiette':L46_ASS,'dahlia-nenuphar':L46_NEN,'dahlia-collerette':L46_COL,'dahlia-simple':L46_SIM,'chrysantheme-santini-pompon':L46_SAN});
Object.assign(SZG,{'dahlia-assiette':[20,22,25],'dahlia-nenuphar':[9,10,11,12],'dahlia-collerette':[7,8,9,10],'dahlia-simple':[6,7,8,9],'chrysantheme-santini-pompon':[12,15,18]});
Object.assign(GHI,{'dahlia-assiette':{form:'disque',size:3.4,k:'head',rk:1},'dahlia-nenuphar':{form:'disque',size:2.6,k:'head',rk:1},'dahlia-collerette':{form:'disque',size:2,k:'head',rk:1},
  'dahlia-simple':{form:'disque',size:1.9,k:'head',rk:1},'chrysantheme-santini-pompon':{form:'grappe',size:1.3,k:'plant',rk:.5,tip:.8}});
for(const id of['dahlia-assiette','dahlia-nenuphar','dahlia-collerette','dahlia-simple']){GH_BUDS.add(id);if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[0,1]})}
