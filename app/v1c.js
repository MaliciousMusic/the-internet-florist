
/* ---------- surface textures, laid on the turned body (clipped to its silhouette), point by point on the curved surface ---------- */
const sPt=(S,h,ph)=>{const r=sRad(S,h);return[VX+r*Math.sin(ph),FL-h,Math.cos(ph),r]};
const lodN=n=>Math.round(n*(LOD?.35:1));
function txSpeck(g,S,o,H){const n=lodN(o.n),h0=o.band?o.band[0]*UPC:2,h1=o.band?o.band[1]*UPC:H-2;
  for(let i=0;i<n;i++){const ph=R(-1.5,1.5),[x,y,c]=sPt(S,R(h0,h1),ph),r=R(o.r[0],o.r[1])*UPC;E('ellipse',{cx:f(x),cy:f(y),rx:f(Math.max(.3,r*c)),ry:f(r),fill:pick(o.c),opacity:f(o.o*R(.55,1))},g)}
  for(let i=0;i<lodN(o.blots||0);i++){const ph=R(-1.3,1.3),[x,y,c]=sPt(S,R(h0,h1),ph),r=R(o.r[1]*1.6,o.r[1]*3.4)*UPC;let d='';
    for(let k=0;k<7;k++){const a=k/7*6.283,q=r*R(.6,1.1);d+=(k?'L':'M')+f(x+Math.cos(a)*q*c)+','+f(y+Math.sin(a)*q)}E('path',{d:d+'Z',fill:o.c[0],opacity:f(o.o*R(.5,.85))},g)}}
function txDash(g,S,o,H){for(let i=0;i<lodN(o.n);i++){const h=R(4,H-3),ph0=R(-1.55,1.4),r=sRad(S,h),L=R(o.l[0],o.l[1])*UPC,dph=L/Math.max(4,r),w=R(o.w[0],o.w[1])*UPC,P=[],wb=R(-1,1);
    for(let k=0;k<=4;k++){const ph=Math.min(1.55,ph0+dph*k/4),[x,y]=sPt(S,h+wb*Math.sin(k*1.4)*.8,ph);P.push(f(x)+','+f(y))}
    E('path',{d:'M'+P.join('L'),stroke:pick(o.c),'stroke-width':f(w*Math.max(.5,Math.cos(ph0))),'stroke-linecap':'round','stroke-opacity':f(R(.65,.95)),fill:'none'},g)}}
function txVeins(g,o,bb){for(let i=0;i<lodN(o.n);i++){const x0=R(bb[0]-30,bb[2]),y0=R(bb[1],bb[3]),a=(o.a+R(-14,14))*D,L=(bb[2]-bb[0])*R(.8,1.6),w=R(o.w[0],o.w[1]);let d=`M${f(x0)},${f(y0)}`;
    for(let k=1;k<=10;k++){const t=k/10,wb=Math.sin(t*R(4,7)+i)*w*1.4;d+=`L${f(x0+Math.cos(a)*L*t-Math.sin(a)*wb)},${f(y0+Math.sin(a)*L*t+Math.cos(a)*wb)}`}
    if(i%3===0)E('path',{d,stroke:o.l,'stroke-width':f(w*3.2),'stroke-opacity':.28,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
    E('path',{d,stroke:o.c,'stroke-width':f(w*R(.18,.55)),'stroke-opacity':f(o.o*R(.45,1)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g)}}
function txAgate(g,S,o,H){for(let i=0;i<lodN(o.n);i++){const h0=H*(.06+.9*i/o.n)+R(-4,4),A=R(2,7)*(1-.5*(1-h0/H)),k=R(1.5,3.2),p=R(0,6.3),w=R(1.5,8)*(.5+.5*h0/H),P=[];
    for(let j=0;j<=24;j++){const ph=-1.55+3.1*j/24,[x,y]=sPt(S,Math.max(1,Math.min(H-1,h0+A*Math.sin(k*ph+p)+A*.5*Math.sin(2.3*k*ph+p*1.7))),ph);P.push(f(x)+','+f(y))}
    E('path',{d:'M'+P.join('L'),stroke:o.c[i%o.c.length],'stroke-width':f(w),'stroke-opacity':f(R(.45,.8)),fill:'none','stroke-linejoin':'round'},g)}}
function txCells(g,S,o,H){for(let i=0;i<lodN(9);i++){const[x,y,c]=sPt(S,R(H*.12,H*.85),R(-1.2,1.2)),r=R(2,4)*UPC;E('ellipse',{cx:f(x),cy:f(y),rx:f(r*c),ry:f(r*.8),fill:i%3?o.rust:o.olive,opacity:.32},g)}
  for(let i=0;i<lodN(o.n);i++){const h=R(2,H-2),ph=R(-1.52,1.52),[x,y,c]=sPt(S,h,ph),s=R(.32,.75)*UPC*.5*(h>H*.8?1.25:1);
    E('ellipse',{cx:f(x),cy:f(y),rx:f(Math.max(.4,s*c)),ry:f(s*(h>H*.8?1.3:1.1)),fill:i%7?o.c:mix(o.c,o.rust,.6),stroke:o.rim,'stroke-width':f(Math.max(.35,s*.28)),'stroke-opacity':.85},g)}}
function txDrips(g,S,o,H){const y0=o.y0*UPC,y1=o.y1*UPC,top=[],bot=[];for(let j=0;j<=30;j++){const ph=-1.55+3.1*j/30;top.push(sPt(S,y1+R(-1.5,2.5),ph));bot.push(sPt(S,y0+R(-2,1.5),ph))}
  E('path',{d:'M'+top.map(p=>f(p[0])+','+f(p[1])).join('L')+'L'+bot.reverse().map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:o.c,opacity:.92},g);
  for(let i=0;i<lodN(o.n);i++){const ph=R(-1.4,1.4),[x,y,c]=sPt(S,y0+1,ph),L=R(o.l[0],o.l[1])*UPC,w=R(.35,.6)*UPC*c;E('path',{d:`M${f(x-w)},${f(y-1)}C${f(x-w)},${f(y+L*.6)} ${f(x-w*.6)},${f(y+L)} ${f(x)},${f(y+L)}C${f(x+w*.6)},${f(y+L)} ${f(x+w)},${f(y+L*.6)} ${f(x+w)},${f(y-1)}Z`,fill:o.c,opacity:.9},g)}}
function txPatina(g,S,o,H){for(let i=0;i<lodN(o.n);i++){const[x,y,c]=sPt(S,R(H*.3,H*.95),R(-1.3,1.3)),r=R(3,9);E('ellipse',{cx:f(x),cy:f(y),rx:f(r*c*1.3),ry:f(r),fill:o.c,opacity:f(R(.18,.38))},g)}
  for(let i=0;i<lodN(14);i++){const[x,y,c]=sPt(S,R(H*.2,H*.9),R(-1.2,1.2));E('ellipse',{cx:f(x),cy:f(y),rx:f(1.6*c),ry:1.2,fill:'#ffffff',opacity:.22},g)}}
function txBrush(g,S,o,H){let dl='',dd='';for(let i=0;i<lodN(o.n);i++){const h=R(2,H-2),r=sRad(S,h),ry=vRy(r),P=[];for(let j=0;j<=12;j++){const ph=-1.5+3*j/12;P.push(f(VX+r*Math.sin(ph))+','+f(FL-h+ry*Math.cos(ph)))}
    if(i%2)dl+='M'+P.join('L');else dd+='M'+P.join('L')}E('path',{d:dl,stroke:'#ffffff','stroke-width':.45,'stroke-opacity':.1,fill:'none'},g);E('path',{d:dd,stroke:'#000000','stroke-width':.45,'stroke-opacity':.07,fill:'none'},g)}
function txRings(g,S,o,H){for(let h=o.step*UPC*.6;h<H-3;h+=o.step*UPC*R(.85,1.15)){const r=sRad(S,h),ry=vRy(r),P=[],Q=[];for(let j=0;j<=14;j++){const ph=-1.52+3.04*j/14;P.push(f(VX+r*Math.sin(ph))+','+f(FL-h+ry*Math.cos(ph)));Q.push(f(VX+r*Math.sin(ph))+','+f(FL-h+1.1+ry*Math.cos(ph)))}
    const rid=Math.abs(h-o.ridge*UPC)<o.step*UPC*.5;E('path',{d:'M'+P.join('L'),stroke:'#2a160c','stroke-width':rid?1.3:.7,'stroke-opacity':rid?.4:.22,fill:'none'},g);E('path',{d:'M'+Q.join('L'),stroke:'#ffffff','stroke-width':.6,'stroke-opacity':.14,fill:'none'},g)}}
function txLines(g,S,v,o,H){const n=v.tp.lobes.n;for(let k=0;k<n;k++){const phg=-Math.PI/2+((k+.5)/n)*2*Math.PI+R(-.05,.05);if(Math.abs(phg)>1.45)continue;const P=[];
    for(let j=0;j<=16;j++){const h=H*j/16,ph=phg*(.55+.45*j/16)+Math.sin(j*.9+k)*.025,[x,y]=sPt(S,h,ph);P.push(f(x)+','+f(y))}
    E('path',{d:'M'+P.join('L'),stroke:o.c,'stroke-width':f(o.w*UPC*Math.max(.3,Math.cos(phg))),'stroke-linecap':'round','stroke-opacity':.92,fill:'none'},g)}}
function txEdges(g,S,v,col,op){const n=v.tp.facets,P0=[];for(let k=0;k<n;k++){const ph=-Math.PI+((k+.5)/n)*2*Math.PI;if(Math.abs(ph)>1.5)continue;const P=[];
    for(let j=0;j<=24;j++){const h=S[S.length-1][0]*j/24,[x,y]=sPt(S,h,ph);P.push(f(x)+','+f(y))}E('path',{d:'M'+P.join('L'),stroke:col,'stroke-width':1,'stroke-opacity':op,fill:'none'},g)}}
function txDimples(g,S,o,H){const id='dm'+(gid++),gr=E('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},GDEF||defs);E('stop',{offset:0,'stop-color':'#2a2420','stop-opacity':.28},gr);E('stop',{offset:.45,'stop-color':'#2a2420','stop-opacity':0},gr);E('stop',{offset:1,'stop-color':'#ffffff','stop-opacity':.42},gr);
  const rows=LOD?Math.round(o.rows*.5):o.rows,hr=(H-4)/rows;for(let j=0;j<rows;j++){const h=3+hr*(j+.5),r=sRad(S,h),n=LOD?Math.round(o.around*.5):o.around;
    for(let k=0;k<n;k++){const ph=-Math.PI+((k+(j%2)*.5)/n)*2*Math.PI;if(Math.abs(ph)>1.45)continue;const[x,y,c]=sPt(S,h,ph),w=Math.PI*r/n*.92*c;E('ellipse',{cx:f(x),cy:f(y),rx:f(Math.max(.4,w)),ry:f(hr*.46),fill:`url(#${id})`},g)}}}
function txWash(g,o,bb){const id='rw'+(gid++),gr=E('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},GDEF||defs);E('stop',{offset:0,'stop-color':o.c,'stop-opacity':.75},gr);E('stop',{offset:.4,'stop-color':o.c,'stop-opacity':.12},gr);E('stop',{offset:1,'stop-color':o.c,'stop-opacity':0},gr);
  E('rect',{x:f(bb[0]),y:f(bb[1]-4),width:f(bb[2]-bb[0]),height:f(bb[3]-bb[1]+4),fill:`url(#${id})`},g)}
/* blue-and-white patchwork: porcelain shards, each with its own motif (prunus branch, cloud scrolls, key fret, dots, waves, lotus), thin raised seams */
function poly2clip(P,a,b,c){const out=[];for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],dp=a*p[0]+b*p[1]-c,dq=a*q[0]+b*q[1]-c;if(dp<=0)out.push(p);if(dp*dq<0){const t=dp/(dp-dq);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t])}}return out}
function voronoi(sites,box){return sites.map((s,i)=>{let P=[[box[0],box[1]],[box[2],box[1]],[box[2],box[3]],[box[0],box[3]]];for(let j=0;j<sites.length;j++){if(j===i)continue;const t=sites[j],a=t[0]-s[0],b=t[1]-s[1];P=poly2clip(P,a,b,(a*(s[0]+t[0])+b*(s[1]+t[1]))/2);if(!P.length)break}return P})}
function txChina(g,S,o,H,bb){const n=lodN(o.n),sites=[];for(let i=0;i<n;i++){const ph=-1.45+2.9*(i%4+R(.1,.9))/4,h=H*(Math.floor(i/4)+R(.15,.85))/Math.ceil(n/4);sites.push(sPt(S,Math.min(H-2,h),ph).slice(0,2))}
  const cells=voronoi(sites,[bb[0]-2,bb[1]-2,bb[2]+2,bb[3]+2]),c=o.c,kinds=['branch','scroll','fret','dots','waves','lotus','plain','plain','bands'];
  cells.forEach((P,i)=>{if(P.length<3)return;const id='ch'+(gid++),cp=E('clipPath',{id},GDEF||defs);E('path',{d:'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'},cp);
    const k=G(g,{'clip-path':`url(#${id})`}),kd=kinds[(i*5+3)%kinds.length],cx=P.reduce((a,p)=>a+p[0],0)/P.length,cy=P.reduce((a,p)=>a+p[1],0)/P.length,sc=R(.7,1.3);
    if(kd==='branch'){let d=`M${f(cx-30*sc)},${f(cy+20*sc)}`;for(let j=1;j<=5;j++)d+=`Q${f(cx-30*sc+j*12*sc+R(-5,5))},${f(cy+20*sc-j*8*sc+R(-6,6))} ${f(cx-30*sc+j*13*sc)},${f(cy+20*sc-j*9*sc)}`;
      E('path',{d,stroke:c,'stroke-width':2.2*sc,fill:'none','stroke-linecap':'round'},k);for(let j=0;j<5;j++){const x=cx+R(-22,22)*sc,y=cy+R(-18,14)*sc;for(let p=0;p<5;p++){const a=p/5*6.283;E('circle',{cx:f(x+Math.cos(a)*2.4*sc),cy:f(y+Math.sin(a)*2.4*sc),r:f(1.6*sc),fill:'none',stroke:c,'stroke-width':.7},k)}}}
    else if(kd==='scroll'){for(let j=0;j<3;j++){const x=cx+R(-18,18),y=cy+R(-14,14),r0=R(4,8)*sc;E('path',{d:`M${f(x)},${f(y)}a${f(r0)},${f(r0)} 0 1,1 ${f(r0*1.4)},${f(-r0*.6)}a${f(r0*.6)},${f(r0*.6)} 0 1,1 ${f(-r0*.7)},${f(r0*.9)}`,stroke:c,'stroke-width':1.4,fill:'none'},k)}}
    else if(kd==='fret'){let d='';for(let y=bb[1];y<bb[3];y+=9)for(let x=bb[0];x<bb[2];x+=9)d+=`M${f(x)},${f(y+7)}v-6h6v4h-3`;E('path',{d,stroke:c,'stroke-width':1.1,fill:'none'},k)}
    else if(kd==='dots'){let d='';for(let y=bb[1];y<bb[3];y+=5)for(let x=bb[0]+(Math.round(y)%10?2.5:0);x<bb[2];x+=5)d+=`M${f(x)},${f(y)}h.01`;E('path',{d,stroke:c,'stroke-width':1.6,'stroke-linecap':'round',fill:'none'},k)}
    else if(kd==='waves'){let d='';for(let y=bb[1];y<bb[3];y+=6){d+=`M${f(bb[0])},${f(y)}`;for(let x=bb[0];x<bb[2];x+=8)d+=`q4,-4 8,0`}E('path',{d,stroke:c,'stroke-width':1,fill:'none'},k)}
    else if(kd==='lotus'){E('circle',{cx:f(cx),cy:f(cy),r:f(14*sc),fill:c,opacity:.85},k);for(let p=0;p<8;p++){const a=p/8*6.283;E('ellipse',{cx:f(cx+Math.cos(a)*7*sc),cy:f(cy+Math.sin(a)*7*sc),rx:f(4*sc),ry:f(2*sc),fill:'#f4efe6',transform:`rotate(${f(a/D)} ${f(cx+Math.cos(a)*7*sc)} ${f(cy+Math.sin(a)*7*sc)})`},k)}}
    else if(kd==='bands'){for(let j=0;j<4;j++)E('path',{d:`M${f(bb[0])},${f(cy-12+j*7)}H${f(bb[2])}`,stroke:c,'stroke-width':j%2?.8:2.4,'stroke-opacity':.9},k)}
    E('path',{d:'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:'none',stroke:'#ffffff','stroke-width':1.1,'stroke-opacity':.55},g);E('path',{d:'M'+P.map(p=>f(p[0]+.6)+','+f(p[1]+.8)).join('L')+'Z',fill:'none',stroke:'#8a8478','stroke-width':.5,'stroke-opacity':.35},g)})}
/* a glaze reflects the studio window: a soft tall panel that follows the curve of the body (wide on the belly, gone at the neck and the foot), fading at both ends, with a crisp
   highlight where it meets the shoulder and a faint bounce of light along the shaded edge; built from nested bands of falling opacity, no blur */
function glazeSheen(g,v,S){const H=S[S.length-1][0],dark=lum255(vBase(v,H*.6))<110,id='gz'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:0,y1:f(FL-H*.92),x2:0,y2:f(FL-H*.12)},GDEF||defs);
  [[0,0],[.18,1],[.55,.85],[.82,.35],[1,0]].forEach(([o,a])=>E('stop',{offset:o,'stop-color':'#ffffff','stop-opacity':a},gr));
  const band=(ph,wk,h0,h1)=>{const L=[],Rt=[];for(let i=0;i<=24;i++){const h=h0+(h1-h0)*i/24,r=sRad(S,h),slope=(sRad(S,Math.min(H,h+2))-sRad(S,Math.max(0,h-2)))/4,face=sm01((.35-slope)/.9),w=r*wk*face;
      const x=VX+r*Math.sin(ph);L.push([x-w,FL-h]);Rt.push([x+w*.7,FL-h])}return'M'+L.map(p=>f(p[0])+','+f(p[1])).join('L')+'L'+Rt.reverse().map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'};
  const k=G(g,{'clip-path':`url(#${vClip(latheD(S))})`}),op=dark?1:.75;
  for(const[wk,a]of[[.2,.1],[.13,.16],[.07,.26],[.03,.32]])E('path',{d:band(-.5,wk,H*.14,H*.9),fill:`url(#${id})`,opacity:f(a*op)},k);
  /* the crisp highlight on the shoulder, where the light falls most directly */
  let hb=H*.62,best=-1;for(let i=0;i<=30;i++){const h=H*(.35+.55*i/30),r=sRad(S,h),slope=(sRad(S,Math.min(H,h+2))-sRad(S,Math.max(0,h-2)))/4,sc=r*(1-Math.abs(slope+.35));if(sc>best){best=sc;hb=h}}
  const rb=sRad(S,hb),xb=VX+rb*Math.sin(-.5);E('ellipse',{cx:f(xb),cy:f(FL-hb),rx:f(Math.max(1.2,rb*.035)),ry:f(Math.max(2.4,rb*.09)),fill:'#ffffff',opacity:f(dark?.85:.6),transform:`rotate(-8 ${f(xb)} ${f(FL-hb)})`},k);
  /* bounce light along the shaded right edge */
  E('path',{d:band(1.18,.06,H*.2,H*.8),fill:`url(#${id})`,opacity:f(dark?.13:.08)},k)}
const lum255=c=>{const[r,gg,b]=hx(c);return .3*r+.59*gg+.11*b};
/* pin-tucks: pairs of fine stitched lines running up the body (o.ph their angles, o.h0..o.h1 fractions of the height, o.c the thread) */
function txStitch(g,S,o,H){let d='';for(const ph of o.ph)for(const dp of[-.035,.035]){const P=[];for(let i=0;i<=12;i++){const[x,y]=sPt(S,(o.h0+(o.h1-o.h0)*i/12)*H,ph+dp);P.push(f(x)+','+f(y))}d+='M'+P.join('L')}
  E('path',{d,stroke:o.c||'#ffffff','stroke-width':o.w||.9,'stroke-dasharray':o.da||'2.4 2','stroke-opacity':o.o??.8,fill:'none','stroke-linecap':'round'},g)}
/* adhesive plasters stuck on the body, alone or crossed (o.list: [height fraction, angle, rotation in degrees, length in cm]): a rounded strip,
   its perforated wings and its pad, foreshortened toward the sides of the vessel, with a crisp little shadow */
function txPlasters(g,S,o,H){const c=o.c||'#e9c39c',cd=shd(c,-.2);for(const[hf,ph,rot,lc]of o.list){const[x,y,cs]=sPt(S,hf*H,ph);if(cs<.2)continue;const L=(lc||7)*UPC,W=L*.27,
    k=G(g,{transform:`translate(${f(x)},${f(y)}) scale(${f(cs)},1) rotate(${f(rot)})`});
    E('rect',{x:f(-L/2+.8),y:f(-W/2+1.1),width:f(L),height:f(W),rx:f(W/2),fill:'#3a2418','fill-opacity':.14},k);
    E('rect',{x:f(-L/2),y:f(-W/2),width:f(L),height:f(W),rx:f(W/2),fill:c,stroke:cd,'stroke-width':.5},k);
    E('rect',{x:f(-L*.17),y:f(-W*.36),width:f(L*.34),height:f(W*.72),rx:f(W*.14),fill:o.pad||lt(c,.45),stroke:cd,'stroke-width':.35,'stroke-opacity':.7},k);
    if(!LOD){let d='';for(const sd of[-1,1])for(let i=0;i<3;i++)for(let j=-1;j<=1;j++){const px=sd*(L*.24+i*L*.065),py=j*W*.24;d+=`M${f(px-.35)},${f(py)}a.35,.35 0 1,0 .7,0a.35,.35 0 1,0 -.7,0`}
      E('path',{d,fill:cd,'fill-opacity':.55},k)}}}
/* broderie anglaise: a gathered collar of eyelet lace round the vessel between two heights (o.h0, o.h1 fractions), flaring a little out of the
   silhouette, its lower edge scalloped; soft gathers run down to each scallop, and it is pierced with buttonholed eyelets (the glaze shows through),
   little flowers of eyelets round a dot alternating with single drops, above a row of tiny embroidered dots; o.c its colour */
function txLace(g,S,o,H){const h0=o.h0*H,h1=o.h1*H,bh=h1-h0,n=o.n||12,c=o.c,cd=shd(c,-.25),cl=lt(c,.35),fl=o.fl??.07,P=[],Q=[],hole=shd(o.hole||'#ffffff',-.07),
    pt=(h,ph,k)=>{const r=sRad(S,h)*(1+k),ry=vRy(r);return[VX+r*Math.sin(ph),FL-h+ry*Math.cos(ph)]},
    sc=ph=>Math.abs(Math.sin((ph+1.57)/3.14*n*Math.PI)),bot=ph=>pt(h0-sc(ph)*bh*.3,ph,fl);
  for(let j=0;j<=48;j++)P.push(pt(h1,-1.57+3.14*j/48,fl*.3));
  const nq=n*12;for(let j=nq;j>=0;j--)Q.push(bot(-1.57+3.14*j/nq));
  const r0=sRad(S,h0)*(1+fl);E('path',{d:'M'+P.concat(Q).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:ugrad(VX-r0,0,VX+r0,0,[[0,cd],[.32,c],[.58,cl],[1,cd]]),stroke:cd,'stroke-width':.6,'stroke-opacity':.7},g);
  if(!LOD){let dk='',dl='';const ng=n*4;for(let i=0;i<ng;i++){const ph=-1.5+3*(i+.5)/ng,a=pt(h1,ph,fl*.3),b=bot(ph),sg=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1]-.6)}`;if(i%2)dl+=sg;else dk+=sg}
    E('path',{d:dk,stroke:cd,'stroke-width':1.1,'stroke-opacity':.2,fill:'none'},g);E('path',{d:dl,stroke:cl,'stroke-width':.9,'stroke-opacity':.4,fill:'none'},g);
    E('path',{d:'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:cd,'stroke-width':1.3,'stroke-opacity':.45,fill:'none'},g)}
  /* the eyelets, one motif per gather pair, each foreshortened round the body */
  const ov=(cx,cy,mj,mn,an)=>{const ux=Math.cos(an),uy=Math.sin(an),dg=an*57.2958;return`M${f(cx+mj*ux)},${f(cy+mj*uy)}A${f(mj)},${f(mn)} ${f(dg)} 1,0 ${f(cx-mj*ux)},${f(cy-mj*uy)}A${f(mj)},${f(mn)} ${f(dg)} 1,0 ${f(cx+mj*ux)},${f(cy+mj*uy)}Z`};
  const hm=h0+bh*.56,nm=n*2;let dd='';
  for(let i=0;i<nm;i++){const ph=-1.45+2.9*(i+.5)/nm,cs=Math.cos(ph);if(cs<.18)continue;const[x,y]=pt(hm,ph,fl*.7);let d='';
    if(i%2===0){d+=ov(0,0,bh*.075,bh*.075,0);for(let k=0;k<6;k++){const an=k*1.0472+.26;d+=ov(Math.cos(an)*bh*.2,Math.sin(an)*bh*.2,bh*.1,bh*.05,an)}}
    else d+=ov(0,0,bh*.17,bh*.085,1.5708);
    E('path',{d,transform:`translate(${f(x)},${f(y)}) scale(${f(cs)},1)`,fill:hole,stroke:cd,'stroke-width':.6,'stroke-opacity':.8},g);
    const[x2,y2]=pt(h0+bh*.1,ph,fl*.95);dd+=`M${f(x2-.55)},${f(y2)}a.55,.55 0 1,0 1.1,0a.55,.55 0 1,0 -1.1,0`}
  if(!LOD&&dd)E('path',{d:dd,fill:cl,'fill-opacity':.85},g)}
/* the textures of one turned vessel */
function vTextures(g,v,S){const tp=v.tp||{},H=S[S.length-1][0],bb=[VX-Math.max(...S.map(s=>s[1])),FL-H,VX+Math.max(...S.map(s=>s[1])),FL],k=G(g,{'clip-path':`url(#${vClip(latheD(S))})`});
  if(tp.patina)txPatina(k,S,tp.patina,H);if(tp.agate)txAgate(k,S,tp.agate,H);if(tp.cells2)txCells(k,S,tp.cells2,H);if(tp.veins)txVeins(k,tp.veins,bb);if(tp.china)txChina(k,S,tp.china,H,bb);
  if(tp.drips)txDrips(k,S,tp.drips,H);if(tp.speck)txSpeck(k,S,tp.speck,H);if(tp.dash)txDash(k,S,tp.dash,H);if(tp.brush)txBrush(k,S,tp.brush,H);if(tp.rings)txRings(k,S,tp.rings,H);
  if(v.mat==='gloss')glazeSheen(g,v,S);if(tp.lines)txLines(k,S,v,tp.lines,H);if(tp.dimples)txDimples(k,S,tp.dimples,H);if(tp.rimwash)txWash(k,tp.rimwash,bb);if(tp.facets)txEdges(k,S,v,tp.edges||lt(v.col,.4),tp.edges?.92:.3);
  if(tp.stitch)txStitch(k,S,tp.stitch,H);if(tp.plasters)txPlasters(k,S,tp.plasters,H);if(tp.lace)txLace(g,S,tp.lace,H);
  return k}
