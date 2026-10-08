/* ================= Serre, lot 85 — fougères 3, lycopodes et lichens : fougère houx (Cyrtomium falcatum), fougère crocodile (Microsorum musifolium), coontie (Zamia integrifolia), lycopode (Lycopodium), lichen stabilisé (Cladonia stellaris) ================= */
/* les frondes pennées (fougère houx, coontie) sont poussées par le grand moteur des fougères du lot 58 (l58Frond : stipe et rachis le long de leur axe, pennes alternes en nappes 3D, jeune fronde en crosse) ;
   la fougère crocodile est une lame entière dont le réseau de nervures en relief dessine des écailles bombées ; le lycopode pousse comme les conifères du lot 57 (fgGrow, rameaux, feuilles en écailles serrées)
   avec ses strobiles dressés sur leurs pédoncules ; le lichen est un coussin posé sur la lèvre du vase (comme les mousses du lot 45). Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */

/* ---------- holly fern (Cyrtomium falcatum, Dryopteridaceae, « fougère houx »): fronds 30–60 cm, a stipe a third of the frond, green-brown and densely scaly (brown, ovate scales) at its foot;
   the blade once-pinnate with six to ten pairs of broad pinnae, alternate, short-stalked, ovate-falcate — curved toward the tip like a sickle, a rounded auricle on the side toward the tip,
   acuminate, the margin entire or finely toothed (fringed in 'Rochfordianum'); a terminal pinna like the laterals; thick, leathery, very glossy dark green, paler beneath with round sori scattered
   over the back under a peltate indusium, brown-black when ripe. The young frond unrolls from a scaly crozier ---------- */
const CW_L85CY=[{id:'vert-sombre',n:'Vert foncé brillant (Cyrtomium Fern)',c:'#234a28',b:'#5c7652',st:'#5a5a34'},{id:'holly',n:'Vert foncé (Holly Fern)',c:'#2c5530',b:'#62805a',st:'#5e5e38'},
  {id:'rochfordianum',n:'Vert foncé, pennes frangées (Rochfordianum)',c:'#25482b',b:'#5a7450',st:'#5a5a34',fr:1},{id:'bronze',n:'Vert bronze (jeunes frondes)',c:'#4f5a2e',b:'#7a7c50',st:'#6a5e36'}];
const L85_CYW=prof([[0,.7],[.06,.94],[.2,1],[.45,.9],[.7,.62],[.88,.28],[1,0]]);
const L85_CY={id:'l85cy',cws:CW_L85CY,cm:45,arch:[.08,.15],bow:.1,u0:.36,curl:.45,w0:3.8,w1:1.4,dl:.095,dt:.28,tg:.05,pl:q=>.31*(1-.45*Math.pow(q,1.3)),ang:q=>76-20*q,dih:10,tw:12,fold:.1,cup:.07,droop:.03,
  gl:1,tip:.24,scale:'#6e4e2c',olT:{fa:0,wp:prof([[0,.5],[.1,.86],[.3,1],[.55,.86],[.8,.5],[.94,.18],[1,0]])},
  ol:{wr:.54,nt:9,td:.045,t0:.2,saw:1,au:.1,fa:.28,wp:L85_CYW},soriAt:0,sori:[[.07,.2],[-.07,.2],[.14,.3],[-.13,.3],[.07,.4],[-.07,.4],[.13,.5],[-.12,.5],[.06,.6],[-.06,.6],[.09,.72],[-.08,.72]],sc:'#3a2a1e',sr:.022};
const L85_CYF=Object.assign({},L85_CY,{ol:Object.assign({},L85_CY.ol,{nt:15,td:.13,saw:0,jag:.25})});
function l85Cyr(g,t,o){const cw=fgCw(CW_L85CY,o);return l58Frond(g,t,Object.assign({},o,{cw}),cw.fr?L85_CYF:L85_CY)}

/* ---------- coontie (Zamia integrifolia, Zamiaceae — a cycad, not a fern): stiff pinnate leaves 20–100 cm (cut at 40–60), the petiole a third of the leaf, round, smooth, without prickles;
   ten to twenty pairs of leaflets, opposite to subopposite, evenly spaced like the rungs of a ladder, linear-oblong, leathery, flat or a little twisted, entire with a few fine teeth near the tip;
   very glossy dark green. Its new leaves come straight (no crozier) ---------- */
const CW_L85ZA=[{id:'vert-sombre',n:'Vert foncé brillant (Coontie Fern)',c:'#1f4224',b:'#4e6a48',st:'#4a6a34'},{id:'vert-jeune',n:'Vert franc (feuille de l\'année)',c:'#33612e',b:'#62844e',st:'#557a3a'}];
/* the leaflets of a cycad stand in subopposite pairs: the step between pinnae alternates short (within a pair) and long (between pairs) */
const L85_ZA={id:'l85za',cws:CW_L85ZA,cm:50,arch:[.07,.14],bow:.08,u0:.32,curl:0,w0:3.6,w1:1.5,_i:0,get dl(){return this._i++%2?.088:.018},dt:.1,tg:.04,pl:q=>.22*(.78+.22*Math.sin(Math.min(1,q/.3)*Math.PI/2))*(1-.42*Math.pow(Math.max(0,(q-.62)/.38),1.2)),
  ang:q=>70-16*q,dih:14,tw:22,fold:.03,cup:.09,droop:.015,gl:.95,tip:.17,olT:{fa:0},
  ol:{wr:.25,nt:4,td:.06,t0:.74,saw:1,fa:.05,wp:prof([[0,.36],[.05,.78],[.14,.97],[.5,1],[.78,.92],[.92,.62],[.98,.24],[1,0]])}};
function l85Zam(g,t,o){L85_ZA._i=0;return l58Frond(g,t,o,L85_ZA)}

/* ---------- crocodile fern (Microsorum musifolium 'Crocodyllus', Polypodiaceae): a short stipe and a leaf entire, a long lanceolate blade (40–80 cm, 6–10 wide) tapering to its foot,
   acuminate, its margin a little undulate; between the net of raised dark-green veins the areoles bulge, apple green, like the scales of a crocodile — larger along the midrib, smaller and closer
   toward the margin; the midrib pale and raised; glossy; small round sori scattered beneath. The young leaf comes with its halves folded up ---------- */
const CW_L85MI=[{id:'vert-pomme',n:'Vert pomme réticulé (Polypodium Musifolium)',c:'#8cbf48',v:'#2f5a2c',b:'#a8c486'},{id:'vert-jaune',n:'Vert jaune réticulé (feuille au soleil)',c:'#a8c850',v:'#3e6430',b:'#b8cc8c'}];
const L85_MIW=prof([[0,.04],[.1,.3],[.3,.78],[.48,1],[.68,.9],[.86,.52],[.96,.16],[1,0]]),L85_MIST=['#2c3a1c','#4a5a2c','#6a7a40','#9aa86a'];
function l85Croc(g,t,o){const cw=fgCw(CW_L85MI,o),op=l58Op(o),cm0=60,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l85mi',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A=l58Axis(o,Lt,(rnd()<.5?-1:1)*R(.05,.1),R(.1,.16)),Le=A.L,l0=A.l0||0,yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),
      lb=l0+(Le-l0)*(o.spine?.06:.08),Lb=(Le-lb)*(1-.3*yg),lim=g35Lim(o),wr=.135*(1-.25*yg),fo=.14+1.1*yg,wv=.008*(1-.6*yg),wk=6,ph=R(0,6.283),
      c=yg?mix(cw.c,'#c8dc80',.3*yg):cw.c,P=pal7(c),PB=pal7(cw.b),PN=pal7(cw.v),PNB=pal7(mix(cw.v,cw.b,.45));
    /* the L-system grows the stipe up to the blade's foot (the midrib goes on along the same axis) */
    const res=l44Main(A,[],{w0:3.8*Math.min(1.1,kz),w1:3*Math.min(1.1,kz),cols:L85_MIST,end:lb,step:6}),parts=[];
    const fr=y=>A.at(A.sOf(lb+Lb*y)),Wd=y=>Lb*wr*.5*L85_MIW(y);
    const M=(x,y)=>{const q=fr(y),ax=Math.abs(x),w=Wd(y),h=fo*ax*w+wv*Lb*Math.sin(wk*Math.PI*y+ph+(x<0?2.1:0))*Math.pow(ax,1.6)*Math.min(1,y*6);
      const p=V3.add(V3.add(q.p,V3.sc(q.Sd,x*w)),V3.sc(q.Fr,h));if(lim!=null&&p[1]<lim)p[1]=lim;return p};
    const nrm=(x,y)=>{const e=.01,q=fr(y);let n=V3.cr(V3s(M(x+e,y),M(x-e,y)),V3s(M(x,y+e),M(x,y-e)));n=V3l(n)>1e-9?V3.nz(n):q.Fr;return V3.dot(n,q.Fr)<0?V3.sc(n,-1):n};
    /* the net: rows of lateral veins ascending to the margin (closer where the blade is narrow), columns narrowing toward the margin, the areoles set in brick bond between them */
    const XB=det?[.06,.3,.5,.66,.8,.94]:[.06,.36,.62,.88],rows=[];for(let y=.03;y<.975;){rows.push(y);const hw=Wd(y);y+=Math.max(.01,hw*(det?.62:.85)/Lb)*R(.85,1.15)}rows.push(.985);
    const jit=rows.map(()=>XB.map(()=>R(-.18,.18))),sl=.75;
    const halves=[];for(const sg of[1,-1]){const ns=det?40:26,mg=[];for(let i=0;i<=ns;i++)mg.push(M(sg,i/ns));const pts=[];for(let i=0;i<=8;i++)pts.push(M(0,i/8));for(let i=ns;i>=0;i--)pts.push(mg[i]);
      let nm=[0,0,0];for(const y of[.25,.4,.55,.7,.85])nm=V3.add(nm,nrm(sg*.45,y));nm=V3.nz(nm);const fr0=nm[2]>=0,I0=lightI(fr0?nm:V3.sc(nm,-1)),Pc=fr0?P:PB,cells=[[],[],[]],hil=[];
      for(let j=0;j<XB.length-1;j++){const x0=XB[j],x1=XB[j+1],sh=j%2?.5:0;
        for(let i=0;i<rows.length-1;i++){const ya=i+sh,yb=i+1+sh;if(yb>rows.length-1)continue;const rY=v=>{const a=Math.floor(v),b=Math.min(rows.length-1,a+1),t2=v-a;return rows[a]+(rows[b]-rows[a])*t2},
            y0=rY(ya),y1=rY(yb),dyc=y1-y0,hw=Wd((y0+y1)/2);if(hw*(x1-x0)<(det?1.1:1.8)||dyc*Lb<(det?1.1:1.8))continue;
          const sY=(y,x,jj)=>y+sl*hw*x/Lb+jit[Math.min(rows.length-1,Math.round(y===y0?ya:yb))][jj]*dyc*.6,
            C=[[x0,sY(y0,x0,j)],[x1,sY(y0,x1,j+1)],[x1,sY(y1,x1,j+1)],[x0,sY(y1,x0,j)]],cx=(C[0][0]+C[1][0]+C[2][0]+C[3][0])/4,cy=(C[0][1]+C[1][1]+C[2][1]+C[3][1])/4;
          if(cy>.985||cy<.02)continue;
          /* the areole inset from its veins, its corners rounded and its sides a little bulged: a scale */
          const g2=.17,Q=[];for(let m=0;m<4;m++){const a=C[m],b=C[(m+1)%4],ia=[a[0]+(cx-a[0])*g2*1.5,a[1]+(cy-a[1])*g2*1.5],ib=[b[0]+(cx-b[0])*g2*1.5,b[1]+(cy-b[1])*g2*1.5],
              mi=[(a[0]+b[0])/2,(a[1]+b[1])/2];Q.push(ia,[mi[0]+(cx-mi[0])*g2*.6,mi[1]+(cy-mi[1])*g2*.6]);void ib}
          const sp=Q.map(([x,y])=>fgQ(M(sg*Math.min(.97,x),Math.min(.99,y))));const n2=nrm(sg*cx,cy),dI=lightI(fr0?n2:V3.sc(n2,-1))-I0;cells[dI>.05?2:dI<-.05?0:1].push(sp);
          if(!LOD&&fr0){const hq=Q.map(([x,y])=>[cx+(x-cx)*.42-.12*(x1-x0),cy+(y-cy)*.42+.1*dyc]);hil.push(hq.map(([x,y])=>fgQ(M(sg*x,y))))}}}
      halves.push({sg,pts:pts.map(fgQ),edge:mg.map(fgQ),fr:fr0,net:toneAt(fr0?PN:PNB,Math.min(1,I0)),cells:cells.map((L,i)=>({L,col:toneAt(Pc,Math.max(.2,Math.min(1,I0+(i-1)*.14)))})),hil,z:pts.reduce((a,p)=>a+p[2],0)/pts.length})}
    halves.sort((a,b)=>a.z-b.z);
    const mid=[],mw=[];for(let i=0;i<=24;i++){const y=i/24;mid.push(fgQ(M(0,y)));mw.push(Math.max(1.1,(2.4-1.6*y)*Math.min(1.1,kz)*(y<.04?1.3:1)))}
    const zl=halves.reduce((a,h)=>a+h.z,0)/2,back=!halves[0].fr&&!halves[1].fr;
    /* small round sori scattered beneath, between the veins */
    let ds='';if(det&&back)for(const h of halves)for(let i=0;i<70;i++){const y=R(.25,.92),x=R(.12,.85),q=fgQ(M(h.sg*x,y)),r=.55;ds+=`M${f(q[0]-r)},${f(q[1])}a${r},${r} 0 1,0 ${f(2*r)},0a${r},${r} 0 1,0 ${f(-2*r)},0`}
    parts.push({z:zl,cast:false,fn:par=>{for(const h of halves){E('path',{d:smooth(h.pts),fill:h.net},par);
        for(const cl of h.cells)if(cl.L.length)E('path',{d:cl.L.map(q=>smooth(q)).join(''),fill:cl.col},par);
        if(h.hil.length)E('path',{d:h.hil.map(q=>smooth(q)).join(''),fill:'#ffffff',opacity:det?.2:.16},par);
        E('path',{d:'M'+h.edge.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:PN.ink,'stroke-width':det?.5:.55,'stroke-opacity':.5,fill:'none','stroke-linejoin':'round'},par)}
      if(ds)E('path',{d:ds,fill:'#8a6a2c',opacity:.7},par);
      E('path',{d:polyRibbon(mid,i=>mw[i]/2),fill:back?mix(cw.b,'#d8e0b0',.3):mix(cw.c,'#e4eca8',.45)},par);if(!LOD)E('path',{d:polyRibbon(mid,i=>mw[i]*.16,i=>mw[i]*.2),fill:'#f4f8d8',opacity:.55},par)}});
    l58Rachis(res.chains[0],L85_MIST,parts,-.2,{n:Math.round(res.chains[0].pts.length*.5),c:'#5a3a22'});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,L85_MIST)})}

/* ---------- club moss (Lycopodium clavatum, « lycopode », running pine; Dendrolycopodium obscurum, princess pine): long creeping stems branching again and again, every axis densely clothed in tiny
   awl-shaped leaves (3–6 mm) set in a tight spiral, ascending and a little incurved, ending (in L. clavatum) in a fine pale hair-point — a soft cord, like a garland of little cedars; the tips paler
   and a little recurved; upright fertile branches carry on long sparsely-leaved peduncles one to three yellow cylindrical strobili (cones of sporophylls, 2–5 cm), green while young.
   The florist sells it as running cedar garland, by the bundle, fresh or drying well ---------- */
const CW_L85LY=[{id:'vert-franc',n:'Vert franc (Lycopodium)',c:'#4f7d38',bark:'#6a7a3a'},{id:'vert-fonce',n:'Vert foncé (Princess Pine)',c:'#2b4a2c',bark:'#4e5a32'}];
/* the scale leaves of every axis: the conifers' needle drawer of lot 57 (l57Needles), its strokes flushed in larger batches (K) since a club moss has thousands of them */
function l85Scales(res,parts,S,Fr){const det=DET>=1.5&&!LOD,P=pal7(S.c),cs=[toneAt(P,.34),toneAt(P,.56),toneAt(P,.78),S.cy||mix(S.c,'#c4dc7a',.55)],sw=Math.max(1.1,(det?1:1.08)*S.sw),fz=S.fresh||0;
  if(S.cb)cs[0]=toneAt(pal7(mix(S.c,S.cb,.35)),.5);const Fq=Fr?V3.nz(Fr):[0,0,1];
  /* the strokes gathered over consecutive chains of one family (a shoot, then its twigs), flushed every K needles: a few paths per piece whatever the number of twigs */
  const K=S.K||(det?22:64);let bins=['','','',''],tws='',twW=1.1,twc=null,zs=0,zc=0,fam=null;
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
function l85LyStrob(og,kl,op,cw,lim,Fr){const H=V3.nz(og.H),Lp=R(3,5.5)*UPC*kl,up=V3.nz(V3.add([0,1,0],V3.sc(V3.nz(Fr),.2))),p0=og.pos,c1=V3.add(p0,V3.sc(H,Lp*.35)),p2=V3.add(c1,V3.sc(up,Lp*.75)),pts=[];
  for(let i=0;i<=10;i++){const t=i/10,a=V3.add(V3.sc(p0,(1-t)*(1-t)),V3.add(V3.sc(c1,2*t*(1-t)),V3.sc(p2,t*t)));pts.push(a)}if(lim!=null&&l45Low(pts)<lim)return null;
  const T=V3.nz(V3s(pts[10],pts[8])),m=op<.75?(op-.35)/.4:1,Ls=(1.6+1.8*m)*UPC*kl*R(.85,1.1),rs=(.16+.07*m)*UPC*kl,col=mix('#8aa040','#d4c05a',m),P=pal7(col),twin=op>.6&&rnd()<.35,out=[],sc=pts.map(l57Q);
  /* the peduncle: a fine curved stalk rising from the shoot, a few scattered bracts on it */
  out.push({z:(p0[2]+p2[2])/2-.2,cast:false,fn:gg=>{l57Line(gg,sc,1.3,shd(cw.c,.1));if(DET>=1.5&&!LOD){let d='';for(let i=2;i<10;i+=2){const q=sc[i],s=i%4?1:-1;d+=`M${f(q[0])},${f(q[1])}l${f(s*1.1)},${f(-1.2)}`}E('path',{d,stroke:shd(cw.c,.2),'stroke-width':.9,fill:'none','stroke-linecap':'round'},gg)}}});
  const one=(b,d,L2)=>{const e=V3.add(b,V3.sc(d,L2)),sp=l45Spin(V3.add(b,V3.sc(d,-rs*.3)),e,t=>rs*(t<.12?.75+t*2:t>.82?Math.max(.35,1-(t-.82)*3.4):1),12,.16),I=lightI(V3.nz(V3.add(fgCross(d)[0],[0,0,.7])));
    out.push({z:e[2]+.3,cast:false,fn:gg=>{E('path',{d:smooth(sp.P),fill:toneAt(P,I),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5},gg);if(LOD)return;
      /* the sporophylls: chevrons up the cone, light on its lit flank */
      let d2='';for(let i=1;i<11;i+=DET>=1.5?1:2){const c=sp.C[i],r3=rs*.8;d2+=`M${f(c[0]-sp.nx*r3)},${f(c[1]-sp.ny*r3)}L${f(c[0]+(sp.C[i+1][0]-c[0])*.6)},${f(c[1]+(sp.C[i+1][1]-c[1])*.6)}L${f(c[0]+sp.nx*r3)},${f(c[1]+sp.ny*r3)}`}
      E('path',{d:d2,stroke:P.d1,'stroke-width':.45,'stroke-opacity':.6,fill:'none','stroke-linejoin':'round'},gg);E('path',{d:polyRibbon(sp.C,()=>rs*.18,()=>-rs*.45),fill:P.l2,opacity:.45},gg)}})};
  if(twin){const sd=V3.nz(V3.cr(T,[0,0,1])),fk=pts[10];for(const s of[-1,1]){const d=V3.nz(V3.add(T,V3.sc(sd,s*.13))),b=V3.add(fk,V3.sc(d,.7*UPC*kl));out.push({z:fk[2]-.1,cast:false,fn:gg=>l57Line(gg,[l57Q(fk),l57Q(b)],1.25,shd(cw.c,.1))});one(b,d,Ls*.85)}}
  else one(p2,T,Ls);return out}
function l85Lyc(g,t,o){const cw=fgCw(CW_L85LY,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=50,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.7+.3*ks,k=G(g);
  return g35Run(o,'l85ly',()=>{const det=DET>=1.5&&!LOD,Lt=o.spine?blen(o.spine):cm0*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.22,.34)),lim=g35Lim(o);let ns=0;const ms=op<.35?0:R(2,4.99)|0;
    const r=fgGrow(k,A,{li:2.6*UPC*kl,liT:.3,w0:3*kl+.4,w1:1.3,cols:l44Cols(mix(cw.c,cw.bark,.5)),uL:2,lp:0,phy:'spiral',seg:det?8:12,wig:.045,tipLv:0,piece:det?16:40,lift:.2,
      side:{u0:.08,u1:.88,p:det?.88:.7,len:.42,ang:50,li:.6,e:-.006,tilt:30},
      /* the fertile branches: their peduncles rise from the tips of side shoots, the cones upright */
      tip:(og,p,Fr)=>{if(!p.o||ns>=ms)return null;const s=l85LyStrob(og,kl,op,cw,lim,Fr);if(s)ns++;return s},
      post:(res,parts,Fr)=>{l57Twigs(res,{sp:(det?1.4:2.2)*UPC*kl,len:3.8*UPC*kl,ang:44,droop:.02},Fr,lim);l85Scales(res,parts,{K:det?60:240,c:cw.c,twc:shd(cw.c,-.3),cy:mix(cw.c,'#c8dc88',.5),u0:o.spine?.03:.04,sp:(det?.11:.17)*UPC*kl,
        ln:(det?.5:.56)*UPC*kl,th:36,inc:.3,dr:.01,sw:1.15,tipU:.95,fresh:op<.42?.12:.05,lim},Fr)}});
    open(k,t,1000,0,.4);return r})}

/* ---------- reindeer lichen (Cladonia stellaris, « lichen stabilisé », sold as « mousse d'Islande » / Iceland moss): rounded cushions 5–10 cm across, a dense bush of tiny hollow branchlets
   forking again and again in Y and ending in little stars of four or five points; seen from above a cauliflower or coral texture of hundreds of pale points, from the side a dome, airier and paler
   toward its base. Natural grey-green silver; preserved (glycerine) it stays soft and spongy and is dyed in flat, saturated, matt colours. Laid in tufts at the foot of a composition, on the
   lip of the vessel or over the foam, wired on a pick ---------- */
const CW_L85LI=[{id:'naturel',n:'Naturel gris-vert (Iceland Moss Natural)',c:'#b9c1a9'},{id:'blanc',n:'Blanc (blanchi)',c:'#e8e6da'},{id:'vert-tendre',n:'Vert tendre',c:'#b0cf7a'},
  {id:'vert-mousse',n:'Vert mousse (Moss Green)',c:'#7d9c48'},{id:'vert-menthe',n:'Vert menthe (Mint Green)',c:'#a6d2ae'},{id:'vert-fonce',n:'Vert foncé',c:'#4d6e34'},
  {id:'aigue-marine',n:'Aigue-marine (Aquamarin)',c:'#7ec4bc'},{id:'bleu-glacier',n:'Bleu glacier (Ice Blue)',c:'#bcd5e0'},{id:'bleu-roi',n:'Bleu roi (King Blue)',c:'#3454a4'},
  {id:'lavande',n:'Lavande',c:'#b4a4d2'},{id:'rose-clair',n:'Rose clair',c:'#efbcc8'},{id:'fuchsia',n:'Fuchsia',c:'#c9337b'},{id:'cramoisi',n:'Rouge cramoisi (Crimson)',c:'#a82038'},
  {id:'mangue',n:'Orange mangue (Mango)',c:'#ee9c32'},{id:'jaune',n:'Jaune',c:'#e6cf44'},{id:'sienne',n:'Rouille sienne (Sienna)',c:'#a2552e'},{id:'noir',n:'Noir',c:'#2c2c2e'}];
const L85_LIST=['#4a4a3c','#6a6a58','#8a8f78','#b0b4a0'];
/* the soft roundness of a lichen dome: one shared radial fill per colour, lit from the upper left */
const L85_LF={};function l85LiFill(c){const id=L85_LF[c];if(id&&document.getElementById(id))return`url(#${id})`;const nid='l85l'+(gid++),P=pal7(c),gr=E('radialGradient',{id:nid,cx:.38,cy:.32,r:.74},defs);
  stops(gr,[[0,P.l1],[.45,P.b],[.8,P.d1],[1,P.d2]]);L85_LF[c]=nid;return`url(#${nid})`}
function l85Cush(par,B,O,Dm,op,cw){const det=DET>=1.5&&!LOD,P=pal7(cw.c),dk=h2l(cw.c)[2]<.25,V=p=>V3.add(O,toV(B,p)),az=B[2][2],parts=[],Rb=Dm*.5*(.88+.12*op);
  /* the clumps: a central dome and a ring of smaller ones, pressed together into one cushion */
  const L=[{c:[0,0,-Rb*.06],r:Rb*.56,h:Rb*.82}],n=LOD?3:R(6,8.99)|0;for(let i=1;i<n;i++){const a=i*2.4+R(-.3,.3),d=Rb*(i>6?R(.18,.3):R(.4,.52)),r=Rb*R(.3,.42);L.push({c:[Math.cos(a)*d,Math.sin(a)*d,-r*.18],r,h:r*R(1.05,1.25)})}
  /* the underside: the dense pale tangle of old stems where the cushion sits (no soil: the lichen is lifted clean) */
  const ring=[];for(let i=0;i<20;i++){const t=i/20*6.283,u=[Math.cos(t),Math.sin(t)];let m=Rb*.3;for(const l of L){const cu=l.c[0]*u[0]+l.c[1]*u[1],dd=(l.r*.82)**2-(l.c[0]**2+l.c[1]**2-cu*cu);if(dd>0)m=Math.max(m,cu+Math.sqrt(dd))}ring.push(l45Q(V([u[0]*m,u[1]*m,-Rb*.02])))}
  const PB=pal7(dk?shd(cw.c,.25):mix(cw.c,'#e8e4d4',.35));
  parts.push({z:V([0,0,0])[2]+(az>=0?-1e4:1e4),fn:g=>{E('path',{d:smooth(ring),fill:toneAt(PB,.45),stroke:PB.ink,'stroke-width':.35,'stroke-opacity':.3},g);
    if(az<-.1&&!LOD){let d='';const c=ring.reduce((a,q)=>[a[0]+q[0]/20,a[1]+q[1]/20],[0,0]);for(let i=0;i<(det?60:24);i++){const q=ring[rnd()*20|0],s=Math.sqrt(rnd())*.85,p=[c[0]+(q[0]-c[0])*s,c[1]+(q[1]-c[1])*s],b=R(0,6.283),l=R(1,2);
        d+=`M${f(p[0])},${f(p[1])}l${f(Math.cos(b)*l)},${f(Math.sin(b)*l)}l${f(Math.cos(b+.6)*l*.6)},${f(Math.sin(b+.6)*l*.6)}`}E('path',{d,stroke:PB.d1,'stroke-width':.6,'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g)}}});
  const vL=[B[0][2],B[1][2],B[2][2]],Ld=V3.nz([LIGHT[0],-LIGHT[1],0]);
  for(const l of L){const S=[l.r,l.r,l.h],w=V3.nz([vL[0]/S[0],vL[1]/S[1],vL[2]/S[2]]),u1=V3.nz(Math.abs(w[2])<.9?V3.cr(w,[0,0,1]):V3.cr(w,[1,0,0])),u2=V3.cr(w,u1),nr=det?44:28,ph=R(0,6),rim=[];
    /* its outline: the lumpy edge of a cauliflower, cut flat where it sits */
    for(let i=0;i<nr;i++){const t=i/nr*6.283,kk=1+.05*Math.sin(13*t+ph)+.035*Math.sin(29*t+ph*1.7)+.04*Math.sin(5*t+ph*.5),q=V3.add(V3.sc(u1,Math.cos(t)*kk),V3.sc(u2,Math.sin(t)*kk));
      rim.push(l45Q(V([l.c[0]+q[0]*S[0],l.c[1]+q[1]*S[1],Math.max(-Rb*.02,l.c[2]+q[2]*S[2])])))}
    const top=V([l.c[0],l.c[1],l.c[2]+l.h*.8]),I=lightI(az>=0?B[2]:V3.sc(B[2],-1)),cx=rim.reduce((a,q)=>a+q[0],0)/nr,cy=rim.reduce((a,q)=>a+q[1],0)/nr,
      rr=Math.max(...rim.map(q=>Math.hypot(q[0]-cx,q[1]-cy))),tq=l45Q(top),ox=(tq[0]+cx)/2,oy=(tq[1]+cy)/2,sh=(kk,oo)=>rim.map(q=>[ox+(q[0]-ox)*kk+Ld[0]*rr*oo,oy+(q[1]-oy)*kk+Ld[1]*rr*oo]);
    /* the texture: on the visible face of the dome, branchlets forking in Y toward the outside of the dome, their tips stars of pale points; dark hollows between the lobules in the shade */
    const tex=m=>{let dl='',dd='',dp='';for(let i=0;i<m;i++){const a=R(0,6.283),s=Math.sqrt(rnd())*.9,qx=Math.cos(a)*s,qy=Math.sin(a)*s,qz=Math.sqrt(Math.max(0,1-s*s)),
        p=V([l.c[0]+qx*l.r,l.c[1]+qy*l.r,l.c[2]+qz*l.h]),nn=V3.nz(toV(B,[qx/l.r,qy/l.r,qz/l.h]));if(nn[2]<.08)continue;const lit=V3.dot(nn,LIGHT),sp=l45Q(p);
      /* the branchlet points along the dome's normal as seen on the screen (outward and up) */
      let ux=nn[0],uy=-nn[1];const ul=Math.hypot(ux,uy);if(ul<.15){const b=R(0,6.283);ux=Math.cos(b);uy=Math.sin(b)}else{ux/=ul;uy/=ul}
      const ln=R(1,1.7)*(det?1:1.25),fk=[sp[0]+ux*ln*.5,sp[1]+uy*ln*.5],sa=R(.45,.7),e1=[fk[0]+(ux*Math.cos(sa)-uy*Math.sin(sa))*ln*.6,fk[1]+(uy*Math.cos(sa)+ux*Math.sin(sa))*ln*.6],
        e2=[fk[0]+(ux*Math.cos(-sa)-uy*Math.sin(-sa))*ln*.6,fk[1]+(uy*Math.cos(-sa)+ux*Math.sin(-sa))*ln*.6];
      if(lit<.5)dd+=`M${f(sp[0])},${f(sp[1])}L${f(fk[0])},${f(fk[1])}L${f(e1[0])},${f(e1[1])}M${f(fk[0])},${f(fk[1])}L${f(e2[0])},${f(e2[1])}`;
      else{dl+=`M${f(sp[0])},${f(sp[1])}L${f(fk[0])},${f(fk[1])}L${f(e1[0])},${f(e1[1])}M${f(fk[0])},${f(fk[1])}L${f(e2[0])},${f(e2[1])}`;if(det&&lit>.66&&rnd()<.4)for(const e of[e1,e2])dp+=`M${f(e[0]-.35)},${f(e[1])}h.7M${f(e[0])},${f(e[1]-.35)}v.7`}}
      return[dl,dd,dp]};
    const area=Math.PI*rr*rr,m=LOD?0:Math.min(det?320:110,Math.round(area/(det?2.6:6)));
    parts.push({z:top[2],fn:g=>{E('path',{d:smooth(rim),fill:toneAt(P,I*.62),stroke:P.ink,'stroke-width':det?.35:.4,'stroke-opacity':.35},g);if(LOD)return;
      E('path',{d:smooth(sh(.95,.05)),fill:l85LiFill(toneAt(P,I))},g);
      if(m){const[dl,dd,dp]=tex(m);if(dd)E('path',{d:dd,stroke:P.d2,'stroke-width':.6,'stroke-opacity':.6,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
        if(dl)E('path',{d:dl,stroke:dk?P.l1:mix(P.l1,P.l2,.5),'stroke-width':.55,'stroke-opacity':.62,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
        if(dp)E('path',{d:dp,stroke:P.l2,'stroke-width':.45,'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},g)}}})}
  drawParts(par,parts)}
function l85Lich(g,t,o){const cw=fgCw(CW_L85LI,o),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||8)*UPC,k=G(g);
  /* on the lip of a vessel the cushion sits up, its top toward the eye */
  const ax=axOf(o),o2=Object.assign({},o,{ax:o.rim?V3.nz([ax[0]*.35,.75,.62]):V3.nz(V3.add(ax,[0,.9,0]))});
  const nk=g35Run(o2,'l85li',()=>lsHeadS(k,o2,{D:Dm,w:Math.max(2.4,Dm*.035),op,cols:L85_LIST,nodes:0,lp:.42,aimK:.4,wig:.01,e:0,flower:(par,B,P,D2,op2)=>l85Cush(par,B,P,D2,op2,cw)}));
  open(k,t,1000,0,.4);return nk}

/* ---------- registries: drawers, colourways, trade grades (the frond's, the leaf's or the garland's length in cm; the lichen: the cushion's width), and how the composer treats them:
   the foliages stems along their spine, the lichen a low head that sits on the lip of the vessel (rim) ---------- */
Object.assign(GH,{'cyrtomium-falcatum-houx':l85Cyr,'microsorum-musifolium-crocodile':l85Croc,'zamia-integrifolia-coontie':l85Zam,'lycopodium':l85Lyc,'lichen-stabilise':l85Lich});
Object.assign(CWS,{'cyrtomium-falcatum-houx':CW_L85CY,'microsorum-musifolium-crocodile':CW_L85MI,'zamia-integrifolia-coontie':CW_L85ZA,'lycopodium':CW_L85LY,'lichen-stabilise':CW_L85LI});
Object.assign(SZG,{'cyrtomium-falcatum-houx':[30,45,45,60],'microsorum-musifolium-crocodile':[40,60,60,80],'zamia-integrifolia-coontie':[40,50,50,60],'lycopodium':[40,50,60,60],'lichen-stabilise':[5,8,8,10]});
const L85_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'cyrtomium-falcatum-houx':L85_I(45,{fx:26}),'microsorum-musifolium-crocodile':L85_I(60,{fx:16}),'zamia-integrifolia-coontie':L85_I(50,{fx:24}),'lycopodium':L85_I(50,{fx:18}),
  'lichen-stabilise':{form:'sphere',size:1.8,k:'head',rk:1,rim:1}});
