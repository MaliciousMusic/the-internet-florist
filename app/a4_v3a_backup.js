
/* ---------- the florist (stands behind the tab-bar counter) ---------- */
const FLORIST=`<svg class="fl-svg" viewBox="0 0 120 150" aria-hidden="true">
<g class="body"><path d="M16 150C18 120 33 104 60 104S102 120 104 150Z" fill="#fff6ef"/><path d="M30 116h60M24 128h72M20 140h80" stroke="#eadbd2" stroke-width="3"/>
<path d="M38 150L40 113Q60 122 80 113L82 150Z" fill="#2b2522"/><path d="M41 113L47 104M79 113L73 104" stroke="#1d1916" stroke-width="3" stroke-linecap="round"/>
<path d="M54 126V118M60 126V115M66 126V119" stroke="#4f8a2a" stroke-width="1.6"/><circle cx="54" cy="117" r="3.2" fill="#f2d6c9"/><circle cx="60" cy="113.5" r="3.6" fill="#8e1430"/><circle cx="66" cy="118" r="3.2" fill="#e9a0bc"/>
<rect x="49" y="125" width="22" height="15" rx="4" fill="#3a322e"/></g>
<rect x="54" y="86" width="12" height="20" rx="5" fill="#e9b693"/>
<g class="arm"><path d="M90 116C100 108 106 96 106 82" stroke="#f3c7a6" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M88 118C95 113 99 108 101 102" stroke="#fff6ef" stroke-width="11" stroke-linecap="round" fill="none"/>
<path d="M106 80V54" stroke="#4f8a2a" stroke-width="2.2" stroke-linecap="round"/><path d="M106 70C100 68 97 63 97 58C102 59 105 63 106 68" fill="#6fae3a"/>
<path d="M98.5 56C98 45 106 40 106 40S114 45 113.5 56C110 60 102 60 98.5 56Z" fill="#8e1430"/><path d="M102 56C102 49 106 44 106 44S110 49 110 56" fill="#c23a54"/><circle cx="106" cy="80" r="5.6" fill="#f3c7a6"/></g>
<g class="head"><path d="M31 64C29 86 36 98 45 100L46 66Z" fill="#3b2420"/><path d="M89 64C91 86 84 98 75 100L74 66Z" fill="#3b2420"/><circle cx="60" cy="34" r="12" fill="#3b2420"/>
<g transform="translate(70 27)"><circle cy="-4" r="3.2" fill="#c23a54"/><circle cx="3.8" cy="-1.2" r="3.2" fill="#c23a54"/><circle cx="2.4" cy="3.3" r="3.2" fill="#c23a54"/><circle cx="-2.4" cy="3.3" r="3.2" fill="#c23a54"/><circle cx="-3.8" cy="-1.2" r="3.2" fill="#c23a54"/><circle r="2" fill="#f3e6c2"/></g>
<circle cx="60" cy="64" r="27" fill="#f3c7a6"/><path d="M33 60C33 41 45 32 60 32C77 32 88 43 87 60C80 49 70 44 59 46C50 45 40 50 33 60Z" fill="#3b2420"/>
<g class="eye"><ellipse cx="51" cy="66" rx="2.9" ry="3.7" fill="#2b1a17"/><circle cx="52" cy="64.6" r="1" fill="#fff"/></g><g class="eye"><ellipse cx="69" cy="66" rx="2.9" ry="3.7" fill="#2b1a17"/><circle cx="70" cy="64.6" r="1" fill="#fff"/></g>
<path d="M46.5 59.5Q51 57 55 59M65 59Q69 57 73.5 59.5" stroke="#3b2420" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<circle cx="45" cy="74" r="5" fill="#ff8fa3" opacity=".45"/><circle cx="75" cy="74" r="5" fill="#ff8fa3" opacity=".45"/><path d="M54 77Q60 83 66 77" stroke="#a34a4a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g></svg>`;
function say(txt,ms=4200){const b=$('bubble');b.textContent=txt;b.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>b.classList.remove('show'),ms)}
function wave(){const el=$('florist');el.classList.remove('wave');void el.offsetWidth;el.classList.add('wave')}
const TIPS={shop:["Touche une fleur pour la cueillir","Une variété se cueille une fois : je choisis le nombre de tiges","Glisse : le jardin n'a pas de fin","Les allées en haut t'emmènent vers chaque couleur","Touche-moi pour un bouquet surprise"],
 bouquet:["Change l'occasion : je recompose tout","« Une autre composition » change la silhouette","La garniture est offerte, je l'ajoute pour toi"],
 send:["Un petit mot fait toute la différence","Nos musiques sont originales, composées pour la maison"],
 garden:["Chaque fleur offerte rejoint ton herbier","Les bouquets reçus restent ici pour toujours"]};
let tipI=0,adds=0;
setInterval(()=>{if(document.hidden||HOME||$('bubble').classList.contains('show')||OV||$('sheet').classList.contains('on'))return;const a=TIPS[S.view];say(a[tipI++%a.length])},17000);
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
$('florist').innerHTML=FLORIST;$('florist').onclick=surprise;
$('tabs').onclick=e=>{const t=e.target.closest('.tab');if(t)go(t.dataset.v)};
$('pill').onclick=()=>go('bouquet');
$('reroll').onclick=()=>{if(!count())return toast("Cueille d'abord quelques fleurs");S.seed=1+Math.floor(Math.random()*1e6);enterBouquet()};
$('surprise').onclick=surprise;
$('occs').onclick=e=>{const b=e.target.closest('.oc');if(!b)return;S.occ=b.dataset.o;S.seed=1+Math.floor(Math.random()*1e6);update();if(S.view==='bouquet')enterBouquet()};
$('sel').onclick=e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,p=BYID[id];dec(id);update();toast(`${p.n} retirée`,()=>{S.cart.set(id,1);update()})};
$('vases').onclick=e=>{const b=e.target.closest('.vase');if(!b)return;S.vase=b.dataset.v;update()};
$('toSend').onclick=()=>go('send');
$('scrim').onclick=closeSheet;
