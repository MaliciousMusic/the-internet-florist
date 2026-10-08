
/* ================= structure elements: drapes and lines (the corpus signatures) ================= */
/* hanging amaranthus: velvety chenille of beads along a drooping curve, hangs down (+y) from the origin */
function amaranth(g,t,o){const c=o.c||['#4a0818','#8e1235','#c2385a','#2e0410'],L=o.len||220,k=G(g),sw=o.sway??R(-45,45);
  const P=[[0,0],[sw*.25,L*.32],[sw*.8,L*.68],[sw+R(-18,18),L]],n=Math.round(L/4.4);
  E('path',{d:cp(P),stroke:c[3],'stroke-width':2.4,fill:'none','stroke-linecap':'round'},k);
  /* every seed bead touches the cord: offset never larger than its own radius */
  for(let i=0;i<n;i++){const u=i/n,q=bz(P,u),w=(1-u*.62)*6.8+1.3;
    for(let j=0;j<2;j++){const r=R(.55,1)*w*.56;E('circle',{cx:f(q[0]+R(-1,1)*Math.min(w*.7,r+.8)),cy:f(q[1]+R(-2,u>.9?0:2)),r:f(r),fill:pick([c[0],c[1],c[1],c[2]])},k)}}
  for(let i=0;i<n/3;i++){const u=rnd(),q=bz(P,u),w=(1-u*.62)*6.8+1.3;E('circle',{cx:f(q[0]+R(-1,1)*Math.min(3,w*.45)),cy:f(q[1]),r:1,fill:'#fff',opacity:.22},k)}
  open(k,t,1300,0,0)}
/* garden form: arched stem with three tassels hanging from the top */
function amaranthPlant(g,t,o){const k=G(g);E('path',{d:taper([[0,0],[4,-60],[-6,-120],[10,-165]],u=>3*(1-u*.5)+.6,14),fill:'#4f6a2c'},k);
  for(const[dx,len,sw]of[[10,150,-30],[6,120,25],[12,95,-8]]){const h=G(k,{transform:`translate(${10+dx*.3},-165)`});amaranth(h,t,Object.assign({},o,{len,sway:sw}))}
  for(const s of[-1,1])E('path',{d:petalD(48,13,{tip:'point'}),fill:lin(['#2f4a1c','#5f7f34','#9fb860'],0,1,0,0),transform:`translate(0,-60) rotate(${s*55})`},k)}
/* bare curved line ending in a bud (calla or nerine stems without the bloom) */
function bareLine(g,t,o){const L=o.len||300,b=o.bend??R(-.35,.35),k=G(g),col=o.sc||'#557a36';
  const P=[[0,0],[b*L*.15,-L*.33],[b*L*.6,-L*.66],[b*L*.9,-L]];E('path',{d:taper(P,u=>Math.max(.7,2.4*(1-u*.7)),24),fill:col},k);
  if(o.bud){const e=P[3];E('ellipse',{cx:f(e[0]),cy:f(e[1]-6),rx:3.2,ry:7.5,fill:o.bud,transform:`rotate(${f(b*35)} ${f(e[0])} ${f(e[1])})`},k)}
  open(k,t,1100,0,0)}
/* bear grass: two or three thin blades bent into loops */
function grassLoop(g,t,o){const L=o.len||260,k=G(g),col=o.sc||'#7fae4a',S=o.spine;
  for(let i=0;i<(o.n||3);i++){let d;
    if(S){const a=bang(S,1)*D,tx=Math.sin(a),ty=-Math.cos(a),nx=-ty,ny=tx,w=L*R(.16,.3)*(i%2?1:-1),T=S[3],m=bz(S,R(.4,.6));
      d=`M${f(R(-3,3))},0C${f(S[1][0]+nx*w*.25)},${f(S[1][1]+ny*w*.25)} ${f(T[0]+tx*L*.14+nx*w)},${f(T[1]+ty*L*.14+ny*w)} ${f(m[0]+nx*w*1.2)},${f(m[1]+ny*w*1.2)}`}
    else{const a=R(-.5,.5)*L,b=R(-.6,.6)*L,h=L*R(.75,1.05),e=R(-.45,.45)*L;d=`M${f(R(-4,4))},0C${f(a)},${f(-h)} ${f(b)},${f(-h*1.08)} ${f(e)},${f(-h*R(.25,.5))}`}
    E('path',{d,stroke:i%2?col:'#5f8f34','stroke-width':f(R(1.2,1.9)),fill:'none','stroke-linecap':'round'},k)}
  open(k,t,1100,0,0)}
/* curly willow: wiggling twig with small buds */
function willow(g,t,o){const L=o.len||300,k=G(g),pts=[],S=o.spine,fq=R(4,6);for(let i=0;i<=16;i++){const u=i/16,off=Math.sin(u*Math.PI*fq)*(6+u*16)+R(-3,3);
    if(S){const q=bz(S,u),a=bang(S,u)*D;pts.push([q[0]+Math.cos(a)*off,q[1]+Math.sin(a)*off])}else pts.push([off,-L*u])}
  E('path',{d:smooth(pts,false),stroke:o.sc||'#6b4a2e','stroke-width':2.6,fill:'none','stroke-linecap':'round'},k);
  for(let i=3;i<16;i+=2){const q=pts[i];E('ellipse',{cx:f(q[0]),cy:f(q[1]),rx:1.8,ry:3,fill:'#b7c96a',transform:`rotate(${f(R(-40,40))} ${f(q[0])} ${f(q[1])})`},k)}
  open(k,t,1200,0,0)}
/* allium on a looping stem ('Snakeball' look): sphere of star florets at the end */
function allium(g,t,o){const L=o.len||260,k=G(g),c=o.c||['#5a2a9e','#8f5ad6','#cdb6ff','#3a1670'],lp=R(.35,.6);
  const d=`M0,0C${f(-L*.25)},${f(-L*.35)} ${f(L*.35)},${f(-L*lp)} ${f(L*.1)},${f(-L*(lp+.1))}S${f(-L*.3)},${f(-L*.9)} ${f(L*.05)},${f(-L)}`;
  E('path',{d,stroke:'#5f7f34','stroke-width':2.4,fill:'none','stroke-linecap':'round'},k);
  const h=G(k,{transform:`translate(${f(L*.05)},${f(-L-14)})`});E('circle',{r:15,fill:rad([c[2],c[1],c[0]],.4,.35,.7)},h);
  for(let i=0;i<34;i++){const q=Math.sqrt((i+.5)/34)*14,a=i*137.5*D;E('path',{d:'M0,-3L.9,-.9 3,0 .9,.9 0,3 -.9,.9 -3,0 -.9,-.9Z',fill:i%3?c[2]:c[1],transform:`translate(${f(Math.cos(a)*q)},${f(Math.sin(a)*q)}) rotate(${f(R(0,90))})`},h)}
  open(k,t,1100,0,0)}
