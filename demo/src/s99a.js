/* ================= Serre, lot 99 — baies 3, poussées par le L-système (moteurs des baies des lots 20, 45 et 61) : laurier-tin, viornes, célastre, nandina, symphorine ================= */
/* ---------- shared: a berry on its pedicel (an organ of a grown branch), egg-shaped or round; paint(par,c,e1,e2,mj,r,m) adds a sheen at sheet detail (the metallic blue, the light through a translucent drupe, a blush) ---------- */
function l99Berry(parts,og,cw,rr,m,o={}){const ax=V3.nz(V3.add(og.H,[0,o.lift??.15,0])),hl=rr*(o.fl??1),O=V3.add(og.pos,V3.sc(ax,hl*.78)),col=o.col||mix(bzRipe(cw,m),shd(cw.c,-.2),o.dk??R(0,.2)),dt=DET>=1.5,ink=o.ink||shd(col,-.7);
  const eye=o.eye!==false&&(dt||rr>=3)?(q,tp,a,r2)=>E('ellipse',{cx:f(tp[0]-a[0]*r2*.1),cy:f(tp[1]+a[1]*r2*.1),rx:f(r2*(o.es||.14)),ry:f(r2*(o.es||.14)*Math.max(.35,Math.abs(a[2]))),fill:o.eyeC||'#1c1410',opacity:.7},q):null;
  parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,hl,rr,col,{gl:o.gl??.9,big:o.big??3.6,ink,eye,egg:o.egg,paint:dt&&o.paint&&!LOD?(p,c,e1,e2,mj,r)=>o.paint(p,c,e1,e2,mj,r,m):null})});return O}
/* a sheen inside a berry: an ellipse offset from its centre (dx, dy in radii), of size s, colour c, opacity a */
const l99Sheen=(c,a,dx=.22,dy=.26,s=.5)=>(p,cc,e1,e2,mj,r,m)=>{if(m<.75)return;E('ellipse',{cx:f(cc[0]+r*dx),cy:f(cc[1]+r*dy),rx:f(Math.min(mj,r)*s),ry:f(Math.min(mj,r)*s*.78),fill:c,opacity:a},p)};
/* a leaf petiole grown from the main axis at length l (side az), ending in an organ Lf: the blade then starts at the tip of its petiole */
function l99Pet(A,parts,l,az,el,pl,sc,o={}){const res=bzGrow(A,l,az,el,[['F',{l:pl,w1:o.w1??1.3}],['Lf',{}]],{w:o.w??1.8,seg:2,T:[0,1,0],e:0,wig:.02});bzAxes(res,sc,parts);return res.organs[0]}
/* ---------- a cut leaf in 3D: its outline given as a half (u across, v along, in units of its length; from the base [0,0] to the tip [0,1]) on the surface of lsLeafS, mirrored;
   saw teeth cut along the segments that ask for them ([u,v,n]: n teeth to the next point); palmate veins to the lobe tips at sheet detail ---------- */
function l99Teeth(K,d){const out=[],dt=DET>=1.5;for(let i=0;i<K.length-1;i++){const[a0,a1,n0]=K[i],[b0,b1]=K[i+1],n=n0?dt?n0:Math.ceil(n0*.6):0,dx=b0-a0,dy=b1-a1,l=Math.hypot(dx,dy)||1,h=Math.min(d,.45*l/(n||1));out.push([a0,a1]);
    for(let j=0;j<n;j++){const t=(j+.8)/n;out.push([a0+dx*t+dy/l*h,a1+dy*t-dx/l*h]);if(j<n-1)out.push([a0+dx*(j+1)/n,a1+dy*(j+1)/n])}}out.push(K[K.length-1].slice(0,2));return out}
function l99Lobe(pos,H,U,len,half,col,o={}){const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));og.L=V3.cr(og.U,og.H);
  const S=lsLeafS(og,len,2,Object.assign({},o,{wp:()=>1})),M=[];for(let i=0;i<=8;i++)M.push(S(0,i/8));const Rt=half.map(([u,v])=>S(u,v)),Lf=half.map(([u,v])=>S(-u,v)),sc=q=>[q[0],-q[1]];
  const nrm=u=>{const e=.01,du=V3s(S(u+e,.45),S(u-e,.45)),dv=V3s(S(u,.47),S(u,.43));return V3.nz(V3.cr(du,dv))},nL=nrm(-.25),nR=nrm(.25);let z=0;for(const q of M)z+=q[2];z/=M.length;
  const P=pal7(col),PB=pal7(mix(shd(col,.2),'#b8c4a0',.3)),ink=shd(col,-.7);
  return{z:z+(o.zb||0),cast:false,fn:par=>{const g=G(par),half2=(E1,n)=>{const back=n[2]<0,I=Math.max(.28,lightI(back?V3.sc(n,-1):n)*(o.ao||.84));
      E('path',{d:pD(E1.concat(M.slice().reverse()).map(sc))+'Z',fill:toneAt(back?PB:P,I),stroke:ink,'stroke-width':.4,'stroke-opacity':.42,'stroke-linejoin':'round'},g);return{back,I}};
    const zl=Lf.reduce((a,q)=>a+q[2],0),zr=Rt.reduce((a,q)=>a+q[2],0),hs=zl<zr?[[Lf,nL,-1],[Rt,nR,1]]:[[Rt,nR,1],[Lf,nL,-1]],res={};for(const[E1,n,s]of hs)res[s]=half2(E1,n);
    if(LOD)return;const fr=!res[1].back||!res[-1].back,mc=fr?P.l1:PB.d1;let d='M'+M.map(q=>f(q[0])+','+f(-q[1])).join('L');
    if(DET>=1.5&&o.vt)for(const[u,v]of o.vt)for(const s of[-1,1]){const a=S(0,.03),m=S(s*u*.45,v*.42+.03),b=S(s*u*.9,v*.92);d+=`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`}
    E('path',{d,stroke:mc,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g)}}}
/* the outline of a guelder-rose leaf (Viburnum opulus): three spreading lobes, the middle one longest, coarse irregular teeth */
const L99_OPU=[[0,0,0],[.13,-.02,0],[.27,.05,2],[.42,.2,2],[.53,.38,0],[.56,.52,0],[.42,.5,0],[.3,.5,0],[.2,.56,0],[.24,.68,2],[.2,.84,2],[.1,.94,0],[0,1,0]];

/* ---------- laurier-tin (Viburnum tinus) in fruit: stout reddish young stems; decussate pairs of entire, elliptic, leathery leaves, very dark glossy green; at the shoot tips flat corymbs
   of small ovoid drupes (6–7 mm), green, then violet, then a metallic indigo blue; in winter often beside the next corymbs of pink or white buds ---------- */
const L99_CW_TIN=[{id:'bleu',n:'Bleu métallique (type)',c:'#3e4f8a',y:'#6a4a72',g:'#7a9a48'},{id:'bleu-nuit',n:'Bleu nuit (Gwenllian)',c:'#2c3664',y:'#5a3a62',g:'#7a9a48'},
  {id:'bleu-noir',n:'Bleu-noir (très mûr)',c:'#1f2433',y:'#4a3450',g:'#7a9a48'},{id:'mi-mur',n:'Bleu, violet et vert (mi-mûr)',c:'#3e4f8a',y:'#6a2438',g:'#7a9a48',mx:1},
  {id:'boutons-roses',n:'Baies bleues et boutons roses (Eve Price)',c:'#3e4f8a',y:'#6a4a72',g:'#7a9a48',bud:'#d9718f'},{id:'boutons-blancs',n:'Baies bleues et boutons blancs (French White)',c:'#3e4f8a',y:'#6a4a72',g:'#7a9a48',bud:'#f6f3ef'}];
function l99Tin(g,t,o){const cw=cwPick(L99_CW_TIN,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,sc=['#3a1e1a','#62342a','#8a5444','#b48068'],dt=DET>=1.5,lc='#0e2014',
    rb=.31*UPC*Math.max(.9,Math.min(1.1,C/(8*UPC)))**.3,met=l99Sheen('#a8bcec',.26);
  return bzShoot(g,t,o,{Lt:C*4.4,w0:3.8,w1:2.2,sc,bow:R(-.07,.07),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=shd(cw.c,-.75);
    /* the corymb: primary rays round the top of the peduncle, the outer ones longer and lower so the drupes make one flat dome; each ray ends in a little umbel of pedicels */
    const cor=(np,nb,k)=>{const m=[['F',{l:C*.07*k,w1:1.6}]];for(let j=0;j<np;j++){const q=(j+.5)/np;m.push(['[',{w:1.45}],['/',{a:j*137.5+R(-12,12)}],['&',{a:14+56*Math.sqrt(q)+R(-6,6)}],['F',{l:C*(.1+.22*Math.sqrt(q))*k*R(.9,1.1),w1:1.25}]);
        for(let i=0;i<nb;i++)m.push(['[',{w:1.15}],['/',{a:i*360/nb+R(-25,25)}],['&',{a:R(28,50)}],['F',{l:rb*R(1.5,2.4),w1:1.15}],['B',{q}],[']',{}]);m.push(['F',{l:rb*1.3,w1:1.15}],['B',{q}],[']',{}])}
      m.push(['F',{l:rb*1.5,w1:1.15}],['B',{q:0}]);return m};
    const run=(res,bud)=>{l45Axes(res,sc,parts);for(const og of res.organs){if(og.t!=='B')continue;
      if(bud){const s=.55+.12*op;l99Berry(parts,og,cw,rb*s*R(.9,1.1),1,{col:mix(cw.bud,shd(cw.bud,-.15),R(0,.4)),fl:1.05,gl:.45,eye:false,lift:.3,ink:shd(cw.bud,-.6)});continue}
      const m=cw.mx?Math.max(0,Math.min(1,op*.95+R(-.5,.2))):Math.max(0,Math.min(1,op*1.3-og.p.q*.12+R(-.08,.04)));
      l99Berry(parts,og,cw,rb*R(.9,1.06)*(.8+.2*Math.min(1,op*1.5)),m,{fl:1.15,egg:.12,eye:'dot',gl:.95,ink,lift:.3,paint:met})}};
    run(bzGrow(A,L-.5,0,3,cor(dt?7:5,dt?4:3,1),{w:2.1,seg:rb,T:[0,1,0],e:.035,wig:.03}));
    const leaf=(og,len)=>parts.push(bzBlade(og.pos,V3.nz(V3.add(og.H,[0,-.2,0])),og.U,len,.46,mix(lc,'#24442a',R(0,.4)),{wp:LS_OVATE,droop:.12,arch:.06,fold:.24,vn:dt?6:0,gloss:dt?1.1:0,face:.5,ao:.9}));
    /* decussate leaf pairs down the stem; from the upper axils, side shoots with their own leaf pair and a smaller corymb (in the budded colourways, a corymb of buds) */
    const dl=C*.36,nn=dt?6:4;for(let i=0;i<nn;i++){const l=L-C*.18-dl*i*(1+.08*i);if(l<l0+6)break;const ph=(i%2?90:0)+R(-10,10);
      for(const sd of[0,180]){const az=(ph+sd)*D;
        if(i>0&&i<3&&rnd()<(i===1?.7:dt?.45:.25)){const bud=!!cw.bud&&rnd()<.6,ll=C*R(.45,.7);
          const sh=bzGrow(A,l,az+R(-.3,.3),R(32,44),[['F',{l:ll,w1:1.7}],['[',{w:1.5}],['/',{a:90}],['&',{a:55}],['F',{l:C*.07,w1:1.3}],['Lf',{}],[']',{}],['[',{w:1.5}],['/',{a:270}],['&',{a:55}],['F',{l:C*.07,w1:1.3}],['Lf',{}],[']',{}],['F',{l:C*.18,w1:1.6}],...cor(dt?5:4,dt?4:2,.72)],{w:2,seg:rb,T:[0,1,0],e:.03,wig:.03});
          run(sh,bud);for(const og of sh.organs)if(og.t==='Lf')leaf(og,C*R(.6,.75))}
        const og=l99Pet(A,parts,l,az,R(50,62),C*.12,sc);leaf(og,C*R(.82,1)*(i?1:.85))}}}})}

/* ---------- viornes (Viburnum opulus, V. dentatum, V. nudum) in fruit: opposite leaves (three-lobed and toothed in the guelder rose, ovate and coarsely toothed in arrowwood,
   entire and glossy in V. nudum); at the tips of short shoots, broad cymes of round drupes (8–10 mm) hanging under their weight: translucent red, amber or orange in the guelder rose,
   blue in arrowwood, cream turning pink then blue all together in V. nudum ---------- */
const L99_CW_VIB=[{id:'rouge',n:'Rouge translucide (V. opulus)',c:'#c8202c',y:'#e0782a',lf:'lobe',tr:1},{id:'rouge-cerise',n:'Rouge cerise (V. opulus Compactum)',c:'#a8162a',y:'#d86a2a',lf:'lobe',tr:1},
  {id:'orange',n:'Orange corail (V. opulus Aurantiacum)',c:'#e8702e',y:'#e8a848',lf:'lobe',tr:1},{id:'jaune',n:'Jaune ambré (V. opulus Xanthocarpum)',c:'#e6b43a',y:'#dccc66',lf:'lobe',tr:1},
  {id:'bleu',n:'Bleu (V. dentatum Blue Muffin)',c:'#2e3a5e',y:'#5a6a8a',g:'#a8b878',lf:'dent'},{id:'rose-bleu',n:'Rose et bleu (V. nudum Brandywine)',c:'#2e3a5e',y:'#d58aa6',g:'#efe4cc',lf:'nud',mx:1},
  {id:'rose',n:'Rose (V. nudum, en mûrissement)',c:'#d58aa6',y:'#eccacc',g:'#f3efe4',lf:'nud'}];
function l99Vib(g,t,o){const cw=cwPick(L99_CW_VIB,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||9)*UPC,sc=['#3a2a20','#5e4636','#86684e','#b0927a'],dt=DET>=1.5,
    rb=.42*UPC*Math.max(.9,Math.min(1.1,C/(9*UPC)))**.3,lc=cw.lf==='nud'?'#1e3a20':'#2e4e24';
  return bzShoot(g,t,o,{Lt:C*3.9,w0:3.6,w1:2,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=shd(cw.c,-.72);
    /* translucent drupes: the light comes through on the far side from the highlight */
    const glow=cw.tr?(p,c,e1,e2,mj,r,m)=>{if(m<.7)return;E('ellipse',{cx:f(c[0]+r*.24),cy:f(c[1]+r*.28),rx:f(Math.min(mj,r)*.46),ry:f(Math.min(mj,r)*.36),fill:shd(cw.c,.5),opacity:.38},p)}:null;
    /* the cyme: a peduncle arching over and down, rays spreading round it, each forking into pedicels; the drupes hang */
    const cym=(np,nb,k,side)=>{const aim=V3.nz([side*.5,-1,R(-.2,.3)]),m=[['F',{l:C*.3*k,w1:1.6,aim,k:.2}]];
      for(let j=0;j<np;j++){const q=(j+.5)/np;m.push(['[',{w:1.4}],['/',{a:j*137.5+R(-12,12)}],['&',{a:16+50*Math.sqrt(q)+R(-6,6)}],['F',{l:C*(.09+.17*Math.sqrt(q))*k*R(.88,1.12),w1:1.2,e:-.06}]);
        for(let i=0;i<nb;i++)m.push(['[',{w:1.15}],['/',{a:i*360/nb+R(-25,25)}],['&',{a:R(25,45)}],['F',{l:rb*R(1.3,2),w1:1.15,e:-.06}],['B',{q}],[']',{}]);m.push(['F',{l:rb*1.1,w1:1.15}],['B',{q}],[']',{}])}
      m.push(['F',{l:rb*1.3,w1:1.15}],['B',{q:0}]);return m};
    const run=res=>{l45Axes(res,sc,parts);for(const og of res.organs){if(og.t==='B'){const m=cw.mx?Math.max(0,Math.min(1,op*.9+R(-.55,.25))):Math.max(0,Math.min(1,op*1.3-og.p.q*.12+R(-.08,.04)));
        l99Berry(parts,og,cw,rb*R(.9,1.06)*(.8+.2*Math.min(1,op*1.5)),m,{fl:.96,eye:'dot',es:.1,gl:cw.tr?1:.8,ink,lift:-.35,big:5,paint:glow})}
      else if(og.t==='Lf')leaf(og,C*R(.5,.62))}};
    const leaf=(og,len)=>{const H=V3.nz(V3.add(og.H,[0,-.22,0])),c=mix(lc,'#3e5e2a',R(0,.45));
      parts.push(cw.lf==='lobe'?l99Lobe(og.pos,H,og.U,len,l99Teeth(L99_OPU,.018),c,{droop:.12,arch:.05,fold:.14,face:.45,vt:[[.56,.52],[0,1]]})
        :cw.lf==='dent'?bzBlade(og.pos,H,og.U,len*.85,.72,c,{wp:LS_OVATE,teeth:dt?11:8,td:.12,droop:.12,arch:.05,fold:.2,vn:dt?7:0,pleat:1,va:.1,face:.45})
        :bzBlade(og.pos,H,og.U,len*.9,.5,c,{wp:LS_OVATE,droop:.12,arch:.06,fold:.22,vn:dt?5:0,gloss:1,face:.45}))};
    const pair=n=>[['[',{w:1.5}],['/',{a:90}],['&',{a:58}],['F',{l:C*.09,w1:1.25}],['Lf',{}],[']',{}],['[',{w:1.5}],['/',{a:270}],['&',{a:58}],['F',{l:C*.09,w1:1.25}],['Lf',{}],[']',{}]];
    /* the top of the stem: a last leaf pair, then its cyme; fruiting side shoots from the upper nodes, leaf pairs below */
    const sd0=rnd()<.5?1:-1;run(bzGrow(A,L-.5,0,3,[...pair(),['F',{l:C*.08,w1:1.6}],...cym(dt?7:5,dt?3:2,1,sd0)],{w:2,seg:rb,T:[0,1,0],e:.02,wig:.03}));
    const dl=C*.42,nn=dt?5:3;for(let i=0;i<nn;i++){const l=L-C*.3-dl*i*(1+.08*i);if(l<l0+6)break;const ph=(i%2?90:0)+R(-10,10);
      for(const sd of[0,180]){const az=(ph+sd)*D;
        if(i<2&&rnd()<(i?dt?.5:.3:.8)){const s=Math.sin(az)>0?1:-1;run(bzGrow(A,l,az+R(-.3,.3),R(38,52),[['F',{l:C*R(.35,.55),w1:1.8}],...pair(),['F',{l:C*.06,w1:1.6}],...cym(dt?6:4,2,.82,s)],{w:2.1,seg:rb,T:[0,1,0],e:.02,wig:.03}));continue}
        const og=l99Pet(A,parts,l,az,R(50,60),C*.1,sc);leaf(og,C*R(.6,.75))}}}})}

/* ---------- célastre (Celastrus orbiculatus, C. scandens), bittersweet: a woody twining vine, grey-brown, sold leafless; in the axils, small cymes of round capsules (8–10 mm),
   green, then yellow or orange; ripe, each splits into three valves that fold back to show the scarlet fleshy arils round the seeds ---------- */
const L99_CW_CEL=[{id:'orange',n:'Orange, graines rouges (C. orbiculatus)',c:'#e38a2a',a:'#c8232a'},{id:'jaune',n:'Jaune d\'or, graines rouges',c:'#e3b437',a:'#c8232a'},
  {id:'orange-vif',n:'Orange vif (C. scandens Autumn Revolution)',c:'#ec7422',a:'#d42a24'},{id:'vert',n:'Vert (capsules fermées)',c:'#8f9e4c',a:'#c8232a',cl:1}];
/* a valve of a capsule: one shell (lsLeafS) cupped toward U, toned by its facing; one element */
function l99Valve(pos,H,U,len,col){const og={pos,H:V3.nz(H)};og.U=V3.nz(V3s(U,V3.sc(og.H,V3.dot(U,og.H))));og.L=V3.cr(og.U,og.H);const S=lsLeafS(og,len,1.1,{wp:LS_OVATE,droop:0,arch:.12,fold:.5}),A1=[],B1=[];
  for(let i=0;i<=8;i++){A1.push(S(1,i/8));B1.push(S(-1,i/8))}const e=.02,n=V3.nz(V3.cr(V3s(S(.3+e,.5),S(.3-e,.5)),V3s(S(.3,.52),S(.3,.48)))),P=pal7(col),pts=A1.concat(B1.reverse()).map(q=>[q[0],-q[1]]);let z=0;for(const q of A1)z+=q[2];
  return{z:z/A1.length,cast:false,fn:par=>E('path',{d:smooth(pts),fill:toneAt(P,Math.max(.45,lightI(n[2]<0?V3.sc(n,-1):n))),stroke:shd(col,-.6),'stroke-width':.35,'stroke-opacity':.55},par)}}
/* the capsule on its pedicel: closed (a ball with its three sutures), or open by s (0 → 1) with its valves reflexing behind the arils */
function l99Cap(parts,og,cw,r,s,m){const ax=V3.nz(V3.add(og.H,[0,-.15,0])),dt=DET>=1.5,cc=mix(mix('#9aa64e',cw.c,m),shd(cw.c,-.25),R(0,.25));
  if(s<.2||cw.cl){const O=V3.add(og.pos,V3.sc(ax,r*.82));parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,r*.95,r,cc,{gl:.45,ink:shd(cc,-.7),
      paint:dt&&!LOD?(p,c,e1,e2,mj,rr)=>{let d='';for(const k of[-.45,.4]){const x=c[0]+e2[0]*rr*k,y=c[1]+e2[1]*rr*k;d+=`M${f(x-e1[0]*mj*.8)},${f(y-e1[1]*mj*.8)}Q${f(x+e2[0]*rr*k*.25)},${f(y+e2[1]*rr*k*.25)} ${f(x+e1[0]*mj*.8)},${f(y+e1[1]*mj*.8)}`}
        E('path',{d,stroke:shd(cc,-.45),'stroke-width':.5,'stroke-opacity':.6,fill:'none'},p)}:null,
      eye:(q,tp)=>E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(Math.max(.6,r*.12)),fill:shd(cc,-.55)},q)})});return}
  const ra=r*(.7+.1*s),O=V3.add(og.pos,V3.sc(ax,ra*.82)),ac=mix(cw.a,shd(cw.a,-.2),R(0,.3));parts.push({z:O[2],fn:par=>bzFruit(par,O,ax,ra*.95,ra,ac,{gl:.85,ink:shd(ac,-.7),
    paint:dt&&!LOD?(p,c,e1,e2,mj,rr)=>E('path',{d:`M${f(c[0]-e2[0]*rr*.1)},${f(c[1]-e2[1]*rr*.1)}L${f(c[0]+e1[0]*mj*.7)},${f(c[1]+e1[1]*mj*.7)}`,stroke:shd(ac,-.4),'stroke-width':.5,'stroke-opacity':.5},p):null})});
  const th=(28+138*Math.min(1,(s-.2)/.8))*D,b=V3.add(og.pos,V3.sc(ax,r*.2));for(const d of bzRing(ax,3,1.5708,R(0,6.28))){const H=V3.nz(V3.add(V3.sc(ax,Math.cos(th)),V3.sc(d,Math.sin(th)))),U=V3.add(V3.sc(ax,Math.sin(th)),V3.sc(d,-Math.cos(th)));
    parts.push(l99Valve(b,H,U,r*1.7,mix(cc,shd(cc,.25),R(.2,.6))))}}
function l99Cel(g,t,o){const cw=cwPick(L99_CW_CEL,o),op=Math.max(.05,Math.min(1,o.op??1)),Lf=(o.cm||50)*UPC,sc=['#2c2620','#504640','#7a6e64','#a69a8e'],dt=DET>=1.5,rb=.4*UPC;
  return bzShoot(g,t,o,{Lt:Lf*1.2,w0:3.6,w1:1.5,sc,bow:R(.16,.28)*(rnd()<.5?-1:1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    const cap=(og,u)=>{const m=Math.max(0,Math.min(1,op*1.4-.15*u+R(-.1,.05))),s=cw.cl?0:Math.max(0,Math.min(1,op*1.35-.35*u+R(-.2,.15)));l99Cap(parts,og,cw,rb*R(.9,1.08),s,m)};
    /* a cyme in an axil: a short stalk forking into the pedicels of its capsules */
    const cym=(p,rd,T,n,u)=>{const res=l61Clu(p,V3.add(rd,V3.sc(T,.35)),T,n,rb,rb*1.7,n<2?{st:.1,a0:0,a1:8,w:1.3}:{st:.7,a0:25,a1:65,w:1.3});l45Axes(res,sc,parts);for(const og of res.organs)cap(og,u)};
    /* the cymes along the vine, alternate (2/5), the upper ones richer; one or two twining side branches with their own cymes */
    const step=Lf*(dt?.06:.08);let i=0;for(let l=L-2;l>Math.max(l0+5,L-Lf*.95);l-=step*R(.85,1.15),i++){const s=A.sOf(l),q=A.at(s),az=(i*144+R(-20,20))*D,rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),w=3.6+(1.5-3.6)*s;
      const n=i===0?(dt?5:4):Math.max(1,Math.round(R(1.4,dt?4:3)));cym(V3.add(q.p,V3.sc(rd,w*.3)),rd,q.T,n,(L-l)/Lf)}
    const nb=rnd()<.55?2:1;for(let j=0;j<nb;j++){const l=L-Lf*R(.45,.7)-j*Lf*.15;if(l<l0+8)continue;const az=(j*170+R(-30,30)+60)*D,ll=Lf*R(.3,.45),nst=Math.max(3,Math.round(ll/step));
      const mods=[];for(let k=0;k<nst;k++)mods.push(['F',{l:ll/nst,w1:Math.max(1.4,2.4-1*k/nst)}],['/',{a:144+R(-20,20)}],['S',{u:k/nst}]);mods.push(['S',{u:1,t:1}]);
      const res=bzGrow(A,l,az,R(30,45),mods,{w:2.4,seg:4,T:[0,1,0],e:.015,wig:.09});bzAxes(res,sc,parts);
      for(const og of res.organs){const a=R(0,6.28),rd=og.p.t?og.H:V3.nz(V3.add(V3.sc(og.L,Math.cos(a)),V3.sc(og.U,Math.sin(a))));cym(og.pos,rd,og.H,og.p.t?(dt?4:3):Math.max(1,Math.round(R(1,2.8))),.3+.5*og.p.u)}}}})}

/* ---------- nandina (Nandina domestica) in fruit: slender unbranched canes; large two- or three-times pinnate leaves, their narrow lanceolate leaflets glossy, flushed red in winter;
   at the top a loose, branched panicle, drooping under the weight of its round shining berries (6–8 mm), bright red (cream in 'Alba') ---------- */
const L99_CW_NAN=[{id:'rouge',n:'Rouge vif (type)',c:'#d42a24',y:'#e0782a',g:'#9ab048'},{id:'rouge-corail',n:'Rouge corail',c:'#d8452e',y:'#e2902c',g:'#9ab048'},
  {id:'rouge-hiver',n:'Rouge, feuillage d\'hiver pourpré',c:'#c8222a',y:'#e0782a',g:'#9ab048',lf:'#5a2a24'},{id:'creme',n:'Blanc crème (Alba)',c:'#f0e6c8',y:'#e6e2b4',g:'#b8c890'},
  {id:'vert',n:'Vert (baies vertes)',c:'#8fae4a',y:'#a0b852',g:'#8fae4a'}];
function l99Nan(g,t,o){const cw=cwPick(L99_CW_NAN,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||25)*UPC,sc=['#3a2a18','#5e4a2c','#866e48','#b09a72'],dt=DET>=1.5,
    rb=.4*UPC,lc0=cw.lf||'#24442a';
  return bzShoot(g,t,o,{Lt:C*2.2,w0:3.6,w1:2,sc,bow:R(-.06,.06),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=cw.id==='creme'?'#7a7058':shd(cw.c,-.72);
    /* the panicle: a rachis with spiral side branches shortening upward; each branch forks into a few pedicels, a berry on each axis */
    const nl=dt?13:9,pan=[];for(let i=0;i<nl;i++){const q=i/nl,bl=C*(.36*(1-q)+.08);pan.push(['F',{l:C*.75/nl*R(.85,1.1),w1:Math.max(1.25,2-.75*q)}],['/',{a:137.5+R(-15,15)}],
        ['[',{w:1.35}],['&',{a:48+R(-8,8)}],['F',{l:bl*.45,w1:1.2}]);const ns=q<.5?(dt?5:3):2;
      for(let k=0;k<ns;k++)pan.push(['[',{w:1.15}],['/',{a:k*360/ns+R(-20,20)}],['&',{a:R(30,52)}],['F',{l:bl*R(.2,.34),w1:1.15}],['B',{q}],[']',{}]);pan.push(['F',{l:bl*.3,w1:1.15}]);for(let k=0;k<(dt?3:2);k++)pan.push(['[',{w:1.15}],['/',{a:60+k*120+R(-20,20)}],['&',{a:R(35,55)}],['F',{l:bl*R(.15,.26),w1:1.15}],['B',{q}],[']',{}]);pan.push(['F',{l:bl*.22,w1:1.15}],['B',{q}],[']',{}])}
    pan.push(['F',{l:rb*2.4,w1:1.15}],['B',{q:1}]);const top=bzGrow(A,L-.5,R(0,6.28),12,pan,{w:2,seg:4,T:[0,-1,0],e:.018,wig:.03});l45Axes(top,sc,parts);
    for(const og of top.organs){const m=Math.max(0,Math.min(1,op*1.3-og.p.q*.12+R(-.08,.04)));l99Berry(parts,og,cw,rb*R(.9,1.08)*(.8+.2*Math.min(1,op*1.5)),m,{fl:.97,eye:'dot',es:.1,gl:cw.id==='creme'?.6:.95,ink,lift:-.1})}
    /* a compound leaf: a long petiole, pairs of pinnae (each a small rachis with its pairs of leaflets and one at the tip), one pinna at the tip */
    const leaf=(l,az,len)=>{const np=dt?3:2,pin=pl=>{const m=[];for(let j=0;j<(dt?2:1);j++)m.push(['F',{l:pl*.3,w1:1.15}],['Lp',{}]);m.push(['F',{l:pl*.2,w1:1.15}],['Lt',{}]);return m};
      const m=[['F',{l:len*.28,w1:1.6}],['/',{a:(rnd()<.5?1:-1)*R(45,70)}]];for(let i=0;i<np;i++){const pl=len*(.34-.07*i);m.push(['F',{l:len*.16,w1:Math.max(1.2,1.5-.1*i)}]);for(const s of[-1,1])m.push(['[',{w:1.2}],['+',{a:s*58+R(-8,8)}],...pin(pl),[']',{}])}
      m.push(['F',{l:len*.1,w1:1.2}],...pin(len*.26));const res=bzGrow(A,l,az,R(48,60),m,{w:1.9,seg:4,T:[0,-1,0],e:.025,wig:.02}),lc=mix(lc0,cw.lf?'#8a2a20':'#2e5a2a',R(0,.5));
      l45Axes(res,['#3a2a18','#5e4a2c','#866e48','#b09a72'],parts);const ll=len*.21;
      for(const og of res.organs){if(og.t==='Lt'){parts.push(bzBlade(og.pos,og.H,og.U,ll,.28,lc,{wp:LS_LANCE,droop:.1,arch:.05,fold:.2,vn:dt?4:0,gloss:1,face:.5}));continue}
        for(const s of[-1,1])parts.push(bzBlade(og.pos,V3.nz(V3.add(V3.sc(og.L,s),V3.sc(og.H,.55))),og.U,ll*.9,.28,mix(lc,shd(lc,.12),R(0,.6)),{wp:LS_LANCE,droop:.12,arch:.05,fold:.2,vn:dt?4:0,gloss:1,face:.5}))}};
    const nlf=dt?2:1;for(let i=0;i<nlf;i++){const l=L-C*(.12+.35*i)*R(.92,1.08);if(l<l0+6)continue;leaf(l,(i*160+R(-25,25)+90)*D,C*R(.9,1.05))}}})}

/* ---------- symphorine (Symphoricarpos albus, S. × doorenbosii): thin arching twigs, grey-brown; opposite small oval leaves, dull blue-green; in the axils and at the tips, tight clusters
   of round waxy berries (1–1.5 cm), pressed together, white, pearly flushed pink or pink by the variety, a tiny dark calyx at their tip ---------- */
const L99_CW_SYM=[{id:'blanc',n:'Blanc (S. albus, Magical Snowflake)',c:'#f4f2ee',y:'#e8ecd8',g:'#c8d4a8'},{id:'blanc-rose',n:'Blanc nacré rosé (Mother of Pearl)',c:'#f3e3e3',y:'#ecead8',g:'#c8d4a8',bl:'#e8a8b8'},
  {id:'rose-tendre',n:'Rose tendre (Magical Sweet)',c:'#eec2cb',y:'#ecdcd0',g:'#c8d4a8'},{id:'rose',n:'Rose vif (Magical Candy)',c:'#e391a8',y:'#ecc8cc',g:'#c8d4a8'},
  {id:'rose-pourpre',n:'Rose pourpré (Magical Pride)',c:'#d6668d',y:'#e8b4c0',g:'#c8d4a8'},{id:'rose-profond',n:'Rose profond (Magical Galaxy)',c:'#c24e7a',y:'#e0a0b4',g:'#c8d4a8'}];
function l99Sym(g,t,o){const cw=cwPick(L99_CW_SYM,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||20)*UPC,sc=['#3a3028','#5e5246','#867a6c','#b0a698'],dt=DET>=1.5,rb=.55*UPC,lc='#4e6a4a',
    blush=cw.bl?(p,c,e1,e2,mj,r,m)=>{if(m<.7)return;E('ellipse',{cx:f(c[0]-r*.2),cy:f(c[1]-r*.05),rx:f(r*.55),ry:f(r*.45),fill:cw.bl,opacity:.45},p)}:null;
  return bzShoot(g,t,o,{Lt:C*2.1,w0:2.8,w1:1.4,sc,bow:R(.2,.32)*(rnd()<.5?-1:1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,ink=cw.id==='blanc'?'#8a8478':shd(cw.c,-.6);
    const clu=(p,rd,T,n,u)=>{const res=l61Clu(p,V3.add(rd,V3.sc(T,.25)),T,n,rb,rb*.95,{st:.25,a0:20,a1:85,w:1.3});l45Axes(res,sc,parts);
      for(const og of res.organs){const m=Math.max(0,Math.min(1,op*1.35-u*.2+R(-.1,.05)));l99Berry(parts,og,cw,rb*R(.82,1.08)*(.75+.25*Math.min(1,op*1.4)),m,{fl:.95,eye:'dot',es:.09,eyeC:'#5a4234',gl:.22,dk:R(0,.08),ink,lift:.05,big:6,paint:blush})}};
    const leaf=(og,len)=>parts.push(bzBlade(og.pos,V3.nz(V3.add(og.H,[0,-.15,0])),og.U,len,.62,mix(lc,'#6a8460',R(0,.5)),{wp:LS_OVATE,droop:.1,arch:.05,fold:.16,vn:dt?3:0,face:.5,ao:.86}));
    /* the nodes: decussate pairs, a cluster in each axil (or a leaf alone low down); a larger cluster crowns the twig */
    const step=C*(dt?.13:.16);let i=0;clu(A.at(1).p,A.at(1).T,A.at(1).T,dt?8:6,0);
    for(let l=L-step*.6;l>Math.max(l0+5,L-C*1.2);l-=step*R(.9,1.1),i++){const s=A.sOf(l),q=A.at(s),u=(L-l)/C,ph=(i%2?90:0)+R(-12,12),w=2.8+(1.4-2.8)*s;
      for(const sd of[0,180]){const az=(ph+sd)*D,rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az)));
        if(u<.95&&rnd()<.9)clu(V3.add(q.p,V3.sc(rd,w*.3)),rd,q.T,Math.max(2,Math.round(R(3,dt?6.5:4.8)*(1-.3*u))),u);
        const og=l99Pet(A,parts,l-1,az+.9,R(48,60),.35*UPC,sc,{w:1.5,w1:1.2});leaf(og,2.6*UPC*R(.85,1.1))}}
    /* a thinner arching side twig from the lower part, with a few clusters */
    const l=L-C*R(.9,1.1);if(l>l0+8){const nst=dt?4:3,mods=[];for(let k=0;k<nst;k++)mods.push(['F',{l:C*.13,w1:Math.max(1.3,2-.6*k/nst)}],['/',{a:90+R(-15,15)}],['S',{u:.4+.5*k/nst}]);mods.push(['F',{l:C*.06,w1:1.3}],['S',{u:.3,t:1}]);
      const res=bzGrow(A,l,R(0,6.28),R(35,50),mods,{w:2,seg:4,T:[0,-1,0],e:.02,wig:.03});bzAxes(res,sc,parts);
      for(const og of res.organs){const a=R(0,6.28),rd=og.p.t?og.H:V3.nz(V3.add(V3.sc(og.L,Math.cos(a)),V3.sc(og.U,Math.sin(a))));clu(og.pos,rd,og.H,og.p.t?(dt?5:4):Math.round(R(2,4)),og.p.u)}}}})}

/* ---------- registers: drawers, colourways, trade grades in the recipe's unit (the corymb's width; for the bittersweet the vine's length; for the nandina the panicle;
   for the snowberry the fruiting length), and how the composer treats them: berry stems, the bittersweet a line like the callicarpa ---------- */
Object.assign(GH,{'laurier-tin-a-baies':l99Tin,'viornes-a-baies':l99Vib,'celastre-bittersweet':l99Cel,'nandina-a-baies':l99Nan,'symphorine':l99Sym});
Object.assign(CWS,{'laurier-tin-a-baies':L99_CW_TIN,'viornes-a-baies':L99_CW_VIB,'celastre-bittersweet':L99_CW_CEL,'nandina-a-baies':L99_CW_NAN,'symphorine':L99_CW_SYM});
Object.assign(SZG,{'laurier-tin-a-baies':[6,7,8,8,10],'viornes-a-baies':[7,8,9,9,11],'celastre-bittersweet':[40,50,60,60,80],'nandina-a-baies':[18,22,25,25,30],'symphorine':[15,20,20,25]});
Object.assign(GHI,{'laurier-tin-a-baies':{form:'baie',size:1.35,k:'plant',rk:.88,tip:.8},'viornes-a-baies':{form:'baie',size:1.4,k:'plant',rk:.88,tip:.75},
  'celastre-bittersweet':{form:'ligne',size:1,k:'plant',self:70*UPC,tip:.9,fx:3*UPC},'nandina-a-baies':{form:'baie',size:1.5,k:'plant',rk:.9,tip:.7},'symphorine':{form:'baie',size:1.2,k:'plant',rk:.85,tip:.75}});
