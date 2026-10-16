/* ================= Serre, lot 14 — globes et hampes, grandis par le L-système : ail serpent, petits alliums, alliums géants, panicaut, échinops ================= */
/* ---------- shared: florets laid on a ball or an egg by projection — each floret one outline, hundreds of them gathered in a few paths (one per depth band, colour and light step) ---------- */
/* the tangent frame of a point whose outward normal is n */
function a14Tan(n){const up=Math.abs(n[1])>.9?[1,0,0]:[0,1,0],t1=V3.nz(V3.cr(up,n));return[t1,V3.cr(n,t1)]}
const a14P=(B,O,p,T,n,a,b,h)=>PJ(B,O,[p[0]+T[0][0]*a+T[1][0]*b+n[0]*h,p[1]+T[0][1]*a+T[1][1]*b+n[1]*h,p[2]+T[0][2]*a+T[1][2]*b+n[2]*h]);
/* a polygon as a path (florets are small: straight sides) */
const a14D=q=>{let d='M'+f(q[0][0])+','+f(q[0][1]);for(let i=1;i<q.length;i++)d+='L'+f(q[i][0])+','+f(q[i][1]);return d+'Z'};
const a14Dot=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a star floret: k tepals of length s round p, the notches at w·s, the tips lifted by cup·s toward n (a shallow cup) */
/* el: elliptic tepals (widest halfway, for florets big enough to show it), rd: rounded tips (cup flowers) */
function a14Star(B,O,p,n,s,rot,k,w,cup,rd,el){const T=a14Tan(n),q=[];for(let i=0;i<2*k;i++){const a=rot+i*Math.PI/k,tp=!(i&1),r=tp?s:s*w;
    if(tp&&rd){for(const da of[-.22,0,.22])q.push(a14P(B,O,p,T,n,Math.cos(a+da*rd)*r*(da?.9:1),Math.sin(a+da*rd)*r*(da?.9:1),s*cup))}
    else if(tp&&el){const hw=Math.atan2(el*.5,.55);q.push(a14P(B,O,p,T,n,Math.cos(a-hw)*s*.58,Math.sin(a-hw)*s*.58,s*cup*.55),a14P(B,O,p,T,n,Math.cos(a)*s,Math.sin(a)*s,s*cup),a14P(B,O,p,T,n,Math.cos(a+hw)*s*.58,Math.sin(a+hw)*s*.58,s*cup*.55))}
    else q.push(a14P(B,O,p,T,n,Math.cos(a)*r,Math.sin(a)*r,tp?s*cup:s*cup*.12))}return q}
/* a shut floret (bud): an ovoid of length l and radius r along n, its outline */
function a14Bud(B,O,p,n,l,r,m=6){const T=a14Tan(n),q=[];for(let i=0;i<m;i++){const a=i/m*6.283;for(const[h,rr]of[[0,r*.5],[l*.42,r],[l*.8,r*.58]])q.push(a14P(B,O,p,T,n,Math.cos(a)*rr,Math.sin(a)*rr,h))}q.push(a14P(B,O,p,T,n,0,0,l));return hull2(q)}
/* the florets of a head in depth bands: fl = [{q outline, z depth, c colour, I light, e eye path, ec its colour, pd pedicel path}];
   each band is one part of the painter's order: its pedicels, then one path per colour and light step (dark to light), then the eyes */
function a14Bands(fl,nb,z0,z1,o={}){const bd=[];for(let b=0;b<nb;b++)bd.push({z:0,n:0,g:{},e:{},p:''});
  const L=o.lv||(DET>=1.5?12:8);for(const it of fl){const b=Math.max(0,Math.min(nb-1,Math.floor((it.z-z0)/((z1-z0)||1)*nb))),B=bd[b],lv=Math.max(0,Math.min(L,Math.round(it.I*L))),key=it.c+lv;B.z+=it.z;B.n++;
    (B.g[key]=B.g[key]||{c:it.c,lv,d:''}).d+=a14D(it.q);if(it.e)B.e[it.ec]=(B.e[it.ec]||'')+it.e;if(it.pd)B.p+=it.pd}
  const parts=[],pc={},P=c=>pc[c]||(pc[c]=pal7(c));
  bd.forEach(B=>{if(!B.n)return;parts.push({z:B.z/B.n+(o.zb||0),cast:false,fn:par=>{if(B.p)E('path',{d:B.p,stroke:o.pc||'#5f7a48','stroke-width':f(o.pw||.6),fill:'none','stroke-linecap':'round','stroke-opacity':.9},par);
      for(const g of Object.values(B.g).sort((a,b)=>a.lv-b.lv)){const p=P(g.c);E('path',{d:g.d,fill:toneAt(p,g.lv/L),stroke:o.ink===0?'none':p.d1,'stroke-width':o.sw||.25,'stroke-opacity':o.so??.4,'stroke-linejoin':'round'},par)}
      for(const c in B.e)E('path',{d:B.e[c],fill:c},par)}})});return parts}
/* a papery sheath (spathe of an allium, of a garlic scape): an ovoid along local Z from z0, length s, width w, its tip drawn out into a beak of length lb, fine veins along it */
function a14Sheath(B,O,z0,s,w,lb,col,o={}){const parts=[],pts=[],rf=v=>w*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),o.pw??.6)*(1-(o.tp??.5)*v);
  for(let i=0;i<=10;i++)for(let j=0;j<12;j++){const v=i/10,a=j/12*6.283,r=rf(v),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z0+v*s]);pts.push(p)}
  let z=0;for(const p of pts)z+=p[2];z/=pts.length;const h=hull2(pts);
  /* veins: meridians on the side facing the eye */
  let vd='';if(!LOD)for(let j=0;j<7;j++){const a=j/7*6.283+.3,seg=[];for(let i=1;i<=9;i++){const v=i/10,r=rf(v),dr=(rf(Math.min(1,v+.02))-rf(v-.02))/(.04*s),n=toV(B,V3.nz([Math.cos(a),Math.sin(a),-dr]));const p=PJ(B,O,[Math.cos(a)*r*1.01,Math.sin(a)*r*1.01,z0+v*s]);
      if(n[2]>.05)seg.push(p);else if(seg.length){if(seg.length>2)vd+=smooth(seg.map(q=>[q[0],q[1]]),false);seg.length=0}}if(seg.length>2)vd+=smooth(seg.map(q=>[q[0],q[1]]),false)}
  const P=pal7(col),beak=lb>0?tubeFlat(B,O,[[0,0,z0+s*.9],[o.bx||0,o.by||0,z0+s+lb*.35],[(o.bx||0)*2.2,(o.by||0)*2.2,z0+s+lb*.7],[(o.bx||0)*3.6,(o.by||0)*3.6,z0+s+lb]],Math.max(.45,rf(.9)*.9),.12,toneAt(P,.62),{ink:P.d2,eo:.5}):null;
  const hole=o.hole&&o.slit?(()=>{const fa=Math.atan2(B[1][2],B[0][2]),L2=[],R2=[];for(let i=2;i<=9;i++){const v=i/10,r=rf(v)*1.02,da=o.slit*Math.sin(Math.PI*(v-.2)/.7);for(const[sg,arr]of[[-1,L2],[1,R2]]){const p=PJ(B,O,[Math.cos(fa+sg*da)*r,Math.sin(fa+sg*da)*r,z0+v*s]);arr.push([p[0],p[1]])}}return smooth(L2.concat(R2.reverse()))})():'';
  parts.push({z,sil:h.map(p=>[p[0],p[1]]),cast:.6,fn:par=>{E('path',{d:smooth(h)+hole,'fill-rule':'evenodd',fill:budFill(col),stroke:P.d2,'stroke-width':.4,'stroke-opacity':.6},par);if(vd)E('path',{d:vd,stroke:P.d1,'stroke-width':.35,'stroke-opacity':.55,fill:'none'},par);
    /* the slit where it splits, on the side facing the eye: the florets' colour showing between its lips (o.hole: a true opening onto what it holds, drawn behind it) */
    if(o.slit){const fa=Math.atan2(B[1][2],B[0][2]),L2=[],R2=[];for(let i=2;i<=9;i++){const v=i/10,r=rf(v)*1.02,da=o.slit*Math.sin(Math.PI*(v-.2)/.7);for(const[sg,arr]of[[-1,L2],[1,R2]]){const p=PJ(B,O,[Math.cos(fa+sg*da)*r,Math.sin(fa+sg*da)*r,z0+v*s]);arr.push([p[0],p[1]])}}
      const ld=smooth(L2.concat(R2.reverse()));if(o.hole)E('path',{d:ld,fill:'none',stroke:P.ink,'stroke-width':.45,'stroke-opacity':.6},par);else E('path',{d:ld,fill:o.sc||P.d2,stroke:P.ink,'stroke-width':.3,'stroke-opacity':.55},par)}}});
  if(beak){beak.z=z+.01;parts.push(beak)}return parts}
/* ---------- ornamental onions (Allium): a leafless glaucous scape; the umbel, first shut in a papery spathe drawn out into a beak, which splits and falls back;
   then florets on pedicels radiating from the top of the scape — a ball of six-tepalled stars (Globemaster, Purple Sensation, caeruleum), an egg of small bells turning purple
   from the top down (drumstick), a loose cup of stars on long pedicels (cowanii, moly), the airy metallic star of Persia (cristophii) ---------- */
const AL_SC=['#26401f','#45683a','#77995e','#b2c896'];
/* the forms: n florets on the whole umbel, sc star size (share of the spacing), w notch depth, cup, len scape shown on a sheet (×diameter), ws scape width (×diameter),
   cap the bare bottom where the scape enters */
const AL_K={ball:{n:420,sc:.7,w:.2,cup:.3,len:2.3,ws:.05,cap:.84},egg:{n:170,sc:.62,w:.5,cup:.6,len:4.2,ws:.075,cap:.8},loose:{n:22,sc:.62,w:.42,cup:.45,len:3.6,ws:.05,cap:.17},
  star:{n:110,sc:.95,w:.12,cup:.16,len:2.3,ws:.05,cap:.9}};
/* where the centre of the umbel lies above the top of the scape (the scape ends inside the foot of a dense ball, at the foot of an egg or a cup, at the heart of the airy star of Persia) */
const alCz=(R1,kind,cw)=>kind==='egg'?R1*(cw.h||1.42)*.86:kind==='loose'?R1*.42:kind==='star'?R1*.04:R1*.8;
const alR1=(Rr,op,kind)=>Rr*(kind==='egg'?.8+.2*sm01(op/.8):.56+.44*sm01((op-.3)/.6));
/* the umbel of a colourway at O (the top of its scape), in the frame Bf (Z along the scape): its parts in the painter's order */
function alUmbel(Bf,O,Rr,cw,op,kind){const K=AL_K[kind],pale=h2l(cw.c)[2]>.82,parts=[],o2=sm01((op-.3)/.6),det=DET>=1.5,c=cw.c,ec=cw.eye||shd(c,-.5),sd=R(0,6.283),fl=[],paper=mix(mix(c,'#e6e6cc',.74),'#a9b282',.22);
  /* the spathe of a ball or a cup: shut, then splitting along one side */
  if(op<.3&&kind!=='egg'){const big=kind==='ball'&&Rr>30,s=Rr*(kind==='loose'?1.05:big?.86:.95),w=Rr*(kind==='loose'?.62:big?.6:.55);
    return a14Sheath(Bf,O,-Rr*.04,s,w,Rr*(kind==='loose'?.5:big?.28:.4),paper,{tp:.55,pw:.55,slit:op>.17?.28*(op-.17)/.13:0,sc:mix(c,'#9ab070',.35),bx:Rr*.012,by:Rr*.008})}
  const nT=cw.nf||K.n,N=Math.max(12,Math.round(nT*(det?1:.62)*(LOD?.5:1))),R1=alR1(Rr,op,kind),s0=(cw.sc||K.sc)*Math.sqrt(4*Math.PI/N)*R1*(kind==='loose'?.55:1),
    ea=R1,ec2=R1*(cw.h||1.42),cz=alCz(R1,kind,cw),mat=Math.min(1.25,(cw.m??1)*(.18+.82*sm01(op/.9)));
  let zmin=1e9,zmax=-1e9;
  for(let i=0;i<N;i++){let n0,p,n,zz;
    if(kind==='loose'){zz=1-(i+.5)/N*(1+(cw.cap??K.cap));const r=Math.sqrt(Math.max(0,1-zz*zz)),a=i*2.39996+sd;n0=[Math.cos(a)*r,Math.sin(a)*r,zz];p=V3.sc(n0,R1*R(.88,1));n=V3.nz(V3.add(n0,[0,0,.35]))}
    else{zz=1-2*(i+.5)/N;if(zz<-K.cap)continue;const r=Math.sqrt(1-zz*zz),a=i*2.39996+sd;n0=[Math.cos(a)*r,Math.sin(a)*r,zz];
      if(kind==='egg'){p=[n0[0]*ea,n0[1]*ea,cz+n0[2]*ec2];const ns=V3.nz([n0[0]/ea,n0[1]/ea,n0[2]/ec2]),tu=V3.nz(V3s([0,0,1],V3.sc(ns,ns[2])));n=V3.nz(V3.add(V3.sc(ns,.62),V3.sc(tu,.78)));p=V3.add(p,V3.sc(ns,-s0*.25))}
      else{p=V3.add(V3.sc(n0,R1-s0*(kind==='star'?0:.35)),[0,0,cz]);n=n0}}
    const nv=toV(Bf,n),dense=kind==='ball'||kind==='egg';if(dense&&nv[2]<-.3)continue;
    const h=(zz+1)/2,back=nv[2]<0,I0=lightI(back?V3.sc(nv,-1):nv)*(back?.72:1.04)+R(-.05,.05)+(back?0:.04),I=pale?.32+.68*I0:I0,open=kind==='egg'?true:rnd()<sm01((op-.3)/.42+(zz-.2)*.3),s=s0*R(.86,1.12);let q,col=c,e=null,pd=null;
    if(kind==='egg'){/* green at the foot, purple from the top down as the bells open; the crest of Red Mohican stays white */
      const t=Math.round(4*sm01((h-(1-.95*mat))/.3))/4;col=mix(cw.c2||'#8aa25a',c,t);let pp=p,l=s*(1.78+.2*t),rr=s*(.66+.06*t);
      if(cw.tuft&&h>.84){col=cw.tuft;pp=V3.add(p,V3.sc(n,s*.7));l=s*1.25;rr=s*.38}
      q=a14Bud(Bf,O,pp,n,l,rr,8);if(t>.5&&nv[2]>.35&&det&&rnd()<.55){const m=PJ(Bf,O,V3.add(pp,V3.sc(n,l*.9)));e=a14Dot(m[0],m[1],s*.1)}}
    else if(open){q=a14Star(Bf,O,p,n,s,R(0,6.283),6,cw.w||K.w,cw.cup??K.cup,cw.rd,s>(det?2.2:3)&&kind!=='star'?(cw.el||.36):0);if(!back&&nv[2]>.3&&(det||s>2.2)){const m=PJ(Bf,O,V3.add(p,V3.sc(n,s*.06)));e=a14Dot(m[0],m[1],Math.max(.3,s*(cw.es||.11)))}}
    else{const bl=kind==='ball'?1.3:kind==='star'?.72:.95,br=kind==='ball'?.62:kind==='star'?.27:.36;q=a14Bud(Bf,O,V3.add(p,V3.sc(n,-s*.3*bl)),n,s*bl,s*br,s*br>1.6?10:6);col=mix(c,'#b4c08e',.32)}
    if(kind==='loose'||kind==='star'){const a=PJ(Bf,O,kind==='loose'?[0,0,0]:V3.add(V3.sc(n0,kind==='ball'?R1*.74:R1*.1),[0,0,cz])),b=PJ(Bf,O,p);pd=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}
    const z=PJ(Bf,O,p)[2];zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);fl.push({q,z,c:col,I,e,ec:col===cw.tuft?'#c8c8a8':ec,pd})}
  /* the drumstick in bud: still held in its papery spathe, a long beak, split along the front where the green head shows */
  if(kind==='egg'&&op<.3){const sh=a14Sheath(Bf,O,-ea*.14,ec2*2.25,ea*2.8,ec2*.75,mix('#e9e8d2',cw.c2||'#8aa25a',.22),{tp:.42,pw:.45,slit:.42+.9*(op-.05),hole:1,bx:ea*.02,by:-ea*.015});for(const q of sh)q.z=Math.max(q.z,zmax+.5);parts.push(...sh)}
  /* the inner mass: pedicels crowded in shadow, which shows between the florets (a ball or an egg; the airy umbels show only their small receptacle) */
  const C0=PJ(Bf,O,[0,0,cz]),dk0=pale?mix('#8a9a72',c,.2):kind==='egg'?mix(shd(c,-.45),shd(cw.c2||'#8aa25a',-.45),.4):mix(shd(c,-.52),'#25361c',.25);
  if(kind==='ball'||kind==='star'){const rc=kind==='ball'?R1-s0*.55:R1*.14;parts.push({z:C0[2]-R1,cast:false,fn:par=>E('circle',{cx:f(C0[0]),cy:f(C0[1]),r:f(rc),fill:rad([[0,shd(dk0,.25)],[.7,dk0],[1,shd(dk0,-.4)]],.4,.38,.62)},par)})}
  else if(kind==='egg'){const hp=[];for(let i=0;i<=8;i++)for(let j=0;j<12;j++){const u=i/8*Math.PI,a=j/12*6.283;hp.push(PJ(Bf,O,[Math.cos(a)*Math.sin(u)*ea*.9,Math.sin(a)*Math.sin(u)*ea*.9,cz-Math.cos(u)*ec2*.92]))}
    const H=hull2(hp),eg=lin([[0,shd(c,-.62)],[.55,mix(shd(c,-.62),shd(cw.c2||'#8aa25a',-.6),.35)],[1,shd(cw.c2||'#8aa25a',-.62)]],0,0,0,1);parts.push({z:C0[2]-ea,cast:false,fn:par=>E('path',{d:smooth(H),fill:eg},par)})}
  else{const r=PJ(Bf,O,[0,0,0]);parts.push({z:r[2]-R1*.2,cast:false,fn:par=>E('circle',{cx:f(r[0]),cy:f(r[1]),r:f(Math.max(1,Rr*.07)),fill:AL_SC[1]},par)})}
  parts.push(...a14Bands(fl,kind==='loose'||kind==='star'?5:4,zmin,zmax+.01,{pc:kind==='star'?mix('#b8c49a',c,.35):mix(AL_SC[2],c,.2),pw:Math.max(.4,Rr*(kind==='loose'?.02:.007))}));
  /* the spathe: split in two papery valves hanging under the umbel (they wither and fall when it is open); the drumstick keeps its two, one drawn up beside the head */
  const vs=[];if(kind==='egg'){vs.push([sd,1.25,1.6,ea*.72,ea*.26],[sd+2.9,1.5,1.95,ea*.6,ea*.24])}else if(op<.75){const zb=0;for(let j=0;j<2;j++)vs.push([sd+j*3.1+R(-.3,.3),2.45,2.85,Rr*R(.42,.55),Rr*.2,zb])}
  if(vs.length){const it=vs.map(([phi,a0,a1,L,W,z0])=>({l:ligule(Bf,O,{phi,r0:Rr*.04,z0:z0||0,L,W,wp:prof([[0,.75],[.45,1],[1,.04]]),a0,a1,tip:'point',th:1,n:6}),c:paper,ink:shd(paper,-.45)}));
    for(const v of it)parts.push({z:v.l.z,cast:false,fn:par=>drawLig(par,[v])})}
  return parts}
/* the whole plant: the scape grows from its foot (L-system), stiff, leaning a little with its head; the umbel at its top. In a bouquet line (a model may ask for one) it follows its spine */
function alPlant(g,t,o,list,big){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),kind=cw.f||'ball',K=AL_K[kind],D=(o.cm||(big?15:3.5))*UPC*(cw.k||1),Rr=D/2,k=G(g),w=Math.max(1.5,D*K.ws);
  if(o.spine){const parts=[],A=spAxis(o,blen(o.spine),{face:R(-.5,.5)}),f1=A.at(1),Bf=spFrame(f1.T,f1.Fr,R(0,6.283));spStem(A,parts,[0,.3,.6,.85,1],w*1.2,w,AL_SC);
    parts.push(...alUmbel(Bf,f1.p,Rr,cw,o.op??R(.8,1),kind));drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w*1.2,bc:AL_SC}}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const Lh=D*K.len*(o.rim?.3:1),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lh)):1,lean=V3.nz(V3.add(up,V3.sc(ax,big?.16:.3)));
  /* S → F F(aim) U : a scape is one internode, its last stretch turning toward where the head leans */
  const res=lsTurtle(lsDerive([['S',{}]],{S:()=>[['F',{l:Lh*kr*.62,w1:w*1.05}],['F',{l:Lh*kr*.38,w1:w,aim:lean,k:.1}],['U',{}]]},2),{p:[0,0,0],H:up,U:U0,wig:.01,seg:Math.max(4,D*.12),T:[0,1,0],e:.006,w:w*1.12});
  for(const ch of res.chains)ch.c=AL_SC;const og=res.organs.find(q=>q.t==='U'),zc=op<.3&&kind!=='egg'?Rr*.4:alCz(alR1(Rr,op,kind),kind,cw),apex=V3.add(og.pos,V3.sc(og.H,zc));
  lsPlant(k,res,{O:[0,0,0],apex,cols:AL_SC,organ:(q,pos)=>q.t==='U'?{parts:alUmbel(lsFrame(q,null,0),pos,Rr,cw,op,kind)}:null});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
/* the colourways of the trade: f the form, k size against the grade, n florets, eye the heart of the floret, c2 the green of the drumstick's foot, m how far its purple has come down, tuft a pale crest */
const CW_ALG=[
 {id:'globemaster',n:'Violet (Globemaster)',c:'#7b3fa6',eye:'#4a2860'},{id:'ambassador',n:'Pourpre profond (Ambassador)',c:'#5a2a7e',eye:'#38183e',k:.9},
 {id:'gladiator',n:'Lilas à cœur vert (Gladiator)',c:'#9a6ac4',eye:'#6f8a3e',k:.85},{id:'mount-everest',n:'Blanc (Mount Everest)',c:'#f4f2ea',eye:'#93aa62',k:.75,nf:340},
 {id:'giganteum',n:'Lilas rosé (giganteum)',c:'#b06aa8',eye:'#6a3858',k:.8},{id:'his-excellency',n:'Lilas clair (His Excellency)',c:'#c4a6d8',eye:'#7a5a8a'},
 {id:'purple-rain',n:'Lavande bleutée (Purple Rain)',c:'#8e78c0',eye:'#4a3a6a',k:.8,nf:300},{id:'cristophii',n:'Étoile de Perse (cristophii)',c:'#a07ec0',eye:'#5a3a6a',k:1.1,f:'star'}];
const CW_ALP=[
 {id:'drumstick',n:'Bordeaux et vert (drumstick)',c:'#7d1f45',c2:'#8aa25a',f:'egg',eye:'#3a0a1e'},{id:'drumstick-bordeaux',n:'Bordeaux (drumstick mûr)',c:'#6a1838',c2:'#6e4a3a',f:'egg',m:1.25,eye:'#2e0814'},
 {id:'drumstick-vert',n:'Vert (drumstick jeune)',c:'#9aaa5a',c2:'#7f9a48',f:'egg',m:.22,eye:'#4a1a2a'},{id:'red-mohican',n:'Bordeaux à houppe blanche (Red Mohican)',c:'#6e1a3c',c2:'#7f8a4a',f:'egg',tuft:'#f2efe6',eye:'#2e0814',h:1.3},
 {id:'pourpre',n:'Pourpre (Purple Sensation)',c:'#6b2d8f',eye:'#4a1e62',k:1.9,nf:110,w:.18,sc:.86},{id:'bleu',n:'Bleu (caeruleum)',c:'#7f9fd8',eye:'#4a5a8a',k:.95,nf:120,sc:.8},
 {id:'rose',n:'Rose (Pink Jewel)',c:'#d58fb0',eye:'#9a4a6a',k:1.35,nf:110,sc:.82},{id:'blanc-etoile',n:'Blanc étoilé (Graceful Beauty)',c:'#f3f0ea',eye:'#c8a0a8',k:1.15,nf:44,w:.2,f:'loose',cap:.55,sc:.95},
 {id:'silver-spring',n:'Blanc à cœur pourpre (Silver Spring)',c:'#f2ecf0',eye:'#6a1e40',k:1.5,nf:40,w:.3,f:'loose',cap:.5,sc:.95,es:.15},{id:'blanc',n:'Blanc (cowanii)',c:'#f6f4ee',eye:'#4a5a3a',f:'loose',k:1.5,nf:20,w:.5,rd:1,cup:.6,es:.16},
 {id:'jaune',n:'Jaune (moly)',c:'#e6b422',eye:'#c8941a',f:'loose',k:1.4,nf:16,w:.3}];
/* ---------- globe thistle (Echinops ritro, E. bannaticus): a perfect ball of one-flowered heads, each a tuft of stiff spiny bracts — grey-green in bud, then metallic blue —
   the little five-lobed florets pushing out from the top down; several balls of different ages on a branched white-woolly stem; pinnately cut spiny leaves, white beneath ---------- */
const CW_ECHI=[{id:'bleu',n:"Bleu acier (Veitch's Blue)",c:'#5f73a8'},{id:'bleu-violet',n:'Bleu violet (Taplow Blue)',c:'#6d6cb2'},{id:'gris-bleu',n:'Gris bleuté métallique',c:'#8794b0'},
  {id:'blanc',n:'Blanc (Arctic Glow)',c:'#e9ebe6',bud:'#c8d0c0'},{id:'vert',n:'Vert (boutons)',c:'#8ea37a',green:1}];
const ECHI_SC=['#4a5444','#7f8a74','#b2baa6','#e2e6dc'];
/* one ball of radius Rh: its centre a little up its axis ax (view space) from O where the stalk arrives, so the stalk ends at its foot */
function echiBall(par,O,Rh,ax,cw,op){const det=DET>=1.5,N=Math.round((det?190:120)*(LOD?.5:1)*Math.min(1.3,Math.max(.55,Rh/16))),Bx=basis(ax,R(0,6.283)),C=V3.add(O,V3.sc(ax,Rh*.86)),sd=R(0,6.283),
    green=cw.green?1:Math.round(4*(1-sm01((op-.12)/.45)))/4,cb=mix(cw.c,cw.bud||'#9aa88e',.75*green),pale=h2l(cw.c)[2]>.82,fl=[],sp=[],gap=Math.sqrt(4*Math.PI/N)*Rh,fo=cw.green?0:sm01((op-.38)/.5);let zmin=1e9,zmax=-1e9,sd2='';
  for(let i=0;i<N;i++){const zz=1-2*(i+.5)/N,r=Math.sqrt(1-zz*zz),a=i*2.39996+sd,nl=[Math.cos(a)*r,Math.sin(a)*r,zz],n=toV(Bx,nl);if(n[2]<-.22)continue;
    const p=V3.add(C,V3.sc(n,Rh*.9)),T=a14Tan(n),b=gap*.4,h=(zz+1)/2,I0=lightI(n),I=pale?.35+.65*I0:.5+1.15*(I0-.5)+R(-.04,.04),q=[],r0=R(0,6.283);
    /* the tuft of bracts: a low pyramid, turned at random, its point out along the normal */
    for(let k=0;k<5;k++){const t=k*1.2566+r0;q.push(a14P(I3,[0,0,0],p,T,n,Math.cos(t)*b*R(.8,1.1),Math.sin(t)*b*R(.8,1.1),0))}const tip=a14P(I3,[0,0,0],p,T,n,b*R(-.15,.15),b*R(-.15,.15),gap*(.5+.22*green));q.push(tip);
    const z=tip[2];zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);const open=rnd()<sm01(fo*1.7-(1-h)*1.05);
    fl.push({q:hull2(q),z,c:cb,I});
    if(det&&n[2]>-.05){const s0=a14P(I3,[0,0,0],p,T,n,0,0,gap*.62);sd2+=`M${f(tip[0])},${f(tip[1])}L${f(s0[0])},${f(s0[1])}`}
    /* an open floret: five narrow lobes round the dark tube of the anthers */
    if(open){const fp=V3.add(p,V3.sc(n,gap*.38)),st=a14Star(I3,[0,0,0],fp,n,gap*.62,R(0,6.283),5,.2,.55,0,0),m=st[0];let e=null;
      if(n[2]>.25){const c0=a14P(I3,[0,0,0],fp,T,n,0,0,gap*.1);e=a14Dot(c0[0],c0[1],Math.max(.3,gap*.1))}fl.push({q:st,z:z+.2,c:cw.c,I:I+.06,e,ec:shd(cw.c,-.6)})}}
  const Cs=[C[0],-C[1]],cc=mix(cb,'#27301f',.15),rg=rad([[0,shd(cc,.45)],[.42,cc],[.85,shd(cc,-.45)],[1,shd(cc,-.65)]],.36,.32,.7);
  E('circle',{cx:f(Cs[0]),cy:f(Cs[1]),r:f(Rh*.93),fill:rg},par);
  drawParts(par,a14Bands(fl,det?3:2,zmin,zmax+.01,{so:.5,sw:.22,lv:det?10:5}));if(sd2)E('path',{d:sd2,stroke:shd(cb,.55),'stroke-width':f(Math.max(.25,gap*.06)),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},par)}
/* a thistle leaf drawn on the screen: pinnately cut, each lobe ending in a spine; dark green above, the white felt of its back shown on the half that turns */
function echiLeaf(par,x,y,ang,len,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),ct=Math.max(.3,Math.cos(o.tilt??R(.15,.65))),nl=o.lobes||5,W=len*(o.w||.3),bend=(o.bend??R(-.08,.08))*len,top=[],bot=[];let spn='';
  const yb=t=>bend*t*t;
  for(const s of[-1,1]){const arr=s<0?top:bot;for(let i=0;i<nl;i++){const t0=.1+.84*i/nl,t1=.1+.84*(i+.62)/nl,wl=W*Math.sin(Math.PI*Math.min(.96,.12+.84*t1))*(1-.3*t1),tw=s*wl*ct;
      arr.push([len*t0,yb(t0)+s*wl*.22*ct],[len*(t1-.05),yb(t1)+tw*.86],[len*(t1+.03),yb(t1)+tw]);const tx=len*(t1+.03),ty=yb(t1)+tw;spn+=`M${f(tx)},${f(ty)}l${f(len*.05)},${f(s*len*.035*ct)}M${f(len*(t1-.05))},${f(yb(t1)+tw*.86)}l${f(len*.012)},${f(s*len*.04*ct)}`}}
  const tip=[len,yb(1)],P=pal7(o.col||'#35552f'),U='#d3d9cc',out=[[0,0]].concat(top,[tip],bot.slice().reverse());
  E('path',{d:a14D(out),fill:o.under?U:P.b,stroke:P.d2,'stroke-width':.45,'stroke-opacity':.7,'stroke-linejoin':'round'},g);
  /* the half that turns shows its white felt; the other its dark glossy face */
  const half=[[0,0]].concat(bot,[tip]);E('path',{d:a14D(half),fill:o.under?P.b:U,stroke:shd(U,-.35),'stroke-width':.35,'stroke-opacity':.6,'stroke-linejoin':'round'},g);
  E('path',{d:`M0,0Q${f(len*.5)},${f(yb(.5))} ${f(len*.97)},${f(yb(.97))}`,stroke:'#e8ece0','stroke-width':f(Math.max(.5,len*.018)),fill:'none','stroke-linecap':'round','stroke-opacity':.85},g);
  E('path',{d:spn,stroke:'#e8e2b8','stroke-width':f(Math.max(.3,len*.007)),fill:'none','stroke-linecap':'round','stroke-opacity':.9},g);return g}
function echiPlant(g,t,o){const cw=o.cw||cwNear(CW_ECHI,o.col)||CW_ECHI[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4)*UPC,k=G(g);
  const r=lsHeadS(k,o,{D,w:Math.max(2,D*.12),cols:ECHI_SC,op,rr:.4,axisFirst:true,nodes:2,li:1.2,lp:1.7,aimK:.06,leafAng:58,side:{p:.92,n:1,top:2,len:2.1,ang:34,age:[.15,.85]},budD:.55,budMax:.38,wig:.025,e:.012,
    flower:(par,B,O,D2,op2)=>echiBall(par,O,D2/2*(.72+.28*sm01(op2/.7)),B[1],cw,op2),
    bud:(par,B,O,s,a)=>echiBall(par,O,s/2,B[2],cw,.05+.2*a),young:(par,B,O,s,a)=>echiBall(par,O,s/2*1.1,B[2],cw,.25+.6*a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,D*R(1.4,1.8),(par,x,y,a,l)=>echiLeaf(par,x,y,a,l,{under:og.p.i%2,lobes:5}))});
  open(k,t,1000,6,.3);return r}
/* ---------- sea holly (Eryngium planum hybrids, E. alpinum, E. giganteum): a cone of minute florets, each in a spiny bracteole — bristly, steel blue (green while young) —
   sitting on a collar of stiff toothed bracts ending in spines; the stem forks again and again (a cyme): the first head oldest and bluest, the later ones younger and greener;
   sessile spiny leaves where it forks ---------- */
const CW_ERY=[{id:'bleu-acier',n:'Bleu acier (Orion)',c:'#5b77a6'},{id:'bleu-profond',n:'Bleu profond (Magical Blue Lagoon)',c:'#3f5a9a',bl:1.45},{id:'bleu-clair',n:'Bleu ciel argenté (Sapphire Blue)',c:'#7f9ac4'},
  {id:'argent',n:'Argent (Silver Ghost)',c:'#c4ccc8',bl:1.6,bw:1.5},{id:'blanc',n:'Blanc (Sirius)',c:'#e4e8e2',bl:1.45},{id:'vert',n:'Vert à pointe verte (Supernova)',c:'#86a067',green:1,bl:1.25},
  {id:'bleu-vert',n:'Bleu-vert (jeune)',c:'#5f8f8c'},{id:'turquoise',n:'Turquoise (teinté)',c:'#3fb2c4',dye:1},{id:'rose',n:'Rose (teinté)',c:'#d86a9a',dye:1},{id:'violet',n:'Violet (teinté)',c:'#7a4aa8',dye:1}];
/* one head: Bf its frame (Z along the head), O the top of its stalk, Lh the length of the cone, age 0 (a green button) .. 1 (the first, fully blue); its parts */
function eryHead(Bf,O,Lh,cw,age,op){const parts=[],det=DET>=1.5,mat=Math.max(0,Math.min(1,age*(.3+.7*op))),young=cw.dye?0:cw.green?0:Math.round(3*(1-sm01((mat-.12)/.6)))/3,
    col=mix(cw.c,'#86a06a',.8*young),rh=Lh*.34*(.78+.22*mat),L=Lh*(.72+.28*mat),rot=R(0,6.283),pale=h2l(col)[2]>.8;
  const rf=v=>rh*(.74+.26*Math.sin(Math.PI*Math.min(1,v/.42)/2))*(1-.74*Math.pow(Math.max(0,(v-.3)/.7),1.25));
  /* the collar: stiff bracts, erect round a young head, spread flat (tips a little down) under a ripe one; a few spiny teeth, a spine at the tip */
  const nb=Math.round((cw.nb||10)*(det?1:.7)),sp=.5+1.05*sm01((mat-.08)/.7),bc=cw.green?mix(cw.c,'#c8d4a8',.15):mix(col,'#dfe6ee',pale?0:.12);
  for(let j=0;j<nb;j++){const phi=j/nb*6.283+rot+R(-.12,.12),Lb=Lh*(cw.bl||1.35)*R(.86,1.08)*(.55+.45*mat),W0=Lb*.14*(cw.bw||1)*(.7+.3*mat),a0=sp+R(-.18,.18)*mat,a1=a0+R(.1,.4)*mat,ns=7,
      cp=Math.cos(phi),sn=Math.sin(phi),tw=R(-.75,.75),d0=[cp*Math.sin(a0),sn*Math.sin(a0),Math.cos(a0)],N0=V3.cr(d0,[-sn,cp,0]),S=V3.nz(V3.add(V3.sc([-sn,cp,0],Math.cos(tw)),V3.sc(N0,Math.sin(tw)))),L2=[],R2=[];let p=[cp*rf(.04)*.9,sn*rf(.04)*.9,L*.03],zs=0,nmz=0;
    for(let i=0;i<=ns;i++){const t=i/ns,a=a0+(a1-a0)*t*t,d=[cp*Math.sin(a),sn*Math.sin(a),Math.cos(a)];if(i)p=V3.add(p,V3.sc(d,Lb/ns));
      const w=W0*(1-.85*Math.pow(t,1.1))*(t<.08?.7+t*3.7:1),tooth=i>1&&i<ns&&i%2===0?W0*.42:0,nm=V3.cr(d,S);
      for(const[sg,arr]of[[-1,L2],[1,R2]]){const q=PJ(Bf,O,V3.add(p,V3.sc(S,sg*w)));arr.push([q[0],q[1]]);if(tooth){const qt=PJ(Bf,O,V3.add(V3.add(p,V3.sc(S,sg*(w+tooth))),V3.sc(d,Lb*.04)));arr.push([qt[0],qt[1]])}zs+=q[2]}
      if(i===3)nmz=toV(Bf,nm)}
    const dE=[cp*Math.sin(a1),sn*Math.sin(a1),Math.cos(a1)],tp=PJ(Bf,O,V3.add(p,V3.sc(dE,Lb*.1))),out=L2.concat([[tp[0],tp[1]]],R2.reverse()),back=nmz[2]<0,I=lightI(back?V3.sc(nmz,-1):nmz)*(back?.85:1),
      P=pal7(back?mix(bc,'#e8ecef',.18):bc),mid=PJ(Bf,O,V3.add([cp*rf(.04)*.9,sn*rf(.04)*.9,L*.03],V3.sc([cp*Math.sin(a0),sn*Math.sin(a0),Math.cos(a0)],Lb*.6)));
    parts.push({z:zs/(2*(ns+1)),cast:false,fn:par=>{E('path',{d:a14D(out),fill:toneAt(P,I),stroke:P.d2,'stroke-width':.35,'stroke-opacity':.65,'stroke-linejoin':'round'},par);
      if(det&&!back){const b0=PJ(Bf,O,[cp*rf(.04)*.9,sn*rf(.04)*.9,L*.03]);E('path',{d:`M${f(b0[0])},${f(b0[1])}L${f(mid[0])},${f(mid[1])}`,stroke:P.l2,'stroke-width':.4,'stroke-opacity':.6,fill:'none'},par)}}})}
  /* the cone: its body, then its florets as small pointed scales climbing in spirals, the silhouette bristling with their spines */
  const hp=[];for(let i=0;i<=10;i++)for(let j=0;j<12;j++){const v=i/10,a=j/12*6.283,r=rf(v);hp.push(PJ(Bf,O,[Math.cos(a)*r,Math.sin(a)*r,v*L]))}hp.push(PJ(Bf,O,[0,0,L*1.03]));
  const H=hull2(hp),C=PJ(Bf,O,[0,0,L*.42]),Ns=Math.round((det?150:90)*(LOD?.5:1)),gap=Math.sqrt(2*Math.PI*rh*L*.8/Ns),fl=[];let zmin=1e9,zmax=-1e9;
  for(let i=0;i<Ns;i++){const v=.04+.94*(i+.5)/Ns,a=i*2.39996+rot,r=rf(v),dr=(rf(Math.min(1,v+.02))-rf(Math.max(0,v-.02)))/(.04*L),n=V3.nz([Math.cos(a),Math.sin(a),-dr]),nv=toV(Bf,n);if(nv[2]<-.15)continue;
    const p=[Math.cos(a)*r,Math.sin(a)*r,v*L],tu=V3.nz([-Math.cos(a)*dr,-Math.sin(a)*dr,1]),sd=V3.cr(n,tu),b=gap*.46,q=[p,V3.add(V3.add(p,V3.sc(sd,b)),V3.sc(tu,b*.2)),V3.add(V3.add(p,V3.sc(tu,b*1.5)),V3.sc(n,b*.75)),V3.add(V3.add(p,V3.sc(sd,-b)),V3.sc(tu,b*.2))].map(x=>PJ(Bf,O,x)),
      z=q[2][2],I0=lightI(nv),I=pale?.35+.65*I0:.5+1.12*(I0-.5)+R(-.05,.05);zmin=Math.min(zmin,z);zmax=Math.max(zmax,z);fl.push({q,z,c:col,I})}
  const cc=mix(col,'#1e2a30',.12),fill=rad([[0,shd(cc,.42)],[.45,cc],[.88,shd(cc,-.42)],[1,shd(cc,-.6)]],.38,.3,.72);
  parts.push({z:C[2],cast:false,fn:par=>{E('path',{d:smooth(H),fill,stroke:shd(cc,-.55),'stroke-width':.35,'stroke-opacity':.5},par);drawParts(par,a14Bands(fl,1,zmin,zmax+.01,{so:.45,sw:.2,lv:det?8:4}))}});
  return parts}
/* a spiny stem leaf where the stem forks: sessile, three to five lobed, each lobe toothed, every tooth a spine */
function eryLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),ct=Math.max(.35,Math.cos(o.tilt??R(.15,.6))),nl=o.lobes||3,P=pal7(col),pts=[[0,-len*.05*ct]];let spn='';
  for(let j=0;j<nl;j++){const th=(nl===1?0:-1+2*j/(nl-1))*.62,Lj=len*(1-.3*Math.abs(th)),Wj=Lj*.16,c=Math.cos(th),s=Math.sin(th),P2=(u,v)=>[u*c-v*s,(u*s+v*c)*ct];
    const lobe=[[.08,-1],[.32,-1.15],[.36,-.8],[.55,-1],[.6,-.65],[.8,-.6],[1,0],[.8,.6],[.6,.65],[.55,1],[.36,.8],[.32,1.15],[.08,1]];
    for(const[u,v]of lobe)pts.push(P2(u*Lj,v*Wj*(1-.5*u)));const tp=P2(Lj,0),t2=P2(Lj*1.08,0);spn+=`M${f(tp[0])},${f(tp[1])}L${f(t2[0])},${f(t2[1])}`;
    for(const[u,v]of[[.32,-1.15],[.55,-1],[.55,1],[.32,1.15]]){const a=P2(u*Lj,v*Wj*(1-.5*u)),b=P2(u*Lj+Lj*.05,v*Wj*(1-.5*u)*1.5);spn+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}}
  pts.push([0,len*.05*ct]);E('path',{d:a14D(pts),fill:P.b,stroke:P.d2,'stroke-width':.4,'stroke-opacity':.7,'stroke-linejoin':'round'},g);
  E('path',{d:spn,stroke:P.l2,'stroke-width':f(Math.max(.3,len*.012)),fill:'none','stroke-linecap':'round','stroke-opacity':.9},g);return g}
/* the plant: A → F N(1) F K;  N(o) → [Lv] [Lv] [F N(o+1) F K(o)] [F N(o+1) F K(o)] — a cyme two or three times forked; the first head at the top of the main axis */
function eryPlant(g,t,o){const cw=o.cw||cwNear(CW_ERY,o.col)||CW_ERY[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||2.5)*UPC,k=G(g),B=frameOf(o,.3,true),
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2],green=cw.dye?cw.c:cw.green?'#6f8a5a':mix('#55707a',cw.c,.35),sc=[shd(green,-.62),shd(green,-.3),green,shd(green,.42)],w=Math.max(1.5,D*.11);
  let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const Lt=D*(o.rim?.8:3.4),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lt)):1,lean=V3.nz(V3.add(up,V3.sc(ax,.25))),ord=o.rim?0:op<.25?1:2;
  const rules={A:()=>o.rim?[['F',{l:D*.6*kr,w1:w}],['F',{l:D*.3*kr,w1:w*.95,aim:lean,k:.2}],['K',{age:1,main:1}]]:[['F',{l:D*1.7*kr,w1:w*1.05}],['N',{o:1}],['F',{l:D*1.1*kr,w1:w,aim:lean,k:.12}],['K',{age:1,main:1}]],
    N:p=>{const out=[['Nd',{o:p.o}]],ph=R(0,360),nbr=p.o===1&&rnd()<.35?3:2;
      for(let j=0;j<nbr;j++){const az=ph+j*360/nbr+R(-14,14),bw=w*(.78-.16*p.o);out.push(['[',{}],['/',{a:az}],['&',{a:66+R(-8,8)}],['Lv',{o:p.o,j}],[']',{}]);
        out.push(['[',{w:bw}],['/',{a:az+R(-10,10)}],['&',{a:(p.o===1?40:34)+R(-9,9)}],['F',{l:D*(1.25-.3*p.o)*kr*R(.85,1.12),w1:bw*.9,e:.05}]);
        if(p.o<ord&&rnd()<.85)out.push(['N',{o:p.o+1}]);out.push(['F',{l:D*(.75-.12*p.o)*kr*R(.9,1.1),w1:bw*.8,e:.04}],['K',{age:Math.max(.08,1-.3*p.o+R(-.1,.06))}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['A',{}]],rules,5),{p:[0,0,0],H:up,U:U0,wig:.03,seg:Math.max(4,D*.18),T:[0,1,0],e:.02,w:w*1.1});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'&&q.p.main),apex=V3.add(main.pos,V3.sc(main.H,D*.3));
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:DET>=1.5?6:11,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=lsFrame(og,null,R(0,6.283));return{parts:eryHead(Bf,pos,D*(og.p.main?1:.88-.1*(1-og.p.age)),cw,og.p.age,op)}}
    if(og.t==='Lv'){const lc=cw.dye?mix('#4f6e5e',cw.c,.35):mix('#4f6e5e',cw.c,cw.green?.15:.3);return{ext:1,parts:[lsLeaf2D(og,pos,D*R(.85,1.15)*(1-.15*og.p.o),(par,x,y,a,l)=>eryLeaf(par,x,y,a,l,lc,{lobes:og.p.o===1&&rnd()<.5?5:3}))]}}
    return null}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
/* ---------- garlic scape (Allium sativum var. ophioscorodon): the round, glaucous scape of hardneck garlic rises, coils once (a loop in space, crossing over itself), runs on,
   and ends in the umbel still shut in its papery spathe: a swelling drawn out into a long beak. In a bouquet it is a line: it follows the spine the composer gives it ---------- */
const CW_SNK=[{id:'glauque',n:'Vert glauque',c:'#7f9f72',sp:'#dfe3c6'},{id:'tendre',n:'Vert tendre',c:'#8aa860',sp:'#e2e6c0'},{id:'tilleul',n:'Vert tilleul (jeune)',c:'#b6c27a',sp:'#eceed0'},
  {id:'olive',n:'Vert olive (rocambole)',c:'#6f7f4a',sp:'#d8d4b8',fl:'#a07a8e'},{id:'violace',n:'Spathe violacée',c:'#7f9a6a',sp:'#e2dade',fl:'#9a6a8a'},{id:'pale',n:'Vert d\'eau pruiné',c:'#a9bca0',sp:'#eef0e2'}];
/* the scape as one tube: the chain smoothed (Catmull-Rom), shaded in four tones like the bouquet stems (body, flank, light, the gleam of its bloom toward the upper left);
   where it crosses over itself (the coil) the strand in front is drawn again over the other, clipped to a disc round the crossing — identical to what lies under it, so no seam shows */
function snkStem(par,ch,cols){const n=ch.pts.length,P=[],W=[];for(let i=0;i<n;i++){const q=ch.pts[i];if(i){const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];
      for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);P.push([cr(0),cr(1),cr(2)]);W.push(ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*t)}}P.push(q);W.push(ch.ws[i])}
  const m=P.length,S=P.map(q=>[q[0],-q[1]]),N=S.map((q,i)=>{const a=S[Math.max(0,i-1)],b=S[Math.min(m-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l]});
  const band=(a,b,k,o)=>{const A=[],B2=[];for(let i=a;i<=b;i++){const[nx,ny]=N[i],lit=Math.max(-1,Math.min(1,-(nx+ny)*1.4)),w=W[i]/2,c=o*w*lit,cx=S[i][0]+nx*c,cy=S[i][1]+ny*c;A.push(f(cx+nx*w*k)+','+f(cy+ny*w*k));B2.push(f(cx-nx*w*k)+','+f(cy-ny*w*k))}return'M'+A.join('L')+'L'+B2.reverse().join('L')+'Z'};
  const tube=(g,a,b)=>{E('path',{d:band(a,b,1,0),fill:cols[0]},g);if(LOD)return;E('path',{d:band(a,b,.7,.22),fill:cols[1]},g);E('path',{d:band(a,b,.28,.42),fill:cols[2],opacity:.9},g);E('path',{d:band(a,b,.09,.5),fill:cols[3],opacity:.55},g)};
  const g=G(par);tube(g,0,m-1);
  /* crossings in the picture: the nearer strand passes over */
  const X=[];for(let i=0;i<m-1;i++)for(let j=i+8;j<m-1;j++){const p=S[i],r=[S[i+1][0]-p[0],S[i+1][1]-p[1]],q=S[j],s2=[S[j+1][0]-q[0],S[j+1][1]-q[1]],den=r[0]*s2[1]-r[1]*s2[0];if(Math.abs(den)<1e-9)continue;
    const u=((q[0]-p[0])*s2[1]-(q[1]-p[1])*s2[0])/den,v=((q[0]-p[0])*r[1]-(q[1]-p[1])*r[0])/den;if(u<0||u>1||v<0||v>1)continue;const x=[p[0]+r[0]*u,p[1]+r[1]*u],zi=P[i][2]+(P[i+1][2]-P[i][2])*u,zj=P[j][2]+(P[j+1][2]-P[j][2])*v;
    if(X.every(c=>Math.hypot(c.x[0]-x[0],c.x[1]-x[1])>W[i]*2))X.push({x,k:zj>zi?j:i})}
  for(const c of X){const rr=Math.max(W[c.k],2)*1.6,cid='sc'+(gid++),cl=E('clipPath',{id:cid},GDEF||defs);E('circle',{cx:f(c.x[0]),cy:f(c.x[1]),r:f(rr)},cl);
    let a=c.k,b=c.k,la=0,lb=0;while(a>0&&la<rr*2.5){la+=Math.hypot(S[a][0]-S[a-1][0],S[a][1]-S[a-1][1]);a--}while(b<m-1&&lb<rr*2.5){lb+=Math.hypot(S[b+1][0]-S[b][0],S[b+1][1]-S[b][1]);b++}
    tube(G(g,{'clip-path':`url(#${cid})`}),a,b)}
  return g}
function snkPlant(g,t,o){const cw=o.cw||cwNear(CW_SNK,o.col)||CW_SNK[0],op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],det=DET>=1.5;
  const g0=cw.c,sc=[shd(g0,-.58),shd(g0,-.12),mix(g0,'#d4e2d0',.5),'#f2f6ee'],w0=Math.max(2.4,.56*UPC),Lt=o.spine?blen(o.spine):(o.cm||50)*UPC*R(.94,1.02);
  /* the axis it grows along: the composer's spine in a bouquet, upright in the frame of the view on a sheet */
  const B=o.spine?null:frameOf(o,0),bw=R(-.04,.04),A=o.spine?spAxis(o,Lt,{face:0}):spAxis(o,Lt,{C:[[0,0,0],[bw*Lt*.12,Lt*.34,0],[bw*Lt*.5,Lt*.68,0],[bw*Lt,Lt,0]],Fr:B[2]}),L=A.L,tg=s=>A.at(Math.max(0,Math.min(1,s))).T,dir=rnd()<.5?-1:1;
  /* sizes from life: the coil 4–6 cm across, the swelling of the spathe 1.2–1.6 cm wide, the beak 6–10 cm; a short line keeps them a little smaller */
  const fit=Math.max(.62,Math.min(1,L/(40*UPC))),turns=(.62+.48*sm01(op/.55))*(rnd()<.3?R(1.4,1.85):R(.95,1.2)),rc=Math.min(L*.085,UPC*R(2.3,3.4)*fit*(.85+.15*op)/Math.sqrt(Math.max(1,turns))),Lsp=UPC*R(3.2,4)*fit*(.75+.25*op),Lbk=UPC*R(6,8.5)*fit,
    nc=Math.round(det?44:32),dlc=2*Math.PI*rc*turns/nc*1.18,Lrest=Math.min(L*.2,UPC*R(5,8)),sTip=1-(Lsp+Lbk)/L,sc0=Math.max(.42,sTip-Lrest/L-.02),seg=det?6:8;
  const n1=Math.max(2,Math.round(L*sc0/seg)),n2=Math.max(1,Math.round(L*(sTip-sc0)/seg)),n3=Math.max(3,Math.round((Lsp+Lbk)/(seg*.7))),wsum=(()=>{let s=0;for(let i=0;i<nc;i++)s+=Math.pow(Math.sin(Math.PI*(i+.5)/nc),1.25);return s})();
  const tilt=dir*R(28,52),pz=R(2.2,3.6);
  /* the L-system: A → R; R(i) → F(aim) R(i+1) (it rises along its axis) … then / C; C(i) → +(κ) &(τ) F C(i+1): the coil, its curvature swelling and fading, a slight pitch out
     of its plane and back so it crosses over itself; Q(i) → F(aim) Q(i+1): it runs on; then Sp [ P … Tp ]: the spathe and its beak on their own axis */
  const rules={A:()=>[['R',{i:0}]],
    R:p=>p.i<n1?[['F',{l:L*sc0/n1,aim:tg(sc0*(p.i+1)/n1),k:.5,w1:w0*(1-.08*(p.i+1)/n1)}],['R',{i:p.i+1}]]:[['/',{a:tilt}],['C',{i:0}]],
    C:p=>p.i<nc?[['+',{a:dir*360*turns*Math.pow(Math.sin(Math.PI*(p.i+.5)/nc),1.25)/wsum}],['&',{a:pz*Math.sin(2*Math.PI*(p.i+.5)/nc)}],['F',{l:dlc,w1:w0*(.92-.04*p.i/nc)}],['C',{i:p.i+1}]]:[['/',{a:-tilt*.6}],['Q',{i:0}]],
    Q:p=>p.i<n2?[['F',{l:L*(sTip-sc0)/n2,aim:tg(sc0+(sTip-sc0)*(p.i+1)/n2),k:.32,w1:w0*(.88-.06*(p.i+1)/n2)}],['Q',{i:p.i+1}]]:[['Sp',{}],['[',{w:w0*.82}],['P',{i:0}]],
    P:p=>p.i<n3?[['F',{l:(Lsp+Lbk)/n3,aim:V3.nz(V3.add(tg(sTip+(1-sTip)*(p.i+1)/n3),[0,-.12*(p.i/n3),0])),k:.28}],['P',{i:p.i+1}]]:[['Tp',{}],[']',{}]]};
  const U0=B?B[2]:[0,0,1],res=lsTurtle(lsDerive([['A',{}]],rules,n1+nc+n2+n3+8),{p:A.cb(0),H:tg(0),U:U0,wig:.012,seg:Math.max(2.5,dlc*.95),w:w0});
  const scape=res.chains.find(c=>c.ord===0),spc=res.chains.find(c=>c.ord===1);scape.c=sc;
  parts.push({z:-1e6,cast:false,fn:par=>snkStem(par,scape,sc)});
  /* the spathe: a papery swelling (cream green, flushed in some), then the beak, both on the last stretch of the scape; fine veins along the swelling */
  if(spc&&spc.pts.length>3){const P3=spc.pts,n=P3.length-1,r0=w0*.43,rb=UPC*R(.7,.82)*(.7+.3*op)*fit,tb=Lsp/(Lsp+Lbk),
      rf=t=>{if(t<tb){const u=t/tb;return u<.35?r0+(rb-r0)*Math.sin(u/.35*Math.PI/2):r0*.8+(rb-r0*.8)*(1-sm01((u-.35)/.65))}return Math.max(.18,r0*.8*Math.pow(1-(t-tb)/(1-tb),.9))},
      spcol=cw.sp,c1=cw.fl?mix(spcol,cw.fl,.5):shd(spcol,-.06),ib=Math.max(2,Math.round(n*tb)+1),
      bulb=tube3({B:I3,O:[0,0,0]},P3.slice(0,ib+1),q=>rf(q*ib/n),{cols:[mix(spcol,g0,.75),mix(spcol,g0,.4),c1,mix(spcol,g0,.25)],cap:0,hl:.4,dk:.4,spec:.32,ink:shd(spcol,-.6),eo:.42,cast:0}),
      beak=tube3({B:I3,O:[0,0,0]},P3.slice(ib-1),q=>rf((ib-1+q*(n-ib+1))/n),{cols:[mix(spcol,g0,.3),mix(spcol,g0,.18),spcol],cap:0,hl:.3,dk:.35,spec:0,ink:shd(spcol,-.55),eo:.4,cast:0});
    beak.z=1e6;bulb.z=1e6+1;parts.push(beak,bulb);
    if(!LOD){const m=Math.max(3,Math.round(n*tb)),vs=[];for(const off of[-.5,0,.5]){const q=[];for(let i=1;i<m;i++){const a=P3[i-1],b=P3[i+1]||P3[i],dx=b[0]-a[0],dy=-(b[1]-a[1]),l=Math.hypot(dx,dy)||1,r=rf(i/n)*off;q.push([P3[i][0]-dy/l*r,-P3[i][1]+dx/l*r])}vs.push(smooth(q,false))}
      parts.push({z:1e6+2,cast:false,fn:par=>E('path',{d:vs.join(''),stroke:shd(spcol,-.3),'stroke-width':.32,'stroke-opacity':.45,fill:'none'},par)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:sc}}
/* ---------- registers: the four headed species are heads in the Composer (the giant allium also draws itself along a spine when a model makes it a line, as its old xAllium did);
   the garlic scape stays a line (its recipe's xSnake is in SPINE_FN), drawn along the spine the Composer gives it ---------- */
Object.assign(GH,{'allium-grosse-tete':(g,t,o)=>alPlant(g,t,o,CW_ALG,1),'allium-petit':(g,t,o)=>alPlant(g,t,o,CW_ALP,0),'echinops':echiPlant,'eryngium':eryPlant,'ail-serpent':snkPlant});
Object.assign(CWS,{'allium-grosse-tete':CW_ALG,'allium-petit':CW_ALP,'echinops':CW_ECHI,'eryngium':CW_ERY,'ail-serpent':CW_SNK});
Object.assign(SZG,{'allium-grosse-tete':[12,14,15,16,18],'allium-petit':[3,3.5,3.5,4,4.5],'echinops':[3,3.5,4,4,4.5,5],'eryngium':[2,2.5,2.5,3,3.5],'ail-serpent':[40,45,50,55,60]});
Object.assign(GHI,{'allium-grosse-tete':{form:'sphere',size:3,k:'head',rk:1,tip:1,self:75*UPC,fx:8*UPC},'allium-petit':{form:'sphere',size:1.6,k:'head',rk:1.1},'echinops':{form:'sphere',size:1.8,k:'head',rk:1.6},'eryngium':{form:'etoile',size:1.8,k:'head',rk:2.2},'ail-serpent':{form:'ligne',size:1,k:'plant',self:55*UPC,tip:.95,fx:5*UPC}});
for(const id of['allium-grosse-tete','allium-petit','echinops','eryngium'])GH_BUDS.add(id);
