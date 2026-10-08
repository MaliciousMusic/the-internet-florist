/* ================= Serre, lot 57 — conifères 2 : cryptomeria, genévrier, épicéa, douglas, thuya géant (feuillages coupés poussés par le L-système) ================= */
/* ---------- shared: the stem colours from a bark, a stroke on the screen, a point to the screen ---------- */
const L57_ST=c=>{const b=mix(c,'#4a3a2c',.35);return[shd(b,-.6),shd(b,-.3),b,shd(b,.35)]},l57Q=p=>[p[0],-p[1]];
const l57Line=(par,P,w,c,op=1)=>E('path',{d:'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:c,'stroke-width':f(Math.max(1.1,w)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round',opacity:op},par);
/* the young growth of the season: pale and soft toward the tip of every axis (the bud stage of a foliage), less at mid stage, none once hardened */
const l57Fresh=op=>op<.42?.2:op<.75?.09:0;
/* a point at length l along a chain (its position, tangent, width) */
function l57At(ch){const pts=ch.pts,n=pts.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));
  return{L:cum[n-1],at:l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const u=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),w:ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*u}}}}
/* ---------- the finest branchlets: short twigs along every side shoot (spiral, or alternate in the plane of the spray with pk), grown as extra chains that the needles then clothe;
   S: sp spacing, len, ang, pk, droop; each starts on its shoot (its first point on the axis) ---------- */
function l57Twigs(res,S,Fr,lim){const Fq=V3.nz(Fr),add=[];
  for(const ch of res.chains){if(ch.ord!==1&&!(S.main&&ch.ord===0))continue;const C=l57At(ch),Lc=C.L,n=Math.floor(Lc/S.sp);if(n<2)continue;
    for(let i=1;i<n;i++){const l=Lc*(i+R(-.25,.25))/n,u=l/Lc;if(u<(ch.ord?.12:S.main)||u>.86)continue;const q=C.at(l),[X,Y]=fgCross(q.T),Sd=V3.nz(V3.cr(q.T,Fq));
      let az=(i*137.5+R(-15,15))*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az)));if(S.pk){const s=i%2?1:-1;r=V3.nz(V3.add(V3.sc(r,1-S.pk),V3.sc(Sd,s*S.pk)))}
      const Lt=S.len*(1-.55*u)*R(.7,1.1),th=(S.ang+R(-8,8))*D,d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(r,Math.sin(th)))),pts=[q.p];
      for(let j=1;j<=4;j++){const v=j/4;pts.push(V3.add(V3.add(V3.add(q.p,V3.sc(d,Lt*v)),V3.sc(q.T,Lt*.18*v*v)),[0,-Lt*(S.droop||0)*v*v,0]))}
      if(lim!=null&&l45Low(pts)<lim)continue;const w0=Math.max(1.1,q.w*.5);add.push({pts,ws:pts.map((_,j)=>w0*(1-.3*j/4)),ord:2,c:ch.c,tw:1,par:ch})}}
  res.chains.push(...add)}
/* ---------- the needles of a grown shoot, every axis clothed from where its leafy part starts: single needles in a spiral (nn 1) or whorls of nn,
   spread th° from the twig, incurved (inc) or straight, drooping (dr); pk pulls them into the plane of the spray (two-ranked, as in douglas).
   Drawn in pieces along the axis, each piece as a few strokes (never finer than 1.1, each rooted on its twig): those behind the twig in shade, in front, turned to the light, and the soft young ones ---------- */
function l57Needles(res,parts,S,Fr){const det=DET>=1.5&&!LOD,P=pal7(S.c),cs=[toneAt(P,.34),toneAt(P,.56),toneAt(P,.78),S.cy||mix(S.c,'#c4dc7a',.55)],sw=Math.max(1.1,(det?1:1.08)*S.sw),fz=S.fresh||0;
  if(S.cb)cs[0]=toneAt(pal7(mix(S.c,S.cb,.35)),.5);const Fq=Fr?V3.nz(Fr):[0,0,1];
  /* the strokes gathered over consecutive chains of one family (a shoot, then its twigs), flushed every K needles: a few paths per piece whatever the number of twigs */
  const K=det?22:64;let bins=['','','',''],tws='',twW=1.1,twc=null,zs=0,zc=0,fam=null;
  const flush=()=>{if(!zc&&!tws)return;const z=zs/(zc||1),bb=bins,t2=tws,w2=twW,c2=twc;parts.push({z:z-1.5,cast:false,fn:g=>{if(t2)E('path',{d:t2,stroke:c2,'stroke-width':f(w2),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);if(bb[0])E('path',{d:bb[0],stroke:cs[0],'stroke-width':f(sw),fill:'none','stroke-linecap':'round'},g)}});
    if(bb[1]||bb[2]||bb[3])parts.push({z:z+1.5,cast:false,fn:g=>{for(const j of[1,2,3])if(bb[j])E('path',{d:bb[j],stroke:cs[j],'stroke-width':f(sw),fill:'none','stroke-linecap':'round'},g)}});bins=['','','',''];tws='';twW=1.1;zs=zc=0};
  for(const ch of res.chains){const C=l57At(ch),Lc=C.L,a0=ch.ord?Lc*.02:Lc*S.u0;if(Lc-a0<3)continue;const fm=ch.par||ch;if(fm!==fam){if(zc>=K*(det?.3:.5))flush();fam=fm}
    const nf=Math.max(2,Math.round((Lc-a0)/(S.sp*(det?1:1.6))));
    if(ch.tw){tws+='M'+ch.pts.map(q=>f(q[0])+','+f(-q[1])).join('L');twW=Math.max(twW,ch.ws[0]);twc=S.twc||ch.c[1]}
    for(let i=0;i<nf;i++){const l=Math.max(0,Math.min(Lc,a0+(Lc-a0)*(i+R(-.3,.3))/nf)),q=C.at(l),u=(l-a0)/(Lc-a0),[X,Y]=fgCross(q.T),Sd=V3.nz(V3.cr(q.T,Fq)),nn=S.nn||1,
        tu=S.tipU??.85,Ln0=S.ln*(u>tu?.4+.6*(1-u)/(1-tu):1),th0=S.th*(u>tu?.65:1),young=fz&&u>1-fz;zs+=q.p[2];zc++;
      for(let j=0;j<nn;j++){let az=((nn>1?i*180/nn+j*360/nn:i*137.5)+R(-14,14))*D,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az)));
        if(S.pk){const s=V3.dot(r,Sd)<0?-1:1;r=V3.nz(V3.add(V3.add(V3.sc(r,1-S.pk),V3.sc(Sd,s*S.pk)),V3.sc(Fq,S.pk*.25)))}
        const Ln=Ln0*R(.85,1.1)*(young?.8:1),th=(th0+R(-7,7))*D,d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(r,Math.sin(th)))),b=V3.add(q.p,V3.sc(r,q.w*.3)),dr=(S.dr||0)*Ln,
          inc=(S.inc||0)*Ln,e=V3.add(V3.add(V3.add(b,V3.sc(d,Ln)),V3.sc(r,-inc*.6)),[0,-dr,0]),m=V3.add(V3.add(V3.add(b,V3.sc(d,Ln*.5)),V3.sc(r,inc*.5)),[0,-dr*.3,0]);
        if(S.lim!=null&&Math.min(e[1],m[1])<S.lim)continue;
        const bin=young?3:e[2]<q.p[2]-Ln*.15?0:V3.dot(r,LIGHT)>.25?2:1,B2=l57Q(b),M2=l57Q(m),E2=l57Q(e);bins[bin]+=`M${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(E2[0])},${f(E2[1])}`}
      if(zc>=K)flush()}}flush()}
/* ---------- buds at a shoot's tip: an ovoid (or sharp spindle) bud of brown scales and a whorl of smaller ones round it ---------- */
function l57Bud(og,Lb,rb,col,nl,sharp){const H=V3.nz(og.H),[X,Y]=fgCross(H),P=pal7(col),out=[],det=DET>=1.5&&!LOD;
  const one=(b,d,L2,r2,zb)=>{const e=V3.add(b,V3.sc(d,L2)),sp=l45Spin(V3.add(b,V3.sc(d,-r2*.4)),e,t=>r2*(sharp?Math.pow(Math.sin(Math.PI*Math.min(1,.15+t*.85)),.6)*(1-.55*t):(t<.25?.7+t*1.2:Math.pow(Math.max(0,1-(t-.25)/.75),.55))),10,.06),I=lightI(V3.nz(V3.add(fgCross(d)[0],[0,0,.6])));
    out.push({z:(b[2]+e[2])/2+zb,cast:false,fn:g=>{E('path',{d:smooth(sp.P),fill:toneAt(P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},g);
      if(det){let d2='';for(let i=1;i<5;i++){const c=sp.C[i*2],r3=r2*.75;d2+=`M${f(c[0]-sp.nx*r3)},${f(c[1]-sp.ny*r3)}Q${f(c[0]+(sp.C[i*2+1][0]-c[0])*.8)},${f(c[1]+(sp.C[i*2+1][1]-c[1])*.8)} ${f(c[0]+sp.nx*r3)},${f(c[1]+sp.ny*r3)}`}
        E('path',{d:d2,stroke:P.d1,'stroke-width':.4,'stroke-opacity':.6,fill:'none'},g);if(sharp){const h=sp.C[3];E('path',{d:`M${f(h[0]+sp.nx*r2*.3)},${f(h[1]+sp.ny*r2*.3)}L${f(sp.C[8][0])},${f(sp.C[8][1])}`,stroke:P.l2,'stroke-width':.5,'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},g)}}}})};
  one(og.pos,H,Lb,rb,.3);if(!det&&og.p.o)nl=Math.min(nl,1);if(LOD)nl=0;for(let i=0;i<nl;i++){const a=(i/nl*360+R(-25,25))*D,d=V3.nz(V3.add(H,V3.sc(V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),.6)));one(og.pos,d,Lb*R(.5,.68),rb*.82,d[2]>0?.2:-.2)}
  return out}
/* ---------- a round fruit on a short stalk from its twig (juniper berry, small globular cone): base disc in its tone, a bloom or a ring of scale tips, its stalk rooted on the twig ---------- */
function l57Ball(par,c0,p,r,col,o={}){const P=pal7(col),q=l57Q(p),q0=l57Q(c0);l57Line(par,[q0,q],o.sw||1.3,o.st||'#5a4a32');
  if(o.spk){/* the cone of cryptomeria: its scales end in hooked points round the outline */let d='';const n=14;for(let i=0;i<n;i++){const a=i/n*6.283,a2=(i+.5)/n*6.283;d+=(i?'L':'M')+f(q[0]+Math.cos(a)*r)+','+f(q[1]+Math.sin(a)*r)+'L'+f(q[0]+Math.cos(a2)*r*1.22)+','+f(q[1]+Math.sin(a2)*r*1.22)}
    E('path',{d:d+'Z',fill:toneAt(P,.5),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
    if(DET>=1.5&&!LOD){let d2='';for(let i=0;i<7;i++){const a=i/7*6.283+.3,cx=q[0]+Math.cos(a)*r*.48,cy=q[1]+Math.sin(a)*r*.48;d2+=`M${f(cx-r*.22)},${f(cy)}Q${f(cx)},${f(cy-r*.3)} ${f(cx+r*.22)},${f(cy)}`}E('path',{d:d2,stroke:P.d2,'stroke-width':.5,'stroke-opacity':.7,fill:'none'},par)}
    E('circle',{cx:f(q[0]-r*.3),cy:f(q[1]-r*.3),r:f(r*.3),fill:P.l2,opacity:.4},par);return}
  E('circle',{cx:f(q[0]),cy:f(q[1]),r:f(r),fill:toneAt(P,.45),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},par);
  if(LOD)return;if(o.bloom)E('circle',{cx:f(q[0]-r*.18),cy:f(q[1]-r*.2),r:f(r*.8),fill:o.bloom,opacity:.55},par);if(DET>=1.5||!o.bloom)E('circle',{cx:f(q[0]-r*.36),cy:f(q[1]-r*.38),r:f(r*.28),fill:'#ffffff',opacity:o.bloom?.35:.45},par);
  if(DET>=1.5){/* the scar of the three fused scales at its apex */let d='';for(let i=0;i<3;i++){const a=i*2.094+.4;d+=`M${f(q[0]+r*.12)},${f(q[1]+r*.1)}l${f(Math.cos(a)*r*.28)},${f(Math.sin(a)*r*.28)}`}E('path',{d,stroke:P.d2,'stroke-width':.45,'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},par)}}
/* a run of the same plant on a sheet (one seed per species, colour, size and stage) and its common frame */
function l57Run(g,t,o,id,list,cm0,fn){const cw=fgCw(list,o),op=Math.max(.05,Math.min(1,o.op??1)),ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,id,()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.18)),r=fn(k,A,cw,op,kl,g35Lim(o));open(k,t,1000,0,.4);return r})}

/* ---------- cryptomeria (Cryptomeria japonica, Cupressaceae, « cèdre du Japon », sugi): long rope-like shoots densely clothed in short awl-shaped needles (0.6–1.5 cm),
   set in a tight spiral, decurrent on the twig and curved forward and in toward it, keeled, bright green — bronze to purple-brown in winter (« Elegans » longer, softer);
   the branchlets alternate and spread; at the tips of short shoots small globose cones (1.5–2.5 cm), each scale ending in hooked points, green then brown. No visible bud scales ---------- */
const CW_L57CRY=[{id:'vert',n:'Vert franc (C. japonica)',c:'#4c7a3e',bark:'#7a4a35'},{id:'bleute',n:'Vert bleuté (C. japonica « Glauca »)',c:'#5d8079',bark:'#7a4a35'},
  {id:'bronze',n:'Bronzé d\'hiver (« Elegans »)',c:'#7a4f3e',bark:'#6a3a2a',el:1},{id:'sekkan',n:'Pointes crème (« Sekkan-sugi »)',c:'#e2d9a8',g:'#7f9a4e',bark:'#7a4a35'}];
function l57Cry(g,t,o){return l57Run(g,t,o,'l57cry',CW_L57CRY,1,(k,A,cw,op,kl,lim)=>{let nc=0;const mc=rnd()<.6?R(1,3.99)|0:0,nc0=cw.g||cw.c;
  return fgGrow(k,A,{li:2*UPC*kl,liT:.3,w0:5.5*kl,w1:1.4,cols:L57_ST(cw.bark),uL:2,lp:0,phy:'spiral',seg:9,wig:.035,tipLv:0,piece:16,
    side:{u0:.18,u1:.82,p:.55,len:.4,ang:48,li:.8,e:-.008,tilt:25},axil:{u0:.4,p:.22,ang:60},
    /* the cones at the tips of short shoots, ripe at the open stage */
    axDraw:og=>{if(op<.45||nc>=mc)return null;nc++;const H=V3.nz(og.H),c=V3.add(og.pos,V3.sc(H,1.1*UPC*kl)),r=.8*UPC*kl*R(.85,1.1),col=op<.8?'#7a7a3a':'#7a5636';
      return[{z:c[2]+.5,cast:false,fn:gg=>l57Ball(gg,og.pos,c,r,col,{spk:1,sw:1.6,st:'#6a5a3a'})}]},
    post:(res,parts,Fr)=>{l57Twigs(res,{sp:1.1*UPC*kl,len:4*UPC*kl,ang:42,droop:.04},Fr,lim);l57Needles(res,parts,{c:nc0,twc:shd(nc0,-.35),cy:cw.g?cw.c:null,u0:o.spine?.04:.2,sp:(cw.el?.2:.15)*UPC*kl,ln:(cw.el?1.6:1.05)*UPC*kl*(o.spine?.9:1),th:cw.el?40:32,inc:cw.el?.08:.16,dr:cw.el?.08:.02,sw:1.25,
      fresh:cw.g?.26:l57Fresh(op),lim},Fr)}})})}

/* ---------- juniper (Juniperus virginiana, J. communis, J. scopulorum, Cupressaceae, « genévrier »): stiff twigs with sharp needles (0.8–1.5 cm) in whorls of three, spreading,
   blue-green, a white band of stomata along their upper face (bluer from behind); the female cones are berries (0.5–0.9 cm), green for a year then dark blue
   under a white pruinose bloom (« blueberry juniper »), set singly or by twos and threes along the twigs on very short stalks ---------- */
const CW_L57JUN=[{id:'bleu-vert',n:'Bleu-vert à baies (J. virginiana)',c:'#5f817c',bark:'#7a5e4a',bp:.75},{id:'gris-bleu',n:'Gris-bleu argenté (J. scopulorum)',c:'#7d8b80',bark:'#7a5e4a',bp:.55},
  {id:'vert',n:'Vert piquant (J. communis)',c:'#4f6e4a',bark:'#6a4e3a',bp:.5},{id:'bleu-glace',n:'Bleu glacier (J. squamata « Blue Star »)',c:'#8aa3ac',bark:'#7a6250',bp:0}];
const L57_BERRY='#5a6c9a';
function l57Jun(g,t,o){return l57Run(g,t,o,'l57jun',CW_L57JUN,1.2,(k,A,cw,op,kl,lim)=>{const nb=cw.bp?Math.round((LOD?6:DET>=1.5?24:16)*cw.bp):0;let cnt=0;
  return fgGrow(k,A,{li:1.8*UPC*kl,liT:.3,w0:5*kl,w1:1.3,cols:L57_ST(cw.bark),uL:2,lp:0,phy:'spiral',seg:9,wig:.045,tipLv:0,piece:16,
    side:{u0:.16,u1:.85,p:.6,len:.38,ang:42,li:.75,e:-.004,tilt:28},axil:{u0:.2,p:.85,ang:80},
    /* berries: one to three on short stalks from the twig, green when young (some stay green beside the blue ones, they take two seasons) */
    axDraw:og=>{if(cnt>=nb)return null;cnt++;const H=V3.nz(og.H),n=rnd()<.5?1:rnd()<.6?2:3,out=[];
      for(let i=0;i<n;i++){const a=R(0,6.283),[X,Y]=fgCross(H),rd=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),r=.4*UPC*kl*R(.85,1.12),c=V3.add(og.pos,V3.add(V3.sc(V3.nz(V3.add(H,V3.sc(rd,.5))),r*1.15),V3.sc(rd,og.w*.3))),
          ripe=rnd()<.25+.7*op,col=ripe?L57_BERRY:mix('#7f9a6a',L57_BERRY,.25);
        if(lim!=null&&c[1]-r<lim)continue;out.push({z:c[2]+r*.3,cast:false,fn:gg=>l57Ball(gg,og.pos,c,r,col,{bloom:ripe?'#a8b8d8':'#c8d4c0',sw:1.2,st:shd(cw.bark,-.2)})})}return out},
    post:(res,parts,Fr)=>{l57Twigs(res,{sp:.9*UPC*kl,len:3.4*UPC*kl,ang:40,droop:.03},Fr,lim);l57Needles(res,parts,{c:cw.c,cb:'#c8d6d4',twc:shd(cw.bark,-.1),u0:o.spine?.04:.18,sp:.2*UPC*kl,nn:DET>=1.5?3:2,ln:1.2*UPC*kl*(o.spine?.9:1),th:44,inc:-.04,dr:.02,sw:1.2,fresh:l57Fresh(op)*.6,lim},Fr)}})})}

/* ---------- spruce (Picea pungens « épicéa du Colorado », P. abies « épicéa commun », P. orientalis): stiff four-angled needles, sharp, standing out all round the twig like a bottle brush
   (each on a woody peg, the twig rough when stripped), 2–3 cm and silver-blue under wax in the blue spruce, 1.5–2.5 cm and green in the common spruce,
   short (0.6–1 cm) and glossy dark green in the oriental spruce; the shoots end in ovoid, chestnut-brown buds with papery scales, a terminal one in its whorl of smaller ones;
   in spring the buds burst and the new shoots come out tender and pale, capped by their brown scales ---------- */
const CW_L57PIC=[{id:'bleu-argente',n:'Bleu argenté (P. pungens « Hoopsii »)',c:'#8ea7b5',bark:'#a0683f',ln:2.4},{id:'bleu-vert',n:'Bleu-vert (P. pungens « Glauca »)',c:'#6f8f94',bark:'#a0683f',ln:2.2},
  {id:'vert',n:'Vert sapin (P. abies)',c:'#2d4a2e',bark:'#8a5a34',ln:1.8,th:58},{id:'orientalis',n:'Vert foncé brillant, aiguilles courtes (P. orientalis)',c:'#33522f',bark:'#8a5a34',ln:.8,th:52}];
function l57Pic(g,t,o){return l57Run(g,t,o,'l57pic',CW_L57PIC,2.2,(k,A,cw,op,kl,lim)=>{const ln=cw.ln/2.2;
  return fgGrow(k,A,{li:2.6*UPC*kl,liT:.3,w0:5.5*kl,w1:1.6,cols:L57_ST(cw.bark),uL:2,lp:0,phy:'spiral',seg:9,wig:.03,tipLv:0,piece:16,
    side:{u0:.18,u1:.82,p:.72,len:.42,ang:50,li:.85,e:-.006,tilt:20},
    tip:og=>{if(op<.42){/* the bud scales thrown off by the new shoot: a small papery cap */return l57Bud(og,.32*UPC*kl,.22*UPC*kl,'#a8784a',0)}
      return l57Bud(og,(.5+.15*op)*UPC*kl,.24*UPC*kl,'#8a5530',og.p.o?(rnd()<.5?2:3):4)},
    post:(res,parts,Fr)=>{l57Twigs(res,{sp:1.5*UPC*kl,len:4.5*UPC*kl*Math.max(.6,ln),ang:52,pk:.4,droop:.03},Fr,lim);l57Needles(res,parts,{c:cw.c,twc:shd(cw.bark,-.15),u0:o.spine?.04:.2,sp:(cw.ln<1?.08:.11)*UPC*kl,ln:2.2*ln*UPC*kl*(o.spine?.9:1),th:cw.th||64,inc:.02,dr:.03,sw:1.15,tipU:.9,fresh:l57Fresh(op),lim},Fr)}})})}

/* ---------- douglas fir (Pseudotsuga menziesii, Pinaceae, « douglas »): supple, drooping sprays; needles flat and soft (2–3 cm), blunt, set all round the twig
   but spread in two loose ranks on the sides, fresh mid-green (var. glauca blue-green), two white bands beneath, fragrant; the buds slender, sharp-pointed,
   glossy chestnut (like a beech's); the cones pendulous (5–10 cm), their thin scales passed by a three-pointed bract like a mouse's tail ---------- */
const CW_L57PSE=[{id:'vert',n:'Vert franc (P. menziesii)',c:'#4c7a45',bark:'#8a5a3c'},{id:'bleu-vert',n:'Bleu-vert (P. menziesii var. glauca)',c:'#5f8784',bark:'#8a5a3c'},
  {id:'vert-tendre',n:'Vert tendre, jeunes pousses',c:'#7a9a52',bark:'#8a6a44',f:1}];
/* a small pendant cone: its scales in crossing spirals, the trifid bracts standing out between them */
function l57PseCone(og,kl,op){const H=V3.nz(og.H),Lc=4.6*UPC*kl*R(.85,1.1),rc=Lc*.22,a=V3.nz(V3.add(V3.sc(H,.25),[0,-1,0])),b=V3.add(og.pos,V3.sc(V3.nz(V3.add(H,[0,-.5,0])),.5*UPC*kl)),e=V3.add(b,V3.sc(a,Lc)),
    rf=t=>rc*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.04+.03)),.75)*(t<.45?1:1-.25*(t-.45)/.55),sp=l45Spin(b,e,rf,14,.06),col=op<.7?'#7a7a48':'#8a6040',P=pal7(col),[X,Y]=fgCross(a),det=DET>=1.5&&!LOD;
  const sc=[],br=[];if(!LOD)for(let i=1;i<10;i++){const t=i/10,nc=6;for(let j=0;j<nc;j++){const ph=(j+(i%2)*.5)/nc*6.283,rd=V3.add(V3.sc(X,Math.cos(ph)),V3.sc(Y,Math.sin(ph)));if(rd[2]<.15)continue;
      const c=V3.add(V3.add(b,V3.sc(a,Lc*t)),V3.sc(rd,rf(t)*.9)),du=V3.sc(a,Lc*.05),dv=V3.sc(V3.cr(a,rd),rf(t)*.4);sc.push([V3s(c,du),V3.add(c,dv),V3.add(c,du),V3s(c,dv)]);
      /* the bract: its long middle point and two short side ones, out of the scale toward the cone's tip */
      if(rd[2]<.75){const m=V3.add(c,V3.add(V3.sc(a,Lc*.08),V3.sc(rd,rc*.25))),q=l57Q(c),qm=l57Q(m),qa=l57Q(V3.add(m,V3.add(V3.sc(a,Lc*.03),V3.sc(V3.cr(a,rd),rc*.12))));
        br.push(`M${f(q[0])},${f(q[1])}L${f(qm[0])},${f(qm[1])}M${f(qm[0])},${f(qm[1])}L${f(qa[0])},${f(qa[1])}`)}}}
  const st=[l57Q(og.pos),l57Q(b)];
  return[{z:(b[2]+e[2])/2,cast:false,fn:g=>{l57Line(g,st,1.6,'#6a4a32');E('path',{d:smooth(sp.P),fill:toneAt(P,.5),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55},g);
    if(sc.length){let d='';for(const q of sc){const Q=q.map(l57Q);d+='M'+Q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}E('path',{d,fill:toneAt(P,.7),stroke:P.d2,'stroke-width':.45,'stroke-opacity':.7},g)}
    if(br.length)E('path',{d:br.join(''),stroke:mix(col,'#c8b080',.45),'stroke-width':1.1,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)}}]}
function l57Pse(g,t,o){return l57Run(g,t,o,'l57pse',CW_L57PSE,2.5,(k,A,cw,op,kl,lim)=>{let nc=0;const mc=rnd()<.4?1:0;
  return fgGrow(k,A,{li:2.6*UPC*kl,liT:.25,w0:5*kl,w1:1.4,cols:L57_ST(cw.bark),uL:2,lp:0,phy:'alt2',seg:9,wig:.035,tipLv:0,piece:16,
    side:{u0:.15,u1:.82,p:.7,len:.45,ang:52,li:.85,e:-.016,tilt:12},axil:{u0:.3,p:.3,ang:100},
    tip:og=>op<.42?null:l57Bud(og,(.55+.2*op)*UPC*kl,.15*UPC*kl,'#9a5a2e',og.p.o?(rnd()<.5?1:2):2,1),
    axDraw:og=>{if(op<.5||nc>=mc||(lim!=null&&og.pos[1]-6*UPC<lim))return null;nc++;return l57PseCone(og,kl,op)},
    post:(res,parts,Fr)=>{l57Twigs(res,{sp:1.7*UPC*kl,len:5*UPC*kl,ang:52,pk:.75,droop:.1},Fr,lim);l57Needles(res,parts,{c:cw.c,cb:'#c5d2c9',twc:shd(cw.bark,-.15),u0:o.spine?.04:.18,sp:.14*UPC*kl,ln:2.5*UPC*kl*(o.spine?.9:1),th:66,pk:.6,inc:.05,dr:.08,sw:1.45,tipU:.88,fresh:l57Fresh(op),lim},Fr)}})})}

/* ---------- western red cedar (Thuja plicata, Cupressaceae, « thuya géant », also T. occidentalis): flattened sprays of scale leaves, pressed flat in opposite pairs
   (the facial ones flat with a whitish « butterfly » beneath, the lateral ones keeled and pointed, giving the twig its zigzag edge), branched in one plane
   like a fern, glossy bright green, the sprays drooping in fans; cultivars gold (« Zebrina », « Yellow Ribbon ») or bronzed by winter; small erect cones (1–1.2 cm)
   of 8–12 thin scales, green then brown. The scale ribbons: every axis clothed by a flat ribbon with toothed edges in the plane of the spray,
   the ultimate branchlets as small flat pinnate fans along them ---------- */
const CW_L57THU=[{id:'vert',n:'Vert brillant (T. plicata)',c:'#2f5a2c',bark:'#6d4a33'},{id:'vert-tendre',n:'Vert émeraude (T. occidentalis « Smaragd »)',c:'#3f7a3a',bark:'#6d4a33'},
  {id:'dore',n:'Doré (« Zebrina », « Yellow Ribbon »)',c:'#c6aa3e',bark:'#7a5a3a'},{id:'bronze',n:'Bronze cuivré d\'hiver',c:'#7a5a33',bark:'#5e3e2a'}];
/* a toothed flat ribbon along 3D points P (across A at each, half-widths hw): its screen outline, the lateral scales alternately wider (the zigzag) */
function l57Rib(P,A,hw,tz){const n=P.length,L=[],Rr=[];for(let i=0;i<n;i++){const q=l57Q(P[i]),a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],t=[b[0]-a[0],-(b[1]-a[1])],tl=Math.hypot(t[0],t[1])||1,nx=-t[1]/tl,ny=t[0]/tl,
    ac=[A[i][0],-A[i][1]],s=Math.max(.55,hw[i]*Math.abs(ac[0]*nx+ac[1]*ny)),z=tz&&i>0&&i<n-1?(i%2?1:.6):1,z2=tz&&i>0&&i<n-1?(i%2?.6:1):1;
  L.push(f(q[0]+nx*s*z)+','+f(q[1]+ny*s*z));Rr.push(f(q[0]-nx*s*z2)+','+f(q[1]-ny*s*z2))}return'M'+L.join('L')+'L'+Rr.reverse().join('L')+'Z'}
function l57ThuSprays(res,parts,cw,op,kl,Fr,u0,lim){const det=DET>=1.5&&!LOD,P=pal7(cw.c),PB=pal7(mix(cw.c,'#c8cfb6',.3)),cy=mix(cw.c,'#c8e070',.45),fz=l57Fresh(op),st=det?1.8:3,hw0=1.25*kl,sp=.55*UPC*kl;
  for(const ch of res.chains){const C=l57At(ch),Lc=C.L,a0=ch.ord?0:Lc*u0;if(Lc-a0<3)continue;
    /* each spray twisted a little about its own axis, so the fans are not all in one plane */
    const Tm=C.at(Lc*.5).T,Sm=V3.cr(Tm,V3.nz(Fr)),N=V3.nz(ch.ord?V3.add(V3.nz(Fr),V3.sc(Sm,R(-.5,.5))):Fr),fr=N[2]>=0,I0=lightI(fr?N:V3.sc(N,-1)),
      face=toneAt(fr?P:PB,I0),shade=toneAt(fr?P:PB,I0-.14);
    const ns=Math.max(2,Math.round((Lc-a0)/st)),every=Math.max(1,Math.round(sp/((Lc-a0)/ns))),K=det?30:60;let dA='',dB='',dY='',zc=0,zs=0,k2=0;
    const flush=()=>{if(!zc)return;const z=zs/zc,a=dA,b=dB,y=dY;parts.push({z:z+1.2,cast:false,fn:g=>{if(b)E('path',{d:b,fill:shade},g);if(a)E('path',{d:a,fill:face,stroke:P.ink,'stroke-width':.3,'stroke-opacity':.25},g);if(y)E('path',{d:y,fill:cy},g)}});dA=dB=dY='';zs=zc=0};
    let Pp=[],Ap=[],Hp=[];
    for(let i=0;i<=ns;i++){const l=a0+(Lc-a0)*i/ns,q=C.at(l),u=(l-a0)/(Lc-a0),Ac=V3.nz(V3.cr(q.T,N)),young=fz&&u>1-fz;Pp.push(q.p);Ap.push(Ac);Hp.push(Math.max(q.w*.66,hw0*(ch.ord?1.1-.35*u:1.3-.3*u)));zs+=q.p[2];zc++;
      /* the branchlets: small flat pinnate fans alternately left and right, shorter toward the tip, drooping a little */
      if(i>0&&i<ns&&i%every===0){k2++;const s=k2%2?1:-1,Ls=(ch.ord?2.8:2)*UPC*kl*(1-.6*u)*R(.8,1.15),d=V3.nz(V3.add(V3.sc(q.T,.7),V3.sc(Ac,s*.72))),n2=det?8:5,Ad=V3.nz(V3.cr(d,N)),Q=[],QH=[];
        if(Ls>=3){for(let j=0;j<=n2;j++){const v=j/n2;Q.push(V3.add(V3.add(V3.add(q.p,V3.sc(d,Ls*v)),V3.sc(q.T,Ls*.1*v*v)),[0,-Ls*.1*v*v,0]));QH.push(hw0*.8*(1-.45*v))}
          if(lim==null||l45Low(Q)>=lim){let sd=l57Rib(Q,Q.map(()=>Ad),QH,1);const nl=Ls>10?(det?4:2):Ls>6&&det?2:0;
            /* its lobes, alternate, in the same plane */
            for(let m=1;m<=nl;m++){const v=m/(nl+1.3),bq=Q[Math.round(v*n2)],s2=m%2?-s:s,d2=V3.nz(V3.add(V3.sc(d,.72),V3.sc(Ad,s2*.7))),l2=Ls*.42*(1-.5*v),P2=[bq,V3.add(bq,V3.sc(d2,l2*.5)),V3.add(bq,V3.sc(d2,l2))],A2=V3.nz(V3.cr(d2,N));
              sd+=l57Rib(P2,[A2,A2,A2],[hw0*.65,hw0*.55,hw0*.32],1)}
            if(young||fz&&u>1-fz*1.4)dY+=sd;else if((s>0)===(V3.dot(Ac,LIGHT)>0))dA+=sd;else dB+=sd}}}
      if(Pp.length>=8||i===ns){if(Pp.length>1){const sd=l57Rib(Pp,Ap,Hp,1);if(young)dY+=sd;else dA+=sd}if(zc>=K)flush();Pp=[q.p];Ap=[Ac];Hp=[Hp[Hp.length-1]]}}
    flush()}}
/* small erect cones near the tips: an ellipsoid of thin scales opening at maturity */
function l57ThuCone(og,kl,op){const H=V3.nz(V3.add(V3.nz(og.H),[0,.6,0])),b=og.pos,Lc=1.1*UPC*kl,e=V3.add(b,V3.sc(H,Lc)),col=op<.8?'#8a9a4a':'#8a6a40',P=pal7(col),sp=l45Spin(b,e,t=>Lc*.28*Math.pow(Math.sin(Math.PI*Math.min(1,t*.95+.05)),.8),8,op>.8?.22:.1);
  return[{z:(b[2]+e[2])/2+.4,cast:false,fn:g=>{E('path',{d:'M'+sp.P.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:toneAt(P,.55),stroke:P.ink,'stroke-width':.45,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
    if(DET>=1.5&&!LOD){let d='';for(let i=2;i<8;i+=2){const c=sp.C[i];d+=`M${f(c[0]-sp.nx*Lc*.22)},${f(c[1]-sp.ny*Lc*.22)}L${f(c[0]+sp.nx*Lc*.22)},${f(c[1]+sp.ny*Lc*.22)}`}E('path',{d,stroke:P.d2,'stroke-width':.45,'stroke-opacity':.6,fill:'none'},g)}}}]}
function l57Thu(g,t,o){return l57Run(g,t,o,'l57thu',CW_L57THU,12,(k,A,cw,op,kl,lim)=>{let nc=0;const mc=op>.5&&rnd()<.5?R(2,5.99)|0:0;
  return fgGrow(k,A,{li:2.4*UPC*kl,liT:.25,w0:4.5*kl,w1:1.4,cols:L57_ST(cw.bark),uL:2,lp:0,phy:'alt2',seg:8,wig:.025,tipLv:0,piece:16,
    side:{u0:.12,u1:.86,p:.9,len:.45,ang:52,li:.7,e:-.03,tilt:10},axil:{u0:.55,p:.4,ang:40},
    axDraw:og=>{if(nc>=mc||(lim!=null&&og.pos[1]<lim+8))return null;nc++;return l57ThuCone(og,kl,op)},
    post:(res,parts,Fr)=>{/* the axes woody, clothed by their scale ribbons above the bare foot */l57ThuSprays(res,parts,cw,op,kl,Fr,o.spine?.04:.2,lim)}})})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the needle length; for the thuja the length of a spray), the composer's foliage stems along their spine ---------- */
Object.assign(GH,{'cryptomeria-japonica':l57Cry,'juniperus-genevrier':l57Jun,'picea-epicea':l57Pic,'pseudotsuga-menziesii-douglas':l57Pse,'thuja-cedre-rouge':l57Thu});
Object.assign(CWS,{'cryptomeria-japonica':CW_L57CRY,'juniperus-genevrier':CW_L57JUN,'picea-epicea':CW_L57PIC,'pseudotsuga-menziesii-douglas':CW_L57PSE,'thuja-cedre-rouge':CW_L57THU});
Object.assign(SZG,{'cryptomeria-japonica':[.8,1,1,1.3],'juniperus-genevrier':[1,1.2,1.2,1.5],'picea-epicea':[1.6,2.2,2.2,2.8],'pseudotsuga-menziesii-douglas':[2,2.5,2.5,3],'thuja-cedre-rouge':[9,12,12,15]});
const l57I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'cryptomeria-japonica':l57I(45,{fx:16}),'juniperus-genevrier':l57I(45,{fx:16}),'picea-epicea':l57I(50,{fx:20}),'pseudotsuga-menziesii-douglas':l57I(50,{fx:22}),'thuja-cedre-rouge':l57I(50,{fx:24})});
