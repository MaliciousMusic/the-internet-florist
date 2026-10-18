/* ================= Pilote : la plante coupée (feuilles engainantes sur la tige du bouquet), pièces génériques =================
   For the cut stems whose leaves clasp the stem low down (tulip, daffodil, hyacinth, iris...): the generic leaf placer of the bouquet (stemLeaves,
   s0.js) spreads n leaves evenly over the visible stem, from just above the mouth (.75 of a leaf length) up to the head: with two leaves, one of
   them sits right under the flower, which no tulip does (its top leaf clasps the stem at a third of its height; the flower stalk above is bare).
   STEML[sid].place = [[f] for one leaf, [f0,f1] for two, ...]: where each leaf clasps the stem, as fractions of the window from its foot (0) to the
   head (1); STEML[sid].low (in leaf lengths, default .75 as before): how far above the mouth that window starts (a leaf that rises from its
   sheath can clasp the stem just above the rim). The leaf function (sl.sv) then also gets {n, f, qs} (how many leaves, this one's fraction, its
   place on the stem path) to give each leaf its own form (the lowest the broadest).
   The bouquet's chance is untouched: the same draws in the same order (n, side, then per leaf R(.92,1.02), R(.8,1.15), R(.8,1.1), R(0,6)), and the
   same early return when the original window is empty. Species without `place` (or with SV off, or without sl.sv) keep the original placer. */
const SVP_LEAVES0=typeof stemLeaves==='function'?stemLeaves:null;
if(SVP_LEAVES0)stemLeaves=function(par,P,sid,yMax,headR,t){const sl=STEML[sid];
  if(!sl||LOD||!sl.place||!sl.sv||sl.arr==='whorl'||sl.arr==='opp'||typeof SV_ON==='undefined'||!SV_ON)return SVP_LEAVES0(par,P,sid,yMax,headR,t);
  const n=Array.isArray(sl.n)?Math.round(R(sl.n[0],sl.n[1])):sl.n||2,L0=(sl.len||10)*UPC;let side=rnd()<.5?-1:1;
  /* the original window decides whether any leaf is drawn (and so whether the draws below happen) */
  const cand=[],own=[],low=sl.low??.75;for(let i=0;i<=40;i++){const q=i/40,p=bz(P,q),far=Math.hypot(p[0]-P[3][0],p[1]-P[3][1])>headR*.9;
    if(p[1]<yMax-L0*.75&&far)cand.push(q);if(p[1]<yMax-L0*low&&far)own.push(q)}if(!cand.length)return;
  const q0=own.length?own[0]:cand[0],q1=cand[cand.length-1],pl=sl.place[Math.min(n,sl.place.length)-1]||[];
  for(let k=0;k<n;k++){const fk=pl[k]??(n===1?.5:k/(n-1)),q=Math.min(q1,q0+(q1-q0)*fk*R(.92,1.02)),p=bz(P,q),p2=bz(P,Math.min(1,q+.02)),ta=Math.atan2(p2[1]-p[1],p2[0]-p[0]);
    const s=side,ang=ta+s*(sl.up||38)*D*R(.8,1.15),len=L0*R(.8,1.1)*(1-.12*k),wr=G(par);R(0,6);sl.sv(wr,p[0],p[1],ang,len,{ta,s,k,j:0,n,f:fk,qs:q});
    growUp(wr,p[0],p[1],Math.max(0,t-300),500);side=-side}};
/* the cut end of a stem drawn alone (plant sheets, GHI[sid].cut): svStemLine's outline is a closed spline, which draws the end of a long simplified
   stem as a spike; the stem is drawn on past its cut and clipped square at it, then the cut face is laid on: a pale disc seen a little from above,
   its rind darker. draw(g,C,W) draws the stem (stemPoly). */
function svStemCut(par,C,W,c,draw){const u0=[C[1][0]-C[0][0],C[1][1]-C[0][1]],l=Math.hypot(u0[0],u0[1])||1,u=[u0[0]/l,u0[1]/l],nn=[-u[1],u[0]],p=C[0],w=W[0],e=w*2,B=1e5,
    id='ct'+(gid++),cp=E('clipPath',{id},GDEF||defs),q=(a,b)=>svF(p[0]+nn[0]*a+u[0]*b)+','+svF(p[1]+nn[1]*a+u[1]*b);
  E('path',{d:'M'+q(B,0)+'L'+q(-B,0)+'L'+q(-B,B)+'L'+q(B,B)+'Z'},cp);
  const g=G(par,{'clip-path':`url(#${id})`});draw(g,[[p[0]-u[0]*e,p[1]-u[1]*e]].concat(C),[w].concat(W));
  E('ellipse',{cx:svF(p[0]),cy:svF(p[1]),rx:svF(w*.5),ry:svF(w*.17),transform:`rotate(${svF(Math.atan2(nn[1],nn[0])*180/Math.PI)} ${svF(p[0])} ${svF(p[1])})`,
    fill:'#d6dcb8',stroke:c[0],'stroke-width':svF(w*.07),'stroke-opacity':.55},par);
  /* section 'hollow' (c.sv.section, opt-in): the hollow in the middle of the cut face, its far inner wall lit */
  if(c.sv&&c.sv.section==='hollow'){const k=c.sv.hollow??.55,hx=w*.5*k,hy=w*.17*k*.85,tf=`rotate(${svF(Math.atan2(nn[1],nn[0])*180/Math.PI)} ${svF(p[0])} ${svF(p[1])})`;
    E('ellipse',{cx:svF(p[0]),cy:svF(p[1]),rx:svF(hx),ry:svF(hy),transform:tf,fill:c.sv.hollowC||'#2f3a2a','fill-opacity':.9},par);
    E('path',{d:'M'+svJ([svR(p[0]-hx*.8),svR(p[1])])+'A'+svJ([svR(hx),svR(hy)])+' 0 0 1 '+svJ([svR(p[0]+hx*.8),svR(p[1])]),transform:tf,fill:'none',stroke:'#c9d2b0','stroke-width':svF(w*.05),'stroke-opacity':.6},par)}
  return g}
