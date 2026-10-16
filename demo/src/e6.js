
/* ================= Espèces vues dans les bouquets de référence et dessinées à la main : sandersonia, ail serpent, branche lichénée ================= */
/* one sandersonia lantern hanging from its pedicel at (x,y): urn body, ribs, six small teeth at the mouth */
function lantern(par,x,y,s,c,rot){const h=17*s,w=13.5*s,l=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(rot)})`});
  const d=`M${f(-w*.08)},0C${f(-w*.3)},${f(h*.1)} ${f(-w*.5)},${f(h*.32)} ${f(-w*.5)},${f(h*.58)}C${f(-w*.5)},${f(h*.84)} ${f(-w*.3)},${f(h*.98)} ${f(-w*.22)},${f(h)}L${f(w*.22)},${f(h)}C${f(w*.3)},${f(h*.98)} ${f(w*.5)},${f(h*.84)} ${f(w*.5)},${f(h*.58)}C${f(w*.5)},${f(h*.32)} ${f(w*.3)},${f(h*.1)} ${f(w*.08)},0Z`;
  E('path',{d,fill:rad([[0,c[3]],[.5,c[2]],[1,c[0]]],.36,.42,.75)},l);
  if(!LOD){E('path',{d:`M0,${f(h*.06)}Q${f(-w*.32)},${f(h*.55)} ${f(-w*.14)},${f(h)}M0,${f(h*.06)}L0,${f(h)}M0,${f(h*.06)}Q${f(w*.32)},${f(h*.55)} ${f(w*.14)},${f(h)}`,stroke:c[0],'stroke-width':.45,'stroke-opacity':.35,fill:'none'},l);
    const tw=w*.44/6;let z=`M${f(-w*.22)},${f(h)}`;for(let i=0;i<6;i++){const x0=-w*.22+i*tw;z+=`L${f(x0+tw/2)},${f(h+1.7*s)}L${f(x0+tw)},${f(h)}`}E('path',{d:z+'Z',fill:c[1],stroke:c[0],'stroke-width':.3},l);
    glint(l,-w*.2,h*.45,w*.12,h*.2,-8,.35)}
  E('path',{d,fill:'none',stroke:c[0],'stroke-width':.5,'stroke-opacity':.5},l)}
/* sandersonia (Sandersonia aurantiaca): arching leafy stem, a lantern at each leaf axil, leaves ending in a tendril */
function xSanders(g,t,o){const c=o.c||tones('#ef9a2a'),L=o.len||300,k=G(g),sw=pick([-1,1])*R(40,70),P=o.spine||[[0,0],[sw*.15,-L*.38],[sw*.6,-L*.74],[sw*1.25,-L]],lc=tones('#5d8a3a');
  stem3(k,o.from?bseg(P,o.from,1):P,3,1.5,['#2c4820','#4c7832','#78a452','#b6d088'],16);
  for(let i=0;i<9;i++){const u=.3+.68*i/8,q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),ta=Math.atan2(q2[1]-q[1],q2[0]-q[0])/D+90,sd=i%2?1:-1,sz=1-.35*u,Lu=46;
    const lg=G(k,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(ta+sd*R(38,58))}) scale(${f(sz)})`});
    leaf3(lg,Lu,5.5,lc,{prof:LPROF.lanceolate[0],nv:3,va:.1,mr:.5,bend:sd*.1});
    E('path',{d:`M0,${f(-Lu)}c${f(sd*1.5)},-5 ${f(sd*7)},-7 ${f(sd*7)},-2.5s${f(-sd*3.5)},3.5 ${f(-sd*4.5)},.5`,stroke:lc[2],'stroke-width':.8,fill:'none','stroke-linecap':'round'},lg);
    if(!i)continue;const bud=u>.86,hx=q[0]+sd*R(12,18)*sz,hy=q[1]+R(7,13),pd=G(k);
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f(q[0]+sd*R(10,15)*sz)},${f(q[1]-R(7,11))} ${f(hx)},${f(hy)}`,stroke:'#4a7030','stroke-width':1.1,fill:'none','stroke-linecap':'round'},pd);
    lantern(pd,hx,hy,bud?.62:R(.92,1.08),bud?tones(mix(c[2],'#9ab060',.55)):c,R(-14,14))}
  open(k,t,1050,0,.5)}
/* ail serpent (Allium sativum var. ophioscorodon, 'Snakeball'): the scape rises, coils once, then ends in a beaked bulbil */
function xSnake(g,t,o){const c=o.c||tones('#8aa860'),S=o.spine,L=S?blen(S):o.len||330,k=G(g),dir=pick([-1,1]),r=Math.min(R(22,30),L*.16),pts=[];
  /* rise along the stem, coil once around a centre set beside the stem, then finish the stem from the end of the coil */
  const B=S||[[0,0],[dir*2,-L*.18],[dir*R(3,10),-L*.36],[dir*R(3,10),-L*.5]],uc=S?.5:1;
  for(let i=0;i<=12;i++)pts.push(bz(B,uc*i/12));
  const A=pts[pts.length-1],ta=bang(B,uc)*D,tx=Math.sin(ta),ty=-Math.cos(ta),nx=-ty*dir,ny=tx*dir,C=[A[0]+nx*r,A[1]+ny*r],a0=Math.atan2(A[1]-C[1],A[0]-C[0]),turn=2*Math.PI*1.08,lift=r*.9/turn;
  for(let i=1;i<=44;i++){const s=turn*i/44,a=a0+dir*s;pts.push([C[0]+r*Math.cos(a)+tx*lift*s,C[1]+r*Math.sin(a)+ty*lift*s])}
  const E0=pts[pts.length-1];let e;
  if(S){const sh=[E0[0]-A[0],E0[1]-A[1]];for(let i=1;i<=10;i++){const q=bz(S,uc+(1-uc)*i/10);pts.push([q[0]+sh[0]*(1-i/14),q[1]+sh[1]*(1-i/14)])}e=pts[pts.length-1]}
  else{const Pv=pts[pts.length-2],dx=E0[0]-Pv[0],dy=E0[1]-Pv[1],tl=Math.hypot(dx,dy)||1,c1=[E0[0]+dx/tl*L*.1,E0[1]+dy/tl*L*.1];e=[E0[0]+dir*L*R(.06,.12),E0[1]-L*R(.16,.22)];
    for(let i=1;i<=10;i++){const u=i/10,a=1-u;pts.push([a*a*E0[0]+2*a*u*c1[0]+u*u*e[0],a*a*E0[1]+2*a*u*c1[1]+u*u*e[1]])}}
  const d='M'+pts.map(q=>f(q[0])+','+f(q[1])).join('L');
  E('path',{d,stroke:dk(c[1],.25),'stroke-width':3.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},k);
  E('path',{d,stroke:c[2],'stroke-width':2.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},k);
  if(!LOD)E('path',{d,stroke:c[3],'stroke-width':.7,'stroke-opacity':.7,fill:'none',transform:'translate(-.6,-.3)'},k);
  const Pv=pts[pts.length-3],ang=Math.atan2(e[1]-Pv[1],e[0]-Pv[0])/D+90,bc=mix(c[3],'#eef0d8',.55),b=G(k,{transform:`translate(${f(e[0])},${f(e[1])}) rotate(${f(ang)})`});
  const bd='M0,1C-5,-2 -5.2,-11 -3.6,-17C-2.4,-21 -1,-24 0,-26C1,-24 2.4,-21 3.6,-17C5.2,-11 5,-2 0,1Z';
  E('path',{d:bd,fill:lin([[0,dk(bc,.18)],[.4,lt(bc,.3)],[1,dk(bc,.3)]],0,0,1,0)},b);
  if(!LOD)E('path',{d:'M-2.2,-3L-1.4,-20M0,-2L0,-23M2.2,-3L1.4,-20',stroke:dk(bc,.35),'stroke-width':.35,'stroke-opacity':.35,fill:'none'},b);
  E('path',{d:'M-.5,-25Q1.8,-34 -.6,-45',stroke:dk(bc,.15),'stroke-width':1.1,fill:'none','stroke-linecap':'round'},b);
  E('path',{d:bd,fill:'none',stroke:dk(bc,.4),'stroke-width':.45,'stroke-opacity':.5},b);open(k,t,1050,0,.45)}
/* branche lichénée: grey twig with a few forks, crusted with pale frilly lichen */
function xLichen(g,t,o){const c=o.c||tones('#b9c4a6'),k=G(g),L=o.spine?blen(o.spine):o.len||360,sw=R(-.16,.16)*L,P=o.spine||[[0,0],[sw*.2,-L*.35],[sw*.6,-L*.7],[sw,-L]],bc='#6c655c',spots=[];
  E('path',{d:taper(P,u=>3.6-2.4*u,14),fill:bc},k);E('path',{d:taper(P.map(q=>[q[0]-1,q[1]]),u=>1-.7*u,12),fill:lt(bc,.3),opacity:.55},k);
  for(let i=0;i<20;i++)spots.push(bz(P,.04+.95*i/20));
  for(let j=0;j<3;j++){const u=R(.3,.78),q=bz(P,u),sd=j%2?1:-1,len=L*R(.18,.32),a=(bang(P,u)+sd*R(30,45))*D,e=[q[0]+Math.sin(a)*len,q[1]-Math.cos(a)*len],m=[q[0]+Math.sin(a-sd*.35)*len*.5,q[1]-Math.cos(a-sd*.35)*len*.5];
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`,stroke:bc,'stroke-width':1.5,fill:'none','stroke-linecap':'round'},k);
    for(let i=1;i<=5;i++){const v=i/5,a=1-v;spots.push([a*a*q[0]+2*a*v*m[0]+v*v*e[0],a*a*q[1]+2*a*v*m[1]+v*v*e[1]])}}
  for(let j=0;j<22;j++)spots.push(bz(P,R(.06,.97)));
  for(const q of spots){const nb=LOD?3:4+Math.floor(R(0,4));for(let i=0;i<nb;i++){const x=q[0]+R(-4.5,4.5),y=q[1]+R(-4.5,4.5),rx=R(3.2,7),ry=rx*R(.45,.8),rt=R(0,180);
    E('ellipse',{cx:f(x),cy:f(y),rx:f(rx),ry:f(ry),transform:`rotate(${f(rt)} ${f(x)} ${f(y)})`,fill:pick([c[2],c[3],mix(c[2],c[4],.4),mix(c[2],c[1],.35)]),stroke:c[1],'stroke-width':.5,'stroke-opacity':.55},k);
    if(!LOD){E('ellipse',{cx:f(x-rx*.15),cy:f(y-ry*.2),rx:f(rx*.55),ry:f(ry*.5),transform:`rotate(${f(rt)} ${f(x)} ${f(y)})`,fill:c[4],opacity:.4},k);if(rnd()<.12)E('circle',{cx:f(x+R(-1,1)),cy:f(y+R(-1,1)),r:.9,fill:'#5a4a3a'},k)}}}
  open(k,t,1100,0,.4)}
/* fustet en plumes (Cotinus coggygria): a few forking stems ending in airy, smoky plumes of fine hairs */
function xSmoke(g,t,o){const c=o.c||tones('#c9a0a6'),L=o.len||170,k=G(g),sw=R(-.1,.1)*L,P=o.spine||[[0,0],[sw*.2,-L*.3],[sw*.6,-L*.55],[sw,-L*.7]],sc='#6a3a2e',lc=tones(mix('#4e3a3e',c[1],.25)),Ls=blen(P);
  E('path',{d:taper(o.from?bseg(P,o.from,1):P,u=>2.2-1*u,10),fill:sc},k);
  for(let i=0;i<3;i++){const u=Math.max(o.from||0,.82-i*.1),q=bz(P,u),sd=i%2?1:-1;leaf3(G(k,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(bang(P,u)+sd*R(40,60))})`}),20,9,lc,{prof:LPROF.round[0],nv:4,mr:.6})}
  const top=bz(P,.86),ea=bang(P,1),tips=[];for(let i=0;i<5;i++){const a=(ea-56+28*i+R(-8,8))*D,len=L*R(.18,.3),e=[top[0]+Math.sin(a)*len,top[1]-Math.cos(a)*len];tips.push(e);
    E('path',{d:`M${f(top[0])},${f(top[1])}Q${f(top[0]+Math.sin(a)*len*.45)},${f(top[1]-Math.cos(a)*len*.62)} ${f(e[0])},${f(e[1])}`,stroke:sc,'stroke-width':.9,fill:'none'},k)}
  for(const e of tips){const rx=R(20,30),ry=rx*R(.75,1),cx=e[0],cy=e[1]-ry*.5;
    E('ellipse',{cx:f(cx),cy:f(cy),rx:f(rx),ry:f(ry),fill:rad([[0,c[3],.6],[.6,c[2],.4],[1,c[2],0]]),opacity:.9},k);
    for(let i=0;i<7;i++){const a=R(0,6.28),rr=R(0,.55);E('circle',{cx:f(cx+Math.cos(a)*rx*rr),cy:f(cy+Math.sin(a)*ry*rr),r:f(rx*R(.32,.55)),fill:pick([c[2],c[3],mix(c[2],c[4],.4)]),opacity:.3},k)}
    let d='';const nh=LOD?18:70;for(let i=0;i<nh;i++){const a=R(0,6.28),rr=Math.sqrt(rnd())*.8,x=cx+Math.cos(a)*rx*rr,y=cy+Math.sin(a)*ry*rr,h=R(3,7),b=R(-.6,.6);d+=`M${f(x)},${f(y)}q${f(Math.cos(a+b)*h*.5)},${f(Math.sin(a+b)*h*.5-1)} ${f(Math.cos(a+b)*h)},${f(Math.sin(a+b)*h)}`}
    E('path',{d,stroke:c[1],'stroke-width':.45,'stroke-opacity':.55,fill:'none'},k);
    if(!LOD){let d2='';for(let i=0;i<40;i++){const a=R(0,6.28),rr=Math.sqrt(rnd())*.7,x=cx+Math.cos(a)*rx*rr,y=cy+Math.sin(a)*ry*rr;d2+=`M${f(x)},${f(y)}h.01`}E('path',{d:d2,stroke:c[4],'stroke-width':1.6,'stroke-linecap':'round','stroke-opacity':.7},k)}}
  open(k,t,1050,0,.4)}
Object.assign(SP,{xSmoke:{form:'grappe',size:1.1,k:'cup',r:38,an:[0,-140],self:170},xSanders:{form:'ligne',size:1,k:'plant',self:300},xSnake:{form:'ligne',size:1,k:'plant',self:330},xLichen:{form:'ligne',size:1,k:'plant',self:360}});
Object.assign(FN,{xSanders,xSnake,xLichen,xSmoke});
