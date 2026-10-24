// Swarm runtime: one PixiJS renderer, kept off screen, stamps the atlas cells of every insect, layer by layer, into the
// canvases interleaved with the depth planes of the bouquet (DECISIONS: "canvas intercalés").
//
// Scene frame of the runtime: X to the right and Y down in CSS pixels of the page, Z toward the viewer. A point at depth Z
// is seen at c + (P - c) * F / (F - Z), c being the centre of the view.
//
// For a page whose scene is not the window (the shop, decor/scene/insectes.mjs), three options, none of which changes the
// default: size() gives the scene frame (CSS px) instead of the window; centreAt(x, y) puts the vanishing point of the
// perspective there (the shop's horizon) instead of the frame's middle; setView(ox, oy, s) says the canvases cover only the
// part of the frame from (ox, oy), magnified s times (the shop's close-up scales the whole scene), and are drawn at that
// resolution, so the insects stay sharp in it.
// And two for a front layer that moves as a whole (the shop's foreground clumps swaying): direct makes the renderer's own
// canvas (e.canvas) the last layer, drawn into at every frame without a copy, which the page lays in place; prop(obj)
// puts a display object of the page's (placed by the page in canvas px) in that layer, sorted by its zIndex with the
// insects.
import { Application, Assets, Container, MeshSimple, Rectangle, Sprite, Texture } from './vendor/pixi-8.6.6.min.mjs';
import { bodyFrame, viewOf, pickCell, flapAxes } from './vue.mjs';

export const PERSPECTIVE = 1400;

export class Essaim {
  // layers: canvases from the back to the front; zCuts[i]: depth that separates layer i from layer i + 1.
  static async create({ layers, zCuts, size = null, direct = false }) {
    const e = new Essaim();
    e.layers = layers.map((c) => ({ canvas: c, ctx: c.getContext('2d'), box: null }));
    e.zCuts = zCuts;
    e.size = size; e.centre = null; e.ox = 0; e.oy = 0; e.vs = 1; e.props = [];
    e.app = new Application();
    await e.app.init({ width: 8, height: 8, backgroundAlpha: 0, antialias: false, autoStart: false, preference: 'webgl', autoDensity: false, resolution: 1 });
    if (direct) { e.canvas = e.app.canvas; e.layers.push({ canvas: e.canvas, ctx: null, box: null, direct: true }); }
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
    [this.w, this.h] = this.size ? this.size() : [window.innerWidth, window.innerHeight];
    // canvas px per scene px
    this.res = dpr * this.vs;
    [this.cx, this.cy] = this.centre || [this.w / 2, this.h / 2];
    for (const l of this.layers) {
      if (!l.direct) { l.canvas.width = Math.round(this.w * dpr); l.canvas.height = Math.round(this.h * dpr); }
      l.canvas.style.width = this.w / this.vs + 'px'; l.canvas.style.height = this.h / this.vs + 'px';
      l.box = null;
    }
    this.app.renderer.resize(Math.round(this.w * dpr), Math.round(this.h * dpr));
  }

  centreAt(x, y) { this.centre = [x, y]; [this.cx, this.cy] = this.centre; }

  setView(ox, oy, s) {
    if (ox === this.ox && oy === this.oy && s === this.vs) return;
    this.ox = ox; this.oy = oy; this.vs = s;
    this.resize();
  }

  prop(obj) { this.stage.addChild(obj); this.props.push(obj); return obj; }

  // scene px to canvas px
  cvx(x) { return (x - this.ox) * this.res; }
  cvy(y) { return (y - this.oy) * this.res; }

  // An insect kind: its atlas index, its textures, its body length in millimetres. only: the levels of detail to load now
  // (all by default); more() loads the others later.
  async kind(name, url, bodyMm, only = null) {
    const idx = await (await fetch(url + '.json')).json();
    const base = url.slice(0, url.lastIndexOf('/') + 1);
    const lods = {};
    this.kinds[name] = { idx, lods, bodyMm, base };
    await this.more(name, only);
    return this.kinds[name];
  }

  async more(name, only = null) {
    const K = this.kinds[name], idx = K.idx, base = K.base, lods = K.lods;
    for (const [k, L] of Object.entries(idx.lod)) {
      if (lods[k] || (only && !only.includes(k))) continue;
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
  }

  // The wings of a butterfly (outils/ailes.mjs): one sheet with each wing's upper side and underside, drawn in the wing's
  // plane, placed at runtime as a quad from its hinge at any flap angle (DECISIONS: flat wings as textured planes).
  async wings(name, url) {
    const idx = await (await fetch(url + '.json')).json();
    const base = url.slice(0, url.lastIndexOf('/') + 1);
    const tex = await Assets.load(base + idx.file);
    tex.source.scaleMode = 'linear';
    tex.source.autoGenerateMipmaps = true;
    tex.source.updateMipmaps?.();
    const faces = {};
    for (const [wn, W] of Object.entries(idx.wings)) for (const [fn, F] of Object.entries(W.faces)) {
      faces[`${wn}/${fn}`] = new Texture({ source: tex.source, frame: new Rectangle(F.x, F.y, W.w, W.h) });
    }
    // the farthest wing point from the body origin (mm): the insect's screen box
    let reach = 0;
    for (const [wn, W] of Object.entries(idx.wings)) reach = Math.max(reach, Math.hypot(Math.abs(W.box[2]) + Math.abs(idx.hinges[wn][1]), Math.abs(W.box[1]) + 3));
    this.kinds[name].wings = { idx, faces, reach };
  }

  add(insect) {
    insect.sprite = new Sprite();
    insect.sprite.anchor.set(0.5);
    this.stage.addChild(insect.sprite);
    // insect.carry (ants, 2026-10-23): a second sprite for the load, the 'petale' cell of the same view laid over the body, tinted
    if (insect.carry) { insect.carrySprite = new Sprite(); insect.carrySprite.anchor.set(0.5); insect.carrySprite.visible = false; this.stage.addChild(insect.carrySprite); }
    const W = this.kinds[insect.kind]?.wings;
    if (W) {
      insect.wingMeshes = [];
      for (const wn of ['hind', 'fore']) for (const side of [1, -1]) {
        const m = new MeshSimple({ texture: W.faces[`${wn}/upper`], vertices: new Float32Array(8),
          uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), indices: new Uint32Array([0, 1, 2, 0, 2, 3]) });
        m.visible = false;
        this.stage.addChild(m);
        insect.wingMeshes.push({ m, wn, side, face: 'upper' });
      }
    }
    this.insects.push(insect);
  }

  // Places the four wing quads of a butterfly. fr: its body frame (Y up), eye: unit vector to the viewer (Y up), mmS: scene px
  // per mm. Each corner of a wing's texture, (s, q) in its plane, is the body point hinge + s e1 + q e2, carried to the scene and
  // projected like the body. The face seen picks the texture; the light shades it; it sorts with the body by its depth.
  placeWings(b, K, fr, eye, mmS) {
    const W = K.wings, idx = W.idx;
    const toS = (p) => [p[0] * fr.f[0] + p[1] * fr.l[0] + p[2] * fr.u[0], p[0] * fr.f[1] + p[1] * fr.l[1] + p[2] * fr.u[1], p[0] * fr.f[2] + p[1] * fr.l[2] + p[2] * fr.u[2]];
    const L = [0, 0.782, 0.623];
    for (const g of b.wingMeshes) {
      const Wi = idx.wings[g.wn], [s0, q0, s1, q1] = Wi.box, h = idx.hinges[g.wn];
      const ang = b.wingPose?.[g.wn] || { flap: 0, sweep: 0 };
      // (coccinelle) b.wingsHidden: no plane shown (the beetle walks with its elytra closed in the atlas); ang.unfold: the plane drawn
      // shorter while it unfolds (0..1); ang.alpha: a beating membrane shown faint
      if (b.wingsHidden || ang.hidden) { g.m.visible = false; continue; }
      const { e1, e2 } = flapAxes(g.side, ang.flap, ang.sweep);
      const H = [h[0], h[1] * g.side, h[2]];
      const uf = ang.unfold ?? 1;
      const at = (s, q) => [H[0] + uf * s * e1[0] + q * e2[0], H[1] + uf * s * e1[1] + q * e2[1], H[2] + uf * s * e1[2] + q * e2[2]];
      const v = g.m.geometry.positions;
      [[s0, q1], [s1, q1], [s1, q0], [s0, q0]].forEach(([s, q], i) => {
        const o = toS(at(s, q));
        const P = this.project([b.P[0] + o[0] * mmS, b.P[1] - o[1] * mmS, b.P[2] + o[2] * mmS]);
        v[2 * i] = this.cvx(P.x); v[2 * i + 1] = this.cvy(P.y);
      });
      g.m.geometry.getBuffer('aPosition').update();
      // the face toward the viewer (wingFace in the engine: the upper side's normal is -n for a left wing, n for a right one)
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const up = toS(g.side > 0 ? [-n[0], -n[1], -n[2]] : n);
      const face = up[0] * eye[0] + up[1] * eye[1] + up[2] * eye[2] >= 0 ? 'upper' : 'under';
      // S.hideFarClosed (moteur/papillon.mjs): closed past 90 deg, a far wing showing its upper side is left out
      if (b.S?.hideFarClosed && ang.flap >= 90 && face === 'upper' && g.side * (eye[0] * fr.l[0] + eye[1] * fr.l[1] + eye[2] * fr.l[2]) < 0) { g.m.visible = false; continue; }
      if (face !== g.face) { g.m.texture = W.faces[`${g.wn}/${face}`]; g.face = face; }
      const lam = 0.45 + 0.55 * Math.abs(up[0] * L[0] + up[1] * L[1] + up[2] * L[2]);
      const k = Math.round(255 * (1 - 0.55 * (1 - lam)));
      g.m.tint = (k << 16) | (k << 8) | k;
      // depth: the wing's middle toward the viewer, minus the body's radius (the body lies over the wings' bases)
      const mid = toS(at((s0 + s1) * 0.5, (q0 + q1) * 0.5));
      g.m.zIndex = b.P[2] + ((mid[0] * eye[0] + mid[1] * eye[1] + mid[2] * eye[2]) - (K.wingsDepth ?? 2.4)) * mmS;
      // a wing's own opacity (ang.alpha: the chafer's ghost wings of the faux stroke; 0 hides a folded wing)
      if (ang.alpha !== undefined) g.m.alpha = ang.alpha;
      g.m.visible = ang.alpha !== 0;
    }
  }

  project(P) {
    const s = PERSPECTIVE / (PERSPECTIVE - P[2]);
    return { x: this.cx + (P[0] - this.cx) * s, y: this.cy + (P[1] - this.cy) * s, s };
  }

  // Inverse: the scene point at depth z that is seen at the page point (x, y).
  unproject(x, y, z) {
    const s = PERSPECTIVE / (PERSPECTIVE - z);
    return [this.cx + (x - this.cx) / s, this.cy + (y - this.cy) / s, z];
  }

  layerOf(z) { let i = 0; while (i < this.zCuts.length && z > this.zCuts[i]) i++; return i; }

  // Place every sprite from its insect's state, then stamp layer by layer.
  render() {
    const stats = { sprites: 0 };
    for (const b of this.insects) {
      const sp = b.sprite;
      if (!b.visible) { sp.visible = false; if (b.carrySprite) b.carrySprite.visible = false; if (b.wingMeshes) for (const g of b.wingMeshes) g.m.visible = false; continue; }
      const K = this.kinds[b.kind];
      const q = this.project(b.P);
      // Orientation: the runtime frame is Y down, the view maths are Y up.
      const fr = bodyFrame([b.fwd[0], -b.fwd[1], b.fwd[2]], b.bank || 0, [0, 1, 0]);
      const eye = [this.cx - b.P[0], -(this.cy - b.P[1]), PERSPECTIVE - b.P[2]];
      const el = Math.hypot(...eye);
      const v = viewOf(fr, [eye[0] / el, eye[1] / el, eye[2] / el]);
      const pxmm = (b.lengthPx / K.bodyMm) * q.s;
      const shown = K.idx.span * pxmm;
      const lodName = K.lods.L && shown * this.vs > K.lods.S.cell * 1.25 && K.lods.L.poses.includes(b.pose) ? 'L' : 'S';
      const lod = K.lods[lodName];
      const c = pickCell(lod, lod.el || K.idx.el, b.pose, b.frame, K.idx.frames[b.pose], v);
      if (c.i === undefined) { sp.visible = false; if (b.carrySprite) b.carrySprite.visible = false; if (b.wingMeshes) for (const g of b.wingMeshes) g.m.visible = false; continue; }
      sp.texture = lod.cells[c.i];
      const sc = shown / lod.cell;
      sp.scale.set((c.flip ? -sc : sc) * this.res, sc * this.res);
      sp.rotation = v.rotation;
      sp.zIndex = b.P[2];
      sp.position.set(this.cvx(q.x), this.cvy(q.y));
      sp.visible = true;
      b.screen = { x: q.x, y: q.y, r: shown * 0.28, view: v, lod: lodName };
      if (b.carrySprite) {
        const cs = b.carrySprite, c2 = b.carrying ? pickCell(lod, lod.el || K.idx.el, 'petale', 0, 1, v) : {};
        if (c2.i !== undefined) {
          cs.texture = lod.cells[c2.i]; cs.scale.set((c2.flip ? -sc : sc) * this.res, sc * this.res); cs.rotation = v.rotation;
          cs.position.set(this.cvx(q.x), this.cvy(q.y)); cs.zIndex = b.P[2] + 0.001; cs.tint = b.carryTint ?? 0xffffff; cs.visible = true;
        } else cs.visible = false;
      }
      // b.wingsOff: the wings are baked in the cell (the moro-sphinx's fake beat in flight); b.wingsShown === false (a bush-cricket
      // at rest: its folded tegmina are in the body's cell): the wing quads stay hidden
      if (b.wingMeshes && (b.wingsOff || b.wingsShown === false)) for (const g of b.wingMeshes) g.m.visible = false;
      else if (b.wingMeshes) {
        this.placeWings(b, K, fr, [eye[0] / el, eye[1] / el, eye[2] / el], b.lengthPx / K.bodyMm);
        b.screen.r = Math.max(b.screen.r, (K.wings.reach * pxmm) / 2.2 * 1.08);
      }
      b.layer = b.layerHint ?? this.layerOf(b.P[2]);
      stats.sprites++;
    }
    const r = this.app.renderer;
    this.layers.forEach((L, li) => {
      const mine = this.insects.filter((b) => b.visible && b.layer === li);
      if (!mine.length && !L.box && !L.direct) return;
      for (const b of this.insects) {
        b.sprite.renderable = b.visible && b.layer === li;
        if (b.carrySprite) b.carrySprite.renderable = b.sprite.renderable;
        if (b.wingMeshes) for (const g of b.wingMeshes) g.m.renderable = b.sprite.renderable && b.wingsShown !== false;
      }
      for (const o of this.props) o.renderable = !!L.direct;
      // the direct layer, the last one: drawn whole into the renderer's canvas, which the page shows
      if (L.direct) { r.render({ container: this.stage, clear: true }); return; }
      const ctx = L.ctx;
      // Only the region the insects of this layer cover, now and at the previous frame, is cleared and copied.
      let box = null;
      for (const b of mine) {
        const rr = b.screen.r * 2.2 * this.res, x = this.cvx(b.screen.x), y = this.cvy(b.screen.y);
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
    for (const K of Object.values(this.kinds)) {
      for (const L of Object.values(K.lods)) n += L.w * L.h * 4;
      if (K.wings) n += K.wings.idx.w * K.wings.idx.h * 4 * 1.33;
    }
    return n;
  }
}

function grow(b, x0, y0, x1, y1) { return b ? [Math.min(b[0], x0), Math.min(b[1], y0), Math.max(b[2], x1), Math.max(b[3], y1)] : [x0, y0, x1, y1]; }
function union(a, b) { if (!a) return b; if (!b) return a; return grow(a, b[0], b[1], b[2], b[3]); }
