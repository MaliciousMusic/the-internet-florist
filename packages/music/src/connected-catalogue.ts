import { fixture,fixtureSeed } from "./fixtures.ts";
import { createProfile,freezeRecipe,unit,type Profile,type Recipe } from "./model.ts";
import type { Timbre } from "./library.ts";

export const CONNECTED_SIZES = [5,12,40,80,350] as const;
export interface ConnectedSpecimen { readonly id: string; readonly name: string; readonly count: number; readonly variant: number }
const names = ["Matin de poche","Le sentier des lucioles","Une ronde au jardin","La maison des songes","La prairie en fête","Les lanternes du sous-bois","Les jardins de l’aurore","La forêt de cristal","Le grand réveil des fleurs","Une nuit aux mille lanternes"];
export const CONNECTED_CATALOGUE: readonly ConnectedSpecimen[] = CONNECTED_SIZES.flatMap((count,size) => [0,1].map(variant => ({
  id: `reseau-${count}-${variant + 1}`,name: names[size * 2 + variant]!,count,variant,
})));
export const REFERENCE_SKUS = [6,334,376,703,802,1952,2541,285,506,345,401,2544] as const;
const palettes: readonly (readonly Timbre[])[] = [
  ["piano","harp","flute","clarinet","oboe","cello","viola","violin","horn","bass-pizz","violin-pizz","cello-pizz","marimba","nylon-guitar","ukulele","toy-piano","recorder","ocarina","stream","birds"],
  ["harp","flute-vibrato","oboe","clarinet","bassoon","strings","cello","viola","bass-pizz","violin-pizz","horn","music-box","celesta-round","panpipe","ocarina","silk-strings","lullaby-pad","thumb-piano","forest","wind"],
];
function profileFor(specimen: ConnectedSpecimen,index: number): Profile {
  const base = 9_000_000 + specimen.count * 1_000_000 + specimen.variant * 500_000 + index * 1000;
  // These illustrative recipes select existing deterministic identities; no SKU fixes an instrument.
  const palette = index < 5 ? palettes[specimen.variant]!.filter(id => !["birds","stream","forest","wind"].includes(id)) : palettes[specimen.variant]!;
  for (let candidate = 0; candidate < 10000; candidate++) {
    const profile = createProfile(fixtureSeed(base + candidate));
    if (palette.includes(profile.timbre)) return profile;
  }
  throw new Error("Cannot prepare illustrative sound identity");
}
export function connectedRecipe(specimen: ConnectedSpecimen): Recipe {
  const recipe = fixture(specimen.count);
  const seed = fixtureSeed(8_000_000 + specimen.count * 10 + specimen.variant);
  const angle = unit(seed,881) * Math.PI * 2;
  const stretch = .58 + unit(seed,882) * .35;
  return freezeRecipe({ ...recipe,seed,stems: recipe.stems.map((stem,i) => ({ ...stem,
    sku: REFERENCE_SKUS[(i * 7 + specimen.variant * 3) % Math.min(REFERENCE_SKUS.length,specimen.count)]!,
    profile: profileFor(specimen,i),position: {
      x: (stem.position.x * Math.cos(angle) - stem.position.y * Math.sin(angle)) * stretch,
      y: stem.position.x * Math.sin(angle) + stem.position.y * Math.cos(angle),
      z: stem.position.z * (.25 + unit(seed,883) * .7),
    },
  })) });
}
