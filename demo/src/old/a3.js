
/* ---------- bouquet view: occasion chips, composed stems per variety, vessels ---------- */
const TPLN={eventail:'en éventail',libre:'libre et aérienne',triangle:'en triangle',cascade:'en cascade',dome:'en dôme',vertical:'verticale',lcroissant:'en L'};
let lastSig='',lastC=null,HOME=0;
function stopIdle(){idleOn=false}
function stemsOf(c,id){return c?c.out.filter(o=>o.it&&o.it.p.id===id&&o.kind!=='garnish').length:0}
function enterBouquet(force){const ids=expand(),sig=ids.join()+'|'+S.seed+'|'+S.vase+'|'+S.occ;$('bqEmpty').hidden=ids.length>0;occPicker();vasePicker();sums();
  if(sig===lastSig&&!force){selList();if(!running&&!idleOn)startIdle();return}
  lastSig=sig;stopIdle();tw.length=0;idle.length=0;
  if(!ids.length){lastC=null;const s=$('bq');s.innerHTML='';renderStatic(()=>{plinth(s,(VZ[S.vase]||{}).pl);miniVessel(s,S.vase,1)});s.setAttribute('viewBox','290 640 420 420');selList();return}
  lastC=buildBq($('bq'),ids,S.seed,S.vase,100,S.occ);selList();play()}
function finished(){if(S.view==='bouquet'||OV||HOME)startIdle()}
function selList(){const c=lastC;$('sel').innerHTML=[...S.cart.keys()].map(id=>{const p=BYID[id],n=stemsOf(c,id);
  return`<button data-id="${id}" type="button" aria-label="Retirer ${esc(p.n)}"><i class="dot ${RAR[p.rar][1]}"></i>${esc(p.n)}${n?` <em>×${n}</em>`:''}<span aria-hidden="true">−</span></button>`}).join('');
  const st=$('bqStat'),O=OCCS[S.occ];if(!c){st.textContent='';return}
  const nT=c.out.filter(o=>o.kind==='head'||o.kind==='self'||o.kind==='drape').length,nG=c.out.filter(o=>o.kind==='garnish').length;
  st.textContent=`${nT} tiges composées ${TPLN[c.tk]} pour « ${O.n} »${nG?`, et ${nG} brin${nG>1?'s':''} de garniture offert${nG>1?'s':''}`:''}.`}
function dec(id){S.cart.delete(id)}
function occPicker(){$('occs').innerHTML=Object.entries(OCCS).map(([k,o])=>`<button class="oc${S.occ===k?' on':''}" data-o="${k}" type="button" role="tab" aria-selected="${S.occ===k}">${o.n}</button>`).join('')}
/* small vessel previews (hand-tied and paper drawn with a few stems) */
function miniVessel(svg,id,big){const v=VZ[id]||{};
  if(v.kind==='hand'||v.kind==='wrap'){const bp=[VX,830];if(v.kind==='wrap')wrapBack(svg,bp,v.paper);stemsBelow(svg,9,id);if(v.kind==='wrap'){wrapFront(svg,bp,v.paper);bow(svg,VX,860,v.rib,.4)}else bow(svg,VX,846,v.rib,.45);
    if(!big)svg.setAttribute('viewBox','380 700 240 290');return}
  if(v.kind==='kenzan'){vessel(svg,id,0,{noPlinth:1});stemsBelow(svg,7,id);bow(svg,VX,FL-vH(v),'#b98a4a',.2)}else vessel(svg,id,0,{noPlinth:1});
  if(!big)svg.setAttribute('viewBox',`${VX-118} ${FL-218} 236 236`)}
function vasePicker(){const w=$('vases');if(!w.dataset.ok){w.innerHTML=VASES.map(v=>`<button class="vase" data-v="${v.id}" type="button"><svg viewBox="0 0 10 10" aria-hidden="true"></svg><b>${v.n}</b><small>${v.p?'+'+eur(v.p):'Offert'}</small></button>`).join('');
  w.querySelectorAll('.vase').forEach(b=>renderStatic(()=>miniVessel(b.querySelector('svg'),b.dataset.v)));w.dataset.ok=1}
  w.querySelectorAll('.vase').forEach(b=>b.classList.toggle('on',b.dataset.v===S.vase))}
function lines(){const n=count(),v=VASES.find(x=>x.id===S.vase),m=MUS.find(x=>x.id===S.music),L=[[`${n} variété${n>1?'s':''} cueillie${n>1?'s':''}`,flowersCost()],['Composition, garniture et carte',n?BASE:0]];
  if(v.p)L.push([v.n,v.p]);if(m.p)L.push([`Musique · ${m.n}`,m.p]);return L}
function sums(){const t=total(),h=lines().map(([a,b])=>`<div><span>${a}</span><span>${eur(b)}</span></div>`).join('')+`<div class="t"><span>Total TTC</span><b>${eur(t)}</b></div>`+(rawTotal()>CAP?`<p class="warn">Plafond atteint : ton bouquet ne dépassera jamais ${eur(CAP)}, les variétés suivantes sont offertes</p>`:'')+(t&&t<MIN?`<p class="warn">Encore ${eur(MIN-t)} de fleurs pour pouvoir l'envoyer</p>`:'');
  $('sum').innerHTML=h;$('sum2').innerHTML=h;$('ctaT').textContent=eur(t);$('ctaT2').textContent=eur(t);$('toSend').disabled=$('toPrev').disabled=t<MIN}
function update(){const n=count();$('pillN').textContent=n;$('pillW').textContent=n>1?'variétés':'variété';$('pillT').textContent=eur(total());const b=$('badge');b.hidden=!n;b.textContent=n;sums();markPicked();if(S.view==='bouquet')enterBouquet()}
