/* Render sequentially with one worker and a strict memory margin. */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const sharp=require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const ps='C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
sharp.concurrency(1);sharp.cache({memory:8,items:2,files:0});
async function guard(){
 let shown=false;
 while(true){
  const free=Number(cp.execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());
  if(free>4200000000)return free;
  if(!shown){console.log('Attente de la marge mémoire de 4,2 Go.');shown=true;}
  await new Promise(resolve=>setTimeout(resolve,8000));
 }
}
async function main(){
 const report=JSON.parse(fs.readFileSync(path.join(__dirname,'verification.json'),'utf8'));
 const selected=process.argv.slice(2);
 fs.mkdirSync(path.join(__dirname,'apercus'),{recursive:true});
 for(const item of report.items){
  if(selected.length&&!selected.includes(item.id))continue;
  item.renders=[];item.memoryBeforeRender=[];
  for(const [theme,bg] of [['clair','#ece8de'],['sombre','#1f2c28']]){
   item.memoryBeforeRender.push(await guard());
   const target=`apercus/${item.id}-${theme}.png`;
   await sharp(path.join(__dirname,'svg',`${item.id}.svg`),{density:144}).resize(640,800).flatten({background:bg}).png().toFile(path.join(__dirname,target));
   item.renders.push(target);
  }
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(`${item.id} : deux fonds rendus.`);
 }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
