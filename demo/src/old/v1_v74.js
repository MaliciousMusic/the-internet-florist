
/* ================= Vessels from the reference study: lathe-drawn ceramics, glass, metal, kenzan, hand-tied, paper ================= */
const FL=990,VX=500;
/* profile = [[height from floor, half width], ...] bottom -> top */
const VZ={
 'coupe-blanche':{n:'Coupe sur pied',m:'céramique mate',p:3900,col:'#ecebe5',mat:'matte',pl:'beton',prof:[[0,34],[5,36],[9,22],[34,12],[52,13],[66,34],[82,60],[94,70]]},
 'coupe-noire':{n:'Coupe noire',m:'céramique mate',p:3900,col:'#1d1b1d',mat:'matte',pl:'blanc',prof:[[0,34],[5,36],[9,22],[34,12],[52,13],[66,34],[82,60],[94,70]]},
 'boule-chocolat':{n:'Boule chocolat',m:'émail brillant',p:4500,col:'#3b2016',mat:'gloss',pl:'bois',prof:[[0,38],[10,56],[40,74],[78,72],[108,50],[124,26],[134,22],[142,26]]},
 'boule-sapin':{n:'Boule vert sapin',m:'émail brillant',p:4500,col:'#1d3a29',mat:'gloss',pl:'blanc',prof:[[0,38],[10,56],[40,74],[78,72],[108,50],[124,26],[134,22],[142,26]]},
 'verre':{n:'Cylindre verre',m:'tiges visibles',p:2400,kind:'glass',pl:'beton',prof:[[0,44],[176,44]]},
 'calice':{n:'Calice terrazzo',m:'grès moucheté',p:5900,col:'#e9e5e0',mat:'matte',tex:'terrazzo',pl:'blanc',prof:[[0,46],[7,46],[12,28],[54,13],[64,15],[74,30],[160,34],[166,35]]},
 'balustre':{n:'Balustre argent',m:'étain patiné',p:7900,kind:'metal',col:'#a19e98',pl:'noir',prof:[[0,38],[8,38],[14,20],[34,17],[84,54],[118,50],[148,24],[166,19],[180,32]]},
 'urne':{n:'Urne Médicis',m:'céramique noire',p:5500,col:'#161517',mat:'matte',pl:'blanc',prof:[[0,42],[9,42],[15,24],[40,20],[56,32],[84,40],[130,46],[150,54],[156,56]]},
 'cobalt':{n:'Boule côtelée',m:'émail cobalt',p:4900,col:'#3a68c8',mat:'gloss',tex:'ribs',pl:'blanc',prof:[[0,36],[10,54],[40,70],[76,68],[104,46],[120,26],[130,23],[136,26]]},
 'jarre':{n:'Jarre en grès',m:'terre mouchetée',p:5200,col:'#a5683e',mat:'matte',tex:'speck',pl:'bois',prof:[[0,36],[24,58],[70,64],[110,46],[130,28],[140,26],[146,29]]},
 'soliflore':{n:'Soliflore noir',m:'verre laqué',p:2900,col:'#0d0b0d',mat:'gloss',pl:'blanc',prof:[[0,40],[6,40],[12,14],[24,12],[44,34],[70,48],[96,40],[124,16],[184,9],[196,13]]},
 'kenzan':{n:'Pique-fleurs',m:'laiton sur béton',p:4500,kind:'kenzan',pl:'beton',h:96},
 'noue':{n:'Bouquet noué',m:'ruban satin',p:0,kind:'hand',rib:'#e9c9c3',h:0},
 'papier':{n:'Papier coréen',m:'ruban de soie',p:490,kind:'wrap',paper:'#ebe6de',rib:'#b9a294',h:0}};
const vH=v=>v.h!=null?v.h:v.prof[v.prof.length-1][0];
const vMouth=v=>v.prof?v.prof[v.prof.length-1][1]:v.kind==='kenzan'?18:26;
/* lathe outline whose top edge is the FRONT half of the mouth ellipse: stems vanish behind the lip */
const vRy=mw=>Math.max(2.5,mw*.16);
function lathe(P){const R2=P.map(([y,w])=>[VX+w,FL-y]),L2=P.slice().reverse().map(([y,w])=>[VX-w,FL-y]),mw=P[P.length-1][1],top=FL-P[P.length-1][0];
  return smooth(R2,false)+`A${f(mw)},${f(vRy(mw))} 0 0 1 ${f(VX-mw)},${f(top)}`+'L'+smooth(L2,false).slice(1)+'Z'}
function plinth(par,kind){if(!kind)return;const C={beton:['#b9b4ac','#cfcac2','#a29c93'],blanc:['#ecebe7','#f7f6f3','#d8d6d1'],noir:['#1c1b1c','#2a292a','#111'],bois:['#6a4a32','#8a6446','#4e3524']}[kind];
  E('path',{d:`M${VX-260},${FL+2}L${VX+260},${FL+2}L${VX+250},${FL-14}L${VX-250},${FL-14}Z`,fill:lin([C[1],C[0]],0,0,0,1)},par);
  E('rect',{x:VX-260,y:FL+2,width:520,height:260,fill:lin([[0,C[0]],[.5,C[2]],[1,C[2]]],0,0,0,1)},par);
  E('path',{d:`M${VX-260},${FL+2.5}L${VX+260},${FL+2.5}`,stroke:'#fff','stroke-opacity':kind==='noir'?.12:.45,'stroke-width':1.2},par);
  if(kind==='bois')for(let i=0;i<9;i++){const y=FL+10+i*26+R(-6,6);E('path',{d:`M${VX-260},${f(y)}C${VX-80},${f(y+R(-8,8))} ${VX+80},${f(y+R(-8,8))} ${VX+260},${f(y)}`,stroke:'#3e2a1c','stroke-opacity':.35,'stroke-width':1.2,fill:'none'},par)}}
/* ---------- realistic vessels: the lathe profile shaded band by band (diffuse and specular light per material), a lip with thickness, a crisp shadow cast on the plinth ---------- */
const LV=[-.5,.62,.6].map((x,_,a)=>x/Math.hypot(...a)),HV=(()=>{const h=[LV[0],LV[1],LV[2]+1],l=Math.hypot(...h);return h.map(x=>x/l)})();
const toHex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
/* the profile [[height,radius]…] smoothed (Catmull-Rom on the radius) and resampled evenly in height */
function profSamples(P,n){const pts=[];for(let i=0;i<P.length-1;i++){const w0=P[Math.max(0,i-1)][1],w1=P[i][1],w2=P[i+1][1],w3=P[Math.min(P.length-1,i+2)][1];
    for(let k=0;k<10;k++){const s=k/10,s2=s*s,s3=s2*s;pts.push([P[i][0]+(P[i+1][0]-P[i][0])*s,.5*(2*w1+(-w0+w2)*s+(2*w0-5*w1+4*w2-w3)*s2+(-w0+3*w1-3*w2+w3)*s3)])}}
  pts.push(P[P.length-1]);const h=P[P.length-1][0],out=[];let j=0;
  for(let i=0;i<=n;i++){const y=h*i/n;while(j<pts.length-2&&pts[j+1][0]<y)j++;const a=pts[j],b=pts[j+1],u=b[0]>a[0]?Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0]))):0;out.push([y,Math.max(.6,a[1]+(b[1]-a[1])*u)])}return out}
/* colour of the surface at u (−1 left edge … 1 right edge) for a slope wp of the profile: lambert + blinn-phong per material */
function vShade(base,u,wp,v){const c=Math.sqrt(Math.max(0,1-u*u)),l=Math.hypot(u,wp,c)||1,n=[u/l,-wp/l,c/l],nl=Math.max(0,n[0]*LV[0]+n[1]*LV[1]+n[2]*LV[2]),nh=Math.max(0,n[0]*HV[0]+n[1]*HV[1]+n[2]*HV[2]),fr=Math.pow(1-c,2.5),[r,g,b]=hx(base);
  if(v.kind==='glass'){const s=Math.pow(nh,46);return[toHex(232+23*s,242+13*s,239+16*s),Math.min(.85,.05+.4*fr+.6*s)]}
  let I,sp,sh=0;
  if(v.kind==='metal'){I=.2+.42*nl+.34*(.5+.5*Math.sin(u*6.8+1.7))*(1-.4*fr);sp=.85*Math.pow(nh,28)+.2*Math.pow(nh,6)}
  else if(v.mat==='gloss'){I=.22+.66*nl;sp=.8*Math.pow(nh,48)+.18*Math.pow(nh,12)+.1*fr}
  else{const lum=(.3*r+.59*g+.11*b)/255;I=(.34+.22*lum+(.62-.18*lum)*nl)*(1-.2*fr);sp=.04*Math.pow(nh,6);sh=.05*nl}
  if(v.tex==='ribs'){const ph=Math.asin(Math.max(-1,Math.min(1,u)));I*=.82+.34*(.5+.5*Math.cos(ph*22))}
  const w=255*(sp+sh);return[toHex(r*I+w,g*I+w,b*I+w),1]}
/* the shadow thrown to the right and flattened onto the plinth: sharp at the foot, fading toward its tip */
function vShadow(g,S,h,wmax,op){const kx=.62,ky=.1,Rt=S.map(([y,w])=>[VX+w+y*kx,FL-y*ky]),Lt=S.map(([y,w])=>[VX-w+y*kx,FL-y*ky]).reverse(),id='vs'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:VX,y1:FL,x2:f(VX+h*kx+wmax),y2:f(FL-h*ky)},GDEF||defs);
  E('stop',{offset:0,'stop-color':'#1e140e','stop-opacity':op},gr);E('stop',{offset:1,'stop-color':'#1e140e','stop-opacity':op*.12},gr);
  E('path',{d:'M'+Rt.concat(Lt).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:`url(#${id})`},g);
  E('ellipse',{cx:VX+1,cy:FL,rx:f(S[0][1]*1.02),ry:2.2,fill:'#1e140e',opacity:op*1.1},g)}
/* the body: one band per slice of height, each with its own horizontal gradient of light */
function vBody(g,v,S,h,top,mw,ry){const glass=v.kind==='glass',gloss=v.mat==='gloss',K=LOD?7:v.tex==='ribs'?49:(gloss||v.kind==='metal')?25:17,base=glass?'#e9f2ef':v.col||'#888';let last=null;
  for(let i=0;i<S.length-1;i++){const[y0,w0]=S[i],[y1,w1]=S[i+1],a=S[Math.max(0,i-1)],b=S[Math.min(S.length-1,i+2)],wp=(b[1]-a[1])/Math.max(.001,b[0]-a[0]),id='vb'+(gid++),gr=E('linearGradient',{id,x1:0,x2:1,y1:0,y2:0},GDEF||defs);
    for(let k=0;k<K;k++){const u=-1+2*k/(K-1),[hex,al]=vShade(base,u,wp,v);E('stop',{offset:f(k/(K-1)),'stop-color':hex,'stop-opacity':f(al)},gr)}
    E('path',{d:`M${f(VX-w0)},${f(FL-y0+.6)}L${f(VX+w0)},${f(FL-y0+.6)}L${f(VX+w1)},${f(FL-y1-.6)}L${f(VX-w1)},${f(FL-y1-.6)}Z`,fill:`url(#${id})`},g);last=id}
  /* the front half of the mouth, below the rim line, so stems vanish behind the lip */
  E('path',{d:`M${f(VX+mw)},${f(top)}A${f(mw)},${f(ry)} 0 0 1 ${f(VX-mw)},${f(top)}Z`,fill:`url(#${last})`},g);
  const lp=Math.max(1.6,mw*.07),ir=mw-lp,iry=ry*ir/mw,lc=glass?'#ffffff':lt(base,gloss?.3:.18);
  E('path',{d:`M${f(VX+mw)},${f(top)}A${f(mw)},${f(ry)} 0 0 1 ${f(VX-mw)},${f(top)}L${f(VX-ir)},${f(top)}A${f(ir)},${f(iry)} 0 0 0 ${f(VX+ir)},${f(top)}Z`,fill:lin([[0,lc,glass?.7:1],[.35,lt(lc,.25),glass?.9:1],[1,dk(lc,.18),glass?.5:1]],0,0,1,0)},g);
  E('path',{d:lathe(v.prof),fill:'none',stroke:glass?'#ffffff':gloss?lt(base,.3):dk(base,.42),'stroke-width':glass?1.4:.7,'stroke-opacity':glass?.75:.45},g)}
function vessel(par,id,t=0,o={}){const v0=VZ[id]||VZ['coupe-blanche'],v=o.col&&v0.kind!=='glass'?Object.assign({},v0,{col:o.col}):v0,g=G(par),h=vH(v),mw=vMouth(v),top=FL-h,ry=vRy(mw),back=o.part!=='front',front=o.part!=='back',glass=v.kind==='glass';
  if(!o.noPlinth&&back)plinth(g,v.pl);
  if(v.kind==='hand'||v.kind==='wrap')return{g,top,mw,h};
  const S=v.prof?profSamples(v.prof,LOD?26:90):null,wmax=S?Math.max(...S.map(s=>s[1])):46;
  if(back){if(S)vShadow(g,S,h,wmax,glass?.14:.3);else E('path',{d:`M${VX-48},${FL}L${VX+48},${FL}L${VX+92},${FL-9}L${VX-4},${FL-9}Z`,fill:'#1e140e',opacity:.2},g);
    if(v.prof){E('ellipse',{cx:VX,cy:f(top),rx:mw,ry:f(ry),fill:glass?'#dde9e5':rad([[0,dk(v.col||'#888',.88)],[.7,dk(v.col||'#888',.72)],[1,dk(v.col||'#888',.52)]],.5,.15,.85)},g);
      E('path',{d:`M${f(VX-mw)},${f(top)}A${f(mw)},${f(ry)} 0 0 1 ${f(VX+mw)},${f(top)}`,stroke:glass?'#ffffff':lt(v.col||'#888',.28),'stroke-width':f(Math.max(1.6,mw*.07)),'stroke-opacity':glass?.7:.95,fill:'none'},g)}}
  if(!front){if(t)fade(g,t,700,18);return{g,top,mw,h}}
  if(v.kind==='kenzan'){E('ellipse',{cx:VX,cy:FL-6,rx:46,ry:8,fill:lin(['#6a5020','#d9b25a','#8a6a2a'],0,0,1,0)},g);E('rect',{x:VX-46,y:FL-6,width:92,height:6,fill:lin(['#5a4018','#c9a24a','#7a5a20'],0,0,1,0)},g);
    for(let i=0;i<26;i++)E('path',{d:`M${f(VX+R(-38,38))},${f(FL-6+R(-4,4))}v-4`,stroke:'#e8d08a','stroke-width':.8},g)}
  else if(S){vBody(g,v,S,h,top,mw,ry);
    if(v.tex==='terrazzo'||v.tex==='speck'){const sc=v.tex==='terrazzo'?['#2a2626','#7a7470','#b8aea6']:['#3a2010','#d8b890','#5a3420'];
      for(let i=0;i<(LOD?40:90);i++){const k=Math.floor(R(1,S.length-2)),[y,w]=S[k];E('circle',{cx:f(VX+R(-.9,.9)*w),cy:f(FL-y),r:f(R(.7,v.tex==='terrazzo'?2.2:1.3)),fill:pick(sc),opacity:f(R(.4,.85))},g)}}
    if(glass){const yw=h*.8,ww=S[Math.round(S.length*.8)][1];E('ellipse',{cx:VX,cy:f(FL-yw),rx:f(ww-1.5),ry:f(vRy(ww)*.85),fill:'#d6eae4',opacity:.28,stroke:'#ffffff','stroke-opacity':.55,'stroke-width':.9},g);
      E('path',{d:`M${f(VX-S[0][1]+2)},${FL-1}L${f(VX+S[0][1]-2)},${FL-1}L${f(VX+S[2][1]-2)},${f(FL-9)}L${f(VX-S[2][1]+2)},${f(FL-9)}Z`,fill:'#ffffff',opacity:.22},g)}}
  if(t)fade(g,t,700,18);return{g,top,mw,h}}
/* stems seen through glass / below a binding: bundle from the binding point down to the cut ends */
function stemsBelow(par,n,id){const v=VZ[id]||{},bp=v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX,FL-vH(v)],g=G(par);
  if(v.kind==='glass'){for(let i=0;i<n;i++){const x0=VX+R(-30,30),x1=VX+R(-34,34);E('path',{d:`M${f(x0)},${FL-176}L${f(x0+(x1-x0)*.35)},${FL-140}L${f(x1)},${FL-6}`,stroke:pick(['#4f7a36','#5f8a3e','#3f6a2e']),'stroke-width':f(R(2.2,3.6)),'stroke-opacity':.85,fill:'none'},g)}
    E('rect',{x:VX-43,y:FL-140,width:86,height:138,fill:'#cfe3dc',opacity:.18},g);return g}
  const hand=v.kind==='hand'||v.kind==='wrap',len=v.kind==='kenzan'?vH(v)-8:hand?120:0,spread=hand?40:6;
  for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0,x1=bp[0]+u*spread+R(-4,4),y1=bp[1]+len*R(.9,1.05);E('path',{d:`M${f(bp[0]+u*8)},${f(bp[1]-6)}Q${f(bp[0]+u*6)},${f(bp[1]+len*.3)} ${f(x1)},${f(y1)}`,stroke:pick(['#4f7a36','#5f8a3e','#3f6a2e','#6a8a3a']),'stroke-width':f(R(2.4,3.8)),fill:'none','stroke-linecap':'butt'},g)}
  return g}
/* ribbon bow with trailing tails (hand-tied, wrap, kenzan bundle) */
function bow(par,x,y,c,long=1){const g=G(par);E('rect',{x:f(x-16),y:f(y-6),width:32,height:12,rx:3,fill:c},g);E('rect',{x:f(x-16),y:f(y-6),width:32,height:12,rx:3,fill:lin([[0,'#fff',.3],[.5,'#fff',0],[1,'#000',.2]],0,0,0,1)},g);
  for(const s of[-1,1]){E('path',{d:`M${x},${y}C${x+s*12},${y-22} ${x+s*34},${y-14} ${x+s*30},${y}C${x+s*26},${y+10} ${x+s*10},${y+6} ${x},${y}Z`,fill:c,stroke:dk(c,.25),'stroke-width':.6},g);
    E('path',{d:`M${x},${y+2}C${x+s*8},${y+40} ${x+s*(18+R(0,10))},${y+90*long} ${x+s*(10+R(0,14))},${y+150*long}`,stroke:c,'stroke-width':7,fill:'none','stroke-linecap':'butt'},g)}
  E('circle',{cx:x,cy:y,r:5,fill:dk(c,.12)},g);return g}
/* paper cone: back sheet behind the flowers, front sheet over the stems */
function wrapBack(par,bp,c,cq){const e=cq&&cq.ell||{cx:bp[0],cy:bp[1]-110,rx:150,ry:110},hw=Math.max(110,e.rx*1.05),top=bp[1]-Math.max(130,(bp[1]-(e.cy-e.ry))*.84),x=bp[0],y=bp[1];
  E('path',{d:`M${x-24},${y+40}L${f(x-hw)},${f(top+30)}Q${f(x-hw*.5)},${f(top-14)} ${x},${f(top+6)}Q${f(x+hw*.55)},${f(top-18)} ${f(x+hw)},${f(top+26)}L${x+24},${y+40}Z`,fill:lin([dk(c,.14),c,lt(c,.35)],0,0,1,0)},par);
  E('path',{d:`M${f(x-hw*.45)},${f(top+20)}L${x-8},${y+30}M${f(x+hw*.4)},${f(top+18)}L${x+6},${y+30}`,stroke:dk(c,.25),'stroke-width':1,'stroke-opacity':.25,fill:'none'},par)}
function wrapFront(par,bp,c,cq){const e=cq&&cq.ell||{rx:150,ry:110},hw=Math.max(66,e.rx*.6),top=bp[1]-Math.min(64,Math.max(36,e.ry*.32)),x=bp[0],y=bp[1],g=G(par);
  const edge=`L${f(x-hw)},${f(top+8)}Q${f(x-hw*.3)},${f(top+26)} ${x+8},${f(top+12)}Q${f(x+hw*.55)},${f(top-4)} ${f(x+hw)},${f(top+14)}`;
  E('path',{d:`M${x-22},${y+44}${edge}L${x+22},${y+44}Z`,fill:lin([[0,lt(c,.3)],[.5,c],[1,dk(c,.18)]],0,0,1,0)},g);
  E('path',{d:`M${f(x-hw)},${f(top+8)}Q${f(x-hw*.3)},${f(top+26)} ${x+8},${f(top+12)}Q${f(x+hw*.55)},${f(top-4)} ${f(x+hw)},${f(top+14)}`,stroke:'#fff','stroke-width':1.6,'stroke-opacity':.6,fill:'none'},g);
  for(let i=0;i<4;i++)E('path',{d:`M${f(x+R(-hw*.6,hw*.6))},${f(top+R(20,40))}l${f(R(-14,14))},${f(R(26,50))}`,stroke:dk(c,.25),'stroke-width':.8,'stroke-opacity':.22},g);return g}
