/* ================= Serre, lot 32 — Marguerites d'été, grandies par le L-système : zinnia, dahlia à fleur d'anémone, bleuet, souci, coréopsis ================= */
/* ---------- shared pieces ---------- */
/* phyllaries as spPetals items: broad, rounded scales with a dark (scarious) margin, laid back under the head or clasped round a bud */
function m32Phyl(B,O,n,o,col,edge,out){for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+(o.ph||0)+R(-.1,.1),r0:o.r0,z0:o.z0,L:o.L*R(.9,1.08),W:o.W,wp:o.wp||prof([[0,.7],[.5,1],[1,.55]]),a0:o.a0,a1:o.a1,pw:1.2,tip:o.tip||'round',th:o.th??.5,n:4,tw:R(-.15,.15)});
  out.push({l,c:mix(col,shd(col,R(-.12,.08)),.5),cb:shd(col,.06),ink:edge,eo:.85,sw:o.sw||.55})}}
/* a scaly bud: an ovoid of green held by three rows of clasped, dark-edged phyllaries, the colour showing at its tip as it swells (zinnia, calendula) */
function m32ScaleBud(par,B,O,s,col,a,bc,edge){const k=G(par),it=[],c0=PJ(B,O,[0,0,0]);it.push({z:c0[2],fn:p=>spBud(p,B,V3.add(O,toV(B,[0,0,-s*.32])),s*1.1,s*.95,mix(bc,col,.08+.35*a),{tp:.3,pw:.6})});
  for(let r=0;r<3;r++)m32Phyl(B,O,7,{ph:r*.45,r0:s*(.4-.07*r),z0:-s*(.32-.2*r),L:s*(.4-.05*r),W:s*.21,a0:.55-.12*r,a1:.12-.1*r,th:1},mix(bc,shd(bc,.08),r/3),edge,it);
  if(a>.3){const p=PJ(B,O,[0,0,s*.8]);it.push({z:p[2]+s,fn:q=>{const t=PJ(B,O,[0,0,s*.68]),rr=s*(.07+.08*a),n=toV(B,[0,0,1]);E('ellipse',{cx:f(t[0]),cy:f(t[1]),rx:f(rr),ry:f(rr*Math.max(.35,Math.abs(n[2]))),fill:col,stroke:shd(col,-.4),'stroke-width':.3,opacity:.92},q)}})}
  spPetals(k,it,{});return k}
/* an ellipse lying on a surface at p (view-space projected), radius r, its normal nv in view space: an SVG sub-path (one path holds a whole crowd of florets) */
function m32Ell(p,r,nv){const l=Math.hypot(nv[0],nv[1]),ux=l>1e-4?nv[1]/l:1,uy=l>1e-4?nv[0]/l:0,ry=r*Math.max(.3,Math.abs(nv[2])),a=Math.atan2(uy,ux)*180/Math.PI;
  return`M${f(p[0]-ux*r)},${f(p[1]-uy*r)}a${f(r)},${f(ry)} ${f(a)} 1,0 ${f(2*ux*r)},${f(2*uy*r)}a${f(r)},${f(ry)} ${f(a)} 1,0 ${f(-2*ux*r)},${f(-2*uy*r)}`}
/* ---------- zinnia (Zinnia elegans): the dahlia-flowered (fully double, a high dome of broad rounded rays shingled from the flat rim to the upright heart),
   the cactus-flowered (quilled, pointed, twisted rays) and the semi-double (three rows round a raised maroon disc ringed with little yellow star florets);
   behind, the bell of rounded phyllaries edged with black; the stiff, hollow, hairy stem; opposite, sessile, ovate leaves clasping the stem ---------- */
const M32_ZIN=[{id:'ecarlate',n:'Écarlate (Benary’s Giant Scarlet)',c:'#cc1f26',c2:'#b0141e',t:'dah'},{id:'orange',n:'Orange (Benary’s Giant Orange)',c:'#f2701c',c2:'#e85a12',t:'dah'},
  {id:'or',n:'Jaune d’or (Benary’s Giant Golden Yellow)',c:'#f6b81e',c2:'#f0a010',t:'dah'},{id:'citron',n:'Jaune citron (Benary’s Giant Lemon)',c:'#f4dc4a',c2:'#ecd030',t:'dah'},
  {id:'lime',n:'Vert lime (Envy)',c:'#c8d86a',c2:'#b4c850',t:'dah'},{id:'rose-vif',n:'Rose vif (Benary’s Giant Bright Pink)',c:'#e2457e',c2:'#d0306a',t:'dah'},
  {id:'carmin',n:'Rose carmin (Benary’s Giant Carmine Rose)',c:'#d42a5e',c2:'#b81a48',t:'dah'},{id:'corail',n:'Corail (Benary’s Giant Coral)',c:'#f2725a',c2:'#ea5a48',t:'dah'},
  {id:'saumon',n:'Rose saumon (Benary’s Giant Salmon Rose)',c:'#f49a86',c2:'#ee8472',t:'dah'},{id:'pourpre',n:'Pourpre (Benary’s Giant Purple)',c:'#9a2a86',c2:'#7e1a6e',t:'dah'},
  {id:'vin',n:'Lie-de-vin (Benary’s Giant Wine)',c:'#7a1a3a',c2:'#5e0e2a',t:'dah'},{id:'blanc',n:'Blanc (Benary’s Giant White)',c:'#f6f3e8',c2:'#ece8c8',t:'dah'},
  {id:'queen-lime',n:'Vert lime rosé (Queen Lime Blush)',c:'#e6b8a8',c2:'#c8d27a',k2:.95,t:'dah'},{id:'queen-red-lime',n:'Vieux rose à cœur lime (Queen Red Lime)',c:'#b4566a',c2:'#c4cc76',k2:.95,t:'dah'},
  {id:'queen-orange',n:'Orange pêche à cœur lime (Queen Lime Orange)',c:'#eb9a68',c2:'#d0cc7c',k2:.9,t:'dah'},{id:'swizzle',n:'Cerise à pointes ivoire (Swizzle)',c:'#b8183a',tip:'#f6eedc',t:'dah'},
  {id:'peppermint',n:'Ivoire flammé de rouge (Peppermint Stick)',c:'#f4ece0',streak:'#cc2a36',t:'dah'},
  {id:'cactus-orange',n:'Orange (cactus)',c:'#f27a26',c2:'#ea6418',t:'cac'},{id:'cactus-rose',n:'Rose (cactus)',c:'#ea5a8c',c2:'#d8467a',t:'cac'},{id:'cactus-jaune',n:'Jaune (cactus)',c:'#f6c42a',c2:'#f0b018',t:'cac'},
  {id:'semi-rose',n:'Rose saumon (semi-double, Oklahoma)',c:'#f0849a',eye:'#7a1e1a',t:'semi'},{id:'semi-ecarlate',n:'Écarlate (semi-double, Oklahoma)',c:'#d42a26',eye:'#5a1410',t:'semi'},
  {id:'semi-blanc',n:'Blanc (semi-double, Oklahoma)',c:'#f6f2e6',eye:'#6a3a14',t:'semi'}];
const M32_ZRAY=prof([[0,.42],[.2,.82],[.55,1],[.85,.96],[1,.78]]),M32_ZCAC=prof([[0,.5],[.25,1],[.6,.85],[.88,.45],[1,.18]]);
/* the ring of tiny yellow star florets on a semi-double's disc (each a five-pointed star, all in one path) */
function m32Stars(par,B,O,rd,hd,n,col,rot,fill){if(LOD)return;let d='';const rs=Math.max(.5,rd*(fill?.2:.12));for(let i=0;i<n;i++){const a=fill?i*2.39996+rot:i/n*6.283+rot+(i%2)*.1,q=fill?.75*Math.sqrt((i+.5)/n):i%2?.78:.92,x=Math.cos(a)*rd*q,y=Math.sin(a)*rd*q,z=hd*Math.sqrt(Math.max(0,1-q*q))+hd*.15,nv=toV(B,V3.nz([x/rd,y/rd,1.4]));if(nv[2]<.05)continue;
  const p=PJ(B,O,[x,y,z]),pt=[];for(let j=0;j<10;j++){const b=j/10*6.283+a,rr=j%2?rs*.4:rs;pt.push([p[0]+Math.cos(b)*rr,p[1]+Math.sin(b)*rr*Math.max(.4,nv[2])])}d+=pD(pt)+'Z'}
  if(d)E('path',{d,fill:col,stroke:shd(col,-.35),'stroke-width':.25,'stroke-opacity':.7},par)}
function m32ZinFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,t=cw.t||'dah';
  const col=fr=>{let c=cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.55)*Math.pow(1-fr,1.5));return mix(c,shd(c,R(-.08,.06)),.5)},
    push=(l,c,fr)=>{const st=cw.streak&&rnd()<.7;it.push({l,c:st&&rnd()<.12?mix(c,cw.streak,.85):c,cb:mix(c,'#e8e0c8',.2),lift:.22,mid:st?cw.streak:(!lo&&fr>.4?shd(c,-.12):null),mw:st?Math.max(.5,R0*.028):.35,mo:st?.8:.35});
      /* bicolour tips ('Swizzle'): the outer part of each ray painted over in the second colour */
      if(cw.tip&&fr>.2&&l.nm[2]>0)it.push({z:l.z+1e-4,fn:p=>{const n=(l.out.length-1)>>1,i0=Math.round(n*.8),q=l.out.slice(i0,l.out.length-i0);if(q.length>3)E('path',{d:smooth(q),fill:cw.tip,opacity:.92},p)}})};
  /* the back: the bell of rounded, black-edged phyllaries and the green receptacle */
  if(nz<.55){m32Phyl(B,O,lo?9:12,{r0:R0*.15,z0:-R0*.05,L:R0*.15,W:R0*.1,a0:2.45,a1:2.85,th:.3,sw:.4},'#6a8a46','#3a3020',it);m32Phyl(B,O,lo?7:10,{ph:.3,r0:R0*.1,z0:-R0*.1,L:R0*.13,W:R0*.09,a0:2.75,a1:3.0,th:.3,sw:.4},'#62823e','#3a3020',it);
    it.push(l27Recep(B,O,R0*.2,R0*.13,'#5f8240'))}
  if(t==='dah'){const N=Math.round(80*(lo?.5:1)*(.6+.4*o2));for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.85),a0=.12+1.4*fo*(.35+.65*o2);
      push(ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.03+.2*fr),z0:R0*.64*(1-Math.pow(fr,1.7))*(.55+.45*o2),L:R0*(.2+.56*Math.pow(fr,.85))*(.75+.25*o2)*R(.94,1.05),W:R0*(.14+.12*fr),wp:M32_ZRAY,a0,a1:a0+.1+.2*fr*o2,pw:1.3,th:.6-.15*fr,tip:'fringe',fr:2,fd:.12,wav:.1,n:5,tw:R(-.3,.3)}),col(fr),fr)}
    if(o2>.55&&nz>-.1&&!cw.tip){const zt=R0*.64*(.55+.45*o2)+R0*.1,p0=PJ(B,O,[0,0,zt]);it.push({z:p0[2]+R0*.05,fn:p=>{const O2=V3.add(O,toV(B,[0,0,zt-R0*.04]));capDisc(p,B,O2,R0*.07,R0*.05,shd(cw.c2||cw.c,-.35),{dots:0});m32Stars(p,B,O2,R0*.07,R0*.05,lo?4:7,'#f4c41e',rot,1)}})}}
  else if(t==='cac'){const N=Math.round(66*(lo?.55:1)*(.6+.4*o2));for(let i=0;i<N;i++){const fr=(i+.5)/N,fo=Math.pow(fr,.85),a0=.22+1.3*fo*(.35+.65*o2);
      push(ligule(B,O,{phi:i*2.39996+rot,r0:R0*(.03+.17*fr),z0:R0*.36*(1-Math.pow(fr,1.4))*(.55+.45*o2),L:R0*(.26+.56*Math.pow(fr,.8))*(.75+.25*o2)*R(.9,1.08),W:R0*(.14+.09*fr),wp:M32_ZCAC,a0,a1:a0+.2+.3*fr*o2,pw:1.4,th:-1.5,thp:q=>sm01((q-.15)/.45),tip:'point',wav:.1,n:5,tw:R(-.6,.6)}),col(fr),fr)}}
  else{const rows=lo?2:3,rd=R0*.27,hd=R0*(.1+.1*o2);for(let w=0;w<rows;w++){const n=Math.round((15-2*w)*(lo?.85:1));for(let i=0;i<n;i++){const a0=.38+1.08*o2-.32*w;
      push(ligule(B,O,{phi:i/n*6.283+rot+w*.618*6.283/n+R(-.06,.06),r0:rd*(1-.08*w),z0:R0*.035*w,L:R0*(.68-.1*w)*R(.93,1.05),W:R0*(.21-.025*w),wp:M32_ZRAY,a0,a1:a0+.15+.08*o2,pw:1.3,th:.35,tip:'fringe',fr:2,fd:.12,wav:.06,n:5,tw:R(-.2,.2)}),col(1),1)}}
    if(nz>-.1&&o2>.08){const p0=PJ(B,O,[0,0,hd*.5]);it.push({z:nz>.2?p0[2]+R0:p0[2],fn:p=>{capDisc(p,B,O,rd,hd,cw.eye,{dots:lo?0:40,dc:shd(cw.eye,.3)});m32Stars(p,B,O,rd,hd,lo?12:20,'#f4c41e',rot)}})}}
  spPetals(k,it,{});return k}
/* a zinnia leaf: ovate-lanceolate, sessile and clasping, rough, three veins from its base */
function m32ZinLeaf(og,pos,len,col){return bzBlade(pos,og.H,og.U,len,.42,col,{wp:LS_OVATE,droop:.2,arch:.06,fold:.2,vn:3,va:.2,face:.45})}
function m32ZinPlant(g,t,o){const cw=o.cw||cwNear(M32_ZIN,o.col)||M32_ZIN[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||10)*UPC,k=G(g),sc=['#33522a','#55803c','#7aa45a','#acc88a'],bc='#5a7a3a';
  const r=lsHeadS(k,o,{D:D0,w:D0*.06,cols:sc,op,rr:.45,nodes:2,li:.62,lp:1.15,opp:1,leafAng:50,side:{p:.35,n:1,top:1,len:.36,ang:30,age:[0,.4]},budD:.3,budMax:.6,wig:.012,e:.015,aimK:.26,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){m32ScaleBud(par,B,O,D2*.22,cw.c,.2+op2,bc,'#2e2418');return}m32ZinFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>m32ScaleBud(par,B,O,s*.75,cw.c,a,bc,'#2e2418'),
    leaf:(og,pos)=>m32ZinLeaf(og,pos,D0*R(.62,.8),mix('#4f7a34','#3f6a2c',R(0,.5)))});
  l27StemDeco(k,r,D0*.45,{fur:D0*.016,furc:'#dfe6cc'});
  open(k,t,1000,10,.3);return r}
/* ---------- anemone-flowered dahlia (Dahlia × hortensis, anemone group): one or two rows of broad, flat, ovate rays round a raised cushion of tubular disc florets,
   longer than in a single, often in a contrasting colour; double involucre behind; hollow stem, opposite pinnate leaves, side buds ---------- */
const M32_DANE=[{id:'blue-bayou',n:'Lavande à coussin pourpre (Blue Bayou)',c:'#b7a6d8',cu:'#5e2a6e'},{id:'boogie-woogie',n:'Rose à coussin jaune (Boogie Woogie)',c:'#e88aae',cu:'#f2c84a'},
  {id:'totally-tangerine',n:'Mandarine à coussin rose (Totally Tangerine)',c:'#f29a5a',cu:'#e8849a',pt:'#f6c060'},{id:'mambo',n:'Rouge à coussin pourpre (Mambo)',c:'#c41f2e',cu:'#6a1428'},
  {id:'siemen-doorenbos',n:'Rose lilas à coussin crème (Siemen Doorenbos)',c:'#d9a3c4',cu:'#f0dcc0'},{id:'blanc',n:'Blanc à coussin crème',c:'#f7f4ee',cu:'#f0dca0'},
  {id:'creme',n:'Crème à coussin jaune',c:'#f3e6c4',cu:'#eec448'},{id:'pourpre',n:'Pourpre à coussin sombre',c:'#7a2a6e',cu:'#3e1032',pt:'#c86a9a'},
  {id:'rouge-jaune',n:'Rouge à coussin jaune',c:'#c8242a',cu:'#f0b832'},{id:'jaune',n:'Jaune à coussin orange',c:'#f4cc3a',cu:'#ec8a2a'}];
const M32_DARAY=prof([[0,.35],[.22,.85],[.55,1],[.85,.78],[1,.42]]);
/* the cushion: a dome, then every tubular floret as a small flared lip (body, lit lip, dark mouth): four paths for the whole crowd */
function m32Cushion(par,B,O,rc,hc,cu,n,pt){capDisc(par,B,O,rc,hc,cu,{dots:0});if(LOD)return;let db='',dl='',dd='',dm='';const lit=shd(cu,.14),dk=shd(cu,-.2);
  for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n),a=i*2.39996,x=Math.cos(a)*q*rc*.96,y=Math.sin(a)*q*rc*.96,z=hc*Math.sqrt(Math.max(0,1-q*q)),nr=V3.nz([x/(rc*rc),y/(rc*rc),z/(hc*hc)+.2/(hc*hc)]),nv=toV(B,nr);if(nv[2]<.04)continue;
    const r=rc*(.085+.05*q),b=PJ(B,O,V3.add([x,y,z],V3.sc(nr,rc*.03))),tp=PJ(B,O,V3.add([x,y,z],V3.sc(nr,rc*.11)));db+=m32Ell(b,r*.85,nv);
    const e=m32Ell(tp,r,nv);if(V3.dot(nv,LIGHT)>.35)dl+=e;else dd+=e;dm+=m32Ell(tp,r*.42,nv)}
  if(db)E('path',{d:db,fill:shd(cu,-.38)},par);if(dd)E('path',{d:dd,fill:dk,stroke:shd(cu,-.45),'stroke-width':.25,'stroke-opacity':.6},par);if(dl)E('path',{d:dl,fill:lit,stroke:shd(cu,-.35),'stroke-width':.25,'stroke-opacity':.5},par);
  if(dm)E('path',{d:dm,fill:pt||shd(cu,-.5),opacity:pt?.9:.75},par)}
function m32DaneFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,rc=R0*.42*(.7+.3*o2),hc=R0*.3*(.55+.45*o2);
  for(let w=0;w<2;w++){const n=w?7:11;for(let i=0;i<n;i++){const a0=.42+1.02*o2-.2*w+R(-.1,.1),l=ligule(B,O,{phi:i/n*6.283+rot+(w?.5/n*6.283*2:0)+R(-.06,.06),r0:rc*.82,z0:-R0*.02+R0*.03*w,L:R0*(w?.5:.66)*R(.94,1.05),W:R0*(w?.24:.29),wp:M32_DARAY,a0,a1:a0+.12+.3*o2,pw:1.5,th:.35,tip:'point',wav:.05,n:6,tw:R(-.15,.15)});
    const c=mix(cw.c,shd(cw.c,R(-.1,.06)),.5);it.push({l,c,cb:mix(c,'#e8e4d8',.22),lift:.22,mid:lo?null:shd(c,-.12),mw:.4,mo:.4})}}
  if(nz<.55){m32Phyl(B,O,8,{r0:R0*.18,z0:-R0*.06,L:R0*.34,W:R0*.12,a0:2.0,a1:2.6,tip:'point',wp:prof([[0,.6],[.4,1],[1,.1]])},'#3f6a2a','#24401a',it);
    m32Phyl(B,O,8,{ph:.4,r0:R0*.15,z0:-R0*.09,L:R0*.2,W:R0*.12,a0:2.5,a1:2.9,th:.8},'#6a8a4a','#3a5a28',it);it.push(l27Recep(B,O,R0*.22,R0*.13,'#4a7032'))}
  if(nz>-.12&&o2>.05){const p0=PJ(B,O,[0,0,hc*.5]);it.push({z:nz>.15?p0[2]+R0:p0[2],fn:p=>m32Cushion(p,B,O,rc,hc,cw.cu,Math.round((lo?46:90)*(.6+.4*o2)),cw.pt)})}
  spPetals(k,it,{});return k}
function m32DanePlant(g,t,o){const cw=o.cw||cwNear(M32_DANE,o.col)||M32_DANE[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||10)*UPC,k=G(g),sc=['#2a4420','#466c30','#6c9846','#a6c87c'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.055,cols:sc,op,rr:.6,nodes:rnd()<.4?2:1,li:.5,lp:1,opp:1,leafAng:58,side:{p:.55,n:2,top:1,len:.42,ang:36,age:[0,.3]},budD:.3,
    flower:(par,B,O,D2,op2)=>{if(op2<.33){dahliaBud(par,B,O,D2*.8,cw);return}m32DaneFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s)=>dahliaBud(par,B,O,s/.42,cw),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(.62,.82),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#3a6a2c',og.p.i>1?5:3,{w:.48,side:.3}))});
  open(k,t,1000,10,.3);return r}
/* ---------- cornflower (Centaurea cyanus): a head of enlarged, sterile marginal florets, each a slender tube flaring into a funnel cut in pointed lobes, spread round smaller inner florets
   (deeper coloured, dark anthers); the ovoid involucre of overlapping green phyllaries, each edged with a dark, silver-fringed comb; thin grey woolly stems, branched, many buds; linear grey leaves ---------- */
const M32_CYAN=[{id:'bleu',n:'Bleu vif (Blue Boy)',c:'#3f5bc8',in:'#2e2c7a'},{id:'bleu-ciel',n:'Bleu ciel (Blue Diadem)',c:'#5a7ed8',in:'#2e3a8a'},{id:'blanc',n:'Blanc (Snowman)',c:'#f4f4ee',in:'#d8d4e0',an:'#5a4a6a'},
  {id:'rose',n:'Rose (Pinkie)',c:'#e6a0bc',in:'#c0507a'},{id:'romantic',n:'Blanc à cœur rose (Classic Romantic)',c:'#f4eef0',in:'#d0507e'},{id:'lavande',n:'Lavande',c:'#b6a0d4',in:'#6a4a9a'},
  {id:'violet',n:'Violet pourpre',c:'#6a3a8a',in:'#3e1a58'},{id:'magic',n:'Violet à pointes blanches (Classic Magic)',c:'#6a54b4',tip:'#f2eef8',in:'#3a2470'},
  {id:'bordeaux',n:'Bordeaux (Red Boy)',c:'#8e1e3e',in:'#5a0e26'},{id:'noir',n:'Pourpre noir (Black Ball)',c:'#4a1028',in:'#2a0614'}];
const M32_CYF=prof([[0,.14],[.32,.26],[.6,.62],[.85,1],[1,1]]);
/* the involucre: an ovoid cup; its overlapping scales show as rows of dark arcs combed with silver hairs */
function m32CyInv(par,B,O,r,h,lo){const pts=[],rr=v=>r*(.3+.7*Math.sin(Math.PI*.5*Math.min(1,v*1.25))),drr=v=>(rr(Math.min(1,v+.04))-rr(Math.max(0,v-.04)))/(.08*h);
  for(let i=0;i<=6;i++)for(let j=0;j<12;j++){const v=i/6,a=j/12*6.283,p=PJ(B,O,[Math.cos(a)*rr(v),Math.sin(a)*rr(v),-h*(1-v)]);pts.push([p[0],p[1]])}
  E('path',{d:smooth(hull2(pts)),fill:budFill('#6a8a54'),stroke:'#2e3a24','stroke-width':.35,'stroke-opacity':.6},par);if(LOD)return;
  /* each scale: its tip a dark, rounded crescent, combed with a few silver hairs */
  let de='',dh='';const nr=lo?3:4,ns=lo?5:7;for(let j=0;j<nr;j++){const v=.2+.7*j/(nr-1),dz=drr(v);for(let i=0;i<ns;i++){const a=(i+.5*j)/ns*6.283,ca=Math.cos(a),sa=Math.sin(a);if(toV(B,V3.nz([ca,sa,-dz]))[2]<.1)continue;
    const top=[],bot=[];for(let m=0;m<=4;m++){const s2=-1+m/2,aa=a+s2*Math.PI/ns*.9,cv=1-s2*s2,vt=Math.min(1,v+.09*cv),vb=Math.min(1,v+.03*cv),pt=PJ(B,O,[Math.cos(aa)*rr(vt)*1.03,Math.sin(aa)*rr(vt)*1.03,-h*(1-vt)]),pb=PJ(B,O,[Math.cos(aa)*rr(vb)*1.02,Math.sin(aa)*rr(vb)*1.02,-h*(1-vb)]);top.push([pt[0],pt[1]]);bot.push([pb[0],pb[1]])}
    de+=pD(top.concat(bot.reverse()))+'Z';if(!lo)for(const m of[1,2,3]){const p=top[m],q=bot[4-m],dx=p[0]-q[0],dy=p[1]-q[1],l=Math.hypot(dx,dy)||1,hl=h*.06;dh+=`M${f(p[0])},${f(p[1])}l${f(dx/l*hl)},${f(dy/l*hl)}`}}}
  if(de)E('path',{d:de,fill:'#4a3a26',stroke:'#2a2016','stroke-width':.3,'stroke-linejoin':'round','stroke-opacity':.8},par);if(dh)E('path',{d:dh,stroke:'#e2e0d4','stroke-width':.3,'stroke-opacity':.75,fill:'none'},par)}
function m32CyFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,c=cw.c,ri=R0*.36,hi=R0*.62;
  if(nz<.8){const p0=PJ(B,O,[0,0,-hi*.5]);it.push({z:p0[2],fn:p=>m32CyInv(p,B,O,ri,hi,lo)})}
  /* the marginal funnels: an outer ring spread wide, an inner ring half raised */
  for(let w=0;w<2;w++){const n=Math.round((w?7:10)*(lo?.8:1));for(let i=0;i<n;i++){const a0=(w?.4:.85)+(w?.35:.5)*o2,cc=mix(c,shd(c,R(-.1,.08)),.5),
    l=ligule(B,O,{phi:i/n*6.283+rot+w*.45+R(-.08,.08),r0:R0*(w?.08:.15),z0:R0*(w?.14:.08),L:R0*(w?.5:.66)*R(.9,1.06),W:R0*(w?.24:.3),wp:M32_CYF,a0,a1:a0+.2+.1*o2,pw:1.3,th:2.2,thp:q=>1-.8*sm01((q-.35)/.6),tip:'fringe',fr:3,fd:.85,wav:.12,n:6,tw:R(-.3,.3)});
    it.push({l,c:cc,cb:mix(cc,'#e8e4ec',.15),lift:.25,basec:lo?null:mix(cw.in,cc,.35),bf:.4,bo:.75,tipc:cw.tip||null,tf:.66})}}
  /* the inner florets: a small domed tuft, deeper in colour, dotted with dark anthers */
  if(nz>-.2&&o2>.05){const p0=PJ(B,O,[0,0,R0*.16]);it.push({z:p0[2],fn:p=>capDisc(p,B,O,R0*.17,R0*.16,cw.in,{dots:lo?10:22,dc:cw.an||'#1e1428'})})}
  spPetals(k,it,{});return k}
function m32CyBud(par,B,O,s,cw,a){const k=G(par),r=s*.42,h=s;m32CyInv(k,B,O,r,h,LOD||DET<1.5);if(a>.35){const it=[];for(let i=0;i<5;i++)it.push({l:ligule(B,O,{phi:i/5*6.283+R(-.2,.2),r0:r*.2,z0:0,L:s*.25*a,W:r*.45,wp:M32_CYF,a0:.25,a1:.4,th:1.6,tip:'fringe',fr:2,fd:.7,n:3}),c:cw.c,lift:.3});spPetals(k,it,{})}
  else capDisc(k,B,O,r*.62,r*.25,'#6a8a54',{dots:0});return k}
function m32CyPlant(g,t,o){const cw=o.cw||cwNear(M32_CYAN,o.col)||M32_CYAN[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||3.5)*UPC,k=G(g),sc=['#44523c','#68785c','#8e9c80','#b8c4a8'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.05,cols:sc,op,rr:.5,nodes:3,li:.95,lp:2.1,opp:0,leafAng:34,side:{p:.85,n:1,top:3,len:1.7,ang:26,age:[0,.85]},budD:.42,budMax:.45,wig:.05,e:.05,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){m32CyBud(par,B,O,D2*.42,cw,op2*2);return}m32CyFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>m32CyBud(par,B,O,s,cw,a),young:(par,B,O,s,a)=>m32CyFlower(par,B,O,s*1.5,cw,.45+.55*a),
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,D0*R(1.1,1.5),.09,mix('#7f907a','#6a7e64',R(0,.5)),{wp:LS_LANCE,droop:.2,arch:.05,fold:.3,face:.4})});
  l27StemDeco(k,r,D0*.4,{fur:D0*.025,furc:'#e6e8e0'});
  open(k,t,1000,10,.3);return r}
/* ---------- pot marigold (Calendula officinalis): many narrow oblong rays with two or three small teeth, in two rows (singles) or five and more (doubles), orange, yellow, apricot or cream,
   some with a darker reverse or red-tipped ('Touch of Red', 'Indian Prince'); the disc brown or orange; one or two rows of narrow, glandular-hairy bracts;
   sticky angled stems, spatulate pale leaves clasping the stem ---------- */
const M32_CAL=[{id:'orange',n:'Orange à cœur brun (Pacific Beauty)',c:'#ef8a1a',c2:'#e87410',eye:'#5a2e12'},{id:'orange-king',n:'Orange à cœur orange (Orange King)',c:'#f07a10',c2:'#e86a0a',eye:'#d86a14'},
  {id:'jaune',n:'Jaune d’or (Pacific Beauty)',c:'#f5c02a',c2:'#f0a818',eye:'#6a3a14'},{id:'citron',n:'Jaune citron à cœur clair (Pacific Lemon)',c:'#f6d84a',c2:'#f2c830',eye:'#d0981c'},
  {id:'abricot',n:'Abricot (Sunset Buff)',c:'#f2b070',c2:'#ec9a5a',eye:'#6a3a1a'},{id:'saumon',n:'Saumon (Pink Surprise)',c:'#efa48a',c2:'#f0b860',eye:'#6a2e18'},
  {id:'creme',n:'Crème à cœur brun (Ivory Princess)',c:'#f2ead2',c2:'#f0dca8',eye:'#4e2a12'},{id:'bronze',n:'Orange au revers acajou (Indian Prince)',c:'#e8781a',back:'#8a2a14',eye:'#3e1a0c'},
  {id:'touch-red',n:'Orange à pointes rouges (Touch of Red)',c:'#f08a1a',tip:'#a8301a',eye:'#4a2210'},{id:'simple',n:'Orange simple',c:'#f08414',eye:'#5a2a10',sg:1},
  {id:'simple-jaune',n:'Jaune simple',c:'#f6c22a',eye:'#7a4416',sg:1}];
const M32_CRAY=prof([[0,.42],[.15,.82],[.5,1],[.9,.95],[1,.86]]),M32_SPAT=prof([[0,.22],[.3,.5],[.65,.92],[.85,1],[.96,.6],[1,.1]]);
function m32CalFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,sg=!!cw.sg,rd=R0*(sg?.3:.22),rows=sg?2:lo?3:5,hd=R0*(.05+.05*o2);
  for(let w=0;w<rows;w++){const s=rows>1?w/(rows-1):0,n=Math.round((sg?(w?13:16):24-8*s)*(lo?.8:1)),a0=(.3+1.18*o2)*(1-(sg?.15:.55)*s),Lk=sg?1-.12*w:1-.45*s;
    for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+w*.618*6.283/n+R(-.05,.05),r0:rd*(1-.12*s),z0:R0*.06*s,L:(R0-rd)*Lk*R(.9,1.06),W:R0*(.115-.02*s),wp:M32_CRAY,a0,a1:a0+.18*(1-s)+R(-.05,.08),pw:1.4,th:.3+.3*s,tip:'fringe',fr:2,fd:.22,wav:.06,n:6,tw:R(-.2,.2)}),
      c=mix(cw.c,cw.c2||shd(cw.c,-.1),R(0,.6));it.push({l,c,cb:cw.back||mix(c,'#e8d8b0',.25),lift:.2,tipc:cw.tip||null,tf:.66,mid:lo?null:shd(c,-.14),mw:.35,mo:.4})}}
  if(nz<.55){l27Bracts(B,O,lo?12:16,{r0:rd*.85,z0:-R0*.04,L:R0*.3,W:R0*.06,a0:2.05,a1:2.45},'#5f8a40',it);it.push(l27Recep(B,O,rd*1.02,R0*.12,'#5a8038'));const hz=PJ(B,O,[0,0,-R0*.14]);
    it.push({z:hz[2]+.01,fn:p=>l27Hairs(p,B,O,rd*.95,-R0*.08,lo?20:36,'#d8e0c4',R0*.04)})}
  if(nz>-.1&&o2>.05){const p0=PJ(B,O,[0,0,hd]);it.push({z:sg&&nz>.2?p0[2]+R0:p0[2],fn:p=>capDisc(p,B,O,rd*.98,hd,cw.eye,{dots:lo?14:40,dc:shd(cw.eye,h2l(cw.eye)[2]>.4?-.35:.35)})})}
  spPetals(k,it,{});return k}
function m32CalPlant(g,t,o){const cw=o.cw||cwNear(M32_CAL,o.col)||M32_CAL[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||6.5)*UPC,k=G(g),sc=['#3a5a2a','#5f8a40','#86ac62','#b4cc94'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.06,cols:sc,op,rr:.5,nodes:2,li:.75,lp:1.2,opp:0,leafAng:46,side:{p:.6,n:1,top:2,len:.7,ang:34,age:[0,.6]},budD:.36,budMax:.5,wig:.03,e:.035,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){m32ScaleBud(par,B,O,D2*.26,cw.c,.2+op2,'#5f8a40','#3a5a28');return}m32CalFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>m32ScaleBud(par,B,O,s*.7,cw.c,a,'#5f8a40','#3a5a28'),
    young:(par,B,O,s,a)=>m32CalFlower(par,B,O,s*1.1,cw,.4+.6*a),
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,D0*R(.95,1.25),.3,mix('#6a9a48','#5a8a3e',R(0,.5)),{wp:M32_SPAT,droop:.22,arch:.06,fold:.16,vn:3,va:.25,face:.4})});
  l27StemDeco(k,r,D0*.45,{fur:D0*.02,furc:'#e2ead0'});
  open(k,t,1000,10,.3);return r}
/* ---------- tickseed (Coreopsis grandiflora, C. lanceolata, C. tinctoria, C. verticillata): eight broad wedge-shaped rays, toothed at their square tip, round a small golden or dark disc;
   semi-double ('Early Sunrise') and double ('Sunray') in more rows; bicolours zoned maroon at the base (tinctoria, 'Sunfire'); the double involucre (narrow outer bracts, broad inner ones);
   thin, wiry, branched stems with several heads; opposite leaves cut in narrow lobes ---------- */
const M32_CORE=[{id:'or',n:'Jaune d’or (grandiflora)',c:'#f4c21a',eye:'#d09a18'},{id:'early-sunrise',n:'Jaune d’or semi-double (Early Sunrise)',c:'#f4c41a',eye:'#d8a018',r:2,blot:'#e89a14',bf:.3},
  {id:'sunray',n:'Jaune d’or double (Sunray)',c:'#f2c21e',eye:'#c89018',r:4},{id:'moonbeam',n:'Jaune soufre (Moonbeam)',c:'#f6dc6a',eye:'#d8b030',sm:1},
  {id:'sunfire',n:'Or à cœur rouge (Sunfire)',c:'#f2c01e',blot:'#a8281a',bf:.32,eye:'#7a3a14'},{id:'bicolore',n:'Jaune à cœur bordeaux (tinctoria)',c:'#f2c21e',blot:'#6a1a14',bf:.5,eye:'#4a1a10'},
  {id:'cuivre',n:'Orange cuivré à cœur acajou',c:'#e8902a',blot:'#7a2414',bf:.42,eye:'#4a1a10'},{id:'rubis',n:'Rouge rubis (Limerock Ruby)',c:'#b8283a',eye:'#5a1a14'},
  {id:'rouge',n:'Rouge cerise à cœur jaune (Mercury Rising)',c:'#a8203a',eye:'#e0b030'},{id:'creme',n:'Crème à cœur bordeaux',c:'#f6ecd0',blot:'#8a1a3a',bf:.3,eye:'#5a1a20'},
  {id:'rose',n:'Rose (rosea)',c:'#eca0c4',eye:'#e0b030',sm:1}];
const M32_KRAY=prof([[0,.28],[.25,.58],[.6,.88],[.9,1],[1,1]]);
function m32CorFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],rot=R(0,6.28),lo=DET<1.5||LOD,rows=Math.min(cw.r||1,lo?2:4),rd=R0*(cw.sm?.22:.2);
  for(let w=0;w<rows;w++){const s=rows>1?w/(rows-1):0,n=w?(cw.r>2?10:8):8,a0=.5+.98*o2-(cw.r>2?.75:.35)*s;
    for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+w*.5*6.283/n+R(-.05,.05),r0:rd*.95,z0:R0*.04*s,L:(R0-rd)*(1-(cw.r>2?.4:.18)*s)*R(.94,1.05),W:R0*(cw.sm?.27:.34)*(1-.22*s),wp:M32_KRAY,a0,a1:a0+.1+R(-.04,.06),pw:1.3,th:.18,tip:'fringe',fr:4,fd:.2,wav:.08,wk:3,n:6,tw:R(-.15,.15)});
      const c=mix(cw.c,shd(cw.c,R(-.1,.06)),.5);it.push({l,c,cb:mix(c,'#e8dcb0',.25),lift:.2,basec:cw.blot||null,bf:cw.bf||.38,bo:.92,tipc:cw.tip||null,tf:.62,mid:lo?null:shd(c,-.14),mw:.35,mo:.4})}}
  if(nz<.55){l27Bracts(B,O,8,{r0:rd*.85,z0:-R0*.04,L:R0*.26,W:R0*.05,a0:2.0,a1:2.25},'#4f7a34',it);m32Phyl(B,O,8,{ph:.4,r0:rd*.7,z0:-R0*.06,L:R0*.2,W:R0*.13,a0:2.45,a1:2.8},'#8a8a4a','#5a5a2a',it);it.push(l27Recep(B,O,rd*.95,R0*.1,'#56783a'))}
  if(nz>-.1&&o2>.05){const hd=R0*(.05+.05*o2),p0=PJ(B,O,[0,0,hd]);it.push({z:rows<3&&nz>.2?p0[2]+R0:p0[2],fn:p=>capDisc(p,B,O,rd,hd,cw.eye,{dots:lo?12:32,dc:shd(cw.eye,-.35)})})}
  spPetals(k,it,{});return k}
function m32CorPlant(g,t,o){const cw=o.cw||cwNear(M32_CORE,o.col)||M32_CORE[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||5)*UPC,k=G(g),sc=['#2e4a20','#4a7432','#6e9a48','#a4c47a'];
  const r=lsHeadS(k,o,{D:D0,w:D0*.035,cols:sc,op,rr:.5,nodes:2,li:1.1,lp:2.1,opp:1,leafAng:40,side:{p:.85,n:2,top:2,len:1.55,ang:30,age:[.05,1]},budD:.24,budMax:.4,wig:.05,e:.05,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*.22,cw.c,.2+op2,'#4f7a34');return}m32CorFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a,'#4f7a34'),
    young:(par,B,O,s,a)=>m32CorFlower(par,B,O,s*1.2,cw,.35+.65*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(.8,1.05),(par,x,y,a,l)=>cutLeaf(par,x,y,a,l,'#4a7a34',{np:1,lw:.14,ll:.55,teeth:1,la:34}))});
  open(k,t,1000,10,.3);return r}
Object.assign(GH,{'zinnia':m32ZinPlant,'dahlia-anemone':m32DanePlant,'bleuet':m32CyPlant,'souci-calendula':m32CalPlant,'coreopsis':m32CorPlant});
Object.assign(CWS,{'zinnia':M32_ZIN,'dahlia-anemone':M32_DANE,'bleuet':M32_CYAN,'souci-calendula':M32_CAL,'coreopsis':M32_CORE});
Object.assign(SZG,{'zinnia':[5,7,9,10,12],'dahlia-anemone':[8,9,10,12],'bleuet':[2.5,3,3.5,4],'souci-calendula':[5,6,6.5,8],'coreopsis':[3.5,4,5,6]});
Object.assign(GHI,{'zinnia':{form:'disque',size:2.2,k:'head',rk:1},'dahlia-anemone':{form:'disque',size:2.2,k:'head',rk:1},'bleuet':{form:'disque',size:1.2,k:'head',rk:1},
  'souci-calendula':{form:'disque',size:1.7,k:'head',rk:1},'coreopsis':{form:'disque',size:1.5,k:'head',rk:1}});
for(const id of['zinnia','dahlia-anemone','bleuet','souci-calendula','coreopsis']){GH_BUDS.add(id);if(STEML[id])STEML[id]=Object.assign({},STEML[id],{n:[0,1]})}
