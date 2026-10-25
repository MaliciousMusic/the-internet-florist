// Animated preview of a pose cycle: frames rendered by resvg, assembled by ffmpeg into an animated WebP.
// node anime.mjs <species> <out.webp> <pose> <az> <el> <frames: comma list of frame values> <fps> [tile]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { espece } from './espece.mjs';

const [id, out, pose, az, el, framesS, fps, tileS = '420'] = process.argv.slice(2);
const { META, draw } = await espece(id);
const tile = +tileS, dir = mkdtempSync(join(tmpdir(), 'insecte-'));
framesS.split(',').forEach((f, i) => {
  const svg = draw(+az, +el, { pose, frame: +f, size: tile, k: tile / (META.span * 0.72), bg: '#efe9df' });
  writeFileSync(join(dir, `f${String(i).padStart(3, '0')}.png`), new Resvg(svg).render().asPng());
});
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', join(dir, 'f%03d.png'), '-loop', '0', '-quality', '88', out]);
rmSync(dir, { recursive: true });
console.log(out);
