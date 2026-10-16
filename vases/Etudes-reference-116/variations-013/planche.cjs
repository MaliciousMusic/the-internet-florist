/* Compose a separate overview from the inspected PNGs, using one worker. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
sharp.concurrency(1);
sharp.cache({memory:8, items:2, files:0});
async function main() {
  const ps = 'C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
  let free = 0;
  for (let attempt=0; attempt<8; attempt++) {
    free = Number(cp.execFileSync(ps, ['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'], {encoding:'utf8'}).trim());
    if (free > 4200000000) break;
    if (attempt===0) console.log('Attente de la marge mémoire avant la planche.');
    await new Promise(resolve => setTimeout(resolve,7000));
  }
  if (free <= 4200000000) throw new Error('Marge mémoire toujours insuffisante pour la planche.');
  const layers = [];
  const items = [['013-aurore','Aurore'], ['013-onde','Onde'], ['013-brise','Brise']];
  for (let i=0; i<items.length; i++) {
    const [id, title] = items[i];
    const pixels = await sharp(path.join(__dirname, `${id}-clair.png`)).resize(384,480).png().toBuffer();
    layers.push({input:pixels, left:i*400+8, top:48});
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="44"><text x="200" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#35514b">${title}</text></svg>`);
    layers.push({input:label, left:i*400, top:0});
  }
  await sharp({create:{width:1200,height:544,channels:3,background:'#eee9dd'}}).composite(layers).png().toFile(path.join(__dirname,'apercu-013.png'));
  console.log('Planche séparée des trois SVG repris.');
}
main().catch(error => {console.error(error.message);process.exitCode=1;});
