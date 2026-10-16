/* Review is local to this gallery; catalogue approval and selections are untouched. */
'use strict';
const studies = window.VASE_STUDIES.samples;
const storageKey = 'belai-vases-16-'+window.VASE_STUDIES.version;
const labels = {pending:'À examiner',approved:'Matière validée',revise:'À reprendre'};
let reviews = {};
let current = 0;
let returnFocus;
let storageAvailable = true;
try { reviews = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { storageAvailable=false; }
if(!reviews || typeof reviews !== 'object' || Array.isArray(reviews)) reviews={};
const $ = id => document.getElementById(id);
const dialog = $('detail');
const escapeText = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function review(id) {
  const r=reviews[id];
  return {verdict:r&&labels[r.verdict]?r.verdict:'pending',note:r&&typeof r.note==='string'?r.note:''};
}
function render() {
  $('gallery').innerHTML = studies.map((s,i)=>`<article class="card" data-id="${s.id}"><div class="card-head"><div><p>${escapeText(s.material)} · ${s.id}</p><h2>${escapeText(s.name)}</h2></div><span class="number">${String(i+1).padStart(2,'0')}</span></div><div class="pair"><button class="stage" data-open="${i}" aria-label="Agrandir ${escapeText(s.name)}, avant et après"><span class="stage-label">Avant</span><img src="${s.before}" alt="${s.id}, concept validé" loading="lazy"><span class="expand" aria-hidden="true">⤢</span></button><button class="stage" data-open="${i}" aria-label="Agrandir la finition ${escapeText(s.name)}"><span class="stage-label">Après</span><img src="${s.after}" alt="${s.id}, ${escapeText(s.material)}, finition" loading="lazy"><span class="expand" aria-hidden="true">⤢</span></button></div><div class="card-foot"><p>${escapeText(s.notes)}</p><div class="card-actions"><button data-open="${i}">Examiner les détails ↗</button><span class="status ${review(s.id).verdict}" data-status="${s.id}">${labels[review(s.id).verdict]}</span></div></div></article>`).join('');
  updateProgress();
}
function updateProgress() {
  const approved=studies.filter(s=>review(s.id).verdict==='approved').length;
  const revised=studies.filter(s=>review(s.id).verdict==='revise').length;
  const pending=16-approved-revised;
  $('progress').textContent=`${approved} validée${approved>1?'s':''} · ${revised} à reprendre · ${pending} à examiner`;
}
function background(theme) {
  document.body.dataset.background=theme;
  document.querySelectorAll('[data-background]').forEach(button=>{
    const active=button.dataset.background===theme;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
}
function zoom(value) {
  value=Math.max(100,Math.min(350,Number(value)));
  $('zoom').value=value;$('zoom-value').textContent=`${value} %`;
  document.querySelectorAll('.zoom-canvas').forEach(canvas=>{canvas.style.width=`${value}%`;canvas.style.height=`${value}%`;});
}
function show(index, trigger) {
  current=(index+studies.length)%studies.length;
  const s=studies[current];
  $('detail-title').textContent=`${s.id} — ${s.name}`;
  $('detail-material').textContent=s.material;
  $('detail-notes').textContent=s.notes;
  const previous=$('before-source').value==='previous';
  $('detail-before').src=previous?s.previous:s.before;$('detail-before').alt=`${s.id}, ${previous?'reprise précédente':'concept validé'}`;
  $('detail-after').src=s.after;$('detail-after').alt=`${s.id}, après, ${s.material}`;
  $('position').textContent=`${current+1} / 16`;
  const r=review(s.id);$('verdict').value=r.verdict;$('note').value=r.note;
  $('saved').textContent=storageAvailable?'Conservé dans ce navigateur':'Stockage indisponible : exportez vos retours avant de fermer';
  $('saved').classList.toggle('error',!storageAvailable);
  zoom(100);
  for(const id of ['before-view','after-view']) {$(id).scrollTop=0;$(id).scrollLeft=0;}
  if(!dialog.open) {returnFocus=trigger;dialog.showModal();}
}
function save() {
  const id=studies[current].id;
  reviews[id]={verdict:$('verdict').value,note:$('note').value,updatedAt:new Date().toISOString()};
  try {localStorage.setItem(storageKey,JSON.stringify(reviews));storageAvailable=true;} catch {storageAvailable=false;}
  const status=document.querySelector(`[data-status="${id}"]`);
  status.textContent=labels[reviews[id].verdict];status.className=`status ${reviews[id].verdict}`;
  $('saved').textContent=storageAvailable?'Conservé dans ce navigateur':'Stockage indisponible : exportez vos retours avant de fermer';
  $('saved').classList.toggle('error',!storageAvailable);updateProgress();
}
document.addEventListener('click',event=>{
  const open=event.target.closest('[data-open]');if(open) show(Number(open.dataset.open),open);
  const bg=event.target.closest('[data-background]');if(bg) background(bg.dataset.background);
});
$('close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>returnFocus?.focus());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
$('previous').addEventListener('click',()=>show(current-1));$('next').addEventListener('click',()=>show(current+1));
$('zoom').addEventListener('input',event=>zoom(event.target.value));
$('zoom-in').addEventListener('click',()=>zoom(Number($('zoom').value)+25));
$('zoom-out').addEventListener('click',()=>zoom(Number($('zoom').value)-25));
$('verdict').addEventListener('change',save);$('note').addEventListener('input',save);
$('before-source').addEventListener('change',()=>show(current));
document.addEventListener('keydown',event=>{
  if(!dialog.open||['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName))return;
  if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
});
let synchronizing=false;
for(const [a,b] of [['before-view','after-view'],['after-view','before-view']]) {
  $(a).addEventListener('scroll',()=>{
    if(synchronizing)return;synchronizing=true;
    $(b).scrollTop=$(a).scrollTop;$(b).scrollLeft=$(a).scrollLeft;
    requestAnimationFrame(()=>synchronizing=false);
  });
}
$('export').addEventListener('click',()=>{
  const data={version:window.VASE_STUDIES.version,exportedAt:new Date().toISOString(),conceptsApproved:400,reviews:studies.map(s=>({id:s.id,material:s.material,afterSha256:s.afterSha256,...review(s.id)}))};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='retours-16-matieres.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();background('clair');
const requested=new URLSearchParams(location.search).get('vase');
const index=studies.findIndex(s=>s.id===requested);if(index>=0)show(index);
