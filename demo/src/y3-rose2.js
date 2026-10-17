/* ---------- y3-rose2.js: the garden rose's heart on the rose kit (svRose, y3-rose.js): quarters and a button eye ----------
   A full cupped rose (garden-look florist roses, garden roses, old roses) does not keep a high furled cone: its many short petals stand in a ball
   inside the cup of the outer ones, and as the head ages the heart parts into quarters (three to five fans of folded petals, a radial furrow
   between them, photographs Toffee, Pierre de Ronsard 191, 196, Augusta Luise 179, 180), sometimes round a button eye (the innermost petals
   tiny and folded in over the centre). Both are a petal hook (svRose's qmod): each petal q is reshaped by its rank f, its place round the head
   and the head's genes (qn quarters, qk strength, qr their turn, eye 0..1), so any rose sort reuses it with its own parameters:
   ROSA_ASP (y-rosa.js, rose-aspect-jardin) now, the rosette garden rose next. */
const SVROSE2_Q={
  /* the ranks that part into quarters (from f0, over fw), how strongly by age: svSm((op + decK.dec - at0)/at1), the bud never */
  f0:.3,fw:.25,at:[.6,.45],decK:.6,
  /* a quarter is a small rosette of its own: its centre at rq x R0 from the axis (on the middle of its sector), its petals set round that centre
     over spread radians (the sector's petals spread round it: the inner ranks closer, r0 x rr), nested round it (conc kept, x conK), each a little
     longer in the quarter's middle (lift), the heart lowered (drop x R0) */
  rq:.26,spread:2.6,rr:.5,conK:1,lift:.25,drop:.06,
  /* the furrow between two quarters (Toffee 149, Pierre de Ronsard 191, 196: a dark radial suture): the petals at a sector's edge (|s| beyond
     furS) sunk by fur x R0 and shortened by furL, so the gap shows the dark depth of the heart */
  fur:0,furL:0,furS:.55,
  /* its petals stand up round their own centre: the angles of the spine blended toward a0q, a1q (radians from the axis) */
  a0q:.32,a1q:-.22,
  /* the button eye: the ranks beyond f (over fw) short (L), folded in over the centre (a1, radians from the axis: negative = inward), low */
  eye:{f:.86,fw:.1,L:.42,a1:-1.15,a0:.05,z:.05,r:.5}};
function svRose2Quarter(o){const Q=Object.assign({},SVROSE2_Q,o||{}),E2=Object.assign({},SVROSE2_Q.eye,(o&&o.eye)||{});
  return(q,c)=>{const g=c.g,f=q.f,nb=1-c.bud;if(nb<=0)return;
    /* the button eye first: its petals are the innermost, a knot of small petals bent in over the centre */
    const ee=(g.eye||0)*svSm((f-E2.f)/E2.fw)*nb;
    if(ee>0){q.L*=1-(1-E2.L)*ee;q.a1=q.a1+(E2.a1-q.a1)*ee;q.a0=q.a0+(E2.a0-q.a0)*ee;q.z0-=c.R0*E2.z*ee;q.r0*=1-E2.r*ee;q.roll*=1-ee;q.conc*=1-.5*ee}
    const k=(g.qk==null?1:g.qk)*svSm((c.op+Q.decK*(c.dec||0)-Q.at[0])/Q.at[1])*svSm((f-Q.f0)/Q.fw)*nb*(1-ee);if(k<=.001)return;
    const n=Math.max(2,g.qn||4),SC=Q.irr&&typeof svRose3Sec==='function'?svRose3Sec(g,n,Q.irr,Q.bend||0):null;let sec=2*Math.PI/n,rot=g.qr||0,rk=1;
    /* irregular quarters (svRose3Sec): this petal's own sector, of its own width */if(SC){const j=SC.at(q.phi);rot=SC.a[j];sec=SC.a[j+1]-SC.a[j];rk=SC.rk[j]}
    let d=(q.phi-rot)%(SC?2*Math.PI:sec);if(d<0)d+=SC?2*Math.PI:sec;d-=sec/2;const s=Math.max(-1,Math.min(1,d/(sec/2))),m=1-Math.abs(s),cq=q.phi-d;
    /* the petal moves to its quarter's centre and turns round it */
    q.phi+=s*(Q.spread-sec/2)*k;q.cx=Math.cos(cq)*c.R0*Q.rq*rk*k;q.cy=Math.sin(cq)*c.R0*Q.rq*rk*k;q.r0*=1-(1-Q.rr)*k;q.conc=Math.min(1,q.conc*(1+(Q.conK-1)*k));
    q.z0-=c.R0*Q.drop*k;if(Q.fur||Q.furL){const e=svSm((Math.abs(s)-Q.furS)/(1-Q.furS))*k;q.z0-=c.R0*Q.fur*e;q.L*=1-Q.furL*e}q.L*=1+Q.lift*k*(m-.35);q.a0+=(Q.a0q-q.a0)*k;q.a1+=(Q.a1q-q.a1)*k}}
