# The globular bronze jar with golden carp, ref. 014 (vases5/carpes-dorees): the generator.
#   python mk.py photo   -> out/vase_photo.svg, in the reference's framing (twice its pixels), for the comparison
#   python mk.py shop    -> out/vase_shop.svg, out/body.json (the engine's SVGB entry) and out/fiche.json (the catalogue entry)
# options key=value (see P below). The photograph is never read here: the profile and the camera are numbers measured once.
import sys
import os
import json
import time
import numpy as np
import cv2
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit as K  # noqa: E402
import geom as G  # noqa: E402
import light as Lt  # noqa: E402
import render as Rd  # noqa: E402
import vec  # noqa: E402

VIEW = sys.argv[1] if len(sys.argv) > 1 else 'shop'
# the settings of the delivered body (tone steps, contour sampling, simplification, smoothing of the carp's colour field)
P = dict(dy_c=14, step=8, rdp=.9, dy_g=7, csm=1.0)
P.update({k: float(v) for k, v in (a.split('=', 1) for a in sys.argv[2:] if '=' in a)})
t0 = time.time()


def log(s):
    print(s, flush=True)


def lid_photo(V, q):
    """photo view only: the flat top of the rolled lip and the dark inside of the mouth (the shop's engine draws its own)"""
    a = np.linspace(0, 2 * np.pi, 73)[:-1]
    ro, ri = G.rr[-1], G.rr[-1] - G.LIPW
    def ring(r, h):
        Pw = np.c_[r * np.sin(a), np.full_like(a, h), r * np.cos(a)]
        return V.world(Pw)
    O = ring(ro, G.H_CM); I = ring(ri, G.H_CM)
    p = lambda U: 'M' + 'L'.join(vec.nums(u, q) for u in U) + 'z'
    hl = 'M' + 'L'.join(vec.nums(u, q) for u in O[4:33])
    return ('<path fill="#8e5434" d="%s"/><path fill="#56260c" d="%s"/><path fill="none" stroke="#d6b29a" stroke-width="2.4" '
            'stroke-linecap="round" d="%s"/>' % (p(O), p(I), hl))


def main():
    sc = P.get('spx', 2.5 if VIEW == 'shop' else 2.0)
    R, F = Rd.render(VIEW, sc, log=log)
    if VIEW == 'photo':
        cv2.imwrite('work/prev_photo.png', Rd.preview(R)[:, :, ::-1])
    else:
        cv2.imwrite('work/prev_shop.png', Rd.preview(R)[:, :, ::-1])
    k = 1.0 if VIEW == 'shop' else 2.0
    defs, body, nb = vec.write(R, F, VIEW, out_scale=k, P=P)
    log('vector %.1fs, %d bands' % (time.time() - t0, nb))
    if VIEW == 'photo':
        V = vec.View(R, VIEW, k)
        lid = lid_photo(V, .2)
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1128 1036"><rect width="1128" height="1036" fill="#ffffff"/>'
               '<defs>%s</defs><g id="vase">%s%s</g></svg>' % (''.join(defs), ''.join(body), lid))
        open('out/vase_photo.svg', 'w', encoding='utf-8').write(svg)
        log('photo svg %d bytes' % len(svg))
        return
    # ---- the shop
    vb = K.shop_vb(2 * G.RMAX + 1.2, G.H_CM + .6, .8)
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs><g id="vase">%s</g></svg>' % (vb, ''.join(defs), ''.join(body)))
    open('out/vase_shop.svg', 'w', encoding='utf-8').write(svg)
    d = K.write_body('out/body.json', ''.join(defs), ''.join(body))
    U = Lt.UPC
    prof = [[round(h * U, 1), round(float(G.r_of_h(h)) * U, 2)] for h in
            sorted(set([0, .05, .42, .5, .56, .66, .85, 1.2] + list(np.round(np.arange(1.6, 22.2, 1.3), 2)) +
                       [22.2, 22.6, 22.9, 23.15, 23.35, 23.6, 24.2, 24.85, 25.0, 25.2, 25.45, 25.7, 25.88, 26.0]))]
    H = round(G.H_CM * U, 1)
    mo = round((G.rr[-1] - G.LIPW - .1) * U, 1)
    fiche = {"id": "bronze-carpes-dorees", "refs": [], "n": "Jarre en bronze aux carpes dorées",
             "m": "bronze patiné brun chocolat à caramel, carpes en haut-relief d’alliage doré", "fam": "boule", "shape": "lathe", "p": 0,
             "mat": "metal", "fin": "", "col": "#6e3a1c", "col2": "#c07a3a", "lip": "rolled", "lipw": round(G.LIPW * U, 1),
             "why": "Une jarre globulaire de bronze patiné, du chocolat au caramel, autour de laquelle nage un banc de carpes dorées "
                    "en haut-relief : le vieux motif japonais de la persévérance, redessiné avec nos propres carpes.",
             "prof": prof, "h": H, "mo": mo, "mx": 0, "mh": H, "sf": "none", "svgb": "carpes-dorees"}
    json.dump(fiche, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False)
    import gzip
    raw = open('out/body.json', 'rb').read()
    log('shop svg %d bytes; body.json %d bytes, gzip %d bytes; %.1fs' % (len(svg), len(raw), len(gzip.compress(raw, 9)), time.time() - t0))


if __name__ == '__main__':
    main()
