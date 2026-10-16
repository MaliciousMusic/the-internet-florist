/* ================= Serre, lot 84 — argentés et velours : arbre d'argent, oreille d'ours, astelia 'Silver Spear', feuilles d'hosta, thym ================= */
/* ---------- the lot's tools. Leafy stems are grown by the L-system (fgGrow, lot 24) and their leaves drawn in 3D as two halves (g35Leaf, lot 35); the astelia's swords and the hosta's blade
   are 3D sheets (sheet3) lit along and across. Silver is light, not grain: a silky or felted blade carries crisp satin bands on its lit half (a broad soft one, a narrow bright one),
   a felted one a pale margin where its hairs catch the light; a metallic blade a stronger contrast across and a specular gloss. Nothing finer than 1.2 units leaves its carrier ---------- */
const l84Q=p=>[p[0],-p[1]];
/* the half-width of an outline at y, interpolated */
function l84Xw(sh,y){const R0=sh.R;for(let i=1;i<R0.length;i++){const a=R0[i-1],b=R0[i];if((y>=a[1]&&y<=b[1])||(y<=a[1]&&y>=b[1])){const t=Math.abs(b[1]-a[1])<1e-6?0:(y-a[1])/(b[1]-a[1]);return Math.abs(a[0]+(b[0]-a[0])*t)}}return 0}
/* does the blade reach below lim (view y)? */
function l84Below(P0,H,N,L,sh,o,lim){const M=g35Surf(P0,H,N,L,o);for(const[x,y]of sh.R.concat(sh.L))if(M(x,y)[1]<lim)return true;return M(0,1)[1]<lim}
/* a silvery leaf: g35Leaf shrunk until it clears the lip (or dropped), then its satin: o.sat {k (opacity), a, b (the band, in shares of the half-width), felt (a broad soft band only)} */
function l84Leaf(P0,H,N,len,sh,c,cb,o){let L=len;if(o.lim!=null){let k=1;while(k>.6&&l84Below(P0,H,N,L,sh,o,o.lim)){L*=.8;k*=.8}if(l84Below(P0,H,N,L,sh,o,o.lim))return null}
  const lf=g35Leaf(P0,H,N,L,sh,c,cb,Object.assign({},o,{lim:null}));if(!o.sat||LOD)return lf;
  const M=g35Surf(P0,H,N,L,o),S=o.sat;let best=null,bI=-9;
  for(const sg of[-1,1]){const n=g35Nrm(M,sg*.3*Math.max(.02,l84Xw(sh,.5)),.5),fr=n[2]>=0,I=lightI(fr?n:V3.sc(n,-1))+(fr?.08:0);if(I>bI){bI=I;best={sg,fr}}}
  const band=(a,b,y0,y1)=>{const A=[],B=[];for(let i=0;i<=8;i++){const y=y0+(y1-y0)*i/8,w=l84Xw(sh,y);A.push(l84Q(M(best.sg*a*w,y)));B.push(l84Q(M(best.sg*b*w,y)))}return smooth(A.concat(B.reverse()))};
  const k=S.k*(best.fr?1:.6)*Math.max(.35,Math.min(1.25,(bI-.35)*2)),d1=band(S.a??.12,(S.b??.78)*(DET>=1.5||S.felt?1:.7),.06,.93),d2=S.felt?null:band((S.a??.12)+.12,(S.a??.12)+.38,.14,.84),fn0=lf.fn;
  lf.fn=par=>{fn0(par);E('path',{d:d1,fill:'#ffffff',opacity:f(k*.55)},par);if(d2&&DET>=1.5)E('path',{d:d2,fill:'#ffffff',opacity:f(k*.75)},par)};return lf}
/* a 3D sheet with its own surface S(u,v) (u across from −1 to 1, v from the base to the tip), drawn like the big leaves of lot 34 */
function l84Sheet(S,col,colB,o,parts){const F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(colB);
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:o.nu||6,nv:o.nv||18,across:o.across??1.2,ew:.5,eo:.4,cast:0,veins:o.veins,vw:o.vw||.6,vo:o.vo,vc:o.vc,vl:o.vl,vlo:o.vlo,zb:o.zb,along:o.along,
    gloss:o.gl?{shin:o.shin||26,k:o.gl,thr:.2,cu:2,cv:o.gcv||5,nu:8,nv:16,lv:1.7,lu:.5,o:.6}:null,
    paint:o.paint&&!LOD?(g,front,c)=>{if(front)o.paint(g,c,S,P)}:null});
  parts.push(...ps);return ps}
/* a length of polyline (view space) resampled: the point and its tangent at s (share of its length) */
function l84Path(pts){const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const L=cum[cum.length-1]||1;
  return{L,at:s=>{const l=Math.max(0,Math.min(1,s))*L;let i=1;while(i<pts.length-1&&cum[i]<l)i++;const t=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1))),
    a=pts[Math.max(0,i-2)],b=pts[Math.min(pts.length-1,i+1)];return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t)),T:V3.nz(V3s(b,a))}}}}

/* ---------- silver tree (Leucadendron argenteum, Proteaceae, Cape Town): a stout trunk-like stem, densely white-velvety when young; leaves crowded in a tight spiral, sessile,
   lanceolate, 8–15 × 1.5–2.5 cm, ascending and overlapping, both faces clad in long silky silver hairs lying flat — they shine like satin and their margin is fringed with light;
   dioecious: the female shoot ends in a silver-grey cone (4–5 cm, its scales felted), the male in a round head of yellow-cream florets. Sold as cut stems 40–60 cm, the tips of the branches ---------- */
const CW_L84ARG=[{id:'argent',n:'Argent satiné (type)',c:'#b0b8b2',b:'#d8dcd6',st:'#b4b2a8'},{id:'argent-bleute',n:'Argent bleuté (vieux rameaux)',c:'#aab4b6',b:'#ccd4d4',st:'#a8aaa4'},
  {id:'argent-vert',n:'Argent vert tendre (pousses)',c:'#b4bfae',b:'#d4dccc',st:'#b8b8a8'},{id:'cone-femelle',n:'Avec cône femelle argenté',c:'#b2b9b4',b:'#d8dcd6',st:'#b4b2a8',cone:'f',f:1},
  {id:'tete-male',n:'Avec tête mâle jaune crème',c:'#b5bbb6',b:'#d8dcd6',st:'#b4b2a8',cone:'m',fl:'#e6d78a',f:1}];
const L84_ARGW=prof([[0,.22],[.1,.62],[.3,.96],[.45,1],[.65,.86],[.85,.46],[1,0]]);
/* the head at the tip: a cone of felted scales in spiral rows (female) or a dome of florets (male), along d from b; its outline from its axis projected */
function l84Cone(b,d,Lc,rc,cw,op){const e=V3.add(b,V3.sc(d,Lc)),B2=l84Q(b),E2=l84Q(e),dx=E2[0]-B2[0],dy=E2[1]-B2[1],l=Math.hypot(dx,dy),ux=l>1e-6?dx/l:0,uy=l>1e-6?dy/l:-1,nx=-uy,ny=ux,
    male=cw.cone==='m',Lp=Math.max(l,rc*1.25),rad=t=>rc*(male?Math.pow(Math.sin(Math.PI*Math.min(1,.08+t*.92)),.55):Math.pow(Math.sin(Math.PI*Math.min(1,.06+t*.86)),.7)*(1-.12*t)),P=[];
  for(let i=0;i<=12;i++){const t=i/12;P.push([B2[0]+ux*Lp*t+nx*rad(t),B2[1]+uy*Lp*t+ny*rad(t)])}for(let i=12;i>=0;i--){const t=i/12;P.push([B2[0]+ux*Lp*t-nx*rad(t),B2[1]+uy*Lp*t-ny*rad(t)])}
  const det=DET>=1.5&&!LOD,c=male?cw.fl:'#aeb4b0',PC=pal7(c),z=(b[2]+e[2])/2;let sc='',hl='';
  /* female: rows of rounded felted scales, each with a darker tip; male: little florets as round dots on the dome */
  if(!LOD){const rows=male?5:det?8:6;for(let r=0;r<rows;r++){const t=(r+.6)/(rows+.2),nb=male?(det?5:4):(det?4:3);for(let j=0;j<nb;j++){const off=(j-(nb-1)/2)/((nb-1)/2||1)*.78+(r%2?.12:-.12),cx=B2[0]+ux*Lp*t+nx*rad(t)*off,cy=B2[1]+uy*Lp*t+ny*rad(t)*off;
      if(male){const rr=Math.max(.75,rc*.13);sc+=`M${f(cx-rr)},${f(cy)}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
      else{const rw=rad(t)*.32,rl=Lp/(rows+.2)*.75,Q=[];for(let a=0;a<=6;a++){const th=Math.PI*a/6,x=Math.cos(th)*rw,y=Math.sin(th)*rl;Q.push([cx+nx*x+ux*y,cy+ny*x+uy*y])}sc+=smooth(Q,false);
        hl+=`M${f(cx+ux*rl*.75)},${f(cy+uy*rl*.75)}l${f(ux*.01)},${f(uy*.01)}`}}}}
  return{z,cast:false,fn:par=>{E('path',{d:smooth(P),fill:toneAt(PC,.58),stroke:PC.ink,'stroke-width':.45,'stroke-opacity':.45},par);
    /* the light side of the body (a crisp band), then the scales or florets */
    const S2=P.slice(0,13).map((q,i)=>{const t=i/12;return[q[0]-nx*rad(t)*.55,q[1]-ny*rad(t)*.55]});E('path',{d:smooth(P.slice(0,13).concat(S2.reverse())),fill:'#ffffff',opacity:male?.18:.26},par);
    if(sc)E('path',male?{d:sc,fill:toneAt(PC,.78),stroke:PC.d1,'stroke-width':.3,'stroke-opacity':.5}:{d:sc,fill:'none',stroke:toneAt(PC,.2),'stroke-width':det?.6:.75,'stroke-opacity':.8,'stroke-linecap':'round'},par);
    if(hl&&det)E('path',{d:hl,stroke:'#6a6458','stroke-width':1.2,'stroke-linecap':'round','stroke-opacity':.55},par)}}}
function l84Arg(g,t,o){const cw=fgCw(CW_L84ARG,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=11,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l84arg',()=>{const Lt=o.spine?blen(o.spine):50*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.04,.12)),cols=L60_ST(cw.st),lim=g35Lim(o),sh=g35Prof(L84_ARGW,.19,10);
    const r=fgGrow(k,A,{li:.9*UPC*kl,liT:.45,w0:6.5*kl,w1:2.4,cols,uL:o.spine?.3:.1,phy:'spiral',la:30,face:.4,lift:.25,seg:8,wig:.012,rj:20,tipLv:cw.cone?0:undefined,
      leaf:(og,p)=>{const u=p.u,sz=(p.tip?.55:fgSz(p,cw.cone?.66:.78))*kl*(u<.2?.8+u:1),L=cm0*UPC*sz*R(.86,1.1),young=u>.8?(u-.8)/.2*(.3+.5*(1-op)):0,F=g35Fr(og),P0=V3.add(F.P0,V3.sc(F.H,L*.03)),
          c=mix(cw.c,'#dfe4dc',young*.6);
        return l84Leaf(P0,F.H,F.N,L,sh,mix(c,shd(c,R(-.05,.05)),.5),cw.b,{lim,sm:1,fold:.1+.25*young,arch:.04,droop:.06,cup:.03,tw:R(-.3,.3),bend:R(-.04,.04),edge:mix(c,'#3e463e',.5),ew:.45,dI:.02,
          veins:[[[0,0],[0,.96]]],vc:'#eef0ec',vw:.5,vo:.5,sat:{k:.62,a:.1,b:.8}})},
      tip:(og,p)=>{if(!cw.cone||p.o)return null;const Lc=(cw.cone==='m'?4.6:6.2)*UPC*kl*(.55+.45*op),rc=Lc*(cw.cone==='m'?.5:.36),d=V3.nz(V3.add(og.H,[0,.25,0]));
        if(lim!=null&&og.pos[1]<lim+Lc)return null;const c=l84Cone(V3.add(og.pos,V3.sc(d,-rc*.15)),d,Lc,rc,cw,op);c.z+=rc*.6;return c}});
    open(k,t,1000,0,.4);return r})}

/* ---------- lamb's ear (Stachys byzantina, Lamiaceae): the whole plant clad in a thick white wool; leaves opposite, oblong-elliptic, 5–10 cm (the basal ones to 15 cm on a petiole),
   thick and soft, grey-silver, the veins sunk, the margin finely crenate; the flowering stems erect and square, 30–45 cm, their leaves smaller and sessile up the stem,
   ending in a woolly spike of interrupted whorls (verticillasters) of small two-lipped flowers, mauve-pink, half hidden in the woolly calyces and bracts.
   Trade: the flowering stems (June–July), the foliage of 'Big Ears' ('Helene von Stein', larger, greener), 'Silver Carpet' (never flowers), 'Primrose Heron' (yellowish in spring) ---------- */
const CW_L84STA=[{id:'gris-argent',n:'Gris argent (type)',c:'#b9bdb5',b:'#dcded8'},{id:'fleuri-mauve',n:'Fleuri, épis mauves',c:'#b6bab2',b:'#dcded8',fl:'#b47ab4',f:1},
  {id:'fleuri-rose',n:'Fleuri, épis rose pâle',c:'#bcc0b8',b:'#dcded8',fl:'#d898c0',f:1},{id:'big-ears',n:'Vert-de-gris (Big Ears)',c:'#9aa596',b:'#c8cec2',big:1},
  {id:'silver-carpet',n:'Blanc argenté (Silver Carpet)',c:'#cdd0c8',b:'#e2e4de'},{id:'primrose-heron',n:'Gris jaunâtre (Primrose Heron)',c:'#c2c49a',b:'#dcdcc4'}];
const L84_STAW=prof([[0,.4],[.12,.78],[.4,1],[.7,.88],[.9,.5],[1,0]]),L84_WOOL=['#8a8c84','#b4b6ae','#d2d4cc','#ecece6'];
function l84Sta(g,t,o){const cw=fgCw(CW_L84STA,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g),fl=!!cw.f;
  return g35Run(o,'l84sta',()=>{const Lt=o.spine?blen(o.spine):35*UPC*(.7+.3*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.03,.1)),cols=L84_WOOL,lim=g35Lim(o),
      wr=cw.big?.5:.42,sh=l60Half(L84_STAW,wr,9,.03,1),veins=l60Veins(L84_STAW,wr,4,0),SL=fl?Math.min(13*UPC*kl,A.L*.38):0;
    if(SL)A.L=Math.max(A.l0+SL*.6,A.L-SL*.85);
    const SP={L:SL*(.55+.45*op),n:fl?12:0,nf:6,cl:.95*UPC*kl,fl:.4*UPC*kl,el:40,cor:cw.fl||'#b47ab4',cal:'#cdd0c8',bud:mix(cw.fl||'#b47ab4','#cdd0c8',.6),br:{c:'#c4c8c0',len:1.6*UPC*kl,w:.7},w:4.4*kl,rise:.25,ax:'#d2d4cc'};
    const r=fgGrow(k,A,{li:(fl?4.2:3)*UPC*kl,liT:.35,w0:4.2*kl,w1:fl?2.8:1.8,cols,uL:o.spine?.22:.06,phy:'opp',la:fl?44:52,face:.62,lift:.3,seg:9,wig:.015,tipLv:fl?0:undefined,
      leaf:(og,p)=>{const u=p.u,sz=(p.tip?.5:fl?Math.max(.42,1-.6*u):fgSz(p,.7))*kl*(cw.big?1.25:1),L=cm0*UPC*sz*R(.88,1.1),c=mix(cw.c,shd(cw.c,R(-.05,.05)),.5);
        const F=g35Fr(og),pl=L*(u<.3&&!fl?.16:.05),P0=V3.add(F.P0,V3.add(V3.sc(F.H,pl),[0,-pl*.06,0]));
        const lf=l84Leaf(P0,F.H,F.N,L,sh,c,cw.b,{lim,sm:1,fold:.2,arch:.1,droop:.26,cup:.1,wave:.025,wk:5,wph:R(0,6),tw:R(-.3,.3),edge:mix(c,'#4a5048',.42),ew:.5,dI:.04,
          veins,vc:shd(c,-.12),vw:.45,vo:.3,sat:{k:.38,a:.06,b:.86,felt:1}});
        return lf?[lf,g35Pet(F.P0,V3.add(P0,V3.sc(F.H,L*.05)),Math.max(1.4,2.2*kl),cols[2])]:null},
      tip:(og,p)=>fl&&!p.o&&(lim==null||og.pos[1]>lim+4)?l60Spike(og,op,SP):null,
      post:(res,parts)=>l60Square(res,parts,cols)});
    open(k,t,1000,0,.4);return r})}

/* ---------- Astelia chathamica 'Silver Spear' (Asteliaceae, Chatham Islands): a clump of long sword-shaped leaves, 60–120 × 3–6 cm, keeled, arching from a sheathing base,
   clad on both faces in silvery membranous scales that give a metallic sheen — the upper face silver-green, the underside almost white; fine parallel veins.
   Cut leaves (60–90 cm) last for weeks; 'Silver Shadow' broader and whiter; A. nivicola 'Red Gem' bronze-red under the silver; A. banksii greener ---------- */
const CW_L84AST=[{id:'silver-spear',n:'Argent métallique (Silver Spear)',c:'#9ea9a6',b:'#dde2de',pc:'#c4cac4'},{id:'silver-shadow',n:'Argent blanc (Silver Shadow)',c:'#bec5c0',b:'#e6e9e4',pc:'#d0d4ce'},
  {id:'red-gem',n:'Bronze rouge argenté (Red Gem)',c:'#9a7e7a',b:'#cab8b4',pc:'#a88882'},{id:'banksii',n:'Vert argenté (banksii)',c:'#8f9c8a',b:'#c8d0c4',pc:'#a8b0a0'}];
const L84_ASTW=v=>{v=Math.max(0,Math.min(1,v));const a=Math.min(1,v/.16);return(.5+.5*a*a*(3-2*a))*(v<.4?1:Math.pow((1-v)/.6,.8))};
/* one sword along a path (view space) of length L: the keel along the path, the blade across it facing Fr, folded on the keel (a V), twisted along */
function l84Sword(pts,Fr,W,cw,o,parts){const Pa=l84Path(pts),tw=o.tw||0,fo=o.fold??.22;
  const S=(u,v)=>{const q=Pa.at(v),T=q.T;let N=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));N=V3l(N)>1e-4?V3.nz(N):fgCross(T)[0];let X=V3.cr(T,N);const a=tw*v,c=Math.cos(a),s=Math.sin(a),X2=V3.add(V3.sc(X,c),V3.sc(N,s)),N2=V3.add(V3.sc(N,c),V3.sc(X,-s)),
      w=W*L84_ASTW(v)*.5;return V3.add(V3.add(q.p,V3.sc(X2,u*w)),V3.sc(N2,w*fo*Math.abs(u)))};
  /* the silver scales catch the light in crisp bands along the blade: a broad pale one on each half, a bright narrow one beside the keel */
  const paint=(gg,c,S2)=>{let d1='',d2='';for(const s of[-1,1]){const band=(a,b,v0,v1)=>{const A=[],B=[];for(let i=0;i<=10;i++){const v=v0+(v1-v0)*i/10;A.push([s*a,v]);B.push([s*b,v])}return A.concat(B.reverse())};
      let q=t34Clip(c,band(.3,.72,.04,.9));if(q)d1+=t34P(S2,q);q=t34Clip(c,band(.1,.2,.06,.86));if(q)d2+=t34P(S2,q)}
    if(d1)E('path',{d:d1,fill:'#ffffff',opacity:.24},gg);if(d2)E('path',{d:d2,fill:'#ffffff',opacity:.42},gg)};
  return l84Sheet(S,cw.c,cw.b,{nu:4,nv:o.nv||24,across:2.4,gl:1.1,shin:34,gcv:7,zb:o.zb||0,paint,
    veins:[{pts:[[0,0],[0,.5],[0,.98]],w:Math.max(.8,W*.03),c:shd(cw.c,.5),o:.6},...[-.6,-.3,.3,.6].map(u=>({pts:[[u,.02],[u,.5],[u*.8,.9],[u*.3,.99]]}))],vw:.5,vo:.22,vlo:.3},parts)}
function l84Ast(g,t,o){const cw=fgCw(CW_L84AST,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=80,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l84ast',()=>{const Lt=o.spine?blen(o.spine):cm0*.85*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.22,.34)),lim=g35Lim(o),W=4.6*UPC*(o.spine?1:Math.min(1.15,.75+.25*ks)),
      pc=cw.pc,cols=[shd(pc,-.55),shd(pc,-.2),pc,shd(pc,.4)];
    const r=fgGrow(k,A,{li:A.L*4,liT:0,w0:W*.42,w1:W*.3,cols,uL:2,seg:10,wig:.004,tipLv:0,
      post:(res,parts,Fr)=>{const ch=res.chains[0],pts=ch.pts;for(let i=parts.length-1;i>=0;i--)if(parts[i].ax)parts.splice(i,1);
        /* the young leaf (bud stage) still folded, the main sword along the stem's own path */
        const yg=Math.max(0,.75-op)/.75,P0=pts[0],T0=V3.nz(V3s(pts[Math.min(pts.length-1,2)],P0)),Lm=l84Path(pts).L;
        l84Sword(pts,Fr,W*(1-.45*yg),cw,{tw:(rnd()<.5?-1:1)*R(.5,1),fold:.22+.5*yg,zb:.5},parts);
        /* the tuft: one or two shorter swords from the same sheath, splayed in the plane of the spray and arching out under their weight */
        const ns=yg>.6?0:rnd()<.5?1:2,X=V3.nz(V3.cr(Fr,T0));for(let j=0;j<ns;j++){const sg=ns===2?(j?1:-1):(rnd()<.5?-1:1),Ls=Lm*R(.55,.8)*(1-.3*yg),n=22;
          let d=V3.nz(V3.add(V3.add(V3.sc(T0,Math.cos(R(.22,.38))),V3.sc(X,sg*Math.sin(R(.22,.38)))),V3.sc(Fr,-R(.05,.25)))),p=V3.add(P0,V3.sc(T0,W*.25));const sp=[p];
          for(let i=0;i<n;i++){d=V3.nz(V3.add(d,[0,-.045*R(.8,1.2),0]));p=V3.add(p,V3.sc(d,Ls/n));sp.push(p)}
          let cut=sp.length;if(lim!=null){cut=sp.findIndex(q=>q[1]<lim+W*.6);if(cut<0)cut=sp.length}if(cut<n*.5)continue;
          l84Sword(sp.slice(0,cut),Fr,W*R(.75,.9),cw,{tw:sg*R(.3,.7),fold:.24,nv:18,zb:-.5},parts)}}});
    open(k,t,1000,0,.4);return r})}

/* ---------- hosta (Hosta spp. and cultivars, plantain lily): the cut leaf on its long channelled petiole (20–40 cm); the blade ovate-cordate, 12–35 cm, its base notched round the petiole,
   its tip acute, its veins curving parallel from the base to the tip and sunk deep (the blade corrugated between them, puckered in the sieboldianas), matt and glaucous in the blue kinds
   (a wax bloom), glossy in the greens; variegated with a white or cream margin ('Francee', 'Patriot'), a gold margin ('Frances Williams'), a gold or white centre ('June', 'Undulata').
   The underside paler, often whitish. Sold by the leaf, in grades by blade length ---------- */
const CW_L84HOS=[{id:'vert',n:'Vert brillant (Royal Standard)',c:'#4c7a35',b:'#8aa874',pc:'#7a9a5a',gl:.8},{id:'bleu',n:'Bleu glauque (Halcyon)',c:'#6f8f8c',b:'#a8bcb4',pc:'#8aa29a',gl:.15,pk:1},
  {id:'chartreuse',n:'Chartreuse doré (Sum and Substance)',c:'#b8c63a',b:'#cad08a',pc:'#a8b84a',gl:.6},{id:'francee',n:'Vert liseré blanc (Francee)',c:'#3f6a30',b:'#88a472',pc:'#7a9a5a',mg:'#f2efe0',mw:.12,gl:.6},
  {id:'patriot',n:'Vert large liseré blanc (Patriot)',c:'#41702f',b:'#8aa672',pc:'#86a066',mg:'#f4f1e2',mw:.26,gl:.6},
  {id:'frances-williams',n:'Bleu-vert liseré or (Frances Williams)',c:'#5f7f6e',b:'#a2b4a6',pc:'#8aa086',mg:'#c9b440',mw:.22,gl:.15,pk:1},
  {id:'june',n:'Cœur or, bord bleu-vert (June)',c:'#5d7d6c',b:'#a2b4a6',pc:'#9aa678',ctr:'#c9c070',ck:.62,gl:.2},
  {id:'undulata',n:'Cœur blanc ondulé (Undulata)',c:'#3d6832',b:'#8aa472',pc:'#8aa66a',ctr:'#f0eedc',ck:.55,gl:.5,wv:1}];
const L84_HOSW=v=>{v=Math.max(0,Math.min(1,v));return Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(v,.62))),.85)+.14*Math.pow(1-v,4)},L84_NB=.11;
/* the blade's surface: lot 34's big-leaf surface with its base notched — at the base the midrib starts at the sinus (nb up the blade), the lobes below it, round the petiole's top */
function l84HosS(og,len,o){const S=t34S(Object.assign({},og,{pos:V3.add(og.pos,V3.sc(og.H,-L84_NB*len*.9))}),len,o);return(u,v)=>S(u,v+L84_NB*(1-v)*Math.pow(1-Math.min(1,Math.abs(u)),2))}
function l84Hos(g,t,o){const cw=fgCw(CW_L84HOS,o);
  return t34Plant(g,t,o,{cm0:25,pet:30,pc:cw.pc,w0:4.6,w1:4,arch:R(-.1,.1),wig:.01,face:.9,blade:(og,len,op,parts)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.3*yg);
    const so={wp:L84_HOSW,wr:.68,th0:-.28+.2*yg,ka:-.22,lean:R(-.15,.15),droop:.1,fold:.12,tw:(rnd()<.5?-1:1)*R(.1,.3),wave:cw.wv?.08:.02,nw:cw.wv?4:3,roll:yg*1.9,ph:R(0,6)},S=l84HosS(og,L,so);
    /* the curving parallel veins, sunk (a dark groove and its lit ridge); the midrib raised and pale */
    const vs=[.12,.24,.36,.48,.6,.72,.84].flatMap(a=>[-a,a]).map(a=>({pts:[[a*.15,0],[a*.7,.06],[a,.2],[a,.55],[a*.95,.85],[a*.6,.97]]}));
    const paint=(cw.mg||cw.ctr)?(gg,c,S2)=>{let d='';
      if(cw.mg)for(const s of[-1,1]){const pts=[];for(let i=0;i<=14;i++){const v=.01+.97*i/14;pts.push([s*(1-cw.mw*(1+.22*Math.sin(v*19+s*2))),v])}for(let i=14;i>=0;i--)pts.push([s*1.01,.01+.97*i/14]);const q=t34Clip(c,pts);if(q)d+=t34P(S2,q)}
      if(cw.ctr){const pts=[];for(let i=0;i<=14;i++){const v=.03+.9*i/14;pts.push([-cw.ck*(1+.18*Math.sin(v*17))*Math.min(1,v*5+.3)*(v>.8?1-(v-.8)*3:1),v])}for(let i=14;i>=0;i--){const v=.03+.9*i/14;pts.push([cw.ck*(1+.18*Math.sin(v*15+1))*Math.min(1,v*5+.3)*(v>.8?1-(v-.8)*3:1),v])}
        const q=t34Clip(c,pts);if(q)d+=t34P(S2,q)}
      if(d)E('path',{d,fill:cw.mg||cw.ctr,opacity:.92},gg)}:null;
    l84Sheet(S,cw.c,cw.b,{nu:7,nv:20,across:cw.pk?1.6:1.3,gl:cw.gl,shin:cw.pk?14:26,gcv:5,paint,
      veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(1,L*.009),c:shd(cw.ctr||cw.c,.45),o:.7},...vs],vw:Math.max(.6,L*.0045),vo:.6,vlo:.55,vc:shd(cw.c,-.5),vl:shd(cw.c,.5)},parts)}})}
l84Hos.bigLeaf={ext:14,k0:12};

/* ---------- thyme (Thymus vulgaris, Lamiaceae): a dwarf sub-shrub of wiry woody stems, red-brown and much branched, the young shoots downy; leaves opposite, tiny (5–10 mm), elliptic,
   their margin rolled under, grey-green and glandular, with smaller leaves bunched in their axils; flowers tiny (4–6 mm), two-lipped, pale mauve to pink, in small rounded glomerules
   (whorls crowded at the tips of the shoots), their calyx purplish. Trade: bunches of tips 15–25 cm, green-grey, flowering, lemon thyme 'Aureus' (golden), 'Silver Queen' (silvery) ---------- */
const CW_L84THY=[{id:'vert-gris',n:'Vert gris (type)',c:'#7d8b73',st:'#7b6450'},{id:'fleuri-mauve',n:'Fleuri mauve pâle',c:'#7b8971',st:'#7b6450',fl:'#d6bfe0',f:1},
  {id:'fleuri-rose',n:'Fleuri rose',c:'#7a8a70',st:'#7a5a4c',fl:'#e2a6c8',f:1},{id:'citron-dore',n:'Thym citron doré (Aureus)',c:'#b4ae58',st:'#866a4a'},
  {id:'argente',n:'Argenté (Silver Queen)',c:'#a9b2a0',st:'#86705a',ed:'#e8e8d6'}];
/* the tiny leaves of every axis, pair by pair crossing, with a smaller pair bunched in the axil; batched by piece: behind the twig, the upper faces in shade and lit, the paler undersides */
function l84Thyme(res,parts,cw,S){const det=DET>=1.5&&!LOD,P=pal7(cw.c),cs=[toneAt(P,.34),toneAt(P,.55),toneAt(P,.76),mix(toneAt(P,.7),'#d8dcd0',.4)];
  for(const ch of res.chains){const pts=ch.pts,n=pts.length;if(n<2)continue;const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const Lc=cum[n-1],a0=ch.ord?Lc*.04:Lc*S.u0;if(Lc-a0<3)continue;
    const at=l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const u=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)));return{p:V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),T:V3.nz(V3s(pts[i],pts[i-1])),w:ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*u}};
    const nn=Math.max(2,Math.round((Lc-a0)/S.sp)),K=det?12:40,ph=R(0,90);let bins=['','','',''],zs=0,zc=0;
    const flush=()=>{if(!zc)return;const z=zs/zc,bb=bins;
      parts.push({z:z-.4,cast:false,fn:g=>{if(bb[0])E('path',{d:bb[0],fill:cs[0],stroke:cs[0],'stroke-width':.4,'stroke-linejoin':'round'},g)}});
      parts.push({z:z+.4,cast:false,fn:g=>{for(const j of[3,1,2])if(bb[j])E('path',{d:bb[j],fill:cs[j],stroke:j===2&&cw.ed?cw.ed:cs[j],'stroke-width':j===2&&cw.ed?.6:.4,'stroke-linejoin':'round'},g)}});
      bins=['','','',''];zs=zc=0};
    for(let i=0;i<nn;i++){const l=a0+(Lc-a0)*(i+.65+R(-.1,.1))/nn,q=at(Math.max(0,Math.min(Lc,l))),u=(l-a0)/(Lc-a0),[X,Y]=fgCross(q.T),az0=(ph+i*90+R(-10,10))*D;zs+=q.p[2];zc++;
      if(S.lim!=null&&q.p[1]<S.lim+2)continue;
      const tipK=u>.8?.45+.55*(1-u)/.2:1;
      for(const sm of S.fas?[1,.5]:[1])for(let j=0;j<2;j++){const az=az0+j*Math.PI+(sm<1?Math.PI/2:0),rk=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),
          Ln=S.ln*sm*tipK*(ch.ord?.85:1)*R(.85,1.12),Wn=Math.max(1.15,Ln*.36),th=(S.th+R(-10,10))*(u>.85?.6:1)*(sm<1?.7:1)*D,d=V3.nz(V3.add(V3.sc(q.T,Math.cos(th)),V3.sc(rk,Math.sin(th)))),
          b=V3.add(q.p,V3.sc(rk,q.w*.2)),e=V3.add(V3.add(b,V3.sc(d,Ln)),[0,-.1*Ln,0]),B2=l84Q(b),E2=l84Q(e),dx=E2[0]-B2[0],dy=E2[1]-B2[1],l2=Math.hypot(dx,dy)||1,nx=-dy/l2,ny=dx/l2,
          nU=V3s(q.T,V3.sc(d,V3.dot(q.T,d))),up=nU[2]>-.15,hw=Wn*.5*Math.max(.55,Math.abs(V3.nz(V3.cr(d,rk))[2])+.35);
        if(S.lim!=null&&e[1]<S.lim)continue;
        /* a little ellipse from the twig: its base on the twig, round, then its blunt tip */
        const m1=[B2[0]+dx*.42+nx*hw,B2[1]+dy*.42+ny*hw],m2=[B2[0]+dx*.42-nx*hw,B2[1]+dy*.42-ny*hw],t1=[B2[0]+dx*.82+nx*hw*.6,B2[1]+dy*.82+ny*hw*.6],t2=[B2[0]+dx*.82-nx*hw*.6,B2[1]+dy*.82-ny*hw*.6];
        const s=`M${f(B2[0])},${f(B2[1])}Q${f(m1[0]-dx*.2)},${f(m1[1]-dy*.2)} ${f(m1[0])},${f(m1[1])}Q${f(t1[0]+dx*.12)},${f(t1[1]+dy*.12)} ${f(E2[0])},${f(E2[1])}Q${f(t2[0]+dx*.12)},${f(t2[1]+dy*.12)} ${f(m2[0])},${f(m2[1])}Q${f(m2[0]-dx*.2)},${f(m2[1]-dy*.2)} ${f(B2[0])},${f(B2[1])}Z`;
        const behind=e[2]<q.p[2]-Ln*.2;bins[behind?0:!up?3:V3.dot(rk,LIGHT)>.2?2:1]+=s}
      if(zc>=K)flush()}flush()}}
/* a glomerule at the tip of a shoot: a dome of tiny flowers round the tip, the purplish calyces under them; one part (a few paths), every flower touching the dome */
function l84Glom(og,op,cw,S){const T=V3.nz(V3.add(og.H,[0,.35,0])),c=V3.add(og.pos,V3.sc(T,S.r*.55)),C2=l84Q(c),[X,Y]=fgCross(T),r=S.r*(.6+.4*op),n=DET>=1.5&&!LOD?14:9,fls=[];
  for(let i=0;i<n;i++){const a=i*137.5*D,h=1-1.45*(i+.5)/n,rr=Math.sqrt(1-h*h),dir=V3.nz(V3.add(V3.sc(T,h*.8+.1),V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)))),p=V3.add(c,V3.sc(dir,r*.85));
    const age=Math.max(0,Math.min(1,op*1.6-Math.max(0,h)*.6));fls.push({p,dir,age,z:p[2]})}
  fls.sort((a,b)=>a.z-b.z);const cal=shd(mix(cw.fl,'#6a4a5a',.55),-.1),fs=S.fs;let dc='',df='',db='';
  for(const q of fls){const P=l84Q(q.p),d2=l84Q(V3.add(q.p,V3.sc(q.dir,fs))),dx=d2[0]-P[0],dy=d2[1]-P[1];
    if(q.age<.45){const rr=Math.max(.8,fs*.38);db+=`M${f(P[0]-rr)},${f(P[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;continue}
    /* the open flower: its lower lip of three round lobes facing out, the upper lip notched */
    const s=Math.max(.9,fs*.42*(.6+.4*q.age)),cx=P[0]+dx*.4,cy=P[1]+dy*.4;dc+=`M${f(P[0])},${f(P[1])}L${f(cx)},${f(cy)}`;
    const a0=Math.atan2(dy,dx),Q=[];for(let j=0;j<20;j++){const th=j*Math.PI/10,rr=s*(.38+.62*Math.pow(Math.abs(Math.cos(2*th)),.7))*(Math.cos(th)>.5?1.15:1);Q.push([cx+Math.cos(a0+th)*rr,cy+Math.sin(a0+th)*rr])}df+=smooth(Q)}
  const R2=r*.8,dome=[];for(let i=0;i<=12;i++){const a=i/12*Math.PI*2;dome.push([C2[0]+Math.cos(a)*R2,C2[1]+Math.sin(a)*R2*.85])}const pale=h2l(cw.fl)[2]>.8;
  return{z:c[2]+r*.3,cast:false,fn:par=>{E('path',{d:`M${f(l84Q(og.pos)[0])},${f(l84Q(og.pos)[1])}L${f(C2[0])},${f(C2[1])}`,stroke:cal,'stroke-width':1.6,'stroke-linecap':'round'},par);
    E('path',{d:smooth(dome),fill:cal,stroke:shd(cal,-.4),'stroke-width':.35,'stroke-opacity':.5},par);
    if(db)E('path',{d:db,fill:mix(cw.fl,cal,.45)},par);if(dc)E('path',{d:dc,stroke:cal,'stroke-width':1.2,'stroke-linecap':'round'},par);
    if(df){E('path',{d:df,fill:cw.f?cw.fl:cw.fl},par);if(DET>=1.5&&!LOD)E('path',{d:df,fill:'none',stroke:pale?'#8a7a8a':shd(cw.fl,-.4),'stroke-width':.25,'stroke-opacity':.18},par)}}}}
function l84Thy(g,t,o){const cw=fgCw(CW_L84THY,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=.8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l84thy',()=>{const Lt=o.spine?blen(o.spine):22*UPC*(.75+.25*Math.min(1.3,ks)),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.08,.2)),cols=L60_ST(cw.st),lim=g35Lim(o),
      GS={r:.55*UPC*kl,fs:.5*UPC*kl};
    const r=fgGrow(k,A,{li:1.1*UPC*kl,liT:.3,w0:2.6*kl,w1:1.3,cols,uL:2,lp:0,phy:'opp',seg:7,wig:.04,tipLv:0,
      side:{u0:.12,u1:.85,p:.58,len:.42,ang:36,li:.85,e:-.006,pair:1,tilt:22},piece:DET>=1.5?9:16,
      tip:(og,p)=>cw.f&&(lim==null||og.pos[1]>lim+GS.r*2)?l84Glom(og,op,cw,GS):null,
      post:(res,parts)=>l84Thyme(res,parts,cw,{u0:o.spine?.1:.2,sp:.55*UPC*kl,ln:cm0*UPC*kl*(o.spine?.95:1),th:48,fas:1,lim})});
    open(k,t,1000,0,.4);return r})}

/* ---------- registries: drawers, colourways, trade grades in the recipe's unit (the leaf length: the silver tree's leaves, the lamb's ear's, the astelia's swords, the hosta's blade,
   the thyme's tiny leaves), and how the composer treats them: leafy stems along their spine at their natural length; the hosta a big leaf rising on its petiole ---------- */
Object.assign(GH,{'leucadendron-argenteum-arbre-argent':l84Arg,'stachys-byzantina-oreille-ours':l84Sta,'astelia-silver-spear':l84Ast,'hosta-feuilles':l84Hos,'thymus-thym':l84Thy});
Object.assign(CWS,{'leucadendron-argenteum-arbre-argent':CW_L84ARG,'stachys-byzantina-oreille-ours':CW_L84STA,'astelia-silver-spear':CW_L84AST,'hosta-feuilles':CW_L84HOS,'thymus-thym':CW_L84THY});
Object.assign(SZG,{'leucadendron-argenteum-arbre-argent':[9,11,11,14],'stachys-byzantina-oreille-ours':[6,8,8,10],'astelia-silver-spear':[60,70,80,90],'hosta-feuilles':[18,25,25,32],'thymus-thym':[.6,.8,.8,1]});
const L84_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'leucadendron-argenteum-arbre-argent':L84_I(50,{fx:18}),'stachys-byzantina-oreille-ours':L84_I(35,{fx:22}),'astelia-silver-spear':L84_I(70,{fx:12}),'thymus-thym':L84_I(22,{fx:10})});
