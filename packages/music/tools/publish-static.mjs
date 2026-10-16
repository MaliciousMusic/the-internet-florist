import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Only the verified application assets enter the repository's static entry point.
const root=fileURLToPath(new URL('../../../',import.meta.url)),dist=new URL('../dist/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('manifest.json',dist),'utf8'));
const names=Object.keys(manifest).filter(name=>/^(instrument|colour|universe)-.*\.pcm$/.test(name)||
  ['flower-drawing.js','live-worker.js','worklet.js','credits.html','sample-manifest.json','colour-manifest.json','universe-manifest.json','signature-catalogue.json'].includes(name));
const directory=path.join(root,'music');await mkdir(directory,{recursive:true});
const published={};
for(const name of names){const bytes=await readFile(new URL(name,dist)),metadata=manifest[name];
  if(bytes.length!==metadata.bytes||createHash('sha256').update(bytes).digest('hex')!==metadata.sha256)throw new Error(`Damaged publication asset ${name}`);
  const target=path.join(directory,name);let unchanged=false;
  try{const previous=await readFile(target);unchanged=previous.length===metadata.bytes&&createHash('sha256').update(previous).digest('hex')===metadata.sha256;}
  catch(error){if(error.code!=='ENOENT')throw error;}
  // Avoid rewriting unchanged banks while the local player can be reading them.
  if(!unchanged)await writeFile(target,bytes);published[name]=metadata;
}
const html=await readFile(new URL('site-index.html',dist));
await writeFile(path.join(root,'index.html'),html);
await writeFile(path.join(directory,'manifest.json'),JSON.stringify({index:{bytes:html.length,sha256:createHash('sha256').update(html).digest('hex')},files:published},null,2)+'\n');
console.log(JSON.stringify({assets:names.length,bytes:Object.values(published).reduce((sum,file)=>sum+file.bytes,html.length),indexSha256:createHash('sha256').update(html).digest('hex')}));
