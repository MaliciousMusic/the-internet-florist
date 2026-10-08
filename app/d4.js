
/* ================= Atelier v3 — chrysanthème araignée, nérine, gloriosa, pois de senteur, scabieuse, delphinium, lys, allium ================= */
/* ---------- spider chrysanthemum: tubular quills ending in hooks, curled centre ---------- */
function xMum(g,t,o){const c=o.c||tones('#c98ab8'),Rr=o.R||46,k=G(g),N=o.n||54;
  E('circle',{r:f(Rr*.34),fill:rad([[0,c[0]],[1,c[1]]])},k);
  const P=[];for(let i=0;i<N;i++)P.push({u:.45+.55*Math.sqrt((i+.5)/N),a:i*137.508+R(-6,6)});P.sort((a,b)=>b.u-a.u);
  for(const p of P){const L=Rr*p.u*R(.82,1.06),b=R(-.18,.18)*L,tr=`rotate(${f(p.a+90)}) translate(0,${f(-Rr*.1)})`,Q=[[0,0],[b*.2,-L*.35],[b*.7,-L*.72],[b,-L]],w0=1.2,w1=2.3;
    E('path',{d:taper(Q,u=>w0+(w1-w0)*u,10),fill:lin([[0,c[1]],[.5,c[2]],[1,c[3]]],0,1,0,0),stroke:c[0],'stroke-width':.35,'stroke-opacity':.45,transform:tr},k);
    E('path',{d:`M${f(b+w1*.6)},${f(-L+1)}c${f(w1*.4)},${f(-w1*1.6)} ${f(-w1*2.2)},${f(-w1*1.8)} ${f(-w1*1.6)},${f(w1*.4)}`,stroke:c[3],'stroke-width':f(w1*1.1),fill:'none','stroke-linecap':'round',transform:tr},k);
    E('path',{d:`M${f(b*.3-.4)},${f(-L*.3)}L${f(b*.85-.4)},${f(-L*.85)}`,stroke:c[4],'stroke-width':.5,'stroke-opacity':.5,transform:tr},k)}
  for(let i=0;i<34;i++){const u=Math.sqrt((i+.5)/34),a=i*137.5+R(-10,10),r=Rr*.32*u,w=3+u*4.5;cresc(k,w,w*.55,deepen(c,c[0],.15+.4*(1-u)),{tr:`translate(${f(Math.cos(a*D)*r)},${f(Math.sin(a*D)*r)}) rotate(${f(a+90+R(-20,20))})`,th:.7,rim:.6,rw:.8})}
  open(k,t,1100,24,.2)}

/* ---------- nerine: umbel of wavy, recurved, glittering florets with long stamens ---------- */
function nerFloret(par,c,s,rot,tilt){const h=G(par,{transform:`rotate(${f(rot)}) scale(${f(s)},${f(s*tilt)})`});
  for(let i=0;i<6;i++)pp(h,26,4.4,c,{tr:`rotate(${f(i*60+R(-12,12))})`,prof:sinP(.35,.08),tip:'point',rf:.16,rk:9,bend:R(-.25,.25),v:1,vo:.35,vw:.4,sh:.8,base:.4,rim:.8,rs:.4,rw:.7,so:.4});
  for(let i=0;i<6;i++){const a=(-90+R(-40,40))*D,l=R(24,32);stamen(h,0,0,Math.cos(a)*l,Math.sin(a)*l,lt(c[2],.25),'#5a2a30',1.4,.6)}
  dust(h,10,14,14,.7)}
function xNerine(g,t,o){const c=o.c||tones('#e8507a'),k=G(g),n=o.n||8;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R(-.2,.2),r=R(10,22),x=Math.cos(a)*r,y=Math.sin(a)*r*.75-4;E('path',{d:`M0,14Q${f(x*.4)},${f(y*.4+8)} ${f(x)},${f(y)}`,stroke:'#6a7a3a','stroke-width':1,fill:'none'},k);
    nerFloret(G(k,{transform:`translate(${f(x)},${f(y)})`}),c,R(.8,1),Math.atan2(y,x)/D+90+R(-20,20),R(.55,1))}
  open(k,t,1000,16,.3)}

/* ---------- gloriosa: six wavy tepals swept up like flames, bicolour, spidery stamens ---------- */
function xGlor(g,t,o){const c=o.c||['#4a0410','#a80c2a','#e0203e','#ff6a5a','#ffd23f'],ed=o.edge||'#f5c518',k=G(g);
  for(const a of[-62,62,-38,38,-14,14]){const L=R(40,46),b=(a<0?-1:1)*R(.18,.3);
    const pg=pp(k,L,6.8,c,{tr:`rotate(${f(a*.85)})`,prof:sinP(.45,.12),tip:'point',rf:.16,rk:10,bend:b,bc:mix(ed,c[2],.25),mp:.35,v:3,vo:.25,vw:.35,cup:1,sh:.8,base:.2,rim:0,so:.35});
    E('path',{d:petalD(L,6.8,{prof:sinP(.45,.12),tip:'point',rf:.16,rk:10,bend:b}),fill:'none',stroke:ed,'stroke-width':1.5,'stroke-opacity':.85},pg)}
  for(let i=0;i<6;i++){const a=(160+i*44+R(-8,8))*D,l=R(26,32),x=Math.cos(a)*l,y=Math.sin(a)*l*.55+10;stamen(k,0,6,x,y,'#c8b060','#7a5a10',2,.9)}
  E('path',{d:'M0,6Q-2,16 8,22L26,24',stroke:'#9aa858','stroke-width':1.2,fill:'none','stroke-linecap':'round'},k);
  open(k,t,1000,-14,.3)}

/* ---------- sweet pea: ruffled standards and wings along a curving stem with a tendril ---------- */
function peaFloret(par,c,s){const h=G(par,{transform:`scale(${f(s)})`});
  pp(h,25,15,c,{prof:sinP(.38,.22),tip:'notch',rf:.12,rk:5,v:5,vo:.14,vw:.4,cup:1,sh:.6,base:.45,bl:.4,rim:.9,rs:.5,rw:1.2,so:.35});
  for(const sd of[-1,1])pp(h,14,9,[c[0],c[1],mix(c[2],c[1],.3),c[3],c[4]],{tr:`translate(${sd*3},2) rotate(${sd*125})`,prof:sinP(.5,.15),tip:'round',rf:.08,rk:6,v:4,vo:.2,cup:1,base:.4,rim:.7,so:.4});
  E('path',{d:'M-4,7Q0,13 4,7Q0,10 -4,7Z',fill:lt(c[2],.45),stroke:c[0],'stroke-width':.4,'stroke-opacity':.4},h)}
function xPea(g,t,o){const c=o.c||tones('#b79ae0'),k=G(g),P=[[0,46],[R(-6,6),18],[R(-10,10),-10],[R(-6,6),-38]];
  stem3(k,P,2.6,1.6,['#2e4a20','#4f7a34','#7aa850','#c0dc8a']);
  E('path',{d:`M${f(P[2][0])},${f(P[2][1])}c8,-4 14,-12 10,-18s-9,-2 -6,3s7,2 7,-3`,stroke:'#6a9a44','stroke-width':.8,fill:'none'},k);
  [[.95,-1,1],[.7,1,.92],[.45,-1,.84],[.2,1,.7]].forEach(([u,sd,s])=>{const q=bz(P,1-u);const x=q[0]+sd*10*s,y=q[1]-6;
    E('path',{d:`M${f(q[0])},${f(q[1])}Q${f(q[0]+sd*4)},${f(q[1]-2)} ${f(x)},${f(y+6)}`,stroke:'#4f7a34','stroke-width':1,fill:'none'},k);peaFloret(G(k,{transform:`translate(${f(x)},${f(y)}) rotate(${f(sd*R(10,25))})`}),c,s)});
  open(k,t,1000,10,.3)}

/* ---------- scabiosa: ruffled skirt of florets around a domed pincushion with white pins ---------- */
function xScab(g,t,o){const c=o.c||['#12020a','#2e0818','#4e1028','#74284a','#b06a88'],ce=o.ce||['#1a0610','#3a0c20','#6a1a38'],Rr=o.R||26,k=G(g);
  for(let i=0;i<15;i++)pp(k,Rr*R(.92,1.05),Rr*.34,c,{tr:`rotate(${f(i*24+R(-6,6))})`,prof:sinP(.4,.25),tip:'notch',rf:.12,rk:6,v:5,vo:.25,vw:.35,cup:-1,base:.5,rim:.8,rs:.55,so:.4});
  for(let i=0;i<10;i++)pp(k,Rr*.68,Rr*.26,c,{tr:`rotate(${f(i*36+12+R(-6,6))})`,prof:sinP(.45,.2),tip:'notch',rf:.1,rk:5,v:3,vo:.25,cup:-1,base:.55,rim:.7,so:.4});
  E('circle',{r:f(Rr*.46),fill:rad([[0,ce[2]],[.7,ce[1]],[1,ce[0]]],.4,.35,.7)},k);
  let d1='',d2='';for(let i=0;i<70;i++){const q=Math.sqrt((i+.5)/70)*Rr*.42,a=i*137.508*D,x=Math.cos(a)*q,y=Math.sin(a)*q,r=1.25-q/Rr;
    d1+=`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;if(i%2)d2+=`M${f(x-.45)},${f(y-1)}a.45,.45 0 1,0 .9,0a.45,.45 0 1,0 -.9,0`}
  E('path',{d:d1,fill:ce[2],stroke:ce[0],'stroke-width':.3},k);E('path',{d:d2,fill:o.pin||'#f4ecf0'},k);glint(k,-Rr*.15,-Rr*.18,Rr*.16,Rr*.1,-30,.25);
  open(k,t,950,16,.3)}

/* ---------- delphinium: tapering spike of spurred florets with bee centres, buds on top (grows up) ---------- */
function delFloret(par,c,s,bee){const h=G(par,{transform:`scale(${f(s)})`});
  for(let i=0;i<5;i++)pp(h,11,7,c,{tr:`rotate(${f(i*72+R(-8,8))})`,prof:sinP(.5,.15),tip:'round',v:5,vo:.22,vw:.35,cup:-1,sh:.7,base:.35,rim:.7,so:.35});
  for(let i=0;i<4;i++)E('ellipse',{cx:f(Math.cos(i*1.57+.78)*1.8),cy:f(Math.sin(i*1.57+.78)*1.8),rx:1.8,ry:2.6,fill:bee,transform:`rotate(${i*90+45} ${f(Math.cos(i*1.57+.78)*1.8)} ${f(Math.sin(i*1.57+.78)*1.8)})`},h)}
function xDelph(g,t,o){const c=o.c||tones('#8ea8e4'),bee=o.bee||'#2e2440',L=o.len||230,k=G(g),sw=R(-18,18),P=o.spine||[[0,0],[sw*.2,-L*.35],[sw*.6,-L*.7],[sw,-L]],uD=o.spine?Math.max(.3,1-160/blen(P)):.3;
  stem3(k,P,4,2,['#22381c','#3e6030','#6a904e','#b4d08a']);const n=o.n||16;
  for(let i=n+4;i>=0;i--){const u=uD+(.98-uD)*i/(n+4),q=bz(P,u),side=[-1,1,0][i%3],s=1.15-.6*i/(n+4),ta=bang(P,u)*D,nx=Math.cos(ta),ny=Math.sin(ta);
    if(i>=n){const r=3.6-(i-n)*.5,od=Math.min(4,r*.7);E('path',{d:`M${f(q[0])},${f(q[1])}L${f(q[0]+nx*side*od)},${f(q[1]+ny*side*od)}`,stroke:'#4a6a34','stroke-width':.9},k);obud(k,q[0]+nx*side*od,q[1]+ny*side*od,r,side*20,mix(c[2],'#9ab070',.45));continue}
    const x=q[0]+nx*side*10*s,y=q[1]+ny*side*10*s+R(-3,3);E('path',{d:`M${f(q[0])},${f(q[1])}L${f(x)},${f(y)}`,stroke:'#4a6a34','stroke-width':.9},k);
    if(side)E('path',{d:`M${f(x)},${f(y)}l${f(-side*9*s)},${f(-7*s)}`,stroke:c[1],'stroke-width':f(3.4*s),'stroke-linecap':'round'},k);
    delFloret(G(k,{transform:`translate(${f(x)},${f(y)}) scale(${side?.72:1},1) rotate(${f(R(-20,20))})`}),c,s,bee)}
  open(k,t,1100,0,.5)}

/* ---------- oriental lily: recurved wavy tepals, nectary groove, papillae, spots, T anthers ---------- */
function xLily(g,t,o){const c=o.c||tones('#d8306a'),Rr=o.R||50,k=G(g),sp=o.sp,pa=o.pap;
  const tp=(a,w)=>{const L=Rr*R(.95,1.05),gg=pp(k,L,w,c,{tr:`rotate(${f(a)})`,prof:sinP(.55,.06),tip:'point',rf:.07,rk:6,bend:R(-.1,.1),tc:o.tc,mp:.5,v:7,vo:.15,vw:.4,cup:1,sh:.9,base:.3,rim:.85,rs:.55,rw:1.2,so:.45,sp});
    E('path',{d:`M0,-2Q.6,${f(-L*.2)} 0,${f(-L*.42)}`,stroke:o.nec||'#a8c050','stroke-width':2.2,'stroke-opacity':.85,fill:'none','stroke-linecap':'round'},gg);
    if(pa){let d='';for(let i=0;i<16;i++){const tt=R(.06,.36),x=R(-w*.45,w*.45)*(1-tt),y=-L*tt;d+=`M${f(x-.7)},${f(y)}a.7,.9 0 1,0 1.4,0a.7,.9 0 1,0 -1.4,0`}E('path',{d,fill:pa,opacity:.85},gg)}};
  for(let i=0;i<3;i++)tp(i*120+60+R(-6,6),Rr*.2);for(let i=0;i<3;i++)tp(i*120+R(-6,6),Rr*.28);
  E('circle',{r:4,fill:o.nec||'#a8c050'},k);
  for(let i=0;i<6;i++){const a=(i*60+30+R(-12,12))*D,l=Rr*R(.55,.68),x=Math.cos(a)*l,y=Math.sin(a)*l;E('path',{d:`M0,0Q${f(x*.5+R(-4,4))},${f(y*.5+R(-4,4))} ${f(x)},${f(y)}`,stroke:'#d8dcae','stroke-width':1.1,fill:'none'},k);
    E('ellipse',{cx:f(x),cy:f(y),rx:1.6,ry:5,fill:o.an||'#8a3a12',transform:`rotate(${f(a/D)} ${f(x)} ${f(y)})`},k)}
  const sa=R(0,6.28),sl=Rr*.7;E('path',{d:`M0,0Q${f(Math.cos(sa)*sl*.5)},${f(Math.sin(sa)*sl*.5)} ${f(Math.cos(sa)*sl)},${f(Math.sin(sa)*sl)}`,stroke:'#c8d49a','stroke-width':1.6,fill:'none'},k);
  E('circle',{cx:f(Math.cos(sa)*sl),cy:f(Math.sin(sa)*sl),r:3,fill:o.stg||'#7a6a3a'},k);
  open(k,t,1100,-18,.25)}

/* ---------- round allium: shaded sphere of six-pointed florets on a straight stem (grows up) ---------- */
function xAllium(g,t,o){const c=o.c||tones('#7a3cc0'),L=o.len||240,Rr=o.R||(o.cm?o.cm*UPC/2/1.25:24),k=G(g),sw=R(-14,14),P=o.spine||[[0,0],[sw*.1,-L*.4],[sw*.5,-L*.75],[sw,-L]],ea=bang(P,1)*D;
  stem3(k,o.from?bseg(P,o.from,1):P,3.4,2.6,['#2a4220','#4a7034','#76a052','#bcd690']);const h=G(k,{transform:`translate(${f(P[3][0]+Math.sin(ea)*Rr*.8)},${f(P[3][1]-Math.cos(ea)*Rr*.8)})`});
  E('circle',{r:f(Rr),fill:rad([[0,c[3]],[.55,c[2]],[1,c[0]]],.38,.34,.72)},h);
  const st='M0,-3L.8,-.8 3,0 .8,.8 0,3 -.8,.8 -3,0 -.8,-.8Z';let pts=[];
  for(let i=0;i<170;i++){const z=1-2*(i+.5)/170,r=Math.sqrt(1-z*z),a=i*137.508*D,x=Math.cos(a)*r,y=Math.sin(a)*r;if(z<-.15)continue;pts.push([x,y,z])}
  pts.sort((a,b)=>a[2]-b[2]);for(const[x,y,z]of pts){const lgt=(.6-x*.35-y*.35)*(.5+z*.5);E('path',{d:st,fill:mix(c[1],c[4],Math.max(0,Math.min(1,lgt))),transform:`translate(${f(x*Rr*.96)},${f(y*Rr*.96)}) rotate(${f(R(0,60))}) scale(${f((.55+.4*z)*Rr/24)})`},h)}
  glint(h,-Rr*.35,-Rr*.38,Rr*.3,Rr*.2,-35,.3);open(k,t,1000,0,.5)}
