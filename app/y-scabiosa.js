/* ================= Pilote : la scabieuse (Scabiosa atropurpurea, Caprifoliaceae) en SVG natif, sur la pièce coussin (y-scabiosa.js) =================
   One module for the genus, one sheet per form, on svcuDraw (y3-coussin.js). From the photographs of refcache/scabieuse (brief.md, kept.jpg):
   - open (6, 17, 29, 41, 1): a ball of florets, nearly globular in the dark garden forms (17: as high as three quarters of its width), each floret a
     small cup of five rounded, crinkled lobes round a dark throat, small and still closed at the top (6: the dark heart), larger toward the rim
     where the marginal florets spread a frilled fan of enlarged outer lobes hanging over the edge (the skirt); pale pink-white pins (filaments
     and oblong anthers) leaning out of the open florets all over the ball (6, 17);
   - the bud (23, 26, 20): a flattened ball (H/W .72) of closed pearl-like florets, pale green, pink at the top first, in eight or so narrow
     pointed bracts spread round it; entrouvert (21, 22, 34): a dark ball of closed pearls, the rim's florets opening first;
   - decline (28): the corollas wither, a few dark ones hang limp round the green fruiting ball; dry (106, 107: Lomelosia, the same habit): a
     tan ball set with star-shaped calyces and bristles, smaller than the flower.
   Colours: SCAB_MAT[id] (svcuMat fields) for the measured colourways; the others derive from CW_SCAB (s10a.js: c, pin, dome) until the finishing
   step measures them. */
var SCAB_MAT=typeof SCAB_MAT!=='undefined'?SCAB_MAT:{};
Object.assign(SCAB_MAT,{
  /* the saturated one: deep crimson-burgundy (6: #550711 at mid radius, #39070c in the throats, pins #ebb1d0), its velvet lit crimson at the lobes' rims */
  bordeaux:{body:'#5e0c22',rim:'#670e25',top:'#3c0915',throat:'#1c0409',gap:'#22050c',shade:'#2a050e',lite:'#a32c45',ink:'#33060f',back:'#4e0d1f',
    pin:'#f2d8e4',anth:'#f8e8ef',fil:'#a8687c',anthSh:'#3a0812'},
  /* the pale one: warm white, the closed heart greenish cream, warm cream shadows (never grey), cream pins */
  blanc:{body:'#f3efe4',rim:'#f6f2e9',top:'#e3e2c4',throat:'#dcd5b0',gap:'#ddd3b8',shade:'#d6c7a6',lite:'#ffffff',ink:'#c2b08c',back:'#ece6d5',
    pin:'#fbf9f1',anth:'#d9d0b8',fil:'#e6dfcc',anthSh:'#a8977a'}});
/* the sheet: only what the scabious sets itself (the rest is SVCU_DEF, written from it) */
const SCAB_STD={sid:'scabieuse',mat:cwx=>svcuMat(cwx,SCAB_MAT[cwx.id]),
  /* about a hundred florets on the ball (6: 70 to 90 seen from the face), 5 lobes (a quarter of them 4), the marginal ones from 0.78 of the cap */
  /* the skirt (6, 11, 29): the marginal florets' outer lobes spread out, about 25 deg below the horizontal, the faces turned up; they reach a
     little past the dome (6: about a fifth of the radius) and hang only when the head fades */
  /* dq 1.45: the florets crowd toward the top, small there, so the ball reads as a pincushion and the rim's florets carry the frill (1, 6) */
  n:[60,100],dq:1.45,nl4:.25,mT:.78,mE:1.1,mDroop:.25,mTilt:1.6,wDroop:.5,wS:.55,
  /* the ball: cap 1.65 rad open (17: the rim just below the equator); rs, capC, budZ, mTilt and the bracts' angles from fit.py (refcache/scabieuse/fit,
     targets bouton.hw, entrouverte.wh and .ang of photos 21, 23, 26) */
  rs:.83,capO:1.65,capC:1.47,budZ:.72,
  /* bracts: eight (6 to 12), about half the head (fiche: longueur_sur_tete .45 of the diameter, here x R0), L/W 6 (fiche: L_sur_l) */
  br:{n:8,nJ:2,L:.52,W:.087,a0c:.45,a1c:.39,a0o:1.85,a1o:2.13},
  /* pins (6, 32): small pale anthers dotted all over the ball, the filaments short (fiche: saillie .15 of the lobe's length, here x R0) */
  pin:{L:.075,ar:.01,fw:.005},crk:.18};
/* the colour of fading (28, 106, 107): the dark reds to a dull wine-brown, pinks and mauves dulled toward a dusty mauve-brown, whites to ivory then
   a light tan, greens (bracts, the bud) to olive then straw; at the end the dry head is tan */
function scabWiltCol(c,w){if(w<=0)return c;const[h,s,l]=h2l(c),k=svSm((w-.3)/.5),k2=svSm((w-.72)/.28);if(k<=0)return c;let o;
  if(s<.15||l>.86)o=mix(c,'#e6d8b8',.7*k);/* whites and creams: ivory */
  else if(h>=70&&h<170)o=l2h(h-(h-55)*.5*k,s*(1-.45*k),l*(1-.1*k));/* greens to olive */
  else if(l<.32)o=l2h(h+(((10-h+540)%360)-180)*.3*k,s*(1-.35*k),l*(1-.15*k));/* the dark reds: wine-brown */
  else o=l2h(h+(((20-h+540)%360)-180)*.25*k,s*(1-.45*k),l*(1-.18*k));/* pinks, mauves, blues: dusty */
  return k2>0?mix(o,l>.6?'#b49c78':'#5a4030',.4*k2):o}
if(typeof GHI!=='undefined'&&GHI['scabieuse'])GHI['scabieuse'].wilt=scabWiltCol;
/* how far the scabious has wilted (0 fresh .. 1 dry): the sheets' override, else the bouquet's stage */
function scabLife(){return typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null?SVA_LIFE:(typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'scabieuse',rec:{}})):0)}
/* the head, any colourway of CW_SCAB (a brand never shows its name: the list's names are generic) */
function scabSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_SCAB!=='undefined'&&CW_SCAB.find(x=>x.id===cwId))||{id:cwId,c:'#5a1030',pin:'#f4eef0'};
  return svcuDraw(par,B,O,D,S||SCAB_STD,cwx,op,seed,wl==null?scabLife():wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['scabieuse']=scabSvg;
/* the bouquet's chance drawn by the old head (scabFlower, s10a.js: 1, 10 bracts seen from the side or behind, 3 for each of 10 florets; capBud: 7
   bracts), so that the composition stays the same; bud = 1 for the old capBud */
function scabOldDraws(nz,bud){return bud?7:1+(nz<.45?10:0)+30}
function scabSvgPut(par,B,O,D,cw,op,bud){if(typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id)return false;const n=scabOldDraws(B[2][2],bud);for(let i=0;i<n;i++)R(0,1);
  scabSvg(par,B,O,D,cw.id,op,svSeed('scabieuse',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)));return true}
