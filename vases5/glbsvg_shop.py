# The engine's contract for a vase drawn in the shop view (body.json + fiche.json), shared by glbsvg.py and verrelys.py.
import os, json, gzip
import numpy as np
import glbkit, svgkit


def shop_out(OUT, VASE, OPT, body, defs, cam, log):
    F = lambda k, d: float(OPT.get(k, d))
    """the engine's contract: body.json (svgkit.write_body) and the catalogue entry fiche.json - the vessel's profile (median
    radius of the GLB's vertices per height), its mouth (height, half width, offset) in shop units"""
    m_ = glbkit.Model(os.path.join(OUT, 'model.glb'))
    v = m_.v * np.array([cam.get('sx', 1), 1, cam.get('sx', 1)])
    U = F('hcm', 26) * svgkit.UPC
    rad = np.hypot(v[:, 0], v[:, 2]); y = v[:, 1]
    NB = 40
    prof = []
    for i in range(NB + 1):
        z = np.abs(y - i / NB) < .6 / NB
        prof.append([round(i / NB * U, 1), round(float(np.percentile(rad[z], F('profpct', 50))) * U if z.any() else 1.0, 1)])
    mh = F('mouth_h', 1.0)
    z = np.abs(y - mh) < .015
    mo = F('mouth_r', float(np.percentile(rad[z], 40)) if z.any() else .1) * U * .92
    fiche = dict(json.loads(OPT.get('fiche', '{}')) if isinstance(OPT.get('fiche'), str) else OPT.get('fiche', {}))
    fiche.update(svgb=VASE, prof=prof, h=round(U, 1), mo=round(mo, 1), mh=round(mh * U, 1), mx=round(F('mouth_x', 0) * U, 1))
    for kk in ('mh', 'mx', 'mo'):                      # the mouth read on the shop view, in shop units, wins
        if kk + '_u' in OPT:
            fiche[kk] = F(kk + '_u', 0)
    json.dump(fiche, open(os.path.join(OUT, 'fiche.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    d = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), body)
    js = json.dumps(d, separators=(',', ':')).encode()
    log('shop: body.json %.0f Ko, gzip %.0f Ko; fiche h %.1f mo %.1f mh %.1f' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024, U, mo, mh * U))
