/* ================= Serre, lot 94 — immortelles 2 et feuille séchée : xéranthème, ammobium, acroclinium (Rhodanthe), feuille de strelitzia séchée ================= */
/* les capitules papyracés partagent un moteur (l94Cap : écailles de l'involucre, rangs de bractées colorées qui s'ouvrent de l'extérieur vers le centre, disque) ;
   xéranthème et acroclinium poussent par lsHeadS (rameaux latéraux en bouton ou jeune fleur), l'ammobium en corymbe ramifié à tiges ailées, la feuille séchée par t34Plant (lot 34) */
/* ---------- shared: a papery capitulum. S.inv: the involucre's scales (a cup under the head); S.rows: rows of coloured bracts from the outside in, each {n,L,W,r0,z0,cl:[a0,a1] closed,
   op:[a0,a1] open}; they open from the outside in; closed, the inner rows meet over the top (a pointed or round bud); S.disc {r,h,c,dc,ring} the eye, perhaps in a dark ring ---------- */
const L94_AC=prof([[0,.4],[.2,.82],[.5,1],[.78,.72],[1,.1]]),L94_BR=prof([[0,.45],[.25,.9],[.55,1],[.85,.62],[1,.12]]),L94_SC=prof([[0,.75],[.4,1],[.8,.8],[1,.25]]);
function l94Cap(par,B,O,D0,cw,op,S){const k=G(par),o2=sm01((op-.08)/.92),R0=D0/2*(S.grow?(.6+.4*o2):1),nz=B[2][2],lo=DET<1.5||LOD,it=[],rot=R(0,6.28),iv=S.inv,rws=lo&&S.rows.length>2?[S.rows[0],S.rows[S.rows.length-1]]:S.rows,nr=rws.length;
  /* light detail: the involucre hidden behind an open head seen from the front is left out, and it keeps fewer scales */
  if(iv&&!(lo&&nz>.6&&o2>.5))for(let r=0;r<(lo?Math.min(2,iv.rows):iv.rows);r++){const n=Math.round(iv.n*(lo?.6:1));for(let i=0;i<n;i++){const fr=iv.rows>1?r/(iv.rows-1):0,l=ligule(B,O,{phi:i/n*6.283+rot+r*.39+R(-.06,.06),r0:R0*iv.r0*(.45+.55*fr),z0:-R0*iv.z0*(1-.55*fr),L:R0*iv.L*(1-.25*fr),W:R0*iv.W,wp:L94_SC,
      a0:iv.a0+(iv.a0o-iv.a0)*o2*.6-fr*.35,a1:iv.a1+(iv.a1o-iv.a1)*o2-fr*.15,pw:1,th:.6,tip:'round',n:4});it.push({l,c:mix(iv.c,shd(iv.c,R(-.08,.05)),.5),ink:shd(iv.c,-.35),edge:iv.tip,ew:2,ewd:Math.max(.7,R0*.05),mid:lo?null:iv.m,mw:Math.max(.5,R0*.03),noov:1})}}
  for(let r=0;r<nr;r++){const w=rws[r],fr=nr>1?r/(nr-1):0,ow=sm01(o2*1.45-fr*.45),n=Math.round(w.n*(lo?.75:1)),c=w.c||cw.c;
    const a0=w.cl[0]+(w.op[0]-w.cl[0])*ow,a1=w.cl[1]+(w.op[1]-w.cl[1])*ow,L=R0*w.L*((S.lb??.82)+(1-(S.lb??.82))*ow)*R(.96,1.03);
    for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+r*.47+R(-.05,.05),r0:R0*w.r0,z0:R0*w.z0,L:L*R(.94,1.05),W:R0*w.W,wp:w.wp||L94_BR,a0:a0+R(-.04,.04),a1:a1+R(-.05,.05),pw:1.25,th:w.th??.7,tip:w.rb||(w.rt&&ow<.4)?'round':'point',n:5,tw:R(-.18,.18)});
      it.push({l,c:mix(c,shd(c,R(-.1,.08)),.55),ink:w.ink||(h2l(c)[2]>.8?shd(c,-.42):null),mid:lo&&r<nr-1?null:lt(c,.55),mw:Math.max(.5,R0*.03),edge:cw.edge,ew:3,ewd:Math.max(.6,R0*.05),noov:lo})}}
  drawLig(k,it,{back:S.back||'#e2dccb'});
  /* a bud seen from above: the tips of the inner bracts meet over a little boss of their own colour */
  if(o2<.32&&nz>.25){const w=rws[nr-1];capDisc(k,B,V3.add(O,toV(B,[0,0,R0*(w.z0+w.L*.62)])),R0*.14,R0*.07,mix(cw.c,shd(cw.c,-.15),.5),{dots:0})}
  if(nz<0)capBack(k,B,O,R0*(S.bk||.2),S.bkc||'#b8b098');
  const d=S.disc;if(d&&nz>-.2&&o2>.35){if(d.ring)capDisc(k,B,O,R0*d.r*1.5,R0*d.h*.45,d.ring,{dots:0});capDisc(k,B,O,R0*d.r,R0*d.h*(.6+.4*o2),d.c,{dots:lo?0:d.dots||30,dc:d.dc||shd(d.c,-.45)})}
  return k}
/* the colourway asked for (a product's exact colour, else the nearest) */
const l94Cw=(list,o)=>o.cw||list.find(w=>w.c===o.col)||cwNear(list,o.col)||list[0],l94Op=o=>Math.max(.05,Math.min(1,o.op??1));
/* ---------- annual everlasting (Xeranthemum annuum): a narrow cup of silvery, straw-like, imbricate involucral scales, the inner ones lengthened into 12 to 25 glossy papery
   « rays », lanceolate, spreading at 45 to 70°, violet, pink, lilac or white, round a small disc of a few pale florets; double strains ('Superbissimum') carry more rows.
   Buds pointed, silvery with a coloured tip; thin wiry stems, silvery-woolly, branched, each branch ending in one head; a few linear-lanceolate grey leaves ---------- */
const CW_L94XE=[{id:'violet',n:'Violet',c:'#7c4a9a'},{id:'pourpre',n:'Pourpre',c:'#6a2a72'},{id:'lilas',n:'Lilas',c:'#b99ad4'},{id:'mauve',n:'Mauve rosé',c:'#c890c0'},{id:'rose',n:'Rose',c:'#e09ac0'},
  {id:'rose-vif',n:'Rose vif',c:'#cc5a9c'},{id:'blanc',n:'Blanc argenté',c:'#efede6'},{id:'double-violet',n:'Violet double (Superbissimum)',c:'#82489e',dbl:1},{id:'double-rose',n:'Rose double (Superbissimum)',c:'#d98abb',dbl:1},
  {id:'double-blanc',n:'Blanc double (Superbissimum)',c:'#f1efe8',dbl:1}];
function l94XerHead(par,B,O,D0,cw,op){const dbl=cw.dbl,rows=[{n:dbl?14:16,L:.7,W:.11,r0:.2,z0:.02,cl:[.16,-.32],op:[1.02,1.2],rb:0}];
  if(dbl)rows.push({n:13,L:.6,W:.1,r0:.16,z0:.06,cl:[.12,-.42],op:[.7,.9]},{n:10,L:.46,W:.09,r0:.11,z0:.1,cl:[.08,-.5],op:[.42,.6]});else rows.push({n:9,L:.56,W:.1,r0:.15,z0:.06,cl:[.1,-.45],op:[.62,.86]});
  return l94Cap(par,B,O,D0,cw,op,{inv:{rows:3,n:12,r0:.21,z0:.34,L:.32,W:.085,a0:1,a0o:1.15,a1:-.15,a1o:.15,c:'#d2cfc0',m:'#b4ac90',tip:mix('#d2cfc0',cw.c,.35)},rows,lb:.42,back:mix(cw.c,'#e8e2d0',.4),bk:.22,bkc:'#c8c2aa',
    disc:dbl?null:{r:.16,h:.09,c:mix(cw.c,'#ece0c8',.55),dots:14,dc:shd(cw.c,-.3)}})}
function l94Xer(g,t,o){const cw=l94Cw(CW_L94XE,o),op=l94Op(o),D0=(o.cm||3.2)*UPC,k=G(g),sc=['#4a5244','#6c7464','#949c8a','#c4cabb'];
  const r=lsHeadS(k,o,{D:D0,w:Math.max(1.15,D0*.055),cols:sc,op,rr:.5,nodes:3,li:1.1,lp:2.2,opp:0,leafAng:34,side:{p:.85,n:1,top:3,len:2.1,ang:24,age:[0,1]},budD:.42,budMax:.42,wig:.03,e:.035,aimK:.2,
    flower:(par,B,O,D2,op2)=>l94XerHead(par,B,O,D2,cw,op2),bud:(par,B,O,s,a)=>l94XerHead(par,B,O,s*2.1,cw,.04+.2*a),young:(par,B,O,s,a)=>l94XerHead(par,B,O,s*1.6,cw,.35+.65*a),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),D0*R(1.1,1.5),.13,'#8a9480',pp,{wp:LS_LANCE,droop:.2,arch:.05,fold:.3,face:.4});return pp}});
  open(k,t,1000,10,.3);return r}
/* ---------- winged everlasting (Ammobium alatum): a loose corymb of small heads (1.5 to 2.5 cm) of several rows of white, papery, pointed bracts round a broad yellow disc
   that darkens to brown as it ages; buds globular, silvery; the stems stiff, branched, edged by two broad green wings running down from the leaves; leaves few, lanceolate ---------- */
const CW_L94AM=[{id:'blanc',n:'Blanc (cœur jaune)',c:'#f6f4ec'},{id:'blanc-argent',n:'Blanc argenté (Bikini)',c:'#eceae0'},{id:'creme',n:'Crème',c:'#f2ead2'}];
function l94AmHead(par,B,O,D0,cw,age){const o2=sm01((age-.3)/.7),dc=mix('#e8c030','#8a5a26',sm01((age-.85)/.15)*.8);
  return l94Cap(par,B,O,D0,cw,age,{inv:{rows:2,n:9,r0:.22,z0:.24,L:.3,W:.13,a0:1.1,a0o:1.3,a1:.1,a1o:.5,c:'#ddd8c4',m:null},
    rows:[{n:13,L:.6,W:.17,r0:.32,z0:0,cl:[.3,-.6],op:[1.42,1.56],rb:1,th:.5},{n:11,L:.5,W:.16,r0:.3,z0:.04,cl:[.2,-.75],op:[1.2,1.4],rb:1,th:.5},{n:9,L:.4,W:.14,r0:.28,z0:.08,cl:[.12,-.9],op:[.9,1.15],rb:1,th:.5}],
    back:'#e6e2d6',bk:.3,bkc:'#c8c4b0',disc:{r:.36,h:.17*(.7+.3*o2),c:dc,dots:24,dc:shd(dc,-.45)}})}
function l94Wings(chains,Fr,ww,col,parts){const P=pal7(col);for(const ch of chains){const n=ch.pts.length;if(n<3)continue;const w0=ww*(ch.ord?.7:1);
    for(const sg of[1,-1]){const inner=[],outer=[];let z=0,nr=[0,0,0];
      for(let i=0;i<n;i++){const a=ch.pts[Math.max(0,i-1)],b=ch.pts[Math.min(n-1,i+1)],T=V3.nz(V3s(b,a));let F=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));F=V3l(F)>1e-3?V3.nz(F):fgCross(T)[0];const S=V3.nz(V3.cr(T,F)),
          t=i/(n-1),w=w0*Math.min(1,.35+t*3)*Math.min(1,(1-t)*4+.25),p=ch.pts[i],q=V3.add(p,V3.sc(S,sg*(w+ch.ws[i]*.45)));inner.push(fgQ(p));outer.push(fgQ(q));z+=q[2];const nn=V3.cr(T,S);for(let j=0;j<3;j++)nr[j]+=nn[j]}
      nr=V3.nz(nr);const c=toneAt(P,lightI(nr[2]>=0?nr:V3.sc(nr,-1))*.8+.15),pts=inner.concat(outer.reverse());parts.push({z:z/n-.5,cast:false,fn:par=>E('path',{d:fgD(pts),fill:c,stroke:P.d1,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},par)})}}}
function l94Amm(g,t,o){const cw=l94Cw(CW_L94AM,o),op=l94Op(o),Hs=(o.cm||25)*UPC*(o.rim?.4:1),dh=2*UPC,k=G(g),sc=['#3e5a2e','#5e7c44','#82a062','#b2c896'];
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.3,B.reach*.45/(Hs*.45))):1,L=Hs*kr,nb=o.rim?2:Math.round(R(3,5)),pOpen=op<.3?.12:op<.7?.5:.75,
    age=()=>rnd()<pOpen?R(.55,1):R(0,op<.3?.3:.45),hd=a=>[a>.4?'K':'Kb',{age:a}],wm=w=>Math.max(1.15,w);
  /* S: the bare stem; B(i): the main axis, a branch at each node (shorter toward the top), the terminal head; C: a branch, one or two pedicels along it, its own head */
  const rules={S:()=>[['F',{l:L*.38,w0:wm(dh*.16),w1:wm(dh*.13),e:.012}],['B',{i:0}]],
    B:p=>{if(p.i>=nb)return[['F',{l:L*.07,w1:wm(dh*.08),aim:up,k:.15}],['Ap',{}],['F',{l:L*.05,w1:wm(dh*.07)}],['K',{age:Math.max(.5,age()),main:1}]];const q=p.i/nb,bl=L*(.36-.18*q)*R(.85,1.15);
      return[['F',{l:L*(.32/nb)*R(.85,1.15),w1:wm(dh*(.13-.04*q))}],['Lv',{s:1}],['[',{w:wm(dh*(.08-.02*q))}],['/',{a:137.5*p.i+R(-20,20)}],['&',{a:R(26,40)}],['C',{l:bl,n:rnd()<.5?1:2}],[']',{}],['B',{i:p.i+1}]]},
    C:p=>{const out=[],m=p.n;for(let j=0;j<m;j++)out.push(['F',{l:p.l/(m+1),w1:wm(dh*.06),e:.04}],...(rnd()<.45?[['Lv',{s:.45}]]:[]),['[',{w:wm(dh*.05)}],['/',{a:(j%2?100:-100)+R(-25,25)}],['&',{a:R(26,40)}],['F',{l:dh*R(1.4,2.6),w1:wm(dh*.045),e:.04}],hd(age()),[']',{}]);
      out.push(['F',{l:p.l/(m+1),w1:wm(dh*.05),e:.03}],hd(age()));return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,nb+4),{p:[0,0,0],H:up,U:U0,wig:.035,seg:dh*.5,T:[0,1,0],e:.015,w:wm(dh*.16)});for(const ch of res.chains)ch.c=sc;
  const ap=res.organs.find(q=>q.t==='Ap'),apex=ap.pos,ci=lsCut(res,apex),c0=res.chains[0],off=V3s([0,0,0],apex),sh=ch=>({pts:ch.pts.map(q=>V3.add(q,off)),ws:ch.ws,ord:ch.ord}),
    wl=[],wh=[],Fr=V3.nz(V3.add(face,[0,.2,0]));l94Wings([sh({pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1),ord:0})],Fr,dh*.14,'#7c9a5c',wl);
  l94Wings([sh({pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),ord:0})].concat(res.chains.slice(1).map(sh)),Fr,dh*.14,'#7c9a5c',wh);
  res.organs.push({t:'Wl',p:{},pos:apex,H:up,U:U0,L:V3.cr(U0,up),w:1,ord:0},{t:'Wh',p:{},pos:apex,H:up,U:U0,L:V3.cr(U0,up),w:1,ord:0});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:8,organ:(og,pos)=>{
    if(og.t==='Wl')return{ext:1,parts:wl};if(og.t==='Wh')return{parts:wh};
    if(og.t==='K'){const Bf=faceFrame(og,face,.6),s=dh*R(.9,1.12)*(og.p.main?1.12:1);return{parts:[{z:pos[2],fn:par=>l94AmHead(par,Bf,pos,s,cw,og.p.age)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,0),s=dh*(.9+.3*og.p.age);return{parts:[{z:pos[2],fn:par=>l94AmHead(par,Bf,pos,s,cw,.04+og.p.age*.5)}]}}
    if(og.t==='Lv'){const s=og.p.s,sd=rnd()<.5?1:-1,H=V3.nz(V3.add(og.H,V3.sc(og.L,sd*1.1))),len=dh*R(1.3,1.9)*s;return{ext:s>.8,parts:[lsLeaf2D(Object.assign({},og,{H}),pos,len,(par,x,y,a,l)=>astLeaf(par,x,y,a,l,'#5a7a40'))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* ---------- pink paper daisy (Rhodanthe chlorocephala subsp. rosea, syn. Acroclinium roseum; and R. manglesii): a cup of four to six rows of broad, pointed, glossy papery bracts,
   pink (paler or whitish at the base) or white, round a yellow disc; in some strains ('Pierrot', 'Red Bonnie') the inner bracts are stained black-purple at the base, a dark ring
   round the eye. Buds ovoid and pointed, silvery scales tipped with pink, nodding before they open; slender erect stems, little branched; linear grey-green leaves ---------- */
const CW_L94AC=[{id:'rose',n:'Rose',c:'#e47aa4'},{id:'rose-pale',n:'Rose pâle',c:'#f2c6d5'},{id:'carmin',n:'Rose carmin',c:'#c8366c'},{id:'blanc',n:'Blanc',c:'#f6f4ee'},
  {id:'pierrot',n:'Blanc à cœur noir (Pierrot)',c:'#f4f2ec',ring:'#2a1a1e'},{id:'rose-coeur-noir',n:'Rose à cœur noir (Red Bonnie)',c:'#de6e9a',ring:'#2e1420'},{id:'mix-saumon',n:'Rose saumoné',c:'#eda09a'}];
function l94AcHead(par,B,O,D0,cw,op){const pale=mix(cw.c,'#f8f4ec',.45),rows=[];for(let r=0;r<4;r++){const w=r/3;rows.push({n:Math.round(12-2.5*w),L:.64-.18*w,W:.3-.06*w,r0:.25-.04*w,z0:.03+.04*w,
    c:mix(cw.c,pale,(1-w)*.25),cl:[.14-.04*w,-.62-.12*w],op:[1.18-.52*w,1.34-.42*w],th:.55,wp:L94_AC,rb:1})}
  return l94Cap(par,B,O,D0,cw,op,{inv:{rows:3,n:11,r0:.2,z0:.34,L:.34,W:.1,a0:.95,a0o:1.15,a1:-.2,a1o:.2,c:'#d8d4c8',m:mix('#b8aca0',cw.c,.2),tip:mix('#d8d4c8',cw.c,.6)},rows,lb:.4,back:mix(cw.c,'#ece6dc',.35),bk:.24,bkc:'#c6c2b2',
    disc:{r:.27,h:.14,c:'#e8b828',dots:30,dc:'#9a6a14',ring:cw.ring}})}
function l94Acr(g,t,o){const cw=l94Cw(CW_L94AC,o),op=l94Op(o),D0=(o.cm||3.5)*UPC,k=G(g),sc=['#3e5238','#5e7458','#84987a','#b4c4a8'];
  const r=lsHeadS(k,o,{D:D0,w:Math.max(1.2,D0*.055),cols:sc,op,rr:.5,nodes:2,li:1.1,lp:2,opp:0,leafAng:30,side:{p:.85,n:1,top:2,len:1.7,ang:22,age:[0,.9]},budD:.42,budMax:.45,wig:.03,e:.035,aimK:.2,
    flower:(par,B,O,D2,op2)=>l94AcHead(par,B,O,D2,cw,op2),bud:(par,B,O,s,a)=>l94AcHead(par,B,O,s*1.9,cw,.04+.2*a),young:(par,B,O,s,a)=>l94AcHead(par,B,O,s*1.55,cw,.35+.65*a),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),D0*R(1.2,1.6),.1,'#7a8c6c',pp,{wp:LS_LANCE,droop:.22,arch:.05,fold:.3,face:.4});return pp}});
  open(k,t,1000,10,.3);return r}
/* ---------- dried bird-of-paradise leaf (Strelitzia reginae, dried and preserved): the paddle dried hard and papery, its margins rolled in toward the midrib, the blade curled back
   and twisted, split into strips along its parallel veins; natural brown, beige or bleached, also dyed; the long channelled petiole dried the colour of straw ---------- */
const CW_L94SL=[{id:'naturel',n:'Naturel brun',c:'#94744c',b:'#b89a72'},{id:'beige',n:'Beige',c:'#c9b08a',b:'#ddc8a6'},{id:'blanchi',n:'Blanchi',c:'#ece5d6',b:'#f6f1e6'},
  {id:'dore',n:'Doré',c:'#c9a24b',b:'#dcc07a'},{id:'rose-poudre',n:'Rose poudré (teint)',c:'#d6a497',b:'#e6c0b4'},{id:'vert',n:'Vert (stabilisé)',c:'#5f8a4f',b:'#8aa878'},{id:'turquoise',n:'Turquoise (teint)',c:'#5ab3ae',b:'#8ccac4'}];
function l94Strel(g,t,o){const cw=l94Cw(CW_L94SL,o),tears=[];for(const s of[-1,1]){let v=.08+R(0,.08);while(v<.9){if(rnd()<.8)tears.push({s,v,d:R(.55,1)});v+=R(.06,.13)}}
  const wp=(v,s)=>{let w=T34_STR(v);for(const q of tears)if(q.s===s){const x=Math.abs(v-q.v-.02)/.028;if(x<1)w*=1-q.d*(1-x)}return Math.max(.012,w)},rl=R(.42,.62),sd=rnd()<.5?-1:1;
  return t34Plant(g,t,o,{cm0:45,pet:60,pc:mix(cw.c,'#a88a5e',.5),w0:5.6,w1:4.2,arch:R(-.08,.08),wig:.006,blade:(og,len,op,parts)=>{
    t34Blade(og,len*.94,cw.c,cw.b,{wp,wr:.34,th0:-.3,ka:-R(.75,1.05),droop:.05,fold:.2,tw:sd*R(.7,1.1),wave:.04,nw:3,roll:rl,nv:44,nu:7,gl:.08,shin:10,across:1.1,
      veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(1.2,len*.013),c:mix('#e8dcc0',cw.c,.45),o:.75},...t34Pin(16,.05,.9,.12,.97).map(q=>({pts:q}))],vo:.32,
      paint:(gg,c,S,P)=>{let d='';for(const q of tears){if(!t34In(c,q.v))continue;const u0=1-q.d;d+=t34L(S,[[q.s*u0,q.v+.02-.05*q.d],[q.s*(u0+1)/2,q.v+.02-.025*q.d],[q.s,q.v+.02]])}
        if(d)E('path',{d,stroke:P.d2,'stroke-width':.8,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},gg)}},parts)}})}
l94Strel.bigLeaf={ext:14,k0:12};
/* ---------- registers ---------- */
Object.assign(GH,{'xeranthemum':l94Xer,'ammobium':l94Amm,'acroclinium':l94Acr,'feuille-strelitzia-sechee':l94Strel});
Object.assign(CWS,{'xeranthemum':CW_L94XE,'ammobium':CW_L94AM,'acroclinium':CW_L94AC,'feuille-strelitzia-sechee':CW_L94SL});
/* commercial grades: the head (xeranthemum, acroclinium), the spray's height (ammobium), the blade's length (dried leaf) */
Object.assign(SZG,{'xeranthemum':[2.5,3,3.2,3.5,4],'ammobium':[20,25,25,30],'acroclinium':[3,3.5,3.5,4,5],'feuille-strelitzia-sechee':[35,45,55]});
Object.assign(GHI,{'xeranthemum':{form:'disque',size:1.4,k:'head',rk:.9},'ammobium':{form:'grappe',size:2.2,k:'head',rk:.5},'acroclinium':{form:'disque',size:1.5,k:'head',rk:.95}});
for(const id of['xeranthemum','ammobium','acroclinium'])GH_BUDS.add(id);
