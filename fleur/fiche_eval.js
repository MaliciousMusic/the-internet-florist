#!/usr/bin/env node
/* fiche_eval.js : evaluates code expressions of a "fiche-morpho/1" sheet against the drawing modules, without rendering anything.

   usage:  node fleur/fiche_eval.js [--files a.js,b.js] < exprs.json  >  result.json
     stdin   a JSON array of JavaScript expressions, e.g. ["SVB_DEF.vb", "SVA_GENES.n", "LIFE_SP['anemone-coronaria'][4]"]
     stdout  {"load": {...report...}, "values": {"<expr>": {"ok": true, "v": <json>} | {"ok": false, "err": "<message>"}}}

   How the app is "built": the list of files is read from mkapp.sh (the `cat a1.html ... > ../demo7.html` line, `$(ls y3-*.js)` style globs expanded
   in plain sorted order), minus a1.html (HTML) and minus the data and interface files that need a real DOM (k0/k1/k2 data are KEPT, they are plain
   constants; u1/u2/w1/u3 are the shop's interface and are skipped). Each file runs as its own vm.Script in ONE shared context (so top-level const/let
   are visible to the later files and to the expressions), with a 20 s timeout and a generic stub for document/window/location/navigator/etc.
   A file that throws is reported (name, message) and the next file is run: whatever it declared before the error stays available.
   Nothing is rendered, no browser, no server, no network. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');

function fileList() {
  const sh = fs.readFileSync(path.join(ROOT, 'mkapp.sh'), 'utf8');
  const line = sh.split(/\r?\n/).find(l => /^cat\s+a1\.html/.test(l));
  if (!line) throw new Error('mkapp.sh: no "cat a1.html ..." line');
  const body = line.replace(/^cat\s+/, '').replace(/\s*>\s*\.\.\/demo7\.html.*$/, '');
  const out = [];
  // a glob like $(ls y3-*.js 2>/dev/null | LC_ALL=C /usr/bin/sort -t. -k1,1): the files in mkapp.sh's order (the name before ".js", byte by byte)
  const re = /\$\(ls ([^ )]+?) 2>\/dev\/null(?: \|[^)]*)?\)|(\S+)/g;
  const key = f => f.split('.')[0], cmp = (a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : a < b ? -1 : a > b ? 1 : 0);
  let m;
  while ((m = re.exec(body))) {
    if (m[1]) { // glob like y3-*.js
      const rx = new RegExp('^' + m[1].replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      fs.readdirSync(APP).filter(f => rx.test(f)).sort(cmp).forEach(f => out.push(path.join(APP, f)));
    } else {
      const t = m[2];
      if (t === 'a1.html') continue;
      out.push(path.resolve(APP, t));
    }
  }
  return out;
}

function stub() {
  const mk = () => new Proxy(function () {}, {
    get: (t, k) => k === Symbol.toPrimitive ? () => 0 : k === 'length' ? 0 : k === 'then' ? undefined : k === 'firstChild' || k === 'lastChild' ? null : mk(),
    apply: () => mk(), construct: () => mk(), set: () => true, has: () => true,
  });
  return mk;
}

const mem = () => ({ getItem: () => null, setItem() {}, removeItem() {}, clear() {}, key: () => null, length: 0 });
const SKIP = new Set(['u1.js', 'u2.js', 'u3.js', 'w1.js']); // the shop's interface: needs a real DOM, defines none of the drawing's data
function load(extraOnly) {
  const mk = stub();
  const sb = {
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    Math, JSON, Date, Array, Object, String, Number, Boolean, RegExp, Map, Set, WeakMap, WeakSet, Symbol, Promise, Error, TypeError, RangeError,
    parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent, Float32Array, Float64Array, Int32Array, Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array, ArrayBuffer,
    document: mk(), navigator: mk(), location: mk(), localStorage: mem(), sessionStorage: mem(), history: mk(), screen: mk(), Image: mk(), Audio: mk(),
    URLSearchParams: class { get() { return null; } has() { return false; } getAll() { return []; } }, TextEncoder, TextDecoder, structuredClone, atob: x => Buffer.from(x, 'base64').toString('binary'), btoa: x => Buffer.from(x, 'binary').toString('base64'),
    XMLSerializer: mk(), DOMParser: mk(), Worker: mk(), URL: mk(), Blob: mk(), FileReader: mk(), fetch: () => Promise.reject(new Error('no network')),
    performance: { now: () => 0 }, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    innerWidth: 1000, innerHeight: 800, devicePixelRatio: 1, getComputedStyle: () => mk(), alert() {}, open() {},
  };
  sb.window = sb; sb.self = sb; sb.globalThis = sb; sb.top = sb; sb.parent = sb;
  const ctx = vm.createContext(sb);
  const files = extraOnly || fileList().filter(f => !SKIP.has(path.basename(f)));
  const rep = { mode: 'single-script', files: 0, ok: 0, failed: [], missing: [], skipped: [...SKIP] };
  /* the app is ONE <script> in the page (mkapp.sh concatenates the files), so function declarations are hoisted across all of it (s0.js calls prof(),
     declared in s1c.js): we run the same concatenation as one vm.Script. If it throws, the error's file and line are reported, and the context keeps
     whatever was declared before the throw (const/let/class and the functions of the whole script are already hoisted). */
  const parts = [], starts = [];
  let line = 1;
  for (const f of files) {
    if (!fs.existsSync(f)) { rep.missing.push(path.relative(ROOT, f)); continue; }
    const src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
    starts.push([line, path.relative(ROOT, f)]); parts.push(src); line += src.split('\n').length; rep.files++;
  }
  try {
    new vm.Script(parts.join('\n') + '\n', { filename: 'app.js' }).runInContext(ctx, { timeout: 60000 });
    rep.ok = rep.files;
  } catch (e) {
    const m = /app\.js:(\d+)/.exec(String(e && e.stack || ''));
    let where = null;
    if (m) { const ln = +m[1]; for (const [l, f] of starts) if (l <= ln) where = f + ':' + (ln - l + 1); }
    rep.failed.push({ file: where, err: String(e && e.message || e).slice(0, 160) });
  }
  return { ctx, rep };
}

/* probes: small helpers defined AFTER the app is loaded, so that a sheet can read a value that the drawing code only holds inside a call (a literal in an
   options object). A probe replaces the drawing function it spies on for the length of the call and puts it back; nothing is drawn. */
const PROBES = `
var probe = {
  /* the options acoBract hands to acoCutLeaf (y3-anemone2.js): the collar's bract, for an opening op and a wilt wl; len is 1, so .len is the factor of D*R(.5,.65) */
  bract: function (op, wl) {
    var c = null, o = acoCutLeaf;
    acoCutLeaf = function (par, x) { c = x; return null; };
    try { acoBract(null, { H: [0, 1, 0], U: [1, 0, 0], w: 2 }, [0, 0, 0], 1, 1, wl || 0, op); } finally { acoCutLeaf = o; }
    return c;
  }
};`;

function main() {
  const args = process.argv.slice(2);
  let only = null;
  const i = args.indexOf('--files');
  if (i >= 0) only = args[i + 1].split(',').map(f => path.resolve(APP, f));
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '[]');
  /* input: an array of expressions, or {wrap: "((P)=>(%s))(Object.assign({},SVB_DEF,SVA_P))", exprs: [...]}; %s is replaced by the expression */
  const exprs = Array.isArray(input) ? input : input.exprs;
  const wrap = Array.isArray(input) ? null : input.wrap;
  const { ctx, rep } = load(only);
  try { new vm.Script(PROBES, { filename: 'probes' }).runInContext(ctx, { timeout: 5000 }); } catch (e) { rep.failed.push({ file: 'probes', err: String(e.message).slice(0, 160) }); }
  const values = {};
  for (const e of exprs) {
    try {
      const src = wrap ? wrap.replace('%s', () => e) : '(' + e + ')';
      const v = new vm.Script(src, { filename: 'expr' }).runInContext(ctx, { timeout: 5000 });
      let j;
      if (typeof v === 'function') j = '[function]';
      else if (v === undefined) j = null;
      else j = JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'number' && !isFinite(x) ? null : x));
      values[e] = v === undefined ? { ok: false, err: 'undefined' } : { ok: true, v: j };
    } catch (err) { values[e] = { ok: false, err: String(err && err.message || err).slice(0, 160) }; }
  }
  process.stdout.write(JSON.stringify({ load: rep, values }));
}
main();
