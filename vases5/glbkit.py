# A textured 3D model (GLB, e.g. from Meshy) used as a MEASURING tool for a vase, never as the product (the product stays SVG):
# it is rendered off screen, from any camera, into exact maps - silhouette, depth, normals, the model's own colour texture,
# its texture coordinates - so the SVG generator works on true geometry instead of a depth guessed from one photograph.
#   .venv-depth/Scripts/python glbkit.py fit <vase> [gold|lab]  pose of the model in the photograph (camera pitch, field of view,
#                                                              turn about the axis, scale, shift) -> <vase>/out/glb_pose.json
#   .venv-depth/Scripts/python glbkit.py maps <vase> [photo|shop]  maps in that view -> <vase>/out/glb_<view>_*.npy / .png
# The model sits in <vase>/out/model.glb (private, like the photograph).
import sys, os, json, math, time
import numpy as np, cv2, trimesh, moderngl

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)


# ---------------------------------------------------------------- model
class Model:
    def __init__(self, path):
        sc = trimesh.load(path)
        m = trimesh.util.concatenate(list(sc.geometry.values())) if hasattr(sc, 'geometry') else sc
        geo = list(sc.geometry.values())[0] if hasattr(sc, 'geometry') else sc
        v = np.asarray(m.vertices, np.float32)
        lo, hi = v.min(0), v.max(0)
        # stand the vessel on y = 0, centred on its axis (the mean of its widest band), height 1
        self.h = float(hi[1] - lo[1])
        band = v[(v[:, 1] > lo[1] + .3 * self.h) & (v[:, 1] < lo[1] + .7 * self.h)]
        c = np.array([(band[:, 0].min() + band[:, 0].max()) / 2, lo[1], (band[:, 2].min() + band[:, 2].max()) / 2], np.float32)
        self.v = (v - c) / self.h
        self.f = np.asarray(m.faces, np.int32)
        self.n = np.asarray(m.vertex_normals, np.float32)
        self.uv = np.asarray(m.visual.uv, np.float32) if getattr(m.visual, 'uv', None) is not None else np.zeros((len(v), 2), np.float32)
        mat = geo.visual.material
        tex = lambda t: None if t is None else np.asarray(t.convert('RGBA'))
        self.base = tex(getattr(mat, 'baseColorTexture', None))
        self.mr = tex(getattr(mat, 'metallicRoughnessTexture', None))
        self.nt = tex(getattr(mat, 'normalTexture', None))


VS = '''#version 330
uniform mat4 mvp; uniform mat4 mv;
in vec3 pos; in vec3 nrm; in vec2 uv;
out vec3 vn; out vec2 vuv; out float vz; out vec3 vp;
void main(){ vec4 p = mv * vec4(pos, 1.0); vz = -p.z; vn = mat3(mv) * nrm; vuv = uv; vp = pos; gl_Position = mvp * vec4(pos, 1.0); }'''
FS = '''#version 330
uniform sampler2D base; uniform sampler2D mr; uniform int mode;
in vec3 vn; in vec2 vuv; in float vz; in vec3 vp;
out vec4 o;
void main(){
  vec3 n = normalize(vn); if (!gl_FrontFacing) n = -n;
  if (mode == 0) o = vec4(texture(base, vuv).rgb, 1.0);
  else if (mode == 1) o = vec4(n, 1.0);
  else if (mode == 2) o = vec4(vz, vuv, 1.0);
  else if (mode == 3) o = vec4(texture(mr, vuv).rgb, 1.0);
  else o = vec4(vp, 1.0);
}'''


class Renderer:
    def __init__(self, model):
        self.m = model
        self.ctx = moderngl.create_standalone_context()
        self.prog = self.ctx.program(vertex_shader=VS, fragment_shader=FS)
        vbo = self.ctx.buffer(np.hstack([model.v, model.n, model.uv]).astype('f4').tobytes())
        ibo = self.ctx.buffer(model.f.astype('i4').tobytes())
        self.vao = self.ctx.vertex_array(self.prog, [(vbo, '3f 3f 2f', 'pos', 'nrm', 'uv')], ibo)
        def t(img, unit):
            if img is None:
                img = np.full((4, 4, 4), 128, np.uint8)
            img = np.ascontiguousarray(img[::-1])        # trimesh gives v up, the image is stored top row first
            tx = self.ctx.texture((img.shape[1], img.shape[0]), 4, img.tobytes())
            tx.build_mipmaps(); tx.filter = (moderngl.LINEAR_MIPMAP_LINEAR, moderngl.LINEAR)
            tx.use(unit); return tx
        self.tb, self.tm = t(model.base, 0), t(model.mr, 1)
        self.prog['base'].value = 0; self.prog['mr'].value = 1

    def render(self, cam, W, H, modes=(0, 1, 2)):
        """cam: dict(yaw, pitch (deg, eye above), dist (model heights), fpx (focal, px), cx, cy (where the axis foot projects), roll)"""
        fbo = self.ctx.framebuffer(self.ctx.texture((W, H), 4, dtype='f4'), self.ctx.depth_renderbuffer((W, H)))
        fbo.use(); self.ctx.enable(moderngl.DEPTH_TEST)
        mv, proj = view_matrices(cam, W, H)
        self.prog['mv'].write(mv.T.astype('f4').tobytes()); self.prog['mvp'].write((proj @ mv).T.astype('f4').tobytes())
        out = {}
        for md in modes:
            fbo.clear(0, 0, 0, 0)
            self.prog['mode'].value = md
            self.vao.render()
            a = np.frombuffer(fbo.color_attachments[0].read(), np.float32).reshape(H, W, 4)[::-1].copy()
            out[md] = a
        fbo.release()
        res = dict(mask=out[next(iter(out))][..., 3] > .5)
        if 0 in out: res['albedo'] = out[0][..., :3]
        if 1 in out: res['normal'] = out[1][..., :3] * np.array([1, -1, 1], np.float32)   # screen frame: x right, y down, z to the eye
        if 2 in out: res['depth'] = out[2][..., 0]; res['uv'] = out[2][..., 1:3]
        if 3 in out: res['mr'] = out[3][..., :3]
        if 4 in out: res['pos'] = out[4][..., :3]                    # model space: y up from the foot, axis at x = z = 0
        return res


def view_matrices(cam, W, H):
    yaw, pitch, roll = (math.radians(cam.get(k, 0)) for k in ('yaw', 'pitch', 'roll'))
    D, f = cam['dist'], cam['fpx']
    Ry = np.array([[math.cos(yaw), 0, math.sin(yaw), 0], [0, 1, 0, 0], [-math.sin(yaw), 0, math.cos(yaw), 0], [0, 0, 0, 1]])
    # the eye looks at the point of the axis at height ty (model units), from 'pitch' above the horizontal
    ty = cam.get('ty', .5)
    T0 = np.eye(4); T0[1, 3] = -ty
    Rx = np.array([[1, 0, 0, 0], [0, math.cos(pitch), -math.sin(pitch), 0], [0, math.sin(pitch), math.cos(pitch), 0], [0, 0, 0, 1]])
    Rz = np.array([[math.cos(roll), -math.sin(roll), 0, 0], [math.sin(roll), math.cos(roll), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])
    T1 = np.eye(4); T1[2, 3] = -D
    S = np.diag([cam.get('sx', 1.0), 1.0, cam.get('sx', 1.0), 1.0])
    mv = T1 @ Rz @ Rx @ T0 @ Ry @ S
    n_, f_ = max(.01, D - 2), D + 2
    cx, cy = cam.get('cx', W / 2), cam.get('cy', H / 2)
    proj = np.array([[2 * f / W, 0, 1 - 2 * cx / W, 0], [0, 2 * f / H, 2 * cy / H - 1, 0],
                     [0, 0, -(f_ + n_) / (f_ - n_), -2 * f_ * n_ / (f_ - n_)], [0, 0, -1, 0]])
    return mv, proj


# ---------------------------------------------------------------- pose in the photograph
def lab(img):
    import mesure
    return mesure.to_lab(img)


def fit(vase):
    import mesure
    out = os.path.join(HERE, vase, 'out')
    ph = cv2.imread(os.path.join(out, 'ref.jpg'))
    H, W = ph.shape[:2]
    mpath = os.path.join(out, 'mask.png')
    pm = cv2.imread(mpath, 0) > 127 if os.path.exists(mpath) else mesure.silhouette(ph)
    model = Model(os.path.join(out, 'model.glb'))
    R = Renderer(model)
    ys, xs = np.where(pm)
    t0 = time.time()

    def place(cam):
        """scale and shift the camera so the model's silhouette box matches the photograph's (height and foot)"""
        r = R.render(cam, W, H, modes=(2,))
        my, mx = np.where(r['mask'])
        if len(my) < 50:
            return cam, 0.0
        k = (ys.max() - ys.min()) / max(1, my.max() - my.min())
        cam = dict(cam, fpx=cam['fpx'] * k)
        r = R.render(cam, W, H, modes=(2,))
        my, mx = np.where(r['mask'])
        cam['cx'] += (xs.min() + xs.max()) / 2 - (mx.min() + mx.max()) / 2
        cam['cy'] -= ys.max() - my.max()
        r = R.render(cam, W, H, modes=(2,))
        iou = (r['mask'] & pm).sum() / max(1, (r['mask'] | pm).sum())
        return cam, float(iou)

    # 1. the camera from the silhouette alone (the jar turns about its axis, so the turn is left for the decor)
    best = None
    for fov in (12, 18, 26, 36):                                    # vertical field of view, degrees
        for pitch in range(-6, 31, 3):
            D = .5 / math.tan(math.radians(fov / 2)) * 1.6
            cam = dict(yaw=0, pitch=pitch, dist=D, fpx=H / 2 / math.tan(math.radians(fov / 2)), cx=W / 2, cy=H / 2, ty=.5)
            cam, iou = place(cam)
            if best is None or iou > best[1]:
                best = (cam, iou)
    cam, iou = best
    for pitch in np.arange(cam['pitch'] - 2.5, cam['pitch'] + 2.6, .5):
        c2, i2 = place(dict(cam, pitch=float(pitch)))
        if i2 > iou:
            cam, iou = c2, i2
    for sx in np.arange(.86, 1.141, .02):
        c2, i2 = place(dict(cam, sx=float(sx)))
        if i2 > iou:
            cam, iou = c2, i2
    for pitch in np.arange(cam['pitch'] - 3, cam['pitch'] + 3.1, .5):
        c2, i2 = place(dict(cam, pitch=float(pitch)))
        if i2 > iou:
            cam, iou = c2, i2
    print('camera: stretch %.2f,' % cam.get('sx', 1), end=' ')
    print('camera: pitch %.1f deg, focal %.0f px, silhouette IoU %.4f (%.0fs)' % (cam['pitch'], cam['fpx'], iou, time.time() - t0))
    # 2. the turn about the axis from the decor: where the model's gold matches the photograph's gold (low red, against the brown)
    pl = lab(cv2.GaussianBlur(ph, (0, 0), 2))
    # the decor feature: 'gold' (yellow minus red: gold fish high, brown patina low) or 'lab' (lightness and both colour axes,
    # for a painted decor whose pattern is in its colours)
    kind = sys.argv[3] if len(sys.argv) > 3 else 'gold'
    if kind == 'lab':
        feat = lambda L: np.concatenate([L[..., 0].ravel() / 20, L[..., 1].ravel() / 8, L[..., 2].ravel() / 8])
        inner_ = lambda s: np.concatenate([s.ravel()] * 3)
    else:
        feat = lambda L: L[..., 2] - 1.2 * L[..., 1]
        inner_ = lambda s: s
    fp = feat(pl)
    inner = cv2.erode(pm.astype(np.uint8), np.ones((15, 15), np.uint8)) > 0

    def score(yaw, mirror=False):
        r = R.render(dict(cam, yaw=yaw), W, H, modes=(0,))
        a = r['albedo'][..., ::-1]
        if mirror:
            a = a[:, ::-1]
        ml = lab(np.clip(cv2.GaussianBlur(a, (0, 0), 2) * 255, 0, 255).astype(np.uint8))
        fm = feat(ml)
        sel = inner_(inner & (r['mask'][:, ::-1] if mirror else r['mask']))
        x, y = fp[sel], fm[sel]
        x, y = x - x.mean(), y - y.mean()
        return float((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-9))

    sc = [(score(float(y)), float(y)) for y in range(0, 360, 4)]
    s, yaw = max(sc)
    for y in np.arange(yaw - 4, yaw + 4.01, .5):
        s2 = score(float(y))
        if s2 > s:
            s, yaw = s2, float(y)
    cam['yaw'] = yaw
    print('turn: %.1f deg, decor correlation %.3f (%.0fs)' % (yaw, s, time.time() - t0))
    curve = [[round(y), round(v, 3)] for v, y in sc]
    json.dump(dict(cam=cam, silhouette_iou=iou, decor_corr=s, yaw_curve=curve, W=W, H=H), open(os.path.join(out, 'glb_pose.json'), 'w'), indent=1)
    return cam


def maps(vase, view='photo'):
    out = os.path.join(HERE, vase, 'out')
    P = json.load(open(os.path.join(out, 'glb_pose.json')))
    cam, W, H = P['cam'], P['W'], P['H']
    model = Model(os.path.join(out, 'model.glb'))
    R = Renderer(model)
    if view == 'shop':
        # the shop: the same turn, the eye 9.2 deg above (circle ratio .16), far away (nearly orthographic), the vessel's height
        # = its real height in shop units, its foot on FL
        import svgkit
        hcm = float(sys.argv[4]) if len(sys.argv) > 4 else 26.0
        k = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0            # pixels per shop unit
        Hs = int(round((hcm + 2) * svgkit.UPC * k)); Ws = int(Hs * 1.6)          # wide enough for a jar wider than high
        D = 40.0
        cam = dict(yaw=cam['yaw'], pitch=math.degrees(math.asin(svgkit.RY)), dist=D, fpx=hcm * svgkit.UPC * k * D, cx=Ws / 2, cy=Hs / 2, ty=.5)
        W, H = Ws, Hs
    r = R.render(cam, W, H, modes=(0, 1, 2, 3, 4))
    for k in ('albedo', 'normal', 'depth', 'mr', 'pos', 'uv'):
        np.save(os.path.join(out, 'glb_%s_%s.npy' % (view, k)), r[k].astype(np.float32))
    np.save(os.path.join(out, 'glb_%s_mask.npy' % view), r['mask'])
    json.dump(dict(cam=cam, W=W, H=H), open(os.path.join(out, 'glb_%s_cam.json' % view), 'w'))
    a = np.clip(r['albedo'][..., ::-1] * 255, 0, 255).astype(np.uint8); a[~r['mask']] = 235
    nrm = ((r['normal'] * np.array([1, -1, 1]) * .5 + .5) * 255).clip(0, 255).astype(np.uint8)[..., ::-1]; nrm[~r['mask']] = 235
    d = r['depth'].copy(); dm = d[r['mask']]
    dv = np.zeros_like(d) if dm.size == 0 else (1 - (d - dm.min()) / (np.ptp(dm) + 1e-9))
    dv = cv2.applyColorMap((np.clip(dv, 0, 1) * 255).astype(np.uint8), cv2.COLORMAP_TURBO); dv[~r['mask']] = 235
    cv2.imwrite(os.path.join(out, 'glb_%s_albedo.png' % view), a)
    cv2.imwrite(os.path.join(out, 'glb_%s_normal.png' % view), nrm)
    cv2.imwrite(os.path.join(out, 'glb_%s_depth.png' % view), dv)
    print(view, W, H, 'pixels', int(r['mask'].sum()))
    return r


if __name__ == '__main__':
    if sys.argv[1] == 'fit':
        fit(sys.argv[2])
    elif sys.argv[1] == 'maps':
        maps(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'photo')
