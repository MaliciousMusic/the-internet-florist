
/* ================= Générateur paramétrique : une recette (archétype + paramètres) => une fleur en volume ================= */
const TIPP={round:sinP(.5,.1),point:sinP(.62,.1),notch:sinP(.45,.14),fringe:sinP(.4,.16),teeth:sinP(.42,.14),spoon:t=>.35+.65*Math.sin(Math.PI*Math.min(.97,.15+.85*t))};
const tipFan=tip=>tip==='fringe'?{fan:10,fd:.18}:tip==='teeth'?{fan:6,fd:.12}:tip==='notch'?{fan:2,fd:.16}:{};
const RC=(rec,o)=>(o.cm||rec.cm||6)/2*UPC;
const palR=(rec,o)=>tones(o.col||(rec.cols&&rec.cols[0])||'#e8a0b0');
const discCols=c=>[dk(c,.55),dk(c,.25),c,lt(c,.25)];
function stamensRing(F,Rr,n,len,col,an,z0=0){for(let i=0;i<n;i++){const a=(i*360/n+R(-10,10))*D,l=len*R(.8,1.1);F.parts.push(curvePart(F.B,F.O,[[0,0,z0],[Math.cos(a)*l*.25,Math.sin(a)*l*.25,z0+l*.55],[Math.cos(a)*l*.45,Math.sin(a)*l*.45,z0+l*.9]],.7,col,[.9,1.5,an]))}}
/* ---- radial: single flower, ring(s) of petals and a disc ---- */
function gRadial(g,t,rec,o){const p=rec.p||{},Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),F=fl3(g,o),d=p.disc||{},dr=d.r??.22,n=p.n||8,tip=p.tip||'round',ly=p.layers||1,
    bl=p.blotch?(typeof p.blotch==='string'?p.blotch:mix(dk(c[2],.75),'#1a0820',.55)):0;
  for(let L=0;L<ly;L++){const nn=Math.max(3,Math.round(n*(1-L*.12)));for(let i=0;i<nn;i++){const Lp=Rr*(1-dr*.85)*R(.9,1.05)*(1-L*.1);
    F.parts.push(petalPart(petalGeo(Object.assign({r0:Rr*dr*.85,z0:L*Rr*.03,phi:(i*360/nn+L*180/nn+R(-4,4))*D,L:Lp,W:Lp*(p.w||.3),pf:TIPP[tip]||TIPP.round,a0:F.A((p.a0??78)-L*8),a1:F.A((p.a1??92)-L*8),pw:1.3,cup:p.cup??-.15,n:7},tipFan(tip))),F.B,F.O,c,cb,bl?{vein:1,vc:bl,vw:.9,vo:.7,bc:bl,flat:0}:{vein:1,vo:.14,flat:nn*ly>16}))}}
  const dc=discCols(d.col||rec.c2||'#6a4a1a'),ty=d.type||'dome';
  if(ty!=='none'){F.parts.push(domePart(F.B,F.O,Rr*dr,Rr*.02,Rr*(ty==='cone'?Math.max(.4,d.h??.6):ty==='flat'?.02:ty==='eye'?.05:(d.h??.12)),dc,ty==='eye'?0:Math.round(30+120*dr),{dr:Rr*dr*.12,zb:1}));if(ty==='stamens')stamensRing(F,Rr,18,Rr*dr*1.4,lt(dc[2],.3),dc[0],Rr*.04)}
  bracts(F.parts,F.B,F.O,Rr,Math.min(9,n),.35);drawParts(F.k,F.parts);open(F.k,t,1000,18,.3)}
/* ---- double: many petals in golden-angle whorls (rose, peony, dahlia, carnation, chrysanthemum, camellia…) ---- */
function gDouble(g,t,rec,o){const p=rec.p||{},Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),F=fl3(g,o),N=Math.min(110,p.n||50),tip=p.tip||'round',q=p.quill,fan=p.fan||0;
  const lerp=(a,b,u)=>a+(b-a)*u,dp=mix(dk(c[2],.2),c[2],.35);
  for(let i=0;i<N;i++){const u=Math.sqrt((i+.5)/N),uu=Math.pow(u,1.2),L=Rr*(.2+.8*u)*R(.92,1.05),a0=lerp(p.a0in??8,p.a0out??80,uu),a1=lerp(p.a1in??-12,p.a1out??100,uu);
    const geo=petalGeo(Object.assign({r0:Rr*.06*u,z0:Rr*.34*(1-u*u),phi:(i*137.508+R(-5,5))*D,L,W:q?L*.08:L*(p.w||.45)*(fan?1:1-.25*(1-u)),pf:q?(t=>.45+.55*t):fan?(t=>.12+.88*Math.pow(t,.55)):TIPP[tip]||TIPP.round,a0:F.A(a0),a1:F.A(a1),pw:q?2.4:1.4,cup:q?-1.1:p.cup??-.5,n:7,ruf:p.ruf||0,rk:6},fan?{fan,fd:.12}:tipFan(tip)));
    const pc=tint(c,dp,(1-u)*.35);F.parts.push(petalPart(geo,F.B,F.O,p.outer?tint(pc,p.outer,Math.min(1,u*u*1.15)):pc,p.outer?tint(cb,p.outer,u*.8):cb,{flat:N>20||u<.6,vein:tip==='point'?1:0,vo:.3}))}
  const ce=p.center||'closed';if(ce==='eye'||ce==='button')F.parts.push(domePart(F.B,F.O,Rr*.1,Rr*.38,Rr*.06,discCols(p.eye||rec.c2||'#6a8a2a'),0,{zb:.5}));
  if(ce==='disc')F.parts.push(domePart(F.B,F.O,Rr*.18,Rr*.3,Rr*.1,discCols(p.eye||rec.c2||'#c89a20'),40,{zb:.5}));
  bracts(F.parts,F.B,F.O,Rr,7,.4);drawParts(F.k,F.parts);open(F.k,t,1100,18,.3)}
/* ---- cup: few broad hollow petals (tulip, poppy, hellebore, magnolia, lotus) ---- */
function gCup(g,t,rec,o){const p=rec.p||{},Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),F=fl3(g,o),n=p.n||6,op=p.open??.6;
  for(let i=0;i<n;i++){const inn=i%2,L=Rr*(n<=6?1.15:.95)*R(.95,1.03);F.parts.push(petalPart(petalGeo({r0:Rr*.12,z0:inn?Rr*.03:0,phi:(i*360/n+R(-5,5))*D,L,W:L*(p.w||.6),pf:sinP(.42,.1),a0:(p.a0??(12+50*op))*D*(o.op??1),a1:(p.a1??(4+75*op))*D*(o.op??1),pw:1.25,cup:p.cup??-.65,n:8,ruf:p.ruf||0,rk:4}),F.B,F.O,c,cb,{vein:1,vo:.15}))}
  const ce=p.center||'stamens',cc=rec.c2||'#3a2a20';if(ce==='stamens'){F.parts.push(domePart(F.B,F.O,Rr*.12,Rr*.05,Rr*.12,discCols('#9ab060'),0,{zb:.2}));stamensRing(F,Rr,22,Rr*.35,lt(cc,.4),cc,Rr*.05)}
  else if(ce==='dark')F.parts.push(domePart(F.B,F.O,Rr*.22,Rr*.04,Rr*.14,discCols(cc),40,{zb:.5,dr:Rr*.03}));else if(ce==='pistil')F.parts.push(domePart(F.B,F.O,Rr*.14,Rr*.06,Rr*.25,discCols(cc),0,{zb:.5}));
  drawParts(F.k,F.parts);open(F.k,t,1000,10,.3)}
/* ---- star: tepals in a star or trumpet (lily, amaryllis, alstroemeria, narcissus, clematis…), possibly several heads ---- */
function starHead(F,B,O,Rr,c,cb,p,rec,o){const n=p.n||6,parts=F.parts;
  for(let i=0;i<n;i++){const outer=n===6&&i%2,dots=[];if(p.spots)for(let j=0;j<6;j++)dots.push([R(.12,.55),R(-.5,.5),R(.5,1.1),p.spots]);
    parts.push(petalPart(petalGeo({r0:Rr*.05,phi:((p.ph0||0)+i*360/n+R(-6,6))*D,L:Rr*R(.95,1.03),W:Rr*(p.w||.25)*(outer?.8:1),pf:sinP(.55,.08),a0:F.A(p.a0??28),a1:F.A(p.a1??105),pw:2,cup:-.25,ruf:p.ruf||0,rk:5,n:9}),B,O,c,cb,{vein:1,vc:dk(c[2],.15),vo:.35,dots}))}
  if(p.corona){const cr=p.corona,cc=tones(cr.col||'#f2c230'),L=(cr.cm||2)*UPC;for(let i=0;i<12;i++)parts.push(petalPart(petalGeo({r0:Rr*.08,phi:i*30*D,L,W:L*(cr.w||.35),pf:t=>.6+.4*t,a0:12*D,a1:22*D,cup:-.5,n:5,fan:6,fd:.08,ruf:.12}),B,O,cc,cc,{flat:1}))}
  const ns=p.stamens??6;for(let i=0;i<ns;i++){const a=(i*360/ns+30)*D,L=Rr*R(.5,.62);parts.push(curvePart(B,O,[[0,0,Rr*.05],[Math.cos(a)*L*.3,Math.sin(a)*L*.3,L*.5],[Math.cos(a)*L*.6,Math.sin(a)*L*.6,L*.78]],.9,'#d8dcae',[1.3,3.4,p.anther||'#8a3a12']))}}
function gStar(g,t,rec,o){const p=rec.p||{},Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),k=G(g),Bm=basis(axOf(o),o.roll??R(-3,3)),cl=p.cluster||1,parts=[];
  const F={k,B:Bm,O:[0,0,0],parts,A:opA(o)};if(cl<=1){const ly=p.layers||1,n=p.n||6;
    /* double lilies: inner rings of tepals, smaller, more upright and turned half a step */
    for(let L=0;L<ly;L++)starHead(F,Bm,[0,0,0],Rr*(1-L*.17),c,cb,ly>1?Object.assign({},p,{a0:(p.a0??28)-L*6,a1:(p.a1??105)-L*24,ph0:L*180/n,stamens:L===ly-1?p.stamens:0,corona:L===ly-1?p.corona:null}):p,rec,o);
    drawParts(k,parts);open(k,t,1050,-14,.25);return}
  for(let i=0;i<cl;i++){const a=i/cl*Math.PI*2+R(-.2,.2),el=R(.3,.8),dir=p.nod?V3.nz([Math.cos(a)*.7,-.9+Math.sin(a)*.2,.45]):V3.nz([Math.cos(a)*el,Math.sin(a)*el,1]),O=toV(Bm,V3.sc(dir,Rr*.9)),Bf=subBasis(Bm,dir,R(0,6.28)),r=Rr*R(.7,.85);
    starHead({k,B:Bf,O,parts,A:opA(o)},Bf,O,r,c,cb,p,rec,o);const sc0=rec.stem&&rec.stem.col||'#5f7f3a',mid=PJ(Bm,[0,0,0],V3.sc(dir,Rr*.35));parts.push({z:O[2]-r,fn:par=>E('path',{d:`M0,0Q${f(mid[0])},${f(mid[1])} ${f(O[0])},${f(-O[1])}`,stroke:sc0,'stroke-width':1.8,'stroke-linecap':'round',fill:'none'},par)})}
  drawParts(k,parts);open(k,t,1050,-14,.25)}
/* ---- spathe ---- */
function gSpathe(g,t,rec,o){const p=rec.p||{},kd=p.kind||'anthurium',col=o.col||(rec.cols&&rec.cols[0]);
  if(kd==='anthurium')return x3Anth(g,t,Object.assign({},o,{c:tones(col||'#8e1430'),sp:[lt(rec.c2||'#f3e6c2',.2),rec.c2||'#c9a96a'],cm:o.cm||rec.cm}));
  if(kd==='calla'||kd==='arum'){const c=tones(col||'#eef0dc');return xCalla(g,t,Object.assign({},o,{c,ic:[mix(c[1],c[2],.5),lt(c[2],.3)],nk:'#6f8a3a',sp:rec.c2||'#f0b72a'}))}
  const Rr=RC(rec,o),c=tones(col||'#f6f8f0'),F=fl3(g,o,.4);F.parts.push(petalPart(petalGeo({r0:0,phi:90*D,L:Rr*2,W:Rr*.7,pf:sinP(.55,.05),a0:F.A(18),a1:F.A(30),cup:-.45,n:9}),F.B,F.O,c,backT(c),{vein:1,vo:.2}));
  F.parts.push(curvePart(F.B,F.O,[[0,Rr*.15,Rr*.05],[0,Rr*.35,Rr*.35],[0,Rr*.5,Rr*.55]],Rr*.16,rec.c2||'#efe6b0'));drawParts(F.k,F.parts);open(F.k,t,1000,0,.3)}
/* ---- orchids ---- */
function gOrchid(g,t,rec,o){const p=rec.p||{},kd=p.kind||'phal',col=o.col||(rec.cols&&rec.cols[0])||'#c2387f',c=tones(col),lip=p.lip||rec.c2||dk(col,.35),cm=o.cm||rec.cm;
  if(kd==='cymb')return x3CymbCluster(g,t,Object.assign({},o,{c,lip:[dk(lip,.3),'#fff1df',lip],cm}));
  if(kd==='catt')return cattleya(g,t,Object.assign({},o,{c:[c[1],c[2],c[3],c[0]],lip:[dk(lip,.4),lip,'#ffd23f']}));
  if(kd==='paph')return paphio(g,t,o);if(kd==='onc')return oncidium(g,t,{});
  const sm=kd==='dend'||kd==='mokara'||kd==='ascocenda',r=(cm||(sm?5:kd==='vanda'?10:9))/2*UPC,k=G(g),B=basis(axOf(o),0),n=Math.min(7,p.spray||(sm?6:3)),vein=p.veins||kd==='vanda';
  const pos=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.4,d=i?r*1.35*R(.9,1.1):0;pos.push([Math.cos(a)*d,Math.sin(a)*d*.9,i?-r*.2:r*.1,i?R(.8,.95):1,Math.cos(a)*.35,Math.sin(a)*.3])}
  cl3(k,t,Object.assign({},o,{cm:r*2/UPC,c,lip:[dk(lip,.4),lip,p.spots||'#ffd23f'],ret:vein,vc:dk(col,.35)}),x3Phal,pos.reverse())}
/* convex hull of 2D points (monotone chain) */
function hull2(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}for(const q of p.reverse()){while(up.length>1&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}
  return lo.slice(0,-1).concat(up.slice(0,-1))}
/* ---- globe: florets on a sphere, dome or flat umbel ---- */
function floretParts(parts,fl,B,O,c,cb,r){const a=fl.a||'star',n=fl.n||(a==='star'?6:5);
  if(a==='dot'||a==='ball'){const v=PJ(B,O,[0,0,0]);parts.push({z:v[2],fn:par=>{E('circle',{cx:f(v[0]),cy:f(v[1]),r:f(Math.max(.6,r)),fill:rad([[0,c[3]],[.6,c[2]],[1,c[1]]],.35,.3,.75)},par)}});return}
  const A={star:[50,100,.22],radial:[75,92,.38],cup:[25,50,.5],bell:[12,40,.55],tube:[8,25,.35],lip:[55,95,.45],spike:[5,10,.12],pea:[30,70,.7],double:[20,90,.5]}[a]||[60,95,.3];
  for(let i=0;i<n;i++)parts.push(petalPart(petalGeo({r0:r*.08,phi:(i*360/n+R(-8,8))*D,L:r,W:r*A[2],pf:sinP(.5,.1),a0:A[0]*D,a1:A[1]*D,cup:a==='bell'||a==='cup'?-.5:-.15,n:4}),B,O,c,cb,{flat:1,sw:.3,so:.35}))}
function gGlobe(g,t,rec,o){const p=rec.p||{},Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),k=G(g),Bm=basis(axOf(o),R(0,6.28)),sh=p.shape||'sphere',fl=p.fl||{a:'star'},parts=[];
  if(sh==='ball'){const v=PJ(Bm,[0,0,0],[0,0,0]);E('circle',{cx:0,cy:0,r:f(Rr),fill:rad([[0,c[3]],[.55,c[2]],[1,c[0]]],.36,.32,.75)},k);let d='';const nd=Math.round(Rr*Rr*.35);
    for(let i=0;i<nd;i++){const z=1-2*(i+.5)/nd,rr=Math.sqrt(1-z*z),a=i*137.508*D;if(z<0)continue;const x=Math.cos(a)*rr*Rr*.95,y=Math.sin(a)*rr*Rr*.95,s=.6+.6*z;d+=`M${f(x-s)},${f(y)}a${f(s)},${f(s)} 0 1,0 ${f(2*s)},0a${f(s)},${f(s)} 0 1,0 ${f(-2*s)},0`}
    E('path',{d,fill:lt(c[2],.2),opacity:.5},k);glint(k,-Rr*.35,-Rr*.38,Rr*.3,Rr*.2,-35,.35);open(k,t,900,0,.4);return}
  const n=Math.min(150,p.n||60),fr=(fl.cm||Rr*2/UPC/8)/2*UPC;
  /* florets too small to touch each other (trachelium, tansy, yarrow…) rest on the shaded cushion of the umbel, so none floats loose */
  if(!p.rays){const area=sh==='flat'?Math.PI*Rr*Rr:sh==='dome'?2*Math.PI*(Rr*.82)**2:4*Math.PI*(Rr*.82)**2,gap=Math.sqrt(area/n);
    if(fr<gap*.62){const hp=[];for(let i=0;i<72;i++){const a=i/72*6.283;for(const zz of sh==='flat'?[.2]:sh==='dome'?[0,.5,.9]:[-.9,-.5,0,.5,.9]){const rr2=Math.sqrt(Math.max(0,1-zz*zz));
        const v=sh==='flat'?[Math.cos(a)*Rr*.95,Math.sin(a)*Rr*.95,Rr*.2]:[Math.cos(a)*rr2*Rr*.82,Math.sin(a)*rr2*Rr*.82,zz*Rr*.82];const q=PJ(Bm,[0,0,0],v);hp.push([q[0],q[1]])}}hp.push([0,0]);
      const H=hull2(hp),cu=c[1];parts.push({z:-1e9,fn:par=>{E('path',{d:'M'+H.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:rad([[0,mix(cu,c[2],.5)],[.75,cu],[1,dk(cu,.25)]],.45,.4,.62),'stroke-linejoin':'round',stroke:cu,'stroke-width':f(Math.max(1,fr*.9))},par)}})}}
  for(let i=0;i<n;i++){let dir;if(sh==='flat'){const q=Math.sqrt((i+.5)/n),a=i*137.508*D;dir=[Math.cos(a)*q*.9,Math.sin(a)*q*.9,.15]}else{const z=1-(i+.5)/n*(sh==='dome'?1:1.6),rr=Math.sqrt(Math.max(0,1-z*z)),a=i*137.508*D;dir=[Math.cos(a)*rr,Math.sin(a)*rr,z]}
    const O=toV(Bm,sh==='flat'?[dir[0]*Rr,dir[1]*Rr,Rr*.2]:V3.sc(dir,Rr*.82)),Bf=subBasis(Bm,sh==='flat'?[dir[0]*.3,dir[1]*.3,1]:dir,R(0,6.28));floretParts(parts,fl,Bf,O,i%3?c:tint(c,c[0],.15),cb,fr*R(.85,1.1));
    if(p.rays){const s0=PJ(Bm,[0,0,0],[0,0,-Rr*.3]);parts.push({z:O[2]-fr,fn:par=>E('path',{d:`M${f(s0[0])},${f(s0[1])}L${f(O[0])},${f(-O[1])}`,stroke:'#8aa060','stroke-width':.5,'stroke-opacity':.6},par)})}}
  if(p.bracts){const b=p.bracts,bc=tones(b.col||'#7a9ab0');for(let i=0;i<(b.n||10);i++)parts.push(petalPart(petalGeo({r0:Rr*.5,z0:-Rr*.1,phi:(i*360/(b.n||10))*D,L:(b.cm||Rr*2/UPC*.6)*UPC,W:(b.cm||3)*UPC*.18,pf:sinP(.6,.05),a0:80*D,a1:95*D,cup:-.2,n:5}),Bm,[0,0,0],bc,bc,{flat:1}))}
  drawParts(k,parts);open(k,t,1000,10,.35)}
/* ---- protea family ---- */
function gProtea(g,t,rec,o){const p=rec.p||{},kd=p.kind||'king',Rr=RC(rec,o),c=palR(rec,o),cb=backT(c),F=fl3(g,o),c2=rec.c2||'#f4ece8';
  if(kd==='pin'){F.parts.push(domePart(F.B,F.O,Rr*.35,0,Rr*.3,discCols(dk(c[2],.2)),0,{zb:0}));for(let i=0;i<70;i++){const z=R(.05,1),a=i*137.508*D,rr=Math.sqrt(1-z*z),L=Rr*R(.85,1.05);
      F.parts.push(curvePart(F.B,F.O,[[0,0,Rr*.1],[Math.cos(a)*rr*L*.5,Math.sin(a)*rr*L*.5,z*L*.6],[Math.cos(a)*rr*L,Math.sin(a)*rr*L,z*L*.7+Rr*.15]],1.1,c[2],[1.4,1.4,c2]))}}
  else if(kd==='banksia'||kd==='brunia'||kd==='berzelia'){const n=kd==='banksia'?1:7;for(let i=0;i<n;i++){const a=i/n*6.28,O=n>1?toV(F.B,[Math.cos(a)*Rr*.5,Math.sin(a)*Rr*.5,0]):[0,0,0],r=n>1?Rr*.38:Rr;
      F.parts.push(domePart(F.B,O,r*.9,-r*.2,r*.9,discCols(c[2]),Math.round(r*3),{dr:r*.08,zb:0}))}}
  else{const n=kd==='leucadendron'?14:kd==='serruria'?12:26,a0=kd==='queen'?14:kd==='leucadendron'?20:30,a1=kd==='queen'?24:kd==='leucadendron'?40:44;
    for(let i=0;i<n;i++){const u=i/n,L=Rr*(kd==='leucadendron'?1.2:1)*R(.85,1.05)*(1-.25*(i%2));F.parts.push(petalPart(petalGeo({r0:Rr*.25,z0:-Rr*.1,phi:(i*137.508)*D,L,W:L*(kd==='leucadendron'?.4:.24),pf:sinP(.55,.06),a0:F.A(a0+u*8),a1:F.A(a1+u*10),cup:-.4,n:6}),F.B,F.O,c,cb,{flat:1,vein:1,vo:.25}))}
    F.parts.push(domePart(F.B,F.O,Rr*.32,Rr*.05,Rr*.35,discCols(kd==='leucadendron'?dk(c[2],.4):c2),kd==='leucadendron'?40:90,{dr:Rr*.025,zb:.5}))}
  drawParts(F.k,F.parts);open(F.k,t,1000,8,.3)}
/* ---- exotic heads ---- */
function gExotic(g,t,rec,o){const p=rec.p||{},kd=p.kind||'strelitzia',Rr=RC(rec,o),c=palR(rec,o),cb=backT(c);
  if(kd==='strelitzia')return strelitzia(g,t,{});
  if(kd==='heliconia-erect'||kd==='heliconia-hanging'){const k=G(g),sgn=kd==='heliconia-hanging'?1:-1,n=6;for(let i=0;i<n;i++){const y=sgn*i*Rr*.42,sd=i%2?1:-1,L=Rr*(1-.08*i);
      pp(k,L,L*.28,c,{tr:`translate(${f(sd*2)},${f(y)}) rotate(${f(sgn<0?sd*55:180+sd*55)})`,prof:sinP(.5,.08),tip:'point',cup:1,base:.4,rim:.6,v:1,vo:.3,tc:mix(c[3],rec.c2||'#f2c230',.6)})}
    E('path',{d:`M0,${f(-sgn*Rr*.2)}L0,${f(sgn*n*Rr*.42)}`,stroke:'#6a7a3a','stroke-width':2,fill:'none'},k);open(k,t,900,0,.3);return}
  if(kd==='lotus-pod'){const k=G(g);E('path',{d:`M${f(-Rr)},${f(-Rr*.2)}Q0,${f(-Rr*.45)} ${f(Rr)},${f(-Rr*.2)}L${f(Rr*.35)},${f(Rr*.7)}L${f(-Rr*.35)},${f(Rr*.7)}Z`,fill:lin([dk(c[2],.2),c[2],lt(c[2],.2)],0,0,1,0)},k);
    E('ellipse',{cx:0,cy:f(-Rr*.25),rx:f(Rr),ry:f(Rr*.28),fill:c[3]},k);for(let i=0;i<14;i++){const a=i*137.5*D,q=Math.sqrt(i/14)*Rr*.75;E('ellipse',{cx:f(Math.cos(a)*q),cy:f(-Rr*.25+Math.sin(a)*q*.28),rx:f(Rr*.08),ry:f(Rr*.04),fill:c[0]},k)}open(k,t,900,0,.4);return}
  if(kd==='cotton'){const k=G(g);for(const[x,y]of[[-.3,0],[.3,0],[0,-.35],[0,.3]])E('circle',{cx:f(x*Rr),cy:f(y*Rr),r:f(Rr*.42),fill:rad([[0,'#ffffff'],[.7,'#f2efe8'],[1,'#d8d2c4']],.4,.35,.7)},k);for(let i=0;i<4;i++)pp(k,Rr*.7,Rr*.2,tones('#6a4a2a'),{tr:`rotate(${i*90+45})`,prof:sinP(.5,.1),tip:'point',cup:1,base:.4});open(k,t,900,0,.4);return}
  /* ginger, torch ginger, pineapple, kangaroo paw: cone of waxy bracts */
  const F=fl3(g,o);for(let i=0;i<30;i++){const u=i/30,L=Rr*(.4+.6*(1-u))*R(.9,1.05);F.parts.push(petalPart(petalGeo({r0:Rr*.15*(1-u),z0:Rr*1.4*u,phi:(i*137.508)*D,L,W:L*.5,pf:sinP(.45,.1),a0:F.A(kd==='torch-ginger'?(30+50*(1-u)):(10+25*(1-u))),a1:F.A(kd==='torch-ginger'?(50+50*(1-u)):(18+30*(1-u))),cup:-.5,n:6}),F.B,F.O,tint(c,c[0],u*.2),cb,{flat:1}))}
    /* the green core of the cone, where the stem enters */F.parts.push(Object.assign(curvePart(F.B,F.O,[[0,0,-Rr*.12],[0,0,Rr*.2],[0,0,Rr*.42]],Rr*.32,'#4f7a34'),{z:PJ(F.B,F.O,[0,0,-Rr*.12])[2]-1}));
  drawParts(F.k,F.parts);open(F.k,t,1000,0,.3)}
