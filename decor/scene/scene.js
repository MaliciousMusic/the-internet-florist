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
(() => {
  const q = new URLSearchParams(location.search);
  const scene = document.getElementById('scene');
  const OUT = `../${q.get('out') || 'out'}/`;
  if (q.has('debug')) scene.classList.add('debug');

  // Static layers: one SVG file each, drawn once by the browser; a missing file is skipped.
  for (const el of document.querySelectorAll('img[data-src]')) {
    el.onerror = () => el.remove();
    el.src = OUT + el.dataset.src;
  }

  const img = (src, style) => {
    const el = new Image();
    el.alt = '';
    el.decoding = 'async';
    el.src = OUT + src;
    el.onerror = () => el.remove();
    for (const [k, v] of Object.entries(style)) el.style.setProperty(k, v);
    return el;
  };

  // the moving planes come last (decor/PLAN.md): the foreground and the clouds once the first bouquet has grown
  // (boutique.js tells it with the event "boutique:bouquet"; 9 s at most), so they never hold its growth back
  const afterBouquet = new Promise((r) => {
    document.addEventListener('boutique:bouquet', r, { once: true });
    setTimeout(r, 9000);
  });
  Promise.all([
    fetch(OUT + 'scene.json')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({})),
    afterBouquet,
  ])
    .then(([m]) => m)
    .then((m) => {
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
      // The gust crosses the field left to right in about 1.6 s.
      for (const t of m.touffes || []) {
        const el = img(t.src, { '--x': `${t.x}%`, '--b': `${t.b}%`, '--w': `${t.w}%`, '--a': `${t.a}deg`, '--t': `${t.t}s`, '--d': `${-t.t + (t.x / 100) * 1.6}s` });
        el.className = 'touffe';
        document.getElementById('premier').append(el);
      }
    });

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
