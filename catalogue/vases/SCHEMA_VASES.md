# Vase specs measured on the reference photos

Goal: every vessel (vase, coupe, pot, basin, pin-frog) visible in the reference photos is rebuilt as a procedural SVG vessel for the shop's "Le contenant" step. The renderer draws a vessel from the numbers below, so they must describe the real object precisely: proportions first, then material, colour and the small details that make it credible.

The photos in `C:\Users\agent\Desktop\flower\Composition reference\` are third-party images: analyse them locally only. Never upload, publish, paste or send them (or crops of them) anywhere. Crops and grids you make for measuring go in your own scratch folder only.

## How to measure

1. Open the photo (Read tool). Locate the vessel.
2. Crop the vessel with Python/PIL (PIL 12 is installed), upscale it if small, and draw a measurement grid on it (e.g. 20 horizontal lines from foot to lip, labelled 0–100 %, plus a vertical centre line). Save the crop in your scratch folder and Read it. Measure the half-width (centre to outer edge) of the silhouette at each grid height, in pixels, then convert to cm.
3. Real size: estimate the vessel's real height in cm from the flowers next to it (rose head 7–9 cm, peony 12–15 cm, lily flower 15–18 cm, ranunculus 5–6 cm, anthurium spathe 10–14 cm, orchid flower 8–10 cm, tulip 5–6 cm) and from common vase sizes. Then scale every pixel measure with the same factor.
4. Ignore perspective: the profile is the outline seen from the front. The renderer adds the mouth ellipse itself.

## Output: one JSON object per distinct vessel

```json
{
  "id": "coupe-rosee",                 // unique kebab-case id, French words, no accents
  "refs": [9],                         // reference numbers (n) where this vessel appears
  "n": "Coupe sur pied rosée",         // French display name, max 24 characters, elegant shop wording
  "m": "céramique mate",               // French material label, max 22 characters
  "family": "coupe",                   // coupe | boule | vase | cylindre | bouteille | calice | urne | jarre | pot | bassin | sculpture | pique-fleurs
  "shape": "lathe",                    // lathe (round, turned) | box (rectangular) | outline (any other front silhouette: head, heart, lobed basin…)
  "h_cm": 14.5,                        // total height of the vessel (without its stand)
  "prof": [[0,5.2],[0.6,5.4],[1.4,3.3],[5,1.8],[8,2.0],[10,5.2],[12.6,9.2],[14.5,10.8]],
                                       // lathe: [height_cm, outer radius_cm] from the foot (0) to the top of the lip; 10–22 points;
                                       // sharp steps (foot disc, ledge) = two points at almost the same height
  "mouth_cm": 10.2,                    // radius of the OPENING (inside the lip); the stems enter there
  "lip": "plain",                      // plain | rolled | flared | thin | wavy | beaded | lobed | square
  "lip_cm": 0.6,                       // visible lip thickness
  "mat": "matte",                      // matte | satin | gloss | metal | glass | stone
  "finish": "",                        // metal: polished | brushed | patina | hammered ; glass: clear | smoked | tinted | frosted | blown ; stone: travertine | marble | onyx | concrete
  "col": "#e9d9d6",                    // main body colour as it would be in neutral light (not its shadow side)
  "col2": null,                        // secondary colour: drip glaze, painted motif, gradient end, inner glaze, edges…
  "tex": [],                           // any of: ribs, flutes, facets, grooves, speck, terrazzo, marble, agate, crackle, reticulated, drips, hammered, brushed, beads, relief, chinoiserie, painted, gradient, bubbles
  "tex_notes": "",                     // the numbers that make the texture right: rib count, facet count, drip length, gradient direction, motif description…
  "handles": null,                     // or {"n":2,"from_cm":9,"to_cm":13,"out_cm":3.5,"thick_cm":0.9,"shape":"loop|ear|scroll|ring"}
  "stand": null,                       // what the vessel stands on, if any: {"type":"cube|column|stool|stand|disc|block|console|counter","w_cm":20,"h_cm":20,"col":"#e6e4df","mat":"plâtre","notes":"…"}
  "surface": "blanc",                  // table under it: beton | blanc | noir | bois | marbre | none
  "glass": null,                       // glass only: {"tint":"#192511","opacity":0.55,"water_cm":10,"extra":"goldfish, central tube…"}
  "outline": null,                     // shape=box: {"w_cm":12,"d_cm":12} ; shape=outline: [[x_cm,h_cm],…] the whole front silhouette clockwise from the bottom-left, x from the centre axis (negative = left), 24–60 points, plus "mouth":[x_left_cm,x_right_cm,h_cm]
  "price_eur": 59,                     // real retail price of such a vessel in France in 2026 (shop, designer or florist), stand included if it is part of the look
  "why": "",                           // one French sentence for the shop: what makes this vessel special (e.g. "Le compotier des tables d'atelier, en grès sablé.")
  "details": ""                        // everything else a renderer must know to make it credible and faithful (proportions you are unsure about, highlights, reflections, seams, foot shape, how the bouquet sits in it)
}
```

## Rules

- One object per DISTINCT vessel. If two references show the same vessel (same shape, material and colour), merge them (list both refs). Same shape in two clearly different colours or materials = two objects.
- References where the vessel is hidden or absent: still write an object with `"family":"none"` and describe what is visible (surface, stand, counter) in `details`, so the scene can be rebuilt.
- Measure; do not guess from the type name. A "coupe sur pied" can be shallow or deep, with a thin or fat stem; the numbers must match THIS photo.
- Colours: sample them from the photo (PIL getpixel on the lit side and the shadow side), give the lit body colour in `col`.
- Write valid JSON (no comments) as an array to the output file given in your task.
