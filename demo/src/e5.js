
/* ================= Générateur paramétrique (suite) : épis, grappes, retombées, lignes, feuillages, baies, matières ================= */
const SH=rec=>(rec.p&&rec.p.len||rec.cm||40)*UPC;
/* bent stems: a spine is a cubic Bézier from the base (0,0) chosen by the composer; o.from skips its lower part (drawn with the other stems) */
const blen=P=>{let l=0,a=P[0];for(let i=1;i<=20;i++){const b=bz(P,i/20);l+=Math.hypot(b[0]-a[0],b[1]-a[1]);a=b}return l};
const bang=(P,u)=>{const a=bz(P,Math.max(0,u-.012)),b=bz(P,Math.min(1,u+.012));return Math.atan2(b[0]-a[0],a[1]-b[1])/D};
function bseg(P,a,b){const sp=(Q,t)=>{const m=(p,q)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t],A=m(Q[0],Q[1]),B=m(Q[1],Q[2]),C=m(Q[2],Q[3]),AB=m(A,B),BC=m(B,C),X=m(AB,BC);return[[Q[0],A,AB,X],[X,BC,C,Q[3]]]};
  const Rt=a>0?sp(P,a)[1]:P;return b<1?sp(Rt,(b-a)/(1-a))[0]:Rt}
/* ---- spike: 3D florets spiralling up a stem, biggest at the bottom, buds on top (grows up from 0,0) ---- */
function gSpike(g,t,rec,o){const p=rec.p||{},c=palR(rec,o),cb=backT(c),k=G(g),Lf=(rec.cm||30)*UPC,L0=Lf*1.5,n=Math.min(64,p.n||22),fl=p.fl||{a:'radial',cm:2.5,n:5},fr=(fl.cm||2.5)/2*UPC,sw=R(-.1,.1)*L0,
  P=o.spine||[[0,0],[sw*.2,-L0*.35],[sw*.6,-L0*.7],[sw,-L0]],Ls=o.spine?blen(P):L0,sc=rec.stem&&rec.stem.col||'#4a6a34';stem3(k,o.from?bseg(P,o.from,1):P,f(Math.max(2,(rec.stem&&rec.stem.w||5)*.65)),1.6,[dk(sc,.4),sc,lt(sc,.3),lt(sc,.6)],16);
  const parts=[],u0=Math.max(.12,1-Lf/Ls),nb=p.buds??4,tot=n+nb,side=p.side||0;let pd='';
  for(let i=0;i<tot;i++){const u=u0+(1-u0-.02)*i/(tot-1),q=bz(P,u),ph=side?(-80+160*((i*.618)%1))*D:i*137.508*D,tp=1-(p.taper??.5)*(i/tot),r=fr*tp,ro=i>=n?r*.28+1:r*.55+2,ta=bang(P,u)*D,ux=Math.sin(ta),uy=Math.cos(ta),s1=Math.sin(ph);
    const O=[q[0]+uy*s1*ro,-q[1]-ux*s1*ro,Math.cos(ph)*ro];pd+=`M${f(q[0])},${f(q[1])}L${f(O[0])},${f(-O[1])}`;const bell=fl.a==='bell',kk=bell?-.55:.35,ax=V3.nz([uy*s1*.85+ux*kk,-ux*s1*.85+uy*kk,Math.cos(ph)*.85]);
    if(i>=n){const v=[O[0],-O[1],O[2]];parts.push({z:O[2],fn:par=>{E('ellipse',{cx:f(v[0]),cy:f(v[1]),rx:f(Math.max(1.2,r*.45)),ry:f(Math.max(1.6,r*.62)),fill:rad([[0,lt(c[2],.3)],[1,mix(c[1],'#7a9a50',.4)]],.4,.35,.7)},par)}});continue}
    floretParts(parts,fl,basis(ax,R(0,6.28)),O,c,cb,r)}
  parts.push({z:-1e9,fn:par=>E('path',{d:pd,stroke:mix(sc,c[1],.25),'stroke-width':f(Math.max(.7,Math.min(1.4,fr*.16))),'stroke-linecap':'round',fill:'none'},par)});
  drawParts(k,parts);open(k,t,1100,0,.5)}
/* ---- spray: branched stem carrying many small florets (gypsophila, statice, solidago, waxflower, spray roses, lilac…) ---- */
function gSpray(g,t,rec,o){const p=rec.p||{},c=palR(rec,o),cb=backT(c),k=G(g),Hs=SH(rec),nb=Math.min(12,p.branches||5),fl=p.fl||{a:'dot',cm:.6},n=Math.min(fl.a==='dot'||fl.a==='ball'?160:fl.a==='double'?30:55,p.n||40),fr=Math.max(1,(fl.cm||.8)/2*UPC),sh=p.shape||'airy',sc=rec.stem&&rec.stem.col||'#5a7a3a',parts=[];
  const M=o.spine||[[0,0],[R(-6,6),-Hs*.4],[R(-10,10),-Hs*.75],[R(-8,8),-Hs]],uS=o.spine?Math.max(.3,1-Hs/blen(M)):0;stem3(k,o.from?bseg(M,o.from,1):M,3,1.4,[dk(sc,.4),sc,lt(sc,.3),lt(sc,.6)],12);const tips=[];
  for(let b=0;b<nb;b++){const u0=sh==='raceme'?.4+.55*b/nb:R(.45,.85),u=uS+(1-uS)*u0,q=bz(M,u),sd=b%2?1:-1,ang=(bang(M,u)+(sh==='corymb'?R(15,45):sh==='panicle'?R(30,70)*(1-u0*.5):R(20,60))*sd)*D,len=Hs*(sh==='panicle'?.38*(1.2-u):R(.18,.36)),e=[q[0]+Math.sin(ang)*len,q[1]-Math.cos(ang)*len];
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f((q[0]+e[0])/2+sd*4)},${f((q[1]+e[1])/2)} ${f(e[0])},${f(e[1])}`,stroke:sc,'stroke-width':1.1,fill:'none'},k);tips.push(e)}tips.push(M[3]);
  for(let i=0;i<n;i++){const tp=tips[i%tips.length],spread=sh==='airy'?Hs*.08:sh==='corymb'?Hs*.06:Hs*.045,x=tp[0]+R(-spread,spread),y=tp[1]+R(-spread,spread*.6),z=R(-spread,spread);
    E('path',{d:`M${f(tp[0])},${f(tp[1])}L${f(x)},${f(y)}`,stroke:sc,'stroke-width':.5,'stroke-opacity':.7},k);floretParts(parts,fl,basis(V3.nz([(x-tp[0])*.02,.6,1]),R(0,6.28)),[x,-y,z],i%3?c:tint(c,c[0],.15),cb,fr*R(.8,1.15))}
  drawParts(k,parts);open(k,t,1000,0,.5)}
/* ---- drape: hangs downward from 0,0 ---- */
function gDrape(g,t,rec,o){const p=rec.p||{},col=o.col||(rec.cols&&rec.cols[0])||'#8e1235',L=(o.len||(p.len||rec.cm||50)*UPC),ty=p.type||'chenille',k=G(g);
  if(ty==='chenille'){amaranth2(k,t,{col,len:L,sway:o.sway??R(-40,40)});return}
  const sw=o.sway??R(-30,30),P=[[0,0],[sw*.3,L*.3],[sw*.8,L*.65],[sw,L]];
  if(ty==='beads'){E('path',{d:cp(P),stroke:'#6a7a4a','stroke-width':.6,fill:'none'},k);for(let i=0;i<L/5;i++){const q=bz(P,i/(L/5));E('circle',{cx:f(q[0]+R(-1.5,1.5)),cy:f(q[1]),r:2.4,fill:rad([[0,'#c8e0a0'],[1,'#5a8a3a']],.35,.3,.75)},k)}open(k,t,1100,0,0);return}
  if(ty==='moss'){for(let j=0;j<5;j++){let d='M0,0';for(let i=1;i<=12;i++)d+=`L${f(Math.sin(i*1.3+j)*8+sw*i/12)},${f(L*i/12)}`;E('path',{d,stroke:'#b8bfb0','stroke-width':.8,fill:'none','stroke-opacity':.8},k)}open(k,t,1100,0,0);return}
  E('path',{d:cp(P),stroke:'#4f6a34','stroke-width':1.2,fill:'none'},k);const lc=tones(rec.cols&&rec.cols[1]||'#4f7a3a');
  for(let i=1;i<14;i++){const q=bz(P,i/14),sd=i%2?1:-1;leaf3(k,10*R(.8,1.2),5,[lc[0],lc[1],lc[2],lc[3],lc[4]],{tr:`translate(${f(q[0])},${f(q[1])}) rotate(${f(sd*70+R(-15,15))})`,nv:2,mr:.4,prof:sinP(.5,.08)});
    if(p.fl&&i%3===0){const pr=[];floretParts(pr,p.fl,basis([sd*.5,-.2,.9],0),[q[0]+sd*4,-q[1],2],tones(col),backT(tones(col)),(p.fl.cm||2)/2*UPC);drawParts(k,pr)}}open(k,t,1100,0,0)}
/* ---- line: grasses, branches, plumes, seed heads, blossom branches (grows up from 0,0) ---- */
function gLine(g,t,rec,o){const p=rec.p||{},ty=p.type||'grass',S=o.spine,Hs=S?blen(S):SH(rec),col=p.col||(rec.stem&&rec.stem.col)||(rec.cols&&rec.cols[0])||'#6a7a3a',k=G(g);
  if(ty==='loop')return grassLoop(k,t,{len:Hs,sc:col,spine:S});if(ty==='curly')return willow(k,t,{len:Hs,sc:col,spine:S});
  if(ty==='grass'){for(let i=0;i<4;i++){let d;
      if(S){const w=R(-.1,.1)*Hs;d=cp(bseg([S[0],[S[1][0]+w*.15,S[1][1]],[S[2][0]+w*.55,S[2][1]],[S[3][0]+w,S[3][1]]],0,R(.78,1)))}
      else{const b=R(-.4,.4)*Hs,h=Hs*R(.75,1);d=`M${f(R(-3,3))},0C${f(b*.2)},${f(-h*.4)} ${f(b*.6)},${f(-h*.75)} ${f(b)},${f(-h)}`}
      E('path',{d,stroke:i%2?col:dk(col,.2),'stroke-width':f(R(1,1.8)),fill:'none','stroke-linecap':'round'},k)}open(k,t,1000,0,0);return}
  const sw=R(-.15,.15)*Hs,P=S||[[0,0],[sw*.2,-Hs*.35],[sw*.6,-Hs*.7],[sw,-Hs]];
  if(ty==='plume'||ty==='seedhead'){E('path',{d:taper(P,u=>1.6-.8*u,12),fill:dk(col,.15)},k);const c=tones(rec.cols&&rec.cols[0]||'#e8dcc0');
    if(ty==='plume'){for(let i=0;i<70;i++){const u=R(.66,1),q=bz(P,u),w=(1-Math.abs(u-.83)/.17)*Hs*.07,a=bang(P,u)*D,h1=R(4,10),h2=R(6,14),wx=R(-w,w);
        E('path',{d:`M${f(q[0])},${f(q[1])}q${f(wx*Math.cos(a)+h1*Math.sin(a))},${f(wx*Math.sin(a)-h1*Math.cos(a))} ${f(wx*1.6*Math.cos(a)+h2*Math.sin(a))},${f(wx*1.6*Math.sin(a)-h2*Math.cos(a))}`,stroke:pick([c[2],c[3],c[4]]),'stroke-width':.8,'stroke-opacity':.75,fill:'none'},k)}}
    else for(let i=0;i<22;i++){const u=.7+.29*i/22,q=bz(P,u),sd=i%2?1:-1,a=bang(P,u),cx=q[0]+sd*2.4*Math.cos(a*D),cy=q[1]+sd*2.4*Math.sin(a*D);const ro=(a+sd*25)*D,tx=cx+Math.sin(ro)*3.6,ty=cy-Math.cos(ro)*3.6,ra=ro+sd*.12;if(!LOD)E('path',{d:`M${f(tx)},${f(ty)}l${f(Math.sin(ra)*14)},${f(-Math.cos(ra)*14)}`,stroke:c[1],'stroke-width':.5},k);
      E('ellipse',{cx:f(cx),cy:f(cy),rx:2,ry:4.2,fill:rad([[0,c[3]],[1,c[1]]],.35,.35,.7),transform:`rotate(${f(a+sd*25)} ${f(cx)} ${f(cy)})`},k)}
    open(k,t,1000,0,.4);return}
  /* woody branch with forks, optional leaves, blossoms and berries */
  E('path',{d:taper(P,u=>3.4-2.2*u,14),fill:col},k);E('path',{d:taper(P.map(q=>[q[0]-1,q[1]]),u=>.9-.6*u,12),fill:lt(col,.35),opacity:.6},k);const nodes=[];
  /* forks and buds spaced at their real interval, so a branch cut short keeps a natural density */
  const nf=Hs>200?3:Hs>120?2:Hs>70?1:0,nn=Math.max(3,Math.min(8,Math.round(Hs/34)));
  for(let b=0;b<nf;b++){const u=R(.35,.8),q=bz(P,u),sd=b%2?1:-1,len=Hs*R(.2,.35),a=(bang(P,u)+sd*R(28,46))*D,e=[q[0]+Math.sin(a)*len,q[1]-Math.cos(a)*len],m=[q[0]+Math.sin(a-sd*.3)*len*.5,q[1]-Math.cos(a-sd*.3)*len*.5];
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`,stroke:col,'stroke-width':1.4,fill:'none','stroke-linecap':'round'},k);nodes.push(e,[(q[0]+2*m[0]+e[0])/4,(q[1]+2*m[1]+e[1])/4])}
  for(let i=0;i<nn;i++)nodes.push(bz(P,.3+.7*i/nn));nodes.push(P[3]);
  if(p.leaves){const lc=tones(p.leaves.col||'#5a8a3a');for(const q of nodes)leaf3(k,(p.leaves.cm||4)*UPC*.9,(p.leaves.cm||4)*UPC*.3,lc,{tr:`translate(${f(q[0])},${f(q[1])}) rotate(${f(R(-70,70))})`,nv:3,mr:.5})}
  if(p.berries){const bc=p.berries.col||rec.c2||'#b02030',nb=(p.berries.cm||.8)>1.2?1:Hs<160?2:3;for(const q of nodes)for(let j=0;j<nb;j++){const r=(p.berries.cm||.8)/2*UPC,jt=Math.min(4,r*.6),x=q[0]+R(-jt,jt),y=q[1]+R(-jt,jt);E('circle',{cx:f(x),cy:f(y),r:f(r),fill:rad([[0,lt(bc,.4)],[.6,bc],[1,dk(bc,.4)]],.35,.3,.75)},k)}}
  if(p.fl||ty==='blossom'){const fl=p.fl||{a:'cup',cm:2.5,n:5},c=palR(rec,o),parts=[];for(const q of nodes)for(let j=0;j<2;j++){const jt=Math.min(5,(fl.cm||2.5)/2*UPC*.6),v=[q[0]+R(-jt,jt),-(q[1]+R(-jt,jt)),R(-3,3)];floretParts(parts,fl,basis(V3.nz([R(-.5,.5),R(.2,.6),1]),R(0,6.28)),v,c,backT(c),(fl.cm||2.5)/2*UPC*R(.8,1.1))}drawParts(k,parts)}
  open(k,t,1100,0,.4)}
/* ---- foliage: leaves by shape and arrangement (grows up from 0,0) ---- */
const LPROF={split:[t=>Math.sin(Math.PI*Math.min(.97,.04+.96*Math.pow(t,.7))),.85],lanceolate:[sinP(.6,.05),.22],elliptic:[sinP(.5,.06),.38],ovate:[t=>Math.sin(Math.PI*Math.min(.97,.08+.92*Math.pow(t,.75))),.5],round:[sinP(.42,.2),.85],cordate:[t=>Math.sin(Math.PI*Math.min(.97,.04+.96*Math.pow(t,.7))),.62],strap:[sinP(.32,.04),.11],needle:[sinP(.4,.04),.05],lobed:[sinP(.45,.1),.55]};
function leafShape(par,sh,Lu,w,cs,o2){if(sh==='fan')return palmFan(par,Lu*1.2);if(sh==='pinnate'||sh==='feathery')return frond(par,Lu,{n:sh==='feathery'?30:18,c:[cs[0],cs[1],cs[2],cs[3]],droop:.15});
  if(sh==='palmate'){for(let i=0;i<7;i++)leaf3(par,Lu*R(.7,.9)*(1-Math.abs(i-3)*.08),Lu*.12,cs,{tr:`rotate(${f(-70+i*23)})`,nv:3,mr:.6,teeth:o2.teeth?6:0});return}
  const[pf,wr]=LPROF[sh]||LPROF.elliptic,W=Lu*(w||wr)/2,cv=o2.vc?[cs[0],cs[1],cs[2],cs[3],o2.vc]:cs,bend=R(-.12,.12);
  const lg=leaf3(par,Lu,W,cv,{prof:pf,nv:sh==='strap'||sh==='needle'?0:6,va:.12,teeth:o2.teeth||sh==='lobed'?(sh==='lobed'?4:9):0,gloss:o2.gloss||0,mr:sh==='needle'?.2:o2.vc?1.6:1,bend,vo:o2.vc?.85:undefined,vw:o2.vc?Math.max(.8,Lu/120):undefined});
  /* two-tone leaves (coleus, begonia rex): a smaller leaf of the inner colour on top */
  if(o2.inner)leaf3(G(lg,{transform:`translate(0,${f(-Lu*.07)}) scale(.72)`}),Lu,W,tones(o2.inner),{prof:pf,nv:0,teeth:o2.teeth?9:0,mr:.6,bend});
  if(o2.spots&&!LOD)for(let i=0;i<16;i++){const tt=R(.15,.85),x=R(-1,1)*W*pf(tt)*.7;E('ellipse',{cx:f(x+bend*Lu*tt*tt),cy:f(-Lu*tt),rx:f(Lu*R(.008,.016)+.5),ry:f(Lu*R(.012,.022)+.6),fill:o2.spots,opacity:.8},lg)}
  if(o2.var&&!LOD)E('path',{d:taper([[0,0],[0,-Lu*.33],[0,-Lu*.66],[0,-Lu*.95]],u=>W*.3*(1-u),10),fill:o2.var,opacity:.55},lg);if(sh==='split'){const pf=LPROF.split[0];let d='';for(let i=1;i<=6;i++){const t=.14+i*.12;for(const sd of[-1,1]){const w=W*pf(t)*.9,bx=bend*Lu*t*t,x0=sd*w+bx,y0=-Lu*t,x1=sd*w*.38+bend*Lu*(t+.05)**2,y1=y0-Lu*.05;d+=`M${f(x0)},${f(y0)}L${f(x1)},${f(y1)}`}}
    E('path',{d,stroke:cs[0],'stroke-width':f(Math.max(1.6,Lu/70)),'stroke-linecap':'round',fill:'none'},lg);if(!LOD)for(let i=0;i<4;i++){const t=.3+i*.14,sd=i%2?1:-1;const hx0=sd*W*.28+bend*Lu*t*t;E('ellipse',{cx:f(hx0),cy:f(-Lu*t),rx:f(Lu*.012+1),ry:f(Lu*.03+1),fill:cs[0],transform:`rotate(${sd*25} ${f(hx0)} ${f(-Lu*t)})`},lg)}}return lg}
function gFoliage(g,t,rec,o){const p=rec.p||{},lf=p.leaf||{shape:'elliptic',cm:rec.cm||8},Lu=(lf.cm||rec.cm||8)*UPC,cs=tones(o.col||(rec.cols&&rec.cols[0])||'#3e6a3a'),arr=p.arr||'alternate',n=Math.min(30,p.n||8),Hs=(p.len||rec.stem&&rec.stem.cm*.6||40)*UPC,k=G(g),sc=rec.stem&&rec.stem.col||dk(cs[2],.2),o2={teeth:lf.teeth,gloss:lf.gloss,var:lf.var,vc:lf.c2,spots:lf.spots,inner:lf.inner};
  const S=o.spine;if(arr==='frond'){frond(S?G(k,{transform:`rotate(${f(bang(S,1)*.75)})`}):k,S?blen(S):Hs,{c:[cs[0],cs[1],cs[2],cs[3]],droop:.2,n:26});open(k,t,1000,0,.4);return}
  if(S&&(arr==='single'||arr==='rosette')){const m=arr==='single'?1:Math.min(9,n),ea=bang(S,1);E('path',{d:cp(o.from?bseg(S,o.from,1):S),stroke:sc,'stroke-width':2,fill:'none'},k);
    for(let i=0;i<m;i++)leafShape(G(k,{transform:`translate(${f(S[3][0])},${f(S[3][1])}) rotate(${f(ea+(m===1?R(-8,8):-38+76*i/(m-1)+R(-6,6)))})`}),lf.shape,Lu,lf.w,cs,o2);open(k,t,1000,0,.4);return}
  if(arr==='single'||arr==='rosette'){const m=arr==='single'?1:Math.min(9,n);for(let i=0;i<m;i++){const a=m===1?R(-8,8):-60+120*i/(m-1)+R(-6,6),pl=arr==='single'?Hs*.45:Hs*.1,q=[Math.sin(a*D)*pl,-Math.cos(a*D)*pl];
      E('path',{d:`M0,0Q${f(q[0]*.4)},${f(q[1]*.6)} ${f(q[0])},${f(q[1])}`,stroke:sc,'stroke-width':2,fill:'none'},k);leafShape(G(k,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(a)})`}),lf.shape,Lu,lf.w,cs,o2)}open(k,t,1000,0,.4);return}
  const sw=R(-.12,.12)*Hs,P=S||[[0,0],[sw*.2,-Hs*.35],[sw*.6,-Hs*.7],[sw,-Hs]],uL=Math.max(.12,o.from||0);stem3(k,o.from?bseg(P,o.from,1):P,2.4,1.5,[dk(sc,.35),sc,lt(sc,.25),lt(sc,.5)],12);
  for(let i=0;i<n;i++){const u=uL+(.98-uL)*i/n,q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),a=Math.atan2(q2[1]-q[1],q2[0]-q[0])/D+90,sz=1-.45*u,
    sides=arr==='opposite'||arr==='whorl'?(arr==='whorl'?[-1,0,1]:[-1,1]):[i%2?1:-1];
    for(const sd of sides)leafShape(G(k,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(a+sd*R(40,62)+(arr==='clustered'?R(-30,30):0))}) scale(${f(sz)})`}),lf.shape,Lu,lf.w,cs,o2)}
  leafShape(G(k,{transform:`translate(${f(P[3][0])},${f(P[3][1])}) rotate(${f(S?bang(P,1):sw/Hs*40)}) scale(.55)`}),lf.shape,Lu,lf.w,cs,o2);open(k,t,1000,0,.4)}
/* ---- berries and fruits ---- */
function berry(par,x,y,r,col,gl=.6){E('circle',{cx:f(x),cy:f(y),r:f(r),fill:rad([[0,lt(col,.42)],[.55,col],[1,dk(col,.45)]],.35,.3,.78)},par);if(gl&&!LOD)glint(par,x-r*.35,y-r*.38,r*.28,r*.2,-30,q20(gl*.8))}
function gBerry3(g,t,rec,o){const p=rec.p||{},ty=p.type||'cluster',col=o.col||(rec.cols&&rec.cols[0])||'#b02030',Hs=(rec.stem&&rec.stem.cm*.5||30)*UPC,r=Math.min(6,(rec.p&&rec.p.cm)||rec.cm||1)/2*UPC,n=Math.min(60,p.n||12),k=G(g),sc=rec.stem&&rec.stem.col||'#5a4a2a';
  const P=o.spine||[[0,0],[R(-5,5),-Hs*.4],[R(-8,8),-Hs*.75],[R(-6,6),-Hs]];E('path',{d:taper(o.from?bseg(P,o.from,1):P,u=>2.2-1.2*u,12),fill:sc},k);
  if(p.leaves){const lc=tones(p.leaves.col||'#4f7a34');for(let i=0;i<(p.leaves.n||4);i++){const q=bz(P,.3+.6*i/(p.leaves.n||4)),sd=i%2?1:-1;leaf3(k,(p.leaves.cm||5)*UPC,(p.leaves.cm||5)*UPC*.22,lc,{tr:`translate(${f(q[0])},${f(q[1])}) rotate(${f(bang(P,.3+.6*i/(p.leaves.n||4))+sd*55)})`,nv:4,mr:.6})}}
  const top=P[3];
  if(ty==='lantern'){for(let i=0;i<Math.min(7,n);i++){const q=bz(P,.45+.55*i/7),sd=i%2?1:-1,x=q[0]+sd*10,y=q[1]+6,lg=G(k,{transform:`translate(${f(x)},${f(y)})`});E('path',{d:`M${f(q[0]-x)},${f(q[1]-y)}L0,-${f(r)}`,stroke:sc,'stroke-width':.8},lg);
      const d=`M0,-${f(r)}C${f(r*1.1)},-${f(r*.6)} ${f(r*.9)},${f(r*.9)} 0,${f(r*1.2)}C-${f(r*.9)},${f(r*.9)} -${f(r*1.1)},-${f(r*.6)} 0,-${f(r)}Z`;E('path',{d,fill:rad([[0,lt(col,.35)],[1,dk(col,.3)]],.4,.4,.7)},lg);for(const xx of[-.45,0,.45])E('path',{d:`M0,-${f(r)}Q${f(xx*r*1.4)},0 0,${f(r*1.2)}`,stroke:dk(col,.35),'stroke-width':.6,fill:'none'},lg)}open(k,t,1000,0,.4);return}
  if(ty==='single'){berry(k,top[0],top[1]-r*.9,r,col,p.gloss??.5);if(rec.c2)E('path',{d:`M${f(top[0]-r*.25)},${f(top[1]-r*1.85)}l${f(r*.25)},-${f(r*.3)}l${f(r*.25)},${f(r*.3)}`,stroke:rec.c2,'stroke-width':2,fill:'none'},k);open(k,t,1000,0,.4);return}
  const pk=G(k);let pd='';
  for(let i=0;i<n;i++){let x,y;if(ty==='spike'){const u=.55+.45*i/n,q=bz(P,u);x=q[0]+R(-r,r)*2;y=q[1]+R(-r,r);pd+=`M${f(q[0])},${f(q[1])}L${f(x)},${f(y)}`}else if(ty==='umbel'){const a=R(-2.6,-.5),d=R(.4,1)*Hs*.18;x=top[0]+Math.cos(a)*d;y=top[1]+Math.sin(a)*d;E('path',{d:`M${f(top[0])},${f(top[1])}L${f(x)},${f(y)}`,stroke:sc,'stroke-width':.5},k)}else{const a=R(0,6.28),d=Math.sqrt(rnd())*Math.sqrt(n)*r*1.05;x=top[0]+Math.cos(a)*d;y=top[1]+Math.sin(a)*d*.8-r;pd+=`M${f(top[0])},${f(top[1])}Q${f(top[0]+(x-top[0])*.2)},${f(top[1]+(y-top[1])*.7)} ${f(x)},${f(y)}`}
    berry(k,x,y,r*R(.85,1.1),i%4?col:mix(col,'#ffffff',.15),p.gloss??.6)}
  if(pd)E('path',{d:pd,stroke:sc,'stroke-width':f(Math.max(.7,Math.min(1.3,r*.22))),'stroke-linecap':'round',fill:'none'},pk);open(k,t,1000,0,.4)}
/* ---- accessories (matières) ---- */
function gAccessory(g,t,rec,o){const kd=(rec.p||{}).kind||'wire',col=o.col||(rec.cols&&rec.cols[0])||'#8e1430',k=G(g),S=o.spine,Hs=S?blen(S):SH(rec);
  const at=(u,off,lift=0)=>{if(!S)return[off+lift*0,-Hs*u];const q=bz(S,u),a=bang(S,u)*D;return[q[0]+Math.cos(a)*off+Math.sin(a)*lift,q[1]+Math.sin(a)*off-Math.cos(a)*lift]};
  if(kd==='wire'){let d='M0,0';for(let i=1;i<=40;i++){const u=i/40,q=S?at(u,Math.sin(u*18)*10*(1-u*.5),Math.cos(u*18)*6):[Math.sin(u*18)*10*(1-u*.5)+u*20,-Hs*u+Math.cos(u*18)*6];d+=`L${f(q[0])},${f(q[1])}`}
    E('path',{d,stroke:col,'stroke-width':1.6,fill:'none','stroke-linecap':'round'},k);E('path',{d,stroke:'#fff','stroke-width':.5,'stroke-opacity':.5,fill:'none',transform:'translate(-.5,-.5)'},k)}
  else if(kd==='feather'){const P=S||[[0,0],[4,-Hs*.4],[10,-Hs*.75],[18,-Hs]];E('path',{d:cp(P),stroke:lt(col,.3),'stroke-width':1,fill:'none'},k);for(let i=0;i<60;i++){const u=.25+.75*i/60,q=bz(P,u),sd=i%2?1:-1,a=bang(P,u)*D,w=24*(1-u*.4),dx=sd*w*Math.cos(a)+R(-2,8)*Math.sin(a),dy=sd*w*Math.sin(a)-R(-2,8)*Math.cos(a);
      E('path',{d:`M${f(q[0])},${f(q[1])}q${f(dx*.5)},${f(dy*.5-4)} ${f(dx)},${f(dy)}`,stroke:pick([col,lt(col,.2),dk(col,.15)]),'stroke-width':.8,'stroke-opacity':.8,fill:'none'},k)}}
  else if(kd==='pearls'){const P=S||[[0,0],[-15,-Hs*.3],[20,-Hs*.6],[0,-Hs]],nb=Math.floor(Hs/5.2);E('path',{d:cp(P),stroke:'#b9b4ac','stroke-width':.8,fill:'none'},k);for(let i=0;i<=nb;i++){const q=bz(P,i/nb);berry(k,q[0],q[1],2.6,col||'#f4eee4',.8)}}
  else{for(let i=0;i<2;i++){const d=S?cp([S[0],at(.35,-20+i*40),at(.7,-30+i*60),at(1,-8+i*16)]):`M0,0C${f(-20+i*40)},-${f(Hs*.4)} ${f(-30+i*60)},-${f(Hs*.7)} ${f(-8+i*16)},-${f(Hs)}`;E('path',{d,stroke:col,'stroke-width':6,'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},k)}}
  open(k,t,900,0,.4)}
/* ---- dispatcher and composer metadata ---- */
const GEN={radial:gRadial,double:gDouble,cup:gCup,star:gStar,spathe:gSpathe,orchid:gOrchid,globe:gGlobe,protea:gProtea,exotic:gExotic,spike:gSpike,spray:gSpray,drape:gDrape,line:gLine,foliage:gFoliage,berries:gBerry3,accessory:gAccessory};
function customOpts(fn,col,c2){const c=tones(col);
  if(fn==='xCalla')return{c,ic:[mix(c[1],c[2],.5),lt(c[2],.3)],nk:'#6f8a3a',sp:c2||'#f0b72a'};if(fn==='xAnth')return{c,sp:[lt(c2||'#f3e6c2',.2),c2||'#c9a96a']};
  if(fn==='cattleya')return{c:[c[1],c[2],c[3],c[0]],lip:[dk(c2||col,.4),c2||col,'#ffd23f']};if(fn==='xPhalCluster'||fn==='xCymbCluster')return{c,lip:[dk(c2||col,.4),c2||col,'#ffd23f']};
  if(fn==='amaranthPlant')return{c:[dk(col,.35),col,lt(col,.3),dk(col,.6)],col};if(fn==='hydrangea')return{c:[[c[1],c[2],c[3],c[0]],[mix(c[1],c[0],.2),c[2],c[3],c[0]]]};
  if(['strelitzia','paphio','oncidium'].includes(fn))return{};return{c}}
function drawRec(g,t,rec,o={}){if(GH[rec.id])return GH[rec.id](g,t,Object.assign({},o,{cm:o.cm||rec.cm}));if(rec.a==='custom'){const fn=FN[(rec.p||{}).fn];if(!fn)return gRadial(g,t,Object.assign({},rec,{a:'radial'}),o);
    return fn(g,t,Object.assign(customOpts(rec.p.fn,o.col||(rec.cols&&rec.cols[0])||'#e8a0b0',rec.c2),o,{cm:o.cm||rec.cm}))}
  return(GEN[rec.a]||gRadial)(g,t,rec,o)}
const HEADA=new Set(['radial','double','cup','star','spathe','orchid','globe','protea','exotic']);
/* how the composer and the cards treat a recipe: form, size class, kind, radius, natural height */
function recInfo(rec){const a=rec.a,cm=rec.cm||6,p=rec.p||{},fn=p.fn;if(GHI[rec.id]){const h=GHI[rec.id];return Object.assign({},h,{r:cm/2*UPC*(h.rk||1)})}
  if(a==='custom'){const sp=SP[fn]||{form:'disque',size:2,k:'head'};return Object.assign({},sp,{r:sp.r||cm/2*UPC})}
  if(HEADA.has(a)){const cl=a==='orchid'?1.9:a==='star'&&(p.cluster||1)>1?1.7:a==='spathe'&&p.kind!=='calla'?.8:1,form={radial:'disque',double:'rosette',cup:'cornet',star:'etoile',spathe:p.kind==='calla'?'cornet':'coeur',orchid:'orchidee',globe:'sphere',protea:'disque',exotic:'sculpt'}[a];
    if(a==='spathe'&&p.kind==='calla')return{form,size:2,k:'cup',r:34,an:[0,-96]};
    return{form,size:cm>=11?3:cm>=7?2.5:cm>=4.5?1.8:1.2,k:'head',r:cm/2*UPC*cl,nod:!!p.nod}}
  if(a==='drape')return{form:'retombante',size:2,k:'drape',self:(p.len||cm||50)*UPC};
  if(a==='spike')return{form:'epi',size:1,k:'plant',self:(cm||30)*1.5*UPC};
  if(a==='line'||a==='accessory')return{form:'ligne',size:1,k:'plant',self:SH(rec)};
  const H=a==='foliage'?(p.len||rec.stem&&rec.stem.cm*.6||40)*UPC:a==='berries'?(rec.stem&&rec.stem.cm*.5||30)*UPC:SH(rec);
  return{form:a==='foliage'?'feuillage':a==='berries'?'baie':'grappe',size:1.1,k:'cup',r:Math.max(16,H*.22),an:[0,-H*.82]}}
