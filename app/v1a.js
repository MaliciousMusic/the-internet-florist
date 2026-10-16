
/* ================= Vases v2 : les contenants des photos de référence, rendus matière par matière ================= */
const FL=990,VX=500;
/* a vessel's scale (v.vs, 1 by default) is one of its properties: its profile, height, mouth, lip and handles grow with it once, here, and a
   cast vessel's reliefs (castScaled) follow it, so the whole object is the same piece, larger */
function vScale(v){const k=v.vs||1;if(k===1||v._vs)return v;v._vs=1;return vScaleBy(v,k)}
/* every length of a vessel times k (profile, outline, true silhouette, mouth, lip, handles); a drawn body (svgb) follows through svgbT */
function vScaleBy(v,k){if(v.prof)v.prof=v.prof.map(q=>[q[0]*k,q[1]*k]);
  for(const n of['h','mo','mh','mx','lipw','mry'])if(typeof v[n]==='number')v[n]*=k;
  if(v.hd)v.hd=Object.assign({},v.hd,...['y0','y1','out','th'].filter(n=>typeof v.hd[n]==='number').map(n=>({[n]:v.hd[n]*k})));
  if(v.box)v.box=Object.assign({},v.box,{w:v.box.w*k,d:v.box.d*k});
  if(v.ol)v.ol=Object.assign({},v.ol,{pts:v.ol.pts.map(q=>[q[0]*k,q[1]*k]),mouth:v.ol.mouth&&v.ol.mouth.map(x=>x*k)},typeof v.ol.d==='number'?{d:v.ol.d*k}:{});
  if(v.sil)v.sil=Object.assign({},v.sil,{x0:v.sil.x0*k,dx:v.sil.dx*k,h:v.sil.h.map(x=>x*k)});
  if(v.m2)v.m2=v.m2.map(m=>Object.assign({},m,{mx:m.mx*k,mh:m.mh*k,mo:m.mo*k,mry:m.mry*k}));return v}
/* a drawn body is written at scale 1 around the vessel's foot (VX, FL): a scaled vessel draws it through this transform */
const svgbT=k=>k&&k!==1?`translate(${VX} ${FL}) scale(${k}) translate(${-VX} ${-FL})`:null;
/* the scales the owner set in the vase review (revue-vases/etat.json, written here by revue-vases/version.mjs echelles) */
const VSC={'bouteille-dragon':0.59,'bronze-bambous':0.83,'bronze-lys':0.97,'calla-gres':1.52,'coque-verte':1.3,'cristal-ginkgo':0.71,'feuilles-vertes':0.75,'gres-chauve-souris':0.96,'gui-argent':0.56,'jardiniere-cristaux':0.8,'narcisses-bronze':0.7,'prismes-bronze':0.4};
const VZ={};for(const v of VZ0){if(VSC[v.id])v.vs=VSC[v.id];VZ[v.id]=vScale(v)}
/* vessels of earlier versions: bouquets already sent keep a vessel close to theirs (the hand-tied and paper-wrapped ones stand in clear glass) */
const VOLD={'coupe-blanche':'coupe-pied-blanche','coupe-noire':'coupe-pied-noire','boule-chocolat':'vase-ovoide-chocolat','boule-sapin':'boule-vert-sapin','verre':'cylindre-verre-clair','calice':'calice-mouchete',
  'balustre':'balustre-argent-patine','urne':'urne-sablier-noire','cobalt':'boule-cotelee-bleue','jarre':'jarre-gres-chamotte','soliflore':'soliflore-balustre-noir','kenzan':'pique-fleurs-laiton','noue':'cylindre-verre-clair','papier':'cylindre-verre-clair'};
for(const k in VOLD)Object.defineProperty(VZ,k,{value:VZ[VOLD[k]],enumerable:false,configurable:true});
const vH=v=>v.h||0,vMouth=v=>v.mo||(v.kind==='hand'||v.kind==='wrap'?26:20),vMx=v=>v.mx||0,vMh=v=>v.mh!=null?v.mh:(v.h||0),vRy=mw=>Math.max(2.5,mw*.16);
const clamp1=x=>Math.max(-1,Math.min(1,x)),sm01=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
/* radius of a measured profile at height h */
function profR(P,h){if(!P||!P.length)return 0;if(h<=P[0][0])return P[0][1];for(let i=1;i<P.length;i++)if(P[i][0]>=h){const a=P[i-1],b=P[i],u=b[0]>a[0]?(h-a[0])/(b[0]-a[0]):1;return a[1]+(b[1]-a[1])*u}return P[P.length-1][1]}
/* half-width of the body at screen height y (0 above it) */
function vBodyAt(v,y){if(!v||!v.prof)return 0;const h=FL-y;return h<0||h>v.h?0:profR(v.prof,h)}
/* the highest point of the silhouette standing above x (FL where the vessel does not reach) */
/* a vessel drawn from its model (vases5/compo.py) carries its true top, column by column (sil: x0 from the axis, every dx units, the
   heights above the floor of what stands near the bouquet; its opening free down to the front lip): asymmetric, wings and horns included */
function vStTop(st,x){const u=(x-VX-st.x0)/st.dx,n=st.h.length;if(u<0||u>n-1)return FL;const i=Math.min(n-2,Math.floor(u)),w=u-i;return FL-(n>1?st.h[i]+(st.h[i+1]-st.h[i])*w:st.h[0])}
function vSilTop(v,x){if(!v||!v.prof)return FL;if(v.sil)return vStTop(v.sil,x);const dx=Math.abs(x-VX),P=v.prof;let top=FL;
  for(let i=P.length-1;i>0;i--){const a=P[i-1],b=P[i];if(b[1]>=dx){top=FL-b[0];break}if(a[1]>=dx){const u=(dx-a[1])/(b[1]-a[1]);top=FL-(a[0]+(b[0]-a[0])*u);break}}
  /* the handles stand out beyond the turned body and rise over its shoulder: they count in the silhouette too */
  if(v.hd){const hd=v.hd,rAt=h=>{for(let i=1;i<P.length;i++)if(P[i][0]>=h){const a=P[i-1],b=P[i],u=(h-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*u}return P[P.length-1][1]},r1=rAt(hd.y1),r0=rAt(hd.y0);
    if(dx>=Math.min(r0,r1)-2&&dx<=Math.max(r0,r1)+hd.out*1.35+hd.th)top=Math.min(top,FL-hd.y1-hd.th*1.3)}
  return top}
/* profile smoothed (Catmull-Rom on the radius) and resampled evenly in height; sharp steps (two points closer than 1.2 units) stay sharp */
function profSamples(P,n){const pts=[];for(let i=0;i<P.length-1;i++){const sharp=P[i+1][0]-P[i][0]<1.2,w0=P[Math.max(0,i-1)][1],w1=P[i][1],w2=P[i+1][1],w3=P[Math.min(P.length-1,i+2)][1];
    for(let k=0;k<10;k++){const s=k/10,s2=s*s,s3=s2*s;pts.push([P[i][0]+(P[i+1][0]-P[i][0])*s,sharp?w1+(w2-w1)*s:.5*(2*w1+(-w0+w2)*s+(2*w0-5*w1+4*w2-w3)*s2+(-w0+3*w1-3*w2+w3)*s3)])}}
  pts.push(P[P.length-1]);const h=P[P.length-1][0],out=[];let j=0;
  for(let i=0;i<=n;i++){const y=h*i/n;while(j<pts.length-2&&pts[j+1][0]<y)j++;const a=pts[j],b=pts[j+1],u=b[0]>a[0]?Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0]))):0;out.push([y,Math.max(.6,a[1]+(b[1]-a[1])*u)])}return out}
const sRad=(S,h)=>{const n=S.length-1,H=S[n][0],k=Math.max(0,Math.min(n,h/H*n)),i=Math.floor(k),u=k-i;return i>=n?S[n][1]:S[i][1]+(S[i+1][1]-S[i][1])*u};
/* ---------- light: lambert + blinn-phong per material, environment bands for metals, a window in glazes ---------- */
const nz3=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)},LV=nz3([-.5,.62,.6]),HV=nz3([LV[0],LV[1],LV[2]+1]);
const toHex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const plin=(P,u)=>{if(u<=P[0][0])return P[0][1];for(let i=1;i<P.length;i++)if(P[i][0]>=u){const a=P[i-1],b=P[i];return a[1]+(b[1]-a[1])*(u-a[0])/(b[0]-a[0])}return P[P.length-1][1]};
const ENV_POL=[[-1,.28],[-.86,.5],[-.72,.26],[-.58,.92],[-.47,1],[-.38,.36],[-.16,.58],[.06,.8],[.16,.4],[.42,.56],[.66,.24],[.86,.62],[1,.26]],
  ENV_BRU=[[-1,.16],[-.72,.38],[-.48,.7],[-.22,.62],[.12,.46],[.5,.32],[.8,.2],[1,.14]];
function vShade(v,base,u,wp,o={}){const ph0=Math.asin(clamp1(u));let ph=ph0;
  if(o.fac){const st=2*Math.PI/o.fac;ph=Math.round(ph/st)*st}
  if(o.lob)ph+=o.lob.d*.6*Math.sin(o.lob.n*ph0);
  const su=Math.sin(ph),c=Math.cos(ph),l=Math.hypot(su,wp,c)||1,n=[su/l,-wp/l,c/l],nl=Math.max(0,n[0]*LV[0]+n[1]*LV[1]+n[2]*LV[2]),nh=Math.max(0,n[0]*HV[0]+n[1]*HV[1]+n[2]*HV[2]),
    fr=Math.pow(1-Math.sqrt(Math.max(0,1-u*u)),2.4),[r,g,b]=hx(base),lum=(.3*r+.59*g+.11*b)/255,ao=o.lob?1-o.lob.d*.5*Math.pow(Math.max(0,-Math.cos(o.lob.n*ph0)),5):1;
  const mat=v.mat,fin=v.fin||'';
  if(mat==='glass'){const op=(v.gl||{}).op??.25,s=Math.pow(nh,46)*.9+Math.pow(nh,8)*.12,win=u>-.6&&u<-.42?.55*(1-Math.abs(u+.51)/.09):0;
    if(op>.55){const I=(.2+.55*nl)*ao,w=255*(s+win*.6+.12*fr);return[toHex(r*I+w,g*I+w,b*I+w),Math.min(1,op+.18+.3*fr)]}
    const w=Math.min(1,s+win);return[toHex(r+(255-r)*w,g+(255-g)*w,b+(255-b)*w),Math.min(.94,op*.55+.5*fr+.75*w)]}
  /* wrap lighting: the shadow side keeps some light, as under a soft studio window */
  const dl=n[0]*LV[0]+n[1]*LV[1]+n[2]*LV[2],wl=Math.max(0,(dl+.4)/1.4);let I,sp;
  if(mat==='metal'){const tilt=.8+.4*(-n[1]),E=Math.min(1,plin(fin==='brushed'?ENV_BRU:ENV_POL,su)*tilt),[a1,b1,c1]=fin==='patina'?[.4,.5,.22]:fin==='brushed'?[.46,.52,.3]:[.3,.62,.5];
    const s2=255*(c1*Math.pow(E,2.2)+(fin==='brushed'?.18*Math.pow(nh,10):.7*Math.pow(nh,80)))*ao,k=(a1+b1*E)*ao;return[toHex(r*k+s2,g*k+s2,b*k+s2),1]}
  if(mat==='gloss'){I=(.4+.62*wl)*ao;sp=.12*Math.pow(nh,10)+.1*fr}
  else if(mat==='satin'||mat==='stone'){I=(.54+.56*wl)*(1-.1*fr)*ao;sp=(mat==='stone'?.12:.2)*Math.pow(nh,16)+.05*fr}
  else{I=(.56+.58*wl)*(1-.12*fr)*ao;sp=.035*Math.pow(nh,4)}
  const w=255*sp;return[toHex(r*I+w,g*I+w,b*I+w),1]}
/* the base colour at a height (cm-measured gradients, unglazed foot rings) */
function vBase(v,h){const tp=v.tp||{};if(tp.grad){const cm=h/UPC,G=tp.grad;for(let i=1;i<G.length;i++)if(G[i][0]>=cm){const a=G[i-1],b=G[i],t=(cm-a[0])/(b[0]-a[0]);return mix(a[1],b[1],sm01(t))}return G[G.length-1][1]}
  if(tp.foot&&h<tp.foot.h*UPC)return tp.foot.c;if(tp.toast&&h>tp.toast.y0*UPC)return mix(v.col,tp.toast.c,Math.min(.55,(h/UPC-tp.toast.y0)*.12));return v.col}
const vMatAt=(v,h)=>{const tp=v.tp||{};return tp.foot&&h<tp.foot.h*UPC?Object.assign({},v,{mat:'matte'}):v};
