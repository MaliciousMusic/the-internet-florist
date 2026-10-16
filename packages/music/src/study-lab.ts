import { createStudy, STUDY_IDS, STUDY_VERSION } from "./studies.ts";

const container = document.getElementById("studies")!;
const players: HTMLAudioElement[] = [];
const readiness = document.getElementById("readiness")!;
let ready = false;
for (const id of STUDY_IDS) {
  const study = createStudy(id);
  const card = document.createElement("article"); card.className = `card ${id}${id === "orchestra" ? " featured" : ""}`;
  const scene = document.createElement("div"); scene.className = "scene"; scene.setAttribute("aria-hidden","true");
  const body = document.createElement("div"); body.className = "body";
  const count = document.createElement("div"); count.className = "number";
  count.textContent = id === "solo" ? "1 fleur · solo" : `${study.count} fleurs · ${id === "chamber" ? "petit ensemble" : "orchestre"}`;
  const length = document.createElement("span"); length.textContent = `${Math.round(study.seconds)} s`; count.append(length);
  const heading = document.createElement("h2"); heading.textContent = study.title;
  const colour = document.createElement("div"); colour.className = "colour"; colour.textContent = study.colour;
  const description = document.createElement("p"); description.className = "description"; description.textContent = study.intention;
  const audio = document.createElement("audio"); audio.controls = true; audio.preload = "metadata"; audio.volume = .65;
  audio.setAttribute("aria-label",`Écouter ${study.title}, ${study.count} ${study.count === 1 ? "fleur" : "fleurs"}`);
  const source = `studies/${id}.wav?v=${STUDY_VERSION}`;
  const actions = document.createElement("div"); actions.className = "actions";
  const links = document.createElement("div"); links.className = "links";
  const download = document.createElement("a"); download.href = source; download.download = `${id}.wav`; download.textContent = "Emporter le WAV";
  const score = document.createElement("a"); score.href = `studies/${id}.json`; score.download = `${id}-partition.json`; score.textContent = "Partition";
  links.append(download,score);
  const status = document.createElement("div"); status.className = "status"; status.setAttribute("aria-live","polite");
  let pending: number | undefined;
  function seek(seconds: number): void {
    pending = seconds;
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) { audio.currentTime = seconds; pending = undefined; }
  }
  for (const index of [0,3]) {
    const button = document.createElement("button"); button.type = "button";
    button.textContent = index === 0 ? "Depuis le début" : "Retour lumineux";
    button.setAttribute("aria-label",`${button.textContent} : ${study.title}`);
    button.disabled = true;
    button.addEventListener("click",() => { seek(study.sections[index]!.seconds); void audio.play().catch(() => { status.textContent = "Appuie sur lecture pour écouter."; }); });
    actions.append(button);
  }
  audio.addEventListener("loadedmetadata",() => { if (pending !== undefined) seek(pending); });
  audio.addEventListener("play",() => { players.forEach(other => { if (other !== audio) other.pause(); }); card.classList.add("playing"); });
  audio.addEventListener("pause",() => card.classList.remove("playing"));
  audio.addEventListener("ended",() => { card.classList.remove("playing"); status.textContent = "Fin de la miniature."; });
  audio.addEventListener("timeupdate",() => {
    if (!audio.ended) status.textContent = [...study.sections].reverse().find(section => section.seconds <= audio.currentTime)?.title ?? "";
  });
  audio.addEventListener("error",() => { status.textContent = "Cette écoute est indisponible. Recharge la page dans un instant."; });
  body.append(count,heading,colour,description,audio,actions,links,status); card.append(scene,body); container.append(card); players.push(audio);
}
async function verify(): Promise<void> {
  try {
    const response = await fetch("studies/index.json",{ cache: "no-store" });
    if (!response.ok) throw new Error("Missing studies");
    const index = await response.json() as { version: string; items: { id: string; version: string; seconds: number; scoreSha256: string }[] };
    if (index.version !== STUDY_VERSION || index.items.length !== 3
      || !STUDY_IDS.every(id => index.items.some(item => item.id === id && item.version === STUDY_VERSION
        && item.seconds === createStudy(id).seconds))) throw new Error("Outdated studies");
    for (const id of STUDY_IDS) {
      const digest = new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(createStudy(id)))));
      const hex = Array.from(digest,byte => byte.toString(16).padStart(2,"0")).join("");
      if (index.items.find(item => item.id === id)!.scoreSha256 !== hex) throw new Error("Changed study score");
    }
    ready = true;
    for (let i = 0; i < players.length; i++) players[i]!.src = `studies/${STUDY_IDS[i]}.wav?v=${STUDY_VERSION}`;
    container.querySelectorAll<HTMLButtonElement>("button").forEach(button => { button.disabled = false; });
    readiness.textContent = "Trois écoutes prêtes · commence par l’orchestre de 80 fleurs pour entendre l’ensemble.";
  } catch { readiness.textContent = "Les écoutes se préparent. Cette page les affichera dès qu’elles seront prêtes."; }
}
void verify();
const timer = window.setInterval(() => { if (!ready) void verify(); else window.clearInterval(timer); },15_000);
window.addEventListener("pagehide",() => { players.forEach(audio => audio.pause()); window.clearInterval(timer); });
