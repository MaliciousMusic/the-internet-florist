// Loads a species module of the chantier: insectes/<id>/<id>.mjs exports META and draw(az, el, opts).
// META: { id, bodyMm, span (mm across a cell), el: [elevations], poses: { pose: [frame values] },
//         lod: { S: { cell, az (step, degrees), poses }, L?: {...} } }
export async function espece(id) {
  const m = await import(new URL(`../${id}/${id}.mjs`, import.meta.url));
  if (!m.META || !m.draw) throw new Error(`${id}: META and draw are required`);
  return m;
}
