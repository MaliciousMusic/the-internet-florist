/* ================= Pilote, lis de feu : le genre Gloriosa en SVG natif (y-gloriosa.js) =================
   One module per genus, one sheet (fiche) per kind; the head is the kit's reflexed flower (y3-reflexe.js: svReflex, svReflexHeart).
   The kind: GLR_SPEC, Gloriosa superba L. (florists' Rothschildiana type; catalogue/serre/fiches/gloriosa.json, refcache/gloriosa brief and photos).
   Six free tepals in two whorls, 5 to 8 cm long (L/l about 4), narrow at the claw, acuminate, their margins strongly crisped; the flower nods on
   its pedicel and the tepals sweep back up past the horizontal into a crown of flames (photos 22, 11, 3, 95), the tips hooking outward; first
   gathered in a column round the pedicel as they open (36, 71), then spread. Six stamens spread almost square to the axis (filaments about 0.7 of
   the tepal), versatile anthers held across; the style bent square near its foot, sideways (22, 45). The bud hangs, a pale green spindle (82).
   Decline and faded (69, 79, 98): the tepals wither on the flower: narrower, twisted and crimped, gathered back, browning, the tips paler. */

/* the colourways (coloris.json, catalogue values, level D: no photograph of a named variety): ground of the inner face from the claw (0) to the
   point (1), the back a little paler; the margin's own colour (cross: Rothschildiana's yellow edge), the flames rising from the yellow foot into
   the body; shade and light of the washes; veins; heart: filament, anther, pollen, style, stigma, ovary */
const GLR_CW={
  rothschildiana:{st:[[0,'#b4b648'],[.1,'#eabf3c'],[.22,'#e9a636'],[.36,'#d84a2e'],[.5,'#cc1f2e'],[.82,'#c81d2f'],[1,'#d23a32']],
    bst:[[0,'#a9b04e'],[.12,'#e4bf4a'],[.3,'#e2683e'],[.5,'#d4344a'],[.85,'#d02e40'],[1,'#d8503c']],
    edge:'#f2c83a',edgeW:[.6,.8],edgeA:.95,base:'#f0c040',fl:{c:'#f0c040',n:[3,5],from:.12,to:.44,w:.032,op:.6},
    shade:'#5e0814',lite:'#ff9a86',bshade:'#6e1420',blite:'#ffb8a6',vein:'#9a0c1c',bvein:'#a8202c',vo:.24},
  jaune:{st:[[0,'#a8ae40'],[.12,'#cfc23e'],[.3,'#ebc838'],[.5,'#f0c838'],[.85,'#f2cc42'],[1,'#f4d660']],
    bst:[[0,'#a2aa46'],[.14,'#d4c64a'],[.4,'#eecc48'],[.85,'#f2d256'],[1,'#f4dc6e']],
    edge:'#f7e08a',edgeW:[.66,.86],edgeA:.7,base:'#c8c040',fl:{c:'#c8b434',n:[2,4],from:.1,to:.34,w:.026,op:.35},
    shade:'#8a5e10',lite:'#fff4b8',bshade:'#8a6418',blite:'#fff6c8',vein:'#c8961e',bvein:'#c8a030',vo:.2},
  orange:{st:[[0,'#b0aa40'],[.12,'#f0b030'],[.28,'#f09a30'],[.45,'#ee7a2a'],[.85,'#ea6e28'],[1,'#ee8432']],
    bst:[[0,'#aaa646'],[.14,'#eeb440'],[.35,'#f09440'],[.85,'#ee7e36'],[1,'#f09040']],
    edge:'#f6c040',edgeW:[.62,.82],edgeA:.85,base:'#f0b030',fl:{c:'#f6b838',n:[3,5],from:.12,to:.46,w:.03,op:.55},
    shade:'#7a2406',lite:'#ffc898',bshade:'#843010',blite:'#ffd2a8',vein:'#c04a12',bvein:'#c85a20',vo:.22},
  rouge:{st:[[0,'#aaa440'],[.1,'#e8a030'],[.24,'#dc5a2c'],[.4,'#c82a2a'],[.85,'#c21b2a'],[1,'#cc3030']],
    bst:[[0,'#a4a046'],[.12,'#e2a03e'],[.3,'#d4503a'],[.5,'#cc2e3a'],[1,'#d24038']],
    edge:'#e85a3a',edgeW:[.7,.88],edgeA:.6,base:'#e8a030',fl:{c:'#e8a030',n:[2,4],from:.1,to:.32,w:.028,op:.5},
    shade:'#52040e',lite:'#ff8a78',bshade:'#62101a',blite:'#ffa898',vein:'#900a18',bvein:'#a01a26',vo:.24},
  bordeaux:{st:[[0,'#a09a40'],[.1,'#d89030'],[.24,'#a8402c'],[.4,'#80202c'],[.85,'#7a1a2a'],[1,'#8a2a2e']],
    bst:[[0,'#9c9846'],[.12,'#d2903c'],[.3,'#a04034'],[.5,'#86283a'],[1,'#94363a']],
    edge:'#c8603a',edgeW:[.66,.86],edgeA:.75,base:'#d89030',fl:{c:'#d89030',n:[2,4],from:.1,to:.34,w:.026,op:.45},
    shade:'#2a040c',lite:'#d07a80',bshade:'#3a0a14',blite:'#d8948c',vein:'#4e0a16',bvein:'#5e1420',vo:.2}};
const GLR_M={};
function glrMat(cw){const key='gloriosa:'+cw.id;if(GLR_M[key])return GLR_M[key];const C=GLR_CW[cw.id]||GLR_CW.rothschildiana,body=C.st[Math.floor(C.st.length*.7)][1];
  const M={st:C.st,bst:C.bst,shade:C.shade,lite:C.lite,bshade:C.bshade,blite:C.blite,vein:C.vein,bvein:C.bvein,vo:C.vo,base:C.base,
    rim:mix(body,'#2a0a0a',.35),cast:mix(C.shade,'#000000',.45),
    /* the margin (zone marge, the whole outline, bord fondu): a band across the tepal, over the point from v .86 (pointe: same colour) */
    cross:[{st:[[0,body,0],[C.edgeW[0],C.edge,0],[C.edgeW[1],C.edge,C.edgeA*.85],[1,C.edge,C.edgeA]],tip:.86,bk:.8,soft:.02}],
    flames:C.fl,
    /* the thin tissue lit through at the margins (matiere/translucidite .3) */
    transmit:{a:.22,w:.005,eo:[.42,.14],ev:[.1,.3],lk:[.3,.42]},
    fil:'#c4c464',anth:'#d4962c',pol:'#f2c85a',sty:'#b6be6a',sg:'#d6c45a',ov:'#a4b052'};
  return GLR_M[key]=M}
const GLR_GENES={n:[[6,1]],tep:{dL:[.93,1.06],dW:[.88,1.1],dph:[-.04,.04],da:[-.1,.1],dt:[-.18,.18],tw:[-.35,.35],lat:[-.05,.05],wav:[.03,.055],wk:[5,7.5],wph:[0,6.28],
    ew:[.06,.12],tip:[1.05,1.35],asym:[-.07,.07],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],op:[-.03,.03],dh:[-4,4],ds:[-.05,.05],dl:[-.03,.02],sty:[0,6.2832],stL:[.92,1.08],sd:'sd'}};
/* the heart (fiche: stamens 4.5 cm for a 6.5 cm tepal; style 5.5 cm, bent square near its foot) */
/* stamens opposite the tepals (Colchicaceae): sOff 0 puts each one in front of its tepal, not across the gaps */
/* anthers short and filaments lifted a little toward their tepal, little lateral swing: the anther does not land on a neighbour's outline */
const GLR_HEART={filL:.82,anL:.15,a0:1.5,a1:2.15,cb:0,st:[.5,.4],dnD:.2,styL:.9,sOff:0};
function glrLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'gloriosa',rec:{}})):0}
/* tepals nearly flat across (a shallow gutter: their margins crisped, not rolled) and little twisted in the decline: no daylight between them */
/* the middle a little fuller (L/l 3.3) and the decline less twisted and narrowed (twD, fanW): the gaps a filament crosses stay shut */
/* the free settings of refcache/gloriosa/space.json are spelt out here (fit.py edits GLR_SPEC in place): the kit's values */
const GLR_SPEC={L:[1.24,1.2],W:[.178,.182],grow:[.5,.42],sp:[.46,.44],aS:[[.78,1.85,1.66],[.74,1.8,1.62]],aB:[[.2,2.92,2.62],[.18,2.9,2.68]],
  aT:[[-.62,2.8,1.95],[-.6,2.84,2.05]],s1:[.42,.32],f0:[.7,.72],fanIn:.85,fanL:.32,
  cup:[.3,.26],twD:0,wavD:.5,decB:.18,limp:[.5,.03],fanW:.3,floorO:1,floorD:1.4,floorK:.6,wp:[[0,.68],[.08,.94],[.24,1.1],[.42,1.1],[.58,1.01],[.76,.72],[.9,.36],[1,.08]],genes:s=>svGenes(s,GLR_GENES),mat:glrMat,heart:svReflexHeart(GLR_HEART),life:()=>glrLife()};
/* the colour of a fading gloriosa (69, 79, 98): reds go to wine then a red-brown, yellows and oranges to ochre then brown, the green foot
   yellows (lifeCol); the lightest (the margins, the points) pale toward cream before browning */
function glrWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.1)return c;
  if(h>=62&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(h<20||h>=320){let o=mix(c,'#6a1626',.55*Math.min(1,w*1.4));if(w>.45)o=mix(o,'#5a3022',(w-.45)*1.1);return o}
  let o=mix(c,l>.62?'#e2cf98':'#c08a3a',.5*Math.min(1,w*1.4));if(w>.5)o=mix(o,'#7a4e2c',(w-.5)*1.2);return o}
if(typeof GHI!=='undefined'&&GHI['gloriosa'])GHI['gloriosa'].wilt=glrWiltCol;
/* the head: in the frame B at O (Z from the pedicel to the mouth: the flower nods, the tepals sweep back), D twice the radius (a tepal 0.62 D) */
function glrSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_GLOR!=='undefined'&&CW_GLOR.find(x=>x.id===cwId))||{id:cwId};
  return svReflex(par,B,O,D,S||GLR_SPEC,cwx,op,seed,wl==null?glrLife():wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['gloriosa']=glrSvg;
/* the gloriosa of the bouquet (lilyHead, s2a.js; gloriosaPlant, r1a.js): the old drawing's share of the bouquet's chance is consumed (per tepal 4
   draws, per stamen 2 once op > .45), the first three name the individual; the old drawing stays as the fallback (SV_ON false) */
function glrSvgPut(par,B,O,D,cw,op){let s=0;const nR=24+(op>.45?12:0);for(let i=0;i<nR;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return glrSvg(par,B,O,D,cw.id,op,svSeed('gloriosa',cw.id,s),glrLife())}
if(typeof lilyFlower==='function'){const glrOld=lilyFlower;lilyFlower=function(par,B,O,D,cw,op,kd){
  if(kd!=='gloriosa'||typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id||!GLR_CW[cw.id])return glrOld.apply(this,arguments);return glrSvgPut(par,B,O,D,cw,op)}}
