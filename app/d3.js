
/* ================= Atelier v3 — rose de jardin, renoncule, dahlia, œillet ================= */
/* ring of cupped petal edges around the centre (seen from above), local -y points outward */
function cring(par,r,n,w,h,cols,a0,o={}){for(let i=0;i<n;i++){const a=a0+i*360/n+R(-9,9),x=Math.cos(a*D)*r,y=Math.sin(a*D)*r;
  cresc(par,w*R(.86,1.1),h*R(.85,1.15),cols,{tr:`translate(${f(x)},${f(y)}) rotate(${f(a+90)})`,th:o.th,rim:o.rim,rw:o.rw})}}
const deepen=(c,dp,k)=>[mix(c[1],dp,k),mix(c[2],dp,k*.6),mix(c[3],c[2],k*.7),mix(c[3],c[4],.5-k*.4)];

/* ---------- garden rose (David Austin type): broad guard petals, deep cup, quartered heart ---------- */
function xRose(g,t,o){const c=o.c||tones('#f2c6b6'),Rr=o.R||40,k=G(g),dp=o.deep||dk(c[1],.35);
  const gp={prof:sinP(.42,.12),tip:'round',rf:.035,rk:3,cup:-1,sh:.9,base:.55,bl:.44,v:7,vo:.12,vw:.4,rim:.85,rs:.55,rw:1.4,so:.4};
  for(let i=0;i<6;i++)pp(k,Rr*1.02,Rr*.56,c,Object.assign({},gp,{tr:`rotate(${f(i*60+R(-10,10))})`,asym:R(-.1,.1)}));
  for(let i=0;i<6;i++)pp(k,Rr*.86,Rr*.5,c,Object.assign({},gp,{tr:`rotate(${f(i*60+30+R(-10,10))})`,asym:R(-.1,.1)}));
  E('circle',{r:f(Rr*.66),fill:rad([[0,dp],[.62,mix(dp,c[1],.55)],[1,c[1],0]])},k);
  cring(k,Rr*.6,8,Rr*.37,Rr*.12,deepen(c,dp,0),R(0,45),{th:.55,rim:.6,rw:1.1});
  const M=o.n||30;for(let i=0;i<M;i++){const u=i/M,r=Rr*.5*Math.pow(1-u,.85)+R(-1.5,1.5),a=i*137.508+R(-20,20),w=Rr*(.12+.24*(1-u))*R(.85,1.15);
    cresc(k,w,w*R(.3,.42),deepen(c,dp,.12+u*.55),{tr:`translate(${f(Math.cos(a*D)*r)},${f(Math.sin(a*D)*r)}) rotate(${f(a+90+R(-28,28))})`,th:.62,rim:.85,rw:1})}
  if(o.button)E('circle',{r:f(Rr*.09),fill:rad([[0,lt(o.button,.3)],[1,dk(o.button,.35)]],.4,.35,.7)},k);
  open(k,t,1100,16,.3)}

/* ---------- ranunculus: tight concentric layers of tissue-thin petals, optional green eye ---------- */
function xRanunc(g,t,o){const c=o.c||tones('#f07a3a'),Rr=o.R||32,k=G(g),dp=o.deep||dk(c[1],.35);
  const gp={prof:sinP(.45,.1),tip:'round',cup:-1,sh:.8,base:.5,v:9,vo:.14,vw:.35,rim:.9,rw:1.2,so:.35};
  for(let i=0;i<5;i++)pp(k,Rr,Rr*.6,c,Object.assign({},gp,{tr:`rotate(${f(i*72+R(-8,8))})`}));
  E('circle',{r:f(Rr*.82),fill:rad([[0,dp],[.7,mix(dp,c[1],.6)],[1,c[2]]])},k);
  const K=o.rings||10;for(let r=0;r<K;r++){const u=r/K,r0=Rr*.8*Math.pow(1-u,1.05),n=Math.max(5,Math.round(10-r*.5)),w=2*Math.PI*r0/n*.78;
    cring(k,r0,n,w,w*.36,deepen(c,dp,u*.5),r*23+R(-6,6),{th:.78,rim:.55,rw:.75})}
  if(o.eye)E('circle',{r:f(Rr*.1),fill:rad([[0,lt(o.eye,.35)],[1,dk(o.eye,.3)]],.4,.35,.7)},k);
  open(k,t,1000,18,.3)}

/* ---------- decorative dahlia: creased pointed petals in golden-angle whorls, cupped centre ---------- */
function xDahlia(g,t,o){const c=o.c||tones('#8e1a3a'),Rr=o.R||46,k=G(g),N=o.n||64,dp=o.deep||c[0];
  E('circle',{r:f(Rr*.7),fill:rad([[0,dp],[1,c[1]]])},k);
  const P=[];for(let i=0;i<N;i++)P.push({u:Math.sqrt((i+.5)/N),a:i*137.508+R(-4,4)});P.sort((a,b)=>b.u-a.u);
  const pt={prof:sinP(.62,.1),tip:'point',v:1,vo:.4,vw:.6,cup:1,sh:1,base:.55,bl:.4,rim:.55,rs:.5,rw:.9,so:.45};
  for(const p of P){const L=Rr*(.22+.78*p.u)*R(.93,1.04);
    if(p.u>.4){const cc=p.u>.75?c:[c[0],mix(c[1],dp,.2),mix(c[2],c[1],.2),c[3],c[4]];pp(k,L,L*(.3+.08*(1-p.u)),cc,Object.assign({},pt,{tr:`rotate(${f(p.a+90)}) translate(0,${f(-Rr*.1*p.u)})`,bend:R(-.06,.06)}))}
    else{const r0=Rr*p.u*.85,w=L*.42;cresc(k,w,w*.42,deepen(c,dp,.25+(.4-p.u)),{tr:`translate(${f(Math.cos(p.a*D)*r0)},${f(Math.sin(p.a*D)*r0)}) rotate(${f(p.a+90)})`,th:.5,rim:.8,rw:.8})}}
  open(k,t,1100,22,.25)}

/* ---------- carnation: frilled fan petals with toothed rims, optional picotee edge ---------- */
function fanD(L,W,nt){let d=`M0,0C${f(W*.2)},${f(-L*.2)} ${f(W*.6)},${f(-L*.5)} ${f(W)},${f(-L*.86)}`;
  for(let i=0;i<nt;i++){const xt=W-2*W*(i+.5)/nt+R(-.5,.5),xv=W-2*W*(i+1)/nt,arc=Math.sin(Math.PI*(i+.5)/nt),yt=-L*(.93+.07*arc)*R(.97,1.03),yv=-L*(.87+.07*arc)*R(.97,1.01);
    d+=`Q${f(xt)},${f(yt-L*.03)} ${f(xv)},${f(yv)}`}
  return d+`C${f(-W*.6)},${f(-L*.5)} ${f(-W*.2)},${f(-L*.2)} 0,0Z`}
function xCarn(g,t,o){const c=o.c||tones('#eba3b2'),Rr=o.R||30,k=G(g);
  E('circle',{r:f(Rr*.8),fill:dk(c[1],.3)},k);
  [[1,10,.5],[.88,9,.48],[.75,8,.46],[.62,8,.46],[.48,7,.46],[.34,6,.5],[.22,4,.6]].forEach(([s,n,w],ri)=>{const cc=ri>2?[c[0],mix(c[1],c[0],.3),mix(c[2],c[1],.25),c[3],c[4]]:c;
    for(let i=0;i<n;i++){const L=Rr*s*R(.88,1.08),W=L*w*R(.9,1.15);pp(k,L,W,cc,{d:fanD(L,W,11+(i+ri)%4),tr:`rotate(${f(i*360/n+ri*23+R(-12,12))}) translate(0,${f(-Rr*.06*s)})`,tc:o.tc,mp:.55,cup:1,sh:.9,base:.6,bl:.5,rim:.9,rs:.7,rw:.9,so:.25,prof:sinP(.6,.2)})}});
  for(let i=0;i<5;i++){const a=i*72+R(-15,15);cresc(k,Rr*.16,Rr*.09,deepen(c,c[0],.2),{tr:`translate(${f(Math.cos(a*D)*Rr*.05)},${f(Math.sin(a*D)*Rr*.05)}) rotate(${f(a+90)})`,th:.8,rim:.7,rw:.7})}
  open(k,t,950,20,.3)}
