
/* the florist character is on hold until her references arrive: speech and gestures are silent */
function say(){}
function wave(){}
const TIPS={shop:["Touche une fleur pour la cueillir","Une variété se cueille une fois : je choisis le nombre de tiges","Glisse : le jardin n'a pas de fin","Les allées en haut t'emmènent vers chaque couleur","Touche-moi pour un bouquet surprise"],
 bouquet:["Change l'occasion : je recompose tout","« Une autre composition » change la silhouette","La garniture est offerte, je l'ajoute pour toi"],
 send:["Un petit mot fait toute la différence","Nos musiques sont originales, composées pour la maison"],
 garden:["Chaque fleur offerte rejoint ton herbier","Les bouquets reçus restent ici pour toujours"]};
let tipI=0,adds=0;
function react(p){adds++;const t=total();
  if(p.rar==='l')say('Une Légendaire ! Elle sera le cœur du bouquet');
  else if(adds===1)say('Joli choix. Je m’occupe du nombre de tiges');
  else if(t>=MIN&&t-p.p<MIN)say('Ton bouquet peut déjà être envoyé');
  else if(p.rar==='p')say(`Très bon goût : ${p.n}`);
  else if(count()===5)say('Ça prend forme, va voir ton bouquet');
  wave()}

/* ---------- helpers: toast, sheet, router ---------- */
function toast(msg,undo,lab='Annuler'){const t=$('toast');t.textContent=msg;if(undo){const b=document.createElement('button');b.type='button';b.textContent=lab;b.onclick=()=>{undo();t.classList.remove('on')};t.append(b)}
  t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),undo?4200:2400)}
function sheet(html){const s=$('sheet');s.innerHTML=html;s.classList.add('on');$('scrim').classList.add('on');s.scrollTop=0}
function closeSheet(){$('sheet').classList.remove('on');$('scrim').classList.remove('on')}
function go(v){S.view=v;document.querySelectorAll('.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));
  document.querySelectorAll('.tab').forEach(t=>{const on=t.dataset.v===v;t.classList.toggle('on',on);on?t.setAttribute('aria-current','page'):t.removeAttribute('aria-current')});
  if(v!=='bouquet')stopIdle();if(v==='bouquet')enterBouquet();if(v==='send')enterSend();if(v==='garden')enterGarden();
  try{history.replaceState(null,'','#'+v)}catch(_){}}

/* ---------- occasion presets: the florist composes for you ---------- */
const OCSET={amour:['anthurium-bordeaux','rose-bordeaux','calla-noir','phalaenopsis-prune','scabieuse-noire','oeillet-bordeaux','amarante-bordeaux','tige-calla'],
 anniv:['anthurium-saumon','rose-peche','dahlia-peche','renoncule-saumon','cymbidium-cuivre','nerine-corail','calla-peche','herbe-ours'],
 merci:['lys-casablanca','phalaenopsis-blanc','rose-ivoire','renoncule-blanche','delphinium-blanc','calla-ivoire','saule-tortueux'],
 bravo:['gloriosa','anthurium-rouge','lys-tigre','renoncule-orange','renoncule-rouge','allium-boucle','amarante-corail'],
 courage:['rose-blush','dahlia-cafe','oeillet-poudre','pois-rose','renoncule-rose','anthurium-rose'],juste:null};
const OCBG={amour:'linear-gradient(135deg,#f1d6d2,#c98a8e)',anniv:'linear-gradient(135deg,#f6e2d2,#e8a882)',merci:'linear-gradient(135deg,#f7f3ea,#dfe3d2)',bravo:'linear-gradient(135deg,#f6dccb,#e07a5a)',courage:'linear-gradient(135deg,#f6e8e4,#e9c3c6)',juste:'linear-gradient(135deg,#ece6f2,#e9dccf)'};
function harmony(){const zi=Math.floor(Math.random()*(NZ-1)),zs=[ZONES[zi][0],ZONES[(zi+1)%(NZ-1)][0]],pool=CAT.filter(p=>zs.includes(p.fam)).sort(()=>Math.random()-.5).slice(0,6),ln=CAT.filter(p=>p.fam==='lignes');
  return pool.map(p=>p.id).concat(ln[Math.floor(Math.random()*ln.length)].id)}
function surprise(){wave();sheet(`<h2 class="h2">Un bouquet surprise pour…</h2><div class="occ">${Object.entries(OCCS).map(([k,o])=>`<button type="button" data-o="${k}" style="background:${OCBG[k]}">${o.n}</button>`).join('')}</div>`);
  $('sheet').querySelector('.occ').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.o,set=OCSET[k]?OCSET[k].slice():harmony();
    S.cart.clear();S.occ=k;set.forEach(id=>{if(BYID[id]){S.cart.set(id,1);seen(id)}});while(total()>CAP)S.cart.delete([...S.cart.keys()].pop());
    S.seed=1+Math.floor(Math.random()*1e6);closeSheet();hideHome();update();lastSig='';go('bouquet');
    setTimeout(()=>say(OCSET[k]?`Tadaa ! Un bouquet « ${OCCS[k].n} » rien que pour toi`:'Tadaa ! Celui-là est unique au monde'),500)}}

/* ---------- wiring ---------- */
$('tabs').onclick=e=>{const t=e.target.closest('.tab');if(t)go(t.dataset.v)};
$('pill').onclick=()=>go('bouquet');
$('reroll').onclick=()=>{if(!count())return toast("Cueille d'abord quelques fleurs");S.seed=1+Math.floor(Math.random()*1e6);enterBouquet()};
$('surprise').onclick=surprise;
$('occs').onclick=e=>{const b=e.target.closest('.oc');if(!b)return;S.occ=b.dataset.o;S.seed=1+Math.floor(Math.random()*1e6);update();if(S.view==='bouquet')enterBouquet()};
$('sel').onclick=e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,p=BYID[id];dec(id);update();toast(`${p.n} retirée`,()=>{S.cart.set(id,1);update()})};
$('vases').onclick=e=>{const b=e.target.closest('.vase');if(!b)return;S.vase=b.dataset.v;update()};
$('toSend').onclick=()=>go('send');
$('scrim').onclick=closeSheet;
