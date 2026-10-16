// Render one native SVG study on three backgrounds for material inspection.
const path = require('node:path');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..', '_tests', 'fidele');
(async () => {
  const buffer = await sharp(path.join(root, '005-verre-vert.svg'), { density: 144 }).resize(1400,1400).png().toBuffer();
  await sharp(buffer).toFile(path.join(root, '005-verre-vert.png'));
  for (const [name, background] of [['sombre','#182018'],['ivoire','#eeeadd']]) {
    await sharp({ create: { width: 1400, height: 1400, channels: 4, background } })
      .composite([{input:buffer}]).png().toFile(path.join(root, `005-verre-vert-${name}.png`));
  }
  console.log('Transparent SVG preview and two material backgrounds rendered.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
