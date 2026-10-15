// chemins.mjs: path data re-quantised on a grid (in the drawing's own units), without drift: every point is rounded in
// absolute coordinates, the relative moves are taken between rounded points. Used to lighten the engine's drawings for
// the distances they are seen at (decor/fleurs.mjs); a grid of 0.1 is the engine's own precision.
const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi;
const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
const fmt = (v) => {
  let s = (Math.round(v * 1000) / 1000).toString();
  if (s.startsWith('0.')) s = s.slice(1); else if (s.startsWith('-0.')) s = '-' + s.slice(2);
  return s === '-0' ? '0' : s;
};
// join numbers the way the engine does: a minus sign or a leading dot after a number with a dot needs no space
function join(nums) {
  let out = '';
  for (const n of nums) {
    if (!out) { out = n; continue; }
    const prevDot = /\.\d*$/.test(out.split(/[ -]/).pop() || '') || /\.\d*$/.test(out);
    if (n[0] === '-' || (n[0] === '.' && prevDot)) out += n; else out += ' ' + n;
  }
  return out;
}
export function requant(d, g) {
  const tok = d.match(/[a-df-zA-DF-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi) || [];
  const q = (v) => Math.round(v / g) * g;
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, rx = 0, ry = 0, rsx = 0, rsy = 0, out = '', first = true;
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const lc = cmd.toLowerCase(), rel = cmd !== cmd.toUpperCase() && !first;
    if (lc === 'z') { x = sx; y = sy; rx = rsx; ry = rsy; out += 'z'; continue; }
    const n = ARGS[lc];
    const a = [];
    for (let k = 0; k < n; k++) a.push(num());
    if (a.some((v) => Number.isNaN(v))) break;
    // absolute points of this segment
    const base = cmd !== cmd.toUpperCase() ? [x, y] : [0, 0];
    let pts = [], end;
    if (lc === 'h') { end = [cmd === 'h' ? x + a[0] : a[0], y]; pts = [end]; }
    else if (lc === 'v') { end = [x, cmd === 'v' ? y + a[0] : a[0]]; pts = [end]; }
    else if (lc === 'a') { end = [base[0] + a[5], base[1] + a[6]]; pts = [end]; }
    else { for (let k = 0; k < n; k += 2) pts.push([base[0] + a[k], base[1] + a[k + 1]]); end = pts[pts.length - 1]; }
    // rounded absolute points, written relative to the previous rounded end
    const R = pts.map((p) => [q(p[0]), q(p[1])]);
    let letter = lc, vals;
    if (first) { letter = 'M'; vals = [R[0][0], R[0][1]]; first = false; }
    else if (lc === 'h') vals = [R[0][0] - rx];
    else if (lc === 'v') vals = [R[0][1] - ry];
    else if (lc === 'a') vals = [a[0], a[1], a[2], a[3], a[4], R[0][0] - rx, R[0][1] - ry];
    else vals = R.flatMap((p) => [p[0] - rx, p[1] - ry]);
    out += letter + join(vals.map(fmt));
    if (lc === 'm') { sx = end[0]; sy = end[1]; rsx = R[R.length - 1][0]; rsy = R[R.length - 1][1]; cmd = cmd === 'm' ? 'l' : 'L'; }
    x = end[0]; y = end[1];
    [rx, ry] = R[R.length - 1];
    if (letter === 'M') { sx = x; sy = y; rsx = rx; rsy = ry; cmd = cmd === 'm' || cmd === 'M' ? (cmd === 'm' ? 'l' : 'L') : cmd; }
  }
  // repeated command letters are kept (simpler, gzip takes them)
  return out;
}
// all d="..." of a markup string
export const requantAll = (s, g) => s.replace(/ d="([^"]+)"/g, (m, d) => ` d="${requant(d, g)}"`);
