/* ================= Serre, lot 23 — remplissage fin : statice, limonium hybride, pigamon, panic, pennisetum ================= */
/* ---------- shared: a light plant along its axis (the composer's spine in a bouquet, the cut stem standing in the view on a sheet, as the spikes of lot 8);
   its branches grown by the L-system from nodes on the axis, its many small flowers gathered by layer (behind or before the axis) and by tone into a few paths ---------- */
/* a batch of paths: every small piece lands in the path of its layer and its key (one tone, one stroke), drawn in the order of the keys */
function l23Batch(){const L={};return{add(lay,key,d,st,o=0){const q=L[lay]||(L[lay]=new Map());let e=q.get(key);if(!e){e={d:[],st,o};q.set(key,e)}e.d.push(d)},
  push(parts,zs){for(const lay in L){const es=[...L[lay].values()].sort((a,b)=>a.o-b.o);es.forEach((e,i)=>parts.push({z:zs[lay]+i*1e-3,cast:false,fn:par=>E('path',Object.assign({d:e.d.join('')},e.st),par)}))}}}}
const L23_Z={tb:-3e6,fb:-2e6,tf:2e6,ff:3e6};
const l23Cir=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
const l23Poly=P=>'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z';
/* two unit vectors across a facing n */
function l23Across(n){const a=Math.abs(n[1])<.9?[0,1,0]:[1,0,0],X=V3.nz(V3.cr(a,n));return[X,V3.cr(n,X)]}
/* a flat floret seen in 3D: nl lobes of depth dp round the centre P (view space), facing n, radius r; its outline on the screen */
function l23Disc(P,n,r,nl,dp,rot=0,m=0){const[X,Y]=l23Across(n),M=m||Math.max(8,nl*(DET>=1.5?4:2)),q=[];
  for(let i=0;i<M;i++){const th=i/M*6.283+rot,rr=r*(1-dp+dp*Math.pow(Math.abs(Math.cos(th*nl/2)),.6)),c=Math.cos(th)*rr,s=Math.sin(th)*rr;q.push([P[0]+X[0]*c+Y[0]*s,-(P[1]+X[1]*c+Y[1]*s)])}return q}
/* an ellipsoid bud or spikelet along its direction h (view space), length l, width w: its outline on the screen */
function l23Seed(P,h,l,w,n=8){const s=[h[0],-h[1]],sl=Math.hypot(s[0],s[1])||1,u=[s[0]/sl,s[1]/sl],v=[-u[1],u[0]],L=l*Math.max(.35,sl),q=[],c=[P[0]+s[0]*l*.5,-P[1]+s[1]*l*.5];
  for(let i=0;i<n;i++){const t=i/n*6.283,a=Math.cos(t)*L*.5,b=Math.sin(t)*w*.5*(1-.25*Math.cos(t));q.push([c[0]+u[0]*a+v[0]*b,c[1]+u[1]*a+v[1]*b])}return q}
/* the branches of the axis: one L-system turtle per node, leaving the axis at s round its azimuth az, at el from the axis, bending toward the plant's up (T) */
function l23Branch(A,s,az,el,rules,axiom,steps,o={}){const fr=A.at(s),r=V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az))),H=V3.nz(V3.add(V3.sc(fr.T,Math.cos(el)),V3.sc(r,Math.sin(el))));
  let U=V3s(fr.T,V3.sc(H,V3.dot(fr.T,H)));if(V3l(U)<1e-4)U=r;const res=lsTurtle(lsDerive(axiom,rules,steps),{p:fr.p,H,U:V3.nz(U),w:o.w||1,seg:o.seg||6,T:o.T||A.at(1).T,e:o.e??.04,wig:o.wig??.03});
  for(const og of res.organs){og.s0=s;og.r0=r}for(const ch of res.chains){ch.s0=s}return res}
/* a polyline resampled every `step` (screen points, widths), so wavy flanges stay smooth */
function l23Resample(P,W,step){const out=[P[0]],ow=[W[0]],cl=[0];let acc=0;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(l/step));
    for(let j=1;j<=n;j++){const t=j/n;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);ow.push(W[i-1]+(W[i]-W[i-1])*t);cl.push(acc+l*t)}acc+=l}return{P:out,W:ow,C:cl}}
/* the twigs: every chain as a tapered ribbon (perhaps winged: wavy flanges), in the layer behind or before the axis at its node */
function l23Twigs(bt,A,chains,col,o={}){const wm=o.min??.45;for(const ch of chains){const n=ch.pts.length;if(n<2)continue;let z=0;for(const q of ch.pts)z+=q[2];z/=n;const lay=z<A.cb(ch.s0??1)[2]?'tb':'tf',P0=ch.pts.map(q=>[q[0],-q[1]]);
    if(o.wing){const{P,W,C}=l23Resample(P0,ch.ws,1.6),ph=R(0,6.283),wf=i=>Math.max(wm,W[i])/2+o.wing*(.5+.5*Math.sin(C[i]*6.283/o.lam+ph))*Math.min(1,C[i]/4);
      bt.add(lay,'tw',polyRibbon(P,wf),{fill:col[2]},-3);bt.add(lay,'tm',polyRibbon(P0,i=>Math.max(wm,ch.ws[i])/2),{fill:col[1]},-2);if(!LOD)bt.add(lay,'th',polyRibbon(P0,i=>Math.max(wm,ch.ws[i])*.18,i=>Math.max(wm,ch.ws[i])*.2),{fill:col[3],opacity:.5},-1)}
    else bt.add(lay,'tw',polyRibbon(P0,i=>Math.max(wm,ch.ws[i])/2),{fill:col[1]},-2)}}
/* the colourway asked for (a product), else the nearest */
const l23Cw=(list,o)=>o.cw||list.find(w=>w.c===o.col)||cwNear(list,o.col)||list[0];
/* the axis of a light plant: Lt long (base to tip) on a sheet; in a bouquet the spine; the stem drawn from `from` (the composer draws below) */
function l23Axis(o,Lt,face){return spAxis(o,Lt,{face:face??R(-.7,.7),bow:R(-.05,.05)})}

/* ---------- statice (Limonium sinuatum): stiff stems with three or four wavy wings, forking at the top into a flat corymb of short one-sided spikes;
   every spikelet a funnel of papery coloured calyx (the 'flower', dry and lasting) round a tiny white corolla ---------- */
const L23_CW_STAT=[{id:'bleu-fonce',n:'Bleu foncé',c:'#3f4ca6'},{id:'bleu',n:'Bleu ciel',c:'#7f97d8'},{id:'violet',n:'Violet',c:'#6c4c9e'},{id:'lavande',n:'Lavande',c:'#a99bd2'},
  {id:'rose',n:'Rose',c:'#e398b8'},{id:'carmin',n:'Rose carmin',c:'#c8457e'},{id:'rouge',n:'Rouge (Sunset)',c:'#b8333f'},{id:'abricot',n:'Abricot',c:'#f2b48a'},
  {id:'jaune',n:'Jaune',c:'#f0d35a'},{id:'blanc',n:'Blanc',c:'#f3f0e6',co:'#f1e4a0'}];
/* a convex hull on the screen (a funnel: its limb and its foot together) */
function l23Hull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}
  return lo.slice(0,-1).concat(up.slice(0,-1))}
function l23Statice(g,t,o){const cw=l23Cw(L23_CW_STAT,o),op=Math.max(.05,Math.min(1,o.op??R(.88,1))),k=G(g),parts=[],bt=l23Batch(),SC=['#2f4a22','#557a38','#7fa25a','#bcd494'],
    Dc=(o.cm||12)*UPC*R(.95,1.05),Hi=Dc*1.05,Lt=o.spine?blen(o.spine):Hi*2.6,A=l23Axis(o,Lt),L=A.L,s0=o.spine?Math.max(A.sOf(L-Hi),(o.from||0)+.06):A.sOf(L-Hi),sF=o.spine?Math.min(o.from||0,s0*.9):0,P=pal7(cw.c),w0=.5*UPC;
  /* the stem: round under its wavy wings, forking at the top */
  spStem(A,parts,[sF,(sF+s0)/2,s0,s0+(1-s0)*.5,1],w0,w0*.45,SC,1,sF);
  {const P0=[],W0=[];for(let i=0;i<=30;i++){const s=sF+(1-sF)*i/30,p=A.cb(s);P0.push([p[0],-p[1]]);W0.push(w0*(1-.55*i/30))}const{P:Pw,W,C}=l23Resample(P0,W0,1.6),ph=R(0,6);
    parts.push({z:A.cb(s0)[2]-.5,cast:false,fn:par=>E('path',{d:polyRibbon(Pw,i=>W[i]/2+W[i]*(.28+.2*Math.sin(C[i]*6.283/(2.2*UPC)+ph))),fill:SC[2]},par)})}
  /* the branches: forked twice, the lower ones longer and more spread so the corymb is flat-topped; tropism up */
  const nb=Math.round(R(5,7)),sd0=R(0,6.283),wb=.26*UPC;
  const rules={B:p=>{const l=p.l,w=p.w;if(p.o>=p.m)return[['F',{l,w0:w,w1:w*.75}],['C',{o:p.o}]];const a=R(70,110);
    return[['F',{l:l*.42,w0:w,w1:w*.85}],['[',{w:w*.75}],['/',{a}],['&',{a:R(34,48)}],['B',{o:p.o+1,m:p.m,l:l*.62,w:w*.75}],[']',{}],['F',{l:l*.3,w1:w*.75}],['[',{w:w*.7}],['/',{a:a+180+R(-20,20)}],['&',{a:R(30,44)}],['B',{o:p.o+1,m:p.m,l:l*.52,w:w*.7}],[']',{}],['F',{l:l*.24,w1:w*.65}],['C',{o:p.o}]]}};
  const orgs=[];for(let j=0;j<nb;j++){const u=j/(nb-1),s=s0+(1-s0)*(.04+.8*u)*R(.97,1.03),az=sd0+j*2.4+R(-.2,.2),el=(58-20*u)*D,len=Dc*(.62-.32*u)*R(.9,1.1);
    const res=l23Branch(A,s,az,el,rules,[['B',{o:0,m:j<nb-1?2:1,l:len,w:wb}]],5,{seg:Dc*.05,e:.05,w:wb});l23Twigs(bt,A,res.chains,SC,{wing:.24*UPC,lam:1.7*UPC,min:.6});orgs.push(...res.organs)}
  {const fr=A.at(1);orgs.push({t:'C',p:{o:2},pos:fr.p,H:fr.T,U:fr.Fr,s0:1})}
  /* the spikes: five to ten spikelets in two rows on the upper side of each branch end, their funnels of papery calyx looking up and out */
  const Tp=A.at(1).T,rc=.36*UPC*R(.95,1.05),tones=[.3,.48,.66,.84].map(I=>toneAt(P,I)),ink=shd(cw.c,-.45),lite=h2l(cw.c)[2]>.8,bud=mix(cw.c,'#8aa060',.6),
    st=(c,ed)=>({fill:c,stroke:ed,'stroke-width':LOD?0:.28,'stroke-opacity':.55,'stroke-linejoin':'round'});
  for(const og of orgs){const zc=A.cb(og.s0)[2],nc=Math.round(R(6,11)*(og.p.o>1?.85:1)),H=V3.nz(V3.add(og.H,V3.sc(Tp,.5))),Up=V3.nz(V3s(Tp,V3.sc(H,V3.dot(Tp,H)))),Sd=V3.cr(Up,H);
    for(let i=0;i<nc;i++){const a=i/(nc-1||1),row=(i%3)-1,pos=V3.add(V3.add(og.pos,V3.sc(H,(a-.1)*rc*nc*.5+R(-.2,.2)*rc)),V3.add(V3.sc(Up,rc*R(.4,1)),V3.sc(Sd,row*rc*R(.6,.9)))),lay=pos[2]<zc?'fb':'ff',
        age=op*1.3-a*.45-R(0,.2),n=V3.nz(V3.add(V3.add(V3.sc(Up,.8),V3.sc(Sd,row*.45)),[R(-.25,.25),R(-.15,.15),R(.1,.45)]));
      if(age<.35){/* a closed calyx: a pale green spindle tipped with its colour */
        const q=l23Seed(V3.add(pos,V3.sc(n,-rc*.6)),n,rc*1.5,rc*.6);bt.add(lay,'b',l23Poly(q),{fill:mix(bud,cw.c,age*1.6),stroke:'#4f6838','stroke-width':LOD?0:.25,'stroke-opacity':.5},1);continue}
      const op2=Math.min(1,(age-.35)/.45),r=rc*(.5+.5*op2),q=l23Disc(pos,n,r,5,.2*op2,R(0,1.2)),foot=V3.add(pos,V3.sc(n,-rc*1.3)),I=Math.abs(lightI(n))+R(-.06,.06),ti=Math.max(0,Math.min(3,Math.round((I-.3)/.18)));
      /* the funnel seen from outside (a shade darker), then its open limb when it looks our way */
      bt.add(lay,'h'+ti,l23Poly(l23Hull(q.concat([[foot[0],-foot[1]]]))),st(tones[Math.max(0,ti-1)],ink),2+ti);
      if(n[2]>.05){bt.add(lay,'c'+ti,DET>=1.5?smooth(q):l23Poly(q),st(tones[ti],lite?shd(cw.c,-.3):ink),6+ti);
        /* the corolla: a tiny white star at the throat */
        if(n[2]>.25&&op2>.6&&rnd()<.75){const cp=V3.add(pos,V3.sc(n,r*.1));bt.add(lay,'co',l23Cir(cp[0],-cp[1],r*.16),{fill:cw.co||'#faf8f2'},10)}}}}
  bt.push(parts,L23_Z);drawParts(k,parts);open(k,t,1000,0,.5);return{k,bw:w0,bc:SC}}
Object.assign(GH,{'statice-sinuata':l23Statice});CWS['statice-sinuata']=L23_CW_STAT;SZG['statice-sinuata']=[8,10,12,12,14];
GHI['statice-sinuata']={form:'grappe',size:1.2,k:'plant',rk:.8};

/* ---------- limonium hybride (L. latifolium × bellidifolium 'Misty', 'Diamond', L. sinense): a wiry stem forking again and again into a wide cloud;
   tiny flowers in short spikes at the tips, each a papery white calyx round a coloured corolla of five lobes ---------- */
const L23_CW_LIMH=[{id:'bleu-brume',n:'Bleu brume (Misty Blue)',c:'#a9b4dc'},{id:'bleu',n:'Bleu (Diamond Blue)',c:'#7088cc'},{id:'bleu-nuit',n:'Bleu nuit (Blue Fantasia)',c:'#4a58a8'},
  {id:'lavande',n:'Lavande',c:'#c4a7d7'},{id:'mauve',n:'Mauve',c:'#b47aa6'},{id:'rose',n:'Rose (Misty Pink)',c:'#e8a7c1'},{id:'blanc',n:'Blanc (Misty White)',c:'#f3f1ea',k:'#f6f3ea'},
  {id:'jaune',n:'Jaune pâle (sinense)',c:'#eedf98',k:'#f6f2dc'}];
function l23LimHyb(g,t,o){const cw=l23Cw(L23_CW_LIMH,o),op=Math.max(.05,Math.min(1,o.op??R(.88,1))),k=G(g),parts=[],bt=l23Batch(),SC=['#3b5228','#62803e','#93ad6a','#c4d6a0'],
    Hc=(o.cm||35)*UPC*R(.95,1.05),Hi=Hc*.8,Lt=o.spine?blen(o.spine):Hi*2,A=l23Axis(o,Lt),L=A.L,s0=o.spine?Math.max(A.sOf(L-Hi),(o.from||0)+.06):A.sOf(L-Hi),sF=o.spine?Math.min(o.from||0,s0*.9):0,w0=.32*UPC;
  spStem(A,parts,[sF,(sF+s0)/2,s0,s0+(1-s0)*.5,1],w0,w0*.35,SC,1,sF);
  /* forked three times, wiry and zigzag; the lower branches longer and more spread, so the cloud is a wide dome */
  const nb=Math.round(R(9,11)),sd0=R(0,6.283),wb=.13*UPC,tw=[];
  const rules={B:p=>{const l=p.l,w=p.w;if(p.o>=p.m)return[['F',{l,w0:w,w1:w*.6}],['S',{o:p.o}]];const a=R(70,110);
    return[['F',{l:l*.42,w0:w,w1:w*.85}],['[',{w:w*.7}],['/',{a}],['&',{a:R(32,50)}],['B',{o:p.o+1,m:p.m,l:l*.6,w:w*.7}],[']',{}],['F',{l:l*.3,w1:w*.75}],['[',{w:w*.7}],['/',{a:a+180+R(-25,25)}],['&',{a:R(30,48)}],['B',{o:p.o+1,m:p.m,l:l*.52,w:w*.7}],[']',{}],['F',{l:l*.24,w1:w*.6}],['S',{o:p.o}]]}};
  const orgs=[];for(let j=0;j<nb;j++){const u=j/(nb-1),s=s0+(1-s0)*(.03+.84*u)*R(.97,1.03),az=sd0+j*2.4+R(-.2,.2),el=(62-26*u)*D,len=Hi*(.6-.34*u)*R(.9,1.1);
    const res=l23Branch(A,s,az,el,rules,[['B',{o:0,m:u<.75?3:2,l:len,w:wb}]],6,{seg:Hc*.03,e:.04,wig:.09,w:wb});l23Twigs(bt,A,res.chains,SC,{min:.6});orgs.push(...res.organs);tw.push(...res.chains)}
  {const fr=A.at(1);orgs.push({t:'S',p:{o:3},pos:fr.p,H:fr.T,U:fr.Fr,s0:1})}
  /* the florets: crowded in short one-sided spikes along the last forks and at every tip; seen from afar a haze of the corolla's colour on white calyces */
  const Tp=A.at(1).T,rf=.19*UPC,P=pal7(cw.c),kc=cw.k||mix(cw.c,'#f8f6f0',.72),cols=[shd(cw.c,-.22),cw.c,mix(cw.c,kc,.45),kc],bud=mix(cw.c,'#9fb37a',.55),fl=[];
  for(const og of orgs)for(let i=0,nf=Math.round(R(4,8));i<nf;i++)fl.push([og.pos,og.H,og.s0,i/nf]);
  for(const ch of tw)if(ch.ord>=1)for(let i=Math.floor(ch.pts.length*(ch.ord>=2?.25:.55));i<ch.pts.length-1;i++)for(let j=rnd()<.5?2:1;j>0;j--)fl.push([ch.pts[i],V3.nz(V3s(ch.pts[i+1],ch.pts[i])),ch.s0,R(0,.4)]);
  for(const[p0,h,s,a]of fl){const zc=A.cb(s)[2],pos=V3.add(p0,V3.add(V3.sc(V3.nz(V3.add(h,V3.sc(Tp,.5))),a*rf*3),[R(-.5,.5)*rf,R(.1,.8)*rf,R(-.5,.5)*rf])),lay=pos[2]<zc?'fb':'ff',age=op*1.3-a*.4-R(0,.3);
    if(age<.4){bt.add(lay,'b',l23Cir(pos[0],-pos[1],rf*(.62+.3*age)),{fill:mix(bud,cw.c,.3+age*1.2)},1);continue}
    const n=V3.nz(V3.add(V3.sc(Tp,.6),[R(-.7,.7),R(-.3,.3),R(-.2,.8)])),I=lightI(n),ci=n[2]<0?3:I>.75?2:rnd()<.5?1:0,r=rf*(.75+.25*Math.min(1,(age-.4)/.4));
    bt.add(lay,'f'+ci,l23Cir(pos[0],-pos[1],r),{fill:cols[ci]},2+ci);
    /* up close: the corolla's five lobes in the calyx */
    if(DET>=1.5&&n[2]>0){const q=l23Disc(V3.add(pos,V3.sc(n,r*.3)),n,r*.62,5,.3,R(0,1.3),10);bt.add(lay,'c',l23Poly(q),{fill:toneAt(P,I),stroke:P.d1,'stroke-width':.12},8)}}
  bt.push(parts,L23_Z);drawParts(k,parts);open(k,t,1000,0,.5);return{k,bw:w0,bc:SC}}
Object.assign(GH,{'limonium-hybride':l23LimHyb});CWS['limonium-hybride']=L23_CW_LIMH;SZG['limonium-hybride']=[25,30,35,35,40];
GHI['limonium-hybride']={form:'grappe',size:1.1,k:'plant',rk:.42};

/* ---------- pigamon (Thalictrum): a tall slender stem, glaucous or purple-black, opening into a loose airy panicle of small flowers on thread-like pedicels;
   no petals: a puff of clubbed coloured stamens (T. aquilegiifolium) or four lilac sepals round a tassel of yellow stamens (T. delavayi, T. rochebruneanum); leaves cut like a columbine's ---------- */
const L23_CW_THAL=[{id:'mauve',n:'Mauve (aquilegiifolium)',c:'#b98ac8',an:'#efe2f0'},{id:'rose',n:'Rose mauve',c:'#d8a6cf',an:'#f6eaf0'},{id:'pourpre',n:'Pourpre (Thundercloud)',c:'#a2489a',an:'#e8c8e0'},
  {id:'violet',n:'Violet (Black Stockings)',c:'#8a5ca6',an:'#e6d6ee',st:'#3a2232'},{id:'blanc',n:'Blanc (Album)',c:'#f5f2ec',an:'#f2ecc8'},
  {id:'lilas',n:'Lilas à étamines jaunes (delavayi)',c:'#b9a2d4',an:'#e8cf3a',f:'del'},{id:'lavande',n:'Lavande (rochebruneanum)',c:'#a796cc',an:'#e6cc48',f:'del',st:'#4a2a3e'},
  {id:'blanc-del',n:'Blanc à étamines jaunes (Splendide White)',c:'#f4f0f2',an:'#e6cc40',f:'del'}];
/* a columbine-like leaf: a petiole, three stalked divisions of three rounded, three-lobed leaflets; foreshortened by its tilt */
function l23ThalLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.cos(o.tilt??R(.2,.7)),pl=len*.32;let bl='',dk='',st=`M0,0L${f(pl)},0`;
  const lf=(x0,y0,a,s)=>{const c=Math.cos(a),sn=Math.sin(a),q=[],h=[],cx=x0+c*s*.27,cy=y0+sn*s*.27;for(let i=0;i<22;i++){const ph=-Math.PI+i/22*6.283,rr=s*.5*(1+.24*Math.cos(3*ph)*Math.max(0,Math.cos(ph)+.3))*(1-.42*Math.max(0,-Math.cos(ph))),
      px=cx+Math.cos(a+ph)*rr,py=(cy+Math.sin(a+ph)*rr)*ct;q.push([px,py]);if(Math.sin(ph)>0)h.push([px,py])}bl+=smooth(q);dk+=smooth(h.concat([[cx,cy*ct]]))};
  for(const a1 of[-.85,0,.85]){const l1=len*(a1?.32:.38),ex=pl+Math.cos(a1)*l1*.62,ey=Math.sin(a1)*l1*.62;st+=`M${f(pl)},0L${f(ex)},${f(ey*ct)}`;
    for(const a2 of[-.8,0,.8]){const a=a1+a2*R(.95,1.2),s=l1*(a2?.36:.42)*R(.9,1.08),bx=ex+Math.cos(a)*s*.35,by=ey+Math.sin(a)*s*.35;st+=`M${f(ex)},${f(ey*ct)}L${f(bx)},${f(by*ct)}`;lf(bx,by,a,s)}}
  E('path',{d:st,stroke:P.d1,'stroke-width':f(Math.max(.45,len*.013)),fill:'none','stroke-linecap':'round'},g);E('path',{d:bl,fill:toneAt(P,o.I??.62),stroke:P.ink,'stroke-width':.35,'stroke-opacity':.45},g);
  if(!LOD)E('path',{d:dk,fill:P.d1,opacity:.35},g);return g}
function l23Thal(g,t,o){const cw=l23Cw(L23_CW_THAL,o),del=cw.f==='del',op=Math.max(.05,Math.min(1,o.op??R(.88,1))),k=G(g),parts=[],bt=l23Batch(),
    sc0=cw.st||'#5f7a52',SC=[shd(sc0,-.45),sc0,mix(sc0,'#a8b898',.35),mix(sc0,'#d8e0c8',.5)],Hc=(o.cm||35)*UPC*R(.95,1.05),Hi=Hc*.85,Lt=o.spine?blen(o.spine):Hi*2.1,A=l23Axis(o,Lt),L=A.L,s0=o.spine?Math.max(A.sOf(L-Hi),(o.from||0)+.06):A.sOf(L-Hi),sF=o.spine?Math.min(o.from||0,s0*.9):0,w0=.38*UPC;
  spStem(A,parts,[sF,(sF+s0)/2,s0,s0+(1-s0)*.5,1],w0,w0*.35,SC,1,sF);
  /* the leaves: two or three on the stem under the panicle, smaller upward, never down in the vessel */
  const lc=mix('#7f9c8a',sc0,.1);for(let j=0;j<3;j++){const l=(L-Hi)*(.45+.27*j)+Hi*.04*j,s=A.sOf(l);if(o.spine&&(s<sF+.04||l<16*UPC))continue;const p=A.cb(s),T=A.at(s).T,sd=j%2?1:-1,ang=Math.atan2(-T[1],T[0])+sd*R(40,60)*D,len=Hc*(.42-.1*j)*R(.9,1.1);
    parts.push({z:A.zk(s,p[2]+(j%2?.5:-.5)),fn:par=>l23ThalLeaf(par,p[0],-p[1],ang,len,lc,{tilt:R(.2,.65)})})}
  /* the panicle: eight or ten branches, forked twice, ending in small cymes on long pedicels */
  const nb=Math.round(R(8,10)),sd0=R(0,6.283),wb=.14*UPC,tw=[];
  const rules={B:p=>{const l=p.l,w=p.w;if(p.o>=p.m)return[['F',{l,w0:w,w1:w*.6}],['K',{o:p.o}]];const a=R(70,110);
    return[['F',{l:l*.4,w0:w,w1:w*.85}],['[',{w:w*.7}],['/',{a}],['&',{a:R(35,55)}],['B',{o:p.o+1,m:p.m,l:l*.58,w:w*.7}],[']',{}],['F',{l:l*.32,w1:w*.75}],['[',{w:w*.7}],['/',{a:a+180+R(-25,25)}],['&',{a:R(35,52)}],['B',{o:p.o+1,m:p.m,l:l*.5,w:w*.7}],[']',{}],['F',{l:l*.28,w1:w*.6}],['K',{o:p.o}]]}};
  const orgs=[];for(let j=0;j<nb;j++){const u=j/(nb-1),s=s0+(1-s0)*(.02+.85*u)*R(.97,1.03),az=sd0+j*2.4+R(-.2,.2),el=(55-22*u)*D,len=Hi*(.55-.3*u)*R(.9,1.1);
    const res=l23Branch(A,s,az,el,rules,[['B',{o:0,m:u<.7?2:1,l:len,w:wb}]],5,{seg:Hc*.035,e:.035,wig:.05,w:wb});l23Twigs(bt,A,res.chains,SC,{min:.6});orgs.push(...res.organs)}
  {const fr=A.at(1);orgs.push({t:'K',p:{o:2},pos:fr.p,H:fr.T,U:fr.Fr,s0:1})}
  /* the flowers: two to four on thread-like pedicels from each tip, the outer ones younger; aquilegiifolium looks up, delavayi nods */
  const Tp=A.at(1).T,rs=(del?.62:.55)*UPC,P=pal7(cw.c),lite=h2l(cw.c)[2]>.8,fc=[shd(cw.c,-.25),cw.c,lt(cw.c,.3)],bud=mix(cw.c,del?'#8a7aa0':'#8a5a80',.35),pw=.7;
  for(const og of orgs){const zc=A.cb(og.s0)[2],nf=Math.round(R(3,6));
    for(let i=0;i<nf;i++){const a=i/nf,dir=V3.nz(V3.add(V3.add(og.H,V3.sc(Tp,del?-.1:.5)),[R(-.9,.9),R(-.3,.5),R(-.9,.9)])),pl=rs*R(1.6,2.8),pos=V3.add(og.pos,V3.sc(dir,pl)),lay=pos[2]<zc?'fb':'ff',age=op*1.25-a*.45-R(0,.2);
      bt.add(lay==='fb'?'tb':'tf','pd',`M${f(og.pos[0])},${f(-og.pos[1])}Q${f(og.pos[0]+dir[0]*pl*.5)},${f(-og.pos[1]-dir[1]*pl*.5+pl*.12)} ${f(pos[0])},${f(-pos[1])}`,{stroke:SC[1],'stroke-width':pw,fill:'none'},0);
      if(age<.4){bt.add(lay,'b',l23Cir(pos[0],-pos[1],rs*(.28+.25*age)),{fill:bud,stroke:shd(bud,-.4),'stroke-width':LOD?0:.2},1);continue}
      const op2=Math.min(1,(age-.4)/.45),n=del?V3.nz(V3.add(V3.sc(dir,.6),[0,-.55,.35])):V3.nz(V3.add(V3.sc(dir,.5),V3.sc(Tp,.6)));
      if(del){/* four lilac sepals spread round the centre, a tassel of yellow stamens hanging from it */
        const I=Math.abs(lightI(n)),ti=I<.45?0:I<.75?1:2,q=l23Disc(pos,n,rs*(.55+.45*op2),4,.62,R(0,1.6),DET>=1.5?24:12);
        bt.add(lay,'s'+ti,smooth(q),{fill:fc[ti],stroke:lite?shd(cw.c,-.35):P.d1,'stroke-width':LOD?0:.25,'stroke-opacity':.55},2+ti);
        let d='',dd='';for(let j=0;j<7;j++){const e=V3.add(pos,V3.add(V3.sc([0,-1,0],rs*R(.5,.95)*op2),[R(-.35,.35)*rs,0,R(-.35,.35)*rs]));d+=`M${f(pos[0])},${f(-pos[1])}L${f(e[0])},${f(-e[1])}`;dd+=l23Cir(e[0],-e[1],rs*.09)}
        bt.add(lay,'sf',d,{stroke:mix(cw.an,'#f4f0d8',.4),'stroke-width':.3,fill:'none'},6);bt.add(lay,'sa',dd,{fill:cw.an},7);bt.add(lay,'sr',l23Cir(pos[0],-pos[1],rs*.14),{fill:mix(SC[1],cw.an,.3)},8)}
      else{/* a puff of clubbed filaments: a soft ball of the colour, its filaments radiating, a pale anther on each */
        const rr=rs*(.55+.45*op2),[X,Y]=l23Across(n);bt.add(lay,'p',l23Cir(pos[0]+n[0]*rr*.25,-pos[1]-n[1]*rr*.25,rr*.62),{fill:fc[1],opacity:.55},2);let d0='',d1='',da='';
        for(let j=0;j<(DET>=1.5?18:12);j++){const th=j*2.4,rad=Math.sqrt((j+.5)/(DET>=1.5?18:12)),v=V3.nz(V3.add(V3.sc(n,1.1-rad*.6),V3.add(V3.sc(X,Math.cos(th)*rad),V3.sc(Y,Math.sin(th)*rad)))),e=V3.add(pos,V3.sc(v,rr*R(.85,1.05)));
          const seg=`M${f(pos[0])},${f(-pos[1])}L${f(e[0])},${f(-e[1])}`;if(lightI(v)>.6)d1+=seg;else d0+=seg;da+=l23Cir(e[0],-e[1],rr*.1)}
        bt.add(lay,'f0',d0,{stroke:fc[0],'stroke-width':.32,fill:'none','stroke-linecap':'round'},3);bt.add(lay,'f1',d1,{stroke:fc[2],'stroke-width':.32,fill:'none','stroke-linecap':'round'},4);bt.add(lay,'fa',da,{fill:cw.an},5)}}}
  bt.push(parts,L23_Z);drawParts(k,parts);open(k,t,1000,0,.5);return{k,bw:w0,bc:SC}}
Object.assign(GH,{'pigamon':l23Thal});CWS['pigamon']=L23_CW_THAL;SZG['pigamon']=[25,30,35,35,40];
GHI['pigamon']={form:'grappe',size:1.1,k:'plant',rk:.45,self:75*UPC,fx:10*UPC};

/* ---------- grasses: a linear blade from a node, arching out and down under its weight (drawn on the screen, folded on its midrib) ---------- */
const L23_GRASS=t=>Math.min(1,t/.06)*(1-Math.pow(t,2.2))*.9+.1*(1-t);
function l23Blade(parts,A,s,side,len,wid,col,o={}){const p=A.cb(s),T=A.at(s).T,ang=Math.atan2(-T[1],T[0])+side*R(o.a0??22,o.a1??38)*D;
  parts.push({z:A.zk?A.zk(s,p[2]+side*.4):p[2],fn:par=>lanceFlat(par,p[0],-p[1],ang,len,wid,col,{bend:side*R(.12,.24),tilt:R(.1,.5),pf:L23_GRASS})})}

/* ---------- panic (Panicum virgatum, P. elegans): a slender culm with two or three linear leaves, ending in a wide diffuse panicle;
   whorls of hair-thin branches forking again, each tip a tiny spikelet on its pedicel — closed and upright in bud, spreading into a haze when open ---------- */
const L23_CW_PANI=[{id:'vert',n:'Vert tendre',c:'#8ea45c'},{id:'bleu-vert',n:'Vert bleuté (Heavy Metal)',c:'#8aa3a3'},{id:'argent',n:'Argenté',c:'#cfccc0'},
  {id:'blond',n:'Blond (Frosted Explosion)',c:'#d5c08d'},{id:'cuivre',n:'Cuivré',c:'#94664f'},{id:'pourpre',n:'Pourpre (Shenandoah)',c:'#8a4f6a'},{id:'rouge-vin',n:'Rouge vin',c:'#7a3a46'}];
function l23Panic(g,t,o){const cw=l23Cw(L23_CW_PANI,o),op=Math.max(.05,Math.min(1,o.op??R(.88,1))),k=G(g),parts=[],bt=l23Batch(),gc=h2l(cw.c)[1]<.25?'#7f9455':mix('#7f9455',cw.c,.25),
    SC=[shd(gc,-.45),gc,mix(gc,'#c8d4a8',.35),mix(gc,'#eef0dc',.5)],Hc=(o.cm||40)*UPC*R(.95,1.05),Hi=Hc*.9,Lt=o.spine?blen(o.spine):Hi*2.1,A=l23Axis(o,Lt),L=A.L,s0=o.spine?Math.max(A.sOf(L-Hi),(o.from||0)+.06):A.sOf(L-Hi),sF=o.spine?Math.min(o.from||0,s0*.9):0,w0=.22*UPC;
  spStem(A,parts,[sF,(sF+s0)/2,s0,s0+(1-s0)*.5,1],w0,w0*.3,SC,1,sF);
  /* the leaves: long, narrow, arching from the nodes of the culm */
  for(let j=o.spine?2:0;j<3;j++){const l=(L-Hi)*(.3+.3*j)+Hi*.05*j,s=A.sOf(l);if(o.spine&&(s<sF+.08||l<22*UPC))continue;l23Blade(parts,A,s,j%2?1:-1,Hc*R(.55,.8)*(1-.18*j)*(o.spine?.6:1),.035,mix('#5f7f3a',gc,.4),o.spine?{a0:12,a1:22}:{})}
  /* the panicle: pseudo-whorls of two or three capillary branches, spread by the stage, forking twice */
  const SCp=SC.map(c=>mix(c,cw.c,.4)),spread=op<.3?.18:op<.7?.55:1,nn=Math.round(R(5,7)),tw=[],orgs=[],wb=.07*UPC;
  const rules={B:p=>{const l=p.l,w=p.w;if(p.o>=p.m)return[['F',{l,w0:w,w1:w*.6}],['K',{}]];const a=R(70,110),b=(14+28*spread)*R(.8,1.2);
    return[['F',{l:l*.35,w0:w,w1:w*.85}],['[',{w:w*.7}],['/',{a}],['&',{a:b}],['B',{o:p.o+1,m:p.m,l:l*.55,w:w*.7}],[']',{}],['F',{l:l*.3,w1:w*.75}],['[',{w:w*.7}],['/',{a:a+180+R(-25,25)}],['&',{a:b}],['B',{o:p.o+1,m:p.m,l:l*.45,w:w*.7}],[']',{}],['F',{l:l*.35,w1:w*.6}],['K',{}]]}};
  for(let j=0;j<nn;j++){const u=j/nn,s=s0+(1-s0)*(.02+.86*u),nw=j<nn-2?3:2,az0=R(0,6.283);
    for(let i=0;i<nw;i++){const el=(10+(52-18*u)*spread)*D*R(.85,1.15),len=Hi*(.56-.38*u)*R(.8,1.1)*(.75+.25*spread);
      const res=l23Branch(A,s,az0+i*6.283/nw+R(-.4,.4),el,rules,[['B',{o:0,m:u<.7?2:1,l:len,w:wb}]],5,{seg:Hc*.03,e:.03,wig:.04,w:wb});l23Twigs(bt,A,res.chains,SCp,{min:.6});orgs.push(...res.organs);tw.push(...res.chains)}}
  {const fr=A.at(1);orgs.push({t:'K',pos:fr.p,H:fr.T,s0:1})}
  /* the spikelets: at every tip and along the last forks, each on a short pedicel, ovoid, two-toned (glumes lit and shaded) */
  const Tp=A.at(1).T,ls=.38*UPC,ws=.15*UPC,P=pal7(cw.c),tn=[P.d1,cw.c,P.l1],fl=[];
  for(const og of orgs)for(let i=0,n=Math.round(R(2,4));i<n;i++)fl.push([og.pos,og.H,og.s0]);
  for(const ch of tw)if(ch.ord>=1)for(let i=Math.floor(ch.pts.length*.3);i<ch.pts.length-1;i+=1)if(rnd()<.85)fl.push([ch.pts[i],V3.nz(V3s(ch.pts[i+1],ch.pts[i])),ch.s0]);
  for(const[p0,h,s]of fl){const zc=A.cb(s)[2],d=V3.nz(V3.add(V3.add(h,V3.sc(Tp,.6-.4*spread)),[R(-.6,.6)*spread,R(-.2,.4),R(-.6,.6)*spread])),pd=ls*R(.4,1.2)*(.4+.6*spread),pos=V3.add(p0,V3.sc(d,pd)),lay=pos[2]<zc?'fb':'ff',
      I=lightI(V3.nz(V3.add([0,0,1],V3.sc(d,.3))))+R(-.2,.2),ti=I<.5?0:I<.75?1:2;
    if(spread>.3)bt.add(lay==='fb'?'tb':'tf','pd',`M${f(p0[0])},${f(-p0[1])}L${f(pos[0])},${f(-pos[1])}`,{stroke:SCp[1],'stroke-width':.6,fill:'none'},0);
    bt.add(lay,'s'+ti,l23Poly(l23Seed(pos,d,ls*R(.85,1.1),ws,DET>=1.5?10:6)),{fill:tn[ti],stroke:LOD?'none':P.d2,'stroke-width':.15,'stroke-opacity':.5},2+ti)}
  bt.push(parts,L23_Z);drawParts(k,parts);open(k,t,1000,0,.5);return{k,bw:w0,bc:SC}}
Object.assign(GH,{'panicum':l23Panic});CWS['panicum']=L23_CW_PANI;SZG['panicum']=[25,30,40,40,50];
GHI['panicum']={form:'grappe',size:1.1,k:'plant',rk:.4,self:70*UPC,fx:12*UPC};

/* ---------- pennisetum (Cenchrus alopecuroides, C. villosus, C. setaceus, millet C. americanus): a thin culm arching under a dense cylindrical spike,
   a bottle-brush of fine bristles (the setae round each spikelet) — pressed to the axis in bud, spreading as it opens; the millet a thick velvety cylinder ---------- */
const L23_CW_PENN=[{id:'creme',n:'Crème (Hameln)',c:'#eee7d5'},{id:'blanc',n:'Blanc plumeux (villosum)',c:'#f6f2ea',f:'vil'},{id:'blond',n:'Blond',c:'#d6c28e'},{id:'vert',n:'Vert tendre',c:'#9cae6a'},
  {id:'rose',n:'Rose (Karley Rose)',c:'#d8a6b4'},{id:'rose-vif',n:'Rose vif (Fireworks)',c:'#d0607e',f:'set'},{id:'pourpre',n:'Pourpre (Rubrum)',c:'#a54a4c',f:'set'},
  {id:'bronze',n:'Bronze',c:'#9a6a40'},{id:'noir',n:'Prune noir (millet Purple Majesty)',c:'#3a2430',f:'mil'}];
function l23Penn(g,t,o){const cw=l23Cw(L23_CW_PENN,o),ty=cw.f||'alo',op=Math.max(.05,Math.min(1,o.op??R(.88,1))),k=G(g),parts=[],bt=l23Batch(),gc=ty==='set'||ty==='mil'?mix('#7a6a4a',cw.c,.3):'#8c9a5a',
    SC=[shd(gc,-.45),gc,mix(gc,'#c8d4a8',.3),mix(gc,'#eef0dc',.5)],Lc=(o.cm||60)*UPC,sz=Math.pow(Lc/(60*UPC),.5),
    Ls=({alo:13,vil:9,set:22,mil:24}[ty])*UPC*sz*R(.92,1.08),Rb=({alo:1.7,vil:2.8,set:1.3,mil:1.25}[ty])*UPC*sz*R(.92,1.08),sd=rnd()<.5?-1:1;
  let A;if(o.spine)A=l23Axis(o,0);else{const B=frameOf(o,0),Lt=Lc*R(.95,1.05),C=[[0,0,0],[0,Lt*.42,0],[sd*Lt*.07,Lt*.78,0],[sd*Lt*.27,Lt*.9,0]].map(p=>toV(B,p));A=spAxis(o,Lt,{C,Fr:toV(B,[0,0,1])})}
  const L=A.L,em=op<.3?.55:op<.7?.85:1,Lsp=Math.min(Ls,L*.45)*em,s0=A.sOf(L-Lsp),sF=o.spine?Math.min(o.from||0,s0*.9):0,w0=.2*UPC;
  /* the culm, and its leaves at the nodes (only well above the vessel in a bouquet) */
  spStem(A,parts,[sF,(sF+s0)/2,s0,1],w0,w0*.6,SC,1,sF);
  for(let j=0;j<(o.spine?1:2);j++){const l=(L-Lsp)*(.22+.3*j),s=A.sOf(l);if(o.spine&&(s<sF+.05||l<20*UPC))continue;l23Blade(parts,A,s,j%2?sd:-sd,Lc*R(.3,.42)*(1-.3*j),.018,'#6a7f42',{a0:10,a1:22})}
  /* in bud the spike still half in its sheath */
  if(op<.3){const sh=[],a=A.sOf(L-Lsp*1.05),b=A.sOf(L-Lsp*.4);for(let i=0;i<=8;i++){const p=A.cb(a+(b-a)*i/8);sh.push([p[0],-p[1]])}parts.push({z:A.cb(b)[2]+.5,fn:par=>E('path',{d:polyRibbon(sh,i=>w0*(.9+1.1*Math.sin(Math.PI*Math.min(1,i/7))*(1-i/9))),fill:SC[2],stroke:SC[0],'stroke-width':.3},par)})}
  /* the spike: a core of crowded spikelets, the bristles round it in rings, those behind the axis first, those before it last, lit or shaded by the way they point */
  const P=pal7(cw.c),core=[],cw2=[],N=Math.round(Lsp/(.24*UPC)),M=ty==='mil'?0:ty==='vil'?11:9,beta=(op<.3?72:op<.7?52:36)*D,lite=h2l(cw.c)[2]>.8,tn=lite?[mix(cw.c,'#8a7a62',.55),mix(cw.c,'#a89878',.3),cw.c]:[P.d1,cw.c,P.l1];
  for(let i=0;i<=N;i++){const u=i/N,s=s0+(1-s0)*u,fr=A.at(s),tp=Math.pow(Math.sin(Math.PI*Math.min(.98,.06+u*.94)),.45)*(1-.25*u);core.push([fr.p[0],-fr.p[1]]);cw2.push(Rb*(ty==='mil'?1:.36)*tp*(op<.3?.7:1));
    for(let j=0;j<M;j++){const az=j*6.283/M+i*.9+R(-.2,.2),r=V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az))),be=beta*R(.8,1.2),dv=V3.nz(V3.add(V3.sc(r,Math.cos(be)),V3.sc(fr.T,Math.sin(be)))),lb=Rb*tp*R(.75,1.1)*(op<.3?.75:1)/Math.max(.45,Math.cos(be)),
        p0=V3.add(fr.p,V3.sc(r,Rb*.25*tp)),e=V3.add(p0,V3.sc(dv,lb)),m=V3.add(V3.add(p0,V3.sc(dv,lb*.5)),V3.sc(r,lb*.08)),I=lightI(V3.nz(V3.add(r,[0,0,.3])))+R(-.1,.1),lay=r[2]<0?'fb':'ff',ti=lay==='fb'?0:I<.62?1:2;
      bt.add(lay,'b'+ti,`M${f(p0[0])},${f(-p0[1])}Q${f(m[0])},${f(-m[1])} ${f(e[0])},${f(-e[1])}`,{stroke:tn[ti],'stroke-width':ty==='vil'?.5:.45,fill:'none','stroke-linecap':'round'},2+ti)}}
  parts.push({z:A.cb(s0)[2]+.4,fn:par=>{E('path',{d:polyRibbon(core,i=>cw2[i]),fill:ty==='mil'?cw.c:lite?mix(cw.c,'#7a6a52',.6):mix(cw.c,P.d1,.5),stroke:ty==='mil'?P.d2:'none','stroke-width':.3},par);
    if(ty==='mil'&&!LOD){E('path',{d:polyRibbon(core,i=>cw2[i]*.55,i=>cw2[i]*.3),fill:P.l1,opacity:.5},par);let d='';for(let i=0;i<core.length;i++)for(let j=-1;j<=1;j++)d+=l23Cir(core[i][0]+j*cw2[i]*.55+R(-.3,.3),core[i][1]+R(-.5,.5),.28*UPC*.5);E('path',{d,fill:P.l2,opacity:.35},par)}}});
  bt.push(parts,{fb:A.cb(s0)[2]+.2,ff:A.cb(s0)[2]+.6,tb:-3e6,tf:3e6});drawParts(k,parts);open(k,t,1100,0,.4);return{k,bw:w0,bc:SC}}
Object.assign(GH,{'pennisetum':l23Penn});CWS['pennisetum']=L23_CW_PENN;SZG['pennisetum']=[40,50,60,60,70,80];
GHI['pennisetum']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:1.2,fx:3*UPC};
