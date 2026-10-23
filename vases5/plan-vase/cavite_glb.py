"""The cavity of a sculpted vessel measured on its GLB (step 6 of the vessel plan): what z7-plan's vPlan cannot read on a profile whose
top is the sculpture. The model is cut by horizontal planes (trimesh mesh_plane, numpy only); at each height the cavity's axis is the point
of the hollow farthest from every wall, its radius the mean of 48 rays from that axis to the inner wall, its floor the height where that
axis enters the material. Heights in shop units (scale 1: the model's height 1 is the vessel's h), x of the axis in shop units from the
vessel's axis (the model turned by the shop view's yaw, its sign taken from compo.py's mouth).
  .venv-depth/Scripts/python <this> <vase dir> <vessel id>   (the GLB read from the main atelier's vases5/<dir>/out, never written)
  -> vases5/plan-vase/cavites/<vessel id>.json"""
import sys, os, json, math
import numpy as np, trimesh

ATELIER = 'C:/Users/agent/Desktop/flower/flower-atelier'
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ATELIER, 'vases5'))
import glbkit  # noqa: E402  (its Model: the vessel standing on y = 0, centred on its axis, height 1)

DIR, VID = sys.argv[1], sys.argv[2]
OUT = os.path.join(ATELIER, 'vases5', DIR, 'out')
M = glbkit.Model(os.path.join(OUT, 'model.glb'))
mesh = trimesh.Trimesh(vertices=M.v.astype(np.float64), faces=M.f, process=False)
compo = json.load(open(os.path.join(OUT, 'compo.json')))
pose = json.load(open(os.path.join(OUT, 'glb_pose.json')))


def vz_entry(vid):
    s = open(os.path.join(HERE, '..', '..', 'app', 'v0.js'), encoding='utf8').read()
    a = s.index('[', s.index('VZ0='))
    d = 0
    for i in range(a, len(s)):
        d += s[i] == '['
        d -= s[i] == ']'
        if not d:
            break
    return next(v for v in json.loads(s[a:i + 1]) if v['id'] == vid)


V = vz_entry(VID)
U = float(V['h'])            # shop units per model unit (the model's height is the vessel's)


def section(h):
    """the cut at height h: segments (n, 2, 2) in x, z"""
    s = trimesh.intersections.mesh_plane(mesh, [0, 1, 0], [0, h, 0])
    return np.asarray(s)[:, :, [0, 2]] if len(s) else np.zeros((0, 2, 2))


def ray_hits(S, p, d):
    """distances from p along unit direction d to every segment it crosses"""
    a, b = S[:, 0], S[:, 1]
    e = b - a
    den = d[0] * e[:, 1] - d[1] * e[:, 0]
    ok = np.abs(den) > 1e-12
    w = a - p
    t = (w[:, 0] * e[:, 1] - w[:, 1] * e[:, 0]) / np.where(ok, den, 1)
    u = (w[:, 0] * d[1] - w[:, 1] * d[0]) / np.where(ok, den, 1)
    m = ok & (t > 1e-9) & (u >= 0) & (u <= 1)
    return np.sort(t[m])


def seg_dist(S, P):
    """distance from each point of P (k, 2) to the nearest segment"""
    a, b = S[:, 0][None], S[:, 1][None]
    e = b - a
    w = P[:, None] - a
    t = np.clip((w * e).sum(-1) / np.maximum((e * e).sum(-1), 1e-12), 0, 1)
    q = a + t[..., None] * e
    return np.sqrt(((P[:, None] - q) ** 2).sum(-1)).min(1)


ANG = np.linspace(0, 2 * math.pi, 48, endpoint=False)
DIRS = np.c_[np.cos(ANG), np.sin(ANG)]


def hollow_at(S, c0, span, n=45, openmax=.3):
    """the point of the hollow near c0 (within span) farthest from every wall, walled on at least 1 - openmax of its sides (a spathe's
    throat is open in front), in the air (even crossings on the walled sides); its radius (rms of the rays that meet a wall), the
    centroid of the wall it sees and the share left open; None when the axis stands in the material or the hollow is too open"""
    g = np.linspace(-span, span, n)
    P = np.array([[c0[0] + x, c0[1] + z] for x in g for z in g])
    dist = seg_dist(S, P)
    for j in np.argsort(-dist)[:60]:
        p = P[j]
        hits = [ray_hits(S, p, d) for d in DIRS]
        walled = [k for k, h in enumerate(hits) if len(h)]
        if len(walled) < (1 - openmax) * len(DIRS):
            continue                                   # too open: outside the vessel
        par = [len(hits[k]) % 2 for k in walled]
        if sum(par) > len(par) / 2:
            continue                                   # odd crossings on most sides: inside the material
        r = np.array([hits[k][0] for k in walled])
        wall = p + DIRS[walled] * r[:, None]
        return p, float(np.sqrt((r ** 2).mean())), wall.mean(0)
    return None


# the rim: compo's mouth height, in model units; the axis starts at the vessel's axis and follows the hollow down
rim = compo['mh'] / U
c = np.array([0.0, 0.0])
rows = []
step = .006
h = rim - step
first = None
while h > step:
    S = section(h)
    if not len(S):
        break
    got = hollow_at(S, c, .22 if first is None else .04)
    if got is None:
        if first is None:
            h -= step
            continue
        break
    p, r, wc = got
    first = first or h
    c = p
    rows.append([h, r, float(wc[0]), float(wc[1])])
    h -= step
if not rows:
    print(VID, 'no hollow found under the rim at', round(rim, 3))
    sys.exit(1)
floor = rows[-1][0] - step / 2
# shop x of the hollow's centre: the model turned by the shop view's yaw; the sign that puts the top of the hollow where compo's mouth is
yaw = math.radians(pose['cam']['yaw'])
xs = {sg: [(x * math.cos(yaw) + sg * z * math.sin(yaw)) * U for (_, _, x, z) in rows] for sg in (1, -1)}
sg = min((1, -1), key=lambda s: abs(xs[s][0] - compo['mx']))
cav = [[round(hh * U, 1), round(r * U, 1), round(x, 1)] for (hh, r, _, _), x in zip(rows, xs[sg])][::-1]
res = dict(id=VID, dir=DIR, U=U, rim=round(rim * U, 1), yF=round(floor * U, 1), mh=compo['mh'], mx=compo['mx'], first=round(first * U, 1),
           cav=cav, n=len(cav), note='measured on the GLB (cavite_glb.py), shop units at scale 1')
os.makedirs(os.path.join(HERE, 'cavites'), exist_ok=True)
json.dump(res, open(os.path.join(HERE, 'cavites', VID + '.json'), 'w'), indent=0)
rr = [q[1] for q in cav]
print('%s: floor %.1f, top of the hollow %.1f (mouth mh %.1f), depth %.1f cm, radius %.1f..%.1f cm, axis x %.1f..%.1f' % (
    VID, res['yF'], res['first'], compo['mh'], (res['first'] - res['yF']) / 6.5, min(rr) / 6.5, max(rr) / 6.5, min(q[2] for q in cav), max(q[2] for q in cav)))
