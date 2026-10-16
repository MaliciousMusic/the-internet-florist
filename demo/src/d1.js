
/* ================= Atelier v3 — high-detail botanical kit ================= */
/* colour maths */
const hx=c=>{const n=parseInt(c.slice(1,7),16);return[n>>16&255,n>>8&255,n&255]};
const hs=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return hs(A.map((v,i)=>v+(B[i]-v)*t))};
const dk=(c,t)=>mix(c,'#0d0408',t),lt=(c,t)=>mix(c,'#fffaf4',t);
/* five tones from one colour: ink, shadow, body, light, rim */
/* five tones from one colour: ink, shadow, body, light, rim. Pale colours get soft, warm shadows instead of grey */
const tones=(c,k=1)=>{const[r,g,b]=hx(c),lum=(.3*r+.59*g+.11*b)/255,kk=k*(lum>.88?.42:lum>.78?.62:1),sh=lum>.78?mix(dk(c,.36*kk),'#c8b49a',.25):dk(c,.36*k);
  return[mix(dk(c,lum>.78?.55:.82),'#1a0610',.25),sh,c,lt(c,.3*k),lt(c,.66)]};
/* level of detail: 1 drops hairline veins and rim lights (garden thumbnails) */
let LOD=0;
/* attribute bag without empty values */
const AT=o=>{for(const k in o)if(o[k]==null)delete o[k];return o};

/* fine veins that follow the petal's own width profile (no clipping needed) */
function veinD(L,W,o={}){const n=o.vn||9,prof=o.prof||sinP(o.pw||.75),bend=(o.bend||0)*L,sp=o.spread??.8,len=o.vl??.88;let d='';
  for(let k=0;k<n;k++){const u=n===1?0:k/(n-1)*2-1,e=len*(1-.28*u*u)*R(.82,1.02),P=[];
    for(let i=0;i<=5;i++){const t=.03+e*i/5;P.push([u*W*prof(Math.min(.97,t))*sp+bend*t*t,-L*t])}d+=smooth(P,false)}return d}
/* painted petal v3: body, curvature, base shadow, veins, speckles, translucent rim, ink edge. cs=tones() */
function pp(par,L,W,cs,o={}){const g=G(par,AT({transform:o.tr})),d=o.d||petalD(L,W,o),sh=o.sh??1;
  E('path',{d,fill:lin([[0,o.bc||cs[1]],[o.mp??.42,cs[2]],[1,o.tc||cs[3]]],0,1,0,0)},g);
  if((o.cup??1)>0)E('path',{d,fill:lin([[0,cs[0],.32*sh],[.27,cs[0],0],[.52,'#fff',0],[.7,'#fff',.13*sh],[1,cs[0],.2*sh]],0,0,1,0)},g);
  else E('path',{d,fill:lin([[0,'#fff',.2*sh],[.24,'#fff',0],[.6,cs[0],0],[1,cs[0],.34*sh]],0,0,1,0)},g);
  if(o.base!==0)E('path',{d,fill:lin([[0,o.bk||cs[0],o.base??.5],[o.bl??.34,o.bk||cs[0],0]],0,1,0,0)},g);
  if(o.v&&!LOD)E('path',{d:veinD(L,W,{vn:o.v,prof:o.prof,pw:o.pw,bend:o.bend,spread:o.spread,vl:o.vl}),stroke:o.vc||cs[0],'stroke-width':o.vw??.45,'stroke-opacity':o.vo??.2,fill:'none','stroke-linecap':'round'},g);
  if(o.sp)specks(g,L,W,o.sp);
  if(o.rim!==0&&!LOD)E('path',{d,fill:'none',stroke:lin([[0,cs[4],0],[o.rs??.5,cs[4],0],[1,cs[4],o.rim??.7]],0,1,0,0),'stroke-width':o.rw??1.1},g);
  E('path',{d,fill:'none',stroke:cs[0],'stroke-width':o.sw??.5,'stroke-opacity':o.so??.5,'stroke-linejoin':'round'},g);return g}
/* specular highlight and soft contact shadow */
function glint(par,x,y,rx,ry,rot,op=.55){return E('ellipse',AT({cx:f(x),cy:f(y),rx:f(rx),ry:f(ry),fill:rad([[0,'#fff',op],[.55,'#fff',op*.3],[1,'#fff',0]]),transform:rot?`rotate(${f(rot)} ${f(x)} ${f(y)})`:null}),par)}
function ao(par,x,y,rx,ry,op=.35,c='#140608'){return E('ellipse',{cx:f(x),cy:f(y),rx:f(rx),ry:f(ry),fill:rad([[0,c,op],[.5,c,op*.55],[1,c,0]])},par)}
/* ribbon along a cubic bezier; normals flipped toward the light (upper left) so off>0 = lit side */
function ribbon(P,wf,off,n=22){const A=[],B=[];for(let i=0;i<=n;i++){const t=i/n,p=bz(P,t),q=bz(P,Math.min(1,t+.02)),o=bz(P,Math.max(0,t-.02)),dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;
  let nx=-dy/l,ny=dx/l;if(nx+ny>0){nx=-nx;ny=-ny}const w=wf(t),c=off?off(t):0,cx=p[0]+nx*c,cy=p[1]+ny*c;A.push(f(cx+nx*w)+','+f(cy+ny*w));B.push(f(cx-nx*w)+','+f(cy-ny*w))}
  return'M'+A.join('L')+'L'+B.reverse().join('L')+'Z'}
/* cylindrical stem: dark body, lit midtone, highlight, specular thread */
const SG=['#1f3818','#3a6328','#6a9444','#b9d684'];
function stem3(par,P,w0,w1,c=SG,n=22){if(c&&c.sv&&typeof svStem3==='function'&&P.length===4)return svStem3(par,P,w0,w1,c,n);const wf=t=>(w0+(w1-w0)*t)/2,g=G(par);
  E('path',{d:ribbon(P,wf,null,n),fill:c[0]},g);E('path',{d:ribbon(P,t=>wf(t)*.7,t=>wf(t)*.22,n),fill:c[1]},g);
  E('path',{d:ribbon(P,t=>wf(t)*.28,t=>wf(t)*.42,n),fill:c[2],opacity:.9},g);E('path',{d:ribbon(P,t=>wf(t)*.09,t=>wf(t)*.5,n),fill:c[3],opacity:.55},g);return g}
/* serrated outline (rose leaflets, nettles) */
function toothD(L,W,prof,nt,bend=0){const b=bend*L,side=s=>{const a=[];for(let i=1;i<=nt;i++){const t0=(i-.55)/nt*.95,t1=i/nt*.95;a.push([s*W*prof(t0)+b*t0*t0,-L*t0],[s*W*prof(t1)*.86+b*t1*t1,-L*(t1-.01)])}return a};
  const P=[[0,0],...side(1),[b,-L],...side(-1).reverse()];return'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}
/* leaf v3: two-tone fold along the midrib, paired veins, raised midrib, optional gloss & teeth */
const LG={rose:['#142410','#2a4a1c','#47722e','#86ad55','#a9c97a'],glauc:['#1b2a27','#37534b','#62857a','#9fbcb0','#c8dcd2'],dark:['#0b170f','#1a3121','#2e573a','#5f9262','#8fbf8a'],
  lime:['#25350d','#476419','#7e9f34','#bcd673','#dcefa0'],plum:['#170610','#351224','#57203c','#80405a','#b07a8e'],sage:['#26302a','#4a5c50','#7a8f80','#b3c4b6','#dbe6dc']};
function leaf3(par,L,W,cs,o={}){const prof=o.prof||sinP(o.pw??.7,.06),bend=(o.bend||0),g=G(par,AT({transform:o.tr})),d=o.teeth?toothD(L,W,prof,o.teeth,bend):petalD(L,W,Object.assign({n:12,tip:'point',rf:.012,rk:5},o,{prof})),b=bend*L;
  E('path',{d,fill:lin([[0,cs[1]],[.55,cs[2]],[1,cs[3]]],0,1,.3,0)},g);
  E('path',{d,fill:lin([[0,'#fff',.1],[.47,'#fff',0],[.5,cs[0],.18],[1,cs[0],.34]],0,0,1,0)},g);
  const nv=o.nv??6;let vd='';for(let i=1;i<=nv;i++){const t=i/(nv+1)*.9,y=-L*t,cx=b*t*t;for(const s of[-1,1]){const w=W*prof(Math.min(.97,t+.07))*.86;vd+=`M${f(cx)},${f(y)}Q${f(cx+s*w*.45)},${f(y-L*.02)} ${f(cx+s*w)},${f(y-L*(o.va??.1))}`}}
  if(nv)E('path',{d:vd,stroke:cs[4],'stroke-width':o.vw??.6,'stroke-opacity':o.vo??.42,fill:'none'},g);
  E('path',{d:taper([[0,0],[b*.12,-L*.33],[b*.48,-L*.66],[b*.92,-L*.96]],u=>Math.max(.22,(o.mr||1.3)*(1-u)),12),fill:cs[4],opacity:.75},g);
  if(o.gloss)glint(g,-W*.32+b*.2,-L*.46,W*.16,L*.2,-6,o.gloss);
  E('path',{d,fill:'none',stroke:cs[0],'stroke-width':o.sw??.6,'stroke-opacity':.6,'stroke-linejoin':'round'},g);return g}
/* crescent petal edge seen from above: horns at (+-w,0), rim bulging to -h; used for roses, ranunculus, camellia */
function cresc(par,w,h,c,o={}){const t=o.th??.55,d=`M${f(-w)},0Q0,${f(-h*2)} ${f(w)},0Q0,${f(-h*2*(1-t))} ${f(-w)},0Z`;
  E('path',AT({d,fill:lin([[0,c[0]],[.5,c[1]],[1,c[2]]],0,1,0,0),transform:o.tr}),par);
  if(o.rim!==0&&!LOD)E('path',AT({d:`M${f(-w*.8)},${f(-h*.38)}Q0,${f(-h*1.94)} ${f(w*.8)},${f(-h*.38)}`,fill:'none',stroke:c[3],'stroke-width':o.rw??.9,'stroke-opacity':o.rim??.75,'stroke-linecap':'round',transform:o.tr}),par)}
/* small stamen / filament with anther */
function stamen(par,x0,y0,x1,y1,c,an,r=1.6,w=.6){E('path',{d:`M${f(x0)},${f(y0)}Q${f((x0+x1)/2+(y1-y0)*.12)},${f((y0+y1)/2)} ${f(x1)},${f(y1)}`,stroke:c,'stroke-width':w,fill:'none','stroke-linecap':'round'},par);
  E('ellipse',{cx:f(x1),cy:f(y1),rx:f(r*.7),ry:f(r*1.25),fill:an,transform:`rotate(${f(Math.atan2(y1-y0,x1-x0)/D+90)} ${f(x1)} ${f(y1)})`},par)}
/* sparkle dust (nerine, gloriosa) */
function dust(){}
/* cylindrical club (anthurium / calla spadix) with rounded tip and floret texture */
function spadix(par,P,w0,w1,c0,c1,dots=1){const g=G(par),wf=t=>(w0+(w1-w0)*t)/2,e=bz(P,1);
  E('path',{d:ribbon(P,wf,null,16),fill:dk(c1,.35)},g);E('circle',{cx:f(e[0]),cy:f(e[1]),r:f(w1/2),fill:dk(c1,.35)},g);
  E('path',{d:ribbon(P,t=>wf(t)*.72,t=>wf(t)*.2,16),fill:lin([[0,c0],[1,c1]],0,1,0,0)},g);E('circle',{cx:f(e[0]),cy:f(e[1]),r:f(w1*.36),fill:c1},g);
  E('path',{d:ribbon(P,t=>wf(t)*.2,t=>wf(t)*.45,16),fill:'#fff',opacity:.38},g);
  if(dots){let dd='';const n=Math.round(w0*5);for(let i=1;i<n;i++){const u=i/n,a=bz(P,u),b=bz(P,Math.min(1,u+.01)),an=Math.atan2(b[1]-a[1],b[0]-a[0]),w=wf(u)*.62;
    for(const s of[-1,0,1]){if((i+s)%2)continue;const x=a[0]-Math.sin(an)*w*s*.8,y=a[1]+Math.cos(an)*w*s*.8;dd+=`M${f(x-.4)},${f(y)}a.4,.4 0 1,0 .8,0a.4,.4 0 1,0 -.8,0`}}
    E('path',{d:dd,fill:dk(c1,.45),opacity:.45},g)}return g}
