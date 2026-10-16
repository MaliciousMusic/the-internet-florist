# The snowdrop vase's shadow on the shop's floor, from its turned body: every horizontal slice is a disc, and the shop's light
# throws it on the floor where the engine's shadows fall (vShadow in app/v1b.js: a point at height y lands .62 y to the right
# and .1 y up on the screen). The union of these flattened discs is the shadow's true outline (foot, waist, shoulder, neck),
# not a band of the half widths. It darkens near the foot and fades and softens away from it. Written into out/body.json as
# "shadow" (the engine draws it in place of vShadow, app/v1f.js).
#   python shadow.py [op=.3 far=.1 pen0=.6 pen1=4 layers=4]
import os, sys, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..'))
import svgkit  # noqa: E402
OUT = os.path.join(HERE, 'out')
O = dict(a.split('=') for a in sys.argv[1:] if '=' in a)
G = lambda k, d: float(O.get(k, d))
KX, KY = .62, .1                                                     # the engine's light (vShadow)
fiche = json.load(open(os.path.join(OUT, 'fiche.json'), encoding='utf-8'))
P = np.array(fiche['prof'], float); H = fiche['h']
k = 4.0                                                              # raster pixels per shop unit
wmax = P[:, 1].max()
x0, x1 = svgkit.VX - wmax - 10, svgkit.VX + H * KX + wmax + 10
y0, y1 = svgkit.FL - H * KY - wmax * svgkit.RY - 10, svgkit.FL + wmax * svgkit.RY + 10
W_, H_ = int((x1 - x0) * k), int((y1 - y0) * k)
m = np.zeros((H_, W_), np.uint8)
for y in np.arange(0, H, .5):
    r = np.interp(y, P[:, 0], P[:, 1])
    cx, cy = svgkit.VX + y * KX, svgkit.FL - y * KY
    cv2.ellipse(m, (int(round((cx - x0) * k * 4)), int(round((cy - y0) * k * 4))),
                (int(round(r * k * 4)), int(round(r * svgkit.RY * k * 4))), 0, 0, 360, 255, -1, cv2.LINE_AA, shift=2)
mapf = lambda x, y: (x0 + x / k, y0 + y / k)
svgkit.RDP_EPS = .3; svgkit.AREA_MIN = 4
# the penumbra widens away from the foot (a soft light): the mask blurred a little near the foot, more at the far end, mixed
# along the shadow; then cut into nested outlines that stack (no SVG filter: Chrome tiles a long blurred shape, leaving seams)
mf = m.astype(np.float32) / 255
near, farb = G('pen0', .6) * k, G('pen1', 4.0) * k
t = np.clip((np.arange(W_) / k + x0 - svgkit.VX) / (H * KX + wmax), 0, 1)[None, :]
soft = (1 - t) * cv2.GaussianBlur(mf, (0, 0), near) + t * cv2.GaussianBlur(mf, (0, 0), farb)
op, far = G('op', .3), G('far', .1)
NL = int(G('layers', 4))
gx2, gy2 = svgkit.VX + H * KX + wmax, svgkit.FL - H * KY
f = svgkit.fmt
la = 1 - (1 - 1.0) ** (1 / NL)
paths = []
for i in range(NL):
    lev = (i + .5) / NL
    d = svgkit.contour_paths(soft, lev, 2.0, .05, mapf, 1.0)
    if d:
        paths.append('<path d="%s"/>' % d)
# NL stacked layers of opacity a each reach 1 - (1 - a)^NL at the core: a chosen so the core carries the full shadow
a1 = 1 - (1 - op) ** (1 / NL)
shadow = ('<defs><linearGradient id="pnsg" gradientUnits="userSpaceOnUse" x1="%s" y1="%s" x2="%s" y2="%s">'
          '<stop offset="0" stop-color="#1e140e" stop-opacity="%s"/><stop offset=".45" stop-color="#1e140e" stop-opacity="%s"/>'
          '<stop offset="1" stop-color="#1e140e" stop-opacity="%s"/></linearGradient></defs>'
          '<g fill="url(#pnsg)">%s</g>') % (f(svgkit.VX), f(svgkit.FL), f(gx2), f(gy2), f(a1), f(a1 * .55), f(a1 * far), ''.join(paths))
# the contact shadow: where the foot meets the floor no light comes in, a tight dark ring just around the foot's ellipse,
# a little stronger on the side away from the light
rf = float(P[0, 1]); cg = G('contact', .42)
shadow += ('<defs><radialGradient id="pnsc" gradientUnits="userSpaceOnUse" cx="%s" cy="%s" r="%s" gradientTransform="translate(0 %s) scale(1 %s) translate(0 %s)">'
           '<stop offset=".9" stop-color="#140c06" stop-opacity="%s"/><stop offset="1" stop-color="#140c06" stop-opacity="0"/></radialGradient></defs>'
           '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#pnsc)"/>') % (
    f(svgkit.VX + 1.2), f(svgkit.FL), f(rf * 1.1), f(svgkit.FL), f(svgkit.RY), f(-svgkit.FL), f(cg),
    f(svgkit.VX + 1.2), f(svgkit.FL + .4), f(rf * 1.1), f(rf * 1.1 * svgkit.RY))
bp = os.path.join(OUT, 'body.json')
b = json.load(open(bp, encoding='utf-8')); b['shadow'] = shadow
json.dump(b, open(bp, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
v = np.full((H_, W_, 3), 235, np.uint8); v[m > 127] = (150, 140, 135)
cv2.imwrite(os.path.join(OUT, 'shadow_check.png'), v)
print('shadow: %.1f Ko, %d x %d units' % (len(shadow) / 1024, x1 - x0, y1 - y0))
