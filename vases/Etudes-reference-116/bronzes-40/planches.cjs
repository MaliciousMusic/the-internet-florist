/* Compose separate inspection sheets after sequential rendering, with one worker. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const sharp=require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const ps='C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
sharp.concurrency(1);sharp.cache({memory:8,items:2,files:0});
async function guard(){let shown=false;while(true){const free=Number(cp.execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());if(free>4200000000)return free;if(!shown){console.log('Attente de la marge mémoire pour les planches.');shown=true;}await new Promise(resolve=>setTimeout(resolve,8000));}}
async function main(){
 const items=JSON.parse(fs.readFileSync(path.join(__dirname,'compositions.json'),'utf8')).items;
 fs.mkdirSync(path.join(__dirname,'planches'),{recursive:true});
 for(let family=1;family<=10;family++){
  for(const [theme,background,ink]of [['clair','#ece8de','#344338'],['sombre','#1f2c28','#dadcc9']]){
   await guard();const layers=[];
   const group=items.filter(i=>i.family===family);
   for(let i=0;i<group.length;i++){
    const item=group[i];const pixels=await sharp(path.join(__dirname,`apercus/${item.id}-${theme}.png`)).resize(320,400).png().toBuffer();
    layers.push({input:pixels,left:i*320,top:36});
    const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="36"><text x="160" y="24" text-anchor="middle" font-family="sans-serif" font-size="13" fill="${ink}">${item.id} · ${item.label}</text></svg>`);
    layers.push({input:label,left:i*320,top:0});
   }
   await sharp({create:{width:1280,height:444,channels:3,background}}).composite(layers).png().toFile(path.join(__dirname,`planches/${String(family).padStart(2,'0')}-${theme}.png`));
  }
  console.log(`Volume ${family} : planches claire et sombre.`);
 }
 // A compact overview contains one of each mount / ornament pairing per volume.
 await guard();const overview=[];
 for(let family=1;family<=10;family++){
  const pic=await sharp(path.join(__dirname,`planches/${String(family).padStart(2,'0')}-clair.png`)).resize(800,278).png().toBuffer();
  const left=(family-1)%2*800,top=Math.floor((family-1)/2)*304;
  const title=items.find(i=>i.family===family).name;
  const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="26"><text x="400" y="19" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="#334634">${String(family).padStart(2,'0')} · ${title}</text></svg>`);
  overview.push({input:label,left,top},{input:pic,left,top:top+26});
 }
 await sharp({create:{width:1600,height:1520,channels:3,background:'#ece8de'}}).composite(overview).png().toFile(path.join(__dirname,'apercu-40.png'));
 console.log('Vue séparée des quarante compositions.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
