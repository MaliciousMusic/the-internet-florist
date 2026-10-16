import { build, transform } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Script } from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
await mkdir(output, { recursive: true });
const bundle = async (entry, format = "iife", define = {}) => {
  const result = await build({ entryPoints: [path.join(root, entry)], bundle: true, write: false,
    platform: "browser", target: "es2022", format, minify: true, legalComments: "none", define });
  return result.outputFiles[0].text;
};
const worklet = await bundle("src/worklet.ts");
const render = await bundle("src/render-worker.ts");
const composition = await bundle("src/composition-worker.ts");
const app = await bundle("src/lab.ts", "iife", {
  __WORKLET_SOURCE__: JSON.stringify(worklet), __RENDER_SOURCE__: JSON.stringify(render), __COMPOSITION_SOURCE__: JSON.stringify(composition),
});
const api = await bundle("src/index.ts", "esm");
const template = await readFile(path.join(root, "lab/index.html"), "utf8");
// A callback keeps minified identifiers such as "$" literal instead of expanding replacement tokens.
const html = template.replace("/* BUNDLE */", () => app.replaceAll("</script", "<\\/script"));
new Script(html.match(/<script>([\s\S]*?)<\/script>/)[1], { filename: "atelier-musique.html" });
const files = { "atelier-musique.html": html, "music.js": api, "worklet.js": worklet, "render-worker.js": render, "composition-worker.js": composition };
const studyApp = await bundle("src/study-lab.ts");
const studyHtml = (await readFile(path.join(root,"lab/phrases.html"),"utf8"))
  .replace("/* STUDY_BUNDLE */",() => studyApp.replaceAll("</script","<\\/script"));
new Script(studyHtml.match(/<script>([\s\S]*?)<\/script>/)[1],{ filename: "atelier-phrases.html" });
files["atelier-phrases.html"] = studyHtml;
const connectedApp = await bundle("src/connected-lab.ts");
const connectedHtml = (await readFile(path.join(root,"lab/connected.html"),"utf8"))
  .replace("/* CONNECTED_BUNDLE */",() => connectedApp.replaceAll("</script","<\\/script"));
new Script(connectedHtml.match(/<script>([\s\S]*?)<\/script>/)[1],{ filename: "atelier-reseaux.html" });
files["atelier-reseaux.html"] = connectedHtml;
files["connected-worker.js"] = await bundle("src/connected-worker.ts");
files['live-worker.js']=await bundle('src/live-worker.ts');
// Read the established drawing order; no botanical source is rewritten.
const repository=path.resolve(root,'../..');
const drawingOrder=/cat a1\.html (p2\.js .*? u3\.js) >/.exec(await readFile(path.join(repository,'demo/src/build.sh'),'utf8'))?.[1].split(' ');
if(!drawingOrder)throw new Error('Missing drawing module order');
let drawingSource='';
for(const name of drawingOrder)drawingSource+=await readFile(path.join(repository,'demo/src',name),'utf8')+'\n';
drawingSource+=await readFile(path.join(repository,'packages/engine/drawing-bridge.js'),'utf8');
const nativeEnd=drawingSource.indexOf('</script>');
if(nativeEnd<0)throw new Error('Missing existing app closing script');
const adapter=await readFile(path.join(repository,'packages/engine/drawing-bridge.js'),'utf8');
const placement=(await transform(await readFile(path.join(repository,'packages/engine/stem-placement.ts'),'utf8'),{loader:'ts',format:'iife',globalName:'BelaiPlacement',target:'es2022'})).code;
const nativeJs=drawingSource.slice(0,nativeEnd)+placement+adapter;
files['flower-drawing.js']=(await transform(nativeJs,{minify:true,target:'es2022',legalComments:'none'})).code;
const drawingHash=createHash('sha256').update(files['flower-drawing.js']).digest('hex');
const musicHash=createHash('sha256').update(files['live-worker.js']).digest('hex');
const flowerDefines={__DRAWING_HASH__:JSON.stringify(drawingHash),__MUSIC_HASH__:JSON.stringify(musicHash)};
const flowerApp=await bundle('src/app-integration.ts','iife',{...flowerDefines,__ASSET_BASE__:JSON.stringify('./')});
const nativeHead=(await readFile(path.join(repository,'demo/src/a1.html'),'utf8')).replace('<script>','');
const integrationCss=await readFile(path.join(root,'lab/integration.css'),'utf8');
files['belai-flower.html']=nativeHead.replace('</head>',`<style>${integrationCss}</style></head>`)+
  `<script src="flower-drawing.js"></script><script>${flowerApp.replaceAll('</script','<\\/script')}</script></body></html>`;
new Script(flowerApp,{filename:'belai-integration.js'});
const publicApp=await bundle('src/app-integration.ts','iife',{...flowerDefines,__ASSET_BASE__:JSON.stringify('./music/')});
const publicHtml=nativeHead.replace('</head>',`<style>${integrationCss}</style></head>`)+
  `<script src="./music/flower-drawing.js"></script><script>${publicApp.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile(path.join(output,'site-index.html'),publicHtml);
files['signature-catalogue.json']=await readFile(path.join(root,'assets/signature-catalogue.json'));
const universes=JSON.parse(await readFile(path.join(root,'assets/universe-manifest.json'),'utf8'));
const universePcm=await readFile(path.join(root,'assets/universes.pcm'));
if(createHash('sha256').update(universePcm).digest('hex')!==universes.sha256)throw new Error('Universe bank integrity mismatch');
for(const [instrument,metadata] of Object.entries(universes.instruments)){
  const records=universes.samples.filter(record=>record.instrument===instrument);
  const chunk=universePcm.subarray(records[0].offset,records[0].offset+metadata.bytes);
  if(createHash('sha256').update(chunk).digest('hex')!==metadata.sha256)throw new Error('Universe chunk integrity mismatch');
  files[`universe-${instrument}-${metadata.sha256.slice(0,12)}.pcm`]=chunk;
}
files['universe-manifest.json']=JSON.stringify(universes,null,2)+'\n';
const samples = JSON.parse(await readFile(path.join(root, "assets/manifest.json"), "utf8"));
const pcm = await readFile(path.join(root, "assets/library.pcm"));
if (createHash("sha256").update(pcm).digest("hex") !== samples.sha256) throw new Error("Sample bank integrity mismatch");
files[`library-${samples.sha256.slice(0, 12)}.pcm`] = pcm;
for (const [instrument, metadata] of Object.entries(samples.instruments)) {
  const records = samples.samples.filter(sample => sample.instrument === instrument);
  const chunk = pcm.subarray(records[0].offset, records[0].offset + metadata.bytes);
  if (createHash("sha256").update(chunk).digest("hex") !== metadata.sha256) throw new Error(`Instrument integrity mismatch: ${instrument}`);
  files[`instrument-${instrument}-${metadata.sha256.slice(0, 12)}.pcm`] = chunk;
}
files["credits.html"] = (await readFile(path.join(root, "assets/credits.html"), "utf8")).replace('</body>',
  `<h2>Bibliothèque VCSL supplémentaire</h2><p>${universes.samples.length} prises de ${universes.families.length} familles. Versilian Studios / contributeurs VCSL. Licence <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>. <a href="https://github.com/sgossner/VCSL/tree/${universes.revision}">Source épinglée</a>.</p><p>Transformations : mono, filtre 8 500 Hz, rééchantillonnage 24 kHz, niveaux bornés, fondus aux extrémités ; maximum cinq secondes par prise.</p><p><a href="universe-manifest.json">Fichiers source, racines et empreintes des prises</a>.</p></body>`);
files["sample-manifest.json"] = JSON.stringify(samples, null, 2) + "\n";
const colours=JSON.parse(await readFile(path.join(root,'assets/colour-manifest.json'),'utf8'));
const colourPcm=await readFile(path.join(root,'assets/colours.pcm'));
if(createHash('sha256').update(colourPcm).digest('hex')!==colours.sha256)throw new Error('Colour bank integrity mismatch');
for(const [instrument,metadata] of Object.entries(colours.instruments)){
  const records=colours.samples.filter(sample=>sample.instrument===instrument);
  const chunk=colourPcm.subarray(records[0].offset,records[0].offset+metadata.bytes);
  if(createHash('sha256').update(chunk).digest('hex')!==metadata.sha256)throw new Error('Colour chunk integrity mismatch');
  files[`colour-${instrument}-${metadata.sha256.slice(0,12)}.pcm`]=chunk;
}
files['colour-manifest.json']=JSON.stringify(colours,null,2)+'\n';
files['writing-catalogue.json']=await readFile(path.join(root,'assets/writing-catalogue.json'));
files['reference-summary.json']=await readFile(path.join(root,'assets/reference-summary.json'));
const manifest = {};
for (const [name, content] of Object.entries(files)) {
  await writeFile(path.join(output, name), content);
  manifest[name] = { bytes: Buffer.byteLength(content), sha256: createHash("sha256").update(content).digest("hex") };
}
await writeFile(path.join(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const engineVersion = /export const VERSION = "([^"]+)"/.exec(await readFile(path.join(root, "src/model.ts"), "utf8"))?.[1];
if (!engineVersion) throw new Error("Missing music version");
await writeFile(path.join(output, "engine-status.json"), JSON.stringify({ version: engineVersion,
  htmlSha256: manifest["atelier-musique.html"].sha256, bankSha256: samples.sha256 }, null, 2) + "\n");
console.log(JSON.stringify({files:Object.keys(manifest).length,bytes:Object.values(manifest).reduce((total,file)=>total+file.bytes,0),drawingHash,flowerHtmlSha256:manifest['belai-flower.html'].sha256}));
