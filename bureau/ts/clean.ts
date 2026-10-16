/* the drawing of a file chosen by hand is shown, never run: no script, no event handler, no link out of the drawing */

const DROPPED = new Set(['script', 'foreignobject', 'iframe', 'object', 'embed', 'audio', 'video']);

/** true when a link may stay: inside the drawing, or an embedded image */
export function safeHref(v: string): boolean {
  const s = v.trim().toLowerCase();
  return s.startsWith('#') || /^data:image\/(png|jpe?g|webp|gif);/.test(s);
}

export function clean(root: Element): void {
  const walk = [root];
  while (walk.length) {
    const el = walk.pop()!;
    for (const child of Array.from(el.children)) {
      if (DROPPED.has(child.localName.toLowerCase())) child.remove();
      else walk.push(child);
    }
    for (const at of Array.from(el.attributes)) {
      const n = at.name.toLowerCase();
      if (n.startsWith('on') || ((n === 'href' || n === 'xlink:href' || n === 'src') && !safeHref(at.value))) el.removeAttribute(at.name);
    }
  }
}
