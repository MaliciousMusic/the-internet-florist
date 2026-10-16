// The vase review state (etat.json): one sheet per vase of the engine, with its version, the scale the owner set, its notes and
// its validation. Shared by the server (serveur.mjs) and the command line (version.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const STATE_FILE = path.join(HERE, 'etat.json');

export function readState() {
  if (!fs.existsSync(STATE_FILE)) return { vases: {}, sends: [] };
  const s = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  s.vases ||= {}; s.sends ||= [];
  return s;
}

// written whole through a temporary file, so a crash never leaves half a state
export function writeState(s) {
  const tmp = STATE_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(s, null, 1) + '\n');
  fs.renameSync(tmp, STATE_FILE);
}

export function sheet(s, id) {
  return (s.vases[id] ||= { name: id, version: 1, scale: null, engineScale: 1, engineHeightCm: null, notes: [], valid: null, history: [] });
}

// a-revoir: waiting for the owner's eye; a-corriger: notes written, not sent; envoye: sent, waiting for Claude; valide: done
export function statusOf(f) {
  if (f.valid && f.valid.version === f.version) return 'valide';
  if (f.notes.some(n => n.status === 'open') || (f.scale != null && !f.scaleSent)) return 'a-corriger';
  if (f.notes.some(n => n.status === 'sent') || (f.scale != null && f.scaleSent)) return 'envoye';
  return 'a-revoir';
}
