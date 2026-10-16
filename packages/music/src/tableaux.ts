import type { Timbre } from "./library.ts";

export interface Tableau {
  readonly title: string; readonly emotion: string; readonly gesture: string;
  readonly motifs: readonly (readonly number[])[]; readonly rhythm: readonly number[];
  readonly progression: readonly number[]; readonly density: readonly number[];
  readonly leads: readonly Timbre[]; readonly replies: readonly Timbre[];
  readonly warmth: number; readonly breath: number; readonly intimacy: number;
}

// Original phrase grammars give each world an intention before flowers articulate it together.
export const TABLEAUX: readonly Tableau[] = Object.freeze(([
  { title: "Matin doré", emotion: "Joie tendre", gesture: "Une ascension ronde, puis une réponse qui revient doucement à la maison.",
    motifs: [[0,2,4,4,3,2,1,0], [2,3,4,2,1,2,1,0]], rhythm: [1.5,.65,.85,1.7,.7,1,.8,2],
    progression: [0,5,9,7], density: [.58,.7,.85,.62,1,.27,.72,.4], leads: ["warm-organ","fm-piano","marimba"], replies: ["flute","piano"], warmth: .72, breath: .68, intimacy: .7 },
  { title: "L’eau qui scintille", emotion: "Émerveillement", gesture: "De petites cascades qui se répondent, avec de longues éclaircies.",
    motifs: [[4,3,2,0,1,2,1,0], [0,2,3,4,2,1,2,0]], rhythm: [.6,.7,.8,2.2,.6,1,1,2.1],
    progression: [0,7,9,5], density: [.5,.68,.88,.55,1,.25,.76,.4], leads: ["harp","kalimba"], replies: ["fm-vibes"], warmth: .52, breath: .58, intimacy: .55 },
  { title: "Souvenir sous verre", emotion: "Nostalgie lumineuse", gesture: "Un motif de piano retenu, son écho et une arrivée apaisée.",
    motifs: [[2,2,3,4,3,2,1,0], [4,3,2,1,2,1,0,0]], rhythm: [1.7,.8,1,1.5,.75,1.2,1,2.5],
    progression: [0,9,5,0], density: [.52,.68,.82,.59,.95,.25,.8,.42], leads: ["piano","harp"], replies: ["celesta","glockenspiel"], warmth: .85, breath: .85, intimacy: .9 },
  { title: "Sentier secret", emotion: "Mystère féerique", gesture: "Une question de bois graves, une éclaircie et un retour feutré.",
    motifs: [[0,1,0,3,2,1,1,0], [2,1,0,1,3,2,1,0]], rhythm: [2,.7,1.5,.7,1.2,.8,1.1,2.4],
    progression: [0,3,7,0], density: [.48,.65,.8,.55,.94,.24,.74,.38], leads: ["clarinet","bassoon"], replies: ["marimba","bamboo"], warmth: .8, breath: .95, intimacy: .75 },
  { title: "Horizon calme", emotion: "Sérénité", gesture: "Deux arches lentes et des réponses espacées au-dessus des vagues.",
    motifs: [[0,0,2,3,2,1,0,0], [2,3,4,3,2,1,1,0]], rhythm: [2.4,1,1.2,2,1.3,1,1.3,3],
    progression: [0,5,0,7], density: [.45,.6,.77,.5,.9,.2,.7,.35], leads: ["piano","flute-vibrato"], replies: ["fm-vibes","cloud"], warmth: .9, breath: 1, intimacy: .65 },
  { title: "Promenade de sable", emotion: "Joie tendre", gesture: "Des cordes pincées qui avancent puis se reposent, sans percussion imposée.",
    motifs: [[0,2,1,3,2,4,2,0], [4,2,3,1,2,1,0,0]], rhythm: [.85,1.3,.65,1.5,.75,1,.8,2.2],
    progression: [0,7,5,0], density: [.6,.75,.92,.62,1,.3,.8,.43], leads: ["koto","zither","harp"], replies: ["dulcimer","cello-pizz"], warmth: .65, breath: .6, intimacy: .7 },
  { title: "Premier ciel", emotion: "Émerveillement", gesture: "Un sommet lumineux, puis une descente qui laisse les cloches respirer.",
    motifs: [[0,2,3,4,5,3,2,0], [2,1,2,3,4,3,1,0]], rhythm: [1.2,.85,1.4,1.7,.8,1.3,.9,2.6],
    progression: [0,9,7,0], density: [.5,.68,.86,.55,.98,.24,.76,.4], leads: ["piano","moon-bell"], replies: ["viola","velvet"], warmth: .72, breath: .85, intimacy: .5 },
  { title: "Lettre au jardin", emotion: "Nostalgie lumineuse", gesture: "Une mélodie chantée, des cordes qui l’écoutent et une réponse chaleureuse.",
    motifs: [[2,3,4,3,2,1,2,0], [4,4,3,2,1,2,1,0]], rhythm: [1.8,.85,1.2,1.5,.8,1.1,1.1,2.5],
    progression: [0,9,5,7], density: [.6,.74,.9,.64,1,.3,.87,.48], leads: ["piano","oboe"], replies: ["clarinet","viola","cello"], warmth: .83, breath: .78, intimacy: .8 },
  { title: "Lucioles lointaines", emotion: "Mystère féerique", gesture: "Des appels rares dans le grave, puis quelques étoiles qui leur répondent.",
    motifs: [[0,3,2,0,1,3,1,0], [3,2,1,2,0,1,0,0]], rhythm: [2.5,.8,1.4,2,.65,1.4,1,2.8],
    progression: [0,7,10,0], density: [.46,.62,.8,.52,.93,.22,.71,.37], leads: ["harp","fm-vibes"], replies: ["crystal","halo"], warmth: .88, breath: 1, intimacy: .45 },
  { title: "Bonjour au village", emotion: "Joie tendre", gesture: "Un refrain de cordes pincées et de petites conversations souriantes.",
    motifs: [[0,2,2,4,3,2,1,0], [2,1,2,3,2,1,0,0]], rhythm: [1.2,.75,1.1,1.6,.7,1,.8,2.1],
    progression: [0,5,9,7], density: [.63,.76,.91,.66,1,.3,.85,.46], leads: ["ukulele","toy-piano"], replies: ["accordion","clarinet-short","nylon-guitar"], warmth: .7, breath: .62, intimacy: .92 },
  { title: "La clairière cachée", emotion: "Mystère féerique", gesture: "L’ocarina pose une question ; des cordes légères lui trouvent une réponse.",
    motifs: [[0,1,3,2,1,0,2,0], [3,2,1,0,1,2,1,0]], rhythm: [1.8,.7,1.6,.85,1.4,.75,1.2,2.2],
    progression: [0,9,7,0], density: [.5,.68,.86,.57,.98,.27,.77,.42], leads: ["ocarina","recorder"], replies: ["violin-pizz","thumb-piano"], warmth: .75, breath: .82, intimacy: .75 },
  { title: "Petite ronde", emotion: "Joie tendre", gesture: "Une boîte à musique dessine une boucle simple et reconnaissable.",
    motifs: [[0,2,4,2,3,2,1,0], [2,3,2,1,0,1,2,0]], rhythm: [1,.65,1.4,.65,1.15,.7,.95,2.4],
    progression: [0,7,9,0], density: [.6,.72,.89,.6,.99,.29,.81,.43], leads: ["music-box","toy-piano"], replies: ["celesta-round","hollow-pluck"], warmth: .82, breath: .68, intimacy: .95 },
  { title: "Fontaine des souhaits", emotion: "Émerveillement", gesture: "Une harpe ouvre une arche ; les flûtes prolongent son scintillement.",
    motifs: [[0,1,2,4,3,2,1,0], [4,3,1,2,3,2,1,0]], rhythm: [.8,1,1.2,1.8,.75,1.1,.9,2.6],
    progression: [0,9,5,7], density: [.54,.71,.88,.6,1,.26,.81,.42], leads: ["harp","panpipe"], replies: ["tongue-drum","water-marble"], warmth: .6, breath: .7, intimacy: .55 },
  { title: "La maison s’endort", emotion: "Sérénité", gesture: "Une berceuse descend doucement et laisse de grandes fenêtres de silence.",
    motifs: [[3,2,2,1,2,1,0,0], [0,1,2,1,3,2,1,0]], rhythm: [2,1,1.5,1.1,1.5,1.1,1.3,3],
    progression: [0,9,0,7], density: [.43,.58,.74,.5,.87,.2,.67,.34], leads: ["lullaby-pad","silk-strings","harp"], replies: ["firefly","round-sine"], warmth: .95, breath: 1, intimacy: .9 },
] satisfies readonly Tableau[]).map(item => Object.freeze({ ...item,
  motifs: Object.freeze(item.motifs.map(cell => Object.freeze(cell))), rhythm: Object.freeze(item.rhythm),
  progression: Object.freeze(item.progression), density: Object.freeze(item.density),
  leads: Object.freeze(item.leads), replies: Object.freeze(item.replies) })));
