const path = require('node:path');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..', '_tests', 'reprise');
(async () => {
  const image = await sharp(path.join(root, '005-feuillage-v2.svg'), { density: 96 }).resize(1200, 1500).png().toBuffer();
  await sharp(image).toFile(path.join(root, '005-feuillage-v2.png'));
  await sharp({ create: { width: 1200, height: 1500, channels: 4, background: '#e9e6db' } })
    .composite([{ input: image }]).png().toFile(path.join(root, '005-feuillage-v2-ivoire.png'));
  console.log('Volume study rendered.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
