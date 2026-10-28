// essai.mjs: "Try on your desktop" (owner, 2026-10-28, in place of the device demo): the page seems to vanish and show the
// visitor's own desktop, the bouquet framed on it, a honeybee giving each step in a bubble as soon as the last is done.
// A page cannot see through itself, so the desktop is a picture of it, taken once:
//   - a computer: the visitor shares their entire screen (getDisplayMedia), minimises the browser for a moment, and the
//     screen is grabbed while the page is hidden: their bare desktop, taskbar and icons as they are. The sharing stops at
//     once; the picture never leaves the page (no upload). Back on the page, one click brings it full screen (the
//     Fullscreen API): the picture fills the screen pixel for pixel, the page is gone, the bouquet stands on the desktop;
//   - a phone (no screen sharing there): the visitor takes a screenshot of their home screen and picks it.
// Then, in its frame (as Belai Bureau places it): drag it, pull a corner, ✓. It sways in the breeze (its close-up sprites,
// sprites.mjs, each piece turning about its joint as on the frieze). Escape, the ✕ or leaving full screen close it.
//
//   import('./essai.mjs').then((m) => m.ouvrir(api))   api: { T, I18N, index: () => Promise<sprites index>, base, focusBack }
//   m.fermer()

const BASE = new URL('../../insectes/', import.meta.url).href;
const V = new URL(import.meta.url).search;
const AHEAD = 60000; // the breeze's common head start (frise.js)
const BEE_PXMM = 3; // the guide's scale: a honeybee 37 px long
const $ = (s, el = document) => el.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

let run = null; // the open try: { root, stop() }

export function fermer() {
  if (run) run.stop();
}

export async function ouvrir(api) {
  if (run) return;
  const T = api.T.essai;
  const PHONE = !(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) || matchMedia('(pointer: coarse) and (max-width: 899px)').matches;

  // ---------- the layer over the page: the bee and its bubble first; later the desktop's picture and the framed bouquet
  const root = document.createElement('div');
  root.className = 'essai';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', T.titre);
  root.innerHTML = `
    <img class="essai-bureau" alt="" hidden>
    <div class="essai-pose" hidden>
      <canvas class="essai-bouquet"></canvas>
      <div class="essai-cadre">
        <span class="essai-coin" data-coin="nw"></span><span class="essai-coin" data-coin="ne"></span>
        <span class="essai-coin" data-coin="sw"></span><span class="essai-coin" data-coin="se"></span>
        <button class="essai-ok" type="button" aria-label="${T.valider}">✓</button>
      </div>
    </div>
    <div class="essai-bulle" role="status" aria-live="polite"><p class="essai-texte"></p><div class="essai-actions"></div></div>
    <button class="essai-fermer" type="button" aria-label="${T.fermer}">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>
    </button>`;
  document.body.append(root);
  const img = $('.essai-bureau', root);
  const pose = $('.essai-pose', root);
  const canvas = $('.essai-bouquet', root);
  const cadre = $('.essai-cadre', root);
  const bulle = $('.essai-bulle', root);
  const texte = $('.essai-texte', root);
  const actions = $('.essai-actions', root);

  let stream = null;
  let shotUrl = null;
  let closed = false;
  let raf = 0;
  const offs = [];
  const on = (el, ev, fn, o) => {
    el.addEventListener(ev, fn, o);
    offs.push(() => el.removeEventListener(ev, fn, o));
  };
  const stopStream = () => {
    if (stream) for (const t of stream.getTracks()) t.stop();
    stream = null;
  };
  run = {
    root,
    stop() {
      if (closed) return;
      closed = true;
      cancelAnimationFrame(raf);
      stopStream();
      for (const off of offs) off();
      if (document.fullscreenElement === root) document.exitFullscreen().catch(() => {});
      if (shotUrl) URL.revokeObjectURL(shotUrl);
      if (bee) bee.e.canvas.remove();
      root.remove();
      document.documentElement.classList.remove('essai-ouvert');
      run = null;
      api.focusBack && api.focusBack();
    },
  };
  document.documentElement.classList.add('essai-ouvert');
  on($('.essai-fermer', root), 'click', fermer);
  on(document, 'keydown', (e) => e.key === 'Escape' && (e.preventDefault(), fermer()), true);
  on(document, 'fullscreenchange', () => {
    if (state.full && document.fullscreenElement !== root) fermer();
  });

  const state = { full: false, moved: 0, sized: false, done: false };
  let bq = null; // the framed bouquet, once the desktop is shown

  // ---------- the guide: one honeybee (insects' runtime, as the HUD's carriers fly theirs), hovering by its bubble
  let bee = null;
  const W = () => root.clientWidth, H = () => root.clientHeight;
  try {
    const { Essaim } = await import(BASE + 'runtime/essaim.mjs');
    const { Abeille } = await import(BASE + 'runtime/abeille.mjs');
    const e = await Essaim.create({ layers: [], zCuts: [], size: () => [W(), H()], direct: true });
    e.canvas.className = 'essai-abeille';
    e.canvas.setAttribute('aria-hidden', 'true');
    root.append(e.canvas);
    const fit = () => {
      e.resize();
      e.canvas.style.width = W() + 'px';
      e.canvas.style.height = H() + 'px';
    };
    fit();
    on(window, 'resize', fit);
    await e.kind('abeille', `${BASE}abeille/atlas/abeille`, 12.5);
    let seed = 11;
    const b = new Abeille(e, [], () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296), { species: { kind: 'abeille', bodyMm: 12.5 }, lengthPx: 12.5 * BEE_PXMM });
    b.visible = true;
    b.pose = 'vol';
    b.lod = 'L';
    b.P = [W() + 60, H() * 0.3, 0];
    e.add(b);
    bee = { e, b, fit, to: [W() * 0.5, H() * 0.4] };
  } catch (err) {
    console.error('[essai] abeille', err);
  }

  // ---------- one loop: the bee flies to its spot and hovers, the bubble beside it, the bouquet sways
  let last = performance.now();
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (bee) {
      const { b, to } = bee;
      // a hover: a slow figure of eight round its spot
      const t = now / 1000;
      const gx = to[0] + 7 * Math.sin(t * 1.3), gy = to[1] + 5 * Math.sin(t * 2.6);
      const k = 1 - Math.exp(-dt * 3.2);
      const nx = b.P[0] + (gx - b.P[0]) * k, ny = b.P[1] + (gy - b.P[1]) * k;
      b.V = [(nx - b.P[0]) / Math.max(dt, 1e-3), (ny - b.P[1]) / Math.max(dt, 1e-3), 0];
      b.P = [nx, ny, 0];
      b.frame = [0, 1, 2, 1][++b.tick % 4];
      b.faceFlight(dt);
      bee.e.render();
      placeBubble(nx, ny);
    }
    if (bq) bq.draw(now);
  };
  raf = requestAnimationFrame(frame);

  // the bubble: beside the bee, on the side away from the bouquet (bee.side), inside the screen; on a narrow screen under it
  function placeBubble(x, y) {
    const w = bulle.offsetWidth, h = bulle.offsetHeight;
    let bx, by;
    if (W() < 600) {
      bx = x - w / 2;
      by = y + 26;
    } else {
      const right = bee.side ? bee.side === 'droite' : x < W() * 0.55;
      bx = right ? x + 30 : x - 30 - w;
      by = y - h / 2;
    }
    bx = Math.max(12, Math.min(W() - w - 12, bx));
    by = Math.max(12, Math.min(H() - h - 12, by));
    bulle.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
  }

  // the bee's spot while the page is still there: beside the close-up's bouquet, on its right; a phone, at the top
  const home = () => (W() < 600 ? [W() * 0.5, 70] : [W() * 0.76, H() * 0.3, 'droite']);
  // a step: its words, its buttons ([label, fn, primary]); the bee goes to `at` ([x, y] in px, or a function of the layer)
  function etape(words, buttons = [], at = null) {
    texte.innerHTML = words;
    actions.replaceChildren(
      ...buttons.map(([label, fn, primary, href]) => {
        const el = document.createElement(href ? 'a' : 'button');
        if (href) el.href = href;
        else el.type = 'button';
        el.className = 'essai-bouton' + (primary ? ' essai-bouton-1' : '');
        el.textContent = label;
        if (fn) el.addEventListener('click', fn);
        return el;
      }),
    );
    bulle.classList.remove('essai-bulle-neuve');
    void bulle.offsetWidth;
    bulle.classList.add('essai-bulle-neuve');
    if (bee) {
      const spot = typeof at === 'function' ? at() : at || home();
      bee.to = [spot[0], spot[1]];
      bee.side = spot[2] || null;
    }
    const first = actions.querySelector('button, a');
    if (first) first.focus({ preventScroll: true });
  }

  // ---------- the desktop's picture
  const shot = PHONE ? await phoneShot() : await desktopShot();
  if (!shot || closed) return;
  shotUrl = shot;
  img.src = shot;
  await img.decode().catch(() => {});

  // one click: full screen (a click is needed for it), the page gone, the desktop and the bouquet
  await new Promise((go) =>
    etape(PHONE ? T.pretTel : T.pret, [
      [
        T.montrer,
        async () => {
          try {
            await root.requestFullscreen({ navigationUI: 'hide' });
            state.full = true;
          } catch (_) {}
          go();
        },
        true,
      ],
    ]),
  );
  if (closed) return;
  root.classList.add('essai-plein');
  img.hidden = false;
  bq = await bouquet();
  if (closed) return;
  pose.hidden = false;

  // ---------- its frame: drag it, pull a corner, ✓ (each step said once the last is done)
  // beside the bouquet, its bubble away from it (a phone: at the top, the bubble under the bee)
  const besideBq = () => {
    const r = pose.getBoundingClientRect();
    if (W() < 600) return [W() * 0.5, 70];
    const left = r.left + r.width / 2 > W() * 0.5;
    return [left ? r.left - 50 : r.right + 50, r.top + r.height * 0.3, left ? 'gauche' : 'droite'];
  };
  await new Promise((done) => {
    let step = 'glisser';
    const next = () => {
      if (step === 'glisser' && state.moved > 24) step = 'taille';
      if (step === 'taille' && state.sized) step = 'valider';
      if (step === 'valider' && state.done) return done();
      show();
    };
    let shown = '';
    const show = () => {
      if (shown === step) return;
      shown = step;
      etape(step === 'glisser' ? (PHONE ? T.glisserTel : T.glisser) : step === 'taille' ? T.taille : T.ok, [], besideBq);
    };
    show();
    bq.onChange = next;
  });
  if (closed) return;

  // ---------- the end: the bouquet set, the way to keep it
  const B = api.I18N.bureau || {};
  const win = /Windows/.test(navigator.userAgent);
  const fin = PHONE ? [T.finTel, [[T.retour, fermer, true]]] : win && B.installer
      ? [fill(T.fin, { jours: api.jours || 30 }), [[T.telecharger, null, true, B.installer], [T.retour, fermer]]]
      : [fill(T.finAutre, { jours: api.jours || 30 }), [[T.retour, fermer, true]]];
  etape(fin[0], fin[1], besideBq);

  // ---------- a computer: the screen shared, the browser minimised, the desktop grabbed
  async function desktopShot() {
    for (;;) {
      const go = await new Promise((r) => etape(T.partager, [[T.partagerBouton, () => r(true), true], [T.annuler, () => r(false)]]));
      if (!go || closed) return fermer(), null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'monitor', frameRate: 5 },
          audio: false,
          selfBrowserSurface: 'exclude',
          surfaceSwitching: 'exclude',
          monitorTypeSurfaces: 'include',
        });
      } catch (_) {
        continue; // declined: asked again
      }
      const track = stream.getVideoTracks()[0];
      const surface = track.getSettings().displaySurface;
      if (surface && surface !== 'monitor') {
        stopStream();
        etape(T.pasEcran);
        await sleep(2600);
        continue;
      }
      // what the screen shows now (this page): the desktop's picture must differ from it
      const before = await grab(track).catch(() => null);
      for (;;) {
        etape(T.reduire);
        const ended = new Promise((r) => track.addEventListener('ended', () => r('ended'), { once: true }));
        const hidden = new Promise((r) => {
          if (document.hidden) return r('hidden');
          const f = () => document.hidden && (document.removeEventListener('visibilitychange', f), r('hidden'));
          document.addEventListener('visibilitychange', f);
        });
        if ((await Promise.race([hidden, ended])) === 'ended' || closed) break;
        // the window's minimising animation, then the desktop as it is
        await sleep(650);
        const pic = await grab(track).catch(() => null);
        if (pic && (!before || differs(before, pic))) {
          stopStream();
          const url = await toUrl(pic);
          if (document.hidden) await new Promise((r) => document.addEventListener('visibilitychange', () => r(), { once: true }));
          return url;
        }
        // still this page (another tab, a window over it): asked again once the visitor is back
        if (document.hidden) await new Promise((r) => document.addEventListener('visibilitychange', () => r(), { once: true }));
        etape(T.encore);
        await sleep(2200);
      }
      stopStream();
      if (closed) return null;
    }
  }

  // one frame of the shared screen: ImageCapture where there is one (Chromium), else a video element's frame
  async function grab(track) {
    if ('ImageCapture' in window) {
      try {
        return await new window.ImageCapture(track).grabFrame();
      } catch (_) {}
    }
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.srcObject = new MediaStream([track]);
    await v.play();
    await sleep(120);
    const bmp = await createImageBitmap(v);
    v.pause();
    v.srcObject = null;
    return bmp;
  }
  // two pictures of the screen, compared on a 32 x 18 thumbnail: the desktop differs from the page
  function differs(a, b) {
    const px = (bmp) => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 18;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(bmp, 0, 0, 32, 18);
      return g.getImageData(0, 0, 32, 18).data;
    };
    const p = px(a), q = px(b);
    let d = 0;
    for (let i = 0; i < p.length; i += 4) d += Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]);
    return d / (32 * 18 * 3) > 10;
  }
  async function toUrl(bmp) {
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext('2d').drawImage(bmp, 0, 0);
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
    return URL.createObjectURL(blob);
  }

  // ---------- a phone: a screenshot of the home screen, picked
  async function phoneShot() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.hidden = true;
    root.append(input);
    for (;;) {
      const go = await new Promise((r) => etape(T.capture, [[T.choisir, () => (input.click(), r(true)), true], [T.annuler, () => r(false)]]));
      if (!go || closed) return fermer(), null;
      const file = await new Promise((r) => {
        input.value = '';
        input.onchange = () => r(input.files && input.files[0]);
        // (a picker closed with no file sends no event on some phones: the page coming back says so)
        const back = () => setTimeout(() => r(input.files && input.files[0]), 600);
        window.addEventListener('focus', back, { once: true });
      });
      if (closed) return null;
      if (file && /^image\//.test(file.type)) return URL.createObjectURL(file);
    }
  }

  // ---------- the bouquet: its close-up sprites (sprites.mjs) drawn on a canvas, swaying; placed, moved, sized
  async function bouquet() {
    const idx = await api.index();
    const P = idx.proche;
    const sheets = await Promise.all(
      P.sheets.map(
        (s) =>
          new Promise((ok, ko) => {
            const im = new Image();
            im.onload = () => ok(im);
            im.onerror = ko;
            im.src = api.base + s;
          }),
      ),
    );
    // its box in the world (its pieces' union, with room for the sway), the pieces in their depth groups' order
    const per = Math.ceil(idx.images / 4);
    const frames = P.frames.map((f, i) => ({ ...f, g: Math.min(3, Math.floor(f.k / per)), i })).sort((a, b) => a.g - b.g || a.i - b.i);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const f of frames) {
      x0 = Math.min(x0, f.x);
      y0 = Math.min(y0, f.y);
      x1 = Math.max(x1, f.x + f.w);
      y1 = Math.max(y1, f.y + f.h);
    }
    const pad = 0.04 * (x1 - x0);
    x0 -= pad;
    x1 += pad;
    y0 -= pad;
    const bw = x1 - x0, bh = y1 - y0;
    const g = canvas.getContext('2d');
    // where it lands: a computer, on the right, a little under half the screen's height, standing over the taskbar; a phone,
    // in the middle, its foot two thirds down
    const H0 = H() * (PHONE ? 0.36 : 0.44);
    const box = { w: (H0 * bw) / bh, h: H0, x: 0, y: 0 };
    box.x = PHONE ? (W() - box.w) / 2 : W() * 0.68 - box.w / 2;
    box.y = (PHONE ? H() * 0.7 : H() * 0.9) - box.h;
    const lay = () => {
      Object.assign(pose.style, { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' });
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = Math.round(box.w * dpr);
      canvas.height = Math.round(box.h * dpr);
    };
    lay();
    const B = {
      onChange: () => {},
      draw(now) {
        const s = canvas.width / bw;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, canvas.width, canvas.height);
        for (const f of frames) {
          g.setTransform(s, 0, 0, s, -x0 * s, -y0 * s);
          if (f.o && f.z) {
            const [amp, duration, delay] = f.z;
            const a = ((amp * Math.PI) / 180) * Math.sin((2 * Math.PI * (now - delay + AHEAD)) / duration);
            g.translate(f.o[0], f.o[1]);
            g.rotate(a);
            g.translate(-f.o[0], -f.o[1]);
          }
          g.drawImage(sheets[f.sheet], f.sx, f.sy, f.sw, f.sh, f.x, f.y, f.w, f.h);
        }
      },
    };

    // moving and sizing: the whole frame drags it, a corner sizes it about the opposite corner (its proportions kept), two
    // fingers pinch it; ✓ sets it (the frame goes)
    const pointers = new Map();
    let grip = null;
    const startGrip = (e, corner) => {
      grip = { corner, x: e.clientX, y: e.clientY, box: { ...box }, pinch: null };
    };
    on(pose, 'pointerdown', (e) => {
      if (state.done || e.target.closest('.essai-ok')) return;
      e.preventDefault();
      pose.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      const corner = e.target.closest('.essai-coin')?.dataset.coin || null;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        grip = { corner: null, box: { ...box }, pinch: Math.hypot(a[0] - b[0], a[1] - b[1]) };
      } else startGrip(e, corner);
    });
    on(pose, 'pointermove', (e) => {
      if (!grip || !pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      const o = grip.box;
      if (grip.pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        size(o, Math.hypot(a[0] - b[0], a[1] - b[1]) / grip.pinch, 'c');
      } else if (grip.corner) {
        const dx = e.clientX - grip.x, dy = e.clientY - grip.y;
        const sx = grip.corner.includes('e') ? dx : -dx, sy = grip.corner.includes('s') ? dy : -dy;
        size(o, Math.max((o.w + sx) / o.w, (o.h + sy) / o.h), grip.corner);
      } else {
        box.x = Math.max(-box.w * 0.5, Math.min(W() - box.w * 0.5, o.x + e.clientX - grip.x));
        box.y = Math.max(-box.h * 0.3, Math.min(H() - box.h * 0.5, o.y + e.clientY - grip.y));
        state.moved = Math.max(state.moved, Math.hypot(e.clientX - grip.x, e.clientY - grip.y));
        lay();
      }
    });
    const release = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        grip = null;
        B.onChange();
      }
    };
    on(pose, 'pointerup', release);
    on(pose, 'pointercancel', release);
    // sized from the box o by k about its corner opposite `corner` ('c': about its centre); 12 % to 95 % of the screen's height
    function size(o, k, corner) {
      const h = Math.max(H() * 0.12, Math.min(H() * 0.95, o.h * k));
      const w = (h * o.w) / o.h;
      box.x = corner === 'c' ? o.x + (o.w - w) / 2 : corner.includes('w') ? o.x + o.w - w : o.x;
      box.y = corner === 'c' ? o.y + (o.h - h) / 2 : corner.includes('n') ? o.y + o.h - h : o.y;
      box.w = w;
      box.h = h;
      if (Math.abs(h / H0 - 1) > 0.08) state.sized = true;
      lay();
    }
    on($('.essai-ok', root), 'click', () => {
      state.done = true;
      cadre.hidden = true;
      pose.classList.add('essai-posee');
      B.onChange();
    });
    return B;
  }
}
