
/* ================= Head footprints, measured (lab/foot.js) =================
   FOOT_SP[sid] = [offset, semi-axis across, semi-axis along]: where a species' drawn head (or cluster on its own stem) really lies,
   along its stem from the point the composer places it (toward the head), in units of the radius the composer gives it; semi-axes =
   2 sigma of its painted pixels (the across one takes half the median sideways offset: one-sided sprays). Medians over the open heads of
   drawn bouquets (Printemps à la carpe, seeds 3, 5, 7), 2026-10-09. A species not listed takes the footprint of its outline class (c4
   footOf). Regenerate with lab/foot.js (footSamples on drawn bouquets, then footTable). */
const FOOT_SP={
 "alchemille":[-1.2,1.03,2.76],
 "anemone-coronaria":[0.2,0.94,0.78],
 "anemone-sauvage":[0.15,0.87,0.78],
 "freesia":[1.01,2.51,1.28],
 "fritillaire-meleagris":[-1.76,1.79,1.44],
 "iris-hollandais":[1.2,0.97,1.04],
 "jacinthe":[1.29,0.78,1.74],
 "lilas":[0.65,0.49,0.72],
 "muscari":[0.97,0.69,1.92],
 "narcisse-bouquet":[2.14,2.74,1.75],
 "narcisse-trompette":[0.14,1.01,0.99],
 "pois-de-senteur":[1.19,1.57,1.77],
 "renoncule-butterfly":[-0.13,0.39,0.66],
 "renoncule-classique":[0.15,0.95,0.86],
 "tulipe-double":[0.7,0.87,0.79],
 "tulipe-frangee":[0.9,0.8,0.87],
 "tulipe-perroquet":[0.73,0.94,0.68],
 "tulipe-simple":[0.87,0.79,0.82],
 "viburnum-roseum":[0.62,1.2,0.93]};
