/* ================= Serre, lot 48 — été 6, poussés par le L-système : godétia (épi feuillé de coupes satinées), liatris (épi plumeux), sauge (épis de fleurs à lèvres), phlox (panicule bombée), chrysanthème spray marguerite ================= */
/* les épis (godétia, liatris, sauge) poussent comme ceux de la reprise 5 (spGrow) ; liatris et sauge se dessinent par bandes comme l'eremurus du lot 41 (l41StemP) ;
   le phlox est une tête sur sa tige (chpHeadS, comme le pentas du lot 31) ; le chrysanthème spray est un corymbe ramifié poussé par lsTurtle (comme l'aster du lot 21) */
const l48Q=p=>[p[0],-p[1]];
/* a cached tone of a colour lit at I (0..1, in 15 steps) */
const l48T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),k=c+'|'+q;return cache[k]||(cache[k]=toneAt(pal7(c),q/14))};
/* the leaves of a grown spike: in a bouquet they turn up to the light and stay clear above the mouth (as the lot 41) */
function l48Leaves(P,parts,sp,draw,lmin=11*UPC){for(const lf of P.leaves){const lv=lf.nd.leaf;if(!lv)continue;if(sp){if(lf.nd.l<lmin)continue;spLeafUp(lf,.16);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
  parts.push(spLeafPart(P.A,lf,lv.len,(par,x,y,ang,len,face,dr)=>draw(par,x,y,ang,len,face,dr,lv)))}}

/* ---------- godetia, satin flower (Clarkia amoena, syn. Godetia grandiflora — the Grace and Satin series; Clarkia unguiculata, the double 'Apple Blossom' forms):
   a leafy stem, its narrow lanceolate leaves alternate; the flowers sit in the axils of the upper leaves on their long green inferior ovaries, a leafy spike
   opening from the bottom up, erect pointed four-angled buds crowded at its tip, one or two side spikes from the upper axils.
   A flower: a satin cup of four broad fan-shaped petals, often with a carmine blotch in the heart of each, eight stamens and a four-lobed cream stigma;
   the sepals joined and swept back to one side. The doubles: a ruffled rosette of many wavy petals ---------- */
const CW_L48GOD=[{id:'rose',n:'Rose (Grace Rose Pink)',c:'#ef8aa8',bl:'#c4204a'},{id:'saumon',n:'Saumon (Grace Salmon)',c:'#f3a088',bl:'#cc2c3a'},
  {id:'blanc',n:'Blanc (Grace White)',c:'#f8f4f0'},{id:'rouge',n:'Rouge carmin (Grace Red)',c:'#c42a3e',bl:'#80101e'},
  {id:'lavande',n:'Lavande (Grace Lavender)',c:'#c8a0d0',bl:'#9a2e72'},{id:'corail',n:'Corail',c:'#ee7a6a',bl:'#b81e2a'},
  {id:'rose-coquillage',n:'Rose coquillage (Grace Shell Pink)',c:'#f6c4cc',bl:'#e0567a'},
  {id:'double-rose',n:'Double rose (Apple Blossom)',c:'#f2a6b6',k:'dbl'},{id:'double-saumon',n:'Double saumon (Salmon Queen)',c:'#f4a890',k:'dbl'},{id:'double-blanc',n:'Double blanc',c:'#f6f2ee',k:'dbl'}];
/* a petal fill with a blotch in its heart: one radial gradient per tone and blotch colour */
const L48BL={};function l48Blot(c,b){const key=c+b,id=L48BL[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l48b'+(gid++),gr=E('radialGradient',{id:nid,cx:.5,cy:.52,r:.5},defs);
  stops(gr,[[0,b],[.2,b],[.38,mix(b,c,.55)],[.52,c],[1,c]]);L48BL[key]=nid;return`url(#${nid})`}
const L48_GPET=prof([[0,.12],[.2,.42],[.5,.86],[.8,1],[1,.86]]),L48_GBL=prof([[0,.35],[.4,.95],[.7,1],[1,.4]]),L48_GDBL=prof([[0,.22],[.3,.7],[.7,1],[1,.88]]);
function l48GodFlower(par,B,O,D0,cw,op){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((op-.2)/.8),rot=R(0,6.28),dbl=cw.k==='dbl',lo=LOD||DET<1;
    /* satin: the light runs over the cup without darkening it much */
  const tone=(l,c)=>{const bk=l.nm[2]<0,I=lightI(bk?V3.sc(l.nm,-1):l.nm);return toneAt(pal7(bk?mix(c,'#e8e4d8',.2):c),.62+.3*Math.max(0,Math.min(1,(I-.15)/.85)))};
  if(dbl){const it=[];for(const[n,L,W,a0,a1,wv]of[[8,.9,.46,.75,1.45,.3],[7,.74,.42,.5,1.05,.28],[6,.54,.38,.25,.62,.22],[5,.34,.3,.1,.32,.15]]){const r1=rot+n;
      for(let i=0;i<n;i++)it.push({l:ligule(B,O,{phi:i/n*6.283+r1+R(-.08,.08),r0:R0*.05,z0:R0*.02,L:R0*L*(.6+.4*o2)*R(.92,1.06),W:R0*W,wp:L48_GDBL,a0:a0*(.35+.65*o2),a1:a1*(.35+.65*o2),pw:1.3,th:.6,tip:'round',n:5,wav:wv,wk:4,tw:R(-.2,.2)}),c:cw.c,sw:.4})}
    for(const q of it){q.flat=tone(q.l,mix(cw.c,shd(cw.c,R(-.1,.03)),.6))}drawLig(k,it);return k}
  E('path',{d:smooth(spDisc(B,O,R0*.12,R0*.02,10)),fill:mix(cw.c,'#c8d098',.5),stroke:shd(cw.c,-.3),'stroke-width':.3,'stroke-opacity':.5},k);
  const a0=.25+.22*o2,a1=a0+.2+.32*o2,W=R0*(.42+.14*o2),L=R0*(.62+.36*o2),pets=[],n=6;
  for(let i=0;i<4;i++){const phi=i*1.5708+rot+R(-.06,.06),pl={phi,r0:R0*.05,z0:0,L,W,wp:L48_GPET,a0,a1,pw:1.4,th:.9,tip:'round',n},l=ligule(B,O,pl),its=[{l,c:cw.c,flat:tone(l,cw.c),sw:.4}];
    /* the blotch in the heart of the petal: its fill a radial gradient, the blotch at its middle fading into the petal's tone */
    if(cw.bl&&o2>.25&&l.nm[2]>=0)its[0].flat=l48Blot(its[0].flat,mix(cw.bl,cw.c,.2+.5*(1-o2)));
    pets.push(its)}
  pets.sort((a,b)=>a[0].l.z-b[0].l.z);for(const its of pets)drawLig(k,its);
  /* the heart: eight stamens round a white style ending in four spreading lobes */
  if(nz>.05&&o2>.3){const c=PJ(B,O,[0,0,R0*.04]);let ds='',da='';for(let m=0;m<8;m++){const a=m/8*6.283+rot+.2,e=PJ(B,O,[Math.cos(a)*R0*.2,Math.sin(a)*R0*.2,R0*.24]);ds+=`M${f(c[0])},${f(c[1])}L${f(e[0])},${f(e[1])}`;da+=l41C(e[0],e[1],Math.max(.55,R0*.035))}
    const st=PJ(B,O,[0,0,R0*.42]);ds+=`M${f(c[0])},${f(c[1])}L${f(st[0])},${f(st[1])}`;let dl='';for(let m=0;m<4;m++){const a=m*1.5708+rot+.4,e=PJ(B,O,[Math.cos(a)*R0*.1,Math.sin(a)*R0*.1,R0*.45]);dl+=`M${f(st[0])},${f(st[1])}L${f(e[0])},${f(e[1])}`}
    E('path',{d:ds,stroke:mix(cw.c,'#f4ece0',.55),'stroke-width':1.05,fill:'none','stroke-linecap':'round'},k);if(DET>=1.5&&!LOD)E('path',{d:da,fill:'#efe2b0',stroke:'#b8a060','stroke-width':.25},k);
    E('path',{d:dl,stroke:'#f6f0dc','stroke-width':f(Math.max(1.3,R0*.06)),fill:'none','stroke-linecap':'round'},k)}
  return k}
/* a bud: an erect, pointed, four-angled spindle, green, the petal colour showing through its seams as it swells */
function l48GodBud(par,B,O,s,cw,a){const c=mix('#7a9450',cw.c,.08+.55*a);spBud(par,B,O,s,s*.34,c,{tp:.72,pw:.55});
  if(DET>=1.5&&!LOD&&a>.4){const p0=PJ(B,O,[0,s*.05,s*.2]),p1=PJ(B,O,[0,s*.05,s*.85]);E('path',{d:`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`,stroke:cw.c,'stroke-width':1.05,'stroke-opacity':.75,'stroke-linecap':'round'},par)}}
/* the leafy raceme on the axis A from the length l0: a little leaf under every flower, the flowers on their ovaries, the buds crowded at the tip */
/* a small leaf as one path (the cheap bract-leaf of the raceme at the application's detail) */
function l48Blade(par,x,y,a,len,w,col){const c=Math.cos(a),sn=Math.sin(a),L=[],Rr=[];for(let i=0;i<=6;i++){const t=i/6,hw=len*w*.5*Math.pow(Math.sin(Math.PI*Math.min(.999,.02+t*.98)),.75)*(1-.35*t*t)*.75;L.push([x+c*len*t-sn*hw,y+sn*len*t+c*hw]);Rr.push([x+c*len*t+sn*hw,y+sn*len*t-c*hw])}
  return E('path',{d:smooth(L.concat(Rr.reverse())),fill:toneAt(pal7(col),.55),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.5},par)}
function l48GodRace(A,parts,l0,nT,Dm,cw,fo,pc,lc,sz0=1){const ag=spAges(nT,fo,0,1),Lr=A.L-l0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.03+.95*spQ(i,nT,.38)),s=A.sOf(l),az=(i*137.5+R(-15,15))*D,a=ag[i],f0=A.at(s),
      r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),bH=V3.nz(V3.add(V3.sc(r,.75),V3.sc(f0.T,.66))),bl=Dm*(1-.55*q)*sz0;
    parts.push({z:A.zk(s,f0.p[2]+bH[2]*bl*.4)-.003,fn:par=>{const p=l48Q(f0.p),h=[bH[0],-bH[1]];const a=Math.atan2(h[1],h[0]),ln=bl*Math.max(.35,Math.hypot(h[0],h[1]));if(DET>=1.5)lanceFlat(par,p[0],p[1],a,ln,.16,lc,{tilt:.5,fold:.3});else l48Blade(par,p[0],p[1],a,ln,.16,lc)}});
    if(a.k==='bud'){const qb=a.qb,sb=Dm*(.5-.26*qb)*sz0,pl=spAt(A,s,az+.5,Dm*(.12-.06*qb),1.12+.25*qb,0),B=spFrame(pl.ax,pl.T,0);
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Dm*.035,pc);l48GodBud(par,B,pl.pos,sb,cw,1-qb)}})}
    else{const h=a.k==='half'?a.op:1,sz=(1-.15*q)*sz0*(.75+.25*h),pl=spAt(A,s,az+.5,Dm*.28*(.55+.45*h),1.02+(1-h)*.3+R(-.12,.12),Dm*.14),B=spFrame(pl.ax,pl.T,R(-.3,.3));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Dm*.035,pc);l48GodFlower(par,B,pl.pos,Dm*sz,cw,h)}})}}}
function l48GodSpike(g,t,o){const cw=cwPick(CW_L48GOD,o),dbl=cw.k==='dbl',op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],sp=!!o.spine;
  const Lf0=(o.cm||20)*UPC,Lt=sp?blen(o.spine):Lf0*2.5,Dm=(dbl?4.2:5.6)*UPC*R(.94,1.06),SC=['#3a4a24','#5e7038','#86985a','#b6c48c'],pc=mix(SC[1],'#6a8a44',.4),lc='#56743a';let Lfl=0;
  const nLat=sp&&o.short?0:rnd()<.5||DET<1.5?1:2;
  const P=spGrow(o,Lt,{face:R(-.7,.7),wig:.035,e:.07,seg:7,w:4.4,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.7:.55:.42));const Lb=L-Lfl,n=sp?4:6,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.08+.8*u)*R(.97,1.03),phi:ph0+j*137.5,kink:R(1,3),leaf:{a:46-12*u+R(-5,5),len:UPC*(7.5-2*u)*R(.9,1.1),w:.17}})}
    for(let m=0;m<nLat;m++){const l=Lb*(.92+.06*m);N.push({l,phi:ph0+(n+m)*137.5,kink:R(1,2),leaf:{a:40,len:UPC*5*R(.9,1.1),w:.16},lat:!sp||l>L*.3?{len:Lfl*R(.45,.6)*(1-.2*m),a:R(26,36),e:.05,w:2.6}:null})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0*.5,s0],4.4,3.2,SC,s0);const cuts=[s0];for(let j=1;j<=6;j++)cuts.push(s0+(1-s0)*j/6);spStemP(A,parts,cuts,3.2,1.2,SC,1,s0);
  l48Leaves(P,parts,sp,(par,x,y,ang,len,face,dr,lv)=>lanceFlat(par,x,y,ang,len,lv.w,lc,{tilt:Math.acos(Math.min(.98,face)),bend:dr*R(.12,.25),fold:.32}));
  const fo=op<.2?0:Math.min(.7,.1+.62*op);
  P.lats.forEach((lt,m)=>{const As=lt.A;spStemP(As,parts,[0,.3,.65,1],lt.nd.lat.w,1,SC);l48GodRace(As,parts,As.L*.3,Math.max(4,Math.round(As.L/(Dm*.55))),Dm,cw,fo*(.6-.15*m),pc,lc,.88)});
  l48GodRace(A,parts,L-Lfl,Math.max(8,Math.round(Lfl/(Dm*.44))),Dm,cw,fo,pc,lc);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.4,bc:SC}}

/* ---------- blazing star (Liatris spicata 'Floristan Violett', 'Floristan Weiss', 'Kobold'): a stiff stem clothed all the way up with narrow linear leaves in a dense spiral,
   long below, shorter and pressed to the stem toward the spike; the spike a dense column of small heads, each a little cup of purple-tinged bracts holding a tuft of
   tubular florets whose long styles stand out like threads — the whole spike plumy. Unlike almost every spike it opens from the top down: in bud it is a column of
   round, scaly buds; then the plume spreads down from the tip. Drawn by bands (as the eremurus of lot 41): every band, behind or in front of the axis,
   is its cups, its threads and their light (or its buds), a few paths ---------- */
const CW_L48LIA=[{id:'violet',n:'Pourpre violet (Floristan Violett)',c:'#95409c',bud:'#6a3a66'},{id:'pourpre',n:'Pourpre profond (Kobold)',c:'#6e2a7e',bud:'#4e2a50'},
  {id:'mauve',n:'Mauve rosé',c:'#c07ab8',bud:'#8a5a7e'},{id:'blanc',n:'Blanc (Floristan Weiss)',c:'#f2efe6',bud:'#a8b08c'}];
function l48LiaSpike(g,t,o){const cw=cwPick(CW_L48LIA,o),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],cache={},sp=!!o.spine,det=DET>=1.5;
  const Lf0=(o.cm||30)*UPC,Lt=sp?blen(o.spine):Lf0*2.3,Dm=1.4*UPC*R(.94,1.06),SC=['#2c4422','#4a6c34','#729a50','#a6c47e'],lc='#4c7234';let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.02,e:.08,seg:8,w:5.4,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.62:.5:.43))*(op<.25?.88:1);const Lb=L-Lfl,n=sp?o.short?10:15:24,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.03+.97*Math.pow(u,.85))*R(.985,1.015),phi:ph0+j*137.5,kink:R(.1,.5),leaf:{a:R(16,26)-7*u,len:UPC*(12-7.5*u)*R(.85,1.12),w:.075-.02*u}})}
    /* the last small leaves run on among the lowest heads */
    for(let j=1;j<=4;j++)N.push({l:Lb+Lfl*.07*j,phi:ph0+(n+j)*137.5,kink:0,leaf:{a:R(12,18),len:UPC*(3.8-.5*j)*R(.85,1.12),w:.06}});return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  /* the ages: the top opens first and the open band spreads down; the lowest buds are the youngest */
  const nT=Math.max(40,Math.round(Lfl/UPC*(LOD?2.6:det?5.4:4.4)*R(.95,1.05))),fo=op<.25?0:Math.min(.94,.12+.82*op),nO=Math.round(nT*fo),nH=nO?Math.max(2,Math.round(nT*.07)):0,items=[];
  for(let i=0;i<nT;i++){const q=spQ(i,nT,.75),l=l0+Lfl*(.01+.975*q),s=A.sOf(l),az=(i*137.5+R(-12,12))*D,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),
      open=i>=nT-nO,j=i-(nT-nO),h=open?(j<nH?.3+.7*j/nH:1):0,qb=open?0:1-i/Math.max(1,nT-nO-1),taper=1-.4*Math.pow(q,3),
      el=open?.4+.25*(1-h):.75,ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f0.T,Math.sin(el)))),base=V3.add(f0.p,V3.sc(r,1.1)),Li=Dm*(open?.3:.4-.1*qb)*(.85+.15*taper);
    items.push({i,s,open,h,qb,taper,r,ax,base,Li,T:f0.T,rz:V3.dot(r,[0,0,1])})}
  const nb=Math.max(6,Math.round(Lfl/(6*UPC))),cuts=[s0];for(let j=1;j<=nb;j++)cuts.push(s0+(1-s0)*j/nb);
  l41StemP(A,parts,[0,s0*.5,s0],5.4,4.2,SC,s0);l41StemP(A,parts,cuts,3.4,1.4,SC.map(c=>mix(shd(c,-.3),cw.bud,.35)),1,s0,1);
  l48Leaves(P,parts,sp,(par,x,y,ang,len,face,dr,lv)=>lanceFlat(par,x,y,ang,len,lv.w,lc,{tilt:Math.acos(Math.min(.98,face)),bend:dr*R(.05,.14),fold:.3}),9*UPC);
  const thc=cw.c,lite=h2l(thc)[2]>.8,invc=mix(cw.bud,'#56683a',.35),nth=LOD?6:det?16:11;
  for(let j=0;j<nb;j++){const a=cuts[j],b=cuts[j+1],band=items.filter(it=>it.s>=a-1e-9&&(it.s<b||j===nb-1));if(!band.length)continue;const sm=(a+b)/2,zc=A.cb(sm)[2];
    for(const side of[-1,1]){const grp=band.filter(it=>(it.rz>=0?1:-1)===side);if(!grp.length)continue;let di='',dt='',dl='',db='',dbh='',zI=0;
      for(const it of grp){const B=spFrame(it.ax,it.T,(it.i*.7)%1),pts=[];
        /* the cup of bracts (or the whole bud): an ovoid from the axis */
        const rw=it.Li*(it.open?.3:.38);for(let m=0;m<=4;m++)for(let n=0;n<7;n++){const v=m/4,an=n/7*6.283,rr=rw*Math.pow(Math.sin(Math.PI*Math.min(.97,.06+.94*v)),.6)*(it.open?.6+.5*v:1),p=PJ(B,it.base,[Math.cos(an)*rr,Math.sin(an)*rr,v*it.Li]);pts.push([p[0],p[1]])}
        if(!it.open){db+=smooth(hull2(pts));if(!LOD){const hp=PJ(B,it.base,[-rw*.25,rw*.3,it.Li*.62]);dbh+=l41C(hp[0],hp[1],Math.max(.45,rw*.2))}zI+=lightI(it.ax);continue}
        di+=smooth(hull2(pts));
        /* the tuft: threads out of the cup, splayed round its axis */
        const tc=V3.add(it.base,V3.sc(it.ax,it.Li*.82)),c0=l48Q(tc),X=B[0],Y=B[1];
        for(let m=0;m<nth;m++){const be=(.1+1.35*((m*.618+it.i*.37)%1))*(.55+.45*it.h),ga=m*2.39996+it.i,d=V3.nz(V3.add(V3.sc(it.ax,Math.cos(be)),V3.sc(V3.add(V3.sc(X,Math.cos(ga)),V3.sc(Y,Math.sin(ga))),Math.sin(be)))),
            ln=Dm*(.5+.35*((m*.37+it.i*.53)%1))*it.h*it.taper,e=l48Q(V3.add(tc,V3.sc(d,ln))),seg=`M${f(c0[0])},${f(c0[1])}L${f(e[0])},${f(e[1])}`;dt+=seg;if(m%2===0&&d[2]>-.2)dl+=seg}
        zI+=lightI(V3.nz(V3.add(it.ax,[0,0,.3])))}
      const I=zI/grp.length,face=side>0,tc=l48T(cache,face?thc:mix(thc,'#3a2a3a',lite?.08:.1),face?I:I-.08),lc2=lite?'#ffffff':lt(thc,.35),
        ic=l48T(cache,invc,face?.5:.35),bc=l48T(cache,mix(cw.bud,'#8aa86a',.42),face?.72:.58);
      parts.push({z:A.zk(sm,zc+side*Dm*.5),fn:par=>{
        if(db){E('path',{d:db,fill:bc,stroke:shd(cw.bud,-.45),'stroke-width':.4,'stroke-opacity':.6},par);if(dbh)E('path',{d:dbh,fill:'#ffffff',opacity:.22},par)}
        if(di)E('path',{d:di,fill:ic,stroke:shd(invc,-.4),'stroke-width':.35,'stroke-opacity':.5},par);
        if(dt){E('path',{d:dt,stroke:tc,'stroke-width':f(Math.max(1.05,Dm*.075)),fill:'none','stroke-linecap':'round'},par);if(dl&&!LOD&&face)E('path',{d:dl,stroke:lc2,'stroke-width':1.05,'stroke-opacity':lite?.6:.35,fill:'none','stroke-linecap':'round'},par)}}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:5.4,bc:SC}}

/* ---------- ornamental sage (Salvia nemorosa 'Caradonna', 'Ostfriesland', 'Schneehügel', 'Sensation Rose'; S. farinacea 'Victoria Blue', 'Strata'): a square stem,
   opposite ovate leaves, crenate and wrinkled (their veins pressed in), on short petioles below, sessile above; the stem ends in a slender spike, and the top pair of axils
   sends out two shorter, younger side spikes. Along the spike, whorls of small two-lipped flowers — the upper lip a hood, the lower one spread, three-lobed —
   each out of a tubular calyx, coloured (purple in nemorosa, woolly blue or silver in farinacea), the calyces staying on when the corollas fall;
   the whorls open from the bottom up, the tip a cone of coloured calyces and bracts. Drawn by bands: the calyces of a band, then its corollas, two paths ---------- */
const CW_L48SAL=[{id:'violet',n:'Violet profond (Caradonna)',c:'#4a2e7a',fc:'#5e40a8',cal:'#3e2456',st:'#3e2c44'},{id:'bleu-violet',n:'Bleu violet (Ostfriesland)',c:'#5a4aa6',fc:'#6a58bc',cal:'#5a3470'},
  {id:'bleu',n:'Bleu (farinacea Victoria Blue)',c:'#4a5ab6',cal:'#46509a',far:1},{id:'strata',n:'Bleu à calice argent (farinacea Strata)',c:'#4a5ab6',cal:'#dfe2ea',far:1},
  {id:'mauve',n:'Mauve (Amethyst)',c:'#9a5aa0',cal:'#6e3c72'},{id:'rose',n:'Rose (Sensation Rose)',c:'#e090b8',cal:'#a85a82'},{id:'blanc',n:'Blanc (Schneehügel)',c:'#e6e8f2',cal:'#a4b090'}];
/* a sage leaf on the screen at (x,y) along ang: ovate, its margin crenate, a short petiole, the veins pressed into the blade (a dark groove, a light ridge beside it) */
function l48SageLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.3,o.face??.7),pl=len*(o.pet??.14),bl=len-pl,W=bl*(o.w||.24),n=18,bend=(o.bend??R(-.1,.1))*len,Lt=[],Rt=[],M=[];
  for(let i=0;i<=n;i++){const t=i/n,x0=pl+bl*t,cy=bend*t*t,w=W*LS_OVATE(t)*(i%2?1:.93)*(i===n?.3:1);M.push([x0,cy]);Lt.push([x0,cy-w*ct]);Rt.push([x0,cy+w*ct])}
  E('path',{d:`M0,0Q${f(pl*.5)},${f(bend*.01)} ${f(pl+1)},0`,stroke:P.d1,'stroke-width':f(Math.max(1.05,len*.035)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:smooth(Lt.concat(Rt.slice().reverse())),fill:toneAt(P,o.I??.55),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);if(LOD)return g;
  E('path',{d:smooth(M.concat(Rt.slice().reverse())),fill:P.d1,opacity:.3},g);
  let dv=smooth(M.slice(0,n),false),dr='';for(let j=1;j<=5;j++){const t=j/6.5,i=Math.round(t*n),m=M[i];for(const sd of[-1,1]){const e=sd<0?Lt[Math.min(n,i+3)]:Rt[Math.min(n,i+3)],c=[m[0]+(e[0]-m[0])*.45,m[1]+(e[1]-m[1])*.75];
    const v=`M${f(m[0])},${f(m[1])}Q${f(c[0])},${f(c[1])} ${f(m[0]+(e[0]-m[0])*.9)},${f(m[1]+(e[1]-m[1])*.86)}`;dv+=v;dr+=`M${f(m[0]+1)},${f(m[1]-sd*.5)}Q${f(c[0]+1)},${f(c[1]-sd*.5)} ${f(m[0]+(e[0]-m[0])*.9+1)},${f(m[1]+(e[1]-m[1])*.86-sd*.5)}`}}
  E('path',{d:dv,stroke:shd(col,-.3),'stroke-width':f(Math.max(.5,len*.012)),'stroke-opacity':.7,fill:'none'},g);E('path',{d:dr,stroke:P.l2,'stroke-width':.45,'stroke-opacity':.45,fill:'none'},g);return g}
/* one floret in its frame B (z out of the calyx, y toward the tip of the spike) at O, s long: the calyx outline, the corolla outline (hood, tube and lip) when h>0 */
function l48SalFloret(B,O,s,h,far){const cal=[],cor=[];
  for(let m=0;m<=4;m++){const v=m/4,rr=s*(.06+.05*v)*(far?1.12:1);for(let n=0;n<6;n++){const an=n/6*6.283,p=PJ(B,O,[Math.cos(an)*rr,Math.sin(an)*rr+s*.03*v,v*s*.38]);cal.push([p[0],p[1]])}}
  if(h<=0)return{cal:smooth(hull2(cal)),cor:''};
  let d='';const ring=(C,r,ry,arr)=>{for(let n=0;n<6;n++){const an=n/6*6.283,p=PJ(B,O,[C[0]+Math.cos(an)*r,C[1]+Math.sin(an)*ry,C[2]]);arr.push([p[0],p[1]])}};
  if(h<.45){/* a bud: the corolla's tip out of the calyx, curved up */const bp=[];for(let m=0;m<=3;m++){const v=m/3;ring([0,s*.05*v*v,s*(.3+.28*v*(.5+h))],s*(.06-.025*v),s*.05,bp)}return{cal:smooth(hull2(cal)),cor:smooth(hull2(bp))}}
  const hh=sm01((h-.45)/.55),tube=[],hood=[],lip=[];for(let m=0;m<=2;m++)ring([0,0,s*(.3+.12*m)],s*.055,s*.055,tube);
  /* the hood: arching up and out */
  for(let m=0;m<=4;m++){const t=m/4;ring([0,s*(.05+(.3*t-.12*t*t)*hh),s*(.4+.34*t*(.6+.4*hh))],s*(.055+.03*Math.sin(Math.PI*t)),s*.045,hood)}
  /* the lip: a broad three-lobed apron spreading out and down from the throat */
  const lc=[0,-s*.06,s*.5],ld=V3.nz([0,-.75,.66]);for(let n=0;n<10;n++){const an=n/10*6.283,lo=1+.18*Math.cos(an*3),q=[Math.cos(an)*s*.17*lo*hh,ld[1]*(Math.sin(an)+1)*s*.13*hh,lc[2]+ld[2]*(Math.sin(an)+1)*s*.13*hh];const p=PJ(B,O,[q[0],lc[1]+q[1],q[2]]);lip.push([p[0],p[1]])}
  const pt=PJ(B,O,[0,0,s*.42]);lip.push([pt[0],pt[1]]);
  return{cal:smooth(hull2(cal)),cor:smooth(hull2(tube))+smooth(hull2(hood))+smooth(hull2(lip))}}
/* the spike on the axis A from the length l0: nW whorls of nf florets, open from the bottom (spent calyces at its foot when old), coloured bud whorls, the tip a cone of calyces */
function l48SalRace(A,parts,l0,nW,Dm,cw,fo,cache,o={}){const Lr=A.L-l0,nf=LOD?3:DET>=1.5?6:4,nO=Math.round(nW*fo),nS=o.spent||0,nb=Math.max(3,Math.round(nW/3)),s0=A.sOf(l0),cuts=[s0];
  for(let j=1;j<=nb;j++)cuts.push(s0+(1-s0)*j/nb);l41StemP(A,parts,cuts,o.w0||1.8,1.05,o.SC,1,s0,1);const items=[];
  for(let i=0;i<nW;i++){const q=i/Math.max(1,nW-1),l=l0+Lr*(.02+.97*spQ(i,nW,.45)),s=A.sOf(l),f0=A.at(s),open=i<nO,h=i<nS?0:open?(i>=nO-2?.55+.2*(nO-1-i):1):Math.max(0,.4-.5*(i-nO)/Math.max(1,nW-nO)),sz=Dm*(1-.3*q)*(open?1:.85-.3*(i-nO)/Math.max(1,nW-nO));
    for(let m=0;m<nf;m++){const az=(m/nf*360+i*(180/nf)+R(-12,12))*D,r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),el=open?.32+R(-.08,.1):.7+.4*q,
      ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f0.T,Math.sin(el)))),base=V3.add(f0.p,V3.sc(r,.9));items.push({s,ax,T:f0.T,base,sz,h:open||i>=nO?h:0,rz:V3.dot(r,[0,0,1]),m})}}
  for(let j=0;j<nb;j++){const a=cuts[j],b=cuts[j+1],band=items.filter(it=>it.s>=a-1e-9&&(it.s<b||j===nb-1));if(!band.length)continue;const sm=(a+b)/2,zc=A.cb(sm)[2];
    for(const side of[-1,1]){const grp=band.filter(it=>(it.rz>=0?1:-1)===side);if(!grp.length)continue;let dc='',dr='',zI=0;
      for(const it of grp){const F=l48SalFloret(spFrame(it.ax,it.T,R(-.15,.15)),it.base,it.sz,it.h,cw.far);dc+=F.cal;dr+=F.cor;zI+=lightI(V3.nz(V3.add(it.ax,[0,0,.3])))}
      const I=zI/grp.length,face=side>0,cc=l48T(cache,cw.cal,face?I-.05:I-.2),fc=cw.fc||cw.c,rc=l48T(cache,fc,face?I+.06:I-.12),lite=h2l(fc)[2]>.8;
      parts.push({z:A.zk(sm,zc+side*Dm*.4),fn:par=>{E('path',{d:dc,fill:cc,stroke:shd(cw.cal,-.45),'stroke-width':.35,'stroke-opacity':.6},par);
        if(dr)E('path',{d:dr,fill:rc,stroke:shd(fc,lite?-.4:-.35),'stroke-width':.35,'stroke-opacity':lite?.8:.55,'stroke-linejoin':'round'},par)}})}}}
function l48SalSpike(g,t,o){const cw=cwPick(CW_L48SAL,o),far=!!cw.far,op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||15)*UPC,Lt=sp?blen(o.spine):Lf0*2.6,Dm=(far?1.45:1.35)*UPC*R(.94,1.06),st=cw.st||'#4a5e38',SC=[shd(st,-.2),st,mix(st,'#9ab07a',.4),mix(st,'#c8d8a8',.55)],lc=far?'#5e7a52':'#4e6a38';
  const nLat=sp&&o.short?0:2;let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.7,.7),wig:.03,e:.07,seg:7,w:3.6,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.72:.55:.4));const Lb=L-Lfl,n=sp?3:4,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/Math.max(1,n-1);N.push({l:Lb*(.1+.72*u)*R(.97,1.03),phi:ph0+j*90,kink:R(.5,1.5),leaf:{m:2,a:52-12*u+R(-5,5),len:UPC*(far?7.5-2.5*u:6.5-2.5*u)*R(.9,1.1),w:far?.2:.3,pet:.2-.12*u}})}
    /* the top pair: small leaves and in their axils two side spikes */
    const l=Lb*.94;N.push({l,phi:ph0+n*90,kink:R(.3,1),leaf:{m:2,a:36,len:UPC*2.6*R(.9,1.1),w:far?.2:.3,pet:.04},lat:nLat&&(!sp||l>L*.3)?{len:Lfl*R(.5,.66),a:R(24,32),e:.05,w:2.2}:null});
    if(nLat>1&&(!sp||l>L*.3))N.push({l:l+1.2,phi:ph0+n*90+180,kink:0,lat:{len:Lfl*R(.42,.58),a:R(24,32),e:.05,w:2.2}});
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0*.5,s0],3.6,2.2,SC,s0);
  l48Leaves(P,parts,sp,(par,x,y,ang,len,face,dr,lv)=>l48SageLeaf(par,x,y,ang,len,lc,{face,w:lv.w,pet:lv.pet,bend:dr*R(.08,.18)}));
  const fo=op<.2?0:Math.min(.8,.1+.7*op);
  P.lats.forEach((lt,m)=>{const As=lt.A;spStemP(As,parts,[0,.22],lt.nd.lat.w,1.6,SC);l48SalRace(As,parts,As.L*.22,Math.max(5,Math.round(As.L*.78/(Dm*.72))),Dm*.92,cw,fo*(.6-.1*m),cache,{SC,w0:1.6})});
  l48SalRace(A,parts,L-Lfl,Math.max(8,Math.round(Lfl/(Dm*.72))),Dm,cw,fo,cache,{SC,w0:2,spent:op>.88?Math.round(R(1,3)):0});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:3.6,bc:SC}}

/* ---------- garden phlox (Phlox paniculata 'David', 'Bright Eyes', 'Blue Paradise', 'Orange Perfection', 'Starfire', 'Laura', 'Franz Schubert'):
   a stiff stem with opposite lanceolate, pointed leaves; at its top a broad domed, slightly conical panicle 10–18 cm of fragrant salver-shaped flowers 2.5–3.5 cm —
   a long slender tube and five flat, broad, rounded lobes — often with a contrasting eye; the buds slim clubs, twisted at their tips, at the edges of the panicle;
   younger panicles on side shoots from the upper axils. Cost: a floret one outline, its eye one more when it faces the eye, its tube only when it shows; the far side
   of the dome hidden behind its cushion is not drawn ---------- */
const CW_L48PHX=[{id:'lilas',n:'Lilas bleuté (Blue Paradise)',c:'#b6a6e0',eye:'#6e4aa8'},{id:'blanc',n:'Blanc (David)',c:'#f7f5ee',eye:'#e6e8c8'},
  {id:'rose-oeil',n:'Rose à œil rouge (Bright Eyes)',c:'#e98fb0',eye:'#c01e4e'},{id:'cerise',n:'Rose cerise (Miss Pepper)',c:'#d8287e',eye:'#9a0e4a'},
  {id:'saumon',n:'Saumon à œil carmin (Orange Perfection)',c:'#f2836a',eye:'#c42838'},{id:'lavande',n:'Lavande à œil pourpre (Franz Schubert)',c:'#c3a6dc',eye:'#8a5ab0'},
  {id:'rouge',n:'Rouge cramoisi (Starfire)',c:'#c0183a',eye:'#7e0c24'},{id:'pourpre',n:'Pourpre à œil blanc (Laura)',c:'#8a4aa8',eye:'#f4eef6'}];
/* the panicle in its frame B (z up its axis) on O, Dm across when open: florets on a raised dome over a cushion of branches, buds round its edge, drawn far to near */
function l48PhxHead(par,B,O,Dm,cw,op,o={}){const g=G(par),q=sm01((op-.08)/.86),rot=R(0,6.283),det=DET>=1.5,lod=LOD?.6:1,cache={},S=o.sz||1,rf=Dm*(det?.115:.13)*S,
    Rs=Dm*(.3+.17*q)*S,al=(46+26*q)*D,ez=1.22,H0=Rs*ez*(1-Math.cos(al))-Dm*.05*S,Cc=[0,0,H0-Rs*ez],N=Math.max(10,Math.round((det?66:38)*lod*(o.nk||1))),nB=Math.round(N*(1-.8*q)),items=[],el=toV(B,[0,0,1])[2],
    at=n=>V3.add(Cc,[n[0]*Rs,n[1]*Rs,n[2]*Rs*ez]);
  /* the cushion: the branched panicle under the florets, so nothing floats */
  const cq=[];for(let i=0;i<14;i++){const a=i/14*6.283;for(const th of[0,al*.9]){const n=[Math.sin(th)*Math.cos(a),Math.sin(th)*Math.sin(a),Math.cos(th)],p=PJ(B,O,V3.sc(V3.add(at(n),[0,0,0]),.78));cq.push([p[0],p[1]])}}
  const ob=PJ(B,O,[0,0,-Dm*.16*S]);cq.push([ob[0],ob[1]]);E('path',{d:smooth(hull2(cq)),fill:mix(shd(cw.c,-.35),'#4e7034',.8),stroke:'#2e4420','stroke-width':.4,'stroke-opacity':.5},g);
  {let dr='';for(let i=0;i<9;i++){const a=i/9*6.283+rot,n=[Math.sin(al*.82)*Math.cos(a),Math.sin(al*.82)*Math.sin(a),Math.cos(al*.82)],e=PJ(B,O,V3.sc(at(n),.86)),c=PJ(B,O,V3.sc(at(n),.4));
    dr+=`M${f(ob[0])},${f(ob[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`}E('path',{d:dr,stroke:'#4f7234','stroke-width':f(Math.max(1.05,Dm*.012)),fill:'none','stroke-linecap':'round'},g)}
  const cB=1-Math.cos(al);
  for(let i=0;i<N;i++){const t=(i+.5)/N,ct=1-t*cB,th=Math.acos(ct),ph=i*2.39996+rot,n0=V3.nz([Math.sin(th)*Math.cos(ph)+R(-.05,.05),Math.sin(th)*Math.sin(ph)+R(-.05,.05),ct]),
      P=at(n0),n=V3.nz([n0[0],n0[1],n0[2]/ez]),X=V3.nz(V3.cr(Math.abs(n[2])<.9?[0,0,1]:[1,0,0],n)),Y=V3.cr(n,X),nV=toV(B,n),z=PJ(B,O,P)[2],bud=i>=N-nB;
    if(nV[2]<-.32)continue;
    if(bud){/* a bud: a slim club, its folded tip twisted, deeper in colour */const age=q,lb=rf*(.95+.5*age),bc=mix(shd(cw.c,-.12),'#94ac6c',.38-.3*age),pr=prof([[0,.14],[.4,.18],[.7,.3],[.9,.32],[1,.06]]),bp=[];
      for(let a=0;a<=6;a++){const v=a/6,r=Math.max(.45,pr(v)*rf*(.9+.4*age));for(let m=0;m<7;m++){const w=m/7*6.283,s=PJ(B,O,V3.add(V3.add(P,V3.sc(n,lb*(v-.5))),V3.add(V3.sc(X,Math.cos(w)*r),V3.sc(Y,Math.sin(w)*r))));bp.push([s[0],s[1]])}}
      items.push({z:z+lb*.3*nV[2],fn:()=>E('path',{d:smooth(hull2(bp)),fill:l48T(cache,bc,lightI(nV[2]>=0?nV:V3.sc(nV,-1))*.95),stroke:shd(bc,-.5),'stroke-width':.35,'stroke-opacity':.6},g)});continue}
    const sz=rf*R(.88,1.06)*(.78+.22*q),front=nV[2]>=0,col=front?cw.c:mix(cw.c,'#c8ccb8',.18),pts=[];
    /* the five broad, rounded lobes, flat, a little cupped */
    for(let kk=0;kk<5;kk++){const a0=kk*1.2566+ph*1.7;for(const da of[-.6,-.4,-.2,0,.2,.4]){const a=a0+da,rr=sz*(.28+.72*Math.pow(Math.max(0,Math.cos(da/.63*1.5708)),.32)),p=V3.add(P,V3.add(V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)),V3.sc(n,sz*.08*(rr/sz)*(rr/sz)))),s=PJ(B,O,p);pts.push([s[0],s[1]])}}
    const I=front?lightI(nV):lightI(V3.sc(nV,-1))*.85,fill=l48T(cache,col,.24+.56*I),lite=h2l(col)[2]>.8;
    if(nV[2]<.45&&det){/* the slender tube, seen from the side */const a=PJ(B,O,P),b=PJ(B,O,V3.add(P,V3.sc(n,-sz*1.25))),C=[[a[0],a[1]],[(a[0]+b[0])/2,(a[1]+b[1])/2],[b[0],b[1]]],tc=mix(col,'#dfe4c8',.3);
      items.push({z:z-sz*.6*nV[2]-.01,fn:()=>E('path',{d:smooth(chpTube(C,[sz*.13,sz*.11,sz*.1],2)),fill:l48T(cache,tc,.6),stroke:shd(tc,-.45),'stroke-width':.3,'stroke-opacity':.55},g)})}
    items.push({z,fn:()=>{E('path',{d:smooth(pts),fill,stroke:lite?shd(col,-.38):shd(col,-.32),'stroke-width':.35,'stroke-opacity':lite?.75:.6,'stroke-linejoin':'round'},g);
      if(nV[2]>.18){/* the eye: a little five-pointed star round the mouth of the tube */const ep=[];for(let kk=0;kk<10;kk++){const a=kk*.6283+ph*1.7,rr=sz*(kk%2?.14:.28),s=PJ(B,O,V3.add(P,V3.add(V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)),V3.sc(n,sz*.01))));ep.push([s[0],s[1]])}
        const c=PJ(B,O,P);E('path',{d:smooth(ep)+(det&&!LOD?l41C(c[0],c[1],Math.max(.5,sz*.07)):''),fill:h2l(cw.eye)[2]>.85?mix(cw.eye,col,.2):cw.eye,'fill-rule':'evenodd',stroke:shd(cw.eye,-.25),'stroke-width':.25,'stroke-opacity':.5},g)}}})}
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn();return g}
function l48PhxPlant(g,t,o){const cw=o.cw||cwNear(CW_L48PHX,o.col)||CW_L48PHX[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||12)*UPC,k=G(g),B=frameOf(o,.4,true),
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),A0h=V3s(A0,V3.sc(up,V3.dot(A0,up))),aim=V3.nz(V3.add(V3.sc(A0h,.4),V3.sc(up,Math.max(.55,V3.dot(A0,up)+.6)))),sc=['#2e4a20','#4c7034','#76985a','#a8c48a'];
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.6,mainB:l41Fr(V3.nz(V3.add(V3.add([0,1.1,0],V3.sc(up,.6)),V3.sc(A0h,.3))),A0h),D:Dm,w:Dm*.045,cols:sc,op,nodes:2,li:.55,lp:1,opp:1,leafAng:50,side:{p:.75,n:1,top:2,len:.7,ang:30,age:[0,.6],e:.05,w:.55},seg:.1,wig:.03,e:.015,
    apex:Bm=>V3.sc(Bm[2],Dm*.06),
    flower:(par,Bf,O,op2)=>l48PhxHead(par,Bf,O,Dm,cw,op2),
    young:(par,Bf,O,a)=>l48PhxHead(par,Bf,O,Dm*.5,cw,a*.6,{nk:.3}),
    leaf:(og,pos)=>{const len=Dm*(og.p.i<=1?R(.38,.48):R(.58,.7));return DET>=1.5?l31Leaf3(og,pos,len,.26,'#4a7034',{wp:LS_LANCE,nv:5,droop:.16,fold:.24}):lsLeaf2D(og,pos,len,(par,x,y,a,l)=>lanceFlat(par,x,y,a,l,.26,'#4a7034',{tilt:R(.2,.7),fold:.3}))}});
  open(k,t,1000,8,.3);return r}

/* ---------- daisy spray chrysanthemum (Chrysanthemum × morifolium, spray single — 'Bacardi' and its sports, daisy sprays): a branched, flat-topped spray of 6 to 10 single heads
   4–6 cm — one or two rows of broad, rounded rays round a small disc, green in the 'Bacardi' kind, yellow in the others — the terminal head first, buds on the side forks;
   lobed, aromatic, grey-green leaves along the stem. Light by design: in the bouquet a head is its back row of rays, its front row, its disc (and its cup behind), a bud one path ---------- */
const CW_L48MUM=[{id:'blanc',n:'Blanc à cœur vert (Bacardi)',c:'#f7f5ee',disc:'#9cb83a',dr:'#d8d84a'},{id:'creme',n:'Crème à cœur vert (Bacardi Cream)',c:'#f2e6b8',disc:'#9cb83a',dr:'#d8d84a'},
  {id:'jaune',n:'Jaune à cœur vert (Bacardi Sunny)',c:'#f5d22c',disc:'#94ac34',dr:'#d8c83a'},{id:'blanc-jaune',n:'Blanc à cœur jaune',c:'#f6f3ea',disc:'#e8b828'},
  {id:'rose',n:'Rose à cœur jaune',c:'#ec8fb0',disc:'#e6b42a'},{id:'fuchsia',n:'Rose fuchsia à cœur jaune',c:'#e2457e',disc:'#e2ae28'},
  {id:'orange',n:'Orange cuivré',c:'#f08a2a',disc:'#c89a22'},{id:'rouge',n:'Rouge à cœur jaune',c:'#c41f2e',disc:'#e0ac28'}];
const L48_MRAY=prof([[0,.4],[.2,.85],[.6,1],[.9,.9],[1,.55]]);
function l48MumHead(par,B,O,D0,cw,age){const k=G(par),R0=D0/2,nz=B[2][2],o2=sm01((age-.3)/.7),det=DET>=1.5&&!LOD,c=cw.c,rd=R0*(.2+.06*(1-o2)),lite=h2l(c)[2]>.82,rot=R(0,6.28),n=det?22:18,
    a0=.3+1.05*o2,a1=a0+.12+.14*o2,Lr=R0*(.82-rd/R0)*(.55+.45*o2);
  const cup=()=>E('path',{d:smooth(hull2(spDisc(B,O,rd*1.05,-R0*.04,10).concat(spDisc(B,O,rd*.55,-R0*.2,8)))),fill:'#5a7440',stroke:'#34482a','stroke-width':.35,'stroke-opacity':.6},k),
    disc=()=>capDisc(k,B,O,rd,rd*(.32+.25*(1-o2)),cw.disc,{dots:det?18:0,dc:cw.dr||shd(cw.disc,-.35)});
  if(nz<.3)cup();
  if(det){const it=[];for(let i=0;i<n;i++)it.push({l:ligule(B,O,{phi:i/n*6.283+rot+R(-.04,.04),r0:rd*.92,z0:0,L:Lr*(i%2?.92:1)*R(.95,1.04),W:R0*.13,wp:L48_MRAY,a0:a0+(i%2?-.06:0),a1,pw:1.2,th:.35,tip:'round',n:5,tw:R(-.2,.2)}),c:mix(c,shd(c,R(-.08,.05)),.5),ink:lite?shd(c,-.42):null,noov:1});drawLig(k,it)}
  else{/* light: each ray a rounded strap, the back row and the front row each one path, toned by the facing of the head */
    const back=nz<0,P=pal7(back?mix(c,'#e8e4d8',.22):c),I=lightI(back?V3.sc(B[2],-1):B[2]);let d0='',d1='';
    for(let i=0;i<n;i++){const ph=i/n*6.283+rot,cs=Math.cos(ph),sn=Math.sin(ph),T=[-sn,cs,0],L=Lr*(i%2?.9:1),W=R0*.13,pts=[],e0=a0+(i%2?-.06:0),q=[];
      for(let m=0;m<=4;m++){const v=m/4,a=e0+(a1-e0)*v*v,ctr=V3.add([cs*rd*.92,sn*rd*.92,0],[cs*Math.sin(a)*L*v,sn*Math.sin(a)*L*v,(Math.cos(e0)+Math.cos(a))*.5*L*v]);q.push(ctr)}
      for(let m=0;m<=4;m++){const w=W*L48_MRAY(m/4);pts.push(PJ(B,O,V3.add(q[m],V3.sc(T,w))))}const tp=PJ(B,O,V3.add(q[4],[cs*W*.25,sn*W*.25,0]));pts.push(tp);
      for(let m=4;m>=0;m--){const w=W*L48_MRAY(m/4);pts.push(PJ(B,O,V3s(q[m],V3.sc(T,w))))}const dd=smooth(pts.map(p=>[p[0],p[1]]));if(i%2)d1+=dd;else d0+=dd}
    const ink=lite?shd(c,-.42):P.d1;E('path',{d:d0,fill:toneAt(P,I-.07),stroke:ink,'stroke-width':.3,'stroke-opacity':lite?.75:.5},k);E('path',{d:d1,fill:toneAt(P,I+.03),stroke:ink,'stroke-width':.3,'stroke-opacity':lite?.75:.5},k)}
  if(nz<0)cup();else if(nz>-.1)disc();return k}
function l48MumBud(par,B,O,s,cw,a){spBud(par,B,V3.add(O,toV(B,[0,0,-s*.42])),s,s*.88,mix('#5f8a3a',cw.c,.06+.55*a),{tp:.25,pw:.55});return par}
function l48MumPlant(g,t,o){const cw=o.cw||cwNear(CW_L48MUM,o.col)||CW_L48MUM[0],op=Math.max(.05,Math.min(1,o.op??1)),Hs=(o.cm||30)*UPC*1.3*(o.rim?.4:1),dh=5*UPC*R(.9,1.08),k=G(g),sc=['#334a2a','#56703c','#7a945a','#a8bc88'],lc='#557048';
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.3,B.reach*.45/(Hs*.45))):1,L=Hs*kr,nb=o.rim?2:Math.round(R(5,7)),pOpen=op<.3?.0:op<.7?.5:.9;
  const age=()=>rnd()<pOpen?R(.6,1):R(.05,op<.3?.3:.42),hd=a=>[a>.42?'K':'Kb',{age:a}],w0=Math.max(1.6,dh*.07);
  /* S: the leafy stem; B(i): the top of the stem, a branch at each node (the lower ones longer, so the heads come level: a flat-topped spray), the terminal head first;
     C: a branch, a leaf at its foot, its head, sometimes a fork with a bud or a younger head */
  const rules={S:()=>[['F',{l:L*.16,w0:w0*1.1,w1:w0}],['Lv',{s:1.2}],['F',{l:L*.13,w1:w0*.95}],['Lv',{s:1.1}],['F',{l:L*.1,w1:w0*.9}],['Lv',{s:1}],['B',{i:0}]],
    B:p=>{if(p.i>=nb)return[['F',{l:L*.08,w1:w0*.7}],['Ap',{}],['F',{l:L*.05,w1:w0*.6}],hd(op<.3?R(.2,.4):1)];const q=p.i/nb,bl=L*(.42-.24*q)*R(.88,1.12);
      return[['F',{l:L*(.3/nb)*R(.8,1.2),w1:w0*(.9-.25*q)}],['Lv',{s:.8-.3*q}],['[',{w:w0*.6}],['/',{a:137.5*p.i+R(-20,20)}],['&',{a:R(28,40)}],['C',{l:bl,f:rnd()<.6}],[']',{}],['B',{i:p.i+1}]]},
    C:p=>[['F',{l:p.l*.45,w1:Math.max(1.1,w0*.5),e:.05}],['Lv',{s:.5}],...(p.f?[['[',{w:Math.max(1.05,w0*.35)}],['/',{a:R(-180,180)}],['&',{a:R(30,46)}],['F',{l:p.l*R(.25,.4),w1:Math.max(1.05,w0*.3),e:.05}],hd(op<.3?R(.05,.3):R(.1,1)*R(.3,1)),[']',{}]]:[]),
      ['F',{l:p.l*.55,w1:Math.max(1.05,w0*.42),e:.05}],hd(age())]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,nb+5),{p:[0,0,0],H:up,U:U0,wig:.04,seg:dh*.4,T:[0,1,0],e:.025,w:w0*1.1});for(const ch of res.chains)ch.c=sc;
  const ap=res.organs.find(q=>q.t==='Ap')||res.organs.find(q=>q.t==='K'),apex=ap.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:8,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=faceFrame(og,face,.55),s=dh*R(.88,1.1);return{parts:[{z:pos[2],fn:par=>l48MumHead(par,Bf,pos,s,cw,og.p.age)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,0),s=dh*(.18+.2*og.p.age);return{parts:[{z:pos[2],fn:par=>l48MumBud(par,Bf,pos,s,cw,og.p.age/.42)}]}}
    if(og.t==='Lv'){const s=og.p.s,sd=rnd()<.5?1:-1,H=V3.nz(V3.add(og.H,V3.sc(og.L,sd*1.1))),len=dh*R(.8,1.05)*s;return{ext:s>.9,parts:[lsLeaf2D(Object.assign({},og,{H}),pos,len,(par,x,y,a,l)=>mumLeaf(par,x,y,a,l,lc,{tilt:R(.25,.6)}))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- registries: godetia, liatris and sage are lines along the composer's spine; phlox and the daisy spray are heads grown on their stem ---------- */
Object.assign(GH,{'godetia-clarkia':l48GodSpike,'liatris':l48LiaSpike,'sauge-salvia':l48SalSpike,'phlox':l48PhxPlant,'chrysantheme-marguerite-spray':l48MumPlant});
Object.assign(CWS,{'godetia-clarkia':CW_L48GOD,'liatris':CW_L48LIA,'sauge-salvia':CW_L48SAL,'phlox':CW_L48PHX,'chrysantheme-marguerite-spray':CW_L48MUM});
Object.assign(SZG,{'godetia-clarkia':[15,18,20,20,25],'liatris':[20,25,30,30,35],'sauge-salvia':[10,12,15,15,18],'phlox':[9,10,12,12,14],'chrysantheme-marguerite-spray':[20,25,30,30,35]});
Object.assign(GHI,{'godetia-clarkia':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.8,fx:5*UPC},'liatris':{form:'epi',size:1,k:'plant',self:75*UPC,tip:.92,fx:3*UPC},
  'sauge-salvia':{form:'epi',size:1,k:'plant',self:50*UPC,tip:.85,fx:2.6*UPC},'phlox':{form:'sphere',size:1.8,k:'head',rk:.95},'chrysantheme-marguerite-spray':{form:'grappe',size:2.5,k:'head',rk:.5}});
for(const id of['godetia-clarkia','liatris','sauge-salvia','phlox','chrysantheme-marguerite-spray'])GH_BUDS.add(id);
