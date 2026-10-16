/* ================= Serre, lot 37 — globes et graminées de remplissage, poussés par le L-système : grande astrance, didiscus, orpin d'automne, amarantine, queue-de-lièvre ================= */
/* ---------- shared: a floret head is drawn in its own frame B (z up its axis) from O, the top of its stalk (view space); the florets go through the depth bands of lot 14 (a14Bands),
   every pedicel a stroke of at least 1.05 from the point of its carrier, every eye inside its floret: nothing small is left loose ---------- */
const G37_PW=1.05;
/* a screen segment as a sub-path */
const g37Seg=(a,b)=>`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
/* the filled silhouette of a set of local points (the cushion under a dome of florets, so no gap shows through it) */
function g37Hull(B,O,pts){const P=pts.map(p=>PJ(B,O,p));let z=0;for(const p of P)z+=p[2];return{q:hull2(P.map(p=>[p[0],p[1]])),z:z/P.length}}
/* a hairy stem on the sheets: short pale hairs standing out of both edges of a screen polyline (the axis lsNeck hands back), leaning toward its tip */
function g37Hairs(par,np,w,col,o={}){if(DET<1.5||LOD||!np||np.length<2)return;const n=np.length,lh=o.l||1.4,ev=o.every||3;let d='',acc=0;
  for(let i=1;i<n;i++){const a=np[i-1],b=np[i],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l<1e-6)continue;acc+=l;if(acc<ev)continue;acc=0;const ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
    for(const s of[-1,1]){const x=a[0]+nx*s*w*.45,y=a[1]+ny*s*w*.45,h=lh*R(.7,1.2);d+=`M${f(x)},${f(y)}l${f(nx*s*h*.8-ux*h*.6)},${f(ny*s*h*.8-uy*h*.6)}`}}
  if(d)E('path',{d,stroke:col,'stroke-width':.3,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},par)}
/* ---------- great masterwort (Astrantia major): a collar of 12–20 papery bracts, lanceolate and drawn out into a fine point, netted with veins, often tipped green,
   round a pincushion dome of tiny florets each on its own pedicel (the outer ones male, longer stalked), their stamens standing out; the bracts clasp the bud like a little ball,
   spread into a star when it opens. The stems fork near the top: the first umbel oldest, the later ones on the forks younger; at each fork a sessile three- to five-lobed leaf ---------- */
const CW_G37AS=[
 {id:'blanc',n:'Blanc verdâtre (Large White)',c:'#e7ebd8',tip:'#7fa05e',vn:'#93ae78',fl:'#eef0e2',cb:'#d4dcbc'},
 {id:'star-of-billion',n:'Blanc pointé de vert (Star of Billion)',c:'#f3f2e8',tip:'#5f8c46',vn:'#86a86c',fl:'#f0eee4',cb:'#dfe4cc'},
 {id:'rose-pale',n:'Rose pâle (Buckland)',c:'#ecd3da',tip:'#8fa676',vn:'#c09aa6',fl:'#e6c2cc',cb:'#dccbc6'},
 {id:'rose',n:'Rose (Roma)',c:'#d99bb1',tip:'#b47a8a',vn:'#b47088',fl:'#d58aa6',cb:'#c8a2a8'},
 {id:'sparkling-pink',n:'Vieux rose (Sparkling Stars Pink)',c:'#c98a9e',tip:'#8a9a6a',vn:'#a46a7e',fl:'#c87e96',cb:'#bc9a9c'},
 {id:'venice',n:'Pourpre (Venice)',c:'#a23c78',tip:'#7a2a5a',vn:'#7a2458',fl:'#a83a7a',cb:'#8e4a6e'},
 {id:'ruby-wedding',n:'Bordeaux (Ruby Wedding)',c:'#8e2b4d',tip:'#5e1a30',vn:'#5e1830',fl:'#94284e',cb:'#7a3446'},
 {id:'claret',n:'Rouge vin (Claret)',c:'#6a1f34',tip:'#4a1424',vn:'#40101e',fl:'#7a2038',cb:'#5e2a32'},
 {id:'star-of-beauty',n:'Pourpre à pointes blanches (Star of Beauty)',c:'#8c3466',tip:'#f0ece0',tb:.5,vn:'#6a2048',fl:'#a8447a',cb:'#7a4460'}];
const G37_ASC=['#2c4220','#4a6634','#6f8e52','#a2bc84'],G37_BRP=prof([[0,.32],[.14,.72],[.38,1],[.62,.74],[.84,.3],[1,0]]);
/* one bract: th its azimuth, el its elevation (rad), Lb its length, wb its half-width, from radius r0; cup lifts its tip toward its upper face (< 0 curls it inward, in the bud) */
function g37Bract(B,O,th,el,Lb,wb,r0,cup,cw,det){const c=Math.cos(th),s=Math.sin(th),ce=Math.cos(el),se=Math.sin(el),dir=[c*ce,s*ce,se],sd=[-s,c,0],nm=[-c*se,-s*se,ce],b0=[c*r0,s*r0,0];
  const at=(t,u)=>{const w=wb*G37_BRP(t)*u;return V3.add(b0,V3.add(V3.sc(dir,Lb*t),V3.add(V3.sc(sd,w),V3.sc(nm,Lb*cup*t*t+Math.abs(w)*.22))))};
  const n=det?9:6,Lp=[],Rp=[];for(let i=0;i<=n;i++){const t=i/n;Lp.push(PJ(B,O,at(t,-1)));Rp.push(PJ(B,O,at(t,1)))}
  const out=Lp.concat(Rp.slice(0,n).reverse());let z=0;for(const p of out)z+=p[2];z/=out.length;
  const nV=toV(B,V3.nz(V3.add(nm,V3.sc(dir,-cup*1.2)))),front=nV[2]>=0,I=lightI(front?nV:V3.sc(nV,-1)),base=PJ(B,O,at(0,0)),tip=Lp[n];
  return{z,fn:par=>{const col=front?cw.c:cw.cb,P=pal7(col),ti=cw.tip,lt=h2l(col)[2]>.8,Ib=lt?.62+(I-.6)*.6:I,
      fill=(det&&!LOD)?ugrad(base[0],base[1],tip[0]+.01,tip[1],[[0,toneAt(P,Ib-.05)],[(cw.tb||.7)*.7,toneAt(P,Ib)],[cw.tb||.8,toneAt(pal7(mix(col,ti,.4)),Ib)],[1,toneAt(pal7(ti),Ib)]]):toneAt(pal7(mix(col,ti,.2)),Ib);
    E('path',{d:smooth(out.map(p=>[p[0],p[1]])),fill,stroke:shd(mix(col,ti,.4),-.5),'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
    /* the veins: three running to the point, netted between them on the sheets */
    if(!LOD&&Lb>6){let d='';for(const u of[-.5,0,.5]){const q=[];for(let i=0;i<=5;i++){const t=.04+.9*i/5,p=PJ(B,O,at(t,u*(1-.6*t)));q.push([p[0],p[1]])}d+=pD(q)}
      if(det)for(let i=1;i<5;i++){const t=.12+.16*i,a=PJ(B,O,at(t,-.5*(1-.6*t))),m=PJ(B,O,at(t+.06,0)),b=PJ(B,O,at(t,.5*(1-.6*t)));d+=`M${f(a[0])},${f(a[1])}L${f(m[0])},${f(m[1])}L${f(b[0])},${f(b[1])}`}
      E('path',{d,stroke:cw.vn,'stroke-width':f(Math.max(.25,Lb*.012)),'stroke-opacity':(front?.55:.4)*(lt?.75:1),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)}}}}
/* the head: Dh its diameter open, op its age (0 a clasped bud … 1 a flat star) */
function g37AstrHead(par,B,O,Dh,op,cw){const g=G(par),q=sm01((op-.06)/.8),det=DET>=1.5,lod=LOD?.6:1,rot=R(0,6.283),parts=[],
    nb=Math.max(8,Math.round((cw.nb||17)*(det?1:.82)*lod)),Lb0=Dh/2*(.62+.38*q),rd=Dh*(.11+.09*q),zc=Dh*.03+rd*.3,r0=Dh*.035;
  /* the collar: one ring, the bracts alternately a little longer and lower */
  for(let j=0;j<nb;j++){const th=rot+j/nb*6.283+R(-.06,.06),lo=j%2,el=(LERP(78,LERP(26,6,sm01((q-.4)/.6)),q)+(lo?-5:4)+R(-4,4))*D,Lb=Lb0*(lo?1.04:.94)*R(.92,1.06),
      cup=LERP(-.3,.1,q)+R(-.04,.04);parts.push(g37Bract(B,O,th,el,Lb,Lb*R(.15,.18),r0,cup,cw,det))}
  /* the dome: florets on pedicels from the heart, the outer ones lower and longer stalked; the stamens their eyes */
  const nf=Math.max(9,Math.round((det?34:22)*lod)),am=LERP(40,78,q)*D,fl=[],pc=mix(cw.fl,'#7f9a5e',.25),s0=Math.max(1.1,Dh*.056*(.7+.3*q)),ec=mix(cw.fl,'#ffffff',.5),ec2=shd(cw.fl,-.35);let zmin=1e9,zmax=-1e9;
  const P0=PJ(B,O,[0,0,Dh*.015]);
  for(let i=0;i<nf;i++){const a=Math.acos(1-(i+.5)/nf*(1-Math.cos(am))),az=i*2.39996+rot,n=[Math.sin(a)*Math.cos(az),Math.sin(a)*Math.sin(az),Math.cos(a)],p=V3.add([0,0,zc],V3.sc(n,rd*R(.94,1.04))),
      nV=toV(B,n),I=lightI(nV[2]>=0?nV:V3.sc(nV,-1))-(nV[2]<0?.12:0),qd=a14Star(B,O,p,n,s0*R(.9,1.1),R(0,6.283),5,.42,.45,0,1),c0=PJ(B,O,V3.add(p,V3.sc(n,s0*.3)));
    const z=PJ(B,O,p)[2];zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);
    fl.push({q:qd,z,c:q<.2?mix(cw.fl,'#a8b88a',.35):cw.fl,I,pd:g37Seg(P0,PJ(B,O,p)),e:q>.25&&nV[2]>-.1?chpDot(c0[0],c0[1],Math.max(.34,s0*.16))+(det?[0,2.1,4.2].map(t=>chpDot(c0[0]+Math.cos(t+i)*s0*.42,c0[1]+Math.sin(t+i)*s0*.42,Math.max(.26,s0*.1))).join(''):''):null,ec:nV[2]>.2?ec:ec2})}
  /* the cushion of the dome, in the shade of its florets, so its gaps show no background */
  const cs=[];for(let j=0;j<12;j++){const a=j/12*6.283;for(const t of[am*.95,am*.5])cs.push([Math.sin(t)*Math.cos(a)*rd*.85,Math.sin(t)*Math.sin(a)*rd*.85,zc+Math.cos(t)*rd*.85])}cs.push([0,0,zc+rd*.85]);
  const cu=g37Hull(B,O,cs);parts.push({z:zmin-.05,fn:par=>E('path',{d:pD(cu.q)+'Z',fill:shd(mix(cw.fl,'#5f6e48',.25),-.4)},par)});
  parts.push(...a14Bands(fl,3,zmin,zmax+.01,{pc,pw:G37_PW,sw:.25,so:.45,lv:det?10:6}));
  drawParts(g,parts);return g}
function g37AstrPlant(g,t,o){const cw=cwPick(CW_G37AS,o),op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||3.5)*UPC,k=G(g),B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],
    A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.5))),w=Math.max(1.9,Dh*.075);
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.22,D:Dh,w,cols:G37_ASC,op,nodes:2,li:1.5,lp:2.1,leafAng:44,side:{p:.95,n:1,top:2,len:2.3,ang:32,age:[.12,.8],e:.04,w:.85},seg:.14,wig:.03,e:.014,
    apex:Bm=>V3.sc(Bm[2],Dh*.04),
    flower:(par,Bf,O,op2)=>g37AstrHead(par,Bf,O,Dh,op2,cw),
    young:(par,Bf,O,a)=>g37AstrHead(par,Bf,O,Dh*(.62+.28*a),a,cw),
    leaf:(og,pos)=>lsLeaf2D(og,pos,Dh*R(.6,.8)*(og.p.i>1?1.15:1),(par,x,y,a,l)=>palmLeaf(par,x,y,a,l,'#557f40',{lobes:og.p.i>1?5:3,spread:og.p.i>1?165:120,pet:.04,wl:.13}))});
  open(k,t,1000,8,.3);return r}
/* ---------- blue lace flower (Trachymene coerulea, syn. Didiscus coeruleus): one simple umbel, flat then gently domed, of a hundred and more tiny five-petalled florets on fine pedicels,
   lavender blue, pink or white, the outer ones open first and a little larger, the heart still in bud; a ring of narrow hairy bracts under it; a slender softly hairy stem,
   a leaf or two cut into three narrow lobes ---------- */
const CW_G37DI=[
 {id:'bleu-lavande',n:'Bleu lavande (Lacy Blue)',c:'#aeb3df',ey:'#f0eee2'},
 {id:'bleu',n:'Bleu ciel (Blue Madonna)',c:'#9db2e4',ey:'#eef0f2'},
 {id:'lilas',n:'Lilas (Madonna Lavender)',c:'#bea9dc',ey:'#f2ece4'},
 {id:'rose',n:'Rose poudré (Lacy Pink)',c:'#eab4c8',ey:'#f6eee8'},
 {id:'blanc',n:'Blanc (Lacy White)',c:'#f5f4ef',ey:'#d8d8b8'}];
const G37_DSC=['#33482a','#56703e','#7e9a62','#b0c494'];
function g37DidiHead(par,B,O,Dh,op,cw){const g=G(par),q=sm01((op-.05)/.85),det=DET>=1.5,lod=LOD?.45:1,rot=R(0,6.283),parts=[],Ru=Dh/2*(.4+.6*q),kap=LERP(.62,.46,q),H0=Dh*.03+Ru*.2,
    N=Math.max(24,Math.round((det?150:84)*lod)),gap=Ru*Math.sqrt(Math.PI/N),fl=[],bud=mix(cw.c,'#a9bb8c',.55),pc=mix('#6f8c4e',cw.c,.15),P0=PJ(B,O,[0,0,Dh*.02]);let zmin=1e9,zmax=-1e9;
  for(let i=0;i<N;i++){const rho=Math.min(1,Math.sqrt((i+.5)/N)*R(.97,1.03)),ph=i*2.39996+rot+R(-.4,.4)/Math.max(1,Math.sqrt(i)*.5),x=rho*Ru*Math.cos(ph),y=rho*Ru*Math.sin(ph),p=[x,y,H0+Ru*kap*(1-rho*rho)],n=V3.nz([2*kap*x/Ru,2*kap*y/Ru,1]),
      nV=toV(B,n),fr=nV[2]>=0,I=lightI(fr?nV:V3.sc(nV,-1))*.8+.12-(fr?0:.06),opn=rho>1.08-q*1.2+R(-.06,.06),z=PJ(B,O,p)[2];zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);
    if(opn){const s=gap*(.95+.3*rho)*R(.92,1.08),qd=a14Star(B,O,p,n,s,R(0,6.283),5,.42,.25,1,0),c0=PJ(B,O,V3.add(p,V3.sc(n,s*.2)));
      fl.push({q:qd,z,c:fr?cw.c:mix(cw.c,'#c4c8b4',.3),I:fr?I:Math.max(.42,I),pd:g37Seg(P0,PJ(B,O,p)),e:fr&&det?chpDot(c0[0],c0[1],Math.max(.3,s*.13)):null,ec:mix(cw.ey,cw.c,.35)})}
    else fl.push({q:a14Bud(B,O,p,n,gap*.75,gap*.5,5),z,c:bud,I,pd:g37Seg(P0,PJ(B,O,p))})}
  parts.push(...a14Bands(fl,3,zmin,zmax+.01,{pc,pw:G37_PW,sw:.22,so:.35,lv:det?10:6}));
  /* the involucre: narrow bracts under the umbel, spreading, a little down at their tips */
  const nb=Math.round(det?16:11),bd=['',''],bc=mix('#5f7d44',cw.c,.1);
  for(let j=0;j<nb;j++){const th=rot+j/nb*6.283,Lb=Ru*R(.28,.4)*(.8+.2*q),el=LERP(55,-8,q)*D,d=[Math.cos(th)*Math.cos(el),Math.sin(th)*Math.cos(el),Math.sin(el)],
      a=PJ(B,O,[0,0,Dh*.02]),m=PJ(B,O,V3.sc(d,Lb*.55)),e=PJ(B,O,V3.add(V3.sc(d,Lb),[0,0,-Lb*.12]));bd[e[2]>a[2]?1:0]+=`M${f(a[0])},${f(a[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`}
  const bz=PJ(B,O,[0,0,0])[2];bd.forEach((d,i)=>{if(d)parts.push({z:i?bz+Ru*.25:zmin-.5,fn:par=>E('path',{d,stroke:bc,'stroke-width':f(Math.max(G37_PW,Dh*.012)),fill:'none','stroke-linecap':'round'},par)})});
  drawParts(g,parts);return g}
function g37DidiPlant(g,t,o){const cw=cwPick(CW_G37DI,o),op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||5.5)*UPC,k=G(g),B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],
    A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.45))),w=Math.max(1.8,Dh*.05);
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.2,D:Dh,w,cols:G37_DSC,op,nodes:1,li:1.1,lp:1.6,leafAng:40,side:{p:.45,n:1,top:1,len:1.3,ang:28,age:[.05,.4],e:.04,w:.8},seg:.12,wig:.03,e:.012,
    apex:Bm=>V3.sc(Bm[2],Dh*.06),
    flower:(par,Bf,O,op2)=>g37DidiHead(par,Bf,O,Dh,op2,cw),
    young:(par,Bf,O,a)=>g37DidiHead(par,Bf,O,Dh*(.55+.25*a),a*.6,cw),
    leaf:(og,pos)=>lsLeaf2D(og,pos,Dh*R(.6,.8),(par,x,y,a,l)=>chpCutLeaf(par,x,y,a,l,'#4f6e3a',{np:2,nl:2,lw:.05,pl:.3,ll:.3,sw:w*1.1,sh:.1}))});
  g37Hairs(k,r.np,w,'#d8dcc8');open(k,t,1000,8,.3);return r}
/* ---------- showy stonecrop (Hylotelephium spectabile 'Brilliant', H. 'Herbstfreude', 'Matrona'): a broad, gently domed corymb, branched again and again underneath,
   packed with hundreds of starry five-petalled florets (their ten stamens a darker eye); in bud a tight green 'broccoli', then pink, and in 'Herbstfreude' brick red to rust as it ages;
   a thick glaucous stem with fleshy, oval, toothed leaves, opposite or in threes ---------- */
const CW_G37SE=[
 {id:'vert',n:'Vert (en boutons)',c:'#a7bf8b',bud:1},
 {id:'vert-pale',n:'Blanc verdi (Stardust)',c:'#d6e0c0',ey:'#c8b8a0'},
 {id:'rose-pale',n:'Rose pâle (Matrona)',c:'#e0a6b6',lf:'#6f7f62',st:['#3a3a2e','#5e5e46','#86866a','#b0b096']},
 {id:'rose',n:'Rose (Brilliant)',c:'#d55f8b'},
 {id:'rose-tendre',n:'Rose tendre (Carmen)',c:'#d88ba1'},
 {id:'rouge',n:'Rouge brique (Herbstfreude)',c:'#a3304a',bd:.35},
 {id:'rouille',n:'Rouille (Herbstfreude tardif)',c:'#9b5634',bd:.2,ey:'#5a2a1a',ripe:1},
 {id:'bronze',n:'Bronze olive (Herbstfreude en graines)',c:'#6e6a45',ripe:1,lf:'#76806a'},
 {id:'pourpre',n:'Pourpre (Purple Emperor)',c:'#8a3a58',lf:'#5a4058',st:['#2e1e26','#4a2e3a','#6a4a56','#94767e']}];
const G37_SSC=['#4a5e44','#73886a','#a0b498','#cad6c2'];
function g37SedHead(par,B,O,Dh,op,cw){const g=G(par),q=cw.bud?0:sm01((op-.08)/.85),det=DET>=1.5,lod=LOD?.4:1,rot=R(0,6.283),parts=[],Ru=Dh/2*(.6+.4*sm01(op/.7)),kap=LERP(.42,.34,q),H0=Ru*.4,
    N=Math.max(40,Math.round((det?330:180)*lod)),gap=Ru*Math.sqrt(Math.PI/N),fl=[],dkc=h2l(cw.c)[2]<.45,budL=dkc?mix(cw.c,'#ffffff',.1):mix(cw.c,'#ffffff',.22),budC=cw.bud?cw.c:dkc?mix(cw.c,'#6f8a5a',.35):mix('#b9c99c',cw.c,.3),el=toV(B,[0,0,1])[2],
    stc=cw.st||G37_SSC,pc=mix(stc[2],cw.c,.12),P0=PJ(B,O,[0,0,0]);let zmin=1e9,zmax=-1e9;
  /* the branches underneath: six to eight primary rays from the top of the stalk, each forking toward its part of the dome */
  const nr=Math.round(det?8:6),hubs=[];let dbr='';
  for(let j=0;j<nr;j++){const ph=rot+j/nr*6.283+R(-.15,.15),rh=Ru*R(.42,.55),hb=[Math.cos(ph)*rh,Math.sin(ph)*rh,H0*.55],e=PJ(B,O,hb),m=PJ(B,O,[hb[0]*.35,hb[1]*.35,H0*.42]);hubs.push(hb);
    dbr+=`M${f(P0[0])},${f(P0[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`}
  /* the florets: on the dome z = H0 + kap·Ru·(1 − ρ²); each pedicel from the nearest hub */
  for(let i=0;i<N;i++){const rho=Math.min(.99,Math.sqrt((i+.5)/N)*.98*R(.97,1.03)),ph=i*2.39996+rot+R(-.4,.4)/Math.max(1,Math.sqrt(i)*.5),x=rho*Ru*Math.cos(ph),y=rho*Ru*Math.sin(ph),p=[x,y,H0+Ru*kap*(1-rho*rho)+R(-.4,.4)*gap*.3],n=V3.nz([2*kap*x/Ru,2*kap*y/Ru,1]),
      nV=toV(B,n),fr=nV[2]>=0,I=lightI(fr?nV:V3.sc(nV,-1))*.7+.2-(fr?0:.12),z=PJ(B,O,p)[2],opn=cw.ripe||!cw.bud&&rnd()<sm01((q-.2)/.55)*(1-.07*rho);zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);
    let hb=hubs[0],bd=1e9;for(const h of hubs){const d=(h[0]-x)**2+(h[1]-y)**2;if(d<bd){bd=d;hb=h}}const pd=rho>.45?g37Seg(PJ(B,O,hb),PJ(B,O,p)):'';
    if(opn){const s=gap*R(.95,1.12),qd=a14Star(B,O,p,n,s,R(0,6.283),5,.3,.3,0,1),c0=PJ(B,O,V3.add(p,V3.sc(n,s*.25)));
      fl.push({q:qd,z,c:mix(cw.c,'#ffffff',(1-q)*.12),I,pd,e:fr&&!cw.ripe?chpDot(c0[0],c0[1],Math.max(.32,s*.15)):null,ec:cw.ey||shd(cw.c,-(cw.bd??.42)*.6)})}
    else fl.push({q:a14Bud(B,O,p,n,gap*.9,gap*.62,7),z,c:!cw.bud&&rnd()<q*1.2?budL:budC,I,pd})}
  /* the cushion: the dome's own silhouette in deep shade, so the packed florets never show a hole */
  const cs=[];for(let j=0;j<16;j++){const a=j/16*6.283;cs.push([Math.cos(a)*Ru*.93,Math.sin(a)*Ru*.93,H0+Ru*kap*.1]);cs.push([Math.cos(a)*Ru*.5,Math.sin(a)*Ru*.5,H0+Ru*kap*.72])}cs.push([0,0,H0+Ru*kap*.95]);
  const cu=g37Hull(B,O,cs),cuC=shd(mix(cw.bud||q<.3?budC:cw.c,stc[1],.35),-.35);
  const bands=a14Bands(fl,3,zmin,zmax+.01,{pc,pw:G37_PW,sw:.22,so:.4,lv:det?12:9}),brw=f(Math.max(1.3,Dh*.014)),
    brP={fn:par=>E('path',{d:dbr,stroke:pc,'stroke-width':brw,fill:'none','stroke-linecap':'round'},par)},cuP={fn:par=>E('path',{d:pD(cu.q)+'Z',fill:cuC},par)};
  /* from above: the branches hidden first, then the cushion and the florets; from beneath: the cushion, the florets, then the branches over them */
  if(el<-.2){cuP.z=-1e6;brP.z=1e6;parts.push(cuP,brP,...bands)}else{brP.z=-1e6-1;cuP.z=-1e6;parts.push(brP,cuP,...bands)}
  drawParts(g,parts);return g}
/* a fleshy leaf on the screen: oval, a short wedge at its base, coarsely toothed in its upper two thirds; thick, so a pale rim lights its upper edge and its lower half is in shade; a waxy bloom */
function g37FleshLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.35,Math.cos(o.tilt??R(.2,.65))),W=len*(o.w||.3),nt=o.nt||5,bend=(o.bend??R(-.06,.06))*len,Lt=[],Rt=[];
  const yb=t=>bend*t*t;for(let i=0;i<=32;i++){const t=i/32,ov=Math.pow(Math.sin(Math.PI*Math.min(1,.04+.96*Math.pow(t,.85))),.8)*(1-.15*t),ph=(t*nt*1.5)%1,th=t>.36&&t<.95?1-.1*ph*ph:1,w=W*ov*th;
    Lt.push([len*t,yb(t)-w*ct]);Rt.push([len*t,yb(t)+w*ct])}
  const out=Lt.concat(Rt.slice().reverse()),lo=Rt.slice().reverse().concat(Lt.map((p,i)=>[p[0],yb(i/32)+(p[1]-yb(i/32))*.05]));
  E('path',{d:pD(out)+'Z',fill:toneAt(P,.6),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:pD(lo)+'Z',fill:P.d1,opacity:.35},g);E('path',{d:pD(Lt.slice(2,29).map(p=>[p[0],p[1]+W*ct*.12])),stroke:P.l2,'stroke-width':f(Math.max(.4,len*.02)),'stroke-opacity':.45,fill:'none','stroke-linecap':'round'},g);
    E('path',{d:`M${f(len*.03)},${f(yb(.03))}Q${f(len*.5)},${f(yb(.5))} ${f(len*.9)},${f(yb(.9))}`,stroke:P.d1,'stroke-width':f(Math.max(.35,len*.012)),'stroke-opacity':.35,fill:'none'},g)}return g}
function g37SedPlant(g,t,o){const cw=cwPick(CW_G37SE,o),op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||11)*UPC,k=G(g),lc=cw.lf||'#7f9a78',stc=cw.st||G37_SSC;
  const r=lsHeadS(k,o,{D:Dh,w:Math.max(3,Dh*.06),cols:stc,op,rr:.3,axisFirst:true,nodes:3,whorl:3,li:.34,lp:.62,aimK:.12,leafAng:52,wig:.012,e:.006,
    flower:(par,B,O,D2,op2)=>g37SedHead(par,B,O,D2,op2,cw),
    leaf:(og,pos)=>lsLeaf2D(og,pos,Dh*R(.36,.46)*(1-.1*(3-og.p.i)/3),(par,x,y,a,l)=>g37FleshLeaf(par,x,y,a,l,lc,{w:.3,nt:5}))});
  open(k,t,1000,6,.3);return r}
/* ---------- globe amaranth (Gomphrena globosa, G. haageana): a small round head of papery bracteoles packed in a spiral like scales, shining and crisp,
   each holding a tiny white or yellow floret that peeps out; round in its youth, the head lengthens as it ages; two leafy bracts hug its foot.
   Thin stems forking two by two, opposite soft oblong leaves ---------- */
const CW_G37GO=[
 {id:'pourpre',n:'Pourpre (Audray Purple)',c:'#8b2b7c'},
 {id:'carmin',n:'Fuchsia carmin (QIS Carmine)',c:'#c2307f'},
 {id:'rose',n:'Rose (Audray Pink)',c:'#e27ca9'},
 {id:'bicolore',n:'Rose à cœur blanc (Audray Bicolor Rose)',c:'#e88ab2',c2:'#f6eef0',bic:1},
 {id:'rose-pale',n:'Rose tendre (Audray Pink Pastel)',c:'#f1c0d3'},
 {id:'blanc',n:'Blanc (Audray White)',c:'#f5f2ec'},
 {id:'vieux-rose',n:'Vieux rose (séché)',c:'#b87470',fl:'#e8dcb0'},
 {id:'lilas',n:'Lilas (QIS Lilac)',c:'#c49ad0'},
 {id:'fraise',n:'Rouge fraise (Strawberry Fields)',c:'#d2232f',fl:'#f2d23a',hg:1},
 {id:'orange',n:'Orange (haageana)',c:'#e5712f',fl:'#f2d23a',hg:1},
 {id:'fireworks',n:'Rose à pointes jaunes (Fireworks)',c:'#e0609e',fl:'#f0d23e',fw:1}];
const G37_GSC=['#33482a','#567040','#7c9a5e','#adc28e'];
function g37GomHead(par,B,O,Dh,op,cw){const g=G(par),q=sm01((op-.05)/.9),det=DET>=1.5,lod=LOD?.45:1,parts=[],Rh=Dh/2*(.52+.48*q),ez=1+.28*q*(cw.hg?.5:1),C=[0,0,Rh*ez*.9],
    N=Math.max(30,Math.round((det?130:78)*lod)),gap=Math.sqrt(4*Math.PI/N)*Rh,sd=R(0,6.283),fl=[],grn=1-sm01(q/.55),flc=cw.fl||'#f4eecb';let zmin=1e9,zmax=-1e9;
  /* the cushion behind the scales */
  const cs=[];for(let i=0;i<14;i++){const zz=-.8+1.8*i/13;for(let j=0;j<8;j++){const a=j/8*6.283,r=Math.sqrt(Math.max(0,1-zz*zz));cs.push([Math.cos(a)*r*Rh*.9,Math.sin(a)*r*Rh*.9,C[2]+zz*Rh*ez*.9])}}
  const cu=g37Hull(B,O,cs),base=mix(cw.c,'#6f8c4e',grn*.6);
  for(let i=0;i<N;i++){const zz=1-2*(i+.5)/N;if(zz<-.78)continue;const r=Math.sqrt(1-zz*zz),a=i*2.39996+sd+R(-.3,.3)/Math.max(1,Math.sqrt(Math.min(i,N-i))*.5),u=[Math.cos(a)*r,Math.sin(a)*r,zz],p=V3.add(C,[u[0]*Rh,u[1]*Rh,u[2]*Rh*ez]),
      n=V3.nz([u[0],u[1],u[2]/ez]),tu=V3s([0,0,1],V3.sc(n,n[2])),tl=V3l(tu),T=tl>.05?V3.sc(tu,1/tl):[Math.cos(a),Math.sin(a),0],S=V3.cr(n,T),b=gap*R(.7,.8)*(.72+.28*Math.min(1,Math.abs(toV(B,n)[2])*1.6)),
      pt=(x,y,h)=>PJ(B,O,V3.add(p,V3.add(V3.sc(T,y*b),V3.add(V3.sc(S,x*b),V3.sc(n,h*b))))),qd=[pt(0,-.55,0),pt(-.42,-.25,.05),pt(-.4,.3,.08),pt(0,.92,.16),pt(.4,.3,.08),pt(.42,-.25,.05)],
      nV=toV(B,V3.nz(V3.add(n,V3.sc(T,-.35)))),fr=nV[2]>=0,I=lightI(fr?nV:V3.sc(nV,-1))+(fr?0:-.15),z=qd[3][2];zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);
    const c=cw.bic&&rnd()<.42?mix(cw.c2,cw.c,.2):cw.c,lt=h2l(c)[2]>.82,col=mix(c,'#8fae68',grn*.85*sm01((.35-zz)/1.1));
    /* a floret peeps out of the upper scales (the haageana and Fireworks show theirs bright yellow); a glint on the lit paper */
    let e=null,ec=null;if(q>.3&&fr&&zz>(cw.fw?-.2:.15)&&rnd()<(cw.fw?.55:cw.hg?.35:.2)*q){const c0=pt(0,.55,.36);e=chpDot(c0[0],c0[1],Math.max(.35,b*(cw.fw?.2:.14)));ec=flc}
    else if(det&&fr&&I>.78&&rnd()<.6){const c0=pt(-.08,.25,.25);e=chpDot(c0[0],c0[1],Math.max(.3,b*.12));ec=mix(c,'#ffffff',.6)}
    fl.push({q:qd,z,c:col,I:lt?.6+(I-.6)*.8:I,e,ec})}
  parts.push({z:-1e6,fn:par=>E('path',{d:pD(cu.q)+'Z',fill:shd(base,h2l(base)[2]>.82?-.2:-.45),stroke:shd(base,-.45),'stroke-width':h2l(base)[2]>.82?.45:0,'stroke-opacity':.6},par)},...a14Bands(fl,3,zmin,zmax+.01,{sw:.3,so:.5,lv:det?12:6}));
  /* the two leafy bracts at its foot (on the heads that have them: not on the young buds of the side shoots) */
  drawParts(g,parts);return g}
/* the two leaves under a head, in view space: opposite, sessile, spreading out and a little down from the foot of the head */
function g37GomBracts(B,O,Dh,col,parts){const ph=R(0,6.283),og0=V3.add(O,toV(B,[0,0,Dh*.06]));
  for(let j=0;j<2;j++){const th=ph+j*Math.PI+R(-.25,.25),H=V3.nz(toV(B,[Math.cos(th),Math.sin(th),-.32])),U=V3.nz(toV(B,[0,0,1])),Up=V3.nz(V3s(U,V3.sc(H,V3.dot(U,H)))),L=V3.cr(Up,H);
    parts.push(chpLeaf3({H,U:Up,L},og0,Dh*R(.7,.9),.42,col,{wp:LS_OVATE,droop:.12,arch:.05,fold:.2,tw:0,face:0}))}}
function g37GomPlant(g,t,o){const cw=cwPick(CW_G37GO,o),op=Math.max(.05,Math.min(1,o.op??1)),Dh=(o.cm||2.5)*UPC,k=G(g),lc='#4f7038';
  const r=lsHeadS(k,o,{D:Dh,w:Math.max(1.5,Dh*.09),cols:G37_GSC,op,rr:.35,axisFirst:true,nodes:2,opp:true,li:2.2,lp:3.4,aimK:.14,leafAng:50,side:{p:.85,n:2,top:2,len:2.6,ang:30,age:[.15,.9]},budD:.55,budMax:.32,wig:.03,e:.02,
    flower:(par,B,O,D2,op2)=>{const pp=[];g37GomBracts(B,O,D2,lc,pp);pp.push({z:PJ(B,O,[0,0,D2*.3])[2],fn:p2=>g37GomHead(p2,B,O,D2,op2,cw)});drawParts(par,pp)},
    bud:(par,B,O,s,a)=>g37GomHead(par,B,O,s*1.6,.05+.25*a,cw),young:(par,B,O,s,a)=>{const pp=[];g37GomBracts(B,O,s,lc,pp);pp.push({z:PJ(B,O,[0,0,s*.3])[2],fn:p2=>g37GomHead(p2,B,O,s,.3+.7*a,cw)});drawParts(par,pp)},
    leaf:(og,pos)=>chpLeaf3(og,pos,Dh*R(1.4,1.8),.3,'#5a7a44',{wp:LS_LANCE,droop:.18,arch:.06,fold:.2,face:.4})});
  g37Hairs(k,r.np,Math.max(1.5,Dh*.09),'#c8d0b8',{l:1,every:4});open(k,t,1000,6,.3);return r}
/* ---------- hare's tail grass (Lagurus ovatus): slender soft culms, a node or two, short flat downy leaves whose upper sheath is swollen; at the top one ovoid panicle, dense and woolly,
   silky with fine hairs and short bristling awns — cream white, often bleached or dyed. In the boot the panicle is still in the swollen sheath, then a slim green-cream spindle, then the full puff.
   In a bouquet it is a line on its own spine ---------- */
const CW_G37LA=[
 {id:'creme',n:'Crème (naturel séché)',c:'#ece4cc',st:'#cbbf93'},
 {id:'blanc',n:'Blanc (blanchi)',c:'#f7f5ef',st:'#ddd6c0'},
 {id:'vert',n:'Vert tendre (frais)',c:'#dfe4c6',st:'#9cb06e',fresh:1},
 {id:'rose',n:'Teint rose poudré',c:'#e8b0bf',st:'#c89aa4'},
 {id:'fuchsia',n:'Teint fuchsia',c:'#d0508a',st:'#a84470'},
 {id:'lilas',n:'Teint lilas',c:'#bca4d8',st:'#9a86b6'},
 {id:'bleu',n:'Teint bleu',c:'#5574b0',st:'#4a6494'},
 {id:'jaune',n:'Teint jaune',c:'#efd46a',st:'#ccb456'},
 {id:'orange',n:'Teint orange',c:'#ec9a4a',st:'#c8803e'},
 {id:'bordeaux',n:'Teint bordeaux',c:'#7c2038',st:'#64202e'},
 {id:'noir',n:'Teint noir',c:'#2e2b2c',st:'#2a2828'}];
/* the panicle along its screen axis C (points, base first) with half-widths hw: a soft body lit from the upper left, a fuzzy rim, and on the sheets the silky hairs and awns */
const G37_LAGP=prof([[0,.42],[.1,.8],[.36,1],[.62,.9],[.84,.62],[.96,.3],[1,.12]]);
function g37LagSpike(par,C0,hw0,col,st){const m=C0.length-1,K=3,C=[],hw=[];for(let i=0;i<m;i++)for(let k=0;k<K;k++){const t=k/K;C.push([C0[i][0]+(C0[i+1][0]-C0[i][0])*t,C0[i][1]+(C0[i+1][1]-C0[i][1])*t]);hw.push(hw0[i]+(hw0[i+1]-hw0[i])*t)}C.push(C0[m]);hw.push(hw0[m]);
  const n=C.length-1,P=pal7(col),dk=h2l(col)[2]<.35,det=DET>=1.5&&!LOD,ds=[],ph=R(0,6.28);let last=[0,-1];
  for(let i=0;i<=n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);const d=l>1e-6?[dx/l,dy/l]:last;ds.push(d);last=d}
  /* the woolly rim: soft little lobes, the tufts of the spikelets */
  const side=(s,k,j)=>C.map((c,i)=>{const[dx,dy]=ds[i],r=hw[i]*k*(j?1+.07*Math.sin(i*2.3+s*1.7+ph)+.05*Math.sin(i*5.3+ph):1);return[c[0]-dy*r*s,c[1]+dx*r*s]}),tip=C[n],T=ds[n],r1=hw[Math.max(0,n-2)],tp=[tip[0]+T[0]*r1*.35,tip[1]+T[1]*r1*.35];
  const out=side(1,1,1).concat([tp],side(-1,1,1).reverse()),hm=Math.max(...hw);
  const fill=LOD?toneAt(P,.66):rad([[0,toneAt(P,dk?.78:.94)],[.6,toneAt(P,dk?.6:.74)],[1,toneAt(P,dk?.42:.54)]],.36,.34,.72);
  E('path',{d:smooth(out),fill,stroke:shd(col,dk?.3:-.22),'stroke-width':.32,'stroke-opacity':st===2?.3:.5,'stroke-linejoin':'round'},par);
  if(LOD)return;
  /* the flank away from the light in shade */
  E('path',{d:smooth(side(-1,.96,1).reverse().concat(side(-1,.3,0))),fill:P.d1,opacity:dk?.28:.2},par);
  if(st&&hm>1.2){/* the silky hairs, combed toward the tip, standing out of the rim; on the sheets the awns bristle beyond them */
    let d='',da='';const ev=det?1:2;
    for(let i=1;i<n;i+=ev)for(const s of[-1,1]){const[dx,dy]=ds[i],r=hw[i];for(let k=0;k<(det?3:1);k++){const u=R(.72,.95),bx=C[i][0]-dy*r*s*u,by=C[i][1]+dx*r*s*u,h=r*R(.18,.34)+.5,a=R(.1,.45);
        d+=`M${f(bx)},${f(by)}l${f(-dy*s*h*(1-a*.5)+dx*h*a)},${f(dx*s*h*(1-a*.5)+dy*h*a)}`}
      if(det&&st===2&&i>n*.3&&rnd()<.45){const bx=C[i][0]-dy*r*s*.5,by=C[i][1]+dx*r*s*.5,h=r*R(.9,1.3);da+=`M${f(bx)},${f(by)}l${f(-dy*s*h*.55+dx*h*.85)},${f(dx*s*h*.55+dy*h*.85)}`}}
    if(det)for(let k=0;k<3;k++){const a=R(-.5,.5);da+=`M${f(tip[0]-T[0]*r1*.3)},${f(tip[1]-T[1]*r1*.3)}l${f((T[0]+a*T[1])*hm*.75)},${f((T[1]-a*T[0])*hm*.75)}`}
    const hc=mix(col,'#ffffff',dk?.25:.55);
    E('path',{d,stroke:hc,'stroke-width':det?.3:.45,'stroke-opacity':det?.7:.55,fill:'none','stroke-linecap':'round'},par);
    if(da)E('path',{d:da,stroke:mix(col,dk?'#ffffff':'#a89870',dk?.2:.22),'stroke-width':.22,'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},par)}}
function g37LagPlant(g,t,o){const cw=cwPick(CW_G37LA,o),op=Math.max(.05,Math.min(1,o.op??1)),st=op<.3?0:op<.75?1:2,k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||45)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt),L=A.L,
    Rm=GHI['lagurus'].rch,fd=GHI['lagurus'].fx*.92,UP=[0,1,0],as=Math.max(.75,Math.min(1.15,L/(40*UPC))),nc=bq?1:2,nC=8,wc=Math.max(1.15,.17*UPC),dry=!cw.fresh;
  const Ls=R(3.4,4.4)*UPC*as*[.62,.85,1][st],Ws=Ls*R(.5,.56)*[.4,.66,1][st],Lcu=L-Ls*.85;
  const rules={S:()=>{const out=[];for(let c=0;c<nc;c++)out.push(['[',{c:'culm',w:wc*R(.95,1.05)}],['/',{a:c*150+R(-25,25)}],['&',{a:c?R(5,10):R(0,2)}],['C',{i:0,h:c?R(.72,.86):1}],[']',{}]);return out},
    /* the culm: soft, upright, slightly nodding near its top; a node low with a short flat leaf, a node higher whose sheath is swollen */
    C:p=>{if(p.i>=nC)return[['Sp',{h:p.h}]];const out=[['F',{l:Lcu*p.h/nC*R(.9,1.1),w1:wc*(1-.25*(p.i+1)/nC),aim:UP,k:.1,wig:.008,e:p.i>5?.02:0}]];
      if(p.i===1||p.i===3){out.push(['Nd',{}],['[',{}],['/',{a:R(0,360)}],['&',{a:R(22,38)}],['Lv',{i:p.i}],[']',{}])}out.push(['C',{i:p.i+1,h:p.h}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,nC+4),{p:[0,0,0],H:UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:wc});
  if(bq){const seen=new Set();for(const ch of res.chains)for(const q of ch.pts){if(seen.has(q))continue;seen.add(q);lnHug(q,L,Rm)}}
  const vw=new Map(),Wq=q=>{let v=vw.get(q);if(!v){v=bq?lnSink(A,q,A.W(q),L,fd):A.W(q);vw.set(q,v)}return v};
  const cul=lnCols(cw.st,'#fffaf0'),leafC=dry?mix(cw.st,'#d6caa0',.3):'#8aa462';
  for(const ch of res.chains)lnTube(ch.pts.map(Wq),ch.ws,()=>cul,parts,{gloss:.3,piece:24,min:bq?.55:.45,ink:h2l(cw.st)[2]>.66?shd(cw.st,-.5):null});
  for(const og of res.organs){const P=Wq(og.pos),H=A.Wv(og.pos,og.H),U0=A.Wv(og.pos,og.U),U=V3.nz(V3s(U0,V3.sc(H,V3.dot(U0,H))));
    if(og.t==='Lv')parts.push(chpLeaf3({H,U,L:V3.cr(U,H)},P,R(6,9)*UPC*as*(og.p.i>1?.75:1),.1,leafC,{wp:LS_LANCE,droop:.3,arch:.05,fold:.15,tw:R(-.3,.3),face:0}));
    else if(og.t==='Sp'){/* the panicle: its axis on from the top of the culm, nodding a little; in the boot half sheathed */
      const m=10,C3=[],hw=[],sp=og.p.h<1?.85:1;let pq=og.pos.slice(),hd=og.H.slice();
      for(let i=0;i<=m;i++){const t=i/m;C3.push(Wq(bq?lnHug(pq.slice(),L,Rm):pq.slice()));hw.push(Ws/2*sp*G37_LAGP(t)+wc*.5);
        hd=V3.nz(V3.add(hd,[R(-.02,.02),-.012,0]));pq=V3.add(pq,V3.sc(hd,Ls*sp/m))}
      const S2=C3.map(p=>[p[0],-p[1]]);let z=0;for(const p of C3)z+=p[2];
      const col=st===0?mix(cw.c,'#9cb06e',.55):st===1?mix(cw.c,dry?'#c8c49a':'#a8bc7e',.35):cw.c;
      parts.push({z:z/C3.length+.5,fn:par=>g37LagSpike(par,S2,hw,col,st)});
      if(st===0){/* the swollen sheath round the panicle in the boot */const b=S2[0],e=S2[Math.round(m*.62)],dx=e[0]-b[0],dy=e[1]-b[1],ll=Math.hypot(dx,dy)||1,ww=Ws*.75,nx=-dy/ll*ww,ny=dx/ll*ww,sc=dry?mix(cw.st,'#a8a070',.3):'#8aa860';
        parts.push({z:z/C3.length+.8,fn:par=>E('path',{d:`M${f(b[0])},${f(b[1])}C${f(b[0]+dx*.3+nx)},${f(b[1]+dy*.3+ny)} ${f(b[0]+dx*.85+nx*.6)},${f(b[1]+dy*.85+ny*.6)} ${f(e[0])},${f(e[1])}C${f(b[0]+dx*.85-nx*.6)},${f(b[1]+dy*.85-ny*.6)} ${f(b[0]+dx*.3-nx)},${f(b[1]+dy*.3-ny)} ${f(b[0])},${f(b[1])}Z`,fill:toneAt(pal7(sc),.62),stroke:shd(sc,-.5),'stroke-width':.3,'stroke-opacity':.5},par)})}}
    else if(og.t==='Nd'&&DET>=1.5&&!LOD){const S0=[P[0],-P[1]],h2=[H[0],-H[1]],hl=Math.hypot(h2[0],h2[1])||1,w=og.w*.6;parts.push({z:P[2]+.05,fn:par=>E('path',{d:`M${f(S0[0]-h2[1]/hl*w)},${f(S0[1]+h2[0]/hl*w)}L${f(S0[0]+h2[1]/hl*w)},${f(S0[1]-h2[0]/hl*w)}`,stroke:shd(cw.st,-.4),'stroke-width':.7,'stroke-linecap':'round'},par)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:2.2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}
/* ---------- registers: four heads grown on their stems (sold in bud: masterwort, blue lace, stonecrop), the hare's tail a line on its own spine ---------- */
Object.assign(GH,{'astrantia':g37AstrPlant,'didiscus':g37DidiPlant,'sedum':g37SedPlant,'gomphrena':g37GomPlant,'lagurus':g37LagPlant});
Object.assign(CWS,{'astrantia':CW_G37AS,'didiscus':CW_G37DI,'sedum':CW_G37SE,'gomphrena':CW_G37GO,'lagurus':CW_G37LA});
Object.assign(SZG,{'astrantia':[2.5,3,3.5,3.5,4,4.5],'didiscus':[4,5,5.5,5.5,6,7],'sedum':[8,10,11,11,12,14],'gomphrena':[1.5,2,2.5,2.5,3],'lagurus':[30,35,40,45,45,50]});
Object.assign(GHI,{'astrantia':{form:'etoile',size:1.4,k:'head',rk:1},'didiscus':{form:'disque',size:1.8,k:'head',rk:1},'sedum':{form:'disque',size:2.2,k:'head',rk:1},'gomphrena':{form:'sphere',size:1.2,k:'head',rk:.9},
 'lagurus':{form:'ligne',size:1,k:'plant',self:45*UPC,tip:.92,fx:3*UPC,rch:5*UPC}});
for(const id of['astrantia','didiscus','sedum'])GH_BUDS.add(id);
