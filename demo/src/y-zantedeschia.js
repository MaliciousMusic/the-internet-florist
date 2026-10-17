/* ================= y-zantedeschia.js — calla / arum lily (Zantedeschia aethiopica and the coloured hybrids, cut flower) on the spathe kit =================
   One spathe rolled round its spadix into a flared cornet: a tight tube at the foot (the margins overlap round the stem), a slit that opens in front
   into a broad limb whose lip rolls outward, a short acumen at the top of the back; the spadix rises from the inner wall at the foot, deep in the
   throat. Smooth, round, fleshy stem cut in the vase, no leaf on it (the leaf is another sort). The old drawing (x3Calla2, s1b.js) stays as the
   fallback. Names: svZan… / SVZAN_… only (kit: svSpd… / SVSPD_…). */
const SVZAN_SID='arum-calla';
/* The colourways' materials, one row each, ids of CW_CALLA (s1b.js, SKU 1178..1193, then late:11), for fleur-finition to transcribe from coloris.md:
   base = inner face deep in the throat, body = the limb (inner face), tip = the lip and the acumen, back = the outer face, bb = the outer foot (green,
   melting into the stem), mac = throat blotch [colour, its height along the spathe] (only where the photos show one), spd = spadix [foot, middle, tip],
   vein = the fine parallel veins, edge = the margin browning at fané, shade = shadow of a white or cream (warm), src = where the value comes from.
   All values: catalogue colours (s1b.js) unless src says otherwise ; coloris.md is provisional (B/C) and is left to fleur-finition. */
const SVZAN_MAT={
  'blanc':        {base:'#e9ecd2',body:'#f9f8f2',tip:'#f7f5ee',back:'#f4f2ea',bb:'#8fb05a',spd:['#e2a414','#f2bd28','#f7d466'],vein:'#e6e6d6',edge:'#8a6a38',shade:'#d8cfb6',src:'catalogue (niveau C) ; mesures 1178 en ombre, grises (dE 16.7), non retenues ; blanc chaud eclaire garde ; gorge verdatre des photos 68, 91, 89'},
  'vert-pointe':  {base:'#dfe8bc',body:'#f6f7eb',tip:'#9cbc5e',back:'#eef0dc',bb:'#86aa52',spd:['#dca81c','#e9c23e','#f2d670'],vein:'#dfe4c8',edge:'#7e6a36',shade:'#d6d0b2',src:'catalogue (niveau C) ; une photo N3 (green-goddess), blanc mesure neutre et ombre, pointe verte non mesuree'},
  'blanc-rose':   {base:'#f2dcd8',body:'#f8efec',tip:'#eec0ca',back:'#f2e6e2',bb:'#94ae62',spd:['#e2aa20','#f0c040','#f5d468'],vein:'#ecdcd8',edge:'#8a5a44',shade:'#dcc6be',src:'catalogue (niveau C) ; mesure incompatible (ecart de teinte 42-56 deg), rose non prouve'},
  'creme':        {base:'#ece0b8',body:'#f5eed6',tip:'#efe6c8',back:'#efe8d0',bb:'#90ae5c',spd:['#e0a81c','#eebd38',  '#f4d26c'],vein:'#e6dcc0',edge:'#86683a',shade:'#d8c9a2',src:'catalogue (niveau D) ; aucune photo nommee, non mesure'},
  'picasso':      {base:'#efe6cc',body:'#f3ecda',tip:'#ece4cc',back:'#eee8d4',bb:'#8aa858',mac:['#4a1438',.2],spd:['#d8a630','#e8c048','#f0d470'],vein:'#e2d8c2',edge:'#7a5a3a',shade:'#d6c8a8',src:'catalogue (niveau C) ; mesure = black-eyed-beauty olive-jaune, pas une creme ; macule brun-pourpre d apres la photo 30'},
  'jaune':        {base:'#d6c03a',body:'#d9c226',tip:'#dec63a',back:'#d4c050',bb:'#94a840',spd:['#e89a1c','#f0a82a','#f4c050'],vein:'#c8b030',edge:'#7a5a20',src:'niveau B ; mesure captain-solo (1 photo N3) base #d6c03a corps #d9c226 ; pointe, revers, nervures derives ; spadice non mesure (jaune-orange des photos 21, 26)'},
  'or':           {base:'#dc9c10',body:'#ecb11e',tip:'#eab42a',back:'#e4b232',bb:'#8ea43c',spd:['#de8414','#e8921c','#f0ae40'],vein:'#d49a18',edge:'#6e4a18',src:'catalogue (niveau C) ; base mesuree a 10 deg de teinte, corps mesure sur feuillage, une photo'},
  'peche':        {base:'#ee8452',body:'#f6b48e',tip:'#f4b896',back:'#f0b28e',bb:'#90a454',spd:['#e89020','#f0a030','#f4bc58'],vein:'#e89c76',edge:'#7a4a2a',src:'catalogue (niveau C) ; mesure rose-saumon a 37-41 deg de teinte, nom peche non prouve'},
  'orange':       {base:'#e46420',body:'#ef7a2e',tip:'#f08638',back:'#ea8240',bb:'#8c9c44',spd:['#e89420','#f2a628','#f6c058'],vein:'#d8641e',edge:'#6a3818',src:'catalogue (niveau C) ; dE 39 entre photos, base a 14 deg de teinte'},
  'rose':         {base:'#d65f88',body:'#ee93b0',tip:'#efa0ba',back:'#eaa0b6',bb:'#8ea05a',spd:['#e2ac38','#f2c04a','#f6d272'],vein:'#dc7e9c',edge:'#7a4048',src:'catalogue (niveau C) ; dE 53 entre photos, plusieurs roses melanges'},
  'grenat':       {base:'#a82a58',body:'#c33a6b',tip:'#c84676',back:'#bc4a72',bb:'#7e8a4a',spd:['#d6a436','#e8b84a','#f0cc6c'],vein:'#a8305c',edge:'#5a2232',src:'catalogue (niveau C) ; garnet-glow dE 10.4 entre 2 photos, corps a 11 deg de teinte'},
  'rouge':        {base:'#a8141f',body:'#c4202d',tip:'#c82a36',back:'#b8303a',bb:'#7a8644',spd:['#e0ac30','#f0c040','#f4d266'],vein:'#a01822',edge:'#4e1a16',src:'catalogue (niveau C) ; dE 32 entre photos (red-alert / majestic-red)'},
  'bordeaux':     {base:'#560c1e',body:'#6b1229',tip:'#741a32',back:'#6e2034',bb:'#5e6a38',spd:['#c49c3a','#d8b44a','#e4c86a'],vein:'#560e22',edge:'#3a1414',src:'catalogue (niveau C) ; aucune photo bordeaux, mesure = majestic-red rose-rouge'},
  'pourpre':      {base:'#621e56',body:'#7b2a6c',tip:'#843474',back:'#7a3470',bb:'#5e6a40',spd:['#cca23e','#e0b850','#eacb70'],vein:'#621e56',edge:'#3e1a30',src:'catalogue (niveau C) ; dE 47 entre photos, teinte a 33-39 deg'},
  'noir':         {base:'#200614',body:'#2c0a1e',tip:'#341024',back:'#3a1428',bb:'#4a5430',spd:['#c49c3a','#d8b44a','#e4c86a'],vein:'#220814',edge:'#241010',src:'catalogue (niveau C) ; quasi-noirs dE 15, teinte instable'},
  'chocolat':     {base:'#3a1314',body:'#4b1b1c',tip:'#542222',back:'#562a26',bb:'#56603a',spd:['#bc9030','#d0a040','#dcb664'],vein:'#3a1414',edge:'#2a1410',src:'catalogue (niveau C) ; dE 16 entre photos, brun-rubis et magenta-vin'},
  /* late:11 (coloris.md, level B provisoire, one photo each, cultivars under a mark: generic names) */
  'orange-saumon':{base:'#e87831',body:'#e3773c',tip:'#e8803e',back:'#e4823e',bb:'#8c9c48',spd:['#e89420','#f2a628','#f6c058'],vein:'#d0662a',edge:'#6a3a1c',src:'niveau B ; mesure d une photo N3 (cultivar sous marque) base #e87831 corps #e3773c ; pointe et revers derives ; spadice non mesure'},
  'orange-rouge': {base:'#c72a1e',body:'#e57041',tip:'#e87a4a',back:'#dc6a42',bb:'#84904a',spd:['#e2a42c','#f0b83c','#f4cc64'],vein:'#b42a1c',edge:'#5a2416',src:'niveau B ; mesure d une photo N3 (cultivar sous marque) base #c72a1e corps #e57041 ; pointe et revers derives ; spadice non mesure'},
  'jaune-gorge-pourpre':{base:'#a89a58',body:'#bcab6f',tip:'#c4b47a',back:'#c0b27c',bb:'#8ea44a',mac:['#3a1426',.22],spd:['#d8a630','#e8c048','#f0d470'],vein:'#a89a58',edge:'#6e5228',src:'niveau B ; mesure d une photo N3 (fond blanc, cultivar sous marque) limbe #bcab6f, gorge pourpre-noir (photo) ; base, pointe, revers derives ; spadice non mesure'}};
/* the late colourways (wave 11), at the end of the list: no SKU number moves */
if(typeof CW_CALLA!=='undefined'&&!CW_CALLA.some(c=>c.id==='orange-saumon'))CW_CALLA.push(
  {id:'orange-saumon',late:11,n:'Orange saumon',c:'#e87831',sp:'#f2a628',k:.8},
  {id:'orange-rouge',late:11,n:'Orange rouge',c:'#e05a34',sp:'#f0b83c',k:.8},
  {id:'jaune-gorge-pourpre',late:11,n:'Jaune à gorge pourpre',c:'#efe28a',throat:'#3a1426',sp:'#e8c048',k:.8});
/* the half width of the unrolled spathe along its height (x L): the foot wraps the stem (tube radius ~ the stem's), widest at .62, a short acumen */
const SVZAN_HW=[[0,.135],[.1,.15],[.22,.22],[.36,.32],[.5,.45],[.6,.5],[.7,.47],[.8,.36],[.87,.22],[.93,.1],[.97,.04],[1,0]];
/* the sort: only what differs from SVSPD_DEF. Roll (wrapL: 1 = the margins meet): a tube to .3, the slit, then the limb ; the lip rolls outward
   (hemV) ; the back arches a little (camb) ; bud: rolled tight, pointed (H/W ~3.5) ; fané: the spathe closes again (fanRoll), the neck bows (bow) */
const SVZAN_SPEC={sid:SVZAN_SID,hw:SVZAN_HW,wrapL:true,footO:true,tp:.55,headK:1.3,sink:0,budL:.72,growR:[0,.7],open:[.15,.6],green:[.1,.3],greenC:'#7a9e4c',
  tilt:[1.52,1.28],droop:0,bow:.9,bowS:-1,roll:[[0,1.02],[.4,1],[.55,1.05],[.7,1.3],[.82,1.6],[.92,2],[1,2.4]],rollO:[[0,1.3],[.15,1.22],[.28,1],[.4,.9],[.52,.8],[.65,.7],[.78,.6],[.9,.5],[1,.42]],reflex:[[0,0],[.36,0],[.48,5],[.65,9],[.8,9],[.92,5],[1,0]],reflexF:.66,aoT:[.66,.32,.8],throat:[.42,.85,.6],ovlSh:.42,
  fanRoll:[[0,0],[.4,.05],[.6,.2],[1,.25]],ovl:.1,cup:[[0,0],[1,0]],camb:.1,tipUp:-.06,lobUp:0,hem:0,hemV:[[0,0],[.42,0],[.6,1],[.88,1],[1,.3]],
  fanCamb:.1,fanHem:.03,fanCup:0,fanL:.06,wav:.025,veinF:[.1,.2,.3,.4,.5,.6,.7,.8,.9],quilt:[0,0],glint:.25,
  spd:{len:.42,bud:.5,r0:.032,r1:.028,el:[.06,.2],az:[2.95,3.33],curve:[0,.12],grain:[50,110],sh:.4,foot:.7},neck:{len:.4,w:.095},stemW:.095,
  nu:[14,20],nv:[18,26],light:{ks:.32,gloss:9,trans:.06,soft:.05},matFn:(cm,S,st)=>svZanMat(cm,S,st),veinsFn:(S,g,st,mref)=>svZanVeins(S,g,st,mref),
  genes:{size:[.93,1.07],as:[-.05,.05],bend:[-.025,.025],tw:[-.1,.1],psi:[-.3,.3],tilt:[-.1,.1],camb:[-.04,.05],cup:[0,0],lb:[1,1],tp:[.85,1.15],quilt:[1,1],
    ro:[.88,1.12],el:[0,1],az:[0,1],curve:[0,1],ph:[0,6.28],sd:[0,1e6]}};
/* fading colours (brief: photo 84 and the literature): whites and creams to ivory, then the edge browns and the limb greens a little ; yellows pale to
   straw ; reds, pinks, purples dull toward wine and brown ; near-blacks stay */
function svZanWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);if(l<.14)return c;
  if(s<.25&&l>.7){let o=mix(c,'#f0e8cc',.45*w);if(w>.5)o=mix(o,'#c2b486',(w-.5)*.8);return o}
  if(h>=38&&h<75)return mix(mix(c,'#dcc278',.5*w),'#8a6a30',Math.max(0,w-.5)*.6);
  if(h>=75&&h<175)return typeof lifeCol==='function'?lifeCol(c,w):mix(c,'#a08a48',.6*w);
  let o=l2h(h>=265?h-20*w:h<40?h-5*w:h,s*(1-.35*w),l*(1-.18*w));if(w>.45)o=mix(o,'#5a3020',(w-.45)*.8);return o}
/* the material: the kit's, with the inner face run from the throat (and its blotch) to the lip, the outer face green at the foot */
function svZanMat(cm,S,st){const k=Math.max(st.fan,st.dec*.35),W=k>0?(c=>svZanWiltCol(c,k)):(c=>c),c2={};for(const key of['base','body','tip','back','vein'])c2[key]=W(cm[key]||cm.body);
  const m=svSpdMat(Object.assign({},cm,c2),S,st,null),kG=Math.min(1,st.gr*1.7)*.9,gb=c=>st.gr>0?mix(c,S.greenC,kG):c,tip=st.gr>0?mix(c2.tip,S.greenC,st.gr*.45):c2.tip,
    base=gb(c2.base),body=gb(c2.body),back=gb(c2.back),bb=W(cm.bb||'#8fae5c');
  if(cm.mac&&st.gr<.5)m.mac=[W(cm.mac[0]),cm.mac[1]];
  m.stops=[[0,base],[.28,mix(base,body,.6)],[.42,body],[.82,body],[1,tip]];
  m.bstops=[[0,bb],[.1,mix(bb,back,.45)],[.28,back],[.85,back],[1,mix(back,tip,.5)]];if(cm.shade&&st.gr<.5)m.shade=m.bshade=W(cm.shade);return m}
/* the veins, and the throat blotch on the inner face only (photo 30: a dark blotch deep in the throat, its upper edge in streaks of unequal length) */
function svZanVeins(S,g,st,mref){const base=svSpdVeins(S,g,st,mref);return(sh,front)=>{const out=base(sh,front),m=mref.m;if(!front||!m.mac||LOD)return out;
  const[c,v]=m.mac,N=17,core=[],fl=[];for(let i=0;i<N;i++){const u=-.9+1.8*i/(N-1),h=pxHashS(i,5,g.sd|0),h2=pxHashS(i,9,g.sd|0),top=v*(.75+.35*h);
    core.push([[u,.01],[u,top*.5],[u,top]]);fl.push([[u+.02*(h2-.5),top*.8],[u+.04*(h2-.5),top*(1.15+.35*h2)]])}
  out.push([core,.045,c,.9],[fl,.012,c,.55]);return out}}
/* the stem's colours, styled for the SVG stem: smooth, round, fleshy, a soft gloss, no hairs, no ribs */
function svZanStemCols(cw){const c=['#2e4c22','#4c7834','#7ea858','#b6d290'];c.sv={gloss:.45,swell:.015,ribs:[]};return c}
function svZanLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:SVZAN_SID,rec:{}})):0}
/* the head for the sheets: centred on its spathe, the stub of stem below the tube */
/* the head draws its own fading colours (svZanMat): the global wilt (WILT, lifeCol or the anemone's) is held off while it draws, or they add up */
function svZanHead(par,B,O,D,S,cm,op,seed,wl,o){const W0=typeof WILT!=='undefined'?WILT:null,S2=svSpdSpec(S),fan=svSm(((wl||0)-S2.fan[0])/S2.fan[1]);
  /* the stub and the bowed neck fade like the stem of the plant (lifeCol), as the global wilt would have done */
  const sc=o.sc||svZanStemCols(),sw=fan>0?Object.assign(sc.map(c=>svZanWiltCol(c,fan)),{sv:sc.sv}):sc;if(W0)WILT=null;
  try{return svSpdHead(par,B,O,D,S,cm,op,seed,wl,Object.assign({},o,{sc:sw}))}finally{if(W0)WILT=W0}}
function svZanSvg(par,B,O,D,cwId,op,seed,wl,S,o){const cm=SVZAN_MAT[cwId]||SVZAN_MAT.blanc,oo=Object.assign({center:true,kv:0,arcL:.25,face:.6,flip:true},o||{});
  return svZanHead(par,B,O,D,S||SVZAN_SPEC,cm,op,seed,wl==null?svZanLife():wl,oo)}
/* the head on the plant (callaPlant, r4a.js): the bouquet's chance consumed exactly as x3Calla2 did (its 3 R() and the 2 R() of its open()), then the
   SVG head from its own seed, at the old head's length (cm x UPC x the colourway's size k) */
/* at fané the head's frame turns onto the stem's real heading at its tip (og.H, lsHeadS): the bowed neck leaves the stem tangent, never a kink */
function svZanAlign(B,H,f){const z0=B[2],h=V3.nz(H);if(!(f>0)||V3.dot(z0,h)<.3)return B;const z1=V3.nz(V3.add(V3.sc(z0,1-f),V3.sc(h,f))),ax=V3.cr(z0,z1),s=Math.hypot(...ax);
  if(s<1e-6)return B;const k=V3.sc(ax,1/s),c=V3.dot(z0,z1),rot=v=>{const kv=V3.dot(k,v),kx=V3.cr(k,v);return[0,1,2].map(j=>v[j]*c+kx[j]*s+k[j]*kv*(1-c))};return B.map(rot)}
const SVZAN_BQBOW=0;
function svZanFlower(o,cw,w){return(par,B,O,D2,op2,og)=>{const r0=rnd,rec=[];rnd=()=>{const x=r0();rec.push(x);return x};try{for(let i=0;i<5;i++)R(0,1)}finally{rnd=r0}
  const B0=B;
  {const wl=svZanLife(),S2=svSpdSpec(SVZAN_SPEC),fn=svSm(((wl||0)-S2.fan[0])/S2.fan[1]);if(og&&og.H&&fn>0)B=svZanAlign(B,og.H,fn)}
  const L=(o.cm||12)*UPC*(cw.k||1)*(SVZAN_SPEC.headK||1),seed=svSeed('calla',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(L*8));
  /* in a bouquet the head keeps inside the old drawing's box (svSpdKeepBox, y3-spathe.js: rtest); there c5 nods the faded head already, so its own
     bow is lighter (SVZAN_BQBOW) and the head keeps a size close to the open one's */
  const bq=typeof GDEF!=='undefined'&&!!GDEF;
  svSpdKeepBox(par,q=>svZanHead(q,B,O,L,SVZAN_SPEC,SVZAN_MAT[cw.id]||SVZAN_MAT.blanc,op2,seed,svZanLife(),{neckW:w,neckL:0,arcL:.3,sink:SVZAN_SPEC.sink||0,sc:svZanStemCols(cw),bowK:bq?SVZAN_BQBOW:1}),
    q=>lsAsFlower(x3Calla2,Object.assign({},o,{cw}))(q,B0,O,D2,op2),rec,O)}}
SV_HEAD[SVZAN_SID]=svZanSvg;
if(typeof GHI!=='undefined'&&GHI[SVZAN_SID])GHI[SVZAN_SID].wilt=svZanWiltCol;
