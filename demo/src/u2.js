
/* ================= Bouquet modèle (aperçu, échanges) et parcours pas à pas ================= */
let MD=0,FLOW=0,OV=null,SEED=7,lastMdC=null,lastOvC=null;
function stopIdle(){idleOn=false;aliveStopAll()}
/* a bouquet done growing comes alive: cut into images the breeze turns on the graphics card (z5.js) */
function finished(){const t=FLOW?[$('flBq'),lastFlowC]:MD?[$('mdBq'),lastMdC]:OV?[$('ovBq'),lastOvC]:null;if(t&&t[1])aliveBq(t[0],t[1])}
function toast(msg,undo,lab='Annuler'){const t=$('toast');t.textContent=msg;if(undo){const b=document.createElement('button');b.type='button';b.textContent=lab;b.onclick=()=>{undo();t.classList.remove('on')};t.append(b)}
  t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),undo?4200:2200)}
function sheet(html){const s=$('sheet');s.innerHTML=html;s.classList.add('on');$('scrim').classList.add('on');s.scrollTop=0}
function closeSheet(){$('sheet').classList.remove('on');$('scrim').classList.remove('on')}
$('scrim').onclick=closeSheet;
const stemCount=c=>c.out.filter(o=>o.kind==='head'||o.kind==='self'||o.kind==='drape').length;
/* small portrait of one product (element lists, swap sheet) */
function thumb(svg,p){LOD=1;try{renderStatic(()=>{const g=G(svg);if(p.info.k==='head')drawRec(g,0,p.rec,{col:p.col,ax:[.2,.3,.95],roll:0});else if(p.info.an)drawRec(G(g,{transform:`translate(0,${f(-p.info.an[1])})`}),0,p.rec,{col:p.col});else drawRec(g,0,p.rec,{col:p.col})})}catch(_){}LOD=0;fitBox(svg,.06)}
/* ---------- model detail ---------- */
function openModel(m){S.route='model';S.model=JSON.parse(JSON.stringify(m));S.vase=m.vase||'coupe-blanche';SEED=1+Math.floor(Math.random()*1e5);MD=1;$('md').classList.add('on');$('mdT').textContent=m.nom;renderModel()}
function renderModel(now){const m=S.model;stopIdle();tw.length=0;idle.length=0;const c=buildBq($('mdBq'),[],SEED,S.vase,now?0:100,null,m);lastMdC=c;if(now){for(const w of tw)w.fn(1,1);tw.length=0;aliveBq($('mdBq'),c)}else growBq($('mdBq'),c);
  $('mdS').textContent=`${stemsOf(m)} tiges · ${m.notes||''}`;$('mdP').textContent=eur(total());
  /* every element of the model under the player's hand: stems (− n +), place from 1 (back) to 10 (front), Échanger, Retirer */
  const box=$('mdEls'),sc=[1,2,3,4,5,6,7,8,9,10];box.innerHTML=m.els.map((e,i)=>{const p=prodFor(e.id,e.col);if(!p)return'';const n=Math.max(1,Math.round(e.n)),s=e.place||5;
    return`<div class="el hand" data-i="${i}"><svg viewBox="0 0 10 10" aria-hidden="true"></svg><div><b>${esc(p.n)}</b><small>${esc(p.cn)} · ${n} tige${n>1?'s':''} · ${eur(stemP(e.id)*n)}</small></div><button type="button" data-sw="${i}">Échanger</button><button type="button" data-mrm>Retirer</button>`+
      `<div class="ctl"><span class="qty"><button type="button" data-mq="-1" aria-label="Une tige de moins">−</button><b>${n}</b><button type="button" data-mq="1" aria-label="Une tige de plus">+</button></span>`+
      `<span class="pos" role="group" aria-label="Place dans le bouquet, de 1 (en arrière) à 10 (en avant)"><i>arrière</i>${sc.map(k=>`<button type="button" data-mps="${k}" class="${k===s?'on':''}" aria-label="Place ${k}">${k}</button>`).join('')}<i>avant</i></span></div></div>`}).join('');
  box.querySelectorAll('.el').forEach(el=>{const e=m.els[+el.dataset.i];thumb(el.querySelector('svg'),prodFor(e.id,e.col))})}
/* retired colourways (ret:1) stay resolvable but are no longer offered: the swap list skips them */
function swapSheet(i){const e=S.model.els[i],cur=prodFor(e.id,e.col),same=cur.info.k==='head'?['head']:null,L=PRODUCTS.filter(p=>!p.ret&&p.id!==cur.id&&(same?same.includes(p.info.k):p.info.k!=='head')&&(p.fam===cur.fam||p.info.form===cur.info.form)).slice(0,60);
  sheet(`<h2 class="h2">Remplacer ${esc(cur.n)}</h2><p class="bqstat">Même couleur ou même forme, pour garder l’équilibre du bouquet.</p><div class="fgrid" id="swG" style="padding:6px 0">${L.map(p=>cardHTML(p)).join('')}</div>`);
  const g=$('swG');g.querySelectorAll('.fcard').forEach(c=>IO.observe(c));g.onclick=ev=>{const c=ev.target.closest('.fcard');if(!c)return;const p=PBY[c.dataset.p];e.id=p.sid;e.col=p.col;closeSheet();renderModel();toast(`${cur.n} remplacée par ${p.n}`)}}
$('mdEls').onclick=e=>{const b=e.target.closest('[data-sw]');if(b){swapSheet(+b.dataset.sw);return}const el=e.target.closest('.el'),m=S.model;if(!el||!m)return;const i=+el.dataset.i,x=m.els[i];
  const q=e.target.closest('[data-mq]'),ps=e.target.closest('[data-mps]'),rm=e.target.closest('[data-mrm]');if(!x||!(q||ps||rm))return;m.hand=1;
  if(rm){if(m.els.length<=1){toast('Il faut garder au moins une fleur');return}m.els.splice(i,1)}else if(q)x.n=Math.max(1,Math.min(99,Math.round(x.n)+ +q.dataset.mq));else x.place=+ps.dataset.mps;
  renderModel(1)};
$('mdRe').onclick=()=>{SEED=1+Math.floor(Math.random()*1e5);renderModel()};
$('mdX').onclick=()=>{MD=0;stopIdle();$('md').classList.remove('on');$('mdBq').innerHTML=''};
$('mdGo').onclick=()=>{MD=0;$('md').classList.remove('on');openFlow()};
/* ---------- step by step ---------- */
const STEPS={composition:'La composition',contenant:'Le contenant',message:'Ton petit mot',confettis:'Les confettis',papillons:'Les papillons',musique:'La musique',apercu:'Récapitulatif'};
let FS=[],FI=0;
function openFlow(){FS=(S.route==='model'?[]:['composition']).concat(['contenant','message','confettis','papillons','musique','apercu']);FI=0;FLOW=1;$('fl').classList.add('on');if(S.route==='compose')SEED=SEED||7;drawFlowBq();showStep()}
/* now: redrawn at once in its final state (a change of the player's hand), else it grows */
function drawFlowBq(now){stopIdle();tw.length=0;idle.length=0;$('flBq').style.background=bgCss(bgCol(S.bg));DEPTH_BG=bgCol(S.bg);const t0=now?0:100,c=S.route==='model'?buildBq($('flBq'),[],SEED,S.vase,t0,null,S.model):withOpt(()=>buildBq($('flBq'),expand(),SEED,S.vase,t0,S.occ,null));
  DEPTH_BG='#efe8de';if(now){for(const w of tw)w.fn(1,1);tw.length=0;aliveBq($('flBq'),c)}else growBq($('flBq'),c);return c}
function miniVessel(svg,id){const D0=GDEF;GDEF=E('defs',{},svg);try{miniV(svg,id)}finally{GDEF=D0}}
function miniV(svg,id){const v=VZ[id]||{};
  /* the vessel on its stand, framed on the vessel with a little of what it stands on */
  const sg=stage(svg,v),g=G(svg);vessel(g,id,0,{noPlinth:1,shClip:sg.top});if(v.kind==='kenzan')stemsBelow(g,7,id);
  let b=null;try{b=g.getBBox()}catch(_){}if(!b||!b.width)b={x:VX-60,y:FL-120,width:120,height:120};const s=Math.max(b.width,b.height)*1.22+8,cx=b.x+b.width/2,cy=b.y+b.height/2+s*.07;
  svg.setAttribute('viewBox',`${f(cx-s/2)} ${f(cy-s/2)} ${f(s)} ${f(s)}`)}
const SUGG=['Joyeux anniversaire !','Je pense fort à toi','Merci pour tout','Bravo, tu le mérites !','Je t’aime'];
function showStep(){const k=FS[FI],b=$('flBody');$('flT').textContent=STEPS[k];$('flN').textContent=`Étape ${FI+1} sur ${FS.length}`;$('flSteps').innerHTML=FS.map((_,i)=>`<i class="${i<=FI?'on':''}"></i>`).join('');
  $('flBack').textContent=FI?'Retour':'Fermer';$('flNL').textContent=FI===FS.length-1?'Voir l’aperçu':'Suivant';$('flP').textContent=eur(total());
  if(k==='composition'){b.innerHTML=`<p class="bqstat" id="fcS"></p><div class="occs" id="fOcc">${Object.entries(OCCS).map(([o,v])=>`<button class="oc${S.occ===o?' on':''}" data-o="${o}" type="button">${v.n}</button>`).join('')}</div>
      <ul class="why" id="fWhy"></ul><div class="row" style="margin-top:10px"><button class="btn2" id="fRe" type="button">Une autre composition</button><button class="btn2" id="fAdd" type="button">Ajouter des fleurs</button></div><div class="els" id="fEls"></div>`;
    const els=$('fEls');renderEls(els);statLine();
    $('fOcc').onclick=e=>{const x=e.target.closest('.oc');if(!x)return;S.occ=x.dataset.o;SEED=1+Math.floor(Math.random()*1e5);drawFlowBq();showStep()};
    $('fRe').onclick=()=>{SEED=1+Math.floor(Math.random()*1e5);drawFlowBq();statLine()};$('fAdd').onclick=()=>{closeFlow();go('flowers')};
    els.onclick=e=>{const el=e.target.closest('.el'),rm=e.target.closest('[data-rm]'),q=e.target.closest('[data-q]'),ps=e.target.closest('[data-ps]');if(!el||!(rm||q||ps))return;const id=el.dataset.id;handFreeze();
      if(rm){S.cart.delete(id);S.qty.delete(id);S.pos.delete(id);S.prop.delete(id);update();if(!S.cart.size){closeFlow();go('flowers');return}drawFlowBq(1);renderEls(els)}
      else{if(q)S.qty.set(id,Math.max(1,Math.min(99,(S.qty.get(id)||1)+ +q.dataset.q)));else S.pos.set(id,+ps.dataset.ps);drawFlowBq(1);fillEls(els)}
      statLine();$('flP').textContent=eur(total());update()}}
  else if(k==='contenant'){const fam0=(VZ[S.vase]||{}).fam||'cylindre';
    b.innerHTML=`<div class="vfams" id="fVF" role="tablist">${VFAMS.map(([id,n])=>`<button class="oc${fam0===id?' on':''}" data-f="${id}" type="button" role="tab">${n}</button>`).join('')}</div><div class="vases" id="fV"></div><p class="vwhy" id="fVW"></p>`+
      `<p class="papl">Couleur du fond</p><div class="papers" id="fBg">${BGS.map(b=>`<button class="pap${S.bg===b.id?' on':''}" data-b="${b.id}" style="--pc:${b.c}" type="button" aria-label="Fond ${b.n}" title="${b.n}"></button>`).join('')}</div>`;
    const why=()=>{const v=VZ[S.vase]||{};$('fVW').textContent=v.why?`${v.n}, ${v.m}. ${v.why}`:''},
      fill=fam=>{$('fV').innerHTML=VASES.filter(v=>v.fam===fam).map(v=>`<button class="vase${S.vase===v.id?' on':''}" data-v="${v.id}" type="button"><svg viewBox="0 0 10 10" aria-hidden="true"></svg><b>${esc(v.n)}</b><small>${v.p?'+'+eur(v.p):'Inclus'}</small></button>`).join('');
        const L0=LOD;LOD=1;try{$('fV').querySelectorAll('.vase').forEach(x=>renderStatic(()=>miniVessel(x.querySelector('svg'),x.dataset.v)))}finally{LOD=L0}
        $('fVF').querySelectorAll('.oc').forEach(x=>x.classList.toggle('on',x.dataset.f===fam));$('fV').scrollLeft=0};
    fill(fam0);why();$('fVF').onclick=e=>{const x=e.target.closest('.oc');if(x)fill(x.dataset.f)};
    $('fV').onclick=e=>{const x=e.target.closest('.vase');if(!x)return;S.vase=x.dataset.v;drawFlowBq();$('flP').textContent=eur(total());why();
      $('fV').querySelectorAll('.vase').forEach(y=>y.classList.toggle('on',y===x))};
    $('fBg').onclick=e=>{const x=e.target.closest('.pap');if(!x)return;S.bg=x.dataset.b;$('fBg').querySelectorAll('.pap').forEach(y=>y.classList.toggle('on',y===x));$('flBq').style.background=bgCss(bgCol(S.bg))};}
  else if(k==='message'){b.innerHTML=`<label class="fld"><span>Pour</span><input id="to" maxlength="24" placeholder="Belai" autocomplete="off" value="${esc(S.to)}"></label><label class="fld"><span>De la part de</span><input id="from" maxlength="24" placeholder="Ton prénom" autocomplete="off" value="${esc(S.from)}"></label>
      <label class="fld"><span>Message</span><textarea id="msg" maxlength="240" rows="4" placeholder="Écris quelque chose de doux…">${esc(S.msg)}</textarea><small id="cnt">${S.msg.length}/240</small></label><div class="sugg" id="sugg">${SUGG.map(s=>`<button type="button">${s}</button>`).join('')}</div>`;
    $('to').oninput=e=>S.to=e.target.value.trim();$('from').oninput=e=>S.from=e.target.value.trim();$('msg').oninput=e=>{S.msg=e.target.value;$('cnt').textContent=e.target.value.length+'/240'};
    $('sugg').onclick=e=>{const x=e.target.closest('button');if(!x)return;const m=$('msg');m.value=(m.value.trim()?m.value.trim()+' ':'')+x.textContent;m.dispatchEvent(new Event('input'))}}
  else if(k==='confettis'||k==='papillons'){const L=k==='confettis'?CONFS:BFS,key=k==='confettis'?'conf':'bf';b.innerHTML=`<div class="opts" id="fO">${L.map(o=>`<button class="opt${S[key]===o.id?' on':''}" data-o="${o.id}" type="button"><b>${o.n}</b><small>${o.p?'+'+eur(o.p):'Offert'}</small>${optIcon(k,o.id)}</button>`).join('')}</div><div class="hz" id="fPv" style="position:relative;height:150px;margin-top:10px;border-radius:18px;background:rgba(255,255,255,.35)"></div>`;
    const pv=()=>{const box=$('fPv');if(!box)return;box.innerHTML='';if(k==='confettis')confetti(box,S.conf,18);else butterflies(box,bfKind(S.bf),box.clientWidth,150)};setTimeout(pv,60);
    $('fO').onclick=e=>{const x=e.target.closest('.opt');if(!x)return;S[key]=x.dataset.o;$('fO').querySelectorAll('.opt').forEach(y=>y.classList.toggle('on',y===x));$('flP').textContent=eur(total());pv()}}
  else if(k==='musique'){b.innerHTML=`<div class="music" id="fM">${MUS.map(m=>`<button class="mu${S.music===m.id?' on':''}" data-m="${m.id}" type="button"><b>${m.n}</b><small>${m.p?'+'+eur(m.p):'Offert'}</small>${m.id!=='none'?`<span class="play" data-play="${m.id}" title="Écouter">▶</span>`:''}</button>`).join('')}</div>`;
    $('fM').onclick=e=>{const pl=e.target.closest('[data-play]');if(pl){preview(pl.dataset.play);return}const x=e.target.closest('.mu');if(!x)return;S.music=x.dataset.m;$('fM').querySelectorAll('.mu').forEach(y=>y.classList.toggle('on',y===x));$('flP').textContent=eur(total())}}
  else{b.innerHTML=`<div class="sum">${sums()}</div><p class="bqstat">Le lien s’ouvre sur une enveloppe : le bouquet éclot, ${S.conf!=='aucun'?'les confettis tombent, ':''}${S.bf!=='aucun'?'les papillons s’envolent, ':''}puis ton mot apparaît.</p>`}}
function statLine(){const c=lastFlowC,el=$('fcS'),w=$('fWhy');if(el&&c)el.textContent=`${c.P.tot} tiges composées pour « ${OCCS[S.occ].n} »`;if(w&&c&&c.P.notes)w.innerHTML=c.P.notes.map(n=>`<li>${esc(n)}</li>`).join('')}
let lastFlowC=null;const _dfb=drawFlowBq;drawFlowBq=function(now){lastFlowC=_dfb(now);return lastFlowC};
/* the composition's elements: every variety, chosen or proposed, with its stems (− n +), its place from 1 (back) to 10 (front), and Retirer */
function elRows(){const P=lastFlowC&&lastFlowC.P;if(!P)return[];const L=expand().map(id=>({p:PBY[id],prop:S.prop.has(id)}));if(!S.adopt)for(const it of P.adds)L.push({p:it.p,prop:1,why:it.why});return L.filter(x=>x.p)}
function renderEls(box){const sc=[1,2,3,4,5,6,7,8,9,10];
  box.innerHTML=elRows().map(({p,prop,why})=>`<div class="el hand" data-id="${p.id}"><svg viewBox="0 0 10 10" aria-hidden="true"></svg><div><b>${esc(p.n)}${prop?'<span class="xtra">proposé</span>':''}</b><small data-sub="${esc(why||p.cn)}"></small></div><button type="button" data-rm>Retirer</button>`+
    `<div class="ctl"><span class="qty"><button type="button" data-q="-1" aria-label="Une tige de moins">−</button><b data-n></b><button type="button" data-q="1" aria-label="Une tige de plus">+</button></span>`+
    `<span class="pos" role="group" aria-label="Place dans le bouquet, de 1 (en arrière) à 10 (en avant)"><i>arrière</i>${sc.map(k=>`<button type="button" data-ps="${k}" aria-label="Place ${k}">${k}</button>`).join('')}<i>avant</i></span></div></div>`).join('');
  box.querySelectorAll('.el').forEach(el=>thumb(el.querySelector('svg'),PBY[el.dataset.id]));fillEls(box)}
function fillEls(box){const P=lastFlowC&&lastFlowC.P;if(!P)return;box.querySelectorAll('.el').forEach(el=>{const id=el.dataset.id,it=P.items.find(x=>x.p.id===id),n=it?P.cnt.get(it)||0:0,p=PBY[id],s=S.pos.get(id)||5,sub=el.querySelector('[data-sub]');
  el.querySelector('[data-n]').textContent=n;sub.textContent=`${sub.dataset.sub} · ${n} tige${n>1?'s':''} · ${eur(p.price*n)}`;el.querySelectorAll('[data-ps]').forEach(b=>b.classList.toggle('on',+b.dataset.ps===s))})}
/* the first touch takes the composer's proposals into the cart and holds every count as shown: from then on only the player's changes move it */
function handFreeze(){const P=lastFlowC&&lastFlowC.P;if(!P)return;for(const it of P.items)if(!S.qty.has(it.p.id))S.qty.set(it.p.id,P.cnt.get(it)||1);if(!S.adopt){for(const it of P.adds){S.cart.set(it.p.id,1);S.prop.add(it.p.id)}S.adopt=true}}
function closeFlow(){FLOW=0;stopIdle();$('fl').classList.remove('on');$('flBq').innerHTML='';stopMusic()}
$('flX').onclick=closeFlow;
$('flBack').onclick=()=>{if(FI){FI--;showStep()}else closeFlow()};
$('flNext').onclick=()=>{if(FS[FI]==='message'&&!S.to){toast('Indique le prénom de la personne');return}if(FI<FS.length-1){FI++;showStep()}else openOv('preview')};
function optIcon(k,id){if(id==='aucun')return'';if(k==='confettis')return`<svg class="pv" viewBox="0 0 58 44" aria-hidden="true">${id==='coeurs'?`<path d="${HPATH}" transform="translate(6 6) scale(.6)" fill="#a8324e"/><path d="${HPATH}" transform="translate(30 18) scale(.45)" fill="#e8b09a"/>`:id==='petales'?`<ellipse cx="18" cy="16" rx="9" ry="5" fill="#ecb6c0" transform="rotate(-30 18 16)"/><ellipse cx="38" cy="28" rx="8" ry="4.5" fill="#f2d0c8" transform="rotate(20 38 28)"/>`:`<path d="M18 6l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#c9a050"/><path d="M42 20l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5z" fill="#e0c070"/>`}</svg>`;
  return`<svg class="pv" viewBox="0 0 58 44" aria-hidden="true">${id==='un'?`<g transform="translate(29 22) scale(.42)">${bfArt('machaon')}</g>`:
    `<g transform="translate(14 26) scale(.26) rotate(-20)">${bfArt('paon')}</g><g transform="translate(31 15) scale(.3) rotate(10)">${bfArt('morpho')}</g><g transform="translate(46 30) scale(.24) rotate(25)">${bfArt('citron')}</g>`}</svg>`}
