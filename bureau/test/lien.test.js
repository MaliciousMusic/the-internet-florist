import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  adresseDe, appelJeton, base64url, creeLe, emisLe, estAdresse, estAppareil, etape, hexUtf8, lienBelai, message,
  mot, SEL_BOUQUET, SEL_OWNER_OF, sujetVers,
} from '../web/js/web/lien.js';

const temoin = readFileSync(new URL('./lien-temoin.txt', import.meta.url), 'utf8');

test('the message is the one the desktop app reads (lien-temoin.txt, also read by lien.rs)', () => {
  const m = message({
    adresse: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', appareil: '0123456789abcdef0123456789abcdef', reseau: 31337,
    contrat: '0x5FbDB2315678afecb367f032d93F642f64180aa3', emis: '2026-10-16T01:50:00Z',
  });
  assert.equal(m, temoin);
  assert.equal(emisLe(new Date(Date.UTC(2026, 9, 16, 1, 50, 0, 123))), '2026-10-16T01:50:00Z');
});

test('the belai:// link carries the message intact', () => {
  const u = lienBelai(temoin, '0xabc', '12');
  const m = new URL(u).searchParams.get('m');
  const b64 = m.replace(/-/g, '+').replace(/_/g, '/');
  assert.equal(Buffer.from(b64, 'base64').toString('utf8'), temoin);
  assert.ok(u.startsWith('belai://lier?m=') && u.endsWith('&s=0xabc&jeton=12'));
  assert.ok(!/[+/=]/.test(base64url(temoin)));
  assert.ok(!lienBelai('x', '0x1').includes('jeton'));
  assert.equal(hexUtf8('é'), '0xc3a9');
});

test('chain answers are read', () => {
  assert.equal(SEL_OWNER_OF, '6352211e');
  assert.equal(SEL_BOUQUET, '52323054');
  assert.equal(appelJeton(SEL_OWNER_OF, 255n), `0x6352211e${'0'.repeat(62)}ff`);
  assert.equal(adresseDe(`0x${'0'.repeat(24)}${'AB'.repeat(20)}`), `0x${'ab'.repeat(20)}`);
  assert.equal(adresseDe(`0x${'f'.repeat(64)}`), null);
  assert.equal(sujetVers('0xAB'), `0x${'0'.repeat(62)}ab`);
  assert.equal(creeLe(`0x${mot(1n)}${mot(1767225600n)}${mot(41n)}`), 1767225600);
  assert.equal(creeLe('0x12'), null);
  assert.ok(estAdresse('0x5FbDB2315678afecb367f032d93F642f64180aa3') && !estAdresse('0x12'));
  assert.ok(estAppareil('0123456789abcdef0123456789abcdef') && !estAppareil('XYZ'));
});

test('stages follow the chain', () => {
  const j = 86400;
  assert.deepEqual([1, 10, 25, 35].map(d => etape(0, d * j)), ['en bouton', 'en fleur', 'sur le déclin', 'fané']);
});
