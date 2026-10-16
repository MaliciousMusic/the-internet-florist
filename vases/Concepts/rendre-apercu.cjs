/* Render representative SVG concepts sequentially, without a browser. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
sharp.concurrency(1);
sharp.cache({memory:16,files:0,items:8});
const root = __dirname;
const concepts = JSON.parse(fs.readFileSync(path.join(root,'concepts.json'),'utf8'));
async function main() {
  const sample = [...concepts.slice(0,20),...concepts.slice(240,260)];
  const cols=8, w=150, h=230;
  const items=[];
  for(let i=0;i<sample.length;i++) {
    const c=sample[i];
    const left=(i%cols)*w, top=Math.floor(i/cols)*h;
    const input=await sharp(path.join(root,c.file)).resize(150,200).png().toBuffer();
    items.push({input,left,top});
    const label=Buffer.from(`<svg width="150" height="30"><text x="75" y="12" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#263c30">${c.id} · ${c.family}</text><text x="75" y="25" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#69776a">${c.shape}</text></svg>`);
    items.push({input:label,left,top:top+200});
  }
  await sharp({create:{width:cols*w,height:5*h,channels:4,background:'#f4f1e8'}}).composite(items).png().toFile(path.join(root,'apercu-40.png'));
  console.log('Aperçu de 40 concepts : 20 familles, deux variations chacune.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
