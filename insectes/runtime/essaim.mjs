// Swarm runtime: one PixiJS renderer, kept off screen, stamps the atlas cells of every insect, layer by layer, into the
// canvases interleaved with the depth planes of the bouquet (DECISIONS: "canvas intercalés").
//
// Scene frame of the runtime: X to the right and Y down in CSS pixels of the page, Z toward the viewer. A point at depth Z
// is seen at c + (P - c) * F / (F - Z), c being the centre of the view.
import { Application, Assets, Container, Rectangle, Sprite, Texture } from './vendor/pixi-8.6.6.min.mjs';
import { bodyFrame, viewOf, pickCell } from './vue.mjs';

export const PERSPECTIVE = 1400;

export class Essaim {
  // layers: canvases from the back to the front; zCuts[i]: depth that separates layer i from layer i + 1.
  static async create({ layers, zCuts }) {
    const e = new Essaim();
    e.layers = layers.map((c) => ({ canvas: c, ctx: c.getContext('2d'), box: null }));
    e.zCuts = zCuts;
    e.app = new Application();
    await e.app.init({ width: 8, height: 8, backgroundAlpha: 0, antialias: false, autoStart: false, preference: 'webgl', autoDensity: false, resolution: 1 });
    e.stage = new Container();
    e.stage.sortableChildren = true; // far insects first
    e.insects = [];
    e.kinds = {};
    e.resize();
    return e;
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.w = window.innerWidth; this.h = window.innerHeight;
    for (const l of this.layers) {
      l.canvas.width = Math.round(this.w * dpr); l.canvas.height = Math.round(this.h * dpr);
      l.canvas.style.width = this.w + 'px'; l.canvas.style.height = this.h + 'px';
      l.box = null;
    }
    this.app.renderer.resize(Math.round(this.w * dpr), Math.round(this.h * dpr));
  }

  // An insect kind: its atlas index, its textures, its body length in millimetres.
  async kind(name, url, bodyMm) {
    const idx = await (await fetch(url + '.json')).json();
    const base = url.slice(0, url.lastIndexOf('/') + 1);
    const lods = {};
    for (const [k, L] of Object.entries(idx.lod)) {
      const tex = await Assets.load(base + L.file);
      tex.source.scaleMode = 'linear';
      // Insects are often shown much smaller than their cell: mipmaps keep the hairs from shimmering.
      tex.source.autoGenerateMipmaps = true;
      tex.source.updateMipmaps?.();
      const cells = [];
      const n = Math.max(...Object.values(L.keys)) + 1;
      for (let i = 0; i < n; i++) cells.push(new Texture({ source: tex.source, frame: new Rectangle((i % L.cols) * L.cell, Math.floor(i / L.cols) * L.cell, L.cell, L.cell) }));
      lods[k] = { ...L, cells };
    }
    this.kinds[name] = { idx, lods, bodyMm };
    return this.kinds[name];
  }

  add(insect) {
    insect.sprite = new Sprite();
    insect.sprite.anchor.set(0.5);
    this.stage.addChild(insect.sprite);
    this.insects.push(insect);
  }

  project(P) {
    const s = PERSPECTIVE / (PERSPECTIVE - P[2]);
    return { x: this.w / 2 + (P[0] - this.w / 2) * s, y: this.h / 2 + (P[1] - this.h / 2) * s, s };
  }

  // Inverse: the scene point at depth z that is seen at the page point (x, y).
  unproject(x, y, z) {
    const s = PERSPECTIVE / (PERSPECTIVE - z);
    return [this.w / 2 + (x - this.w / 2) / s, this.h / 2 + (y - this.h / 2) / s, z];
  }

  layerOf(z) { let i = 0; while (i < this.zCuts.length && z > this.zCuts[i]) i++; return i; }

  // Place every sprite from its insect's state, then stamp layer by layer.
  render() {
    const stats = { sprites: 0 };
    for (const b of this.insects) {
      const sp = b.sprite;
      if (!b.visible) { sp.visible = false; continue; }
      const K = this.kinds[b.kind];
      const q = this.project(b.P);
      // Orientation: the runtime frame is Y down, the view maths are Y up.
      const fr = bodyFrame([b.fwd[0], -b.fwd[1], b.fwd[2]], b.bank || 0, [0, 1, 0]);
      const eye = [this.w / 2 - b.P[0], -(this.h / 2 - b.P[1]), PERSPECTIVE - b.P[2]];
      const el = Math.hypot(...eye);
      const v = viewOf(fr, [eye[0] / el, eye[1] / el, eye[2] / el]);
      const pxmm = (b.lengthPx / K.bodyMm) * q.s;
      const shown = K.idx.span * pxmm;
      const lodName = K.lods.L && shown > K.lods.S.cell * 1.25 && K.lods.L.poses.includes(b.pose) ? 'L' : 'S';
      const lod = K.lods[lodName];
      const c = pickCell(lod, lod.el || K.idx.el, b.pose, b.frame, K.idx.frames[b.pose], v);
      if (c.i === undefined) { sp.visible = false; continue; }
      sp.texture = lod.cells[c.i];
      const sc = shown / lod.cell;
      sp.scale.set((c.flip ? -sc : sc) * this.dpr, sc * this.dpr);
      sp.rotation = v.rotation;
      sp.zIndex = b.P[2];
      sp.position.set(q.x * this.dpr, q.y * this.dpr);
      sp.visible = true;
      b.screen = { x: q.x, y: q.y, r: shown * 0.28, view: v, lod: lodName };
      b.layer = b.layerHint ?? this.layerOf(b.P[2]);
      stats.sprites++;
    }
    const r = this.app.renderer;
    this.layers.forEach((L, li) => {
      const mine = this.insects.filter((b) => b.visible && b.layer === li);
      if (!mine.length && !L.box) return;
      for (const b of this.insects) b.sprite.renderable = b.visible && b.layer === li;
      const ctx = L.ctx;
      // Only the region the insects of this layer cover, now and at the previous frame, is cleared and copied.
      let box = null;
      for (const b of mine) {
        const rr = b.screen.r * 2.2 * this.dpr, x = b.screen.x * this.dpr, y = b.screen.y * this.dpr;
        box = grow(box, x - rr, y - rr, x + rr, y + rr);
      }
      const dirty = union(box, L.box);
      if (dirty) {
        const x0 = Math.max(0, Math.floor(dirty[0])), y0 = Math.max(0, Math.floor(dirty[1]));
        const x1 = Math.min(L.canvas.width, Math.ceil(dirty[2])), y1 = Math.min(L.canvas.height, Math.ceil(dirty[3]));
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        if (mine.length && x1 > x0 && y1 > y0) {
          r.render({ container: this.stage, clear: true });
          ctx.drawImage(r.canvas, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
        }
      }
      L.box = box;
    });
    return stats;
  }

  // The insect under a page point, if any (the nearest within its radius).
  hit(x, y) {
    let best = null, bd = Infinity;
    for (const b of this.insects) {
      if (!b.visible || !b.screen) continue;
      const d = Math.hypot(b.screen.x - x, b.screen.y - y);
      const r = Math.max(16, b.screen.r);
      if (d < r && d < bd) { bd = d; best = b; }
    }
    return best;
  }

  textureBytes() {
    let n = 0;
    for (const K of Object.values(this.kinds)) for (const L of Object.values(K.lods)) n += L.w * L.h * 4;
    return n;
  }
}

function grow(b, x0, y0, x1, y1) { return b ? [Math.min(b[0], x0), Math.min(b[1], y0), Math.max(b[2], x1), Math.max(b[3], y1)] : [x0, y0, x1, y1]; }
function union(a, b) { if (!a) return b; if (!b) return a; return grow(a, b[0], b[1], b[2], b[3]); }
