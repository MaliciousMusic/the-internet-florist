/* ================= Serre, lot 67 — printemps 6, poussés par le L-système : lilas, iris barbu, fritillaire impériale, camassia, ornithogale ================= */
/* le lilas pousse comme la boule de neige (lot 41) : un rameau ligneux, des paires de feuilles en cœur, les thyrses coniques au bout ; la couronne impériale comme le cyrtanthus (ombelle pendante) ;
   l'iris barbu comme l'iris de Hollande (lot 22), ramifié ; camassia et ornithogale comme l'eremurus (lot 41), les étoiles dessinées par bandes de l'épi */
const l67Q=p=>[p[0],-p[1]],l67C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a cached tone of a colour lit at I (0..1, in 15 steps) */
const l67T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),k=c+'|'+q;return cache[k]||(cache[k]=toneAt(pal7(c),q/14))};
/* the frame of a head: up its axis, turned toward the eye (as l41Fr) */
const l67Fr=(Z,Yh,roll=0)=>l41Fr(Z,Yh,roll);

/* ---------- common lilac (Syringa vulgaris 'Ruhm von Horstenstein', 'Madame Florent Stepman', 'Charles Joly', 'Sensation', 'Président Grévy'…): a woody shoot, grey-brown,
   its leaves in opposite decussate pairs, broadly heart-shaped and pointed, smooth, on long petioles; at the tip a pair of dense conical panicles (thyrses), the larger one leading,
   of hundreds of small fragrant flowers: a slender tube opening into four spreading, hooded lobes (doubles: a second whorl of lobes inside); the buds round, deeper in colour;
   the panicle opens from its base, its tip still in bud. Drawn as the snowball's ball: florets laid on a lumpy cone and drawn far to near, in a few paths by depth ---------- */
const L67_LIL=[{id:'lilas',n:'Lilas mauve (Ruhm von Horstenstein)',c:'#b58ccc',bud:'#7a4a9a'},{id:'blanc',n:'Blanc (Madame Florent Stepman)',c:'#f6f4ec',bud:'#dfe4c4'},
  {id:'pourpre',n:'Pourpre (Andenken an Ludwig Späth)',c:'#7a3a86',bud:'#4e1a5e'},{id:'pourpre-double',n:'Pourpre double (Charles Joly)',c:'#8a3a7e',bud:'#561c50',dbl:1},
  {id:'lavande',n:'Bleu lavande double (Président Grévy)',c:'#a99ad8',bud:'#6a5aa8',dbl:1},{id:'lilas-double',n:'Lilas double (Michel Buchner)',c:'#c3a2d6',bud:'#8a5aa8',dbl:1},
  {id:'rose',n:'Rose (Lucie Baltet)',c:'#e8b6cc',bud:'#b86a8a'},{id:'sensation',n:'Pourpre liseré de blanc (Sensation)',c:'#8a4a96',bud:'#5a2268',edge:'#f4eef4'},
  {id:'blanc-double',n:'Blanc double (Madame Lemoine)',c:'#f7f5ee',bud:'#e6ead0',dbl:1}];
/* a heart-shaped leaf on the screen at (x,y) along ang: a long petiole, a cordate base, a broad blade tapering to a drawn-out point; foreshortened across by face */
function l67Heart(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.22,o.face??.7),pl=len*.24,bl=len-pl,bd=o.bend??0;
  /* half outline, from the sinus round the basal lobe to the tip: (along, across) in blade lengths */
  const H=[[.06,0],[-.04,.12],[-.03,.3],[.06,.44],[.22,.5],[.42,.46],[.62,.32],[.8,.16],[.92,.06],[1,0]],pt=(q,s)=>{const u=q[0],bx=pl+bl*u,by=s*bl*q[1]*ct+bd*bl*u*u;return[bx,by]};
  const up=H.map(q=>pt(q,1)),dn=H.map(q=>pt(q,-1)).reverse(),out=up.concat(dn.slice(1,-1));
  E('path',{d:`M0,0Q${f(pl*.5)},${f(bd*pl*.1)} ${f(pl+bl*.05)},0`,stroke:shd(col,-.28),'stroke-width':f(Math.max(1.1,len*.028)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:smooth(out),fill:toneAt(P,o.I??.62),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
  if(!LOD){const mid=[[.04,0],[.35,0],[.7,0],[1,0]].map(q=>pt(q,0));E('path',{d:smooth(up.concat(mid.slice().reverse())),fill:P.d1,opacity:.33},g);
    let d=smooth(mid,false);for(const[u,v]of[[.12,.3],[.3,.34],[.5,.28]])for(const s of[-1,1]){const a=pt([u,0],0),b=pt([u+.22,v],s);d+=`M${f(a[0])},${f(a[1])}Q${f((a[0]+b[0])/2)},${f(a[1]+(b[1]-a[1])*.35)} ${f(b[0])},${f(b[1])}`}
    E('path',{d,stroke:P.l1,'stroke-width':f(Math.max(.4,len*.011)),'stroke-opacity':.55,fill:'none'},g)}return g}
/* the panicle: a lumpy cone Lp long (local Z its axis, base at O), its florets far to near in groups of a few (one path each), over a dark core; op: bud … open from the base */
function l67Pan(par,B,O,Lp,cw,op,cache){const k=G(par),sd=((O[0]*.13+O[1]*.29)%6+6)%6,dbl=!!cw.dbl,det=DET>=1.5,gr=.6+.4*sm01(op/.8),L=Lp*gr,Rb=L*.3;
  const rr=v=>Rb*(v<.2?Math.pow(Math.sin(v/.2*1.5708),.55):Math.pow(Math.max(0,(1-v)/.8),.78)),drr=v=>(rr(Math.min(1,v+.01))-rr(Math.max(0,v-.01)))/.02;
  /* the open band climbs: below thr the florets are open, a few opening at its edge, buds above */
  const thr=op<.28?-.1:op<.85?(op-.28)/.57*.92:1.08,N=Math.round((det?150:96)*(LOD?.5:1)*Math.min(1.2,Math.pow(L/(16*UPC),1.1))),s0=Rb*(det?.3:.36)*(N<60?1.2:1);
  const cum=[0];for(let j=1;j<=40;j++)cum.push(cum[j-1]+rr((j-.5)/40));const vOf=u=>{const x=u*cum[40];let j=1;while(j<40&&cum[j]<x)j++;return(j-1+(x-cum[j-1])/((cum[j]-cum[j-1])||1))/40};
  const pts=[],hull=[];
  for(let i=0;i<N;i++){const v=Math.min(.985,vOf((i+.5)/N)),az=i*2.39996+sd,lump=1+.15*Math.sin(az*3+v*9+sd)+.07*Math.sin(az*5-v*13),r=rr(v)*lump,
      n0=V3.nz([Math.cos(az),Math.sin(az),-drr(v)/L*.9]),p=[Math.cos(az)*r,Math.sin(az)*r,v*L],nv=V3.nz(toV(B,n0)),P=PJ(B,O,p);hull.push([P[0],P[1]]);if(nv[2]<-.3)continue;
    const age=v<thr-.06?1:v<thr?.5:0,s=s0*(age?1:.42+.25*Math.min(1,(v-thr)*-1+1))*(1-.35*v)*R(.88,1.12);pts.push({v,n0,nv,p,z:P[2],s,age,rot:R(0,6.28)})}
  /* the core: the hull of the cone, mid-dark, then shrunk and darker, so florets seen edge-on at the rim always sit on something; it runs down to the peduncle */
  const p0=PJ(B,O,[0,0,0]);hull.push([p0[0],p0[1]]);const h=hull2(hull);let cx=0,cy=0;for(const q of h){cx+=q[0];cy+=q[1]}cx/=h.length;cy/=h.length;
  const core=thr>.4?cw.c:cw.bud;E('path',{d:smooth(h),fill:mix(shd(core,-.3),'#6a7a4a',.15),stroke:shd(core,-.5),'stroke-width':.4,'stroke-opacity':.5},k);
  if(!LOD)E('path',{d:smooth(h.map(q=>[cx+(q[0]-cx)*.86,cy+(q[1]-cy)*.86])),fill:shd(core,-.5),opacity:.55},k);
  pts.sort((a,b)=>a.z-b.z);const gs=det?4:6,ink=shd(cw.c,h2l(cw.c)[2]>.85?-.42:-.38);let eyes='';
  for(let j=0;j<pts.length;j+=gs){const grp=pts.slice(j,j+gs);let dO='',dI='',dB='',dH='',I=0,nO=0;
    for(const q of grp){if(q.age){const fp=floretPath(B,O,q.p,q.n0,q.s*(q.age<1?.75:1),q.rot,{petals:4,lobe:.42,cup:q.age<1?.45:.16});dO+=smooth(fp.map(p=>[p[0],p[1]]));I+=lightI(q.nv);nO++;
        if(dbl&&q.age===1)dI+=smooth(floretPath(B,O,V3.add(q.p,V3.sc(q.n0,q.s*.12)),q.n0,q.s*.62,q.rot+.785,{petals:4,lobe:.4,cup:.25}).map(p=>[p[0],p[1]]));
        if(!LOD&&q.nv[2]>.35&&q.age===1){const e=PJ(B,O,V3.add(q.p,V3.sc(q.n0,q.s*(dbl?.2:.05))));eyes+=l67C(e[0],e[1],Math.max(.45,q.s*.09))}}
      else{const c=PJ(B,O,V3.add(q.p,V3.sc(q.n0,q.s*.25))),r=Math.max(.7,q.s*.4);dB+=l67C(c[0],c[1],r);if(!LOD&&q.nv[2]>.2)dH+=l67C(c[0]-r*.3,c[1]-r*.3,Math.max(.45,r*.32))}}
    if(dB){const bc=mix(cw.bud,'#7a9a4a',op<.28?.35:.1);E('path',{d:dB,fill:l67T(cache,bc,.55),stroke:shd(bc,-.45),'stroke-width':.4,'stroke-opacity':.6},k);if(dH)E('path',{d:dH,fill:'#ffffff',opacity:.25},k)}
    if(dO){const t=l67T(cache,cw.c,.3+.7*(I/nO));E('path',{d:dO,fill:t,stroke:cw.edge||ink,'stroke-width':cw.edge?.7:.4,'stroke-opacity':cw.edge?.9:.55,'stroke-linejoin':'round'},k);
      if(dI)E('path',{d:dI,fill:l67T(cache,cw.c,.45+.7*(I/nO)),stroke:ink,'stroke-width':.35,'stroke-opacity':.45},k)}}
  if(eyes)E('path',{d:eyes,fill:shd(cw.c,-.45),opacity:.7},k);return k}
function l67Lilac(g,t,o){const cw=o.cw||cwNear(L67_LIL,o.col)||L67_LIL[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||18)*UPC,k=G(g),cache={},lc='#4a7034',
    /* drawn in SVG (y-syringa.js): the shoot's colours and marks, its settings GHI.lilas (fit.py), the leaves as sheets; the chance consumed as before */
    sv=typeof syrLeaf==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&!!cw.id,P=sv&&GHI.lilas||{},sc=sv?syrStemCols(0):['#3a3328','#5e5444','#857a64','#aea48a'];
  const B=frameOf(o,.35,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const pan=(par,Bf,pos,Lp,a)=>typeof syrSvgPut==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw.id?syrSvgPut(par,Bf,pos,Lp,cw,a):l67Pan(par,Bf,pos,Lp,cw,a,cache);
  if(o.rim){const r=lsHeadS(k,o,{D:D*.5,w:D*.03,cols:sc,op,rr:.35,nodes:0,lp:.3,flower:(par,B2,O,D2,op2)=>pan(par,l67Fr(B2[2],up,0),O,D*.85,op2)});open(k,t,1000,6,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*1.1))):1,w=D*(sv?P.sw:.035),ph0=R(0,360),twin=rnd()<.55;
  /* the shoot: two leafy nodes (decussate pairs), then the leading panicle on its short peduncle; often its twin from the top axil, a little smaller and younger */
  const rules={S:()=>[['F',{l:D*.55*kr,w0:w*1.3,w1:w*1.2,e:.02}],['N',{i:1}],['F',{l:D*.42*kr,w1:w*1.08,e:.02}],['N',{i:0}],['F',{l:D*.16*kr,w1:w*.85,aim:V3.nz(V3.add(up,V3.sc(face,.3))),k:.3}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],r0=ph0+p.i*90;for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:r0+j*180+R(-10,10)}],['&',{a:(sv?P.ang:56)+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      if(!p.i&&twin){const age=Math.min(1,op*R(.75,.95));out.push(['[',{w:w*.75}],['/',{a:r0+90+R(-25,25)}],['&',{a:R(30,40)}],['F',{l:D*.2*kr,w1:w*.6,e:.05}],['Kb',{age}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,3),{p:[0,0,0],H:up,U:U0,wig:.035,seg:D*.07,T:[0,1,0],e:.02,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=l67Fr(V3.add(og.H,V3.sc(face,.12)),face,R(-.3,.3)),c=V3.add(pos,V3.sc(og.H,-D*.02));return{parts:[{z:c[2],fn:par=>pan(par,Bf,c,D,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=l67Fr(V3.add(og.H,V3.sc(face,.2)),face,R(-.3,.3)),c=V3.add(pos,V3.sc(og.H,-D*.02));return{parts:[{z:c[2]-1e-3,fn:par=>pan(par,Bf,c,D*R(.62,.78),a)}]}}
    if(og.t==='Lv'){const len=D*(og.p.i?(sv?P.L1:.66):(sv?P.L0:.56))*R(.9,1.08),face2=.3+.7*Math.abs(og.U[2]);
      if(sv)return{ext:1,parts:[{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>{R(-.08,.08);syrLeaf(par,og,pos,len,svSeed('lilas-feuille',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(og.H[0]*40)),syrLife())}}]};
      return{ext:1,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>l67Heart(par,x,y,a,l,lc,{face:face2,bend:R(-.08,.08),I:.5+.25*face2}))]}}
    if(og.t==='Nd'&&sv)return{ext:1,parts:[{z:pos[2]+1e-3,cast:false,fn:par=>syrNode(par,og,pos,w)}]};
    return null}});
  open(k,t,1000,6,.3);const nk=lsNeck(res,[0,0,0],apex);if(sv)nk.ncols=syrStemCols(1);return nk}

/* ---------- tall bearded iris (Iris germanica and the tall bearded hybrids): a stout, branched stem from a fan of broad sword leaves, a few short leaves sheathing it;
   at the top and at the end of each branch two or three buds in green spathes, papery-edged, opening one by one; the flower large: three falls (outer tepals) on a narrow veined haft,
   hanging their broad ruffled blade, a dense beard of hairs down the middle of the haft; three standards (inner tepals) upright, ruffled, arching in over the centre into a dome;
   three crested style arms over the beards. Self colours, bicolours (standards and falls differ), amoenas, plicatas (a stitched coloured edge on white) ---------- */
const L67_IRB=[{id:'bleu',n:'Bleu violet (Victoria Falls)',c:'#6a6ac8',fc:'#5a58b8',bd:'#f4f0e4'},{id:'noir',n:'Pourpre noir (Superstition)',c:'#3a1a3e',fc:'#2e1430',bd:'#5a2a4a'},
  {id:'blanc',n:'Blanc (Immortality)',c:'#f6f4ee',fc:'#f7f5ef',bd:'#f2d04a'},{id:'jaune',n:'Jaune (Harvest of Memories)',c:'#f2cc3a',fc:'#f0c22a',bd:'#f0901a'},
  {id:'abricot',n:'Abricot (Orange Harvest)',c:'#f2b080',fc:'#f0a06a',bd:'#e8502a'},{id:'rose',n:'Rose (Beverly Sills)',c:'#ecb4c2',fc:'#e8a8b8',bd:'#f07a5a'},
  {id:'bicolore',n:'Jaune et violet (Edith Wolford)',c:'#f2e07a',fc:'#6a58b0',bd:'#f0a020'},{id:'ambre',n:'Jaune et brun rouge (Rajah)',c:'#f2c22a',fc:'#7a2a24',bd:'#f0a020',hf:'#f2d070'},
  {id:'amoena',n:'Blanc et bleu (Stairway to Heaven)',c:'#f2f2f6',fc:'#8a9ad8',bd:'#f4f0e8'},{id:'plicata',n:'Blanc liseré de violet (Going My Way)',c:'#f6f4f6',fc:'#f6f2f6',bd:'#f0d060',edge:'#6a2a8a'},
  {id:'cuivre',n:'Rouge cuivré (Sultan\'s Palace)',c:'#9a3a2a',fc:'#7e2a24',bd:'#f0b020'},{id:'bleu-pale',n:'Bleu pâle (Blue Sapphire)',c:'#aec0e8',fc:'#a2b4e2',bd:'#f6f2ea'}];
const L67_FALL=prof([[0,.16],[.3,.3],[.48,.78],[.72,1],[.9,.86],[1,.4]]),L67_STD=prof([[0,.16],[.3,.5],[.65,1],[.9,.85],[1,.42]]),L67_STY=prof([[0,.5],[.5,.85],[.8,1],[1,.4]]);
function l67IrisF(par,B,O,D,cw,op){const k=G(par),R0=D/2,o2=sm01((op-.15)/.85),it=[],cache={},det=DET>=1.5,c=cw.c,fc=cw.fc||c,cb=mix(c,'#d8dce8',.15),fb=mix(fc,'#d8dce8',.2),sty=mix(c,'#f4f2f8',.4),hf=cw.hf||mix(fc,'#f4eedc',.55);
  irisSpathes(it,B,O,R0*.8);it.push(tubeFlat(B,O,[[0,0,-R0*.6],[0,0,-R0*.25],[0,0,R0*.06]],R0*.08,R0*.1,'#6f9a52',{ink:'#2e4a22'}));
  for(let i=0;i<3;i++){const ph=-Math.PI/2+i*2.094;
    /* the fall: haft rising, blade hanging, ruffled; a beard down the haft */
    const l=ligule(B,O,{phi:ph+R(-.05,.05),r0:R0*.08,z0:R0*.06,L:R0*1.3,W:R0*.6,wp:L67_FALL,a0:.45+.15*o2,a1:1.2+1.75*o2,pw:.95,th:.45,tip:'round',wav:.1+.06*o2,wk:6,n:det?10:7,tw:R(-.1,.1)});
    it.push({l,c:fc,cb:fb,lift:.15,mid:shd(fc,-.22),mw:Math.max(.4,R0*.025),mo:.45,basec:hf,bf:.3,bo:.75,edgec:cw.edge,ew:Math.max(1,R0*.06)});
    if(!LOD&&l.nm[2]>-.1&&o2>.25)it.push({z:l.z+1e-4,fn:kk=>{const q=[];for(let j=0;j<=6;j++){const t=.04+.36*j/6;q.push(ligAt(l,t,(j%2?.36:.28)*(1-.5*j/6)))}for(let j=6;j>=0;j--){const t=.04+.36*j/6;q.push(ligAt(l,t,-(j%2?.28:.36)*(1-.5*j/6)))}
      E('path',{d:smooth(q),fill:cw.bd,stroke:shd(cw.bd,-.35),'stroke-width':.45,'stroke-opacity':.75,'stroke-dasharray':det?'.6 .5':'none'},kk);
      if(det){const v=[];for(const t of[.06,.2,.34])v.push(ligAt(l,t,0));E('path',{d:smooth(v,false),stroke:mix(cw.bd,'#ffffff',.35),'stroke-width':f(Math.max(.5,R0*.03)),'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},kk)}}});
    /* the style arm over the beard, keeled, crested */
    it.push({l:ligule(B,O,{phi:ph+R(-.03,.03),r0:R0*.04,z0:R0*.14,L:R0*.62,W:R0*.2,wp:L67_STY,a0:.3+.15*o2,a1:.8+.5*o2,pw:1.3,th:-.7,tip:'point',n:det?6:4}),c:sty,cb:mix(sty,'#e0e0ea',.2),lift:.25});
    /* the standard: upright, ruffled, arching in over the centre */
    const ps=ph+Math.PI/3;it.push({l:ligule(B,O,{phi:ps+R(-.04,.04),r0:R0*.06,z0:R0*.14,L:R0*1.12,W:R0*.5,wp:L67_STD,a0:.12+.22*o2,a1:-.06-.2*o2,pw:1.4,th:1.1,tip:'round',wav:.12,wk:5,n:det?8:6,tw:R(-.12,.12)}),c,cb,lift:.2,mid:shd(c,-.18),mw:Math.max(.3,R0*.02),mo:.35,edgec:cw.edge,ew:Math.max(.8,R0*.045)})}
  spPetals(k,it,cache);return k}
/* the bud: a fat pointed pencil above its spathes, the colour of the falls showing as it swells */
function l67IrisBud(par,B,O,D,cw,a){const k=G(par),R0=D/2,it=[],c=mix(a<.6?(cw.fc||cw.c):cw.c,'#6f8a5a',.55-.5*a);irisSpathes(it,B,O,R0*.8);const s=R0*(1.1+.7*a);
  it.push({z:PJ(B,O,[0,0,R0*.2])[2]-R0*.3,fn:kk=>{spBud(kk,B,V3.add(O,toV(B,[0,0,-R0*.45])),s,R0*(.38+.16*a),c,{tp:.7,pw:.55});if(!LOD){const q=[];for(let j=0;j<=6;j++){const v=j/6,an=1.2+v*1.6,r=R0*(.18+.07*a)*Math.sin(Math.PI*Math.min(.98,.05+.95*v));q.push(PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,-R0*.45+v*s]))}E('path',{d:smooth(q.map(p=>[p[0],p[1]]),false),stroke:shd(c,-.4),'stroke-width':.45,'stroke-opacity':.6,fill:'none'},kk)}}});
  spPetals(k,it,{});return k}
function l67Iris(g,t,o){const cw=o.cw||cwNear(L67_IRB,o.col)||L67_IRB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||13)*UPC,k=G(g),sc=['#2e4a3a','#557a64','#7ea08a','#b0c8b8'];
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const head=(par,Bf,Of,D2,a)=>a<.3?l67IrisBud(par,Bf,Of,D2,cw,a/.3):l67IrisF(par,Bf,Of,D2,cw,a);
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.045,cols:sc,op,rr:.3,nodes:0,lp:.4,flower:(par,B2,O,D2,op2)=>head(par,B2,O,D,op2)});open(k,t,1000,6,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.9))):1,w=D*.05,ph0=R(0,360),lean=V3.nz(V3.add(up,V3.sc(face,.2))),nb=rnd()<.6?2:1;
  /* a stout stem: at its foot the fan of sword leaves in one plane; up it a short sheathing leaf at each branch; each branch ends in a bud (or a younger flower); then the top flower */
  const rules={S:()=>{const out=[['F',{l:D*.25*kr,w0:w*1.3,w1:w*1.25,e:.004}]];for(let i=0;i<3;i++)out.push(['[',{}],['/',{a:ph0+(i%2?180:0)}],['&',{a:[8,22,36][i]+R(-3,3)}],['Lf',{i}],[']',{}]);
      out.push(['F',{l:D*.75*kr,w1:w*1.18,e:.004}]);
      for(let i=0;i<nb;i++){const age=i?op*R(.05,.25):op*R(.35,.9);out.push(['[',{}],['/',{a:ph0+90+i*180+R(-15,15)}],['&',{a:R(14,20)}],['Lv',{i}],[']',{}],['[',{w:w*.8}],['/',{a:ph0+90+i*180+R(-15,15)}],['&',{a:R(26,36)}],['F',{l:D*(.55-.15*i)*kr,w1:w*.7,e:.03}],['Kb',{age}],[']',{}],['F',{l:D*.55*kr,w1:w*(1.08-.06*i),e:.004}])}
      out.push(['F',{l:D*.3*kr,w1:w,aim:lean,k:.15}],['K',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,1),{p:[0,0,0],H:up,U:U0,wig:.008,seg:D*.12,T:[0,1,0],e:.004,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos,fz=(H,a)=>{const Z=V3.nz(V3.add(H,V3.sc(face,.32))),v=V3s(face,V3.sc(Z,V3.dot(face,Z)));return frZ(Z,V3l(v)>.05?V3.sc(v,-1):up,R(-.25,.25))};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=fz(og.H),Of=V3.add(pos,V3.sc(Bf[2],D*.2));return{parts:[{z:pos[2]+Bf[2][2]*D*.3,fn:par=>head(par,Bf,Of,D,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=fz(og.H),Of=V3.add(pos,V3.sc(Bf[2],D*.18));return{parts:[{z:pos[2]+Bf[2][2]*D*.25-1e-3,fn:par=>head(par,Bf,Of,D*.92,a)}]}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.38,.5),.14,'#5a7f68',pp,{wp:LS_LANCE,droop:.08,arch:.05,fold:.3,face:.3,tw:R(-.3,.3)});return{ext:1,parts:pp}}
    if(og.t==='Lf'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(1.5,1.8)*(1-.15*og.p.i),.12,'#5f8470',pp,{wp:LS_STRAP,droop:.05+.05*og.p.i,arch:.03,fold:.18,face:.2,tw:R(-.2,.2)});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- crown imperial (Fritillaria imperialis 'Aurora', 'Rubra Maxima', 'Lutea', 'Garland Star', 'Premier'): a stout fleshy stem, purplish-green, clothed below in whorls of glossy
   lanceolate leaves, bare above; at its top a ring of three to eight broad bells hanging on arching pedicels, crowned by a tuft of a dozen or more short leaves standing up;
   inside each bell six white nectar drops at the base and six yellow anthers reaching the mouth; the buds green, standing out, then hanging and colouring ---------- */
const L67_FIM=[{id:'orange',n:'Orange (Aurora)',c:'#e8691e',bl:'#f6a050'},{id:'rouge',n:'Rouge orangé (Rubra Maxima)',c:'#c23a1e',bl:'#e8783a'},{id:'jaune',n:'Jaune (Maxima Lutea)',c:'#f2c21c',bl:'#f8e070'},
  {id:'orange-vif',n:'Orange vif (Garland Star)',c:'#ee7a1a',bl:'#f8b048'},{id:'abricot',n:'Orange pâle (Premier)',c:'#f2a35e',bl:'#f8d098'},{id:'brique',n:'Rouge brique (Rubra)',c:'#9a3a20',bl:'#d0703a'}];
function l67Bell(par,B,O,Lb,cw,a,cache){const k=G(par),o2=Math.max(0,Math.min(1,(a-.25)/.75)),c=a<.25?mix(cw.c,'#7a9a4a',.6-1.6*a):cw.c,nz=B[2][2],cw2={c,bl:mix(cw.bl,c,a<.25?.6:0)};
  /* from below the mouth shows first; seen from above or the side the anthers hang out under it */
  const mouth=nz>.18&&o2>.35;
  const anth=()=>{if(o2<.5||LOD)return;let d='',da='';const c0=PJ(B,O,[0,0,Lb*.55]);for(let j=0;j<6;j++){const an=j/6*6.283+.3,e=PJ(B,O,[Math.cos(an)*Lb*.13,Math.sin(an)*Lb*.13,Lb*(1.06+.04*(j%2))]);d+=`M${f(c0[0])},${f(c0[1])}L${f(e[0])},${f(e[1])}`;da+=l67C(e[0],e[1],Math.max(.7,Lb*.035))}
    const s=PJ(B,O,[0,0,Lb*1.12]);E('path',{d:d+`M${f(c0[0])},${f(c0[1])}L${f(s[0])},${f(s[1])}`,stroke:'#e8dcb0','stroke-width':f(Math.max(1.1,Lb*.02)),fill:'none','stroke-linecap':'round'},k);E('path',{d:da,fill:'#f2d23a',stroke:'#a87a1a','stroke-width':.3},k)};
  if(!mouth)anth();
  fritBell(k,B,O,Lb*(.8+.2*o2),cw2,a<.25?.2:a,cache);
  if(!LOD&&a>=.25){/* the darker veins down the tepals, on the side toward the eye */let d='';for(let j=0;j<6;j++){const an=j/6*6.283+.5,q=[];for(const v of[.12,.4,.66,.86]){const r=Lb*(.8+.2*o2)*(.1+.27*Math.pow(v,.75))*.96;const p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*Lb*(.8+.2*o2)]);q.push(p)}
      if(q[2][2]>PJ(B,O,[0,0,Lb*.45])[2])d+=smooth(q.map(p=>[p[0],p[1]]),false)}if(d)E('path',{d,stroke:shd(c,-.3),'stroke-width':f(Math.max(.4,Lb*.012)),'stroke-opacity':.45,fill:'none'},k)}
  if(mouth)anth();
  return k}
function l67Crown(g,t,o){const cw=o.cw||cwNear(L67_FIM,o.col)||L67_FIM[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||5.5)*UPC/.36,Rr=D/2,k=G(g),B=frameOf(o,.5,true),sc=['#3a3a26','#5e6440','#86905e','#b2bc8a'],cache={},lc='#4e7a3a';
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const n=Math.round(R(5,8)),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*2.2))):1,Lb=D*.36,w=D*.07,ph0=R(0,360),
    mods=[['F',{l:D*(o.rim?.25:.5)*kr,w0:w*1.15,w1:w*1.1,e:.01}]];
  /* the leaves below in two or three whorls (not on the lip) */
  if(!o.rim)for(let r=0;r<3;r++){const m=r<2?4:3;for(let j=0;j<m;j++)mods.push(['[',{}],['/',{a:ph0+r*45+j*360/m+R(-12,12)}],['&',{a:R(30,42)+r*6}],['Lv',{r}],[']',{}]);mods.push(['F',{l:D*(r<2?.32:.9)*kr,w1:w*(1.06-.03*r),e:.01}])}
  mods.push(['F',{l:D*.25*kr,aim:V3.nz(V3.add(up,V3.sc(ax,.2))),k:.3,w1:w}],['Cr',{}]);
  /* the bells: pedicels from the ring, arching out and over; buds still standing out, the older bells hanging lower */
  for(let i=0;i<n;i++){const age=Math.max(0,Math.min(1,op*1.15-(i%3)*.08+R(-.06,.06))),a=ph0+i*360/n+R(-10,10),el=age<.25?R(40,52):R(62,80);
    mods.push(['[',{w:Math.max(1.4,D*.022),c:['#3a4a26','#5a7038','#7e9a52','#a8c07a']}],['/',{a}],['&',{a:el}],['F',{l:Rr*(age<.25?.32:.42)*R(.92,1.08),w1:Math.max(1.2,D*.018),e:age<.25?-.04:-.18}],['K',{age}],[']',{}])}
  /* the tuft above: the stem runs on a little, a rosette of short leaves stands up and out */
  mods.push(['F',{l:D*.08,w1:w*.8}],['T',{}]);
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.012,seg:D*.06,T:[0,1,0],e:.01,w:w*1.15});for(const ch of res.chains)ch.c=ch.c||sc;
  const cr=res.organs.find(q=>q.t==='Cr'),apex=cr.pos,dn=V3.sc(up,-1),tf=res.organs.find(q=>q.t==='T'),nt=DET>=1.5?18:13;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const a=og.p.age,hang=a<.25?V3.nz(V3.add(V3.sc(og.H,.45),dn)):V3.nz(V3.add(V3.sc(og.H,.25),dn)),Bf=l41Fr(hang,V3.nz(V3.add(og.H,[0,0,.01])),0),L=Lb*(a<.25?.55+.6*a:.9+.1*a)*R(.94,1.05);
      return{parts:[{z:pos[2]+hang[2]*L*.4,fn:par=>l67Bell(par,Bf,pos,L,cw,a,cache)}]}}
    if(og.t==='T'){const pp=[];for(let j=0;j<nt;j++){const ring=j<nt*.55?0:1,phi=j*137.5+ph0,el=ring?R(8,20):R(28,44),dg=Math.PI/180,Hh=rotA(rotA(og.H,og.L,el*dg),og.H,phi*dg),Uu=rotA(rotA(og.U,og.L,el*dg),og.H,phi*dg);
        lsLeafParts({pos,H:Hh,U:Uu,L:V3.cr(Uu,Hh)},Lb*(ring?.85:1.15)*R(.85,1.1),.26,lc,pp,{wp:LS_LANCE,droop:.06,arch:.1,fold:.3,gloss:.4})}return{parts:pp}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.9,1.15)*(1-.15*og.p.r),.17,lc,pp,{wp:LS_LANCE,droop:.3,arch:.08,fold:.28,face:.3,gloss:.4,tw:R(-.3,.3)});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- the stars of a raceme drawn by bands (as eremSpike): per band and side, its pedicels and bracts, its stars (six tepals), the eyes, the stamens and anthers, its buds;
   S: Dm star diameter, nT flowers, tep (tepal: w width at its middle, cup, point), eye (ovary colour), an (anther colour), st (filament colour), spent (spent flowers: twisted or faded),
   ped (pedicel length ×Dm: [open at the foot, at the top]), budS (bud size ×Dm), k (spQ crowding), flat (corymb: the lower pedicels long, the raceme flat-topped) ---------- */
function l67Raceme(A,parts,cw,op,S,l0,Lfl,cache){const det=DET>=1.5,Dm=S.Dm,nT=S.nT,fo=op<.25?0:Math.min(.92,.12+.85*(op-.25)/.75),nO=Math.round(nT*fo),nH=nO?Math.max(1,Math.round(nT*.08)):0,nS=op>.85?Math.round(nT*(S.spent??.1)):0,items=[];
  for(let i=0;i<nT;i++){const q=spQ(i,nT,S.k??.45),l=l0+Lfl*(.005+.99*q),s=A.sOf(l),az=(i*137.5+R(-12,12))*D,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));
    let kd,h=1;if(i<nS)kd='spent';else if(i<nO-nH)kd='open';else if(i<nO){kd='open';h=.35+.5*(nO-1-i)/Math.max(1,nH)}else kd='bud';
    const qb=kd==='bud'?(i-nO)/Math.max(1,nT-nO-1):0,u=i/Math.max(1,nT-1),pl=Dm*(kd==='bud'?S.ped[1]*(1-.6*qb):S.ped[0]+(S.ped[1]-S.ped[0])*u)*(S.flat?1+S.flat*(1-u):1),
      el=kd==='bud'?.6+.7*qb:kd==='spent'?.5:(S.el??.35)+(1-h)*.4,ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f0.T,Math.sin(el)))),
      pos=V3.add(V3.add(f0.p,V3.sc(r,pl*.9)),V3.sc(f0.T,pl*(kd==='bud'?.35+.45*qb:(S.flat?.45*S.flat*(1-u):0)+.15)));
    items.push({i,s,kd,h,qb,r,ax,pos,node:f0.p,T:f0.T,rz:V3.dot(r,[0,0,1])})}
  const nb=Math.max(5,Math.round(Lfl/(Dm*.9))),s0=A.sOf(l0),cuts=[s0];for(let j=1;j<=nb;j++)cuts.push(s0+(1-s0)*j/nb);
  l41StemP(A,parts,cuts,S.w1,Math.max(1.2,S.w1*.35),S.sc.map(c=>shd(c,-.15)),1,s0,1);
  const ink=shd(cw.c,h2l(cw.c)[2]>.8?-.5:-.4),pc=S.sc[1],tp=S.tep;
  for(let j=0;j<nb;j++){const a=cuts[j],b=cuts[j+1],band=items.filter(it=>it.s>=a-1e-9&&(it.s<b||j===nb-1));if(!band.length)continue;const sm=(a+b)/2,zc=A.cb(sm)[2];
    for(const side of[-1,1]){const grp=band.filter(it=>(it.rz>=0?1:-1)===side);if(!grp.length)continue;let dp='',ds='',dsp='',dmid='',dey='',dst='',dan='',db='',dbh='',nI=0,zI=0;
      for(const it of grp){const B=spFrame(it.ax,it.T,(it.i*.7)%1),c0=l67Q(it.node),c1=l67Q(it.pos);
        dp+=`M${f(c0[0])},${f(c0[1])}Q${f((c0[0]+c1[0])/2-it.T[0]*Dm*.1)},${f((c0[1]+c1[1])/2+it.T[1]*Dm*.1)} ${f(c1[0])},${f(c1[1])}`;
        if(it.kd==='bud'){const sb=Dm*S.budS*(1-.45*it.qb),wb=sb*.42,pts=[];for(let m=0;m<=4;m++)for(let n=0;n<6;n++){const v=m/4,an=n/6*6.283,rr=wb*.5*Math.pow(Math.sin(Math.PI*Math.min(.98,.04+.96*v)),.7)*(1-.45*v),p=PJ(B,it.pos,[Math.cos(an)*rr,Math.sin(an)*rr,v*sb-sb*.06]);pts.push([p[0],p[1]])}
          db+=smooth(hull2(pts));const hp=PJ(B,it.pos,[-wb*.12,wb*.12,sb*.42]);dbh+=l67C(hp[0],hp[1],Math.max(.45,wb*.16));continue}
        const sp2=it.kd==='spent';
        if(sp2&&S.twist){/* spent: the tepals twisted together round the swelling ovary */const sb=Dm*.34,wb=sb*.5,pts=[];for(let m=0;m<=4;m++)for(let n=0;n<6;n++){const v=m/4,an=n/6*6.283+v*2,rr=wb*.5*Math.pow(Math.sin(Math.PI*Math.min(.98,.04+.96*v)),.6)*(1-.5*v),p=PJ(B,it.pos,[Math.cos(an)*rr,Math.sin(an)*rr,v*sb]);pts.push([p[0],p[1]])}dsp+=smooth(hull2(pts));continue}
        const rr=Dm/2*(sp2?.5:.4+.6*it.h),cup=(sp2?.45:tp.cup+(1-it.h)*.55),pts=[],rot=(it.i*.61)%1,nt=6,wd=tp.w*(sp2?.7:1);
        for(let m=0;m<nt;m++){const a0=(m/nt+rot/nt)*6.283,a1=a0+3.1416/nt,tw=(m%2?.92:1)*(S.irr?1+S.irr*Math.cos(a0+1.57):1);
          const tip=PJ(B,it.pos,[Math.cos(a0)*rr*tw,Math.sin(a0)*rr*tw,cup*rr]),sh1=PJ(B,it.pos,[Math.cos(a0+wd)*rr*.62*tw,Math.sin(a0+wd)*rr*.62*tw,cup*rr*.5]),sh0=PJ(B,it.pos,[Math.cos(a0-wd)*rr*.62*tw,Math.sin(a0-wd)*rr*.62*tw,cup*rr*.5]),
            nch=PJ(B,it.pos,[Math.cos(a1)*rr*tp.notch,Math.sin(a1)*rr*tp.notch,cup*rr*.1]);pts.push(tp.round?[sh0,tip,sh1,nch]:det?[sh0,tip,sh1,nch]:[tip,nch])}
        const flat=pts.flat(),dd=tp.round?smooth(flat.map(p=>[p[0],p[1]])):fgD(flat);if(sp2)dsp+=dd;else ds+=dd;
        if(!LOD&&!sp2&&tp.mid){for(let m=0;m<nt;m+=1){const a0=(m/nt+rot/nt)*6.283,p1=PJ(B,it.pos,[Math.cos(a0)*rr*.2,Math.sin(a0)*rr*.2,cup*rr*.03]),p2=PJ(B,it.pos,[Math.cos(a0)*rr*.78,Math.sin(a0)*rr*.78,cup*rr*.6]);dmid+=`M${f(p1[0])},${f(p1[1])}L${f(p2[0])},${f(p2[1])}`}}
        const fc2=V3.dot(it.ax,[0,0,1])>-.15;if(!sp2&&S.eye&&fc2){const e=PJ(B,it.pos,[0,0,rr*S.eye.z]);dey+=l67C(e[0],e[1],Math.max(.7,rr*S.eye.r))}
        if(!LOD&&!sp2&&(fc2||!S.eye)){const ns=det?6:3,Ls=Dm*S.stL*(.6+.4*it.h),c=PJ(B,it.pos,[0,0,rr*.05]);for(let m=0;m<ns;m++){const a=(m/ns+rot/ns)*6.283+.5,e=PJ(B,it.pos,[Math.cos(a)*Ls*S.stS,Math.sin(a)*Ls*S.stS,Ls]);
            dst+=`M${f(c[0])},${f(c[1])}L${f(e[0])},${f(e[1])}`;dan+=l67C(e[0],e[1],Math.max(.6,Dm*(S.anR??.03)))}}
        zI+=lightI(V3.nz(V3.add(it.ax,[0,0,.25])));nI++}
      const I=nI?zI/nI:.5,face=side>0,fill=l67T(cache,face?cw.c:mix(cw.c,'#d8d0b8',.1),face?I+.06:I-.1),bc=mix(cw.bud||cw.c,'#7a9a52',S.bg??.3),bfill=l67T(cache,bc,face?.55:.42),spc=mix(mix(cw.c,'#8a7a50',.55),'#6a5236',.2);
      const zz=A.zk(sm,zc+side*Dm*.5);
      parts.push({z:zz,fn:par=>{E('path',{d:dp,stroke:pc,'stroke-width':f(Math.max(1.1,Dm*.05)),fill:'none','stroke-linecap':'round'},par);
        if(db){E('path',{d:db,fill:bfill,stroke:shd(bc,-.45),'stroke-width':.4,'stroke-opacity':.6},par);if(!LOD)E('path',{d:dbh,fill:'#ffffff',opacity:.28},par)}
        if(dsp)E('path',{d:dsp,fill:S.twist?l67T(cache,mix(cw.c,'#6a7a4a',.3),.4):spc,stroke:shd(spc,-.45),'stroke-width':.4,'stroke-opacity':.6,'stroke-linejoin':'round'},par);
        if(ds){E('path',{d:ds,fill,stroke:ink,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},par);if(dmid)E('path',{d:dmid,stroke:tp.mid,'stroke-width':f(Math.max(.5,Dm*.025)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par)}
        if(dst)E('path',{d:dst,stroke:face?S.st:shd(S.st,-.12),'stroke-width':f(Math.max(1.05,Dm*.035)),fill:'none','stroke-linecap':'round'},par);
        if(dan)E('path',{d:dan,fill:cw.an||S.an,stroke:shd(cw.an||S.an,-.4),'stroke-width':.3},par);
        if(dey)E('path',{d:dey,fill:S.eye.c,stroke:shd(S.eye.c,-.4),'stroke-width':.35},par)}})}}}

/* ---------- quamash (Camassia leichtlinii 'Caerulea', 'Alba', C. quamash, C. cusickii, C. leichtlinii 'Sacajawea'): a slender leafless scape, a long open raceme of starry flowers,
   six narrow, spreading tepals a little uneven, six stamens with golden anthers; they open from the base, the spent ones twisting their tepals together round the ovary; buds narrow, blue ---------- */
const L67_CAM=[{id:'bleu',n:'Bleu violet (leichtlinii Caerulea)',c:'#5a5ab8',bud:'#4a4a8a'},{id:'bleu-nuit',n:'Bleu indigo (quamash)',c:'#4038a0',bud:'#3a3070'},
  {id:'bleu-pale',n:'Bleu pâle (cusickii)',c:'#9fb8e6',bud:'#7a8ab8'},{id:'lavande',n:'Lavande (Blue Heaven)',c:'#b4a6dc',bud:'#8a7ab0'},{id:'blanc',n:'Blanc crème (Alba)',c:'#f3eedb',bud:'#cfd4a8'}];
function l67Camassia(g,t,o){const cw=cwPick(L67_CAM,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||22)*UPC,Lt=sp?blen(o.spine):Lf0*2.6,Dm=5*UPC*R(.92,1.06),SC=['#2e4a24','#4e7438','#76a052','#a8c886'];let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.02,e:.1,seg:8,w:5,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.6:.45:.4))*(op<.25?.65+.8*op:1);const N=[],n=4,ph0=R(0,360),Lb=L-Lfl;for(let j=0;j<n;j++)N.push({l:Lb*(.2+.75*j/(n-1)),phi:ph0+j*137.5,kink:R(.3,1)});return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  l41StemP(A,parts,[0,s0*.5,s0],5,4,SC,s0);
  l67Raceme(A,parts,cw,op,{Dm,nT:Math.round(Lfl/UPC*(LOD?.9:1.35)*R(.95,1.05)),tep:{w:.24,cup:.1,notch:.2},stL:.27,stS:.4,st:mix(cw.c,'#f4f0e8',.3),an:'#f0c828',ped:[.42,.3],budS:.5,k:.55,el:.25,irr:.12,twist:1,spent:.15,w1:3.6,sc:SC,bg:.12,eye:null},l0,Lfl,cache);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:5,bc:SC}}

/* ---------- star of Bethlehem (Ornithogalum thyrsoides 'chincherinchee', O. arabicum, O. dubium, O. saundersiae): a stout leafless scape, a dense conical raceme (flat-topped in arabicum)
   of cup-shaped stars, six broad tepals, the ovary green-yellow (glossy black in arabicum and saundersiae), stamens with flattened white filaments and yellow anthers;
   the many buds crowded in a green-white cone at the tip; the flowers open slowly from the base and last for weeks ---------- */
const L67_ORN=[{id:'blanc',n:'Blanc (thyrsoides)',c:'#f8f6ee',bud:'#dfe6c4',ey:'#c8c86a',f:'th'},{id:'creme',n:'Blanc crème (thyrsoides Mount Fuji)',c:'#f3ead2',bud:'#d8dcb4',ey:'#b8b860',f:'th'},
  {id:'arabicum',n:'Blanc à œil noir (arabicum)',c:'#f7f5ee',bud:'#e2e6cc',ey:'#1a1a1e',f:'ar'},{id:'saundersiae',n:'Blanc à œil noir vert (saundersiae)',c:'#f4f4ea',bud:'#dce4c0',ey:'#1e2a1a',f:'ar'},
  {id:'orange',n:'Orange (dubium)',c:'#f07a1e',bud:'#b8a050',ey:'#3a3a1a',f:'du'},{id:'jaune',n:'Jaune (dubium)',c:'#f2c41e',bud:'#b8b050',ey:'#4a4a1e',f:'du'},{id:'vert-blanc',n:'Blanc verdâtre (thyrsoides)',c:'#eef0dc',bud:'#cad8a8',ey:'#b0b860',f:'th'}];
function l67Ornith(g,t,o){const cw=cwPick(L67_ORN,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine,ar=cw.f==='ar',du=cw.f==='du';
  const Lf0=(o.cm||10)*UPC*(ar?.7:1),Lt=sp?blen(o.spine):Lf0*(ar?5:4.4),Dm=(ar?4.2:du?2.6:2.8)*UPC*R(.94,1.06),SC=['#2e4a24','#4e7438','#76a052','#a8c886'];let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.015,e:.1,seg:8,w:5.5,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.5:.3:.24))*(op<.25?.7+.6*op:1);const N=[],n=3,ph0=R(0,360),Lb=L-Lfl;for(let j=0;j<n;j++)N.push({l:Lb*(.25+.7*j/(n-1)),phi:ph0+j*137.5,kink:R(.2,.8)});return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  l41StemP(A,parts,[0,s0*.5,s0],5.5,4.4,SC,s0);
  const nT=Math.round((ar?R(10,16):Lfl/UPC*(LOD?2.4:3.4)*R(.95,1.05))),eye={c:cw.ey,r:ar?.18:.16,z:ar?.12:.18};
  l67Raceme(A,parts,cw,op,{Dm,nT,tep:{w:ar?.4:.36,cup:ar?.12:du?.32:.38,notch:ar?.55:.5,round:1,mid:ar?null:mix(cw.c,'#9ab060',.5)},stL:.16,stS:.42,anR:.022,st:'#f4f2e6',an:'#f2d23a',ped:ar?[.62,.3]:[.7,.25],budS:.48,k:ar?.7:.3,el:ar?1:.55,
    flat:ar?.45:0,spent:0,w1:4,sc:SC,eye},l0,Lfl,cache);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:5.5,bc:SC}}

Object.assign(GH,{'lilas':l67Lilac,'iris-barbu':l67Iris,'fritillaire-imperiale':l67Crown,'camassia':l67Camassia,'ornithogale':l67Ornith});
Object.assign(CWS,{'lilas':L67_LIL,'iris-barbu':L67_IRB,'fritillaire-imperiale':L67_FIM,'camassia':L67_CAM,'ornithogale':L67_ORN});
Object.assign(SZG,{'lilas':[14,16,18,20,24],'iris-barbu':[11,12,13,14,15],'fritillaire-imperiale':[4.5,5,5.5,5.5,6.5],'camassia':[15,18,22,24,28],'ornithogale':[7,8,10,11,13]});
Object.assign(GHI,{'lilas':{form:'grappe',size:2.4,k:'head',rk:1.15},'iris-barbu':{form:'etoile',size:2.6,k:'head',rk:.95},'fritillaire-imperiale':{form:'cornet',size:2.4,k:'head',rk:1},
  'camassia':{form:'epi',size:1,k:'plant',self:75*UPC,tip:.9,fx:5*UPC},'ornithogale':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.92,fx:4*UPC}});
for(const id of['lilas','iris-barbu','fritillaire-imperiale'])GH_BUDS.add(id);
