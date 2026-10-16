/* Inspect the three small native drawings, using one worker and separate PNGs. */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const sharp=require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const ps='C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
sharp.concurrency(1);sharp.cache({memory:8,items:2,files:0});
const root=__dirname;
async function guard(){
  let announced=false;
  while(true){
    const free=Number(cp.execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());
    if(free>4200000000)return free;
    if(!announced){console.log('Attente de la marge mémoire avant les aperçus.');announced=true;}
    await new Promise(resolve=>setTimeout(resolve,8000));
  }
}
async function main(){
  const report=JSON.parse(fs.readFileSync(path.join(root,'verification.json'),'utf8'));
  for(const item of report){
    item.memoryBeforeRender=await guard();item.renders=[];
    for(const [theme,bg] of [['clair','#eee9dd'],['sombre','#182b32']]){
      const output=path.join(root,`${item.id}-${theme}.png`);
      await sharp(path.join(root,item.file),{density:144}).resize(800,1000).flatten({background:bg}).png().toFile(output);
      item.renders.push(path.basename(output));
    }
  }
  fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log('Trois dessins natifs rendus sur deux fonds.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
