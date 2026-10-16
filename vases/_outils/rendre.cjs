// Render the new vector studies; never rasterize reference photographs into assets.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..', '_tests');

(async () => {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
  const layers = [];
  for (let row = 0; row < manifest.length; row++) {
    const item = manifest[row];
    for (let column = 0; column < item.variants.length; column++) {
      const variant = item.variants[column];
      const filename = variant.file.replace(/\.svg$/, '.png');
      await sharp(path.join(root, 'svg', variant.file), { density: 144 })
        .resize(960, 1200).png().toFile(path.join(root, 'preview', filename));
      const thumb = await sharp(path.join(root, 'preview', filename)).resize(330, 412).toBuffer();
      layers.push({ input: thumb, left: column * 430 + 50, top: row * 488 + 24 });
      const caption = `<svg width="430" height="60"><text x="38" y="20" font-family="Arial" font-size="15" fill="#344c3c">${item.id} · ${variant.label}</text><text x="38" y="43" font-family="Georgia" font-size="17" fill="#263b30">${item.title}</text></svg>`;
      layers.push({ input: Buffer.from(caption), left: column * 430, top: row * 488 + 425 });
    }
    console.log(`${item.id}: 2 rendered studies`);
  }
  await sharp({ create: { width: 860, height: manifest.length * 488, channels: 4, background: '#f0eee5' } })
    .composite(layers).png().toFile(path.join(root, 'preview', 'planche.png'));
  console.log('Review board created.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
