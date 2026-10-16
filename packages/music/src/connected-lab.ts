import { CONNECTED_VERSION,noteName,hzForMidi,type FlowerPart,type ConnectedNote,type ConnectedWorld } from "./connected-score.ts";
import { CONNECTED_SIZES } from "./connected-catalogue.ts";
import { instrumentFor } from "./library.ts";
import { loadRecipeBank } from "./bank.ts";
import type { Recipe } from "./model.ts";
import {GENETIC_VERSION,styleFor,motifFor,rhythmFor,STYLES,type ReferenceGenome} from './genetic-vocabulary.ts';
import type {GeneticWorld} from './genetic-score.ts';
import {soundColourFor} from './sound-colours.ts';
import {GENETIC_MANIFEST} from './genetic-manifest.ts';
import {loadRecipeColours} from './colour-bank.ts';

interface Reference { sku: number; species: string; colourName: string; colour: string }
interface Item { id: string; name: string; count: number; seconds: number; world: ConnectedWorld|GeneticWorld; key: string;
  atUTC: number; jsonSha256: string; references: Reference[]; metrics: { participatingFlowers: number } }
interface Detail extends Omit<Item,"jsonSha256" | "key"> { version: string; recipe: Recipe; events: ConnectedNote[];
  parts: (FlowerPart & { anchor: number | null; notes: number[]; strength: number; genome?:ReferenceGenome; soundColour?:string })[] }
type Part=Detail['parts'][number];
const soundName=(part:Part)=>part.soundColour?soundColourFor(part.soundColour).name:instrumentFor(part.timbre).name;
const genes=(part:Part)=>part.genome?`${styleFor(part.genome.style).name} · ${motifFor(part.genome.motif).name.split(' · ').at(-1)} · ${rhythmFor(part.genome.rhythm).name}`:'Partition commune 0.1';
const pitchName=(part:Part,midi:number|null)=>midi!==null?noteName(midi):part.soundColour&&soundColourFor(part.soundColour).percussive?'Percussion sans hauteur':'Ambiance naturelle';
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const make = <K extends keyof HTMLElementTagNameMap>(tag: K,text = "",className = "") => {
  const node = document.createElement(tag); node.textContent = text; node.className = className; return node;
};
const svg = <K extends keyof SVGElementTagNameMap>(tag: K) => document.createElementNS("http://www.w3.org/2000/svg",tag);
const labels = { theme: "Mélodie",answer: "Réponse",counter: "Contrechant",bass: "Basse",arpeggio: "Arpège",harmony: "Tenue harmonique",pulse: "Pulsation",texture: "Ambiance" };
const detailAudio = el<HTMLAudioElement>("detail-audio"); const soloAudio = el<HTMLAudioElement>("solo-audio");
const soloButton = el<HTMLButtonElement>("solo"); const tableMode = el<HTMLSelectElement>("table-mode");
let items: Item[] = []; let size: number = 5; let selected: Detail | undefined; let flowerId = "";
let generation = 0; let soloGeneration = 0; let soloWorker: Worker | undefined; let soloUrl: string | undefined; let soloPreparing = false;
let request: AbortController | undefined; let ready = false;
let version=GENETIC_VERSION;let loadGeneration=0;
const directory=()=>version===GENETIC_VERSION?'connected-0.2':'connected';
const versionSelect=el<HTMLSelectElement>('edition');
const groups = new Map<string,SVGGElement>(); const eventLists = new Map<string,ConnectedNote[]>();
el("version").textContent = version;
function cancelSolo(): void {
  soloGeneration++; soloWorker?.terminate(); soloWorker = undefined; soloPreparing = false; soloAudio.pause(); soloAudio.hidden = true;
  if (soloUrl) URL.revokeObjectURL(soloUrl); soloUrl = undefined; soloButton.disabled = !selected;
  el("solo-status").textContent = "";
}
function table(): void {
  if (!selected) return;
  const head = el("table-head"); const body = el("table-body"); head.replaceChildren(); body.replaceChildren();
  const headings = tableMode.value === "sku" ? ["SKU · référence","Exemplaires","Instruments et rôles","Gènes d’écriture du SKU","Notes de la pièce"]
    : ["Exemplaire · SKU","Instrument · rôle","Gènes d’écriture du SKU","Première note","Notes de la pièce"];
  const row = make("tr"); headings.forEach(text => row.append(make("th",text))); head.append(row);
  const references = new Map(selected.references.map(ref => [ref.sku,ref]));
  const selectFlower = (id: string) => { flowerId = id; cancelSolo(); showFlower(); updateMap(); };
  const button = (id: string) => { const node = make("button",`Fleur ${id}`,"stem-button"); node.type = "button"; node.setAttribute("aria-label",`Inspecter la fleur ${id}`); node.addEventListener("click",() => selectFlower(id)); return node; };
  if (tableMode.value === "sku") {
    for (const [sku,ref] of references) {
      const parts = selected.parts.filter(part => part.sku === sku); const tr = make("tr");
      const name = make("td"); const title = make("div",`#${sku} · ${ref.species}`,"ref-name");
      const swatch = make("span","","swatch"); if (/^#[0-9a-f]{6}$/i.test(ref.colour)) swatch.style.background = ref.colour;
      title.prepend(swatch); name.append(title,make("span",ref.colourName,"ref-colour"));
      const people = make("td",`${parts.length} fleur${parts.length > 1 ? "s" : ""}`);
      const list = make("div"); parts.slice(0,8).forEach(part => list.append(button(part.stemId)));
      if (parts.length > 8) list.append(make("span",` + ${parts.length - 8} à explorer dans « Chaque exemplaire »`,"ref-colour")); people.append(list);
      const instruments = [...new Set(parts.map(part => `${soundName(part)} · ${labels[part.role]}`))];
      const voices = make("td",instruments.join(" ; "),"note-list");
      const pitches = [...new Set(parts.flatMap(part => part.notes))].sort((a,b) => a - b);
      const notes = make("td",pitches.length ? pitches.map(noteName).join(" · ") : pitchName(parts[0]!,null),"note-list");
      tr.append(name,people,voices,make('td',genes(parts[0]!),'note-list'),notes); body.append(tr);
    }
  } else for (const part of selected.parts) {
    const tr = make("tr"); const first = make("td"); first.append(button(part.stemId),make("span",`SKU #${part.sku}`,"ref-colour"));
    tr.append(first,make("td",`${soundName(part)} · ${labels[part.role]}`),make('td',genes(part),'note-list'),make("td",pitchName(part,part.anchor)),
      make("td",part.notes.length ? part.notes.map(noteName).join(" · ") : pitchName(part,null),"note-list")); body.append(tr);
  }
}
function currentNote(id: string): ConnectedNote | undefined {
  const list = eventLists.get(id) ?? []; const time = detailAudio.currentTime;
  let low = 0; let high = list.length;
  while (low < high) { const middle = (low + high) >>> 1; if (list[middle]!.at <= time) low = middle + 1; else high = middle; }
  for (let i = low - 1; i >= Math.max(0,low - 3); i--) if (list[i]!.at + list[i]!.duration > time) return list[i];
  return undefined;
}
function showFlower(): void {
  if (!selected) return;
  const part = selected.parts.find(part => part.stemId === flowerId)!; if (!part) return;
  const stem = selected.recipe.stems.find(stem => stem.id === flowerId)!;
  const reference = selected.references.find(ref => ref.sku === part.sku)!;
  el("flower-title").textContent = `Fleur ${flowerId} · SKU #${part.sku}`;
  const dl = make("dl"); const note = currentNote(flowerId);
  const rows = [
    ["Référence",`${reference.species} · ${reference.colourName}`],
    ["Son individuel",soundName(part)], ["Partie",labels[part.role]],
    ...(part.genome?[["Style du SKU",styleFor(part.genome.style).name],["Partition du SKU",motifFor(part.genome.motif).name],["Rythme du SKU",rhythmFor(part.genome.rhythm).name]]:[]),
    ["Note présente",note ? `${pitchName(part,note.midi)}${note.midi === null ? "" : ` · ${hzForMidi(note.midi).toFixed(1)} Hz cible`}` : "Respiration écrite"],
    ["Première note",pitchName(part,part.anchor)], ["Voisins",part.links.map(link => `Fleur ${link.source}`).join(", ") || "Seule"],
    ["Position",`x ${stem.position.x.toFixed(2)} · y ${stem.position.y.toFixed(2)} · z ${stem.position.z.toFixed(2)}`],
    ["Influence",`${Math.round(part.influence * 100)} % · couleur et réponse`],
    ["Profil conservé",stem.profile.seed.slice(0,14) + "…"],
  ];
  for (const [title,value] of rows) dl.append(make("dt",title),make("dd",value));
  el("flower-info").replaceChildren(dl); soloButton.disabled = soloPreparing;
}
function updateMap(): void {
  if (!selected) return;
  for (const [id,group] of groups) { group.classList.toggle("chosen",id === flowerId); group.classList.toggle("active",!!currentNote(id)); }
  const bar = Math.floor(detailAudio.currentTime / selected.world.barSeconds);
  const world=selected.world;
  const sections='sections' in world?world.sections:["Le thème prend vie","Les voix se répondent","Une clairière intime","Le retour lumineux"].map((name,i)=>({name,from:i*8,bars:8}));
  const bars='bars' in world?world.bars:32;
  const section=sections.find(section=>bar>=section.from&&bar<section.from+section.bars)??sections.at(-1)!;
  el("scene").textContent = `${section.name} · mesure ${Math.min(bars,bar + 1)}/${bars}`;
  if (flowerId) showFlower();
}
function map(): void {
  if (!selected) return; const detail = selected;
  const network = document.getElementById("network") as unknown as SVGSVGElement; network.replaceChildren(); groups.clear();
  const positions = new Map(detail.recipe.stems.map(stem => [stem.id,{ x: 180 + stem.position.x * 151,y: 162 - stem.position.y * 135 }]));
  for (const part of detail.parts) for (const link of part.links) {
    const source = positions.get(link.source)!; const target = positions.get(part.stemId)!; const line = svg("line");
    line.setAttribute("x1",String(source.x)); line.setAttribute("y1",String(source.y)); line.setAttribute("x2",String(target.x)); line.setAttribute("y2",String(target.y)); network.append(line);
  }
  for (const part of detail.parts) {
    const point = positions.get(part.stemId)!; const group = svg("g"); group.setAttribute("role","button"); group.setAttribute("tabindex","0");
    group.setAttribute("aria-label",`Fleur ${part.stemId}, SKU ${part.sku}, ${soundName(part)}, ${labels[part.role]}`);
    const circle = svg("circle"); circle.setAttribute("cx",String(point.x)); circle.setAttribute("cy",String(point.y));
    circle.setAttribute("r",detail.count > 100 ? "3.8" : detail.count > 30 ? "6" : "10");
    const colour = detail.references.find(ref => ref.sku === part.sku)!.colour;
    circle.setAttribute("fill",/^#[0-9a-f]{6}$/i.test(colour) ? colour : "#d9e5d1");
    const title = svg("title"); title.textContent = `Fleur ${part.stemId} · ${soundName(part)} · ${pitchName(part,part.anchor)}`; group.append(title,circle);
    if (detail.count <= 40) { const text = svg("text"); text.setAttribute("x",String(point.x)); text.setAttribute("y",String(point.y + 3)); text.setAttribute("text-anchor","middle"); text.textContent = part.stemId; group.append(text); }
    const select = () => { flowerId = part.stemId; cancelSolo(); updateMap(); };
    group.addEventListener("click",select); group.addEventListener("keydown",event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
    network.append(group); groups.set(part.stemId,group);
  }
}
async function inspect(item: Item,play: boolean,scroll: boolean): Promise<void> {
  const edition=version;const folder=directory();
  const token = ++generation; request?.abort(); request = new AbortController(); cancelSolo(); detailAudio.pause();
  el("readiness").textContent = `Ouverture de ${item.name}…`;
  try {
    const response = await fetch(`${folder}/${item.id}.json?v=${edition}`,{ cache: "no-store",signal: request.signal });
    if (!response.ok) throw new Error("Missing recipe");
    const bytes = await response.arrayBuffer(); const digest = new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));
    const hash = Array.from(digest,byte => byte.toString(16).padStart(2,"0")).join("");
    if (hash !== item.jsonSha256) throw new Error("Changed recipe");
    const detail = JSON.parse(new TextDecoder().decode(bytes)) as Detail;
    if (detail.version !== edition || detail.parts.length !== item.count || detail.id !== item.id) throw new Error("Outdated recipe");
    if (token !== generation) return;
    selected = detail; flowerId = detail.world.leader || detail.parts[0]!.stemId;
    eventLists.clear(); for (const note of detail.events) { const list = eventLists.get(note.stemId) ?? []; list.push(note); eventLists.set(note.stemId,list); }
    el("detail-title").textContent = detail.name;
    el("detail-world").textContent = `${detail.count} fleurs · ${'styleName' in detail.world?detail.world.styleName:detail.world.colour} · ${detail.world.meter} · noire = ${detail.world.tempo} · ${edition===CONNECTED_VERSION?item.key.replace(/\d+$/,'')+' majeur':item.key}`;
    const link = el<HTMLAnchorElement>("recipe-download"); link.href = `${folder}/${item.id}.json`; link.download = `${item.id}-${edition.slice(-5)}.json`;
    detailAudio.src = `${folder}/${item.id}.wav?v=${edition}`; detailAudio.setAttribute("aria-label",`Écouter ${item.name}, ${item.count} fleurs`);
    el("inspector").hidden = false; map(); table(); updateMap(); cards();
    el("readiness").textContent = `10 compositions disponibles · ${edition} · ${detail.count}/${detail.count} fleurs participent · ${edition===GENETIC_VERSION?'gènes d’écriture par SKU':'premières partitions communes'}.`;
    if (scroll) el("inspector").scrollIntoView({ behavior: "auto",block: "start" });
    if (play) void detailAudio.play().catch(() => { el("readiness").textContent = "Appuie sur lecture pour lancer le bouquet."; });
  } catch (error) { if (token === generation && !(error instanceof DOMException && error.name === "AbortError")) el("readiness").textContent = "Cette recette ne peut pas être ouverte. Recharge la page dans un instant."; }
}
function cards(): void {
  const container = el("cards"); container.replaceChildren();
  for (const item of items.filter(item => item.count === size)) {
    const card = make("article","",`card${selected?.id === item.id ? " selected" : ""}`);
    // The full instrument attribution is read from the verified recipe in the inspector.
    card.append(make("div",`${item.count} fleurs · ${Math.round(item.seconds)} secondes`,"badge"),make("h3",item.name),
      make("p",`${'styleName' in item.world?item.world.styleName+' · ':''}${item.world.colour} · ${item.world.meter} · noire = ${item.world.tempo}`));
    const actions = make("div","","card-actions"); const listen = make("button","Écouter et voir les notes","primary"); listen.type = "button";
    listen.setAttribute("aria-label",`Écouter et inspecter ${item.name}`); listen.addEventListener("click",() => void inspect(item,true,true));
    const view = make("button","Inspecter"); view.type = "button"; view.setAttribute("aria-label",`Inspecter ${item.name}`); view.addEventListener("click",() => void inspect(item,false,true));
    const download = make("a","WAV"); download.href = `${directory()}/${item.id}.wav`; download.download = `${item.id}.wav`;
    actions.append(listen,view,download); card.append(actions); container.append(card);
  }
}
for (const count of CONNECTED_SIZES) {
  const button = make("button",`${count} fleurs`,count === size ? "active" : ""); button.type = "button"; button.setAttribute("aria-pressed",String(count === size));
  button.addEventListener("click",() => { size = count; el("sizes").querySelectorAll("button").forEach(node => { const active = node === button; node.classList.toggle("active",active); node.setAttribute("aria-pressed",String(active)); }); cards(); });
  el("sizes").append(button);
}
detailAudio.addEventListener("timeupdate",updateMap); detailAudio.addEventListener("play",() => soloAudio.pause());
detailAudio.addEventListener("error",() => { el("scene").textContent = "Cette écoute est indisponible pour le moment."; });
soloAudio.addEventListener("play",() => detailAudio.pause()); tableMode.addEventListener("change",table);
el("return").addEventListener("click",() => {
  if (!selected) return; const world=selected.world;const target = world.barSeconds * ('sections' in world?world.sections.find(section=>section.kind==='return')!.from:24);
  if (detailAudio.readyState >= HTMLMediaElement.HAVE_METADATA) detailAudio.currentTime = target;
  else detailAudio.addEventListener("loadedmetadata",() => { detailAudio.currentTime = target; },{ once: true });
  void detailAudio.play().catch(() => { el("scene").textContent = "Appuie sur lecture pour rejoindre le retour."; });
});
soloButton.addEventListener("click",async () => {
  if (!selected) return; const detail = selected; const id = flowerId; const atUTC = detail.atUTC + detailAudio.currentTime;
  cancelSolo(); const token = soloGeneration; soloPreparing = true; soloButton.disabled = true; el("solo-status").textContent = "Préparation de la voix dans sa partition…";
  detailAudio.pause();
  try {
    const stem = detail.recipe.stems.find(stem => stem.id === id)!;
    const part=detail.parts.find(part=>part.stemId===id)!;
    const external=part.soundColour&&soundColourFor(part.soundColour).recording;
    const payload = await loadRecipeBank({ ...detail.recipe,stems: external?[]:[stem] });
    const colours=detail.version===GENETIC_VERSION?await loadRecipeColours({...detail.recipe,stems:[stem]}):undefined;
    if (token !== soloGeneration) return;
    const worker = new Worker(`connected-worker.js?v=${detail.version}`); soloWorker = worker;
    worker.onmessage = (event: MessageEvent<{ version?: string; bytes?: Uint8Array; error?: string }>) => {
      if (token !== soloGeneration) return; worker.terminate(); soloWorker = undefined; soloPreparing = false; soloButton.disabled = false;
      if (event.data.error || event.data.version !== detail.version || !event.data.bytes) { el("solo-status").textContent = "Cette voix ne peut pas être préparée pour le moment."; return; }
      soloUrl = URL.createObjectURL(new Blob([event.data.bytes as BlobPart],{ type: "audio/wav" })); soloAudio.src = soloUrl; soloAudio.hidden = false;
      el("solo-status").textContent = `Fleur ${id} · dix secondes de sa partie exacte. Volume relevé pour l’écoute isolée.`;
      void soloAudio.play().catch(() => { /* Native controls remain available when automatic playback is denied. */ });
    };
    worker.onerror = () => { if(token!==soloGeneration)return; worker.terminate();soloWorker=undefined; soloPreparing = false; soloButton.disabled = false; el("solo-status").textContent = "Cette voix ne peut pas être préparée pour le moment."; };
    worker.postMessage({ recipe: detail.recipe,bank: payload,colours,version:detail.version,stemId: id,atUTC });
  } catch { if (token === soloGeneration) { soloPreparing = false; soloButton.disabled = false; el("solo-status").textContent = "La bibliothèque ne peut pas être chargée pour cette voix."; } }
});
async function load(): Promise<void> {
  const edition=version;const token=++loadGeneration;
  try {
    const response = await fetch(`${directory()}/index.json`,{ cache: "no-store" }); if (!response.ok) throw new Error("Preparing");
    const index = await response.json() as { version: string; items: Item[] };
    if (index.version !== edition || index.items.length !== 10 || !CONNECTED_SIZES.every(count => index.items.filter(item => item.count === count).length === 2)) throw new Error("Incomplete collection");
    if(token!==loadGeneration)return;
    items = index.items; ready = true; cards(); void inspect(items.find(item=>item.count===size)!,false,false);
    el<HTMLAnchorElement>('compositions-download').href=`${directory()}/index.json`;
  } catch { if(token===loadGeneration)el("readiness").textContent = "Les dix compositions se préparent. Elles apparaîtront ici dès que les écoutes seront prêtes."; }
}
versionSelect.addEventListener('change',()=>{
  version=versionSelect.value===CONNECTED_VERSION?CONNECTED_VERSION:GENETIC_VERSION;ready=false;generation++;request?.abort();detailAudio.pause();cancelSolo();selected=undefined;
  el('inspector').hidden=true;items=[];cards();el('version').textContent=version;void load();
});
el('library-stats').textContent=`${GENETIC_MANIFEST.sounds} sons et variantes · ${GENETIC_MANIFEST.styles} styles · ${GENETIC_MANIFEST.motifs} motifs · ${GENETIC_MANIFEST.rhythms} cellules rythmiques · ${GENETIC_MANIFEST.references} SKU avec leurs gènes.`;
for(const style of STYLES)el('style-list').append(make('li',`${style.name} : ${style.meter}, ${style.emotion}, ${style.form.reduce((a,b)=>a+b,0)} mesures.`));
void fetch('reference-summary.json').then(async response=>{
  if(!response.ok)return;
  const report=await response.json() as {inventoryCount:number;analyzedCount:number;selectedAnalyzedCount:number;items:{title:string;url:string;selected:boolean;status:string;reason?:string;analysis?:{pulseCandidates:{bpm:number;confidence:number}[];keyCandidates:{key:string;correlation:number}[];dynamicsDb:number}}[]};
  el('reference-stats').textContent=`${report.analyzedCount}/${report.inventoryCount} pistes analysées · ${report.selectedAnalyzedCount}/10 thèmes choisis disponibles. Les pulsations et tonalités ci-dessous sont des estimations ; elles ne décrivent pas automatiquement les émotions ou les instruments.`;
  for(const item of report.items.filter(item=>item.selected)){
    const li=make('li');const link=make('a',item.title);link.href=item.url;link.target='_blank';link.rel='noopener';li.append(link);
    const analysis=item.analysis;
    li.append(make('span',analysis?` · pulsation ${analysis.pulseCandidates[0]?.bpm??'indéterminée'} (confiance ${analysis.pulseCandidates[0]?.confidence??0}) · ${analysis.keyCandidates[0]?.key??'tonalité indéterminée'} · dynamique ${analysis.dynamicsDb} dB`:` · ${item.reason??'Analyse indisponible.'}`));el('reference-list').append(li);
  }
}).catch(()=>{el('reference-stats').textContent='Le compte rendu des références ne peut pas être chargé.';});
void load(); const timer = window.setInterval(() => { if (!ready) void load(); },15_000);
window.addEventListener("pagehide",() => { request?.abort(); detailAudio.pause(); cancelSolo(); window.clearInterval(timer); });
