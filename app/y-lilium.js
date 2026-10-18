/* ================= Pilote, lis : le genre Lilium en SVG natif (y-lilium.js) =================
   One module per genus, one sheet (fiche) per kind; the head is the kit's reflexed flower (y3-reflexe.js: svReflex, svReflexHeart), held facing out.
   The kind: LIL_ODBL, lis oriental « double » (Lilium Oriental Group; catalogue/serre/fiches/lis-oriental-double.json, refcache/lis-oriental-double).
   The kept photos all show the single form (fiche Q1): six tepals in two whorls (3 outer, narrower, L/l 2.4; 3 inner, broader, L/l 2), a narrow
   claw, a short green throat, then the body spreads nearly flat and the acuminate tip recurves back (photos 4, 2, 7); margins waved; a gutter
   down the middle (the nectary furrow), raised papillae near the throat and dark round spots (Stargazer types; none on the plain whites).
   Six stamens opposite the tepals, filaments about half a tepal, curving out from the throat, versatile red-brown anthers held across;
   the style a little longer, nearly along the axis, ending in a swollen three-lobed stigma (photos 7, 4).
   The bud (20, 55): a long spindle (L/l about 3), widest below the middle, pointed, three ridges, green-cream, the colour coming by the tip.
   Faded (189): the tepals wither on the flower: narrower, crimped, twisted, drawn in, limp; the colour goes to ivory-ochre then brown. */

/* the colourways drawn here (the finishing step adds the others from coloris.md): ground of the inner face from the claw (0) to the point (1)
   and of the back (bst); zones across (cross: the deep median band, the green throat, the pale margin); spots and papillae (over); shade and
   light of the washes; veins; heart: filament, anther, pollen, style, stigma, ovary */
const LIL_CW={
  /* rose (photos 4, 2): ground #dc7c98 / #ebb2b9, the median band #c74061, white-pink margins, a green-yellow throat; anthers #7c2116 */
  rose:{st:[[0,'#a8bc5c'],[.07,'#d6e09a'],[.16,'#f2dce0'],[.3,'#eeb4c4'],[.55,'#e6a0b4'],[.8,'#eab0c0'],[1,'#f2cad4']],
    bst:[[0,'#a4b864'],[.12,'#dcd8b8'],[.3,'#f2d4dc'],[.7,'#f0ccd6'],[1,'#f4d8de']],
    cross:[{st:[[0,'#c43e62',.92],[.1,'#cc4c6e',.8],[.26,'#d8708e',.45],[.48,'#e08aa2',0]],v:[.1,.2,.9,1],bk:.15,soft:.02},
      {st:[[0,'#b6cc58',.95],[.22,'#c8da7c',.8],[.5,'#e4ead0',0]],v:[-.1,0,.13,.26],soft:.02},
      {st:[[0,'#ffffff',0],[.62,'#fae8ee',0],[.84,'#fbeef2',.75],[1,'#fdf4f6',.92]],tip:.9,bk:.4,soft:.02}],
    spots:{c:'#a8204a',n:[30,18],v:[.12,.62],u:[.12,.72],r:[.0045,.009]},pap:{c:'#f4c8d4',sh:'#b84a6a',n:[22,0],v:[.05,.3],u:.42},
    shade:'#8a2448',lite:'#fff4f8',bshade:'#9a5a6a',blite:'#fff6f8',vein:'#c85a7c',bvein:'#c890a0',vo:.2,
    transmit:{a:.2,w:.005,eo:[.42,.14],ev:[.12,.3],lk:[.32,.46]},
    fil:'#d2dca8',anth:'#7c2116',pol:'#a8402a',sty:'#d6e0a8',sg:'#9a6a74',ov:'#a8bc6a'},
  /* casa-blanca (photos 6, 7, 13; coloris.md base #dfe1d2, body #ebeaea): pure white, a green-yellow throat and median line toward the foot,
     white papillae, no spots; warm shadows (3.7); anthers dark red-brown #391a0e to #8d1c1b, the stigma pinkish */
  'casa-blanca':{st:[[0,'#a6b85a'],[.07,'#d2dca0'],[.16,'#f2f2e2'],[.32,'#f8f8f2'],[.6,'#fbfaf6'],[.85,'#fbfaf5'],[1,'#f8f8ee']],
    bst:[[0,'#a0b45c'],[.12,'#d8dcb4'],[.3,'#f2f2e6'],[.7,'#f6f5ec'],[1,'#f4f3e6']],
    cross:[{st:[[0,'#d2dc96',.75],[.12,'#e2e6b6',.45],[.3,'#f2f2e2',0]],v:[.06,.14,.42,.62],bk:.2,soft:.025},
      {st:[[0,'#b2c654',.95],[.25,'#c6d47a',.75],[.55,'#ecefd8',0]],v:[-.1,0,.12,.25],soft:.02}],
    pap:{c:'#ffffff',sh:'#c8c2a0',n:[26,0],v:[.05,.32],u:.45},
    shade:'#9a8a66',lite:'#ffffff',bshade:'#a49674',blite:'#ffffff',vein:'#ddd8c2',bvein:'#d2d0b4',vo:.16,
    transmit:{a:.26,w:.006,eo:[.48,.16],ev:[.12,.3],lk:[.38,.52],wr:.25},
    fil:'#c4d48e',anth:'#6e1e14',pol:'#9a2a1c',sty:'#cad890',sg:'#b88a7e',ov:'#a8bc6a'}};
const LIL_M={};
/* spots and papillae of one tepal (zone mouchetures: round, dark, raised, dense toward the throat, sparse toward the tip; papillae: raised
   fleshy points round the midline near the throat): drawn over the washes, clipped to the piece, only where its inner face is seen */
function lilDots(C){return(sd,w,st)=>{if(!st.hi||st.r1<.45||(!C.spots&&!C.pap))return null;const r=svRng(sd+31),L=[];
    if(C.spots){const S=C.spots,n=Math.round(S.n[0]*r.in(.75,1.2));for(let i=0;i<n;i++){const x=Math.pow(r(),S.k??1.7),v=S.v[0]+(S.v[1]-S.v[0])*x,
        u=(r()<.5?-1:1)*(S.u[0]+(S.u[1]-S.u[0])*(1-.45*x)*r());L.push([u,v,(S.r[0]+(S.r[1]-S.r[0])*r()*(1-.4*x)),0,r(),r(),Math.floor(r()*1e6)])}}
    if(C.pap){const P=C.pap;for(let i=0;i<P.n[0];i++){const x=r(),v=P.v[0]+(P.v[1]-P.v[0])*x,u=(r()-.5)*2*P.u*(.4+.6*x);L.push([u,v,.0032+.0025*r(),1])}}
    const k=svSm((st.r1-.45)/.35),fan=st.fan,dec=st.dec,lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})();
    const sc=C.spots?mix(C.spots.c,'#4a2a14',.55*fan):null,pc=C.pap?mix(C.pap.c,'#c8a870',.6*dec+.3*fan):null,ps=C.pap?mix(C.pap.sh,'#6a4a28',.5*fan):null;
    return(cg,it,sh,front,Dm)=>{if(!front||LOD)return;let ds='',dh='',dp='',dq='',dw='',dc='';
      for(const[u,v,rad,kind,e1,e2,sh2]of L){if(it.s*svLerp(sh,sh.F,u,v)<=.05)continue;const p=svAt(sh,u,v),q=svAt(sh,u+.03,v),e=svAt(sh,u,v+.03),
          fs=Math.min(1,Math.max(.35,Math.min(Math.hypot(q[0]-p[0],q[1]-p[1]),Math.hypot(e[0]-p[0],e[1]-p[1]))/(Dm*.012))),rr=Math.max(.25,Dm*rad*fs*(.5+.5*k)),
          c=(x,y,rx)=>`M${svF(x-rx)},${svF(y)}a${svF(rx)},${svF(rx)} 0 1,0 ${svF(2*rx)},0a${svF(rx)},${svF(rx)} 0 1,0 ${svF(-2*rx)},0`;
        /* a spot is a fleshy papilla (photo p002 at 1:1): an irregular blob, longer along the tepal, raised (a soft shadow on the far side,
           a darker core, a point of light); C.spots.blob:false keeps the round dots */
        if(kind===0&&C.spots.blob!==false&&e1!=null){const ax0=e[0]-p[0],ay0=e[1]-p[1],al=Math.hypot(ax0,ay0)||1,tl=(e2-.5)*.8,ca=Math.cos(tl),sa=Math.sin(tl),
            ax=(ax0*ca-ay0*sa)/al,ay=(ax0*sa+ay0*ca)/al,bx=-ay,by=ax,el=1+.9*e1*e1,blob=(cx,cy,k)=>{const P=[];for(let q=0;q<7;q++){const a=q/7*6.2832,j=.72+.56*pxHashS(sh2,q,7),
              ra=rr*k*j;P.push([cx+(ax*Math.cos(a)*el+bx*Math.sin(a))*ra,cy+(ay*Math.cos(a)*el+by*Math.sin(a))*ra])}return svSpl(P)};
          dw+=blob(p[0]-lt[0]*rr*.45,p[1]-lt[1]*rr*.45,1.08);ds+=blob(p[0],p[1],1);dc+=blob(p[0]-lt[0]*rr*.16,p[1]-lt[1]*rr*.16,.55);dh+=c(p[0]+lt[0]*rr*.36,p[1]+lt[1]*rr*.36,rr*.3)}
        else if(kind===0){ds+=c(p[0],p[1],rr);dh+=c(p[0]+lt[0]*rr*.32,p[1]+lt[1]*rr*.32,rr*.38)}
        else{dq+=c(p[0]-lt[0]*rr*.35,p[1]-lt[1]*rr*.35,rr*.9);dp+=c(p[0],p[1],rr*.8)}}
      if(dq)E('path',{d:dq,fill:ps,'fill-opacity':.35*k},cg);if(dp)E('path',{d:dp,fill:pc,'fill-opacity':.9*k},cg);
      if(dw)E('path',{d:dw,fill:mix(sc,'#2a0010',.55),'fill-opacity':.26*k,filter:svBlur(Math.max(.2,Dm*.0018))},cg);
      if(ds)E('path',{d:ds,fill:sc,'fill-opacity':.92*k},cg);if(dc)E('path',{d:dc,fill:mix(sc,'#3a0012',.38),'fill-opacity':.5*k,filter:svBlur(Math.max(.1,Dm*.0006))},cg);
      if(dh)E('path',{d:dh,fill:mix(sc,'#ffffff',.42),'fill-opacity':.38*k,filter:svBlur(Math.max(.1,Dm*.0005))},cg)}}}
function lilMat(cw){const key='lis-oriental-double:'+cw.id;if(LIL_M[key])return LIL_M[key];
  const C=LIL_CW[cw.id]||lilSpec(cw),body=C.st[Math.floor(C.st.length*.6)][1];
  const M={st:C.st,bst:C.bst,shade:C.shade,lite:C.lite,bshade:C.bshade,blite:C.blite,vein:C.vein,bvein:C.bvein,vo:C.vo,
    rim:mix(body,h2l(body)[2]>.85?'#8a7a58':'#5a1830',.32),cast:mix(C.shade,'#1a0a08',.45),cross:C.cross,transmit:C.transmit,over:lilDots(C),
    fil:C.fil,anth:C.anth,pol:C.pol,sty:C.sty,sg:C.sg,ov:C.ov};
  return LIL_M[key]=M}
/* a colourway not yet measured (finishing step): its catalogue colour as the body, the white-pink pattern of 'rose' around it */
function lilSpec(cw){const c=cw.c||'#f2a6c4',l=h2l(c)[2],R=LIL_CW.rose;
  return Object.assign({},R,{st:R.st.map(([v,x])=>[v,v<.12?x:mix(c,'#ffffff',v<.2?.4:.08)]),bst:R.bst.map(([v,x])=>[v,v<.12?x:mix(c,'#ffffff',.35)]),
    cross:l>.85?[R.cross[1]]:[{st:R.cross[0].st.map(([u,x,a])=>[u,mix(c,'#5a0a2a',.25),a*.7]),v:[.1,.2,.9,1],soft:.02},R.cross[1],R.cross[2]],
    spots:l>.85?null:R.spots,shade:mix(c,'#3a0a1a',.55),bshade:mix(c,'#3a1a20',.45),vein:mix(c,'#6a1a30',.25)})}
const LIL_GENES={n:[[6,1]],tep:{dL:[.95,1.05],dW:[.92,1.08],dph:[-.05,.05],da:[-.08,.08],dt:[-.25,.25],tw:[-.22,.22],lat:[-.04,.04],wav:[.012,.026],wk:[3,5],wph:[0,6.28],
    ew:[.02,.045],tip:[1.15,1.45],asym:[-.06,.06],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],op:[-.03,.03],dh:[-3,3],ds:[-.04,.04],dl:[-.02,.015],sty:[0,6.2832],stL:[.94,1.06],sd:'sd'}};
/* the heart (fiche: filament .5 R0, anther .15 R0, style .55 R0): stamens opposite the tepals, curving out of the throat; the style nearly along
   the axis, a little declined, its stigma a swollen three-lobed head */
const LIL_HEART={filR:.05,filL:.62,filW:.022,a0:.42,a1:.9,anL:.2,anW:.044,anDot:0,cb:.16,st:[.42,.38],dnD:.15,sOff:0,ovR:.035,ovH:.1,styZ:.22,styL:.72,styW:.017,styA:.3,sgL:.03,sgK:.034};
function lilLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'lis-oriental-double',rec:{}})):0}
/* the free settings (refcache/lis-oriental-double/space.json; fit.py edits LIL_ODBL in place). Angles from the flower's axis (radians), each
   [bud, half-open, open]: the shoulder aS (the short throat), the body aB, the recurved tip aT from f0 */
const LIL_ODBL={L:[1.04,.98],W:[.25,.3],r0:.06,z0:[0,.01],grow:[.82,.4],bud:[.08,.26],rf:[.18,.26],sp:[.42,.5],
  aS:[[.15,.38,.7],[.14,.36,.65]],aB:[[.04,.42,1.29],[.03,.395,1.2]],aT:[[-.26,1.05,2.35],[-.24,.98,2.14]],s0:[.04,.06],s1:[.4,.34],f0:[.62,.62],
  wp:[[0,.3],[.07,.46],[.2,.8],[.4,1],[.58,.96],[.75,.74],[.9,.38],[1,.06]],vb:.55,cup:[.26,.22],budW:[.99,.99],
  green:[.9,.12,.3],greenC:'#a6b862',greenTip:.35,
  fanL:.3,fanW:.6,fanIn:.96,limp:[.5,.08],crk:[.02,.075],twF:1.1,twD:.35,wavD:.9,decB:.12,floor:3,floorO:.8,floorD:1,floorK:-1.4,
  genes:s=>svGenes(s,LIL_GENES),mat:lilMat,heart:svReflexHeart(LIL_HEART),life:()=>lilLife()};
/* the colour of a fading oriental lily (189; fiche stades.fane.couleur #69470c #956712 #c28e24 #f9e2a7): whites to ivory then ochre-beige,
   pinks to a dusty mauve then brown; the green foot yellows (lifeCol); the dark anthers and spots stay dark */
function lilWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.18)return c;
  if(h>=62&&h<175&&s>.15)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(l>.82&&s<.5){let o=mix(c,'#f2e4bc',.7*Math.min(1,w*1.5));if(w>.5)o=mix(o,'#c28e48',(w-.5)*.9);return o}
  let o=mix(c,'#b48a92',.55*Math.min(1,w*1.4));if(w>.5)o=mix(o,'#8a6040',(w-.5)*1.1);return o}
if(typeof GHI!=='undefined'&&GHI['lis-oriental-double'])GHI['lis-oriental-double'].wilt=lilWiltCol;
/* the late colourway (coloris.md: casa-blanca, a free name), at the end of the list: no SKU number moves */
if(typeof CW_LDBL!=='undefined'&&!CW_LDBL.some(c=>c.id==='casa-blanca'))CW_LDBL.push({id:'casa-blanca',late:16,n:'Blanc (Casa Blanca)',c:'#ebeaea',an:'#391a0e'});
/* the head: in the frame B at O (Z from the pedicel to the mouth), D the flower's diameter (a tepal about 0.5 D) */
function lilSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_LDBL!=='undefined'&&CW_LDBL.find(x=>x.id===cwId))||{id:cwId};
  return svReflex(par,B,O,D,S||LIL_ODBL,cwx,op,seed,wl==null?lilLife():wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['lis-oriental-double']=lilSvg;
/* ---------- the oriental lily (lis-oriental), drawn by hand after the photos (owner, 2026-10-18: the pipeline's head « pas du tout au niveau ») ----------
   Photos 4, 2, 24 (Stargazer types), 6, 7, 13 (Casa Blanca): six tepals, the three outer a little narrower (L/l about 3, the inner 2.5), widest
   at a third, then a long taper to an acuminate point that rolls back; the body open almost flat, cupped along a deep median furrow, green in
   the throat (the nectary channels make a green star); margins finely waved, the tip's back showing. Stargazer: a crimson band on each side of
   the furrow, white margins, crimson spots raised toward the throat, papillae. The heart is the lily's own (lilHeart): six long filaments
   arching out of the throat, versatile anthers like pollen-covered spindles held across their tips, rust or dark red; the style longer than
   the stamens, bending down and to one side, a swollen three-lobed stigma. */
/* the tissue of an oriental tepal, over the washes (photos 4, 2, 7 at 1:1): fine raised striae along the blade (a dark groove and a lit ridge each),
   the colour band laid as streaks that follow the veins (never a soft blot), the white fringed papillae lining the nectary furrow in the throat,
   then the spots and papillae (lilDots); only on the inner face, at DET >= 1.5 */
function lilOver(C){const dots=lilDots(C);
  return(sd,w,st)=>{const fd=dots(sd,w,st);if(!st.hi||st.r1<.4)return fd;const r=svRng(sd+77),NS=C.striae??44;
    const stri=[];for(let k=0;k<NS;k++)stri.push([(-1+2*(k+.5)/NS)*.95+r.in(-.01,.01),r.in(.02,.07),r.in(.8,.97),r.in(0,6.3),r.in(.6,1.2)]);
    const S=C.streak,band=S?Array.from({length:S.n},()=>{const u=r.in(-1,1);return[Math.sign(u)*Math.pow(Math.abs(u),1.4)*S.u,r.in(.05,.18),r.in(...(S.v1||[.5,.86])),r.in(0,6.3),r.in(.5,1.1)]}):[];
    const F=C.fringe,fr=F?Array.from({length:F.n},()=>[r.in(.035,F.v),r()<.5?-1:1,r.in(.025,.07),r.in(-.3,.3)]):[];
    const k=svSm((st.r1-.4)/.4)*(1-.7*st.fan),fade=1-.5*st.dec;
    return(cg,it,sh,front,Dm)=>{if(fd)fd(cg,it,sh,front,Dm);if(!front||LOD||k<.05)return;
      const seen=(u,v)=>it.s*svLerp(sh,sh.F,Math.max(-1,Math.min(1,u)),v)>.05;
      const path=pts=>{let d='',on=false;for(const p of pts){if(!p){on=false;continue}d+=(on?'L':'M')+svF(p[0])+','+svF(p[1]);on=true}return d};
      const along=(u0,v0,v1,ph,du)=>{const pts=[];for(let s=0;s<=14;s++){const v=v0+(v1-v0)*s/14,t=svSm((v-.02)/.45),u=(u0+du)*(.32+.68*t)+.005*Math.sin(v*13+ph);pts.push(seen(u,v)?svAt(sh,u,v):null)}return pts};
      let dk='',lt='';for(const[u0,v0,v1,ph]of stri){dk+=path(along(u0,v0,v1,ph,0));lt+=path(along(u0,v0,v1,ph,.012))}
      if(dk)E('path',{d:dk,fill:'none',stroke:C.shade,'stroke-width':svF(Math.max(.15,Dm*.0011)),'stroke-opacity':svF(.035*k*fade),'stroke-linecap':'round'},cg);
      if(lt)E('path',{d:lt,fill:'none',stroke:'#ffffff','stroke-width':svF(Math.max(.15,Dm*.0012)),'stroke-opacity':svF(.06*k),'stroke-linecap':'round'},cg);
      if(band.length){let d='';for(const[u0,v0,v1,ph]of band)d+=path(along(u0,v0,v1,ph,0));
        E('path',{d,fill:'none',stroke:S.c,'stroke-width':svF(Math.max(.2,Dm*S.w)),'stroke-opacity':svF(S.op*k*fade),'stroke-linecap':'round'},cg)}
      if(fr.length){let dh='',ds='';for(const[v,sg,len,tl]of fr){const a=svAt(sh,sg*.015,v),b=svAt(sh,sg*(.015+len),v+len*.35+tl*.02);if(!seen(sg*.015,v))continue;
          dh+='M'+svF(a[0])+','+svF(a[1])+'L'+svF(b[0])+','+svF(b[1]);ds+='M'+svF(a[0]+.6)+','+svF(a[1]+.6)+'L'+svF(b[0]+.6)+','+svF(b[1]+.6)}
        if(ds)E('path',{d:ds,fill:'none',stroke:C.shade,'stroke-width':svF(Math.max(.2,Dm*.0026)),'stroke-opacity':svF(.25*k),'stroke-linecap':'round'},cg);
        if(dh)E('path',{d:dh,fill:'none',stroke:F.c,'stroke-width':svF(Math.max(.2,Dm*.0024)),'stroke-opacity':svF(.9*k),'stroke-linecap':'round'},cg)}}}}
const LIL_ORI_CW={
  stargazer:{fine:{amb:.56,dif:.42,sat:.5,ao:.2,chroma:1.22},grid:{nu:6,nv:24,c:[['#f9b6c7','#f8b8ca','#f6acc3','#f6a2bc','#f394b1','#f29fba'],['#fd91a5','#f8baca','#f9b7cb','#f7a4be','#f59fbc','#f3a5c1'],['#e25471','#f67a98','#f18fac','#fdc0d3','#feb1cc','#f8aec9'],['#db4769','#e05779','#ee7fa0','#fcacc6','#ffb7d1','#ffc4d8'],['#d64166','#da5376','#f2799d','#ffb5cd','#ffc4d7','#ffd5e6'],['#d7456c','#de577e','#e36489','#f692b3','#fdbdd1','#ffcfdf'],['#e5567e','#e66088','#e86a92','#e87ca3','#ee9db8','#f6b9cd'],['#eb668d','#e86d94','#ef82a6','#ec8daf','#f2a5c0','#f2b9cc'],['#ed6e97','#ea779e','#ef8daf','#f09cbb','#f3aac4','#eeb3cb'],['#f378a2','#ec82a8','#e991b4','#f2aac5','#f2b1cb','#f3bfd3'],['#ef7da8','#f394b9','#e898ba','#f2b0cb','#f6c3d6','#f4c8d9'],['#f387b3','#f5a0c3','#eca3c3','#eeb5cd','#fad2e0','#f8d7e2'],['#f899c1','#f6a3c7','#f4b0cb','#eeb6ce','#fad3e0','#fbdfe8'],['#f9a0c6','#fca5c8','#faafcc','#f0b4cd','#f7cddd','#fbdfe7'],['#fb9dc3','#ffadce','#ffabcc','#f1aeca','#fbc9dd','#fce1e9'],['#fca4c6','#f9b0cd','#ffaccd','#ecb1cb','#f8c0d4','#ffe1ea'],['#fbb1ce','#f6b3ce','#f5b7d1','#e8abc5','#f1bbd1','#fed8e5'],['#ffcae1','#fcb8d3','#f2b6d0','#efb4cd','#efb9cf','#f7d2df'],['#ffe1f1','#ffcae2','#f5b7d0','#f2b8d0','#f9cbdb','#ece6e5'],['#ffe7f5','#fec7d9','#eaadc1','#f3bad3','#fad7e3','#ebe3e0'],['#ffecf6','#f2c1d0','#edb4c5','#f2c0d5','#f4dce3','#ede7e4'],['#fff5fa','#f5d1db','#ebc0cb','#f1cfd8','#efe4e4','#f3eeeb'],['#fdf6f1','#fffefc','#e8d6d8','#e0d3d3','#ece8e4','#efeeea'],['#f6f4eb','#f3f1e9','#fdfbf6','#fdfcf7','#eeece7','#edebe7']]},st:[[0,'#9cb252'],[.06,'#cadc8c'],[.13,'#f8e4ea'],[.24,'#f6c2d4'],[.42,'#f4b4c8'],[.66,'#f6c0d2'],[.86,'#fadce6'],[1,'#fceef3']],
    bst:[[0,'#9cb25a'],[.12,'#d8d8b0'],[.3,'#f4d8e0'],[.7,'#f4d2dc'],[1,'#f6dce4']],
    cross:[{st:[[0,'#9a1048',.9],[.025,'#b01a56',.55],[.06,'#c0225e',0]],v:[.02,.1,.86,.96],soft:.008},{st:[[0,'#d82a6c',.94],[.1,'#e0447e',.82],[.3,'#ec7aa2',.5],[.5,'#f4a6c0',.22],[.68,'#f8c4d4',0]],v:[.04,.15,.86,.98],bk:.2,soft:.03},
      {st:[[0,'#a8c050',.98],[.2,'#bcd070',.85],[.45,'#e6ecd0',0]],v:[-.1,0,.11,.22],soft:.02,fine:1},
      {st:[[0,'#9cb848',.9],[.04,'#b2c860',.55],[.09,'#d8e0a8',0]],v:[-.1,0,.16,.26],soft:.015,fine:1},
      {st:[[0,'#ffffff',0],[.56,'#fdf4f7',0],[.78,'#fefafc',.85],[1,'#ffffff',1]],tip:.88,bk:.5,soft:.03}],
    streak:{c:'#c8205e',n:70,u:.38,w:.0018,op:.16,v1:[.35,.6]},fringe:{c:'#fbf2f0',n:22,v:.2},rim:'#f0c4d4',
    spots:{c:'#c01844',n:[84,46],v:[.12,.55],u:[.05,.85],r:[.005,.011],k:.9},pap:{c:'#f0b8cc',sh:'#a83a62',n:[26,0],v:[.04,.28],u:.4},
    shade:'#c4507e',lite:'#fffafc',bshade:'#b07084',soft:.1,blite:'#fff8fa',vein:'#d06a90',bvein:'#d2a0b0',vo:.2,
    transmit:{a:.2,w:.005,eo:[.42,.14],ev:[.12,.3],lk:[.32,.46]},
    fil:'#e6dcae',filT:'#bdb460',anth:'#922a0c',pol:'#d85a24',sty:'#e0d6a6',styT:'#a49a3a',sg:'#a46a40',ov:'#a6bc66'},
  blanc:{fine:{amb:.6,dif:.42,sat:.5,ao:.2},grid:{nu:6,nv:24,c:[['#585f21','#575f21','#d5d3a8','#d3d1a7','#d4d2a9','#d6d4ab'],['#7d805c','#818361','#80835e','#848766','#888b69','#8b8f66'],['#848871','#8b8e78','#929583','#969886','#939676','#9da078'],['#9a9d96','#9a9d95','#9d9e96','#a1a29c','#a1a493','#a3a77f'],['#a0a19b','#a7a9a6','#abadaa','#acaeab','#afb2a6','#b2b28d'],['#b3b59d','#afb19a','#b4b79f','#b5b8a3','#b3b5b7','#b8baa4'],['#b5baa3','#b3b3a0','#b2b19e','#b2b3ac','#b5b9ba','#bbbfb7'],['#b8bba5','#aeb09b','#aeae9b','#b1b2ad','#b5b6b8','#c2c5b1'],['#b8bda7','#b8b9a6','#b6b7a6','#b5b6a6','#b8bab5','#c1c6b1'],['#bbbeaa','#babdaf','#b9bbac','#bbbaac','#bebeac','#caccb6'],['#c1c5b1','#c7ccbc','#cbccbc','#d2d2bf','#d2d4bd','#d1d4be'],['#caccbd','#cbcebd','#d3d3c5','#e6e6e9','#f2f2f4','#dde0ca'],['#c7ccbe','#c7c8bc','#d4d9cb','#e9ebef','#f3f3f7','#f0eff4'],['#c9ccc1','#d1d0c4','#dedfe3','#ecedf1','#f4f3f8','#eeeff3'],['#d2d4c6','#d8dacb','#e2e3e7','#eeeff3','#f2f1f6','#edeef3'],['#d4dacc','#dfe2d3','#e7e8ec','#eeeef3','#f2f3f7','#ecedf1'],['#d7d8dc','#e4e5df','#ebecf1','#eff0f5','#eeeff4','#eeeff3'],['#dde0d5','#e4e4e9','#ebecf1','#eeeff4','#f0f1f5','#ecedf1'],['#e1e3d3','#e5e6e8','#ebecf1','#f2f3f8','#f2f3f7','#ebecf1'],['#e1e3d3','#e5e8da','#e8e9ef','#eeeff3','#eeeff4','#ebecf1'],['#dbe3cc','#dee4cd','#e7e7dc','#e7e6db','#e9eaf0','#ebecf1'],['#d7ddce','#dae0cf','#e0e5d8','#e0e1e6','#d9dadf','#dddee3'],['#d7ddcd','#d7dfd0','#d2dbc6','#d5ddcb','#dee5d3','#e0e4dc'],['#d7dec8','#d5dbcb','#dae2d1','#d5decd','#dfe7d8','#dfe3dd']]},gridV:[.3,.45],st:[[0,'#9cb252'],[.06,'#cad890'],[.14,'#eef2dc'],[.28,'#f8f8f0'],[.6,'#fbfbf6'],[.86,'#fbfaf6'],[1,'#f8f8f0']],
    bst:[[0,'#9cb25a'],[.12,'#d6dab2'],[.3,'#f2f3e8'],[.7,'#f6f6ee'],[1,'#f4f4ea']],
    cross:[{st:[[0,'#a8c058',.8],[.025,'#c0d080',.45],[.06,'#e8ecd0',0]],v:[.0,.06,.62,.8],soft:.008},{st:[[0,'#d0dc90',.8],[.12,'#e0e6b2',.5],[.3,'#f2f4e4',0]],v:[.06,.14,.46,.66],bk:.2,soft:.025},
      {st:[[0,'#a8c050',.98],[.22,'#c0d276',.8],[.5,'#eef0dc',0]],v:[-.1,0,.12,.25],soft:.02},
      {st:[[0,'#a2bc4c',.9],[.06,'#b8cc68',.6],[.14,'#e4ead0',0]],v:[-.1,0,.32,.5],soft:.015}],
    fringe:{c:'#ffffff',n:38,v:.24},
    pap:{c:'#ffffff',sh:'#b8bc98',n:[28,0],v:[.04,.3],u:.42},
    shade:'#a0a690',lite:'#ffffff',bshade:'#a6ac94',soft:.1,blite:'#ffffff',vein:'#dcdcc8',bvein:'#d4d6bc',vo:.16,
    transmit:{a:.24,w:.006,eo:[.46,.16],ev:[.12,.3],lk:[.36,.5],wr:.25},
    fil:'#dfe2b4',filT:'#aab45e',anth:'#7a1e12',pol:'#a8301e',sty:'#e2e4b8',styT:'#9ca84c',sg:'#b8b890',ov:'#a6bc66'}};
const LIL_ORI_M={};
function lilOriSpec(cw){const c=cw.c||'#f2a6c4',l=h2l(c)[2],S=LIL_ORI_CW.stargazer,W=LIL_ORI_CW.blanc,base=l>.9?W:S;
  if(l>.9)return Object.assign({},W,cw.spots?{spots:Object.assign({},S.spots,{c:cw.spots,n:[22,12]}),pap:Object.assign({},S.pap,{c:cw.pap||S.pap.c})}:{});
  const edge=cw.edge||mix(c,'#ffffff',.72);
  return Object.assign({},base,{st:S.st.map(([v,x])=>[v,v<.1?x:v<.16?mix(c,'#f4ece0',.6):v>.8?mix(edge,c,.12):mix(c,'#ffffff',.18)]),bst:S.bst.map(([v,x])=>[v,v<.12?x:mix(c,'#ffffff',.55)]),
    cross:[{st:S.cross[0].st.map(([u,x,a])=>[u,mix(c,'#3a0418',.45),a]),v:S.cross[0].v,soft:.008},{st:S.cross[1].st.map(([u,x,a])=>[u,mix(c,'#4a0820',.32),a]),v:S.cross[1].v,bk:.2,soft:.02},S.cross[2],S.cross[3],{st:S.cross[4].st.map(([u,x,a])=>[u,edge,a]),tip:.8,bk:.4,soft:.02}],
    spots:cw.spots?Object.assign({},S.spots,{c:cw.spots}):null,pap:Object.assign({},S.pap,{c:cw.pap||S.pap.c}),
    shade:mix(c,'#3a0a1a',.5),bshade:mix(c,'#3a1a20',.42),vein:mix(c,'#6a1a30',.22),anth:cw.an?mix(cw.an,'#5a1a0a',.15):S.anth,pol:cw.an?mix(cw.an,'#e07030',.35):S.pol})}
function lilOriMat(cw){const key=cw.id;if(LIL_ORI_M[key])return LIL_ORI_M[key];
  const C=LIL_ORI_CW[cw.id]||lilOriSpec(cw),body=C.st[Math.floor(C.st.length*.6)][1];
  const M={st:C.st,bst:C.bst,shade:C.shade,lite:C.lite,bshade:C.bshade,blite:C.blite,vein:C.vein,bvein:C.bvein,vo:C.vo,
    soft:C.soft,fine:C.fine,grid:C.grid,bgrid:C.bgrid,gridV:C.gridV,rim:C.rim||mix(body,h2l(body)[2]>.85?'#8a8a68':'#5a1830',.3),cast:mix(C.shade,'#1a0a08',.45),cross:C.cross,transmit:C.transmit,over:lilOver(C),
    fil:C.fil,filT:C.filT,anth:C.anth,pol:C.pol,sty:C.sty,styT:C.styT,sg:C.sg,ov:C.ov};
  return LIL_ORI_M[key]=M}
/* the lily's heart: filaments, anthers, style and stigma, each a drawn piece with a proxy sheet for the order (the tepals' svDraw) */
const LILH_DEF={cb:.2,filR:.04,filL:.64,filW:.034,a0:.28,a1:.78,rise:.28,anL:.28,anW:.064,anTilt:1.1,styL:.72,styW:.045,styA:.62,styD:.3,sgR:.058,ovR:.04,ovH:.08,st:[.42,.38]};
function lilHeart(o0){const o=Object.assign({},LILH_DEF,o0);
  return({B,O,R0,g,cw0,op,bud,dec,fan,pieces,dn})=>{if(bud>.6)return;const hi=DET>=1.5,ost=svSm((op-o.st[0])/o.st[1]),sz=g.stL||1,
      lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),
      anth=mix(cw0.anth,'#3a2414',.6*fan),pol=mix(cw0.pol,'#3a2a18',.6*fan),fil=mix(cw0.fil,'#6a5a2a',.5*fan),filT=mix(cw0.filT||cw0.fil,'#6a5a2a',.5*fan),
      styC=mix(cw0.sty,'#5a4a2a',.45*fan),styT=mix(cw0.styT||mix(cw0.sty,'#f4f6e8',.25),'#5a4a2a',.45*fan),sgC=mix(cw0.sg,'#5a4a30',.4*fan),ovC=mix(cw0.ov,'#7a6a40',.5*fan);
    /* a round tube along 3D points, tapering w0 -> w1: its lit side, its shaded side, a thin highlight; the colour c0 at the foot to c1 at the end */
    const foot=mix(cw0.ov||'#a6bc66','#8e7a2a',.45);
    const tube=(P3,w0,w1,c0,c1,extra)=>{const sp=v=>{const x=v*(P3.length-1),j=Math.min(P3.length-2,Math.floor(x)),f=x-j;return V3.add(V3.sc(P3[j],1-f),V3.sc(P3[j+1],f))},
        ax=V3.cr(V3s(P3[P3.length-1],P3[0]),[0,0,1]),side=V3l(ax)>1e-3?V3.nz(ax):[1,0,0],
        prox=svSheet(B,O,(u,v)=>V3.add(sp(v),V3.sc(side,u*Math.max(w0,R0*.015))),{nu:2,nv:Math.max(3,P3.length)});
      pieces.push({fn:k2=>{const S2=P3.map(p=>PJ(B,O,p)),n=S2.length,Lp=[],Rp=[],Hp=[],Dp=[];let sg=1;
        for(let q=0;q<n;q++){const a=S2[Math.max(0,q-1)],b=S2[Math.min(n-1,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ww=(w0+(w1-w0)*q/(n-1))*.5,nx=-dy/l,ny=dx/l;
          if(q===Math.floor(n/2))sg=nx*lt[0]+ny*lt[1]>0?1:-1;
          Lp.push([S2[q][0]+nx*ww,S2[q][1]+ny*ww]);Rp.push([S2[q][0]-nx*ww,S2[q][1]-ny*ww]);Hp.push([nx,ny,ww,S2[q]])}
        /* matte (photo p002 at 1:1: filaments and style are velvety, never glassy): the colour along the tube, its foot fading into the throat;
           the volume across as two soft bands (the shaded side, a dull light), blurred, under a faint outline */
        const hk=G(k2),a=S2[0],b=S2[n-1],gid2='lh'+(gid++),gr=E('linearGradient',{id:gid2,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
        for(const[o2,c2,a2]of[[0,foot,.15],[.14,mix(foot,c0,.6),.85],[.3,c0,1],[1,c1,1]])E('stop',{offset:o2,'stop-color':c2,'stop-opacity':a2},gr);
        const outl=svSpl(Lp.concat(Rp.slice().reverse()));
        E('path',{d:outl,fill:`url(#${gid2})`,stroke:mix(c1,'#2a2a10',.3),'stroke-width':svF(Math.max(.1,w0*.06)),'stroke-opacity':.22},hk);
        if(!LOD){const band=(k,ww)=>svSpl(Hp.map(([nx,ny,w2,p],q)=>[p[0]+nx*w2*k*sg,p[1]+ny*w2*k*sg]),false),cl='lt'+(gid++);
          E('path',{d:outl},E('clipPath',{id:cl},GDEF||defs));const ck=G(hk,{'clip-path':`url(#${cl})`});
          E('path',{d:band(-.62,0),fill:'none',stroke:mix(c1,'#3a3a12',.45),'stroke-width':svF(Math.max(.2,w0*.62)),'stroke-opacity':.34,'stroke-linecap':'round',filter:svBlur(Math.max(.2,w0*.22))},ck);
          E('path',{d:band(.38,0),fill:'none',stroke:mix(c0,'#fffbe8',.45),'stroke-width':svF(Math.max(.15,w0*.42)),'stroke-opacity':.2,'stroke-linecap':'round',filter:svBlur(Math.max(.2,w0*.2))},ck)}
        if(extra)extra(hk)},proxy:prox})};
    /* an anther: a spindle covered with pollen, its axis a0 -> a1 (3D), w its width; drawn in the filament's hook (over its tip) */
    /* an anther (photo p002 at 1:1: a thick capsule with rounded ends, slightly bent, its two thecae parted by a dark suture, covered with a
       velvety granular pollen whose grains break the outline): its body shaded across (dark flanks, a dull lit ridge), the suture, then the
       pollen in three tones of grains, a few of them spilling past the silhouette; drawn in the filament's hook (over its tip) */
    const anther=(hk,A3,B3,w,sd)=>{const A=PJ(B,O,A3),Bq=PJ(B,O,B3),dx=Bq[0]-A[0],dy=Bq[1]-A[1],l=Math.hypot(dx,dy);if(l<.3)return;
      const nx=-dy/l,ny=dx/l,sg=nx*lt[0]+ny*lt[1]>0?1:-1,bend=w*.5*(pxHashS(sd,5,g.sd)-.5),N=14,Lp=[],Rp=[],mid=[],HW=[];
      const hwAt=s=>w*.5*Math.pow(Math.max(0,1-Math.pow(Math.abs(2*s-1),2.8)),1/2.8);
      for(let q=0;q<=N;q++){const s=q/N,hw=hwAt(s),bx=A[0]+dx*s+nx*bend*Math.sin(Math.PI*s),by=A[1]+dy*s+ny*bend*Math.sin(Math.PI*s);
        Lp.push([bx+nx*hw,by+ny*hw]);Rp.push([bx-nx*hw,by-ny*hw]);mid.push([bx,by]);HW.push(hw)}
      const out=svSpl(Lp.concat(Rp.slice().reverse())),mx=(A[0]+Bq[0])/2,my=(A[1]+Bq[1])/2,ag='la'+(gid++),
        agr=E('linearGradient',{id:ag,gradientUnits:'userSpaceOnUse',x1:svF(mx+nx*sg*w*.55),y1:svF(my+ny*sg*w*.55),x2:svF(mx-nx*sg*w*.55),y2:svF(my-ny*sg*w*.55)},GDEF||defs);
      for(const[o2,c2]of[[0,mix(anth,'#1a0804',.35)],[.18,mix(pol,anth,.35)],[.4,mix(pol,'#ffc890',.18)],[.62,pol],[.86,anth],[1,mix(anth,'#1a0804',.6)]])E('stop',{offset:o2,'stop-color':c2},agr);
      const cl='lac'+(gid++);E('path',{d:out},E('clipPath',{id:cl},GDEF||defs));
      E('path',{d:out,fill:`url(#${ag})`},hk);const ck=G(hk,{'clip-path':`url(#${cl})`});
      if(LOD)return;
      /* the suture between the two thecae, a little off the axis toward the shade */
      E('path',{d:svSpl(mid.map((p,q)=>[p[0]-nx*sg*HW[q]*.18,p[1]-ny*sg*HW[q]*.18]).slice(1,-1),false),fill:'none',stroke:mix(anth,'#1a0402',.6),'stroke-width':svF(Math.max(.12,w*.1)),'stroke-opacity':.6,'stroke-linecap':'round',filter:svBlur(Math.max(.1,w*.04))},ck);
      if(!hi)return;
      /* the pollen: grains in three tones (bright on the lit side, deep in the shade), denser than the outline, some past it (velvet edge) */
      const r=svRng(g.sd+sd*31),k=Math.round(70+w*6);let dL='',dM='',dD='';
      for(let q=0;q<k;q++){const s=.04+.92*r(),u=(r()*2-1)*1.08,hw=hwAt(s),bx=A[0]+dx*s+nx*bend*Math.sin(Math.PI*s),by=A[1]+dy*s+ny*bend*Math.sin(Math.PI*s),
          x=bx+nx*u*hw,y=by+ny*u*hw,rr=Math.max(.13,w*(.03+.05*r()*r())),side=u*sg,c3=`M${svF(x-rr)},${svF(y)}a${svF(rr)},${svF(rr)} 0 1,0 ${svF(2*rr)},0a${svF(rr)},${svF(rr)} 0 1,0 ${svF(-2*rr)},0`;
        if(side>.25&&r()<.75)dL+=c3;else if(side<-.3&&r()<.7)dD+=c3;else dM+=c3}
      E('path',{d:dD,fill:mix(anth,'#1a0402',.45),'fill-opacity':.55},hk);E('path',{d:dM,fill:mix(pol,anth,.3),'fill-opacity':.6},hk);
      E('path',{d:dL,fill:mix(pol,'#ffb070',.4),'fill-opacity':.7},hk)};
    /* the throat (photo p002: the feet of the filaments and the style come out of an olive-gold hollow in shadow, fringed by the papillae):
       a soft occlusion under the feet, drawn before them (its proxy is the hollow's floor), its rim fading into the tepals' bases */
    if(hi&&!LOD){const z0=R0*.02,rT=R0*.15,prT=svSheet(B,O,(u,v)=>{const a2=(u+1)*Math.PI;return[Math.cos(a2)*rT*.5*v,Math.sin(a2)*rT*.5*v,z0]},{nu:8,nv:2});
      pieces.push({fn:k2=>{const c=PJ(B,O,[0,0,z0]),e1=PJ(B,O,[rT,0,z0]),e2=PJ(B,O,[0,rT,z0]),rx=Math.hypot(e1[0]-c[0],e1[1]-c[1]),ry=Math.hypot(e2[0]-c[0],e2[1]-c[1]),
          id='lth'+(gid++),gr=E('radialGradient',{id},GDEF||defs);
        for(const[o2,c2,a2]of[[0,mix(foot,'#3a3008',.35),.62],[.45,foot,.42],[1,mix(foot,'#f4ecd0',.3),0]])E('stop',{offset:o2,'stop-color':c2,'stop-opacity':a2},gr);
        const ang=Math.atan2(e1[1]-c[1],e1[0]-c[0])*180/Math.PI;
        E('ellipse',{cx:svF(c[0]),cy:svF(c[1]),rx:svF(Math.max(.5,rx)),ry:svF(Math.max(.5,ry)),transform:`rotate(${svF(ang)} ${svF(c[0])} ${svF(c[1])})`,fill:`url(#${id})`,filter:svBlur(Math.max(rx,ry)*.12)},G(k2))},proxy:prT})}
    /* the stamens: one in front of each tepal, arching forward out of the throat, rising toward the end */
    const nT=g.n||6,nO=Math.ceil(nT/2);
    for(let i=0;i<6;i++){if(fan>.3&&pxHashS(i,17,g.sd)<(fan-.3)*1.3)continue;
      const kT=i%2?nO+(i-1)/2:i/2,dT=g.tep&&g.tep[kT]?g.tep[kT].dph:0,phi=g.rot+dT+(i%2?.5:0)/nO*6.2832+Math.floor(i/2)/nO*6.2832+.1*(pxHashS(i,4,g.sd)-.5),
        rad=[Math.cos(phi),Math.sin(phi),0],T=[-Math.sin(phi),Math.cos(phi),0],fl=R0*o.filL*sz*(.9+.16*pxHashS(i,3,g.sd))*(.55+.45*ost)*(1-.3*fan),
        e=.16*(pxHashS(i,8,g.sd)-.5),cb=o.cb*(pxHashS(i,11,g.sd)-.5),P3=[];let p=[rad[0]*R0*o.filR,rad[1]*R0*o.filR,R0*.03];P3.push(p);
      for(let j=1;j<=8;j++){const v=j/8,a=.08+((o.a0+(o.a1-o.a0)*Math.pow(v,1.3)+e)-.08)*ost-o.rise*svSm((v-.6)/.4)*ost;
        let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];d=V3.nz(V3.add(d,V3.sc(T,cb*v*ost)));
        if(fan+dec>0)d=V3.nz(V3.add(d,V3.sc(dn,(.9*fan+.15*dec)*v)));p=V3.add(p,V3.sc(d,fl/8));P3.push(p)}
      const tip=P3[P3.length-1],dTip=V3.nz(V3s(tip,P3[P3.length-2])),vs=svSm((ost-.4)/.45),
        tilt=o.anTilt*(pxHashS(i,9,g.sd)-.5)*2,across=V3.nz(V3.add(V3.sc(T,Math.cos(tilt)),V3.sc(dTip,Math.sin(tilt)))),
        ta=V3.nz(V3.add(V3.sc(across,vs),V3.sc(dTip,1.0001-vs))),al=R0*o.anL*sz*(1-.45*fan),c=V3.add(tip,V3.sc(V3.nz(V3.cr(ta,T)),R0*.004)),
        a0=V3.add(c,V3.sc(ta,-al*(.5+.08*(pxHashS(i,12,g.sd)-.5)))),a1=V3.add(c,V3.sc(ta,al*.5));
      tube(P3,R0*o.filW*1.25,R0*o.filW*.7,fil,filT,ost<.2?null:hk=>anther(hk,a0,a1,Math.max(.4,R0*o.anW*(1-.35*fan)),i))}
    /* the pistil: the ovary's top, the style longer than the stamens, bending down and to one side (declinate), the three-lobed stigma */
    if(ost>.05){const sa=g.sty??0,sr=[Math.cos(sa),Math.sin(sa),0],sL=R0*o.styL*sz*(.55+.45*ost),P3=[[0,0,R0*o.ovH*.5]];let p=P3[0];
      for(let j=1;j<=9;j++){const v=j/9,a=o.styA*ost*Math.pow(v,1.4);let d=[sr[0]*Math.sin(a),sr[1]*Math.sin(a),Math.cos(a)];
        d=V3.nz(V3.add(d,V3.sc(dn,o.styD*ost*v*v)));if(fan>0)d=V3.nz(V3.add(d,V3.sc(dn,.6*fan*v)));p=V3.add(p,V3.sc(d,sL/9));P3.push(p)}
      const end=P3[P3.length-1],tg=V3.nz(V3s(end,P3[P3.length-2]));
      tube(P3,R0*o.styW*1.05,R0*o.styW*1.25,styC,styT,hk=>{const rk=R0*o.sgR*sz*(.6+.4*ost),cs=[];
        for(let q=0;q<3;q++){const aq=q*2.0944+sa+.4,bq=V3.nz(V3.add(V3.sc(tg,.55),V3.sc([Math.cos(aq),Math.sin(aq),0],.8)));const c=PJ(B,O,V3.add(end,V3.sc(bq,rk*.36)));cs.push(c)}
        const ce=PJ(B,O,V3.add(end,V3.sc(tg,rk*.35)));
        /* one knob of three fused lobes (photo p004: a soft, slightly wet, matte head, never three beads): the union drawn twice, a darker
           rim under the body, one radial shade from the lit side, the grooves between the lobes, a dull sheen */
        /* the knob in volume (owner: « la boule du bout fait toute plate »; photo p002: brown at the rim, paler at the centre, a soft wet sheen):
           a dark occlusion where it sits on the style, then each lobe from the back, its own light from the lit side and its own dark rim,
           the grooves between them, one dull sheen */
        const rl=Math.max(.35,rk*.68),lobe=(x,y,r,k)=>{const id='lsg'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(x+lt[0]*r*.38),cy:svF(y+lt[1]*r*.38),r:svF(r*1.25)},GDEF||defs);
            for(const[o2,c2]of[[0,mix(sgC,'#fff4e8',.34)],[.42,mix(sgC,'#fff4e8',.1)],[.78,sgC],[1,mix(sgC,'#24120a',.55)]])E('stop',{offset:o2,'stop-color':c2},gr);
            E('circle',{cx:svF(x),cy:svF(y),r:svF(r),fill:`url(#${id})`},hk)};
        E('ellipse',{cx:svF(ce[0]-lt[0]*rk*.25),cy:svF(ce[1]-lt[1]*rk*.25),rx:svF(rk*1.25),ry:svF(rk*1.05),fill:mix(styT,'#1a1206',.6),'fill-opacity':.45,filter:svBlur(rk*.25)},hk);
        for(const c of cs)lobe(c[0],c[1],rl);lobe(ce[0],ce[1],rk*.7);
        if(!LOD){let gv='';for(const c of cs)gv+=`M${svF(ce[0])},${svF(ce[1])}L${svF(ce[0]+(c[0]-ce[0])*.6)},${svF(ce[1]+(c[1]-ce[1])*.6)}`;
          E('path',{d:gv,fill:'none',stroke:mix(sgC,'#24120a',.6),'stroke-width':svF(Math.max(.12,rk*.12)),'stroke-opacity':.45,'stroke-linecap':'round',filter:svBlur(rk*.05)},hk);
          E('ellipse',{cx:svF(ce[0]+lt[0]*rk*.45),cy:svF(ce[1]+lt[1]*rk*.45),rx:svF(Math.max(.15,rk*.28)),ry:svF(Math.max(.1,rk*.16)),fill:'#fffaf0','fill-opacity':.3,filter:svBlur(rk*.1)},hk)}})}}}
const LIL_ORI_GENES={n:[[6,1]],tep:{dL:[.95,1.05],dW:[.93,1.07],dph:[-.05,.05],da:[-.08,.08],dt:[-.3,.3],tw:[-.34,.34],lat:[-.05,.05],wav:[.09,.14],wk:[2.5,4],wph:[0,6.28],
    ew:[.015,.03],tip:[1.2,1.5],asym:[-.07,.07],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],op:[-.03,.03],dh:[-3,3],ds:[-.04,.04],dl:[-.02,.015],sty:[0,6.2832],stL:[.94,1.06],sd:'sd'}};
const LIL_ORI=Object.assign({},LIL_ODBL,{L:[1.2,1.12],W:[.255,.3],floorV:.04,floor:1.5,floorO:.4,nu:[16,20],nv:46,mrx:.08,light:Object.assign({},SVRX_DEF.light,{wrap:.12,amb:.2,dif:.82,ks:.2,gloss:22,da:.27,la:.24}),
  wp:[[0,.2],[.08,.34],[.2,.6],[.34,.84],[.48,.97],[.6,1],[.72,.92],[.83,.72],[.91,.46],[.97,.18],[1,.02]],vb:.62,
  aS:[[.15,.38,.7],[.14,.36,.66]],aB:[[.04,.42,1.48],[.03,.4,1.38]],aT:[[-.26,1.05,2.2],[-.24,.98,2.05]],f0:[.72,.7],cup:[.1,.08],
  genes:s=>svGenes(s,LIL_ORI_GENES),mat:lilOriMat,heart:lilHeart({cb:.9}),life:()=>lilLifeOf('lis-oriental')});
function lilLifeOf(sid){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid,rec:{}})):0}
if(typeof GHI!=='undefined'&&GHI['lis-oriental'])GHI['lis-oriental'].wilt=lilWiltCol;
function lilOriSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_LORI!=='undefined'&&CW_LORI.find(x=>x.id===cwId))||{id:cwId};
  return svReflex(par,B,O,D,S||LIL_ORI,cwx,op,seed,wl==null?lilLifeOf('lis-oriental'):wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['lis-oriental']=lilOriSvg;
/* the double lily of the bouquet (lilyFlower 'double', s2a.js; lilyPlant, r2a.js): the old drawing's share of the chance is consumed (three
   rows of six tepals, three draws each; no stamens), the first three name the individual; the old drawing stays as the fallback (SV_ON false) */
function lilSvgPut(par,B,O,D,cw,op){let s=0;for(let i=0;i<54;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return lilSvg(par,B,O,D,cw.id,op,svSeed('lis-oriental-double',cw.id,s),lilLife())}
if(typeof lilyFlower==='function'){const lilOld=lilyFlower;lilyFlower=function(par,B,O,D,cw,op,kd){
  if(kd!=='double'||typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id)return lilOld.apply(this,arguments);return lilSvgPut(par,B,O,D,cw,op)}}
