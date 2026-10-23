/* ================= Vessel plan (z7): what a vessel lets a bouquet do — its cavity, mouth and throat, the cone of its stems, how many
   stems it holds, the bouquet it calls for, its free sides, and where a fallen petal comes to rest =================
   Everything is read from what the vessel already knows (prof, h, mo, mh, mx, lipw, mat, sil, SVGB cavb/cavr, vs already applied by
   vScale): nothing is set by hand, a measured override (v.plan) may replace any part. Units are drawing units (UPC = 6.5 per cm), in the
   vessel's frame: y up from the floor, x from the axis (VX). Physics (owner, 2026-10-23): a stem's foot stands on the bottom and the stem
   leans on the lip; how far it can lean comes from the depth and the width inside; where stems cross is not imposed, it follows from
   where their feet stand. */
const VP_WALL={glass:2.6,metal:3.2,gloss:4,satin:4,matte:4.5,stone:5,wood:5},VP_BASE={glass:7,metal:4},VP_PACK=.6,VP_SLIP=35,VP_STEM=2,VP_D=Math.PI/180;
/* a vessel's plan, cached on it (a scaled vessel is another object, hence another plan) */
function vPlan(v){if(!v||!v.prof)return null;if(v._plan)return v._plan;const o=v.plan||{},P=v.prof,sb=v.svgb&&typeof SVGB!=='undefined'?SVGB[v.svgb]:null,k=v.vs||1,
    wall=o.wall??VP_WALL[v.mat]??4,yM=v.mh!=null?v.mh:v.h,mx=v.mx||0,lw=Math.max(1.1,Math.min(v.lipw||3,(v.mo||20)*.14)),rM=Math.max(2,(v.mo||20)-lw);
  /* the bottom: above a solid foot (a footed coupe or a soliflore's pedestal holds water only above its waist), or the measured one */
  const rMax=Math.max(...P.map(p=>p[1]));let hf=0;for(const p of P)if(p[0]<yM*.6&&p[1]<rMax*.45)hf=Math.max(hf,p[0]);
  const yF=o.yF??(sb&&sb.cavb?(FL-sb.cavb)*k:hf+(VP_BASE[v.mat]??5));
  /* the cavity: the smoothed outer profile less the wall, from the bottom (as wide as measured, SVGB cavr) up to the mouth, never wider than the
     lip lets in at the top */
  const S=profSamples(P,120),rIn=y=>Math.max(0,sRad(S,y)-wall),cav=[];
  for(let i=0;i<=48;i++){const y=yF+(yM-yF)*i/48;cav.push([y,i===48?rM:Math.max(.5,i===0&&sb&&sb.cavr?Math.min(rIn(y),sb.cavr*k):rIn(y))])}
  if(o.cav)cav.splice(0,cav.length,...o.cav);
  const rAtIn=y=>{if(y<=cav[0][0])return cav[0][1];for(let i=1;i<cav.length;i++)if(cav[i][0]>=y){const a=cav[i-1],b=cav[i],u=(y-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*u}return rM};
  /* the throat: the narrowest section above the belly (a balustre leans its stems on its neck, not on its lip; a vessel widening to its
     mouth has its mouth for throat); the pinch: the narrowest section anywhere, which every stem passes (the bottom included: feet stand there) */
  let bi=0;for(let i=0;i<cav.length;i++)if(cav[i][1]>=cav[bi][1])bi=i;
  let th=[yM,rM];for(let i=bi;i<cav.length;i++)if(cav[i][1]<th[1])th=cav[i].slice();
  let pinch=th.slice();for(const q of cav)if(q[1]<pinch[1])pinch=q.slice();
  const dep=yM-yF,rF=rAtIn(yF+.5);
  /* the cone: for an entry point u (-1 left edge … 1 right edge of the mouth, centred on mx) the least and greatest tilt (radians, + to the
     right) of a straight stem of radius sr whose foot stands on the bottom and which stays inside the cavity all the way up */
  function coneX(xe,u,sr=VP_STEM){let lo=null,hi=null,fLo=0,fHi=0;
    for(let j=0;j<=80;j++){const xf=-(rF-sr)+2*(rF-sr)*j/80;let ok=true;
      for(let m=1;m<48&&ok;m++){const y=cav[m][0],x=xf+(xe-xf)*(y-yF)/dep;if(Math.abs(x)>cav[m][1]-sr+.01)ok=false}
      if(!ok)continue;const t=Math.atan2(xe-xf,dep);if(lo==null||t<lo){lo=t;fLo=xf}if(hi==null||t>hi){hi=t;fHi=xf}}
    return lo==null?null:{u,xe,lo,hi,fLo,fHi}}
  /* the reach of the entry on each side: under a neck narrower than the lip (a soliflore) the stems cannot lie against the lip, they lean
     on the neck; the entries run from the mouth's centre out to the last point a stem can reach on each side */
  const rE={};for(const sg of[-1,1]){let r=0;for(let k=1;k<=40;k++){const off=(rM-VP_STEM)*k/40;if(!coneX(mx+sg*off,sg))break;r=off}rE[sg]=r}
  const cone=u=>coneX(mx+u*(u<0?rE[-1]:rE[1]),u);
  const CONE=[];for(let i=0;i<=20;i++){const c=cone(-1+i/10);if(c)CONE.push(c)}
  const edgeR=CONE.length?CONE[CONE.length-1].hi:0,edgeL=CONE.length?-CONE[0].lo:0;
  /* the capacity: the throat's section times the share a bundle of round stems fills (VP_PACK, to check on photos of full vases), in stems
     of 4, 6 and 10 mm; area() for a bouquet is the sum of its stems' sections (units²) */
  const capA=Math.PI*pinch[1]*pinch[1]*VP_PACK,capN=mm=>Math.floor(capA/(Math.PI*Math.pow(mm/20*UPC,2)));
  const plan={id:v.id,yF,yM,mx,rM,rE:[rE[-1],rE[1]],lw,wall,D:dep,rF,throat:th,pinch,cav,cone,CONE,edge:[edgeL,edgeR],cap:{area:capA,n4:capN(4),n6:capN(6),n10:capN(10)}};
  plan.rest=(s,f)=>vpRest(plan,s,f);plan.env=vpEnvelope(v,plan);plan.sides=vpSides(v,plan);plan.land=vpLand(v,plan);
  v._plan=plan;return plan}
/* where a stem rests, given its place s in the bundle (-1 … 1, left to right) and how full the throat is (f = the bundle's sections over
   the capacity): a few stems fall against the lip, each as far as the cone lets it; a full throat holds them, graded from upright in the
   middle to leaning at the edge. Returns the entry point, the tilt and the foot, and so where its stem crosses the others */
function vpRest(pl,s,f){const p=Math.max(.15,Math.min(1,f)),a=Math.sign(s)*Math.pow(Math.abs(s),p),i=Math.round((a+1)*10),c=pl.CONE[Math.max(0,Math.min(pl.CONE.length-1,i))];
  if(!c)return null;const full=Math.atan2((pl.rM-pl.throat[1])*Math.sign(a),Math.max(10,pl.yM-pl.throat[0])),
    t0=a>=0?c.hi:c.lo,t=a===0?(c.lo+c.hi)/2:t0*(1-p)+Math.max(c.lo,Math.min(c.hi,full+Math.abs(a)*(t0-full)))*p;
  return{xe:c.xe,t,xf:c.xe-Math.tan(t)*pl.D}}
/* the bouquet a vessel calls for: its height above the lip (1 to 2 times the vessel's larger size, 1.5 the aim), the half width that the
   resting outer stems (s = .8, throat 60 % full) reach at that height, and its class (droit, eventail, dome; cascade allowed when the body below the lip stays inside
   it, so stems may hang without lying on the vessel) */
function vpEnvelope(v,pl){const P=v.prof,big=Math.max(pl.yM,2*Math.max(...P.map(p=>p[1]))),lip=pl.rM+pl.lw,
    below=Math.max(...P.filter(p=>p[0]<pl.yM&&p[0]>pl.yM-.4*pl.yM).map(p=>p[1]).concat([0])),
    a=Math.max(Math.abs(pl.edge[0]),Math.abs(pl.edge[1])),a6=Math.abs((pl.rest(.8,.6)||{}).t||a),H=1.5*big;
  return{h:[big,H,2*big],w:pl.rM+H*Math.tan(a6),fan:a6,fanMax:a,cls:a6<12*VP_D?'droit':a6<30*VP_D?'eventail':'dome',cascade:below<=lip+2}}
/* the sides of the mouth: what rises above the lip on each side (a sculpted vessel's wings, horns, spathe; a turned one rises nowhere),
   in units, and whether that side is free for rim flowers and drapes */
function vpSides(v,pl){const r={'-1':{rise:0,free:true},'1':{rise:0,free:true}};if(!v.sil)return r;
  for(const s of[-1,1]){let m=0;for(let d=pl.rM*.6;d<=pl.rM*2.4;d+=2){const x=VX+pl.mx+s*d,y=FL-vStTop(v.sil,x);if(vStTop(v.sil,x)<FL)m=Math.max(m,y-pl.yM)}
    r[s]={rise:m,free:m<pl.rM*.15}}return r}
/* where a petal let go above the vessel comes to rest, ring by ring of distance rho from the axis (a turned vessel; a sculpted one by its
   true top in the plane of view, sil): into the mouth (lost among the stems), on the lip, on a shoulder gentle enough to hold it (under
   VP_SLIP degrees), or sliding down to the widest point and onto the ground just past it; past the widest point it falls on the ground.
   Each ring [rho, kind, y where it rests, rho where it rests, slope in degrees]. The ground under a belly that overhangs its foot is never
   reached from above: rhoG is the nearest a petal lies on the ground */
function vpLand(v,pl){const P=v.prof,S=profSamples(P,160),R=S.map(q=>q[1]),rWide=Math.max(...R),out=[],step=Math.max(1,rWide/60),top=pl.yM;
  /* the highest height at which the outer body reaches past rho (above the mouth only the lip counts) */
  const hit=rho=>{for(let i=S.length-1;i>=0;i--)if(S[i][0]<=top+.01&&S[i][1]>=rho)return i;return-1};
  for(let rho=0;rho<=rWide+step;rho+=step){if(rho<pl.rM){out.push([rho,'in',pl.yM,rho,0]);continue}
    const i=hit(rho);if(i<0){out.push([rho,'ground',0,rho,0]);continue}
    if(S[i][0]>=top-Math.max(1.5,top/80)){out.push([rho,'lip',S[i][0],rho,0]);continue}
    /* the slope there, from the profile around it (degrees from flat): a shoulder holds it; on a steep side it slides down the body, outward,
       until a gentler slope holds it, or past the widest point onto the ground */
    const sl=i=>{const a=S[Math.max(0,i-2)],b=S[Math.min(S.length-1,i+2)];return Math.atan2(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))/VP_D};
    let j=i;while(j>0&&sl(j)>=VP_SLIP&&S[j-1][1]>=S[j][1]-.05)j--;
    if(sl(j)<VP_SLIP&&S[j][0]>1)out.push([rho,j===i?'shoulder':'slide',S[j][0],S[j][1],sl(j)]);else out.push([rho,'slide',0,rWide+2,sl(i)])}
  return{rings:out,rhoG:rWide+1,rWide,rFoot:P[0][1],KZ:.16}}
/* where a petal dropped at (x, z) (units from the axis, z toward the eye) from a head comes to rest: {kind, x, y (screen), z} */
function vpDrop(pl,x,z){const L=pl.land,rho=Math.hypot(x,z);let q=L.rings[L.rings.length-1];for(const r of L.rings)if(r[0]>=rho){q=r;break}
  if(rho>L.rWide+2)q=[rho,'ground',0,rho,0];const k=q[3]/Math.max(rho,1e-6),X=x*k,Z=z*k;
  return{kind:q[1],x:VX+X,y:FL-q[2]+Z*L.KZ,z:Z}}
/* ---------- the plan at work in the composer (c4) and the drawing (c5) ----------
   VPL: the plan of the vessel being composed and drawn ({pl, edge, fan}), null where stems still pivot at the mouth (held bouquets, pins,
   vessels with several mouths, a vessel without a profile; ?noplan=1 to compare). A stem aimed at angle th (radians from upright, + to the
   right) enters the mouth at a = th / edge of the way to its lip on that side, leaves it as near th as the cone at that point lets it, and
   stands on the bottom straight below, at its foot (vpEntry); farther out than the cone it leaves at the cone's edge and bends above the lip.
   Heads lie at most VP_BEND beyond the cone's edge (fan, which replaces c4's FAN). The plan moves every stem, so it belongs to version 3
   of the composer (c4 CMP_V): a bouquet composed before keeps its drawing with ?cv=2. var, not let: c4 and c5, loaded before this module,
   read these at run time only */
var VPL=null,VP_T0=null;const VP_OFF=typeof location!=='undefined'&&/[?&]noplan=1/.test(location.search||''),VP_BEND=25*VP_D,VP_FANMAX=64*VP_D;
function vpUse(vid){const v=typeof VZ!=='undefined'&&VZ[vid];if(VP_OFF||typeof CMP_V!=='undefined'&&CMP_V<3||!v||!v.prof||['hand','wrap','kenzan'].includes(v.kind)||v.m2&&v.m2.length)return null;
  const pl=vPlan(v);if(!pl||pl.CONE.length<21)return null;const e=Math.max(pl.edge[0],pl.edge[1]);return{pl,edge:pl.edge,fan:Math.tan(Math.min(VP_FANMAX,e+VP_BEND))}}
/* the cone at a (-1 … 1), between the measured entry points */
function vpConeAt(pl,a){const C=pl.CONE,k=Math.max(0,Math.min(C.length-1.001,(a+1)*10)),i=Math.floor(k),u=k-i,c0=C[i],c1=C[i+1];return[c0.lo+(c1.lo-c0.lo)*u,c0.hi+(c1.hi-c0.hi)*u]}
function vpEntry(th){const pl=VPL.pl,e=th>=0?pl.edge[1]:pl.edge[0],a=Math.max(-1,Math.min(1,th/Math.max(e,1e-3))),xe=pl.mx+a*pl.rE[a<0?0:1],[lo,hi]=vpConeAt(pl,a),
    t=Math.max(lo,Math.min(hi,th)),xf=xe-Math.tan(t)*pl.D;return{x:VX+xe,y:FL-pl.yM,t,fx:VX+xf,fy:FL-pl.yF}}
/* c4 baseAt: where a self-carried stem (line, foliage, cluster) enters, its tilt kept in VP_T0 for the spineFor that follows it (one random
   draw, as before, so the rest of the bouquet keeps its numbers) */
function vpBase(BP,th){const q=vpEntry(th*VP_D);VP_T0=q.t;return[q.x+R(-2.5,2.5)*.3,BP[1]-3]}
/* c4 leanP, for a head's stem from just under the mouth (P[0]) to its neck (P[3]): its foot moved to where the cavity puts it, its first
   handle along its tilt there, a third of its chord long. A short stem (a head lying at the lip, its neck already at the mouth: chord under
   20 units) keeps the way it was drawn, the plan taking over as the stem grows to 70 units: forced to the cone's tilt, a short stem would
   have to turn back on itself to meet its neck (qa13 kinks, 2 → 19 on 10 bouquets) */
function vpLean(P){const[a,b,, e]=P,q=vpEntry(Math.atan2(e[0]-a[0],a[1]-e[1])),Lc=Math.hypot(e[0]-a[0],e[1]-a[1]),w=Math.max(0,Math.min(1,(Lc-20)/50)),k=Lc*(.2+.16*w);
  if(w<=0)return P;const x0=q.x-Math.tan(q.t)*(a[1]-q.y),p1=[x0+Math.sin(q.t)*k,a[1]-Math.cos(q.t)*k];
  P[1]=[b[0]+(p1[0]-b[0])*w,b[1]+(p1[1]-b[1])*w];a[0]+=(x0-a[0])*w;return P}
/* v1f stemsIn: through the glass every stem goes on straight in its own direction from under the mouth down to its foot on the bottom (the
   cone keeps it inside the cavity) */
function vpFeet(k,feet,g){const pl=VPL.pl,yf=FL-pl.yF,SG0=['#4f7a36','#5f8a3e','#3f6a2e','#6a8a3a'];
  for(const ft of feet){const[x0,y0]=ft.p,[dx,dy]=ft.d,D1=yf-y0;if(D1<4||dy<=.05*Math.hypot(dx,dy))continue;const x1=Math.max(VX-pl.rF,Math.min(VX+pl.rF,x0+dx/dy*D1)),T0=TINT;TINT=ft.tn||null;
    try{stem3(k,[[x0,y0],[x0+(x1-x0)/3,y0+D1/3],[x0+(x1-x0)*2/3,y0+D1*2/3],[x1,yf]],ft.w,ft.w*.92,ft.c||SG0,10)}finally{TINT=T0}}return g}
