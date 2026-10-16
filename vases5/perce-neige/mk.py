# The snowdrop vase (reference 063): a glossy tube-lined earthenware baluster.
#   form   - the turned body of the GLB model (profile of paint.py: its radius by height, its own relief and texture left out),
#            seen from the photograph's pose (glbkit.py) or the shop's;
#   paint  - the paint job made from the photograph by paint.py: flat areas of the measured palette on the unrolled body,
#            read back by each view through its position map (one drawing only);
#   light  - the shop's light (svgkit.L3) on the body's normals and the glaze mirroring the photographer's studio (its map
#            measured by paint.py), the surroundings at grazing angles (Fresnel);
#   SVG    - the paint's flat areas, then nested shadow layers, the surroundings' layers and highlight layers over the body,
#            softened by a small blur; the inside of the mouth apart.
#   .venv-depth/Scripts/python mk.py photo|shop [key=value ...]
import sys, os, json, time
import numpy as np, cv2
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit, glbkit  # noqa: E402

A = sys.argv[1:]
VIEW = A[0] if A else 'shop'
OPT = dict(a.split('=', 1) for a in A[1:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
OUT = os.path.join(HERE, 'out')
HCM = F('hcm', 30)                       # real height (cm), estimated: a tube-lined baluster of this shape is 30-36 cm
t0 = time.time()


def log(*a):
    print('%5.1fs' % (time.time() - t0), *a, flush=True)


def hexrgb(h):
    return np.array([int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)])


def load(view):
    g = lambda k: np.load(os.path.join(OUT, 'glb_%s_%s.npy' % (view, k)))
    M = dict(mask=g('mask'), pos=g('pos'))
    M['cam'] = json.load(open(os.path.join(OUT, 'glb_%s_cam.json' % view)))['cam']
    return M


def unrolled(pos, Wu, Hu):
    th = np.arctan2(pos[..., 2], pos[..., 0])
    return ((th / np.pi + 1) / 2 * Wu - .5).astype(np.float32), ((1 - pos[..., 1]) * Hu - .5).astype(np.float32)


# ---------------------------------------------------------------- form
def body(M):
    """the turned body's outward normal in the view's screen frame (x right, y down, z to the eye), and the elements"""
    m, pos = M['mask'], M['pos']
    pr = np.load(os.path.join(OUT, 'profile.npy'))                 # h (descending), radius, dr/dh
    h = np.clip(pos[..., 1], 0, 1)
    drdh = np.interp(h, pr[::-1, 0], pr[::-1, 2])
    th = np.arctan2(pos[..., 2], pos[..., 0])
    nm = np.dstack([np.cos(th), -drdh, np.sin(th)]); nm /= np.linalg.norm(nm, axis=2, keepdims=True)
    Hh, Ww = m.shape
    mv, _ = glbkit.view_matrices(M['cam'], Ww, Hh)
    R = mv[:3, :3] / np.linalg.norm(mv[:3, :3], axis=0)
    n = (nm @ R.T) * np.array([1, -1, 1])
    # the inside of the mouth: a visible point whose outward direction turns away from the eye is the neck's far wall,
    # seen through the opening
    outward = np.dstack([np.cos(th), np.zeros_like(h), np.sin(th)]) @ R.T
    inside = m & (h > .85) & (outward[..., 2] < -.05)
    return n.astype(np.float32), dict(inside=inside, body=m & ~inside)


def paint_labels(M, E):
    P = cv2.imread(os.path.join(OUT, 'paint.png'), 0)
    Hu, Wu = P.shape
    ux, uy = unrolled(M['pos'], Wu, Hu)
    lb = cv2.remap(P, ux, uy, cv2.INTER_NEAREST, borderMode=cv2.BORDER_WRAP).astype(np.int32)
    known = (lb != 255) & E['body']
    if (E['body'] & ~known).any():                                  # a sliver the photograph does not see: its neighbours' paint
        _, (iy, ix) = ndimage.distance_transform_edt(~known, return_indices=True)
        lb = lb[iy, ix]
    lb[~E['body']] = -1
    return lb


# ---------------------------------------------------------------- light
def env_lookup(envmap, n):
    EH, EW = envmap.shape
    rr = 2 * n[..., 2:3] * n - np.array([0, 0, 1.0])
    az = np.arctan2(rr[..., 0], rr[..., 2]); el = np.arcsin(np.clip(-rr[..., 1], -1, 1))
    x = ((az / np.pi + 1) / 2 * EW - .5).astype(np.float32); y = ((.5 - el / np.pi) * EH - .5).astype(np.float32)
    return cv2.remap(envmap.astype(np.float32), x, y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def fresnel(n):
    """share of the surroundings mirrored by the glaze (Schlick, index 1.5): little face on, nearly all at grazing"""
    nz = np.clip(n[..., 2], 0, 1)
    return np.clip(.04 + .96 * (1 - nz) ** 5, 0, 1) * F('envk', .85)


def lighting(M, E, n):
    sel = E['body']
    if VIEW == 'photo' and F('photolight', 1) > 0:
        # the photograph's own diffuse light (fitted by paint.py on the white glaze), for the measured comparison
        coef = np.array(json.load(open(os.path.join(OUT, 'paint.json')))['light'])
        nx, ny, nz = n[..., 0], n[..., 1], n[..., 2]
        Phi = np.stack([np.ones_like(nx), nx, ny, nz, nx * nx, ny * ny, nx * ny, nx * nz, ny * nz], -1)
        return np.clip(Phi @ coef, .05, 3).astype(np.float32), (F('envgain', 1.0) * env_lookup(np.load(os.path.join(OUT, 'env_photo.npy')), n)).astype(np.float32)
    else:
        L = svgkit.L3
        wrap = F('wrap', .3)
        diff = np.clip(((n @ L) + wrap) / (1 + wrap), 0, 1)
        sky = .5 + .5 * np.clip(-n[..., 1], -1, 1)
        D = F('amb', .45) * (sky * .6 + .4) + F('diff', .7) * diff
    D = D / np.median(D[sel])
    D = 1 + F('contrast', .6) * (D - 1)                               # the photographer's light is soft: the shop's as soft
    S = F('envgain', 1.0) * env_lookup(np.load(os.path.join(OUT, 'env_photo.npy')), n)
    # the shop's own studio mirrored sharp by the glossy glaze (softbox up left, window right): the neck and the shoulder
    # catch it as on the photograph
    S = S + F('sspec', .8) * studio(n, F('srough', .04), SHOP_STUDIO)
    return D.astype(np.float32), S.astype(np.float32)


SHOP_STUDIO = [[-.55, -.62, .56, 1.0, .965], [.82, -.18, .55, .6, .98], [0, -1, .15, .25, .6]]


def studio(n, rough, lights):
    """the studio mirrored by a surface of normal n (screen frame, eye along +z): each light a soft disc of its own width"""
    rr = 2 * n[..., 2:3] * n - np.array([0, 0, 1.0])
    s = np.zeros(n.shape[:2])
    for x, y, z, inten, cosw in lights:
        d = np.array([x, y, z]) / np.linalg.norm([x, y, z])
        c = rr @ d
        wd = max(.01, (1 - cosw) * (1 + 3 * rough))
        s += inten * np.clip((c - (1 - wd)) / wd, 0, 1) ** 1.5
    return s * (1 - .7 * np.clip(rr[..., 1], 0, 1))


def compose(M, E, lb, cols, D, S, Fr, env):
    col = cols[np.maximum(lb, 0)] * D[..., None]
    col = col * (1 - Fr[..., None]) + env * Fr[..., None]
    img = np.clip(col + S[..., None], 0, 1)
    img[E['inside']] = hexrgb(OPT.get('incol', '#07080e'))
    img[~M['mask']] = 1
    return img


# ---------------------------------------------------------------- SVG
def nested(f, sel, lev_max, step, q, mapf, k):
    """closed iso-lines of a layer-count field at .5, 1.5, ... (each one more layer)"""
    fe, _ = svgkit.extend(f.astype(np.float32), sel, int(3 * k))
    fe = np.where(cv2.dilate(sel.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0, fe, 0).astype(np.float32)
    out = []
    top = min(float(fe[sel].max()) if sel.any() else 0, lev_max)
    for lev in np.arange(.5, top + .01, 1.0):
        d = svgkit.contour_paths(fe, float(lev), step, q, mapf, 1.0)
        if d:
            out.append('<path d="%s"/>' % d)
    return out


def svg(M, E, lb, cols, D, S, Fr, env, mapf, q, k):
    defs = ['<filter id="pb" x="-2%%" y="-2%%" width="104%%" height="104%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('pblur', .2)),
            '<filter id="sb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('blur', .8)),
            '<filter id="hb" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="%s"/></filter>' % svgkit.fmt(F('hblur', .5))]
    sel = E['body']
    step = F('step', 1.0) * k
    svgkit.RDP_EPS = F('rdp', .3); svgkit.AREA_MIN = F('amin', .5) * k * k
    sil = svgkit.contour_paths(cv2.GaussianBlur(sel.astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
    defs.append('<clipPath id="kb"><path d="%s"/></clipPath>' % sil)
    K = len(cols)
    area = np.array([(lb == i).sum() for i in range(K)])
    base = int(area.argmax())
    # the paint: the largest area under, each other colour on top, grown a little under its neighbours (no hairline gaps)
    # the paint is laid at the light of the lit side (D = dref): nearly everything else is darkened by the shade layers, so the
    # light layers only carry the glaze's reflections (white over a colour greys it)
    dref = float(np.percentile(D[sel], F('dpct', 85)))
    cols = np.clip(cols * dref, 0, 1)
    D = D / dref
    paint = ['<path fill="%s" d="%s"/>' % (svgkit.hexc(cols[base] * 255), sil)]
    grow = max(1, int(round(F('grow', .4) * k)))
    np_ = 0
    for i in np.argsort(-area):
        if i == base or area[i] < 2 * k * k:
            continue
        s_ = cv2.dilate((lb == i).astype(np.uint8), np.ones((2 * grow + 1,) * 2, np.uint8)).astype(bool) & sel
        d = svgkit.contour_paths(cv2.GaussianBlur(s_.astype(np.float32), (0, 0), .6), .5, step, q, mapf, 1.0)
        if d:
            paint.append('<path fill="%s" d="%s"/>' % (svgkit.hexc(cols[i] * 255), d)); np_ += 1
    # the shade: nested dark layers of opacity a, (1 - a)^n = D where D < 1
    a = F('sh_a', .08)
    sh = nested(np.log(np.clip(D, .03, 1)) / np.log(1 - a), sel, 30, step * 1.5, q, mapf, k)
    shade = '<g fill="%s" fill-opacity="%s" filter="url(#sb)">%s</g>' % (OPT.get('shcol', '#0d1018'), svgkit.fmt(a), ''.join(sh))
    # the surroundings at grazing angles: layers of their colour, (1 - e)^n = 1 - Fr
    e_ = F('env_a', .14)
    ev = nested(np.log(np.clip(1 - Fr, .02, 1)) / np.log(1 - e_), sel, 25, step, q, mapf, k)
    envg = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (svgkit.hexc(env * 255), svgkit.fmt(e_), ''.join(ev))
    # the light: where D > 1 and the glaze's reflections, nested light layers of opacity b, c + (1 - c)(1 - (1 - b)^n)
    c0 = cols[np.maximum(lb, 0)] * np.minimum(D, 1)[..., None]
    c0 = c0 * (1 - Fr[..., None]) + env * Fr[..., None]
    add = S + (cols[np.maximum(lb, 0)] @ np.array([.3, .59, .11])) * np.maximum(D - 1, 0)
    Yc = np.clip(c0 @ np.array([.3, .59, .11]), 0, .97)
    frac = np.clip(add / np.maximum(1 - Yc, .03), 0, .985)
    b = F('hl_b', .15)
    hl = nested(np.log(1 - frac) / np.log(1 - b), sel, 26, step, q, mapf, k)
    light = '<g fill="%s" fill-opacity="%s" filter="url(#hb)">%s</g>' % (OPT.get('hlcol', '#fbfbf8'), svgkit.fmt(b), ''.join(hl))
    bodyg = '<g clip-path="url(#kb)"><g filter="url(#pb)">%s</g>%s%s%s</g>' % (''.join(paint), shade, envg, light)
    mouth = ''
    if E['inside'].sum() > 10:
        din = svgkit.contour_paths(cv2.GaussianBlur(E['inside'].astype(np.float32), (0, 0), .7), .5, step, q, mapf, 1.0)
        mouth = '<path fill="%s" d="%s"/>' % (OPT.get('incol', '#07080e'), din)
    log('svg: %d paint areas, %d shade, %d surroundings, %d light layers' % (np_, len(sh), len(ev), len(hl)))
    return defs, bodyg, mouth


def main():
    M = load(VIEW)
    H, W = M['mask'].shape
    if VIEW == 'shop':
        k = H / ((HCM + 2) * svgkit.UPC)
        ys = np.where(M['mask'].any(1))[0]; yfoot = ys.max() + 1
        mapf = lambda x, y: (svgkit.VX + (x - W / 2) / k, svgkit.FL - (yfoot - y) / k)
        q = F('q', .05)
    else:
        k = 1.0; mapf = lambda x, y: (x, y); q = F('q', .1)
    n, E = body(M)
    lb = paint_labels(M, E)
    pal = json.load(open(os.path.join(OUT, 'paint.json')))
    cols = np.array([hexrgb(c) for c in pal['colours']])
    D, S = lighting(M, E, n)
    Fr = fresnel(n)
    env = hexrgb(OPT.get('env', '#1d2440' if VIEW == 'photo' else '#ebe7df'))   # the photograph's navy backdrop; the shop's light one
    img = compose(M, E, lb, cols, D, S, Fr, env)
    cv2.imwrite(os.path.join(OUT, 'field_%s.png' % VIEW), (img[..., ::-1] * 255).astype(np.uint8))
    log('field')
    if F('svg', 1) <= 0:
        return
    defs, bodyg, mouth = svg(M, E, lb, cols, D, S, Fr, env, mapf, q, k)
    if VIEW == 'shop':
        x0, y0 = mapf(0, 0); x1, y1 = mapf(W, H); vb = '%g %g %g %g' % (x0, y0, x1 - x0, y1 - y0)
    else:
        vb = '0 0 %d %d' % (W, H)
    doc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s<g id="vase">%s</g></svg>' % (vb, ''.join(defs), mouth, bodyg)
    open(os.path.join(OUT, 'perce_%s.svg' % VIEW), 'w').write(doc)
    log('svg %.0f Ko' % (len(doc) / 1024))
    if VIEW == 'shop':
        import gzip
        d = svgkit.write_body(os.path.join(OUT, 'body.json'), ''.join(defs), bodyg, mouth=mouth)
        js = json.dumps(d, separators=(',', ':')).encode()
        log('body.json %.0f Ko, gzip %.1f Ko' % (len(js) / 1024, len(gzip.compress(js, 9)) / 1024))


if __name__ == '__main__':
    main()
