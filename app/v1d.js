
/* ---------- sculpted vessels drawn from their measured front outline (head, faceted heart, oval and lobed suibans) ---------- */
function olSpan(P,h){const xs=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];if((a[1]-h)*(b[1]-h)<=0&&a[1]!==b[1])xs.push(a[0]+(b[0]-a[0])*(h-a[1])/(b[1]-a[1]))}return xs.length?[Math.min(...xs),Math.max(...xs)]:null}
const olD=P=>'M'+P.map(([x,h])=>f(VX+x)+','+f(FL-h)).join('L')+'Z';
function vOutline(g,v,back,front){const ol=v.ol,P=ol.pts,H=v.h,tp=v.tp||{},mx=VX+(v.mx||0),mh=v.mh,mw=Math.max(4,(ol.mouth[1]-ol.mouth[0])/2),ry=v.fam==='sculpture'&&ol.d<H?Math.max(2.5,ol.d/2*.16):vRy(mw),top=FL-mh;
  if(back){const S=[];for(let i=0;i<=24;i++){const h=H*i/24,sp=olSpan(P,h);S.push([h,sp?(sp[1]-sp[0])/2:1])}vShadow(g,S,.3);
    const ir=Math.max(2,mw-(v.lipw||3)),iry=ry*ir/mw;E('ellipse',{cx:f(mx),cy:f(top),rx:f(ir),ry:f(iry),fill:ir>26?lin([[0,dk(v.col,.08)],[.5,dk(v.col,.22)],[1,dk(v.col,.5)]],0,0,0,1):dk(v.col,.72)},g);
    E('path',{d:`M${f(mx-mw)},${f(top)}A${f(mw)},${f(ry)} 0 0 1 ${f(mx+mw)},${f(top)}L${f(mx+ir)},${f(top)}A${f(ir)},${f(iry)} 0 0 0 ${f(mx-ir)},${f(top)}Z`,fill:lt(v.col,.1)},g)}
  if(!front)return;const k=G(g,{'clip-path':`url(#${vClip(olD(P))})`}),n=LOD?26:70,K=LOD?7:tp.lobes?41:17;
  if(tp.cells)vCells(k,v,P,H);
  else for(let i=0;i<n;i++){const h0=H*i/n,h1=H*(i+1)/n,sp=olSpan(P,(h0+h1)/2);if(!sp)continue;const s0=olSpan(P,Math.max(0,h0-H/n)),s1=olSpan(P,Math.min(H,h1+H/n)),wp=s0&&s1?((s1[1]-s1[0])-(s0[1]-s0[0]))/2/(H*2/n):0,
      id='vo'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:f(VX+sp[0]),x2:f(VX+sp[1]),y1:0,y2:0},GDEF||defs),lob=tp.lobes&&h0>=tp.lobes.y0*UPC?tp.lobes:null;
    for(let j=0;j<K;j++){const u=-1+2*j/(K-1),[hex,al]=vShade(v,vBase(v,h0),u,wp,{lob});E('stop',{offset:f(j/(K-1)),'stop-color':hex,'stop-opacity':f(al)},gr)}
    E('rect',{x:f(VX+sp[0]-2),y:f(FL-h1-.6),width:f(sp[1]-sp[0]+4),height:f(h1-h0+1.2),fill:`url(#${id})`},k)}
  const bb=[VX+Math.min(...P.map(p=>p[0])),FL-H,VX+Math.max(...P.map(p=>p[0])),FL];
  if(tp.veins)txVeins(k,tp.veins,bb);if(tp.rimwash)txWash(k,tp.rimwash,bb);if(tp.paint==='suiban')paintSuiban(k,v,bb);if(tp.face)carveFace(k,v,P,H);
  E('path',{d:olD(P),fill:'none',stroke:dk(v.col,.45),'stroke-width':.7,'stroke-opacity':.45},g);
  /* the front lip at the mouth */
  const ir=Math.max(2,mw-(v.lipw||3)),iry=ry*ir/mw;E('path',{d:`M${f(mx+mw)},${f(top)}A${f(mw)},${f(ry)} 0 0 1 ${f(mx-mw)},${f(top)}L${f(mx-ir)},${f(top)}A${f(ir)},${f(iry)} 0 0 0 ${f(mx+ir)},${f(top)}Z`,fill:lin([[0,lt(v.col,.18)],[.4,lt(v.col,.3)],[1,dk(v.col,.15)]],0,0,1,0)},g)}
/* the head vase: a closed eye, the ear and the parting of the lips, cut shallow into the stone on the profile side */
function carveFace(k,v,P,H){const at=h=>olSpan(P,h)||[0,0],cut=dk(v.col,.45),lit=lt(v.col,.35),[el]=at(H*.74),[ll]=at(H*.6),ex=VX+el+H*.16,ey=FL-H*.74;
  E('path',{d:`M${f(ex-9)},${f(ey)}q9,5 18,0`,stroke:cut,'stroke-width':1.3,fill:'none','stroke-linecap':'round'},k);E('path',{d:`M${f(ex-9)},${f(ey+1.3)}q9,5 18,0`,stroke:lit,'stroke-width':.6,'stroke-opacity':.6,fill:'none'},k);
  E('path',{d:`M${f(ex-7)},${f(ey-7)}q8,-4 17,-1`,stroke:cut,'stroke-width':.8,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);
  E('path',{d:`M${f(VX+ll+3)},${f(FL-H*.6)}q6,1 9,-1`,stroke:cut,'stroke-width':1.1,fill:'none','stroke-linecap':'round'},k);
  const[,er]=at(H*.7),ax=VX+er-H*.13,ay=FL-H*.7;E('path',{d:`M${f(ax)},${f(ay-9)}c7,-2 10,6 7,12c-2,4 -6,5 -8,3`,stroke:cut,'stroke-width':1.2,fill:'none','stroke-linecap':'round'},k);
  E('path',{d:`M${f(ax+1.5)},${f(ay-9.5)}c7,-2 10,6 7,12`,stroke:lit,'stroke-width':.6,'stroke-opacity':.5,fill:'none'},k)}
/* chisel-cut facets (the stone heart): flat planes, each turned to the light at its own angle, with lighter edges */
function vCells(k,v,P,H){const tp=v.tp.cells,xs=P.map(p=>p[0]),x0=Math.min(...xs),x1=Math.max(...xs),W=x1-x0,sites=[];
  for(let i=0;i<tp.n;i++){let x,h;for(let t=0;t<40;t++){x=R(x0,x1);h=R(0,H);const sp=olSpan(P,h);if(sp&&x>sp[0]&&x<sp[1])break}sites.push([VX+x,FL-h])}
  const cells=voronoi(sites,[VX+x0-4,FL-H-4,VX+x1+4,FL+4]),cx=VX+(x0+x1)/2,cy=FL-H*.5;
  cells.forEach((C,i)=>{if(C.length<3)return;const m=C.reduce((a,p)=>[a[0]+p[0]/C.length,a[1]+p[1]/C.length],[0,0]),nx=(m[0]-cx)/(W*.5)*.85+R(-.3,.3),ny=-(m[1]-cy)/(H*.5)*.55+R(-.3,.3),
      nn=nz3([nx,ny,1]),I=Math.max(0,nn[0]*tp.light[0]+nn[1]*-tp.light[1]+nn[2]*.55),col=mix(tp.dark,tp.lit,Math.min(1,.08+I*.95));
    E('path',{d:'M'+C.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:col,stroke:tp.edge,'stroke-width':.8,'stroke-opacity':.22+.3*I,'stroke-linejoin':'round'},k);
    if(i%5===1&&!LOD){let d='';const a=R(0,3.14);for(let j=-6;j<=6;j++)d+=`M${f(m[0]+Math.cos(a)*j*3-Math.sin(a)*14)},${f(m[1]+Math.sin(a)*j*3+Math.cos(a)*14)}l${f(Math.sin(a)*28)},${f(-Math.cos(a)*28)}`;E('path',{d,stroke:tp.edge,'stroke-width':.4,'stroke-opacity':.18},k)}})}
/* the painted suiban: five small scholar's objects tied with ribbons, in fine brush lines */
function paintSuiban(k,v,bb){const y=bb[3]-(bb[3]-bb[1])*.5,W=bb[2]-bb[0],c=v.col2||'#5d8590';
  const M=[(x)=>{E('path',{d:`M${f(x-12)},${f(y+9)}L${f(x+12)},${f(y-8)}`,stroke:'#7a5a3a','stroke-width':1.6,'stroke-linecap':'round'},k);E('path',{d:`M${f(x-4)},${f(y+3)}q6,-8 10,0q-4,6 -10,0`,stroke:c,'stroke-width':1.2,fill:'none'},k);E('circle',{cx:f(x+9),cy:f(y+9),r:2.2,fill:'#c0392b'},k)},
    (x)=>{E('rect',{x:f(x-11),y:f(y-6),width:22,height:12,rx:1.2,fill:'#5a5aa0',opacity:.9},k);E('path',{d:`M${f(x-11)},${f(y)}H${f(x+11)}M${f(x)},${f(y-6)}V${f(y+6)}`,stroke:'#d89a7a','stroke-width':1.4},k)},
    (x)=>{E('rect',{x:f(x-14),y:f(y-2),width:28,height:4,rx:2,fill:'#e2c24a'},k);for(let i=0;i<5;i++)E('path',{d:`M${f(x-12+i*6)},${f(y-2)}v4`,stroke:'#2a2a2a','stroke-width':1},k);E('path',{d:`M${f(x+6)},${f(y+2)}q2,8 -2,12M${f(x+8)},${f(y+2)}q4,7 2,12`,stroke:'#4a6ab0','stroke-width':1,fill:'none'},k)},
    (x)=>{E('path',{d:`M${f(x-12)},${f(y+8)}q12,-7 24,0`,stroke:'#e8a0a8','stroke-width':3,fill:'none','stroke-linecap':'round'},k);E('path',{d:`M${f(x-7)},${f(y+5)}h14l-2,-9h-10z`,fill:'#b8b848'},k);E('path',{d:`M${f(x-2)},${f(y-4)}q-2,-6 2,-9`,stroke:'#9a9a9a','stroke-width':.8,fill:'none'},k)},
    (x)=>{E('path',{d:`M${f(x-5)},${f(y+8)}q-3,-8 2,-12h6q5,4 2,12z`,fill:'#3f6ab8'},k);for(let i=0;i<3;i++)E('circle',{cx:f(x-4+i*4),cy:f(y-7-i%2*2),r:2.2,fill:'#c8323a'},k);E('path',{d:`M${f(x-5)},${f(y+2)}q-6,2 -8,6`,stroke:'#d89a7a','stroke-width':1,fill:'none'},k)}];
  M.forEach((fn,i)=>fn(bb[0]+W*(.14+.18*i)))}
/* ---------- the white column: a monolith with a square opening on top ---------- */
function vBox(g,v,back,front){const w=v.box.w/2,d=v.box.d*.16,H=v.h,top=FL-H,c=v.col,wall=Math.max(4,w-v.mo);
  if(back){E('path',{d:`M${f(VX-w)},${f(top)}L${f(VX+w)},${f(top)}L${f(VX+w*.94)},${f(top-d)}L${f(VX-w*.94)},${f(top-d)}Z`,fill:lin([lt(c,.04),dk(c,.06)],0,1,0,0)},g);
    E('path',{d:`M${f(VX-w+wall)},${f(top-wall*.16)}L${f(VX+w-wall)},${f(top-wall*.16)}L${f(VX+w*.94-wall)},${f(top-d+wall*.16)}L${f(VX-w*.94+wall)},${f(top-d+wall*.16)}Z`,fill:lin([dk(c,.55),dk(c,.75)],0,1,0,0)},g);
    E('path',{d:`M${f(VX+w)},${FL}L${f(VX+w+H*.62)},${f(FL-H*.1)}L${f(VX+w+H*.62-w*2)},${f(FL-H*.1-4)}L${f(VX-w)},${FL}Z`,fill:'#1e140e',opacity:.14},g)}
  if(!front)return;E('rect',{x:f(VX-w),y:f(top),width:f(w*2),height:f(H),fill:lin([[0,dk(c,.06)],[.22,lt(c,.05)],[.75,c],[1,dk(c,.14)]],0,0,1,0)},g);
  E('rect',{x:f(VX-w),y:f(top),width:f(w*2),height:f(H),fill:lin([[0,'#ffffff',.18],[.25,'#ffffff',0],[1,'#000000',.08]],0,0,0,1)},g);
  E('path',{d:`M${f(VX-w)},${f(top+.5)}H${f(VX+w)}`,stroke:'#ffffff','stroke-width':1,'stroke-opacity':.7},g);
  E('path',{d:`M${f(VX-w+wall)},${f(top-wall*.16)}L${f(VX+w-wall)},${f(top-wall*.16)}L${f(VX+w)},${f(top)}L${f(VX-w)},${f(top)}Z`,fill:lt(c,.05)},g)}
/* ---------- pin-frogs: a round base, then a field of brass pins seen as a fine golden comb (back rows behind the stems, front rows before them) ---------- */
function vKenzan(g,v,back,front){const kz=v.tp.kz,P=v.prof,H=v.h,rb=P[0][1],rf=v.mo,pinH=H*.68,y0=FL-H*.32,rows=LOD?Math.round(kz.rows*.6):kz.rows;
  if(back){vShadow(g,[[0,rb],[H,rb]],.28);E('ellipse',{cx:VX,cy:f(y0),rx:f(rf),ry:f(vRy(rf)),fill:dk(kz.pin,.62)},g)}
  const draw=(r0,r1)=>{const k=G(g);for(let j=r0;j<r1;j++){const z=-1+2*(j+.5)/rows,yy=y0+vRy(rf)*z,half=rf*Math.sqrt(Math.max(0,1-z*z))*.96,n=Math.max(2,Math.round(half*2/(LOD?5:2.9)));let dl='',dd='',dt='';
      for(let i=0;i<n;i++){const x=VX-half+(i+.5)*2*half/n+(j%2?.7:-.7);dd+=`M${f(x+.55)},${f(yy)}v${f(-pinH)}`;dl+=`M${f(x)},${f(yy)}v${f(-pinH)}`;dt+=`M${f(x)},${f(yy-pinH)}h.01`}
      E('path',{d:dd,stroke:dk(kz.pin,.7),'stroke-width':.7},k);E('path',{d:dl,stroke:kz.pin,'stroke-width':.6},k);E('path',{d:dt,stroke:kz.tip,'stroke-width':.9,'stroke-linecap':'round'},k)}};
  if(back)draw(0,Math.ceil(rows/2));
  if(front){draw(Math.ceil(rows/2),rows);const id='kb'+(gid++),gr=E('linearGradient',{id,x1:0,x2:1,y1:0,y2:0},GDEF||defs);
    for(let k2=0;k2<17;k2++){const u=-1+2*k2/16,[hex]=vShade({mat:'metal',fin:'polished'},kz.base,u,0);E('stop',{offset:f(k2/16),'stop-color':hex},gr)}
    E('path',{d:`M${f(VX-rb)},${FL}L${f(VX-rb)},${f(y0)}A${f(rb)},${f(vRy(rb))} 0 0 0 ${f(VX+rb)},${f(y0)}L${f(VX+rb)},${FL}A${f(rb)},${f(vRy(rb))} 0 0 1 ${f(VX-rb)},${FL}Z`,fill:`url(#${id})`},g)}}
/* ---------- glass: water, the stems' refraction band, an air bubble and, in the blown chalice, a slow goldfish ---------- */
function glassFront(g,v,S){const gl=v.gl||{},wh=Math.min(gl.water||S[S.length-1][0]*.6,S[S.length-1][0]-3),ww=sRad(S,wh)-1.5,wry=vRy(ww),H=S[S.length-1][0],tint=gl.tint||'#d6eae4',k=G(g,{'clip-path':`url(#${vClip(latheD(S))})`});
  E('rect',{x:f(VX-sRad(S,wh/2)-40),y:f(FL-wh),width:f(sRad(S,wh/2)*2+80),height:f(wh),fill:tint,opacity:(gl.op||.25)>.55?.06:.13},k);
  E('ellipse',{cx:VX,cy:f(FL-wh),rx:f(ww),ry:f(wry),fill:mix(tint,'#ffffff',.5),opacity:.22,stroke:'#ffffff','stroke-opacity':.6,'stroke-width':.8},k);
  E('path',{d:`M${f(VX-ww)},${f(FL-wh)}A${f(ww)},${f(wry)} 0 0 0 ${f(VX+ww)},${f(FL-wh)}`,stroke:'#ffffff','stroke-width':1.1,'stroke-opacity':.75,fill:'none'},k);
  const b=(v.tp||{}).bubble;if(b){const h=b.h*UPC,[x,y]=sPt(S,h,.25),r=b.r*UPC;E('circle',{cx:f(x),cy:f(y),r:f(r),fill:'#ffffff',opacity:.18,stroke:'#ffffff','stroke-opacity':.6,'stroke-width':.6},k);E('circle',{cx:f(x-r*.35),cy:f(y-r*.35),r:f(r*.25),fill:'#ffffff'},k)}
  /* a thick glass base reads as a brighter, greener disc */
  E('ellipse',{cx:VX,cy:f(FL-3),rx:f(S[0][1]*.92),ry:f(vRy(S[0][1])*.8),fill:'#ffffff',opacity:.16},g)}
function goldfish(par,v,S){const fsh=(v.tp||{}).fish;if(!fsh)return;const h=fsh.h*UPC,L=fsh.len*UPC,r=sRad(S,h),x=VX-r*.18,y=FL-h,g=G(par,{transform:`translate(${f(x)},${f(y)})`}),body=G(g);
  /* fantail: a double veil tail, round body, dorsal fin, gill line and eye; it faces left */
  const tail=G(body,{transform:`translate(${f(L*.28)},0)`});
  for(const s of[-1,1])E('path',{d:`M0,0C${f(L*.18)},${f(s*L*.08)} ${f(L*.42)},${f(s*L*.26)} ${f(L*.5)},${f(s*L*.2)}C${f(L*.36)},${f(s*L*.08)} ${f(L*.4)},${f(s*L*.02)} ${f(L*.46)},${f(s*-L*.02)}C${f(L*.28)},${f(s*-L*.01)} ${f(L*.12)},0 0,0Z`,fill:fsh.fin,opacity:.78},tail);
  E('path',{d:`M${f(-L*.28)},0C${f(-L*.3)},${f(-L*.13)} ${f(L*.05)},${f(-L*.17)} ${f(L*.3)},${f(-L*.04)}C${f(L*.32)},0 ${f(L*.32)},0 ${f(L*.3)},${f(L*.04)}C${f(L*.05)},${f(L*.16)} ${f(-L*.3)},${f(L*.12)} ${f(-L*.28)},0Z`,fill:rad([[0,lt(fsh.c,.35)],[.6,fsh.c],[1,dk(fsh.c,.3)]],.4,.35,.75)},body);
  E('path',{d:`M${f(-L*.02)},${f(-L*.12)}C${f(L*.06)},${f(-L*.24)} ${f(L*.2)},${f(-L*.2)} ${f(L*.24)},${f(-L*.07)}`,fill:fsh.fin,opacity:.7},body);
  E('path',{d:`M${f(-L*.16)},${f(-L*.07)}q${f(-L*.03)},${f(L*.07)} 0,${f(L*.13)}`,stroke:dk(fsh.c,.35),'stroke-width':.5,fill:'none'},body);E('circle',{cx:f(-L*.22),cy:f(-L*.025),r:f(L*.025),fill:'#1a0a04'},body);E('circle',{cx:f(-L*.228),cy:f(-L*.032),r:f(L*.008),fill:'#ffffff'},body);
  if(!LOD){const sw=-r*.22;E('animateTransform',{attributeName:'transform',type:'translate',values:`${f(x)},${f(y)};${f(x+sw)},${f(y-3)};${f(x+sw*.4)},${f(y+2)};${f(x)},${f(y)}`,dur:'19s',repeatCount:'indefinite',calcMode:'spline',keyTimes:'0;.4;.75;1',keySplines:'.45 0 .55 1;.45 0 .55 1;.45 0 .55 1'},g);
    E('animateTransform',{attributeName:'transform',type:'rotate',values:`-7 0 0;7 0 0;-7 0 0`,dur:'2.4s',repeatCount:'indefinite',additive:'sum'},tail)}}
