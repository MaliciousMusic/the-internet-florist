// frise.js: the catalogue frieze of the shop (decor/FRISE.md, decor/frise.mjs): the camera travels along a ring of 21
// pillars, each bouquet on its own, every depth of the decor sliding at its own speed.
//
// What it draws, as sprites of the scene's one PixiJS canvas (toile.mjs; decor/SPRITES.md, owner 2026-10-27), far to near:
// - the strips of out/frise/frise.json (frise_tuiles.mjs): the horizon and the ground's depth slices, each a looping
//   strip of tiles moved by f x c (c the camera, in units at the pillars' depth), drawn from their baked pictures
//   (frise_cuisson.mjs; their SVG is the source, never read by the page); only the tiles near the view are loaded;
// - between the slices "arriere" and "avant": the pillars and, over the whole ground as in the single scene, the
//   bouquets, a group per place in view in each of the four depth layers (boutique.js poses them: Frise.poser, with
//   Frise.poseSprites: the bouquet's baked sprites, still on the frieze, swaying in the close-up);
// - the foreground's clumps (out/scene.json "touffes", swaying), repeated along their own fast strip, when the insects
//   do not draw them;
// - in the page, over the canvas: the name of the bouquet facing the camera, in the sky.
//
// The camera (owner 2026-10-26): free drag (finger, mouse, trackpad or wheel); let go, it glides on and always comes to
// rest facing a bouquet, a quick swipe on the next one, in one smooth motion from the finger's speed; the arrow keys and the pager's dots travel to a bouquet; a tap on a bouquet beside the centre brings it
// to the centre. ?c=<units> starts elsewhere than the opening pillar. Units: c = 0 faces place 0 (the opening pillar, its
// stepping stones), c = k x PITCH faces place k.
//
//   Frise.pret                      resolves with the manifest once it is read
//   Frise.decor                     resolves once the decor in view (strips, pillars) is on screen
//   Frise.poser(fn)                 fn(place, plane) -> Promise<bouquet of Eclosion.pose>: what stands on a place
//   Frise.nommer(fn)                fn(place) -> the bouquet's name, or { nom, sous } (a second, smaller line), in the sky
//   Frise.va(place, { instant })    travels to a place (the shorter way round)
//   Frise.pas(+1 | -1)              the next or previous place
//   Frise.face()                    the place facing the camera, or -1 while it moves away from one
//   Frise.bouquet(place)            the bouquet shown on a place (null if not yet)
//   Frise.fige(on)                  no camera move (the close-up)
//   Frise.seul(place | null)        only that place's bouquet shown (the close-up), or all
//   Frise.toile                     resolves with the canvas (toile.mjs) once it is made
//   Frise.poseSprites(plane, url, opt) -> bouquet: a bouquet's sprites (sprites.mjs) on a place's plane
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
  let ml = 0; // the world frame's corner in the scene (CSS px, at rest)
  let mt = 0;
  let toile = null; // the canvas (toile.mjs)
  const bands = []; // { id, f, x0, cx, w, h, tiles: [[x, w]], layer, on: Map(key -> piece) }
  let nameEl;
  const pillarImgs = new Map(); // key -> piece
  const places = new Map(); // key "place:m" -> { place, i, plane, b }
  let poser = null;
  let nameOf = () => '';
  let frozen = false;
  const decorWait = [];
  // when each piece of decor came (ms), and the decor as a whole: window.FRISE_TEMPS
  const T = (window.FRISE_TEMPS = { pieces: {} });

  // ---------- the world in view
  const measure = () => {
    const cs = getComputedStyle(monde);
    const mw = parseFloat(cs.width) || monde.offsetWidth;
    k = mw / WW || 1;
    half = scene.clientWidth / k / 2;
    ml = (scene.clientWidth - mw) / 2;
    mt = parseFloat(cs.top) || 0;
  };
  // a world layer of the canvas: k CSS px per unit from the world frame's corner, moved back by `shift` units
  const placeWorld = (L, shift) => {
    L.scale.set(k);
    L.position.set(ml - shift * k, mt);
  };
  const wrapDelta = (d, L) => ((((d + L / 2) % L) + L) % L) - L / 2;

  // A piece of decor (a tile, a pillar): a sprite of its baked picture (frise_cuisson.mjs; owner, 2026-10-27: the site shows
  // sprites only, their SVG stays the source). ?apercu=non: its SVG read as a texture instead (to compare).
  // The pictures are shared by the copies of a tile along the loop; one no copy uses any more is let go two seconds later.
  const AP = q.get('apercu');
  const uses = new Map(); // url -> count
  const hold = (url) => uses.set(url, (uses.get(url) || 0) + 1);
  const letGo = (url) => {
    uses.set(url, uses.get(url) - 1);
    setTimeout(() => {
      if (uses.get(url) === 0) {
        uses.delete(url);
        toile.oublie(url);
      }
    }, 2000);
  };
  function piece(layer, svg, box, pre, dx) {
    const [src, x, y, w, h] = pre && AP !== 'non' ? pre : [svg, ...box];
    const url = OUT + 'frise/' + src;
    const s = new toile.PIXI.Sprite();
    s.position.set(x + dx, y);
    s.visible = false;
    layer.addChild(s);
    const P = { s, url, gone: false };
    hold(url);
    decorWait.push(
      toile
        .texture(url)
        .then((tex) => {
          if (P.gone) return;
          s.texture = tex;
          s.width = w;
          s.height = h;
          s.visible = true;
          T.pieces[src.split('?')[0]] = Math.round(performance.now());
        })
        .catch(() => {}),
    );
    return P;
  }
  const drop = (P) => {
    P.gone = true;
    P.s.destroy();
    letGo(P.url);
  };

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
        B.on.set(key, piece(B.layer, `${B.id}/${j}.svg${ver ? `?v=${ver}` : ''}`, [x, 0, w, B.h], pre, m * B.w - B.cx + M.cx));
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
    placeWorld(B.layer, shift);
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
      pillarImgs.set(key, piece(toile.layer('piliers'), P.src + (P.v ? `?v=${P.v}` : ''), P.boite, P.apercu, i * M.pas));
    }
    for (const [key, P] of pillarImgs) {
      if (want.has(key)) continue;
      drop(P);
      pillarImgs.delete(key);
    }
    placeWorld(toile.layer('piliers'), c);
  }

  // The bouquets: posed one at a time, the nearest the centre first, only while the camera rests (a bouquet posed during a
  // travel stalls it: 7 frames per second on a phone slowed 4 times, against 35-44 without), and up to two places beyond the
  // view, so the next one is there when the camera comes; those three places beyond the view are taken down.
  let posing = false;
  // A place's plane: a group in each of the four depth layers of the bouquets (toile.mjs bq-0..3), at the place's offset
  // in the world, the insects flying between them.
  let only = null; // the close-up's place: the others hidden
  const placeBouquets = () => {
    for (let g = 0; g < 4; g++) placeWorld(toile.layer('bq-' + g), c);
  };
  function makePlane(place, i, dy) {
    const groups = [0, 1, 2, 3].map((g) => {
      const ct = new toile.PIXI.Container();
      ct.position.set(i * M.pas, dy);
      toile.layer('bq-' + g).addChild(ct);
      return ct;
    });
    let alive = true;
    return {
      place,
      x: i * M.pas,
      y: dy,
      groups,
      // (boutique.js asks, as it did of a DOM plane, whether the place is still laid once its bouquet is read)
      get isConnected() {
        return alive;
      },
      montre(on) {
        for (const g of groups) g.visible = on;
      },
      destroy() {
        alive = false;
        for (const g of groups) g.destroy({ children: true });
      },
    };
  }
  async function bouquets() {
    placeBouquets();
    if (!poser) return;
    const near = placesNear(M.pas * 2);
    const keep = new Set(placesNear(M.pas * 3).map((p) => p.key));
    for (const [key, P] of places) {
      if (keep.has(key)) continue;
      if (P.b) P.b.repli();
      P.plane.destroy();
      places.delete(key);
    }
    if (posing || moving) return;
    posing = true;
    try {
      for (const { place, i, key } of near) {
        if (places.has(key)) continue;
        // the bouquet stands on its own pillar's top (2 units at most from the opening one's)
        const dy = M.piliers[place] && M.piliers[0] ? M.piliers[place].sommet - M.piliers[0].sommet : 0;
        const plane = makePlane(place, i, dy);
        plane.montre(only == null || only === place);
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
  const clumpOn = new Map(); // "j:m" -> { s, t, url }
  function clumps() {
    if (!clumpList.length) return;
    const T2 = M.touffes;
    const shift = c * T2.f;
    const a = M.cx - half - 300 + shift, b = M.cx + half + 300 + shift;
    const want = new Set();
    for (let m = Math.floor((a - WW) / T2.periode); m * T2.periode < b; m++) {
      clumpList.forEach((t, j) => {
        const [bx, by, bw, bh] = t.box;
        const x0 = bx + m * T2.periode;
        if (x0 + bw < a || x0 > b) return;
        const key = `${j}:${m}`;
        want.add(key);
        if (clumpOn.has(key)) return;
        // turned about its foot (scene.css's "balance", drawn here by swayClumps)
        const s = new toile.PIXI.Sprite();
        s.visible = false;
        toile.layer('touffes').addChild(s);
        const url = OUT + t.src + (t.v ? `?v=${t.v}` : '');
        const C = { s, t, url, gone: false };
        hold(url);
        toile.texture(url).then((tex) => {
          if (C.gone) return;
          s.texture = tex;
          s.anchor.set(t.ox, t.oy);
          s.position.set(x0 + t.ox * bw, by + t.oy * bh);
          s.scale.set(bw / tex.width, bh / tex.height);
          s.visible = true;
        });
        clumpOn.set(key, C);
      });
    }
    for (const [key, C] of clumpOn)
      if (!want.has(key)) {
        C.gone = true;
        C.s.destroy();
        letGo(C.url);
        clumpOn.delete(key);
      }
    placeWorld(toile.layer('touffes'), shift);
  }
  // each clump from -a to a and back, ease-in-out, t s each way, the gust crossing the field left to right (scene.css)
  const swayClumps = (now) => {
    if (!clumpOn.size || RM) return;
    const t = now / 1000;
    for (const C of clumpOn.values()) {
      const u = (t - C.t.d) / C.t.t, n = Math.floor(u);
      let f = u - n;
      if (n & 1) f = 1 - f;
      C.s.rotation = ((-C.t.a + 2 * C.t.a * f * f * (3 - 2 * f)) * Math.PI) / 180;
    }
  };

  // the name of the bouquet facing the camera, in the screen's top left corner: it fades as its bouquet leaves the centre
  let nameFor = -1;
  function name() {
    const i = Math.round(c / M.pas);
    const place = ((i % M.places) + M.places) % M.places;
    const d = c - i * M.pas;
    const show = Math.max(0, 1 - Math.abs(d) / (M.pas * 0.42));
    if (place !== nameFor) {
      nameFor = place;
      // (a string, or { nom, copies, fane, sous }: the name, the copies available and the fading beside it, a line under it)
      const v = nameOf(place) || '';
      const o = typeof v === 'string' ? { nom: v } : v;
      const [ligne, sous] = nameEl.children;
      ligne.children[0].textContent = o.nom || '';
      ligne.children[1].textContent = o.copies || '';
      ligne.children[2].textContent = o.fane || '';
      sous.textContent = o.sous || '';
      fitName();
    }
    nameEl.style.opacity = (show * show * (3 - 2 * show)).toFixed(3);
  }

  // the band always on its line, whatever the screen's width: its letters made smaller until its widest line fits
  // (--f, 1 down to 0.5; owner, 2026-10-27: « le layout doit scale pour toujours avoir son display correct »)
  function fitName() {
    if (!nameEl) return;
    nameEl.style.setProperty('--f', 1);
    const over = Math.max(...[...nameEl.children].map((el) => el.scrollWidth / Math.max(1, el.clientWidth)));
    if (over > 1) nameEl.style.setProperty('--f', Math.max(0.5, 0.98 / over).toFixed(3));
  }

  // ---------- one frame of the camera
  let dirty = true;
  function draw() {
    measure();
    for (const B of bands) strip(B, 260);
    pillars();
    clumps();
    // (while it moves, only its place: the bouquets are set up when the camera rests, stop())
    placeBouquets();
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

  // ---------- a bouquet in sprites (sprites.mjs): its still picture on the frieze; in the close-up, its images, each
  // turning round its joint in the breeze as aliveBq's (eclosion.js before 2026-10-27), all with one common head start
  const AHEAD = 60000;
  const swaying = new Set(); // fn(now) of the bouquets swaying (the close-up)
  async function poseSprites(plane, url, opt = {}) {
    const m =
      opt.donnees ||
      (await fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bouquet ${r.status}`)))));
    const base = url.slice(0, url.lastIndexOf('/') + 1);
    const F = m.frise;
    // (each bouquet lowered or raised so its vase stands on its pillar's top: sprites.mjs "assise")
    const dy = m.assise || 0;
    const still = new toile.PIXI.Sprite(await toile.texture(base + F.src));
    still.position.set(F.x, F.y + dy);
    still.width = F.w;
    still.height = F.h;
    still.visible = false;
    plane.groups[0].addChild(still);
    // the depth groups of the close-up's images (as eclosion.js split them into its four boxes)
    const per = Math.ceil(m.images / 4);
    const groupOf = (k) => Math.min(3, Math.floor(k / per));
    let shown = false;
    let gone = false;
    let near = null; // { sprites, sway, sheets }
    const b = {
      manifeste: { vb: m.vb, boite: [m.boite[0], m.boite[1] + dy, m.boite[2], m.boite[3]], pied: m.pied, echelle: m.echelle, pieces: m.orig, finCroissanceMs: 0 },
      // the place's offset in the world (the insects place the bouquet's flowers from it)
      lieu: { x: plane.x, y: plane.y + dy },
      plans: plane.groups,
      plan: m.orig.map((o) => groupOf(o.k)),
      pieces: [still],
      get vivant() {
        return !gone;
      },
      montre() {
        if (!shown) {
          shown = true;
          still.visible = !near;
        }
        return Promise.resolve(performance.now());
      },
      depart() {
        return b.montre();
      },
      // the close-up: its finer sprites, swaying (owner 2026-10-27: the bouquets sway in the close-up only)
      async proche(on) {
        if (on && !near && !gone) {
          const P = m.proche;
          const sheets = P.sheets.map((s) => base + s);
          const texs = await Promise.all(sheets.map((u) => toile.texture(u)));
          if (gone || near) return;
          const { Sprite, Texture, Rectangle } = toile.PIXI;
          const sprites = [];
          const moving = [];
          for (const f of P.frames) {
            const s = new Sprite(new Texture({ source: texs[f.sheet].source, frame: new Rectangle(f.sx, f.sy, f.sw, f.sh) }));
            if (f.o) {
              s.anchor.set((f.o[0] - f.x) / f.w, (f.o[1] - f.y) / f.h);
              s.position.set(f.o[0], f.o[1] + dy);
              moving.push([s, f.z]);
            } else s.position.set(f.x, f.y + dy);
            s.width = f.w;
            s.height = f.h;
            plane.groups[groupOf(f.k)].addChild(s);
            sprites.push(s);
          }
          const sway = (now) => {
            for (const [s, [amp, duration, delay]] of moving) s.rotation = ((amp * Math.PI) / 180) * Math.sin((2 * Math.PI * (now - delay + AHEAD)) / duration);
          };
          if (!RM) swaying.add(sway);
          near = { sprites, sway, sheets };
          still.visible = false;
        } else if (!on && near) {
          swaying.delete(near.sway);
          for (const s of near.sprites) s.destroy();
          for (const u of near.sheets) toile.oublie(u);
          near = null;
          still.visible = shown && !gone;
        }
      },
      repli() {
        b.arret();
        return Promise.resolve();
      },
      arret() {
        if (gone) return;
        b.proche(false);
        gone = true;
        still.destroy();
      },
    };
    b.pret = Promise.resolve(b);
    b.vase = b.tout = b.grandi = b.pret;
    b.parti = Promise.resolve(0);
    return b;
  }

  // ---------- start
  let decorRes;
  const decor = new Promise((r) => (decorRes = r));
  const toileP = import('./toile.mjs');
  // (the files the manifests point to carry a digest of their content, ?v= (frise_versions.mjs, premier.mjs): a changed
  // picture is never taken from a cache under a new box)
  const pret = fetch(`${OUT}frise/frise.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`frise.json ${r.status}`))))
    .then(async (m) => {
      M = m;
      // the canvas's layers in the single scene's order: the horizon and the far slices, the pillars, the near slices, the
      // bouquets over all the ground, the clumps in front (toile.mjs)
      toile = await (await toileP).creer({ scene, apres: monde, bandes: M.bandes.map((s) => s.id), loin: 'z6', milieu: 'arriere', devant: M.devant });
      window.TOILE = toile;
      toileRes(toile);
      for (const s of M.bandes) bands.push({ ...s, tiles: s.tuiles, on: new Map(), layer: toile.layer('bande:' + s.id) });
      toile.chaqueImage((now) => {
        swayClumps(now);
        for (const fn of swaying) fn(now);
      });
      nameEl = document.createElement('div');
      nameEl.className = 'nom-ciel';
      nameEl.setAttribute('aria-hidden', 'true');
      nameEl.innerHTML = '<span class="nom-ligne"><span class="nom-titre"></span><span class="nom-copies"></span><span class="nom-fane"></span></span><span class="nom-sous"></span>';
      // in the screen's top band (owner, 2026-10-27), behind the bouquets (« les textes doivent être derrière le
      // bouquet »): just under the canvas, over the sky; held still in the close-up as the canvas is
      // (in a frame over the whole scene, so the close-up's counter-transform starts from the scene's corner as the canvas's)
      const cadre = document.createElement('div');
      cadre.className = 'nom-cadre';
      cadre.append(nameEl);
      toile.canvas.before(cadre);
      toile.tenir(cadre);
      addEventListener('resize', fitName);
      // (the name's thin face arrives after the first measure)
      if (document.fonts) document.fonts.ready.then(fitName);
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
                  return { src: p.src, v: p.v, box: p.box, a: t.a, t: t.t, d: -t.t + (t.x / 100) * 1.6, ox: (fx - bx) / bw, oy: (fy - by) / bh };
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
  let toileRes;
  const toileReady = new Promise((r) => (toileRes = r));
  pret.catch((err) => {
    console.error('[frise]', err);
    decorRes(Math.round(performance.now()));
  });
  // boutique.js waits for the decor before it shows a bouquet (scene.js's promise: the sky; ours: the strips in view)
  window.SCENE_DECOR = Promise.all([window.SCENE_DECOR, decor]).then(([, t]) => t);

  window.Frise = {
    pret,
    decor,
    toile: toileReady,
    poseSprites,
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
    ajusteNom: () => fitName(),
    seul(place) {
      only = place == null ? null : place;
      for (const P of places.values()) P.plane.montre(only == null || P.place === only);
    },
  };
})();
