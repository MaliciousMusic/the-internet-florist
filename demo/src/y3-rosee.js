/* ================= La rosée du matin : des gouttes rondes posées sur les faces tournées vers le haut, qui sèchent pendant la première matinée =================
   Lot C1 of decor/CYCLE.md; references and measures in decor/ROSEE-REFERENCES.md.
   svDraw (y1.js) calls svDew on every visible face of every piece it draws (petals, tepals, sepals, leaves): when the dew is 0 it returns at once
   and nothing is written (every drawing stays the same, to the byte). Otherwise it lays drops on the face where the face looks up, as overlays
   clipped to the piece, in a few paths per face, whatever the number of drops:
   - the cast shadow on the tissue, away from the light (a lune: the drop's footprint moved along the light, minus the footprint itself);
   - the dark crescent on the light side (the drop shows the dark studio floor upside down);
   - the gathered light on the far side (the drop is a lens: the tissue under it lighter and more saturated);
   - the contact line (a thin darker outline, on the larger drops);
   - the sparkle (a crisp white point toward the light, weaker on a face in the shade).
   Sizes in real units (UPC), drawn toward the small ones; more and rounder drops on green tissue (leaves, bracts) than on petals.
   Drying: each drop loses its area at a constant rate until it is gone (r^2 = r0^2 (1 - t / its time)), the small ones first, those in the light
   sooner. Its time follows its size rank, not r0^2: by the true law (time ~ r0^2) nine drops in ten would be gone in the first quarter of the
   morning; spread by rank, the number of drops falls steadily through it (decor/ROSEE-REFERENCES.md, Séchage).
   The drops of a face come from its own chance (hashed from its place), never from the bouquet's: rtest unchanged.
   Opt-in only: DEW_SET (0..1, sheets and trials) or DEW_LIFE (the accelerated cycle: the dew follows the bouquet's age, LIFE). Without either,
   no dew anywhere (the shop, the widget and the stage sheets draw as before). */
let DEW_SET=null;
let DEW_LIFE=false;
/* the drops' size scale (1: real size at UPC units per cm; a sheet drawing one head much larger than life sets its own) */
let DEW_K=1;
/* per tissue: coverage of a face looking straight up (share of its area), diameters (cm), sphericity (height / radius), crescent width and
   opacity, shadow opacity, the gathered light's whiteness */
const DEW_DEF={
  leaf:{cov:.14,d:[.04,.4],sph:.85,cw:.5,co:.55,so:.3,gw:.45},
  petal:{cov:.06,d:[.04,.3],sph:.55,cw:.24,co:.42,so:.22,gw:.25}};
/* the bouquet's age in days from its stage (the inverse of lifeAt, z1.js) */
function lifeDays(L){if(!L)return 0;const u=Math.max(0,Math.min(1,L.u||0));return L.stage===0?3*u:L.stage===1?3+17*u:L.stage===2?20+10*u:30+30*u}
/* the dew left at an age in days: whole at dawn, drying through the first morning (gone by about 11 am, the morning starting at 6 am) */
const DEW_MORNING=[.02,.22];
function dewOf(days){return 1-Math.max(0,Math.min(1,(days-DEW_MORNING[0])/(DEW_MORNING[1]-DEW_MORNING[0])))}
/* no dew on the vessel (its reliefs are drawn with svDraw too) nor on what is seen under water through the glass: the three drawers wrapped,
   as y3-plante.js wraps stemLeaves (each still called with the same arguments, in the same order) */
let DEW_OFF=0;
const dewOff=f=>typeof f==='function'?function(...a){DEW_OFF++;try{return f.apply(this,a)}finally{DEW_OFF--}}:f;
if(typeof vessel==='function')vessel=dewOff(vessel);
if(typeof stemsIn==='function')stemsIn=dewOff(stemsIn);
if(typeof stemsBelow==='function')stemsBelow=dewOff(stemsBelow);
function dewNow(){if(DEW_OFF)return 0;if(DEW_SET!=null)return Math.max(0,Math.min(1,DEW_SET));if(DEW_LIFE&&typeof LIFE!=='undefined'&&LIFE)return dewOf(lifeDays(LIFE));return 0}
/* the colour of a face list at v (stops [[v, colour, (opacity)]...]) */
function dewStop(st,v){if(!st||!st.length)return'#808080';if(v<=st[0][0])return st[0][1];for(let i=1;i<st.length;i++)if(v<=st[i][0]){const t=(v-st[i-1][0])/((st[i][0]-st[i-1][0])||1);return mix(st[i-1][1],st[i][1],t)}return st[st.length-1][1]}
const dewGreen=c=>{if(typeof c!=='string'||c[0]!=='#'||c.length!==7)return false;const[h,s]=h2l(c);return h>=55&&h<175&&s>.1};
/* E[d^2] of the size law d = d0 (d1/d0)^(x^2), x uniform (many small drops, a few large) */
function dewMeanD2(d0,d1){let s=0;for(let i=0;i<64;i++){const x=(i+.5)/64,d=d0*Math.pow(d1/d0,x*x);s+=d*d}return s/64}
/* path writing (absolute, 0.1 unit) */
const dwN=x=>svN(svR(x));
const dwP=p=>dwN(p[0])+' '+dwN(p[1]);
const dwRot=e=>Math.round(Math.atan2(e[1],e[0])*180/Math.PI*10)/10;
/* an ellipse: centre c, axes a along e1, b along e2 */
function dwEll(c,e1,a,b){const p=[c[0]-e1[0]*a,c[1]-e1[1]*a],q=[c[0]+e1[0]*a,c[1]+e1[1]*a],A='A'+dwN(a)+' '+dwN(b)+' '+dwRot(e1)+' 1 1 ';return'M'+dwP(p)+A+dwP(q)+A+dwP(p)+'z'}
/* the arc flags from P1 to P2 on a circle (centre C, circle space) passing through F */
function dwFlags(C,P1,F,P2){const a=p=>Math.atan2(p[1]-C[1],p[0]-C[0]),T=2*Math.PI,m=x=>((x%T)+T)%T,a1=a(P1),dF=m(a(F)-a1),d2=m(a(P2)-a1),sw=dF<d2?1:0,span=sw?d2:T-d2;return[span>Math.PI?1:0,sw]}
/* the lune of an ellipse (centre c, axes a e1, b e2) outside the same ellipse moved by t (screen): computed on the unit circle, mapped back */
function dwLune(c,e1,e2,a,b,t){const tx=(t[0]*e1[0]+t[1]*e1[1])/a,ty=(t[0]*e2[0]+t[1]*e2[1])/b,dd=Math.hypot(tx,ty);if(dd<.04)return'';if(dd>=2)return dwEll(c,e1,a,b);
  const ux=-tx/dd,uy=-ty/dd,hh=Math.sqrt(1-dd*dd/4),mx=-ux*dd/2,my=-uy*dd/2,vx=-uy,vy=ux,S=(X,Y)=>[c[0]+e1[0]*a*X+e2[0]*b*Y,c[1]+e1[1]*a*X+e2[1]*b*Y];
  /* circle space: this ellipse at 0, the other at (tx,ty) = -u dd; the lune runs on our circle round its far point u, back on the other's circle */
  const P1=[mx+vx*hh,my+vy*hh],P2=[mx-vx*hh,my-vy*hh],F=[ux,uy],O=[tx,ty],F2=[tx+ux,ty+uy];
  const[l1,s1]=dwFlags([0,0],P1,F,P2),[l2,s2]=dwFlags(O,P2,F2,P1),A=(l,s)=>'A'+dwN(a)+' '+dwN(b)+' '+dwRot(e1)+' '+l+' '+s+' ';
  return'M'+dwP(S(...P1))+A(l1,s1)+dwP(S(...P2))+A(l2,s2)+dwP(S(...P1))+'z'}
/* the candidate drops of one face of a sheet (s: the side seen), where ok(u,v,p) allows: the sheet's own chance (hashed from its base and
   tip), their number from its true area (projected cells over their slant) and the tissue's coverage, kept where the face looks up.
   Returns {D, v} (the drops for dewPaint, their mean v) or null */
function dewSample(sh,s,P,ok){const W=sh.W;let area=0;for(let j=0;j<sh.nv;j++)for(let i=0;i<sh.nu;i++){const q=[j*W+i,j*W+i+1,(j+1)*W+i+1,(j+1)*W+i],pp=q.map(k=>sh.P[k]);let a2=0;
    for(let k=0;k<4;k++){const p=pp[k],r=pp[(k+1)%4];a2+=p[0]*r[1]-r[0]*p[1]}const fz=Math.abs(q.reduce((t,k)=>t+sh.F[k],0)/4);area+=Math.abs(a2/2)/Math.max(.2,fz)}
  const N=Math.min(600,Math.round(P.cov*area/(Math.PI/4*dewMeanD2(P.d[0],P.d[1])*(UPC*DEW_K)**2)));if(N<1)return null;
  const pb=svAt(sh,0,0),pt=svAt(sh,0,1),r=svRng(svSeed('rosee',Math.round(pb[0]/2),Math.round(pb[1]/2),Math.round(pt[0]/2),Math.round(pt[1]/2),sh.nu,sh.nv));
  if(!sh._dn)sh._dn=[0,1,2].map(k=>sh.N.map(n=>n[k]));
  const D=[];let vs=0;
  for(let i=0;i<N;i++){const u=r.in(-.96,.96),v=r.in(.04,.97),x=r(),y=r(),z=r();
    if(s*svLerp(sh,sh.F,u,v)<=.04)continue;
    const n=V3.nz([0,1,2].map(k=>s*svLerp(sh,sh._dn[k],u,v)));if(y>=svSm((n[1]+.05)/.65))continue;
    const c=svAt(sh,u,v);if(ok&&!ok(u,v,c))continue;D.push({c,n,x,z});vs+=v}
  return D.length?{D,v:vs/D.length}:null}
/* the tissue's settings: green tissue (leaves, bracts, sepals) takes the leaf's, unless the material says (m.dew: 'leaf', 'petal' or own keys) */
function dewKind(m,tis){const leaf=m&&m.dew?m.dew==='leaf'||!!m.dew.leaf:dewGreen(tis);return[leaf,Object.assign({},leaf?DEW_DEF.leaf:DEW_DEF.petal,m&&typeof m.dew==='object'?m.dew:null)]}
/* the drops of one visible face drawn by svDraw (it: its region, s its side; cg: its clipped group) */
function svDew(cg,it,sh,front,o){const dew=dewNow();if(!(dew>0)||LOD)return;
  const m=sh.mat||{},st=front?m.stops:m.bstops,[leaf,P]=dewKind(m,dewStop(st,.6)),S=dewSample(sh,it.s,P,null);if(!S)return;
  dewPaint(cg,S.D,P,dew,{tis:dewStop(st,S.v),lit:front?m.lite:m.blite,shd:front?m.shade:m.bshade,cast:m.cast},leaf)}
/* the drops of one run of svrDraw (y3-rosette.js: ranunculus, roses), over its washes: on each piece where the later pieces of the run leave
   it seen (vis) and inside its outline; later runs cover them as they cover the pieces */
function svDewRun(k,run,vis){const dew=dewNow();if(!(dew>0)||LOD)return;
  run.forEach((it,j)=>{if(it.kind!=='pet'||!it.sh)return;const mt=it.mt||{},[leaf,P]=dewKind(mt,it.tone),V=vis[j],
      S=dewSample(it.sh,it.s,P,(u,v,c)=>svLerp(it.sh,V,u,v)>0&&svrIn(it.out,c[0],c[1]));
    if(S)dewPaint(k,S.D,P,dew,{tis:it.tone,lit:it.s>0?mt.lite:mt.blite||mt.lite,shd:it.s>0?mt.shade:mt.bshade||mt.shade,cast:mt.cast},leaf)})}
/* paints drops on a surface, for svDraw and for any kit that samples its own (a leaf drawn without svDraw): D = [{c: screen point on the
   tissue, n: the visible face's unit normal (view space), x: the drop's size quantile 0..1, z: a second chance 0..1}], in a fixed order (the
   drops kept never depend on the amount of dew); P the tissue's settings (DEW_DEF); col {tis, lit, shd, cast} the tissue's colours */
function dewPaint(par,D,P,dew,col,leaf){const d0=P.d[0]*UPC*DEW_K,d1=P.d[1]*UPC*DEW_K,tau=1-dew,Ls=[LIGHT[0],-LIGHT[1]],Lh=Math.hypot(Ls[0],Ls[1])||1,toL=[Ls[0]/Lh,Ls[1]/Lh];
  /* drops never overlap (two that touch become one): a drop that would overlap one already kept is left out, at its full size, so the set
     kept is the same at every amount of dew */
  const keep=[],cell=d1,H=new Map(),key=(i,j)=>i+','+j;
  for(const q of D){const r0=d0/2*Math.pow(d1/d0,q.x*q.x),ci=Math.floor(q.c[0]/cell),cj=Math.floor(q.c[1]/cell);let ok=true;
    for(let di=-1;di<=1&&ok;di++)for(let dj=-1;dj<=1&&ok;dj++)for(const o of H.get(key(ci+di,cj+dj))||[])if(Math.hypot(o.c[0]-q.c[0],o.c[1]-q.c[1])<(o.r0+r0)*1.05){ok=false;break}
    if(!ok)continue;q.r0=r0;keep.push(q);const k=key(ci,cj);(H.get(k)||H.set(k,[]).get(k)).push(q)}
  const sS=[['',1],['',1.7]],sC=[['',.62],['',.36],['',.16]];let dG='',dK='',dR='',nd=0,rs=0;
  for(const q of keep){const n=q.n,nl=V3.dot(n,LIGHT);
    /* drying: each drop goes at its own time through the morning, the small ones first, those in the light sooner; its area falls at a
       constant rate until then (r^2 = r0^2 (1 - tau / its time)) */
    const ti=Math.min(1,(.06+.94*q.x)*(1.15-.32*Math.max(0,nl))*(.9+.2*q.z));if(tau>=ti)continue;const rd=q.r0*Math.sqrt(1-tau/ti);if(rd<.12)continue;
    /* its outline: round when the drop stands high, flattened along the slant of a flat dome; it sits a little up from the tissue */
    const pn=[n[0],-n[1]],pl=Math.hypot(pn[0],pn[1]),e2=pl>.02?[pn[0]/pl,pn[1]/pl]:[0,1],e1=[-e2[1],e2[0]],f=P.sph+(1-P.sph)*Math.abs(n[2]),a=rd,b=rd*f,h=rd*P.sph,
      c=[q.c[0]+e2[0]*.3*h*pl,q.c[1]+e2[1]*.3*h*pl];
    /* the shadow on the tissue, down the light, soft (two lengths); none on a face turned away from the light */
    if(nl>.08){const Lt=V3.add(LIGHT,V3.sc(n,-nl)),k=-.9*h/nl;let sx=Lt[0]*k,sy=-Lt[1]*k;const sl=Math.hypot(sx,sy),mx=1.6*rd,mn=.35*rd;
      if(sl>mx){sx*=mx/sl;sy*=mx/sl}else if(sl<mn&&sl>1e-6){sx*=mn/sl;sy*=mn/sl}
      for(const L of sS){const tx=sx*L[1],ty=sy*L[1];L[0]+=dwLune([q.c[0]+tx,q.c[1]+ty],e1,e2,a,b,[-tx,-ty])}}
    /* the dark band on the light side, darkest at the rim (three nested crescents) */
    for(const L of sC)L[0]+=dwLune(c,e1,e2,a,b,[-toL[0]*P.cw*2*L[1]*rd,-toL[1]*P.cw*2*L[1]*rd]);
    /* the gathered light on the far side, the contact line, the sparkle on the dark band toward the light */
    dG+=dwEll([c[0]-toL[0]*.34*rd,c[1]-toL[1]*.34*rd],e1,a*.58,b*.52);dR+=dwEll(c,e1,a,b);
    const sr=Math.max(.06,.16*rd),so=.5*rd*(.7+.3*f);dK+=dwEll([c[0]+toL[0]*so,c[1]+toL[1]*so],[1,0],sr,sr);nd++;rs+=rd}
  if(!nd)return;
  const g=G(par,{'data-dew':nd,'data-dewk':leaf?'f':'p'}),tis=col.tis,dk=col.shd||mix(tis,'#000000',.6);
  sS.forEach((L,i)=>{if(L[0])E('path',{d:L[0],fill:col.cast||'#1a1030','fill-opacity':P.so*(i?.45:.7)},g)});
  E('path',{d:dG,fill:mix(mix(tis,col.lit||tis,.5),'#fffaf0',P.gw),'fill-opacity':.5},g);
  sC.forEach((L,i)=>E('path',{d:L[0],fill:dk,'fill-opacity':P.co*[.3,.35,.55][i]},g));
  E('path',{d:dR,fill:'none',stroke:dk,'stroke-width':svF(Math.max(.03,rs/nd*.12)),'stroke-opacity':.3},g);
  E('path',{d:dK,fill:'#ffffff','fill-opacity':.95},g)}
/* the drops of flat-drawn petals (y3-branche.js at lod 1: blossoms of the branches): L = [{p: {Sf}, P: the outline on the screen, z, front}],
   drawn far to near before; each petal gets a small sheet of its surface for the drops, kept off its foot (the heart, the calyx) and off the
   petals in front of it. colOf(x): its colours {body, back, shade, lite} */
const dewIn=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
function svDewPetals(par,B,O,L,colOf){const dew=dewNow();if(!(dew>0)||LOD||!L.length)return;const S=L.slice().sort((a,b)=>a.z-b.z);
  S.forEach((x,i)=>{const c=colOf(x),tis=x.front?c.body:c.back||c.body,[leaf,P]=dewKind(null,tis),sh=svSheet(B,O,x.p.Sf,{nu:4,nv:6}),near=S.slice(i+1),
      R=dewSample(sh,x.front?1:-1,P,(u,v,q)=>v>.4&&!near.some(y=>dewIn(y.P,q[0],q[1])));
    if(R)dewPaint(par,R.D,P,dew,{tis,lit:c.lite,shd:c.shade,cast:mix(c.shade||tis,'#000000',.5)},leaf)})}
/* the drops of sheets drawn as plain outlines (a lean level of detail: the bouquet narcissus' florets at level 0): each sheet on the side it
   mostly shows, where keep(u,v,p) allows, in its material's colours */
function svDewSheets(par,sheets,keep){const dew=dewNow();if(!(dew>0)||LOD)return;
  for(const sh of sheets){let sF=0;for(const x of sh.F)sF+=x;const s=sF>=0?1:-1,m=sh.mat||{},st=(s>0?m.stops:m.bstops)||m.stops,[leaf,P]=dewKind(m,dewStop(st,.6)),R=dewSample(sh,s,P,keep);
    if(R)dewPaint(par,R.D,P,dew,{tis:dewStop(st,R.v),lit:s>0?m.lite:m.blite||m.lite,shd:s>0?m.shade:m.bshade||m.shade,cast:m.cast},leaf)}}
