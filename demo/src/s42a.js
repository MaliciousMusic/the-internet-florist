/* ================= Serre, lot 42 — été 4, poussés par le L-système : lis OT (Orienpet), alstroemère, bouvardia, tritoma (kniphofia), crocosmia ================= */
/* ---------- lily OT (Lilium Orienpet: Oriental × Trumpet hybrids, 'Conca d'Or', 'Robina', 'Yelloween'…): the oriental's huge outward flowers on the trumpet's vigour —
   tepals broad, thick and waxy, only a little recurved at their tips, hardly any spots; a raceme of two to four open flowers with two or three buds above,
   broad lanceolate glossy leaves scattered on a stout stem. Grown by lilyPlant (reprise 2) with its own kind ---------- */
const L42_OT=[
 {id:'conca-dor',n:"Jaune citron à bord crème (Conca d'Or)",c:'#f8efc4',heart:'#f0c43a',throat:'#d8e098',nect:'#b8cc70',spots:null,an:'#9a4a1c'},
 {id:'yelloween',n:'Jaune primevère (Yelloween)',c:'#f4dc5a',throat:'#c8d878',nect:'#a8c060',spots:null,an:'#a4501c'},
 {id:'robina',n:'Fuchsia à cœur blanc (Robina)',c:'#c63a78',heart:'#f6e8ee',throat:'#eef0d8',nect:'#c8d890',spots:'#8a0a3a',an:'#8a3418'},
 {id:'zelmira',n:'Saumon orangé (Zelmira)',c:'#f2a070',heart:'#f6c060',throat:'#e8d088',nect:'#c0c870',spots:null,an:'#8a3418'},
 {id:'anastasia',n:'Rose à bord blanc (Anastasia)',c:'#e98aae',edge:'#fbeef2',throat:'#f2e8d8',nect:'#c0d088',spots:'#b02a5e',an:'#9a3c1a'},
 {id:'pretty-woman',n:'Blanc rosé (Pretty Woman)',c:'#fbf3ee',heart:'#f2c4cc',throat:'#e0e8c0',nect:'#b0c878',spots:null,an:'#a8501e'},
 {id:'blanc',n:'Blanc crème (Big Brother)',c:'#faf6e8',heart:'#f2e4a8',throat:'#d8e4a8',nect:'#b0c878',spots:null,an:'#a8501e'},
 {id:'boogie-woogie',n:'Jaune rosé (Boogie Woogie)',c:'#f6d27a',tips:'#ee8a80',throat:'#e0e098',nect:'#b8c870',spots:null,an:'#9a4a1c'},
 {id:'purple-prince',n:'Pourpre grenat (Purple Prince)',c:'#8a1a3e',heart:'#5c0a24',throat:'#b8a868',nect:'#a8b060',spots:'#4a0418',an:'#5a1a0c'},
 {id:'rouge',n:'Rouge carmin (Red Morning)',c:'#c03c58',heart:'#f0d070',throat:'#e8d888',nect:'#c0c870',spots:'#6a0a20',an:'#7a2a12'}];
Object.assign(LILY_K,{ot:{L:.6,Wo:.135,Wi:.185,a0:22,a1:112,pw:2.1,cup:-.38,ruf:.035,rk:5,st:6,face:'out'}});
Object.assign(LILY_LS,{ot:{D:22,li:.3,ped:.4,a:48,e:.05,nF:[2,3],nB:2,lw:.3,lc:'#33602a'}});
/* the raceme as lilyPlant grows it, but the lowest pedicel (and its bract) leaves the stem toward where the main flower looks (^, not &: & pitches away from U), so the flower is not set behind its own stem; each open flower is set in the painter's order by where its face is (its rim forward of its node when it looks at the eye), so the axis rising above it passes behind it */
function l42Ot(g,t,o){const kd='ot',list=L42_OT,cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),K=LILY_LS[kd],D=(o.cm||K.D)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#9cc070'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.035,cols:sc,op,rr:.4,nodes:0,lp:.5,flower:(par,B,O,D2,op2)=>lilyFlower(par,B,O,D2,cw,op2,kd)});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nF=op<.3?0:op<.7?1:Math.round(R(K.nF[0],K.nF[1])),nB=K.nB+(op<.3?1:0),n=nF+nB,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(K.li*1.5+K.ped)))):1,li=D*K.li*kr;
  const rules={S:()=>[['F',{l:li*1.3,w1:D*.04}],['[',{}],['/',{a:R(0,360)}],['&',{a:42}],['Lv',{big:1}],[']',{}],['F',{l:li*.6,w1:D*.038}],['[',{}],['/',{a:R(0,360)}],['&',{a:40}],['Lv',{big:1}],[']',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.45,w1:D*.02}],['Kb',{age:.05,tip:1}]];const fl=p.i<nF,age=fl?1-.12*p.i:.32-.24*(p.i-nF)/Math.max(1,nB);
      return[['F',{l:li*R(.85,1.15)*(p.i?1:.4),w1:D*(.036-.003*p.i)}],['[',{}],['^',{a:30}],['Lv',{bract:1}],[']',{}],['[',{w:D*.016}],['^',{a:K.a*(fl?1:.6)+R(-6,6)}],['F',{l:D*K.ped*kr*(fl?1:.55),w1:D*.013,e:fl?K.e:.09}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:137.5+R(-10,10)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.12,T:[0,1,0],e:.015,w:D*.042});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=og===main?B:lsFrame(og,null,R(-.25,.25)),Df=D*(og===main?1:.94);return{parts:[{z:pos[2]+Df*.22*Bf[2][2],fn:par=>lilyFlower(par,Bf,pos,Df,cw,op,kd)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,R(-.3,.3)),len=D*(og.p.tip?.22:.3+.35*og.p.age);return{parts:[{z:pos[2],fn:par=>lilyBud(par,Bf,pos,len,cw,kd)}]}}
    if(og.t==='Lv'){const len=D*(og.p.bract?.3:.6),w=og.p.bract?K.lw*.8:K.lw;return{ext:1,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>stemLeaf(par,x,y,a,l,w,K.lc,{side:.4,arch:12,par:1,gloss:.55}))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- red-hot poker (Kniphofia uvaria and its hybrids; Asphodelaceae): a stout, bare, glaucous scape 60–100 cm with two or three small papery sterile bracts, ending in a dense
   cylindrical raceme 12–25 cm of 60–100 narrow tubular florets 3–4 cm, spirally crowded; the buds at the top point up and out, coloured (scarlet, orange), the florets turn down as they open
   from the base and pale to yellow or cream, the stamens just out of the mouth: the poker red above, yellow below. Grown along its axis by spGrow (reprise 5) ---------- */
const L42_KN=[
 {id:'royal-castle',n:'Rouge et jaune (Royal Castle)',c:'#d8452a',ct:'#d8402a',cb:'#f2cc3a'},
 {id:'flamenco',n:'Flammé rouge orangé (Flamenco)',c:'#e05a30',ct:'#de4a2a',cb:'#f4b03a'},
 {id:'alcazar',n:'Orange (Alcazar)',c:'#e0662a',ct:'#e2602a',cb:'#f08a34'},
 {id:'redhot',n:'Rouge vif (Redhot Popsicle)',c:'#d8302a',ct:'#d22c26',cb:'#e85a30'},
 {id:'mango',n:'Orange mangue (Mango Popsicle)',c:'#f0a85a',ct:'#f08a3a',cb:'#f6b858'},
 {id:'timothy',n:'Pêche saumoné (Timothy)',c:'#e89a86',ct:'#ec8a74',cb:'#f6b8a0'},
 {id:'lemon',n:'Jaune citron (Lemon Popsicle)',c:'#ecc23a',ct:'#d2d05a',cb:'#f4d644'},
 {id:'percys-pride',n:"Jaune vert (Percy's Pride)",c:'#e2e090',ct:'#c4d070',cb:'#ece6a0'},
 {id:'ice-queen',n:'Ivoire vert (Ice Queen)',c:'#ece2b0',ct:'#b8d098',cb:'#f2eed6'},
 {id:'tawny-king',n:'Bronze et crème (Tawny King)',c:'#d89a5a',ct:'#c8682a',cb:'#f0e2c0'}];
/* one floret from its node on the rachis: a narrow tube on a very short pedicel, leaving at el0 off the axis and arriving at el1 (up for a bud, down for an open floret),
   its outline one path toned by where its side faces; the stamens just out of the mouth of an open one (from the mouth, as wide as a stroke may be) */
function l42KnFlo(par,node,r,T,Lf,el0,el1,col,cache,st){const d0=V3.nz(V3.add(V3.sc(r,Math.cos(el0)),V3.sc(T,Math.sin(el0)))),d1=V3.nz(V3.add(V3.sc(r,Math.cos(el1)),V3.sc(T,Math.sin(el1)))),
    c1=V3.add(node,V3.sc(d0,Lf*.42)),c2=V3.add(c1,V3.sc(d1,Lf*.6)),n=8,C=[],W=Lf*.088;
  for(let i=0;i<=n;i++){const q=i/n,a=(1-q)*(1-q),b=2*(1-q)*q,c=q*q;C.push([0,1,2].map(m=>a*node[m]+b*c1[m]+c*c2[m]))}
  const Lp=[],Rg=[];for(let i=0;i<=n;i++){const q=i/n,a=C[Math.max(0,i-1)],b=C[Math.min(n,i+1)],dx=b[0]-a[0],dy=-(b[1]-a[1]),l=Math.hypot(dx,dy)||1,w=Math.max(.55,W*(.32+.68*Math.pow(Math.sin(Math.min(1,q*1.15)*1.5708),.8))*(q>.9?1.12:1));
    Lp.push([C[i][0]-dy/l*w,-C[i][1]+dx/l*w]);Rg.push([C[i][0]+dy/l*w,-C[i][1]-dx/l*w])}
  const e=C[n],tip=[e[0]+(e[0]-C[n-1][0])*.3,-e[1]-(e[1]-C[n-1][1])*.3],I=lightI(V3.nz(V3.add(r,[0,0,.35]))),key=col+Math.round(I*10);let tn=cache[key];if(!tn){const P=pal7(col);tn=cache[key]=[toneAt(P,.3+.6*I),P.ink]}
  E('path',{d:smooth(Lp.concat([tip],Rg.reverse())),fill:tn[0],stroke:tn[1],'stroke-width':.4,'stroke-opacity':.45},par);
  if(st&&DET>=1.5&&!LOD){const dd=V3.nz(V3s(e,C[n-1]));let sd='';for(const k of[-1,0,1]){const sx=V3.add(e,V3.sc(V3.cr(dd,[0,0,1]),k*W*.35)),ex=V3.add(sx,V3.sc(dd,Lf*.1));sd+=`M${f(sx[0])},${f(-sx[1])}L${f(ex[0])},${f(-ex[1])}`}
    E('path',{d:sd,stroke:'#e8d088','stroke-width':1.05,'stroke-linecap':'round',fill:'none'},par)}}
function l42KnSpike(g,t,o){const cw=cwPick(L42_KN,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine,Lf0=(o.cm||18)*UPC,Lt=sp?blen(o.spine):Lf0*2.7,
    SC=['#3e5a3a','#5e7e5a','#86a080','#b4c8ac'],Lf=3.4*UPC*Math.max(.9,Math.min(1.1,Math.pow(Lf0/(18*UPC),.25)));
  let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.012,e:.1,seg:8,w:7.6,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.6:.42:.4));Lb=L-Lfl;const N=[];
    /* two or three sterile bracts up the bare scape, the stem turning a little at each */
    for(let j=0;j<(sp?2:3);j++)N.push({l:Lb*(.3+.24*j)*R(.92,1.08),phi:R(0,360),kink:R(.3,.8),leaf:{a:R(12,20)}});return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  const nT=Math.max(24,Math.round(Lfl/UPC*4.4*(LOD?.6:1))),fo=.12+.62*op,cuts=[0,s0];for(let i=1;i<=6;i++)cuts.push(s0+(1-s0)*i/6);
  spStemP(A,parts,cuts.slice(0,2),7.6,6,SC,s0);spStemP(A,parts,cuts.slice(1),5.4,1.8,SC,1,s0);
  for(const lf of P.leaves){if(sp&&lf.nd.l<12*UPC)continue;parts.push(spLeafPart(A,lf,2.4*UPC,(par,x,y,ang,len,face)=>lanceFlat(par,x,y,ang,len,.32,'#9aa878',{tilt:Math.acos(Math.min(1,face)),bend:R(-.05,.05),fold:.3})))}
  const ph0=R(0,6.283);
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=L-Lfl+Lfl*(.02+.96*q),s=A.sOf(l),f0=A.at(s),az=ph0+i*2.39996,r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),
      a=sm01((fo-q)/.13),sz=(1-.42*Math.pow(q,1.6))*(.86+.14*a)*(1-.32*Math.sin(Math.PI*a)),el0=(58-30*a+R(-5,5))*D,el1=(70-148*a+R(-6,6))*D,col=q>.93&&a<.1?mix(cw.ct,'#8aa860',(q-.93)*6):mix(cw.ct,cw.cb,a),
      mid=V3.add(f0.p,V3.sc(r,Lf*sz*.45));
    parts.push({z:A.zk(s,mid[2]),fn:par=>l42KnFlo(par,f0.p,r,f0.T,Lf*sz,el0,el1,col,cache,a>.75)})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:7.6,bc:SC}}

/* ---------- montbretia (Crocosmia × crocosmiiflora, C. masoniorum and hybrids: 'Lucifer', 'Emily McKenzie', 'George Davison'…; Iridaceae): a wiry stem 60–100 cm, branched once or twice,
   each spike 15–25 cm arching out and nodding at its tip, the rachis bent in a zigzag at every flower; the flowers sessile in two small bracts, alternately left and right
   but all turned to the upper side of the arch: a short curved funnel and six spreading tepals 3–5 cm across, three stamens and the style standing out; the lowest open first,
   the buds aligned along the arching tip, smaller and greener toward it. At the foot one or two sword leaves, stiff and pleated lengthwise ---------- */
const L42_CR=[
 {id:'lucifer',n:'Rouge écarlate (Lucifer)',c:'#c8302a',th:'#e2582e'},
 {id:'emily',n:'Orange à macule acajou (Emily McKenzie)',c:'#e3702a',bl:'#7a2814',th:'#f2a040'},
 {id:'type',n:'Orange (montbrétia)',c:'#c9552a',th:'#e89a3a'},
 {id:'babylon',n:'Orange rouge à gorge sombre (Babylon)',c:'#d8502a',bl:'#8a2a16'},
 {id:'severn',n:'Saumon orangé (Severn Sunrise)',c:'#ea8460',th:'#f2b25a'},
 {id:'star-east',n:'Abricot à cœur clair (Star of the East)',c:'#f0a860',th:'#f8dca0'},
 {id:'george-davison',n:"Jaune d'or (George Davison)",c:'#e8b83a',th:'#f4d050'},
 {id:'columbus',n:'Jaune (Columbus)',c:'#f2c444',th:'#f6dc70'},
 {id:'solfatare',n:'Jaune abricot (Solfatare)',c:'#f0c070',th:'#f6dca0'},
 {id:'carmin',n:'Rouge carmin (Carmin Brilliant)',c:'#c03048',th:'#d8604a'}];
const L42_CRT=prof([[0,.3],[.2,.75],[.55,1],[.85,.8],[1,.25]]);
/* one flower in its frame (local Z its face): the funnel back to its node, six tepals (the upper three a little longer), the throat flushed or blotched, three stamens and the style from the throat */
function l42CrFlo(par,B,O,Dm,cw,tl,cache){const Rr=Dm/2,k=G(par),c=cw.c,cb=mix(c,'#a02018',.22),it=[],tps=[],det=DET>=1.5,nz=B[2][2];
  it.push(tubeFlat(B,O,[[0,0,-tl],[0,-tl*.12,-tl*.55],[0,0,Rr*.04]],Rr*.08,Rr*.17,toneAt(pal7(mix(c,'#c8682a',.25)),.5),{ink:shd(c,-.5),zb:-Rr*.2}));
  for(let j=0;j<6;j++){const up=j<3,ph=(90+(j-1)*60+(j>=3?120:0)+R(-5,5))*D,l=ligule(B,O,{phi:ph,r0:Rr*.1,z0:0,L:Rr*(up?.98:.9)*R(.95,1.04),W:Rr*(j%2?.34:.3),wp:L42_CRT,a0:.42+R(-.05,.05),a1:1.38+R(-.08,.08),pw:1.3,th:.3,tip:'point',n:det?7:5,tw:R(-.2,.2)});
    tps.push(l);it.push({l,c,cb,ink:shd(c,-.42),lift:.3,basec:cw.bl&&!up?cw.bl:cw.th||null,bf:cw.bl&&!up?.34:.36,bo:cw.bl&&!up?.72:.7})}
  spPetals(k,it,cache);if(LOD)return k;
  if(nz>.05){const st=[];for(const sx of[-1,0,1])st.push([[sx*Rr*.03,0,Rr*.02],[sx*Rr*.1,Rr*.08,Rr*.32],[sx*Rr*.14,Rr*.2,Rr*.6]].map(p=>PJ(B,O,p)));
    E('path',{d:st.map(q=>smooth(q.map(p=>[p[0],p[1]]),false)).join(''),stroke:mix(c,'#f4e0b0',.4),'stroke-width':1.05,fill:'none','stroke-linecap':'round'},k);
    let an='';for(const q of st){const e=q[2],b=q[1],dx=e[0]-b[0],dy=e[1]-b[1],l=Math.hypot(dx,dy)||1,al=Rr*.14;an+=`M${f(e[0]-dx/l*al*.2)},${f(e[1]-dy/l*al*.2)}l${f(dx/l*al)},${f(dy/l*al)}`}
    E('path',{d:an,stroke:'#e8c040','stroke-width':f(Math.max(1.05,Rr*.07)),'stroke-linecap':'round',fill:'none'},k)}
  return k}
/* the spike along an axis A from the fraction s0 to its tip: n positions (from spGrow's nodes when given, or spread), their ages from the base; side: the arch's outer side (+1 right) */
function l42CrRace(A,parts,s0,n,Dm,cw,cache,fo,sl){for(let i=0;i<n;i++){const q=n<2?0:i/(n-1),s=sl?sl[i]:s0+(1-s0)*(.02+.96*spQ(i,n,.5)),f0=A.at(s),side=i%2?1:-1,Y=V3s([0,1,0],V3.sc(f0.T,f0.T[1])),
      up=V3l(Y)>.25?V3.nz(Y):f0.Fr,nrm=V3.nz(V3.add(V3.add(V3.sc(up,.8),V3.sc(f0.Fr,.55)),V3.sc(f0.Sd,side*.5))),a=sm01((fo-q)/.14);
    if(a>.2){const h=a>.9?1:.35+.6*a,ax=V3.nz(V3.add(V3.sc(nrm,.8),V3.sc(f0.T,.45))),sz=(1-.2*q)*(.8+.2*h),tl=Dm*.32*sz,pos=V3.add(f0.p,V3.sc(ax,tl)),B=spFrame(ax,f0.T,side*R(.1,.3));
      parts.push({z:A.zk(s,pos[2]),fn:par=>{gladBracts(par,A,s,nrm,Dm*.36,{cache,c:'#7a9a48'});spHalf(h,()=>l42CrFlo(par,B,pos,Dm*sz,cw,tl,cache))}})}
    else{const qb=Math.min(1,(fo>q?0:(q-fo))/Math.max(.2,1-fo)),sb=Dm*(.62-.3*qb),ax=V3.nz(V3.add(V3.sc(f0.T,.9),V3.sc(nrm,.42))),B=spFrame(ax,f0.T,0),pos=V3.add(f0.p,V3.sc(nrm,.6)),bc=mix(mix(cw.c,'#b02a1a',.15),'#8aac5c',Math.min(1,.1+.95*qb));
      parts.push({z:A.zk(s,f0.p[2]+nrm[2]*.6),fn:par=>{spBud(par,B,pos,sb,sb*.3,bc,{tp:.6,pw:.6});gladBracts(par,A,s,nrm,sb*.55,{cache,c:'#7a9a48'})}})}}}
function l42CrSpike(g,t,o){const cw=cwPick(L42_CR,o),op=Math.max(.05,Math.min(1,o.op??R(.68,1))),k=G(g),parts=[],cache={},sp=!!o.spine,Lf0=(o.cm||20)*UPC,Lt=sp?blen(o.spine):Lf0*2.6,
    sd=sp?(o.spine[3][0]>o.spine[0][0]?1:-1):(rnd()<.5?1:-1),SC=['#2c4a1e','#4a7432','#78a04e','#aacb84'],Dm=3.9*UPC*R(.94,1.06),lc='#4c7a34',fo=op<.2?0:.12+.5*op;
  let Lfl=0,Lb=0,nF=0;
  const P=spGrow(o,Lt,{face:R(-.5,.5),wig:.018,e:.05,seg:6,w:4.4,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.6:.42:.4));Lb=L-Lfl;nF=Math.max(9,Math.round(Lfl/UPC/1.35));const N=[];
    /* the sheathing sword leaves at the foot, two-ranked */
    const nl=sp?(o.short?0:1):2,ph=R(70,110);for(let j=0;j<nl;j++)N.push({l:Lb*(.04+.14*j),phi:ph+j*180,kink:R(.3,.8),leaf:{a:R(5,9),len:Math.min(Lb*R(.75,.95),(L-Lb*.1)*.8)*(1-.12*j),w:.065}});
    /* a side spike from the axil of a bract high on the stem */
    if(!o.short)N.push({l:Lb*R(.7,.82),phi:sd>0?270:90,kink:sd*R(2,4),lat:{len:Lfl*R(.5,.65),a:R(24,32),w:2.6,e:.05,dphi:0}});
    /* the zigzag: at each flower the rachis turns away from it; the arch: every turn biased to the outer side */
    for(let i=0;i<nF;i++){const q=i/(nF-1);N.push({l:Lb+Lfl*(.02+.96*spQ(i,nF,.5)),phi:90,kink:(i%2?1:-1)*R(10,14)+sd*(4+12*q*q)})}
    return N}}),A=P.A,s0=Lb/P.L,sl=[];
  /* the nodes by their share of the grown length (the arch lengthens the laid axis, so lengths along it would fall short of the tip) */
  for(let i=0;i<nF;i++)sl.push((Lb+Lfl*(.02+.96*spQ(i,nF,.5)))/P.L);
  const cuts=[0,s0*.5,s0];for(const x of sl)cuts.push(x);cuts.push(1);spStemP(A,parts,cuts.slice(0,3),4.4,3.4,SC,s0);spStemP(A,parts,cuts.slice(2),3.2,1.4,SC,1,s0);
  for(const la of P.lats){const B2=la.A,sb=.04,c2=[0,.5];for(let i=1;i<=6;i++)c2.push(.35+.65*i/6);spStemP(B2,parts,[0,.35,.7,1],2.6,1.2,SC);l42CrRace(B2,parts,.35,Math.max(5,Math.round(nF*.55)),Dm*.9,cw,cache,fo*.55)}
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp&&lf.nd.l<12*UPC)continue;const f0=A.at(lf.s),ta=Math.atan2(-f0.T[1],f0.T[0]),la=Math.atan2(-lf.H[1],lf.H[0]);let da=la-ta;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;
    da=Math.max(-.22,Math.min(.22,da));const fs=Math.max(.3,Math.hypot(lf.H[0],lf.H[1])),p=[lf.pos[0],-lf.pos[1]],face=Math.max(.25,Math.abs(lf.U[2])),front=lf.H[2]>0;
    parts.push({z:A.zk(lf.s,lf.pos[2]+(front?6:-6)),fn:par=>swordLeaf(par,p[0],p[1],ta,lv.len*fs,lv.w,lc,{face,da,sw:4.6,sh:.12,bend:sd*R(.02,.08)})})}
  l42CrRace(A,parts,s0,nF,Dm,cw,cache,fo,sl);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.4,bc:SC}}

/* ---------- shared: a frame whose face is z and whose top turns toward up (a flower at the end of its pedicel, its upper tepals to the sky) ---------- */
function l42Fr(z,up=[0,1,0]){const Z=V3.nz(z);let Y=V3s(up,V3.sc(Z,V3.dot(up,Z)));if(V3l(Y)<1e-3)Y=Math.abs(Z[2])<.9?[0,0,1]:[1,0,0];Y=V3.nz(V3s(Y,V3.sc(Z,V3.dot(Y,Z))));return[V3.cr(Y,Z),Y,Z]}

/* ---------- Peruvian lily (Alstroemeria hybrids; Alstroemeriaceae): a leafy stem 60–90 cm, its leaves scattered, lanceolate, each twisted round at its base so its paler underside faces up
   (resupinate); at the top a whorl of four to six leafy bracts and an umbel of three to six rays, each ending in a flower and often forking again into a younger flower or a bud;
   the flower a funnel 4–6 cm, six tepals: three outer broad, often green at the tip, three inner narrower — the upper two streaked and flecked dark over a yellow or orange blotch;
   six stamens and the style curving up out of it. Colours without number ---------- */
const L42_AL=[
 {id:'blanc',n:'Blanc (Virginia)',c:'#f7f3ea',in:'#f2dc5a',fl:'#4a2a2a'},
 {id:'prestige',n:'Blanc champagne (Prestige)',c:'#f4ecdc',in:'#ecd2a0',fl:'#4a1414'},
 {id:'blanc-rose',n:'Blanc à pointes roses',c:'#f8f0ee',in:'#f2dc68',fl:'#5a2a3a',tips:'#e88aac'},
 {id:'rose-tendre',n:'Rose tendre',c:'#f2b8c8',in:'#f4d860',fl:'#5a2a3a'},
 {id:'rose',n:'Rose',c:'#e886a8',in:'#f2d050',fl:'#4a1a2a'},
 {id:'fuchsia',n:'Fuchsia',c:'#d0407a',in:'#f0c040',fl:'#3a0a1a'},
 {id:'lilas',n:'Lilas',c:'#b890d0',in:'#f0d860',fl:'#3a1a3a'},
 {id:'pourpre',n:'Pourpre',c:'#8a3a86',in:'#f0c840',fl:'#2a0a20'},
 {id:'jaune',n:'Jaune',c:'#f4cd44',in:'#f0a830',fl:'#4a2410'},
 {id:'bali',n:'Jaune bordé de rouge (Bali)',c:'#f2c43a',in:'#f0a030',fl:'#3a1408',tips:'#d0302a'},
 {id:'abricot',n:'Abricot',c:'#f4b080',in:'#f6d070',fl:'#5a2a14'},
 {id:'orange',n:'Orange',c:'#ee8a32',in:'#f4c040',fl:'#3a1408'},
 {id:'saumon',n:'Saumon',c:'#f09a88',in:'#f4d060',fl:'#4a1a14'},
 {id:'rouge',n:'Rouge (Noize)',c:'#c22a3a',in:'#f0b030',fl:'#2a0808'},
 {id:'bordeaux',n:'Bordeaux',c:'#7a1a2a',in:'#e8a030',fl:'#1a0408'}];
const L42_ALO=prof([[0,.18],[.25,.55],[.6,.95],[.82,1],[.95,.7],[1,.2]]),L42_ALI=prof([[0,.15],[.3,.42],[.65,.9],[.85,1],[.96,.6],[1,.15]]);
/* one flower in its frame (local Z its face, Y its top): outer tepals at 90, 210 and 330 degrees, inner ones between (the two upper streaked), stamens and style curving up from the throat */
function l42AlsFlo(par,B,O,Dm,cw,op,cache){const Rr=Dm/2,k=G(par),c=cw.c,cb=mix(c,'#d8dcc0',.25),it=[],det=DET>=1.5,nz=B[2][2],o2=sm01((op-.15)/.85),ka=.45+.55*o2;
  it.push(tubeFlat(B,O,[[0,0,-Rr*.36],[0,0,-Rr*.16],[0,0,Rr*.02]],Rr*.06,Rr*.1,'#7a9a4a',{ink:'#3e5a28',zb:-Rr*.3}));
  for(let j=0;j<6;j++){const outer=j%2===0,ph=(90+j*60+R(-4,4))*D,upIn=!outer&&(j===1||j===5),l=ligule(B,O,{phi:ph,r0:Rr*.08,z0:outer?0:Rr*.03,L:Rr*(outer?1:.92)*R(.96,1.03),W:Rr*(outer?.5:upIn?.3:.34),wp:outer?L42_ALO:L42_ALI,
      a0:(outer?.42:.32)*ka,a1:(outer?1.32:1.16)*ka,pw:1.5,th:outer?.55:.35,tip:'round',wav:outer?.05:0,wk:3,n:det?8:6,tw:R(-.15,.15)}),
      dk=upIn&&!LOD?(g2,l2)=>{if(l2.nm[2]<0)return;let d='';const n=l2.S.length-1;for(let r=1;r<=Math.round(n*.62);r++)for(const u of[1,2,3]){if((r+u)%2&&r>2)continue;const a=l2.S[r][u],b=l2.S[Math.min(n,r+1)][u],t=.55;d+=`M${f(a[0])},${f(a[1])}L${f(a[0]+(b[0]-a[0])*t)},${f(a[1]+(b[1]-a[1])*t)}`}
        E('path',{d,stroke:cw.fl,'stroke-width':1.05,'stroke-linecap':'round','stroke-opacity':.85,fill:'none'},g2)}:null;
    it.push({l,c,cb,ink:shd(c,-.4),lift:.3,basec:upIn?cw.in:null,bf:.6,bo:.92,tipc:cw.tips||null,tf:.6});
    if(dk)it.push({z:l.z+.001,fn:g2=>dk(g2,l)})}
  spPetals(k,it,cache);if(LOD||o2<.3)return k;
  if(nz>-.2){const sl=[];for(let j=0;j<6;j++){const x=(j-2.5)/2.5*Rr*.2+R(-.02,.02)*Rr,P=[[x*.15,-Rr*.04,Rr*.02],[x*.5,-Rr*.06,Rr*.3],[x*.85,Rr*.04,Rr*.56],[x,Rr*.18+Math.abs(x)*.3,Rr*.7]].map(p=>PJ(B,O,p));sl.push(P)}
    E('path',{d:sl.map(q=>smooth(q.map(p=>[p[0],p[1]]),false)).join(''),stroke:mix(c,'#f2ecd8',.35),'stroke-width':1.05,fill:'none','stroke-linecap':'round'},k);
    let an='';for(const q of sl){const e=q[3],b=q[2],dx=e[0]-b[0],dy=e[1]-b[1],l=Math.hypot(dx,dy)||1,al=Rr*.07;an+=`M${f(e[0]-dx/l*al*.4)},${f(e[1]-dy/l*al*.4)}l${f(dx/l*al)},${f(dy/l*al)}`}
    E('path',{d:an,stroke:mix(cw.fl,'#9a6a7a',.45),'stroke-width':f(Math.max(1.05,Rr*.055)),'stroke-linecap':'round',fill:'none'},k)}
  return k}
function l42AlsBud(par,B,O,s,cw,a){const bc=mix('#9cbc68',cw.c,.12+.3*a),tc=mix(cw.tips||cw.c,'#9cbc68',.25-.2*a);spBud(par,B,O,s,s*.42,bc,{tp:.3,pw:.55});
  /* the colour showing at the tip of the folded tepals */
  spBud(par,B,V3.add(O,V3.sc(B[2],s*.5)),s*.48,s*.34,tc,{tp:.45,pw:.5});if(LOD)return;
  const t=PJ(B,O,[0,0,s*.98]),b=PJ(B,O,[0,0,s*.6]);E('path',{d:`M${f(b[0])},${f(b[1])}L${f(t[0])},${f(t[1])}`,stroke:shd(bc,-.35),'stroke-width':1.05,'stroke-opacity':.5,'stroke-linecap':'round'},par)}
function l42AlsPlant(g,t,o){const cw=o.cw||cwNear(L42_AL,o.col)||L42_AL[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||6)*UPC,k=G(g),B=frameOf(o,.4,true),cache={},
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],sc=['#2e4a20','#4e7a34','#76a04e','#a8c886'],lc='#4e7c34';
  let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(Dm*2.6))):1,rim=!!o.rim,nL=rim?0:3+(rnd()<.5?1:0),nR=Math.round(R(3,5.4)),Lr=Dm*1.45*kr,mods=[];
  /* the stem with its scattered, twisted leaves (2/5 phyllotaxis) */
  for(let j=0;j<nL;j++)mods.push(['F',{l:Dm*(j?.45:.6)*kr,w1:Dm*(.075-.004*j)}],['[',{}],['/',{a:j*144+R(-15,15)}],['&',{a:R(48,62)}],['Lv',{i:j}],[']',{}]);
  mods.push(['F',{l:Dm*(rim?.25:.5)*kr,w1:Dm*.06,aim:V3.nz(V3.add(up,V3.sc(B[2],.35))),k:.25}],['Wh',{}]);
  /* the whorl of leafy bracts under the umbel */
  if(!rim)for(let j=0;j<5;j++)mods.push(['[',{}],['/',{a:j*72+R(-12,12)}],['&',{a:R(62,78)}],['Lv',{i:9,br:1}],[']',{}]);
  /* the rays: each a flower at its age, the stronger ones forking into a younger flower or a bud */
  const ph0=R(0,360);
  for(let i=0;i<nR;i++){const age=op<.3?R(.05,.25):i===0?1:op<.7?(i%2?R(.05,.3):R(.5,.8)):(rnd()<.75?R(.75,1):R(.1,.35)),el=i===0?R(8,16):R(30,46),fork=rnd()<.6;
    mods.push(['[',{w:Dm*.03}],['/',{a:ph0+i*360/nR+R(-14,14)}],['&',{a:el}],['F',{l:Lr*R(.75,1.05)*(i?1:.8)*(age<.4?.8:1),w1:Dm*.022,e:.05}]);
    if(fork)mods.push(['[',{w:Dm*.018}],['/',{a:R(-50,50)}],['&',{a:R(28,40)}],['F',{l:Lr*R(.35,.5),w1:Dm*.016,e:.06}],['K',{age:Math.min(age,R(.05,.3)),i,sub:1}],[']',{}]);
    mods.push(['F',{l:Lr*.12,w1:Dm*.02,e:.04}],['K',{age,i}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.025,seg:Dm*.12,T:[0,1,0],e:.012,w:Dm*.08});for(const ch of res.chains)ch.c=sc;
  const wh=res.organs.find(q=>q.t==='Wh'),apex=wh.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const a=og.p.age,z=og.p.i===0?V3.nz(V3.add(og.H,V3.sc(B[2],.8))):og.H,Bf=l42Fr(z,V3.nz(V3.add(up,V3.sc(og.H,-.2))));
      if(a<.4){const s=Dm*(.36+.3*a);return{parts:[{z:pos[2],fn:par=>l42AlsBud(par,l42Fr(og.H),pos,s,cw,a)}]}}
      const op2=Math.min(1,a*1.1),Df=Dm*(og.p.sub?.9:1)*(.85+.15*op2);return{parts:[{z:pos[2]+Df*.18*Bf[2][2],fn:par=>l42AlsFlo(par,Bf,V3.add(pos,V3.sc(Bf[2],Df*.18)),Df,cw,op2,cache)}]}}
    if(og.t==='Lv'){const br=og.p.br,len=Dm*(br?R(.75,1):R(1.25,1.55));return{ext:!br,parts:l31Leaf3(og,pos,len,br?.24:.2,lc,{wp:LS_LANCE,droop:br?.12:.2,fold:.18,tw:br?R(-.4,.4):(rnd()<.5?-1:1)*R(2.4,2.9),face:.5})}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- bouvardia (Bouvardia hybrids of B. longiflora and B. ternifolia: the Royal series; Rubiaceae): a stem 40–60 cm, its leaves opposite (or in threes), ovate-lanceolate, pointed,
   ending in a loose, flat-topped corymb 7–12 cm of 15–30 flowers on slender branched pedicels: a slender corolla tube 1.5–2.5 cm flaring into four spreading pointed lobes (a cross, a star),
   or double — the lobes in two or three crossed rings; the buds long, slim clubs, the four lobes still folded at the tip; younger corymbs in the upper axils.
   White, pink, red, salmon; the ones at the heart of the corymb open last ---------- */
const L42_BV=[
 {id:'blanc',n:'Blanc (Royal Daphne Supreme White)',c:'#f8f6f0'},{id:'blanc-double',n:'Blanc double',c:'#f6f4ec',d:1},
 {id:'creme',n:'Crème',c:'#f2ead0'},{id:'rose-pale',n:'Rose pâle',c:'#f6ccd8'},{id:'rose',n:'Rose (Royal Daphne)',c:'#f2a2bc'},{id:'rose-double',n:'Rose double',c:'#f0a6c0',d:1},
 {id:'rose-coeur',n:'Rose à cœur foncé',c:'#e886aa',eye:'#b0285a'},{id:'rose-vif',n:'Rose vif',c:'#e6528a'},{id:'saumon',n:'Saumon',c:'#f3a890'},{id:'saumon-double',n:'Saumon double',c:'#f2a088',d:1},
 {id:'rouge',n:'Rouge (Royal Daphne Red)',c:'#c21e30'},{id:'rouge-double',n:'Rouge double',c:'#c62434',d:1}];
/* the corymb in its frame B (z up its axis) on O, Dm across when open: florets on a flat cap, each on its pedicel from one of the few branches of the head, its tube back toward it;
   buds in the heart; all drawn far to near (pedicels first) */
function l42BvHead(par,B,O,Dm,cw,op,o={}){const g=G(par),q=sm01((op-.08)/.86),rot=R(0,6.283),det=DET>=1.5,lod=LOD?.6:1,cache={},sz0=o.sz||1,rf=Dm*.1*sz0,tl=Dm*.2*sz0,
    Rs=Dm*(.55+.2*q)*sz0,al=(22+14*q)*D,H0=Dm*.12,Cc=[0,0,H0-Rs],N=Math.max(6,Math.round((det?28:24)*lod*(o.nk||1))),nB=Math.round(N*(1-.7*q)),items=[],cB=1-Math.cos(al),dbl=!!cw.d;
  /* the branches of the head: from its base up to their forks under the cap */
  const nb=5,bp=[];for(let j=0;j<nb;j++){const a=rot+j*6.283/nb,th=al*.55,n=[Math.sin(th)*Math.cos(a),Math.sin(th)*Math.sin(a),Math.cos(th)];bp.push(V3.add(Cc,V3.sc(n,Rs-tl*1.35)))}
  const base=[0,0,-Dm*.02],ped=[],pw=1.05,pc='#6a8e48';
  for(let i=0;i<N;i++){const t=(i+.5)/N,ib=i<nB,ct=1-(ib?(i+.5)/Math.max(1,nB)*cB*.45:cB*.3+(i-nB+.5)/Math.max(1,N-nB)*cB*.7),th=Math.acos(ct),ph=i*2.39996+rot,n=V3.nz([Math.sin(th)*Math.cos(ph)+R(-.04,.04),Math.sin(th)*Math.sin(ph)+R(-.04,.04),ct]),
      P=V3.add(Cc,V3.sc(n,Rs)),[X,Y]=l31Fr(n),nV=toV(B,n),z=PJ(B,O,P)[2],bj=bp[Math.round(((ph-rot)/6.283*nb%nb+nb)%nb)%nb];
    if(ib){/* a bud: a slim tube swelling into the club of the folded lobes, coloured, greener the younger */const age=q*(1-i/Math.max(1,nB)),lb=tl*(.9+.35*age),bc=mix(cw.c,'#9ab070',.42-.3*age),Tb=V3.add(P,V3.sc(n,-lb*.55));
      const pr=prof([[0,.1],[.45,.12],[.7,.22],[.88,.25],[1,.05]]),bp2=[];for(let a=0;a<=8;a++){const v=a/8,r=Math.max(.5,pr(v)*rf*1.05);for(let m=0;m<8;m++){const w=m/8*6.283,s=PJ(B,O,V3.add(V3.add(Tb,V3.sc(n,lb*v)),V3.add(V3.sc(X,Math.cos(w)*r),V3.sc(Y,Math.sin(w)*r))));bp2.push([s[0],s[1]])}}
      ped.push([bj,Tb]);items.push({z:z+lb*.2*nV[2],fn:()=>E('path',{d:smooth(hull2(bp2)),fill:budFill(bc),stroke:shd(bc,-.5),'stroke-width':.35,'stroke-opacity':.6},g)});continue}
    const sz=rf*(.86+.2*Math.pow(t,1.4))*(.72+.28*q),Tb=V3.add(P,V3.sc(n,-tl)),col=cw.c,front=nV[2]>=0,lite=h2l(col)[2]>.8;ped.push([bj,Tb]);
    /* the corolla tube, from its pedicel up to the lobes */
    {const a=PJ(B,O,Tb),m=PJ(B,O,V3.add(Tb,V3.sc(n,tl*.5))),b=PJ(B,O,P),C=[[a[0],a[1]],[m[0],m[1]],[b[0],b[1]]],tc=mix(col,'#e4e8d0',.18);
      items.push({z:(a[2]+b[2])/2-.02,fn:()=>E('path',{d:smooth(chpTube(C,[sz*.13,sz*.15,sz*.2],2)),fill:toneAt(l31Pal(tc,cache),.6),stroke:shd(tc,-.45),'stroke-width':.3,'stroke-opacity':.55},g)})}
    /* the lobes: four, ovate and pointed, spreading flat; a double has a second ring crossed over it and a small third one */
    const rings=dbl?[[1,0,0],[.82,.785,sz*.1],[.55,.39,sz*.2]]:[[1,0,0]],I=front?lightI(nV):lightI(V3.sc(nV,-1))*.82,P7=l31Pal(front?col:mix(col,'#c8d0b0',.2),cache);
    rings.forEach(([rk,dr,dz],ri)=>{const pts=[];for(let kk=0;kk<4;kk++){const a0=kk*1.5708+ph*1.3+dr;for(const[da,r,tp]of[[-.78,.2],[-.6,.55],[-.36,.86],[-.16,.98],[0,1.04,1],[.16,.98],[.36,.86],[.6,.55]]){const a=a0+da,rr=sz*r*rk,p=V3.add(P,V3.add(V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)),V3.sc(n,dz-sz*.08*r*r+(dbl?sz*.12*r*(1-rk):0)))),s=PJ(B,O,p);pts.push([s[0],s[1],tp])}}
      const fill=toneAt(P7,.22+.55*I-.06*ri);items.push({z:z+ri*.01,fn:()=>E('path',{d:smooth(tipOut(pts)),fill,stroke:lite?shd(col,-.4):P7.d1,'stroke-width':.35,'stroke-opacity':lite?.75:.6,'stroke-linejoin':'round'},g)})});
    if(!dbl&&nV[2]>.25)items.push({z:z+.02,fn:()=>{const c=PJ(B,O,P),e1=V3s(PJ(B,O,V3.add(P,V3.sc(X,sz*.13))),c),e2=V3s(PJ(B,O,V3.add(P,V3.sc(Y,sz*.13))),c);E('path',{d:chpEll(c,e1,e2,.5),fill:cw.eye||shd(col,-.18),opacity:.85},g)}})}
  /* the pedicels: base → branch fork → each tube, one path, as wide as a stroke may be */
  let d='';const b0=PJ(B,O,base);for(const p of bp){const e=PJ(B,O,p);d+=`M${f(b0[0])},${f(b0[1])}L${f(e[0])},${f(e[1])}`}
  for(const[a,b]of ped){const s=PJ(B,O,a),e=PJ(B,O,b);d+=`M${f(s[0])},${f(s[1])}L${f(e[0])},${f(e[1])}`}
  E('path',{d,stroke:pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn();return g}
/* the plant of a head grown on its stem (chpHeadS of lot 17), its head set in the painter's order by where it faces (S.fz × its size forward of its node), so the top of the stem that meets its heart passes behind it */
function l42HeadS(k,o,S){const B=S.B,up=S.up,Dm=S.D,w=S.w,op=S.op;let U0=V3s(S.face,V3.sc(up,V3.dot(S.face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nN=o.rim?0:S.nodes??1,li=Dm*(S.li??.5),lp=Dm*(S.lp??1)*(o.rim?.55:1),Lh=nN*li+lp,sc=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lh)):1,sd=o.rim?null:S.side,ph0=R(0,360);
  const rules={A:p=>p.n>0?[['F',{l:li*sc*R(.85,1.15),w1:w*(1.06+.05*p.n)}],['N',{i:p.n}],['A',{n:p.n-1}]]:[['F',{l:lp*sc*.4,w1:w*1.03,aim:S.aim,k:(S.aimK??.2)*.45}],['F',{l:lp*sc*.6,w1:w,aim:S.aim,k:S.aimK??.2}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],nl=S.opp?2:1,r0=ph0+p.i*(nl===2?90:137.5);
      for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:r0+j*180+R(-14,14)}],['&',{a:(S.leafAng??50)+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      if(sd&&p.i<=(sd.top??1))for(let j=0;j<(sd.n||1);j++)if(rnd()<(sd.p??.5)){const L1=Dm*(sd.len||.8)*sc*R(.8,1.15),ws=w*(sd.w??.62);
        out.push(['[',{w:ws}],['/',{a:r0+(S.opp?90:24)+j*180+R(-20,20)}],['&',{a:(sd.ang||32)+R(-8,8)}],['F',{l:L1*.45,w1:ws*.85,e:sd.e??.05}],['F',{l:L1*.55,w1:ws*.7,e:sd.e??.05}],['Kb',{age:R(sd.age[0],sd.age[1]),i:p.i}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:S.wig??.03,seg:Dm*(S.seg||.12),T:[0,1,0],e:S.e??.02,w:w*1.18}),main=res.organs.find(q=>q.t==='K');
  for(const ch of res.chains)ch.c=S.cols;const Bm=S.mainB||lsFrame(main,null,R(-.25,.25)),apex=V3.add(main.pos,S.apex?S.apex(Bm):[0,0,0]);
  lsPlant(k,res,{O:[0,0,0],apex,cols:S.cols,piece:S.piece,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2]+Dm*(S.fz||0)*Bm[2][2],fn:par=>S.flower(par,Bm,pos,op,og)}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,op*1.1),Bf=lsFrame(og,null,R(-.3,.3));return{parts:[{z:pos[2],fn:par=>S.young(par,Bf,pos,a,og)}]}}
    if(og.t==='Lv'&&S.leaf){const pt=S.leaf(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    if(og.t==='Nd'&&S.node){const pt=S.node(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    return null}});
  return lsNeck(res,[0,0,0],apex)}
function l42BvPlant(g,t,o){const cw=o.cw||cwNear(L42_BV,o.col)||L42_BV[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||10)*UPC,k=G(g),B=frameOf(o,.4,true),
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.3))),sc=['#2e4a20','#4c7034','#76985a','#a8c48a'];
  const r=l42HeadS(k,o,{B,up,face:A0,aim,aimK:.3,fz:.35,D:Dm,w:Dm*.045,cols:sc,op,nodes:2,li:.55,lp:.7,opp:1,leafAng:55,side:{p:.65,n:1,top:2,len:.8,ang:30,age:[0,.6],e:.05},seg:.12,wig:.03,e:.015,
    apex:Bm=>V3.sc(Bm[2],Dm*.06),
    flower:(par,Bf,O,op2)=>l42BvHead(par,Bf,O,Dm,cw,op2),
    young:(par,Bf,O,a)=>l42BvHead(par,Bf,O,Dm*.6,cw,a*.6,{nk:.5}),
    leaf:(og,pos)=>l31Leaf3(og,pos,Dm*(og.p.i<=1?R(.45,.6):R(.6,.75)),.38,'#3f6a2e',{wp:LS_OVATE,nv:4,droop:.16,fold:.24})});
  open(k,t,1000,8,.3);return r}

/* ---------- registries ---------- */
Object.assign(GH,{'lis-ot-orienpet':l42Ot,'kniphofia':l42KnSpike,'crocosmia':l42CrSpike,'alstroemere':l42AlsPlant,'bouvardia':l42BvPlant});
Object.assign(CWS,{'lis-ot-orienpet':L42_OT,'kniphofia':L42_KN,'crocosmia':L42_CR,'alstroemere':L42_AL,'bouvardia':L42_BV});
Object.assign(SZG,{'lis-ot-orienpet':[18,20,22,22,24,25],'kniphofia':[12,15,18,18,20,25],'crocosmia':[15,18,20,20,22,25],'alstroemere':[5,5.5,6,6,6.5,7],'bouvardia':[7,8,9,10,10,12]});
Object.assign(GHI,{'lis-ot-orienpet':{form:'etoile',size:3,k:'head',rk:.75},'kniphofia':{form:'epi',size:1,k:'plant',self:62*UPC,tip:.9,fx:3.5*UPC},'crocosmia':{form:'epi',size:1,k:'plant',self:62*UPC,tip:.55,fx:7*UPC},'alstroemere':{form:'etoile',size:2.5,k:'head',rk:2.2},'bouvardia':{form:'sphere',size:1.8,k:'head',rk:.95}});
Object.assign(STEML,{'lis-ot-orienpet':{shape:'lance',n:[1,2],len:13,w:.3,col:'#33602a',up:34,par:1,gloss:.55}});
for(const id of['lis-ot-orienpet','alstroemere','bouvardia'])GH_BUDS.add(id);
