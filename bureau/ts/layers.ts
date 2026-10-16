/* the drawing cut into layers, each painted once as a picture: the static ones, and each layer the breeze sways.
   Every frame then only turns a few pictures, instead of redrawing thousands of shapes and their shadows. */

export interface Part {
  /** the markup of one top-level element of the drawing */
  xml: string;
  /** its breeze mark, if it sways */
  bz: string | null;
  /** true when it paints nothing itself (defs, style…): kept in every layer */
  quiet: boolean;
  /** true when other parts may point at something inside it (an id): kept hidden rather than dropped */
  defines: boolean;
}

export interface LayerPlan {
  /** the svg of this layer alone */
  svg: string;
  /** its breeze mark, null for a still layer */
  bz: string | null;
}

const QUIET = new Set(['defs', 'style', 'title', 'desc', 'metadata', 'lineargradient', 'radialgradient', 'filter', 'clippath', 'mask', 'pattern', 'symbol', 'marker']);

export function isQuiet(localName: string): boolean {
  return QUIET.has(localName.toLowerCase());
}

/** Cuts the drawing: consecutive still parts share one layer, each swaying part has its own, in painting order. */
export function plan(open: string, parts: Part[]): LayerPlan[] {
  const groups: { idx: number[]; bz: string | null }[] = [];
  parts.forEach((p, i) => {
    if (p.quiet) return;
    const last = groups[groups.length - 1];
    if (p.bz === null && last && last.bz === null) last.idx.push(i);
    else groups.push({ idx: [i], bz: p.bz });
  });
  return groups.map(g => {
    const mine = new Set(g.idx);
    let body = '';
    parts.forEach((p, i) => {
      if (p.quiet || mine.has(i)) body += p.xml;
      else if (p.defines) body += `<g visibility="hidden">${p.xml}</g>`;
    });
    return { svg: `${open}${body}</svg>`, bz: g.bz };
  });
}

/** Where a point of the drawing lands in a picture of w × h pixels (the drawing standing on the bottom, centred). */
export function placeOf(viewBox: number[], w: number, h: number): { s: number; ox: number; oy: number } {
  const [, , vw, vh] = viewBox;
  const s = Math.min(w / vw, h / vh);
  return { s, ox: (w - vw * s) / 2, oy: h - vh * s };
}
