import {VERSION,DAY,createProfile,anniversary,freezeRecipe,type Stem} from './model.ts';
import {SignatureScore} from './signature-score.ts';
import {SIGNATURE_STYLES,SIGNATURE_SOUNDS,signatureForSKU,signatureSound,nearestEdges,freezeEdges,mergeEdges,type Edge} from './signature.ts';
import {EnsemblePlayer} from './ensemble-player.ts';
import {compositionHash,compositionBytes,freezeComposition,type Composition} from './composition-identity.ts';
import {noteName,hzForMidi} from './connected-score.ts';
import {validateOffers,type StemOffer,type StemSource,type StemMarket} from './stem-market.ts';

interface Flower {key:string;sku:number;referenceKey:string;name:string;colour:string;colourName:string;x:number;y:number;z:number;side?:number;depth?:number;number?:number;customColour?:boolean}
interface Snapshot {key:string;seed:number;vase:string;locked:boolean;container:HTMLElement;bandContainer:HTMLElement|null;step:string;flowers:Flower[];drawing:Readonly<Record<string,unknown>>;saved?:{composition:Composition;hash:string}}
interface Host {catalogue:readonly {sku:number;name:string;colour:string;colourName:string}[];snapshot():Snapshot|null;move(key:string,side:number,depth:number):void;highlight(key:string):void;portrait(key:string,svg:SVGSVGElement):void;remove(key:string):boolean;add(reference:string,id:string,seed:number,sku:number):string|null;replace(key:string,id:string,seed:number,sku:number):string|null;setMusic(value:{composition:Composition;hash:string}):void}
declare global {interface Window {BelaiHost:Host;BelaiStemMarket?:StemMarket}}
declare const __DRAWING_HASH__:string;
declare const __MUSIC_HASH__:string;
declare const __ASSET_BASE__:string;
const host=window.BelaiHost,ns='http://www.w3.org/2000/svg';
const references=new Map(host.catalogue.map(p=>[p.sku,p]));
interface Draft {stems:Map<string,Stem>;pending:Set<string>;edges:readonly Edge[];wires:readonly Edge[];numbers:Map<string,number>;nextNumber:number;groups:Map<string,Flower>;origins:Map<string,StemSource>;origin:number;seed:string;initialized:boolean}
const drafts=new Map<string,Draft>(),demoOffers=new Map<string,StemOffer[]>(),knownOffers=new Map<string,StemOffer>();
const folds=new Map<string,{open:boolean;source:Exclude<StemSource,'preview'>}>();
let snapshot:Snapshot|null=null,composition:Composition|undefined,score:SignatureScore|undefined,selected='',linking=false,playing=false,revision=0,status='Écoute la musique de ton bouquet.';
let linkSource='',graphMessage='',volume=.65,edgeUndo:{key:string;edges:readonly Edge[]}|undefined;
const clamp=(n:number,limit=1)=>Math.max(-limit,Math.min(limit,n));
const placement=(f:Flower)=>({side:clamp(f.side??f.x),depth:clamp(f.depth??f.z,.8)});
const graphPoint=(side:number,depth:number)=>({x:220+side*185,y:145+depth*120});
const numberOf=(key:string)=>snapshot?.flowers.find(f=>f.key===key)?.number??0;
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const randomSeed=()=>`0x${Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('')}`;
const panel=()=>document.getElementById('belai-links');
const asset=(name:string)=>__ASSET_BASE__+name;
const player=new EnsemblePlayer({workletUrl:asset('worklet.js'),compositionWorkerUrl:asset('live-worker.js'),assetBaseUrl:__ASSET_BASE__,onState:(state,message)=>{
  playing=state==='playing'||state==='buffering';
  status=({preparing:'Les fleurs préparent leurs voix…',buffering:'La suite se prépare…',playing:'Le bouquet joue.',stopped:'L’écoute est arrêtée.',interrupted:'Appuie sur Écouter pour reprendre au présent.',error:message||'L’écoute n’a pas pu démarrer.'})[state];
  const el=panel()?.querySelector('[data-status]');if(el)el.textContent=status;
}});
function makeStem(flower:Flower,ageDays=45):Stem {
  const seed=randomSeed(),gene=signatureForSKU(flower.sku),style=SIGNATURE_STYLES.find(s=>s.id===gene.style)!;
  const profile={...createProfile(seed),timbre:style.palette[Number(BigInt(seed)%BigInt(style.palette.length))]!};
  const issuedAt=Math.floor(Date.now()/1000-ageDays*DAY);
  return {id:BigInt(seed).toString(),sku:flower.sku,issuedAt,expiresAt:anniversary(issuedAt),opening:{from:issuedAt,until:issuedAt+18*DAY,opens:true},position:{x:flower.x,y:flower.y,z:flower.z},profile};
}
function synchronize():void {
  const next=host.snapshot();if(!next||!next.flowers.length)return;
  if(next.key!==snapshot?.key){linking=false;linkSource='';graphMessage='';edgeUndo=undefined;}
  snapshot=next;
  if(next.locked&&next.saved){
    try{composition=freezeComposition(next.saved.composition);if(composition.musicSha256!==__MUSIC_HASH__||composition.drawingSha256!==__DRAWING_HASH__)throw new Error('Engine mismatch');}
    catch{status='Ce bouquet utilise une autre version du moteur.';composition=undefined;return;}
    const numbers=new Map((composition.drawing?.flowerNumbers??[]) as Array<[string,number]>);
    next.flowers.forEach((f,i)=>{f.number=numbers.get(f.key)??i+1;});next.flowers.sort((a,b)=>a.number!-b.number!);
  }else{
    let draft=drafts.get(next.key);if(!draft){draft={stems:new Map(),pending:new Set(),edges:[],wires:[],numbers:new Map(),nextNumber:1,groups:new Map(),origins:new Map(),origin:Math.floor(Date.now()/1000)-45*DAY,seed:randomSeed(),initialized:false};drafts.set(next.key,draft);}
    const aliveKeys=new Set(next.flowers.map(f=>f.key));for(const key of draft.stems.keys())if(!aliveKeys.has(key))draft.stems.delete(key);
    const newIds=new Set<string>(draft.pending);draft.pending.clear();
    for(const flower of next.flowers){let stem=draft.stems.get(flower.key);if(!stem){stem=makeStem(flower);newIds.add(stem.id);draft.origins.set(stem.id,'preview');}
      if(!knownOffers.has(stem.id))knownOffers.set(stem.id,{source:draft.origins.get(stem.id)??'preview',stem});
      if(!draft.numbers.has(flower.key))draft.numbers.set(flower.key,draft.nextNumber++);flower.number=draft.numbers.get(flower.key)!;
      if(!draft.groups.has(flower.referenceKey))draft.groups.set(flower.referenceKey,flower);
      draft.stems.set(flower.key,{...stem,position:{x:flower.x,y:flower.y,z:flower.z}});
    }
    // Packing order can change after a move; keep each visible number attached to its exemplar.
    next.flowers.sort((a,b)=>a.number!-b.number!);
    const recipe=freezeRecipe({version:VERSION,seed:draft.seed,originAt:draft.origin,harmony:'clear',stems:[...draft.stems.values()]});
    const ids=new Set(recipe.stems.map(s=>s.id));
    draft.edges=draft.edges.filter(e=>ids.has(e.a)&&ids.has(e.b));
    draft.wires=draft.wires.filter(e=>ids.has(e.a)&&ids.has(e.b));
    const automatic=nearestEdges(recipe);
    if(!draft.initialized){draft.edges=automatic;draft.initialized=true;}
    else if(newIds.size)draft.edges=mergeEdges(recipe,draft.edges,automatic.filter(e=>newIds.has(e.a)||newIds.has(e.b)));
    draft.wires=mergeEdges(recipe,draft.wires,draft.edges);
    composition=freezeComposition({version:'belai-composition/1',recipe,edges:draft.edges,vaseId:next.vase,drawingSha256:__DRAWING_HASH__,musicSha256:__MUSIC_HASH__,drawing:next.drawing});
  }
  score=new SignatureScore(composition.recipe,composition.edges);
  if(!selected||!next.flowers.some(f=>f.key===selected))selected=next.flowers[0]!.key;
  render();publish();
}
function stemFor(key:string):Stem|undefined {
  if(!snapshot||!composition)return;
  const draft=drafts.get(snapshot.key);if(draft)return draft.stems.get(key);
  // Stored recipes are sorted by exemplar identity; retain the drawing-key association.
  const keys=(composition.drawing?.flowerIds??[]) as Array<[string,string]>;
  const id=keys.find(pair=>pair[0]===key)?.[1];return composition.recipe.stems.find(s=>s.id===id);
}
function publish():void {
  if(!snapshot||!composition||snapshot.locked)return;
  const draft=drafts.get(snapshot.key)!;
  const next=freezeComposition({...composition,drawing:{...snapshot.drawing,flowerIds:snapshot.flowers.map(f=>[f.key,stemFor(f.key)!.id]),flowerNumbers:[...draft.numbers],wires:draft.wires,origins:[...draft.origins]}});
  composition=next;const version=++revision;
  void compositionHash(next).then(hash=>{if(version!==revision)return;host.setMusic({composition:next,hash});const el=panel()?.querySelector('[data-hash]');if(el)el.textContent=`Signature ${hash.slice(0,18)}…`;});
}
function render():void {
  if(!snapshot||!score||!composition)return;
  // The established composition and music steps own the new tool.
  if(!['composition','musique','model'].includes(snapshot.step)&&!snapshot.locked){panel()?.remove();return;}
  let box=panel();const open=box?.querySelector('details')?.open??snapshot.step==='musique';
  const focused=(document.activeElement as HTMLElement|null)?.closest<SVGGElement>('g[data-key]')?.dataset.key;
  if(!box){box=document.createElement('section');box.id='belai-links';}
  snapshot.container.insertBefore(box,snapshot.container.querySelector('.els'));
  box.innerHTML=`<details ${open?'open':''}><summary>Les liens du bouquet <small>${snapshot.flowers.length} tiges · ${composition.edges.length} liens</small></summary>
    <p class="bqstat">Glisse une tige pour retoucher sa place. Les autres fleurs restent en place.</p>
    <div class="row belai-modes" role="group" aria-label="Outil des liens"><button class="btn2" data-move aria-pressed="${!linking}" ${snapshot.locked?'disabled':''}>Déplacer</button><button class="btn2" data-link aria-pressed="${linking}" ${snapshot.locked?'disabled':''}>Relier</button><button class="btn2" data-undo ${!edgeUndo||snapshot.locked?'disabled':''}>Annuler le dernier lien modifié</button></div>
    <p class="bqstat belai-hint" data-hint role="status" aria-live="polite"></p>
    <div class="belai-plane"><span class="belai-back">Arrière</span><span class="belai-left">Gauche</span><svg viewBox="0 0 440 290" role="group" aria-label="Liens du bouquet, gauche à droite et arrière à avant"></svg><span class="belai-right">Droite</span><span class="belai-front">Avant</span></div>
    <small class="belai-position" data-position></small>
    <p class="bqstat" data-flower></p><p class="bqstat" data-note></p>
    <div class="row"><button class="btn2" data-listen>Écouter le bouquet</button><button class="btn2" data-stop>Arrêter</button></div>
    <label class="belai-volume">Volume <input type="range" data-volume min="0" max="1" step=".01" value="${volume}" aria-label="Volume du bouquet"></label>
    <p class="bqstat" data-status>${escape(status)}</p><p class="bqstat">${escape(score.world.styleName)} · ${escape(score.world.colour)} · ${score.world.tempo} pulsations par minute</p>
    <small data-hash>${snapshot.saved?`Signature ${escape(snapshot.saved.hash.slice(0,18))}…`:''}</small><button class="btn2" data-export>Exporter la composition</button>
    <details class="belai-library"><summary>La bibliothèque sonore · ${SIGNATURE_SOUNDS.length} sons et variantes</summary><input type="search" class="srch" placeholder="Chercher un son…" aria-label="Chercher un son"><div data-sounds></div><a href="${asset('credits.html')}" target="_blank" rel="noopener">Sources et licences des sons</a></details>
  </details>`;
  const svg=box.querySelector('svg')!;
  const guides=document.createElementNS(ns,'path');guides.setAttribute('d','M35 145H405M220 49V241');guides.setAttribute('class','belai-guides');svg.append(guides);
  const point=(f:Flower)=>{const p=placement(f);return graphPoint(p.side,p.depth);};
  const byId=new Map(snapshot.flowers.map(f=>[stemFor(f.key)?.id,f]));
  const wires=drafts.get(snapshot.key)?.wires??freezeEdges(composition.recipe,(composition.drawing?.wires??composition.edges) as Edge[]);
  for(const e of wires){const a=byId.get(e.a),b=byId.get(e.b);if(!a||!b)continue;const on=composition.edges.some(edge=>edge.a===e.a&&edge.b===e.b),pa=point(a),pb=point(b),group=document.createElementNS(ns,'g');group.dataset.edge='';group.dataset.a=a.key;group.dataset.b=b.key;group.classList.toggle('belai-edge-off',!on);
    if(!snapshot.locked){group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-pressed',String(on));group.setAttribute('aria-label',`${on?'Désactiver':'Activer'} le lien entre les tiges ${numberOf(a.key)} et ${numberOf(b.key)}`);}
    const title=document.createElementNS(ns,'title');title.textContent=`Tiges ${numberOf(a.key)} ↔ ${numberOf(b.key)} · ${on?'actif':'inactif'}`;group.append(title);
    for(const hit of[false,true]){const line=document.createElementNS(ns,'line');line.setAttribute('class',hit?'belai-edge-hit':'belai-edge-line');if(!hit&&on)line.style.stroke=`color-mix(in srgb, ${a.colour} 55%, #688468)`;for(const[k,v]of Object.entries({x1:pa.x,y1:pa.y,x2:pb.x,y2:pb.y}))line.setAttribute(k,String(v));group.append(line);}svg.append(group);}
  snapshot.flowers.forEach(f=>{const p=point(f),g=document.createElementNS(ns,'g');g.dataset.key=f.key;g.setAttribute('transform',`translate(${p.x},${p.y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label',`Tige ${numberOf(f.key)}, ${f.name}, SKU ${f.sku}`);g.classList.toggle('selected',f.key===selected);
    const hit=document.createElementNS(ns,'circle');hit.setAttribute('r',snapshot!.flowers.length>80?'12':'20');hit.setAttribute('class','belai-node-hit');
    const circle=document.createElementNS(ns,'circle');circle.setAttribute('class','belai-node');circle.setAttribute('r',snapshot!.flowers.length>80?'6':'12');circle.setAttribute('fill',f.colour);
    const text=document.createElementNS(ns,'text');text.setAttribute('dy','.35em');text.setAttribute('text-anchor','middle');text.textContent=String(numberOf(f.key));g.append(hit,circle,text);svg.append(g);
  });
  box.querySelector<HTMLButtonElement>('[data-move]')!.onclick=()=>{linking=false;linkSource='';graphMessage='';showSelected();};
  box.querySelector<HTMLButtonElement>('[data-link]')!.onclick=()=>{linking=true;linkSource=selected;graphMessage='';showSelected();};
  box.querySelector<HTMLButtonElement>('[data-undo]')!.onclick=()=>{const undo=edgeUndo;edgeUndo=undefined;if(undo&&undo.key===snapshot?.key)changeEdges(undo.edges,'La modification du lien est annulée.',false);};
  box.querySelector<HTMLButtonElement>('[data-listen]')!.onclick=listen;
  box.querySelector<HTMLButtonElement>('[data-stop]')!.onclick=()=>player.stop();
  box.querySelector<HTMLInputElement>('[data-volume]')!.oninput=e=>{volume=Number((e.target as HTMLInputElement).value);player.setVolume(volume);};
  box.querySelector<HTMLButtonElement>('[data-export]')!.onclick=()=>{const url=URL.createObjectURL(new Blob([compositionBytes(composition!)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='belai-bouquet.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const search=box.querySelector<HTMLInputElement>('input[type=search]')!;
  const sounds=()=>{const q=search.value.toLocaleLowerCase('fr');box!.querySelector('[data-sounds]')!.innerHTML=SIGNATURE_SOUNDS.filter(s=>s.name.toLocaleLowerCase('fr').includes(q)).map(s=>`<p>${escape(s.name)} <small>${s.recording?'Enregistrement':'Synthèse'}</small></p>`).join('');};search.oninput=sounds;sounds();
  attachGraph(svg);renderStemBands();showSelected();
  if(focused)svg.querySelector<SVGGElement>(`g[data-key="${CSS.escape(focused)}"]`)?.focus({preventScroll:true});
}
type MarketSource=Exclude<StemSource,'preview'>;
const sources:readonly [MarketSource,string][]=[['inventory','Mon inventaire'],['criee','Criée du jour'],['hotel','Hôtel des ventes']];
const shortId=(stem:Stem)=>BigInt(stem.id).toString(16).padStart(16,'0').slice(0,12);
const ageOf=(stem:Stem)=>{const days=Math.max(0,Math.floor((Date.now()/1000-stem.issuedAt)/DAY));return days?`${days} jour${days>1?'s':''}`:'du jour';};
// Until the game services are connected, each source shows fictitious exemplars kept for this page only.
const demoAges:Readonly<Record<MarketSource,readonly number[]>>={inventory:[12,38],criee:[0,0,0,1],hotel:[6,21,55]};
const demoMarket:StemMarket={async list({sku,source}){
  const key=`${source}/${sku}`;let offers=demoOffers.get(key);
  if(!offers){const reference=references.get(sku)!,flower:Flower={key:'',sku,referenceKey:'',name:reference.name,colour:reference.colour,colourName:reference.colourName,x:0,y:0,z:0};
    offers=demoAges[source].map(age=>({source,stem:makeStem(flower,age)}));demoOffers.set(key,offers);}
  return offers;
}};
const market=()=>window.BelaiStemMarket??demoMarket;
function pickOffer(offer:StemOffer,group:Flower,replaceKey?:string):void {
  if(!snapshot||snapshot.locked||!composition)return;
  const checked=validateOffers([offer],group.sku,offer.source,knownOffers)[0]!;
  if(composition.recipe.stems.some(s=>s.id===checked.stem.id))return;
  const draft=drafts.get(snapshot.key)!,old=replaceKey?draft.stems.get(replaceKey):undefined;
  player.stop();const appearance=Number(BigInt(checked.stem.profile.seed)%2147483646n)+1;
  const key=replaceKey?host.replace(replaceKey,checked.stem.id,appearance,checked.stem.sku):host.add(group.referenceKey,checked.stem.id,appearance,checked.stem.sku);
  if(!key){graphMessage='Cette tige n’a pas pu être placée.';showSelected();return;}
  knownOffers.set(checked.stem.id,checked);draft.origins.set(checked.stem.id,checked.source);
  draft.stems.set(key,old?{...checked.stem,position:old.position}:checked.stem);
  if(!replaceKey)draft.pending.add(checked.stem.id);
  if(replaceKey&&old){draft.stems.delete(replaceKey);const remap=(edges:readonly Edge[])=>edges.map(e=>({a:e.a===old.id?checked.stem.id:e.a,b:e.b===old.id?checked.stem.id:e.b}));draft.edges=remap(draft.edges);draft.wires=remap(draft.wires);}
  selected=key;graphMessage=replaceKey?'La tige choisie a été remplacée.':'Une tige individuelle rejoint le bouquet.';
}
let bandsKey='';
function renderStemBands():void {
  const box=snapshot?.bandContainer;if(!box||!snapshot||!composition)return;
  const snap=snapshot,draft=drafts.get(snap.key),groups=new Map(draft?.groups??snap.flowers.map(f=>[f.referenceKey,f]));
  for(const f of snap.flowers)groups.set(f.referenceKey,f);
  // Rebuild only when the exemplars change; a moved stem or a new link keeps the bands as they are.
  const key=[snap.key,snap.locked,...snap.flowers.map(f=>`${f.key}:${f.number}:${stemFor(f.key)?.id}`)].join('|');
  if(key===bandsKey&&box.querySelector('.belai-stem-group')&&!box.querySelector('.el'))return;
  bandsKey=key;box.replaceChildren();box.classList.add('belai-stem-bands');
  for(const [reference,flower]of groups){
    const members=snap.flowers.filter(f=>f.referenceKey===reference);if(!members.length&&snap.locked)continue;
    const group=document.createElement('section');group.className='belai-stem-group';group.dataset.reference=reference;
    group.innerHTML=`<header><svg aria-hidden="true"></svg><div><b>${escape(flower.name)}</b><small>${escape(flower.colourName)} · ${members.length} tige${members.length>1?'s':''}</small></div></header><div class="belai-stem-cards"></div>`;
    box.append(group);
    // The portrait is measured to fit its frame, so it is drawn once the band is in the page.
    const portrait=members[0];if(portrait)host.portrait(portrait.key,group.querySelector('svg')!);
    const cards=group.querySelector('.belai-stem-cards')!;
    for(const f of members){const stem=stemFor(f.key)!;const card=document.createElement('div');card.className='belai-stem-card';card.dataset.belaiCard=f.key;
      card.innerHTML=`<button type="button" data-select aria-label="Sélectionner la tige ${f.number}"><span class="belai-number" style="background:${escape(f.colour)}">${f.number}</span><b>Tige ${f.number}</b><small title="Identifiant individuel ${escape(stem.id)}">${shortId(stem)}…</small><small>${escape(signatureSound(stem.profile).name)} · ${ageOf(stem)}</small></button>${snap.locked?'':`<button type="button" class="belai-remove" aria-label="Retirer la tige ${f.number}" ${snap.flowers.length===1?'disabled':''}>Retirer</button>`}`;
      card.querySelector<HTMLButtonElement>('[data-select]')!.onclick=()=>choose(f.key);
      const remove=card.querySelector<HTMLButtonElement>('.belai-remove');if(remove)remove.onclick=()=>{player.stop();host.remove(f.key);};cards.append(card);
    }
    if(snap.locked)continue;
    const fold=document.createElement('details'),stateKey=`${snap.key}/${reference}`;
    const state=folds.get(stateKey)??{open:false,source:'inventory' as MarketSource};folds.set(stateKey,state);fold.className='belai-market';
    fold.innerHTML=`<summary>Choisir d’autres tiges <small>Inventaire, criée, hôtel des ventes</small></summary><div class="belai-sources" role="group" aria-label="Provenance des tiges">${sources.map(([id,label])=>`<button type="button" data-source="${id}" aria-pressed="${state.source===id}">${label}</button>`).join('')}</div><div data-offers></div>`;
    const offersBox=fold.querySelector<HTMLElement>('[data-offers]')!;
    const showOffers=async(source:MarketSource)=>{
      state.source=source;fold.querySelectorAll<HTMLElement>('[data-source]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.source===source)));
      offersBox.textContent='Chargement des tiges…';
      try{
        const offers=validateOffers(await market().list({sku:flower.sku,source}),flower.sku,source,knownOffers);
        if(!offersBox.isConnected||snapshot?.key!==snap.key||state.source!==source)return;
        offersBox.innerHTML=`<p class="belai-source-note">${window.BelaiStemMarket?'Sélection pour composer. Aucun achat ni transfert n’est effectué ici.':'Démonstration : ces tiges sont fictives, en attendant le raccordement au jeu. Aucun achat ni transfert n’est effectué ici.'}</p>`;
        if(!offers.length){offersBox.append(document.createTextNode('Aucune tige disponible pour cette référence.'));return;}
        for(const offer of offers){knownOffers.set(offer.stem.id,offer);const used=composition!.recipe.stems.some(s=>s.id===offer.stem.id),tile=document.createElement('div');tile.className='belai-offer';
          tile.innerHTML=`<b title="Identifiant individuel ${escape(offer.stem.id)}">${escape(offer.label??`Tige ${shortId(offer.stem)}…`)}</b><small>${escape(signatureSound(offer.stem.profile).name)} · ${ageOf(offer.stem)}${offer.priceLabel?` · ${escape(offer.priceLabel)}`:''}</small><div><button type="button" data-add ${used?'disabled':''}>${used?'Dans le bouquet':'Ajouter au bouquet'}</button><button type="button" data-replace ${used?'disabled':''}>Remplacer</button></div>`;
          tile.querySelector<HTMLButtonElement>('[data-add]')!.onclick=()=>pickOffer(offer,flower);
          tile.querySelector<HTMLButtonElement>('[data-replace]')!.onclick=()=>{const target=snapshot?.flowers.find(f=>f.key===selected&&f.referenceKey===reference);if(target)pickOffer(offer,flower,target.key);};
          offersBox.append(tile);
        }
        replaceLabels();
      }catch{if(offersBox.isConnected)offersBox.textContent='Ces tiges ne sont pas disponibles ou leurs identifiants ne sont pas cohérents.';}
    };
    // Offers are fetched when the band's market is unfolded, never for every band at once.
    fold.ontoggle=()=>{state.open=fold.open;if(fold.open&&!offersBox.childElementCount)void showOffers(state.source);};
    fold.querySelectorAll<HTMLButtonElement>('[data-source]').forEach(button=>button.onclick=()=>{void showOffers(button.dataset.source as MarketSource);});
    group.append(fold);fold.open=state.open;
  }
}
/** "Replace" acts on the selected stem, so it is offered only in that stem's band. */
function replaceLabels():void {
  const chosen=snapshot?.flowers.find(f=>f.key===selected);
  snapshot?.bandContainer?.querySelectorAll<HTMLElement>('.belai-stem-group').forEach(group=>{const mine=chosen?.referenceKey===group.dataset.reference;
    group.querySelectorAll<HTMLButtonElement>('[data-replace]').forEach(button=>{const used=button.previousElementSibling?.textContent==='Dans le bouquet';
      button.disabled=used||!mine;button.textContent=mine?`Remplacer la tige ${chosen!.number}`:'Remplacer';
      button.title=mine?'':'Sélectionne d’abord une tige de ce bandeau.';});});
}
function positionReadout(side:number,depth:number):void {
  const el=panel()?.querySelector('[data-position]');if(el)el.textContent=`Tige ${numberOf(selected)} · ${Math.abs(side)<.025?'centre':`${side<0?'gauche':'droite'} ${Math.round(Math.abs(side)*100)} %`} · ${Math.abs(depth)<.025?'milieu':`${depth<0?'arrière':'avant'} ${Math.round(Math.abs(depth)/.8*100)} %`}`;
}
function previewPosition(svg:SVGSVGElement,key:string,side:number,depth:number):void {
  side=clamp(side);depth=clamp(depth,.8);const p=graphPoint(side,depth);
  svg.querySelector(`g[data-key="${CSS.escape(key)}"]`)?.setAttribute('transform',`translate(${p.x},${p.y})`);
  // Move incident edges in the same frame as their node; no score or drawing rebuild here.
  svg.querySelectorAll<SVGGElement>('g[data-edge]').forEach(edge=>{const end=edge.dataset.a===key?1:edge.dataset.b===key?2:0;if(end)edge.querySelectorAll('line').forEach(line=>{line.setAttribute(`x${end}`,String(p.x));line.setAttribute(`y${end}`,String(p.y));});});
  positionReadout(side,depth);
}
function commitMove(key:string,side:number,depth:number):void {
  if(snapshot?.locked)return;player.stop();graphMessage=`La tige ${numberOf(key)} a changé de place.`;host.move(key,clamp(side),clamp(depth,.8));
}
function showSelected():void {
  const stem=stemFor(selected),part=score?.parts.find(p=>p.stemId===stem?.id);if(!stem||!part)return;
  const ref=references.get(stem.sku)!,gene=signatureForSKU(stem.sku);
  const custom=snapshot?.flowers.find(f=>f.key===selected)?.customColour;
  const el=panel()?.querySelector('[data-flower]');if(el)el.textContent=`${ref.name} · ${custom?'Coloris libre du modèle, voix de la référence':'SKU'} ${stem.sku} · ${signatureSound(stem.profile).name} · ${gene.fingerprint}`;
  const box=panel(),flower=snapshot?.flowers.find(f=>f.key===selected);if(box&&flower&&composition){
    const place=placement(flower);positionReadout(place.side,place.depth);
    box.querySelectorAll<SVGGElement>('g[data-key]').forEach(g=>{g.classList.toggle('selected',g.dataset.key===selected);g.classList.toggle('belai-link-source',linking&&g.dataset.key===linkSource);});
    box.querySelectorAll<SVGGElement>('g[data-edge]').forEach(g=>g.classList.toggle('belai-incident',g.dataset.a===selected||g.dataset.b===selected));
    box.querySelector<HTMLButtonElement>('[data-move]')!.setAttribute('aria-pressed',String(!linking));box.querySelector<HTMLButtonElement>('[data-link]')!.setAttribute('aria-pressed',String(linking));
    box.querySelector('.belai-plane')!.classList.toggle('belai-linking',linking);
    box.querySelector('[data-hint]')!.textContent=snapshot?.locked?'Ce bouquet est composé. Sélectionne une tige pour découvrir sa voix.':linking?`Relier la tige ${numberOf(linkSource)} : clique une autre tige. Échap pour annuler.`:graphMessage||'Glisse une tige pour la déplacer. Clique un lien pour l’activer ou le désactiver. Gris : inactif ; couleur : actif.';
  }
  snapshot?.bandContainer?.querySelectorAll<HTMLElement>('[data-belai-card]').forEach(card=>card.classList.toggle('selected',card.dataset.belaiCard===selected));
  replaceLabels();host.highlight(selected);
}
function changeEdges(edges:readonly Edge[],message:string,remember=true):void {
  if(!snapshot||snapshot.locked||!composition)return;player.stop();
  if(remember)edgeUndo={key:snapshot.key,edges:composition.edges};graphMessage=message;linking=false;linkSource='';
  const draft=drafts.get(snapshot.key)!;draft.edges=freezeEdges(composition.recipe,edges);
  draft.wires=mergeEdges(composition.recipe,draft.wires,draft.edges);
  composition=freezeComposition({...composition,edges:draft.edges});score=new SignatureScore(composition.recipe,composition.edges);render();publish();
}
function connect(from:string,to:string):void {
  if(from===to||snapshot?.locked||!composition)return;const a=stemFor(from)?.id,b=stemFor(to)?.id;if(!a||!b)return;
  if(composition.edges.some(e=>e.a===a&&e.b===b||e.a===b&&e.b===a)){linking=false;linkSource='';graphMessage=`Les tiges ${numberOf(from)} et ${numberOf(to)} sont déjà reliées.`;showSelected();return;}
  selected=to;changeEdges([...composition.edges,{a,b}],`Les tiges ${numberOf(from)} et ${numberOf(to)} sont reliées.`);
}
function cut(from:string,to:string):void {
  if(!composition)return;const a=stemFor(from)?.id,b=stemFor(to)?.id;
  const present=composition.edges.some(e=>e.a===a&&e.b===b||e.a===b&&e.b===a);
  if(!present){connect(from,to);return;}
  changeEdges(composition.edges.filter(e=>!(e.a===a&&e.b===b||e.a===b&&e.b===a)),`Le lien entre les tiges ${numberOf(from)} et ${numberOf(to)} est désactivé.`);
}
function choose(key:string):void {
  if(linking&&!snapshot?.locked){connect(linkSource,key);return;}selected=key;graphMessage='';showSelected();
}
function attachGraph(svg:SVGSVGElement):void {
  let drag:{key:string;side:number;depth:number;startX:number;startY:number;offsetX:number;offsetY:number;moved:boolean}|undefined;
  let keyboard:{key:string;side:number;depth:number}|undefined,frame=0;
  const local=(e:PointerEvent)=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
  const paint=()=>{frame=0;if(drag)previewPosition(svg,drag.key,drag.side,drag.depth);};
  svg.onpointerdown=e=>{if(e.button!==0)return;const g=(e.target as Element).closest<SVGGElement>('g[data-key]');if(!g)return;const key=g.dataset.key!,wasLinking=linking;choose(key);if(snapshot?.locked||wasLinking)return;e.preventDefault();g.focus({preventScroll:true});const p=local(e),place=placement(snapshot!.flowers.find(f=>f.key===key)!),center=graphPoint(place.side,place.depth);drag={key,...place,startX:p.x,startY:p.y,offsetX:center.x-p.x,offsetY:center.y-p.y,moved:false};svg.setPointerCapture(e.pointerId);};
  svg.onpointermove=e=>{if(!drag)return;const p=local(e);drag.moved=drag.moved||Math.hypot(p.x-drag.startX,p.y-drag.startY)>3;if(!drag.moved)return;drag.side=clamp((p.x+drag.offsetX-220)/185);drag.depth=clamp((p.y+drag.offsetY-145)/120,.8);svg.classList.add('belai-dragging');if(!frame)frame=requestAnimationFrame(paint);};
  svg.onpointerup=e=>{if(!drag)return;if(frame){cancelAnimationFrame(frame);paint();}const d=drag;drag=undefined;svg.classList.remove('belai-dragging');if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(d.moved)commitMove(d.key,d.side,d.depth);};
  svg.onpointercancel=()=>{if(frame)cancelAnimationFrame(frame);drag=undefined;render();};
  svg.onclick=e=>{const edge=(e.target as Element).closest<SVGGElement>('g[data-edge]');if(edge&&!linking&&!snapshot?.locked)cut(edge.dataset.a!,edge.dataset.b!);};
  svg.onkeydown=e=>{if(e.key==='Escape'){linking=false;linkSource='';graphMessage='';showSelected();return;}
    const edge=(e.target as Element).closest<SVGGElement>('g[data-edge]');if(edge&&['Enter',' ','Delete','Backspace'].includes(e.key)){e.preventDefault();if(!snapshot?.locked)cut(edge.dataset.a!,edge.dataset.b!);return;}
    const g=(e.target as Element).closest<SVGGElement>('g[data-key]');if(!g)return;const key=g.dataset.key!,f=snapshot!.flowers.find(f=>f.key===key)!;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(key);return;}
    if(snapshot?.locked||linking||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(!keyboard||keyboard.key!==key){choose(key);keyboard={key,...placement(f)};}const step=e.shiftKey?.15:.05;keyboard.side=clamp(keyboard.side+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0));keyboard.depth=clamp(keyboard.depth+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0),.8);previewPosition(svg,key,keyboard.side,keyboard.depth);
  };
  svg.onkeyup=e=>{if(keyboard&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){const k=keyboard;keyboard=undefined;commitMove(k.key,k.side,k.depth);}};
}
function listen():void {if(composition)void player.play(composition.recipe,composition.edges).catch(()=>{});}
window.addEventListener('belai-bouquet',synchronize);
window.addEventListener('belai-stop-music',()=>player.stop());
window.addEventListener('belai-listen',()=>{synchronize();listen();});
window.addEventListener('pagehide',()=>{void player.dispose();});
setInterval(()=>{if(!score)return;const now=Date.now()/1000,notes=score.notesForBar(score.frameAt(now).bar).filter(n=>n.at<=now&&n.at+n.duration>now),ids=new Set(notes.map(n=>n.stemId));
  panel()?.querySelectorAll<SVGGElement>('g[data-key]').forEach(g=>g.classList.toggle('sounding',playing&&ids.has(stemFor(g.dataset.key!)?.id??'')));
  const note=notes.find(n=>n.stemId===stemFor(selected)?.id),el=panel()?.querySelector('[data-note]');
  if(el)el.textContent=note?note.midi===null?'Ambiance ou percussion':`${noteName(note.midi)} · ${hzForMidi(note.midi).toFixed(1)} Hz`:'Une respiration dans sa partie.';
},500);
