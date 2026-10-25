// Shop scene test bench: loads the layers of decor/out/ (or ?out=<dir>), places the moving pieces listed in its
// scene.json and pauses them when unseen.
//
// scene.json (written by the decor modules):
//   { "nuages":  [{ "src": "voiles-haut.svg", "rang": "hauts"|"bas", "boucle": true, "y": 22.2, "t": 420, "d": -78,
//                   "lumiere": [[0, 1], [50, 0.85], [100, 0.8]] },
//                 { "src": "nuage-3.svg", "rang": "hauts"|"bas", "y": 12, "w": 9, "t": 180, "d": -40 }],
//     "touffes": [{ "src": "touffe-2.svg", "x": 31, "b": -2, "w": 12, "a": 1.2, "t": 3.6 }] }
// y, w, x, b are % of the world frame (2400 x 1350); t and d are seconds; a is the sway in degrees.
// Two kinds of drifting sky pieces:
// - "boucle" (the veils of voiles.mjs): a band image 4800 wide, periodic every 2400 (one tile), shown at 200 % of
//   the world's width, top at y %, sliding left to right by half its width in t seconds and looping; the tile wraps,
//   so the loop has no seam and the sky is never empty. "lumiere" (optional) is a static brightness across the world,
//   [x %, factor], set as a mask on the band's plane (it stays put while the band slides under it).
// - otherwise (one cloud per image): it crosses the world from just off the left edge to just off the right edge.
// The order of loading (2026-10-16, measured on a phone): the sky and the horizon, then the veils and the ground (the
// static layers cut to the phone's column when it is all that shows; ?plein=1 always takes the full ones), then
// boutique.js prepares the bouquet whole and grows it, then the clumps on screen come, one at a time when the page is idle.
(() => {
  const q = new URLSearchParams(location.search);
  // the HUD's carriers (porteuses.mjs): from the first paint the pieces their ants bring wait off screen (boutique.css); with
  // prefers-reduced-motion, ?porteuses=0 or ?insectes=0 they stand in their places as before, and they are put back if the
  // ants have not set out after 6 s
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && q.get('porteuses') !== '0' && q.get('insectes') !== '0') {
    document.documentElement.classList.add('porteuses');
    setTimeout(() => { if (!window.PORTEUSES_EN_ROUTE) document.documentElement.classList.remove('porteuses'); }, 6000);
    // the Open button too, at every page load (fourmi-open.mjs, started by insectes.mjs once the first bouquet has grown): it
    // waits for its ant, and shows by itself if the ant has not set out after 45 s
    document.documentElement.classList.add('fourmi-open');
    setTimeout(() => { if (!window.FOURMI_OPEN_EN_ROUTE) document.documentElement.classList.remove('fourmi-open'); }, 45000);
  }
  const scene = document.getElementById('scene');
  const OUT = `../${q.get('out') || 'out'}/`;
  if (q.has('debug')) scene.classList.add('debug');

  // The part of the world on screen, in world units (x of the 2400-unit frame): the world covers the screen, centred
  // (scene.css), so it is the middle of the frame, as wide as the screen. Read from the layout, not the close-up's transform.
  const monde = document.getElementById('monde');
  const seen = () => {
    const half = monde.offsetWidth ? (innerWidth / 2 / monde.offsetWidth) * 2400 : 1200;
    return [1200 - half, 1200 + half];
  };
  window.SCENE_VUE = seen;

  // Static layers: one SVG file each, drawn once by the browser; a missing file is skipped.
  // A phone held upright sees only the central column of the world, yet the browser reads, styles and records every
  // element of a layer, seen or not: the layers listed in CUT also come cut to that column (decor/out/colonne/, written by
  // recadre.mjs; the same picture inside it). The cut is loaded when the whole visible part lies in the column; if the
  // window grows past it (a phone turned sideways), the full layers replace the cut ones for good.
  const COLONNE = [780, 1620];
  const CUT = new Set(['horizon.svg', 'sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg']);
  const inColumn = () => {
    const [a, b] = seen();
    return a >= COLONNE[0] && b <= COLONNE[1];
  };
  const layers = [...document.querySelectorAll('img[data-src]')];
  let cut = !q.has('plein') && inColumn();
  const loadSvg = (el) => {
    const name = el.dataset.src;
    el.dataset.on = '1';
    return new Promise((done) => {
      el.addEventListener('load', done, { once: true });
      if (cut && CUT.has(name)) {
        // no cut file: the full layer
        el.onerror = () => {
          el.onerror = () => (el.remove(), done());
          el.src = OUT + name;
        };
        el.src = `${OUT}colonne/${name}`;
      } else {
        el.onerror = () => (el.remove(), done());
        el.src = OUT + name;
      }
    });
  };
  if (cut)
    addEventListener('resize', function full() {
      if (inColumn()) return;
      cut = false;
      removeEventListener('resize', full);
      for (const el of layers) if (CUT.has(el.dataset.src) && el.dataset.on && el.isConnected) el.src = OUT + el.dataset.src;
      for (const el of layers) if (el.apercu) swap(el);
    });

  // Compiled previews (decor/calques.mjs; owner, 2026-10-25: "image compilée d'abord puis SVG au repos, seulement pour le
  // décor"). The heavy layers first come as WebP pictures cut to their drawn part (data-apercu, written by build.mjs: the
  // full layer's and the column's, [src, x, y, w, h] in world units), which the browser decodes off the main thread. Each
  // SVG then takes its preview's place, one at a time when the main thread is idle, once the first bouquet is on screen: the
  // SVG is what stays. ?apercu=non loads the SVG at once (as before), ?apercu=garde keeps the previews.
  const AP = q.get('apercu');
  window.SCENE_APERCUS = {};
  const load = (el) => {
    const a = AP !== 'non' && el.dataset.apercu && JSON.parse(el.dataset.apercu)[cut ? 'colonne' : 'plein'];
    if (!a) return loadSvg(el);
    const [src, x, y, w, h] = a;
    const p = new Image();
    p.alt = '';
    p.className = 'plan';
    p.style.cssText = `${el.style.cssText};left:${(x / 24).toFixed(4)}%;top:${(y / 13.5).toFixed(4)}%;width:${(w / 24).toFixed(4)}%;height:${(h / 13.5).toFixed(4)}%`;
    el.before(p);
    el.apercu = p;
    return new Promise((done) => {
      const on = () => ((window.SCENE_APERCUS[el.dataset.src] = Math.round(performance.now())), done());
      p.onload = () => p.decode().then(on, on);
      p.onerror = () => (p.remove(), (el.apercu = null), loadSvg(el).then(done));
      p.src = OUT + src;
    });
  };
  // the SVG under its preview, hidden until it is read, shown when the main thread is idle, the preview gone a frame later;
  // a layer whose SVG fails keeps its preview
  const swap = async (el) => {
    const p = el.apercu;
    if (!p) return;
    el.apercu = null;
    el.style.visibility = 'hidden';
    await loadSvg(el);
    await idle();
    el.style.visibility = '';
    await frame();
    if (el.isConnected) p.remove();
  };

  // In stages, so something shows at once and nothing waits on what comes after it: the sky and the horizon (light), then,
  // once they are on screen, the drifting veils (light too, see below) and the ground with its pillar, its three layers revealed together (the meadow comes in one go,
  // never layer by layer). window.SCENE_DECOR resolves once the ground is on screen (two frames after it is revealed):
  // boutique.js loads the bouquet's pieces only then, so they never hold back the first picture.
  const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const FIRST = new Set(['ciel.svg', 'horizon.svg']);
  const first = layers.filter((el) => FIRST.has(el.dataset.src));
  const ground = layers.filter((el) => !FIRST.has(el.dataset.src));
  for (const el of ground) el.style.visibility = 'hidden';
  const skyIn = Promise.all(first.map(load)).then(frame);
  window.SCENE_DECOR = skyIn
    .then(() => Promise.all(ground.map(load)))
    .then(() => {
      for (const el of ground) {
        el.style.visibility = '';
        if (el.apercu) el.apercu.style.visibility = '';
      }
      return frame();
    })
    .then(() => Math.round(performance.now()));

  const img = (src, style) => {
    const el = new Image();
    el.alt = '';
    el.decoding = 'async';
    if (src) el.src = OUT + src;
    el.onerror = () => el.remove();
    for (const [k, v] of Object.entries(style)) el.style.setProperty(k, v);
    return el;
  };

  // the foreground's clumps come last (decor/PLAN.md), once the first bouquet has grown (boutique.js tells it with the
  // event "boutique:bouquet"; 15 s at most), so they never hold its growth back
  const afterBouquet = new Promise((r) => {
    document.addEventListener('boutique:bouquet', r, { once: true });
    setTimeout(r, 15000);
  });
  // the SVG layers in place of their previews, in their stacking order, after the first bouquet
  if (AP !== 'garde')
    Promise.all([window.SCENE_DECOR, afterBouquet]).then(async () => {
      for (const el of layers) await swap(el);
    });
  const sceneJson = fetch(OUT + 'scene.json')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  // the veils come with the sky, right after it is on screen: a few hundred ellipses, read in a moment, and the largest
  // picture of the page for the browser's measures (the full-screen layers count as a background)
  Promise.all([sceneJson, skyIn])
    .then(([m]) => {
      for (const n of m.nuages || []) {
        const plan = document.getElementById(n.rang === 'bas' ? 'nuages-bas' : 'nuages-hauts');
        if (n.boucle) {
          const el = img(n.src, { '--y': `${n.y}%`, '--t': `${n.t}s`, '--d': `${n.d}s` });
          el.className = 'bande';
          plan.append(el);
          if (n.lumiere) {
            const g = `linear-gradient(to right, ${n.lumiere.map(([x, f]) => `rgb(0 0 0 / ${f}) ${x}%`).join(', ')})`;
            plan.style.webkitMaskImage = g;
            plan.style.maskImage = g;
          }
          continue;
        }
        const el = img(n.src, { '--y': `${n.y}%`, '--w': `${n.w}%`, '--t': `${n.t}s`, '--d': `${n.d}s` });
        el.className = 'nuage';
        plan.append(el);
      }
    });
  Promise.all([sceneJson, afterBouquet])
    .then(([m]) => m)
    // insectes.mjs draws the clumps as sprites with the insects (window.PREMIER_PIXI resolves once it does): the SVG clumps
    // below are then left out; they come when it cannot (it rejects, or with prefers-reduced-motion it never starts)
    .then((m) => (window.PREMIER_PIXI ? window.PREMIER_PIXI.then(() => null, () => m) : m))
    .then((m) => {
      if (!m) return;
      // The gust crosses the field left to right in about 1.6 s.
      // Only the clumps on screen are read (each is a whole SVG document for the main thread), one at a time when the page
      // is idle, so the breeze never stalls; the others when the window grows to show them. Each one has its place in the
      // stacking order from the start (an <img> without a source draws nothing), and its sway only once it has a source:
      // an animation on an empty element cannot run on the graphics card, it would cost the main thread every frame.
      const clumps = [];
      for (const t of m.touffes || []) {
        const el = img(null, { '--x': `${t.x}%`, '--b': `${t.b}%`, '--w': `${t.w}%`, '--a': `${t.a}deg`, '--t': `${t.t}s`, '--d': `${-t.t + (t.x / 100) * 1.6}s` });
        document.getElementById('premier').append(el);
        // its extent in world units, a little wider for its sway
        clumps.push({ el, src: t.src, x0: (t.x - 2) * 24, x1: (t.x + t.w + 2) * 24 });
      }
      let busy = false;
      const more = async () => {
        if (busy) return;
        busy = true;
        for (;;) {
          const [a, b] = seen();
          const c = clumps.find((c) => !c.on && c.x1 > a && c.x0 < b);
          if (!c) break;
          c.on = true;
          await new Promise((r) => {
            c.el.addEventListener('load', r, { once: true });
            c.el.addEventListener('error', r, { once: true });
            c.el.className = 'touffe';
            c.el.src = OUT + c.src;
          });
          await idle();
        }
        busy = false;
        if (clumps.every((c) => c.on)) removeEventListener('resize', more);
      };
      addEventListener('resize', more);
      more();
    });
  const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 300 }) : setTimeout(r, 30)));

  // Nothing moves while the scene is off screen or the tab is hidden.
  let visible = true;
  const sync = () => scene.classList.toggle('paused', !visible || document.hidden);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(scene);
  document.addEventListener('visibilitychange', sync);

  if (q.has('perf')) {
    const box = document.getElementById('perf');
    box.hidden = false;
    let frames = 0;
    let worst = 0;
    let last = performance.now();
    let t0 = last;
    const tick = (now) => {
      frames++;
      worst = Math.max(worst, now - last);
      last = now;
      if (now - t0 >= 1000) {
        box.textContent = `${Math.round((frames * 1000) / (now - t0))} i/s, pire image ${worst.toFixed(0)} ms`;
        frames = 0;
        worst = 0;
        t0 = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
