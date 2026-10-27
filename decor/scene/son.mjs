// son.mjs: the shop's nature soundtrack (owner, 2026-10-27): real field recordings (CC0, son/SOURCES.md, cut by
// decor/son_montage.py), one ambience for the whole scene, off until the visitor turns it on with the dock's speaker
// (entete.js; the choice is remembered). What plays, all through the Web Audio API:
// - the wind in a wheat field and a Breton meadow on the ground (grasshoppers, insects): two beds of 90 s, each looped by two
//   copies laid over one another with an equal-power crossfade, started at a random point. The wind breathes: slow gusts
//   raise its level and open its lowpass;
// - bumblebees passing now and then, panned across as they go by, some near, some further off (duller and quieter);
// - a blackbird singing a few phrases far off, now and then, and from time to time a skylark high up.
// The files (2.9 MB) are fetched only when the sound is first turned on. The context is suspended while the page is hidden.
// Everything is scheduled on the audio clock by a tick once a second: nothing plays while the context is suspended.

const BASE = new URL('son/', import.meta.url);
const XF = 3; // s, the beds' crossfade
const LEVEL = 0.8; // the master's level when on (about -32 dBFS RMS: soft)
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

let ctx = null, master = null, loading = null, on = false, tick = 0;

export const isOn = () => on;

export async function start() {
  on = true;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    document.addEventListener('visibilitychange', () => {
      if (!on) return;
      if (document.hidden) ctx.suspend(); else ctx.resume();
    });
  }
  // (resumed within the click that asked for it: the browsers' rule for sound)
  await ctx.resume();
  await (loading ||= load());
  if (!on) return;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(LEVEL, t + 3);
}

export function stop() {
  on = false;
  if (!ctx) return;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(0, t + 0.8);
  setTimeout(() => { if (!on) ctx.suspend(); }, 900);
}

async function load() {
  const meta = await fetch(new URL('son.json', BASE)).then((r) => r.json());
  const get = (name) => fetch(new URL(name + '.m4a', BASE)).then((r) => r.arrayBuffer()).then((a) => ctx.decodeAudioData(a));
  const [vent, prairie, bourdons, oiseaux] = await Promise.all(['vent', 'prairie', 'bourdons', 'oiseaux'].map(get));
  const S = { bourdons: { buf: bourdons, clips: meta.bourdons }, oiseaux: { buf: oiseaux, clips: meta.oiseaux } };
  const merles = S.oiseaux.clips.filter((c) => c.id.startsWith('merle'));
  const alouettes = S.oiseaux.clips.filter((c) => c.id.startsWith('alouette'));

  // the wind: its bed through a lowpass, both moved by the gusts
  const windLp = ctx.createBiquadFilter();
  windLp.type = 'lowpass';
  windLp.frequency.value = 3500;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.85;
  windLp.connect(windGain).connect(master);
  const beds = [bed(vent, windLp), bed(prairie, gainTo(0.45))];

  const now = ctx.currentTime;
  let gust = now + rnd(4, 10), bee = now + rnd(6, 14), bird = now + rnd(10, 25), lark = now + rnd(40, 80);
  clearInterval(tick);
  tick = setInterval(() => {
    if (ctx.state !== 'running') return;
    const t = ctx.currentTime;
    for (const b of beds) b();
    if (t > gust) {
      // a gust rises over a few seconds and falls again; the wind is brighter in it
      const up = rnd(0.9, 1.25), rise = rnd(2.5, 5), hold = rnd(1, 4), fall = rnd(4, 8);
      windGain.gain.setTargetAtTime(0.85 * up, t, rise / 3);
      windGain.gain.setTargetAtTime(0.85 * rnd(0.7, 0.9), t + rise + hold, fall / 3);
      windLp.frequency.setTargetAtTime(3500 * up * up * 1.4, t, rise / 3);
      windLp.frequency.setTargetAtTime(rnd(2600, 3600), t + rise + hold, fall / 3);
      gust = t + rise + hold + fall + rnd(2, 10);
    }
    if (t > bee) {
      beePass(S.bourdons);
      bee = t + rnd(12, 35);
    }
    if (t > bird) {
      // one blackbird, at one place, two to four phrases a few seconds apart
      const pan = rnd(-0.8, 0.8), n = 2 + Math.floor(Math.random() * 3);
      let at = t + 0.1;
      for (let i = 0; i < n; i++) {
        const c = pick(merles);
        call(S.oiseaux.buf, c, at, { pan, gain: rnd(0.12, 0.2), lp: 5000 });
        at += c.duree + rnd(1.5, 4);
      }
      bird = at + rnd(25, 60);
    }
    if (t > lark) {
      call(S.oiseaux.buf, pick(alouettes), t + 0.1, { pan: rnd(-0.6, 0.6), gain: rnd(0.06, 0.1), lp: 7000 });
      lark = t + rnd(60, 120);
    }
  }, 1000);
}

// a gain into the master
function gainTo(v) {
  const g = ctx.createGain();
  g.gain.value = v;
  g.connect(master);
  return g;
}

// A bed looped into out: copies of the buffer laid end to end, each overlapping the next by XF s with an equal-power
// crossfade, the first from a random point. Returns the function the tick calls to lay the next copy in time.
function bed(buffer, out) {
  const N = 64, fadeIn = new Float32Array(N), fadeOut = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = (i / (N - 1)) * Math.PI / 2; fadeIn[i] = Math.sin(a); fadeOut[i] = Math.cos(a); }
  let t = ctx.currentTime + 0.05, off = rnd(0, buffer.duration - 30), first = true;
  const lay = () => {
    const src = ctx.createBufferSource(), g = ctx.createGain(), len = buffer.duration - off;
    src.buffer = buffer;
    src.connect(g).connect(out);
    if (first) g.gain.setValueCurveAtTime(fadeIn, t, 2);
    else g.gain.setValueCurveAtTime(fadeIn, t, XF);
    g.gain.setValueCurveAtTime(fadeOut, t + len - XF, XF);
    src.start(t, off);
    src.stop(t + len);
    t += len - XF;
    off = 0;
    first = false;
  };
  lay();
  return () => { if (ctx.currentTime > t - 8) lay(); };
}

// a clip of a sprite at time at, panned, levelled and dulled by distance
function call(buf, c, at, { pan = 0, gain = 0.5, lp = 0, panTo = null }) {
  const src = ctx.createBufferSource(), g = ctx.createGain(), p = ctx.createStereoPanner();
  src.buffer = buf;
  g.gain.value = gain;
  p.pan.setValueAtTime(pan, at);
  if (panTo !== null) p.pan.linearRampToValueAtTime(panTo, at + c.duree);
  let node = src;
  if (lp) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lp;
    node = node.connect(f);
  }
  node.connect(g).connect(p).connect(master);
  src.start(at, c.debut, c.duree);
}

// a bumblebee going by: across from one side to the other; near (full and loud) or further off (duller, quieter)
function beePass(S) {
  const c = pick(S.clips), near = Math.random() < 0.6, dir = Math.random() < 0.5 ? -1 : 1;
  const span = c.id.startsWith('bourdon-passe') ? 0.5 : 1.4; // the recorded passes already move in their stereo
  call(S.buf, c, ctx.currentTime + 0.1, {
    pan: (-dir * span) / 2,
    panTo: (dir * span) / 2,
    gain: near ? rnd(0.4, 0.65) : rnd(0.15, 0.25),
    lp: near ? 0 : 2200,
  });
}
