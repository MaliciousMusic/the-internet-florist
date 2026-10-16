/* Local concept review: stable identifiers, saved choices and per-concept notes. */
'use strict';
const concepts = window.VASE_CONCEPTS;
const byId = new Map(concepts.map(concept => [concept.id, concept]));
const version = 'belai-vases-400-v1';
const storageKey = version;
const $ = id => document.getElementById(id);
let selected = new Set();
let notes = {};
let selectedOnly = false;
let page = 1;
let visible = [];
let detailId = null;
let saveTimer = null;
let revision = 0;
let serverMode = /^https?:$/.test(location.protocol);
let saving = false;
let saveAgain = false;
let savedRevision = 0;

const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function payload() {
  const ids = [...selected].sort();
  return { catalogueVersion: version, updatedAt: new Date().toISOString(), selectedIds: ids, notes,
    selected: ids.map(id => { const c = byId.get(id); return { id, name:c.name, family:c.family, material:c.material, shape:c.shape, style:c.style, file:c.file, brief:c.brief, note:notes[id] || '' }; }) };
}
function adopt(data) {
  if (data.catalogueVersion !== version) throw new Error('Cette sélection correspond à un autre catalogue.');
  if (!Array.isArray(data.selectedIds)) throw new Error('Liste des concepts absente.');
  if (data.selectedIds.some(id => !byId.has(id))) throw new Error('La sélection contient un numéro inconnu.');
  selected = new Set(data.selectedIds);
  notes = Object.fromEntries(Object.entries(data.notes || {}).filter(([id,value]) => byId.has(id) && typeof value === 'string').map(([id,value]) => [id,value.slice(0,2000)]));
}
function storeLocally(data) {
  try { localStorage.setItem(storageKey, JSON.stringify(data)); return true; }
  catch { $('save-state').textContent = 'Stockage local indisponible : utilise l’export.'; return false; }
}
async function saveServer() {
  if (!serverMode) return;
  if (saving) { saveAgain = true; return; }
  saving = true;
  const sentRevision = revision;
  try {
    const response = await fetch('api/selection', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload()) });
    if (!response.ok) throw new Error('Enregistrement refusé');
    savedRevision = sentRevision;
    $('save-state').textContent = sentRevision === revision ? 'Enregistré dans selection.json' : 'Enregistrement…';
  } catch {
    $('save-state').textContent = 'Copie locale gardée · sauvegarde du fichier à réessayer';
  } finally {
    saving = false;
    if (saveAgain || sentRevision !== revision) { saveAgain = false; await saveServer(); }
  }
}
function changed() {
  revision++;
  const stored = storeLocally(payload());
  updateSummary();
  clearTimeout(saveTimer);
  if (serverMode) { $('save-state').textContent = 'Enregistrement…'; saveTimer = setTimeout(saveServer,200); }
  else if (stored) $('save-state').textContent = 'Enregistré dans ce navigateur';
}
function updateSummary() {
  $('selected-count').textContent = selected.size;
  $('tab-count').textContent = selected.size;
}
function setSelected(id, checked) {
  if (checked) selected.add(id); else selected.delete(id);
  changed();
  if (selectedOnly) render();
  else {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) { card.classList.toggle('selected',checked); card.querySelector('input').checked=checked; }
  }
  if (detailId === id) $('detail-selected').checked = checked;
}
function filtered() {
  const search = normalize($('search').value.trim());
  return concepts.filter(c => (!selectedOnly || selected.has(c.id)) && (!$('family').value || c.family === $('family').value) && (!$('material').value || c.material === $('material').value) && (!$('style').value || c.style === $('style').value) && (!$('shape').value || c.shape === $('shape').value) && (!search || normalize([c.id,c.name,c.material,c.family,c.shape,c.style,c.foot,c.lip,c.references.join(' ')].join(' ')).includes(search)));
}
function card(concept) {
  const article = element('article', 'card'+(selected.has(concept.id)?' selected':''));
  article.dataset.id=concept.id;
  const top = element('div','card-top');
  top.append(element('span','card-number',concept.id));
  const label = element('label','pick');
  const checkbox = element('input'); checkbox.type='checkbox'; checkbox.checked=selected.has(concept.id); checkbox.setAttribute('aria-label',`Sélectionner ${concept.id} ${concept.name}`);
  checkbox.addEventListener('change',()=>setSelected(concept.id,checkbox.checked));
  label.append(checkbox,document.createTextNode('À développer')); top.append(label);
  const sketch = element('button','sketch'); sketch.setAttribute('aria-label',`Agrandir ${concept.id}`);
  const image = element('img'); image.src=concept.file; image.alt=concept.name; image.loading='lazy'; image.width=300; image.height=400;
  sketch.append(image); sketch.addEventListener('click',()=>openDetail(concept.id));
  const copy = element('div','card-copy'); copy.append(element('span','family',concept.family),element('h3','',concept.name));
  const material = element('div','material-line'); const swatch=element('span','swatch'); swatch.style.background=concept.color; material.append(swatch,document.createTextNode(concept.material));
  copy.append(material,element('div','card-meta',concept.style+' · '+concept.lip.toLowerCase()));
  article.append(top,sketch,copy);
  if (notes[concept.id]) article.append(element('span','note-tag','Note'));
  return article;
}
function render() {
  visible = filtered();
  const size = Number($('page-size').value); const pages=Math.max(1,Math.ceil(visible.length/size));
  page=Math.max(1,Math.min(page,pages));
  const fragment=document.createDocumentFragment(); visible.slice((page-1)*size,page*size).forEach(c=>fragment.append(card(c)));
  $('grid').replaceChildren(fragment);
  $('empty').hidden=visible.length!==0;
  $('result-count').textContent=`${visible.length} piste${visible.length>1?'s':''}`;
  $('page-info').textContent=`Page ${page} / ${pages}`;
  $('previous').disabled=page===1; $('next').disabled=page===pages;
  $('select-results').disabled=visible.length===0; $('unselect-results').disabled=visible.length===0;
  $('all-view').setAttribute('aria-pressed',String(!selectedOnly)); $('selected-view').setAttribute('aria-pressed',String(selectedOnly));
  updateSummary();
}
function openDetail(id) {
  detailId=id; const c=byId.get(id);
  $('detail-img').src=c.file; $('detail-img').alt=c.name;
  $('detail-number').textContent=c.id+' · '+c.family; $('detail-title').textContent=c.name; $('detail-brief').textContent=c.brief;
  const specs=document.createDocumentFragment();
  for (const [key,value] of [['Matière',c.material],['Silhouette',c.shape],['Influence',c.style],['Époque',c.period],['Ouverture',c.lip],['Pied',c.foot],['Idées extraites','Références '+c.references.join(', ')]]) specs.append(element('dt','',key),element('dd','',value));
  $('detail-spec').replaceChildren(specs); $('detail-selected').checked=selected.has(id); $('detail-note').value=notes[id] || '';
  $('download-svg').href=c.file; $('download-svg').download=c.id+'.svg';
  if (!$('detail').open) $('detail').showModal();
}
function changeDetail(direction) {
  const list=visible.length?visible:concepts; const i=list.findIndex(c=>c.id===detailId);
  const next=(i+direction+list.length)%list.length; openDetail(list[next].id);
}
function downloadSelection() {
  const blob=new Blob([JSON.stringify(payload(),null,2)+'\n'],{type:'application/json'});
  const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='selection-vases.json'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
for (const [id,key] of [['family','family'],['material','material'],['style','style'],['shape','shape']]) {
  [...new Set(concepts.map(c=>c[key]))].sort((a,b)=>a.localeCompare(b,'fr')).forEach(value=>{ const option=element('option','',value); option.value=value; $(id).append(option); });
  $(id).addEventListener('change',()=>{page=1;render();});
}
$('search').addEventListener('input',()=>{page=1;render();});
$('page-size').addEventListener('change',()=>{page=1;render();});
$('all-view').addEventListener('click',()=>{selectedOnly=false;page=1;render();});
$('selected-view').addEventListener('click',()=>{selectedOnly=true;page=1;render();});
$('clear-filters').addEventListener('click',()=>{['search','family','material','style','shape'].forEach(id=>$(id).value='');page=1;render();});
$('select-results').addEventListener('click',()=>{visible.forEach(c=>selected.add(c.id));changed();render();});
$('unselect-results').addEventListener('click',()=>{visible.forEach(c=>selected.delete(c.id));changed();render();});
$('previous').addEventListener('click',()=>{page--;render();$('grid').scrollIntoView({block:'start'});});
$('next').addEventListener('click',()=>{page++;render();$('grid').scrollIntoView({block:'start'});});
$('export').addEventListener('click',downloadSelection);
$('close-detail').addEventListener('click',()=>{$('detail').close();render();});
$('detail').addEventListener('close',render);
$('detail-selected').addEventListener('change',()=>setSelected(detailId,$('detail-selected').checked));
$('detail-note').addEventListener('input',()=>{if ($('detail-note').value) notes[detailId]=$('detail-note').value; else delete notes[detailId];changed();});
$('detail-previous').addEventListener('click',()=>changeDetail(-1));
$('detail-next').addEventListener('click',()=>changeDetail(1));
$('close-vocabulary').addEventListener('click',()=>$('vocabulary').close());
$('show-vocabulary').addEventListener('click',async()=>{
  $('vocabulary').showModal();
  if ($('vocabulary-content').dataset.loaded) return;
  try {
    const references=window.VASE_REFERENCES || await (await fetch('extraction-116.json')).json();
    const table=element('table'); const head=element('tr'); ['N°','Matière lue','Influence','Époque / piste','Profil','Caractéristique'].forEach(text=>head.append(element('th','',text))); table.append(head);
    for (const r of references) { const row=element('tr'); [r.id,r.materials_reading,r.style_reading,r.period_reading,r.silhouette,r.technique].forEach(text=>row.append(element('td','',text)));table.append(row); }
    $('vocabulary-content').replaceChildren(table); $('vocabulary-content').dataset.loaded='1';
  } catch { $('vocabulary-content').textContent='Ouvre EXTRACTION.md pour lire les traits.'; }
});
$('import').addEventListener('change',async event=>{
  const file=event.target.files[0]; if (!file) return;
  try { if(file.size>500000) throw new Error('Fichier trop volumineux.'); adopt(JSON.parse(await file.text()));changed();render();$('storage-note').textContent='Sélection importée : '+selected.size+' concepts.'; }
  catch(error){$('storage-note').textContent=error.message;}
  event.target.value='';
});
window.addEventListener('pagehide',()=>{if(serverMode && revision>savedRevision){fetch('api/selection',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload()),keepalive:true}).catch(()=>{});}});

(async function initialize(){
  let local=null;
  try { local=JSON.parse(localStorage.getItem(storageKey)); if(local)adopt(local); } catch {}
  render();
  if(serverMode){
    try {
      const response=await fetch('api/selection'); if(!response.ok)throw new Error('Unavailable');
      const remote=await response.json();
      if(revision===0){
        if(local && Date.parse(local.updatedAt || '')>Date.parse(remote.updatedAt || '1970-01-01')){adopt(local);await saveServer();}
        else adopt(remote);
        storeLocally({...payload(),updatedAt:remote.updatedAt});render();
      }
      $('save-state').textContent='Enregistré dans selection.json';
      $('storage-note').textContent='Les cases et les notes sont enregistrées dans Vases/Concepts/selection.json. Codex pourra les lire pour le travail détaillé.';
    }catch{serverMode=false;$('save-state').textContent='Sauvegarde dans ce navigateur · export disponible';}
  }else $('save-state').textContent='Sauvegarde dans ce navigateur · export disponible';
})();
