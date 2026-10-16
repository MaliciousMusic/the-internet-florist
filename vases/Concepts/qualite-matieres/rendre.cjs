/* Render sequentially with one worker and a strict free-memory guard. */
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const ps = 'C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
sharp.concurrency(1);
sharp.cache({memory:8, files:0, items:4});
const root = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(root,'comparaison.json'),'utf8'));
const report = {renders:[], memory:[], engine:'sharp / librsvg, un seul worker'};
const cacheFile=path.join(root,'cache-rendus.json');
const cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile,'utf8')):{};
function memory() {
  const free = Number(execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'], {encoding:'utf8'}).trim());
  report.memory.push(free);
  if(free <= 4000000000) throw new Error(`RAM libre sous 4 Go : ${free}`);
}
async function main() {
  memory();
  for(const [theme, background] of [['clair','#eeeadd'],['sombre','#182018']]) {
    const tiles=[];
    for(let i=0;i<data.samples.length;i++) {
      memory();
      const s=data.samples[i];
      const file=path.join(root,'apercus',`${s.id}-${theme}.png`);
      const key=`${s.id}-${theme}`;
      const digest=createHash('sha256').update(fs.readFileSync(path.join(root,s.after))).digest('hex');
      if(cache[key]!==digest || !fs.existsSync(file)) {
        const input=await sharp(path.join(root,s.after),{density:120}).resize(900,1200).png().toBuffer();
        await sharp({create:{width:900,height:1200,channels:4,background}}).composite([{input}]).png().toFile(file);
        cache[key]=digest;
        fs.writeFileSync(cacheFile,JSON.stringify(cache,null,2)+'\n');
      }
      const small=await sharp(file).resize(240,320).png().toBuffer();
      tiles.push({input:small,left:(i%4)*240,top:Math.floor(i/4)*344});
      const label=Buffer.from(`<svg width="240" height="24"><text x="120" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${theme==='clair'?'#344337':'#d9dfce'}">${s.id} · ${s.material.replace(/&/g,'&amp;')}</text></svg>`);
      tiles.push({input:label,left:(i%4)*240,top:Math.floor(i/4)*344+320});
      report.renders.push(`${s.id}-${theme}`);
    }
    await sharp({create:{width:960,height:1376,channels:4,background}}).composite(tiles).png().toFile(path.join(root,'apercus',`planche-${theme}.png`));
  }
  fs.writeFileSync(path.join(root,'verification-rendus.json'), JSON.stringify(report,null,2)+'\n');
  console.log('32 aperçus à 900 × 1200 et deux planches, rendus successifs.');
}
main().catch(error=>{fs.writeFileSync(path.join(root,'verification-rendus.json'),JSON.stringify({...report,error:error.message},null,2)+'\n');console.error(error.message);process.exitCode=1;});
