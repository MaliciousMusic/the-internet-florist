/* ================= Serre, lot 93 — fynbos, textures poussées par le L-système : brunia, berzelia, phylica, stoebe, stirlingia ================= */
/* ---------- shared: a woody shoot (bzShoot: its main axis along the composer's spine or standing in the view) whose side branches the L-system grows (bzGrow);
   everything small — twigs, needle leaves, balls, plumes — becomes items at their own depth, drawn in a few bins of one path per kind (l30Batch): hundreds of pieces for a few dozen elements ---------- */
const l93St=o=>{const op=Math.max(.05,Math.min(1,o.op??1));return{op,st:op<.3?0:op<.75?1:2}};
const l93M=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
/* the axes of a grown branch as items: each chain cut in runs, every run a quadratic spline through the midpoints of its polyline (the axis bends, it never breaks),
   stroked in the width class of the run (cls: [[min width, key], …], widest first) */
function l93Twigs(items,res,cls,o={}){const rn=o.run||4;for(const ch of res.chains){const P=ch.pts,n=P.length;if(n<2)continue;
  for(let a=0;a<n-1;a+=rn){const b=Math.min(n-1,a+rn),s=a?l93M(P[a],P[a+1]):P[0];let d='M'+f(s[0])+','+f(-s[1]),z=s[2],w=0,m=1;
    for(let i=a+1;i<=b;i++){const q=P[i];z+=q[2];w+=ch.ws[i];m++;if(i===n-1)d+='L'+f(q[0])+','+f(-q[1]);else{const e=l93M(q,P[i+1]);d+='Q'+f(q[0])+','+f(-q[1])+' '+f(e[0])+','+f(-e[1])}}
    const k=(cls.find(c=>w/(m-1)>=c[0])||cls[cls.length-1])[1];items.push({z:z/m+(o.zb||0),fn:B=>l30Add(B,k,d)})}}}
/* a view-space polyline resampled every step along its length */
function l93Res(P,step){const out=[P[0]];let acc=0;for(let i=1;i<P.length;i++){let a=P[i-1];const b=P[i];let d=V3l(V3s(b,a));
  while(d>1e-9&&acc+d>=step){const t=(step-acc)/d;a=V3.add(a,V3.sc(V3s(b,a),t));out.push(a);d=V3l(V3s(b,a));acc=0}acc+=d}return out}
/* a resampled polyline without its last stretch of length e (where a head sits) */
const l93Cut=(P,e)=>{const n=P.length,end=P[n-1];let i=n;while(i>1&&V3l(V3s(P[i-1],end))<e)i--;return P.slice(0,Math.max(1,i))};
/* points of the main axis from length l0 to l1 */
function l93Along(A,l0,l1,step){const P=[];for(let l=l0;l<=l1;l+=step)P.push(A.at(A.sOf(l)).p);return P}
/* needle leaves along a resampled polyline: k per node, turning round it (a phyllotaxis, not chance), leaning ang (radians) off the axis toward its tip;
   each a tapered sliver from inside the axis (r0) so it stays joined to it; the ones facing us and the ones behind in two keys, each at its own depth */
function l93Needles(items,P,o){let ph=R(0,6.283);const ku=o.ku||'nu',kd=o.kd||'nd';
  for(let i=1;i<P.length;i++){const p=P[i],T=V3.nz(V3s(p,P[i-1]));if(o.skip&&o.skip(p))continue;let X=V3.cr(T,[0,0,1]);if(V3l(X)<.1)X=V3.cr(T,[1,0,0]);X=V3.nz(X);const Y=V3.cr(T,X);let up='',dn='';
    for(let j=0;j<o.k;j++){ph+=2.4;const a=ph+j*6.283/o.k,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),an=o.ang*R(.8,1.2),dir=V3.nz(V3.add(V3.sc(r,Math.sin(an)),V3.sc(T,Math.cos(an)))),
      b=V3.add(p,V3.sc(r,o.r0)),tp=V3.add(b,V3.sc(dir,o.len*R(.75,1.15))),sl=l40Sliver([b[0],-b[1]],[tp[0],-tp[1]],o.w||1.1);if(r[2]>-.15)up+=sl;else dn+=sl}
    if(dn)items.push({z:p[2]-.4,fn:B=>l30Add(B,kd,dn)});if(up)items.push({z:p[2]+.4,fn:B=>l30Add(B,ku,up)})}}
/* the needles of the main axis, piece by piece of the stem (A.segs of spStem): those behind just under each piece, those in front just over it */
function l93StemNd(parts,A,l0,o,keys){const L=A.L,ka=Object.fromEntries(keys);for(const[a,b,z]of A.segs||[]){const la=Math.max(l0+2,a*L),lb=b*L;if(lb-la<2)continue;const it=[],B={};
  l93Needles(it,l93Along(A,la,lb,o.step),o);for(const q of it)q.fn(B);if(B.nd)parts.push({z:z-.02,cast:false,fn:par=>E('path',Object.assign({d:B.nd},ka.nd),par)});
  if(B.nu)parts.push({z:z+.03,cast:false,fn:par=>E('path',Object.assign({d:B.nu},ka.nu),par)})}}
/* a woolly outline: n hairs round (x, y) (view space), their tips at r(1+amp·chance), the hollows between them a little inside */
function l93Fuzz(x,y,r,n,ph,amp){let d='';for(let i=0;i<n;i++){const a=ph+i/n*6.283,a2=a+3.1416/n,rt=r*(1+amp*R(.4,1)),rh=r*(1-amp*.35),p=[x+Math.cos(a)*rt,-(y+Math.sin(a)*rt)],q=[x+Math.cos(a2)*rh,-(y+Math.sin(a2)*rh)];
  d+=(i?'L':'M')+f(p[0])+','+f(p[1])+'L'+f(q[0])+','+f(q[1])}return d+'Z'}
/* a small round body as items: its shaded rim (scalloped at sheet detail: florets, wool), its body, its light; k names its colour set */
function l93Ball(items,c,r,k,o={}){const ph=R(0,6.283);items.push({z:c[2]+(o.zb||0),fn:B=>{const x=c[0],y=c[1];
  const fz=o.fz&&!LOD,sc=DET>=1.5&&o.sc;
  l30Add(B,'s'+k,fz?l93Fuzz(x+r*.06,y-r*.08,r,o.fz,ph,o.amp||.16):sc?l30Sc(x+r*.08,y-r*.1,r,o.sc,ph,o.amp||.08):l30O(x+r*.08,y-r*.1,r));
  l30Add(B,'b'+k,fz?l93Fuzz(x-r*.06,y+r*.06,r*.8,Math.round(o.fz*.8),ph+.2,(o.amp||.16)*.9):sc?l30Sc(x-r*.05,y+r*.05,r*.84,o.sc,ph+.3,(o.amp||.08)*.8):l30O(x-r*.05,y+r*.05,r*.84));
  if(!LOD)l30Add(B,'l'+k,l30O(x-r*.32,y+r*.32,r*.36))}})}
/* the keys of a ball colour set: rim, body, light */
const l93BallKeys=(k,c,o={})=>{const P=pal7(c),lt=h2l(c)[2];return[['s'+k,{fill:o.rim&&lt<=.82?o.rim:lt>.82?mix(c,'#8f8466',.5):toneAt(P,.2),stroke:o.ink||shd(c,-.55),'stroke-width':.3,'stroke-opacity':.45}],['b'+k,{fill:o.body||toneAt(P,.55)}],
  ['l'+k,{fill:o.lt||(lt>.8?'#ffffff':toneAt(P,.9)),opacity:o.lo??.6}]]};
/* needle keys: the upper faces, the paler or deeper ones behind */
const l93NdKeys=(c,cb,ku='nu',kd='nd')=>[[kd,{fill:cb,stroke:shd(cb,-.4),'stroke-width':DET>=1.5?.14:0,'stroke-opacity':.5}],[ku,{fill:c,stroke:shd(c,-.45),'stroke-width':DET>=1.5?.14:0,'stroke-opacity':.5}]];

/* ---------- brunia (Brunia laevis, « silver brunia »; B. albiflora; B. noduliflora): a stiff woody stem clothed all along in tiny needle leaves (3–5 mm) pressed against it and overlapping
   like scales (imbricate), branching near its top into short stiff branchlets, each ending in a globose head of minute florets (1–2 cm), granular, grey-silver;
   B. albiflora's heads open creamy white and fluffy. Stages: young heads (small, green-grey, tight), half grown, mature. Sold fresh or dried: natural silver or grey,
   green, and painted (silver, gold, copper red, old pink, white). Stems 40–60 cm, heads 1–2 cm ---------- */
const CW_L93BRU=[
 {id:'argent',n:'Argent (B. laevis séché)',c:'#b3b8b2',lf:'#8f978a'},
 {id:'gris',n:'Gris perle (B. laevis frais)',c:'#c6cac4',lf:'#7d8a72'},
 {id:'vert',n:'Vert (séché vert)',c:'#7f9a6b',lf:'#66794f'},
 {id:'vert-gris',n:'Vert-de-gris (B. noduliflora)',c:'#909f88',lf:'#6c7a5e'},
 {id:'brique',n:'Rouge brique (peint)',c:'#8b4b3b',lf:'#7d7a64',pt:1},
 {id:'vieux-rose',n:'Vieux rose (peint)',c:'#a5787a',lf:'#7d7a64',pt:1},
 {id:'or',n:'Or (peint)',c:'#c9a24a',lf:'#8a8460',pt:1,met:1},
 {id:'argent-metal',n:'Argent métallisé (peint)',c:'#d2d4d6',lf:'#9a9e98',pt:1,met:1},
 {id:'blanc',n:'Blanc crème (B. albiflora)',c:'#f1ede2',lf:'#7f8c6c',fl:1}];
/* a brunia head: its granular silhouette, its body, the florets as small bosses, its light (a crisp glint when painted metallic) */
function l93BruHead(par,c,r,col,o){const P=pal7(col),x=c[0],y=c[1],dt=DET>=1.5&&!LOD,ph=o.ph;
  E('path',{d:dt?l30Sc(x+r*.07,y-r*.09,r,o.fl?13:22,ph,o.fl?.11:.045):l30O(x+r*.07,y-r*.09,r),fill:toneAt(P,o.fl?.42:.24),stroke:shd(col,-.6),'stroke-width':.35,'stroke-opacity':.5},par);
  E('path',{d:dt?l30Sc(x-r*.05,y+r*.05,r*.83,o.fl?11:18,ph+.2,o.fl?.12:.05):l30O(x-r*.05,y+r*.05,r*.83),fill:toneAt(P,o.fl?.66:.52)},par);
  if(dt){let d='',e='';for(let i=0;i<o.nf;i++){const u=o.fd[i],q=[x+u[0]*r*.8,y+u[1]*r*.8],I=-(u[0]+u[1])*.7+u[2]*.4;const s=l30O(q[0],q[1],r*(o.fl?.16:.12)*(.55+.45*u[2]));if(I>.15)e+=s;else d+=s}
    if(d)E('path',{d,fill:toneAt(P,o.fl?.5:.3),opacity:.7},par);if(e)E('path',{d:e,fill:toneAt(P,o.fl?.92:.8),opacity:.75},par)}
  if(!LOD)E('path',{d:l30O(x-r*.32,y+r*.33,r*.34),fill:o.met?'#ffffff':toneAt(P,.92),opacity:o.met?.75:.3},par);
  if(o.met&&!LOD)E('path',{d:l30O(x-r*.38,y+r*.4,r*.12),fill:'#ffffff',opacity:.95},par)}
function l93Brunia(g,t,o){const cw=cwPick(CW_L93BRU,o),{op,st}=l93St(o),C=(o.cm||1.3)*UPC,dt=DET>=1.5,lf=cw.lf,sc=['#3a3628','#5a5540','#7a7560','#a6a088'];
  return bzShoot(g,t,o,{Lt:42*UPC,w0:4.4,w1:2,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Ltop=Math.min(L*.38,11*UPC),rb=C/2*(st===0?.58:st===1?.82:1),
      hc=st===0?mix(cw.pt?cw.c:'#8f9c82',cw.c,cw.pt?1:.35):st===1&&cw.fl?mix(cw.c,'#b8c0a8',.35):cw.c,heads=[];
    /* the top of the axis carries the oldest head */
    const top=A.at(1);heads.push({p:V3.add(top.p,V3.sc(top.T,rb*.78)),r:rb});
    /* the branchlets: spiralled round the top of the stem, the lower ones longer, curving up; some fork once; each ends in a head */
    const nb=dt?11:9;for(let i=0;i<nb;i++){const q=i/(nb-1),l=L-Ltop*(.08+.92*q)*R(.94,1.04);if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D,el=R(26,38)+q*12,len=(2.2+5*q)*UPC*R(.85,1.12),fk=q>.25&&rnd()<.6;
      const mods=[['F',{l:len*.4,w1:1.9}],...(fk?[['[',{w:1.6}],['/',{a:R(0,360)}],['&',{a:R(30,42)}],['F',{l:len*R(.32,.45),w1:1.4,e:.09}],['K',{}],[']',{}]]:[]),['F',{l:len*.6,w1:1.5}],['K',{}]];
      const res=bzGrow(A,l,az,el,mods,{w:2.3,seg:3,T:[0,1,0],e:.06,wig:.02});l93Twigs(items,res,[[1.85,'t0'],[1.55,'t1'],[0,'t2']]);
      for(const ch of res.chains)l93Needles(items,l93Cut(l93Res(ch.pts,dt?1.5:2.1),rb*.9),{k:dt?3:2,ang:.26,len:.4*UPC,r0:.4});
      for(const og of res.organs)heads.push({p:V3.add(og.pos,V3.sc(og.H,rb*.74)),r:rb*R(.86,1.02)})}
    /* the imbricate needles of the stem */
    const wood=mix(sc[2],lf,.35),nk=l93NdKeys(lf,mix(shd(lf,-.18),'#4a5040',.2));const tp=A.at(1).p;l93StemNd(parts,A,l0,{step:dt?1.5:2.1,k:dt?3:2,ang:.24,len:.45*UPC,r0:1,skip:p=>(o.spine&&p[1]<24)||V3l(V3s(p,tp))<rb*1.1},nk);
    l30Batch(parts,items,[...l30TwKeys([['t0',wood,1.9],['t1',wood,1.55],['t2',wood,1.2]]),...nk],dt?6:4);
    /* the heads, each its own part; the florets fixed once per head */
    for(const h of heads){const fd=[];for(let i=0;i<(cw.fl?18:40);i++){const z=R(.15,1),a=R(0,6.283),w=Math.sqrt(1-z*z);fd.push([w*Math.cos(a),w*Math.sin(a),z])}const ph=R(0,6.283),c=[h.p[0],h.p[1]];
      parts.push({z:h.p[2]+h.r*.3,fn:par=>l93BruHead(par,c,h.r,hc,{fl:cw.fl&&st===2,met:cw.met,fd,nf:fd.length,ph})})}}})}

/* ---------- berzelia (Berzelia lanuginosa, « button brunia »; B. galpinii): slender branches clothed in fine spreading needle leaves (3–6 mm), forking near their tips into clusters
   of small globose heads (4–6 mm) packed together like berries, cream with fluffy stamens in flower, green to lime before; B. galpinii's ripening receptacles turn red.
   Stages: tight green buttons, colouring, in flower. Sold fresh or dried, natural or dyed. Stems 40–60 cm ---------- */
const CW_L93BRZ=[
 {id:'vert',n:'Vert (B. lanuginosa)',c:'#8fae5b'},
 {id:'vert-jaune',n:'Vert-jaune (B. galpinii)',c:'#b7c35b'},
 {id:'or',n:'Jaune d’or (teint)',c:'#dab53c',dy:1},
 {id:'creme',n:'Crème (en fleur)',c:'#ece2c1',fl:1},
 {id:'blanc',n:'Blanc crème (blanchi)',c:'#f3f0e6',dy:1},
 {id:'rouge',n:'Rouge (B. galpinii, fructifié)',c:'#a73b3c'},
 {id:'vert-sec',n:'Vert olive (séché)',c:'#7d8a52'}];
function l93Berz(g,t,o){const cw=cwPick(CW_L93BRZ,o),{op,st}=l93St(o),C=(o.cm||.8)*UPC,dt=DET>=1.5,lf='#4e6634',sc=['#2e321e','#4a4e30','#6a6e48','#9a9c78'];
  return bzShoot(g,t,o,{Lt:40*UPC,w0:3.6,w1:1.6,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Ltop=Math.min(L*.45,14*UPC),rb=C/2*.62*(st===0?.75:st===1?.88:1);
    const bud=cw.dy?cw.c:mix('#8aa456',cw.c,.25),col=st===0?bud:st===1?mix(cw.c,bud,cw.dy?0:.35):cw.c,fl=st===2&&(cw.fl||cw.id==='blanc');
    /* a cluster of buttons round the end of a twig: one at its heart, the others packed round it (each touching it), more toward the light */
    const cluster=(og,n)=>{const ax=V3.nz(V3.add(og.H,[0,.7,0])),O=V3.add(og.pos,V3.sc(ax,rb*.95));l93Ball(items,O,rb,'k',{sc:fl?12:0,amp:.14});
      for(let m=0;m<n;m++){const u=R(-.35,1),a=R(0,6.283),w=Math.sqrt(1-u*u),X=V3.nz(V3.cr(ax,[0,0,1])),Y=V3.cr(ax,X),dir=V3.nz(V3.add(V3.sc(ax,u),V3.add(V3.sc(X,w*Math.cos(a)),V3.sc(Y,w*Math.sin(a)))));
        l93Ball(items,V3.add(O,V3.sc(dir,rb*R(1.05,1.55))),rb*R(.82,1.05),'k',{sc:fl?12:0,amp:.14})}};
    /* the forks: a twig parts into two or three, each ending in a cluster */
    const fork=(len,n)=>{const out=[['F',{l:len*.55,w1:1.25}]];for(let j=0;j<n;j++)out.push(['[',{w:1.15}],['/',{a:j*360/n+R(-25,25)}],['&',{a:R(22,36)}],['F',{l:len*R(.3,.45),w1:1.1,e:-.04}],['K',{}],[']',{}]);out.push(['F',{l:len*.22,w1:1.1}],['K',{}]);return out};
    const nb=dt?9:8;for(let i=0;i<nb;i++){const q=i/(nb-1),l=L-Ltop*(.08+.92*q)*R(.94,1.04);if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D,el=R(30,42)+q*14,len=(3+6*q)*UPC*R(.85,1.12);
      const res=bzGrow(A,l,az,el,[['F',{l:len*.5,w1:1.5}],...fork(len*.5,rnd()<.5?2:3)],{w:1.9,seg:3,T:[0,1,0],e:.08,wig:.03});l93Twigs(items,res,[[1.4,'t0'],[0,'t1']]);
      for(const ch of res.chains)l93Needles(items,l93Res(ch.pts,dt?1.7:2.4),{k:dt?3:2,ang:.6,len:.5*UPC,r0:.3});
      for(const og of res.organs)cluster(og,dt?10:7)}
    /* the top of the stem ends in clusters too */
    { const top=bzGrow(A,L-.5,0,3,fork(2.4*UPC,3),{w:1.6,seg:3,T:[0,1,0],e:.05,wig:.03});l93Twigs(items,top,[[1.4,'t0'],[0,'t1']]);for(const ch of top.chains)l93Needles(items,l93Res(ch.pts,dt?1.7:2.4),{k:dt?3:2,ang:.6,len:.5*UPC,r0:.3});for(const og of top.organs)cluster(og,dt?10:7)}
    const nk=l93NdKeys(lf,mix(lf,'#8a9a6a',.35));l93StemNd(parts,A,l0,{step:dt?1.7:2.4,k:dt?3:2,ang:.55,len:.55*UPC,r0:.9,skip:o.spine?(p=>p[1]<24):null},nk);
    const wood=mix(sc[1],'#6a5a40',.3),P=pal7(col);
    l30Batch(parts,items,[...l30TwKeys([['t0',wood,1.45],['t1',wood,1.15]]),...nk,...l93BallKeys('k',col,{rim:toneAt(P,.24),body:toneAt(P,fl?.72:.56),lo:fl?.7:.55})],dt?7:5)}})}

/* ---------- phylica (Phylica plumosa, « featherhead »; P. pubescens): an upright woody stem clothed in narrow hairy leaves, ending (and its few top shoots ending) in a head
   wrapped in long feathery bracts — narrow leaves covered in long silky golden hairs — that curve up and out round a woolly cream heart, soft as fur.
   Stages: young (the plumes held close, short), opening, full (spread, fluffy). Sold fresh (gold-green) or dried, natural, bleached ---------- */
const CW_L93PHY=[
 {id:'creme',n:'Crème doré (naturel)',c:'#efe4c8'},
 {id:'dore',n:'Doré (naturel)',c:'#d9bf8f'},
 {id:'caramel',n:'Caramel (séché)',c:'#cdb07a'},
 {id:'vert',n:'Vert doré (frais)',c:'#c9c48e',lf:'#6f7a50'},
 {id:'blanchi',n:'Blanchi ivoire',c:'#f5f0e4',lf:'#a8a690'}];
/* a plume: a narrow feather along a 3D curve, its two edges combed into hairs at sheet detail (zigzag of fine points pointing to its tip) */
function l93Plume(Q,hw,fr){const n=Q.length,S=Q.map(p=>[p[0],-p[1]]),Lf=[],Rt=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,tx=dx/l,ty=dy/l,v=i/(n-1),w=hw(v);
    Lf.push([S[i][0]+nx*w,S[i][1]+ny*w]);Rt.push([S[i][0]-nx*w,S[i][1]-ny*w]);
    if(fr&&i>0&&i<n-1){const w2=w*2+.9,sh=l*.7;Lf.push([S[i][0]+nx*w2+tx*sh,S[i][1]+ny*w2+ty*sh]);Rt.push([S[i][0]-nx*w2+tx*sh,S[i][1]-ny*w2+ty*sh])}}
  return l30Poly(Lf.concat(Rt.reverse()))}
function l93Phylica(g,t,o){const cw=cwPick(CW_L93PHY,o),{op,st}=l93St(o),C=(o.cm||3)*UPC,dt=DET>=1.5,lf=cw.lf||'#8a937a',sc=['#3a3426','#5c5440','#7e765e','#aaa28a'];
  return bzShoot(g,t,o,{Lt:40*UPC,w0:4.2,w1:2.2,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Rh=C*1.05,heads=[];
    const top=A.at(1);heads.push({p:top.p,ax:top.T,s:1});
    /* two to four top shoots, short, leafy, each ending in a younger head */
    const ns=o.spine?(rnd()<.5?2:3):4;for(let i=0;i<ns;i++){const l=L-C*R(1.1,1.6)*(1+.45*i);if(l<l0+8)continue;const az=(i*137.5+R(-20,20))*D,len=C*R(1,1.4)*(1-.15*i);
      const res=bzGrow(A,l,az,R(30,42),[['F',{l:len*.5,w1:1.9}],['F',{l:len*.5,w1:1.6}],['K',{}]],{w:2.4,seg:3,T:[0,1,0],e:.12,wig:.02});l93Twigs(items,res,[[1.8,'t0'],[0,'t1']]);
      for(const ch of res.chains)l93Needles(items,l93Res(ch.pts,dt?2:2.8),{k:2,ang:.6,len:1*UPC,r0:.4,w:1.4});for(const og of res.organs)heads.push({p:og.pos,ax:og.H,s:R(.68,.82)})}
    /* the stem's narrow hairy leaves, spreading, turning golden and feathery as they near the head */
    const nk=l93NdKeys(lf,mix(lf,'#c8c8b0',.4));l93StemNd(parts,A,l0,{step:dt?2:2.8,k:2,ang:.62,len:1.15*UPC,r0:1,w:1.5,skip:p=>(o.spine&&p[1]<24)||V3l(V3s(p,A.at(1).p))<Rh*.7},nk);
    const wood=mix(sc[2],lf,.3);l30Batch(parts,items,[...l30TwKeys([['t0',wood,1.8],['t1',wood,1.3]]),...nk],dt?6:4);
    /* the heads: the plumes in two whorls (the outer longer, more spread), each curving up at its tip; those behind the heart drawn before it */
    const P=pal7(cw.c),tn=[toneAt(P,.2),toneAt(P,.5),toneAt(P,.8)],ink=h2l(cw.c)[2]>.85?mix(cw.c,'#6f6450',.6):shd(cw.c,-.5),silk=mix(cw.c,'#ffffff',.55),heart=mix(cw.c,'#fbf6ea',.6);
    for(const h of heads){const r=Rh*h.s,ax=V3.nz(V3.add(V3.sc(h.ax,.6),[0,.4,0])),X=V3.nz(V3.cr(ax,[0,0,1])),Y=V3.cr(ax,X),O=V3.add(h.p,V3.sc(ax,r*.05)),n=dt?44:30,back=['','',''],front=['','',''],sk=[''],sf=[''];
      const sp=st===0?.35:st===1?.7:1,lk=st===0?.7:st===1?.88:1;
      for(let i=0;i<n;i++){const u=i/n,outer=i%3!==0,a=i*137.508*D+R(-.1,.1),r3=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),al=(outer?R(42,84):R(14,30))*sp*D,al1=al*.12,
          d0=V3.nz(V3.add(V3.sc(ax,Math.cos(al)),V3.sc(r3,Math.sin(al)))),d1=V3.nz(V3.add(V3.sc(ax,Math.cos(al1)),V3.sc(r3,Math.sin(al1)))),Lb=r*(outer?R(1.05,1.25):R(.8,.95))*lk,
          b=V3.add(O,V3.sc(r3,r*.1)),p1=V3.add(b,V3.sc(d0,Lb*.55)),p2=V3.add(p1,V3.sc(d1,Lb*.5)),Q=[];
        for(let j=0;j<=9;j++){const v=j/9,w0=(1-v)*(1-v),w1=2*v*(1-v),w2=v*v;Q.push([b[0]*w0+p1[0]*w1+p2[0]*w2,b[1]*w0+p1[1]*w1+p2[1]*w2,b[2]*w0+p1[2]*w1+p2[2]*w2])}
        const W=r*(outer?.085:.07),hw=v=>Math.max(.6,W*(v<.35?.45+.55*v/.35:1-.92*Math.pow((v-.35)/.65,1.4))),I=.5+.32*d0[2]+.22*(-d0[0]+d0[1]),tt=I>.62?2:I>.38?1:0,d=l93Plume(Q,hw,dt&&!LOD);
        const zm=Q[4][2];if(zm<O[2])back[tt]+=d;else{front[tt]+=d;if(dt&&tt>0)sk[0]+=l93Plume(Q.slice(1,8),v=>Math.max(.35,W*.28*(1-v)),false)}}
      const hc=V3.add(O,V3.sc(ax,r*.12)),hr=r*.3*(st===0?.7:1),cs=[hc[0],hc[1]],ph=R(0,6.283);
      const paint=(par,L3)=>L3.forEach((d,i)=>{if(d)E('path',{d,fill:tn[i],stroke:ink,'stroke-width':dt?.25:.2,'stroke-opacity':.4,'stroke-linejoin':'round'},par)});
      parts.push({z:h.p[2]+r*.2,fn:par=>{paint(par,back);E('path',{d:dt?l30Sc(cs[0],cs[1],hr,9,ph,.14):l30O(cs[0],cs[1],hr),fill:heart,stroke:shd(heart,-.35),'stroke-width':.3,'stroke-opacity':.5},par);
        paint(par,front);if(sk[0])E('path',{d:sk[0],fill:silk,opacity:.45},par)}})}}})}

/* ---------- stoebe (Stoebe plumosa, « slangbos »; sold stabilised): a slender grey stem branching again and again into a cloud of fine wiry twigs, all densely clothed in minute
   woolly needle leaves (1–3 mm), soft and misty like a heath; tiny heads hidden in their tips. Sold stabilised, natural silver-grey or dyed (lime, pink, sky blue, aubergine, rust).
   Stages: a young, compact spray; filling out; full and airy ---------- */
const CW_L93STO=[
 {id:'naturel',n:'Naturel gris argent (stabilisé)',c:'#a9aca2'},
 {id:'vert',n:'Vert anis (teint)',c:'#b4c45a'},
 {id:'rose',n:'Rose poudré (teint)',c:'#d9aeb0'},
 {id:'bleu',n:'Bleu ciel (teint)',c:'#a9bccc'},
 {id:'aubergine',n:'Aubergine (teint)',c:'#6e3a55'},
 {id:'rouille',n:'Rouille (teint)',c:'#b8643f'},
 {id:'blanc',n:'Blanchi (stabilisé)',c:'#ebe8df'}];
function l93Stoebe(g,t,o){const cw=cwPick(CW_L93STO,o),{op,st}=l93St(o),C=(o.cm||10)*UPC,dt=DET>=1.5,c=cw.c,P=pal7(c),sc=[shd(c,-.62),shd(c,-.42),shd(c,-.25),shd(c,-.05)];
  return bzShoot(g,t,o,{Lt:38*UPC,w0:3,w1:1.3,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Lb=Math.min(L*.62,C*2.3),sp=st===0?.75:st===1?.88:1;
    /* a branch is a feather: a rachis carrying short twigs alternately along it, the lower ones longest, each perhaps forking once; all bend softly toward the light */
    const fe=(len,ns)=>{const out=[];for(let j=0;j<ns;j++){const q=j/ns,tl=len*(.26-.16*q)*R(.8,1.2);out.push(['F',{l:len/ns*R(.85,1.15),w1:1.35-.2*q}],['[',{w:1.15}],['/',{a:j*180+R(-35,35)}],['&',{a:R(38,58)*sp}],['F',{l:tl*.55,w1:1.12,e:.12}]);
        if(rnd()<.45)out.push(['[',{w:1.1}],['+',{a:R(25,40)}],['F',{l:tl*.4,w1:1.1,e:.12}],[']',{}]);out.push(['F',{l:tl*.45,w1:1.1,e:.15}],[']',{}])}out.push(['F',{l:len*.08,w1:1.1}]);return out};
    const nb=dt?15:12;for(let i=0;i<nb;i++){const q=i/(nb-1),l=L-Lb*(.03+.97*q)*R(.95,1.03);if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D,el=(R(34,50)+q*14)*sp,len=C*(.38+.5*Math.sin(Math.PI*Math.min(1,q*1.1+.15)))*R(.85,1.12)*(.8+.2*sp);
      const res=bzGrow(A,l,az,el,fe(len,Math.max(4,Math.round(len/(dt?5:6)))),{w:1.5,seg:2.4,T:[0,1,0],e:.06,wig:.05});l93Twigs(items,res,[[1.25,'f0'],[0,'f1']],{run:5});
      for(const ch of res.chains)l93Needles(items,l93Res(ch.pts,dt?1.5:2.3),{k:2,ang:1,len:.42*UPC,r0:.2,w:1.1})}
    { const top=bzGrow(A,L-.4,0,3,fe(C*.4,6),{w:1.3,seg:2.4,T:[0,1,0],e:.03,wig:.05});l93Twigs(items,top,[[1.25,'f0'],[0,'f1']],{run:5});for(const ch of top.chains)l93Needles(items,l93Res(ch.pts,dt?1.5:2.3),{k:2,ang:1,len:.42*UPC,r0:.2,w:1.1})}
    /* the foliage: a fine woolly tube round every twig (shade, its lit side), the needles bristling out of it */
    const fd=h2l(c)[2]>.8?mix(c,'#7a7468',.42):toneAt(P,.26),fm=toneAt(P,.55),fl=toneAt(P,.8),fk=(k,cl,w,tr)=>[k,Object.assign({fill:'none',stroke:cl,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'},tr?{transform:tr}:{})];
    const keys=[['nd',{fill:fd}],fk('f0',fd,1.9),fk('f1',fd,1.5),fk('f0',fm,1.2,'translate(-.25,-.3)'),['nu',{fill:mix(fm,fl,.5),stroke:shd(c,-.35),'stroke-width':dt?.12:0,'stroke-opacity':.4}]];
    l93StemNd(parts,A,l0,{step:dt?1.5:2.3,k:dt?3:2,ang:.7,len:.28*UPC,r0:.8,w:1.15,skip:o.spine?(p=>p[1]<24):null},[['nd',{fill:fd}],['nu',{fill:fm,stroke:shd(c,-.35),'stroke-width':dt?.12:0,'stroke-opacity':.45}]]);
    l30Batch(parts,items,keys,dt?7:5)}})}

/* ---------- stirlingia (Stirlingia latifolia, « blueboy », Western Australia): leafless when cut, a fine stiff grey stem branching repeatedly at its top into thin wiry stalks,
   each ending in a small rounded woolly head (6–12 mm) of hairy flowers, grouped in loose umbels. Sold dried: natural (grey-brown, the heads silvery-fawn), bleached, dyed
   (blue, pink, red, green). Stages: tight young heads, half woolly, full fluffy ---------- */
const CW_L93STI=[
 {id:'naturel',n:'Naturel brun-gris',c:'#8f8270',hd:'#b9ad98'},
 {id:'bleu',n:'Bleu (teint)',c:'#5a72a8'},
 {id:'rose',n:'Rose (teint)',c:'#e0a0b4'},
 {id:'rouge',n:'Rouge (teint)',c:'#b23a40'},
 {id:'blanchi',n:'Blanchi',c:'#efece4'},
 {id:'vert',n:'Vert (teint)',c:'#6f8a4a'},
 {id:'violet',n:'Violet (teint)',c:'#6c4a86'}];
function l93Stirl(g,t,o){const cw=cwPick(CW_L93STI,o),{op,st}=l93St(o),C=(o.cm||25)*UPC,dt=DET>=1.5,hc=cw.hd||cw.c,stc=cw.hd?cw.c:mix(cw.c,'#8a8070',.25),sc=[shd(stc,-.55),shd(stc,-.32),stc,shd(stc,.3)];
  return bzShoot(g,t,o,{Lt:46*UPC,w0:2.8,w1:1.3,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],Lp=Math.min(L*.5,C*.55),rh=(.36+.06*R(-1,1))*UPC*(st===0?.62:st===1?.82:1);
    /* an umbel: a stalk parts into three to five rays, each perhaps parting again; every ray ends in a head */
    const umb=(len,lv)=>{const out=[['F',{l:len*.5,w1:lv?1.15:1.3}]],n=lv?3:4;for(let j=0;j<n;j++){out.push(['[',{w:1.15}],['/',{a:j*360/n+R(-30,30)}],['&',{a:R(22,38)}]);if(lv<1&&rnd()<.6)out.push(...umb(len*R(.5,.65),lv+1));else out.push(['F',{l:len*R(.35,.55),w1:1.1,e:-.02}],['K',{}]);out.push([']',{}])}
      out.push(['F',{l:len*.18,w1:1.1}],['K',{}]);return out};
    const nb=dt?7:6;for(let i=0;i<nb;i++){const q=i/(nb-1),l=L-Lp*(.06+.94*q)*R(.94,1.04);if(l<l0+6)continue;const az=(i*137.5+R(-15,15))*D,el=R(22,34)+q*10,len=C*(.12+.2*q)*R(.85,1.15);
      const res=bzGrow(A,l,az,el,umb(len,0),{w:1.5,seg:3,T:[0,1,0],e:.05,wig:.04});l93Twigs(items,res,[[1.22,'t0'],[0,'t1']]);for(const og of res.organs)l93Ball(items,V3.add(og.pos,V3.sc(og.H,rh*.8)),rh*R(.85,1.08),'h',{fz:st===0?0:DET>=1.5?34:18,amp:st===2?.13:.09})}
    { const top=bzGrow(A,L-.4,0,3,umb(C*.08,1),{w:1.3,seg:3,T:[0,1,0],e:.04,wig:.04});l93Twigs(items,top,[[1.22,'t0'],[0,'t1']]);for(const og of top.organs)l93Ball(items,V3.add(og.pos,V3.sc(og.H,rh*.8)),rh,'h',{fz:st===0?0:DET>=1.5?34:18,amp:st===2?.13:.09})}
    const P=pal7(hc),stk=mix(sc[1],sc[2],.4);
    l30Batch(parts,items,[...l30TwKeys([['t0',stk,1.25],['t1',stk,1.1]]),...l93BallKeys('h',hc,{rim:toneAt(P,.3),body:toneAt(P,.62),lo:.35})],dt?6:4)}})}

/* ---------- registers ---------- */
Object.assign(GH,{'brunia':l93Brunia,'berzelia':l93Berz,'phylica':l93Phylica,'stoebe':l93Stoebe,'stirlingia':l93Stirl});
Object.assign(CWS,{'brunia':CW_L93BRU,'berzelia':CW_L93BRZ,'phylica':CW_L93PHY,'stoebe':CW_L93STO,'stirlingia':CW_L93STI});
Object.assign(SZG,{'brunia':[1,1.3,1.5,1.5,2],'berzelia':[.6,.8,.8,1],'phylica':[2.5,3,3,3.5,4],'stoebe':[8,10,10,12],'stirlingia':[20,25,25,30]});
Object.assign(GHI,{'brunia':{form:'baie',size:1.3,k:'plant',rk:.9,tip:.85},'berzelia':{form:'baie',size:1.2,k:'plant',rk:.9,tip:.85},'phylica':{form:'grappe',size:1.3,k:'plant',rk:.9,tip:.85},
 'stoebe':{form:'nuage',size:1.2,k:'plant',rk:.5,tip:.85},'stirlingia':{form:'nuage',size:1.2,k:'plant',rk:.45,tip:.85}});
