/* ================= inventaire/inv.js : the flower inventory =================
   Runs after the published app's scripts (inventaire/index.html writes demo/index.html + this file into one page), clears the shop's interface and
   lists every product (PRODUCTS: one per colourway, the SKU being its rank) grouped by category, species and colourway, each drawn live by the app's
   own drawers at every state: bud, half open, open (face, 3/4, profile), decline, faded, and the shop's bunch.
   Versions: a species redone at the anemone's level registers a head in SV_HEAD; the lots below name where each was redone, the others are still on
   the greenhouse drawing (serre v49). A species redone later shows up as "Refait (autre)" until its lot is added to VERSIONS.
   Cells are drawn one at a time, only when in view, then kept as small images (LRU) so that thousands of rows never sit in memory as live SVG.
   The owner's choice (species and colourways) is kept in this browser and copied as text for the next flower chantier. */
(()=>{
const VERSIONS=[
  {id:'v3l3',l:'Vague 3 · lot 3',d:'17 oct. 2026 · ecba018',s:['anthurium-andraeanum','arum-calla']},
  {id:'v3l2',l:'Vague 3 · lot 2',d:'17 oct. 2026 · df68e68, 84b0cb9',s:['dahlia-decoratif','chrysantheme-disbud','rose-aspect-jardin','rose-de-jardin']},
  {id:'v3l1',l:'Vague 3 · lot 1',d:'17 oct. 2026 · d23e361',s:['rose-standard','rose-intermediaire-kenya','gerbera','germini']},
  {id:'pilote',l:'Pilote de printemps',d:'octobre 2026 · bouquet bronze',s:['anemone-coronaria','anemone-sauvage','tulipe-simple','tulipe-double','tulipe-frangee','tulipe-perroquet',
    'narcisse-trompette','narcisse-bouquet','renoncule-classique','jacinthe','muscari','lilas','glycine','freesia','iris-hollandais','cerisier-du-japon-sato-zakura',
    'cognassier-du-japon','forsythia','pois-de-senteur','fritillaire-meleagris','viburnum-roseum','alchemille']},
  {id:'refait',l:'Refait (autre)',d:'tête SVG enregistrée, lot non nommé',s:[]},
  {id:'serre',l:'Serre v49 (ancien dessin)',d:'pas encore refait au niveau de l’anémone',s:[]}];
/* the flower chantier's handoff (catalogue/serre/methode/PASSATION-VAGUE3.md): §7 in progress, §8 the next ones in order */
const CHANTIER=['phalaenopsis','cymbidium-grandes-fleurs','hortensia-boule','amarante-retombante','amarante-dressee'];
const SUITE=['gloriosa','oeillet-standard','giroflee-matthiole','nerine','lis-oriental','lis-asiatique-la','lis-oriental-double','lis-tigre','delphinium','scabieuse','cosmos',
  'chrysantheme-araignee','oncidium','anthurium-obake','lisianthus','pensee','pivoine-herbacee-double','clematite','celosie-crete-de-coq','eucalyptus-stabilise','ail-serpent',
  'allium-petit','asparagus-setaceus-plumosus','saule-tortueux','leucadendron-rouges'];
const STATES=[
  {k:'bud',l:'Bouton',op:.14},{k:'half',l:'Mi-ouvert',op:.5},{k:'face',l:'Ouvert, face',op:1,ax:[0,0,1]},{k:'tq',l:'Ouvert, 3/4',op:1},
  {k:'pro',l:'Profil',op:1,ax:[0,.97,.24]},{k:'dec',l:'Déclin',op:1,st:2},{k:'fan',l:'Fané',op:1,st:3},{k:'botte',l:'Botte',card:1}];
const FAMS={blanc:['Blanc','#f4f1ea'],peche:['Pêche','#f3c4a2'],rose:['Rose','#f0a6c0'],fuchsia:['Fuchsia','#d63f8c'],rouge:['Rouge','#c8202f'],orange:['Orange','#ee8a2a'],
  jaune:['Jaune','#f2d23c'],bordeaux:['Bordeaux','#6e1a2c'],violet:['Violet','#7d55b8'],vert:['Vert','#8fb35a'],bleu:['Bleu','#4a78c8'],noir:['Noir','#2a2226']};
const CW=1,TW=256,TH=320; /* raster of a cell: 4:5 like fitBox, twice the shown size */
const $=(t,a={},...k)=>{const e=document.createElement(t);for(const[n,v]of Object.entries(a)){if(n==='on')for(const[ev,fn]of Object.entries(v))e.addEventListener(ev,fn);else if(n==='style')e.style.cssText=v;else if(n in e&&n!=='list')e[n]=v;else e.setAttribute(n,v)}for(const c of k.flat())if(c!=null)e.append(c.nodeType?c:document.createTextNode(c));return e};
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(_){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
const fr=n=>n.toLocaleString('fr-FR');

function start(){
  /* ---------- data: species, versions, colourways ---------- */
  const SVH=typeof SV_HEAD!=='undefined'?SV_HEAD:{},VBY={};for(const v of VERSIONS)for(const s of v.s)VBY[s]=v.id;
  const verOf=sid=>VBY[sid]&&SVH[sid]?VBY[sid]:SVH[sid]?'refait':'serre';
  const SKU={};PRODUCTS.forEach((p,i)=>SKU[p.id]=i+1);
  const SP=[],SPBY={};
  for(const p of PRODUCTS){let s=SPBY[p.sid];if(!s){const m=MBY[p.sid]||{};s=SPBY[p.sid]={sid:p.sid,n:m.n||p.n||p.sid,l:m.l||'',c:m.c||p.cat||'Autres',r:m.r||p.role||'',ps:[],v:verOf(p.sid),
      ch:CHANTIER.includes(p.sid),su:SUITE.indexOf(p.sid)};SP.push(s)}
    const ci=+p.id.split('~')[1],w=(CWS[p.sid]||[])[ci]||{};s.ps.push({p,ci,sku:SKU[p.id],late:+w.late||0,ret:!!p.ret})}
  const order={};CATMETA.forEach((m,i)=>order[m.id]=i);SP.sort((a,b)=>(order[a.sid]??1e9)-(order[b.sid]??1e9));
  const CATS=[...new Set(SP.map(s=>s.c))];

  /* ---------- the page: drop the shop, keep the engine's shared defs ---------- */
  const keepDefs=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;
  for(const n of [...document.head.querySelectorAll('style,link[rel=stylesheet]')])n.remove();
  document.body.innerHTML='';document.body.removeAttribute('class');document.body.removeAttribute('style');document.title='Inventaire des fleurs';
  const park=$('div',{style:'position:fixed;left:-20000px;top:0;width:'+TW+'px;height:'+TH+'px;overflow:hidden;visibility:hidden'});if(keepDefs)park.append(keepDefs);document.body.append(park);
  document.head.append($('style',{},STYLE));

  const sel=store.get('inv-sel-v1',{sp:[],cw:[]}),SELSP=new Set(sel.sp),SELCW=new Set(sel.cw);
  const ui=store.get('inv-ui-v1',{mode:'tous',st:'tq',vers:VERSIONS.map(v=>v.id),fams:[],cat:'',ret:false,late:false,ch:false,su:false,chosen:false,q:''});
  const saveSel=()=>{store.set('inv-sel-v1',{sp:[...SELSP],cw:[...SELCW]});selCount.textContent=SELSP.size||SELCW.size?`${SELSP.size} espèce${SELSP.size>1?'s':''} · ${SELCW.size} coloris choisis`:'Rien de choisi'};
  const saveUi=()=>store.set('inv-ui-v1',ui);

  /* header */
  const nNew=SP.filter(s=>s.v!=='serre').length;
  const q=$('input',{type:'search',placeholder:'Chercher : nom, latin, coloris, n° de SKU…',value:ui.q||'',on:{input:()=>{ui.q=q.value;saveUi();rebuildSoon()}}});
  const modeB=['apercu','tous'].map(m=>$('button',{className:'seg'+(ui.mode===m?' on':''),textContent:m==='apercu'?'Aperçu':'Tous les états',on:{click:()=>{ui.mode=m;saveUi();modeB.forEach(b=>b.classList.toggle('on',b===modeB[m==='apercu'?0:1]));stSel.disabled=m!=='apercu';rebuild()}}}));
  const stSel=$('select',{title:'État montré en aperçu',on:{change:()=>{ui.st=stSel.value;saveUi();rebuild()}}},STATES.map(S=>$('option',{value:S.k,textContent:S.l,selected:S.k===ui.st})));stSel.disabled=ui.mode!=='apercu';
  const selCount=$('span',{className:'selc'});
  const header=$('header',{},
    $('div',{className:'ttl'},$('h1',{},'Inventaire des fleurs'),$('p',{className:'stats'},`${fr(SP.length)} espèces · ${fr(PRODUCTS.length)} coloris (SKU 1 à ${fr(PRODUCTS.length)}) · ${nNew} espèces refaites, ${SP.length-nNew} sur l’ancien dessin`)),
    $('div',{className:'tools'},$('button',{className:'ghost filt',textContent:'Filtres et catégories',on:{click:()=>document.body.classList.toggle('showside')}}),q,$('div',{className:'segs'},modeB),stSel,
      $('div',{className:'selbox'},selCount,$('button',{className:'act',textContent:'Copier ma sélection',on:{click:exportSel}}),$('button',{className:'ghost',textContent:'Vider',on:{click:()=>{if(!confirm('Vider toute la sélection ?'))return;SELSP.clear();SELCW.clear();saveSel();rebuild()}}}))));

  /* sidebar: filters and the species index */
  const side=$('aside',{});
  const chk=(label,on,fn,extra)=>$('label',{className:'ck'},$('input',{type:'checkbox',checked:on,on:{change:e=>fn(e.target.checked)}}),$('span',{},label),extra||null);
  const cnt=n=>$('em',{},fr(n));
  function buildSide(){side.innerHTML='';
    side.append($('h2',{},'Version du dessin'));
    for(const v of VERSIONS){const n=SP.filter(s=>s.v===v.id).length;if(!n&&v.id==='refait')continue;
      side.append(chk(v.l,ui.vers.includes(v.id),c=>{ui.vers=c?[...ui.vers,v.id]:ui.vers.filter(x=>x!==v.id);saveUi();rebuild()},cnt(n)),$('p',{className:'vd'},v.d))}
    side.append($('div',{className:'mini'},$('button',{textContent:'Toutes',on:{click:()=>{ui.vers=VERSIONS.map(v=>v.id);saveUi();buildSide();rebuild()}}}),$('button',{textContent:'Refaites',on:{click:()=>{ui.vers=VERSIONS.filter(v=>v.id!=='serre').map(v=>v.id);saveUi();buildSide();rebuild()}}}),$('button',{textContent:'Ancien dessin',on:{click:()=>{ui.vers=['serre'];saveUi();buildSide();rebuild()}}})));
    side.append($('h2',{},'Chantier des fleurs'));
    side.append(chk('En chantier (passation §7)',ui.ch,c=>{ui.ch=c;saveUi();rebuild()},cnt(CHANTIER.length)));
    side.append(chk('Prévues ensuite (§8)',ui.su,c=>{ui.su=c;saveUi();rebuild()},cnt(SUITE.length)));
    side.append(chk('Seulement ma sélection',ui.chosen,c=>{ui.chosen=c;saveUi();rebuild()}));
    side.append($('h2',{},'Coloris'));
    side.append(chk('Montrer les coloris retirés',ui.ret,c=>{ui.ret=c;saveUi();rebuild()},cnt(PRODUCTS.filter(p=>p.ret).length)));
    side.append(chk('Seulement les coloris ajoutés (late)',ui.late,c=>{ui.late=c;saveUi();rebuild()},cnt(SP.reduce((a,s)=>a+s.ps.filter(x=>x.late).length,0))));
    const fams=$('div',{className:'fams'});for(const[k,[l,c]]of Object.entries(FAMS))fams.append($('button',{className:'fam'+(ui.fams.includes(k)?' on':''),title:l,on:{click:()=>{ui.fams=ui.fams.includes(k)?ui.fams.filter(x=>x!==k):[...ui.fams,k];saveUi();buildSide();rebuild()}}},$('i',{style:'background:'+c}),l));
    side.append(fams);
    side.append($('h2',{},'Catégories'));
    const nav=$('nav',{});side.append(nav);side.nav=nav}
  buildSide();

  const main=$('main',{}),modal=$('div',{className:'modal',hidden:true});
  document.body.append(header,$('div',{className:'cols'},side,main),modal);

  /* ---------- filtering and building (rows are built when their species comes near the view) ---------- */
  const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  function visibleRows(s){const t=norm(ui.q).trim(),num=/^\d+$/.test(t)?+t:null,spHit=t&&!num&&(norm(s.n).includes(t)||norm(s.l).includes(t)||s.sid.includes(t)||norm(s.c).includes(t));
    return s.ps.filter(x=>(ui.ret||!x.ret)&&(!ui.late||x.late)&&(!ui.fams.length||ui.fams.includes(x.p.fam))&&(!ui.chosen||SELSP.has(s.sid)||SELCW.has(x.p.id))
      &&(!t||spHit||(num!=null?x.sku===num:norm(x.p.cn).includes(t)||x.p.id.includes(t))))}
  function shownSpecies(){return SP.filter(s=>ui.vers.includes(s.v)&&(!ui.ch||s.ch)&&(!ui.su||s.su>=0)).map(s=>[s,visibleRows(s)]).filter(([,r])=>r.length)}
  let rbT=0;const rebuildSoon=()=>{clearTimeout(rbT);rbT=setTimeout(rebuild,180)};
  const spIO=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){spIO.unobserve(e.target);e.target._fill()}},{rootMargin:'1200px 0px'});
  function rebuild(){spIO.disconnect();cellIO.disconnect();QUEUE.clear();VIS.clear();main.innerHTML='';scrollTo(0,0);
    const list=shownSpecies(),nRows=list.reduce((a,[,r])=>a+r.length,0);
    main.append($('p',{className:'count'},list.length?`${fr(list.length)} espèce${list.length>1?'s':''}, ${fr(nRows)} coloris affichés`:'Aucune fleur ne correspond à ces filtres.'));
    side.nav.innerHTML='';
    for(const cat of CATS){const items=list.filter(([s])=>s.c===cat);if(!items.length)continue;
      const cid='cat-'+norm(cat).replace(/[^a-z0-9]+/g,'-');main.append($('h2',{className:'cat',id:cid},cat,$('em',{},`${items.length} espèces`)));
      const det=$('details',{open:items.length<40||list.length<60},$('summary',{},cat,$('em',{},items.length)));side.nav.append(det);
      for(const[s,rows]of items){const sec=speciesBlock(s,rows);main.append(sec);
        det.append($('a',{href:'#',className:'v-'+s.v,on:{click:e=>{e.preventDefault();document.body.classList.remove('showside');sec.scrollIntoView({block:'start'})}}},$('i',{}),s.n,$('em',{},rows.length)))}}}

  const vLabel=id=>(VERSIONS.find(v=>v.id===id)||{}).l;
  function speciesBlock(s,rows){
    const est=ui.mode==='apercu'?Math.ceil(rows.length/8)*200+80:rows.length*168+110;
    const sec=$('section',{className:'sp',id:'sp-'+s.sid,style:'min-height:'+est+'px'});
    const pick=$('input',{type:'checkbox',checked:SELSP.has(s.sid),title:'Choisir cette espèce',on:{change:e=>{e.target.checked?SELSP.add(s.sid):SELSP.delete(s.sid);sec.classList.toggle('chosen',e.target.checked);saveSel()}}});
    sec.classList.toggle('chosen',SELSP.has(s.sid));
    const lates=[...new Set(rows.filter(x=>x.late).map(x=>x.late))];
    sec.append($('div',{className:'sph'},$('label',{className:'pick'},pick,$('span',{},'Choisir')),
      $('div',{},$('h3',{},s.n,' ',$('small',{},s.l)),$('p',{className:'meta'},$('code',{},s.sid),` · ${s.r||'—'} · ${rows.length} coloris`+(rows.length<s.ps.length?` sur ${s.ps.length}`:'')+` · SKU ${rows[0].sku}`+(rows.length>1?` à ${rows[rows.length-1].sku}`:''))),
      $('div',{className:'badges'},$('span',{className:'badge v-'+s.v},vLabel(s.v)),s.ch?$('span',{className:'badge ch'},'En chantier'):null,s.su>=0?$('span',{className:'badge su'},`Prévue ensuite · n° ${s.su+1}`):null,
        lates.length?$('span',{className:'badge lt'},'Ajouts late:'+lates.join(', ')):null)));
    sec._fill=()=>{sec.style.minHeight='';
      if(ui.mode==='apercu'){const g=$('div',{className:'grid'});for(const x of rows)g.append(card(s,x,ui.st));sec.append(g)}
      else{const t=$('div',{className:'tbl'});t.append($('div',{className:'trow thead'},$('div',{},'Coloris'),STATES.map(S=>$('div',{},S.l))));for(const x of rows)t.append(row(s,x));sec.append(t)}};
    spIO.observe(sec);return sec}
  function cwInfo(s,x){const sw=$('i',{className:'sw',style:'background:'+x.p.col,title:x.p.col});
    const pick=$('input',{type:'checkbox',checked:SELCW.has(x.p.id),title:'Choisir ce coloris',on:{change:e=>{e.target.checked?SELCW.add(x.p.id):SELCW.delete(x.p.id);e.target.closest('.cw').classList.toggle('chosen',e.target.checked);saveSel()}}});
    return $('div',{className:'cwi'},$('label',{className:'nm'},pick,sw,$('b',{},x.p.cn)),$('span',{className:'sku'},`SKU ${x.sku} · ${(FAMS[x.p.fam]||[x.p.fam])[0]}`),
      $('span',{className:'tags'},x.late?$('span',{className:'tag lt'},'late:'+x.late):null,x.ret?$('span',{className:'tag rt'},'retiré'):null))}
  function cellEl(s,x,S){const c=$('button',{className:'cell',title:`${s.n} · ${x.p.cn} · ${S.l} (cliquer pour agrandir)`,on:{click:()=>openBig(s,x,S.k)}},$('img',{alt:''}));c._key=x.p.id+'|'+S.k;c._x=x;c._S=S;cellIO.observe(c);return c}
  function card(s,x,k){const S=STATES.find(T=>T.k===k)||STATES[3],d=$('div',{className:'cw card'+(SELCW.has(x.p.id)?' chosen':'')+(x.ret?' ret':'')});d.append(cellEl(s,x,S),cwInfo(s,x));return d}
  function row(s,x){const d=$('div',{className:'cw trow'+(SELCW.has(x.p.id)?' chosen':'')+(x.ret?' ret':'')});d.append(cwInfo(s,x),...STATES.map(S=>cellEl(s,x,S)));return d}

  /* ---------- drawing: one cell at a time, in view first, kept as an image (LRU) ---------- */
  const CACHE=new Map(),CMAX=3000,QUEUE=new Set(),VIS=new Set();
  const cellIO=new IntersectionObserver(es=>{for(const e of es){const c=e.target;if(e.isIntersecting){VIS.add(c);const u=CACHE.get(c._key);if(u){CACHE.delete(c._key);CACHE.set(c._key,u);c.firstChild.src=u;c.classList.add('ok')}else{QUEUE.add(c);pump()}}
    else{VIS.delete(c);QUEUE.delete(c);c.firstChild.removeAttribute('src');c.classList.remove('ok')}}},{rootMargin:'400px 0px'});
  let busy=false;
  async function pump(){if(busy)return;busy=true;try{while(QUEUE.size){let best=null,by=1e9;for(const c of QUEUE){if(!c.isConnected){QUEUE.delete(c);continue}const y=Math.abs(c.getBoundingClientRect().top-innerHeight*.3);if(y<by){by=y;best=c}}
      if(!best)break;QUEUE.delete(best);if(!VIS.has(best))continue;let u=CACHE.get(best._key);
      if(!u){try{u=await rasterize(drawCell(best._x.p,best._S))}catch(e){best.classList.add('err');best.title+='\nErreur : '+(e&&e.message||e);continue}
        CACHE.set(best._key,u);if(CACHE.size>CMAX){const[k0,u0]=CACHE.entries().next().value;CACHE.delete(k0);URL.revokeObjectURL(u0)}}
      if(VIS.has(best)){best.firstChild.src=u;best.classList.add('ok')}
      await new Promise(r=>setTimeout(r,0))}}finally{busy=false}}
  /* the app's drawers, as its shop and bouquets call them (u2.js thumb, c5.js buildBq, lab/cards.js) */
  function drawCell(p,S,host){const svg=E('svg',{viewBox:'0 0 10 10',width:TW,height:TH},host||park),gd=GDEF,lod=LOD;GDEF=E('defs',{},svg);
    try{if(S.card){LOD=1;renderStatic(()=>{if(CWS[p.sid])LOD=0;bunchArt(svg,p)})}
      else{LOD=0;const ci=+p.id.split('~')[1];if(typeof sd==='function')sd(p.sid.length*131+ci*17+7);
        renderStatic(()=>{const LP=lifeProfile(p),life=S.st!=null?{stage:S.st,u:.7,w:lifeWEl({stage:S.st,u:.7},LP)}:undefined;
          drawRec(G(svg),0,p.rec,{col:p.col,ax:S.ax||[.2,.3,.95],roll:0,op:S.op,life,dry:S.st===3&&LP.dry?1:undefined})})}}
    finally{GDEF=gd;LOD=lod}
    fitBox(svg,.06);return svg}
  async function rasterize(svg){const XS=new XMLSerializer();let body=XS.serializeToString(svg),extra='';const seen=new Set();
    const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);if(svg.querySelector('#'+CSS.escape(id)))continue;const el=document.getElementById(id);if(el){const t=XS.serializeToString(el);extra+=t;add(t)}}};
    add(body);svg.remove();if(extra)body=body.replace(/(<svg[^>]*>)/,'$1<defs>'+extra+'</defs>');
    const img=new Image(),url=URL.createObjectURL(new Blob([body],{type:'image/svg+xml'}));img.src=url;try{await img.decode()}finally{URL.revokeObjectURL(url)}
    const cv=document.createElement('canvas');cv.width=TW;cv.height=TH;cv.getContext('2d').drawImage(img,0,0,TW,TH);
    const b=await new Promise(r=>cv.toBlob(r,'image/webp',.9));return URL.createObjectURL(b)}

  /* ---------- close look: the live SVG, large, every state; arrows go through the colourways ---------- */
  let BIG=null;
  function openBig(s,x,k){BIG={s,x,k,rows:visibleRows(s)};modal.hidden=false;drawBig();document.body.classList.add('noscroll')}
  function closeBig(){modal.hidden=true;modal.innerHTML='';BIG=null;document.body.classList.remove('noscroll')}
  function drawBig(){const{s,x,k,rows}=BIG,S=STATES.find(T=>T.k===k),i=rows.indexOf(x);modal.innerHTML='';
    const stage=$('div',{className:'bigsvg'}),go=d=>{const n=rows[(i+d+rows.length)%rows.length];if(n){BIG.x=n;drawBig()}};
    const box=$('div',{className:'mbox',on:{click:e=>e.stopPropagation()}},
      $('div',{className:'mhead'},$('div',{},$('h3',{},s.n,' · ',x.p.cn),$('p',{className:'meta'},`SKU ${x.sku} · `,$('code',{},x.p.id),` · ${vLabel(s.v)}`+(x.late?` · late:${x.late}`:'')+(x.ret?' · retiré':''))),
        $('button',{className:'ghost',textContent:'Fermer ✕',on:{click:closeBig}})),
      $('div',{className:'mtabs'},STATES.map(T=>$('button',{className:'seg'+(T.k===k?' on':''),textContent:T.l,on:{click:()=>{BIG.k=T.k;drawBig()}}}))),
      $('div',{className:'mbody'},$('button',{className:'nav',textContent:'‹',title:'Coloris précédent (←)',on:{click:()=>go(-1)}}),stage,$('button',{className:'nav',textContent:'›',title:'Coloris suivant (→)',on:{click:()=>go(1)}})),
      $('p',{className:'mfoot'},`Coloris ${i+1} sur ${rows.length} · molette pour zoomer, glisser pour déplacer, double clic pour recadrer · ← → coloris, ↑ ↓ état, Échap pour fermer`));
    modal.append(box);
    try{const svg=drawCell(x.p,S,stage);svg.removeAttribute('width');svg.removeAttribute('height');zoomable(svg)}catch(e){stage.textContent='Erreur de dessin : '+(e&&e.message||e)}}
  /* wheel to zoom where the pointer is, drag to move, double click to frame the whole flower again */
  function zoomable(svg){const vb0=svg.getAttribute('viewBox').split(/\s+/).map(Number);let vb=vb0.slice(),drag=null;const set=()=>svg.setAttribute('viewBox',vb.map(v=>+v.toFixed(3)).join(' '));
    const pt=e=>{const r=svg.getBoundingClientRect(),k=Math.max(vb[2]/r.width,vb[3]/r.height),ox=(r.width-vb[2]/k)/2,oy=(r.height-vb[3]/k)/2;return[vb[0]+(e.clientX-r.left-ox)*k,vb[1]+(e.clientY-r.top-oy)*k,k]};
    svg.addEventListener('wheel',e=>{e.preventDefault();const[x,y]=pt(e),z=Math.exp(Math.sign(e.deltaY)*.18),w=Math.min(vb0[2]*1.5,Math.max(vb0[2]/40,vb[2]*z)),f=w/vb[2];vb=[x-(x-vb[0])*f,y-(y-vb[1])*f,vb[2]*f,vb[3]*f];set()},{passive:false});
    svg.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,vb[0],vb[1],pt(e)[2]];svg.setPointerCapture(e.pointerId);svg.style.cursor='grabbing'});
    svg.addEventListener('pointermove',e=>{if(!drag)return;vb[0]=drag[2]-(e.clientX-drag[0])*drag[4];vb[1]=drag[3]-(e.clientY-drag[1])*drag[4];set()});
    svg.addEventListener('pointerup',()=>{drag=null;svg.style.cursor='grab'});svg.addEventListener('dblclick',()=>{vb=vb0.slice();set()});svg.style.cursor='grab'}
  modal.addEventListener('click',closeBig);
  addEventListener('keydown',e=>{if(!BIG)return;if(!BIG.s){if(e.key==='Escape')closeBig();return}const i=STATES.findIndex(T=>T.k===BIG.k),r=BIG.rows,j=r.indexOf(BIG.x);
    if(e.key==='Escape')closeBig();else if(e.key==='ArrowRight'){BIG.x=r[(j+1)%r.length];drawBig()}else if(e.key==='ArrowLeft'){BIG.x=r[(j-1+r.length)%r.length];drawBig()}
    else if(e.key==='ArrowDown'){BIG.k=STATES[(i+1)%STATES.length].k;drawBig()}else if(e.key==='ArrowUp'){BIG.k=STATES[(i-1+STATES.length)%STATES.length].k;drawBig()}else return;e.preventDefault()});

  /* ---------- the owner's choice, as text for the next chantier ---------- */
  function exportSel(){const d=new Date().toLocaleDateString('fr-FR'),L=[`Inventaire des fleurs : ma sélection du ${d}`,''];
    const sps=SP.filter(s=>SELSP.has(s.sid));if(sps.length)L.push(`Espèces choisies (${sps.length}) :`);for(const s of sps)L.push(`- ${s.sid} : ${s.n} (${vLabel(s.v)}, ${s.ps.filter(x=>!x.ret).length} coloris, SKU ${s.ps[0].sku} à ${s.ps[s.ps.length-1].sku})`);
    const cws=[];for(const s of SP)for(const x of s.ps)if(SELCW.has(x.p.id))cws.push([s,x]);if(cws.length)L.push(...(sps.length?['']:[]),`Coloris choisis (${cws.length}) :`);
    if(!sps.length&&!cws.length)L.push('Rien de choisi pour l’instant : coche « Choisir » sur une espèce ou la case d’un coloris.');
    for(const[s,x]of cws)L.push(`- SKU ${x.sku} · ${x.p.id} : ${s.n}, ${x.p.cn} (${vLabel(s.v)}${SELSP.has(s.sid)?', espèce aussi choisie':''})`);
    const txt=L.join('\n');modal.innerHTML='';
    const ta=$('textarea',{value:txt,readOnly:true,rows:18});const ok=$('span',{className:'ok'});
    modal.append($('div',{className:'mbox small',on:{click:e=>e.stopPropagation()}},$('div',{className:'mhead'},$('h3',{},'Ma sélection'),$('button',{className:'ghost',textContent:'Fermer ✕',on:{click:closeBig}})),
      $('p',{className:'meta'},'Colle ce texte dans la conversation pour lancer le prochain chantier de fleurs.'),ta,$('div',{className:'mini'},$('button',{className:'act',textContent:'Copier',on:{click:async()=>{try{await navigator.clipboard.writeText(txt);ok.textContent='Copié.'}catch(_){ta.select();document.execCommand('copy');ok.textContent='Copié.'}}}}),ok)));
    modal.hidden=false;document.body.classList.add('noscroll');BIG={s:null,x:null,k:null,rows:[]};ta.focus();ta.select()}

  saveSel();rebuild()}

const STYLE=`
:root{--paper:#f6f2ec;--card:#fffdf9;--ink:#2b2420;--ink2:#6e625a;--line:rgba(43,36,32,.13);--cell:#ebe5dc;--accent:#b4235a;--leaf:#3f6b3a;--sel:#fff3c4;
  --v-pilote:#2f8f5b;--v-v3l1:#c2185b;--v-v3l2:#8e3fbf;--v-v3l3:#1f74c9;--v-refait:#0e8c8c;--v-serre:#a79c92;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--paper:#1d1a18;--card:#262220;--ink:#efe8e1;--ink2:#b3a69b;--line:rgba(239,232,225,.14);--cell:#e6e0d7;--sel:#4a3f1c;--v-serre:#7d736b;color-scheme:dark}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
body.noscroll{overflow:hidden}
header{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--paper) 94%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between}
h1{font:600 22px/1.1 Georgia,"Times New Roman",serif;margin:0}
.stats{margin:2px 0 0;color:var(--ink2);font-size:12.5px}
.tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
input[type=search]{width:min(320px,80vw);padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit}
select{padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit}select:disabled{opacity:.45}
button{font:inherit;color:inherit;cursor:pointer}
.segs{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.seg{border:0;background:var(--card);padding:6px 11px}.seg+.seg{border-left:1px solid var(--line)}.seg.on{background:var(--ink);color:var(--paper)}
.selbox{display:flex;gap:6px;align-items:center}.selc{color:var(--ink2);font-size:12.5px}
.act{border:0;border-radius:8px;background:var(--accent);color:#fff;padding:6px 11px;font-weight:600}
.ghost{border:1px solid var(--line);border-radius:8px;background:transparent;padding:5px 10px}
.cols{display:grid;grid-template-columns:272px 1fr;align-items:start}
aside{position:sticky;top:var(--hh,64px);height:calc(100vh - var(--hh,64px));overflow:auto;padding:12px 14px 40px;border-right:1px solid var(--line)}
aside h2{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);margin:16px 0 6px}aside h2:first-child{margin-top:0}
.ck{display:flex;gap:7px;align-items:baseline;padding:2px 0;cursor:pointer}.ck span{flex:1}.ck em,aside em{font-style:normal;color:var(--ink2);font-size:12px}
.vd{margin:-2px 0 4px 22px;color:var(--ink2);font-size:11.5px}
.mini{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0;align-items:center}.mini button:not(.act){border:1px solid var(--line);border-radius:6px;background:var(--card);padding:2px 8px;font-size:12px}
.fams{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.fam{display:inline-flex;gap:5px;align-items:center;border:1px solid var(--line);border-radius:99px;background:var(--card);padding:2px 9px 2px 4px;font-size:12px}.fam.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.fam i,.sw{display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.18);flex:none}
nav details{margin:2px 0}nav summary{cursor:pointer;font-weight:600;padding:3px 0;display:flex;gap:6px}nav summary em{margin-left:auto}
nav a{display:flex;gap:6px;align-items:center;color:var(--ink);text-decoration:none;padding:1px 0 1px 10px;font-size:13px}nav a:hover{color:var(--accent)}nav a em{margin-left:auto}
nav a i{width:8px;height:8px;border-radius:50%;flex:none;background:var(--vc)}
.v-pilote{--vc:var(--v-pilote)}.v-v3l1{--vc:var(--v-v3l1)}.v-v3l2{--vc:var(--v-v3l2)}.v-v3l3{--vc:var(--v-v3l3)}.v-refait{--vc:var(--v-refait)}.v-serre{--vc:var(--v-serre)}
main{padding:10px 18px 80px;min-width:0}
.count{color:var(--ink2);margin:4px 0 8px}
h2.cat{font:600 20px Georgia,serif;margin:26px 0 8px;padding-bottom:4px;border-bottom:2px solid var(--ink);display:flex;gap:10px;align-items:baseline}h2.cat em{font:400 13px system-ui;color:var(--ink2)}
.sp{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 14px;scroll-margin-top:calc(var(--hh,64px) + 8px)}
.sp.chosen{box-shadow:0 0 0 2px var(--accent)}
.sph{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}.sph>div:nth-child(2){flex:1;min-width:220px}
h3{margin:0;font:600 17px/1.25 Georgia,serif}h3 small{font:italic 400 13px Georgia,serif;color:var(--ink2)}
.meta{margin:2px 0 0;color:var(--ink2);font-size:12.5px}code{font-size:12px}
.pick{display:flex;flex-direction:column;align-items:center;font-size:11px;color:var(--ink2);cursor:pointer;padding-top:2px}
.badges{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}
.badge{font-size:11.5px;font-weight:600;border-radius:99px;padding:2px 9px;color:#fff;background:var(--vc,#777)}
.badge.ch{background:#d9822b}.badge.su{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink2)}.badge.lt{background:transparent;color:var(--ink2);box-shadow:inset 0 0 0 1px var(--line)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px;margin-top:10px}
.card{display:flex;flex-direction:column;gap:4px;border-radius:10px;padding:4px}
.cw.chosen{background:var(--sel)}.cw.ret{opacity:.55}
.cell{display:block;width:100%;aspect-ratio:4/5;border:0;padding:0;border-radius:8px;background:var(--cell);overflow:hidden;position:relative}
.cell img{display:block;width:100%;height:100%;object-fit:contain}
.cell:not(.ok)::after{content:"";position:absolute;inset:40%;border-radius:50%;border:2px solid rgba(0,0,0,.12);border-top-color:rgba(0,0,0,.35);animation:sp 1s linear infinite}
.cell.err::after{content:"erreur";inset:auto;left:0;right:0;top:45%;border:0;animation:none;text-align:center;color:#a33;font-size:11px}
.cell:hover{outline:2px solid var(--accent);outline-offset:1px}
@keyframes sp{to{transform:rotate(1turn)}}
.cwi{display:flex;flex-direction:column;gap:1px;min-width:0;font-size:12.5px}
.cwi .nm{display:flex;gap:5px;align-items:center;cursor:pointer}.cwi b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sku{color:var(--ink2);font-size:11.5px}
.tags{display:flex;gap:4px}.tag{font-size:10.5px;border-radius:4px;padding:0 5px;box-shadow:inset 0 0 0 1px var(--line);color:var(--ink2)}.tag.rt{color:#a33}
.tbl{margin-top:10px;overflow-x:auto}
.trow{display:grid;grid-template-columns:170px repeat(8,minmax(96px,1fr));gap:6px;align-items:center;padding:4px;border-radius:10px;min-width:960px}
.thead{font-size:11.5px;color:var(--ink2);text-align:center;font-weight:600;padding-bottom:0}.thead>div:first-child{text-align:left}
.trow .cwi b{white-space:normal}
.trow>:first-child{position:sticky;left:0;z-index:1;background:var(--card);align-self:stretch;justify-content:center;padding-right:4px}.trow.chosen>:first-child{background:var(--sel)}
.modal{position:fixed;inset:0;z-index:20;background:rgba(20,16,14,.6);display:grid;place-items:center;padding:16px}.modal[hidden]{display:none}
.mbox{background:var(--card);border-radius:14px;width:min(1000px,100%);max-height:100%;overflow:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.mbox.small{width:min(720px,100%)}
.mhead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.mtabs{display:flex;flex-wrap:wrap;border:1px solid var(--line);border-radius:8px;overflow:hidden;align-self:flex-start}
.mbody{display:grid;grid-template-columns:44px 1fr 44px;gap:8px;align-items:center}
.bigsvg{background:var(--cell);border-radius:10px;height:min(68vh,760px);display:grid;place-items:center;overflow:hidden}.bigsvg svg{width:100%;height:100%}
.nav{height:80px;border:1px solid var(--line);border-radius:8px;background:var(--card);font-size:26px}
.mfoot{color:var(--ink2);font-size:12px;margin:0}
textarea{width:100%;font:12.5px/1.45 ui-monospace,Consolas,monospace;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink)}
.ok{color:var(--leaf);font-weight:600}
button.filt{display:none}
@media (max-width:760px){.cols{grid-template-columns:1fr}aside{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line);display:none}body.showside aside{display:block}button.filt{display:inline-block}header{position:static}main{padding:10px 16px 60px}.trow{grid-template-columns:150px repeat(8,96px)}}
`;
/* the app finishes its own setup on load; the inventory takes over right after */
const go=()=>setTimeout(()=>{try{start();const h=document.querySelector('header');if(h)document.documentElement.style.setProperty('--hh',h.offsetHeight+'px')}catch(e){document.body.innerHTML='<pre style="padding:16px;white-space:pre-wrap">Inventaire : '+String(e&&e.stack||e)+'</pre>'}},60);
if(document.readyState==='complete')go();else addEventListener('load',go);
})();
