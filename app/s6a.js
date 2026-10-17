/* ================= Serre, lot 6 — Roses : standard (hybride de thé), intermédiaire, de jardin, d'aspect jardin, anglaise ================= */
/* a rose petal: a band curved round the flower's axis — from its base on the receptacle (angle phi, radius r0, height z0) it rises and opens (radius r1 at height h),
   it covers an arc of half-angle w (narrow at the claw, broad at the top), its top margin rolls back (refl) into the rose's points; one projected outline */
function rosePetal(B,O,o){const nv=8,nu=6,pt=(u,v)=>{const wv=o.w*o.wp(Math.min(1,v)),th=o.phi+u*wv,bowl=1-Math.pow(Math.max(0,1-v),o.k||2.2),rf=Math.pow(Math.max(0,v-.62)/.38,2),
      rad=o.r0+(o.r1-o.r0)*bowl+(o.refl||0)*o.r1*.38*rf*(.55+.45*u*u)+(o.ruf||0)*o.r1*Math.sin(u*6+v*9+o.phi*3)*v*v,
      z=o.z0+o.h*v-(o.refl||0)*o.h*.16*rf*(.4+.6*u*u);return[Math.cos(th)*rad,Math.sin(th)*rad,z]};
  const v0=o.v0||0,V=i=>v0+(1-v0)*i/nv,out=[];for(let i=0;i<=nv;i++)out.push(pt(-1,V(i)));for(let j=1;j<nu;j++){const u=-1+2*j/nu;out.push(pt(u,1+(o.tipd||0)*.03*Math.sin(j*2.1)))}for(let i=nv;i>=0;i--)out.push(pt(1,V(i)));for(let j=nu-1;j>0;j--)out.push(pt(-1+2*j/nu,v0));
  const P=out.map(p=>PJ(B,O,p));let z=0;for(const p of P)z+=p[2];z/=P.length;
  const c=pt(0,.6),du=V3s(pt(.1,.6),pt(-.1,.6)),dv=V3s(pt(0,.7),pt(0,.5)),nL=V3.nz(V3.cr(du,dv)),nv2=V3.nz(toV(B,nL)),toAxis=V3.dot(nL,V3.nz([-c[0],-c[1],0]))>0;
  const rim=[];for(let j=0;j<=nu;j++)rim.push(PJ(B,O,pt(-1+2*j/nu,.995)));return{P,z,n:nv2,inner:toAxis,rim,b0:PJ(B,O,pt(0,.05)),b1:PJ(B,O,pt(0,.97))}}
/* the colourways: c petals, c2 the heart (gradient inward), edge (picotee), out (outer face), green (outer petals washed with green), eye ('green' or 'gold' heart seen when open) */
const CW_RSTD=[
 {id:'blanc',n:'Blanc pur',c:'#fbfaf5',c2:'#f4f0dc'},{id:'creme',n:'Blanc crème',c:'#f7f1e2',c2:'#f0e2c0'},{id:'champagne',n:'Ivoire champagne',c:'#f4e8d4',c2:'#ecd6b8',edge:'#f0d2cc'},
 {id:'coeur-peche',n:'Blanc à cœur pêche',c:'#f7f0e6',c2:'#f4c8a2'},{id:'mondial',n:'Blanc aux pétales verdâtres',c:'#f6f2e2',green:'#cfdcaa'},{id:'blush',n:'Rose blush',c:'#f6dcdc',c2:'#f0c4c8'},
 {id:'poudre',n:'Rose poudré',c:'#f0b8c4',c2:'#e898ac'},{id:'rose',n:'Rose moyen',c:'#e88aa6'},{id:'vieux-rose',n:'Vieux rose',c:'#c8848e',c2:'#b06a76'},{id:'rose-vif',n:'Rose vif',c:'#e2457a'},
 {id:'fuchsia',n:'Fuchsia',c:'#c8206e'},{id:'cerise',n:'Cerise',c:'#c8183a'},{id:'peche',n:'Pêche',c:'#f6c49e',c2:'#f0a87a'},{id:'abricot',n:'Abricot',c:'#f2a464'},{id:'saumon',n:'Saumon',c:'#f2967e'},
 {id:'corail',n:'Corail',c:'#ef6e5a'},{id:'orange',n:'Orange',c:'#ee7a2a'},{id:'jaune',n:'Jaune',c:'#f4d03c'},{id:'jaune-pale',n:'Jaune pâle',c:'#f6e6a0'},{id:'rouge',n:'Rouge',c:'#b0122a'},
 {id:'rouge-velours',n:'Rouge velours noir',c:'#5a0614',c2:'#3a020c'},{id:'bordeaux',n:'Bordeaux',c:'#7a1028'},{id:'lavande',n:'Lavande',c:'#b8a0c8',c2:'#a088b8'},{id:'mauve',n:'Mauve',c:'#a87a9a'},
 {id:'vert',n:'Vert',c:'#cdd8a0',c2:'#b8c888'},{id:'caramel',n:'Brun caramel',c:'#c8946a',c2:'#b07a50'},{id:'terracotta',n:'Terracotta',c:'#c86a4a'},
 {id:'jaune-rouge',n:'Jaune bordé de rouge',c:'#f4d03c',edge:'#d0283a'},{id:'blanc-rose',n:'Blanc bordé de rose',c:'#fbf4f2',edge:'#e8508a'},{id:'blanc-flamme',n:'Blanc flammé de rose vif',c:'#fbf2f4',flame:'#e0407a'}];
const CW_RINT=[
 {id:'blanc',n:'Blanc ivoire',c:'#f8f4ea'},{id:'creme',n:'Crème',c:'#f4e8cc'},{id:'rose',n:'Rose',c:'#ec96b0'},{id:'rose-vif',n:'Rose vif',c:'#e8558a'},{id:'cerise',n:'Cerise',c:'#c81e4a'},
 {id:'orange',n:'Orange',c:'#f07c2a'},{id:'jaune',n:'Jaune',c:'#f6d23a'},{id:'rouge',n:'Rouge',c:'#c41e2e'},{id:'rouge-velours',n:'Rouge profond velouté',c:'#7d0a1c'},{id:'violet',n:'Violet',c:'#8a4a8a'},
 {id:'lavande',n:'Lavande',c:'#b8a0c8'},{id:'brun',n:'Brun',c:'#9a6a50'},{id:'jumilia',n:'Blanc bordé de rose vif',c:'#fbf4f4',edge:'#e0407a'},{id:'bicolore-jaune',n:'Jaune bicolore',c:'#f6d23a',c2:'#f08a3a',k2:.8},
 {id:'rose-creme',n:'Rose et crème',c:'#f4e6d6',edge:'#e87aa0'}];
const CW_RJAR=[
 {id:'blanc-creme',n:'Blanc crème à cœur ivoire',c:'#f6ecd9',c2:'#f2dcc0'},{id:'ivoire',n:'Ivoire',c:'#f4ecd8'},{id:'beurre',lvl:'C',n:'Beurre',c:'#f4e2a8',c2:'#efd080'},{id:'blush',n:'Rose blush',c:'#f6d6d4'},
 {id:'rose-pale',lvl:'C',n:'Rose pâle',c:'#f2b9c4',c2:'#ec9aac'},{id:'dragee',lvl:'C',n:'Rose dragée',c:'#f4a8c0'},{id:'rose',n:'Rose moyen',c:'#e07f9c',c2:'#c85a80'},{id:'vieux-rose',lvl:'C',n:'Vieux rose saumoné',c:'#d0909a',c2:'#e09878'},
 {id:'magenta',n:'Magenta',c:'#c64d8a',ruf:1},{id:'fuchsia',n:'Fuchsia',c:'#c2306e'},{id:'peche',n:'Pêche',c:'#f4b98e',c2:'#f0a070'},{id:'abricot',n:'Abricot',c:'#f2a060'},
 {id:'corail',lvl:'C',n:'Corail',c:'#ef7a62'},{id:'orange',lvl:'C',n:'Orange',c:'#ee8a3a'},{id:'citron',lvl:'C',n:'Jaune citron dans une coupe verte',c:'#f2e48a',green:'#c8dca0'},{id:'moutarde',lvl:'C',n:'Jaune moutarde',c:'#d8b050',c2:'#c89830'},
 {id:'caramel',n:'Caramel',c:'#c9965f',c2:'#a87040'},{id:'sable',lvl:'C',n:'Brun sable bordé de vert',c:'#cfae8a',green:'#b8c890'},{id:'rouge',lvl:'C',n:'Rouge écarlate',c:'#c01a26',c2:'#8a0a18'},
 {id:'cramoisi',lvl:'C',n:'Rouge cramoisi',c:'#9a0a26'},{id:'rouille',lvl:'D',n:'Rouge rouille',c:'#a8402a'},{id:'lavande',lvl:'D',n:'Lavande',c:'#b8a4cc'},{id:'moka',n:'Mauve moka',c:'#b89a96',c2:'#a07a78'},
 {id:'creme-rose',n:'Crème bordé de rose',c:'#f6ecdc',edge:'#e888a4'},{id:'blanc-vert',lvl:'C',n:'Blanc bordé de vert',c:'#f6f2e6',green:'#c0d498'},
 /* late:10 (finishing 2026-10-17, colours in ROSA_JAR_CWX; lvl C = drawn, not for the shop) */
 {id:'blanc-lisere-rose',n:'Blanc liseré de rose vif',c:'#efe0e6',late:10,lvl:'C'},{id:'brique-nuance',n:'Rouge brique nuancé de cuivre',c:'#bf6a5c',late:10,lvl:'C'}
];
const CW_RASP=[
 {id:'blanc',n:'Blanc nacré',c:'#f7f3ec'},{id:'creme',n:'Crème',c:'#f4e8d0'},{id:'champagne',n:'Champagne sable',c:'#eadcc4',c2:'#d8c0a0'},{id:'rose-pale',n:'Rose pâle',c:'#f4ccd2'},
 {id:'rose',n:'Rose moyen',c:'#e07f9c'},{id:'bonbon',n:'Rose bonbon',c:'#f08ab0'},{id:'rose-vif',n:'Rose vif',c:'#e04a80'},{id:'peche',n:'Pêche',c:'#f4c2a1',c2:'#f0a880'},
 {id:'mandarin',n:'Orange à cœur vert',c:'#f4b08a',c2:'#e8608a',eye:'green'},{id:'abricot',n:'Abricot',c:'#f3a66d'},{id:'corail',n:'Corail',c:'#f08a6a'},{id:'orange',n:'Orange',c:'#ee7a32'},
 {id:'sunset',n:'Orange à cœur jaune',c:'#ee6a3a',c2:'#f4b030',k2:.9},{id:'moutarde',n:'Jaune doré',c:'#dab858'},{id:'jaune',n:'Jaune',c:'#f4d24a'},{id:'cramoisi',n:'Rouge cramoisi',c:'#a8102e'},
 {id:'lavande',n:'Lavande',c:'#a77ab0',c2:'#c0a0c8'},{id:'lilas',n:'Gris lilas',c:'#c4b0d6'},{id:'vert',n:'Vert tendre',c:'#d4e0b4',green:'#b8cc90'},{id:'terre',n:'Caramel café',c:'#ecd6b8',c2:'#c89a7a'},
 {id:'free-spirit',n:'Cuivre multicolore',c:'#f08a4a',c2:'#d8406a',k2:.6,green:'#c8b070'},{id:'rose-vert',n:'Rose bordé de vert',c:'#f0b8c4',green:'#c0d098'},
 /* late:10 (finishing 2026-10-17, colours in ROSA_ASP_CWX; lvl C = drawn, not for the shop) */
 {id:'magenta',n:'Magenta intense',c:'#d23f84',late:10},{id:'jaune-bord-rouge',n:'Jaune bordé de rouge',c:'#ebae4e',late:10},
 {id:'mauve-taupe',n:'Mauve gris taupe',c:'#ccb0a7',late:10,lvl:'C'},{id:'blanc-coeur-vert',n:'Blanc à cœur vert',c:'#efeee0',late:10,lvl:'C'},
 {id:'chocolat',n:'Brun chocolat',c:'#a34543',late:10,lvl:'C'},{id:'rose-bord-blanc',n:'Rose à bordure blanche',c:'#e0587f',late:10,lvl:'C'}
];
const CW_RANG=[
 {id:'juliet',n:'Pêche à cœur abricot (Juliet)',c:'#f6c8a8',c2:'#f0a060',k2:.9},{id:'patience',n:'Blanc laiteux à cœur beurre',c:'#f8f2e6',c2:'#f4e0b0'},{id:'keira',n:'Crème marbré de framboise',c:'#f6e8e0',marble:'#d84a78'},
 {id:'miranda',n:'Rose dragée à cœur cerise',c:'#f2b0c4',c2:'#e05a80'},{id:'constance',n:'Rose ballerine à cœur crème',c:'#f2c0cc',c2:'#f6ead8'},{id:'charity',n:'Rose pêche à étamines vertes',c:'#f2b8a8',eye:'green'},
 {id:'capability',n:'Fuchsia',c:'#d0306e'},{id:'darcey',n:'Rouge framboise',c:'#b8203e'},{id:'edith',n:'Abricot au halo rose',c:'#f4c0b8',c2:'#f0a050',k2:.9},
 {id:'effie',n:'Crème à cœur jaune et orange',c:'#f6eedc',c2:'#f4b040',k2:.9},{id:'beatrice',n:'Jaune beurre doré',c:'#f2d88a',c2:'#ecc050'},{id:'leonora',n:'Ivoire crème à étamines dorées',c:'#f6eedc',eye:'gold'},
 {id:'tess',n:'Rouge cramoisi-cassis',c:'#8a0a2a',eye:'gold'},{id:'purity',n:'Blanc nacré',c:'#fbf6f2',c2:'#f6e4dc'},{id:'enid',n:'Crème et vert pistache',c:'#f2ecd6',green:'#c8d8a0',eye:'green'},
 {id:'millicent',n:'Rose moyen nuancé de lilas',c:'#e098b4',c2:'#b890c0'},{id:'ottilie',n:'Rose barbe à papa',c:'#f2a8c8'},{id:'ariadne',n:'Rose saumon et abricot',c:'#f0a090',c2:'#f0b070'},
 {id:'phoebe',n:'Rose flamant à cœur corail',c:'#f29aa6',c2:'#ef6e5a',k2:.9}];
/* the forms: n petals, how tall and tight the heart is, how wide the outer petals open, reflex of their margins, ruffle; hybrid teas are high-centred, garden roses cupped rosettes */
const ROSE_K={std:{n:40,hc:1.1,rc:.14,ro:.95,ao:.95,refl:1,ruf:0,cup:'high'},int:{n:32,hc:1.05,rc:.14,ro:.9,ao:.9,refl:.9,ruf:0,cup:'high'},
 jar:{n:64,hc:.62,rc:.2,ro:1,ao:.85,refl:.7,ruf:.05,cup:'deep'},asp:{n:56,hc:.82,rc:.18,ro:.96,ao:.88,refl:.6,ruf:.07,cup:'deep'},ang:{n:70,hc:.7,rc:.22,ro:.97,ao:.8,refl:.5,ruf:.05,cup:'deep'}};
const ROSE_WP=prof([[0,.32],[.2,.62],[.5,.9],[.78,1],[.92,.88],[1,.55]]);
function roseFlower(par,B,O,D,cw,op,kd){const K=ROSE_K[kd],k=G(par),Rr=D/2,o2=sm01((op-.12)/.88),n=Math.round(K.n*(LOD?.6:1)),sd=R(0,6),items=[];
  /* sepals and the receptacle, then the petals spiralling from the outside in */
  const sp=['#2a4a1e','#3f6a2a','#5f8a3e'];for(let i=0;i<5;i++){const l=ligule(B,O,{phi:i*1.2566+sd,r0:Rr*.08,z0:-Rr*.22,L:Rr*(op<.4?.75:.5),W:Rr*.09,wp:prof([[0,.6],[.3,1],[.7,.5],[1,.05]]),a0:op<.4?.4:2.2,a1:op<.4?.15:2.7,tip:'point',th:.3,tw:i<2?.4:0});
    items.push({P:l.out,z:l.z-Rr*2,sep:i})}
  for(let i=0;i<n;i++){const f=Math.pow((i+.5)/n,.85),inner=1-f,phi=i*2.39996+sd;
    /* the heart: tight, tall, wrapped (high-centred) or short and quartered (rosette); outer petals open wide and roll their margins back */
    const bud=op<.4,r1x=0,r0=Rr*(.04+.12*f),r1=Rr*(bud?.1+.22*f:(K.rc+(K.ro-K.rc)*Math.pow(f,1.15))*(.55+.45*o2)),
      h=Rr*(bud?.9+.25*inner:(K.cup==='rosette'?.42+.3*f:K.hc*(.35+.55*inner)+.32*f)),z0=Rr*(-.18+.06*inner+(K.cup==='rosette'?.12*inner:0)),
      w=bud?1.5:(K.cup==='rosette'?1.85-.8*f:1.7-.68*f),refl=bud?0:K.refl*sm01((f-.5)/.45)*o2;
    /* the heart's petals stand almost upright (only their rims show from above); the base of every petal hides at the bottom of the cup */
    const r0b=f<.6&&!bud?Math.max(r0,r1*(K.cup==='high'?.6:.72)*(1-f*.8)):r0;
    const p=rosePetal(B,O,{phi,r0:r0b,r1,z0,h,w,wp:ROSE_WP,k:K.cup==='high'?1.6+1.2*f:2.6,refl,ruf:(K.ruf+(cw.ruf?.08:0))*f,tipd:K.ruf*10,v0:bud?0:f<.55?.42:f<.8?.25:.08});
    let c=cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.6)*Math.pow(inner,1.3));if(cw.green)c=mix(c,cw.green,sm01((f-.72)/.28)*.8);if(cw.marble&&Math.sin(i*5.3+sd)>.25)c=mix(c,cw.marble,.45+.3*inner);
    items.push({p,c,f,inner})}
  items.sort((a,b)=>(a.p?a.p.z:a.z)-(b.p?b.p.z:b.z));const ov=floretShade(),cache={};
  /* a dark heart under the petals, so the folds read as depth */
  for(const it of items)if(it.sep!=null)E('path',{d:smooth(it.P),fill:it.sep%2?sp[1]:sp[2],stroke:sp[0],'stroke-width':.45,'stroke-opacity':.7},k);
  {const hp=[];for(const it of items)if(it.p)for(const q of it.p.P)hp.push([q[0],q[1]]);if(hp.length>6){let h=hull2(hp),cx=0,cy=0;for(const q of h){cx+=q[0];cy+=q[1]}cx/=h.length;cy/=h.length;h=h.map(q=>[cx+(q[0]-cx)*.7,cy+(q[1]-cy)*.7]);E('path',{d:smooth(h),fill:shd(cw.c2||cw.c,-.5)},k)}}
  /* the tight heart: the innermost petals still furled into a small bud */
  if(op>=.4){const hc=pal7(cw.c2?mix(cw.c,cw.c2,cw.k2||.6):cw.c),pts=[];for(let i=0;i<14;i++){const a=i/14*6.283,r=Rr*(K.cup==='high'?.1:.13)*(1+.12*Math.sin(i*2.7)),z=Rr*(K.cup==='high'?.62:.42)*K.hc;pts.push(PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z]))}
    const zz=PJ(B,O,[0,0,Rr*.3]);items.push({heart:pts,z:zz[2],c:hc})}
  items.sort((a,b)=>(a.p?a.p.z:a.z)-(b.p?b.p.z:b.z));
  for(const it of items){if(it.sep!=null)continue;if(it.heart){const d=smooth(it.heart.map(q=>[q[0],q[1]]));E('path',{d,fill:toneAt(it.c,.5),stroke:it.c.d1,'stroke-width':.5},k);
      const sw=it.heart.slice(2,9).map(q=>[q[0]*.6+it.heart[0][0]*0+q[0]*.0,q[1]]);E('path',{d:smooth(it.heart.slice(1,8).map((q,j)=>{const c=it.heart.reduce((a,b)=>[a[0]+b[0]/14,a[1]+b[1]/14],[0,0]);return[c[0]+(q[0]-c[0])*.55,c[1]+(q[1]-c[1])*.55]}),false),stroke:it.c.l1,'stroke-width':.8,'stroke-opacity':.7,fill:'none'},k);continue}
    const p=it.p,face=p.n[2]>=0,inside=p.inner===face,cc=inside?it.c:mix(it.c,cw.out||shd(it.c,.12),.5),ao=.72+.28*it.f,I=lightI(face?p.n:V3.sc(p.n,-1))*ao,key=cc+Math.round(I*16);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1,P.l2]}
    /* each petal shaded from the shadow at the bottom of the cup to its lit rim */
    const d=smooth(p.P.map(q=>[q[0],q[1]])),Pc=pal7(cc),fillP=LOD?tone[0]:ugrad(p.b0[0],p.b0[1],p.b1[0]+.01,p.b1[1],inside?[[0,toneAt(Pc,I*.42)],[.45,toneAt(Pc,I*.85)],[1,toneAt(Pc,Math.min(1,I*1.12))]]:[[0,toneAt(Pc,I*.8)],[.6,tone[0]],[1,toneAt(Pc,Math.min(1,I*1.08))]]);
    E('path',{d,fill:fillP,stroke:tone[1],'stroke-width':.5,'stroke-opacity':.5},k);
    if(cw.flame&&!LOD&&it.f>.5){const q=p.rim;E('path',{d:smooth(q.map(x=>[x[0],x[1]]),false),stroke:cw.flame,'stroke-width':f(Math.max(.8,Rr*.032)),'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},k)}
    if(!LOD&&it.f>.35){const q=p.rim.map(x=>[x[0],x[1]]),ed=cw.edge&&it.f>.5;E('path',{d:smooth(q,false),stroke:ed?cw.edge:tone[3],'stroke-width':f(ed?Math.max(.6,Rr*.02):.8),'stroke-opacity':ed?.85:.6,fill:'none','stroke-linecap':'round'},k)}}
  /* the heart of an open English or garden rose: green eye or golden stamens */
  if(cw.eye&&op>.8){const c0=PJ(B,O,[0,0,Rr*.1]);if(toV(B,[0,0,1])[2]>.2){if(cw.eye==='gold'){let dd='';for(let i=0;i<26;i++){const a=i*2.4,r=Rr*.12*Math.sqrt(i/26),q=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,Rr*.14]);dd+=`M${f(q[0]-.9)},${f(q[1])}a.9,.9 0 1,0 1.8,0a.9,.9 0 1,0 -1.8,0`}E('path',{d:dd,fill:'#e8b830',stroke:'#a87a20','stroke-width':.3},k)}
    else E('ellipse',{cx:f(c0[0]),cy:f(c0[1]),rx:f(Rr*.1),ry:f(Rr*.08),fill:'#a8c070',stroke:'#6a8a40','stroke-width':.5},k)}}
  return k}
/* one rose stem's head: the flower on its receptacle, the neck below (a garden rose bows a little), side buds for the spray types */
function roseHead(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,k=G(g),B=frameOf(o,1),Rr=D/2;
  /* the hip (receptacle) behind the flower, then the neck bending into its stem (a garden rose's neck is a little longer and softer) */
  const F={B,O:[0,0,0],parts:[]},sc=['#2e4a20','#4a7032','#6e9a48'],soft=kd==='jar'||kd==='ang';
  F.parts.push(tube3(F,[[0,0,-Rr*.08],[0,0,-Rr*.2],[0,0,-Rr*.32]],q=>Rr*(.16-.08*q),{cols:['#5f8a3e','#4a7032'],cap:1,hl:.35,dk:.45,spec:.2,ink:sc[0],eo:.3,cast:0}));
  const nkp=neckPart(B,[0,0,0],[0,0,-Rr*.3],[0,0,-1],D*(soft?.7:.6),D*.052,{cols:[sc[0],sc[1],sc[2]]});F.parts.push(nkp.part);drawParts(k,F.parts);
  roseFlower(k,B,[0,0,0],D,cw,op,kd);open(k,t,1000,8,.3);return neckOut(nkp)}
const xRoseStd=(g,t,o)=>roseHead(g,t,o,'std',CW_RSTD),xRoseInt=(g,t,o)=>roseHead(g,t,o,'int',CW_RINT),xRoseJar=(g,t,o)=>roseHead(g,t,o,'jar',CW_RJAR),xRoseAsp=(g,t,o)=>roseHead(g,t,o,'asp',CW_RASP),xRoseAng=(g,t,o)=>roseHead(g,t,o,'ang',CW_RANG);
Object.assign(FN,{xRose:xRoseJar});
Object.assign(GH,{'rose-standard':xRoseStd,'rose-intermediaire-kenya':xRoseInt,'rose-de-jardin':xRoseJar,'rose-aspect-jardin':xRoseAsp,'rose-anglaise-david-austin':xRoseAng});
Object.assign(CWS,{'rose-standard':CW_RSTD,'rose-intermediaire-kenya':CW_RINT,'rose-de-jardin':CW_RJAR,'rose-aspect-jardin':CW_RASP,'rose-anglaise-david-austin':CW_RANG});
Object.assign(SZG,{'rose-standard':[5,6,6,7,7,8],'rose-intermediaire-kenya':[4.5,5,5,5.5],'rose-de-jardin':[8,9,10,10,11,12],'rose-aspect-jardin':[6,7,7,8],'rose-anglaise-david-austin':[8,9,10,11,12]});
/* roses carry compound leaves of five toothed, glossy leaflets */
for(const id of['rose-standard','rose-intermediaire-kenya','rose-de-jardin','rose-aspect-jardin','rose-anglaise-david-austin'])STEML[id]={shape:'pinnate',n:[1,2],len:9,w:.55,col:id==='rose-standard'||id==='rose-intermediaire-kenya'?'#2f5a26':'#3f6a2c',up:42,lf:5,gloss:.45};
