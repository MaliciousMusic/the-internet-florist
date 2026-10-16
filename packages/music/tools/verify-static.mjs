import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const root=new URL('../../../',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('music/manifest.json',root),'utf8'));
const verify=(bytes,metadata)=>{if(bytes.length!==metadata.bytes||createHash('sha256').update(bytes).digest('hex')!==metadata.sha256)throw new Error('Published asset mismatch');};
const index=await readFile(new URL('index.html',root));verify(index,manifest.index);
const html=index.toString('utf8');
if(!html.includes('src="./music/flower-drawing.js"')||!html.includes('id="flBq"')||!html.includes('id="mdBq"'))throw new Error('Missing established app');
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Script(match[1]);
for(const [name,metadata]of Object.entries(manifest.files)){
  if(!/^[a-zA-Z0-9.-]+$/.test(name))throw new Error('Unexpected public asset path');
  verify(await readFile(new URL('music/'+name,root)),metadata);
}
console.log(`Index et ${Object.keys(manifest.files).length} ressources publiques vérifiés.`);
