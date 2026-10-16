/* ---------- vase review: every vessel of the engine with a model bouquet at the flowers' real size, its scale set live,
   numbered notes pinned on the drawing, validation and versions; the server (serveur.mjs) keeps the state and writes the requests ---------- */
;(()=>{
const $$=id=>document.getElementById(id);
const STATUS={'a-revoir':'À revoir','a-corriger':'À corriger','envoye':'Envoyé à Claude','valide':'Validé'};
const TYPES=['Forme','Matière','Couleur','Lumière / ombre','Bouche & tiges','Échelle','Autre'];
const LS=k=>{try{return localStorage.getItem('rv.'+k)}catch(e){return null}},LSset=(k,x)=>{try{localStorage.setItem('rv.'+k,x)}catch(e){}};
const api=async(method,url,body)=>{const r=await fetch(url,{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});
  const j=await r.json();if(!r.ok)throw new Error(j.error||r.status);return j};
const cm=x=>(Math.round(x*10)/10).toLocaleString('fr-FR');
const IDS=VZ0.map(v=>v.id);
let state=null,cur=LS('cur')&&VZ[LS('cur')]?LS('cur'):IDS[0],filter=LS('filter')||'tous',model=+(LS('model')||0),seed=23,alone=LS('alone')==='1',
  frame=null,hl=null,saveT=null,drawT=null;
if(!(model>=0&&model<MODELS.length))model=0;

const statusOf=f=>{if(f.valid&&f.valid.version===f.version)return'valide';
  if(f.notes.some(n=>n.status==='open')||(f.scale!=null&&!f.scaleSent))return'a-corriger';
  if(f.notes.some(n=>n.status==='sent')||(f.scale!=null&&f.scaleSent))return'envoye';return'a-revoir'};
const sheetOf=id=>state.vases[id];
/* a server answer updates the sheet in place, keeping the notes being edited here unless told otherwise (the note panels hold them) */
const merge=(id,sh,notes)=>{const f=state.vases[id];for(const k in sh)if(k!=='notes'||notes)f[k]=sh[k]};
/* the scale shown: the owner's when set, else the engine's */
const wantScale=id=>{const f=sheetOf(id);return f&&f.scale!=null?f.scale:(VZ[id].vs||1)};
/* every length of the vessel follows the scale wanted (vScaleBy, app/v1a.js); the drawn bodies follow v.vs through svgbT */
function applyScale(id){const v=VZ[id],k=wantScale(id),k0=v.vs||1;if(Math.abs(k-k0)<1e-9)return;vScaleBy(v,k/k0);v.vs=k}

/* ---------- the list ---------- */
function drawList(){const L=$$('list'),q=$$('q').value.trim().toLowerCase();L.innerHTML='';
  const counts={'a-revoir':0,'a-corriger':0,'envoye':0,'valide':0};for(const id of IDS)counts[statusOf(sheetOf(id))]++;
  const n=IDS.length;$$('bar').innerHTML=['valide','envoye','a-corriger','a-revoir'].map(k=>`<i class="st-${k}" style="width:${counts[k]/n*100}%"></i>`).join('');
  $$('prog').textContent=`${counts.valide} validés sur ${n} · ${counts['a-corriger']} à corriger · ${counts.envoye} envoyés · ${counts['a-revoir']} à revoir`;
  $$('filters').innerHTML=[['tous','Tous',n],...Object.keys(STATUS).map(k=>[k,STATUS[k],counts[k]])].map(([k,t,c])=>`<span class="chip${filter===k?' on':''}" data-f="${k}">${t} ${c}</span>`).join('');
  for(const id of IDS){const f=sheetOf(id),st=statusOf(f);if(filter!=='tous'&&st!==filter)continue;
    if(q&&!(id.includes(q)||(VZ[id].n||'').toLowerCase().includes(q)))continue;
    const open=f.notes.filter(x=>x.status!=='done').length,li=document.createElement('li');li.dataset.id=id;if(id===cur)li.className='cur';
    li.innerHTML=`<span class="dot st-${st}" title="${STATUS[st]}"></span><span class="nm">${VZ[id].n||id}<span class="id">${id}</span></span><span class="meta">v${f.version}${open?`<br>${open} note${open>1?'s':''}`:''}${f.scale!=null?'<br>échelle '+f.scale:''}</span>`;
    L.append(li)}
  const sc=L.querySelector('.cur');if(sc)sc.scrollIntoView({block:'nearest'});
  const pend=IDS.reduce((a,id)=>{const f=sheetOf(id);return a+f.notes.filter(x=>x.status==='open').length+(f.scale!=null&&!f.scaleSent?1:0)+(f.valid&&!f.validSent?1:0)},0);
  $$('sendn').textContent=pend;$$('send').disabled=!pend}

/* ---------- the drawing ---------- */
function ruler(g,v){const h=v.h,top=FL-h;let r=0;if(v.prof)for(const q of v.prof)r=Math.max(r,q[1]);if(v.ol)for(const q of v.ol.pts)r=Math.max(r,Math.abs(q[0]));if(v.box)r=Math.max(r,v.box.w/2);
  const x=VX-r-34,k=G(g,{'data-rv':'ruler','pointer-events':'none'});
  E('path',{d:`M${x},${FL}V${top}`,stroke:'#7a6a5c','stroke-width':1.2,fill:'none'},k);
  E('path',{d:`M${x-6},${top}H${VX+r+10}`,stroke:'#7a6a5c','stroke-width':.8,'stroke-dasharray':'4 4',fill:'none',opacity:.6},k);
  for(let c=0;c*UPC<=h+.01;c++){const y=FL-c*UPC,big=c%5===0;E('path',{d:`M${x-(big?9:5)},${y}H${x}`,stroke:'#7a6a5c','stroke-width':big?1.1:.7},k);
    if(c%10===0&&c)E('text',{x:x-12,y:y+4,'text-anchor':'end','font-size':11,fill:'#7a6a5c','font-family':'system-ui,sans-serif'},k).textContent=c+' cm'}
  E('text',{x:x-12,y:top-6,'text-anchor':'end','font-size':12,'font-weight':600,fill:'#5a4a3e','font-family':'system-ui,sans-serif'},k).textContent=cm(h/UPC)+' cm'}
function pins(svg,id){const old=svg.querySelector('g[data-rv=pins]');if(old)old.remove();const v=VZ[id],g=G(svg,{'data-rv':'pins'}),z=frame?frame[2]/900:1;
  for(const n of sheetOf(id).notes){if(n.u==null)continue;const X=VX+n.u*v.h,Y=FL-n.w*v.h,c=n.status==='done'?'#3f8a4f':n.status==='sent'?'#6a5bb5':'#d2452f',p=G(g,{'data-num':n.num,style:'cursor:pointer'});
    E('circle',{cx:X,cy:Y,r:11*z,fill:c,stroke:'#fff','stroke-width':2.2*z,opacity:n.status==='done'?.6:1},p);
    if(hl===n.num)E('circle',{cx:X,cy:Y,r:17*z,fill:'none',stroke:c,'stroke-width':2*z},p);
    E('text',{x:X,y:Y+4.2*z,'text-anchor':'middle','font-size':12*z,'font-weight':700,fill:'#fff','font-family':'system-ui,sans-serif'},p).textContent=n.num}}
/* draws vessel id (with the chosen model bouquet unless "vase seul") into a fresh svg of host; keep: the frame only grows while the
   same vessel is resized, so its change of size against the flowers reads at once */
function drawInto(host,id,keep){applyScale(id);if(typeof aliveStopAll==='function')aliveStopAll();
  for(const s of host.querySelectorAll('svg.view'))s.remove();
  const s=E('svg',{class:'view'},host),v=VZ[id];
  renderStatic(()=>{if(alone){GDEF=E('defs',{},s);const sg=stage(s,v),g=G(s);vessel(g,id,0,{noPlinth:1,shClip:sg.top});if(v.kind==='kenzan')stemsBelow(g,7,id);GDEF=null}
    else{const m=JSON.parse(JSON.stringify(MODELS[model]));m.vase=id;buildBq(s,[],seed,id,0,null,m)}});
  for(const w of tw)w.fn(1,1);tw.length=0;
  ruler(s,v);
  const bb=s.getBBox(),pad=Math.max(bb.width,bb.height)*.05,F=[bb.x-pad,bb.y-pad,bb.width+2*pad,bb.height+2*pad];
  if(keep&&frame){const x0=Math.min(frame[0],F[0]),y0=Math.min(frame[1],F[1]),x1=Math.max(frame[0]+frame[2],F[0]+F[2]),y1=Math.max(frame[1]+frame[3],F[1]+F[3]);frame=[x0,y0,x1-x0,y1-y0]}else frame=F;
  s.setAttribute('viewBox',frame.join(' '));s.setAttribute('preserveAspectRatio','xMidYMid meet');
  pins(s,id);return s}
function draw(keep){const busy=$$('busy');busy.hidden=false;busy.textContent='Dessin…';clearTimeout(drawT);
  drawT=setTimeout(()=>{try{const s=drawInto($$('stage'),cur,keep);s.addEventListener('click',onClick)}catch(e){console.error(e);busy.textContent='Erreur de dessin : '+e.message;return}busy.hidden=true},keep?30:10)}

/* ---------- a click on the drawing: a new note there (or the note of the pin hit) ---------- */
function onClick(ev){const s=ev.currentTarget,pin=ev.target.closest&&ev.target.closest('g[data-num]');
  if(pin){hl=+pin.dataset.num;pins(s,cur);drawSide();const el=document.querySelector(`.note[data-num="${hl}"] textarea`);if(el)el.focus();return}
  const pt=s.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(s.getScreenCTM().inverse()),v=VZ[cur],f=sheetOf(cur);
  const num=f.notes.reduce((a,n)=>Math.max(a,n.num),0)+1;
  f.notes.push({num,u:(q.x-VX)/v.h,w:(FL-q.y)/v.h,text:'',type:'',status:'open',date:new Date().toISOString(),scale:v.vs||1});
  hl=num;pins(s,cur);drawSide();saveNotes();drawList();const el=document.querySelector(`.note[data-num="${num}"] textarea`);if(el)el.focus()}

/* ---------- the side panel ---------- */
function drawSide(){applyScale(cur);const v=VZ[cur],f=sheetOf(cur),st=statusOf(f),k=wantScale(cur),eng=f.engineScale||1;
  $$('vt').textContent=`${v.n||cur} · v${f.version}`;const p=$$('vs');p.textContent=STATUS[st];p.className='pill st-'+st;
  $$('sr').value=k;$$('sn').value=k;$$('seng').textContent=f.scale!=null?`moteur : ${eng}`:'échelle du moteur';$$('sreset').disabled=f.scale==null;
  let r=0;if(v.prof)for(const q of v.prof)r=Math.max(r,q[1]);
  $$('dims').innerHTML=`<span>Hauteur</span><b>${cm(v.h/UPC)} cm</b><span>Bouche</span><b>${cm(2*(v.mo||0)/UPC)} cm</b><span>Plus large</span><b>${cm(2*r/UPC)} cm</b>`+
    `<span>Matière</span><span>${v.m||'—'}</span><span>Identifiant</span><span>${cur}</span>`;
  const N=$$('notes');N.innerHTML='';const list=[...f.notes].sort((a,b)=>(a.status==='done')-(b.status==='done')||a.num-b.num);
  if(!list.length)N.innerHTML='<p class="empty">Aucune note pour ce vase.</p>';
  for(const n of list){const d=document.createElement('div');d.className='note'+(n.status==='sent'?' sent':n.status==='done'?' done':'')+(hl===n.num?' hl':'');d.dataset.num=n.num;
    const tag=n.status==='open'?'brouillon, pas encore envoyée':n.status==='sent'?'envoyée, en attente de Claude':`traitée en v${n.doneIn}`;
    if(n.status==='open'){d.innerHTML=`<div class="top"><span class="num">${n.num}</span><span>${tag}</span><button class="x" title="Supprimer la note">×</button></div>
      <textarea placeholder="Ce qui ne va pas, ce qu'il faut corriger…"></textarea><div class="types">${TYPES.map(t=>`<span class="chip${n.type===t?' on':''}">${t}</span>`).join('')}</div>`;
      const ta=d.querySelector('textarea');ta.value=n.text;ta.addEventListener('input',()=>{n.text=ta.value;saveNotes()});
      ta.addEventListener('focus',()=>{if(hl!==n.num){hl=n.num;pinsNow();for(const o of N.children)o.classList.toggle('hl',+o.dataset.num===hl)}});
      d.querySelector('.x').onclick=()=>{f.notes=f.notes.filter(o=>o!==n);if(hl===n.num)hl=null;saveNotes(true);drawSide();pinsNow();drawList()};
      for(const c of d.querySelectorAll('.types .chip'))c.onclick=()=>{n.type=n.type===c.textContent?'':c.textContent;saveNotes(true);drawSide();const t=document.querySelector(`.note[data-num="${n.num}"] textarea`);if(t){t.focus();t.selectionStart=t.selectionEnd=t.value.length}}}
    else{d.innerHTML=`<div class="top"><span class="num">${n.num}</span><span>${tag}${n.type?' · '+n.type:''}</span></div><p></p>`+(n.status==='done'?'<div class="row"><button class="re">Pas corrigé : rouvrir</button></div>':'');
      d.querySelector('p').textContent=n.text||'(sans texte)';const re=d.querySelector('.re');
      if(re)re.onclick=async()=>{const r=await api('PUT','/api/vase/'+cur,{reopen:n.num});merge(cur,r.sheet,true);drawSide();pinsNow();drawList()}}
    N.append(d)}
  const ok=st==='valide';$$('valid').textContent=ok?'Retirer la validation':'Valider ce vase';$$('valid').className=ok?'':'ok';
  $$('vinfo').textContent=ok?`validé en v${f.valid.version}`:f.notes.some(n=>n.status!=='done')?'des notes restent ouvertes':'';
  $$('hist').innerHTML=[...f.history].reverse().map(h=>`<div><b>v${h.version}</b> · ${new Date(h.date).toLocaleDateString('fr-FR')}${h.commit?' · '+h.commit:''}<br>${esc(h.summary)}${h.notes&&h.notes.length?`<br><span class="small">notes ${h.notes.join(', ')}</span>`:''}</div>`).join('')+
    '<div><b>v1</b> · version de départ de la revue</div>'}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pinsNow=()=>{const s=$$('stage').querySelector('svg.view');if(s)pins(s,cur)};
function saveNotes(now){clearTimeout(saveT);const id=cur,go=async()=>{const f=sheetOf(id);const r=await api('PUT','/api/vase/'+id,{notes:f.notes.filter(n=>n.status==='open')});
  merge(id,r.sheet);if(id===cur){const p=$$('vs'),st=r.status;p.textContent=STATUS[st];p.className='pill st-'+st}drawList()};
  if(now)go();else saveT=setTimeout(go,500)}

/* ---------- scale ---------- */
let scaleT=null;
function setScale(k,fromRange){k=Math.max(.2,Math.min(4,Math.round(k*100)/100));if(!isFinite(k))return;const f=sheetOf(cur),eng=f.engineScale||1;
  f.scale=Math.abs(k-eng)<1e-6?null:k;f.scaleSent=false;if(fromRange)$$('sn').value=k;else $$('sr').value=k;draw(true);drawSide();
  clearTimeout(scaleT);scaleT=setTimeout(async()=>{const r=await api('PUT','/api/vase/'+cur,{scale:k});merge(cur,r.sheet);drawList()},400)}
$$('sr').addEventListener('input',e=>setScale(+e.target.value,true));
$$('sn').addEventListener('change',e=>setScale(+e.target.value,false));
$$('sreset').onclick=()=>setScale(sheetOf(cur).engineScale||1,false);

/* ---------- navigation ---------- */
function select(id){if(!VZ[id])return;cur=id;LSset('cur',id);hl=null;frame=null;drawList();drawSide();draw(false)}
$$('list').addEventListener('click',e=>{const li=e.target.closest('li');if(li)select(li.dataset.id)});
$$('filters').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c)return;filter=c.dataset.f;LSset('filter',filter);drawList()});
$$('q').addEventListener('input',drawList);
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;e.preventDefault();const vis=[...$$('list').children].map(li=>li.dataset.id),i=vis.indexOf(cur);
  const j=i<0?0:Math.max(0,Math.min(vis.length-1,i+(e.key==='ArrowDown'?1:-1)));if(vis[j]&&vis[j]!==cur)select(vis[j])});
const M=$$('model');M.innerHTML=MODELS.map((m,i)=>`<option value="${i}">${m.n}. ${esc(m.nom)}</option>`).join('');M.value=model;
M.onchange=()=>{model=+M.value;LSset('model',model);alone=false;LSset('alone','0');$$('alone').classList.remove('primary');frame=null;draw(false)};
$$('reseed').onclick=()=>{seed=1+Math.floor(Math.random()*9999);frame=null;draw(false)};
$$('alone').onclick=()=>{alone=!alone;LSset('alone',alone?'1':'0');$$('alone').classList.toggle('primary',alone);frame=null;draw(false)};
if(alone)$$('alone').classList.add('primary');
$$('valid').onclick=async()=>{const f=sheetOf(cur),ok=statusOf(f)==='valide';
  if(!ok&&f.notes.some(n=>n.status==='open'||n.status==='sent')&&!confirm('Des notes de ce vase ne sont pas encore traitées. Le valider quand même ?'))return;
  const r=await api('PUT','/api/vase/'+cur,{valid:!ok});merge(cur,r.sheet);drawSide();drawList()};

/* ---------- sending: a view of every vase with new notes (its pins on it), then the request ---------- */
function shot(svg){return new Promise(res=>{try{const c=svg.cloneNode(true),vb=svg.viewBox.baseVal,W=1100,H=Math.round(W*vb.height/vb.width);
    c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.setAttribute('width',W);c.setAttribute('height',H);c.removeAttribute('class');
    const d=document.createElementNS(NS,'defs');d.innerHTML=$$('defs').innerHTML;c.insertBefore(d,c.firstChild);
    const bg=document.createElementNS(NS,'rect');for(const[k,x]of Object.entries({x:vb.x,y:vb.y,width:vb.width,height:vb.height,fill:'#f3eee7'}))bg.setAttribute(k,x);c.insertBefore(bg,d.nextSibling);
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(c)],{type:'image/svg+xml'})),im=new Image();
    im.onload=()=>{const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').drawImage(im,0,0,W,H);URL.revokeObjectURL(url);res(cv.toDataURL('image/png'))};
    im.onerror=()=>{URL.revokeObjectURL(url);res(null)};im.src=url}catch(e){console.error(e);res(null)}})}
$$('send').onclick=async()=>{const busy=$$('busy'),todo=IDS.filter(id=>sheetOf(id).notes.some(n=>n.status==='open')),images={};
  busy.hidden=false;const host=$$('stage'),keep=cur;
  try{for(const [i,id] of todo.entries()){busy.textContent=`Vues annotées : ${i+1} / ${todo.length}…`;await new Promise(r=>setTimeout(r,20));
      frame=null;const s=drawInto(host,id,false);images[id]=await shot(s)}
    busy.textContent='Envoi…';const r=await api('POST','/api/envoyer',{images});
    state=await api('GET','/api/etat');
    if(r.empty){alert('Rien de nouveau à envoyer.')}
    else{$$('dlgs').textContent=`Écrit dans ${r.file}. Si la session de Claude qui surveille la revue est ouverte, elle reçoit l'envoi tout de suite ; sinon, colle-lui ce message.`;
      $$('dlgm').textContent=r.message;$$('dlg').showModal()}}
  catch(e){alert('Envoi impossible : '+e.message)}
  finally{cur=keep;frame=null;drawList();drawSide();draw(false)}};
$$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($$('dlgm').textContent);$$('copy').textContent='Copié ✓'}catch(e){$$('copy').textContent='Copie impossible'}setTimeout(()=>$$('copy').textContent='Copier le message',1600)};
$$('close').onclick=()=>$$('dlg').close();
/* for Claude's checks from another tab: draw a vessel off screen, frame a region, save the view (never touches the review state) */
window.RV={drawInto,shot,async view(id,name,box,o={}){const h=document.createElement('div');h.style.cssText='position:fixed;left:-3000px;top:0;width:1000px;height:1000px';document.body.append(h);
  const a0=alone;if(o.alone!=null)alone=o.alone;try{frame=null;const s=drawInto(h,id,false);if(box)s.setAttribute('viewBox',box.join(' '));const png=await shot(s);return await api('POST','/api/apercu',{name,png})}finally{alone=a0;h.remove();frame=null}}};

/* ---------- start: declare the engine's vessels, then show the last one seen ---------- */
(async()=>{try{state=await api('POST','/api/inventaire',{vases:VZ0.map(v=>({id:v.id,name:v.n||v.id,scale:v.vs||1,heightCm:Math.round(v.h/UPC*10)/10}))})}
  catch(e){$$('busy').textContent='Serveur de la revue injoignable : '+e.message;return}
  drawList();drawSide();draw(false)})();
})();
