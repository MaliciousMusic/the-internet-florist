/* ---------- the tiger lily (Lilium lancifolium; 2026-10-19, at the oriental lily's level): the oriental's engine (svReflex, the fine material,
   the layers, the heart in the throat, the wilt) with the tiger's own shape and materials, read on the photos of refcache/lis-tigre (kept.jpg: a
   nodding Turk's cap, six narrow orange tepals swept back past the horizontal until their tips curl over, many raised purple-black dots from
   the throat to two thirds of the blade, papillae at the foot; the stamens long and splayed out of the flower, dark anthers; the style longer
   still). Registered as SV_HEAD['lis-tigre']. */
const LIL_TIG_GRID={};  /* measured grids per colourway (fleur/apparence.py grille on the named photos), filled colourway by colourway */
const LIL_TIG_M={};
function lilTigMat(cw){const key='tig:'+cw.id;if(LIL_TIG_M[key])return LIL_TIG_M[key];
  const base=lilOriSpec(Object.assign({},cw,{id:key,edge:cw.c})),  /* no pale edge: the tiger's tepal is orange to its margin */
    S=LIL_ORI_CW.stargazer;
  const spec=Object.assign({},base,{grid:LIL_TIG_GRID[cw.id]||null,gridV:null,fringe:null,streak:null,
    pap:Object.assign({},S.pap,{c:mix(cw.c,'#ffffff',.2),sh:mix(cw.spots||'#2a0c08',cw.c,.3),n:[30,0],v:[.03,.22],u:.45}),
    spots:{c:mix(cw.spots||'#2a0c08','#2a0418',.4),n:[54,12],v:[.06,.7],u:[.04,.8],r:[.008,.016],k:.95},
    fil:mix(cw.c,'#fff4e0',.25),filT:cw.c,sty:mix(cw.c,'#fff4e0',.3),styT:mix(cw.c,'#7a3a10',.2),sg:mix(cw.spots||'#2a0c08',cw.c,.35)});  /* filaments and style orange like the tepals (photos) */
  LIL_ORI_CW[key]=spec;const M=lilOriMat({id:key});return LIL_TIG_M[key]=M}
const LIL_TIG=Object.assign({},LIL_ORI,{L:[1.18,1.12],W:[.15,.17],cup:[.2,.22],mrx:.05,wavW:[.25,.35],
  aS:[[.15,.5,1.05],[.14,.46,.98]],aB:[[.04,.7,2.4],[.03,.66,2.3]],aT:[[-.26,1.2,4.0],[-.24,1.1,3.85]],f0:[.5,.5],  /* the tips curl over, back toward the pedicel */
  
  mat:lilTigMat,heart:lilHeart({cb:.5,filL:.86,a0:.5,a1:1.25,rise:.1,styL:1.0,styA:.5,anTilt:1.4}),life:()=>lilLifeOf('lis-tigre')});
function lilTigSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_LTIG!=='undefined'&&CW_LTIG.find(x=>x.id===cwId))||{id:cwId};
  return svReflex(par,B,O,D,S||LIL_TIG,cwx,op,seed,wl==null?lilLifeOf('lis-tigre'):wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['lis-tigre']=lilTigSvg;
