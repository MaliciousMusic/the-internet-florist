/* ================= Serre, lot 60 — aromatiques : romarin, sauge officinale, menthe, basilic, origan (et l'ornemental 'Kent Beauty') ================= */
/* ---------- the lot's tools. Every herb is a leafy stem grown by the L-system (fgGrow, lot 24) with its leaves opposite and decussate (phy 'opp'), drawn in 3D as two halves (g35Leaf, lot 35).
   Lamiaceae have square stems: the axes are redrawn with the crisp edge between two faces; a toothed or crenate outline; the petiole always joins the blade to its node.
   Flowers sit on their carrier: whorls (verticillasters) along a spike prolonging the axis, axillary flowers on a short pedicel, corymbs of spikelets on branched pedicels;
   nothing finer than 1.2 units leaves an axis (a finer stroke would read as a loose piece in the bouquet) ---------- */
const l60Q=p=>[p[0],-p[1]];
/* the right and left halves of a blade from a width profile wp (ratio wr): nt teeth (td their depth; crenate rounds them), the tip at (0, 1) */
function l60Half(wp,wr,nt,td,cren){const R0=[[wp(0)*wr/2,0]],y0=.07,y1=.93;
  for(let k=0;k<nt;k++){const ya=y0+(y1-y0)*k/nt,yb=y0+(y1-y0)*(k+1)/nt,hw=y=>wp(y)*wr/2;
    if(cren){for(const s of[.2,.5,.8])R0.push([hw(ya+(yb-ya)*s)*(1-td+td*Math.sin(Math.PI*s)),ya+(yb-ya)*s])}
    else{R0.push([hw(ya)*(1-td),ya+(yb-ya)*.05]);R0.push([hw(ya+(yb-ya)*.78)*(1+td*.25),ya+(yb-ya)*.78])}}
  R0.push([wp(.97)*wr/2*.6,.97],[0,1]);return{R:R0,L:R0.map(([x,y])=>[-x,y])}}
/* pinnate veins: the midrib and n pairs of laterals curving toward the margin; net adds the cross-veins of a rugose blade */
function l60Veins(wp,wr,n,net){const V=[[0,.12,.25,.38,.5,.62,.75,.86,.96].map(y=>[0,y])],hw=y=>wp(y)*wr/2;
  for(let i=0;i<n;i++){const y=.08+.74*i/n,y2=Math.min(.96,y+.16);for(const s of[-1,1])V.push([[0,y],[s*hw(y+.07)*.5,y+.08],[s*hw(y2)*.86,y2]])}
  if(net)for(let i=0;i<n;i++){const y=.14+.74*i/n;for(const s of[-1,1])V.push([[s*hw(y)*.3,y+.04],[s*hw(y+.08)*.42,y+.12],[s*hw(y+.14)*.28,y+.2]],[[s*hw(y)*.62,y+.08],[s*hw(y+.1)*.66,y+.16]])}
  return V}
/* stem colours from one tone: shade, body, light, highlight */
const L60_ST=c=>[shd(c,-.55),shd(c,-.22),c,shd(c,.4)];
/* square stems: the axes redrawn piece by piece with the edge between their two visible faces (a darker line off the middle, the lit face beyond it) */
function l60Square(res,parts,cols,piece=9){for(let i=parts.length-1;i>=0;i--)if(parts[i].ax)parts.splice(i,1);const tmp=[];lsChainParts(res.chains,[0,0,0],cols,tmp,{piece});parts.push(...tmp);
  if(LOD)return;for(const ch of res.chains){const n=ch.pts.length,c=ch.c||cols;for(let a=0;a<n-1;a+=piece-1){const b=Math.min(n-1,a+piece-1),P=[],W=[];let z=0;
      for(let i=a;i<=b;i++){P.push(l60Q(ch.pts[i]));W.push(ch.ws[i]);z+=ch.pts[i][2]}if(Math.max(...W)<2.2)continue;
      parts.push({z:z/(b-a+1)+.01,cast:false,fn:par=>{const A=[],B=[];for(let i=0;i<P.length;i++){const p=P[Math.max(0,i-1)],q=P[Math.min(P.length-1,i+1)],dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,
          s=(nx+ny)>0?-1:1;A.push([P[i][0]+nx*s*W[i]*.12,P[i][1]+ny*s*W[i]*.12]);B.push([P[i][0]-nx*s*W[i]*.3,P[i][1]-ny*s*W[i]*.3])}
        E('path',{d:'M'+A.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c[0],'stroke-width':f(Math.max(.4,W[0]*.12)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par);
        if(DET>=1.5)E('path',{d:'M'+B.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c[3],'stroke-width':f(Math.max(.35,W[0]*.1)),'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},par)}})}}}
/* a leaf on its petiole: the blade starts pl along the leaf's midrib, a petiole (never finer than 1.2) joins it to the node */
function l60Leaf(og,L,pl,sh,c,cb,pw,pc,o){const F=g35Fr(og),P0=V3.add(F.P0,V3.add(V3.sc(F.H,pl),[0,-pl*.06,0])),lf=g35Leaf(P0,F.H,F.N,L,sh,c,cb,o);
  if(!lf.fn.length)return[];return[lf,g35Pet(F.P0,V3.add(P0,V3.sc(F.H,L*.04)),Math.max(1.25,pw),pc)]}
/* one two-lipped flower (Lamiaceae): from its base b on the axis along d (T toward the axis' tip), a calyx then the corolla — its hooded upper lip toward T, the broad lower lip away;
   a bud is the closed corolla; returns the screen paths to batch: calyx, corolla, bud, and its depth */
function l60Lab(b,d,T,S,age){const Tp=V3.nz(V3s(T,V3.sc(d,V3.dot(T,d)))),c1=V3.add(b,V3.sc(d,S.cl)),sd=V3.cr(d,Tp),q=(x,y,zz=0)=>l60Q(V3.add(c1,V3.add(V3.add(V3.sc(d,x*S.fl),V3.sc(Tp,y*S.fl)),V3.sc(sd,zz*S.fl))));
  const B0=l60Q(b),C1=l60Q(c1),cal=`M${f(B0[0])},${f(B0[1])}L${f(C1[0])},${f(C1[1])}`;
  if(age<.5){const s=.35+.5*age,P=[q(-.08,-.16*s,0),q(.25*s,-.24*s,.12),q(.62*s,-.12*s,.06),q(.72*s,0,0),q(.62*s,.12*s,-.06),q(.25*s,.24*s,-.12),q(-.08,.16*s,0)];
    return{cal,bud:g35D(P),cor:'',z:c1[2]}}
  const s=Math.min(1,.55+.6*(age-.5)),P=[[0,.14],[.42,.16],[.66,.52*s],[.88,.46*s],[.8,.16],[.98,.06],[1,-.24*s],[.86,-.58*s],[.62,-.5*s],[.42,-.16],[0,-.14]].map(([x,y],i)=>q(x*s,y,(i<5?.1:-.12)*s));
  return{cal,bud:'',cor:g35D(P),z:V3.add(c1,V3.sc(d,S.fl*.5))[2]}}
/* a flower spike prolonging an axis from og: whorls of nf flowers (the oldest at the base), the axis tapering and turning up toward the light;
   S: L, n whorls, nf, cl calyx, fl corolla, el (their angle off the axis), cor, cal, bud colours, br {c, len, w} a pair of bracts under each whorl, w the axis' width, rise */
function l60Spike(og,op,S){const H0=V3.nz(og.H),m=S.n*3+3,pts=[og.pos],Ts=[H0],parts=[],w0=Math.max(1.3,Math.min(og.w||S.w,S.w)),PB=S.br?pal7(S.br.c):null,ph=R(0,180);let p=og.pos;
  for(let s=1;s<=m;s++){const T=V3.nz(V3.add(H0,[0,(S.rise??.5)*s/m,0]));p=V3.add(p,V3.sc(T,S.L/m));pts.push(p);Ts.push(T)}
  const wAt=s=>Math.max(1.2,w0*(1-.5*s/m)),pale=h2l(S.cor)[2]>.82,ink=pale?'#8a8a7a':shd(S.cor,-.45),cink=shd(S.cal,-.4);
  /* the whole spike batched in one part: what lies behind its axis, the axis, then what lies in front (a few paths, whatever the number of flowers) */
  const back={cal:'',cor:'',bud:'',br:''},front={cal:'',cor:'',bud:'',br:''};
  for(let i=0;i<S.n;i++){const t=1-Math.pow(1-(i+.4)/(S.n+.1),1.3),si=Math.min(m,Math.round(t*m)),c=pts[si],T=Ts[si],[X,Y]=fgCross(T),age=Math.max(0,Math.min(1,op*1.7-t*1.05+.12)),w=wAt(si);
    if(S.br&&age>.15)for(const s of[0,1]){const az=(ph+i*90+s*180)*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),d=V3.nz(V3.add(V3.sc(T,.45),r)),Wb=V3.cr(d,T),b=V3.add(c,V3.sc(r,w*.4)),Lb=S.br.len*(1-.4*t);
      const P3=[[0,-.12],[.3,-.5],[.7,-.36],[1,0],[.7,.36],[.3,.5],[0,.12]].map(([x,y])=>V3.add(b,V3.add(V3.sc(d,x*Lb),V3.add(V3.sc(Wb,y*Lb*S.br.w),[0,-x*x*Lb*.25,0]))));
      (P3[3][2]<c[2]?back:front).br+=g35D(P3.map(l60Q))}
    for(let j=0;j<S.nf;j++){const az=(ph+i*(180/S.nf)+j*360/S.nf+R(-12,12))*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),el=(S.el+R(-8,8))*D,d=V3.nz(V3.add(V3.sc(T,Math.cos(el)),V3.sc(r,Math.sin(el)))),
        b=V3.add(c,V3.sc(r,w*.35)),fl=l60Lab(b,d,T,S,age*R(.85,1.1)),bin=fl.z<c[2]?back:front;bin.cal+=fl.cal;bin.cor+=fl.cor;bin.bud+=fl.bud}
  }
  const AX=pts.map(l60Q),AW=AX.map((_,k)=>wAt(k)),cw=Math.max(1.2,S.cl*.5),bc=PB?toneAt(PB,.56):null,det=DET>=1.5&&!LOD;
  const draw=(par,bn)=>{if(bn.br)E('path',{d:bn.br,fill:bc,stroke:PB.ink,'stroke-width':.35,'stroke-opacity':.4},par);if(bn.cal)E('path',{d:bn.cal,stroke:S.cal,'stroke-width':f(cw),fill:'none','stroke-linecap':'round'},par);
      if(bn.bud)E('path',{d:bn.bud,fill:S.bud,stroke:S.bud,'stroke-width':1.1,'stroke-linejoin':'round'},par);
      if(bn.cor)E('path',{d:bn.cor,fill:S.cor,stroke:S.cor,'stroke-width':1.1,'stroke-linejoin':'round'},par);
      if((det||pale)&&!LOD&&(bn.cor||bn.bud))E('path',{d:bn.cor+bn.bud,fill:'none',stroke:bn.cor?ink:cink,'stroke-width':pale?.4:.3,'stroke-opacity':pale?.75:.5},par)};
  /* the end of the spike: its youngest buds closed round the tip */
  const e=pts[m],Te=Ts[m],[Xe]=fgCross(Te),Lt=S.fl*(S.br?.9:.6),rt=Math.max(.8,S.fl*(S.br?.2:.16)),tc=S.br?S.br.c:S.bud,
    TP=[[-.75,-.6],[-.3,-1],[.25,-1.05],[.75,-.7],[1,0],[.75,.7],[.25,1.05],[-.3,1],[-.75,.6]].map(([x,y])=>l60Q(V3.add(e,V3.add(V3.sc(Te,(x+.4)*Lt*.7),V3.sc(Xe,y*rt)))));
  const zm=pts.reduce((a,q)=>a+q[2],0)/pts.length;
  parts.push({z:zm,cast:false,fn:par=>{draw(par,back);E('path',{d:polyRibbon(AX,k=>AW[k]/2),fill:S.ax||S.cal},par);draw(par,front);
    E('path',{d:smooth(TP),fill:tc,stroke:tc,'stroke-width':1.1,'stroke-linejoin':'round'},par);if(det)E('path',{d:smooth(TP),fill:'none',stroke:shd(tc,-.4),'stroke-width':.3,'stroke-opacity':.5},par)}});
  return parts}
/* a few labiate flowers in an upper axil, on short pedicels (rosemary) */
function l60Axil(og,op,S){const T=V3.nz(og.H),[X,Y]=fgCross(T),n=rnd()<.5?1:2,out={cal:'',cor:'',bud:''};let z=0;
  for(let j=0;j<n;j++){const a=(j*150+R(-30,30))*D,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),d=V3.nz(V3.add(V3.sc(T,.7),V3.sc(r,.7))),fl=l60Lab(og.pos,d,V3.nz(V3.add(T,[0,.6,0])),S,Math.min(1,op*R(.9,1.4)-j*.15));
    out.cal+=fl.cal;out.cor+=fl.cor;out.bud+=fl.bud;z+=fl.z}
  const pale=h2l(S.cor)[2]>.82,ink=pale?'#8a8a7a':shd(S.cor,-.45);
  return{z:z/n,cast:false,fn:par=>{E('path',{d:out.cal,stroke:S.cal,'stroke-width':f(Math.max(1.25,S.cl*.45)),fill:'none','stroke-linecap':'round'},par);
    if(out.bud)E('path',{d:out.bud,fill:S.bud,stroke:S.bud,'stroke-width':1.1,'stroke-linejoin':'round'},par);if(out.cor)E('path',{d:out.cor,fill:S.cor,stroke:S.cor,'stroke-width':1.1,'stroke-linejoin':'round'},par);
    if(!LOD)E('path',{d:out.cor+out.bud,fill:'none',stroke:ink,'stroke-width':pale?.4:.3,'stroke-opacity':pale?.75:.5},par)}}}

/* ---------- rosemary (Salvia rosmarinus, syn. Rosmarinus officinalis): an evergreen shrub of stiff woody shoots, the bark grey-brown and peeling below, the young growth green and felted;
   leaves opposite and decussate, crowded (internodes 4–10 mm), sessile, linear and needle-like, 1.5–4 cm × 2–4 mm, leathery, the margin rolled under, dark glossy green above,
   white-woolly beneath with a green midrib; small two-lipped flowers (about 1 cm) in short clusters in the upper axils, pale blue to violet-blue, sometimes white or pink; flowers from late winter.
   Sold in bunches of tips 30–40 cm; types: the dark green type, grey 'Arp'-like forms, 'Tuscan Blue' (deep blue), 'Majorca Pink', the white 'Albiflorus' ---------- */
const CW_L60ROM=[{id:'vert-sombre',n:'Vert sombre (type)',c:'#3e5a3a',st:'#7a6a55'},{id:'gris-vert',n:'Vert gris (Arp)',c:'#6f7f6c',st:'#857a68',b:'#e2e6dc'},
  {id:'fleuri-bleu-pale',n:'Fleuri bleu pâle',c:'#44603e',st:'#7a6a55',fl:'#a3b5dc',f:1},{id:'fleuri-bleu',n:'Fleuri bleu soutenu (Tuscan Blue)',c:'#3a5838',st:'#76664f',fl:'#6f7fc8',f:1},
  {id:'fleuri-rose',n:'Fleuri rose (Majorca Pink)',c:'#4a6442',st:'#7a6a55',fl:'#d8a8cc',f:1},{id:'fleuri-blanc',n:'Fleuri blanc (Albiflorus)',c:'#44603e',st:'#7a6a55',fl:'#f0eef2',f:1}];
/* the needles of every axis, pair by pair crossing (decussate), batched by piece: those behind the twig, the dark upper faces, the lit ones, and the white undersides with their green midrib */
function l60Needles(res,parts,cw,S){const det=DET>=1.5&&!LOD,P=pal7(cw.c),cs=[toneAt(P,.34),toneAt(P,.56),toneAt(P,.8)],wb=cw.b||'#d4dbcc',wbS=mix(wb,'#8a9488',.35),sw=S.sw;
  for(const ch of res.chains){const pts=ch.pts,n=pts.length;if(n<2)continue;const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const Lc=cum[n-1],a0=ch.ord?Lc*.03:Lc*S.u0;if(Lc-a0<4)continue;
    const at=l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const u=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),w:ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*u}};
    const nn=Math.max(2,Math.round((Lc-a0)/S.sp)),K=det?8:12,ph=R(0,90);let bins=['','','','',''],mids='',zs=0,zc=0;
    const flush=()=>{if(!zc)return;const z=zs/zc,bb=bins,md=mids;
      parts.push({z:z-.4,cast:false,fn:g=>{if(bb[0])E('path',{d:bb[0],stroke:cs[0],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g);if(bb[3])E('path',{d:bb[3],stroke:wbS,'stroke-width':sw,fill:'none','stroke-linecap':'round'},g)}});
      parts.push({z:z+.4,cast:false,fn:g=>{if(bb[1])E('path',{d:bb[1],stroke:cs[1],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g);if(bb[2])E('path',{d:bb[2],stroke:cs[2],'stroke-width':sw,fill:'none','stroke-linecap':'round'},g);
        if(bb[4]){E('path',{d:bb[4],stroke:wb,'stroke-width':sw,fill:'none','stroke-linecap':'round'},g);if(!LOD&&md)E('path',{d:md,stroke:cs[1],'stroke-width':f(sw*.32),fill:'none','stroke-linecap':'round','stroke-opacity':.85},g)}}});
      bins=['','','','',''];mids='';zs=zc=0};
    for(let i=0;i<nn;i++){const l=a0+(Lc-a0)*(i+R(-.12,.12))/nn,q=at(Math.max(0,Math.min(Lc,l))),u=(l-a0)/(Lc-a0),[X,Y]=fgCross(q.T),az0=(ph+i*90+R(-10,10))*D;zs+=q.p[2];zc++;
      /* toward the tip the needles are short, young and held close to the shoot */
      const Ln=S.ln*(u>.78?.35+.65*(1-u)/.22:1)*(ch.ord?.85:1)*R(.85,1.12),th=(S.th+R(-10,10))*(u>.85?.5:1)*D;
      for(let j=0;j<2;j++){const az=az0+j*Math.PI,rk=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(rk,Math.sin(th)))),
          b=V3.add(q.p,V3.sc(rk,q.w*.3)),dr=.12*Ln,e=V3.add(V3.add(b,V3.sc(d,Ln)),[0,-dr,0]),m=V3.add(V3.add(b,V3.sc(d,Ln*.5)),V3.add(V3.sc(rk,Ln*.06),[0,-dr*.25,0]));
        if(S.lim!=null&&Math.min(e[1],m[1])<S.lim)continue;
        /* its upper face looks toward the shoot's tip: seen from the front or from beneath */
        const nU=V3s(q.T,V3.sc(d,V3.dot(q.T,d))),up=nU[2]>-.18,behind=e[2]<q.p[2]-Ln*.15,bin=behind?(up?0:3):!up?4:V3.dot(rk,LIGHT)>.25?2:1,B2=l60Q(b),M2=l60Q(m),E2=l60Q(e),
          s=`M${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(E2[0])},${f(E2[1])}`;bins[bin]+=s;if(bin===4)mids+=s}
      if(zc>=K)flush()}flush()}}
function l60Rom(g,t,o){const cw=fgCw(CW_L60ROM,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=2.5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l60rom',()=>{const Lt=o.spine?blen(o.spine):35*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),cols=L60_ST(cw.st),lim=g35Lim(o),
      FS={cl:.32*UPC*kl,fl:1.05*UPC*kl,cor:cw.fl||'#a3b5dc',cal:'#6a6a50',bud:mix(cw.fl||'#a3b5dc','#5a5a7a',.3)};
    const r=fgGrow(k,A,{li:2*UPC*kl,liT:.3,w0:4.4*kl,w1:1.5,cols,uL:.25,lp:0,phy:'opp',seg:8,wig:.025,tipLv:0,
      side:{u0:.18,u1:.7,p:.4,len:.45,ang:30,li:.9,e:-.004,pair:1,tilt:18},
      axil:cw.f?{u0:.45,p:.5,ang:40}:null,
      axDraw:og=>cw.f&&(lim==null||og.pos[1]>lim+6)?l60Axil(og,op,FS):null,
      post:(res,parts)=>l60Needles(res,parts,cw,{u0:o.spine?.05:.16,sp:.42*UPC*kl,ln:cm0*UPC*kl*(o.spine?.9:1),th:44,sw:f(Math.max(1.35,.3*UPC*kl)),lim})});
    open(k,t,1000,0,.4);return r})}

/* ---------- common sage (Salvia officinalis): a sub-shrub, its young stems square and white-felted, woody below; leaves opposite on petioles 1–3 cm, the blade oblong-elliptic, 4–8 cm,
   the base rounded, the margin finely crenulate, the surface rugose — sunk in a close net of veins — and downy on both faces, grey-green (paler, whitish beneath);
   cultivars: 'Purpurascens' (purple young leaves under a grey bloom), 'Icterina' (grey-green splashed gold at the margin), 'Tricolor' (grey-green edged cream, the young leaves flushed pink-purple),
   'Berggarten' (broad, almost round, silvery). Sold as leafy stems 25–35 cm, rarely in flower ---------- */
const CW_L60SAU=[{id:'gris-vert',n:'Gris-vert (type)',c:'#87977a',b:'#c4ccb8',st:'#8a9278'},{id:'argente',n:'Gris argenté (Berggarten)',c:'#a0a895',b:'#d0d4c6',st:'#9aa08c',rd:1},
  {id:'pourpre',n:'Pourpre (Purpurascens)',c:'#6c5468',b:'#a89aa0',st:'#6a5260',y:'#5a3a58'},{id:'icterina',n:'Panaché doré (Icterina)',c:'#b2ad62',b:'#c8ccb0',st:'#8a9070',g:'#7f9070'},
  {id:'tricolor',n:'Tricolore (Tricolor)',c:'#d8d2b0',b:'#d4d0c4',st:'#8a7a7a',g:'#86967a',y:'#b0608a'}];
const L60_SAUW=prof([[0,.42],[.12,.8],[.35,1],[.6,.96],[.82,.7],[.95,.3],[1,0]]),L60_SAUR=prof([[0,.55],[.15,.9],[.4,1],[.68,.92],[.88,.6],[1,0]]);
function l60Sau(g,t,o){const cw=fgCw(CW_L60SAU,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l60sau',()=>{const Lt=o.spine?blen(o.spine):30*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),cols=L60_ST(mix(cw.st,'#c8ccc0',.25)),lim=g35Lim(o),
      wp=cw.rd?L60_SAUR:L60_SAUW,wr=cw.rd?.62:.4,shs=[0,1].map(()=>l60Half(wp,wr,14,.05,1)),veins=l60Veins(wp,wr,6,1),
      vr=cw.g?{c:cw.g,k:y=>.62+.12*Math.sin(y*11+R(0,6))}:null,edge=mix(cw.c,'#f0f0e8',.45);
    const r=fgGrow(k,A,{li:3.2*UPC*kl,liT:.45,w0:4*kl,w1:1.6,cols,uL:o.spine?.28:.14,phy:'opp',la:50,face:.6,lift:.4,seg:10,wig:.025,
      side:{u0:.25,u1:.7,p:.3,len:.4,ang:34,li:.75,e:-.006,pair:1,tilt:20},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.8?(u-.8)/.2*(.5+.5*(1-op)):0,sz=(p.tip?.42:fgSz(p,.72))*(p.o?.8:1)*kl,L=cm0*UPC*sz*R(.88,1.08),
          c=cw.y&&young?mix(cw.c,cw.y,young*.8):cw.c,cb=cw.y&&young?mix(cw.b,cw.y,.3):cw.b;
        return l60Leaf(og,L,L*.2,shs[p.j%2],mix(c,shd(c,R(-.05,.05)),.5),cb,1.5*kl,cols[2],{lim,sm:1,fold:.22+.3*young,arch:.1,droop:.12,cup:.1,wave:.012,wk:11,wph:R(0,6),tw:R(-.25,.25),
          vr:vr&&!young?vr:null,edge,ew:.55,dI:.03,veins,vAll:1,vc:shd(c,-.32),vw:.45,vo:.5})},
      post:(res,parts)=>l60Square(res,parts,cols)});
    open(k,t,1000,0,.4);return r})}

/* ---------- mint (Mentha spicata, M. × piperita, M. suaveolens…): spreading by runners, the stems erect and sharply square, often purplish; leaves opposite, almost sessile (spearmint) or
   short-stalked (peppermint), ovate to lanceolate, 3–7 cm, sharply serrate, the surface quilted between sunken veins, bright green; small lilac to mauve flowers crowded in whorls
   into slender terminal spikes 3–8 cm (late summer). Sold in bunches 30–40 cm: spearmint (bright green), peppermint (dark green, purple stems), chocolate mint (bronze-green),
   pineapple mint (M. suaveolens 'Variegata', rounded woolly leaves edged cream), and flowering stems ---------- */
const CW_L60MEN=[{id:'verte',n:'Vert vif (menthe verte)',c:'#5c9a3d',st:'#5e7d3e'},{id:'poivree',n:'Vert sombre (menthe poivrée)',c:'#36612f',st:'#5a3a40',y:'#4a4a3a'},
  {id:'ananas',n:'Panachée crème (menthe ananas)',c:'#b6c595',st:'#7a9058',g:'#7a9a58',v:'#eef0d8',rd:1},{id:'chocolat',n:'Bronze (menthe chocolat)',c:'#5b4b34',st:'#4a3028',g:'#4e5a32'},
  {id:'verte-fleurie',n:'Vert vif en épis mauves',c:'#5a963c',st:'#5e7d3e',fl:'#c9a9d3',f:1},{id:'poivree-fleurie',n:'Poivrée en épis lilas',c:'#3a6432',st:'#5a3a40',fl:'#b496c8',f:1}];
const L60_MENW=prof([[0,.4],[.12,.82],[.32,1],[.58,.86],[.82,.48],[1,0]]),L60_MENR=prof([[0,.6],[.15,.94],[.42,1],[.7,.84],[.9,.46],[1,0]]);
function l60Men(g,t,o){const cw=fgCw(CW_L60MEN,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l60men',()=>{const Lt=o.spine?blen(o.spine):35*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),cols=L60_ST(cw.st),lim=g35Lim(o),
      wp=cw.rd?L60_MENR:L60_MENW,wr=cw.rd?.72:.5,shs=[0,1].map(()=>l60Half(wp,wr,cw.rd?9:11,cw.rd?.06:.13,!!cw.rd)),veins=l60Veins(wp,wr,5,0),
      vr=cw.v?{c:cw.g,k:y=>.66+.1*Math.sin(y*9+R(0,6))}:null,lc=cw.v||cw.c,
      FS={L:5*UPC*kl,n:12,nf:7,cl:.22*UPC*kl,fl:.42*UPC*kl,el:62,cor:cw.fl||'#c9a9d3',cal:mix(cw.st,'#7a8a5a',.4),bud:mix(cw.fl||'#c9a9d3','#7a6a8a',.35),ax:cols[1],rise:.6,w:2.2*kl};
    const r=fgGrow(k,A,{li:3.3*UPC*kl,liT:.5,w0:4*kl,w1:cw.f?2.2*kl:1.4,cols,uL:o.spine?.28:.14,phy:'opp',la:52,face:.62,lift:.4,seg:10,wig:.025,tipLv:cw.f?0:undefined,
      side:{u0:.3,u1:.7,p:cw.f?.45:.28,len:.42,ang:32,li:.75,e:-.004,pair:1,tilt:20},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.82?(u-.82)/.18*(.4+.6*(1-op)):0,sz=(p.tip?.45:fgSz(p,.74))*(p.o?.8:1)*kl*(cw.f&&u>.7?.8:1),L=cm0*UPC*sz*R(.86,1.1),
          c=cw.y&&u<.5?mix(lc,cw.y,.25):lc,cb=mix(cw.g||c,'#b8c8a0',.35);
        return l60Leaf(og,L,L*(cw.id.startsWith('poivree')?.14:.07),shs[p.j%2],mix(c,shd(c,R(-.07,.07)),.5),cb,1.4*kl,cols[2],{lim,fold:.2+.35*young,arch:.08,droop:.14,cup:.08,wave:.02,wk:10,wph:R(0,6),
          tw:R(-.25,.25),vr:vr&&!young?vr:null,gloss:.25,dI:.02,veins,vAll:1,vc:shd(c,-.35),vw:.5,vo:.55,edge:cw.rd?mix(lc,'#ffffff',.4):null})},
      tip:(og,p)=>cw.f&&(lim==null||og.pos[1]>lim)?l60Spike(og,op,Object.assign({},FS,p.o?{L:FS.L*.7,n:9}:{})):null,
      post:(res,parts)=>l60Square(res,parts,cols)});
    open(k,t,1000,0,.4);return r})}

/* ---------- basil (Ocimum basilicum): an annual, its stems square, branched, green or purple; leaves opposite on petioles 1–3 cm, ovate, 4–9 cm, entire or faintly toothed, glossy,
   convex (the blade arched over, its margin turned down), puckered between the veins in the large Genovese kinds; flowers in whorls of six along terminal spikes 10–20 cm, each whorl over
   a pair of small bracts, the corolla small (8–10 mm), white or pale pink; 'Dark Opal' and 'Purple Ruffles' deep purple (flowers pink-lilac); Thai basil (var. thyrsiflora, 'Siam Queen'):
   narrower leaves, purple stems and dense purple spikes with pink-mauve flowers ---------- */
const CW_L60BAS=[{id:'vert',n:'Vert (grand vert de Gênes)',c:'#5a9a36',st:'#6b8f45'},{id:'vert-fleuri',n:'Vert fleuri blanc',c:'#5a9634',st:'#6b8f45',fl:'#efe9ee',br:'#6a9a40',f:1},
  {id:'pourpre',n:'Pourpre (Dark Opal)',c:'#3e2335',st:'#4a2a3a'},{id:'pourpre-fleuri',n:'Pourpre fleuri (Dark Opal)',c:'#40253a',st:'#4a2a3a',fl:'#e0b8d8',br:'#5a2a48',f:1},
  {id:'thai',n:'Thaï (Siam Queen), épis pourpres',c:'#4e8a32',st:'#5a2a48',fl:'#c88ac0',br:'#6a2a5a',f:1,nar:1},{id:'thai-feuillage',n:'Thaï feuillage',c:'#4a8430',st:'#5a2a48',nar:1}];
const L60_BASW=prof([[0,.36],[.12,.8],[.34,1],[.6,.9],[.84,.5],[1,0]]),L60_BASN=prof([[0,.3],[.12,.7],[.3,1],[.6,.82],[.85,.4],[1,0]]);
function l60Bas(g,t,o){const cw=fgCw(CW_L60BAS,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.55+.45*ks,k=G(g);
  return g35Run(o,'l60bas',()=>{const Lt=o.spine?blen(o.spine):30*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.05,.14)),cols=L60_ST(cw.st),lim=g35Lim(o),
      wp=cw.nar?L60_BASN:L60_BASW,wr=cw.nar?.4:.6,shs=[0,1].map(()=>l60Half(wp,wr,7,.025,1)),veins=l60Veins(wp,wr,5,0),
      FS={L:(cw.nar?9:13)*UPC*kl,n:cw.nar?10:8,nf:6,cl:.45*UPC*kl,fl:1.1*UPC*kl,el:62,cor:cw.fl||'#efe9ee',cal:mix(cw.br||cw.st,'#4a5a30',.25),bud:mix(cw.br||'#6a9a40',cw.fl||'#fff',.35),ax:cols[1],rise:.4,w:2.4*kl,
        br:{c:cw.br||'#6a9a40',len:1.05*UPC*kl*(cw.nar?1.2:1),w:.48}};
    const r=fgGrow(k,A,{li:3.6*UPC*kl,liT:.5,w0:4.4*kl,w1:cw.f?2.4*kl:1.6,cols,uL:o.spine?.28:.14,phy:'opp',la:48,face:.6,lift:.4,seg:10,wig:.02,tipLv:cw.f?0:undefined,
      side:{u0:.3,u1:.72,p:cw.f?.5:.3,len:.42,ang:34,li:.75,e:-.004,pair:1,tilt:18},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.82?(u-.82)/.18*(.4+.6*(1-op)):0,sz=(p.tip?.42:fgSz(p,.74))*(p.o?.78:1)*kl*(cw.f&&u>.7?.75:1),L=cm0*UPC*sz*R(.86,1.1),
          c=mix(cw.c,shd(cw.c,R(-.07,.07)),.5),dark=h2l(cw.c)[2]<.25;
        return l60Leaf(og,L,L*.22,shs[p.j%2],c,mix(c,dark?'#6a4a5a':'#a8c890',.35),1.5*kl,cols[2],{lim,sm:1,fold:.06+.45*young,arch:.1,droop:.16,cup:-.22+.25*young,wave:.016,wk:7,wph:R(0,6),
          tw:R(-.2,.2),gloss:dark?.7:1,dI:.03,veins,vAll:1,vc:dark?shd(cw.c,.35):shd(cw.c,-.28),vw:.45,vo:.45})},
      tip:(og,p)=>cw.f&&(lim==null||og.pos[1]>lim)?l60Spike(og,op,Object.assign({},FS,p.o?{L:FS.L*.65,n:Math.max(4,FS.n-3)}:{})):null,
      post:(res,parts)=>l60Square(res,parts,cols)});
    open(k,t,1000,0,.4);return r})}

/* ---------- oregano (Origanum vulgare): a perennial, its stems square, reddish and downy; leaves opposite, small (1–4 cm), broadly ovate, entire, short-stalked, dotted with glands;
   flowers tiny, pink to mauve, peeping from small spikelets of overlapping purple-red bracts, gathered in loose corymbs (panicles) at the tops of the stems; 'Aureum' golden-leaved,
   'Herrenhausen' purple-flushed leaves and deep purple bracts. The ornamental 'Kent Beauty' (O. rotundifolium × O. scabrum): trailing stems, round glaucous leaves, and nodding hop-like
   spikelets 2–3 cm of large rounded bracts, pale green turning pink at their tips, the small pink flowers half hidden ---------- */
const CW_L60ORI=[{id:'vert',n:'Vert (feuillage)',c:'#5d8a3e',st:'#7a4a3e'},{id:'fleuri-rose',n:'Fleuri rose pourpre',c:'#5a863c',st:'#7a4a3e',fl:'#d8a0c4',bra:'#a9658c',f:1},
  {id:'dore',n:'Doré (Aureum)',c:'#c4b04a',st:'#8a6a3e'},{id:'herrenhausen',n:'Pourpre (Herrenhausen)',c:'#4e6a3a',st:'#6a3040',y:'#5a3048',fl:'#c070b0',bra:'#7a2a5a',f:1},
  {id:'kent-beauty',n:'Kent Beauty, bractées roses',c:'#8aa290',st:'#8a6a6a',fl:'#e090b8',bra:'#e8b8c8',bg:'#c8d4b0',kent:1,f:1},
  {id:'kent-beauty-vert',n:'Kent Beauty vert pâle',c:'#8aa290',st:'#8a6a6a',fl:'#e8a8c8',bra:'#d8dcb0',bg:'#c4d0a8',kent:1,f:1}];
const L60_ORIW=prof([[0,.5],[.15,.88],[.4,1],[.7,.8],[.9,.42],[1,0]]),L60_KENW=prof([[0,.62],[.15,.92],[.45,1],[.75,.86],[.92,.5],[1,0]]);
/* a spikelet: an ovoid of overlapping bracts along d from b (four-ranked, imbricate), the small flowers peeping from its top; the Kent Beauty's large, nodding, hop-like */
function l60Spikelet(b,d,Ls,rs,cw,op,kent){const rows=kent?7:4,P=[],sc=[];
  /* the outline: the ovoid's silhouette on the screen */
  const e=V3.add(b,V3.sc(d,Ls)),B2=l60Q(b),E2=l60Q(e),dx=E2[0]-B2[0],dy=E2[1]-B2[1],l=Math.hypot(dx,dy),fsh=Math.max(.35,l/Ls),ux=l>1e-6?dx/l:0,uy=l>1e-6?dy/l:1,nx=-uy,ny=ux,Lp=Math.max(l,rs*1.4);
  const rad=t=>rs*Math.pow(Math.sin(Math.PI*Math.min(1,.12+t*.9)),.75);
  for(let i=0;i<=10;i++){const t=i/10;P.push([B2[0]+ux*Lp*t+nx*rad(t),B2[1]+uy*Lp*t+ny*rad(t)])}for(let i=10;i>=0;i--){const t=i/10;P.push([B2[0]+ux*Lp*t-nx*rad(t),B2[1]+uy*Lp*t-ny*rad(t)])}
  /* the bracts: rounded scales in rows, alternately offset, their free tips tinted */
  if(kent||DET>=1.5&&!LOD)for(let r=0;r<rows;r++){const t=(r+.7)/(rows+.4),nb=kent?3:2;for(let j=0;j<nb;j++){const off=(j-(nb-1)/2)*(kent?.62:.8)+(r%2?.3:-.3),cx=B2[0]+ux*Lp*t+nx*rad(t)*off,cy=B2[1]+uy*Lp*t+ny*rad(t)*off,
      rw=rad(t)*(kent?.5:.55),rl=Lp/(rows+.4)*(kent?.95:.9);const Q=[];for(let a=0;a<=6;a++){const th=Math.PI*a/6,x=Math.cos(th)*rw,y=Math.sin(th)*rl;Q.push([cx+nx*x+ux*y,cy+ny*x+uy*y])}sc.push({Q,t})}}
  const fl=[];if(op>.4){const nf=kent?3:3;for(let j=0;j<nf;j++){const t=kent?.5+j*.16:.68+j*.1,s=(j%2?1:-1),r=rs*(kent?.3:.5)*Math.min(1,op),Q=[];
    if(kent){/* a small tube slipping out between two bracts, toward the cone's tip */const cx=B2[0]+ux*Lp*t+nx*rad(t)*.72*s,cy=B2[1]+uy*Lp*t+ny*rad(t)*.72*s;
      for(let a=0;a<10;a++){const th=a*Math.PI/5,x=Math.cos(th)*r*.55,y=Math.sin(th)*r*1.5+r*1.2;Q.push([cx+nx*(x+s*r*.5)+ux*y,cy+ny*(x+s*r*.5)+uy*y])}}
    else{const cx=B2[0]+ux*Lp*t+nx*rad(t)*.85*s,cy=B2[1]+uy*Lp*t+ny*rad(t)*.85*s;for(let a=0;a<10;a++){const th=a*Math.PI/5,rr=a%2?r*.6:r;Q.push([cx+Math.cos(th)*rr+nx*s*r*.4,cy+Math.sin(th)*rr+ny*s*r*.4])}}
    fl.push(Q)}}
  return{z:(b[2]+e[2])/2,P,sc,fl,fsh}}
function l60Corymb(og,op,cw,S){const H0=V3.nz(og.H),out=[],kent=!!cw.kent,[X,Y]=fgCross(H0),nb=kent?(rnd()<.5?3:4):S.nb,PB=pal7(cw.bra),PG=pal7(cw.bg||cw.bra),ink=PB.ink,c1s=kent?mix(toneAt(PG,.66),toneAt(PB,.6),.3):toneAt(PB,.5),c2s=kent?mix(toneAt(PG,.66),toneAt(PB,.6),.95):toneAt(PB,.66);
  for(let i=0;i<nb;i++){const a=(i*137.5+R(-20,20))*D,sp=i===0?R(0,.15):R(.6,1.05),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),
      d=V3.nz(V3.add(V3.add(H0,V3.sc(r,sp)),kent?[0,-.25,0]:[0,.35,0])),Lb=S.Lb*(i===0?.55:R(.75,1.05)),c1=V3.add(og.pos,V3.sc(d,Lb)),m=V3.add(V3.add(og.pos,V3.sc(d,Lb*.5)),kent?[0,Lb*.12,0]:[0,0,0]);
    if(S.lim!=null&&c1[1]<S.lim)continue;
    /* the pedicel, then its spikelets on short stalks fanned from its end (nodding in the Kent Beauty) */
    const ns=kent?(rnd()<.5?2:3):S.ns,sk=[];
    for(let j=0;j<ns;j++){const b2=(j*120+R(-25,25))*D,[X2,Y2]=fgCross(d),r2=V3.add(V3.sc(X2,Math.cos(b2)),V3.sc(Y2,Math.sin(b2))),
        d2=V3.nz(kent?V3.add(V3.add(V3.sc(d,.3),V3.sc(r2,.5)),[0,-1.1,0]):V3.add(d,V3.sc(r2,.55))),st=S.ls*R(.8,1.2),b=V3.add(c1,V3.sc(d2,st));
      if(S.lim!=null&&V3.add(b,V3.sc(d2,S.Ls))[1]<S.lim)continue;sk.push({st:[l60Q(c1),l60Q(b)],sp:l60Spikelet(b,d2,S.Ls*R(.85,1.15),S.rs,cw,op,kent)})}
    const ped=[l60Q(og.pos),l60Q(m),l60Q(c1)],pw=Math.max(1.25,S.pw),z=c1[2];
    out.push({z,cast:false,fn:par=>{E('path',{d:`M${f(ped[0][0])},${f(ped[0][1])}Q${f(ped[1][0])},${f(ped[1][1])} ${f(ped[2][0])},${f(ped[2][1])}`,stroke:S.pc,'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par);
      let ds='';for(const s of sk)ds+=`M${f(s.st[0][0])},${f(s.st[0][1])}L${f(s.st[1][0])},${f(s.st[1][1])}`;if(ds)E('path',{d:ds,stroke:S.pc,'stroke-width':f(Math.max(1.2,pw*.85)),fill:'none','stroke-linecap':'round'},par);
      /* each spikelet: its body, then its bracts in two tiers (the lower ones, the tinted tips); the flowers of the whole branch last */
      let dfl='';for(const s of sk.sort((a,b)=>a.sp.z-b.sp.z)){const q=s.sp;E('path',{d:smooth(q.P),fill:kent?toneAt(PG,.62):toneAt(PB,.5),stroke:ink,'stroke-width':.4,'stroke-opacity':.5},par);
        for(const[lo,hi,col]of[[0,.5,c1s],[.5,2,c2s]]){const d=q.sc.filter(c=>c.t>=lo&&c.t<hi).map(c=>smooth(c.Q,false)).join('');if(d)E('path',{d,fill:col,stroke:ink,'stroke-width':.35,'stroke-opacity':.45},par)}
        dfl+=q.fl.map(Q=>smooth(Q)).join('')}
      if(dfl)E('path',{d:dfl,fill:cw.fl,stroke:shd(cw.fl,-.4),'stroke-width':.3,'stroke-opacity':.5},par)}})}
  return out}
function l60Ori(g,t,o){const cw=fgCw(CW_L60ORI,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=2.5,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g),kent=!!cw.kent;
  return g35Run(o,'l60ori',()=>{const Lt=o.spine?blen(o.spine):(kent?28:35)*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*(kent?R(.3,.42):R(.06,.16))),cols=L60_ST(cw.st),lim=g35Lim(o),
      wp=kent?L60_KENW:L60_ORIW,wr=kent?.9:.66,sh=g35Prof(wp,wr,10),veins=l60Veins(wp,wr,3,0),
      CS={nb:6,ns:3,Lb:2.2*UPC*kl,ls:.3*UPC*kl,Ls:(kent?2.3:.75)*UPC*kl,rs:(kent?.55:.24)*UPC*kl,pw:1.25,pc:mix(cw.st,cw.bra||cw.st,.3),lim};
    const r=fgGrow(k,A,{li:(kent?1.8:2.2)*UPC*kl,liT:.4,w0:3.2*kl,w1:cw.f?1.8:1.3,cols,uL:o.spine?.25:.1,phy:'opp',la:kent?62:54,face:.62,lift:kent?.2:.4,seg:9,wig:.025,tipLv:cw.f?0:undefined,
      side:{u0:cw.f?.45:.3,u1:.85,p:kent?.4:cw.f?.5:.3,len:cw.f?.28:.35,ang:34,li:.7,e:kent?-.02:-.004,pair:kent?0:1,tilt:18},
      leaf:(og,p)=>{const u=p.o?(p.b??1):p.u,young=u>.85?(u-.85)/.15*(.4+.6*(1-op)):0,sz=(p.tip?.5:fgSz(p,.78))*(p.o?.75:1)*kl*(cw.f&&u>.75?.7:1),L=cm0*UPC*sz*R(.86,1.12),
          c=cw.y&&u>.55?mix(cw.c,cw.y,.5):cw.c;
        return l60Leaf(og,L,L*.14,sh,mix(c,shd(c,R(-.06,.06)),.5),mix(c,kent?'#d8e0d0':'#b8c8a0',.35),1.25*kl,cols[2],{lim,sm:1,fold:.16+.4*young,arch:.08,droop:kent?.2:.12,cup:kent?-.1:.04,
          tw:R(-.25,.25),dI:kent?.05:.02,veins,vAll:kent?1:0,vc:kent?mix(c,'#e8ece4',.5):shd(c,-.3),vw:.4,vo:.5,edge:kent?mix(c,'#e0e6dc',.5):null})},
      tip:(og,p)=>cw.f?l60Corymb(og,op,cw,p.o?Object.assign({},CS,{nb:4,ns:2,Lb:CS.Lb*.8}):CS):null,
      post:(res,parts)=>l60Square(res,parts,cols)});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf length; for rosemary its needles), and how the composer treats them:
   leafy stems along their spine at their natural length (fx the clearance their leaves need) ---------- */
Object.assign(GH,{'salvia-rosmarinus-romarin':l60Rom,'salvia-officinalis-sauge':l60Sau,'mentha-menthe':l60Men,'ocimum-basilic':l60Bas,'origanum-origan':l60Ori});
Object.assign(CWS,{'salvia-rosmarinus-romarin':CW_L60ROM,'salvia-officinalis-sauge':CW_L60SAU,'mentha-menthe':CW_L60MEN,'ocimum-basilic':CW_L60BAS,'origanum-origan':CW_L60ORI});
Object.assign(SZG,{'salvia-rosmarinus-romarin':[2,2.5,2.5,3],'salvia-officinalis-sauge':[5,6,6,7],'mentha-menthe':[4,5,5,6],'ocimum-basilic':[5,6,6,7.5],'origanum-origan':[2,2.5,2.5,3]});
const L60_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'salvia-rosmarinus-romarin':L60_I(35,{fx:14}),'salvia-officinalis-sauge':L60_I(30,{fx:24}),'mentha-menthe':L60_I(35,{fx:20}),'ocimum-basilic':L60_I(30,{fx:24}),
  'origanum-origan':L60_I(35,{fx:16})});
