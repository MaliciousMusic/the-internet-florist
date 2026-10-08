
/* ================= Belai's Flowers — state & catalogue v3 (one pick = one variety, the composer decides the stems) ================= */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const eur=c=>(c/100).toFixed(2).replace('.',',')+' €';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RAR={c:['Commune','r-c'],r:['Rare','r-r'],p:['Précieuse','r-p'],l:['Légendaire','r-l']};
/* species registry: form & size drive the composer; k = art kind (head centred | cup base at 0,0 | plant grows up); r = visual radius; an = head centre offset */
const SP={xAnth:{form:'coeur',size:3,k:'head',r:48},xCalla:{form:'cornet',size:2,k:'cup',r:34,an:[0,-96]},xPhalCluster:{form:'orchidee',size:3,k:'head',r:52},xCymbCluster:{form:'orchidee',size:3,k:'head',r:50},
 xRose:{form:'rosette',size:2.6,k:'head',r:42},xRanunc:{form:'rosette',size:2,k:'head',r:34},xDahlia:{form:'disque',size:3,k:'head',r:48},xCarn:{form:'frange',size:1.5,k:'head',r:31},
 xMum:{form:'araignee',size:2.5,k:'head',r:46},xNerine:{form:'ombelle',size:1.6,k:'head',r:44},xGlor:{form:'etoile',size:1.6,k:'head',r:40},xPea:{form:'grappe',size:1.2,k:'head',r:40},
 xScab:{form:'disque',size:1.1,k:'head',r:27},xLily:{form:'etoile',size:3,k:'head',r:52},xDelph:{form:'epi',size:1,k:'plant',self:230},xAllium:{form:'ligne',size:1,k:'plant',self:300},
 xPhalSpray:{form:'retombante',size:2,k:'spray'},amaranthPlant:{form:'retombante',size:2,k:'plant'},allium:{form:'ligne',size:1,k:'plant',self:0},grassLoop:{form:'ligne',size:1,k:'plant',self:0},
 willow:{form:'ligne',size:1,k:'plant',self:0},bareLine:{form:'ligne',size:1,k:'plant',self:0},
 peony:{form:'rosette',size:3,k:'head',r:46},tulip:{form:'cornet',size:2,k:'cup',r:30,an:[0,-55]},anemone:{form:'disque',size:2,k:'head',r:40},cosmos:{form:'disque',size:1,k:'head',r:38},
 hydrangea:{form:'sphere',size:3,k:'head',r:48},sunflower:{form:'disque',size:3,k:'head',r:48},strelitzia:{form:'sculpt',size:2,k:'head',r:50},cattleya:{form:'orchidee',size:3,k:'head',r:46},
 paphio:{form:'orchidee',size:2,k:'head',r:40},oncidium:{form:'grappe',size:1,k:'plant',self:170},spike:{form:'epi',size:1,k:'plant',self:150},marigold:{form:'disque',size:2,k:'head',r:40},pansy:{form:'disque',size:1,k:'head',r:34}};
const AN3={bordeaux:{c:['#2a020a','#5c0a1c','#8e1430','#c23a54','#f2a6b4'],sp:['#f3e6c2','#c9a96a']},saumon:{c:['#5a2010','#a8512f','#d9825d','#f3b394','#ffe0cc'],sp:['#fff1d6','#e7b06b']},
 vert:{c:['#1f3a10','#4c7a24','#7faa3c','#b4d276','#e6f5c4'],sp:['#f2f0c8','#c8d07a']},noir:{c:['#08020a','#1d0814','#341024','#57203c','#a8708a'],sp:['#4a2430','#7a4050']},
 rose:{c:['#6a3440','#b8707e','#dda0aa','#f3cdd2','#fff0f2'],sp:['#f5eadf','#d9a3a8']},rouge:{c:['#3a0208','#7a0614','#c0101e','#ee4050','#ffb0b8'],sp:['#fff4d6','#e8c070']}};
const PHM={c:tones('#c2387f'),lip:['#4a0626','#8a1048','#ffd23f'],cap:'#ffd0e4'};
const V=(id,n,fam,rar,p,f,o,col)=>({id,n,fam,rar,p,f,o:o||{},col});
const CAT=[
 V('lys-casablanca','Lys Casa Blanca','blanc','p',140,'xLily',{c:tones('#f7f5ef'),an:'#a0401a'},'#f7f5ef'),V('calla-ivoire','Calla ivoire','blanc','r',70,'xCalla',{},'#eef0dc'),
 V('phalaenopsis-blanc','Orchidée papillon blanche','blanc','p',150,'xPhalCluster',{},'#fbf4f8'),V('rose-ivoire','Rose de jardin ivoire','blanc','r',70,'xRose',{c:tones('#f4ecd8'),deep:'#c9b47a',button:'#9aa860'},'#f4ecd8'),
 V('renoncule-blanche','Renoncule blanche','blanc','c',40,'xRanunc',{c:tones('#f6f2ea'),deep:'#b8b090',eye:'#5a7a2a'},'#f6f2ea'),V('delphinium-blanc','Delphinium blanc','blanc','r',60,'xDelph',{c:tones('#f4f2ec'),bee:'#3a3020'},'#f4f2ec'),
 V('anemone-blanche','Anémone blanche','blanc','c',35,'anemone',{},'#f2f2fa'),
 V('anthurium-saumon','Anthurium pêche cuivré','peche','p',140,'xAnth',AN3.saumon,'#d9825d'),V('rose-peche','Rose de jardin pêche','peche','r',70,'xRose',{c:tones('#f4d2bd'),deep:'#d98a66'},'#f4d2bd'),
 V('renoncule-saumon','Renoncule saumon','peche','c',40,'xRanunc',{c:tones('#f49a78'),deep:'#b0402a'},'#f49a78'),V('dahlia-peche','Dahlia pêche','peche','r',80,'xDahlia',{c:tones('#f59a62'),deep:'#a0401a'},'#f59a62'),
 V('calla-peche','Calla pêche','peche','r',70,'xCalla',{c:['#5a2a10','#c0602a','#ee9050','#ffc090','#ffe4cc'],ic:['#d07040','#ffd0a8'],nk:'#7a8a3a',sp:'#f0a020'},'#ee9050'),
 V('oeillet-corail','Œillet corail','peche','c',30,'xCarn',{c:tones('#f07862')},'#f07862'),V('cymbidium-cuivre','Cymbidium cuivre','peche','p',150,'xCymbCluster',{},'#c8714c'),
 V('chrysantheme-peche','Chrysanthème araignée pêche','peche','r',60,'xMum',{c:tones('#f2b08a')},'#f2b08a'),V('nerine-corail','Nérine corail','peche','r',70,'xNerine',{c:tones('#f2604a')},'#f2604a'),
 V('rose-blush','Rose de jardin blush','rose','r',70,'xRose',{c:tones('#eebcc4'),deep:'#b8606e'},'#eebcc4'),V('dahlia-cafe','Dahlia café au lait','rose','p',120,'xDahlia',{c:tones('#ecc9b8'),deep:'#b0806e'},'#ecc9b8'),
 V('renoncule-rose','Renoncule rose poudré','rose','c',40,'xRanunc',{c:tones('#f2c4c6'),deep:'#c07a80',eye:'#6a8a2a'},'#f2c4c6'),V('oeillet-poudre','Œillet rose poudré','rose','c',30,'xCarn',{},'#eba3b2'),
 V('anthurium-rose','Anthurium rose poudré','rose','p',140,'xAnth',AN3.rose,'#dda0aa'),V('pois-rose','Pois de senteur rose','rose','c',40,'xPea',{c:tones('#eeb0c8')},'#eeb0c8'),
 V('oeillet-picotee','Œillet picotee','rose','r',50,'xCarn',{c:tones('#fbf3f4'),tc:'#d0206a'},'#f4c6d6'),V('pivoine-sarah','Pivoine Sarah Bernhardt','rose','r',80,'peony',{},'#f7a8c4'),
 V('phalaenopsis-magenta','Orchidée papillon magenta','fuchsia','p',150,'xPhalCluster',PHM,'#c2387f'),V('nerine-rose','Nérine rose','fuchsia','r',70,'xNerine',{},'#e8507a'),
 V('lys-stargazer','Lys Stargazer','fuchsia','p',130,'xLily',{tc:'#fff0f4',sp:{n:40,c:'#8a0a34',p:1.2,s:1},pap:'#b01048'},'#d8306a'),
 V('phalaenopsis-prune','Orchidée papillon prune réticulée','fuchsia','l',240,'xPhalCluster',{c:['#3a0820','#a8406a','#e9a0bc','#f8d6e4','#fff0f6'],ret:1,vc:'#7a0a36',lip:['#3a0418','#7a0a36','#f2c84a']},'#a8406a'),
 V('cattleya-fuchsia','Cattleya fuchsia','fuchsia','l',240,'cattleya',{c:['#a8166a','#ff5cae','#ffd6ec','#720d47'],lip:['#5a0636','#c2185b','#ffd23f']},'#ff5cae'),
 V('anthurium-rouge','Anthurium rouge','rouge','p',140,'xAnth',AN3.rouge,'#c0101e'),V('gloriosa','Gloriosa flamme','rouge','p',130,'xGlor',{},'#e0203e'),
 V('renoncule-rouge','Renoncule rouge','rouge','c',40,'xRanunc',{c:tones('#d8202a'),deep:'#5a0008'},'#d8202a'),V('tulipe-rouge','Tulipe rouge','rouge','c',30,'tulip',{},'#e2232f'),
 V('anemone-rubis','Anémone rubis','rouge','c',35,'anemone',{c:['#5e000b','#d1162e','#ff5a68','#3e0007']},'#d1162e'),V('pivoine-rubis','Pivoine rubis','rouge','r',80,'peony',{c:['#62000f','#c8102e','#ff6070','#40000a']},'#c8102e'),
 V('anthurium-bordeaux','Anthurium bordeaux','bordeaux','p',140,'xAnth',AN3.bordeaux,'#8e1430'),V('rose-bordeaux','Rose de jardin bordeaux','bordeaux','r',70,'xRose',{c:tones('#8a1430'),deep:'#2a0410'},'#8a1430'),
 V('dahlia-bordeaux','Dahlia bordeaux','bordeaux','r',80,'xDahlia',{},'#8e1a3a'),V('oeillet-bordeaux','Œillet bordeaux','bordeaux','c',30,'xCarn',{c:tones('#7a1028')},'#7a1028'),
 V('cymbidium-bordeaux','Cymbidium bordeaux','bordeaux','p',150,'xCymbCluster',{c:tones('#7a1734'),lip:['#5a0816','#fbe8dc','#b02040']},'#7a1734'),
 V('cosmos-chocolat','Cosmos chocolat','bordeaux','r',50,'cosmos',{c:['#2a0006','#7a0a1e','#b4303f','#170003'],d:['#d07a40','#7a2a10','#3a0e04']},'#7a0a1e'),
 V('calla-noir','Calla noire','noir','p',120,'xCalla',{c:['#0a0206','#22061a','#3d0f2e','#5e2048','#9a6080'],ic:['#1a0410','#4a1636'],nk:'#2a3018',sp:'#d8b44a'},'#3d0f2e'),
 V('anthurium-noir','Anthurium Black Queen','noir','l',240,'xAnth',AN3.noir,'#341024'),V('scabieuse-noire','Scabieuse Black Knight','noir','r',50,'xScab',{},'#4e1028'),
 V('dahlia-noir','Dahlia Karma Choc','noir','p',130,'xDahlia',{c:tones('#4a0c22'),deep:'#0e0206'},'#4a0c22'),
 V('allium-violet','Allium Globemaster','violet','r',70,'xAllium',{},'#7a3cc0'),V('chrysantheme-mauve','Chrysanthème araignée mauve','violet','r',60,'xMum',{},'#c98ab8'),
 V('pois-lavande','Pois de senteur lavande','violet','c',40,'xPea',{},'#b79ae0'),V('scabieuse-lavande','Scabieuse lavande','violet','c',40,'xScab',{c:tones('#b0a6dc'),ce:['#5a6a4a','#8a9a70','#c8d2b0'],pin:'#ffffff'},'#b0a6dc'),
 V('cattleya-lavande','Cattleya lavande','violet','p',150,'cattleya',{c:['#8a66d4','#c9b3ff','#f3edff','#553ba8'],lip:['#4a1478','#9b4fd6','#ffe14d']},'#c9b3ff'),
 V('delphinium-bleu','Delphinium bleu poudré','bleu','r',60,'xDelph',{},'#8ea8e4'),V('hortensia-bleu','Hortensia bleu','bleu','r',70,'hydrangea',{},'#8fa6f5'),
 V('anemone-bleue','Anémone bleue','bleu','c',35,'anemone',{c:['#18166a','#3f4fd6','#909dff','#0c0c3a']},'#3f4fd6'),V('myosotis','Myosotis','bleu','c',30,'spike',{c:['#2f5fd0','#6f97ff','#dbe7ff','#1c3a8a'],n:18},'#6f97ff'),
 V('anthurium-vert','Anthurium Midori','vert','p',140,'xAnth',AN3.vert,'#7faa3c'),V('cymbidium-vert','Cymbidium chartreuse','vert','p',150,'xCymbCluster',{c:tones('#b8c35a'),lip:['#9a1020','#fff6e0','#d04050']},'#b8c35a'),
 V('calla-verte','Calla verte','vert','r',70,'xCalla',{c:['#2a3a10','#6a8a2a','#a8c060','#d4e6a0','#eef6d0'],ic:['#90a850','#e0eeb8'],nk:'#4a6a20',sp:'#e8d050'},'#a8c060'),
 V('hortensia-antique','Hortensia vert antique','vert','r',70,'hydrangea',{c:[['#6a8a4a','#a9c08a','#e4ecd4','#4a6a30'],['#8a7a9a','#b8a8c8','#ece4f0','#5a4a6a']]},'#a9c08a'),
 V('lys-dore','Lys doré','jaune','r',60,'xLily',{c:tones('#f2c832'),an:'#a0401a',sp:{n:14,c:'#b35a00',p:1.6,s:.9}},'#f2c832'),V('renoncule-jaune','Renoncule beurre','jaune','c',40,'xRanunc',{c:tones('#f6d24a'),deep:'#a07a10'},'#f6d24a'),
 V('tournesol','Tournesol','jaune','c',40,'sunflower',{},'#ffc21a'),V('oncidium','Orchidée danseuse','jaune','p',120,'oncidium',{},'#ffd21f'),V('tulipe-citron','Tulipe citron','jaune','c',30,'tulip',{c:['#c29000','#ffd21f','#fff3a0','#7d5c00']},'#ffd21f'),
 V('lys-tigre','Lys tigré','orange','r',60,'xLily',{c:tones('#f07a1a'),sp:{n:40,c:'#3a0d00',p:1.2,s:1.2},an:'#5a1a00'},'#f07a1a'),V('renoncule-orange','Renoncule orange','orange','c',40,'xRanunc',{},'#f07a3a'),
 V('tagete','Tagète orange','orange','c',30,'marigold',{},'#ff7a00'),V('strelitzia','Oiseau de paradis','orange','p',150,'strelitzia',{},'#ff9a1f'),V('sabot-venus','Sabot de Vénus','orange','l',240,'paphio',{},'#b0485a'),
 V('amarante-bordeaux','Amarante bordeaux','lignes','r',60,'amaranthPlant',{},'#8e1235'),V('amarante-verte','Amarante émeraude','lignes','r',60,'amaranthPlant',{c:['#3f5a1e','#6f8f2f','#a9c45a','#2c3f14']},'#6f8f2f'),
 V('amarante-corail','Amarante vieux rose','lignes','p',90,'amaranthPlant',{c:['#a8504e','#d88a84','#f2bcb4','#6e2a28']},'#d88a84'),
 V('phalaenopsis-cascade','Cascade d\'orchidées','lignes','l',240,'xPhalSpray',{hang:1,n:6},'#fbf4f8'),V('allium-boucle','Allium bouclé','lignes','r',50,'allium',{},'#8f5ad6'),
 V('herbe-ours','Boucles d\'herbe d\'ours','lignes','c',20,'grassLoop',{},'#7fae4a'),V('saule-tortueux','Saule tortueux','lignes','c',30,'willow',{},'#6b4a2e'),V('tige-calla','Tige de calla nue','lignes','c',30,'bareLine',{bud:'#e8e4c8'},'#557a36')];
const BYID=Object.fromEntries(CAT.map(p=>[p.id,p]));
const FN={cosmos,anemone,peony,tulip,calla,lilyStar,morningGlory,marigold,pansy,hydrangea,spike,cattleya,paphio,oncidium,sunflower,strelitzia,
  xAnth,xCalla,xPhal,xPhalCluster,xPhalSpray,xCymb,xCymbCluster,xRose,xRanunc,xDahlia,xCarn,xMum,xNerine,xGlor,xPea,xScab,xDelph,xLily,xAllium,amaranth,amaranthPlant,allium,grassLoop,willow,bareLine};
const BASE=800,MIN=200,CAP=Infinity;
const VASES=Object.entries(VZ).map(([id,v])=>({id,n:v.n,m:v.m,p:v.p,fam:v.fam||'vase',why:v.why||''})).sort((a,b)=>VFAMS.findIndex(x=>x[0]===a.fam)-VFAMS.findIndex(x=>x[0]===b.fam)||a.p-b.p);
const MUS=[{id:'none',n:'Silence',p:0},{id:'box',n:'Boîte à musique',p:190},{id:'lofi',n:'Lo-fi doux',p:190},{id:'romance',n:'Romance',p:190}];
const S={cart:new Map(),vase:'coupe-blanche',occ:'juste',music:'none',seed:7,view:'shop',to:'',from:'',msg:''};
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SEEN=new Set(store.get('bf3-seen',[]).filter(id=>BYID[id]));
function seen(id){if(!SEEN.has(id)){SEEN.add(id);store.set('bf3-seen',[...SEEN])}}
function count(){return S.cart.size}
function expand(){return[...S.cart.keys()]}
function flowersCost(){let c=0;for(const id of S.cart.keys())c+=BYID[id].p;return c}
/* no limit on varieties: the bill simply never goes above 20 € */
function rawTotal(){if(!count())return 0;return flowersCost()+BASE+VASES.find(v=>v.id===S.vase).p+MUS.find(m=>m.id===S.music).p}
function total(){return Math.min(CAP,rawTotal())}
function canAdd(p){return true}
/* draw once with every animation already finished */
function renderStatic(fn){const a=tw.length,b=idle.length;fn();for(const w of tw.splice(a))w.fn(1,1);idle.length=b}
/* garden art: two variants of every variety, kept in <defs> and reused */
function artOf(p,g,o2={}){const sp=SP[p.f]||{},o=Object.assign({},p.o,o2);if(p.f==='xPhalSpray')o.hang=0;
  const h=sp.an?G(g,{transform:`translate(${-sp.an[0]},${-sp.an[1]})`}):g;FN[p.f](h,0,o)}
/* garden art kept in <defs>: 3D species in three orientations plus a bud, 2D drawings once */
function buildArt(){LOD=1;for(const p of CAT){const d3=D3.has(p.f),mk=(id,o2)=>{const g=E('g',{id},defs);renderStatic(()=>artOf(p,g,o2))};
    mk(`h-${p.id}-0`,d3?{ax:[0,.25,1],roll:0}:{});if(d3){mk(`h-${p.id}-l`,{ax:[-.72,.35,.62],roll:0});mk(`h-${p.id}-r`,{ax:[.72,.35,.62],roll:0});if(BUD3.has(p.f))mk(`h-${p.id}-b`,{ax:[0,.5,.85],op:.14,roll:0})}}LOD=0}
