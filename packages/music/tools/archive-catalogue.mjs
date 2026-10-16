import { readFile, mkdir, copyFile, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";

const current = new URL("../dist/catalogue/", import.meta.url);
const index = JSON.parse(await readFile(new URL("index.json", current), "utf8"));
const version = /^belai-music\/(0\.[456])\.0$/.exec(index.version)?.[1];
if (!version || index.items?.length !== 18) throw new Error("Une galerie 0.4, 0.5 ou 0.6 complète est requise avant son remplacement.");
const previous = new URL(`../dist/catalogue-${version}/`, import.meta.url);
await mkdir(previous, { recursive: true });
for (const item of index.items) {
  if (!/^bouquet-(1|5|12|40|80|350)-[1-3]$/.test(item.id) || item.seconds !== 180) throw new Error("Invalid baseline specimen");
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(new URL(`${item.id}.wav`, current))) digest.update(chunk);
  if (digest.digest("hex") !== item.wavSha256) throw new Error(`Baseline integrity mismatch: ${item.id}`);
  await copyFile(new URL(`${item.id}.wav`, current), new URL(`${item.id}.wav`, previous));
  await copyFile(new URL(`${item.id}.json`, current), new URL(`${item.id}.json`, previous));
}
await writeFile(new URL("index.json", previous), JSON.stringify(index, null, 2) + "\n");
console.log(`18 écoutes originales ${version} conservées pour comparaison.`);
