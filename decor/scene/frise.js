// frise.js: the catalogue frieze of the shop (decor/FRISE.md, decor/frise.mjs): the camera travels along a ring of 21
// pillars, each bouquet on its own, every depth of the decor sliding at its own speed.
//
// What it draws, inside .monde (the world frame, 2400 x 1350 units, scene.css), far to near:
// - the strips of out/frise/frise.json (frise_tuiles.mjs): the horizon and the ground's depth slices, each a looping
//   strip of SVG tiles moved by f x c (c the camera, in units at the pillars' depth); only the tiles near the view are
//   in the page;
// - between the slices "arriere" and "avant": the pillars (out/frise/piliers/<i>.svg) and, over the whole ground as in
//   the single scene, the bouquets, one plane per place in view (boutique.js poses them: Frise.poser);
// - the foreground's clumps (out/scene.json "touffes", swaying), repeated along their own fast strip;
// - the name of the bouquet facing the camera, in the sky.
//
// The camera (owner 2026-10-26): free drag (finger, mouse, trackpad or wheel); let go, it glides on and always comes to
// rest facing a bouquet, a quick swipe on the next one, in one smooth motion from the finger's speed; the arrow keys and the pager's dots travel to a bouquet; a tap on a bouquet beside the centre brings it
// to the centre. ?c=<units> starts elsewhere than the opening pillar. Units: c = 0 faces place 0 (the opening pillar, its
// stepping stones), c = k x PITCH faces place k.
//
//   Frise.pret                      resolves with the manifest once it is read
//   Frise.decor                     resolves once the decor in view (strips, pillars) is on screen
//   Frise.poser(fn)                 fn(place, plane) -> Promise<bouquet of Eclosion.pose>: what stands on a place
//   Frise.nommer(fn)                fn(place) -> the bouquet's name, written in the sky
//   Frise.va(place, { instant })    travels to a place (the shorter way round)
//   Frise.pas(+1 | -1)              the next or previous place
//   Frise.face()                    the place facing the camera, or -1 while it moves away from one
//   Frise.bouquet(place)            the bouquet shown on a place (null if not yet)
//   Frise.fige(on)                  no camera move (the close-up)
//   events on document: "frise:arret" (detail: place; the camera has stopped facing it), "frise:depart" (it moves)
(() => {
  'use strict';
  const q = new URLSearchParams(location.search);
  const $ = (id) => document.getElementById(id);
  const scene = $('scene');
  const monde = $('monde');
  const OUT = '../out/';
  const WW = 2400;
  const WH = 1350;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = (v, of) => `${((v / of) * 100).toFixed(4)}%`;
  // a phone held upright sees about VUE units of the world (owner, 2026-10-26: 1180 first, to see the edges of the
  // neighbours' columns and bouquets; then the bouquets were too small and there was too much sky: 850, the bouquet in the
  // middle of the screen, the edges of the wide neighbours still showing; ?vue= to compare)
  const VUE = +q.get('vue') || 850;
  document.documentElement.style.setProperty('--vue-tel', VUE);

  let M = null; // the manifest
  let c = +q.get('c') || 0; // the camera
  let k = 1; // CSS px per world unit (at rest)
  let half = 1200; // half the world's width in view (units)
  const bands = []; // { id, f, x0, cx, w, h, tiles: [[x, w]], el, on: Map(key -> img) }
  let pillarsEl, clumpsEl, nameEl;
  // the bouquets' plane (index.html #bouquet, the one boutique.js and the insects know): a plane per place inside it
  const bouquetsEl = $('bouquet');
  const pillarImgs = new Map(); // key -> img
  const places = new Map(); // key "place:m" -> { place, m, plane, b, loading }
  let poser = null;
  let nameOf = () => '';
  let frozen = false;
  const decorWait = [];
  // when each piece of decor came (ms), and the decor as a whole: window.FRISE_TEMPS
  const T = (window.FRISE_TEMPS = { pieces: {} });

  // ---------- the world in view
  const measure = () => {
    k = monde.offsetWidth / WW || 1;
    half = scene.clientWidth / k / 2;
  };
  const wrapDelta = (d, L) => ((((d + L / 2) % L) + L) % L) - L / 2;

  // A piece of decor (a tile, a pillar): its compiled picture first (frise_cuisson.mjs, decoded off the main thread), its
  // SVG in its place later, when the camera rests and the page is idle (owner, 2026-10-25: "image compilée d'abord puis SVG
  // au repos, seulement pour le décor"); ?apercu=non: the SVG at once, ?apercu=garde: the pictures only.
  const AP = q.get('apercu');
  const toSwap = new Set();
  function piece(parent, cls, svg, box, pre, dx) {
    const mkImg = (src, [x, y, w, h]) => {
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.className = cls;
      img.style.cssText = `left:${pct(x + dx, WW)};top:${pct(y, WH)};width:${pct(w, WW)};height:${pct(h, WH)}`;
      img.src = OUT + 'frise/' + src;
      return img;
    };
    const usePre = pre && AP !== 'non';
    const el = usePre ? mkImg(pre[0], pre.slice(1)) : mkImg(svg, box);
    const P = { el, svg: usePre && AP !== 'garde' ? [svg, box, mkImg] : null };
    decorWait.push(new Promise((r) => {
      el.onload = () => el.decode().then(r, r);
      el.onerror = () => r();
    }).then(() => (T.pieces[el.src.split('/frise/')[1]] = Math.round(performance.now()))));
    parent.append(el);
    if (P.svg) toSwap.add(P);
    return P;
  }
  const drop = (P) => {
    P.el.remove();
    if (P.next) P.next.remove();
    toSwap.delete(P);
  };
  // the SVG under its picture, read hidden, shown once ready, the picture gone a frame later; one at a time, while the
  // camera rests, those in view first
  let swapping = false;
  async function swaps() {
    if (swapping || AP === 'garde') return;
    swapping = true;
    try {
      while (!moving && toSwap.size) {
        await idle();
        if (moving) break;
        const box = scene.getBoundingClientRect();
        let P = null;
        for (const Q of toSwap) {
          const r = Q.el.getBoundingClientRect();
          if (r.right > box.left && r.left < box.right) { P = Q; break; }
        }
        if (!P) break;
        toSwap.delete(P);
        const [svg, b, mkImg] = P.svg;
        const next = mkImg(svg, b);
        next.style.visibility = 'hidden';
        P.next = next;
        P.el.after(next);
        await new Promise((r) => {
          next.onload = () => next.decode().then(r, r);
          next.onerror = r;
        });
        if (!next.isConnected) continue;
        next.style.visibility = '';
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        if (next.isConnected) {
          P.el.remove();
          P.el = next;
          P.next = null;
        }
      }
    } finally {
      swapping = false;
    }
  }
  const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 40)));

  // a strip: the tiles over [a, b) of its own units, each laid at its place(s) along the loop
  function strip(B, margin) {
    const shift = c * B.f;
    const a = B.cx - half - margin + shift;
    const b = B.cx + half + margin + shift;
    const want = new Set();
    B.tiles.forEach(([x, w, ver], j) => {
      for (let m = Math.floor((a - x - w) / B.w) + 1; x + m * B.w < b; m++) {
        if (x + m * B.w + w <= a) continue;
        const key = `${j}:${m}`;
        want.add(key);
        if (B.on.has(key)) continue;
        const pre = B.apercus && B.apercus[j];
        B.on.set(key, piece(B.el, 'frise-tuile', `${B.id}/${j}.svg${ver ? `?v=${ver}` : ''}`, [x, 0, w, B.h], pre, m * B.w - B.cx + M.cx));
      }
    });
    // the tiles far behind go (two screens away)
    for (const [key, P] of B.on) {
      if (want.has(key)) continue;
      const [j, m] = key.split(':').map(Number);
      const [x, w] = B.tiles[j];
      const x0 = x + m * B.w;
      if (x0 + w < a - 2 * half || x0 > b + 2 * half) {
        drop(P);
        B.on.delete(key);
      }
    }
    B.el.style.transform = `translate3d(${(-shift * k).toFixed(2)}px,0,0)`;
  }

  // the places in view (and one pitch beyond): their keys, nearest the centre first
  function placesNear(margin) {
    const out = [];
    const n = M.places;
    const lo = Math.floor((c - half - margin) / M.pas);
    const hi = Math.ceil((c + half + margin) / M.pas);
    for (let i = lo; i <= hi; i++) {
      const place = ((i % n) + n) % n;
      out.push({ place, i, key: `${place}:${Math.floor(i / n)}`, d: Math.abs(i * M.pas - c) });
    }
    return out.sort((p, r) => p.d - r.d);
  }

  function pillars() {
    const near = placesNear(400);
    const want = new Set();
    for (const { place, i, key } of near) {
      want.add(key);
      if (pillarImgs.has(key)) continue;
      const P = M.piliers[place];
      if (!P) continue;
      pillarImgs.set(key, piece(pillarsEl, 'frise-pilier', P.src + (P.v ? `?v=${P.v}` : ''), P.boite, P.apercu, i * M.pas));
    }
    for (const [key, P] of pillarImgs) {
      if (want.has(key)) continue;
      drop(P);
      pillarImgs.delete(key);
    }
    pillarsEl.style.transform = `translate3d(${(-c * k).toFixed(2)}px,0,0)`;
  }

  // The bouquets: posed one at a time, the nearest the centre first, only while the camera rests (a bouquet posed during a
  // travel stalls it: 7 frames per second on a phone slowed 4 times, against 35-44 without), and up to two places beyond the
  // view, so the next one is there when the camera comes; those three places beyond the view are taken down.
  let posing = false;
  async function bouquets() {
    bouquetsEl.style.transform = `translate3d(${(-c * k).toFixed(2)}px,0,0)`;
    if (!poser) return;
    const near = placesNear(M.pas * 2);
    const keep = new Set(placesNear(M.pas * 3).map((p) => p.key));
    for (const [key, P] of places) {
      if (keep.has(key)) continue;
      if (P.b) P.b.repli();
      P.plane.remove();
      places.delete(key);
    }
    if (posing || moving) return;
    posing = true;
    try {
      for (const { place, i, key } of near) {
        if (places.has(key)) continue;
        const plane = document.createElement('div');
        plane.className = 'plan frise-bouquet';
        // the bouquet stands on its own pillar's top (2 units at most from the opening one's)
        const dy = M.piliers[place] && M.piliers[0] ? M.piliers[place].sommet - M.piliers[0].sommet : 0;
        plane.style.cssText = `left:${pct(i * M.pas, WW)};top:${pct(dy, WH)}`;
        plane.dataset.place = place;
        bouquetsEl.append(plane);
        const P = { place, i, plane, b: null };
        places.set(key, P);
        try {
          P.b = await poser(place, plane);
        } catch (err) {
          console.error('[frise]', place, err);
        }
        if (!places.has(key)) P.b && P.b.arret();
        else if (P.b) document.dispatchEvent(new CustomEvent('frise:bouquet', { detail: place }));
        if (!firstShown) {
          firstShown = Promise.resolve();
          if (!moving) stop();
        }
        // a camera that moved meanwhile: the next nearest is decided again (at its next rest if it moves)
        return void setTimeout(() => ((posing = false), moving || bouquets()), 0);
      }
    } finally {
      posing = false;
    }
  }

  // The foreground's clumps: one frame of them (scene.json), again every `periode` units of their strip. They run at about
  // four times the pillars' speed, so a whole new set comes in at every place: their compiled pictures (out/premier/,
  // premier.mjs, as the insects' sprites draw them), never their SVG, whose reading stalled a phone's travel for a second.
  let clumpList = [];
  const clumpOn = new Map();
  function clumps() {
    if (!clumpList.length) return;
    const T = M.touffes;
    const shift = c * T.f;
    const a = M.cx - half - 300 + shift, b = M.cx + half + 300 + shift;
    const want = new Set();
    for (let m = Math.floor((a - WW) / T.periode); m * T.periode < b; m++) {
      clumpList.forEach((t, j) => {
        const [bx, by, bw, bh] = t.box;
        const x0 = bx + m * T.periode;
        if (x0 + bw < a || x0 > b) return;
        const key = `${j}:${m}`;
        want.add(key);
        if (clumpOn.has(key)) return;
        const img = new Image();
        img.alt = '';
        img.decoding = 'async';
        img.className = 'frise-touffe';
        img.style.cssText = `left:${pct(x0, WW)};top:${pct(by, WH)};width:${pct(bw, WW)};height:${pct(bh, WH)};transform-origin:${t.o}`;
        for (const [p, v] of Object.entries({ '--a': `${t.a}deg`, '--t': `${t.t}s`, '--d': `${t.d}s` })) img.style.setProperty(p, v);
        img.src = OUT + t.src + (t.v ? `?v=${t.v}` : '');
        clumpsEl.append(img);
        clumpOn.set(key, img);
      });
    }
    for (const [key, img] of clumpOn) if (!want.has(key)) (img.remove(), clumpOn.delete(key));
    clumpsEl.style.transform = `translate3d(${(-shift * k).toFixed(2)}px,0,0)`;
  }

  // the name of the bouquet facing the camera, in the sky: it glides slower than the pillars and fades as its bouquet
  // leaves the centre
  let nameFor = -1;
  function name() {
    const i = Math.round(c / M.pas);
    const place = ((i % M.places) + M.places) % M.places;
    const d = c - i * M.pas;
    const show = Math.max(0, 1 - Math.abs(d) / (M.pas * 0.42));
    if (place !== nameFor) {
      nameFor = place;
      nameEl.textContent = nameOf(place) || '';
    }
    nameEl.style.opacity = (show * show * (3 - 2 * show)).toFixed(3);
    nameEl.style.transform = `translate3d(calc(-50% + ${(-d * 0.35 * k).toFixed(2)}px),0,0)`;
  }

  // ---------- one frame of the camera
  let dirty = true;
  function draw() {
    measure();
    for (const B of bands) strip(B, 260);
    pillars();
    clumps();
    // (while it moves, only its transform: the bouquets are set up when the camera rests, stop())
    bouquetsEl.style.transform = `translate3d(${(-c * k).toFixed(2)}px,0,0)`;
    name();
    dirty = false;
  }

  // ---------- motion: drag, inertia, travels
  let v = 0; // units per second
  let travel = null; // { from, to, t0, ms }
  let raf = 0;
  let moving = false;
  let lastT = 0;
  const FRICTION = 3.2; // 1/s: an inertial glide loses about 96 % of its speed in a second
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
    lastT = now;
    if (travel) {
      const t = Math.min(1, (now - travel.t0) / travel.ms);
      // (a release: a cubic that leaves at the finger's speed and comes to rest on the place; else eased in and out)
      if (travel.v0 != null) c = (2 * t ** 3 - 3 * t ** 2 + 1) * travel.from + (t ** 3 - 2 * t ** 2 + t) * (travel.ms / 1000) * travel.v0 + (3 * t ** 2 - 2 * t ** 3) * travel.to;
      else c = travel.from + (travel.to - travel.from) * ease(t);
      if (t >= 1) {
        travel = null;
        v = 0;
      }
    } else if (!drag && Math.abs(v) > 4) {
      c += v * dt;
      v *= Math.exp(-FRICTION * dt);
    } else if (!drag) v = 0;
    draw();
    if (travel || drag || Math.abs(v) > 4) raf = requestAnimationFrame(tick);
    else stop();
  }
  function go() {
    if (!moving) {
      moving = true;
      document.dispatchEvent(new CustomEvent('frise:depart'));
    }
    if (!raf) {
      lastT = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  function stop() {
    moving = false;
    lastT = 0;
    const f = face();
    if (f >= 0) document.dispatchEvent(new CustomEvent('frise:arret', { detail: f }));
    // the bouquets near the camera once it has rested a moment (a visitor swiping on does not wait for a bouquet being set
    // up: about a second of the main thread on a phone), at once for the first; then the decor's SVG in place of its
    // pictures
    clearTimeout(restT);
    restT = setTimeout(bouquets, firstShown ? REST_MS : 0);
    if (firstShown) firstShown.then(() => setTimeout(swaps, REST_MS + 400));
  }
  const REST_MS = 900;
  let restT = 0;
  let firstShown = null;
  // the place the camera faces at rest (within a unit), else -1
  function face() {
    if (moving || !M) return -1;
    const i = Math.round(c / M.pas);
    if (Math.abs(c - i * M.pas) > 1) return -1;
    return ((i % M.places) + M.places) % M.places;
  }
  function travelTo(i, ms) {
    const to = i * M.pas;
    if (RM || ms === 0) {
      c = to;
      v = 0;
      travel = null;
      draw();
      return stop();
    }
    travel = { from: c, to, t0: performance.now(), ms: ms || Math.min(1600, 420 + Math.abs(to - c) * 0.35) };
    go();
  }
  // the camera let go at the speed v0 (units/s): it glides on to a place without a jolt (owner 2026-10-26: a swipe must
  // bring the next bouquet in one smooth motion; the camera always comes to rest facing a bouquet)
  function glideTo(i, v0) {
    const to = i * M.pas, d = to - c;
    if (RM) return travelTo(i, 0);
    let T = Math.min(0.9, Math.max(0.35, 0.3 + Math.abs(d) / 1500));
    // a cubic leaving faster than 3 d / T overshoots its place: shorter then; against the way to go, the speed is damped
    if (v0 * d > 0 && Math.abs(v0) * T > 2.8 * Math.abs(d)) T = Math.max(0.25, (2.8 * Math.abs(d)) / Math.abs(v0));
    if (v0 * d < 0) v0 *= 0.3;
    if (Math.abs(d) < 0.5 && Math.abs(v0) < 20) {
      c = to;
      v = 0;
      draw();
      return stop();
    }
    travel = { from: c, to, v0, t0: performance.now(), ms: T * 1000 };
    v = 0;
    go();
  }
  function va(place, opt = {}) {
    if (!M || frozen) return;
    const here = c / M.pas;
    // the copy of that place nearest the camera, the shorter way round
    const i = place + Math.round((here - place) / M.places) * M.places;
    travelTo(i, opt.instant ? 0 : undefined);
  }
  function pas(d) {
    if (!M || frozen) return;
    const base = travel ? travel.to / M.pas : Math.round(c / M.pas);
    travelTo(base + d);
  }

  // pointer: free drag; let go, a glide to a place (glideTo); a tap on a bouquet beside the centre brings it there
  let drag = null;
  const samples = [];
  scene.addEventListener('pointerdown', (e) => {
    if (frozen || !M || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.target.closest && e.target.closest('button, a, input, .pager, .entete, .achat, .accord, .cartes')) return;
    drag = { id: e.pointerId, x0: e.clientX, x: e.clientX, c0: c, from: travel ? travel.to / M.pas : Math.round(c / M.pas), moved: false };
    travel = null;
    v = 0;
    samples.length = 0;
    samples.push([performance.now(), c]);
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    if (!drag.moved && Math.abs(e.clientX - drag.x0) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      try {
        scene.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    c -= dx / k;
    const now = performance.now();
    samples.push([now, c]);
    while (samples.length > 2 && now - samples[0][0] > 90) samples.shift();
    go();
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (!d.moved) {
      // a tap: on a bouquet beside the centre, travel to it (the centre's own bouquet has its button, boutique.js)
      const r = monde.getBoundingClientRect();
      const X = (e.clientX - r.left) / (r.width / WW); // world units, at rest
      const i = Math.round((c + X - M.cx) / M.pas);
      if (i !== Math.round(c / M.pas) && Math.abs(c + X - M.cx - i * M.pas) < M.pas * 0.42 && e.clientY > r.top + 0.12 * r.height) {
        const n = M.places;
        va(((i % n) + n) % n);
      } else if (moving) glideTo(Math.round(c / M.pas), 0);
      return;
    }
    const [t0, c0] = samples[0];
    const [t1, c1] = samples[samples.length - 1];
    const vr = t1 > t0 && performance.now() - t1 < 250 ? ((c1 - c0) / (t1 - t0)) * 1000 : 0;
    // a swipe (fast at the release): the next place in its direction from where it began, or, after a long drag, where
    // its glide would end, never back against it; a slow release: the place nearest where its glide would end
    const p = M.pas;
    let to = Math.round((c + vr / FRICTION) / p);
    if (Math.abs(vr) > 500) {
      if (Math.abs(c - d.c0) < p * 0.9) to = d.from + Math.sign(vr);
      to = vr > 0 ? Math.max(to, Math.ceil(c / p - 0.02)) : Math.min(to, Math.floor(c / p + 0.02));
    }
    glideTo(to, vr);
  };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  scene.addEventListener('dragstart', (e) => e.preventDefault());
  // wheel and trackpad: free travel (sideways, or the wheel turned), then on to the nearest place
  let wheelT = 0;
  scene.addEventListener(
    'wheel',
    (e) => {
      if (frozen || !M || e.ctrlKey) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const px = e.deltaMode === 1 ? d * 16 : e.deltaMode === 2 ? d * scene.clientWidth : d;
      travel = null;
      c += px / k;
      v = 0;
      go();
      // the wheel let go: on to the nearest place
      clearTimeout(wheelT);
      wheelT = setTimeout(() => !drag && !travel && glideTo(Math.round(c / M.pas), 0), 220);
      e.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener('keydown', (e) => {
    if (frozen || !M || e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') pas(1);
    else if (e.key === 'ArrowLeft') pas(-1);
    else return;
    e.preventDefault();
  });
  addEventListener('resize', () => {
    dirty = true;
    if (!raf) draw();
  });

  // ---------- start
  let decorRes;
  const decor = new Promise((r) => (decorRes = r));
  // (the files the manifests point to carry a digest of their content, ?v= (frise_versions.mjs, premier.mjs): a changed
  // picture is never taken from a cache under a new box)
  const pret = fetch(`${OUT}frise/frise.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`frise.json ${r.status}`))))
    .then(async (m) => {
      M = m;
      const mk = (cls, z) => {
        const el = document.createElement('div');
        el.className = `plan ${cls}`;
        el.style.setProperty('--z', z);
        return el;
      };
      // the strips go where the single scene's layers were: the horizon over the clouds, the slices in two groups round
      // the pillars, the bouquets over all the ground (as before), the clumps in front
      const anchor = $('frise-ancre');
      const before = [];
      const after = [];
      let front = false;
      for (const s of M.bandes) {
        const B = { ...s, tiles: s.tuiles, on: new Map(), el: mk('frise-bande', s.id === 'horizon' ? 3 : front ? 6 : 4) };
        B.el.dataset.bande = s.id;
        if (s.id === M.devant) front = true;
        (front ? after : before).push(B.el);
        bands.push(B);
      }
      pillarsEl = mk('frise-piliers', 5);
      clumpsEl = $('premier');
      anchor.before(...before, pillarsEl, ...after);
      nameEl = document.createElement('div');
      nameEl.className = 'nom-ciel';
      nameEl.setAttribute('aria-hidden', 'true');
      monde.append(nameEl);
      // the clumps come once the first bouquet is shown (scene.js's order), and only without the insects' sprites (insectes.mjs
      // draws them with the insects, along the same strip, while it runs: window.PREMIER_PIXI); each clump turns about its
      // foot (scene.json: the bottom middle of its frame), its picture cut to its drawn box
      document.addEventListener(
        'boutique:bouquet',
        () =>
          (window.PREMIER_PIXI ? window.PREMIER_PIXI.then(() => Promise.reject(), () => null) : Promise.resolve())
            .then(() => Promise.all([fetch(`${OUT}scene.json`).then((r) => r.json()), fetch(`${OUT}premier.json`).then((r) => r.json())]))
            .then(([j, pre]) => {
              const byName = new Map(pre.map((p) => [p.src.replace(/^premier\//, '').replace(/\.webp$/, '.svg'), p]));
              clumpList = (j.touffes || [])
                .map((t) => {
                  const p = byName.get(t.src);
                  if (!p) return null;
                  const fx = ((t.x + t.w / 2) / 100) * WW, fy = WH * (1 - t.b / 100);
                  const [bx, by, bw, bh] = p.box;
                  return { src: p.src, v: p.v, box: p.box, a: t.a, t: t.t, d: -t.t + (t.x / 100) * 1.6, o: `${(((fx - bx) / bw) * 100).toFixed(2)}% ${(((fy - by) / bh) * 100).toFixed(2)}%` };
                })
                .filter(Boolean);
              draw();
            })
            .catch(() => {}),
        { once: true },
      );
      measure();
      draw();
      // the decor in view, then its tiles are waited for (6 s at most)
      T.dessine = Math.round(performance.now());
      await Promise.race([Promise.all(decorWait.splice(0)), new Promise((r) => setTimeout(r, 6000))]);
      T.decor = Math.round(performance.now());
      requestAnimationFrame(() => requestAnimationFrame(() => decorRes(Math.round(performance.now()))));
      stop();
      return M;
    });
  pret.catch((err) => {
    console.error('[frise]', err);
    decorRes(Math.round(performance.now()));
  });
  // boutique.js waits for the decor before it shows a bouquet (scene.js's promise: the sky; ours: the strips in view)
  window.SCENE_DECOR = Promise.all([window.SCENE_DECOR, decor]).then(([, t]) => t);

  window.Frise = {
    pret,
    decor,
    poser(fn) {
      poser = fn;
      if (M) bouquets();
    },
    nommer(fn) {
      nameOf = fn;
      nameFor = -1;
      if (M) name();
    },
    va,
    pas,
    face,
    camera: () => c,
    // (a place's copy nearest the camera)
    bouquet(place) {
      let best = null;
      for (const P of places.values()) if (P.place === place && P.b && (!best || Math.abs(P.i * M.pas - c) < Math.abs(best.i * M.pas - c))) best = P;
      return best ? best.b : null;
    },
    fige(on) {
      frozen = !!on;
      if (frozen) {
        travel = null;
        v = 0;
        drag = null;
      }
    },
    plan: () => bouquetsEl,
  };
})();
