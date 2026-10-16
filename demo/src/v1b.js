
/* ---------- the turned body: one band per slice of height, each with its own horizontal gradient of light ---------- */
function latheD(S,cx=VX){const n=S.length-1,top=FL-S[n][0],mw=S[n][1],ry=vRy(mw);
  return'M'+S.map(([y,w])=>f(cx+w)+','+f(FL-y)).join('L')+`A${f(mw)},${f(ry)} 0 0 1 ${f(cx-mw)},${f(top)}L`+S.slice().reverse().map(([y,w])=>f(cx-w)+','+f(FL-y)).join('L')+'Z'}
function vClip(d){const id='vk'+(gid++),cp=E('clipPath',{id},GDEF||defs);E('path',{d},cp);return id}
function vBody(g0,v,S){const n=S.length-1,tp=v.tp||{},top=FL-S[n][0],mwO=S[n][1],ry=vRy(mwO),glass=v.mat==='glass',sq=tp.squarefoot?tp.squarefoot*UPC:0,
    K=LOD?7:(tp.lobes||tp.facets||v.mat==='gloss'||v.mat==='metal')?41:glass?27:17;let last=null,lastA=null,g=g0,mk=null;
  /* glass: colour bands opaque, their transparency carried by a mask, so overlapping bands never stripe */
  if(glass){const wm=Math.max(...S.map(s=>s[1])),mid='gm'+(gid++);mk=E('mask',{id:mid,maskUnits:'userSpaceOnUse',x:f(VX-wm-6),y:f(top-ry-6),width:f(wm*2+12),height:f(S[n][0]+ry+14)},GDEF||defs);g=G(g0,{mask:`url(#${mid})`})}
  for(let i=0;i<n;i++){const[y0,w0]=S[i],[y1,w1]=S[i+1];if(y1<=sq)continue;const a=S[Math.max(0,i-1)],b=S[Math.min(n,i+2)],wp=(b[1]-a[1])/Math.max(.001,b[0]-a[0]),hm=(y0+y1)/2,
      base=vBase(v,hm),vm=vMatAt(v,hm),lob=tp.lobes&&hm>=tp.lobes.y0*UPC&&hm<=tp.lobes.y1*UPC?tp.lobes:null,fac=tp.facets&&!lob?tp.facets:0,id='vb'+(gid++),gr=E('linearGradient',{id,x1:0,x2:1,y1:0,y2:0},GDEF||defs);
    const ga=glass?E('linearGradient',{id:id+'a',x1:0,x2:1,y1:0,y2:0},GDEF||defs):null;
    for(let k=0;k<K;k++){const u=-1+2*k/(K-1),[hex,al]=vShade(vm,base,u,wp,{fac,lob});E('stop',{offset:f(k/(K-1)),'stop-color':hex},gr);if(ga){const q=Math.round(255*al);E('stop',{offset:f(k/(K-1)),'stop-color':toHex(q,q,q)},ga)}}
    const bd=`M${f(VX-w0)},${f(FL-y0+.6)}L${f(VX+w0)},${f(FL-y0+.6)}L${f(VX+w1)},${f(FL-y1-.6)}L${f(VX-w1)},${f(FL-y1-.6)}Z`;E('path',{d:bd,fill:`url(#${id})`},g);if(mk)E('path',{d:bd,fill:`url(#${id}a)`},mk);last=id;lastA=id+'a'}
  /* a square moulded foot (Medici coupe) instead of the turned one */
  if(sq){const w=S[0][1],d=w*.16;E('path',{d:`M${f(VX-w)},${FL}L${f(VX+w)},${FL}L${f(VX+w)},${f(FL-sq)}L${f(VX-w)},${f(FL-sq)}Z`,fill:lin([[0,dk(v.col,.08)],[.35,lt(v.col,.06)],[1,dk(v.col,.2)]],0,0,1,0)},g);
    E('path',{d:`M${f(VX-w)},${f(FL-sq)}L${f(VX+w)},${f(FL-sq)}L${f(VX+w*.86)},${f(FL-sq-d)}L${f(VX-w*.86)},${f(FL-sq-d)}Z`,fill:lt(v.col,.1)},g);
    for(const s of[-1,1])E('path',{d:`M${f(VX+s*w*.82)},${f(FL-sq*.25)}a${f(sq*.32)},${f(sq*.32)} 0 1,${s>0?0:1} ${f(-s*sq*.5)},${f(-sq*.45)}`,stroke:dk(v.col,.22),'stroke-width':.5,fill:'none'},g)}
  /* the front half of the mouth, below the rim line, so stems vanish behind the lip */
  if(last){const md=`M${f(VX+mwO)},${f(top)}A${f(mwO)},${f(ry)} 0 0 1 ${f(VX-mwO)},${f(top)}Z`;E('path',{d:md,fill:`url(#${last})`},g);if(mk)E('path',{d:md,fill:`url(#${lastA})`},mk)}
  return{top,mwO,ry}}
/* the rim: a ring with thickness; wavy rims follow their festoons */
function rimPts(cx,top,rx,ry,a0,a1,wave){const P=[];for(let i=0;i<=24;i++){const th=a0+(a1-a0)*i/24;P.push([cx+rx*Math.cos(th),top+ry*Math.sin(th)+(wave?wave.a*UPC*Math.sin(wave.n*th):0)])}return P}
function vLip(g,v,top,mwO,ry){const tp=v.tp||{},glass=v.mat==='glass',base=vBase(v,v.h),lw=Math.max(1.1,Math.min(v.lipw||3,mwO*.14)),ir=Math.max(.5,mwO-lw),iry=ry*ir/mwO,
    lc=glass?'#ffffff':v.cast?mix(base,'#a49678',.42):v.mat==='metal'?lt(base,.38):lt(base,v.mat==='gloss'?.26:.13),O=rimPts(VX,top,mwO,ry,0,Math.PI,tp.wave),I=rimPts(VX,top,ir,iry,Math.PI,0,tp.wave);
  E('path',{d:'M'+O.concat(I).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:lin([[0,lc,glass?(v.svgb?.38:.65):1],[.35,lt(lc,.28),glass?(v.svgb?.55:.9):1],[1,dk(lc,.22),glass?(v.svgb?.3:.45):1]],0,0,1,0)},g);
  if(v.lip==='rolled'||v.lip==='beaded'){const m=mwO-lw*.4;E('path',{d:'M'+rimPts(VX,top,m,ry*m/mwO,.15,Math.PI-.15,tp.wave).map(p=>f(p[0])+','+f(p[1]-lw*.12)).join('L'),stroke:v.cast?'#efe2c4':'#ffffff','stroke-opacity':v.cast?.22:.38,'stroke-width':f(lw*.32),fill:'none','stroke-linecap':'round'},g)}
  if(v.lip==='thin'||(v.mat==='metal'&&!v.cast))E('path',{d:'M'+O.map(p=>f(p[0])+','+f(p[1])).join('L'),stroke:lt(base,.55),'stroke-width':.6,'stroke-opacity':.8,fill:'none'},g)}
/* the inside of the mouth and the back half of the rim (drawn behind the stems) */
function vMouthBack(g,v,top,mwO,ry){const tp=v.tp||{},glass=v.mat==='glass',base=vBase(v,v.h),lw=Math.max(1.1,Math.min(v.lipw||3,mwO*.14)),ir=Math.max(.5,mwO-lw),iry=ry*ir/mwO,
    open=ir>26,inn=glass?mix(v.col,'#ffffff',.55):dk(base,v.mat==='metal'?.62:open?.42:.7);
  /* the inside of an open mouth: the back wall lit, the front wall in shade (dark only in narrow necks) */
  E('ellipse',{cx:VX,cy:f(top),rx:f(ir),ry:f(iry),fill:glass?inn:open?lin([[0,dk(base,.12)],[.45,dk(base,.3)],[1,dk(base,.62)]],0,0,0,1):rad([[0,dk(inn,.35)],[.65,inn],[1,mix(inn,base,.35)]],.5,.15,.85),opacity:glass?.35:1},g);
  const lc=glass?'#ffffff':v.cast?mix(base,'#8c826a',.3):v.mat==='metal'?lt(base,.25):lt(base,v.mat==='gloss'?.2:.08),O=rimPts(VX,top,mwO,ry,Math.PI,2*Math.PI,tp.wave),I=rimPts(VX,top,ir,iry,2*Math.PI,Math.PI,tp.wave);
  E('path',{d:'M'+O.concat(I).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z',fill:lc,opacity:glass?.55:1},g)}
/* a crisp shadow cast to the right and flattened onto what the vessel stands on, sharp at the foot, fading toward its tip */
function vShadow(g,S,op,clip){const h=S[S.length-1][0],wmax=Math.max(...S.map(s=>s[1])),kx=.62,ky=.1,Rt=S.map(([y,w])=>[VX+w+y*kx,FL-y*ky]),Lt=S.map(([y,w])=>[VX-w+y*kx,FL-y*ky]).reverse(),
    id='vs'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:VX,y1:FL,x2:f(VX+h*kx+wmax),y2:f(FL-h*ky)},GDEF||defs),k=G(g,clip?{'clip-path':`url(#${clip})`}:null);
  E('stop',{offset:0,'stop-color':'#1e140e','stop-opacity':op},gr);E('stop',{offset:1,'stop-color':'#1e140e','stop-opacity':op*.1},gr);
  E('path',{d:'M'+Rt.concat(Lt).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:`url(#${id})`},k);
  E('ellipse',{cx:VX+1,cy:FL,rx:f(S[0][1]*1.02),ry:2.2,fill:'#1e140e',opacity:op*1.1},k)}
/* ---------- applied details: rows of beads, handles ---------- */
function beadRing(g,y,R,n,r,c,front=true){const ry=vRy(R),k=G(g);for(let i=0;i<n;i++){const ph=-Math.PI/2+(i+.5)*Math.PI/n*(front?1:1);if(!front)continue;
    const x=VX+R*Math.sin(ph),yy=y+ry*Math.cos(ph),fs=Math.max(.35,Math.cos(ph));E('ellipse',{cx:f(x+r*.25*fs),cy:f(yy+r*.55),rx:f(r*.9*fs),ry:f(r*.45),fill:'#1e140e',opacity:.18},k);
    E('ellipse',{cx:f(x),cy:f(yy),rx:f(r*(.55+.45*fs)),ry:f(r),fill:rad([[0,lt(c,.6)],[.55,c],[1,dk(c,.28)]],.36,.3,.78)},k)}return k}
function beadCols(g,v,S,bc){const n=v.tp.lobes?v.tp.lobes.n:8,k=G(g);for(let j=0;j<n;j++){const ph=-Math.PI/2+((j+.5)/n)*2*Math.PI;if(Math.abs(ph)>Math.PI/2*.92)continue;
    for(let i=0;i<bc.n;i++){const h=(bc.y0+(bc.y1-bc.y0)*i/(bc.n-1))*UPC,R=sRad(S,h),x=VX+R*Math.sin(ph),y=FL-h,r=.28*UPC,fs=Math.max(.35,Math.cos(ph));
      E('ellipse',{cx:f(x),cy:f(y),rx:f(r*(.5+.5*fs)),ry:f(r),fill:rad([[0,lt(v.col,.42)],[.6,v.col],[1,dk(v.col,.4)]],.36,.3,.78)},k)}}return k}
function vHandles(g,v,S){const hd=v.hd,c=v.col,k=G(g);for(const s of[-1,1]){const r0=sRad(S,hd.y0),r1=sRad(S,hd.y1),x0=VX+s*r0,y0=FL-hd.y0,x1=VX+s*r1,y1=FL-hd.y1,o=hd.out,th=hd.th,
    d=`M${f(x1-s*th*.3)},${f(y1)}C${f(x1+s*o*.9)},${f(y1-th*1.2)} ${f(x1+s*o*1.25)},${f(y0-(y0-y1)*.15)} ${f(x0+s*o*.35)},${f(y0-th*.4)}`;
    E('path',{d,stroke:dk(c,.42),'stroke-width':f(th*1.2),fill:'none','stroke-linecap':'round',transform:`translate(${f(th*.12)},${f(th*.18)})`},k);E('path',{d,stroke:dk(c,.12),'stroke-width':f(th*1.02),fill:'none','stroke-linecap':'round'},k);E('path',{d,stroke:c,'stroke-width':f(th*.7),fill:'none','stroke-linecap':'round'},k);
    E('path',{d,stroke:lt(c,.5),'stroke-width':f(th*.3),'stroke-opacity':.75,fill:'none','stroke-linecap':'round',transform:`translate(${f(-th*.18)},${f(-th*.2)})`},k);
    if(hd.sh==='scroll'){const cx=x0+s*o*.35,cy=y0-th*.4;E('path',{d:`M${f(cx)},${f(cy)}a${f(th*.9)},${f(th*.9)} 0 1,${s>0?1:0} ${f(-s*th*1.3)},${f(th*.6)}a${f(th*.5)},${f(th*.5)} 0 1,${s>0?1:0} ${f(s*th*.6)},${f(-th*.7)}`,stroke:dk(c,.2),'stroke-width':f(th*.55),fill:'none','stroke-linecap':'round'},k);
      E('circle',{cx:f(x1+s*th*.2),cy:f(y1-th*.1),r:f(th*.75),fill:rad([[0,lt(c,.5)],[.6,c],[1,dk(c,.25)]],.36,.3,.8)},k)}}return k}
