/* one bouquet in its window: the drawing, the breeze, moved by dragging it, sized by its corner or its menu (right click) */
import { angle, FRAME_MS, parseLayer, type Layer } from './breeze.js';
import { clean } from './clean.js';
import { isQuiet, placeOf, plan, type LayerPlan, type Part } from './layers.js';

interface TauriWindow {
  listen<T>(name: string, cb: (e: { payload: T }) => void): Promise<() => void>;
  startDragging(): Promise<void>;
  startResizeDragging(direction: 'SouthEast'): Promise<void>;
}
interface Tauri {
  core: { invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> };
  event: { listen<T>(name: string, cb: (e: { payload: T }) => void): Promise<() => void> };
  webviewWindow: { getCurrentWebviewWindow(): TauriWindow };
}
const T = (window as unknown as { __TAURI__: Tauri }).__TAURI__;
const win = T.webviewWindow.getCurrentWebviewWindow();
const vase = document.getElementById('vase')!;
const corner = document.getElementById('coin')!;

function setLocked(locked: boolean): void {
  document.body.classList.toggle('verrou', locked);
}

function say(text: string): void {
  vase.className = 'vide';
  vase.textContent = text;
}

async function show(): Promise<void> {
  const id = new URLSearchParams(location.search).get('id') ?? '';
  let svg: string;
  let locked: boolean;
  try {
    [svg, locked] = await T.core.invoke<[string, boolean]>('dessin', { id });
  } catch {
    say('Ce bouquet est introuvable. Clic droit pour le retirer.');
    return;
  }
  setLocked(locked);
  const root = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;
  if (root.localName !== 'svg') {
    say('Le dessin de ce bouquet est abîmé.');
    return;
  }
  clean(root);
  // the vase stands on the bottom of its window, whatever its size
  root.setAttribute('preserveAspectRatio', 'xMidYMax meet');
  root.removeAttribute('width');
  root.removeAttribute('height');
  viewBox = (root.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
  const ser = new XMLSerializer();
  const parts: Part[] = Array.from(root.children).map(el => ({
    xml: ser.serializeToString(el),
    bz: el.getAttribute('data-bz'),
    quiet: isQuiet(el.localName),
    defines: el.hasAttribute('id') || el.querySelector('[id]') !== null,
  }));
  const open = ser.serializeToString(root.cloneNode(false)).replace(/\/>$|><\/svg>$/, '>');
  plans = plan(open, parts);
  try {
    await paint();
  } catch {
    // a drawing the picture painter refuses is shown as it is, without the breeze
    plans = [];
    vase.replaceChildren(document.importNode(root, true));
    return;
  }
  vase.replaceChildren(canvas);
  start();
}

/* ---- the pictures: painted once per size, then only turned by the breeze ---- */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let viewBox: number[] = [0, 0, 1, 1];
let plans: LayerPlan[] = [];
let pictures: { img: ImageBitmap; l: Layer | null }[] = [];
let place = { s: 1, ox: 0, oy: 0 };
const t0 = performance.now();

async function picture(svg: string, w: number, h: number): Promise<ImageBitmap> {
  const sized = svg.replace(/^<svg/, `<svg width="${w}" height="${h}"`);
  const url = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function paint(): Promise<void> {
  const w = Math.max(1, Math.round(innerWidth * devicePixelRatio));
  const h = Math.max(1, Math.round(innerHeight * devicePixelRatio));
  const next: typeof pictures = [];
  for (const p of plans) next.push({ img: await picture(p.svg, w, h), l: still ? null : parseLayer(p.bz) });
  for (const p of pictures) p.img.close();
  pictures = next;
  canvas.width = w;
  canvas.height = h;
  place = placeOf(viewBox, w, h);
  draw(performance.now());
}

function draw(now: number): void {
  const t = now - t0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const { img, l } of pictures) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (l) {
      const px = place.ox + (l.x - viewBox[0]) * place.s;
      const py = place.oy + (l.y - viewBox[1]) * place.s;
      ctx.translate(px, py);
      ctx.rotate((angle(l, t) * Math.PI) / 180);
      ctx.translate(-px, -py);
    }
    ctx.drawImage(img, 0, 0);
  }
}

/* the breeze runs only while the bouquet can be seen: the app says when other windows cover it */
let covered = false;
let frame = 0;
let last = 0;
function tick(now: number): void {
  frame = requestAnimationFrame(tick);
  if (now - last < FRAME_MS) return;
  last = now;
  draw(now);
}
function start(): void {
  if (frame || covered || document.hidden || !pictures.some(p => p.l)) return;
  frame = requestAnimationFrame(tick);
}
function stop(): void {
  cancelAnimationFrame(frame);
  frame = 0;
}
// addressed to this bouquet alone
void win.listen<boolean>('couvert', e => {
  covered = e.payload;
  if (covered) stop();
  else start();
});
document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

// moving: press anywhere on the bouquet and drag
vase.addEventListener('mousedown', e => {
  if (e.button === 0 && !document.body.classList.contains('verrou')) void win.startDragging();
});
// sizing: the corner, then the window hugs the bouquet again and the pictures are painted at the new size
corner.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  e.stopPropagation();
  void win.startResizeDragging('SouthEast');
});
let settle = 0;
addEventListener('resize', () => {
  clearTimeout(settle);
  settle = setTimeout(() => {
    void T.core.invoke('ajuster');
    if (pictures.length) setTimeout(() => void paint().catch(() => {}), 150);
  }, 400);
});
// the bouquet's own menu
addEventListener('contextmenu', e => {
  e.preventDefault();
  void T.core.invoke('menu');
});
void T.event.listen<boolean>('verrou', e => setLocked(e.payload));
// a bouquet NFT painted again at its new age (it opens, declines, fades)
void win.listen('recharger', () => {
  stop();
  void show();
});
void show();
