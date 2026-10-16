// Versioning of the vase review, from the command line (Claude's side):
//   node revue-vases/version.mjs livrer <id> "<what changed>"   a corrected vase: version + 1, its sent notes treated, its sent scale
//                                                                 written into the engine, back to review
//   node revue-vases/version.mjs echelles                        writes the scales set by the owner into VSC (app/v1a.js)
//   node revue-vases/version.mjs etat                            where the review stands
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readState, writeState, sheet, statusOf } from './state.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = path.join(ROOT, 'app', 'v1a.js');
const [cmd, ...args] = process.argv.slice(2);
const s = readState();

// writes the scales of the given vases (all pending ones when none given) into VSC, the engine's table of review scales
function writeScales(only) {
  const src = fs.readFileSync(ENGINE, 'utf8');
  const m = src.match(/const VSC=(\{[^\n]*\});/);
  if (!m) { console.error('VSC introuvable dans app/v1a.js'); process.exit(1); }
  const vsc = JSON.parse(m[1].replace(/'/g, '"'));
  const changed = [];
  for (const [id, f] of Object.entries(s.vases)) {
    if (f.scale == null || (only && !only.includes(id))) continue;
    if (Math.abs(f.scale - 1) < 1e-6) delete vsc[id]; else vsc[id] = f.scale;
    changed.push(`${id} ${f.engineScale || 1} → ${f.scale}`);
    f.engineScale = f.scale; f.engineHeightCm = null; f.scale = null; f.scaleSent = false;
  }
  const body = '{' + Object.keys(vsc).sort().map(k => `'${k}':${vsc[k]}`).join(',') + '}';
  fs.writeFileSync(ENGINE, src.replace(m[0], `const VSC=${body};`));
  return changed;
}

if (cmd === 'livrer') {
  const [id, summary] = args;
  if (!id || !summary || !s.vases[id]) { console.error('usage : livrer <id> "<ce qui a changé>" (id connu de la revue)'); process.exit(1); }
  const f = sheet(s, id), v = f.version + 1;
  let commit = null; try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch {}
  const scaled = f.scaleSent ? writeScales([id]) : [];
  const done = f.notes.filter(n => n.status === 'sent');
  for (const n of done) { n.status = 'done'; n.doneIn = v; }
  f.history.push({ version: v, date: new Date().toISOString(), summary, notes: done.map(n => n.num), scale: scaled[0] || null, commit });
  f.version = v; f.valid = null; f.validSent = false;
  writeState(s);
  console.log(`${id} : v${v} livrée (${done.length} note(s) traitée(s)${scaled.length ? ', échelle ' + scaled[0] : ''}), de retour « à revoir ».`);
} else if (cmd === 'echelles') {
  const changed = writeScales(null);
  writeState(s);
  console.log(changed.length ? 'échelles inscrites :\n  ' + changed.join('\n  ') : 'aucune échelle en attente');
} else if (cmd === 'etat') {
  const by = {};
  for (const [id, f] of Object.entries(s.vases)) (by[statusOf(f)] ||= []).push(`${id} v${f.version}`);
  for (const k of ['a-corriger', 'envoye', 'a-revoir', 'valide']) console.log(`${k} (${(by[k] || []).length}) : ${(by[k] || []).join(', ')}`);
} else {
  console.error('commandes : livrer <id> "<résumé>" | echelles | etat'); process.exit(1);
}
