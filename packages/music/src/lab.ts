import { BouquetPlayer } from "./player.ts";
import { replaceStem, fixture } from "./fixtures.ts";
import { CATALOGUE, SIZES, specimenRecipe, type Specimen } from "./catalogue.ts";
import { DAY, VERSION, lifeAt, type Recipe, type Timbre } from "./model.ts";
import { worldFor } from "./world.ts";
import { Score } from "./score.ts";
import { LIBRARY, FAMILIES, instrumentFor, type Family } from "./library.ts";
import { loadRecipeBank, SAMPLE_MANIFEST } from "./bank.ts";

declare const __WORKLET_SOURCE__: string;
declare const __RENDER_SOURCE__: string;
declare const __COMPOSITION_SOURCE__: string;
const element = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const count = element<HTMLSelectElement>("count"); const harmony = element<HTMLSelectElement>("harmony");
const position = element<HTMLSelectElement>("position"); const variant = element<HTMLSelectElement>("variant");
const age = element<HTMLInputElement>("age"); const volume = element<HTMLInputElement>("volume");
const play = element<HTMLButtonElement>("play"); const mute = element<HTMLButtonElement>("mute");
const status = element<HTMLDivElement>("status"); const a = element<HTMLButtonElement>("a"); const b = element<HTMLButtonElement>("b");
const exporting = element<HTMLButtonElement>("export"); const excerpt = element<HTMLAudioElement>("excerpt");
const download = element<HTMLAnchorElement>("download"); const exportStatus = element<HTMLParagraphElement>("export-status");
const names = Object.fromEntries(LIBRARY.map(instrument => [instrument.id, instrument.name])) as Record<Timbre, string>;
const bankReady = (recipe: Recipe) => loadRecipeBank(recipe);
const libraryAudio = element<HTMLAudioElement>("library-audio");
const libraryFamily = element<HTMLSelectElement>("library-family"); const librarySound = element<HTMLSelectElement>("library-sound");
const libraryButton = element<HTMLButtonElement>("library-preview"); const libraryStatus = element<HTMLParagraphElement>("library-status");
let libraryWorker: Worker | undefined; let libraryUrl: string | undefined;
let comparison = false; let muted = false; let baseline = Date.now() / 1000;
let recipe: Recipe; let score: Score; let worker: Worker | undefined; let downloadUrl: string | undefined;
let selected: Specimen;
const galleryAudio: HTMLAudioElement[] = [];
const workletUrl = URL.createObjectURL(new Blob([__WORKLET_SOURCE__], { type: "text/javascript" }));
const workerUrl = URL.createObjectURL(new Blob([__RENDER_SOURCE__], { type: "text/javascript" }));
const compositionWorkerUrl = URL.createObjectURL(new Blob([__COMPOSITION_SOURCE__], { type: "text/javascript" }));
const player = new BouquetPlayer({ workletUrl, compositionWorkerUrl, bank: bankReady, now: () => recipe.originAt + Number(age.value) * DAY + Date.now() / 1000 - baseline,
  onState: (state, message) => {
    if (state === "preparing") status.dataset.bufferingCount = "0";
    else if (state === "buffering") status.dataset.bufferingCount = String(Number(status.dataset.bufferingCount ?? 0) + 1);
    play.textContent = state === "playing" || state === "buffering" ? "Pause" : state === "preparing" ? "Annuler" : "Écouter";
    status.classList.toggle("error", state === "error");
    status.textContent = message ?? ({ preparing: "La musique se prépare…", buffering: "L’ensemble se prépare pour reprendre au moment présent…", playing: "La musique suit la vie du bouquet. Une reprise rejoindra son évolution.",
      stopped: "En pause. L’horloge du bouquet continue.", interrupted: "L’écoute a été suspendue. Écouter rejoint le moment présent.", error: "L’écoute continue est indisponible ; tu peux préparer un extrait." }[state]);
  } });

function discardExcerpt(): void {
  excerpt.pause();
  worker?.terminate(); worker = undefined; exporting.disabled = false;
  if (downloadUrl) { URL.revokeObjectURL(downloadUrl); downloadUrl = undefined; }
  excerpt.removeAttribute("src"); excerpt.hidden = true; download.hidden = true; exportStatus.textContent = "";
}

function rebuild(): void {
  discardLibrary();
  player.stop(); galleryAudio.forEach(audio => audio.pause()); baseline = Date.now() / 1000;
  discardExcerpt();
  const v = Number(variant.value);
  selected = CATALOGUE.find(item => item.count === Number(count.value) && item.variant === v)!;
  for (const option of variant.options) option.textContent = CATALOGUE.find(item => item.count === selected.count && item.variant === Number(option.value))!.name;
  const source = specimenRecipe(selected, harmony.value as Recipe["harmony"]);
  recipe = { ...source, stems: source.stems.map(stem => ({ ...stem,
    position: position.value === "close" ? { x: stem.position.x * 0.18, y: stem.position.y * 0.18, z: stem.position.z * 0.18 }
      : position.value === "mirror" ? { ...stem.position, x: -stem.position.x } : stem.position })) };
  if (comparison) recipe = replaceStem(recipe, recipe.stems.length > 3 ? "4" : "1");
  score = new Score(recipe); recipe = score.recipe;
  element("identity-name").textContent = selected.name;
  element("identity-world").textContent = recipe.stems.length === 1 ? selected.description
    : `${score.world.biome.name} · ${score.world.biome.description}`;
  element("emotion").textContent = `${score.world.tableau.emotion} · ${score.world.tableau.title}`;
  element("intention").textContent = score.world.tableau.gesture;
  for (const card of document.querySelectorAll<HTMLElement>("[data-specimen]")) card.classList.toggle("selected", card.dataset.specimen === selected.id);
  draw(); update();
  status.textContent = recipe.stems.some(stem => lifeAt(stem, recipe.originAt + Number(age.value) * DAY).alive)
    ? "Cette recette est prête à écouter." : "Toutes les fleurs ont disparu. Le vase reste silencieux.";
}

function draw(): void {
  const svg = document.getElementById("map")!;
  const ns = "http://www.w3.org/2000/svg"; svg.replaceChildren();
  const xy = (index: number): [number, number] => [190 + recipe.stems[index]!.position.x * 155,
    135 - recipe.stems[index]!.position.y * 110];
  if (recipe.stems.length <= 80) score.links.forEach((links, receiver) => links.slice(0, 2).forEach(link => {
    const line = document.createElementNS(ns, "line"); const [x1, y1] = xy(receiver); const [x2, y2] = xy(link.source);
    for (const [key, value] of Object.entries({ x1, y1, x2, y2 })) line.setAttribute(key, String(value));
    svg.appendChild(line);
  }));
  recipe.stems.forEach((stem, i) => {
    const node = document.createElementNS(ns, "circle"); const [cx, cy] = xy(i);
    node.setAttribute("cx", String(cx)); node.setAttribute("cy", String(cy));
    node.setAttribute("r", recipe.stems.length > 80 ? "3" : "6"); node.setAttribute("data-stem", stem.id);
    const title = document.createElementNS(ns, "title"); title.textContent = `Tige ${stem.id} · ${names[stem.profile.timbre]}`;
    node.appendChild(title); svg.appendChild(node);
  });
  const chips = element<HTMLDivElement>("modules"); chips.replaceChildren();
  for (const [timbre, label] of Object.entries(names)) {
    const total = recipe.stems.filter(stem => stem.profile.timbre === timbre).length;
    if (total) { const chip = document.createElement("span"); chip.className = "chip"; chip.textContent = `${label} · ${total}`; chips.appendChild(chip); }
  }
}

function update(): void {
  if (!score) return;
  const time = Number(age.value) * DAY + Date.now() / 1000 - baseline;
  const alive = recipe.stems.filter(stem => lifeAt(stem, recipe.originAt + time).alive).length;
  if (alive === 0) {
    if (player.playing || player.preparing) player.stop();
    status.textContent = "Toutes les fleurs ont disparu. Le vase reste silencieux.";
  }
  play.disabled = alive === 0;
  const voices = score.voicesAt(time);
  const active = new Set(voices.map(voice => voice.stemId));
  const scene = score.sceneAt(time);
  element("scene").textContent = `${scene.name} · thème ${scene.theme} · ${score.harmonyAt(time).name}`;
  const main = voices.filter(voice => ["theme", "counter", "answer"].includes(voice.role));
  const parts = (roles: string[]) => voices.filter(voice => roles.includes(voice.role)).length;
  element("orchestration").textContent = alive ? `${main.length} lignes mélodiques · ${parts(["choir"])} chœurs · ${parts(["drone", "harmony"])} tenues · ${parts(["pulse"])} pulsations · ${parts(["bass", "arpeggio", "ornament"])} accompagnements · ${parts(["effect", "texture"])} effets et ambiance` : "Le vase reste silencieux.";
  element("age-label").textContent = `${Number(age.value).toLocaleString("fr-FR")} jours`;
  element("alive").textContent = String(alive); element("voices").textContent = String(active.size);
  element("clock").textContent = `${Math.floor(time / DAY)} j ${String(Math.floor(time % 60)).padStart(2, "0")} s`;
  for (const circle of document.querySelectorAll<SVGCircleElement>("circle[data-stem]")) {
    circle.classList.toggle("sounding", active.has(circle.dataset.stem!));
  }
}

for (const select of [count, harmony, position, variant]) select.addEventListener("change", rebuild);
age.addEventListener("input", () => {
  player.stop(); galleryAudio.forEach(audio => audio.pause()); discardExcerpt(); baseline = Date.now() / 1000; update();
});
play.addEventListener("click", async () => {
  if (player.playing || player.preparing) { player.stop(); return; }
  libraryAudio.pause(); excerpt.pause(); galleryAudio.forEach(audio => audio.pause());
  try { await player.play(recipe); } catch (error) { status.classList.add("error"); status.textContent = String(error); }
});
mute.addEventListener("click", () => {
  muted = !muted; player.setVolume(muted ? 0 : Number(volume.value) / 100);
  excerpt.muted = muted;
  libraryAudio.muted = muted;
  galleryAudio.forEach(audio => { audio.muted = muted; });
  mute.setAttribute("aria-pressed", String(muted)); mute.textContent = muted ? "Rétablir le son" : "Muet";
});
volume.addEventListener("input", () => { element("volume-label").textContent = `${volume.value} %`;
  player.setVolume(muted ? 0 : Number(volume.value) / 100); excerpt.volume = Number(volume.value) / 100;
  libraryAudio.volume = Number(volume.value) / 100;
  galleryAudio.forEach(audio => { audio.volume = Number(volume.value) / 100; }); });
for (const [button, value] of [[a, false], [b, true]] as const) button.addEventListener("click", () => {
  comparison = value; a.classList.toggle("active", !value); b.classList.toggle("active", value);
  a.setAttribute("aria-pressed", String(!value)); b.setAttribute("aria-pressed", String(value)); rebuild();
});

exporting.addEventListener("click", async () => {
  discardLibrary();
  player.stop(); galleryAudio.forEach(audio => audio.pause()); excerpt.pause(); worker?.terminate(); exporting.disabled = true; exportStatus.textContent = "Préparation de l’extrait…";
  const selectedComparison = comparison; const selectedId = selected.id;
  const exportRecipe = recipe; const exportAt = Number(age.value) * DAY + 12.5;
  const rendering = new Worker(workerUrl); worker = rendering;
  rendering.onmessage = event => {
    if (worker !== rendering) return;
    const data = event.data as { progress?: number; bytes?: ArrayBuffer; error?: string };
    if (data.progress !== undefined) exportStatus.textContent = `Préparation · ${Math.round(data.progress * 100)} %`;
    if (data.bytes) {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = URL.createObjectURL(new Blob([data.bytes], { type: "audio/wav" }));
      excerpt.src = downloadUrl; excerpt.hidden = false; excerpt.volume = Number(volume.value) / 100; excerpt.muted = muted;
      download.href = downloadUrl; download.download = `${selectedId}-${selectedComparison ? "B" : "A"}.wav`;
      download.hidden = false; exportStatus.textContent = "Extrait prêt. Lance son écoute ci-dessus ou télécharge-le.";
      exporting.disabled = false; worker?.terminate(); worker = undefined;
    }
    if (data.error) { exportStatus.textContent = data.error; exporting.disabled = false; worker?.terminate(); worker = undefined; }
  };
  rendering.onerror = event => {
    if (worker !== rendering) return;
    exportStatus.textContent = event.message; exporting.disabled = false; rendering.terminate(); worker = undefined;
  };
  try {
    const bank = await bankReady(exportRecipe);
    if (worker === rendering) rendering.postMessage({ recipe: exportRecipe, at: exportAt, seconds: 180, bank });
  } catch (error) {
    if (worker === rendering) { exportStatus.textContent = String(error); exporting.disabled = false; rendering.terminate(); worker = undefined; }
  }
});
excerpt.addEventListener("play", () => { player.stop(); libraryAudio.pause(); galleryAudio.forEach(audio => audio.pause()); });
window.addEventListener("pagehide", () => { player.stop(); worker?.terminate(); libraryWorker?.terminate(); });

function choose(item: Specimen): void {
  count.value = String(item.count); variant.value = String(item.variant); age.value = "45";
  harmony.value = "clear"; position.value = "spread"; comparison = false;
  a.classList.add("active"); b.classList.remove("active"); a.setAttribute("aria-pressed", "true"); b.setAttribute("aria-pressed", "false");
  rebuild();
}

function gallery(): void {
  const mode = element<HTMLSelectElement>("writing-version");
  const readiness = new Map<string, boolean>();
  const versions = { catalogue: VERSION, "catalogue-0.6": "belai-music/0.6.0", "catalogue-0.5": "belai-music/0.5.0", "catalogue-0.4": "belai-music/0.4.0" };
  const refreshVersion = () => {
    const version = versions[mode.value as keyof typeof versions];
    element("gallery-version").textContent = readiness.get(mode.value) ? `18 pistes disponibles · ${version}` : `Les 18 pistes ${version} sont en préparation.`;
  };
  mode.addEventListener("change", refreshVersion);
  const ready = Promise.all(Object.entries(versions).map(async ([directory, version]) => {
    try {
      const response = await fetch(`${directory}/index.json`); if (!response.ok) return;
      const index = await response.json() as { version?: string; librarySha256?: string; items?: unknown[] };
      readiness.set(directory, index.version === version
        && index.librarySha256 === SAMPLE_MANIFEST.sha256 && index.items?.length === 18);
    } catch { readiness.set(directory, false); }
  })).then(() => {
    for (const option of mode.options) option.disabled = !readiness.get(option.value);
    refreshVersion();
  });
  const container = element("gallery");
  for (const size of SIZES) {
    const group = document.createElement("section"); group.className = "size-group";
    const title = document.createElement("h3"); title.textContent = size === 1 ? "1 tige · trois soliflores" : `${size} tiges · trois bouquets`;
    group.appendChild(title);
    const cards = document.createElement("div"); cards.className = "cards";
    for (const item of CATALOGUE.filter(specimen => specimen.count === size)) {
      const card = document.createElement("article"); card.className = "specimen"; card.dataset.specimen = item.id;
      const specimen = specimenRecipe(item);
      const world = worldFor(specimen.seed, "clear", size === 1 ? specimen.stems[0]!.profile.timbre : undefined);
      const biome = document.createElement("span"); biome.className = "biome"; biome.textContent = world.tableau.emotion;
      const name = document.createElement("h4"); name.textContent = item.name;
      const description = document.createElement("p"); description.textContent = item.description;
      const intention = document.createElement("p"); intention.className = "small"; intention.textContent = `${world.tableau.title} · ${world.tableau.gesture}`;
      const audio = document.createElement("audio"); audio.controls = true; audio.preload = "none";
      audio.volume = Number(volume.value) / 100;
      const refreshAudio = () => {
        const available = readiness.get(mode.value);
        audio.pause(); audio.hidden = !available;
        audio.removeAttribute("src");
        if (available) audio.src = `${mode.value}/${item.id}.wav?v=${versions[mode.value as keyof typeof versions]}`;
        intention.hidden = mode.value !== "catalogue";
        biome.textContent = mode.value === "catalogue" ? world.tableau.emotion : size === 1 ? "Soliflore mélodique" : world.biome.name;
        description.textContent = available ? item.description : `${item.description} Les extraits sont en préparation. Explorer permet l’écoute continue de la nouvelle écriture.`;
      };
      ready.then(refreshAudio); mode.addEventListener("change", refreshAudio);
      audio.setAttribute("aria-label", `Extrait de ${item.name}, ${size} ${size === 1 ? "tige" : "tiges"}`);
      galleryAudio.push(audio);
      audio.addEventListener("play", () => {
        player.stop(); libraryAudio.pause(); excerpt.pause(); galleryAudio.forEach(other => { if (other !== audio) other.pause(); });
        status.textContent = `Extrait de ${item.name} · ${versions[mode.value as keyof typeof versions]} · 3 minutes au 45e jour.`;
      });
      audio.addEventListener("error", () => { description.textContent = `${item.description} L’extrait n’est pas disponible ici ; Explorer lance le moteur continu.`; });
      const actions = document.createElement("div"); actions.className = "card-actions";
      const explore = document.createElement("button"); explore.textContent = "Explorer";
      explore.setAttribute("aria-label", `Explorer ${item.name}`);
      explore.addEventListener("click", () => {
        choose(item); element("listen-title").scrollIntoView({ behavior: "instant", block: "start" });
      });
      const save = document.createElement("a"); save.href = `catalogue/${item.id}.wav?v=${VERSION}`; save.download = `${item.id}.wav`; save.textContent = "WAV";
      const refreshSave = () => {
        save.hidden = !readiness.get(mode.value);
        save.href = `${mode.value}/${item.id}.wav?v=${versions[mode.value as keyof typeof versions]}`;
      };
      ready.then(refreshSave); mode.addEventListener("change", refreshSave);
      save.setAttribute("aria-label", `Télécharger ${item.name}`);
      actions.append(explore, save); card.append(biome, name, description, intention, audio, actions); cards.appendChild(card);
    }
    group.appendChild(cards); container.appendChild(group);
  }
}
function discardLibrary(): void {
  libraryWorker?.terminate(); libraryWorker = undefined; libraryButton.disabled = false;
  libraryAudio.pause(); libraryAudio.removeAttribute("src"); libraryAudio.hidden = true;
  if (libraryUrl) { URL.revokeObjectURL(libraryUrl); libraryUrl = undefined; }
  libraryStatus.textContent = "";
}
function describeSound(): void {
  discardLibrary();
  const sound = instrumentFor(librarySound.value as Timbre);
  const samples = SAMPLE_MANIFEST.samples.filter(sample => sample.instrument === sound.id);
  element("library-description").textContent = `${sound.name} · ${sound.kind === "recorded" ? "instrument enregistré" : sound.kind === "texture" ? "texture échantillonnée" : "instrument de synthèse"}${samples.length ? ` · ${samples.length} échantillons` : ""}. L’aperçu joue une phrase originale et ses silences.`;
}
function chooseFamily(): void {
  librarySound.replaceChildren();
  for (const instrument of LIBRARY.filter(sound => sound.family === libraryFamily.value)) {
    const option = document.createElement("option"); option.value = instrument.id; option.textContent = instrument.name; librarySound.appendChild(option);
  }
  describeSound();
}
for (const [family, label] of Object.entries(FAMILIES)) {
  const option = document.createElement("option"); option.value = family; option.textContent = `${label} · ${LIBRARY.filter(sound => sound.family === family as Family).length}`;
  libraryFamily.appendChild(option);
}
libraryFamily.addEventListener("change", chooseFamily); librarySound.addEventListener("change", describeSound);
libraryButton.addEventListener("click", async () => {
  discardExcerpt(); discardLibrary(); player.stop(); galleryAudio.forEach(audio => audio.pause());
  const source = fixture(1); const stem = source.stems[0]!;
  const preview: Recipe = { ...source, stems: [{ ...stem, profile: { ...stem.profile, timbre: librarySound.value as Timbre } }] };
  const rendering = new Worker(workerUrl); libraryWorker = rendering; libraryButton.disabled = true;
  libraryStatus.textContent = "Préparation de l’aperçu…";
  rendering.onmessage = event => {
    if (libraryWorker !== rendering) return;
    const data = event.data as { bytes?: ArrayBuffer; error?: string };
    if (data.bytes) {
      libraryUrl = URL.createObjectURL(new Blob([data.bytes], { type: "audio/wav" }));
      libraryAudio.src = libraryUrl; libraryAudio.hidden = false; libraryAudio.volume = Number(volume.value) / 100; libraryAudio.muted = muted;
      libraryStatus.textContent = "Aperçu prêt · 18 secondes. Lance l’écoute ci-dessous.";
      rendering.terminate(); libraryWorker = undefined; libraryButton.disabled = false;
    }
    if (data.error) { libraryStatus.textContent = data.error; rendering.terminate(); libraryWorker = undefined; libraryButton.disabled = false; }
  };
  rendering.onerror = event => {
    if (libraryWorker !== rendering) return;
    libraryStatus.textContent = event.message; rendering.terminate(); libraryWorker = undefined; libraryButton.disabled = false;
  };
  try {
    const bank = await bankReady(preview);
    if (libraryWorker === rendering) rendering.postMessage({ recipe: preview, at: 45 * DAY, seconds: 18, bank });
  } catch (error) {
    if (libraryWorker === rendering) { libraryStatus.textContent = String(error); rendering.terminate(); libraryWorker = undefined; libraryButton.disabled = false; }
  }
});
libraryAudio.addEventListener("play", () => { player.stop(); excerpt.pause(); galleryAudio.forEach(audio => audio.pause()); });
element("library-count").textContent = `${LIBRARY.length} sons · ${SAMPLE_MANIFEST.samples.length} échantillons · ${Object.keys(FAMILIES).length} familles`;
chooseFamily();
gallery();
rebuild(); setInterval(update, 700);
element("reload-engine").addEventListener("click", () => location.reload());
async function verifyDisplayedVersion(): Promise<void> {
  try {
    const response = await fetch("engine-status.json", { cache: "no-store" }); if (!response.ok) return;
    const deployed = await response.json() as { version: string };
    const outdated = deployed.version !== VERSION;
    element("engine-version").textContent = outdated ? `Cet onglet utilise ${VERSION}. La version ${deployed.version} est disponible.` : `Moteur continu chargé · ${VERSION}`;
    element("reload-engine").hidden = !outdated;
  } catch { /* A standalone package remains playable without the local status endpoint. */ }
}
void verifyDisplayedVersion(); setInterval(() => void verifyDisplayedVersion(), 30_000);
