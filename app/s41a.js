/* ================= Serre, lot 41 — printemps 3, poussés par le L-système : boule de neige, fritillaire de Perse, eremurus, narcisse trompette, cyrtanthus ================= */
/* les épis (eremurus, fritillaire) poussent comme ceux de la reprise 5 (spGrow) mais se dessinent par lots : les fleurons d'une bande de l'épi, devant ou derrière l'axe, en quelques chemins */
const l41Q=p=>[p[0],-p[1]],l41C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a light axis piece: the ribbon and one light, two paths (the rachis of a dense spike hides behind its florets) */
function l41Rib(par,P,W,c){const g=G(par),wf=i=>W[i]/2;E('path',{d:polyRibbon(P,wf),fill:c[0]},g);if(!LOD)E('path',{d:polyRibbon(P,i=>wf(i)*.5,i=>wf(i)*.32),fill:c[2],opacity:.8},g);return g}
/* the stem and rachis of a grown axis cut at the fractions cuts (as spStemP), each piece in the painter's order; lite: two paths a piece */
function l41StemP(A,parts,cuts,w0,w1,cols,s1=1,sa=0,lite=0){const wt=s=>w0+(w1-w0)*Math.max(0,Math.min(1,(s-sa)/((s1-sa)||1)));
  for(let j=0;j<cuts.length-1;j++){const a=cuts[j],b=cuts[j+1];if(b-a<1e-3)continue;const{q,s}=A.span(a,Math.min(1,b+(b<1?2.5/A.L:0))),P=q.map(l41Q),W=s.map(wt);let z=0;for(const p of q)z+=p[2];z/=q.length;
    (A.segs=A.segs||[]).push([a,b,z-.01]);parts.push({z:z-.01,fn:par=>lite?l41Rib(par,P,W,cols):stemPoly(par,P,W,cols)})}
  A.zk=(s,z)=>{const sg=A.segs.find(q=>s>=q[0]-1e-6&&s<=q[1]+1e-6);return sg?sg[2]+.011+(z-A.cb(s)[2]):z}}
/* a frame whose face looks along Z, its top toward Yh */
function l41Fr(Z,Yh,roll=0){Z=V3.nz(Z);let Y=V3s(Yh,V3.sc(Z,V3.dot(Yh,Z)));if(V3l(Y)<1e-4){Y=Math.abs(Z[1])<.9?[0,1,0]:[0,0,1];Y=V3s(Y,V3.sc(Z,V3.dot(Y,Z)))}Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* a cached tone of a colour lit at I (0..1, in 15 steps) */
const l41T=(cache,c,I)=>{const k=c+'|'+Math.round(Math.max(0,Math.min(1,I))*14);return cache[k]||(cache[k]=toneAt(pal7(c),Math.round(Math.max(0,Math.min(1,I))*14)/14))};
/* a waxy bloom over a dark colour (fritillary bells): a radial gradient, the bloom pale on the lit shoulder, the colour beneath it, darker at the rim */
const L41BL={};function l41Bloom(c,bl){const key=c+bl;const id=L41BL[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l41b'+(gid++),P=pal7(c),gr=E('radialGradient',{id:nid,cx:.34,cy:.3,r:.82},defs);
  stops(gr,[[0,mix(bl,'#ffffff',.25)],[.3,mix(c,bl,.55)],[.62,mix(c,bl,.18)],[.88,P.d1],[1,P.d2]]);L41BL[key]=nid;return`url(#${nid})`}

/* ---------- foxtail lily (Eremurus stenophyllus, E. × isabellinus 'Cleopatra', 'Pinokkio', 'Romance', E. himalaicus, E. robustus): a tall bare stem, its leaves all basal (cut stems carry none),
   ending in a very long dense raceme of hundreds of small starry flowers on spreading pedicels — six narrow tepals, six long stamens standing well clear with orange anthers;
   they open from the bottom up: withered florets at the foot when the spike is old, open stars, a few opening, then coloured buds and a tight cone of green-tinted buds at the tip.
   Drawn by bands: every band of the raceme, behind and in front of its axis, is its pedicels, its stars, its stamens and anthers (or its buds), a few paths; about a tenth of the old cost ---------- */
const CW_EREM=[{id:'orange',n:'Orange (Cleopatra)',c:'#f08c2a',bud:'#b8482a',st:'#f4a040',an:'#d8601a'},{id:'orange-jaune',n:'Orange doré (Pinokkio)',c:'#f2a83a',bud:'#c0602a',st:'#f6c050',an:'#d86a1a'},
  {id:'jaune',n:'Jaune (stenophyllus)',c:'#f5d22a',bud:'#b8a040',st:'#f6dc50',an:'#e08a1a'},{id:'jaune-pale',n:'Jaune pâle (Line Dance)',c:'#f3e08a',bud:'#b8b070',st:'#f4e8a8',an:'#e0a030'},
  {id:'saumon',n:'Saumon (Romance)',c:'#f4a88a',bud:'#b86a5a',st:'#f6c4b0',an:'#d8783a'},{id:'abricot',n:'Abricot (Cleopatra clair)',c:'#f2a87a',bud:'#b8684a',st:'#f6c098',an:'#d8702a'},
  {id:'rose',n:'Rose (robustus)',c:'#efb0c0',bud:'#a8707a',st:'#f4ccd6',an:'#d89a3a'},{id:'blanc',n:'Blanc (himalaicus)',c:'#f7f5ee',bud:'#b8c0a0',st:'#f6f2e6',an:'#e0a838'}];
function eremSpike(g,t,o){const cw=cwPick(CW_EREM,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine,det=DET>=1.5;
  const Lf0=(o.cm||60)*UPC,Lt=sp?blen(o.spine):Lf0*1.75,Dm=2.15*UPC*R(.94,1.06),SC=['#2c4220','#4c6e34','#76a050','#a8c884'];let Lfl=0;
  /* the stem: a few nodes without leaves, where it turns a little */
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.02,e:.1,seg:9,w:8,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.68:.56:.6))*(op<.25?.72+.8*op:1);const N=[],n=5,ph0=R(0,360),Lb=L-Lfl;for(let j=0;j<n;j++)N.push({l:Lb*(.15+.8*j/(n-1)),phi:ph0+j*137.5,kink:R(.3,1.1)});return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  /* the ages up the raceme: in bud nothing open yet (the lowest ones colouring), then the open band climbs; withered ones at the foot of an old spike */
  const nT=Math.max(40,Math.round(Lfl/UPC*(LOD?1.8:det?4.6:3.6)*R(.95,1.05))),fo=op<.25?.04:Math.min(.78,.08+.72*op),nO=Math.round(nT*fo),nH=nO?Math.max(2,Math.round(nT*(op<.25?.04:.05))):0,nS=op>.85?Math.round(nT*R(.05,.12)):0;
  const items=[];
  for(let i=0;i<nT;i++){const q=spQ(i,nT,.42),l=l0+Lfl*(.005+.99*q),s=A.sOf(l),az=(i*137.5+R(-12,12))*D,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));
    let kd,h=1;if(i<nS)kd='spent';else if(i<nO-nH)kd='open';else if(i<nO){kd='open';h=.3+.55*(nO-1-i)/Math.max(1,nH)}else kd='bud';
    const qb=kd==='bud'?(i-nO)/Math.max(1,nT-nO-1):0,
      /* the pedicels spread nearly flat below, shorter and pressed up toward the tip */
      pl=kd==='bud'?Dm*(.62-.5*qb):Dm*(kd==='spent'?.62:.72)*(.9+.1*h),el=kd==='bud'?.55+.75*qb:kd==='spent'?.15:.3+(1-h)*.4,
      ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f0.T,Math.sin(el)))),pos=V3.add(V3.add(f0.p,V3.sc(r,pl*.92)),V3.sc(f0.T,pl*(kd==='bud'?.25+.5*qb:.12)));
    items.push({i,s,kd,h,qb,r,ax,pos,node:f0.p,T:f0.T,rz:V3.dot(r,[0,0,1])})}
  /* the stem below, the rachis cut at the bands */
  const nb=Math.max(6,Math.round(Lfl/(7*UPC))),cuts=[s0];for(let j=1;j<=nb;j++)cuts.push(s0+(1-s0)*j/nb);
  l41StemP(A,parts,[0,s0*.5,s0],8,5,SC,s0);l41StemP(A,parts,cuts,3.6,1.2,SC.map(c=>shd(c,-.25)),1,s0,1);
  const ink=shd(cw.c,h2l(cw.c)[2]>.8?-.5:-.4),stc=mix(cw.st||cw.c,'#ffffff',.18),anc=cw.an||'#d8701a',pc=SC[1],spc=mix(mix(cw.c,'#9a7a4a',.6),'#6a5236',.25);
  for(let j=0;j<nb;j++){const a=cuts[j],b=cuts[j+1],band=items.filter(it=>it.s>=a-1e-9&&(it.s<b||j===nb-1));if(!band.length)continue;const sm=(a+b)/2,zc=A.cb(sm)[2];
    for(const side of[-1,1]){const grp=band.filter(it=>(it.rz>=0?1:-1)===side);if(!grp.length)continue;
      let dp='',ds='',dsp='',dst='',dan='',db='',dbh='',nI=0,zI=0;
      for(const it of grp){const B=spFrame(it.ax,it.T,(it.i*.7)%1),c0=l41Q(it.node),c1=l41Q(it.pos);
        dp+=`M${f(c0[0])},${f(c0[1])}Q${f((c0[0]+c1[0])/2-it.T[0]*Dm*.08)},${f((c0[1]+c1[1])/2+it.T[1]*Dm*.08)} ${f(c1[0])},${f(c1[1])}`;
        if(it.kd==='bud'){/* a bud: a small ovoid pointing up the spike, the colour coming through as it nears the open band */
          const sb=Dm*(.6-.32*it.qb),wb=sb*.44,pts=[];for(let m=0;m<=4;m++)for(let n=0;n<6;n++){const v=m/4,an=n/6*6.283,rr=wb*.5*Math.pow(Math.sin(Math.PI*Math.min(.98,.04+.96*v)),.7)*(1-.35*v),p=PJ(B,it.pos,[Math.cos(an)*rr,Math.sin(an)*rr,v*sb]);pts.push([p[0],p[1]])}
          db+=smooth(hull2(pts));const hp=PJ(B,it.pos,[-wb*.12,wb*.12,sb*.42]);dbh+=l41C(hp[0],hp[1],Math.max(.45,wb*.16));continue}
        const sp2=it.kd==='spent',rr=Dm/2*(sp2?.42:.45+.55*it.h),cup=sp2?.5:.12+.5*(1-it.h),pts=[],nt=6,rot=(it.i*.61)%1;
        for(let m=0;m<nt;m++){const a0=(m/nt+rot/nt)*6.283,a1=a0+3.1416/nt;
          const tip=PJ(B,it.pos,[Math.cos(a0)*rr,Math.sin(a0)*rr,cup*rr]),sh1=PJ(B,it.pos,[Math.cos(a0+.2)*rr*.62,Math.sin(a0+.2)*rr*.62,cup*rr*.55]),sh0=PJ(B,it.pos,[Math.cos(a0-.2)*rr*.62,Math.sin(a0-.2)*rr*.62,cup*rr*.55]),
            nch=PJ(B,it.pos,[Math.cos(a1)*rr*.24,Math.sin(a1)*rr*.24,cup*rr*.1]);pts.push(det?[sh0,tip,sh1,nch]:[tip,nch])}
        const flat=pts.flat();if(sp2)dsp+=fgD(flat);else ds+=fgD(flat);
        if(!LOD){/* the stamens: straight out of the star, a little splayed; at the end of each its anther */
          const ns=det?6:sp2?2:4,Ls=Dm*(sp2?.38:(.42+.48*it.h)),c=PJ(B,it.pos,[0,0,rr*.08]);for(let m=0;m<ns;m++){const a=(m/ns+rot/ns)*6.283+.4,e=PJ(B,it.pos,[Math.cos(a)*Ls*.42,Math.sin(a)*Ls*.42,Ls*.9]);
            dst+=`M${f(c[0])},${f(c[1])}L${f(e[0])},${f(e[1])}`;if(!sp2)dan+=l41C(e[0],e[1],Math.max(.56,Dm*.034))}}
        zI+=lightI(V3.nz(V3.add(it.ax,[0,0,.25])));nI++}
      const I=nI?zI/nI:.5,face=side>0,fill=face?l41T(cache,cw.c,I+.04):l41T(cache,mix(cw.c,'#d8d0b8',.12),I-.12),bfill=l41T(cache,mix(cw.bud||cw.c,'#7a9a52',.25),face?.55:.4);
      const zz=A.zk(sm,zc+side*Dm*.55);
      parts.push({z:zz,fn:par=>{const pw=f(Math.max(1.05,Dm*.055));E('path',{d:dp,stroke:pc,'stroke-width':pw,fill:'none','stroke-linecap':'round'},par);
        if(db){E('path',{d:db,fill:bfill,stroke:shd(cw.bud||cw.c,-.45),'stroke-width':.4,'stroke-opacity':.6},par);if(!LOD)E('path',{d:dbh,fill:'#ffffff',opacity:.28},par)}
        if(dsp)E('path',{d:dsp,fill:spc,stroke:shd(spc,-.45),'stroke-width':.4,'stroke-opacity':.6,'stroke-linejoin':'round'},par);
        if(ds)E('path',{d:ds,fill,stroke:ink,'stroke-width':.38,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
        if(dst)E('path',{d:dst+dan,stroke:face?stc:shd(stc,-.12),'stroke-width':f(Math.max(1.05,Dm*.045)),fill:anc,'stroke-linecap':'round'},par)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:8,bc:SC}}

/* ---------- Persian fritillary (Fritillaria persica 'Adiyaman', 'Ivory Bells'): a stiff stem clothed in its lower two thirds with many glaucous, lanceolate leaves set in a spiral,
   smaller up the stem; the raceme a narrow cone of twenty to thirty nodding conical bells on short arching pedicels, each from a little bract, plum purple under a grey waxy bloom
   (or greenish cream); they open from the bottom up, the top ones erect buds. One bell is two paths (pedicel and bract, the bell in its bloom), its mouth when it turns to the eye;
   about a fifth of the old cost ---------- */
const CW_FRIT=[{id:'prune',n:'Pourpre prune pruineux (Adiyaman)',c:'#5a2a4a',bl:'#9a94aa'},{id:'aubergine',n:'Aubergine (presque noir)',c:'#46263e',bl:'#8c88a0'},
  {id:'pourpre',n:'Pourpre lie-de-vin',c:'#6e2e48',bl:'#a898aa'},{id:'ivoire',n:'Vert crème (Ivory Bells)',c:'#e2e0bc',bl:'#f4f2e2',lip:'#b8c08a'},{id:'vert',n:'Vert tendre',c:'#a3b066',bl:'#c8d0b4'}];
function fritBell(par,B,O,Lb,cw,a,cache){const o2=Math.max(0,Math.min(1,a)),pts=[],nz=B[2][2];
  /* a broad cone, its six tepals flaring a little at the mouth */
  for(let m=0;m<=4;m++){const v=m/4,r=Lb*(.1+.27*Math.pow(v,.75)*(.75+.25*o2)+(v>.8?.04*o2:0));for(let n=0;n<8;n++){const an=n/8*6.283,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*Lb]);pts.push([p[0],p[1]])}}
  E('path',{d:smooth(hull2(pts)),fill:l41Bloom(cw.c,cw.bl),stroke:shd(cw.c,-.5),'stroke-width':.45,'stroke-opacity':.6},par);
  /* the mouth seen from below: dark inside, the tepal tips round it, the style */
  if(nz>.18&&o2>.4){const q=[],rr=Lb*(.37+.04*o2);for(let n=0;n<12;n++){const an=n/12*6.283,kr=n%2?.86:1,p=PJ(B,O,[Math.cos(an)*rr*kr,Math.sin(an)*rr*kr,Lb*(n%2?.96:1)]);q.push([p[0],p[1]])}
    const c=PJ(B,O,[0,0,Lb*.98]);E('path',{d:smooth(q)+(LOD?'':l41C(c[0],c[1],Math.max(.6,Lb*.05))),fill:cw.lip?mix(cw.lip,'#5a6a3a',.3):shd(cw.c,-.55),'fill-rule':'evenodd',stroke:cw.lip||mix(cw.c,cw.bl,.3),'stroke-width':.5,'stroke-opacity':.7},par)}}
function fritSpike(g,t,o){const cw=cwPick(CW_FRIT,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||22)*UPC,Lt=sp?blen(o.spine):Lf0*3.4,Lb0=2.3*UPC*R(.94,1.06),SC=['#3a4a3c','#5e7462','#8aa090','#b8c8bc'],lc='#7c9a90';let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.02,e:.1,seg:8,w:6.4,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.6:.4:.3))*(.62+.38*Math.min(1,op*1.4));const Lb=L-Lfl,n=sp?o.short?7:11:18,ph0=R(0,360),N=[];
    /* the leaves in a close spiral, the lowest longest, ascending, then smaller and more erect toward the raceme */
    for(let j=0;j<n;j++){const u=j/(n-1),l=Lb*(.04+.9*Math.pow(u,.9))*R(.97,1.03);N.push({l,phi:ph0+j*137.5,kink:R(.2,.8),leaf:{a:R(30,42)-14*u,len:UPC*(13-7*u)*R(.88,1.1),w:.19-.05*u}})}return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  const nT=Math.round(R(24,32)*(LOD?.7:1)),fo=op<.25?0:Math.min(.72,.15+.6*op),nO=Math.round(nT*fo),cuts=[0,s0*.5,s0];for(let j=1;j<=6;j++)cuts.push(s0+(1-s0)*j/6);
  l41StemP(A,parts,cuts.slice(0,3),6.4,5,SC,s0);l41StemP(A,parts,cuts.slice(2),5,1.4,SC,1,s0,1);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<11*UPC)continue;spLeafUp(lf,.18);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face,dr)=>lanceFlat(par,x,y,ang,len,lv.w,lc,{tilt:Math.acos(Math.min(.98,face)),bend:dr*R(.1,.22),mid:'#a8c0b8'})))}
  const pc=mix(SC[1],cw.c,.35);
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=l0+Lfl*(.02+.97*spQ(i,nT,.55)),s=A.sOf(l),az=(i*137.5+R(-15,15))*D,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),open=i<nO,
      qb=open?0:(i-nO)/Math.max(1,nT-nO-1),pl=open?Lb0*(1.15-.4*q):Lb0*(.8-.5*qb),
      /* the pedicel arches out and over; the bell hangs from its end, swinging out a little; buds stand up, nodding as they near the open band */
      tip=V3.add(V3.add(f0.p,V3.sc(r,pl*(open?.82:.55))),V3.sc(f0.T,pl*(open?.32:.62))),ax=open?V3.nz(V3.add(V3.sc(r,.32),V3.sc(f0.T,-.95))):V3.nz(V3.add(V3.sc(r,.6+.2*qb),V3.sc(f0.T,-.5+1.3*qb))),
      B=spFrame(ax,V3.nz(V3.add(r,[0,0,.01])),0),c0=l41Q(f0.p),c1=l41Q(tip),cm=l41Q(V3.add(V3.add(f0.p,V3.sc(r,pl*.45)),V3.sc(f0.T,pl*(open?.55:.5)))),
      br=l41Q(V3.add(V3.add(f0.p,V3.sc(r,Lb0*(.3-.15*q))),V3.sc(f0.T,Lb0*(.42-.2*q)))),Lb=open?Lb0*(1-.18*q):Lb0*(.62-.32*qb),a=open?(i>=nO-2?.55:1):.2;
    parts.push({z:A.zk(s,tip[2]+ax[2]*Lb*.4),fn:par=>{E('path',{d:`M${f(c0[0])},${f(c0[1])}Q${f(cm[0])},${f(cm[1])} ${f(c1[0])},${f(c1[1])}M${f(c0[0])},${f(c0[1])}L${f(br[0])},${f(br[1])}`,stroke:pc,'stroke-width':f(Math.max(1.1,Lb0*.08)),fill:'none','stroke-linecap':'round'},par);
      if(open)fritBell(par,B,tip,Lb,cw,a,cache);else spBud(par,B,tip,Lb,Lb*.6,mix(cw.c,'#6e8a5a',.12+.45*qb),{tp:.45,pw:.6})}})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:6.4,bc:SC}}

Object.assign(GH,{'eremurus':eremSpike,'fritillaire-persica':fritSpike});
Object.assign(CWS,{'eremurus':CW_EREM,'fritillaire-persica':CW_FRIT});
Object.assign(SZG,{'eremurus':[40,50,60,60,70],'fritillaire-persica':[18,22,25,25,30]});
Object.assign(GHI,{'eremurus':{form:'epi',size:1,k:'plant',self:110*UPC,tip:.85,fx:5.5*UPC},'fritillaire-persica':{form:'epi',size:1,k:'plant',self:80*UPC,tip:.9,fx:4.5*UPC}});
for(const id of['eremurus','fritillaire-persica'])GH_BUDS.add(id);

/* ---------- trumpet daffodil (Narcissus, division 1: 'Dutch Master', 'Golden Harvest', 'Mount Hood', 'Las Vegas', 'Spellbinder'): one flower held out sideways at the top of a hollow,
   glaucous, two-edged scape; where it turns, a papery brown spathe; the flower six pointed tepals spread in a star (three outer, three inner), round a trumpet as long as they are,
   widening to a frilled, flared rim; behind them the green ovary. The bud nods in its spathe (the 'gooseneck'), then the tepals part forward round the trumpet ---------- */
const CW_NAR=[{id:'jaune',n:'Jaune (Dutch Master)',c:'#f5d22c',tr:'#f2c21c'},{id:'jaune-or',n:"Jaune d'or (Golden Harvest)",c:'#f4c41e',tr:'#f0ae14'},
  {id:'citron',n:'Citron, trompette blanchissante (Spellbinder)',c:'#f1e05a',tr:'#f2eed0'},{id:'blanc',n:'Blanc (Mount Hood)',c:'#f8f5ea',tr:'#f2ecd0'},
  {id:'creme',n:'Crème, trompette citron (Bravoure)',c:'#f2e8cc',tr:'#f0dc6a'},{id:'bicolore',n:'Bicolore blanc et jaune (Las Vegas)',c:'#f6f2e2',tr:'#f2c42a'}];
const NAR_TEP=prof([[0,.36],[.18,.84],[.45,1],[.72,.8],[.9,.42],[1,.1]]),NAR_SPA=prof([[0,.8],[.35,1],[.7,.62],[1,.04]]);
/* the trumpet in the flower's frame: rings from its base to its frilled rim; Lt its length, rb, rm the radii at the base and the mouth */
function narTrumpet(par,B,O,R0,cw,o2,cache){const nz=B[2][2],Lt=R0*(.5+.45*o2),rb=R0*.12,rm=R0*(.2+.15*o2),ph=(O[0]*.31+O[1]*.17)%6.283,nr=DET>=1.5?16:12,rings=[],c=cw.tr,P=pal7(c);
  const rad=v=>rb+(rm-rb)*Math.pow(v,1.7)+rm*.32*o2*sm01((v-.78)/.22);
  for(const v of[0,.3,.6,.85,1]){const q=[];for(let i=0;i<nr;i++){const a=i/nr*6.283,fr=v===1?1+.08*o2*Math.sin(a*7+ph):1,r=rad(v)*fr;q.push([Math.cos(a)*r,Math.sin(a)*r,v*Lt+(v===1?R0*.03*o2*Math.sin(a*7+ph+1):0),a])}rings.push(q)}
  const all=[],dark=[];for(const q of rings)for(const p of q){const s=PJ(B,O,p);all.push([s[0],s[1]]);const nn=toV(B,[Math.cos(p[3]),Math.sin(p[3]),-.3]);if(V3.dot(nn,LIGHT)<-.05)dark.push([s[0],s[1]])}
  const ink=shd(c,h2l(c)[2]>.85?-.5:-.42);E('path',{d:smooth(hull2(all)),fill:l41T(cache,c,.62),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},par);
  if(!LOD&&dark.length>4)E('path',{d:smooth(hull2(dark)),fill:P.d1,opacity:.3},par);
  /* the mouth, when it turns to the eye: the inside of the rim, the throat deeper and darker, the stamens and style at the bottom */
  if(nz>.08){const rim=rings[4].map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]});E('path',{d:smooth(rim),fill:l41T(cache,c,.5),stroke:ink,'stroke-width':.5,'stroke-opacity':.6},par);
    if(!LOD){const th=rings[2].map(p=>{const s=PJ(B,O,[p[0]*.9,p[1]*.9,p[2]]);return[s[0],s[1]]});E('path',{d:smooth(th),fill:P.d1,opacity:.55},par);
      const sc=PJ(B,O,[0,0,Lt*.62]);let d='';for(let i=0;i<3;i++){const a=i*2.09+ph;d+=l41C(sc[0]+Math.cos(a)*rb*.45,sc[1]+Math.sin(a)*rb*.45,Math.max(.55,rb*.28))}E('path',{d,fill:mix(c,'#f4e8a0',.5),stroke:shd(c,-.35),'stroke-width':.3},par)}}
  else{const rim=rings[4].map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]});E('path',{d:smooth(rim),fill:'none',stroke:ink,'stroke-width':.45,'stroke-opacity':.5},par)}}
function narFlower(par,B,O,D,cw,op,cache){const k=G(par),R0=D/2,o2=sm01((op-.25)/.75),it=[],rot=(O[0]*.13+O[1]*.07)%6.283,cb=mix(cw.c,'#d8dcc0',.25);
  /* the tepals: outer three a shade broader and further back, inner three before them; they part forward first, then spread into a star, a little reflexed */
  for(let j=0;j<6;j++){const inner=j%2,a0=.3+1.02*o2,a1=.5+1.06*o2+(inner?0:.06),l=ligule(B,O,{phi:rot+j*1.0472,r0:R0*.08,z0:inner?R0*.03:0,L:R0*(inner?.86:.93)*(.7+.3*o2),W:R0*(inner?.44:.5),wp:NAR_TEP,a0,a1,pw:1.2,th:.35,n:DET>=1.5?7:5,tw:inner?.08:-.06});
    it.push({l,c:cw.c,cb,lift:.2})}
  const tz=PJ(B,O,[0,0,R0*.3])[2];it.push({z:tz,fn:kk=>narTrumpet(kk,B,O,R0,cw,o2,cache)});
  /* the green ovary behind the flower, where the pedicel arrives */
  const oz=PJ(B,O,[0,0,-R0*.18])[2];it.push({z:oz,fn:kk=>spBud(kk,l41Fr(V3.sc(B[2],-1),B[1]),O,R0*.32,R0*.2,'#7a9a52',{tp:.2,pw:.8})});
  spPetals(k,it,cache);return k}
/* the bud: the flower still furled, nodding inside its papery spathe, its colour showing at the end */
function narBud(par,B,O,D,cw,a){const k=G(par),s=D*(.42+.12*a),c=mix(cw.c,'#9aac62',.55-.35*a);spBud(k,B,O,s,s*.36,c,{tp:.55,pw:.6});
  const l=ligule(B,V3.add(O,toV(B,[0,0,-s*.12])),{phi:R(0,6.28),r0:s*.05,z0:0,L:s*(.78-.25*a),W:s*.26,wp:NAR_SPA,a0:.06,a1:.02,pw:1,th:2.4,tip:'point',n:5});
  drawLig(k,[{l,c:'#d8c49a',ink:'#8a7650'}]);return k}
function narPlant(g,t,o){const cw=o.cw||cwNear(CW_NAR,o.col)||CW_NAR[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=['#2e4a32','#557a58','#80a682','#b2ccb0'],cache={};
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const bud=op<.3,head=(par,Bf,pos,op2)=>op2<.3?narBud(par,Bf,pos,D,cw,op2/.3):narFlower(par,Bf,pos,D,cw,op2,cache);
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.055,cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B2,O,D2,op2)=>head(par,B2,O,op2)});open(k,t,1000,8,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*2.2))):1,w=D*.065,
    /* the flower looks where the head is turned, a little down; the bud hangs */
    fax=bud?V3.nz(V3.add(V3.sc(face,.55),V3.sc(up,-.8))):V3.nz(V3.add(face,V3.sc(up,-.2)));
  const rules={S:()=>[['F',{l:D*2.4*kr,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:D*.24*kr,w1:w*.5,aim:fax,k:.5}],['K',{main:1}]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.015,seg:D*.08,T:[0,1,0],e:.01,w:w*1.1});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const ax=V3.nz(V3.add(og.H,V3.sc(fax,.8))),Bf=l41Fr(ax,up,R(-.15,.15)),c=V3.add(pos,V3.sc(ax,bud?D*.02:D*.16));
      return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>head(par,Bf,c,op)}]}}
    /* the spathe: papery, split, standing up beside the turn of the pedicel (in bud it wraps the bud itself) */
    if(og.t==='Sp'&&!bud){const Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(fax,-.25))),V3.sc(fax,-1),0),l=ligule(Bs,V3.add(pos,V3.sc(og.H,-D*.05)),{phi:R(-.4,.4),r0:w*.4,z0:0,L:D*.42,W:D*.1,wp:NAR_SPA,a0:.12,a1:.3,pw:1.2,th:1.6,tip:'point',n:5,tw:R(-.4,.4)});
      return{parts:[{z:pos[2]-1e-3+Bs[2][2]*0,fn:par=>drawLig(par,[{l,c:'#d6c296',ink:'#8a7650'}])}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- fire lily (Cyrtanthus mackenii, C. elatus hybrids): a hollow, leafless scape; at its top two papery spathe valves and an umbel of four to ten slender tubular flowers
   on arching pedicels, hanging; each tube curved, widening to its mouth, six short lobes flaring there; the buds stand up in the spathe at first, then droop as their pedicels lengthen.
   A flower is three paths (the curved tube, its shadowed side, the lobes and mouth) ---------- */
const CW_CYR=[{id:'rouge',n:'Rouge écarlate',c:'#c8202a'},{id:'rouge-sang',n:'Rouge sang',c:'#9a1c26'},{id:'orange',n:'Orange',c:'#e8702a'},
  {id:'saumon',n:'Saumon',c:'#f0907a'},{id:'rose',n:'Rose',c:'#eca0b0'},{id:'creme',n:'Crème',c:'#f8f5ef',tip:'#cfd8a8'},{id:'jaune',n:'Jaune',c:'#efd25a',tip:'#c8d070'}];
/* one flower along its frame's Z (out of its pedicel), bending down toward dn: L long, a open (0 bud … 1) */
function cyrFlower(par,B,O,L,cw,a,dn,cache){const k=G(par),c=cw.c,P=pal7(c),o2=Math.max(0,Math.min(1,(a-.3)/.7)),ax=B[2],n=7,C=[],rr=[];
  /* the curved axis: out along ax, bending down */
  let p=O,d=ax;for(let i=0;i<=n;i++){const v=i/n;C.push(p);rr.push(L*(.045+(.07+.03*o2)*Math.pow(v,1.6))*(a<.3?(1-.6*v*v):1));const nd=V3.nz(V3.add(d,V3.sc(dn,.26+.1*o2)));d=nd;p=V3.add(p,V3.sc(d,L/n))}
  const S=C.map(l41Q),Lp=[],Rp=[];for(let i=0;i<=n;i++){const a2=S[Math.max(0,i-1)],b=S[Math.min(n,i+1)],dx=b[0]-a2[0],dy=b[1]-a2[1],l=Math.hypot(dx,dy)||1;Lp.push([S[i][0]-dy/l*rr[i],S[i][1]+dx/l*rr[i]]);Rp.push([S[i][0]+dy/l*rr[i],S[i][1]-dx/l*rr[i]])}
  const e=S[n],e0=S[n-1],cap=[e[0]+(e[0]-e0[0])*.18,e[1]+(e[1]-e0[1])*.18],bc=a<.3?mix(c,'#7a9a4a',.32-.3*a):c,ink=shd(bc,h2l(bc)[2]>.85?-.5:-.42),dir=V3.nz(V3s(C[n],C[n-1])),mz=dir[2];
  const lip=()=>{if(o2<.15)return;/* the mouth: six short lobes flaring round it, the inside darker when it turns to the eye */
    const Bm=l41Fr(dir,[0,1,0],0),R1=rr[n],q=[],m=[];for(let i=0;i<12;i++){const an=i/12*6.283,kr=i%2?R1*.95:R1*(1.05+.6*o2),ex=i%2?0:L*.07*o2,pp=PJ(Bm,C[n],[Math.cos(an)*kr,Math.sin(an)*kr,ex]);q.push([pp[0],pp[1]])}
    for(let i=0;i<10;i++){const an=i/10*6.283,pp=PJ(Bm,C[n],[Math.cos(an)*R1*.72,Math.sin(an)*R1*.72,-L*.02]);m.push([pp[0],pp[1]])}
    E('path',{d:smooth(q)+(mz>.1?smooth(m):''),fill:l41T(cache,c,mz>.1?.66:.48),'fill-rule':'evenodd',stroke:ink,'stroke-width':.4,'stroke-opacity':.6,'stroke-linejoin':'round'},k);
    if(mz>.1)E('path',{d:smooth(m),fill:P.d1,opacity:.85},k)};
  if(mz<-.1)lip();
  E('path',{d:smooth(Lp.concat([cap],Rp.slice().reverse())),fill:a<.3?budFill(bc):l41T(cache,c,.6),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},k);
  if(!LOD){const sh=Rp.map((q,i)=>[q[0]+(S[i][0]-q[0])*.55,q[1]+(S[i][1]-q[1])*.55]);E('path',{d:smooth(Rp.concat(sh.reverse())),fill:P.d1,opacity:.35},k);
    if(cw.tip&&a>=.3){const i0=n-2;E('path',{d:smooth(Lp.slice(i0).concat(Rp.slice(i0).reverse())),fill:cw.tip,opacity:.45},k)}}
  if(mz>=-.1)lip();return k}
function cyrPlant(g,t,o){const cw=o.cw||cwNear(CW_CYR,o.col)||CW_CYR[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,Rr=D/2,k=G(g),B=frameOf(o,.6,true),sc=['#2e4a24','#4e7438','#76a052','#a8c886'],cache={};
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const n=Math.round(R(5,8)),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.6))):1,Lf=D*.62,
    mods=[['F',{l:D*(o.rim?.3:2.6)*kr,w0:D*.075,w1:D*.065,e:.01}],['F',{l:D*.18*kr,aim:V3.nz(V3.add(up,V3.sc(ax,.45))),k:.3,w1:D*.06}],['Sp',{}]];
  /* the pedicels: the older flowers outside, hanging lower; buds in the middle, still erect when the umbel is young */
  for(let i=0;i<n;i++){const age=Math.max(0,Math.min(1,op*1.25-(i/n)*(op<.6?.9:.45)+R(-.08,.08))),a=i*137.5+R(-10,10),el=age<.3?R(8,22):R(32,58);
    mods.push(['[',{w:Math.max(1.1,D*.016)}],['/',{a}],['&',{a:el}],['F',{l:Rr*(age<.3?.35:.45+.2*age)*R(.9,1.1),w1:Math.max(1.05,D*.012),e:age<.3?.02:-.06}],['K',{age}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.015,seg:D*.07,T:[0,1,0],e:.01,w:D*.075});for(const ch of res.chains)ch.c=sc;
  const sp=res.organs.find(q=>q.t==='Sp'),apex=V3.add(sp.pos,V3.sc(sp.H,Rr*.2)),dn=V3.sc(up,-1);
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='Sp'){const Bs=lsFrame(og,null,0),it=[];for(const s of[-1,1])it.push({l:ligule(Bs,pos,{phi:s*1.571+R(-.2,.2),r0:D*.025,z0:-D*.01,L:Rr*(op<.3?.75:.5),W:Rr*.13,wp:NAR_SPA,a0:op<.3?.18:1.9,a1:op<.3?.1:2.5,tip:'point',th:1.2,n:5}),c:'#c8b88e',ink:'#7a6a4a'});
      return{parts:[{z:pos[2]-(op<.3?-Rr*.1:Rr*.15),fn:par=>drawLig(par,it)}]}}
    if(og.t==='K'){const a=og.p.age,Bf=l41Fr(og.H,up,0),L=Lf*(a<.3?.55+.4*a:.9+.1*a)*R(.94,1.05);
      return{parts:[{z:pos[2]+og.H[2]*L*.3,fn:par=>cyrFlower(par,Bf,pos,L,cw,a<.3?a:Math.max(.3,a),a<.3?V3.sc(dn,.15):dn,cache)}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'narcisse-trompette':narPlant,'cyrtanthus':cyrPlant});
Object.assign(CWS,{'narcisse-trompette':CW_NAR,'cyrtanthus':CW_CYR});
Object.assign(SZG,{'narcisse-trompette':[7,8,9,9,10],'cyrtanthus':[6,7,8,8,9]});
Object.assign(GHI,{'narcisse-trompette':{form:'etoile',size:2,k:'head',rk:.85},'cyrtanthus':{form:'grappe',size:2,k:'head',rk:.8}});
for(const id of['narcisse-trompette','cyrtanthus'])GH_BUDS.add(id);

/* ---------- snowball tree (Viburnum opulus 'Roseum', syn. 'Sterile'): a woody shoot with opposite, maple-like leaves (three lobes, coarsely toothed, palmately veined, on a grooved petiole);
   at the tip and at the tips of short side shoots from the upper axils, round balls of sterile florets on stout peduncles, five (sometimes four) broad, unequal, rounded petals each,
   lime green as they swell, then cream, then white, a pink flush when they age. The ball as the hydrangea's: florets laid on a sphere and drawn far to near (floretPath, s4a.js);
   the buds a tight green ball of tiny closed florets ---------- */
const CW_VIB=[{id:'vert',n:'Vert anis (boule verte)',c:'#c5d86a'},{id:'vert-tendre',n:'Vert tendre (virant au blanc)',c:'#dbe6a0',c2:'#eef0d4'},
  {id:'blanc',n:'Blanc',c:'#f7f5ee',c2:'#e6ecc8'},{id:'blanc-creme',n:'Blanc crème',c:'#f2eedb',ret:1},{id:'blanc-rose',n:'Blanc rosé (fin de saison)',c:'#efc8d4',c2:'#f6eef0'}];
/* a maple-like leaf on the screen at (x,y) along ang: three lobes (the middle one longest), coarse teeth, a truncate base on its petiole; foreshortened across by its tilt */
function vibLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.2,o.face??.7),pl=len*.22,bl=len-pl,nt=DET>=1.5?44:30,out=[],dk=[[pl,0]];
  const lobe=(th,c,L,w)=>{const d=Math.abs(th-c)/w;return d<1?L*Math.pow(Math.cos(d*1.5708),.7):0};
  for(let i=0;i<=nt;i++){const th=-2.6+5.2*i/nt,r0=Math.max(lobe(th,0,1,.9),lobe(th,.95,.78,.8),lobe(th,-.95,.78,.8),.42*Math.max(0,Math.cos(th*.62)),.14),tooth=i%2&&r0>.3?1.07:1,r=bl*r0*tooth*(1+.03*Math.sin(i*1.7+(o.sd||0)));
    const p=[pl+bl*.12+Math.cos(th)*r,Math.sin(th)*r*ct*(o.sw||1)];out.push(p);if(th>=0)dk.push(p)}
  E('path',{d:`M0,0L${f(pl)},0`,stroke:shd(col,-.3),'stroke-width':f(Math.max(1.1,len*.03)),'stroke-linecap':'round'},g);
  E('path',{d:smooth(out),fill:toneAt(P,o.I??.62),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:smooth(dk),fill:P.d1,opacity:.35},g);let d='';for(const th of[0,.95,-.95]){const L=th?.58:.78;d+=`M${f(pl+bl*.12)},0L${f(pl+bl*.12+Math.cos(th)*bl*L)},${f(Math.sin(th)*bl*L*ct)}`}
    E('path',{d,stroke:P.l1,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.55,fill:'none'},g)}return g}
/* the ball: n florets on a sphere of radius Rb round O (local Z its face), the young ones greener and smaller; drawn far to near over a dark under-layer */
function vibBall(par,B,O,Rb,cw,op,cache){const k=G(par),o2=sm01((op-.25)/.75),sd=(O[0]*.13+O[1]*.29)%6,green=Math.max(0,1-op/.75);
  if(op<.25){/* in bud: a tight green ball, the tiny closed florets as bumps */
    const r=Rb*(.55+.4*op),c=mix(cw.c,'#9cb85a',.75),p0=PJ(B,O,[0,0,0]),P=pal7(c);E('path',{d:l41C(p0[0],p0[1],r),fill:budFill(c),stroke:P.d1,'stroke-width':.45,'stroke-opacity':.6},k);
    if(!LOD){let d='';const n=DET>=1.5?34:22;for(let i=0;i<n;i++){const yy=1-(i+.5)/n*2,rr=Math.sqrt(1-yy*yy),a=i*2.39996+sd,nv=toV(B,[Math.cos(a)*rr,Math.sin(a)*rr,yy]);if(nv[2]<.15)continue;
      d+=l41C(p0[0]+nv[0]*r*.86,p0[1]-nv[1]*r*.86,Math.max(.6,r*.14*(.6+.4*nv[2])))}E('path',{d,fill:P.l1,opacity:.55,stroke:P.d1,'stroke-width':.3,'stroke-opacity':.4},k)}return k}
  const N=Math.round((DET>=1.5?72:46)*(LOD?.5:1)*Math.min(1,Math.pow(Rb/(3.4*UPC),1.6))),gr=.62+.38*o2,R1=Rb*gr,s0=R1*(DET>=1.5?.37:.44),pts=[];
  for(let i=0;i<N;i++){const yy=1-(i+.5)/N*2,rr=Math.sqrt(Math.max(0,1-yy*yy)),a=i*2.39996+sd,n0=[Math.cos(a)*rr,Math.sin(a)*rr,yy],lump=1+.05*Math.sin(a*3+yy*5),nv=V3.nz(toV(B,n0));if(nv[2]<-.3)continue;
    let c=cw.c;if(cw.c2)c=mix(c,cw.c2,.6*sm01((patch(n0,sd)-.35)/.4));if(green)c=mix(c,'#b8cc6a',green*.8);c=mix(c,shd(c,R(-.08,.08)),.6);
    const P=PJ(B,O,V3.sc(n0,R1*lump));pts.push({n0,nv,z:P[2],p:V3.sc(n0,R1*lump),s:s0*R(.82,1.15),rot:R(0,6.28),c,np:rnd()<.22?4:5})}
  pts.sort((a,b)=>a.z-b.z);const hull=pts.map(q=>{const p=PJ(B,O,q.p);return[p[0],p[1]]});if(hull.length>2){const h=hull2(hull),cx=h.reduce((a,p)=>a+p[0],0)/h.length,cy=h.reduce((a,p)=>a+p[1],0)/h.length;
    E('path',{d:smooth(h.map(p=>[cx+(p[0]-cx)*.92,cy+(p[1]-cy)*.92])),fill:mix(shd(cw.c,-.3),'#8aa070',.2)},k)}
  let eyes='';for(const q of pts){const I=.34+.66*lightI(q.nv),fill=l41T(cache,q.c,I),fp=floretPath(B,O,q.p,q.n0,q.s,q.rot,{petals:q.np,lobe:.36,cup:.1});
    E('path',{d:smooth(fp.map(p=>[p[0],p[1]])),fill,stroke:shd(q.c,-.3),'stroke-width':.5,'stroke-opacity':.7,'stroke-linejoin':'round'},k);
    if(!LOD&&q.nv[2]>.3){const e=PJ(B,O,V3.sc(q.n0,R1*1.02));eyes+=l41C(e[0],e[1],Math.max(.5,q.s*.09))}}
  if(eyes)E('path',{d:eyes,fill:'#c8d488',opacity:.8},k);return k}
function vibPlant(g,t,o){const cw=o.cw||cwNear(CW_VIB,o.col)||CW_VIB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),sc=typeof vibStemCols==='function'&&typeof SV_ON!=='undefined'&&SV_ON?vibStemCols():['#3a3624','#5e5a3e','#86825a','#b0ac84'],cache={},lc='#4f7a36';
  const B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const sv=typeof vibSvgPut==='function'&&typeof SV_ON!=='undefined'&&SV_ON,ball=(par,Bf,pos,Dd,a,att)=>sv?vibSvgPut(par,Bf,pos,Dd,cw,a,att):vibBall(par,Bf,pos,Dd/2,cw,a,cache);
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:.4,nodes:0,lp:.5,flower:(par,B2,O,D2,op2)=>ball(par,B2,O,D2,op2)});open(k,t,1000,6,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*1.9))):1,w=D*.06,ph0=R(0,360),nS=rnd()<.35?1:2;
  /* the shoot: two leafy nodes (decussate), the upper one sending out one or two short side shoots, each a pair of small leaves and a younger ball; then the terminal ball on its peduncle */
  const rules={S:()=>[['F',{l:D*.9*kr,w0:w*1.25,w1:w*1.15,e:.02}],['N',{i:1}],['F',{l:D*.7*kr,w1:w*1.05,e:.02}],['N',{i:0}],['F',{l:D*.55*kr,w1:w*.8,aim:V3.nz(V3.add(up,V3.sc(face,.35))),k:.25}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],r0=ph0+p.i*90;for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:r0+j*180+R(-12,12)}],['&',{a:58+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      if(!p.i)for(let j=0;j<nS;j++){const age=Math.min(1,op*R(.7,.92));out.push(['[',{w:w*.7}],['/',{a:r0+90+j*180+R(-20,20)}],['&',{a:R(34,46)}],['F',{l:D*.45*kr,w1:w*.6,e:.05}],['Ls',{}],['F',{l:D*.4*kr,w1:w*.5,e:.06}],['Kb',{age}],[']',{}])}
      return out},
    Ls:()=>[['[',{}],['/',{a:90}],['&',{a:55}],['Lv',{i:2,j:0}],[']',{}],['[',{}],['/',{a:270}],['&',{a:55}],['Lv',{i:2,j:1}],[']',{}]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,4),{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.14,T:[0,1,0],e:.02,w:w*1.25});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:sv?12:undefined,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=l41Fr(V3.add(og.H,V3.sc(face,.5)),up,R(-.3,.3)),c=V3.add(pos,V3.sc(og.H,D*.4*(.6+.4*Math.min(1,op*1.3))));return{parts:[{z:c[2],fn:par=>ball(par,Bf,c,D,op,V3s(pos,c))}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=l41Fr(V3.add(og.H,V3.sc(face,.4)),up,R(-.3,.3)),Dd=D*(.68+.18*a),c=V3.add(pos,V3.sc(og.H,Dd*.4*(.6+.4*Math.min(1,a*1.3))));return{parts:[{z:c[2],fn:par=>ball(par,Bf,c,Dd,a,V3s(pos,c))}]}}
    if(og.t==='Nd'&&sv&&typeof vibNodeSv==='function')return{ext:1,parts:[{z:pos[2]+.15,cast:false,fn:par=>vibNodeSv(par,og,pos,ph0+og.p.i*90,sc)}]};
    if(og.t==='Lv'){const sm=og.p.i===2,len=D*(sm?.5:og.p.i?1.05:.85)*R(.9,1.08),face2=.3+.7*Math.abs(og.U[2]);if(sv&&typeof vibLeafSv==='function')return{ext:1,parts:[{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>vibLeafSv(par,og,pos,len,up)}]};return{ext:1,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>vibLeaf(par,x,y,a,l,lc,{face:face2,sd:og.p.i*3+og.p.j}))]}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'viburnum-roseum':vibPlant});CWS['viburnum-roseum']=CW_VIB;SZG['viburnum-roseum']=[5,6,7,7,8];
GHI['viburnum-roseum']={form:'sphere',size:2.2,k:'head',rk:1.2};GH_BUDS.add('viburnum-roseum');
