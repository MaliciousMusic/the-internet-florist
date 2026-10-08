/* ================= Serre, lot 28 — gousses, capsules et matières, poussées par le L-système : baptisia, pavot, nigelle, mousse espagnole, branche lichénée ================= */
/* ---------- shared: a body of revolution along the axis B[2] from O (view space, y up): a capsule, a pod. rf(t) its radius (t 0 → 1 up the axis), nl lobes of depth lob
   (rounded bulges, sharp grooves), squashed across by sq. Its back gores in one path give the silhouette; its front gores, in bands, are toned each by its own facing (matte: ct
   narrows the range), far to near; mer: meridian lines (stripes, sutures) on the visible side only. Returns V(t,a) and the normal nrm(t,a) for what crowns it ---------- */
function gsRev(par,B,O,Hh,rf,col,o={}){const dt=DET>=1.5,ng=o.ng||(dt?16:10),nb=LOD?1:o.nb||(dt?7:4),ns=2,nl=o.nl||0,lob=o.lob||0,sq=o.sq||1,ph=o.ph||0,P=o.pal||pal7(col),ct=o.ct??.8,TW=6.28319;
  const lf=a=>nl?1-lob*(1-Math.pow(Math.abs(Math.cos(nl*(a-ph)/2)),.6)):1,loc=(t,a)=>{const r=rf(t)*lf(a);return[Math.cos(a)*r,Math.sin(a)*r*sq,t*Hh]},V=(t,a)=>V3.add(toV(B,loc(t,a)),O),
    nrm=(t,a)=>{const e=.004,da=V3s(V(t,a+e),V(t,a-e)),dv=V3s(V(Math.min(1,t+e),a),V(Math.max(0,t-e),a));let n=V3.cr(da,dv);if(V3l(n)<1e-9)n=toV(B,[0,0,t<.5?-1:1]);n=V3.nz(n);
      const rd=toV(B,[Math.cos(a),Math.sin(a)*sq,0]);if(V3.dot(n,rd)<0)n=V3.sc(n,-1);return n};
  const K=nb*ns,S=[];for(let k=0;k<=K;k++){const t=k/K,row=[];for(let j=0;j<=ng;j++)row.push(V(t,j/ng*TW));S.push(row)}
  const g=G(par),sc=v=>f(v[0])+','+f(-v[1]);let back='';const Q=[];
  for(let b=0;b<nb;b++)for(let j=0;j<ng;j++){const tm=(b+.5)/nb,am=(j+.5)/ng*TW,n=nrm(tm,am),poly=[];for(let k=b*ns;k<=(b+1)*ns;k++)poly.push(S[k][j]);for(let k=(b+1)*ns;k>=b*ns;k--)poly.push(S[k][j+1]);
    if(n[2]<.02){/* wound the same way, so that their union is the silhouette */const q=poly.map(v=>[v[0],-v[1]]);if(sArea(q)<0)q.reverse();back+=pD(q)+'Z';continue}
    const d='M'+poly.map(sc).join('L')+'Z';let I=.6+(lightI(n)-.6)*ct;if(!dt)I=Math.round(I*24)/24;Q.push({z:V(tm,am)[2],d,c:toneAt(P,o.ao?I*o.ao(tm,am):I)})}
  /* at the app's detail the body is one smooth fill, lit from the upper left (a shared gradient per palette), its ribs and stripes drawn over it */
  if(!dt&&!LOD){let all='';for(let b=0;b<nb;b++)for(let j=0;j<ng;j++){const q=[];for(let k=b*ns;k<=(b+1)*ns;k++)q.push([S[k][j][0],-S[k][j][1]]);for(let k=(b+1)*ns;k>=b*ns;k--)q.push([S[k][j+1][0],-S[k][j+1][1]]);if(sArea(q)<0)q.reverse();all+=pD(q)+'Z'}
    const hp=[];for(const r of S)for(const v of r)hp.push([v[0],-v[1]]);E('path',{d:all,fill:gsFill(P,ct)},g);E('path',{d:smooth(hull2(hp)),fill:'none',stroke:o.ink||P.ink,'stroke-width':f(o.sw||.5),'stroke-opacity':.5},g);Q.length=0;back=null}
  /* the back gores hold the silhouette (each wound the same way: their union), the ink on its outer edge only, the front gores cover the rest */
  if(back!==null)E('path',{d:back||'M0,0',fill:toneAt(P,.3),stroke:o.ink||P.ink,'stroke-width':f(o.sw||.5),'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  Q.sort((a,b)=>a.z-b.z);if(dt||!o.merge)for(const q of Q)E('path',{d:q.d,fill:q.c,stroke:q.c,'stroke-width':.3,'stroke-linejoin':'round'},g);
  else{/* app detail: gores of nearly the same tone share one path */const by=new Map();for(const q of Q){const key=q.c;by.set(key,(by.get(key)||'')+q.d)}for(const[c,d]of by)E('path',{d,fill:c,stroke:c,'stroke-width':.3,'stroke-linejoin':'round'},g)}
  if(o.mer&&!LOD){const by=new Map();for(const m of o.mer){let d='',on=false;const t0=m.t0??.04,t1=m.t1??.96,n=dt?14:9;
      for(let i=0;i<=n;i++){const t=t0+(t1-t0)*i/n,a=m.a+(m.tw||0)*t,vis=nrm(t,a)[2]>.08;if(vis){const v=V(t,a);d+=(on?'L':'M')+sc(v)}on=vis}
      if(d){const key=m.c+'|'+f(m.w)+'|'+(m.op??.8);by.set(key,(by.get(key)||'')+d)}}
    for(const[key,d]of by){const[c,w,op]=key.split('|');E('path',{d,fill:'none',stroke:c,'stroke-width':w,'stroke-opacity':op,'stroke-linecap':'round','stroke-linejoin':'round'},g)}}
  if(o.hl&&!LOD){let best=null,bd=-1;for(let k=1;k<K;k++)for(let j=0;j<ng;j++){const t=k/K,a=j/ng*TW,n=nrm(t,a);if(n[2]<.1)continue;const d=V3.dot(n,HV3);if(d>bd){bd=d;best=[t,a]}}
    if(best){const v=V(best[0],best[1]),r=rf(best[0])*.16;E('ellipse',{cx:f(v[0]),cy:f(-v[1]),rx:f(r),ry:f(r*.62),fill:'#ffffff',opacity:f(o.hl*Math.max(0,bd)),transform:`rotate(${f(-Math.atan2(toV(B,[0,0,1])[1],toV(B,[0,0,1])[0])/D)} ${f(v[0])} ${f(-v[1])})`},g)}}
  return{g,V,nrm,P}}
/* a matte body's fill at the app's detail: one radial gradient per palette, lit from the upper left */
const GSF={};function gsFill(P,ct=.8){const key=P.b+P.l1+P.d1+f(ct);const id=GSF[key];if(id&&document.getElementById(id))return`url(#${id})`;const nid='gs'+(gid++),gr=E('radialGradient',{id:nid,cx:.4,cy:.36,r:.7,fx:.32,fy:.28},defs),I=x=>toneAt(P,.6+(x-.6)*Math.max(ct,.95));
  stops(gr,[[0,I(.98)],[.35,I(.72)],[.7,I(.5)],[1,I(.26)]]);GSF[key]=nid;return`url(#${nid})`}
/* the stem tones of a colour (dark → light), as the L-system axes want them */
/* the frame of a capsule crowning its stem: its axis up the stem (B.upV), leaning a little toward where the head looks (B[2]); on a sheet the view's height tilts its top toward the eye or away */
const gsCapF=(B,lean=.3)=>{const u=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],el=B.reach?0:B[2][1]*.75;return spFrame(V3.nz(V3.add(V3.add(u,V3.sc(B[2],lean)),[0,0,el])),B[2],R(0,6.283))};
/* a smooth profile through its points (Catmull-Rom tangents: no flat steps at the knots) */
const gsProf=P=>{const n=P.length,m=P.map((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)];return(b[1]-a[1])/((b[0]-a[0])||1)});
  return t=>{t=Math.max(0,Math.min(1,t));let i=1;while(i<n-1&&P[i][0]<t)i++;const a=P[i-1],b=P[i],h=b[0]-a[0]||1,u=(t-a[0])/h,u2=u*u,u3=u2*u;return(2*u3-3*u2+1)*a[1]+(u3-2*u2+u)*h*m[i-1]+(-2*u3+3*u2)*b[1]+(u3-u2)*h*m[i]}};
const gsCols=c=>[shd(c,-.62),shd(c,-.3),c,shd(c,.32)];
/* a matte palette whose lights go to a powdery bloom (baptisia pods, the glaucous poppy) */
const gsBloom=(c,bl,k=.4)=>{const P=pal7(c);return Object.assign({},P,{l1:mix(P.l1,bl,k),l2:mix(P.l2,bl,k*1.2),b:mix(c,bl,k*.25)})};

/* ---------- pavot (Papaver somniferum, P. setigerum): the capsule is a glabrous urn, 2–5 cm, glaucous blue-green when fresh, drying to straw-gold; faint ribs run up to the stigmatic
   disc that caps it, a flat lid of 8–12 (up to 16) radiating stigmatic rays whose ends make the scalloped margin overhanging the neck; it sits on a small swollen receptacle at the top of
   a long, stiff, glaucous stem; dried, a ring of pores opens under the disc. Sold fresh (green, glaucous), dried natural, bleached, or painted (black, gold, pink…) ---------- */
const CW_PAV=[{id:'glauque',n:'Vert glauque (frais)',c:'#8fa79a',dk:'#6f6a88',ry:'#4e4766',sc:'#7f9a84',bl:'#c8d6d4'},
  {id:'vert',n:'Vert (frais)',c:'#6f8a48',dk:'#6c6478',ry:'#4a4256',sc:'#6f8a52',bl:'#b8c8a8'},
  {id:'vert-tendre',n:'Vert tendre (setigerum)',c:'#b6c79a',dk:'#8a8296',ry:'#5e566e',sc:'#8faa82',bl:'#dce6d0'},
  {id:'naturel',n:'Naturel séché',c:'#bdb39b',dk:'#7a6a50',ry:'#4e3e2a',sc:'#a89a7a',dry:1,g:'#8fa79a'},
  {id:'dore',n:'Brun doré séché',c:'#a8844e',dk:'#6a4c2c',ry:'#3e2a16',sc:'#9a8058',dry:1,g:'#8fa79a'},
  {id:'blanchi',n:'Blanchi',c:'#ece6d6',dk:'#d6ccb6',ry:'#b0a488',sc:'#e2dccc',dry:1},
  {id:'noir',n:'Teinté noir',c:'#2a282b',dk:'#222023',ry:'#121113',sc:'#2e2c2e',dry:1,paint:1},
  {id:'or',n:'Peint or',c:'#c9a24a',dk:'#a8843a',ry:'#7a5e22',sc:'#b8923e',dry:1,paint:1,hl:.55},
  {id:'rose',n:'Teinté rose',c:'#e2b8c5',dk:'#c48e9e',ry:'#9a6474',sc:'#d8aab8',dry:1,paint:1},
  {id:'lilas',n:'Teinté lilas',c:'#beb0d6',dk:'#9c8cba',ry:'#6e5e8e',sc:'#b0a2c8',dry:1,paint:1},
  {id:'orange',n:'Teinté orange',c:'#df8a3d',dk:'#b8682a',ry:'#7e4216',sc:'#d07e38',dry:1,paint:1}];
const PAV_PR=gsProf([[0,.2],[.07,.52],[.2,.84],[.42,1],[.64,.97],[.8,.84],[.92,.66],[1,.56]]);
/* the capsule at O along B[2]: D its height; m its ripeness (0 young, 1 ripe) */
function pvCap(par,B,O,D,cw,m){const dt=DET>=1.5,k=G(par),Rm=D*.46,Hh=D*.88,ax=toV(B,[0,0,1]),az=ax[2],nr=dt?11:8,ph=R(0,1),rd=Rm*.66,
    col=cw.g&&m<.85?mix(cw.g,cw.c,Math.max(0,(m-.25)/.6)):!cw.dry&&m<.5?mix(cw.c,'#8aa86a',.35*(1-m/.5)):cw.c,P=cw.paint?pal7(col):gsBloom(col,cw.bl||mix(col,'#e8e6e0',.5),cw.dry?.25:.45),
    dk=cw.g&&m<.85?mix('#6f6a88',cw.dk,Math.max(0,(m-.25)/.6)):cw.dk,ry=cw.ry,ink=shd(col,-.75);
  /* the receptacle: a small swollen ring under the capsule */
  const ring=[];for(let j=0;j<12;j++){const a=j/12*6.283;for(const z of[-D*.05,D*.03]){const v=V3.add(toV(B,[Math.cos(a)*Rm*(z<0?.2:.3),Math.sin(a)*Rm*(z<0?.2:.3),z]),O);ring.push([v[0],-v[1]])}}
  E('path',{d:smooth(hull2(ring)),fill:toneAt(pal7(cw.sc||col),.42),stroke:ink,'stroke-width':.35,'stroke-opacity':.5},k);
  /* the disc: rays from a raised centre to the lobes of its margin, which overhangs the neck */
  const disc=()=>{const n=nr*6,mg=[],cz=Hh+D*.07,top=az>=0;for(let i=0;i<n;i++){const a=i/n*6.283+ph,lb=Math.pow(Math.abs(Math.cos(nr*(a-ph)/2)),.45),rr=rd*(.84+.16*lb),v=V3.add(toV(B,[Math.cos(a)*rr,Math.sin(a)*rr,Hh-D*.02*lb]),O);mg.push([v[0],-v[1]])}
    const PD=pal7(dk),c0=V3.add(toV(B,[0,0,cz]),O);E('path',{d:smooth(mg),fill:top?toneAt(PD,lightI(ax)):toneAt(PD,.28),stroke:shd(dk,-.6),'stroke-width':.4,'stroke-opacity':.6,'stroke-linejoin':'round'},k);
    if(!top||LOD)return;let d='',dl='';for(let j=0;j<nr;j++){const a=j/nr*6.283+ph,e=V3.add(toV(B,[Math.cos(a)*rd*.97,Math.sin(a)*rd*.97,Hh-D*.015]),O),m1=V3.add(toV(B,[Math.cos(a)*rd*.5,Math.sin(a)*rd*.5,Hh+D*.035]),O);
      d+=`M${f(c0[0])},${f(-c0[1])}Q${f(m1[0])},${f(-m1[1])} ${f(e[0])},${f(-e[1])}`;if(dt){const s=toV(B,[-Math.sin(a)*rd*.04,Math.cos(a)*rd*.04,0]);dl+=`M${f(c0[0]+s[0])},${f(-c0[1]-s[1])}Q${f(m1[0]+s[0])},${f(-m1[1]-s[1])} ${f(e[0]+s[0])},${f(-e[1]-s[1])}`}}
    E('path',{d,fill:'none',stroke:ry,'stroke-width':f(Math.max(.5,rd*.11)),'stroke-linecap':'round','stroke-opacity':.9},k);if(dl)E('path',{d:dl,fill:'none',stroke:shd(dk,.45),'stroke-width':f(Math.max(.3,rd*.035)),'stroke-linecap':'round','stroke-opacity':.7},k);
    E('circle',{cx:f(c0[0]),cy:f(-c0[1]),r:f(rd*.09),fill:ry},k)};
  if(az<0)disc();
  const body=gsRev(k,B,O,Hh,t=>Rm*PAV_PR(t),col,{nl:nr,lob:.035,ph,ng:dt?nr*2:nr*2,pal:P,ct:.7,ink,hl:cw.hl||(cw.dry?0:.12),merge:1,
    mer:Array.from({length:nr},(_,j)=>({a:j/nr*6.283+ph,c:shd(col,dt?-.18:-.3),w:dt?.35:.4,op:dt?.45:.5,t0:.12,t1:.9}))});
  /* dried: the pores, little dark windows under the disc between the rays */
  if(cw.dry&&m>.8&&!LOD){let d='';for(let j=0;j<nr;j++){const a=(j+.5)/nr*6.283+ph;if(body.nrm(.95,a)[2]<.25)continue;const v=body.V(.955,a),s=Rm*.05;d+=`M${f(v[0]-s)},${f(-v[1])}a${f(s)},${f(s*.7)} 0 1,0 ${f(2*s)},0a${f(s)},${f(s*.7)} 0 1,0 ${f(-2*s)},0`}
    if(d)E('path',{d,fill:shd(col,-.7),opacity:.75},k)}
  if(az>=0)disc();return k}
function pavPlant(g,t,o){const cw=cwPick(CW_PAV,o),op=Math.max(.05,Math.min(1,o.op??1)),m=cw.dry?Math.max(.9,op):op,D0=(o.cm||4)*UPC,sc=gsCols(cw.sc),k=G(g),
    sz=cw.dry?.88+.12*op:.62+.38*op,cap=(par,B,O,D,mm)=>pvCap(par,B,O,D,cw,mm);
  /* in a bouquet line (a model may ask for one) the stem follows its spine and the capsule crowns it */
  if(o.spine){const parts=[],A=spAxis(o,blen(o.spine),{face:R(-.5,.5)}),f1=A.at(1),w=Math.max(2,D0*.1),Bf=spFrame(f1.T,f1.Fr,R(0,6.283));spStem(A,parts,[0,.3,.6,.85,1],w*1.25,w,sc);
    parts.push({z:f1.p[2]+.5,fn:par=>cap(par,Bf,f1.p,D0*sz,m)});drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w*1.25,bc:sc}}
  /* a stiff stem: a node or two below the capsule, sometimes a side shoot with a younger capsule (branched stems); dried stems are sold leafless */
  const r=lsHeadS(k,o,{D:D0,w:Math.max(2,D0*.1),cols:sc,op,rr:.4,axisFirst:true,nodes:1,li:2.2,lp:3.2,aimK:.03,opp:0,side:{p:.35,n:1,top:1,len:1.6,ang:24,age:[.3,.8]},budD:.5,budMax:.01,wig:.012,e:.006,
    flower:(par,B,O,D2,op2)=>cap(par,gsCapF(B,.28),O,D2*sz,m),bud:(par,B,O,s,a)=>cap(par,B,O,s*1.6,Math.min(m,.3+a*.4)),young:(par,B,O,s,a)=>cap(par,B,O,D0*sz*(.55+.3*a),Math.min(m,.4+.5*a)),
    node:(og,pos)=>({z:pos[2]+.1,cast:false,fn:par=>E('ellipse',{cx:f(pos[0]),cy:f(-pos[1]),rx:f(Math.max(1,D0*.05)),ry:f(Math.max(.6,D0*.03)),fill:sc[1],opacity:.8},par)})});
  open(k,t,1000,4,.3);return r}

/* ---------- nigelle (Nigella damascena; N. orientalis): the capsule is an inflated balloon of five united follicles (2–3.5 cm), its lobes rounded between sharp grooves, streaked
   lengthwise with purple on green ('Miss Jekyll', 'Albion Black Pod' nearly black); the five styles persist as slender horns at its top; under it the involucre of finely cut, thread-like
   bracts (« cheveux de Vénus ») makes a lacy ruff. The stem carries feathery, finely divided leaves and branches with younger capsules. N. orientalis 'Transformer' has no ruff: its
   follicles are free above, each with a long spreading beak ---------- */
const CW_NIG=[{id:'vert-pourpre',n:'Vert rayé pourpre (frais)',c:'#9fb57c',st:'#6b2c3c',br:'#7f9a58'},
  {id:'olive',n:'Vert olive rayé (mûrissant)',c:'#6b7040',st:'#4a2030',br:'#6a7040'},
  {id:'pourpre',n:'Pourpre noir (Albion Black Pod)',c:'#4f2a3d',st:'#2e1422',br:'#5a6a3a'},
  {id:'vert',n:'Vert (Albion Green Pod)',c:'#a8be84',st:'#8aa060',br:'#82a05a'},
  {id:'beige',n:'Beige séché',c:'#cdbd98',st:'#9c8664',br:'#bfae88',dry:1},
  {id:'brun',n:'Brun séché',c:'#857256',st:'#5a4632',br:'#8a7a5c',dry:1},
  {id:'blanchi',n:'Blanchi',c:'#efe9dc',st:'#d6ccba',br:'#e4ddcc',dry:1},
  {id:'noir',n:'Teinté noir',c:'#2b2427',st:'#1a1517',br:'#2b2427',dry:1},
  {id:'transformer',n:'N. orientalis (Transformer)',c:'#c4b45e',st:'#8a7a3a',br:null,f:'or'}];
const NIG_PR=gsProf([[0,.36],[.1,.7],[.3,.95],[.5,1],[.7,.9],[.86,.62],[1,.24]]),NIG_OR=gsProf([[0,.5],[.15,.9],[.35,1],[.6,.78],[.85,.42],[1,.18]]);
function ngCap(par,B,O,D,cw,m){const dt=DET>=1.5,k=G(par),or=cw.f==='or',Rm=D*(or?.4:.43),Hh=D*(or?.8:.92),ph=R(0,1.2),ax=toV(B,[0,0,1]),
    col=cw.dry||or?cw.c:mix(cw.c,'#a8c080',.35*(1-m)),P=pal7(col),ink=shd(col,-.75),rad=a=>toV(B,[Math.cos(a),Math.sin(a),0]),Lh=D*(or?.62:.48)*(.7+.3*m);
  /* the horns: each style leaves the top of its follicle, rising, then spreading and curling out (Transformer: long beaks spread nearly flat) */
  const horns=[[],[]];for(let i=0;i<5;i++){const a=i/5*6.283+ph,r0=Rm*(or?.62:.2),p0=V3.add(toV(B,[Math.cos(a)*r0,Math.sin(a)*r0,Hh*(or?.86:.98)]),O),
      d1=V3.nz(V3.add(V3.sc(ax,or?.35:.9),V3.sc(rad(a),or?.95:.32))),p1=V3.add(p0,V3.sc(d1,Lh*.55)),d2=V3.nz(V3.add(V3.sc(ax,or?-.05:.45),V3.sc(rad(a+R(-.2,.2)),or?1:.85))),p2=V3.add(p1,V3.sc(d2,Lh*.5));
    horns[rad(a)[2]>=0?1:0].push([p0,p1,p2])}
  const hc=or?shd(col,-.1):mix(col,cw.dry?shd(col,-.2):'#6a8a4a',.4),bract=front=>{if(or||!cw.br||LOD)return;const n=dt?24:16,base=Rm*.55;let d='';
    for(let i=0;i<n;i++){const a=i/n*6.283+ph*1.7+R(-.1,.1),rd=rad(a);if((rd[2]>=0)!==front)continue;const el=R(-.25,.75),L0=D*R(.55,.85),p0=V3.add(toV(B,[Math.cos(a)*base,Math.sin(a)*base,Hh*.06]),O),
      d1=V3.nz(V3.add(V3.sc(rd,Math.cos(el)),V3.sc(ax,Math.sin(el)))),p1=V3.add(p0,V3.sc(d1,L0*.5)),d2=V3.nz(V3.add(d1,V3.sc(ax,R(.5,1.1)))),p2=V3.add(p1,V3.sc(d2,L0*.5)),s=v=>`${f(v[0])},${f(-v[1])}`;
      d+=`M${s(p0)}Q${s(p1)} ${s(p2)}`;for(const q of dt?[.45,.7]:[.6]){const b=V3.add(V3.add(V3.sc(p0,(1-q)*(1-q)),V3.sc(p1,2*(1-q)*q)),V3.sc(p2,q*q)),e=V3.add(b,V3.sc(V3.nz(V3.add(d2,V3.sc(rd,rnd()<.5?.8:-.4))),L0*.22));d+=`M${s(b)}L${s(e)}`}}
    if(d)E('path',{d,fill:'none',stroke:front?cw.br:shd(cw.br,-.25),'stroke-width':f(dt?.5:.5),'stroke-linecap':'round','stroke-opacity':.9},k)};
  /* each horn one curved stroke, thick at its foot, fine at its tip (two strokes over each other) */
  const hornD=(L2,c)=>{if(!L2.length)return;const s2=v=>`${f(v[0])},${f(-v[1])}`;let d='',d2='';for(const[p0,p1,p2]of L2){d+=`M${s2(p0)}Q${s2(p1)} ${s2(p2)}`;const m=V3.add(V3.sc(p0,.25),V3.add(V3.sc(p1,.5),V3.sc(p2,.25)));d2+=`M${s2(p0)}Q${s2(V3.add(V3.sc(p0,.5),V3.sc(p1,.5)))} ${s2(m)}`}
    E('path',{d,fill:'none',stroke:c,'stroke-width':f(Math.max(.6,D*.028)),'stroke-linecap':'round'},k);E('path',{d:d2,fill:'none',stroke:c,'stroke-width':f(Math.max(.9,D*.05)),'stroke-linecap':'round'},k)};
  bract(false);hornD(horns[0],shd(hc,-.25));
  /* the stripes: two or three per follicle, along it, wavering a little */
  const mer=[];if(!or&&!LOD)for(let i=0;i<5;i++){const a0=i/5*6.283+ph;for(const da of dt?[-.28,-.1,.1,.3]:[-.2,.18])mer.push({a:a0+da*R(.8,1.1),tw:R(-.15,.15),c:cw.st,w:Math.max(.4,Rm*(dt?.05:.07)),op:cw.dry?.45:.8,t0:.08,t1:.9})}
  /* the grooves between the follicles: a darker seam */
  if(!LOD)for(let i=0;i<5;i++)mer.push({a:(i+.5)/5*6.283+ph,c:shd(col,-.5),w:Math.max(.35,Rm*.03),op:.55,t0:.04,t1:.97});
  gsRev(k,B,O,Hh,t=>Rm*(or?NIG_OR(t):NIG_PR(t)),col,{nl:5,lob:or?.32:.16,ph,ng:dt?25:15,ct:.75,ink,pal:P,merge:1,mer,hl:cw.dry?0:.18});
  hornD(horns[1],hc);bract(true);return k}
/* a feathery leaf drawn on the screen: a midrib cut into thread-like segments, forked once */
function ngLeaf(par,x,y,ang,len,col){const c=Math.cos(ang),s=Math.sin(ang),p=(u,v)=>[x+c*u-s*v,y+s*u+c*v];let d=`M${f(x)},${f(y)}L${p(len,0).map(f).join(',')}`;
  for(let i=1;i<=4;i++){const u=len*i/5,l=len*(.42-.06*i);for(const sd of[-1,1]){const a=p(u,0),b=p(u+l*.55,sd*l*.75),c2=p(u+l*.95,sd*l*.85),e=p(u+l*.7,sd*l*1.05);d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}L${f(c2[0])},${f(c2[1])}M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`}}
  E('path',{d,fill:'none',stroke:col,'stroke-width':.6,'stroke-linecap':'round','stroke-linejoin':'round'},par)}
function nigPlant(g,t,o){const cw=cwPick(CW_NIG,o),op=Math.max(.05,Math.min(1,o.op??1)),m=cw.dry?1:op,D0=(o.cm||2.8)*UPC,k=G(g),dry=cw.dry,
    sc=gsCols(dry?mix(cw.c,'#8a7a5a',.3):cw.f==='or'?'#9aa25a':'#7d9460'),lc=dry?mix(cw.c,'#8a7a5a',.3):'#6f8c4c',sz=dry?.9+.1*op:.62+.38*op,cap=(par,B,O,D,mm)=>ngCap(par,B,O,D,cw,mm);
  if(o.spine){const parts=[],A=spAxis(o,blen(o.spine),{face:R(-.5,.5),bow:R(-.08,.08)}),f1=A.at(1),w=Math.max(1.3,D0*.07),Bf=spFrame(f1.T,f1.Fr,R(0,6.283));spStem(A,parts,[0,.3,.6,.85,1],w*1.3,w,sc);
    /* a branch with a younger capsule, and feathery leaves at the nodes below */
    const L=A.L;if(L>D0*5){const br=bzGrow(A,L-D0*R(2.2,3),R(0,6.283),R(26,36),[['F',{l:D0*R(1.6,2.2),w1:w*.75}],['K',{}]],{w:w*.85,seg:D0*.4,T:[0,1,0],e:.02,wig:.02});bzAxes(br,sc,parts);
      for(const og of br.organs){const Bb=spFrame(og.H,[0,1,0],R(0,6.283));parts.push({z:og.pos[2]+.4,fn:par=>cap(par,Bb,og.pos,D0*sz*.72,Math.min(m,.6))})}}
    for(let i=0;i<3;i++){const l=L-D0*(1.6+1.7*i);if(l<L*.35)break;const q=A.at(A.sOf(l)),az=R(0,6.283),r=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),og={H:V3.nz(V3.add(V3.sc(q.T,.6),r)),U:q.T};
      parts.push(lsLeaf2D(og,q.p,D0*R(1.1,1.5),(par,x,y,a,l2)=>ngLeaf(par,x,y,a,l2,lc)))}
    parts.push({z:f1.p[2]+.5,fn:par=>cap(par,Bf,f1.p,D0*sz,m)});drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w*1.3,bw1:w*1.3,bc:sc}}
  const r=lsHeadS(k,o,{D:D0,w:Math.max(1.3,D0*.07),cols:sc,op,rr:.5,axisFirst:true,nodes:2,li:1.5,lp:2.2,aimK:.04,opp:0,leafAng:50,side:{p:.75,n:1,top:2,len:1.8,ang:30,age:[.2,.85]},budD:.45,budMax:.01,wig:.03,e:.02,
    flower:(par,B,O,D2,op2)=>cap(par,gsCapF(B,.3),O,D2*sz,m),bud:(par,B,O,s,a)=>cap(par,B,O,s*1.5,.3),young:(par,B,O,s,a)=>cap(par,B,O,D0*sz*(.5+.3*a),Math.min(m,.3+.5*a)),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D0*R(1.1,1.5),(par,x,y,a,l)=>ngLeaf(par,x,y,a,l,lc))});
  open(k,t,1000,6,.3);return r}

/* ---------- baptisia (Baptisia australis, faux indigo): after flowering the racemes carry inflated oblong legumes, 3–5 cm long and 1.5–2 cm thick, each on a short stipe above the
   persistent calyx, ending in a short stiff beak; alternate, ascending, along stiff branched stems. Ripe and dried they turn charcoal to matt black, lightly powdered (a bloom), the
   ventral suture a fine seam; fresh they are green or glaucous. Sold as dried branches: a graphic, dark line ---------- */
const CW_BAP=[{id:'noir',n:'Noir mat (séché)',c:'#1f1f22',sc:'#2c2d31',bl:'#8c9098'},{id:'anthracite',n:'Gris anthracite (séché)',c:'#3a3a3e',sc:'#34353a',bl:'#9a9ea6'},
  {id:'ardoise',n:'Gris ardoise poudré',c:'#5a606a',sc:'#3e4148',bl:'#aeb4bc'},{id:'brun',n:'Brun noir (séchant)',c:'#4a3e34',sc:'#3a332c',bl:'#8e8478'},
  {id:'brun-clair',n:'Brun (séchant)',c:'#6e5a42',sc:'#4a3e32',bl:'#a8987e'},{id:'vert',n:'Vert (frais)',c:'#6f8a4a',sc:'#5f7450',bl:'#a8b890',fr:1},
  {id:'glauque',n:'Vert glauque (frais)',c:'#7a9a8a',sc:'#62786c',bl:'#b8ccc4',fr:1}];
const BAP_PR=gsProf([[0,.22],[.04,.6],[.12,.86],[.3,1],[.68,1],[.86,.88],[.95,.58],[1,.12]]);
/* a pod: from its node on the stem (pos), its pedicel and stipe along ax, the inflated body, its beak; L its length */
function bpPod(par,pos,ax,L,cw,m){const dt=DET>=1.5,k=G(par),Rm=L*.25,st=L*.24,O=V3.add(pos,V3.sc(ax,st)),B=spFrame(ax,[0,1,0],R(0,6.283)),sd=toV(B,[0,1,0]),col=m<.6&&!cw.fr?mix('#5f7450',cw.c,m/.6):cw.c,
    P=gsBloom(col,cw.bl,.42),ink=shd(col,-.8),hc=shd(cw.sc,.1);
  /* the persistent calyx and the stipe */
  const cal=bzRing(ax,5,.7,R(0,6)).map(d=>[pos,V3.add(pos,V3.sc(d,L*.06)),L*.04]);cal.push([V3.add(pos,V3.sc(ax,-L*.02)),V3.add(O,V3.sc(ax,L*.03)),Math.max(.7,L*.035)]);
  const back=ax[2]>0;if(back)bzSpikes(k,cal,hc,.8,{ink});
  gsRev(k,B,O,L,t=>Rm*BAP_PR(t),col,{sq:.88,ng:dt?18:10,nb:dt?5:3,pal:P,ct:.6,ink,sw:.45,merge:1,mer:[{a:Math.PI/2,c:shd(col,-.55),w:.45,op:.7,t0:.05,t1:.97}]});
  if(!back)bzSpikes(k,cal,hc,.8,{ink});
  /* the beak: the persistent style, short and stiff, bent a little toward the suture */
  const tp=V3.add(O,V3.sc(ax,L*.96)),be=V3.add(tp,V3.add(V3.sc(ax,L*.15),V3.sc(sd,L*.05)));bzSpikes(k,[[tp,be,Math.max(.6,L*.05)]],shd(col,-.15),.8,{ink});return k}
function bapPlant(g,t,o){const cw=cwPick(CW_BAP,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||30)*UPC,sc=gsCols(cw.sc),dt=DET>=1.5,pl=4*UPC;
  return bzShoot(g,t,o,{Lt:C*1.75,w0:4.2,w1:1.3,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0;
    /* pods along an axis (alternate, phyllotaxis 2/5), ascending, the lowest the oldest and the largest */
    const pods=(node,la,lb,step,ph)=>{let i=0;for(let l=la;l<lb;l+=step*R(.85,1.15),i++){const q=node(l),az=(ph+i*144+R(-18,18))*D,rd=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az))),el=R(28,58)*D,
      ax=V3.nz(V3.add(V3.add(V3.sc(rd,Math.cos(el)),V3.sc(q.T,Math.sin(el))),[0,R(-.05,.1),0])),u=(l-la)/Math.max(1,lb-la),Lp=pl*R(.8,1.2)*(1-.25*u)*(.7+.3*op),pos=V3.add(q.p,V3.sc(rd,q.w*.45)),m=Math.min(1,op*1.25-u*.15);
      parts.push({z:pos[2]+ax[2]*Lp*.6,fn:par=>bpPod(par,pos,ax,Lp,cw,m)})}};
    const W=s=>4.2+(1.3-4.2)*s,mainNode=l=>{const s=A.sOf(l),q=A.at(s);return{p:q.p,T:q.T,Fr:q.Fr,Sd:q.Sd,w:W(s)}};
    pods(mainNode,Math.max(l0+6,L-C*.62),L-pl*.4,pl*(dt?.5:.6),R(0,360));
    /* side racemes: alternate branches rising from the lower stem, each a raceme of pods */
    const ns=2+(rnd()<.55?1:0);for(let i=0;i<ns;i++){const l=L-C*(.55+.22*i)*R(.92,1.08);if(l<l0+8)continue;const az=(i*150+R(-30,30))*D,ll=C*R(.42,.6)*(1-.12*i);
      const res=bzGrow(A,l,az,R(26,40),[['F',{l:ll*.35,w1:1.8}],['F',{l:ll*.65,w1:.9,e:.02}]],{w:2.4,seg:7,T:[0,1,0],e:.012,wig:.02});bzAxes(res,sc,parts);
      for(const ch of res.chains){const P=ch.pts,cum=[0];for(let j=1;j<P.length;j++)cum.push(cum[j-1]+V3l(V3s(P[j],P[j-1])));const Lc=cum[cum.length-1];if(Lc<pl)continue;
        const node=l2=>{let j=1;while(j<P.length-1&&cum[j]<l2)j++;const u=(l2-cum[j-1])/((cum[j]-cum[j-1])||1),p=V3.add(P[j-1],V3.sc(V3s(P[j],P[j-1]),u)),T=V3.nz(V3s(P[j],P[j-1]));let Sd=V3.cr(T,[0,0,1]);if(V3l(Sd)<1e-3)Sd=[1,0,0];Sd=V3.nz(Sd);
          return{p,T,Fr:V3.cr(Sd,T),Sd,w:ch.ws[j-1]+(ch.ws[j]-ch.ws[j-1])*u}};pods(node,Lc*.3,Lc-pl*.3,pl*(dt?.52:.62),R(0,360))}}}})}

/* ---------- mousse espagnole (Tillandsia usneoides): an epiphyte without roots, thread-like stems (about 1 mm) covered in silvery scales (trichomes), branching and tangling into
   festoons that hang in curtains; along them alternate thread-like leaves 2–5 cm, curved, so the threads zigzag. Sold as dried or preserved bunches: silver grey, grey-green,
   beige (preserved) or dyed green. In a bouquet it hangs over the lip of the vessel, in front, and never comes from under it ---------- */
const CW_TIL=[{id:'argent',n:'Gris argenté (naturelle)',c:'#a9aea6'},{id:'gris-vert',n:'Gris vert',c:'#8d9b88'},{id:'beige',n:'Beige naturel (préservée)',c:'#9a8e7a'},{id:'vert',n:'Vert mousse (teintée)',c:'#7f9460'}];
function tilDrape(g,t,o){const cw=cwPick(CW_TIL,o),k=G(g),dt=DET>=1.5,P=pal7(cw.c),L=o.len||(o.cm||60)*UPC,sw0=o.sway??R(-30,30),ax=o.ax||[0,0,1],yw=o.len?0:Math.atan2(ax[0],ax[2]),cy=Math.cos(yw),sy=Math.sin(yw),
    sd=sw0>=0?1:-1,W=Math.min(70,22+L*.12),pt=v=>`${f(v[0]*cy+v[2]*sy)},${f(v[1])}`,lay=[{d:'',lv:''},{d:'',lv:''},{d:'',lv:''}],nf=dt?30:16,ki=L>160?12:9;
  /* over the lip: threads folded over it, arching up a little and falling on both sides */
  for(let i=0;i<(dt?9:5);i++){const cx=R(-W*.5,W*.5),rr=R(5,10),z=R(-5,5),h=R(2,4.5);lay[z<-2.5?0:z>2.5?2:1].d+=`M${pt([cx-rr,R(3,7),z])}Q${pt([cx,-h*2,z])} ${pt([cx+rr,R(4,9),z])}`}
  /* the hanging threads: each from its own place on the clump (or branching from another thread), falling and drifting with the sway, wandering slowly, crossing;
     at every node (a leaf) the thread kinks the other way, in and out of the plane too, so it zigzags in space */
  const starts=[];
  for(let i=0;i<nf;i++){const br=i>4&&starts.length&&rnd()<.35?pick(starts):null,x0=br?br[0]:R(-W*.5,W*.5),y0=br?br[1]:R(-1,7),z0=br?br[2]:R(-W*.35,W*.35),u=rnd(),Lf=Math.max(12,(L-y0)*(i<3?R(.85,1):.2+.8*u*u)),
      ph1=R(0,6.28),ph2=R(0,6.28),am=R(5,13)*(L/260+.35),sw=sw0*R(.5,1.2),dr=R(-1,1)*L*.07,fz=R(-1,1)*L*.04,kk=R(1,1.8),n=Math.max(4,Math.round(Lf/ki)),pts=[];let side=rnd()<.5?1:-1;
    for(let j=0;j<=n;j++){const y=y0+Lf*j/n,v=(y-y0)/L,x=x0*(1-.35*Math.min(1,v*1.6))+sd*Math.min(4,(y-y0)*.3)+sw*(Math.pow(Math.max(0,y)/L,1.5)-Math.pow(Math.max(0,y0)/L,1.5))+dr*v+Math.sin(v*4.5+ph1)*am*v+Math.sin(v*11+ph2)*am*.3*v,z=z0+fz*v+Math.sin(v*6+ph2)*am*.5*v;
      side=-side;pts.push([x+(j?side*kk:0),y+(j?R(-1.2,1.2):0),z+(j?(j%3?side:-side)*kk*.7:0)])}
    for(let j=2;j<n;j+=3)starts.push(pts[j]);
    const l=lay[z0<-W*.12?0:z0>W*.12?2:1];l.d+=smooth(pts.map(q=>[q[0]*cy+q[2]*sy,q[1]]),false);
    /* leaves: thread-like, curved, leaving the corners of the zigzag */
    for(let j=1;j<n;j+=dt?1:2){if(rnd()<(dt?.35:.45))continue;const p=pts[j],s=p[0]>pts[j-1][0]?1:-1,ll=R(9,20);l.lv+=`M${pt(p)}Q${pt([p[0]+s*ll*.55,p[1]+ll*.12,p[2]])} ${pt([p[0]+s*ll*R(.2,.45),p[1]+ll*.9,p[2]])}`}}
  /* three depths: the far threads darker, the near ones lighter; the near layer over a dark line that sets it off; the scales as a broken light line */
  lay.forEach((l,i)=>{const I=[.34,.5,.66][i];if(i===2)E('path',{d:l.d,fill:'none',stroke:toneAt(P,.18),'stroke-width':dt?1.3:1.5,'stroke-linecap':'round','stroke-linejoin':'round','stroke-opacity':.75},k);
    E('path',{d:l.d+l.lv,fill:'none',stroke:toneAt(P,I),'stroke-width':dt?.7:.85,'stroke-linecap':'round','stroke-linejoin':'round'},k);
    if(!LOD&&i)E('path',{d:l.d,fill:'none',stroke:toneAt(P,.92),'stroke-width':dt?.32:.4,'stroke-dasharray':dt?'.6 1.4':'.9 1.8','stroke-linecap':'round','stroke-opacity':i===2?.9:.55,transform:'translate(-.25,-.3)'},k)});
  open(k,t,1100,0,0)}

/* ---------- branche lichénée (Prunus spinosa or birch, covered in lichens): a dry grey-brown twig branching at wide angles, with short spurs, crusted with grey-green lichens:
   leafy rosettes of rounded lobes pressed to the bark (foliose, Parmelia, Flavoparmelia), little shrubby tufts of flat forked straps standing out from it (fruticose, Evernia, Ramalina)
   and pale crusts in between (crustose); thickest on the old wood ---------- */
const CW_LIC=[{id:'vert-de-gris',n:'Vert-de-gris pâle',c:'#b9c4a6'},{id:'argent',n:'Gris argenté',c:'#d6dcc8'},{id:'sauge',n:'Vert sauge',c:'#9aa88a'},
  {id:'gris-beige',n:'Gris beige (bouleau)',c:'#a49d8b'},{id:'vert-jaune',n:'Vert jaune (Flavoparmelia)',c:'#c2c58a'}];
function licBranch(g,t,o){const cw=cwPick(CW_LIC,o),Lf=(o.cm||55)*UPC,sc=['#2a241f','#4a4038','#6e645a','#9a9084'],dt=DET>=1.5,PL=pal7(cw.c),PD=pal7(mix(cw.c,'#7a8070',.35));
  return bzShoot(g,t,o,{Lt:Lf*1.05,w0:5,w1:1.2,sc,bow:R(-.12,.12),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,chains=[];
    /* the twig: side branches at wide angles, each with short stiff spurs, alternate */
    const nsb=3+(rnd()<.5?1:0);for(let i=0;i<nsb;i++){const l=L*(.22+.6*i/nsb)*R(.92,1.08);if(l<l0+6)continue;const ll=(L-l)*R(.45,.7),sp=[];
      for(let j=0;j<5;j++)sp.push(['F',{l:ll*.2,w1:Math.max(1.2,2.8-.36*j-.3*i)}],[j%2?'-':'+',{a:R(6,14)}],['[',{w:1.2}],[j%2?'+':'-',{a:R(45,70)}],['F',{l:ll*R(.07,.16),w1:.95}],[']',{}]);
      const res=bzGrow(A,l,(i*150+R(-25,25))*D,R(32,52),sp,{w:3-.4*i,seg:6,T:[0,1,0],e:.01,wig:.07});bzAxes(res,sc,parts);for(const ch of res.chains)chains.push(ch)}
    {const P=[],W=[];for(let i=0;i<=24;i++){const s=s0+(1-s0)*i/24,q=A.at(s);P.push(q.p);W.push(5+(1.2-5)*s)}chains.push({pts:P,ws:W,main:1})}
    /* the lichens along every chain: thick on the old wood, sparse toward the young tips. Each chain gathers them in two layers (behind it, in front of it), one path per kind and tone */
    /* in a bouquet the foot of the branch stands in the mouth of the vessel: no lichen there, it would show under the lip */
    const b0=A.at(s0).p,clr=Math.max(L*.2,8*UPC);
    for(const ch of chains){const Pp=ch.pts,cum=[0];for(let j=1;j<Pp.length;j++)cum.push(cum[j-1]+V3l(V3s(Pp[j],Pp[j-1])));const Lc=cum[cum.length-1],step=UPC*(dt?.36:.55),bk=new Map(),add=(key,d)=>bk.set(key,(bk.get(key)||'')+d);
      let zmin=1e9,zmax=-1e9;for(const q of Pp){zmin=Math.min(zmin,q[2]);zmax=Math.max(zmax,q[2])}
      for(let l=step*R(.2,1);l<Lc-1;l+=step*R(.6,1.4)){let j=1;while(j<Pp.length-1&&cum[j]<l)j++;const u=(l-cum[j-1])/((cum[j]-cum[j-1])||1),p=V3.add(Pp[j-1],V3.sc(V3s(Pp[j],Pp[j-1]),u)),T=V3.nz(V3s(Pp[j],Pp[j-1])),w=ch.ws[j-1]+(ch.ws[j]-ch.ws[j-1])*u;
        const age=1-l/Lc*(ch.main?.55:.8);if(rnd()>.35+.65*age)continue;if(o.spine&&V3l(V3s(p,b0))<clr)continue;let X=V3.cr(T,[0,0,1]);if(V3l(X)<1e-3)X=[1,0,0];X=V3.nz(X);const Y=V3.cr(X,T),th=R(0,6.283),r=V3.add(V3.sc(X,Math.cos(th)),V3.sc(Y,Math.sin(th))),
          c=V3.add(p,V3.sc(r,w*.4)),lay=r[2]>=-.15?'f':'b',I=lightI(V3.nz(V3.add(r,[0,0,.6]))),tq=k2=>Math.round((.6+(I-.6)*k2)*6)/6,q=rnd(),sz=.55+.6*age;
        if(q<.55){/* a foliose rosette: rounded lobes radiating from its centre, pressed to the bark and wrapping round it; the centre older and greyer, the lobe tips pale */
          const n=5+Math.floor(R(0,4)),rho=UPC*R(.55,1.25)*sz,e1=T,e2=V3.nz(V3.cr(r,T)),lob=[],a0=R(0,6.283),wr=Math.min(1,.5+w/(2.2*rho));for(let i=0;i<n;i++)lob.push(R(.72,1.15));
          const ring=(k2,lift)=>{const pts=[],m2=n*4;for(let i=0;i<m2;i++){const a=a0+i/m2*6.283,li=Math.floor(i/4),fr=(i%4)/4,rr=rho*k2*lob[li]*(.6+.4*Math.sin(Math.PI*(fr*.9+.05)));
            const v=V3.add(V3.add(c,V3.add(V3.sc(e1,Math.cos(a)*rr),V3.sc(e2,Math.sin(a)*rr*wr))),V3.sc(r,lift*rho-(1-wr)*Math.abs(Math.sin(a))*rr*.6));pts.push([v[0],-v[1]])}return pts};
          add(lay+'r'+tq(.7),smooth(ring(1,.1)));if(dt)add(lay+'c'+tq(.5),smooth(ring(.45,.18)))}
        else if(q<.8){/* a fruticose tuft: flat straps standing out from the bark, forking twice */
          let d='';const ns=3+Math.floor(R(0,3)),pt=v=>`${f(v[0])},${f(-v[1])}`;for(let i=0;i<ns;i++){const dd=V3.nz(V3.add(r,V3.add(V3.sc(T,R(-.8,.8)),V3.sc(V3.cr(r,T),R(-.8,.8))))),l1=UPC*R(.35,.7)*sz,b=V3.add(c,V3.sc(dd,l1));d+=`M${pt(c)}L${pt(b)}`;
            for(const sg of[-1,1]){const d2=V3.nz(V3.add(dd,V3.sc(V3.cr(dd,T),sg*R(.3,.6)))),e=V3.add(b,V3.sc(d2,l1*R(.55,.85)));d+=`M${pt(b)}L${pt(e)}`;if(dt&&rnd()<.6){const e2=V3.add(e,V3.sc(V3.nz(V3.add(d2,V3.sc(T,R(-.5,.5)))),l1*.45));d+=`M${pt(e)}L${pt(e2)}`}}}
          add(lay+'t'+tq(.5),d)}
        else{/* a crust: a pale patch on the bark */const s2=Math.min(w*.5,UPC*R(.15,.35)),v=[c[0],-c[1]],a=Math.atan2(-T[1],T[0]),ca=Math.cos(a)*s2*1.7,sa=Math.sin(a)*s2*1.7;
          add(lay+'k',`M${f(v[0]+ca)},${f(v[1]+sa)}A${f(s2*1.7)},${f(s2)} ${f(a/D)} 1,1 ${f(v[0]-ca)},${f(v[1]-sa)}A${f(s2*1.7)},${f(s2)} ${f(a/D)} 1,1 ${f(v[0]+ca)},${f(v[1]+sa)}Z`)}}
      for(const lay of['b','f'])parts.push({z:lay==='f'?zmax+.4:zmin-.4,fn:par=>{const g2=G(par);
        for(const[key,d]of bk){if(key[0]!==lay)continue;const kd=key[1],I=+key.slice(2);
          if(kd==='k')E('path',{d,fill:mix(cw.c,lay==='f'?'#e6e8dc':'#8a8a7a',.3),opacity:.85},g2);
          else if(kd==='r')E('path',{d,fill:toneAt(PL,I),stroke:toneAt(PL,.22),'stroke-width':.35,'stroke-opacity':.7},g2);
          else if(kd==='c')E('path',{d,fill:toneAt(PD,I),stroke:toneAt(PL,.95),'stroke-width':.35,'stroke-opacity':.65},g2);
          else{E('path',{d,fill:'none',stroke:toneAt(PL,I*.75),'stroke-width':dt?1.6:1.5,'stroke-linecap':'round','stroke-linejoin':'round'},g2);if(dt)E('path',{d,fill:'none',stroke:toneAt(PL,Math.min(1,I+.25)),'stroke-width':.6,'stroke-linecap':'round','stroke-opacity':.85},g2)}}}})}}})}

/* ---------- registers ---------- */
Object.assign(GH,{'pavot-capsules':pavPlant,'nigelle-capsules':nigPlant,'baptisia-gousses':bapPlant,'tillandsia-usneoides-mousse-espagnole':tilDrape,'branche-lichen':licBranch});
Object.assign(CWS,{'pavot-capsules':CW_PAV,'nigelle-capsules':CW_NIG,'baptisia-gousses':CW_BAP,'tillandsia-usneoides-mousse-espagnole':CW_TIL,'branche-lichen':CW_LIC});
Object.assign(SZG,{'pavot-capsules':[2.5,3,3.5,4,4,4.5,5],'nigelle-capsules':[2,2.5,2.5,3,3.5],'baptisia-gousses':[20,25,30,35,40],'tillandsia-usneoides-mousse-espagnole':[30,40,50,60],'branche-lichen':[40,50,55,60,70]});
Object.assign(GHI,{'pavot-capsules':{form:'sphere',size:1.8,k:'head',rk:1,self:55*UPC,tip:.9,fx:3*UPC},'nigelle-capsules':{form:'sphere',size:1.6,k:'head',rk:1.3,self:45*UPC,tip:.8,fx:3*UPC},
  'baptisia-gousses':{form:'ligne',size:1,k:'plant',self:65*UPC,tip:.85,fx:4*UPC},'tillandsia-usneoides-mousse-espagnole':{form:'retombante',size:2,k:'drape',self:60*UPC},
  'branche-lichen':{form:'ligne',size:1,k:'plant',self:60*UPC,tip:.9,fx:3*UPC}});
