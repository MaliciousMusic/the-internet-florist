# The globular bronze jar with golden carp, ref. 014, drawn on the geometry of the measuring model (out/model.glb, private):
#   python mk_glb.py photo   -> out/vase_photo.svg (the reference's framing, twice its pixels), for the measures
#   python mk_glb.py shop    -> out/vase_shop.svg, out/body.json, out/fiche.json
# The model gives the shape (normals, depth, the gold of the carp); the light and the colours are measured on the photograph
# (light_fit_glb.json). Only curves leave.
import sys, os, json, time, gzip
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402
import render_glb as RG  # noqa: E402
import vec_glb  # noqa: E402

VIEW = sys.argv[1] if len(sys.argv) > 1 else 'shop'
P = dict(dy_g=5.0, dy_c=9.0, step=2.2, rdp=.5)
P.update({k: float(v) for k, v in (a.split('=', 1) for a in sys.argv[2:] if '=' in a)})
t0 = time.time()
F = RG.fields(VIEW)
if VIEW == 'photo':
    lab, head = RG.labels_photo(F['M'])
else:
    Fp = RG.fields('photo')
    lp, hp = RG.labels_photo(Fp['M'])
    lab, head = RG.transfer_labels(Fp, lp, hp, F)
    del Fp
col = RG.shade(F, lab, head)
colb = RG.shade(F, lab, head, smooth=True)
defs, body, nb = vec_glb.write(VIEW, F, col, colb, P)
print('fields+vector %.1fs, %d bands' % (time.time() - t0, nb), flush=True)
if VIEW == 'photo':
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1128 1036"><rect width="1128" height="1036" fill="#ffffff"/>'
           '<defs>%s</defs><g id="vase">%s</g></svg>' % (''.join(defs), ''.join(body)))
    open('out/vase_photo.svg', 'w', encoding='utf-8').write(svg)
    print('photo svg %d bytes' % len(svg))
    sys.exit()
# ---- the shop: the profile measured on the model's silhouette (its patina, the carp's relief left out)
U = K.UPC
Pm = F['P']; ok = F['mask'] & ~F['gold']
r = np.hypot(Pm[..., 0], Pm[..., 2])[ok] * RG.HCM; h = Pm[..., 1][ok] * RG.HCM
hs = np.r_[0, .05, .25, .5, .6, .8, 1.2, np.arange(1.6, 22.2, 1.3), 22.2, 22.6, 22.9, 23.15, 23.35, 23.6, 24.2, 24.85, 25.0, 25.2, 25.45, 25.7, 25.88, 26.0]
prof = []
for hh in hs:
    s = np.abs(h - hh) < .12
    rr = float(np.percentile(r[s], 98)) if s.sum() > 20 else None
    if rr is not None:
        prof.append([round(float(hh) * U, 1), round(rr * U, 2)])
rtop = prof[-1][1] / U
vb = K.shop_vb(2 * max(p[1] for p in prof) / U + 1.6, RG.HCM + .6, .8)
svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs><g id="vase">%s</g></svg>' % (vb, ''.join(defs), ''.join(body))
open('out/vase_shop.svg', 'w', encoding='utf-8').write(svg)
K.write_body('out/body.json', ''.join(defs), ''.join(body))
Hh = round(RG.HCM * U, 1)
lipw = .55
fiche = {"id": "bronze-carpes-dorees", "refs": [], "n": "Jarre en bronze aux carpes dorées",
         "m": "bronze patiné brun chocolat à caramel, carpes en haut-relief d’alliage doré", "fam": "boule", "shape": "lathe", "p": 0,
         "mat": "metal", "fin": "", "col": "#6e3a1c", "col2": "#c07a3a", "lip": "rolled", "lipw": round(lipw * U, 1),
         "why": "Une jarre globulaire de bronze patiné, du chocolat au caramel, autour de laquelle nage un banc de carpes dorées "
                "en haut-relief : copie mesurée d’un bronze japonais de l’ère Meiji, choix du porteur.",
         "prof": prof, "h": Hh, "mo": round((rtop - lipw - .1) * U, 1), "mx": 0, "mh": Hh, "sf": "none", "svgb": "carpes-dorees"}
json.dump(fiche, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False)
raw = open('out/body.json', 'rb').read()
print('shop svg %d bytes; body.json %d bytes, gzip %d bytes; %.1fs' % (len(svg), len(raw), len(gzip.compress(raw, 9)), time.time() - t0))
