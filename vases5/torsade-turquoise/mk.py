# The turquoise twisted glass vase, copied from ref. 087 (owner's decision of 2026-10-16: exact, measured copies).
# Sources, all measured on the photograph and kept as numbers or maps in this workshop (the photograph stays in out/):
#   seg.py         the vase isolated (out/vase_mask.png), the bouquet's stems seen through it (left out of the comparison)
#   trace.py       the folds traced as polylines (traces.json): dark lines (glass seen edge-on) and light threads
#   photo_model.py the material measured (thickness of turquoise glass, frost) and the light computed on the depth map's normals
# This generator writes the glass as SVG: the lit field as nested tone bands softened by a blur, its transparency as a mask
# of grey bands (the light the glass lets through), the traced folds as stroked curves with their measured width and depth.
#   python mk.py photo|shop [key=value ...]
#     photo: in the reference's frame (out/mk_photo.svg, no backdrop) for mesure.py
#     shop:  the shop's view (out/mk_shop.svg) and the engine's files out/body.json, out/fiche.json
import sys, os, math, json, time, gzip
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..'))
os.chdir(HERE)
PROJ = sys.argv[1] if len(sys.argv) > 1 else 'shop'
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
import photo_model as P
P.OPT.update(OPT)
import svgkit as K
F = P.F
t0 = time.time()

# ---------------------------------------------------------------- frames
KW = int(F('k', 2))                                   # work pixels per photo pixel
UPC = 9.75; S_SHOP = UPC / P.PPC                      # shop units per photo pixel
X_MOUTH, Y_MOUTH, R_MOUTH = 230.0, 343.0, 16.0        # the opening, measured on the photograph (between the two top voiles)
if PROJ == 'shop':
    mapf = lambda x, y: (500 + (x / KW - P.FOOT[0]) * S_SHOP, 990 - (P.FOOT[1] - y / KW) * S_SHOP)
    BG = np.array([248, 244, 238.]) / 255             # the shop's paper
    VB = (500 - 14 * UPC, 990 - 48.5 * UPC, 28 * UPC, 50 * UPC)
    q = F('q', .2)
else:
    mapf = lambda x, y: (x / KW, y / KW)
    BG = None
    VB = (0, 0, 474, 845)
    q = F('q', .25)
fmt = K.fmt

f = P.field(KW)
E, T, M = f['E'], f['T'], f['M']
if BG is None:
    BG = np.array([np.median(f['B'][M][:, i]) for i in range(3)])       # the reference's backdrop behind the vase
C = np.clip((E + T * BG) * 255, 0, 255)
# the tone bands and their blur flatten the modelling a little: give it back as local contrast, measured against the reference
ck = F('ck', 0.0)
if ck:
    Cm = P.masked_blur(C, M, 6 * KW)
    C = np.where(M[..., None], np.clip(Cm + (C - Cm) * (1 + ck), 0, 255), C)
BG255 = BG * 255
print('field %dx%d %.1fs' % (M.shape[1], M.shape[0], time.time() - t0))

# ---------------------------------------------------------------- back (behind the stems): the tall frosted voile on the left
yy, xx = np.mgrid[0:M.shape[0], 0:M.shape[1]] / KW
is_back = M & (yy < Y_MOUTH + 2) & (xx < X_MOUTH - 8)
is_back = cv2.GaussianBlur(is_back.astype(np.float32), (0, 0), 4 * KW) > .5     # a rounded edge, not a drawn corner
is_back &= M

# ---------------------------------------------------------------- transparency and the colour each part must be drawn with
Tl = T @ np.array([.3, .59, .11])
alpha = np.clip(1 - Tl, 0, 1)
amin = np.max(1 - C / np.maximum(BG255, 1), axis=2) + .03
alpha = np.where(M, np.maximum(alpha, amin), 0)
alpha = np.clip(alpha, F('amin', .3), 1)
asm = cv2.GaussianBlur(K.extend(alpha, M, 4)[0].astype(np.float32), (0, 0), F('asig', .8))
asm = np.maximum(asm, np.max(1 - C / np.maximum(BG255, 1), axis=2) + .02)
astep = F('astep', .04)
aq = np.clip(np.round(asm / astep) * astep, F('amin', .3), 1)
Cf = np.clip((C - (1 - aq[..., None]) * BG255) / aq[..., None], 0, 255)


def outline(mask, lev=.5, step=3.0, sig_=.8):
    fm = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), sig_)
    return K.contour_paths(fm, lev, step, q, mapf, 1.0)


def gbands(col, mask, step, dy):
    Y = col @ np.array([.3, .59, .11])
    Yg = 255 * (np.clip(Y, 0, 255) / 255) ** F('bgam', .62)
    out = K.bands(np.repeat(Yg[..., None], 3, -1), mask, mapf, q, step, dy=dy)
    ce, me = K.extend(col, mask, 6); Ye, _ = K.extend(Yg, mask, 6)
    res = []
    for c_, d_ in out:
        lv = int(c_[1:3], 16)
        sel = me & (np.abs(Ye - lv) < dy * .6)
        res.append((K.hexc(ce[sel].mean(0) if sel.sum() > 2 else ce[me].mean(0)), d_))
    return res


defs = ['<filter id="bl" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
        % fmt(F('blur', .8) * (S_SHOP if PROJ == 'shop' else 1))]
K.RDP_EPS = F('rdp', .8); K.FIT_EPS = 0; K.AREA_MIN = F('bamin', 12)
dy = F('dy', 6.0 if PROJ == 'photo' else 7.5); step = F('step', 4.0)
parts = {}
# within each part, sub-regions of like chroma (pale frosted glass, turquoise, deep glass): a tone band holds one colour, so
# bands are cut where the hue holds still; the sub-regions overlap their neighbours by two pixels (no seam)
import sys as _s
_s.path.insert(0, '..')
from mesure import to_lab
labf = to_lab(np.clip(cv2.GaussianBlur(Cf, (0, 0), 3 * KW), 0, 255).astype(np.uint8)[:, :, ::-1])
chroma = np.hypot(labf[..., 1], labf[..., 2])
cuts = [float(v) for v in OPT.get('ccuts', '12,18').split(',')]
ccls = np.digitize(chroma, cuts)
ccls = cv2.medianBlur(ccls.astype(np.uint8), 2 * int(2 * KW) + 1)
nreg = 0
for name, pm in (('back', is_back), ('front', M & ~is_back)):
    parts[name] = ''
    if pm.sum() < 50:
        continue
    for cl in range(len(cuts) + 1):
        sub = pm & (ccls == cl)
        if sub.sum() < 40 * KW * KW:
            continue
        md = cv2.dilate(sub.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=2).astype(bool)
        # the back and the front meet edge to edge (each is drawn through the transparency mask: an overlap would show)
        md &= is_back if name == 'back' else ~is_back
        K.RDP_EPS = F('rdpo', .3); od = outline(md, .5); K.RDP_EPS = F('rdp', .8)
        mm = cv2.erode(sub.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
        if mm.sum() < 20:
            mm = sub
        bb = gbands(Cf, mm, step, dy)
        if not bb:
            continue
        cid = 'c%s%d' % (name, cl); nreg += 1
        parts[name] += ('<clipPath id="%s"><path d="%s"/></clipPath><g clip-path="url(#%s)"><path fill="%s" d="%s"/><g filter="url(#bl)">%s</g></g>'
                        % (cid, od, cid, bb[0][0], od, ''.join('<path fill="%s" d="%s"/>' % (c, d) for c, d in bb[1:])))
    parts[name] = '<g>' + parts[name] if parts[name] else ''
print('bands %.1fs' % (time.time() - t0))

# ---------------------------------------------------------------- the traced folds: dark lines and threads of light
TR = json.load(open('traces.json'))
scale = S_SHOP if PROJ == 'shop' else 1.0
DARK = np.array([float(v) for v in OPT.get('darkc', '18,62,70').split(',')])
LIGHT = np.array([float(v) for v in OPT.get('lightc', '236,248,246').split(',')])
lines = {'back': {}, 'front': {}}
for o in TR:
    Pp = np.array(o['pts'])
    if len(Pp) < 4:
        continue
    yb = Pp[:, 1].mean(); xb = Pp[:, 0].mean()
    part = 'back' if (yb < Y_MOUTH + 2 and xb < X_MOUTH - 8) else 'front'
    # its measured colour, laid on at a fixed opacity (the line's centre takes the colour measured on the photograph)
    op = F('dop', .5) if o['kind'] == 'dark' else F('lop', .45)
    col = K.hexc(np.round(np.array(o['rgb']) / 4) * 4)
    w = max(.5, round(o['width'] * 2 * F('wk', 1.0) * 2) / 2)
    key = (col, op, w)
    Q = np.array([mapf(x * KW, y * KW) for x, y in Pp])
    Q = np.round(Q / q) * q
    d = 'M' + K.nums(Q[0]) + 'l' + K.nums((np.diff(Q, axis=0)).ravel())
    lines[part].setdefault(key, []).append(d)
defs.append('<filter id="lb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>'
            % fmt(F('lblur', .45) * scale))
nl = 0
for part in lines:
    s_ = ''
    for (col, op, w), ds in sorted(lines[part].items()):
        s_ += '<path fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s" stroke-linecap="round" d="%s"/>' % (
            col, fmt(op), fmt(w * scale), ''.join(ds))
        nl += len(ds)
    if s_:
        parts[part] += '<g filter="url(#lb)">%s</g>' % s_
for part in parts:
    if parts[part]:
        parts[part] += '</g>'

# ---------------------------------------------------------------- transparency mask
K.RDP_EPS = F('rdpa', .8); K.AREA_MIN = F('aamin', 40)
Md = cv2.dilate(M.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=4).astype(bool)
af = K.extend(np.where(M, aq, 0), M, 5)[0].astype(np.float32)
mfill = ['<path fill="%s" d="%s"/>' % (K.hexc([F('amin', .3) * 255] * 3), outline(Md, .4))]
for a in np.arange(F('amin', .3) + astep, 1.0001, astep):
    d = K.contour_paths(np.where(Md, af, 0), a - astep / 2, 4.0, q, mapf, 1.0)
    if d:
        mfill.append('<path fill="%s" d="%s"/>' % (K.hexc([a * 255] * 3), d))
x0, y0, w0, h0 = VB
defs.append('<filter id="ab" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % fmt(F('mblur', .4) * scale))
defs.append('<mask id="ma" maskUnits="userSpaceOnUse" x="%s" y="%s" width="%s" height="%s"><g filter="url(#ab)">%s</g></mask>'
            % (fmt(x0), fmt(y0), fmt(w0), fmt(h0), ''.join(mfill)))
K.RDP_EPS = F('rdpo', .3)
defs.append('<clipPath id="sil"><path d="%s"/></clipPath>' % outline(M, .5))
body_svg = '<g mask="url(#ma)"><g clip-path="url(#sil)">%s</g></g>' % parts['front']
back_svg = '<g mask="url(#ma)"><g clip-path="url(#sil)">%s</g></g>' % parts['back'] if parts['back'] else ''
vb = '%s %s %s %s' % tuple(fmt(v) for v in VB)
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs><g id="back">%s</g><g id="vase">%s</g></svg>'
       % (vb, ''.join(defs), back_svg, body_svg))
open('out/mk_%s.svg' % PROJ, 'w').write(svg)
print('svg %d bytes (gzip %d), %d lines, %.1fs' % (len(svg), len(gzip.compress(svg.encode())), nl, time.time() - t0))

if PROJ == 'shop':
    # ---- the engine's numbers, in shop units
    mx = (X_MOUTH - P.FOOT[0]) * S_SHOP; mh = (P.FOOT[1] - Y_MOUTH) * S_SHOP; mo = R_MOUTH * S_SHOP
    # the cavity: inside the walls round the measured centre line, above the solid bottom
    SZ = np.array([0, 2, 4, 6, 8, 10, 12, 14, 16, 18.5, 21, 23.5, 26, 28.5, 31, 33.5, 36, 38.5, 42])
    SC = np.array([0, .05, 0, 0, .2, .7, 1.8, 2.4, 1.6, -.3, -1.8, -3.5, -5.2, -6.2, -6.5, -6.0, -5.0, -4.2, -2.3])
    zf = 3.2; zm = (P.FOOT[1] - Y_MOUTH) / P.PPC
    rin = lambda z: float(np.interp(z, [3.2, 6, 9, 13, 17, 22, 42], [5.0, 6.5, 6.4, 4.2, 2.6, 2.3, 1.6]))
    L_, R_ = [], []
    for z in np.linspace(zf, zm, 50):
        c = float(np.interp(z, SZ, SC))
        xp = P.FOOT[0] + c * P.PPC; yp = P.FOOT[1] - z * P.PPC
        L_.append(mapf((xp - rin(z) * P.PPC) * KW, yp * KW)); R_.append(mapf((xp + rin(z) * P.PPC) * KW, yp * KW))
    xb, yb = mapf(P.FOOT[0] * KW, (P.FOOT[1] - zf * P.PPC) * KW); rb = rin(zf) * UPC
    bottom = [(xb + rb * math.cos(math.pi * k / 16), yb + rb * .16 * math.sin(math.pi * k / 16)) for k in range(17)]
    xt, yt = 500 + mx, 990 - mh
    top = [(xt - mo * math.cos(math.pi * k / 16), yt - mo * .16 * math.sin(math.pi * k / 16)) for k in range(17)]
    inner = 'M' + 'L'.join('%.1f,%.1f' % p for p in bottom + L_[1:-1] + top + R_[::-1][1:-1]) + 'Z'
    cavb = round(yb + rb * .16 * .6, 1)
    cavs = [[round(a, 1), round(b, 1), round(rin(z) * UPC, 1)] for z in np.linspace(zf, zm, 16)
            for a, b in [mapf((P.FOOT[0] + float(np.interp(z, SZ, SC)) * P.PPC) * KW, (P.FOOT[1] - z * P.PPC) * KW)]]
    K.write_body('out/body.json', ''.join(defs), body_svg, back=back_svg, inner=inner, cavb=cavb, cavr=round(rb, 1))
    bj = json.load(open('out/body.json', encoding='utf-8')); bj['cavs'] = cavs
    json.dump(bj, open('out/body.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    cs, _ = cv2.findContours(M.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cc = K.rdp_closed(max(cs, key=cv2.contourArea)[:, 0, :].astype(float), 1.5 * KW)
    pts = [[round(x - 500, 1), round(990 - y, 1)] for x, y in (mapf(a, b) for a, b in cc)]
    hmax = max(p[1] for p in pts)
    prof = []
    for h in np.linspace(0, hmax, 40):
        row = int(round((P.FOOT[1] - h / S_SHOP) * KW)); xs_ = np.nonzero(M[min(max(row, 0), M.shape[0] - 1)])[0]
        prof.append([round(float(h), 1), round(float((xs_.max() - xs_.min()) / 2 / KW * S_SHOP) if xs_.size else 1.0, 1)])
    why = ("Une torsade de verre soufflé turquoise : un col qui monte en grand S depuis une panse en toupie au pied bleu "
           "nuit, enveloppé de voiles minces au bord libre qui s'enroulent en hélice, givrés et laiteux vers le haut.")
    fiche = {"id": "verre-torsade-turquoise", "refs": [], "n": "Vase en verre torsadé turquoise",
             "m": "verre soufflé turquoise, voiles dépolis, pied bleu nuit", "fam": "sculpture", "shape": "outline", "p": 0,
             "mat": "glass", "fin": "", "col": "#5fa3a6", "col2": "#123040", "lip": "plain", "lipw": 2.0, "why": why,
             "ol": {"pts": pts, "mouth": [round(mx - mo, 1), round(mx + mo, 1), round(mh, 1)], "d": round(2 * 8.6 * UPC, 1)},
             "h": round(hmax, 1), "prof": prof, "mo": round(mo, 1), "mx": round(mx, 1), "mh": round(mh, 1), "sf": "none",
             "svgb": "torsade"}
    json.dump(fiche, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    raw = open('out/body.json', encoding='utf-8').read()
    print('body.json %d bytes, gzip %d' % (len(raw), len(gzip.compress(raw.encode()))))
