/* ================= Serre, lot 1 — Phalaenopsis : sépales, pétales arrondis à onglet, labelle trilobé à antennes et cal piqueté, colonne et anthère, hampe arquée ================= */
/* a width profile through control points (v, half-width 0..1), smooth */
function prof(P){return v=>{v=Math.max(0,Math.min(1,v));let i=1;while(i<P.length-1&&P[i][0]<v)i++;const a=P[i-1],b=P[i],t=(v-a[0])/(b[0]-a[0]||1),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*s}}
/* a petal-like sheet for sheet3: base on a ring (r0, z0, at angle phi in the face plane), spine opening from a0 to a1 (degrees off the axis; 90 = flat in the face),
   half-width W*wp(v), cupped (cup<0 hollow toward the face), edge ruffle, twist; u runs left to right seen from the front */
function petS(o){const ph=o.phi*D,R0=[Math.cos(ph),Math.sin(ph),0],A0=[Math.sin(ph),-Math.cos(ph),0],n=24,Lp=o.L,sp=[],dv=[];let p=[R0[0]*(o.r0||0),R0[1]*(o.r0||0),o.z0||0];
  for(let i=0;i<=n;i++){const t=i/n,a=(o.a0+(o.a1-o.a0)*Math.pow(t,o.pw||1.3))*D,d=[R0[0]*Math.sin(a),R0[1]*Math.sin(a),Math.cos(a)];dv.push(d);if(i){p=V3.add(p,V3.sc(d,Lp/n))}sp.push(p)}
  const ruf=o.ruf||0,rk=o.rk||5,rph=R(0,6),tw=(o.tw||0)*D,wp=o.wp||(v=>Math.sin(Math.PI*Math.min(.98,.04+.96*v))**.7);
  return(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),fr=x-i,P=V3.add(sp[i],V3.sc(V3s(sp[i+1],sp[i]),fr)),d=V3.nz(V3.add(dv[i],V3.sc(V3s(dv[i+1],dv[i]),fr)));
    let A=A0,N=V3.nz(V3.cr(d,A0));N=V3.sc(N,-1);if(N[2]<0&&o.a1<120)N=V3.sc(N,-1);
    if(tw){const c=Math.cos(tw*v),s=Math.sin(tw*v);A=V3.add(V3.sc(A0,c),V3.sc(N,s));N=V3.nz(V3.cr(A,d));if(V3.dot(N,[0,0,1])<0&&o.a1<120)N=V3.sc(N,-1)}
    const w=o.W*wp(v),cu=(o.cup||0)*w*(1-u*u)+(ruf?ruf*w*Math.pow(Math.abs(u),3)*Math.sin(v*rk*Math.PI+rph+u*2):0)+(o.bow||0)*o.L*Math.sin(Math.PI*v);
    return V3.add(V3.add(P,V3.sc(A,u*w)),V3.sc(N,cu))}}
/* the colourways sold: tepals, veins, spots, harlequin blotches, picotee edge, eye flush; lip, its side lobes, callus */
const CW_PHAL=[
 {id:'blanc',n:'Blanc',c:'#fbfaf6',lip:'#f9f3ec',lip2:'#f3c84c',cal:'#f2c44a',dots:'#cf452c'},
 {id:'blanc-rouge',n:'Blanc à labelle rouge',c:'#fbfaf6',lip:'#b3133e',lip2:'#d8325c',cal:'#f0b030',dots:'#8a0a2a'},
 {id:'blanc-jaune',n:'Blanc à labelle jaune',c:'#fbfaf6',lip:'#f2c434',lip2:'#f6da64',cal:'#ee9a20',dots:'#c8401e'},
 {id:'rose-pale',n:'Rose pâle',c:'#f6d2de',vein:'#e6a0b8',lip:'#d8507e',lip2:'#e8789a',cal:'#f2c84a',dots:'#b8203e'},
 {id:'rose',n:'Rose',c:'#ee98b8',vein:'#d65f8a',lip:'#c22a62',lip2:'#d84a78',cal:'#f2c240',dots:'#9a1040'},
 {id:'fuchsia',n:'Fuchsia',c:'#d6408c',vein:'#a81c62',lip:'#8c0c48',lip2:'#b02060',cal:'#f0b030',dots:'#6a0430'},
 {id:'lilas',n:'Lilas',c:'#caa2d8',vein:'#a272ba',lip:'#8a3a90',lip2:'#a85aa8',cal:'#f2c84a',dots:'#6a1a6a'},
 {id:'pourpre',n:'Pourpre',c:'#8e2b7c',vein:'#6a1458',lip:'#5a0a40',lip2:'#7a1a5a',cal:'#f0b030',dots:'#3a0428'},
 {id:'jaune',n:'Jaune',c:'#f2dc6a',lip:'#c8402a',lip2:'#e8902a',cal:'#e88a20',dots:'#a82a1a',spots:'#c05a2a'},
 {id:'citron',n:'Jaune citron',c:'#f1e98c',lip:'#f0c030',lip2:'#f2d060',cal:'#e09020',dots:'#c04a1e'},
 {id:'cuivre',n:'Orange cuivré',c:'#f0a262',vein:'#d06a3a',lip:'#b8302a',lip2:'#d04a30',cal:'#f0b030',dots:'#801a10'},
 {id:'vin',n:'Rouge vin',c:'#8b1531',vein:'#5e0a1f',lip:'#5a0618',lip2:'#7a1028',cal:'#f0b030',dots:'#3a0210'},
 {id:'vert',n:'Vert tendre',c:'#d6e5a2',vein:'#a9c072',lip:'#e8d070',lip2:'#d8b048',cal:'#e0a020',dots:'#b0402a'},
 {id:'strie',n:'Strié pourpre',c:'#f8eef4',vein:'#a33272',vd:1,lip:'#a01a5a',lip2:'#c03a78',cal:'#f2c240',dots:'#6a0a3a'},
 {id:'arlequin',n:'Arlequin',c:'#f8f2ea',blot:'#4a0a2a',lip:'#3a0820',lip2:'#5a1030',cal:'#f0b030',dots:'#2a0418'},
 {id:'borde',n:'Blanc bordé de rose',c:'#fbf6f6',edge:'#e070a0',lip:'#c83070',lip2:'#e05a8a',cal:'#f2c240',dots:'#8a1040'},
 {id:'coeur-orange',n:'Rose à cœur orangé',c:'#f2a2b8',eye:'#f08c46',lip:'#d04a5a',lip2:'#e87050',cal:'#f0b030',dots:'#8a1a20'},
 {id:'mouchete',n:'Moucheté',c:'#f5edf1',spots:'#a02a6a',lip:'#a02a6a',lip2:'#c04a88',cal:'#f2c240',dots:'#6a0a3a'}];
const PH_PET=prof([[0,.14],[.12,.2],[.3,.62],[.5,.94],[.66,1],[.8,.9],[.92,.62],[1,.08]]),PH_SEP=prof([[0,.3],[.15,.62],[.45,1],[.7,.94],[.88,.66],[1,.08]]),
  PH_MID=prof([[0,.35],[.2,.62],[.45,1],[.65,.8],[.85,.42],[1,.12]]),PH_SIDE=prof([[0,.5],[.3,1],[.7,.9],[1,.3]]);
/* one moth orchid in its own frame (B, O view-space offset); D = flower diameter in units */
function phalFlower(par,B,O,D,cw,op,t){if(SV_ON&&typeof phalSvPut==='function')return phalSvPut(par,B,O,D,cw,op);const F={k:G(par),B,O,parts:[],so:.18,sd:null,neck:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e8e4d0',.18)),Pl=pal7(cw.lip),Pl2=pal7(cw.lip2||cw.lip),
    o2=sm01((op-.25)/.75),A=a=>90-(90-a)*(.35+.65*o2),r=D/2;
  /* patterns painted on a tepal: veins, stripes, spots, blotches, picotee, eye */
  const deco=(S,seed)=>(g,front,X)=>{if(!front||LOD)return;const rs=seed*7919;
    if(cw.eye)E('path',{d:X.d,fill:ugrad(...PJ3(F,S(0,0)).slice(0,2),...PJ3(F,S(0,.62)).slice(0,2),[[0,cw.eye,.95],[.55,cw.eye,.45],[1,cw.eye,0]])},g);
    if(cw.vein){const n=cw.vd?15:9,L2=[];for(let k=0;k<n;k++){const u=-.86+1.72*k/(n-1),q=[];for(let i=0;i<=8;i++){const v=.03+i/8*(.9-.25*u*u);q.push([u*(.35+.65*Math.min(1,v*2.2)),v])}L2.push({pts:q,w:cw.vd?.75:.42,c:cw.vein,o:cw.vd?.8:.5})}
      let vd='';for(const l of L2){const P=l.pts.map(([u,v])=>PJ3(F,S(u,v)));vd+=smooth(P.map(p=>[p[0],p[1]]),false)}E('path',{d:vd,stroke:cw.vein,'stroke-width':f((cw.vd?.75:.42)*D/60),'stroke-opacity':cw.vd?.8:.5,fill:'none','stroke-linecap':'round'},g)}
    if(cw.spots||cw.blot){let dd='';const nn=cw.blot?14:40;for(let k=0;k<nn;k++){const u=Math.sin(rs+k*12.9898)*.72,v=.12+.78*Math.abs(Math.sin(rs*1.3+k*78.233)),c=PJ3(F,S(u,v)),c2=PJ3(F,S(u+.03,v+.02));
        const rr=cw.blot?D*(.012+.016*Math.abs(Math.sin(k*3.1+rs))):D*(.004+.004*Math.abs(Math.sin(k*5.7))),sx=Math.max(.6,Math.hypot(c2[0]-c[0],c2[1]-c[1])/Math.hypot(.03,.02)*.05);
        dd+=cw.blot?smooth([0,1,2,3,4,5,6].map(j=>{const a=j/7*6.283,q=rr*(.75+.3*Math.sin(j*2.3+k));return[c[0]+Math.cos(a)*q,c[1]+Math.sin(a)*q*.85]})):`M${f(c[0]-rr)},${f(c[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
      E('path',{d:dd,fill:cw.blot||cw.spots,opacity:cw.blot?.9:.75},g)}
    if(cw.edge){const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:cw.edge,'stroke-width':f(D*.05),'stroke-opacity':.85,'clip-path':`url(#${id})`},g)}};
  const tep=(o,sd)=>{const S=petS(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:8,nv:12,across:1.2,ew:.5,eo:.25,cast:1,rim:[.9,.35],paint:deco(S,sd)}));return S};
  /* sepals behind, petals in front of them */
  tep({phi:90+R(-3,3),r0:D*.02,z0:-D*.012,L:r*.88,W:r*.25,wp:PH_SEP,a0:A(84),a1:A(97),cup:-.14,ruf:.05,bow:-.02},1);
  for(const s of[-1,1])tep({phi:270+s*50+R(-3,3),r0:D*.025,z0:-D*.018,L:r*.84,W:r*.27,wp:PH_SEP,a0:A(84),a1:A(98),cup:-.12,ruf:.05,tw:s*6},2+s);
  for(const s of[-1,1])tep({phi:90+s*-72+R(-4,4),r0:D*.03,z0:D*.004,L:r*.92,W:r*.5,wp:PH_PET,a0:A(85),a1:A(95),cup:-.07,ruf:.06,rk:4,tw:s*-4},5+s);
  /* the lip: two erect side lobes, a forward mid-lobe with two antennae, the callus at its base */
  if(op>.3){const ink=Pl.ink;
    for(const s of[-1,1]){const S=petS({phi:270+s*62,r0:D*.045,z0:D*.03,L:r*.25,W:r*.085,wp:PH_SIDE,a0:A(26),a1:A(4),cup:-.45,tw:s*35});F.parts.push(...sheet3(F,S,{pal:Pl2,palB:Pl2,nu:6,nv:8,across:1.4,ew:.45,eo:.4,cast:.8,
      paint:(g,front,X)=>{if(LOD)return;let dd='';for(let k=0;k<4;k++){const u=-.6+k*.4,P=[.15,.45,.75].map(v=>PJ3(F,S(u,v)));dd+=smooth(P.map(p=>[p[0],p[1]]),false)}E('path',{d:dd,stroke:cw.dots||ink,'stroke-width':f(D*.006),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},g)}}))}
    const SM=petS({phi:270,r0:D*.07,z0:D*.05,L:r*.46,W:r*.17,wp:PH_MID,a0:A(64),a1:A(112),cup:-.25,pw:1.1});F.parts.push(...sheet3(F,SM,{pal:Pl,palB:Pl,nu:7,nv:10,across:1.3,ew:.5,eo:.45,cast:.9}));
    for(const s of[-1,1]){const b=SM(s*.12,.97),q=[b,V3.add(b,[s*D*.018,-D*.02,D*.01]),V3.add(b,[s*D*.042,-D*.024,D*.018]),V3.add(b,[s*D*.055,-D*.012,D*.02])];F.parts.push(tube3(F,q,D*.0045,{cols:[Pl.b,Pl.d1],cap:1,hl:.2,dk:.3,spec:0,ink:Pl.ink,eo:.3,cast:0}))}
    const cb=[0,-D*.05,D*.07],cq=[cb,V3.add(cb,[0,-D*.012,D*.022]),V3.add(cb,[0,-D*.03,D*.036])];F.parts.push(tube3(F,cq,q=>D*.03*(1-.35*q),{cols:[cw.cal,shd(cw.cal,.2)],cap:1,dots:{n:16,r:D*.004,c:cw.dots||'#c03020',o:.85},hl:.45,dk:.35,spec:.35,ink:shd(cw.cal,-.6),eo:.35,cast:.6,zb:D*.02}));
    /* the column, curving down over the lip, with its anther cap */
    const cl=[[0,D*.01,D*.02],[0,-D*.004,D*.05],[0,-D*.022,D*.085],[0,-D*.035,D*.105]],cc=mix('#fbf6f0',cw.c,.25);F.parts.push(tube3(F,cl,q=>D*.026*(1-.2*q),{cols:[shd(cc,-.12),cc,lt(cc,.3)],cap:1,hl:.5,dk:.35,spec:.45,ink:shd(cc,-.6),eo:.35,cast:.7,zb:D*.03}));
    const an=cl[3];F.parts.push(tube3(F,[V3.add(an,[0,D*.006,-D*.004]),V3.add(an,[0,-D*.004,D*.004])],D*.017,{cols:['#f6f0e6','#fffaf2'],cap:1,hl:.5,dk:.3,spec:.5,ink:'#a89888',eo:.4,cast:0,zb:D*.04}))}
  /* the pedicel at the back */
  const pd=[[0,0,-D*.02],[0,-D*.03,-D*.1],[0,-D*.06,-D*.2]];F.parts.push(tube3(F,pd,D*.022,{cols:[mix(cw.c,'#9ab07a',.5),'#8aa06a'],cap:0,hl:.3,dk:.4,spec:.2,ink:'#3a4a2a',eo:.3,cast:0,zb:-D*.05}));
  render3(F,D*.5);return F}
/* a bud: a plump, slightly pointed ovoid on its pedicel, greener at the base; drawn as its true projected silhouette, lit from the upper left, with its seam */
function phalBud(par,B,O,s,cw){const c=mix(cw.c,'#c8d4a0',.35),P=pal7(c),pts=[],g=G(par),ov=(a,v)=>{const r=s*.5*Math.pow(Math.sin(Math.PI*Math.min(.995,.02+.98*v)),.75)*(1-.25*v);return[Math.sin(a)*r,Math.cos(a)*r*.92,v*s*1.25-s*.3]};
  for(let i=0;i<=14;i++)for(let j=0;j<16;j++){const p=PJ(B,O,ov(j/16*6.283,i/14));pts.push([p[0],p[1]])}const h=hull2(pts),cx=h.reduce((a,p)=>a+p[0],0)/h.length,cy=h.reduce((a,p)=>a+p[1],0)/h.length,d=smooth(h);
  let ext=0;for(const p of h)ext=Math.max(ext,Math.hypot(p[0]-cx,p[1]-cy));
  const id='q'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:f(cx-ext*.35),cy:f(cy-ext*.4),r:f(ext*1.45)},GDEF||defs);stops(gr,[[0,P.l2],[.35,P.l1],[.7,P.b],[1,P.d2]]);
  E('path',{d,fill:`url(#${id})`},g);const base=PJ(B,O,ov(0,.05)),gr2=ugrad(base[0],base[1],cx,cy,[[0,'#7f9a52',.75],[1,'#7f9a52',0]]);E('path',{d,fill:gr2},g);
  const sm=[0,.3,.6,.9].map(v=>PJ(B,O,ov(.35,v)));if(!LOD)E('path',{d:smooth(sm.map(p=>[p[0],p[1]]),false),stroke:P.d1,'stroke-width':.5,'stroke-opacity':.55,fill:'none'},g);
  E('path',{d,fill:'none',stroke:P.ink,'stroke-width':.5,'stroke-opacity':.35},g)}
/* the spray: an arching raceme, flowers hanging from it on their pedicels and facing out, graded to buds at the tip */
function x3PhalSpray2(g,t,o){const cw=o.cw||cwNear(CW_PHAL.filter(x=>!x.late),o.col)||CW_PHAL[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC*(o.cw?1:1),k=G(g),Bc=frameOf(o,.3,true),r=D/2;
  const nf=o.nf||(op<.3?0:op<.7?2:3+(rnd()<.5?1:0)),nb=op<.3?5:3,sd=o.side??(rnd()<.5?-1:1);
  /* raceme in the spray frame: rises from behind and below, arches over toward one side */
  const C=[fitDown(Bc,[-sd*r*.5,-r*1.9,-r*.35],.3),[-sd*r*.6,-r*.2,-r*.3],[sd*r*.2,r*1.05,-r*.35],[sd*r*1.25,r*.75,-r*.5]],cb=q=>{const a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])};
  const items=[];const stem=[];for(let i=0;i<=14;i++)stem.push(cb(i/14));
  const n=nf+nb;for(let i=0;i<n;i++){const q=nf?(i<nf?.24+.5*i/Math.max(1,nf-.6):.8+.17*(i-nf)/Math.max(1,nb-1)):.4+.57*i/Math.max(1,n-1),p=cb(q),bud=i>=nf,alt=i%2?1:-1;
    if(!bud){const sz=1-.07*i,off=[alt*r*.34,-r*.5*sz,r*.55+i*r*.06],pos=V3.add(p,off),axL=V3.nz([alt*.16+R(-.08,.08),.05+R(-.08,.08),1]);items.push({bud:0,pos,axL,sz,node:p})}
    else{const j=i-nf,sz=.32-.06*j,pos=V3.add(p,[alt*r*.12,-r*.16,r*.12]);items.push({bud:1,pos,sz,node:p,ang:alt})}}
  /* the stem, then flowers far to near */
  const scol=['#2e3f22','#4a5e30','#6c7f44','#9fb070'],FS={B:Bc,O:[0,0,0],parts:[]};FS.parts.push(tube3(FS,stem,q=>r*.045*(1-.35*q),{cols:[scol[1],scol[2],scol[1]],cap:1,hl:.3,dk:.45,spec:.2,ink:scol[0],eo:.3,cast:0}));
  for(const it of items){const pd=[it.node,V3.add(it.node,V3.sc(V3s(it.pos,it.node),.5)),it.pos];FS.parts.push(tube3(FS,pd,r*.02,{cols:[scol[1],mix(scol[2],cw.c,.3)],cap:0,hl:.3,dk:.4,spec:.15,ink:scol[0],eo:.25,cast:0}))}
  const nkp=neckPart(Bc,[0,0,0],C[0],V3s(C[0],C[1]),r*.9,r*.09*1.3,{cols:scol});FS.parts.push(nkp.part);drawParts(k,FS.parts);
  items.sort((a,b)=>toV(Bc,a.pos)[2]-toV(Bc,b.pos)[2]);
  for(const it of items){const Ov=toV(Bc,it.pos);if(it.bud){const Bb=frameIn(Bc,V3.nz([it.ang*.5,.75,.5]),0);phalBud(k,Bb,Ov,D*it.sz*.6,cw);continue}
    const Bf=frameIn(Bc,it.axL,R(-.12,.12));phalFlower(k,Bf,Ov,D*it.sz,cw,op,t)}
  /* where the stem leaves the spray (the bouquet stem meets it there) */
  open(k,t,1000,10,.3);return neckOut(nkp)}
/* a frame for a part of a cluster: its axis given in the cluster's local space, its up kept close to the cluster's up */
function frameIn(Bc,axL,roll=0){const Z=V3.nz(toV(Bc,axL)),Yc=toV(Bc,[0,1,0]);let Y=V3s(Yc,V3.sc(Z,V3.dot(Yc,Z)));if(V3l(Y)<1e-6)Y=toV(Bc,[1,0,0]);Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
Object.assign(FN,{xPhalCluster:x3PhalSpray2});CWS['phalaenopsis']=CW_PHAL;
SZG['phalaenopsis']=[7,8,9,9,10,10,11];
