/* ---------- core helpers ---------- */
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
/* WILT: while a bouquet element is drawn at Déclin or Fané, the colour filter of its wilt (z1.js); null otherwise */
let WILT=null;
/* TINT: while a bouquet element is drawn, the colour of its depth plane (c5.js); null for the front plane and outside a bouquet */
let TINT=null;
function E(t,a,p){const e=document.createElementNS(NS,t);if(a){if(WILT)a=WILT(a);if(TINT)a=TINT(a);for(const k in a)e.setAttribute(k,a[k])}if(p)p.appendChild(e);return e}
const G=(p,a)=>E('g',a,p);
let seed=11;
function rnd(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
const R=(a,b)=>a+(b-a)*rnd();
const pick=a=>a[Math.floor(rnd()*a.length)];
const MR=(a,b)=>a+(b-a)*Math.random();
const f=n=>Math.round(n*10)/10;
const D=Math.PI/180;

/* ---------- gradients (cached) ---------- */
const defs=$('defs');let gid=0;const gc={};
function stops(g,s){s.forEach((c,i)=>{const o=Array.isArray(c)?c:[i/(s.length-1),c];E('stop',{offset:o[0],'stop-color':o[1],'stop-opacity':o[2]??1},g)})}
function lin(s,x1=0,y1=1,x2=0,y2=0){const k='l'+JSON.stringify(s)+[x1,y1,x2,y2]+(WILT?WILT.key:'')+(TINT?TINT.key:'');if(gc[k])return gc[k];const id='g'+(gid++);stops(E('linearGradient',{id,x1,y1,x2,y2},defs),s);return gc[k]=`url(#${id})`}
function rad(s,cx=.5,cy=.5,r=.5,fx=cx,fy=cy){const k='r'+JSON.stringify(s)+[cx,cy,r,fx,fy]+(WILT?WILT.key:'')+(TINT?TINT.key:'');if(gc[k])return gc[k];const id='g'+(gid++);stops(E('radialGradient',{id,cx,cy,r,fx,fy},defs),s);return gc[k]=`url(#${id})`}
function radU(s,r){const k='u'+JSON.stringify(s)+r+(WILT?WILT.key:'')+(TINT?TINT.key:'');if(gc[k])return gc[k];const id='g'+(gid++);stops(E('radialGradient',{id,cx:0,cy:0,r,gradientUnits:'userSpaceOnUse'},defs),s);return gc[k]=`url(#${id})`}

/* ---------- geometry ---------- */
function bz(P,t){const u=1-t;return[u*u*u*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t*t*t*P[3][0],u*u*u*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t*t*t*P[3][1]]}
/* filled ribbon along a cubic bezier, half-width wf(t) */
function taper(P,wf,n=20){const A=[],B=[];for(let i=0;i<=n;i++){const t=i/n,p=bz(P,t),q=bz(P,Math.min(1,t+.02)),o=bz(P,Math.max(0,t-.02));const dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1,w=typeof wf=='function'?wf(t):wf*(1-t);A.push(f(p[0]-dy/l*w)+','+f(p[1]+dx/l*w));B.push(f(p[0]+dy/l*w)+','+f(p[1]-dx/l*w))}return'M'+A.join('L')+'L'+B.reverse().join('L')+'Z'}
const cp=P=>`M${f(P[0][0])},${f(P[0][1])}C${f(P[1][0])},${f(P[1][1])} ${f(P[2][0])},${f(P[2][1])} ${f(P[3][0])},${f(P[3][1])}`;
/* petals: base at 0,0 pointing up */
const pet=(l,w,r=.6,b=.15)=>`M0,0C${f(w*.9)},${f(-l*b)} ${f(w*1.05)},${f(-l*r)} 0,${f(-l)}C${f(-w*1.05)},${f(-l*r)} ${f(-w*.9)},${f(-l*b)} 0,0Z`;
const rpet=(l,w)=>`M0,0C${f(w*1.3)},${f(-l*.12)} ${f(w*1.25)},${f(-l*1.05)} 0,${f(-l)}C${f(-w*1.25)},${f(-l*1.05)} ${f(-w*1.3)},${f(-l*.12)} 0,0Z`;

/* ---------- timeline engine ---------- */
const tw=[];let T0=0,running=false;
const eo=t=>1-Math.pow(1-t,3);
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eb=t=>{const c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
function tween(t0,d,fn,e=eo){const w={t0,d,fn,e};tw.push(w);fn(0,0);return w}
function tick(now){if(T0<0)T0=now;const t=now-T0;let act=false;for(const w of tw){if(w.done)continue;if(t<w.t0){act=true;continue}const p=Math.min(1,(t-w.t0)/w.d);w.fn(w.e(p),p);if(p>=1)w.done=true;else act=true}if(act)requestAnimationFrame(tick);else{running=false;finished()}}
function play(){tw.forEach(w=>{w.done=false;w.fn(0,0)});T0=-1;if(!running){running=true;requestAnimationFrame(tick)}}
const tr=(x,y,r,s)=>`translate(${f(x)},${f(y)}) rotate(${f(r)}) scale(${Math.max(s,.0001).toFixed(4)})`;
/* whole flower appears at x,y */
/* elements grow in with only a hint of turn: the motion stays light */
function bloom(el,x,y,r,s,t0,d=1200,spin=-25){spin*=.3;tween(t0,d,(e,p)=>el.setAttribute('transform',tr(x,y,r+spin*(1-eo(p)),s*e)),eb);idleAdd({el,k:0,x,y,r,s,a:R(1.2,2.4),b:R(.01,.025)})}
/* inner layer unfolds around its local origin */
function open(el,t0,d=900,spin=20,from=.25){spin*=.3;tween(t0,d,(e,p)=>el.setAttribute('transform',`rotate(${f(spin*(1-eo(p)))}) scale(${(from+(1-from)*e).toFixed(4)})`),eb);idleAdd({el,k:1,a:R(2,4.5),b:R(.012,.035)})}

/* ---------- idle life once everything has bloomed ---------- */
let IA=1;const idle=[];let idleOn=false,idleT0=0,idleLast=0;
/* no more wobbling or breathing flower by flower: only a light breeze through the whole bouquet (whole layers swaying a fraction of a degree around the vase mouth) */
function idleAdd(m){if(m.k!==2||idle.length>=12)return;idle.push(m)}
function breeze(el,x,y,a,lag=0){idleAdd({el,k:2,x,y,a:a*IA,lag})}
function idleTick(now){if(!idleOn)return;requestAnimationFrame(idleTick);if(now-idleLast<33)return;idleLast=now;const t=now-idleT0,ramp=Math.min(1,t/4000);
  for(const m of idle){const u=t-m.lag,w=(.7*Math.sin(u*.000898)+.3*Math.sin(u*.00203+1.3))*Math.min(ramp,Math.max(0,u/4000));
    m.el.setAttribute('transform',`rotate(${(m.a*w).toFixed(3)} ${f(m.x)} ${f(m.y)})`)}}
function startIdle(){if(RM||idleOn)return;idleOn=true;idleT0=performance.now();idleLast=0;requestAnimationFrame(idleTick)}
/* stroke draws itself */
function grow(el,t0,d=900){const L=Math.ceil(el.getTotalLength())+2;el.setAttribute('stroke-dasharray',L+' '+L);tween(t0,d,e=>el.setAttribute('stroke-dashoffset',f(L*(1-e))),eio)}
function fade(el,t0,d=800,dy=20){tween(t0,d,e=>{el.setAttribute('opacity',e.toFixed(3));el.setAttribute('transform',`translate(0,${f(dy*(1-e))})`)})}
