/* ================= y3-fx.js : les essais de matière du pilote (pilote/sv.html?svfx=cross,trans) =================
   A demo block per sort, merged over its material only when the pilot asks for it, so that a published sort can be shown before / after a new
   primitive of svDraw (y1.js: m.cross) without touching its sheet. Inert everywhere else: the shop's build carries this file (mkapp.sh takes every
   y3-*.js) but nothing here runs at load; pilote/svtest.js calls svfxApply() once, before any drawing, and it acts only when the page's address
   has svfx=<list> (cross: the zones across the pieces). A proposal to the owner, not a publication: the colours are tuned by eye against the kept
   photographs of the colourways (refcache, never copied) and the measured colourways (catalogue/serre/sources/<sid>.json). */
const SVFX_KEYS={cross:['cross']};
const SVFX_DEMO={
  /* the anemone (svBloom: the colourway's material itself). bleu: the midline a little deeper and more violet, the margins and the tip paler and
     more luminous (Mister Fokker: veined, lighter edges); blanc: a creamier middle, the margins pure white (The Bride: never a grey flat) */
  'anemone-coronaria':{spec:()=>typeof SVA_P!=='undefined'?SVA_P:null,cw:{
    bleu:{cross:[{st:[[0,'#3a2a9c',.3],[.28,'#3a2a9c',0],[.6,'#8c78ea',0],[1,'#8c78ea',.42]],tip:.8,v:[.1,.3]}]},
    blanc:{cross:[{st:[[0,'#ece4cc',.32],[.42,'#ece4cc',0],[.72,'#ffffff',0],[1,'#ffffff',.6]],tip:.82,v:[.12,.34,.86,1]}]}}},
  /* the cymbidium (svorFlower: the material by kind, sepals and petals). blanc: a cream-green middle fading out from the claw, the margins pure
     white (kept 15, 58, 119); rouge: a deeper midline (the keel, c16, 49), paler rosy margins and tip */
  'cymbidium-grandes-fleurs':{spec:()=>typeof CYMB_S!=='undefined'?CYMB_S:null,kinds:['sep','pet'],cw:{
    blanc:{sep:{cross:[{st:[[0,'#e8e6c4',.34],[.32,'#e8e6c4',0],[.7,'#ffffff',0],[1,'#ffffff',.55]],tip:.8,v:[.04,.22]}]},
      pet:{cross:[{st:[[0,'#e8e6c4',.34],[.32,'#e8e6c4',0],[.7,'#ffffff',0],[1,'#ffffff',.55]],tip:.8,v:[.04,.22]}]}},
    rouge:{sep:{cross:[{st:[[0,'#a42a44',.46],[.22,'#a42a44',0],[.6,'#f0a0a6',0],[1,'#f0a0a6',.44]],tip:.85,v:[.08,.26]}]},
      pet:{cross:[{st:[[0,'#a42a44',.46],[.22,'#a42a44',0],[.6,'#f0a0a6',0],[1,'#f0a0a6',.44]],tip:.85,v:[.08,.26]}]}}}}};
/* merges the demo blocks of the keys asked for (list, else the address's svfx=) over the sorts' materials; returns the sorts it changed */
function svfxApply(list){if(list==null){if(typeof location==='undefined')return[];const q=location.search.match(/[?&]svfx=([^&]*)/);if(!q)return[];list=decodeURIComponent(q[1]).split(',')}
  const keys=[].concat(...list.map(x=>SVFX_KEYS[x]||[]));if(!keys.length)return[];const done=[];
  for(const sid in SVFX_DEMO){const X=SVFX_DEMO[sid],S=X.spec();if(!S||S._svfx)continue;const o=S.mat,C={},pick=b=>{const r={};for(const k of keys)if(b&&b[k]!=null)r[k]=b[k];return r},
      mat=cwx=>{const id=cwx&&cwx.id,b=X.cw[id];if(!b)return o(cwx);if(C[id])return C[id];const m0=o(cwx);
        return C[id]=X.kinds?Object.assign({},m0,...X.kinds.filter(k=>b[k]&&m0[k]).map(k=>({[k]:Object.assign({},m0[k],pick(b[k]))}))):Object.assign({},m0,pick(b))};
    /* the kits keep a merged copy of the sheet (svBloom S._m, svorSpec S._om) once a head is drawn: theirs too */
    S.mat=mat;if(S._m)S._m.mat=mat;if(S._om)S._om.mat=mat;S._svfx=keys;done.push(sid)}
  return done}
