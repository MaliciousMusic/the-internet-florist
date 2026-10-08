/* ================= Serre : moteur des fleurs v2 — surfaces courbes en 3D, nuancier peint, ombres entre les pièces, col de tige ================= */
/* colour: shades that shift hue like paint (shadows deeper and cooler, lights warmer and paler); whites shade to a soft cool grey, never to mud */
const h2l=c=>{const[r,g,b]=hx(c).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx>mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=(mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4)*60}return[h,s,l]};
const l2h=(h,s,l)=>{h=((h%360)+360)%360;s=Math.max(0,Math.min(1,s));l=Math.max(0,Math.min(1,l));const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h/60%2-1)),m=l-c/2,[r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return hs([(r+m)*255,(g+m)*255,(b+m)*255])};
/* k<0 toward shadow, k>0 toward light (−1..1) */
function shd(c,k){const[h,s,l]=h2l(c);
  if(k<0){const a=-k,chroma=s*(1-Math.abs(2*l-1));if(l>.78&&chroma<.24||s<.08){const cool=l2h(s>.04?h+(h>35&&h<110?10:0):40,.05+.14*Math.min(1,s*2),l*(1-.5*a));return mix(c,cool,Math.min(1,a*1.05))}
    const dh=h>=18&&h<70?-13:h>=70&&h<190?15:h>=190&&h<290?9:-9;return l2h(h+dh*a,Math.min(1,s*(1+.22*a))*(l<.22?1-.25*a:1),l*(1-.64*a))}
  return l2h(h+(s>.15?(h>=65&&h<200?-7:h>=200&&h<290?5:6)*k:0),s*(1-.2*k),l+(1-l)*.74*k)}
/* detail of the flower meshes: 1 in the app (a bouquet on a phone, heads of 30–80 px), 2 on the greenhouse sheets and close-ups */
let DET=1;const DT=(n,k=1)=>Math.max(3,Math.round(n*k*(DET>=1.5?1:.72)));
/* the painter's palette of one colour */
const pal7=c=>({c,ink:shd(c,-.84),d2:shd(c,-.56),d1:shd(c,-.28),b:c,l1:shd(c,.3),l2:shd(c,.64)});
/* tone at a light level 0..1 (0.6 = the colour itself, seen face on) */
function toneAt(P,I){const st=[[0,P.d2],[.3,P.d1],[.6,P.b],[.84,P.l1],[1,P.l2]];I=Math.max(0,Math.min(1,I));for(let i=1;i<st.length;i++)if(I<=st[i][0]+1e-9){const t=(I-st[i-1][0])/(st[i][0]-st[i-1][0]);return mix(st[i-1][1],st[i][1],t)}return P.l2}
const V3s=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],V3l=a=>Math.hypot(a[0],a[1],a[2]);
const HV3=V3.nz([LIGHT[0],LIGHT[1],LIGHT[2]+1]);/* half vector between the light and the eye */
const lightI=n=>.6+.75*(V3.dot(n,LIGHT)-.66);/* face on = .6 */
const LERP=(a,b,t)=>a+(b-a)*t;
/* one shared soft highlight (bounding-box radial), reused by every gloss spot */
let GLOSS_ID=null;function glossFill(){if(GLOSS_ID&&document.getElementById(GLOSS_ID))return`url(#${GLOSS_ID})`;GLOSS_ID='gl'+(gid++);const gr=E('radialGradient',{id:GLOSS_ID},defs);stops(gr,[[0,'#ffffff',1],[.45,'#ffffff',.55],[1,'#ffffff',0]]);return`url(#${GLOSS_ID})`}
/* user-space gradient in the per-bouquet defs */
function ugrad(x1,y1,x2,y2,st){const id='q'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:f(x1),y1:f(y1),x2:f(x2),y2:f(y2)},GDEF||defs);stops(gr,st);return`url(#${id})`}
const pD=P=>'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L');
/* signed area of a screen polygon (to orient every silhouette the same way for the union clip) */
const sArea=P=>{let a=0;for(let i=0,n=P.length;i<n;i++){const p=P[i],q=P[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return a/2};

/* ---------- the physics of a stem ----------
   a head is held by its stem: its frame keeps the head's own "down" (where its stem, scape or raceme leaves it) toward the base of its stem
   (o.up = view-space vector from the stem's base to the head, y up), with only a small roll around its face axis;
   its neck leaves the receptacle in the flower's own direction and bends smoothly into the stem's direction; the bouquet stem continues it with the same tangent */
const I3=[[1,0,0],[0,1,0],[0,0,1]];
/* axisFirst: a raceme, a scape, a branched spray or a spathe on its stem keeps its own axis exactly along the stem and turns its face as near as it can to the asked direction;
   a single flower keeps its face and lets its neck bend */
function frameOf(o,rr=.3,axisFirst=false){if(o.Bf)return o.Bf;const ax=axOf(o);let B;
  if(o.up&&Math.hypot(o.up[0],o.up[1])>1e-6){const u=V3.nz([o.up[0],o.up[1],0]),j=o.roll??R(-.12,.12);let Z,Y;
    if(axisFirst){Y=u;Z=V3s(V3.nz(ax),V3.sc(Y,V3.dot(V3.nz(ax),Y)));if(V3l(Z)<.15)Z=V3s([0,0,1],V3.sc(Y,Y[2]));Z=V3.nz(Z);if(Z[2]<.2){Z=V3.nz(V3.add(Z,[0,0,.6]));Z=V3.nz(V3s(Z,V3.sc(Y,V3.dot(Z,Y))))}}
    else{Z=V3.nz(ax);Y=V3s(u,V3.sc(Z,V3.dot(u,Z)));const yl=V3l(Y);Y=yl<.1?null:V3.sc(Y,1/yl)}
    if(!Y)B=basis(ax,j);else{const X=V3.cr(Y,Z),c=Math.cos(j),s=Math.sin(j);B=[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}B.upV=u;B.reach=Math.hypot(o.up[0],o.up[1])}
  else{B=basis(ax,o.roll??R(-rr,rr));B.upV=[0,1,0]}return B}
/* the neck: from the receptacle P0 (local) leaving along d0 (local), bending into the direction of its stem (toward the base), drawn in view space;
   returns its part (for the painter's order), its end and the direction it arrives in (screen, toward the base), and its screen points (for the audit) */
/* what a head may keep of its own stem: never more than a share of the way down to its base (a low head near the rim has a short neck) */
const reachLim=(B,v,k=.32)=>B&&B.reach?Math.max(Math.min(v,B.reach*k),Math.min(v,6)):v;
/* how far a local point lies down toward the stem's base (view space, along the stem) */
const downOf=(B,P)=>{const v=toV(B,P),u=B.upV||[0,1,0];return-(v[0]*u[0]+v[1]*u[1]+v[2]*(u[2]||0))};
/* a local point (the foot of a raceme or scape) pulled toward the head so that it lies at most k of the way down to the base */
function fitDown(B,P,k=.3){if(!B.reach)return P;const d=downOf(B,P),lim=B.reach*k;if(d<=lim||d<=1e-6)return P;const s=Math.max(.15,lim/d);return[P[0]*s,P[1]*s,P[2]*s]}
/* in a bouquet the neck is drawn with the stems (behind every head), continuing the bouquet stem; the head then only hands back its geometry */
let NECK_X=false,NECK_SKIP=false;/* NECK_SKIP: a head drawn as the flower of a grown plant draws no neck at all */
function neckPart(B,O,P0l,d0l,len,w,o={}){if(B.reach)len=Math.max(4,Math.min(len,B.reach*.55-Math.max(0,downOf(B,P0l))));const up=B.upV||[0,1,0],P0=toV(B,P0l),d0=V3.nz(toV(B,d0l)),d1=V3.nz([-up[0],-up[1],-(up[2]||0)]),
    turn=Math.acos(Math.max(-1,Math.min(1,V3.dot(d0,d1)))),k0=len*(.28+.3*turn/Math.PI),P1=V3.add(P0,V3.sc(d0,k0)),P3=V3.add(V3.add(P0,V3.sc(d0,k0*.9)),V3.sc(d1,len*.75)),P2=V3.add(P3,V3.sc(d1,-len*.38)),pts=[];
  for(let i=0;i<=10;i++){const q=i/10,a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,d=q**3;pts.push([0,1,2].map(m=>a*P0[m]+b*P1[m]+c*P2[m]+d*P3[m]))}
  const c=o.cols||NECK,part=NECK_X||NECK_SKIP?{z:-1e9,cast:false,fn:()=>{}}:tube3({B:I3,O},pts,q=>w*(1+.12*q)/2,{cols:[c[1],c[2],c[1]],cap:o.cap??0,hl:.3,dk:.45,spec:.18,ink:c[0],eo:.3,cast:0,zb:o.zb||0}),
    sp=pts.map(p=>{const s=PJ(I3,O,p);return[s[0],s[1]]}),e=sp[10],e0=sp[8],l=Math.hypot(e[0]-e0[0],e[1]-e0[1])||1,cp=[P0,P1,P2,P3].map(p=>[p[0]+O[0],-(p[1]+O[1])]);
  return{part,end:e,nd:[(e[0]-e0[0])/l,(e[1]-e0[1])/l],np:sp,cp,w,cols:c}}
/* what a head hands back to the bouquet: where its stem must arrive, from which direction, and its neck's path */
const neckOut=nk=>({neck:nk.end,nd:nk.nd,np:nk.np,ncp:nk.cp,nw:nk.w,ncols:nk.cols});
/* a flower in 3D: its frame (where the face looks, roll), its parts, drawn far to near with the shadow of each part on the parts behind it */
function F3(g,o,rollR=Math.PI,axisFirst=false){const k=G(g);return{k,B:frameOf(o,rollR,axisFirst),O:[0,0,0],parts:[],so:o.so??.16,sd:o.sd??null,neck:null}}
const PJ3=(F,p)=>PJ(F.B,F.O,p);
function render3(F,size){const P=F.parts.sort((a,b)=>a.z-b.z),k=F.k;if(!P.length)return;
  const sd=F.sd??Math.max(.8,(size||40)*.022),dx=sd*.6,dy=sd*.8,sh=!LOD&&F.so>0;let cid=null;
  if(sh&&P.some((p,i)=>i&&p.cast&&p.sil)){const ss=P.filter(p=>p.sil&&p.sil.length>2);if(ss.length>1){cid='u'+(gid++);const cl=E('clipPath',{id:cid},GDEF||defs);let d='';for(const p of ss){const s=sArea(p.sil)<0?p.sil.slice().reverse():p.sil;d+=pD(s)+'Z'}E('path',{d},cl)}}
  const big=p=>{if(p.big!=null)return p.big;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const q of p.sil){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])}return p.big=Math.hypot(x1-x0,y1-y0)>(size||40)*.3};
  P.forEach((p,i)=>{if(cid&&i&&p.cast&&p.sil&&p.sil.length>2&&big(p)){const w=G(k,{'clip-path':`url(#${cid})`});E('path',{d:pD(p.sil)+'Z',fill:p.shc||'#1c0a12',opacity:f(F.so*(p.cast||1)),transform:`translate(${f(dx)},${f(dy)})`},w)}p.fn(k)})}

/* ---------- a curved sheet: petal, tepal, sepal, spathe, leaf blade ----------
   S(u,v) -> local 3D point, u −1..1 across (left to right seen from the front), v 0..1 from the base to the tip.
   Sampled on a grid; its outline is taken row by row as the extreme points across the spine (a cupped or rolled sheet seen edge-on keeps its true silhouette);
   cut into bands where the visible face changes; lit along and across from the real normals; veins drawn as grooves (front) or ridges (back);
   gloss as highlights where the bumps of the surface catch the light. Returns the parts to draw (painter's order). */
function sheet3(F,S,o={}){const nu=LOD?4:DT(o.nu||8),nv=LOD?7:DT(o.nv||16),B=F.B,O=F.O,e=2e-3,PF=o.pal,PB=o.palB||o.pal,parts=[];
  const pts=[],nrm=[],scr=[];
  for(let i=0;i<=nv;i++){const v=i/nv,pr=[],nr=[],sr=[];for(let j=0;j<=nu;j++){const u=-1+2*j/nu,p=S(u,v);
      const du=V3s(S(Math.min(1,u+e),v),S(Math.max(-1,u-e),v)),dv=V3s(S(u,Math.min(1,v+e)),S(u,Math.max(0,v-e)));let n=V3.cr(du,dv);
      pr.push(p);nr.push(V3l(n)>1e-9?V3.nz(toV(B,n)):null);sr.push(PJ(B,O,p))}pts.push(pr);nrm.push(nr);scr.push(sr)}
  /* degenerate normals (tip, base) borrow their neighbours' */
  for(let i=0;i<=nv;i++)for(let j=0;j<=nu;j++)if(!nrm[i][j]){let q=null;for(let d=1;d<=nv&&!q;d++)q=(nrm[i-d]||[])[j]||(nrm[i+d]||[])[j];nrm[i][j]=q||[0,0,1]}
  const vis=i=>{let s=0;for(let j=0;j<=nu;j++)s+=nrm[i][j][2]*(j===0||j===nu?.5:1);return s>=0};
  /* silhouette row by row */
  const Lf=[],Rt=[],mid=nu>>1;
  for(let i=0;i<=nv;i++){const a=scr[Math.max(0,i-1)][mid],b=scr[Math.min(nv,i+1)][mid];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy);let px,py;
    if(l<1e-6){const q=scr[i][nu],r=scr[i][0];px=q[0]-r[0];py=q[1]-r[1];const m=Math.hypot(px,py)||1;px/=m;py/=m}else{px=-dy/l;py=dx/l}
    let mn=1e9,mx=-1e9,pl=scr[i][0],pr=scr[i][nu];const c=scr[i][mid];for(const q of scr[i]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push(pl);Rt.push(pr)}
  /* bands of rows that show the same face */
  const bands=[];let a=0,cur=vis(0);for(let i=1;i<=nv;i++){const vi=vis(i);if(vi!==cur){bands.push([a,i,cur]);a=i;cur=vi}}bands.push([a,nv,cur]);
  for(const[i0,i1,front]of bands){const pal=front?PF:PB,sg=front?1:-1,sil=Lf.slice(i0,i1+1).concat(Rt.slice(i0,i1+1).reverse()).map(p=>[p[0],p[1]]);
    let z=0,c=0;for(let i=i0;i<=i1;i++)for(let j=0;j<=nu;j++){z+=scr[i][j][2];c++}z=z/c+(o.zb||0);
    const Iat=(i,j)=>{const n=nrm[i][j];return lightI(V3.sc(n,sg))*(o.ao?o.ao(-1+2*j/nu,i/nv):1)};
    parts.push({z,sil,front,cast:o.cast??1,fn:par=>{const g=G(par),d=smooth(sil);
      /* light along the spine */
      const s0=scr[i0][mid],s1=scr[i1][mid],st=[];for(let i=i0;i<=i1;i++){const t=i1===i0?0:(i-i0)/(i1-i0);st.push([t,toneAt(pal,(o.along?o.along(i/nv):0)+Iat(i,mid))])}
      let bl=0;for(let i=i0+1;i<=i1;i++)bl+=Math.hypot(scr[i][mid][0]-scr[i-1][mid][0],scr[i][mid][1]-scr[i-1][mid][1]);
      if(LOD||o.flat||bl<6)E('path',{d,fill:st[st.length>>1][1]},g);else E('path',{d,fill:ugrad(s0[0],s0[1],s1[0]+(s1[0]===s0[0]&&s1[1]===s0[1]?.1:0),s1[1],st)},g);
      /* light across, taken at the widest row of the band */
      if(!LOD){let im=i0,wm=-1;for(let i=i0;i<=i1;i++){const w=Math.hypot(Lf[i][0]-Rt[i][0],Lf[i][1]-Rt[i][1]);if(w>wm){wm=w;im=i}}
        if(wm>3.5&&o.across!==0){const ci=Iat(im,mid),xs=[];for(let j=0;j<=nu;j++)xs.push(Iat(im,j)-ci);const A=Lf[im],Bp=Rt[im],ax=Bp[0]-A[0],ay=Bp[1]-A[1],al=ax*ax+ay*ay||1,st2=[];
          for(let j=0;j<=nu;j++){const q=scr[im][j],t=Math.max(0,Math.min(1,((q[0]-A[0])*ax+(q[1]-A[1])*ay)/al)),dI=xs[j]*(o.across??1);st2.push([t,dI>0?'#ffffff':pal.ink,Math.min(.55,Math.abs(dI)*1.3)])}
          st2.sort((p,q)=>p[0]-q[0]);E('path',{d,fill:ugrad(A[0],A[1],Bp[0],Bp[1],st2)},g)}}
      if(o.paint)o.paint(g,front,{S,F,pal,d,scr,i0,i1});
      if(!LOD&&o.veins)veins3(g,F,S,o.veins,front,pal,o);
      if(!LOD&&front&&o.gloss)gloss3(g,F,S,o.gloss,i0/nv,i1/nv);
      if(!LOD&&o.rim&&DET>=1.5)E('path',{d,fill:'none',stroke:pal.l2,'stroke-width':f(o.rim[0]),'stroke-opacity':o.rim[1]},g);
      E('path',{d,fill:'none',stroke:o.edge||pal.ink,'stroke-width':o.ew??.55,'stroke-opacity':o.eo??.32,'stroke-linejoin':'round'},g)}})}
  return parts}
/* veins: curves in the sheet's own (u,v) space; on the front they are grooves (shadowed wall up-left, lit wall down-right), on the back raised ridges */
function veins3(g,F,S,V,front,pal,o){const w=o.vw||.6,list=typeof V==='function'?V(front):V;let dd='',dl='';
  for(const L of list){if(L.front!=null&&!!L.front!==front)continue;const pts=L.pts||L,P=pts.map(([u,v])=>PJ(F.B,F.O,S(u,v)));const d=smooth(P.map(p=>[p[0],p[1]]),false);
    if(L.w){E('path',{d,stroke:L.c||pal.ink,'stroke-width':f(L.w),'stroke-opacity':L.o??.4,fill:'none','stroke-linecap':'round'},g);continue}dd+=d}
  if(!dd)return;const ow=w*.55;
  if(front){if(o.vsoft)E('path',{d:dd,stroke:pal.d2,'stroke-width':f(w*o.vsoft),'stroke-opacity':o.vso??.14,fill:'none','stroke-linecap':'round'},g);
    E('path',{d:dd,stroke:o.vc||pal.d2,'stroke-width':f(w),'stroke-opacity':o.vo??.55,fill:'none','stroke-linecap':'round',transform:`translate(${f(-ow*.35)},${f(-ow*.45)})`},g);
    E('path',{d:dd,stroke:o.vl||pal.l1,'stroke-width':f(w*.6),'stroke-opacity':o.vlo??.45,fill:'none','stroke-linecap':'round',transform:`translate(${f(ow*.45)},${f(ow*.55)})`},g)}
  else{E('path',{d:dd,stroke:pal.d1,'stroke-width':f(w*.9),'stroke-opacity':.35,fill:'none','stroke-linecap':'round',transform:`translate(${f(ow*.5)},${f(ow*.6)})`},g);
    E('path',{d:dd,stroke:pal.l2,'stroke-width':f(w*.7),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g)}}
/* gloss: the bumps of the surface (o.bump(u,v), a height in local units) tilt the normal; where it bisects light and eye a highlight shines */
function gloss3(g,F,S,G0,v0,v1){const nu=DT(G0.nu||18,.9),nv=DT(G0.nv||28,.9),cu=G0.cu||6,cv=G0.cv||9,e=2e-3,best={};
  for(let i=0;i<=nv;i++){const v=v0+(v1-v0)*i/nv;for(let j=0;j<=nu;j++){const u=(-1+2*j/nu)*.82,p=S(u,v),pu=S(Math.min(1,u+e),v),pm=S(Math.max(-1,u-e),v),pv=S(u,Math.min(1,v+e)),pn=S(u,Math.max(0,v-e));
      const du=V3s(pu,pm),dv=V3s(pv,pn),lu=V3l(du),lv=V3l(dv);if(lu<1e-6||lv<1e-6)continue;let n=V3.nz(V3.cr(du,dv));
      if(G0.bump){const h=G0.bump,gu=(h(Math.min(1,u+e),v)-h(Math.max(-1,u-e),v))/lu,gv=(h(u,Math.min(1,v+e))-h(u,Math.max(0,v-e)))/lv;n=V3.nz(V3s(n,V3.add(V3.sc(du,gu/lu),V3.sc(dv,gv/lv))))}
      const nV=V3.nz(toV(F.B,n));if(nV[2]<=0)continue;const sp=Math.pow(Math.max(0,V3.dot(nV,HV3)),G0.shin||30)*(G0.k||1);if(sp<(G0.thr||.12))continue;
      const key=Math.min(cu-1,Math.floor((u+1)/2*cu))+'_'+Math.min(cv-1,Math.floor((v-v0)/(v1-v0||1)*cv));if(!best[key]||best[key].sp<sp)best[key]={sp,u,v}}}
  const fill=glossFill();for(const k in best){const{sp,u,v}=best[k],c=PJ(F.B,F.O,S(u,v)),a=PJ(F.B,F.O,S(u,Math.max(0,v-.03))),b=PJ(F.B,F.O,S(u,Math.min(1,v+.03))),l=PJ(F.B,F.O,S(Math.max(-1,u-.06),v)),r=PJ(F.B,F.O,S(Math.min(1,u+.06),v));
    const ang=Math.atan2(b[1]-a[1],b[0]-a[0])/D+90,rv=Math.hypot(b[0]-a[0],b[1]-a[1])*(G0.lv||1.6),ru=Math.hypot(r[0]-l[0],r[1]-l[1])*(G0.lu||.45);if(rv<.4||ru<.3)continue;
    E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(ru),ry:f(rv),fill,opacity:f(Math.min(1,sp)*(G0.o||.9)),transform:`rotate(${f(ang)} ${f(c[0])} ${f(c[1])})`},g)}}

/* ---------- a round tube along a 3D polyline: spadix, column, filament, the neck of the stem ----------
   cols: colours along it; r(t) radius; shaded across (lit up-left); optional florets in a spiral lattice, rounded cap */
function tube3(F,P3,rf,o={}){const n=P3.length-1,C=P3.map(p=>PJ(F.B,F.O,p)),Rr=t=>typeof rf==='function'?rf(t):rf,L=[],Rg=[];
  for(let i=0;i<=n;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,r=Rr(i/n);L.push([C[i][0]-dy/l*r,C[i][1]+dx/l*r]);Rg.push([C[i][0]+dy/l*r,C[i][1]-dx/l*r])}
  let z=0;for(const c of C)z+=c[2];z/=C.length;
  const e=C[n],e0=C[Math.max(0,n-1)],ea=Math.atan2(e[1]-e0[1],e[0]-e0[0]),re=Rr(1),out=L.concat(o.cap!==0?(()=>{const q=[];for(let k=1;k<8;k++){const a=ea+Math.PI/2-Math.PI*k/8;q.push([e[0]+Math.cos(a)*re,e[1]+Math.sin(a)*re])}return q})():[],Rg.slice().reverse());
  let ln=0;for(let i=1;i<=n;i++)ln+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);const small=Rr(.5)<1.4||ln<10;
  return{z:z+(o.zb||0),sil:out,cast:o.cast??.8,fn:par=>{const g=G(par),d=smooth(out),cols=o.cols||['#4f7a34'],s0=C[0];
    const st=cols.map((c,i)=>[cols.length>1?i/(cols.length-1):0,c]);E('path',{d,fill:LOD||small||cols.length<2?cols[cols.length>>1]:ugrad(s0[0],s0[1],e[0]+.01,e[1],st)},g);
    if(!LOD&&!small){/* across: the side toward the light (up-left on screen) is lit */const m=C[n>>1],a=C[Math.max(0,(n>>1)-1)],b=C[Math.min(n,(n>>1)+1)];let px=-(b[1]-a[1]),py=b[0]-a[0];const pl=Math.hypot(px,py)||1;px/=pl;py/=pl;if(px*.6+py*.8>0){px=-px;py=-py}
      const r=Rr(.5)*1.05;E('path',{d,fill:ugrad(m[0]+px*r,m[1]+py*r,m[0]-px*r,m[1]-py*r,[[0,'#ffffff',o.hl??.32],[.3,'#ffffff',0],[.55,'#000000',0],[1,'#000000',o.dk??.38]])},g);
      if(o.dots)tubeDots(g,F,P3,Rr,o.dots);
      if(o.spec!==0)E('path',{d:smooth(C.slice(1,Math.max(2,n)).map(c=>[c[0]+px*Rr(.5)*.45,c[1]+py*Rr(.5)*.45]),false),stroke:'#ffffff','stroke-width':f(Math.max(.4,Rr(.5)*.22)),'stroke-opacity':o.spec??.35,fill:'none','stroke-linecap':'round'},g)}
    E('path',{d,fill:'none',stroke:o.ink||'#1a2a12','stroke-width':.45,'stroke-opacity':o.eo??.35},g)}}}
/* florets on a tube: a golden spiral of tiny bumps, only the ones facing the eye */
function tubeDots(g,F,P3,Rr,D0){const n=P3.length-1,N=DT(D0.n||90,.8),cs=D0.c||['#00000055'];let dd='',dl='';
  for(let k=0;k<N;k++){const t=(k+.5)/N*(D0.t1??.97),i=Math.min(n-1,Math.floor(t*n)),fr=t*n-i,p=V3.add(P3[i],V3.sc(V3s(P3[i+1],P3[i]),fr)),ax=V3.nz(V3s(P3[i+1],P3[i])),
      up=Math.abs(ax[1])>.9?[1,0,0]:[0,1,0],X=V3.nz(V3.cr(up,ax)),Y=V3.cr(ax,X),th=k*137.508*D,nl=V3.add(V3.sc(X,Math.cos(th)),V3.sc(Y,Math.sin(th))),nV=toV(F.B,nl);if(nV[2]<.15)continue;
    const r=Rr(t),q=PJ(F.B,F.O,V3.add(p,V3.sc(nl,r*.92))),s=(D0.r||r*.16)*(.55+.45*nV[2]);dd+=`M${f(q[0]-s)},${f(q[1])}a${f(s)},${f(s)} 0 1,0 ${f(2*s)},0a${f(s)},${f(s)} 0 1,0 ${f(-2*s)},0`;
    if(D0.l&&V3.dot(nV,LIGHT)>.35)dl+=`M${f(q[0]-s*.9)},${f(q[1]-s*.5)}a${f(s*.4)},${f(s*.4)} 0 1,0 ${f(s*.8)},0a${f(s*.4)},${f(s*.4)} 0 1,0 ${f(-s*.8)},0`}
  if(dd)E('path',{d:dd,fill:D0.c||'#000',opacity:D0.o??.3},g);if(dl)E('path',{d:dl,fill:D0.l,opacity:D0.lo??.6},g)}
/* the neck of the stem: the last centimetres from the receptacle, drawn with the head so it joins it right from every side; returns its far end (where the bouquet stem meets it) */
const NECK=['#2c4a1e','#4a7432','#79a352','#a8c97e'];
function neck3(F,P3,w,o={}){const c=o.cols||NECK,Q=P3.slice().reverse(),p=tube3(F,Q,t=>w*(1.12-.22*t)/2,{cols:[c[1],c[2],c[2]],dots:null,cap:o.cap,hl:.3,dk:.45,spec:.22,ink:c[0],cast:.5,zb:o.zb||0});F.parts.push(p);const e=PJ3(F,P3[P3.length-1]);F.neck=[e[0],e[1]];return p}
/* the crisp shadow a slender part (spadix, column, stamen) throws on the sheet behind it: its centreline pushed along the light onto the local plane z=z0, clipped to that sheet */
function plShadow(F,P3,rf,clipParts,o={}){const Bt=F.B,Lloc=[Bt[0][0]*LIGHT[0]+Bt[0][1]*LIGHT[1]+Bt[0][2]*LIGHT[2],Bt[1][0]*LIGHT[0]+Bt[1][1]*LIGHT[1]+Bt[1][2]*LIGHT[2],Bt[2][0]*LIGHT[0]+Bt[2][1]*LIGHT[1]+Bt[2][2]*LIGHT[2]];
  if(Lloc[2]<.12||LOD)return null;const z0=o.z0||0,Q=P3.map(p=>{const h=(p[2]-z0)/Lloc[2];return[p[0]-Lloc[0]*h,p[1]-Lloc[1]*h,z0]});const tb=tube3(F,Q,rf,{cols:['#000'],cap:o.cap});
  return{z:o.z,cast:false,fn:par=>{const cid='u'+(gid++),cl=E('clipPath',{id:cid},GDEF||defs);let d='';for(const p of clipParts)if(p.sil){const s=sArea(p.sil)<0?p.sil.slice().reverse():p.sil;d+=pD(s)+'Z'}E('path',{d},cl);
    E('path',{d:smooth(tb.sil),fill:o.c||'#1c0a12',opacity:o.op??.22,'clip-path':`url(#${cid})`},par)}}}
/* the colourways of each species (id -> list of {id, n, c, ...}) and its trade grades (head size in cm, the common ones repeated) */
const CWS={},SZG={};
/* greenhouse drawers by species id: drawRec sends a species here whatever its archetype; GHI overrides how the composer treats it (form, size, kind, radius factor) */
const GH={},GHI={};
/* a colourway: the nearest one of a species' list to an observed colour */
function cwNear(list,col){if(!list||!list.length)return null;if(!col)return list[0];const a=hx(col);let best=list[0],bd=1e18;for(const w of list){const b=hx(w.c),dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2],d=2*dr*dr+4*dg*dg+3*db*db;if(d<bd){bd=d;best=w}}return best}
/* ---------- a rolled sheet (calla spathe, trumpet, tube): cut into narrow strips across, each strip into patches where its visible face changes;
   every patch is lit along its length from its own normals, inner faces darken toward the throat (o.ao), patches are drawn far to near
   (back wall, then what stands inside, then the near wall), and the true edges (margins, rim) are stroked once ---------- */
function roll3(F,S,o={}){const ns=LOD?10:DT(o.ns||28),nv=LOD?8:DT(o.nv||18),B=F.B,O=F.O,e=2e-3,parts=[],PF=o.pal,PB=o.palB||o.pal;
  const nrmAt=(u,v)=>{const du=V3s(S(Math.min(1,u+e),v),S(Math.max(-1,u-e),v)),dv=V3s(S(u,Math.min(1,v+e)),S(u,Math.max(0,v-e)));const n=V3.cr(du,dv);return V3l(n)>1e-10?V3.nz(toV(B,n)):null};
  const scr=[];for(let i=0;i<=nv;i++){const r=[];for(let k=0;k<=ns;k++)r.push(PJ(B,O,S(-1+2*k/ns,i/nv)));scr.push(r)}
  for(let k=0;k<ns;k++){const uc=-1+2*(k+.5)/ns,N=[];for(let i=0;i<=nv;i++){let n=nrmAt(uc,i/nv);if(!n)n=N[i-1]||[0,0,1];N.push(n)}
    const segs=[],mx=o.seg||4;let a=0,cur=N[0][2]>=0;for(let i=1;i<=nv;i++){const vi=N[i][2]>=0;if(vi!==cur||i-a>=mx){segs.push([a,i,cur]);a=i;cur=vi}}if(a<nv)segs.push([a,nv,cur]);
    /* the strip's two gradients (inner and outer face), from its base to its rim, shared by all its patches */
    const gq={},gOf=front=>{if(gq[front])return gq[front];const pal=front?PF:PB,sg=front?1:-1,st=[];for(let i=0;i<=nv;i++){let I=lightI(V3.sc(N[i],sg));if(o.ao)I*=o.ao(uc,i/nv,front);if(o.along)I+=o.along(uc,i/nv,front);st.push([i/nv,toneAt(o.tint?pal(uc,i/nv,front):pal,I)])}
      const a=scr[0],b=scr[nv];return gq[front]=LOD?st[nv>>1][1]:ugrad((a[k][0]+a[k+1][0])/2,(a[k][1]+a[k+1][1])/2,(b[k][0]+b[k+1][0])/2+.01,(b[k][1]+b[k+1][1])/2,st)};
    for(const[i0,i1,front]of segs){if(i1===i0)continue;const sil=[];for(let i=i0;i<=i1;i++)sil.push(scr[i][k]);for(let i=i1;i>=i0;i--)sil.push(scr[i][k+1]);
      let z=0;for(const p of sil)z+=p[2];z=z/sil.length+(o.zb||0);const s2=sil.map(p=>[p[0],p[1]]);
      parts.push({z,sil:s2,cast:o.cast??.6,front,fn:par=>{const gf=gOf(front);E('path',{d:pD(s2)+'Z',fill:gf,stroke:gf,'stroke-width':.7,'stroke-linejoin':'round'},par)}})}}
  return parts}
/* the true edges of a sheet: a curve along u=±1 (margins) or along v=1 (rim), as part of the painter's order (split where it passes behind) */
function edge3(F,S,pts,o={}){const P=pts.map(([u,v])=>PJ(F.B,F.O,S(u,v)));let z=0;for(const p of P)z+=p[2];z/=P.length;
  return{z:z+(o.zb||.5),cast:false,fn:par=>E('path',{d:smooth(P.map(p=>[p[0],p[1]]),false),stroke:o.c||'#1a1010','stroke-width':o.w||.6,'stroke-opacity':o.o??.35,fill:'none','stroke-linecap':'round'},par)}}
/* satin sheen: along each row, the brightest point of the visible outer face; a soft tapered stroke through them */
function sheen3(F,S,o={}){if(LOD)return[];const nv=DT(o.nv||16,.85),nu=DT(o.nu||18,.85),e=2e-3,pts=[];
  for(let i=0;i<=nv;i++){const v=(o.v0??.05)+((o.v1??.95)-(o.v0??.05))*i/nv;let best=null;for(let j=0;j<=nu;j++){const u=(o.u0??-1)+((o.u1??1)-(o.u0??-1))*j/nu,du=V3s(S(Math.min(1,u+e),v),S(Math.max(-1,u-e),v)),dv=V3s(S(u,Math.min(1,v+e)),S(u,Math.max(0,v-e)));
      let n=V3.cr(du,dv);if(V3l(n)<1e-10)continue;n=V3.nz(toV(F.B,n));if((o.side||1)*n[2]<=0)continue;if(o.side===-1)n=V3.sc(n,-1);const sp=Math.pow(Math.max(0,V3.dot(n,HV3)),o.shin||14);if(!best||sp>best.sp)best={sp,u,v}}
    if(best&&best.sp>(o.thr||.25))pts.push(best);else pts.push(null)}
  const runs=[];let cur=[];for(const p of pts){if(p)cur.push(p);else{if(cur.length>2)runs.push(cur);cur=[]}}if(cur.length>2)runs.push(cur);
  return runs.map(run=>{const P=run.map(p=>PJ(F.B,F.O,S(p.u,p.v)));let z=0;for(const p of P)z+=p[2];z/=P.length;
    return{z:z+(o.zb||.6),cast:false,fn:par=>{if(LOD)return;const w=o.w||3,A=[],B=[],st=[],m=run.length;
      for(let k=0;k<m;k++){const a=P[Math.max(0,k-1)],b=P[Math.min(m-1,k+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,t=k/(m-1),taper=Math.sin(Math.PI*Math.min(.98,.02+t*.96)),hw=w*(.35+.65*taper)/2;
        A.push([P[k][0]-dy/l*hw,P[k][1]+dx/l*hw]);B.push([P[k][0]+dy/l*hw,P[k][1]-dx/l*hw]);st.push([t,o.c||'#ffffff',Math.min(1,run[k].sp)*(o.op||.45)*taper])}
      E('path',{d:smooth(A.concat(B.reverse())),fill:ugrad(P[0][0],P[0][1],P[m-1][0]+.01,P[m-1][1],st)},par)}}})}
/* ---------- leaves on the stems of the bouquet: each species says what its stem carries (STEML[id]); they sit on the visible part of the stem, above the mouth ----------
   shape: 'lance' (lily, tulip), 'ovate', 'tendril' (gloriosa); n leaves; len cm; w width ratio; col; arr 'alt' | 'whorl' | 'opp'; up (angle to the stem, degrees) */
const STEML={};
const LEAF_LANCE=prof([[0,.22],[.12,.6],[.35,1],[.6,.86],[.85,.42],[1,.03]]),LEAF_OVATE=prof([[0,.3],[.15,.75],[.4,1],[.7,.8],[.9,.4],[1,.05]]);
/* one leaf in the picture plane, base at (x,y), pointing along ang (radians, screen), a little arched and folded on its midrib */
function stemLeaf(par,x,y,ang,len,w,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D+90)})`}),F={k:g,B:basis(V3.nz([o.side||0,-.3,.95]),(o.roll||0)),O:[0,0,0],parts:[],so:0},P=pal7(col),PB=pal7(mix(shd(col,.18),'#b8c8a0',.25));
  const S=petS({phi:90,r0:0,z0:0,L:len,W:len*w*.5,wp:o.shape==='ovate'?LEAF_OVATE:LEAF_LANCE,a0:90-(o.arch||10),a1:90+(o.arch||10)*2.2,pw:1.5,cup:-.28,tw:(o.side||0)*14});
  const n=o.par?7:0,VL=[];for(let k=0;k<n;k++){const u=-.75+1.5*k/(n-1);if(Math.abs(u)<.1)continue;VL.push({pts:[0,.3,.6,.9].map(v=>[u*(.9-.5*v),.02+v*.93]),w:.35,c:P.d1,o:.35})}
  F.parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:5,nv:9,across:1.5,ew:.5,eo:.4,cast:0,veins:[{pts:[[0,.01],[0,.5],[0,.97]],w:Math.max(.5,len*.012),c:P.l1,o:.55},...VL],
    gloss:o.gloss?{shin:30,k:o.gloss,thr:.25,cu:2,cv:5,nu:8,nv:14,lv:1.4,lu:.5,o:.6}:null}));
  if(o.tendril){const e=S(0,1),q=[e,V3.add(e,[len*.08,len*.12,0]),V3.add(e,[len*.2,len*.13,0]),V3.add(e,[len*.22,len*.04,0]),V3.add(e,[len*.15,len*.02,0])];F.parts.push(tube3(F,q,Math.max(.35,len*.008),{cols:[P.b,P.l1],cap:1,hl:.2,dk:.3,spec:0,ink:P.ink,eo:.3,cast:0}))}
  render3(F,len);return g}
/* the leaves of one stem path P (cubic, from the base to the head) above the height yMax (the mouth), below the head */
function stemLeaves(par,P,sid,yMax,headR,t){const sl=STEML[sid];if(!sl||LOD)return;const n=Array.isArray(sl.n)?Math.round(R(sl.n[0],sl.n[1])):sl.n||2,L0=(sl.len||10)*UPC;let side=rnd()<.5?-1:1;
  const cand=[];for(let i=0;i<=40;i++){const q=i/40,p=bz(P,q);if(p[1]<yMax-L0*.75&&Math.hypot(p[0]-P[3][0],p[1]-P[3][1])>headR*.9)cand.push(q)}if(!cand.length)return;
  const q0=cand[0],q1=cand[cand.length-1];for(let k=0;k<n;k++){const q=q0+(q1-q0)*(n===1?.5:k/(n-1))*R(.92,1.02),p=bz(P,q),p2=bz(P,Math.min(1,q+.02)),ta=Math.atan2(p2[1]-p[1],p2[0]-p[0]);
    const whorl=sl.arr==='whorl'?3:sl.arr==='opp'?2:1;for(let j=0;j<whorl;j++){const s=whorl===1?side:(j%2?1:-1)*(j===2?.3:1),ang=ta+s*(sl.up||38)*D*R(.8,1.15),len=L0*R(.8,1.1)*(1-.12*k);
      const wr=G(par);if(sl.sv&&typeof SV_ON!=='undefined'&&SV_ON){R(0,6);sl.sv(wr,p[0],p[1],ang,len,{ta,s,k,j})}else if(sl.shape==='pinnate')pinnateLeaf(wr,p[0],p[1],ang,len,sl.col||'#3f6a2c',sl.lf||3,{side:s*.5,w:sl.w||.5,gloss:sl.gloss,teeth:sl.teeth});else stemLeaf(wr,p[0],p[1],ang,len,sl.w||.22,sl.col||'#3f6a2c',{side:s*.5,arch:sl.arch||12,shape:sl.shape,par:sl.par,gloss:sl.gloss,tendril:sl.shape==='tendril'});growUp(wr,p[0],p[1],Math.max(0,t-300),500)}
    side=-side}}
/* a compound leaf (rose, dahlia, peony): a rachis along ang carrying pairs of ovate leaflets and one at its tip; lf = 3, 5 or 7 leaflets */
function pinnateLeaf(par,x,y,ang,len,col,lf,o={}){const g=G(par),pairs=(lf-1)>>1,rl=len*.95,P=pal7(col),ex=x+Math.cos(ang)*rl,ey=y+Math.sin(ang)*rl;
  E('path',{d:`M${f(x)},${f(y)}Q${f(x+Math.cos(ang)*rl*.5-Math.sin(ang)*len*.05)},${f(y+Math.sin(ang)*rl*.5+Math.cos(ang)*len*.05)} ${f(ex)},${f(ey)}`,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.025)),fill:'none','stroke-linecap':'round'},g);
  for(let i=0;i<pairs;i++){const q=.3+.45*i/Math.max(1,pairs),px=x+Math.cos(ang)*rl*q,py=y+Math.sin(ang)*rl*q,ll=len*(.42+.08*i);for(const s of[-1,1])stemLeaf(g,px,py,ang+s*(55+R(-8,8))*D,ll,o.w||.5,mix(col,shd(col,R(-.15,.1)),.5),{side:s*(o.side||.4),arch:8,shape:'ovate',par:1,gloss:o.gloss})}
  stemLeaf(g,ex,ey,ang+R(-.1,.1),len*.5,o.w||.5,col,{side:o.side||0,arch:8,shape:'ovate',par:1,gloss:o.gloss});return g}
