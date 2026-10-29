/* the drawing cut into layers, each painted once as a picture: the static ones, and each layer the breeze sways.
   Every frame then only turns a few pictures, instead of redrawing thousands of shapes and their shadows. */

export interface Part {
  /** the markup of one top-level element of the drawing */
  xml: string;
  /** its breeze mark, if it sways */
  bz: string | null;
  /** true when it paints nothing itself (defs, style…): kept in every layer */
  quiet: boolean;
  /** the ids it holds: a part another one points at is kept hidden in that one's layer rather than dropped */
  ids: string[];
  /** the ids it points at (url(#…), href="#…") */
  uses: string[];
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

/** the ids a piece of markup points at */
export function usesOf(xml: string): string[] {
  const out = new Set<string>();
  for (const m of xml.matchAll(/url\(#([^)\s]+)\)|href="#([^"]+)"/g)) out.add(m[1] ?? m[2]);
  return [...out];
}

/** Cuts the drawing: consecutive still parts share one layer, each swaying part has its own, in painting order. A layer
 *  keeps hidden only the other parts holding what it points at (and what those point at): a bouquet cut into many pieces,
 *  each with its own definitions, would otherwise carry the whole drawing in every layer. */
export function plan(open: string, parts: Part[]): LayerPlan[] {
  const groups: { idx: number[]; bz: string | null }[] = [];
  parts.forEach((p, i) => {
    if (p.quiet) return;
    const last = groups[groups.length - 1];
    if (p.bz === null && last && last.bz === null) last.idx.push(i);
    else groups.push({ idx: [i], bz: p.bz });
  });
  const holder = new Map<string, number>();
  parts.forEach((p, i) => p.ids.forEach(id => holder.has(id) || holder.set(id, i)));
  return groups.map(g => {
    const mine = new Set(g.idx);
    const kept = new Set<number>();
    const todo = g.idx.flatMap(i => parts[i].uses);
    while (todo.length) {
      const i = holder.get(todo.pop()!);
      if (i === undefined || mine.has(i) || kept.has(i) || parts[i].quiet) continue;
      kept.add(i);
      todo.push(...parts[i].uses);
    }
    let body = '';
    parts.forEach((p, i) => {
      if (p.quiet || mine.has(i)) body += p.xml;
      else if (kept.has(i)) body += `<g visibility="hidden">${p.xml}</g>`;
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
