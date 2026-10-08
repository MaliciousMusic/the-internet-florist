
/* ================= App v7 : état, prix, catalogue (bouquets modèles + fleurs à composer) ================= */
Object.assign(S,{view:'models',route:'compose',model:null,occ:'juste',vase:'cylindre-verre-clair',bg:'lin',conf:'coeurs',bf:'aucun',music:'none',fsort:'col',msort:'sel',cocc:'tous',q:'',qty:new Map(),pos:new Map(),prop:new Set(),adopt:false});
const CONFS=[{id:'coeurs',n:'Cœurs',p:190},{id:'petales',n:'Pétales',p:290},{id:'etoiles',n:'Étoiles d’or',p:290},{id:'aucun',n:'Aucun',p:0}];
const BFS=[{id:'aucun',n:'Sans papillons',p:0},{id:'un',n:'Un papillon',p:390},{id:'trois',n:'Trois papillons',p:790}];
/* backgrounds: the catalogue keeps one tone; only the bouquet being created gets the background its sender chooses */
const BGS=[{id:'lin',n:'Lin',c:'#efe8de'},{id:'platre',n:'Plâtre',c:'#e7e4df'},{id:'argile',n:'Argile',c:'#dcc5b3'},{id:'poudre',n:'Poudre',c:'#ecd6d1'},{id:'sauge',n:'Sauge',c:'#cfd5c5'},{id:'brume',n:'Brume',c:'#d2d9df'},{id:'encre',n:'Encre',c:'#2b2627'}];
const bgCol=id=>(BGS.find(b=>b.id===id)||BGS[0]).c,bgCss=c=>`radial-gradient(ellipse 85% 70% at 50% 38%,${lt(c,.3)},${c} 78%)`,isDark=c=>{const[r,g,b]=hx(c);return .3*r+.59*g+.11*b<110};
const OCCN=Object.assign({tous:'Tous'},Object.fromEntries(Object.entries(OCCS).map(([k,o])=>[k,o.n])));
/* real market prices: every stem at its florist price, the algorithm's greenery too, plus the composition */
const stemP=id=>(RBY[id]||{}).price||300,stemsOf=m=>m.els.reduce((a,e)=>a+Math.max(1,Math.round(e.n)),0);
const modelStems=m=>m.els.reduce((a,e)=>a+stemP(e.id)*Math.max(1,Math.round(e.n)),0),modelPrice=m=>modelStems(m)+BASE+((VZ[m.vase]||{}).p||0);
MODELS.forEach((m,i)=>{m.key='m'+i;m.price=modelPrice(m)});
function planCost(P){const c={f:0,g:0,nf:0,ng:0};for(const[it,n]of P.cnt){const v=(it.p.price||0)*n;if(it.extra){c.g+=v;c.ng+=n}else{c.f+=v;c.nf+=n}}return c}
let CPK='',CPV=null;
function cost(){if(S.route==='model'&&S.model)return{f:modelStems(S.model),g:0,nf:stemsOf(S.model),ng:0};if(!S.cart.size)return{f:0,g:0,nf:0,ng:0};
  const key=expand().join(',')+'|'+S.occ+'|'+S.vase+'|'+optKey();if(key!==CPK){CPK=key;CPV=planCost(withOpt(()=>plan(expand(),S.occ,S.vase)))}return CPV}
function count(){return S.cart.size}
/* the player's hand on the composition (stems per variety, place 1–10, the proposed greenery taken in), handed to the composer around plan() */
const optKey=()=>[...S.qty].join(';')+'|'+[...S.pos].join(';')+'|'+(S.adopt?1:0);
function withOpt(fn){PLANOPT=S.adopt||S.qty.size||S.pos.size?{qty:S.qty,pos:S.pos,noAdds:S.adopt}:null;try{return fn()}finally{PLANOPT=null}}
function expand(){return[...S.cart.keys()]}
const optP=(L,id)=>(L.find(x=>x.id===id)||{p:0}).p;
function rawTotal(){const has=S.route==='model'?!!S.model:S.cart.size>0;if(!has)return 0;const c=cost();return c.f+c.g+BASE+optP(VASES,S.vase)+optP(CONFS,S.conf)+optP(BFS,S.bf)+optP(MUS,S.music)}
function total(){return rawTotal()}
function lines(){const L=[],c=cost();if(S.route==='model'&&S.model)L.push([`Bouquet « ${S.model.nom} » · ${c.nf} tiges`,c.f]);else{L.push([`Fleurs choisies · ${c.nf} tiges`,c.f]);if(c.ng)L.push([`Feuillages et garniture · ${c.ng} tiges`,c.g])}
  L.push(['Composition et carte',BASE]);for(const[Lst,id,lab]of[[VASES,S.vase,''],[CONFS,S.conf,'Confettis · '],[BFS,S.bf,''],[MUS,S.music,'Musique · ']]){const o=Lst.find(x=>x.id===id);if(o&&o.p)L.push([lab+o.n,o.p])}return L}
function sums(el){const t=total(),h=lines().map(([a,b])=>`<div><span>${esc(a)}</span><span>${eur(b)}</span></div>`).join('')+`<div class="t"><span>Total TTC</span><b>${eur(t)}</b></div>`;if(el)el.innerHTML=h;return h}
function update(){if(!S.cart.size){S.qty.clear();S.pos.clear();S.prop.clear();S.adopt=false}const n=count();$('pillN').textContent=n;$('pillW').textContent=n>1?'fleurs':'fleur';$('pillT').textContent=eur(S.route==='compose'||n?total():0);const b=$('badge');b.hidden=!n;b.textContent=n;
  const d=$('dock');d.classList.toggle('on',n>0&&S.view==='flowers');$('dockT').textContent=eur(S.route==='compose'?total():0);$('dockL').textContent=`Composer mon bouquet · ${n} fleur${n>1?'s':''}`;
  document.querySelectorAll('.fcard[data-p]').forEach(c=>c.classList.toggle('on',S.cart.has(c.dataset.p)))}
/* ---------- lazy rendering: draw a card when it nears the screen, release it when far away ---------- */
const ART={},queue=[];let qBusy=0;
const IO=new IntersectionObserver(es=>{for(const e of es){const c=e.target;if(e.isIntersecting){if(!c.dataset.done&&!c.dataset.q){c.dataset.q=1;queue.push(c);pump()}}else if(c.dataset.done){const s=c.querySelector('svg');s.innerHTML='';delete c.dataset.done}}},{rootMargin:'700px 0px'});
function pump(){if(qBusy)return;qBusy=1;requestAnimationFrame(function step(){const t0=performance.now();while(queue.length&&performance.now()-t0<14){const c=queue.shift();delete c.dataset.q;if(!c.isConnected)continue;drawCard(c)}
  if(queue.length)requestAnimationFrame(step);else qBusy=0})}
function drawCard(c){const s=c.querySelector('svg'),key=c.dataset.k;if(ART[key]){s.innerHTML=ART[key][0];s.setAttribute('viewBox',ART[key][1]);c.dataset.done=1;return}
  LOD=1;try{renderStatic(()=>{if(c.dataset.m!=null)buildBq(s,[],7,MODELS[+c.dataset.m].vase,0,null,MODELS[+c.dataset.m]);else{if(CWS[PBY[c.dataset.p].sid])LOD=0;bunchArt(s,PBY[c.dataset.p])}})}catch(err){console.warn(err)}LOD=0;
  if(c.dataset.p!=null)fitBox(s,.07);ART[key]=[s.innerHTML,s.getAttribute('viewBox')];c.dataset.done=1}
function fitBox(s,m=.06){try{const b=s.getBBox();if(!b.width)return;const w=b.width*(1+2*m),h=b.height*(1+2*m),asp=4/5,W=Math.max(w,h*asp),H=W/asp;s.setAttribute('viewBox',`${f(b.x+b.width/2-W/2)} ${f(b.y+b.height/2-H/2)} ${f(W)} ${f(H)}`)}catch(_){}}
/* a florist's bunch of one flower (three to five stems, raffia tie), at its real proportions */
function raffia(g,y){for(const[a,b]of[[-6,1],[-2,-1],[3,1]])E('path',{d:`M-7,${f(y+a)}Q0,${f(y+a+b*2)} 7,${f(y+a+3)}`,stroke:'#c9ae86',"stroke-width":2.2,fill:'none','stroke-linecap':'round'},g);
  E('path',{d:`M2,${f(y+4)}q6,9 3,20M-1,${f(y+4)}q-5,8 -8,17`,stroke:'#bfa27a','stroke-width':1.6,fill:'none','stroke-linecap':'round'},g)}
function bunchArt(svg,p){sd(p.sid.length*131+p.col.charCodeAt(2));const rec=p.rec,inf=p.info,g=G(svg),col=p.col;
  if(inf.k==='head'||inf.k==='cup'){const r=CWS[p.sid]?Math.max(inf.r||30,cmOf(p)*UPC*(inf.form==='orchidee'?.5:.52)):inf.r||30,an=inf.an,n=r>26||an?3:5,pos=n===3?[[-r*.95,-r*2.1,[-.55,.35,.8]],[r*.9,-r*1.95,[.55,.3,.8]],[0,-r*2.9,[0,.25,1]]]:
      [[-r*1.7,-r*2.6,[-.6,.3,.75]],[-r*.6,-r*3.6,[-.2,.3,.93]],[r*.7,-r*3.4,[.3,.3,.9]],[r*1.6,-r*2.4,[.6,.3,.75]],[0,-r*2.3,[0,.15,1]]],stemsG=G(g);
    /* heads first (a greenhouse head tells where its own neck ends), then each stem from the tie to that point, behind them */
    const ends=[];for(const[x,y,ax]of pos){const h=G(g,{transform:`translate(${f(x)},${f(y)})`});let rr=null;if(an&&!CWS[p.sid])drawRec(G(h,{transform:`translate(0,${f(-an[1])}) rotate(${f(x*.25)})`}),0,rec,{col});else rr=drawRec(h,0,rec,{col,ax:inf.nod?[ax[0],-.7,.7]:inf.form==='cornet'?V3.nz([ax[0]*.8,.86,.42]):ax,roll:CWS[p.sid]?R(-.12,.12):R(-.4,.4),up:[x,4-y,0]});
      ends.push(rr&&rr.neck?[x+rr.neck[0],y+rr.neck[1],rr.nd]:[x,y+(an?0:r*.15),null])}
    /* each stem rises from the tie and arrives in its neck along the neck's own direction */
    for(const[x,y,nd]of ends){const L=Math.hypot(x,y-4),P=[[R(-2,2),70],[0,4],nd?[x+nd[0]*L*.4,y+nd[1]*L*.4]:[x*.55,y*.5],[x,y]];stem3(stemsG,P,3.6,2.6,SG,10)}raffia(g,6)}
  else if(inf.k==='drape'){for(const dx of[-12,0,12])drawRec(G(g,{transform:`translate(${dx},-40)`}),0,rec,{col,len:(rec.cm||50)*UPC*.6,sway:dx*2});raffia(g,-42)}
  else{for(const[a,dx]of[[-12,-6],[2,0],[14,6]])drawRec(G(g,{transform:`translate(${dx},60) rotate(${a})`}),0,rec,{col});raffia(g,40)}}
/* ---------- bouquets (models) ---------- */
function modelList(){let L=MODELS.slice();
  if(S.msort==='pa')L=L.slice().sort((a,b)=>a.price-b.price);else if(S.msort==='pd')L=L.slice().sort((a,b)=>b.price-a.price);else if(S.msort==='nom')L=L.slice().sort((a,b)=>a.nom.localeCompare(b.nom,'fr'));return L}
function renderModels(){
  const g=$('mGrid');g.innerHTML=modelList().map(m=>`<button class="fcard mcard" type="button" data-m="${MODELS.indexOf(m)}" data-k="${m.key}"><div class="art"><svg viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg></div><b>${esc(m.nom)}</b><small><span>${stemsOf(m)} tiges</span><em>${eur(m.price)}</em></small></button>`).join('');
  g.querySelectorAll('.fcard').forEach(c=>IO.observe(c))}
/* ---------- flowers (compose) ---------- */
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function flowerList(){const q=norm(S.q||''),o=S.cocc;let L=PRODUCTS.filter(p=>(!q||norm(p.n+' '+p.cn+' '+p.sens).includes(q))&&(o==='tous'||!p.occ.length||p.occ.includes(o)&&!p.ev.includes(o)));
  if(S.fsort==='prix')return[[null,L.slice().sort((a,b)=>a.price-b.price||a.n.localeCompare(b.n,'fr'))]];
  if(S.fsort==='nom')return[[null,L.slice().sort((a,b)=>a.n.localeCompare(b.n,'fr')||a.cn.localeCompare(b.cn,'fr'))]];
  return FAMS.map(fm=>[fm,L.filter(p=>p.fam===fm[0]).sort((a,b)=>hsl(b.col)[2]-hsl(a.col)[2])]).filter(([,l])=>l.length)}
function cardHTML(p){return`<button class="fcard" type="button" data-p="${p.id}" data-k="${p.id}"><div class="art"><svg viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg><span class="add" aria-hidden="true">+</span></div><b>${esc(p.n)}</b>${p.sens?`<i class="sens">${esc(p.sens)}</i>`:''}<small><span>${esc(p.cn)}</span><em>${eur(p.price)}<span class="u"> la tige</span></em></small></button>`}
function renderOcc(){$('cOcc').innerHTML=[['tous','Toutes']].concat(Object.entries(OCCS).map(([k,o])=>[k,o.n])).map(([k,n])=>`<button type="button" data-o="${k}" class="${S.cocc===k?'on':''}">${n}</button>`).join('');
  $('cOccH').textContent=S.cocc==='tous'?'Chaque fleur a un sens : choisis une occasion pour voir celles qui la racontent.':`Les fleurs dont le sens accompagne « ${OCCS[S.cocc].n} ». Ton bouquet sera composé pour cette occasion.`}
function renderFlowers(){renderOcc();const box=$('fList');box.innerHTML=flowerList().map(([fm,l])=>(fm?`<div class="fsec" style="--c:${fm[2]}"><i></i><b>${fm[1]}</b><small>${l.length} fleur${l.length>1?"s":""}</small></div>`:'')+`<div class="fgrid">${l.map(cardHTML).join('')}</div>`).join('')||'<p class="emptyg">Aucune fleur ne correspond.</p>';
  box.querySelectorAll('.fcard').forEach(c=>IO.observe(c));update()}
function go(v){S.view=v;document.querySelectorAll('.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));
  document.querySelectorAll('.tab').forEach(t=>{const on=t.dataset.v===v;t.classList.toggle('on',on);on?t.setAttribute('aria-current','page'):t.removeAttribute('aria-current')});
  if(v==='flowers'&&!$('fList').children.length)renderFlowers();if(v==='models'&&!$('mGrid').children.length)renderModels();if(v==='garden')enterGarden();update();try{history.replaceState(null,'','#'+v)}catch(_){}}
$('tabs').onclick=e=>{const t=e.target.closest('.tab');if(t)go(t.dataset.v)};
$('cOcc').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.cocc=b.dataset.o;if(S.cocc!=='tous')S.occ=S.cocc;renderFlowers();$('fList').scrollIntoView({block:'start'})};
$('mSort').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.msort=b.dataset.s;$('mSort').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));renderModels()};
$('fSort').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.fsort=b.dataset.s;$('fSort').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));renderFlowers()};
$('fSearch').oninput=e=>{S.q=e.target.value;clearTimeout(renderFlowers.t);renderFlowers.t=setTimeout(renderFlowers,250)};
$('mGrid').onclick=e=>{const c=e.target.closest('.fcard');if(c)openModel(MODELS[+c.dataset.m])};
$('fList').onclick=e=>{const c=e.target.closest('.fcard');if(!c)return;const id=c.dataset.p,p=PBY[id];if(S.route!=='compose'){S.route='compose';S.vase='cylindre-verre-clair'}
  if(S.cart.has(id)){S.cart.delete(id);toast(`${p.n} retirée`)}else{S.cart.set(id,1);try{navigator.vibrate&&navigator.vibrate(10)}catch(_){}toast(`${p.n} ${p.cn} ajoutée`)}update()};
$('pill').onclick=()=>{if(S.cart.size){S.route='compose';openFlow()}else go('flowers')};
$('toFlow').onclick=()=>{S.route='compose';openFlow()};
$('brand').onclick=()=>go('models');
/* the app frame never scrolls: its layers (model, send flow, sheets, reveal) sit inside it, and a programmatic scroll (a focused field, scrollIntoView) would slide them and show what lies beneath */
{const A=document.getElementById('app');A.addEventListener('scroll',()=>{if(A.scrollTop||A.scrollLeft){A.scrollTop=0;A.scrollLeft=0}},{passive:true})}
