
/* ---------- one vessel: its back (shadow, inside of the mouth, back of the rim) and its front (body, textures, beads, handles, lip, water) ---------- */
function vessel(par,id,t=0,o={}){const v=VZ[id]||VZ['coupe-pied-blanche'],g=G(par),back=o.part!=='front',front=o.part!=='back';
  if(v.kind==='hand'||v.kind==='wrap')return{g};let sg=null;if(!o.noPlinth&&back)sg=stage(g,v);
  if(v.shape==='outline')vOutline(g,v,back,front);
  else if(v.shape==='box')vBox(g,v,back,front);
  else if(v.kind==='kenzan')vKenzan(g,v,back,front);
  else{const S=profSamples(v.prof,LOD?28:90),n=S.length-1,top=FL-S[n][0],mwO=S[n][1],ry=vRy(mwO),glass=v.mat==='glass',tp=v.tp||{};
    if(back){vShadow(g,S,glass?.14:.3,o.shClip||(sg&&sg.top));vMouthBack(g,v,top,mwO,ry);if(v.svgb&&typeof svgMouth==='function')svgMouth(g,v);if(glass)goldfish(g,v,S)}
    if(front){if(v.svgb&&typeof svgBody==='function')svgBody(g,v);else if(v.cast)castBody(g,v,S);else{vBody(g,v,S);vTextures(g,v,S)}
      if(tp.beadrow)for(const b of tp.beadrow){const h=b.h==='lip'?S[n][0]-b.r*UPC*1.2:b.h*UPC;beadRing(g,FL-h,sRad(S,h)+b.r*UPC*.3,Math.round(b.n/2),b.r*UPC,b.c)}
      if(tp.beadcol)beadCols(g,v,S,tp.beadcol);if(v.hd)vHandles(g,v,S);vLip(g,v,top,mwO,ry);if(glass&&!v.svgb)glassFront(g,v,S);
      if(!v.cast&&!v.svgb)E('path',{d:latheD(S),fill:'none',stroke:glass?'#ffffff':v.mat==='gloss'||v.mat==='metal'?lt(v.col,.3):dk(v.col,.42),'stroke-width':glass?1.3:.7,'stroke-opacity':glass?.7:.38},g)}}
  if(t)fade(g,t,700,18);return{g,sg}}
/* stems seen below the binding of a held bouquet, inside a glass vessel, or pushed into the pins of a kenzan */
/* frosted glass: what is inside shows softened (one blur filter per drawing) */
function frostBlur(){const id='fb'+(gid++),fl=E('filter',{id,x:'-10%',y:'-5%',width:'120%',height:'110%'},GDEF||defs);E('feGaussianBlur',{stdDeviation:2},fl);return id}
/* the stems seen through a glass vessel: each the continuation of one bouquet stem from its foot at the mouth, straight on in its own
   direction, bending only near the bottom to stay inside it; drawn like the stems above (same shading, width and colours) */
function stemsIn(par,feet,id){const v=VZ[id]||{},g=G(par);if(!v.prof)return g;const S=profSamples(v.prof,40),wall=2.6,I=S.map(([y,w])=>[y,Math.max(1,w-wall)]),sb=v.svgb&&typeof SVGB!=='undefined'?SVGB[v.svgb]:null,
    /* a sculpted frosted vessel: the stems are cut to its cavity first, then softened by the frost (no crisp floating edge) */
    k=sb&&sb.inner?G(G(g,{opacity:.85,filter:`url(#${frostBlur()})`}),{'clip-path':`url(#${vClip(sb.inner)})`}):G(g,{'clip-path':`url(#${vClip(latheD(I))})`,opacity:.92}),
    yb=sb&&sb.cavb?sb.cavb+3:FL-5,cx=VX+vMx(v),rb=sb&&sb.cavr?sb.cavr*.55:Math.max(3,sRad(I,8))*.82;
  for(const ft of feet){const[x0,y0]=ft.p,D0=yb-y0;if(D0<4)continue;let[dx,dy]=ft.d;const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;if(dy<.3){dy=.3;dx=Math.sign(dx||1)*.954}
    const s=dx/dy,x1=Math.max(cx-rb,Math.min(cx+rb,x0+s*D0)),c1=[x0+s*D0*.35,y0+D0*.35],c2=[(x0+s*D0*.7+x1)/2,y0+D0*.72];
    const T0=TINT;TINT=ft.tn||null;try{stem3(k,[[x0,y0],c1,c2,[x1,yb]],ft.w,ft.w*.92,ft.c||SG,10)}finally{TINT=T0}}
  return g}
function stemsBelow(par,n,id){const v=VZ[id]||{},hand=v.kind==='hand'||v.kind==='wrap',g=G(par),SG=['#4f7a36','#5f8a3e','#3f6a2e','#6a8a3a'];
  if(v.kind==='kenzan'){const top=FL-v.h,y1=FL-v.h*.32-1;for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0;E('path',{d:`M${f(VX+u*8)},${f(top-6)}L${f(VX+u*v.mo*.55+R(-3,3))},${f(y1)}`,stroke:pick(SG),'stroke-width':f(R(2.4,3.6)),fill:'none'},g)}return g}
  if(v.mat==='glass'&&v.prof){const S=profSamples(v.prof,40),H=S[S.length-1][0],wall=2.6,I=S.map(([y,w])=>[y,Math.max(1,w-wall)]),k=G(g,{'clip-path':`url(#${vClip(latheD(I))})`});
    for(let i=0;i<n;i++){const x0=VX+R(-.6,.6)*v.mo,yb=FL-5,x1=VX+R(-.7,.7)*Math.max(3,sRad(I,8)),x2=x0+(x1-x0)*.4;E('path',{d:`M${f(x0)},${f(FL-H+2)}Q${f(x2)},${f(FL-H*.45)} ${f(x1)},${f(yb)}`,stroke:pick(SG),'stroke-width':f(R(2.2,3.6)),'stroke-opacity':.85,fill:'none'},k)}return g}
  const bp=[VX,830],len=hand?120:0,spread=hand?40:6;
  for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0,x1=bp[0]+u*spread+R(-4,4),y1=bp[1]+len*R(.9,1.05);E('path',{d:`M${f(bp[0]+u*8)},${f(bp[1]-6)}Q${f(bp[0]+u*6)},${f(bp[1]+len*.3)} ${f(x1)},${f(y1)}`,stroke:pick(SG),'stroke-width':f(R(2.4,3.8)),fill:'none','stroke-linecap':'butt'},g)}
  return g}
