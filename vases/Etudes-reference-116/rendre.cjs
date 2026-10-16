/* Render one native study at a time; retain independent transparent controls. */
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const sharp=require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const ps='C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
sharp.concurrency(1);sharp.cache({memory:8,files:0,items:2});
const root=__dirname;
const ids=process.argv.slice(2);
async function guard(){
  while(true){
    const free=Number(execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());
    if(free>4000000000)return free;
    console.log(`Garde mémoire : ${(free/1e9).toFixed(2)} Go libres, attente.`);
    await new Promise(r=>setTimeout(r,12000));
  }
}
async function main(){
  for(const file of fs.readdirSync(path.join(root,'svg')).filter(x=>x.endsWith('.svg')).sort()){
    const id=file.slice(0,3);if(ids.length&&!ids.includes(id))continue;
    await guard();
    const svg=path.join(root,'svg',file);
    await sharp(svg,{density:72,limitInputPixels:10000000}).png().toFile(path.join(root,'apercus',`${id}-natif.png`));
    const input=await sharp(svg,{density:72}).resize(600,800,{fit:'contain',background:'#eee9dd'}).flatten({background:'#eee9dd'}).png().toBuffer();
    await sharp(input).png().toFile(path.join(root,'apercus',`${id}-clair.png`));
    console.log(`${id} : rendu SVG natif contrôlable.`);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
