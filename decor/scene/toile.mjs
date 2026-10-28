// toile.mjs: the one PixiJS canvas of the shop's scene (decor/SPRITES.md, owner 2026-10-27: everything as high-definition
// sprites in PixiJS). The decor's strips, the pillars, the bouquets, the foreground's clumps and the insects are sprites of
// one stage, drawn once per frame by one loop; the SVG drawings stay their source (frise_cuisson.mjs, premier.mjs,
// sprites.mjs bake them).
//
// The canvas lies over the sky (.monde's own sky and clouds stay in the page) and under the page's controls; it covers the
// scene and lets the pointer through. Its layers, from the back (names):
//   bande:<id>          a strip of the frieze (world units, moved by frise.js)
//   insectes-loin       the insects beyond the far slices (scene px), after the strip z6
//   insectes-milieu     those over the middle ground, after the strip "arriere"
//   piliers             the pillars (world units)
//   bq-0, entre-0, bq-1, entre-1, bq-2, entre-2, bq-3
//                       the bouquets' four depth groups (world units) and the insects between them (scene px)
//   insectes-devant     the insects in front of the bouquets (scene px)
//   touffes             the foreground's clumps when the insects do not draw them (world units)
//   premier             the insects' front layer: the clumps and the insects nearer than 2 m, sorted together (scene px)
// A world layer is placed by frise.js at each frame: scale k (CSS px per world unit) from the world frame's corner, moved
// by its own shift. The close-up magnifies the whole stage (vue), and the canvas element is held still on the screen while
// the page's scene is scaled round it.
//
//   const T = await creer({ scene, apres: monde, bandes: ['horizon', ...], loin: 'z6', milieu: 'arriere', devant: 'avant' })
//   T.layer(name) -> Container       T.chaqueImage(fn)   fn(now) before every frame's drawing
//   T.texture(url) -> Promise<Texture> (shared, mipmapped)   T.vue(tx, ty, s)   T.PIXI (the module)
//   T.ktx2: true where KTX2 textures are taken (url ending .ktx2)
import * as PIXI from '../../insectes/runtime/vendor/pixi-8.6.6.min.mjs';

const { Application, Container, Assets } = PIXI;
const KTX2_URL = /\.ktx2(\?|$)/;

export async function creer({ scene, apres, bandes, loin, milieu, devant }) {
  const app = new Application();
  await app.init({
    backgroundAlpha: 0,
    antialias: false,
    autoStart: false,
    preference: 'webgl',
    resolution: Math.min(2, window.devicePixelRatio || 1),
    autoDensity: true,
    width: scene.clientWidth,
    height: scene.clientHeight,
  });
  // On touch screens only (measured 2026-10-28, landing on a computer: graphics memory 178 -> 76 MB, but the landing sharp
  // 0.7 s later, the transcoder's 930 KB and its decoding in the way): a phone's tab is what runs out of memory, a
  // computer's does not. ?ktx2=oui | non forces it.
  const gl = app.renderer.gl;
  const askKtx2 = new URLSearchParams(location.search).get('ktx2');
  const ktx2 =
    !!gl &&
    askKtx2 !== 'non' &&
    (askKtx2 === 'oui' || matchMedia('(pointer: coarse)').matches) &&
    ['WEBGL_compressed_texture_astc', 'EXT_texture_compression_bptc', 'WEBGL_compressed_texture_s3tc', 'WEBGL_compressed_texture_etc'].some((e) => gl.getExtension(e));
  if (ktx2) {
    const at = (f) => new URL(`../../insectes/runtime/vendor/ktx/${f}`, import.meta.url).href;
    PIXI.setKTXTranscoderPath({ jsUrl: at('libktx.js'), wasmUrl: at('libktx.wasm') });
    PIXI.extensions.add(PIXI.loadKTX2);
  }
  const canvas = app.canvas;
  canvas.className = 'toile';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0', pointerEvents: 'none', transformOrigin: '0 0' });
  apres.after(canvas);

  const layers = new Map();
  const add = (name, sortable = false) => {
    const c = new Container();
    c.label = name;
    if (sortable) c.sortableChildren = true;
    app.stage.addChild(c);
    layers.set(name, c);
    return c;
  };
  let front = false;
  for (const id of bandes) {
    if (id === devant && !front) {
      front = true;
      add('piliers');
    }
    add('bande:' + id);
    if (id === loin) add('insectes-loin', true);
    if (id === milieu) add('insectes-milieu', true);
  }
  if (!front) add('piliers');
  for (let g = 0; g < 4; g++) {
    add('bq-' + g);
    if (g < 3) add('entre-' + g, true);
  }
  add('insectes-devant', true);
  add('touffes');
  add('premier', true);

  // one loop: the page's updates (camera, insects, sway), then one drawing
  const each = [];
  let view = { tx: 0, ty: 0, s: 1 };
  let raf = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    for (const fn of each) {
      try {
        fn(now);
      } catch (err) {
        console.error('[toile]', err);
      }
    }
    app.render();
  };
  raf = requestAnimationFrame(frame);

  const resize = () => app.renderer.resize(scene.clientWidth, scene.clientHeight);
  addEventListener('resize', resize);

  const cache = new Map();
  // the page's elements held still on the screen in the close-up, as the canvas is (T.tenir)
  const tenus = [canvas];
  const T = {
    PIXI,
    app,
    canvas,
    layer: (name) => layers.get(name),
    chaqueImage(fn) {
      each.push(fn);
    },
    // a texture of the page's (a WebP sprite or atlas), loaded once, mipmapped: the frieze shows it smaller than baked; a
    // KTX2 (ktx2.py) brings its own mipmaps
    texture(url) {
      if (!cache.has(url))
        cache.set(
          url,
          Assets.load(url).then((tex) => {
            tex.source.scaleMode = 'linear';
            if (!KTX2_URL.test(url)) {
              tex.source.autoGenerateMipmaps = true;
              tex.source.updateMipmaps?.();
            }
            return tex;
          }),
        );
      return cache.get(url);
    },
    // GPU-compressed textures (ktx2.py; owner 2026-10-28): taken on a touch screen whose graphics card reads a compressed
    // format (BC7, BC3, ASTC, ETC2), transcoded in a worker by libktx
    ktx2,
    oublie(url) {
      if (!cache.has(url)) return;
      cache.get(url).then((tex) => Assets.unload(url).catch(() => tex.destroy(true)));
      cache.delete(url);
    },
    // the close-up: the stage magnified s times and moved (tx, ty) as the page's scene is (boutique.js), the canvas element
    // held still on the screen inside that scaled scene. st: the stage's own move when it differs from the scene's (the demo
    // "On your desktop": the bouquet sized into a device's screen, the scene itself at rest)
    vue(tx, ty, s, st = null) {
      view = { tx, ty, s };
      const g = st || view;
      app.stage.position.set(g.tx, g.ty);
      app.stage.scale.set(g.s);
      const t = s === 1 && !tx && !ty ? '' : `scale(${1 / s}) translate(${-tx}px,${-ty}px)`;
      for (const el of tenus) el.style.transform = t;
    },
    // an element of the scene (laid from its top left corner) that the close-up must not move or magnify either
    tenir(el) {
      el.style.transformOrigin = '0 0';
      tenus.push(el);
    },
    get vueActuelle() {
      return view;
    },
    stop() {
      cancelAnimationFrame(raf);
    },
  };
  return T;
}
