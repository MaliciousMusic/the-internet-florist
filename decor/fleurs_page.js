/* fleurs_page.js: the page side of decor/fleurs_moteur.mjs. It only calls the flower engine (engine.js, built from
   flower-claude/demo/src, never edited): whole plants of the meadow drawn by the engine (head, stem, leaves), each saved
   as one standalone SVG with the defs it uses. */
window.__FLEURS = (() => {
  const SIDS = ['tulipe-simple', 'tulipe-double', 'tulipe-perroquet', 'tulipe-frangee', 'anemone-coronaria', 'narcisse-trompette',
    'narcisse-bouquet', 'renoncule-classique', 'renoncule-butterfly', 'jacinthe', 'muscari', 'iris-hollandais', 'fritillaire-meleagris'];
  const XS = new XMLSerializer();
  const brief = (o, d = 0) => {
    if (o == null || typeof o !== 'object') return typeof o === 'function' ? 'fn' : o;
    if (d > 1) return Array.isArray(o) ? `[${o.length}]` : '{' + Object.keys(o).slice(0, 12).join(',') + '}';
    if (Array.isArray(o)) return o.slice(0, 8).map((x) => brief(x, d + 1));
    return Object.fromEntries(Object.entries(o).slice(0, 30).map(([k, v]) => [k, brief(v, d + 1)]));
  };
  function inspect() {
    const out = {};
    for (const sid of SIDS) {
      const rec = RBY[sid];
      out[sid] = {
        rec: rec ? brief(rec) : null,
        cws: (CWS[sid] || []).map((c) => [c.id, c.n, c.c, c.late || 0, c.ret || 0]),
        ghi: GHI[sid] ? Object.keys(GHI[sid]) : null,
        steml: STEML[sid] ? brief(STEML[sid]) : null,
        svhead: typeof SV_HEAD !== 'undefined' && !!SV_HEAD[sid],
        gh: !!GH[sid],
      };
    }
    out._globals = { UPC, DET, LOD, SV_ON: typeof SV_ON !== 'undefined' ? SV_ON : null, LIFE: typeof LIFE !== 'undefined' ? brief(LIFE) : null };
    return out;
  }

  /* the defs a drawing uses: every url(#id) / href="#id" of the body, recursively, from the drawing's own <defs> or the page's */
  function standalone(svg, body, vb) {
    const find = (id) => svg.querySelector('#' + CSS.escape(id)) || document.getElementById(id);
    let out = '';
    const seen = new Set();
    const add = (x) => {
      for (const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)) {
        const id = m[1] || m[2];
        if (seen.has(id)) continue;
        seen.add(id);
        const el = find(id);
        if (el) { const s = XS.serializeToString(el); out += s; add(s); }
      }
    };
    add(body);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${vb[2]}" height="${vb[3]}"><defs>${out}</defs>${body}</svg>`;
  }

  /* the stem below a head's neck, cm long, with the leaves its species carries (svtStem of demo/lab/fleur/svtest.js, the
     engine's own sheet of whole stems), here standing upright: from the neck along its direction, then down to the foot */
  /* the drawn width of the head's own stem piece just above the joint (the plant heads draw the top of their axis with
     its real width, while nw hands the bouquet a thinner start): scanned across the axis on the drawn fills */
  function jointWidth(head, e, nd, cols) {
    /* the outlines of the stem piece's bands (fills in the stem's colours), sampled; the spread across the axis of the
       outline points lying on the cross line through e */
    const n = [-nd[1], nd[0]], along = e[0] * nd[0] + e[1] * nd[1];
    let lo = Infinity, hi = -Infinity;
    for (const el of head.querySelectorAll('path')) {
      if (cols && !cols.includes(el.getAttribute('fill'))) continue;
      const m = el.getCTM(), L = el.getTotalLength();
      if (!m || !L) continue;
      for (let k = 0; k <= 400; k++) {
        const q = el.getPointAtLength((L * k) / 400).matrixTransform(m);
        if (Math.abs(q.x * nd[0] + q.y * nd[1] - along) > 0.8) continue;
        const c = (q.x - e[0]) * n[0] + (q.y - e[1]) * n[1];
        lo = Math.min(lo, c); hi = Math.max(hi, c);
      }
    }
    return hi > lo ? hi - lo : 0;
  }
  function stem(par, r, sid, cm, lean, it = {}) {
    const e = it.top || r.neck, nd = r.nd || [0, 1], L = cm * UPC;
    const P3 = e, P2 = [e[0] + nd[0] * L * 0.3, e[1] + nd[1] * L * 0.3], P0 = [e[0] + nd[0] * L * 0.3 + lean * L, e[1] + L], P1 = [P0[0] - lean * L * 0.4, P0[1] - L * 0.35];
    /* the stem below the head's own piece: a little slimmer than that piece (a field tulip's stem is 6-9 mm), so the piece
       reads as the slightly thicker top of the stem */
    const jw = it.jw || 0, P = [P0, P1, P2, P3], C = [], W = [], w = Math.max((r.nw || 3) * 1.12, jw * (it.stemK ?? 0.98));
    for (let i = 0; i <= 24; i++) { C.push(bz(P, i / 24)); W.push(w * (1.08 - 0.08 * i / 24)); }
    const bl = !it.nobasal && GHI[sid] && GHI[sid].basal;
    if (bl) bl(par, P, L, W[0], -1);
    /* in a meadow the stem below the head stands inside the grass, whose leaves filter the light (green, darker): its
       tones are taken toward the canopy's inner green by it.shade (0: as in the bouquet) */
    let cols = r.ncols || SG;
    if (it.shade && Array.isArray(cols)) {
      const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
      const mx = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
      const c2 = cols.map((c) => (typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? mx(c, '#2c4718', it.shade) : c));
      for (const k of Object.keys(cols)) if (!/^\d+$/.test(k)) c2[k] = cols[k];
      cols = c2;
    }
    stemPoly(par, C, W, cols);
    if (STEML[sid] && !it.noleaf) stemLeaves(par, P, sid, P0[1] + L, L * 0.3, 0);
    if (bl) bl(par, P, L, W[0], 1);
    return P0;
  }

  /* plants: job.items = [{name, sid, cw, op, vw:[x,y,z], cm (stem below the neck), seed, det, lean, basal}] -> one SVG each,
     saved as <name>.svg; returns per item: viewBox, foot (stem's foot), head box, elements, bytes */
  async function plants(job) {
    const res = [];
    for (const it of job.items || []) {
      const t0 = performance.now();
      const svg = E('svg', { width: 400, height: 900 }, document.body);
      GDEF = E('defs', {}, svg);
      DET = it.det ?? 1; LOD = it.lod ?? 0;
      const g = G(svg), head = G(g), sk = G(g);
      g.insertBefore(sk, head); /* the stem behind the head */
      const rec = RBY[it.sid], cw = (CWS[it.sid] || []).find((x) => x.id === it.cw) || (CWS[it.sid] || [])[0];
      let r = null, foot = null, err = null, jw = 0;
      try {
        if (it.seed != null) sd(it.seed);
        renderStatic(() => { r = drawRec(head, 0, rec, { vw: it.vw, ax: it.vw, op: it.op ?? 1, cw, col: cw && cw.c, roll: 0 }); });
        if (r && r.neck && it.cm) {
          /* the head's own stem piece tapers to a point at the joint: the stem starts higher up inside it, at full width,
             drawn behind it (the spike of the piece lies over the stem, the same tones) */
          let top = r.neck;
          const np = r.np || [];
          for (let i = np.length - 2, d = 0; i >= 0; i--) { d += Math.hypot(np[i][0] - np[i + 1][0], np[i][1] - np[i + 1][1]); top = np[i]; if (d >= (it.up ?? 9)) break; }
          jw = jointWidth(head, top, r.nd || [0, 1], r.ncols);
          renderStatic(() => { foot = stem(sk, r, it.sid, it.cm + Math.max(0, r.neck[1] - top[1]) / UPC, it.lean || 0, Object.assign({ jw, top: jw > 0 ? top : null }, it)); });
        }
      } catch (e) { err = e.message; }
      const hb = head.getBBox(), b = g.getBBox();
      const m = 2, vb = [b.x - m, b.y - m, b.width + 2 * m, b.height + 2 * m].map((v) => Math.round(v * 10) / 10);
      const body = XS.serializeToString(g);
      const txt = standalone(svg, body, vb);
      if (it.name) await fetch('/save?name=' + encodeURIComponent(it.name + '.svg'), { method: 'POST', body: txt });
      /* the head alone (for the tones of the far silhouettes), in the same units */
      if (it.name && it.tete) {
        const hb2 = [hb.x - m, hb.y - m, hb.width + 2 * m, hb.height + 2 * m].map((v) => Math.round(v * 10) / 10);
        await fetch('/save?name=' + encodeURIComponent(it.name + '-tete.svg'), { method: 'POST', body: standalone(svg, XS.serializeToString(head), hb2) });
      }
      const part = (q) => { const t = XS.serializeToString(q); return Math.round(t.length / 102.4) / 10; };
      res.push({ name: it.name, sid: it.sid, cw: cw && cw.id, err, vb, foot, jw: Math.round(jw * 10) / 10, nw: r && r.nw, kbHead: part(head), kbStem: part(sk), kbDefs: Math.round((txt.length - body.length) / 102.4) / 10, neck: r && r.neck, head: [hb.x, hb.y, hb.width, hb.height].map((v) => Math.round(v * 10) / 10),
        el: svg.querySelectorAll('*').length, kb: Math.round(txt.length / 102.4) / 10, ms: Math.round(performance.now() - t0) });
      svg.remove();
    }
    return res;
  }
  /* plants2 (second chantier, 15 Oct.): heads drawn WITHOUT their neck (the engine's own switch NECK_X, the way the
     bouquet draws its necks with the stems), so the meadow can give each planted copy its own thin stem, bend and tilt
     (decor/fleurs.mjs), and whole foreground plants whose stem follows the head's neck path then bends down to the foot,
     with the species' broad leaves (STEML hook sv, e.g. tulLeafSv) and basal leaves (GHI basal), in the engine's own
     stem colours (GHI[sid].sc, else the head's neck colours).
     item: { name, sid, cw, op, vw, seed, det, lod, mode: 'tete'|'plante',
             cm: stem length below the neck's end (cm), lean: foot offset (fraction of the length, + right), bow: sideways
             bulge of the lower stem (fraction), wt / wb: stem width at the top / foot (cm), shade: 0..1 toward the canopy's
             inner green, leaves: [{ q (0 foot .. 1 neck), s (side -1/1), len (cm), up (deg) }], basal: true }
     returns the head's box, its neck geometry (receptacle np[0], end `neck`, direction nd toward the base, width nw) and
     its stem colours, in the drawing's units (engine units, 6.5 per cm, y down) */
  async function plants2(job) {
    const res = [];
    const nx0 = NECK_X, ex0 = typeof EXT !== 'undefined' ? EXT : null;
    for (const it of job.items || []) {
      const t0 = performance.now();
      const svg = E('svg', { width: 400, height: 900 }, document.body);
      GDEF = E('defs', {}, svg);
      DET = it.det ?? 1; LOD = it.lod ?? 0;
      const g = G(svg), head = G(g), sk = G(g);
      g.insertBefore(sk, head); /* the stem and leaves behind the head */
      const rec = RBY[it.sid], cw = (CWS[it.sid] || []).find((x) => x.id === it.cw) || (CWS[it.sid] || [])[0];
      let r = null, err = null, foot = null, sc = null;
      try {
        /* the head alone: its neck and the plant heads' main axis (and its leaves) go to EXT, which is not drawn: the
           stem is ours (it.ext: the axis parts are drawn behind the head, as the engine draws them) */
        NECK_X = true; EXT = [];
        if (it.seed != null) sd(it.seed);
        renderStatic(() => { r = drawRec(head, 0, rec, { vw: it.vw, ax: it.vw, op: it.op ?? 1, cw, col: cw && cw.c, roll: 0 }); });
        const ext = EXT || [];
        if (it.ext && ext.length) renderStatic(() => { for (const fn of ext) fn(sk); });
        /* a few plant heads leave a stray piece of their axis at its far end (the hyacinth's and grape hyacinth's scape
           foot): any shape lying wholly in the lower half of the neck's way is dropped (our stem passes there) */
        if (r && r.neck && r.neck[1] > 20) {
          const yCut = r.neck[1] * 0.5, hm = head.getCTM().inverse();
          for (const el of [...head.querySelectorAll('path,use,ellipse,circle,polygon,polyline,rect,line')]) {
            const bb = el.getBBox(), m = hm.multiply(el.getCTM());
            const ys = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => m.b * x + m.d * y + m.f);
            if (Math.min(...ys) > yCut) el.remove();
          }
        }
        const gh = GHI[it.sid] || {};
        sc = (gh.sc && Array.from(gh.sc)) || (r && r.ncols && Array.from(r.ncols)) || Array.from(SG);
        if (it.mode === 'plante' && r && r.neck) {
          const e = r.neck, nd = r.nd || [0, 1], np = r.np || [e], L = it.cm * UPC, lean = it.lean || 0, bow = it.bow || 0;
          const P = [[e[0] + nd[0] * L * 0.25 + lean * L, e[1] + L], null, [e[0] + nd[0] * L * 0.32, e[1] + nd[1] * L * 0.32], e];
          P[1] = [P[0][0] + bow * L - lean * L * 0.15, P[0][1] - L * 0.38];
          const C = [], W = [], wt = (it.wt ?? 0.6) * UPC, wb = (it.wb ?? 0.7) * UPC;
          for (let i = 0; i <= 24; i++) { C.push(bz(P, i / 24)); W.push(wb + (wt - wb) * (i / 24)); }
          /* the neck's own path up to the receptacle (np runs from the receptacle to the end) */
          for (let i = np.length - 2; i >= 0; i--) { C.push(np[i]); W.push(wt * (1 - 0.08 * (np.length - 2 - i) / Math.max(1, np.length - 2))); }
          let cols = gh.sc || r.ncols || SG;
          if (it.shade) {
            const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
            const mx = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
            const c2 = Array.from(cols).map((c) => (typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? mx(c, '#2c4718', it.shade) : c));
            for (const k of Object.keys(cols)) if (!/^\d+$/.test(k)) c2[k] = cols[k];
            cols = c2;
          }
          const bl = it.basal && gh.basal;
          renderStatic(() => {
            if (bl) bl(sk, P, L, W[0], -1);
            stemPoly(sk, C, W, cols);
            const sl = STEML[it.sid];
            for (const [k, lf] of (it.leaves || []).entries()) {
              const p = bz(P, lf.q), p2 = bz(P, Math.min(1, lf.q + 0.02)), ta = Math.atan2(p2[1] - p[1], p2[0] - p[0]);
              const ang = ta + lf.s * (lf.up ?? 24) * D, wr = G(sk);
              if (sl && sl.sv) sl.sv(wr, p[0], p[1], ang, lf.len * UPC, { ta, s: lf.s, k, j: 0 });
              else stemLeaf(wr, p[0], p[1], ang, lf.len * UPC, (sl && sl.w) || 0.22, (sl && sl.col) || '#3f6a2c', { side: lf.s * 0.5, arch: 12 });
            }
            if (bl) bl(sk, P, L, W[0], 1);
          });
          foot = P[0];
        }
      } catch (e) { err = e.message + ' ' + (e.stack || '').split('\n')[1]; }
      finally { NECK_X = nx0; EXT = ex0; }
      const hb = head.getBBox(), b = g.getBBox();
      const m = 2, vb = [b.x - m, b.y - m, b.width + 2 * m, b.height + 2 * m].map((v) => Math.round(v * 10) / 10);
      const body = XS.serializeToString(g);
      const txt = standalone(svg, body, vb);
      if (it.name) await fetch('/save?name=' + encodeURIComponent(it.name + '.svg'), { method: 'POST', body: txt });
      const rd = (v) => Math.round(v * 100) / 100;
      res.push({ name: it.name, sid: it.sid, cw: cw && cw.id, err, vb, foot: foot && foot.map(rd), head: [hb.x, hb.y, hb.width, hb.height].map((v) => Math.round(v * 10) / 10),
        neck: r && r.neck && r.neck.map(rd), nd: r && r.nd && r.nd.map((v) => Math.round(v * 1000) / 1000), np: r && r.np && r.np.map((p) => p.map(rd)), nw: r && r.nw && rd(r.nw), ncols: r && r.ncols && Array.from(r.ncols), sc,
        el: svg.querySelectorAll('*').length, kb: Math.round(txt.length / 102.4) / 10, ms: Math.round(performance.now() - t0) });
      svg.remove();
    }
    return res;
  }
  /* imgTime: job.src = [urls]: each SVG loaded as an <img>, decoded and drawn to a canvas (the browser's raster of a
     fixed layer), timed; job.w the raster width */
  async function imgTime(job) {
    const out = [];
    for (const src of job.src) {
      const w = job.w || 2400, h = Math.round(w * 1350 / 2400), cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const t0 = performance.now(), im = new Image();
      im.src = src + (src.includes('?') ? '&' : '?') + 'n=' + Math.random();
      await im.decode();
      const t1 = performance.now();
      cv.getContext('2d').drawImage(im, 0, 0, w, h);
      cv.getContext('2d').getImageData(0, 0, 1, 1);
      out.push({ src, decode: Math.round(t1 - t0), draw: Math.round(performance.now() - t1) });
    }
    return out;
  }
  /* ev: job.code evaluated in the page (exploration only) */
  function ev(job) { return (0, eval)(job.code); }
  return { inspect, plants, plants2, imgTime, ev, SIDS };
})();
